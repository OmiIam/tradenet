# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Root Commands (Recommended)
```bash
npm run dev          # Start both frontend and backend in development mode
npm run build        # Build both frontend and backend for production
npm run start        # Start both frontend and backend in production mode
npm run install:all  # Install dependencies for all services
npm run lint         # Run ESLint on both frontend and backend
npm run test         # Run backend tests
```

### Frontend (Next.js) - Individual Commands
```bash
npm run dev:frontend    # Start frontend development server on localhost:3000
npm run build:frontend  # Build frontend for production
npm run start:frontend  # Start frontend production server
cd frontend && npm run lint      # Run ESLint on frontend
cd frontend && npm run init-db   # Initialize JSON database with test data
cd frontend && npm run seed-db   # Seed database (alias for init-db)
```

### Backend (Express.js) - Individual Commands
```bash
npm run dev:backend     # Start backend development server on localhost:3001
npm run build:backend   # Build backend for production
npm run start:backend   # Start backend production server
cd backend && npm run dev:full   # Start full backend server with advanced features
cd backend && npm run test       # Run Jest tests
cd backend && npm run lint       # Run ESLint
cd backend && npm run lint:fix   # Run ESLint with auto-fix
```

## Architecture Overview

This is a full-stack internet banking application with separate frontend and backend services:

### Frontend (Next.js 14 with App Router)
- **Framework**: Next.js 14 with App Router architecture
- **Authentication**: JWT-based with refresh tokens
- **Styling**: Tailwind CSS with glassmorphism design
- **Components**: Modular React components in `/components/`
- **API Routes**: Next.js API routes in `/app/api/`
- **Database**: JSON-based database via `/lib/database/json-db.ts`

### Backend (Express.js)
- **Framework**: Express.js with TypeScript
- **Authentication**: JWT tokens with bcrypt password hashing
- **Database**: Supports both JSON file storage and MongoDB (via Mongoose)
- **Security**: Helmet, CORS, rate limiting, input validation
- **Structure**: MVC pattern with routes, controllers, middleware, models

### Key Directories
- `/frontend/` - Next.js frontend application
  - `/frontend/app/` - Next.js App Router pages and API routes
  - `/frontend/components/` - Reusable React components
  - `/frontend/lib/` - Frontend utilities and database logic
  - `/frontend/types/` - TypeScript type definitions
  - `/frontend/scripts/` - Database initialization scripts
- `/backend/` - Express.js backend service
  - `/backend/src/` - Backend source code
  - `/backend/src/routes/` - API routes
  - `/backend/src/controllers/` - Route controllers
  - `/backend/src/middleware/` - Express middleware

### Database Architecture
The application uses a JSON-based database system for development:
- Primary database file: `/frontend/data.json` (auto-generated)
- Schema definition: `/frontend/lib/database/schema.sql`
- Initialization: `/frontend/lib/database/json-db.ts`

### User Roles and Authentication
- **Regular Users**: Standard banking features (accounts, transfers, payees)
- **Business Users**: Enhanced limits and business features
- **Admin Users**: Full admin panel access with user/account management

### API Structure
- Frontend API routes: `/frontend/app/api/`
- Backend routes: `/backend/src/routes/`
- Authentication middleware: `/backend/src/middleware/auth.ts`
- Input validation: Express-validator and Joi schemas

## Development Workflow

1. **Initial Setup**: Run `npm run install:all` to install all dependencies
2. **Database Setup**: Run `cd frontend && npm run init-db` to create test data
3. **Development**: Use `npm run dev` to start both frontend and backend servers
4. **Testing**: Access test users at `/login` with credentials from README.md

## Deployment

### Docker Deployment
```bash
# Build and deploy with Docker Compose
./deploy.sh

# Or manually:
docker-compose build
docker-compose up -d
```

### Manual Deployment
```bash
# Build both services
npm run build

# Start both services
npm run start
```

## Important Notes

- The application uses TypeScript path mapping (`@/*` maps to root)
- ESLint is configured to ignore during builds (see `next.config.js`)
- Backend has both simple and full server implementations
- Database is JSON-based for development; production would use MongoDB
- Security features include rate limiting, CORS, and input validation