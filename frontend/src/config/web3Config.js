import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiConfig } from 'wagmi'
import { base } from 'wagmi/chains'

// 1. Get projectId from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '09861ae0475dc4c586c66bbda1a5e918'

// 2. Create wagmiConfig
const metadata = {
  name: 'Arthrokinetix',
  description: 'Revolutionary platform where medical research meets emotional intelligence and algorithmic art',
  url: 'https://arthrokinetix.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [base]
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true
})

export { config }