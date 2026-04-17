# Task: Criar/Atualizar STATE.md do Projeto

> Tarefa executada por @dev ou @sm após cada story concluída, ou por @architect ao iniciar projeto.
> Output: `.planning/STATE.md` na raiz do projeto

---

## Objetivo

Manter um arquivo vivo de estado cross-session que o Synapse Engine injeta automaticamente como contexto L3. Elimina o "trabalho genérico" — Claude sempre sabe o que já foi feito, qual a stack, quais decisões foram tomadas e o que vem a seguir.

---

## Quando Criar

- Ao iniciar qualquer projeto novo (parte do protocolo de novo projeto)
- Após cada story ser marcada como Done

## Quando Atualizar

- A cada mudança de fase ou milestone
- Quando uma decisão arquitetural é tomada
- Quando um blocker é encontrado ou resolvido
- Ao encerrar uma sessão relevante

---

## Estrutura do .planning/

```
.planning/
├── STATE.md              ← estado cross-session (este arquivo)
└── stories/
    ├── STORY-NNN-PLAN.md     ← plano XML atômico da story
    └── STORY-NNN-SUMMARY.md  ← o que foi feito
```

---

## Template Completo

```markdown
# STATE — [Nome do Projeto]

> Arquivo vivo de estado cross-session.
> Injetado automaticamente pelo Synapse Engine (L3) em cada sessão.
> Última sincronização: YYYY-MM-DD por @[agente]

---

## Identidade do Projeto

| Campo | Valor |
|-------|-------|
| Nome | [nome do projeto] |
| Empresa | [empresa responsável] |
| Responsável | Elidy Izidio |
| Iniciado | YYYY-MM-DD |
| Fase atual | Planning \| Development \| QA \| Delivery |
| Milestone/Sprint | [nome ou número] |

---

## Stack Confirmada

| Camada | Tecnologia |
|--------|-----------|
| Frontend | [ex: Next.js 14, React, Tailwind] |
| Backend | [ex: Python FastAPI, Node.js] |
| Banco | [ex: PostgreSQL Railway, Supabase] |
| Infra | [ex: Railway, Vercel, Cloudflare] |
| Auth | [ex: JWT, Supabase Auth, NextAuth] |
| Testes | [ex: pytest, Jest, Vitest] |

---

## Stories por Estado

### ✅ Done
<!-- Stories implementadas, testadas, deployadas -->
- [STORY-001 — Título]: Done em YYYY-MM-DD

### 🔵 InProgress
<!-- Story sendo desenvolvida agora -->
- [STORY-NNN — Título]: InProgress desde YYYY-MM-DD | @dev

### 📋 Ready (aprovadas pelo @po, aguardando dev)
- [STORY-NNN — Título]

### 📝 Draft (criadas pelo @sm, aguardando @po)
- [STORY-NNN — Título]

### 🔜 Backlog
- [STORY-NNN — Título]

---

## Decisões Arquiteturais

| Data | Decisão | Justificativa |
|------|---------|---------------|
| YYYY-MM-DD | [decisão] | [por quê foi tomada] |

---

## Contexto Técnico Crítico

<!-- O que Claude PRECISA saber para não re-derivar a cada sessão -->
<!-- Ex: variáveis de ambiente, endpoints, padrões específicos do projeto -->

```
[Cole aqui informações que mudam como Claude responde ao projeto]
```

---

## Blockers Atuais

- [ ] [blocker ativo — data de descoberta]

---

## Próximos Passos

1. [Próxima ação imediata com agente responsável]
2. [Segunda ação]

---

## Histórico de Sessões

| Data | O que foi feito | Agente |
|------|----------------|--------|
| YYYY-MM-DD | [resumo] | @dev |

---

*Atualizado por @sm ou @dev a cada story Done.*
*Lido automaticamente pelo Synapse Engine L3.*
```

---

## Critérios de Saída

- [ ] `.planning/STATE.md` existe na raiz do projeto
- [ ] Stack confirmada preenchida
- [ ] Stories organizadas por estado atual
- [ ] Decisões arquiteturais documentadas
- [ ] Contexto técnico crítico preenchido
- [ ] Próximos passos definidos

---

*GEN.IA OS v2.1 — Be Data — Elidy Izidio*
