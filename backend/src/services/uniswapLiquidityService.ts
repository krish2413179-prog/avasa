import { ethers } from 'ethers';
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core';
import { Pool, Route, Trade, SwapRouter, SwapOptions } from '@uniswap/v3-sdk';
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';

// Uniswap V3 Contract Addresses on Base Sepolia
const UNISWAP_ADDRESSES = {
  SWAP_ROUTER: "0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4", // SwapRouter on Base Sepolia
  FACTORY: "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24", // Factory on Base Sepolia
  POSITION_MANAGER: "0x27F971cb582BF9E50F397e4d29a5C7A34f11faA2", // NonfungiblePositionManager
  QUOTER: "0xC5290058841028F1614F3A6F0F5816cAd0df5E27" // Quoter V2
};

// Token addresses on Base Sepolia
const TOKENS = {
  USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  WETH: "0x4200000000000000000000000000000000000006"
};

export interface PoolInfo {
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  sqrtPriceX96: string;
  liquidity: string;
  tick: number;
}

export interface SwapQuote {
  amountOut: string;
  priceImpact: string;
  gasEstimate: string;
  route: string[];
}

export class UniswapLiquidityService {
  private provider: ethers.providers.Provider;
  private signer?: ethers.Signer;
  private chainId: number;

  constructor(rpcUrl: string, privateKey?: string, chainId: number = 84532) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.chainId = chainId;
    
    if (privateKey) {
      this.signer = new ethers.Wallet(privateKey, this.provider);
    }
  }

  /**
   * Create a Uniswap V3 pool for a property token
   */
  async createPropertyPool(
    propertyTokenAddress: string,
    initialPrice: string, // Price in USDC per property token
    feeAmount: number = 3000 // 0.3% fee tier
  ): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer required for pool creation');
    }

    try {
      // Factory contract for pool creation
      const factoryABI = [
        "function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool)"
      ];
      
      const factory = new ethers.Contract(UNISWAP_ADDRESSES.FACTORY, factoryABI, this.signer);
      
      // Create pool (USDC/PropertyToken)
      const tx = await factory.createPool(
        TOKENS.USDC,
        propertyTokenAddress,
        feeAmount
      );
      
      const receipt = await tx.wait();
      
      // Extract pool address from logs
      const poolAddress = receipt.logs[0].address; // Simplified - would need proper event parsing
      
      console.log(`Created Uniswap V3 pool: ${poolAddress}`);
      return poolAddress;
    } catch (error) {
      console.error('Error creating Uniswap pool:', error);
      throw error;
    }
  }

  /**
   * Add initial liquidity to a property token pool
   */
  async addInitialLiquidity(
    poolAddress: string,
    propertyTokenAddress: string,
    usdcAmount: string,
    propertyTokenAmount: string,
    minPrice: string,
    maxPrice: string
  ): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer required for adding liquidity');
    }

    try {
      const positionManagerABI = [
        `function mint((
          address token0,
          address token1,
          uint24 fee,
          int24 tickLower,
          int24 tickUpper,
          uint256 amount0Desired,
          uint256 amount1Desired,
          uint256 amount0Min,
          uint256 amount1Min,
          address recipient,
          uint256 deadline
        )) external payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)`
      ];

      const positionManager = new ethers.Contract(
        UNISWAP_ADDRESSES.POSITION_MANAGER,
        positionManagerABI,
        this.signer
      );

      // Calculate tick range based on min/max prices
      const tickLower = this.priceToTick(minPrice);
      const tickUpper = this.priceToTick(maxPrice);

      const mintParams = {
        token0: TOKENS.USDC < propertyTokenAddress ? TOKENS.USDC : propertyTokenAddress,
        token1: TOKENS.USDC < propertyTokenAddress ? propertyTokenAddress : TOKENS.USDC,
        fee: 3000,
        tickLower,
        tickUpper,
        amount0Desired: ethers.utils.parseUnits(usdcAmount, 6), // USDC has 6 decimals
        amount1Desired: ethers.utils.parseEther(propertyTokenAmount),
        amount0Min: 0,
        amount1Min: 0,
        recipient: await this.signer.getAddress(),
        deadline: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      };

      const tx = await positionManager.mint(mintParams);
      const receipt = await tx.wait();
      
      console.log(`Added liquidity to pool: ${poolAddress}`);
      return receipt.hash;
    } catch (error) {
      console.error('Error adding liquidity:', error);
      throw error;
    }
  }

  /**
   * Get quote for swapping USDC to property tokens
   */
  async getSwapQuote(
    propertyTokenAddress: string,
    usdcAmountIn: string,
    slippageTolerance: number = 0.5 // 0.5%
  ): Promise<SwapQuote> {
    try {
      const quoterABI = [
        `function quoteExactInputSingle((
          address tokenIn,
          address tokenOut,
          uint24 fee,
          uint256 amountIn,
          uint160 sqrtPriceLimitX96
        )) external returns (uint256 amountOut)`
      ];

      const quoter = new ethers.Contract(UNISWAP_ADDRESSES.QUOTER, quoterABI, this.provider);

      const quoteParams = {
        tokenIn: TOKENS.USDC,
        tokenOut: propertyTokenAddress,
        fee: 3000,
        amountIn: ethers.parseUnits(usdcAmountIn, 6),
        sqrtPriceLimitX96: 0
      };

      const amountOut = await quoter.quoteExactInputSingle.staticCall(quoteParams);
      
      // Calculate price impact (simplified)
      const priceImpact = "0.1"; // Would calculate actual price impact in production
      
      return {
        amountOut: ethers.utils.formatEther(amountOut),
        priceImpact,
        gasEstimate: "150000", // Estimated gas
        route: [TOKENS.USDC, propertyTokenAddress]
      };
    } catch (error) {
      console.error('Error getting swap quote:', error);
      throw error;
    }
  }

  /**
   * Execute swap from USDC to property tokens
   */
  async swapUSDCForPropertyTokens(
    propertyTokenAddress: string,
    usdcAmountIn: string,
    minAmountOut: string,
    recipient: string
  ): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer required for swapping');
    }

    try {
      const swapRouterABI = [
        `function exactInputSingle((
          address tokenIn,
          address tokenOut,
          uint24 fee,
          address recipient,
          uint256 deadline,
          uint256 amountIn,
          uint256 amountOutMinimum,
          uint160 sqrtPriceLimitX96
        )) external payable returns (uint256 amountOut)`
      ];

      const swapRouter = new ethers.Contract(UNISWAP_ADDRESSES.SWAP_ROUTER, swapRouterABI, this.signer);

      const swapParams = {
        tokenIn: TOKENS.USDC,
        tokenOut: propertyTokenAddress,
        fee: 3000,
        recipient,
        deadline: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
        amountIn: ethers.utils.parseUnits(usdcAmountIn, 6),
        amountOutMinimum: ethers.utils.parseEther(minAmountOut),
        sqrtPriceLimitX96: 0
      };

      const tx = await swapRouter.exactInputSingle(swapParams);
      const receipt = await tx.wait();
      
      console.log(`Swap executed: ${receipt.hash}`);
      return receipt.hash;
    } catch (error) {
      console.error('Error executing swap:', error);
      throw error;
    }
  }

  /**
   * Execute swap from property tokens to USDC
   */
  async swapPropertyTokensForUSDC(
    propertyTokenAddress: string,
    tokenAmountIn: string,
    minUSDCOut: string,
    recipient: string
  ): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer required for swapping');
    }

    try {
      const swapRouterABI = [
        `function exactInputSingle((
          address tokenIn,
          address tokenOut,
          uint24 fee,
          address recipient,
          uint256 deadline,
          uint256 amountIn,
          uint256 amountOutMinimum,
          uint160 sqrtPriceLimitX96
        )) external payable returns (uint256 amountOut)`
      ];

      const swapRouter = new ethers.Contract(UNISWAP_ADDRESSES.SWAP_ROUTER, swapRouterABI, this.signer);

      const swapParams = {
        tokenIn: propertyTokenAddress,
        tokenOut: TOKENS.USDC,
        fee: 3000,
        recipient,
        deadline: Math.floor(Date.now() / 1000) + 1800,
        amountIn: ethers.utils.parseEther(tokenAmountIn),
        amountOutMinimum: ethers.utils.parseUnits(minUSDCOut, 6),
        sqrtPriceLimitX96: 0
      };

      const tx = await swapRouter.exactInputSingle(swapParams);
      const receipt = await tx.wait();
      
      return receipt.hash;
    } catch (error) {
      console.error('Error executing swap:', error);
      throw error;
    }
  }

  /**
   * Get pool information
   */
  async getPoolInfo(poolAddress: string): Promise<PoolInfo> {
    try {
      const pool = new ethers.Contract(poolAddress, IUniswapV3PoolABI, this.provider);

      const [token0, token1, fee, tickSpacing, slot0, liquidity] = await Promise.all([
        pool.token0(),
        pool.token1(),
        pool.fee(),
        pool.tickSpacing(),
        pool.slot0(),
        pool.liquidity()
      ]);

      return {
        token0,
        token1,
        fee: Number(fee),
        tickSpacing: Number(tickSpacing),
        sqrtPriceX96: slot0.sqrtPriceX96.toString(),
        liquidity: liquidity.toString(),
        tick: Number(slot0.tick)
      };
    } catch (error) {
      console.error('Error getting pool info:', error);
      throw error;
    }
  }

  /**
   * Calculate current price from pool
   */
  calculatePriceFromSqrtPriceX96(sqrtPriceX96: string, decimals0: number, decimals1: number): string {
    const sqrtPrice = parseFloat(sqrtPriceX96);
    const price = (sqrtPrice / (2 ** 96)) ** 2;
    const adjustedPrice = price * (10 ** (decimals0 - decimals1));
    return adjustedPrice.toFixed(6);
  }

  /**
   * Convert price to tick (simplified)
   */
  private priceToTick(price: string): number {
    // Simplified tick calculation - would use proper math in production
    const priceFloat = parseFloat(price);
    return Math.floor(Math.log(priceFloat) / Math.log(1.0001));
  }

  /**
   * Setup complete liquidity infrastructure for a property
   */
  async setupPropertyLiquidity(
    propertyTokenAddress: string,
    initialUSDCLiquidity: string,
    initialTokenLiquidity: string,
    targetPrice: string
  ): Promise<{
    poolAddress: string;
    liquidityTxHash: string;
    poolInfo: PoolInfo;
  }> {
    try {
      // 1. Create pool
      const poolAddress = await this.createPropertyPool(propertyTokenAddress, targetPrice);
      
      // 2. Add initial liquidity
      const minPrice = (parseFloat(targetPrice) * 0.8).toString(); // 20% below target
      const maxPrice = (parseFloat(targetPrice) * 1.2).toString(); // 20% above target
      
      const liquidityTxHash = await this.addInitialLiquidity(
        poolAddress,
        propertyTokenAddress,
        initialUSDCLiquidity,
        initialTokenLiquidity,
        minPrice,
        maxPrice
      );
      
      // 3. Get pool info
      const poolInfo = await this.getPoolInfo(poolAddress);
      
      return {
        poolAddress,
        liquidityTxHash,
        poolInfo
      };
    } catch (error) {
      console.error('Error setting up property liquidity:', error);
      throw error;
    }
  }
}

export const uniswapLiquidityService = new UniswapLiquidityService(
  process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  process.env.PRIVATE_KEY
);