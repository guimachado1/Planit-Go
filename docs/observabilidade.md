# Observabilidade — Planit Go

Este documento explica como a API em produção é monitorada com **New Relic APM**. O frontend (Amplify) não envia telemetria nesta versão; o foco é latência, throughput e erros do backend.

---

## Ferramenta

| Item | Valor |
|------|-------|
| **Produto** | New Relic APM (Application Performance Monitoring) |
| **Aplicação** | Planit Go API |
| **Console** | https://onenr.io/07jb4GpL7wy |
| **Escopo** | Backend (API Node.js no ECS) |

## Implementação

| Arquivo | Função |
|---------|--------|
| [`backend/newrelic.cjs`](../backend/newrelic.cjs) | Configuração do agente (CommonJS) |
| [`backend/package.json`](../backend/package.json) | Script `start` com loader ESM do New Relic |
| [`backend/Dockerfile`](../backend/Dockerfile) | Copia `newrelic.cjs` para a imagem |
| ECS task definition | `NEW_RELIC_LICENSE_KEY`, `NEW_RELIC_APP_NAME` |

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEW_RELIC_LICENSE_KEY` | Sim (produção) | Sem chave, o agente fica inativo |
| `NEW_RELIC_APP_NAME` | Não | Padrão: `Planit Go API` |
| `NEW_RELIC_LOG_LEVEL` | Não | Padrão: `info` |

Exemplo em [`backend/.env.example`](../backend/.env.example).

### Privacidade

Headers sensíveis são excluídos da coleta (`Authorization`, `Cookie`, etc.) — ver `newrelic.cjs`.

---

## Como verificar

| O que conferir | Link ao vivo | Prints (alternativa) |
|----------------|--------------|----------------------|
| Aplicação monitorada | [one.newrelic.com](https://one.newrelic.com/) → APM → *Planit Go API* | [evidencias/newrelic/](./evidencias/newrelic/) |
| API respondendo | `GET /health` na URL da API → `{ "ok": true, "service": "planit-go-api" }` | — |
| Agente no código | [`backend/newrelic.cjs`](../backend/newrelic.cjs), [`backend/Dockerfile`](../backend/Dockerfile) | — |
| Métricas esperadas | Throughput, response time, errors e transações por rota no painel APM | [evidencias/newrelic/](./evidencias/newrelic/) |

O New Relic exige login. Quem não tiver conta pode usar os prints em [evidencias/newrelic/](./evidencias/newrelic/). Tabela completa: [evidencias/README.md](./evidencias/README.md).

### Health check

Endpoint público (sem auth):

```
GET /health
→ { "ok": true, "service": "planit-go-api" }
```

Útil para load balancer e smoke tests após deploy.

---

[← Voltar à entrega](./ENTREGA.md) · [Deploy](./deploy.md)
