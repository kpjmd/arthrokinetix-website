import React from 'react';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../config/web3Config';

const queryClient = new QueryClient();

const Web3Provider = ({ children }) => {
  // Create a simple wrapper that doesn't rely on Web3Modal
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;