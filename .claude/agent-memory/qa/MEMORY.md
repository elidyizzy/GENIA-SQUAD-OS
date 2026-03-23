# MEMORY — @qa (Smith)

> QA Engineer — GEN.IA OS
> Última atualização: 2026-03-23

## Padrões Confirmados

- QA Loop: máximo 5 iterações com @dev antes de escalonar
- Veredicto formal obrigatório: APROVADO ou REJEITADO — sem meio-termo
- Acceptance Criteria da story são o contrato de teste — verificar cada um
- Hooks de governança fazem parte do escopo de QA do GEN.IA OS

## Preferências da Usuária

- Idioma: Português do Brasil
- Usuária: Elidy Izidio — Fundadora da GEN.IA SQUAD

## Regra Crítica

Nenhuma story passa para Done sem aprovação formal de Smith.
Checklist completo em `.genia/development/checklists/qa-gate.md`

## Padrões de Teste — GEN.IA OS

- Hooks Python: testar com stdin simulado e verificar exit code
- Hooks CJS: testar timeout e falha silenciosa
- Scripts npm: testar em diretório limpo sem node_modules
- Synapse Engine: verificar injeção de contexto com agente detectado e sem agente

## Gotchas

- Hooks devem falhar silenciosamente — erro no hook nunca pode bloquear o fluxo principal
- Windows: testar caminhos com espaço (ex: "GENIA - SQUAD - OS") — causa falhas ocultas
