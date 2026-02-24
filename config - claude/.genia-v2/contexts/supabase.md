# Contexto: Supabase

> Base de conhecimento para integracao com Supabase.

## Configuracao

### Credenciais
```
URL: [ver .env - SUPABASE_URL]
API Key: [ver .env - SUPABASE_KEY]
Service Key: [ver .env - SUPABASE_SERVICE_KEY]
```

## Cliente Python

### Instalacao
```bash
pip install supabase
```

### Inicializacao
```python
from supabase import create_client

supabase = create_client(
    supabase_url=os.getenv("SUPABASE_URL"),
    supabase_key=os.getenv("SUPABASE_KEY")
)
```

## Operacoes CRUD

### Select
```python
# Todos os registros
data = supabase.table("tabela").select("*").execute()

# Com filtro
data = supabase.table("tabela").select("*").eq("coluna", valor).execute()

# Com ordenacao
data = supabase.table("tabela").select("*").order("coluna", desc=True).execute()

# Com limite
data = supabase.table("tabela").select("*").limit(10).execute()

# Colunas especificas
data = supabase.table("tabela").select("id, nome, email").execute()
```

### Insert
```python
data = supabase.table("tabela").insert({
    "coluna1": "valor1",
    "coluna2": "valor2"
}).execute()

# Bulk insert
data = supabase.table("tabela").insert([
    {"col": "val1"},
    {"col": "val2"}
]).execute()
```

### Update
```python
data = supabase.table("tabela").update({
    "coluna": "novo_valor"
}).eq("id", 123).execute()
```

### Delete
```python
data = supabase.table("tabela").delete().eq("id", 123).execute()
```

## Filtros

| Metodo | SQL | Uso |
|--------|-----|-----|
| eq | = | .eq("col", val) |
| neq | != | .neq("col", val) |
| gt | > | .gt("col", val) |
| gte | >= | .gte("col", val) |
| lt | < | .lt("col", val) |
| lte | <= | .lte("col", val) |
| like | LIKE | .like("col", "%val%") |
| ilike | ILIKE | .ilike("col", "%val%") |
| in_ | IN | .in_("col", [1,2,3]) |
| is_ | IS | .is_("col", None) |

## RPC (Functions)

```python
# Chamar funcao
data = supabase.rpc("nome_funcao", {"param": "valor"}).execute()
```

## Storage

```python
# Upload
supabase.storage.from_("bucket").upload("path/file.pdf", file_content)

# Download
data = supabase.storage.from_("bucket").download("path/file.pdf")

# URL publica
url = supabase.storage.from_("bucket").get_public_url("path/file.pdf")
```

## Auth

```python
# Sign up
supabase.auth.sign_up({"email": "...", "password": "..."})

# Sign in
supabase.auth.sign_in_with_password({"email": "...", "password": "..."})

# Sign out
supabase.auth.sign_out()

# Get user
user = supabase.auth.get_user()
```

## Gotchas
1. Usar service key para operacoes admin
2. RLS (Row Level Security) afeta queries com api key
3. Timestamps em ISO 8601
4. UUIDs para IDs

## Patterns

### Upsert
```python
data = supabase.table("tabela").upsert({
    "id": 123,
    "coluna": "valor"
}).execute()
```

### Count
```python
count = supabase.table("tabela").select("*", count="exact").execute()
print(count.count)
```

---

*Contexto carregado automaticamente quando detectado uso de Supabase.*
