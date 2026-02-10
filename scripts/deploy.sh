#!/bin/bash
# Deployment script for QA Management Tool

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please copy .env.example to .env and configure it"
    exit 1
fi

# Load environment variables
source .env

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    exit 1
fi

echo "📦 Building Docker images..."
docker compose -f docker-compose.prod.yml build

echo "🔄 Stopping old containers..."
docker compose -f docker-compose.prod.yml down

echo "🚀 Starting new containers..."
docker compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check if services are running
if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Service Status:"
    docker compose -f docker-compose.prod.yml ps
    echo ""
    echo "🌐 Application should be available at: http://localhost:85"
    echo "📝 Backend API: http://localhost:85/api"
else
    echo "❌ Deployment failed! Check logs:"
    docker compose -f docker-compose.prod.yml logs
    exit 1
fi

echo ""
echo "📋 Useful commands:"
echo "  View logs:    docker compose -f docker-compose.prod.yml logs -f"
echo "  Stop:         docker compose -f docker-compose.prod.yml down"
echo "  Restart:      docker compose -f docker-compose.prod.yml restart"
echo "  Shell access: docker exec -it qa-tool-backend sh"
