// Automated Payment Executor - runs continuously
const { ethers } = require('ethers');

const AUTO_RECURRING_PAYMENTS_ADDRESS = '0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96';
const PRIVATE_KEY = '4f2f402e4fa4fe0b24025ac812e7ff84118b80239728baebe5866795c560fa01';

const ABI = [
  "function executePayment(bytes32 scheduleId) external",
  "function isPaymentDue(bytes32 scheduleId) external view returns (bool)",
  "function getSchedule(bytes32 scheduleId) external view returns (tuple(address payer, address recipient, uint256 amount, uint256 interval, uint256 nextPayment, uint256 maxExecutions, uint256 executionsLeft, bool isActive, uint256 createdAt, uint256 executorReward))",
  "function getUserSchedules(address _user) external view returns (bytes32[] memory)"
];

class AutomatedPaymentExecutor {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
    this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(AUTO_RECURRING_PAYMENTS_ADDRESS, ABI, this.wallet);
    this.isRunning = false;
    this.checkInterval = null;
  }

  async start() {
    if (this.isRunning) {
      console.log('🔄 Automated Payment Executor is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting Automated Payment Executor...');
    console.log('📋 Contract:', AUTO_RECURRING_PAYMENTS_ADDRESS);
    console.log('🔑 Executor Address:', this.wallet.address);
    console.log('🌐 Network: Base Sepolia');

    // Start checking for due payments every 10 seconds
    this.checkInterval = setInterval(() => {
      this.checkAndExecuteDuePayments();
    }, 10000);

    console.log('✅ Automated Payment Executor started - checking every 10 seconds');
    
    // Run initial check
    this.checkAndExecuteDuePayments();
  }

  async stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    console.log('🛑 Automated Payment Executor stopped');
  }

  async checkAndExecuteDuePayments() {
    if (!this.isRunning) return;

    try {
      console.log('\n🔍 Checking for due payments...');
      
      // Get schedules for the executor address
      const schedules = await this.contract.getUserSchedules(this.wallet.address);
      console.log(`📋 Found ${schedules.length} total schedules`);
      
      let activeCount = 0;
      let dueCount = 0;
      let executedCount = 0;
      
      for (let i = 0; i < schedules.length; i++) {
        const scheduleId = schedules[i];
        
        try {
          // Check if schedule is active
          const schedule = await this.contract.getSchedule(scheduleId);
          if (!schedule.isActive) {
            continue;
          }
          
          activeCount++;
          
          const isDue = await this.contract.isPaymentDue(scheduleId);
          if (isDue) {
            dueCount++;
            console.log(`💸 Payment due for schedule ${scheduleId.substring(0, 10)}...`);
            console.log(`   Amount: ${ethers.utils.formatUnits(schedule.amount, 18)} USDC`);
            console.log(`   Executions Left: ${schedule.executionsLeft}`);
            
            try {
              const tx = await this.contract.executePayment(scheduleId, {
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
              console.log(`❌ Execution failed for ${scheduleId.substring(0, 10)}...: ${execError.message}`);
            }
          }
        } catch (error) {
          console.log(`⚠️ Error checking schedule ${scheduleId.substring(0, 10)}...: ${error.message}`);
        }
      }
      
      console.log(`📊 Summary: ${activeCount} active, ${dueCount} due, ${executedCount} executed`);
      
      if (executedCount === 0 && dueCount === 0) {
        console.log('😴 No payments due at this time');
      }
      
    } catch (error) {
      console.error('❌ Error checking due payments:', error.message);
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      executorAddress: this.wallet.address,
      contractAddress: AUTO_RECURRING_PAYMENTS_ADDRESS,
      network: 'Base Sepolia',
      lastCheck: new Date().toISOString()
    };
  }
}

// Create and start the automated executor
const executor = new AutomatedPaymentExecutor();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  await executor.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  await executor.stop();
  process.exit(0);
});

// Start the executor
executor.start().catch(error => {
  console.error('❌ Failed to start automated executor:', error);
  process.exit(1);
});