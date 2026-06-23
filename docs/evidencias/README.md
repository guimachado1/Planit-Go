# Evidências — links e capturas de tela

Esta pasta reúne **dois tipos de evidência** para revisão do projeto:

1. **Links ao vivo** — ferramentas e dashboards que podem ser abertos diretamente no navegador.
2. **Prints no repositório** — capturas de tela para quando a ferramenta exige login ou o acesso externo não estiver disponível.

---

## Tabela completa: link + evidência

| Área | Abrir ao vivo | Prints (esta pasta) | Observação |
|------|---------------|---------------------|------------|
| **SonarCloud** | [Overview](https://sonarcloud.io/project/overview?id=guimachado1_Planit-Go) · [Quality Gate](https://sonarcloud.io/summary/new_code?id=guimachado1_Planit-Go) · [Cobertura](https://sonarcloud.io/component_measures?id=guimachado1_Planit-Go&metric=coverage&view=list) | [sonar/](./sonar/) | Projeto público — link funciona sem login |
| **GitHub Actions — CI** | [Workflow CI](https://github.com/guimachado1/Planit-Go/actions/workflows/ci.yml) | [github-actions/](./github-actions/) | Repositório público |
| **GitHub Actions — Sonar** | [Workflow SonarCloud](https://github.com/guimachado1/Planit-Go/actions/workflows/sonar.yml) | [github-actions/](./github-actions/) | Repositório público |
| **GitHub Actions — Deploy** | [Deploy API (ECS)](https://github.com/guimachado1/Planit-Go/actions/workflows/deploy-api.yml) | [github-actions/](./github-actions/) | Repositório público |
| **Deployments** | [Ambiente production](https://github.com/guimachado1/Planit-Go/deployments) | [github-actions/](./github-actions/) | Histórico de deploys no GitHub |
| **New Relic APM** | [one.newrelic.com](https://one.newrelic.com/) → APM → *Planit Go API* | [newrelic/](./newrelic/) | Exige conta New Relic; prints servem como evidência |
| **Aplicação** | [planitgo.site](https://www.planitgo.site) | — | Testar com as [credenciais em ENTREGA.md](../ENTREGA.md#credenciais-de-teste) |

---

## O que cada pasta de prints deve conter

### `sonar/`

Complementa os links do SonarCloud acima.

- [ ] Overview do projeto
- [ ] Quality Gate (Passed)
- [ ] Métricas de cobertura (Coverage)
- [ ] (Opcional) Issues ou Security Hotspots

### `github-actions/`

Complementa os workflows e a aba Deployments.

- [ ] Workflow **CI** — jobs backend e frontend verdes
- [ ] Workflow **SonarCloud** — análise concluída
- [ ] Workflow **Deploy API (ECS)** — jobs test + deploy
- [ ] Aba **Deployments** → environment **production**

### `newrelic/`

Necessário quando quem revisa não tem login no New Relic.

- [ ] Dashboard APM — *Planit Go API*
- [ ] Gráfico de response time / throughput
- [ ] Transações ou erros (se houver tráfego)

---

[← Voltar à entrega](../ENTREGA.md)
