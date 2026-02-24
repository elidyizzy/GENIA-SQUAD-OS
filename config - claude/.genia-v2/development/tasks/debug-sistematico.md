# Task: Debug Sistematico

## Metadata
- **ID**: task:debug
- **Agente**: @dev
- **Fase**: Development
- **Skills**: nenhuma especifica

## Descricao
Processo estruturado para identificar e corrigir bugs.

## Inputs
- Descricao do problema
- Logs de erro (se disponiveis)
- Steps para reproduzir

## Outputs
- Causa raiz identificada
- Correcao implementada
- Teste de regressao

## Steps

### 1. Coleta de Informacoes
```
- O que esta acontecendo?
- O que deveria acontecer?
- Quando comecou?
- Consegue reproduzir?
- Tem logs?
```

### 2. Formulacao de Hipoteses
```
1. Hipotese mais provavel: [...]
2. Segunda hipotese: [...]
3. Terceira hipotese: [...]
```

### 3. Investigacao
```
Para cada hipotese:
1. Testar hipotese
2. Coletar evidencias
3. Confirmar ou descartar
```

### 4. Isolamento
```
- Reduzir ao caso minimo
- Identificar componente afetado
- Verificar dependencias
```

### 5. Correcao
```
1. Implementar fix
2. Testar fix
3. Verificar efeitos colaterais
4. Criar teste de regressao
```

### 6. Documentacao
```
- Causa raiz
- Solucao aplicada
- Licoes aprendidas
```

## Comandos
```bash
# Iniciar debug
@dev debug [problema]

# Verificar hipotese
@dev verificar [hipotese]

# Aplicar fix
@dev fix [descricao]
```

## Checklist
- [ ] Problema reproduzido
- [ ] Causa raiz identificada
- [ ] Fix implementado
- [ ] Teste passando
- [ ] Documentado (se relevante)
