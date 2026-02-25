# Workflow: Spec Pipeline

> Transforma requisitos brutos em especificações técnicas executáveis.
> Ordem de execução: @analyst → @pm → @architect → @qa → @po

---

## Visão Geral

O Spec Pipeline é o processo obrigatório que antecede qualquer desenvolvimento. Ele garante que o time nunca implementa com base em requisitos vagos, PRDs incompletos ou especificações técnicas ausentes. Projetos que pulam este pipeline invariavelmente sofrem com retrabalho, scope creep e dívida técnica.

**Duração estimada:** 2-5 dias úteis (dependendo da complexidade)
**Ativador:** `@analyst iniciar spec-pipeline [nome-do-projeto]`

---

## Fase 1 — Briefing (@analyst)

**Responsável:** Ana (@analyst)
**Input:** Requisitos brutos do cliente/stakeholder (pode ser uma conversa, email, documento informal)
**Output:** `docs/[projeto]/BRIEFING.md`

### O que acontece:
1. @analyst conduz sessão de discovery com stakeholders
2. Coleta requisitos, regras de negócio, restrições e objetivos
3. Identifica personas de usuário
4. Documenta o não-escopo explicitamente
5. Mapeia integrações necessárias
6. Identifica riscos de negócio

### Critérios de saída:
- [ ] BRIEFING.md criado e completo
- [ ] Todas as ambiguidades identificadas e resolvidas
- [ ] Requisitos validados com pelo menos um stakeholder
- [ ] Não-escopo documentado
- [ ] Riscos de negócio identificados

**→ Passa para @pm**

---

## Fase 2 — PRD (@pm)

**Responsável:** Marina (@pm)
**Input:** `docs/[projeto]/BRIEFING.md`
**Output:** `docs/[projeto]/PRD.md`

### O que acontece:
1. @pm revisa o briefing e levanta dúvidas com @analyst
2. Define visão de produto e proposta de valor
3. Organiza funcionalidades em Épicos
4. Prioriza usando framework MoSCoW
5. Define métricas de sucesso do produto
6. Documenta roadmap e milestones

### Critérios de saída:
- [ ] PRD.md criado com todos os Épicos
- [ ] Priorização MoSCoW aplicada
- [ ] Métricas de sucesso definidas
- [ ] Não-escopo atualizado
- [ ] Stakeholders consultados

**→ Passa para @architect**

---

## Fase 3 — Avaliação Técnica (@architect)

**Responsável:** Arqui (@architect)
**Input:** `docs/[projeto]/PRD.md`
**Output:** Avaliação formal com riscos, viabilidade e recomendações de stack

### O que acontece:
1. @architect lê o PRD e identifica implicações técnicas
2. Avalia viabilidade de cada épico
3. Identifica riscos técnicos e dependências
4. Propõe stack tecnológica inicial
5. Sinaliza itens que precisam de mais esclarecimento
6. Pode exercer veto técnico sobre funcionalidades inviáveis

### Critérios de saída:
- [ ] Avaliação de viabilidade documentada
- [ ] Riscos técnicos mapeados
- [ ] Stack proposta com justificativas
- [ ] Vetos (se houver) formalizados com alternativas
- [ ] @pm alinhado sobre qualquer mudança de escopo

**→ Passa para criação do SPEC-TECNICO**

---

## Fase 4 — Especificação Técnica (@architect)

**Responsável:** Arqui (@architect)
**Input:** `docs/[projeto]/PRD.md` + avaliação técnica
**Output:** `docs/[projeto]/SPEC-TECNICO.md` + ADRs iniciais

### O que acontece:
1. @architect cria o SPEC-TECNICO.md completo
2. Define arquitetura de alto nível
3. Documenta modelagem de dados
4. Especifica APIs e contratos de integração
5. Define estratégia de testes
6. Registra decisões arquiteturais como ADRs
7. Define padrões de código e estrutura de pastas

### Critérios de saída:
- [ ] SPEC-TECNICO.md completo
- [ ] Arquitetura documentada com diagrama
- [ ] Modelagem de dados definida
- [ ] APIs e integrações especificadas
- [ ] Estratégia de testes definida
- [ ] ADRs iniciais registrados

**→ Passa para @qa**

---

## Fase 5 — Revisão Crítica (@qa)

**Responsável:** Quinn (@qa)
**Input:** `docs/[projeto]/PRD.md` + `docs/[projeto]/SPEC-TECNICO.md`
**Output:** Relatório crítico de revisão

### O que acontece:
1. @qa lê o PRD e o SPEC-TECNICO em busca de inconsistências
2. Identifica requisitos não-testáveis
3. Verifica se os acceptance criteria futuros serão verificáveis
4. Questiona pontos de falha não cobertos
5. Propõe estratégia de testes de alto nível

### Critérios de saída:
- [ ] Inconsistências entre PRD e SPEC-TECNICO identificadas
- [ ] Requisitos não-testáveis sinalizado
- [ ] Estratégia de testes de alto nível documentada
- [ ] @architect respondeu a todos os pontos críticos

**→ Passa para @po**

---

## Fase 6 — Aprovação Final (@po)

**Responsável:** Pax (@po)
**Input:** PRD.md + SPEC-TECNICO.md revisados
**Output:** Aprovação formal para início do desenvolvimento

### O que acontece:
1. @po revisa o backlog de épicos e funcionalidades
2. Confirma que é possível criar stories claras para cada item
3. Alinha priorização com @pm
4. Emite aprovação formal para start do desenvolvimento
5. Solicita @sm para iniciar criação de stories do primeiro épico

### Critérios de saída:
- [ ] PRD.md aprovado por @po e @pm
- [ ] SPEC-TECNICO.md aprovado por @architect
- [ ] Zero ambiguidades pendentes
- [ ] @sm acionado para criar stories do Sprint 1

---

## Critérios Globais de Saída do Spec Pipeline

Para que o Spec Pipeline seja considerado concluído:

- [ ] `docs/[projeto]/BRIEFING.md` — completo e validado
- [ ] `docs/[projeto]/PRD.md` — aprovado por @pm e @po
- [ ] `docs/[projeto]/SPEC-TECNICO.md` — aprovado por @architect
- [ ] ADRs iniciais registrados em `docs/adr/`
- [ ] Zero ambiguidades de negócio pendentes
- [ ] Zero riscos técnicos não-mitigados documentados
- [ ] Stack tecnológica definida e aprovada
- [ ] Time alinhado sobre o que será construído

---

## Como Ativar

```
@analyst iniciar spec-pipeline [nome-do-projeto]
```

Ou retomar de uma fase específica:
```
@pm criar-prd a partir do briefing em docs/[projeto]/BRIEFING.md
@architect criar spec-técnico a partir do PRD em docs/[projeto]/PRD.md
```

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
