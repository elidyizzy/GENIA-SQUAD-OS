# SKILL: story-create
> Criação de User Stories no padrão GEN.IA OS
> Agente: @sm (Mouse) | Autoridade exclusiva de criação de stories

## Trigger
Ativado quando o usuário solicita criar uma story, ticket ou tarefa de desenvolvimento.

## Pré-condições obrigatórias
- PRD.md aprovado por @pm
- SPEC-TECNICO.md aprovado por @architect
- @po deve validar após criação

## Protocolo de execução

### 1. Verificar numeração
```
Listar docs/stories/ e identificar próximo número (NNN)
Formato: STORY-NNN onde NNN é zero-padded (001, 002...)
```

### 2. Coletar informações
- Qual feature/funcionalidade?
- Qual persona será beneficiada?
- Quais acceptance criteria (mínimo 3)?
- Quais tasks técnicas (mínimo 2)?
- Dependências de outras stories?
- Estimativa: P (<2h) / M (2-8h) / G (1-3d) / XG (>3d)

### 3. Criar arquivo

**Destino:** `docs/stories/STORY-NNN-slug.md`

**Template:**
```markdown
# STORY-NNN — Título da Story

**Status:** Draft
**Agente:** @sm
**Criado:** YYYY-MM-DD
**Estimativa:** [P/M/G/XG]

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

### 4. Handoff obrigatório
Após criar, fazer handoff para @po validar:
```
[@sm → @po]
📋 Story STORY-NNN criada e pronta para validação.
📁 docs/stories/STORY-NNN-slug.md
⚠️  Pendências: Validação com checklist de 10 pontos.
```

## Checklist de qualidade (@po valida)
- [ ] Título claro e acionável (verbo + objeto)
- [ ] Formato "Como [persona] quero [ação] para [benefício]"
- [ ] Mínimo 3 acceptance criteria
- [ ] Mínimo 2 tasks técnicas
- [ ] Dependências mapeadas
- [ ] Estimativa definida
- [ ] Branch name definido
- [ ] Arquivos envolvidos listados
- [ ] Testes identificados
- [ ] Riscos documentados

**< 8 pontos = REJEITADA pelo @po**

## Restrições
- Apenas @sm cria stories (Artigo II da Constituição)
- Nenhum código antes da story estar em status **Ready**
- Stories vivem em `docs/stories/` — nunca em outro local
