# APIs, Integrações e Banco de Dados — Cockpit Ramos Silva
**Versão:** 1.0 | **Data:** 2026-04-26

---

## PLANILHA DE APIs UTILIZADAS

| # | API / Fonte | Função em 1 linha | Endpoint Principal | Autenticação | Custo | Onde é usada |
|---|---|---|---|---|---|---|
| 1 | **PGFN Dados Abertos** | Fonte primária de leads — 4 CSVs com todos os devedores da União | `dados-abertos PGFN (gov.br)` | Nenhuma (público) | Gratuito | Script pgfn-sync |
| 2 | **CNPJ.ws** | Dados cadastrais completos por CNPJ (primário — aceita datacenter) | `publica.cnpj.ws/cnpj/{cnpj}` | Nenhuma (público) | Gratuito | `/enrich/cadastral` |
| 3 | **BrasilAPI CNPJ** | Fallback cadastral quando CNPJ.ws falha | `brasilapi.com.br/api/cnpj/v1/{cnpj}` | Nenhuma (público) | Gratuito | `/enrich/cadastral` |
| 4 | **Geoapify Geocoding** | Geolocalização de empresa por nome+cidade+UF com link Google Maps | `api.geoapify.com/v1/geocode/search` | API Key (header) | Gratuito (3.000 req/dia) | `/enrich/maps` |
| 5 | **DataJud CNJ** | Processos judiciais federais por CNPJ nos TRFs 1–6 | `api-publica.datajud.cnj.jus.br/api_publica_trf{N}/_search` | APIKey pública CNJ | Gratuito | `/enrich/trf` |
| 6 | **Apollo.io People Match** | Enriquecimento de pessoas — cargo, email e LinkedIn dos sócios | `api.apollo.io/api/v1/people/match` | X-Api-Key (header) | Plano pago Apollo | `/enrich/decisores` |

---

## MINI DICIONÁRIO DAS APIs

### 1. PGFN Dados Abertos
> Conjunto de dados públicos da Procuradoria-Geral da Fazenda Nacional com todos os CNPJs devedores da União. Publicado em 4 arquivos CSV separados por categoria de dívida. Atualizado periodicamente pelo governo.

**Categorias dos arquivos:**
| Arquivo | Categoria interna | Conteúdo |
|---|---|---|
| `Nao_Previdenciario` | `nao_previdenciario` | Dívidas tributárias não previdenciárias (maior volume, ~8GB) |
| `Previdenciario` | `previdenciario` | Contribuições previdenciárias em atraso |
| `FGTS` | `fgts` | Fundo de Garantia do Tempo de Serviço |
| `Nao_Tributario` | `nao_tributario` | Multas, empréstimos e outras dívidas não tributárias |

---

### 2. CNPJ.ws
> API pública que espelha a base da Receita Federal. Aceita requisições de IPs de datacenter (diferente da BrasilAPI que bloqueia). Estrutura aninhada: dados do estabelecimento ficam em `estabelecimento{}`, sócios em `socios[]`.

**Campos-chave na resposta:**
```
estabelecimento.cidade.nome     → Município
estabelecimento.estado.sigla    → UF
estabelecimento.atividade_principal.id          → Código CNAE
estabelecimento.atividade_principal.descricao   → Descrição CNAE
socios[].nome                   → Nome do sócio
socios[].qualificacao_socio.descricao → Qualificação (Sócio-Administrador, etc.)
```

---

### 3. BrasilAPI CNPJ
> Wrapper da Receita Federal mantido pela comunidade open-source. Estrutura flat (campos diretamente na raiz). Bloqueada para IPs de datacenter — usada apenas como fallback quando CNPJ.ws falha.

---

### 4. Geoapify Geocoding API
> Serviço de geocodificação que converte texto de endereço em coordenadas geográficas. Usado para validar a existência física da empresa a partir do nome + município. Retorna lat/lon que é convertido em link Google Maps.

**Parâmetros usados:**
```
text    = "RAZÃO SOCIAL MUNICIPIO UF Brasil"
lang    = pt
limit   = 1
filter  = countrycode:br
```

---

### 5. DataJud CNJ (Conselho Nacional de Justiça)
> API pública oficial do CNJ que expõe o índice nacional de processos judiciais via Elasticsearch. Cobre todos os tribunais brasileiros. Para o Cockpit, consulta os 6 TRFs da Justiça Federal por CNPJ nas partes do processo.

**Mapeamento UF → TRF:**
| TRF | Estados |
|---|---|
| TRF1 (Brasília) | AC AM AP BA DF GO MA MT PA PI RO RR TO |
| TRF2 (Rio de Janeiro) | ES RJ |
| TRF3 (São Paulo) | MS SP |
| TRF4 (Porto Alegre) | PR RS SC |
| TRF5 (Recife) | AL CE PB PE RN SE |
| TRF6 (Belo Horizonte) | MG |

**Query Elasticsearch:**
```json
{ "query": { "match": { "partes.documento": "CNPJ_SEM_FORMATACAO" } }, "size": 20 }
```

**Chave pública CNJ:** `cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==`

---

### 6. Apollo.io People Match
> Plataforma de inteligência de vendas. O endpoint `people/match` tenta identificar um perfil profissional pelo nome + empresa. Retorna cargo atual, email corporativo e URL do LinkedIn quando encontra o perfil.

**Fallback QSA:** Quando Apollo não encontra nenhum perfil, o sistema usa os próprios sócios do QSA (retornados pelo CNPJ.ws/BrasilAPI) como "decisores", exibindo badge "Quadro Societário" para indicar a origem.

---

## BANCO DE DADOS — INFORMAÇÕES COMPLETAS

### Conexão
```
Host:     monorail.proxy.rlwy.net (ou domínio interno Railway)
Porta:    5432
Database: railway
Usuario:  postgres
Password: [armazenada em DATABASE_URL no Railway]
```

**Connection String (formato):**
```
postgresql://postgres:PASSWORD@HOST:PORT/railway
```

### Volume de Dados (referência 2026-04-26)
| Tabela | Registros | Observação |
|---|---|---|
| leads | ~2.435.916 | CNPJs com dívida PGFN, todos com pgfn_raw |
| pipeline_leads | 1+ | Leads movidos para o pipeline |
| enrichments | 4 por lead no pipeline | 4 tipos: cadastral, maps, trf, decisores |
| estagio_historico | Crescente | 1+ entrada por movimentação |
| sync_logs | 2+ | Histórico das execuções do sync |
| app_config | 3 | divida_minima, apollo_api_key, geoapify_api_key |

### Exemplo de `pgfn_raw` (JSONB)
```json
{
  "previdenciario": 4776386.00,
  "nao_previdenciario": 18848414.00,
  "fgts": 0,
  "nao_tributario": 0
}
```
*Soma = valor_divida total na tabela leads*

### Exemplo de `dados` em enrichments (tipo: cadastral)
```json
{
  "razao_social": "EXPRESSO OCIDENTAL LOGISTICA INTEGRADA LTDA",
  "situacao_cadastral": "Ativa",
  "cnae_fiscal": "4930202",
  "cnae_fiscal_descricao": "Transporte rodoviário de carga",
  "capital_social": 500000,
  "qsa": [
    { "nome_socio": "ROGERIO GONCALVES DE BRITO", "qualificacao_socio": "Sócio-Administrador" },
    { "nome_socio": "LUCIA DE FATIMA MARQUES", "qualificacao_socio": "Sócio-Administrador" }
  ],
  "endereco_completo": "RUA X, 123, UBERLÂNDIA, MG",
  "municipio": "Uberlândia",
  "uf": "MG"
}
```

---

## LIMITES E QUOTAS DAS APIS

| API | Limite Gratuito | Plano atual | Ação se atingir |
|---|---|---|---|
| PGFN Dados Abertos | Ilimitado | Gratuito | N/A |
| CNPJ.ws | Rate limit informal (~10 req/s) | Gratuito | Retry automático |
| BrasilAPI | Rate limit informal | Gratuito | Fallback já implementado |
| Geoapify | 3.000 req/dia | Free tier | Upgrade para Basic ($49/mês) |
| DataJud CNJ | Desconhecido (API pública) | Gratuito | Monitorar uso |
| Apollo.io | Conforme plano contratado | Plano Ramos Silva | Verificar créditos no painel |
