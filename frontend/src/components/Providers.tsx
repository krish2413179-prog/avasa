'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { baseSepolia, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode, useState, useMemo } from 'react';
import { createContext, useContext } from 'react';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within Providers');
  }
  return context;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const wagmiConfig = useMemo(() => getDefaultConfig({
    appName: 'PropChain AI',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || '77479e849304b4edbb24c148c0a00ca7',
    chains: [baseSepolia, base],
    ssr: true,
  }), []);

  const rainbowKitTheme = theme === 'light' 
    ? lightTheme({
        accentColor: '#3b82f6',
        accentColorForeground: 'white',
        borderRadius: 'large',
        fontStack: 'system',
      })
    : darkTheme({
        accentColor: '#3b82f6',
        accentColorForeground: 'white',
        borderRadius: 'large',
        fontStack: 'system',
      });

  return (
    <AppContext.Provider value={{ theme, toggleTheme }}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={rainbowKitTheme}>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </AppContext.Provider>
  );
}
