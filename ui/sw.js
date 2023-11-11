const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v3.0.3");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/main.css",
      "/main.mjs",
      "/manifest.webmanifest",
      "/app.mjs",
      "/html.mjs",
      "/auth.mjs",
      "/form.mjs",
      "/api.mjs",
      "/templates.json",
      "/assets/icons/android-icon-144x144.png",
      "/assets/favicon.ico",
    ]),
  );
});

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    console.log("Serving from cache:", request.url);
    return responseFromCache;
  }
  console.log("Serving from network:", request.url);
  return fetch(request);
};

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(event.request));
});

