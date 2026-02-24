# Contexto: Kommo CRM

> Base de conhecimento para integracao com Kommo CRM.

## Configuracao

### Credenciais
```
Base URL: https://brasilupcrm.kommo.com/api/v4
Auth: Bearer token
Token: [ver .env]
```

### IDs Importantes
| Entidade | ID | Nome |
|----------|---|------|
| Pipeline Vendas | 11266919 | Vendas |
| Etapa Qualificacao | - | - |
| Etapa Negociacao | - | - |
| Etapa Fechado/Ganho | - | - |

## Endpoints Principais

### Leads
```bash
# Listar leads
GET /leads

# Buscar lead por ID
GET /leads/{id}

# Criar lead
POST /leads

# Atualizar lead
PATCH /leads/{id}
```

### Contatos
```bash
# Listar contatos
GET /contacts

# Buscar contato
GET /contacts/{id}
```

### Pipelines
```bash
# Listar pipelines
GET /leads/pipelines

# Obter pipeline
GET /leads/pipelines/{id}
```

## Campos Customizados

| Campo | ID | Tipo |
|-------|---|------|
| [adicionar campos] | - | - |

## Rate Limits
- 7 requests/segundo
- Usar exponential backoff em 429

## Webhooks
- Configurar em: Configuracoes > Integracao
- Eventos: lead criado, lead movido, etc.

## Gotchas
1. Datas em Unix timestamp (segundos)
2. IDs sempre inteiros
3. Paginacao: `page` + `limit`
4. Filtros: `filter[field]=value`

## Exemplos

### Buscar Leads do Dia
```python
from datetime import datetime

hoje = datetime.now().strftime("%Y-%m-%d")
response = requests.get(
    f"{BASE_URL}/leads",
    headers={"Authorization": f"Bearer {TOKEN}"},
    params={
        "filter[created_at][from]": int(datetime.strptime(hoje, "%Y-%m-%d").timestamp())
    }
)
```

### Mover Lead de Etapa
```python
response = requests.patch(
    f"{BASE_URL}/leads/{lead_id}",
    headers={"Authorization": f"Bearer {TOKEN}"},
    json={
        "status_id": nova_etapa_id
    }
)
```

---

*Contexto carregado automaticamente quando detectado uso de Kommo.*
