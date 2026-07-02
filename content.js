/* ============================================================
   CONTENT registry for RF & Comms Study Lab
   Categories and canonical topic ordering live here.
   The actual topic objects are pushed from per-category files
   in /topics (loaded after this file in index.html).

   Topic schema (only present fields render as tabs):
   {
     id, title, category, tags:[],
     summary,                       // one line under the title
     prerequisites:[id,...],        // shown as linked chips
     intro,                         // short orientation (HTML)
     sections:[{h, html}],          // structured deep explanation
     keyPoints:[...],
     diagram:[{svg, caption}],      // inline SVG(s)
     equations:[{title, tex, derivation}],  // click to reveal derivation
     flashcards:[{front, back}],
     mcqs:[{q, options:[], answer, explain}],
     numericals:[{q, solution}],
     realWorld,
     related:[id,...]
   }
   Use String.raw template literals for all text so LaTeX
   backslashes stay literal.
   ============================================================ */

const CONTENT = {
  categories: [
    'Fundamentals',
    'Signals & Systems',
    'Modulation & Detection',
    'Synchronization',
    'Spread Spectrum & Coding',
    'SDR & Data Converters',
    'RF Link & Metrics',
    'Antennas & Electromagnetics'
  ],
  // Canonical display order (nav sorts by this within each category).
  topicOrder: [
    'comm-basics', 'noise', 'psd', 'noise-floor', 'noise-figure', 'phase-noise',
    'fourier-transform', 'laplace-transform', 'z-transform', 'convolution', 'correlation', 'nyquist-sampling', 'aliasing',
    'bpsk', 'dbpsk', 'pulse-shaping', 'eye-diagram', 'matched-filter', 'ber', 'eb-no', 'evm',
    'pll', 'fll', 'costas-loop',
    'dsss', 'frequency-hopping', 'processing-gain', 'jamming-margin', 'pn-codes', 'gold-code', 'fec', 'viterbi',
    'sdr', 'adc', 'dac', 'ad9361', 'rfsoc',
    'rssi', 'path-loss', 'link-budget', 'sensitivity',
    'antenna', 'antenna-gain', 'antenna-beamwidth', 'antenna-types', 'maxwell'
  ],
  topics: []
};

/* Code snippets per topic id: { matlab, python, note? }. Populated by /code files. */
const CONTENT_CODE = {};

/* Plain-English "For dummies" explanations per topic id. Populated by dummies.js. */
const CONTENT_DUMMIES = {};

/* Computed/interactive figure specs per topic id. Populated by figures.js (FIG.map). */
const CONTENT_FIG = {};
