/**
 * 🏆 PropChain AI - Envio Indexer Integration Service
 * Real-time analytics integration for payment automation and swap analytics
 */

import fetch from 'node-fetch';

interface EnvioConfig {
  endpoint: string;
  apiKey?: string;
}

interface PaymentSchedule {
  id: string;
  payer: string;
  recipient: string;
  amount: string;
  interval: string;
  executionsLeft: string;
  isActive: boolean;
  nextPayment: string;
}

interface SwapExecution {
  id: string;
  user: string;
  usdcAmount: string;
  ethAmount: string;
  swapType: 'instant' | 'recurring';
  timestamp: string;
}

interface ExecutorStats {
  executor: string;
  totalExecutions: string;
  totalRewardsEarned: string;
  averageReward: string;
}

export class EnvioIndexerService {
  private config: EnvioConfig;

  constructor(config: EnvioConfig) {
    this.config = config;
  }

  /**
   * Execute GraphQL query against Envio indexer
   */
  private async query(query: string, variables?: any): Promise<any> {
    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        throw new Error(`Envio API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }

      return result.data;
    } catch (error) {
      console.error('Envio indexer query failed:', error);
      throw error;
    }
  }

  /**
   * Get active payment schedules
   */
  async getActivePaymentSchedules(limit = 50): Promise<PaymentSchedule[]> {
    const query = `
      query GetActivePaymentSchedules($limit: Int!) {
        paymentSchedules(
          where: { isActive: true }
          orderBy: createdAt
          orderDirection: desc
          first: $limit
        ) {
          id
          payer
          recipient
          amount
          interval
          executionsLeft
          isActive
          nextPayment
        }
      }
    `;

    const data = await this.query(query, { limit });
    return data.paymentSchedules;
  }

  /**
   * Get payment schedules for a specific user
   */
  async getUserPaymentSchedules(userAddress: string): Promise<PaymentSchedule[]> {
    const query = `
      query GetUserPaymentSchedules($user: String!) {
        paymentSchedules(
          where: { payer: $user, isActive: true }
          orderBy: createdAt
          orderDirection: desc
        ) {
          id
          payer
          recipient
          amount
          interval
          executionsLeft
          isActive
          nextPayment
        }
      }
    `;

    const data = await this.query(query, { user: userAddress.toLowerCase() });
    return data.paymentSchedules;
  }

  /**
   * Get recent payment executions
   */
  async getRecentPaymentExecutions(limit = 100): Promise<any[]> {
    const query = `
      query GetRecentPaymentExecutions($limit: Int!) {
        paymentExecutions(
          orderBy: timestamp
          orderDirection: desc
          first: $limit
        ) {
          id
          payer
          recipient
          amount
          executor
          executorReward
          timestamp
          transactionHash
        }
      }
    `;

    const data = await this.query(query, { limit });
    return data.paymentExecutions;
  }

  /**
   * Get swap analytics
   */
  async getSwapAnalytics(timeframe: number): Promise<SwapExecution[]> {
    const query = `
      query GetSwapAnalytics($timeframe: BigInt!) {
        swapExecutions(
          where: { timestamp_gte: $timeframe }
          orderBy: timestamp
          orderDirection: desc
        ) {
          id
          user
          usdcAmount
          ethAmount
          swapType
          timestamp
          transactionHash
        }
      }
    `;

    const data = await this.query(query, { timeframe: timeframe.toString() });
    return data.swapExecutions;
  }

  /**
   * Get executor leaderboard
   */
  async getExecutorLeaderboard(limit = 20): Promise<ExecutorStats[]> {
    const query = `
      query GetExecutorLeaderboard($limit: Int!) {
        executorStats(
          orderBy: totalRewardsEarned
          orderDirection: desc
          first: $limit
        ) {
          executor
          totalExecutions
          totalRewardsEarned
          paymentExecutions
          swapExecutions
          averageReward
        }
      }
    `;

    const data = await this.query(query, { limit });
    return data.executorStats;
  }

  /**
   * Get daily protocol statistics
   */
  async getDailyProtocolStats(days = 30): Promise<any[]> {
    const query = `
      query GetDailyProtocolStats($days: Int!) {
        dailyProtocolStats(
          orderBy: date
          orderDirection: desc
          first: $days
        ) {
          date
          totalPayments
          totalPaymentVolume
          activePaymentSchedules
          totalSwaps
          totalSwapVolumeUSDC
          totalSwapVolumeETH
          totalExecutorRewards
        }
      }
    `;

    const data = await this.query(query, { days });
    return data.dailyProtocolStats;
  }

  /**
   * Get user activity summary
   */
  async getUserActivity(userAddress: string): Promise<any> {
    const query = `
      query GetUserActivity($user: String!) {
        userActivity(id: $user) {
          user
          totalPaymentsSent
          totalPaymentsReceived
          totalPaymentVolumeSent
          totalPaymentVolumeReceived
          activePaymentSchedules
          totalSwaps
          totalSwapVolumeUSDC
          totalExecutorRewards
          firstActivity
          lastActivity
        }
      }
    `;

    const data = await this.query(query, { user: userAddress.toLowerCase() });
    return data.userActivity;
  }

  /**
   * Get payment schedules due for execution
   */
  async getDuePaymentSchedules(): Promise<PaymentSchedule[]> {
    const currentTime = Math.floor(Date.now() / 1000);
    
    const query = `
      query GetDuePaymentSchedules($currentTime: BigInt!) {
        paymentSchedules(
          where: { 
            isActive: true
            nextPayment_lte: $currentTime
            executionsLeft_gt: "0"
          }
          orderBy: nextPayment
          orderDirection: asc
        ) {
          id
          payer
          recipient
          amount
          interval
          executionsLeft
          nextPayment
        }
      }
    `;

    const data = await this.query(query, { currentTime: currentTime.toString() });
    return data.paymentSchedules;
  }

  /**
   * Get swap schedules due for execution
   */
  async getDueSwapSchedules(): Promise<any[]> {
    const currentTime = Math.floor(Date.now() / 1000);
    
    const query = `
      query GetDueSwapSchedules($currentTime: BigInt!) {
        swapSchedules(
          where: { 
            isActive: true
            nextSwap_lte: $currentTime
            executionsLeft_gt: "0"
          }
          orderBy: nextSwap
          orderDirection: asc
        ) {
          id
          user
          usdcAmount
          interval
          executionsLeft
          nextSwap
        }
      }
    `;

    const data = await this.query(query, { currentTime: currentTime.toString() });
    return data.swapSchedules;
  }

  /**
   * Get USDC flow analysis
   */
  async getUSDCFlowAnalysis(timeframe: number): Promise<any[]> {
    const query = `
      query GetUSDCFlowAnalysis($timeframe: BigInt!) {
        usdcTransfers(
          where: { timestamp_gte: $timeframe }
          orderBy: timestamp
          orderDirection: desc
          first: 500
        ) {
          from
          to
          value
          timestamp
          isPaymentRelated
          isSwapRelated
          isPropertyRelated
          relatedContract
        }
      }
    `;

    const data = await this.query(query, { timeframe: timeframe.toString() });
    return data.usdcTransfers;
  }

  /**
   * Get portfolio analytics for RWA properties
   */
  async getPortfolioAnalytics(userAddress?: string): Promise<any[]> {
    const query = userAddress ? `
      query GetUserPortfolio($user: String!) {
        userPortfolios(where: { user: $user }) {
          propertyId
          totalShares
          totalInvested
          totalYieldClaimed
          lastUpdated
        }
      }
    ` : `
      query GetAllPortfolios {
        userPortfolios(first: 1000) {
          user
          propertyId
          totalShares
          totalInvested
          totalYieldClaimed
        }
      }
    `;

    const variables = userAddress ? { user: userAddress.toLowerCase() } : {};
    const data = await this.query(query, variables);
    return data.userPortfolios;
  }

  /**
   * Health check for the indexer
   */
  async healthCheck(): Promise<boolean> {
    try {
      const query = `
        query HealthCheck {
          __schema {
            queryType {
              name
            }
          }
        }
      `;

      const data = await this.query(query);
      return !!data.__schema;
    } catch (error) {
      console.error('Envio indexer health check failed:', error);
      return false;
    }
  }
}

// Create singleton instance with lazy configuration
let _envioIndexer: EnvioIndexerService | null = null;

function getEnvioIndexer(): EnvioIndexerService {
  if (!_envioIndexer) {
    const envioConfig: EnvioConfig = {
      endpoint: process.env.ENVIO_INDEXER_ENDPOINT || 'http://localhost:8080/graphql',
      apiKey: process.env.ENVIO_API_KEY
    };
    _envioIndexer = new EnvioIndexerService(envioConfig);
  }
  return _envioIndexer;
}

export const envioIndexer = {
  getActivePaymentSchedules: (limit?: number) => getEnvioIndexer().getActivePaymentSchedules(limit),
  getUserPaymentSchedules: (userAddress: string) => getEnvioIndexer().getUserPaymentSchedules(userAddress),
  getRecentPaymentExecutions: (limit?: number) => getEnvioIndexer().getRecentPaymentExecutions(limit),
  getSwapAnalytics: (timeframe: number) => getEnvioIndexer().getSwapAnalytics(timeframe),
  getExecutorLeaderboard: (limit?: number) => getEnvioIndexer().getExecutorLeaderboard(limit),
  getDailyProtocolStats: (days?: number) => getEnvioIndexer().getDailyProtocolStats(days),
  getUserActivity: (userAddress: string) => getEnvioIndexer().getUserActivity(userAddress),
  getDuePaymentSchedules: () => getEnvioIndexer().getDuePaymentSchedules(),
  getDueSwapSchedules: () => getEnvioIndexer().getDueSwapSchedules(),
  getUSDCFlowAnalysis: (timeframe: number) => getEnvioIndexer().getUSDCFlowAnalysis(timeframe),
  getPortfolioAnalytics: (userAddress?: string) => getEnvioIndexer().getPortfolioAnalytics(userAddress),
  healthCheck: () => getEnvioIndexer().healthCheck(),
};

// Export types for use in other modules
export type {
  PaymentSchedule,
  SwapExecution,
  ExecutorStats,
  EnvioConfig
};