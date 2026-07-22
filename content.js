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
    'Probability & Random Signals',
    'Signals & Systems',
    'Modulation & Detection',
    'Synchronization',
    'Spread Spectrum & Coding',
    'Filters',
    'RF Front-End & Receivers',
    'SDR & Data Converters',
    'Interfaces & Protocols',
    'RF Link & Metrics',
    'Antennas & Electromagnetics',
    'Wireless Systems'
  ],
  // Canonical display order (nav sorts by this within each category).
  topicOrder: [
    'comm-basics', 'information-theory', 'shannon', 'source-coding', 'bandwidth', 'noise', 'psd', 'noise-floor', 'noise-figure', 'phase-noise',
    'normal-distribution', 'error-function', 'rayleigh-distribution', 'awgn',
    'fourier-transform', 'fft', 'fft-bin', 'sinc-function', 'frequency-spectrum', 'laplace-transform', 'z-transform', 'convolution', 'correlation', 'fir-filters', 'iir-filters', 'nyquist-sampling', 'aliasing',
    'am', 'fm', 'bpsk', 'qpsk', 'dbpsk', 'bpsk-vs-dbpsk', 'intersymbol-interference', 'pulse-shaping', 'rrc-filter', 'eye-diagram', 'matched-filter', 'optimal-receiver', 'ber', 'eb-no', 'evm',
    'synchronization', 'vco', 'nco', 'pll', 'fll', 'dll', 'cfo', 'early-late-correlator', 'costas-loop', 'coherent-carrier-tracking',
    'dsss', 'frequency-hopping', 'processing-gain', 'jamming-margin', 'pn-codes', 'gold-code', 'dsss-acquisition', 'sliding-correlator', 'dsss-tracking', 'delay-lock-tracking', 'tau-dither-tracking', 'split-bit-tracking', 'dsss-data-extraction', 'dsss-receiver-design', 'dsss-receiver-implementation', 'channel-coding', 'fec', 'convolutional-codes', 'viterbi', 'trellis-diagram', 'turbo-codes', 'ldpc', 'tanner-graph', 'polar-codes-general', 'polar-codes',
    'filters', 'lpf', 'hpf', 'bpf', 'notch-filter', 'filter-design',
    'lna', 'agc', 'mixer', 'harmonics', 'third-order-intercept', 'intermediate-frequency', 'image-frequency', 'superheterodyne', 'zero-if',
    'sdr', 'adc', 'dac', 'ad9361', 'rfsoc',
    'rs232', 'rs422', 'rs485', 'lvds', 'spi', 'axi', 'mil-std-1553',
    'rssi', 'path-loss', 'link-budget', 'sensitivity', 'ranging',
    'antenna', 'antenna-gain', 'antenna-beamwidth', 'polarization', 'antenna-types', 'maxwell',
    '5g'
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
