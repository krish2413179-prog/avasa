// Test contract connection and basic functionality
const { ethers } = require('ethers');

const AUTO_RECURRING_PAYMENTS_ADDRESS = '0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96';

const ABI = [
  "function getContractStats() external view returns (uint256 activeSchedules, uint256 totalSchedules, address usdcTokenAddress)",
  "function getUserPermissions(address _user) external view returns (tuple(uint256 maxAmountPerPayment, uint256 maxTotalAmount, uint256 totalSpent, bool isApproved, uint256 approvedUntil))",
  "event PaymentScheduleCreated(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, uint256 interval, uint256 maxExecutions, uint256 executorReward)"
];

async function testContract() {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
    const contract = new ethers.Contract(AUTO_RECURRING_PAYMENTS_ADDRESS, ABI, provider);
    
    console.log('🔗 Testing contract connection...');
    console.log(`📋 Contract: ${AUTO_RECURRING_PAYMENTS_ADDRESS}`);
    console.log(`🌐 Network: Base Sepolia`);
    
    // Test basic contract call
    try {
      const stats = await contract.getContractStats();
      console.log('✅ Contract connection successful!');
      console.log(`📊 Active Schedules: ${stats.activeSchedules}`);
      console.log(`📊 Total Schedules: ${stats.totalSchedules}`);
      console.log(`💰 USDC Token: ${stats.usdcTokenAddress}`);
    } catch (error) {
      console.log('❌ Contract call failed:', error.message);
      return;
    }
    
    // Test user permissions for a known address (from context)
    const testAddress = '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c'; // Executor address
    try {
      const permissions = await contract.getUserPermissions(testAddress);
      console.log(`\n👤 Permissions for ${testAddress}:`);
      console.log(`   Max Per Payment: ${ethers.utils.formatUnits(permissions.maxAmountPerPayment, 18)} USDC`);
      console.log(`   Max Total: ${ethers.utils.formatUnits(permissions.maxTotalAmount, 18)} USDC`);
      console.log(`   Total Spent: ${ethers.utils.formatUnits(permissions.totalSpent, 18)} USDC`);
      console.log(`   Is Approved: ${permissions.isApproved}`);
      console.log(`   Approved Until: ${new Date(permissions.approvedUntil.toNumber() * 1000).toISOString()}`);
    } catch (error) {
      console.log(`⚠️ Could not get permissions: ${error.message}`);
    }
    
    // Check recent blocks for any events (smaller range)
    console.log('\n🔍 Checking recent blocks for events...');
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000); // Last 10k blocks
    
    try {
      const filter = contract.filters.PaymentScheduleCreated();
      const events = await contract.queryFilter(filter, fromBlock, currentBlock);
      console.log(`📋 Found ${events.length} PaymentScheduleCreated events in last 10k blocks`);
      
      if (events.length > 0) {
        console.log('🎉 Recent payment schedules found!');
        for (const event of events) {
          console.log(`   📅 Block ${event.blockNumber}: ${event.args.scheduleId}`);
        }
      } else {
        console.log('📭 No recent payment schedules found');
        console.log('💡 This suggests either:');
        console.log('   1. No recurring investments have been created recently');
        console.log('   2. The transactions are older than 10k blocks');
        console.log('   3. The contract deployment is recent and no schedules exist yet');
      }
    } catch (error) {
      console.log(`⚠️ Error checking events: ${error.message}`);
    }
    
    console.log('\n✅ Contract test completed!');
    console.log('💡 To test the PaymentExecutorAgent:');
    console.log('   1. Create a new recurring investment from the frontend');
    console.log('   2. The agent should detect it within 10 seconds');
    console.log('   3. Check if payments execute automatically');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testContract();