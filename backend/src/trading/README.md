# PropChain AI - Advanced Trading Features

## 🤖 AI-Powered Robo-Advisor for DeFi

PropChain AI now includes three advanced trading features that transform it into a sophisticated robo-advisor, similar to Betterment but for DeFi on Base Sepolia.

## 🚀 Features Overview

### 1. ⚖️ Auto-Rebalance Portfolio (The Intelligent Investor)

**What it does**: Automatically maintains your target portfolio allocation by rebalancing when assets drift from their targets.

**Example Commands**:
- `"Keep my portfolio 60% Real Estate and 40% ETH"`
- `"Rebalance weekly with 70% properties and 30% USDC"`
- `"Maintain balanced allocation monthly"`

**How it works**:
1. **Portfolio Monitoring**: Uses Envio to get real-time portfolio values
2. **Price Feeds**: Chainlink oracles provide current asset prices
3. **Deviation Detection**: Triggers when allocation drifts >5% from target
4. **Smart Execution**: Uses Uniswap V3 for optimal swap execution
5. **Automated Scheduling**: Runs weekly/monthly based on user preference

**Technical Implementation**:
```typescript
// Auto-rebalance configuration
{
  userId: "0x123...",
  targetAllocations: { 'RealEstate': 60, 'ETH': 40 },
  frequency: 'weekly',
  threshold: 5, // 5% deviation triggers rebalance
  maxSlippage: 0.5,
  isActive: true
}
```

### 2. 👥 Copy Trading (The Social Feature)

**What it does**: Automatically copies trades from successful "whale" addresses in real-time using Envio monitoring.

**Example Commands**:
- `"Copy every trade from nancy.base.eth"`
- `"Follow 0x123... with 10% of their trade size"`
- `"Copy whale trades up to 2 ETH maximum"`

**How it works**:
1. **Whale Monitoring**: Envio indexes all Uniswap swaps from target address
2. **Real-time Detection**: New trades detected within 1 minute
3. **Proportional Copying**: Copy configurable % of whale's trade size
4. **Risk Management**: Maximum trade size limits and token filtering
5. **Instant Execution**: Automatic execution on Uniswap V3

**Technical Implementation**:
```typescript
// Copy trading configuration
{
  userId: "0x456...",
  whaleAddress: "nancy.base.eth",
  copyPercentage: 10, // Copy 10% of whale's trade size
  maxTradeSize: "2", // Maximum 2 ETH per trade
  allowedTokens: ['WETH', 'USDC', 'DAI'],
  isActive: true
}
```

### 3. 📋 Limit Orders (Buy The Dip)

**What it does**: Creates artificial limit orders (not native to Uniswap) by monitoring prices and executing when conditions are met.

**Example Commands**:
- `"Buy ETH if price drops below $1500"`
- `"Sell 2 ETH when price hits $4000"`
- `"Buy 1000 USDC worth of ETH at $1800"`

**How it works**:
1. **Price Monitoring**: Chainlink price feeds checked every 30 seconds
2. **Condition Checking**: Compares current price to target price
3. **Automatic Execution**: Triggers Uniswap V3 swap when condition met
4. **Order Management**: Tracks active orders and expiration times
5. **Slippage Protection**: Built-in slippage limits for execution

**Technical Implementation**:
```typescript
// Limit order structure
{
  id: "order_123",
  userId: "0x789...",
  tokenIn: "USDC",
  tokenOut: "WETH", 
  targetPrice: "1500", // $1500 per ETH
  amount: "1500", // 1500 USDC
  orderType: "buy",
  status: "active",
  expiresAt: 1640995200000 // Optional expiration
}
```

## 🏗️ Architecture

### Core Components

1. **TradingEngine** (`tradingEngine.ts`)
   - Executes all trading operations
   - Integrates with Uniswap V3, Chainlink, Envio
   - Handles auto-rebalance, copy trading, limit orders

2. **TradingMonitor** (`tradingMonitor.ts`)
   - Background service with cron jobs
   - Monitors prices, whale trades, rebalance triggers
   - Executes trades automatically

3. **AI Parser Extensions** (`parser.ts`)
   - Parses natural language trading commands
   - Extracts parameters for complex trading strategies
   - Supports advanced command patterns

### Integration Points

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Chainlink     │───▶│  TradingEngine   │───▶│   Uniswap V3    │
│  Price Feeds    │    │                  │    │    Router       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│     Envio       │───▶│ TradingMonitor   │───▶│   PropChain     │
│   HyperIndex    │    │  (Background)    │    │      AI         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Configuration

### Environment Variables

Add to `backend/.env`:
```bash
# Chainlink Price Feeds (Base Sepolia)
CHAINLINK_ETH_USD=0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1
CHAINLINK_USDC_USD=0x7e860098F58bBFC8648a4311b374B1D669a2bc6B

# Uniswap V3 (Base Sepolia)
UNISWAP_V3_ROUTER=0x2626664c2603336E57B271c5C0b26F421741e481
UNISWAP_V3_QUOTER=0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3

# Trading Monitor Settings
TRADING_MONITOR_ENABLED=true
LIMIT_ORDER_CHECK_INTERVAL=300000  # 5 minutes
COPY_TRADING_CHECK_INTERVAL=60000  # 1 minute
PRICE_MONITOR_INTERVAL=30000       # 30 seconds
```

### Database Schema

The trading features require additional database tables:

```sql
-- Auto-rebalance configurations
CREATE TABLE rebalance_configs (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  target_allocations TEXT NOT NULL, -- JSON
  frequency TEXT NOT NULL,
  threshold REAL NOT NULL,
  max_slippage REAL NOT NULL,
  is_active BOOLEAN NOT NULL,
  created_at INTEGER NOT NULL,
  last_rebalance INTEGER
);

-- Copy trading configurations  
CREATE TABLE copy_trading_configs (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  whale_address TEXT NOT NULL,
  copy_percentage REAL NOT NULL,
  max_trade_size TEXT NOT NULL,
  allowed_tokens TEXT NOT NULL, -- JSON array
  is_active BOOLEAN NOT NULL,
  created_at INTEGER NOT NULL
);

-- Limit orders
CREATE TABLE limit_orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_in TEXT NOT NULL,
  token_out TEXT NOT NULL,
  target_price TEXT NOT NULL,
  amount TEXT NOT NULL,
  order_type TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  filled_at INTEGER,
  tx_hash TEXT
);
```

## 📊 Monitoring & Health Checks

### Trading Monitor Status

Check the status of background trading services:

```bash
# Health check
curl http://localhost:3001/api/trading/health

# Response
{
  "status": "healthy",
  "services": {
    "envio": true,
    "chainlink": true, 
    "uniswap": true
  },
  "activeTasks": 4,
  "uptime": 3600
}
```

### Active Schedules

The trading monitor runs these background tasks:

- **Limit Orders**: Checked every 5 minutes
- **Copy Trading**: Whale trades monitored every minute  
- **Auto-Rebalance**: Triggered every hour (if conditions met)
- **Price Monitoring**: Chainlink feeds checked every 30 seconds

## 🎯 Usage Examples

### 1. Set Up Auto-Rebalancing

```bash
# User command: "Keep my portfolio 60% Real Estate and 40% ETH weekly"

# Parsed action:
{
  "type": "auto_rebalance",
  "description": "Auto-rebalance portfolio: 60% RealEstate, 40% ETH",
  "params": {
    "action": "activate",
    "targetAllocations": {"RealEstate": 60, "ETH": 40},
    "rebalanceFrequency": "weekly",
    "rebalanceThreshold": 5
  }
}
```

### 2. Enable Copy Trading

```bash
# User command: "Copy every trade from nancy.base.eth with 10% size"

# Parsed action:
{
  "type": "copy_trading", 
  "description": "Copy 10% of trades from nancy.base.eth",
  "params": {
    "action": "activate",
    "whaleAddress": "nancy.base.eth",
    "copyPercentage": 10,
    "maxTradeSize": "1",
    "allowedTokens": ["WETH", "USDC", "DAI"]
  }
}
```

### 3. Create Limit Order

```bash
# User command: "Buy ETH if price drops below $1500"

# Parsed action:
{
  "type": "limit_order",
  "description": "BUY 1 ETH at $1500", 
  "params": {
    "action": "create",
    "orderType": "buy",
    "tokenIn": "USDC",
    "tokenOut": "ETH", 
    "amount": "1",
    "targetPrice": "1500",
    "expiresIn": "24h"
  }
}
```

## 🚀 Benefits

### For Users
- **Automated Portfolio Management**: Set-and-forget rebalancing
- **Social Trading**: Follow successful traders automatically  
- **Price Opportunities**: Never miss a dip or peak
- **Risk Management**: Built-in limits and slippage protection
- **24/7 Monitoring**: AI agent works while you sleep

### For Developers
- **Modular Architecture**: Easy to extend with new strategies
- **Real-time Data**: Envio provides instant blockchain state
- **Reliable Execution**: Chainlink oracles and Uniswap V3 integration
- **Comprehensive Monitoring**: Health checks and status reporting
- **Natural Language**: Users interact with plain English commands

## 🔮 Future Enhancements

1. **Advanced Strategies**: Mean reversion, momentum trading
2. **Multi-DEX Routing**: Best price execution across DEXs
3. **Options Integration**: Hedging and income strategies
4. **Social Features**: Leaderboards and strategy sharing
5. **Mobile Notifications**: Real-time trade alerts
6. **Portfolio Analytics**: Performance attribution and risk metrics

---

**Result**: PropChain AI is now a full-featured DeFi robo-advisor that combines RWA investments with sophisticated trading automation! 🤖⚡