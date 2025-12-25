// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MockRealEstate.sol";

/**
 * @title RentCollector
 * @dev Automated rent collection and yield distribution system
 * Integrates with Chainlink Automation for scheduled distributions
 */
contract RentCollector is Ownable, ReentrancyGuard {
    
    struct RentCollection {
        uint256 amount;
        uint256 timestamp;
        string source; // "tenant_payment", "management_fee", "other_income"
        bool distributed;
    }
    
    struct PropertyRentData {
        address propertyContract;
        uint256 totalCollected;
        uint256 totalDistributed;
        uint256 lastDistribution;
        uint256 distributionInterval; // in seconds (default 30 days)
        RentCollection[] collections;
        bool isActive;
    }
    
    // State variables
    mapping(address => PropertyRentData) public propertyRentData;
    address[] public trackedProperties;
    IERC20 public usdcToken; // For rent payments in USDC
    
    // Chainlink Automation
    uint256 public lastUpkeepTimestamp;
    uint256 public upkeepInterval = 1 days; // Check daily for distributions
    
    // Events
    event RentDeposited(address indexed property, uint256 amount, string source);
    event YieldDistributed(address indexed property, uint256 amount, uint256 timestamp);
    event PropertyAdded(address indexed property, uint256 distributionInterval);
    event AutomationTriggered(address indexed property, uint256 amount);
    
    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
        lastUpkeepTimestamp = block.timestamp;
    }
    
    /**
     * @dev Add a property to rent collection tracking
     */
    function addProperty(
        address _propertyContract,
        uint256 _distributionInterval
    ) external onlyOwner {
        require(_propertyContract != address(0), "Invalid property address");
        require(_distributionInterval >= 1 days, "Interval too short");
        
        if (propertyRentData[_propertyContract].propertyContract == address(0)) {
            trackedProperties.push(_propertyContract);
        }
        
        propertyRentData[_propertyContract] = PropertyRentData({
            propertyContract: _propertyContract,
            totalCollected: 0,
            totalDistributed: 0,
            lastDistribution: block.timestamp,
            distributionInterval: _distributionInterval,
            collections: new RentCollection[](0),
            isActive: true
        });
        
        emit PropertyAdded(_propertyContract, _distributionInterval);
    }
    
    /**
     * @dev Deposit rent for a specific property (USDC)
     */
    function depositRent(
        address _propertyContract,
        uint256 _amount,
        string memory _source
    ) external nonReentrant {
        require(propertyRentData[_propertyContract].isActive, "Property not active");
        require(_amount > 0, "Amount must be greater than 0");
        
        // Transfer USDC from sender
        require(
            usdcToken.transferFrom(msg.sender, address(this), _amount),
            "USDC transfer failed"
        );
        
        // Record rent collection
        PropertyRentData storage rentData = propertyRentData[_propertyContract];
        rentData.collections.push(RentCollection({
            amount: _amount,
            timestamp: block.timestamp,
            source: _source,
            distributed: false
        }));
        
        rentData.totalCollected += _amount;
        
        emit RentDeposited(_propertyContract, _amount, _source);
    }
    
    /**
     * @dev Deposit rent in ETH (for properties that accept ETH)
     */
    function depositRentETH(
        address _propertyContract,
        string memory _source
    ) external payable nonReentrant {
        require(propertyRentData[_propertyContract].isActive, "Property not active");
        require(msg.value > 0, "Amount must be greater than 0");
        
        // Record rent collection
        PropertyRentData storage rentData = propertyRentData[_propertyContract];
        rentData.collections.push(RentCollection({
            amount: msg.value,
            timestamp: block.timestamp,
            source: _source,
            distributed: false
        }));
        
        rentData.totalCollected += msg.value;
        
        emit RentDeposited(_propertyContract, msg.value, _source);
    }
    
    /**
     * @dev Distribute accumulated rent to property contract
     */
    function distributeYield(address _propertyContract) public nonReentrant {
        PropertyRentData storage rentData = propertyRentData[_propertyContract];
        require(rentData.isActive, "Property not active");
        require(
            block.timestamp >= rentData.lastDistribution + rentData.distributionInterval,
            "Distribution interval not met"
        );
        
        // Calculate undistributed amount
        uint256 undistributedAmount = 0;
        for (uint256 i = 0; i < rentData.collections.length; i++) {
            if (!rentData.collections[i].distributed) {
                undistributedAmount += rentData.collections[i].amount;
                rentData.collections[i].distributed = true;
            }
        }
        
        require(undistributedAmount > 0, "No yield to distribute");
        
        // Transfer to property contract
        MockRealEstate property = MockRealEstate(payable(_propertyContract));
        
        // Send ETH to property contract for yield distribution
        property.addYieldToPool{value: undistributedAmount}();
        
        // Update tracking
        rentData.totalDistributed += undistributedAmount;
        rentData.lastDistribution = block.timestamp;
        
        emit YieldDistributed(_propertyContract, undistributedAmount, block.timestamp);
    }
    
    /**
     * @dev Chainlink Automation - Check if upkeep is needed
     */
    function checkUpkeep(bytes calldata /* checkData */) 
        external 
        view 
        returns (bool upkeepNeeded, bytes memory performData) 
    {
        upkeepNeeded = false;
        address[] memory propertiesNeedingDistribution = new address[](trackedProperties.length);
        uint256 count = 0;
        
        // Check each property for distribution eligibility
        for (uint256 i = 0; i < trackedProperties.length; i++) {
            address propertyAddr = trackedProperties[i];
            PropertyRentData storage rentData = propertyRentData[propertyAddr];
            
            if (rentData.isActive && 
                block.timestamp >= rentData.lastDistribution + rentData.distributionInterval) {
                
                // Check if there's undistributed rent
                uint256 undistributedAmount = 0;
                for (uint256 j = 0; j < rentData.collections.length; j++) {
                    if (!rentData.collections[j].distributed) {
                        undistributedAmount += rentData.collections[j].amount;
                    }
                }
                
                if (undistributedAmount > 0) {
                    propertiesNeedingDistribution[count] = propertyAddr;
                    count++;
                    upkeepNeeded = true;
                }
            }
        }
        
        // Encode properties that need distribution
        if (upkeepNeeded) {
            address[] memory propertiesToDistribute = new address[](count);
            for (uint256 i = 0; i < count; i++) {
                propertiesToDistribute[i] = propertiesNeedingDistribution[i];
            }
            performData = abi.encode(propertiesToDistribute);
        }
    }
    
    /**
     * @dev Chainlink Automation - Perform upkeep
     */
    function performUpkeep(bytes calldata performData) external {
        address[] memory propertiesToDistribute = abi.decode(performData, (address[]));
        
        for (uint256 i = 0; i < propertiesToDistribute.length; i++) {
            try this.distributeYield(propertiesToDistribute[i]) {
                emit AutomationTriggered(propertiesToDistribute[i], 0);
            } catch {
                // Log error but continue with other properties
                continue;
            }
        }
        
        lastUpkeepTimestamp = block.timestamp;
    }
    
    /**
     * @dev Get property rent data
     */
    function getPropertyRentData(address _propertyContract) 
        external 
        view 
        returns (PropertyRentData memory) 
    {
        return propertyRentData[_propertyContract];
    }
    
    /**
     * @dev Get undistributed amount for a property
     */
    function getUndistributedAmount(address _propertyContract) 
        external 
        view 
        returns (uint256) 
    {
        PropertyRentData storage rentData = propertyRentData[_propertyContract];
        uint256 undistributed = 0;
        
        for (uint256 i = 0; i < rentData.collections.length; i++) {
            if (!rentData.collections[i].distributed) {
                undistributed += rentData.collections[i].amount;
            }
        }
        
        return undistributed;
    }
    
    /**
     * @dev Get next distribution time for a property
     */
    function getNextDistributionTime(address _propertyContract) 
        external 
        view 
        returns (uint256) 
    {
        PropertyRentData storage rentData = propertyRentData[_propertyContract];
        return rentData.lastDistribution + rentData.distributionInterval;
    }
    
    /**
     * @dev Get all tracked properties
     */
    function getAllTrackedProperties() external view returns (address[] memory) {
        return trackedProperties;
    }
    
    /**
     * @dev Owner functions
     */
    function setUpkeepInterval(uint256 _interval) external onlyOwner {
        require(_interval >= 1 hours, "Interval too short");
        upkeepInterval = _interval;
    }
    
    function togglePropertyStatus(address _propertyContract) external onlyOwner {
        propertyRentData[_propertyContract].isActive = !propertyRentData[_propertyContract].isActive;
    }
    
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function emergencyWithdrawUSDC() external onlyOwner {
        uint256 balance = usdcToken.balanceOf(address(this));
        usdcToken.transfer(owner(), balance);
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {
        // ETH received for rent payments
    }
}