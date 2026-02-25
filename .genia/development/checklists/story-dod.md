# Checklist: Definition of Done (DoD) — Story

> Critérios obrigatórios para uma story ser considerada Done.
> Verificado por @po (negócio) + @qa (técnica) + @reviewer (código).

---

## O que é o Definition of Done?

O Definition of Done (DoD) é o conjunto de critérios acordados pelo time que define quando uma story está genuinamente pronta — não "tecnicamente funcionando", mas entregável com qualidade para o usuário final. Uma story que não atende ao DoD não é Done, independente de o código estar escrito.

---

## Checklist Completo (10 Critérios)

### Critério 1 — Acceptance Criteria Atendidos
- [ ] Todos os ACs da story foram implementados
- [ ] Todos os ACs foram verificados manualmente por @qa
- [ ] @po confirmou que o comportamento atende à intenção de negócio
- [ ] Não há ACs parcialmente implementados ou com workaround

**Responsável de verificar:** @qa + @po

---

### Critério 2 — Testes Passando
- [ ] Todos os testes unitários passam: `npm run test`
- [ ] Nenhum teste ignorado (`skip`, `xtest`, `.only`) sem justificativa documentada
- [ ] Testes de regressão de funcionalidades existentes passando (se brownfield)

**Responsável de verificar:** @qa

---

### Critério 3 — Cobertura de Testes
- [ ] Cobertura de testes >= 80% nas linhas novas/modificadas
- [ ] Verificado com: `npm run coverage`
- [ ] Linhas não cobertas têm justificativa (ex: código de fallback impossível de testar)

**Responsável de verificar:** @qa

---

### Critério 4 — Qualidade de Código (Lint + Types)
- [ ] `npm run lint` — zero erros e zero warnings
- [ ] `npm run typecheck` — zero erros TypeScript
- [ ] Sem `any` injustificado
- [ ] Imports absolutos com `@/` em todos os arquivos novos

**Responsável de verificar:** @reviewer

---

### Critério 5 — Sem Bugs Críticos
- [ ] Zero bugs de severidade CRÍTICO pendentes
- [ ] Máximo 2 bugs de severidade ALTO (documentados no backlog para sprint futuro)
- [ ] Bugs de severidade MÉDIO e BAIXO documentados no backlog

**Responsável de verificar:** @qa

---

### Critério 6 — Code Review Aprovado
- [ ] @reviewer realizou code review formal
- [ ] Todos os itens BLOQUEANTES foram corrigidos
- [ ] Aprovação (LGTM) emitida por @reviewer
- [ ] Relatório de code review disponível em `docs/reviews/`

**Responsável de verificar:** @reviewer

---

### Critério 7 — Arquitetura Respeitada
- [ ] Código segue os padrões do SPEC-TECNICO.md
- [ ] Estrutura de pastas correta
- [ ] Separação de responsabilidades respeitada
- [ ] Nenhuma decisão arquitetural tomada sem aprovação de @architect

**Responsável de verificar:** @reviewer (+ @architect se houver dúvida)

---

### Critério 8 — PR Criado por @devops
- [ ] Branch feito push para o remoto por @devops (nunca diretamente por @dev)
- [ ] Pull Request criado com template completo
- [ ] PR associado à story (referência no título ou body)
- [ ] CI/CD pipeline verde no PR
- [ ] PR mergeado para `main`

**Responsável de verificar:** @devops

---

### Critério 9 — Segurança Básica
- [ ] Sem hardcoded secrets, tokens ou URLs de ambiente
- [ ] Inputs validados e sanitizados onde necessário
- [ ] Dados sensíveis não expostos em logs
- [ ] Autenticação/autorização corretas nos endpoints protegidos

**Responsável de verificar:** @reviewer + @qa

---

### Critério 10 — Validação Final por @po
- [ ] @po revisou o entregue e confirmou que atende à User Story
- [ ] @po atualizou o status da story para `Done` no arquivo
- [ ] @po atualizou o backlog para refletir a story entregue
- [ ] Velocity do sprint atualizado

**Responsável de verificar:** @po

---

## Resumo Visual

| # | Critério | Responsável | Bloqueante |
|---|---------|------------|-----------|
| 1 | Acceptance Criteria atendidos | @qa + @po | Sim |
| 2 | Testes passando | @qa | Sim |
| 3 | Coverage >= 80% | @qa | Sim |
| 4 | Lint + Typecheck limpos | @reviewer | Sim |
| 5 | Sem bugs críticos | @qa | Sim |
| 6 | Code review aprovado | @reviewer | Sim |
| 7 | Arquitetura respeitada | @reviewer | Sim |
| 8 | PR criado e mergeado | @devops | Sim |
| 9 | Segurança básica | @reviewer + @qa | Sim |
| 10 | Validação final de @po | @po | Sim |

**Todos os 10 critérios são obrigatórios.** Uma story com 9/10 critérios não é Done.

---

## Processo de Verificação do DoD

1. @qa verifica critérios 1, 2, 3, 5, 9 (parcial)
2. @reviewer verifica critérios 4, 6, 7, 9 (parcial)
3. @devops executa critério 8
4. @po verifica critério 10 e confirma o Done

Qualquer critério não atendido bloqueia a story de ir para Done.

---

## DoD vs. Acceptance Criteria

| | DoD | Acceptance Criteria |
|-|-----|-------------------|
| **Escopo** | Toda story | Específico por story |
| **Quem define** | Time (imutável no sprint) | @sm + @po (por story) |
| **O que avalia** | Qualidade do processo de entrega | Comportamento funcional |
| **Pode variar** | Não (é padrão do time) | Sim (por story) |

---

*GEN.IA OS v1.0 — Be Data — Elidy Izidio*
