variable "aws_region" {
  default = "us-east-2"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  description = "Key pair for accessing EC2 instances"
  default = "acekey"
}

variable "postgres_password" {
  description = "The PostgreSQL password"
  type        = string
  sensitive   = true
}
