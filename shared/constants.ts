// Base Sepolia Contract Addresses
export const UNISWAP_V3_ROUTER_ADDRESS = '0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4'
export const MOONWELL_COMPTROLLER_ADDRESS = '0xfBb7d83a5C9F120d4C73924568d5Ea8B6C4E8c1A' // Base Sepolia Moonwell

// Token Addresses (Base Sepolia)
export const TOKENS = {
  USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia USDC
  ETH: '0x4200000000000000000000000000000000000006', // WETH on Base
  DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // Base Sepolia DAI
  WETH: '0x4200000000000000000000000000000000000006' // WETH on Base
} as const

// ABIs
export { default as UNISWAP_V3_ROUTER_ABI } from './abis/UniswapV3Router.json'
export { default as MOONWELL_COMPTROLLER_ABI } from './abis/MoonwellComptroller.json'
export { default as ERC20_ABI } from './abis/ERC20.json'

// Chain Configuration
export const CHAIN_CONFIG = {
  chainId: 84532, // Base Sepolia
  name: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia-explorer.base.org',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  }
}

// Session Key Configuration
export const SESSION_KEY_CONFIG = {
  defaultDuration: 24 * 60 * 60, // 24 hours in seconds
  maxDuration: 7 * 24 * 60 * 60, // 7 days in seconds
  minFunding: '0.01', // Minimum ETH balance for session key
  gasBuffer: 1.2 // 20% gas buffer for transactions
}

// Permission Policies
export const DEFAULT_POLICIES = {
  maxTransactionValue: '1000', // Max 1000 tokens per transaction
  maxDailyValue: '10000', // Max 10000 tokens per day
  allowedSlippage: 5, // Max 5% slippage
  gasLimit: '500000', // Max gas per transaction
  cooldownPeriod: 60 // 1 minute between transactions
}