# PRIORIDADES — Arquivo Vivo
> Atualizar a cada mudança de foco. Data sempre visível.

**Última atualização:** 2026-04-17 (sessão de investigação de scraping + handover)

---

## Foco na próxima sessão

**ProspectAI — STORY-004 (Cockpit Kanban) — BLOQUEADA por decisão TRF**

**Bloqueador ativo:** Elidy vai testar manualmente o fluxo TRF1/TRF3 e enviar prints.
Após decisão (remover / manter vazio / buscar solução paga), @po aprova STORY-004 e @dev implementa.

**Descobertas críticas da sessão 2026-04-17:**
- PGFN scraper atual está quebrado (hCaptcha 401) — reescrever para Open Data (STORY-006)
- Banco Railway VAZIO — zero leads reais importados
- TRF1/TRF3 bloqueados em headless; Datajud não tem campo `partes` (impossível buscar por CNPJ)
- BrasilAPI OK · Railway DB OK · Apollo sem chave local (funciona em produção)
- STORY-006 criada e aprovada: filtros UF + Valor + Tipo de dívida via Open Data

**Handover completo em:** `.Apps/ProspectAI/docs/HANDOVER-2026-04-17.md`

---

## Projetos em movimento

| Projeto | Empresa | Status | Próxima ação |
|---------|---------|--------|--------------|
| **ProspectAI** | **Ramos Silva Advogados** | **Em desenvolvimento 🔵** | **STORY-004 cockpit (amanhã)** |
| geniasquad.com | GEN.IA SQUAD | No ar ✅ | Integrar TRINITY → SalesFlow |
| SalesFlow.IA | GEN.IA SQUAD | **No ar ✅ vendas.geniasquad.com** | Configurar IAs + ajustes visuais |
| FLG Trinity (conteúdo) | GEN.IA SQUAD | Estrutura pronta | Execução visual dos posts |
| OPERATOR FREE | GEN.IA SQUAD | Pendente | Iniciar build |

---

## O que está travado

- `SALESFLOW_URL=http://localhost:3000` no trinity-widget — leads do site não chegam no CRM

---

## Decisões tomadas

| Data | Decisão |
|------|---------|
| 2026-04-16 | `vendas.geniasquad.com` no ar — domínio Cloudflare configurado |
| 2026-04-16 | Login criado — credenciais master em segundo-cerebro |
| 2026-04-16 | Tema claro/escuro corrigido — Tailwind tokens → CSS variables RGB |
| 2026-04-14 | Site geniasquad.com no ar — TRINITY funcionando |
| 2026-04-14 | Repositório site-genia-squad criado no GitHub |
| 2026-04-14 | Migração Anthropic → OpenAI no SalesFlow concluída (STORY-034) |

---

## Não fazer agora (mas não esquecer)

- Auth multi-usuário SalesFlow (Elidy + Felipe) — depois da integração TRINITY
- OPERATOR FREE — depois da integração TRINITY
- Publicação automática de conteúdo — estruturar antes de automatizar

---

_Claude Code deve ler este arquivo no início de cada sessão e perguntar se algo mudou._
