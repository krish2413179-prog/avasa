// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PropertyShare.sol";

/**
 * @title RentToOwnAdapter
 * @dev Converts rent payments into property shares automatically
 * Integrates with existing AutoRecurringPayments system
 */
contract RentToOwnAdapter is Ownable {
    IERC20 public immutable usdc;
    
    struct RentToOwnSchedule {
        address tenant;
        address landlord;
        PropertyShare propertyShare;
        uint256 monthlyRent;
        uint256 targetOwnershipPercentage; // In basis points (100 = 1%)
        uint256 targetMonths;
        uint256 startTime;
        bool active;
    }
    
    mapping(bytes32 => RentToOwnSchedule) public schedules;
    mapping(address => bytes32[]) public tenantSchedules;
    mapping(address => mapping(address => uint256)) public tenantProgress; // tenant => propertyShare => totalRentPaid
    
    event RentToOwnScheduleCreated(
        bytes32 indexed scheduleId,
        address indexed tenant,
        address indexed propertyShare,
        uint256 monthlyRent,
        uint256 targetOwnershipPercentage
    );
    
    event RentPaidWithEquity(
        bytes32 indexed scheduleId,
        address indexed tenant,
        uint256 rentAmount,
        uint256 sharesEarned
    );
    
    constructor(address _usdc) {
        usdc = IERC20(_usdc);
    }
    
    /**
     * @dev Create a rent-to-own schedule
     */
    function createRentToOwnSchedule(
        address _tenant,
        address _landlord,
        PropertyShare _propertyShare,
        uint256 _monthlyRent,
        uint256 _targetOwnershipPercentage,
        uint256 _targetMonths
    ) external returns (bytes32) {
        require(_tenant != address(0), "Invalid tenant");
        require(_landlord != address(0), "Invalid landlord");
        require(address(_propertyShare) != address(0), "Invalid property share");
        require(_monthlyRent > 0, "Invalid rent amount");
        require(_targetOwnershipPercentage > 0 && _targetOwnershipPercentage <= 10000, "Invalid ownership percentage");
        
        bytes32 scheduleId = keccak256(abi.encodePacked(
            _tenant,
            address(_propertyShare),
            block.timestamp,
            _monthlyRent
        ));
        
        schedules[scheduleId] = RentToOwnSchedule({
            tenant: _tenant,
            landlord: _landlord,
            propertyShare: _propertyShare,
            monthlyRent: _monthlyRent,
            targetOwnershipPercentage: _targetOwnershipPercentage,
            targetMonths: _targetMonths,
            startTime: block.timestamp,
            active: true
        });
        
        tenantSchedules[_tenant].push(scheduleId);
        
        emit RentToOwnScheduleCreated(
            scheduleId,
            _tenant,
            address(_propertyShare),
            _monthlyRent,
            _targetOwnershipPercentage
        );
        
        return scheduleId;
    }
    
    /**
     * @dev Process rent payment and mint property shares
     * Called by AutoRecurringPayments contract or directly
     */
    function processRentPayment(bytes32 scheduleId, uint256 rentAmount) external {
        RentToOwnSchedule storage schedule = schedules[scheduleId];
        require(schedule.active, "Schedule not active");
        require(rentAmount > 0, "Invalid rent amount");
        
        // Transfer USDC from tenant to landlord
        require(
            usdc.transferFrom(schedule.tenant, schedule.landlord, rentAmount),
            "USDC transfer failed"
        );
        
        // Update tenant progress
        tenantProgress[schedule.tenant][address(schedule.propertyShare)] += rentAmount;
        
        // Mint property shares to tenant
        schedule.propertyShare.rewardTenant(schedule.tenant, rentAmount);
        
        emit RentPaidWithEquity(
            scheduleId,
            schedule.tenant,
            rentAmount,
            rentAmount / 10000 // Simplified share calculation
        );
    }
    
    /**
     * @dev Get tenant's progress for a property
     */
    function getTenantProgress(address tenant, address propertyShare) 
        external 
        view 
        returns (uint256 totalRentPaid, uint256 sharesOwned, uint256 ownershipPercentage) 
    {
        totalRentPaid = tenantProgress[tenant][propertyShare];
        sharesOwned = PropertyShare(propertyShare).balanceOf(tenant);
        ownershipPercentage = PropertyShare(propertyShare).getOwnershipPercentage(tenant);
    }
    
    /**
     * @dev Calculate monthly rent needed to reach ownership goal
     */
    function calculateRentForOwnership(
        address propertyShare,
        uint256 targetOwnershipBasisPoints,
        uint256 targetMonths
    ) external pure returns (uint256 monthlyRent) {
        // Target ownership in shares (1 share = 1% = 100 basis points)
        uint256 targetShares = (targetOwnershipBasisPoints * 10**18) / 100;
        
        // Total rent needed (10,000 USDC per share)
        uint256 totalRentNeeded = targetShares * 10000;
        
        // Monthly rent
        monthlyRent = totalRentNeeded / targetMonths;
    }
    
    /**
     * @dev Get tenant's schedules
     */
    function getTenantSchedules(address tenant) external view returns (bytes32[] memory) {
        return tenantSchedules[tenant];
    }
    
    /**
     * @dev Emergency stop a schedule
     */
    function stopSchedule(bytes32 scheduleId) external {
        RentToOwnSchedule storage schedule = schedules[scheduleId];
        require(
            msg.sender == schedule.tenant || msg.sender == owner(),
            "Not authorized"
        );
        schedule.active = false;
    }
}