# GEN.IA Imersão — Estrutura Técnica
> Roteiro operacional dos 2 dias ao vivo
> Empresa: GEN.IA SQUAD | Autora: Elidy Izidio
> Versão: 1.0 | Data: 2026-03-13

---

## Premissa Operacional

O aluno **não constrói do zero**. Ele clona sistemas já em produção e adapta para o negócio dele.

Isso significa:
- Elidy compartilha tela e repositório
- Aluno segue o passo a passo clonando para sua máquina
- Adaptação é guiada — não livre

**Resultado garantido ao final do Dia 2:** sistema no ar, rodando com os dados do aluno.

---

## Pré-requisitos do Aluno

O aluno precisa ter antes da imersão:

| Item | Obrigatório | Observação |
|------|------------|------------|
| Computador (Windows/Mac) | Sim | Não funciona só pelo celular |
| Claude Code instalado | Sim | Elidy envia tutorial antes da imersão |
| Conta no GitHub | Sim | Para clonar os repositórios |
| Número de WhatsApp Business | Sim | Para o agente funcionar |
| API do WhatsApp configurada | Não | Elidy ajuda durante a imersão |

**Material de preparação:** Elidy envia guia de instalação 3 dias antes. Quem não conseguir instalar recebe suporte via WhatsApp antes do Dia 1.

---

## O que o Aluno Vai Clonar

Repositórios disponíveis (preparados pela GEN.IA SQUAD):

```
genia-imersao/
├── landing-page-template/     ← Landing page adaptável
├── agente-luma/               ← Agente WhatsApp (Luma adaptada)
├── mini-crm-kanban/           ← CRM Kanban visual
└── ors-orcamentos/            ← Sistema de orçamentos (bonus)
```

Cada repositório tem:
- `README.md` com instruções de clone e adaptação
- `.env.example` com variáveis que o aluno precisa preencher
- Arquivo de configuração do negócio (`config/negocio.json`) — é aqui que o aluno personaliza

---

## DIA 1 — "O Sistema e Como Ele Funciona"
**Horário sugerido:** 9h às 18h com pausas
**Foco:** Entender, instalar e configurar o agente de WhatsApp

---

### Bloco 1 — 9h às 10h30: Abertura e Contexto
**Objetivo:** Aluno entende o que vai construir e por quê funciona

| Tempo | Conteúdo |
|-------|----------|
| 9h00 | Abertura — apresentações, regras do jogo |
| 9h15 | O problema que vamos resolver (funil com buraco negro) |
| 9h30 | O que é o Claude Code — em linguagem de empresário |
| 9h45 | Como o GEN.IA OS potencializa o Claude Code |
| 10h00 | Demonstração ao vivo: agente respondendo lead no WhatsApp |
| 10h20 | Perguntas |

**Entregável do bloco:** Clareza sobre o que vai ser construído

---

### Bloco 2 — 10h45 às 12h30: Clone e Configuração do Agente
**Objetivo:** Agente Luma clonado e configurado com dados do negócio do aluno

| Tempo | Conteúdo |
|-------|----------|
| 10h45 | Clone do repositório `agente-luma` — todos juntos |
| 11h00 | Abrir o arquivo `config/negocio.json` — personalizar |
| 11h15 | Configurar: nome do negócio, produtos/serviços, preços |
| 11h30 | Configurar: perguntas de qualificação do agente |
| 11h45 | Conectar ao WhatsApp (Evolution API) — passo a passo |
| 12h10 | Teste ao vivo: aluno envia mensagem e o agente responde |
| 12h20 | Ajustes e perguntas |

**Entregável do bloco:** Agente rodando no WhatsApp do aluno

**Ponto de atenção:** Este é o bloco mais técnico. Ter suporte adicional no chat para ajudar quem travar.

---

### Almoço — 12h30 às 14h

---

### Bloco 3 — 14h às 15h30: Ensinando o Agente sobre o Negócio
**Objetivo:** Agente sabe responder sobre os produtos e serviços específicos do aluno

| Tempo | Conteúdo |
|-------|----------|
| 14h00 | O que é o "briefing do negócio" — o cérebro do agente |
| 14h15 | Escrever o briefing do negócio com o Claude Code |
| 14h30 | Configurar respostas para as perguntas mais comuns |
| 14h45 | Configurar fluxo de qualificação: quais perguntas o agente faz |
| 15h00 | Teste: conversa completa com o agente treinado |
| 15h15 | Refinamento: o que melhorar nas respostas |

**Entregável do bloco:** Agente que sabe sobre o negócio e qualifica o lead corretamente

---

### Bloco 4 — 15h45 às 17h30: Sistema de Orçamentos
**Objetivo:** Agente gera e envia orçamentos automaticamente

| Tempo | Conteúdo |
|-------|----------|
| 15h45 | Clone do repositório `ors-orcamentos` |
| 16h00 | Configurar: tabela de produtos e preços |
| 16h20 | Integrar ORS com o agente Luma |
| 16h40 | Teste: aluno pede orçamento via WhatsApp, agente gera e envia |
| 17h00 | Ajustes e personalização |
| 17h15 | Perguntas e recap do Dia 1 |

**Entregável do bloco:** Agente que gera e envia orçamentos pelo WhatsApp

---

### Encerramento Dia 1 — 17h30 às 18h
- O que construímos hoje
- O que vem amanhã
- Tarefa para a noite: testar o agente com 3 pessoas reais (amigos, familiares) e trazer os resultados

---

## DIA 2 — "O Sistema Completo e No Ar"
**Horário sugerido:** 9h às 18h com pausas
**Foco:** Landing page, mini CRM e sistema integrado funcionando

---

### Bloco 5 — 9h às 10h30: Resultados da Noite e Ajustes
**Objetivo:** Corrigir o que não funcionou, celebrar o que funcionou

| Tempo | Conteúdo |
|-------|----------|
| 9h00 | Cada aluno compartilha o teste da noite |
| 9h20 | Problemas comuns — resolução ao vivo |
| 9h50 | Refinamento dos agentes com base nos testes reais |
| 10h20 | Perguntas |

**Por que este bloco existe:** Testes reais revelam o que a teoria não cobre. Resolver ao vivo é mais poderoso do que qualquer script.

---

### Bloco 6 — 10h45 às 12h30: Landing Page
**Objetivo:** Landing page do aluno no ar, integrada ao WhatsApp

| Tempo | Conteúdo |
|-------|----------|
| 10h45 | Clone do repositório `landing-page-template` |
| 11h00 | Estrutura da landing page — o que cada seção faz |
| 11h15 | Personalizar: logo, cores, textos, oferta |
| 11h30 | Integrar botão de WhatsApp → agente Luma |
| 11h45 | Deploy da landing page (GitHub Pages — gratuito) |
| 12h00 | Teste: aluno acessa a própria landing page no celular |
| 12h15 | Ajustes visuais e de texto |

**Entregável do bloco:** Landing page no ar com domínio gratuito (pode conectar domínio próprio depois)

---

### Almoço — 12h30 às 14h

---

### Bloco 7 — 14h às 15h30: Mini CRM Kanban
**Objetivo:** Pipeline visual dos leads funcionando e integrado ao agente

| Tempo | Conteúdo |
|-------|----------|
| 14h00 | Clone do repositório `mini-crm-kanban` |
| 14h15 | Configurar colunas do pipeline para o negócio do aluno |
| 14h30 | Integrar com o agente: lead qualificado → entra no CRM automaticamente |
| 14h50 | Teste: lead chega pelo WhatsApp, é qualificado e aparece no CRM |
| 15h10 | Como usar o CRM no dia a dia |
| 15h20 | Perguntas |

**Entregável do bloco:** CRM Kanban com leads reais do teste aparecendo automaticamente

---

### Bloco 8 — 15h45 às 17h: O Sistema Integrado
**Objetivo:** Garantir que tudo funciona junto — do lead ao orçamento ao CRM

| Tempo | Conteúdo |
|-------|----------|
| 15h45 | Simulação completa: lead chega pela landing page |
| 16h00 | Agente qualifica → gera orçamento → lead entra no CRM |
| 16h20 | Como acompanhar o CRM no dia a dia |
| 16h30 | Como atualizar o agente quando o negócio mudar |
| 16h45 | Como escalar: o que fazer quando o volume crescer |

**Entregável do bloco:** Sistema completo funcionando do início ao fim

---

### Encerramento — 17h às 18h
**Objetivo:** Celebrar, orientar os próximos passos e converter para a segunda turma

| Tempo | Conteúdo |
|-------|----------|
| 17h00 | Cada aluno mostra o sistema funcionando (1-2 min cada) |
| 17h30 | Próximos passos: o que fazer na semana seguinte |
| 17h40 | Comunidade pós-imersão (a definir) |
| 17h50 | Apresentação da segunda turma a R$497 — convite para indicar |
| 18h00 | Encerramento |

---

## Estrutura de Suporte Durante a Imersão

| Canal | Função |
|-------|--------|
| Zoom (tela principal) | Elidy compartilha tela, ensina e demonstra |
| Chat do Zoom | Perguntas rápidas, links, comandos |
| WhatsApp (grupo da turma) | Suporte técnico, prints de erro, arquivos |
| Assistente de suporte | Ajuda quem travar enquanto Elidy continua |

**Recomendação:** Ter pelo menos 1 pessoa de suporte técnico no chat/WhatsApp para a primeira turma. Pode ser alguém que você treina antes — ou a segunda sessão de testes com amigos.

---

## Repositórios — O que Preparar Antes da Imersão

### `agente-luma` — Prioridade máxima
```
agente-luma/
├── README.md               ← Instruções claras de clone e configuração
├── .env.example            ← Variáveis necessárias (sem valores reais)
├── config/
│   └── negocio.json        ← Arquivo que o aluno preenche
├── prompts/
│   └── briefing-template.md ← Template do briefing do negócio
└── src/                    ← Código do agente (já existe na Luma)
```

### `mini-crm-kanban` — Prioridade alta
```
mini-crm-kanban/
├── README.md
├── config/
│   └── pipeline.json       ← Colunas do Kanban configuráveis
└── src/                    ← Interface do CRM
```

### `landing-page-template` — Prioridade alta
```
landing-page-template/
├── README.md
├── config/
│   └── empresa.json        ← Nome, logo, cores, textos
└── src/                    ← HTML/CSS da landing page
```

### `ors-orcamentos` — Prioridade média (bonus do Dia 1)
```
ors-orcamentos/
├── README.md
├── config/
│   └── produtos.json       ← Tabela de produtos e preços
└── src/                    ← Sistema de orçamentos (já existe)
```

---

## Checklist Pré-Imersão

### 2 semanas antes
- [ ] Repositórios organizados e testados por alguém que não é a Elidy
- [ ] README.md de cada repositório escrito em linguagem de não-programador
- [ ] Guia de instalação (Claude Code + GitHub) gravado em vídeo curto
- [ ] Página de vendas no ar
- [ ] Link de pagamento configurado

### 1 semana antes
- [ ] Enviar guia de instalação para os inscritos
- [ ] Criar grupo do WhatsApp da turma
- [ ] Testar o Zoom com alguém externo
- [ ] Confirmar presença de todos os inscritos

### 3 dias antes
- [ ] Suporte para quem não conseguiu instalar o Claude Code
- [ ] Testar os repositórios do zero — clone limpo em máquina nova
- [ ] Preparar os links que serão compartilhados no chat

### Dia anterior
- [ ] Testar Zoom, áudio e compartilhamento de tela
- [ ] Ter backup de internet (celular como roteador)
- [ ] Repositórios públicos e acessíveis

---

## Métricas de Sucesso da Imersão

| Métrica | Meta |
|---------|------|
| % de alunos com agente funcionando ao final do Dia 1 | > 80% |
| % de alunos com sistema completo ao final do Dia 2 | > 70% |
| NPS da turma (pesquisa pós-imersão) | > 8 |
| % que indicaria para outro empresário | > 70% |
| Alunos que pedem para entrar na segunda turma ou indicam | > 30% |

---

_GEN.IA SQUAD — Estrutura técnica elaborada em 2026-03-13_
_Próximo passo: preparar os repositórios para clone_
