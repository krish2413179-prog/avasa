import { SwapAgent } from './swapAgent'
import { LendAgent } from './lendAgent'
import { SessionKeyManager } from './sessionKeyManager'
import { advancedPermissionManager } from '../permissions/advancedPermissions'
import { ethers } from 'ethers'
import dotenv from 'dotenv'
import path from 'path'

// Import deployed contract addresses
const REAL_ESTATE_PROPERTIES = {
  "1": {
    name: "Manhattan Luxury Apartments",
    address: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
    symbol: "MLA",
    pricePerShare: "0.1"
  },
  "2": {
    name: "Miami Beach Condos", 
    address: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
    symbol: "MBC",
    pricePerShare: "0.1"
  },
  "3": {
    name: "Austin Tech Hub Office",
    address: "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
    symbol: "ATHO",
    pricePerShare: "0.1"
  },
  "4": {
    name: "Seattle Warehouse District",
    address: "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26",
    symbol: "SWD",
    pricePerShare: "0.1"
  },
  "5": {
    name: "Denver Mountain Resort",
    address: "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC",
    symbol: "DMR",
    pricePerShare: "0.1"
  },
  "6": {
    name: "Chicago Downtown Lofts",
    address: "0x86337dDaF2661A069D0DcB5D160585acC2d15E9a",
    symbol: "CDL",
    pricePerShare: "0.1"
  },
  "7": {
    name: "Los Angeles Studio Complex",
    address: "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4",
    symbol: "LASC",
    pricePerShare: "0.1"
  },
  "8": {
    name: "Phoenix Retail Plaza",
    address: "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8",
    symbol: "PRP",
    pricePerShare: "0.1"
  },
  "9": {
    name: "Boston Historic Brownstones",
    address: "0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B",
    symbol: "BHB",
    pricePerShare: "0.1"
  },
  "10": {
    name: "Nashville Music District",
    address: "0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3",
    symbol: "NMD",
    pricePerShare: "0.1"
  }
};

// MockRealEstate contract ABI (key functions)
const REAL_ESTATE_ABI = [
  "function purchaseShares(uint256 _shares) external payable",
  "function withdrawShares(uint256 _shares) external",
  "function claimYield() external",
  "function calculatePendingYield(address _investor) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function getInvestorInfo(address _investor) external view returns (uint256 shares, uint256 invested, uint256 pendingYield, uint256 lastClaim)",
  "function getPropertyInfo() external view returns (tuple(string name, string location, string propertyType, uint256 totalValue, uint256 totalShares, uint256 pricePerShare, uint256 annualYieldRate, uint256 totalYieldDistributed, bool isActive))"
];

// Advanced DeFi Agent Classes

// Superfluid Streaming Agent
class StreamAgent {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(private privateKey: string, private rpcUrl: string, private sessionManager?: SessionKeyManager) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async createStream(params: any) {
    console.log('💧 StreamAgent: Creating Superfluid money stream...', params);
    
    try {
      // Superfluid Host Contract on Base Sepolia
      const SUPERFLUID_HOST = "0x4C073B3baB6d88B6575C8743282064147A6A6903";
      const FUSDC_TOKEN = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7"; // fUSDCx on Base Sepolia
      
      // Parse stream rate with improved regex to handle complex formats
      const streamRate = params.streamRate || "1 USDC/day";
      console.log(`🔍 Parsing stream rate: "${streamRate}"`);
      
      // Enhanced regex to handle formats like "10 USD/2 hours", "5 USDC/day", "1.5 ETH/week"
      const match = streamRate.match(/(\d+(?:\.\d+)?)\s*(\w+)\s*\/\s*(\d+)?\s*(\w+)/);
      
      if (!match) {
        throw new Error(`Invalid stream rate format: ${streamRate}. Use formats like "5 USDC/day", "10 USD/2 hours", or "1.5 ETH/week"`);
      }
      
      const amount = parseFloat(match[1]);
      const token = match[2];
      const periodMultiplier = match[3] ? parseInt(match[3]) : 1; // Handle "2 hours" vs "hour"
      const periodUnit = match[4];
      
      console.log(`📊 Parsed: ${amount} ${token} per ${periodMultiplier} ${periodUnit}`);
      
      // Convert to flow rate per second
      let baseSecondsPerUnit: number;
      switch (periodUnit.toLowerCase()) {
        case 'second':
        case 'seconds':
          baseSecondsPerUnit = 1;
          break;
        case 'minute':
        case 'minutes':
          baseSecondsPerUnit = 60;
          break;
        case 'hour':
        case 'hours':
          baseSecondsPerUnit = 3600;
          break;
        case 'day':
        case 'days':
          baseSecondsPerUnit = 86400;
          break;
        case 'week':
        case 'weeks':
          baseSecondsPerUnit = 7 * 86400;
          break;
        case 'month':
        case 'months':
          baseSecondsPerUnit = 30 * 86400;
          break;
        default:
          throw new Error(`Unsupported period unit: ${periodUnit}. Supported: second, minute, hour, day, week, month`);
      }
      
      const totalSecondsInPeriod = baseSecondsPerUnit * periodMultiplier;
      const flowRatePerSecond = amount / totalSecondsInPeriod;
      
      // Convert to wei per second (assuming 18 decimals for fUSDCx)
      const flowRate = ethers.utils.parseEther(flowRatePerSecond.toString());
      
      console.log(`💰 Creating stream: ${amount} ${token}/${periodMultiplier} ${periodUnit} = ${flowRatePerSecond} ${token}/second`);
      console.log(`🔢 Flow rate: ${flowRate.toString()} wei/second`);
      console.log(`🔢 Flow rate: ${flowRate.toString()} wei/second`);
      
      // Superfluid CFA (Constant Flow Agreement) ABI
      const CFA_ABI = [
        "function createFlow(address token, address receiver, int96 flowRate, bytes userData) external",
        "function updateFlow(address token, address receiver, int96 flowRate, bytes userData) external",
        "function deleteFlow(address token, address sender, address receiver, bytes userData) external"
      ];
      
      // Create contract instance
      const cfaContract = new ethers.Contract(SUPERFLUID_HOST, CFA_ABI, this.wallet);
      
      // Execute stream creation
      const tx = await cfaContract.createFlow(
        FUSDC_TOKEN,
        params.recipient,
        flowRate,
        "0x", // empty userData
        {
          gasLimit: 300000
        }
      );
      
      console.log(`🚀 Stream creation transaction: ${tx.hash}`);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        streamRate: streamRate,
        flowRate: flowRate.toString(),
        recipient: params.recipient,
        superToken: FUSDC_TOKEN,
        realTransaction: true,
        message: `Successfully created stream of ${streamRate} to ${params.recipient}`
      };
      
    } catch (error) {
      console.error('❌ Stream creation error:', error);
      throw error;
    }
  }

  async stopStream(params: any) {
    console.log('🛑 StreamAgent: Stopping Superfluid stream...', params);
    
    try {
      const SUPERFLUID_HOST = "0x4C073B3baB6d88B6575C8743282064147A6A6903";
      const FUSDC_TOKEN = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";
      
      const CFA_ABI = [
        "function deleteFlow(address token, address sender, address receiver, bytes userData) external"
      ];
      
      const cfaContract = new ethers.Contract(SUPERFLUID_HOST, CFA_ABI, this.wallet);
      
      const tx = await cfaContract.deleteFlow(
        FUSDC_TOKEN,
        this.wallet.address,
        params.recipient,
        "0x",
        { gasLimit: 200000 }
      );
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        message: `Successfully stopped stream to ${params.recipient}`
      };
      
    } catch (error) {
      console.error('❌ Stream stop error:', error);
      throw error;
    }
  }
}

// Basenames ENS Resolution Agent
class BasenameAgent {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(private privateKey: string, private rpcUrl: string, private sessionManager?: SessionKeyManager) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async resolveBasename(params: any) {
    console.log('🏷️ BasenameAgent: Resolving Basename...', params);
    
    try {
      // Base Sepolia L2 Resolver
      const L2_RESOLVER = "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA";
      
      const basename = params.basename;
      if (!basename || !basename.endsWith('.base.eth')) {
        throw new Error(`Invalid basename format: ${basename}. Must end with .base.eth`);
      }
      
      // ENS Resolver ABI
      const RESOLVER_ABI = [
        "function addr(bytes32 node) external view returns (address)",
        "function name(bytes32 node) external view returns (string)",
        "function text(bytes32 node, string key) external view returns (string)"
      ];
      
      // Create contract instance
      const resolver = new ethers.Contract(L2_RESOLVER, RESOLVER_ABI, this.provider);
      
      // Convert basename to namehash
      const namehash = ethers.utils.namehash(basename);
      console.log(`🔍 Resolving namehash: ${namehash} for ${basename}`);
      
      // Resolve address
      const resolvedAddress = await resolver.addr(namehash);
      
      if (resolvedAddress === ethers.constants.AddressZero) {
        throw new Error(`Basename ${basename} not found or not set`);
      }
      
      console.log(`✅ Resolved ${basename} to ${resolvedAddress}`);
      
      return {
        success: true,
        basename: basename,
        resolvedAddress: resolvedAddress,
        namehash: namehash,
        resolver: L2_RESOLVER,
        realTransaction: false, // Read-only operation
        message: `Successfully resolved ${basename} to ${resolvedAddress}`
      };
      
    } catch (error) {
      console.error('❌ Basename resolution error:', error);
      throw error;
    }
  }

  async setBasename(params: any) {
    console.log('📝 BasenameAgent: Setting Basename record...', params);
    
    try {
      const L2_RESOLVER = "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA";
      
      const RESOLVER_ABI = [
        "function setAddr(bytes32 node, address addr) external",
        "function setText(bytes32 node, string key, string value) external"
      ];
      
      const resolver = new ethers.Contract(L2_RESOLVER, RESOLVER_ABI, this.wallet);
      const namehash = ethers.utils.namehash(params.basename);
      
      // Set address record
      const tx = await resolver.setAddr(namehash, params.address, {
        gasLimit: 200000
      });
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        basename: params.basename,
        address: params.address,
        realTransaction: true,
        message: `Successfully set ${params.basename} to point to ${params.address}`
      };
      
    } catch (error) {
      console.error('❌ Basename setting error:', error);
      throw error;
    }
  }
}

// Aave V3 Borrowing Agent
class BorrowAgent {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(private privateKey: string, private rpcUrl: string, private sessionManager?: SessionKeyManager) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async borrowAgainstAssets(params: any) {
    console.log('🏦 BorrowAgent: Borrowing against collateral...', params);
    
    try {
      // Aave V3 Pool Addresses Provider on Base Sepolia
      const POOL_ADDRESSES_PROVIDER = "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A";
      
      // Common token addresses on Base Sepolia
      const TOKENS: { [key: string]: string } = {
        'USDC': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        'WETH': '0x4200000000000000000000000000000000000006',
        'DAI': '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb'
      };
      
      const collateralToken = TOKENS[params.collateralToken] || params.collateralToken;
      const borrowToken = TOKENS[params.borrowToken] || params.borrowToken;
      
      if (!collateralToken || !borrowToken) {
        throw new Error(`Unsupported token. Available: ${Object.keys(TOKENS).join(', ')}`);
      }
      
      // Aave Pool ABI (simplified)
      const POOL_ABI = [
        "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external",
        "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external",
        "function repay(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf) external returns (uint256)",
        "function withdraw(address asset, uint256 amount, address to) external returns (uint256)"
      ];
      
      // Get Pool address from AddressesProvider
      const ADDRESSES_PROVIDER_ABI = [
        "function getPool() external view returns (address)"
      ];
      
      const addressesProvider = new ethers.Contract(POOL_ADDRESSES_PROVIDER, ADDRESSES_PROVIDER_ABI, this.provider);
      const poolAddress = await addressesProvider.getPool();
      
      console.log(`🏦 Using Aave Pool at: ${poolAddress}`);
      
      const pool = new ethers.Contract(poolAddress, POOL_ABI, this.wallet);
      
      // Parse amounts
      const collateralAmount = ethers.utils.parseEther(params.collateralAmount || '1');
      const borrowAmount = ethers.utils.parseEther(params.borrowAmount || '0.5');
      
      console.log(`💰 Supplying ${ethers.utils.formatEther(collateralAmount)} ${params.collateralToken} as collateral`);
      console.log(`💸 Borrowing ${ethers.utils.formatEther(borrowAmount)} ${params.borrowToken}`);
      
      // Step 1: Supply collateral
      const supplyTx = await pool.supply(
        collateralToken,
        collateralAmount,
        this.wallet.address,
        0, // referral code
        { gasLimit: 300000 }
      );
      
      console.log(`🚀 Supply transaction: ${supplyTx.hash}`);
      await supplyTx.wait();
      
      // Step 2: Borrow against collateral
      const borrowTx = await pool.borrow(
        borrowToken,
        borrowAmount,
        2, // variable interest rate mode
        0, // referral code
        this.wallet.address,
        { gasLimit: 300000 }
      );
      
      console.log(`🚀 Borrow transaction: ${borrowTx.hash}`);
      const borrowReceipt = await borrowTx.wait();
      
      return {
        success: true,
        supplyTxHash: supplyTx.hash,
        borrowTxHash: borrowTx.hash,
        blockNumber: borrowReceipt.blockNumber,
        gasUsed: borrowReceipt.gasUsed.toString(),
        collateralToken: params.collateralToken,
        borrowToken: params.borrowToken,
        collateralAmount: ethers.utils.formatEther(collateralAmount),
        borrowAmount: ethers.utils.formatEther(borrowAmount),
        ltv: params.ltv || 'Auto-calculated',
        realTransaction: true,
        message: `Successfully borrowed ${ethers.utils.formatEther(borrowAmount)} ${params.borrowToken} against ${ethers.utils.formatEther(collateralAmount)} ${params.collateralToken}`
      };
      
    } catch (error) {
      console.error('❌ Borrow against assets error:', error);
      throw error;
    }
  }

  async repayLoan(params: any) {
    console.log('💰 BorrowAgent: Repaying loan...', params);
    
    try {
      const POOL_ADDRESSES_PROVIDER = "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A";
      
      const TOKENS: { [key: string]: string } = {
        'USDC': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        'WETH': '0x4200000000000000000000000000000000000006',
        'DAI': '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb'
      };
      
      const repayToken = TOKENS[params.borrowToken] || params.borrowToken;
      const repayAmount = ethers.utils.parseEther(params.borrowAmount || '0.5');
      
      // Get Pool and repay
      const ADDRESSES_PROVIDER_ABI = ["function getPool() external view returns (address)"];
      const addressesProvider = new ethers.Contract(POOL_ADDRESSES_PROVIDER, ADDRESSES_PROVIDER_ABI, this.provider);
      const poolAddress = await addressesProvider.getPool();
      
      const POOL_ABI = ["function repay(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf) external returns (uint256)"];
      const pool = new ethers.Contract(poolAddress, POOL_ABI, this.wallet);
      
      const tx = await pool.repay(
        repayToken,
        repayAmount,
        2, // variable rate
        this.wallet.address,
        { gasLimit: 300000 }
      );
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        repayAmount: ethers.utils.formatEther(repayAmount),
        token: params.borrowToken,
        realTransaction: true,
        message: `Successfully repaid ${ethers.utils.formatEther(repayAmount)} ${params.borrowToken}`
      };
      
    } catch (error) {
      console.error('❌ Loan repayment error:', error);
      throw error;
    }
  }
}

// RWA Agent Classes
class PropertyAgent {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(private privateKey: string, private rpcUrl: string, private sessionManager?: SessionKeyManager) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async purchaseShares(params: any) {
    console.log('🏠 PropertyAgent: Executing REAL USDC-based property share purchase...', params)
    
    try {
      // Get property contract address
      const propertyId = params.propertyId as string;
      const property = REAL_ESTATE_PROPERTIES[propertyId as keyof typeof REAL_ESTATE_PROPERTIES];
      
      if (!property) {
        throw new Error(`Property ID ${propertyId} not found`);
      }
      
      console.log(`📄 Contract Address: ${property.address}`);
      console.log(`🏢 Property: ${property.name}`);
      
      // USDC and Swap Pool addresses from deployed constants
      const USDC_TOKEN_ADDRESS = "0x6B0dacea6a72E759243c99Eaed840DEe9564C194";
      const SIMPLE_SWAP_POOL_ADDRESS = "0xCe3bf5DEd091c822193F14502B724a1bf1040E5C";
      
      // Calculate investment amount in USDC (18 decimals for this USDC token)
      const investmentAmountUSD = parseFloat(params.amount?.replace(/[$,]/g, '') || '0');
      const usdcAmount = ethers.utils.parseEther(investmentAmountUSD.toString()); // 18 decimals
      
      console.log(`💰 Investing ${investmentAmountUSD} USDC (${ethers.utils.formatEther(usdcAmount)} USDC wei) in ${property.name}`);
      
      // Create contract instances
      const usdcContract = new ethers.Contract(USDC_TOKEN_ADDRESS, [
        "function transfer(address to, uint256 amount) external returns (bool)",
        "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function allowance(address owner, address spender) external view returns (uint256)",
        "function balanceOf(address account) external view returns (uint256)"
      ], this.wallet);
      
      const swapPoolContract = new ethers.Contract(SIMPLE_SWAP_POOL_ADDRESS, [
        "function swapUSDCForETH(uint256 _usdcAmount) external",
        "function getETHAmountForUSDC(uint256 _usdcAmount) external view returns (uint256)"
      ], this.wallet);
      
      const propertyContract = new ethers.Contract(property.address, REAL_ESTATE_ABI, this.wallet);
      
      // Check USDC balance
      const usdcBalance = await usdcContract.balanceOf(this.wallet.address);
      console.log(`💳 USDC Balance: ${ethers.utils.formatEther(usdcBalance)} USDC`);
      
      if (usdcBalance.lt(usdcAmount)) {
        throw new Error(`Insufficient USDC balance. Need ${ethers.utils.formatEther(usdcAmount)} USDC, have ${ethers.utils.formatEther(usdcBalance)} USDC`);
      }
      
      // Step 1: Approve USDC spending by swap pool
      console.log('🔐 Approving USDC spending by swap pool...');
      const approveTx = await usdcContract.approve(SIMPLE_SWAP_POOL_ADDRESS, usdcAmount, {
        gasLimit: 100000
      });
      await approveTx.wait();
      console.log(`✅ USDC approval confirmed: ${approveTx.hash}`);
      
      // Step 2: Get ETH amount for USDC
      const ethAmount = await swapPoolContract.getETHAmountForUSDC(usdcAmount);
      console.log(`🔄 Will receive ${ethers.utils.formatEther(ethAmount)} ETH for ${ethers.utils.formatEther(usdcAmount)} USDC`);
      
      // Step 3: Calculate shares to purchase
      const pricePerShareETH = parseFloat(property.pricePerShare); // 0.1 ETH per share
      const ethAmountFloat = parseFloat(ethers.utils.formatEther(ethAmount));
      const sharesToPurchase = Math.floor(ethAmountFloat / pricePerShareETH);
      
      if (sharesToPurchase === 0) {
        throw new Error(`Investment amount ${investmentAmountUSD} USDC (${ethAmountFloat} ETH) is less than minimum share price ${pricePerShareETH} ETH`);
      }
      
      const totalETHCost = ethers.utils.parseEther((sharesToPurchase * pricePerShareETH).toString());
      
      console.log(`🏠 Purchasing ${sharesToPurchase} shares for ${ethers.utils.formatEther(totalETHCost)} ETH`);
      
      // Step 4: Swap USDC for ETH through the swap pool
      console.log('🔄 Swapping USDC for ETH...');
      const swapTx = await swapPoolContract.swapUSDCForETH(usdcAmount, {
        gasLimit: 200000
      });
      await swapTx.wait();
      console.log(`✅ USDC→ETH swap confirmed: ${swapTx.hash}`);
      
      // Step 5: Purchase property shares with ETH
      console.log('🏠 Purchasing property shares with ETH...');
      const purchaseTx = await propertyContract.purchaseShares(sharesToPurchase, {
        value: totalETHCost,
        gasLimit: 300000
      });
      
      console.log(`🚀 Property purchase transaction submitted: ${purchaseTx.hash}`);
      console.log('⏳ Waiting for confirmation...');
      
      // Wait for transaction confirmation
      const receipt = await purchaseTx.wait();
      
      console.log(`✅ Property purchase confirmed in block ${receipt.blockNumber}`);
      console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);
      
      // Check final USDC balance to confirm deduction
      const finalUsdcBalance = await usdcContract.balanceOf(this.wallet.address);
      const usdcSpent = usdcBalance.sub(finalUsdcBalance);
      console.log(`💸 USDC spent: ${ethers.utils.formatEther(usdcSpent)} USDC`);
      
      return {
        success: true,
        txHash: purchaseTx.hash,
        swapTxHash: swapTx.hash,
        approveTxHash: approveTx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        propertyId: propertyId,
        propertyName: property.name,
        propertyAddress: property.address,
        sharesAcquired: sharesToPurchase,
        investmentAmount: `${investmentAmountUSD} USDC`,
        ethReceived: ethers.utils.formatEther(ethAmount),
        ethCost: ethers.utils.formatEther(totalETHCost),
        usdcSpent: ethers.utils.formatEther(usdcSpent),
        strategy: params.investmentStrategy,
        realContract: true,
        realTransaction: true,
        usdcFlow: true,
        message: `Successfully purchased ${sharesToPurchase} shares of ${property.name} for ${investmentAmountUSD} USDC (${ethers.utils.formatEther(totalETHCost)} ETH)`
      }
    } catch (error) {
      console.error('❌ Real USDC-based property purchase error:', error);
      throw error;
    }
  }

  async claimYield(params: any) {
    console.log('💰 PropertyAgent: Executing REAL yield claim...', params)
    
    try {
      const propertyId = params.propertyId;
      
      if (propertyId === 'all') {
        // Claim from all properties
        const results = [];
        for (const [id, property] of Object.entries(REAL_ESTATE_PROPERTIES)) {
          try {
            const result = await this.claimFromProperty(id, property);
            if (result) results.push(result);
          } catch (error) {
            console.log(`⚠️ No yield to claim from ${property.name}`);
          }
        }
        
        if (results.length === 0) {
          throw new Error('No yield available to claim from any properties');
        }
        
        return {
          success: true,
          results: results,
          totalProperties: results.length,
          realTransaction: true,
          message: `Successfully claimed yield from ${results.length} properties`
        };
      } else {
        // Claim from specific property
        const property = REAL_ESTATE_PROPERTIES[propertyId as keyof typeof REAL_ESTATE_PROPERTIES];
        if (!property) {
          throw new Error(`Property ID ${propertyId} not found`);
        }
        
        return await this.claimFromProperty(propertyId, property);
      }
    } catch (error) {
      console.error('❌ Real yield claim error:', error);
      throw error;
    }
  }

  private async claimFromProperty(propertyId: string, property: any) {
    const contract = new ethers.Contract(property.address, REAL_ESTATE_ABI, this.wallet);
    
    // Check pending yield first
    const pendingYield = await contract.calculatePendingYield(this.wallet.address);
    
    if (pendingYield.eq(0)) {
      throw new Error(`No yield to claim from ${property.name}`);
    }
    
    console.log(`💰 Claiming ${ethers.utils.formatEther(pendingYield)} ETH from ${property.name}`);
    
    // Execute the real blockchain transaction
    const tx = await contract.claimYield({
      gasLimit: 200000
    });
    
    console.log(`🚀 Yield claim transaction submitted: ${tx.hash}`);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    
    console.log(`✅ Yield claimed in block ${receipt.blockNumber}`);
    
    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      yieldAmount: ethers.utils.formatEther(pendingYield),
      propertyId: propertyId,
      propertyName: property.name,
      realTransaction: true,
      message: `Successfully claimed ${ethers.utils.formatEther(pendingYield)} ETH from ${property.name}`
    };
  }

  async transferShares(params: any) {
    console.log('🔄 PropertyAgent: Executing REAL share transfer...', params)
    
    try {
      const propertyId = params.propertyId as string;
      const property = REAL_ESTATE_PROPERTIES[propertyId as keyof typeof REAL_ESTATE_PROPERTIES];
      
      if (!property) {
        throw new Error(`Property ID ${propertyId} not found`);
      }
      
      const contract = new ethers.Contract(property.address, REAL_ESTATE_ABI, this.wallet);
      
      // Get current balance
      const balance = await contract.balanceOf(this.wallet.address);
      const sharesToTransfer = parseInt(params.amount);
      
      if (balance.lt(sharesToTransfer)) {
        throw new Error(`Insufficient shares. You have ${balance.toString()}, trying to transfer ${sharesToTransfer}`);
      }
      
      // Execute transfer (using ERC20 transfer function)
      const tx = await contract.transfer(params.recipient, sharesToTransfer, {
        gasLimit: 200000
      });
      
      console.log(`🚀 Transfer transaction submitted: ${tx.hash}`);
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        propertyId: propertyId,
        sharesTransferred: sharesToTransfer,
        recipient: params.recipient,
        realTransaction: true,
        message: `Successfully transferred ${sharesToTransfer} shares of ${property.name}`
      };
    } catch (error) {
      console.error('❌ Real share transfer error:', error);
      throw error;
    }
  }
}

class ComplianceAgent {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(private privateKey: string, private rpcUrl: string, private sessionManager?: SessionKeyManager) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async updateKYC(params: any) {
    console.log('🔐 ComplianceAgent: Updating KYC (simulated - no real KYC contract)...', params)
    
    // KYC updates are typically off-chain, so we simulate this
    const mockTxHash = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('')}`
    
    return {
      success: true,
      txHash: mockTxHash,
      newLevel: params.complianceLevel,
      verificationStatus: 'Approved',
      complianceScore: Math.floor(Math.random() * 20) + 80,
      realTransaction: false, // KYC is off-chain
      message: `KYC updated to ${params.complianceLevel} level`
    }
  }
}

class PortfolioAgent {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(private privateKey: string, private rpcUrl: string, private sessionManager?: SessionKeyManager) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async rebalancePortfolio(params: any) {
    console.log('📊 PortfolioAgent: Rebalancing portfolio (simulated - complex multi-tx operation)...', params)
    
    // Portfolio rebalancing would involve multiple transactions across properties
    // For demo purposes, we simulate this as it would require multiple contract calls
    const mockTxHash = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('')}`
    
    return {
      success: true,
      txHash: mockTxHash,
      strategy: params.investmentStrategy,
      rebalancedProperties: Math.floor(Math.random() * 5) + 2,
      newAllocation: `Optimized for ${params.investmentStrategy} risk profile`,
      realTransaction: false, // Complex operation, simulated
      message: `Portfolio rebalanced with ${params.investmentStrategy} strategy`
    }
  }
}

class AnalysisAgent {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(private privateKey: string, private rpcUrl: string, private sessionManager?: SessionKeyManager) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async analyzeMarket(params: any) {
    console.log('📈 AnalysisAgent: Analyzing market (off-chain analysis)...', params)
    
    // Market analysis is typically off-chain data processing
    const mockTxHash = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('')}`
    
    const marketTrend = Math.random() > 0.5 ? 'Bullish' : 'Bearish'
    const recommendedAction = Math.random() > 0.5 ? 'Buy' : 'Hold'
    const confidenceScore = (Math.random() * 30 + 70).toFixed(1)
    
    return {
      success: true,
      txHash: mockTxHash,
      marketTrend,
      recommendedAction,
      confidenceScore: `${confidenceScore}%`,
      propertyId: params.propertyId,
      realTransaction: false, // Analysis is off-chain
      message: `Market analysis complete: ${marketTrend} trend, recommend ${recommendedAction}`
    }
  }
}

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') })

const PRIVATE_KEY = process.env.PRIVATE_KEY!
const RPC_URL = process.env.RPC_URL!

console.log('🔑 Private key loaded:', PRIVATE_KEY ? `${PRIVATE_KEY.substring(0, 10)}...` : 'NOT FOUND')
console.log('🌐 RPC URL:', RPC_URL)

// Validate private key format
if (!PRIVATE_KEY || !PRIVATE_KEY.startsWith('0x') || PRIVATE_KEY.length !== 66) {
  console.error('❌ Invalid private key format. Expected 0x followed by 64 hex characters')
  console.error('📝 Please check your .env file and ensure PRIVATE_KEY is set correctly')
  // Use a fallback for development
  console.log('⚠️ Using fallback private key for development')
}

// Helper function to detect negation in user input
function detectNegation(input: string): boolean {
  const lowerInput = input.toLowerCase();
  
  // Direct negation words
  const directNegation = ['dont', "don't", 'do not', 'never'];
  const hasDirectNegation = directNegation.some(word => lowerInput.includes(word));
  
  // Cancellation words
  const cancellationWords = ['cancel', 'stop', 'halt', 'abort'];
  const hasCancellation = cancellationWords.some(word => lowerInput.includes(word));
  
  // Check for "no" when related to investment
  const hasNoInvestment = lowerInput.includes('no invest');
  
  // Only consider it negation if it's clearly about not investing
  return (hasDirectNegation && lowerInput.includes('invest')) ||
         (hasCancellation && lowerInput.includes('invest')) ||
         hasNoInvestment;
}

// Helper function to calculate next execution time
function calculateNextExecution(recurrence: string): Date {
  const now = new Date()
  
  switch (recurrence) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000) // +1 day
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // +7 days
    case 'monthly':
      const nextMonth = new Date(now)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      return nextMonth
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000) // Default to daily
  }
}

export async function executeOrder(action: any, permissionContext: any) {
  const { type, params } = action
  const { userAddress, sessionKey, method } = permissionContext

  console.log('🔧 Initializing REAL RWA execution with method:', method)
  
  // SAFETY CHECK: Detect if this might be a negated command
  if (action.description && detectNegation(action.description)) {
    console.log('🚫 NEGATION DETECTED in action description:', action.description);
    throw new Error(`Command rejected: Negative instruction detected - "${action.description}". User explicitly said NOT to perform this action.`);
  }
  
  // Additional safety check for error params
  if (params.error === 'NEGATION_DETECTED') {
    console.log('🚫 NEGATION DETECTED in params:', params.originalCommand);
    throw new Error(`Command rejected: ${params.message}`);
  }
  
  // Check if we have valid keys for real execution
  const hasValidPrivateKey = PRIVATE_KEY && PRIVATE_KEY !== 'undefined' && PRIVATE_KEY.startsWith('0x') && PRIVATE_KEY.length === 66
  
  if (!hasValidPrivateKey) {
    throw new Error('❌ Invalid private key - cannot execute real transactions. Please check your .env file.');
  }
  
  console.log('✅ Valid private key detected - executing REAL blockchain transactions');
  console.log('🔑 Using wallet address:', new ethers.Wallet(PRIVATE_KEY).address);
  
  // Initialize session key manager for advanced permissions (optional for real execution)
  const sessionManager = sessionKey ? new SessionKeyManager(sessionKey, RPC_URL) : undefined;
  
  // Validate permissions before execution
  await validateRWAPermissions(action, permissionContext)
  
  // Advanced Permission Validation using EIP-7715
  if (permissionContext.method === 'eip7715_advanced' || permissionContext.method === 'standard_rwa_enhanced') {
    console.log('🔐 Validating EIP-7715 Advanced Permissions...')
    
    // Check if this is a permission-managed action
    const permissionManagedActions = ['invest_real_estate', 'auto_rebalance', 'copy_trading', 'limit_order', 'stream_money', 'borrow_against_assets']
    
    if (permissionManagedActions.includes(type)) {
      // Determine contract address based on action type
      let contractAddress = '';
      let methodName = '';
      let value = params.amount || '0';
      
      switch (type) {
        case 'invest_real_estate':
          const property = REAL_ESTATE_PROPERTIES[params.propertyId as keyof typeof REAL_ESTATE_PROPERTIES];
          contractAddress = property?.address || '';
          methodName = 'purchaseShares(uint256)';
          value = ethers.utils.parseEther((parseFloat(params.amount || '0') * 0.1).toString()).toString(); // Convert to ETH
          break;
          
        case 'auto_rebalance':
          contractAddress = '0x2626664c2603336E57B271c5C0b26F421741e481'; // Uniswap V3 Router
          methodName = 'exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))';
          value = ethers.utils.parseEther('1').toString(); // Default 1 ETH for rebalancing
          break;
          
        case 'stream_money':
          contractAddress = '0x4C073B3baB6d88B6575C8743282064147A6A6903'; // Superfluid Host
          methodName = 'createFlow(address,address,int96,bytes)';
          value = '0'; // Streaming doesn't require ETH value
          break;
          
        case 'borrow_against_assets':
          contractAddress = '0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A'; // Aave Pool Addresses Provider
          methodName = 'supply(address,uint256,address,uint16)';
          value = ethers.utils.parseEther(params.collateralAmount || '1').toString();
          break;
          
        default:
          contractAddress = '0x2626664c2603336E57B271c5C0b26F421741e481'; // Default to Uniswap
          methodName = 'multicall(uint256,bytes[])';
          value = ethers.utils.parseEther('0.1').toString();
      }
      
      // Validate permission using Advanced Permission Manager
      const isPermissionValid = await advancedPermissionManager.validatePermission(
        userAddress,
        contractAddress,
        methodName,
        value
      );
      
      if (!isPermissionValid) {
        throw new Error(`EIP-7715 Permission denied: ${type} action not authorized for ${userAddress} on contract ${contractAddress}`);
      }
      
      console.log('✅ EIP-7715 Advanced Permission validation passed');
    }
  }

  switch (type) {
    case 'schedule_swap':
      console.log('🔄 Executing scheduled swap...')
      const swapAgent = new SwapAgent(PRIVATE_KEY, RPC_URL, sessionManager)
      return await swapAgent.executeScheduledSwap({
        ...params,
        userAddress,
        permissionContext
      })

    case 'invest_real_estate':
      console.log('🏠 Executing REAL real estate investment...')
      
      // Check if this is a recurring investment
      if (params.recurrence && params.recurrence !== 'once') {
        console.log('📅 Setting up recurring property investment...')
        
        // Store the recurring order in database
        const { OrderRepository } = await import('../db/schema')
        
        const nextExecutionTime = calculateNextExecution(params.recurrence)
        
        const orderId = await OrderRepository.create({
          userAddress: userAddress,
          actionType: 'invest_real_estate',
          actionParams: JSON.stringify(params),
          permissionContext: JSON.stringify(permissionContext),
          status: 'pending',
          nextExecutionTime: nextExecutionTime.toISOString()
        })
        
        console.log(`📋 Recurring investment scheduled with ID: ${orderId}`)
        console.log(`⏰ Next execution: ${nextExecutionTime.toISOString()}`)
        
        // Execute the first investment immediately
        const propertyAgent = new PropertyAgent(PRIVATE_KEY, RPC_URL, sessionManager)
        const result = await propertyAgent.purchaseShares({
          ...params,
          userAddress,
          permissionContext
        })
        
        return {
          ...result,
          scheduleInfo: {
            orderId: orderId,
            recurrence: params.recurrence,
            nextExecution: nextExecutionTime.toISOString(),
            message: `Recurring ${params.recurrence} investment of ${params.amount} in ${params.propertyName} scheduled`
          }
        }
      } else {
        // One-time investment
        const propertyAgent = new PropertyAgent(PRIVATE_KEY, RPC_URL, sessionManager)
        return await propertyAgent.purchaseShares({
          ...params,
          userAddress,
          permissionContext
        })
      }

    case 'purchase_property_shares':
      console.log('🏠 Executing REAL property share purchase...')
      const propertyAgentLegacy = new PropertyAgent(PRIVATE_KEY, RPC_URL, sessionManager)
      return await propertyAgentLegacy.purchaseShares({
        ...params,
        userAddress,
        permissionContext
      })

    case 'claim_yield':
      console.log('💰 Executing REAL yield claim...')
      const yieldAgent = new PropertyAgent(PRIVATE_KEY, RPC_URL, sessionManager)
      return await yieldAgent.claimYield({
        ...params,
        userAddress,
        permissionContext
      })

    case 'transfer_shares':
      console.log('🔄 Executing REAL share transfer...')
      const transferAgent = new PropertyAgent(PRIVATE_KEY, RPC_URL, sessionManager)
      return await transferAgent.transferShares({
        ...params,
        userAddress,
        permissionContext
      })

    case 'kyc_update':
      console.log('🔐 Executing KYC update...')
      const complianceAgent = new ComplianceAgent(PRIVATE_KEY, RPC_URL, sessionManager)
      return await complianceAgent.updateKYC({
        ...params,
        userAddress,
        permissionContext
      })

    case 'portfolio_rebalance':
      console.log('📊 Executing portfolio rebalancing...')
      const portfolioAgent = new PortfolioAgent(PRIVATE_KEY, RPC_URL, sessionManager)
      return await portfolioAgent.rebalancePortfolio({
        ...params,
        userAddress,
        permissionContext
      })

    case 'market_analysis':
      console.log('📈 Executing market analysis...')
      const analysisAgent = new AnalysisAgent(PRIVATE_KEY, RPC_URL, sessionManager)
      return await analysisAgent.analyzeMarket({
        ...params,
        userAddress,
        permissionContext
      })

    // Advanced DeFi Features
    case 'stream_money':
      console.log('💧 Executing Superfluid money stream...')
      const streamAgent = new StreamAgent(PRIVATE_KEY, RPC_URL, sessionManager)
      
      if (params.action === 'stop') {
        return await streamAgent.stopStream({
          ...params,
          userAddress,
          permissionContext
        })
      } else {
        return await streamAgent.createStream({
          ...params,
          userAddress,
          permissionContext
        })
      }

    case 'resolve_basename':
      console.log('🏷️ Executing Basename resolution...')
      const basenameAgent = new BasenameAgent(PRIVATE_KEY, RPC_URL, sessionManager)
      
      if (params.action === 'set') {
        return await basenameAgent.setBasename({
          ...params,
          userAddress,
          permissionContext
        })
      } else {
        return await basenameAgent.resolveBasename({
          ...params,
          userAddress,
          permissionContext
        })
      }

    case 'borrow_against_assets':
      console.log('🏦 Executing Aave borrowing...')
      const borrowAgent = new BorrowAgent(PRIVATE_KEY, RPC_URL, sessionManager)
      
      if (params.action === 'repay') {
        return await borrowAgent.repayLoan({
          ...params,
          userAddress,
          permissionContext
        })
      } else {
        return await borrowAgent.borrowAgainstAssets({
          ...params,
          userAddress,
          permissionContext
        })
      }

    // Advanced Trading Features
    case 'auto_rebalance':
      console.log('⚖️ Executing auto-rebalance...')
      const { tradingEngine } = await import('../trading/tradingEngine')
      
      if (params.action === 'activate') {
        return await tradingEngine.executeAutoRebalance({
          userId: userAddress,
          targetAllocations: params.targetAllocations || { 'RealEstate': 60, 'ETH': 40 },
          frequency: params.rebalanceFrequency || 'weekly',
          threshold: params.rebalanceThreshold || 5,
          maxSlippage: 0.5,
          isActive: true
        })
      } else {
        return {
          success: true,
          message: 'Auto-rebalance deactivated',
          action: 'deactivated'
        }
      }

    case 'copy_trading':
      console.log('👥 Executing copy trading setup...')
      const { tradingEngine: copyTradingEngine } = await import('../trading/tradingEngine')
      
      if (params.action === 'activate') {
        return await copyTradingEngine.setupCopyTrading({
          userId: userAddress,
          whaleAddress: params.whaleAddress || '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6',
          copyPercentage: params.copyPercentage || 10,
          maxTradeSize: params.maxTradeSize || '1',
          allowedTokens: params.allowedTokens || ['WETH', 'USDC', 'DAI'],
          isActive: true
        })
      } else {
        return {
          success: true,
          message: 'Copy trading deactivated',
          action: 'deactivated'
        }
      }

    case 'limit_order':
      console.log('📋 Executing limit order...')
      const { tradingEngine: limitOrderEngine } = await import('../trading/tradingEngine')
      
      if (params.action === 'create') {
        return await limitOrderEngine.createLimitOrder({
          userId: userAddress,
          tokenIn: params.tokenIn || 'USDC',
          tokenOut: params.tokenOut || 'WETH',
          targetPrice: params.targetPrice || '1500',
          amount: params.amount || '1',
          orderType: params.orderType || 'buy',
          expiresAt: params.expiresIn ? Date.now() + parseTimeToMs(params.expiresIn) : undefined
        })
      } else {
        return {
          success: true,
          message: 'Limit order cancelled',
          action: 'cancelled'
        }
      }

    // EIP-7715 Advanced Permission Strategies
    case 'yield_farmer':
      console.log('🌾 Executing Yield Farmer (Auto-Compounding)...')
      
      if (params.action === 'activate') {
        // Create yield farmer permission
        const permission = await advancedPermissionManager.createYieldFarmerPermission(
          userAddress,
          params.propertyId || '1'
        );
        
        return {
          success: true,
          permissionType: 'yield_farmer',
          propertyId: params.propertyId || '1',
          duration: '1 year',
          autoCompounding: true,
          permission: permission,
          message: `Yield Farmer activated for Property #${params.propertyId || '1'} - Auto-compounding enabled`
        };
      } else if (params.action === 'execute') {
        // Execute yield farming
        return await advancedPermissionManager.executeYieldFarming(
          userAddress,
          params.propertyId || '1'
        );
      } else {
        return {
          success: true,
          message: 'Yield Farmer deactivated',
          action: 'deactivated'
        };
      }

    case 'smart_dca':
      console.log('📈 Executing Smart DCA (Dollar Cost Averaging)...')
      
      if (params.action === 'activate') {
        // Create Smart DCA permission
        const permission = await advancedPermissionManager.createSmartDCAPermission(
          userAddress,
          params.weeklyAmount || '0.1', // Default 0.1 ETH weekly
          params.propertyId || '1'
        );
        
        return {
          success: true,
          permissionType: 'smart_dca',
          weeklyAmount: params.weeklyAmount || '0.1',
          propertyId: params.propertyId || '1',
          executionDay: 'Monday',
          duration: '1 year',
          permission: permission,
          message: `Smart DCA activated: ${params.weeklyAmount || '0.1'} ETH weekly into Property #${params.propertyId || '1'}`
        };
      } else if (params.action === 'execute') {
        // Execute DCA investment
        return await advancedPermissionManager.executeSmartDCA(
          userAddress,
          params.propertyId || '1',
          params.weeklyAmount || '0.1'
        );
      } else {
        return {
          success: true,
          message: 'Smart DCA deactivated',
          action: 'deactivated'
        };
      }

    case 'emergency_brake':
      console.log('🚨 Executing Emergency Brake (Stop-Loss)...')
      
      if (params.action === 'activate') {
        // Create Emergency Brake permission
        const permission = await advancedPermissionManager.createEmergencyBrakePermission(
          userAddress,
          params.triggerPrice || '1500' // Default trigger at $1500 ETH
        );
        
        return {
          success: true,
          permissionType: 'emergency_brake',
          triggerPrice: params.triggerPrice || '1500',
          swapTarget: 'USDC',
          isDormant: true,
          duration: '1 year',
          permission: permission,
          message: `Emergency Brake activated: Will swap ETH→USDC if ETH drops below $${params.triggerPrice || '1500'}`
        };
      } else if (params.action === 'check') {
        // Check if emergency brake should trigger
        return await advancedPermissionManager.checkEmergencyBrakeTrigger(
          userAddress,
          params.triggerPrice || '1500'
        );
      } else {
        return {
          success: true,
          message: 'Emergency Brake deactivated',
          action: 'deactivated'
        };
      }

    // Legacy DeFi actions (for backward compatibility)
    case 'swap':
      console.log('🔄 Executing legacy swap transaction...')
      const legacySwapAgent = new SwapAgent(PRIVATE_KEY, RPC_URL, sessionManager)
      return await legacySwapAgent.executeSwap({
        ...params,
        userAddress,
        permissionContext
      })

    case 'lend':
      console.log('🏦 Executing legacy lending transaction...')
      const lendAgent = new LendAgent(PRIVATE_KEY, RPC_URL, sessionManager)
      return await lendAgent.executeLend({
        token: params.tokenIn,
        amount: params.amount,
        userAddress,
        permissionContext
      })

    case 'borrow':
      console.log('💰 Executing legacy borrow transaction...')
      const legacyBorrowAgent = new LendAgent(PRIVATE_KEY, RPC_URL, sessionManager)
      return await legacyBorrowAgent.executeBorrow({
        token: params.tokenOut,
        amount: params.amount,
        userAddress,
        permissionContext
      })

    default:
      throw new Error(`Unsupported action type: ${type}. Supported actions: schedule_swap, invest_real_estate, claim_yield, transfer_shares, kyc_update, portfolio_rebalance, market_analysis, stream_money, resolve_basename, borrow_against_assets, auto_rebalance, copy_trading, limit_order, yield_farmer, smart_dca, emergency_brake`)
  }
}

// Helper function to parse time strings to milliseconds
function parseTimeToMs(timeStr: string): number {
  const match = timeStr.match(/(\d+)([hdwmy])/i);
  if (!match) return 24 * 60 * 60 * 1000; // Default 24 hours
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  switch (unit) {
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    case 'w': return value * 7 * 24 * 60 * 60 * 1000;
    case 'm': return value * 30 * 24 * 60 * 60 * 1000;
    case 'y': return value * 365 * 24 * 60 * 60 * 1000;
    default: return 24 * 60 * 60 * 1000;
  }
}

// RWA simulation function for testing without real contracts
async function simulateRWAExecution(action: any, permissionContext: any) {
  console.log('🎭 Simulating RWA transaction execution...')
  console.log('📋 Action:', action.type, '- Description:', action.description)
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Generate realistic mock data based on action type
  const mockTxHash = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('')}`
  
  const mockGasUsed = Math.floor(Math.random() * 200000) + 100000
  const mockBlockNumber = Math.floor(Math.random() * 1000000) + 18000000
  
  let actionSpecificData = {}
  
  switch (action.type) {
    case 'schedule_swap':
      const fiatValue = parseFloat(action.params.fiatAmount?.replace(/[$,]/g, '') || '1000')
      actionSpecificData = {
        tokenIn: action.params.tokenIn,
        tokenOut: action.params.tokenOut,
        fiatAmount: action.params.fiatAmount,
        recurrence: action.params.recurrence,
        estimatedTokenAmount: action.params.tokenIn === 'ETH' ? (fiatValue / 3000).toFixed(6) : fiatValue.toString(),
        nextExecution: new Date(Date.now() + (action.params.recurrence === 'daily' ? 86400000 : 604800000)).toISOString(),
        totalScheduled: action.params.recurrence === 'once' ? 1 : 10
      }
      break
      
    case 'invest_real_estate':
    case 'purchase_property_shares':
      const investAmount = parseFloat(action.params.amount?.replace(/[$,]/g, '') || '5000')
      actionSpecificData = {
        propertyId: action.params.propertyId || '1',
        propertyName: action.params.propertyName || 'Manhattan Luxury Apartments',
        propertyAddress: action.params.propertyAddress || '0x1234567890123456789012345678901234567890',
        sharesAcquired: Math.floor(investAmount / 100), // $100 per share
        investmentAmount: investAmount.toString(),
        strategy: action.params.investmentStrategy || 'balanced',
        estimatedYield: (investAmount * 0.05).toFixed(2) // 5% annual yield
      }
      break
      
    case 'claim_yield':
      actionSpecificData = {
        yieldAmount: (Math.random() * 500 + 100).toFixed(2), // $100-600 yield
        properties: action.params.propertyId === 'all' ? ['1', '2', '3'] : [action.params.propertyId || '1'],
        yieldRate: (Math.random() * 5 + 3).toFixed(2) + '%', // 3-8% yield
        claimPeriod: 'Q4 2024'
      }
      break
      
    case 'portfolio_rebalance':
      actionSpecificData = {
        strategy: action.params.investmentStrategy || 'balanced',
        rebalancedProperties: Math.floor(Math.random() * 5) + 2,
        newAllocation: 'Optimized for ' + (action.params.investmentStrategy || 'balanced') + ' risk profile',
        expectedImprovement: (Math.random() * 2 + 1).toFixed(1) + '% yield increase'
      }
      break
      
    case 'kyc_update':
      actionSpecificData = {
        newLevel: action.params.complianceLevel || 'enhanced',
        verificationStatus: 'Approved',
        complianceScore: Math.floor(Math.random() * 20) + 80, // 80-100 score
        accessLevel: action.params.complianceLevel === 'institutional' ? 'Accredited Investor' : 'Standard'
      }
      break
      
    case 'market_analysis':
      actionSpecificData = {
        marketTrend: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
        recommendedAction: Math.random() > 0.5 ? 'Buy' : 'Hold',
        confidenceScore: (Math.random() * 30 + 70).toFixed(1) + '%', // 70-100%
        propertyId: action.params.propertyId,
        marketCap: '$' + (Math.random() * 100 + 50).toFixed(1) + 'M',
        priceChange24h: (Math.random() * 10 - 5).toFixed(2) + '%'
      }
      break
      
    default:
      actionSpecificData = { note: 'Generic RWA action executed' }
  }
  
  console.log('✅ RWA simulation completed successfully')
  console.log('📊 Action-specific data:', actionSpecificData)
  
  return {
    success: true,
    txHash: mockTxHash,
    gasUsed: mockGasUsed.toString(),
    blockNumber: mockBlockNumber,
    method: `${permissionContext.method}_rwa_simulated`,
    simulation: true,
    rwaData: actionSpecificData,
    message: `RWA Action: ${action.description}`
  }
}

async function validatePermissions(action: any, permissionContext: any) {
  const { method, policies, userConsent } = permissionContext
  
  console.log('🔍 Validating permissions for method:', method)
  
  switch (method) {
    case 'eip7715_advanced':
      // Validate against EIP-7715 policies
      if (!policies) {
        throw new Error('EIP-7715 policies required but not provided')
      }
      
      // Check if action is within policy limits
      if (policies.maxValue && parseFloat(action.params.amount) > parseFloat(policies.maxValue)) {
        throw new Error(`Amount ${action.params.amount} exceeds policy limit ${policies.maxValue}`)
      }
      
      if (policies.allowedTokens && !policies.allowedTokens.includes(action.params.tokenIn)) {
        throw new Error(`Token ${action.params.tokenIn} not allowed by policy`)
      }
      
      console.log('✅ EIP-7715 policy validation passed')
      break
      
    case 'wallet_grant_advanced':
      // Validate wallet grant permissions
      if (!permissionContext.permission) {
        throw new Error('Wallet grant permission required but not provided')
      }
      console.log('✅ Wallet grant validation passed')
      break
      
    case 'standard_enhanced':
      // Validate user consent for standard permissions
      if (!userConsent) {
        throw new Error('User consent required for standard permissions')
      }
      console.log('✅ User consent validation passed')
      break
      
    case 'basic_fallback':
      // Basic validation for fallback mode
      if (!userConsent) {
        throw new Error('User consent required for basic fallback')
      }
      console.log('⚠️ Using basic fallback permissions')
      break
      
    default:
      console.log('⚠️ Unknown permission method, proceeding with caution')
  }
}

async function validateRWAPermissions(action: any, permissionContext: any) {
  const { method, policies, userConsent } = permissionContext
  
  console.log('🔍 Validating RWA permissions for action:', action.type)
  
  // RWA-specific permission validation
  switch (action.type) {
    case 'schedule_swap':
      // Validate scheduled swap permissions
      if (action.params.recurrence !== 'once' && method !== 'eip7715_advanced') {
        throw new Error('Advanced permissions (EIP-7715) required for recurring swaps')
      }
      
      const fiatValue = parseFloat(action.params.fiatAmount?.replace(/[$,]/g, '') || '0')
      if (fiatValue > 10000) { // $10k limit for scheduled swaps
        throw new Error(`Scheduled swap amount $${fiatValue} exceeds maximum limit of $10,000`)
      }
      break
      
    case 'invest_real_estate':
    case 'purchase_property_shares':
      // Validate investment amount limits
      const investmentAmount = parseFloat(action.params.amount?.replace(/[$,]/g, '') || '0')
      if (investmentAmount > 100000) { // $100k limit for demo
        throw new Error(`Investment amount $${investmentAmount} exceeds maximum limit of $100,000`)
      }
      
      // Check KYC level for large investments
      if (investmentAmount > 25000 && action.params.complianceLevel === 'basic') {
        throw new Error('Enhanced KYC required for investments over $25,000')
      }
      break
      
    case 'claim_yield':
      // Validate yield claiming permissions
      if (!userConsent) {
        throw new Error('User consent required for yield claiming')
      }
      break
      
    case 'transfer_shares':
      // Validate transfer permissions and compliance
      if (!action.params.recipient || action.params.recipient === '0x0000000000000000000000000000000000000000') {
        throw new Error('Valid recipient address required for share transfers')
      }
      
      if (action.params.complianceLevel !== 'enhanced') {
        throw new Error('Enhanced compliance level required for share transfers')
      }
      break
      
    case 'kyc_update':
      // Validate KYC update permissions
      if (method !== 'eip7715_advanced' && method !== 'wallet_grant_advanced') {
        throw new Error('Advanced permissions required for KYC updates')
      }
      break
      
    case 'portfolio_rebalance':
      // Validate portfolio management permissions
      if (!policies || !policies.allowPortfolioManagement) {
        console.log('⚠️ Portfolio management not explicitly allowed, proceeding with user consent')
        if (!userConsent) {
          throw new Error('User consent required for portfolio rebalancing')
        }
      }
      break
      
    case 'market_analysis':
      // Market analysis is generally allowed for all users
      console.log('✅ Market analysis permitted for all users')
      break

    case 'stream_money':
      // Validate Superfluid streaming permissions
      if (!action.params.recipient || action.params.recipient === '0x0000000000000000000000000000000000000000') {
        throw new Error('Valid recipient address required for money streaming')
      }
      
      const streamRate = action.params.streamRate || action.params.flowRate;
      if (!streamRate) {
        throw new Error('Stream rate or flow rate required for money streaming')
      }
      
      // Check for large streaming amounts
      const streamMatch = streamRate.match(/(\d+(?:\.\d+)?)/);
      if (streamMatch && parseFloat(streamMatch[1]) > 1000) {
        if (method !== 'eip7715_advanced') {
          throw new Error('Advanced permissions required for high-value streaming (>1000/period)');
        }
      }
      break

    case 'resolve_basename':
      // Basename resolution is generally allowed
      if (!action.params.basename || !action.params.basename.endsWith('.base.eth')) {
        throw new Error('Valid .base.eth basename required')
      }
      
      // Setting basenames requires enhanced permissions
      if (action.params.action === 'set' && method !== 'eip7715_advanced') {
        throw new Error('Advanced permissions required for setting basename records')
      }
      break

    case 'borrow_against_assets':
      // Validate Aave borrowing permissions
      if (!action.params.collateralToken || !action.params.borrowToken) {
        throw new Error('Both collateral and borrow tokens required for lending operations')
      }
      
      const borrowAmount = parseFloat(action.params.borrowAmount?.replace(/[$,]/g, '') || '0');
      const collateralAmount = parseFloat(action.params.collateralAmount?.replace(/[$,]/g, '') || '0');
      
      if (borrowAmount > 50000 || collateralAmount > 100000) {
        if (method !== 'eip7715_advanced') {
          throw new Error('Advanced permissions required for large borrowing operations');
        }
      }
      
      // Enhanced KYC required for borrowing
      if (action.params.complianceLevel !== 'enhanced' && action.params.complianceLevel !== 'institutional') {
        throw new Error('Enhanced or institutional KYC level required for borrowing operations')
      }
      break
      
    default:
      // Check if it's one of the new EIP-7715 strategies
      if (['yield_farmer', 'smart_dca', 'emergency_brake'].includes(action.type)) {
        console.log(`✅ EIP-7715 strategy ${action.type} permitted for all users`);
        break;
      }
      throw new Error(`Unknown RWA action type: ${action.type}`)
  }
  
  console.log('✅ RWA permission validation passed')
}

export async function executeScheduledOrders() {
  console.log('🕐 Checking for scheduled orders...')
  
  try {
    const { OrderRepository } = await import('../db/schema')
    
    // Query database for orders due for execution
    const dueOrders = await OrderRepository.findDueOrders()
    
    if (dueOrders.length === 0) {
      console.log('📭 No scheduled orders due for execution')
      return
    }
    
    console.log(`📋 Found ${dueOrders.length} orders due for execution`)
    
    for (const order of dueOrders) {
      try {
        console.log(`🔄 Executing scheduled order ${order.id}...`)
        
        // Update status to executing
        await OrderRepository.updateStatus(order.id!, 'executing')
        
        // Parse the stored action and permission context
        const actionParams = JSON.parse(order.actionParams)
        const permissionContext = JSON.parse(order.permissionContext)
        
        const action = {
          type: order.actionType,
          description: `Scheduled ${order.actionType}`,
          params: actionParams
        }
        
        // Execute the order
        const result = await executeOrder(action, permissionContext)
        
        // Update status to completed
        await OrderRepository.updateStatus(order.id!, 'completed', (result as any).txHash)
        
        // Schedule next execution if recurring
        if (actionParams.recurrence && actionParams.recurrence !== 'once') {
          const nextExecutionTime = calculateNextExecution(actionParams.recurrence)
          
          await OrderRepository.create({
            userAddress: order.userAddress,
            actionType: order.actionType,
            actionParams: order.actionParams,
            permissionContext: order.permissionContext,
            status: 'pending',
            nextExecutionTime: nextExecutionTime.toISOString()
          })
          
          console.log(`⏰ Next execution scheduled for: ${nextExecutionTime.toISOString()}`)
        }
        
        console.log(`✅ Scheduled order ${order.id} executed successfully`)
        
      } catch (error) {
        console.error(`❌ Failed to execute scheduled order ${order.id}:`, error)
        
        // Update status to failed
        await OrderRepository.updateStatus(order.id!, 'failed', undefined, (error as Error).message)
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking scheduled orders:', error)
  }
}