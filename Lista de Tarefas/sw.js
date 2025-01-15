// Versão do cache
const CACHE_NAME = 'v1_cache_tarefas';

// Arquivos para fazer cache offline
const CACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json'
  // Você pode adicionar ícones, fontes, etc.
];

// Instalação do Service Worker
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

// Ativação do SW
self.addEventListener('activate', e => {
  // Remove caches antigos
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      // Se existir no cache, retorna
      if (response) {
        return response;
      }
      // Senão faz fetch
      return fetch(e.request);
    })
  );
});
