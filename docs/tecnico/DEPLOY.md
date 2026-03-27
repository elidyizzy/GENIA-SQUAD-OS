# DEPLOY
> Responsável: @devops (Tank) | Última atualização: 2026-03-27

---

> **Regra:** Nenhum deploy sem este documento atualizado. Tank (@devops) é o único com autoridade de push e release.

---

## Ambientes

| Ambiente | URL | Branch | Deploy automático |
|----------|-----|--------|-------------------|
| Produção | _[URL]_ | `main` | Não — manual |
| Staging | _[URL]_ | `staging` | Sim — ao fazer merge |
| Local | `localhost:3000` | qualquer | — |

## Processo de Deploy

### Pré-requisitos
- [ ] Todos os testes passando (`npm test`)
- [ ] Build sem erros (`npm run build`)
- [ ] CHANGELOG.md atualizado
- [ ] PR aprovado por @reviewer (Switch)

### Deploy para Staging

```bash
# @devops (Tank) executa:
git checkout staging
git merge main
git push origin staging
```

### Deploy para Produção

```bash
# Protocolo obrigatório — Tank solicita aprovação de Elidy antes
# 🔴 AÇÃO CRÍTICA — aguardando aprovação

git tag -a v[versao] -m "Release v[versao]"
git push origin main
git push origin --tags
```

## Rollback

```bash
# Em caso de problema em produção:
git revert HEAD
git push origin main
# Ou: reverter para a tag anterior
git checkout v[versao-anterior]
```

## Checklist de Release

- [ ] Testes passando
- [ ] Build OK
- [ ] CHANGELOG atualizado
- [ ] Tag criada
- [ ] Handover documentado em docs/handover/
- [ ] Elidy notificada

---

_Responsável exclusivo: @devops (Tank). Nenhum outro agente faz push._
