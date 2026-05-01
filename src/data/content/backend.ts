import type { SkillContentMap } from "@/types"

const data: SkillContentMap = {
  "node-js": {
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
  },

  "typeorm": {
    tagline: "ORM TypeScript/JS com ActiveRecord e DataMapper, forte integração com NestJS.",
    why: "TypeORM ainda domina em stack NestJS enterprise. Saber migrations, relations lazy/eager, QueryBuilder e os gotchas de N+1 é esperado em vaga backend TS sênior. Entender a diferença entre DataMapper e ActiveRecord e por que um é preferível em DDD diferencia pleno de sênior em entrevistas técnicas.",
    prerequisite: "TypeScript com decorators e reflect-metadata, SQL básico (JOIN, FK, índices), conceito de ORM e mapeamento objeto-relacional.",
    summary: "TypeORM suporta dois patterns: ActiveRecord (entidade herda BaseEntity e tem métodos de query estáticos) e DataMapper (repositório separado, entidade é POJO com decorators). Decorators TypeScript mapeiam entidades para tabelas com type safety via reflect-metadata. Suporta PostgreSQL, MySQL, SQLite, MongoDB. Integrado nativamente no NestJS. Pontos críticos: gerenciamento de migrations (nunca synchronize em produção), relations com carga explícita para evitar N+1, QueryBuilder para queries complexas, transações para atomicidade.",
    diagrams: [
      {
        title: "DataMapper vs ActiveRecord — dois caminhos, um banco",
        html: `<style>
.tor-dv-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tor-dv-card{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:14px 16px}
.tor-dv-label{font-size:9px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px;font-weight:600}
.tor-dv-code{font-size:10.5px;line-height:2;color:#94a3b8}
.tor-dv-kw{color:#7c3aed}
.tor-dv-dec{color:#E83524}
.tor-dv-str{color:#4ade80}
.tor-dv-cmt{color:#475569}
.tor-dv-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5)}
.tor-dv-tip:hover .tor-dv-tb{display:block}
.tor-dv-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.tor-dv-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes tor-dv-pulse{0%,100%{border-color:#334155}50%{border-color:#E83524}}
</style>
<div class="tor-dv-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">DataMapper vs ActiveRecord — dois caminhos para o mesmo banco</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span></p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
    <div class="tor-dv-card">
      <div class="tor-dv-label" style="color:#f59e0b">ActiveRecord</div>
      <div class="tor-dv-code">
        <span class="tor-dv-kw">@Entity</span>()<br>
        <span class="tor-dv-kw">class</span> <span style="color:#61DAFB">User</span> <span class="tor-dv-kw">extends</span> <span class="tor-dv-tip">BaseEntity<span class="tor-dv-tb">Herdar BaseEntity adiciona métodos estáticos como findOne, find, save, remove diretamente na classe da entidade.</span></span> {<br>
        &nbsp;<span class="tor-dv-dec">@PrimaryGeneratedColumn</span>()<br>
        &nbsp;id: <span style="color:#61DAFB">number</span><br>
        &nbsp;<span class="tor-dv-dec">@Column</span>()<br>
        &nbsp;name: <span style="color:#61DAFB">string</span><br>
        }<br><br>
        <span class="tor-dv-cmt">// uso direto na entidade</span><br>
        <span class="tor-dv-kw">const</span> u = <span class="tor-dv-kw">await</span> User.<span class="tor-dv-tip">findOne<span class="tor-dv-tb">Método estático que vem da herança de BaseEntity. Fácil de usar mas difícil de mockar em testes — você teria que mockar a classe estática.</span></span>({ where: { id } })<br>
        <span class="tor-dv-kw">await</span> u.<span class="tor-dv-tip">save<span class="tor-dv-tb">Salva o estado atual da instância no banco. Faz INSERT se novo, UPDATE se já existe. Conveniente mas acopla a entidade ao banco.</span></span>()
      </div>
      <div style="margin-top:10px;padding:8px;background:#0f172a;border-radius:6px;font-size:9px;color:#64748b;line-height:1.6">
        <span style="color:#f59e0b">✓</span> Menos boilerplate<br>
        <span style="color:#ef4444">✗</span> Difícil de mockar<br>
        <span style="color:#ef4444">✗</span> Acopla domínio ao banco
      </div>
    </div>
    <div class="tor-dv-card" style="border-color:rgba(232,53,36,.3)">
      <div class="tor-dv-label" style="color:#E83524">DataMapper (preferido)</div>
      <div class="tor-dv-code">
        <span class="tor-dv-kw">@Entity</span>()<br>
        <span class="tor-dv-kw">class</span> <span style="color:#61DAFB">User</span> { <span class="tor-dv-cmt">// POJO puro</span><br>
        &nbsp;<span class="tor-dv-dec">@PrimaryGeneratedColumn</span>()<br>
        &nbsp;id: <span style="color:#61DAFB">number</span><br>
        &nbsp;<span class="tor-dv-dec">@Column</span>()<br>
        &nbsp;name: <span style="color:#61DAFB">string</span><br>
        }<br><br>
        <span class="tor-dv-cmt">// queries via repositório</span><br>
        <span class="tor-dv-kw">const</span> repo = ds.<span class="tor-dv-tip">getRepository<span class="tor-dv-tb">O DataSource (conexão com o banco) expõe getRepository<T>() que retorna um repositório tipado para a entidade. Pode ser injetado via DI no NestJS.</span></span>(User)<br>
        <span class="tor-dv-kw">const</span> u = <span class="tor-dv-kw">await</span> repo.findOne({ where: { id } })<br>
        <span class="tor-dv-kw">await</span> repo.<span class="tor-dv-tip">save<span class="tor-dv-tb">O repositório faz o trabalho de persistência — a entidade User não sabe nada sobre o banco. Isso permite injetar um mock de repositório nos testes sem tocar no banco.</span></span>(u)
      </div>
      <div style="margin-top:10px;padding:8px;background:#0f172a;border-radius:6px;font-size:9px;color:#64748b;line-height:1.6">
        <span style="color:#4ade80">✓</span> Repositório mockável em testes<br>
        <span style="color:#4ade80">✓</span> Entidade é POJO, ideal pra DDD<br>
        <span style="color:#4ade80">✓</span> Injeção de dependência limpa
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid #1e3a5f">
    <div style="font-size:9px;color:#3b82f6;letter-spacing:.1em;font-weight:600;margin-bottom:6px;text-transform:uppercase">No NestJS — DataMapper com injeção de dependência</div>
    <div style="font-size:10.5px;line-height:2;color:#94a3b8">
      <span class="tor-dv-dec">@Injectable</span>()<br>
      <span class="tor-dv-kw">class</span> <span style="color:#61DAFB">UserService</span> {<br>
      &nbsp;<span class="tor-dv-kw">constructor</span>(<span class="tor-dv-dec">@InjectRepository</span>(User) <span class="tor-dv-kw">private</span> repo: Repository&lt;User&gt;) {}<br>
      &nbsp;<span class="tor-dv-kw">async</span> findById(id: <span style="color:#61DAFB">number</span>) { <span class="tor-dv-kw">return</span> <span class="tor-dv-kw">this</span>.repo.findOne({ where: { id } }) }<br>
      }
    </div>
    <p style="font-size:11px;color:#475569;margin:8px 0 0;line-height:1.6">O repositório é injetado — em testes, você injeta um mock. Sem banco. Sem acoplamento.</p>
  </div>
</div>`,
        caption: "DataMapper é preferido em projetos profissionais porque a entidade permanece POJO puro (ideal para DDD), o repositório é injetável e mockável, e a lógica de negócio não fica acoplada à persistência.",
      },
      {
        title: "Ciclo de vida de uma entidade — do new ao banco",
        html: `<style>
.tor-lc-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tor-lc-step{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:12px 14px;flex:1;min-width:0}
.tor-lc-num{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;margin-bottom:8px}
.tor-lc-title{font-size:11px;font-weight:700;margin-bottom:4px}
.tor-lc-body{font-size:9.5px;color:#64748b;line-height:1.6}
.tor-lc-code{font-size:10px;color:#94a3b8;line-height:1.8;margin-top:6px}
.tor-lc-arr{color:#334155;font-size:20px;align-self:center;flex-shrink:0;padding:0 4px}
@keyframes tor-lc-glow{0%,100%{border-color:#334155}50%{border-color:#E83524;box-shadow:0 0 8px rgba(232,53,36,.2)}}
.tor-lc-active{animation:tor-lc-glow 2.4s ease-in-out infinite}
</style>
<div class="tor-lc-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Ciclo de vida de uma entidade TypeORM</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Do objeto em memória até o banco — e o que acontece em cada etapa</p>
  <div style="display:flex;gap:6px;align-items:stretch;margin-bottom:16px;flex-wrap:wrap">
    <div class="tor-lc-step">
      <div class="tor-lc-num" style="background:rgba(97,218,251,.15);color:#61DAFB">1</div>
      <div class="tor-lc-title" style="color:#61DAFB">new</div>
      <div class="tor-lc-body">Objeto criado em memória. Não rastreado pelo EntityManager ainda. Sem ID.</div>
      <div class="tor-lc-code">
        <span style="color:#7c3aed">const</span> u = <span style="color:#7c3aed">new</span> User()<br>
        u.name = <span style="color:#4ade80">'Ana'</span><br>
        <span style="color:#475569">// id: undefined</span>
      </div>
    </div>
    <div class="tor-lc-arr">→</div>
    <div class="tor-lc-step tor-lc-active">
      <div class="tor-lc-num" style="background:rgba(232,53,36,.15);color:#E83524">2</div>
      <div class="tor-lc-title" style="color:#E83524">persist</div>
      <div class="tor-lc-body">EntityManager rastreia o objeto. Ainda não foi ao banco — só está na Unit of Work.</div>
      <div class="tor-lc-code">
        em.persist(u)<br>
        <span style="color:#475569">// ou repo.create({name})</span><br>
        <span style="color:#475569">// id: ainda undefined</span>
      </div>
    </div>
    <div class="tor-lc-arr">→</div>
    <div class="tor-lc-step">
      <div class="tor-lc-num" style="background:rgba(74,222,128,.15);color:#4ade80">3</div>
      <div class="tor-lc-title" style="color:#4ade80">save / flush</div>
      <div class="tor-lc-body">TypeORM emite SQL: INSERT se novo, UPDATE se modificado. Hooks @BeforeInsert e @AfterInsert disparam.</div>
      <div class="tor-lc-code">
        <span style="color:#7c3aed">await</span> repo.save(u)<br>
        <span style="color:#475569">// → INSERT INTO user...</span><br>
        <span style="color:#475569">// id: 42 (gerado pelo banco)</span>
      </div>
    </div>
    <div class="tor-lc-arr">→</div>
    <div class="tor-lc-step">
      <div class="tor-lc-num" style="background:rgba(59,130,246,.15);color:#3b82f6">4</div>
      <div class="tor-lc-title" style="color:#3b82f6">managed</div>
      <div class="tor-lc-body">Entidade gerenciada: mudanças são rastreadas. Flush automático em transações.</div>
      <div class="tor-lc-code">
        u.name = <span style="color:#4ade80">'Ana P.'</span><br>
        <span style="color:#7c3aed">await</span> repo.save(u)<br>
        <span style="color:#475569">// → UPDATE user SET name=...</span>
      </div>
    </div>
    <div class="tor-lc-arr">→</div>
    <div class="tor-lc-step">
      <div class="tor-lc-num" style="background:rgba(100,116,139,.15);color:#64748b">5</div>
      <div class="tor-lc-title" style="color:#64748b">removed</div>
      <div class="tor-lc-body">Removido do banco. Hard delete ou soft delete (@SoftDelete) com DeletedAt.</div>
      <div class="tor-lc-code">
        <span style="color:#7c3aed">await</span> repo.remove(u)<br>
        <span style="color:#475569">// → DELETE FROM user...</span><br>
        <span style="color:#475569">// ou softDelete por slug</span>
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid #1e3a5f">
    <div style="font-size:9px;color:#E83524;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">Hooks de ciclo de vida disponíveis</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px;color:#94a3b8;line-height:1.8">
      <div><span style="color:#E83524">@BeforeInsert</span> — hash de senha, slug<br><span style="color:#E83524">@AfterInsert</span> — log, envio de e-mail<br><span style="color:#E83524">@BeforeUpdate</span> — updatedAt manual</div>
      <div><span style="color:#E83524">@AfterUpdate</span> — invalidar cache<br><span style="color:#E83524">@BeforeRemove</span> — verificar FKs<br><span style="color:#E83524">@AfterLoad</span> — transformar dados</div>
    </div>
  </div>
</div>`,
        caption: "O fluxo new → persist → save/flush → managed é o modelo mental central. Hooks de ciclo de vida permitem adicionar lógica cross-cutting (auditoria, hashing, cache) sem poluir a camada de serviço.",
      },
      {
        title: "Tipos de relação — FK visual e decorators",
        html: `<style>
.tor-rel-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tor-rel-box{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:12px 14px}
.tor-rel-entity{background:#0f172a;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10.5px;line-height:1.8;color:#94a3b8}
.tor-rel-entity-title{font-size:11px;font-weight:700;margin-bottom:6px}
.tor-rel-fk{color:#E83524;font-weight:600}
.tor-rel-dec{color:#f59e0b}
.tor-rel-kw{color:#7c3aed}
.tor-rel-arr{color:#475569;font-size:12px}
.tor-rel-badge{display:inline-block;padding:2px 7px;border-radius:4px;font-size:9px;font-weight:600;margin-bottom:8px}
</style>
<div class="tor-rel-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Tipos de relação TypeORM com FK visual</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">A FK sempre fica no lado Many — a seta aponta de quem possui a FK</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">

    <div class="tor-rel-box">
      <span class="tor-rel-badge" style="background:rgba(97,218,251,.12);color:#61DAFB">ManyToOne / OneToMany</span>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
        <div class="tor-rel-entity" style="flex:1">
          <div class="tor-rel-entity-title" style="color:#61DAFB">Post</div>
          <span class="tor-rel-fk">userId</span> (FK)<br>
          <span class="tor-rel-dec">@ManyToOne</span>(() =&gt; User)
        </div>
        <div style="text-align:center;font-size:11px;color:#475569">N:1<br>←→</div>
        <div class="tor-rel-entity" style="flex:1">
          <div class="tor-rel-entity-title" style="color:#61DAFB">User</div>
          <span class="tor-rel-dec">@OneToMany</span>(() =&gt; Post, p =&gt; p.user)<br>
          posts: Post[]
        </div>
      </div>
      <div style="font-size:9px;color:#475569;line-height:1.6">FK fica em Post (lado Many). @JoinColumn desnecessário — TypeORM infere. Inverse relation é obrigatória para navegação bidirecional.</div>
    </div>

    <div class="tor-rel-box">
      <span class="tor-rel-badge" style="background:rgba(232,53,36,.12);color:#E83524">ManyToMany</span>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
        <div class="tor-rel-entity" style="flex:1">
          <div class="tor-rel-entity-title" style="color:#61DAFB">Post</div>
          <span class="tor-rel-dec">@ManyToMany</span>(() =&gt; Tag)<br>
          <span class="tor-rel-dec">@JoinTable</span>()<br>
          tags: Tag[]
        </div>
        <div style="text-align:center;font-size:11px;color:#475569">N:M<br>↔</div>
        <div class="tor-rel-entity" style="flex:1">
          <div class="tor-rel-entity-title" style="color:#61DAFB">Tag</div>
          <span class="tor-rel-dec">@ManyToMany</span>(() =&gt; Post, p =&gt; p.tags)<br>
          posts: Post[]
        </div>
      </div>
      <div style="font-size:9px;color:#475569;line-height:1.6"><span style="color:#E83524">@JoinTable obrigatório</span> no lado owner (Post). TypeORM cria tabela intermediária post_tags_tag automaticamente.</div>
    </div>

    <div class="tor-rel-box">
      <span class="tor-rel-badge" style="background:rgba(74,222,128,.12);color:#4ade80">OneToOne</span>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
        <div class="tor-rel-entity" style="flex:1">
          <div class="tor-rel-entity-title" style="color:#61DAFB">User</div>
          <span class="tor-rel-dec">@OneToOne</span>(() =&gt; Profile)<br>
          <span class="tor-rel-dec">@JoinColumn</span>()<br>
          <span class="tor-rel-fk">profileId</span> (FK)
        </div>
        <div style="text-align:center;font-size:11px;color:#475569">1:1<br>→</div>
        <div class="tor-rel-entity" style="flex:1">
          <div class="tor-rel-entity-title" style="color:#61DAFB">Profile</div>
          <span class="tor-rel-dec">@OneToOne</span>(() =&gt; User, u =&gt; u.profile)<br>
          user: User
        </div>
      </div>
      <div style="font-size:9px;color:#475569;line-height:1.6"><span style="color:#4ade80">@JoinColumn obrigatório</span> em OneToOne — define qual lado tem a FK. O lado com @JoinColumn é o owner.</div>
    </div>

    <div class="tor-rel-box">
      <span class="tor-rel-badge" style="background:rgba(245,158,11,.12);color:#f59e0b">Eager vs Lazy Loading</span>
      <div class="tor-rel-entity" style="margin-bottom:8px">
        <span class="tor-rel-dec">@OneToMany</span>(() =&gt; Post, p =&gt; p.user, { <span style="color:#f59e0b">eager: true</span> })<br>
        <span style="color:#475569">// carrega SEMPRE com o User — cuidado em listas grandes</span><br><br>
        <span class="tor-rel-dec">@OneToMany</span>(() =&gt; Post, ...)<br>
        <span style="color:#475569">// lazy por padrão: use relations:['posts'] ou join explícito</span><br>
        repo.find({ relations: { posts: <span style="color:#61DAFB">true</span> } })
      </div>
      <div style="font-size:9px;color:#475569;line-height:1.6">Prefira lazy explícito — eager:true pode gerar queries enormes desnecessárias. Seja explícito no que carregar em cada query.</div>
    </div>

  </div>
</div>`,
        caption: "Regra de ouro das relações: a FK sempre fica no lado Many. Em ManyToMany, @JoinTable deve ficar no lado owner. Em OneToOne, @JoinColumn define quem tem a FK. Nunca esqueça a relation inversa — TypeORM precisa dela para navegação bidirecional.",
      },
    ],
    cheatsheet: {
      title: "TypeORM — Decorators e comandos essenciais",
      html: `<style>
.tor-cs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tor-cs-section{margin-bottom:18px}
.tor-cs-title{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #1e293b}
.tor-cs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}
.tor-cs-item{background:#1e293b;border-radius:8px;padding:10px 12px}
.tor-cs-dec{color:#E83524;font-size:10.5px;font-weight:600}
.tor-cs-desc{color:#64748b;font-size:9.5px;margin-top:3px;line-height:1.5}
.tor-cs-code{font-size:10px;color:#94a3b8;background:#0f172a;border-radius:6px;padding:8px 10px;margin-top:8px;line-height:1.8}
.tor-cs-kw{color:#7c3aed}
.tor-cs-str{color:#4ade80}
.tor-cs-cmt{color:#475569}
</style>
<div class="tor-cs-wrap">
  <p style="color:#e2e8f0;font-size:13px;margin:0 0 18px;font-weight:600">TypeORM — Decorators, QueryBuilder e CLI</p>

  <div class="tor-cs-section">
    <div class="tor-cs-title" style="color:#E83524">Decorators de entidade</div>
    <div class="tor-cs-grid">
      <div class="tor-cs-item"><div class="tor-cs-dec">@Entity()</div><div class="tor-cs-desc">Marca a classe como tabela. Aceita nome customizado: @Entity('tb_users')</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">@PrimaryGeneratedColumn()</div><div class="tor-cs-desc">Chave primária auto-increment (int) ou 'uuid' para UUID v4</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">@Column()</div><div class="tor-cs-desc">Coluna. Opções: type, nullable, unique, default, length, name</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">@CreateDateColumn()</div><div class="tor-cs-desc">Timestamp automático na criação. TypeORM insere, você não precisa setar</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">@UpdateDateColumn()</div><div class="tor-cs-desc">Timestamp atualizado automaticamente no save()</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">@DeleteDateColumn()</div><div class="tor-cs-desc">Soft delete: preenche este campo em softDelete(), filtra automaticamente</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">@Index()</div><div class="tor-cs-desc">Índice na coluna. @Index(['col1','col2']) para índice composto</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">@Unique()</div><div class="tor-cs-desc">Constraint unique. Pode ser em nível de classe para unique composto</div></div>
    </div>
  </div>

  <div class="tor-cs-section">
    <div class="tor-cs-title" style="color:#f59e0b">Decorators de relação</div>
    <div class="tor-cs-grid">
      <div class="tor-cs-item"><div class="tor-cs-dec">@ManyToOne(() =&gt; User)</div><div class="tor-cs-desc">FK nesta entidade. TypeORM cria coluna userId automaticamente</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">@OneToMany(() =&gt; Post, p =&gt; p.user)</div><div class="tor-cs-desc">Sem FK aqui — FK está no Post. Sempre precisa do 2º argumento (inverse)</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">@ManyToMany(() =&gt; Tag)</div><div class="tor-cs-desc">Relação N:M. Precisa de @JoinTable no lado owner</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">@JoinTable()</div><div class="tor-cs-desc">Define tabela intermediária. Só no lado owner do ManyToMany</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">@JoinColumn()</div><div class="tor-cs-desc">Obrigatório em OneToOne para definir qual lado tem a FK</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">{ eager: true }</div><div class="tor-cs-desc">Carrega relação sempre. Use com cuidado — pode gerar queries gigantes</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">{ cascade: true }</div><div class="tor-cs-desc">save/remove em cascata para a relação. Risco de remoção acidental</div></div>
      <div class="tor-cs-item"><div class="tor-cs-dec">{ onDelete: 'CASCADE' }</div><div class="tor-cs-desc">Constraint de FK no banco. Diferente de cascade do TypeORM (app-level)</div></div>
    </div>
  </div>

  <div class="tor-cs-section">
    <div class="tor-cs-title" style="color:#4ade80">QueryBuilder — queries complexas</div>
    <div class="tor-cs-code">
      <span class="tor-cs-kw">const</span> posts = <span class="tor-cs-kw">await</span> repo<br>
      &nbsp;.createQueryBuilder(<span class="tor-cs-str">'post'</span>)<br>
      &nbsp;.leftJoinAndSelect(<span class="tor-cs-str">'post.author'</span>, <span class="tor-cs-str">'author'</span>) <span class="tor-cs-cmt">// carrega relação</span><br>
      &nbsp;.leftJoinAndSelect(<span class="tor-cs-str">'post.tags'</span>, <span class="tor-cs-str">'tag'</span>)<br>
      &nbsp;.where(<span class="tor-cs-str">'post.published = :pub'</span>, { pub: <span style="color:#61DAFB">true</span> }) <span class="tor-cs-cmt">// NUNCA interpole strings</span><br>
      &nbsp;.andWhere(<span class="tor-cs-str">'author.active = :active'</span>, { active: <span style="color:#61DAFB">true</span> })<br>
      &nbsp;.orderBy(<span class="tor-cs-str">'post.createdAt'</span>, <span class="tor-cs-str">'DESC'</span>)<br>
      &nbsp;.take(<span style="color:#61DAFB">10</span>).skip(<span style="color:#61DAFB">0</span>)<br>
      &nbsp;.getMany()
    </div>
  </div>

  <div class="tor-cs-section">
    <div class="tor-cs-title" style="color:#61DAFB">Transações e soft delete</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div class="tor-cs-code">
        <span class="tor-cs-cmt">// transação com callback</span><br>
        <span class="tor-cs-kw">await</span> dataSource.transaction(<span class="tor-cs-kw">async</span> em =&gt; {<br>
        &nbsp;<span class="tor-cs-kw">await</span> em.save(User, newUser)<br>
        &nbsp;<span class="tor-cs-kw">await</span> em.save(Profile, profile)<br>
        &nbsp;<span class="tor-cs-cmt">// rollback automático se exceção</span><br>
        })
      </div>
      <div class="tor-cs-code">
        <span class="tor-cs-cmt">// soft delete com @DeleteDateColumn</span><br>
        <span class="tor-cs-kw">await</span> repo.softDelete(id)<br>
        <span class="tor-cs-cmt">// consulta inclui deletados:</span><br>
        repo.find({ withDeleted: <span style="color:#61DAFB">true</span> })<br>
        <span class="tor-cs-cmt">// restaurar:</span><br>
        <span class="tor-cs-kw">await</span> repo.restore(id)
      </div>
    </div>
  </div>

  <div class="tor-cs-section" style="margin-bottom:0">
    <div class="tor-cs-title" style="color:#94a3b8">CLI de migrations</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div class="tor-cs-code">
        <span style="color:#4ade80"># gera migration do diff</span><br>
        npx typeorm migration:generate -d src/data-source.ts src/migrations/AddUserIndex<br><br>
        <span style="color:#4ade80"># aplica migrations pendentes</span><br>
        npx typeorm migration:run -d src/data-source.ts
      </div>
      <div class="tor-cs-code">
        <span style="color:#4ade80"># reverte última migration</span><br>
        npx typeorm migration:revert -d src/data-source.ts<br><br>
        <span style="color:#4ade80"># lista migrations e status</span><br>
        npx typeorm migration:show -d src/data-source.ts
      </div>
    </div>
  </div>
</div>`,
      caption: "Referência rápida de todos os decorators críticos, QueryBuilder seguro (com parâmetros :named) e CLI de migrations. Salve este cheatsheet para revisar antes de entrevistas.",
    },
    keypoints: [
      {
        title: "Entidade e decorators básicos",
        body: "@Entity() marca a classe como tabela. @PrimaryGeneratedColumn() para ID auto-increment (int) ou @PrimaryGeneratedColumn('uuid') para UUID. @Column() mapeia propriedade para coluna — aceita opções como type, nullable, unique, default. reflect-metadata (importado no entry point) é obrigatório para TypeORM inferir tipos automaticamente dos type annotations TypeScript.",
        code: `import { Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  @Index()
  email: string

  @Column({ nullable: true })
  name: string | null

  @CreateDateColumn()   // TypeORM insere automaticamente
  createdAt: Date

  @UpdateDateColumn()   // TypeORM atualiza no save()
  updatedAt: Date
}`,
      },
      {
        title: "DataMapper vs ActiveRecord — escolha certa",
        body: "DataMapper (preferido): entidade é POJO com decorators, repositório separado gerencia queries. Vantagem: repositório é injetável e mockável em testes. ActiveRecord: entidade herda BaseEntity e tem métodos estáticos. Conveniente para projetos pequenos, mas dificulta testes e viola DDD (entidade não deve saber sobre persistência). Em NestJS, sempre use DataMapper com @InjectRepository.",
        code: `// DataMapper — preferido em projetos profissionais
@Injectable()
class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async findActive(): Promise<User[]> {
    return this.userRepo.find({
      where: { active: true },
      order: { createdAt: 'DESC' },
    })
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(dto)   // cria instância
    return this.userRepo.save(user)          // persiste
  }
}`,
      },
      {
        title: "Relations — @OneToMany, @ManyToOne, @ManyToMany",
        body: "A FK sempre fica no lado Many (@ManyToOne cria coluna FK automaticamente). @OneToMany não cria coluna — ele só define a navegação inversa. @ManyToMany exige @JoinTable no lado owner. @OneToOne exige @JoinColumn para definir qual lado tem a FK. Sempre defina a relação inversa (2º argumento dos decorators) — TypeORM precisa dela para joins e navegação bidirecional.",
        code: `@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  // FK userId fica aqui — lado Many
  @ManyToOne(() => User, user => user.posts, { nullable: false })
  author: User

  // ManyToMany — Post é o owner (@JoinTable obrigatório)
  @ManyToMany(() => Tag, tag => tag.posts)
  @JoinTable()           // cria post_tags_tag automaticamente
  tags: Tag[]
}

@Entity()
export class User {
  // Sem FK aqui — apenas navegação inversa
  @OneToMany(() => Post, post => post.author)
  posts: Post[]
}`,
      },
      {
        title: "Eager vs Lazy loading — carregue só o necessário",
        body: "Por padrão, relações não são carregadas (lazy). Você deve ser explícito em cada query sobre o que precisa. eager: true carrega sempre — perigoso em listas grandes pois multiplica o tamanho do resultado. A forma correta é usar relations: { ... } no find() ou leftJoinAndSelect no QueryBuilder. Isso garante controle e evita surpresas de performance.",
        code: `// RUIM — eager: true carrega posts em TODA query de User
@OneToMany(() => Post, p => p.author, { eager: true })
posts: Post[]

// BOM — carrega só quando necessário
const userComPosts = await userRepo.findOne({
  where: { id: userId },
  relations: { posts: true }  // explícito por query
})

// BOM — QueryBuilder para queries mais complexas
const result = await postRepo
  .createQueryBuilder('post')
  .leftJoinAndSelect('post.author', 'author')
  .leftJoinAndSelect('post.tags', 'tag')
  .where('post.id = :id', { id: postId })
  .getOne()`,
      },
      {
        title: "QueryBuilder — controle total sobre SQL",
        body: "QueryBuilder oferece API fluente para construir queries complexas: múltiplos JOINs, subqueries, HAVING, GROUP BY, paginação. É mais verboso que find(), mas indispensável quando find options não são suficientes. Regra crítica: NUNCA use interpolação de string em where() — use sempre parâmetros nomeados (:param) para prevenir SQL injection.",
        code: `// Paginação com contagem total (lista + total em uma única query)
const [posts, total] = await postRepo
  .createQueryBuilder('post')
  .leftJoinAndSelect('post.author', 'a')
  .where('a.active = :active', { active: true })
  .andWhere('post.publishedAt IS NOT NULL')
  .orderBy('post.publishedAt', 'DESC')
  .take(pageSize)
  .skip(page * pageSize)
  .getManyAndCount()   // retorna [Post[], number]

// Subquery
const subQuery = postRepo
  .createQueryBuilder('p')
  .select('p.authorId')
  .where('p.views > :min', { min: 100 })

const activeAuthors = await userRepo
  .createQueryBuilder('u')
  .where(\`u.id IN (\${subQuery.getQuery()})\`)
  .setParameters(subQuery.getParameters())
  .getMany()`,
      },
      {
        title: "Migrations — workflow seguro para produção",
        body: "Nunca use synchronize: true em produção — TypeORM emite ALTER/DROP automaticamente sem confirmação, podendo destruir dados. O workflow correto: (1) mude a entidade no código; (2) gere a migration com migration:generate; (3) revise o SQL gerado; (4) faça commit da migration junto com o código; (5) aplique com migration:run em CI/CD. Migrations são idempotentes — executadas apenas uma vez.",
        code: `// data-source.ts — configuração do DataSource
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Post, Tag],
  migrations: ['src/migrations/*.ts'],
  // NUNCA synchronize: true em produção!
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
})

// migration gerada pelo CLI (nunca edite após aplicar)
export class AddUserIndex1710000000000 implements MigrationInterface {
  async up(qr: QueryRunner): Promise<void> {
    await qr.createIndex('users', new TableIndex({
      name: 'IDX_users_email',
      columnNames: ['email'],
    }))
  }
  async down(qr: QueryRunner): Promise<void> {
    await qr.dropIndex('users', 'IDX_users_email')
  }
}`,
      },
      {
        title: "Transações — atomicidade de operações",
        body: "Transações garantem que múltiplas operações de banco sejam atômicas — ou todas acontecem, ou nenhuma. TypeORM oferece duas formas: dataSource.transaction() com callback (mais simples, rollback automático em exceção) e QueryRunner manual para casos avançados (transações distribuídas, rollback parcial). Em NestJS com NestJS-Typeorm, injete DataSource e use transaction().",
        code: `// Forma simples — rollback automático em exceção
async transferCredits(fromId: number, toId: number, amount: number) {
  return this.dataSource.transaction(async (em) => {
    const from = await em.findOneOrFail(User, { where: { id: fromId } })
    const to = await em.findOneOrFail(User, { where: { id: toId } })

    if (from.credits < amount) throw new Error('Saldo insuficiente')

    from.credits -= amount
    to.credits += amount

    await em.save(from)
    await em.save(to)
    // se lançar exceção aqui → rollback automático das duas operações
  })
}

// QueryRunner manual — mais controle
const qr = this.dataSource.createQueryRunner()
await qr.connect()
await qr.startTransaction()
try {
  await qr.manager.save(entity)
  await qr.commitTransaction()
} catch (err) {
  await qr.rollbackTransaction()
  throw err
} finally {
  await qr.release()
}`,
      },
      {
        title: "Soft delete — remoção lógica",
        body: "@DeleteDateColumn ativa soft delete: ao chamar softDelete(), TypeORM preenche deletedAt ao invés de emitir DELETE SQL. Queries subsequentes filtram registros com deletedAt automaticamente. Para incluir deletados, passe withDeleted: true. Para restaurar, use restore(). Soft delete é preferível em sistemas onde auditoria e histórico são importantes.",
        code: `@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @DeleteDateColumn()  // null = ativo, timestamp = deletado
  deletedAt: Date | null
}

// Soft delete — emite UPDATE post SET deletedAt = NOW()
await postRepo.softDelete(postId)

// Restore — limpa deletedAt
await postRepo.restore(postId)

// Consulta padrão — filtra deletados automaticamente
const posts = await postRepo.find()  // só ativos

// Incluir deletados
const todos = await postRepo.find({ withDeleted: true })`,
      },
      {
        title: "@Index e otimização de queries",
        body: "@Index() cria índice simples na coluna. Para índice composto, passe array em nível de classe. @Unique() adiciona constraint de unicidade. Índices são críticos para colunas usadas em WHERE, JOIN e ORDER BY frequentes. TypeORM gera os índices nas migrations automaticamente.",
        code: `// Índice simples na coluna
@Column()
@Index()
email: string

// Índice composto — em nível de classe
@Entity()
@Index(['firstName', 'lastName'])
@Index(['email'], { unique: true })
export class User {
  @Column() firstName: string
  @Column() lastName: string
  @Column() email: string
}

// Verificar o SQL gerado na migration:
// CREATE INDEX IDX_users_firstName_lastName ON users (firstName, lastName)
// CREATE UNIQUE INDEX IDX_users_email ON users (email)`,
      },
      {
        title: "Hooks de ciclo de vida",
        body: "@BeforeInsert, @AfterInsert, @BeforeUpdate, @AfterUpdate, @BeforeRemove, @AfterLoad — executam automaticamente. Úteis para hashear senha antes de inserir, gerar slug, invalidar cache, auditar mudanças. O método deve ser um método da entidade (não async no AfterLoad — TypeORM não awaita).",
        code: `import { BeforeInsert, BeforeUpdate } from 'typeorm'
import * as bcrypt from 'bcrypt'

@Entity()
export class User {
  @Column()
  password: string   // armazenado como hash

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 12)
    }
  }

  @BeforeInsert()
  generateSlug() {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-')
  }
}`,
      },
      {
        title: "find() options — queries simples",
        body: "Para queries simples, find() e findOne() com FindOptionsWhere são mais legíveis que QueryBuilder. Suportam where com operadores (Like, Between, In, Not, IsNull), relations para carregamento, order para ordenação, take/skip para paginação. Para queries complexas com múltiplos JOINs ou subqueries, mude para QueryBuilder.",
        code: `import { Like, In, IsNull, Between } from 'typeorm'

// Busca com operadores
const users = await userRepo.find({
  where: [
    { email: Like('%@empresa.com') },      // OR
    { role: In(['admin', 'moderator']) },   // OR
  ],
  relations: { posts: true },
  order: { createdAt: 'DESC' },
  take: 10,
  skip: 0,
})

// Null check
await userRepo.find({ where: { deletedAt: IsNull() } })

// Range
await postRepo.find({
  where: { views: Between(100, 1000) },
})`,
      },
      {
        title: "Integração NestJS — módulo TypeORM",
        body: "No NestJS, configure TypeOrmModule.forRoot() no AppModule para a conexão global e TypeOrmModule.forFeature([Entity]) em cada módulo de domínio para registrar repositórios. Use @InjectRepository(Entity) para injetar o repositório no serviço. Para testes, use TypeOrmModule.forFeature() com SQLite em memória ou repositories mockados via overrideProvider.",
        code: `// app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,  // registra entidades do forFeature automaticamente
      synchronize: false,
      logging: process.env.NODE_ENV !== 'production',
    }),
  ],
})
export class AppModule {}

// user.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}`,
      },
      {
        title: "Custom Repository — encapsulando queries de domínio",
        body: "Custom Repository permite encapsular queries específicas do domínio em vez de espalhá-las pelos serviços. No TypeORM 0.3+, crie uma classe anotada com @Injectable() que injeta o repositório base. Isso facilita testes (mock da classe inteira), reutilização e leitura — o serviço chama métodos com nomes de domínio, não QueryBuilder raw.",
        code: `@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>
  ) {}

  async findPublishedByAuthor(authorId: number, page: number): Promise<[Post[], number]> {
    return this.repo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .where('post.authorId = :authorId', { authorId })
      .andWhere('post.publishedAt IS NOT NULL')
      .orderBy('post.publishedAt', 'DESC')
      .take(10)
      .skip(page * 10)
      .getManyAndCount()
  }

  async countByStatus(authorId: number) {
    return this.repo.count({ where: { authorId } })
  }
}`,
      },
    ],
    gotchas: [
      "synchronize: true em produção remove colunas ao deletar @Column da entidade. Sem confirmação. Sem recovery se não há backup. Nunca use em produção — use migrations.",
      "N+1 sem join explícito: ao iterar posts e acessar post.author dentro do loop, TypeORM emite uma query SELECT por iteração. Solução: carregar a relação no find() com relations ou no QueryBuilder com leftJoinAndSelect.",
      "Relação circular sem lazy loading: @ManyToOne + @OneToMany entre A e B podem gerar loop ao serializar para JSON (toJSON infinito). Solução: @Exclude() no lado inverse, classToPlain do class-transformer, ou serialization groups.",
      "Migration sem teste em staging: um diff de schema inesperado (renome de tabela, drop de índice) pode ser catastrófico em produção. Sempre execute migration:run em staging primeiro e revise o SQL gerado na migration antes de commitar.",
      "@ManyToMany sem @JoinTable do lado owner: TypeORM não cria a tabela intermediária. Erro silencioso — apenas uma das duas entidades deve ter @JoinTable.",
      "QueryBuilder com string interpolada: .where(\`post.authorId = ${userId}\`) é SQL injection. Use sempre .where('post.authorId = :id', { id: userId }).",
      "entity.save() fora de transação em operações críticas: se a segunda save() falhar depois da primeira, o banco fica em estado inconsistente. Envolva operações interdependentes em dataSource.transaction().",
      "Repositório injetado com escopo incorreto no NestJS: repositórios são singletons. Se você usa request-scoped providers que dependem de repositórios, o escopo pode não se propagar corretamente — use DataSource diretamente em providers request-scoped.",
    ],
    interview: [
      {
        q: "Qual a diferença entre ActiveRecord e DataMapper no TypeORM?",
        level: "senior",
        a: "<p><strong>ActiveRecord</strong>: entidade herda BaseEntity e tem métodos estáticos (User.findOne(), User.save()). Simples, menos código. Desvantagens: difícil de mockar em testes (métodos estáticos), viola DDD (entidade sabe sobre persistência), acoplamento forte à camada de banco.</p><p><strong>DataMapper</strong>: entidade é POJO com decorators, sem herança. Repositório separado faz todas as queries. Vantagens: repositório é uma dependência injetável e mockável (<code>overrideProvider</code> no NestJS), entidade permanece pura para lógica de domínio, segue separação de responsabilidades. Preferido em projetos enterprise e DDD.</p><p>No NestJS, DataMapper é o padrão: <code>@InjectRepository(User) private repo: Repository&lt;User&gt;</code>.</p>",
        tip: "Explique que a escolha impacta testabilidade: com ActiveRecord, mockar User.findOne() estático é trabalhoso. Com DataMapper, injeta um mock do repositório no construtor — setup de teste em 5 linhas.",
      },
      {
        q: "Como você identificaria e resolveria N+1 no TypeORM?",
        a: "<p><strong>Identificar</strong>: habilite logging: true no DataSource em desenvolvimento. Veja quantas queries SELECT aparecem para uma listagem — se for N+1 (uma por item), você encontrou o problema. Ferramentas: pgBadger, slow query log, APM (Datadog, New Relic).</p><p><strong>Resolver</strong>:</p><ul><li>No find(): <code>relations: { author: true, tags: true }</code></li><li>No QueryBuilder: <code>.leftJoinAndSelect('post.author', 'a')</code></li><li>Para contagens: <code>.loadRelationCountAndMap()</code> ao invés de carregar entidades inteiras</li></ul><p><strong>Caso avançado</strong>: em GraphQL com TypeORM, DataLoader agrupa IDs e faz uma única query IN(...).</p>",
      },
      {
        q: "Por que nunca usar synchronize: true em produção?",
        a: "<p>TypeORM com synchronize: true compara o schema de entidades com o banco real em cada inicialização e emite SQL automaticamente para sincronizar — incluindo ALTER TABLE, DROP COLUMN, DROP INDEX. Um @Column removido por acidente em código dropa a coluna de produção imediatamente e sem confirmação, resultando em perda de dados.</p><p><strong>Alternativa segura</strong>: workflow de migration: (1) altere a entidade; (2) <code>migration:generate</code> gera o SQL de diff; (3) revise o SQL; (4) commite; (5) CI/CD executa <code>migration:run</code>. Isso garante revisão, histórico versionado em git, possibilidade de rollback e deploy coordenado com o código.</p>",
      },
      {
        q: "Como implementaria soft delete com TypeORM?",
        a: "<p>Adicione <code>@DeleteDateColumn() deletedAt: Date | null</code> na entidade. TypeORM filtra automaticamente registros com deletedAt preenchido em todas as queries (WHERE deletedAt IS NULL implícito).</p><p>Operações: <code>repo.softDelete(id)</code> preenche deletedAt. <code>repo.restore(id)</code> limpa. <code>repo.find({ withDeleted: true })</code> inclui deletados. <code>repo.findOne({ where: { id }, withDeleted: true })</code> para buscar um deletado específico.</p><p>Vantagem sobre hard delete: dados ficam no banco para auditoria, relatórios, recuperação acidental. Desvantagem: precisa gerenciar índices únicos (email unique + deletedAt = pode re-cadastrar mesmo email após delete).</p>",
      },
      {
        q: "Como previne SQL injection no QueryBuilder?",
        a: "<p>Nunca use interpolação de string: <code>.where(\`userId = ${userId}\`)</code> é vulnerável.</p><p>Use sempre parâmetros nomeados: <code>.where('post.authorId = :id', { id: userId })</code>. O TypeORM passa o valor como parâmetro parametrizado ao driver do banco — o valor nunca é interpolado no SQL.</p><p>Para arrays: <code>.where('post.id IN (:...ids)', { ids: [1,2,3] })</code>. A sintaxe <code>:...param</code> expande o array corretamente.</p><p>O mesmo princípio vale para find() com <code>where: { id: userId }</code> — TypeORM usa queries parametrizadas internamente.</p>",
      },
      {
        q: "Como estruturaria transações no NestJS com TypeORM?",
        a: "<p>Injeção de DataSource no serviço e uso de <code>dataSource.transaction(async em => { ... })</code>. O EntityManager dentro do callback deve ser usado para todas as operações — não o repositório injetado, que opera fora da transação.</p><p>Para rollback automático: qualquer exceção dentro do callback faz rollback. Para rollback manual ou savepoints: use QueryRunner com <code>startTransaction()</code>, <code>commitTransaction()</code>, <code>rollbackTransaction()</code>.</p><p>Antipadrão: executar operações independentes (<code>repoA.save()</code> e depois <code>repoB.save()</code>) fora de uma transação — se a segunda falhar, a primeira já foi commitada e o banco fica inconsistente.</p>",
        level: "senior",
      },
      {
        q: "Como funcionam as migrations no TypeORM? Qual o risco de editar uma migration já aplicada?",
        a: "<p>TypeORM rastreia migrations aplicadas na tabela <code>migrations</code> do banco, armazenando o nome da classe e timestamp. Ao rodar <code>migration:run</code>, executa apenas as migrations ainda não registradas nessa tabela.</p><p>Editar uma migration já aplicada é catastrófico: o TypeORM não vai reexecutá-la (já está marcada como aplicada), então a mudança de código nunca vai para o banco. Além disso, o histórico fica inconsistente — outro desenvolvedor ou outro ambiente vai executar a versão editada como se fosse nova.</p><p>Regra: migration aplicada é imutável. Se errou, crie uma nova migration de correção (<code>migration:generate</code> ou manual). Para reverter: <code>migration:revert</code> executa o método <code>down()</code> da última migration.</p>",
      },
      {
        q: "Como você faria para evitar circular relation ao serializar entidades TypeORM para JSON?",
        a: "<p>O problema: Post tem @ManyToOne para User, User tem @OneToMany para Post. Serializar Post incluirá User, que incluirá posts, que incluirão o User novamente — loop infinito (stack overflow ou JSON circular reference error).</p><p><strong>Soluções</strong>:</p><ul><li><strong>class-transformer com @Exclude()</strong>: marque o lado inverso com <code>@Exclude()</code> e use <code>instanceToPlain(entity)</code> ao serializar. Padrão com NestJS ClassSerializerInterceptor.</li><li><strong>DTOs explícitos</strong>: nunca serialize a entidade diretamente — mapeie para DTO no serviço. A entidade nunca sai da camada de dados.</li><li><strong>Serialization Groups</strong>: @Expose({ groups: ['detail'] }) permite controlar campos por contexto.</li></ul><p>Preferido: DTOs — elimina o problema na raiz e dá controle total sobre o contrato da API.</p>",
        level: "senior",
      },
      {
        q: "Quando usar QueryBuilder vs find() com FindOptions?",
        a: "<p>Use <code>find()</code> para: queries simples de CRUD, filtros diretos em colunas da entidade, carregamento de relações simples, paginação básica. Mais legível e menos verboso.</p><p>Use <strong>QueryBuilder</strong> para: múltiplos JOINs condicionais, subqueries, GROUP BY + HAVING, SELECT parcial de colunas, queries que misturam dados de várias entidades sem carregar todas as relações, operações bulk (UPDATE com WHERE complexo).</p><p>Regra prática: se você precisaria de mais de 3 condições aninhadas no where de find() ou precisaria de um JOIN não direto entre entidades, mude para QueryBuilder. A verbosidade extra compensa na clareza da intent da query.</p>",
      },
      {
        q: "Como configuraria TypeORM para múltiplos bancos de dados no mesmo NestJS?",
        a: "<p>Use múltiplos DataSources com nomes distintos. No NestJS: <code>TypeOrmModule.forRoot({ name: 'reporting', ... })</code> para o segundo banco. Ao injetar repositórios, especifique a conexão: <code>TypeOrmModule.forFeature([Report], 'reporting')</code> e <code>@InjectRepository(Report, 'reporting')</code> no serviço.</p><p>Cenário comum: banco principal PostgreSQL para dados transacionais + read replica para queries pesadas + ClickHouse para analytics. Cada DataSource tem seu pool de conexões independente.</p><p>Cuidado: transações não cruzam DataSources — para operações que precisam de atomicidade entre bancos diferentes, use saga pattern ou compensação manual.</p>",
        level: "senior",
      },
      {
        q: "O que é N+1 e por que ele é mais perigoso em GraphQL do que em REST?",
        a: "<p>N+1: ao listar N itens e acessar uma relação em cada um, o ORM emite 1 query para a lista + N queries para as relações = N+1 queries totais. Com N=1000, são 1001 queries onde 1 bastaria.</p><p>Em REST, você controla exatamente o que carregar em cada endpoint — pode fazer o join na query do endpoint e resolver na origem. Em GraphQL, resolvers são funções independentes por campo: o resolver de <code>author</code> dentro de <code>Post</code> não sabe quantos posts estão sendo resolvidos simultaneamente. Cada chamada ao resolver dispara uma query individual.</p><p>Solução: <strong>DataLoader</strong> — acumula todos os IDs de author requisitados no mesmo tick do event loop, emite uma única query <code>WHERE id IN (...)</code> e distribui os resultados de volta para cada resolver. Instância nova por request para evitar cache entre usuários.</p>",
        level: "senior",
      },
    ],
    mnemonics: [
      {
        label: "FK fica no Many",
        trick: "ManyToOne = Muitos têm a chave do Um",
        explanation: "O lado Many (@ManyToOne) é sempre quem tem a FK no banco. O lado One (@OneToMany) não tem coluna extra — só é uma referência virtual de navegação.",
      },
      {
        label: "@JoinTable no owner",
        trick: "Quem @JoinTable paga a tabela intermediária",
        explanation: "Em @ManyToMany, o lado que declara @JoinTable é o owner da relação e quem 'paga' pela tabela de junção. Se esquecer, a tabela não é criada.",
      },
      {
        label: "synchronize false em produção",
        trick: "Sync destrói, Migration protege",
        explanation: "synchronize: true é para desenvolvimento rápido e prototipagem. Em qualquer ambiente com dados reais, use migrations — elas têm review, histórico e rollback.",
      },
    ],
    resources: [
      { title: "TypeORM docs", url: "https://typeorm.io/", kind: "docs" },
      { title: "NestJS + TypeORM", url: "https://docs.nestjs.com/techniques/database", kind: "docs" },
      { title: "TypeORM Relations Guide", url: "https://typeorm.io/relations", kind: "docs" },
      { title: "TypeORM Migrations", url: "https://typeorm.io/migrations", kind: "docs" },
    ],
  },

  "nestjs": {
    tagline: "Framework Node.js opinativo com DI, decorators e arquitetura modular.",
    why: "NestJS domina o mercado de backend TypeScript enterprise no Brasil. Saber módulos, DI, guards, pipes, interceptors e como testar é obrigatório em vaga senior.",
    summary: "NestJS e um framework Node.js construido sobre Express (ou Fastify) que adiciona arquitetura Angular-like: módulos, controllers, providers com injecao de dependência, decorators para rotas/validação/auth. Excelente para APIs REST e GraphQL, microservicos (transportes: gRPC, NATS, Redis, RabbitMQ) e websockets. CLI gera scaffolding.",
    keypoints: [
      { title: "Modulos", body: "@Module agrupa controller + providers. imports/exports controlam visibilidade. Global modules (@Global) disponibilizados em toda app. Formas dinâmicas: forRoot, forFeature, forRootAsync." },
      { title: "DI Container", body: "Container IoC gerencia instâncias por scope: singleton (default), transient, request-scoped. @Injectable marca provider. @Inject injeta token customizado." },
      { title: "Controllers e Rotas", body: "@Controller, @Get, @Post, @Param, @Body, @Query. DTO com class-validator para validação. @Res() para acesso ao response raw (cuidado: perde interceptors)." },
      { title: "Pipes", body: "Transformam e validam input antes do handler. Built-in: ValidationPipe (class-validator), ParseIntPipe, ParseUUIDPipe. Custom pipes implementam PipeTransform." },
      { title: "Guards", body: "Decisão de autorização. Implementam CanActivate. Rodam antes do handler e interceptors. Combinam com @UseGuards(AuthGuard) ou globalmente." },
      { title: "Interceptors", body: "Ao redor do handler (AOP). Use para logging, transformar response, caching, timeout. Implementam NestInterceptor com rxjs Observable." },
      { title: "Exception Filters", body: "Capturam exceções e formatam resposta. Built-in: HttpException, NotFoundException, etc. Custom filtro com @Catch(ExceptionType)." },
    ],
    gotchas: [
      "Circular dependency entre módulos -- use forwardRef() e prefira redesenhar.",
      "Request-scoped provider em singleton -- provider singleton não tem acesso ao request.",
      "Usar @Res() no controller -- perde interceptors e response padrão do Nest.",
      "ValidationPipe sem transform:true -- DTO continua com tipos errados (string ao inves de number).",
      "Module sem exports -- provider não acessível em outros módulos.",
    ],
    interview: [
      { q: "Como funciona o ciclo de vida de um request no NestJS?", a: "<p>Middleware -> Guards -> Interceptors (pre) -> Pipes -> Handler -> Interceptors (post) -> Exception Filters (se erro).</p><p>Cada camada tem proposito: Guards decidem acesso, Pipes validam/transformam input, Interceptors adicionam cross-cutting concerns (logging, caching).</p>" },
      { q: "Diferenca entre Guard, Middleware e Interceptor?", a: "<p>Middleware: Express-level, sem acesso ao contexto Nest, executa antes de tudo. Guards: decisão de autorização, acesso ao contexto de execução, podem acessar metadata de decorators. Interceptors: AOP ao redor do handler, podem manipular request E response, baseados em rxjs.</p>" },
      { q: "Como testaria um controller NestJS?", a: "<p>Unit test: Test.createTestingModule() com mocks dos providers. Injeta mocks via overrideProvider. Testa handler isolado.</p><p>E2E test: NestFactory com supertest. Banco de dados real (em memória ou Docker Compose). Testa fluxo completo.</p>" },
    ],
    resources: [
      { title: "NestJS docs", url: "https://docs.nestjs.com/", kind: "docs" },
      { title: "NestJS Fundamentals (curso oficial)", url: "https://courses.nestjs.com/", kind: "curso" },
      { title: "Matt Pocock — NestJS + Zod", url: "https://www.totaltypescript.com/", kind: "artigo" },
    ],
  },

  "graphql": {
    tagline: "Query language para APIs: o cliente descreve exatamente os dados que precisa, sem over/under-fetching.",
    why: "GraphQL é amplamente usado em empresas de produto com frontend rico (mobile + web). Saber schema design, resolver chain, N+1 com DataLoader, subscriptions e os tradeoffs vs REST é obrigatório em vaga sênior. Entender o ciclo de execução de uma query, como o DataLoader funciona internamente e como proteger a API diferencia sênior de pleno em entrevistas técnicas.",
    prerequisite: "HTTP e REST APIs (verbos, status codes), JavaScript/TypeScript async/await, conceitos de banco de dados relacional (relações, JOINs). Entender por que N+1 é um problema de banco de dados torna o DataLoader muito mais fácil de compreender.",
    summary: "GraphQL é uma query language (e runtime de execução) onde o cliente descreve a forma exata do dado que precisa. O servidor expõe um schema tipado com tipos, queries, mutations e subscriptions. O executor recebe a query, valida contra o schema e percorre a árvore de resolvers campo a campo. Cada resolver recebe (parent, args, context, info) e retorna o valor do campo. O grande desafio de produção é o N+1: um resolver de lista dispara N queries individuais para um campo relacionado. A solução padrão é DataLoader — agrupa IDs do mesmo tick em um batch, resolve com uma query e distribui os resultados. Outros tópicos críticos: depth/complexity limiting, introspection desabilitada em produção, persisted queries, e o tradeoff schema-first vs code-first.",
    howToStudy: "<strong>30 minutos antes de entrevista?</strong> Foque nos diagramas do N+1 e no ciclo de query. Treine as Q&As de nível pleno em voz alta. <strong>Fim de semana?</strong> Leia os keypoints em ordem, reproduza o setup Apollo Server + DataLoader no editor, depois os exercícios. <strong>Uma semana?</strong> Implemente uma API GraphQL completa com subscriptions e persisted queries. As Q&As de nível sênior devem ser respondidas sem consultar.",
    diagrams: [
      {
        title: "Ciclo de execução de uma query GraphQL — do cliente ao resolver chain",
        html: `<style>
.gql-cyc-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.gql-cyc-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.gql-cyc-tip:hover .gql-cyc-tb{display:block}
.gql-cyc-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.gql-cyc-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.gql-step{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:12px 14px;flex:1;min-width:0}
.gql-arr{color:#334155;font-size:18px;align-self:center;flex-shrink:0}
</style>
<div class="gql-cyc-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Ciclo de execução de uma query GraphQL</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span></p>
  <div style="display:flex;gap:6px;align-items:stretch;margin-bottom:14px">
    <div class="gql-step" style="border-color:rgba(225,0,152,.3)">
      <div style="font-size:9px;color:#E10098;letter-spacing:.1em;margin-bottom:8px;font-weight:700">① CLIENTE</div>
      <div style="font-size:10.5px;color:#94a3b8;line-height:1.8">
        <span class="gql-cyc-tip">query<span class="gql-cyc-tb">Documento GraphQL enviado no body do POST. Descreve exatamente quais campos quer — o servidor nunca retorna mais do que foi pedido.</span></span> GetUser {<br>
        &nbsp;user(id: "1") {<br>
        &nbsp;&nbsp;<span class="gql-cyc-tip">name<span class="gql-cyc-tb">Cada campo pedido será executado pelo resolver correspondente. Se o cliente não pede 'email', o resolver de email nunca roda.</span></span><br>
        &nbsp;&nbsp;posts { title }<br>
        &nbsp;}<br>
        }
      </div>
    </div>
    <div class="gql-arr">→</div>
    <div class="gql-step">
      <div style="font-size:9px;color:#a78bfa;letter-spacing:.1em;margin-bottom:8px;font-weight:700">② PARSE</div>
      <div style="font-size:10px;color:#64748b;line-height:1.7">
        <span class="gql-cyc-tip">Lexer + Parser<span class="gql-cyc-tb">Converte o texto da query em uma AST (Abstract Syntax Tree). Erros de sintaxe retornam imediatamente antes de validação ou execução.</span></span> converte em <strong style="color:#94a3b8">AST</strong>. Erros de sintaxe param aqui.
      </div>
    </div>
    <div class="gql-arr">→</div>
    <div class="gql-step">
      <div style="font-size:9px;color:#fbbf24;letter-spacing:.1em;margin-bottom:8px;font-weight:700">③ VALIDATE</div>
      <div style="font-size:10px;color:#64748b;line-height:1.7">
        AST verificada contra o <span class="gql-cyc-tip">schema<span class="gql-cyc-tb">Validação semântica: campo 'name' existe em User? Argumento 'id' tem tipo correto? Se não passa, retorna errors[] sem executar resolver algum. Depth/complexity limit são aplicados aqui.</span></span>. Campos inexistentes → erro antes de qualquer resolver.
      </div>
    </div>
    <div class="gql-arr">→</div>
    <div class="gql-step" style="border-color:rgba(74,222,128,.3)">
      <div style="font-size:9px;color:#4ade80;letter-spacing:.1em;margin-bottom:8px;font-weight:700">④ EXECUTE</div>
      <div style="font-size:10px;color:#64748b;line-height:1.7">
        GraphQL percorre a AST <span class="gql-cyc-tip">campo a campo<span class="gql-cyc-tb">O executor inicia pelo resolver raiz (Query.user), usa o valor retornado como 'parent' para os resolvers filhos (User.name, User.posts). A cadeia continua recursivamente.</span></span>, chamando o resolver de cada campo com o valor do pai como primeiro argumento.
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:14px 16px;border:1px solid #1e3a5f">
    <div style="font-size:9px;color:#E10098;letter-spacing:.1em;font-weight:600;margin-bottom:10px;text-transform:uppercase">Resolver chain — como os valores fluem</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <div style="background:#0f172a;border:1px solid rgba(225,0,152,.3);border-radius:6px;padding:8px 12px;font-size:10px">
        <div style="color:#E10098;font-weight:700;margin-bottom:3px">Query.user</div>
        <div style="color:#475569">parent: null<br>args: {id:'1'}<br>→ UserObj</div>
      </div>
      <span style="color:#334155;font-size:18px">→</span>
      <div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:8px 12px;font-size:10px">
        <div style="color:#94a3b8;font-weight:700;margin-bottom:3px">User.name</div>
        <div style="color:#475569">parent: UserObj<br>→ 'Ana'</div>
      </div>
      <span style="color:#334155;font-size:18px">→</span>
      <div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:8px 12px;font-size:10px">
        <div style="color:#94a3b8;font-weight:700;margin-bottom:3px">User.posts</div>
        <div style="color:#475569">parent: UserObj<br>→ Post[]</div>
      </div>
      <span style="color:#334155;font-size:18px">→</span>
      <div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:8px 12px;font-size:10px">
        <div style="color:#94a3b8;font-weight:700;margin-bottom:3px">Post.title</div>
        <div style="color:#475569">parent: PostObj<br>→ string</div>
      </div>
    </div>
    <p style="font-size:11px;color:#475569;margin:10px 0 0;line-height:1.6">Cada resolver recebe <code style="color:#E10098">(parent, args, context, info)</code>. O <strong style="color:#94a3b8">parent</strong> é o valor retornado pelo resolver do campo pai. O <strong style="color:#94a3b8">context</strong> é compartilhado por todos os resolvers do request (DataLoader, auth).</p>
  </div>
</div>`,
        caption: "A execução GraphQL é uma travessia da árvore de campos: cada nó chama seu resolver com o valor do pai como argumento. Entender esse fluxo explica por que o N+1 existe e como o DataLoader o resolve.",
      },
      {
        title: "N+1 sem DataLoader vs com DataLoader — a diferença visual",
        html: `<style>
.gql-n1-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
@keyframes gql-n1-bad{0%,100%{background:rgba(239,68,68,.06);border-color:rgba(239,68,68,.25)}50%{background:rgba(239,68,68,.14);border-color:rgba(239,68,68,.5)}}
@keyframes gql-n1-good{0%,100%{background:rgba(74,222,128,.05);border-color:rgba(74,222,128,.2)}50%{background:rgba(74,222,128,.12);border-color:rgba(74,222,128,.45)}}
.gql-n1-bad{animation:gql-n1-bad 2.5s ease-in-out infinite;border:1px solid;border-radius:6px;padding:7px 11px;font-size:10px;color:#ef4444}
.gql-n1-good{animation:gql-n1-good 2.5s ease-in-out infinite;border:1px solid;border-radius:6px;padding:7px 11px;font-size:10px;color:#4ade80}
.gql-n1-q{background:#1e293b;border-radius:4px;padding:4px 8px;font-size:9.5px;color:#94a3b8;margin:3px 0;border-left:3px solid}
</style>
<div class="gql-n1-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">N+1 problem — sem DataLoader vs com DataLoader</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Query: posts { title author { name } } com 5 posts</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    <div>
      <div class="gql-n1-bad" style="margin-bottom:10px">❌ SEM DataLoader — N+1 queries</div>
      <div style="font-size:10px;color:#64748b;margin-bottom:8px;line-height:1.6">Resolver <code style="color:#ef4444">Post.author</code> roda para cada post separadamente:</div>
      <div class="gql-n1-q" style="border-color:#4ade80;color:#4ade80">SELECT * FROM posts LIMIT 5</div>
      <div style="font-size:9px;color:#475569;margin:4px 0 4px 8px">↳ 5 posts → resolver roda 5×:</div>
      <div class="gql-n1-q" style="border-color:#ef4444">SELECT * FROM users WHERE id = 1</div>
      <div class="gql-n1-q" style="border-color:#ef4444">SELECT * FROM users WHERE id = 2</div>
      <div class="gql-n1-q" style="border-color:#ef4444">SELECT * FROM users WHERE id = 3</div>
      <div class="gql-n1-q" style="border-color:#ef4444">SELECT * FROM users WHERE id = 4</div>
      <div class="gql-n1-q" style="border-color:#ef4444">SELECT * FROM users WHERE id = 5</div>
      <div style="background:#1e293b;border-radius:6px;padding:8px 10px;margin-top:8px;font-size:10px;color:#ef4444;font-weight:700">Total: 6 queries (1 + N)</div>
      <div style="font-size:9px;color:#475569;margin-top:4px;line-height:1.5">Com 100 posts → 101 queries.<br>Com 1000 posts → 1001 queries.</div>
    </div>
    <div>
      <div class="gql-n1-good" style="margin-bottom:10px">✓ COM DataLoader — 2 queries sempre</div>
      <div style="font-size:10px;color:#64748b;margin-bottom:8px;line-height:1.6">DataLoader acumula todos os IDs do mesmo <strong style="color:#94a3b8">tick</strong> do event loop:</div>
      <div class="gql-n1-q" style="border-color:#4ade80;color:#4ade80">SELECT * FROM posts LIMIT 5</div>
      <div style="font-size:9px;color:#475569;margin:4px 0 4px 8px">↳ DataLoader coleta: ids = [1,2,3,4,5]</div>
      <div class="gql-n1-q" style="border-color:#4ade80;color:#4ade80">SELECT * FROM users<br>&nbsp;WHERE id IN (1,2,3,4,5)</div>
      <div style="font-size:9px;color:#475569;margin:4px 0 4px 8px">↳ DataLoader distribui por ID</div>
      <div style="background:#1e293b;border-radius:6px;padding:8px 10px;margin-top:8px;font-size:10px;color:#4ade80;font-weight:700">Total: 2 queries (sempre)</div>
      <div style="font-size:9px;color:#475569;margin-top:4px;line-height:1.5">Com 100 posts → ainda 2 queries.<br>Com 1000 posts → ainda 2 queries.</div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:12px 14px;margin-top:14px;border:1px solid #1e3a5f">
    <div style="font-size:9px;color:#E10098;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">Como o DataLoader funciona internamente</div>
    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
      <div style="background:#0f172a;border:1px solid #334155;border-radius:5px;padding:6px 10px;font-size:10px;color:#94a3b8">
        <div style="color:#E10098;font-size:9px;margin-bottom:2px">mesmo tick</div>
        loader.load(1)<br>loader.load(2)<br>loader.load(3)…
      </div>
      <span style="color:#334155">→</span>
      <div style="background:#0f172a;border:1px solid #334155;border-radius:5px;padding:6px 10px;font-size:10px;color:#94a3b8">
        <div style="color:#fbbf24;font-size:9px;margin-bottom:2px">próximo tick</div>
        batchFn([1,2,3,…])
      </div>
      <span style="color:#334155">→</span>
      <div style="background:#0f172a;border:1px solid #334155;border-radius:5px;padding:6px 10px;font-size:10px;color:#94a3b8">
        <div style="color:#4ade80;font-size:9px;margin-bottom:2px">resolve</div>
        Map{1→user, 2→user…}<br>Promises resolvidas
      </div>
    </div>
    <p style="font-size:10px;color:#475569;margin:8px 0 0;line-height:1.6"><strong style="color:#94a3b8">Regra de ouro:</strong> crie uma nova instância de DataLoader por request (no context) — nunca global, pois o cache seria compartilhado entre usuários.</p>
  </div>
</div>`,
        caption: "O N+1 é o problema número 1 de performance em GraphQL. DataLoader resolve com batching no tick do event loop: todos os loads do mesmo ciclo são agrupados em um único batch. Sempre 2 queries independente do tamanho da lista.",
      },
      {
        title: "Schema types — SDL completo com Query, Mutation, Subscription, enums, scalars e directives",
        html: `<style>
.gql-sch-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.gql-sch-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:11px 14px}
.gql-sch-kw{color:#E10098}
.gql-sch-type{color:#61DAFB}
.gql-sch-scalar{color:#4ade80}
.gql-sch-enum{color:#fbbf24}
.gql-sch-dir{color:#a78bfa}
.gql-sch-cm{color:#475569}
</style>
<div class="gql-sch-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Schema types — SDL e hierarquia de tipos</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Query → Mutation → Subscription → custom types → scalars → enums</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
    <div>
      <div style="font-size:9px;color:#E10098;letter-spacing:.1em;font-weight:700;margin-bottom:6px;text-transform:uppercase">Entry points de operação</div>
      <div class="gql-sch-box" style="font-size:10.5px;line-height:2;color:#94a3b8">
        <span class="gql-sch-kw">type</span> <span class="gql-sch-type">Query</span> {<br>
        &nbsp;user(id: <span class="gql-sch-scalar">ID!</span>): <span class="gql-sch-type">User</span><br>
        &nbsp;posts(filter: <span class="gql-sch-type">PostFilter</span>): [<span class="gql-sch-type">Post</span>!]!<br>
        }<br>
        <span class="gql-sch-kw">type</span> <span class="gql-sch-type">Mutation</span> {<br>
        &nbsp;createPost(input: <span class="gql-sch-type">CreatePostInput</span>!): <span class="gql-sch-type">Post</span>!<br>
        &nbsp;deletePost(id: <span class="gql-sch-scalar">ID!</span>): <span class="gql-sch-scalar">Boolean</span>!<br>
        }<br>
        <span class="gql-sch-kw">type</span> <span class="gql-sch-type">Subscription</span> {<br>
        &nbsp;postCreated: <span class="gql-sch-type">Post</span>!<br>
        }
      </div>
    </div>
    <div>
      <div style="font-size:9px;color:#61DAFB;letter-spacing:.1em;font-weight:700;margin-bottom:6px;text-transform:uppercase">Tipos customizados e input</div>
      <div class="gql-sch-box" style="font-size:10.5px;line-height:2;color:#94a3b8">
        <span class="gql-sch-kw">type</span> <span class="gql-sch-type">Post</span> {<br>
        &nbsp;id: <span class="gql-sch-scalar">ID!</span><br>
        &nbsp;title: <span class="gql-sch-scalar">String!</span><br>
        &nbsp;status: <span class="gql-sch-type">PostStatus</span>!<br>
        &nbsp;author: <span class="gql-sch-type">User</span>!<br>
        }<br>
        <span class="gql-sch-kw">input</span> <span class="gql-sch-type">CreatePostInput</span> {<br>
        &nbsp;title: <span class="gql-sch-scalar">String!</span><br>
        &nbsp;authorId: <span class="gql-sch-scalar">ID!</span><br>
        }<br>
        <span class="gql-sch-kw">input</span> <span class="gql-sch-type">PostFilter</span> {<br>
        &nbsp;status: <span class="gql-sch-type">PostStatus</span><br>
        }
      </div>
    </div>
    <div>
      <div style="font-size:9px;color:#fbbf24;letter-spacing:.1em;font-weight:700;margin-bottom:6px;text-transform:uppercase">Enum, scalar e directive</div>
      <div class="gql-sch-box" style="font-size:10.5px;line-height:2;color:#94a3b8">
        <span class="gql-sch-kw">enum</span> <span class="gql-sch-enum">PostStatus</span> {<br>
        &nbsp;DRAFT  PUBLISHED  ARCHIVED<br>
        }<br>
        <span class="gql-sch-kw">scalar</span> <span class="gql-sch-scalar">DateTime</span><br>
        <span class="gql-sch-kw">scalar</span> <span class="gql-sch-scalar">JSON</span><br>
        <span class="gql-sch-dir">directive</span> <span class="gql-sch-dir">@auth</span>(role: <span class="gql-sch-scalar">String</span>) <span class="gql-sch-kw">on</span> FIELD_DEFINITION
      </div>
    </div>
    <div>
      <div style="font-size:9px;color:#a78bfa;letter-spacing:.1em;font-weight:700;margin-bottom:6px;text-transform:uppercase">Fragment e variables</div>
      <div class="gql-sch-box" style="font-size:10.5px;line-height:2;color:#94a3b8">
        <span class="gql-sch-cm"># Fragment — reutiliza campos</span><br>
        <span class="gql-sch-kw">fragment</span> <span class="gql-sch-type">PostFields</span> <span class="gql-sch-kw">on</span> Post {<br>
        &nbsp;id title status<br>
        }<br>
        <span class="gql-sch-cm"># Query com variable tipada</span><br>
        <span class="gql-sch-kw">query</span> GetPost(<span style="color:#a78bfa">$id</span>: <span class="gql-sch-scalar">ID!</span>) {<br>
        &nbsp;post(id: <span style="color:#a78bfa">$id</span>) { ...<span class="gql-sch-type">PostFields</span> }<br>
        }
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:10px 14px;border:1px solid #1e3a5f">
    <div style="font-size:10px;color:#64748b;line-height:1.8">
      <span class="gql-sch-type">Query | Mutation | Subscription</span> → campos → <span class="gql-sch-type">custom types</span> (type / input) → <span class="gql-sch-scalar">Scalars</span> (String, Int, Float, Boolean, ID, custom) → <span class="gql-sch-enum">Enums</span><br>
      <span class="gql-sch-dir">Directives</span> anotam campos/tipos com comportamento extra (<code>@deprecated</code>, <code>@auth</code>, <code>@cacheControl</code>). <strong style="color:#94a3b8">!</strong> = non-null (obrigatório).
    </div>
  </div>
</div>`,
        caption: "O schema é o contrato da API. Query são leituras, Mutation escrita, Subscription tempo real. input types são como o 'request body' do REST. Scalars customizados (DateTime, JSON) permitem tipos que o GraphQL não tem nativamente.",
      },
    ],
    keypoints: [
      {
        title: "Schema e SDL — o contrato da API",
        body: "SDL (Schema Definition Language) define o schema GraphQL. type descreve entidades retornadas pelo servidor. input descreve argumentos enviados pelo cliente para mutations. enum lista valores válidos. scalar representa tipos primitivos — built-in: String, Int, Float, Boolean, ID; customizados: DateTime, JSON, UUID. directive anota o schema com comportamento extra (@deprecated, @auth). O schema é imutável para o cliente — é o contrato compartilhado entre frontend e backend.",
        code: `type Query {
  user(id: ID!): User
  posts(status: PostStatus, limit: Int = 10): [Post!]!
}
type Mutation {
  createPost(input: CreatePostInput!): Post!
}
type User {
  id: ID!
  name: String!
  posts: [Post!]!
  createdAt: DateTime!  # scalar customizado
}
input CreatePostInput {
  title: String!
  authorId: ID!
  status: PostStatus = DRAFT
}
enum PostStatus { DRAFT  PUBLISHED  ARCHIVED }
scalar DateTime
directive @auth(role: String!) on FIELD_DEFINITION`,
      },
      {
        title: "Resolvers — (parent, args, context, info)",
        body: "Resolver é a função que retorna o valor de um campo. 4 argumentos: parent (valor do resolver pai — a cadeia), args (argumentos passados pelo cliente), context (objeto compartilhado por todos os resolvers do request — DataLoader, auth, db), info (metadados da query). Resolver padrão: se não definido para campo simples, GraphQL retorna parent[fieldName] automaticamente. Você só precisa definir resolvers onde há lógica ou o nome do campo não bate com a propriedade.",
        code: `const resolvers = {
  Query: {
    user: async (_, { id }, { db }) => db.users.findById(id),
    posts: async (_, { status, limit }, { db }) =>
      db.posts.findMany({ where: { status }, take: limit }),
  },
  Mutation: {
    createPost: async (_, { input }, { db, user }) => {
      if (!user) throw new GraphQLError('Não autenticado', {
        extensions: { code: 'UNAUTHENTICATED' },
      })
      return db.posts.create({ data: input })
    },
  },
  User: {
    // parent = objeto User retornado por Query.user
    // sem DataLoader = N+1 em lista
    posts: (parent, _, { dataloaders }) =>
      dataloaders.postsByUserId.load(parent.id),
  },
}`,
      },
      {
        title: "DataLoader — batch e cache para eliminar N+1",
        body: "DataLoader funciona em dois passos: (1) loader.load(id) não executa — registra o id em um buffer; (2) no próximo tick do event loop, batchFn é chamada com todos os IDs acumulados de uma vez, faz uma única query e retorna array de resultados na mesma ordem dos IDs. DataLoader também faz cache por request: load(id) chamado duas vezes retorna o mesmo resultado sem ir ao banco. Regra crítica: instância nova por request no context — nunca singleton.",
        code: `import DataLoader from 'dataloader'

// batchFn deve retornar resultados na MESMA ORDEM dos ids
async function batchUsers(ids: readonly string[], prisma: PrismaClient) {
  const users = await prisma.user.findMany({ where: { id: { in: [...ids] } } })
  const byId = new Map(users.map(u => [u.id, u]))
  // Map garante a ordem correta dos IDs
  return ids.map(id => byId.get(id) ?? new Error(\`User \${id} não encontrado\`))
}

// Criar por request — no Apollo context function
function createContext({ prisma }: { prisma: PrismaClient }) {
  return {
    prisma,
    dataloaders: {
      // Nova instância por request = cache isolado por request
      users: new DataLoader((ids: readonly string[]) =>
        batchUsers(ids, prisma)
      ),
    },
  }
}

// No resolver — load() acumula no tick, batch roda uma vez
const resolvers = {
  Post: {
    author: (post, _, { dataloaders }) =>
      dataloaders.users.load(post.authorId),
  },
}`,
      },
      {
        title: "Subscriptions com Redis PubSub",
        body: "Subscriptions entregam dados em tempo real via WebSocket. O servidor publica eventos em um canal (PubSub.publish) e o cliente está subscrito nesse canal. Em escala horizontal, use Redis PubSub para que qualquer instância do servidor possa publicar e todos os servidores recebam o evento para encaminhar aos clientes conectados. PubSub in-memory funciona apenas em dev (instância única).",
        code: `import { RedisPubSub } from 'graphql-redis-subscriptions'
import Redis from 'ioredis'

const pubsub = new RedisPubSub({
  publisher: new Redis({ host: process.env.REDIS_HOST }),
  subscriber: new Redis({ host: process.env.REDIS_HOST }),
})

const POST_CREATED = 'POST_CREATED'

const resolvers = {
  Mutation: {
    createPost: async (_, { input }, { db }) => {
      const post = await db.posts.create({ data: input })
      await pubsub.publish(POST_CREATED, { postCreated: post })
      return post
    },
  },
  Subscription: {
    postCreated: {
      subscribe: () => pubsub.asyncIterator([POST_CREATED]),
    },
  },
}`,
      },
      {
        title: "Segurança — depth limit, complexity, introspection, persisted queries",
        body: "Uma API GraphQL sem limitações é vulnerável: queries aninhadas infinitas causam recursão; queries de alta complexidade derrubam o banco. Medidas: (1) depth limiting — rejeita queries com aninhamento acima de N níveis; (2) complexity limiting — cada campo tem custo, query acima do limite é rejeitada antes de executar; (3) introspection desabilitada em produção; (4) persisted queries — só aceita hashes de queries pré-aprovadas; (5) rate limiting por operação/usuário.",
        code: `import depthLimit from 'graphql-depth-limit'
import { createComplexityLimitRule } from 'graphql-validation-complexity'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    depthLimit(7),                        // max 7 níveis
    createComplexityLimitRule(1000, {      // max 1000 pontos
      scalarCost: 1,
      objectCost: 10,
      listFactor: 10,
    }),
  ],
  introspection: process.env.NODE_ENV !== 'production',
})`,
      },
      {
        title: "Context e autenticação — verificação centralizada",
        body: "O context é criado uma vez por request e passado para todos os resolvers. Autenticação deve acontecer na função de context — não dentro de cada resolver. Coloque no context: usuário autenticado (extraído do JWT), conexão de banco, instâncias de DataLoader (criadas por request). Nunca crie DataLoader dentro do resolver (criaria um loader por chamada, sem batching).",
        code: `const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    const token = req.headers.authorization?.split(' ')[1]
    let user = null
    if (token) {
      try { user = jwt.verify(token, process.env.JWT_SECRET) }
      catch { /* token inválido — user permanece null */ }
    }
    return {
      user,           // null se não autenticado
      prisma,
      dataloaders: createDataLoaders(prisma),  // nova instância por request
    }
  },
})`,
      },
      {
        title: "Error handling — HTTP 200 sempre, erros em errors[]",
        body: "GraphQL sempre retorna HTTP 200, mesmo em caso de erro de negócio. Erros ficam no array errors[] do response body. Isso significa que monitoramento baseado em status code HTTP não funciona — monitore o array errors[]. Use GraphQLError com extensions.code para categorizar: UNAUTHENTICATED, FORBIDDEN, NOT_FOUND, VALIDATION_ERROR. Nunca retorne null em mutation sem incluir o erro correspondente.",
        code: `// GraphQLError com extensions — padrão Apollo
throw new GraphQLError('Post não encontrado', {
  extensions: {
    code: 'NOT_FOUND',
    postId: id,
  },
})

// Response — HTTP 200, erro em errors[]
// { "data": { "post": null },
//   "errors": [{ "message": "Post não encontrado",
//                "extensions": { "code": "NOT_FOUND" },
//                "path": ["post"] }] }`,
      },
      {
        title: "Code-first vs schema-first — quando usar cada",
        body: "Schema-first: você escreve SDL manualmente (.graphql) e implementa resolvers correspondentes. Explícito e legível, mas pode desincronizar com TypeScript. Code-first: decorators TypeScript geram o schema automaticamente (TypeGraphQL, NestJS @nestjs/graphql). Vantagem: schema sempre sincronizado com os tipos TS, sem duplicação. Desvantagem: a abstração pode esconder o SDL real. Em NestJS, code-first é o padrão recomendado.",
        code: `// Code-first com TypeGraphQL
@ObjectType()
class Post {
  @Field(() => ID) id: string
  @Field() title: string
  @Field(() => PostStatus) status: PostStatus
}

@Resolver(() => Post)
class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() { prisma }: Context): Promise<Post[]> {
    return prisma.post.findMany()
  }

  @Mutation(() => Post)
  @Authorized('ADMIN')
  async createPost(
    @Arg('input') input: CreatePostInput,
    @Ctx() { prisma }: Context,
  ): Promise<Post> {
    return prisma.post.create({ data: input })
  }
}`,
      },
      {
        title: "Apollo Federation — schema distribuído entre microserviços",
        body: "Federation permite que múltiplos serviços GraphQL contribuam para um schema unificado. Cada serviço usa @key para declarar a entidade que 'possui' e pode estender tipos de outros serviços. O Apollo Router compõe os schemas e roteia queries. Ideal para microserviços onde o frontend deve enxergar um único endpoint GraphQL sem saber de quantos serviços os dados vêm.",
        code: `# Serviço de usuários — dono de User
type User @key(fields: "id") {
  id: ID!
  name: String!
}

# Serviço de posts — estende User com posts
extend type User @key(fields: "id") {
  id: ID! @external
  posts: [Post!]!
}

# Resolver de referência — permite ao Router reconstituir User
const resolvers = {
  User: {
    __resolveReference: ({ id }, { prisma }) =>
      prisma.user.findUnique({ where: { id } }),
    posts: ({ id }, _, { prisma }) =>
      prisma.post.findMany({ where: { authorId: id } }),
  },
}`,
      },
      {
        title: "Persisted queries — segurança e performance",
        body: "Persisted queries (APQ) substituem o texto da query pelo hash SHA256. O cliente envia o hash; se o servidor não o conhece, cliente reenvia com a query completa. Em produção: configure o servidor para aceitar apenas hashes pré-registrados (trusted documents), bloqueando queries arbitrárias — incluindo tentativas de exploração de depth/complexity.",
        code: `// Apollo Client — APQ automático
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries'
import { sha256 } from 'crypto-hash'

const link = createPersistedQueryLink({ sha256 }).concat(httpLink)

// Apollo Server — somente queries pré-registradas em produção
import { ApolloServerPluginPersistedQueries } from '@apollo/server/plugin/persistedQueries'

const server = new ApolloServer({
  plugins: [
    ApolloServerPluginPersistedQueries({
      allowUnpersistedOperation: process.env.NODE_ENV !== 'production',
    }),
  ],
})`,
      },
      {
        title: "Setup Apollo Server completo — configuração de produção",
        body: "Apollo Server v4 é a implementação de referência. O setup básico: typeDefs (schema SDL), resolvers, plugins e função de context. Para produção: desabilite introspection, desabilite o sandbox, formate erros removendo stack traces, adicione plugins de logging.",
        code: `import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageLocalDefault(),
  ],
  introspection: process.env.NODE_ENV !== 'production',
  formatError: (formattedError) => {
    if (process.env.NODE_ENV === 'production') {
      // Remove stack traces em produção
      return { message: formattedError.message, extensions: formattedError.extensions }
    }
    return formattedError
  },
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => ({
    user: extractUser(req),
    prisma,
    dataloaders: createDataLoaders(prisma),
  }),
})`,
      },
      {
        title: "N+1 alternativas — join no resolver pai",
        body: "DataLoader é a solução mais elegante para N+1, mas quando você sempre vai precisar de um campo relacionado, pode fazer JOIN no resolver pai — isso evita o N+1 sem DataLoader, sacrificando a granularidade do GraphQL (carrega sempre, mesmo que o cliente não peça). DataLoader para campos opcionais pedidos às vezes; JOIN no pai para relações sempre pedidas.",
        code: `// Opção 1: DataLoader (granular, recomendado na maioria dos casos)
Post: {
  author: (post, _, { dataloaders }) =>
    dataloaders.users.load(post.authorId),  // batch automático
}

// Opção 2: JOIN no resolver pai (sempre carrega, mais simples)
Query: {
  posts: async (_, __, { prisma }) =>
    prisma.post.findMany({
      include: { author: true },  // author sempre vem junto
    }),
}
Post: {
  author: (post) => post.author,  // usa o que já veio do JOIN
}`,
      },
      {
        title: "Estrutura de projeto escalável — separar por domínio",
        body: "Em projetos grandes, separar resolvers e typeDefs por domínio. Usar @graphql-tools/merge para combinar schemas e resolvers de múltiplos arquivos. DataLoaders centralizados em uma função createDataLoaders(prisma) chamada no context.",
        code: `// resolvers/user.ts — só resolvers de User
export const userResolvers = {
  Query: { user, users },
  Mutation: { createUser, updateUser },
  User: { posts, orders },
}

// resolvers/post.ts — só resolvers de Post
export const postResolvers = {
  Query: { post, posts },
  Mutation: { createPost },
  Post: { author },
}

// resolvers/index.ts — merge
import { mergeResolvers } from '@graphql-tools/merge'
export const resolvers = mergeResolvers([userResolvers, postResolvers])

// typeDefs/index.ts — merge de SDL
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
export const typeDefs = mergeTypeDefs(loadFilesSync('./src/**/*.graphql'))`,
      },
    ],
    cheatsheet: {
      title: "GraphQL — Cheat Sheet SDL + Resolvers + DataLoader",
      html: `<style>
.gql-cs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px}
.gql-cs-card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px}
.gql-cs-head{font-size:9px;color:#64748b;letter-spacing:.14em;text-transform:uppercase;margin:14px 0 8px;padding-bottom:5px;border-bottom:1px solid #1e3a5f}
.gql-cs-kw{color:#E10098}
.gql-cs-type{color:#61DAFB}
.gql-cs-sc{color:#4ade80}
.gql-cs-en{color:#fbbf24}
.gql-cs-cm{color:#475569}
.gql-cs-label{font-size:10px;font-weight:700;margin-bottom:5px}
.gql-cs-body{font-size:9.5px;color:#64748b;line-height:1.55}
.gql-cs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
</style>
<div class="gql-cs-wrap">
  <p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 14px;letter-spacing:.06em">GRAPHQL — CHEAT SHEET</p>
  <div class="gql-cs-head">SDL — DEFINIÇÃO DE SCHEMA</div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px;font-size:10px;line-height:2;color:#94a3b8;margin-bottom:8px">
    <span class="gql-cs-kw">type</span> <span class="gql-cs-type">Query</span> { user(id: <span class="gql-cs-sc">ID!</span>): <span class="gql-cs-type">User</span>  posts: [<span class="gql-cs-type">Post</span>!]! }<br>
    <span class="gql-cs-kw">type</span> <span class="gql-cs-type">Mutation</span> { createUser(input: <span class="gql-cs-type">CreateUserInput</span>!): <span class="gql-cs-type">User</span>! }<br>
    <span class="gql-cs-kw">type</span> <span class="gql-cs-type">Subscription</span> { userCreated: <span class="gql-cs-type">User</span>! }<br>
    <span class="gql-cs-kw">type</span> <span class="gql-cs-type">User</span> { id: <span class="gql-cs-sc">ID!</span>  name: <span class="gql-cs-sc">String!</span>  role: <span class="gql-cs-en">Role</span>  posts: [<span class="gql-cs-type">Post</span>!]! }<br>
    <span class="gql-cs-kw">input</span> <span class="gql-cs-type">CreateUserInput</span> { name: <span class="gql-cs-sc">String!</span>  email: <span class="gql-cs-sc">String!</span> }<br>
    <span class="gql-cs-kw">enum</span> <span class="gql-cs-en">Role</span> { ADMIN  USER  GUEST }<br>
    <span class="gql-cs-kw">scalar</span> <span class="gql-cs-sc">DateTime</span>  <span style="color:#a78bfa">directive</span> <span style="color:#a78bfa">@auth</span>(role: <span class="gql-cs-sc">String!</span>) <span class="gql-cs-kw">on</span> FIELD_DEFINITION
  </div>
  <div class="gql-cs-head">RESOLVERS — ASSINATURA E PADRÕES</div>
  <div class="gql-cs-grid" style="margin-bottom:8px">
    <div class="gql-cs-card">
      <div class="gql-cs-label" style="color:#E10098">4 args — PACI</div>
      <div style="font-size:10px;line-height:1.9;color:#94a3b8">
        field: (<span style="color:#E10098">P</span>arent,<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color:#61DAFB">A</span>rgs,<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color:#4ade80">C</span>ontext,<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color:#fbbf24">I</span>nfo) =&gt; valor
      </div>
    </div>
    <div class="gql-cs-card">
      <div class="gql-cs-label" style="color:#4ade80">DataLoader — obrigatório</div>
      <div style="font-size:10px;line-height:1.9;color:#94a3b8">
        Post: {<br>
        &nbsp;author: (p, _, { dl }) =&gt;<br>
        &nbsp;&nbsp;dl.users.load(p.authorId)<br>
        }
      </div>
    </div>
    <div class="gql-cs-card">
      <div class="gql-cs-label" style="color:#fbbf24">Subscription</div>
      <div style="font-size:10px;line-height:1.9;color:#94a3b8">
        postCreated: {<br>
        &nbsp;subscribe: () =&gt;<br>
        &nbsp;&nbsp;pubsub.asyncIterator([<br>
        &nbsp;&nbsp;&nbsp;'POST_CREATED'])<br>
        }
      </div>
    </div>
    <div class="gql-cs-card">
      <div class="gql-cs-label" style="color:#ef4444">Erro GraphQL</div>
      <div style="font-size:10px;line-height:1.9;color:#94a3b8">
        <span class="gql-cs-kw">throw new</span> GraphQLError(<br>
        &nbsp;'msg', { extensions: {<br>
        &nbsp;&nbsp;code: 'NOT_FOUND'<br>
        &nbsp;}})<br>
        <span class="gql-cs-cm">// HTTP 200, erro em errors[]</span>
      </div>
    </div>
  </div>
  <div class="gql-cs-head">DATALOADER — SETUP OBRIGATÓRIO</div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px;font-size:10px;line-height:1.9;color:#94a3b8;margin-bottom:8px">
    <span class="gql-cs-kw">new</span> DataLoader(<span class="gql-cs-kw">async</span> (ids) =&gt; {<br>
    &nbsp;&nbsp;<span class="gql-cs-kw">const</span> rows = <span class="gql-cs-kw">await</span> db.findMany({ where: { id: { in: [...ids] } } })<br>
    &nbsp;&nbsp;<span class="gql-cs-kw">const</span> map = <span class="gql-cs-kw">new</span> Map(rows.map(r =&gt; [r.id, r]))<br>
    &nbsp;&nbsp;<span class="gql-cs-kw">return</span> ids.map(id =&gt; map.get(id)) <span class="gql-cs-cm">// MESMA ordem dos ids</span><br>
    }) <span class="gql-cs-cm">// Nova instância por request — nunca global</span>
  </div>
  <div class="gql-cs-head">SEGURANÇA — CHECKLIST DE PRODUÇÃO</div>
  <div class="gql-cs-grid">
    <div class="gql-cs-card">
      <div class="gql-cs-label" style="color:#ef4444">Nunca em produção</div>
      <div class="gql-cs-body">❌ introspection: true<br>❌ sem depthLimit<br>❌ sem complexityLimit<br>❌ DataLoader singleton</div>
    </div>
    <div class="gql-cs-card">
      <div class="gql-cs-label" style="color:#4ade80">Sempre em produção</div>
      <div class="gql-cs-body">✓ depthLimit(7)<br>✓ complexityLimit(1000)<br>✓ persisted queries<br>✓ rate limit por operação</div>
    </div>
  </div>
</div>`,
    },
    gotchas: [
      "N+1 sem DataLoader: o resolver de campo relacionado (Post.author) executa uma query para cada item da lista. Com 100 posts são 101 queries. DataLoader com batchFn resolve para 2 queries independente do tamanho — obrigatório em produção.",
      "DataLoader singleton (instância global): se você cria o DataLoader fora da função de context, o cache é compartilhado entre requests e usuários diferentes. Crie sempre uma instância nova no context por request.",
      "Introspection em produção: permite que qualquer pessoa mapeie todo o schema, descubra tipos, campos e argumentos. Desabilite com introspection: false no Apollo Server em produção.",
      "Sem depth/complexity limit: uma query aninhada como { users { posts { comments { author { posts { ... } } } } } } pode causar JOINs exponenciais. Implemente depthLimit e complexityLimit como validationRules antes de ir para produção.",
      "Mutation retornando null sem erro explícito: GraphQL sempre retorna HTTP 200. Se um campo de mutation retorna null (tipo nullable), o cliente não sabe se foi intencional ou falha silenciosa. Use campos non-null (!) ou lance GraphQLError.",
      "batchFn retornando resultados fora de ordem: DataLoader exige que batchFn retorne resultados na exata mesma ordem dos IDs recebidos. Se usar findMany com IN(), o banco não garante ordem — use um Map keyed por ID para ordenar corretamente.",
      "Overfetching no resolver pai para evitar N+1: carregar sempre todos os campos relacionados com JOIN mesmo quando o cliente não pediu sacrifica a granularidade do GraphQL. DataLoader mantém a granularidade sem o N+1.",
      "Erro de negócio lançado como Error nativo: o Apollo converte Error em resposta de erro mas perde o extensions.code. Use sempre GraphQLError para que o cliente possa tratar erros categorizados (UNAUTHENTICATED vs NOT_FOUND).",
    ],
    interview: [
      {
        q: "Como o ciclo de execução de uma query GraphQL funciona? Quais as fases?",
        level: "senior",
        a: "<p>Uma query GraphQL passa por três fases antes de retornar dados:</p><ol><li><strong>Parse</strong>: o texto é convertido em AST pelo lexer + parser. Erros de sintaxe retornam imediatamente.</li><li><strong>Validate</strong>: a AST é verificada semanticamente contra o schema. Campos inexistentes, argumentos com tipo errado — todos geram erros antes de um único resolver ser chamado. É aqui que depth limit e complexity limit entram.</li><li><strong>Execute</strong>: o executor percorre a AST campo a campo, chamando o resolver de cada campo com o valor do pai como primeiro argumento (parent). Começa nos campos de Query/Mutation/Subscription e desce recursivamente.</li></ol><p>Cada resolver recebe <code>(parent, args, context, info)</code>. O context é compartilhado por todos os resolvers do mesmo request.</p>",
        tip: "Mencionar PVEX (Parse → Validate → Execute) mostra que você conhece a separação de fases. O ponto chave: validate roda antes de execute — consultas maliciosas são rejeitadas sem tocar no banco se depth/complexity limit estiverem configurados.",
      },
      {
        q: "Explique o problema N+1 em GraphQL e como o DataLoader resolve. Como funciona internamente?",
        level: "senior",
        a: "<p>O <strong>N+1</strong> surge porque GraphQL executa resolvers campo a campo. Com 100 posts e resolver <code>Post.author</code> que faz <code>db.users.findById(post.authorId)</code>, o resultado é 1 + 100 = 101 queries.</p><p><strong>DataLoader</strong> resolve com batching assíncrono:</p><ol><li><code>loader.load(id)</code> não executa — registra o ID no buffer e retorna uma Promise.</li><li>No <em>próximo tick do event loop</em>, a <code>batchFn</code> é chamada com todos os IDs acumulados. Você faz uma única query <code>WHERE id IN (...)</code> e retorna array na mesma ordem dos IDs.</li></ol><p><strong>Regra crítica 1:</strong> a <code>batchFn</code> deve retornar resultados na <strong>mesma ordem</strong> dos IDs recebidos — use Map keyed por ID.</p><p><strong>Regra crítica 2:</strong> crie nova instância de DataLoader por request no context — nunca singleton, o cache interno vazaria entre usuários.</p>",
        tip: "A maioria menciona 'DataLoader faz batch'. O que diferencia sênior é explicar o mecanismo interno: buffer no tick + batchFn no próximo tick. E a armadilha da ordenação da batchFn.",
      },
      {
        q: "GraphQL vs REST — quando usar cada? E quando usar BFF?",
        level: "pleno",
        a: "<p><strong>REST:</strong> API pública consumida por terceiros, caching HTTP nativo, operações simples CRUD onde overfetching não é problema, equipes que já dominam REST.</p><p><strong>GraphQL:</strong> múltiplos clientes com necessidades diferentes (mobile precisa menos campos que web), schema como contrato forte entre times, federation de microserviços com schema unificado.</p><p><strong>BFF (Backend for Frontend):</strong> um padrão que combina os dois — REST internamente entre microserviços (contratos simples, performance) e GraphQL na borda para os clientes. O BFF GraphQL agrega serviços REST e expõe flexibilidade sem expor a complexidade interna.</p>",
      },
      {
        q: "Como você protegeria uma API GraphQL em produção?",
        level: "senior",
        a: "<p>Checklist em ordem de prioridade:</p><ol><li><strong>Desabilitar introspection:</strong> <code>introspection: false</code> em produção. Sem isso, qualquer pessoa mapeia o schema completo.</li><li><strong>Depth limiting:</strong> <code>depthLimit(7)</code> como validationRule. Previne queries aninhadas recursivas.</li><li><strong>Complexity limiting:</strong> cada campo tem custo. Rejeita queries custosas antes de executar.</li><li><strong>Rate limiting por operação:</strong> limitar por IP e usuário autenticado.</li><li><strong>Persisted queries:</strong> em produção, aceitar apenas hashes de queries pré-registradas — bloqueia queries arbitrárias.</li><li><strong>Auth no context:</strong> verificar JWT uma vez antes de qualquer resolver.</li></ol>",
        tip: "Listar na ordem certa importa. Persisted queries é o nível avançado que diferencia quem operou GraphQL em produção.",
      },
      {
        q: "O que é Apollo Federation e quando usar?",
        level: "senior",
        a: "<p>Federation permite que múltiplos serviços GraphQL independentes contribuam para um schema unificado acessado por um único endpoint (Apollo Router).</p><p><strong>Como funciona:</strong> cada serviço declara os tipos que 'possui' com <code>@key</code> e pode estender tipos de outros serviços. O Router planeja quais subgraphs consultar para cada campo e agrega os resultados.</p><p><strong>Quando usar:</strong> microserviços onde o frontend deve ver um único schema sem saber de quantos serviços os dados vêm.</p><p><strong>Quando NÃO usar:</strong> monolitos, times pequenos, quando a complexidade operacional não se justifica. Federation adiciona latência de rede entre subgraphs e complexidade de deployment.</p>",
      },
      {
        q: "Por que GraphQL sempre retorna HTTP 200? Quais os problemas para monitoramento?",
        level: "pleno",
        a: "<p>GraphQL usa um único endpoint POST. Sucesso parcial é possível — parte dos dados pode resolver enquanto outro campo falha. Por isso HTTP 200 é retornado mesmo em erro, com erros em <code>errors[]</code> e dados em <code>data[]</code>.</p><p><strong>Problemas para monitoramento:</strong> alertas de error rate baseados em HTTP ficam cegos, load balancers que rotam em erros HTTP não funcionam como esperado.</p><p><strong>Soluções:</strong> instrumentar plugin no Apollo Server que monitora o array <code>errors[]</code> e emite métricas; usar Apollo Studio; categorizar com <code>extensions.code</code> para diferenciar erros de cliente (UNAUTHENTICATED — não alertar) de servidor (INTERNAL_SERVER_ERROR — alertar).</p>",
      },
      {
        q: "Qual a diferença entre schema-first e code-first? Quando usar cada?",
        level: "pleno",
        a: "<p><strong>Schema-first:</strong> SDL escrito manualmente em arquivos .graphql. Explícito e legível, bom como contrato entre times. Pode desincronizar com TypeScript — use GraphQL Code Generator para gerar tipos TS a partir do SDL.</p><p><strong>Code-first:</strong> decorators TypeScript geram o SDL automaticamente (TypeGraphQL, NestJS). Schema sempre sincronizado, sem duplicação, autocompletion. A abstração pode esconder o SDL real.</p><p><strong>Quando usar:</strong> code-first para NestJS e times TypeScript-centric. Schema-first quando o SDL é o documento de contrato entre times distintos ou em projetos multilinguagem.</p>",
      },
      {
        q: "Como funciona o context no GraphQL? Quais as boas práticas?",
        level: "pleno",
        a: "<p>O context é criado uma vez por request e passado como terceiro argumento para todos os resolvers daquele request.</p><p><strong>O que colocar no context:</strong></p><ul><li><strong>Usuário autenticado:</strong> extraído e verificado do JWT uma vez na função de context</li><li><strong>Conexão de banco:</strong> instância Prisma ou pool</li><li><strong>DataLoaders:</strong> criados por request aqui — nunca dentro do resolver</li></ul><p><strong>Boas práticas:</strong> autenticação no context (erros de auth antes de qualquer resolver), context imutável durante o request, tipagem em TypeScript para autocompletion.</p>",
      },
      {
        q: "Explique subscriptions em GraphQL. Quais os desafios de escala horizontal?",
        level: "senior",
        a: "<p>Subscriptions entregam dados em tempo real via WebSocket. O cliente subscreve → servidor registra no PubSub → Mutation publica evento → servidor envia via WebSocket.</p><p><strong>Desafio de escala horizontal:</strong> WebSockets são stateful — o cliente está conectado a um servidor específico. Se o evento é publicado pela instância B, a instância A (onde o cliente está) não sabe.</p><p><strong>Solução: Redis PubSub</strong> — toda instância publica no Redis e assina o Redis. Quando uma instância publica, o Redis entrega para todas as instâncias, que repassam para os WebSockets conectados nelas.</p><p><strong>Custo operacional:</strong> WebSockets são conexões persistentes — cada cliente conectado consome recursos. Implemente heartbeat e timeout para conexões inativas.</p>",
      },
      {
        q: "O que são persisted queries e por que são importantes para segurança?",
        level: "senior",
        a: "<p>Persisted queries (APQ) substituem o texto da query pelo hash SHA256.</p><p><strong>Fluxo:</strong> cliente envia hash → servidor não conhece → cliente reenvia com query completa → servidor armazena e processa.</p><p><strong>Por que são importantes para segurança:</strong> em produção, configure o servidor para aceitar <strong>apenas hashes pré-registrados</strong> (trusted documents). Isso bloqueia queries arbitrárias — incluindo exploração de depth/complexity por atores maliciosos.</p><p><strong>Benefícios adicionais:</strong> payload reduzido (hash vs texto completo), GET cacheável por CDN, análise de uso (o servidor sabe exatamente quais queries o frontend usa, facilitando deprecação segura).</p>",
        tip: "O ponto chave é 'trusted documents em produção'. Não basta saber que APQ existe — a implicação de segurança é o que diferencia sênior.",
      },
      {
        q: "Qual a diferença entre type e input em GraphQL? Por que não posso usar type como argumento?",
        level: "pleno",
        a: "<p><strong>type:</strong> descreve objetos retornados pelo servidor. Pode ter campos com resolvers, relações circulares, campos computados. É o 'output type'.</p><p><strong>input:</strong> descreve argumentos enviados pelo cliente. Só pode ter scalars, enums ou outros inputs. É o 'input type'.</p><p><strong>Por que não usar type como argumento?</strong> Tipos de output podem ter campos computados (resolvers) e comportamentos que não fazem sentido como input. Se GraphQL permitisse misturar, criaria ambiguidade e dificultaria validação.</p><p>Na prática: sempre crie um <code>CreateUserInput</code> separado do <code>User</code> type — o que o cliente envia para criar (name, email) é diferente do que o servidor retorna (id, createdAt).</p>",
      },
      {
        q: "Como estruturar resolvers em projeto GraphQL grande?",
        level: "senior",
        a: "<p><strong>1. Separar por domínio:</strong> cada arquivo contém os resolvers do seu domínio (userResolvers, postResolvers) e são combinados com <code>mergeResolvers</code> do @graphql-tools/merge.</p><p><strong>2. SDL separado por arquivo:</strong> <code>loadFilesSync</code> + <code>mergeTypeDefs</code> para combinar schemas de múltiplos arquivos .graphql.</p><p><strong>3. DataLoaders centralizados:</strong> função <code>createDataLoaders(prisma)</code> chamada no context — cada loader disponível via <code>context.dataloaders.users.load(id)</code>.</p><p><strong>4. Auth declarativo com graphql-shield:</strong> regras por tipo/campo de forma declarativa em vez de <code>if (!user)</code> repetido em cada resolver.</p>",
      },
      {
        q: "Como implementar soft delete em GraphQL sem vazar dados deletados?",
        level: "senior",
        a: "<p><strong>3 camadas de proteção:</strong></p><p><strong>1. Filtro no banco em todos os resolvers:</strong> <code>where: { deletedAt: null }</code>. Se esquecer em um resolver, os dados aparecem.</p><p><strong>2. Middleware centralizado (Prisma Extension):</strong> adicionar o filtro automaticamente em todas as queries do modelo — sem depender de cada resolver lembrar.</p><pre><code>const prisma = basePrisma.$extends({\n  query: {\n    user: {\n      async findMany({ args, query }) {\n        args.where = { ...args.where, deletedAt: null }\n        return query(args)\n      },\n    },\n  },\n})</code></pre><p><strong>3. deletedAt não exposto no schema GraphQL:</strong> campo interno de soft delete não precisa aparecer no type User — o cliente não precisa saber desse detalhe de implementação.</p>",
      },
    ],
    mnemonics: [
      {
        label: "PVEX — ciclo da query",
        trick: "Parse → Validate → EXecute",
        explanation: "Toda query passa por essas 3 fases nessa ordem. Validate roda contra o schema antes de qualquer resolver ser chamado. Execute percorre a AST campo a campo.",
      },
      {
        label: "PACI — argumentos do resolver",
        trick: "Parent, Args, Context, Info",
        explanation: "Os 4 argumentos de qualquer resolver, sempre nessa ordem. Parent é o valor do resolver pai. Args são os argumentos do cliente. Context é compartilhado por todo o request. Info raramente usado no dia a dia.",
      },
      {
        label: "DataLoader: acumula no tick, batch no próximo",
        trick: "load() acumula → próximo tick → batchFn([ids]) → 1 query",
        explanation: "load() não vai ao banco imediatamente — registra o ID no buffer. No próximo tick do event loop, a batchFn é chamada com todos os IDs. Uma query para todos.",
      },
    ],
    codeExamples: [
      {
        title: "Setup completo Apollo Server 4 + Prisma + DataLoader",
        description: "Stack mínima de produção: schema SDL, resolvers, context com DataLoaders criados por request, error handling tipado.",
        code: `import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { GraphQLError } from 'graphql'
import { PrismaClient } from '@prisma/client'
import DataLoader from 'dataloader'
import depthLimit from 'graphql-depth-limit'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

interface Context {
  prisma: PrismaClient
  user: { id: string; role: string } | null
  loaders: ReturnType<typeof createLoaders>
}

function createLoaders(prisma: PrismaClient) {
  return {
    usersById: new DataLoader<string, User | Error>(async (ids) => {
      const rows = await prisma.user.findMany({ where: { id: { in: [...ids] } } })
      const byId = new Map(rows.map(u => [u.id, u]))
      return ids.map(id => byId.get(id) ?? new Error(\`User \${id} não encontrado\`))
    }),
    postsByAuthorId: new DataLoader<string, Post[]>(async (authorIds) => {
      const rows = await prisma.post.findMany({
        where: { authorId: { in: [...authorIds] } },
      })
      const byAuthor = new Map<string, Post[]>()
      for (const id of authorIds) byAuthor.set(id, [])
      for (const post of rows) byAuthor.get(post.authorId)!.push(post)
      return authorIds.map(id => byAuthor.get(id) ?? [])
    }),
  }
}

const typeDefs = \`#graphql
  type Query { user(id: ID!): User  posts: [Post!]! }
  type Mutation { createPost(input: CreatePostInput!): Post! }
  type User { id: ID!  name: String!  posts: [Post!]! }
  type Post { id: ID!  title: String!  author: User! }
  input CreatePostInput { title: String!  authorId: ID! }
\`

const resolvers = {
  Query: {
    user: (_: unknown, { id }: { id: string }, { loaders }: Context) =>
      loaders.usersById.load(id),
    posts: (_: unknown, __: unknown, { prisma }: Context) =>
      prisma.post.findMany(),
  },
  Mutation: {
    createPost: async (_: unknown, { input }: any, { prisma, user }: Context) => {
      if (!user) throw new GraphQLError('Não autenticado', {
        extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
      })
      return prisma.post.create({ data: input })
    },
  },
  User: {
    posts: (parent: User, _: unknown, { loaders }: Context) =>
      loaders.postsByAuthorId.load(parent.id),
  },
  Post: {
    author: (parent: Post, _: unknown, { loaders }: Context) =>
      loaders.usersById.load(parent.authorId),
  },
}

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(7)],
  introspection: process.env.NODE_ENV !== 'production',
  formatError: (err) => {
    if (process.env.NODE_ENV === 'production') {
      return { message: err.message, extensions: { code: err.extensions?.code } }
    }
    return err
  },
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }): Promise<Context> => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    let user = null
    try {
      if (token) user = jwt.verify(token, process.env.JWT_SECRET!) as Context['user']
    } catch { /* token inválido */ }
    return { prisma, user, loaders: createLoaders(prisma) }
  },
})
console.log(\`Servidor pronto em \${url}\`)`,
        language: "typescript",
      },
      {
        title: "Subscription com Redis PubSub e graphql-ws",
        description: "Subscriptions que escalam horizontalmente: Redis distribui eventos entre instâncias do servidor, qualquer instância pode publicar.",
        code: `import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import Redis from 'ioredis'

const pubsub = new RedisPubSub({
  publisher: new Redis(process.env.REDIS_URL!),
  subscriber: new Redis(process.env.REDIS_URL!),
})

const POST_CREATED = 'POST_CREATED'
const POST_UPDATED = (id: string) => \`POST_UPDATED:\${id}\`

const typeDefs = \`#graphql
  type Subscription {
    postCreated: Post!
    postUpdated(id: ID!): Post!
  }
  type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
  }
\`

const resolvers = {
  Mutation: {
    createPost: async (_: unknown, { input }: any, { prisma }: Context) => {
      const post = await prisma.post.create({ data: input })
      // Publica em canal global
      await pubsub.publish(POST_CREATED, { postCreated: post })
      return post
    },
    updatePost: async (_: unknown, { id, input }: any, { prisma }: Context) => {
      const post = await prisma.post.update({ where: { id }, data: input })
      // Publica em canal específico do recurso
      await pubsub.publish(POST_UPDATED(id), { postUpdated: post })
      return post
    },
  },
  Subscription: {
    postCreated: {
      subscribe: () => pubsub.asyncIterator([POST_CREATED]),
    },
    postUpdated: {
      // Cliente passa id como variável → subscribe filtrado
      subscribe: (_: unknown, { id }: { id: string }) =>
        pubsub.asyncIterator([POST_UPDATED(id)]),
    },
  },
}

const schema = makeExecutableSchema({ typeDefs, resolvers })
const httpServer = createServer()
const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' })
useServer({ schema, context: async () => ({ prisma, pubsub }) }, wsServer)

httpServer.listen(4000)`,
        language: "typescript",
      },
      {
        title: "Apollo Federation — subgraph de Posts estendendo User",
        description: "Como um subgraph estende um tipo de outro subgraph com @key e __resolveReference. O Apollo Router compõe os schemas e roteia queries automaticamente.",
        code: `// === Subgraph: users-service ===
const userTypeDefs = \`#graphql
  type User @key(fields: "id") {
    id: ID!
    name: String!
    email: String!
  }
  type Query {
    user(id: ID!): User
    me: User
  }
\`

const userResolvers = {
  Query: {
    user: (_, { id }, { prisma }) => prisma.user.findUnique({ where: { id } }),
    me: (_, __, { user }) => user,
  },
  User: {
    // Permite ao Router reconstituir um User dado seu id
    __resolveReference: ({ id }, { prisma }) =>
      prisma.user.findUnique({ where: { id } }),
  },
}

// === Subgraph: posts-service ===
const postTypeDefs = \`#graphql
  type Post @key(fields: "id") {
    id: ID!
    title: String!
    authorId: ID!
    # Estende User adicionando posts — User é dono de id
    author: User!
  }
  extend type User @key(fields: "id") {
    id: ID! @external
    posts: [Post!]!
  }
  type Query { post(id: ID!): Post  posts: [Post!]! }
\`

const postResolvers = {
  Query: {
    post: (_, { id }, { prisma }) => prisma.post.findUnique({ where: { id } }),
    posts: (_, __, { prisma }) => prisma.post.findMany(),
  },
  Post: {
    __resolveReference: ({ id }, { prisma }) =>
      prisma.post.findUnique({ where: { id } }),
    // O Router preenche User com {id} — basta retornar a referência
    author: (post) => ({ __typename: 'User', id: post.authorId }),
  },
  User: {
    posts: (user, _, { prisma }) =>
      prisma.post.findMany({ where: { authorId: user.id } }),
  },
}

// === Apollo Router (config) ===
// rover supergraph compose --config supergraph.yaml > supergraph.graphql
// router --supergraph supergraph.graphql --listen 0.0.0.0:4000`,
        language: "typescript",
      },
      {
        title: "graphql-shield — autorização declarativa por campo",
        description: "Em vez de espalhar if (!user) em todos os resolvers, declare regras de autorização como middleware GraphQL — testável e auditável.",
        code: `import { shield, rule, allow, deny } from 'graphql-shield'
import { applyMiddleware } from 'graphql-middleware'
import { makeExecutableSchema } from '@graphql-tools/schema'

// Regras reutilizáveis — cada uma é uma função que retorna boolean ou Error
const isAuthenticated = rule({ cache: 'contextual' })(
  async (_, __, { user }) => user !== null || new Error('Não autenticado')
)

const isAdmin = rule({ cache: 'contextual' })(
  async (_, __, { user }) => user?.role === 'ADMIN' || new Error('Sem permissão')
)

const isOwner = rule({ cache: 'strict' })(
  async (parent, _, { user }) =>
    parent.authorId === user?.id || new Error('Não é o autor')
)

// Aplicação por tipo/campo — fica óbvio o que cada campo exige
const permissions = shield({
  Query: {
    '*': allow,                       // queries públicas por padrão
    me: isAuthenticated,
    adminStats: isAdmin,
  },
  Mutation: {
    '*': isAuthenticated,             // qualquer mutation exige login
    deleteUser: isAdmin,
    deletePost: isOwner,              // só o autor pode deletar
  },
}, {
  fallbackError: 'Sem permissão',
  allowExternalErrors: true,
})

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions,
)

// Resolvers ficam limpos — sem if (!user) em cada um
const resolvers = {
  Mutation: {
    deletePost: async (_, { id }, { prisma }) =>
      prisma.post.delete({ where: { id } }),  // shield já validou
  },
}`,
        language: "typescript",
      },
    ],
    exercises: [
      {
        level: 'iniciante',
        title: "Schema-first GraphQL com Apollo Server — User e Post",
        description: "Construa uma API GraphQL básica com Apollo Server 4. Defina o schema SDL com tipos User e Post, suas relações (User tem posts: [Post!]!, Post tem author: User!) e queries (user(id), users, post(id), posts). Use dados em memória (arrays). Implemente resolvers para todos os campos. Teste no Apollo Sandbox enviando queries que aninhem user → posts → author.",
        concepts: ["schema SDL", "resolvers", "Apollo Server", "tipos relacionados", "queries aninhadas"],
        hint: "Para os campos Post.author e User.posts, defina resolvers explícitos: User.posts = parent => posts.filter(p => p.authorId === parent.id). Não use mock de banco — array em memória basta para entender o fluxo.",
        relatedKeypoints: [1, 2],
      },
      {
        level: 'intermediario',
        title: "Eliminar N+1 com DataLoader — antes e depois",
        description: "Comece com a API do exercício anterior usando Prisma (ou um SQLite simples). Implemente o resolver Post.author de forma ingênua (db.user.findUnique para cada post) e logue todas as queries. Envie a query { posts { title author { name } } } com 50 posts e conte: deve gerar 51 queries. Agora implemente DataLoader: crie createLoaders(prisma) chamado na função de context, refatore o resolver Post.author para usar loaders.users.load(post.authorId). Confirme que agora são apenas 2 queries no log. Demonstre por escrito a regra crítica da batchFn: ela DEVE retornar resultados na mesma ordem dos IDs.",
        concepts: ["N+1 problem", "DataLoader", "batchFn", "context por request", "Prisma"],
        hint: "Para logar queries no Prisma: const prisma = new PrismaClient({ log: ['query'] }). Na batchFn use Map: const byId = new Map(rows.map(r => [r.id, r])); return ids.map(id => byId.get(id) ?? null). Nunca crie o DataLoader fora da função de context — instância nova por request é regra de ouro.",
        relatedKeypoints: [3, 12],
      },
      {
        level: 'intermediario',
        title: "Subscriptions com graphql-ws — chat em tempo real",
        description: "Implemente uma subscription messageAdded(roomId: ID!): Message! que entrega mensagens em tempo real para clientes conectados em uma sala específica. Use graphql-ws como transporte WebSocket (não use as subscriptions deprecated do Apollo Server). Mutation sendMessage(roomId, text) deve persistir em memória e publicar no canal correto. Teste com dois clientes (duas abas) — mensagens enviadas em uma aparecem instantaneamente na outra.",
        concepts: ["subscriptions", "WebSocket", "graphql-ws", "PubSub", "filtragem por argumento"],
        hint: "Use PubSub in-memory para começar (graphql-subscriptions). O canal de cada sala deve ser nomeado: \`MESSAGE_ADDED:\${roomId}\`. No subscribe da subscription: pubsub.asyncIterator([\`MESSAGE_ADDED:\${args.roomId}\`]). Migre para Redis PubSub quando precisar de múltiplas instâncias.",
        relatedKeypoints: [4],
      },
      {
        level: 'senior',
        title: "API GraphQL pronta para produção — segurança completa",
        description: "Construa uma API GraphQL pronta para produção com TODAS as proteções: (1) introspection desabilitada em produção; (2) depth limit de 7 níveis; (3) complexity limit com graphql-validation-complexity ou graphql-cost-analysis; (4) persisted queries com lista de hashes pré-aprovados em produção; (5) rate limiting por IP e por usuário autenticado; (6) error masking — erros internos não vazam stack traces; (7) graphql-shield para autorização declarativa; (8) timeout por request; (9) métricas Prometheus para taxa de erro e latência. Documente cada proteção, por que existe e como testar que está funcionando.",
        concepts: ["security hardening", "depth limit", "complexity limit", "persisted queries", "rate limiting", "error masking", "graphql-shield", "observabilidade"],
        hint: "Para testar depth limit: envie uma query aninhada de 8 níveis e confirme que recebe erro antes de qualquer resolver rodar. Para complexity: defina custos customizados com @cost directive ou estimateComplexity. Para persisted queries em produção: use trusted documents (allowUnpersistedOperation: false). Métricas: instrumente via plugin do Apollo Server (requestDidStart hook).",
        relatedKeypoints: [5, 10],
      },
      {
        level: 'senior',
        title: "Migração REST → GraphQL Federation — 3 microserviços",
        description: "Você tem 3 APIs REST: users-service, posts-service, comments-service. Migre para Apollo Federation: cada serviço se torna um subgraph com seu schema GraphQL próprio. User é definido em users-service e estendido em posts-service (campo posts) e em comments-service (campo comments). Configure o Apollo Router para compor os 3 subgraphs. Demonstre uma query única no Router que aninha user → posts → comments — ela deve internamente chamar os 3 subgraphs corretamente. Documente os tradeoffs: latência de rede entre subgraphs vs simplicidade de schema único.",
        concepts: ["Apollo Federation", "subgraph", "@key", "__resolveReference", "Apollo Router", "schema composition"],
        hint: "Use rover supergraph compose para gerar o supergraph.graphql a partir dos 3 subgraph schemas. Para entender o roteamento: o Router faz query plan — descomprime mostrando quais campos de quais subgraphs serão chamados em cada etapa. Cada subgraph deve implementar __resolveReference para os tipos que estende.",
        relatedKeypoints: [9],
      },
    ],
    videos: [
      { title: "GraphQL Explained in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=eIQh02xuVw4", topic: "visão geral", note: "2 minutos para o modelo mental antes de aprofundar." },
      { title: "GraphQL + DataLoader Tutorial", channel: "Academind", url: "https://www.youtube.com/results?search_query=graphql+dataloader+n+1+academind", topic: "DataLoader / N+1", note: "Explicação visual do problema e solução com DataLoader." },
      { title: "Apollo Server 4 — Full Setup", channel: "The Net Ninja", url: "https://www.youtube.com/results?search_query=apollo+server+4+full+course+net+ninja", topic: "Apollo Server", note: "Setup completo: schema, resolvers, context, autenticação." },
      { title: "GraphQL Federation Explained", channel: "Apollo GraphQL", url: "https://www.youtube.com/results?search_query=apollo+federation+explained", topic: "Federation", note: "Como múltiplos subgraphs compõem um schema unificado via Apollo Router." },
      { title: "GraphQL Security — How to Protect Your API", channel: "The Guild", url: "https://www.youtube.com/results?search_query=graphql+security+depth+limit+complexity", topic: "Segurança", note: "Depth limit, complexity, persisted queries — checklist de produção." },
      { title: "Schema-first vs Code-first GraphQL", channel: "Ben Awad", url: "https://www.youtube.com/results?search_query=graphql+schema+first+vs+code+first+ben+awad", topic: "Arquitetura", note: "Comparativo prático com TypeGraphQL e Pothos." },
    ],
    resources: [
      { title: "graphql.org — Learn", url: "https://graphql.org/learn/", kind: "docs" },
      { title: "DataLoader (GitHub)", url: "https://github.com/graphql/dataloader", kind: "docs" },
      { title: "The Guild — GraphQL Tools", url: "https://the-guild.dev/graphql/tools", kind: "docs" },
      { title: "Apollo Server v4 Docs", url: "https://www.apollographql.com/docs/apollo-server/", kind: "docs" },
      { title: "How to GraphQL — Tutorial completo", url: "https://www.howtographql.com/", kind: "curso" },
      { title: "Apollo Federation Docs", url: "https://www.apollographql.com/docs/federation/", kind: "docs" },
      { title: "graphql-ws — WebSocket transport", url: "https://github.com/enisdenjo/graphql-ws", kind: "docs" },
      { title: "graphql-shield — autorização declarativa", url: "https://the-guild.dev/graphql/shield", kind: "docs" },
      { title: "Pothos — code-first schema builder", url: "https://pothos-graphql.dev/", kind: "docs" },
      { title: "Production Ready GraphQL — Marc-André Giroux", url: "https://book.productionreadygraphql.com/", kind: "livro" },
      { title: "Persisted Queries — Apollo guide", url: "https://www.apollographql.com/docs/apollo-server/performance/apq/", kind: "artigo" },
      { title: "graphql-depth-limit", url: "https://github.com/graphile/depth-limit", kind: "docs" },
    ],
  },

  "prisma": {
    tagline: "ORM Next-gen TypeScript: schema declarativo, Prisma Client tipado gerado, migrations declarativas.",
    why: "Prisma virou o ORM padrão para novos projetos Node/TypeScript em 2023-2025. Type-safety end-to-end (autocomplete dos campos, tipos de retorno corretos sem any) e migrations declarativas confiáveis são os diferenciais. Saber quando NÃO usar Prisma (edge runtime sem Accelerate, queries muito complexas, performance crítica em batch) e quando trocar por Drizzle ou TypeORM diferencia sênior de pleno em entrevistas técnicas. Em vagas remote internacionais, conhecer Prisma Accelerate (connection pooling) e Pulse (CDC em tempo real) é diferencial.",
    prerequisite: "TypeScript intermediário (generics, utility types — Prisma usa muito), SQL básico (SELECT, JOIN, WHERE, índices, transações), conceitos de banco relacional (chaves primárias, foreign keys, normalização). Node.js + ESM/CommonJS para configurar o projeto. Sem TypeScript você perde 80% do valor do Prisma — o cliente JavaScript funciona mas não tem autocomplete dos campos.",
    summary: "Prisma é composto de três peças: (1) <strong>Prisma Schema</strong> (schema.prisma) — fonte única de verdade do modelo de dados, declarado em uma DSL própria; (2) <strong>Prisma Client</strong> — biblioteca TypeScript gerada a partir do schema, com autocomplete e type inference total; (3) <strong>Prisma Migrate</strong> — gerador de migrations SQL a partir do diff entre schema atual e estado do banco. O fluxo é: você edita schema.prisma → roda prisma migrate dev → Prisma calcula o diff e gera SQL idempotente em prisma/migrations/ → aplica no banco e regenera o Client. Em produção, prisma migrate deploy aplica migrations já versionadas sem gerar novas. O Prisma Client expõe uma API fluent type-safe: findMany, findUnique, create, update, upsert, delete, com where, select, include, orderBy, take, skip — todos tipados dinamicamente. Suporta PostgreSQL, MySQL, SQLite, SQL Server, MongoDB e CockroachDB. Tradeoffs: queries muito complexas (CTE, window functions, agregações pesadas) caem em $queryRaw; em edge runtime exige Accelerate; performance em batch insert pode ficar atrás de Drizzle/SQL bruto.",
    howToStudy: "<strong>30 minutos antes de entrevista?</strong> Foque no diagrama do pipeline (schema → generate → migrate → client) e nas Q&As de nível pleno. Memorize a diferença entre <code>migrate dev</code> e <code>migrate deploy</code> e a regra: nunca <code>db push</code> em produção.<br><br><strong>Fim de semana?</strong> Crie um projeto novo, modele uma entidade com 3 relações (1-1, 1-N, N-N), gere o client e brinque com select/include aninhado no Prisma Studio. Faça os exercícios em ordem.<br><br><strong>Uma semana?</strong> Implemente soft delete com Prisma Extensions, transações interativas com $transaction, paginação por cursor, e configure Accelerate em um deploy real (Vercel + Neon). As Q&As de nível sênior devem ser respondidas sem consultar.",
    diagrams: [
      {
        title: "Pipeline Prisma — schema.prisma → generate → migrate → client tipado",
        html: `<style>
.prsm-pipe-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.prsm-pipe-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.prsm-pipe-tip:hover .prsm-pipe-tb{display:block}
.prsm-pipe-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.prsm-pipe-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes prsm-pipe-flow{0%{opacity:.2;transform:translateX(-8px)}50%{opacity:1;transform:translateX(0)}100%{opacity:.2;transform:translateX(8px)}}
.prsm-pipe-arr{font-size:18px;align-self:center;flex-shrink:0;animation:prsm-pipe-flow 2.4s ease-in-out infinite;color:#5A67D8}
.prsm-pipe-step{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:12px 14px;flex:1;min-width:0}
.prsm-kw{color:#5A67D8}
.prsm-type{color:#61DAFB}
.prsm-attr{color:#a78bfa}
.prsm-cm{color:#475569}
</style>
<div class="prsm-pipe-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Pipeline Prisma — da DSL ao Client tipado</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span></p>
  <div style="display:flex;gap:6px;align-items:stretch;margin-bottom:14px">
    <div class="prsm-pipe-step" style="border-color:rgba(90,103,216,.35)">
      <div style="font-size:9px;color:#5A67D8;letter-spacing:.1em;margin-bottom:8px;font-weight:700">① SCHEMA.PRISMA</div>
      <div style="font-size:10px;color:#94a3b8;line-height:1.85">
        <span class="prsm-kw">model</span> <span class="prsm-type">User</span> {<br>
        &nbsp;<span class="prsm-pipe-tip">id<span class="prsm-pipe-tb">@id marca chave primária. @default(cuid()) gera ID único de 24 chars no insert se não passado.</span></span> <span style="color:#4ade80">String</span> <span class="prsm-attr">@id</span> <span class="prsm-attr">@default(cuid())</span><br>
        &nbsp;email <span style="color:#4ade80">String</span> <span class="prsm-attr">@unique</span><br>
        &nbsp;<span class="prsm-pipe-tip">posts<span class="prsm-pipe-tb">Relação 1:N inferida — Post deve ter authorId apontando aqui. Não vira coluna no banco; só metadado para o Client.</span></span> <span class="prsm-type">Post[]</span><br>
        }
      </div>
    </div>
    <div class="prsm-pipe-arr">→</div>
    <div class="prsm-pipe-step">
      <div style="font-size:9px;color:#fbbf24;letter-spacing:.1em;margin-bottom:8px;font-weight:700">② PRISMA GENERATE</div>
      <div style="font-size:10px;color:#64748b;line-height:1.7">
        Lê schema → gera <span class="prsm-pipe-tip">node_modules/<wbr>@prisma/client<span class="prsm-pipe-tb">Client gerado em pasta dentro de node_modules — não é uma lib npm comum, ela existe localmente após generate.</span></span> com tipos TypeScript completos.
      </div>
    </div>
    <div class="prsm-pipe-arr">→</div>
    <div class="prsm-pipe-step">
      <div style="font-size:9px;color:#a78bfa;letter-spacing:.1em;margin-bottom:8px;font-weight:700">③ PRISMA MIGRATE</div>
      <div style="font-size:10px;color:#64748b;line-height:1.7">
        Calcula <span class="prsm-pipe-tip">diff<span class="prsm-pipe-tb">Compara schema atual com migrations já aplicadas (não com banco direto) — gera SQL incremental em prisma/migrations/&lt;timestamp&gt;_name/migration.sql.</span></span> entre schema e banco → gera SQL versionado.
      </div>
    </div>
    <div class="prsm-pipe-arr">→</div>
    <div class="prsm-pipe-step" style="border-color:rgba(74,222,128,.35)">
      <div style="font-size:9px;color:#4ade80;letter-spacing:.1em;margin-bottom:8px;font-weight:700">④ APP USA O CLIENT</div>
      <div style="font-size:10px;color:#94a3b8;line-height:1.85">
        prisma.<span class="prsm-type">user</span>.findMany({<br>
        &nbsp;where: { email: <span class="prsm-cm">/* tipado! */</span> }<br>
        })
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:14px 16px;border:1px solid #1e3a5f">
    <div style="font-size:9px;color:#5A67D8;letter-spacing:.1em;font-weight:600;margin-bottom:10px;text-transform:uppercase">Comandos por ambiente</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
      <div style="background:#0f172a;border:1px solid rgba(90,103,216,.3);border-radius:6px;padding:8px 12px;font-size:10px">
        <div style="color:#5A67D8;font-weight:700;margin-bottom:4px">DEV</div>
        <div style="color:#94a3b8;line-height:1.7">prisma migrate dev<br><span style="color:#475569">// gera + aplica + regenera client</span></div>
      </div>
      <div style="background:#0f172a;border:1px solid rgba(74,222,128,.3);border-radius:6px;padding:8px 12px;font-size:10px">
        <div style="color:#4ade80;font-weight:700;margin-bottom:4px">PROD / CI</div>
        <div style="color:#94a3b8;line-height:1.7">prisma migrate deploy<br><span style="color:#475569">// só aplica versionadas</span></div>
      </div>
      <div style="background:#0f172a;border:1px solid rgba(239,68,68,.3);border-radius:6px;padding:8px 12px;font-size:10px">
        <div style="color:#ef4444;font-weight:700;margin-bottom:4px">PROTOTYPE</div>
        <div style="color:#94a3b8;line-height:1.7">prisma db push<br><span style="color:#475569">// sync sem migration — NUNCA prod</span></div>
      </div>
    </div>
    <p style="font-size:11px;color:#475569;margin:10px 0 0;line-height:1.6"><strong style="color:#94a3b8">Regra de ouro:</strong> <code style="color:#ef4444">db push</code> nunca em produção — pula histórico de migrations. Em CI/CD use sempre <code style="color:#4ade80">migrate deploy</code>.</p>
  </div>
</div>`,
        caption: "Schema é fonte da verdade. generate produz o Client tipado. migrate gera SQL versionado em prisma/migrations/. Em dev: migrate dev faz tudo. Em produção: apenas migrate deploy aplica migrations já revisadas.",
      },
      {
        title: "Prisma Client API — fluent chain com TypeScript inference end-to-end",
        html: `<style>
.prsm-cli-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.prsm-cli-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.prsm-cli-tip:hover .prsm-cli-tb{display:block}
.prsm-cli-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:240px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.prsm-cli-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes prsm-cli-typed{0%,100%{background:rgba(90,103,216,.07);border-color:rgba(90,103,216,.25)}50%{background:rgba(90,103,216,.18);border-color:rgba(90,103,216,.55)}}
.prsm-cli-typed{animation:prsm-cli-typed 2.5s ease-in-out infinite;border:1px solid;border-radius:6px;padding:8px 11px}
.prsm-cli-step{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:7px 11px;font-size:10px;color:#94a3b8;display:flex;align-items:center;gap:8px}
</style>
<div class="prsm-cli-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Prisma Client — fluent API com inferência TypeScript</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Cada operador estreita o tipo do retorno automaticamente</p>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:14px;margin-bottom:14px">
    <div style="font-size:9px;color:#5A67D8;letter-spacing:.1em;font-weight:700;margin-bottom:10px;text-transform:uppercase">Encadeamento típico — leitura granular</div>
    <div style="display:flex;flex-direction:column;gap:6px">
      <div class="prsm-cli-step">
        <span style="color:#5A67D8;font-weight:700;flex-shrink:0;width:80px">findMany</span>
        <span style="color:#475569;font-size:9px">→</span>
        <span><span class="prsm-cli-tip">Operação raiz<span class="prsm-cli-tb">findMany retorna array. findUnique retorna T|null. findFirst aceita where mais flexível mas retorna T|null.</span></span> — entry point por modelo. Sem args, retorna tudo.</span>
      </div>
      <div class="prsm-cli-step">
        <span style="color:#fbbf24;font-weight:700;flex-shrink:0;width:80px">where</span>
        <span style="color:#475569;font-size:9px">→</span>
        <span>Filtros tipados — <span class="prsm-cli-tip">{ status: 'PUBLISHED', authorId: 'x', AND, OR, NOT }<span class="prsm-cli-tb">where aceita operadores: equals, not, in, notIn, lt, lte, gt, gte, contains, startsWith, endsWith, AND/OR/NOT compostos.</span></span></span>
      </div>
      <div class="prsm-cli-step">
        <span style="color:#a78bfa;font-weight:700;flex-shrink:0;width:80px">select</span>
        <span style="color:#475569;font-size:9px">→</span>
        <span><span class="prsm-cli-tip">Escolhe campos — TYPE NARROWS<span class="prsm-cli-tb">Com select, o tipo de retorno deixa de ser User e vira { id: string; name: string } — só os campos pedidos. Inferência automática.</span></span> { id: true, name: true }</span>
      </div>
      <div class="prsm-cli-step">
        <span style="color:#a78bfa;font-weight:700;flex-shrink:0;width:80px">include</span>
        <span style="color:#475569;font-size:9px">→</span>
        <span>Carrega relações — { posts: true } ou aninhado { posts: { include: { comments: true } } }</span>
      </div>
      <div class="prsm-cli-step">
        <span style="color:#4ade80;font-weight:700;flex-shrink:0;width:80px">orderBy</span>
        <span style="color:#475569;font-size:9px">→</span>
        <span>{ createdAt: 'desc' } — array para múltiplas chaves: [{ status }, { createdAt }]</span>
      </div>
      <div class="prsm-cli-step">
        <span style="color:#ef4444;font-weight:700;flex-shrink:0;width:80px">take / skip</span>
        <span style="color:#475569;font-size:9px">→</span>
        <span><span class="prsm-cli-tip">Paginação<span class="prsm-cli-tb">take=limit, skip=offset. Para listas grandes prefira cursor-based: cursor: { id: lastId }, take: 20, skip: 1.</span></span> — take: 20, skip: 0 (offset) ou cursor: { id: lastId }</span>
      </div>
    </div>
  </div>
  <div class="prsm-cli-typed" style="margin-bottom:14px">
    <div style="font-size:9px;color:#5A67D8;letter-spacing:.1em;font-weight:700;margin-bottom:8px;text-transform:uppercase">Type inference em ação</div>
    <div style="font-size:10.5px;color:#94a3b8;line-height:2">
      <span style="color:#475569">const</span> posts = <span style="color:#5A67D8">await</span> prisma.post.findMany({<br>
      &nbsp;where: { status: <span style="color:#4ade80">'PUBLISHED'</span> },<br>
      &nbsp;<span style="color:#a78bfa">select</span>: { id: <span style="color:#4ade80">true</span>, title: <span style="color:#4ade80">true</span>, author: { select: { name: <span style="color:#4ade80">true</span> } } },<br>
      &nbsp;orderBy: { createdAt: <span style="color:#4ade80">'desc'</span> }, take: <span style="color:#fbbf24">10</span><br>
      })<br>
      <span style="color:#475569">// posts: { id: string; title: string; author: { name: string } }[]</span><br>
      <span style="color:#475569">// ↑ tipo inferido automaticamente — sem any, sem cast</span>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid #1e3a5f">
    <div style="font-size:9px;color:#5A67D8;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">select vs include — escolha consciente</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div style="font-size:10px;color:#94a3b8;line-height:1.7">
        <strong style="color:#a78bfa">select</strong> = whitelist de campos<br>
        Tipo retornado contém só o que pediu. Reduz payload de rede e memória.
      </div>
      <div style="font-size:10px;color:#94a3b8;line-height:1.7">
        <strong style="color:#a78bfa">include</strong> = todos os campos + relações<br>
        Adiciona relações sem omitir nada. Mais simples, mais pesado.
      </div>
    </div>
    <p style="font-size:10px;color:#475569;margin:8px 0 0;line-height:1.6"><strong style="color:#94a3b8">Não dá para usar os dois na mesma query</strong> — Prisma rejeita. Para combinar, use select aninhado em select.</p>
  </div>
</div>`,
        caption: "A API do Prisma Client é fluente e totalmente type-safe. select estreita o tipo retornado, include adiciona relações. orderBy aceita array para ordenação multi-coluna. Para listas grandes, sempre prefira cursor-based pagination sobre offset (take/skip).",
      },
      {
        title: "Prisma vs TypeORM vs Drizzle — tradeoffs visuais",
        html: `<style>
.prsm-cmp-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.prsm-cmp-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.prsm-cmp-tip:hover .prsm-cmp-tb{display:block}
.prsm-cmp-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:240px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.prsm-cmp-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.prsm-cmp-cell{padding:9px 10px;font-size:10px;border-bottom:1px solid #1e293b;line-height:1.5}
.prsm-cmp-good{color:#4ade80}
.prsm-cmp-mid{color:#fbbf24}
.prsm-cmp-bad{color:#ef4444}
.prsm-cmp-head{background:#1e293b;padding:11px 10px;font-size:10px;font-weight:700;letter-spacing:.06em;text-align:center;border-bottom:1.5px solid #334155}
</style>
<div class="prsm-cmp-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Prisma vs TypeORM vs Drizzle — tradeoffs práticos</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">3 ORMs maduros do ecossistema TypeScript em 2025</p>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;overflow:hidden">
    <div style="display:grid;grid-template-columns:1.1fr 1fr 1fr 1fr">
      <div class="prsm-cmp-head" style="text-align:left;color:#94a3b8">Critério</div>
      <div class="prsm-cmp-head" style="color:#5A67D8">Prisma</div>
      <div class="prsm-cmp-head" style="color:#FE0902">TypeORM</div>
      <div class="prsm-cmp-head" style="color:#C5F74F">Drizzle</div>
      <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600"><span class="prsm-cmp-tip">DX / autocomplete<span class="prsm-cmp-tb">Qualidade da experiência de desenvolvedor: autocomplete dos campos, mensagens de erro do compilador, IntelliSense aninhado.</span></span></div>
      <div class="prsm-cmp-cell prsm-cmp-good">Excelente — tipos profundos</div>
      <div class="prsm-cmp-cell prsm-cmp-mid">Bom com decorators</div>
      <div class="prsm-cmp-cell prsm-cmp-good">Excelente — SQL-shaped</div>
      <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600">Schema</div>
      <div class="prsm-cmp-cell prsm-cmp-good">DSL própria (.prisma)</div>
      <div class="prsm-cmp-cell prsm-cmp-mid">Decorators TypeScript</div>
      <div class="prsm-cmp-cell prsm-cmp-good">TypeScript puro</div>
      <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600">Migrations</div>
      <div class="prsm-cmp-cell prsm-cmp-good">prisma migrate (diff auto)</div>
      <div class="prsm-cmp-cell prsm-cmp-mid">CLI manual + sync (perigoso)</div>
      <div class="prsm-cmp-cell prsm-cmp-mid">drizzle-kit (mais novo)</div>
      <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600"><span class="prsm-cmp-tip">Performance<span class="prsm-cmp-tb">Tempo de query end-to-end e memória do client gerado. Drizzle e raw SQL são mais rápidos por terem menos camadas.</span></span></div>
      <div class="prsm-cmp-cell prsm-cmp-mid">Boa, query engine em Rust</div>
      <div class="prsm-cmp-cell prsm-cmp-mid">Boa</div>
      <div class="prsm-cmp-cell prsm-cmp-good">Excelente — quase raw SQL</div>
      <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600"><span class="prsm-cmp-tip">Edge runtime<span class="prsm-cmp-tb">Cloudflare Workers, Vercel Edge — runtime sem TCP nativo. Drizzle suporta nativo via HTTP drivers; Prisma exige Accelerate; TypeORM não suporta.</span></span></div>
      <div class="prsm-cmp-cell prsm-cmp-mid">Só com Accelerate</div>
      <div class="prsm-cmp-cell prsm-cmp-bad">Não suporta</div>
      <div class="prsm-cmp-cell prsm-cmp-good">Nativo (HTTP drivers)</div>
      <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600">Raw SQL escape hatch</div>
      <div class="prsm-cmp-cell prsm-cmp-mid">$queryRaw / $executeRaw</div>
      <div class="prsm-cmp-cell prsm-cmp-good">QueryBuilder + raw fácil</div>
      <div class="prsm-cmp-cell prsm-cmp-good">SQL é cidadão de 1ª classe</div>
      <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600">MongoDB</div>
      <div class="prsm-cmp-cell prsm-cmp-mid">Suporte limitado</div>
      <div class="prsm-cmp-cell prsm-cmp-good">Suporta</div>
      <div class="prsm-cmp-cell prsm-cmp-bad">Apenas SQL</div>
      <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600">Maturidade ecossistema</div>
      <div class="prsm-cmp-cell prsm-cmp-good">Padrão de mercado 2024-25</div>
      <div class="prsm-cmp-cell prsm-cmp-good">Maduro mas legado</div>
      <div class="prsm-cmp-cell prsm-cmp-mid">Crescendo rápido</div>
      <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600">Tamanho do bundle</div>
      <div class="prsm-cmp-cell prsm-cmp-bad">Pesado (~5MB query engine)</div>
      <div class="prsm-cmp-cell prsm-cmp-mid">Médio</div>
      <div class="prsm-cmp-cell prsm-cmp-good">Leve (sem engine)</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:14px">
    <div style="background:#1e293b;border-radius:8px;padding:11px 13px;border:1px solid rgba(90,103,216,.3)">
      <div style="font-size:10px;color:#5A67D8;font-weight:700;margin-bottom:5px">Use Prisma se</div>
      <div style="font-size:9.5px;color:#94a3b8;line-height:1.6">Projeto novo, time TS-first, DX é prioridade, migrations declarativas, equipe não quer SQL bruto.</div>
    </div>
    <div style="background:#1e293b;border-radius:8px;padding:11px 13px;border:1px solid rgba(254,9,2,.3)">
      <div style="font-size:10px;color:#FE0902;font-weight:700;margin-bottom:5px">Use TypeORM se</div>
      <div style="font-size:9.5px;color:#94a3b8;line-height:1.6">Projeto NestJS legado, ActiveRecord pattern, MongoDB em mesmo ORM, equipe vinda de Java/Hibernate.</div>
    </div>
    <div style="background:#1e293b;border-radius:8px;padding:11px 13px;border:1px solid rgba(197,247,79,.3)">
      <div style="font-size:10px;color:#C5F74F;font-weight:700;margin-bottom:5px">Use Drizzle se</div>
      <div style="font-size:9.5px;color:#94a3b8;line-height:1.6">Edge runtime (Cloudflare/Vercel), performance crítica, time confortável com SQL, bundle pequeno importa.</div>
    </div>
  </div>
</div>`,
        caption: "Prisma é o padrão para novos projetos Node/TS em 2024-2025. Drizzle vem ganhando espaço em edge e em equipes que preferem SQL-first. TypeORM ainda relevante em projetos NestJS antigos. Para edge runtime, Drizzle nativo ou Prisma com Accelerate.",
      },
    ],
    keypoints: [
      {
        title: "Prisma Schema — DSL declarativa, fonte da verdade",
        body: "schema.prisma é o arquivo central. Tem três blocos principais: datasource (conexão ao banco — provider postgresql/mysql/sqlite/mongodb e url do DATABASE_URL), generator (qual cliente gerar — geralmente prisma-client-js), e models (tabelas/coleções). Tipos nativos: String, Int, BigInt, Float, Decimal, Boolean, DateTime, Json, Bytes, e enums. Modificadores de campo: ? para opcional (nullable), [] para array. Atributos com @ (campo) ou @@ (model): @id, @unique, @default, @relation, @@index, @@unique, @@map.",
        code: `// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?  // opcional (nullable)
  role      Role     @default(USER)
  posts     Post[]   // 1:N — relação inversa
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([email])
  @@map("users") // mapeia para tabela "users" no SQL
}

model Post {
  id       String  @id @default(cuid())
  title    String  @db.VarChar(255) // tipo SQL específico
  content  String? @db.Text
  status   PostStatus @default(DRAFT)
  authorId String
  author   User    @relation(fields: [authorId], references: [id], onDelete: Cascade)
  tags     Tag[]   // N:N — Prisma cria join table implícita
  metadata Json?
  @@index([authorId, status])
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}

enum Role { ADMIN  USER  GUEST }
enum PostStatus { DRAFT  PUBLISHED  ARCHIVED }`,
      },
      {
        title: "Prisma Client — type inference end-to-end",
        body: "Após prisma generate, o Client gerado expõe um método para cada model: prisma.user, prisma.post. Cada um tem CRUD: findUnique (por chave única, retorna T|null), findFirst (por filtro flexível, retorna T|null), findMany (array), create, createMany, update, updateMany, upsert, delete, deleteMany, count, aggregate, groupBy. O ponto-chave: o tipo retornado se ajusta dinamicamente baseado em select/include — TypeScript infere automaticamente.",
        code: `import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Tipo inferido: User
const user = await prisma.user.findUnique({ where: { id: 'x' } })
//    ^? User | null

// Tipo inferido: { id: string; email: string }[]
const users = await prisma.user.findMany({
  where: { role: 'ADMIN' },
  select: { id: true, email: true },
})

// Tipo inferido com relação aninhada
const userWithPosts = await prisma.user.findUnique({
  where: { id: 'x' },
  include: { posts: { where: { status: 'PUBLISHED' } } },
})
//    ^? (User & { posts: Post[] }) | null

// Type helpers oficiais — extrair tipo de uma query
import { Prisma } from '@prisma/client'
type UserWithPosts = Prisma.UserGetPayload<{
  include: { posts: true }
}>`,
      },
      {
        title: "Relations — 1:1, 1:N e N:N",
        body: "Prisma modela 3 tipos de relação. <strong>1:1</strong>: uma User tem um Profile, define-se com @relation e @unique no campo de FK. <strong>1:N</strong>: um User tem muitos Post — apenas o lado 'many' tem authorId; o lado 'one' tem array virtual. <strong>N:N</strong>: implícita (Prisma cria join table automaticamente — sem controle sobre colunas extras) ou explícita (você cria o model PostTag manualmente — necessário se quiser metadados como assignedAt). Sempre defina onDelete (Cascade, SetNull, Restrict, NoAction) para evitar comportamento inesperado.",
        code: `// 1:1 — User tem 1 Profile
model User {
  id      String   @id
  profile Profile?
}
model Profile {
  id     String @id
  bio    String
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// 1:N — User tem muitos Post
model User {
  posts Post[]
}
model Post {
  authorId String
  author   User @relation(fields: [authorId], references: [id])
}

// N:N implícita — Prisma cria _PostToTag automaticamente
model Post { tags Tag[] }
model Tag  { posts Post[] }

// N:N explícita — quando precisa de campos extras
model PostTag {
  postId    String
  tagId     String
  assignedAt DateTime @default(now())
  assignedBy String
  post      Post @relation(fields: [postId], references: [id])
  tag       Tag  @relation(fields: [tagId], references: [id])
  @@id([postId, tagId])
}`,
      },
      {
        title: "Migrations — diff declarativo e versionado",
        body: "Prisma Migrate gera SQL automaticamente comparando o schema atual com a última migration aplicada. <code>prisma migrate dev --name add_user_email</code> em desenvolvimento: gera <code>prisma/migrations/&lt;timestamp&gt;_add_user_email/migration.sql</code>, aplica no banco e regenera o Client. <code>prisma migrate deploy</code> em CI/CD: aplica migrations já versionadas em ordem, sem gerar novas — idempotente, seguro de rodar várias vezes. <code>prisma db push</code> sincroniza schema → banco SEM gerar migration (só para protótipos, NUNCA produção). Migrations já aplicadas são imutáveis — para alterar, crie uma nova migration que ajuste.",
        code: `# Workflow de desenvolvimento
$ npx prisma migrate dev --name add_post_status
# 1. Gera prisma/migrations/20250430123000_add_post_status/migration.sql
# 2. Aplica no banco de dev
# 3. Regenera @prisma/client com novos tipos

# Workflow de produção (CI/CD)
$ npx prisma migrate deploy
# Aplica todas as migrations pendentes em ordem
# NÃO gera novas — só aplica as versionadas

# Reset (apaga dados — só dev)
$ npx prisma migrate reset

# Status
$ npx prisma migrate status
# Mostra quais migrations estão aplicadas e quais pendentes

# Para refletir banco existente em schema (greenfield em DB legado)
$ npx prisma db pull   # introspect → atualiza schema.prisma`,
      },
      {
        title: "Transactions — sequencial, batch e interactive",
        body: "Prisma oferece 3 modos. <strong>Sequential ($transaction([])):</strong> array de operações executado atomicamente em ordem — todas commitam juntas ou todas revertem. Bom para múltiplos creates/updates independentes. <strong>Interactive ($transaction(async tx => {})):</strong> recebe callback com client transacional — você pode ler, decidir e escrever com lógica entre as operações. Use isolationLevel para Serializable/RepeatableRead. <strong>Atenção</strong>: timeout default é 5s (maxWait) + 5s (timeout); para transações longas configure <code>{ timeout: 30000 }</code>. Long-running transactions seguram conexão do pool — limite quando possível.",
        code: `// 1. Sequential — array atômico
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'a@b.com' } }),
  prisma.post.create({ data: { title: 'Hello', authorId: 'x' } }),
])

// 2. Interactive — lógica entre operações
const result = await prisma.$transaction(async (tx) => {
  const sender = await tx.account.findUniqueOrThrow({ where: { id: senderId } })
  if (sender.balance < amount) throw new Error('Saldo insuficiente')

  await tx.account.update({
    where: { id: senderId },
    data: { balance: { decrement: amount } },
  })
  await tx.account.update({
    where: { id: receiverId },
    data: { balance: { increment: amount } },
  })
  return tx.transfer.create({
    data: { senderId, receiverId, amount },
  })
}, {
  isolationLevel: 'Serializable',
  timeout: 10000,  // 10s
})

// 3. Cuidado: NUNCA chame prisma (não tx) dentro do callback
//    Use sempre o "tx" recebido — caso contrário a operação roda fora da transação`,
      },
      {
        title: "Raw queries — $queryRaw e $executeRaw com Prisma.sql",
        body: "Para queries complexas (CTE, window functions, full-text search avançado, agregações específicas do banco) use raw queries. <code>$queryRaw</code> retorna linhas, <code>$executeRaw</code> retorna count de linhas afetadas. <strong>Sempre</strong> use template literals com <code>Prisma.sql</code> — interpolação direta com <code>$\\{var\\}</code> em string permite SQL injection. As variantes Unsafe (<code>$queryRawUnsafe</code>) só para casos onde o SQL é construído programaticamente — e mesmo assim valide tudo.",
        code: `import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ✓ SEGURO — Prisma.sql faz parametrização automática
const search = "robert'); DROP TABLE--"  // tentativa de injection
const users = await prisma.$queryRaw<User[]>\`
  SELECT * FROM "User" WHERE name ILIKE \${\`%\${search}%\`}
\`
// Vira: SELECT * FROM "User" WHERE name ILIKE $1, com $1 = '%...%'

// ✓ Tipagem via generic — você declara o shape esperado
type Stats = { day: Date; count: bigint }
const stats = await prisma.$queryRaw<Stats[]>\`
  SELECT DATE_TRUNC('day', "createdAt") AS day, COUNT(*) AS count
  FROM "Post"
  WHERE "createdAt" > NOW() - INTERVAL '30 days'
  GROUP BY day
  ORDER BY day DESC
\`

// ✓ Composição com Prisma.sql
const where = filterByStatus
  ? Prisma.sql\`WHERE status = \${'PUBLISHED'}\`
  : Prisma.empty
const result = await prisma.$queryRaw\`SELECT * FROM "Post" \${where}\`

// ✗ PERIGOSO — interpolação direta = SQL injection
// const bad = await prisma.$queryRawUnsafe(\`SELECT * FROM User WHERE id = '\${userId}'\`)`,
      },
      {
        title: "Prisma Client Extensions — middleware moderno",
        body: "<code>$use</code> middleware está deprecated. Use <strong>Prisma Client Extensions</strong> ($extends) para soft delete, logging, multi-tenancy, row-level security, métricas. Extensions são compostáveis — você pode encadear várias com $extends. 4 tipos: <strong>model</strong> (adiciona métodos a modelos), <strong>client</strong> (métodos no client raiz), <strong>query</strong> (intercepta queries para modificar args/result), <strong>result</strong> (campos virtuais computados).",
        code: `import { PrismaClient } from '@prisma/client'

const basePrisma = new PrismaClient()

// 1. Soft delete via query extension — filtra deletedAt automaticamente
const prisma = basePrisma.$extends({
  query: {
    user: {
      async findMany({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },
      async findUnique({ args, query }) {
        const result = await query(args)
        if (result?.deletedAt) return null
        return result
      },
    },
  },
  // 2. Método customizado no model
  model: {
    user: {
      async softDelete(id: string) {
        return basePrisma.user.update({
          where: { id },
          data: { deletedAt: new Date() },
        })
      },
    },
  },
  // 3. Campo computado (result extension)
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute: (user) => \`\${user.firstName} \${user.lastName}\`,
      },
    },
  },
})

// Uso — soft delete e fullName aparecem como nativos
await prisma.user.softDelete('xyz')
const user = await prisma.user.findUnique({ where: { id: 'x' } })
console.log(user?.fullName)  // computado — tipado!`,
      },
      {
        title: "Cursor-based pagination — para listas grandes",
        body: "Offset pagination (skip/take) tem performance ruim em listas grandes — o banco precisa varrer todos os registros até o offset. Cursor-based é O(1): você passa o id do último item visto e pede os próximos N. Ideal para feeds infinitos. Combine cursor com orderBy estável (geralmente createdAt + id) para garantir ordem determinística.",
        code: `// Cursor pagination — performante em listas grandes
async function getPosts(cursor?: string, take = 20) {
  return prisma.post.findMany({
    take,
    skip: cursor ? 1 : 0,           // pula o próprio cursor
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: [
      { createdAt: 'desc' },
      { id: 'desc' },                // tiebreaker para ordem determinística
    ],
    where: { status: 'PUBLISHED' },
  })
}

// Cliente:
const page1 = await getPosts()
const lastId = page1[page1.length - 1]?.id
const page2 = await getPosts(lastId)

// Offset pagination — só para listas pequenas / admin
async function getPostsByPage(page: number, perPage = 20) {
  return prisma.post.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: 'desc' },
  })
  // CUIDADO: skip: 100000 faz full scan até a posição 100k no banco
}`,
      },
      {
        title: "Upsert atômico — INSERT ou UPDATE em uma operação",
        body: "<code>upsert</code> faz INSERT se não existe, UPDATE se já existe — em uma única query atômica baseada em chave única. Evita race condition de findUnique → if/else → create/update. Os dois blocos (create e update) podem conter dados diferentes — útil em casos como 'criar usuário ou atualizar last login'.",
        code: `// Upsert clássico — chave única determina branch
const user = await prisma.user.upsert({
  where: { email: 'ana@example.com' },         // chave de busca
  create: {                                      // se não existe
    email: 'ana@example.com',
    name: 'Ana',
    role: 'USER',
  },
  update: {                                      // se existe
    lastLoginAt: new Date(),
  },
})

// createMany com skipDuplicates — bulk upsert simplificado
await prisma.tag.createMany({
  data: [
    { name: 'typescript' },
    { name: 'prisma' },
    { name: 'graphql' },
  ],
  skipDuplicates: true, // não falha em conflict de @unique
})

// Bulk upsert real (sem skipDuplicates) — exige loop ou raw
for (const tag of tags) {
  await prisma.tag.upsert({
    where: { name: tag.name },
    create: { name: tag.name },
    update: {},  // no-op
  })
}`,
      },
      {
        title: "Singleton pattern em Next.js — evitar exhaustion de conexões",
        body: "Em desenvolvimento, hot reload do Next.js cria múltiplas instâncias de PrismaClient — cada uma abre um pool de conexões e em poucos minutos esgota o limite do banco (Postgres tipicamente 100). A solução é o singleton pattern: armazenar a instância em <code>globalThis</code> em dev. Em produção (build), Next.js cria uma única instância naturalmente.",
        code: `// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// app/api/users/route.ts — sempre importe o singleton
import { prisma } from '@/lib/prisma'

export async function GET() {
  const users = await prisma.user.findMany()
  return Response.json(users)
}

// Em scripts CLI (não Next.js) — sempre $disconnect ao final
async function main() {
  // ... operações
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())`,
      },
      {
        title: "Edge runtime — Prisma Accelerate é obrigatório",
        body: "Prisma Client tradicional usa TCP nativo (pg, mysql2) — não roda em edge runtimes (Cloudflare Workers, Vercel Edge). Para edge, use <strong>Prisma Accelerate</strong>: um proxy HTTP gerenciado pela Prisma que aceita queries via HTTP, conecta no banco via TCP, e devolve resultados. Bônus: connection pooling global (resolve cold start) e cache de queries com TTL configurável. Custa por query/cache — para apps high-traffic considerar custos.",
        code: `// schema.prisma — adiciona driverAdapters
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

// Em edge route handler (Vercel Edge / Cloudflare)
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export const runtime = 'edge'

export async function GET() {
  // Cache de 60s — distribuído globalmente
  const posts = await prisma.post.findMany({
    cacheStrategy: { ttl: 60, swr: 30 },
  })
  return Response.json(posts)
}

// .env — DATABASE_URL agora aponta para Accelerate
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
DIRECT_URL="postgresql://user:pass@host:5432/db"  // para migrate`,
      },
      {
        title: "Indexes e performance — @@index, @@unique e EXPLAIN",
        body: "Prisma não cria índices automaticamente além de chaves primárias e @unique. Para campos de filtro frequente, declare <code>@@index([field1, field2])</code>. Ordem importa — composto cobre prefixos: índice em [authorId, status] cobre WHERE authorId = X e WHERE authorId = X AND status = Y, mas NÃO WHERE status = Y. Para queries específicas, rode EXPLAIN ANALYZE no Postgres ou EXPLAIN no MySQL para verificar se o índice foi usado.",
        code: `model Post {
  id        String     @id @default(cuid())
  title     String
  authorId  String
  status    PostStatus
  createdAt DateTime   @default(now())
  views     Int        @default(0)

  // Índice composto — ordem importa para query patterns
  @@index([authorId, status])         // cobre filtro por author + status
  @@index([status, createdAt(sort: Desc)]) // listagem por status ordenada
  @@index([title])                     // busca por título
}

// Verificar uso do índice no Postgres
const result = await prisma.$queryRaw\`
  EXPLAIN ANALYZE
  SELECT * FROM "Post" WHERE "authorId" = 'x' AND status = 'PUBLISHED'
\`
// Procure por "Index Scan" — se aparecer "Seq Scan" o índice não foi usado

// Full-text search — Postgres only
model Post {
  // ...
  @@fulltext([title, content])  // requer previewFeatures = ["fullTextIndex"]
}

await prisma.post.findMany({
  where: { title: { search: 'prisma & typescript' } },
})`,
      },
      {
        title: "JSON fields — query e tipagem",
        body: "Campos Json armazenam JSON nativo (Postgres jsonb, MySQL JSON). Prisma oferece operadores específicos para queries no JSON. Tipagem: por padrão Json é unknown — para tipar, use casting com Prisma.JsonObject ou tipos próprios; para safety completa, valide com Zod ou similar antes de usar.",
        code: `model Event {
  id       String @id @default(cuid())
  type     String
  metadata Json   // Postgres jsonb
}

// Insert com tipo
await prisma.event.create({
  data: {
    type: 'click',
    metadata: { url: '/home', userId: 'x', source: 'header' },
  },
})

// Query operators no JSON (Postgres)
await prisma.event.findMany({
  where: {
    metadata: {
      path: ['userId'],
      equals: 'x',
    },
  },
})

// path nested
await prisma.event.findMany({
  where: {
    metadata: {
      path: ['device', 'os'],
      string_contains: 'iOS',
    },
  },
})

// Tipagem segura com Zod
import { z } from 'zod'
const EventMetadata = z.object({
  url: z.string(),
  userId: z.string(),
  source: z.enum(['header', 'footer', 'modal']),
})

const event = await prisma.event.findUniqueOrThrow({ where: { id } })
const metadata = EventMetadata.parse(event.metadata)
//    ^? { url: string; userId: string; source: 'header' | 'footer' | 'modal' }`,
      },
    ],
    cheatsheet: {
      title: "Prisma — Cheat Sheet schema + client + migrations",
      html: `<style>
.prsm-cs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px}
.prsm-cs-card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px}
.prsm-cs-head{font-size:9px;color:#64748b;letter-spacing:.14em;text-transform:uppercase;margin:14px 0 8px;padding-bottom:5px;border-bottom:1px solid #1e3a5f}
.prsm-cs-kw{color:#5A67D8}
.prsm-cs-attr{color:#a78bfa}
.prsm-cs-type{color:#4ade80}
.prsm-cs-cm{color:#475569}
.prsm-cs-label{font-size:10px;font-weight:700;margin-bottom:5px}
.prsm-cs-body{font-size:9.5px;color:#64748b;line-height:1.55}
.prsm-cs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
</style>
<div class="prsm-cs-wrap">
  <p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 14px;letter-spacing:.06em">PRISMA — CHEAT SHEET</p>
  <div class="prsm-cs-head">SCHEMA.PRISMA — DSL</div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px;font-size:10px;line-height:1.95;color:#94a3b8;margin-bottom:8px">
    <span class="prsm-cs-kw">model</span> User {<br>
    &nbsp;&nbsp;id&nbsp;&nbsp;&nbsp;&nbsp;<span class="prsm-cs-type">String</span>&nbsp;&nbsp;<span class="prsm-cs-attr">@id @default(cuid())</span><br>
    &nbsp;&nbsp;email&nbsp;<span class="prsm-cs-type">String</span>&nbsp;&nbsp;<span class="prsm-cs-attr">@unique</span><br>
    &nbsp;&nbsp;name&nbsp;&nbsp;<span class="prsm-cs-type">String?</span>&nbsp;<span class="prsm-cs-cm">// opcional</span><br>
    &nbsp;&nbsp;posts&nbsp;<span class="prsm-cs-type">Post[]</span>&nbsp;<span class="prsm-cs-cm">// 1:N</span><br>
    &nbsp;&nbsp;createdAt <span class="prsm-cs-type">DateTime</span> <span class="prsm-cs-attr">@default(now())</span><br>
    &nbsp;&nbsp;updatedAt <span class="prsm-cs-type">DateTime</span> <span class="prsm-cs-attr">@updatedAt</span><br>
    &nbsp;&nbsp;<span class="prsm-cs-attr">@@index([email])</span><br>
    }
  </div>
  <div class="prsm-cs-head">TIPOS DE CAMPO</div>
  <div class="prsm-cs-grid" style="margin-bottom:8px">
    <div class="prsm-cs-card">
      <div class="prsm-cs-label" style="color:#4ade80">Escalares</div>
      <div class="prsm-cs-body">String &middot; Int &middot; BigInt &middot; Float &middot; Decimal &middot; Boolean &middot; DateTime &middot; Json &middot; Bytes</div>
    </div>
    <div class="prsm-cs-card">
      <div class="prsm-cs-label" style="color:#a78bfa">Modificadores</div>
      <div class="prsm-cs-body">? = nullable<br>[] = array<br>@db.VarChar(255), @db.Text — tipo SQL</div>
    </div>
    <div class="prsm-cs-card">
      <div class="prsm-cs-label" style="color:#5A67D8">Atributos &#64;</div>
      <div class="prsm-cs-body">@id @unique @default<br>@relation @updatedAt @map</div>
    </div>
    <div class="prsm-cs-card">
      <div class="prsm-cs-label" style="color:#fbbf24">Atributos &#64;&#64;</div>
      <div class="prsm-cs-body">@@id @@unique @@index<br>@@map @@fulltext</div>
    </div>
  </div>
  <div class="prsm-cs-head">CLIENT — OPERAÇÕES CRUD</div>
  <div class="prsm-cs-grid" style="margin-bottom:8px">
    <div class="prsm-cs-card">
      <div class="prsm-cs-label" style="color:#4ade80">Read</div>
      <div style="font-size:9.5px;color:#94a3b8;line-height:1.7">findUnique({ where })<br>findFirst({ where })<br>findMany({ where, select, include, orderBy, take, skip, cursor })</div>
    </div>
    <div class="prsm-cs-card">
      <div class="prsm-cs-label" style="color:#5A67D8">Write</div>
      <div style="font-size:9.5px;color:#94a3b8;line-height:1.7">create({ data })<br>createMany({ data, skipDuplicates })<br>update({ where, data })<br>upsert({ where, create, update })</div>
    </div>
    <div class="prsm-cs-card">
      <div class="prsm-cs-label" style="color:#ef4444">Delete</div>
      <div style="font-size:9.5px;color:#94a3b8;line-height:1.7">delete({ where })<br>deleteMany({ where })</div>
    </div>
    <div class="prsm-cs-card">
      <div class="prsm-cs-label" style="color:#fbbf24">Aggregate</div>
      <div style="font-size:9.5px;color:#94a3b8;line-height:1.7">count({ where })<br>aggregate({ _avg, _sum, _max })<br>groupBy({ by, having })</div>
    </div>
  </div>
  <div class="prsm-cs-head">CLI — COMANDOS ESSENCIAIS</div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px;font-size:10px;line-height:1.85;color:#94a3b8;margin-bottom:8px">
    <span class="prsm-cs-cm"># Setup</span><br>
    npx prisma init<br>
    npx prisma generate <span class="prsm-cs-cm">// gera @prisma/client</span><br>
    <span class="prsm-cs-cm"># Migrations</span><br>
    npx prisma migrate dev --name &lt;name&gt; <span class="prsm-cs-cm">// dev: gera + aplica</span><br>
    npx prisma migrate deploy <span class="prsm-cs-cm">// prod/CI</span><br>
    npx prisma migrate reset <span class="prsm-cs-cm">// limpa banco (dev)</span><br>
    <span class="prsm-cs-cm"># Outros</span><br>
    npx prisma studio <span class="prsm-cs-cm">// GUI no browser</span><br>
    npx prisma db pull <span class="prsm-cs-cm">// introspect → schema.prisma</span><br>
    npx prisma db push <span class="prsm-cs-cm">// sync sem migration (NUNCA prod)</span>
  </div>
  <div class="prsm-cs-head">TRANSACTIONS &amp; RAW</div>
  <div class="prsm-cs-grid">
    <div class="prsm-cs-card">
      <div class="prsm-cs-label" style="color:#5A67D8">$transaction</div>
      <div style="font-size:9.5px;color:#94a3b8;line-height:1.65">Sequential: <code>$transaction([op1, op2])</code><br>Interactive: <code>$transaction(async tx =&gt; {})</code><br>Opções: <code>{ isolationLevel, timeout }</code></div>
    </div>
    <div class="prsm-cs-card">
      <div class="prsm-cs-label" style="color:#ef4444">Raw SQL</div>
      <div style="font-size:9.5px;color:#94a3b8;line-height:1.65"><code>$queryRaw\`...\${var}\`</code> — parametrizado<br><code>$executeRaw\`UPDATE...\`</code> — count<br>NUNCA <code>Unsafe</code> com input do user</div>
    </div>
  </div>
</div>`,
    },
    gotchas: [
      "<strong>db push em produção</strong> — pula histórico de migrations e impede rollback controlado. Use APENAS em prototipação. Em CI/CD sempre prisma migrate deploy com migrations versionadas.",
      "<strong>SELECT * implícito sem select/include explícito</strong> — findMany sem select carrega TODAS as colunas, incluindo Json e Text grandes. Em listas, especifique apenas os campos necessários para reduzir payload e tempo de query.",
      "<strong>N+1 com include profundamente aninhado</strong> — { posts: { include: { comments: { include: { author: true } } } } } pode gerar JOINs gigantes ou múltiplas queries. Teste com EXPLAIN; quando o include vai ficar repetido em várias queries, considere DataLoader na camada GraphQL.",
      "<strong>$disconnect() faltando em scripts CLI</strong> — sem disconnect, o processo Node não termina (conexões pendentes seguram event loop). Em servidores web (Next.js, Express) NÃO chame disconnect a cada request — só em scripts one-shot.",
      "<strong>Migrations editadas após aplicadas</strong> — Prisma marca migrations já aplicadas no banco (<code>_prisma_migrations</code>). Editar uma já aplicada quebra a integridade. Para corrigir: crie uma NOVA migration que ajuste; só faça <code>migrate resolve</code> em casos extremos.",
      "<strong>$queryRawUnsafe com input do usuário</strong> — interpolação de string permite SQL injection. Sempre use $queryRaw com template literal e <code>Prisma.sql</code> para composição condicional. Unsafe só para SQL gerado programaticamente sem input externo.",
      "<strong>Hot reload em Next.js sem singleton</strong> — cada hot reload cria nova PrismaClient → pool de conexões esgota em minutos. Use o pattern <code>globalThis.prisma ??= new PrismaClient()</code> em dev.",
      "<strong>Edge runtime sem Accelerate</strong> — Prisma Client padrão usa TCP nativo, não suportado em Cloudflare Workers / Vercel Edge. Importe de @prisma/client/edge + Accelerate, ou use Drizzle nativamente em edge.",
      "<strong>$transaction interativa com prisma global</strong> — chamar <code>prisma.user.update</code> (não <code>tx.user.update</code>) dentro do callback executa fora da transação. Sempre use o tx recebido.",
      "<strong>BigInt em JSON.stringify</strong> — Prisma retorna BigInt nativo, JSON.stringify lança erro. Em API responses, converta para string ou number antes de serializar.",
      "<strong>JSON typing como unknown</strong> — campos Json têm tipo Prisma.JsonValue (unknown-ish) — sem validação ao ler. Use Zod para validar ao consumir, ou cast tipado com cuidado.",
      "<strong>orderBy sem tiebreaker estável</strong> — orderBy: { createdAt: 'desc' } sem incluir id como segundo critério causa ordem indefinida quando dois registros têm o mesmo createdAt — quebra cursor pagination.",
    ],
    interview: [
      {
        q: "Quando você escolheria Prisma vs TypeORM vs Drizzle? Quais os tradeoffs?",
        level: "senior",
        a: "<p><strong>Prisma:</strong> projeto novo TypeScript-first, schema declarativo como fonte de verdade, type-safety end-to-end com inference profunda, migrations confiáveis com diff automático. Padrão de mercado em 2024-2025. Tradeoff: bundle pesado (~5MB query engine), edge runtime exige Accelerate, queries muito complexas caem em $queryRaw.</p><p><strong>TypeORM:</strong> projetos NestJS legados, ActiveRecord pattern, suporte MongoDB no mesmo ORM, equipe vinda de Java/Hibernate. Tradeoff: migrations manuais com sync perigoso em produção, decorators espalham metadata pelos models, comunidade migrando para Prisma.</p><p><strong>Drizzle:</strong> edge runtime nativo (Cloudflare/Vercel sem proxy), performance crítica, equipe confortável com SQL, bundle pequeno. Schema em TypeScript puro (sem DSL). Tradeoff: migrations e ecossistema mais novos, sem MongoDB.</p>",
        tip: "Mencionar Accelerate para edge é o que diferencia sênior. Se a entrevista é para vaga edge/serverless, conheça os 3.",
      },
      {
        q: "Como funciona o $transaction interativo? Quais cuidados em produção?",
        level: "senior",
        a: "<p><code>prisma.$transaction(async (tx) => {})</code> recebe um callback com um client transacional <code>tx</code>. Tudo feito com <code>tx</code> roda na mesma transação atômica — todas as ops commitam juntas ou todas revertem.</p><p><strong>Cuidados:</strong></p><ol><li><strong>Use sempre o tx</strong> recebido — chamar <code>prisma.user.update</code> (global) dentro do callback executa FORA da transação.</li><li><strong>Timeout default é 5s</strong> — para transações longas configure <code>{ timeout: 30000 }</code>.</li><li><strong>maxWait</strong> — tempo que Prisma espera para começar a transação se o pool está saturado.</li><li><strong>isolationLevel</strong> — Serializable previne phantom reads e write skew, mas reduz throughput. RepeatableRead é meio termo.</li><li><strong>Não chame APIs externas dentro</strong> — request HTTP de 2s segura conexão e reduz throughput drasticamente.</li><li><strong>Evite long-running</strong> — transação aberta segura row locks, causa contenção e potencial deadlock.</li></ol>",
        tip: "Saber que o callback usa o tx local (não o prisma global) é o gotcha mais comum. Mencionar isolation levels mostra profundidade.",
      },
      {
        q: "Como evitar N+1 em queries Prisma? Quando include é insuficiente?",
        level: "senior",
        a: "<p><strong>1. include / select aninhado</strong> resolve a maioria dos casos: Prisma faz JOIN ou múltiplas queries otimizadas internamente. <code>posts.findMany({ include: { author: true, comments: true } })</code> roda 3 queries (posts, authors WHERE IN, comments WHERE IN) — não N+1.</p><p><strong>2. Quando include é insuficiente:</strong></p><ul><li>Em GraphQL onde resolvers de campos são chamados independentemente — use <strong>DataLoader</strong> na camada GraphQL.</li><li>Quando você precisa de filtro condicional na relação que não cabe em include.</li><li>Aninhamento muito profundo (4+ níveis) — JOIN gigante fica lento; quebre em queries separadas.</li></ul><p><strong>3. Diagnóstico:</strong> ative <code>log: ['query']</code> e conte queries por request. Use EXPLAIN no SQL gerado para ver se índices foram usados.</p><p><strong>4. Prisma 5.x:</strong> introduziu <code>relationLoadStrategy: 'join'</code> para forçar JOIN único em vez de múltiplas queries — útil quando dados têm alta cardinalidade.</p>",
      },
      {
        q: "Explique como funciona o pipeline de migrations em Prisma. Diferença entre dev e deploy.",
        level: "pleno",
        a: "<p><strong>migrate dev</strong> — para desenvolvimento local. Faz 3 coisas: (1) compara schema.prisma com a última migration aplicada e gera SQL de diff em <code>prisma/migrations/&lt;timestamp&gt;_name/migration.sql</code>, (2) aplica no banco de dev, (3) regenera <code>@prisma/client</code> com novos tipos. Pode pedir reset se detectar drift.</p><p><strong>migrate deploy</strong> — para CI/CD e produção. Apenas aplica as migrations já versionadas em ordem cronológica. Não gera novas migrations, não regenera client (você roda <code>generate</code> no build), idempotente — rodar duas vezes não causa problema. Faz lock no banco para impedir aplicações simultâneas.</p><p><strong>Workflow correto:</strong> dev cria migration → revisa SQL gerado → commita → CI roda <code>migrate deploy</code> antes de deploy do app.</p><p><strong>db push</strong> sincroniza schema → banco SEM gerar migration. Só prototipação. Em produção é destrutivo: pula histórico, sem rollback controlado.</p>",
        tip: "Saber que migrations já aplicadas são imutáveis e que correções viram NOVAS migrations é o ponto que separa pleno de júnior.",
      },
      {
        q: "Como otimizar uma query Prisma que está lenta em produção?",
        level: "senior",
        a: "<p>Roteiro em ordem:</p><ol><li><strong>Reproduza com log:</strong> <code>new PrismaClient({ log: ['query'] })</code> e capture o SQL gerado.</li><li><strong>EXPLAIN ANALYZE no Postgres / EXPLAIN no MySQL:</strong> identifique se está fazendo Seq Scan (sem índice) ou Index Scan.</li><li><strong>Adicione @@index</strong> para os campos de filtro frequente. Composto cobre prefixos: <code>@@index([authorId, status])</code> cobre filtro por authorId sozinho ou authorId+status, mas NÃO status sozinho.</li><li><strong>Reduza payload com select/include explícito</strong> — não traga colunas Json e Text que não vai usar.</li><li><strong>Para listas grandes use cursor pagination</strong> — skip/take com offset alto faz o banco varrer N linhas até a posição.</li><li><strong>Evite include profundamente aninhado em listas</strong> — quebrar em queries separadas pode ser mais rápido que um JOIN gigante.</li><li><strong>Considere $queryRaw</strong> para queries com CTE, window functions ou agregações específicas do banco.</li><li><strong>Connection pooling:</strong> em serverless verifique se está usando PgBouncer ou Accelerate.</li></ol>",
      },
      {
        q: "Como rodar Prisma em edge runtime (Cloudflare Workers, Vercel Edge)?",
        level: "senior",
        a: "<p>O Prisma Client tradicional usa drivers TCP (pg, mysql2) que não funcionam em edge runtime — runtime sem suporte a TCP nativo. Duas estratégias:</p><p><strong>1. Prisma Accelerate (recomendado para Prisma):</strong></p><ul><li>Proxy HTTP gerenciado pela Prisma. Você importa de <code>@prisma/client/edge</code> e usa <code>$extends(withAccelerate())</code>.</li><li>O DATABASE_URL aponta para <code>prisma://accelerate.prisma-data.net/</code>; o DIRECT_URL (para migrations) aponta direto para o banco.</li><li>Ganhos: connection pooling global (resolve cold start), cache distribuído com TTL/SWR, suporte a edge.</li><li>Custos: por query, por miss de cache, e tier mensal.</li></ul><p><strong>2. Driver Adapters (preview):</strong> @prisma/adapter-neon, @prisma/adapter-planetscale — drivers HTTP nativos do banco. Mais barato que Accelerate mas amarra ao provider.</p><p><strong>Alternativa: Drizzle</strong> tem suporte edge nativo via http drivers, sem proxy intermediário — pode ser melhor escolha para apps edge-first.</p>",
        tip: "Mencionar que Accelerate é gerenciado e custa diferencia sênior. Saber que Drizzle é alternativa edge-nativa mostra horizonte.",
      },
      {
        q: "Como implementar soft delete em Prisma sem repetir filtros em todos os resolvers?",
        level: "senior",
        a: "<p><strong>Solução errada:</strong> adicionar <code>deletedAt: null</code> em cada findMany/findUnique — fácil esquecer e vazar dados deletados.</p><p><strong>Solução correta: Prisma Client Extension com query interception.</strong></p><pre><code>const prisma = basePrisma.$extends({\n  query: {\n    user: {\n      async findMany({ args, query }) {\n        args.where = { ...args.where, deletedAt: null }\n        return query(args)\n      },\n      async findUnique({ args, query }) {\n        const result = await query(args)\n        return result?.deletedAt ? null : result\n      },\n    },\n  },\n  model: {\n    user: {\n      async softDelete(id: string) {\n        return basePrisma.user.update({\n          where: { id }, data: { deletedAt: new Date() },\n        })\n      },\n    },\n  },\n})</code></pre><p>Isso garante que todas as queries de User filtram automaticamente — impossível esquecer. Para acesso de admin (ver deletados), use <code>basePrisma</code> diretamente.</p>",
      },
      {
        q: "Diferença entre upsert e createMany com skipDuplicates? Quando usar cada?",
        level: "pleno",
        a: "<p><strong>upsert</strong> (find + update OR create) — atômico para um registro. Você define lógica diferente em <code>create</code> e <code>update</code>:</p><pre><code>prisma.user.upsert({\n  where: { email: 'x' },\n  create: { email: 'x', name: 'Ana' },\n  update: { lastLoginAt: new Date() },\n})</code></pre><p>Use quando: precisa lógica diferenciada entre 'novo' e 'já existe' (ex: criar usuário ou atualizar last login).</p><p><strong>createMany com skipDuplicates</strong> — bulk insert ignorando conflitos de @unique. Não atualiza nada — só pula.</p><pre><code>prisma.tag.createMany({\n  data: [...tags],\n  skipDuplicates: true,\n})</code></pre><p>Use quando: bulk insert idempotente onde não interessa atualizar o existente (ex: seed de tags).</p><p><strong>Bulk upsert real</strong> não existe nativo — use loop de upsert ou raw SQL com ON CONFLICT (Postgres).</p>",
      },
      {
        q: "O que são Prisma Client Extensions? Quando usar?",
        level: "senior",
        a: "<p>Extensions ($extends) são a forma moderna e composável de estender o Prisma Client (substituem $use middleware deprecated). 4 tipos:</p><ol><li><strong>query:</strong> intercepta queries — modifica args antes de executar ou result depois. Casos: soft delete, multi-tenancy, row-level security, logging.</li><li><strong>model:</strong> adiciona métodos a um model. Caso: <code>prisma.user.softDelete(id)</code>, métodos de domínio que encapsulam lógica.</li><li><strong>client:</strong> adiciona métodos no client raiz. Caso: <code>prisma.$auditLog()</code>.</li><li><strong>result:</strong> adiciona campos virtuais computados. Caso: fullName que concatena firstName + lastName, sem ir no banco.</li></ol><p>São composáveis: encadeie vários $extends para adicionar features incrementais. Ao contrário de $use, extensions são tipadas — TypeScript reconhece os métodos adicionados.</p><p>Cuidado: query extensions interceptam apenas chamadas via Prisma Client — $queryRaw bypassa.</p>",
      },
      {
        q: "Como configurar Prisma em monorepo com múltiplos packages?",
        level: "senior",
        a: "<p><strong>Padrão recomendado:</strong> um package <code>packages/database</code> que contém schema.prisma, migrations e exporta o Prisma Client gerado.</p><pre><code>packages/database/\n  schema.prisma\n  migrations/\n  src/index.ts  // export { PrismaClient } from '@prisma/client'\n  package.json  // \"prisma generate\" no postinstall</code></pre><p><strong>Apps consumidores:</strong> <code>apps/web</code> e <code>apps/api</code> dependem do <code>@org/database</code> e importam o singleton já configurado.</p><p><strong>Cuidados:</strong></p><ul><li><strong>output customizado:</strong> <code>generator client { output = \"../node_modules/.prisma/client\" }</code> para que o gerado fique acessível por todos os packages do workspace.</li><li><strong>Singleton compartilhado:</strong> exporte uma única instância do Client com globalThis pattern para evitar múltiplos pools.</li><li><strong>postinstall:</strong> <code>\"postinstall\": \"prisma generate\"</code> no package.json garante que o Client é gerado após install em qualquer máquina/CI.</li><li><strong>Migrations só em um lugar:</strong> packages/database é o único que roda migrate deploy.</li></ul>",
      },
      {
        q: "Como debugar uma query Prisma lenta? Quais ferramentas?",
        level: "pleno",
        a: "<p><strong>1. Ative log de query:</strong></p><pre><code>new PrismaClient({\n  log: [\n    { level: 'query', emit: 'event' },\n    { level: 'warn', emit: 'event' },\n  ],\n})\nprisma.$on('query', (e) => {\n  if (e.duration > 100) console.log(e.query, e.params, e.duration + 'ms')\n})</code></pre><p><strong>2. Prisma Studio</strong> (<code>npx prisma studio</code>) — GUI para inspecionar dados.</p><p><strong>3. Database EXPLAIN:</strong> copie o SQL do log e rode EXPLAIN ANALYZE no Postgres / EXPLAIN no MySQL — verifique Index Scan vs Seq Scan, custos, rows estimadas vs reais.</p><p><strong>4. Métricas Prisma:</strong> <code>previewFeatures = [\"metrics\"]</code> — expõe métricas Prometheus de pool, queries em flight, durations.</p><p><strong>5. Prisma Pulse / Accelerate dashboard:</strong> em produção dão visão de queries reais, cache hit rate, latências por região.</p><p><strong>6. tracing:</strong> <code>previewFeatures = [\"tracing\"]</code> integra com OpenTelemetry — visualize traces de queries em Jaeger/Tempo.</p>",
      },
      {
        q: "O que são Prisma Pulse e Accelerate? Quais problemas resolvem?",
        level: "senior",
        a: "<p><strong>Prisma Accelerate:</strong> proxy HTTP + connection pooling global + cache distribuído. Resolve:</p><ul><li><strong>Cold start em serverless</strong> — cada Lambda nova abriria conexão TCP (300-500ms). Accelerate mantém pool quente globalmente.</li><li><strong>Edge runtime</strong> — workers sem TCP nativo só fazem HTTP.</li><li><strong>Cache</strong> — TTL e SWR (stale-while-revalidate) por query, distribuído em edge.</li></ul><p><strong>Prisma Pulse:</strong> Change Data Capture (CDC) gerenciado — você subscreve a mudanças em tabelas via stream. Resolve:</p><ul><li><strong>Real-time sem polling</strong> — em vez de SELECT a cada 5s, você recebe push quando algo muda.</li><li><strong>Substitui webhooks internos</strong> — qualquer INSERT/UPDATE/DELETE pode disparar lógica downstream sem precisar acoplar nas mutations.</li><li><strong>Casos:</strong> notificações push, sincronização cross-service, materialização de views, analytics em tempo real.</li></ul><p>Ambos são pagos — para apps high-traffic considerar custos. Alternativa Pulse: Postgres logical replication direto + biblioteca como pg-logical-replication.</p>",
      },
    ],
    codeExamples: [
      {
        title: "Schema completo — blog multi-tenant com soft delete e audit",
        description: "Schema realista de produção com 5 modelos, relações 1:1, 1:N e N:N, índices estratégicos, soft delete e timestamps.",
        code: `// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "fullTextIndex"]
}

model Tenant {
  id        String   @id @default(cuid())
  slug      String   @unique
  name      String
  users     User[]
  posts     Post[]
  createdAt DateTime @default(now())
  @@map("tenants")
}

model User {
  id          String    @id @default(cuid())
  email       String    @unique
  name        String
  role        Role      @default(USER)
  profile     Profile?               // 1:1
  posts       Post[]                 // 1:N
  comments    Comment[]              // 1:N
  tenantId    String
  tenant      Tenant    @relation(fields: [tenantId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?              // soft delete
  @@index([tenantId, role])
  @@index([deletedAt])              // queries de soft delete
  @@map("users")
}

model Profile {
  id     String  @id @default(cuid())
  bio    String? @db.Text
  avatar String?
  userId String  @unique
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Post {
  id          String      @id @default(cuid())
  slug        String
  title       String      @db.VarChar(255)
  content     String      @db.Text
  status      PostStatus  @default(DRAFT)
  publishedAt DateTime?
  views       Int         @default(0)
  metadata    Json?
  authorId    String
  author      User        @relation(fields: [authorId], references: [id])
  tenantId    String
  tenant      Tenant      @relation(fields: [tenantId], references: [id])
  comments    Comment[]
  tags        Tag[]                  // N:N implícita
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  deletedAt   DateTime?
  @@unique([tenantId, slug])         // slug único por tenant
  @@index([authorId, status, createdAt(sort: Desc)])
  @@index([tenantId, status, publishedAt(sort: Desc)])
  @@fulltext([title, content])
  @@map("posts")
}

model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  parentId  String?
  parent    Comment? @relation("Replies", fields: [parentId], references: [id])
  replies   Comment[] @relation("Replies")
  createdAt DateTime @default(now())
  @@index([postId, createdAt(sort: Desc)])
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}

enum Role        { ADMIN  EDITOR  USER }
enum PostStatus  { DRAFT  PUBLISHED  ARCHIVED }`,
        language: "prisma",
      },
      {
        title: "Repository pattern com Prisma + transactions interativas",
        description: "Encapsula lógica de domínio em métodos do repository. Transferência bancária com lock pessimista e rollback automático.",
        code: `// lib/repositories/account.ts
import { Prisma, PrismaClient } from '@prisma/client'

export class AccountRepository {
  constructor(private prisma: PrismaClient) {}

  async transfer(senderId: string, receiverId: string, amount: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Lock pessimista nas duas contas — ordem determinística por id
      const [firstId, secondId] = [senderId, receiverId].sort()
      const accounts = await tx.$queryRaw<Account[]>\`
        SELECT * FROM "accounts"
        WHERE id IN (\${firstId}, \${secondId})
        FOR UPDATE
      \`

      const sender = accounts.find(a => a.id === senderId)!
      const receiver = accounts.find(a => a.id === receiverId)!

      // 2. Validações de domínio
      if (sender.balance < amount) {
        throw new InsufficientFundsError(sender.id, amount)
      }
      if (sender.frozen || receiver.frozen) {
        throw new AccountFrozenError()
      }

      // 3. Atualiza saldos atomicamente
      await tx.account.update({
        where: { id: senderId },
        data: { balance: { decrement: amount } },
      })
      await tx.account.update({
        where: { id: receiverId },
        data: { balance: { increment: amount } },
      })

      // 4. Audit trail dentro da mesma transação
      return tx.transfer.create({
        data: {
          senderId,
          receiverId,
          amount,
          status: 'COMPLETED',
        },
      })
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      timeout: 10000,
      maxWait: 5000,
    })
  }

  async getBalance(accountId: string) {
    const result = await this.prisma.account.findUniqueOrThrow({
      where: { id: accountId },
      select: { balance: true, currency: true },
    })
    return result
  }
}

export class InsufficientFundsError extends Error {
  constructor(public accountId: string, public attempted: number) {
    super(\`Saldo insuficiente em \${accountId} para \${attempted}\`)
  }
}
export class AccountFrozenError extends Error {
  constructor() { super('Conta congelada') }
}`,
        language: "typescript",
      },
      {
        title: "Cursor pagination + filtros dinâmicos com Prisma + Zod",
        description: "Endpoint de feed com paginação por cursor, filtros opcionais validados, e tipagem inferida automaticamente.",
        code: `import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const FeedQuery = z.object({
  cursor: z.string().optional(),
  take: z.number().int().min(1).max(100).default(20),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  authorId: z.string().optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
})

export async function getFeed(input: z.infer<typeof FeedQuery>) {
  const { cursor, take, status, authorId, search, tag } = FeedQuery.parse(input)

  // Where construído condicionalmente — Prisma.PostWhereInput é tipado
  const where: Prisma.PostWhereInput = {
    deletedAt: null,
    ...(status && { status }),
    ...(authorId && { authorId }),
    ...(tag && { tags: { some: { name: tag } } }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ],
    }),
  }

  const posts = await prisma.post.findMany({
    where,
    take: take + 1,                    // pega 1 extra para detectar próxima página
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: [
      { publishedAt: 'desc' },
      { id: 'desc' },                  // tiebreaker estável
    ],
    select: {
      id: true,
      slug: true,
      title: true,
      publishedAt: true,
      author: {
        select: { id: true, name: true },
      },
      tags: {
        select: { name: true },
      },
      _count: {
        select: { comments: true },
      },
    },
  })

  // Detecta próxima página
  const hasNextPage = posts.length > take
  const items = hasNextPage ? posts.slice(0, take) : posts
  const nextCursor = hasNextPage ? items[items.length - 1].id : null

  return { items, nextCursor, hasNextPage }
}

// Tipo retornado é inferido automaticamente — sem any
type FeedResult = Awaited<ReturnType<typeof getFeed>>`,
        language: "typescript",
      },
      {
        title: "Multi-tenancy com Prisma Client Extension",
        description: "Garante isolamento por tenant em todas as queries automaticamente, sem precisar lembrar do filtro em cada chamada.",
        code: `import { PrismaClient } from '@prisma/client'

export function tenantedPrisma(basePrisma: PrismaClient, tenantId: string) {
  return basePrisma.$extends({
    query: {
      // Aplica em todos os models que tenham tenantId
      $allModels: {
        async findMany({ model, args, query }) {
          if (modelHasTenantId(model)) {
            args.where = { ...args.where, tenantId }
          }
          return query(args)
        },
        async findFirst({ model, args, query }) {
          if (modelHasTenantId(model)) {
            args.where = { ...args.where, tenantId }
          }
          return query(args)
        },
        async findUnique({ model, args, query }) {
          const result = await query(args)
          if (modelHasTenantId(model) && result && (result as any).tenantId !== tenantId) {
            return null
          }
          return result
        },
        async create({ model, args, query }) {
          if (modelHasTenantId(model)) {
            args.data = { ...args.data, tenantId }
          }
          return query(args)
        },
        async update({ model, args, query }) {
          if (modelHasTenantId(model)) {
            args.where = { ...args.where, tenantId } as any
          }
          return query(args)
        },
        async delete({ model, args, query }) {
          if (modelHasTenantId(model)) {
            args.where = { ...args.where, tenantId } as any
          }
          return query(args)
        },
      },
    },
  })
}

const TENANTED_MODELS = new Set(['User', 'Post', 'Comment'])
function modelHasTenantId(model: string) {
  return TENANTED_MODELS.has(model)
}

// Uso — middleware Next.js cria client por request
import { prisma as basePrisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const tenantId = await getTenantIdFromRequest(req)
  const prisma = tenantedPrisma(basePrisma, tenantId)

  // Não precisa lembrar de filtrar — o extension faz por trás
  const posts = await prisma.post.findMany()  // só posts do tenant
  return Response.json(posts)
}`,
        language: "typescript",
      },
    ],
    exercises: [
      {
        level: 'iniciante',
        title: "Setup Prisma + SQLite e CRUD básico de Tasks",
        description: "Crie um projeto Node.js novo, instale prisma e @prisma/client, configure SQLite (sem Docker). Defina um model Task com id (cuid), title (String), done (Boolean default false), createdAt (DateTime default now). Rode prisma migrate dev para gerar a primeira migration. Implemente um pequeno script CLI que cria, lista, marca como feita e deleta tasks. Use o Prisma Studio (npx prisma studio) para ver os dados graficamente.",
        concepts: ["schema.prisma", "prisma generate", "prisma migrate dev", "Prisma Client CRUD", "Prisma Studio"],
        hint: "datasource db { provider = \"sqlite\" url = \"file:./dev.db\" }. Para o CRUD: prisma.task.create, prisma.task.findMany, prisma.task.update({ where, data }), prisma.task.delete. Sempre await prisma.$disconnect() ao final do script.",
        relatedKeypoints: [1, 2, 4],
      },
      {
        level: 'intermediario',
        title: "Modelagem de blog com relações e seed",
        description: "Modele um blog completo: User (1:1 com Profile, 1:N com Post, 1:N com Comment), Post (N:N com Tag), Comment (auto-relação parent/replies). Defina índices apropriados (@@index em campos de filtro frequente). Crie um arquivo prisma/seed.ts que insere dados de teste — 3 users, 5 posts, 10 comments, 5 tags. Configure o package.json para rodar seed automaticamente após migrate reset. Use queries com select aninhado para listar 'posts publicados com autor, tags e contagem de comentários' em uma única query.",
        concepts: ["relations 1:1, 1:N, N:N", "auto-relação", "@@index", "@@unique", "prisma db seed", "select aninhado"],
        hint: "Para seed: \"prisma\": { \"seed\": \"tsx prisma/seed.ts\" } no package.json. Para auto-relação Comment: parentId String? + parent Comment? @relation('Replies', ...) + replies Comment[] @relation('Replies'). Use _count em select para contar relações sem trazer todos os registros.",
        relatedKeypoints: [3, 1, 2],
      },
      {
        level: 'intermediario',
        title: "Soft delete via Prisma Client Extension",
        description: "Adicione um campo deletedAt DateTime? em todos os models que devem suportar soft delete. Implemente um Prisma Client Extension que: (1) intercepta findMany, findUnique e findFirst para filtrar deletedAt: null automaticamente; (2) adiciona método softDelete(id) em cada model afetado; (3) adiciona método restore(id) que zera o deletedAt. Escreva testes verificando que: registros com deletedAt setado não aparecem em findMany, mas aparecem se usar o basePrisma direto (acesso de admin).",
        concepts: ["Prisma Client Extensions", "$extends", "query interception", "$allModels", "model methods"],
        hint: "Use $extends({ query: { user: { findMany: async ({ args, query }) => { args.where = { ...args.where, deletedAt: null }; return query(args) } } } }). Para múltiplos models, use $allModels e checagem por nome. Cuidado: extensions interceptam apenas chamadas via Prisma Client — $queryRaw bypassa.",
        relatedKeypoints: [7, 11],
      },
      {
        level: 'senior',
        title: "Transferência bancária com $transaction interativo e isolation level",
        description: "Implemente uma função transfer(senderId, receiverId, amount) que faz transferência atômica entre contas. Requisitos: (1) usar $transaction interativo com isolationLevel Serializable; (2) lock pessimista das duas contas com SELECT FOR UPDATE (use $queryRaw); (3) lock sempre na mesma ordem (id menor primeiro) para evitar deadlock; (4) validar saldo suficiente e contas não congeladas; (5) registrar audit trail na mesma transação; (6) timeout de 10s. Escreva testes que reproduzam: transferência simples ok, saldo insuficiente, conta congelada, deadlock prevenido com 1000 transferências paralelas.",
        concepts: ["$transaction interactive", "isolationLevel Serializable", "SELECT FOR UPDATE", "$queryRaw", "deadlock prevention", "audit trail atômico"],
        hint: "const [firstId, secondId] = [senderId, receiverId].sort() — ordena para sempre adquirir locks na mesma ordem. await tx.$queryRaw\\`SELECT * FROM accounts WHERE id IN (\\${firstId}, \\${secondId}) FOR UPDATE\\`. NUNCA use o prisma global dentro do callback — sempre tx. Para teste de deadlock: rode 1000 transfer(A,B) e transfer(B,A) em paralelo com Promise.all.",
        relatedKeypoints: [5, 6],
      },
      {
        level: 'senior',
        title: "API Next.js edge com Prisma Accelerate",
        description: "Migre uma API Next.js existente que usa Prisma para rodar em edge runtime com Prisma Accelerate. Configure conta no Prisma Data Platform, troque o DATABASE_URL para o connection string do Accelerate, mantenha DIRECT_URL apontando para o banco real (necessário para migrate). Refatore os route handlers para usar @prisma/client/edge + withAccelerate. Adicione cacheStrategy nos endpoints de leitura pública (TTL 60s + SWR 30s). Compare a latência cold start antes (Node.js runtime) e depois (edge): meça com curl em uma região distante. Documente os custos por query no Accelerate dashboard.",
        concepts: ["edge runtime", "Prisma Accelerate", "withAccelerate", "cacheStrategy", "DIRECT_URL", "cold start"],
        hint: "export const runtime = 'edge' no route handler. const prisma = new PrismaClient().$extends(withAccelerate()). cacheStrategy: { ttl: 60, swr: 30 } — só funciona em queries de leitura. Para migrations continuar funcionando, configure DIRECT_URL no schema: directUrl = env(\"DIRECT_URL\"). Curl com -w para medir tempo: curl -w \"%{time_total}\\n\" -o /dev/null URL.",
        relatedKeypoints: [11, 9],
      },
    ],
    mnemonics: [
      {
        label: "PIPELINE — schema → generate → migrate → use",
        trick: "Schema → Generate → Migrate → Client",
        explanation: "Sempre nessa ordem. Edita schema.prisma, roda prisma migrate dev (que internamente faz o diff e gera + aplica + regenera o client). Em produção a sequência é diferente: prisma generate no build, prisma migrate deploy antes do app subir.",
      },
      {
        label: "DEV vs DEPLOY — duas faces do migrate",
        trick: "dev = gera + aplica + gera client · deploy = só aplica",
        explanation: "migrate dev é interativo, gera novas migrations, regenera client — nunca em produção. migrate deploy é idempotente, só aplica migrations já versionadas em ordem — esse é o comando do CI/CD. db push existe mas só para protótipos descartáveis.",
      },
      {
        label: "SELECT vs INCLUDE — whitelist vs blacklist",
        trick: "select = só os campos pedidos · include = tudo + relações",
        explanation: "select restringe — tipo retornado encolhe para conter só os campos pedidos. include adiciona relações sem omitir campos do tipo base. Não pode usar os dois na mesma query — para combinar, aninhe select dentro de select.",
      },
      {
        label: "TX — sempre use o tx, nunca o prisma global",
        trick: "$transaction(async (tx) => { use tx, NEVER prisma })",
        explanation: "Dentro do callback de $transaction interativo, qualquer chamada que use o prisma global (não o tx recebido) executa fora da transação. Isso é o erro número 1 de transações em Prisma e gera bugs sutis de consistência.",
      },
    ],
    videos: [
      { title: "Prisma in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/results?search_query=prisma+in+100+seconds+fireship", topic: "visão geral", note: "Modelo mental rápido antes de aprofundar." },
      { title: "Prisma Crash Course — Full Tutorial", channel: "Web Dev Simplified", url: "https://www.youtube.com/results?search_query=prisma+crash+course+web+dev+simplified", topic: "fundamentos", note: "Schema, Client e migrations em projeto realista." },
      { title: "Prisma Migrate — Production Workflow", channel: "Prisma", url: "https://www.youtube.com/results?search_query=prisma+migrate+production+workflow", topic: "migrations", note: "migrate dev vs deploy, CI/CD, edge cases." },
      { title: "Prisma Client Extensions Deep Dive", channel: "Prisma", url: "https://www.youtube.com/results?search_query=prisma+client+extensions", topic: "extensions", note: "Soft delete, multi-tenancy, computed fields." },
      { title: "Prisma vs Drizzle — Honest Comparison", channel: "Theo - t3.gg", url: "https://www.youtube.com/results?search_query=prisma+vs+drizzle+theo", topic: "comparativo", note: "Tradeoffs práticos, edge runtime, performance." },
      { title: "Prisma Accelerate Explained", channel: "Prisma", url: "https://www.youtube.com/results?search_query=prisma+accelerate+explained", topic: "Accelerate", note: "Edge runtime, connection pooling global, cache distribuído." },
    ],
    resources: [
      { title: "Prisma Docs — Getting Started", url: "https://www.prisma.io/docs/getting-started", kind: "docs" },
      { title: "Prisma Schema Reference", url: "https://www.prisma.io/docs/orm/reference/prisma-schema-reference", kind: "docs" },
      { title: "Prisma Client Reference", url: "https://www.prisma.io/docs/orm/reference/prisma-client-reference", kind: "docs" },
      { title: "Prisma Data Guide", url: "https://www.prisma.io/dataguide/", kind: "artigo" },
      { title: "Prisma Migrate — Production Guide", url: "https://www.prisma.io/docs/orm/prisma-migrate/getting-started", kind: "docs" },
      { title: "Prisma Client Extensions", url: "https://www.prisma.io/docs/orm/prisma-client/client-extensions", kind: "docs" },
      { title: "Prisma Accelerate", url: "https://www.prisma.io/docs/accelerate", kind: "docs" },
      { title: "Prisma Pulse — CDC", url: "https://www.prisma.io/docs/pulse", kind: "docs" },
      { title: "Drizzle ORM (alternativa)", url: "https://orm.drizzle.team/", kind: "docs" },
      { title: "Prisma Examples (GitHub)", url: "https://github.com/prisma/prisma-examples", kind: "pratica" },
      { title: "Prisma Best Practices — Vercel guide", url: "https://vercel.com/guides/nextjs-prisma-postgres", kind: "artigo" },
      { title: "Prisma Slack Community", url: "https://slack.prisma.io/", kind: "pratica" },
    ],
  },

  "concurrency": {
    tagline: "Gerenciar execução paralela/concorrente: race conditions, deadlocks, atomicidade.",
    why: "Concurrency bugs são os mais dificeis de debugar em produção. Senior precisa saber race condition, locks otimistas vs pessimistas, e como Node/Go/Java diferem no modelo.",
    summary: "Concorrência e sobre múltiplas tarefas progredindo ao mesmo tempo (podem ser em threads diferentes ou via multiplexacao). Paralelismo e execução simultanea em múltiplos cores. Problemas clássicos: race condition (estado compartilhado sem sincronização), deadlock (duas threads esperando uma pela outra), starvation (thread nunca agendada). Soluções: mutex, semaforo, lock otimista (versão/timestamp), MVCC no banco.",
    keypoints: [
      { title: "Race condition", body: "Dois processos/threads leem e modificam mesmo estado sem sincronização. Resultado depende de timing. Ex: saldo bancario lido em paralelo antes do update." },
      { title: "Mutex / Lock", body: "Exclusão mútua: só uma thread executa seção crítica. Mutex binário. Semáforo conta até N. Em banco: SELECT FOR UPDATE (lock pessimista)." },
      { title: "Lock otimista", body: "Não bloqueia no read. No update, verifica se version/timestamp mudou. Se sim, rejeita e retenta. Menos contenção; bom para leitura pesada, escrita esporadica." },
      { title: "Lock pessimista", body: "Bloqueia recurso no read (SELECT FOR UPDATE). Garante consistencia ao custo de throughput. Bom para escrita frequente no mesmo recurso." },
      { title: "Deadlock", body: "A espera B liberar recurso, B espera A. Sistema trava. Banco detecta e mata uma das transações. Prevencao: adquirir locks sempre na mesma ordem." },
      { title: "Node.js e concorrência", body: "Single-threaded: sem race condition em memória para I/O (event loop). Mas race condition existe em lógica assíncrona (ler-modificar-escrever com await no meio)." },
      { title: "Atomic operations", body: "Operações indiviseis: incremento atômico no Redis (INCR), CAS (Compare-And-Swap) em hardware, transação de banco. Não ha estado intermediário visível." },
    ],
    gotchas: [
      "await no meio de ler-modificar-escrever em Node.js -- outro request pode interromper entre await. Use transação de banco ou Redis MULTI/EXEC.",
      "Lock otimista sem retry -- usuário recebe erro, deveria retentar silenciosamente.",
      "SELECT FOR UPDATE sem índice -- lock de tabela inteira ao inves de linha.",
      "Deadlock ciclico ignorado -- banco mata transação, app não retenta, usuário ve erro 500.",
      "Mutex em JavaScript (worker_threads) -- Atomics.wait bloqueia worker, não event loop.",
    ],
    interview: [
      { q: "Como você prevenira double-spend em transferencia bancaria?", a: "<p>Banco: SELECT FOR UPDATE nas duas contas dentro de uma transação. Garante lock pessimista. Sempre lock na mesma ordem (menor id primeiro) para evitar deadlock.</p><p>Alternativa: lock otimista com campo version. Update falha se version mudou; retenta com backoff.</p><p>Redis: MULTI/EXEC com WATCH para lock otimista em cache.</p>" },
      { q: "Race condition em Node.js -- como acontece se é single-threaded?", a: "<p>Node é single-threaded por V8, mas não por I/O. Entre dois awaits, outro microtask pode rodar. Ex:</p><pre>const saldo = await getBalance(); // await aqui\n// outro request roda e debita aqui\nawait debit(saldo - valor); // opera sobre saldo stale</pre><p>Solução: transação de banco atômica ou Redis MULTI/EXEC. Não dependa de memória para estado crítico.</p>" },
    ],
    resources: [
      { title: "DDIA -- Chapter 7 (Transactions)", url: "https://dataintensive.net/", kind: "livro" },
      { title: "Java Concurrency in Practice", url: "https://jcip.net/", kind: "livro" },
    ],
  },

  "caching-strategies": {
    tagline: "Estrategias de cache: cache-aside, write-through, write-behind, read-through.",
    why: "Cache bem aplicado reduz latência 10-100x e custa uma fração do infra. Senior precisa escolher estrategia certa, saber invalidacao e evitar problemas (stale data, thundering herd, cache poisoning).",
    summary: "Caching armazena resultado de computação cara para servir rápido nas próximas chamadas. Estrategias: cache-aside (app gerencia leitura/escrita), read-through (cache busca do banco automaticamente), write-through (escreve em cache e banco juntos), write-behind (escreve em cache, banco de forma assíncrona). Invalidacao e o problema mais difícil: TTL, event-driven, cache versioning.",
    keypoints: [
      { title: "Cache-aside (Lazy loading)", body: "App le do cache. Miss? Le do banco, escreve no cache, retorna. Simples, resiliente (cache falha, app le do banco). Desvantagem: primeiro request e lento (cold start); consistencia eventual." },
      { title: "Read-through", body: "Cache e responsável por buscar do banco em caso de miss. App sempre conversa com cache. Mais simples na app, mas cache precisa conhecer a origem." },
      { title: "Write-through", body: "Cada escrita vai ao cache E ao banco, sincronamente. Cache sempre frescos. Desvantagem: latência de escrita maior; cache polui com dados raramente lidos." },
      { title: "Write-behind (Write-back)", body: "Escrita vai ao cache imediatamente, banco atualizado de forma assíncrona. Throughput de escrita alto. Risco: perda de dado se cache cai antes do flush." },
      { title: "TTL e invalidacao", body: "TTL simples evita stale infinito. Invalidacao event-driven (pública evento, consumer inválida chaves) e mais precisa. Cache versioning (v1:key -> v2:key) permite deploy sem stale." },
      { title: "Thundering herd", body: "Cache expira, N requests vão ao banco simultaneamente. Mitigação: mutex no cache (só um busca, outros esperam), stale-while-revalidate, jitter no TTL." },
      { title: "Cache levels", body: "L1: in-process (node-cache, Map). L2: Redis/Memcached. L3: CDN (para assets e respostas públicas). Cada nível tem latência, tamanho e consistencia diferentes." },
    ],
    gotchas: [
      "Cache poisoning -- dado inválido ou malicioso cacheado. Valide antes de cachear.",
      "Cache tudo sem TTL -- dado fica stale indefinidamente.",
      "Key collision -- chaves sem namespace (user:123 vs user:123 em contextos diferentes).",
      "Cachear objeto mutável por referência em L1 -- mutação afeta cache.",
      "Esquecer de invalidar cache em delete -- dado removido ainda aparece.",
      "Cache de erro -- cachear resposta de erro pode propagar falha temporaria por horas.",
    ],
    interview: [
      { q: "Cache-aside vs write-through -- quando usar cada?", a: "<p>Cache-aside: padrão para leitura pesada onde miss ocasional e aceitavel. Simples, resiste a falha de cache. Bom para dados lidos frequentemente, escritos raramente.</p><p>Write-through: quando consistencia e crítica e latência de escrita e toleravel. Garante que cache nunca serve dado stale. Ruim para escrita intensiva.</p><p>Write-behind: escrita intensiva onde pequena janela de perda e aceitavel (analytics, contador de views).</p>" },
      { q: "Como lida com thundering herd?", a: "<p>Técnicas:</p><ul><li>Mutex no Redis: SET lock NX EX 5. So um processo busca, outros esperam.</li><li>Stale-while-revalidate: serve dado expirado enquanto atualiza em background.</li><li>Jitter no TTL: TTL = base + random(0, base*0.1). Evita expiracao sincronizada.</li><li>Pre-warming: cron ou evento pre-popula cache antes de expirar.</li></ul>" },
    ],
    resources: [
      { title: "AWS -- Caching Best Practices", url: "https://aws.amazon.com/caching/best-practices/", kind: "docs" },
      { title: "Redis -- Patterns", url: "https://redis.io/docs/manual/patterns/", kind: "docs" },
      { title: "Facebook -- Scaling Memcache", url: "https://www.usenix.org/conference/nsdi13/technical-sessions/presentation/nishtala", kind: "artigo" },
    ],
  },

  "api-versioning": {
    tagline: "Evolucao de API sem quebrar clientes existentes: URL, header, query param, content negotiation.",
    why: "API pública sem strategy de versioning quebra cliente em produção. Senior sabe tradeoffs entre URL versioning, header versioning e deprecation graceful.",
    summary: "API versioning e como você evolui sua API sem quebrar clientes existentes. Estrategias: URL path (/v1/, /v2/), query parameter (?version=2), custom header (X-API-Version), Accept header (content negotiation). Cada tem tradeoffs de cacheabilidade, visibilidade e complexidade. Boa prática: suporte N versões por período definido, deprecation com aviso antecipado, sunset header.",
    keypoints: [
      { title: "URL versioning", body: "/v1/users, /v2/users. Mais visível, fácil de testar no browser, bom pra cache. Polui URLs. Padrão adotado por Stripe, GitHub, AWS." },
      { title: "Header versioning", body: "X-API-Version: 2. URL limpa. Invisivel no browser, dificulta share de link, precisa de middleware. Usado pela Microsoft Azure." },
      { title: "Query param", body: "?api-version=2023-01-01. Visivel na URL sem poluir path. Azure usa essa estrategia com data como versão." },
      { title: "Accept header (content negotiation)", body: "Accept: application/vnd.company.v2+json. REST puro segundo Fielding. Complexidade alta. Pouco adotado na prática." },
      { title: "Sunset e deprecation", body: "Header Sunset: data em que versão sera removida. Deprecation notice em docs e resposta. Mínimo 6-12 meses de aviso para API pública." },
      { title: "Estrategia de manutenção", body: "Suportar N versões com janela de obsolescencia. Versão nova não implica remover a velha. Versões internas podem ter ciclo mais curto." },
    ],
    gotchas: [
      "Versionar cada endpoint individualmente -- inconsistencia de versão por recurso confunde.",
      "Breaking change sem versão nova -- campo renomeado, tipo mudado, campo removido são breaking.",
      "Deprecar sem sunset -- cliente nunca migra sem deadline.",
      "Manter 10 versões vivas -- custo de manutenção explode. Defina janela e remova.",
    ],
    interview: [
      { q: "O que e uma breaking change?", a: "<p>Campo removido, campo renomeado, tipo de campo mudado, comportamento de erro mudado, autenticação requerida onde não havia, campo obrigatório adicionado.</p><p>Não-breaking: novo campo opcional adicionado, novo endpoint, novo valor em enum (cuidado com parsers strict), latência melhorada.</p>" },
      { q: "Qual estrategia de versioning você prefere?", a: "<p>URL versioning para API pública: visível, cacheavel, fácil de documentar. Clientes sabem exatamente o que estao consumindo.</p><p>Header versioning para API interna: URL limpa, versão negociada em middleware centralizado.</p><p>O mais importante e a política: sunset prazo, N versões suportadas, breaking change sempre em major.</p>" },
    ],
    resources: [
      { title: "Stripe -- API versioning", url: "https://stripe.com/blog/api-versioning", kind: "artigo" },
      { title: "RFC 8594 -- Sunset Header", url: "https://datatracker.ietf.org/doc/html/rfc8594", kind: "docs" },
    ],
  },

  "laravel": {
    tagline: "Framework PHP MVC com ORM Eloquent, Artisan CLI, filas e ecossistema maduro.",
    why: "Laravel domina o mercado PHP brasileiro. Saber Eloquent, service providers, filas e segurança básica e esperado em vagas que tem PHP no stack.",
    summary: "Laravel e um framework PHP MVC que prioriza developer experience. Eloquent ORM com ActiveRecord, Blade para templates, Artisan CLI para scaffolding e tasks, filas e jobs, eventos e listeners, broadcasting, Sanctum/Passport para auth. Ecossistema: Telescope (debug), Horizon (filas Redis), Forge (deploy), Vapor (serverless).",
    keypoints: [
      { title: "Eloquent ORM", body: "ActiveRecord. Model mapeia para tabela. Relacionamentos: hasOne, hasMany, belongsTo, belongsToMany. Eager loading: with(). Soft deletes com SoftDeletes trait." },
      { title: "Service Provider", body: "Bootstrap da aplicação. register() registra bindings no IoC container. boot() executa após todos providers registrados. Padrão para publicar config, migrations, routes." },
      { title: "Middleware", body: "Filtros HTTP: auth, rate limiting, CORS, logging. Aplica globalmente ou por route. Terminating middleware roda após response enviado." },
      { title: "Filas (Queue)", body: "Job classes para trabalho assíncrono. Drivers: sync, database, Redis (Horizon), SQS. Retry, delay, timeout, priority. Useful para email, processamento de imagem, integração." },
      { title: "Eloquent N+1", body: "Carregar relação em loop sem with() -> N queries. Detectar com Laravel Debugbar ou Telescope. Corrigir: Post::with('user')->get()." },
      { title: "Migrations", body: "php artisan make:migration. Schema::create, table, drop. Rollback com down(). Versionado em git junto com código." },
      { title: "Artisan Commands", body: "php artisan make:model, make:controller, make:migration, make:job, make:command. Criação de commands customizados para cronjobs e tasks." },
    ],
    gotchas: [
      "N+1 com Eloquent -- o clássico. Use with() ou load() para eager loading.",
      "Mass assignment sem $fillable ou $guarded -- SQL injection via create(request->all()).",
      "Debugbar em produção -- expoe queries, variáveis, session. Desabilite.",
      "Job sem handle exception -- fila trava em erro, job fica pendurado.",
      "Route caching com closure -- php artisan route:cache falha com closures em routes.",
    ],
    interview: [
      { q: "Como resolveria N+1 no Laravel?", a: "<p>Identificar: Laravel Debugbar mostra número de queries. Corrigir: eager loading com with(['relation', 'nested.relation']). Lazy eager: $model->load('relation') após carregar.</p><p>Para relações de contagem: withCount('comments') ao inves de $post->comments->count() em cada item.</p>" },
      { q: "Como funciona o IoC container do Laravel?", a: "<p>Service container resolve dependências automaticamente via reflection (type hints no construtor). Bindings registrados em service providers: $this->app->bind(Interface::class, Implementation::class).</p><p>Singleton: $this->app->singleton(). Instancia única por ciclo de vida da app.</p>" },
    ],
    resources: [
      { title: "Laravel docs", url: "https://laravel.com/docs/", kind: "docs" },
      { title: "Laracasts", url: "https://laracasts.com/", kind: "curso" },
    ],
  },

  "express": {
    tagline: "Framework Node.js minimalista: routing, middleware, sem opiniao sobre estrutura.",
    why: "Express e o framework Node.js mais usado no mundo. Entender como middleware chain funciona, error handling e como estruturar projetos grandes é base para qualquer backend Node senior.",
    summary: "Express e um framework minimalista para Node.js que adiciona routing e middleware sobre o http module nativo. Middleware functions recebem (req, res, next). Request passa em sequência pelos middlewares registrados até o handler ou error handler. Sem opiniao sobre estrutura de pastas, ORM, ou autenticação -- você escolhe tudo.",
    keypoints: [
      { title: "Middleware chain", body: "app.use((req, res, next) => {}). Cada middleware chama next() para passar pra próximo ou res.send() para encerrar. Ordem de registro importa." },
      { title: "Routing", body: "app.get('/users', handler). Express Router para modularizar. router.use() para sub-middleware. Params: req.params, req.query, req.body (com body-parser)." },
      { title: "Error handling", body: "Error middleware tem 4 parametros: (err, req, res, next). Registrado por último. next(err) propaga erro para error handler." },
      { title: "Middlewares úteis", body: "cors, helmet (segurança headers), morgan (logging), express-rate-limit, compression. body-parser incluido no Express 4.16+." },
      { title: "async/await", body: "Express não captura erros async por default. Wrapper necessário: asyncHandler(fn) = (req,res,next) => fn(req,res,next).catch(next). Express 5 captura nativamente." },
      { title: "Estrutura em escala", body: "Feature folders ao inves de layer folders. routes/ controllers/ services/ repositories/ por domínio. Evita controller gordo." },
    ],
    gotchas: [
      "async/await sem try/catch e sem asyncHandler -- erro não chega no error handler, request trava.",
      "res.send() chamado duas vezes -- Cannot set headers after they are sent.",
      "Middlewares de segurança esquecidos (helmet, rate-limit) em API pública.",
      "Body-parser limit muito pequeno -- payload grande retorna 413.",
      "next() chamado depois de res.send() -- executa próximo middleware desnecessariamente.",
    ],
    interview: [
      { q: "Como funciona o error handling no Express?", a: "<p>Error handler tem assinatura (err, req, res, next). Registrado por último com app.use(). Quando next(err) e chamado, Express pula middlewares normais e vai direto para o error handler.</p><p>Para async, precisa de wrapper ou Express 5: asyncHandler = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next).</p>" },
      { q: "Como organizaria projeto Express grande?", a: "<p>Feature-based: cada domínio tem sua própria pasta com routes, controller, service, repository. Evita controller gordo e facilita encontrar código por feature, não por layer.</p><p>Centralize error handling, logging e autenticação em middlewares globais. Use dependency injection manual ou container leve.</p>" },
    ],
    resources: [
      { title: "Express docs", url: "https://expressjs.com/", kind: "docs" },
    ],
  },

  "python": {
    tagline: "Linguagem interpretada dinâmica, lider em AI/ML e scripting, crescendo em backend.",
    why: "Python e indispensavel para AI/ML em 2025. Senior backend que vai trabalhar com LLMs, data pipelines ou scripts precisa dominar Python alem de JS/TS.",
    summary: "Python e uma linguagem de alto nível, dinâmica, com enfase em legibilidade. Dominante em AI/ML (PyTorch, TensorFlow, HuggingFace), data science (pandas, numpy), scripting e automacao. Crescendo em backend (FastAPI, Django). GIL limita paralelismo CPU-bound em threads; use multiprocessing ou async (asyncio) para I/O concorrente.",
    keypoints: [
      { title: "GIL", body: "Global Interpreter Lock: só uma thread Python executa bytecode por vez. CPU-bound não beneficia de threads. Solução: multiprocessing, ou liberar GIL em C extension (numpy faz isso)." },
      { title: "asyncio", body: "I/O concorrente single-threaded via event loop. async def e await. aiohttp, httpx para HTTP async. asyncpg para Postgres. Base do FastAPI." },
      { title: "Tipagem", body: "Python 3.5+ tem type hints opcionais. mypy e pyright para checagem estatica. Pydantic usa tipos pra validação em runtime. FastAPI usa Pydantic automaticamente." },
      { title: "Virtual environments", body: "venv ou poetry para isolar dependências por projeto. requirements.txt ou pyproject.toml. Docker para isolar totalmente." },
      { title: "Generators e itertools", body: "yield cria generator (lazy, memória eficiente). Bom para streaming de dados grandes. itertools para combinatorics eficiente." },
      { title: "Context managers", body: "with statement. __enter__ e __exit__ garantem cleanup (arquivo fechado, conexão liberada). contextlib.contextmanager para função simples." },
      { title: "Packaging", body: "pip install. pyproject.toml (PEP 517/518). Poetry para gerenciamento completo. setuptools para distribuição." },
    ],
    gotchas: [
      "Mutable default argument: def f(x=[]) -- a lista é compartilhada entre chamadas. Use None + check.",
      "GIL: threads Python não paralelizam CPU-bound. Use multiprocessing.",
      "Late binding em closure em loop: lambda i=i workaround necessário em Python 2, ainda comum em bugs.",
      "Circular import em módulos -- reorganizar imports ou usar lazy import.",
      "float precision: 0.1 + 0.2 != 0.3 -- use decimal para cálculos financeiros.",
    ],
    interview: [
      { q: "O que e o GIL e quando importa?", a: "<p>GIL (Global Interpreter Lock) permite que so uma thread execute bytecode Python por vez, mesmo em multi-core. Isso simplifica gerenciamento de memória mas limita paralelismo CPU-bound em threads.</p><p>Para CPU-bound: use multiprocessing (cada processo tem seu próprio GIL). Para I/O-bound: threads ou asyncio funcionam bem (GIL e liberado durante I/O).</p>" },
      { q: "Diferenca entre list comprehension e generator expression?", a: "<p>List comprehension [x for x in ...] cria lista completa em memória. Generator expression (x for x in ...) cria generator lazy -- calcula sob demanda, O(1) memória.</p><p>Use generator quando processar sequência grande sem precisar de todos elementos ao mesmo tempo.</p>" },
    ],
    resources: [
      { title: "Real Python", url: "https://realpython.com/", kind: "artigo" },
      { title: "Python docs", url: "https://docs.python.org/3/", kind: "docs" },
    ],
  },

  "fastify": {
    tagline: "Framework Node.js de alta performance com schema validation e plugin system.",
    why: "Fastify e 2-3x mais rápido que Express em benchmarks e tem validação de schema integrada. Adocao crescente como alternativa ao Express em novos projetos Node.",
    summary: "Fastify e um framework Node.js focado em performance e DX. Válida request/response automaticamente com JSON Schema (via ajv), tem sistema de plugins com encapsulamento (contexto de decorators por escopo), hooks para ciclo de vida (onRequest, preHandler, onSend) e suporte first-class a TypeScript.",
    keypoints: [
      { title: "JSON Schema validation", body: "Schemas definem estrutura de body, params, query, headers, response. ajv válida e compila para código nativo. Rejeita automaticamente requests inválidos com 400." },
      { title: "Plugin system", body: "fastify.register(plugin, opts). Cada plugin tem escopo encapsulado (decorators, hooks não vazam para fora sem fastify-plugin). Permite DI via decorators." },
      { title: "Hooks", body: "onRequest, preParsing, preValidation, preHandler, preSerialization, onSend, onResponse. Granularidade máxima no ciclo de vida." },
      { title: "Serialization", body: "Response schema acelera serialização JSON (fast-json-stringify vs JSON.stringify). 2-10x mais rápido para objetos grandes." },
      { title: "TypeScript support", body: "Types gerados automaticamente a partir de schemas. @fastify/type-provider-typebox ou zod para tipos ainda mais precisos." },
      { title: "Decorators", body: "fastify.decorate('db', dbInstance). Disponivel em todo handler como fastify.db. Encapsulado por escopo de plugin." },
    ],
    gotchas: [
      "Plugin sem fastify-plugin wrapper -- decorators não vazam para o scope pai.",
      "Schema de response sem 200 -- fastify não válida/serializa response sem schema definido.",
      "async handler sem return -- response fica pendente.",
      "Misturar reply.send() e return -- comportamento imprevisivel.",
    ],
    interview: [
      { q: "Por que Fastify e mais rápido que Express?", a: "<p>Serialização JSON com fast-json-stringify (2-10x vs JSON.stringify para schemas conhecidos), validação compilada com ajv (JIT), routing com find-my-way (radix tree vs Express linear), ausencia de overhead de middleware legado.</p><p>Em benchmarks: ~77k req/s vs Express ~28k req/s em hello world. Diferenca real em produção depende do bottleneck (geralmente DB, não framework).</p>" },
    ],
    resources: [
      { title: "Fastify docs", url: "https://www.fastify.io/docs/", kind: "docs" },
      { title: "Fastify benchmarks", url: "https://www.fastify.io/benchmarks/", kind: "artigo" },
    ],
  },

  "rest-apis": {
    tagline: "Princípios REST: recursos, verbos HTTP, stateless, HATEOAS e boas práticas de design.",
    why: "REST e o baseline de toda vaga backend. Senior sabe design de recurso, idempotencia, status codes corretos e os tradeoffs com GraphQL e gRPC.",
    summary: "REST (Representational State Transfer) e um estilo arquitetural para APIs baseado em recursos identificados por URIs, operações com verbos HTTP semanticos (GET, POST, PUT, PATCH, DELETE), statelessness, e interface uniforme. Richardson Maturity Model mede adoção: nível 0 (RPC), nível 1 (recursos), nível 2 (verbos HTTP), nível 3 (HATEOAS).",
    keypoints: [
      { title: "Resources e URIs", body: "Substantivos no plural: /users, /orders. Hierarquia: /users/{id}/orders. Evite verbos na URI (/getUser -- errado; GET /users/{id} -- certo)." },
      { title: "Verbos HTTP", body: "GET (leitura idempotente), POST (criação, não idempotente), PUT (replace total, idempotente), PATCH (update parcial, idempotente se bem definido), DELETE (idempotente)." },
      { title: "Status codes", body: "200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests, 500 Internal Server Error." },
      { title: "Idempotencia", body: "Mesma operação múltiplas vezes produz mesmo resultado. GET, PUT, DELETE são idempotentes. POST não e (cria novo a cada chamada). Importante para retry seguro." },
      { title: "Paginação", body: "cursor-based (mais estável pra dados mutáveis), offset/limit (simples mas instavel em inserção), keyset. Inclui links de navegação (next, prev) no response." },
      { title: "Versioning", body: "URI (/v1/, /v2/), header (X-API-Version), Accept header. Sunset para deprecação. Breaking changes só em major version." },
      { title: "HATEOAS", body: "Respostas incluem links para próximas ações possíveis. Nível 3 do Richardson. Raramente implementado completamente na prática." },
    ],
    gotchas: [
      "POST para tudo (RPC style) -- perde semantica HTTP e cacheabilidade.",
      "200 OK para todo erro -- cliente não sabe que falhou. Use status codes corretos.",
      "Body em GET request -- undefined em HTTP, alguns proxies descartam.",
      "Não versionar API pública -- breaking change quebra cliente.",
      "Paginação offset em tabela que muda frequentemente -- itens duplicados ou perdidos.",
    ],
    interview: [
      { q: "Diferença entre PUT e PATCH?", a: "<p>PUT faz replace completo do recurso: você envia a representação inteira. Campos omitidos são removidos/resetados. Idempotente.</p><p>PATCH faz update parcial: só os campos enviados são atualizados. Idempotente se bem definido (aplicar mesmo patch múltiplas vezes da mesmo resultado). Use PATCH para updates parciais -- mais eficiente e seguro.</p>" },
      { q: "REST vs GraphQL vs gRPC -- quando usar cada?", a: "<p>REST: API pública, cacheavel, consumida por terceiros. Simples de documentar e testar.</p><p>GraphQL: múltiplos clientes com necessidades diferentes, schema como contrato, overfetching problema real.</p><p>gRPC: comunicação interna microservicos, performance crítica, streaming bidirecional, contratos fortes com Protobuf.</p>" },
    ],
    resources: [
      { title: "REST API Design Rulebook", url: "https://www.oreilly.com/library/view/rest-api-design/9781449317904/", kind: "livro" },
      { title: "Richardson Maturity Model (Fowler)", url: "https://martinfowler.com/articles/richardsonMaturityModel.html", kind: "artigo" },
    ],
    diagram: "osi-layers",
  },

  "websocket": {
    tagline: "Protocolo de comunicação bidirecional persistente sobre TCP para real-time.",
    why: "WebSocket é a base de chat, notificações, jogos e dashboards em tempo real. Sênior precisa saber lifecycle, escalabilidade horizontal e alternativas (SSE, Long Polling).",
    summary: "WebSocket é um protocolo de comunicação full-duplex persistente, iniciado via upgrade de HTTP. Após handshake, conexão TCP permanece aberta para troca de frames bidirecional. Latência muito menor que polling. Desafios em escala: estado de conexão em N servidores (use Redis pub/sub ou sticky sessions), reconexão, heartbeat, autenticação de conexão.",
    keypoints: [
      { title: "Handshake", body: "Cliente envia HTTP com Upgrade: websocket. Servidor responde 101 Switching Protocols. A partir daí, protocolo WebSocket sobre TCP." },
      { title: "Frames", body: "Dados enviados em frames (text, binary, ping, pong, close). Fragmentação automática para mensagens grandes." },
      { title: "Heartbeat", body: "Ping/pong para detectar conexão morta. Cliente ou servidor envia ping; outro responde pong. Timeout sem pong = fechar conexão." },
      { title: "Escalabilidade horizontal", body: "Conexões são stateful — um servidor mantém lista dos sockets conectados. Em N servidores, precisa de pub/sub (Redis) para broadcast, ou sticky sessions (load balancer direciona usuário pro mesmo servidor)." },
      { title: "Autenticação", body: "WebSocket não tem headers após handshake. Autentique no handshake (query param com token, ou cookie). Ou primeira mensagem após conexão é o auth token." },
      { title: "Socket.IO", body: "Lib popular que usa WebSocket com fallback para long polling. Adiciona rooms, namespaces, auto-reconexão, ack de mensagem. Overhead vs WS puro." },
      { title: "SSE vs WebSocket", body: "SSE (Server-Sent Events): unidirecional servidor→cliente, sobre HTTP/2, auto-reconexão nativa, mais simples. WebSocket: bidirecional, mais complexo. Use SSE para notificações/feed; WebSocket para interação real-time." },
    ],
    gotchas: [
      "Sem heartbeat — conexão morta não é detectada, recurso vazado no servidor.",
      "Autenticação fraca no handshake — qualquer um conecta.",
      "N servidores sem Redis pub/sub — mensagem entregue só para usuários no mesmo servidor.",
      "Sem rate limiting de mensagens — cliente inunda servidor.",
      "Memory leak: conexão fechada sem cleanup de event listeners e rooms.",
    ],
    interview: [
      { q: "Como escalaria WebSocket horizontalmente?", a: "<p>Em múltiplos servidores, conexão fica em um único servidor. Para broadcast ou mensagem entre usuários em servidores diferentes: Redis pub/sub. Servidor A publica mensagem, todos servidores assinam e repassam para seus sockets conectados.</p><p>Alternativa: sticky sessions (LB envia usuário sempre para o mesmo servidor). Simples mas vulnerável a restart.</p>" },
      { q: "WebSocket vs SSE — quando usar cada?", a: "<p>SSE: notificações, feed, progresso de operação — dados fluem do servidor para o cliente. HTTP/2 nativo, auto-reconexão, mais simples de implementar e escalar.</p><p>WebSocket: chat, jogos, colaboração em tempo real — cliente também envia dados frequentemente. Latência menor, full-duplex.</p><p>Para a maioria das notificações de app, SSE é mais simples e suficiente.</p>" },
    ],
    resources: [
      { title: "MDN — WebSockets API", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API", kind: "docs" },
      { title: "Socket.IO docs", url: "https://socket.io/docs/v4/", kind: "docs" },
    ],
  },

  // ─── P1 faltante ───────────────────────────────────────────────────────────

  "postgresql": {
    tagline: "Banco relacional open-source mais avançado do mundo — ACID, extensível, production-grade.",
    why: "PostgreSQL é o banco padrão de novas aplicações no Brasil em 2025. Saber modelagem, índices, EXPLAIN ANALYZE, transactions e extensões (pgvector, PostGIS) diferencia sênior de pleno.",
    summary: "PostgreSQL é um banco de dados objeto-relacional open-source com suporte completo a ACID, transações, MVCC (Multi-Version Concurrency Control), JSON nativo, full-text search, extensões e tipos customizados. É o banco padrão em stacks modernas (Node/Python/Go) pela combinação de confiabilidade, features avançadas e desempenho. Entender o planejador de queries, índices e isolamento de transações é essencial para qualquer backend sênior.",
    keypoints: [
      { title: "ACID e isolamento", body: "Atomicidade, Consistência, Isolamento, Durabilidade. Níveis de isolamento: READ COMMITTED (default), REPEATABLE READ, SERIALIZABLE. Cada nível previne diferentes anomalias (dirty read, non-repeatable read, phantom read)." },
      { title: "MVCC", body: "Multi-Version Concurrency Control: leitores não bloqueiam escritores e vice-versa. Cada transação vê snapshot consistente dos dados. Linhas antigas ficam como 'dead tuples' — VACUUM as remove." },
      { title: "Índices", body: "B-tree (default, comparações), Hash (igualdade), GiST (geoespacial, range), GIN (JSONB, full-text, arrays), BRIN (tabelas ordenadas por range). Índice parcial e índice em expressão reduzem tamanho e melhoram seletividade." },
      { title: "EXPLAIN ANALYZE", body: "Mostra plano de execução real com custo estimado e tempo real. Seq Scan vs Index Scan vs Bitmap Index Scan. Buffers e WAL hits indicam cache hit. Use para diagnosticar queries lentas." },
      { title: "CTEs e Window Functions", body: "WITH clause para queries recursivas (grafos, hierarquias) ou apenas organização. Window functions (ROW_NUMBER, RANK, LAG, LEAD) para cálculos sobre partições sem GROUP BY." },
      { title: "JSONB", body: "Armazenamento binário de JSON com índices GIN. Operadores @>, ?, #>. Melhor que JSON (texto) para queries. Útil para dados semi-estruturados sem sacrificar relacional." },
      { title: "Extensões", body: "pgvector (embeddings de IA), PostGIS (geoespacial), pg_trgm (busca fuzzy), uuid-ossp, timescaledb. Instalar com CREATE EXTENSION." },
    ],
    gotchas: [
      "SELECT sem índice em tabela grande — full seq scan. Crie índice nas colunas do WHERE e JOIN.",
      "UPDATE sem WHERE — atualiza todas as linhas. Sempre verifique o WHERE antes.",
      "N+1 no ORM — cada item da lista gera uma query. Use JOIN ou eager loading.",
      "VACUUM não rodando — dead tuples acumulam, tabela incha, performance cai. Monitore autovacuum.",
      "Usar VARCHAR(255) por hábito — em Postgres, TEXT é equivalente em performance e mais flexível.",
      "Transação longa aberta — segura locks, bloqueia VACUUM, pode causar deadlock.",
    ],
    interview: [
      { q: "O que é MVCC e por que ele importa?", a: "<p>Multi-Version Concurrency Control: PostgreSQL mantém múltiplas versões de cada linha. Quando uma transação atualiza uma linha, a versão antiga permanece para transações que ainda a estão lendo.</p><p>Resultado: leitores nunca bloqueiam escritores e vice-versa. Isso é a base da alta concorrência do Postgres — sem precisar de locks de leitura explícitos.</p><p>Custo: dead tuples acumulam e precisam de VACUUM periódico.</p>", level: "senior" },
      { q: "Quando usar índice parcial?", a: "<p>Índice parcial indexa apenas linhas que satisfazem uma condição: <code>CREATE INDEX ON orders (status) WHERE status = 'pending'</code>. Muito menor que índice completo, usado quando só um subconjunto de linhas é consultado frequentemente.</p><p>Exemplo: tabela com milhões de pedidos mas só milhares 'pendentes' — índice parcial é 100x menor e mais eficiente.</p>", level: "senior" },
      { q: "Como investigaria uma query lenta?", a: "<p>1. <code>EXPLAIN ANALYZE</code> para ver plano real (não estimado). Identificar: Seq Scan em tabela grande, estimativas muito erradas, hash join vs nested loop inesperado.</p><p>2. Verificar estatísticas com <code>ANALYZE</code> se estimativas estão erradas.</p><p>3. Criar índice nas colunas do WHERE/JOIN/ORDER BY se falta cobertura.</p><p>4. Reescrever query se plano é subótimo (CTEs às vezes bloqueiam otimizador — use <code>MATERIALIZED</code> ou remova).</p>", level: "pleno" },
      { q: "Diferença entre READ COMMITTED e SERIALIZABLE?", a: "<p>READ COMMITTED (default): cada statement dentro da transação vê dados commitados até aquele momento. Pode ver diferentes versões se outra transação commitar entre dois SELECTs.</p><p>SERIALIZABLE: transações executam como se fossem sequenciais. Previne todas as anomalias. Custo: possíveis erros de serialização (retry necessário) e overhead.</p><p>REPEATABLE READ: garante que o mesmo SELECT retorna os mesmos dados dentro da transação, mas ainda pode ter phantom reads (novas linhas inseridas por outra transação).</p>", level: "senior" },
      { q: "Para que serve o comando VACUUM?", a: "<p>VACUUM remove dead tuples — versões antigas de linhas que foram atualizadas ou deletadas pelo MVCC. Sem VACUUM, a tabela cresce indefinidamente e o seq scan fica cada vez mais lento.</p><p>VACUUM FULL faz rewrite completo da tabela (libera espaço para OS), mas bloqueia a tabela. Use apenas quando necessário. O autovacuum cuida do VACUUM rotineiro — monitore para garantir que está rodando.</p>", level: "pleno" },
      { q: "Quando usar JSONB vs tabela relacional?", a: "<p>Relacional: dados com estrutura conhecida e estável, queries complexas com JOINs, integridade referencial importante.</p><p>JSONB: dados semi-estruturados ou variáveis por registro (configurações de usuário, metadados), prototipagem rápida, dados de terceiros com schema imprevisível.</p><p>Híbrido: tabela com colunas fixas para os campos que você sempre consulta + coluna JSONB para extras. Melhor dos dois mundos.</p>", level: "pleno" },
    ],
    resources: [
      { title: "PostgreSQL docs", url: "https://www.postgresql.org/docs/", kind: "docs" },
      { title: "Use The Index, Luke", url: "https://use-the-index-luke.com/", kind: "artigo" },
      { title: "EXPLAIN ANALYZE — pganalyze", url: "https://pganalyze.com/docs/explain", kind: "artigo" },
    ],
  },

  // ─── P2 faltantes ──────────────────────────────────────────────────────────

  "swagger": {
    tagline: "Especificação OpenAPI + UI interativa para documentar e testar APIs REST.",
    why: "Toda empresa com API externa ou times separados de front/back espera documentação OpenAPI. Saber gerar, manter e versionar specs é expectativa básica de sênior backend.",
    summary: "Swagger é o conjunto de ferramentas ao redor do padrão OpenAPI Specification (OAS). O OAS é um formato YAML/JSON que descreve endpoints, parâmetros, schemas de request/response, autenticação e exemplos. Swagger UI renderiza a spec como UI interativa para testar. Em NestJS: @nestjs/swagger gera spec automaticamente via decorators. Em Express: swagger-jsdoc ou spec manual.",
    keypoints: [
      { title: "OpenAPI Specification", body: "Formato YAML/JSON com paths, components/schemas, securitySchemes. Versão 3.x é o padrão atual. Descreve contratos de API de forma legível por máquina e humanos." },
      { title: "NestJS + @nestjs/swagger", body: "@ApiProperty em DTOs gera schemas. @ApiResponse, @ApiOperation em controllers gera docs de endpoints. SwaggerModule.setup() sobe a UI em /api." },
      { title: "Code-first vs spec-first", body: "Code-first: decorators geram spec automaticamente (NestJS, FastAPI). Spec-first: escreve OAS manualmente e gera código (client SDKs, mocks). Spec-first tem contrato mais explícito." },
      { title: "Security schemes", body: "bearerAuth (JWT), apiKey, oauth2, openIdConnect. Definidos em components/securitySchemes e referenciados por endpoint ou globalmente." },
      { title: "Geração de client SDK", body: "openapi-generator-cli gera clientes em qualquer linguagem a partir da spec. Reduz integração manual entre times." },
    ],
    gotchas: [
      "Swagger UI em produção sem auth — expõe docs completos e permite testar a API. Proteja com auth ou desabilite em prod.",
      "DTO sem @ApiProperty — campos não aparecem no schema gerado.",
      "Spec desatualizada — code-first desatualiza automaticamente, spec manual fica stale. Adicione validação no CI.",
      "Exemplos sem dados realistas — torna a doc inútil para quem vai consumir.",
    ],
    interview: [
      { q: "Qual a diferença entre Swagger e OpenAPI?", a: "<p>OpenAPI Specification (OAS) é o padrão aberto que descreve APIs REST em YAML/JSON. Swagger era o nome original (criado pela SmartBear) antes de ser doado à Linux Foundation como OpenAPI.</p><p>Hoje 'Swagger' se refere às ferramentas (Swagger UI, Swagger Editor, Swagger Codegen) enquanto o padrão se chama OpenAPI.</p>" },
      { q: "Como garantiria que a documentação está sempre atualizada?", a: "<p>Code-first (NestJS + @nestjs/swagger, FastAPI): spec gerada automaticamente em build — nunca fica stale. Adicione um teste no CI que gera a spec e verifica diff contra a spec commitada.</p><p>Spec-first: use ferramentas como Spectral para lint da spec e openapi-diff para detectar breaking changes em PRs.</p>" },
    ],
    resources: [
      { title: "OpenAPI Specification", url: "https://spec.openapis.org/oas/latest.html", kind: "docs" },
      { title: "NestJS Swagger", url: "https://docs.nestjs.com/openapi/introduction", kind: "docs" },
    ],
  },

  "drizzle": {
    tagline: "ORM TypeScript SQL-first, leve e type-safe, emergindo como alternativa ao Prisma.",
    why: "Drizzle está crescendo rapidamente como alternativa ao Prisma para quem quer mais controle sobre SQL com type-safety. Aparece em vagas que usam stack moderna TS.",
    summary: "Drizzle ORM é SQL-first: você define o schema em TypeScript e o client gerado reflete exatamente esse schema com tipos precisos. Não tem um runtime pesado — é essencialmente um query builder type-safe. Suporta PostgreSQL, MySQL, SQLite. Migrations via drizzle-kit. Ponto forte: zero overhead em runtime, queries próximas ao SQL, bundle size pequeno (bom para edge/serverless).",
    keypoints: [
      { title: "Schema definition", body: "Tabelas definidas com pgTable(), mysqlTable(), etc. Colunas tipadas: text(), integer(), timestamp(). Relações declaradas com relations()." },
      { title: "Query API", body: "db.select().from(users).where(eq(users.id, 1)). Type-safe: tipos inferidos do schema. Alternativa: SQL template tag para queries arbitrárias." },
      { title: "Drizzle-kit migrations", body: "drizzle-kit generate cria SQL de migration. drizzle-kit push para desenvolvimento rápido (sem arquivo de migration). Similar ao Prisma migrate." },
      { title: "Edge runtime", body: "Bundle pequeno e sem dependências nativas — funciona em Cloudflare Workers, Vercel Edge, Bun. Prisma tem problemas nesses ambientes." },
      { title: "Prisma vs Drizzle", body: "Prisma: melhor DX, schema mais legível, ecossistema maior. Drizzle: mais leve, SQL mais explícito, edge-friendly, crescendo rapidamente." },
    ],
    gotchas: [
      "Relations em Drizzle são apenas para query API — não criam foreign keys no banco. Declare FK separadamente.",
      "drizzle-kit push em produção — aplica mudanças direto sem migration file. Use generate + migrate em prod.",
      "Ecosistema menor que Prisma — menos plugins e exemplos disponíveis.",
    ],
    interview: [
      { q: "Quando escolheria Drizzle em vez de Prisma?", a: "<p>Drizzle: edge runtime (Cloudflare Workers, Vercel Edge), bundle size crítico, queremos SQL mais explícito, projeto novo com time que prefere SQL-first.</p><p>Prisma: DX prioridade, equipe menos familiarizada com SQL, ecossistema maduro importante, NestJS com integração profunda.</p><p>Em 2025, ambos são opções válidas — Drizzle está amadurecendo rapidamente.</p>" },
    ],
    resources: [
      { title: "Drizzle docs", url: "https://orm.drizzle.team/docs/overview", kind: "docs" },
    ],
  },

  "sequelize": {
    tagline: "ORM Node.js maduro com suporte a MySQL, PostgreSQL, SQLite e MSSQL.",
    why: "Sequelize ainda aparece em projetos legados Node.js. Saber que ele existe, seus trade-offs e quando migrar para Prisma/Drizzle é conhecimento esperado.",
    summary: "Sequelize é um ORM maduro para Node.js com suporte a múltiplos bancos. Usa o padrão Active Record. Tem migrations, associações (hasMany, belongsTo, etc.), hooks (beforeCreate, afterUpdate) e validações. Amplamente usado em projetos legados. Em novos projetos, Prisma e Drizzle são escolhas mais modernas.",
    keypoints: [
      { title: "Models e associações", body: "Model.init() define colunas e tipos. Associações: hasOne, hasMany, belongsTo, belongsToMany. include na query faz eager loading (JOIN)." },
      { title: "Migrations", body: "sequelize-cli gera migration files. up() e down() para aplicar e reverter. queryInterface para DDL direto." },
      { title: "Hooks", body: "beforeCreate, afterCreate, beforeUpdate, etc. Para audit log, hash de senha, validações assíncronas." },
      { title: "Transactions", body: "sequelize.transaction(async (t) => { ... }). Passa t como option para cada operação para incluí-la na transação." },
    ],
    gotchas: [
      "N+1 sem include — cada item faz query separada. Sempre use include para relações.",
      "sync({ force: true }) em produção — dropa e recria tabelas. Nunca em prod.",
      "Tipos inconsistentes — Sequelize não tem type-safety nativa como Prisma. Considere sequelize-typescript.",
    ],
    interview: [
      { q: "Sequelize vs Prisma — qual você prefere para novo projeto?", a: "<p>Prisma para novos projetos: melhor type-safety, schema declarativo mais legível, migrations mais confiáveis, DX superior. Sequelize para manter projetos legados que já o usam — migrar ORM tem custo alto e risco.</p>" },
    ],
    resources: [
      { title: "Sequelize docs", url: "https://sequelize.org/docs/v6/", kind: "docs" },
    ],
  },

  "jwt": {
    tagline: "JSON Web Token — token stateless para autenticação e autorização em APIs.",
    why: "JWT é o mecanismo de auth mais comum em APIs REST. Saber estrutura, assinatura, validação, refresh tokens e os gotchas de segurança é obrigatório para qualquer backend.",
    summary: "JWT (JSON Web Token) é um token compacto e autocontido que carrega claims (dados) assinados. Composto por três partes em Base64url separadas por ponto: header (algoritmo), payload (claims) e assinatura. Stateless: o servidor não precisa armazenar sessões — valida apenas a assinatura. Riscos: token roubado é válido até expirar, alg:none attack, fraqueza no secret.",
    keypoints: [
      { title: "Estrutura", body: "header.payload.signature. Header: {alg: 'HS256', typ: 'JWT'}. Payload: {sub, iat, exp, roles}. Signature: HMAC-SHA256(base64(header)+'.'+base64(payload), secret)." },
      { title: "Claims padrão", body: "iss (issuer), sub (subject), aud (audience), exp (expiration), iat (issued at), nbf (not before). Adicione claims customizados no payload conforme necessário." },
      { title: "Algoritmos", body: "HS256 (HMAC com secret compartilhado): simples, mesmo secret para assinar e verificar. RS256 (RSA): chave privada assina, chave pública verifica. RS256 ideal para microserviços (share só a pública)." },
      { title: "Refresh token pattern", body: "Access token: vida curta (15min). Refresh token: vida longa (7-30d), armazenado em httpOnly cookie, usado só para gerar novo access token. Balanceia segurança e UX." },
      { title: "Revogação", body: "JWT stateless não pode ser revogado antes de expirar sem estado server-side. Soluções: access token curto, blocklist de JTI (JWT ID) no Redis, ou Session tokens." },
      { title: "Onde armazenar no cliente", body: "localStorage: simples mas vulnerável a XSS. httpOnly cookie: imune a XSS, mas requer CSRF protection (SameSite=Strict ou double-submit cookie). httpOnly cookie é o padrão recomendado." },
    ],
    gotchas: [
      "alg:none attack — biblioteca que aceita 'none' como algoritmo valida token sem assinatura. Use bibliotecas que rejeitam alg:none por default.",
      "Secret fraco ou hardcoded — brute-force possível. Use secrets longos e aleatórios, rotativos.",
      "Payload com dados sensíveis — payload é Base64, não cifrado. Qualquer um pode decodificar. Não coloque senha, PII desnecessário.",
      "exp muito longo — token roubado fica válido por horas/dias. Access token deve ter vida curta.",
      "Não validar aud e iss — token de outro serviço aceito como válido.",
    ],
    interview: [
      { q: "JWT vs Session — quando usar cada?", a: "<p>JWT: APIs stateless, microserviços, mobile (sem cookie nativo), múltiplos domínios. Sem necessidade de estado no servidor.</p><p>Session: apps web tradicionais, quando revogação imediata é necessária (logout instantâneo), quando payload é grande (não quer carregar no token).</p><p>Na prática: APIs usam JWT com access token curto + refresh token em httpOnly cookie. Isso combina stateless com capacidade de revogação.</p>", level: "pleno" },
      { q: "Como implementaria logout seguro com JWT?", a: "<p>Problema: JWT é stateless — não há como 'invalidar' um token antes de expirar.</p><p>Solução 1: access token com vida muito curta (5-15min) + refresh token revogável. No logout, revoga o refresh token. O access token expira sozinho em breve.</p><p>Solução 2: blocklist de JTI (JWT ID) no Redis. No logout, adiciona o JTI na blocklist. Cada request verifica se JTI está na blocklist. Reintroduz estado, mas permite revogação instantânea.</p>", level: "senior" },
      { q: "O que é o alg:none attack?", a: "<p>Algumas implementações antigas de JWT aceitam 'none' como algoritmo de assinatura. Um atacante pode pegar um token legítimo, modificar o payload, mudar o alg para 'none' e remover a assinatura — e o servidor aceita como válido.</p><p>Prevenção: use bibliotecas modernas (jsonwebtoken no Node) que rejeitam alg:none por default. Sempre especifique os algoritmos aceitos explicitamente na verificação.</p>", level: "senior" },
      { q: "Qual a diferença entre HS256 e RS256?", a: "<p>HS256 (HMAC): mesmo secret para assinar e verificar. Simples. Problema: todos os serviços que precisam verificar o token precisam ter o secret — mais surface de ataque.</p><p>RS256 (RSA): chave privada assina (só o auth server tem), chave pública verifica (qualquer serviço pode ter). Ideal para microserviços — distribuí a pública, protegeu a privada. Padrão para OAuth 2.0 e OIDC.</p>", level: "senior" },
    ],
    resources: [
      { title: "jwt.io — debugger e docs", url: "https://jwt.io/", kind: "docs" },
      { title: "Auth0 — JWT Security", url: "https://auth0.com/docs/secure/tokens/json-web-tokens", kind: "artigo" },
    ],
  },

  "oauth-2-0": {
    tagline: "Protocolo de autorização delegada — permite que apps acessem recursos em nome do usuário.",
    why: "OAuth 2.0 é a base de 'Login com Google/GitHub' e APIs de terceiros. Saber os fluxos (flows), tokens e as armadilhas de segurança é esperado em qualquer vaga com auth.",
    summary: "OAuth 2.0 é um framework de autorização (não autenticação) que permite que uma aplicação acesse recursos de outra em nome de um usuário, sem compartilhar a senha. Define roles (Resource Owner, Client, Authorization Server, Resource Server) e flows: Authorization Code (web/mobile), Client Credentials (server-to-server), Device Flow. OpenID Connect (OIDC) é uma camada de identidade sobre OAuth 2.0.",
    keypoints: [
      { title: "Roles", body: "Resource Owner: usuário. Client: aplicação que pede acesso. Authorization Server: emite tokens (Google, GitHub, Auth0). Resource Server: API que protege recursos." },
      { title: "Authorization Code Flow", body: "1. Client redireciona usuário para AS com client_id, redirect_uri, scope, state. 2. Usuário autentica e autoriza. 3. AS redireciona com code. 4. Client troca code por access_token (server-side, seguro). 5. Client usa access_token para acessar Resource Server." },
      { title: "PKCE", body: "Proof Key for Code Exchange: extensão do Authorization Code Flow para clientes públicos (mobile, SPA). code_verifier gerado pelo client, code_challenge (hash) enviado no início. Evita interception attack mesmo sem client_secret." },
      { title: "Client Credentials Flow", body: "Server-to-server: client envia client_id + client_secret, recebe access_token. Sem usuário envolvido. Ideal para microserviços e integrações M2M." },
      { title: "Scopes", body: "Permissões granulares que o client solicita: read:users, write:orders. Usuário aprova na tela de consentimento. Resource Server valida se token tem o scope necessário." },
      { title: "OpenID Connect", body: "OIDC adiciona autenticação sobre OAuth 2.0. Retorna ID Token (JWT com identidade do usuário) além do access_token. UserInfo endpoint para dados do perfil. Base do 'Login com Google'." },
    ],
    gotchas: [
      "Usar Implicit Flow em 2025 — obsoleto e inseguro. Use Authorization Code + PKCE.",
      "Não validar state — vulnerável a CSRF no fluxo OAuth.",
      "Client secret em código front-end — exposto. Use PKCE para clientes públicos.",
      "Confundir OAuth (autorização) com autenticação — OAuth não prova identidade. Use OIDC para identidade.",
      "Token sem escopo mínimo (least privilege) — client pede mais permissão do que precisa.",
    ],
    interview: [
      { q: "Qual a diferença entre OAuth 2.0 e OpenID Connect?", a: "<p>OAuth 2.0 é sobre autorização: permite que um client acesse recursos em nome de um usuário. O access_token é opaco — diz 'você pode fazer X', mas não 'quem é você'.</p><p>OpenID Connect (OIDC) é uma camada de identidade sobre OAuth 2.0. Adiciona o ID Token (JWT com claims de identidade: sub, email, name) e o UserInfo endpoint. OIDC responde 'quem é o usuário'. OAuth responde 'o que ele pode fazer'.</p>", level: "senior" },
      { q: "Por que usar PKCE mesmo em apps server-side?", a: "<p>PKCE foi criado para clientes públicos (mobile, SPA) que não podem guardar client_secret com segurança. Mas em 2023, as melhores práticas (OAuth 2.1 draft) recomendam PKCE para todos os flows, incluindo server-side.</p><p>Razão: PKCE protege contra authorization code interception mesmo que alguém intercepte o code de redirecionamento — sem o code_verifier original, o code é inútil.</p>", level: "senior" },
    ],
    resources: [
      { title: "OAuth 2.0 — RFC 6749", url: "https://datatracker.ietf.org/doc/html/rfc6749", kind: "docs" },
      { title: "Auth0 — OAuth 2.0 Flows", url: "https://auth0.com/docs/get-started/authentication-and-authorization-flow", kind: "artigo" },
      { title: "OAuth 2.1 Draft", url: "https://oauth.net/2.1/", kind: "docs" },
    ],
  },

  "nextauth-auth-js": {
    tagline: "Biblioteca de autenticação plug-and-play para Next.js com suporte a OAuth, email e credenciais.",
    why: "NextAuth (renomeado Auth.js) é o padrão de facto para autenticação em apps Next.js. Saber configurar providers, callbacks e adapters é esperado em vagas com Next.js no stack.",
    summary: "Auth.js (anteriormente NextAuth.js) é uma biblioteca de autenticação para frameworks JavaScript (Next.js, SvelteKit, Astro). Oferece integração simples com provedores OAuth (Google, GitHub, etc.), autenticação por email (magic link), e credenciais customizadas. Usa sessions (JWT ou database) com adapters para banco de dados (Prisma, Drizzle, etc.).",
    keypoints: [
      { title: "Providers", body: "OAuth providers prontos: Google, GitHub, Discord, etc. CredentialsProvider para login email/senha customizado. EmailProvider para magic link." },
      { title: "Session strategy", body: "jwt (default): session armazenada no token httpOnly — sem banco necessário. database: session armazenada no banco via adapter — mais segura, revogação imediata." },
      { title: "Callbacks", body: "jwt(): customizar o token JWT (adicionar claims). session(): customizar o objeto session (expor dados ao client). signIn(): controlar se login é permitido." },
      { title: "Adapters", body: "PrismaAdapter, DrizzleAdapter, etc. Persiste users, accounts, sessions e verification tokens no banco. Necessário para strategy database e para persistir perfis OAuth." },
      { title: "Proteção de rotas", body: "getServerSession() em Server Components/API routes. middleware.ts com auth() para proteger grupos de rotas no App Router." },
    ],
    gotchas: [
      "NEXTAUTH_SECRET fraco ou ausente em produção — sessões comprometidas.",
      "CredentialsProvider sem strategy database — logout não revoga sessão (JWT fica válido até expirar).",
      "Callbacks jwt e session desalinhados — dados adicionados em jwt não aparecem em session sem repassar.",
      "Adapter sem migrations rodando — tabelas de auth não criadas, erros em runtime.",
    ],
    interview: [
      { q: "Quando usar strategy jwt vs database no NextAuth?", a: "<p>jwt: simples, sem banco necessário para sessões, bom para apps pequenos e protótipos. Contras: logout não revoga sessão até o token expirar.</p><p>database: revogação imediata de sessão (logout real), audit log de sessões ativas, necessário quando segurança é prioridade. Requer adapter e banco de dados configurado.</p>" },
    ],
    resources: [
      { title: "Auth.js docs", url: "https://authjs.dev/", kind: "docs" },
      { title: "NextAuth.js docs (v4)", url: "https://next-auth.js.org/", kind: "docs" },
    ],
  },

  "bullmq": {
    tagline: "Fila de jobs Redis-based para Node.js — processamento assíncrono, retry, prioridade.",
    why: "Processamento assíncrono com filas é padrão em qualquer sistema de produção. BullMQ é o padrão no ecossistema Node/NestJS para jobs, agendamento e workflows.",
    summary: "BullMQ é uma biblioteca Node.js para filas de jobs e mensagens baseada em Redis. Permite desacoplar trabalho pesado ou não-crítico do path crítico de uma request HTTP: envio de email, geração de relatório, processamento de imagem, integração com terceiros. Suporta retry com backoff, prioridade, jobs atrasados, rate limiting de workers, e workflows (parent-child jobs).",
    keypoints: [
      { title: "Queue e Worker", body: "Queue: publica jobs. Worker: consome e processa. Um worker pode ter N concurrency. Múltiplos workers escalam horizontalmente." },
      { title: "Job options", body: "attempts: quantas tentativas em caso de falha. backoff: delay entre tentativas (fixed, exponential). delay: tempo antes de processar. priority: 1 (alta) a N (baixa)." },
      { title: "Events e monitoramento", body: "Queue e Worker emitem eventos: completed, failed, progress, stalled. Integra com Bull Board (UI) para monitorar filas em tempo real." },
      { title: "Repeated jobs (cron)", body: "addJob com repeat: { pattern: '0 * * * *' } para jobs recorrentes. Substitui cron jobs externos para tarefas que precisam de retry e visibilidade." },
      { title: "Fluxos (parent-child)", body: "Job pai cria jobs filhos. Pai só completa quando todos os filhos completam. Útil para workflows paralelos com dependência." },
      { title: "NestJS integration", body: "@nestjs/bullmq adiciona módulo com DI. @Processor() e @OnWorkerEvent() para workers declarativos. Injeção de qualquer provider no worker." },
    ],
    gotchas: [
      "Redis sem persistência (appendonly no) — jobs perdidos em restart do Redis.",
      "Worker sem concurrency configurada — processa 1 job por vez. Configure concurrency baseado no trabalho (I/O: alto, CPU: igual ao número de cores).",
      "Sem dead letter queue — jobs que falham todas as tentativas somem silenciosamente. Monitore o evento 'failed'.",
      "Job muito grande no payload — Redis tem limite de memória. Para arquivos grandes, armazene no S3 e passe só a referência no job.",
      "Worker sem graceful shutdown — jobs em processamento interrompidos em deploy. Use worker.close() no SIGTERM.",
    ],
    interview: [
      { q: "Por que usar fila em vez de processar direto no request handler?", a: "<p>Desacopla latência: o handler responde 202 Accepted imediatamente e o trabalho acontece em background. O usuário não espera o email ser enviado ou o PDF gerado.</p><p>Resiliência: se o job falha (terceiro fora, timeout), retry automático. Sem fila, o erro vai para o usuário e não há retry.</p><p>Escalabilidade: workers podem escalar independentemente do servidor HTTP.</p>" },
      { q: "Como garantiria que um job crítico não se perde?", a: "<p>Redis com persistência habilitada (appendonly yes + AOF). Attempts e backoff configurados no job. Monitor de jobs 'failed' com alerta. Dead letter queue para jobs que esgotaram tentativas.</p><p>Para crítico demais para depender de Redis: considere transactional outbox — persiste o job no banco na mesma transação do negócio, e um worker lê do banco para enfileirar no BullMQ.</p>", level: "senior" },
    ],
    resources: [
      { title: "BullMQ docs", url: "https://docs.bullmq.io/", kind: "docs" },
      { title: "Bull Board (UI)", url: "https://github.com/felixmosh/bull-board", kind: "pratica" },
    ],
  },

  "rabbitmq": {
    tagline: "Message broker AMQP — roteamento flexível de mensagens com exchanges e queues.",
    why: "RabbitMQ é amplamente usado para comunicação assíncrona entre microserviços. Saber exchanges, bindings, routing keys e garantia de entrega diferencia sênior de pleno em arquitetura de sistemas.",
    summary: "RabbitMQ é um message broker que implementa o protocolo AMQP. Produtores publicam mensagens em exchanges, que as roteiam para queues via bindings e routing keys. Consumidores leem das queues. Tipos de exchange: direct (routing key exata), fanout (broadcast), topic (wildcard), headers. Suporta ack manual, dead letter queues, TTL de mensagem, e persistência.",
    keypoints: [
      { title: "Modelo de roteamento", body: "Producer → Exchange → Binding → Queue → Consumer. Exchange decide para qual(is) queue(s) rotear baseado no tipo e routing key." },
      { title: "Exchange types", body: "Direct: routing key exata. Fanout: broadcast para todas as queues ligadas. Topic: wildcards (* = uma palavra, # = zero ou mais). Headers: roteamento por headers da mensagem." },
      { title: "Acknowledgments", body: "ack manual: consumer confirma processamento antes de AMQP remover a mensagem. Sem ack, mensagem volta para queue em caso de falha do consumer (at-least-once delivery)." },
      { title: "Dead Letter Exchange", body: "DLX recebe mensagens rejeitadas (nack), com TTL expirado, ou queue cheia. Permite inspecionar e reprocessar mensagens problemáticas." },
      { title: "Persistência", body: "Exchange e queue durable: sobrevivem a restart do broker. Mensagem persistent: gravada em disco. Ambos necessários para não perder mensagens." },
    ],
    gotchas: [
      "Consumer sem ack manual — mensagem removida antes de processar. Em falha, dado perdido.",
      "Queue sem DLX — mensagens rejeitadas ou expiradas somem sem rastro.",
      "Exchange e queue não-durable — perdidos em restart do RabbitMQ.",
      "Prefetch sem configurar — consumer recebe todas as mensagens pendentes de uma vez, saturando memória.",
      "Sem monitoramento de queue depth — queue cresce indefinidamente sem alerta.",
    ],
    interview: [
      { q: "RabbitMQ vs Kafka — quando usar cada?", a: "<p>RabbitMQ: roteamento complexo (múltiplos consumidores com regras diferentes), task queue (job processing), quando mensagens devem ser removidas após consumo, latência baixa prioritária.</p><p>Kafka: event log imutável, replay de eventos, alta throughput (milhões de msgs/s), múltiplos consumidores independentes lendo o mesmo evento em tempos diferentes, event sourcing.</p><p>RabbitMQ é mais simples de operar; Kafka é mais poderoso para event streaming.</p>", level: "senior" },
      { q: "O que é at-least-once delivery e quando é problemático?", a: "<p>At-least-once: o broker garante que a mensagem é entregue pelo menos uma vez. Em falha de rede, a mensagem pode ser reentregue. O consumer pode processar o mesmo evento duas vezes.</p><p>Problemático em operações não-idempotentes: débito bancário duplicado, email enviado duas vezes. Solução: idempotency key — consumer verifica se já processou a mensagem antes de agir (usando o message ID no banco ou cache).</p>", level: "senior" },
    ],
    resources: [
      { title: "RabbitMQ docs", url: "https://www.rabbitmq.com/documentation.html", kind: "docs" },
      { title: "CloudAMQP — RabbitMQ tutorials", url: "https://www.cloudamqp.com/blog/part1-rabbitmq-for-beginners-what-is-rabbitmq.html", kind: "artigo" },
    ],
  },

  "apache-kafka": {
    tagline: "Plataforma de streaming distribuído — log imutável, alta throughput, replay de eventos.",
    why: "Kafka é o backbone de dados em empresas com escala. CDC, event sourcing, analytics em tempo real e integração de microserviços passam por Kafka. Saber o modelo mental e os trade-offs é esperado em vaga sênior de backend.",
    summary: "Apache Kafka é uma plataforma de streaming distribuído baseada em log. Produtores publicam em topics, divididos em partitions distribuídas entre brokers. Consumidores leem em grupos (consumer groups). Mensagens são imutáveis e retidas por período configurável — permite replay. Alta throughput (milhões de msgs/s). Casos de uso: event sourcing, CDC, stream processing, audit log, integração de microserviços.",
    keypoints: [
      { title: "Topics e Partitions", body: "Topic é o canal lógico. Cada topic é dividido em N partitions. Partitions distribuídas entre brokers para escala. Mensagens dentro de uma partition são ordenadas — entre partitions, não." },
      { title: "Producer e Consumer Groups", body: "Producer escolhe partition (por key ou round-robin). Consumer Group: cada partition é consumida por exatamente um consumer no grupo. Adicionar consumers no grupo aumenta paralelismo até o número de partitions." },
      { title: "Offsets e replay", body: "Cada mensagem tem offset (posição na partition). Consumer group guarda qual offset foi processado. Para replay: reset o offset para o início. Mensagens ficam até o retention period." },
      { title: "Replication", body: "Cada partition tem N réplicas (replication factor). Uma é leader (recebe writes), outras são followers (ISR — in-sync replicas). Em falha do leader, um follower vira leader automaticamente." },
      { title: "Exactly-once semantics", body: "Kafka suporta exactly-once com idempotent producers + transações. Complexo de implementar end-to-end. At-least-once é mais comum e aceito com idempotency no consumer." },
      { title: "Schema Registry", body: "Confluentplatform: schemas Avro/Protobuf versionados. Producer e consumer usam schema compatível. Evita breaking changes nos eventos." },
    ],
    gotchas: [
      "Partition key mal escolhida — todas as mensagens no mesmo partition, paralelismo zero.",
      "Consumer group com mais consumers que partitions — consumers extras ficam ociosos.",
      "Retention period curto — replay impossível após o período.",
      "Mensagem grande (>1MB) — degrada performance. Armazene payload grande no S3, envie referência no evento.",
      "Kafka sem monitoramento de consumer lag — grupo atrasado não detectado, dado processado com horas de delay.",
    ],
    interview: [
      { q: "Por que mensagens dentro de uma partition são ordenadas, mas entre partitions não?", a: "<p>Kafka garante ordem dentro de uma partition porque as mensagens são escritas em log sequencial e consumidas em ordem de offset. Cada partition tem um único writer (leader) em um dado momento.</p><p>Entre partitions não há coordenação — cada partition progride independentemente. Para garantir ordem global de um cliente específico (ex: todos os eventos do usuário X na ordem certa), use a user ID como partition key — todos os eventos do mesmo usuário caem na mesma partition.</p>", level: "senior" },
      { q: "O que é consumer lag e por que monitorar?", a: "<p>Consumer lag é a diferença entre o último offset produzido e o último offset consumido pelo consumer group. Lag crescente significa que o consumer não está processando rápido o suficiente.</p><p>Impacto: dados processados com atraso crescente. Em streaming de eventos financeiros ou notificações, isso significa delay de horas para o usuário final.</p><p>Monitorar com Kafka consumer group describe ou ferramentas como Confluent Control Center, Burrow, ou métricas Prometheus.</p>", level: "senior" },
    ],
    resources: [
      { title: "Apache Kafka docs", url: "https://kafka.apache.org/documentation/", kind: "docs" },
      { title: "Confluent — Kafka fundamentals", url: "https://developer.confluent.io/courses/apache-kafka/events/", kind: "curso" },
    ],
  },

  "cdc-debezium": {
    tagline: "Change Data Capture — captura mudanças no banco de dados como eventos em tempo real.",
    why: "CDC com Debezium é a solução padrão para sincronizar dados entre sistemas sem polling. Aparece em stacks de data engineering, microserviços e event-driven architecture.",
    summary: "CDC (Change Data Capture) captura INSERT/UPDATE/DELETE no banco de dados e publica como eventos em tempo real. Debezium é o CDC open-source mais popular: lê o WAL (Write-Ahead Log) do PostgreSQL, binlog do MySQL, etc., e publica eventos no Kafka. Casos de uso: sincronizar banco com Elasticsearch, popular cache, audit log imutável, replicação de dados entre sistemas.",
    keypoints: [
      { title: "Como funciona", body: "Debezium lê o transaction log do banco (WAL no Postgres, binlog no MySQL) — não faz queries. Cada mudança gera um evento com before e after da linha." },
      { title: "Evento CDC", body: "Payload: op (c=create, u=update, d=delete, r=read/snapshot), before (estado anterior), after (estado novo), source (ts, table, lsn/offset)." },
      { title: "Connectors", body: "Debezium tem connectors para PostgreSQL, MySQL, MongoDB, Oracle, SQL Server. Roda como Kafka Connect connector." },
      { title: "Replication slots", body: "PostgreSQL: Debezium usa replication slot. Cuidado: replication slot retém WAL até o consumer processar — disco pode encher se Debezium ficar offline." },
      { title: "Casos de uso", body: "Sincronização Postgres → Elasticsearch para busca. Invalidação de cache quando dado muda. Audit log de todas as mudanças. Replicação para data warehouse." },
    ],
    gotchas: [
      "Replication slot de PostgreSQL sem consumidor ativo — WAL acumula, disco enche, banco trava.",
      "Schema evolution sem cuidado — mudança de coluna no banco quebra o consumer do evento.",
      "Snapshot inicial lento — tabelas grandes geram snapshot enorme antes de iniciar streaming.",
      "Event ordering em múltiplos processos — mesmo com Kafka, mudanças em tabelas diferentes não têm ordem global garantida.",
    ],
    interview: [
      { q: "Por que CDC é melhor que polling para sincronizar dados?", a: "<p>Polling: SELECT WHERE updated_at > last_check. Problemas: latência (depende do intervalo), deletes não capturados, sobrecarga no banco com queries frequentes, dados podem ser perdidos se updated_at não for confiável.</p><p>CDC: captura evento no momento da mudança no transaction log. Latência de milissegundos, captura deletes, zero sobrecarga de leitura no banco primário, ordenação garantida por log.</p>", level: "senior" },
    ],
    resources: [
      { title: "Debezium docs", url: "https://debezium.io/documentation/", kind: "docs" },
      { title: "PostgreSQL CDC com Debezium — tutorial", url: "https://debezium.io/documentation/reference/stable/connectors/postgresql.html", kind: "docs" },
    ],
  },

  "bash": {
    tagline: "Shell scripting Unix — automação de tarefas, pipelines e administração de servidores.",
    why: "Bash é indispensável para DevOps, CI/CD, automação de deploy e administração de servidores Linux. Qualquer backend sênior precisa escrever e ler scripts Bash com confiança.",
    summary: "Bash (Bourne Again Shell) é o shell padrão em Linux e macOS. Usado para scripting de automação: CI/CD pipelines, deploy scripts, cron jobs, manipulação de arquivos e texto, administração de servidor. Conceitos essenciais: variáveis, condicionais, loops, funções, pipes, redirecionamento, expressões regulares com grep/sed/awk.",
    keypoints: [
      { title: "Variáveis e expansão", body: "VAR=valor (sem espaço). $VAR para usar. ${VAR:-default} para fallback. $(comando) para substituição de comando. Aspas duplas preservam espaço, aspas simples são literais." },
      { title: "Exit codes e set -e", body: "0 = sucesso, não-zero = erro. $? captura último exit code. set -e: script para em qualquer erro. set -u: erro em variável não definida. set -o pipefail: erro em pipe capturado." },
      { title: "Condicionais", body: "if [ condição ]; then ... fi. [[ ]] é mais moderno e robusto. -f arquivo existe, -d diretório, -z string vazia, -n string não-vazia. Operadores: -eq, -ne, -lt para números." },
      { title: "Loops", body: "for item in lista; do ... done. while [ condição ]; do ... done. for f in *.log; do gzip $f; done. Iterar sobre output: while IFS= read -r line; do ..." },
      { title: "Pipes e redirecionamento", body: "cmd1 | cmd2: stdout de cmd1 é stdin de cmd2. > arquivo: redireciona stdout. >> appenda. 2>&1: redireciona stderr para stdout. /dev/null descarta output." },
      { title: "grep, sed, awk", body: "grep -E 'pattern' file: busca regex. sed 's/old/new/g' file: substituição. awk '{print $2}' file: processa colunas. Tríade de manipulação de texto." },
    ],
    gotchas: [
      "Espaço em volta do = em variável — VAR = valor causa erro. Deve ser VAR=valor.",
      "Sem set -euo pipefail — script continua após erro silenciosamente.",
      "Aspas esquecidas em variável — $VAR sem aspas causa word splitting. Sempre \"$VAR\".",
      "rm -rf $DIR quando $DIR está vazio — rm -rf / ou rm -rf /var/log/. Use set -u.",
      "Script sem shebang (#!/bin/bash) — comportamento depende do shell padrão do sistema.",
    ],
    interview: [
      { q: "O que faz set -euo pipefail e por que usar?", a: "<p>-e: interrompe o script em qualquer comando que retorne exit code não-zero. Evita continuar após erro silencioso.<br>-u: erro ao usar variável não definida. Previne bugs por typo em nome de variável.<br>-o pipefail: o exit code de um pipe é o do primeiro comando que falhou, não do último. Sem isso, grep -v | comando falha silenciosamente.<br>Coloque no início de todo script de produção.</p>" },
      { q: "Como depuraria um script Bash com falha intermitente?", a: "<p>bash -x script.sh: imprime cada comando antes de executar (xtrace). Adicionar set -x em seções específicas. Logar variáveis com echo ou printf para stderr. Verificar exit codes com $? após comandos suspeitos. Usar trap ERR para capturar onde o erro ocorre.</p>" },
    ],
    resources: [
      { title: "Bash Reference Manual", url: "https://www.gnu.org/software/bash/manual/bash.html", kind: "docs" },
      { title: "ShellCheck — linter de scripts", url: "https://www.shellcheck.net/", kind: "pratica" },
      { title: "The Art of Command Line", url: "https://github.com/jlevy/the-art-of-command-line", kind: "artigo" },
    ],
  },

  // ─── P3 — tratamento mínimo ────────────────────────────────────────────────

  "php": {
    tagline: "Linguagem server-side dominante na web por décadas — base do Laravel e WordPress.",
    why: "PHP ainda alimenta uma fração enorme da web. Saber o básico ajuda a manter sistemas legados e entender o ecossistema Laravel.",
    gotchas: [
      "Comparação com == em PHP tem coerção de tipos surpreendente — use === sempre.",
      "register_globals e magic_quotes eram vetores de injeção em PHP antigo — código legado pode ter essas vulnerabilidades.",
      "PHP tem estado compartilhado entre requests quando usando OPcache — variáveis globais e estáticas podem vazar.",
    ],
  },

  "eloquent": {
    tagline: "ORM ActiveRecord do Laravel — simples, expressivo e integrado ao ecossistema PHP.",
    why: "Eloquent é inseparável do Laravel. Saber relações, eager loading e scopes é obrigatório em qualquer vaga Laravel.",
    gotchas: [
      "N+1 sem with() — cada item da coleção faz uma query. Use with('relation') sempre.",
      "Mass assignment sem $fillable — create(request->all()) pode sobrescrever campos sensíveis como is_admin.",
      "Soft delete sem considerar nas queries — withTrashed() necessário para incluir deletados.",
    ],
  },

  "sanctum": {
    tagline: "Autenticação leve do Laravel para SPAs e APIs mobile — tokens e cookies.",
    why: "Sanctum é o padrão de auth para SPAs e mobile em projetos Laravel moderno. Mais simples que Passport para maioria dos casos.",
    gotchas: [
      "Confundir Sanctum com Passport — Sanctum é para SPA/mobile simples, Passport é OAuth 2.0 completo.",
      "CORS não configurado para SPA — requisições bloqueadas pelo browser.",
      "Token sem revogação manual — tokens vivem até o usuário revogar ou expirar o TTL configurado.",
    ],
  },

  "firebase-auth": {
    tagline: "Autenticação gerenciada do Firebase — OAuth social, email/senha, phone, sem backend.",
    why: "Firebase Auth é a escolha comum em protótipos e apps mobile React Native. Elimina a necessidade de implementar auth do zero.",
    gotchas: [
      "Token Firebase válido por 1h — verificar no backend com Admin SDK a cada request crítica.",
      "Sem controle sobre dados do usuário — Firebase guarda no projeto Google, não em seu banco.",
      "Vendor lock-in — migrar de Firebase Auth para outro provider exige migrar todos os usuários.",
    ],
  },

  "socket-io": {
    tagline: "Biblioteca WebSocket com fallback, rooms, namespaces e auto-reconexão.",
    why: "Socket.IO simplifica WebSocket com features de alto nível. Ainda muito usado em projetos Node.js com real-time.",
    gotchas: [
      "Overhead de protocolo vs WebSocket puro — Socket.IO usa seu próprio protocolo em cima de WS.",
      "Sticky sessions necessárias sem Redis adapter — usuários em servidores diferentes não trocam mensagens.",
      "Cliente Socket.IO não conecta com servidor WS puro — protocolos incompatíveis.",
    ],
  },

  "webhooks": {
    tagline: "HTTP callbacks para notificar sistemas externos quando eventos ocorrem.",
    why: "Webhooks são a forma padrão de integração event-driven com terceiros (Stripe, GitHub, etc.). Saber implementar receptor seguro é expectativa básica.",
    gotchas: [
      "Não verificar assinatura HMAC do webhook — qualquer um pode forjar payloads.",
      "Processar webhook de forma síncrona — se demorar, o terceiro considera timeout e reenvia. Enfileire e responda 200 imediatamente.",
      "Sem idempotency — terceiro pode reenviar o mesmo evento. Use evento ID para deduplicar.",
    ],
  },

  "apache-thrift": {
    tagline: "Framework RPC polyglota do Facebook para comunicação eficiente entre serviços.",
    why: "Thrift aparece em sistemas de grande escala legados. Conhecimento de valor em contextos com microserviços heterogêneos.",
    gotchas: [
      "Thrift não tem discovery de serviço nativo — precisa de solução externa.",
      "Schema evolution mais rígida que Protobuf — campos obrigatórios causam incompatibilidade.",
    ],
  },

  "fhir-hl7": {
    tagline: "Padrão de interoperabilidade de dados de saúde — FHIR é a versão moderna do HL7.",
    why: "Projetos de saúde digital no Brasil usam FHIR. Saber o básico do padrão é diferencial em vagas healthtech.",
    gotchas: [
      "FHIR tem versões incompatíveis (R4, R5) — confirme a versão suportada pela integração.",
      "Recursos FHIR são verbosos — performance pode ser problema em alto volume sem cache.",
    ],
  },

  "agora-io": {
    tagline: "SDK de vídeo/áudio em tempo real para apps — WebRTC gerenciado na nuvem.",
    why: "Agora.io aparece em projetos com videochamada, telemedicina e transmissão ao vivo. Conhecimento nicho mas valorizado.",
    gotchas: [
      "Custo por minuto de uso — implementações mal otimizadas geram custo alto em produção.",
      "Token com validade — tokens de canal expiram, cliente precisa renovar antes do fim da sessão.",
    ],
  },

  "stripe": {
    tagline: "Plataforma de pagamentos developer-first — APIs para cobranças, assinaturas e marketplace.",
    why: "Stripe é o padrão para pagamentos em produtos digitais globais. Implementar checkout seguro e webhooks de Stripe é skill valorizada.",
    gotchas: [
      "Processar pagamento sem verificar webhook signature — fraude possível com evento forjado.",
      "Usar amount em float — Stripe usa inteiros em centavos. 10.00 BRL = 1000 (centavos).",
      "Não lidar com idempotency keys — retries de pagamento podem cobrar duas vezes.",
    ],
  },

  "mercado-pago": {
    tagline: "Gateway de pagamentos dominante no Brasil — PIX, boleto, cartão e checkout Pro.",
    why: "Mercado Pago é o gateway de pagamentos mais usado no Brasil. Integrar PIX e checkout é expectativa em vagas de e-commerce nacional.",
    gotchas: [
      "Webhook sem validação — qualquer um pode simular notificação de pagamento aprovado.",
      "Não tratar estados intermediários — pagamento 'pending' pode virar 'approved' ou 'rejected' depois.",
      "Sandbox com comportamentos diferentes da produção — testar em produção com valores mínimos antes do go-live.",
    ],
  },

  "resend": {
    tagline: "API de email transacional moderna para desenvolvedores — React Email + entregabilidade.",
    why: "Resend é a opção moderna para email transacional em projetos Node/Next.js. Simples de integrar, melhor DX que SendGrid.",
    gotchas: [
      "Domínio sem SPF/DKIM configurado — emails caem em spam.",
      "Sem bounce handling — enviar para emails inválidos deteriora reputação do domínio.",
    ],
  },

  "leaflet": {
    tagline: "Biblioteca JavaScript de mapas interativos — leve, open-source, sem Google Maps.",
    why: "Leaflet é a alternativa open-source ao Google Maps. Aparece em projetos com geolocalização que querem evitar custo de APIs proprietárias.",
    gotchas: [
      "Leaflet sem SSR — inicialização requer window. Use dynamic import no Next.js.",
      "Tiles sem cache — requests repetidas ao tile server. Configure cache headers.",
    ],
  },

  "openstreetmap": {
    tagline: "Mapa colaborativo open-source — dados geoespaciais livres usados como base pelo Leaflet.",
    why: "OpenStreetMap é a fonte de dados geoespaciais open-source mais completa. Complementa Leaflet para apps que precisam de mapas sem dependência de Google.",
    gotchas: [
      "Uso intensivo do tile server público do OSM viola os termos de uso — hospede seus próprios tiles ou use um CDN de tiles.",
      "Dados podem estar desatualizados em regiões menos mapeadas.",
    ],
  },

  "revit-python": {
    tagline: "Automação de modelagem BIM no Revit via Python — scripts para AEC e engenharia.",
    why: "Nicho de AEC/engenharia civil. Aparece em vagas de digital twin e automação de projetos de construção.",
    gotchas: [
      "API do Revit só roda em processo do Revit — não é um servidor comum.",
      "RevitPythonShell e pyRevit têm diferenças de ambiente — scripts podem não ser portáveis.",
    ],
  },

  "go": {
    tagline: "Linguagem compilada, tipada e concorrente do Google — goroutines, performance, simplicidade.",
    why: "Go é forte em infraestrutura, CLIs e microserviços de alta performance. Cada vez mais presente em vagas de backend sênior que buscam alternativa ao Node para serviços críticos.",
    summary: "Go (Golang) é uma linguagem compilada, staticamente tipada, com garbage collector e modelo de concorrência baseado em goroutines e channels (CSP). Destaca-se por: compilação rápida, binary único sem dependências, performance próxima a C para I/O-bound, e simplicidade de linguagem. Usado em Docker, Kubernetes, Terraform, Prometheus.",
    gotchas: [
      "Goroutine leak — goroutine bloqueada em channel sem consumer vaza memória. Sempre garanta que goroutines terminam.",
      "Interface nil check — interface com tipo concreto não-nil mas valor nil pode causar panic inesperado.",
      "Erro ignorado com _ — Go force-retorna errors, ignorar com _ esconde bugs reais.",
      "Slice como referência — modificar slice passado para função modifica o original. Use copy() se precisar de isolamento.",
    ],
  },

  "rust": {
    tagline: "Linguagem de sistemas com ownership, sem GC e sem runtime — segurança e performance máximas.",
    why: "Rust está crescendo em WebAssembly, CLIs e infraestrutura de alto desempenho. Não é expectativa comum em backend web, mas é diferencial para sistemas críticos.",
    summary: "Rust oferece performance de C/C++ com segurança de memória garantida em compile-time via sistema de ownership e borrow checker. Sem garbage collector: memória é liberada deterministicamente. Excelente para: WebAssembly, CLIs, sistemas embarcados, serviços de alta performance onde GC pause é inaceitável.",
    gotchas: [
      "Borrow checker — a curva de aprendizado mais íngreme da linguagem. Entender ownership, borrowing e lifetimes leva tempo.",
      "Compile times longos em projetos grandes — incremental compilation ajuda mas ainda é mais lento que Go.",
      "Async no Rust (tokio) é mais complexo que em Go ou Node — futures, pinning e lifetimes interagem de formas não óbvias.",
    ],
  },
}

export default data
