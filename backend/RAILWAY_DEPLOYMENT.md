# Railway Deployment Guide

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Railway CLI**: Install the Railway CLI
   ```bash
   npm install -g @railway/cli
   ```

## Deployment Steps

### 1. Login to Railway
```bash
railway login
```

### 2. Initialize Railway Project
```bash
railway init
```

### 3. Deploy to Railway
```bash
railway up
```

### 4. Set Environment Variables

In your Railway dashboard, go to your project settings and add these environment variables:

**Required Variables:**
- `PORT`: Will be set automatically by Railway
- `NODE_ENV`: `production`
- `JWT_SECRET`: Generate a secure 256-bit key
- `JWT_REFRESH_SECRET`: Generate a secure 256-bit key
- `FRONTEND_URL`: Your frontend URL (e.g., `https://your-app.vercel.app`)
- `ALLOWED_ORIGINS`: Your frontend URL (same as above)

**Optional Variables:**
- `JWT_EXPIRE`: `1h` (default)
- `JWT_REFRESH_EXPIRE`: `7d` (default)
- `BCRYPT_ROUNDS`: `12` (default)
- `RATE_LIMIT_WINDOW_MS`: `900000` (default)
- `RATE_LIMIT_MAX_REQUESTS`: `100` (default)
- `LOG_LEVEL`: `info` (default)

### 5. Generate Secure JWT Secrets

Use these commands to generate secure secrets:

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Refresh Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Configure Database

The backend uses SQLite for simplicity. Railway will automatically create the database file. The application will initialize with test data on first run.

### 7. Update Frontend Environment

Update your frontend's `BACKEND_URL` or `NEXT_PUBLIC_API_URL` to point to your Railway deployment:

```
BACKEND_URL=https://your-railway-app.up.railway.app
```

## Monitoring

- **Logs**: View logs in Railway dashboard
- **Metrics**: Monitor performance in Railway dashboard
- **Health Check**: Available at `https://your-railway-app.up.railway.app/health`

## Testing the Deployment

1. **Health Check**: `GET /health`
2. **API Documentation**: `GET /api`
3. **Login Test**: `POST /api/auth/login`
   ```json
   {
     "email": "admin@primeedge.com",
     "password": "admin123"
   }
   ```

## Troubleshooting

1. **Build Failures**: Check Railway logs for build errors
2. **Database Issues**: Ensure SQLite is properly initialized
3. **CORS Errors**: Verify `FRONTEND_URL` and `ALLOWED_ORIGINS` are correct
4. **JWT Errors**: Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set

## Security Notes

- ✅ Use secure JWT secrets (256-bit minimum)
- ✅ Set `NODE_ENV=production`
- ✅ Configure proper CORS origins
- ✅ Use HTTPS for all communications
- ✅ Monitor logs for security issues