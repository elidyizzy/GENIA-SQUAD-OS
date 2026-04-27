# Documentação Técnica — Cockpit Ramos Silva
**Versão:** 1.0 | **Data:** 2026-04-26 | **Autor:** GEN.IA SQUAD

---

## 1. Visão Geral do Sistema

O Cockpit Ramos Silva é uma aplicação web que automatiza a captação e qualificação de leads tributários a partir dos dados públicos da PGFN (Procuradoria-Geral da Fazenda Nacional). O sistema integra 5 APIs externas, mantém um banco de leads com mais de 2,4 milhões de CNPJs e executa enriquecimento on-demand por CNPJ via painel Kanban.

---

## 2. Stack Completa

### Frontend
| Tecnologia | Versão | Função |
|---|---|---|
| Next.js | 16.2.4 | Framework React com App Router — SSR + API Routes |
| React | 19.2.4 | Biblioteca de UI |
| TypeScript | 5.x | Tipagem estática em todo o projeto |
| TailwindCSS | 4.x | Estilização utility-first |
| shadcn/ui | 4.x | Componentes base (Button, Badge, etc.) |
| @dnd-kit | 6.x / 10.x | Drag-and-drop do Kanban |
| @tanstack/react-query | 5.x | Cache e sincronização de estado servidor |
| recharts | 3.x | Gráficos do Dashboard Executivo |
| motion | 12.x | Animações (barras de progresso, transições) |
| lucide-react | 1.x | Ícones SVG |

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| Next.js App Router | 16.2.4 | API Routes (`/api/**`) — servidor Node.js |
| pg (node-postgres) | 8.x | Cliente PostgreSQL com pool de conexões |
| TypeScript | 5.x | Tipagem em todas as rotas e serviços |

### Banco de Dados
| Tecnologia | Função |
|---|---|
| PostgreSQL 16 | Banco principal — leads, pipeline, enriquecimentos |
| Railway | Plataforma de hospedagem do banco (managed PostgreSQL) |

### Infraestrutura
| Componente | Plataforma | Detalhe |
|---|---|---|
| Web App | Railway | Serviço `cockpit-web`, build automático via Docker/Railpack |
| Banco de dados | Railway | PostgreSQL gerenciado, mesma região que o web app |
| Sync PGFN | Node.js script local | `scripts/pgfn-sync/` — executado manualmente ou via cron |
| Repositório | GitHub | Branch `feat/1.1-setup-infra` |

---

## 3. Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         COCKPIT WEB (Railway)                   │
│  Next.js 16 App Router                                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  /banco-leads │  │  /pipeline   │  │  /dashboard          │  │
│  │  Tabela leads │  │  Kanban +    │  │  KPIs + Gráficos     │  │
│  │  Filtros      │  │  Modal       │  │  Recharts            │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
│         │                 │                                      │
│         └────────┬────────┘                                      │
│                  ▼                                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    API Routes (/api/**)                  │    │
│  │  /api/leads          /api/pipeline/[id]/enrich/*        │    │
│  │  /api/pipeline       /api/config                        │    │
│  │  /api/dashboard      /api/sync/logs                     │    │
│  └─────────────────────┬───────────────────────────────────┘    │
│                         │                                        │
└─────────────────────────┼────────────────────────────────────────┘
                          │
          ┌───────────────┼──────────────────────────┐
          ▼               ▼                          ▼
  ┌──────────────┐  ┌──────────────────┐   ┌──────────────────────┐
  │  PostgreSQL  │  │  APIs Externas   │   │  PGFN Sync Script    │
  │  (Railway)   │  │  CNPJ.ws         │   │  Node.js local       │
  │              │  │  Geoapify        │   │  Baixa CSVs PGFN     │
  │  6 tabelas   │  │  DataJud CNJ     │   │  ~2.4M CNPJs         │
  │              │  │  Apollo.io       │   │  Upsert no banco     │
  └──────────────┘  └──────────────────┘   └──────────────────────┘
```

---

## 4. O Que Foi Construído — Passo a Passo

### Etapa 1 — Infraestrutura (Story 1.1)
- Criação do repositório e estrutura de monorepo (`apps/web`, `scripts/pgfn-sync`)
- Schema do banco PostgreSQL: 6 tabelas (leads, pipeline_leads, estagio_historico, enrichments, sync_logs, app_config)
- Deploy inicial no Railway
- Variáveis de ambiente configuradas

### Etapa 2 — Sync PGFN (Story 1.2)
- Script TypeScript que faz download dos 4 arquivos CSV da PGFN (~8 GB descomprimidos no total)
- Parser de CSV com streaming para evitar estouro de memória
- Detecção automática de categoria por nome do arquivo: `previdenciario`, `nao_previdenciario`, `fgts`, `nao_tributario`
- Acumulação em memória por CNPJ, somando valor total de dívida de todas as categorias
- Campo `pgfn_raw` (JSONB) armazena breakdown por categoria
- Upsert final em lote: 2.435.916 CNPJs carregados com `pgfn_raw` completo

### Etapa 3 — Banco de Leads (Story 2.1)
- Página `/banco-leads` com tabela paginada (100 leads por página)
- Filtros: busca por nome/CNPJ, classificação A/B/C, UF, status
- Classificação automática: A ≥ R$3M / B R$1M–R$3M / C < R$1M
- Ação "Mover para Pipeline": cria registro em `pipeline_leads`, muda `status` em `leads`
- Ação "Descartar": salva motivo, muda status
- Modal PGFN: breakdown da dívida por categoria com barras proporcionais animadas

### Etapa 4 — Pipeline Kanban (Story 3.1 / 3.2)
- Página `/pipeline` com Kanban drag-and-drop (@dnd-kit)
- 7 colunas: Lead Bruto → Enriquecido → Qualificado → Contato → Diagnóstico → Proposta → Fechado/Perdido
- Modal de lead com 5 seções: Dados PGFN, Dados Cadastrais, Validação Operacional, Inteligência Jurídica, Decisores
- Notas com autosave
- Histórico de estágios (append-only, imutável)
- Componente genérico `EnrichSection` com badge Pendente/Feito/Erro e botão Enriquecer/Atualizar

### Etapa 5 — Enriquecimento Cadastral (Story 3.3)
- `POST /api/pipeline/[id]/enrich/cadastral`
- Primário: **CNPJ.ws** (`publica.cnpj.ws/cnpj/{cnpj}`) — aceita IPs de datacenter
- Fallback: **BrasilAPI** (`brasilapi.com.br/api/cnpj/v1/{cnpj}`)
- Mapeamento de campos: endereço completo, situação cadastral, CNAE, capital social, QSA (quadro societário)
- Detecção automática da estrutura da resposta (CNPJ.ws vs BrasilAPI têm schemas diferentes)
- Resultado salvo em `enrichments` (UPSERT por `pipeline_lead_id + tipo`)

### Etapa 6 — Validação Operacional / Maps (Story 3.3)
- `POST /api/pipeline/[id]/enrich/maps`
- **Geoapify Geocoding API** (`api.geoapify.com/v1/geocode/search`)
- Query construída com razão social + município + UF + "Brasil"
- Retorna: endereço formatado, lat/lon, link Google Maps (`maps.google.com?q=lat,lon`)
- Badge "Encontrado / Não encontrado"

### Etapa 7 — Inteligência Jurídica / TRF (Story 3.4)
- `POST /api/pipeline/[id]/enrich/trf`
- Mapeamento UF → TRF (1 a 6): MG→TRF6, SP→TRF3, RJ→TRF2, etc.
- **DataJud CNJ API** (`api-publica.datajud.cnj.jus.br/api_publica_trf{N}/_search`)
- Query Elasticsearch: `match` em `partes.documento` pelo CNPJ
- Retorna: processos com número, classe, tribunal, data de ajuizamento
- Cálculo de risco: Baixo (0), Médio (1–3), Alto (4+)
- Chave pública do CNJ (sem custo)

### Etapa 8 — Decisores (Story 3.4)
- `POST /api/pipeline/[id]/enrich/decisores`
- Requer enriquecimento cadastral prévio (lê QSA do `enrichments`)
- Para cada sócio (até 5): chama **Apollo.io** `POST /api/v1/people/match` com nome + empresa
- Retorna: nome, cargo, email, LinkedIn
- Fallback: se Apollo não encontra nenhum perfil, usa os próprios sócios do QSA (badge "Quadro Societário")
- Diferencia fonte com campo `source: 'apollo' | 'qsa'`

---

## 5. Endpoints da API

| Método | Endpoint | Função |
|---|---|---|
| GET | `/api/leads` | Lista leads com filtros e paginação |
| POST | `/api/leads/[id]/pipeline` | Move lead para o pipeline |
| POST | `/api/leads/[id]/descartar` | Descarta lead com motivo |
| GET | `/api/leads/[id]/pgfn` | Retorna dados PGFN + pgfn_raw do lead |
| GET | `/api/pipeline` | Lista cards do Kanban com enriquecimentos |
| GET | `/api/pipeline/[id]` | Detalhes do pipeline lead (modal) |
| PUT | `/api/pipeline/[id]/estagio` | Move lead para novo estágio |
| PUT | `/api/pipeline/[id]/notas` | Salva notas (autosave) |
| POST | `/api/pipeline/[id]/enrich/cadastral` | Enriquecimento via CNPJ.ws/BrasilAPI |
| POST | `/api/pipeline/[id]/enrich/maps` | Enriquecimento via Geoapify |
| POST | `/api/pipeline/[id]/enrich/trf` | Processos jurídicos via DataJud CNJ |
| POST | `/api/pipeline/[id]/enrich/decisores` | Decisores via Apollo.io + fallback QSA |
| GET | `/api/dashboard` | KPIs e dados para o Dashboard Executivo |
| GET/PUT | `/api/config` | Lê e salva configurações (API keys, filtros) |
| GET | `/api/config/test/apollo` | Testa conexão com Apollo.io |
| GET | `/api/config/test/google_maps` | Testa conexão com Google Maps |
| GET | `/api/sync/logs` | Histórico de execuções do sync PGFN |

---

## 6. Banco de Dados — Schema Completo

### Tabela: `leads`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID PK | Identificador único |
| cnpj | VARCHAR(14) UNIQUE | CNPJ sem formatação |
| nome_empresa | VARCHAR(500) | Razão social |
| valor_divida | DECIMAL(18,2) | Soma de todas as categorias de dívida |
| uf | CHAR(2) | Estado (SP, MG, RJ...) |
| classificacao | CHAR(1) | A (≥R$3M) / B (R$1M–3M) / C (<R$1M) |
| status | VARCHAR(20) | novo / pipeline / descartado |
| motivo_descarte | TEXT | Motivo do descarte (opcional) |
| pgfn_raw | JSONB | Breakdown: `{previdenciario, nao_previdenciario, fgts, nao_tributario}` |
| data_entrada | TIMESTAMPTZ | Data de entrada na base |
| updated_at | TIMESTAMPTZ | Última atualização |

**Índices:** cnpj, status, uf, classificacao, valor_divida DESC

### Tabela: `pipeline_leads`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID PK | Identificador do card no pipeline |
| lead_id | UUID FK→leads | Referência ao lead |
| estagio | VARCHAR(30) | lead_bruto / enriquecido / qualificado / contato / diagnostico / proposta / fechado |
| resultado | VARCHAR(10) | ganho / perdido (quando fechado) |
| motivo_fechamento | TEXT | Motivo do fechamento |
| notas | TEXT | Notas livres do prospector |
| created_at | TIMESTAMPTZ | Data de entrada no pipeline |
| updated_at | TIMESTAMPTZ | Última atualização |

### Tabela: `estagio_historico`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID PK | - |
| pipeline_lead_id | UUID FK | Referência ao card |
| estagio_anterior | VARCHAR(30) | Estágio de origem |
| estagio_novo | VARCHAR(30) | Estágio de destino |
| created_at | TIMESTAMPTZ | Data da movimentação |

### Tabela: `enrichments`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID PK | - |
| pipeline_lead_id | UUID FK | Referência ao card |
| tipo | VARCHAR(30) | cadastral / maps / trf / decisores |
| status | VARCHAR(20) | pendente / sucesso / erro |
| dados | JSONB | Dados retornados pela API |
| erro | TEXT | Mensagem de erro (quando status=erro) |
| created_at | TIMESTAMPTZ | Criação |
| updated_at | TIMESTAMPTZ | Última atualização |

**Constraint:** UNIQUE(pipeline_lead_id, tipo) — 1 registro por tipo por lead

### Tabela: `sync_logs`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID PK | - |
| iniciado_em | TIMESTAMPTZ | Início do sync |
| concluido_em | TIMESTAMPTZ | Fim do sync |
| status | VARCHAR(20) | em_andamento / sucesso / erro |
| qtd_novos | INT | Novos CNPJs inseridos |
| qtd_atualizados | INT | CNPJs atualizados |
| qtd_ignorados | INT | CNPJs com dívida < mínimo |
| erro | TEXT | Erro fatal (se houver) |

### Tabela: `app_config`
| Coluna | Tipo | Descrição |
|---|---|---|
| key | VARCHAR(100) PK | Nome da configuração |
| value | TEXT | Valor |
| updated_at | TIMESTAMPTZ | Última alteração |

**Chaves padrão:** `divida_minima` (1000000), `apollo_api_key`, `google_maps_api_key`

---

## 7. Variáveis de Ambiente

| Variável | Onde | Descrição |
|---|---|---|
| `DATABASE_URL` | Railway (web) + pgfn-sync/.env | Connection string PostgreSQL |
| `APOLLO_API_KEY` | Railway (web) | Chave de API Apollo.io |
| `GEOAPIFY_API_KEY` | Railway (web) | Chave de API Geoapify |
| `PGFN_DIVIDA_MINIMA` | pgfn-sync/.env | Valor mínimo de dívida (padrão: 1000000) |

---

## 8. Informações de Acesso

| Recurso | Detalhes |
|---|---|
| **Aplicação web** | URL gerada pelo Railway (serviço `cockpit-web`) |
| **Banco de dados** | Railway PostgreSQL — acessar via Railway dashboard ou `DATABASE_URL` |
| **Projeto Railway** | ID: `b498e89f-758c-48c6-9c5b-76e2c31b6125` |
| **Serviço Railway** | ID: `1769eefe-014e-4a5d-b44a-5f552e54079a` |
| **Repositório GitHub** | `github.com/elidyizzy/GENIA-SQUAD-OS` — branch `feat/1.1-setup-infra` |
| **Script PGFN Sync** | `scripts/pgfn-sync/` — rodar com `npm run sync` (requer `.env` local) |

---

## 9. Estrutura de Diretórios

```
cokpit - ramos silva/
├── apps/
│   └── web/                          # Next.js 16 App
│       ├── app/
│       │   ├── api/                  # Todas as API Routes
│       │   │   ├── leads/
│       │   │   ├── pipeline/
│       │   │   ├── dashboard/
│       │   │   └── config/
│       │   ├── banco-leads/          # Página Banco de Leads
│       │   ├── pipeline/             # Página Pipeline Kanban
│       │   ├── dashboard/            # Página Dashboard
│       │   └── configuracoes/        # Página Configurações
│       ├── components/
│       │   ├── pipeline/             # Modal, EnrichSection, KanbanBoard
│       │   ├── banco-leads/          # Tabela, filtros, modais
│       │   └── ui/                   # shadcn components
│       ├── hooks/                    # usePipelineLead, useLeads
│       └── lib/
│           ├── db.ts                 # Pool PostgreSQL (queryOne, query)
│           └── services/
│               └── trf.ts            # Serviço DataJud CNJ
├── scripts/
│   └── pgfn-sync/                    # Script de sincronização PGFN
│       ├── src/
│       │   ├── pgfn-downloader.ts   # Download + detecção de categoria
│       │   ├── csv-parser.ts        # Parser de CSV streaming
│       │   ├── supabase-upsert.ts   # Upsert acumulado com pgfn_raw
│       │   └── sync.ts              # Orquestrador principal
│       └── .env                     # DATABASE_URL + PGFN_DIVIDA_MINIMA
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql   # Schema completo do banco
```
