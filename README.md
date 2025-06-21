# 🧬 Arthrokinetix

**Revolutionary platform where medical research meets emotional intelligence and algorithmic art**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kpjmd/arthrokinetix-website)

## 🎯 Overview

Arthrokinetix is a groundbreaking dual-purpose platform that combines:
- **Evidence-based medical research education** (orthopedic surgery & sports medicine)
- **Algorithmic art generation** from emotional analysis of medical literature  
- **Emotional intelligence AI** that evolves based on content and user feedback
- **Dual authentication systems** (Email + Web3 NFT verification)

### 🔬 Core Innovation
A proprietary algorithm that analyzes medical literature for emotional undertones (hope, confidence, healing, breakthrough, tension, uncertainty) and transforms this data into unique "Andry Tree" visualizations and emotional signatures.

---

## ✨ Phase 2A Features (COMPLETED)

### 🔐 Dual Authentication System
- **Clerk.dev Email Authentication** - Seamless email verification with user management
- **Web3 NFT Authentication** - Wallet connection and NFT ownership verification on Base network
- **Graceful Fallbacks** - Application works with or without authentication keys
- **Access Control** - Emotional feedback gated behind verification (email OR NFT ownership)

### 🏥 Medical Research Hub
- **Evidence-based articles** in orthopedic surgery subspecialties
- **Emotional analysis** of research content using Claude AI
- **Interactive research browser** with advanced filtering
- **Admin content management** system

### 🎨 Algorithmic Art Generation
- **Unique visual signatures** generated from emotional analysis
- **Andry Tree artwork** creation system
- **Rarity scoring** for generated artworks
- **Signature collection** system for users

### 🧠 Emotional Intelligence Algorithm
- **Real-time emotional state** tracking and visualization
- **Community feedback integration** that influences algorithm evolution
- **Algorithm evolution timeline** showing development over time
- **Predictive emotional modeling**

### 🔍 Enhanced User Experience
- **Dual authentication options** for maximum accessibility
- **Advanced search** across articles, signatures, and artworks
- **User profiles** with signature collections
- **Mobile-responsive design** with authentication flows

---

## 🏗️ Technical Architecture

### **Frontend (React 18)**
- **React 18** with modern hooks and functional components
- **Tailwind CSS** for responsive, utility-first styling
- **Framer Motion** for smooth animations and interactions
- **React Router** for client-side routing
- **Clerk.dev Integration** for email authentication
- **wagmi v1 + Web3Modal** for Web3 wallet connection
- **Safe Authentication Hooks** with graceful fallbacks

### **Backend (FastAPI)**
- **FastAPI** for high-performance Python REST API
- **MongoDB** for flexible document storage
- **Claude AI (Anthropic)** for emotional analysis
- **Clerk Webhook Integration** for user synchronization
- **Alchemy API** for NFT verification on Base network
- **Dual Authentication Support** in all endpoints

### **Authentication Architecture**
- **Clerk.dev Provider** with mock fallbacks when keys unavailable
- **Web3 Provider** with wagmi v1 configuration
- **Safe Auth Hooks** (`/hooks/useAuth.js`) preventing runtime errors
- **Dual Access Control** - users can authenticate via email OR Web3

### **Database Schema**
```javascript
// Enhanced User Collection (MongoDB)
{
  // Email authentication (Clerk)
  clerk_user_id: String,
  email: String,
  email_verified: Boolean,
  
  // Web3 authentication  
  wallet_address: String,
  nft_verified: Boolean,
  erc721_balance: Number,
  erc1155_balance: Number,
  nft_contracts: [String],
  
  // Common fields
  feedback_access: Boolean,
  access_type: 'email_verified' | 'nft_verified' | 'web3_connected' | 'demo',
  created_at: Date,
  last_active: Date,
  preferences: Object
}
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and yarn (npm causes breaking changes)
- **Python** 3.8+ and pip
- **MongoDB** (local or Atlas)
- **Claude API key** from Anthropic
- **Clerk.dev account** (optional - app works without)
- **Alchemy API key** for NFT verification (optional)

### 1. Clone Repository
```bash
git clone https://github.com/kpjmd/arthrokinetix-website.git
cd arthrokinetix-website
```

### 2. Environment Setup

**Backend Environment (`/backend/.env`):**
```env
# Required - Core functionality
MONGODB_URI=mongodb://localhost:27017/arthrokinetix
ANTHROPIC_API_KEY=your_claude_api_key_here
ADMIN_PASSWORD=admin123

# Optional - Clerk.dev email authentication
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# Optional - Web3 NFT authentication
ALCHEMY_API_URL=https://base-mainnet.g.alchemy.com/v2/your_api_key
NFT_CONTRACT_ERC721=0xb976c398291fb99d507551d1a01b5bfcc7823d51
NFT_CONTRACT_ERC1155=0xc6ac80da15ede865e11c0858354cf553ab9d0a37
BASE_CHAIN_ID=8453

# Server configuration
PORT=8001
```

**Frontend Environment (`/frontend/.env`):**
```env
# Required - Backend connection
REACT_APP_BACKEND_URL=http://localhost:8001

# Optional - Clerk.dev email authentication
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key

# Optional - Web3 NFT authentication  
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_NFT_CONTRACT_ERC721=0xb976c398291fb99d507551d1a01b5bfcc7823d51
NEXT_PUBLIC_NFT_CONTRACT_ERC1155=0xc6ac80da15ede865e11c0858354cf553ab9d0a37
NEXT_PUBLIC_BASE_CHAIN_ID=8453
```

### 3. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Start enhanced server with dual authentication
python enhanced_server_clerk.py

# Alternative: Use supervisor for background processes
sudo supervisorctl restart backend
```

### 4. Frontend Setup
```bash
cd frontend
yarn install  # IMPORTANT: Use yarn, not npm
yarn start

# Alternative: Use supervisor
sudo supervisorctl restart frontend
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **Admin Dashboard**: http://localhost:3000/admin (password from .env)

---

## 📁 Project Structure

```
arthrokinetix/
├── 📁 backend/                     # FastAPI backend
│   ├── server.py                   # Original server
│   ├── enhanced_server_clerk.py    # Enhanced server with dual auth
│   ├── clerk_auth.py              # Clerk authentication handler
│   ├── web3_auth.py               # Web3 NFT verification handler
│   ├── requirements.txt           # Python dependencies
│   └── .env                       # Backend environment variables
├── 📁 frontend/                   # React frontend  
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable components
│   │   │   ├── ClerkProvider.js   # Enhanced Clerk provider with fallbacks
│   │   │   ├── AuthComponents.js  # Email authentication components
│   │   │   ├── Web3AuthComponents.js # Web3 authentication components
│   │   │   ├── EnhancedWeb3Integration.js # Web3 wallet integration
│   │   │   └── FeedbackForm.js    # Access-controlled feedback
│   │   ├── 📁 hooks/              # Custom authentication hooks
│   │   │   └── useAuth.js         # Safe auth hooks with fallbacks
│   │   ├── 📁 config/             # Configuration files
│   │   │   └── web3Config.js      # wagmi v1 Web3 configuration
│   │   ├── 📁 pages/              # Page components
│   │   │   └── ArticlePage.js     # Enhanced with dual access control
│   │   └── App.js                 # Main React app with providers
│   ├── package.json               # Node.js dependencies
│   └── .env                       # Frontend environment variables
├── 📁 docs/                       # Documentation
├── vercel.json                    # Vercel deployment config
├── README.md                      # This file
└── DEPLOYMENT.md                  # Deployment guide
```

---

## 🔗 API Endpoints

### Core Endpoints
- `GET /` - Health check with dual authentication info
- `GET /api/algorithm-state` - Current algorithm emotional state
- `GET /api/articles` - Medical research articles
- `GET /api/articles/{id}` - Specific article with emotional analysis

### Phase 2A Authentication Endpoints

**Clerk.dev Email Authentication:**
- `POST /api/webhooks/clerk` - Clerk user management webhooks
- `POST /api/auth/sync-user` - Manual Clerk user synchronization
- `GET /api/users/profile/{clerk_user_id}` - Clerk user profile

**Web3 NFT Authentication:**
- `POST /api/web3/verify-nft` - Verify NFT ownership on Base network
- `POST /api/web3/verify-and-sync` - Verify NFT and sync user data
- `GET /api/web3/user/{wallet_address}` - Web3 user profile

**Enhanced Feedback System:**
- `POST /api/feedback` - Submit feedback (dual auth support)
  - Accepts `clerk_user_id` for email-verified users
  - Accepts `wallet_address` for NFT-verified users
  - Supports demo mode for anonymous users

### Admin Endpoints
- `POST /api/admin/authenticate` - Admin authentication
- `GET /api/admin/users` - User management dashboard (dual auth status)

---

## 🔐 Authentication Systems

### 1. Email Authentication (Clerk.dev)

**Setup Requirements:**
```bash
# Sign up at clerk.dev
# Get publishable and secret keys
# Configure in environment variables
```

**User Flow:**
1. User clicks "Sign Up" → Clerk modal opens
2. User enters email → Clerk sends verification
3. Email verified → User synced to MongoDB
4. Feedback access granted automatically

**Components:**
- `AuthModal` - Sign in/up modal with Clerk integration
- `EnhancedUserButton` - User profile dropdown
- `SignedIn/SignedOut` - Conditional rendering components

### 2. Web3 NFT Authentication

**Supported Networks:**
- **Base Network** (Chain ID: 8453)
- **ERC721 Contract**: `0xb976c398291fb99d507551d1a01b5bfcc7823d51`
- **ERC1155 Contract**: `0xc6ac80da15ede865e11c0858354cf553ab9d0a37`

**User Flow:**
1. User clicks "Connect Wallet" → Web3Modal opens
2. Wallet connected → NFT verification starts
3. Alchemy API checks contract ownership
4. NFT ownership confirmed → Feedback access granted

**Components:**
- `Web3Modal` - Wallet connection interface
- `NFTVerification` - Ownership verification display
- `EnhancedWeb3Integration` - Header wallet display

### 3. Graceful Fallbacks

**When Authentication Keys Missing:**
- Application continues to function normally
- Demo mode messaging shown instead of errors
- Web3 features still work independently
- Admin can still manage content

**Safe Authentication Hooks:**
```javascript
// Custom hooks prevent runtime errors
import { useUser, useClerk, SignedIn, SignedOut } from '../hooks/useAuth';

// These hooks safely handle missing Clerk configuration
// and provide mock implementations when needed
```

---

## 🧪 Testing

### Manual Testing
```bash
# Test backend health and authentication status
curl http://localhost:8001/

# Test algorithm state
curl http://localhost:8001/api/algorithm-state

# Test Web3 NFT verification
curl -X POST http://localhost:8001/api/web3/verify-nft \
  -H "Content-Type: application/json" \
  -d '{"address": "0x742d35cc6ca3c4e23a3f72c66d5bfd1db2cb2a8c"}'

# Test dual authentication feedback submission
curl -X POST http://localhost:8001/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"article_id": "test", "emotion": "hope", "clerk_user_id": "user_123"}'
```

### Authentication Flow Testing
1. **Homepage Loading**: Verify both auth options visible
2. **Email Authentication**: Test Clerk modal opening (with/without keys)
3. **Web3 Authentication**: Test wallet connection and NFT verification
4. **Access Control**: Verify feedback gating on article pages
5. **Graceful Degradation**: Test app functionality without auth keys

### Error Resolution Testing
- **No Runtime Errors**: Verify no "useUser can only be used within ClerkProvider" errors
- **Compilation Success**: Confirm no wagmi/Web3 import errors
- **Graceful Fallbacks**: Test app behavior with missing environment variables

---

## 🌍 Deployment

### Production Environment Variables

**Vercel Frontend Environment:**
```env
REACT_APP_BACKEND_URL=https://your-app.vercel.app
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_live_your_production_clerk_key
NEXT_PUBLIC_ALCHEMY_API_KEY=your_production_alchemy_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_NFT_CONTRACT_ERC721=0xb976c398291fb99d507551d1a01b5bfcc7823d51
NEXT_PUBLIC_NFT_CONTRACT_ERC1155=0xc6ac80da15ede865e11c0858354cf553ab9d0a37
NEXT_PUBLIC_BASE_CHAIN_ID=8453
```

**Railway Backend Environment:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arthrokinetix
ANTHROPIC_API_KEY=sk-ant-api03-your-production-key
ADMIN_PASSWORD=your-secure-production-password
CLERK_SECRET_KEY=sk_live_your_production_clerk_secret
CLERK_WEBHOOK_SECRET=whsec_your_production_webhook_secret
ALCHEMY_API_URL=https://base-mainnet.g.alchemy.com/v2/your_production_key
NFT_CONTRACT_ERC721=0xb976c398291fb99d507551d1a01b5bfcc7823d51
NFT_CONTRACT_ERC1155=0xc6ac80da15ede865e11c0858354cf553ab9d0a37
BASE_CHAIN_ID=8453
PORT=8001
```

**📋 See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide**

---

## 🔧 Development

### Local Development with Authentication
```bash
# Start MongoDB (if local)
mongod --dbpath /your/db/path

# Start enhanced backend with dual auth
cd backend && python enhanced_server_clerk.py

# Start frontend with authentication components  
cd frontend && yarn start
```

### Adding New Authentication Features
1. **Email Features**: Add Clerk webhook handlers in `clerk_auth.py`
2. **Web3 Features**: Extend NFT verification in `web3_auth.py`
3. **Frontend Components**: Create components in `components/` with safe auth hooks
4. **Access Control**: Update feedback endpoints with new auth logic

### Testing Authentication Locally
```bash
# Test without Clerk keys (graceful fallback)
# Remove CLERK keys from .env and restart

# Test without Web3 keys (should still work)
# Remove ALCHEMY keys from .env and restart

# Test with all keys present (full functionality)
# Add all authentication keys and restart
```

---

## 📊 Monitoring & Analytics

### Authentication Analytics
- **User Registration Rates** (email vs Web3)
- **Authentication Success Rates**
- **NFT Verification Rates**
- **Feedback Submission by Auth Type**

### Performance Monitoring
- **Clerk API Response Times**
- **Alchemy NFT Verification Speed**
- **Database User Sync Performance**
- **Authentication Component Load Times**

---

## 🔐 Security

### Authentication Security
- **Clerk.dev Security**: Industry-standard email verification and user management
- **Web3 Security**: Wallet-based authentication with cryptographic signatures
- **Dual Verification**: Users can access via either secure method
- **Environment Security**: All API keys properly secured in environment variables

### Access Control
- **Feedback Gating**: Emotional feedback requires authentication
- **Admin Protection**: Admin endpoints require password authentication
- **MongoDB Security**: User data properly validated and sanitized
- **CORS Configuration**: Secure cross-origin requests

---

## 🎨 Screenshots

### Homepage with Dual Authentication
![Homepage showing both email and Web3 authentication options](docs/images/homepage-auth.png)

### Access Control on Article Pages  
![Article page showing dual authentication gate when not signed in](docs/images/article-access-gate.png)

### Web3 Wallet Integration
![Enhanced Web3 integration showing NFT verification status](docs/images/web3-integration.png)

### Email Authentication Flow
![Clerk.dev authentication modal and user profile](docs/images/email-auth.png)

---

## 🗺️ Roadmap

### Phase 2A Completed ✅
- [x] **Clerk.dev Email Authentication** - Complete with user management
- [x] **Web3 NFT Authentication** - Base network integration with Alchemy
- [x] **Dual Access Control** - Feedback gating with either auth method
- [x] **Graceful Fallbacks** - App works without authentication keys
- [x] **MongoDB User Sync** - Comprehensive user data management
- [x] **Error-Free Implementation** - Zero runtime or compilation errors

### Phase 2B Planned 🚧
- [ ] **Enhanced Admin Dashboard** - User management with auth status
- [ ] **Algorithm Evolution Tracking** - Auth-based feedback influence
- [ ] **User Preference Management** - Notification and update preferences
- [ ] **Advanced NFT Features** - Multi-chain support, trait-based access

### Future Phases 🔮
- [ ] **Mobile App Development** - React Native with authentication
- [ ] **Advanced AI Models** - Enhanced emotional analysis
- [ ] **Real-time Collaboration** - Multi-user feedback sessions
- [ ] **Multi-language Support** - Internationalization

---

## 💡 Innovation Highlights

1. **Dual Authentication Pioneer**: First medical platform with email + Web3 authentication
2. **Graceful Degradation**: Works beautifully with or without authentication keys
3. **Emotional AI + Blockchain**: Unique combination of medical analysis and NFT verification
4. **Safe Architecture**: Runtime error-free implementation with comprehensive fallbacks
5. **User Choice**: Users can choose traditional email or modern Web3 authentication

---

## 🤝 Support & Contributing

### Getting Help
- **Issues**: Create an issue on [GitHub](https://github.com/kpjmd/arthrokinetix-website/issues)
- **Authentication Issues**: Check environment variables and API key configuration
- **Web3 Issues**: Verify wallet connection and NFT contract addresses
- **Deployment Issues**: See detailed [DEPLOYMENT.md](DEPLOYMENT.md) guide

### Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature/auth-enhancement`
3. Follow safe authentication patterns from existing code
4. Test with and without authentication keys
5. Commit changes: `git commit -m 'Add auth enhancement'`
6. Push to branch: `git push origin feature/auth-enhancement`
7. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by the Arthrokinetix Team**

*Bridging the gap between medical science and digital art through emotional intelligence and modern authentication*

**Current Version**: Phase 2A Complete (Dual Authentication System)
**Next Version**: Phase 2B (Enhanced User Management)