#!/bin/bash

# YVIE AI Platform - AWS Deployment Script
set -e

# Configuration
STACK_NAME="yvie-ai-platform"
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS CLI is not configured"
        exit 1
    fi
    
    print_success "Prerequisites check completed"
}

# Deploy CloudFormation stack
deploy_infrastructure() {
    print_status "Deploying infrastructure..."
    
    read -s -p "Enter database password (min 8 characters): " DB_PASSWORD
    echo
    read -s -p "Enter session secret (min 32 characters): " SESSION_SECRET
    echo
    read -p "Enter your domain (e.g., yourdomain.com): " DOMAIN
    
    aws cloudformation deploy \
        --template-file aws-deployment/cloudformation-template.yml \
        --stack-name $STACK_NAME \
        --parameter-overrides \
            DatabasePassword=$DB_PASSWORD \
            SessionSecret=$SESSION_SECRET \
            ReplitDomains=$DOMAIN \
        --capabilities CAPABILITY_IAM \
        --region $REGION
    
    print_success "Infrastructure deployed successfully"
}

# Build and push Docker image
build_and_push_image() {
    print_status "Building and pushing Docker image..."
    
    # Get ECR repository URI
    ECR_URI=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query 'Stacks[0].Outputs[?OutputKey==`ECRRepositoryURI`].OutputValue' \
        --output text \
        --region $REGION)
    
    # Login to ECR
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URI
    
    # Build image
    docker build -f aws-deployment/Dockerfile -t yvie-ai .
    
    # Tag and push
    docker tag yvie-ai:latest $ECR_URI:latest
    docker push $ECR_URI:latest
    
    print_success "Docker image built and pushed successfully"
}

# Create CloudWatch log group
create_log_group() {
    print_status "Creating CloudWatch log group..."
    
    aws logs create-log-group \
        --log-group-name /ecs/yvie-ai \
        --region $REGION 2>/dev/null || true
    
    print_success "CloudWatch log group created"
}

# Deploy ECS service
deploy_ecs_service() {
    print_status "Deploying ECS service..."
    
    # Update task definition with actual values
    TASK_DEF=$(cat aws-deployment/task-definition.json | \
        sed "s/ACCOUNT_ID/$ACCOUNT_ID/g" | \
        sed "s/REGION/$REGION/g" | \
        sed "s/STACK_NAME/$STACK_NAME/g")
    
    # Register task definition
    TASK_DEF_ARN=$(echo "$TASK_DEF" | aws ecs register-task-definition \
        --cli-input-json file:///dev/stdin \
        --region $REGION \
        --query 'taskDefinition.taskDefinitionArn' \
        --output text)
    
    # Get cluster name and subnets
    CLUSTER_NAME=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query 'Stacks[0].Outputs[?OutputKey==`ECSClusterName`].OutputValue' \
        --output text \
        --region $REGION)
    
    SUBNET_IDS=$(aws ec2 describe-subnets \
        --filters "Name=tag:Name,Values=$STACK_NAME-public-*" \
        --query 'Subnets[].SubnetId' \
        --output text \
        --region $REGION | tr '\t' ',')
    
    SECURITY_GROUP=$(aws ec2 describe-security-groups \
        --filters "Name=tag:Name,Values=$STACK_NAME-ecs-sg" \
        --query 'SecurityGroups[0].GroupId' \
        --output text \
        --region $REGION)
    
    TARGET_GROUP_ARN=$(aws elbv2 describe-target-groups \
        --names "$STACK_NAME-tg" \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text \
        --region $REGION)
    
    # Create ECS service
    aws ecs create-service \
        --cluster $CLUSTER_NAME \
        --service-name yvie-ai-service \
        --task-definition $TASK_DEF_ARN \
        --desired-count 2 \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$SECURITY_GROUP],assignPublicIp=ENABLED}" \
        --load-balancers "targetGroupArn=$TARGET_GROUP_ARN,containerName=yvie-ai-container,containerPort=5000" \
        --region $REGION 2>/dev/null || \
    aws ecs update-service \
        --cluster $CLUSTER_NAME \
        --service yvie-ai-service \
        --task-definition $TASK_DEF_ARN \
        --desired-count 2 \
        --region $REGION
    
    print_success "ECS service deployed successfully"
}

# Run database migrations
run_migrations() {
    print_status "Database migrations need to be run manually after deployment"
    print_warning "Connect to your database and run: npx drizzle-kit push"
    
    # Get database endpoint
    DB_ENDPOINT=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query 'Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue' \
        --output text \
        --region $REGION)
    
    print_status "Database endpoint: $DB_ENDPOINT"
}

# Get deployment information
get_deployment_info() {
    print_status "Getting deployment information..."
    
    LOAD_BALANCER_DNS=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
        --output text \
        --region $REGION)
    
    print_success "Deployment completed successfully!"
    echo
    echo "==================== DEPLOYMENT INFO ===================="
    echo "Application URL: http://$LOAD_BALANCER_DNS"
    echo "Stack Name: $STACK_NAME"
    echo "Region: $REGION"
    echo "========================================================"
    echo
    print_warning "Note: It may take a few minutes for the service to become healthy"
    print_status "You can monitor the deployment in the AWS Console:"
    echo "- ECS: https://$REGION.console.aws.amazon.com/ecs/home?region=$REGION#/clusters/$STACK_NAME-cluster"
    echo "- CloudFormation: https://$REGION.console.aws.amazon.com/cloudformation/home?region=$REGION#/stacks"
}

# Main deployment function
main() {
    echo "==================== YVIE AI AWS DEPLOYMENT ===================="
    echo
    
    check_prerequisites
    deploy_infrastructure
    create_log_group
    build_and_push_image
    deploy_ecs_service
    run_migrations
    get_deployment_info
}

# Run deployment
main "$@"