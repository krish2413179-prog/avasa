/*
 * PropChain AI - Portfolio Intelligence Agent
 * Uses Envio as the "Real-Time Brain" for smart investment decisions
 */

import { envioService, UserPortfolioData, PropertyPerformance } from '../services/envioService';

interface PortfolioAnalysis {
  currentPortfolio: UserPortfolioData;
  marketConditions: PropertyPerformance[];
  recommendations: AIRecommendation[];
  riskAssessment: RiskAssessment;
  optimizationSuggestions: OptimizationSuggestion[];
}

interface AIRecommendation {
  type: 'buy' | 'sell' | 'rebalance' | 'claim_yield' | 'diversify';
  propertyId?: string;
  propertyName?: string;
  amount: string;
  confidence: number; // 0-100
  reasoning: string;
  expectedReturn: string;
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
}

interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high';
  diversificationRisk: number;
  concentrationRisk: number;
  liquidityRisk: number;
  marketRisk: number;
  recommendations: string[];
}

interface OptimizationSuggestion {
  type: 'rebalance' | 'diversify' | 'yield_optimization' | 'risk_reduction';
  description: string;
  impact: string;
  priority: 'low' | 'medium' | 'high';
  estimatedGain: string;
}

class PortfolioAgent {
  
  // ========================================
  // MAIN INTELLIGENCE FUNCTIONS
  // ========================================

  async analyzePortfolio(userAddress: string): Promise<PortfolioAnalysis> {
    console.log('🧠 PortfolioAgent: Analyzing portfolio with Envio brain...');

    try {
      // Get real-time data from Envio (instant queries!)
      const [portfolio, marketData, trends] = await Promise.all([
        envioService.getUserPortfolio(userAddress),
        envioService.getPropertyPerformance(),
        envioService.getMarketTrends('24h')
      ]);

      console.log(`📊 Portfolio loaded: ${portfolio.properties.length} properties, $${portfolio.totalValue} total value`);

      // Generate AI-powered analysis
      const recommendations = await this.generateRecommendations(portfolio, marketData, trends);
      const riskAssessment = this.assessRisk(portfolio, marketData);
      const optimizations = this.generateOptimizations(portfolio, marketData);

      return {
        currentPortfolio: portfolio,
        marketConditions: marketData,
        recommendations,
        riskAssessment,
        optimizationSuggestions: optimizations
      };

    } catch (error) {
      console.error('❌ Portfolio analysis error:', error);
      throw new Error('Failed to analyze portfolio with Envio data');
    }
  }

  async getSmartRecommendations(userAddress: string, investmentAmount: string, riskTolerance: 'conservative' | 'balanced' | 'aggressive'): Promise<AIRecommendation[]> {
    console.log(`🎯 Generating smart recommendations for ${investmentAmount} with ${riskTolerance} risk tolerance`);

    const portfolio = await envioService.getUserPortfolio(userAddress);
    const marketData = await envioService.getPropertyPerformance();
    
    return this.generateInvestmentRecommendations(portfolio, marketData, investmentAmount, riskTolerance);
  }

  async getYieldOptimization(userAddress: string): Promise<OptimizationSuggestion[]> {
    console.log('💰 Analyzing yield optimization opportunities...');

    const portfolio = await envioService.getUserPortfolio(userAddress);
    const marketData = await envioService.getPropertyPerformance();
    
    return this.analyzeYieldOptimization(portfolio, marketData);
  }

  async getRebalanceStrategy(userAddress: string, targetAllocation: { [propertyId: string]: number }): Promise<AIRecommendation[]> {
    console.log('⚖️ Calculating optimal rebalancing strategy...');

    const portfolio = await envioService.getUserPortfolio(userAddress);
    return this.calculateRebalanceActions(portfolio, targetAllocation);
  }

  // ========================================
  // AI RECOMMENDATION ENGINE
  // ========================================

  private async generateRecommendations(portfolio: UserPortfolioData, marketData: PropertyPerformance[], trends: any[]): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    // 1. Diversification Analysis
    if (portfolio.properties.length < 3) {
      const bestPerformers = marketData
        .filter(p => !portfolio.properties.some(up => up.propertyId === p.propertyId))
        .sort((a, b) => parseFloat(b.yieldRate) - parseFloat(a.yieldRate))
        .slice(0, 2);

      bestPerformers.forEach(property => {
        recommendations.push({
          type: 'buy',
          propertyId: property.propertyId,
          propertyName: property.propertyName,
          amount: '5000', // $5k recommendation
          confidence: 85,
          reasoning: `Diversification opportunity: ${property.propertyName} offers ${property.yieldRate}% yield with strong market performance`,
          expectedReturn: this.calculateExpectedReturn(property.yieldRate, '5000'),
          riskLevel: 'medium',
          timeframe: '6-12 months'
        });
      });
    }

    // 2. Yield Optimization
    const lowYieldProperties = portfolio.properties.filter(p => parseFloat(p.yieldRate) < 5);
    if (lowYieldProperties.length > 0) {
      const highYieldAlternatives = marketData
        .filter(p => parseFloat(p.yieldRate) > 7)
        .sort((a, b) => parseFloat(b.yieldRate) - parseFloat(a.yieldRate))
        .slice(0, 1);

      if (highYieldAlternatives.length > 0) {
        const alternative = highYieldAlternatives[0];
        recommendations.push({
          type: 'rebalance',
          propertyId: alternative.propertyId,
          propertyName: alternative.propertyName,
          amount: '10000',
          confidence: 78,
          reasoning: `Yield optimization: Switch from low-yield properties to ${alternative.propertyName} (${alternative.yieldRate}% yield)`,
          expectedReturn: this.calculateExpectedReturn(alternative.yieldRate, '10000'),
          riskLevel: 'medium',
          timeframe: '3-6 months'
        });
      }
    }

    // 3. Market Trend Analysis
    const bullishTrends = trends.filter(t => t.trendType === 'bullish' && t.confidence > 70);
    bullishTrends.forEach(trend => {
      if (trend.propertyId) {
        const property = marketData.find(p => p.propertyId === trend.propertyId);
        if (property) {
          recommendations.push({
            type: 'buy',
            propertyId: property.propertyId,
            propertyName: property.propertyName,
            amount: '7500',
            confidence: trend.confidence,
            reasoning: `Market trend analysis: ${property.propertyName} showing strong bullish momentum with ${trend.confidence}% confidence`,
            expectedReturn: this.calculateTrendBasedReturn(trend.volumeChange, '7500'),
            riskLevel: 'medium',
            timeframe: '1-3 months'
          });
        }
      }
    });

    // 4. Yield Claiming Opportunities
    const yieldClaimable = portfolio.properties.filter(p => parseFloat(p.totalYieldClaimed) > 0);
    if (yieldClaimable.length > 0) {
      recommendations.push({
        type: 'claim_yield',
        amount: portfolio.totalYield,
        confidence: 95,
        reasoning: `Yield claiming: You have ${portfolio.totalYield} ETH in unclaimed yield across ${yieldClaimable.length} properties`,
        expectedReturn: portfolio.totalYield,
        riskLevel: 'low',
        timeframe: 'immediate'
      });
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  private generateInvestmentRecommendations(portfolio: UserPortfolioData, marketData: PropertyPerformance[], amount: string, riskTolerance: string): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    const investmentAmount = parseFloat(amount);

    // Filter properties based on risk tolerance
    let suitableProperties = marketData;
    
    if (riskTolerance === 'conservative') {
      suitableProperties = marketData.filter(p => parseFloat(p.yieldRate) >= 4 && parseFloat(p.yieldRate) <= 6);
    } else if (riskTolerance === 'balanced') {
      suitableProperties = marketData.filter(p => parseFloat(p.yieldRate) >= 5 && parseFloat(p.yieldRate) <= 8);
    } else { // aggressive
      suitableProperties = marketData.filter(p => parseFloat(p.yieldRate) >= 7);
    }

    // Sort by yield and diversification benefit
    suitableProperties = suitableProperties
      .map(p => ({
        ...p,
        diversificationBonus: portfolio.properties.some(up => up.propertyId === p.propertyId) ? 0 : 2
      }))
      .sort((a, b) => (parseFloat(b.yieldRate) + b.diversificationBonus) - (parseFloat(a.yieldRate) + a.diversificationBonus));

    // Generate recommendations
    if (investmentAmount >= 15000) {
      // Large investment - diversify across 3 properties
      const top3 = suitableProperties.slice(0, 3);
      const allocation = [0.5, 0.3, 0.2]; // 50%, 30%, 20%
      
      top3.forEach((property, index) => {
        const allocatedAmount = investmentAmount * allocation[index];
        recommendations.push({
          type: 'buy',
          propertyId: property.propertyId,
          propertyName: property.propertyName,
          amount: allocatedAmount.toString(),
          confidence: 85 - (index * 5),
          reasoning: `Diversified allocation: ${(allocation[index] * 100)}% of investment in ${property.propertyName} (${property.yieldRate}% yield)`,
          expectedReturn: this.calculateExpectedReturn(property.yieldRate, allocatedAmount.toString()),
          riskLevel: this.mapRiskTolerance(riskTolerance),
          timeframe: '6-12 months'
        });
      });
    } else {
      // Smaller investment - focus on 1-2 properties
      const top2 = suitableProperties.slice(0, 2);
      const allocation = investmentAmount >= 8000 ? [0.7, 0.3] : [1.0]; // Split if enough, otherwise single property
      
      top2.slice(0, allocation.length).forEach((property, index) => {
        const allocatedAmount = investmentAmount * allocation[index];
        recommendations.push({
          type: 'buy',
          propertyId: property.propertyId,
          propertyName: property.propertyName,
          amount: allocatedAmount.toString(),
          confidence: 88 - (index * 3),
          reasoning: `Focused investment: ${property.propertyName} offers ${property.yieldRate}% yield with ${riskTolerance} risk profile`,
          expectedReturn: this.calculateExpectedReturn(property.yieldRate, allocatedAmount.toString()),
          riskLevel: this.mapRiskTolerance(riskTolerance),
          timeframe: '3-9 months'
        });
      });
    }

    return recommendations;
  }

  // ========================================
  // RISK ASSESSMENT ENGINE
  // ========================================

  private assessRisk(portfolio: UserPortfolioData, marketData: PropertyPerformance[]): RiskAssessment {
    const diversificationRisk = this.calculateDiversificationRisk(portfolio);
    const concentrationRisk = this.calculateConcentrationRisk(portfolio);
    const liquidityRisk = this.calculateLiquidityRisk(portfolio, marketData);
    const marketRisk = this.calculateMarketRisk(portfolio, marketData);

    const overallRisk = this.calculateOverallRisk(diversificationRisk, concentrationRisk, liquidityRisk, marketRisk);
    const recommendations = this.generateRiskRecommendations(diversificationRisk, concentrationRisk, liquidityRisk, marketRisk);

    return {
      overallRisk,
      diversificationRisk,
      concentrationRisk,
      liquidityRisk,
      marketRisk,
      recommendations
    };
  }

  private calculateDiversificationRisk(portfolio: UserPortfolioData): number {
    const numProperties = portfolio.properties.length;
    if (numProperties >= 5) return 20; // Low risk
    if (numProperties >= 3) return 50; // Medium risk
    return 80; // High risk
  }

  private calculateConcentrationRisk(portfolio: UserPortfolioData): number {
    const totalValue = parseFloat(portfolio.totalValue);
    if (totalValue === 0) return 0;

    const maxConcentration = Math.max(...portfolio.properties.map(p => parseFloat(p.currentValue) / totalValue));
    return Math.min(maxConcentration * 100, 100);
  }

  private calculateLiquidityRisk(portfolio: UserPortfolioData, marketData: PropertyPerformance[]): number {
    // Simplified liquidity risk based on market cap and volume
    const avgLiquidity = portfolio.properties.reduce((sum, p) => {
      const market = marketData.find(m => m.propertyId === p.propertyId);
      const volume24h = parseFloat(market?.volume24h || '0');
      const marketCap = parseFloat(market?.marketCap || '1');
      return sum + (volume24h / marketCap);
    }, 0) / portfolio.properties.length;

    return Math.max(0, Math.min(100, (1 - avgLiquidity) * 100));
  }

  private calculateMarketRisk(portfolio: UserPortfolioData, marketData: PropertyPerformance[]): number {
    // Simplified market risk based on price volatility
    const avgVolatility = portfolio.properties.reduce((sum, p) => {
      const market = marketData.find(m => m.propertyId === p.propertyId);
      const priceChange = Math.abs(parseFloat(market?.priceChange24h || '0'));
      return sum + priceChange;
    }, 0) / portfolio.properties.length;

    return Math.min(avgVolatility * 10, 100);
  }

  private calculateOverallRisk(diversification: number, concentration: number, liquidity: number, market: number): 'low' | 'medium' | 'high' {
    const avgRisk = (diversification + concentration + liquidity + market) / 4;
    if (avgRisk < 30) return 'low';
    if (avgRisk < 60) return 'medium';
    return 'high';
  }

  private generateRiskRecommendations(diversification: number, concentration: number, liquidity: number, market: number): string[] {
    const recommendations: string[] = [];

    if (diversification > 60) {
      recommendations.push('Increase diversification by investing in more properties across different sectors');
    }
    if (concentration > 50) {
      recommendations.push('Reduce concentration risk by rebalancing your largest positions');
    }
    if (liquidity > 70) {
      recommendations.push('Consider more liquid properties with higher trading volumes');
    }
    if (market > 60) {
      recommendations.push('Market volatility is high - consider defensive positions or hedging strategies');
    }

    return recommendations;
  }

  // ========================================
  // OPTIMIZATION ENGINES
  // ========================================

  private generateOptimizations(portfolio: UserPortfolioData, marketData: PropertyPerformance[]): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Yield optimization
    const yieldSuggestions = this.analyzeYieldOptimization(portfolio, marketData);
    suggestions.push(...yieldSuggestions);

    // Rebalancing suggestions
    if (portfolio.properties.length > 1) {
      suggestions.push({
        type: 'rebalance',
        description: 'Rebalance portfolio to optimal allocation based on risk-adjusted returns',
        impact: 'Potential 2-5% improvement in risk-adjusted returns',
        priority: 'medium',
        estimatedGain: this.calculateRebalanceGain(portfolio, marketData)
      });
    }

    // Diversification suggestions
    if (portfolio.properties.length < 5) {
      suggestions.push({
        type: 'diversify',
        description: `Add ${5 - portfolio.properties.length} more properties to achieve optimal diversification`,
        impact: 'Reduce portfolio risk by 15-25%',
        priority: 'high',
        estimatedGain: '15-25% risk reduction'
      });
    }

    return suggestions.sort((a, b) => this.priorityScore(b.priority) - this.priorityScore(a.priority));
  }

  private analyzeYieldOptimization(portfolio: UserPortfolioData, marketData: PropertyPerformance[]): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const currentYield = parseFloat(portfolio.portfolioYieldRate);
    const marketAvgYield = marketData.reduce((sum, p) => sum + parseFloat(p.yieldRate), 0) / marketData.length;

    if (currentYield < marketAvgYield - 1) {
      suggestions.push({
        type: 'yield_optimization',
        description: `Your portfolio yield (${currentYield.toFixed(2)}%) is below market average (${marketAvgYield.toFixed(2)}%)`,
        impact: `Potential to increase yield by ${(marketAvgYield - currentYield).toFixed(2)}%`,
        priority: 'high',
        estimatedGain: `${((marketAvgYield - currentYield) * parseFloat(portfolio.totalValue) / 100).toFixed(0)} ETH annually`
      });
    }

    return suggestions;
  }

  private calculateRebalanceActions(portfolio: UserPortfolioData, targetAllocation: { [propertyId: string]: number }): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    const totalValue = parseFloat(portfolio.totalValue);

    Object.entries(targetAllocation).forEach(([propertyId, targetPercent]) => {
      const currentProperty = portfolio.properties.find(p => p.propertyId === propertyId);
      const currentValue = currentProperty ? parseFloat(currentProperty.currentValue) : 0;
      const currentPercent = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
      const targetValue = totalValue * (targetPercent / 100);
      const difference = targetValue - currentValue;

      if (Math.abs(difference) > totalValue * 0.05) { // Only rebalance if difference > 5%
        recommendations.push({
          type: difference > 0 ? 'buy' : 'sell',
          propertyId,
          propertyName: this.getPropertyName(propertyId),
          amount: Math.abs(difference).toString(),
          confidence: 80,
          reasoning: `Rebalancing: Adjust ${this.getPropertyName(propertyId)} from ${currentPercent.toFixed(1)}% to ${targetPercent}% allocation`,
          expectedReturn: this.calculateRebalanceReturn(difference, targetPercent),
          riskLevel: 'low',
          timeframe: '1-2 weeks'
        });
      }
    });

    return recommendations;
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  private calculateExpectedReturn(yieldRate: string, amount: string): string {
    const yieldPercent = parseFloat(yieldRate) / 100;
    const investment = parseFloat(amount);
    return (investment * yieldPercent).toFixed(2);
  }

  private calculateTrendBasedReturn(volumeChange: string, amount: string): string {
    const change = parseFloat(volumeChange) / 100;
    const investment = parseFloat(amount);
    return (investment * Math.abs(change) * 0.1).toFixed(2); // Conservative estimate
  }

  private calculateRebalanceGain(portfolio: UserPortfolioData, marketData: PropertyPerformance[]): string {
    // Simplified calculation
    const currentYield = parseFloat(portfolio.portfolioYieldRate);
    const potentialImprovement = currentYield * 0.1; // 10% improvement estimate
    return `${potentialImprovement.toFixed(2)}% yield improvement`;
  }

  private calculateRebalanceReturn(difference: number, targetPercent: number): string {
    return (Math.abs(difference) * 0.05).toFixed(2); // 5% expected return from rebalancing
  }

  private mapRiskTolerance(tolerance: string): 'low' | 'medium' | 'high' {
    switch (tolerance) {
      case 'conservative': return 'low';
      case 'balanced': return 'medium';
      case 'aggressive': return 'high';
      default: return 'medium';
    }
  }

  private priorityScore(priority: string): number {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
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
}

// Export singleton instance
const portfolioAgent = new PortfolioAgent();

export { portfolioAgent, PortfolioAgent };
export type { PortfolioAnalysis, AIRecommendation, RiskAssessment, OptimizationSuggestion };