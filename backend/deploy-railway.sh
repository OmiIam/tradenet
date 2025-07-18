#!/bin/bash

# Railway Deployment Script
# This script helps deploy the Internet Banking Backend to Railway

set -e

echo "🚀 Internet Banking Backend - Railway Deployment"
echo "================================================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed."
    echo "   Install it with: npm install -g @railway/cli"
    exit 1
fi

# Check if user is logged in
if ! railway status &> /dev/null; then
    echo "🔐 Please login to Railway first:"
    railway login
fi

echo "✅ Railway CLI is ready"

# Build the project
echo "📦 Building TypeScript project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed"
    exit 1
fi

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully"
    echo ""
    echo "🎉 Your backend is now deployed!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set environment variables in Railway dashboard"
    echo "2. Update frontend BACKEND_URL to point to Railway"
    echo "3. Test the deployment with health check"
    echo ""
    echo "📖 See RAILWAY_DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Deployment failed"
    exit 1
fi