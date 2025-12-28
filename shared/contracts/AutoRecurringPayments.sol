// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AutoRecurringPayments
 * @dev Advanced recurring payment system with EIP-7715 style permissions
 * Supports automated USDC payments with executor rewards
 */
contract AutoRecurringPayments is Ownable, ReentrancyGuard {
    
    struct PaymentSchedule {
        address payer;
        address recipient;
        uint256 amount;
        uint256 interval; // in seconds
        uint256 nextPayment;
        uint256 maxExecutions;
        uint256 executionsLeft;
        bool isActive;
        uint256 createdAt;
        uint256 executorReward; // Reward for executing the payment
    }
    
    struct UserPermissions {
        uint256 maxAmountPerPayment;
        uint256 maxTotalAmount;
        uint256 totalSpent;
        bool isApproved;
        uint256 approvedUntil;
    }
    
    IERC20 public usdcToken;
    
    mapping(bytes32 => PaymentSchedule) public paymentSchedules;
    mapping(address => UserPermissions) public userPermissions;
    mapping(address => bytes32[]) public userSchedules;
    
    // Global settings
    uint256 public constant MIN_INTERVAL = 10; // 10 seconds minimum
    uint256 public constant MAX_INTERVAL = 365 days;
    uint256 public constant DEFAULT_EXECUTOR_REWARD = 1000000000000000000; // 1 USDC in 18 decimals
    uint256 public constant MIN_EXECUTOR_REWARD = 100000000000000000; // 0.1 USDC minimum in 18 decimals
    
    // Auto-execution tracking
    mapping(bytes32 => uint256) public lastExecutionAttempt;
    uint256 public totalActiveSchedules;
    
    event PermissionGranted(address indexed user, uint256 maxAmountPerPayment, uint256 maxTotalAmount, uint256 validUntil);
    event PaymentScheduleCreated(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, uint256 interval, uint256 maxExecutions, uint256 executorReward);
    event PaymentExecuted(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, address executor, uint256 reward);
    event PaymentScheduleCancelled(bytes32 indexed scheduleId);
    event ExecutorRewarded(address indexed executor, uint256 reward, bytes32 scheduleId);
    
    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
    }
    
    /**
     * @dev Grant permissions for recurring payments (EIP-7715 style)
     */
    function grantPermissions(
        uint256 _maxAmountPerPayment,
        uint256 _maxTotalAmount,
        uint256 _validForDays
    ) external {
        require(_maxAmountPerPayment > 0, "Max amount must be greater than 0");
        require(_maxTotalAmount >= _maxAmountPerPayment, "Total amount must be >= per payment amount");
        require(_validForDays > 0 && _validForDays <= 365, "Valid days must be between 1 and 365");
        
        userPermissions[msg.sender] = UserPermissions({
            maxAmountPerPayment: _maxAmountPerPayment,
            maxTotalAmount: _maxTotalAmount,
            totalSpent: 0,
            isApproved: true,
            approvedUntil: block.timestamp + (_validForDays * 1 days)
        });
        
        emit PermissionGranted(msg.sender, _maxAmountPerPayment, _maxTotalAmount, block.timestamp + (_validForDays * 1 days));
    }
    
    /**
     * @dev Create a recurring payment schedule
     */
    function createPaymentSchedule(
        address _recipient,
        uint256 _amount,
        uint256 _interval,
        uint256 _maxExecutions
    ) external nonReentrant returns (bytes32) {
        return createPaymentScheduleWithReward(_recipient, _amount, _interval, _maxExecutions, DEFAULT_EXECUTOR_REWARD);
    }
    
    /**
     * @dev Create a recurring payment schedule with custom executor reward
     */
    function createPaymentScheduleWithReward(
        address _recipient,
        uint256 _amount,
        uint256 _interval,
        uint256 _maxExecutions,
        uint256 _executorReward
    ) public returns (bytes32) {
        require(_recipient != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be greater than 0");
        require(_interval >= MIN_INTERVAL && _interval <= MAX_INTERVAL, "Invalid interval");
        require(_maxExecutions > 0 && _maxExecutions <= 1000, "Invalid max executions");
        require(_executorReward >= MIN_EXECUTOR_REWARD, "Executor reward too low");
        
        // Check user permissions
        UserPermissions storage permissions = userPermissions[msg.sender];
        require(permissions.isApproved, "Permissions not granted");
        require(block.timestamp <= permissions.approvedUntil, "Permissions expired");
        require(_amount <= permissions.maxAmountPerPayment, "Amount exceeds per-payment limit");
        
        // Calculate total cost including executor rewards
        uint256 totalPaymentCost = _amount * _maxExecutions;
        uint256 totalRewardCost = _executorReward * _maxExecutions;
        uint256 totalCost = totalPaymentCost + totalRewardCost;
        
        require(permissions.totalSpent + totalPaymentCost <= permissions.maxTotalAmount, "Would exceed total spending limit");
        
        // Check USDC allowance for total cost (payments + rewards)
        require(usdcToken.allowance(msg.sender, address(this)) >= totalCost, "Insufficient USDC allowance for payments and rewards");
        
        // Create schedule ID
        bytes32 scheduleId = keccak256(abi.encodePacked(msg.sender, _recipient, _amount, _interval, block.timestamp, _executorReward));
        
        paymentSchedules[scheduleId] = PaymentSchedule({
            payer: msg.sender,
            recipient: _recipient,
            amount: _amount,
            interval: _interval,
            nextPayment: block.timestamp + _interval, // First payment after full interval
            maxExecutions: _maxExecutions,
            executionsLeft: _maxExecutions,
            isActive: true,
            createdAt: block.timestamp,
            executorReward: _executorReward
        });
        
        userSchedules[msg.sender].push(scheduleId);
        totalActiveSchedules++;
        
        emit PaymentScheduleCreated(scheduleId, msg.sender, _recipient, _amount, _interval, _maxExecutions, _executorReward);
        return scheduleId;
    }
    
    /**
     * @dev Execute a recurring payment (can be called by anyone to earn rewards)
     */
    function executePayment(bytes32 _scheduleId) external nonReentrant {
        PaymentSchedule storage schedule = paymentSchedules[_scheduleId];
        require(schedule.isActive, "Schedule not active");
        require(block.timestamp >= schedule.nextPayment, "Payment not due yet");
        require(schedule.executionsLeft > 0, "No executions left");
        
        // Prevent spam by limiting execution attempts
        require(block.timestamp >= lastExecutionAttempt[_scheduleId] + 10, "Too frequent execution attempts");
        lastExecutionAttempt[_scheduleId] = block.timestamp;
        
        // Check user still has permissions and allowance
        UserPermissions storage permissions = userPermissions[schedule.payer];
        require(permissions.isApproved, "User permissions revoked");
        require(block.timestamp <= permissions.approvedUntil, "User permissions expired");
        require(permissions.totalSpent + schedule.amount <= permissions.maxTotalAmount, "Would exceed user's total limit");
        
        // Check USDC allowance for payment + reward
        uint256 totalRequired = schedule.amount + schedule.executorReward;
        require(usdcToken.allowance(schedule.payer, address(this)) >= totalRequired, "Insufficient USDC allowance");
        
        // Execute payment: take USDC from payer, send to recipient
        require(usdcToken.transferFrom(schedule.payer, schedule.recipient, schedule.amount), "Payment transfer failed");
        
        // Pay executor reward
        require(usdcToken.transferFrom(schedule.payer, msg.sender, schedule.executorReward), "Executor reward transfer failed");
        
        // Update state
        permissions.totalSpent += schedule.amount;
        schedule.executionsLeft--;
        schedule.nextPayment = block.timestamp + schedule.interval;
        
        if (schedule.executionsLeft == 0) {
            schedule.isActive = false;
            totalActiveSchedules--;
        }
        
        emit PaymentExecuted(_scheduleId, schedule.payer, schedule.recipient, schedule.amount, msg.sender, schedule.executorReward);
        emit ExecutorRewarded(msg.sender, schedule.executorReward, _scheduleId);
    }
    
    /**
     * @dev Cancel a payment schedule
     */
    function cancelPaymentSchedule(bytes32 _scheduleId) external {
        PaymentSchedule storage schedule = paymentSchedules[_scheduleId];
        require(schedule.payer == msg.sender, "Only payer can cancel");
        require(schedule.isActive, "Schedule not active");
        
        schedule.isActive = false;
        totalActiveSchedules--;
        emit PaymentScheduleCancelled(_scheduleId);
    }
    
    /**
     * @dev Check if a payment is due (public view for executors)
     */
    function isPaymentDue(bytes32 _scheduleId) external view returns (bool) {
        PaymentSchedule storage schedule = paymentSchedules[_scheduleId];
        return schedule.isActive && 
               block.timestamp >= schedule.nextPayment && 
               schedule.executionsLeft > 0;
    }
    
    /**
     * @dev Get schedule details
     */
    function getSchedule(bytes32 _scheduleId) external view returns (PaymentSchedule memory) {
        return paymentSchedules[_scheduleId];
    }
    
    /**
     * @dev Get user's active schedules
     */
    function getUserSchedules(address _user) external view returns (bytes32[] memory) {
        return userSchedules[_user];
    }
    
    /**
     * @dev Get user permissions
     */
    function getUserPermissions(address _user) external view returns (UserPermissions memory) {
        return userPermissions[_user];
    }
    
    /**
     * @dev Revoke user permissions (user can revoke their own)
     */
    function revokePermissions() external {
        userPermissions[msg.sender].isApproved = false;
    }
    
    /**
     * @dev Emergency function to pause all executions (owner only)
     */
    function emergencyPause() external onlyOwner {
        // Implementation for emergency pause if needed
    }
    
    /**
     * @dev Get contract statistics
     */
    function getContractStats() external view returns (
        uint256 activeSchedules,
        uint256 totalSchedules,
        address usdcTokenAddress
    ) {
        return (
            totalActiveSchedules,
            totalActiveSchedules, // For now, same as active
            address(usdcToken)
        );
    }
}