# YVIE AI Platform - AWS Deployment Guide

Complete guide to deploy your YVIE AI platform on AWS with production-grade infrastructure.

## Architecture Overview

Your deployment will include:
- **ECS Fargate** - Containerized application hosting
- **Application Load Balancer** - Traffic distribution and SSL termination
- **RDS PostgreSQL** - Managed database service
- **ECR** - Container image registry
- **CloudWatch** - Logging and monitoring
- **Secrets Manager** - Secure credential storage
- **VPC** - Isolated network environment

## Prerequisites

1. **AWS Account** with administrative access
2. **AWS CLI** installed and configured
3. **Docker** installed on your local machine
4. **Domain name** (optional, for custom domain)

### Install AWS CLI
```bash
# macOS
brew install awscli

# Windows
choco install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Configure AWS CLI
```bash
aws configure
# Enter your Access Key ID, Secret Access Key, Region (us-east-1), and output format (json)
```

## Deployment Steps

### Step 1: Prepare Your Project

1. **Export from Replit**
   - Download your project as a zip file
   - Extract to your local machine

2. **Navigate to project directory**
   ```bash
   cd path/to/your/yvie-ai-project
   ```

### Step 2: Deploy Infrastructure

Run the automated deployment script:

```bash
chmod +x aws-deployment/deploy.sh
./aws-deployment/deploy.sh
```

The script will:
1. Check prerequisites
2. Deploy AWS infrastructure via CloudFormation
3. Build and push Docker image to ECR
4. Create ECS service
5. Set up monitoring and logging

### Step 3: Manual Steps

#### Database Migration
After deployment, run database migrations:

```bash
# Get your database connection string from AWS Console
# Then run migrations
npx drizzle-kit push
```

#### Domain Configuration (Optional)

1. **Route 53 Setup**
   ```bash
   # Create hosted zone for your domain
   aws route53 create-hosted-zone --name yourdomain.com --caller-reference $(date +%s)
   ```

2. **SSL Certificate**
   ```bash
   # Request SSL certificate
   aws acm request-certificate --domain-name yourdomain.com --validation-method DNS
   ```

3. **Update Load Balancer**
   - Add HTTPS listener with SSL certificate
   - Update security groups for port 443

## Environment Variables

The following environment variables are automatically configured:

- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `NODE_ENV` - Set to "production"
- `REPLIT_DOMAINS` - Your domain for OAuth

## Monitoring and Maintenance

### CloudWatch Dashboards
Monitor your application at:
```
https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:
```

### ECS Service Management
```bash
# Scale service
aws ecs update-service --cluster yvie-ai-platform-cluster --service yvie-ai-service --desired-count 3

# View service status
aws ecs describe-services --cluster yvie-ai-platform-cluster --services yvie-ai-service

# View logs
aws logs tail /ecs/yvie-ai --follow
```

### Database Management
```bash
# Connect to database
psql -h your-db-endpoint.amazonaws.com -U yvie_user -d yvie_ai

# Create database backup
aws rds create-db-snapshot --db-instance-identifier yvie-ai-platform-postgres --db-snapshot-identifier yvie-ai-backup-$(date +%Y%m%d)
```

## Cost Optimization

### Estimated Monthly Costs (us-east-1)
- ECS Fargate (2 tasks): ~$30
- RDS db.t3.micro: ~$15
- Application Load Balancer: ~$20
- Data transfer: ~$5
- **Total: ~$70/month**

### Cost Saving Tips
1. Use Fargate Spot for non-production environments
2. Enable RDS automated backups with 7-day retention
3. Set up CloudWatch billing alerts
4. Use reserved capacity for predictable workloads

## Security Best Practices

### Network Security
- Application runs in private subnets
- Database accessible only from application
- Load balancer handles public traffic

### Data Security
- Database encryption at rest enabled
- Secrets stored in AWS Secrets Manager
- Regular automated backups

### Access Control
- IAM roles with minimal required permissions
- VPC security groups restrict network access
- CloudTrail logging enabled

## Troubleshooting

### Common Issues

**Service won't start**
```bash
# Check service events
aws ecs describe-services --cluster yvie-ai-platform-cluster --services yvie-ai-service

# Check task logs
aws logs tail /ecs/yvie-ai --since 1h
```

**Database connection failed**
```bash
# Verify security group rules
aws ec2 describe-security-groups --group-names yvie-ai-platform-rds-sg

# Test database connectivity
telnet your-db-endpoint.amazonaws.com 5432
```

**High response times**
- Scale ECS service to more tasks
- Check CloudWatch metrics for bottlenecks
- Consider upgrading RDS instance class

## Cleanup

To remove all AWS resources:

```bash
# Delete ECS service
aws ecs update-service --cluster yvie-ai-platform-cluster --service yvie-ai-service --desired-count 0
aws ecs delete-service --cluster yvie-ai-platform-cluster --service yvie-ai-service

# Delete CloudFormation stack
aws cloudformation delete-stack --stack-name yvie-ai-platform

# Delete ECR images
aws ecr batch-delete-image --repository-name yvie-ai-platform-yvie-ai --image-ids imageTag=latest
```

## Support

For issues with AWS deployment:
1. Check CloudWatch logs for application errors
2. Review CloudFormation events for infrastructure issues
3. Use AWS Support if you have a support plan

Your YVIE AI platform will be highly available, scalable, and production-ready on AWS infrastructure.