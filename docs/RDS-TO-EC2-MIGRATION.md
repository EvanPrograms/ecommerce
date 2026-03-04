# Migrating PostgreSQL from RDS to EC2

This guide moves your database from RDS to the same EC2 instance as the backend, eliminating RDS costs.

## Prerequisites

- SSH access to your EC2 instance
- Backup file `chocolate_shop_backup.sql` (already in repo)
- Ubuntu-based AMI (script uses `apt-get`). For Amazon Linux, install Postgres manually: `sudo amazon-linux-extras install postgresql14`

## Steps

### 1. SSH into EC2 and pull latest code

```bash
ssh -i "/c/Users/Build/Downloads/acekey.pem" ec2-user@18.216.2.204
# Or: ssh -i "/c/Users/Build/Downloads/acekey.pem" ubuntu@18.216.2.204
```

```bash
cd ~/ecommerce
git pull --ff-only origin main
```

### 2. Run the setup script on EC2

```bash
cd ~/ecommerce
chmod +x scripts/setup-postgres-on-ec2.sh
sudo ./scripts/setup-postgres-on-ec2.sh
```

This installs PostgreSQL, creates the database, and restores from your backup.

### 3. Update .env on EC2

The repo's `.env.production` already uses `localhost`. Make sure the EC2 has it:

```bash
cd ~/ecommerce/backend
# Verify .env has DB_HOST=localhost and DATABASE_URL=postgres://postgres:computer@localhost:5432/chocolate_shop
grep DB_ .env.production
```

If you have a separate `.env` or `.env.production` on the server, update `DB_HOST` and `DATABASE_URL` to use `localhost`.

### 4. Restart the backend

```bash
cd ~/ecommerce/backend
pm2 restart index --update-env
pm2 logs index --lines 50
```

### 5. Verify the app works

Visit https://passionchocolates.com and confirm products load, login works, etc.

### 6. Destroy RDS via Terraform

Once everything works, remove RDS from your AWS account:

```bash
cd backend/terraform
terraform plan   # Review - should show RDS will be destroyed
terraform apply  # Confirm when prompted
```

---

**Note:** If your EC2 uses `ec2-user` instead of `ubuntu`, the backup path in the script may differ. Set it explicitly:

```bash
sudo BACKUP_PATH=/home/ec2-user/ecommerce/chocolate_shop_backup.sql ./scripts/setup-postgres-on-ec2.sh
```
