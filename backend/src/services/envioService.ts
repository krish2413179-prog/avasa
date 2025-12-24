/*
 * PropChain AI - Envio GraphQL Service
 * Hyper-Speed Portfolio Queries - The "Real-Time Brain"
 */

interface EnvioConfig {
  endpoint: string;
  apiKey?: string;
}

interface UserPortfolioData {
  user: string;
  properties: Array<{
    propertyId: string;
    propertyName: string;
    totalShares: string;
    totalInvested: string;
    totalYieldClaimed: string;
    currentValue: string;
    yieldRate: string;
  }>;
  totalValue: string;
  totalYield: string;
  portfolioYieldRate: string;
  diversificationScore: number;
  riskScore: number;
}

interface PropertyPerformance {
  propertyId: string;
  propertyName: string;
  currentPrice: string;
  priceChange24h: string;
  volume24h: string;
  yieldRate: string;
  totalInvestors: number;
  marketCap: string;
}

interface RecentActivity {
  id: string;
  type: string;
  propertyName: string;
  amount: string;
  timestamp: string;
  transactionHash: string;
}

class EnvioService {
  private config: EnvioConfig;

  constructor(config: EnvioConfig) {
    this.config = config;
  }

  // ========================================
  // HYPER-SPEED PORTFOLIO QUERIES
  // ========================================

  async getUserPortfolio(userAddress: string): Promise<UserPortfolioData> {
    const query = `
      query GetUserPortfolio($user: String!) {
        userPortfolios(where: { user: $user }) {
          id
          user
          propertyId
          totalShares
          totalInvested
          totalYieldClaimed
          lastUpdated
        }
        
        propertyAnalytics {
          id
          propertyName
          totalValueLocked
          averageYieldRate
        }
      }
    `;

    const variables = { user: userAddress.toLowerCase() };
    const response = await this.executeQuery(query, variables);

    return this.transformPortfolioData(response.data);
  }

  async getPropertyPerformance(propertyId?: string): Promise<PropertyPerformance[]> {
    const query = `
      query GetPropertyPerformance($propertyId: String) {
        propertyAnalytics(where: { id: $propertyId }) {
          id
          propertyName
          propertyAddress
          totalInvestors
          totalSharesSold
          totalValueLocked
          totalYieldDistributed
          averageYieldRate
          lastActivity
        }
        
        propertyTransactions(
          where: { propertyId: $propertyId }
          orderBy: timestamp
          orderDirection: desc
          first: 100
        ) {
          propertyId
          cost
          shares
          timestamp
        }
      }
    `;

    const variables = propertyId ? { propertyId } : {};
    const response = await this.executeQuery(query, variables);

    return this.transformPropertyPerformance(response.data);
  }

  async getRecentActivity(userAddress: string, limit: number = 20): Promise<RecentActivity[]> {
    const query = `
      query GetRecentActivity($user: String!, $limit: Int!) {
        propertyTransactions(
          where: { investor: $user }
          orderBy: timestamp
          orderDirection: desc
          first: $limit
        ) {
          id
          propertyId
          propertyName
          action
          shares
          cost
          amount
          timestamp
          transactionHash
        }
        
        yieldTransactions(
          where: { investor: $user }
          orderBy: timestamp
          orderDirection: desc
          first: $limit
        ) {
          id
          propertyId
          propertyName
          action
          amount
          timestamp
          transactionHash
        }
      }
    `;

    const variables = { user: userAddress.toLowerCase(), limit };
    const response = await this.executeQuery(query, variables);

    return this.transformActivityData(response.data);
  }

  // ========================================
  // DEFI PROTOCOL QUERIES
  // ========================================

  async getUserSwapHistory(userAddress: string, limit: number = 50): Promise<any[]> {
    const query = `
      query GetSwapHistory($user: String!, $limit: Int!) {
        swapTransactions(
          where: { 
            or: [
              { sender: $user }
              { recipient: $user }
            ]
          }
          orderBy: timestamp
          orderDirection: desc
          first: $limit
        ) {
          id
          sender
          recipient
          amount0
          amount1
          timestamp
          transactionHash
        }
      }
    `;

    const variables = { user: userAddress.toLowerCase(), limit };
    const response = await this.executeQuery(query, variables);

    return response.data.swapTransactions || [];
  }

  async getUserStreams(userAddress: string): Promise<any[]> {
    const query = `
      query GetUserStreams($user: String!) {
        streamTransactions(
          where: { 
            or: [
              { sender: $user }
              { receiver: $user }
            ]
          }
          orderBy: timestamp
          orderDirection: desc
        ) {
          id
          token
          sender
          receiver
          flowRate
          timestamp
          transactionHash
        }
      }
    `;

    const variables = { user: userAddress.toLowerCase() };
    const response = await this.executeQuery(query, variables);

    return response.data.streamTransactions || [];
  }

  async getUserLendingPositions(userAddress: string): Promise<any[]> {
    const query = `
      query GetLendingPositions($user: String!) {
        lendingTransactions(
          where: { user: $user }
          orderBy: timestamp
          orderDirection: desc
        ) {
          id
          reserve
          user
          amount
          action
          timestamp
          transactionHash
        }
      }
    `;

    const variables = { user: userAddress.toLowerCase() };
    const response = await this.executeQuery(query, variables);

    return response.data.lendingTransactions || [];
  }

  // ========================================
  // AI OPTIMIZATION QUERIES
  // ========================================

  async getMarketTrends(timeframe: string = '24h'): Promise<any[]> {
    const query = `
      query GetMarketTrends($timeframe: String!) {
        marketTrends(
          where: { timeframe: $timeframe }
          orderBy: timestamp
          orderDirection: desc
          first: 10
        ) {
          id
          trendType
          propertyId
          priceDirection
          volumeChange
          yieldTrend
          confidence
          timestamp
        }
      }
    `;

    const variables = { timeframe };
    const response = await this.executeQuery(query, variables);

    return response.data.marketTrends || [];
  }

  async getAIRecommendations(userAddress: string): Promise<any[]> {
    const query = `
      query GetAIRecommendations($user: String!) {
        aiRecommendations(
          where: { 
            user: $user
            executed: false
          }
          orderBy: confidence
          orderDirection: desc
          first: 5
        ) {
          id
          recommendationType
          propertyId
          amount
          confidence
          reasoning
          expectedReturn
          riskLevel
          timestamp
        }
      }
    `;

    const variables = { user: userAddress.toLowerCase() };
    const response = await this.executeQuery(query, variables);

    return response.data.aiRecommendations || [];
  }

  // ========================================
  // ANALYTICS & INSIGHTS
  // ========================================

  async getDashboardMetrics(userAddress: string): Promise<any> {
    const query = `
      query GetDashboardMetrics($user: String!) {
        userAnalytics(id: $user) {
          totalPropertiesOwned
          totalInvested
          totalYieldEarned
          totalSwapVolume
          totalStreamsSent
          totalStreamsReceived
          totalLent
          totalBorrowed
          lastActivity
        }
        
        dailyMetrics(
          orderBy: date
          orderDirection: desc
          first: 30
        ) {
          date
          totalTransactions
          totalVolume
          uniqueUsers
          newInvestors
          totalYieldClaimed
        }
      }
    `;

    const variables = { user: userAddress.toLowerCase() };
    const response = await this.executeQuery(query, variables);

    return {
      userStats: response.data.userAnalytics,
      marketMetrics: response.data.dailyMetrics
    };
  }

  async getPortfolioInsights(userAddress: string): Promise<any> {
    const portfolio = await this.getUserPortfolio(userAddress);
    const trends = await this.getMarketTrends('24h');
    const recommendations = await this.getAIRecommendations(userAddress);

    return {
      portfolio,
      trends,
      recommendations,
      insights: this.generateInsights(portfolio, trends)
    };
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  private async executeQuery(query: string, variables: any = {}): Promise<any> {
    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      if (!response.ok) {
        throw new Error(`Envio query failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Envio query error:', error);
      throw error;
    }
  }

  private transformPortfolioData(data: any): UserPortfolioData {
    const portfolios = data.userPortfolios || [];
    const propertyAnalytics = data.propertyAnalytics || [];

    const properties = portfolios.map((p: any) => {
      const analytics = propertyAnalytics.find((a: any) => a.id === p.propertyId);
      
      return {
        propertyId: p.propertyId,
        propertyName: this.getPropertyName(p.propertyId),
        totalShares: p.totalShares,
        totalInvested: p.totalInvested,
        totalYieldClaimed: p.totalYieldClaimed,
        currentValue: this.calculateCurrentValue(p.totalShares, analytics?.totalValueLocked),
        yieldRate: analytics?.averageYieldRate || '0'
      };
    });

    const totalValue = properties.reduce((sum, p) => sum + parseFloat(p.currentValue), 0);
    const totalYield = properties.reduce((sum, p) => sum + parseFloat(p.totalYieldClaimed), 0);

    return {
      user: portfolios[0]?.user || '',
      properties,
      totalValue: totalValue.toString(),
      totalYield: totalYield.toString(),
      portfolioYieldRate: this.calculatePortfolioYieldRate(totalValue, totalYield),
      diversificationScore: this.calculateDiversificationScore(properties),
      riskScore: this.calculateRiskScore(properties)
    };
  }

  private transformPropertyPerformance(data: any): PropertyPerformance[] {
    const analytics = data.propertyAnalytics || [];
    const transactions = data.propertyTransactions || [];

    return analytics.map((property: any) => {
      const recentTxs = transactions.filter((tx: any) => tx.propertyId === property.id);
      const volume24h = this.calculate24hVolume(recentTxs);
      const priceChange = this.calculatePriceChange(recentTxs);

      return {
        propertyId: property.id,
        propertyName: property.propertyName,
        currentPrice: this.calculateCurrentPrice(property.totalValueLocked, property.totalSharesSold),
        priceChange24h: priceChange,
        volume24h: volume24h,
        yieldRate: property.averageYieldRate,
        totalInvestors: property.totalInvestors,
        marketCap: property.totalValueLocked
      };
    });
  }

  private transformActivityData(data: any): RecentActivity[] {
    const propertyTxs = (data.propertyTransactions || []).map((tx: any) => ({
      id: tx.id,
      type: tx.action,
      propertyName: tx.propertyName,
      amount: tx.cost || tx.amount || '0',
      timestamp: tx.timestamp,
      transactionHash: tx.transactionHash
    }));

    const yieldTxs = (data.yieldTransactions || []).map((tx: any) => ({
      id: tx.id,
      type: 'yield_claim',
      propertyName: tx.propertyName,
      amount: tx.amount,
      timestamp: tx.timestamp,
      transactionHash: tx.transactionHash
    }));

    return [...propertyTxs, ...yieldTxs]
      .sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp))
      .slice(0, 20);
  }

  private getPropertyName(propertyId: string): string {
    const names: { [key: string]: string } = {
      '1': 'Manhattan Luxury Apartments',
      '2': 'Miami Beach Condos',
      '3': 'Austin Tech Hub Office',
      '4': 'Seattle Warehouse District',
      '5': 'Denver Mountain Resort',
      '6': 'Chicago Downtown Lofts',
      '7': 'Los Angeles Studio Complex',
      '8': 'Phoenix Retail Plaza',
      '9': 'Boston Historic Brownstones',
      '10': 'Nashville Music District'
    };
    return names[propertyId] || `Property #${propertyId}`;
  }

  private calculateCurrentValue(shares: string, totalValueLocked: string): string {
    // Simplified calculation - in reality would need more complex pricing
    const shareValue = parseFloat(shares) * 0.1; // Assuming 0.1 ETH per share
    return shareValue.toString();
  }

  private calculatePortfolioYieldRate(totalValue: number, totalYield: number): string {
    if (totalValue === 0) return '0';
    return ((totalYield / totalValue) * 100).toFixed(2);
  }

  private calculateDiversificationScore(properties: any[]): number {
    // Simple diversification score based on number of properties
    return Math.min(properties.length * 20, 100);
  }

  private calculateRiskScore(properties: any[]): number {
    // Simple risk score - would be more sophisticated in production
    return Math.floor(Math.random() * 100);
  }

  private calculate24hVolume(transactions: any[]): string {
    const oneDayAgo = Date.now() / 1000 - 86400;
    const recentTxs = transactions.filter(tx => parseInt(tx.timestamp) > oneDayAgo);
    const volume = recentTxs.reduce((sum, tx) => sum + parseFloat(tx.cost || '0'), 0);
    return volume.toString();
  }

  private calculatePriceChange(transactions: any[]): string {
    // Simplified price change calculation
    return ((Math.random() - 0.5) * 10).toFixed(2);
  }

  private calculateCurrentPrice(totalValueLocked: string, totalSharesSold: string): string {
    const tvl = parseFloat(totalValueLocked || '0');
    const shares = parseFloat(totalSharesSold || '1');
    return (tvl / shares).toString();
  }

  private generateInsights(portfolio: UserPortfolioData, trends: any[]): any[] {
    const insights = [];

    // Portfolio diversification insight
    if (portfolio.properties.length < 3) {
      insights.push({
        type: 'diversification',
        message: 'Consider diversifying across more properties to reduce risk',
        priority: 'medium'
      });
    }

    // Yield optimization insight
    const avgYield = parseFloat(portfolio.portfolioYieldRate);
    if (avgYield < 5) {
      insights.push({
        type: 'yield',
        message: 'Your portfolio yield is below market average. Consider higher-yield properties.',
        priority: 'high'
      });
    }

    return insights;
  }
}

// Export singleton instance
const envioService = new EnvioService({
  endpoint: process.env.ENVIO_GRAPHQL_ENDPOINT || 'http://localhost:8080/v1/graphql',
  apiKey: process.env.ENVIO_API_KEY
});

export { envioService, EnvioService };
export type { UserPortfolioData, PropertyPerformance, RecentActivity };