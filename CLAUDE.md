# CLAUDE.md
Standard Workflow
1. First think through the problem, read the codebase for relevant files, and write a plan to todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Arthrokinetix is a dual-purpose platform that combines evidence-based medical research education with algorithmic art generation. The platform analyzes medical literature for emotional undertones and transforms this data into unique "Andry Tree" visualizations while providing a comprehensive medical content ecosystem.

## Development Commands

### Frontend (React 18)
```bash
cd frontend
yarn install          # Install dependencies (IMPORTANT: Use yarn, not npm)
yarn start            # Start development server (http://localhost:3000)
yarn build            # Build for production (CI=false is set)
yarn test             # Run tests with react-app-rewired
```

### Backend (FastAPI Python)
```bash
cd backend
pip install -r requirements.txt  # Install Python dependencies
python server.py                 # Start server (http://localhost:8001)
```

### Environment Setup
Create `.env` files in both frontend and backend directories. Check README.md for complete environment variable requirements including MongoDB, Anthropic API, and Clerk authentication keys.

## Architecture Overview

### Core Algorithm Integration
The project features a sophisticated dual-algorithm system:

- **Backend**: Python implementation in `backend/arthrokinetix_algorithm.py` that processes medical content and extracts emotional data
- **Frontend**: React component `frontend/src/components/RealArthrokinetixArtwork.js` that renders algorithmic art from processed data
- **Manual Algorithm**: Complete implementation that analyzes medical content structure, emotional journey, subspecialty detection, and generates visual elements

### Key Architecture Patterns

**Frontend Structure:**
- React 18 with modern hooks and functional components
- Tailwind CSS for utility-first styling
- Framer Motion for animations
- React Router for routing with legal page compliance
- Clerk.dev for email authentication
- Web3 infrastructure ready (currently disabled for stability)

**Backend Structure:**
- FastAPI for high-performance REST API
- MongoDB for document storage
- Anthropic Claude AI for emotional analysis
- Modular services architecture in `backend/services/`

**Algorithm Flow:**
1. Article content → Backend algorithm processing → Emotional data extraction
2. Visual element generation → Frontend rendering → Unique artwork creation
3. Real-time algorithm state management with user feedback influence

### Component Architecture

**Core Components:**
- `App.js`: Main application with route management and algorithm state
- `RealArthrokinetixArtwork.js`: Complete manual algorithm implementation for artwork generation
- `AlgorithmMoodIndicator.js`: Real-time algorithm emotional state display
- Authentication components with Clerk integration

**Page Structure:**
- `pages/Homepage.js`: Landing with algorithm state integration
- `pages/ArticlePage.js`: Medical content with emotional feedback system
- `pages/Gallery.js`: Artwork gallery with NFT minting integration
- `pages/ArtworkDetail.js`: Individual artwork views with sharing features

### Database Schema

**MongoDB Collections:**
- `articles`: Medical content with emotional analysis data
- `artworks`: Generated art with algorithm parameters
- `algorithm_states`: Persistent algorithm emotional state history
- `users`: User authentication and access management
- `feedback`: User feedback that influences algorithm evolution

## Development Guidelines

### Medical Content Processing
When working with article processing:
- Content flows through `backend/server.py` → `arthrokinetix_algorithm.py`
- Subspecialty detection uses keyword-based analysis
- Emotional analysis extracts hope, tension, confidence, uncertainty, breakthrough, and healing
- Visual elements generated include Andry Tree structures, healing particles, emotional fields

### Algorithm Integration
The manual algorithm is the authoritative implementation:
- Backend processes content and generates algorithm parameters
- Frontend receives parameters and renders visual elements
- Both implementations must stay synchronized for accurate artwork generation

### Testing Approach
- Backend: Use Python test framework for API endpoints
- Frontend: React Testing Library for component testing
- Manual testing checklist in README.md for algorithm accuracy

### Common Operations

**Adding New Subspecialties:**
1. Update keyword detection in `backend/arthrokinetix_algorithm.py`
2. Add visual styling in `frontend/src/components/RealArthrokinetixArtwork.js`
3. Update subspecialty-specific sections in both implementations

**Modifying Emotional Analysis:**
1. Update analysis logic in `backend/server.py` (process_article_emotions)
2. Ensure frontend algorithm state handling matches in `App.js`
3. Verify visual representation in artwork component

**Database Changes:**
- MongoDB connection handled in `backend/server.py`
- Collection initialization and indexing on startup
- Use consistent naming conventions (lowercase collection names)

## File Structure Notes

**Critical Files:**
- `backend/server.py`: Main API server with all endpoints
- `backend/arthrokinetix_algorithm.py`: Complete algorithm implementation
- `frontend/src/components/RealArthrokinetixArtwork.js`: Algorithm visualization
- `frontend/src/App.js`: Application orchestration with algorithm state

**Configuration:**
- `frontend/config-overrides.js`: Webpack configuration for Web3 polyfills
- `frontend/tailwind.config.js`: Tailwind CSS configuration
- `backend/requirements.txt`: Python dependencies with specific versions

## Authentication & Access Control

The platform uses Clerk.dev for email authentication with tiered access:
- Demo users: Limited functionality
- Email verified: Standard access
- NFT holders: Premium features (infrastructure ready)

Authentication state managed through React context with graceful fallbacks for unauthenticated users.

## NFT & Web3 Integration

Smart contract integration ready but Web3Provider currently disabled for stability:
- ERC721 contract for unique artworks
- ERC1155 contract for edition artworks  
- Manifold.xyz integration for minting
- Base L2 network configuration

## Special Considerations

**Content Processing:** Articles can be text, HTML, or PDF with different processing paths in the backend

**Algorithm State:** Persistent emotional state that evolves based on processed articles and user feedback

**Visual Generation:** Complex SVG generation with multiple layered elements including atmospheric particles, emotional fields, and tree structures

**Performance:** Frontend uses react-app-rewired for webpack customization; backend optimized for concurrent article processing

# Arthrokinetix - Phase 2 Preparation Project

## Current Implementation Status
- Manual algorithm complete and integrated in backend (Python)
- Frontend artwork generation matches manual algorithm (React)
- Tree structure rendering fixed with proper branch alternation
- Ready for comprehensive metadata collection implementation

## Immediate Goal
Implement comprehensive metadata collection and SVG generation as outlined in:
`docs/Comprehensive_Metadata_Implementation_Plan.md`

## Key Technical Context
- Backend: Python/FastAPI with MongoDB
- Frontend: React/Next.js with Framer Motion
- Algorithm: Custom HTML-to-Art transformation with emotional analysis
- Current Issue: Need metadata collection for Phase 2 AI evolution

## Implementation Priority
1. Week 1: Frontend metadata collection system 
2. Week 2: Backend visual element generation completion  
3. Week 3: Admin dashboard with SVG downloads

## Code Patterns to Maintain
- React: Functional components with hooks
- Python: Class-based algorithm with comprehensive docstrings
- API: FastAPI with proper error handling
- MongoDB: Document-based storage with proper indexing