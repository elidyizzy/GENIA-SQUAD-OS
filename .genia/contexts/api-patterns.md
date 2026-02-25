# Contexto: API Patterns

> Principios de design de API e tomada de decisao.

## Mapa de Conteudo

| Topico | Quando Usar |
|--------|-------------|
| REST vs GraphQL vs tRPC | Escolher tipo de API |
| Resource naming, HTTP methods | Design REST |
| Envelope pattern, error format | Estrutura de resposta |
| Schema design | GraphQL |
| Type safety | TS fullstack |

## Arvore de Decisao: Escolher Tipo de API

```
Projeto → TypeScript monorepo?
├── Sim → tRPC (type safety end-to-end)
│
└── Nao → Clientes diversos?
    ├── Sim → REST (universal, cacheable)
    │
    └── Nao → Queries complexas?
        ├── Sim → GraphQL (flexivel, self-documenting)
        └── Nao → REST (simples, padrao da industria)
```

## REST Design

### Naming de Recursos
```
GET    /users           # Lista
GET    /users/{id}      # Detalhe
POST   /users           # Criar
PUT    /users/{id}      # Atualizar (completo)
PATCH  /users/{id}      # Atualizar (parcial)
DELETE /users/{id}      # Remover
```

### Status Codes
| Code | Uso |
|------|-----|
| 200 | OK - Sucesso |
| 201 | Created - Recurso criado |
| 204 | No Content - Deletado |
| 400 | Bad Request - Input invalido |
| 401 | Unauthorized - Nao autenticado |
| 403 | Forbidden - Sem permissao |
| 404 | Not Found - Recurso nao existe |
| 422 | Unprocessable - Validacao falhou |
| 500 | Internal Error - Erro do servidor |

## Formato de Resposta

### Sucesso
```json
{
  "data": { ... },
  "meta": {
    "pagination": { "page": 1, "total": 100 }
  }
}
```

### Erro
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email invalido",
    "details": [
      { "field": "email", "message": "Formato invalido" }
    ]
  }
}
```

## Paginacao

### Offset-based
```
GET /users?page=2&limit=20
```

### Cursor-based (recomendado para grandes volumes)
```
GET /users?cursor=abc123&limit=20
```

## Versionamento

| Metodo | Exemplo | Uso |
|--------|---------|-----|
| URI | `/v1/users` | Mais comum, facil |
| Header | `Accept: application/vnd.api.v1+json` | Mais limpo |
| Query | `/users?version=1` | Nao recomendado |

## Autenticacao

| Metodo | Quando Usar |
|--------|-------------|
| JWT | SPAs, mobile apps |
| API Keys | Servicos, integracao |
| OAuth 2.0 | Login social, terceiros |
| Session | Apps tradicionais |

## Rate Limiting

### Headers de Resposta
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Anti-Patterns

| NAO Fazer | Fazer |
|-----------|-------|
| `/getUsers` | `GET /users` |
| `/createUser` | `POST /users` |
| Retornar 200 para erros | Usar status codes corretos |
| Expor erros internos | Mensagens genericas |
| Pular rate limiting | Sempre limitar |

## Checklist

- [ ] Escolhi estilo de API para o contexto?
- [ ] Formato de resposta consistente?
- [ ] Estrategia de versionamento?
- [ ] Autenticacao definida?
- [ ] Rate limiting planejado?
- [ ] Documentacao (OpenAPI)?
