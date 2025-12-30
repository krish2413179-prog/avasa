// Try to find active schedules using different approaches
const { ethers } = require('ethers');

const AUTO_RECURRING_PAYMENTS_ADDRESS = '0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96';

const ABI = [
  "function executePayment(bytes32 scheduleId) external",
  "function isPaymentDue(bytes32 scheduleId) external view returns (bool)",
  "function getSchedule(bytes32 scheduleId) external view returns (tuple(address payer, address recipient, uint256 amount, uint256 interval, uint256 nextPayment, uint256 maxExecutions, uint256 executionsLeft, bool isActive, uint256 createdAt, uint256 executorReward))",
  "function getUserSchedules(address _user) external view returns (bytes32[] memory)",
  "event PaymentScheduleCreated(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, uint256 interval, uint256 maxExecutions, uint256 executorReward)"
];

async function findActiveSchedules() {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
    const contract = new ethers.Contract(AUTO_RECURRING_PAYMENTS_ADDRESS, ABI, provider);
    
    console.log('🔍 Searching for active schedules...');
    
    // Try to get schedules for known user addresses
    const knownAddresses = [
      '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c', // Executor address
      '0x6c448f39d188c3e2bcace5607715f6e769bd180f', // From context (might be user address)
      '0x029da5e9d188c3e2bcace5607715f6e769bd180f'  // From context (might be user address)
    ];
    
    for (const address of knownAddresses) {
      console.log(`\n👤 Checking schedules for ${address}:`);
      try {
        const schedules = await contract.getUserSchedules(address);
        console.log(`   Found ${schedules.length} schedules`);
        
        for (let i = 0; i < schedules.length; i++) {
          const scheduleId = schedules[i];
          console.log(`\n   📅 Schedule ${i + 1}: ${scheduleId}`);
          
          try {
            const schedule = await contract.getSchedule(scheduleId);
            console.log(`      Payer: ${schedule.payer}`);
            console.log(`      Recipient: ${schedule.recipient}`);
            console.log(`      Amount: ${ethers.utils.formatUnits(schedule.amount, 18)} USDC`);
            console.log(`      Interval: ${schedule.interval} seconds`);
            console.log(`      Executions Left: ${schedule.executionsLeft}`);
            console.log(`      Is Active: ${schedule.isActive}`);
            console.log(`      Next Payment: ${new Date(schedule.nextPayment.toNumber() * 1000).toISOString()}`);
            
            const isDue = await contract.isPaymentDue(scheduleId);
            console.log(`      Payment Due: ${isDue}`);
            
            if (isDue) {
              console.log(`      🚨 THIS PAYMENT IS DUE NOW!`);
            } else if (schedule.isActive) {
              const nextPaymentTime = new Date(schedule.nextPayment.toNumber() * 1000);
              const now = new Date();
              const timeUntilNext = Math.max(0, Math.floor((nextPaymentTime.getTime() - now.getTime()) / 1000));
              console.log(`      ⏰ Next payment in ${timeUntilNext} seconds`);
            }
          } catch (error) {
            console.log(`      ❌ Error getting schedule details: ${error.message}`);
          }
        }
      } catch (error) {
        console.log(`   ❌ Error getting user schedules: ${error.message}`);
      }
    }
    
    // Try scanning much older blocks (in chunks to avoid rate limits)
    console.log('\n🔍 Scanning older blocks for events...');
    const currentBlock = await provider.getBlockNumber();
    
    // Try different block ranges
    const ranges = [
      { from: currentBlock - 200000, to: currentBlock - 100000, name: '100k-200k blocks ago' },
      { from: currentBlock - 300000, to: currentBlock - 200000, name: '200k-300k blocks ago' },
      { from: currentBlock - 500000, to: currentBlock - 300000, name: '300k-500k blocks ago' }
    ];
    
    for (const range of ranges) {
      if (range.from < 0) continue;
      
      console.log(`\n📋 Checking ${range.name} (blocks ${range.from} to ${range.to})...`);
      try {
        const filter = contract.filters.PaymentScheduleCreated();
        const events = await contract.queryFilter(filter, range.from, range.to);
        console.log(`   Found ${events.length} events`);
        
        if (events.length > 0) {
          console.log('   🎉 Found payment schedule events!');
          for (const event of events) {
            const scheduleId = event.args.scheduleId;
            console.log(`   📅 Block ${event.blockNumber}: ${scheduleId}`);
            
            // Check if this schedule is still active
            try {
              const schedule = await contract.getSchedule(scheduleId);
              if (schedule.isActive) {
                console.log(`      ✅ Still active! Executions left: ${schedule.executionsLeft}`);
                const isDue = await contract.isPaymentDue(scheduleId);
                if (isDue) {
                  console.log(`      🚨 PAYMENT IS DUE NOW!`);
                }
              } else {
                console.log(`      ⏸️ Inactive`);
              }
            } catch (error) {
              console.log(`      ❌ Error checking schedule: ${error.message}`);
            }
          }
          break; // Found events, no need to check older ranges
        }
      } catch (error) {
        console.log(`   ⚠️ Error scanning range: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findActiveSchedules();