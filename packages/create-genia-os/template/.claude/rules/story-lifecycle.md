# Ciclo de Vida de Stories — GEN.IA OS

## Estados

```
Draft → Ready → InProgress → InReview → Done
                                      ↘ Blocked
```

## Responsabilidades por Estado

| Estado | Responsável | O que acontece |
|--------|-------------|----------------|
| **Draft** | @sm | Cria story com template padrão |
| **Ready** | @po | Valida com checklist 10 pontos |
| **InProgress** | @dev | Implementa o código |
| **InReview** | @qa + @reviewer | Testa e revisa código |
| **Done** | @devops | Faz push/PR; @pm atualiza backlog |
| **Blocked** | agente atual | Documenta blocker e escalona |

## Checklist de Validação — @po (10 pontos obrigatórios)

- [ ] Título claro e acionável (verbo + objeto)
- [ ] Formato: "Como [persona] quero [ação] para [benefício]"
- [ ] Acceptance criteria definidos (mínimo 3 critérios)
- [ ] Tasks técnicas listadas (mínimo 2 tasks)
- [ ] Dependências de outras stories mapeadas
- [ ] Estimativa de esforço definida (P/M/G/XG)
- [ ] Nome da branch definido: `tipo/STORY-NNN-slug`
- [ ] Arquivos a criar/modificar listados
- [ ] Testes necessários identificados
- [ ] Riscos e pontos de atenção documentados

**Story com menos de 8 pontos = REJEITADA pelo @po**

## Localização das Stories

```
docs/stories/STORY-[NNN]-[slug].md
```

Exemplo: `docs/stories/STORY-001-autenticacao-usuario.md`

## Atualização de Status na Story

Sempre atualizar o cabeçalho quando mudar de estado:

```markdown
**Status:** InProgress
**Agente:** @dev
**Atualizado:** 2026-02-24
```

## Template de Story

```markdown
# STORY-NNN — Título da Story

**Status:** Draft
**Agente:** @sm
**Criado:** YYYY-MM-DD
**Estimativa:** M

## Descrição
Como [persona] quero [ação] para [benefício].

## Acceptance Criteria
- [ ] AC1: ...
- [ ] AC2: ...
- [ ] AC3: ...

## Tasks Técnicas
- [ ] Task 1: ...
- [ ] Task 2: ...

## Branch
`feat/STORY-NNN-slug`

## Arquivos Envolvidos
- `src/...`

## Dependências
- STORY-XXX (se houver)

## Riscos
- ...
```
