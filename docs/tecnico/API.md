# API — Documentação de Endpoints
> Responsável: @dev (Neo) | Última atualização: 2026-03-27

---

## Base URL

```
Produção:    https://[dominio]/api/v1
Staging:     https://[staging]/api/v1
Local:       http://localhost:3000/api/v1
```

## Autenticação

> _[Preencher: tipo de autenticação (Bearer, API Key, OAuth)]_

```bash
# Exemplo de request autenticado
curl -H "Authorization: Bearer {token}" https://[dominio]/api/v1/[endpoint]
```

## Endpoints

### [Recurso 1]

```
GET    /[recurso]        — Lista todos
GET    /[recurso]/:id    — Busca por ID
POST   /[recurso]        — Cria novo
PUT    /[recurso]/:id    — Atualiza
DELETE /[recurso]/:id    — Remove
```

> _[Preencher com os endpoints reais]_

## Códigos de Erro

| Código | Significado |
|--------|------------|
| 400 | Bad Request — dados inválidos |
| 401 | Unauthorized — token inválido ou ausente |
| 403 | Forbidden — sem permissão |
| 404 | Not Found |
| 500 | Internal Server Error |

---

_Responsável: @dev (Neo)_
