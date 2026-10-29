/* Funciona sin internet: guarda la app la primera vez que se abre.
   Para publicar cambios basta con subir los archivos nuevos: esta versión (845f84b1) cambia sola. */
var CACHE = "mi-uniforme-845f84b1";
var FILES = ["./", "./compas.html", "./completa.html", "./fonts/atkinson-hyperlegible-latin-400-normal.woff2", "./fonts/atkinson-hyperlegible-latin-700-normal.woff2", "./fonts/barlow-condensed-latin-600-normal.woff2", "./fonts/barlow-condensed-latin-700-normal.woff2", "./fonts/barlow-condensed-latin-800-normal.woff2", "./fonts/barlow-latin-400-normal.woff2", "./fonts/barlow-latin-500-normal.woff2", "./fonts/barlow-latin-600-normal.woff2", "./fonts/barlow-latin-700-normal.woff2", "./fonts/fonts.css", "./fonts/kalam-latin-400-normal.woff2", "./fonts/kalam-latin-700-normal.woff2", "./fonts/lexend-latin-400-normal.woff2", "./fonts/lexend-latin-500-normal.woff2", "./fonts/lexend-latin-600-normal.woff2", "./fonts/lexend-latin-800-normal.woff2", "./icons/apple-touch-icon.png", "./icons/favicon.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./index.html", "./manifest.webmanifest", "./simple.html"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
/* Páginas: primero la red (para ver la versión más nueva) y, sin señal, la copia guardada.
   Letras, íconos y demás: la copia guardada, que es más rápida. */
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(function (res) {
      var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); return res;
    }).catch(function () { return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || caches.match("./"); }); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (r) { return r || fetch(req); }));
});
