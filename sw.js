/* Service worker del Himnario IPB
   Guarda la app completa en el celular para que abra sin señal.
   Al publicar una version nueva, sube CACHE_VERSION para forzar la actualizacion. */

const CACHE_VERSION = 'himnario-v16';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  './favicon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())   // que un asset faltante no impida instalar
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Nunca interceptar el servidor de sincronizacion ni los TURN
  if (url.origin !== self.location.origin) return;

  // La app: red primero (para recibir actualizaciones), cache si no hay señal
  if (req.mode === 'navigate' || url.pathname.endsWith('index.html')) {
    e.respondWith(
      // cache:'reload' salta el cache HTTP del navegador (GitHub Pages sirve
      // los archivos con 10 minutos de vida, y eso dejaba la app vieja)
      fetch(req, { cache: 'reload' })
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Todo lo demas: cache primero
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => hit))
  );
});
