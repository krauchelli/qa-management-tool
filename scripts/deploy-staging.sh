#!/bin/bash
# Manual deployment script for staging server

set -e

echo "🚀 Deploying to Staging Server..."
echo ""

# Check if we're on staging branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "staging" ]; then
    echo "⚠️  Warning: You're on branch '$CURRENT_BRANCH', not 'staging'"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin staging

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm run build
cd ..

# Build backend
echo "🏗️ Building backend..."
cd backend
npm run build
cd ..

# Setup database
echo "🗄️ Setting up database..."
cd backend
npx prisma generate
npx prisma migrate deploy || npx prisma db push
cd ..

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Restart services
echo "🔄 Restarting services with PM2..."

# Stop old processes
pm2 stop qa-tool-backend || true
pm2 stop qa-tool-frontend || true
pm2 delete qa-tool-backend || true
pm2 delete qa-tool-frontend || true

# Start backend
cd backend
pm2 start npm --name "qa-tool-backend" -- start
cd ..

# Start frontend
cd frontend
pm2 start npm --name "qa-tool-frontend" -- run preview -- --port 5174 --host
cd ..

# Save PM2 config
pm2 save

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📊 PM2 Status:"
pm2 list
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:5174"
echo "   Backend:  http://localhost:3000"
echo ""
echo "📋 Useful commands:"
echo "   pm2 logs qa-tool-backend    # View backend logs"
echo "   pm2 logs qa-tool-frontend   # View frontend logs"
echo "   pm2 restart all             # Restart all services"
echo "   pm2 stop all                # Stop all services"
echo "   pm2 monit                   # Monitor resources"
