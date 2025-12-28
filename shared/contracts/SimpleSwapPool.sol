// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SimpleSwapPool
 * @dev A simple DEX contract for ETH/USDC swaps with recurring swap support
 * Solves testnet liquidity issues by providing our own liquidity pool
 */
contract SimpleSwapPool is Ownable, ReentrancyGuard {
    
    struct SwapSchedule {
        address user;
        uint256 usdcAmount;
        uint256 interval; // in seconds
        uint256 nextSwap;
        
        uint256 maxExecutions;
        uint256 executionsLeft;
        bool isActive;
        uint256 createdAt;
        uint256 executorReward; // Reward for executing the swap
    }
    
    struct UserPermissions {
        uint256 maxAmountPerSwap;
        uint256 maxTotalAmount;
        uint256 totalSpent;
        bool isApproved;
        uint256 approvedUntil;
    }
    
    IERC20 public usdcToken;
    
    mapping(bytes32 => SwapSchedule) public swapSchedules;
    mapping(address => UserPermissions) public userPermissions;
    mapping(address => bytes32[]) public userSchedules;
    
    // Pool state
    uint256 public ethReserve;
    uint256 public usdcReserve;
    
    // Exchange rate: 1 ETH = 3000 USDC (simplified for testnet)
    uint256 public constant ETH_PRICE_USDC = 3000;
    
    // Global settings
    uint256 public constant MIN_INTERVAL = 30; // 30 seconds minimum
    uint256 public constant MAX_INTERVAL = 365 days;
    uint256 public constant DEFAULT_EXECUTOR_REWARD = 1000000000000000000; // 1 USDC in 18 decimals
    uint256 public constant MIN_EXECUTOR_REWARD = 100000000000000000; // 0.1 USDC minimum in 18 decimals
    
    // Auto-execution tracking
    mapping(bytes32 => uint256) public lastExecutionAttempt;
    uint256 public totalActiveSchedules;
    
    event PermissionGranted(address indexed user, uint256 maxAmountPerSwap, uint256 maxTotalAmount, uint256 validUntil);
    event SwapScheduleCreated(bytes32 indexed scheduleId, address indexed user, uint256 usdcAmount, uint256 interval, uint256 executorReward);
    event SwapExecuted(bytes32 indexed scheduleId, address indexed user, uint256 usdcAmount, uint256 ethAmount, address executor, uint256 reward);
    event InstantSwap(address indexed user, uint256 usdcAmount, uint256 ethAmount);
    event SwapScheduleCancelled(bytes32 indexed scheduleId);
    event ExecutorRewarded(address indexed executor, uint256 reward, bytes32 scheduleId);
    event LiquidityAdded(uint256 ethAmount, uint256 usdcAmount);
    event LiquidityRemoved(uint256 ethAmount, uint256 usdcAmount);
    
    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
    }
    
    /**
     * @dev Add liquidity to the pool (owner only)
     */
    function addLiquidity(uint256 _usdcAmount) external payable onlyOwner {
        require(msg.value > 0, "Must send ETH");
        require(_usdcAmount > 0, "Must provide USDC amount");
        
        // Transfer USDC from owner
        require(usdcToken.transferFrom(msg.sender, address(this), _usdcAmount), "USDC transfer failed");
        
        ethReserve += msg.value;
        usdcReserve += _usdcAmount;
        
        emit LiquidityAdded(msg.value, _usdcAmount);
    }
    
    /**
     * @dev Remove liquidity from the pool (owner only)
     */
    function removeLiquidity(uint256 _ethAmount, uint256 _usdcAmount) external onlyOwner {
        require(_ethAmount <= ethReserve, "Insufficient ETH reserve");
        require(_usdcAmount <= usdcReserve, "Insufficient USDC reserve");
        
        ethReserve -= _ethAmount;
        usdcReserve -= _usdcAmount;
        
        // Transfer ETH and USDC to owner
        payable(owner()).transfer(_ethAmount);
        require(usdcToken.transfer(owner(), _usdcAmount), "USDC transfer failed");
        
        emit LiquidityRemoved(_ethAmount, _usdcAmount);
    }
    
    /**
     * @dev Grant permissions for recurring swaps
     */
    function grantPermissions(
        uint256 _maxAmountPerSwap,
        uint256 _maxTotalAmount,
        uint256 _validForDays
    ) external {
        require(_maxAmountPerSwap > 0, "Max amount must be greater than 0");
        require(_maxTotalAmount >= _maxAmountPerSwap, "Total amount must be >= per swap amount");
        require(_validForDays > 0 && _validForDays <= 365, "Valid days must be between 1 and 365");
        
        userPermissions[msg.sender] = UserPermissions({
            maxAmountPerSwap: _maxAmountPerSwap,
            maxTotalAmount: _maxTotalAmount,
            totalSpent: 0,
            isApproved: true,
            approvedUntil: block.timestamp + (_validForDays * 1 days)
        });
        
        emit PermissionGranted(msg.sender, _maxAmountPerSwap, _maxTotalAmount, block.timestamp + (_validForDays * 1 days));
    }
    
    /**
     * @dev Calculate ETH amount for given USDC amount
     */
    function calculateETHAmount(uint256 _usdcAmount) public pure returns (uint256) {
        // 1 ETH = 3000 USDC, so ETH = USDC / 3000
        return (_usdcAmount * 1e18) / (ETH_PRICE_USDC * 1e18);
    }
    
    /**
     * @dev Calculate USDC amount for given ETH amount
     */
    function calculateUSDCAmount(uint256 _ethAmount) public pure returns (uint256) {
        // 1 ETH = 3000 USDC, so USDC = ETH * 3000
        return (_ethAmount * ETH_PRICE_USDC * 1e18) / 1e18;
    }
    
    /**
     * @dev Instant swap: USDC to ETH
     */
    function swapUSDCToETH(uint256 _usdcAmount) external nonReentrant {
        require(_usdcAmount > 0, "USDC amount must be greater than 0");
        
        uint256 ethAmount = calculateETHAmount(_usdcAmount);
        require(ethAmount <= ethReserve, "Insufficient ETH in pool");
        
        // Transfer USDC from user
        require(usdcToken.transferFrom(msg.sender, address(this), _usdcAmount), "USDC transfer failed");
        
        // Update reserves
        usdcReserve += _usdcAmount;
        ethReserve -= ethAmount;
        
        // Send ETH to user
        payable(msg.sender).transfer(ethAmount);
        
        emit InstantSwap(msg.sender, _usdcAmount, ethAmount);
    }
    
    /**
     * @dev Create a recurring swap schedule
     */
    function createSwapSchedule(
        uint256 _usdcAmount,
        uint256 _interval,
        uint256 _maxExecutions
    ) external nonReentrant returns (bytes32) {
        return createSwapScheduleWithReward(_usdcAmount, _interval, _maxExecutions, DEFAULT_EXECUTOR_REWARD);
    }
    
    /**
     * @dev Create a recurring swap schedule with custom executor reward
     */
    function createSwapScheduleWithReward(
        uint256 _usdcAmount,
        uint256 _interval,
        uint256 _maxExecutions,
        uint256 _executorReward
    ) public returns (bytes32) {
        require(_usdcAmount > 0, "USDC amount must be greater than 0");
        require(_interval >= MIN_INTERVAL && _interval <= MAX_INTERVAL, "Invalid interval");
        require(_maxExecutions > 0 && _maxExecutions <= 1000, "Invalid max executions");
        require(_executorReward >= MIN_EXECUTOR_REWARD, "Executor reward too low");
        
        // Check user permissions
        UserPermissions storage permissions = userPermissions[msg.sender];
        require(permissions.isApproved, "Permissions not granted");
        require(block.timestamp <= permissions.approvedUntil, "Permissions expired");
        require(_usdcAmount <= permissions.maxAmountPerSwap, "Amount exceeds per-swap limit");
        
        // Calculate total cost including executor rewards
        uint256 totalSwapCost = _usdcAmount * _maxExecutions;
        uint256 totalRewardCost = _executorReward * _maxExecutions;
        uint256 totalCost = totalSwapCost + totalRewardCost;
        
        require(permissions.totalSpent + totalSwapCost <= permissions.maxTotalAmount, "Would exceed total spending limit");
        
        // Check USDC allowance for total cost (swaps + rewards)
        require(usdcToken.allowance(msg.sender, address(this)) >= totalCost, "Insufficient USDC allowance for swaps and rewards");
        
        // Create schedule ID
        bytes32 scheduleId = keccak256(abi.encodePacked(msg.sender, _usdcAmount, _interval, block.timestamp, _executorReward));
        
        swapSchedules[scheduleId] = SwapSchedule({
            user: msg.sender,
            usdcAmount: _usdcAmount,
            interval: _interval,
            nextSwap: block.timestamp + _interval, // First swap after full interval
            maxExecutions: _maxExecutions,
            executionsLeft: _maxExecutions,
            isActive: true,
            createdAt: block.timestamp,
            executorReward: _executorReward
        });
        
        userSchedules[msg.sender].push(scheduleId);
        totalActiveSchedules++;
        
        emit SwapScheduleCreated(scheduleId, msg.sender, _usdcAmount, _interval, _executorReward);
        return scheduleId;
    }
    
    /**
     * @dev Execute a recurring swap (can be called by anyone to earn rewards)
     */
    function executeSwap(bytes32 _scheduleId) external nonReentrant {
        SwapSchedule storage schedule = swapSchedules[_scheduleId];
        require(schedule.isActive, "Schedule not active");
        require(block.timestamp >= schedule.nextSwap, "Swap not due yet");
        require(schedule.executionsLeft > 0, "No executions left");
        
        // Prevent spam by limiting execution attempts
        require(block.timestamp >= lastExecutionAttempt[_scheduleId] + 10, "Too frequent execution attempts");
        lastExecutionAttempt[_scheduleId] = block.timestamp;
        
        // Check user still has permissions and allowance
        UserPermissions storage permissions = userPermissions[schedule.user];
        require(permissions.isApproved, "User permissions revoked");
        require(block.timestamp <= permissions.approvedUntil, "User permissions expired");
        require(permissions.totalSpent + schedule.usdcAmount <= permissions.maxTotalAmount, "Would exceed user's total limit");
        
        // Check USDC allowance for swap + reward
        uint256 totalRequired = schedule.usdcAmount + schedule.executorReward;
        require(usdcToken.allowance(schedule.user, address(this)) >= totalRequired, "Insufficient USDC allowance");
        
        // Calculate ETH amount
        uint256 ethAmount = calculateETHAmount(schedule.usdcAmount);
        require(ethAmount <= ethReserve, "Insufficient ETH in pool");
        
        // Execute swap: take USDC, give ETH
        require(usdcToken.transferFrom(schedule.user, address(this), schedule.usdcAmount), "Swap USDC transfer failed");
        
        // Pay executor reward
        require(usdcToken.transferFrom(schedule.user, msg.sender, schedule.executorReward), "Executor reward transfer failed");
        
        // Update reserves
        usdcReserve += schedule.usdcAmount;
        ethReserve -= ethAmount;
        
        // Send ETH to user
        payable(schedule.user).transfer(ethAmount);
        
        // Update state
        permissions.totalSpent += schedule.usdcAmount;
        schedule.executionsLeft--;
        schedule.nextSwap = block.timestamp + schedule.interval;
        
        if (schedule.executionsLeft == 0) {
            schedule.isActive = false;
            totalActiveSchedules--;
        }
        
        emit SwapExecuted(_scheduleId, schedule.user, schedule.usdcAmount, ethAmount, msg.sender, schedule.executorReward);
        emit ExecutorRewarded(msg.sender, schedule.executorReward, _scheduleId);
    }
    
    /**
     * @dev Cancel a swap schedule
     */
    function cancelSwapSchedule(bytes32 _scheduleId) external {
        SwapSchedule storage schedule = swapSchedules[_scheduleId];
        require(schedule.user == msg.sender, "Only user can cancel");
        require(schedule.isActive, "Schedule not active");
        
        schedule.isActive = false;
        totalActiveSchedules--;
        emit SwapScheduleCancelled(_scheduleId);
    }
    
    /**
     * @dev Check if a swap is due (public view for executors)
     */
    function isSwapDue(bytes32 _scheduleId) external view returns (bool) {
        SwapSchedule storage schedule = swapSchedules[_scheduleId];
        return schedule.isActive && 
               block.timestamp >= schedule.nextSwap && 
               schedule.executionsLeft > 0;
    }
    
    /**
     * @dev Get schedule details
     */
    function getSchedule(bytes32 _scheduleId) external view returns (SwapSchedule memory) {
        return swapSchedules[_scheduleId];
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
     * @dev Get pool reserves
     */
    function getReserves() external view returns (uint256 ethReserve_, uint256 usdcReserve_) {
        return (ethReserve, usdcReserve);
    }
    
    /**
     * @dev Get current exchange rate
     */
    function getExchangeRate() external pure returns (uint256) {
        return ETH_PRICE_USDC;
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
        uint256 totalEthReserve,
        uint256 totalUsdcReserve,
        uint256 exchangeRate
    ) {
        return (
            totalActiveSchedules,
            ethReserve,
            usdcReserve,
            ETH_PRICE_USDC
        );
    }
}