/* ============================================================
   GEN.IA PROMPT OPS — app.js | PROMPTS vem de prompts-data.js
   ============================================================ */

/* ---------- BRAIN ICON ---------- */
const BRAIN_SVG = `<svg width="20" height="20" viewBox="0 0 64 64" fill="none" stroke="#E8C43A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M32 8c-6 0-11 4-12 9-3 1-5 4-5 7 0 2 1 4 2 5-2 2-3 4-3 7 0 4 3 7 7 8v2h22v-2c4-1 7-4 7-8 0-3-1-5-3-7 1-1 2-3 2-5 0-3-2-6-5-7-1-5-6-9-12-9z"/>
  <line x1="32" y1="17" x2="32" y2="46"/>
  <line x1="24" y1="24" x2="32" y2="28"/>
  <line x1="40" y1="24" x2="32" y2="28"/>
  <line x1="22" y1="34" x2="32" y2="38"/>
  <line x1="42" y1="34" x2="32" y2="38"/>
</svg>`;

/* ---------- AUTH ---------- */
const MASTER_PASSWORD = 'Geni@260724';
let isLoggedIn = false;

/* ---------- LIVE DATA (localStorage) ---------- */
let LIVE_PROMPTS = [];

function loadLivePrompts() {
  try {
    const saved = localStorage.getItem('genia_prompts');
    if (saved) { LIVE_PROMPTS = JSON.parse(saved); return; }
  } catch (e) { }
  LIVE_PROMPTS = [...PROMPTS];
}

function persistPrompts() {
  localStorage.setItem('genia_prompts', JSON.stringify(LIVE_PROMPTS));
}

/* ---------- STATE ---------- */
let currentCategory = '';
let currentTag = '';
let currentSort = 'score';
let activeTab = 'categorias';
let editingId = null;

/* ---------- CATEGORY COLORS ---------- */
const categoryBadgeClass = {
  "Marketing": "badge-red",
  "Eng. Prompt": "badge-blue",
  "Desenvolvimento": "badge-green",
  "Saúde": "badge-green",
  "Geral": "badge-gray",
  "Negócios": "badge-purple",
  "Educação": "badge-blue",
  "Escrita": "badge-orange",
  "Análise": "badge-yellow",
  "Design": "badge-purple",
  "Autoconhecimento": "badge-orange",
  "Produtividade": "badge-blue",
  "RH": "badge-yellow",
  "Vendas": "badge-red"
};

const CATEGORIES = ["Análise", "Autoconhecimento", "Desenvolvimento", "Design", "Educação", "Eng. Prompt", "Escrita", "Geral", "Marketing", "Negócios", "Produtividade", "RH", "Saúde", "Vendas"];

function getBadgeClass(cat) { return categoryBadgeClass[cat] || "badge-gray"; }
function getScoreClass(s) { return s >= 90 ? "score-high" : s >= 70 ? "score-good" : "score-med"; }
function getInitials(name) { return (name || 'GS').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase(); }

/* ---------- RENDER PROMPTS ---------- */
function getFilteredPrompts() {
  let list = [...LIVE_PROMPTS];
  const q = document.getElementById('searchInput').value.toLowerCase();
  if (q) list = list.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tag.toLowerCase().includes(q)
  );
  if (currentCategory) list = list.filter(p => p.category === currentCategory);
  if (currentTag) list = list.filter(p => p.tag === currentTag);
  if (currentSort === 'score') list.sort((a, b) => b.score - a.score);
  else if (currentSort === 'visits') list.sort((a, b) => b.visits - a.visits);
  else if (currentSort === 'recent') list.sort((a, b) => b.id - a.id);
  return list;
}

function renderPrompts() {
  const grid = document.getElementById('promptsGrid');
  const list = getFilteredPrompts();
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <p>Nenhum prompt encontrado.</p></div>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="prompt-card" onclick="openDetail(${p.id})">
      <div class="card-header">
        <h3 class="card-title">${p.title}</h3>
        <span class="card-score ${getScoreClass(p.score)}">${p.score}</span>
      </div>
      <div class="card-badges">
        <span class="badge ${getBadgeClass(p.category)}">${p.category}</span>
        <span class="badge badge-gray">${p.tag}</span>
      </div>
      <p class="card-description">${p.description}</p>
      <div class="card-footer">
        <div class="card-avatar brain-avatar">${BRAIN_SVG}</div>
        <span class="card-author">Time GEN.IA SQUAD</span>
      </div>
    </div>`).join('');
}

/* ---------- HOW TO USE — gerado por categoria ---------- */
function generateHowToUse(p) {
  const db = {
    'Marketing': { steps: ['Descreva seu produto ou serviço principal', 'Informe seu público-alvo e nicho de mercado', 'Apresente seus diferenciais e proposta de valor', 'Defina o canal onde será aplicado (Instagram, email, ads…)'], tips: ['Seja específico sobre o estágio do funil que quer trabalhar', 'Inclua dados reais como métricas e resultados anteriores', 'Peça variações para testar diferentes abordagens'] },
    'Vendas': { steps: ['Descreva seu produto/serviço e faixa de preço', 'Informe o perfil do cliente ideal (ICP)', 'Liste as principais objeções que você enfrenta', 'Compartilhe seu processo de vendas atual'], tips: ['Quanto mais contexto, melhor será a resposta', 'Inclua exemplos reais de situações de venda', 'Adapte as respostas ao seu estilo de comunicação'] },
    'Negócios': { steps: ['Descreva seu modelo de negócio atual', 'Informe seu estágio (ideia, MVP, crescimento, escala)', 'Apresente o problema central que quer resolver', 'Compartilhe métricas e dados relevantes'], tips: ['Use dados reais para obter análises mais precisas', 'Seja direto sobre os desafios que enfrenta', 'Adapte as sugestões à realidade do seu mercado'] },
    'Educação': { steps: ['Defina o tema ou disciplina a ser abordado', 'Informe o nível do público (iniciante, intermediário, avançado)', 'Descreva o objetivo de aprendizado', 'Especifique o formato preferido (aula, roteiro, exercício…)'], tips: ['Quanto mais específico o nível, melhor o resultado', 'Inclua exemplos práticos para facilitar a compreensão', 'Adapte o conteúdo ao seu método e contexto'] },
    'Escrita': { steps: ['Descreva o tipo de conteúdo desejado', 'Informe o tom de voz (formal, casual, técnico, persuasivo)', 'Apresente seu público-alvo', 'Compartilhe exemplos de estilo de referência'], tips: ['Forneça exemplos do estilo que admira', 'Seja claro sobre o objetivo e a plataforma do texto', 'Revise e itere sobre o resultado para ajustes finos'] },
    'Eng. Prompt': { steps: ['Descreva o objetivo final que quer alcançar com o prompt', 'Informe o modelo de IA que será utilizado', 'Apresente restrições ou requisitos específicos', 'Compartilhe exemplos de saídas desejadas'], tips: ['Teste o prompt com variações de entrada', 'Use delimitadores claros para separar seções', 'Itere adicionando mais contexto a cada rodada'] },
    'Desenvolvimento': { steps: ['Descreva a funcionalidade ou problema técnico', 'Informe a linguagem/stack utilizada', 'Apresente o contexto do projeto', 'Especifique requisitos e restrições técnicas'], tips: ['Inclua snippets de código quando relevante', 'Descreva o ambiente e dependências', 'Seja preciso sobre o comportamento esperado vs. atual'] },
    'Análise': { steps: ['Forneça os dados ou contexto a ser analisado', 'Defina o tipo de análise desejada', 'Informe o formato de saída preferido', 'Liste hipóteses ou questões específicas'], tips: ['Mais dados = análise mais precisa', 'Especifique as métricas e KPIs relevantes', 'Peça sempre por insights acionáveis'] },
    'Produtividade': { steps: ['Descreva sua rotina ou processo atual', 'Informe seus principais gargalos', 'Compartilhe ferramentas e recursos disponíveis', 'Defina seus objetivos de melhoria'], tips: ['Seja honesto sobre seus hábitos atuais', 'Foque em mudanças incrementais e sustentáveis', 'Adapte as sugestões à sua realidade pessoal'] },
    'Design': { steps: ['Descreva o projeto e seu objetivo visual', 'Informe o público-alvo e o contexto de uso', 'Apresente referências visuais que você admira', 'Defina restrições (cores, estilo, plataforma)'], tips: ['Quanto mais referências visuais, melhor', 'Seja claro sobre o sentimento que a peça deve transmitir', 'Itere pedindo variações de cada conceito'] },
    'Saúde': { steps: ['Descreva o contexto de saúde ou bem-estar que quer abordar', 'Informe o público (leigo, profissional, paciente…)', 'Apresente o objetivo da consulta ao prompt', 'Especifique limitações ou contraindicações relevantes'], tips: ['Sempre valide as informações com profissionais de saúde', 'Use o prompt como ponto de partida, não como diagnóstico', 'Seja específico para obter respostas mais direcionadas'] },
    'RH': { steps: ['Descreva a função ou processo de RH alvo', 'Informe o tamanho e cultura da empresa', 'Apresente o perfil da equipe envolvida', 'Defina o resultado esperado'], tips: ['Adapte a linguagem ao perfil cultural da organização', 'Use dados reais de performance quando disponíveis', 'Itere para alinhar ao tom de comunicação interno'] },
    'Autoconhecimento': { steps: ['Reserve um momento tranquilo e sem distrações', 'Responda com honestidade — não há respostas certas ou erradas', 'Reflita sobre cada resposta antes de avançar', 'Anote os insights que surgirem durante o processo'], tips: ['Quanto mais genuíno você for, mais valioso será o resultado', 'Evite respostas que você "acha que deveria dar"', 'Use os insights como ponto de partida para ações concretas'] },
    'Geral': { steps: ['Leia o prompt completo antes de utilizá-lo', 'Forneça contexto específico sobre sua situação', 'Adapte as variáveis ao seu caso de uso', 'Itere e refine conforme os resultados obtidos'], tips: ['Seja o mais específico possível nas entradas', 'Experimente variações para melhores resultados', 'Combine com outros prompts para potencializar'] }
  };
  const info = db[p.category] || db['Geral'];
  return `
    <div class="howto-block">
      <p class="howto-label">Como usar este prompt:</p>
      ${info.steps.map((s, i) => `<p class="howto-step"><span class="howto-num">${i + 1}.</span> ${s}</p>`).join('')}
    </div>
    <div class="howto-block">
      <p class="howto-label">Dicas para melhores resultados:</p>
      ${info.tips.map(t => `<p class="howto-tip"><span class="howto-bull">•</span> ${t}</p>`).join('')}
    </div>
    <div class="howto-hint">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Dica: Leia todo esse bloco para extrair o máximo do prompt.
    </div>`;
}

/* ---------- TOGGLE EXPAND ---------- */
function toggleExpand(areaId, btnId) {
  const area = document.getElementById(areaId);
  const btn = document.getElementById(btnId);
  const expanded = area.classList.toggle('expanded');
  btn.innerHTML = expanded
    ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="21" y2="3"/><line x1="3" y1="21" x2="14" y2="10"/></svg> Recolher`
    : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg> Expandir`;
}

/* ---------- DETAIL PAGE ---------- */
function openDetail(id) {
  const p = LIVE_PROMPTS.find(x => x.id === id);
  if (!p) return;
  const container = document.getElementById('detailContainer');

  // SVG helpers
  const SVG_COPY = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  const SVG_EXPAND = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;
  const SVG_LINK = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
  const SVG_STAR = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

  container.innerHTML = `
    <a class="detail-back" onclick="showPage('prompts'); setActiveNav('prompts')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Voltar para Prompts
    </a>

    <!-- ── HEADER CARD ── -->
    <div class="detail-header-card">
      <div class="detail-title-row">
        <h1 class="detail-title">${p.title}</h1>
        <div class="detail-actions-row">
          <button class="btn-copiar" onclick="copyPrompt(${p.id})">
            ${SVG_COPY} Copiar
          </button>
          <div class="btn-icon" title="Favoritar">${SVG_STAR}</div>
        </div>
      </div>
      <div class="card-badges" style="margin-bottom:14px">
        <span class="badge ${getBadgeClass(p.category)}">${p.category}</span>
        <span class="badge badge-gray">${p.tag}</span>
      </div>
      <p class="detail-description">${p.description}</p>
      <div class="detail-meta">
        <div class="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <strong>${p.visits.toLocaleString('pt-BR')}</strong> Views
        </div>
        <div class="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <strong>${p.favorites}</strong> Favoritos
        </div>
      </div>
    </div>

    <!-- ── PROMPT SECTION ── -->
    <div class="prompt-section-card">
      <div class="prompt-section-header">
        <span class="prompt-section-title">Prompt</span>
        <div class="prompt-tool-btns">
          <button class="btn-tool" onclick="openAI('chatgpt',${p.id})">${SVG_LINK} ChatGPT</button>
          <button class="btn-tool" onclick="openAI('claude',${p.id})">${SVG_LINK} Claude</button>
          <button class="btn-tool" onclick="openAI('grok',${p.id})">${SVG_LINK} Grok</button>
          <button class="btn-tool" id="expandPromptBtn" onclick="toggleExpand('promptContent','expandPromptBtn')">${SVG_EXPAND} Expandir</button>
          <button class="btn-tool-copy" onclick="copyPrompt(${p.id})" title="Copiar prompt">${SVG_COPY}</button>
        </div>
      </div>
      <div class="prompt-content-area" id="promptContent">${escapeHtml(p.content)}</div>
    </div>

    <!-- ── COMO USAR ── -->
    <div class="como-usar-card">
      <div class="prompt-section-header">
        <span class="prompt-section-title">Como Usar</span>
        <div class="prompt-tool-btns">
          <button class="btn-tool" id="expandHowtoBtn" onclick="toggleExpand('howtoContent','expandHowtoBtn')">${SVG_EXPAND} Expandir</button>
          <button class="btn-tool-copy" onclick="copyPrompt(${p.id})" title="Copiar prompt">${SVG_COPY}</button>
        </div>
      </div>
      <div class="como-usar-content" id="howtoContent">
        ${generateHowToUse(p)}
      </div>
    </div>
  `;

  showPage('detail');
}

function escapeHtml(t) {
  return (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


/* ---------- NAVIGATION ---------- */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.classList.add('hidden'); });
  const t = document.getElementById('page-' + name);
  if (t) { t.classList.remove('hidden'); t.classList.add('active'); }
  window.scrollTo(0, 0);
  const sm = document.getElementById('sortMenu');
  if (sm) sm.classList.remove('open');
}

function setActiveNav(page) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const el = document.getElementById('nav-' + page);
  if (el) el.classList.add('active');
}

/* ---------- FILTERS ---------- */
function filterPrompts() { renderPrompts(); }

function filterByCategory(cat) {
  currentCategory = cat; currentTag = '';
  document.querySelectorAll('#filter-categorias .pill').forEach(b =>
    b.classList.toggle('active-pill', b.textContent.trim() === (cat || 'Todos os Prompts')));
  renderPrompts();
}

function filterByTag(tag) {
  currentTag = tag; currentCategory = '';
  document.querySelectorAll('#filter-tags .pill').forEach(b =>
    b.classList.toggle('active-pill', b.textContent.trim() === (tag || 'Todas as Tags')));
  renderPrompts();
}

function switchTab(tab) {
  activeTab = tab;
  document.getElementById('filter-categorias').classList.toggle('hidden', tab !== 'categorias');
  document.getElementById('filter-tags').classList.toggle('hidden', tab !== 'tags');
  document.getElementById('tab-categorias').classList.toggle('active-tab', tab === 'categorias');
  document.getElementById('tab-tags').classList.toggle('active-tab', tab === 'tags');
}

/* ---------- SORT ---------- */
function toggleSortDropdown() { document.getElementById('sortMenu').classList.toggle('open'); }

function setSort(value, label) {
  currentSort = value;
  document.getElementById('sortLabel').textContent = label;
  document.querySelectorAll('.sort-option').forEach(o => o.classList.remove('active-sort'));
  event.target.classList.add('active-sort');
  document.getElementById('sortMenu').classList.remove('open');
  renderPrompts();
}

document.addEventListener('click', function (e) {
  const dd = document.querySelector('.sort-dropdown');
  if (dd && !dd.contains(e.target)) document.getElementById('sortMenu').classList.remove('open');
});

/* ---------- COPY / OPEN AI ---------- */
function copyPrompt(id) {
  const p = LIVE_PROMPTS.find(x => x.id === id);
  if (!p) return;
  navigator.clipboard.writeText(p.content).then(() => {
    const t = document.getElementById('copyToast');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
  });
}

function openAI(tool, id) {
  const p = LIVE_PROMPTS.find(x => x.id === id);
  if (!p) return;
  const urls = { chatgpt: 'https://chat.openai.com/', claude: 'https://claude.ai/', grok: 'https://grok.x.ai/' };
  if (urls[tool]) { navigator.clipboard.writeText(p.content); window.open(urls[tool], '_blank'); }
}

/* ============================================================
   AUTH
   ============================================================ */
function goToAdmin() {
  if (isLoggedIn) {
    renderAdmin();
    showPage('admin');
    setActiveNav('admin');
    return;
  }
  const pw = prompt('GEN.IA PROMPT OPS\n\nDigite a senha de acesso:');
  if (pw === null) return; // cancelou
  if (pw === MASTER_PASSWORD) {
    isLoggedIn = true;
    sessionStorage.setItem('genia_auth', '1');
    renderAdmin();
    showPage('admin');
    setActiveNav('admin');
  } else {
    alert('Senha incorreta. Tente novamente.');
  }
}

function logout() {
  isLoggedIn = false;
  sessionStorage.removeItem('genia_auth');
  showPage('prompts');
  setActiveNav('prompts');
}

/* ============================================================
   ADMIN PANEL
   ============================================================ */
function renderAdmin() {
  const list = [...LIVE_PROMPTS].sort((a, b) => b.score - a.score);
  const statsEl = document.getElementById('adminStats');
  const tableEl = document.getElementById('adminTable');

  statsEl.innerHTML = `
    <div class="admin-stat"><span class="admin-stat-num">${LIVE_PROMPTS.length}</span><span class="admin-stat-label">Prompts</span></div>
    <div class="admin-stat"><span class="admin-stat-num">${CATEGORIES.length}</span><span class="admin-stat-label">Categorias</span></div>
    <div class="admin-stat"><span class="admin-stat-num">${LIVE_PROMPTS.reduce((s, p) => s + p.visits, 0).toLocaleString('pt-BR')}</span><span class="admin-stat-label">Views Totais</span></div>`;

  tableEl.innerHTML = list.map(p => `
    <tr class="admin-row">
      <td><span class="admin-score ${getScoreClass(p.score)}">${p.score}</span></td>
      <td class="admin-title-cell">
        <div class="admin-prompt-title">${p.title}</div>
        <div class="admin-prompt-sub">${p.description.slice(0, 70)}…</div>
      </td>
      <td><span class="badge ${getBadgeClass(p.category)}">${p.category}</span></td>
      <td><span class="badge badge-gray">${p.tag}</span></td>
      <td>
        <div class="admin-actions">
          <button class="btn-admin-edit" onclick="openPromptModal(${p.id})">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar
          </button>
          <button class="btn-admin-del" onclick="deletePrompt(${p.id})">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            Excluir
          </button>
        </div>
      </td>
    </tr>`).join('');
}

function deletePrompt(id) {
  if (!confirm('Tem certeza que deseja excluir este prompt? Esta ação não pode ser desfeita.')) return;
  LIVE_PROMPTS = LIVE_PROMPTS.filter(p => p.id !== id);
  persistPrompts();
  renderAdmin();
  renderPrompts();
}

/* ---------- MODAL ADD / EDIT ---------- */
function openPromptModal(id = null) {
  editingId = id;
  const modal = document.getElementById('promptModal');
  const title = document.getElementById('modalTitle');
  const form = document.getElementById('promptForm');

  // Build category options
  document.getElementById('fCategory').innerHTML = CATEGORIES.map(c =>
    `<option value="${c}">${c}</option>`).join('');

  if (id !== null) {
    const p = LIVE_PROMPTS.find(x => x.id === id);
    if (!p) return;
    title.textContent = 'Editar Prompt';
    document.getElementById('fTitle').value = p.title;
    document.getElementById('fCategory').value = p.category;
    document.getElementById('fTag').value = p.tag;
    document.getElementById('fScore').value = p.score;
    document.getElementById('fDescription').value = p.description;
    document.getElementById('fContent').value = p.content;
  } else {
    title.textContent = 'Novo Prompt';
    form.reset();
    document.getElementById('fScore').value = 75;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePromptModal() {
  document.getElementById('promptModal').classList.remove('open');
  document.body.style.overflow = '';
  editingId = null;
}

function savePromptForm() {
  const title = document.getElementById('fTitle').value.trim();
  const category = document.getElementById('fCategory').value;
  const tag = document.getElementById('fTag').value.trim();
  const score = parseInt(document.getElementById('fScore').value) || 75;
  const description = document.getElementById('fDescription').value.trim();
  const content = document.getElementById('fContent').value.trim();

  if (!title || !category || !tag || !description || !content) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  if (editingId !== null) {
    // Update existing
    const idx = LIVE_PROMPTS.findIndex(p => p.id === editingId);
    if (idx !== -1) {
      LIVE_PROMPTS[idx] = { ...LIVE_PROMPTS[idx], title, category, tag, score, description, content };
    }
  } else {
    // Add new
    const newId = Math.max(...LIVE_PROMPTS.map(p => p.id), 0) + 1;
    LIVE_PROMPTS.push({
      id: newId, title, score, category, tag, description,
      author: 'Time GEN.IA SQUAD', role: 'GEN.IA SQUAD',
      visits: 0, favorites: 0, reviews: 0, since: new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      content
    });
  }

  persistPrompts();
  renderAdmin();
  renderPrompts();
  closePromptModal();

  // Toast
  const t = document.getElementById('copyToast');
  t.textContent = editingId !== null ? '✓ Prompt atualizado!' : '✓ Prompt adicionado!';
  t.classList.add('show');
  setTimeout(() => { t.classList.remove('show'); t.textContent = '✓ Prompt copiado!'; }, 2200);
}

function resetToOriginal() {
  if (!confirm('Isso vai redefinir TODOS os prompts para os valores originais. Edições serão perdidas. Confirmar?')) return;
  LIVE_PROMPTS = [...PROMPTS];
  persistPrompts();
  renderAdmin();
  renderPrompts();
}

// Close modal clicking outside
document.addEventListener('click', function (e) {
  const modal = document.getElementById('promptModal');
  if (modal && modal.classList.contains('open') && e.target === modal) closePromptModal();
});

/* ---------- INIT ---------- */
(function init() {
  loadLivePrompts();
  renderPrompts();
  if (sessionStorage.getItem('genia_auth') === '1') {
    isLoggedIn = true;
    renderAdmin();
  }
})();
