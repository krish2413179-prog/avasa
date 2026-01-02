const express = require('express');
const { GraphQLClient } = require('graphql-request');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Envio client
const endpoint = process.env.ENVIO_GRAPHQL_ENDPOINT || 'https://indexer.dev.hyperindex.xyz/fd320ab/v1/graphql';
const client = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  }
});

console.log('🚀 Envio API Server starting...');
console.log('📡 Envio Endpoint:', endpoint);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const query = `{ __typename }`;
    await client.request(query);
    res.json({ 
      status: 'healthy', 
      endpoint,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error.message,
      endpoint
    });
  }
});

// Get recent payment executions
app.get('/api/payments/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const query = `
      query GetRecentPayments($limit: Int!) {
        PaymentExecution(limit: $limit, order_by: { timestamp: desc }) {
          id
          payer
          recipient
          amount
          timestamp
          transactionHash
          executor
          executorReward
          gasUsed
        }
      }
    `;
    
    const data = await client.request(query, { limit });
    res.json({ 
      payments: data.PaymentExecution || [],
      count: data.PaymentExecution?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get protocol statistics
app.get('/api/protocol/stats', async (req, res) => {
  try {
    const query = `
      query GetProtocolStats {
        DailyProtocolStats(limit: 7, order_by: { date: desc }) {
          date
          totalPaymentVolume
          totalPayments
          totalPropertyVolume
          totalPropertyInvestments
          activePaymentSchedules
          totalExecutorRewards
          totalGasUsed
          averageGasPrice
        }
      }
    `;
    
    const data = await client.request(query);
    res.json({ 
      stats: data.DailyProtocolStats || [],
      latest: data.DailyProtocolStats?.[0] || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user activity
app.get('/api/user/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const userQuery = `
      query GetUserData($userAddress: String!) {
        UserActivity(where: { user: { _eq: $userAddress } }) {
          id
          user
          totalPaymentVolumeSent
          totalPaymentVolumeReceived
          totalPropertyInvestments
          totalYieldClaimed
          activePaymentSchedules
          firstActivity
          lastActivity
        }
        PaymentExecution(where: { payer: { _eq: $userAddress } }, limit: 5, order_by: { timestamp: desc }) {
          id
          recipient
          amount
          timestamp
          transactionHash
        }
        USDCTransfer(
          where: { 
            _or: [
              { from: { _eq: $userAddress } },
              { to: { _eq: $userAddress } }
            ]
          }
          limit: 10
          order_by: { timestamp: desc }
        ) {
          id
          from
          to
          value
          timestamp
          isPaymentRelated
          isPropertyRelated
        }
      }
    `;
    
    const data = await client.request(userQuery, { userAddress: address.toLowerCase() });
    
    res.json({
      address,
      activity: data.UserActivity?.[0] || null,
      recentPayments: data.PaymentExecution || [],
      recentTransfers: data.USDCTransfer || [],
      summary: {
        hasActivity: !!data.UserActivity?.[0],
        paymentsCount: data.PaymentExecution?.length || 0,
        transfersCount: data.USDCTransfer?.length || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get USDC transfers
app.get('/api/transfers/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const query = `
      query GetRecentTransfers($limit: Int!) {
        USDCTransfer(limit: $limit, order_by: { timestamp: desc }) {
          id
          from
          to
          value
          timestamp
          transactionHash
          isPaymentRelated
          isPropertyRelated
          isSwapRelated
        }
      }
    `;
    
    const data = await client.request(query, { limit });
    res.json({ 
      transfers: data.USDCTransfer || [],
      count: data.USDCTransfer?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Custom GraphQL query endpoint
app.post('/api/query', async (req, res) => {
  try {
    const { query, variables } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'GraphQL query is required' });
    }

    const result = await client.request(query, variables);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🌟 Envio API Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`💸 Recent payments: http://localhost:${port}/api/payments/recent`);
  console.log(`📈 Protocol stats: http://localhost:${port}/api/protocol/stats`);
  console.log(`👤 User data: http://localhost:${port}/api/user/0x24c80f19649c0Da8418011eF0B6Ed3e22007758c`);
});

module.exports = app;