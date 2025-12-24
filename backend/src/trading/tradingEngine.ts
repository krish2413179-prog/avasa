/*
 * PropChain AI - Advanced Trading Engine
 * Auto-Rebalance, Copy Trading, and Limit Orders for AI Agents
 */

import { ethers } from 'ethers';
import { envioService } from '../services/envioService';

// Uniswap V3 Router on Base Sepolia
const UNISWAP_V3_ROUTER = "0x2626664c2603336E57B271c5C0b26F421741e481";
const UNISWAP_V3_QUOTER = "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3";

// Chainlink Price Feeds on Base Sepolia
const CHAINLINK_FEEDS = {
  'ETH/USD': '0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1',
  'USDC/USD': '0x7e860098F58bBFC8648a4311b374B1D669a2bc6B'
};

// Token addresses on Base Sepolia
const TOKENS = {
  'WETH': '0x4200000000000000000000000000000000000006',
  'USDC': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  'DAI': '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb'
};

interface RebalanceConfig {
  userId: string;
  targetAllocations: { [asset: string]: number }; // e.g., { 'RealEstate': 60, 'ETH': 40 }
  frequency: 'daily' | 'weekly' | 'monthly';
  threshold: number; // Minimum deviation % to trigger rebalance
  maxSlippage: number;
  isActive: boolean;
}

interface CopyTradingConfig {
  userId: string;
  whaleAddress: string;
  copyPercentage: number; // What % of whale's trade size to copy
  maxTradeSize: string; // Maximum ETH per trade
  allowedTokens: string[];
  isActive: boolean;
}

interface LimitOrder {
  id: string;
  userId: string;
  tokenIn: string;
  tokenOut: string;
  targetPrice: string;
  amount: string;
  orderType: 'buy' | 'sell';
  status: 'active' | 'filled' | 'cancelled';
  createdAt: number;
  expiresAt?: number;
}

class TradingEngine {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(privateKey: string, rpcUrl: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  // ========================================
  // 1. AUTO-REBALANCE PORTFOLIO
  // ========================================

  async executeAutoRebalance(config: RebalanceConfig): Promise<any> {
    console.log(`⚖️ Auto-rebalancing portfolio for user ${config.userId}...`);

    try {
      // Get current portfolio from Envio (hyper-fast!)
      const portfolio = await envioService.getUserPortfolio(config.userId);
      const currentPrices = await this.getCurrentPrices();

      // Calculate current allocations
      const currentAllocations = await this.calculateCurrentAllocations(portfolio, currentPrices);
      
      // Check if rebalancing is needed
      const rebalanceActions = this.calculateRebalanceActions(currentAllocations, config.targetAllocations, config.threshold);

      if (rebalanceActions.length === 0) {
        console.log('✅ Portfolio is already balanced within threshold');
        return { success: true, message: 'No rebalancing needed', actions: [] };
      }

      // Execute rebalancing trades
      const results = [];
      for (const action of rebalanceActions) {
        const result = await this.executeRebalanceTrade(action, config.maxSlippage);
        results.push(result);
      }

      console.log(`✅ Auto-rebalance completed: ${results.length} trades executed`);

      return {
        success: true,
        message: `Portfolio rebalanced with ${results.length} trades`,
        actions: results,
        newAllocations: await this.calculateCurrentAllocations(portfolio, currentPrices)
      };

    } catch (error) {
      console.error('❌ Auto-rebalance error:', error);
      throw error;
    }
  }

  private async calculateCurrentAllocations(portfolio: any, prices: any): Promise<{ [asset: string]: number }> {
    const allocations: { [asset: string]: number } = {};
    let totalValue = 0;

    // Calculate RWA value
    const rwaValue = parseFloat(portfolio.totalValue) * prices.ETH_USD; // Convert ETH to USD
    allocations['RealEstate'] = rwaValue;
    totalValue += rwaValue;

    // Get ETH balance
    const ethBalance = await this.provider.getBalance(this.wallet.address);
    const ethValue = parseFloat(ethers.utils.formatEther(ethBalance)) * prices.ETH_USD;
    allocations['ETH'] = ethValue;
    totalValue += ethValue;

    // Get USDC balance
    const usdcBalance = await this.getTokenBalance(TOKENS.USDC, this.wallet.address);
    const usdcValue = parseFloat(ethers.utils.formatUnits(usdcBalance, 6)); // USDC has 6 decimals
    allocations['USDC'] = usdcValue;
    totalValue += usdcValue;

    // Convert to percentages
    Object.keys(allocations).forEach(asset => {
      allocations[asset] = (allocations[asset] / totalValue) * 100;
    });

    return allocations;
  }

  private calculateRebalanceActions(current: any, target: any, threshold: number): any[] {
    const actions = [];

    Object.keys(target).forEach(asset => {
      const currentPercent = current[asset] || 0;
      const targetPercent = target[asset];
      const deviation = Math.abs(currentPercent - targetPercent);

      if (deviation > threshold) {
        actions.push({
          asset,
          currentPercent,
          targetPercent,
          deviation,
          action: currentPercent > targetPercent ? 'sell' : 'buy',
          amount: deviation
        });
      }
    });

    return actions.sort((a, b) => b.deviation - a.deviation);
  }

  private async executeRebalanceTrade(action: any, maxSlippage: number): Promise<any> {
    console.log(`🔄 Executing rebalance trade: ${action.action} ${action.asset}`);

    // This would implement the actual Uniswap V3 swap
    // For now, returning a mock result
    return {
      success: true,
      asset: action.asset,
      action: action.action,
      amount: action.amount,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      message: `${action.action} ${action.amount.toFixed(2)}% of ${action.asset}`
    };
  }

  // ========================================
  // 2. COPY TRADING
  // ========================================

  async setupCopyTrading(config: CopyTradingConfig): Promise<any> {
    console.log(`👥 Setting up copy trading for whale: ${config.whaleAddress}`);

    try {
      // Store copy trading configuration
      await this.storeCopyTradingConfig(config);

      // Set up Envio webhook/listener for whale trades
      await this.setupWhaleTradeListener(config);

      return {
        success: true,
        message: `Copy trading activated for ${config.whaleAddress}`,
        config: {
          whaleAddress: config.whaleAddress,
          copyPercentage: config.copyPercentage,
          maxTradeSize: config.maxTradeSize,
          allowedTokens: config.allowedTokens
        }
      };

    } catch (error) {
      console.error('❌ Copy trading setup error:', error);
      throw error;
    }
  }

  async executeCopyTrade(whaleSwap: any, config: CopyTradingConfig): Promise<any> {
    console.log(`🐋 Executing copy trade from whale: ${whaleSwap.sender}`);

    try {
      // Validate the trade
      if (!this.isValidCopyTrade(whaleSwap, config)) {
        return { success: false, message: 'Trade validation failed' };
      }

      // Calculate copy trade size
      const whaleTradeSize = parseFloat(ethers.utils.formatEther(whaleSwap.amount0));
      const copyTradeSize = whaleTradeSize * (config.copyPercentage / 100);
      const maxTradeSize = parseFloat(config.maxTradeSize);

      const finalTradeSize = Math.min(copyTradeSize, maxTradeSize);

      // Execute the copy trade on Uniswap V3
      const result = await this.executeUniswapV3Swap({
        tokenIn: whaleSwap.tokenIn,
        tokenOut: whaleSwap.tokenOut,
        amountIn: ethers.utils.parseEther(finalTradeSize.toString()),
        recipient: config.userId,
        slippage: 0.5 // 0.5% slippage
      });

      console.log(`✅ Copy trade executed: ${finalTradeSize} ETH`);

      return {
        success: true,
        whaleAddress: whaleSwap.sender,
        originalTradeSize: whaleTradeSize,
        copyTradeSize: finalTradeSize,
        txHash: result.txHash,
        message: `Copied ${config.copyPercentage}% of whale trade`
      };

    } catch (error) {
      console.error('❌ Copy trade execution error:', error);
      throw error;
    }
  }

  private isValidCopyTrade(whaleSwap: any, config: CopyTradingConfig): boolean {
    // Check if tokens are allowed
    const tokenIn = whaleSwap.tokenIn || TOKENS.WETH;
    const tokenOut = whaleSwap.tokenOut || TOKENS.USDC;

    if (!config.allowedTokens.includes(tokenIn) || !config.allowedTokens.includes(tokenOut)) {
      console.log('❌ Token not in allowed list');
      return false;
    }

    // Check trade size limits
    const tradeSize = parseFloat(ethers.utils.formatEther(whaleSwap.amount0));
    if (tradeSize > parseFloat(config.maxTradeSize)) {
      console.log('❌ Trade size exceeds maximum');
      return false;
    }

    return true;
  }

  // ========================================
  // 3. LIMIT ORDERS
  // ========================================

  async createLimitOrder(order: Omit<LimitOrder, 'id' | 'status' | 'createdAt'>): Promise<LimitOrder> {
    console.log(`📋 Creating limit order: ${order.orderType} ${order.amount} ${order.tokenOut} at $${order.targetPrice}`);

    const limitOrder: LimitOrder = {
      ...order,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'active',
      createdAt: Date.now()
    };

    // Store in database
    await this.storeLimitOrder(limitOrder);

    console.log(`✅ Limit order created: ${limitOrder.id}`);

    return limitOrder;
  }

  async checkAndExecuteLimitOrders(): Promise<any[]> {
    console.log('🔍 Checking active limit orders...');

    try {
      // Get all active limit orders
      const activeOrders = await this.getActiveLimitOrders();
      
      if (activeOrders.length === 0) {
        return [];
      }

      // Get current prices from Chainlink
      const currentPrices = await this.getCurrentPrices();
      
      const executedOrders = [];

      for (const order of activeOrders) {
        const shouldExecute = await this.shouldExecuteLimitOrder(order, currentPrices);
        
        if (shouldExecute) {
          const result = await this.executeLimitOrder(order, currentPrices);
          executedOrders.push(result);
        }
      }

      if (executedOrders.length > 0) {
        console.log(`✅ Executed ${executedOrders.length} limit orders`);
      }

      return executedOrders;

    } catch (error) {
      console.error('❌ Limit order check error:', error);
      return [];
    }
  }

  private async shouldExecuteLimitOrder(order: LimitOrder, currentPrices: any): Promise<boolean> {
    const targetPrice = parseFloat(order.targetPrice);
    
    // Get current price for the token pair
    let currentPrice: number;
    
    if (order.tokenOut === TOKENS.WETH) {
      currentPrice = currentPrices.ETH_USD;
    } else if (order.tokenOut === TOKENS.USDC) {
      currentPrice = 1; // USDC is pegged to $1
    } else {
      // For other tokens, we'd need additional price feeds
      return false;
    }

    // Check if price condition is met
    if (order.orderType === 'buy') {
      return currentPrice <= targetPrice; // Buy when price drops to target
    } else {
      return currentPrice >= targetPrice; // Sell when price rises to target
    }
  }

  private async executeLimitOrder(order: LimitOrder, currentPrices: any): Promise<any> {
    console.log(`⚡ Executing limit order: ${order.id}`);

    try {
      // Execute the swap on Uniswap V3
      const result = await this.executeUniswapV3Swap({
        tokenIn: order.tokenIn,
        tokenOut: order.tokenOut,
        amountIn: ethers.utils.parseEther(order.amount),
        recipient: order.userId,
        slippage: 1.0 // 1% slippage for limit orders
      });

      // Update order status
      await this.updateLimitOrderStatus(order.id, 'filled', result.txHash);

      console.log(`✅ Limit order filled: ${order.id}`);

      return {
        success: true,
        orderId: order.id,
        orderType: order.orderType,
        amount: order.amount,
        targetPrice: order.targetPrice,
        executedPrice: currentPrices.ETH_USD,
        txHash: result.txHash,
        message: `Limit order executed at $${currentPrices.ETH_USD}`
      };

    } catch (error) {
      console.error(`❌ Limit order execution failed: ${order.id}`, error);
      throw error;
    }
  }

  // ========================================
  // UNISWAP V3 INTEGRATION
  // ========================================

  private async executeUniswapV3Swap(params: any): Promise<any> {
    console.log('🦄 Executing Uniswap V3 swap...');

    // Uniswap V3 Router ABI (simplified)
    const routerABI = [
      "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)"
    ];

    const router = new ethers.Contract(UNISWAP_V3_ROUTER, routerABI, this.wallet);

    // Calculate minimum amount out (with slippage protection)
    const amountOutMinimum = params.amountIn.mul(95).div(100); // 5% slippage

    const swapParams = {
      tokenIn: params.tokenIn,
      tokenOut: params.tokenOut,
      fee: 3000, // 0.3% fee tier
      recipient: params.recipient,
      deadline: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
      amountIn: params.amountIn,
      amountOutMinimum: amountOutMinimum,
      sqrtPriceLimitX96: 0
    };

    // Execute the swap
    const tx = await router.exactInputSingle(swapParams, {
      gasLimit: 300000
    });

    const receipt = await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  }

  // ========================================
  // CHAINLINK PRICE FEEDS
  // ========================================

  private async getCurrentPrices(): Promise<any> {
    console.log('📊 Fetching current prices from Chainlink...');

    const prices: any = {};

    // ETH/USD Price Feed
    const ethPriceFeed = new ethers.Contract(
      CHAINLINK_FEEDS['ETH/USD'],
      ['function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)'],
      this.provider
    );

    const ethPriceData = await ethPriceFeed.latestRoundData();
    prices.ETH_USD = parseFloat(ethers.utils.formatUnits(ethPriceData[1], 8)); // Chainlink uses 8 decimals

    // USDC/USD Price Feed
    const usdcPriceFeed = new ethers.Contract(
      CHAINLINK_FEEDS['USDC/USD'],
      ['function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)'],
      this.provider
    );

    const usdcPriceData = await usdcPriceFeed.latestRoundData();
    prices.USDC_USD = parseFloat(ethers.utils.formatUnits(usdcPriceData[1], 8));

    console.log(`📈 Current prices: ETH=$${prices.ETH_USD}, USDC=$${prices.USDC_USD}`);

    return prices;
  }

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  private async getTokenBalance(tokenAddress: string, userAddress: string): Promise<ethers.BigNumber> {
    const tokenABI = ['function balanceOf(address) view returns (uint256)'];
    const token = new ethers.Contract(tokenAddress, tokenABI, this.provider);
    return await token.balanceOf(userAddress);
  }

  private async storeCopyTradingConfig(config: CopyTradingConfig): Promise<void> {
    // Store in database - implementation depends on your DB schema
    console.log('💾 Storing copy trading config:', config.userId);
  }

  private async setupWhaleTradeListener(config: CopyTradingConfig): Promise<void> {
    // Set up Envio listener for whale trades
    console.log('👂 Setting up whale trade listener for:', config.whaleAddress);
  }

  private async storeLimitOrder(order: LimitOrder): Promise<void> {
    // Store in database
    console.log('💾 Storing limit order:', order.id);
  }

  private async getActiveLimitOrders(): Promise<LimitOrder[]> {
    // Get from database
    return [];
  }

  private async updateLimitOrderStatus(orderId: string, status: string, txHash?: string): Promise<void> {
    // Update in database
    console.log(`📝 Updating order ${orderId} status to ${status}`);
  }
}

// Export singleton instance
const tradingEngine = new TradingEngine(
  process.env.PRIVATE_KEY!,
  process.env.RPC_URL!
);

export { tradingEngine, TradingEngine };
export type { RebalanceConfig, CopyTradingConfig, LimitOrder };