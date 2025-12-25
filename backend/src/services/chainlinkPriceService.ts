import { ethers } from 'ethers';

// Chainlink Price Feed ABI (simplified)
const PRICE_FEED_ABI = [
  {
    "inputs": [],
    "name": "latestRoundData",
    "outputs": [
      { "internalType": "uint80", "name": "roundId", "type": "uint80" },
      { "internalType": "int256", "name": "price", "type": "int256" },
      { "internalType": "uint256", "name": "startedAt", "type": "uint256" },
      { "internalType": "uint256", "name": "updatedAt", "type": "uint256" },
      { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// Base Sepolia Chainlink Price Feed Addresses
const PRICE_FEEDS = {
  ETH_USD: "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1", // ETH/USD on Base Sepolia
  BTC_USD: "0x0FB99723Aee6f420beAD13e6bFb79a7E6f7822f0", // BTC/USD on Base Sepolia
  // Add more feeds as needed
};

export interface PriceData {
  price: string;
  decimals: number;
  updatedAt: number;
  roundId: string;
}

export class ChainlinkPriceService {
  private provider: ethers.providers.Provider;
  private priceFeeds: Map<string, ethers.Contract>;

  constructor(rpcUrl: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.priceFeeds = new Map();
    
    // Initialize price feed contracts
    Object.entries(PRICE_FEEDS).forEach(([pair, address]) => {
      this.priceFeeds.set(pair, new ethers.Contract(address, PRICE_FEED_ABI, this.provider));
    });
  }

  /**
   * Get latest price for a trading pair
   */
  async getLatestPrice(pair: string): Promise<PriceData> {
    try {
      const priceFeed = this.priceFeeds.get(pair);
      if (!priceFeed) {
        throw new Error(`Price feed not found for pair: ${pair}`);
      }

      const [roundId, price, startedAt, updatedAt, answeredInRound] = await priceFeed.latestRoundData();
      const decimals = await priceFeed.decimals();

      return {
        price: ethers.utils.formatUnits(price, decimals),
        decimals: Number(decimals),
        updatedAt: Number(updatedAt),
        roundId: roundId.toString()
      };
    } catch (error) {
      console.error(`Error fetching price for ${pair}:`, error);
      throw error;
    }
  }

  /**
   * Get ETH price in USD
   */
  async getETHPrice(): Promise<number> {
    const priceData = await this.getLatestPrice('ETH_USD');
    return parseFloat(priceData.price);
  }

  /**
   * Convert ETH amount to USD
   */
  async convertETHToUSD(ethAmount: string): Promise<string> {
    const ethPrice = await this.getETHPrice();
    const ethValue = parseFloat(ethAmount);
    return (ethValue * ethPrice).toFixed(2);
  }

  /**
   * Convert USD amount to ETH
   */
  async convertUSDToETH(usdAmount: string): Promise<string> {
    const ethPrice = await this.getETHPrice();
    const usdValue = parseFloat(usdAmount);
    return (usdValue / ethPrice).toFixed(6);
  }

  /**
   * Calculate property share price in USD
   */
  async calculateSharePriceUSD(sharesPriceETH: string): Promise<string> {
    return await this.convertETHToUSD(sharesPriceETH);
  }

  /**
   * Get multiple prices at once
   */
  async getMultiplePrices(pairs: string[]): Promise<Map<string, PriceData>> {
    const prices = new Map<string, PriceData>();
    
    const pricePromises = pairs.map(async (pair) => {
      try {
        const priceData = await this.getLatestPrice(pair);
        prices.set(pair, priceData);
      } catch (error) {
        console.error(`Failed to get price for ${pair}:`, error);
      }
    });

    await Promise.all(pricePromises);
    return prices;
  }

  /**
   * Check if price data is stale (older than 1 hour)
   */
  isPriceStale(updatedAt: number): boolean {
    const oneHourAgo = Math.floor(Date.now() / 1000) - 3600;
    return updatedAt < oneHourAgo;
  }

  /**
   * Get price with staleness check
   */
  async getLatestPriceWithCheck(pair: string): Promise<PriceData & { isStale: boolean }> {
    const priceData = await this.getLatestPrice(pair);
    const isStale = this.isPriceStale(priceData.updatedAt);
    
    return {
      ...priceData,
      isStale
    };
  }
}

/**
 * Property Valuation Oracle - Updates property values based on market data
 */
export class PropertyValuationOracle {
  private chainlinkService: ChainlinkPriceService;
  private provider: ethers.providers.Provider;

  constructor(rpcUrl: string) {
    this.chainlinkService = new ChainlinkPriceService(rpcUrl);
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Calculate dynamic property valuation based on market conditions
   */
  async calculatePropertyValuation(
    baseValuation: string,
    location: string,
    propertyType: string
  ): Promise<{
    currentValuation: string;
    marketMultiplier: number;
    lastUpdated: number;
  }> {
    try {
      // Get ETH price for conversion
      const ethPrice = await this.chainlinkService.getETHPrice();
      
      // Market multipliers based on location and type
      const locationMultipliers: Record<string, number> = {
        'New York': 1.15,
        'Miami': 1.08,
        'Austin': 1.12,
        'Seattle': 1.06,
        'Denver': 1.04,
        'Chicago': 1.02,
        'Los Angeles': 1.10,
        'Phoenix': 0.98,
        'Boston': 1.07,
        'Nashville': 1.01
      };

      const typeMultipliers: Record<string, number> = {
        'residential': 1.0,
        'commercial': 1.05,
        'industrial': 0.95,
        'hospitality': 1.02,
        'mixed_use': 1.03
      };

      // Calculate market-adjusted valuation
      const locationMultiplier = locationMultipliers[location] || 1.0;
      const typeMultiplier = typeMultipliers[propertyType] || 1.0;
      const marketMultiplier = locationMultiplier * typeMultiplier;

      // Apply market conditions (simulate market volatility)
      const marketCondition = this.getMarketCondition();
      const finalMultiplier = marketMultiplier * marketCondition;

      const baseValue = parseFloat(baseValuation);
      const currentValuation = (baseValue * finalMultiplier).toFixed(0);

      return {
        currentValuation,
        marketMultiplier: finalMultiplier,
        lastUpdated: Math.floor(Date.now() / 1000)
      };
    } catch (error) {
      console.error('Error calculating property valuation:', error);
      throw error;
    }
  }

  /**
   * Simulate market conditions (in production, this would use real market data)
   */
  private getMarketCondition(): number {
    // Simulate market volatility between 0.95 and 1.05
    const volatility = 0.05;
    const randomFactor = (Math.random() - 0.5) * 2 * volatility;
    return 1 + randomFactor;
  }

  /**
   * Update property share price based on current valuation
   */
  async updateSharePrice(
    currentValuation: string,
    totalShares: number
  ): Promise<string> {
    const valuationUSD = parseFloat(currentValuation);
    const shareValueUSD = valuationUSD / totalShares;
    
    // Convert to ETH
    const shareValueETH = await this.chainlinkService.convertUSDToETH(shareValueUSD.toString());
    return shareValueETH;
  }

  /**
   * Get comprehensive market data for a property
   */
  async getPropertyMarketData(
    baseValuation: string,
    location: string,
    propertyType: string,
    totalShares: number
  ) {
    const valuation = await this.calculatePropertyValuation(baseValuation, location, propertyType);
    const sharePrice = await this.updateSharePrice(valuation.currentValuation, totalShares);
    const ethPrice = await this.chainlinkService.getETHPrice();

    return {
      ...valuation,
      sharePrice: {
        eth: sharePrice,
        usd: await this.chainlinkService.convertETHToUSD(sharePrice)
      },
      ethPrice,
      totalShares,
      marketCap: {
        eth: (parseFloat(sharePrice) * totalShares).toFixed(6),
        usd: valuation.currentValuation
      }
    };
  }
}

export const chainlinkPriceService = new ChainlinkPriceService(
  process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'
);

export const propertyValuationOracle = new PropertyValuationOracle(
  process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'
);