# Docker Deployment Guide

## 📋 Prerequisites

1. **Docker & Docker Compose** installed on your server
2. **GitHub Actions Runner** configured (named `fedora`)
3. **Git** installed
4. **Port available**: 85 (frontend), 5432 (postgres - internal only)

## 🚀 Quick Start

### 1. Clone Repository on Server

```bash
cd /home/your-user/
git clone https://github.com/your-username/qa-management-tool.git
cd qa-management-tool
```

### 2. Create Environment File

```bash
cp .env.example .env
nano .env
```

Update the following:
```env
POSTGRES_PASSWORD=your_secure_password_here
NODE_ENV=production
PORT=3000
```

### 3. Deploy

```bash
# Option A: Use deployment script
./scripts/deploy.sh

# Option B: Manual deployment
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### 4. Verify Deployment

```bash
# Check running containers
docker compose -f docker-compose.prod.yml ps

# Check logs
docker compose -f docker-compose.prod.yml logs -f

# Test health check
curl http://localhost:85/api/health
```

## 🔄 GitHub Actions Auto-Deployment

The repository is configured for automatic deployment when you push to `main` branch.

### Setup GitHub Actions Runner

1. **On your server**, install GitHub Actions runner:

```bash
# Create a folder
mkdir actions-runner && cd actions-runner

# Download the latest runner package
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Create the runner and start the configuration
./config.sh --url https://github.com/your-username/qa-management-tool --token YOUR_TOKEN

# Use "fedora" as the runner name when prompted

# Install as service
sudo ./svc.sh install
sudo ./svc.sh start
```

2. **Verify runner** is online in GitHub:
   - Go to: Settings → Actions → Runners
   - You should see "fedora" runner with green status

### How Auto-Deployment Works

When you push to `main`:

1. GitHub triggers the workflow (`.github/workflows/deploy.yml`)
2. Runner pulls latest code
3. Builds Docker images
4. Restarts containers with new code
5. Cleans up old images

**Workflow file**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Home Server
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: fedora  # Your self-hosted runner
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Build and Restart Services
        run: |
          docker compose -f docker-compose.prod.yml build
          docker compose -f docker-compose.prod.yml up -d
          
      - name: Cleanup Old Images
        run: docker image prune -f
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Nginx (Frontend)                │
│         Port 85                         │
│  - Serves Vue.js static files          │
│  - Proxies /api to backend             │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Express (Backend)               │
│         Port 3000 (internal)            │
│  - REST API                             │
│  - Prisma ORM                           │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         PostgreSQL                      │
│         Port 5432 (internal)            │
│  - Persistent data storage              │
│  - Volume: postgres_data                │
└─────────────────────────────────────────┘
```

## 📦 Docker Services

### Frontend (Nginx)
- **Image**: Built from `frontend/Dockerfile`
- **Port**: 85 (exposed), 80 (internal)
- **Purpose**: Serves static files and proxies API requests

### Backend (Node.js)
- **Image**: Built from `backend/Dockerfile`
- **Port**: 3000 (internal only)
- **Purpose**: REST API server

### PostgreSQL
- **Image**: `postgres:15-alpine`
- **Port**: 5432 (internal only)
- **Volume**: `postgres_data` (persistent)

## 🛠️ Management Commands

### View Logs
```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f postgres
```

### Restart Services
```bash
# All services
docker compose -f docker-compose.prod.yml restart

# Specific service
docker compose -f docker-compose.prod.yml restart backend
```

### Stop Services
```bash
docker compose -f docker-compose.prod.yml down
```

### Access Container Shell
```bash
# Backend
docker exec -it qa-tool-backend sh

# Frontend
docker exec -it qa-tool-frontend sh

# Database
docker exec -it qa-tool-postgres psql -U qauser -d qa_management
```

### Database Operations
```bash
# Backup database
./scripts/backup-db.sh

# Restore from backup
gunzip -c backend/backups/qa_db_backup_YYYYMMDD_HHMMSS.sql.gz | \
  docker exec -i qa-tool-postgres psql -U qauser -d qa_management

# Run migrations
docker exec qa-tool-backend npx prisma migrate deploy
```

## 🔧 Troubleshooting

### Container won't start
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs backend

# Check if port is in use
sudo lsof -i :85
sudo lsof -i :3000
```

### Database connection issues
```bash
# Check if postgres is running
docker compose -f docker-compose.prod.yml ps postgres

# Check postgres logs
docker compose -f docker-compose.prod.yml logs postgres

# Test connection
docker exec qa-tool-postgres pg_isready -U qauser
```

### Frontend can't reach backend
```bash
# Check nginx config
docker exec qa-tool-frontend cat /etc/nginx/conf.d/default.conf

# Check backend health
curl http://localhost:85/api/health
```

### Rebuild from scratch
```bash
# Stop and remove everything
docker compose -f docker-compose.prod.yml down -v

# Rebuild
docker compose -f docker-compose.prod.yml build --no-cache

# Start fresh
docker compose -f docker-compose.prod.yml up -d
```

## 🔐 Security Considerations

1. **Change default passwords** in `.env`
2. **Use HTTPS** in production (add reverse proxy like Caddy/Traefik)
3. **Firewall rules**: Only expose port 85/443
4. **Regular backups**: Run `./scripts/backup-db.sh` daily
5. **Update images**: Regularly rebuild with latest base images

## 📊 Monitoring

### Check Service Health
```bash
# All services status
docker compose -f docker-compose.prod.yml ps

# Resource usage
docker stats qa-tool-frontend qa-tool-backend qa-tool-postgres
```

### Database Size
```bash
docker exec qa-tool-postgres psql -U qauser -d qa_management -c \
  "SELECT pg_size_pretty(pg_database_size('qa_management'));"
```

## 🔄 Updates

### Manual Update
```bash
cd qa-management-tool
git pull origin main
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### Automatic Update
Just push to `main` branch - GitHub Actions will handle it!

## 📝 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `POSTGRES_PASSWORD` | Database password | - | ✅ |
| `NODE_ENV` | Environment | production | ✅ |
| `PORT` | Backend port | 3000 | ❌ |
| `DATABASE_URL` | Auto-generated | - | ❌ |

## 🎯 Next Steps

1. ✅ Setup GitHub Actions runner
2. ✅ Create `.env` file
3. ✅ Deploy with `./scripts/deploy.sh`
4. ⏳ Setup HTTPS (optional but recommended)
5. ⏳ Setup automated backups (cron job)
6. ⏳ Setup monitoring (optional)

## 📞 Support

If you encounter issues:
1. Check logs: `docker compose -f docker-compose.prod.yml logs -f`
2. Verify environment: `cat .env`
3. Check runner status: GitHub → Settings → Actions → Runners
4. Review this guide's troubleshooting section
