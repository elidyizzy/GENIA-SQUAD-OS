# Checklist: Pré-Deploy

> Verificações obrigatórias antes de qualquer deploy em produção.
> Executado por @devops. Nenhum deploy acontece sem este checklist completo.

---

## Objetivo

Garantir que um deploy em produção seja seguro, reversível e comunicado adequadamente. Deploys sem checklist são causa comum de incidentes. Este checklist é o contrato de @devops com a estabilidade do sistema.

---

## Regra de Ouro

**Production nunca recebe código que não passou por staging.**

Se staging não está estável, o deploy não acontece. Sem exceção.

---

## Checklist Completo

### Bloco 1 — Pré-Requisitos (Verificar ANTES de qualquer ação)

- [ ] @pm aprovou formalmente a release (decisão de delivery documentada)
- [ ] Todas as stories da release têm status `Done` (aprovadas por @po)
- [ ] PRs de todas as stories estão mergeados em `main`
- [ ] Branch `main` está sem conflitos pendentes
- [ ] Não há incidentes abertos em produção no momento

---

### Bloco 2 — Validação de Staging

```bash
# Verificar status do pipeline de staging
gh run list --branch main --limit 5
```

- [ ] Pipeline CI/CD de staging: **verde** nos últimos 48h
- [ ] Ambiente de staging está respondendo (health check passa)
- [ ] Testes de integração em staging: passando
- [ ] Funcionalidades da release verificadas em staging por @qa
- [ ] Sem erros críticos nos logs de staging nas últimas 24h

---

### Bloco 3 — Segurança

- [ ] Security scan executado no código da release (sem vulnerabilidades CRÍTICAS)
- [ ] Secrets e variáveis de ambiente de produção estão configurados
- [ ] Nenhum secret de staging sendo usado em produção
- [ ] Dependências verificadas por vulnerabilidades conhecidas (`npm audit`)
- [ ] Certificados SSL/TLS válidos e não próximos do vencimento

```bash
npm audit --audit-level=critical
```

- [ ] Zero vulnerabilidades críticas em dependências

---

### Bloco 4 — Banco de Dados (se aplicável)

- [ ] Backup completo do banco de dados de produção realizado ANTES do deploy
- [ ] Migrações de banco testadas em staging sem erros
- [ ] Migrações são backward-compatible (se sistema precisa ser zero-downtime)
- [ ] Script de rollback de migração existe e foi testado
- [ ] Não há migrações destrutivas sem confirmação de @architect e @pm
- [ ] Tempo estimado de migração documentado (se > 5 min: avisar usuários)

---

### Bloco 5 — Variáveis de Ambiente e Configuração

- [ ] Todas as variáveis de ambiente necessárias estão configuradas em produção
- [ ] Nenhuma variável com valor de staging sendo usada em produção
- [ ] Arquivo `.env.example` atualizado com novas variáveis necessárias
- [ ] Configurações de feature flags (se usadas) verificadas

```bash
# Verificar variáveis críticas (sem expor valores)
env | grep -E "(API_URL|DATABASE|AUTH)" | cut -d= -f1
```

---

### Bloco 6 — Performance e Capacidade

- [ ] Build de produção gerado com sucesso (`npm run build`)
- [ ] Tamanho do bundle verificado (sem regressão de performance inesperada)
- [ ] Capacidade da infraestrutura verificada para o volume esperado
- [ ] Cache invalidado/renovado conforme necessário

```bash
npm run build
npm run build:analyze  # se disponível
```

---

### Bloco 7 — Plano de Rollback

**Pré-requisito:** Plano de rollback DEVE existir ANTES de iniciar o deploy.

- [ ] Versão anterior identificada: `v[X.X.X]`
- [ ] Comando de rollback documentado e testado:
  ```bash
  # Exemplo para Vercel
  vercel rollback [deployment-id]

  # Exemplo para Railway
  railway rollback
  ```
- [ ] Rollback de migração de banco documentado (se houver migração)
- [ ] Tempo estimado para rollback: < 10 minutos
- [ ] @architect e @pm notificados sobre plano de rollback

---

### Bloco 8 — Comunicação e Janela de Deploy

- [ ] Time notificado sobre a janela de deploy (com pelo menos 2h de antecedência)
- [ ] Deploy agendado em horário de baixo tráfego (evitar horário de pico)
- [ ] Evitar deploys em sexta-feira após 14h ou véspera de feriado
- [ ] Suporte de plantão identificado para primeiras 2h após deploy
- [ ] Canal de comunicação de incidentes configurado e verificado
- [ ] Stakeholders que precisam ser notificados identificados

**Janelas ideais de deploy:**
- Segunda a quinta: 10h-12h ou 14h-16h
- Evitar: sextas à tarde, vésperas de datas importantes, horário de pico de usuários

---

### Bloco 9 — Monitoramento Pós-Deploy

Configure alertas ANTES de iniciar o deploy:

- [ ] Alertas de erro (5xx) configurados com threshold e notificação imediata
- [ ] Dashboard de métricas aberto para monitoramento em tempo real
- [ ] Health check endpoint identificado para verificação contínua
- [ ] Plano de monitoramento por pelo menos 30 minutos após o deploy

---

### Bloco 10 — Release Notes e Documentação

- [ ] Release notes geradas e revisadas
- [ ] CHANGELOG.md atualizado com as mudanças desta release
- [ ] Documentação de APIs atualizada (se houve mudança de contrato)
- [ ] Tag de versão criada: `git tag -a v[X.X.X] -m "Release v[X.X.X]"`

---

## Execução do Deploy

Após checklist completo, a sequência de deploy:

```bash
# 1. Tag a versão
git tag -a v1.2.0 -m "Release v1.2.0: [descrição resumida]"
git push origin v1.2.0

# 2. Deploy (específico para cada plataforma)
# Vercel: vercel --prod
# Railway: railway up
# AWS: [comando específico]

# 3. Verificação imediata pós-deploy
curl https://[url-producao]/health
```

---

## Protocolo de Incidente Durante Deploy

Se algo der errado durante ou após o deploy:

```
NÍVEL 1 (degradação leve):
→ Monitorar por 15 minutos
→ Se não melhorar: NÍVEL 2

NÍVEL 2 (funcionalidade impactada):
→ Notificar @architect imediatamente
→ Decidir: aguardar fix hotfix ou rollback
→ Timeout de decisão: 30 minutos

NÍVEL 3 (sistema fora do ar / dados em risco):
→ ROLLBACK IMEDIATO
→ Notificar @pm e @architect simultaneamente
→ Comunicar usuários via [canal definido]
→ Post-mortem obrigatório nas próximas 24h
```

---

## Verificação Pós-Deploy (Executar imediatamente após)

- [ ] Health check em produção: passando
- [ ] Testes de fumaça (smoke tests) em produção: passando
- [ ] Logs de produção: sem erros críticos nos primeiros 5 minutos
- [ ] Métricas de performance: normais (sem degradação)
- [ ] @qa executou smoke tests em produção e confirmou estabilidade
- [ ] @pm comunicado sobre sucesso do deploy

---

## Confirmação de Conclusão

```markdown
## Deploy Concluído — v[X.X.X]
Data/Hora: YYYY-MM-DD HH:MM
Ambiente: Production
Deploy executado por: Gate (@devops)

Checklist: ✅ Completo
Smoke tests: ✅ Passando
Monitoramento: ✅ Ativo (30 min)
Status: ✅ DEPLOY BEM-SUCEDIDO

Próximo passo: @pm comunica stakeholders
```

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
