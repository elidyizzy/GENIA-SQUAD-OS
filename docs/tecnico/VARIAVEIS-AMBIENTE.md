# VARIÁVEIS DE AMBIENTE
> Responsável: @dev (Neo) | Última atualização: 2026-03-27

---

> **NUNCA** commitar o arquivo `.env` com valores reais.
> Este documento descreve as variáveis necessárias — os valores ficam no `.env` local ou no vault de segredos.

---

## Variáveis Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NODE_ENV` | Ambiente de execução | `development` \| `production` |
| `PORT` | Porta da aplicação | `3000` |
| _[Preencher demais variáveis]_ | _..._ | _..._ |

## Variáveis de Banco de Dados

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string completa |
| _[Preencher]_ | _..._ |

## Variáveis de Integrações

| Variável | Serviço | Onde obter |
|----------|---------|-----------|
| _[Preencher]_ | _..._ | _..._ |

## Como Configurar

```bash
# Copiar template
cp .env.example .env

# Preencher com valores reais (nunca commitar este arquivo)
```

---

_Responsável: @dev (Neo) | Segredos de produção: gerenciados por @devops (Tank)_
