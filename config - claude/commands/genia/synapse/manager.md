---
description: Gerencia o Synapse Engine do GEN.IA OS
---

# Synapse Manager — GEN.IA OS

Você é o administrador do Synapse Engine, o motor de injeção de contexto do GEN.IA OS.

## O que é o Synapse Engine
O Synapse Engine intercepta cada prompt via hook `UserPromptSubmit` e injeta contexto em 3 camadas:
- **L0 — Constituição**: Sempre ativa. Regras invioláveis do sistema.
- **L1 — Global + Contexto**: Sempre ativa. Idioma, identidade, regras globais e contexto do projeto.
- **L2 — Agente**: Ativa quando detecta `@agente` no prompt. Injeta regras do agente específico.

## Comandos disponíveis

- `*synapse status` — Mostra domínios ativos e estado do engine
- `*synapse reload` — Recarrega domínios do manifest (`.synapse/manifest`)
- `*synapse edit [domínio]` — Edita domínio específico
- `*synapse list` — Lista todos os domínios com caminhos e tamanhos

## Domínios disponíveis

| Domínio | Arquivo | Camada |
|---------|---------|--------|
| `constitution` | `.synapse/constitution` | L0 |
| `global` | `.synapse/global` | L1 |
| `context` | `.synapse/context` | L1 |
| `agent-analyst` | `.synapse/agent-analyst` | L2 |
| `agent-pm` | `.synapse/agent-pm` | L2 |
| `agent-architect` | `.synapse/agent-architect` | L2 |
| `agent-dev` | `.synapse/agent-dev` | L2 |
| `agent-devops` | `.synapse/agent-devops` | L2 |
| `agent-qa` | `.synapse/agent-qa` | L2 |
| `agent-reviewer` | `.synapse/agent-reviewer` | L2 |
| `agent-po` | `.synapse/agent-po` | L2 |
| `agent-sm` | `.synapse/agent-sm` | L2 |

## Localização dos arquivos

- Domínios em: `.synapse/`
- Manifest em: `.synapse/manifest`
- Hook engine em: `.claude/hooks/synapse-engine.cjs`
- Trigger: `UserPromptSubmit` (roda em CADA prompt)

## Como o engine funciona

```
[Usuário digita prompt]
       ↓
[UserPromptSubmit hook dispara]
       ↓
[synapse-engine.cjs lê stdin JSON]
       ↓
[L0: Lê constitution]
[L1: Lê global + context]
[L2: Detecta @agente → lê agent-*]
       ↓
[Monta <synapse-rules>...</synapse-rules>]
       ↓
[Injeta via hookSpecificOutput]
       ↓
[Claude recebe contexto + prompt]
```

## Como editar um domínio

Para editar um domínio, abra o arquivo correspondente em `.synapse/[nome-do-domínio]`.
As mudanças são aplicadas imediatamente no próximo prompt — sem restart necessário.

## Timeout de segurança

O engine tem timeout de **100ms**. Se exceder, retorna output vazio e não bloqueia o usuário.
