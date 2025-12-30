// Check specific transaction hashes for schedule creation
const { ethers } = require('ethers');

const AUTO_RECURRING_PAYMENTS_ADDRESS = '0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96';

const ABI = [
  "function executePayment(bytes32 scheduleId) external",
  "function isPaymentDue(bytes32 scheduleId) external view returns (bool)",
  "function getSchedule(bytes32 scheduleId) external view returns (tuple(address payer, address recipient, uint256 amount, uint256 interval, uint256 nextPayment, uint256 maxExecutions, uint256 executionsLeft, bool isActive, uint256 createdAt, uint256 executorReward))",
  "event PaymentScheduleCreated(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, uint256 interval, uint256 maxExecutions, uint256 executorReward)",
  "event PaymentExecuted(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, address executor, uint256 reward)"
];

async function checkTransactions() {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
    const contract = new ethers.Contract(AUTO_RECURRING_PAYMENTS_ADDRESS, ABI, provider);
    
    // Known transaction hashes from the context
    const txHashes = [
      '0x6c448f39d188c3e2bcace5607715f6e769bd180f13aff6542a2d874907686e1a425', // Permission grant
      '0x029da5e9d188c3e2bcace5607715f6e769bd180f13aff6542a2d87490780cf5206'  // Schedule creation
    ];
    
    for (const txHash of txHashes) {
      console.log(`\n🔍 Checking transaction: ${txHash}`);
      
      try {
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
          console.log(`❌ Transaction not found`);
          continue;
        }
        
        console.log(`✅ Transaction found in block ${receipt.blockNumber}`);
        console.log(`   Status: ${receipt.status === 1 ? 'Success' : 'Failed'}`);
        console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
        console.log(`   Logs: ${receipt.logs.length}`);
        
        // Parse logs for PaymentScheduleCreated events
        for (const log of receipt.logs) {
          if (log.address.toLowerCase() === AUTO_RECURRING_PAYMENTS_ADDRESS.toLowerCase()) {
            try {
              const parsedLog = contract.interface.parseLog(log);
              console.log(`   📅 Event: ${parsedLog.name}`);
              
              if (parsedLog.name === 'PaymentScheduleCreated') {
                const scheduleId = parsedLog.args.scheduleId;
                console.log(`   🎯 Schedule ID: ${scheduleId}`);
                console.log(`   👤 Payer: ${parsedLog.args.payer}`);
                console.log(`   📍 Recipient: ${parsedLog.args.recipient}`);
                console.log(`   💰 Amount: ${ethers.utils.formatUnits(parsedLog.args.amount, 18)} USDC`);
                console.log(`   ⏰ Interval: ${parsedLog.args.interval} seconds`);
                console.log(`   🔄 Max Executions: ${parsedLog.args.maxExecutions}`);
                console.log(`   🎁 Executor Reward: ${ethers.utils.formatUnits(parsedLog.args.executorReward, 18)} USDC`);
                
                // Check current status
                try {
                  const schedule = await contract.getSchedule(scheduleId);
                  console.log(`   📊 Current Status:`);
                  console.log(`      Active: ${schedule.isActive}`);
                  console.log(`      Executions Left: ${schedule.executionsLeft}`);
                  console.log(`      Next Payment: ${new Date(schedule.nextPayment.toNumber() * 1000).toISOString()}`);
                  
                  const isDue = await contract.isPaymentDue(scheduleId);
                  console.log(`      Payment Due: ${isDue}`);
                  
                  if (isDue) {
                    console.log(`   🚨 THIS PAYMENT IS DUE NOW!`);
                  } else {
                    const nextPaymentTime = new Date(schedule.nextPayment.toNumber() * 1000);
                    const now = new Date();
                    const timeUntilNext = Math.max(0, Math.floor((nextPaymentTime.getTime() - now.getTime()) / 1000));
                    console.log(`   ⏰ Next payment in ${timeUntilNext} seconds`);
                  }
                } catch (error) {
                  console.log(`   ❌ Error getting schedule status: ${error.message}`);
                }
              }
            } catch (parseError) {
              console.log(`   ⚠️ Could not parse log: ${parseError.message}`);
            }
          }
        }
        
      } catch (error) {
        console.log(`❌ Error checking transaction: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTransactions();