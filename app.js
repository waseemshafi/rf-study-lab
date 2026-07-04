/* ============================================================
   RF & Comms Study Lab — application engine
   Content lives in content.js (global CONTENT).
   Progress persists in localStorage.
   ============================================================ */

const STORE_KEY = 'rfstudy_v1';
const REPO = 'waseemshafi/rf-study-lab'; // topic requests are filed here as GitHub issues (visible everywhere)

const DEFAULT_STATE = {
  topics: {},        // id -> { mcq:{correct,wrong}, flash:{again,hard,good}, visited, lastSeen }
  extraTopics: [],   // user-requested topics not yet built: {name, category}
  lastView: null
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return Object.assign({}, DEFAULT_STATE, JSON.parse(raw));
  } catch (e) { console.warn('state load failed', e); }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}
function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
}
function topicState(id) {
  if (!state.topics[id]) state.topics[id] = { mcq: { correct: 0, wrong: 0 }, flash: { again: 0, hard: 0, good: 0 }, visited: 0 };
  return state.topics[id];
}

/* ---------- Mastery model ---------- */
// Combines MCQ accuracy and flashcard confidence into 0..1. Returns null if no data.
function mastery(id) {
  const t = state.topics[id];
  if (!t) return null;
  const mcqTotal = t.mcq.correct + t.mcq.wrong;
  const flashTotal = t.flash.again + t.flash.hard + t.flash.good;
  if (mcqTotal === 0 && flashTotal === 0) return null;

  let parts = [], weights = [];
  if (mcqTotal > 0) {
    const acc = t.mcq.correct / mcqTotal;
    // confidence grows with attempts (caps at ~10)
    const conf = Math.min(1, mcqTotal / 10);
    parts.push(acc); weights.push(1 + conf);
  }
  if (flashTotal > 0) {
    const score = (t.flash.good * 1 + t.flash.hard * 0.5 + t.flash.again * 0) / flashTotal;
    const conf = Math.min(1, flashTotal / 8);
    parts.push(score); weights.push(0.8 + conf);
  }
  const wsum = weights.reduce((a, b) => a + b, 0);
  return parts.reduce((a, p, i) => a + p * weights[i], 0) / wsum;
}

function masteryClass(m) {
  if (m === null) return '';
  if (m < 0.45) return 'm-weak';
  if (m < 0.75) return 'm-mid';
  return 'm-strong';
}

function overallMastery() {
  const studied = CONTENT.topics.filter(t => mastery(t.id) !== null);
  if (!studied.length) return 0;
  const sum = studied.reduce((a, t) => a + mastery(t.id), 0);
  // scale by coverage so unstudied topics keep the overall honest
  const coverage = studied.length / CONTENT.topics.length;
  return (sum / studied.length) * (0.5 + 0.5 * coverage);
}

/* ---------- Utilities ---------- */
const $ = sel => document.querySelector(sel);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
function typeset() { if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise(); }

function getTopic(id) { return CONTENT.topics.find(t => t.id === id); }

/* ============================================================
   NAVIGATION
   ============================================================ */
function buildNav(filter = '') {
  const nav = $('#nav');
  nav.innerHTML = '';
  const cats = CONTENT.categories;
  const f = filter.trim().toLowerCase();

  cats.forEach(cat => {
    const inCat = CONTENT.topics.filter(t => t.category === cat &&
      (!f || t.title.toLowerCase().includes(f) || (t.tags || []).some(tag => tag.includes(f))));
    if (!inCat.length) return;
    nav.appendChild(el('div', 'nav-cat', cat));
    inCat.forEach(t => {
      const m = mastery(t.id);
      const item = el('div', 'nav-item' + (currentTopicId === t.id ? ' active' : ''));
      item.innerHTML = `<span class="dot ${masteryClass(m)}"></span><span class="label">${t.title}</span>`;
      item.onclick = () => openTopic(t.id);
      nav.appendChild(item);
    });
  });
  if (!nav.children.length) nav.appendChild(el('div', 'empty', 'No topics match.'));
}

/* ============================================================
   ROUTING / VIEWS
   ============================================================ */
let currentTopicId = null;
let currentView = 'dashboard';

function setBreadcrumb(html) { $('#breadcrumb').innerHTML = html; }

function isMobile() { return window.innerWidth <= 620; }
function setSidebar(open) {
  $('#sidebar').classList.toggle('collapsed', !open);
  document.body.classList.toggle('nav-open', open && isMobile());
}
function maybeCloseSidebar() { if (isMobile()) setSidebar(false); }

function openTopic(id) {
  currentTopicId = id;
  currentView = 'topic';
  const t = topicState(id);
  t.visited = (t.visited || 0) + 1;
  saveState();
  buildNav($('#search').value);
  renderTopic(id);
  maybeCloseSidebar();
  $('#content').scrollTop = 0;
}

function showView(view) {
  currentView = view;
  currentTopicId = null;
  buildNav($('#search').value);
  if (view === 'dashboard') renderDashboard();
  else if (view === 'index') renderIndex();
  else if (view === 'topiclist') renderTopicList();
  maybeCloseSidebar();
  $('#content').scrollTop = 0;
}

/* ============================================================
   TOPIC RENDER
   ============================================================ */
const TAB_DEFS = [
  { key: 'explanation', label: 'Learn', icon: '📖' },
  { key: 'diagram', label: 'Diagrams', icon: '📐' },
  { key: 'equations', label: 'Equations', icon: '📗' },
  { key: 'derivation', label: 'Derivation', icon: '✍️' },
  { key: 'flashcards', label: 'Flashcards', icon: '🎴' },
  { key: 'mcqs', label: 'MCQ', icon: '❓' },
  { key: 'numericals', label: 'Numerical', icon: '🧮' },
  { key: 'code', label: 'Code', icon: '💻' },
  { key: 'realWorld', label: 'Real World', icon: '🌍' }
];

function hasTabContent(t, key) {
  // "explanation" tab shows if any of intro/sections/explanation/keyPoints/prereqs exist
  if (key === 'explanation') {
    return !!(t.intro || t.explanation || (t.sections && t.sections.length) ||
              (t.keyPoints && t.keyPoints.length) || (t.prerequisites && t.prerequisites.length));
  }
  // "diagram" tab shows if there are computed figures OR legacy SVGs
  if (key === 'diagram') {
    return !!((typeof CONTENT_FIG !== 'undefined' && CONTENT_FIG[t.id] && CONTENT_FIG[t.id].length) ||
              (typeof FIG !== 'undefined' && FIG.map[t.id]) || t.diagram);
  }
  // "code" tab shows if code exists for this topic
  if (key === 'code') {
    return !!(typeof CONTENT_CODE !== 'undefined' && CONTENT_CODE[t.id] && (CONTENT_CODE[t.id].matlab || CONTENT_CODE[t.id].python));
  }
  const v = t[key];
  if (v == null) return false;
  if (Array.isArray(v)) return v.length > 0;
  return String(v).trim().length > 0;
}

function renderTopic(id) {
  const t = getTopic(id);
  const c = $('#content');
  setBreadcrumb(`<b>${t.category}</b> › ${t.title}`);

  const tabs = TAB_DEFS.filter(td => hasTabContent(t, td.key));
  let activeTab = tabs[0] ? tabs[0].key : null;

  c.innerHTML = '';
  const wrap = el('div', 'container');
  wrap.innerHTML = `<h2 class="page-title">${t.title}</h2>
    <p class="subtitle">${t.summary || ''}</p>`;

  const tabBar = el('div', 'tabs');
  tabs.forEach(td => {
    const b = el('button', 'tab' + (td.key === activeTab ? ' active' : ''), `${td.icon} ${td.label}`);
    b.onclick = () => {
      tabBar.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      renderTabBody(t, td.key, body);
    };
    tabBar.appendChild(b);
  });
  wrap.appendChild(tabBar);

  const body = el('div', 'tab-body');
  wrap.appendChild(body);
  c.appendChild(wrap);
  renderTabBody(t, activeTab, body);
}

function renderTabBody(t, key, body) {
  body.innerHTML = '';
  switch (key) {
    case 'explanation': renderExplanation(t, body); break;
    case 'diagram': renderDiagram(t, body); break;
    case 'equations': renderEquations(t, body); break;
    case 'code': renderCode(t, body); break;
    case 'derivation': renderDerivation(t, body); break;
    case 'flashcards': renderFlashcards(t, body); break;
    case 'mcqs': renderMCQs(t, body); break;
    case 'numericals': renderNumericals(t, body); break;
    case 'realWorld': renderRealWorld(t, body); break;
  }
  typeset();
}

function renderExplanation(t, body) {
  // "For dummies" plain-English intro (shown first)
  if (typeof CONTENT_DUMMIES !== 'undefined' && CONTENT_DUMMIES[t.id]) {
    const d = el('div', 'panel dummies-panel');
    d.innerHTML = '<h3>🧸 In plain English <span class="dummies-tag">for dummies</span></h3>' +
      '<div class="dummies-body">' + CONTENT_DUMMIES[t.id] + '</div>';
    body.appendChild(d);
  }

  // Prerequisites
  if (t.prerequisites && t.prerequisites.length) {
    const pr = el('div', 'panel prereq-panel');
    pr.innerHTML = '<h3>🎓 Prerequisites — know these first</h3>';
    const wrap = el('div', 'prereq-chips');
    t.prerequisites.forEach(pid => {
      const pt = getTopic(pid);
      const m = mastery(pid);
      const chip = el('span', 'prereq-chip' + (m !== null && m >= 0.75 ? ' ok' : ''),
        (m !== null && m >= 0.75 ? '✓ ' : '→ ') + (pt ? pt.title : pid));
      if (pt) chip.onclick = () => openTopic(pid);
      wrap.appendChild(chip);
    });
    pr.appendChild(wrap);
    body.appendChild(pr);
  }

  // Intro
  if (t.intro) {
    const p = el('div', 'panel');
    p.innerHTML = t.intro;
    body.appendChild(p);
  }

  // Figures for this topic (computed + schematic), numbered and embedded inline with the reading
  const figures = collectFigures(t);
  if (figures.length) {
    const names = figures.map((f, i) => 'Figure ' + (i + 1) + (f.title ? ' (' + f.title + ')' : '')).join(', ');
    body.appendChild(el('div', 'callout tip',
      '📊 <b>' + figures.length + ' diagram' + (figures.length > 1 ? 's' : '') + '</b> accompany this topic — ' + names +
      '. They are embedded below as you read, and shown full-size &amp; interactive in the <b>📐 Diagrams</b> tab.'));
  }

  // Structured sections, with figures distributed evenly between them
  if (t.sections && t.sections.length) {
    const S = t.sections.length, F = figures.length;
    // target section index after which each figure appears
    const figAt = {};
    figures.forEach((f, k) => { const pos = Math.min(S - 1, Math.floor((k + 0.5) * S / Math.max(F, 1))); (figAt[pos] = figAt[pos] || []).push(k); });
    t.sections.forEach((s, i) => {
      const sec = el('div', 'panel section');
      sec.innerHTML = `<h3><span class="sec-num">${i + 1}</span>${s.h}</h3>` + (s.html || '');
      body.appendChild(sec);
      (figAt[i] || []).forEach(k => renderFigurePanel(body, figures[k], k + 1, { compact: true }));
    });
  } else if (t.explanation) {
    const p = el('div', 'panel');
    p.innerHTML = t.explanation;
    body.appendChild(p);
    figures.forEach((f, k) => renderFigurePanel(body, f, k + 1, { compact: true }));
  } else if (figures.length) {
    figures.forEach((f, k) => renderFigurePanel(body, f, k + 1, { compact: true }));
  }

  if (!t.intro && !t.explanation && !(t.sections && t.sections.length) && !figures.length) {
    body.appendChild(el('div', 'panel', '<p class="empty">No explanation yet.</p>'));
  }

  // Key points
  if (t.keyPoints && t.keyPoints.length) {
    const kp = el('div', 'panel');
    kp.innerHTML = '<h3>🔑 Key points to remember</h3>';
    const ul = el('ul', 'key-points');
    t.keyPoints.forEach(k => ul.appendChild(el('li', '', k)));
    kp.appendChild(ul);
    body.appendChild(kp);
  }

  // Related
  if (t.related && t.related.length) {
    const r = el('div', 'panel');
    r.innerHTML = '<h3>🔗 Related / suggested next</h3>';
    t.related.forEach(rid => {
      const rt = getTopic(rid);
      const chip = el('span', 'suggest-chip', '→ ' + (rt ? rt.title : rid));
      if (rt) chip.onclick = () => openTopic(rid);
      r.appendChild(chip);
    });
    body.appendChild(r);
  }
}

// Gather every figure for a topic: computed/interactive first, then schematic SVGs. Numbered in this order everywhere.
function collectFigures(t) {
  const out = [];
  const specs = (typeof CONTENT_FIG !== 'undefined' && CONTENT_FIG[t.id]) ||
                (typeof FIG !== 'undefined' && FIG.map[t.id]) || [];
  specs.forEach(s => out.push({ kind: 'fig', spec: s, title: s.title || '', caption: s.caption, explain: s.explain }));
  if (t.diagram) {
    (Array.isArray(t.diagram) ? t.diagram : [t.diagram]).forEach(d => {
      out.push({ kind: 'svg', svg: d.svg || d, title: (d && d.title) || 'Schematic diagram', caption: d && d.caption });
    });
  }
  return out;
}

// Render one numbered figure. compact=true (Learn tab) drops the long explanation to keep reading tight.
function renderFigurePanel(container, entry, num, opts) {
  opts = opts || {};
  const p = el('div', 'panel figure-panel');
  p.appendChild(el('div', 'figure-label', 'Figure ' + num + (entry.title ? ' — ' + entry.title : '')));
  container.appendChild(p); // attach before FIG.render so animated figures detect they are on screen
  if (entry.kind === 'fig') {
    const spec = Object.assign({}, entry.spec);
    spec.title = null;                    // number label already shown above
    if (opts.compact) spec.explain = null; // keep it short inline; full explanation lives in the Diagrams tab
    try { FIG.render(p, spec); } catch (e) { p.appendChild(el('div', 'diagram-caption', 'Figure error: ' + e.message)); }
  } else {
    const w = el('div', 'diagram-wrap'); w.innerHTML = entry.svg; p.appendChild(w);
    if (entry.caption) p.appendChild(el('div', 'diagram-caption', entry.caption));
  }
  return p;
}

function renderEquations(t, body) {
  body.appendChild(el('p', 'subtitle', 'Tap any equation for a full from-scratch derivation — each step explained.'));
  const overrides = (typeof CONTENT_DERIV !== 'undefined' && CONTENT_DERIV[t.id]) || null;
  t.equations.forEach((eq, i) => {
    const card = el('div', 'eq-card');
    const head = el('div', 'eq-head');
    head.innerHTML = `<div class="eq-title-wrap">
        <div class="eq-name">${eq.title || 'Result'}</div>
        <div class="eq-tex">${eq.tex || ''}</div>
      </div><span class="eq-toggle">show derivation ▾</span>`;
    const derivHtml = (overrides && overrides[i]) || eq.derivation || '<p class="empty">Derivation coming soon.</p>';
    const deriv = el('div', 'eq-deriv', derivHtml);
    head.onclick = () => {
      card.classList.toggle('open');
      head.querySelector('.eq-toggle').textContent = card.classList.contains('open') ? 'hide derivation ▴' : 'show derivation ▾';
      typeset();
    };
    card.append(head, deriv);
    body.appendChild(card);
  });
}

function renderDiagram(t, body) {
  const figures = collectFigures(t);
  if (!figures.length) { body.appendChild(el('div', 'panel', '<p class="empty">No diagram yet.</p>')); return; }
  body.appendChild(el('p', 'subtitle', 'Interactive figures — drag the sliders to build intuition. (Referenced as Figure 1–' + figures.length + ' in the Learn tab.)'));
  figures.forEach((f, k) => renderFigurePanel(body, f, k + 1, { compact: false }));
}

function renderCode(t, body) {
  const code = CONTENT_CODE[t.id] || {};
  const langs = [];
  if (code.python) langs.push({ key: 'python', label: 'Python', code: code.python });
  if (code.matlab) langs.push({ key: 'matlab', label: 'MATLAB', code: code.matlab });

  body.appendChild(el('p', 'subtitle', 'Runnable demos of this concept. Switch language, copy, and run locally (Python needs numpy/matplotlib).'));
  if (code.note) body.appendChild(el('div', 'callout', code.note));

  const panel = el('div', 'panel');
  const bar = el('div', 'code-bar');
  const langBtns = el('div', 'code-langs');
  const copyBtn = el('button', 'btn ghost sm', 'Copy');
  bar.append(langBtns, copyBtn);
  const pre = el('pre', 'code-block');
  const codeEl = el('code');
  pre.appendChild(codeEl);

  let active = langs[0].key;
  function show(key) {
    active = key;
    const l = langs.find(x => x.key === key);
    codeEl.textContent = l.code;
    langBtns.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.k === key));
  }
  langs.forEach(l => {
    const b = el('button', 'code-lang', l.label);
    b.dataset.k = l.key;
    b.onclick = () => show(l.key);
    langBtns.appendChild(b);
  });
  copyBtn.onclick = () => {
    const l = langs.find(x => x.key === active);
    navigator.clipboard && navigator.clipboard.writeText(l.code);
    copyBtn.textContent = 'Copied ✓';
    setTimeout(() => copyBtn.textContent = 'Copy', 1200);
  };
  panel.append(bar, pre);
  body.appendChild(panel);
  show(active);
}

function renderDerivation(t, body) {
  const p = el('div', 'panel');
  p.innerHTML = t.derivation;
  body.appendChild(p);
}

function renderRealWorld(t, body) {
  const p = el('div', 'panel');
  p.innerHTML = t.realWorld;
  body.appendChild(p);
}

/* ---------- Flashcards ---------- */
function renderFlashcards(t, body) {
  const cards = t.flashcards;
  let idx = 0;
  const wrap = el('div', 'flash-deck');
  const counter = el('div', 'flash-counter');
  const cardEl = el('div', 'flashcard');

  function draw() {
    const card = cards[idx];
    cardEl.classList.remove('flipped');
    cardEl.innerHTML = `<div class="flash-inner">
      <div class="flash-face flash-front"><span class="q-label">Prompt</span><div class="content">${card.front}</div><span class="flash-hint">click to flip</span></div>
      <div class="flash-face flash-back"><span class="q-label">Answer</span><div class="content">${card.back}</div><span class="flash-hint">click to flip</span></div>
    </div>`;
    counter.textContent = `Card ${idx + 1} of ${cards.length}`;
    typeset();
  }
  cardEl.onclick = () => cardEl.classList.toggle('flipped');

  const rate = el('div', 'flash-rate');
  const mkRate = (cls, label, key) => {
    const b = el('button', 'rate-btn ' + cls, label);
    b.onclick = () => {
      topicState(t.id).flash[key]++;
      saveState(); buildNav($('#search').value);
      next();
    };
    return b;
  };
  rate.append(mkRate('again', '😕 Again', 'again'), mkRate('hard', '🤔 Hard', 'hard'), mkRate('good', '😎 Got it', 'good'));

  function next() { idx = (idx + 1) % cards.length; draw(); }
  function prev() { idx = (idx - 1 + cards.length) % cards.length; draw(); }

  const controls = el('div', 'flash-controls');
  const bPrev = el('button', 'btn ghost sm', '‹ Prev'); bPrev.onclick = prev;
  const bNext = el('button', 'btn ghost sm', 'Next ›'); bNext.onclick = next;
  const bShuffle = el('button', 'btn ghost sm', '🔀 Shuffle');
  bShuffle.onclick = () => { for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; } idx = 0; draw(); };
  controls.append(bPrev, counter, bNext);

  wrap.append(cardEl, rate, controls, bShuffle);
  const hint = el('p', 'subtitle', 'Rate each card honestly — "Again"/"Hard"/"Got it" feed your mastery score and weakness tracker.');
  body.append(hint, wrap);
  draw();
}

/* ---------- MCQ ---------- */
function renderMCQs(t, body) {
  const info = el('p', 'subtitle', 'Answers are scored into your weakness tracker. Wrong answers flag the topic for review.');
  body.appendChild(info);
  t.mcqs.forEach((q, qi) => {
    const p = el('div', 'panel mcq');
    p.appendChild(el('div', 'mcq-q', `Q${qi + 1}. ${q.q}`));
    const opts = el('div', 'mcq-opts');
    const explain = el('div', 'mcq-explain', `<b>Explanation:</b> ${q.explain || ''}`);
    let answered = false;
    q.options.forEach((opt, oi) => {
      const o = el('div', 'mcq-opt', opt);
      o.onclick = () => {
        if (answered) return;
        answered = true;
        opts.querySelectorAll('.mcq-opt').forEach(x => x.classList.add('disabled'));
        const correct = oi === q.answer;
        o.classList.add(correct ? 'correct' : 'wrong');
        if (!correct) opts.children[q.answer].classList.add('correct');
        topicState(t.id).mcq[correct ? 'correct' : 'wrong']++;
        saveState(); buildNav($('#search').value);
        explain.classList.add('show');
        typeset();
      };
      opts.appendChild(o);
    });
    p.append(opts, explain);
    body.appendChild(p);
  });
}

/* ---------- Numerical ---------- */
function renderNumericals(t, body) {
  t.numericals.forEach((n, ni) => {
    const p = el('div', 'panel numerical');
    p.appendChild(el('div', 'n-q', `Problem ${ni + 1}. ${n.q}`));
    const sol = el('div', 'solution', n.solution);
    const b = el('button', 'btn ghost sm', 'Show worked solution');
    b.onclick = () => { sol.classList.toggle('show'); b.textContent = sol.classList.contains('show') ? 'Hide solution' : 'Show worked solution'; typeset(); };
    p.append(b, sol);
    body.appendChild(p);
  });
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard() {
  setBreadcrumb('<b>Dashboard</b>');
  const c = $('#content');
  c.innerHTML = '';
  const wrap = el('div', 'container');

  const studied = CONTENT.topics.filter(t => mastery(t.id) !== null);
  const weak = studied.map(t => ({ t, m: mastery(t.id) })).sort((a, b) => a.m - b.m);
  const totalMcq = Object.values(state.topics).reduce((a, t) => a + t.mcq.correct + t.mcq.wrong, 0);
  const totalCorrect = Object.values(state.topics).reduce((a, t) => a + t.mcq.correct, 0);
  const acc = totalMcq ? Math.round(100 * totalCorrect / totalMcq) : 0;

  wrap.innerHTML = `<h2 class="page-title">📊 Your Dashboard</h2>
    <p class="subtitle">Progress, weaknesses, and what to study next.</p>
    <div class="dash-grid">
      <div class="stat-card"><div class="num">${studied.length}<span style="font-size:16px;color:var(--text-dim)">/${CONTENT.topics.length}</span></div><div class="lbl">Topics started</div></div>
      <div class="stat-card"><div class="num">${Math.round(overallMastery()*100)}%</div><div class="lbl">Overall mastery</div></div>
      <div class="stat-card"><div class="num">${totalMcq}</div><div class="lbl">MCQs attempted</div></div>
      <div class="stat-card"><div class="num">${acc}%</div><div class="lbl">MCQ accuracy</div></div>
    </div>`;

  // Weakness list
  const weakPanel = el('div', 'panel');
  weakPanel.innerHTML = '<h3>🎯 Focus areas (weakest first)</h3>';
  if (!weak.length) {
    weakPanel.appendChild(el('p', 'empty', 'Study a few topics (try MCQs and flashcards) and your weak spots will appear here.'));
  } else {
    weak.slice(0, 8).forEach(({ t, m }) => {
      const row = el('div', 'weak-row');
      const name = el('div', 'name', t.title);
      name.onclick = () => openTopic(t.id);
      const bar = el('div', 'bar mastery-bar');
      bar.innerHTML = `<div class="bar-fill" style="width:${Math.round(m*100)}%"></div>`;
      const pct = el('div', 'mastery-pct', Math.round(m * 100) + '%');
      row.append(el('span', 'dot ' + masteryClass(m)), name, bar, pct);
      weakPanel.appendChild(row);
    });
  }
  wrap.appendChild(weakPanel);

  // Improve weakness — actionable
  if (weak.length) {
    const imp = el('div', 'panel');
    const worst = weak[0];
    imp.innerHTML = `<h3>💪 Improve your weakest area</h3>
      <div class="callout warn">Your weakest topic right now is <b>${worst.t.title}</b> (${Math.round(worst.m*100)}% mastery).</div>`;
    const btns = el('div');
    const b1 = el('button', 'btn', 'Review flashcards →'); b1.onclick = () => openTopic(worst.t.id);
    const b2 = el('button', 'btn ghost', 'Retry its MCQs'); b2.style.marginLeft = '8px'; b2.onclick = () => openTopic(worst.t.id);
    btns.append(b1, b2);
    imp.appendChild(btns);
    wrap.appendChild(imp);
  }

  // Suggestions — related topics to weak/studied ones and unstudied
  const sug = el('div', 'panel');
  sug.innerHTML = '<h3>🧭 Suggested topics to study next</h3>';
  const suggestions = buildSuggestions(weak);
  if (!suggestions.length) sug.appendChild(el('p', 'empty', 'Start studying to get tailored suggestions.'));
  suggestions.forEach(t => {
    const chip = el('span', 'suggest-chip', '📌 ' + t.title);
    chip.onclick = () => openTopic(t.id);
    sug.appendChild(chip);
  });
  wrap.appendChild(sug);

  c.appendChild(wrap);
}

function buildSuggestions(weak) {
  const out = [];
  const seen = new Set();
  // 1. Related topics of weakest studied topics
  weak.slice(0, 3).forEach(({ t }) => (t.related || []).forEach(rid => {
    if (!seen.has(rid) && getTopic(rid)) { seen.add(rid); out.push(getTopic(rid)); }
  }));
  // 2. Unstudied topics (foundational order)
  CONTENT.topics.forEach(t => {
    if (mastery(t.id) === null && !seen.has(t.id)) { seen.add(t.id); out.push(t); }
  });
  return out.slice(0, 10);
}

/* ============================================================
   INDEX / BROWSE — search + multiple ways to organize topics
   ============================================================ */
let indexMode = 'category';
function renderIndex() {
  setBreadcrumb('<b>Browse</b>');
  const c = $('#content'); c.innerHTML = '';
  const wrap = el('div', 'container');
  wrap.innerHTML = `<h2 class="page-title">📇 Browse &amp; Find</h2>
    <p class="subtitle">All ${CONTENT.topics.length} topics — search across titles, summaries and tags, or switch how they’re organized.</p>`;

  const searchWrap = el('div', 'index-search');
  searchWrap.innerHTML = `<input type="text" id="index-q" placeholder="🔎 Search topics, summaries, tags…" autocomplete="off">`;
  wrap.appendChild(searchWrap);

  const modes = [['category', 'By Category'], ['az', 'A–Z'], ['tag', 'By Tag']];
  const toggle = el('div', 'index-modes');
  modes.forEach(m => {
    const b = el('button', 'index-mode' + (indexMode === m[0] ? ' active' : ''), m[1]);
    b.onclick = () => { indexMode = m[0]; draw(); };
    toggle.appendChild(b);
  });
  wrap.appendChild(toggle);

  const results = el('div', 'index-results');
  wrap.appendChild(results);
  c.appendChild(wrap);

  const norm = s => (s || '').toLowerCase();
  function matches(t, q) {
    if (!q) return true; q = norm(q);
    return norm(t.title).includes(q) || norm(t.summary).includes(q) ||
           norm(t.category).includes(q) || (t.tags || []).some(tag => norm(tag).includes(q));
  }
  function row(t) {
    const m = mastery(t.id);
    const r = el('div', 'index-item');
    r.innerHTML = `<span class="dot ${masteryClass(m)}"></span>
      <span class="ix-title">${t.title}</span>
      <span class="ix-cat">${t.category}</span>`;
    r.onclick = () => openTopic(t.id);
    return r;
  }
  function firstLetter(title) {
    const s = title.replace(/^(the |a |an )/i, '');
    const ch = s[0].toUpperCase();
    return /[A-Z]/.test(ch) ? ch : '#';
  }

  function draw() {
    toggle.querySelectorAll('.index-mode').forEach((b, i) => b.classList.toggle('active', modes[i][0] === indexMode));
    const q = $('#index-q').value;
    const list = CONTENT.topics.filter(t => matches(t, q));
    results.innerHTML = '';

    if (indexMode === 'tag') {
      // tag cloud (from the full set), then the current filtered list
      const tagMap = {};
      CONTENT.topics.forEach(t => (t.tags || []).forEach(tag => { (tagMap[tag] = tagMap[tag] || []).push(t); }));
      const cloud = el('div', 'tag-cloud');
      Object.keys(tagMap).sort().forEach(tag => {
        const chip = el('span', 'tag-chip', tag + ' <b>' + tagMap[tag].length + '</b>');
        chip.onclick = () => { $('#index-q').value = tag; draw(); };
        cloud.appendChild(chip);
      });
      results.appendChild(el('div', 'index-group-h', 'Tags — click to filter'));
      results.appendChild(cloud);
    }

    if (!list.length) { results.appendChild(el('div', 'empty', 'No topics match “' + q + '”.')); return; }

    if (indexMode === 'category') {
      CONTENT.categories.forEach(cat => {
        const inCat = list.filter(t => t.category === cat);
        if (!inCat.length) return;
        results.appendChild(el('div', 'index-group-h', cat + ' <span class="pill">' + inCat.length + '</span>'));
        inCat.forEach(t => results.appendChild(row(t)));
      });
    } else if (indexMode === 'az') {
      const sorted = [...list].sort((a, b) => a.title.replace(/^(the |a |an )/i, '').localeCompare(b.title.replace(/^(the |a |an )/i, '')));
      let letter = '';
      sorted.forEach(t => {
        const L = firstLetter(t.title);
        if (L !== letter) { letter = L; results.appendChild(el('div', 'index-group-h index-letter', letter)); }
        results.appendChild(row(t));
      });
    } else { // tag mode: show current matches as a flat list under the cloud
      results.appendChild(el('div', 'index-group-h', (q ? 'Matching “' + q + '”' : 'All topics') + ' <span class="pill">' + list.length + '</span>'));
      list.forEach(t => results.appendChild(row(t)));
    }
  }
  $('#index-q').addEventListener('input', draw);
  draw();
}

/* ============================================================
   TOPIC LIST (master coverage list + add requests)
   ============================================================ */
function renderTopicList() {
  setBreadcrumb('<b>Topic List</b>');
  const c = $('#content');
  c.innerHTML = '';
  const wrap = el('div', 'container');
  wrap.innerHTML = `<h2 class="page-title">📚 Topic List</h2>
    <p class="subtitle">Everything covered in this tutorial. Add topics you want built next — they show as "requested".</p>`;

  // Add box
  const add = el('div', 'tl-add');
  add.innerHTML = `<input id="new-topic" placeholder="New topic to request (e.g. OFDM, QAM, Kalman filter)…">
    <input id="new-topic-cat" placeholder="Category (optional)" style="max-width:200px">
    <button class="btn" id="add-topic-btn">+ Request</button>`;
  wrap.appendChild(add);
  wrap.appendChild(el('p', 'subtitle',
    'Requests open a pre-filled <b>GitHub issue</b> so they sync everywhere and reach the author — click “Submit new issue” on the page that opens. ' +
    '<a href="https://github.com/' + REPO + '/issues?q=is%3Aissue+label%3Atopic-request" target="_blank" style="color:var(--accent)">View all requests on GitHub →</a>'));

  // Covered, grouped by category
  const coveredCount = CONTENT.topics.length;
  const reqCount = state.extraTopics.length;
  wrap.appendChild(el('p', 'subtitle', `<span class="badge covered">${coveredCount} covered</span> <span class="badge requested" style="margin-left:8px">${reqCount} requested</span>`));

  CONTENT.categories.forEach(cat => {
    const inCat = CONTENT.topics.filter(t => t.category === cat);
    if (!inCat.length) return;
    const g = el('div', 'tl-group');
    g.appendChild(el('h3', '', cat));
    inCat.forEach(t => {
      const m = mastery(t.id);
      const item = el('div', 'tl-item covered');
      item.innerHTML = `<span class="dot ${masteryClass(m)}"></span>
        <span class="tl-name">${t.title}</span>
        ${m !== null ? `<span class="pill">${Math.round(m*100)}% mastery</span>` : ''}
        <span class="badge covered">covered</span>`;
      item.querySelector('.tl-name').style.cursor = 'pointer';
      item.querySelector('.tl-name').onclick = () => openTopic(t.id);
      g.appendChild(item);
    });
    wrap.appendChild(g);
  });

  // Requested topics
  if (state.extraTopics.length) {
    const g = el('div', 'tl-group');
    g.appendChild(el('h3', '', 'Requested — to be built'));
    state.extraTopics.forEach((rt, i) => {
      const item = el('div', 'tl-item requested');
      item.innerHTML = `<span class="tl-name">${rt.name}${rt.category ? ` <span class="pill">${rt.category}</span>` : ''}</span>
        <span class="badge requested">requested</span>`;
      const del = el('button', 'btn ghost sm', '✕');
      del.onclick = () => { state.extraTopics.splice(i, 1); saveState(); renderTopicList(); };
      item.appendChild(del);
      g.appendChild(item);
    });
    wrap.appendChild(g);
  }

  c.appendChild(wrap);

  $('#add-topic-btn').onclick = () => {
    const name = $('#new-topic').value.trim();
    if (!name) return;
    const category = $('#new-topic-cat').value.trim();
    state.extraTopics.push({ name, category });
    saveState();
    // File it as a GitHub issue so the request is stored in the cloud (visible on every device + to the author)
    const title = encodeURIComponent('[Topic request] ' + name);
    const body = encodeURIComponent('**Requested topic:** ' + name + (category ? '\n**Suggested category:** ' + category : '') + '\n\n_Sent from the RF & Comms Study Lab app._');
    const url = 'https://github.com/' + REPO + '/issues/new?labels=topic-request&title=' + title + '&body=' + body;
    window.open(url, '_blank', 'noopener');
    renderTopicList();
  };
  $('#new-topic').addEventListener('keydown', e => { if (e.key === 'Enter') $('#add-topic-btn').click(); });
}

/* ============================================================
   INIT / EVENTS
   ============================================================ */
function updateOverallBar() {
  const m = Math.round(overallMastery() * 100);
  $('#overall-bar').style.width = m + '%';
  $('#overall-val').textContent = m + '%';
}
const _origSave = saveState;
saveState = function () { _origSave(); updateOverallBar(); };

function init() {
  // Stable ordering regardless of which order topic files loaded in.
  if (CONTENT.topicOrder) {
    const ord = CONTENT.topicOrder;
    CONTENT.topics.sort((a, b) => {
      const ia = ord.indexOf(a.id), ib = ord.indexOf(b.id);
      return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
    });
  }
  buildNav();
  updateOverallBar();
  if (isMobile()) setSidebar(false);
  showView('dashboard');

  $('#search').addEventListener('input', e => buildNav(e.target.value));
  $('#menu-toggle').onclick = () => setSidebar($('#sidebar').classList.contains('collapsed'));
  $('#sidebar-backdrop').onclick = () => setSidebar(false);
  window.addEventListener('resize', () => { if (!isMobile()) { setSidebar(true); document.body.classList.remove('nav-open'); } });
  document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => showView(b.dataset.view));
  $('#reset-btn').onclick = () => {
    if (confirm('Reset all your progress and requested topics? This cannot be undone.')) {
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      saveState(); buildNav(); showView('dashboard');
    }
  };
}

window.addEventListener('DOMContentLoaded', init);
