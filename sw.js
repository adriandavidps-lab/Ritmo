// Ritmo · service worker: solo recibe y muestra avisos. No guarda nada en caché,
// así cada actualización de la app en GitHub se ve al volver a abrirla.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { titulo: 'Ritmo', cuerpo: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Ritmo', {
    body: d.cuerpo || '',
    tag: d.tag || undefined,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: { url: self.registration.scope },
  }));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ventanas) {
    for (var i = 0; i < ventanas.length; i++) if ('focus' in ventanas[i]) return ventanas[i].focus();
    return self.clients.openWindow(self.registration.scope);
  }));
});
