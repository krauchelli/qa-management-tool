#!/bin/bash
# First-time setup script for QA Management Tool on server

set -e

echo "🎯 QA Management Tool - First Time Setup"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "📝 Please install Docker first:"
    echo "   https://docs.docker.com/engine/install/"
    exit 1
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed!"
    echo "📝 Please install Docker Compose first"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env file"
    else
        cp .env.example .env
        echo "✅ Created new .env file from template"
    fi
else
    cp .env.example .env
    echo "✅ Created .env file from template"
fi

echo ""
echo "📝 Please edit .env file and set your configuration:"
echo "   - POSTGRES_PASSWORD (IMPORTANT!)"
echo "   - Other settings as needed"
echo ""
read -p "Press Enter when you're done editing .env..."

# Validate .env
if grep -q "your_secure_password_here" .env; then
    echo "⚠️  WARNING: You're still using the default password!"
    echo "   Please change POSTGRES_PASSWORD in .env"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🏗️  Building Docker images (this may take a few minutes)..."
docker compose -f docker-compose.prod.yml build

echo ""
echo "🚀 Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check if services are running
if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "📊 Service Status:"
    docker compose -f docker-compose.prod.yml ps
    echo ""
    echo "🌐 Your application is now running!"
    echo "   Frontend: http://localhost:85"
    echo "   Backend API: http://localhost:85/api"
    echo "   Health Check: http://localhost:85/api/health"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:    docker compose -f docker-compose.prod.yml logs -f"
    echo "   Stop:         docker compose -f docker-compose.prod.yml down"
    echo "   Restart:      docker compose -f docker-compose.prod.yml restart"
    echo "   Backup DB:    ./scripts/backup-db.sh"
    echo ""
    echo "📖 For more information, see DOCKER-DEPLOYMENT.md"
else
    echo ""
    echo "❌ Setup failed! Services are not running properly."
    echo "📋 Check logs for errors:"
    docker compose -f docker-compose.prod.yml logs
    exit 1
fi
