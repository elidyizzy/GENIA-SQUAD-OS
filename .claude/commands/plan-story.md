# /plan-story [NNN]

Converte uma story (STORY-NNN) em um plano de execução com XML tasks atômicas.
Cria `.planning/stories/STORY-NNN-PLAN.md` no projeto.

## Inspirado em

GSD (get-shit-done) — formato XML tasks com action/verify/done.

## Execução

1. Identificar o projeto e ler o STATE.md

2. Ler a story solicitada em `docs/stories/STORY-NNN-*.md`

3. Ler o SPEC-TECNICO.md para contexto técnico

4. Decompor a story em tasks atômicas seguindo o formato:
   - Cada task = 1 arquivo ou 1 operação clara
   - `action` deve ter detalhes suficientes para não re-derivar na execução
   - `verify` deve ser um comando executável ou critério objetivo
   - `done` deve ser binário (passou / não passou)

5. Criar `.planning/stories/STORY-NNN-PLAN.md`:

```xml
# PLAN — STORY-NNN: [Título]

**Criado:** YYYY-MM-DD
**Agente:** @dev
**Story:** docs/stories/STORY-NNN-*.md

<tasks>

  <task type="auto">
    <name>[Nome da task 1]</name>
    <files>src/[path]/[arquivo]</files>
    <action>[O que fazer, com contexto suficiente]</action>
    <verify>[Comando ou critério de verificação]</verify>
    <done>[Critério binário de sucesso]</done>
  </task>

  <task type="auto">
    <name>[Nome da task 2]</name>
    <files>src/[path]/[arquivo]</files>
    <action>[O que fazer]</action>
    <verify>[Como verificar]</verify>
    <done>[Critério de sucesso]</done>
  </task>

  <task type="manual">
    <name>[Task que requer decisão humana]</name>
    <files>[arquivo]</files>
    <action>[O que precisa ser feito manualmente]</action>
    <verify>[Como Elidy valida]</verify>
    <done>[Critério de aprovação]</done>
  </task>

</tasks>
```

6. Adicionar referência ao PLAN no STATE.md (campo de story InProgress)

7. Confirmar: "Plano criado em .planning/stories/STORY-NNN-PLAN.md. Pronto para execução."

## Tipos de task

- `type="auto"` — @dev executa sem interação humana
- `type="manual"` — requer decisão ou ação de Elidy
- `type="review"` — requer @qa ou @reviewer
