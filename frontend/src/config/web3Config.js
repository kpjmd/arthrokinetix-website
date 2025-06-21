import { createWeb3Modal } from '@web3modal/wagmi/react'
import { configureChains, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'

// 1. Get projectId from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '09861ae0475dc4c586c66bbda1a5e918'

// 2. Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [base],
  [publicProvider()]
)

// 3. Create wagmiConfig
const metadata = {
  name: 'Arthrokinetix',
  description: 'Revolutionary platform where medical research meets emotional intelligence and algorithmic art',
  url: 'https://arthrokinetix.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const config = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        metadata
      }
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true
      }
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: metadata.name,
        appLogoUrl: metadata.icons[0]
      }
    })
  ],
  publicClient,
  webSocketPublicClient
})

// 4. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true
})

export { config }