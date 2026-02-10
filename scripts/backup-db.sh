#!/bin/bash
# Database backup script

set -e

BACKUP_DIR="./backend/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="qa_db_backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "📦 Creating database backup..."

# Backup PostgreSQL database
docker exec qa-tool-postgres pg_dump -U qauser qa_management > "$BACKUP_DIR/$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_DIR/$BACKUP_FILE"

echo "✅ Backup created: $BACKUP_DIR/$BACKUP_FILE.gz"

# Keep only last 7 backups
echo "🧹 Cleaning old backups (keeping last 7)..."
cd "$BACKUP_DIR"
ls -t qa_db_backup_*.sql.gz | tail -n +8 | xargs -r rm

echo "✅ Backup complete!"
