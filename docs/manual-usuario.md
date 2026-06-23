# Manual do usuário — Planit Go

Guia dos principais fluxos da aplicação em produção ([https://www.planitgo.site](https://www.planitgo.site)). Use as [credenciais de teste](./ENTREGA.md#credenciais-de-teste) em [ENTREGA.md](./ENTREGA.md) para entrar sem criar conta.

---

## 1. Cadastro e login

### Criar conta

1. Acesse **Criar conta** (`/register`).
2. Informe nome, e-mail e senha (mínimo 6 caracteres).
3. Após o cadastro, você é redirecionado para a lista de viagens.

### Entrar

1. Acesse **Entrar** (`/login`).
2. Informe e-mail e senha.
3. Use o ícone de olho no campo senha para mostrar ou ocultar o texto.

### Sair

No menu da aplicação, use **Sair** para encerrar a sessão.

---

## 2. Lista de viagens (tela inicial)

Após o login, você vê os **cards das suas viagens**, cada um com:

- Foto de capa conforme o **perfil** da viagem
- Status: **Planejada**, **Em andamento** ou **Finalizada**
- Destino, datas e orçamento total

Clique em um card para abrir o **detalhe da viagem**. Use **Nova viagem** para criar outra.

---

## 3. Criar uma viagem

1. Clique em **Nova viagem** (`/viagens/nova`).
2. Preencha:
   - **Destino** (ex.: Florianópolis)
   - **Perfil da viagem** (define a distribuição automática do orçamento):
     - Urbana / Cidade grande
     - Praia / Lazer
     - Internacional
     - Econômica / Mochilão
   - **Data de início** e **data de fim** (fim não pode ser anterior ao início)
   - **Orçamento total** em reais
3. Avance para revisar a **distribuição por categoria** (transporte, hospedagem, alimentação, atividades).
4. Confirme para salvar a viagem.

---

## 4. Detalhe da viagem

Na página da viagem (`/viagens/:id`) você encontra:

- Resumo do orçamento e status
- Atalhos para **Gastos**, **Itinerário** e **Relatório**
- Painel para **editar datas/destino** ou **excluir** a viagem

---

## 5. Gastos

1. No detalhe da viagem, acesse a área de **gastos**.
2. **Adicionar gasto:** descrição, valor, data, categoria (transporte, hospedagem, alimentação, atividades).
3. Os gastos aparecem no histórico e alimentam os alertas de orçamento.
4. **Alertas:** quando o gasto real se aproxima ou ultrapassa o planejado por categoria, a interface destaca o aviso.

---

## 6. Itinerário

1. Acesse **Itinerário** (`/viagens/:id/itinerario`).
2. Os itens são agrupados **por dia** da viagem.
3. **Adicionar atividade:** título, horário (opcional), observações.
4. Edite ou remova itens conforme necessário.

---

## 7. Relatório

1. Acesse **Relatório** (`/viagens/:id/relatorio`).
2. Visualize:
   - Comparativo **planejado × realizado** por categoria
   - Total gasto e saldo do orçamento
   - Resumo do itinerário
3. Use a função de impressão do navegador (**Ctrl+P**) para gerar PDF ou impressão do relatório.

---

## 8. PWA (instalar no celular)

O Planit Go é uma **Progressive Web App**:

1. Abra https://www.planitgo.site no Chrome (Android) ou Safari (iOS).
2. No menu do navegador, escolha **Adicionar à tela inicial** / **Instalar aplicativo**.
3. O ícone do Planit Go aparece como app independente, com suporte offline parcial para a interface (API requer conexão).

---

## Perfis de viagem e orçamento

Cada perfil distribui automaticamente o orçamento total entre as categorias:

| Perfil | Transporte | Hospedagem | Alimentação | Atividades |
|--------|------------|------------|-------------|------------|
| Urbana | 20% | 25% | 30% | 25% |
| Praia | 15% | 35% | 25% | 25% |
| Internacional | 40% | 25% | 20% | 15% |
| Mochilão | 35% | 20% | 25% | 20% |

---

## Dúvidas frequentes

**Não consigo salvar a viagem após editar as datas**  
Verifique se a nova data de fim não é anterior à de início e se não há gastos ou itens de itinerário fora do novo período.

**Sessão expirou**  
O token JWT expira após 7 dias (configuração padrão). Faça login novamente.

**A API não responde**  
Confirme sua conexão. Em produção, a API roda na AWS ECS; o frontend está no Amplify.

---

[← Voltar à entrega](./ENTREGA.md)
