output "s3_bucket_url" {
  value = aws_s3_bucket_website_configuration.video_storage.website_endpoint
}


output "backend_server_url" {
  value = "http://${aws_instance.backend_server.public_ip}:3000"
  description = "Backend server URL"
}
