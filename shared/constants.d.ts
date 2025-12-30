export declare const UNISWAP_V3_ROUTER_ADDRESS = "0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4";
export declare const MOONWELL_COMPTROLLER_ADDRESS = "0xfBb7d83a5C9F120d4C73924568d5Ea8B6C4E8c1A";
export declare const TOKENS: {
    readonly USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
    readonly ETH: "0x4200000000000000000000000000000000000006";
    readonly DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb";
    readonly WETH: "0x4200000000000000000000000000000000000006";
};
export { default as UNISWAP_V3_ROUTER_ABI } from './abis/UniswapV3Router.json';
export { default as MOONWELL_COMPTROLLER_ABI } from './abis/MoonwellComptroller.json';
export { default as ERC20_ABI } from './abis/ERC20.json';
export declare const CHAIN_CONFIG: {
    chainId: number;
    name: string;
    rpcUrl: string;
    blockExplorer: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
};
export declare const SESSION_KEY_CONFIG: {
    defaultDuration: number;
    maxDuration: number;
    minFunding: string;
    gasBuffer: number;
};
export declare const DEFAULT_POLICIES: {
    maxTransactionValue: string;
    maxDailyValue: string;
    allowedSlippage: number;
    gasLimit: string;
    cooldownPeriod: number;
};
//# sourceMappingURL=constants.d.ts.map