/* Service worker: offline app-shell caching.
   Bump CACHE when you change any cached file so clients update. */
const CACHE = 'rfstudy-v36';

const ASSETS = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'content.js',
  'dummies.js',
  'dummies-extra.js',
  'dummies-extra2.js',
  'dummies-extra3.js',
  'dummies-extra4.js',
  'dummies-extra5.js',
  'dummies-extra6.js',
  'dummies-optimal-receiver.js',
  'dummies-dsss-acquisition.js',
  'dummies-dsss-tracking.js',
  'dummies-delay-lock-tracking.js',
  'dummies-dsss-data-extraction.js',
  'dummies-bpsk-vs-dbpsk.js',
  'dummies-sliding-correlator.js',
  'dummies-tau-dither-tracking.js',
  'dummies-coherent-carrier-tracking.js',
  'dummies-split-bit-tracking.js',
  'dummies-ranging.js',
  'dummies-synchronization.js',
  'dummies-dsss-receiver-design.js',
  'dummies-dsss-receiver-implementation.js',
  'dummies-fft-bin.js',
  'dummies-intersymbol-interference.js',
  'figures.js',
  'figures-extra.js',
  'manifest.webmanifest',
  'topics/fundamentals.js',
  'topics/signals.js',
  'topics/modulation.js',
  'topics/mod-extra.js',
  'topics/synchronization.js',
  'topics/spread-spectrum.js',
  'topics/metrics-extra.js',
  'topics/sdr.js',
  'topics/rf-link.js',
  'topics/antennas.js',
  'topics/extra-a.js',
  'topics/extra-b.js',
  'topics/extra-c.js',
  'topics/extra-d.js',
  'topics/extra-e.js',
  'topics/proto-a.js',
  'topics/proto-b.js',
  'topics/sync-extra.js',
  'topics/coding-extra.js',
  'topics/normal-distribution.js',
  'topics/error-function.js',
  'topics/rayleigh-distribution.js',
  'topics/awgn.js',
  'topics/trellis-diagram.js',
  'topics/filters.js',
  'topics/lpf.js',
  'topics/hpf.js',
  'topics/bpf.js',
  'topics/notch-filter.js',
  'topics/filter-design.js',
  'topics/lna.js',
  'topics/agc.js',
  'topics/mixer.js',
  'topics/harmonics.js',
  'topics/third-order-intercept.js',
  'topics/intermediate-frequency.js',
  'topics/image-frequency.js',
  'topics/superheterodyne.js',
  'topics/zero-if.js',
  'topics/optimal-receiver.js',
  'topics/dsss-acquisition.js',
  'topics/dsss-tracking.js',
  'topics/delay-lock-tracking.js',
  'topics/dsss-data-extraction.js',
  'topics/bpsk-vs-dbpsk.js',
  'topics/sliding-correlator.js',
  'topics/tau-dither-tracking.js',
  'topics/coherent-carrier-tracking.js',
  'topics/split-bit-tracking.js',
  'topics/ranging.js',
  'topics/synchronization-overview.js',
  'topics/dsss-receiver-design.js',
  'topics/dsss-receiver-implementation.js',
  'topics/fft-bin.js',
  'topics/intersymbol-interference.js',
  'derivations/fundamentals.js',
  'derivations/signals-systems.js',
  'derivations/modulation-detection.js',
  'derivations/synchronization.js',
  'derivations/spread-spectrum-coding.js',
  'derivations/rf-link-metrics.js',
  'derivations/sdr-data-converters.js',
  'derivations/antennas-electromagnetics.js',
  'code/fundamentals.js',
  'code/signals.js',
  'code/modulation.js',
  'code/comms-extra.js',
  'code/synchronization.js',
  'code/spread-spectrum.js',
  'code/sdr.js',
  'code/rf-link.js',
  'code/antennas.js',
  'code/extra.js',
  'code/extra2.js',
  'code/proto.js',
  'code/extra3.js',
  'code/extra4.js',
  'code/extra5.js',
  'code/extra6.js',
  'code/optimal-receiver.js',
  'code/dsss-acquisition.js',
  'code/dsss-tracking.js',
  'code/delay-lock-tracking.js',
  'code/dsss-data-extraction.js',
  'code/bpsk-vs-dbpsk.js',
  'code/sliding-correlator.js',
  'code/tau-dither-tracking.js',
  'code/coherent-carrier-tracking.js',
  'code/split-bit-tracking.js',
  'code/ranging.js',
  'code/synchronization-overview.js',
  'code/dsss-receiver-design.js',
  'code/dsss-receiver-implementation.js',
  'code/fft-bin.js',
  'code/intersymbol-interference.js',
  'vendor/mathjax/tex-svg.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let cross-origin pass through

  // Navigation requests → serve cached shell when offline (SPA-style).
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Everything else → cache-first, fall back to network and cache the result.
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => cached))
  );
});
