# STORY-006 — AGENTS.md com guia de integração Google Antigravity

**Status:** Done
**Agente:** @dev
**Criado:** 2026-03-23
**Estimativa:** M

## Descrição
Como usuária usando o GEN.IA OS junto com o Google Antigravity, quero ter um documento claro em `.agents/AGENTS.md` que explique como os 9 agentes do SQUAD se expõem para o Antigravity, quando usar cada sistema e qual o mecanismo de integração, para não duplicar esforço nem confundir os dois mundos.

## Acceptance Criteria
- [ ] AC1: `.agents/AGENTS.md` descreve a relação entre GEN.IA OS e Google Antigravity
- [ ] AC2: Documento mapeia quais agentes do SQUAD têm skills expostas no `.agents/skills/`
- [ ] AC3: Guia define claramente: "use GEN.IA OS quando X, use Antigravity quando Y"
- [ ] AC4: Cada skill em `.agents/skills/` tem cabeçalho com agente-dono, versão e descrição
- [ ] AC5: Documento revisado e aprovado por @po antes de merge

## Tasks Técnicas
- [ ] Task 1: Listar as 3 skills já existentes em `.agents/skills/` e entender seu conteúdo
- [ ] Task 2: Escrever seção de contexto: o que é Antigravity e onde o GEN.IA OS se encaixa
- [ ] Task 3: Mapear agentes → skills expostas no Antigravity
- [ ] Task 4: Escrever guia de decisão: GEN.IA OS vs. Antigravity direto
- [ ] Task 5: Padronizar cabeçalho de cada skill em `.agents/skills/`

## Branch
`docs/STORY-006-agents-antigravity`

## Arquivos Envolvidos
- `.agents/AGENTS.md`
- `.agents/skills/*.md` (os 3 existentes)

## Dependências
- Nenhuma

## Riscos
- Documentação do Antigravity pode mudar — manter o AGENTS.md no nível de princípios, não de detalhes de implementação
