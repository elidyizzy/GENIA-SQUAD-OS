# /project-state

Exibe o estado atual do projeto ativo (`.planning/STATE.md`).

## Execução

1. Detectar o projeto atual:
   - Se o cwd contém `.planning/STATE.md` → usar esse arquivo
   - Caso contrário, perguntar: "Qual projeto? (nome da pasta em .Apps/)"

2. Ler `.planning/STATE.md` do projeto

3. Exibir um resumo estruturado:

```
[@dev] Estado atual do projeto: [Nome]
Fase: [fase]  |  Sprint/Milestone: [milestone]

STORIES
  ✅ Done:      [lista]
  🔵 InProgress: [lista]
  📋 Ready:     [lista]
  📝 Draft:     [lista]

STACK
  [resumo da stack]

PRÓXIMOS PASSOS
  [lista]

BLOCKERS
  [lista ou "Nenhum"]
```

4. Perguntar: "Deseja atualizar algum campo? (/project-sync para sincronizar após mudanças)"
