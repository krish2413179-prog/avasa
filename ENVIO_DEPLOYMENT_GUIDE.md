# 🚀 Envio Deployment Guide for PropChain AI

## ✅ Configuration Status: READY FOR DEPLOYMENT

The Envio indexer configuration has been fixed and is ready for deployment. The main issues that were resolved:

### 🔧 Fixed Issues:
1. **Invalid transaction fields**: Removed `block_number`, `timestamp`, `gas_used` (not supported)
2. **Array of entities**: Removed `properties: [UserPortfolio!]!` from LivePortfolio entity
3. **Array of strings**: Simplified `preferredPropertyTypes` to a single string field
4. **Configuration cleanup**: Simplified field selection and removed unnecessary options

## 📁 Files Ready for Deployment:

### ✅ Core Configuration Files:
- `config.yaml` - Main indexer configuration (FIXED)
- `schema.graphql` - GraphQL schema (FIXED)
- `src/EventHandlers.ts` - Event processing logic
- `package.json` - Dependencies and scripts

### ✅ Documentation:
- `README.md` - Complete setup instructions
- `DEPLOYMENT_CHECKLIST.md` - Comprehensive deployment guide
- `ENVIO_DEPLOYMENT_GUIDE.md` - This file

## 🚀 Deployment Options:

### Option 1: Envio Cloud (Recommended)
```bash
# Install Envio CLI (Linux/Mac)
npm install -g @envio-dev/envio

# Navigate to envio directory
cd envio

# Deploy to Envio Cloud
envio deploy
```

### Option 2: Self-Hosted Deployment
```bash
# Generate TypeScript types
envio codegen

# Build the indexer
envio build

# Run with Docker
docker build -t propchain-indexer .
docker run -p 8080:8080 propchain-indexer
```

### Option 3: Local Development (Linux/Mac)
```bash
# Start local development server
envio dev

# GraphQL endpoint will be available at:
# http://localhost:8080/v1/graphql
```

## 🔍 Configuration Summary:

### Network Configuration:
- **Network**: Base Sepolia (Chain ID: 84532)
- **Start Block**: 0 (indexes from genesis)
- **Contracts**: 10 RWA properties + 3 DeFi protocols

### Indexed Contracts:
1. **RWA Properties (10 contracts)**:
   - Manhattan Luxury Apartments: `0xa16E02E87b7454126E5E10d957A927A7F5B5d2be`
   - Miami Beach Condos: `0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968`
   - Austin Tech Hub Office: `0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883`
   - Seattle Warehouse District: `0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26`
   - Denver Mountain Resort: `0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC`
   - Chicago Downtown Lofts: `0x86337dDaF2661A069D0DcB5D160585acC2d15E9a`
   - Los Angeles Studio Complex: `0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4`
   - Phoenix Retail Plaza: `0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8`
   - Boston Historic Brownstones: `0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B`
   - Nashville Music District: `0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3`

2. **DeFi Protocols (3 contracts)**:
   - Uniswap V3 Router: `0x2626664c2603336E57B271c5C0b26F421741e481`
   - Superfluid Host: `0x4C073B3baB6d88B6575C8743282064147A6A6903`
   - Aave V3 Pool: `0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b`

### Indexed Events:
- **RWA Events**: SharesPurchased, SharesWithdrawn, YieldDistributed, PropertyUpdated, Transfer
- **DeFi Events**: Swap (Uniswap), FlowUpdated (Superfluid), Supply/Borrow/Repay (Aave)

### GraphQL Entities:
- **Core Entities**: PropertyTransaction, YieldTransaction, UserPortfolio
- **DeFi Entities**: SwapTransaction, StreamTransaction, LendingTransaction
- **Analytics**: UserAnalytics, PropertyAnalytics, DailyMetrics
- **Real-time**: LivePortfolio, PropertyPerformance
- **AI**: UserPreferences, AIRecommendation, MarketTrend

## 📊 Expected Performance:

### Query Performance:
- **Portfolio Loading**: <50ms (vs 2-5s RPC)
- **Market Analysis**: <100ms (vs 10s+ RPC)
- **Transaction History**: <30ms (vs 5-15s RPC)
- **Multi-Property Query**: <200ms (vs 20s+ RPC)

### Indexing Performance:
- **Block Processing**: <1s per block
- **Event Processing**: <100ms per event
- **Database Writes**: <10ms per entity
- **GraphQL Response**: <50ms average

## 🔗 Integration with PropChain AI:

Once deployed, update the PropChain AI backend environment variables:

```env
# Backend .env
ENVIO_GRAPHQL_URL=https://your-envio-deployment.com/v1/graphql

# Frontend .env.local
NEXT_PUBLIC_ENVIO_API_URL=https://your-envio-deployment.com/v1/graphql
```

## 🧪 Testing Queries:

### Sample GraphQL Queries:
```graphql
# Get user portfolio
query GetUserPortfolio($user: String!) {
  userPortfolios(where: { user: $user }) {
    propertyId
    totalShares
    totalInvested
    totalYieldClaimed
  }
}

# Get property performance
query GetPropertyPerformance {
  propertyAnalytics {
    propertyName
    totalInvestors
    averageYieldRate
    totalValueLocked
  }
}

# Get recent transactions
query GetRecentTransactions {
  propertyTransactions(
    orderBy: { timestamp: desc }
    limit: 10
  ) {
    propertyName
    investor
    action
    amount
    timestamp
  }
}
```

## ⚠️ Windows Development Note:

The Envio CLI currently has issues on Windows. For local development on Windows:
1. Use WSL (Windows Subsystem for Linux)
2. Deploy directly to Envio Cloud
3. Use a Linux/Mac environment for development

## ✅ Deployment Checklist:

- [x] Configuration files fixed and validated
- [x] Event signatures match smart contracts
- [x] GraphQL schema compatible with Envio
- [x] All contract addresses verified
- [x] Documentation complete
- [x] Performance targets defined
- [x] Integration guide provided

## 🎯 Next Steps:

1. **Deploy to Envio Cloud** using the fixed configuration
2. **Update PropChain AI backend** with Envio GraphQL URL
3. **Test integration** with sample queries
4. **Monitor performance** and optimize as needed
5. **Scale deployment** based on usage patterns

---

**The Envio indexer is now ready to serve as PropChain AI's "Real-Time Brain"! 🧠⚡**