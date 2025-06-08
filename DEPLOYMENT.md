# Arthrokinetix Deployment Guide

## 🚀 Production Deployment Setup

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **Anthropic API**: Get API key from [console.anthropic.com](https://console.anthropic.com)
4. **GitHub Repository**: Push your code to GitHub

---

## 📁 Project Structure

```
arthrokinetix/
├── frontend/          # React frontend
├── backend/           # FastAPI backend
├── vercel.json        # Vercel deployment config
├── .env.example       # Environment variables template
└── DEPLOYMENT.md      # This guide
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
   - **Cluster Tier**: M0 Sandbox (Free)

### Step 2: Configure Network Access

1. Go to **Network Access** in MongoDB Atlas
2. Add IP address: `0.0.0.0/0` (allow from anywhere for Vercel)
3. Or add specific Vercel IP ranges for better security

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

---

## 🔧 Environment Variables Setup

### Step 1: Copy Environment Template

```bash
cp .env.example .env
```

### Step 2: Fill in Production Values

Edit `.env` with your production values:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/arthrokinetix

# Claude AI
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key

# Security
ADMIN_PASSWORD=your-secure-admin-password
JWT_SECRET=your-256-bit-random-secret

# Web3 (optional)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-project-id

# Newsletter (optional)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Production URLs
REACT_APP_BACKEND_URL=https://your-project.vercel.app
FRONTEND_URL=https://your-project.vercel.app

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

---

## 🚀 Vercel Deployment

### Step 1: Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (keep default)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/build`

### Step 2: Configure Environment Variables

In Vercel project settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `MONGODB_URI` | Your MongoDB Atlas connection string | Production, Preview |
| `ANTHROPIC_API_KEY` | Your Claude API key | Production, Preview |
| `ADMIN_PASSWORD` | Your admin password | Production, Preview |
| `REACT_APP_BACKEND_URL` | `https://your-project.vercel.app` | Production, Preview |
| `NODE_ENV` | `production` | Production |

### Step 3: Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Your app will be available at `https://your-project.vercel.app`

---

## 🔗 Custom Domain (Optional)

1. Go to your Vercel project → Settings → Domains
2. Add your custom domain: `arthrokinetix.com`
3. Configure DNS records as instructed by Vercel
4. Update environment variables to use new domain

---

## 📊 Monitoring & Analytics

### Google Analytics Setup

1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get tracking ID (G-XXXXXXXXXX)
3. Add to environment variables: `NEXT_PUBLIC_GA_TRACKING_ID`

### Error Tracking with Sentry

1. Create project at [sentry.io](https://sentry.io)
2. Get DSN
3. Add to environment variables: `SENTRY_DSN`

---

## 🔒 Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` files to git
- ✅ Use strong, unique passwords
- ✅ Rotate API keys regularly
- ✅ Use different keys for development/production

### 2. Database Security

- ✅ Enable MongoDB Atlas IP whitelisting
- ✅ Use database user with minimal required permissions
- ✅ Enable audit logs in MongoDB Atlas

### 3. API Security

- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Use HTTPS only in production
- ✅ Implement proper CORS policies

---

## 🧪 Testing Deployment

### 1. Smoke Tests

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] API endpoints respond: `https://your-app.vercel.app/api/`
- [ ] Algorithm state displays
- [ ] Admin dashboard accessible
- [ ] Newsletter subscription works
- [ ] Database connections work

### 2. Performance Tests

- [ ] Lighthouse score > 90
- [ ] Page load time < 3s
- [ ] API response time < 500ms

### 3. Functional Tests

- [ ] Article creation workflow
- [ ] Signature generation
- [ ] Admin authentication
- [ ] Newsletter subscription
- [ ] Search functionality

---

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear cache and rebuild
vercel --prod --force
```

**Database Connection Issues:**
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure user permissions are correct

**Environment Variable Issues:**
- Verify all required variables are set
- Check variable names match exactly
- Redeploy after adding new variables

**CORS Errors:**
- Check CORS_ORIGINS environment variable
- Verify frontend/backend URLs match

### Logs

View deployment logs:
```bash
vercel logs your-deployment-url
```

View function logs in Vercel dashboard:
1. Go to project → Functions tab
2. Click on function name
3. View real-time logs

---

## 🔄 CI/CD Pipeline

### Automatic Deployments

Vercel automatically deploys when you:
1. Push to `main` branch (production)
2. Push to any branch (preview deployments)
3. Open pull requests (preview deployments)

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## 📈 Scaling Considerations

### Performance Optimization

1. **Frontend:**
   - Enable Vercel Edge Network
   - Implement image optimization
   - Use lazy loading for components
   - Minimize bundle size

2. **Backend:**
   - Implement Redis caching
   - Add database indexing
   - Use connection pooling
   - Implement rate limiting

3. **Database:**
   - Upgrade MongoDB Atlas tier as needed
   - Add database indexes
   - Implement data archiving
   - Monitor performance metrics

### Cost Optimization

1. **Vercel:**
   - Monitor function execution time
   - Optimize cold start performance
   - Use Edge Functions where appropriate

2. **MongoDB Atlas:**
   - Monitor data usage
   - Implement data retention policies
   - Use appropriate cluster size

---

## 📞 Support

For deployment issues:
1. Check Vercel documentation
2. MongoDB Atlas support
3. Anthropic API documentation
4. Create GitHub issue in project repository

---

## 🎯 Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connected and populated
- [ ] Admin access working
- [ ] Analytics tracking active
- [ ] Error monitoring setup
- [ ] Performance monitoring active
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured

---

**Deployment Date**: _Fill in after deployment_
**Deployed URL**: _Fill in after deployment_
**Database**: _Fill in connection details_
**Monitoring**: _Fill in monitoring URLs_