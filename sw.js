// Service worker do Rota da Soja PR: funciona offline e busca dados novos quando há internet.
const VERSAO = 'rota-soja-v10';
const ARQUIVOS = ['./', 'index.html', 'd3.min.js', 'manifest.webmanifest', 'data/cotacao.json', 'data/frete.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Página e dados: tenta a rede primeiro (versão e cotação novas); sem internet, usa a última salva.
  if (url.origin === location.origin && (req.mode === 'navigate' || url.pathname.includes('/data/') || url.pathname.endsWith('.html') || url.pathname.endsWith('/'))) {
    e.respondWith(fetch(req).then(r => { const copia = r.clone(); caches.open(VERSAO).then(c => c.put(req, copia)); return r; })
      .catch(() => caches.match(req, { ignoreSearch: true })));
    return;
  }
  // Resto (página, ícones, fontes): usa o que está salvo e atualiza em segundo plano.
  e.respondWith(caches.match(req).then(salvo => {
    const rede = fetch(req).then(r => { if (r.ok || r.type === 'opaque') { const copia = r.clone(); caches.open(VERSAO).then(c => c.put(req, copia)); } return r; })
      .catch(() => salvo);
    return salvo || rede;
  }));
});
