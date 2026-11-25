const C = 'chaspak-v18';
const FILES = ['./', 'index.html', 'manifest.json', 'icon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))));
  self.clients.claim();
});
// Internet bo'lsa eng yangisini oladi. Internet yo'q yoki 3 soniyada javob kelmasa — saqlangan nusxani ochadi.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const net = fetch(e.request, { cache: 'no-store' }).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); }
    return r;
  });
  const cached = () => caches.match(e.request, { ignoreSearch: true });
  const timeout = new Promise(res => setTimeout(() => cached().then(r => r && res(r)), 3000));
  e.respondWith(Promise.race([net, timeout]).catch(() => cached()));
  e.waitUntil(net.catch(() => {}));
});
