# Entrega final — Planit Go

Este é o **ponto de entrada** da documentação. Foi escrito para **revisão autônoma**: quem avalia o projeto pode abrir o repositório, seguir os links abaixo e verificar cada requisito sem depender de apresentação oral ou de ambiente local.

**Autor:** Guilherme Machado  
**Repositório:** [github.com/guimachado1/Planit-Go](https://github.com/guimachado1/Planit-Go)  
**Aplicação:** [https://www.planitgo.site](https://www.planitgo.site)

### Ordem sugerida de leitura

1. **Este arquivo** — checklist, credenciais e links.
2. [manual-usuario.md](./manual-usuario.md) — testar a aplicação em produção.
3. [arquitetura.md](./arquitetura.md) — visão técnica e requisitos.
4. [qualidade.md](./qualidade.md), [observabilidade.md](./observabilidade.md) e [ci-cd.md](./ci-cd.md) — qualidade, monitoramento e pipelines.
5. [deploy.md](./deploy.md) e [desenvolvimento.md](./desenvolvimento.md) — infraestrutura e reprodução local (opcional).
6. [evidencias/](./evidencias/) — links das ferramentas **e** capturas de tela no repositório.

---

## Checklist da entrega

| # | Requisito | Onde verificar | Status |
|---|-----------|----------------|--------|
| 1 | Aplicação em ambiente público | Abrir [planitgo.site](https://www.planitgo.site) e fazer login com as [credenciais de teste](#credenciais-de-teste) | ✅ |
| 2 | Repositório público (GitHub) | [github.com/guimachado1/Planit-Go](https://github.com/guimachado1/Planit-Go) | ✅ |
| 3 | Documentação de uso (fluxos principais) | [manual-usuario.md](./manual-usuario.md) | ✅ |
| 4 | Usuários e senhas de teste | [Credenciais de teste](#credenciais-de-teste) neste arquivo | ✅ |
| 5 | Documentação técnica / RFC | [RFC_PlanitGo.pdf](./RFC_PlanitGo.pdf) (documento formal) · resumo em [arquitetura.md](./arquitetura.md) | ✅ |
| 6 | SonarCloud / qualidade de código | [qualidade.md](./qualidade.md) ou [SonarCloud](https://sonarcloud.io/project/overview?id=guimachado1_Planit-Go) · prints em [evidencias/sonar/](./evidencias/sonar/) | ✅ |
| 7 | Monitoramento / observabilidade | [observabilidade.md](./observabilidade.md) · prints em [evidencias/newrelic/](./evidencias/newrelic/) | ✅ |
| 8 | CI/CD (build, testes, deploy) | [ci-cd.md](./ci-cd.md) ou [GitHub Actions](https://github.com/guimachado1/Planit-Go/actions) · prints em [evidencias/github-actions/](./evidencias/github-actions/) | ✅ |

---

## Acesso rápido

| Recurso | URL |
|---------|-----|
| **Aplicação (produção)** | https://www.planitgo.site |
| **API (produção)** | Configurada no Amplify via `VITE_API_URL` (ECS Fargate) |
| **Health check da API** | https://pl-ff991c3a68c443babd649f987729d590.ecs.sa-east-1.on.aws/health |
| **Repositório** | https://github.com/guimachado1/Planit-Go |
| **GitHub Actions** | https://github.com/guimachado1/Planit-Go/actions |
| **Deploys (ambiente production)** | https://github.com/guimachado1/Planit-Go/deployments |
| **SonarCloud** | https://sonarcloud.io/project/overview?id=guimachado1_Planit-Go |
| **New Relic** | https://one.newrelic.com/ (aplicação *Planit Go API*) |

---

## Credenciais de teste

Conta de demonstração em produção, com viagens de exemplo para explorar todos os fluxos sem criar dados do zero.

| E-mail | Senha | Observação |
|--------|-------|------------|
| `avaliador@planitgo.site` | `Avaliador@2026` | Conta demo com viagens planejadas, em andamento e finalizadas |

> Se a conta ainda não existir em produção, cadastre-se em **Criar conta** com o e-mail acima ou use **Registrar** em https://www.planitgo.site/register e crie viagens de exemplo seguindo o [manual de uso](./manual-usuario.md).

**Roteiro de teste na aplicação (≈ 10 min):**

1. Acessar https://www.planitgo.site e entrar com as credenciais acima.
2. Na tela inicial, abrir uma viagem existente ou criar uma nova.
3. Registrar um gasto e conferir os alertas de orçamento.
4. Adicionar um item ao itinerário.
5. Abrir o relatório da viagem (planejado × realizado).
6. (Opcional) Instalar como PWA pelo menu do navegador.

Detalhes de cada tela em [manual-usuario.md](./manual-usuario.md).

---

## Documentação do projeto

| Documento | Conteúdo |
|-----------|----------|
| [manual-usuario.md](./manual-usuario.md) | Guia de uso e fluxos da aplicação |
| [RFC_PlanitGo.pdf](./RFC_PlanitGo.pdf) | **RFC formal do projeto** (PDF) |
| [arquitetura.md](./arquitetura.md) | Resumo técnico no repositório — requisitos, diagramas, código |
| [desenvolvimento.md](./desenvolvimento.md) | Setup local, testes, variáveis de ambiente |
| [deploy.md](./deploy.md) | Infraestrutura AWS (Amplify, ECS, RDS) |
| [qualidade.md](./qualidade.md) | SonarCloud, cobertura de testes |
| [observabilidade.md](./observabilidade.md) | New Relic APM |
| [ci-cd.md](./ci-cd.md) | Pipelines GitHub Actions |

---

## Evidências e links das ferramentas

Cada requisito pode ser conferido de duas formas: **link ao vivo** (quando a ferramenta permite acesso público) ou **prints** versionados no repositório (quando exige login ou conta).

| Área | Link ao vivo | Prints no repositório | Acesso |
|------|--------------|----------------------|--------|
| **Aplicação** | [planitgo.site](https://www.planitgo.site) | — | Público |
| **Repositório** | [github.com/guimachado1/Planit-Go](https://github.com/guimachado1/Planit-Go) | — | Público |
| **SonarCloud** | [Dashboard do projeto](https://sonarcloud.io/project/overview?id=guimachado1_Planit-Go) · [Quality Gate](https://sonarcloud.io/summary/new_code?id=guimachado1_Planit-Go) · [Cobertura](https://sonarcloud.io/component_measures?id=guimachado1_Planit-Go&metric=coverage&view=list) | [evidencias/sonar/](./evidencias/sonar/) | Projeto público no SonarCloud |
| **GitHub Actions (CI)** | [Workflow CI](https://github.com/guimachado1/Planit-Go/actions/workflows/ci.yml) · [Todas as Actions](https://github.com/guimachado1/Planit-Go/actions) | [evidencias/github-actions/](./evidencias/github-actions/) | Público |
| **GitHub Actions (Sonar)** | [Workflow SonarCloud](https://github.com/guimachado1/Planit-Go/actions/workflows/sonar.yml) | [evidencias/github-actions/](./evidencias/github-actions/) | Público |
| **GitHub Actions (Deploy)** | [Workflow Deploy API](https://github.com/guimachado1/Planit-Go/actions/workflows/deploy-api.yml) · [Deployments production](https://github.com/guimachado1/Planit-Go/deployments) | [evidencias/github-actions/](./evidencias/github-actions/) | Público |
| **New Relic APM** | [one.newrelic.com](https://one.newrelic.com/) → APM → *Planit Go API* | [evidencias/newrelic/](./evidencias/newrelic/) | Exige login New Relic; use os prints se não tiver conta |

Detalhes do que capturar em cada pasta: [evidencias/README.md](./evidencias/README.md).

---

## Stack resumida

- **Frontend:** React, Vite, PWA (Amplify Hosting)
- **Backend:** Node.js, Express, PostgreSQL
- **Cloud:** AWS Amplify + ECS Fargate + ECR + RDS (sa-east-1)
- **Qualidade:** SonarCloud, testes automatizados (Vitest + Node test runner)
- **Observabilidade:** New Relic APM
- **CI/CD:** GitHub Actions
