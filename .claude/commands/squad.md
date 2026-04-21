# /squad — GEN.IA SQUAD — Agentes disponíveis

Exibe o estado do SQUAD e como invocar cada agente.

## Os 9 Agentes

| Slash Command | Agente | Nome | Quando usar |
|---------------|--------|------|-------------|
| `/analyst` | @analyst | Cypher | Novo projeto, briefing, requisitos, pesquisa |
| `/pm` | @pm | Morpheus | PRD, escopo, épicos, PITCH.md, roadmap |
| `/architect` | @architect | Trinity | Arquitetura, SPEC técnico, stack, ADRs |
| `/dev` | @dev | Neo | Implementar código, testes, refatorar |
| `/devops` | @devops | Tank | git push, PR, deploy, MCP, encerrar sessão |
| `/qa` | @qa | Smith | Revisar entrega, validar ACs, aprovar qualidade |
| `/reviewer` | @reviewer | Switch | Code review antes do merge |
| `/po` | @po | Oracle | Validar e aprovar stories para desenvolvimento |
| `/sm` | @sm | Mouse | Criar stories, gerenciar sprint, blockers |

## Workflow completo

```
PLANNING
  /analyst  → briefing (5 perguntas)
  /pm       → PRD.md + PITCH.md
  /architect → SPEC-TECNICO.md + .planning/STATE.md

APROVAÇÃO
  /po       → valida story (checklist 10 pts, mínimo 8)
  /sm       → cria STORY-NNN.md

DESENVOLVIMENTO
  /dev      → implementa código (commits locais, SEM push)

QA / DELIVERY
  /qa       → valida acceptance criteria
  /reviewer → code review
  /devops   → git push, PR, deploy
```

## Comandos de projeto

```
/project-state  → estado atual do projeto ativo (.planning/STATE.md)
/project-sync   → atualiza STATE.md após mudanças
/plan-story NNN → decompõe STORY-NNN em tasks atômicas XML
```

## Xquads (estratégia e negócio)

Menção a @ray-dalio, @dan-kennedy, @hormozi-offer, @brand-chief, @cmo-architect etc.
→ Synapse Engine injeta contexto de negócio automaticamente
→ Xquads RECOMENDAM, os 9 agentes do SQUAD EXECUTAM

---

*Para ativar um agente, basta digitar o slash command correspondente.*
