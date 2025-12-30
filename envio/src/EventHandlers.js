/**
 * 🚀 Real-Time Financial Engine - Event Handlers
 * Transforms raw blockchain events into intelligent financial data
 */

// Property mapping for intelligent routing
const PROPERTY_MAPPING = {
  "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be": {
    id: "manhattan",
    name: "Manhattan Luxury Apartments",
    location: "New York, NY",
    type: "RESIDENTIAL"
  },
  "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968": {
    id: "miami",
    name: "Miami Beach Condos", 
    location: "Miami, FL",
    type: "RESIDENTIAL"
  },
  "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883": {
    id: "austin",
    name: "Austin Tech Hub Office",
    location: "Austin, TX",
    type: "COMMERCIAL"
  },
  "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26": {
    id: "seattle",
    name: "Seattle Warehouse District",
    location: "Seattle, WA", 
    type: "INDUSTRIAL"
  },
  "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC": {
    id: "denver",
    name: "Denver Mountain Resort",
    location: "Denver, CO",
    type: "HOSPITALITY"
  },
  "0x86337dDaF2661A069D0DcB5D160585acC2d15E9a": {
    id: "chicago",
    name: "Chicago Downtown Lofts",
    location: "Chicago, IL",
    type: "RESIDENTIAL"
  },
  "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4": {
    id: "losangeles",
    name: "Los Angeles Studio Complex",
    location: "Los Angeles, CA",
    type: "COMMERCIAL"
  },
  "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8": {
    id: "phoenix",
    name: "Phoenix Retail Plaza",
    location: "Phoenix, AZ",
    type: "COMMERCIAL"
  },
  "0x275039fc0fd2eeFac30835af6aeFac30835af6aeFf24e8c52bA6B": {
    id: "boston",
    name: "Boston Historic Brownstones",
    location: "Boston, MA",
    type: "RESIDENTIAL"
  },
  "0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3": {
    id: "nashville",
    name: "Nashville Music District",
    location: "Nashville, TN",
    type: "MIXED_USE"
  }
};

// ===== UTILITY FUNCTIONS =====

/**
 * Get or create user entity with intelligent defaults
 */
async function getOrCreateUser(context, userAddress) {
  let user = await context.User.get(userAddress);
  
  if (!user) {
    user = {
      id: userAddress,
      creditScore: 750, // Start with good credit score
      totalRentPaid: 0n,
      totalEquityEarned: 0n,
      activeStreams: 0,
      onTimePayments: 0,
      latePayments: 0,
      cancelledStreams: 0,
      averagePaymentAmount: 0n,
      firstPaymentDate: null,
      lastPaymentDate: null,
      createdAt: BigInt(Math.floor(Date.now() / 1000)),
      updatedAt: BigInt(Math.floor(Date.now() / 1000))
    };
    
    await context.User.set(user);
    console.log(`🆕 Created new user: ${userAddress}`);
  }
  
  return user;
}

/**
 * Get or create property entity
 */
async function getOrCreateProperty(context, propertyAddress) {
  let property = await context.Property.get(propertyAddress);
  
  if (!property) {
    const propertyInfo = PROPERTY_MAPPING[propertyAddress];
    if (!propertyInfo) {
      console.warn(`⚠️ Unknown property address: ${propertyAddress}`);
      return null;
    }
    
    property = {
      id: propertyAddress,
      name: propertyInfo.name,
      location: propertyInfo.location,
      propertyType: propertyInfo.type,
      contractAddress: propertyAddress,
      totalRevenue: 0n,
      totalInvestors: 0,
      occupancyRate: 0.0,
      averageRentPerUnit: 0n,
      monthlyRevenue: 0n,
      revenueGrowthRate: 0.0,
      investorRetentionRate: 100.0,
      totalShares: 100000n, // Default 100,000 shares
      sharesOwned: 0n,
      sharePrice: 1000000000000000000n, // 1 ETH in wei
      createdAt: BigInt(Math.floor(Date.now() / 1000)),
      updatedAt: BigInt(Math.floor(Date.now() / 1000))
    };
    
    await context.Property.set(property);
    console.log(`🏠 Created new property: ${propertyInfo.name}`);
  }
  
  return property;
}

/**
 * Get or create global protocol stats
 */
async function getOrCreateProtocolStats(context) {
  let stats = await context.ProtocolStats.get("global");
  
  if (!stats) {
    stats = {
      id: "global",
      totalVolumeStreaming: 0n,
      totalVolumeAllTime: 0n,
      totalExecutions: 0n,
      totalUsers: 0,
      activeUsers: 0,
      newUsersToday: 0,
      totalProperties: Object.keys(PROPERTY_MAPPING).length,
      totalPropertyValue: 0n,
      averageOccupancyRate: 0.0,
      averageCreditScore: 750.0,
      totalEquityGenerated: 0n,
      protocolRevenue: 0n,
      dailyVolume: 0n,
      weeklyVolume: 0n,
      monthlyVolume: 0n,
      lastUpdated: BigInt(Math.floor(Date.now() / 1000))
    };
    
    await context.ProtocolStats.set(stats);
    console.log(`📊 Created global protocol stats`);
  }
  
  return stats;
}

/**
 * Calculate credit score change based on payment performance
 */
function calculateCreditScoreChange(isOnTime, currentScore) {
  if (isOnTime) {
    // Reward on-time payments, but diminishing returns for high scores
    if (currentScore < 700) return 15;
    if (currentScore < 800) return 10;
    if (currentScore < 850) return 5;
    return 2;
  } else {
    // Penalize late payments more severely for high scores
    if (currentScore > 800) return -20;
    if (currentScore > 700) return -15;
    return -10;
  }
}

// ===== CORE EVENT HANDLERS =====

/**
 * 🎯 PAYMENT SCHEDULE CREATED - "Occupancy Intelligence"
 * Maps creation events to occupancy and user onboarding
 */
AutoRecurringPayments.PaymentScheduleCreated.handler(async ({ event, context }) => {
  console.log(`📅 Payment Schedule Created: ${event.params.scheduleId}`);
  
  const { scheduleId, payer, recipient, amount, interval, maxExecutions, executorReward } = event.params;
  
  // 👤 Update User Intelligence
  const user = await getOrCreateUser(context, payer);
  user.activeStreams += 1;
  user.updatedAt = BigInt(event.block.timestamp);
  
  // Set first payment date if this is user's first stream
  if (!user.firstPaymentDate) {
    user.firstPaymentDate = BigInt(event.block.timestamp);
  }
  
  await context.User.set(user);
  
  // 🏠 Determine if this is a property-related payment
  let property = null;
  const propertyInfo = PROPERTY_MAPPING[recipient];
  if (propertyInfo) {
    property = await getOrCreateProperty(context, recipient);
    if (property) {
      property.totalInvestors += 1;
      property.occupancyRate = Math.min(100.0, property.occupancyRate + 1.0);
      property.updatedAt = BigInt(event.block.timestamp);
      await context.Property.set(property);
    }
  }
  
  // 📋 Create Payment Schedule Entity
  const schedule = {
    id: scheduleId,
    payer: payer,
    recipient: recipient,
    property: property?.id || null,
    amount: amount,
    interval: interval,
    maxExecutions: Number(maxExecutions),
    executionsLeft: Number(maxExecutions),
    isActive: true,
    totalExecuted: 0,
    totalAmountPaid: 0n,
    nextPaymentDue: BigInt(event.block.timestamp) + interval,
    createdAt: BigInt(event.block.timestamp),
    lastExecutedAt: null
  };
  
  await context.PaymentSchedule.set(schedule);
  
  // 🌍 Update Global Protocol Stats
  const protocolStats = await getOrCreateProtocolStats(context);
  protocolStats.totalVolumeStreaming += amount * BigInt(maxExecutions);
  protocolStats.activeUsers += 1;
  protocolStats.lastUpdated = BigInt(event.block.timestamp);
  await context.ProtocolStats.set(protocolStats);
  
  // 📊 Create Stream Created Event
  const streamCreated = {
    id: `${event.transaction.hash}-${event.logIndex}`,
    user: payer,
    property: property?.id || null,
    schedule: scheduleId,
    amount: amount,
    interval: interval,
    maxExecutions: Number(maxExecutions),
    transactionHash: event.transaction.hash,
    blockNumber: BigInt(event.block.number),
    timestamp: BigInt(event.block.timestamp)
  };
  
  await context.StreamCreated.set(streamCreated);
  
  console.log(`✅ Stream created for ${payer} → ${recipient}: ${amount} USDC every ${interval}s`);
});

/**
 * 💰 PAYMENT EXECUTED - "Wealth & Credit Score Intelligence"
 * Maps execution events to wealth building and credit scoring
 */
AutoRecurringPayments.PaymentExecuted.handler(async ({ event, context }) => {
  console.log(`💸 Payment Executed: ${event.params.scheduleId}`);
  
  const { scheduleId, payer, recipient, amount, executor, reward } = event.params;
  
  // 📋 Update Payment Schedule
  const schedule = await context.PaymentSchedule.get(scheduleId);
  if (!schedule) {
    console.error(`❌ Schedule not found: ${scheduleId}`);
    return;
  }
  
  schedule.executionsLeft -= 1;
  schedule.totalExecuted += 1;
  schedule.totalAmountPaid += amount;
  schedule.lastExecutedAt = BigInt(event.block.timestamp);
  schedule.nextPaymentDue = BigInt(event.block.timestamp) + schedule.interval;
  
  // Deactivate if no executions left
  if (schedule.executionsLeft <= 0) {
    schedule.isActive = false;
  }
  
  await context.PaymentSchedule.set(schedule);
  
  // 👤 Update User Intelligence - Wealth & Credit Score
  const user = await getOrCreateUser(context, payer);
  
  // Calculate if payment was on time (within 10% of interval)
  const expectedTime = schedule.lastExecutedAt ? 
    schedule.lastExecutedAt + schedule.interval : 
    schedule.createdAt + schedule.interval;
  const actualTime = BigInt(event.block.timestamp);
  const timeDifference = actualTime > expectedTime ? actualTime - expectedTime : 0n;
  const isOnTime = timeDifference <= (schedule.interval / 10n); // Within 10% of interval
  
  // Update payment history
  if (isOnTime) {
    user.onTimePayments += 1;
  } else {
    user.latePayments += 1;
  }
  
  // Update credit score with intelligent algorithm
  const scoreChange = calculateCreditScoreChange(isOnTime, user.creditScore);
  user.creditScore = Math.max(300, Math.min(850, user.creditScore + scoreChange));
  
  // Update wealth metrics
  user.totalRentPaid += amount;
  user.lastPaymentDate = BigInt(event.block.timestamp);
  
  // Calculate average payment amount
  const totalPayments = user.onTimePayments + user.latePayments;
  if (totalPayments > 0) {
    user.averagePaymentAmount = user.totalRentPaid / BigInt(totalPayments);
  }
  
  // Update active streams if schedule completed
  if (!schedule.isActive) {
    user.activeStreams = Math.max(0, user.activeStreams - 1);
  }
  
  user.updatedAt = BigInt(event.block.timestamp);
  await context.User.set(user);
  
  // 🏠 Update Property Intelligence
  let property = null;
  let newEquityEarned = 0n;
  
  if (schedule.property) {
    property = await context.Property.get(schedule.property);
    if (property) {
      property.totalRevenue += amount;
      property.monthlyRevenue += amount; // Simplified - would need time-based logic
      property.averageRentPerUnit = property.totalRevenue / BigInt(Math.max(1, property.totalInvestors));
      property.updatedAt = BigInt(event.block.timestamp);
      await context.Property.set(property);
      
      // Calculate equity earned (simplified: 1 USDC = 0.001 property shares)
      newEquityEarned = amount / 1000n;
      user.totalEquityEarned += newEquityEarned;
      await context.User.set(user);
      
      // Update or create property ownership
      const ownershipId = `${payer}-${property.id}`;
      let ownership = await context.PropertyOwnership.get(ownershipId);
      
      if (!ownership) {
        ownership = {
          id: ownershipId,
          user: payer,
          property: property.id,
          sharesOwned: 0n,
          ownershipPercentage: 0.0,
          totalInvested: 0n,
          currentEquityValue: 0n,
          unrealizedGains: 0n,
          yieldEarned: 0n,
          averageMonthlyYield: 0n,
          firstInvestmentDate: BigInt(event.block.timestamp),
          lastInvestmentDate: BigInt(event.block.timestamp),
          createdAt: BigInt(event.block.timestamp),
          updatedAt: BigInt(event.block.timestamp)
        };
      }
      
      ownership.sharesOwned += newEquityEarned;
      ownership.totalInvested += amount;
      ownership.ownershipPercentage = Number(ownership.sharesOwned * 10000n / property.totalShares) / 100.0;
      ownership.currentEquityValue = ownership.sharesOwned * property.sharePrice / 1000000000000000000n;
      ownership.unrealizedGains = ownership.currentEquityValue - ownership.totalInvested;
      ownership.lastInvestmentDate = BigInt(event.block.timestamp);
      ownership.updatedAt = BigInt(event.block.timestamp);
      
      await context.PropertyOwnership.set(ownership);
    }
  }
  
  // 💳 Create Payment Execution Entity
  const execution = {
    id: `${event.transaction.hash}-${event.logIndex}`,
    schedule: scheduleId,
    amount: amount,
    executorReward: reward,
    executor: executor,
    gasUsed: BigInt(event.transaction.gasUsed || 0),
    gasPrice: BigInt(event.transaction.gasPrice || 0),
    executionDelay: timeDifference,
    transactionHash: event.transaction.hash,
    blockNumber: BigInt(event.block.number),
    timestamp: BigInt(event.block.timestamp)
  };
  
  await context.PaymentExecution.set(execution);
  
  // 🌍 Update Global Protocol Stats
  const protocolStats = await getOrCreateProtocolStats(context);
  protocolStats.totalVolumeAllTime += amount;
  protocolStats.totalExecutions += 1n;
  protocolStats.totalEquityGenerated += newEquityEarned;
  protocolStats.protocolRevenue += reward; // Executor rewards as protocol activity
  protocolStats.dailyVolume += amount; // Simplified - would need time-based logic
  protocolStats.lastUpdated = BigInt(event.block.timestamp);
  await context.ProtocolStats.set(protocolStats);
  
  // 📊 Create Stream Executed Event
  const streamExecuted = {
    id: `${event.transaction.hash}-${event.logIndex}-executed`,
    user: payer,
    property: property?.id || null,
    execution: execution.id,
    amount: amount,
    newEquityEarned: newEquityEarned,
    newCreditScore: user.creditScore,
    transactionHash: event.transaction.hash,
    blockNumber: BigInt(event.block.number),
    timestamp: BigInt(event.block.timestamp)
  };
  
  await context.StreamExecuted.set(streamExecuted);
  
  // 📈 Create Credit History Entry
  const creditHistory = {
    id: `${payer}-${event.block.timestamp}`,
    user: payer,
    creditScore: user.creditScore,
    scoreChange: scoreChange,
    reason: isOnTime ? "On-time payment" : "Late payment",
    totalPayments: totalPayments,
    onTimePaymentRate: totalPayments > 0 ? (user.onTimePayments / totalPayments) * 100 : 100,
    timestamp: BigInt(event.block.timestamp)
  };
  
  await context.UserCreditHistory.set(creditHistory);
  
  console.log(`✅ Payment executed: ${payer} paid ${amount} USDC, credit score: ${user.creditScore} (${scoreChange > 0 ? '+' : ''}${scoreChange})`);
});

/**
 * 🛑 PAYMENT SCHEDULE CANCELLED - "Churn Intelligence"
 * Maps cancellation events to churn analysis
 */
AutoRecurringPayments.PaymentScheduleCancelled.handler(async ({ event, context }) => {
  console.log(`🛑 Payment Schedule Cancelled: ${event.params.scheduleId}`);
  
  const { scheduleId } = event.params;
  
  // 📋 Update Payment Schedule
  const schedule = await context.PaymentSchedule.get(scheduleId);
  if (!schedule) {
    console.error(`❌ Schedule not found: ${scheduleId}`);
    return;
  }
  
  schedule.isActive = false;
  await context.PaymentSchedule.set(schedule);
  
  // 👤 Update User Intelligence
  const user = await getOrCreateUser(context, schedule.payer);
  user.activeStreams = Math.max(0, user.activeStreams - 1);
  user.cancelledStreams += 1;
  user.updatedAt = BigInt(event.block.timestamp);
  await context.User.set(user);
  
  // 🏠 Update Property Intelligence
  if (schedule.property) {
    const property = await context.Property.get(schedule.property);
    if (property) {
      property.occupancyRate = Math.max(0.0, property.occupancyRate - 1.0);
      property.updatedAt = BigInt(event.block.timestamp);
      await context.Property.set(property);
    }
  }
  
  // 🌍 Update Global Protocol Stats
  const protocolStats = await getOrCreateProtocolStats(context);
  protocolStats.totalVolumeStreaming -= schedule.amount * BigInt(schedule.executionsLeft);
  protocolStats.activeUsers = Math.max(0, protocolStats.activeUsers - 1);
  protocolStats.lastUpdated = BigInt(event.block.timestamp);
  await context.ProtocolStats.set(protocolStats);
  
  // 📊 Create Stream Cancelled Event
  const streamCancelled = {
    id: `${event.transaction.hash}-${event.logIndex}`,
    user: schedule.payer,
    property: schedule.property,
    schedule: scheduleId,
    reason: "User cancelled",
    amountPaidBeforeCancellation: schedule.totalAmountPaid,
    transactionHash: event.transaction.hash,
    blockNumber: BigInt(event.block.number),
    timestamp: BigInt(event.block.timestamp)
  };
  
  await context.StreamCancelled.set(streamCancelled);
  
  console.log(`✅ Stream cancelled: ${schedule.payer} cancelled schedule ${scheduleId}`);
});

// ===== PROPERTY EVENT HANDLERS =====

/**
 * 🏠 SHARES PURCHASED - Property Investment Tracking
 */
const handleSharesPurchased = async ({ event, context, contractName }) => {
  console.log(`🏠 Shares Purchased in ${contractName}: ${event.params.investor}`);
  
  const { investor, shares, amount } = event.params;
  const propertyAddress = event.srcAddress;
  
  // Update user and property entities
  const user = await getOrCreateUser(context, investor);
  const property = await getOrCreateProperty(context, propertyAddress);
  
  if (property) {
    property.totalRevenue += amount;
    property.sharesOwned += shares;
    property.updatedAt = BigInt(event.block.timestamp);
    await context.Property.set(property);
    
    // Update property ownership
    const ownershipId = `${investor}-${propertyAddress}`;
    let ownership = await context.PropertyOwnership.get(ownershipId);
    
    if (!ownership) {
      ownership = {
        id: ownershipId,
        user: investor,
        property: propertyAddress,
        sharesOwned: 0n,
        ownershipPercentage: 0.0,
        totalInvested: 0n,
        currentEquityValue: 0n,
        unrealizedGains: 0n,
        yieldEarned: 0n,
        averageMonthlyYield: 0n,
        firstInvestmentDate: BigInt(event.block.timestamp),
        lastInvestmentDate: BigInt(event.block.timestamp),
        createdAt: BigInt(event.block.timestamp),
        updatedAt: BigInt(event.block.timestamp)
      };
    }
    
    ownership.sharesOwned += shares;
    ownership.totalInvested += amount;
    ownership.ownershipPercentage = Number(ownership.sharesOwned * 10000n / property.totalShares) / 100.0;
    ownership.currentEquityValue = ownership.sharesOwned * property.sharePrice / 1000000000000000000n;
    ownership.unrealizedGains = ownership.currentEquityValue - ownership.totalInvested;
    ownership.lastInvestmentDate = BigInt(event.block.timestamp);
    ownership.updatedAt = BigInt(event.block.timestamp);
    
    await context.PropertyOwnership.set(ownership);
  }
  
  // Update user equity
  user.totalEquityEarned += shares;
  user.updatedAt = BigInt(event.block.timestamp);
  await context.User.set(user);
  
  console.log(`✅ ${investor} purchased ${shares} shares in ${contractName} for ${amount} USDC`);
};

// Register property event handlers for all properties
Object.keys(PROPERTY_MAPPING).forEach(address => {
  const propertyInfo = PROPERTY_MAPPING[address];
  const contractName = propertyInfo.name.replace(/\s+/g, '');
  
  // Create handlers for each property contract
  if (global[contractName]) {
    global[contractName].SharesPurchased.handler(async (params) => {
      await handleSharesPurchased({ ...params, contractName: propertyInfo.name });
    });
    
    global[contractName].YieldDistributed.handler(async ({ event, context }) => {
      console.log(`💰 Yield Distributed in ${propertyInfo.name}: ${event.params.investor}`);
      
      const { investor, amount } = event.params;
      const propertyAddress = event.srcAddress;
      
      // Update property ownership yield
      const ownershipId = `${investor}-${propertyAddress}`;
      const ownership = await context.PropertyOwnership.get(ownershipId);
      
      if (ownership) {
        ownership.yieldEarned += amount;
        ownership.updatedAt = BigInt(event.block.timestamp);
        await context.PropertyOwnership.set(ownership);
      }
      
      console.log(`✅ ${investor} received ${amount} USDC yield from ${propertyInfo.name}`);
    });
  }
});

console.log("🚀 Real-Time Financial Engine Event Handlers Loaded");