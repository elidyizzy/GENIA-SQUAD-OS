# Protocolo de Novo Projeto — GEN.IA OS
> Regra obrigatória. Todo projeto novo segue este protocolo sem exceção.
> Adicionar em `.claude/rules/new-project.md`

---

## Trigger

Qualquer solicitação que envolva criar:
- Novo app / sistema / produto
- Novo site
- Nova automação
- Novo agente
- Qualquer entregável com mais de 1 arquivo de código

---

## Passo 1 — Nunca começar sem o briefing

Antes de criar qualquer arquivo, pasta ou linha de código:

```
[@analyst] Cypher iniciando briefing...

Antes de criar [nome do projeto], preciso entender:

1. Qual problema isso resolve? (em uma frase)
2. Quem vai usar? (persona real)
3. Qual o resultado esperado quando funcionar?
4. Tem prazo ou restrição importante?
5. Qual empresa / negócio é responsável por este projeto?
```

Sem respostas → sem projeto. Não é burocracia, é clareza antes de custo.

---

## Passo 2 — Criar a estrutura de pastas

Após briefing aprovado, criar dentro de `.Apps/`:

```
.Apps/
└── [nome-do-projeto]/
    ├── docs/
    │   ├── BRIEFING.md          ← @analyst preenche
    │   ├── PRD.md               ← @pm preenche
    │   ├── SPEC-TECNICO.md      ← @architect preenche
    │   ├── PITCH.md             ← @analyst + @pm preenchem
    │   └── stories/
    │       └── STORY-001.md     ← @sm cria, @po valida
    ├── src/                     ← código fonte
    ├── tests/                   ← testes
    └── README.md                ← @pm preenche ao final
```

**Comando de criação (executado por @devops):**
```bash
mkdir -p .Apps/[nome-do-projeto]/{docs/stories,src,tests}
```

---

## Passo 3 — Sequência obrigatória de documentação

Nenhum código é escrito antes desta sequência estar completa:

```
@analyst  → BRIEFING.md    (entendimento do problema)
    ↓
@pm       → PRD.md         (requisitos e escopo)
    ↓
@architect → SPEC-TECNICO.md (arquitetura e stack)
    ↓
@analyst + @pm → PITCH.md  (documento comercial)
    ↓
@sm       → STORY-001.md   (primeira story)
    ↓
@po       → validação       (aprova antes do @dev codar)
    ↓
@dev      → src/            (só aqui começa o código)
```

---

## Passo 4 — Associar ao negócio correto

Todo projeto pertence a uma empresa. Registrar no cabeçalho de todos os docs:

```markdown
**Empresa:** [GEN.IA SQUAD / BrasilUp / Cuore]
**Responsável:** Elidy Izidio
**Projeto:** [nome]
**Iniciado:** YYYY-MM-DD
```

---

## Passo 5 — Atualizar PRIORIDADES.md

Ao criar projeto novo, adicionar em `.business/PRIORIDADES.md`:

```markdown
| [Nome do projeto] | [Empresa] | Em planejamento | Aguarda PRD |
```

---

## O que NUNCA fazer ao criar projeto

- ❌ Criar pasta `src/` antes do `BRIEFING.md` existir
- ❌ Escrever código antes da `STORY-001` estar aprovada pelo @po
- ❌ Pular o `PITCH.md` — ele é obrigatório mesmo para automações internas
- ❌ Criar projeto fora da pasta `.Apps/`
- ❌ Começar sem saber a qual empresa/negócio o projeto pertence

---

## Sobre o PITCH.md em projetos internos

Mesmo para automações internas (relatórios, scripts, bots):
o PITCH.md simplificado deve existir.

Por quê: toda solução tem um problema que resolve e um valor que entrega.
Documentar isso desde o início evita que projetos morram sem deixar rastro do que eram e por que existiam.

Para automações internas, as seções obrigatórias são apenas:
- Seção 1 (a frase)
- Seção 2 (o problema)
- Seção 3 (a solução)
- Seção 5 (os resultados esperados)

---

_Esta regra é parte da Constituição do GEN.IA OS._
_Só pode ser alterada com aprovação explícita de Elidy Izidio._
