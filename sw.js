// Guarda o app no celular para abrir sem internet.
// Com internet: sempre busca a versão mais nova (e atualiza o que está guardado).
// Sem internet: abre a última versão guardada.

const VERSAO = "volei-team-v1";
const ARQUIVOS = ["./", "index.html", "style.css", "script.js"];

self.addEventListener("install", (e)=>{

    e.waitUntil(
        caches.open(VERSAO)
            .then(c=> c.addAll(ARQUIVOS))
            .then(()=> self.skipWaiting())
    );

});

self.addEventListener("activate", (e)=>{

    e.waitUntil(
        caches.keys()
            .then(nomes=> Promise.all(nomes.filter(n=> n !== VERSAO).map(n=> caches.delete(n))))
            .then(()=> self.clients.claim())
    );

});

self.addEventListener("fetch", (e)=>{

    if(e.request.method !== "GET") return;

    // só cuida dos arquivos do próprio app
    if(new URL(e.request.url).origin !== self.location.origin) return;

    e.respondWith(
        fetch(e.request)
            .then(resp=>{

                const copia = resp.clone();

                caches.open(VERSAO).then(c=> c.put(e.request, copia));

                return resp;

            })
            .catch(()=> caches.match(e.request).then(r=> r || caches.match("index.html")))
    );

});
