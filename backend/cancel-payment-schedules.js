// Cancel payment schedules
const { ethers } = require('ethers');

const AUTO_RECURRING_PAYMENTS_ADDRESS = '0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96';
const PRIVATE_KEY = '4f2f402e4fa4fe0b24025ac812e7ff84118b80239728baebe5866795c560fa01';

const ABI = [
  "function cancelPaymentSchedule(bytes32 scheduleId) external",
  "function getSchedule(bytes32 scheduleId) external view returns (tuple(address payer, address recipient, uint256 amount, uint256 interval, uint256 nextPayment, uint256 maxExecutions, uint256 executionsLeft, bool isActive, uint256 createdAt, uint256 executorReward))",
  "function getUserSchedules(address _user) external view returns (bytes32[] memory)"
];

async function cancelSchedules(recipientFilter = null) {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(AUTO_RECURRING_PAYMENTS_ADDRESS, ABI, wallet);
    
    console.log('🛑 Starting payment schedule cancellation...');
    console.log('🔑 Executor Address:', wallet.address);
    console.log('📋 Contract:', AUTO_RECURRING_PAYMENTS_ADDRESS);
    
    if (recipientFilter) {
      console.log('🎯 Filtering by recipient:', recipientFilter);
    } else {
      console.log('🎯 Canceling ALL active schedules');
    }
    
    // Get schedules for the executor address
    const schedules = await contract.getUserSchedules(wallet.address);
    console.log(`📋 Found ${schedules.length} total schedules`);
    
    let activeCount = 0;
    let canceledCount = 0;
    let filteredCount = 0;
    
    for (let i = 0; i < schedules.length; i++) {
      const scheduleId = schedules[i];
      console.log(`\n🔍 Checking schedule ${i + 1}/${schedules.length}: ${scheduleId.substring(0, 10)}...`);
      
      try {
        // Check if schedule is active
        const schedule = await contract.getSchedule(scheduleId);
        if (!schedule.isActive) {
          console.log(`⏸️ Already inactive`);
          continue;
        }
        
        activeCount++;
        console.log(`📊 Active schedule details:`);
        console.log(`   Recipient: ${schedule.recipient}`);
        console.log(`   Amount: ${ethers.utils.formatUnits(schedule.amount, 18)} USDC`);
        console.log(`   Executions Left: ${schedule.executionsLeft}`);
        
        // Apply recipient filter if specified
        if (recipientFilter && schedule.recipient.toLowerCase() !== recipientFilter.toLowerCase()) {
          console.log(`🔄 Skipping - recipient doesn't match filter`);
          filteredCount++;
          continue;
        }
        
        console.log(`🛑 Canceling schedule...`);
        
        try {
          const tx = await contract.cancelPaymentSchedule(scheduleId, {
            gasLimit: 200000
          });
          
          console.log(`📤 Transaction sent: ${tx.hash}`);
          const receipt = await tx.wait();
          
          console.log(`✅ Schedule canceled successfully!`);
          console.log(`🔗 Transaction: https://sepolia.basescan.org/tx/${tx.hash}`);
          
          canceledCount++;
          
          // Wait a bit between cancellations to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (cancelError) {
          console.log(`❌ Cancellation failed: ${cancelError.message}`);
        }
      } catch (error) {
        console.log(`⚠️ Error checking schedule: ${error.message}`);
      }
    }
    
    console.log(`\n🎉 Cancellation complete!`);
    console.log(`📊 Summary:`);
    console.log(`   Total schedules: ${schedules.length}`);
    console.log(`   Active schedules: ${activeCount}`);
    console.log(`   Filtered out: ${filteredCount}`);
    console.log(`   Successfully canceled: ${canceledCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const recipientFilter = args[0] || null;

if (recipientFilter) {
  console.log(`🎯 Canceling payments to: ${recipientFilter}`);
} else {
  console.log(`🛑 Canceling ALL payment schedules`);
}

cancelSchedules(recipientFilter);