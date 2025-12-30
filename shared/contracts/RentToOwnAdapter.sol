// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PropertyShare.sol";
import "./AutoRecurringPayments.sol";

/**
 * @title RentToOwnAdapter
 * @dev Connects recurring rent payments to property share minting
 * Transforms rent payments into fractional property ownership
 */
contract RentToOwnAdapter is Ownable, ReentrancyGuard {
    
    struct RentToOwnSchedule {
        address tenant;
        address landlord;
        address propertyShareContract;
        uint256 rentAmount;
        uint256 targetOwnershipBasisPoints; // 500 = 5.00%
        uint256 totalRentNeeded;
        uint256 totalRentPaid;
        uint256 sharesEarned;
        bool isActive;
        bytes32 recurringPaymentId;
        uint256 createdAt;
        uint256 targetDate; // When tenant wants to reach ownership goal
    }
    
    IERC20 public usdcToken;
    AutoRecurringPayments public recurringPayments;
    
    mapping(bytes32 => RentToOwnSchedule) public rentToOwnSchedules;
    mapping(address => bytes32[]) public tenantSchedules;
    mapping(address => mapping(address => bytes32)) public tenantPropertySchedule; // tenant -> property -> scheduleId
    
    uint256 public totalActiveSchedules;
    
    event RentToOwnCreated(
        bytes32 indexed scheduleId,
        address indexed tenant,
        address indexed propertyShare,
        uint256 targetOwnership,
        uint256 rentAmount,
        uint256 targetDate
    );
    
    event RentPaidAndSharesEarned(
        bytes32 indexed scheduleId,
        address indexed tenant,
        uint256 rentPaid,
        uint256 sharesEarned,
        uint256 totalOwnership
    );
    
    event OwnershipGoalReached(
        bytes32 indexed scheduleId,
        address indexed tenant,
        uint256 finalOwnership,
        uint256 totalRentPaid
    );
    
    constructor(
        address _usdcToken,
        address _recurringPayments
    ) {
        usdcToken = IERC20(_usdcToken);
        recurringPayments = AutoRecurringPayments(_recurringPayments);
    }
    
    /**
     * @dev Create a rent-to-own schedule
     * @param _propertyShare Address of the PropertyShare contract
     * @param _landlord Address of the landlord (rent recipient)
     * @param _rentAmount Monthly rent amount in USDC
     * @param _targetOwnershipBasisPoints Target ownership (500 = 5.00%)
     * @param _targetMonths How many months to reach the goal
     */
    function createRentToOwnSchedule(
        address _propertyShare,
        address _landlord,
        uint256 _rentAmount,
        uint256 _targetOwnershipBasisPoints,
        uint256 _targetMonths
    ) external returns (bytes32) {
        require(_propertyShare != address(0), "Invalid property share contract");
        require(_landlord != address(0), "Invalid landlord address");
        require(_rentAmount > 0, "Rent amount must be greater than 0");
        require(_targetOwnershipBasisPoints > 0 && _targetOwnershipBasisPoints <= 10000, "Invalid ownership percentage");
        require(_targetMonths > 0 && _targetMonths <= 360, "Invalid target months"); // Max 30 years
        
        PropertyShare propertyShare = PropertyShare(_propertyShare);
        
        // Calculate total USDC needed for target ownership
        uint256 totalUSDCNeeded = propertyShare.calculateUSDCForOwnership(_targetOwnershipBasisPoints);
        
        // Validate that rent payments can achieve the goal
        uint256 totalRentPayments = _rentAmount * _targetMonths;
        require(totalRentPayments >= totalUSDCNeeded, "Rent payments insufficient for ownership goal");
        
        // Check if tenant already has a schedule for this property
        bytes32 existingScheduleId = tenantPropertySchedule[msg.sender][_propertyShare];
        require(existingScheduleId == bytes32(0) || !rentToOwnSchedules[existingScheduleId].isActive, 
                "Active schedule already exists for this property");
        
        // Create schedule ID
        bytes32 scheduleId = keccak256(abi.encodePacked(
            msg.sender, 
            _propertyShare, 
            _rentAmount, 
            _targetOwnershipBasisPoints, 
            block.timestamp
        ));
        
        // Calculate target date
        uint256 targetDate = block.timestamp + (_targetMonths * 30 days);
        
        // Create the rent-to-own schedule
        rentToOwnSchedules[scheduleId] = RentToOwnSchedule({
            tenant: msg.sender,
            landlord: _landlord,
            propertyShareContract: _propertyShare,
            rentAmount: _rentAmount,
            targetOwnershipBasisPoints: _targetOwnershipBasisPoints,
            totalRentNeeded: totalUSDCNeeded,
            totalRentPaid: 0,
            sharesEarned: 0,
            isActive: true,
            recurringPaymentId: bytes32(0), // Will be set when recurring payment is created
            createdAt: block.timestamp,
            targetDate: targetDate
        });
        
        tenantSchedules[msg.sender].push(scheduleId);
        tenantPropertySchedule[msg.sender][_propertyShare] = scheduleId;
        totalActiveSchedules++;
        
        emit RentToOwnCreated(
            scheduleId,
            msg.sender,
            _propertyShare,
            _targetOwnershipBasisPoints,
            _rentAmount,
            targetDate
        );
        
        return scheduleId;
    }
    
    /**
     * @dev Link a recurring payment to a rent-to-own schedule
     * This should be called after creating the recurring payment
     */
    function linkRecurringPayment(bytes32 _scheduleId, bytes32 _recurringPaymentId) external {
        RentToOwnSchedule storage schedule = rentToOwnSchedules[_scheduleId];
        require(schedule.tenant == msg.sender, "Only tenant can link payment");
        require(schedule.isActive, "Schedule not active");
        require(schedule.recurringPaymentId == bytes32(0), "Payment already linked");
        
        schedule.recurringPaymentId = _recurringPaymentId;
    }
    
    /**
     * @dev Process rent payment and mint property shares
     * This is called by the payment executor when rent is paid
     */
    function processRentPayment(
        bytes32 _scheduleId,
        uint256 _rentPaid
    ) external nonReentrant {
        RentToOwnSchedule storage schedule = rentToOwnSchedules[_scheduleId];
        require(schedule.isActive, "Schedule not active");
        require(_rentPaid > 0, "Invalid rent amount");
        
        // Verify the caller is authorized (could be the recurring payment contract or executor)
        // For now, we'll allow any caller but in production you'd want to restrict this
        
        PropertyShare propertyShare = PropertyShare(schedule.propertyShareContract);
        
        // Calculate shares to mint based on rent paid
        // The PropertyShare contract handles the conversion rate
        uint256 sharesBefore = propertyShare.balanceOf(schedule.tenant);
        
        // Mint shares to tenant
        propertyShare.rewardTenant(schedule.tenant, _rentPaid);
        
        uint256 sharesAfter = propertyShare.balanceOf(schedule.tenant);
        uint256 sharesEarned = sharesAfter - sharesBefore;
        
        // Update schedule
        schedule.totalRentPaid += _rentPaid;
        schedule.sharesEarned += sharesEarned;
        
        // Get current ownership percentage
        uint256 currentOwnership = propertyShare.getOwnershipPercentage(schedule.tenant);
        
        emit RentPaidAndSharesEarned(
            _scheduleId,
            schedule.tenant,
            _rentPaid,
            sharesEarned,
            currentOwnership
        );
        
        // Check if ownership goal is reached
        if (currentOwnership >= schedule.targetOwnershipBasisPoints) {
            schedule.isActive = false;
            totalActiveSchedules--;
            
            emit OwnershipGoalReached(
                _scheduleId,
                schedule.tenant,
                currentOwnership,
                schedule.totalRentPaid
            );
        }
    }
    
    /**
     * @dev Calculate streaming rate needed to reach ownership goal
     * @param _propertyShare Address of the PropertyShare contract
     * @param _targetOwnershipBasisPoints Target ownership (500 = 5.00%)
     * @param _targetMonths How many months to reach the goal
     * @return Monthly rent amount needed
     */
    function calculateRentForOwnership(
        address _propertyShare,
        uint256 _targetOwnershipBasisPoints,
        uint256 _targetMonths
    ) external view returns (uint256) {
        PropertyShare propertyShare = PropertyShare(_propertyShare);
        uint256 totalUSDCNeeded = propertyShare.calculateUSDCForOwnership(_targetOwnershipBasisPoints);
        return totalUSDCNeeded / _targetMonths;
    }
    
    /**
     * @dev Get schedule details
     */
    function getSchedule(bytes32 _scheduleId) external view returns (RentToOwnSchedule memory) {
        return rentToOwnSchedules[_scheduleId];
    }
    
    /**
     * @dev Get tenant's schedules
     */
    function getTenantSchedules(address _tenant) external view returns (bytes32[] memory) {
        return tenantSchedules[_tenant];
    }
    
    /**
     * @dev Get tenant's current progress for a property
     */
    function getTenantProgress(address _tenant, address _propertyShare) external view returns (
        uint256 currentOwnership,
        uint256 targetOwnership,
        uint256 totalRentPaid,
        uint256 totalRentNeeded,
        uint256 progressPercentage,
        bool goalReached
    ) {
        bytes32 scheduleId = tenantPropertySchedule[_tenant][_propertyShare];
        if (scheduleId == bytes32(0)) {
            return (0, 0, 0, 0, 0, false);
        }
        
        RentToOwnSchedule storage schedule = rentToOwnSchedules[scheduleId];
        PropertyShare propertyShare = PropertyShare(_propertyShare);
        
        currentOwnership = propertyShare.getOwnershipPercentage(_tenant);
        targetOwnership = schedule.targetOwnershipBasisPoints;
        totalRentPaid = schedule.totalRentPaid;
        totalRentNeeded = schedule.totalRentNeeded;
        
        if (totalRentNeeded > 0) {
            progressPercentage = (totalRentPaid * 10000) / totalRentNeeded; // Basis points
        }
        
        goalReached = currentOwnership >= targetOwnership;
    }
    
    /**
     * @dev Cancel a rent-to-own schedule
     */
    function cancelSchedule(bytes32 _scheduleId) external {
        RentToOwnSchedule storage schedule = rentToOwnSchedules[_scheduleId];
        require(schedule.tenant == msg.sender, "Only tenant can cancel");
        require(schedule.isActive, "Schedule not active");
        
        schedule.isActive = false;
        totalActiveSchedules--;
        
        // Note: This doesn't cancel the underlying recurring payment
        // The tenant needs to do that separately through the AutoRecurringPayments contract
    }
    
    /**
     * @dev Emergency function to update property share contract (owner only)
     */
    function updatePropertyShareContract(bytes32 _scheduleId, address _newPropertyShare) external onlyOwner {
        RentToOwnSchedule storage schedule = rentToOwnSchedules[_scheduleId];
        require(schedule.isActive, "Schedule not active");
        schedule.propertyShareContract = _newPropertyShare;
    }
    
    /**
     * @dev Get contract statistics
     */
    function getContractStats() external view returns (
        uint256 activeSchedules,
        address usdcTokenAddress,
        address recurringPaymentsAddress
    ) {
        return (
            totalActiveSchedules,
            address(usdcToken),
            address(recurringPayments)
        );
    }
}