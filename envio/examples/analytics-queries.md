# 📊 PropChain AI Analytics - Example Queries

This document showcases the powerful analytics capabilities of the PropChain AI Envio indexer.

## 🚀 **Payment Automation Analytics**

### **Active Payment Schedules Dashboard**
```graphql
query ActivePaymentSchedules {
  paymentSchedules(
    where: { isActive: true }
    orderBy: createdAt
    orderDirection: desc
    first: 50
  ) {
    id
    payer
    recipient
    amount
    interval
    executionsLeft
    executorReward
    nextPayment
    createdAt
    
    executions(first: 5, orderBy: timestamp, orderDirection: desc) {
      timestamp
      executor
      executorReward
      transactionHash
    }
  }
}
```

### **Payment Execution Analytics**
```graphql
query PaymentExecutionStats($timeframe: BigInt!) {
  paymentExecutions(
    where: { timestamp_gte: $timeframe }
    orderBy: timestamp
    orderDirection: desc
  ) {
    id
    payer
    recipient
    amount
    executor
    executorReward
    timestamp
    transactionHash
    
    schedule {
      interval
      maxExecutions
    }
  }
}
```

### **Top Payment Recipients**
```graphql
query TopPaymentRecipients($timeframe: BigInt!) {
  paymentExecutions(
    where: { timestamp_gte: $timeframe }
  ) {
    recipient
    amount
  }
}
```

## 🔄 **Swap Analytics Dashboard**

### **Swap Volume Analysis**
```graphql
query SwapVolumeAnalysis($timeframe: BigInt!) {
  swapExecutions(
    where: { timestamp_gte: $timeframe }
    orderBy: timestamp
    orderDirection: desc
  ) {
    id
    user
    usdcAmount
    ethAmount
    swapType
    executor
    executorReward
    timestamp
    
    schedule {
      interval
      isActive
    }
  }
}
```

### **Instant vs Recurring Swaps**
```graphql
query SwapTypeComparison($timeframe: BigInt!) {
  instantSwaps: swapExecutions(
    where: { 
      timestamp_gte: $timeframe
      swapType: "instant"
    }
  ) {
    usdcAmount
    ethAmount
    timestamp
  }
  
  recurringSwaps: swapExecutions(
    where: { 
      timestamp_gte: $timeframe
      swapType: "recurring"
    }
  ) {
    usdcAmount
    ethAmount
    timestamp
    executorReward
  }
}
```

### **Liquidity Pool Health**
```graphql
query LiquidityPoolHealth {
  liquidityEvents(
    orderBy: timestamp
    orderDirection: desc
    first: 100
  ) {
    id
    eventType
    ethAmount
    usdcAmount
    timestamp
    transactionHash
  }
}
```

## 🏆 **Executor Performance Analytics**

### **Top Executors Leaderboard**
```graphql
query ExecutorLeaderboard {
  executorStats(
    orderBy: totalRewardsEarned
    orderDirection: desc
    first: 20
  ) {
    executor
    totalExecutions
    totalRewardsEarned
    paymentExecutions
    swapExecutions
    averageReward
    firstExecution
    lastExecution
  }
}
```

### **Executor Daily Performance**
```graphql
query ExecutorDailyPerformance($executor: String!, $days: Int!) {
  dailyExecutorRewards(
    where: { executor: $executor }
    orderBy: date
    orderDirection: desc
    first: $days
  ) {
    date
    totalRewards
    executionCount
    paymentRewards
    swapRewards
  }
}
```

### **Most Active Executors**
```graphql
query MostActiveExecutors($timeframe: BigInt!) {
  executorStats(
    orderBy: totalExecutions
    orderDirection: desc
    first: 10
  ) {
    executor
    totalExecutions
    totalRewardsEarned
    averageReward
    
    paymentExecutions_rel(
      where: { timestamp_gte: $timeframe }
      first: 5
    ) {
      timestamp
      amount
      executorReward
    }
    
    swapExecutions_rel(
      where: { timestamp_gte: $timeframe }
      first: 5
    ) {
      timestamp
      usdcAmount
      executorReward
    }
  }
}
```

## 🏢 **RWA Portfolio Analytics**

### **User Portfolio Overview**
```graphql
query UserPortfolioOverview($user: String!) {
  userPortfolios(where: { user: $user }) {
    propertyId
    totalShares
    totalInvested
    totalYieldClaimed
    lastUpdated
    
    transactions(first: 10, orderBy: timestamp, orderDirection: desc) {
      action
      amount
      timestamp
      transactionHash
    }
    
    yields(first: 10, orderBy: timestamp, orderDirection: desc) {
      amount
      timestamp
      transactionHash
    }
  }
  
  userActivity(id: $user) {
    totalPropertyInvestments
    totalPropertyVolume
    totalYieldClaimed
    propertiesOwned
    firstActivity
    lastActivity
  }
}
```

### **Property Performance Comparison**
```graphql
query PropertyPerformanceComparison {
  propertyTransactions(
    where: { action: "purchase" }
  ) {
    propertyId
    propertyName
    amount
    timestamp
  }
  
  yieldTransactions {
    propertyId
    propertyName
    amount
    timestamp
  }
}
```

### **Top Property Investors**
```graphql
query TopPropertyInvestors($propertyId: String!) {
  userPortfolios(
    where: { propertyId: $propertyId }
    orderBy: totalInvested
    orderDirection: desc
    first: 20
  ) {
    user
    totalShares
    totalInvested
    totalYieldClaimed
    lastUpdated
  }
}
```

## 💎 **USDC Flow Analysis**

### **USDC Transfer Context Analysis**
```graphql
query USDCFlowAnalysis($timeframe: BigInt!) {
  usdcTransfers(
    where: { timestamp_gte: $timeframe }
    orderBy: timestamp
    orderDirection: desc
    first: 100
  ) {
    from
    to
    value
    timestamp
    isPaymentRelated
    isSwapRelated
    isPropertyRelated
    relatedContract
    transactionHash
  }
}
```

### **Payment vs Swap USDC Usage**
```graphql
query USDCUsageBreakdown($timeframe: BigInt!) {
  paymentTransfers: usdcTransfers(
    where: { 
      timestamp_gte: $timeframe
      isPaymentRelated: true
    }
  ) {
    value
    timestamp
  }
  
  swapTransfers: usdcTransfers(
    where: { 
      timestamp_gte: $timeframe
      isSwapRelated: true
    }
  ) {
    value
    timestamp
  }
  
  propertyTransfers: usdcTransfers(
    where: { 
      timestamp_gte: $timeframe
      isPropertyRelated: true
    }
  ) {
    value
    timestamp
  }
}
```

## 📈 **Protocol-Wide Analytics**

### **Daily Protocol Statistics**
```graphql
query DailyProtocolStats($days: Int!) {
  dailyProtocolStats(
    orderBy: date
    orderDirection: desc
    first: $days
  ) {
    date
    totalPayments
    totalPaymentVolume
    activePaymentSchedules
    newPaymentSchedules
    totalSwaps
    totalSwapVolumeUSDC
    totalSwapVolumeETH
    activeSwapSchedules
    newSwapSchedules
    totalPropertyInvestments
    totalPropertyVolume
    totalYieldDistributed
    totalExecutorRewards
    activeExecutors
    totalGasUsed
    averageGasPrice
  }
}
```

### **User Activity Heatmap**
```graphql
query UserActivityHeatmap {
  userActivities(
    orderBy: lastActivity
    orderDirection: desc
    first: 100
  ) {
    user
    totalPaymentsSent
    totalPaymentsReceived
    totalSwaps
    totalPropertyInvestments
    totalExecutorRewards
    firstActivity
    lastActivity
  }
}
```

### **Contract Interaction Summary**
```graphql
query ContractInteractionSummary {
  contractInteractions {
    contractAddress
    contractName
    totalTransactions
    totalVolume
    uniqueUsers
    firstInteraction
    lastInteraction
  }
}
```

## 🎯 **Advanced Analytics Examples**

### **Executor Efficiency Analysis**
```graphql
query ExecutorEfficiencyAnalysis($timeframe: BigInt!) {
  executorStats {
    executor
    totalExecutions
    totalRewardsEarned
    averageReward
    
    paymentExecutions_rel(where: { timestamp_gte: $timeframe }) {
      timestamp
      executorReward
      gasUsed
      gasPrice
    }
    
    swapExecutions_rel(where: { timestamp_gte: $timeframe }) {
      timestamp
      executorReward
      gasUsed
      gasPrice
    }
  }
}
```

### **Payment Schedule Success Rate**
```graphql
query PaymentScheduleSuccessRate {
  paymentSchedules {
    id
    maxExecutions
    executionsLeft
    isActive
    createdAt
    
    executions {
      timestamp
      transactionHash
    }
  }
}
```

### **Cross-Protocol User Journey**
```graphql
query CrossProtocolUserJourney($user: String!) {
  # Payment activity
  paymentExecutions(where: { payer: $user }) {
    timestamp
    amount
    recipient
    transactionHash
  }
  
  # Swap activity
  swapExecutions(where: { user: $user }) {
    timestamp
    usdcAmount
    ethAmount
    swapType
    transactionHash
  }
  
  # Property investments
  propertyTransactions(where: { investor: $user }) {
    timestamp
    propertyName
    amount
    action
    transactionHash
  }
  
  # Executor activity
  executorStats(where: { executor: $user }) {
    totalExecutions
    totalRewardsEarned
  }
}
```

---

These queries demonstrate the comprehensive analytics capabilities of the PropChain AI Envio indexer, enabling deep insights into payment automation, swap analytics, RWA investments, and executor performance across the entire DeFi ecosystem.