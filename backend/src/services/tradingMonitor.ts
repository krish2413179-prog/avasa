/*
 * PropChain AI - Trading Monitor Service
 * Background service for limit orders, copy trading, and auto-rebalancing
 */

import cron from 'node-cron';
import { tradingEngine } from '../trading/tradingEngine';
import { envioService } from './envioService';

class TradingMonitorService {
  private isRunning = false;

  start() {
    if (this.isRunning) {
      console.log('⚠️ Trading monitor is already running');
      return;
    }

    console.log('🚀 Starting PropChain AI Trading Monitor...');
    this.isRunning = true;

    // Check limit orders every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      try {
        console.log('🔍 Checking limit orders...');
        const executedOrders = await tradingEngine.checkAndExecuteLimitOrders();
        
        if (executedOrders.length > 0) {
          console.log(`✅ Executed ${executedOrders.length} limit orders`);
        }
      } catch (error) {
        console.error('❌ Limit order check error:', error);
      }
    });

    // Check for whale trades every minute (copy trading)
    cron.schedule('* * * * *', async () => {
      try {
        await this.checkForWhaleTrades();
      } catch (error) {
        console.error('❌ Whale trade check error:', error);
      }
    });

    // Auto-rebalance check every hour
    cron.schedule('0 * * * *', async () => {
      try {
        console.log('⚖️ Checking auto-rebalance triggers...');
        await this.checkAutoRebalanceTriggers();
      } catch (error) {
        console.error('❌ Auto-rebalance check error:', error);
      }
    });

    // Price monitoring every 30 seconds
    cron.schedule('*/30 * * * * *', async () => {
      try {
        await this.monitorPrices();
      } catch (error) {
        console.error('❌ Price monitoring error:', error);
      }
    });

    console.log('✅ Trading monitor started successfully');
    console.log('📋 Active schedules:');
    console.log('  - Limit orders: Every 5 minutes');
    console.log('  - Copy trading: Every minute');
    console.log('  - Auto-rebalance: Every hour');
    console.log('  - Price monitoring: Every 30 seconds');
  }

  stop() {
    if (!this.isRunning) {
      console.log('⚠️ Trading monitor is not running');
      return;
    }

    console.log('🛑 Stopping PropChain AI Trading Monitor...');
    
    // Stop all cron jobs
    cron.getTasks().forEach((task, name) => {
      task.stop();
      console.log(`📋 Stopped task: ${name}`);
    });

    this.isRunning = false;
    console.log('✅ Trading monitor stopped');
  }

  // ========================================
  // COPY TRADING MONITORING
  // ========================================

  private async checkForWhaleTrades() {
    try {
      // Get active copy trading configurations
      const copyConfigs = await this.getActiveCopyTradingConfigs();
      
      if (copyConfigs.length === 0) {
        return;
      }

      // Check for new whale trades in the last minute
      for (const config of copyConfigs) {
        const recentSwaps = await envioService.getUserSwapHistory(config.whaleAddress, 10);
        
        // Filter swaps from the last minute
        const oneMinuteAgo = Date.now() - 60000;
        const newSwaps = recentSwaps.filter(swap => 
          parseInt(swap.timestamp) * 1000 > oneMinuteAgo
        );

        if (newSwaps.length > 0) {
          console.log(`🐋 Found ${newSwaps.length} new whale trades from ${config.whaleAddress}`);
          
          for (const swap of newSwaps) {
            try {
              const result = await tradingEngine.executeCopyTrade(swap, config);
              console.log(`✅ Copy trade executed: ${result.copyTradeSize} ETH`);
            } catch (error) {
              console.error(`❌ Copy trade failed for ${swap.id}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Whale trade monitoring error:', error);
    }
  }

  // ========================================
  // AUTO-REBALANCE MONITORING
  // ========================================

  private async checkAutoRebalanceTriggers() {
    try {
      // Get active auto-rebalance configurations
      const rebalanceConfigs = await this.getActiveRebalanceConfigs();
      
      if (rebalanceConfigs.length === 0) {
        return;
      }

      for (const config of rebalanceConfigs) {
        // Check if it's time to rebalance based on frequency
        const shouldRebalance = await this.shouldTriggerRebalance(config);
        
        if (shouldRebalance) {
          console.log(`⚖️ Triggering auto-rebalance for user ${config.userId}`);
          
          try {
            const result = await tradingEngine.executeAutoRebalance(config);
            console.log(`✅ Auto-rebalance completed: ${result.actions.length} trades`);
            
            // Update last rebalance time
            await this.updateLastRebalanceTime(config.userId);
          } catch (error) {
            console.error(`❌ Auto-rebalance failed for ${config.userId}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('❌ Auto-rebalance monitoring error:', error);
    }
  }

  private async shouldTriggerRebalance(config: any): Promise<boolean> {
    // Check if enough time has passed since last rebalance
    const lastRebalance = await this.getLastRebalanceTime(config.userId);
    const now = Date.now();
    
    let intervalMs: number;
    switch (config.frequency) {
      case 'daily': intervalMs = 24 * 60 * 60 * 1000; break;
      case 'weekly': intervalMs = 7 * 24 * 60 * 60 * 1000; break;
      case 'monthly': intervalMs = 30 * 24 * 60 * 60 * 1000; break;
      default: intervalMs = 7 * 24 * 60 * 60 * 1000; // Default weekly
    }

    return (now - lastRebalance) >= intervalMs;
  }

  // ========================================
  // PRICE MONITORING
  // ========================================

  private async monitorPrices() {
    try {
      // This could be used for price alerts, trend analysis, etc.
      // For now, we'll just log current prices periodically
      
      const prices = await this.getCurrentPrices();
      
      // Store price history for trend analysis
      await this.storePriceHistory(prices);
      
      // Check for significant price movements
      await this.checkPriceAlerts(prices);
      
    } catch (error) {
      console.error('❌ Price monitoring error:', error);
    }
  }

  private async getCurrentPrices(): Promise<any> {
    // This would integrate with Chainlink price feeds
    // For now, return mock data
    return {
      ETH_USD: 2000 + (Math.random() - 0.5) * 100, // Simulate price movement
      USDC_USD: 1.0,
      timestamp: Date.now()
    };
  }

  private async storePriceHistory(prices: any): Promise<void> {
    // Store in database for trend analysis
    console.log(`📊 Price update: ETH=$${prices.ETH_USD.toFixed(2)}`);
  }

  private async checkPriceAlerts(prices: any): Promise<void> {
    // Check if any users have price alerts that should trigger
    // This could trigger notifications or automatic actions
  }

  // ========================================
  // DATABASE HELPERS (Mock implementations)
  // ========================================

  private async getActiveCopyTradingConfigs(): Promise<any[]> {
    // Get from database - mock for now
    return [
      {
        userId: '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6',
        whaleAddress: '0x1234567890123456789012345678901234567890',
        copyPercentage: 10,
        maxTradeSize: '1',
        allowedTokens: ['WETH', 'USDC', 'DAI'],
        isActive: true
      }
    ];
  }

  private async getActiveRebalanceConfigs(): Promise<any[]> {
    // Get from database - mock for now
    return [
      {
        userId: '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6',
        targetAllocations: { 'RealEstate': 60, 'ETH': 40 },
        frequency: 'weekly',
        threshold: 5,
        maxSlippage: 0.5,
        isActive: true
      }
    ];
  }

  private async getLastRebalanceTime(userId: string): Promise<number> {
    // Get from database
    const { RebalanceHistoryRepository } = await import('../db/schema');
    const lastRebalance = await RebalanceHistoryRepository.getLastRebalanceTime(userId);
    return lastRebalance.getTime();
  }

  private async updateLastRebalanceTime(userId: string): Promise<void> {
    // Update in database
    const { RebalanceHistoryRepository } = await import('../db/schema');
    await RebalanceHistoryRepository.updateLastRebalanceTime(userId);
    console.log(`📝 Updated last rebalance time for ${userId}`);
  }

  // ========================================
  // STATUS AND HEALTH
  // ========================================

  getStatus() {
    return {
      isRunning: this.isRunning,
      activeTasks: cron.getTasks().size,
      uptime: process.uptime(),
      lastCheck: new Date().toISOString()
    };
  }

  async getHealthCheck() {
    try {
      // Test all critical services
      const envioHealth = await this.testEnvioConnection();
      const chainlinkHealth = await this.testChainlinkFeeds();
      const uniswapHealth = await this.testUniswapConnection();

      return {
        status: 'healthy',
        services: {
          envio: envioHealth,
          chainlink: chainlinkHealth,
          uniswap: uniswapHealth
        },
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: (error as Error).message,
        timestamp: Date.now()
      };
    }
  }

  private async testEnvioConnection(): Promise<boolean> {
    try {
      await envioService.getPropertyPerformance();
      return true;
    } catch {
      return false;
    }
  }

  private async testChainlinkFeeds(): Promise<boolean> {
    try {
      await this.getCurrentPrices();
      return true;
    } catch {
      return false;
    }
  }

  private async testUniswapConnection(): Promise<boolean> {
    // Test Uniswap connection
    return true; // Mock for now
  }
}

// Export singleton instance
const tradingMonitor = new TradingMonitorService();

export { tradingMonitor, TradingMonitorService };