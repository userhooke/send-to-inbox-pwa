const CACHE_VERSION = "v3.0.7";

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_VERSION);
  await cache.put(request, response);
};

self.addEventListener("activate", async () => {
  console.log("Removing old cache");
  const existingCaches = await caches.keys();
  const invalidCaches = existingCaches.filter((c) => c !== CACHE_VERSION);
  await Promise.all(invalidCaches.map((ic) => caches.delete(ic)));
});

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    console.log("Serving from cache:", request.url);
    return responseFromCache;
  }

  try {
    console.log("Serving from network:", request.url);
    const responseFromNetwork = await fetch(request);

    if (!request.url.includes("/api/")) {
      putInCache(request, responseFromNetwork.clone());
    }

    return responseFromNetwork;
  } catch (e) {
    console.error(e);
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(event.request));
});
