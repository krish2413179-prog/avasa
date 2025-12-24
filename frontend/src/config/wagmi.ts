import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { http } from 'viem'

const { connectors } = getDefaultWallets({
  appName: 'PropChain AI - RWA DeFi Platform',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
  chains: [baseSepolia]
})

export const config = createConfig({
  chains: [baseSepolia],
  connectors,
  transports: {
    [baseSepolia.id]: http(),
  },
})

export const chains = [baseSepolia]