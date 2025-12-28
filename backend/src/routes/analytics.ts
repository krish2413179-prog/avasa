/**
 * Analytics Routes - Powered by Envio Indexer
 * Real-time analytics for payment automation and swap analytics
 */

import express from 'express';
import { envioIndexer } from '../services/envioIndexer';

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const isHealthy = await envioIndexer.healthCheck();
    res.json({
      success: true,
      envioIndexer: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      envioIndexer: 'unhealthy'
    });
  }
});

// Get active payment schedules
router.get('/payment-schedules', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const schedules = await envioIndexer.getActivePaymentSchedules(limit);
    
    res.json({
      success: true,
      data: schedules,
      count: schedules.length
    });
  } catch (error) {
    console.error('Failed to get payment schedules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment schedules'
    });
  }
});

// Get user payment schedules
router.get('/payment-schedules/:userAddress', async (req, res) => {
  try {
    const { userAddress } = req.params;
    const schedules = await envioIndexer.getUserPaymentSchedules(userAddress);
    
    res.json({
      success: true,
      data: schedules,
      count: schedules.length
    });
  } catch (error) {
    console.error('Failed to get user payment schedules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user payment schedules'
    });
  }
});

// Get recent payment executions
router.get('/payment-executions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const executions = await envioIndexer.getRecentPaymentExecutions(limit);
    
    res.json({
      success: true,
      data: executions,
      count: executions.length
    });
  } catch (error) {
    console.error('Failed to get payment executions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment executions'
    });
  }
});

// Get swap analytics
router.get('/swaps', async (req, res) => {
  try {
    const timeframe = parseInt(req.query.timeframe as string) || (Date.now() - 24 * 60 * 60 * 1000); // Default 24h
    const swaps = await envioIndexer.getSwapAnalytics(timeframe);
    
    res.json({
      success: true,
      data: swaps,
      count: swaps.length
    });
  } catch (error) {
    console.error('Failed to get swap analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch swap analytics'
    });
  }
});

// Get executor leaderboard
router.get('/executors', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const executors = await envioIndexer.getExecutorLeaderboard(limit);
    
    res.json({
      success: true,
      data: executors,
      count: executors.length
    });
  } catch (error) {
    console.error('Failed to get executor leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch executor leaderboard'
    });
  }
});

// Get daily protocol stats
router.get('/protocol-stats', async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const stats = await envioIndexer.getDailyProtocolStats(days);
    
    res.json({
      success: true,
      data: stats,
      count: stats.length
    });
  } catch (error) {
    console.error('Failed to get protocol stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch protocol stats'
    });
  }
});

// Get user activity
router.get('/user-activity/:userAddress', async (req, res) => {
  try {
    const { userAddress } = req.params;
    const activity = await envioIndexer.getUserActivity(userAddress);
    
    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Failed to get user activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user activity'
    });
  }
});

// Get due payment schedules
router.get('/due-payments', async (req, res) => {
  try {
    const duePayments = await envioIndexer.getDuePaymentSchedules();
    
    res.json({
      success: true,
      data: duePayments,
      count: duePayments.length
    });
  } catch (error) {
    console.error('Failed to get due payments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch due payments'
    });
  }
});

// Get due swap schedules
router.get('/due-swaps', async (req, res) => {
  try {
    const dueSwaps = await envioIndexer.getDueSwapSchedules();
    
    res.json({
      success: true,
      data: dueSwaps,
      count: dueSwaps.length
    });
  } catch (error) {
    console.error('Failed to get due swaps:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch due swaps'
    });
  }
});

// Get USDC flow analysis
router.get('/usdc-flow', async (req, res) => {
  try {
    const timeframe = parseInt(req.query.timeframe as string) || (Date.now() - 24 * 60 * 60 * 1000); // Default 24h
    const flows = await envioIndexer.getUSDCFlowAnalysis(timeframe);
    
    res.json({
      success: true,
      data: flows,
      count: flows.length
    });
  } catch (error) {
    console.error('Failed to get USDC flow analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch USDC flow analysis'
    });
  }
});

// Get portfolio analytics
router.get('/portfolio', async (req, res) => {
  try {
    const userAddress = req.query.userAddress as string;
    const portfolios = await envioIndexer.getPortfolioAnalytics(userAddress);
    
    res.json({
      success: true,
      data: portfolios,
      count: portfolios.length
    });
  } catch (error) {
    console.error('Failed to get portfolio analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio analytics'
    });
  }
});

export default router;