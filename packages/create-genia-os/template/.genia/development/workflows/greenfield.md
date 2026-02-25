# Workflow: Greenfield

> Para projetos que começam do zero. Constrói a fundação certa desde o primeiro dia.
> Ordem: @analyst → @pm → @architect → @devops → @sm + @po → SDC

---

## Visão Geral

O workflow Greenfield é usado quando o projeto não tem código existente, repositório configurado ou infraestrutura em funcionamento. Ele garante que a fundação técnica e de processo seja construída corretamente antes que qualquer funcionalidade seja desenvolvida.

**Quando usar:** Projeto novo, sem código legado, sem infraestrutura existente
**Duração típica:** 1-2 semanas para a fundação completa
**Pré-requisito:** Aprovação formal do projeto por @pm

---

## Fase 1 — Discovery e Briefing (@analyst)

**Responsável:** Ana (@analyst)
**Output:** `docs/[projeto]/BRIEFING.md`

### O que acontece:
1. @analyst conduz sessões de discovery com todos os stakeholders relevantes
2. Mapeia o problema de negócio, objetivos e métricas de sucesso
3. Define personas de usuário com base em pesquisa
4. Identifica todas as integrações necessárias (APIs, sistemas legados)
5. Mapeia restrições regulatórias, de compliance ou tecnologia obrigatória
6. Documenta riscos de negócio identificados

### Entregáveis:
- `docs/[projeto]/BRIEFING.md` validado com stakeholders
- Lista de personas definidas
- Mapa de integrações necessárias
- Riscos de negócio documentados

---

## Fase 2 — Spec Pipeline Completo

**Workflow:** Executa o [Spec Pipeline](./spec-pipeline.md) completo

@analyst → @pm → @architect → @qa (critique) → @po

Ao final desta fase:
- `docs/[projeto]/BRIEFING.md` — completo
- `docs/[projeto]/PRD.md` — aprovado
- `docs/[projeto]/SPEC-TECNICO.md` — aprovado
- ADRs iniciais registrados

---

## Fase 3 — Decisões Arquiteturais Finais (@architect)

**Responsável:** Arqui (@architect)
**Output:** ADRs de fundação + plano de estrutura do repositório

### O que acontece:
1. @architect define a estrutura completa de pastas do projeto
2. Configura o `tsconfig.json` (imports absolutos `@/`)
3. Define configurações de linting (ESLint, Prettier)
4. Especifica as ferramentas de teste e configurações
5. Define a estratégia de gerenciamento de estado
6. Documenta padrões de nomenclatura e convenções
7. Registra ADRs para cada decisão relevante

### Entregáveis:
- Estrutura de pastas documentada
- Configurações de ferramentas especificadas
- Padrões de código documentados
- ADRs de fundação registrados

---

## Fase 4 — Setup da Fundação (@devops)

**Responsável:** Gate (@devops)
**Output:** Repositório configurado, CI/CD ativo, ambientes criados

### O que acontece:
1. @devops cria/configura o repositório no GitHub
2. Configura branch protection rules para `main`
3. Configura o pipeline CI/CD:
   - GitHub Actions ou equivalente
   - Stages: lint → test → build → deploy-staging
4. Cria os ambientes:
   - `development` (local)
   - `staging` (homologação)
   - `production` (produção)
5. Configura secrets e variáveis de ambiente
6. Configura MCP tools necessárias (@architect define quais)
7. Inicializa o projeto com o boilerplate aprovado pelo @architect

### Checklist de setup:
- [ ] Repositório criado com README inicial
- [ ] `.gitignore` configurado
- [ ] Branch protection em `main` ativado
- [ ] CI/CD pipeline configurado e testado
- [ ] Ambientes de staging e production configurados
- [ ] Secrets configurados (sem exposição em código)
- [ ] `tsconfig.json` com paths absolutos (`@/`)
- [ ] ESLint + Prettier configurados
- [ ] Framework de testes configurado
- [ ] Build inicial funcionando
- [ ] Deploy de staging funcionando

---

## Fase 5 — Épicos e Stories do Sprint 1 (@sm + @po)

**Responsáveis:** Sami (@sm) + Pax (@po)
**Output:** Backlog inicial priorizado com stories do Sprint 1 validadas

### O que acontece:
1. @sm e @po fazem breakdown dos Épicos do PRD em stories
2. @sm cria as stories do Sprint 1 (stories de setup/fundação primeiro)
3. @po valida cada story com o checklist 10-point
4. Backlog priorizado e Sprint 1 definido
5. @sm conduz Sprint Planning com @dev

### Ordem recomendada de stories para o primeiro sprint:
1. Story de configuração de autenticação/autorização (se necessário)
2. Story de estrutura de layout base (se front-end)
3. Story de conexão com banco de dados (se back-end)
4. Primeira funcionalidade de valor de negócio

---

## Fase 6 — Desenvolvimento (SDC por Story)

**Workflow:** Executa o [Story Development Cycle](./story-development-cycle.md) para cada story

Para cada story do Sprint 1:
```
@sm (Draft) → @po (Ready) → @dev (Develop) → @qa (QA) → @reviewer (Review) → @devops (PR) → @po (Done)
```

---

## Marcos do Greenfield

| Marco | Agente | Entregável |
|-------|--------|-----------|
| M1 | @analyst | BRIEFING.md validado |
| M2 | @pm | PRD.md aprovado |
| M3 | @architect | SPEC-TECNICO.md + ADRs |
| M4 | @devops | Infra funcionando (CI verde em staging) |
| M5 | @sm + @po | Sprint 1 planejado |
| M6 | @dev + time | Primeira story Done |
| M7 | @pm | MVP em staging para validação |

---

## Riscos Comuns em Projetos Greenfield

| Risco | Prevenção |
|-------|----------|
| Escopo mal definido | Spec Pipeline completo obrigatório |
| Setup técnico adiado | Fase 4 (Setup) acontece ANTES do desenvolvimento |
| Stories mal escritas | Validação 10-point de @po obrigatória |
| Infraestrutura ignorada | @devops tem fase própria com checklist |
| Debt técnico desde o início | @architect define padrões antes do primeiro commit |

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
