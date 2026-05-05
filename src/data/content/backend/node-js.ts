import type { SkillContent } from '@/types'

const nodeJs: SkillContent = {
  tagline: "Runtime JavaScript no servidor — event loop não bloqueante, libuv e ecossistema npm dominante.",
  why: "Node.js está em praticamente toda empresa de produto BR em 2025. Saber event loop em profundidade, libuv, streams e quando NÃO usar Node (CPU-bound) diferencia sênior de pleno. Entender worker_threads, cluster e async_hooks abre portas para vagas de performance e plataforma.",
  prerequisite: "JavaScript ES6+ (Promises, async/await, generators, módulos). Fundamentos de redes TCP/HTTP. Noção de sistema operacional: processos, threads, file descriptors. Esses conceitos fazem o event loop fazer sentido — sem eles, Node parece magia.",
  summary: "Node.js executa JavaScript fora do browser usando o motor V8 da Google e a biblioteca libuv para I/O assíncrono multiplataforma. O modelo central é o event loop: single-threaded, não bloqueante, orientado a callbacks/Promises. Node é extraordinariamente eficiente para I/O concorrente (APIs REST, streaming, WebSocket) porque não precisa de uma thread por conexão — libera a thread assim que lança I/O e retoma quando completa. A libuv abstrai diferenças de OS e mantém um thread pool para operações sem AIO nativo (fs, crypto, dns.lookup). Para CPU-bound real, use worker_threads (memória compartilhada) ou cluster (múltiplos processos). O ecossistema npm é o maior repositório de pacotes do mundo.",
  howToStudy: "<strong>Antes de uma entrevista técnica:</strong> garanta que você consegue desenhar o event loop de memória (6 fases + microtasks entre elas) e explicar a diferença entre nextTick, setImmediate e setTimeout(0). Esses três são o gotcha favorito de entrevistadores sênior.<br><br><strong>Num fim de semana:</strong> reproduza cada snippet dos keypoints no terminal — especialmente o de streams e backpressure. Abra o Chrome DevTools com <code>node --inspect</code> e tire um heap snapshot de uma aplicação simples. Entender como tirar e ler um heap snapshot sozinho já coloca você acima de 80% dos candidatos.<br><br><strong>Para ir fundo:</strong> leia o source da libuv (em C, mas acessível) e o código de <code>events.js</code> no Node core. Entender EventEmitter por dentro explica a maioria dos bugs de memory leak. Em seguida, experimente <code>worker_threads</code> com <code>SharedArrayBuffer</code> e <code>Atomics</code> — poucos devs Node realmente chegaram aí.",
  diagrams: [
    {
      title: "Event Loop — 6 fases animadas com microtasks entre cada fase",
      html: `<style>
.nel-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;user-select:none}
.nel-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(104,160,99,.5);display:inline}
.nel-tip:hover .nel-tb{display:block}
.nel-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.nel-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.nel-phase{background:#1e293b;border:2px solid #334155;border-radius:10px;padding:9px 13px;font-size:11px;text-align:center;transition:border-color .25s,background .25s,box-shadow .25s;cursor:default;min-width:96px}
.nel-phase.active{background:rgba(104,160,99,.15);border-color:#68A063;box-shadow:0 0 12px rgba(104,160,99,.4)}
.nel-micro{background:#1e293b;border:1.5px dashed #334155;border-radius:8px;padding:7px 10px;font-size:10px;text-align:center;transition:border-color .25s,background .25s}
.nel-micro.active{background:rgba(250,204,21,.1);border-color:#facc15}
</style>
<div class="nel-wrap">
<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px">
  <div>
    <p style="color:#e2e8f0;font-size:12px;margin:0 0 3px;font-weight:600">Event Loop — 6 fases + microtasks</p>
    <p style="color:#475569;font-size:10px;margin:0">Passe o mouse nas fases para detalhes. Clique em <strong style="color:#68A063">Animar</strong> para ver a execução.</p>
  </div>
  <button id="nel-btn" onclick="nelRun()" style="background:#1e293b;border:1px solid #334155;border-radius:6px;color:#94a3b8;font-size:10px;padding:6px 12px;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0">Animar</button>
</div>
<div id="nel-status" style="background:#0d1829;border:1px solid #1e293b;border-radius:6px;padding:8px 12px;margin-bottom:16px;min-height:32px;display:flex;align-items:center;gap:8px">
  <span id="nel-dot" style="width:7px;height:7px;border-radius:50%;background:#334155;flex-shrink:0;transition:background .3s"></span>
  <span id="nel-txt" style="font-size:10px;color:#475569">Clique em Animar para ver o event loop em ação.</span>
</div>
<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center">
  <div id="nel-p0" class="nel-phase"><div style="color:#68A063;font-weight:700;font-size:10px">1</div><div class="nel-tip" style="color:#94a3b8">timers<span class="nel-tb">Executa callbacks de setTimeout() e setInterval() cujo delay já expirou. Node verifica o heap de timers — se expired, callback vai para esta fila.</span></div></div>
  <div id="nel-m01" class="nel-micro"><span class="nel-tip" style="color:#facc15;font-size:9px">nextTick+Promises<span class="nel-tb">process.nextTick e microtasks de Promise (.then) rodam entre CADA fase do event loop. São as mais prioritárias — se chamadas recursivamente, podem starvar o loop.</span></span></div>
  <div id="nel-p1" class="nel-phase"><div style="color:#68A063;font-weight:700;font-size:10px">2</div><div class="nel-tip" style="color:#94a3b8">pending I/O<span class="nel-tb">Callbacks de I/O adiados do ciclo anterior — erros TCP, por exemplo. Raramente usada diretamente.</span></div></div>
  <div id="nel-m12" class="nel-micro"><span style="color:#facc15;font-size:9px">nextTick+Promises</span></div>
  <div id="nel-p2" class="nel-phase"><div style="color:#68A063;font-weight:700;font-size:10px">3</div><div class="nel-tip" style="color:#94a3b8">idle/prepare<span class="nel-tb">Uso interno do Node. Não é possível enfileirar callbacks aqui via API pública.</span></div></div>
  <div id="nel-m23" class="nel-micro"><span style="color:#facc15;font-size:9px">nextTick+Promises</span></div>
  <div id="nel-p3" class="nel-phase"><div style="color:#68A063;font-weight:700;font-size:10px">4</div><div class="nel-tip" style="color:#94a3b8">poll<span class="nel-tb">Fase principal: busca novos eventos de I/O. Se a fila estiver vazia, o loop AGUARDA aqui por novos eventos — ou até o próximo timer expirar. É aqui que Node "dorme" quando ocioso.</span></div></div>
  <div id="nel-m34" class="nel-micro"><span style="color:#facc15;font-size:9px">nextTick+Promises</span></div>
  <div id="nel-p4" class="nel-phase"><div style="color:#68A063;font-weight:700;font-size:10px">5</div><div class="nel-tip" style="color:#94a3b8">check<span class="nel-tb">Executa callbacks de setImmediate(). Garantido rodar após poll, antes de fechar conexões.</span></div></div>
  <div id="nel-m45" class="nel-micro"><span style="color:#facc15;font-size:9px">nextTick+Promises</span></div>
  <div id="nel-p5" class="nel-phase"><div style="color:#68A063;font-weight:700;font-size:10px">6</div><div class="nel-tip" style="color:#94a3b8">close callbacks<span class="nel-tb">Callbacks de fechamento: socket.on('close'), process.on('exit'). Última fase antes de recomeçar.</span></div></div>
  <div id="nel-m50" class="nel-micro"><span style="color:#facc15;font-size:9px">nextTick+Promises</span></div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:18px;padding-top:14px;border-top:1px solid #1e293b">
  <div style="background:#1e293b;border-radius:8px;padding:9px 11px">
    <div style="font-size:10px;color:#68A063;font-weight:bold;margin-bottom:4px">Prioridade de execução</div>
    <div style="font-size:9px;color:#475569;line-height:1.7">1. process.nextTick (mais alta)<br>2. Promise microtasks (.then)<br>3. setImmediate (fase check)<br>4. setTimeout/setInterval (fase timers)<br>5. I/O callbacks (fase poll)</div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:9px 11px">
    <div style="font-size:10px;color:#ef4444;font-weight:bold;margin-bottom:4px">Armadilhas críticas</div>
    <div style="font-size:9px;color:#475569;line-height:1.7">nextTick recursivo strava o loop<br>CPU-bound bloqueia poll inteiro<br>setTimeout(0) nao e imediato<br>setImmediate vs setTimeout(0): ordem nao garantida fora de I/O</div>
  </div>
</div>
</div>
<script>
(function(){
var phases=[
  {ids:['nel-p0'],dot:'#68A063',txt:'1 - timers: callbacks de setTimeout/setInterval com delay expirado rodam aqui'},
  {ids:['nel-m01'],dot:'#facc15',txt:'nextTick + Promise microtasks drenam completamente antes da proxima fase'},
  {ids:['nel-p1'],dot:'#68A063',txt:'2 - pending I/O: callbacks de I/O adiados do ciclo anterior'},
  {ids:['nel-m12'],dot:'#facc15',txt:'nextTick + Promises novamente — prioridade sobre qualquer fase'},
  {ids:['nel-p2'],dot:'#68A063',txt:'3 - idle/prepare: uso interno do Node'},
  {ids:['nel-m23'],dot:'#facc15',txt:'microtasks entre idle e poll'},
  {ids:['nel-p3'],dot:'#68A063',txt:'4 - poll: FASE PRINCIPAL — busca novos I/O, aguarda aqui se fila vazia'},
  {ids:['nel-m34'],dot:'#facc15',txt:'microtasks apos poll'},
  {ids:['nel-p4'],dot:'#68A063',txt:'5 - check: setImmediate() roda aqui, logo apos poll'},
  {ids:['nel-m45'],dot:'#facc15',txt:'microtasks apos check'},
  {ids:['nel-p5'],dot:'#68A063',txt:'6 - close callbacks: socket.on("close"), cleanup handlers'},
  {ids:['nel-m50'],dot:'#facc15',txt:'ultimo lote de microtasks antes de recomecar o ciclo'},
];
var running=false;
function clearAll(){['nel-p0','nel-p1','nel-p2','nel-p3','nel-p4','nel-p5','nel-m01','nel-m12','nel-m23','nel-m34','nel-m45','nel-m50'].forEach(function(id){var el=document.getElementById(id);if(el)el.classList.remove('active');});}
function setStatus(color,txt){var d=document.getElementById('nel-dot');var t=document.getElementById('nel-txt');if(d)d.style.background=color;if(t)t.textContent=txt;}
window.nelRun=function(){
  if(running)return;running=true;
  var btn=document.getElementById('nel-btn');if(btn)btn.disabled=true;
  var p=0;
  function next(){
    if(p>=phases.length){setTimeout(function(){clearAll();setStatus('#334155','Ciclo completo — o loop reinicia enquanto ha trabalho.');running=false;if(btn)btn.disabled=false;},600);return;}
    clearAll();var ph=phases[p];
    ph.ids.forEach(function(id){var el=document.getElementById(id);if(el)el.classList.add('active');});
    setStatus(ph.dot,ph.txt);p++;setTimeout(next,850);
  }
  next();
};
})();
</script>`,
      caption: "O event loop roda indefinidamente enquanto há trabalho pendente. A fase poll é onde Node aguarda I/O — é por isso que Node consegue servir milhares de conexões simultâneas com uma única thread.",
    },
    {
      title: "libuv — thread pool vs async nativo: o que vai pra onde",
      html: `<style>
.nluv-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.nluv-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(104,160,99,.5);display:inline}
.nluv-tip:hover .nluv-tb{display:block}
.nluv-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.8)}
.nluv-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.nluv-col{background:#1e293b;border-radius:10px;padding:14px 16px;flex:1}
.nluv-badge{display:inline-block;border-radius:4px;padding:2px 7px;font-size:9px;font-weight:700;letter-spacing:.05em}
@keyframes nluv-pulse{0%,100%{opacity:.5}50%{opacity:1}}
.nluv-arrow{color:#475569;text-align:center;font-size:18px;animation:nluv-pulse 2s ease-in-out infinite;margin:6px 0}
</style>
<div class="nluv-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">libuv — async nativo vs thread pool</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos itens para entender onde cada operacao executa</p>
<div style="background:#1e293b;border:1.5px solid #68A063;border-radius:10px;padding:12px 16px;margin-bottom:10px;text-align:center">
  <div style="color:#68A063;font-weight:700;font-size:11px;margin-bottom:4px">Seu código JavaScript (V8 — thread principal)</div>
  <div style="color:#64748b;font-size:10px">fetch, fs.readFile, crypto.pbkdf2 — você chama, Node decide onde executar</div>
</div>
<div class="nluv-arrow">↓</div>
<div style="background:#0d1829;border:1.5px solid #334155;border-radius:10px;padding:14px;margin:4px 0">
  <div style="color:#94a3b8;font-size:10px;font-weight:700;letter-spacing:.08em;text-align:center;margin-bottom:14px">libuv (C) — abstração de I/O multiplataforma</div>
  <div style="display:flex;gap:12px">
    <div class="nluv-col">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
        <span class="nluv-badge" style="background:rgba(104,160,99,.15);color:#68A063">ASYNC NATIVO</span>
        <span style="font-size:9px;color:#475569">sem thread extra</span>
      </div>
      <div style="font-size:10px;color:#475569;line-height:2.2">
        <span class="nluv-tip" style="color:#94a3b8">TCP/UDP sockets<span class="nluv-tb">Rede usa epoll (Linux), kqueue (macOS) ou IOCP (Windows) — o OS notifica libuv quando dados chegam. Zero threads extras. Base de toda API HTTP Node.</span></span><br>
        <span class="nluv-tip" style="color:#94a3b8">HTTP/TLS (openssl)<span class="nluv-tb">Handshake TLS e leitura de dados HTTP são async via libuv + openssl. Não vai ao thread pool.</span></span><br>
        <span class="nluv-tip" style="color:#94a3b8">Pipes e signals<span class="nluv-tb">IPC pipes e sinais de processo são monitorados via mecanismo nativo do OS.</span></span><br>
        <span class="nluv-tip" style="color:#94a3b8">Timers (setTimeout)<span class="nluv-tb">Heap de timers gerenciado pelo event loop na fase timers. O OS não é envolvido diretamente para cada timer.</span></span>
      </div>
      <div style="margin-top:10px;background:rgba(104,160,99,.07);border:1px solid rgba(104,160,99,.2);border-radius:6px;padding:7px 10px;font-size:9px;color:#68A063">Kernel notifica libuv → callback vai para a fila → event loop executa</div>
    </div>
    <div class="nluv-col">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
        <span class="nluv-badge" style="background:rgba(239,68,68,.12);color:#ef4444">THREAD POOL</span>
        <span style="font-size:9px;color:#475569">default: 4 threads</span>
      </div>
      <div style="font-size:10px;color:#475569;line-height:2.2">
        <span class="nluv-tip" style="color:#94a3b8">fs.* (maioria)<span class="nluv-tb">readFile, writeFile, stat vão ao thread pool porque AIO nativo não existe confiável em todos OS.</span></span><br>
        <span class="nluv-tip" style="color:#94a3b8">crypto (pbkdf2, scrypt)<span class="nluv-tb">Hashing intensivo vai ao thread pool. Com 4 threads, só 4 operações de hashing rodam em paralelo.</span></span><br>
        <span class="nluv-tip" style="color:#94a3b8">dns.lookup()<span class="nluv-tb">Resolução DNS via getaddrinfo() do OS vai ao thread pool. Prefira dns.resolve() (async nativo via c-ares) em alta escala.</span></span><br>
        <span class="nluv-tip" style="color:#94a3b8">zlib (compressão)<span class="nluv-tb">Compress/decompress via uv_queue_work — vai ao thread pool.</span></span>
      </div>
      <div style="margin-top:10px;background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.2);border-radius:6px;padding:7px 10px;font-size:9px;color:#ef4444">Thread executa → completa → callback volta ao event loop via poll</div>
    </div>
  </div>
  <div style="margin-top:12px;background:#1e293b;border-radius:8px;padding:10px 12px;font-size:10px;color:#475569;line-height:1.7"><strong style="color:#94a3b8">Implicação prática:</strong> aumente <code style="color:#68A063">UV_THREADPOOL_SIZE=8</code> quando tiver muitas operações de fs/crypto em paralelo. Não ajuda para TCP/HTTP — esses já são async nativos.</div>
</div>
<div class="nluv-arrow">↓</div>
<div style="background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:12px 16px;text-align:center;margin-top:4px">
  <div style="color:#94a3b8;font-size:11px;font-weight:700">Event Loop — callback retorna à thread principal</div>
  <div style="color:#64748b;font-size:10px;margin-top:4px">Você nunca toca em threads — libuv gerencia tudo e avisa o loop quando terminado</div>
</div>
</div>`,
      caption: "O insight crítico: Node não é 'async em tudo' — fs e crypto usam um thread pool real. Em produção com muitas operações de hashing simultâneas (bcrypt), você pode estar limitado pelas 4 threads padrão. A solução: UV_THREADPOOL_SIZE ou worker_threads.",
    },
    {
      title: "Streams e backpressure — como pipe() controla o fluxo de dados",
      html: `<style>
.nstr-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.nstr-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(104,160,99,.5);display:inline}
.nstr-tip:hover .nstr-tb{display:block}
.nstr-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.nstr-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes nstr-flow{0%{left:-16px;opacity:0}20%{opacity:1}80%{opacity:1}100%{left:calc(100% + 16px);opacity:0}}
.nstr-chunk{position:absolute;width:14px;height:14px;border-radius:3px;top:50%;transform:translateY(-50%);animation:nstr-flow 1.8s linear infinite}
.nstr-pipe{position:relative;height:28px;overflow:hidden;border-radius:4px}
@keyframes nstr-warn{0%,100%{background:rgba(239,68,68,.08)}50%{background:rgba(239,68,68,.22)}}
.nstr-warn{animation:nstr-warn 1.2s ease-in-out infinite}
</style>
<div class="nstr-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Streams e Backpressure</p>
<p style="color:#475569;font-size:10px;margin:0 0 18px">Por que pipe() é preferível a read()/write() manual — e como o backpressure protege a memória</p>
<div style="margin-bottom:18px">
  <div style="font-size:10px;color:#ef4444;font-weight:700;margin-bottom:8px;letter-spacing:.06em">SEM BACKPRESSURE — read manual, memória explode</div>
  <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
    <div style="background:#1e293b;border:1.5px solid rgba(104,160,99,.4);border-radius:8px;padding:10px 14px;font-size:11px;color:#68A063;min-width:90px;text-align:center"><div style="font-weight:700">Readable</div><div style="font-size:9px;color:#475569;margin-top:2px">arquivo 10 GB</div></div>
    <div style="flex:1;min-width:60px">
      <div class="nstr-pipe" style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3)">
        <div class="nstr-chunk" style="background:#ef4444;animation-delay:0s"></div>
        <div class="nstr-chunk" style="background:#ef4444;animation-delay:.3s"></div>
        <div class="nstr-chunk" style="background:#ef4444;animation-delay:.6s"></div>
        <div class="nstr-chunk" style="background:#ef4444;animation-delay:.9s"></div>
        <div class="nstr-chunk" style="background:#ef4444;animation-delay:1.2s"></div>
      </div>
      <div style="font-size:9px;color:#ef4444;text-align:center;margin-top:3px">dados chegam mais rápido que escrita</div>
    </div>
    <div class="nstr-warn" style="border:1.5px solid rgba(239,68,68,.4);border-radius:8px;padding:10px 14px;font-size:11px;color:#ef4444;min-width:90px;text-align:center"><div style="font-weight:700">Writable</div><div style="font-size:9px;margin-top:2px">buffer lotando → OOM crash</div></div>
  </div>
  <div style="margin-top:8px;background:#1e293b;border-radius:6px;padding:8px 12px;font-size:10px;color:#64748b"><code style="color:#ef4444">readable.on('data', chunk =&gt; writable.write(chunk))</code> — escrita mais lenta que leitura: buffer cresce sem limite → OutOfMemory</div>
</div>
<div>
  <div style="font-size:10px;color:#68A063;font-weight:700;margin-bottom:8px;letter-spacing:.06em">COM PIPE() — backpressure automático</div>
  <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
    <div style="background:#1e293b;border:1.5px solid rgba(104,160,99,.4);border-radius:8px;padding:10px 14px;font-size:11px;color:#68A063;min-width:90px;text-align:center"><div style="font-weight:700">Readable</div><div style="font-size:9px;color:#475569;margin-top:2px"><span class="nstr-tip">pausa<span class="nstr-tb">Quando write() retorna false, pipe() chama readable.pause() — para de emitir chunks até o Writable drenar.</span></span> quando sinalizado</div></div>
    <div style="flex:1;min-width:60px">
      <div class="nstr-pipe" style="background:rgba(104,160,99,.08);border:1px solid rgba(104,160,99,.3)">
        <div class="nstr-chunk" style="background:#68A063;animation-delay:0s"></div>
        <div class="nstr-chunk" style="background:#68A063;animation-delay:.6s"></div>
        <div class="nstr-chunk" style="background:#68A063;animation-delay:1.2s"></div>
      </div>
      <div style="font-size:9px;color:#68A063;text-align:center;margin-top:3px">ritmo controlado — highWaterMark respeitado</div>
    </div>
    <div style="background:#1e293b;border:1.5px solid rgba(104,160,99,.4);border-radius:8px;padding:10px 14px;font-size:11px;color:#68A063;min-width:90px;text-align:center"><div style="font-weight:700">Writable</div><div style="font-size:9px;color:#475569;margin-top:2px">drena → emite <span class="nstr-tip">drain<span class="nstr-tb">Evento 'drain' emitido quando buffer drena abaixo do highWaterMark. pipe() chama readable.resume() ao ouvi-lo.</span></span></div></div>
  </div>
  <div style="margin-top:8px;background:#1e293b;border-radius:6px;padding:8px 12px;font-size:10px;color:#64748b"><code style="color:#68A063">readable.pipe(writable)</code> — gerencia pause/resume automaticamente. Forma moderna: <code style="color:#68A063">pipeline(readable, transform, writable)</code> do node:stream — também gerencia erros e cleanup.</div>
</div>
<div style="margin-top:16px;background:#1e293b;border-radius:8px;padding:12px 16px;border:1px solid #1e3a5f">
  <div style="font-size:9px;color:#3b82f6;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">highWaterMark — o controle do buffer</div>
  <div style="font-size:11px;color:#64748b;line-height:1.8"><span class="nstr-tip" style="color:#94a3b8">highWaterMark<span class="nstr-tb">Tamanho máximo do buffer interno. Default: 16 KB para bytes, 16 objetos para objectMode. Ajuste para o seu caso.</span></span> = 16 * 1024 bytes (default)<br>Quando buffer supera hwm: <code style="color:#ef4444">write()</code> retorna <code style="color:#ef4444">false</code><br>Quando buffer drena: emite <code style="color:#68A063">'drain'</code><br><code style="color:#68A063">pipeline()</code> do node:stream é a forma moderna — gerencia backpressure E erros</div>
</div>
</div>`,
      caption: "Streams são essenciais para processar arquivos grandes, servir downloads ou fazer proxy de dados entre serviços. Sem backpressure, qualquer pipeline pode consumir memória ilimitada e derrubar o processo.",
    },
  ],
  keypoints: [
    {
      title: "Event Loop — 6 fases e microtasks",
      body: "O event loop é o coração do Node.js. Roda em single-thread e processa callbacks em 6 fases sequenciais: (1) timers — setTimeout/setInterval expirados; (2) pending I/O — callbacks adiados; (3) idle/prepare — uso interno; (4) poll — busca novos eventos de I/O, aguarda se vazio; (5) check — setImmediate; (6) close callbacks. Entre CADA fase, process.nextTick e microtasks de Promise drenam completamente antes de avançar. Essa prioridade explica por que nextTick recursivo pode starvar o loop.",
      code: `// Ordem de execução — prioridades do event loop
Promise.resolve().then(() => console.log('1 - Promise microtask'))
process.nextTick(() => console.log('2 - nextTick'))  // mais alta prioridade
setImmediate(() => console.log('3 - setImmediate'))  // fase check
setTimeout(() => console.log('4 - setTimeout 0'), 0) // fase timers

// Output: 2 → 1 → 3 ou 4 (ordem timers/check varia fora de I/O)
// nextTick sempre antes de Promise.then, ambos antes de qualquer fase`,
    },
    {
      title: "libuv — thread pool e async nativo",
      body: "libuv é a biblioteca C que dá ao Node I/O assíncrono multiplataforma. Nem tudo é 'async puro': rede (TCP, HTTP, UDP) usa mecanismos do kernel (epoll, kqueue, IOCP) sem threads extras. Mas fs.*, crypto (pbkdf2, scrypt), dns.lookup() e zlib vão para o thread pool — default 4 threads. Se você tem muitas operações de hashing simultâneas, pode estar limitado pelas 4 threads. Solução: UV_THREADPOOL_SIZE=16. dns.resolve() usa c-ares (async nativo) — prefira-o em alta escala.",
      code: `// Thread pool em ação — UV_THREADPOOL_SIZE determina paralelismo real
import { pbkdf2 } from 'node:crypto'

// Com 4 threads (default): as primeiras 4 rodam em paralelo,
// a 5ª espera uma thread livre
for (let i = 0; i < 5; i++) {
pbkdf2('senha', 'sal', 100000, 64, 'sha512', (err, key) => {
  console.log(\`hash \${i} concluído\`)
})
}
// UV_THREADPOOL_SIZE deve ser definido ANTES de qualquer require/import de crypto`,
    },
    {
      title: "Streams — Readable, Writable, Transform e Duplex",
      body: "Streams processam dados em chunks sem carregar tudo em memória. Quatro tipos: Readable (fonte), Writable (destino), Transform (transforma em trânsito), Duplex (bidirecional). pipe() conecta streams e gerencia backpressure automaticamente. Para pipelines com tratamento de erro, use stream.pipeline() — pipe() sozinho não propaga erros. highWaterMark controla o buffer interno — quando lotado, write() retorna false e Readable pausa via drain.",
      code: `import { createReadStream, createWriteStream } from 'node:fs'
import { createGzip } from 'node:zlib'
import { pipeline } from 'node:stream/promises'

// pipeline() é a forma moderna: gerencia backpressure E erros
await pipeline(
createReadStream('arquivo.log'),
createGzip(),
createWriteStream('arquivo.gz'),
)

// Transform stream customizado
import { Transform } from 'node:stream'
const upperCase = new Transform({
transform(chunk, _enc, callback) {
  callback(null, chunk.toString().toUpperCase())
}
})`,
    },
    {
      title: "Worker Threads — CPU-bound sem fork overhead",
      body: "worker_threads permite rodar JavaScript em threads separadas dentro do mesmo processo, compartilhando memória via SharedArrayBuffer. É a solução para CPU-bound real sem criar processos separados. Threads se comunicam via postMessage. Use parentPort.postMessage no worker e worker.on('message') no pai. Casos de uso: parsing de JSON gigante, compressão, criptografia pesada, algoritmos computacionalmente intensivos. Use um pool de workers — criação tem overhead.",
      code: `// main.ts — thread principal
import { Worker } from 'node:worker_threads'

function runCPUTask(data: number[]): Promise<number> {
return new Promise((resolve, reject) => {
  const worker = new Worker('./cpu-worker.js', { workerData: data })
  worker.on('message', resolve)
  worker.on('error', reject)
})
}

// cpu-worker.js — roda em thread separada
import { workerData, parentPort } from 'node:worker_threads'
const result = workerData.reduce((sum: number, n: number) => sum + n, 0)
parentPort?.postMessage(result)

// SharedArrayBuffer — memória compartilhada e thread-safe
const shared = new SharedArrayBuffer(4)
Atomics.add(new Int32Array(shared), 0, 1)`,
    },
    {
      title: "Cluster — múltiplos processos para escalar CPU",
      body: "O módulo cluster cria processos filhos Node que compartilham a mesma porta TCP. O master distribui conexões para workers usando round-robin. Ideal para aproveitar múltiplos núcleos sem mudar o código de negócio. Em produção, prefira PM2 (que usa cluster internamente) ou containers escalados horizontalmente. Diferença de worker_threads: cluster cria processos separados — mais isolados, mais pesados de criar, sem memória compartilhada.",
      code: `import cluster from 'node:cluster'
import { availableParallelism } from 'node:os'
import http from 'node:http'

if (cluster.isPrimary) {
const numCPUs = availableParallelism()
for (let i = 0; i < numCPUs; i++) cluster.fork()
cluster.on('exit', (worker) => {
  console.log(\`Worker \${worker.process.pid} caiu. Reiniciando...\`)
  cluster.fork()  // auto-restart
})
} else {
http.createServer((req, res) => {
  res.end(\`Worker \${process.pid}\`)
}).listen(3000)
}`,
    },
    {
      title: "EventEmitter — padrão pub/sub e memory leaks",
      body: "EventEmitter é a base de quase tudo no Node (streams, http.Server, process). Cuidado crítico: cada addListener adiciona uma referência — se você adiciona listeners em closures sem remover, o objeto nunca é garbage-collected. Use emitter.once() para listeners de execução única. Node avisa quando um emitter tem mais de 10 listeners (setMaxListeners). Remova com removeListener/off(). É a causa mais comum de memory leak em aplicações Node.",
      code: `import { EventEmitter } from 'node:events'

class Pipeline extends EventEmitter {
process(data: Buffer) {
  this.emit('chunk', data)
  this.emit('progress', data.length)
}
}

const pipeline = new Pipeline()
pipeline.setMaxListeners(20)

// once() — escuta uma vez e remove automaticamente
pipeline.once('chunk', (data) => console.log('primeiro chunk:', data.length))

// Sempre remova listeners quando não precisar mais
const onProgress = (bytes: number) => console.log(bytes)
pipeline.on('progress', onProgress)
pipeline.off('progress', onProgress)  // evita memory leak`,
    },
    {
      title: "Promises, async/await e padrões de concorrência",
      body: "async/await é a forma moderna de código assíncrono. Armadilha clássica: await em loop for executa sequencialmente. Use Promise.all() para paralelismo, Promise.allSettled() quando quer todos os resultados mesmo com falhas, Promise.race() para o primeiro. Limite de concorrência é crítico em produção — não faça 1000 requests paralelos; use p-limit ou implemente semáforo manualmente.",
      code: `// Sequencial — total: N * latência (evite)
for (const id of ids) {
const data = await fetch(\`/api/\${id}\`)
}

// Paralelo com Promise.all — todos simultâneos
const results = await Promise.all(ids.map(id => fetch(\`/api/\${id}\`)))

// Paralelo com limite de concorrência
import pLimit from 'p-limit'
const limit = pLimit(5)  // máximo 5 simultâneos
const limited = await Promise.all(
ids.map(id => limit(() => fetch(\`/api/\${id}\`)))
)

// allSettled — não lança se algum falhar
const all = await Promise.allSettled(requests)
const ok = all.filter(r => r.status === 'fulfilled')`,
    },
    {
      title: "AsyncLocalStorage — contexto propagado em código assíncrono",
      body: "AsyncLocalStorage (node:async_hooks) resolve como passar contexto (request ID, usuário, trace ID) pela cadeia de chamadas assíncronas sem poluir cada função com parâmetro extra. Funciona com async_hooks: cada operação assíncrona herda automaticamente o contexto da operação que a criou. Quando você faz store.run(ctx, fn), todo código que fn executar — incluindo todos os awaits — pode acessar ctx via store.getStore(). Estável e adequado para produção no Node 16+.",
      code: `import { AsyncLocalStorage } from 'node:async_hooks'

const store = new AsyncLocalStorage<{ requestId: string; userId?: string }>()

// Middleware — inicia contexto por request
app.use((req, res, next) => {
store.run({ requestId: crypto.randomUUID(), userId: req.user?.id }, next)
})

// Serviço — acessa contexto sem receber como parâmetro
function logOperation(msg: string) {
const ctx = store.getStore()
logger.info({ ...ctx, msg })  // { requestId, userId, msg }
}

async function userService() {
await db.query('...')
logOperation('query executada')  // ctx disponível aqui também
}`,
    },
    {
      title: "Graceful shutdown — SIGTERM e cleanup para containers",
      body: "Kubernetes envia SIGTERM e aguarda terminationGracePeriodSeconds (default 30s) antes de forçar SIGKILL. Sem handler SIGTERM, o processo encerra imediatamente, abortando requests em voo e deixando conexões abertas. Sequência correta: (1) sinalizar saúde degradada; (2) parar de aceitar novas conexões; (3) aguardar requests ativos; (4) fechar recursos (banco, Redis, filas); (5) process.exit(0).",
      code: `const server = app.listen(3000)

async function shutdown(signal: string) {
console.log(\`\${signal} recebido — graceful shutdown\`)

// 1. Para de aceitar novos requests
server.close()

// 2. Aguarda operações em voo com timeout de segurança
await Promise.race([
  new Promise(r => server.on('close', r)),
  new Promise(r => setTimeout(r, 10_000))  // força encerramento após 10s
])

await db.destroy()   // 3. Fecha pool de banco
await redis.quit()   // 4. Fecha conexão Redis
process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT',  () => shutdown('SIGINT'))`,
    },
    {
      title: "Segurança — crypto nativo, env e proteção de processo",
      body: "Segurança em Node: não exponha secrets em código (use .env + zod para validar no startup), use crypto nativo para hashing (scrypt para senhas, randomBytes para tokens), valide toda entrada, configure rate limiting, use helmet em Express/Fastify para headers de segurança. Para JWT: RS256 (assimétrico) em vez de HS256 em multi-serviço. process.env não é tipado — valide no startup e falhe imediatamente se faltando.",
      code: `import { z } from 'zod'
import { randomBytes, scrypt } from 'node:crypto'
import { promisify } from 'node:util'

// Valide process.env no startup — falha rápido se faltando config
const env = z.object({
DATABASE_URL: z.string().url(),
JWT_SECRET: z.string().min(32),
PORT: z.coerce.number().default(3000),
}).parse(process.env)

// Hash de senha com scrypt (nativo, sem deps)
const scryptAsync = promisify(scrypt)
async function hashPassword(password: string): Promise<string> {
const salt = randomBytes(16).toString('hex')
const key = await scryptAsync(password, salt, 64) as Buffer
return \`\${salt}:\${key.toString('hex')}\`
}

// Token seguro para reset de senha ou API keys
const token = randomBytes(32).toString('hex')  // 64 chars hex`,
    },
    {
      title: "ESM vs CommonJS — interoperabilidade e migração",
      body: "Node suporta CJS (require/module.exports) e ESM (import/export). ESM é o padrão moderno — suporta tree-shaking, top-level await, import dinâmico nativo. CJS é síncrono e legado. Misturar é possível mas traiçoeiro: ESM pode importar CJS (mas não o contrário de forma síncrona). Em projetos novos, use ESM com 'type': 'module' no package.json. Para TypeScript, configure module: 'NodeNext' e moduleResolution: 'NodeNext'.",
      code: `// package.json
{ "type": "module" }  // → .js vira ESM; .cjs vira CJS

// ESM — import estático com prefixo node:
import { readFile } from 'node:fs/promises'
import config from './config.json' assert { type: 'json' }

// Import dinâmico — carrega sob demanda, funciona em ambos
const { default: heavy } = await import('./heavy-module.js')

// Top-level await — só em ESM
const data = await fetchConfig()

// CJS importando ESM (quando necessário)
// require() não funciona em ESM — use import() dinâmico:
const esm = await import('./esm-only.mjs')`,
    },
  ],
  mnemonics: [
    {
      label: "Fases do Event Loop: TPIPCC",
      trick: "Timers → Pending I/O → Idle/prepare → Poll → Check → Close",
      explanation: "'Todo Programador Ignorante Pula Código Crítico' — Timers, Pending I/O, Idle/prepare, Poll (fase principal), Check (setImmediate), Close callbacks. Entre cada fase: nextTick + Promises drenam primeiro.",
    },
    {
      label: "libuv thread pool — Quais operações VÃO ao pool",
      trick: "F-C-D-Z: Filesystem, Crypto, DNS lookup, Zlib",
      explanation: "'Fui Com Dois Zumbis' — fs.*, crypto (pbkdf2/scrypt), dns.lookup(), zlib. Tudo o mais (TCP, HTTP, UDP, pipes, timers) é async nativo via epoll/kqueue/IOCP, sem usar thread do pool. O pool tem 4 threads por padrão — aumente com UV_THREADPOOL_SIZE quando fizer hashing em paralelo.",
    },
    {
      label: "nextTick vs setImmediate — regra de decisão",
      trick: "nextTick = ANTES de qualquer I/O; setImmediate = APÓS o I/O do ciclo atual",
      explanation: "Pergunte: 'quero rodar antes de qualquer fase do event loop?' → nextTick (e Promise.then). 'Quero rodar depois que o I/O atual drena, na fase check?' → setImmediate. Regra de ouro: fora de callback de I/O, a ordem setTimeout(0) vs setImmediate não é garantida. Dentro de callback de I/O, setImmediate sempre vem antes de setTimeout(0).",
    },
  ],
  cheatsheet: {
    title: "Node.js — APIs e padrões essenciais",
    html: `<style>
.ncs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px}
.ncs-h{font-size:9px;color:#68A063;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:14px 0 6px}
.ncs-h:first-child{margin-top:0}
.ncs-t{width:100%;border-collapse:collapse}
.ncs-t td{border-bottom:1px solid #1e293b;padding:7px 10px;font-size:10px;vertical-align:top}
.ncs-t tr:last-child td{border-bottom:none}
.ncs-t td:first-child{color:#94a3b8;white-space:nowrap;padding-right:16px;min-width:160px}
.ncs-t td:last-child{color:#64748b;line-height:1.5}
.ncs-code{color:#68A063;background:rgba(104,160,99,.1);padding:1px 5px;border-radius:3px;font-size:9px}
</style>
<div class="ncs-wrap">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
  <div>
    <div class="ncs-h">EventEmitter</div>
    <table class="ncs-t">
      <tr><td><span class="ncs-code">emitter.on(evt, fn)</span></td><td>Listener persistente</td></tr>
      <tr><td><span class="ncs-code">emitter.once(evt, fn)</span></td><td>Escuta uma vez, remove automaticamente</td></tr>
      <tr><td><span class="ncs-code">emitter.off(evt, fn)</span></td><td>Remove listener (evita memory leak)</td></tr>
      <tr><td><span class="ncs-code">emitter.emit(evt, args)</span></td><td>Dispara evento sincronamente</td></tr>
      <tr><td><span class="ncs-code">setMaxListeners(n)</span></td><td>Aumenta limite (default 10)</td></tr>
      <tr><td><span class="ncs-code">EventEmitter.once(ee, e)</span></td><td>Promisifica evento único</td></tr>
    </table>
    <div class="ncs-h">Streams</div>
    <table class="ncs-t">
      <tr><td><span class="ncs-code">stream.pipeline()</span></td><td>Conecta com backpressure + erro</td></tr>
      <tr><td><span class="ncs-code">Readable.from(iter)</span></td><td>Readable de array ou generator</td></tr>
      <tr><td><span class="ncs-code">stream.finished()</span></td><td>Promise quando stream fecha</td></tr>
      <tr><td><span class="ncs-code">highWaterMark</span></td><td>Buffer interno (default 16 KB)</td></tr>
      <tr><td><span class="ncs-code">objectMode: true</span></td><td>Stream de objetos JS (não bytes)</td></tr>
    </table>
    <div class="ncs-h">Crypto (nativo)</div>
    <table class="ncs-t">
      <tr><td><span class="ncs-code">randomBytes(n)</span></td><td>N bytes aleatórios seguros</td></tr>
      <tr><td><span class="ncs-code">randomUUID()</span></td><td>UUID v4 criptograficamente seguro</td></tr>
      <tr><td><span class="ncs-code">scrypt(pwd, salt, len)</span></td><td>Hash de senha (promisifique)</td></tr>
      <tr><td><span class="ncs-code">createHash('sha256')</span></td><td>Hash de conteúdo (não para senhas)</td></tr>
      <tr><td><span class="ncs-code">createHmac('sha256', k)</span></td><td>HMAC para assinatura de dados</td></tr>
      <tr><td><span class="ncs-code">timingSafeEqual(a, b)</span></td><td>Comparação sem timing attack</td></tr>
    </table>
    <div class="ncs-h">Process</div>
    <table class="ncs-t">
      <tr><td><span class="ncs-code">process.env</span></td><td>Env vars (valide com zod no startup)</td></tr>
      <tr><td><span class="ncs-code">process.memoryUsage()</span></td><td>heapUsed, heapTotal, rss</td></tr>
      <tr><td><span class="ncs-code">process.hrtime.bigint()</span></td><td>Tempo nanosegundos (benchmarks)</td></tr>
      <tr><td><span class="ncs-code">process.nextTick(fn)</span></td><td>Microtask de maior prioridade</td></tr>
      <tr><td><span class="ncs-code">process.on('SIGTERM')</span></td><td>Graceful shutdown em containers</td></tr>
      <tr><td><span class="ncs-code">process.exit(code)</span></td><td>0 = sucesso, 1 = erro</td></tr>
    </table>
  </div>
  <div>
    <div class="ncs-h">Worker Threads</div>
    <table class="ncs-t">
      <tr><td><span class="ncs-code">new Worker(file, opts)</span></td><td>Cria worker thread</td></tr>
      <tr><td><span class="ncs-code">worker.postMessage(d)</span></td><td>Envia dado para worker</td></tr>
      <tr><td><span class="ncs-code">parentPort.postMessage</span></td><td>Worker responde ao pai</td></tr>
      <tr><td><span class="ncs-code">workerData</span></td><td>Dado inicial na criação</td></tr>
      <tr><td><span class="ncs-code">SharedArrayBuffer</span></td><td>Memória compartilhada entre threads</td></tr>
      <tr><td><span class="ncs-code">Atomics.add/wait/notify</span></td><td>Sincronização atômica</td></tr>
    </table>
    <div class="ncs-h">Cluster</div>
    <table class="ncs-t">
      <tr><td><span class="ncs-code">cluster.isPrimary</span></td><td>True no processo master</td></tr>
      <tr><td><span class="ncs-code">cluster.fork()</span></td><td>Cria processo worker filho</td></tr>
      <tr><td><span class="ncs-code">cluster.on('exit')</span></td><td>Detecta worker caído → reinicia</td></tr>
      <tr><td><span class="ncs-code">availableParallelism()</span></td><td>Número de CPUs lógicos</td></tr>
    </table>
    <div class="ncs-h">AsyncLocalStorage</div>
    <table class="ncs-t">
      <tr><td><span class="ncs-code">new AsyncLocalStorage()</span></td><td>Contexto propagado por cadeia async</td></tr>
      <tr><td><span class="ncs-code">store.run(ctx, fn)</span></td><td>Executa fn com ctx ativo</td></tr>
      <tr><td><span class="ncs-code">store.getStore()</span></td><td>Lê ctx de qualquer await abaixo</td></tr>
      <tr><td>Caso de uso</td><td>Request ID, user, trace sem prop drilling</td></tr>
    </table>
    <div class="ncs-h">Variáveis de ambiente críticas</div>
    <table class="ncs-t">
      <tr><td><span class="ncs-code">UV_THREADPOOL_SIZE</span></td><td>Threads libuv (default 4, máx 1024)</td></tr>
      <tr><td><span class="ncs-code">--max-old-space-size=N</span></td><td>Heap V8 máximo em MB</td></tr>
      <tr><td><span class="ncs-code">--inspect</span></td><td>Abre debugger (chrome://inspect)</td></tr>
      <tr><td><span class="ncs-code">NODE_ENV=production</span></td><td>Desabilita devtools, ativa otimizações</td></tr>
      <tr><td><span class="ncs-code">NODE_OPTIONS</span></td><td>Flags via env var</td></tr>
    </table>
    <div class="ncs-h">Debugging / Profiling</div>
    <table class="ncs-t">
      <tr><td><span class="ncs-code">node --inspect</span></td><td>Abre V8 Inspector (chrome://inspect)</td></tr>
      <tr><td><span class="ncs-code">v8.writeHeapSnapshot()</span></td><td>Gera .heapsnapshot para análise</td></tr>
      <tr><td><span class="ncs-code">node --prof</span></td><td>CPU profiling (gera isolate-*.log)</td></tr>
      <tr><td><span class="ncs-code">clinic doctor</span></td><td>Diagnóstico automático de performance</td></tr>
      <tr><td><span class="ncs-code">clinic flame</span></td><td>Flamegraph de CPU</td></tr>
    </table>
  </div>
</div>
</div>`,
    caption: "Referência rápida das APIs nativas mais usadas em produção. Prefira módulos nativos do Node (node:) antes de instalar dependências.",
  },
  gotchas: [
    "CPU-bound na thread principal bloqueia todo o event loop — todos os outros requests param de responder. Mesmo um JSON.parse() de um arquivo de 50 MB pode causar latência perceptível. Solução: worker_threads para CPU-bound real.",
    "process.nextTick recursivo starva o event loop — enquanto a fila de nextTick não esvaziar, Node não avança para I/O, timers ou setImmediate. O loop fica preso processando microtasks indefinidamente.",
    "Promise rejeitada sem .catch() ou try/catch — UnhandledPromiseRejection derruba o processo em Node 15+. Sempre trate rejeições, especialmente em loops assíncronos com Promise.all.",
    "Memory leak por event listener não removido — emitter.on() adiciona referência que impede garbage collection. Use emitter.once(), removeListener() ou off() quando o listener não for mais necessário.",
    "await em loop for...of executa sequencialmente — cada await espera o anterior completar. Para paralelismo real, colete as Promises e use Promise.all(). A diferença de performance pode ser de 10-100x.",
    "dns.lookup() vai ao thread pool — em alta escala com muitas resoluções DNS, isso pode saturar as 4 threads do libuv. Use dns.resolve() (async nativo via c-ares) ou aumente UV_THREADPOOL_SIZE.",
    "fs.readFile() sem streaming em arquivos grandes — carrega o arquivo inteiro na memória V8. Um arquivo de 1 GB ocupa 1 GB de heap. Use createReadStream() para processar em chunks.",
    "Sem graceful shutdown em containers — Kubernetes envia SIGTERM e aguarda terminationGracePeriodSeconds. Se o processo não responder, recebe SIGKILL e requests em voo são abortados. Sempre implemente handler SIGTERM.",
    "Variáveis de ambiente não validadas no startup — process.env é Record<string, string | undefined>. Acessar um valor undefined e usá-lo como string causa bugs silenciosos. Valide com zod no início do processo.",
    "pipe() não propaga erros — se um stream do meio de um pipeline lança um erro, pipe() não o encaminha para o Writable final. Use stream.pipeline() do node:stream que faz cleanup e propagação de erros corretamente.",
  ],
  interview: [
    {
      q: "Explique o event loop do Node.js em profundidade: fases, microtasks e prioridades.",
      level: 'senior',
      a: "<p>O event loop do Node.js é single-threaded e processa callbacks em <strong>6 fases sequenciais</strong>: (1) <strong>timers</strong> — setTimeout/setInterval expirados; (2) <strong>pending I/O</strong> — callbacks adiados; (3) <strong>idle/prepare</strong> — uso interno; (4) <strong>poll</strong> — fase principal, busca novos eventos e aguarda aqui quando vazia; (5) <strong>check</strong> — setImmediate; (6) <strong>close callbacks</strong>.</p><p>O detalhe crítico: <strong>process.nextTick e microtasks de Promise drenam completamente entre cada fase</strong>, antes de avançar. nextTick tem prioridade máxima — recursivo, pode starvar o loop.</p><p><strong>Prioridade:</strong> process.nextTick &gt; Promise.then &gt; setImmediate &gt; setTimeout(0). A ordem de setImmediate vs setTimeout(0) não é garantida fora de I/O — dentro de callback de I/O, setImmediate sempre vem antes.</p>",
      tip: "Desenhe o diagrama das 6 fases durante a entrevista. Mencione que nextTick e Promises drenam entre fases (não entre callbacks individuais). A armadilha de nextTick recursivo é o gotcha favorito — mencione proativamente.",
    },
    {
      q: "O que a libuv faz e qual a diferença entre async nativo e thread pool?",
      level: 'senior',
      a: "<p>libuv é a biblioteca C que abstrai I/O assíncrono multiplataforma — usa epoll (Linux), kqueue (macOS), IOCP (Windows).</p><p><strong>Async nativo (sem thread extra):</strong> rede (TCP, UDP, HTTP, TLS), pipes e signals. O kernel notifica a libuv quando dados chegam. Por isso Node consegue milhares de conexões em single-thread.</p><p><strong>Thread pool (default 4 threads):</strong> fs.*, crypto (pbkdf2, scrypt), dns.lookup(), zlib. Essas operações não têm AIO nativo confiável em todos OS.</p><p>Implicação: com muitas operações de hashing simultâneas, você pode estar limitado pelas 4 threads. Solução: aumentar UV_THREADPOOL_SIZE ou usar worker_threads. dns.resolve() usa c-ares (async nativo) — prefira em alta escala.</p>",
      tip: "Sêniors sabem que nem tudo é async — e conseguem dar exemplos concretos de quando o thread pool é gargalo. Mencionar UV_THREADPOOL_SIZE demonstra experiência de produção.",
    },
    {
      q: "Quando NÃO usar Node.js? Quais os limites do modelo?",
      a: "<p><strong>CPU-bound intenso:</strong> video encoding, compressão pesada, ML inference. Uma operação CPU-bound bloqueia todos os outros requests. Soluções: worker_threads, serviço dedicado Python/Go/Rust.</p><p><strong>Paralelismo de CPU com muitas threads:</strong> Go ou Rust são melhores — goroutines e threads nativas são mais eficientes que worker_threads para paralelismo real de CPU.</p><p><strong>Cálculo de ponto flutuante intensivo:</strong> Python com NumPy/PyTorch é mais eficiente — operações implementadas em C/Fortran.</p><p><strong>Node é excelente para:</strong> APIs REST e GraphQL, WebSockets, BFF, proxies, serverless, CLIs. Cobre 90%+ dos casos de backend de produto.</p>",
    },
    {
      q: "Qual a diferença entre setTimeout(fn, 0), setImmediate e process.nextTick?",
      a: "<p><strong>process.nextTick:</strong> roda antes da próxima fase, drenando a fila completamente. Maior prioridade que Promise.then. Recursivo, starva o event loop.</p><p><strong>Promise.then (microtask):</strong> drena após nextTick, antes de qualquer fase. nextTick &gt; Promise.then dentro do mesmo tick.</p><p><strong>setImmediate:</strong> fase check, logo após poll. Garantido no próximo ciclo, após I/O do ciclo atual.</p><p><strong>setTimeout(fn, 0):</strong> fase timers. Não é garantido imediato. <em>Fora de callback de I/O, ordem com setImmediate não é determinística</em>. Dentro de I/O, setImmediate sempre vem antes.</p>",
      tip: "O ponto que diferencia sênior: a ordem setTimeout(0) vs setImmediate não é garantida fora de I/O. Candidatos que dizem 'setImmediate é sempre antes' memorizaram sem entender.",
    },
    {
      q: "Como você debugaria um memory leak em produção no Node.js?",
      level: 'senior',
      a: "<p><strong>1. Confirmar que é leak:</strong> monitore process.memoryUsage().heapUsed ao longo do tempo. Crescimento contínuo sem platô após GC é sinal de leak.</p><p><strong>2. Reproduzir com carga:</strong> use autocannon ou wrk. clinic.js analisa e identifica o padrão.</p><p><strong>3. Tirar heap snapshots:</strong> via --inspect no Chrome DevTools ou v8.writeHeapSnapshot() programaticamente. Tire snapshot antes, durante e após carga.</p><p><strong>4. Analisar no Chrome DevTools:</strong> Memory → Load snapshot → Comparison. Filtre por objetos alocados entre snapshots. Procure objetos com muitas instâncias que crescem.</p><p><strong>Suspeitos comuns:</strong> event listeners sem remoção, cache sem limite de tamanho, closures retendo objetos grandes, timers não limpos, conexões não fechadas.</p>",
      tip: "Descreva o processo passo a passo como se já tivesse feito em produção. Mencionar clinic.js demonstra familiaridade com ferramentas reais. A progressão snapshot → comparação → filtrar objetos crescentes é o que entrevistadores querem ouvir.",
    },
    {
      q: "Como worker_threads difere de cluster? Quando usar cada um?",
      level: 'senior',
      a: "<p><strong>Cluster:</strong> processos Node separados via fork — heap V8 separado, event loop separado, libuv separada. Compartilham a mesma porta TCP. Isolamento total: um worker crashando não afeta os outros. IPC via JSON serializado. Ideal para <em>escalar I/O horizontalmente</em> em múltiplos cores.</p><p><strong>Worker Threads:</strong> threads dentro do mesmo processo — podem compartilhar memória via SharedArrayBuffer + Atomics. Overhead de criação menor. Ideal para <em>CPU-bound</em> com comunicação eficiente de dados grandes.</p><p><strong>Quando usar:</strong><br>Cluster → servidor HTTP/API que precisa de múltiplos cores. Em produção, PM2 ou containers fazem isso melhor.<br>Worker Threads → image processing, parsing de JSON gigante, criptografia pesada — qualquer coisa que bloquearia a thread principal.</p><p>Dica: use um pool de workers — criação tem overhead significativo.</p>",
    },
    {
      q: "O que é backpressure em streams e como pipe() o gerencia?",
      a: "<p><strong>Backpressure</strong> é o mecanismo pelo qual um Writable sinaliza que está processando mais dados do que consegue escrever, pedindo ao Readable que pause.</p><p>Sem backpressure: Readable produz mais rápido do que Writable consome → buffer cresce indefinidamente → OOM crash.</p><p><strong>Mecanismo:</strong> writable.write(chunk) retorna false quando o buffer ultrapassa highWaterMark (16KB padrão). Quando drena, Writable emite 'drain'.</p><p>pipe() gerencia isso: quando write() retorna false, chama readable.pause(); quando recebe 'drain', chama readable.resume().</p><p>Forma moderna: stream.pipeline() do node:stream — além do backpressure, faz cleanup e propagação de erros que pipe() não faz. Em async: stream.pipeline promisificado ou stream.compose().</p>",
      tip: "Explique o problema primeiro (memória estoura), depois o mecanismo (write() retorna false, drain), por último como pipe/pipeline abstrai. Mencionar que pipe() não propaga erros demonstra experiência real.",
    },
    {
      q: "Como AsyncLocalStorage permite rastreamento de contexto em código assíncrono?",
      level: 'senior',
      a: "<p>AsyncLocalStorage (node:async_hooks) resolve como passar contexto pela cadeia assíncrona sem poluir funções com parâmetros extras.</p><p>Funciona com async_hooks: cada operação assíncrona herda o contexto da operação que a criou. store.run(ctx, fn) → todo código que fn executar, incluindo awaits descendentes, pode acessar ctx via store.getStore().</p><pre><code>const store = new AsyncLocalStorage()\nstore.run({ requestId: uuid() }, next)  // middleware\nconst { requestId } = store.getStore()  // em qualquer serviço</code></pre><p>Uso principal: logging estruturado (requestId em todo log), rastreamento distribuído (trace ID propagado automaticamente), multi-tenancy (tenant ID disponível em todo serviço).</p><p>Performance: overhead real (5-10% em benchmarks), mas Node 16+ tem otimizações específicas que o tornam adequado para produção. Meça antes de adotar em sistemas sub-millisegundo.</p>",
    },
    {
      q: "Como implementar graceful shutdown para Kubernetes?",
      a: "<p>Kubernetes envia SIGTERM e aguarda terminationGracePeriodSeconds (default 30s) antes de forçar SIGKILL. Sem handler, processo encerra imediatamente abortando requests em voo.</p><p><strong>Sequência correta:</strong><br>1. Registrar handler SIGTERM (e SIGINT para dev)<br>2. Sinalizar saúde degradada no health check — Kubernetes para de enviar novos requests<br>3. server.close() — para de aceitar novas conexões<br>4. Aguardar requests ativos com timeout de segurança<br>5. Fechar recursos (banco, Redis, filas)<br>6. process.exit(0)</p><p>Detalhe: server.close() não fecha keep-alive connections — itere sobre conexões ativas e destrua as idle. A lib @godaddy/terminus abstrai tudo isso com API declarativa.</p>",
      tip: "A sequência completa com timeout de segurança e fechamento de recursos (não apenas server.close) é o que diferencia quem fez deploy real em Kubernetes.",
    },
    {
      q: "Como Node.js lida com erros não capturados?",
      a: "<p><strong>uncaughtException:</strong> captura erros síncronos não tratados. Em Node 15+, o comportamento padrão é encerrar o processo — o estado pode estar corrompido. Use apenas para logging e cleanup antes de sair, nunca para recuperar e continuar.</p><p><strong>unhandledRejection:</strong> Promise rejeitada sem .catch(). Em Node 15+, lança uncaughtException (encerra processo). Em versões anteriores, apenas warning.</p><pre><code>process.on('uncaughtException', (err) => {\n  logger.fatal({ err }, 'Uncaught exception — encerrando')\n  process.exit(1)\n})\nprocess.on('unhandledRejection', (reason) => {\n  logger.fatal({ reason }, 'Unhandled rejection')\n  process.exit(1)\n})</code></pre><p>Padrão correto: em async functions, sempre use try/catch ou deixe propagar. Promise.allSettled quando quer todos os resultados mesmo com falhas.</p>",
    },
    {
      q: "Como usar streams para processar um arquivo de 10 GB sem estourar memória?",
      a: "<p>O erro clássico: fs.readFile() carrega os 10 GB inteiros no heap V8. Em servidor com 4 GB de RAM, o processo trava.</p><p><strong>Solução com streams e pipeline:</strong></p><pre><code>await pipeline(\n  createReadStream('dados.csv'),\n  createInterface({ input: process.stdin }),\n  async function* (lines) {\n    for await (const line of lines) {\n      const row = parseLine(line)\n      yield JSON.stringify(row) + '\\n'\n    }\n  },\n  createWriteStream('saida.json'),\n)</code></pre><p>O pipeline() gerencia backpressure automaticamente — Readable só lê novos chunks quando Writable tem capacidade. Memória permanece constante (~16KB de buffer) independente do tamanho do arquivo.</p>",
      tip: "Mostrar o código com pipeline() e explicar que memória é constante porque backpressure controla o ritmo de leitura demonstra compreensão prática — não apenas teórica.",
    },
    {
      q: "Quais são as diferenças entre ESM e CJS em Node? Como lidar com interoperabilidade?",
      a: "<p><strong>CommonJS (CJS):</strong> require() síncrono, carrega e executa na hora. module.exports. Extensão .cjs ou 'type':'commonjs'. Suportado em todo Node.</p><p><strong>ESM:</strong> import/export estático (tree-shakeable), parse antes de executar. Top-level await. Suporta import() dinâmico. Extensão .mjs ou 'type':'module'. Estável no Node 14+.</p><p><strong>Interoperabilidade:</strong><br>• ESM pode importar CJS: import pkg from 'cjs-package'<br>• CJS NÃO pode require() ESM — deve usar import() dinâmico (assíncrono)<br>• TypeScript: module: 'NodeNext' + moduleResolution: 'NodeNext'</p><p>Para bibliotecas: publique dual format (CJS + ESM) usando exports no package.json. Para projetos novos: use ESM com 'type':'module' e prefixo node: nos módulos nativos.</p>",
    },
    {
      q: "O que é o Event Loop do Node.js em termos simples?",
      a: "<p>Node.js é single-threaded mas não bloqueia em I/O. Quando uma operação de I/O é iniciada (ler arquivo, fazer request HTTP, consultar banco), Node.js a delega ao sistema operacional via libuv e <em>continua executando o restante do código</em> — sem esperar a resposta. Quando a operação completa, a callback é adicionada à fila de eventos e executada pelo Event Loop quando a call stack estiver vazia.</p><p>É assim que Node consegue atender milhares de conexões simultâneas em uma única thread: a thread nunca fica bloqueada aguardando I/O. O problema surge com operações <strong>CPU-bound</strong> (cálculos pesados, compressão, hashing intensivo) — essas bloqueiam a única thread e impedem que outros requests sejam atendidos enquanto executam.</p>",
      tip: "Explicar o mecanismo de delegação ao SO e distinguir I/O-bound (Node excelente) de CPU-bound (Node problemático) mostra que você entende o modelo de fato.",
      level: "pleno",
    },
    {
      q: "Qual a diferença entre setTimeout(fn, 0) e setImmediate(fn)?",
      a: "<p>O Event Loop processa callbacks em fases ordenadas. <strong>setTimeout</strong> agenda a callback para a fase de <em>timers</em> — ela roda na próxima iteração do loop, mas o tempo exato depende do overhead do sistema e pode variar.</p><p><strong>setImmediate</strong> sempre executa na fase de <em>check</em>, após a fase de I/O da iteração atual. Dentro de callbacks de I/O: <code>setImmediate</code> <em>sempre</em> executa antes de <code>setTimeout(fn, 0)</code> — isso é garantido. Fora de callbacks de I/O (no topo do script): a ordem entre os dois é não-determinística e depende do estado do sistema.</p>",
      tip: "A não-determinismo fora de I/O é o ponto que separa quem memorizou de quem entende. Quem diz 'setImmediate é sempre antes' está errado — só dentro de I/O isso é garantido.",
      level: "pleno",
    },
    {
      q: "O que é process.nextTick e por que tem prioridade sobre Promises?",
      a: "<p><code>process.nextTick</code> não faz parte das fases do Event Loop — sua fila é drenada <em>antes</em> de o loop avançar para qualquer fase, inclusive antes das microtasks de Promise (<code>then</code>/<code>catch</code>). É a fila com maior prioridade em todo o Node.js.</p><p>Ordem de prioridade: <code>process.nextTick</code> &gt; <code>Promise.then</code> &gt; <code>setImmediate</code> &gt; <code>setTimeout(fn, 0)</code>. <strong>Cuidado crítico:</strong> nextTick recursivo (uma callback que agenda outra nextTick, que agenda outra...) <em>starva o Event Loop</em> — nenhuma fase de I/O é processada enquanto a fila não esgota. Isso pode bloquear todas as conexões de entrada em um servidor.</p>",
      tip: "A armadilha do nextTick recursivo é o gotcha favorito em entrevistas. Mencioná-la proativamente demonstra que você pensa em implicações de produção.",
      level: "pleno",
    },
    {
      q: "O que é CPU-bound work e como o Node.js lida com isso?",
      a: "<p>Operações CPU-bound são computações que consomem ciclos de processador sem aguardar I/O: hashing criptográfico pesado, encoding de vídeo, processamento de imagens, parsing de arquivos JSON gigantes. Essas operações <em>bloqueiam a única thread do Event Loop</em> durante toda a sua execução — nenhum outro request é atendido nesse período.</p><p><strong>Soluções:</strong> (1) <code>worker_threads</code>: cria threads reais dentro do mesmo processo, com SharedArrayBuffer para dados compartilhados — ideal para CPU-bound com comunicação eficiente. (2) <code>child_process</code>: offloa para processo Node separado — isolamento total mas IPC via serialização. (3) Serviço externo (Python, Go, Rust) para o trabalho pesado. A libuv thread pool (padrão: 4 threads) lida apenas com I/O assíncrono — não alivia CPU-bound puro.</p>",
      tip: "Distinguir I/O-bound (thread pool cuida) de CPU-bound (worker_threads ou serviço externo necessário) é o que diferencia compreensão real do modelo Node do conhecimento superficial.",
      level: "senior",
    },
    {
      q: "Como funciona o módulo cluster e quando preferir worker_threads?",
      a: "<p><strong>cluster</strong> cria múltiplos processos Node.js independentes (um por core de CPU) que compartilham a mesma porta TCP. O master distribui conexões entrantes para os workers via round-robin. Cada worker tem seu próprio heap V8, event loop e libuv — isolamento total. Um worker crashando não afeta os outros. IPC entre processos usa serialização JSON. Ideal para <em>escalar servidores HTTP</em> em múltiplos cores.</p><p><strong>worker_threads</strong> cria threads dentro do mesmo processo com memória compartilhável via SharedArrayBuffer e comunicação via Atomics — zero serialização para dados grandes. Overhead de criação menor que um processo. Ideal para <em>paralelismo CPU-bound</em> que precisa compartilhar dados eficientemente.</p><p>Regra prática: cluster para escalar servidores HTTP; worker_threads para tarefas CPU-bound que processam dados grandes dentro de um processo.</p>",
      level: "senior",
    },
    {
      q: "O que são Streams e como funciona o backpressure?",
      a: "<p>Streams processam dados em chunks sem carregar tudo na memória. Existem quatro tipos: Readable, Writable, Duplex e Transform. <code>pipe()</code> conecta Readable → Writable e gerencia backpressure automaticamente.</p><p><strong>Backpressure</strong>: quando <code>writable.write(chunk)</code> retorna <code>false</code>, o buffer do Writable atingiu o <code>highWaterMark</code> (16 KB padrão). <code>pipe()</code> detecta isso e chama <code>readable.pause()</code>. Quando o Writable drena, emite <code>'drain'</code> e <code>pipe()</code> chama <code>readable.resume()</code>. Sem backpressure, um Readable rápido e um Writable lento causam buffer crescente até OOM.</p><p>Prefira <code>stream.pipeline()</code> (módulo <code>node:stream</code>) ao invés de <code>pipe()</code>: além de backpressure, propaga erros automaticamente e faz cleanup — <code>pipe()</code> não destrói streams em caso de erro.</p>",
      tip: "Mencionar que pipe() não propaga erros (e por isso pipeline() é preferido) é o detalhe que distingue experiência real de teoria.",
      level: "senior",
    },
    {
      q: "Como identificar e corrigir memory leaks em Node.js?",
      a: "<p><strong>Diagnóstico:</strong> monitore <code>process.memoryUsage().heapUsed</code> ao longo do tempo — crescimento contínuo sem platô após GC é sinal claro de leak. Use <code>clinic.js heap</code> ou <code>--inspect</code> com Chrome DevTools para heap snapshots: tire três snapshots (baseline, após carga, após descanso) e compare objetos que crescem na view Comparison.</p><p><strong>Causas mais comuns:</strong> EventEmitters com listeners não removidos (sempre use <code>emitter.off()</code> ou <code>{ once: true }</code>), closures que retêm referências a objetos grandes, <code>setInterval</code> sem <code>clearInterval</code>, caches in-memory sem limite de tamanho ou TTL, conexões de banco/WebSocket que não são fechadas corretamente.</p><p><strong>Prevenção:</strong> use weak references (<code>WeakMap</code>, <code>WeakRef</code>) para caches associativos, defina tamanho máximo em caches (LRU-cache), e sempre limpe listeners em <code>onUnmounted</code>/cleanup functions.</p>",
      tip: "Clinic.js heap é a ferramenta padrão de produção para identificar leaks em Node. Mencioná-la junto à progressão snapshot→comparação→filtrar objetos crescentes mostra experiência real.",
      level: "senior",
    },
    {
      q: "Como implementar graceful shutdown em um servidor Node.js?",
      a: "<p>Kubernetes envia <code>SIGTERM</code> antes de matar o pod — graceful shutdown garante que requests em andamento completem sem serem abortados durante um deploy.</p><p><strong>Sequência correta:</strong> (1) capturar <code>SIGTERM</code> e <code>SIGINT</code> com <code>process.on()</code>; (2) sinalizar saúde degradada no health check (<code>/healthz</code>) para o load balancer parar de enviar novos requests; (3) <code>server.close()</code> para parar de aceitar novas conexões; (4) aguardar requests ativos completarem (rastrear com contador <code>activeRequests</code>); (5) fechar conexões com banco, Redis, filas; (6) <code>process.exit(0)</code>. Adicione um timeout de segurança (30s) para forçar saída caso requests travem.</p><p><strong>Detalhe crítico:</strong> <code>server.close()</code> não fecha conexões keep-alive existentes — itere sobre elas e destrua as idle manualmente, ou use a lib <code>@godaddy/terminus</code> que abstrai todo esse fluxo.</p>",
      tip: "A sequência completa com contador de requests ativos, timeout de segurança e fechamento de recursos — não apenas server.close() — é o que diferencia quem fez deploy real em Kubernetes.",
      level: "senior",
    },
  ],
  resources: [
    { title: "Node.js docs oficiais", url: "https://nodejs.org/en/docs/", kind: "docs" },
    { title: "libuv design overview", url: "https://docs.libuv.org/en/v1.x/design.html", kind: "docs" },
    { title: "Node.js event loop (guia oficial detalhado)", url: "https://nodejs.org/en/guides/event-loop-timers-and-nexttick", kind: "docs" },
    { title: "clinic.js — profiling de performance", url: "https://clinicjs.org/", kind: "pratica" },
    { title: "You Don't Know Node (event loop deep dive)", url: "https://www.youtube.com/watch?v=ztspvPYybIY", kind: "video" },
    { title: "Stream handbook (substack)", url: "https://github.com/substack/stream-handbook", kind: "artigo" },
    { title: "Node.js Design Patterns (livro)", url: "https://www.nodejsdesignpatterns.com/", kind: "livro" },
  ],
  videos: [
    { title: "Node.js Event Loop Explained", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=8aGhZQkoFbQ", topic: "event loop", note: "O melhor vídeo de introdução ao event loop. Visualiza claramente as fases e a fila de callbacks." },
    { title: "Node.js Streams Tutorial", channel: "Academind", url: "https://www.youtube.com/watch?v=GlybFFMXXmQ", topic: "streams e backpressure", note: "Cobre Readable, Writable, Transform, pipeline e backpressure com exemplos práticos." },
    { title: "Worker Threads in Node.js", channel: "Fireship", url: "https://www.youtube.com/watch?v=MuwJJrfIfsU", topic: "worker_threads", note: "Quando e como usar worker_threads para tarefas CPU-bound sem bloquear o event loop." },
    { title: "Node.js Cluster vs Worker Threads", channel: "Hussein Nasser", url: "https://www.youtube.com/watch?v=ZbX3guwku0s", topic: "cluster e paralelismo", note: "Comparativo aprofundado: quando usar cluster, quando usar worker_threads e por quê importa." },
    { title: "Debugging Memory Leaks in Node.js", channel: "NearForm", url: "https://www.youtube.com/watch?v=YfkocFiN2xY", topic: "memory leaks e debugging", note: "Passo a passo real de identificação e correção de memory leak com heap snapshots no Chrome DevTools." },
  ],
  exercises: [
    {
      level: "iniciante",
      title: "Servidor HTTP sem Express com roteamento manual",
      description: "Implemente um servidor HTTP puro com node:http (sem frameworks). Suporte pelo menos 4 rotas: GET /users, GET /users/:id, POST /users, DELETE /users/:id. Use um Map em memória como banco de dados. Implemente parsing manual do body JSON com um helper readBody(req): Promise<object>. Retorne status codes corretos: 200, 201, 404, 400. Adicione um logger que imprime método, path e duração de cada request. Não instale nenhum pacote — apenas módulos nativos do Node.",
      concepts: ["node:http", "url.parse", "readBody", "routing manual", "status codes", "logging"],
      hint: "Para extrair parâmetros de rota (:id), divida o path com split('/') e compare com o padrão. Para ler o body: new Promise(resolve => { const chunks = []; req.on('data', c => chunks.push(c)); req.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString()))) }).",
      relatedKeypoints: [0, 6],
    },
    {
      level: "intermediario",
      title: "Pipeline de streams para processar CSV grande sem OOM",
      description: "Crie um script que processa um arquivo CSV de 1 milhão de linhas (gere-o com um script separado) sem nunca carregar mais de 16KB na memória. Use stream.pipeline() do node:stream com: (1) fs.createReadStream('dados.csv'); (2) um Transform que divide por linha e faz parse de cada campo; (3) um Transform que filtra registros (ex: somente linhas onde valor > 1000); (4) um Transform que formata como JSON Lines; (5) fs.createWriteStream('saida.jsonl'). Verifique que o heap nunca ultrapassa 50 MB durante o processamento inteiro (use process.memoryUsage()).",
      concepts: ["stream.pipeline", "Transform stream", "backpressure", "highWaterMark", "CSV parsing", "JSONL"],
      hint: "Para dividir em linhas com buffer parcial: mantenha um lastLine string no Transform. Em _transform, concatene com o chunk, divida por '\\n', processe todos menos o último, guarde o último em lastLine. Em _flush, processe lastLine se não vazio. Isso garante que linhas que chegam divididas entre chunks sejam reconstruídas corretamente.",
      relatedKeypoints: [4, 6],
    },
    {
      level: "senior",
      title: "Worker thread pool para hashing intensivo sem bloquear o event loop",
      description: "Implemente um WorkerPool que mantém N workers (N = os.cpus().length). Cada worker recebe mensagens { id, payload } e realiza scrypt() em node:crypto, retornando { id, hash }. O pool gerencia fila de tarefas: se todos os workers estão ocupados, enfileira a tarefa e despacha quando um worker ficar livre. Implemente via worker_threads com SharedArrayBuffer + Atomics para comunicação de status (worker occupado/livre) sem polling. Meça com autocannon: compare o throughput do servidor (endpoint POST /hash) com e sem pool.",
      concepts: ["worker_threads", "SharedArrayBuffer", "Atomics", "pool pattern", "scrypt", "backpressure"],
      hint: "Cada worker roda em worker.js que importa { workerData, parentPort } de worker_threads. parentPort.on('message', ...) para receber, parentPort.postMessage para responder. No pool, mapeie worker.threadId → Promise para resolver quando o worker retornar. Use Atomics.store() + Atomics.notify() para acordar o thread principal quando um worker ficar livre.",
      relatedKeypoints: [5, 7],
    },
  ],
  codeExamples: [
    {
      title: "Servidor HTTP com graceful shutdown para Kubernetes",
      description: "Padrão de produção: servidor HTTP nativo com handler SIGTERM, cooldown para requests em voo, fechamento de recursos e exit limpo.",
      language: "typescript",
      code: `import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import { setTimeout as sleep } from 'node:timers/promises'

let isShuttingDown = false
let activeRequests = 0

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
if (isShuttingDown) {
  res.writeHead(503, { 'Connection': 'close' })
  res.end('Servidor encerrando — tente novamente em instantes')
  return
}
activeRequests++
try {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ ok: true, pid: process.pid }))
} finally {
  activeRequests--
}
})

server.listen(3000, () => console.log('Servidor ouvindo na porta 3000'))

async function gracefulShutdown(signal: string) {
console.log(\`\${signal} recebido — iniciando graceful shutdown\`)
isShuttingDown = true

// Para de aceitar novas conexões
server.close()

// Aguarda requests em voo (timeout de segurança: 25s antes do SIGKILL do K8s)
const deadline = Date.now() + 25_000
while (activeRequests > 0 && Date.now() < deadline) {
  console.log(\`Aguardando \${activeRequests} request(s) em voo...\`)
  await sleep(500)
}

if (activeRequests > 0) {
  console.warn(\`Forçando encerramento com \${activeRequests} request(s) em voo\`)
}

// Fecha recursos externos (banco, Redis, filas)
// await db.destroy()
// await redis.quit()

console.log('Shutdown completo')
process.exit(0)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT',  () => gracefulShutdown('SIGINT'))   // Ctrl+C em dev

// Erros não capturados: log + exit (nunca continue com estado corrompido)
process.on('uncaughtException', (err) => {
console.error('uncaughtException', err)
process.exit(1)
})
process.on('unhandledRejection', (reason) => {
console.error('unhandledRejection', reason)
process.exit(1)
})`,
    },
    {
      title: "Pipeline de streams com Transform: CSV → JSON filtrado",
      description: "Processamento de arquivo grande sem OOM. pipeline() gerencia backpressure e propaga erros — substitui pipe() em produção.",
      language: "typescript",
      code: `import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline, Transform } from 'node:stream'
import { promisify } from 'node:util'

const pipelineAsync = promisify(pipeline)

// Transform: buffer de linha → divide e parseia CSV
class CsvParser extends Transform {
private buffer = ''

constructor() { super({ readableObjectMode: true }) }

_transform(chunk: Buffer, _enc: string, cb: () => void) {
  this.buffer += chunk.toString()
  const lines = this.buffer.split('\\n')
  this.buffer = lines.pop() ?? ''  // última linha pode estar incompleta
  for (const line of lines) {
    if (line.trim()) {
      const [id, name, value] = line.split(',')
      this.push({ id, name, value: Number(value) })
    }
  }
  cb()
}

_flush(cb: () => void) {
  if (this.buffer.trim()) {
    const [id, name, value] = this.buffer.split(',')
    this.push({ id, name, value: Number(value) })
  }
  cb()
}
}

// Transform: filtra registros com valor > 1000
class ValueFilter extends Transform {
constructor() { super({ objectMode: true }) }
_transform(row: Record<string, unknown>, _enc: string, cb: () => void) {
  if (Number(row.value) > 1000) this.push(row)
  cb()
}
}

// Transform: objeto → JSON Lines (um JSON por linha)
class JsonLinesSerializer extends Transform {
constructor() { super({ writableObjectMode: true }) }
_transform(obj: unknown, _enc: string, cb: () => void) {
  this.push(JSON.stringify(obj) + '\\n')
  cb()
}
}

async function processLargeFile(input: string, output: string) {
console.time('pipeline')
await pipelineAsync(
  createReadStream(input),      // lê chunk a chunk (16KB)
  new CsvParser(),              // parseia CSV → objetos
  new ValueFilter(),            // filtra valor > 1000
  new JsonLinesSerializer(),    // serializa → JSON Lines
  createWriteStream(output),    // grava no arquivo
)
console.timeEnd('pipeline')
const { heapUsed } = process.memoryUsage()
console.log(\`Heap usada: \${(heapUsed / 1024 / 1024).toFixed(1)} MB\`)
}

processLargeFile('dados.csv', 'saida.jsonl').catch(console.error)`,
    },
    {
      title: "Worker thread pool para CPU-bound sem bloquear o event loop",
      description: "Pool de workers para hashing intensivo (scrypt). O event loop principal nunca bloqueia — cada hash roda em thread separada.",
      language: "typescript",
      code: `// worker.ts — roda em thread separada
import { workerData, parentPort } from 'node:worker_threads'
import { scrypt } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

parentPort!.on('message', async ({ id, password, salt }: {
id: string; password: string; salt: string
}) => {
const hash = await scryptAsync(password, salt, 64) as Buffer
parentPort!.postMessage({ id, hash: hash.toString('hex') })
})

// pool.ts — gerencia N workers
import { Worker } from 'node:worker_threads'
import { cpus } from 'node:os'
import { randomUUID } from 'node:crypto'

type Task = { resolve: (hash: string) => void; reject: (err: Error) => void }

class WorkerPool {
private workers: Worker[] = []
private freeWorkers: Worker[] = []
private queue: Array<{ msg: object } & Task> = []
private pending = new Map<string, Task>()

constructor(size = cpus().length) {
  for (let i = 0; i < size; i++) {
    const w = new Worker('./worker.ts', { execArgv: ['--require', 'ts-node/register'] })
    w.on('message', ({ id, hash, error }: { id: string; hash?: string; error?: string }) => {
      const task = this.pending.get(id)
      if (!task) return
      this.pending.delete(id)
      if (error) task.reject(new Error(error))
      else task.resolve(hash!)
      this.freeWorkers.push(w)
      this.dispatch()
    })
    this.freeWorkers.push(w)
    this.workers.push(w)
  }
}

private dispatch() {
  if (!this.queue.length || !this.freeWorkers.length) return
  const worker = this.freeWorkers.pop()!
  const { msg, resolve, reject } = this.queue.shift()!
  const id = randomUUID()
  this.pending.set(id, { resolve, reject })
  worker.postMessage({ ...msg, id })
}

run(msg: object): Promise<string> {
  return new Promise((resolve, reject) => {
    this.queue.push({ msg, resolve, reject })
    this.dispatch()
  })
}

async destroy() {
  await Promise.all(this.workers.map(w => w.terminate()))
}
}

// Uso no servidor HTTP — o event loop nunca bloqueia
const pool = new WorkerPool()
const hash = await pool.run({ password: 'secret', salt: 'saltvalue' })
console.log('Hash:', hash)`,
    },
  ],
  mindmap: {
    title: "Node.js — mapa de conceitos",
    html: `<style>
.ndm-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.ndm-center{background:rgba(104,160,99,.15);border:2px solid #68A063;border-radius:12px;padding:12px 20px;display:inline-block;font-size:13px;color:#68A063;font-weight:700;text-align:center;white-space:nowrap}
.ndm-branch{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:8px 12px;font-size:10px;color:#94a3b8;cursor:default;transition:border-color .2s}
.ndm-branch:hover{border-color:rgba(104,160,99,.5);color:#e2e8f0}
.ndm-leaf{font-size:9px;color:#475569;padding:2px 0;line-height:1.4}
</style>
<div class="ndm-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 18px;font-weight:600">Node.js — mapa mental</p>
<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center">
  <div style="display:flex;flex-direction:column;gap:8px">
    <div class="ndm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#68A063">Event Loop</div>
      <div class="ndm-leaf">6 fases: timers → pending I/O → idle → poll → check → close</div>
      <div class="ndm-leaf">nextTick + Promises drenam entre cada fase</div>
      <div class="ndm-leaf">Poll: "dorme" aqui quando ocioso</div>
    </div>
    <div class="ndm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#68A063">libuv</div>
      <div class="ndm-leaf">I/O nativo: epoll (Linux), kqueue (macOS), IOCP (Win)</div>
      <div class="ndm-leaf">Thread pool (4 threads): fs, crypto, dns.lookup, zlib</div>
      <div class="ndm-leaf">UV_THREADPOOL_SIZE para escalar</div>
    </div>
    <div class="ndm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#68A063">Streams</div>
      <div class="ndm-leaf">Readable | Writable | Transform | Duplex</div>
      <div class="ndm-leaf">backpressure: write() false → pause → drain → resume</div>
      <div class="ndm-leaf">stream.pipeline() — propagação de erros + cleanup</div>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
    <div class="ndm-center">Node.js</div>
    <div style="font-size:9px;color:#475569;text-align:center;margin-top:4px">Event loop single-thread<br>I/O não bloqueante via libuv</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:8px">
    <div class="ndm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#68A063">Paralelismo</div>
      <div class="ndm-leaf">Cluster: múltiplos processos Node (fork) — I/O horizontal</div>
      <div class="ndm-leaf">worker_threads: threads no mesmo processo — CPU-bound</div>
      <div class="ndm-leaf">SharedArrayBuffer + Atomics para estado compartilhado</div>
    </div>
    <div class="ndm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#68A063">Módulos Core</div>
      <div class="ndm-leaf">node:fs, node:path, node:http, node:stream, node:crypto</div>
      <div class="ndm-leaf">node:events (EventEmitter), node:process, node:buffer</div>
      <div class="ndm-leaf">node:async_hooks (AsyncLocalStorage)</div>
    </div>
    <div class="ndm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#68A063">Produção</div>
      <div class="ndm-leaf">Graceful shutdown: SIGTERM → server.close() → exit</div>
      <div class="ndm-leaf">Memory leak: heap snapshot + comparação no DevTools</div>
      <div class="ndm-leaf">clinic.js: flame graph, event loop delay, memory</div>
    </div>
  </div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid #1e293b">
  <div style="background:#1e293b;border-radius:6px;padding:8px 10px;font-size:9px;color:#475569">
    <div style="color:#68A063;font-weight:700;margin-bottom:3px">Prioridade de execução</div>
    process.nextTick (max) → Promise.then → setImmediate → setTimeout(0) → I/O callbacks
  </div>
  <div style="background:#1e293b;border-radius:6px;padding:8px 10px;font-size:9px;color:#475569">
    <div style="color:#ef4444;font-weight:700;margin-bottom:3px">Quando NÃO usar Node</div>
    CPU-bound intenso (video, ML) → Python/Go/Rust. Cálculo numérico pesado → NumPy. Paralelismo real de threads → Go.
  </div>
</div>
</div>`,
  },
}

export default nodeJs
