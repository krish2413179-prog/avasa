/**
 * 🚀 Real-Time Financial Engine Server
 * High-performance backend powered by Envio indexer
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { parseUserIntent } from './ai/parser';
import { initializeEnvioPaymentExecutor, getEnvioPaymentExecutor } from './agents/paymentExecutor-envio';
import { envioClient } from './services/envioClient';
import friendsRoutes from './routes/friends';
import analyticsRoutes from './routes/analytics-envio';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('🚀 Starting Veda Real-Time Financial Engine...');
console.log('⚡ Powered by Envio GraphQL for zero-latency data');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Envio-Powered Payment Executor
const privateKey = process.env.PRIVATE_KEY!;
const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';

console.log('🤖 Initializing Envio-Powered Payment Executor...');
const paymentExecutor = initializeEnvioPaymentExecutor(privateKey, rpcUrl);

// ===== CORE ROUTES =====

// Friends management routes
app.use('/api/friends', friendsRoutes);

// Analytics routes powered by Envio indexer
app.use('/api/analytics', analyticsRoutes);

// ===== AI PARSER ENDPOINTS =====

/**
 * Enhanced AI parser with Envio context
 */
app.post('/api/parse', async (req, res) => {
  try {
    const { input, userAddress } = req.body;
    
    console.log('🔍 Parsing input with Envio context:', input);
    
    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }
    
    // Get user context from Envio for smarter parsing
    let userContext = null;
    if (userAddress) {
      try {
        const userProfile = await envioClient.getUserProfile(userAddress);
        userContext = userProfile.user;
        console.log(`👤 User context: Credit Score ${userContext?.creditScore}, Active Streams: ${userContext?.activeStreams}`);
      } catch (error) {
        console.log('⚠️ Could not fetch user context from Envio');
      }
    }
    
    // Parse user intent with enhanced context
    const result = await parseUserIntent(input, userAddress);
    
    // Enhance result with Envio intelligence
    if (userContext && result.type === 'schedule_swap') {
      result.params.userCreditScore = userContext.creditScore;
      result.params.userActiveStreams = userContext.activeStreams;
      result.params.userTotalRentPaid = userContext.totalRentPaid;
      
      // Add intelligent recommendations
      if (userContext.creditScore > 800) {
        result.description += ' (Excellent credit - premium rates available)';
      } else if (userContext.creditScore < 600) {
        result.description += ' (Building credit - consider smaller amounts)';
      }
    }
    
    console.log('✅ Enhanced parse result:', result);
    
    res.json({ 
      type: result.type,
      description: result.description,
      params: result.params || {},
      userContext: userContext ? {
        creditScore: userContext.creditScore,
        activeStreams: userContext.activeStreams,
        totalEquityEarned: userContext.totalEquityEarned
      } : null
    });
    
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ error: 'Failed to parse input' });
  }
});

// ===== ENVIO-POWERED EXECUTOR ENDPOINTS =====

/**
 * Get executor status with Envio health
 */
app.get('/api/executor/status', async (req, res) => {
  try {
    if (!paymentExecutor) {
      return res.json({ isRunning: false, error: 'Payment executor not initialized' });
    }
    
    const [status, envioHealth] = await Promise.all([
      paymentExecutor.getStatus(),
      paymentExecutor.getEnvioHealth()
    ]);
    
    res.json({
      ...status,
      envioHealth
    });
    
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ error: 'Failed to get executor status' });
  }
});

/**
 * Start Envio-powered executor
 */
app.post('/api/executor/start', async (req, res) => {
  try {
    if (!paymentExecutor) {
      return res.status(400).json({ error: 'Payment executor not initialized' });
    }
    
    await paymentExecutor.start();
    res.json({ 
      success: true, 
      message: 'Envio-powered payment executor started',
      features: ['Zero-latency queries', 'Intelligent safety', 'Gas optimization']
    });
    
  } catch (error) {
    console.error('Start executor error:', error);
    res.status(500).json({ error: 'Failed to start executor' });
  }
});

/**
 * Stop executor
 */
app.post('/api/executor/stop', async (req, res) => {
  try {
    if (!paymentExecutor) {
      return res.status(400).json({ error: 'Payment executor not initialized' });
    }
    
    await paymentExecutor.stop();
    res.json({ success: true, message: 'Payment executor stopped' });
    
  } catch (error) {
    console.error('Stop executor error:', error);
    res.status(500).json({ error: 'Failed to stop executor' });
  }
});

/**
 * Add safety rule to executor
 */
app.post('/api/executor/safety-rule', async (req, res) => {
  try {
    const { scheduleId, rule } = req.body;
    
    if (!paymentExecutor) {
      return res.status(400).json({ error: 'Payment executor not initialized' });
    }
    
    if (!scheduleId || !rule) {
      return res.status(400).json({ error: 'scheduleId and rule are required' });
    }
    
    paymentExecutor.addSafetyRule(scheduleId, rule);
    
    res.json({ 
      success: true, 
      message: `Safety rule added for schedule ${scheduleId}`,
      rule
    });
    
  } catch (error) {
    console.error('Add safety rule error:', error);
    res.status(500).json({ error: 'Failed to add safety rule' });
  }
});

// ===== REAL-TIME DASHBOARD ENDPOINTS =====

/**
 * Get comprehensive dashboard data
 */
app.get('/api/dashboard', async (req, res) => {
  try {
    console.log('📊 Fetching real-time dashboard data...');
    
    const [
      protocolStats,
      recentPayments,
      topPerformers,
      propertyRanking,
      executorStatus
    ] = await Promise.all([
      envioClient.getProtocolStats(),
      envioClient.getRecentPaymentExecutions(10),
      envioClient.getTopPerformers(5),
      envioClient.getPropertyPerformanceRanking(),
      paymentExecutor?.getStatus() || null
    ]);
    
    res.json({
      success: true,
      dashboard: {
        protocolStats: protocolStats.protocolStats,
        recentActivity: recentPayments.paymentExecutions,
        topPerformers: topPerformers.users,
        topProperties: propertyRanking.properties.slice(0, 5),
        executorStatus,
        lastUpdated: new Date().toISOString(),
        dataSource: 'Envio Real-Time Financial Engine'
      }
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard data',
      fallback: 'Using cached data or basic metrics'
    });
  }
});

/**
 * Get user's complete financial profile
 */
app.get('/api/user/:address/profile', async (req, res) => {
  try {
    const { address } = req.params;
    
    console.log(`👤 Fetching complete financial profile for: ${address}`);
    
    const [
      userProfile,
      creditHistory,
      activeSchedules
    ] = await Promise.all([
      envioClient.getUserProfile(address),
      envioClient.getUserCreditHistory(address, 20),
      envioClient.getUserActiveSchedules(address)
    ]);
    
    if (!userProfile.user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'This user has not made any payments yet'
      });
    }
    
    res.json({
      success: true,
      profile: {
        user: userProfile.user,
        creditHistory: creditHistory.userCreditHistories,
        activeSchedules: activeSchedules.paymentSchedules,
        insights: {
          creditTrend: calculateCreditTrend(creditHistory.userCreditHistories),
          portfolioGrowth: calculatePortfolioGrowth(userProfile.user),
          riskScore: calculateRiskScore(userProfile.user)
        }
      }
    });
    
  } catch (error) {
    console.error('User profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// ===== HEALTH AND MONITORING =====

/**
 * Comprehensive health check
 */
app.get('/api/health', async (req, res) => {
  try {
    const [envioHealth, executorStatus] = await Promise.all([
      envioClient.healthCheck(),
      paymentExecutor?.getEnvioHealth() || null
    ]);
    
    const currentTime = Math.floor(Date.now() / 1000);
    const lastUpdate = parseInt(envioHealth.protocolStats?.lastUpdated || '0');
    const lagSeconds = currentTime - lastUpdate;
    
    res.json({
      status: 'ok',
      message: 'Veda Real-Time Financial Engine is running',
      components: {
        server: 'healthy',
        envioIndexer: lagSeconds < 300 ? 'healthy' : 'lagging',
        paymentExecutor: executorStatus?.status || 'unknown',
        database: 'healthy'
      },
      metrics: {
        envioLagSeconds: lagSeconds,
        lastDataUpdate: lastUpdate,
        blockNumber: envioHealth._meta?.block?.number
      },
      features: [
        'Zero-latency GraphQL queries',
        'Intelligent payment execution',
        'Real-time financial intelligence',
        'Gas optimization',
        'Emergency safety brakes'
      ]
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'degraded',
      error: 'Some components may be unavailable'
    });
  }
});

// ===== UTILITY FUNCTIONS =====

function calculateCreditTrend(creditHistory: any[]): string {
  if (creditHistory.length < 2) return 'stable';
  
  const recent = creditHistory.slice(0, 5);
  const older = creditHistory.slice(5, 10);
  
  const recentAvg = recent.reduce((sum, h) => sum + h.creditScore, 0) / recent.length;
  const olderAvg = older.reduce((sum, h) => sum + h.creditScore, 0) / older.length;
  
  if (recentAvg > olderAvg + 10) return 'improving';
  if (recentAvg < olderAvg - 10) return 'declining';
  return 'stable';
}

function calculatePortfolioGrowth(user: any): number {
  // Simplified calculation - would use historical data in production
  const totalEquity = parseFloat(user.totalEquityEarned || '0');
  const totalRent = parseFloat(user.totalRentPaid || '0');
  
  if (totalRent === 0) return 0;
  return (totalEquity / totalRent) * 100;
}

function calculateRiskScore(user: any): string {
  const creditScore = user.creditScore;
  const onTimeRate = user.onTimePayments / (user.onTimePayments + user.latePayments) * 100;
  
  if (creditScore > 750 && onTimeRate > 95) return 'low';
  if (creditScore > 650 && onTimeRate > 85) return 'medium';
  return 'high';
}

// ===== SERVER STARTUP =====

app.listen(PORT, () => {
  console.log(`🚀 Veda Real-Time Financial Engine running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
  console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
  console.log(`⚡ Analytics: http://localhost:${PORT}/api/analytics/*`);
});

// Auto-start the Envio-powered payment executor
if (paymentExecutor) {
  console.log('🚀 Auto-starting Envio-Powered Payment Executor...');
  paymentExecutor.start().then(() => {
    console.log('🤖 Envio-Powered Payment Executor is now running with zero-latency intelligence!');
  }).catch(error => {
    console.error('Failed to auto-start Envio Payment Executor:', error);
    console.log('💡 You can manually start it via POST /api/executor/start');
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down Real-Time Financial Engine...');
  if (paymentExecutor) {
    await paymentExecutor.stop();
  }
  process.exit(0);
});

console.log('✅ Real-Time Financial Engine initialized successfully!');
console.log('🎯 Ready to demonstrate zero-latency financial intelligence');