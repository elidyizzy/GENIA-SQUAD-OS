# BrasilUp — Contexto do Negócio
> Camada 1 — Carregar quando tarefa envolve BrasilUp, funil, Luma ou orçamentos.

---

## O que é

Brasil Uniformes. Empresa de uniformes corporativos em Minas Gerais.
Site: brasilup.com

**Papel da Elidy:** Sales Ops / Rev Ops. Responsável por todo o funil de vendas:
tráfego (Google Ads, Meta Ads), engenharia de marketing e closer sênior.

---

## Funil atual

| Etapa | Status | Problema |
|-------|--------|---------|
| Google Ads → Site | ✅ Funcionando | — |
| Luma (agente SDR WhatsApp) | ⚠️ Instável | Campos 'None', leads esfriando |
| Qualificação | 🔴 Manual e lento | Depende 100% da Elidy |
| Gerar orçamento (ORS) | ✅ Funcionando | Sistema separado |
| Envio do orçamento | ✅ Funcionando | — |
| **Pós-orçamento** | 🔴 **BURACO NEGRO** | Sem follow-up, sem priorização, sem enriquecimento |

**O maior problema ativo:** sem cadência pós-orçamento. Leads morrem depois que o orçamento é enviado.

---

## Relação com SalesFloIA

BrasilUp é o **laboratório piloto** do produto SalesFloIA.
Cada problema real da BrasilUp vira feature validada do produto.

**Ordem de resolução pelos sprints:**
- Sprint 1-2: Luma v2 estável + pipeline visual
- Sprint 3-4: ORS integrado + enriquecimento básico
- Sprint 5-6: Follow-up automatizado (resolve o buraco negro)

---

## Dados técnicos relevantes

- CRM atual: Kommo
- Agente SDR: Luma (Claude Code, WhatsApp)
- Sistema de orçamento: ORS (Streamlit, Claude Code)
- Pipelines: funil principal, acompanhamento, reativação
- Contexto da API: `.genia/contexts/kommo-crm.md`
