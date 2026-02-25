#!/usr/bin/env node
'use strict';

/**
 * create-genia-os — CLI de setup do GEN.IA OS
 * Uso: npx create-genia-os [nome-do-projeto]
 * Sem dependências externas — Node.js puro.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ─── Cores no terminal ───────────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  magenta: '\x1b[35m',
};

function log(msg) { console.log(msg); }
function info(msg) { console.log(`${c.cyan}${msg}${c.reset}`); }
function ok(msg) { console.log(`${c.green}✓ ${msg}${c.reset}`); }
function warn(msg) { console.log(`${c.yellow}⚠ ${msg}${c.reset}`); }
function err(msg) { console.error(`${c.red}✗ ${msg}${c.reset}`); }
function bold(msg) { return `${c.bold}${msg}${c.reset}`; }

// ─── Banner ──────────────────────────────────────────────────────────────────
function banner() {
  log('');
  log(`${c.cyan}${c.bold}╔═══════════════════════════════════════════╗${c.reset}`);
  log(`${c.cyan}${c.bold}║       GEN.IA OS — Setup Wizard v1.0       ║${c.reset}`);
  log(`${c.cyan}${c.bold}║  Sistema operacional de dev com IA         ║${c.reset}`);
  log(`${c.cyan}${c.bold}╚═══════════════════════════════════════════╝${c.reset}`);
  log('');
}

// ─── Helpers de prompt ───────────────────────────────────────────────────────
function prompt(rl, question, defaultVal) {
  const hint = defaultVal ? ` ${c.gray}(${defaultVal})${c.reset}` : '';
  return new Promise((resolve) => {
    rl.question(`${c.cyan}?${c.reset} ${question}${hint}: `, (answer) => {
      resolve(answer.trim() || defaultVal || '');
    });
  });
}

function promptChoice(rl, question, choices, defaultIdx = 0) {
  log(`${c.cyan}?${c.reset} ${question}`);
  choices.forEach((ch, i) => {
    const marker = i === defaultIdx ? `${c.green}›${c.reset}` : ' ';
    log(`  ${marker} ${i + 1}. ${ch}`);
  });
  return new Promise((resolve) => {
    rl.question(`  ${c.gray}Escolha (1-${choices.length})${c.reset} [${defaultIdx + 1}]: `, (answer) => {
      const idx = parseInt(answer.trim(), 10) - 1;
      resolve((idx >= 0 && idx < choices.length) ? idx : defaultIdx);
    });
  });
}

// ─── Template substitution ───────────────────────────────────────────────────
function applyVars(content, vars) {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    result = result.split(`{{${key}}}`).join(value);
  }
  return result;
}

// ─── Copiar template recursivamente ─────────────────────────────────────────
function copyTemplate(srcDir, destDir, vars) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyTemplate(srcPath, destPath, vars);
    } else {
      const raw = fs.readFileSync(srcPath, 'utf8');
      const processed = applyVars(raw, vars);
      fs.writeFileSync(destPath, processed, 'utf8');
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  banner();

  const projectArg = process.argv[2];
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  log(`${c.gray}Responda as perguntas abaixo para configurar seu GEN.IA OS.${c.reset}`);
  log(`${c.gray}Pressione Enter para aceitar o valor padrão entre parênteses.${c.reset}`);
  log('');

  // ── Perguntas ──
  const projectName = await prompt(rl, 'Nome do projeto', projectArg || 'meu-projeto');
  const teamName    = await prompt(rl, 'Nome da equipe/empresa', 'Minha Equipe');
  const creatorName = await prompt(rl, 'Seu nome', 'Desenvolvedor');
  const githubUser  = await prompt(rl, 'GitHub username', 'usuario');
  const githubRepo  = await prompt(rl, 'Nome do repositório GitHub', projectName);

  log('');
  const langIdx = await promptChoice(rl, 'Idioma principal do projeto', ['Português do Brasil (PT-BR)', 'English (EN)'], 0);
  const language = langIdx === 0 ? 'PT-BR' : 'EN';

  log('');
  const stackIdx = await promptChoice(rl, 'Stack principal', [
    'Next.js / React',
    'Python / FastAPI',
    'Node.js / Express',
    'Flutter / Dart',
    'Outra (configurar depois)',
  ], 0);
  const stacks = ['Next.js/React', 'Python/FastAPI', 'Node.js/Express', 'Flutter/Dart', 'Personalizada'];
  const stack = stacks[stackIdx];

  log('');
  const initGit = await prompt(rl, 'Inicializar repositório git? (s/n)', 's');

  rl.close();

  // ── Validações ──
  const targetDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(targetDir)) {
    err(`Pasta '${projectName}' já existe. Escolha outro nome ou remova a pasta.`);
    process.exit(1);
  }

  const today = new Date().toISOString().split('T')[0];

  const vars = {
    PROJECT_NAME:  projectName,
    TEAM_NAME:     teamName,
    CREATOR_NAME:  creatorName,
    GITHUB_USER:   githubUser,
    GITHUB_REPO:   githubRepo,
    LANGUAGE:      language,
    STACK:         stack,
    SETUP_DATE:    today,
    VERSION:       '1.0.0',
  };

  // ── Copiar template ──
  log('');
  info('Criando estrutura do GEN.IA OS...');

  const templateDir = path.join(__dirname, '..', 'template');
  copyTemplate(templateDir, targetDir, vars);
  ok(`Projeto criado em ./${projectName}/`);

  // ── Criar docs/stories/ e .genia/session/ ──
  fs.mkdirSync(path.join(targetDir, 'docs', 'stories'), { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'docs', 'stories', '.gitkeep'), '');
  fs.mkdirSync(path.join(targetDir, '.genia', 'session'), { recursive: true });
  fs.mkdirSync(path.join(targetDir, '.genia', 'session-digests'), { recursive: true });
  fs.writeFileSync(path.join(targetDir, '.genia', 'session', '.gitkeep'), '');
  fs.writeFileSync(path.join(targetDir, '.genia', 'session-digests', '.gitkeep'), '');
  ok('Diretórios de sessão e stories criados');

  // ── Git init ──
  if (initGit.toLowerCase() !== 'n') {
    try {
      const { execSync } = require('child_process');
      execSync('git init', { cwd: targetDir, stdio: 'ignore' });
      execSync('git add .', { cwd: targetDir, stdio: 'ignore' });
      execSync(`git commit -m "chore: GEN.IA OS v1.0 — setup inicial\n\nCo-Authored-By: GEN.IA OS <genia@bedata.com.br>"`, {
        cwd: targetDir, stdio: 'ignore',
      });
      ok('Repositório git inicializado com commit inicial');
    } catch {
      warn('Git init falhou. Inicialize manualmente: git init && git add . && git commit');
    }
  }

  // ── Sucesso ──
  log('');
  log(`${c.green}${c.bold}╔═══════════════════════════════════════════╗${c.reset}`);
  log(`${c.green}${c.bold}║        GEN.IA OS pronto para uso! 🚀      ║${c.reset}`);
  log(`${c.green}${c.bold}╚═══════════════════════════════════════════╝${c.reset}`);
  log('');
  log(bold('Próximos passos:'));
  log('');
  log(`  ${c.cyan}1.${c.reset} Abra o projeto no VS Code com Claude Code:`);
  log(`     ${c.gray}cd ${projectName} && code .${c.reset}`);
  log('');
  log(`  ${c.cyan}2.${c.reset} Inicie uma conversa e chame um agente:`);
  log(`     ${c.gray}"@sm crie a primeira story do projeto"${c.reset}`);
  log('');
  log(`  ${c.cyan}3.${c.reset} Leia a documentação:`);
  log(`     ${c.gray}README.md${c.reset}`);
  log('');
  log(`${c.gray}Documentação: https://github.com/elidyizzy/GENIA-SQUAD-OS${c.reset}`);
  log('');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
