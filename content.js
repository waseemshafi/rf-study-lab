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
    'Interfaces & Protocols',
    'RF Link & Metrics',
    'Antennas & Electromagnetics'
  ],
  // Canonical display order (nav sorts by this within each category).
  topicOrder: [
    'comm-basics', 'shannon', 'source-coding', 'bandwidth', 'noise', 'psd', 'noise-floor', 'noise-figure', 'phase-noise',
    'fourier-transform', 'fft', 'sinc-function', 'frequency-spectrum', 'laplace-transform', 'z-transform', 'convolution', 'correlation', 'fir-filters', 'iir-filters', 'nyquist-sampling', 'aliasing',
    'am', 'fm', 'bpsk', 'qpsk', 'dbpsk', 'pulse-shaping', 'rrc-filter', 'eye-diagram', 'matched-filter', 'ber', 'eb-no', 'evm',
    'vco', 'nco', 'pll', 'fll', 'dll', 'cfo', 'early-late-correlator', 'costas-loop',
    'dsss', 'frequency-hopping', 'processing-gain', 'jamming-margin', 'pn-codes', 'gold-code', 'channel-coding', 'fec', 'convolutional-codes', 'viterbi', 'turbo-codes', 'ldpc',
    'sdr', 'adc', 'dac', 'ad9361', 'rfsoc',
    'rs232', 'rs422', 'rs485', 'lvds', 'spi', 'axi', 'mil-std-1553',
    'rssi', 'path-loss', 'link-budget', 'sensitivity',
    'antenna', 'antenna-gain', 'antenna-beamwidth', 'polarization', 'antenna-types', 'maxwell'
  ],
  topics: []
};

/* Code snippets per topic id: { matlab, python, note? }. Populated by /code files. */
const CONTENT_CODE = {};

/* Plain-English "For dummies" explanations per topic id. Populated by dummies.js. */
const CONTENT_DUMMIES = {};

/* Upgraded from-scratch derivations, keyed by topic id then equation index.
   e.g. CONTENT_DERIV['bpsk'] = { 0: '<html>', 1: '<html>' }. Populated by /derivations files.
   When present, overrides the equation's built-in derivation. */
const CONTENT_DERIV = {};

/* Computed/interactive figure specs per topic id. Populated by figures.js (FIG.map). */
const CONTENT_FIG = {};
