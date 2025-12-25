import express from 'express';
import { enhancedPropertyService } from '../services/enhancedPropertyService';
import { chainlinkPriceService } from '../services/chainlinkPriceService';
import { easService } from '../services/easService';
import { documentGenerationService } from '../services/documentGenerationService';

const router = express.Router();

/**
 * GET /api/enhanced-properties
 * Get all properties with enhanced production-grade features
 */
router.get('/', async (req, res) => {
  try {
    const properties = await enhancedPropertyService.initializeAllProperties();
    res.json({
      success: true,
      data: properties,
      message: 'Enhanced properties loaded successfully'
    });
  } catch (error) {
    console.error('Error loading enhanced properties:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load enhanced properties',
      details: error.message
    });
  }
});

/**
 * GET /api/enhanced-properties/market-data
 * Get real-time market data from Chainlink
 */
router.get('/market-data', async (req, res) => {
  try {
    const ethPrice = await chainlinkPriceService.getETHPrice();
    
    res.json({
      success: true,
      data: {
        ethPrice,
        lastUpdated: new Date().toISOString(),
        source: 'Chainlink Price Feeds'
      }
    });
    
  } catch (error) {
    console.error('Error getting market data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get market data',
      details: error.message
    });
  }
});

/**
 * GET /api/enhanced-properties/:id
 * Get specific property with real-time data
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get property data and real-time updates
    const properties = await enhancedPropertyService.initializeAllProperties();
    const property = properties.find(p => p.id === id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    // Get latest market data
    const marketData = await enhancedPropertyService.updatePropertyValuation(id);
    const analytics = await enhancedPropertyService.getPropertyAnalytics(id);
    
    res.json({
      success: true,
      data: {
        ...property,
        latestValuation: marketData,
        analytics
      }
    });
  } catch (error) {
    console.error('Error loading property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load property',
      details: error.message
    });
  }
});

/**
 * POST /api/enhanced-properties/:id/invest
 * Process investment with full compliance and documentation
 */
router.post('/:id/invest', async (req, res) => {
  try {
    const { id } = req.params;
    const { investorAddress, investmentAmount, sharesAmount, transactionHash } = req.body;
    
    if (!investorAddress || !investmentAmount || !sharesAmount || !transactionHash) {
      return res.status(400).json({
        success: false,
        error: 'Missing required investment parameters'
      });
    }
    
    const result = await enhancedPropertyService.processInvestment(
      id,
      investorAddress,
      investmentAmount,
      sharesAmount,
      transactionHash
    );
    
    if (!result.success) {
      return res.status(403).json({
        success: false,
        error: 'Investment not eligible',
        complianceCheck: result.complianceCheck
      });
    }
    
    // Return success with document download links
    res.json({
      success: true,
      data: {
        attestationUID: result.attestationUID,
        complianceCheck: result.complianceCheck,
        documents: {
          certificate: 'Generated successfully',
          agreement: 'Generated successfully'
        }
      },
      message: 'Investment processed successfully'
    });
    
  } catch (error) {
    console.error('Error processing investment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process investment',
      details: error.message
    });
  }
});

/**
 * GET /api/enhanced-properties/:id/documents/:type
 * Download investment documents
 */
router.get('/:id/documents/:type', async (req, res) => {
  try {
    const { id, type } = req.params;
    const { investorAddress, transactionHash } = req.query;
    
    if (!investorAddress || !transactionHash) {
      return res.status(400).json({
        success: false,
        error: 'Missing investor address or transaction hash'
      });
    }
    
    // Mock document generation for demo
    const properties = await enhancedPropertyService.initializeAllProperties();
    const property = properties.find(p => p.id === id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    let document: Buffer;
    let filename: string;
    
    switch (type) {
      case 'certificate':
        document = await documentGenerationService.generateInvestmentCertificate({
          investorAddress: investorAddress as string,
          propertyName: property.name,
          sharesAmount: '100', // Mock data
          investmentAmount: '1.0',
          transactionHash: transactionHash as string,
          investmentDate: new Date().toISOString(),
          certificateId: `CERT-${Date.now()}`
        });
        filename = `investment-certificate-${id}.pdf`;
        break;
        
      case 'memorandum':
        document = await documentGenerationService.generateInvestmentMemorandum(property);
        filename = `investment-memorandum-${id}.pdf`;
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid document type'
        });
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(document);
    
  } catch (error) {
    console.error('Error generating document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate document',
      details: error.message
    });
  }
});

/**
 * GET /api/enhanced-properties/:id/compliance/:address
 * Check investor compliance status
 */
router.get('/:id/compliance/:address', async (req, res) => {
  try {
    const { id, address } = req.params;
    
    const properties = await enhancedPropertyService.initializeAllProperties();
    const property = properties.find(p => p.id === id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    const complianceCheck = await easService.checkInvestmentEligibility(
      address,
      {
        kycRequired: property.kycRequired,
        accreditedInvestorOnly: property.accreditedInvestorOnly,
        minimumInvestment: property.minimumInvestment
      }
    );
    
    res.json({
      success: true,
      data: complianceCheck
    });
    
  } catch (error) {
    console.error('Error checking compliance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check compliance',
      details: error.message
    });
  }
});

/**
 * GET /api/enhanced-properties/:id/liquidity
 * Get real-time liquidity and trading data
 */
router.get('/:id/liquidity', async (req, res) => {
  try {
    const { id } = req.params;
    
    const properties = await enhancedPropertyService.initializeAllProperties();
    const property = properties.find(p => p.id === id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    // Get current ETH price for conversions
    const ethPrice = await chainlinkPriceService.getETHPrice();
    
    res.json({
      success: true,
      data: {
        ...property.liquidityData,
        ethPrice,
        currentPrice: property.currentMarketData.sharePrice,
        priceChange24h: property.currentMarketData.priceChange24h,
        volume24h: property.currentMarketData.volume24h
      }
    });
    
  } catch (error) {
    console.error('Error getting liquidity data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get liquidity data',
      details: error.message
    });
  }
});

/**
 * GET /api/enhanced-properties/:id/yield-schedule
 * Get yield distribution schedule and history
 */
router.get('/:id/yield-schedule', async (req, res) => {
  try {
    const { id } = req.params;
    
    const properties = await enhancedPropertyService.initializeAllProperties();
    const property = properties.find(p => p.id === id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    // Calculate days until next distribution
    const nextDistribution = new Date(property.yieldDistribution.nextDistributionDate);
    const now = new Date();
    const daysUntilDistribution = Math.ceil((nextDistribution.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    res.json({
      success: true,
      data: {
        ...property.yieldDistribution,
        daysUntilNext: daysUntilDistribution,
        annualYieldRate: property.annualYieldRate,
        monthlyYieldRate: (property.annualYieldRate / 12).toFixed(2)
      }
    });
    
  } catch (error) {
    console.error('Error getting yield schedule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get yield schedule',
      details: error.message
    });
  }
});


export default router;