# Task: Criar PRD

> Tarefa executada por @pm após receber o BRIEFING.md de @analyst.
> Output: `docs/[projeto]/PRD.md`

---

## Objetivo

Transformar o briefing de negócios em um Product Requirements Document (PRD) completo, priorizado e aprovado por stakeholders. O PRD é o documento de referência que guia todo o desenvolvimento — ele deve ser suficientemente claro para que qualquer agente entenda o que está sendo construído e por quê.

---

## Pré-requisitos

Antes de iniciar, confirme:

- [ ] `docs/[projeto]/BRIEFING.md` existe e está completo
- [ ] @analyst confirmou que o briefing foi validado com stakeholders
- [ ] Todas as ambiguidades do briefing foram resolvidas
- [ ] @pm tem acesso a qualquer material adicional do cliente

---

## Passos de Execução

### Passo 1 — Revisão do Briefing
1. Leia o BRIEFING.md completamente
2. Identifique e anote quaisquer pontos que precisam de esclarecimento
3. Se necessário, solicite esclarecimento a @analyst antes de prosseguir
4. Nunca assuma — dúvidas são resolvidas antes de escrever o PRD

### Passo 2 — Definição da Visão de Produto
1. Articule o problema central que o produto resolve (em 1-2 parágrafos)
2. Defina a proposta de valor única (o que diferencia este produto)
3. Descreva o estado futuro desejado: como fica o mundo com este produto?
4. Identifique as restrições não-negociáveis (tecnologia, prazo, regulatório)

### Passo 3 — Definição de Personas
1. Liste as personas identificadas no briefing
2. Para cada persona, defina:
   - Nome e perfil
   - Objetivos principais ao usar o sistema
   - Dores e frustrações atuais
   - Nível de expertise técnica
3. Priorize as personas (primária, secundária)

### Passo 4 — Estruturação em Épicos
1. Agrupe as funcionalidades em Épicos coesos:
   - Cada épico é um conjunto de funcionalidades relacionadas
   - Épicos devem ser independentes entre si quando possível
   - Épicos têm uma "promessa de valor" clara
2. Nomeie os épicos com IDs: E-01, E-02, E-03...
3. Escreva uma frase de valor para cada épico

### Passo 5 — Priorização MoSCoW
Para cada funcionalidade/épico, aplique:
- **Must Have (M):** crítico para o produto funcionar. Sem isso, não há produto
- **Should Have (S):** importante mas há workaround possível
- **Could Have (C):** desejável se houver tempo e budget
- **Won't Have (W):** explicitamente fora do escopo desta versão

### Passo 6 — Definição de Métricas de Sucesso
1. Defina 3-5 métricas de produto que indicam sucesso
2. Para cada métrica:
   - Nome claro
   - Como é medida
   - Baseline atual (se disponível)
   - Meta após lançamento
3. Evite métricas de vaidade — prefira métricas de comportamento do usuário

### Passo 7 — Validação com @architect
1. Compartilhe o PRD rascunho com @architect
2. Aguarde avaliação de viabilidade técnica
3. Incorpore feedback técnico (ajustes de escopo, riscos identificados)
4. Se @architect vetar algum item, documente a decisão

### Passo 8 — Aprovação com @po
1. Compartilhe o PRD atualizado com @po
2. @po valida que é possível criar stories claras para cada item
3. Incorpore ajustes de @po
4. Obtenha aprovação formal de @po

### Passo 9 — Publicação
1. Salve o documento final em `docs/[projeto]/PRD.md`
2. Versione o documento (v1.0)
3. Notifique o time sobre a disponibilidade do PRD
4. Acione @sm para iniciar criação de stories

---

## Critérios de Saída

O PRD está pronto quando:

- [ ] Todos os épicos estão definidos com proposta de valor
- [ ] Priorização MoSCoW aplicada a todas as funcionalidades
- [ ] Personas definidas e priorizadas
- [ ] Métricas de sucesso definidas (mínimo 3)
- [ ] Não-escopo documentado explicitamente
- [ ] @architect validou viabilidade técnica
- [ ] @po aprovou formalmente
- [ ] Documento salvo em `docs/[projeto]/PRD.md`

---

## Output — Estrutura do PRD.md

```markdown
# PRD — [Nome do Produto]
Versão: 1.0 | PM: Marina (@pm) | Data: YYYY-MM-DD
Status: Rascunho | Em Revisão | Aprovado

## 1. Visão e Proposta de Valor
### Problema Central
### Proposta de Valor Única
### Estado Futuro Desejado

## 2. Personas
### Persona Primária: [Nome]
### Persona Secundária: [Nome]

## 3. Objetivos de Produto
| Objetivo | Métrica | Baseline | Meta |
|---------|--------|---------|------|

## 4. Épicos e Funcionalidades

### E-01 — [Nome do Épico]
**Promessa de valor:** [Uma frase]
**Prioridade:** Must Have

#### Funcionalidades
- [Feature 1] — Must Have
- [Feature 2] — Should Have
- [Feature 3] — Could Have

### E-02 — [Nome do Épico]
...

## 5. Não-Escopo (Explícito)
O que NÃO será construído nesta versão:
- [Item 1]
- [Item 2]

## 6. Restrições
- Prazo: [data]
- Budget: [informação se disponível]
- Tecnologia obrigatória: [se houver]
- Regulatório: [compliance, LGPD, etc]

## 7. Roadmap e Milestones
| Milestone | O que inclui | Data estimada |
|----------|------------|--------------|

## 8. Riscos de Produto
| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|--------|----------|

## 9. Glossário
[Termos de negócio específicos do domínio]

## 10. Histórico de Versões
| Versão | Data | Autor | Mudança |
|--------|------|-------|--------|
```

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
