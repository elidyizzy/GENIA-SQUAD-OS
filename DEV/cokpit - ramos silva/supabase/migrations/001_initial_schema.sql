-- =====================================================
-- Cockpit Ramos Silva — Schema Inicial
-- Migration: 001_initial_schema
-- =====================================================

-- Banco de Leads (dados brutos da PGFN)
CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cnpj            VARCHAR(14) UNIQUE NOT NULL,
  nome_empresa    VARCHAR(500) NOT NULL,
  valor_divida    DECIMAL(18,2) NOT NULL,
  uf              CHAR(2),
  classificacao   CHAR(1) NOT NULL,              -- A | B | C
  status          VARCHAR(20) DEFAULT 'novo',    -- novo | pipeline | descartado
  motivo_descarte TEXT,
  pgfn_raw        JSONB,
  data_entrada    TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_cnpj    ON leads(cnpj);
CREATE INDEX idx_leads_status  ON leads(status);
CREATE INDEX idx_leads_uf      ON leads(uf);
CREATE INDEX idx_leads_classif ON leads(classificacao);
CREATE INDEX idx_leads_valor   ON leads(valor_divida DESC);

-- Pipeline
CREATE TABLE pipeline_leads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id           UUID NOT NULL REFERENCES leads(id),
  estagio           VARCHAR(30) NOT NULL DEFAULT 'lead_bruto',
  resultado         VARCHAR(10),                 -- ganho | perdido
  motivo_fechamento TEXT,
  notas             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lead_id)
);

-- Histórico de estágios (append-only)
CREATE TABLE estagio_historico (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_lead_id  UUID NOT NULL REFERENCES pipeline_leads(id),
  estagio_anterior  VARCHAR(30),
  estagio_novo      VARCHAR(30) NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Enriquecimentos (um registro por tipo por lead)
CREATE TABLE enrichments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_lead_id  UUID NOT NULL REFERENCES pipeline_leads(id),
  tipo              VARCHAR(30) NOT NULL,        -- cadastral | maps | trf | decisores
  status            VARCHAR(20) DEFAULT 'pendente',
  dados             JSONB,
  erro              TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pipeline_lead_id, tipo)
);

-- Logs de sincronização PGFN
CREATE TABLE sync_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  iniciado_em     TIMESTAMPTZ DEFAULT NOW(),
  concluido_em    TIMESTAMPTZ,
  status          VARCHAR(20) DEFAULT 'em_andamento',
  qtd_novos       INT DEFAULT 0,
  qtd_atualizados INT DEFAULT 0,
  qtd_ignorados   INT DEFAULT 0,
  erro            TEXT
);

-- Configurações (chaves simples)
CREATE TABLE app_config (
  key        VARCHAR(100) PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO app_config (key, value) VALUES
  ('divida_minima', '1000000'),
  ('google_maps_api_key', ''),
  ('apollo_api_key', '');
