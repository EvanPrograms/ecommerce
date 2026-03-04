#!/bin/bash
# Run this script on the EC2 instance to install PostgreSQL and restore from backup.
# Prerequisites: cd ~/ecommerce && git pull first
# Usage: cd ~/ecommerce && sudo ./scripts/setup-postgres-on-ec2.sh

set -e

DB_NAME="chocolate_shop"
DB_USER="postgres"
DB_PASSWORD="computer"

# Find backup - check repo root (parent of scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_PATH="${BACKUP_PATH:-$REPO_ROOT/chocolate_shop_backup.sql}"
[ ! -f "$BACKUP_PATH" ] && BACKUP_PATH="/home/ubuntu/ecommerce/chocolate_shop_backup.sql"
[ ! -f "$BACKUP_PATH" ] && BACKUP_PATH="/home/ec2-user/ecommerce/chocolate_shop_backup.sql"

echo "==> Installing PostgreSQL..."
apt-get update -y
apt-get install -y postgresql postgresql-contrib

echo "==> Starting PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

echo "==> Setting postgres password and creating database..."
sudo -u postgres psql -c "ALTER USER postgres PASSWORD '$DB_PASSWORD';" 2>/dev/null || true
sudo -u postgres psql -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"

echo "==> Restoring from backup..."
if [ ! -f "$BACKUP_PATH" ]; then
    echo "ERROR: Backup not found at $BACKUP_PATH"
    echo "Run: cd ~/ecommerce && git pull --ff-only origin main"
    exit 1
fi
sudo -u postgres psql -d "$DB_NAME" -f "$BACKUP_PATH"

echo "==> Done! PostgreSQL is running on localhost. Update .env to use DB_HOST=localhost and restart the backend."
