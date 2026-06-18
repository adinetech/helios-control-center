#!/bin/bash
# SolarOps Database Backup Script
# Retains backups for 30 days

BACKUP_DIR="/var/backups/solarops"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
DB_CONTAINER="helios-postgres"
DB_USER="admin"
DB_NAME="helios"
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"

echo "Starting SolarOps database backup..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Execute pg_dump inside the postgres container, gzip it, and save to host
docker exec -t $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_FILE"
else
  echo "Backup failed!"
  exit 1
fi

# Clean up backups older than 30 days
echo "Cleaning up old backups..."
find "$BACKUP_DIR" -type f -name "db_backup_*.sql.gz" -mtime +30 -exec rm {} \;

echo "Backup process completed."
