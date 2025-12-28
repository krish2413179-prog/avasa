/**
 * Payment Executor Agent - Automated recurring payment execution
 * Monitors AutoRecurringPayments contract and executes due payments
 */

import { ethers } from 'ethers';
import { AUTO_RECURRING_PAYMENTS_ADDRESS } from '../../../shared/constants-deployed';

const ABI = [
  "function executePayment(bytes32 scheduleId) external",
  "function isPaymentDue(bytes32 scheduleId) external view returns (bool)",
  "function getSchedule(bytes32 scheduleId) external view returns (tuple(address payer, address recipient, uint256 amount, uint256 interval, uint256 nextPayment, uint256 maxExecutions, uint256 executionsLeft, bool isActive, uint256 createdAt, uint256 executorReward))",
  "event PaymentScheduleCreated(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, uint256 interval, uint256 maxExecutions, uint256 executorReward)",
  "event PaymentExecuted(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, address executor, uint256 reward)"
];

export class PaymentExecutorAgent {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  private isRunning: boolean = false;
  private checkInterval: NodeJS.Timeout | null = null;
  private knownSchedules: Set<string> = new Set();

  constructor(privateKey: string, rpcUrl: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(AUTO_RECURRING_PAYMENTS_ADDRESS, ABI, this.wallet);
  }

  async start() {
    if (this.isRunning) {
      console.log('Payment Executor Agent is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting Payment Executor Agent...');
    console.log('📋 Contract:', AUTO_RECURRING_PAYMENTS_ADDRESS);
    console.log('🔑 Executor Address:', this.wallet.address);

    // Test: Check if we can query a known schedule ID
    try {
      const knownScheduleId = '0x8bf2b1bbba1e7e106df763f63386fc12851951699f85cfcb5f116c354ec04ff3';
      console.log('🧪 Testing known schedule ID:', knownScheduleId);
      
      const schedule = await this.contract.getSchedule(knownScheduleId);
      if (schedule.isActive) {
        console.log('✅ Found active schedule!');
        console.log('📍 Payer:', schedule.payer);
        console.log('📍 Recipient:', schedule.recipient);
        console.log('💰 Amount:', ethers.utils.formatUnits(schedule.amount, 18), 'USDC');
        console.log('⏰ Interval:', schedule.interval.toString(), 'seconds');
        console.log('🔄 Executions Left:', schedule.executionsLeft.toString());
        console.log('📅 Next Payment:', new Date(schedule.nextPayment.toNumber() * 1000).toISOString());
        
        const isDue = await this.contract.isPaymentDue(knownScheduleId);
        console.log('💸 Payment Due:', isDue);
      } else {
        console.log('❌ Schedule not active or not found');
      }
    } catch (error) {
      console.log('⚠️ Error testing known schedule:', error.message);
    }

    // Listen for new payment schedules
    this.contract.on('PaymentScheduleCreated', (scheduleId, payer, recipient, amount, interval, maxExecutions, executorReward) => {
      console.log('📅 New payment schedule created:', scheduleId);
      this.knownSchedules.add(scheduleId);
    });

    // Start checking for due payments every 10 seconds
    this.checkInterval = setInterval(() => {
      this.checkDuePayments();
    }, 10000);

    console.log('✅ Payment Executor Agent started - checking every 10 seconds');
  }

  async stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    this.contract.removeAllListeners();
    console.log('🛑 Payment Executor Agent stopped');
  }

  private async checkDuePayments() {
    if (!this.isRunning) return;

    try {
      console.log('🔍 Checking for due payments...');
      
      // First, check the known schedule ID directly
      const knownScheduleId = '0x8bf2b1bbba1e7e106df763f63386fc12851951699f85cfcb5f116c354ec04ff3';
      try {
        const isDue = await this.contract.isPaymentDue(knownScheduleId);
        if (isDue) {
          console.log(`💸 Known schedule payment is due! Executing...`);
          await this.executePayment(knownScheduleId);
          return; // Exit early if we executed a payment
        } else {
          const schedule = await this.contract.getSchedule(knownScheduleId);
          if (schedule.isActive) {
            const nextPaymentTime = new Date(schedule.nextPayment.toNumber() * 1000);
            const now = new Date();
            const timeUntilNext = Math.max(0, Math.floor((nextPaymentTime.getTime() - now.getTime()) / 1000));
            console.log(`⏰ Known schedule next payment in ${timeUntilNext} seconds`);
          }
        }
      } catch (error) {
        console.log(`⚠️ Error checking known schedule:`, error.message);
      }
      
      // Then scan for other schedules
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 5000); // Check last 5000 blocks
      
      console.log(`📋 Scanning blocks ${fromBlock} to ${currentBlock} for other schedules...`);
      
      try {
        const filter = this.contract.filters.PaymentScheduleCreated();
        const events = await this.contract.queryFilter(filter, fromBlock, currentBlock);
        console.log(`📋 Found ${events.length} other payment schedules`);
        
        for (const event of events) {
          const scheduleId = event.args?.scheduleId;
          if (!scheduleId || scheduleId === knownScheduleId) continue; // Skip known schedule

          try {
            const isDue = await this.contract.isPaymentDue(scheduleId);
            if (isDue) {
              console.log(`💸 Payment due for schedule ${scheduleId.substring(0, 10)}...`);
              await this.executePayment(scheduleId);
            }
          } catch (error) {
            console.log(`⚠️ Error checking schedule ${scheduleId.substring(0, 10)}...:`, error.message);
          }
        }
      } catch (filterError) {
        console.log(`⚠️ Error scanning for other schedules:`, filterError.message);
      }
    } catch (error) {
      console.error('❌ Error checking due payments:', error.message);
    }
  }

  private async executePayment(scheduleId: string) {
    try {
      // Get schedule details first
      const schedule = await this.contract.getSchedule(scheduleId);
      
      console.log('📤 From:', schedule.payer);
      console.log('📥 To:', schedule.recipient);
      console.log('💰 Amount:', ethers.utils.formatUnits(schedule.amount, 18), 'USDC');
      console.log('🔄 Executing payment for schedule', scheduleId.substring(0, 10) + '...');

      const tx = await this.contract.executePayment(scheduleId, {
        gasLimit: 500000
      });

      console.log('📤 Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      
      console.log('✅ Payment executed successfully!');
      console.log('🔗 Transaction Hash:', tx.hash);
      console.log('🌐 Explorer Link:', `https://sepolia.basescan.org/tx/${tx.hash}`);
      console.log('💰 Amount:', ethers.utils.formatUnits(schedule.amount, 18), 'USDC sent to', schedule.recipient);
      console.log('🎁 Executor Reward:', ethers.utils.formatUnits(schedule.executorReward, 18), 'USDC earned');
      console.log('⏰ Next Payment:', new Date((schedule.nextPayment.toNumber() + schedule.interval.toNumber()) * 1000).toISOString());
      console.log('🔄 Executions Left:', schedule.executionsLeft.toNumber() - 1);

      // Log execution details
      const executionLog = {
        timestamp: new Date().toISOString(),
        scheduleId,
        payer: schedule.payer,
        recipient: schedule.recipient,
        amount: ethers.formatUnits(schedule.amount, 18),
        executorReward: ethers.formatUnits(schedule.executorReward, 18),
        txHash: tx.hash,
        executedBy: this.wallet.address,
        nextPayment: new Date((schedule.nextPayment.toNumber() + schedule.interval.toNumber()) * 1000).toISOString(),
        executionsLeft: schedule.executionsLeft.toNumber() - 1
      };

      console.log('📊 Payment Execution Log:', JSON.stringify(executionLog, null, 2));

    } catch (error: any) {
      console.error('❌ Failed to execute payment:', error.message);
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

let paymentExecutor: PaymentExecutorAgent | null = null;

export function getPaymentExecutor(): PaymentExecutorAgent | null {
  return paymentExecutor;
}

export function initializePaymentExecutor(privateKey: string, rpcUrl: string): PaymentExecutorAgent {
  if (!paymentExecutor) {
    paymentExecutor = new PaymentExecutorAgent(privateKey, rpcUrl);
  }
  return paymentExecutor;
}