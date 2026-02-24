# Workflow: Delivery

## Objetivo
Entregar o projeto em producao com documentacao completa.

## Fluxo

```
ENTRADA: Codigo aprovado no review
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 1: DOCUMENTACAO (@pm + @dev)                          │
│  ─────────────────────────────────                          │
│  1. Atualizar README.md                                     │
│  2. Criar CHANGELOG.md                                      │
│  3. Documentar variaveis de ambiente                        │
│  4. Criar guia de instalacao                                │
│  5. Criar COMERCIAL.md                                      │
│                                                             │
│  OUTPUT: Documentacao completa                              │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 2: DEPLOY (@dev)                                      │
│  ─────────────────────                                      │
│  1. Configurar ambiente de producao                         │
│  2. Configurar variaveis                                    │
│  3. Executar deploy                                         │
│  4. Verificar health check                                  │
│  5. Testar em producao (smoke test)                         │
│                                                             │
│  OUTPUT: Sistema em producao                                │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 3: HANDOFF (@pm)                                      │
│  ─────────────────────                                      │
│  1. Apresentar sistema ao cliente                           │
│  2. Entregar documentacao                                   │
│  3. Treinar usuarios (se necessario)                        │
│  4. Coletar feedback inicial                                │
│  5. Definir suporte pos-entrega                             │
│                                                             │
│  OUTPUT: Projeto entregue                                   │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
SAIDA: Projeto em producao + Cliente satisfeito
```

## Criterios de Entrada
- [ ] Codigo aprovado no review
- [ ] Todos os testes passando
- [ ] Ambiente de producao configurado

## Criterios de Saida (Quality Gate)
- [ ] Sistema funcionando em producao
- [ ] Documentacao entregue
- [ ] Cliente aprovou entrega
- [ ] Suporte definido
- [ ] Metricas de sucesso sendo coletadas

## Checklist de Deploy
- [ ] Variaveis de ambiente configuradas
- [ ] Secrets seguros
- [ ] Backup configurado (se aplicavel)
- [ ] Monitoring configurado
- [ ] Rollback testado

## Comandos
```bash
# Preparar para deploy
@workflow prepare-deploy [projeto]

# Executar deploy
@workflow deploy [projeto] [ambiente]

# Verificar saude
@workflow health-check [projeto]

# Iniciar handoff
@workflow handoff [projeto]
```

## Timeline
| Fase | Duracao | Responsavel |
|------|---------|-------------|
| Documentacao | 1-2h | @pm, @dev |
| Deploy | 30min-1h | @dev |
| Handoff | 1-2h | @pm |
| **Total** | **2-5h** | - |
