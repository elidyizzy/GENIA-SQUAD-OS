# Workflow: Development

## Objetivo
Transformar SPEC-TECNICO em codigo funcional, testado e revisado.

## Fluxo

```
ENTRADA: SPEC-TECNICO.md + Stories priorizadas
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 1: IMPLEMENTACAO (@dev)                               │
│  ────────────────────────────                               │
│  Para cada Story:                                           │
│  1. Ler SPEC e criterios de aceite                          │
│  2. Criar branch                                            │
│  3. Implementar codigo                                      │
│  4. Escrever testes unitarios                               │
│  5. Verificar linting                                       │
│  6. Criar PR                                                │
│                                                             │
│  OUTPUT: Codigo + Testes + PR                               │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 2: TESTES (@qa)                                       │
│  ────────────────────                                       │
│  1. Revisar criterios de aceite                             │
│  2. Criar plano de testes                                   │
│  3. Executar testes manuais                                 │
│  4. Criar testes de integracao                              │
│  5. Verificar cobertura                                     │
│  6. Reportar bugs (se houver)                               │
│                                                             │
│  OUTPUT: Relatorio de testes                                │
└─────────────────────────────────────────────────────────────┘
    │
    ├─── SE bugs encontrados ──▶ @dev corrige ──▶ volta para testes
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 3: REVIEW (@reviewer)                                 │
│  ──────────────────────────                                 │
│  1. Revisar codigo do PR                                    │
│  2. Verificar padroes                                       │
│  3. Identificar code smells                                 │
│  4. Verificar seguranca                                     │
│  5. Aprovar ou solicitar mudancas                           │
│                                                             │
│  OUTPUT: Aprovacao do PR                                    │
└─────────────────────────────────────────────────────────────┘
    │
    ├─── SE mudancas solicitadas ──▶ @dev ajusta ──▶ volta para review
    │
    ▼
SAIDA: Codigo aprovado e pronto para deploy
```

## Criterios de Entrada
- [ ] SPEC-TECNICO.md aprovado
- [ ] Stories priorizadas
- [ ] Ambiente de desenvolvimento configurado

## Criterios de Saida (Quality Gate)
- [ ] Todos os testes passando
- [ ] Cobertura >80%
- [ ] Zero bugs criticos
- [ ] Code review aprovado
- [ ] Sem warnings de linting
- [ ] Documentacao atualizada

## Comandos
```bash
# Iniciar desenvolvimento de story
@workflow dev [story-id]

# Submeter para testes
@workflow submit-qa [story-id]

# Submeter para review
@workflow submit-review [pr-id]

# Aprovar e mergear
@workflow merge [pr-id]
```

## Timeline por Story
| Fase | Duracao | Responsavel |
|------|---------|-------------|
| Implementacao | 2-8h | @dev |
| Testes | 1-2h | @qa |
| Review | 30min-1h | @reviewer |
| **Total** | **3-11h** | - |
