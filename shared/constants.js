"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_POLICIES = exports.SESSION_KEY_CONFIG = exports.CHAIN_CONFIG = exports.ERC20_ABI = exports.MOONWELL_COMPTROLLER_ABI = exports.UNISWAP_V3_ROUTER_ABI = exports.TOKENS = exports.MOONWELL_COMPTROLLER_ADDRESS = exports.UNISWAP_V3_ROUTER_ADDRESS = void 0;
// Base Sepolia Contract Addresses
exports.UNISWAP_V3_ROUTER_ADDRESS = '0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4';
exports.MOONWELL_COMPTROLLER_ADDRESS = '0xfBb7d83a5C9F120d4C73924568d5Ea8B6C4E8c1A'; // Base Sepolia Moonwell
// Token Addresses (Base Sepolia)
exports.TOKENS = {
    USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia USDC
    ETH: '0x4200000000000000000000000000000000000006', // WETH on Base
    DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // Base Sepolia DAI
    WETH: '0x4200000000000000000000000000000000000006' // WETH on Base
};
// ABIs
var UniswapV3Router_json_1 = require("./abis/UniswapV3Router.json");
Object.defineProperty(exports, "UNISWAP_V3_ROUTER_ABI", { enumerable: true, get: function () { return __importDefault(UniswapV3Router_json_1).default; } });
var MoonwellComptroller_json_1 = require("./abis/MoonwellComptroller.json");
Object.defineProperty(exports, "MOONWELL_COMPTROLLER_ABI", { enumerable: true, get: function () { return __importDefault(MoonwellComptroller_json_1).default; } });
var ERC20_json_1 = require("./abis/ERC20.json");
Object.defineProperty(exports, "ERC20_ABI", { enumerable: true, get: function () { return __importDefault(ERC20_json_1).default; } });
// Chain Configuration
exports.CHAIN_CONFIG = {
    chainId: 84532, // Base Sepolia
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia-explorer.base.org',
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
    }
};
// Session Key Configuration
exports.SESSION_KEY_CONFIG = {
    defaultDuration: 24 * 60 * 60, // 24 hours in seconds
    maxDuration: 7 * 24 * 60 * 60, // 7 days in seconds
    minFunding: '0.01', // Minimum ETH balance for session key
    gasBuffer: 1.2 // 20% gas buffer for transactions
};
// Permission Policies
exports.DEFAULT_POLICIES = {
    maxTransactionValue: '1000', // Max 1000 tokens per transaction
    maxDailyValue: '10000', // Max 10000 tokens per day
    allowedSlippage: 5, // Max 5% slippage
    gasLimit: '500000', // Max gas per transaction
    cooldownPeriod: 60 // 1 minute between transactions
};
//# sourceMappingURL=constants.js.map