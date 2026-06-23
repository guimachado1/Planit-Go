# Desenvolvimento local — Planit Go

Como configurar, executar e testar o projeto na máquina de desenvolvimento.

---

## Pré-requisitos

- **Node.js** ≥ 20 (recomendado **22**, igual ao CI e Docker)
- **npm** ≥ 9
- **Docker** (para PostgreSQL via `docker-compose`) ou instância PostgreSQL local
- **Git**

---

## 1. Clonar o repositório

```bash
git clone https://github.com/guimachado1/Planit-Go.git
cd Planit-Go
```

---

## 2. Banco de dados

Suba o PostgreSQL com Docker:

```bash
docker compose up -d
```

Configuração padrão (`docker-compose.yml`):

| Parâmetro | Valor |
|-----------|-------|
| Host | `localhost` |
| Porta | `5433` |
| Usuário | `planit` |
| Senha | `planit` |
| Banco | `planit_go` |

---

## 3. Backend (API)

```bash
cd backend
cp .env.example .env
npm ci
npm run migrate
npm run dev
```

A API sobe em **http://localhost:4000**.

### Variáveis (`backend/.env`)

| Variável | Exemplo local |
|----------|---------------|
| `PORT` | `4000` |
| `DATABASE_URL` | `postgresql://planit:planit@localhost:5433/planit_go` |
| `JWT_SECRET` | string longa e aleatória |
| `JWT_EXPIRES_IN` | `7d` |

---

## 4. Frontend (web)

Em outro terminal:

```bash
cd frontend
npm ci
npm run dev
```

A interface sobe em **http://localhost:5173**.

O Vite faz **proxy** de `/api` para `http://localhost:4000` (ver `frontend/vite.config.js`). Não é necessário definir `VITE_API_URL` em desenvolvimento.

---

## 5. Testes

### Backend

```bash
cd backend
npm test              # testes unitários e integração
npm run test:coverage # com cobertura (c8 → backend/coverage/)
```

### Frontend

```bash
cd frontend
npm test
npm run test:coverage # frontend/coverage/
```

### CI local (mesmo que GitHub Actions)

```bash
cd backend && npm ci && npm run test:coverage
cd ../frontend && npm ci && npm run test:coverage && npm run build
```

---

## 6. Build de produção (local)

```bash
# Frontend
cd frontend
npm run build
npm run preview   # serve dist/ em http://localhost:4173

# Backend (Docker)
cd backend
docker build -t planit-go-api .
```

---

## 7. Estrutura de scripts

| Pacote | Script | Descrição |
|--------|--------|-----------|
| backend | `dev` | API com `--watch` |
| backend | `migrate` | Aplica migrations SQL |
| backend | `start` | Produção (com New Relic) |
| frontend | `dev` | Vite dev server |
| frontend | `build` | Build para `dist/` |
| frontend | `icons:pwa` | Gera ícones PWA |

---

## 8. Solução de problemas

| Problema | Solução |
|----------|---------|
| `ECONNREFUSED` no banco | Verifique `docker compose ps` e a porta `5433` |
| 401 nas rotas | Faça login novamente; token expirado ou inválido |
| CORS em dev | Em dev o proxy do Vite evita CORS; não acesse a API direto do browser em outra origem |
| `EBADENGINE` no npm | Atualize Node para ≥ 20 |

---

[← Voltar à entrega](./ENTREGA.md) · [Deploy](./deploy.md) · [Arquitetura](./arquitetura.md)
