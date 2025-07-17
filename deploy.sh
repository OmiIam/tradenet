#!/bin/bash

# Internet Banking Deployment Script
set -e

echo "🚀 Starting Internet Banking deployment..."

# Build and deploy with Docker Compose
echo "📦 Building Docker images..."
docker-compose build --no-cache

echo "🔧 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running successfully!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔗 Backend API: http://localhost:3001"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

echo "🎉 Deployment complete!"