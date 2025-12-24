// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title MockRealEstate
 * @dev A tokenized real estate investment contract that allows users to:
 * - Buy fractional shares of properties
 * - Earn rental yield distributions
 * - Withdraw their investments
 * - Transfer shares between users
 */
contract MockRealEstate is ERC20, Ownable, ReentrancyGuard, Pausable {
    
    // Property information
    struct PropertyInfo {
        string name;
        string location;
        string propertyType; // "Residential", "Commercial", "Industrial", "Hospitality"
        uint256 totalValue; // Total property value in USD (scaled by 1e18)
        uint256 totalShares; // Total shares available
        uint256 pricePerShare; // Price per share in wei
        uint256 annualYieldRate; // Annual yield rate (basis points, e.g., 500 = 5%)
        uint256 totalYieldDistributed; // Total yield distributed so far
        bool isActive; // Whether property is accepting investments
    }
    
    // Events
    event SharesPurchased(address indexed investor, uint256 shares, uint256 amount);
    event SharesWithdrawn(address indexed investor, uint256 shares, uint256 amount);
    event YieldDistributed(address indexed investor, uint256 amount);
    event PropertyUpdated(uint256 indexed propertyId, string name, uint256 pricePerShare);
    
    // State variables
    PropertyInfo public propertyInfo;
    mapping(address => uint256) public lastYieldClaim;
    mapping(address => uint256) public totalInvested;
    uint256 public totalYieldPool;
    uint256 public lastYieldDistribution;
    
    // Constants
    uint256 public constant YIELD_DISTRIBUTION_INTERVAL = 30 days;
    uint256 public constant BASIS_POINTS = 10000;
    
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _location,
        string memory _propertyType,
        uint256 _totalValue,
        uint256 _totalShares,
        uint256 _pricePerShare,
        uint256 _annualYieldRate
    ) ERC20(_name, _symbol) {
        propertyInfo = PropertyInfo({
            name: _name,
            location: _location,
            propertyType: _propertyType,
            totalValue: _totalValue,
            totalShares: _totalShares,
            pricePerShare: _pricePerShare,
            annualYieldRate: _annualYieldRate,
            totalYieldDistributed: 0,
            isActive: true
        });
        
        lastYieldDistribution = block.timestamp;
    }
    
    /**
     * @dev Purchase shares of the property
     * @param _shares Number of shares to purchase
     */
    function purchaseShares(uint256 _shares) external payable nonReentrant whenNotPaused {
        require(propertyInfo.isActive, "Property not accepting investments");
        require(_shares > 0, "Must purchase at least 1 share");
        require(totalSupply() + _shares <= propertyInfo.totalShares, "Exceeds total shares available");
        
        uint256 cost = _shares * propertyInfo.pricePerShare;
        require(msg.value >= cost, "Insufficient payment");
        
        // Mint shares to investor
        _mint(msg.sender, _shares);
        
        // Track investment
        totalInvested[msg.sender] += cost;
        lastYieldClaim[msg.sender] = block.timestamp;
        
        // Add to yield pool (simulate rental income)
        totalYieldPool += cost * propertyInfo.annualYieldRate / BASIS_POINTS / 12; // Monthly yield
        
        // Refund excess payment
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }
        
        emit SharesPurchased(msg.sender, _shares, cost);
    }
    
    /**
     * @dev Withdraw investment by selling shares back to contract
     * @param _shares Number of shares to withdraw
     */
    function withdrawShares(uint256 _shares) external nonReentrant {
        require(balanceOf(msg.sender) >= _shares, "Insufficient shares");
        require(_shares > 0, "Must withdraw at least 1 share");
        
        // Calculate withdrawal amount (current share price)
        uint256 withdrawalAmount = _shares * propertyInfo.pricePerShare;
        require(address(this).balance >= withdrawalAmount, "Insufficient contract balance");
        
        // Claim any pending yield first
        claimYield();
        
        // Burn shares
        _burn(msg.sender, _shares);
        
        // Update investment tracking
        uint256 investmentReduction = (totalInvested[msg.sender] * _shares) / (balanceOf(msg.sender) + _shares);
        totalInvested[msg.sender] -= investmentReduction;
        
        // Transfer withdrawal amount
        payable(msg.sender).transfer(withdrawalAmount);
        
        emit SharesWithdrawn(msg.sender, _shares, withdrawalAmount);
    }
    
    /**
     * @dev Claim accumulated rental yield
     */
    function claimYield() public nonReentrant {
        uint256 shares = balanceOf(msg.sender);
        require(shares > 0, "No shares owned");
        
        uint256 yieldAmount = calculatePendingYield(msg.sender);
        require(yieldAmount > 0, "No yield to claim");
        require(address(this).balance >= yieldAmount, "Insufficient yield pool");
        
        // Update last claim timestamp
        lastYieldClaim[msg.sender] = block.timestamp;
        
        // Update total distributed
        propertyInfo.totalYieldDistributed += yieldAmount;
        
        // Transfer yield
        payable(msg.sender).transfer(yieldAmount);
        
        emit YieldDistributed(msg.sender, yieldAmount);
    }
    
    /**
     * @dev Calculate pending yield for an investor
     * @param _investor Address of the investor
     * @return Pending yield amount in wei
     */
    function calculatePendingYield(address _investor) public view returns (uint256) {
        uint256 shares = balanceOf(_investor);
        if (shares == 0) return 0;
        
        uint256 timeSinceLastClaim = block.timestamp - lastYieldClaim[_investor];
        if (timeSinceLastClaim == 0) return 0;
        
        // Calculate yield based on share ownership and time
        uint256 sharePercentage = (shares * 1e18) / totalSupply();
        uint256 annualYield = (totalInvested[_investor] * propertyInfo.annualYieldRate) / BASIS_POINTS;
        uint256 yieldAmount = (annualYield * timeSinceLastClaim) / 365 days;
        
        return yieldAmount;
    }
    
    /**
     * @dev Get property information
     */
    function getPropertyInfo() external view returns (PropertyInfo memory) {
        return propertyInfo;
    }
    
    /**
     * @dev Get investor information
     * @param _investor Address of the investor
     */
    function getInvestorInfo(address _investor) external view returns (
        uint256 shares,
        uint256 invested,
        uint256 pendingYield,
        uint256 lastClaim
    ) {
        shares = balanceOf(_investor);
        invested = totalInvested[_investor];
        pendingYield = calculatePendingYield(_investor);
        lastClaim = lastYieldClaim[_investor];
    }
    
    /**
     * @dev Owner functions for property management
     */
    function updatePropertyInfo(
        string memory _name,
        uint256 _pricePerShare,
        uint256 _annualYieldRate,
        bool _isActive
    ) external onlyOwner {
        propertyInfo.name = _name;
        propertyInfo.pricePerShare = _pricePerShare;
        propertyInfo.annualYieldRate = _annualYieldRate;
        propertyInfo.isActive = _isActive;
        
        emit PropertyUpdated(0, _name, _pricePerShare);
    }
    
    /**
     * @dev Add yield to the pool (simulate rental income)
     */
    function addYieldToPool() external payable onlyOwner {
        totalYieldPool += msg.value;
    }
    
    /**
     * @dev Emergency functions
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Withdraw contract balance (owner only, for emergencies)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {
        totalYieldPool += msg.value;
    }
}

/**
 * @title RealEstateFactory
 * @dev Factory contract to deploy multiple real estate properties
 */
contract RealEstateFactory is Ownable {
    
    struct DeployedProperty {
        address contractAddress;
        string name;
        string location;
        uint256 totalValue;
        uint256 pricePerShare;
        uint256 annualYieldRate;
        bool isActive;
    }
    
    DeployedProperty[] public properties;
    mapping(address => uint256[]) public userInvestments; // user -> property indices
    
    event PropertyDeployed(
        address indexed contractAddress,
        string name,
        string location,
        uint256 totalValue,
        uint256 pricePerShare
    );
    
    /**
     * @dev Deploy a new real estate property contract
     */
    function deployProperty(
        string memory _name,
        string memory _symbol,
        string memory _location,
        string memory _propertyType,
        uint256 _totalValue,
        uint256 _totalShares,
        uint256 _pricePerShare,
        uint256 _annualYieldRate
    ) external onlyOwner returns (address) {
        
        MockRealEstate newProperty = new MockRealEstate(
            _name,
            _symbol,
            _location,
            _propertyType,
            _totalValue,
            _totalShares,
            _pricePerShare,
            _annualYieldRate
        );
        
        // Transfer ownership to this factory
        newProperty.transferOwnership(address(this));
        
        // Store property info
        properties.push(DeployedProperty({
            contractAddress: address(newProperty),
            name: _name,
            location: _location,
            totalValue: _totalValue,
            pricePerShare: _pricePerShare,
            annualYieldRate: _annualYieldRate,
            isActive: true
        }));
        
        emit PropertyDeployed(
            address(newProperty),
            _name,
            _location,
            _totalValue,
            _pricePerShare
        );
        
        return address(newProperty);
    }
    
    /**
     * @dev Get all deployed properties
     */
    function getAllProperties() external view returns (DeployedProperty[] memory) {
        return properties;
    }
    
    /**
     * @dev Get property count
     */
    function getPropertyCount() external view returns (uint256) {
        return properties.length;
    }
    
    /**
     * @dev Get property by index
     */
    function getProperty(uint256 _index) external view returns (DeployedProperty memory) {
        require(_index < properties.length, "Property index out of bounds");
        return properties[_index];
    }
    
    /**
     * @dev Add yield to a specific property
     */
    function addYieldToProperty(uint256 _propertyIndex) external payable onlyOwner {
        require(_propertyIndex < properties.length, "Property index out of bounds");
        
        MockRealEstate property = MockRealEstate(payable(properties[_propertyIndex].contractAddress));
        property.addYieldToPool{value: msg.value}();
    }
    
    /**
     * @dev Batch add yield to multiple properties
     */
    function batchAddYield(uint256[] memory _propertyIndices, uint256[] memory _amounts) external payable onlyOwner {
        require(_propertyIndices.length == _amounts.length, "Arrays length mismatch");
        
        uint256 totalRequired = 0;
        for (uint256 i = 0; i < _amounts.length; i++) {
            totalRequired += _amounts[i];
        }
        require(msg.value >= totalRequired, "Insufficient ETH sent");
        
        for (uint256 i = 0; i < _propertyIndices.length; i++) {
            require(_propertyIndices[i] < properties.length, "Property index out of bounds");
            
            MockRealEstate property = MockRealEstate(payable(properties[_propertyIndices[i]].contractAddress));
            property.addYieldToPool{value: _amounts[i]}();
        }
    }
}