# Workflow: Story Development Cycle (SDC)

> Ciclo completo de desenvolvimento de uma story, da criação ao merge.
> Ordem: @sm → @po → @dev → @qa → @reviewer → @devops

---

## Visão Geral

O Story Development Cycle (SDC) é o coração do GEN.IA OS. Cada story percorre um ciclo rigoroso de criação, validação, desenvolvimento, revisão e entrega. Nenhuma etapa pode ser pulada. O SDC garante rastreabilidade completa de cada funcionalidade entregue.

**Duração típica:** 1-5 dias por story (dependendo do tamanho)
**Pré-requisito:** Spec Pipeline concluído (PRD.md + SPEC-TECNICO.md aprovados)

---

## Estados da Story

```
Draft → Ready → InProgress → InQA → InReview → InPR → Done
```

| Estado | Responsável | Significado |
|--------|-------------|-------------|
| Draft | @sm | Story criada, aguardando validação |
| Ready | @po | Story validada, pronta para sprint |
| InProgress | @dev | Em desenvolvimento |
| InQA | @qa | Em revisão de qualidade |
| InReview | @reviewer | Em code review |
| InPR | @devops | PR criado, aguardando merge |
| Done | @po | Story aceita e entregue |

---

## Fase 1 — Draft (@sm)

**Responsável:** Sami (@sm)
**Input:** Épico do PRD + SPEC-TECNICO para contexto técnico
**Output:** `docs/stories/STORY-XXX.md` em status Draft

### O que acontece:
1. @sm identifica próxima story a ser criada com base no backlog priorizado por @po
2. Cria o arquivo STORY-XXX.md seguindo o template padrão
3. Escreve a User Story no formato correto
4. Define mínimo 3 Acceptance Criteria mensuráveis e testáveis
5. Documenta o não-escopo explicitamente
6. Adiciona notas técnicas relevantes do SPEC-TECNICO
7. Estima esforço (P/M/G/XG)

### Critérios de saída:
- [ ] STORY-XXX.md criado com template completo
- [ ] User Story no formato "Como... quero... para..."
- [ ] Mínimo 3 ACs mensuráveis
- [ ] Não-escopo documentado
- [ ] Épico pai referenciado
- [ ] Status: Draft

**→ Passa para @po**

---

## Fase 2 — Validate (@po)

**Responsável:** Pax (@po)
**Input:** `docs/stories/STORY-XXX.md` em Draft
**Output:** Story aprovada (Ready) ou devolvida para revisão

### O que acontece:
1. @po executa checklist de validação 10-point
2. Se aprovada: altera status para Ready e define prioridade no sprint
3. Se reprovada: devolve para @sm com feedback específico e items a corrigir
4. @sm ajusta e resubmete (sem limite de tentativas nesta fase)

### Critérios de aprovação (10-point checklist):
- [ ] Formato correto: "Como [persona], quero [ação], para [benefício]"
- [ ] Persona identificada e definida no PRD
- [ ] Valor explícito e mensurável
- [ ] Mínimo 3 ACs, todos testáveis
- [ ] Independente ou dependências mapeadas
- [ ] Tamanho adequado para uma sprint
- [ ] Estimável com as informações disponíveis
- [ ] Não-escopo explícito
- [ ] Épico pai identificado
- [ ] DoD aplicável à story

**Score mínimo: 9/10**

**→ Status muda para Ready**

---

## Fase 3 — Ready (@po + @sm)

**Responsável:** @po (prioridade) + @sm (sprint)
**Status:** Ready

A story está validada e entra no sprint backlog. @sm inclui na sprint planning e atribui ao @dev. Nenhum desenvolvimento começa sem story em Ready.

---

## Fase 4 — Develop (@dev)

**Responsável:** Dev (@dev)
**Input:** `docs/stories/STORY-XXX.md` em Ready + SPEC-TECNICO.md
**Output:** Código implementado, testes escritos, commits locais

### O que acontece:
1. @dev lê completamente a story e o SPEC-TECNICO
2. Cria o branch: `git checkout -b feat/STORY-XXX-descricao`
3. Implementa o código seguindo os padrões arquiteturais
4. Escreve testes unitários (coverage >= 80%)
5. Executa lint, typecheck e testes localmente
6. Comita com mensagem formatada (nunca faz push — exclusivo de @devops)
7. Atualiza status da story para InProgress
8. Ao concluir, notifica @qa

### Critérios de saída:
- [ ] Todos os ACs implementados
- [ ] Testes unitários escritos (coverage >= 80%)
- [ ] Lint passando sem warnings
- [ ] Typecheck passando
- [ ] Commits atômicos e bem descritos
- [ ] Status: InQA

**→ Passa para @qa**

---

## Fase 5 — QA Review (@qa)

**Responsável:** Quinn (@qa)
**Input:** Branch com código implementado
**Output:** Relatório QA — APROVADO ou REPROVADO com bugs

### O que acontece:
1. @qa verifica cada Acceptance Criterion da story
2. Executa testes (unitários, integração se houver)
3. Verifica casos de borda e cenários negativos
4. Documenta bugs encontrados com severidade
5. Emite veredicto: APROVADO ou REPROVADO

**QA Loop (máximo 5 iterações):**
```
@qa revisa → REPROVADO → @dev corrige → @qa re-revisa → ...
```

Se após 5 iterações ainda reprovado: escalar para @architect + @pm

### Critérios de aprovação:
- [ ] Todos os ACs verificados e passando
- [ ] Zero bugs CRÍTICOS
- [ ] Máximo 2 bugs ALTOS (documentados para correção futura)
- [ ] Testes passando (>= 80% coverage)
- [ ] Lint sem warnings
- [ ] Status: InReview

**→ Passa para @reviewer**

---

## Fase 6 — Code Review (@reviewer)

**Responsável:** Rev (@reviewer)
**Input:** Branch aprovado pelo @qa
**Output:** LGTM (aprovado) ou mudanças solicitadas

### O que acontece:
1. @reviewer lê o diff completo da story
2. Verifica corretude, arquitetura, segurança, legibilidade
3. Emite aprovação (LGTM) ou lista de mudanças bloqueantes
4. @dev corrige mudanças bloqueantes e notifica @reviewer
5. @reviewer re-aprova

### Critérios de aprovação:
- [ ] Sem issues de segurança
- [ ] Arquitetura consistente com SPEC-TECNICO
- [ ] Imports absolutos usados
- [ ] Código legível e manutenível
- [ ] Testes de qualidade (testam comportamento, não implementação)
- [ ] Status: InPR

**→ Passa para @devops**

---

## Fase 7 — Push e PR (@devops)

**Responsável:** Gate (@devops)
**Input:** Branch aprovado por @qa e @reviewer
**Output:** PR criado no repositório remoto

### O que acontece:
1. @devops verifica checklist pré-push
2. Faz `git push -u origin feat/STORY-XXX-descricao`
3. Cria Pull Request com template completo
4. Atribui reviewers para merge
5. Monitora CI/CD pipeline
6. Faz merge após aprovação do PR e CI verde

### Critérios de saída:
- [ ] Push realizado sem erros
- [ ] PR criado com descrição completa
- [ ] CI/CD pipeline verde
- [ ] PR mergeado para main
- [ ] Status: Done

---

## Fase 8 — Done (@po)

**Responsável:** Pax (@po)
**Output:** Story marcada como Done, backlog atualizado

### O que acontece:
1. @po verifica que todos os ACs foram entregues conforme especificado
2. Aceita a story formalmente (marca como Done)
3. Atualiza o backlog
4. Informa @pm sobre o progresso do épico

---

## Diagrama do Fluxo

```
@sm cria story (Draft)
       ↓
@po valida (Ready) ←── @sm corrige ──← REPROVADO
       ↓
@dev implementa (InProgress)
       ↓
@qa revisa (InQA) ←── @dev corrige ──← REPROVADO (max 5x)
       ↓
@reviewer revisa (InReview) ←── @dev corrige ──← CHANGES
       ↓
@devops push + PR (InPR)
       ↓
@po aceita (Done)
```

---

## Regras Invioláveis do SDC

1. Nunca pular a validação de @po — story não-validada não pode ser desenvolvida
2. @dev nunca faz push — exclusivo de @devops
3. QA Loop tem máximo 5 iterações — após isso, escalar
4. Code review é obrigatório antes do push — sem exceção
5. Story só vai para Done quando @po aceitar formalmente

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
