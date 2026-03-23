# GEN.IA CREATORS - Claude Code Guidelines

## Instrucao Master de Operacao

Este projeto deve ser conduzido no modelo GEN.IA SQUAD.

- A usuaria e a chefe do projeto e autoridade final.
- A IA principal atua como orquestradora, nao como executora isolada.
- Os agentes, workflows, skills e rules em `.agent/` formam o time oficial de desenvolvimento deste projeto.
- Nenhuma tarefa deve ser tratada como trabalho solo quando houver contexto suficiente para orquestrar o time.
- Se o ambiente nao permitir invocacao nativa de agentes, a IA deve emular a orquestracao consultando os artefatos de `.agent/` e declarar quais papeis estao sendo aplicados.

Este arquivo contem as instrucoes para que voce entenda, instale e execute a aplicacao GEN.IA CREATORS.

## Sobre a Aplicacao

GEN.IA CREATORS e um sistema de Inteligencia Artificial para criacao de carrosseis de Instagram. Ele utiliza:

1. **Frontend:** React + Vite + TailwindCSS
2. **Backend:** FastAPI + Python (Pillow) + integracao com Anthropic (Claude 3 Vision e Opus)

O fluxo consiste em:

1. **Fase 1:** Fazer upload de uma imagem de referencia que o backend analisa usando Claude Vision.
2. **Fase 2:** Preencher um formulario de briefing para gerar a copy.
3. **Fase 3:** Aprovar a copy estruturada e submeter imagens para geracao.
4. **Fase 4:** Geracao das imagens com Pillow no servidor, seguindo regras rigidas de identidade visual e tipografia.

## Pre-requisitos

- Node.js >= 18.x
- Python >= 3.10
- Uma chave da API da Anthropic

## Como Executar a Aplicacao Automaticamente

O script raiz `start_app.sh` lida com a instalacao de pacotes e com a inicializacao simultanea dos servidores de desenvolvimento.

Para que a aplicacao funcione completamente, voce precisa definir a chave da Anthropic no ambiente.

### Comandos para executar no terminal

```bash
export ANTHROPIC_API_KEY="sk-ant-sua-chave-aqui"
chmod +x start_app.sh
./start_app.sh
```

## Como Executar os Servicos Manualmente

Se preferir inspecionar logs separadamente ou se o script raiz nao funcionar no seu terminal, use o fluxo manual.

### Backend

```bash
export ANTHROPIC_API_KEY="sua-chave-aqui"
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd app
python download_fonts.py
uvicorn main:app --host 0.0.0.0 --port 8000
```

A API fica disponivel em `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

A interface fica disponivel em `http://localhost:5173`.

## Estrutura do Repositorio

- `/start_app.sh`: Script principal de inicializacao e build local.
- `/backend/app/main.py`: Entrypoint da API FastAPI.
- `/backend/app/services/claude.py`: Integracao com a API da Anthropic.
- `/backend/app/services/image_generator.py`: Motor principal de geracao de slides com Pillow.
- `/backend/outputs/`: Diretorio persistente para PNGs e ZIPs gerados.
- `/frontend/src/App.jsx`: Componente principal que gerencia as 4 etapas do wizard.
- `/frontend/tailwind.config.cjs`: Configuracao visual do tema GEN.IA.

## Observacoes de Desenvolvimento

- **Pillow e fontes:** A aplicacao baixa a familia Montserrat automaticamente na inicializacao via `download_fonts.py`. Se os PNGs apresentarem erro de tipografia, verifique `/backend/app/assets/fonts`.
- **Variaveis de ambiente:** Voce pode criar um arquivo `.env` na raiz do projeto ou em `/backend/` e carrega-lo via `python-dotenv`. O backend atual tambem usa `os.getenv`.

