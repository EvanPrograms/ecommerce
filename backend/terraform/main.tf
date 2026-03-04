# Define the AWS provider
provider "aws" {
  region = "us-east-2" # Change to your desired region
}

# Define an S3 bucket for video storage
resource "aws_s3_bucket" "video_storage" {
  bucket        = "product-review-videos-${random_string.suffix.result}"
  force_destroy = true

  tags = {
    Name        = "Product Review Videos"
    Environment = "production"
  }
}

resource "aws_s3_bucket_versioning" "video_storage" {
  bucket = aws_s3_bucket.video_storage.id

  versioning_configuration {
    status = "Enabled"
  }
}


resource "aws_s3_bucket_website_configuration" "video_storage" {
  bucket = aws_s3_bucket.video_storage.id

  index_document {
    suffix = "index.html"
  }
}


resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# IAM role for your server (optional)
resource "aws_iam_role" "server_role" {
  name = "backend-server-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "ec2.amazonaws.com" }
      }
    ]
  })
}

# Attach permissions for S3
resource "aws_iam_role_policy" "s3_access" {
  name = "s3-access-policy"
  role = aws_iam_role.server_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Action    = ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"]
        Resource  = ["${aws_s3_bucket.video_storage.arn}/*"]
      }
    ]
  })
}

# EC2 instance to host your backend and PostgreSQL
resource "aws_instance" "backend_server" {
  ami           = "ami-088d38b423bff245f" # Use a Node.js-ready AMI
  instance_type = "t2.micro"
  key_name      = var.key_name

  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y nodejs npm postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
    sudo -u postgres psql -c "ALTER USER postgres PASSWORD '${var.postgres_password}';" 2>/dev/null || true
    sudo -u postgres psql -c "CREATE DATABASE chocolate_shop;" 2>/dev/null || true
    cd /home/ubuntu
    git clone https://github.com/EvanPrograms/ecommerce.git
    [ -f /home/ubuntu/ecommerce/chocolate_shop_backup.sql ] && sudo -u postgres psql -d chocolate_shop -f /home/ubuntu/ecommerce/chocolate_shop_backup.sql 2>/dev/null || true
    cd ecommerce/backend
    npm install
    npm start
  EOF

  tags = {
    Name        = "Backend Server"
    Environment = "production"
  }
}

# Output the S3 bucket name
output "s3_bucket_name" {
  value = aws_s3_bucket.video_storage.bucket
}

# Output the backend server public IP
output "backend_server_ip" {
  value = aws_instance.backend_server.public_ip
}


resource "aws_eip" "backend_eip" {
  instance = aws_instance.backend_server.id
  domain   = "vpc" # Use domain instead of vpc
}
