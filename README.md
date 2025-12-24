# PropChain AI - RWA DeFi Platform

An AI-powered Real World Asset (RWA) platform for tokenized real estate investment with automated yield optimization and compliance.

## 🔐 **NEW: EIP-7715 Advanced Permission Strategies**

PropChain AI now implements the **"Best Use"** of MetaMask Advanced Permissions with three sophisticated strategies for automated wealth management:

### **1. 🌾 Yield Farmer (Auto-Compounding)**
- **Purpose**: Automatically reinvest rental income for compound growth
- **Permission**: "Allow Agent to call `claimYield()` AND `invest()` on property contracts, but ONLY using funds generated from yield"
- **Benefit**: Creates infinite compound interest with one signature
- **Command**: `"Turn on Auto-Compound for property 1"`

### **2. 📈 Smart DCA (Dollar Cost Averaging)**
- **Purpose**: Weekly investments with rate limits and day restrictions
- **Permission**: "Allow spending 50 USDC every period of 604800 seconds (1 week) on Mondays only"
- **Safety**: Even if hacked, only $50/week at risk
- **Command**: `"Invest $50 every Monday in property 2"`

### **3. 🚨 Emergency Brake (Stop-Loss)**
- **Purpose**: Dormant permission that activates on price triggers
- **Permission**: "Allow Agent to swap ALL ETH to USDC IF ETH price < $2,000"
- **Benefit**: Institutional-grade risk management
- **Command**: `"Emergency sell if ETH drops below $1500"`

## 🚀 **Hyper-Speed Portfolio Tracking with Envio**

PropChain AI uses **Envio HyperIndex** as its "Real-Time Brain" for instant portfolio queries:

- ⚡ **Portfolio Loading**: `<50ms` (vs 2-5 seconds with RPC calls)
- 🧠 **AI Analysis**: Complete portfolio context in `<100ms`
- 📊 **Market Data**: Real-time performance across all 10 properties
- 🔄 **DeFi Tracking**: Superfluid streams, Uniswap swaps, Aave positions

### Architecture: Blockchain → Envio → AI Agent
```
Base Sepolia (10 Properties + DeFi) → Envio GraphQL → PropChain AI (Smart Decisions)
```

## 🏢 **Core Features**

### **Advanced Trading Engine**
- **Auto-Rebalance Portfolio**: Intelligent robo-advisor maintaining target allocations (60% Real Estate, 40% ETH)
- **Copy Trading**: Follow whale addresses automatically with Envio real-time monitoring
- **Limit Orders**: Buy-the-dip with AI-powered price monitoring and Chainlink feeds
- **Smart Scheduling**: Recurring investments with advanced permission controls

### **EIP-7715 Permission Management**
- **Granular Contract Restrictions**: Beyond simple spending limits to method-level control
- **Yield-Only Spending**: Permissions that only allow spending funds from yield claims
- **Rate Limits with Time Windows**: Weekly/monthly limits with day-of-week restrictions
- **Conditional Triggers**: Dormant permissions activated by price thresholds

### **RWA Tokenization**
- **Property NFTs**: Tokenized real estate assets with metadata
- **Yield Tokens**: Fractional ownership with automated distributions
- **Compliance Layer**: KYC/AML integration with selective disclosure
- **Asset Valuation**: AI-powered property appraisal and market analysis

### **AI-Powered Management**
- **Yield Optimization**: Groq AI analyzes market data for optimal strategies
- **Portfolio Rebalancing**: Automated asset allocation based on performance
- **Risk Assessment**: Real-time monitoring of property values and market conditions
- **Predictive Analytics**: Market trend analysis and investment recommendations

### **MetaMask Advanced Permissions (EIP-7702)**
- **Smart Account Integration**: Automated transaction execution
- **Session Key Management**: Secure delegation for AI agents
- **Policy-Based Execution**: Granular permission controls
- **Compliance Automation**: Automated KYC and regulatory reporting

### **Envio Real-Time Indexing**
- **Asset Performance Tracking**: Real-time yield calculations
- **Transaction Monitoring**: All RWA transfers and distributions
- **Market Data Aggregation**: Property values and rental income
- **Analytics Dashboard**: Performance metrics and insights

## 🚀 **Getting Started**

### **Supported Networks (EIP-7702)**
- **Base Sepolia**: Primary testnet for development
- **Ethereum Sepolia**: Fallback testnet
- **Polygon Mumbai**: Alternative testnet

### **Prerequisites**
- MetaMask with Advanced Permissions support
- Base Sepolia testnet tokens
- Groq AI API key for intelligent automation
- Envio indexer setup

## 🔧 **Technology Stack**

- **Frontend**: Next.js + MetaMask Smart Accounts Kit
- **Backend**: Node.js + Express + AI Agents
- **Blockchain**: Base Sepolia (EIP-7702 support)
- **AI**: Groq for natural language processing
- **Indexing**: Envio for real-time data
- **Storage**: IPFS for property metadata

## 📊 **Track Focus: RWA/RealFi**

This project demonstrates:
- **Tokenization of Real Estate**: Properties as tradeable NFTs
- **Compliant Yield Distribution**: Automated rental income distribution
- **KYC Flows**: Privacy-preserving identity verification
- **AI & Oracles**: Smart automation using LLMs and market data
- **DeFi Composability**: Integration with lending protocols

## 🛠️ **Installation**

```bash
# Install dependencies
npm install

# Install MetaMask Smart Accounts Kit
cd frontend && npm install @metamask/smart-accounts-kit

# Install Envio CLI
npm install -g envio

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Start development servers
npm run dev
```

## 🔑 **Environment Variables**

### Frontend (.env.local)
```
NEXT_PUBLIC_WALLET_CONNECT_ID=your_wallet_connect_id
NEXT_PUBLIC_ENVIO_API_URL=https://indexer.envio.dev
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud
```

### Backend (.env)
```
GROQ_API_KEY=your_groq_api_key
PRIVATE_KEY=your_private_key
RPC_URL=https://sepolia.base.org
ENVIO_WEBHOOK_URL=your_envio_webhook
PINATA_API_KEY=your_pinata_key
```

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Blockchain    │
│                 │    │                 │    │                 │
│ • MetaMask Kit  │◄──►│ • AI Agents     │◄──►│ • RWA Contracts │
│ • Property UI   │    │ • Yield Calc    │    │ • EIP-7702      │
│ • Analytics     │    │ • Compliance    │    │ • Base Sepolia  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Envio Indexer  │
                    │                 │
                    │ • Real-time     │
                    │ • Analytics     │
                    │ • Webhooks      │
                    └─────────────────┘
```

## 🔗 **API Documentation**

### **EIP-7715 Advanced Permission Endpoints**

#### Create Yield Farmer Permission
```bash
POST /api/permissions/yield-farmer
{
  "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6",
  "propertyId": "1"
}
```

#### Create Smart DCA Permission
```bash
POST /api/permissions/smart-dca
{
  "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6",
  "weeklyAmount": "0.1",
  "propertyId": "2"
}
```

#### Create Emergency Brake Permission
```bash
POST /api/permissions/emergency-brake
{
  "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6",
  "triggerPrice": "1500"
}
```

#### Execute Yield Farming
```bash
POST /api/permissions/execute/yield-farmer
{
  "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6",
  "propertyId": "1"
}
```

#### Execute Smart DCA
```bash
POST /api/permissions/execute/smart-dca
{
  "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6",
  "propertyId": "2",
  "weeklyAmount": "0.1"
}
```

#### Check Emergency Brake
```bash
POST /api/permissions/check/emergency-brake
{
  "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6",
  "triggerPrice": "1500"
}
```

#### Get User Permissions
```bash
GET /api/permissions/user/{userAddress}
```

#### Validate Permission
```bash
POST /api/permissions/validate
{
  "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6",
  "contractAddress": "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
  "methodName": "purchaseShares(uint256)",
  "value": "100000000000000000"
}
```

### **AI Parser & Execution**

#### Parse Natural Language Commands
```bash
POST /api/parse
{
  "input": "Turn on Auto-Compound for property 1"
}
```

#### Execute Parsed Actions
```bash
POST /api/execute
{
  "action": {
    "type": "yield_farmer",
    "description": "Execute yield farming for property 1",
    "params": {
      "action": "execute",
      "propertyId": "1",
      "permissionType": "yield_farmer"
    }
  },
  "permissionContext": {
    "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6",
    "method": "eip7715_advanced",
    "sessionKey": "0x449f7e2cc2cfbbfbf1f13d265c17f698d9f57f303e4d56d88c178196dc382951",
    "chainId": 84532
  }
}
```

### **Portfolio & Analytics**

#### Get Portfolio Performance
```bash
GET /api/portfolio/performance
```

#### Get Property Performance
```bash
GET /api/portfolio/properties
```

#### Get User Portfolio
```bash
GET /api/portfolio/user/{userAddress}
```

## 🤖 **AI Commands**

### **EIP-7715 Advanced Permission Strategies**
- `"Turn on Auto-Compound for property 1"` - Activate yield farming
- `"Invest $50 every Monday in property 2"` - Setup Smart DCA
- `"Emergency sell if ETH drops below $1500"` - Create Emergency Brake
- `"Execute yield farming for property 3"` - Manual yield farming execution
- `"Check emergency brake trigger"` - Check if emergency conditions are met

### **Advanced Trading Features**
- `"Keep my portfolio 60% Real Estate and 40% ETH"` - Auto-rebalance activation
- `"Copy every trade from nancy.base.eth"` - Copy trading setup
- `"Buy ETH if price drops below $1500"` - Limit order creation
- `"Sell 2 ETH when price hits $4000"` - Sell limit order

### **Core DeFi Features**
- `"Stream 5 USDC/day to alice.base.eth"` - Superfluid money streaming
- `"Stream 10 USD/2 hours to ales"` - Complex streaming rates
- `"Resolve alice.base.eth to address"` - Basename ENS resolution
- `"Borrow 500 USDC against 1 WETH"` - Aave V3 borrowing

### **RWA Investment Commands**
- `"Invest $25000 in the beachfront property with aggressive strategy"`
- `"Put $10000 in the office space"`
- `"Buy shares in the resort property"`
- `"Claim yield from all properties"`
- `"Sell $1000 worth ETH daily and invest in this property"`

## 🏆 **Key Achievements**

### **EIP-7715 "Best Use" Implementation**
✅ **Yield Farmer**: Auto-compounding with yield-only spending restrictions  
✅ **Smart DCA**: Weekly rate limits with day-of-week enforcement  
✅ **Emergency Brake**: Dormant permissions activated by price triggers  
✅ **Granular Permissions**: Method-level contract restrictions  
✅ **Database Integration**: Permission storage and execution tracking  

### **Advanced Trading Engine**
✅ **Auto-Rebalance**: Intelligent portfolio optimization with Uniswap V3  
✅ **Copy Trading**: Real-time whale following with Envio monitoring  
✅ **Limit Orders**: AI-powered price monitoring with Chainlink feeds  
✅ **Trading Monitor**: Background service with cron job scheduling  

### **Real-Time Analytics**
✅ **Envio Integration**: <50ms portfolio queries vs 2-5s RPC calls  
✅ **GraphQL API**: Structured data access for AI analysis  
✅ **Portfolio Agent**: AI-powered performance insights  
✅ **Multi-Protocol Tracking**: RWA + DeFi unified analytics  

### **AI-Powered Automation**
✅ **OpenAI Function Calling**: Advanced natural language processing  
✅ **Context-Aware Parsing**: Property registry and token mapping  
✅ **Intelligent Scheduling**: Recurring investments with smart triggers  
✅ **Negation Detection**: Safety mechanisms for command validation  

## 📈 **Performance Metrics**

- **AI Parsing Success Rate**: 84.2% (16/19 test cases)
- **Portfolio Query Speed**: <50ms (Envio) vs 2-5s (RPC)
- **Permission Validation**: <10ms database lookup
- **Trading Execution**: <500ms end-to-end latency
- **Real Estate Contracts**: 10 deployed properties on Base Sepolia
- **DeFi Protocol Integration**: 4 protocols (Superfluid, Basenames, Aave, Uniswap)

## 🔮 **Future Roadmap**

### **Q1 2025: Enhanced Permissions**
- [ ] Multi-signature permission policies
- [ ] Time-locked permission activation
- [ ] Cross-chain permission synchronization
- [ ] Advanced compliance automation

### **Q2 2025: AI Improvements**
- [ ] GPT-4 integration for complex strategies
- [ ] Predictive market analysis
- [ ] Automated risk assessment
- [ ] Natural language reporting

### **Q3 2025: Mainnet Deployment**
- [ ] Production smart contracts
- [ ] Institutional KYC integration
- [ ] Real property tokenization
- [ ] Regulatory compliance framework

---

**Built with ❤️ for the RWA/RealFi track**  
*Demonstrating the future of automated wealth management with EIP-7715 Advanced Permissions*#   a v a s a  
 