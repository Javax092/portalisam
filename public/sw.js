const STATIC_CACHE = "isam-static-v1";
const PAGE_CACHE = "isam-pages-v1";
const STATIC_ASSET_DESTINATIONS = new Set(["style", "script", "image", "font"]);
const PUBLIC_PAGES = new Set(["/", "/portal", "/reports", "/report", "/offline"]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGE_CACHE);
      await cache.addAll(Array.from(PUBLIC_PAGES));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => ![STATIC_CACHE, PAGE_CACHE].includes(cacheName))
          .map((cacheName) => caches.delete(cacheName)),
      );
      await self.clients.claim();
    })(),
  );
});

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isBlockedPath(pathname) {
  return pathname.startsWith("/api/") || pathname.startsWith("/admin") || pathname === "/login";
}

function isStaticAsset(request, pathname) {
  return (
    STATIC_ASSET_DESTINATIONS.has(request.destination) ||
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/icons/") ||
    pathname === "/manifest.webmanifest" ||
    pathname.endsWith(".ico")
  );
}

async function networkFirst(request) {
  const cache = await caches.open(PAGE_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch {
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return (await cache.match("/offline")) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);

  if (response.ok) {
    cache.put(request, response.clone());
  }

  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (!isSameOrigin(url) || isBlockedPath(url.pathname)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isStaticAsset(request, url.pathname)) {
    event.respondWith(cacheFirst(request));
  }
});
