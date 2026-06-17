# Publica a imagem da API no Amazon ECR (pré-requisito: AWS CLI + Docker).
#
# Uso (PowerShell, na raiz do repositório):
#   .\deploy\ecr-push.ps1 -Region sa-east-1 -AccountId 123456789012 -Repository planit-go-api
#
# Variáveis de ambiente opcionais: AWS_PROFILE, IMAGE_TAG (default: latest)

param(
  [Parameter(Mandatory = $true)]
  [string]$Region,

  [Parameter(Mandatory = $true)]
  [string]$AccountId,

  [string]$Repository = "planit-go-api",
  [string]$ImageTag = $env:IMAGE_TAG
)

if (-not $ImageTag) { $ImageTag = "latest" }

$ErrorActionPreference = "Stop"
$Registry = "$AccountId.dkr.ecr.$Region.amazonaws.com"
$ImageUri = "$Registry/${Repository}:$ImageTag"

Write-Host ">> Login no ECR ($Registry)..."
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $Registry

Write-Host ">> Build da imagem (backend/)..."
docker build -t "${Repository}:$ImageTag" ./backend

Write-Host ">> Tag: $ImageUri"
docker tag "${Repository}:$ImageTag" $ImageUri

Write-Host ">> Push..."
docker push $ImageUri

Write-Host ""
Write-Host "Imagem publicada: $ImageUri"
Write-Host "Use essa URI ao criar o serviço no App Runner."
