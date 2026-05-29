const CACHE_NAME = "danicek-reisen-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/main.js",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        })
      );
    }),
  );
});
