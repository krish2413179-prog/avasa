/**
 * 🚀 Envio GraphQL Client - Zero-Latency Financial Data
 * Replaces slow ethers.js calls with lightning-fast GraphQL queries
 */

import fetch from 'node-fetch';

const ENVIO_GRAPHQL_ENDPOINT = process.env.ENVIO_GRAPHQL_URL || 'http://localhost:8080/v1/graphql';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; path?: string[] }>;
}

class EnvioClient {
  private endpoint: string;

  constructor(endpoint: string = ENVIO_GRAPHQL_ENDPOINT) {
    this.endpoint = endpoint;
  }

  /**
   * Execute GraphQL query
   */
  private async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL errors: ${result.errors.map(e => e.message).join(', ')}`);
      }

      return result.data!;
    } catch (error) {
      console.error('Envio GraphQL query failed:', error);
      throw error;
    }
  }

  // ===== USER INTELLIGENCE QUERIES =====

  /**
   * Get comprehensive user profile with all financial intelligence
   */
  async getUserProfile(userAddress: string) {
    const query = `
      query GetUserProfile($userAddress: ID!) {
        user(id: $userAddress) {
          id
          creditScore
          totalRentPaid
          totalEquityEarned
          activeStreams
          onTimePayments
          latePayments
          cancelledStreams
          averagePaymentAmount
          firstPaymentDate
          lastPaymentDate
          createdAt
          updatedAt
          
          # Property Portfolio
          propertiesOwned {
            id
            property {
              id
              name
              location
              propertyType
            }
            sharesOwned
            ownershipPercentage
            totalInvested
            currentEquityValue
            unrealizedGains
            yieldEarned
            averageMonthlyYield
            firstInvestmentDate
            lastInvestmentDate
          }
          
          # Active Payment Schedules
          paymentSchedules(where: { isActive: true }) {
            id
            recipient
            property {
              id
              name
            }
            amount
            interval
            executionsLeft
            nextPaymentDue
            totalExecuted
            totalAmountPaid
          }
        }
      }
    `;

    return this.query<{ user: any }>(query, { userAddress });
  }

  /**
   * Get user's credit score history
   */
  async getUserCreditHistory(userAddress: string, limit: number = 50) {
    const query = `
      query GetUserCreditHistory($userAddress: ID!, $limit: Int!) {
        userCreditHistories(
          where: { user: $userAddress }
          orderBy: timestamp
          orderDirection: desc
          first: $limit
        ) {
          id
          creditScore
          scoreChange
          reason
          totalPayments
          onTimePaymentRate
          timestamp
        }
      }
    `;

    return this.query<{ userCreditHistories: any[] }>(query, { userAddress, limit });
  }

  // ===== PROPERTY INTELLIGENCE QUERIES =====

  /**
   * Get all properties with performance metrics
   */
  async getAllProperties() {
    const query = `
      query GetAllProperties {
        properties {
          id
          name
          location
          propertyType
          contractAddress
          totalRevenue
          totalInvestors
          occupancyRate
          averageRentPerUnit
          monthlyRevenue
          revenueGrowthRate
          investorRetentionRate
          totalShares
          sharesOwned
          sharePrice
          createdAt
          updatedAt
        }
      }
    `;

    return this.query<{ properties: any[] }>(query);
  }

  /**
   * Get property performance ranking
   */
  async getPropertyPerformanceRanking() {
    const query = `
      query GetPropertyPerformanceRanking {
        properties(
          orderBy: totalRevenue
          orderDirection: desc
        ) {
          id
          name
          location
          totalRevenue
          monthlyRevenue
          revenueGrowthRate
          occupancyRate
          totalInvestors
        }
      }
    `;

    return this.query<{ properties: any[] }>(query);
  }

  // ===== PAYMENT SCHEDULE INTELLIGENCE =====

  /**
   * Get all due payment schedules (for the executor bot)
   */
  async getDuePaymentSchedules(currentTimestamp: number) {
    const query = `
      query GetDuePaymentSchedules($currentTimestamp: BigInt!) {
        paymentSchedules(
          where: { 
            isActive: true
            nextPaymentDue_lte: $currentTimestamp
            executionsLeft_gt: 0
          }
          orderBy: nextPaymentDue
          orderDirection: asc
        ) {
          id
          payer {
            id
            creditScore
            activeStreams
          }
          recipient
          property {
            id
            name
          }
          amount
          interval
          executionsLeft
          nextPaymentDue
          totalExecuted
          totalAmountPaid
          createdAt
        }
      }
    `;

    return this.query<{ paymentSchedules: any[] }>(query, { 
      currentTimestamp: currentTimestamp.toString() 
    });
  }

  /**
   * Get user's active payment schedules
   */
  async getUserActiveSchedules(userAddress: string) {
    const query = `
      query GetUserActiveSchedules($userAddress: ID!) {
        paymentSchedules(
          where: { 
            payer: $userAddress
            isActive: true
          }
          orderBy: nextPaymentDue
          orderDirection: asc
        ) {
          id
          recipient
          property {
            id
            name
            location
          }
          amount
          interval
          executionsLeft
          nextPaymentDue
          totalExecuted
          totalAmountPaid
          createdAt
        }
      }
    `;

    return this.query<{ paymentSchedules: any[] }>(query, { userAddress });
  }

  // ===== GLOBAL PROTOCOL INTELLIGENCE =====

  /**
   * Get global protocol statistics
   */
  async getProtocolStats() {
    const query = `
      query GetProtocolStats {
        protocolStats(id: "global") {
          id
          totalVolumeStreaming
          totalVolumeAllTime
          totalExecutions
          totalUsers
          activeUsers
          newUsersToday
          totalProperties
          totalPropertyValue
          averageOccupancyRate
          averageCreditScore
          totalEquityGenerated
          protocolRevenue
          dailyVolume
          weeklyVolume
          monthlyVolume
          lastUpdated
        }
      }
    `;

    return this.query<{ protocolStats: any }>(query);
  }

  /**
   * Get recent payment executions for activity feed
   */
  async getRecentPaymentExecutions(limit: number = 20) {
    const query = `
      query GetRecentPaymentExecutions($limit: Int!) {
        paymentExecutions(
          orderBy: timestamp
          orderDirection: desc
          first: $limit
        ) {
          id
          schedule {
            id
            payer {
              id
              creditScore
            }
            property {
              id
              name
            }
          }
          amount
          executorReward
          executor
          gasUsed
          gasPrice
          executionDelay
          transactionHash
          blockNumber
          timestamp
        }
      }
    `;

    return this.query<{ paymentExecutions: any[] }>(query, { limit });
  }

  // ===== ANALYTICS QUERIES =====

  /**
   * Get daily statistics for charts
   */
  async getDailyStats(days: number = 30) {
    const query = `
      query GetDailyStats($days: Int!) {
        dailyStats(
          orderBy: timestamp
          orderDirection: desc
          first: $days
        ) {
          id
          date
          totalVolume
          totalExecutions
          newUsers
          activeUsers
          bestPerformingProperty
          worstPerformingProperty
          totalEquityGenerated
          averagePaymentSize
          protocolFees
          timestamp
        }
      }
    `;

    return this.query<{ dailyStats: any[] }>(query, { days });
  }

  /**
   * Get top performers (users with highest credit scores)
   */
  async getTopPerformers(limit: number = 10) {
    const query = `
      query GetTopPerformers($limit: Int!) {
        users(
          orderBy: creditScore
          orderDirection: desc
          first: $limit
          where: { totalRentPaid_gt: "0" }
        ) {
          id
          creditScore
          totalRentPaid
          totalEquityEarned
          activeStreams
          onTimePayments
          latePayments
          propertiesOwned {
            property {
              name
            }
            ownershipPercentage
          }
        }
      }
    `;

    return this.query<{ users: any[] }>(query, { limit });
  }

  // ===== REAL-TIME EVENTS =====

  /**
   * Get recent stream events for real-time updates
   */
  async getRecentStreamEvents(limit: number = 50) {
    const query = `
      query GetRecentStreamEvents($limit: Int!) {
        streamExecuteds(
          orderBy: timestamp
          orderDirection: desc
          first: $limit
        ) {
          id
          user {
            id
            creditScore
          }
          property {
            id
            name
          }
          amount
          newEquityEarned
          newCreditScore
          transactionHash
          timestamp
        }
      }
    `;

    return this.query<{ streamExecuteds: any[] }>(query, { limit });
  }

  // ===== HEALTH CHECK =====

  /**
   * Check if Envio indexer is healthy and up-to-date
   */
  async healthCheck() {
    const query = `
      query HealthCheck {
        protocolStats(id: "global") {
          lastUpdated
        }
        _meta {
          block {
            number
            timestamp
          }
        }
      }
    `;

    return this.query<{ protocolStats: any; _meta: any }>(query);
  }
}

// Export singleton instance
export const envioClient = new EnvioClient();
export default envioClient;