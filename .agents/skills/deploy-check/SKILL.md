# SKILL: deploy-check
> Verificação de prontidão para deploy
> Agente: @devops (Tank) | Executado antes de todo git push / release

## Trigger
Ativado antes de qualquer push para `main`, criação de PR ou release.
Também pode ser chamado manualmente: `@devops deploy-check`

## Checklist de Deploy (executar em ordem)

### 1. Qualidade de código
- [ ] Lint passou sem erros (`npm run lint` ou equivalente)
- [ ] Build passou sem erros (`npm run build` ou equivalente)
- [ ] Testes passaram (`npm test` ou equivalente)
- [ ] Cobertura de testes ≥ 80% em código novo

### 2. Segurança
- [ ] Nenhum `.env` ou credencial no staging area (`git diff --cached`)
- [ ] Nenhuma chave de API hard-coded no código
- [ ] Dependências sem vulnerabilidades críticas (`npm audit`)

### 3. Story e documentação
- [ ] Story relacionada está em status **InReview** ou superior
- [ ] @qa aprovou (status InReview)
- [ ] @reviewer aprovou (code review concluído)
- [ ] CHANGELOG atualizado (se release)

### 4. Git
- [ ] Branch correta: `feat/STORY-NNN-slug` ou `fix/...`
- [ ] Commits seguem conventional commits
- [ ] Sem merge conflicts pendentes
- [ ] Histórico limpo (sem commits "WIP" ou "fix fix fix")

### 5. Ambiente de destino
- [ ] Variáveis de ambiente configuradas no destino
- [ ] Migrations de banco aprovadas por @architect (se houver)
- [ ] Rollback plan documentado para releases maiores

## Resultado

### ✅ Aprovado — prosseguir com push
```
[@devops] deploy-check PASSED
- Lint: ✅
- Build: ✅
- Testes: ✅
- Segurança: ✅
- Story: ✅ (STORY-NNN em InReview)
Prosseguindo com push...
```

### ❌ Bloqueado — descrever o que falhou
```
[@devops] deploy-check BLOCKED
- Build: ❌ (erro em src/api/auth.ts linha 42)
Ação necessária: corrigir build antes do push.
Delegando para @dev.
```

## Protocolo de push (após aprovação)

```bash
# 1. Criar flag de autorização
Write → .genia/session/devops-active  (conteúdo: "authorized")

# 2. Executar push
git push origin [branch]

# 3. Hook enforce-git-push-authority.py consome o flag e permite
# 4. Reportar resultado
```

## Restrições
- Apenas @devops executa push (Artigo II da Constituição)
- Force push (`--force`) requer confirmação explícita da usuária
- Deploy para produção requer Protocolo de Ação Crítica
