// Execute due payments directly
const { ethers } = require('ethers');

const AUTO_RECURRING_PAYMENTS_ADDRESS = '0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96';
const PRIVATE_KEY = '4f2f402e4fa4fe0b24025ac812e7ff84118b80239728baebe5866795c560fa01';

const ABI = [
  "function executePayment(bytes32 scheduleId) external",
  "function isPaymentDue(bytes32 scheduleId) external view returns (bool)",
  "function getSchedule(bytes32 scheduleId) external view returns (tuple(address payer, address recipient, uint256 amount, uint256 interval, uint256 nextPayment, uint256 maxExecutions, uint256 executionsLeft, bool isActive, uint256 createdAt, uint256 executorReward))",
  "function getUserSchedules(address _user) external view returns (bytes32[] memory)"
];

async function executeDuePayments() {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(AUTO_RECURRING_PAYMENTS_ADDRESS, ABI, wallet);
    
    console.log('🚀 Starting payment execution...');
    console.log('🔑 Executor Address:', wallet.address);
    console.log('📋 Contract:', AUTO_RECURRING_PAYMENTS_ADDRESS);
    
    // Get schedules for the executor address
    const schedules = await contract.getUserSchedules(wallet.address);
    console.log(`📋 Found ${schedules.length} schedules`);
    
    let executedCount = 0;
    
    for (let i = 0; i < schedules.length; i++) {
      const scheduleId = schedules[i];
      console.log(`\n🔍 Checking schedule ${i + 1}/${schedules.length}: ${scheduleId.substring(0, 10)}...`);
      
      try {
        // Check if schedule is active and due
        const schedule = await contract.getSchedule(scheduleId);
        if (!schedule.isActive) {
          console.log(`⏸️ Schedule inactive`);
          continue;
        }
        
        console.log(`📊 Details:`);
        console.log(`   Amount: ${ethers.utils.formatUnits(schedule.amount, 18)} USDC`);
        console.log(`   Executions Left: ${schedule.executionsLeft}`);
        console.log(`   Next Payment: ${new Date(schedule.nextPayment.toNumber() * 1000).toISOString()}`);
        
        const isDue = await contract.isPaymentDue(scheduleId);
        if (isDue) {
          console.log(`💸 Payment is due! Executing...`);
          
          try {
            const tx = await contract.executePayment(scheduleId, {
              gasLimit: 500000
            });
            
            console.log(`📤 Transaction sent: ${tx.hash}`);
            const receipt = await tx.wait();
            
            console.log(`✅ Payment executed successfully!`);
            console.log(`🔗 Transaction: https://sepolia.basescan.org/tx/${tx.hash}`);
            console.log(`💰 Amount: ${ethers.utils.formatUnits(schedule.amount, 18)} USDC`);
            console.log(`🎁 Executor Reward: ${ethers.utils.formatUnits(schedule.executorReward, 18)} USDC`);
            
            executedCount++;
            
            // Wait a bit between executions to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 2000));
            
          } catch (execError) {
            console.log(`❌ Execution failed: ${execError.message}`);
          }
        } else {
          const nextPaymentTime = new Date(schedule.nextPayment.toNumber() * 1000);
          const now = new Date();
          const timeUntilNext = Math.max(0, Math.floor((nextPaymentTime.getTime() - now.getTime()) / 1000));
          console.log(`⏰ Next payment in ${timeUntilNext} seconds`);
        }
      } catch (error) {
        console.log(`⚠️ Error checking schedule: ${error.message}`);
      }
    }
    
    console.log(`\n🎉 Execution complete! Executed ${executedCount} payments.`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

executeDuePayments();