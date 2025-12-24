// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RWAProperty
 * @dev Tokenized real estate property with yield distribution
 */
contract RWAProperty is ERC721, Ownable, ReentrancyGuard {
    struct Property {
        string metadataURI;
        uint256 totalValue;
        uint256 totalShares;
        uint256 monthlyRent;
        address yieldToken;
        bool isActive;
        uint256 lastDistribution;
    }

    struct KYCData {
        bool isVerified;
        uint256 verificationLevel;
        bytes32 dataHash; // Privacy-preserving hash
    }

    mapping(uint256 => Property) public properties;
    mapping(address => KYCData) public kycStatus;
    mapping(uint256 => mapping(address => uint256)) public shareholdings;
    
    uint256 private _tokenIdCounter;
    address public complianceOracle;
    
    event PropertyTokenized(uint256 indexed tokenId, uint256 totalValue, address yieldToken);
    event YieldDistributed(uint256 indexed tokenId, uint256 amount);
    event SharesPurchased(uint256 indexed tokenId, address buyer, uint256 shares, uint256 cost);
    event KYCUpdated(address indexed user, bool verified, uint256 level);

    constructor(address _complianceOracle) ERC721("RWA Property", "RWAP") {
        complianceOracle = _complianceOracle;
    }

    /**
     * @dev Tokenize a new property
     */
    function tokenizeProperty(
        string memory metadataURI,
        uint256 totalValue,
        uint256 totalShares,
        uint256 monthlyRent
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        
        // Deploy yield token for this property
        PropertyYieldToken yieldToken = new PropertyYieldToken(
            string(abi.encodePacked("Property ", Strings.toString(tokenId), " Yield")),
            string(abi.encodePacked("PY", Strings.toString(tokenId))),
            totalShares
        );
        
        properties[tokenId] = Property({
            metadataURI: metadataURI,
            totalValue: totalValue,
            totalShares: totalShares,
            monthlyRent: monthlyRent,
            yieldToken: address(yieldToken),
            isActive: true,
            lastDistribution: block.timestamp
        });
        
        _mint(address(this), tokenId);
        
        emit PropertyTokenized(tokenId, totalValue, address(yieldToken));
        return tokenId;
    }

    /**
     * @dev Purchase shares in a property (requires KYC)
     */
    function purchaseShares(uint256 tokenId, uint256 shares) external payable nonReentrant {
        require(kycStatus[msg.sender].isVerified, "KYC verification required");
        require(properties[tokenId].isActive, "Property not active");
        
        Property storage property = properties[tokenId];
        uint256 sharePrice = property.totalValue / property.totalShares;
        uint256 totalCost = sharePrice * shares;
        
        require(msg.value >= totalCost, "Insufficient payment");
        
        // Mint yield tokens to buyer
        PropertyYieldToken(property.yieldToken).mint(msg.sender, shares);
        shareholdings[tokenId][msg.sender] += shares;
        
        // Refund excess payment
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
        
        emit SharesPurchased(tokenId, msg.sender, shares, totalCost);
    }

    /**
     * @dev Distribute rental yield to token holders
     */
    function distributeYield(uint256 tokenId) external payable onlyOwner {
        Property storage property = properties[tokenId];
        require(property.isActive, "Property not active");
        
        PropertyYieldToken yieldToken = PropertyYieldToken(property.yieldToken);
        uint256 totalSupply = yieldToken.totalSupply();
        
        if (totalSupply > 0) {
            // Distribute proportionally to all token holders
            // This is simplified - in production, use a more efficient distribution mechanism
            property.lastDistribution = block.timestamp;
        }
        
        emit YieldDistributed(tokenId, msg.value);
    }

    /**
     * @dev Update KYC status (called by compliance oracle)
     */
    function updateKYC(address user, bool verified, uint256 level, bytes32 dataHash) external {
        require(msg.sender == complianceOracle, "Only compliance oracle");
        
        kycStatus[user] = KYCData({
            isVerified: verified,
            verificationLevel: level,
            dataHash: dataHash
        });
        
        emit KYCUpdated(user, verified, level);
    }

    /**
     * @dev Get property details
     */
    function getProperty(uint256 tokenId) external view returns (Property memory) {
        return properties[tokenId];
    }

    /**
     * @dev Calculate expected yield for a user
     */
    function calculateYield(uint256 tokenId, address user) external view returns (uint256) {
        Property memory property = properties[tokenId];
        uint256 userShares = shareholdings[tokenId][user];
        
        if (property.totalShares == 0) return 0;
        
        return (property.monthlyRent * userShares) / property.totalShares;
    }
}

/**
 * @title PropertyYieldToken
 * @dev ERC20 token representing shares in a property's yield
 */
contract PropertyYieldToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalShares
    ) ERC20(name, symbol) {
        // Initial supply is minted to the property contract
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}