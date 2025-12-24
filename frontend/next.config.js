/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  // Add empty turbopack config to silence the warning
  turbopack: {},
  
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false
    };
    
    // Get the absolute path to viem
    const viemPath = path.dirname(require.resolve('viem/package.json'))
    
    // Force single viem version to resolve conflicts
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      // Exclude problematic Base Account package
      '@base-org/account': false,
      // Force all viem imports to use our main viem version with absolute paths
      'viem$': path.join(viemPath, 'index.ts'),
      'viem/actions': path.join(viemPath, 'actions'),
      'viem/chains': path.join(viemPath, 'chains'),
      'viem/utils': path.join(viemPath, 'utils'),
      'viem/experimental': path.join(viemPath, 'experimental'),
      'viem/accounts': path.join(viemPath, 'accounts'),
      'viem/ens': path.join(viemPath, 'ens'),
      'viem/siwe': path.join(viemPath, 'siwe'),
    };
    
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Fix for viem and other ESM modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    return config;
  },
  transpilePackages: ['@rainbow-me/rainbowkit', 'wagmi', 'viem', '@reown/appkit', '@reown/appkit-controllers', '@coinbase/wallet-sdk']
}

module.exports = nextConfig