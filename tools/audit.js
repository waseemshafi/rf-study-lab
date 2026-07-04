/* ============================================================
   audit.js — the "definition of done" gate for every topic.
   Run:  node tools/audit.js
   Loads the app exactly as index.html does (same files, same
   order), then checks EVERY topic against the required feature
   set. Exits non-zero if anything is missing, so no topic can
   ship half-built. Run this after adding/editing any topic.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// Minimum feature set every topic must have (parity with the richest topics).
const REQ = {
  sections: 5, keyPoints: 6, equations: 3, flashcards: 10,
  mcqs: 10, numericals: 4, figures: 3, related: 2, prerequisites: 1
};

// 1) Discover the exact file load order from index.html (single source of truth).
const html = read('index.html');
const srcs = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1])
  .filter(s => s.endsWith('.js') && !s.includes('vendor/') && s !== 'app.js');

// 2) Load every data file in that order inside ONE shared scope so the
//    const globals (CONTENT, CONTENT_CODE, CONTENT_DUMMIES, CONTENT_DERIV, FIG)
//    are all visible, then hand them back.
const body = srcs.map(s => read(s)).join('\n;\n') +
  '\n; return { CONTENT, CONTENT_CODE, CONTENT_DUMMIES, CONTENT_DERIV, FIG };';
const stubWin = { devicePixelRatio: 1 };
const stubDoc = { createElement: () => ({ getContext: () => new Proxy({}, { get: () => () => {} }), appendChild(){}, style:{}, className:'', classList:{add(){},remove(){},toggle(){}}, querySelectorAll: () => [], append(){}, width:520, height:320 }), body: { contains: () => false } };
let G;
try { G = new Function('window', 'document', 'requestAnimationFrame', body)(stubWin, stubDoc, () => {}); }
catch (e) { console.error('LOAD FAILED (a file has a syntax error):', e.message); process.exit(2); }
const { CONTENT, CONTENT_CODE, CONTENT_DUMMIES, CONTENT_DERIV, FIG } = G;

// Helper: number of diagrams a topic shows (computed figures + schematic SVGs).
function figureCount(t) {
  const specs = (CONTENT_FIGsafe(t.id)) || [];
  const svgs = t.diagram ? (Array.isArray(t.diagram) ? t.diagram.length : 1) : 0;
  return specs.length + svgs;
}
function CONTENT_FIGsafe(id) { return (FIG && FIG.map && FIG.map[id]) || []; }

// Helper: does an equation have a real from-scratch derivation (override or inline)?
function hasStepDerivation(t, i) {
  const ov = CONTENT_DERIV[t.id] && CONTENT_DERIV[t.id][i];
  const inl = t.equations[i] && t.equations[i].derivation;
  const src = ov || inl || '';
  return /Where we start|Step 1|Result/i.test(src) && src.length > 300;
}

// 3) Audit every topic.
const ids = CONTENT.topics.map(t => t.id);
const order = CONTENT.topicOrder || [];
let problems = 0, perfect = 0;
const rows = [];

CONTENT.topics.forEach(t => {
  const gaps = [];
  const n = (a) => (a || []).length;
  if (n(t.sections) < REQ.sections && !t.explanation) gaps.push(`sections ${n(t.sections)}<${REQ.sections}`);
  if (n(t.keyPoints) < REQ.keyPoints) gaps.push(`keyPoints ${n(t.keyPoints)}<${REQ.keyPoints}`);
  if (n(t.equations) < REQ.equations) gaps.push(`equations ${n(t.equations)}<${REQ.equations}`);
  else { const bad = t.equations.filter((e, i) => !hasStepDerivation(t, i)).length; if (bad) gaps.push(`${bad} eq without step-derivation`); }
  if (n(t.flashcards) < REQ.flashcards) gaps.push(`flashcards ${n(t.flashcards)}<${REQ.flashcards}`);
  if (n(t.mcqs) < REQ.mcqs) gaps.push(`mcqs ${n(t.mcqs)}<${REQ.mcqs}`);
  t.mcqs && t.mcqs.forEach((m, i) => { if (typeof m.answer !== 'number' || !Array.isArray(m.options) || m.answer < 0 || m.answer >= m.options.length) gaps.push(`mcq[${i}] bad answer`); });
  if (n(t.numericals) < REQ.numericals) gaps.push(`numericals ${n(t.numericals)}<${REQ.numericals}`);
  if (figureCount(t) < REQ.figures) gaps.push(`DIAGRAMS ${figureCount(t)}<${REQ.figures}`);
  if (n(t.related) < REQ.related) gaps.push(`related ${n(t.related)}<${REQ.related}`);
  if (n(t.prerequisites) < REQ.prerequisites) gaps.push(`prerequisites ${n(t.prerequisites)}<${REQ.prerequisites}`);
  if (!t.summary) gaps.push('no summary');
  if (!t.realWorld) gaps.push('no realWorld');
  const code = CONTENT_CODE[t.id];
  if (!code || !code.matlab) gaps.push('no MATLAB code');
  if (!code || !code.python) gaps.push('no Python code');
  const dum = CONTENT_DUMMIES[t.id];
  if (!dum || dum.length < 200) gaps.push('no/short For-Dummies');
  if (!order.includes(t.id)) gaps.push('NOT in topicOrder');
  if (!CONTENT.categories.includes(t.category)) gaps.push('bad category');

  if (gaps.length) { problems++; rows.push({ id: t.id, gaps }); } else perfect++;
});

// 4) Cross-checks: topicOrder ids exist; links resolve; sw.js caches every file.
const idSet = new Set(ids);
const orphanOrder = order.filter(id => !idSet.has(id));
const brokenLinks = [];
CONTENT.topics.forEach(t => [...(t.related || []), ...(t.prerequisites || [])].forEach(r => { if (!idSet.has(r)) brokenLinks.push(`${t.id}->${r}`); }));
const swAssets = (read('sw.js').match(/'([^']+\.js)'/g) || []).map(s => s.replace(/'/g, ''));
const uncached = srcs.filter(s => !swAssets.includes(s));

// 5) Report.
console.log('=== TOPIC COMPLETENESS AUDIT ===');
console.log(`Topics: ${CONTENT.topics.length} | fully complete: ${perfect} | with gaps: ${problems}`);
console.log(`Required per topic: sections≥${REQ.sections}, keyPoints≥${REQ.keyPoints}, equations≥${REQ.equations} (each derived), flashcards≥${REQ.flashcards}, mcqs≥${REQ.mcqs}, numericals≥${REQ.numericals}, diagrams≥${REQ.figures}, code(MATLAB+Python), For-Dummies, related≥${REQ.related}, prerequisites≥${REQ.prerequisites}, summary, realWorld.`);
if (rows.length) { console.log('\n--- topics with gaps ---'); rows.forEach(r => console.log(`  ${r.id}: ${r.gaps.join('; ')}`)); }
if (orphanOrder.length) console.log('\ntopicOrder ids with no topic file:', orphanOrder);
if (brokenLinks.length) console.log('\nBROKEN related/prerequisite links:', brokenLinks.slice(0, 30));
if (uncached.length) console.log('\nFiles loaded in index.html but MISSING from sw.js precache (offline gap):', uncached);

const fail = problems || orphanOrder.length || brokenLinks.length || uncached.length;
console.log('\n' + (fail ? '❌ AUDIT FAILED — fix the gaps above.' : '✅ AUDIT PASSED — every topic has the full feature set.'));
process.exit(fail ? 1 : 0);
