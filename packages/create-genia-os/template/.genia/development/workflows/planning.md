# Workflow: Planning

> Fase de planejamento de produto e sprint. Transforma visão em plano executável.
> Ordem: @analyst → @pm → @architect → @po → @sm

---

## Visão Geral

O workflow Planning engloba todas as atividades de planejamento que antecedem o desenvolvimento. Ele pode ser executado no início de um projeto (em conjunto com o Spec Pipeline) ou de forma recorrente para planejamento de novos épicos ou sprints.

**Quando usar:**
- Início de projeto (primeiro planejamento)
- Planejamento de novo épico ou ciclo de produto
- Sprint Planning recorrente
- Revisão de roadmap

**Duração típica:** 1-3 dias por ciclo de planejamento

---

## Fase 1 — Alinhamento de Contexto (@analyst)

**Responsável:** Ana (@analyst)
**Output:** Contexto atualizado para planejamento

### O que acontece:
1. @analyst garante que o briefing está atualizado com novos requisitos ou mudanças de contexto
2. Pesquisa mudanças de mercado ou regulatórias relevantes
3. Coleta feedback de usuários do ciclo anterior
4. Documenta novos requisitos identificados
5. Passa contexto atualizado para @pm

### Não é necessário quando:
- O planejamento é para um sprint dentro de um épico já definido
- O briefing do projeto foi feito recentemente e não houve mudanças

---

## Fase 2 — Definição de Escopo e PRD (@pm)

**Responsável:** Marina (@pm)
**Output:** Escopo do ciclo definido, PRD atualizado

### O que acontece:
1. @pm revisa o roadmap atual e define foco do próximo ciclo
2. Seleciona épicos e features para o período
3. Atualiza o PRD com novos itens se necessário
4. Define objetivos e métricas do ciclo
5. Alinha com stakeholders sobre prioridades
6. Comunica mudanças de escopo para o time

### Entregáveis:
- Escopo do ciclo documentado
- PRD.md atualizado (se houver novos épicos)
- Objetivos e métricas do ciclo definidos

---

## Fase 3 — Revisão Técnica e Capacidade (@architect)

**Responsável:** Arqui (@architect)
**Output:** Avaliação de viabilidade técnica + estimativas de complexidade

### O que acontece:
1. @architect revisa o escopo proposto por @pm
2. Avalia viabilidade técnica de cada item
3. Identifica riscos técnicos para o período
4. Propõe soluções para itens complexos
5. Estima complexidade técnica dos épicos
6. Pode exercer veto técnico com alternativas

### Importante:
Planning não é o momento de definir a solução completa — é o momento de confirmar que é viável e entender a escala do trabalho. A especificação detalhada acontece no Spec Pipeline.

---

## Fase 4 — Refinamento e Priorização (@po)

**Responsável:** Pax (@po)
**Output:** Backlog priorizado para o ciclo

### O que acontece:
1. @po revisa o backlog atual com base no escopo definido por @pm
2. Aplica priorização com base em:
   - Valor de negócio (impacto nos objetivos do ciclo)
   - Complexidade técnica (estimativas de @architect)
   - Dependências entre stories
   - Risco de negócio (o que acontece se não for entregue?)
3. Define o que entra no Sprint 1 do ciclo
4. Identifica stories que precisam de mais refinamento antes de entrar no sprint
5. Documenta backlog priorizado

### Ferramentas de priorização:
- **MoSCoW:** Must/Should/Could/Won't
- **RICE:** Reach × Impact × Confidence / Effort
- **Value/Effort:** quadrante simples de priorização

---

## Fase 5 — Sprint Planning (@sm)

**Responsável:** Sami (@sm)
**Output:** Sprint planejado com stories commitadas

### O que acontece:
1. @sm facilita a sessão de sprint planning
2. Apresenta o objetivo do sprint (definido com @po e @pm)
3. Cria ou confirma stories necessárias para o sprint
4. Garante que todas as stories estão validadas por @po (status: Ready)
5. Calcula capacity do sprint baseado em velocity histórica
6. Time commita com o volume de stories que cabe na capacity
7. Define critérios de sucesso do sprint

### Output do Sprint Planning:
```markdown
# Sprint XX — Planning

## Objetivo do Sprint
[Uma frase clara do que será entregue ao final do sprint]

## Stories Comprometidas
| Story | Título | Estimativa | Assignee |
|-------|--------|-----------|----------|
| STORY-001 | ... | M | @dev |
| STORY-002 | ... | P | @dev |

## Capacity
Velocity histórica: XX pts | Capacity este sprint: XX pts | Total commitado: XX pts

## Critérios de Sucesso do Sprint
- [ ] [Critério mensurável 1]
- [ ] [Critério mensurável 2]

## Riscos Identificados
- [Risco com plano de mitigação]
```

---

## Cadência Recomendada

| Cerimônia | Frequência | Duração | Facilitador |
|-----------|-----------|---------|------------|
| Sprint Planning | A cada sprint | 2-4 horas | @sm |
| Sprint Review | Fim de sprint | 1-2 horas | @pm + @po |
| Retrospectiva | Fim de sprint | 1 hora | @sm |
| Backlog Refinement | Meio do sprint | 1 hora | @po + @sm |
| Revisão de Roadmap | Mensal | 2 horas | @pm + @po |

---

## Critérios de Saída do Planning

O planning está completo quando:

- [ ] Objetivo do sprint definido e aprovado por @pm + @po
- [ ] Stories do sprint com status Ready (validadas por @po)
- [ ] Capacity calculada e respeitada
- [ ] Riscos do sprint documentados
- [ ] @dev tem clareza sobre o que fazer no Sprint 1
- [ ] @devops está alinhado sobre necessidades de infraestrutura
- [ ] @architect foi consultado sobre pontos de complexidade alta

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
