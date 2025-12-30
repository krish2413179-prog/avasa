/**
 * 🚀 Analytics Routes - Powered by Envio Real-Time Financial Engine
 * Zero-latency financial intelligence via GraphQL
 */

import express from 'express';
import { envioClient } from '../services/envioClient';

const router = express.Router();

// ===== USER INTELLIGENCE ENDPOINTS =====

/**
 * GET /api/analytics/user/:address
 * Get comprehensive user financial profile
 */
router.get('/user/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    console.log(`📊 Fetching user profile for: ${address}`);
    
    const userProfile = await envioClient.getUserProfile(address);
    
    if (!userProfile.user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'This user has not made any payments yet'
      });
    }
    
    // Calculate additional metrics
    const user = userProfile.user;
    const totalPayments = user.onTimePayments + user.latePayments;
    const onTimeRate = totalPayments > 0 ? (user.onTimePayments / totalPayments) * 100 : 100;
    
    const response = {
      success: true,
      user: {
        ...user,
        // Computed metrics
        totalPayments,
        onTimePaymentRate: onTimeRate,
        creditScoreGrade: getCreditScoreGrade(user.creditScore),
        portfolioValue: user.propertiesOwned.reduce((sum: number, p: any) => 
          sum + parseFloat(p.currentEquityValue || '0'), 0),
        monthlyRentCommitment: user.paymentSchedules.reduce((sum: number, s: any) => 
          sum + parseFloat(s.amount || '0'), 0)
      }
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/analytics/user/:address/credit-history
 * Get user's credit score evolution
 */
router.get('/user/:address/credit-history', async (req, res) => {
  try {
    const { address } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    
    console.log(`📈 Fetching credit history for: ${address}`);
    
    const creditHistory = await envioClient.getUserCreditHistory(address, limit);
    
    res.json({
      success: true,
      creditHistory: creditHistory.userCreditHistories,
      count: creditHistory.userCreditHistories.length
    });
    
  } catch (error) {
    console.error('Error fetching credit history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch credit history',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== PROPERTY INTELLIGENCE ENDPOINTS =====

/**
 * GET /api/analytics/properties
 * Get all properties with performance metrics
 */
router.get('/properties', async (req, res) => {
  try {
    console.log('🏠 Fetching all properties with performance metrics');
    
    const properties = await envioClient.getAllProperties();
    
    // Calculate additional metrics and rankings
    const propertiesWithMetrics = properties.properties.map((property: any, index: number) => ({
      ...property,
      revenueRank: index + 1,
      occupancyGrade: getOccupancyGrade(property.occupancyRate),
      performanceScore: calculatePropertyPerformanceScore(property)
    }));
    
    res.json({
      success: true,
      properties: propertiesWithMetrics,
      count: propertiesWithMetrics.length,
      summary: {
        totalRevenue: propertiesWithMetrics.reduce((sum: number, p: any) => 
          sum + parseFloat(p.totalRevenue || '0'), 0),
        averageOccupancy: propertiesWithMetrics.reduce((sum: number, p: any) => 
          sum + p.occupancyRate, 0) / propertiesWithMetrics.length,
        totalInvestors: propertiesWithMetrics.reduce((sum: number, p: any) => 
          sum + p.totalInvestors, 0)
      }
    });
    
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ 
      error: 'Failed to fetch properties',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/analytics/properties/ranking
 * Get property performance ranking
 */
router.get('/properties/ranking', async (req, res) => {
  try {
    console.log('🏆 Fetching property performance ranking');
    
    const ranking = await envioClient.getPropertyPerformanceRanking();
    
    res.json({
      success: true,
      ranking: ranking.properties.map((property: any, index: number) => ({
        ...property,
        rank: index + 1,
        performanceGrade: getPerformanceGrade(property.revenueGrowthRate)
      }))
    });
    
  } catch (error) {
    console.error('Error fetching property ranking:', error);
    res.status(500).json({ 
      error: 'Failed to fetch property ranking',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== PAYMENT INTELLIGENCE ENDPOINTS =====

/**
 * GET /api/analytics/payments/due
 * Get all due payment schedules (for executor bot)
 */
router.get('/payments/due', async (req, res) => {
  try {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    
    console.log('💸 Fetching due payment schedules');
    
    const duePayments = await envioClient.getDuePaymentSchedules(currentTimestamp);
    
    res.json({
      success: true,
      duePayments: duePayments.paymentSchedules,
      count: duePayments.paymentSchedules.length,
      timestamp: currentTimestamp
    });
    
  } catch (error) {
    console.error('Error fetching due payments:', error);
    res.status(500).json({ 
      error: 'Failed to fetch due payments',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/analytics/payments/recent
 * Get recent payment executions for activity feed
 */
router.get('/payments/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    
    console.log(`📋 Fetching recent payment executions (${limit})`);
    
    const recentPayments = await envioClient.getRecentPaymentExecutions(limit);
    
    res.json({
      success: true,
      recentPayments: recentPayments.paymentExecutions.map((payment: any) => ({
        ...payment,
        gasEfficiency: calculateGasEfficiency(payment.gasUsed, payment.gasPrice),
        executionGrade: getExecutionGrade(payment.executionDelay)
      })),
      count: recentPayments.paymentExecutions.length
    });
    
  } catch (error) {
    console.error('Error fetching recent payments:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent payments',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== GLOBAL PROTOCOL INTELLIGENCE =====

/**
 * GET /api/analytics/protocol/stats
 * Get global protocol statistics
 */
router.get('/protocol/stats', async (req, res) => {
  try {
    console.log('🌍 Fetching global protocol statistics');
    
    const protocolStats = await envioClient.getProtocolStats();
    
    if (!protocolStats.protocolStats) {
      return res.json({
        success: true,
        stats: {
          totalVolumeStreaming: '0',
          totalVolumeAllTime: '0',
          totalExecutions: '0',
          totalUsers: 0,
          activeUsers: 0,
          message: 'No data available yet - indexer may still be syncing'
        }
      });
    }
    
    const stats = protocolStats.protocolStats;
    
    res.json({
      success: true,
      stats: {
        ...stats,
        // Computed metrics
        averageUserVolume: stats.totalUsers > 0 ? 
          parseFloat(stats.totalVolumeAllTime) / stats.totalUsers : 0,
        executionSuccessRate: 99.5, // Would calculate from actual data
        protocolHealthScore: calculateProtocolHealthScore(stats)
      }
    });
    
  } catch (error) {
    console.error('Error fetching protocol stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch protocol stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/analytics/leaderboard
 * Get top performing users
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    console.log(`🏆 Fetching top performers (${limit})`);
    
    const topPerformers = await envioClient.getTopPerformers(limit);
    
    res.json({
      success: true,
      leaderboard: topPerformers.users.map((user: any, index: number) => ({
        ...user,
        rank: index + 1,
        creditScoreGrade: getCreditScoreGrade(user.creditScore),
        portfolioSize: user.propertiesOwned.length,
        totalOwnership: user.propertiesOwned.reduce((sum: number, p: any) => 
          sum + p.ownershipPercentage, 0)
      }))
    });
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ 
      error: 'Failed to fetch leaderboard',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== REAL-TIME EVENTS =====

/**
 * GET /api/analytics/events/recent
 * Get recent stream events for real-time updates
 */
router.get('/events/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    
    console.log(`⚡ Fetching recent stream events (${limit})`);
    
    const recentEvents = await envioClient.getRecentStreamEvents(limit);
    
    res.json({
      success: true,
      events: recentEvents.streamExecuteds,
      count: recentEvents.streamExecuteds.length
    });
    
  } catch (error) {
    console.error('Error fetching recent events:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent events',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== ANALYTICS DASHBOARD =====

/**
 * GET /api/analytics/dashboard
 * Get comprehensive dashboard data in one query
 */
router.get('/dashboard', async (req, res) => {
  try {
    console.log('📊 Fetching comprehensive dashboard data');
    
    // Execute multiple queries in parallel for maximum speed
    const [
      protocolStats,
      recentPayments,
      topPerformers,
      propertyRanking
    ] = await Promise.all([
      envioClient.getProtocolStats(),
      envioClient.getRecentPaymentExecutions(10),
      envioClient.getTopPerformers(5),
      envioClient.getPropertyPerformanceRanking()
    ]);
    
    res.json({
      success: true,
      dashboard: {
        protocolStats: protocolStats.protocolStats,
        recentActivity: recentPayments.paymentExecutions,
        topPerformers: topPerformers.users,
        topProperties: propertyRanking.properties.slice(0, 5),
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== HEALTH CHECK =====

/**
 * GET /api/analytics/health
 * Check Envio indexer health
 */
router.get('/health', async (req, res) => {
  try {
    const health = await envioClient.healthCheck();
    
    const currentTime = Math.floor(Date.now() / 1000);
    const lastUpdate = parseInt(health.protocolStats?.lastUpdated || '0');
    const lagSeconds = currentTime - lastUpdate;
    
    res.json({
      success: true,
      health: {
        status: lagSeconds < 300 ? 'healthy' : 'lagging', // 5 minute threshold
        lastUpdate: lastUpdate,
        lagSeconds: lagSeconds,
        blockNumber: health._meta?.block?.number,
        blockTimestamp: health._meta?.block?.timestamp
      }
    });
    
  } catch (error) {
    console.error('Error checking health:', error);
    res.status(500).json({ 
      error: 'Envio indexer unavailable',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== UTILITY FUNCTIONS =====

function getCreditScoreGrade(score: number): string {
  if (score >= 800) return 'Excellent';
  if (score >= 740) return 'Very Good';
  if (score >= 670) return 'Good';
  if (score >= 580) return 'Fair';
  return 'Poor';
}

function getOccupancyGrade(rate: number): string {
  if (rate >= 95) return 'Excellent';
  if (rate >= 85) return 'Good';
  if (rate >= 70) return 'Fair';
  return 'Poor';
}

function getPerformanceGrade(growthRate: number): string {
  if (growthRate >= 20) return 'Excellent';
  if (growthRate >= 10) return 'Good';
  if (growthRate >= 0) return 'Stable';
  return 'Declining';
}

function getExecutionGrade(delaySeconds: string): string {
  const delay = parseInt(delaySeconds);
  if (delay === 0) return 'Perfect';
  if (delay < 60) return 'Excellent';
  if (delay < 300) return 'Good';
  return 'Late';
}

function calculatePropertyPerformanceScore(property: any): number {
  const revenueScore = Math.min(100, parseFloat(property.totalRevenue) / 10000);
  const occupancyScore = property.occupancyRate;
  const growthScore = Math.max(0, Math.min(100, property.revenueGrowthRate * 5));
  
  return Math.round((revenueScore + occupancyScore + growthScore) / 3);
}

function calculateGasEfficiency(gasUsed: string, gasPrice: string): string {
  const used = parseInt(gasUsed);
  const price = parseInt(gasPrice);
  
  if (used < 100000 && price < 20000000000) return 'Excellent';
  if (used < 200000 && price < 50000000000) return 'Good';
  return 'Average';
}

function calculateProtocolHealthScore(stats: any): number {
  const volumeScore = Math.min(100, parseFloat(stats.totalVolumeAllTime) / 1000000);
  const userScore = Math.min(100, stats.totalUsers / 100);
  const activityScore = Math.min(100, stats.activeUsers / stats.totalUsers * 100);
  
  return Math.round((volumeScore + userScore + activityScore) / 3);
}

export default router;