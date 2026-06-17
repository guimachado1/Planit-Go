#!/usr/bin/env bash
# Publica a imagem da API no Amazon ECR.
# Uso: ./deploy/ecr-push.sh sa-east-1 123456789012 [planit-go-api] [tag]

set -euo pipefail

REGION="${1:?região AWS (ex.: sa-east-1)}"
ACCOUNT_ID="${2:?account id}"
REPOSITORY="${3:-planit-go-api}"
IMAGE_TAG="${4:-${IMAGE_TAG:-latest}}"

REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
IMAGE_URI="${REGISTRY}/${REPOSITORY}:${IMAGE_TAG}"

echo ">> Login no ECR (${REGISTRY})..."
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$REGISTRY"

echo ">> Build da imagem (backend/)..."
docker build -t "${REPOSITORY}:${IMAGE_TAG}" ./backend

echo ">> Tag: ${IMAGE_URI}"
docker tag "${REPOSITORY}:${IMAGE_TAG}" "$IMAGE_URI"

echo ">> Push..."
docker push "$IMAGE_URI"

echo ""
echo "Imagem publicada: ${IMAGE_URI}"
