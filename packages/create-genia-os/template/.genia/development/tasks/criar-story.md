# Task: Criar Story

> Tarefa executada por @sm. Somente @sm cria stories formais.
> Output: `docs/stories/STORY-XXX.md`

---

## Objetivo

Criar uma story bem definida, no formato INVEST, com acceptance criteria mensuráveis, pronta para ser validada por @po e desenvolvida por @dev. Uma story mal escrita é a causa mais comum de retrabalho e confusão durante o desenvolvimento.

---

## Pré-requisitos

Antes de iniciar, confirme:

- [ ] PRD.md aprovado existe (`docs/[projeto]/PRD.md`)
- [ ] SPEC-TECNICO.md aprovado existe (`docs/[projeto]/SPEC-TECNICO.md`)
- [ ] O épico pai da story está definido no PRD
- [ ] Há backlog room para esta story (capacity do sprint permite)
- [ ] @sm tem clareza sobre o que a story deve entregar

---

## Como Determinar o Próximo Story ID

1. Liste os arquivos em `docs/stories/`
2. Identifique o maior número existente (ex: STORY-007)
3. A próxima story será STORY-008
4. Se não há stories existentes, começar em STORY-001

---

## Passos de Execução

### Passo 1 — Contexto
1. Leia o épico pai no PRD para entender o contexto de valor
2. Leia as seções relevantes do SPEC-TECNICO para entender implicações técnicas
3. Verifique se há stories anteriores relacionadas que estabelecem contexto

### Passo 2 — Definição da User Story
1. Identifique a persona correta (do PRD)
2. Defina a ação/funcionalidade específica (o mais granular possível)
3. Defina o benefício de negócio (mensurável quando possível)
4. Escreva no formato: "Como [persona], quero [ação], para [benefício]"

**Teste de qualidade da User Story:**
- A persona é real e definida no PRD? (não "como usuário genérico")
- A ação é específica o suficiente para implementar? (não "melhorar a experiência")
- O benefício é de negócio real? (não "para ter acesso a isso")

### Passo 3 — Acceptance Criteria
1. Para cada AC, pense: "Como @qa vai verificar isso?"
2. Use o formato: "[Dado X], quando [ação Y], então [resultado Z]"
   - Ou: "[Funcionalidade] deve [comportamento mensurável]"
3. Cubra:
   - Happy path (fluxo principal de sucesso)
   - Edge cases relevantes (dados inválidos, estados vazios)
   - Cenários negativos (o que deve ser impedido)
4. Mínimo 3 ACs, máximo 8

**Teste de qualidade dos ACs:**
- @qa consegue verificar este AC sem ambiguidade?
- O AC descreve o comportamento, não a implementação?
- O AC é específico o suficiente? ("rápido" não é mensurável)

### Passo 4 — Não-Escopo
1. Liste explicitamente o que esta story NÃO inclui
2. Seja específico sobre funcionalidades adjacentes que podem causar confusão
3. Exemplo: "Esta story NÃO inclui a tela de edição — apenas criação"

### Passo 5 — Dependências
1. Identifique se esta story depende de outra estar concluída
2. Se há dependências: referenciar os IDs das stories
3. Se há bloqueadores técnicos: documentar e escalar para @architect

### Passo 6 — Notas Técnicas
1. Do SPEC-TECNICO, extraia informações relevantes para o @dev:
   - Arquivos/módulos que devem ser criados ou modificados
   - Padrões a seguir
   - APIs externas envolvidas
   - Considerações de segurança específicas
2. Não tente especificar o "como" em detalhes — isso é papel do @dev e @architect

### Passo 7 — Estimativa
1. Estime o esforço em pontos usando a escala Fibonacci simplificada:
   - **P (1-3 pts):** Story pequena, sem ambiguidade, menos de 1 dia
   - **M (5 pts):** Story média, algumas decisões, 1-2 dias
   - **G (8 pts):** Story grande, complexidade moderada, 2-3 dias
   - **XG (13 pts):** Story muito grande — considere quebrar em 2 stories
2. Se estimativa é XG ou maior: quebrar antes de validar com @po

### Passo 8 — Self-Review
Antes de enviar para @po, aplique o checklist INVEST:
- [ ] **I**ndependente: pode ser desenvolvida sem dependência não-mapeada?
- [ ] **N**egociável: os detalhes podem ser ajustados se necessário?
- [ ] **V**aliosa: tem valor claro de negócio?
- [ ] **E**stimável: conseguimos estimar o esforço?
- [ ] **S**mall (pequena): cabe em uma sprint?
- [ ] **T**estável: @qa consegue verificar todos os ACs?

### Passo 9 — Criação do Arquivo
1. Crie o arquivo em `docs/stories/STORY-XXX.md` seguindo o template
2. Defina status inicial como `Draft`
3. Envie para @po para validação

---

## Template Completo

```markdown
---
id: STORY-XXX
título: [Título descritivo em até 60 caracteres]
épico: E-XX — [Nome do Épico]
sprint: Sprint-XX
estimativa: P | M | G | XG
assignee: null
status: Draft
prioridade: CRÍTICO | ALTO | MÉDIO | BAIXO
criada_por: "@sm"
criada_em: YYYY-MM-DD
aprovada_por: null
aprovada_em: null
---

# STORY-XXX — [Título]

## User Story
Como [persona definida no PRD],
quero [ação/funcionalidade específica],
para [benefício de negócio mensurável].

## Contexto
[1-3 parágrafos de contexto para @dev entender o porquê e o entorno da story]

## Acceptance Criteria

- [ ] AC-01: Dado [contexto], quando [ação], então [resultado esperado]
- [ ] AC-02: Dado [contexto], quando [ação], então [resultado esperado]
- [ ] AC-03: Dado [contexto], quando [ação], então [resultado esperado]

## Não-Escopo (Explícito)
Esta story NÃO inclui:
- [Item 1 fora do escopo]
- [Item 2 fora do escopo]

## Dependências
- Depende de: [STORY-XXX se houver | "nenhuma"]
- Bloqueada por: ["nenhum bloqueador" | descrição]

## Notas Técnicas
[Extraídas do SPEC-TECNICO — orientações de implementação relevantes]
- Arquivos/módulos afetados: [lista]
- Padrões a seguir: [referência ao SPEC-TECNICO]
- APIs envolvidas: [se houver]

## Definition of Done
- [ ] Código implementado e funcionando localmente
- [ ] Testes unitários escritos (coverage >= 80%)
- [ ] Lint e typecheck passando sem erros
- [ ] QA aprovado por @qa (todos os ACs verificados)
- [ ] Code review aprovado por @reviewer
- [ ] PR criado por @devops
- [ ] @po confirmou que a story atende aos critérios de negócio
```

---

## Critérios de Saída

A task criar-story está concluída quando:

- [ ] Arquivo `docs/stories/STORY-XXX.md` criado com template completo
- [ ] User Story no formato correto
- [ ] Mínimo 3 ACs mensuráveis e testáveis
- [ ] Não-escopo documentado
- [ ] Estimativa definida (P/M/G/XG)
- [ ] Status: Draft
- [ ] @po acionado para validação

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
