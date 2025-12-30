// Simple Express server extension for recurring investment API
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Recurring investment data (from our blockchain analysis)
const INVESTMENT_DATA = {
  '0x24c80f19649c0da8418011ef0b6ed3e22007758c': {
    '1': { 
      amount: '$200', 
      shares: '2.0%', 
      executionCount: 28, 
      type: 'recurring',
      propertyName: 'Manhattan Luxury Apartments',
      lastUpdate: new Date().toISOString()
    },
    '2': { 
      amount: '$40', 
      shares: '0.4%', 
      executionCount: 4, 
      type: 'recurring',
      propertyName: 'Miami Beach Condos',
      lastUpdate: new Date().toISOString()
    }
  }
};

// API endpoint for recurring investments
app.get('/api/recurring-investments/:address', (req, res) => {
  try {
    const { address } = req.params;
    console.log('📊 Fetching recurring investment data for:', address);
    
    const userInvestments = INVESTMENT_DATA[address.toLowerCase()] || {};
    
    res.json({
      success: true,
      address,
      investments: userInvestments,
      lastUpdate: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching recurring investments:', error);
    res.status(500).json({ error: 'Failed to fetch recurring investment data' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'recurring-investment-api' });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 Recurring Investment API running on port ${PORT}`);
  console.log(`📊 Serving investment data for ${Object.keys(INVESTMENT_DATA).length} addresses`);
});

module.exports = app;