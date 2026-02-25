# Workflow: Brownfield

> Para evoluir sistemas já em produção. Primeiro entender, depois mudar.
> Ordem: @architect → @qa → @architect + @dev → @pm → @sm → SDC

---

## Visão Geral

O workflow Brownfield é usado quando o projeto já tem código em produção, usuários ativos e histórico de decisões técnicas. Diferente do Greenfield, qualquer mudança pode ter impacto direto em funcionalidades existentes. A palavra de ordem é cautela e investigação antes de ação.

**Quando usar:** Sistema existente em produção, adição de features a produto ativo, migração tecnológica gradual
**Duração da fase de discovery:** 3-7 dias (dependendo da complexidade do sistema)
**Pré-requisito:** Acesso ao repositório existente e documentação disponível

---

## Fase 1 — Discovery (@architect)

**Responsável:** Arqui (@architect)
**Output:** Mapa arquitetural do sistema atual (`docs/discovery/ARQUITETURA-ATUAL.md`)

### O que acontece:
1. @architect mergulha no código existente:
   - Lê os principais arquivos de configuração
   - Mapeia a estrutura de pastas e módulos
   - Identifica padrões (ou ausência deles) no código
2. Documenta a arquitetura atual:
   - Linguagens e frameworks em uso
   - Banco de dados e estratégia de dados
   - Integrações externas ativas
   - Sistemas de autenticação/autorização
   - Pipelines CI/CD existentes (se houver)
3. Identifica decisões arquiteturais implícitas (sem ADR documentado)
4. Mapeia pontos de acoplamento alto e riscos de mudança
5. Avalia a saúde geral do codebase

### Entregáveis:
- `docs/discovery/ARQUITETURA-ATUAL.md`
- Diagrama de componentes e fluxos principais
- Lista de tecnologias e versões em uso
- Pontos críticos de risco documentados

---

## Fase 2 — Auditoria de Qualidade (@qa)

**Responsável:** Quinn (@qa)
**Output:** `docs/discovery/AUDITORIA-QA.md`

### O que acontece:
1. @qa analisa a cobertura de testes existente (ou ausência)
2. Executa ferramentas de análise estática se disponíveis
3. Identifica:
   - Áreas sem cobertura de teste (risk zones)
   - Padrões de código inconsistentes
   - Dívida técnica acumulada
   - Bugs conhecidos não resolvidos
4. Cria mapa de risco: quais áreas têm mais chance de quebrar com mudanças?
5. Define estratégia de testes para o projeto de evolução

### Entregáveis:
- `docs/discovery/AUDITORIA-QA.md`
- Mapa de risco de mudanças por módulo
- Estratégia de testes proposta
- Lista de dívida técnica priorizada

---

## Fase 3 — Análise de Impacto (@architect + @dev)

**Responsáveis:** Arqui (@architect) + Dev (@dev)
**Input:** ARQUITETURA-ATUAL.md + AUDITORIA-QA.md + requisitos das mudanças desejadas
**Output:** `docs/discovery/ANALISE-IMPACTO.md`

### O que acontece:
1. @architect e @dev mapeiam juntos o impacto de cada mudança proposta:
   - Quais módulos serão afetados?
   - Há risco de breaking changes?
   - Quais integrações podem ser impactadas?
2. Definem estratégia de migração (big bang vs. gradual vs. strangler fig)
3. Identificam testes de regressão necessários
4. Estimam esforço de cada mudança considerando o estado atual do código
5. @architect documenta ADRs para decisões de evolução

### Entregáveis:
- `docs/discovery/ANALISE-IMPACTO.md`
- ADRs de evolução arquitetural
- Estratégia de migração definida
- Estimativas de esforço ajustadas para o contexto brownfield

---

## Fase 4 — Épico de Evolução (@pm)

**Responsável:** Marina (@pm)
**Input:** ANALISE-IMPACTO.md + requisitos do cliente
**Output:** PRD atualizado com épico de evolução + `docs/[projeto]/PRD-EVOLUCAO.md`

### O que acontece:
1. @pm revisa os impactos e ajusta escopo se necessário
2. Cria épico de evolução no backlog com base real nas estimativas
3. Define o que é refatoração necessária vs. nova funcionalidade
4. Alinha expectativas com stakeholders sobre complexidade adicional do brownfield
5. Define critérios de sucesso para a evolução

### Importante:
Em brownfield, @pm frequentemente precisa negociar prazo adicional para lidar com:
- Testes de regressão
- Compatibilidade retroativa
- Migração gradual de dados
- Rollback planejado

---

## Fase 5 — Stories com Consciência Brownfield (@sm)

**Responsável:** Sami (@sm) em colaboração com @architect
**Output:** Stories com notas técnicas específicas de compatibilidade

### O que acontece:
1. @sm cria stories considerando o contexto brownfield
2. Cada story inclui:
   - **Notas de compatibilidade:** o que não pode quebrar
   - **Testes de regressão:** cenários existentes que devem ser mantidos
   - **Plano de rollback:** como desfazer se necessário
3. Stories de brownfield tendem a ser menores que greenfield para reduzir risco

### Adições ao template padrão de story:
```markdown
## Compatibilidade Brownfield
- Funcionalidades existentes NÃO devem ser afetadas: [lista]
- Testes de regressão obrigatórios: [lista de cenários]
- Plano de rollback: [como desfazer esta mudança]
- Áreas de risco identificadas por @architect: [referência à ANALISE-IMPACTO]
```

---

## Fase 6 — Desenvolvimento com Cautela (SDC adaptado)

**Workflow:** [Story Development Cycle](./story-development-cycle.md) com adições brownfield

O SDC é executado normalmente com estas adições:

- **@dev:** sempre roda testes de regressão completos antes de declarar pronto
- **@qa:** verifica explicitamente que funcionalidades existentes não foram quebradas
- **@qa:** executa cenários de regressão além dos ACs da nova story
- **@devops:** valida staging completamente antes de qualquer deploy em produção
- **@devops:** mantém plano de rollback ativo

---

## Estratégias de Migração Disponíveis

| Estratégia | Quando usar | Risco |
|-----------|-------------|-------|
| Big Bang | Sistema pequeno, pode ter downtime | Alto |
| Gradual | Sistemas grandes, sem downtime | Médio |
| Strangler Fig | Substituição incremental de módulos | Baixo |
| Blue/Green | Alta disponibilidade necessária | Baixo (custo maior) |
| Feature Flags | Lançamento controlado | Baixíssimo |

@architect define a estratégia na Fase 3.

---

## Regras Específicas do Brownfield

1. **Nunca refatorar e adicionar feature no mesmo commit** — separar em stories distintas
2. **Testes de regressão são obrigatórios** — sem exceção, mesmo que não existissem antes
3. **Staging é espelho de produção** — qualquer divergência de ambiente deve ser resolvida antes do deploy
4. **Rollback planejado** — @devops tem plano de rollback para cada deploy significativo
5. **Comunicação com usuários** — mudanças que afetam UX devem ser comunicadas antecipadamente

---

*GEN.IA OS v1.0 — Be Data — Elidy Izidio*
