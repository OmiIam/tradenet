# Internet Banking Backend API

Production-grade banking backend API built with Express.js, TypeScript, and MongoDB.

## Features

- ✅ **Authentication & Authorization**: JWT-based auth with httpOnly cookies
- ✅ **Security**: Rate limiting, request validation, security headers, input sanitization
- ✅ **Database**: MongoDB with Mongoose ODM and proper indexing
- ✅ **Error Handling**: Comprehensive error handling with logging
- ✅ **Validation**: Request validation with express-validator
- ✅ **Logging**: Winston-based structured logging
- ✅ **CORS**: Configurable CORS with credentials support
- ✅ **TypeScript**: Full TypeScript support with strict configuration

## Prerequisites

- Node.js 18+ 
- MongoDB 5.0+
- npm or yarn

## Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/internet_banking
   JWT_SECRET=your-super-secret-jwt-key-256-bits
   JWT_REFRESH_SECRET=your-refresh-secret-256-bits
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Accounts
- `GET /api/accounts` - Get user accounts
- `POST /api/accounts` - Create new account

### Transactions
- `GET /api/transactions` - Get transactions
- `POST /api/transactions/transfer` - Transfer money

### Payees
- `GET /api/payees` - Get payees
- `POST /api/payees` - Add payee

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get system statistics

### System
- `GET /health` - Health check
- `GET /api` - API information

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes (configurable)
- **Authentication Rate Limiting**: 5 login attempts per 15 minutes
- **Security Headers**: Helmet.js for security headers
- **Input Sanitization**: XSS protection
- **Account Locking**: Automatic account locking after failed attempts
- **CORS**: Configurable CORS with credentials
- **Request Validation**: Comprehensive input validation

## Database Schema

### User Model
- Email, password (hashed), personal information
- Account locking, login attempts tracking
- Two-factor authentication support
- Email/phone verification

### Account Model
- Multiple account types (checking, savings, business, credit)
- Balance tracking with overdraft protection
- Account status management

### Transaction Model (TODO)
- Full transaction history
- Transfer tracking
- Category management

## Logging

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- Console - Development mode

## Error Handling

- Operational vs Programming errors
- Structured error responses
- Proper HTTP status codes
- Error logging and monitoring

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secrets (256-bit)
3. Enable HTTPS
4. Set up MongoDB replica set
5. Configure proper CORS origins
6. Set up log aggregation
7. Configure monitoring

## Next Steps

1. Complete account management endpoints
2. Implement transaction processing
3. Add payee management
4. Implement admin dashboard APIs
5. Add comprehensive testing
6. Set up CI/CD pipeline
7. Add API documentation (Swagger)
8. Implement audit logging