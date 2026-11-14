/* Andronicus web app: offline helper (service worker).
 * - Pages, scripts and styles: network first, so new versions show straight away;
 *   the saved copy is only used when there's no internet.
 * - Images and fonts: saved copy first (they rarely change), refreshed in the background.
 * - Supabase, Stripe and other outside services are never cached.
 * Bump VERSION to clear old saved copies. */
var VERSION = "andronicus-v1";
var CORE = [
  "/",
  "/index.html",
  "/styles.css",
  "/i18n.js",
  "/icons.js",
  "/avatars.js",
  "/app.js",
  "/favicon.svg",
  "/manifest.webmanifest",
  "/assets/icons/icon-192.png",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(VERSION)
      .then(function (cache) {
        return cache.addAll(CORE);
      })
      .catch(function () {})
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) {
              return k !== VERSION;
            })
            .map(function (k) {
              return caches.delete(k);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

function isFontHost(url) {
  return url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !isFontHost(url)) return; // Supabase, Stripe, CDNs: straight to the network
  if (sameOrigin && url.pathname.indexOf("/api/") === 0) return; // server functions (payments)

  var isStatic = isFontHost(url) || /\.(png|jpe?g|gif|svg|webp|ico|woff2?)$/i.test(url.pathname);

  if (isStatic) {
    // saved copy first, refresh in the background
    event.respondWith(
      caches.open(VERSION).then(function (cache) {
        return cache.match(req).then(function (hit) {
          var fresh = fetch(req)
            .then(function (res) {
              if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
              return res;
            })
            .catch(function () {
              return hit;
            });
          return hit || fresh;
        });
      })
    );
    return;
  }

  // pages, scripts, styles, data: network first, saved copy when offline
  event.respondWith(
    fetch(req)
      .then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(VERSION).then(function (cache) {
            cache.put(req, copy);
          });
        }
        return res;
      })
      .catch(function () {
        return caches.match(req, { ignoreSearch: req.mode === "navigate" }).then(function (hit) {
          return hit || (req.mode === "navigate" ? caches.match("/index.html") : undefined);
        });
      })
  );
});
