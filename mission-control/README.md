# MISSION CONTROL — GEN.IA SQUAD OS

Interface visual que orquestra sessões reais do Claude Code CLI.
Por baixo: Claude Code + GEN.IA OS. Por cima: escritório dourado sem terminal.

---

## Pré-requisitos

1. **Node.js** >= 18
2. **Claude Code CLI** instalado e autenticado:
   ```bash
   npm i -g @anthropic-ai/claude-code
   claude login
   ```
3. **GEN.IA SQUAD OS** clonado no seu projeto:
   ```bash
   git clone https://github.com/elidyizzy/GENIA-SQUAD-OS .
   ```

---

## Como rodar

```bash
# Na pasta do seu projeto (que tem o GEN.IA OS)
cd seu-projeto

# Instalar dependências do Mission Control
cd mission-control
npm install

# Iniciar (aponta para o projeto atual)
node server.js

# Ou apontar para outro projeto:
node server.js --project /caminho/do/projeto
```

Abra **http://localhost:3001** no navegador.

---

## Estrutura esperada no projeto

```
seu-projeto/
├── .claude/
│   ├── CLAUDE.md          ← GEN.IA OS (obrigatório)
│   ├── HANDOVER.md
│   └── skills/
├── .business/
│   └── context-empresa.ts  ← Contexto da empresa (gerado pelo wizard)
├── PRIORIDADES.md
└── mission-control/        ← Este diretório
    ├── server.js
    ├── index.html
    └── package.json
```

---

## Como usar

- **Selecione um agente** no painel esquerdo
- **Digite sua mensagem** — o agente é detectado automaticamente pelo contexto
- **Use @nome** para forçar um agente específico: `@neo cria o componente X`
- **■ PARAR** interrompe a execução a qualquer momento

### Agentes disponíveis

| Agente    | Comando   | Especialidade         |
|-----------|-----------|----------------------|
| Cypher    | @cypher   | Análise e dados      |
| Morpheus  | @morpheus | Product Management   |
| Trinity   | @trinity  | Arquitetura          |
| Neo       | @neo      | Desenvolvimento      |
| Tank      | @tank     | DevOps / Deploy      |
| Smith     | @smith    | QA / Testes          |
| Switch    | @switch   | Code Review          |
| Oracle    | @oracle   | Product Owner        |
| Mouse     | @mouse    | Scrum Master         |

---

## Painéis do Status

O painel direito mostra em tempo real:
- ✅ GEN.IA OS detectado
- ✅ .business/ configurado  
- ✅ PRIORIDADES.md presente
- ✅ Servidor conectado

Se algum item aparecer em amarelo, o Mission Control avisa o que está faltando.

---

GEN.IA SQUAD © 2025
