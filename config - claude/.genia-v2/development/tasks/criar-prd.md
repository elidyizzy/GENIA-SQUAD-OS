# Task: Criar PRD

## Metadata
- **ID**: task:criar-prd
- **Agente**: @pm
- **Fase**: Planning
- **Skills**: /doc-coauthoring

## Descricao
Criar documento PRD (Product Requirements Document) completo para um projeto.

## Inputs
- Briefing estruturado (do @analyst)
- Informacoes do cliente
- Constraints de negocio

## Outputs
- docs/[projeto]/PRD.md

## Steps
1. Analisar briefing estruturado
2. Identificar objetivo do produto
3. Mapear dores do cliente (tabela)
4. Listar requisitos funcionais (RF01, RF02...)
5. Listar requisitos nao-funcionais
6. Definir metricas de sucesso
7. Identificar dependencias
8. Criar roadmap
9. Definir aprovadores

## Template
```markdown
# PRD - [Nome do Projeto]

## 1. Visao Geral
[descricao]

## 2. Objetivo
[objetivo SMART]

## 3. Problema a Resolver
| Dor | Impacto | Prioridade |
|-----|---------|------------|

## 4. Requisitos Funcionais
- RF01: [descricao]
- RF02: [descricao]

## 5. Requisitos Nao-Funcionais
- RNF01: [descricao]

## 6. Metricas de Sucesso
[KPIs]

## 7. Dependencias
[lista]

## 8. Roadmap
[fases/entregas]

## 9. Aprovacoes
- [ ] Stakeholder
- [ ] @architect
```

## Validacao
- [ ] Todos os campos preenchidos
- [ ] Requisitos SMART
- [ ] Metricas mensuraveis
- [ ] Aprovado pelo stakeholder
