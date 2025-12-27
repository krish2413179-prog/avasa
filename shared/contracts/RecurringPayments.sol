// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RecurringPayments
 * @dev Contract for managing recurring USDC payments with user permissions
 */
contract RecurringPayments is Ownable, ReentrancyGuard {
    
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
    
    uint256 public constant MIN_INTERVAL = 30; // 30 seconds minimum
    uint256 public constant MAX_INTERVAL = 365 days;
    
    event PermissionGranted(address indexed user, uint256 maxAmountPerPayment, uint256 maxTotalAmount, uint256 validUntil);
    event PaymentScheduleCreated(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, uint256 interval);
    event PaymentExecuted(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount);
    event PaymentScheduleCancelled(bytes32 indexed scheduleId);
    
    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
    }
    
    /**
     * @dev Grant advanced permissions to a user for recurring payments
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
        require(_recipient != address(0), "Invalid recipient");
        require(_recipient != msg.sender, "Cannot pay yourself");
        require(_amount > 0, "Amount must be greater than 0");
        require(_interval >= MIN_INTERVAL && _interval <= MAX_INTERVAL, "Invalid interval");
        require(_maxExecutions > 0 && _maxExecutions <= 1000, "Invalid max executions");
        
        // Check user permissions
        UserPermissions storage permissions = userPermissions[msg.sender];
        require(permissions.isApproved, "Permissions not granted");
        require(block.timestamp <= permissions.approvedUntil, "Permissions expired");
        require(_amount <= permissions.maxAmountPerPayment, "Amount exceeds per-payment limit");
        
        uint256 totalCost = _amount * _maxExecutions;
        require(permissions.totalSpent + totalCost <= permissions.maxTotalAmount, "Would exceed total spending limit");
        
        // Check USDC allowance
        require(usdcToken.allowance(msg.sender, address(this)) >= totalCost, "Insufficient USDC allowance");
        
        // Create schedule ID
        bytes32 scheduleId = keccak256(abi.encodePacked(msg.sender, _recipient, _amount, _interval, block.timestamp));
        
        paymentSchedules[scheduleId] = PaymentSchedule({
            payer: msg.sender,
            recipient: _recipient,
            amount: _amount,
            interval: _interval,
            nextPayment: block.timestamp + _interval,
            maxExecutions: _maxExecutions,
            executionsLeft: _maxExecutions,
            isActive: true,
            createdAt: block.timestamp
        });
        
        userSchedules[msg.sender].push(scheduleId);
        
        emit PaymentScheduleCreated(scheduleId, msg.sender, _recipient, _amount, _interval);
        return scheduleId;
    }
    
    /**
     * @dev Execute a payment (can be called by anyone)
     */
    function executePayment(bytes32 _scheduleId) external nonReentrant {
        PaymentSchedule storage schedule = paymentSchedules[_scheduleId];
        require(schedule.isActive, "Schedule not active");
        require(block.timestamp >= schedule.nextPayment, "Payment not due yet");
        require(schedule.executionsLeft > 0, "No executions left");
        
        // Check payer still has permissions and allowance
        UserPermissions storage permissions = userPermissions[schedule.payer];
        require(permissions.isApproved, "Payer permissions revoked");
        require(block.timestamp <= permissions.approvedUntil, "Payer permissions expired");
        require(permissions.totalSpent + schedule.amount <= permissions.maxTotalAmount, "Would exceed payer's total limit");
        
        // Check USDC allowance
        require(usdcToken.allowance(schedule.payer, address(this)) >= schedule.amount, "Insufficient USDC allowance");
        
        // Execute payment
        require(usdcToken.transferFrom(schedule.payer, schedule.recipient, schedule.amount), "USDC transfer failed");
        
        // Update state
        permissions.totalSpent += schedule.amount;
        schedule.executionsLeft--;
        schedule.nextPayment = block.timestamp + schedule.interval;
        
        if (schedule.executionsLeft == 0) {
            schedule.isActive = false;
        }
        
        emit PaymentExecuted(_scheduleId, schedule.payer, schedule.recipient, schedule.amount);
    }
    
    /**
     * @dev Cancel a payment schedule
     */
    function cancelPaymentSchedule(bytes32 _scheduleId) external {
        PaymentSchedule storage schedule = paymentSchedules[_scheduleId];
        require(schedule.payer == msg.sender, "Only payer can cancel");
        require(schedule.isActive, "Schedule not active");
        
        schedule.isActive = false;
        emit PaymentScheduleCancelled(_scheduleId);
    }
    
    /**
     * @dev Get user's active schedules
     */
    function getUserSchedules(address _user) external view returns (bytes32[] memory) {
        return userSchedules[_user];
    }
    
    /**
     * @dev Get schedule details
     */
    function getSchedule(bytes32 _scheduleId) external view returns (PaymentSchedule memory) {
        return paymentSchedules[_scheduleId];
    }
    
    /**
     * @dev Check if a payment is due
     */
    function isPaymentDue(bytes32 _scheduleId) external view returns (bool) {
        PaymentSchedule storage schedule = paymentSchedules[_scheduleId];
        return schedule.isActive && 
               block.timestamp >= schedule.nextPayment && 
               schedule.executionsLeft > 0;
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
}