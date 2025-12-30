// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PropertyShare
 * @dev ERC-20 token representing fractional ownership in a property
 * Minted automatically when rent is paid through the RentToOwnAdapter
 */
contract PropertyShare is ERC20, Ownable, ReentrancyGuard {
    
    struct PropertyInfo {
        string name;
        string location;
        uint256 totalValue; // Total property value in USDC
        uint256 totalShares; // Total shares that can be minted (e.g., 100,000 for 0.001% precision)
        uint256 rentToShareRate; // USDC per share (e.g., 1000 USDC = 1 share)
        bool isActive;
    }
    
    PropertyInfo public propertyInfo;
    address public rentAdapter; // Only this contract can mint shares
    
    // Track tenant ownership
    mapping(address => uint256) public tenantShares;
    mapping(address => uint256) public totalRentPaid;
    
    event SharesEarned(address indexed tenant, uint256 rentPaid, uint256 sharesEarned);
    event PropertyInfoUpdated(string name, uint256 totalValue, uint256 rentToShareRate);
    
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _propertyName,
        string memory _location,
        uint256 _totalValue,
        uint256 _totalShares,
        uint256 _rentToShareRate
    ) ERC20(_name, _symbol) {
        propertyInfo = PropertyInfo({
            name: _propertyName,
            location: _location,
            totalValue: _totalValue,
            totalShares: _totalShares,
            rentToShareRate: _rentToShareRate,
            isActive: true
        });
    }
    
    /**
     * @dev Set the rent adapter contract (only owner)
     */
    function setRentAdapter(address _rentAdapter) external onlyOwner {
        rentAdapter = _rentAdapter;
    }
    
    /**
     * @dev Reward tenant with shares for rent payment (only rent adapter)
     */
    function rewardTenant(address tenant, uint256 rentPaid) external nonReentrant {
        require(msg.sender == rentAdapter, "Only rent adapter can mint shares");
        require(propertyInfo.isActive, "Property not active");
        require(tenant != address(0), "Invalid tenant address");
        require(rentPaid > 0, "Rent amount must be greater than 0");
        
        // Calculate shares earned: rentPaid / rentToShareRate
        uint256 sharesEarned = (rentPaid * 1e18) / propertyInfo.rentToShareRate; // 18 decimals
        
        // Ensure we don't exceed total shares
        require(totalSupply() + sharesEarned <= propertyInfo.totalShares * 1e18, "Would exceed total shares");
        
        // Mint shares to tenant
        _mint(tenant, sharesEarned);
        
        // Update tracking
        tenantShares[tenant] += sharesEarned;
        totalRentPaid[tenant] += rentPaid;
        
        emit SharesEarned(tenant, rentPaid, sharesEarned);
    }
    
    /**
     * @dev Get tenant's ownership percentage
     */
    function getOwnershipPercentage(address tenant) external view returns (uint256) {
        if (totalSupply() == 0) return 0;
        return (balanceOf(tenant) * 10000) / (propertyInfo.totalShares * 1e18); // Basis points (0.01%)
    }
    
    /**
     * @dev Get tenant's equity value in USDC
     */
    function getEquityValue(address tenant) external view returns (uint256) {
        if (totalSupply() == 0) return 0;
        uint256 ownershipBasisPoints = (balanceOf(tenant) * 10000) / (propertyInfo.totalShares * 1e18);
        return (propertyInfo.totalValue * ownershipBasisPoints) / 10000;
    }
    
    /**
     * @dev Calculate shares needed for target ownership percentage
     */
    function calculateSharesForOwnership(uint256 targetPercentageBasisPoints) external view returns (uint256) {
        // targetPercentageBasisPoints: 500 = 5.00%
        return (propertyInfo.totalShares * 1e18 * targetPercentageBasisPoints) / 10000;
    }
    
    /**
     * @dev Calculate USDC needed for target ownership percentage
     */
    function calculateUSDCForOwnership(uint256 targetPercentageBasisPoints) external view returns (uint256) {
        uint256 sharesNeeded = (propertyInfo.totalShares * 1e18 * targetPercentageBasisPoints) / 10000;
        return (sharesNeeded * propertyInfo.rentToShareRate) / 1e18;
    }
    
    /**
     * @dev Update property information (only owner)
     */
    function updatePropertyInfo(
        string memory _name,
        uint256 _totalValue,
        uint256 _rentToShareRate
    ) external onlyOwner {
        propertyInfo.name = _name;
        propertyInfo.totalValue = _totalValue;
        propertyInfo.rentToShareRate = _rentToShareRate;
        
        emit PropertyInfoUpdated(_name, _totalValue, _rentToShareRate);
    }
    
    /**
     * @dev Get property information
     */
    function getPropertyInfo() external view returns (PropertyInfo memory) {
        return propertyInfo;
    }
    
    /**
     * @dev Get tenant statistics
     */
    function getTenantStats(address tenant) external view returns (
        uint256 shares,
        uint256 totalRent,
        uint256 ownershipBasisPoints,
        uint256 equityValue
    ) {
        shares = balanceOf(tenant);
        totalRent = totalRentPaid[tenant];
        ownershipBasisPoints = totalSupply() > 0 ? (shares * 10000) / (propertyInfo.totalShares * 1e18) : 0;
        equityValue = totalSupply() > 0 ? (propertyInfo.totalValue * ownershipBasisPoints) / 10000 : 0;
    }
}