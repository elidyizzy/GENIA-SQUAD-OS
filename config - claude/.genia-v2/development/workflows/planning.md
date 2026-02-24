# Workflow: Planning

## Objetivo
Transformar briefing em documentacao completa pronta para desenvolvimento.

## Fluxo

```
ENTRADA: Briefing do cliente
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 1: COLETA (@analyst)                                  │
│  ─────────────────────────                                  │
│  1. Receber briefing                                        │
│  2. Identificar dores e necessidades                        │
│  3. Listar requisitos funcionais                            │
│  4. Listar requisitos nao-funcionais                        │
│  5. Documentar duvidas                                      │
│  6. Validar entendimento                                    │
│                                                             │
│  OUTPUT: briefing-estruturado.md                            │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 2: PRODUTO (@pm)                                      │
│  ─────────────────────                                      │
│  1. Analisar briefing estruturado                           │
│  2. Definir escopo e MVP                                    │
│  3. Priorizar requisitos (MoSCoW)                           │
│  4. Criar PRD completo                                      │
│  5. Definir metricas de sucesso                             │
│  6. Criar stories                                           │
│                                                             │
│  OUTPUT: PRD.md, stories/                                   │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 3: ARQUITETURA (@architect)                           │
│  ────────────────────────────────                           │
│  1. Analisar PRD                                            │
│  2. Avaliar viabilidade tecnica                             │
│  3. Definir arquitetura                                     │
│  4. Escolher tecnologias                                    │
│  5. Criar diagramas                                         │
│  6. Documentar SPEC-TECNICO                                 │
│                                                             │
│  OUTPUT: SPEC-TECNICO.md                                    │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
SAIDA: Documentacao completa (PRD + SPEC + Stories)
```

## Criterios de Entrada
- [ ] Briefing recebido do cliente
- [ ] Stakeholder disponivel para tirar duvidas

## Criterios de Saida (Quality Gate)
- [ ] PRD.md completo e aprovado
- [ ] SPEC-TECNICO.md completo e aprovado
- [ ] Stories criadas e estimadas
- [ ] Nenhuma duvida pendente
- [ ] Aprovacao formal do cliente

## Comandos
```bash
# Iniciar workflow de planning
@workflow planning [nome-projeto]

# Verificar status
@workflow status planning

# Aprovar fase
@workflow aprovar [fase]
```

## Timeline Tipico
| Fase | Duracao | Responsavel |
|------|---------|-------------|
| Coleta | 1-2h | @analyst |
| Produto | 2-4h | @pm |
| Arquitetura | 2-4h | @architect |
| **Total** | **5-10h** | - |
