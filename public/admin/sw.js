/* Only the generic offline document is cached. Never cache authenticated HTML,
   RSC payloads, API responses, uploads, credentials or user edits. */
const CACHE = "shinta-admin-offline-v1";
const OFFLINE = "/admin/offline.html";
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add(OFFLINE))
      .then(() => self.skipWaiting()),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => key.startsWith("shinta-admin-offline-") && key !== CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (
    request.method !== "GET" ||
    request.mode !== "navigate" ||
    url.origin !== self.location.origin ||
    !(url.pathname === "/admin" || url.pathname.startsWith("/admin/"))
  )
    return;
  event.respondWith(
    fetch(request, { cache: "no-store" }).catch(async () => {
      const offline = await caches.match(OFFLINE);
      return (
        offline ||
        new Response(
          "Dashboard memerlukan koneksi internet. Silakan sambungkan kembali lalu muat ulang.",
          {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          },
        )
      );
    }),
  );
});
