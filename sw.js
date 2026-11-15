// Mattia Gym 2.1 - local app caching. External PDF.js is retrieved on first online use.
const CACHE='mattia-gym-2-1-pdf-20261115';
const LOCAL=['./','./index.html','./manifest.webmanifest','./apple-touch-icon.png','./icon-192.png','./icon-512.png'];
const PDF_FILES=['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(LOCAL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('mattia-gym-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);if(u.origin!==self.location.origin&&!PDF_FILES.includes(u.href))return;
 e.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(resp=>{if(resp.ok||resp.type==='opaque'){const clone=resp.clone();caches.open(CACHE).then(cache=>cache.put(r,clone)).catch(()=>{})}return resp})).catch(()=>r.mode==='navigate'?caches.match('./index.html'):Response.error()));
});
