# Planit Go

Web app de planejamento de viagens, com foco em controle de orçamento, acompanhamento de gastos e organização de itinerário. Ferramenta prática para viajantes que querem planejar sem depender de várias plataformas.

**Produção:** [https://www.planitgo.site](https://www.planitgo.site)

---

## Objetivo

Permitir que o usuário planeje viagens de forma organizada — destino, datas, orçamento, gastos e itinerário — com relatórios que comparam o valor planejado com o realizado.

## Principais funcionalidades

- Cadastro e autenticação de usuários
- Cadastro de viagens com destino, datas e orçamento
- Distribuição automática do orçamento por categoria
- Registro de gastos reais
- Criação de itinerário diário
- Relatórios (planejado × realizado)
- Alertas quando os gastos se aproximam do limite
- Histórico de viagens
- Suporte a instalação como PWA

---

## Documentação

| Documento | Descrição |
|-----------|-----------|
| [**docs/ENTREGA.md**](./docs/ENTREGA.md) | **Ponto de entrada para revisão** — checklist, credenciais demo, links e ordem de leitura |
| [docs/manual-usuario.md](./docs/manual-usuario.md) | Guia de uso e fluxos da aplicação |
| [docs/arquitetura.md](./docs/arquitetura.md) | RFC técnica, requisitos, diagramas |
| [docs/desenvolvimento.md](./docs/desenvolvimento.md) | Setup local, testes, variáveis de ambiente |
| [docs/deploy.md](./docs/deploy.md) | Infraestrutura AWS (Amplify, ECS, RDS) |
| [docs/qualidade.md](./docs/qualidade.md) | SonarCloud e cobertura de testes |
| [docs/observabilidade.md](./docs/observabilidade.md) | New Relic APM |
| [docs/ci-cd.md](./docs/ci-cd.md) | Pipelines GitHub Actions |
| [docs/evidencias/](./docs/evidencias/) | Links das ferramentas + prints (Sonar, New Relic, Actions) |

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React, Vite, PWA — AWS Amplify |
| Backend | Node.js, Express — ECS Fargate |
| Banco | PostgreSQL — RDS |
| Qualidade | SonarCloud, Vitest, Node test runner |
| Observabilidade | New Relic APM |
| CI/CD | GitHub Actions |

---

## Início rápido (desenvolvimento)

```bash
# Backend
cd backend && cp .env.example .env && npm install && npm run migrate && npm run dev

# Frontend (outro terminal)
cd frontend && cp .env.example .env && npm install && npm run dev
```

Detalhes em [docs/desenvolvimento.md](./docs/desenvolvimento.md).
