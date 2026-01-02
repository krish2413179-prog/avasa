# 🏠 Veda Real-Time Financial Engine

**Zero-latency financial intelligence powered by Envio GraphQL indexer**

Veda transforms traditional property investment by providing real-time financial analytics where **rent = equity accumulation**. Built on the concept of "Real-Time Home Ownership," Veda delivers instant insights into payment flows, property performance, and user activity through high-performance GraphQL queries.

## 🚀 Features

### Real-Time Analytics
- **Zero-latency queries** via Envio GraphQL indexer
- **Live payment tracking** with sub-second updates
- **Protocol-wide statistics** and performance metrics
- **User financial profiles** with comprehensive activity history

### Financial Intelligence
- **Payment execution monitoring** with gas optimization
- **USDC transfer analysis** with categorization (payment/property/swap related)
- **Active schedule tracking** for recurring payments
- **Portfolio performance** with yield calculations

### Developer Experience
- **RESTful API** with comprehensive endpoints
- **TypeScript support** with full type safety
- **Interactive demo** with real-time data visualization
- **Health monitoring** with system status checks

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Veda Backend   │    │  Envio Indexer  │
│   (Next.js)     │◄──►│   (Express.js)   │◄──►│   (GraphQL)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Blockchain     │
                       │   (Base Sepolia) │
                       └──────────────────┘
```

## 📊 API Endpoints

### Health & Status
- `GET /health` - System health check
- `GET /api/envio/health` - Envio indexer connection status

### User Analytics
- `GET /api/envio/user/:address` - User financial profile
- `GET /api/envio/dashboard/:address` - Comprehensive user dashboard
- `GET /api/envio/user/:address/payments` - User payment history

### Protocol Analytics
- `GET /api/envio/protocol/stats` - Protocol-wide statistics
- `GET /api/envio/payments/recent` - Recent payment executions
- `GET /api/envio/transfers/recent` - Recent USDC transfers

### Custom Queries
- `POST /api/envio/query` - Execute custom GraphQL queries

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Access to Envio GraphQL endpoint

### Installation

1. **Clone and install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment variables:**
```bash
# Copy and edit .env file
cp .env.example .env

# Required variables:
ENVIO_GRAPHQL_ENDPOINT=https://indexer.dev.hyperindex.xyz/fd320ab/v1/graphql
PORT=3001
```

3. **Build and start the server:**
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

4. **Test the integration:**
```bash
npm test
```

## 🎯 Quick Start

### 1. Start the Server
```bash
npm run dev
```

### 2. Test Health Check
```bash
curl http://localhost:3001/health
```

### 3. Get User Profile
```bash
curl "http://localhost:3001/api/envio/user/0x24c80f19649c0Da8418011eF0B6Ed3e22007758c"
```

### 4. View Interactive Demo
Open `veda-demo.html` in your browser or run:
```bash
npm run demo
```

## 📈 Real-Time Data Examples

### User Financial Profile
```json
{
  "profile": {
    "user": "0x24c80f19649c0Da8418011eF0B6Ed3e22007758c",
    "totalPaymentVolumeSent": "1070000000000000000000",
    "totalPaymentVolumeReceived": "0",
    "totalPropertyInvestments": "0",
    "activePaymentSchedules": 0,
    "totalPaymentsSent": 107
  }
}
```

### Protocol Statistics
```json
{
  "stats": {
    "date": "2025-12-29",
    "totalPaymentVolume": "510000000000000000000",
    "totalPayments": "59",
    "activePaymentSchedules": "0",
    "totalExecutorRewards": "5900000000000000000"
  }
}
```

### Recent Payment Execution
```json
{
  "id": "0x40d4ef151c2d1f19d4e3c5196834098ccf7b8bdd0b2d010542acd622f80f413b_16",
  "payer": "0x24c80f19649c0Da8418011eF0B6Ed3e22007758c",
  "recipient": "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
  "amount": "10000000000000000000",
  "timestamp": "1735567847",
  "executor": "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
  "executorReward": "100000000000000000"
}
```

## 🔧 Configuration

### Environment Variables
```bash
# Envio Configuration
ENVIO_GRAPHQL_ENDPOINT=https://indexer.dev.hyperindex.xyz/fd320ab/v1/graphql
ENVIO_API_KEY=                    # Optional API key

# Server Configuration  
PORT=3001                         # Server port
NODE_ENV=development              # Environment mode

# Database (if using local storage)
DB_URL=./database.sqlite          # SQLite database path
```

### Contract Addresses (Base Sepolia)
```bash
# Core Contracts
AUTO_RECURRING_PAYMENTS=0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96
SIMPLE_SWAP_POOL=0xCe3bf5DEd091c822193F14502B724a1bf1040E5C
USDC_TOKEN=0x6B0dacea6a72E759243c99Eaed840DEe9564C194
```

## 🧪 Testing

### Run Integration Tests
```bash
# Test Envio connection and queries
npm test

# Test specific endpoints
curl http://localhost:3001/api/envio/health
curl http://localhost:3001/api/envio/protocol/stats
```

### Debug User Queries
```bash
# Debug address case sensitivity issues
node debug-user.js
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Setup
```bash
# Production environment variables
ENVIO_GRAPHQL_ENDPOINT=https://indexer.dev.hyperindex.xyz/fd320ab/v1/graphql
NODE_ENV=production
PORT=3001
```

## 📚 API Documentation

### GraphQL Schema Integration
The Envio client automatically handles:
- **UserActivity** - User financial profiles and metrics
- **PaymentExecution** - Real-time payment tracking
- **PaymentSchedule** - Recurring payment management
- **USDCTransfer** - Token transfer analysis
- **DailyProtocolStats** - Protocol performance metrics

### Error Handling
All endpoints include comprehensive error handling:
```json
{
  "error": "Failed to fetch user data",
  "message": "GraphQL query validation failed",
  "timestamp": "2025-12-30T15:55:43.335Z"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **Envio Documentation**: https://docs.envio.dev/
- **GraphQL Playground**: https://indexer.dev.hyperindex.xyz/fd320ab/v1/graphql
- **Base Sepolia Explorer**: https://sepolia.basescan.org/

---

**Built with ❤️ by the Veda Team**

*Transforming property investment through real-time financial intelligence*