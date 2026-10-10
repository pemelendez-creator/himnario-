/* Service worker del Himnario IPB — Iglesia Pentecostal El Bosque
   Guarda la app completa en el celular para que abra sin señal.
   Al publicar una version nueva, sube CACHE_VERSION para forzar la actualizacion. */

const CACHE_VERSION = 'himnario-v22';
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
  // Nunca interceptar Firebase ni nada de otro dominio
  if (url.origin !== self.location.origin) return;

  // La app y la configuracion: red primero (para recibir actualizaciones),
  // cache solo si no hay señal. cache:'reload' salta el cache HTTP de GitHub,
  // que retiene los archivos 10 minutos.
  if (req.mode === 'navigate' ||
      url.pathname.endsWith('index.html') ||
      url.pathname.endsWith('firebase-config.json')) {
    const clave = url.pathname.endsWith('firebase-config.json')
      ? './firebase-config.json' : './index.html';
    e.respondWith(
      fetch(req, { cache: 'reload' })
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(clave, copy));
          return res;
        })
        .catch(() => caches.match(clave).then(r => r || caches.match('./')))
    );
    return;
  }

  // Todo lo demas (iconos): cache primero
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
