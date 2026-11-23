// Gym Buddy service worker: app opens offline; updates are picked up on the next launch.
const CACHE = "gym-buddy-v15";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, {cache: "reload"})))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.hostname.endsWith("supabase.co")) return;      // data always goes to the network
  const isPage = req.mode === "navigate" || url.pathname.endsWith("/index.html");
  if (isPage || url.origin === location.origin) {
    // network first so updates arrive, cache as fallback for the gym with no signal
    // cache: "no-cache" skips GitHub Pages' 10-minute browser cache, so a push shows up on the next launch
    e.respondWith(fetch(req.url, {cache: "no-cache", credentials: "same-origin"}).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; }).catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
    return;
  }
  // fonts and the Supabase library: cache first
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; })));
});

// Rest alerts sent by the server when a rest period ends
self.addEventListener("push", e => {
  let d = {title: "Rest done", body: "Time for the next set"};
  try { d = Object.assign(d, e.data.json()); } catch (_) {}
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body, tag: "rest", renotify: true, icon: "icons/icon-192.png", badge: "icons/icon-192.png",
    vibrate: [300, 150, 300, 150, 300], requireInteraction: false
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type: "window", includeUncontrolled: true}).then(list => {
    for (const c of list) if ("focus" in c) return c.focus();
    return self.clients.openWindow("./");
  }));
});
