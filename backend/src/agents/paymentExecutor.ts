/**
 * Payment Executor Agent - Intelligent automated recurring payment execution
 * Features:
 * - Gas optimization: Only executes when gas is below user-defined thresholds
 * - Safety brakes: Monitors wallet balances and pauses if below minimum
 * - Smart retry logic: Waits for better conditions instead of failing
 * - Event-driven triggers: "If This Then That" (IFTTT) for Web3
 * - Transaction watchtower: Monitors blockchain for trigger events
 */

import { ethers } from 'ethers';
import { AUTO_RECURRING_PAYMENTS_ADDRESS } from '../../../shared/constants-deployed';

const ABI = [
  "function executePayment(bytes32 scheduleId) external",
  "function isPaymentDue(bytes32 scheduleId) external view returns (bool)",
  "function getSchedule(bytes32 scheduleId) external view returns (tuple(address payer, address recipient, uint256 amount, uint256 interval, uint256 nextPayment, uint256 maxExecutions, uint256 executionsLeft, bool isActive, uint256 createdAt, uint256 executorReward))",
  "function getUserSchedules(address _user) external view returns (bytes32[] memory)",
  "event PaymentScheduleCreated(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, uint256 interval, uint256 maxExecutions, uint256 executorReward)",
  "event PaymentExecuted(bytes32 indexed scheduleId, address indexed payer, address indexed recipient, uint256 amount, address executor, uint256 reward)"
];

// USDC Transfer event ABI for monitoring
const USDC_TRANSFER_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

interface SafetyRule {
  scheduleId: string;
  maxGasPrice?: number; // in gwei
  minWalletBalance?: string; // in USDC
  pauseUntilGasBelow?: number; // in gwei
  emergencyBrakeBalance?: string; // in USDC - emergency stop threshold
  retryIntervalMinutes?: number; // how often to retry when conditions not met
  lastRetryAttempt?: number; // timestamp of last retry
  isPaused?: boolean; // manually paused by user
  pauseReason?: string; // reason for pause
}

interface EventTrigger {
  scheduleId: string;
  triggerType: 'usdc_received' | 'eth_received' | 'nft_received' | 'contract_call' | 'price_threshold';
  triggerAddress?: string; // Address to monitor (e.g., USDC contract, sender address)
  triggerAmount?: string; // Minimum amount to trigger
  triggerFrom?: string; // Specific sender address (e.g., Diya's address)
  triggerTo?: string; // Specific recipient address (e.g., your address)
  contractAddress?: string; // Contract to monitor for events
  eventSignature?: string; // Event signature to watch for
  isActive: boolean;
  description: string;
  lastTriggered?: number; // timestamp of last trigger
}

interface GasConditions {
  currentGasPrice: number; // in gwei
  isAcceptable: boolean;
  reason?: string;
}

interface WalletSafety {
  currentBalance: string; // in USDC
  isSafe: boolean;
  reason?: string;
}

export class PaymentExecutorAgent {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  private usdcContract: ethers.Contract;
  private isRunning: boolean = false;
  private checkInterval: NodeJS.Timeout | null = null;
  private knownSchedules: Set<string> = new Set();
  private safetyRules: Map<string, SafetyRule> = new Map(); // scheduleId -> safety rules
  private eventTriggers: Map<string, EventTrigger> = new Map(); // scheduleId -> event trigger
  private gasThresholdGwei: number = 50; // Default max gas price in gwei
  private retryQueue: Set<string> = new Set(); // schedules waiting for better conditions
  private watchtowerActive: boolean = false; // Event monitoring status

  // USDC contract ABI for balance checking and event monitoring
  private static USDC_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
  ];

  constructor(privateKey: string, rpcUrl: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(AUTO_RECURRING_PAYMENTS_ADDRESS, ABI, this.wallet);
    
    // Initialize USDC contract for balance checking and event monitoring
    const USDC_ADDRESS = "0x6B0dacea6a72E759243c99Eaed840DEe9564C194";
    this.usdcContract = new ethers.Contract(USDC_ADDRESS, PaymentExecutorAgent.USDC_ABI, this.provider);
  }

  /**
   * Add event trigger for a specific schedule
   * This enables "If This Then That" (IFTTT) functionality
   */
  addEventTrigger(scheduleId: string, trigger: Partial<EventTrigger>) {
    const eventTrigger: EventTrigger = {
      scheduleId,
      triggerType: trigger.triggerType || 'usdc_received',
      triggerAddress: trigger.triggerAddress,
      triggerAmount: trigger.triggerAmount,
      triggerFrom: trigger.triggerFrom,
      triggerTo: trigger.triggerTo,
      contractAddress: trigger.contractAddress,
      eventSignature: trigger.eventSignature,
      isActive: true,
      description: trigger.description || 'Event trigger',
      ...trigger
    };
    
    this.eventTriggers.set(scheduleId, eventTrigger);
    
    console.log(`🎯 Event trigger added for schedule ${scheduleId.substring(0, 10)}...:`);
    console.log(`   Type: ${eventTrigger.triggerType}`);
    if (eventTrigger.triggerFrom) console.log(`   From: ${eventTrigger.triggerFrom}`);
    if (eventTrigger.triggerTo) console.log(`   To: ${eventTrigger.triggerTo}`);
    if (eventTrigger.triggerAmount) console.log(`   Min Amount: ${eventTrigger.triggerAmount} USDC`);
    console.log(`   Description: ${eventTrigger.description}`);
    
    // Start watchtower if not already active
    if (!this.watchtowerActive) {
      this.startWatchtower();
    }
  }

  /**
   * Remove event trigger for a schedule
   */
  removeEventTrigger(scheduleId: string) {
    this.eventTriggers.delete(scheduleId);
    console.log(`🗑️ Event trigger removed for schedule ${scheduleId.substring(0, 10)}...`);
    
    // Stop watchtower if no triggers remain
    if (this.eventTriggers.size === 0) {
      this.stopWatchtower();
    }
  }

  /**
   * Start the blockchain watchtower for event monitoring
   */
  private startWatchtower() {
    if (this.watchtowerActive) return;
    
    this.watchtowerActive = true;
    console.log('👁️ Starting Blockchain Watchtower...');
    console.log('🔍 Monitoring for trigger events...');
    
    // Listen for USDC Transfer events
    this.usdcContract.on('Transfer', async (from: string, to: string, value: ethers.BigNumber, event: any) => {
      await this.handleUSDCTransfer(from, to, value, event);
    });
    
    // Listen for ETH transfers (if needed)
    this.provider.on('block', async (blockNumber: number) => {
      await this.handleNewBlock(blockNumber);
    });
    
    console.log('✅ Watchtower active - monitoring blockchain events');
  }

  /**
   * Stop the blockchain watchtower
   */
  private stopWatchtower() {
    if (!this.watchtowerActive) return;
    
    this.watchtowerActive = false;
    this.usdcContract.removeAllListeners('Transfer');
    this.provider.removeAllListeners('block');
    
    console.log('🛑 Blockchain Watchtower stopped');
  }

  /**
   * Handle USDC Transfer events - core of the IFTTT system
   */
  private async handleUSDCTransfer(from: string, to: string, value: ethers.BigNumber, event: any) {
    const amount = ethers.utils.formatUnits(value, 18); // USDC has 18 decimals in this setup
    
    console.log(`💰 USDC Transfer detected:`);
    console.log(`   From: ${from}`);
    console.log(`   To: ${to}`);
    console.log(`   Amount: ${amount} USDC`);
    console.log(`   Block: ${event.blockNumber}`);
    console.log(`   Tx: ${event.transactionHash}`);
    
    // Check all event triggers for matches
    for (const [scheduleId, trigger] of this.eventTriggers) {
      if (!trigger.isActive || trigger.triggerType !== 'usdc_received') continue;
      
      // Check if this transfer matches the trigger conditions
      const isMatch = await this.checkTransferTrigger(trigger, from, to, amount);
      
      if (isMatch) {
        console.log(`🎯 Trigger matched for schedule ${scheduleId.substring(0, 10)}...!`);
        console.log(`   Trigger: ${trigger.description}`);
        
        // Execute the triggered payment
        await this.executeTriggeredPayment(scheduleId, trigger, {
          from,
          to,
          amount,
          txHash: event.transactionHash,
          blockNumber: event.blockNumber
        });
      }
    }
  }

  /**
   * Check if a USDC transfer matches trigger conditions
   */
  private async checkTransferTrigger(
    trigger: EventTrigger,
    from: string,
    to: string,
    amount: string
  ): Promise<boolean> {
    // Check sender address (e.g., Diya's address)
    if (trigger.triggerFrom && trigger.triggerFrom.toLowerCase() !== from.toLowerCase()) {
      return false;
    }
    
    // Check recipient address (e.g., your address)
    if (trigger.triggerTo && trigger.triggerTo.toLowerCase() !== to.toLowerCase()) {
      return false;
    }
    
    // Check minimum amount
    if (trigger.triggerAmount && parseFloat(amount) < parseFloat(trigger.triggerAmount)) {
      return false;
    }
    
    return true;
  }

  /**
   * Execute payment triggered by blockchain event
   */
  private async executeTriggeredPayment(
    scheduleId: string,
    trigger: EventTrigger,
    eventData: {
      from: string;
      to: string;
      amount: string;
      txHash: string;
      blockNumber: number;
    }
  ) {
    try {
      console.log(`🚀 Executing triggered payment for schedule ${scheduleId.substring(0, 10)}...`);
      console.log(`   Triggered by: ${eventData.from} → ${eventData.to} (${eventData.amount} USDC)`);
      console.log(`   Trigger tx: ${eventData.txHash}`);
      
      // Perform safety checks before execution
      const schedule = await this.contract.getSchedule(scheduleId);
      const canExecute = await this.performSafetyChecks(scheduleId, schedule.payer);
      
      if (canExecute.safe) {
        console.log(`✅ Safety checks passed - executing triggered payment...`);
        await this.executePayment(scheduleId);
        
        // Update trigger timestamp
        trigger.lastTriggered = Date.now();
        this.eventTriggers.set(scheduleId, trigger);
        
        console.log(`🎉 Triggered payment executed successfully!`);
        console.log(`   Chain reaction: ${eventData.from} paid → Your rent paid automatically`);
        
      } else {
        console.log(`🛡️ Safety check failed for triggered payment: ${canExecute.reason}`);
        
        if (canExecute.shouldRetry) {
          console.log(`🔄 Adding triggered payment to retry queue`);
          this.retryQueue.add(scheduleId);
          this.updateRetryAttempt(scheduleId);
        }
      }
      
    } catch (error) {
      console.error(`❌ Failed to execute triggered payment:`, error);
    }
  }

  /**
   * Add safety rule for a specific schedule
   * This is called when user sets gas limits or emergency brakes
   */
  addSafetyRule(scheduleId: string, rule: Partial<SafetyRule>) {
    const existingRule = this.safetyRules.get(scheduleId) || { scheduleId };
    const updatedRule = { ...existingRule, ...rule };
    this.safetyRules.set(scheduleId, updatedRule);
  /**
   * Add safety rule for a specific schedule
   * This is called when user sets gas limits or emergency brakes
   */
  addSafetyRule(scheduleId: string, rule: Partial<SafetyRule>) {
    const existingRule = this.safetyRules.get(scheduleId) || { scheduleId };
    const updatedRule = { ...existingRule, ...rule };
    this.safetyRules.set(scheduleId, updatedRule);
    
    console.log(`🛡️ Safety rule added for schedule ${scheduleId.substring(0, 10)}...:`);
    if (rule.maxGasPrice) console.log(`   Max Gas Price: ${rule.maxGasPrice} gwei`);
    if (rule.minWalletBalance) console.log(`   Min Wallet Balance: ${rule.minWalletBalance} USDC`);
    if (rule.emergencyBrakeBalance) console.log(`   Emergency Brake: ${rule.emergencyBrakeBalance} USDC`);
    if (rule.retryIntervalMinutes) console.log(`   Retry Interval: ${rule.retryIntervalMinutes} minutes`);
  }

  /**
   * Remove safety rule for a schedule
   */
  removeSafetyRule(scheduleId: string) {
    this.safetyRules.delete(scheduleId);
    this.retryQueue.delete(scheduleId);
    console.log(`🗑️ Safety rule removed for schedule ${scheduleId.substring(0, 10)}...`);
  }

  /**
   * Pause/unpause a specific schedule
   */
  pauseSchedule(scheduleId: string, reason: string = "User requested") {
    const rule = this.safetyRules.get(scheduleId) || { scheduleId };
    rule.isPaused = true;
    rule.pauseReason = reason;
    this.safetyRules.set(scheduleId, rule);
    console.log(`⏸️ Schedule ${scheduleId.substring(0, 10)}... paused: ${reason}`);
  }

  unpauseSchedule(scheduleId: string) {
    const rule = this.safetyRules.get(scheduleId);
    if (rule) {
      rule.isPaused = false;
      rule.pauseReason = undefined;
      this.safetyRules.set(scheduleId, rule);
      console.log(`▶️ Schedule ${scheduleId.substring(0, 10)}... unpaused`);
    }
  }

  /**
   * Check current gas conditions
   */
  private async checkGasConditions(maxGasPrice?: number): Promise<GasConditions> {
    try {
      const feeData = await this.provider.getFeeData();
      const currentGasPriceWei = feeData.gasPrice || ethers.BigNumber.from(0);
      const currentGasGwei = Math.round(parseFloat(ethers.utils.formatUnits(currentGasPriceWei, 'gwei')));
      
      const threshold = maxGasPrice || this.gasThresholdGwei;
      const isAcceptable = currentGasGwei <= threshold;
      
      return {
        currentGasPrice: currentGasGwei,
        isAcceptable,
        reason: isAcceptable ? undefined : `Gas too high: ${currentGasGwei} gwei > ${threshold} gwei`
      };
    } catch (error) {
      console.error('❌ Error checking gas conditions:', error);
      return {
        currentGasPrice: 0,
        isAcceptable: false,
        reason: 'Failed to fetch gas price'
      };
    }
  }

  /**
   * Check wallet safety conditions
   */
  private async checkWalletSafety(payerAddress: string, minBalance?: string, emergencyBalance?: string): Promise<WalletSafety> {
    try {
      const balanceWei = await this.usdcContract.balanceOf(payerAddress);
      const currentBalance = ethers.utils.formatUnits(balanceWei, 18); // USDC has 18 decimals in this setup
      
      // Check emergency brake first (most critical)
      if (emergencyBalance && parseFloat(currentBalance) <= parseFloat(emergencyBalance)) {
        return {
          currentBalance,
          isSafe: false,
          reason: `EMERGENCY BRAKE: Balance ${currentBalance} USDC ≤ emergency threshold ${emergencyBalance} USDC`
        };
      }
      
      // Check minimum balance
      if (minBalance && parseFloat(currentBalance) < parseFloat(minBalance)) {
        return {
          currentBalance,
          isSafe: false,
          reason: `Low balance: ${currentBalance} USDC < minimum ${minBalance} USDC`
        };
      }
      
      return {
        currentBalance,
        isSafe: true
      };
    } catch (error) {
      console.error('❌ Error checking wallet safety:', error);
      return {
        currentBalance: '0',
        isSafe: false,
        reason: 'Failed to check wallet balance'
      };
    }
  }

  /**
   * Check if enough time has passed for retry
   */
  private shouldRetry(scheduleId: string, retryIntervalMinutes: number = 60): boolean {
    const rule = this.safetyRules.get(scheduleId);
    if (!rule || !rule.lastRetryAttempt) return true;
    
    const now = Date.now();
    const timeSinceLastRetry = now - rule.lastRetryAttempt;
    const retryIntervalMs = retryIntervalMinutes * 60 * 1000;
    
    return timeSinceLastRetry >= retryIntervalMs;
  }

  /**
   * Update last retry attempt timestamp
   */
  private updateRetryAttempt(scheduleId: string) {
    const rule = this.safetyRules.get(scheduleId);
    if (rule) {
      rule.lastRetryAttempt = Date.now();
      this.safetyRules.set(scheduleId, rule);
    }
  }

  async start() {
    if (this.isRunning) {
      console.log('Payment Executor Agent is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting Intelligent Payment Executor Agent...');
    console.log('📋 Contract:', AUTO_RECURRING_PAYMENTS_ADDRESS);
    console.log('🔑 Executor Address:', this.wallet.address);
    console.log('🛡️ Safety Features: Gas optimization, Emergency brakes, Smart retries');
    console.log('👁️ Event-Driven: IFTTT (If This Then That) for Web3');

    // Listen for new payment schedules
    this.contract.on('PaymentScheduleCreated', (scheduleId, payer, recipient, amount, interval, maxExecutions, executorReward) => {
      console.log('📅 New payment schedule created:', scheduleId);
      this.knownSchedules.add(scheduleId);
    });

    // Start checking for due payments every 10 seconds (time-based)
    this.checkInterval = setInterval(() => {
      this.checkDuePayments();
    }, 10000);

    // Start watchtower if there are event triggers (event-based)
    if (this.eventTriggers.size > 0) {
      this.startWatchtower();
    }

    console.log('✅ Intelligent Payment Executor Agent started');
    console.log('💡 Features active:');
    console.log('   • Time-based: Checking due payments every 10 seconds');
    console.log('   • Event-based: Monitoring blockchain for trigger events');
    console.log('   • Gas optimization: Only execute when gas is acceptable');
    console.log('   • Safety brakes: Emergency stops and wallet protection');
    console.log('   • Smart retries: Wait for better conditions');
  }

  async stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    // Stop watchtower
    this.stopWatchtower();

    this.contract.removeAllListeners();
    console.log('🛑 Intelligent Payment Executor Agent stopped');
    console.log('   • Time-based monitoring: Stopped');
    console.log('   • Event-based monitoring: Stopped');
    console.log('   • All listeners removed');
  }

  private async checkDuePayments() {
    if (!this.isRunning) return;

    try {
      console.log('🔍 Checking for due payments with intelligent safety checks...');
      
      // Get schedules for the executor address (which seems to be the payer)
      const executorAddress = this.wallet.address;
      console.log(`👤 Checking schedules for executor: ${executorAddress}`);
      
      try {
        const schedules = await this.contract.getUserSchedules(executorAddress);
        console.log(`📋 Found ${schedules.length} schedules for executor`);
        
        if (schedules.length === 0) {
          console.log('📭 No schedules found for executor address');
          return;
        }
        
        // Check each schedule for due payments
        for (let i = 0; i < schedules.length; i++) {
          const scheduleId = schedules[i];
          console.log(`\n🔍 Checking schedule ${i + 1}/${schedules.length}: ${scheduleId.substring(0, 10)}...`);
          
          try {
            // First check if schedule is still active
            const schedule = await this.contract.getSchedule(scheduleId);
            if (!schedule.isActive) {
              console.log(`⏸️ Schedule ${scheduleId.substring(0, 10)}... is inactive`);
              continue;
            }
            
            // Check if manually paused
            const safetyRule = this.safetyRules.get(scheduleId);
            if (safetyRule?.isPaused) {
              console.log(`⏸️ Schedule ${scheduleId.substring(0, 10)}... is paused: ${safetyRule.pauseReason}`);
              continue;
            }
            
            console.log(`📊 Schedule ${scheduleId.substring(0, 10)}... details:`);
            console.log(`   Payer: ${schedule.payer}`);
            console.log(`   Recipient: ${schedule.recipient}`);
            console.log(`   Amount: ${ethers.utils.formatUnits(schedule.amount, 18)} USDC`);
            console.log(`   Interval: ${schedule.interval} seconds`);
            console.log(`   Executions Left: ${schedule.executionsLeft}`);
            console.log(`   Next Payment: ${new Date(schedule.nextPayment.toNumber() * 1000).toISOString()}`);
            
            const isDue = await this.contract.isPaymentDue(scheduleId);
            if (isDue) {
              console.log(`💸 Payment due for schedule ${scheduleId.substring(0, 10)}...!`);
              
              // 🛡️ INTELLIGENT SAFETY CHECKS
              const canExecute = await this.performSafetyChecks(scheduleId, schedule.payer);
              
              if (canExecute.safe) {
                console.log(`✅ Safety checks passed - executing payment...`);
                await this.executePayment(scheduleId);
              } else {
                console.log(`🛡️ Safety check failed: ${canExecute.reason}`);
                
                // Add to retry queue if conditions might improve
                if (canExecute.shouldRetry) {
                  this.retryQueue.add(scheduleId);
                  this.updateRetryAttempt(scheduleId);
                  console.log(`🔄 Added to retry queue - will try again when conditions improve`);
                } else {
                  console.log(`🚫 Permanent block - manual intervention required`);
                }
              }
            } else {
              const nextPaymentTime = new Date(schedule.nextPayment.toNumber() * 1000);
              const now = new Date();
              const timeUntilNext = Math.max(0, Math.floor((nextPaymentTime.getTime() - now.getTime()) / 1000));
              console.log(`⏰ Schedule ${scheduleId.substring(0, 10)}... next payment in ${timeUntilNext} seconds`);
            }
          } catch (error) {
            console.log(`⚠️ Error checking schedule ${scheduleId.substring(0, 10)}...:`, (error as Error).message);
          }
        }
        
        // Check retry queue for schedules waiting for better conditions
        await this.processRetryQueue();
        
      } catch (error) {
        console.log(`⚠️ Error getting user schedules:`, (error as Error).message);
      }
      
    } catch (error) {
      console.error('❌ Error checking due payments:', (error as Error).message);
    }
  }

  /**
   * Perform comprehensive safety checks before executing payment
   */
  private async performSafetyChecks(scheduleId: string, payerAddress: string): Promise<{
    safe: boolean;
    reason?: string;
    shouldRetry: boolean;
  }> {
    const safetyRule = this.safetyRules.get(scheduleId);
    
    // 1. Check gas price conditions
    const gasConditions = await this.checkGasConditions(safetyRule?.maxGasPrice);
    if (!gasConditions.isAcceptable) {
      return {
        safe: false,
        reason: `⛽ ${gasConditions.reason}`,
        shouldRetry: true // Gas prices can improve
      };
    }
    
    // 2. Check wallet safety conditions
    const walletSafety = await this.checkWalletSafety(
      payerAddress,
      safetyRule?.minWalletBalance,
      safetyRule?.emergencyBrakeBalance
    );
    if (!walletSafety.isSafe) {
      const isEmergencyBrake = walletSafety.reason?.includes('EMERGENCY BRAKE');
      return {
        safe: false,
        reason: `💰 ${walletSafety.reason}`,
        shouldRetry: !isEmergencyBrake // Emergency brake is permanent until manual intervention
      };
    }
    
    // 3. Check retry timing (if this schedule was previously blocked)
    if (this.retryQueue.has(scheduleId)) {
      const retryInterval = safetyRule?.retryIntervalMinutes || 60;
      if (!this.shouldRetry(scheduleId, retryInterval)) {
        return {
          safe: false,
          reason: `⏱️ Retry cooldown active - next attempt in ${retryInterval} minutes`,
          shouldRetry: true
        };
      }
      // Remove from retry queue since we're about to execute
      this.retryQueue.delete(scheduleId);
    }
    
    console.log(`🛡️ All safety checks passed:`);
    console.log(`   ⛽ Gas: ${gasConditions.currentGasPrice} gwei (acceptable)`);
    console.log(`   💰 Wallet: ${walletSafety.currentBalance} USDC (safe)`);
    
    return { safe: true, shouldRetry: false };
  }

  /**
   * Process schedules in retry queue to see if conditions have improved
   */
  private async processRetryQueue() {
    if (this.retryQueue.size === 0) return;
    
    console.log(`\n🔄 Processing retry queue (${this.retryQueue.size} schedules)...`);
    
    for (const scheduleId of this.retryQueue) {
      try {
        const schedule = await this.contract.getSchedule(scheduleId);
        if (!schedule.isActive) {
          this.retryQueue.delete(scheduleId);
          continue;
        }
        
        const safetyRule = this.safetyRules.get(scheduleId);
        const retryInterval = safetyRule?.retryIntervalMinutes || 60;
        
        if (this.shouldRetry(scheduleId, retryInterval)) {
          console.log(`🔄 Retrying schedule ${scheduleId.substring(0, 10)}...`);
          
          const canExecute = await this.performSafetyChecks(scheduleId, schedule.payer);
          
          if (canExecute.safe) {
            console.log(`✅ Retry successful - conditions improved!`);
            await this.executePayment(scheduleId);
          } else {
            console.log(`🛡️ Retry failed: ${canExecute.reason}`);
            this.updateRetryAttempt(scheduleId);
          }
        }
      } catch (error) {
        console.log(`⚠️ Error processing retry for ${scheduleId.substring(0, 10)}...:`, (error as Error).message);
      }
    }
  }
      } catch (error) {
        console.log(`⚠️ Error getting user schedules:`, (error as Error).message);
      }
      
    } catch (error) {
      console.error('❌ Error checking due payments:', (error as Error).message);
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

      // Get current gas price for optimal execution
      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice;
      const gasPriceGwei = gasPrice ? Math.round(parseFloat(ethers.utils.formatUnits(gasPrice, 'gwei'))) : 0;
      
      console.log(`⛽ Executing with gas price: ${gasPriceGwei} gwei`);

      const tx = await this.contract.executePayment(scheduleId, {
        gasLimit: 500000,
        gasPrice: gasPrice // Use current optimal gas price
      });

      console.log('📤 Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      
      console.log('✅ Payment executed successfully!');
      console.log('🔗 Transaction Hash:', tx.hash);
      console.log('🌐 Explorer Link:', `https://sepolia.basescan.org/tx/${tx.hash}`);
      console.log('💰 Amount:', ethers.utils.formatUnits(schedule.amount, 18), 'USDC sent to', schedule.recipient);
      console.log('🎁 Executor Reward:', ethers.utils.formatUnits(schedule.executorReward, 18), 'USDC earned');
      console.log(`⛽ Gas Used: ${receipt.gasUsed.toString()} units at ${gasPriceGwei} gwei`);
      console.log('⏰ Next Payment:', new Date((schedule.nextPayment.toNumber() + schedule.interval.toNumber()) * 1000).toISOString());
      console.log('🔄 Executions Left:', schedule.executionsLeft.toNumber() - 1);

      // Log execution details
      const executionLog = {
        timestamp: new Date().toISOString(),
        scheduleId,
        payer: schedule.payer,
        recipient: schedule.recipient,
        amount: ethers.utils.formatUnits(schedule.amount, 18),
        executorReward: ethers.utils.formatUnits(schedule.executorReward, 18),
        txHash: tx.hash,
        gasUsed: receipt.gasUsed.toString(),
        gasPriceGwei: gasPriceGwei,
        executedBy: this.wallet.address,
        nextPayment: new Date((schedule.nextPayment.toNumber() + schedule.interval.toNumber()) * 1000).toISOString(),
        executionsLeft: schedule.executionsLeft.toNumber() - 1,
        safetyChecksEnabled: this.safetyRules.has(scheduleId)
      };

      console.log('📊 Intelligent Payment Execution Log:', JSON.stringify(executionLog, null, 2));

    } catch (error: any) {
      console.error('❌ Failed to execute payment:', error.message);
      
      // If execution fails due to gas, add to retry queue
      if (error.message.includes('gas') || error.message.includes('fee')) {
        console.log('⛽ Gas-related failure - adding to retry queue for better conditions');
        this.retryQueue.add(scheduleId);
        this.updateRetryAttempt(scheduleId);
      }
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      executorAddress: this.wallet.address,
      contractAddress: AUTO_RECURRING_PAYMENTS_ADDRESS,
      network: 'Base Sepolia',
      lastCheck: new Date().toISOString(),
      safetyRulesActive: this.safetyRules.size,
      retryQueueSize: this.retryQueue.size,
      eventTriggersActive: this.eventTriggers.size,
      watchtowerActive: this.watchtowerActive,
      features: {
        gasOptimization: true,
        emergencyBrakes: true,
        smartRetries: true,
        walletSafety: true,
        eventDriven: true,
        iftttWeb3: true
      }
    };
  }

  /**
   * Get event triggers for debugging
   */
  getEventTriggers() {
    const triggers: { [scheduleId: string]: EventTrigger } = {};
    this.eventTriggers.forEach((trigger, scheduleId) => {
      triggers[scheduleId] = trigger;
    });
    return triggers;
  }

  /**
   * Get safety rules for debugging
   */
  getSafetyRules() {
    const rules: { [scheduleId: string]: SafetyRule } = {};
    this.safetyRules.forEach((rule, scheduleId) => {
      rules[scheduleId] = rule;
    });
    return rules;
  }

  /**
   * Get retry queue status
   */
  getRetryQueue() {
    return Array.from(this.retryQueue);
  }

  /**
   * Set global gas threshold (applies to schedules without specific rules)
   */
  setGlobalGasThreshold(maxGasGwei: number) {
    this.gasThresholdGwei = maxGasGwei;
    console.log(`🛡️ Global gas threshold set to ${maxGasGwei} gwei`);
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