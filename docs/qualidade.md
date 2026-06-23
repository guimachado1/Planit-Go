# Qualidade de código — Planit Go

Este documento descreve a estratégia de testes, cobertura e análise estática adotada no projeto. Ao final de cada seção, indicamos **onde verificar** o que foi implementado (link direto ou pasta de evidências no repositório).

---

## SonarCloud

| Item | Valor |
|------|-------|
| **Projeto** | Planit Go |
| **Organization** | `guimachado1` |
| **Project Key** | `guimachado1_Planit-Go` |
| **Dashboard** | https://sonarcloud.io/project/overview?id=guimachado1_Planit-Go |

Configuração: [`sonar-project.properties`](../sonar-project.properties) na raiz do repositório.

### Escopo analisado

- **Sources:** `backend/src`, `frontend/src`
- **Tests:** `backend/test`, testes `*.test.js` / `*.test.jsx` no frontend
- **Cobertura:** `backend/coverage/lcov.info`, `frontend/coverage/lcov.info`
- **Exclusões:** `node_modules`, `dist`, migrations, scripts, `.env`

### Workflow

Arquivo: [`.github/workflows/sonar.yml`](../.github/workflows/sonar.yml)

1. Checkout com histórico completo (`fetch-depth: 0`)
2. `npm run test:coverage` no backend
3. `npm run test:coverage` no frontend
4. Scan SonarCloud (`SonarSource/sonarqube-scan-action@v7`)

**Gatilho:** push e pull request nas branches `main`, `master` e `dev`.

**Secret necessário:** `SONAR_TOKEN` no repositório GitHub.

---

## Testes automatizados

### Backend (~124 testes)

- **Runner:** Node.js built-in test (`node --test`)
- **Cobertura:** c8
- **Tipos:** unitários (domain, services), integração HTTP (supertest), middleware, rate limit

```bash
cd backend
npm run test:coverage
```

### Frontend

- **Runner:** Vitest + jsdom
- **Cobertura:** v8 (`@vitest/coverage-v8`)
- **Tipos:** componentes, páginas, hooks, utilitários

```bash
cd frontend
npm run test:coverage
```

---

## CI (validação contínua)

Workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml):

| Job | Node | Comandos |
|-----|------|----------|
| `backend` | 22 | `npm ci` → `npm run test:coverage` |
| `frontend` | 22 | `npm ci` → `npm run test:coverage` → `npm run build` |

**Gatilho:** push e PR em `dev`, `main`, `master`.

---

## Boas práticas adotadas

- Testes de integração para rotas críticas (auth, trips, health)
- Validação de regras de negócio isolada em `backend/src/domain/`
- ESLint/estilo alinhado ao projeto; issues reportadas no SonarCloud
- Cobertura enviada ao Sonar a cada análise na `dev`/`main`

---

## Como verificar

| O que conferir | Link ao vivo | Prints (alternativa) |
|----------------|--------------|----------------------|
| Dashboard e quality gate | [SonarCloud — Overview](https://sonarcloud.io/project/overview?id=guimachado1_Planit-Go) · [Quality Gate](https://sonarcloud.io/summary/new_code?id=guimachado1_Planit-Go) | [evidencias/sonar/](./evidencias/sonar/) |
| Cobertura de testes | [SonarCloud — Coverage](https://sonarcloud.io/component_measures?id=guimachado1_Planit-Go&metric=coverage&view=list) | [evidencias/sonar/](./evidencias/sonar/) |
| Pipeline de análise | [GitHub Actions — SonarCloud](https://github.com/guimachado1/Planit-Go/actions/workflows/sonar.yml) | [evidencias/github-actions/](./evidencias/github-actions/) |
| Testes no código | Pastas `backend/test/` e `frontend/src/**/*.test.jsx` no repositório | — |

Tabela completa de links e evidências: [evidencias/README.md](./evidencias/README.md).

---

[← Voltar à entrega](./ENTREGA.md) · [CI/CD](./ci-cd.md)
