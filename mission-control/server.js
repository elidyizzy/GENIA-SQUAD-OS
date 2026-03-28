#!/usr/bin/env node
/**
 * MISSION CONTROL — Server
 * GEN.IA SQUAD OS
 *
 * Orquestra sessões reais do Claude Code CLI.
 * Roda localmente na máquina do usuário.
 *
 * Uso: node server.js [--project /caminho/do/projeto]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { WebSocketServer } = require('ws');

// ─── Config ───────────────────────────────────────────────────────────────────

const PORT = 3001;
const ARGS = process.argv.slice(2);
const PROJECT_ARG = ARGS.indexOf('--project');
let PROJECT_DIR = PROJECT_ARG !== -1 ? ARGS[PROJECT_ARG + 1] : process.cwd();
PROJECT_DIR = path.resolve(PROJECT_DIR);

// ─── Agentes → flags de contexto ──────────────────────────────────────────────

const AGENTS = {
  // ── SQUAD de desenvolvimento ──
  '@cypher':         { name: 'Cypher',      role: 'analyst',        emoji: '🔍', id: 'cypher',         isXquad: false },
  '@morpheus':       { name: 'Morpheus',    role: 'pm',             emoji: '🧭', id: 'morpheus',       isXquad: false },
  '@trinity':        { name: 'Trinity',     role: 'architect',      emoji: '⚡', id: 'trinity',        isXquad: false },
  '@neo':            { name: 'Neo',         role: 'dev',            emoji: '💻', id: 'neo',            isXquad: false },
  '@tank':           { name: 'Tank',        role: 'devops',         emoji: '🚀', id: 'tank',           isXquad: false },
  '@smith':          { name: 'Smith',       role: 'qa',             emoji: '🔬', id: 'smith',          isXquad: false },
  '@switch':         { name: 'Switch',      role: 'reviewer',       emoji: '👁',  id: 'switch',         isXquad: false },
  '@oracle':         { name: 'Oracle',      role: 'po',             emoji: '🔮', id: 'oracle',         isXquad: false },
  '@mouse':          { name: 'Mouse',       role: 'sm',             emoji: '📋', id: 'mouse',          isXquad: false },
  // ── Xquads — Advisory Board ──
  '@ray-dalio':      { name: 'Ray Dalio',   role: 'princípios',     emoji: '📊', id: 'ray-dalio',      isXquad: true },
  '@charlie-munger': { name: 'C. Munger',   role: 'modelos mentais',emoji: '🧠', id: 'charlie-munger', isXquad: true },
  '@naval-ravikant': { name: 'Naval',       role: 'alavancagem',    emoji: '⚓', id: 'naval-ravikant', isXquad: true },
  // ── Xquads — Copy Squad ──
  '@dan-kennedy':    { name: 'Dan Kennedy', role: 'direct response',emoji: '✍️', id: 'dan-kennedy',    isXquad: true },
  '@david-ogilvy':   { name: 'D. Ogilvy',  role: 'posicionamento', emoji: '🎯', id: 'david-ogilvy',   isXquad: true },
  '@gary-halbert':   { name: 'G. Halbert', role: 'copy',           emoji: '📝', id: 'gary-halbert',   isXquad: true },
  // ── Xquads — Negócio ──
  '@hormozi-offer':  { name: 'Hormozi',     role: 'ofertas',        emoji: '💰', id: 'hormozi-offer',  isXquad: true },
  '@brand-chief':    { name: 'Brand Chief', role: 'marca',          emoji: '🏷️', id: 'brand-chief',    isXquad: true },
  '@cmo-architect':  { name: 'CMO',         role: 'go-to-market',   emoji: '📣', id: 'cmo-architect',  isXquad: true },
  '@cto-architect':  { name: 'CTO',         role: 'estratégia tech',emoji: '🔧', id: 'cto-architect',  isXquad: true },
  '@sean-ellis':     { name: 'Sean Ellis',  role: 'growth',         emoji: '📈', id: 'sean-ellis',     isXquad: true },
  '@avinash-kaushik':{ name: 'A. Kaushik',  role: 'analytics',      emoji: '📉', id: 'avinash-kaushik',isXquad: true },
  '@marty-neumeier': { name: 'Neumeier',    role: 'diferenciação',  emoji: '🔵', id: 'marty-neumeier', isXquad: true },
};

// ─── Detectar agente na mensagem ──────────────────────────────────────────────

function detectAgent(message) {
  const lower = message.toLowerCase();
  for (const [cmd, agent] of Object.entries(AGENTS)) {
    if (lower.includes(cmd)) return { cmd, ...agent };
  }
  // Auto-detectar pelo contexto — SQUAD
  if (/arquitetura|design|estrutura|decisão técnica/i.test(message)) return { cmd: '@trinity', ...AGENTS['@trinity'] };
  if (/código|implementa|cria o|crie o|desenvolve/i.test(message)) return { cmd: '@neo', ...AGENTS['@neo'] };
  if (/deploy|ci|pipeline|ambiente|docker/i.test(message)) return { cmd: '@tank', ...AGENTS['@tank'] };
  if (/bug|erro|teste|qualidade|review/i.test(message)) return { cmd: '@smith', ...AGENTS['@smith'] };
  if (/story|ticket|sprint|backlog/i.test(message)) return { cmd: '@mouse', ...AGENTS['@mouse'] };
  if (/analisa|dados|métricas|relatório/i.test(message)) return { cmd: '@cypher', ...AGENTS['@cypher'] };
  if (/roadmap|prioridade|produto|vision/i.test(message)) return { cmd: '@morpheus', ...AGENTS['@morpheus'] };
  // Auto-detectar pelo contexto — XQUADS
  if (/oferta|preço|pricing|garantia|bônus/i.test(message)) return { cmd: '@hormozi-offer', ...AGENTS['@hormozi-offer'] };
  if (/copy|headline|carta de venda|anúncio|persuasão/i.test(message)) return { cmd: '@dan-kennedy', ...AGENTS['@dan-kennedy'] };
  if (/marca|brand|posicionamento|identidade/i.test(message)) return { cmd: '@brand-chief', ...AGENTS['@brand-chief'] };
  if (/growth|pmf|north star|retenção|ativação/i.test(message)) return { cmd: '@sean-ellis', ...AGENTS['@sean-ellis'] };
  if (/princípios|risco sistêmico|ciclo|alocação/i.test(message)) return { cmd: '@ray-dalio', ...AGENTS['@ray-dalio'] };
  if (/go.to.market|gtm|aquisição|canal|campanha/i.test(message)) return { cmd: '@cmo-architect', ...AGENTS['@cmo-architect'] };
  // Default: Neo
  return { cmd: '@neo', ...AGENTS['@neo'] };
}

// ─── Ler contexto do projeto ──────────────────────────────────────────────────

function readProjectContext() {
  const files = [
    '.claude/CLAUDE.md',
    '.business/context-empresa.ts',
    '.business/context-empresa.md',
    'PRIORIDADES.md',
    '.claude/HANDOVER.md',
  ];
  const context = {};
  for (const f of files) {
    const full = path.join(PROJECT_DIR, f);
    if (fs.existsSync(full)) {
      context[f] = fs.readFileSync(full, 'utf8').slice(0, 3000); // limite por arquivo
    }
  }
  return context;
}

// ─── Montar prompt enriquecido ────────────────────────────────────────────────

function buildPrompt(message, agent, context) {
  const ctxLines = Object.entries(context)
    .map(([file, content]) => `### ${file}\n${content}`)
    .join('\n\n');

  if (agent.isXquad) {
    return `Você é ${agent.name}, consultor estratégico do GEN.IA SQUAD OS (especialidade: ${agent.role}).

REGRA INVIOLÁVEL: Você é um consultor. Você RECOMENDA — você não escreve código, não cria stories, não faz commits.
Suas recomendações serão executadas pelos 9 agentes de desenvolvimento (@neo, @trinity, @tank, etc.).
Seja direto, estratégico e baseado em evidências. Fale na primeira pessoa como ${agent.name}.

${ctxLines ? `## CONTEXTO DO NEGÓCIO\n${ctxLines}\n\n` : ''}## PERGUNTA / SOLICITAÇÃO
${message}

Responda como ${agent.name} responderia: com autoridade, clareza e recomendações acionáveis.
Ao final, se relevante, indique qual agente do SQUAD deve executar cada recomendação.`;
  }

  return `Você é ${agent.name} do GEN.IA SQUAD (role: ${agent.role}).

${ctxLines ? `## CONTEXTO DO PROJETO\n${ctxLines}\n\n` : ''}## MENSAGEM DO USUÁRIO
${message}

Responda como ${agent.name}, de forma direta e técnica. Se precisar criar arquivos ou executar ações, faça.`;
}

// ─── Sessões ativas ───────────────────────────────────────────────────────────

const sessions = new Map(); // wsId → { process, agent }

function killSession(wsId) {
  const s = sessions.get(wsId);
  if (s && s.process) {
    try { s.process.kill(); } catch (e) {}
  }
  sessions.delete(wsId);
}

// ─── HTTP Server (serve o index.html) ────────────────────────────────────────

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    const htmlPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(htmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(htmlPath));
    } else {
      res.writeHead(404);
      res.end('index.html não encontrado');
    }
  } else if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      project: PROJECT_DIR,
      hasGenieOS: fs.existsSync(path.join(PROJECT_DIR, '.claude/CLAUDE.md')),
      hasBusiness: fs.existsSync(path.join(PROJECT_DIR, '.business')),
      hasPrioridades: fs.existsSync(path.join(PROJECT_DIR, 'PRIORIDADES.md')),
      agents: Object.keys(AGENTS),
      sessions: sessions.size,
    }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// ─── WebSocket Server ─────────────────────────────────────────────────────────

const wss = new WebSocketServer({ server });

// STORY-002: wss re-emite erros do HTTP server — silenciar EADDRINUSE aqui
// (já tratado pelo server.on('error')); logar outros erros
wss.on('error', (err) => {
  if (err.code !== 'EADDRINUSE') {
    console.error('[WS] Erro:', err.message);
  }
});
let wsCounter = 0;

wss.on('connection', (ws) => {
  const wsId = ++wsCounter;
  console.log(`[WS] Cliente #${wsId} conectado`);

  // Enviar status inicial
  const context = readProjectContext();
  ws.send(JSON.stringify({
    type: 'connected',
    project: PROJECT_DIR,
    hasGenieOS: !!context['.claude/CLAUDE.md'],
    hasBusiness: !!context['.business/context-empresa.ts'] || !!context['.business/context-empresa.md'],
    hasPrioridades: !!context['PRIORIDADES.md'],
    contextFiles: Object.keys(context),
  }));

  ws.on('message', (raw) => {
    let data;
    try { data = JSON.parse(raw); } catch { return; }

    if (data.type === 'message') {
      handleMessage(ws, wsId, data.content);
    } else if (data.type === 'abort') {
      killSession(wsId);
      ws.send(JSON.stringify({ type: 'aborted' }));
    } else if (data.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong' }));
    }
  });

  ws.on('close', () => {
    console.log(`[WS] Cliente #${wsId} desconectado`);
    killSession(wsId);
  });

  ws.on('error', (err) => {
    console.error(`[WS] Erro #${wsId}:`, err.message);
  });
});

// ─── Processar mensagem → spawn Claude Code ───────────────────────────────────

function handleMessage(ws, wsId, message) {
  // Matar sessão anterior se existir
  killSession(wsId);

  const agent = detectAgent(message);
  const context = readProjectContext();
  const prompt = buildPrompt(message, agent, context);

  // Notificar frontend: agente detectado, iniciando
  ws.send(JSON.stringify({
    type: 'agent_detected',
    agent: agent.name,
    role: agent.role,
    emoji: agent.emoji,
    cmd: agent.cmd,
    id: agent.id,
    isXquad: !['cypher','morpheus','trinity','neo','tank','smith','switch','oracle','mouse'].includes(agent.id),
  }));

  ws.send(JSON.stringify({ type: 'thinking_start' }));

  console.log(`[${agent.name}] Processando: "${message.slice(0, 60)}..."`);

  // Verificar se claude CLI está disponível
  const claudePath = process.platform === 'win32' ? 'claude.cmd' : 'claude';

  const proc = spawn(claudePath, [
    '--dangerously-skip-permissions',
    '--print',
    prompt,
  ], {
    cwd: PROJECT_DIR,
    env: { ...process.env },
    shell: process.platform === 'win32',
  });

  sessions.set(wsId, { process: proc, agent });

  let buffer = '';

  proc.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    // Streaming linha a linha
    const lines = buffer.split('\n');
    buffer = lines.pop(); // último fragmento incompleto
    for (const line of lines) {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({ type: 'stream', content: line + '\n' }));
      }
    }
  });

  proc.stderr.on('data', (chunk) => {
    const text = chunk.toString();
    // Filtrar mensagens de log internas do claude
    if (!text.includes('Logging') && !text.includes('API')) {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({ type: 'stream_err', content: text }));
      }
    }
    console.error(`[${agent.name}][stderr]`, text.slice(0, 200));
  });

  proc.on('close', (code) => {
    // Enviar resto do buffer
    if (buffer && ws.readyState === 1) {
      ws.send(JSON.stringify({ type: 'stream', content: buffer }));
    }
    if (ws.readyState === 1) {
      ws.send(JSON.stringify({ type: 'done', code, agent: agent.name }));
    }
    sessions.delete(wsId);
    console.log(`[${agent.name}] Concluído (code ${code})`);
  });

  proc.on('error', (err) => {
    console.error(`[${agent.name}] Erro ao spawnar claude:`, err.message);
    if (ws.readyState === 1) {
      let msg = err.message;
      if (err.code === 'ENOENT') {
        msg = 'Claude Code CLI não encontrado. Instale com: npm i -g @anthropic-ai/claude-code';
      }
      ws.send(JSON.stringify({ type: 'error', message: msg }));
    }
    sessions.delete(wsId);
  });
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

function printBanner(port) {
  console.log('\n┌─────────────────────────────────────────┐');
  console.log('│         MISSION CONTROL SERVER          │');
  console.log('│              GEN.IA SQUAD               │');
  console.log('└─────────────────────────────────────────┘\n');
  console.log(`🚀  http://localhost:${port}`);
  console.log(`📁  Projeto: ${PROJECT_DIR}`);
  console.log(`🤖  GEN.IA OS: ${fs.existsSync(path.join(PROJECT_DIR, '.claude/CLAUDE.md')) ? '✅' : '❌ não encontrado'}`);
  console.log(`🏢  .business: ${fs.existsSync(path.join(PROJECT_DIR, '.business')) ? '✅' : '❌ não encontrado'}`);
  console.log(`\nPressione Ctrl+C para parar.\n`);
}

// STORY-003: rastrear porta atual para evitar err.port undefined (Node.js não garante)
let currentPort = PORT;

function tryListen(port) {
  currentPort = port;
  server.listen(port, () => printBanner(port));
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const next = currentPort + 1;
    console.warn(`\n⚠️  Porta ${currentPort} ocupada — tentando porta ${next}...\n`);
    server.close();
    tryListen(next);
  } else {
    console.error('Erro no servidor:', err.message);
    process.exit(1);
  }
});

tryListen(PORT);

process.on('SIGINT', () => {
  console.log('\n[Mission Control] Encerrando...');
  for (const [id] of sessions) killSession(id);
  process.exit(0);
});
