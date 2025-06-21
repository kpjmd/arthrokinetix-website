import { createWeb3Modal } from '@web3modal/wagmi/react'
import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

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

const config = createConfig({
  chains,
  transports: {
    [base.id]: http()
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0]
    })
  ]
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true
})

export { config }