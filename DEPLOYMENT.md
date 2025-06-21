# Arthrokinetix Deployment Guide
**Phase 2A: Dual Authentication System**

## 🚀 Production Deployment Setup

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Railway Account**: Sign up at [railway.app](https://railway.app) for backend hosting
3. **MongoDB Atlas**: Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
4. **Anthropic API**: Get API key from [console.anthropic.com](https://console.anthropic.com)
5. **Clerk.dev Account**: Create account at [clerk.dev](https://clerk.dev) (optional)
6. **Alchemy Account**: Create account at [alchemy.com](https://alchemy.com) (optional)
7. **GitHub Repository**: Push your code to GitHub

---

## 📁 Current Project Structure

```
arthrokinetix/
├── frontend/                    # React frontend (Vercel)
│   ├── src/
│   │   ├── components/         # Authentication components
│   │   ├── hooks/useAuth.js    # Safe authentication hooks
│   │   ├── config/web3Config.js # wagmi v1 configuration
│   │   └── ...
│   ├── package.json            # wagmi v1, Clerk, Web3Modal
│   └── .env                    # Frontend environment variables
├── backend/                    # FastAPI backend (Railway)
│   ├── enhanced_server_clerk.py # Main server with dual auth
│   ├── clerk_auth.py           # Clerk authentication handler
│   ├── web3_auth.py           # Web3 NFT verification
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Backend environment variables
├── vercel.json                 # Vercel deployment config
├── README.md                   # Updated documentation
└── DEPLOYMENT.md              # This guide
```

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a new project: "Arthrokinetix"
3. Build a cluster (choose free tier for development)
4. Configure cluster:
   - **Provider**: AWS
   - **Region**: Choose closest to your users
   - **Cluster Tier**: M0 Sandbox (Free) or M2/M5 for production

### Step 2: Configure Network Access

1. Go to **Network Access** in MongoDB Atlas
2. Add IP address: `0.0.0.0/0` (allow from anywhere for Railway/Vercel)
3. Or add specific Railway/Vercel IP ranges for better security

### Step 3: Create Database User

1. Go to **Database Access**
2. Add new user:
   - **Username**: `arthrokinetix-admin`
   - **Password**: Generate secure password
   - **Role**: `Atlas admin` or `Read and write to any database`

### Step 4: Get Connection String

1. Go to **Clusters** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string:
   ```
   mongodb+srv://arthrokinetix-admin:<password>@cluster0.xxxxx.mongodb.net/arthrokinetix?retryWrites=true&w=majority
   ```

### Step 5: Initialize Database Collections

The enhanced server will automatically create these collections:
- `users` - Dual authentication user data
- `articles` - Medical content with emotional analysis
- `feedback` - User feedback with authentication metadata
- `algorithm_states` - Algorithm evolution tracking

---

## 🔐 Authentication Service Setup

### Phase 2A Authentication Services

#### 1. Clerk.dev Email Authentication (Optional)

1. **Create Clerk Application**:
   - Go to [Clerk.dev Dashboard](https://dashboard.clerk.dev)
   - Create new application: "Arthrokinetix"
   - Choose **Email** as primary authentication method

2. **Configure Authentication Settings**:
   - Enable email verification
   - Set up custom branding (optional)
   - Configure redirect URLs:
     - Development: `http://localhost:3000`
     - Production: `https://your-app.vercel.app`

3. **Get API Keys**:
   ```
   Publishable Key: pk_live_xxxxxxxxxx (for frontend)
   Secret Key: sk_live_xxxxxxxxxx (for backend)
   ```

4. **Set up Webhooks**:
   - Add webhook endpoint: `https://your-backend.railway.app/api/webhooks/clerk`
   - Subscribe to events: `user.created`, `user.updated`, `user.deleted`
   - Get webhook secret: `whsec_xxxxxxxxxx`

#### 2. Alchemy Web3 NFT Verification (Optional)

1. **Create Alchemy Account**:
   - Go to [Alchemy Dashboard](https://dashboard.alchemy.com)
   - Create new app: "Arthrokinetix NFT Verification"
   - Choose **Base** network

2. **Get API Key**:
   ```
   API Key: your_alchemy_api_key
   Base Network URL: https://base-mainnet.g.alchemy.com/v2/your_api_key
   ```

3. **Configure NFT Contracts**:
   ```
   ERC721 Contract: 0xb976c398291fb99d507551d1a01b5bfcc7823d51
   ERC1155 Contract: 0xc6ac80da15ede865e11c0858354cf553ab9d0a37
   Base Chain ID: 8453
   ```

#### 3. WalletConnect Project (Optional)

1. **Create WalletConnect Project**:
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
   - Create new project: "Arthrokinetix"
   - Get Project ID: `your_project_id`

---

## 🔧 Environment Variables Setup

### Frontend Environment Variables (Vercel)

Create/update `frontend/.env`:

```env
# Required - Backend connection
REACT_APP_BACKEND_URL=https://your-backend.railway.app

# Optional - Clerk.dev email authentication
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxx

# Optional - Web3 NFT authentication  
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_NFT_CONTRACT_ERC721=0xb976c398291fb99d507551d1a01b5bfcc7823d51
NEXT_PUBLIC_NFT_CONTRACT_ERC1155=0xc6ac80da15ede865e11c0858354cf553ab9d0a37
NEXT_PUBLIC_BASE_CHAIN_ID=8453

# Optional - Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Backend Environment Variables (Railway)

Create/update `backend/.env`:

```env
# Required - Core functionality
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arthrokinetix
ANTHROPIC_API_KEY=sk-ant-api03-your-production-key
ADMIN_PASSWORD=your-secure-production-password

# Optional - Clerk.dev email authentication
CLERK_SECRET_KEY=sk_live_xxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxx

# Optional - Web3 NFT authentication
ALCHEMY_API_URL=https://base-mainnet.g.alchemy.com/v2/your_api_key
NFT_CONTRACT_ERC721=0xb976c398291fb99d507551d1a01b5bfcc7823d51
NFT_CONTRACT_ERC1155=0xc6ac80da15ede865e11c0858354cf553ab9d0a37
BASE_CHAIN_ID=8453

# Server configuration
PORT=8001
```

**🔑 Important**: The application gracefully handles missing authentication keys, so you can deploy with just the required variables and add authentication later.

---

## 🚀 Backend Deployment (Railway)

### Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Connect your GitHub repository
4. Choose the repository: `arthrokinetix-website`

### Step 2: Configure Build Settings

1. **Root Directory**: `/backend`
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `python enhanced_server_clerk.py`
4. **Port**: `8001`

### Step 3: Add Environment Variables

In Railway project settings → Variables, add all backend environment variables from above.

### Step 4: Deploy Backend

1. Click **Deploy**
2. Wait for build to complete
3. Your backend will be available at `https://your-project.railway.app`

### Step 5: Test Backend Deployment

```bash
# Test health check
curl https://your-backend.railway.app/

# Test algorithm state
curl https://your-backend.railway.app/api/algorithm-state

# Test Web3 verification (even without NFTs)
curl -X POST https://your-backend.railway.app/api/web3/verify-nft \
  -H "Content-Type: application/json" \
  -d '{"address": "0x742d35cc6ca3c4e23a3f72c66d5bfd1db2cb2a8c"}'
```

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository: `arthrokinetix-website`
4. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`

### Step 2: Configure Environment Variables

In Vercel project settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `REACT_APP_BACKEND_URL` | `https://your-backend.railway.app` | Production, Preview |
| `REACT_APP_CLERK_PUBLISHABLE_KEY` | `pk_live_xxxxxxxxxx` | Production, Preview |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | `your_alchemy_api_key` | Production, Preview |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | `your_walletconnect_project_id` | Production, Preview |
| `NEXT_PUBLIC_NFT_CONTRACT_ERC721` | `0xb976c398291fb99d507551d1a01b5bfcc7823d51` | Production, Preview |
| `NEXT_PUBLIC_NFT_CONTRACT_ERC1155` | `0xc6ac80da15ede865e11c0858354cf553ab9d0a37` | Production, Preview |
| `NEXT_PUBLIC_BASE_CHAIN_ID` | `8453` | Production, Preview |
| `NODE_ENV` | `production` | Production |

### Step 3: Deploy Frontend

1. Click **Deploy**
2. Wait for build to complete
3. Your app will be available at `https://your-project.vercel.app`

### Step 4: Update Backend CORS

Update backend environment variables to include your Vercel URL:
```env
CORS_ORIGINS=https://your-project.vercel.app,http://localhost:3000
```

---

## 🔗 Custom Domain (Optional)

### Step 1: Configure Vercel Domain

1. Go to your Vercel project → Settings → Domains
2. Add your custom domain: `arthrokinetix.com`
3. Configure DNS records as instructed by Vercel

### Step 2: Update Environment Variables

Update all URLs to use your custom domain:
- Frontend: `REACT_APP_BACKEND_URL` → Update to use custom domain if backend also has custom domain
- Backend: Add custom domain to CORS settings
- Clerk: Update redirect URLs to custom domain

---

## 🔄 Webhook Configuration

### Clerk.dev Webhook Setup

1. **Create Webhook Endpoint**:
   - URL: `https://your-backend.railway.app/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`

2. **Test Webhook**:
   ```bash
   # Clerk will send test events to verify endpoint
   # Check Railway logs for webhook processing
   ```

3. **Webhook Security**:
   - Webhook secret is automatically verified in `clerk_auth.py`
   - Invalid signatures are rejected

---

## 🧪 Testing Deployment

### 1. Authentication System Tests

**Email Authentication (if configured):**
- [ ] Sign up modal opens without errors
- [ ] Email verification flow works
- [ ] User data syncs to MongoDB
- [ ] Feedback access granted after verification

**Web3 Authentication (if configured):**
- [ ] "Connect Wallet" button appears
- [ ] Wallet connection modal opens
- [ ] NFT verification process completes
- [ ] Feedback access granted for NFT holders

**Graceful Fallbacks (always works):**
- [ ] App loads without authentication keys
- [ ] Demo mode messaging appears
- [ ] Core functionality remains accessible
- [ ] No runtime or compilation errors

### 2. Core Functionality Tests

- [ ] Homepage loads with dual hero design
- [ ] Articles page displays content
- [ ] Article detail pages load with emotional analysis
- [ ] Algorithm mood indicator works
- [ ] Navigation functions properly
- [ ] Admin dashboard accessible

### 3. API Integration Tests

```bash
# Test core endpoints
curl https://your-app.vercel.app/api/
curl https://your-app.vercel.app/api/algorithm-state
curl https://your-app.vercel.app/api/articles

# Test authentication endpoints
curl -X POST https://your-app.vercel.app/api/web3/verify-nft \
  -H "Content-Type: application/json" \
  -d '{"address": "0x742d35cc6ca3c4e23a3f72c66d5bfcc7823d51"}'

curl -X POST https://your-app.vercel.app/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"article_id": "test", "emotion": "hope", "access_type": "demo"}'
```

### 4. Performance Tests

- [ ] Lighthouse score > 90
- [ ] Page load time < 3s
- [ ] API response time < 500ms
- [ ] Authentication components load quickly

---

## 🐛 Troubleshooting

### Common Authentication Issues

**Clerk Runtime Errors:**
```bash
# Fixed in Phase 2A - should not occur
# If you see "useUser can only be used within ClerkProvider":
# - Check that useAuth hooks are imported from /hooks/useAuth.js
# - Verify ClerkProvider wrapper in App.js
```

**Web3 Compilation Errors:**
```bash
# Fixed in Phase 2A - should not occur
# If you see wagmi import errors:
# - Verify web3Config.js uses wagmi v1 syntax
# - Check that createWeb3Modal is removed
```

**Environment Variable Issues:**
- Check that all required variables are set in deployment platforms
- Verify variable names match exactly (case-sensitive)
- Redeploy after adding new variables
- Remember: app works without optional auth variables

**Database Connection Issues:**
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify connection string format and credentials
- Ensure database user has proper permissions

### Logs and Debugging

**Vercel Logs:**
```bash
vercel logs your-deployment-url
```

**Railway Logs:**
- Go to Railway project → Deployments → View logs
- Check for authentication initialization messages
- Verify database connection success

**Browser Console:**
- Should show warnings about missing auth keys (normal)
- Should NOT show runtime errors
- Network tab should show successful API calls

---

## 📊 Monitoring & Analytics

### Authentication Analytics

**User Registration Tracking:**
- Monitor Clerk dashboard for email signups
- Track Web3 wallet connections via Alchemy
- Database queries for user authentication status

**Usage Metrics:**
```bash
# MongoDB queries for analytics
db.users.countDocuments({access_type: "email_verified"})
db.users.countDocuments({access_type: "nft_verified"})
db.feedback.countDocuments({access_type: {$ne: "demo"}})
```

### Performance Monitoring

**Vercel Analytics:**
- Automatic performance monitoring for frontend
- Core Web Vitals tracking
- User engagement metrics

**Railway Monitoring:**
- CPU and memory usage tracking
- Response time monitoring
- Error rate tracking

---

## 🔒 Security Best Practices

### Authentication Security

**Clerk.dev Security:**
- Industry-standard email verification
- Secure webhook endpoints with signature verification
- User data encryption in transit and at rest

**Web3 Security:**
- Wallet-based authentication with cryptographic signatures
- NFT verification through Alchemy's secure API
- No private key storage or handling

**Environment Security:**
- All API keys properly secured in environment variables
- Different keys for development/production
- Regular key rotation recommended

### Database Security

- MongoDB Atlas security features enabled
- User permissions configured with least privilege
- Connection string encrypted
- Audit logs enabled (recommended for production)

---

## 📈 Scaling Considerations

### Authentication Scaling

**Clerk.dev Scaling:**
- Handles user management automatically
- Built-in rate limiting and security
- Scales with usage automatically

**Web3 Scaling:**
- Alchemy API scales with plan tier
- Consider caching NFT verification results
- Monitor API usage and upgrade plan as needed

### Database Scaling

**MongoDB Atlas Scaling:**
- Start with M0 (free) for development
- Upgrade to M2/M5 for production traffic
- Monitor performance metrics
- Add indexes for common queries:
  ```javascript
  db.users.createIndex({"clerk_user_id": 1})
  db.users.createIndex({"wallet_address": 1})
  db.feedback.createIndex({"article_id": 1, "timestamp": -1})
  ```

### Application Scaling

**Frontend (Vercel):**
- Automatic scaling and CDN
- Edge function optimization
- Image optimization enabled

**Backend (Railway):**
- Monitor resource usage
- Upgrade plan as traffic increases
- Consider Redis caching for frequently accessed data

---

## 📞 Support & Troubleshooting

### Deployment Support

**Platform-Specific Issues:**
1. **Vercel**: Check [Vercel documentation](https://vercel.com/docs) and community
2. **Railway**: Check [Railway documentation](https://docs.railway.app) and Discord
3. **MongoDB Atlas**: Check [Atlas documentation](https://docs.atlas.mongodb.com) and support
4. **Clerk.dev**: Check [Clerk documentation](https://clerk.dev/docs) and Discord
5. **Alchemy**: Check [Alchemy documentation](https://docs.alchemy.com) and support

**Authentication Issues:**
- Verify all environment variables are correctly set
- Check that webhook URLs are accessible
- Confirm API keys have correct permissions
- Test authentication flows in development first

**General Issues:**
- Create GitHub issue in project repository
- Include deployment logs and error messages
- Specify which authentication features are configured

---

## 🎯 Post-Deployment Checklist

### Essential Checks
- [ ] Frontend loads at production URL
- [ ] Backend API responds at production URL
- [ ] Database connection established
- [ ] Core functionality working (articles, algorithm state)

### Authentication Checks
- [ ] Email authentication (if configured):
  - [ ] Clerk modals open without errors
  - [ ] Webhook endpoint receiving events
  - [ ] User data syncing to MongoDB
- [ ] Web3 authentication (if configured):
  - [ ] Wallet connection working
  - [ ] NFT verification completing
  - [ ] Alchemy API responding
- [ ] Graceful fallbacks (always):
  - [ ] App works without auth keys
  - [ ] No runtime errors in console
  - [ ] Demo mode messaging appears

### Performance Checks
- [ ] Page load speeds acceptable
- [ ] API response times under 500ms
- [ ] No console errors or warnings (except auth key warnings)
- [ ] Mobile responsiveness working

### Security Checks
- [ ] Environment variables secured
- [ ] Admin access password-protected
- [ ] CORS properly configured
- [ ] HTTPS enforced

### Monitoring Setup
- [ ] Analytics tracking active (if configured)
- [ ] Error monitoring setup
- [ ] Performance monitoring active
- [ ] Database monitoring active

---

## 📋 Production Deployment Summary

**Deployment Date**: _Fill in after deployment_
**Frontend URL**: _https://your-project.vercel.app_
**Backend URL**: _https://your-backend.railway.app_
**Database**: _MongoDB Atlas cluster details_
**Authentication**: _Clerk.dev + Alchemy (optional)_
**Monitoring**: _Vercel Analytics + Railway metrics_

### Authentication Configuration Status
- [ ] **Clerk.dev Email Auth**: Configured / Not Configured / Optional
- [ ] **Alchemy Web3 Auth**: Configured / Not Configured / Optional  
- [ ] **WalletConnect**: Configured / Not Configured / Optional
- [ ] **Graceful Fallbacks**: ✅ Always Active

### Next Steps After Deployment
1. Test all authentication flows
2. Monitor user registration rates
3. Track feedback submission rates
4. Monitor performance metrics
5. Plan Phase 2B enhancements

---

**🎉 Congratulations! Your Arthrokinetix application with dual authentication is now live.**

*The platform now supports both traditional email authentication and modern Web3 NFT verification, providing users with flexible access options while maintaining robust security and graceful fallbacks.*