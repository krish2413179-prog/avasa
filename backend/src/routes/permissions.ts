/*
 * PropChain AI - Advanced Permissions API Routes
 * EIP-7715 Permission Management Endpoints
 */

import express from 'express';
import { advancedPermissionManager } from '../permissions/advancedPermissions';
import { AdvancedPermissionRepository, DCAHistoryRepository, RebalanceHistoryRepository } from '../db/schema';

const router = express.Router();

// ========================================
// PERMISSION MANAGEMENT ENDPOINTS
// ========================================

// Create Yield Farmer Permission
router.post('/yield-farmer', async (req, res) => {
  try {
    const { userAddress, propertyId } = req.body;
    
    if (!userAddress || !propertyId) {
      return res.status(400).json({ 
        error: 'userAddress and propertyId are required' 
      });
    }
    
    const permission = await advancedPermissionManager.createYieldFarmerPermission(
      userAddress,
      propertyId
    );
    
    // Store in database
    const permissionId = await AdvancedPermissionRepository.create({
      userAddress,
      permissionType: 'yield_farmer',
      contractAddress: permission.contracts[0].contractAddress,
      allowedMethods: JSON.stringify(permission.contracts[0].allowedMethods),
      restrictions: JSON.stringify(permission.contracts[0].restrictions),
      policies: JSON.stringify(permission.policies),
      duration: permission.duration,
      expiresAt: new Date(Date.now() + permission.duration * 1000).toISOString(),
      isActive: true,
      description: permission.description
    });
    
    res.json({
      success: true,
      permissionId,
      permission,
      message: `Yield Farmer permission created for Property #${propertyId}`
    });
    
  } catch (error) {
    console.error('❌ Yield Farmer permission creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create Yield Farmer permission',
      details: (error as Error).message 
    });
  }
});

// Create Smart DCA Permission
router.post('/smart-dca', async (req, res) => {
  try {
    const { userAddress, weeklyAmount, propertyId } = req.body;
    
    if (!userAddress || !weeklyAmount || !propertyId) {
      return res.status(400).json({ 
        error: 'userAddress, weeklyAmount, and propertyId are required' 
      });
    }
    
    const permission = await advancedPermissionManager.createSmartDCAPermission(
      userAddress,
      weeklyAmount,
      propertyId
    );
    
    // Store in database
    const permissionId = await AdvancedPermissionRepository.create({
      userAddress,
      permissionType: 'smart_dca',
      contractAddress: permission.contracts[0].contractAddress,
      allowedMethods: JSON.stringify(permission.contracts[0].allowedMethods),
      restrictions: JSON.stringify(permission.contracts[0].restrictions),
      policies: JSON.stringify(permission.policies),
      duration: permission.duration,
      expiresAt: new Date(Date.now() + permission.duration * 1000).toISOString(),
      isActive: true,
      description: permission.description
    });
    
    res.json({
      success: true,
      permissionId,
      permission,
      message: `Smart DCA permission created: ${weeklyAmount} ETH weekly into Property #${propertyId}`
    });
    
  } catch (error) {
    console.error('❌ Smart DCA permission creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create Smart DCA permission',
      details: (error as Error).message 
    });
  }
});

// Create Emergency Brake Permission
router.post('/emergency-brake', async (req, res) => {
  try {
    const { userAddress, triggerPrice } = req.body;
    
    if (!userAddress || !triggerPrice) {
      return res.status(400).json({ 
        error: 'userAddress and triggerPrice are required' 
      });
    }
    
    const permission = await advancedPermissionManager.createEmergencyBrakePermission(
      userAddress,
      triggerPrice
    );
    
    // Store in database
    const permissionId = await AdvancedPermissionRepository.create({
      userAddress,
      permissionType: 'emergency_brake',
      contractAddress: permission.contracts[0].contractAddress,
      allowedMethods: JSON.stringify(permission.contracts[0].allowedMethods),
      restrictions: JSON.stringify(permission.contracts[0].restrictions),
      policies: JSON.stringify(permission.policies),
      duration: permission.duration,
      expiresAt: new Date(Date.now() + permission.duration * 1000).toISOString(),
      isActive: true,
      description: permission.description
    });
    
    res.json({
      success: true,
      permissionId,
      permission,
      message: `Emergency Brake permission created: Trigger at ETH < $${triggerPrice}`
    });
    
  } catch (error) {
    console.error('❌ Emergency Brake permission creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create Emergency Brake permission',
      details: (error as Error).message 
    });
  }
});

// ========================================
// PERMISSION EXECUTION ENDPOINTS
// ========================================

// Execute Yield Farming
router.post('/execute/yield-farmer', async (req, res) => {
  try {
    const { userAddress, propertyId } = req.body;
    
    if (!userAddress || !propertyId) {
      return res.status(400).json({ 
        error: 'userAddress and propertyId are required' 
      });
    }
    
    const result = await advancedPermissionManager.executeYieldFarming(
      userAddress,
      propertyId
    );
    
    res.json({
      success: true,
      result,
      message: `Yield farming executed for Property #${propertyId}`
    });
    
  } catch (error) {
    console.error('❌ Yield farming execution error:', error);
    res.status(500).json({ 
      error: 'Failed to execute yield farming',
      details: (error as Error).message 
    });
  }
});

// Execute Smart DCA
router.post('/execute/smart-dca', async (req, res) => {
  try {
    const { userAddress, propertyId, weeklyAmount } = req.body;
    
    if (!userAddress || !propertyId || !weeklyAmount) {
      return res.status(400).json({ 
        error: 'userAddress, propertyId, and weeklyAmount are required' 
      });
    }
    
    const result = await advancedPermissionManager.executeSmartDCA(
      userAddress,
      propertyId,
      weeklyAmount
    );
    
    res.json({
      success: true,
      result,
      message: `Smart DCA executed: ${weeklyAmount} ETH into Property #${propertyId}`
    });
    
  } catch (error) {
    console.error('❌ Smart DCA execution error:', error);
    res.status(500).json({ 
      error: 'Failed to execute Smart DCA',
      details: (error as Error).message 
    });
  }
});

// Check Emergency Brake Trigger
router.post('/check/emergency-brake', async (req, res) => {
  try {
    const { userAddress, triggerPrice } = req.body;
    
    if (!userAddress || !triggerPrice) {
      return res.status(400).json({ 
        error: 'userAddress and triggerPrice are required' 
      });
    }
    
    const result = await advancedPermissionManager.checkEmergencyBrakeTrigger(
      userAddress,
      triggerPrice
    );
    
    res.json({
      success: true,
      result,
      message: result.shouldTrigger 
        ? `Emergency brake triggered at ETH price $${result.currentPrice}`
        : `Emergency brake not triggered - ETH price $${result.currentPrice} above trigger $${result.triggerPrice}`
    });
    
  } catch (error) {
    console.error('❌ Emergency brake check error:', error);
    res.status(500).json({ 
      error: 'Failed to check emergency brake',
      details: (error as Error).message 
    });
  }
});

// ========================================
// PERMISSION QUERY ENDPOINTS
// ========================================

// Get User Permissions
router.get('/user/:userAddress', async (req, res) => {
  try {
    const { userAddress } = req.params;
    
    const permissions = await AdvancedPermissionRepository.findByUser(userAddress);
    
    res.json({
      success: true,
      permissions,
      count: permissions.length,
      message: `Found ${permissions.length} active permissions for ${userAddress}`
    });
    
  } catch (error) {
    console.error('❌ Permission query error:', error);
    res.status(500).json({ 
      error: 'Failed to get user permissions',
      details: (error as Error).message 
    });
  }
});

// Get DCA History
router.get('/dca-history/:userAddress/:propertyId?', async (req, res) => {
  try {
    const { userAddress, propertyId } = req.params;
    
    const history = await DCAHistoryRepository.findByUser(userAddress, propertyId);
    
    res.json({
      success: true,
      history,
      count: history.length,
      message: `Found ${history.length} DCA executions`
    });
    
  } catch (error) {
    console.error('❌ DCA history query error:', error);
    res.status(500).json({ 
      error: 'Failed to get DCA history',
      details: (error as Error).message 
    });
  }
});

// Get Rebalance History
router.get('/rebalance-history/:userAddress', async (req, res) => {
  try {
    const { userAddress } = req.params;
    
    const lastRebalance = await RebalanceHistoryRepository.getLastRebalanceTime(userAddress);
    
    res.json({
      success: true,
      lastRebalanceTime: lastRebalance.toISOString(),
      timeSinceLastRebalance: Date.now() - lastRebalance.getTime(),
      message: `Last rebalance: ${lastRebalance.toISOString()}`
    });
    
  } catch (error) {
    console.error('❌ Rebalance history query error:', error);
    res.status(500).json({ 
      error: 'Failed to get rebalance history',
      details: (error as Error).message 
    });
  }
});

// Deactivate Permission
router.post('/deactivate/:permissionId', async (req, res) => {
  try {
    const { permissionId } = req.params;
    
    await AdvancedPermissionRepository.deactivate(parseInt(permissionId));
    
    res.json({
      success: true,
      message: `Permission ${permissionId} deactivated`
    });
    
  } catch (error) {
    console.error('❌ Permission deactivation error:', error);
    res.status(500).json({ 
      error: 'Failed to deactivate permission',
      details: (error as Error).message 
    });
  }
});

// ========================================
// PERMISSION VALIDATION ENDPOINT
// ========================================

// Validate Permission
router.post('/validate', async (req, res) => {
  try {
    const { userAddress, contractAddress, methodName, value } = req.body;
    
    if (!userAddress || !contractAddress || !methodName || !value) {
      return res.status(400).json({ 
        error: 'userAddress, contractAddress, methodName, and value are required' 
      });
    }
    
    const isValid = await advancedPermissionManager.validatePermission(
      userAddress,
      contractAddress,
      methodName,
      value
    );
    
    res.json({
      success: true,
      isValid,
      message: isValid 
        ? 'Permission validation passed'
        : 'Permission validation failed'
    });
    
  } catch (error) {
    console.error('❌ Permission validation error:', error);
    res.status(500).json({ 
      error: 'Failed to validate permission',
      details: (error as Error).message 
    });
  }
});

export default router;