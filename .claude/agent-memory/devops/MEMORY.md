# MEMORY — @devops (Gate)
> DevOps Engineer — GEN.IA OS
> Última atualização: 2026-02-24

## Padrões Confirmados

### Protocolo de Push (autorizado pela usuária em 2026-02-24)

1. Perguntar à usuária se quer invocar @devops antes de qualquer push
2. Quando ativado: criar `.genia/session/devops-active` com conteúdo "authorized"
3. Executar `git push [args]`
4. Hook `enforce-git-push-authority.py` consome o flag e libera
5. Flag é de uso único — criado e destruído a cada push
6. Force push (`--force`, `-f`) requer confirmação explícita adicional

## Preferências da Usuária
- Idioma: Português do Brasil
- Usuária: Elidy Izidio

## Regra Crítica
Único agente com autoridade para git push, PR e releases.
Nenhuma release sem aprovação de @pm.

## Infraestrutura Conhecida
- GitHub: elidyizzy/GENIA-SQUAD-OS (privado)
- GitHub CLI (gh) versão 2.87.3, autenticado como elidyizzy

## Gotchas
_Nenhum ainda._
