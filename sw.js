/* Service worker: offline app-shell caching.
   Bump CACHE when you change any cached file so clients update. */
const CACHE = 'rfstudy-v3';

const ASSETS = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'content.js',
  'figures.js',
  'manifest.webmanifest',
  'topics/fundamentals.js',
  'topics/modulation.js',
  'topics/synchronization.js',
  'topics/spread-spectrum.js',
  'topics/sdr.js',
  'topics/rf-link.js',
  'topics/antennas.js',
  'code/fundamentals.js',
  'code/modulation.js',
  'code/synchronization.js',
  'code/spread-spectrum.js',
  'code/sdr.js',
  'code/rf-link.js',
  'code/antennas.js',
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
