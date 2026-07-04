/* Service worker: offline app-shell caching.
   Bump CACHE when you change any cached file so clients update. */
const CACHE = 'rfstudy-v13';

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
