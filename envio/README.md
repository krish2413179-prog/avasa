# 🏆 PropChain AI - Award-Winning DeFi Analytics Indexer

> **Real-time indexing for RWA properties + Advanced Payment Automation + Swap Analytics**

This Envio indexer provides comprehensive, real-time analytics for the PropChain AI ecosystem, tracking everything from automated recurring payments to multi-property RWA investments and DEX swaps.

## 🚀 **Award-Winning Features**

### **1. Advanced Payment Automation Analytics**
- **AutoRecurringPayments Contract**: `0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96`
- Real-time payment schedule tracking
- Executor reward distribution analytics
- Permission management (EIP-7715 style)
- Cross-user payment flow analysis

### **2. Comprehensive Swap Pool Monitoring**
- **SimpleSwapPool Contract**: `0xCe3bf5DEd091c822193F14502B724a1bf1040E5C`
- ETH/USDC swap analytics (1 ETH = 3000 USDC)
- Recurring swap automation tracking
- Liquidity pool event monitoring
- Instant vs recurring swap comparison

### **3. Multi-Property RWA Portfolio Tracking**
- **10 Real Estate Properties** across major US cities
- Individual property performance analytics
- User portfolio aggregation
- Yield distribution tracking
- Share transfer monitoring

### **4. USDC Token Flow Analysis**
- **USDC Token**: `0x6B0dacea6a72E759243c99Eaed840DEe9564C194`
- Context-aware transfer classification
- Payment vs swap vs property transaction detection
- Approval event tracking for automation setup

### **5. Executor Performance Analytics**
- Individual executor statistics
- Daily reward distribution tracking
- Payment vs swap execution comparison
- Performance leaderboards

### **6. Protocol-Wide Analytics**
- Daily protocol statistics
- User activity summaries
- Contract interaction analytics
- Gas usage optimization insights

## 📊 **Key Entities & Analytics**

### **Payment Automation**
```graphql
type PaymentSchedule {
  payer: String!
  recipient: String!
  amount: BigInt!
  interval: BigInt!
  executionsLeft: BigInt!
  executorReward: BigInt!
  isActive: Boolean!
}

type PaymentExecution {
  schedule: PaymentSchedule!
  executor: String!
  executorReward: BigInt!
  timestamp: BigInt!
}
```

### **Swap Analytics**
```graphql
type SwapExecution {
  user: String!
  usdcAmount: BigInt!
  ethAmount: BigInt!
  swapType: String! # "instant" or "recurring"
  executor: String!
}

type SwapSchedule {
  user: String!
  usdcAmount: BigInt!
  interval: BigInt!
  executionsLeft: BigInt!
  isActive: Boolean!
}
```

### **RWA Portfolio**
```graphql
type UserPortfolio {
  user: String!
  propertyId: String!
  totalShares: BigInt!
  totalInvested: BigInt!
  totalYieldClaimed: BigInt!
}
```

### **Executor Analytics**
```graphql
type ExecutorStats {
  executor: String!
  totalExecutions: BigInt!
  totalRewardsEarned: BigInt!
  paymentExecutions: BigInt!
  swapExecutions: BigInt!
  averageReward: BigInt!
}
```

## 🎯 **Real-World Use Cases**

### **1. Payment Automation Dashboard**
- Track all recurring payment schedules
- Monitor executor performance and rewards
- Analyze payment flow patterns
- Detect automation bottlenecks

### **2. DEX Analytics Platform**
- Compare instant vs recurring swap volumes
- Track liquidity pool health
- Monitor arbitrage opportunities
- Analyze user swap patterns

### **3. RWA Investment Analytics**
- Portfolio performance tracking
- Property-specific yield analysis
- Investment flow visualization
- Risk assessment metrics

### **4. Executor Marketplace**
- Executor performance leaderboards
- Reward distribution analytics
- Execution success rates
- Network health monitoring

## 🔧 **Setup & Deployment**

### **Prerequisites**
```bash
npm install -g envio
```

### **Installation**
```bash
cd envio
npm install
```

### **Development**
```bash
# Generate types and start development
envio codegen
envio dev
```

### **Production Deployment**
```bash
# Build and deploy
envio build
envio start
```

## 📈 **Analytics Queries**

### **Top Executors by Rewards**
```graphql
query TopExecutors {
  executorStats(
    orderBy: totalRewardsEarned
    orderDirection: desc
    first: 10
  ) {
    executor
    totalRewardsEarned
    totalExecutions
    averageReward
  }
}
```

### **Daily Protocol Activity**
```graphql
query DailyActivity($date: String!) {
  dailyProtocolStats(id: $date) {
    totalPayments
    totalPaymentVolume
    totalSwaps
    totalSwapVolumeUSDC
    totalExecutorRewards
  }
}
```

### **User Portfolio Summary**
```graphql
query UserPortfolio($user: String!) {
  userPortfolios(where: { user: $user }) {
    propertyId
    totalShares
    totalInvested
    totalYieldClaimed
  }
  
  userActivity(id: $user) {
    totalPaymentsSent
    totalSwaps
    totalExecutorRewards
  }
}
```

### **Active Payment Schedules**
```graphql
query ActivePayments {
  paymentSchedules(where: { isActive: true }) {
    id
    payer
    recipient
    amount
    interval
    executionsLeft
    nextPayment
  }
}
```

## 🏗️ **Architecture**

### **Contract Integration**
- **AutoRecurringPayments**: Payment automation with executor rewards
- **SimpleSwapPool**: ETH/USDC DEX with recurring swaps
- **RWA Properties**: 10 tokenized real estate contracts
- **USDC Token**: Payment flow tracking

### **Event Processing**
- Real-time event ingestion from Base Sepolia
- Cross-contract transaction correlation
- Context-aware event classification
- Comprehensive analytics aggregation

### **Data Models**
- Normalized entity relationships
- Time-series analytics support
- User-centric data aggregation
- Protocol-wide statistics

## 🔮 **Future Enhancements**

### **Ready-to-Enable Integrations**
- **Uniswap V3**: Advanced DEX analytics
- **Superfluid**: Streaming payment tracking
- **Aave V3**: Lending protocol integration
- **Additional RWA Assets**: Expand property portfolio

### **Advanced Analytics**
- Machine learning insights
- Predictive analytics
- Risk assessment models
- Automated reporting

## 🏆 **Award Criteria Alignment**

### **Innovation**
- First comprehensive RWA + DeFi automation indexer
- Cross-protocol transaction correlation
- Real-time executor performance tracking

### **Technical Excellence**
- Comprehensive event coverage
- Optimized query performance
- Scalable architecture design
- Production-ready deployment

### **Real-World Impact**
- Enables payment automation dashboards
- Powers executor marketplaces
- Facilitates RWA investment analytics
- Supports DeFi protocol optimization

### **Community Value**
- Open-source implementation
- Comprehensive documentation
- Extensible architecture
- Developer-friendly APIs

---

**Built with ❤️ for the Envio ecosystem**

*This indexer showcases the power of real-time blockchain analytics for next-generation DeFi applications.*