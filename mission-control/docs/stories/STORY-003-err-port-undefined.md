# STORY-003 — Corrigir err.port undefined no handler EADDRINUSE

**Status:** Done
**Agente:** @qa (Smith) — aprovado
**Criado:** 2026-03-28
**Estimativa:** P

**Empresa:** GEN.IA SQUAD
**Projeto:** mission-control

---

## Descrição

Como desenvolvedora rodando o Mission Control, quero que o fallback de porta funcione corretamente para que o servidor sempre tente a próxima porta válida sem resultar em NaN.

## Acceptance Criteria

- [ ] AC1: Fallback de porta usa valor numérico válido mesmo quando `err.port` é undefined
- [ ] AC2: Console exibe a porta correta no aviso de troca
- [ ] AC3: Servidor sobe na porta `PORT + N` (onde N é o número de tentativas)

## Tasks Técnicas

- [ ] Task 1: Substituir `err.port` por variável de controle que rastreia a porta atual tentada
- [ ] Task 2: Aplicar fix em `mission-control/server.js` (repo) e em `teste-mc`

## Branch

`fix/STORY-003-err-port-undefined`

## Arquivos Envolvidos

- `mission-control/server.js`
- `C:\Users\elidy\teste-mc\teste-missioncontrol\mission-control\server.js`

## Dependências

- STORY-002 (deve estar Done para testar em conjunto)

## Riscos

- Nenhum — correção de variável no handler de erro
