/* eslint-disable no-undef */
const CACHE_NAME = "fantasy-app-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/icon.png",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/_expo/static/css/web-1dfd5bec3eaed31b84c7e093e64ee60b.css",
  "/_expo/static/js/web/entry-fae974b885b7f6fdfe59331f0c258521.js",
];

self.addEventListener("install", (event) => {
  console.log("Installing service worker");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  // We only want to handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // For navigation requests (like going to /sign-in or /auth-home)
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches
        .match("/index.html")
        .then((response) => {
          // If index.html is in cache, serve it
          if (response) {
            return response;
          }
          // If not, fetch it from the network
          return fetch(event.request);
        })
        .catch(() => {
          // If network fails (i.e., we are offline), serve the custom offline page
          return caches.match("/offline.html");
        }),
    );
  } else {
    // For all other requests (static assets, API calls)
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      }),
    );
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
