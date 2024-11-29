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

# EC2 instance to host your backend
resource "aws_instance" "backend_server" {
  ami           = "ami-088d38b423bff245f" # Use a Node.js-ready AMI
  instance_type = "t2.micro"
  key_name      = var.key_name

  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y nodejs npm
    cd /home/ubuntu
    git clone https://github.com/EvanPrograms/ecommerce.git
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


# Create a PostgreSQL RDS instance
resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "13.11" # Choose a version based on your needs
  instance_class       = "db.t3.micro" # Free tier eligible
  db_name              = "chocolate_shop" # Database name
  username             = "postgres" # Master username
  password             = var.postgres_password
  publicly_accessible  = true # Set to true for testing, restrict later in production
  skip_final_snapshot  = true
  multi_az             = false
  vpc_security_group_ids = [aws_security_group.postgres_sg.id]

  tags = {
    Name        = "PostgreSQL Database"
    Environment = "production"
  }
}

# Security group to allow database access
resource "aws_security_group" "postgres_sg" {
  name        = "postgres-sg"
  description = "Allow access to PostgreSQL"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Replace with specific IPs for production
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "PostgreSQL Security Group"
    Environment = "production"
  }
}

# Output the RDS endpoint
output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
  description = "PostgreSQL RDS Endpoint"
}

resource "aws_eip" "backend_eip" {
  instance = aws_instance.backend_server.id
  domain   = "vpc" # Use domain instead of vpc
}
