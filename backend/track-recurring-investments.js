// Track recurring investment executions and update investment data
const { ethers } = require('ethers');

const AUTO_RECURRING_PAYMENTS_ADDRESS = '0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96';

const ABI = [
  "event PaymentExecuted(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, address executor, uint256 reward)"
];

// Property address to ID mapping
const PROPERTY_ADDRESSES = {
  '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be': { id: '1', name: 'Manhattan Luxury Apartments' },
  '0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968': { id: '2', name: 'Miami Beach Condos' },
  '0xC8d4c8d4C8d4c8d4C8d4c8d4C8d4c8d4C8d4c8d4': { id: '3', name: 'Austin Tech Hub' },
  '0xD9e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5': { id: '4', name: 'Seattle Warehouse' },
  '0xE0f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6': { id: '5', name: 'Denver Mountain Resort' },
  '0xF1a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7': { id: '6', name: 'Chicago Downtown Lofts' },
  '0xA2b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8': { id: '7', name: 'Los Angeles Studio Complex' }
};

async function trackRecurringInvestments() {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
    const contract = new ethers.Contract(AUTO_RECURRING_PAYMENTS_ADDRESS, ABI, provider);
    
    console.log('📊 Starting recurring investment tracker...');
    console.log('📋 Contract:', AUTO_RECURRING_PAYMENTS_ADDRESS);
    
    // Get recent PaymentExecuted events
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000); // Last 10k blocks
    
    console.log(`🔍 Scanning blocks ${fromBlock} to ${currentBlock} for PaymentExecuted events...`);
    
    const filter = contract.filters.PaymentExecuted();
    const events = await contract.queryFilter(filter, fromBlock, currentBlock);
    
    console.log(`📋 Found ${events.length} payment execution events`);
    
    // Group payments by payer and recipient (property)
    const investmentSummary = {};
    
    for (const event of events) {
      const { scheduleId, payer, recipient, amount, executor, reward } = event.args;
      const property = PROPERTY_ADDRESSES[recipient];
      
      if (!property) {
        console.log(`⚠️ Unknown property address: ${recipient}`);
        continue;
      }
      
      const key = `${payer}_${property.id}`;
      if (!investmentSummary[key]) {
        investmentSummary[key] = {
          payer,
          propertyId: property.id,
          propertyName: property.name,
          propertyAddress: recipient,
          totalAmount: 0,
          executionCount: 0,
          lastExecution: null
        };
      }
      
      investmentSummary[key].totalAmount += parseFloat(ethers.utils.formatUnits(amount, 18));
      investmentSummary[key].executionCount++;
      investmentSummary[key].lastExecution = new Date(event.blockNumber * 12 * 1000).toISOString(); // Approximate timestamp
      
      console.log(`💰 Payment: ${ethers.utils.formatUnits(amount, 18)} USDC to ${property.name} from ${payer}`);
    }
    
    // Display summary
    console.log('\n📊 Investment Summary:');
    for (const [key, investment] of Object.entries(investmentSummary)) {
      console.log(`\n👤 Investor: ${investment.payer}`);
      console.log(`🏢 Property: ${investment.propertyName} (ID: ${investment.propertyId})`);
      console.log(`💰 Total Invested: ${investment.totalAmount} USDC`);
      console.log(`🔄 Executions: ${investment.executionCount}`);
      console.log(`⏰ Last Execution: ${investment.lastExecution}`);
      
      // Calculate shares (simplified: $100 per 1% share)
      const shares = (investment.totalAmount / 100).toFixed(1);
      console.log(`📊 Estimated Shares: ${shares}%`);
      
      // Generate localStorage update command for frontend
      const investmentKey = `investment_${investment.payer}_${investment.propertyId}`;
      const investmentData = {
        amount: `$${investment.totalAmount}`,
        shares: `${shares}%`,
        lastUpdate: new Date().toISOString(),
        type: 'recurring',
        executionCount: investment.executionCount
      };
      
      console.log(`📝 Frontend Update: localStorage.setItem('${investmentKey}', '${JSON.stringify(investmentData)}')`);
    }
    
    // Save summary to file for frontend integration
    const fs = require('fs');
    fs.writeFileSync('recurring-investments-summary.json', JSON.stringify(investmentSummary, null, 2));
    console.log('\n💾 Summary saved to recurring-investments-summary.json');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

trackRecurringInvestments();