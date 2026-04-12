#!/bin/bash

# ============================================================
# GENIA SQUAD OS — VPS SETUP SCRIPT
# OPERATOR PRO v2.0 · Abril 2026
# VPS: 134.195.90.166 · Ubuntu 24.04
# ============================================================
# Uso: bash setup-vps.sh
# Tempo estimado: 8-12 minutos
# ============================================================

set -e  # Para na primeira falha

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
GOLD='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Banner
echo ""
echo -e "${GOLD}${BOLD}"
echo "  ██████╗ ███████╗███╗   ██╗   ██╗ █████╗      ███████╗ ██████╗ ██╗   ██╗ █████╗ ██████╗ "
echo "  ██╔════╝ ██╔════╝████╗  ██║   ██║██╔══██╗     ██╔════╝██╔═══██╗██║   ██║██╔══██╗██╔══██╗"
echo "  ██║  ███╗█████╗  ██╔██╗ ██║   ██║███████║     ███████╗██║   ██║██║   ██║███████║██║  ██║"
echo "  ██║   ██║██╔══╝  ██║╚██╗██║   ██║██╔══██║     ╚════██║██║▄▄ ██║██║   ██║██╔══██║██║  ██║"
echo "  ╚██████╔╝███████╗██║ ╚████║██╗██║██║  ██║     ███████║╚██████╔╝╚██████╔╝██║  ██║██████╔╝"
echo "   ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚═╝╚═╝╚═╝  ╚═╝     ╚══════╝ ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚═════╝ "
echo -e "${NC}"
echo -e "${GOLD}  OPERATOR PRO — VPS SETUP SCRIPT v2.0${NC}"
echo -e "${GOLD}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Função de log
log() {
  echo -e "${GREEN}[✓]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[!]${NC} $1"
}

step() {
  echo ""
  echo -e "${GOLD}${BOLD}━━━ $1 ━━━${NC}"
  echo ""
}

error() {
  echo -e "${RED}[✗] ERRO: $1${NC}"
  exit 1
}

# Verificar se é root
if [ "$EUID" -ne 0 ]; then
  error "Execute como root: sudo bash setup-vps.sh"
fi

# Confirmar antes de começar
echo -e "${YELLOW}Este script vai configurar a VPS para o OPERATOR PRO.${NC}"
echo -e "VPS: ${BOLD}134.195.90.166${NC} | Ubuntu 24.04 | 2GB RAM"
echo ""
echo -e "O que será instalado:"
echo "  → Node.js 20 + npm"
echo "  → Bun runtime"
echo "  → Claude Code CLI"
echo "  → tmux"
echo "  → Estrutura de pastas do OPERATOR PRO"
echo "  → Mission Control (dependências)"
echo "  → Scripts de inicialização dos 8 agentes"
echo ""
read -p "$(echo -e ${GOLD})Continuar? (s/n): $(echo -e ${NC})" -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
  echo "Cancelado."
  exit 0
fi

# ============================================================
# FASE 1 — SISTEMA BASE
# ============================================================
step "FASE 1 — SISTEMA BASE"

log "Atualizando pacotes..."
apt-get update -qq && apt-get upgrade -y -qq
log "Sistema atualizado."

log "Instalando dependências base..."
apt-get install -y -qq \
  curl \
  git \
  tmux \
  ufw \
  wget \
  unzip \
  htop \
  nano \
  build-essential
log "Dependências instaladas."

# Firewall
log "Configurando firewall..."
ufw allow OpenSSH -q
ufw allow 3002/tcp -q  # Mission Control
ufw --force enable -q
log "Firewall configurado. Porta 3002 (Mission Control) aberta."

# ============================================================
# FASE 2 — NODE.JS
# ============================================================
step "FASE 2 — NODE.JS 20"

if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  warn "Node.js já instalado: $NODE_VERSION"
else
  log "Instalando Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - -qq
  apt-get install -y -qq nodejs
  log "Node.js instalado: $(node --version)"
fi

log "npm: $(npm --version)"

# ============================================================
# FASE 3 — BUN
# ============================================================
step "FASE 3 — BUN RUNTIME (obrigatório para Claude Code Channels)"

if command -v bun &> /dev/null; then
  warn "Bun já instalado: $(bun --version)"
else
  log "Instalando Bun..."
  curl -fsSL https://bun.sh/install | bash
  # Adicionar ao PATH
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
  echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
  echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc
  source ~/.bashrc 2>/dev/null || true
  log "Bun instalado: $(~/.bun/bin/bun --version 2>/dev/null || echo 'ok')"
fi

# ============================================================
# FASE 4 — CLAUDE CODE
# ============================================================
step "FASE 4 — CLAUDE CODE CLI"

if command -v claude &> /dev/null; then
  warn "Claude Code já instalado: $(claude --version 2>/dev/null || echo 'ok')"
else
  log "Instalando Claude Code..."
  npm install -g @anthropic-ai/claude-code
  log "Claude Code instalado: $(claude --version 2>/dev/null || echo 'ok')"
fi

# ============================================================
# FASE 5 — ESTRUTURA DE PASTAS
# ============================================================
step "FASE 5 — ESTRUTURA DE PASTAS"

GENIA_HOME="$HOME/genia-squad"

log "Criando estrutura em $GENIA_HOME..."

mkdir -p "$GENIA_HOME"
mkdir -p "$GENIA_HOME/.business"
mkdir -p "$GENIA_HOME/mission-control/public"
mkdir -p "$GENIA_HOME/mission-control/routes"
mkdir -p "$GENIA_HOME/logs"
mkdir -p "$GENIA_HOME/agents"

log "Estrutura criada:"
echo "  $GENIA_HOME/"
echo "  ├── agents/         ← perfis dos agentes"
echo "  ├── .business/      ← contexto dos negócios"
echo "  ├── mission-control/ ← dashboard"
echo "  └── logs/           ← logs das sessões"

# ============================================================
# FASE 6 — CLAUDE.MD GLOBAL
# ============================================================
step "FASE 6 — CONTEXTO GLOBAL (CLAUDE.md)"

cat > "$GENIA_HOME/CLAUDE.md" << 'CLAUDEMD'
# GEN.IA SQUAD — Contexto Global

## Quem somos
A GEN.IA SQUAD é uma empresa de sistemas operacionais de IA fundada por Elidy Izidio.
Produto principal: OPERATOR PRO — sistema multi-agente via celular + Mission Control.

## Negócios ativos
- GEN.IA SQUAD: OPERATOR PRO (produto principal), SalesFlow.IA (caso de uso B2B)
- BrasilUp: uniforme corporativo, piloto do SalesFlow.IA
- Cuore Terapia Verde: cosméticos naturais, co-fundada com Luh Menezes

## VPS
- IP: 134.195.90.166
- Ubuntu 24.04, 2GB RAM, New York

## Regras globais — invioláveis
1. Nunca publicar, commitar ou agir externamente sem aprovação explícita da Elidy
2. Nunca expor senhas, credenciais ou dados sensíveis
3. Sempre reportar antes de qualquer ação irreversível
4. Cada agente opera dentro da sua autoridade — não invadir papel de outro agente
5. O Mission Control deve ser atualizado após cada entrega

## Mission Control
- URL: http://134.195.90.166:3002
- API: POST /api/tasks/remote (para registrar tasks)
- WebSocket: ws://134.195.90.166:3002/ws (para feed ao vivo)

## Formato de ação externa (obrigatório antes de qualquer push/publicação)
⚡ AÇÃO EXTERNA DETECTADA
O que vou fazer: [descrição]
Destino: [onde vai parar]
Impacto: [o que muda]
Aprovo? S/N
CLAUDEMD

log "CLAUDE.md global criado."

# ============================================================
# FASE 7 — ARQUIVOS DE CONTEXTO DOS NEGÓCIOS
# ============================================================
step "FASE 7 — CONTEXTO DOS NEGÓCIOS"

cat > "$GENIA_HOME/.business/genia-squad.md" << 'EOF'
# GEN.IA SQUAD

## O que é
Empresa de sistemas operacionais de IA. Produto principal: OPERATOR PRO.
Fundadora: Elidy Izidio (elidyizidio@gmail.com)

## Produto principal
OPERATOR PRO — sistema multi-agente com:
- 8 agentes especializados via Telegram (24h em VPS)
- Mission Control: dashboard visual em tempo real
- Para: empresas que querem elevar o nível operacional do time inteiro

## Modelo de negócio
- Setup: R$5.000 (único por empresa)
- Mensalidade: R$3.800/mês por empresa
- Expansão: R$1.200/departamento extra

## Produtos secundários
- OPERATOR FREE: versão gratuita com funcionalidades básicas
- SalesFlow.IA: cockpit de vendas B2B (caso de uso do OPERATOR PRO)
- Imersão de Claude Code: produto educacional

## Repositório
github.com/elidyizzy/GENIA-SQUAD-OS
EOF

cat > "$GENIA_HOME/.business/brasilup.md" << 'EOF'
# BrasilUp

## O que é
Empresa de uniformes corporativos B2B.
Cliente e laboratório piloto do OPERATOR PRO / SalesFlow.IA.

## Situação atual
- SalesFlow.IA instalado como SDR no WhatsApp
- STORY-031: chat bidirecional (InReview)
- STORY-032: mídia no chat (InProgress)
- API: salesflowia-api-production.up.railway.app

## Objetivo
Aumentar conversão do pipeline de vendas via follow-up automatizado.
EOF

cat > "$GENIA_HOME/.business/cuore.md" << 'EOF'
# Cuore Terapia Verde

## O que é
Empresa de cosméticos naturais.
Co-fundada por Elidy Izidio e Luh Menezes.

## Responsabilidade da Elidy
Marketing e vendas — campanhas de tráfego pago e conteúdo.

## Objetivo
Aumentar vendas via Meta Ads e conteúdo no Instagram.
EOF

log "Contexto dos negócios criado."

# ============================================================
# FASE 8 — MISSION CONTROL (package.json)
# ============================================================
step "FASE 8 — MISSION CONTROL (dependências)"

cat > "$GENIA_HOME/mission-control/package.json" << 'EOF'
{
  "name": "genia-operator-pro-mission-control",
  "version": "2.0.0",
  "description": "GEN.IA SQUAD OPERATOR PRO — Mission Control Dashboard",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "better-sqlite3": "^9.4.3",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "ws": "^8.16.0",
    "uuid": "^9.0.1"
  }
}
EOF

log "Instalando dependências do Mission Control..."
cd "$GENIA_HOME/mission-control" && npm install --silent
log "Dependências instaladas."

# ============================================================
# FASE 9 — SCRIPTS DE INICIALIZAÇÃO DOS AGENTES
# ============================================================
step "FASE 9 — SCRIPTS DOS AGENTES"

# Script para iniciar todos os agentes
cat > "$GENIA_HOME/start-all-agents.sh" << 'STARTALL'
#!/bin/bash
# Inicia todos os 8 agentes em sessões tmux dedicadas
# Uso: bash start-all-agents.sh

GENIA_HOME="$HOME/genia-squad"
GOLD='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GOLD}GEN.IA SQUAD — Iniciando agentes...${NC}"
echo ""

# Array de agentes: "sessão:arquivo_perfil:nome_exibição"
declare -A AGENTS
AGENTS["genia"]="GENIA.md:GENIA Boss"
AGENTS["conteudo"]="FLG-TRINITY.md:FLG Trinity"
AGENTS["produto"]="PLG-TRINITY.md:PLG Trinity"
AGENTS["ads"]="ADS-TRINITY.md:ADS Trinity"
AGENTS["financeiro"]="CFO-SENIOR.md:CFO Senior"
AGENTS["squad-dev"]="SQUAD-DEV.md:Squad Dev"
AGENTS["oraculo"]="ORACULO.md:Oráculo"
AGENTS["sentinel"]="SENTINEL.md:Sentinel"

for SESSION in "${!AGENTS[@]}"; do
  IFS=':' read -r PROFILE_FILE DISPLAY_NAME <<< "${AGENTS[$SESSION]}"

  # Matar sessão existente se houver
  tmux kill-session -t "$SESSION" 2>/dev/null || true

  # Criar nova sessão
  tmux new-session -d -s "$SESSION" -x 220 -y 50

  # Navegar para o diretório do agente e iniciar Claude Code
  tmux send-keys -t "$SESSION" "cd $GENIA_HOME" Enter
  sleep 0.3
  tmux send-keys -t "$SESSION" "echo 'Iniciando $DISPLAY_NAME...'" Enter
  sleep 0.3

  # Verificar se o perfil existe
  if [ -f "$GENIA_HOME/agents/$PROFILE_FILE" ]; then
    # Copiar perfil para CLAUDE.md local da sessão (sobrescreve o global)
    tmux send-keys -t "$SESSION" "cp agents/$PROFILE_FILE .claude-agent.md" Enter
    sleep 0.3
  fi

  # Iniciar Claude Code com channels
  tmux send-keys -t "$SESSION" "claude --channels plugin:telegram@claude-plugins-official" Enter

  echo -e "${GREEN}[✓]${NC} $DISPLAY_NAME → tmux session: $SESSION"
done

echo ""
echo -e "${GOLD}Todos os agentes iniciados!${NC}"
echo ""
echo "Comandos úteis:"
echo "  tmux ls                    → listar sessões"
echo "  tmux attach -t genia       → acessar GENIA"
echo "  tmux attach -t conteudo    → acessar FLG Trinity"
echo "  tmux attach -t squad-dev   → acessar Squad Dev"
echo "  Ctrl+B, D                  → sair da sessão (sem matar)"
echo ""
STARTALL

chmod +x "$GENIA_HOME/start-all-agents.sh"
log "Script start-all-agents.sh criado."

# Script para parar todos os agentes
cat > "$GENIA_HOME/stop-all-agents.sh" << 'STOPALL'
#!/bin/bash
echo "Parando todos os agentes..."
for SESSION in genia conteudo produto ads financeiro squad-dev oraculo sentinel; do
  tmux kill-session -t "$SESSION" 2>/dev/null && echo "[✓] $SESSION parado" || echo "[-] $SESSION não estava rodando"
done
echo "Todos os agentes parados."
STOPALL

chmod +x "$GENIA_HOME/stop-all-agents.sh"
log "Script stop-all-agents.sh criado."

# Script para ver status dos agentes
cat > "$GENIA_HOME/status.sh" << 'STATUS'
#!/bin/bash
GOLD='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GOLD}GEN.IA SQUAD — Status dos Agentes${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

declare -A NAMES
NAMES["genia"]="GENIA Boss"
NAMES["conteudo"]="FLG Trinity"
NAMES["produto"]="PLG Trinity"
NAMES["ads"]="ADS Trinity"
NAMES["financeiro"]="CFO Senior"
NAMES["squad-dev"]="Squad Dev"
NAMES["oraculo"]="Oráculo"
NAMES["sentinel"]="Sentinel"

for SESSION in genia conteudo produto ads financeiro squad-dev oraculo sentinel; do
  if tmux has-session -t "$SESSION" 2>/dev/null; then
    echo -e "${GREEN}[● ONLINE]${NC} ${NAMES[$SESSION]} → tmux: $SESSION"
  else
    echo -e "${RED}[○ OFFLINE]${NC} ${NAMES[$SESSION]} → tmux: $SESSION"
  fi
done

echo ""
echo "Mission Control: http://134.195.90.166:3002"
STATUS

chmod +x "$GENIA_HOME/status.sh"
log "Script status.sh criado."

# ============================================================
# FASE 10 — SYSTEMD SERVICE (Mission Control)
# ============================================================
step "FASE 10 — AUTOSTART (Mission Control)"

cat > /etc/systemd/system/genia-mission-control.service << EOF
[Unit]
Description=GEN.IA SQUAD OPERATOR PRO — Mission Control
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$GENIA_HOME/mission-control
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
StandardOutput=append:$GENIA_HOME/logs/mission-control.log
StandardError=append:$GENIA_HOME/logs/mission-control-error.log
Environment=NODE_ENV=production
Environment=PORT=3002

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
log "Serviço systemd criado (Mission Control vai iniciar automaticamente no reboot)."
warn "O serviço só vai iniciar quando o server.js for criado pelo Claude Code."

# ============================================================
# FASE 11 — PLUGIN TELEGRAM
# ============================================================
step "FASE 11 — PLUGIN TELEGRAM"

log "Instalando plugin oficial do Telegram para Claude Code..."
claude plugin install telegram@claude-plugins-official 2>/dev/null || \
  warn "Plugin será instalado na primeira execução do Claude Code. Ignore se der erro."

# ============================================================
# FASE 12 — VERIFICAÇÃO FINAL
# ============================================================
step "FASE 12 — VERIFICAÇÃO FINAL"

echo ""
echo -e "${GOLD}${BOLD}Verificando instalações...${NC}"
echo ""

# Node.js
if command -v node &> /dev/null; then
  echo -e "${GREEN}[✓]${NC} Node.js: $(node --version)"
else
  echo -e "${RED}[✗]${NC} Node.js: FALHOU"
fi

# npm
if command -v npm &> /dev/null; then
  echo -e "${GREEN}[✓]${NC} npm: $(npm --version)"
else
  echo -e "${RED}[✗]${NC} npm: FALHOU"
fi

# Bun
if [ -f "$HOME/.bun/bin/bun" ]; then
  echo -e "${GREEN}[✓]${NC} Bun: $($HOME/.bun/bin/bun --version)"
else
  echo -e "${YELLOW}[!]${NC} Bun: recarregue o terminal (source ~/.bashrc)"
fi

# Claude Code
if command -v claude &> /dev/null; then
  echo -e "${GREEN}[✓]${NC} Claude Code: $(claude --version 2>/dev/null || echo 'instalado')"
else
  echo -e "${RED}[✗]${NC} Claude Code: FALHOU"
fi

# tmux
if command -v tmux &> /dev/null; then
  echo -e "${GREEN}[✓]${NC} tmux: $(tmux -V)"
else
  echo -e "${RED}[✗]${NC} tmux: FALHOU"
fi

# Estrutura de pastas
if [ -d "$GENIA_HOME" ]; then
  echo -e "${GREEN}[✓]${NC} Estrutura: $GENIA_HOME"
else
  echo -e "${RED}[✗]${NC} Estrutura: FALHOU"
fi

# Mission Control deps
if [ -d "$GENIA_HOME/mission-control/node_modules" ]; then
  echo -e "${GREEN}[✓]${NC} Mission Control deps: instaladas"
else
  echo -e "${RED}[✗]${NC} Mission Control deps: FALHOU"
fi

# ============================================================
# RESUMO FINAL
# ============================================================
echo ""
echo -e "${GOLD}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GOLD}${BOLD}  SETUP CONCLUÍDO — OPERATOR PRO PRONTO PARA BUILD${NC}"
echo -e "${GOLD}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BOLD}Próximos passos:${NC}"
echo ""
echo -e "  ${GOLD}1.${NC} Autenticar Claude Code:"
echo -e "     ${BLUE}claude auth login${NC}"
echo -e "     (vai abrir uma URL — abra no browser e faça login com claude.ai)"
echo ""
echo -e "  ${GOLD}2.${NC} Criar os 8 bots no Telegram:"
echo -e "     Abra @BotFather → /newbot → 8 vezes"
echo -e "     Salve os 8 tokens"
echo ""
echo -e "  ${GOLD}3.${NC} Rodar o PROMPT-OPERATOR-PRO.md no Claude Code:"
echo -e "     ${BLUE}cd ~/genia-squad && claude${NC}"
echo -e "     Cole o conteúdo do PROMPT-OPERATOR-PRO.md"
echo -e "     O Claude Code vai construir o Mission Control"
echo ""
echo -e "  ${GOLD}4.${NC} Iniciar todos os agentes:"
echo -e "     ${BLUE}bash ~/genia-squad/start-all-agents.sh${NC}"
echo ""
echo -e "  ${GOLD}5.${NC} Verificar status:"
echo -e "     ${BLUE}bash ~/genia-squad/status.sh${NC}"
echo ""
echo -e "  ${GOLD}6.${NC} Acessar Mission Control:"
echo -e "     ${BLUE}http://134.195.90.166:3002${NC}"
echo ""
echo -e "${GOLD}Estrutura criada em: $GENIA_HOME${NC}"
echo ""
