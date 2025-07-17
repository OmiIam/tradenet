#!/bin/bash

echo "🚀 Setting up Internet Banking Backend..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "⚙️ Setting up environment variables..."
    cp .env.example .env
    echo "✅ Created .env file - please edit with your configuration"
else
    echo "⚙️ .env file already exists"
fi

# Create logs directory
mkdir -p logs

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

echo "✅ Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your MongoDB URI and JWT secrets"
echo "2. Start MongoDB: mongod"
echo "3. Start backend development server: cd backend && npm run dev"
echo "4. Backend will run on http://localhost:5000"
echo ""
echo "API Documentation: http://localhost:5000/api"
echo "Health Check: http://localhost:5000/health"