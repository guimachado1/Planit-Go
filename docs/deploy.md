# Deploy em produção — Planit Go

Infraestrutura AWS e fluxo de publicação do frontend e da API.

---

## Visão geral

| Componente | Serviço AWS | Branch / gatilho |
|------------|-------------|------------------|
| Frontend (React PWA) | **Amplify Hosting** | `main` (build automático) |
| API (Node.js) | **ECS Fargate** + **ECR** | `main` + alterações em `backend/**` |
| Banco de dados | **RDS PostgreSQL** | Gerenciado manualmente / console |
| Região | **sa-east-1** (São Paulo) | — |

**URL pública:** [https://www.planitgo.site](https://www.planitgo.site)

---

## Frontend — AWS Amplify

1. Repositório conectado ao GitHub (`Planit-Go`).
2. Build spec: `frontend/amplify.yml`.
3. Comandos: `npm ci` → `npm run build`.
4. Artefatos: `frontend/dist`.
5. SPA: redirect `404-200` para `index.html`.
6. Headers de segurança (HSTS, X-Frame-Options, etc.) no `amplify.yml`.

### Variável no Amplify

| Nome | Valor |
|------|-------|
| `VITE_API_URL` | URL HTTPS da API no ECS (ex.: ALB ou domínio da API) |

Sem barra no final da URL.

---

## Backend — ECS Fargate + ECR

### Pipeline automatizado

Workflow: [`.github/workflows/deploy-api.yml`](../.github/workflows/deploy-api.yml)

1. **Test** — `npm run test:coverage` no backend.
2. **Build** — imagem Docker (`backend/Dockerfile`, Node 22).
3. **Push** — Amazon ECR (`planit-go-api`).
4. **Deploy** — nova task definition no ECS; aguarda estabilidade do serviço.
5. **Environment GitHub** — `production` → histórico em [Deployments](https://github.com/guimachado1/Planit-Go/deployments).

Gatilho: push na branch `main` com mudanças em `backend/**` ou no próprio workflow. Também disponível via **workflow_dispatch**.

### Variáveis do workflow (GitHub Variables)

| Variável | Padrão |
|----------|--------|
| `AWS_REGION` | `sa-east-1` |
| `ECR_REPOSITORY` | `planit-go-api` |
| `ECS_CLUSTER` | `default` |
| `ECS_SERVICE` | `planit-go-api-d146` |
| `ECS_TASK_DEFINITION` | `default-planit-go-api-d146` |
| `ECS_CONTAINER_NAME` | `Main` |

### Secrets (GitHub)

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### Task definition (ECS) — variáveis da API

| Variável | Descrição |
|----------|-----------|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `DATABASE_URL` | Connection string RDS |
| `DATABASE_SSL` | `true` ou `auto` |
| `JWT_SECRET` | Segredo forte |
| `CORS_ORIGIN` | `https://www.planitgo.site` |
| `NEW_RELIC_LICENSE_KEY` | Chave New Relic |
| `NEW_RELIC_APP_NAME` | `Planit Go API` |

### Container

- **Entrypoint:** `docker-entrypoint.sh` — roda migrations e inicia `npm start`.
- **Health check:** https://pl-ff991c3a68c443babd649f987729d590.ecs.sa-east-1.on.aws/health → `{ "ok": true }`.

---

## RDS PostgreSQL

- Instância dedicada na mesma VPC/região do ECS.
- Security group: permite porta 5432 apenas do security group do ECS.
- Migrations aplicadas automaticamente no start do container.

---

## Deploy manual da API (opcional)

Scripts em `deploy/`:

```powershell
# Windows
.\deploy\ecr-push.ps1
```

```bash
# Linux/macOS
./deploy/ecr-push.sh
```

Use quando precisar publicar imagem sem passar pelo GitHub Actions.

---

## Checklist pós-deploy

- [ ] `https://www.planitgo.site` carrega o frontend
- [ ] Login e cadastro funcionam
- [ ] [Health check](https://pl-ff991c3a68c443babd649f987729d590.ecs.sa-east-1.on.aws/health) retorna `ok: true`
- [ ] New Relic recebe transações da API
- [ ] SonarCloud e CI verdes na `main`

---

[← Voltar à entrega](./ENTREGA.md) · [CI/CD](./ci-cd.md) · [Desenvolvimento](./desenvolvimento.md)
