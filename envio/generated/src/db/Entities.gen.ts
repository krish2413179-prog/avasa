/* TypeScript file generated from Entities.res by genType. */

/* eslint-disable */
/* tslint:disable */

export type id = string;

export type whereOperations<entity,fieldType> = {
  readonly eq: (_1:fieldType) => Promise<entity[]>; 
  readonly gt: (_1:fieldType) => Promise<entity[]>; 
  readonly lt: (_1:fieldType) => Promise<entity[]>
};

export type AIRecommendation_t = {
  readonly amount: (undefined | bigint); 
  readonly confidence: number; 
  readonly executed: boolean; 
  readonly expectedReturn: (undefined | bigint); 
  readonly id: id; 
  readonly propertyId: (undefined | string); 
  readonly reasoning: string; 
  readonly recommendationType: string; 
  readonly riskLevel: string; 
  readonly timestamp: bigint; 
  readonly user: string
};

export type AIRecommendation_indexedFieldOperations = {};

export type DailyMetrics_t = {
  readonly activeStreams: number; 
  readonly date: string; 
  readonly id: id; 
  readonly newInvestors: number; 
  readonly totalLendingVolume: bigint; 
  readonly totalSwapVolume: bigint; 
  readonly totalTransactions: number; 
  readonly totalVolume: bigint; 
  readonly totalYieldClaimed: bigint; 
  readonly uniqueUsers: number
};

export type DailyMetrics_indexedFieldOperations = {};

export type LendingTransaction_t = {
  readonly action: string; 
  readonly amount: bigint; 
  readonly blockNumber: bigint; 
  readonly borrowRate: (undefined | bigint); 
  readonly id: id; 
  readonly interestRateMode: (undefined | number); 
  readonly onBehalfOf: (undefined | string); 
  readonly referralCode: (undefined | number); 
  readonly repayer: (undefined | string); 
  readonly reserve: string; 
  readonly timestamp: bigint; 
  readonly transactionHash: string; 
  readonly useATokens: (undefined | boolean); 
  readonly user: string
};

export type LendingTransaction_indexedFieldOperations = {};

export type LivePortfolio_t = {
  readonly diversificationScore: number; 
  readonly id: id; 
  readonly lastUpdated: bigint; 
  readonly portfolioYieldRate: bigint; 
  readonly riskScore: number; 
  readonly totalValue: bigint; 
  readonly totalYield: bigint; 
  readonly user: string
};

export type LivePortfolio_indexedFieldOperations = {};

export type MarketTrend_t = {
  readonly confidence: number; 
  readonly id: id; 
  readonly priceDirection: string; 
  readonly propertyId: (undefined | string); 
  readonly timeframe: string; 
  readonly timestamp: bigint; 
  readonly trendType: string; 
  readonly volumeChange: bigint; 
  readonly yieldTrend: string
};

export type MarketTrend_indexedFieldOperations = {};

export type PropertyAnalytics_t = {
  readonly averageYieldRate: bigint; 
  readonly id: id; 
  readonly lastActivity: bigint; 
  readonly propertyAddress: string; 
  readonly propertyName: string; 
  readonly totalInvestors: number; 
  readonly totalSharesSold: bigint; 
  readonly totalValueLocked: bigint; 
  readonly totalYieldDistributed: bigint
};

export type PropertyAnalytics_indexedFieldOperations = {};

export type PropertyPerformance_t = {
  readonly currentPrice: bigint; 
  readonly id: id; 
  readonly lastUpdated: bigint; 
  readonly marketCap: bigint; 
  readonly priceChange24h: bigint; 
  readonly propertyId: string; 
  readonly propertyName: string; 
  readonly totalInvestors: number; 
  readonly volume24h: bigint; 
  readonly yieldRate: bigint
};

export type PropertyPerformance_indexedFieldOperations = {};

export type PropertyTransaction_t = {
  readonly action: string; 
  readonly amount: (undefined | bigint); 
  readonly blockNumber: bigint; 
  readonly cost: (undefined | bigint); 
  readonly id: id; 
  readonly investor: string; 
  readonly propertyAddress: string; 
  readonly propertyId: string; 
  readonly propertyName: string; 
  readonly shares: (undefined | bigint); 
  readonly timestamp: bigint; 
  readonly transactionHash: string
};

export type PropertyTransaction_indexedFieldOperations = {};

export type PropertyUpdate_t = {
  readonly blockNumber: bigint; 
  readonly id: id; 
  readonly pricePerShare: bigint; 
  readonly propertyId: string; 
  readonly propertyName: string; 
  readonly timestamp: bigint; 
  readonly transactionHash: string
};

export type PropertyUpdate_indexedFieldOperations = {};

export type StreamTransaction_t = {
  readonly blockNumber: bigint; 
  readonly flowRate: bigint; 
  readonly id: id; 
  readonly receiver: string; 
  readonly sender: string; 
  readonly timestamp: bigint; 
  readonly token: string; 
  readonly totalReceiverFlowRate: bigint; 
  readonly totalSenderFlowRate: bigint; 
  readonly transactionHash: string
};

export type StreamTransaction_indexedFieldOperations = {};

export type SwapTransaction_t = {
  readonly amount0: bigint; 
  readonly amount1: bigint; 
  readonly blockNumber: bigint; 
  readonly id: id; 
  readonly liquidity: bigint; 
  readonly recipient: string; 
  readonly sender: string; 
  readonly sqrtPriceX96: bigint; 
  readonly tick: number; 
  readonly timestamp: bigint; 
  readonly transactionHash: string
};

export type SwapTransaction_indexedFieldOperations = {};

export type TransferTransaction_t = {
  readonly blockNumber: bigint; 
  readonly from: string; 
  readonly id: id; 
  readonly propertyAddress: string; 
  readonly propertyId: string; 
  readonly propertyName: string; 
  readonly timestamp: bigint; 
  readonly to: string; 
  readonly transactionHash: string; 
  readonly value: bigint
};

export type TransferTransaction_indexedFieldOperations = {};

export type UserAnalytics_t = {
  readonly id: id; 
  readonly lastActivity: bigint; 
  readonly totalBorrowed: bigint; 
  readonly totalInvested: bigint; 
  readonly totalLent: bigint; 
  readonly totalPropertiesOwned: number; 
  readonly totalStreamsReceived: bigint; 
  readonly totalStreamsSent: bigint; 
  readonly totalSwapVolume: bigint; 
  readonly totalYieldEarned: bigint
};

export type UserAnalytics_indexedFieldOperations = {};

export type UserPortfolio_t = {
  readonly id: id; 
  readonly lastUpdated: bigint; 
  readonly propertyId: string; 
  readonly totalInvested: bigint; 
  readonly totalShares: bigint; 
  readonly totalYieldClaimed: bigint; 
  readonly user: string
};

export type UserPortfolio_indexedFieldOperations = {};

export type UserPreferences_t = {
  readonly autoReinvestYield: boolean; 
  readonly id: id; 
  readonly lastUpdated: bigint; 
  readonly maxInvestmentPerProperty: bigint; 
  readonly notificationSettings: string; 
  readonly preferredPropertyTypesJson: string; 
  readonly preferredRiskLevel: string; 
  readonly user: string
};

export type UserPreferences_indexedFieldOperations = {};

export type YieldTransaction_t = {
  readonly action: string; 
  readonly amount: bigint; 
  readonly blockNumber: bigint; 
  readonly id: id; 
  readonly investor: string; 
  readonly propertyAddress: string; 
  readonly propertyId: string; 
  readonly propertyName: string; 
  readonly timestamp: bigint; 
  readonly transactionHash: string
};

export type YieldTransaction_indexedFieldOperations = {};
