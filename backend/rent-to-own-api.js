const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
app.use(cors());
app.use(express.json());

// Contract addresses (update after deployment)
const RENT_TO_OWN_ADAPTER_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO: Update after deployment
const PROPERTY_SHARE_ADDRESSES = {
  "1": "0x0000000000000000000000000000000000000001", // Manhattan
  "2": "0x0000000000000000000000000000000000000002", // Miami  
  "3": "0x0000000000000000000000000000000000000003", // Austin
};

// Contract ABIs
const RENT_TO_OWN_ADAPTER_ABI = [
  {
    "inputs": [{"name": "_tenant", "type": "address"}, {"name": "_propertyShare", "type": "address"}],
    "name": "getTenantProgress",
    "outputs": [
      {"name": "currentOwnership", "type": "uint256"},
      {"name": "targetOwnership", "type": "uint256"},
      {"name": "totalRentPaid", "type": "uint256"},
      {"name": "totalRentNeeded", "type": "uint256"},
      {"name": "progressPercentage", "type": "uint256"},
      {"name": "goalReached", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_tenant", "type": "address"}],
    "name": "getTenantSchedules",
    "outputs": [{"name": "", "type": "bytes32[]"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const PROPERTY_SHARE_ABI = [
  {
    "inputs": [{"name": "tenant", "type": "address"}],
    "name": "getOwnershipPercentage",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tenant", "type": "address"}],
    "name": "getEquityValue",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tenant", "type": "address"}],
    "name": "getTenantStats",
    "outputs": [
      {"name": "shares", "type": "uint256"},
      {"name": "totalRent", "type": "uint256"},
      {"name": "ownershipBasisPoints", "type": "uint256"},
      {"name": "equityValue", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Setup provider
const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org');

// Get tenant's rent-to-own progress for a specific property
app.get('/api/rent-to-own/progress/:tenantAddress/:propertyId', async (req, res) => {
  try {
    const { tenantAddress, propertyId } = req.params;
    
    if (!ethers.isAddress(tenantAddress)) {
      return res.status(400).json({ error: 'Invalid tenant address' });
    }
    
    const propertyShareAddress = PROPERTY_SHARE_ADDRESSES[propertyId];
    if (!propertyShareAddress) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }
    
    // Get contracts
    const rentToOwnAdapter = new ethers.Contract(RENT_TO_OWN_ADAPTER_ADDRESS, RENT_TO_OWN_ADAPTER_ABI, provider);
    const propertyShare = new ethers.Contract(propertyShareAddress, PROPERTY_SHARE_ABI, provider);
    
    // Get tenant progress from RentToOwnAdapter
    const progress = await rentToOwnAdapter.getTenantProgress(tenantAddress, propertyShareAddress);
    
    // Get detailed stats from PropertyShare
    const stats = await propertyShare.getTenantStats(tenantAddress);
    
    const result = {
      propertyId,
      tenantAddress,
      currentOwnership: progress.currentOwnership.toString(),
      targetOwnership: progress.targetOwnership.toString(),
      totalRentPaid: ethers.formatEther(progress.totalRentPaid),
      totalRentNeeded: ethers.formatEther(progress.totalRentNeeded),
      progressPercentage: progress.progressPercentage.toString(),
      goalReached: progress.goalReached,
      shares: ethers.formatEther(stats.shares),
      equityValue: ethers.formatEther(stats.equityValue),
      ownershipPercentage: (Number(stats.ownershipBasisPoints) / 100).toFixed(2) // Convert basis points to percentage
    };
    
    res.json(result);
    
  } catch (error) {
    console.error('Error fetching rent-to-own progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress data' });
  }
});

// Get all rent-to-own schedules for a tenant
app.get('/api/rent-to-own/schedules/:tenantAddress', async (req, res) => {
  try {
    const { tenantAddress } = req.params;
    
    if (!ethers.isAddress(tenantAddress)) {
      return res.status(400).json({ error: 'Invalid tenant address' });
    }
    
    const rentToOwnAdapter = new ethers.Contract(RENT_TO_OWN_ADAPTER_ADDRESS, RENT_TO_OWN_ADAPTER_ABI, provider);
    
    // Get tenant's schedules
    const scheduleIds = await rentToOwnAdapter.getTenantSchedules(tenantAddress);
    
    const schedules = [];
    for (const scheduleId of scheduleIds) {
      // Get schedule details (would need to add getSchedule function to contract)
      schedules.push({
        scheduleId: scheduleId,
        // Add more schedule details here
      });
    }
    
    res.json({ schedules });
    
  } catch (error) {
    console.error('Error fetching rent-to-own schedules:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Calculate rent needed for ownership goal
app.post('/api/rent-to-own/calculate', async (req, res) => {
  try {
    const { propertyId, targetOwnershipPercentage, targetMonths } = req.body;
    
    if (!propertyId || !targetOwnershipPercentage || !targetMonths) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const propertyShareAddress = PROPERTY_SHARE_ADDRESSES[propertyId];
    if (!propertyShareAddress) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }
    
    const rentToOwnAdapter = new ethers.Contract(RENT_TO_OWN_ADAPTER_ADDRESS, RENT_TO_OWN_ADAPTER_ABI, provider);
    const propertyShare = new ethers.Contract(propertyShareAddress, PROPERTY_SHARE_ABI, provider);
    
    // Convert percentage to basis points
    const targetOwnershipBasisPoints = Math.floor(targetOwnershipPercentage * 100);
    
    // Calculate total USDC needed
    const totalUSDCNeeded = await propertyShare.calculateUSDCForOwnership(targetOwnershipBasisPoints);
    
    // Calculate monthly rent needed
    const monthlyRent = await rentToOwnAdapter.calculateRentForOwnership(
      propertyShareAddress,
      targetOwnershipBasisPoints,
      targetMonths
    );
    
    const result = {
      propertyId,
      targetOwnershipPercentage,
      targetMonths,
      totalUSDCNeeded: ethers.formatEther(totalUSDCNeeded),
      monthlyRentNeeded: ethers.formatEther(monthlyRent),
      dailyRentNeeded: ethers.formatEther(monthlyRent / 30n),
      yearlyRentTotal: ethers.formatEther(monthlyRent * 12n)
    };
    
    res.json(result);
    
  } catch (error) {
    console.error('Error calculating rent-to-own:', error);
    res.status(500).json({ error: 'Failed to calculate rent requirements' });
  }
});

// Simulate rent payment and share minting (for testing)
app.post('/api/rent-to-own/simulate-payment', async (req, res) => {
  try {
    const { tenantAddress, propertyId, rentAmount } = req.body;
    
    if (!ethers.isAddress(tenantAddress) || !propertyId || !rentAmount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // This would be called by the payment executor when rent is actually paid
    // For now, just return what would happen
    
    const propertyShareAddress = PROPERTY_SHARE_ADDRESSES[propertyId];
    const propertyShare = new ethers.Contract(propertyShareAddress, PROPERTY_SHARE_ABI, provider);
    
    // Get current stats
    const currentStats = await propertyShare.getTenantStats(tenantAddress);
    
    // Simulate share calculation (this would be done by the contract)
    const rentAmountWei = ethers.parseEther(rentAmount.toString());
    const rentToShareRate = ethers.parseEther("1000"); // 1000 USDC = 1 share (example)
    const newShares = rentAmountWei / rentToShareRate;
    
    const result = {
      tenantAddress,
      propertyId,
      rentPaid: rentAmount,
      sharesEarned: ethers.formatEther(newShares),
      newTotalShares: ethers.formatEther(currentStats.shares + newShares),
      newOwnershipPercentage: ((Number(currentStats.ownershipBasisPoints) + Number(newShares) * 100) / 100).toFixed(2),
      message: "Simulation - actual payment would mint these shares automatically"
    };
    
    res.json(result);
    
  } catch (error) {
    console.error('Error simulating rent payment:', error);
    res.status(500).json({ error: 'Failed to simulate payment' });
  }
});

// Health check
app.get('/api/rent-to-own/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Real-Time Home Ownership API is running',
    contractsDeployed: RENT_TO_OWN_ADAPTER_ADDRESS !== "0x0000000000000000000000000000000000000000"
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🏠 Real-Time Home Ownership API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/rent-to-own/health`);
  
  if (RENT_TO_OWN_ADAPTER_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.log("⚠️  Contracts not deployed yet. Run deployment script first.");
  } else {
    console.log("✅ Contracts configured and ready!");
  }
});