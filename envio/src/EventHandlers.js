/*
 * 🏆 PropChain AI - Award-Winning DeFi Analytics Event Handlers
 * Real-time indexing for RWA properties + Advanced Payment Automation + Swap Analytics
 * 
 * Features:
 * - AutoRecurringPayments contract tracking
 * - SimpleSwapPool contract monitoring  
 * - Multi-property RWA portfolio analytics
 * - Executor reward distribution tracking
 * - Cross-contract transaction correlation
 * - Advanced DeFi protocol integration
 */

// Import generated contract handlers
const {
  AutoRecurringPayments,
  SimpleSwapPool,
  USDCToken,
  ManhattanLuxuryApartments,
  MiamiBeachCondos,
  AustinTechHubOffice,
  SeattleWarehouseDistrict,
  DenverMountainResort,
  ChicagoDowntownLofts,
  LosAngelesStudioComplex,
  PhoenixRetailPlaza,
  BostonHistoricBrownstones,
  NashvilleMusicDistrict,
} = require("../generated");

// ========================================
// 🚀 AUTORECURRINGPAYMENTS EVENT HANDLERS
// ========================================

// Permission Granted Event
AutoRecurringPayments.PermissionGranted.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.params.user}_${event.srcAddress}`,
    user: event.params.user,
    contractAddress: event.srcAddress,
    maxAmountPerPayment: event.params.maxAmountPerPayment,
    maxTotalAmount: event.params.maxTotalAmount,
    totalSpent: BigInt(0),
    validUntil: event.params.validUntil,
    isActive: true,
    grantedAt: event.block.timestamp,
  };

  context.PaymentPermission.set(entity);
  
  // Update daily stats
  await updateDailyStats(context, event.block.timestamp, 'permission_granted');
});

// Payment Schedule Created Event
AutoRecurringPayments.PaymentScheduleCreated.handler(async ({ event, context }) => {
  const entity = {
    id: event.params.scheduleId,
    payer: event.params.payer,
    recipient: event.params.recipient,
    amount: event.params.amount,
    interval: event.params.interval,
    maxExecutions: event.params.maxExecutions,
    executionsLeft: event.params.maxExecutions,
    executorReward: event.params.executorReward,
    isActive: true,
    createdAt: event.block.timestamp,
    nextPayment: event.block.timestamp + event.params.interval,
    contractAddress: event.srcAddress,
  };

  context.PaymentSchedule.set(entity);
  
  // Update user activity
  await updateUserActivity(context, event.params.payer, 'payment_schedule_created', event.params.amount);
  
  // Update daily stats
  await updateDailyStats(context, event.block.timestamp, 'payment_schedule_created');
});

// Payment Executed Event
AutoRecurringPayments.PaymentExecuted.handler(async ({ event, context }) => {
  const executionEntity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    schedule: event.params.scheduleId,
    payer: event.params.payer,
    recipient: event.params.recipient,
    amount: event.params.amount,
    executor: event.params.executor,
    executorReward: event.params.reward,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
    gasUsed: BigInt(0), // Will be updated from transaction data
    gasPrice: BigInt(0), // Will be updated from transaction data
  };

  context.PaymentExecution.set(executionEntity);
  
  // Update payment schedule
  const schedule = await context.PaymentSchedule.get(event.params.scheduleId);
  if (schedule) {
    schedule.executionsLeft = schedule.executionsLeft - BigInt(1);
    schedule.nextPayment = event.block.timestamp + schedule.interval;
    
    if (schedule.executionsLeft <= BigInt(0)) {
      schedule.isActive = false;
    }
    
    context.PaymentSchedule.set(schedule);
  }
  
  // Update executor stats
  await updateExecutorStats(context, event.params.executor, event.params.reward, 'payment');
  
  // Update user activity
  await updateUserActivity(context, event.params.payer, 'payment_sent', event.params.amount);
  await updateUserActivity(context, event.params.recipient, 'payment_received', event.params.amount);
  
  // Update daily stats
  await updateDailyStats(context, event.block.timestamp, 'payment_executed', event.params.amount);
});

// Payment Schedule Cancelled Event
AutoRecurringPayments.PaymentScheduleCancelled.handler(async ({ event, context }) => {
  const schedule = await context.PaymentSchedule.get(event.params.scheduleId);
  if (schedule) {
    schedule.isActive = false;
    context.PaymentSchedule.set(schedule);
  }
  
  // Update daily stats
  await updateDailyStats(context, event.block.timestamp, 'payment_schedule_cancelled');
});

// Executor Rewarded Event
AutoRecurringPayments.ExecutorRewarded.handler(async ({ event, context }) => {
  // This is handled in PaymentExecuted handler
  // But we can add additional executor-specific analytics here
  await updateDailyExecutorReward(context, event.params.executor, event.params.reward, event.block.timestamp);
});

// ========================================
// 🔄 SIMPLESWAPPOOL EVENT HANDLERS
// ========================================

// Swap Permission Granted Event
SimpleSwapPool.PermissionGranted.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.params.user}_${event.srcAddress}`,
    user: event.params.user,
    maxAmountPerSwap: event.params.maxAmountPerSwap,
    maxTotalAmount: event.params.maxTotalAmount,
    totalSpent: BigInt(0),
    validUntil: event.params.validUntil,
    isActive: true,
    grantedAt: event.block.timestamp,
  };

  context.SwapPermission.set(entity);
});

// Swap Schedule Created Event
SimpleSwapPool.SwapScheduleCreated.handler(async ({ event, context }) => {
  const entity = {
    id: event.params.scheduleId,
    user: event.params.user,
    usdcAmount: event.params.usdcAmount,
    interval: event.params.interval,
    maxExecutions: BigInt(100), // Default from contract
    executionsLeft: BigInt(100),
    executorReward: event.params.executorReward,
    isActive: true,
    createdAt: event.block.timestamp,
    nextSwap: event.block.timestamp + event.params.interval,
  };

  context.SwapSchedule.set(entity);
  
  // Update user activity
  await updateUserActivity(context, event.params.user, 'swap_schedule_created', event.params.usdcAmount);
  
  // Update daily stats
  await updateDailyStats(context, event.block.timestamp, 'swap_schedule_created');
});

// Swap Executed Event
SimpleSwapPool.SwapExecuted.handler(async ({ event, context }) => {
  const executionEntity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    schedule: event.params.scheduleId,
    user: event.params.user,
    usdcAmount: event.params.usdcAmount,
    ethAmount: event.params.ethAmount,
    executor: event.params.executor,
    executorReward: event.params.reward,
    swapType: "recurring",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
    gasUsed: BigInt(0),
    gasPrice: BigInt(0),
  };

  context.SwapExecution.set(executionEntity);
  
  // Update swap schedule
  const schedule = await context.SwapSchedule.get(event.params.scheduleId);
  if (schedule) {
    schedule.executionsLeft = schedule.executionsLeft - BigInt(1);
    schedule.nextSwap = event.block.timestamp + schedule.interval;
    
    if (schedule.executionsLeft <= BigInt(0)) {
      schedule.isActive = false;
    }
    
    context.SwapSchedule.set(schedule);
  }
  
  // Update executor stats
  await updateExecutorStats(context, event.params.executor, event.params.reward, 'swap');
  
  // Update user activity
  await updateUserActivity(context, event.params.user, 'swap_executed', event.params.usdcAmount);
  
  // Update daily stats
  await updateDailyStats(context, event.block.timestamp, 'swap_executed', event.params.usdcAmount, event.params.ethAmount);
});

// Instant Swap Event
SimpleSwapPool.InstantSwap.handler(async ({ event, context }) => {
  const executionEntity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    schedule: null, // No schedule for instant swaps
    user: event.params.user,
    usdcAmount: event.params.usdcAmount,
    ethAmount: event.params.ethAmount,
    executor: event.params.user, // User executes their own instant swap
    executorReward: BigInt(0), // No reward for instant swaps
    swapType: "instant",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
    gasUsed: BigInt(0),
    gasPrice: BigInt(0),
  };

  context.SwapExecution.set(executionEntity);
  
  // Update user activity
  await updateUserActivity(context, event.params.user, 'instant_swap', event.params.usdcAmount);
  
  // Update daily stats
  await updateDailyStats(context, event.block.timestamp, 'instant_swap', event.params.usdcAmount, event.params.ethAmount);
});

// Swap Schedule Cancelled Event
SimpleSwapPool.SwapScheduleCancelled.handler(async ({ event, context }) => {
  const schedule = await context.SwapSchedule.get(event.params.scheduleId);
  if (schedule) {
    schedule.isActive = false;
    context.SwapSchedule.set(schedule);
  }
  
  // Update daily stats
  await updateDailyStats(context, event.block.timestamp, 'swap_schedule_cancelled');
});

// Liquidity Added Event
SimpleSwapPool.LiquidityAdded.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    eventType: "add",
    ethAmount: event.params.ethAmount,
    usdcAmount: event.params.usdcAmount,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.LiquidityEvent.set(entity);
});

// Liquidity Removed Event
SimpleSwapPool.LiquidityRemoved.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    eventType: "remove",
    ethAmount: event.params.ethAmount,
    usdcAmount: event.params.usdcAmount,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.LiquidityEvent.set(entity);
});

// SimpleSwapPool Executor Rewarded Event
SimpleSwapPool.ExecutorRewarded.handler(async ({ event, context }) => {
  // Update executor stats for swap executions
  await updateExecutorStats(context, event.params.executor, event.params.reward, 'swap');
  
  // Update daily executor reward tracking
  await updateDailyExecutorReward(context, event.params.executor, event.params.reward, event.block.timestamp);
});

// ========================================
// 💎 USDC TOKEN EVENT HANDLERS
// ========================================

// USDC Transfer Event
USDCToken.Transfer.handler(async ({ event, context }) => {
  // Detect context based on to/from addresses
  const isPaymentRelated = isPaymentContract(event.params.to) || isPaymentContract(event.params.from);
  const isSwapRelated = isSwapContract(event.params.to) || isSwapContract(event.params.from);
  const isPropertyRelated = isPropertyContract(event.params.to) || isPropertyContract(event.params.from);
  
  let relatedContract = null;
  if (isPaymentRelated) relatedContract = "0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96";
  if (isSwapRelated) relatedContract = "0xCe3bf5DEd091c822193F14502B724a1bf1040E5C";
  
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
    isPaymentRelated,
    isSwapRelated,
    isPropertyRelated,
    relatedContract,
  };

  context.USDCTransfer.set(entity);
});

// USDC Approval Event
USDCToken.Approval.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    owner: event.params.owner,
    spender: event.params.spender,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.USDCApproval.set(entity);
});

// ========================================
// RWA PROPERTY EVENT HANDLERS
// ========================================

// Manhattan Luxury Apartments (#1)
ManhattanLuxuryApartments.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "1",
    propertyName: "Manhattan Luxury Apartments",
    propertyAddress: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  
  // Update user portfolio
  await updateUserPortfolio(context, event.params.investor, "1", event.params.shares, event.params.amount, "purchase");
});

ManhattanLuxuryApartments.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "1",
    propertyName: "Manhattan Luxury Apartments",
    propertyAddress: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  
  // Update user yield stats
  await updateUserYieldStats(context, event.params.investor, "1", event.params.amount);
});

// Miami Beach Condos (#2)
MiamiBeachCondos.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "2",
    propertyName: "Miami Beach Condos",
    propertyAddress: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "2", event.params.shares, event.params.amount, "purchase");
});

MiamiBeachCondos.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "2",
    propertyName: "Miami Beach Condos",
    propertyAddress: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "2", event.params.amount);
});

// Austin Tech Hub Office (#3)
AustinTechHubOffice.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "3",
    propertyName: "Austin Tech Hub Office",
    propertyAddress: "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "3", event.params.shares, event.params.amount, "purchase");
});

AustinTechHubOffice.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "3",
    propertyName: "Austin Tech Hub Office",
    propertyAddress: "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "3", event.params.amount);
});

// Seattle Warehouse District (#4)
SeattleWarehouseDistrict.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "4",
    propertyName: "Seattle Warehouse District",
    propertyAddress: "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "4", event.params.shares, event.params.amount, "purchase");
});

SeattleWarehouseDistrict.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "4",
    propertyName: "Seattle Warehouse District",
    propertyAddress: "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "4", event.params.amount);
});

// Denver Mountain Resort (#5)
DenverMountainResort.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "5",
    propertyName: "Denver Mountain Resort",
    propertyAddress: "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "5", event.params.shares, event.params.amount, "purchase");
});

DenverMountainResort.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "5",
    propertyName: "Denver Mountain Resort",
    propertyAddress: "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "5", event.params.amount);
});

// Chicago Downtown Lofts (#6)
ChicagoDowntownLofts.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "6",
    propertyName: "Chicago Downtown Lofts",
    propertyAddress: "0x86337dDaF2661A069D0DcB5D160585acC2d15E9a",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "6", event.params.shares, event.params.amount, "purchase");
});

ChicagoDowntownLofts.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "6",
    propertyName: "Chicago Downtown Lofts",
    propertyAddress: "0x86337dDaF2661A069D0DcB5D160585acC2d15E9a",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "6", event.params.amount);
});

// Los Angeles Studio Complex (#7)
LosAngelesStudioComplex.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "7",
    propertyName: "Los Angeles Studio Complex",
    propertyAddress: "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "7", event.params.shares, event.params.amount, "purchase");
});

LosAngelesStudioComplex.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "7",
    propertyName: "Los Angeles Studio Complex",
    propertyAddress: "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "7", event.params.amount);
});

// Phoenix Retail Plaza (#8)
PhoenixRetailPlaza.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "8",
    propertyName: "Phoenix Retail Plaza",
    propertyAddress: "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "8", event.params.shares, event.params.amount, "purchase");
});

PhoenixRetailPlaza.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "8",
    propertyName: "Phoenix Retail Plaza",
    propertyAddress: "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "8", event.params.amount);
});

// Boston Historic Brownstones (#9)
BostonHistoricBrownstones.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "9",
    propertyName: "Boston Historic Brownstones",
    propertyAddress: "0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "9", event.params.shares, event.params.amount, "purchase");
});

BostonHistoricBrownstones.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "9",
    propertyName: "Boston Historic Brownstones",
    propertyAddress: "0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "9", event.params.amount);
});

// Nashville Music District (#10)
NashvilleMusicDistrict.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "10",
    propertyName: "Nashville Music District",
    propertyAddress: "0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "10", event.params.shares, event.params.amount, "purchase");
});

NashvilleMusicDistrict.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "10",
    propertyName: "Nashville Music District",
    propertyAddress: "0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "10", event.params.amount);
});

// ========================================
// DEFI PROTOCOL EVENT HANDLERS - TEMPORARILY DISABLED
// ========================================

// Uniswap V3 Swap Tracking
// UniswapV3Router.Swap.handler(async ({ event, context }) => {
//   const entity = {
//     id: `${event.transactionHash}_${event.logIndex}`,
//     sender: event.params.sender,
//     recipient: event.params.recipient,
//     amount0: event.params.amount0,
//     amount1: event.params.amount1,
//     sqrtPriceX96: event.params.sqrtPriceX96,
//     liquidity: event.params.liquidity,
//     tick: event.params.tick,
//     timestamp: event.block.timestamp,
//     blockNumber: event.block.number,
//     transactionHash: event.transactionHash,
//   };

//   context.SwapTransaction.set(entity);
// });

// Superfluid Stream Tracking
// SuperfluidHost.FlowUpdated.handler(async ({ event, context }) => {
//   const entity = {
//     id: `${event.transactionHash}_${event.logIndex}`,
//     token: event.params.token,
//     sender: event.params.sender,
//     receiver: event.params.receiver,
//     flowRate: event.params.flowRate,
//     totalSenderFlowRate: event.params.totalSenderFlowRate,
//     totalReceiverFlowRate: event.params.totalReceiverFlowRate,
//     timestamp: event.block.timestamp,
//     blockNumber: event.block.number,
//     transactionHash: event.transactionHash,
//   };

//   context.StreamTransaction.set(entity);
// });

// Aave V3 Supply Tracking
// AaveV3Pool.Supply.handler(async ({ event, context }) => {
//   const entity = {
//     id: `${event.transactionHash}_${event.logIndex}`,
//     reserve: event.params.reserve,
//     user: event.params.user,
//     onBehalfOf: event.params.onBehalfOf,
//     repayer: "",
//     amount: event.params.amount,
//     interestRateMode: 0,
//     borrowRate: BigInt(0),
//     referralCode: event.params.referralCode,
//     useATokens: false,
//     action: "supply",
//     timestamp: event.block.timestamp,
//     blockNumber: event.block.number,
//     transactionHash: event.transactionHash,
//   };

//   context.LendingTransaction.set(entity);
// });

// Aave V3 Borrow Tracking
// AaveV3Pool.Borrow.handler(async ({ event, context }) => {
//   const entity = {
//     id: `${event.transactionHash}_${event.logIndex}`,
//     reserve: event.params.reserve,
//     user: event.params.user,
//     onBehalfOf: event.params.onBehalfOf,
//     repayer: "",
//     amount: event.params.amount,
//     interestRateMode: event.params.interestRateMode,
//     borrowRate: event.params.borrowRate,
//     referralCode: event.params.referralCode,
//     useATokens: false,
//     action: "borrow",
//     timestamp: event.block.timestamp,
//     blockNumber: event.block.number,
//     transactionHash: event.transactionHash,
//   };

//   context.LendingTransaction.set(entity);
// });

// Aave V3 Repay Tracking
// AaveV3Pool.Repay.handler(async ({ event, context }) => {
//   const entity = {
//     id: `${event.transactionHash}_${event.logIndex}`,
//     reserve: event.params.reserve,
//     user: event.params.user,
//     onBehalfOf: "",
//     repayer: event.params.repayer,
//     amount: event.params.amount,
//     interestRateMode: 0,
//     borrowRate: BigInt(0),
//     referralCode: 0,
//     useATokens: event.params.useATokens,
//     action: "repay",
//     timestamp: event.block.timestamp,
//     blockNumber: event.block.number,
//     transactionHash: event.transactionHash,
//   };

//   context.LendingTransaction.set(entity);
// });

// ========================================
// TRANSFER EVENT HANDLERS FOR ALL PROPERTIES
// ========================================

// Manhattan Luxury Apartments Transfer
ManhattanLuxuryApartments.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "1",
    propertyName: "Manhattan Luxury Apartments",
    propertyAddress: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Miami Beach Condos Transfer
MiamiBeachCondos.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "2",
    propertyName: "Miami Beach Condos",
    propertyAddress: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Austin Tech Hub Office Transfer
AustinTechHubOffice.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "3",
    propertyName: "Austin Tech Hub Office",
    propertyAddress: "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Seattle Warehouse District Transfer
SeattleWarehouseDistrict.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "4",
    propertyName: "Seattle Warehouse District",
    propertyAddress: "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Denver Mountain Resort Transfer
DenverMountainResort.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "5",
    propertyName: "Denver Mountain Resort",
    propertyAddress: "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Chicago Downtown Lofts Transfer
ChicagoDowntownLofts.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "6",
    propertyName: "Chicago Downtown Lofts",
    propertyAddress: "0x86337dDaF2661A069D0DcB5D160585acC2d15E9a",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Los Angeles Studio Complex Transfer
LosAngelesStudioComplex.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "7",
    propertyName: "Los Angeles Studio Complex",
    propertyAddress: "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Phoenix Retail Plaza Transfer
PhoenixRetailPlaza.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "8",
    propertyName: "Phoenix Retail Plaza",
    propertyAddress: "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Boston Historic Brownstones Transfer
BostonHistoricBrownstones.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "9",
    propertyName: "Boston Historic Brownstones",
    propertyAddress: "0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Nashville Music District Transfer
NashvilleMusicDistrict.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "10",
    propertyName: "Nashville Music District",
    propertyAddress: "0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// ========================================
// SHARES WITHDRAWN EVENT HANDLERS
// ========================================

// Manhattan Luxury Apartments SharesWithdrawn
ManhattanLuxuryApartments.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "1",
    propertyName: "Manhattan Luxury Apartments",
    propertyAddress: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "1", event.params.shares, event.params.amount, "withdraw");
});

// Miami Beach Condos SharesWithdrawn
MiamiBeachCondos.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "2",
    propertyName: "Miami Beach Condos",
    propertyAddress: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "2", event.params.shares, event.params.amount, "withdraw");
});

// Austin Tech Hub Office SharesWithdrawn
AustinTechHubOffice.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "3",
    propertyName: "Austin Tech Hub Office",
    propertyAddress: "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "3", event.params.shares, event.params.amount, "withdraw");
});

// Seattle Warehouse District SharesWithdrawn
SeattleWarehouseDistrict.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "4",
    propertyName: "Seattle Warehouse District",
    propertyAddress: "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "4", event.params.shares, event.params.amount, "withdraw");
});

// Denver Mountain Resort SharesWithdrawn
DenverMountainResort.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "5",
    propertyName: "Denver Mountain Resort",
    propertyAddress: "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "5", event.params.shares, event.params.amount, "withdraw");
});

// Chicago Downtown Lofts SharesWithdrawn
ChicagoDowntownLofts.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "6",
    propertyName: "Chicago Downtown Lofts",
    propertyAddress: "0x86337dDaF2661A069D0DcB5D160585acC2d15E9a",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "6", event.params.shares, event.params.amount, "withdraw");
});

// Los Angeles Studio Complex SharesWithdrawn
LosAngelesStudioComplex.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "7",
    propertyName: "Los Angeles Studio Complex",
    propertyAddress: "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "7", event.params.shares, event.params.amount, "withdraw");
});

// Phoenix Retail Plaza SharesWithdrawn
PhoenixRetailPlaza.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "8",
    propertyName: "Phoenix Retail Plaza",
    propertyAddress: "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "8", event.params.shares, event.params.amount, "withdraw");
});

// Boston Historic Brownstones SharesWithdrawn
BostonHistoricBrownstones.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "9",
    propertyName: "Boston Historic Brownstones",
    propertyAddress: "0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "9", event.params.shares, event.params.amount, "withdraw");
});

// Nashville Music District SharesWithdrawn
NashvilleMusicDistrict.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "10",
    propertyName: "Nashville Music District",
    propertyAddress: "0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "10", event.params.shares, event.params.amount, "withdraw");
});

// ========================================
// PROPERTY UPDATED EVENT HANDLERS
// ========================================

// Manhattan Luxury Apartments PropertyUpdated
ManhattanLuxuryApartments.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Miami Beach Condos PropertyUpdated
MiamiBeachCondos.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Austin Tech Hub Office PropertyUpdated
AustinTechHubOffice.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Seattle Warehouse District PropertyUpdated
SeattleWarehouseDistrict.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Denver Mountain Resort PropertyUpdated
DenverMountainResort.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Chicago Downtown Lofts PropertyUpdated
ChicagoDowntownLofts.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Los Angeles Studio Complex PropertyUpdated
LosAngelesStudioComplex.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Phoenix Retail Plaza PropertyUpdated
PhoenixRetailPlaza.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Boston Historic Brownstones PropertyUpdated
BostonHistoricBrownstones.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Nashville Music District PropertyUpdated
NashvilleMusicDistrict.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// ========================================
// 🔧 HELPER FUNCTIONS
// ========================================

async function updateUserPortfolio(context, investor, propertyId, shares, cost, action) {
  const portfolioId = `${investor}_${propertyId}`;
  
  // Get existing portfolio or create new one
  let portfolio = await context.UserPortfolio.get(portfolioId);
  
  if (!portfolio) {
    portfolio = {
      id: portfolioId,
      user: investor,
      propertyId: propertyId,
      totalShares: BigInt(0),
      totalInvested: BigInt(0),
      totalYieldClaimed: BigInt(0),
      lastUpdated: BigInt(Math.floor(Date.now() / 1000)),
    };
  }
  
  if (action === "purchase") {
    portfolio.totalShares += shares;
    portfolio.totalInvested += cost;
  } else if (action === "withdraw") {
    portfolio.totalShares -= shares;
  }
  
  portfolio.lastUpdated = BigInt(Math.floor(Date.now() / 1000));
  context.UserPortfolio.set(portfolio);
}

async function updateUserYieldStats(context, investor, propertyId, amount) {
  const portfolioId = `${investor}_${propertyId}`;
  
  let portfolio = await context.UserPortfolio.get(portfolioId);
  
  if (portfolio) {
    portfolio.totalYieldClaimed += amount;
    portfolio.lastUpdated = BigInt(Math.floor(Date.now() / 1000));
    context.UserPortfolio.set(portfolio);
  }
}

// ========================================
// 🏆 AWARD-WINNING ANALYTICS FUNCTIONS
// ========================================

async function updateExecutorStats(context, executor, reward, executionType) {
  let stats = await context.ExecutorStats.get(executor);
  
  if (!stats) {
    stats = {
      id: executor,
      executor: executor,
      totalExecutions: BigInt(0),
      totalRewardsEarned: BigInt(0),
      paymentExecutions: BigInt(0),
      swapExecutions: BigInt(0),
      averageReward: BigInt(0),
      firstExecution: BigInt(Math.floor(Date.now() / 1000)),
      lastExecution: BigInt(Math.floor(Date.now() / 1000)),
    };
  }
  
  stats.totalExecutions += BigInt(1);
  stats.totalRewardsEarned += reward;
  stats.lastExecution = BigInt(Math.floor(Date.now() / 1000));
  
  if (executionType === 'payment') {
    stats.paymentExecutions += BigInt(1);
  } else if (executionType === 'swap') {
    stats.swapExecutions += BigInt(1);
  }
  
  // Calculate average reward
  if (stats.totalExecutions > BigInt(0)) {
    stats.averageReward = stats.totalRewardsEarned / stats.totalExecutions;
  }
  
  context.ExecutorStats.set(stats);
}

async function updateDailyExecutorReward(context, executor, reward, timestamp) {
  const date = new Date(Number(timestamp) * 1000).toISOString().split('T')[0];
  const dailyId = `${executor}_${date}`;
  
  let dailyReward = await context.DailyExecutorReward.get(dailyId);
  
  if (!dailyReward) {
    dailyReward = {
      id: dailyId,
      executor: executor,
      date: date,
      totalRewards: BigInt(0),
      executionCount: BigInt(0),
      paymentRewards: BigInt(0),
      swapRewards: BigInt(0),
    };
  }
  
  dailyReward.totalRewards += reward;
  dailyReward.executionCount += BigInt(1);
  
  context.DailyExecutorReward.set(dailyReward);
}

async function updateUserActivity(context, user, activityType, amount = BigInt(0)) {
  let activity = await context.UserActivity.get(user);
  
  if (!activity) {
    activity = {
      id: user,
      user: user,
      totalPaymentsSent: BigInt(0),
      totalPaymentsReceived: BigInt(0),
      totalPaymentVolumeSent: BigInt(0),
      totalPaymentVolumeReceived: BigInt(0),
      activePaymentSchedules: BigInt(0),
      totalSwaps: BigInt(0),
      totalSwapVolumeUSDC: BigInt(0),
      totalSwapVolumeETH: BigInt(0),
      activeSwapSchedules: BigInt(0),
      totalPropertyInvestments: BigInt(0),
      totalPropertyVolume: BigInt(0),
      totalYieldClaimed: BigInt(0),
      propertiesOwned: [],
      totalExecutions: BigInt(0),
      totalExecutorRewards: BigInt(0),
      firstActivity: BigInt(Math.floor(Date.now() / 1000)),
      lastActivity: BigInt(Math.floor(Date.now() / 1000)),
    };
  }
  
  activity.lastActivity = BigInt(Math.floor(Date.now() / 1000));
  
  switch (activityType) {
    case 'payment_sent':
      activity.totalPaymentsSent += BigInt(1);
      activity.totalPaymentVolumeSent += amount;
      break;
    case 'payment_received':
      activity.totalPaymentsReceived += BigInt(1);
      activity.totalPaymentVolumeReceived += amount;
      break;
    case 'payment_schedule_created':
      activity.activePaymentSchedules += BigInt(1);
      break;
    case 'swap_executed':
    case 'instant_swap':
      activity.totalSwaps += BigInt(1);
      activity.totalSwapVolumeUSDC += amount;
      break;
    case 'swap_schedule_created':
      activity.activeSwapSchedules += BigInt(1);
      break;
  }
  
  context.UserActivity.set(activity);
}

async function updateDailyStats(context, timestamp, eventType, amount1 = BigInt(0), amount2 = BigInt(0)) {
  const date = new Date(Number(timestamp) * 1000).toISOString().split('T')[0];
  
  let stats = await context.DailyProtocolStats.get(date);
  
  if (!stats) {
    stats = {
      id: date,
      date: date,
      totalPayments: BigInt(0),
      totalPaymentVolume: BigInt(0),
      activePaymentSchedules: BigInt(0),
      newPaymentSchedules: BigInt(0),
      totalSwaps: BigInt(0),
      totalSwapVolumeUSDC: BigInt(0),
      totalSwapVolumeETH: BigInt(0),
      activeSwapSchedules: BigInt(0),
      newSwapSchedules: BigInt(0),
      totalPropertyInvestments: BigInt(0),
      totalPropertyVolume: BigInt(0),
      totalYieldDistributed: BigInt(0),
      totalExecutorRewards: BigInt(0),
      activeExecutors: BigInt(0),
      totalGasUsed: BigInt(0),
      averageGasPrice: BigInt(0),
    };
  }
  
  switch (eventType) {
    case 'payment_executed':
      stats.totalPayments += BigInt(1);
      stats.totalPaymentVolume += amount1;
      break;
    case 'payment_schedule_created':
      stats.newPaymentSchedules += BigInt(1);
      stats.activePaymentSchedules += BigInt(1);
      break;
    case 'swap_executed':
      stats.totalSwaps += BigInt(1);
      stats.totalSwapVolumeUSDC += amount1;
      stats.totalSwapVolumeETH += amount2;
      break;
    case 'instant_swap':
      stats.totalSwaps += BigInt(1);
      stats.totalSwapVolumeUSDC += amount1;
      stats.totalSwapVolumeETH += amount2;
      break;
    case 'swap_schedule_created':
      stats.newSwapSchedules += BigInt(1);
      stats.activeSwapSchedules += BigInt(1);
      break;
  }
  
  context.DailyProtocolStats.set(stats);
}

// Contract address detection helpers
function isPaymentContract(address) {
  return address.toLowerCase() === "0x6cb93c4538e7166f3e8c64ba654ec13b9fb74c96";
}

function isSwapContract(address) {
  return address.toLowerCase() === "0xce3bf5ded091c822193f14502b724a1bf1040e5c";
}

function isPropertyContract(address) {
  const propertyAddresses = [
    "0xa16e02e87b7454126e5e10d957a927a7f5b5d2be", // Manhattan
    "0xb7a5bd0345ef1cc5e66bf61bdec17d2461fbd968", // Miami
    "0xeebe00ac0756308ac4aabfd76c05c4f3088b8883", // Austin
    "0x10c6e9530f1c1af873a391030a1d9e8ed0630d26", // Seattle
    "0x603e1bd79259ebcbaed0c83eec09ca0b89a5bcc", // Denver
    "0x86337ddaf2661a069d0dcb5d160585acc2d15e9a", // Chicago
    "0x9cfa6d15c80eb753c815079f2b32ddefd562c3e4", // Los Angeles
    "0x427f7c59ed72bcf26dffc634fef3034e00922dd8", // Phoenix
    "0x275039fc0fd2eefac30835af6aeff24e8c52ba6b", // Boston
    "0x07e7876a32feec2ce734aae93d9ab7623eaef4a3", // Nashville
  ];
  
  return propertyAddresses.includes(address.toLowerCase());
}