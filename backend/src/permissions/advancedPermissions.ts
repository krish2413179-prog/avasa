/*
 * PropChain AI - Advanced EIP-7715 Permission Management
 * Granular Contract Restrictions for Automated Wealth Management
 */

import { ethers } from 'ethers';

// EIP-7715 Permission Types
interface PermissionPolicy {
  type: 'rate_limit' | 'contract_restriction' | 'conditional_trigger' | 'yield_only';
  description: string;
  constraints: any;
  isActive: boolean;
  createdAt: number;
  expiresAt?: number;
}

interface ContractPermission {
  contractAddress: string;
  allowedMethods: string[];
  restrictions: PermissionPolicy[];
  maxGasPerTx?: string;
  maxValuePerTx?: string;
}

interface AdvancedPermissionRequest {
  userId: string;
  permissionType: 'yield_farmer' | 'smart_dca' | 'emergency_brake';
  contracts: ContractPermission[];
  policies: PermissionPolicy[];
  duration: number; // in seconds
  description: string;
}

class AdvancedPermissionManager {
  private provider: ethers.providers.JsonRpcProvider;

  constructor(rpcUrl: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  }

  // ========================================
  // 1. THE "YIELD FARMER" (AUTO-COMPOUNDING)
  // ========================================

  async createYieldFarmerPermission(userAddress: string, propertyId: string): Promise<AdvancedPermissionRequest> {
    console.log(`🌾 Creating Yield Farmer permission for property ${propertyId}...`);

    const propertyContract = this.getPropertyContract(propertyId);
    
    const yieldFarmerPermission: AdvancedPermissionRequest = {
      userId: userAddress,
      permissionType: 'yield_farmer',
      description: 'Auto-compound yield from real estate investments',
      duration: 365 * 24 * 60 * 60, // 1 year
      contracts: [{
        contractAddress: propertyContract.address,
        allowedMethods: [
          'claimYield()', 
          'purchaseShares(uint256)',
          'calculatePendingYield(address)',
          'getInvestorInfo(address)'
        ],
        restrictions: [{
          type: 'yield_only',
          description: 'Can only spend funds generated from yield claims',
          constraints: {
            fundingSource: 'yield_claims_only',
            maxSpendPercentage: 100, // Can spend 100% of claimed yield
            requireYieldClaim: true, // Must claim yield before spending
            allowedTargets: [propertyContract.address] // Can only reinvest in same property
          },
          isActive: true,
          createdAt: Date.now()
        }],
        maxGasPerTx: ethers.utils.parseUnits('300000', 'wei').toString(), // 300k gas limit
        maxValuePerTx: ethers.utils.parseEther('10').toString() // Max 10 ETH per transaction
      }],
      policies: [{
        type: 'contract_restriction',
        description: 'Yield-only spending with auto-compounding',
        constraints: {
          onlyYieldFunds: true,
          autoCompound: true,
          minYieldThreshold: ethers.utils.parseEther('0.01').toString(), // Min 0.01 ETH to compound
          compoundingFrequency: 'weekly'
        },
        isActive: true,
        createdAt: Date.now(),
        expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
      }]
    };

    return yieldFarmerPermission;
  }

  async executeYieldFarming(userAddress: string, propertyId: string): Promise<any> {
    console.log(`🌾 Executing yield farming for ${userAddress} on property ${propertyId}...`);

    try {
      const propertyContract = this.getPropertyContract(propertyId);
      
      // Step 1: Check pending yield
      const pendingYield = await this.checkPendingYield(propertyContract.address, userAddress);
      
      if (pendingYield.eq(0)) {
        return { success: false, message: 'No yield available to claim' };
      }

      // Step 2: Claim yield (this generates the funds we're allowed to spend)
      const claimResult = await this.claimYield(propertyContract.address, userAddress);
      
      // Step 3: Immediately reinvest the claimed yield (using EIP-7715 permission)
      const reinvestResult = await this.reinvestYield(propertyContract.address, userAddress, pendingYield);

      console.log(`✅ Yield farming completed: Claimed ${ethers.utils.formatEther(pendingYield)} ETH and reinvested`);

      return {
        success: true,
        yieldClaimed: ethers.utils.formatEther(pendingYield),
        sharesAcquired: reinvestResult.sharesAcquired,
        txHashes: [claimResult.txHash, reinvestResult.txHash],
        compoundEffect: this.calculateCompoundEffect(pendingYield),
        message: `Auto-compounded ${ethers.utils.formatEther(pendingYield)} ETH yield`
      };

    } catch (error) {
      console.error('❌ Yield farming error:', error);
      throw error;
    }
  }

  // ========================================
  // 2. THE "SMART DCA" (DOLLAR COST AVERAGING)
  // ========================================

  async createSmartDCAPermission(userAddress: string, weeklyAmount: string, propertyId: string): Promise<AdvancedPermissionRequest> {
    console.log(`📈 Creating Smart DCA permission: $${weeklyAmount} weekly into property ${propertyId}...`);

    const propertyContract = this.getPropertyContract(propertyId);
    const weeklyAmountWei = ethers.utils.parseEther(weeklyAmount);

    const smartDCAPermission: AdvancedPermissionRequest = {
      userId: userAddress,
      permissionType: 'smart_dca',
      description: `Invest ${weeklyAmount} ETH weekly via Dollar Cost Averaging`,
      duration: 52 * 7 * 24 * 60 * 60, // 1 year of weekly investments
      contracts: [{
        contractAddress: propertyContract.address,
        allowedMethods: [
          'purchaseShares(uint256)',
          'getPropertyInfo()',
          'balanceOf(address)'
        ],
        restrictions: [{
          type: 'rate_limit',
          description: `Weekly spending limit of ${weeklyAmount} ETH`,
          constraints: {
            maxAmount: weeklyAmountWei.toString(),
            timeWindow: 604800, // 1 week in seconds
            resetPeriod: 'weekly',
            startTime: Math.floor(Date.now() / 1000),
            allowedDays: [1], // Only Mondays (0=Sunday, 1=Monday, etc.)
            gracePeriod: 3600 // 1 hour grace period
          },
          isActive: true,
          createdAt: Date.now()
        }],
        maxGasPerTx: ethers.utils.parseUnits('250000', 'wei').toString(),
        maxValuePerTx: weeklyAmountWei.toString()
      }],
      policies: [{
        type: 'rate_limit',
        description: 'Weekly DCA with day-of-week restrictions',
        constraints: {
          weeklyLimit: weeklyAmountWei.toString(),
          executionDay: 'monday',
          maxMissedWeeks: 2, // Can catch up if missed 2 weeks
          priceAveraging: true,
          volatilityAdjustment: true // Adjust amount based on volatility
        },
        isActive: true,
        createdAt: Date.now(),
        expiresAt: Date.now() + (52 * 7 * 24 * 60 * 60 * 1000) // 1 year
      }]
    };

    return smartDCAPermission;
  }

  async executeSmartDCA(userAddress: string, propertyId: string, weeklyAmount: string): Promise<any> {
    console.log(`📈 Executing Smart DCA: ${weeklyAmount} ETH into property ${propertyId}...`);

    try {
      // Check if it's the right day (Monday) and within rate limits
      const canExecute = await this.checkDCAEligibility(userAddress, propertyId, weeklyAmount);
      
      if (!canExecute.eligible) {
        return { 
          success: false, 
          message: canExecute.reason,
          nextExecutionTime: canExecute.nextExecutionTime
        };
      }

      const propertyContract = this.getPropertyContract(propertyId);
      const amount = ethers.utils.parseEther(weeklyAmount);

      // Get current property price for DCA calculation
      const currentPrice = await this.getCurrentPropertyPrice(propertyContract.address);
      const sharesAmount = amount.div(currentPrice);

      // Execute the DCA purchase using EIP-7715 permission
      const purchaseResult = await this.executeDCAPurchase(propertyContract.address, userAddress, sharesAmount);

      // Update DCA tracking
      await this.updateDCAHistory(userAddress, propertyId, weeklyAmount, currentPrice);

      console.log(`✅ Smart DCA executed: ${weeklyAmount} ETH → ${sharesAmount} shares`);

      return {
        success: true,
        amountInvested: weeklyAmount,
        sharesAcquired: sharesAmount.toString(),
        pricePerShare: ethers.utils.formatEther(currentPrice),
        txHash: purchaseResult.txHash,
        dcaStats: await this.getDCAStats(userAddress, propertyId),
        message: `DCA investment completed: ${weeklyAmount} ETH at ${ethers.utils.formatEther(currentPrice)} ETH/share`
      };

    } catch (error) {
      console.error('❌ Smart DCA error:', error);
      throw error;
    }
  }

  // ========================================
  // 3. THE "EMERGENCY BRAKE" (STOP-LOSS)
  // ========================================

  async createEmergencyBrakePermission(userAddress: string, triggerPrice: string): Promise<AdvancedPermissionRequest> {
    console.log(`🚨 Creating Emergency Brake permission: Trigger at ETH < $${triggerPrice}...`);

    const emergencyBrakePermission: AdvancedPermissionRequest = {
      userId: userAddress,
      permissionType: 'emergency_brake',
      description: `Emergency ETH→USDC swap if ETH drops below $${triggerPrice}`,
      duration: 365 * 24 * 60 * 60, // 1 year
      contracts: [{
        contractAddress: '0x2626664c2603336E57B271c5C0b26F421741e481', // Uniswap V3 Router
        allowedMethods: [
          'exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))',
          'multicall(uint256,bytes[])'
        ],
        restrictions: [{
          type: 'conditional_trigger',
          description: `Only activate when ETH price < $${triggerPrice}`,
          constraints: {
            priceOracle: '0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1', // Chainlink ETH/USD
            triggerCondition: 'price_below',
            triggerPrice: ethers.utils.parseUnits(triggerPrice, 8).toString(), // Chainlink uses 8 decimals
            maxSlippage: 300, // 3% max slippage for emergency swaps
            cooldownPeriod: 3600, // 1 hour cooldown between triggers
            maxExecutions: 5 // Max 5 emergency swaps per year
          },
          isActive: true,
          createdAt: Date.now()
        }],
        maxGasPerTx: ethers.utils.parseUnits('500000', 'wei').toString(), // Higher gas for emergency
        maxValuePerTx: ethers.utils.parseEther('100').toString() // Max 100 ETH per emergency swap
      }],
      policies: [{
        type: 'conditional_trigger',
        description: 'Dormant permission that activates on price triggers',
        constraints: {
          isDormant: true, // Permission is dormant until triggered
          triggerType: 'price_threshold',
          emergencyOnly: true,
          requiresConfirmation: false, // No confirmation needed in emergency
          notificationRequired: true, // Send notification after execution
          swapPercentage: 100 // Swap 100% of ETH holdings
        },
        isActive: true,
        createdAt: Date.now(),
        expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
      }]
    };

    return emergencyBrakePermission;
  }

  async checkEmergencyBrakeTrigger(userAddress: string, triggerPrice: string): Promise<any> {
    console.log(`🚨 Checking emergency brake trigger for ${userAddress}...`);

    try {
      // Get current ETH price from Chainlink
      const currentPrice = await this.getCurrentETHPrice();
      const triggerPriceNum = parseFloat(triggerPrice);

      console.log(`📊 Current ETH price: $${currentPrice}, Trigger: $${triggerPriceNum}`);

      if (currentPrice >= triggerPriceNum) {
        return {
          shouldTrigger: false,
          currentPrice,
          triggerPrice: triggerPriceNum,
          message: `ETH price ($${currentPrice}) is above trigger ($${triggerPriceNum})`
        };
      }

      // Check cooldown and execution limits
      const canExecute = await this.checkEmergencyBrakeEligibility(userAddress);
      
      if (!canExecute.eligible) {
        return {
          shouldTrigger: false,
          currentPrice,
          triggerPrice: triggerPriceNum,
          message: canExecute.reason
        };
      }

      // Execute emergency brake
      const swapResult = await this.executeEmergencySwap(userAddress);

      console.log(`🚨 Emergency brake triggered! Swapped ${swapResult.ethAmount} ETH → ${swapResult.usdcAmount} USDC`);

      return {
        shouldTrigger: true,
        executed: true,
        currentPrice,
        triggerPrice: triggerPriceNum,
        ethSwapped: swapResult.ethAmount,
        usdcReceived: swapResult.usdcAmount,
        txHash: swapResult.txHash,
        message: `Emergency brake activated: Protected ${swapResult.usdcAmount} USDC from ETH crash`
      };

    } catch (error) {
      console.error('❌ Emergency brake error:', error);
      throw error;
    }
  }

  // ========================================
  // PERMISSION VALIDATION & ENFORCEMENT
  // ========================================

  async validatePermission(userAddress: string, contractAddress: string, methodName: string, value: string): Promise<boolean> {
    console.log(`🔍 Validating permission: ${userAddress} → ${contractAddress}.${methodName}()`);

    try {
      // Get user's active permissions
      const permissions = await this.getUserPermissions(userAddress);
      
      // Find matching contract permission
      const contractPermission = permissions.find(p => 
        p.contracts.some(c => c.contractAddress.toLowerCase() === contractAddress.toLowerCase())
      );

      if (!contractPermission) {
        console.log('❌ No permission found for contract');
        return false;
      }

      const contract = contractPermission.contracts.find(c => 
        c.contractAddress.toLowerCase() === contractAddress.toLowerCase()
      );

      // Check if method is allowed
      if (!contract?.allowedMethods.includes(methodName)) {
        console.log(`❌ Method ${methodName} not in allowed methods`);
        return false;
      }

      // Validate against all restrictions
      for (const restriction of contract.restrictions) {
        const isValid = await this.validateRestriction(restriction, userAddress, value);
        if (!isValid) {
          console.log(`❌ Restriction validation failed: ${restriction.type}`);
          return false;
        }
      }

      console.log('✅ Permission validation passed');
      return true;

    } catch (error) {
      console.error('❌ Permission validation error:', error);
      return false;
    }
  }

  private async validateRestriction(restriction: PermissionPolicy, userAddress: string, value: string): Promise<boolean> {
    switch (restriction.type) {
      case 'yield_only':
        return await this.validateYieldOnlyRestriction(restriction, userAddress, value);
      
      case 'rate_limit':
        return await this.validateRateLimitRestriction(restriction, userAddress, value);
      
      case 'conditional_trigger':
        return await this.validateConditionalTrigger(restriction, userAddress);
      
      default:
        return true;
    }
  }

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  private getPropertyContract(propertyId: string): { address: string; name: string } {
    const properties: { [key: string]: { address: string; name: string } } = {
      '1': { address: '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be', name: 'Manhattan Luxury Apartments' },
      '2': { address: '0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968', name: 'Miami Beach Condos' },
      '3': { address: '0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883', name: 'Austin Tech Hub Office' },
      '4': { address: '0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26', name: 'Seattle Warehouse District' },
      '5': { address: '0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC', name: 'Denver Mountain Resort' },
      '6': { address: '0x86337dDaF2661A069D0DcB5D160585acC2d15E9a', name: 'Chicago Downtown Lofts' },
      '7': { address: '0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4', name: 'Los Angeles Studio Complex' },
      '8': { address: '0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8', name: 'Phoenix Retail Plaza' },
      '9': { address: '0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B', name: 'Boston Historic Brownstones' },
      '10': { address: '0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3', name: 'Nashville Music District' }
    };

    return properties[propertyId] || properties['1'];
  }

  private async checkPendingYield(contractAddress: string, userAddress: string): Promise<ethers.BigNumber> {
    // Mock implementation - would call actual contract
    return ethers.utils.parseEther('0.05'); // 0.05 ETH pending yield
  }

  private async claimYield(contractAddress: string, userAddress: string): Promise<any> {
    // Mock implementation - would execute actual transaction
    return {
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      yieldClaimed: ethers.utils.parseEther('0.05')
    };
  }

  private async reinvestYield(contractAddress: string, userAddress: string, amount: ethers.BigNumber): Promise<any> {
    // Mock implementation - would execute actual reinvestment
    const shares = amount.div(ethers.utils.parseEther('0.1')); // 0.1 ETH per share
    return {
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      sharesAcquired: shares.toString()
    };
  }

  private calculateCompoundEffect(yieldAmount: ethers.BigNumber): string {
    // Calculate compound interest effect
    const annualYield = yieldAmount.mul(52); // Weekly yield * 52 weeks
    return ethers.utils.formatEther(annualYield);
  }

  private async getCurrentETHPrice(): Promise<number> {
    // Mock implementation - would call Chainlink price feed
    return 2000 + (Math.random() - 0.5) * 200; // Simulate price around $2000
  }

  private async checkDCAEligibility(userAddress: string, propertyId: string, amount: string): Promise<any> {
    // Check if it's Monday and within rate limits
    const now = new Date();
    const isMonday = now.getDay() === 1;
    
    if (!isMonday) {
      const daysUntilMonday = (8 - now.getDay()) % 7;
      const nextMonday = new Date(now.getTime() + daysUntilMonday * 24 * 60 * 60 * 1000);
      
      return {
        eligible: false,
        reason: 'DCA only executes on Mondays',
        nextExecutionTime: nextMonday.toISOString()
      };
    }

    // Check weekly spending limit (mock)
    return { eligible: true };
  }

  private async getCurrentPropertyPrice(contractAddress: string): Promise<ethers.BigNumber> {
    // Mock implementation - would get actual property price
    return ethers.utils.parseEther('0.1'); // 0.1 ETH per share
  }

  private async executeDCAPurchase(contractAddress: string, userAddress: string, shares: ethers.BigNumber): Promise<any> {
    // Mock implementation - would execute actual purchase
    return {
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      sharesAcquired: shares.toString()
    };
  }

  private async updateDCAHistory(userAddress: string, propertyId: string, amount: string, price: ethers.BigNumber): Promise<void> {
    // Store DCA execution history in database
    const { DCAHistoryRepository } = await import('../db/schema');
    
    await DCAHistoryRepository.create({
      userAddress,
      propertyId,
      amount,
      pricePerShare: ethers.utils.formatEther(price),
      sharesAcquired: (parseFloat(amount) / parseFloat(ethers.utils.formatEther(price))).toString(),
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`
    });
    
    console.log(`📝 Updated DCA history: ${amount} ETH at ${ethers.utils.formatEther(price)} ETH/share`);
  }

  private async getDCAStats(userAddress: string, propertyId: string): Promise<any> {
    // Get DCA statistics from database
    const { DCAHistoryRepository } = await import('../db/schema');
    const history = await DCAHistoryRepository.findByUser(userAddress, propertyId);
    
    if (history.length === 0) {
      return {
        totalInvested: '0 ETH',
        averagePrice: '0 ETH/share',
        totalShares: '0',
        executionCount: 0,
        nextExecution: 'Next Monday'
      };
    }
    
    const totalInvested = history.reduce((sum, h) => sum + parseFloat(h.amount), 0);
    const totalShares = history.reduce((sum, h) => sum + parseFloat(h.sharesAcquired), 0);
    const averagePrice = totalInvested / totalShares;
    
    return {
      totalInvested: `${totalInvested.toFixed(3)} ETH`,
      averagePrice: `${averagePrice.toFixed(6)} ETH/share`,
      totalShares: totalShares.toFixed(2),
      executionCount: history.length,
      nextExecution: 'Next Monday'
    };
  }

  private async checkEmergencyBrakeEligibility(userAddress: string): Promise<any> {
    // Check cooldown and execution limits
    return { eligible: true };
  }

  private async executeEmergencySwap(userAddress: string): Promise<any> {
    // Mock emergency swap execution
    return {
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      ethAmount: '2.5 ETH',
      usdcAmount: '4,750 USDC'
    };
  }

  private async getUserPermissions(userAddress: string): Promise<AdvancedPermissionRequest[]> {
    // Get from database
    const { AdvancedPermissionRepository } = await import('../db/schema');
    const permissions = await AdvancedPermissionRepository.findByUser(userAddress);
    
    return permissions.map(p => ({
      userId: p.userAddress,
      permissionType: p.permissionType,
      contracts: [{
        contractAddress: p.contractAddress,
        allowedMethods: JSON.parse(p.allowedMethods),
        restrictions: JSON.parse(p.restrictions),
      }],
      policies: JSON.parse(p.policies),
      duration: p.duration,
      description: p.description || ''
    }));
  }

  private async validateYieldOnlyRestriction(restriction: PermissionPolicy, userAddress: string, value: string): Promise<boolean> {
    // Validate that funds come from yield claims only
    return true; // Mock implementation
  }

  private async validateRateLimitRestriction(restriction: PermissionPolicy, userAddress: string, value: string): Promise<boolean> {
    // Validate rate limits
    return true; // Mock implementation
  }

  private async validateConditionalTrigger(restriction: PermissionPolicy, userAddress: string): Promise<boolean> {
    // Validate conditional triggers
    return true; // Mock implementation
  }
}

// Export singleton instance
const advancedPermissionManager = new AdvancedPermissionManager(
  process.env.RPC_URL || 'http://localhost:8545'
);

export { advancedPermissionManager, AdvancedPermissionManager };
export type { AdvancedPermissionRequest, ContractPermission, PermissionPolicy };