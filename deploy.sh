#!/bin/bash

# Configuration
# Using the repository URL (we will configure auth on the server)
REPO_URL="https://github.com/suryakumarPointblank/tisl_backend.git"
CONTAINER_NAME="tisl_backend"
IMAGE_NAME="tisl_backend_img"
# Internal app port
APP_PORT="3000"
# External server port (e.g. 80 for HTTP)
SERVER_PORT="80"

echo "=> Pulling latest changes from GitHub..."
# Set origin with token for authentication and pull
git remote set-url origin $REPO_URL
git pull origin master

echo "=> Building the Docker image..."
docker build -t $IMAGE_NAME .

echo "=> Stopping and removing existing container (if any)..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

echo "=> Starting the new container..."
# Assumes you will have a .env file on the server. If not, remove `--env-file .env`
docker run -d --name $CONTAINER_NAME -p $SERVER_PORT:$APP_PORT --env-file .env $IMAGE_NAME

echo "=> Deployment complete!"
docker ps | grep $CONTAINER_NAME
