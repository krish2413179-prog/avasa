/**
 * Payment Executor Agent - Automated recurring payment execution
 * Monitors AutoRecurringPayments contract and executes due payments
 */

import { ethers } from 'ethers';
import { AUTO_RECURRING_PAYMENTS_ADDRESS } from '../../shared/constants-deployed';

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
      
      // Get recent payment schedule creation events
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 1000); // Check last 1000 blocks
      
      const filter = this.contract.filters.PaymentScheduleCreated();
      const events = await this.contract.queryFilter(filter, fromBlock, currentBlock);
      
      console.log(`📋 Found ${events.length} payment schedules in recent blocks`);

      for (const event of events) {
        const scheduleId = event.args?.scheduleId;
        if (!scheduleId) continue;

        try {
          const isDue = await this.contract.isPaymentDue(scheduleId);
          if (isDue) {
            console.log(`💸 Payment due for schedule ${scheduleId.substring(0, 10)}...`);
            await this.executePayment(scheduleId);
          }
        } catch (error) {
          // Skip individual schedule errors
        }
      }
    } catch (error) {
      console.error('Error checking due payments:', error);
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
      console.log('🔗 Transaction:', `https://sepolia.basescan.org/tx/${tx.hash}`);
      console.log('💰', ethers.utils.formatUnits(schedule.amount, 18), 'USDC sent to', schedule.recipient);
      console.log('🎁', ethers.utils.formatUnits(schedule.executorReward, 18), 'USDC reward earned by executor');

      // Log execution details
      const executionLog = {
        timestamp: new Date().toISOString(),
        scheduleId,
        payer: schedule.payer,
        recipient: schedule.recipient,
        amount: ethers.utils.formatUnits(schedule.amount, 18),
        executorReward: ethers.utils.formatUnits(schedule.executorReward, 18),
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