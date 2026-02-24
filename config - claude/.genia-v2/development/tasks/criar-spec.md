# Task: Criar SPEC-TECNICO

## Metadata
- **ID**: task:criar-spec
- **Agente**: @architect
- **Fase**: Planning
- **Skills**: /doc-coauthoring

## Descricao
Criar documento SPEC-TECNICO com arquitetura e detalhes de implementacao.

## Inputs
- PRD.md aprovado
- Constraints de infraestrutura
- Stack tecnologica

## Outputs
- docs/[projeto]/SPEC-TECNICO.md

## Steps
1. Analisar PRD
2. Definir arquitetura (diagrama)
3. Escolher tecnologias
4. Mapear APIs consumidas
5. Mapear APIs expostas (se houver)
6. Definir modelos de dados
7. Definir constantes
8. Documentar fluxo de execucao
9. Listar variaveis de ambiente
10. Definir tratamento de erros
11. Documentar comandos CLI

## Template
```markdown
# SPEC-TECNICO - [Nome do Projeto]

## 1. Arquitetura
[diagrama ASCII ou Mermaid]

## 2. Stack
- Linguagem: [...]
- Framework: [...]
- Database: [...]

## 3. APIs Consumidas
### API X
- Endpoint: [...]
- Auth: [...]
- Request/Response: [...]

## 4. Modelos de Dados
### Tabela X
| Campo | Tipo | Descricao |
|-------|------|-----------|

## 5. Fluxo de Execucao
1. [passo 1]
2. [passo 2]

## 6. Variaveis de Ambiente
| Variavel | Descricao | Obrigatoria |
|----------|-----------|-------------|

## 7. Tratamento de Erros
| Erro | Acao |
|------|------|

## 8. Comandos CLI
[comandos para executar]
```

## Validacao
- [ ] Arquitetura diagramada
- [ ] APIs documentadas
- [ ] Modelos definidos
- [ ] Aprovado por @architect
