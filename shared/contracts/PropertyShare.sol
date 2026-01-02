// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PropertyShare
 * @dev ERC20 token representing fractional ownership in a property
 * Only the RentToOwnAdapter can mint new shares when rent is paid
 */
contract PropertyShare is ERC20, Ownable {
    uint256 public constant TOTAL_PROPERTY_VALUE = 1000000 * 10**18; // $1M property in 18 decimals
    uint256 public constant MAX_SUPPLY = 100 * 10**18; // 100 shares max (1 share = 1% ownership)
    
    address public rentToOwnAdapter;
    
    event SharesMinted(address indexed tenant, uint256 rentPaid, uint256 sharesMinted);
    
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
    
    /**
     * @dev Set the RentToOwnAdapter contract address (only owner)
     */
    function setRentToOwnAdapter(address _adapter) external onlyOwner {
        rentToOwnAdapter = _adapter;
    }
    
    /**
     * @dev Mint shares to tenant based on rent paid
     * Only callable by RentToOwnAdapter
     * Exchange Rate: 10,000 USDC rent = 1 share (1% ownership)
     */
    function rewardTenant(address tenant, uint256 rentPaid) external {
        require(msg.sender == rentToOwnAdapter, "Only RentToOwnAdapter can mint");
        require(tenant != address(0), "Invalid tenant address");
        
        // Calculate shares: 10,000 USDC = 1 share
        // rentPaid is in 18 decimals, shares are in 18 decimals
        uint256 shares = (rentPaid * 10**18) / (10000 * 10**18); // Simplified: rentPaid / 10000
        
        require(totalSupply() + shares <= MAX_SUPPLY, "Would exceed max supply");
        
        if (shares > 0) {
            _mint(tenant, shares);
            emit SharesMinted(tenant, rentPaid, shares);
        }
    }
    
    /**
     * @dev Get tenant's ownership percentage (in basis points, 100 = 1%)
     */
    function getOwnershipPercentage(address tenant) external view returns (uint256) {
        if (totalSupply() == 0) return 0;
        return (balanceOf(tenant) * 10000) / (100 * 10**18); // Convert to basis points
    }
    
    /**
     * @dev Get property value represented by tenant's shares
     */
    function getPropertyValue(address tenant) external view returns (uint256) {
        return (balanceOf(tenant) * TOTAL_PROPERTY_VALUE) / (100 * 10**18);
    }
}