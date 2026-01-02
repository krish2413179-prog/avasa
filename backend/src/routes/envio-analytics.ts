import express from 'express';
import { envioClient } from '../services/envioClient';

const router = express.Router();

/**
 * GET /api/envio/health
 * Health check for Envio indexer connection
 */
router.get('/health', async (req, res) => {
  try {
    const health = await envioClient.healthCheck();
    res.json(health);
  } catch (error) {
    res.status(500).json({ 
      error: 'Health check failed', 
      message: error.message 
    });
  }
});

/**
 * GET /api/envio/user/:address
 * Get comprehensive user financial profile
 */
router.get('/user/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const [profile, activeSchedules, paymentHistory] = await Promise.all([
      envioClient.getUserProfile(address),
      envioClient.getActiveSchedules(address),
      envioClient.getUserPaymentHistory(address, 10)
    ]);

    res.json({
      profile,
      activeSchedules,
      recentPayments: paymentHistory,
      summary: {
        hasProfile: !!profile,
        activeSchedulesCount: activeSchedules.length,
        totalPayments: paymentHistory.length
      }
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user data', 
      message: error.message 
    });
  }
});

/**
 * GET /api/envio/properties
 * Get all property analytics
 */
router.get('/properties', async (req, res) => {
  try {
    const properties = await envioClient.getPropertyAnalytics();
    res.json({ properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ 
      error: 'Failed to fetch properties', 
      message: error.message 
    });
  }
});

/**
 * GET /api/envio/properties/:id
 * Get specific property analytics
 */
router.get('/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const property = await envioClient.getPropertyAnalytics(id);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ property });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ 
      error: 'Failed to fetch property', 
      message: error.message 
    });
  }
});

/**
 * GET /api/envio/protocol/stats
 * Get protocol-wide statistics
 */
router.get('/protocol/stats', async (req, res) => {
  try {
    const stats = await envioClient.getProtocolStats();
    res.json({ stats });
  } catch (error) {
    console.error('Error fetching protocol stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch protocol stats', 
      message: error.message 
    });
  }
});

/**
 * GET /api/envio/payments/recent
 * Get recent payment executions across the protocol
 */
router.get('/payments/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const payments = await envioClient.getRecentPayments(limit);
    res.json({ payments });
  } catch (error) {
    console.error('Error fetching recent payments:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent payments', 
      message: error.message 
    });
  }
});

/**
 * GET /api/envio/user/:address/payments
 * Get user's payment history with pagination
 */
router.get('/user/:address/payments', async (req, res) => {
  try {
    const { address } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = parseInt(req.query.skip as string) || 0;
    
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const payments = await envioClient.getUserPaymentHistory(address, limit, skip);
    res.json({ 
      payments,
      pagination: {
        limit,
        skip,
        hasMore: payments.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user payments', 
      message: error.message 
    });
  }
});

/**
 * POST /api/envio/query
 * Execute custom GraphQL query
 */
router.post('/query', async (req, res) => {
  try {
    const { query, variables } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'GraphQL query is required' });
    }

    const result = await envioClient.customQuery(query, variables);
    res.json({ result });
  } catch (error) {
    console.error('Error executing custom query:', error);
    res.status(500).json({ 
      error: 'Failed to execute query', 
      message: error.message 
    });
  }
});

/**
 * GET /api/envio/dashboard/:address
 * Get complete dashboard data for a user
 */
router.get('/dashboard/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    // Fetch all data in parallel for maximum speed
    const [
      userProfile,
      activeSchedules,
      recentPayments,
      protocolStats
    ] = await Promise.all([
      envioClient.getUserProfile(address),
      envioClient.getActiveSchedules(address),
      envioClient.getUserPaymentHistory(address, 5),
      envioClient.getProtocolStats()
    ]);

    // Calculate derived metrics
    const totalActiveAmount = activeSchedules.reduce((sum, schedule) => 
      sum + parseFloat(schedule.amount), 0
    );

    const avgPaymentAmount = recentPayments.length > 0 
      ? recentPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) / recentPayments.length
      : 0;

    res.json({
      user: {
        profile: userProfile,
        activeSchedules,
        recentPayments,
        metrics: {
          totalActiveAmount,
          avgPaymentAmount,
          activeSchedulesCount: activeSchedules.length,
          creditScore: userProfile?.creditScore || 0
        }
      },
      protocol: {
        stats: protocolStats
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard data', 
      message: error.message 
    });
  }
});

export default router;