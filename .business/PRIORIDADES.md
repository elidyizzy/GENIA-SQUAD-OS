# PRIORIDADES — Arquivo Vivo
> Atualizar a cada mudança de foco. Data sempre visível.

**Última atualização:** 2026-03-23

---

## Foco agora — duas frentes em paralelo

```
FRENTE 1 (produto)        FRENTE 2 (educação/caixa)
SalesFlow.IA Sprint 1  ←→ Imersão Empresários
```

---

## Estado atual do SalesFlow.IA

**Repositório:** https://github.com/elidyizzy/salesflowia
**API:** https://salesflowia-api-production.up.railway.app (online)
**Cockpit:** em deploy — STORY-004 InProgress

### Stories

| Story | Título | Status |
|-------|--------|--------|
| STORY-001 | Setup do repositório | ✅ Done |
| STORY-002 | Webhook WhatsApp + Luma v2 | ✅ Done |
| STORY-003 | Deploy API Railway | ✅ Done |
| STORY-004 | Deploy cockpit web no Netlify | 🔄 InProgress |
| STORY-005 | Luma v2: state machine + retry + fallback | ⏳ Ready (após STORY-004) |

### O que está funcionando agora

- API no ar no Railway com health check ok
- Luma respondendo no WhatsApp com estado `COLLECTING_NEED`
- Bug crítico de `JSON.parse` corrigido — estado persiste entre mensagens
- Webhook Meta API recebendo e processando mensagens

### O que está pendente

1. **STORY-004** — cockpit web no Netlify (em execução agora)
2. **Excluir** serviço `salesflowia-web` quebrado no Railway
   - Service ID: `ab56613c-3efd-46ed-9dc7-95976b17fbe6`
3. **Testar** Luma com mensagem real no WhatsApp da BrasilUp
4. **STORY-005** — Luma v2 corrigida (após cockpit no ar)

### Infra Railway

| Recurso | ID |
|---------|-----|
| Project | `7b61ef7b-6bae-49ae-99bd-154eb724064a` |
| Service: salesflowia-api | `8399881c-37d3-4a6a-b390-a28d22187ae5` |
| Service: salesflowia-web (🗑️ deletar) | `ab56613c-3efd-46ed-9dc7-95976b17fbe6` |

---

## Projetos em movimento

| Projeto | Empresa | Status | Próxima ação |
|---------|---------|--------|--------------|
| **SalesFlow.IA** | GEN.IA SQUAD | Sprint 1 em execução | STORY-004 → STORY-005 |
| **Imersão Empresários** | GEN.IA SQUAD | Planejado | Após cockpit no ar |
| Funil BrasilUp | BrasilUp | Aguardando cockpit + Luma v2 | Teste real WhatsApp |
| Cuore Instagram | Cuore | Em execução | — |

---

## Por que o SalesFlow.IA é prioridade máxima

Ele mata dois problemas com uma única entrega:
1. **BrasilUp** — resolve o buraco negro pós-orçamento que está sangrando agora
2. **GEN.IA SQUAD** — é o produto âncora que lança a empresa no mercado

Sem o SalesFlow.IA pronto, não há plataforma. Sem a plataforma, não há recorrência.

---

## Roadmap — 1 mês (4 semanas)

```
Semana 1 — Core engine         ✅ Concluída
Semana 2 — Cockpit completo    🔄 Em execução (STORY-004)
Semana 3 — Follow-up D+1/3/7/14
Semana 4 — BrasilUp go live
```

---

## O que está travado

> Nada travado agora. STORY-004 em execução.

---

## Sequência estratégica completa

```
FASE 1 — Agora
├── SalesFlow.IA Sprint 1-2 (core engine + Luma v2 + pipeline)
└── Imersão: Fase 1 de conteúdo (construir prova pública)

FASE 2 — Quando Sprints 1-2 concluídos
├── SalesFlow.IA Sprint 3-4 (ORS integrado + enriquecimento)
└── Imersão: Fase 2-3 (lista de espera → lançamento → 1ª turma)

FASE 3 — Quando SalesFlow.IA completo
└── Lançamento da plataforma GEN.IA SQUAD
    ├── Portfólio: GEN.IA OS + Luma + ORS + Site template + SalesFlow.IA
    ├── Tiers: Starter / Pro / Enterprise
    └── Público: Empresas B2B querendo implementar IA na operação
```

---

## Decisões tomadas

| Data | Decisão |
|------|---------|
| 2026-03-13 | SalesFlow.IA é repositório plug and play — não SaaS hospedado |
| 2026-03-13 | Modelo de negócio: plataforma de assinatura anual (ref: Viver de IA) |
| 2026-03-13 | Plataforma só lança quando SalesFlow.IA estiver pronto |
| 2026-03-13 | Imersão e SalesFlow.IA rodam em paralelo |
| 2026-03-15 | Cockpit web: Netlify (não Railway) — app estático não precisa de Docker |
| 2026-03-15 | GEN.IA OS: NUNCA usar `npx create-genia-os` — sempre clonar do repositório oficial |
| 2026-03-15 | story-gate.py instalado — deploy bloqueado sem story InProgress |
| 2026-03-23 | create-genia-os@2.0.0: clona repo oficial em vez de template estático — mais confiável |
| 2026-03-23 | .agents/: estrutura paralela criada para suporte ao Google Antigravity |
| 2026-03-23 | Synapse Engine v1.1: detecção automática de início/fim de sessão via flag |

---

## Não fazer agora (mas não esquecer)

- Definir preços dos tiers da plataforma (após validação da imersão)
- Masterclass para times de dev (após imersão empresários validada)
- Multi-tenancy do SalesFlow.IA (fase 2)
- Dashboard de métricas (fase 2)
- Prospecção outbound (fase 2)

---

## Regra para o Claude Code

Ao iniciar qualquer sessão no salesflowia:
1. Ler este arquivo
2. Identificar a story InProgress
3. Perguntar: "Continuamos a STORY-[X]?"
4. Nunca perguntar o que já está documentado aqui

---

_Claude Code deve ler este arquivo no início de cada sessão e perguntar se algo mudou._
