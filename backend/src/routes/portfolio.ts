/*
 * PropChain AI - Portfolio Intelligence API Routes
 * Hyper-Speed Portfolio Endpoints powered by Envio
 */

import express from 'express';
import { envioService } from '../services/envioService';
import { portfolioAgent } from '../ai/portfolioAgent';

const router = express.Router();

// ========================================
// HYPER-SPEED PORTFOLIO ENDPOINTS
// ========================================

// GET /api/portfolio/:address - Get complete portfolio analysis
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    console.log(`📊 Fetching hyper-speed portfolio for ${address}...`);

    const startTime = Date.now();
    
    // Get portfolio data from Envio (instant!)
    const portfolio = await envioService.getUserPortfolio(address);
    const recentActivity = await envioService.getRecentActivity(address, 10);
    const dashboardMetrics = await envioService.getDashboardMetrics(address);

    const queryTime = Date.now() - startTime;
    console.log(`⚡ Portfolio loaded in ${queryTime}ms via Envio`);

    res.json({
      success: true,
      queryTime: `${queryTime}ms`,
      data: {
        portfolio,
        recentActivity,
        metrics: dashboardMetrics,
        lastUpdated: Date.now()
      }
    });

  } catch (error) {
    console.error('❌ Portfolio fetch error:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// GET /api/portfolio/:address/analysis - Get AI-powered portfolio analysis
router.get('/:address/analysis', async (req, res) => {
  try {
    const { address } = req.params;
    console.log(`🧠 Running AI portfolio analysis for ${address}...`);

    const startTime = Date.now();
    
    // AI analysis powered by Envio data
    const analysis = await portfolioAgent.analyzePortfolio(address);
    
    const analysisTime = Date.now() - startTime;
    console.log(`🎯 AI analysis completed in ${analysisTime}ms`);

    res.json({
      success: true,
      analysisTime: `${analysisTime}ms`,
      data: analysis
    });

  } catch (error) {
    console.error('❌ Portfolio analysis error:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// POST /api/portfolio/:address/recommendations - Get smart investment recommendations
router.post('/:address/recommendations', async (req, res) => {
  try {
    const { address } = req.params;
    const { amount, riskTolerance = 'balanced' } = req.body;

    console.log(`🎯 Generating smart recommendations: ${amount} ETH, ${riskTolerance} risk`);

    const startTime = Date.now();
    
    // AI-powered recommendations using Envio data
    const recommendations = await portfolioAgent.getSmartRecommendations(address, amount, riskTolerance);
    
    const recommendationTime = Date.now() - startTime;
    console.log(`💡 Recommendations generated in ${recommendationTime}ms`);

    res.json({
      success: true,
      recommendationTime: `${recommendationTime}ms`,
      data: {
        recommendations,
        amount,
        riskTolerance,
        generatedAt: Date.now()
      }
    });

  } catch (error) {
    console.error('❌ Recommendation error:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// GET /api/portfolio/:address/yield-optimization - Get yield optimization suggestions
router.get('/:address/yield-optimization', async (req, res) => {
  try {
    const { address } = req.params;
    console.log(`💰 Analyzing yield optimization for ${address}...`);

    const startTime = Date.now();
    
    const optimizations = await portfolioAgent.getYieldOptimization(address);
    
    const optimizationTime = Date.now() - startTime;

    res.json({
      success: true,
      optimizationTime: `${optimizationTime}ms`,
      data: {
        optimizations,
        analyzedAt: Date.now()
      }
    });

  } catch (error) {
    console.error('❌ Yield optimization error:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// POST /api/portfolio/:address/rebalance - Get rebalancing strategy
router.post('/:address/rebalance', async (req, res) => {
  try {
    const { address } = req.params;
    const { targetAllocation } = req.body;

    console.log(`⚖️ Calculating rebalance strategy for ${address}...`);

    const startTime = Date.now();
    
    const rebalanceActions = await portfolioAgent.getRebalanceStrategy(address, targetAllocation);
    
    const rebalanceTime = Date.now() - startTime;

    res.json({
      success: true,
      rebalanceTime: `${rebalanceTime}ms`,
      data: {
        actions: rebalanceActions,
        targetAllocation,
        calculatedAt: Date.now()
      }
    });

  } catch (error) {
    console.error('❌ Rebalance calculation error:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// ========================================
// MARKET DATA ENDPOINTS
// ========================================

// GET /api/portfolio/market/properties - Get all property performance data
router.get('/market/properties', async (req, res) => {
  try {
    console.log('📈 Fetching market property performance...');

    const startTime = Date.now();
    
    const properties = await envioService.getPropertyPerformance();
    
    const queryTime = Date.now() - startTime;

    res.json({
      success: true,
      queryTime: `${queryTime}ms`,
      data: {
        properties,
        count: properties.length,
        lastUpdated: Date.now()
      }
    });

  } catch (error) {
    console.error('❌ Market data error:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// GET /api/portfolio/market/trends - Get market trends
router.get('/market/trends', async (req, res) => {
  try {
    const { timeframe = '24h' } = req.query;
    console.log(`📊 Fetching market trends for ${timeframe}...`);

    const startTime = Date.now();
    
    const trends = await envioService.getMarketTrends(timeframe as string);
    
    const queryTime = Date.now() - startTime;

    res.json({
      success: true,
      queryTime: `${queryTime}ms`,
      data: {
        trends,
        timeframe,
        lastUpdated: Date.now()
      }
    });

  } catch (error) {
    console.error('❌ Market trends error:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// ========================================
// DEFI ACTIVITY ENDPOINTS
// ========================================

// GET /api/portfolio/:address/defi/swaps - Get user's swap history
router.get('/:address/defi/swaps', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 50 } = req.query;

    console.log(`🔄 Fetching swap history for ${address}...`);

    const startTime = Date.now();
    
    const swaps = await envioService.getUserSwapHistory(address, parseInt(limit as string));
    
    const queryTime = Date.now() - startTime;

    res.json({
      success: true,
      queryTime: `${queryTime}ms`,
      data: {
        swaps,
        count: swaps.length,
        lastUpdated: Date.now()
      }
    });

  } catch (error) {
    console.error('❌ Swap history error:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// GET /api/portfolio/:address/defi/streams - Get user's Superfluid streams
router.get('/:address/defi/streams', async (req, res) => {
  try {
    const { address } = req.params;

    console.log(`💧 Fetching Superfluid streams for ${address}...`);

    const startTime = Date.now();
    
    const streams = await envioService.getUserStreams(address);
    
    const queryTime = Date.now() - startTime;

    res.json({
      success: true,
      queryTime: `${queryTime}ms`,
      data: {
        streams,
        count: streams.length,
        lastUpdated: Date.now()
      }
    });

  } catch (error) {
    console.error('❌ Streams fetch error:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// GET /api/portfolio/:address/defi/lending - Get user's Aave positions
router.get('/:address/defi/lending', async (req, res) => {
  try {
    const { address } = req.params;

    console.log(`🏦 Fetching Aave positions for ${address}...`);

    const startTime = Date.now();
    
    const positions = await envioService.getUserLendingPositions(address);
    
    const queryTime = Date.now() - startTime;

    res.json({
      success: true,
      queryTime: `${queryTime}ms`,
      data: {
        positions,
        count: positions.length,
        lastUpdated: Date.now()
      }
    });

  } catch (error) {
    console.error('❌ Lending positions error:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// ========================================
// INSIGHTS & ANALYTICS ENDPOINTS
// ========================================

// GET /api/portfolio/:address/insights - Get comprehensive portfolio insights
router.get('/:address/insights', async (req, res) => {
  try {
    const { address } = req.params;

    console.log(`🔍 Generating portfolio insights for ${address}...`);

    const startTime = Date.now();
    
    const insights = await envioService.getPortfolioInsights(address);
    
    const insightTime = Date.now() - startTime;

    res.json({
      success: true,
      insightTime: `${insightTime}ms`,
      data: insights
    });

  } catch (error) {
    console.error('❌ Portfolio insights error:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// GET /api/portfolio/health - Check Envio service health
router.get('/health', async (req, res) => {
  try {
    console.log('🏥 Checking Envio service health...');

    const startTime = Date.now();
    
    // Test query to check if Envio is responsive
    const testQuery = await envioService.getPropertyPerformance();
    
    const responseTime = Date.now() - startTime;

    res.json({
      success: true,
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      envioEndpoint: process.env.ENVIO_GRAPHQL_ENDPOINT || 'http://localhost:8080/v1/graphql',
      propertiesIndexed: testQuery.length,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('❌ Envio health check failed:', error);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: (error as Error).message,
      timestamp: Date.now()
    });
  }
});

export default router;