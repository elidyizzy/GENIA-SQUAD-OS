# Workflow: Delivery

> Fase de entrega. Transforma código aprovado em produto em produção.
> Ordem: @pm → @devops → @qa (validação) → @pm (comunicação)

---

## Visão Geral

O workflow Delivery é a fase final do ciclo de desenvolvimento. Ele abrange todo o processo desde a decisão de fazer uma release até o produto estar em produção, monitorado e com os stakeholders informados. Delivery não é apenas `git push` — é um processo gerenciado de entrega de valor.

**Quando usar:** Ao final de um sprint ou conjunto de sprints com stories Done suficientes para uma release
**Pré-requisito:** Stories aprovadas por @po, código mergeado em main por @devops, staging validado

---

## Fase 1 — Decisão de Release (@pm)

**Responsável:** Marina (@pm)
**Output:** Decisão formal de release com escopo definido

### O que acontece:
1. @pm avalia o conjunto de stories prontas e decide se há valor suficiente para uma release
2. Define o escopo da release:
   - O que está incluído (features prontas)
   - O que NÃO está incluído (features parciais ou não concluídas)
3. Define a versão semântica (Major.Minor.Patch):
   - **Major:** mudanças breaking, redesign significativo
   - **Minor:** novas funcionalidades, expansões
   - **Patch:** bug fixes, melhorias menores
4. Alinha expectativas com stakeholders sobre o que será entregue
5. Define data e hora de release (evitar deploy em sexta-feira à tarde)
6. Aprova formalmente a release

### Critérios para autorizar release:
- [ ] Mínimo de stories Done que justifiquem o deploy
- [ ] Nenhum bug crítico pendente
- [ ] Staging estável há pelo menos 48h
- [ ] Plano de rollback documentado
- [ ] Stakeholders informados

---

## Fase 2 — Preparação de Release (@devops)

**Responsável:** Gate (@devops)
**Output:** Ambiente de produção pronto, release notes preparadas

### O que acontece:
1. @devops confirma que o pipeline CI/CD está verde em staging
2. Gera as release notes a partir dos commits e stories:
   ```markdown
   # Release v1.2.0 — YYYY-MM-DD

   ## Novidades
   - [STORY-001] Funcionalidade X implementada
   - [STORY-003] Melhoria Y aplicada

   ## Correções
   - [STORY-005] Bug Z corrigido

   ## Notas Técnicas
   - Migração de banco de dados necessária: [sim/não]
   - Configurações de ambiente alteradas: [lista]
   - Breaking changes: [sim/não]
   ```
3. Executa checklist completo de pré-deploy
4. Prepara o plano de rollback documentado
5. Cria a tag de release: `git tag -a v1.2.0 -m "Release v1.2.0"`
6. Comunica janela de deploy para o time

### Checklist pré-produção de @devops:
- [ ] Pipeline CI em staging: verde
- [ ] Testes de integração em staging: passando
- [ ] Security scan: sem vulnerabilidades críticas
- [ ] Performance check: dentro dos SLAs
- [ ] Variáveis de ambiente de produção: configuradas
- [ ] Backup de banco de dados: realizado
- [ ] Plano de rollback: documentado e testado
- [ ] Time avisado sobre a janela de deploy
- [ ] Escalação de suporte configurada (se necessário)

---

## Fase 3 — Deploy em Produção (@devops)

**Responsável:** Gate (@devops)
**Output:** Sistema em produção com nova versão

### O que acontece:
1. @devops executa o pipeline de produção
2. Monitora cada etapa do deploy:
   - Build de produção
   - Testes pré-deploy (smoke tests)
   - Deploy incremental (canary ou blue/green se configurado)
   - Verificações pós-deploy
3. Confirma que a aplicação está saudável em produção:
   - Health checks respondem
   - Logs sem erros críticos
   - Métricas de performance normais
4. Publica a release no GitHub: `gh release create v1.2.0`

### Se algo der errado durante o deploy:
```
1. @devops para o deploy imediatamente
2. Avalia a severidade do problema
3. Se crítico: executa rollback imediatamente
4. Documenta o incidente
5. Notifica @pm e @architect
6. Abre post-mortem se necessário
```

---

## Fase 4 — Validação Pós-Deploy (@qa)

**Responsável:** Quinn (@qa)
**Output:** Validação formal em produção

### O que acontece:
1. @qa executa smoke tests em produção (não os unitários — testes de comportamento)
2. Verifica os principais fluxos de usuário afetados pela release
3. Confirma que funcionalidades existentes não foram impactadas
4. Monitora métricas por 30-60 minutos após o deploy
5. Emite veredicto de saúde da release:
   - **SAUDÁVEL:** release aprovada, ambiente estável
   - **ALERTA:** problemas não-críticos identificados, monitorar
   - **CRÍTICO:** problema grave detectado → @devops executa rollback imediatamente

### Smoke tests típicos:
- Login/autenticação funcionando
- Principais fluxos de negócio acessíveis
- APIs respondendo com status corretos
- Integrações externas ativas
- Performance aceitável (sem degradação significativa)

---

## Fase 5 — Comunicação e Documentação (@pm)

**Responsável:** Marina (@pm)
**Output:** Stakeholders informados, documentação atualizada

### O que acontece:
1. @pm redige e envia comunicado de release para stakeholders:
   ```
   Assunto: GEN.IA OS v1.2.0 — Nova versão disponível

   Olá,

   Acabamos de disponibilizar a versão 1.2.0 do [produto] em produção.

   O que há de novo:
   - [Feature X]: [descrição em linguagem de negócio]
   - [Correção Y]: [impacto positivo para o usuário]

   Próximos passos:
   - [O que vem a seguir]
   ```
2. Atualiza o CHANGELOG.md do projeto
3. Arquiva o sprint no histórico
4. Agenda retrospectiva com @sm
5. Inicia planejamento do próximo ciclo

---

## Processo de Rollback

Se a release precisar ser revertida:

1. **@devops decide ou é acionado** por @qa (veredicto CRÍTICO)
2. **@devops executa rollback:**
   - Deploy da versão anterior (blue/green switch ou redeploy)
   - Ou reverte migrações de banco se necessário
3. **@devops confirma** que versão anterior está estável
4. **@pm comunica** stakeholders sobre o rollback com transparência
5. **@architect investiga** a causa raiz
6. **Post-mortem** documentado e ações de prevenção definidas

---

## Critérios de Conclusão do Delivery

A release está concluída quando:

- [ ] Nova versão em produção e estável
- [ ] @qa validou em produção (veredicto SAUDÁVEL ou ALERTA monitorado)
- [ ] Release notes publicadas no GitHub
- [ ] Stakeholders comunicados por @pm
- [ ] CHANGELOG.md atualizado
- [ ] Tag de release criada e publicada
- [ ] Nenhum incidente crítico ativo

---

## Governança de Deploy

| Ambiente | Autoridade | Requer aprovação de |
|---------|-----------|-------------------|
| Development | @dev (local) | Ninguém |
| Staging | @devops | @qa (implícita — pipeline) |
| Production | @devops | @pm (formal) + @qa (pós-deploy) |

**Regra de ouro:** Production nunca recebe código que não passou por staging. Sem exceção.

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
