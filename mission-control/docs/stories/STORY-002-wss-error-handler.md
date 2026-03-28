# STORY-002 — Adicionar handler de erro no WebSocketServer

**Status:** Done
**Agente:** @qa (Smith) — aprovado
**Criado:** 2026-03-28
**Estimativa:** P

**Empresa:** GEN.IA SQUAD
**Projeto:** mission-control

---

## Descrição

Como desenvolvedora rodando o Mission Control, quero que o servidor nunca crasha por porta ocupada para que eu possa iniciar o sistema sem precisar matar processos manualmente.

## Acceptance Criteria

- [ ] AC1: `wss.on('error')` presente — erros re-emitidos pelo ws não crasham o processo
- [ ] AC2: EADDRINUSE no wss é silenciado (já tratado pelo `server.on('error')`)
- [ ] AC3: Outros erros de WebSocket são logados no console
- [ ] AC4: Servidor sobe normalmente na próxima porta disponível

## Tasks Técnicas

- [ ] Task 1: Adicionar `wss.on('error', handler)` após criação do WebSocketServer
- [ ] Task 2: Handler silencia EADDRINUSE e loga demais erros
- [ ] Task 3: Aplicar fix em `mission-control/server.js` (repo) e em `teste-mc` (instalação de teste)

## Branch

`fix/STORY-002-wss-error-handler`

## Arquivos Envolvidos

- `mission-control/server.js`
- `C:\Users\elidy\teste-mc\teste-missioncontrol\mission-control\server.js`

## Dependências

- STORY-001 (Done) — fallback de porta já implementado, este fix completa a correção

## Riscos

- Nenhum — change isolado, não afeta lógica de negócio
