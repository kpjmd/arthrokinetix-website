# 🧬 Arthrokinetix

**Revolutionary platform where medical research meets emotional intelligence and algorithmic art**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/arthrokinetix)

## 🎯 Overview

Arthrokinetix is a groundbreaking dual-purpose platform that combines:
- **Evidence-based medical research education** (orthopedic surgery & sports medicine)
- **Algorithmic art generation** from emotional analysis of medical literature  
- **Emotional intelligence AI** that evolves based on content and user feedback

### 🔬 Core Innovation
A proprietary algorithm that analyzes medical literature for emotional undertones (hope, confidence, healing, breakthrough, tension, uncertainty) and transforms this data into unique "Andry Tree" visualizations and emotional signatures.

---

## ✨ Features

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
- **Advanced search** across articles, signatures, and artworks
- **User profiles** with signature collections
- **Newsletter system** with access control
- **Web3 integration** with wallet connection and NFT verification

---

## 🏗️ Technical Architecture

### **Frontend**
- **React 18** with modern hooks and functional components
- **Tailwind CSS** for responsive, utility-first styling
- **Framer Motion** for smooth animations and interactions
- **React Router** for client-side routing
- **Zustand** for lightweight state management

### **Backend**
- **FastAPI** for high-performance Python REST API
- **MongoDB** for flexible document storage
- **Claude AI (Anthropic)** for emotional analysis
- **Modular service architecture** with separated concerns

### **Key Services**
- **Claude Analysis Service** - Emotional analysis with caching
- **Arthrokinetix Engine** - Proprietary algorithm for art generation
- **Enhanced API Structure** - RESTful endpoints with proper error handling

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Python** 3.8+ and pip
- **MongoDB** (local or Atlas)
- **Claude API key** from Anthropic

### 1. Clone Repository
```bash
git clone https://github.com/your-username/arthrokinetix.git
cd arthrokinetix
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual values
nano .env
```

Required environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/arthrokinetix
ANTHROPIC_API_KEY=your_claude_api_key
ADMIN_PASSWORD=your_secure_password
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 3. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 4. Frontend Setup
```bash
cd frontend
yarn install
yarn start
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **Admin Dashboard**: http://localhost:3000/admin (password from .env)

---

## 📁 Project Structure

```
arthrokinetix/
├── 📁 backend/                 # FastAPI backend
│   ├── server.py              # Main FastAPI application
│   ├── enhanced_server.py     # Enhanced server with Priority 5
│   ├── 📁 services/           # Modular services
│   │   ├── claude_analysis.py # Claude AI service
│   │   └── arthrokinetix_engine.py # Art generation engine
│   └── requirements.txt       # Python dependencies
├── 📁 frontend/               # React frontend  
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable components
│   │   ├── 📁 pages/          # Page components
│   │   └── App.js             # Main React app
│   └── package.json           # Node.js dependencies
├── 📁 docs/                   # Documentation
├── vercel.json                # Vercel deployment config
└── README.md                  # This file
```

---

## 🔗 API Endpoints

### Core Endpoints
- `GET /api/` - Health check and API info
- `GET /api/algorithm-state` - Current algorithm emotional state
- `GET /api/articles` - Medical research articles
- `GET /api/artworks` - Generated artworks gallery

### Priority 5 Features
- `GET /api/signatures/available` - Available signature collections
- `GET /api/signatures/collection/{email}` - User's collected signatures
- `POST /api/signatures/collect` - Collect a signature
- `GET /api/algorithm/evolution` - Algorithm development timeline
- `GET /api/search` - Enhanced search with filters

### Admin Endpoints
- `POST /api/admin/authenticate` - Admin authentication
- `POST /api/admin/articles` - Create articles (authenticated)
- `GET /api/admin/analytics` - Admin analytics (authenticated)

---

## 🧪 Testing

### Manual Testing
```bash
# Test backend health
curl http://localhost:8001/

# Test algorithm state
curl http://localhost:8001/api/algorithm-state

# Test admin auth
curl -X POST http://localhost:8001/api/admin/authenticate \
  -H "Content-Type: application/json" \
  -d '{"password": "your_admin_password"}'
```

### Automated Testing
```bash
# Run frontend tests
cd frontend && yarn test

# Run backend tests  
cd backend && python -m pytest
```

---

## 🌍 Deployment

### Production Deployment (Vercel + MongoDB Atlas)

1. **Prepare MongoDB Atlas**
   - Create cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Configure network access for Vercel
   - Get connection string

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

3. **Configure Environment Variables**
   Add these to Vercel project settings:
   - `MONGODB_URI` - Your Atlas connection string
   - `ANTHROPIC_API_KEY` - Your Claude API key
   - `ADMIN_PASSWORD` - Secure admin password
   - `REACT_APP_BACKEND_URL` - Your Vercel app URL

4. **Verify Deployment**
   - Check all pages load correctly
   - Test API endpoints
   - Verify admin access
   - Test database connectivity

**📋 See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide**
**✅ See [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) for launch checklist**

---

## 🔧 Development

### Local Development Setup
```bash
# Start MongoDB (if local)
mongod --dbpath /your/db/path

# Start backend with hot reload
cd backend && uvicorn server:app --reload

# Start frontend with hot reload  
cd frontend && yarn start
```

### Adding New Features
1. Backend: Add endpoint in `server.py` or service in `services/`
2. Frontend: Create component in `components/` or page in `pages/`
3. Update API documentation
4. Add tests
5. Update environment variables if needed

### Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📊 Monitoring & Analytics

### Performance Monitoring
- **Vercel Analytics** - Built-in performance monitoring
- **MongoDB Atlas** - Database performance metrics
- **Custom metrics** - Algorithm evolution tracking

### Error Tracking
- **Vercel Logs** - Server-side error logging
- **Browser Console** - Client-side error tracking
- **API Monitoring** - Endpoint health monitoring

---

## 🔐 Security

### Authentication
- **Admin password protection** for sensitive operations
- **Environment variable security** for API keys
- **Input validation** on all API endpoints

### Data Protection
- **MongoDB security** with proper user permissions
- **CORS configuration** for secure cross-origin requests
- **Rate limiting** to prevent abuse

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Support

### Documentation
- **API Documentation**: Available at `/api/docs` when server is running
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Production Checklist**: [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)

### Getting Help
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@arthrokinetix.com

### Community
- **GitHub**: [@arthrokinetix](https://github.com/arthrokinetix)
- **Twitter**: [@arthrokinetix](https://twitter.com/arthrokinetix)

---

## 🎨 Screenshots

### Homepage
![Homepage with split hero design showing medical research and algorithmic art](docs/images/homepage.png)

### Research Hub  
![Interactive research browser with emotional analysis](docs/images/research-hub.png)

### Gallery
![Algorithmic artwork gallery with generated signatures](docs/images/gallery.png)

### Admin Dashboard
![Content management system for articles and artworks](docs/images/admin-dashboard.png)

---

## 🗺️ Roadmap

### Completed ✅
- [x] Core platform architecture
- [x] Medical research integration
- [x] Algorithmic art generation
- [x] Priority 5 features (Enhanced search, Signature collection, Algorithm evolution)
- [x] Web3 integration
- [x] Admin dashboard
- [x] Production deployment setup

### Upcoming 🚧
- [ ] Mobile app development
- [ ] Advanced AI models integration
- [ ] Real-time collaboration features
- [ ] Enhanced analytics dashboard
- [ ] Multi-language support

---

## 💡 Innovation Highlights

1. **Unique Emotional Analysis**: First platform to analyze medical literature for emotional patterns
2. **Algorithmic Art Creation**: Proprietary system generating art from research emotions
3. **Community-Driven Evolution**: Algorithm learns and evolves from user feedback
4. **Medical-Art Bridge**: Revolutionary connection between scientific research and creative expression
5. **Web3 Integration**: Modern blockchain features with traditional research platform

---

**Made with ❤️ by the Arthrokinetix Team**

*Bridging the gap between medical science and digital art through emotional intelligence*