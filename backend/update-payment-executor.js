// Quick fix to update the running PaymentExecutorAgent
const { ethers } = require('ethers');

const AUTO_RECURRING_PAYMENTS_ADDRESS = '0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96';

const ABI = [
  "function executePayment(bytes32 scheduleId) external",
  "function isPaymentDue(bytes32 scheduleId) external view returns (bool)",
  "function getSchedule(bytes32 scheduleId) external view returns (tuple(address payer, address recipient, uint256 amount, uint256 interval, uint256 nextPayment, uint256 maxExecutions, uint256 executionsLeft, bool isActive, uint256 createdAt, uint256 executorReward))",
  "event PaymentScheduleCreated(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, uint256 interval, uint256 maxExecutions, uint256 executorReward)",
  "event PaymentExecuted(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, address executor, uint256 reward)"
];

async function scanForSchedules() {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
    const contract = new ethers.Contract(AUTO_RECURRING_PAYMENTS_ADDRESS, ABI, provider);
    
    const currentBlock = await provider.getBlockNumber();
    console.log(`📊 Current block: ${currentBlock}`);
    
    // Try a much larger range - last 100,000 blocks
    const fromBlock = Math.max(0, currentBlock - 100000);
    
    console.log(`🔍 Scanning blocks ${fromBlock} to ${currentBlock} for payment schedules...`);
    console.log(`📋 Contract address: ${AUTO_RECURRING_PAYMENTS_ADDRESS}`);
    
    const filter = contract.filters.PaymentScheduleCreated();
    const events = await contract.queryFilter(filter, fromBlock, currentBlock);
    
    console.log(`📋 Found ${events.length} payment schedules:`);
    
    if (events.length === 0) {
      console.log('🔍 No events found. Let me try scanning from block 0...');
      
      // Try scanning from block 0 (this might take a while)
      const allEvents = await contract.queryFilter(filter, 0, currentBlock);
      console.log(`📋 Found ${allEvents.length} payment schedules from genesis:`);
      
      for (const event of allEvents) {
        const scheduleId = event.args?.scheduleId;
        if (!scheduleId) continue;
        
        console.log(`\n📅 Schedule ID: ${scheduleId}`);
        console.log(`   Block: ${event.blockNumber}`);
        console.log(`   Transaction: ${event.transactionHash}`);
        
        try {
          const schedule = await contract.getSchedule(scheduleId);
          console.log(`   Payer: ${schedule.payer}`);
          console.log(`   Recipient: ${schedule.recipient}`);
          console.log(`   Amount: ${ethers.utils.formatUnits(schedule.amount, 18)} USDC`);
          console.log(`   Interval: ${schedule.interval} seconds`);
          console.log(`   Executions Left: ${schedule.executionsLeft}`);
          console.log(`   Is Active: ${schedule.isActive}`);
          console.log(`   Next Payment: ${new Date(schedule.nextPayment.toNumber() * 1000).toISOString()}`);
          
          const isDue = await contract.isPaymentDue(scheduleId);
          console.log(`   Payment Due: ${isDue}`);
          
          if (isDue) {
            console.log(`   🚨 THIS PAYMENT IS DUE NOW!`);
          } else {
            const nextPaymentTime = new Date(schedule.nextPayment.toNumber() * 1000);
            const now = new Date();
            const timeUntilNext = Math.max(0, Math.floor((nextPaymentTime.getTime() - now.getTime()) / 1000));
            console.log(`   ⏰ Next payment in ${timeUntilNext} seconds`);
          }
        } catch (error) {
          console.log(`   ❌ Error getting schedule details: ${error.message}`);
        }
      }
      return;
    }
    
    for (const event of events) {
      const scheduleId = event.args?.scheduleId;
      if (!scheduleId) continue;
      
      console.log(`\n📅 Schedule ID: ${scheduleId}`);
      console.log(`   Block: ${event.blockNumber}`);
      console.log(`   Transaction: ${event.transactionHash}`);
      
      try {
        const schedule = await contract.getSchedule(scheduleId);
        console.log(`   Payer: ${schedule.payer}`);
        console.log(`   Recipient: ${schedule.recipient}`);
        console.log(`   Amount: ${ethers.utils.formatUnits(schedule.amount, 18)} USDC`);
        console.log(`   Interval: ${schedule.interval} seconds`);
        console.log(`   Executions Left: ${schedule.executionsLeft}`);
        console.log(`   Is Active: ${schedule.isActive}`);
        console.log(`   Next Payment: ${new Date(schedule.nextPayment.toNumber() * 1000).toISOString()}`);
        
        const isDue = await contract.isPaymentDue(scheduleId);
        console.log(`   Payment Due: ${isDue}`);
        
        if (isDue) {
          console.log(`   🚨 THIS PAYMENT IS DUE NOW!`);
        } else {
          const nextPaymentTime = new Date(schedule.nextPayment.toNumber() * 1000);
          const now = new Date();
          const timeUntilNext = Math.max(0, Math.floor((nextPaymentTime.getTime() - now.getTime()) / 1000));
          console.log(`   ⏰ Next payment in ${timeUntilNext} seconds`);
        }
      } catch (error) {
        console.log(`   ❌ Error getting schedule details: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error scanning for schedules:', error.message);
  }
}

scanForSchedules();