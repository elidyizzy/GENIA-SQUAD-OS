# Workflow: Development

> Fase de execução do desenvolvimento. Transforma stories validadas em código entregue.
> Ordem: @sm → @dev → @qa → @reviewer → @devops

---

## Visão Geral

O workflow Development é a fase de execução, onde stories validadas se tornam código funcional. Ele opera em paralelo com o planejamento do próximo sprint e segue rigorosamente o Story Development Cycle (SDC) para cada story.

**Quando usar:** Sprint ativo com stories em status Ready
**Pré-requisito:** Sprint planejado com stories validadas por @po
**Duração:** Contínuo durante o sprint (1-2 semanas típicas)

---

## Responsabilidades por Agente

### @sm — Facilitação e Acompanhamento
- Facilita daily stand-ups (assíncrono ou síncrono)
- Remove impedimentos que bloqueiam @dev
- Monitora velocity e saúde do sprint
- Atualiza status das stories no backlog
- Comunica riscos de prazo para @pm

### @dev — Execução
- Implementa uma story por vez (evitar WIP alto)
- Segue o SDC rigorosamente para cada story
- Comunica blockers imediatamente
- Atualiza status da story quando muda de fase
- Não começa nova story sem a anterior estar In QA

### @qa — Qualidade Contínua
- Disponível para revisão assim que @dev declara pronto
- Executa o QA Loop (máx 5 iterações)
- Não acumula stories — revisa uma por vez
- Pode revisar spec de stories futuras enquanto aguarda dev

### @reviewer — Code Review Ágil
- Revisa código assim que @qa aprova
- Objetivo: máximo 24h de tempo de review
- Não bloqueia por questões menores sem impacto real
- Aprova com confiança ou solicita mudanças bloqueantes

### @devops — Delivery Contínuo
- Mantém CI/CD pipeline funcionando
- Faz push e cria PR assim que @reviewer aprova
- Monitora ambiente de staging
- Alerta time sobre problemas de infraestrutura

---

## Fluxo Visual do Desenvolvimento

```
STORIES READY (backlog do sprint)
         │
         ▼
   @dev pega story → InProgress
         │
         ▼
   @dev conclui → notifica @qa
         │
         ▼
   @qa revisa (QA Loop máx 5x)
         │
    ┌────┴────┐
REPROVADO   APROVADO
    │           │
@dev corrige  @reviewer revisa
    │           │
    └───────┐  ┌────┴────┐
         (loop) CHANGES  LGTM
                │          │
            @dev corrige  @devops
                │          │
            @reviewer   git push + PR
            re-aprova      │
                │          ▼
                └──────→  DONE
```

---

## Daily Stand-up (Assíncrono)

Cada agente reporta diariamente:

```markdown
## Daily — YYYY-MM-DD

### @dev
- Ontem: [o que foi feito]
- Hoje: [o que será feito]
- Blocker: [impedimento ou "sem blocker"]
- Story atual: STORY-XXX (status: InProgress | InQA | etc.)

### @qa
- Ontem: [revisões concluídas]
- Hoje: [o que será revisado]
- Blocker: [impedimento ou "sem blocker"]

### @devops
- Status do pipeline: [verde | amarelo | vermelho]
- PRs pendentes: [X PRs aguardando merge]
- Alertas: [qualquer problema de infraestrutura]
```

---

## Gestão de WIP (Work In Progress)

Para garantir fluxo, o GEN.IA OS recomenda limites de WIP:

| Agente | WIP Máximo | Por quê |
|--------|-----------|---------|
| @dev | 1 story por vez | Foco garante qualidade |
| @qa | 1 story em revisão ativa | Profundidade na revisão |
| @reviewer | 2 reviews simultâneos | Viabilidade de resposta rápida |
| @devops | Sem limite | Operacional, menos cognitivo |

---

## Gestão de Blockers

Quando um blocker é identificado:

1. **@dev identifica** — declara o blocker imediatamente no daily
2. **@sm registra** — cria registro formal do blocker
3. **@sm tenta remover** — em até 2 horas na maioria dos casos
4. **Se não resolvível:**
   - Blocker técnico → @architect
   - Blocker de requisito → @po → @pm
   - Blocker de infraestrutura → @devops
5. **@sm comunica impacto** — informa @pm se o blocker ameaça o sprint

```markdown
## Blocker #XXX — [Título]
Data: YYYY-MM-DD
Story afetada: STORY-XXX
Agente bloqueado: @dev
Descrição: [o que está impedindo o progresso]
Responsável por remover: [@architect | @po | @devops]
Status: Aberto | Em Resolução | Resolvido
```

---

## Métricas de Saúde do Sprint

@sm monitora e reporta semanalmente:

| Métrica | Fórmula | Meta |
|---------|---------|------|
| Velocity | Pontos entregues / sprint | Histórico + 10% |
| Lead Time | Draft → Done (dias) | < 5 dias por story |
| Cycle Time | InProgress → Done (dias) | < 3 dias por story |
| Bug Rate | Bugs críticos em QA / story | < 1 por sprint |
| Rework Rate | Stories que voltaram de QA | < 30% |

---

## Critérios de Encerramento do Sprint

O sprint é encerrado quando:

- [ ] Todas as stories comprometidas estão em Done ou formalmente movidas para o próximo sprint
- [ ] Todas as histórias em Done têm PR mergeado
- [ ] Nenhum bug crítico pendente
- [ ] @po validou todas as stories como Done
- [ ] Sprint Review preparado por @pm
- [ ] Retrospectiva agendada por @sm

---

## Sprint Review (Fim de Sprint)

Facilitado por @pm e @po:

1. @pm apresenta o objetivo do sprint e se foi atingido
2. @dev demonstra as stories entregues
3. @po valida formalmente as stories (se não validou durante o sprint)
4. Stakeholders dão feedback sobre o entregue
5. @pm atualiza o roadmap com base no que foi entregue e no feedback

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
