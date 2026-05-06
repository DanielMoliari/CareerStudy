import type { SkillContent } from "@/types"

const eventLoop: SkillContent = {
    tagline: "Mecanismo single-thread que JS/Node usa para concorrência: call stack, microtasks, macrotasks, Web APIs.",
    why: "Sênior em JS precisa explicar a diferença entre microtask (Promise) e macrotask (setTimeout), por que await não bloqueia o thread, o que trava o event loop e como corrigir. Cobrado em praticamente toda entrevista frontend sênior e Node.js. Entender o event loop é entender POR QUÊ código assíncrono se comporta de forma inesperada — sem isso, você depura problemas de concorrência no escuro.",
    prerequisite: "JavaScript básico (funções, callbacks, closures), o que é uma Promise e como usá-la, async/await sintaxe. Não precisa saber como implementar — mas precisa saber usar antes de entender por que funciona.",
    summary: "JavaScript é single-thread: executa uma coisa por vez na call stack. O event loop é o mecanismo que permite concorrência sem múltiplas threads. Quando a call stack esvazia, o loop verifica as filas em ordem de prioridade: 1) drena TODA a microtask queue (Promise.then, queueMicrotask, MutationObserver) — em Node, process.nextTick é ainda mais prioritário; 2) executa UMA macrotask (setTimeout, setInterval, I/O callback, setImmediate em Node); 3) no browser, pode renderizar (rAF → layout → paint); 4) repete. Qualquer trabalho CPU-bound que trave a call stack por mais de ~16ms congela a UI ou impede o Node de atender novas requests.",
    howToStudy: "<strong>Tem 30 minutos?</strong> Abra o diagrama animado, assista o ciclo 3-4 vezes, depois feche e tente desenhar o fluxo em papel. Treine a Q&A 'O que imprime este código?' com os exemplos do mini-quiz.<br><br><strong>Tem um fim de semana?</strong> Abra o Loupe (visualizador interativo) e cole 5-6 snippets com setTimeout + Promise + async/await. Observe o fluxo visual. Depois leia a talk do Jake Archibald ('In The Loop') — é a melhor explicação visual em vídeo que existe.<br><br><strong>Quer dominar Node?</strong> Leia a documentação oficial das fases do event loop do Node.js, entenda a diferença entre process.nextTick e setImmediate, e pratique debugging com --inspect + Chrome DevTools Performance.",
    diagrams: [
      {
        title: "Event loop animado — call stack, Web APIs, microtasks e macrotasks",
        html: `<style>
.ela-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.ela-h{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.ela-sub{font-size:10px;color:#475569;margin:0 0 14px}
.ela-layout{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px}
.ela-box{background:#1e293b;border:1.5px solid #334155;border-radius:9px;padding:10px}
.ela-box-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #334155}
.ela-slot{background:#0f172a;border:1px solid #334155;border-radius:5px;padding:6px 9px;font-size:9.5px;font-family:'JetBrains Mono',monospace;min-height:28px;margin-bottom:4px;transition:all .3s;color:#64748b}
.ela-slot.active{color:#e2e8f0;border-color:#10B981;background:#10B98110}
.ela-slot.micro{border-color:#3b82f6;background:#3b82f610;color:#93c5fd}
.ela-slot.macro{border-color:#f59e0b;background:#f59e0b10;color:#fcd34d}
.ela-slot.webapi{border-color:#a855f7;background:#a855f710;color:#d8b4fe}
.ela-controls{display:flex;gap:8px;margin-bottom:10px;align-items:center;flex-wrap:wrap}
.ela-btn{background:#1e293b;border:1.5px solid #334155;border-radius:6px;color:#94a3b8;font-size:10px;padding:5px 12px;cursor:pointer;font-family:inherit;transition:all .2s}
.ela-btn:hover,.ela-btn:disabled{border-color:#10B981;color:#10B981}
.ela-btn:disabled{opacity:.5;cursor:not-allowed}
.ela-status{background:#0d1829;border:1px solid #1e293b;border-radius:6px;padding:8px 12px;font-size:10px;color:#94a3b8;min-height:36px;line-height:1.6;flex:1}
.ela-phase{display:inline-block;padding:1px 6px;border-radius:3px;font-weight:700;font-size:9px;margin-right:4px}
.ela-legend{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;padding-top:10px;border-top:1px solid #1e293b}
.ela-leg{display:flex;align-items:center;gap:5px;font-size:9px;color:#64748b}
.ela-leg-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0}
</style>
<div class="ela-wrap">
  <p class="ela-h">Event loop — visualização do ciclo de execução</p>
  <p class="ela-sub">Clique em "▶ Executar" para simular o código passo a passo</p>

  <div class="ela-controls">
    <button class="ela-btn" id="ela-run-btn" onclick="elaRun()">▶ Executar</button>
    <button class="ela-btn" id="ela-reset-btn" onclick="elaReset()">↺ Resetar</button>
    <div class="ela-status" id="ela-status">Código a simular:<br><code style="color:#94a3b8;font-family:'JetBrains Mono',monospace;font-size:9px">console.log(1) · setTimeout(log2, 0) · Promise.resolve().then(log3) · console.log(4)</code></div>
  </div>

  <div class="ela-layout">
    <div class="ela-box">
      <div class="ela-box-title" style="color:#10B981">Call stack</div>
      <div id="ela-stack-3" class="ela-slot"> </div>
      <div id="ela-stack-2" class="ela-slot"> </div>
      <div id="ela-stack-1" class="ela-slot"> </div>
      <div id="ela-stack-0" class="ela-slot" style="border-color:#10B98140"> </div>
    </div>
    <div class="ela-box">
      <div class="ela-box-title" style="color:#a855f7">Web APIs / Timer</div>
      <div id="ela-api-0" class="ela-slot"> </div>
      <div id="ela-api-1" class="ela-slot"> </div>
      <div style="margin-top:8px">
        <div class="ela-box-title" style="color:#3b82f6;border-top:1px solid #334155;padding-top:8px">Microtask queue</div>
        <div id="ela-micro-0" class="ela-slot"> </div>
        <div id="ela-micro-1" class="ela-slot"> </div>
      </div>
    </div>
    <div class="ela-box">
      <div class="ela-box-title" style="color:#f59e0b">Macrotask queue</div>
      <div id="ela-macro-0" class="ela-slot"> </div>
      <div id="ela-macro-1" class="ela-slot"> </div>
      <div style="margin-top:8px">
        <div class="ela-box-title" style="color:#64748b;border-top:1px solid #334155;padding-top:8px">Output</div>
        <div id="ela-out" style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#10B981;min-height:40px;line-height:2"></div>
      </div>
    </div>
  </div>

  <div class="ela-legend">
    <div class="ela-leg"><div class="ela-leg-dot" style="background:#10B981;border:1px solid #10B981"></div>Call stack (síncrono)</div>
    <div class="ela-leg"><div class="ela-leg-dot" style="background:#3b82f610;border:1px solid #3b82f6"></div>Microtask (Promise.then)</div>
    <div class="ela-leg"><div class="ela-leg-dot" style="background:#f59e0b10;border:1px solid #f59e0b"></div>Macrotask (setTimeout)</div>
    <div class="ela-leg"><div class="ela-leg-dot" style="background:#a855f710;border:1px solid #a855f7"></div>Web API / Timer</div>
  </div>
</div>
<script>
(function(){
  var steps=[
    {status:'<span class="ela-phase" style="background:#10B98120;color:#10B981">SYNC</span> console.log(1) entra na call stack e executa imediatamente.',stack:['console.log(1)','','',''],api:['',''],micro:['',''],macro:['',''],out:'1'},
    {status:'<span class="ela-phase" style="background:#a855f720;color:#a855f7">WEB API</span> setTimeout(log2, 0) → Web API registra timer. Callback log2 aguarda.',stack:['setTimeout(log2,0)','','',''],api:['⏱ timer: log2',''],micro:['',''],macro:['',''],out:'1'},
    {status:'<span class="ela-phase" style="background:#3b82f620;color:#3b82f6">MICRO</span> Promise.resolve().then(log3) → enfileira log3 na microtask queue.',stack:['Promise.resolve().then(log3)','','',''],api:['⏱ timer: log2',''],micro:['log3',''],macro:['',''],out:'1'},
    {status:'<span class="ela-phase" style="background:#10B98120;color:#10B981">SYNC</span> console.log(4) executa sincronamente — call stack ainda ocupada.',stack:['console.log(4)','','',''],api:['⏱ timer: log2',''],micro:['log3',''],macro:['',''],out:'1, 4'},
    {status:'<span class="ela-phase" style="background:#f59e0b20;color:#f59e0b">TIMER</span> Timer de 0ms expirou → log2 vai para a macrotask queue.',stack:['','','',''],api:['',''],micro:['log3',''],macro:['log2',''],out:'1, 4'},
    {status:'<span class="ela-phase" style="background:#3b82f620;color:#3b82f6">MICRO</span> Call stack vazia → drena TODA microtask queue. log3 executa.',stack:['log3()','','',''],api:['',''],micro:['',''],macro:['log2',''],out:'1, 4, 3'},
    {status:'<span class="ela-phase" style="background:#f59e0b20;color:#f59e0b">MACRO</span> Microtasks vazias → executa UMA macrotask: log2.',stack:['log2()','','',''],api:['',''],micro:['',''],macro:['',''],out:'1, 4, 3, 2'},
    {status:'✅ Ciclo completo. Saída: <strong style="color:#10B981">1, 4, 3, 2</strong> — sincronos → microtasks → macrotasks.',stack:['','','',''],api:['',''],micro:['',''],macro:['',''],out:'1, 4, 3, 2'},
  ];
  var step=0, running=false;
  function set(id,text,cls){
    var el=document.getElementById(id);
    if(!el) return;
    el.textContent=text||' ';
    el.className='ela-slot'+(cls?' '+cls:'');
  }
  function elaApply(s){
    ['stack-0','stack-1','stack-2','stack-3'].forEach(function(id,i){
      set('ela-'+id, s.stack[i], s.stack[i]?'active':'');
    });
    ['api-0','api-1'].forEach(function(id,i){
      set('ela-'+id, s.api[i], s.api[i]?'webapi':'');
    });
    ['micro-0','micro-1'].forEach(function(id,i){
      set('ela-'+id, s.micro[i], s.micro[i]?'micro':'');
    });
    ['macro-0','macro-1'].forEach(function(id,i){
      set('ela-'+id, s.macro[i], s.macro[i]?'macro':'');
    });
    var out=document.getElementById('ela-out');
    if(out) out.innerHTML=s.out?s.out.split(',').map(function(n){return '<span style="margin-right:8px">'+n.trim()+'</span>';}).join(''):'';
    var st=document.getElementById('ela-status');
    if(st) st.innerHTML=s.status;
  }
  window.elaRun=function(){
    if(running||step>=steps.length) return;
    running=true;
    var btn=document.getElementById('ela-run-btn');
    if(btn){btn.disabled=true;}
    function next(){
      if(step>=steps.length){running=false;if(btn)btn.disabled=false;return;}
      elaApply(steps[step++]);
      setTimeout(next, 900);
    }
    next();
  };
  window.elaReset=function(){
    step=0;running=false;
    var btn=document.getElementById('ela-run-btn');
    if(btn)btn.disabled=false;
    elaApply({status:'Código a simular: <code style="color:#94a3b8;font-family:JetBrains Mono,monospace;font-size:9px">console.log(1) · setTimeout(log2, 0) · Promise.resolve().then(log3) · console.log(4)</code>',stack:['','','',''],api:['',''],micro:['',''],macro:['',''],out:''});
  };
})();
</script>`,
        caption: "Regra fundamental: microtasks drenam completamente antes de qualquer macrotask. É por isso que Promise.then sempre roda antes de setTimeout(fn, 0).",
      },
      {
        title: "Mini-quiz interativo — qual a ordem de execução?",
        html: `<style>
.elq-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.elq-h{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.elq-sub{font-size:10px;color:#475569;margin:0 0 14px}
.elq-card{background:#1e293b;border:1.5px solid #334155;border-radius:9px;padding:14px;margin-bottom:10px}
.elq-code{font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#94a3b8;line-height:1.8;margin-bottom:10px;background:#0f172a;border-radius:5px;padding:10px;white-space:pre}
.elq-btn{background:#0f172a;border:1.5px solid #334155;border-radius:5px;color:#94a3b8;font-size:10px;padding:6px 14px;cursor:pointer;font-family:inherit;transition:all .2s}
.elq-btn:hover{border-color:#10B981;color:#10B981}
.elq-answer{display:none;margin-top:10px;background:#0f172a;border:1px solid #334155;border-radius:7px;padding:12px}
.elq-result{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:#10B981;margin-bottom:8px}
.elq-steps{font-size:9.5px;color:#94a3b8;line-height:1.9}
.elq-step-label{display:inline-block;padding:1px 6px;border-radius:3px;font-size:8px;font-weight:700;margin-right:4px;vertical-align:middle}
.elq-diff{margin-top:10px;padding-top:8px;border-top:1px solid #334155;font-size:9.5px;color:#94a3b8;line-height:1.7}
</style>
<div class="elq-wrap">
  <p class="elq-h">Mini-quiz — preveja a ordem de execução</p>
  <p class="elq-sub">Tente responder antes de clicar em "Ver resposta"</p>

  <div class="elq-card">
    <div style="font-size:10px;font-weight:700;color:#e2e8f0;margin-bottom:8px">Exemplo 1 — clássico de entrevista</div>
    <div class="elq-code">console.log('A')
setTimeout(() => console.log('B'), 0)
Promise.resolve().then(() => console.log('C'))
queueMicrotask(() => console.log('D'))
console.log('E')</div>
    <button class="elq-btn" onclick="elqShow('elq-a1',this)">▶ Ver resposta</button>
    <div class="elq-answer" id="elq-a1">
      <div class="elq-result">A, E, C, D, B</div>
      <div class="elq-steps">
        <span class="elq-step-label" style="background:#10B98120;color:#10B981">SYNC</span> A e E: call stack síncrona<br>
        <span class="elq-step-label" style="background:#a855f720;color:#a855f7">WEBAPI</span> setTimeout → timer API → callback B vai para macrotask queue<br>
        <span class="elq-step-label" style="background:#3b82f620;color:#3b82f6">MICRO</span> Promise.then(C) e queueMicrotask(D) → microtask queue<br>
        <span class="elq-step-label" style="background:#3b82f620;color:#3b82f6">MICRO</span> Stack vazia → drena microtasks em ordem: C, depois D<br>
        <span class="elq-step-label" style="background:#f59e0b20;color:#f59e0b">MACRO</span> Microtasks vazias → macrotask: B
      </div>
    </div>
  </div>

  <div class="elq-card">
    <div style="font-size:10px;font-weight:700;color:#e2e8f0;margin-bottom:8px">Exemplo 2 — async/await</div>
    <div class="elq-code">async function foo() {
  console.log('A')
  await Promise.resolve()
  console.log('B')
  await Promise.resolve()
  console.log('C')
}
foo()
console.log('D')</div>
    <button class="elq-btn" onclick="elqShow('elq-a2',this)">▶ Ver resposta</button>
    <div class="elq-answer" id="elq-a2">
      <div class="elq-result">A, D, B, C</div>
      <div class="elq-steps">
        <span class="elq-step-label" style="background:#10B98120;color:#10B981">SYNC</span> foo() é chamada → executa A sincronamente<br>
        <span class="elq-step-label" style="background:#3b82f620;color:#3b82f6">AWAIT</span> await suspende foo → continuation (B...) vai para microtask queue<br>
        <span class="elq-step-label" style="background:#10B98120;color:#10B981">SYNC</span> Controle retorna para o caller → D executa sincronamente<br>
        <span class="elq-step-label" style="background:#3b82f620;color:#3b82f6">MICRO</span> Stack vazia → microtask: retoma foo, executa B<br>
        <span class="elq-step-label" style="background:#3b82f620;color:#3b82f6">MICRO</span> Segundo await → nova microtask → C executa
      </div>
      <div class="elq-diff">Cada <code style="color:#94a3b8">await</code> é equivalente a um <code style="color:#94a3b8">.then()</code> — coloca o resto da função na microtask queue e libera o thread para continuar.</div>
    </div>
  </div>

  <div class="elq-card">
    <div style="font-size:10px;font-weight:700;color:#e2e8f0;margin-bottom:8px">Exemplo 3 — microtask dentro de microtask</div>
    <div class="elq-code">setTimeout(() => console.log('macro'), 0)
Promise.resolve()
  .then(() => {
    console.log('micro 1')
    return Promise.resolve()
  })
  .then(() => console.log('micro 2'))
console.log('sync')</div>
    <button class="elq-btn" onclick="elqShow('elq-a3',this)">▶ Ver resposta</button>
    <div class="elq-answer" id="elq-a3">
      <div class="elq-result">sync, micro 1, micro 2, macro</div>
      <div class="elq-steps">
        <span class="elq-step-label" style="background:#10B98120;color:#10B981">SYNC</span> 'sync' executa imediatamente<br>
        <span class="elq-step-label" style="background:#3b82f620;color:#3b82f6">MICRO</span> 'micro 1' executa, enfileira outra microtask (return Promise)<br>
        <span class="elq-step-label" style="background:#3b82f620;color:#3b82f6">MICRO</span> Loop drena TODA microtask queue → 'micro 2' executa antes da macrotask<br>
        <span class="elq-step-label" style="background:#f59e0b20;color:#f59e0b">MACRO</span> Só então: 'macro' (setTimeout)
      </div>
      <div class="elq-diff">Microtask que enfileira nova microtask: a nova é processada NA MESMA "drenagem" — macrotasks nunca interrompem a drenagem de microtasks.</div>
    </div>
  </div>

  <div class="elq-card">
    <div style="font-size:10px;font-weight:700;color:#e2e8f0;margin-bottom:8px">Exemplo 4 — await em loop (armadilha clássica)</div>
    <div class="elq-code">// Sequencial (LENTO — N round-trips)
for (const url of urls) {
  const res = await fetch(url)  // espera cada um
}

// Paralelo (RÁPIDO — 1 round-trip)
const results = await Promise.all(
  urls.map(url => fetch(url))
)</div>
    <button class="elq-btn" onclick="elqShow('elq-a4',this)">▶ Ver explicação</button>
    <div class="elq-answer" id="elq-a4">
      <div class="elq-result">await em loop = sequencial involuntário</div>
      <div class="elq-steps">
        <span class="elq-step-label" style="background:#ef444420;color:#ef4444">PROBLEMA</span> for...of + await suspende o loop inteiro esperando cada fetch<br>
        <span class="elq-step-label" style="background:#ef444420;color:#ef4444">CUSTO</span> N URLs = N round-trips em série. Para N=10 e 100ms por fetch = 1 segundo<br>
        <span class="elq-step-label" style="background:#10B98120;color:#10B981">SOLUÇÃO</span> Promise.all() inicia todos os fetches ao mesmo tempo → 1 round-trip<br>
        <span class="elq-step-label" style="background:#f59e0b20;color:#f59e0b">CUIDADO</span> Promise.all falha fast — se um falha, todos falham. Use Promise.allSettled() para tolerar falhas parciais
      </div>
    </div>
  </div>
</div>
<script>
window.elqShow=function(id,btn){
  var el=document.getElementById(id);
  if(el){el.style.display='block';}
  if(btn){btn.style.display='none';}
};
</script>`,
        caption: "Treinar estes 4 padrões deixa o event loop como reflexo. Em entrevista: leia o código, identifique sync/micro/macro, anuncie a ordem antes de executar.",
      },
      {
        title: "Browser vs Node.js — diferenças no event loop",
        html: `<style>
.eln-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.eln-h{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.eln-sub{font-size:10px;color:#475569;margin:0 0 14px}
.eln-cols{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
.eln-box{background:#1e293b;border:1.5px solid #334155;border-radius:9px;padding:12px}
.eln-box-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #334155}
.eln-item{display:flex;gap:8px;margin-bottom:7px;align-items:flex-start}
.eln-tag{font-size:8px;font-weight:700;padding:2px 6px;border-radius:3px;flex-shrink:0;margin-top:2px;font-family:'JetBrains Mono',monospace}
.eln-text{font-size:9.5px;color:#94a3b8;line-height:1.6}
.eln-phases{margin-bottom:14px}
.eln-phases-title{font-size:10px;font-weight:700;color:#10B981;margin-bottom:8px;text-transform:uppercase;letter-spacing:.07em}
.eln-phase-row{display:flex;gap:8px;margin-bottom:5px;align-items:center}
.eln-phase-num{font-size:9px;font-weight:700;background:#1e293b;border-radius:4px;padding:3px 7px;font-family:'JetBrains Mono',monospace;flex-shrink:0;min-width:24px;text-align:center}
.eln-phase-name{font-size:10px;font-weight:600;min-width:90px;flex-shrink:0}
.eln-phase-body{font-size:9px;color:#475569;line-height:1.5}
.eln-compare{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px}
.eln-compare-title{font-size:10px;font-weight:700;color:#10B981;margin-bottom:8px}
.eln-cmp-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:5px;font-size:9px;align-items:start}
.eln-cmp-label{color:#64748b;font-weight:600}
.eln-cmp-browser{color:#3b82f6}
.eln-cmp-node{color:#f59e0b}
</style>
<div class="eln-wrap">
  <p class="eln-h">Browser vs Node.js — diferenças no event loop</p>
  <p class="eln-sub">Ambos têm event loop, mas com diferenças importantes nas APIs e prioridades</p>

  <div class="eln-cols">
    <div class="eln-box">
      <div class="eln-box-title" style="color:#3b82f6">Browser event loop</div>
      <div class="eln-item">
        <span class="eln-tag" style="background:#10B98120;color:#10B981">SYNC</span>
        <div class="eln-text">Call stack — código síncrono, mais prioritário</div>
      </div>
      <div class="eln-item">
        <span class="eln-tag" style="background:#3b82f620;color:#3b82f6">MICRO</span>
        <div class="eln-text">Promise.then · queueMicrotask · MutationObserver — drenados completamente</div>
      </div>
      <div class="eln-item">
        <span class="eln-tag" style="background:#a855f720;color:#a855f7">RENDER</span>
        <div class="eln-text">requestAnimationFrame → style calc → layout → paint → composite (60fps = 16ms/frame)</div>
      </div>
      <div class="eln-item">
        <span class="eln-tag" style="background:#f59e0b20;color:#f59e0b">MACRO</span>
        <div class="eln-text">setTimeout · setInterval · I/O events · MessageChannel · postMessage</div>
      </div>
      <div class="eln-item">
        <span class="eln-tag" style="background:#64748b20;color:#64748b">IDLE</span>
        <div class="eln-text">requestIdleCallback — executado quando browser está ocioso</div>
      </div>
    </div>
    <div class="eln-box">
      <div class="eln-box-title" style="color:#f59e0b">Node.js event loop (libuv)</div>
      <div class="eln-item">
        <span class="eln-tag" style="background:#10B98120;color:#10B981">SYNC</span>
        <div class="eln-text">Call stack — código síncrono</div>
      </div>
      <div class="eln-item">
        <span class="eln-tag" style="background:#ef444420;color:#ef4444">NEXT</span>
        <div class="eln-text">process.nextTick — MAIS prioritário que microtask. Cuidado com starvation recursiva.</div>
      </div>
      <div class="eln-item">
        <span class="eln-tag" style="background:#3b82f620;color:#3b82f6">MICRO</span>
        <div class="eln-text">Promise.then · queueMicrotask — drenados entre cada fase do loop</div>
      </div>
      <div class="eln-item">
        <span class="eln-tag" style="background:#f59e0b20;color:#f59e0b">PHASES</span>
        <div class="eln-text">6 fases libuv: timers → pending → idle → poll → check (setImmediate) → close</div>
      </div>
    </div>
  </div>

  <div class="eln-phases">
    <div class="eln-phases-title">Fases do event loop do Node.js (libuv)</div>
    <div class="eln-phase-row">
      <span class="eln-phase-num" style="color:#f59e0b">1</span>
      <span class="eln-phase-name" style="color:#fbbf24">timers</span>
      <span class="eln-phase-body">Executa callbacks de setTimeout e setInterval cujo timer expirou</span>
    </div>
    <div class="eln-phase-row">
      <span class="eln-phase-num" style="color:#94a3b8">2</span>
      <span class="eln-phase-name" style="color:#94a3b8">pending callbacks</span>
      <span class="eln-phase-body">Callbacks de I/O adiados da iteração anterior (ex: erros TCP)</span>
    </div>
    <div class="eln-phase-row">
      <span class="eln-phase-num" style="color:#475569">3</span>
      <span class="eln-phase-name" style="color:#475569">idle / prepare</span>
      <span class="eln-phase-body">Uso interno do libuv — você raramente interage com esta fase</span>
    </div>
    <div class="eln-phase-row">
      <span class="eln-phase-num" style="color:#10B981">4</span>
      <span class="eln-phase-name" style="color:#10B981">poll</span>
      <span class="eln-phase-body">Processa novos eventos de I/O (fs, net, TCP). Se não há nada, bloqueia aguardando (com timeout calculado pelos timers)</span>
    </div>
    <div class="eln-phase-row">
      <span class="eln-phase-num" style="color:#3b82f6">5</span>
      <span class="eln-phase-name" style="color:#3b82f6">check</span>
      <span class="eln-phase-body">Executa callbacks de setImmediate. Sempre roda após poll — garantido antes do próximo timer</span>
    </div>
    <div class="eln-phase-row">
      <span class="eln-phase-num" style="color:#64748b">6</span>
      <span class="eln-phase-name" style="color:#64748b">close callbacks</span>
      <span class="eln-phase-body">Callbacks de 'close' events (socket.destroy(), etc.)</span>
    </div>
  </div>

  <div class="eln-compare">
    <div class="eln-compare-title">Comparativo — APIs e comportamento</div>
    <div class="eln-cmp-row">
      <span class="eln-cmp-label">API</span>
      <span class="eln-cmp-browser" style="font-weight:700">Browser</span>
      <span class="eln-cmp-node" style="font-weight:700">Node.js</span>
    </div>
    <div class="eln-cmp-row" style="border-top:1px solid #334155;padding-top:5px">
      <span class="eln-cmp-label">Maior prioridade pós-sync</span>
      <span class="eln-cmp-browser">Promise.then</span>
      <span class="eln-cmp-node">process.nextTick</span>
    </div>
    <div class="eln-cmp-row">
      <span class="eln-cmp-label">Após I/O callback</span>
      <span class="eln-cmp-browser">N/A</span>
      <span class="eln-cmp-node">setImmediate antes de setTimeout(0)</span>
    </div>
    <div class="eln-cmp-row">
      <span class="eln-cmp-label">CPU-bound</span>
      <span class="eln-cmp-browser">Web Workers</span>
      <span class="eln-cmp-node">worker_threads / cluster</span>
    </div>
    <div class="eln-cmp-row">
      <span class="eln-cmp-label">Render frame</span>
      <span class="eln-cmp-browser">requestAnimationFrame</span>
      <span class="eln-cmp-node">Não existe (sem render)</span>
    </div>
    <div class="eln-cmp-row">
      <span class="eln-cmp-label">Long task &gt; 50ms</span>
      <span class="eln-cmp-browser">UI freeze, jank</span>
      <span class="eln-cmp-node">Requests não atendidas</span>
    </div>
    <div class="eln-cmp-row">
      <span class="eln-cmp-label">I/O assíncrono</span>
      <span class="eln-cmp-browser">fetch, XHR, DOM events</span>
      <span class="eln-cmp-node">libuv thread pool (fs, DNS, crypto)</span>
    </div>
  </div>
</div>`,
        caption: "A diferença mais importante para entrevista Node: process.nextTick é mais prioritário que Promise.then. Em browser: não existe nextTick, e render acontece entre microtasks e macrotask.",
      },
    ],
    cheatsheet: {
      title: "Cheatsheet — Event loop: ordem de execução, APIs e antipadrões",
      html: `<style>
.elcs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.elcs-h{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.elcs-sub{font-family:'Space Grotesk',sans-serif;font-size:10px;color:#475569;margin:0 0 14px}
.elcs-sec{margin-bottom:14px}
.elcs-sec-title{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;color:#10B981;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #1e293b}
.elcs-order{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
.elcs-ord-row{display:flex;gap:8px;align-items:center;background:#1e293b;border-radius:5px;padding:6px 10px}
.elcs-ord-num{font-size:9px;font-weight:700;min-width:16px;text-align:center}
.elcs-ord-text{font-size:9.5px;flex:1}
.elcs-ord-apis{font-size:8.5px;color:#475569;margin-top:1px}
.elcs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.elcs-card{background:#1e293b;border:1px solid #334155;border-radius:7px;padding:9px 11px}
.elcs-ct{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:600;color:#e2e8f0;margin-bottom:5px}
.elcs-code{font-size:9px;color:#94a3b8;line-height:1.7;white-space:pre;overflow-x:auto}
.elcs-anti{background:#ef444410;border:1px solid #ef444430;border-radius:5px;padding:7px 10px;margin-bottom:5px;font-family:'Space Grotesk',sans-serif;font-size:9.5px}
.elcs-anti-label{color:#ef4444;font-weight:700;font-size:8px;text-transform:uppercase;margin-bottom:2px}
.elcs-fix{color:#10B981;font-size:9px;margin-top:3px}
</style>
<div class="elcs-wrap">
  <p class="elcs-h">Cheatsheet de event loop</p>
  <p class="elcs-sub">Ordem de execução + APIs + antipadrões + código</p>

  <div class="elcs-sec">
    <div class="elcs-sec-title">Ordem de execução (por prioridade)</div>
    <div class="elcs-order">
      <div class="elcs-ord-row">
        <span class="elcs-ord-num" style="color:#10B981">1</span>
        <div>
          <div class="elcs-ord-text" style="color:#10B981">Call stack — código síncrono</div>
          <div class="elcs-ord-apis">Tudo que roda imediatamente: atribuições, loops, funções, etc.</div>
        </div>
      </div>
      <div class="elcs-ord-row">
        <span class="elcs-ord-num" style="color:#ef4444">2</span>
        <div>
          <div class="elcs-ord-text" style="color:#ef4444">process.nextTick (Node.js only) — mais prioritário que Promise</div>
          <div class="elcs-ord-apis">Cuidado: uso recursivo causa starvation de I/O</div>
        </div>
      </div>
      <div class="elcs-ord-row">
        <span class="elcs-ord-num" style="color:#3b82f6">3</span>
        <div>
          <div class="elcs-ord-text" style="color:#3b82f6">Microtask queue — drena COMPLETAMENTE antes de qualquer macrotask</div>
          <div class="elcs-ord-apis">Promise.then · Promise.catch · queueMicrotask() · MutationObserver (browser) · async/await continuations</div>
        </div>
      </div>
      <div class="elcs-ord-row">
        <span class="elcs-ord-num" style="color:#a855f7">4</span>
        <div>
          <div class="elcs-ord-text" style="color:#a855f7">Render (browser only) — se há frame pendente</div>
          <div class="elcs-ord-apis">requestAnimationFrame → style calculation → layout → paint → composite</div>
        </div>
      </div>
      <div class="elcs-ord-row">
        <span class="elcs-ord-num" style="color:#f59e0b">5</span>
        <div>
          <div class="elcs-ord-text" style="color:#f59e0b">1 Macrotask — UMA por iteração do loop, depois volta ao passo 2</div>
          <div class="elcs-ord-apis">setTimeout · setInterval · I/O callbacks · setImmediate (Node) · MessageChannel · postMessage</div>
        </div>
      </div>
    </div>
  </div>

  <div class="elcs-sec">
    <div class="elcs-sec-title">Templates de código essenciais</div>
    <div class="elcs-grid">
      <div class="elcs-card">
        <div class="elcs-ct">Paralelizar fetches</div>
        <div class="elcs-code">// ERRADO — sequencial (N RTTs)
for (const url of urls)
  await fetch(url)

// CERTO — paralelo (1 RTT)
await Promise.all(urls.map(fetch))

// Com tolerância a falhas
await Promise.allSettled(urls.map(fetch))</div>
      </div>
      <div class="elcs-card">
        <div class="elcs-ct">Quebrar trabalho CPU-bound</div>
        <div class="elcs-code">// Chunk com setTimeout
async function processChunks(arr) {
  for (let i=0; i&lt;arr.length; i+=100) {
    const chunk = arr.slice(i, i+100)
    processChunk(chunk)
    await new Promise(r => setTimeout(r, 0))
    // libera o loop entre chunks
  }
}</div>
      </div>
      <div class="elcs-card">
        <div class="elcs-ct">Limite de concorrência</div>
        <div class="elcs-code">// Limita a N promises simultâneas
async function* pool(urls, limit=5) {
  const executing = new Set()
  for (const url of urls) {
    const p = fetch(url).finally(
      () => executing.delete(p))
    executing.add(p)
    if (executing.size >= limit)
      await Promise.race(executing)
    yield p
  }
}</div>
      </div>
      <div class="elcs-card">
        <div class="elcs-ct">Web Worker para CPU-bound</div>
        <div class="elcs-code">// main.js
const w = new Worker('./worker.js')
w.postMessage({data: heavyArray})
w.onmessage = ({data}) => {
  console.log('resultado:', data)
}

// worker.js
self.onmessage = ({data}) => {
  const result = heavyCompute(data.data)
  self.postMessage(result)
}</div>
      </div>
    </div>
  </div>

  <div class="elcs-sec">
    <div class="elcs-sec-title">Antipadrões e correções</div>
    <div class="elcs-anti">
      <div class="elcs-anti-label">Antipadrão: await em loop sequencial</div>
      <code style="color:#94a3b8;font-size:9px">for (const x of arr) await fetch(x) // N round-trips!</code>
      <div class="elcs-fix">✓ Fix: await Promise.all(arr.map(fetch)) // 1 round-trip</div>
    </div>
    <div class="elcs-anti">
      <div class="elcs-anti-label">Antipadrão: Promise constructor antipattern</div>
      <code style="color:#94a3b8;font-size:9px">new Promise(resolve => resolve(fetch(url))) // desnecessário</code>
      <div class="elcs-fix">✓ Fix: fetch(url).then(...) // fetch já retorna Promise</div>
    </div>
    <div class="elcs-anti">
      <div class="elcs-anti-label">Antipadrão: CPU-bound no thread principal</div>
      <code style="color:#94a3b8;font-size:9px">const r = heavyCompute(bigArray) // trava UI/Node</code>
      <div class="elcs-fix">✓ Fix: Web Worker (browser) ou worker_threads (Node)</div>
    </div>
    <div class="elcs-anti">
      <div class="elcs-anti-label">Antipadrão: Promise sem catch (unhandled rejection)</div>
      <code style="color:#94a3b8;font-size:9px">fetch(url).then(doSomething) // sem catch</code>
      <div class="elcs-fix">✓ Fix: .then().catch(err => ...) ou try/catch em async fn</div>
    </div>
    <div class="elcs-anti">
      <div class="elcs-anti-label">Antipadrão: process.nextTick recursivo (Node)</div>
      <code style="color:#94a3b8;font-size:9px">function loop() { process.nextTick(loop) } // starva I/O</code>
      <div class="elcs-fix">✓ Fix: use setImmediate() para loops que não precisam ser prioritários</div>
    </div>
  </div>
</div>`,
    },
    keypoints: [
      { title: "Call stack", body: "Pilha de execução síncrona. Cada chamada de função empilha um frame. Quando a função retorna, o frame é removido. Stack vazia = event loop pode processar as filas. Stack overflow = recursão muito profunda sem base case.", code: "function a() { b() }  // empilha frame de a\nfunction b() { c() }  // empilha frame de b\nfunction c() { /*...*/ }  // empilha c\n// Quando c retorna: c → b → a → vazio" },
      { title: "Microtask queue", body: "Fila de alta prioridade. APIs: Promise.then/catch/finally, async/await continuations, queueMicrotask(), MutationObserver (browser). Drenada COMPLETAMENTE antes de qualquer macrotask — se uma microtask enfileira outra microtask, essa nova também é processada antes de macrotask. Pode causar starvation se mal usada.", code: "Promise.resolve()\n  .then(() => {\n    console.log('micro 1')\n    // enfileira nova microtask — roda ANTES de setTimeout\n    return Promise.resolve('micro 2')\n  })\n  .then(console.log)\nsetTimeout(() => console.log('macro'), 0)\n// Output: micro 1, micro 2, macro" },
      { title: "Macrotask queue (task queue)", body: "Fila de prioridade mais baixa. Uma macrotask por iteração do event loop. APIs: setTimeout, setInterval, setImmediate (Node), I/O callbacks, MessageChannel, postMessage, requestAnimationFrame (antes do render). Entre cada macrotask, o loop drena todas as microtasks.", code: "setTimeout(() => console.log('macro 1'), 0)\nsetTimeout(() => console.log('macro 2'), 0)\nPromise.resolve().then(() => console.log('micro'))\n// Output: micro, macro 1, macro 2\n// 'micro' roda antes das macrotasks — mesmo que setTimeout seja 0ms" },
      { title: "Web APIs e libuv", body: "No browser: setTimeout, fetch, DOM events são gerenciados fora do thread JS pela engine do browser. Quando completam, enfileiram callbacks nas filas apropriadas. No Node.js: libuv gerencia I/O assíncrono com thread pool próprio. Operações de fs, DNS, crypto, etc. rodam em threads separadas da libuv — o callback é enfileirado quando completa.", code: "// fetch roda fora da call stack (Web API)\nfetch('/api/data')\n  .then(r => r.json())   // microtask quando resposta chegar\n  .then(data => console.log(data))  // microtask\n// enquanto fetch processa, call stack está livre" },
      { title: "await = syntactic sugar para .then()", body: "Toda função async retorna uma Promise. Cada await é equivalente a .then() — suspende a execução da função, coloca a continuação na microtask queue, e libera o thread. O código após o await não é síncrono — é uma microtask.", code: "async function foo() {\n  console.log('A')      // sync\n  await Promise.resolve()\n  console.log('B')      // microtask (continuation)\n}\nfoo()\nconsole.log('C')        // sync\n// Output: A, C, B" },
      { title: "process.nextTick (Node.js)", body: "API exclusiva do Node. Mais prioritária que qualquer microtask — roda antes mesmo de Promise.then. Enfileira callback para rodar antes da próxima iteração do event loop, mas após o código síncrono atual. Uso recursivo de nextTick causa starvation: o loop nunca avança para a fase de poll (I/O).", code: "process.nextTick(() => console.log('nextTick'))\nPromise.resolve().then(() => console.log('Promise'))\nconsole.log('sync')\n// Output: sync, nextTick, Promise\n// nextTick > Promise.then em prioridade no Node" },
      { title: "Render frame (browser)", body: "No browser, entre microtasks e macrotask, o browser pode executar um 'render frame': requestAnimationFrame callbacks → style calculation → layout → paint → composite. Acontece a ~60fps (16ms/frame). Microtask que demora mais que 16ms atrasa o render. Long tasks (> 50ms) causam 'jank' visível.", code: "// requestAnimationFrame roda antes do paint,\n// depois de microtasks, antes de macrotasks\nrequestAnimationFrame(() => {\n  element.style.opacity = '1'  // aplicado no próximo frame\n})\n// Para animações: use rAF, não setTimeout(fn, 16)" },
      { title: "CPU-bound e starvation", body: "For loop pesado trava o event loop: nenhuma outra task pode rodar enquanto a call stack está ocupada. Em Node: uma request que executa CPU-bound bloqueia TODAS as outras requests. Solução: quebrar em chunks com setTimeout/queueMicrotask, ou mover para Web Worker (browser) / worker_threads (Node).", code: "// RUIM: trava por segundos\nconst result = arr.reduce((acc, x) => heavyOp(acc, x), 0)\n\n// MELHOR: quebra em chunks\nasync function chunkProcess(arr) {\n  for (let i=0; i<arr.length; i+=1000) {\n    process(arr.slice(i, i+1000))\n    await new Promise(r => setTimeout(r, 0))\n  }\n}" },
      { title: "setImmediate vs setTimeout(fn, 0) em Node", body: "setImmediate: roda na fase 'check', após poll (I/O). setTimeout(fn, 0): roda na fase 'timers'. Dentro de um I/O callback: setImmediate sempre roda ANTES de setTimeout(0) — fase check vem antes de timers na próxima iteração. Fora de I/O: ordem é não-determinística e depende do estado do process timer.", code: "// Dentro de callback de I/O: setImmediate primeiro\nfs.readFile('f.txt', () => {\n  setTimeout(() => console.log('timeout'), 0)\n  setImmediate(() => console.log('immediate'))\n})\n// Output garantido: immediate, timeout\n\n// Fora de I/O: ordem pode variar" },
    ],
    mnemonics: [
      { label: "Ordem: S-M-R-M", trick: "Sync → Micro → Render → Macro", explanation: "Toda iteração do event loop segue esta ordem. Sync = call stack. Micro = Promise.then (drena tudo). Render = frame (browser). Macro = uma setTimeout/I/O. Depois volta ao início." },
      { label: "Microtask drena TUDO", trick: "Micro = 'eu e todos meus filhos primeiro'", explanation: "Uma microtask que enfileira outra microtask: a nova também roda antes de qualquer macrotask. A fila de microtasks é drenada até ficar vazia, então e somente então uma macrotask roda." },
      { label: "await libera o thread", trick: "await = 'pause, coloque o resto em .then(), volte depois'", explanation: "await não bloqueia — suspende a função atual e libera o thread para outras tarefas. A continuação (código após o await) vira uma microtask e roda quando a Promise resolver." },
    ],
    gotchas: [
      "Achar que setTimeout(fn, 0) roda imediatamente — vai para o fim da fila de macrotasks. Promise.then sempre roda antes.",
      "Confundir microtask com macrotask — Promise é micro (alta prioridade), setTimeout é macro (baixa prioridade).",
      "await em loop sequencial: <code>for(const x of arr) await fetch(x)</code> processa em série — N round-trips. Para paralelo: <code>await Promise.all(arr.map(fetch))</code>.",
      "For loop pesado bloqueia UI ou Node inteiro — quebre com setTimeout ou Web Worker.",
      "Subir servidor Node sem worker_threads para CPU-bound — uma request travada, todos os outros usuários esperam.",
      "process.nextTick recursivo (Node) starva I/O — o loop nunca avança para poll. Use setImmediate() para loops que não precisam ser super prioritários.",
      "Esquecer que async function sempre retorna Promise — mesmo sem await dentro. <code>async function f(){return 1}</code> retorna <code>Promise<1></code>.",
      "Promise sem .catch() ou try/catch em async → unhandled rejection. Em Node.js moderno: crash do processo.",
      "Microtask que enfileira microtask infinitamente → starvation: macrotasks nunca rodam, UI trava.",
    ],
    interview: [
      { q: "Qual a diferença entre microtask e macrotask?", a: "<p><strong>Microtask</strong>: Promise.then/catch/finally, queueMicrotask(), MutationObserver, async/await continuations. A microtask queue é drenada <em>completamente</em> entre cada macrotask — prioridade máxima.</p><p><strong>Macrotask</strong>: setTimeout, setInterval, I/O callbacks, setImmediate (Node), MessageChannel. Uma por iteração do event loop.</p><p>Ordem: sync → drena todas microtasks → [render] → 1 macrotask → drena todas microtasks → 1 macrotask...</p>", level: "pleno" },
      { q: "O que imprime este código?<br><code>console.log(1); setTimeout(()=>console.log(2),0); Promise.resolve().then(()=>console.log(3)); console.log(4);</code>", a: "<p><strong>1, 4, 3, 2</strong></p><p>Passo a passo:</p><ol><li>console.log(1): sync → imprime 1</li><li>setTimeout: Web API registra timer → callback vai para macrotask queue</li><li>Promise.resolve().then(log3): enfileira log3 na microtask queue</li><li>console.log(4): sync → imprime 4</li><li>Stack vazia → drena microtasks: log3 → imprime 3</li><li>Microtasks vazias → macrotask: log2 → imprime 2</li></ol>", level: "pleno" },
      { q: "Como evitar travar o event loop?", a: "<ul><li>Quebrar trabalho longo em chunks com <code>setTimeout(fn, 0)</code> entre chunks (libera o loop)</li><li>Usar Web Workers (browser) ou worker_threads (Node) para CPU-bound real</li><li>Async I/O em vez de sync: fs.readFile, não fs.readFileSync</li><li>Streaming para dados grandes em vez de carregar tudo em memória</li><li>Profile com Performance.measure, identificar long tasks (&gt;50ms) no browser DevTools</li><li>Em Node: monitorar com <code>--trace-warnings</code> e <code>performance.timerify</code></li></ul>", level: "pleno" },
      { q: "await em loop — como paralelizar fetches?", a: "<p><strong>Sequencial (N round-trips — LENTO):</strong></p><p><code>for (const url of urls) await fetch(url)</code></p><p><strong>Paralelo (1 round-trip — RÁPIDO):</strong></p><p><code>await Promise.all(urls.map(url => fetch(url)))</code></p><p>Atenção: Promise.all falha fast — se 1 falha, a Promise rejeitada. Para tolerar falhas parciais: <code>Promise.allSettled()</code>. Para limitar concorrência: use biblioteca p-limit ou implementação manual com semáforo.</p>", level: "pleno" },
      { q: "O que é process.nextTick e quando usar?", a: "<p>API exclusiva do Node.js. Tem prioridade <strong>maior</strong> que qualquer microtask (Promise.then) — roda antes mesmo de Promises na próxima 'tick'.</p><p>Uso legítimo: garantir que callback roda após o código síncrono atual mas antes de qualquer I/O. Ex: EventEmitter que dispara evento antes do listener ser registrado.</p><p>Perigo: chamadas recursivas de nextTick podem starvar I/O — o event loop nunca avança para a fase poll. Em geral, prefira <code>queueMicrotask()</code> ou Promise.</p>", level: "senior" },
      { q: "Qual a diferença entre setTimeout(fn,0) e setImmediate em Node?", a: "<p><strong>setTimeout(fn, 0)</strong>: vai para a fase 'timers'. Mínimo de 1ms de delay na prática.</p><p><strong>setImmediate(fn)</strong>: vai para a fase 'check', após poll (I/O). Garantido rodar antes de setTimeout(0) dentro de callback de I/O.</p><p>Exemplo: dentro de <code>fs.readFile</code> callback, <code>setImmediate</code> sempre roda antes de <code>setTimeout(fn,0)</code> — check vem antes de timers na próxima iteração.</p><p>Fora de I/O: ordem é não-determinística, depende de quanto tempo levou a inicialização. Use setTimeout na maioria dos casos — portável para browser.</p>", level: "senior" },
      { q: "O que é Promise constructor antipattern?", a: "<p>Envolver uma Promise existente em <code>new Promise()</code> desnecessariamente:</p><p><code>// ERRADO<br>return new Promise((resolve, reject) => {<br>  fetch(url).then(resolve).catch(reject)<br>})</code></p><p>Problemas: captura de erros pode falhar (exceção síncrona dentro do callback não é capturada corretamente), código mais verboso, perde otimizações.</p><p><code>// CERTO — fetch já é uma Promise<br>return fetch(url)</code></p><p>Só use <code>new Promise()</code> para converter APIs callback-style para Promise (promisification).</p>", level: "senior" },
      { q: "Como Promise chains executam no event loop?", a: "<p>Cada <code>.then()</code> enfileira uma microtask quando a Promise anterior resolve. O código após <code>.then()</code> não roda sincronamente:</p><p><code>Promise.resolve('a')<br>  .then(v => { console.log(v); return 'b' }) // microtask 1<br>  .then(v => console.log(v))  // microtask 2 (só enfileirada após 1 resolver)<br>console.log('sync')  // roda antes das microtasks</code></p><p>Output: sync, a, b. Cada .then cria uma nova microtask — chains longas enfileiram sequencialmente, mas todas antes de qualquer macrotask.</p>", level: "senior" },
      { q: "O que é event loop starvation?", a: "<p>Quando microtasks continuam se enfileirando sem parar, impedindo macrotasks (e render) de executar.</p><p>Exemplo clássico:</p><p><code>function loop() {<br>  Promise.resolve().then(loop)  // enfileira infinitamente<br>}<br>loop()<br>setTimeout(() => console.log('nunca'), 0)  // nunca roda</code></p><p>Similar com process.nextTick recursivo em Node — a fase poll (I/O) nunca é alcançada.</p><p>Correção: use setImmediate() ou setTimeout() para loops que precisam ceder o loop periodicamente.</p>", level: "senior" },
      { q: "Como funciona async/await por baixo?", a: "<p>async function é syntactic sugar para geradores + Promises. O compilador transforma:</p><p><code>async function f() {<br>  const a = await promise1<br>  const b = await promise2<br>  return a + b<br>}</code></p><p>Em aproximadamente:</p><p><code>function f() {<br>  return promise1<br>    .then(a => promise2.then(b => a + b))<br>}</code></p><p>Cada await suspende a execução, retorna o controle para o event loop, e a continuação (código após await) é enfileirada como microtask quando a Promise resolver.</p>", level: "senior" },
      { q: "requestAnimationFrame vs setTimeout para animações?", a: "<p><strong>requestAnimationFrame (rAF)</strong>: sincronizado com o ciclo de render do browser (~60fps = 16ms). Roda antes do paint. Se a tab está em background, é pausado automaticamente (não desperdiça CPU).</p><p><strong>setTimeout(fn, 16)</strong>: não sincronizado com render. Pode rodar em momento diferente do ciclo visual, causando tearing ou frames duplicados/pulados.</p><p>Sempre use rAF para animações visuais. Use setTimeout apenas para delays não-visuais.</p>", level: "pleno" },
      { q: "O que é queueMicrotask() e quando usar?", a: "<p><code>queueMicrotask(fn)</code> é uma API de baixo nível para enfileirar uma função na microtask queue diretamente, sem criar uma Promise completa. Suportada em browsers modernos e Node.js 11+.</p><p><strong>Quando usar:</strong> quando você precisa de execução após o código síncrono atual mas antes de qualquer macrotask, e criar uma Promise seria overhead desnecessário. Útil em engines de scheduling internas de frameworks.</p><p><strong>Diferença para Promise.resolve().then():</strong> semanticamente equivalente, mas queueMicrotask não cria o overhead de construir um objeto Promise — é mais eficiente para hot paths internos de bibliotecas.</p><p><strong>Cuidado:</strong> assim como qualquer microtask, pode causar starvation se usada recursivamente.</p>", level: "senior", tip: "Raro em código de produto — aparece mais em código de biblioteca/framework. Entender a diferença demonstra profundidade." },
      { q: "Como o browser decide quando renderizar um frame?", a: "<p>O browser tenta manter 60fps (1 frame a cada ~16ms). A cada iteração do event loop:</p><ol><li>Drena toda a microtask queue</li><li>Verifica se há um frame pendente (baseado no vsync do monitor e se houve mudança visual)</li><li>Se sim: executa callbacks de requestAnimationFrame → calcula estilos → layout → paint → composite</li><li>Executa uma macrotask</li><li>Repete</li></ol><p><strong>Implicação:</strong> microtask que demora mais que 16ms pode atrasar um frame inteiro. Long tasks (&gt;50ms) são detectadas como janks pelo Lighthouse e CrUX.</p><p><strong>Otimização:</strong> use <code>requestIdleCallback</code> para trabalho não-urgente que pode esperar um frame ocioso (ex: analytics, prefetch).</p>", level: "senior" },
      { q: "Explique MutationObserver e seu lugar no event loop.", a: "<p><code>MutationObserver</code> observa mudanças no DOM (atributos, filhos, text content) de forma assíncrona. Quando uma mutação ocorre, o callback é enfileirado na <strong>microtask queue</strong> — não na macrotask queue.</p><p>Isso significa que MutationObserver callbacks rodam antes de qualquer setTimeout, após o código síncrono que causou a mutação. É por isso que frameworks como React e Vue podiam usá-lo como polyfill para agendamento de microtask antes de queueMicrotask existir.</p><p><strong>Cuidado:</strong> observar subtrees grandes pode ser custoso. Sempre chame <code>observer.disconnect()</code> quando não precisar mais.</p>", level: "senior" },
      { q: "O que acontece se uma microtask lança uma exceção não capturada?", a: "<p>A exceção é capturada pelo runtime e reportada como <strong>unhandled promise rejection</strong> — não interrompe a drenagem das outras microtasks.</p><p>Em browsers modernos: dispara o evento <code>unhandledrejection</code> no window. Em Node.js moderno (v15+): causa crash do processo com exit code 1, a menos que haja handler em <code>process.on('unhandledRejection')</code>.</p><p>As outras microtasks na fila <em>continuam executando</em> — diferente de uma exceção síncrona que interromperia o código atual.</p><p><strong>Boas práticas:</strong></p><ul><li>Sempre adicione .catch() em Promises standalone</li><li>Use try/catch dentro de async functions</li><li>Registre <code>window.addEventListener('unhandledrejection', handler)</code> como fallback global</li></ul>", level: "senior" },
      { q: "Como depurar um problema de event loop em produção?", a: "<p><strong>No browser:</strong></p><ul><li>Performance tab do DevTools → grave uma sessão → procure Long Tasks (barras vermelhas &gt;50ms)</li><li>Lighthouse → Performance → Time to Interactive, Total Blocking Time</li><li>PerformanceObserver com <code>'longtask'</code> entry type para monitoramento em prod</li></ul><p><strong>No Node.js:</strong></p><ul><li><code>--trace-warnings</code> e <code>--trace-deprecation</code> para warnings de Promise</li><li>Módulo <code>perf_hooks</code>: <code>performance.timerify(fn)</code> para medir funções</li><li>Pacote <code>blocked-at</code> detecta quando o event loop trava mais de N ms</li><li>Clinic.js (<code>npx clinic doctor</code>) gera diagnóstico visual de CPU e event loop</li><li>APMs (New Relic, Datadog) rastreiam event loop lag automaticamente</li></ul>", level: "senior", tip: "Event loop lag = tempo que o loop leva para responder a um tick. Ideal: &lt;10ms. &gt;100ms indica problema sério." },
      { q: "Como Promise.race() e Promise.any() se comportam no event loop?", a: "<p>Ambas retornam uma Promise que resolve/rejeita quando a condição for atendida, mas o comportamento difere:</p><p><strong>Promise.race(iterable)</strong>: resolve ou rejeita assim que a <em>primeira</em> Promise do iterável settle (seja resolve ou reject). Se a primeira rejeitar, Promise.race também rejeita.</p><p><strong>Promise.any(iterable)</strong> (ES2021): resolve assim que a <em>primeira</em> Promise resolve com sucesso. Só rejeita se <em>todas</em> rejeitarem (AggregateError).</p><p>Use race para timeout pattern: <code>Promise.race([fetch(url), timeout(5000)])</code>. Use any para \"primeiro que responder e não falhar\".</p>", level: "pleno" },
      { q: "Como worker_threads do Node.js diferem de cluster?", a: "<p>Ambos permitem processamento paralelo em Node.js, mas com abordagens diferentes:</p><p><strong>worker_threads:</strong></p><ul><li>Threads verdadeiras com memória compartilhada opcional (SharedArrayBuffer + Atomics)</li><li>Mesmo processo, menos overhead de memória</li><li>Ideal para CPU-bound (crypto, compressão, parsing pesado)</li></ul><p><strong>cluster:</strong></p><ul><li>Forka processos completos — cada worker tem seu próprio event loop e memória isolada</li><li>Ideal para escalar I/O-bound (múltiplos processos HTTP)</li><li>O master distribui conexões TCP para os workers</li></ul><p><strong>Na prática:</strong> cluster para escalar web servers (N processos = N cores), worker_threads para offload de CPU-bound de um único servidor.</p>", level: "senior" },
      { q: "Por que async generators são úteis para streaming?", a: "<p>Async generators combinam <code>async/await</code> com generators (<code>function*</code>), permitindo produzir valores de forma assíncrona com <code>yield</code>.</p><p>Exemplo de paginação:</p><p><code>async function* paginate(url) {<br>&nbsp;&nbsp;let cursor = null<br>&nbsp;&nbsp;do {<br>&nbsp;&nbsp;&nbsp;&nbsp;const res = await fetch(url + '?cursor=' + cursor)<br>&nbsp;&nbsp;&nbsp;&nbsp;const data = await res.json()<br>&nbsp;&nbsp;&nbsp;&nbsp;yield data.items<br>&nbsp;&nbsp;&nbsp;&nbsp;cursor = data.nextCursor<br>&nbsp;&nbsp;} while (cursor)<br>}</code></p><p>Cada <code>await</code> libera o event loop. Cada <code>yield</code> pausa até o consumidor pedir mais via <code>for await...of</code> — isso cria backpressure natural, sem carregar tudo em memória.</p>", level: "senior" },
      { q: "Qual a diferença entre Promise.all, Promise.allSettled, Promise.race e Promise.any?", a: "<p>Os quatro combinators de Promises, cada um com semântica diferente:</p><p><strong>Promise.all(arr)</strong>: resolve quando <em>todas</em> resolvem. Rejeita fast-fail se <em>qualquer uma</em> rejeitar (as outras continuam rodando, mas o resultado é ignorado). Ideal para buscar múltiplos recursos obrigatórios.</p><p><strong>Promise.allSettled(arr)</strong> (ES2020): resolve sempre, com array de <code>{status, value|reason}</code>. Nunca rejeita. Ideal quando você quer processar todos os resultados, inclusive falhas parciais.</p><p><strong>Promise.race(arr)</strong>: settle assim que a <em>primeira</em> settle (resolve ou rejeita). Usado para timeouts: <code>Promise.race([fetch(url), rejectAfter(5000)])</code>.</p><p><strong>Promise.any(arr)</strong> (ES2021): resolve assim que a <em>primeira resolve</em> com sucesso. Só rejeita com AggregateError se <em>todas</em> rejeitarem. Ideal para redundância: \"primeiro servidor que responder\".</p>", level: "pleno" },
    ],
    mindmap: {
      title: "JavaScript Event Loop — Mapa Mental Completo",
      html: `<div style="background:#0a0a0a;padding:28px 22px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .el2-center{text-align:center;margin-bottom:24px}
    .el2-hub{display:inline-block;background:linear-gradient(135deg,#ef4444,#f97316);color:#fff;font-weight:800;font-size:15px;padding:12px 26px;border-radius:12px;letter-spacing:.5px;box-shadow:0 4px 24px rgba(239,68,68,.35)}
    .el2-subtitle{color:#475569;font-size:11px;margin-top:7px}
    .el2-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
    .el2-branch{background:rgba(239,68,68,.05);border:1px solid rgba(239,68,68,.18);border-radius:10px;padding:13px}
    .el2-branch-title{font-weight:700;font-size:11px;color:#ef4444;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid rgba(239,68,68,.18);text-transform:uppercase;letter-spacing:.6px}
    .el2-branch.el2-blue{background:rgba(59,130,246,.05);border-color:rgba(59,130,246,.18)}
    .el2-branch.el2-blue .el2-branch-title{color:#3b82f6;border-bottom-color:rgba(59,130,246,.18)}
    .el2-branch.el2-blue .el2-leaf::before{color:#3b82f6}
    .el2-branch.el2-blue .el2-leaf b{color:#93c5fd}
    .el2-branch.el2-amber{background:rgba(245,158,11,.05);border-color:rgba(245,158,11,.18)}
    .el2-branch.el2-amber .el2-branch-title{color:#f59e0b;border-bottom-color:rgba(245,158,11,.18)}
    .el2-branch.el2-amber .el2-leaf::before{color:#f59e0b}
    .el2-branch.el2-amber .el2-leaf b{color:#fcd34d}
    .el2-branch.el2-purple{background:rgba(168,85,247,.05);border-color:rgba(168,85,247,.18)}
    .el2-branch.el2-purple .el2-branch-title{color:#a855f7;border-bottom-color:rgba(168,85,247,.18)}
    .el2-branch.el2-purple .el2-leaf::before{color:#a855f7}
    .el2-branch.el2-purple .el2-leaf b{color:#d8b4fe}
    .el2-branch.el2-green{background:rgba(16,185,129,.05);border-color:rgba(16,185,129,.18)}
    .el2-branch.el2-green .el2-branch-title{color:#10B981;border-bottom-color:rgba(16,185,129,.18)}
    .el2-branch.el2-green .el2-leaf::before{color:#10B981}
    .el2-branch.el2-green .el2-leaf b{color:#6ee7b7}
    .el2-branch.el2-rose{background:rgba(244,63,94,.05);border-color:rgba(244,63,94,.18)}
    .el2-branch.el2-rose .el2-branch-title{color:#f43f5e;border-bottom-color:rgba(244,63,94,.18)}
    .el2-branch.el2-rose .el2-leaf::before{color:#f43f5e}
    .el2-branch.el2-rose .el2-leaf b{color:#fda4af}
    .el2-leaf{font-size:11px;color:#94a3b8;line-height:1.85;padding:1px 0}
    .el2-leaf::before{content:'› ';color:#ef4444;font-weight:700}
    .el2-leaf b{color:#fca5a5}
    .el2-order{margin-top:16px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:10px;padding:13px}
    .el2-order-title{font-weight:700;font-size:11px;color:#ef4444;margin-bottom:10px;text-transform:uppercase;letter-spacing:.6px}
    .el2-order-row{display:flex;gap:8px;align-items:center;margin-bottom:6px}
    .el2-order-num{font-size:10px;font-weight:800;min-width:20px;text-align:center;background:#1e293b;border-radius:4px;padding:2px 6px;font-family:'JetBrains Mono',monospace}
    .el2-order-text{font-size:11px;color:#94a3b8}
    .el2-order-apis{font-size:9.5px;color:#475569;margin-left:28px;margin-top:-4px;margin-bottom:4px}
  </style>
  <div class="el2-center">
    <div class="el2-hub">JAVASCRIPT EVENT LOOP</div>
    <div class="el2-subtitle">Single-thread · Concorrência sem paralelismo · Call Stack + Queues</div>
  </div>
  <div style="text-align:center;color:#ef4444;font-size:20px;margin-bottom:12px">↓</div>
  <div class="el2-grid">
    <div class="el2-branch el2-green">
      <div class="el2-branch-title">Call Stack</div>
      <div class="el2-leaf"><b>Execution contexts</b> em LIFO</div>
      <div class="el2-leaf"><b>Stack frames</b> por chamada</div>
      <div class="el2-leaf"><b>Síncrono</b> — bloqueia tudo</div>
      <div class="el2-leaf"><b>Stack overflow</b> = recursão sem base</div>
      <div class="el2-leaf"><b>Vazia</b> → event loop age</div>
    </div>
    <div class="el2-branch el2-purple">
      <div class="el2-branch-title">Web APIs</div>
      <div class="el2-leaf"><b>setTimeout / setInterval</b></div>
      <div class="el2-leaf"><b>fetch</b> / XMLHttpRequest</div>
      <div class="el2-leaf"><b>DOM events</b> (click, input...)</div>
      <div class="el2-leaf"><b>requestAnimationFrame</b></div>
      <div class="el2-leaf">Rodam <b>fora</b> do thread JS</div>
    </div>
    <div class="el2-branch el2-amber">
      <div class="el2-branch-title">Macrotask Queue</div>
      <div class="el2-leaf"><b>setTimeout</b> / setInterval</div>
      <div class="el2-leaf"><b>I/O callbacks</b> (fs, net)</div>
      <div class="el2-leaf"><b>setImmediate</b> (Node.js)</div>
      <div class="el2-leaf"><b>MessageChannel</b> / postMessage</div>
      <div class="el2-leaf">1 task por iteração do loop</div>
    </div>
    <div class="el2-branch el2-blue">
      <div class="el2-branch-title">Microtask Queue</div>
      <div class="el2-leaf"><b>Promise.then / catch</b></div>
      <div class="el2-leaf"><b>queueMicrotask()</b></div>
      <div class="el2-leaf"><b>MutationObserver</b> (browser)</div>
      <div class="el2-leaf"><b>async/await</b> continuations</div>
      <div class="el2-leaf">Drena <b>tudo</b> antes de macrotask</div>
    </div>
    <div class="el2-branch">
      <div class="el2-branch-title">Ciclo do Event Loop</div>
      <div class="el2-leaf"><b>1.</b> Stack vazia?</div>
      <div class="el2-leaf"><b>2.</b> Drena microtasks (tudo)</div>
      <div class="el2-leaf"><b>3.</b> Render frame? (browser)</div>
      <div class="el2-leaf"><b>4.</b> Executa 1 macrotask</div>
      <div class="el2-leaf"><b>5.</b> Volta ao passo 1</div>
    </div>
    <div class="el2-branch el2-rose">
      <div class="el2-branch-title">Node.js Extras</div>
      <div class="el2-leaf"><b>process.nextTick</b> &gt; Promise</div>
      <div class="el2-leaf"><b>6 fases libuv</b>: timers→poll→check</div>
      <div class="el2-leaf"><b>setImmediate</b> na fase check</div>
      <div class="el2-leaf"><b>libuv thread pool</b> para I/O</div>
      <div class="el2-leaf"><b>worker_threads</b> para CPU-bound</div>
    </div>
  </div>
  <div class="el2-order">
    <div class="el2-order-title">Ordem de prioridade (alta → baixa)</div>
    <div class="el2-order-row">
      <span class="el2-order-num" style="color:#10B981">1</span>
      <span class="el2-order-text" style="color:#10B981">Call stack — código síncrono</span>
    </div>
    <div class="el2-order-row">
      <span class="el2-order-num" style="color:#ef4444">2</span>
      <span class="el2-order-text" style="color:#ef4444">process.nextTick (Node.js only)</span>
    </div>
    <div class="el2-order-apis">Cuidado: uso recursivo causa starvation de I/O</div>
    <div class="el2-order-row">
      <span class="el2-order-num" style="color:#3b82f6">3</span>
      <span class="el2-order-text" style="color:#3b82f6">Microtask queue — drena completamente</span>
    </div>
    <div class="el2-order-apis">Promise.then · queueMicrotask · MutationObserver · async/await</div>
    <div class="el2-order-row">
      <span class="el2-order-num" style="color:#a855f7">4</span>
      <span class="el2-order-text" style="color:#a855f7">Render frame (browser only)</span>
    </div>
    <div class="el2-order-apis">requestAnimationFrame → style → layout → paint → composite</div>
    <div class="el2-order-row">
      <span class="el2-order-num" style="color:#f59e0b">5</span>
      <span class="el2-order-text" style="color:#f59e0b">1 Macrotask por iteração</span>
    </div>
    <div class="el2-order-apis">setTimeout · setInterval · I/O callbacks · setImmediate (Node) · MessageChannel</div>
  </div>
</div>`,
      caption: "Mnemônico: S-M-R-M (Sync → Microtask → Render → Macrotask). Microtask drena TUDO antes de qualquer macrotask — é por isso que Promise.then sempre precede setTimeout(fn, 0).",
    },
    videos: [
      {
        title: "What the heck is the event loop anyway?",
        channel: "Philip Roberts — JSConf EU",
        url: "https://www.youtube.com/watch?v=8aGhZQkoFbQ",
        topic: "Fundamentos do event loop com o visualizador Loupe",
        note: "A palestra mais assistida sobre o assunto. Explica call stack, Web APIs e task queue de forma visual e acessível. Essencial para qualquer dev JS.",
      },
      {
        title: "In The Loop",
        channel: "Jake Archibald — JSConf Asia",
        url: "https://www.youtube.com/watch?v=cCOL7MC4Pl0",
        topic: "Tasks, microtasks, requestAnimationFrame e rendering",
        note: "A melhor explicação sobre a diferença entre microtask e macrotask, e como o render frame se encaixa no ciclo. Demonstrações ao vivo com código interativo.",
      },
      {
        title: "Node.js Event Loop Deep Dive",
        channel: "Bert Belder — Node.js Interactive",
        url: "https://www.youtube.com/watch?v=PNa9OMajl9I",
        topic: "Fases do event loop do Node.js e libuv",
        note: "Dive profundo nas 6 fases do libuv, diferenças entre setImmediate e setTimeout(0), e como process.nextTick se encaixa. Essencial para backend Node.js.",
      },
      {
        title: "JavaScript Async/Await — Event Loop Internals",
        channel: "Lydia Hallie",
        url: "https://www.youtube.com/watch?v=eiC58R16hb8",
        topic: "Como async/await se traduz em Promises e microtasks",
        note: "Visualizações animadas mostrando o que acontece internamente quando você usa await. Complementa o artigo da Lydia sobre event loop visualizado.",
      },
      {
        title: "Async JavaScript — From Callbacks to Promises to Async/Await",
        channel: "Traversy Media",
        url: "https://www.youtube.com/watch?v=PoRJizFvM7s",
        topic: "Evolução do modelo assíncrono em JavaScript",
        note: "Cobertura prática da evolução: callbacks → Promises → async/await, com exemplos de código reais. Bom para consolidar a base antes de estudar o event loop em profundidade.",
      },
    ],
    codeExamples: [
      {
        title: "setTimeout vs Promise — ordem de execução (micro vs macrotask)",
        description: "O exemplo mais cobrado em entrevistas. Demonstra por que Promise.then sempre executa antes de setTimeout(fn, 0), mesmo que ambos sejam assíncronos.",
        language: "javascript",
        code: `// Exemplo 1 — clássico de entrevista
console.log('1 - sync')

setTimeout(() => {
  console.log('2 - setTimeout (macrotask)')
}, 0)

Promise.resolve().then(() => {
  console.log('3 - Promise.then (microtask)')
})

queueMicrotask(() => {
  console.log('4 - queueMicrotask (microtask)')
})

console.log('5 - sync')

// Output: 1, 5, 3, 4, 2
// Fluxo: sync (1,5) → drena microtasks (3,4) → macrotask (2)

// Exemplo 2 — async/await (sugar para .then())
async function foo() {
  console.log('A - sync, antes do await')
  await Promise.resolve()
  console.log('C - microtask, depois do await')
}

foo()
console.log('B - sync, após chamar foo()')

// Output: A, B, C
// await suspende foo, libera thread → B executa → microtask retoma → C

// Exemplo 3 — microtask dentro de microtask (drena tudo antes de macro)
setTimeout(() => console.log('macro'), 0)
Promise.resolve()
  .then(() => {
    console.log('micro 1')
    return Promise.resolve() // nova microtask enfileirada
  })
  .then(() => console.log('micro 2')) // roda ANTES de 'macro'
console.log('sync')

// Output: sync, micro 1, micro 2, macro
// A drenagem de microtasks não para até a fila ficar vazia`,
      },
      {
        title: "Event loop starvation — problema e correção com chunking",
        description: "Demonstra como código CPU-bound trava o event loop e como a técnica de chunking com setTimeout libera o loop entre partes do trabalho.",
        language: "javascript",
        code: `// PROBLEMA: loop pesado bloqueia o event loop por segundos
function processHeavy(arr) {
  // Trava a call stack — nenhuma outra task pode rodar durante isso
  return arr.reduce((acc, x) => {
    let sum = 0
    for (let i = 0; i < 1000; i++) sum += Math.sqrt(x * i)
    return acc + sum
  }, 0)
}

const bigArray = Array.from({ length: 100_000 }, (_, i) => i)
processHeavy(bigArray) // UI congela, requests Node.js não atendidas

// SOLUÇÃO 1: chunking com setTimeout (libera o loop entre chunks)
async function processChunked(arr, chunkSize = 1000) {
  let result = 0
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    result += chunk.reduce((acc, x) => acc + Math.sqrt(x), 0)
    // Libera o event loop para processar clicks, timers, requests pendentes
    await new Promise(resolve => setTimeout(resolve, 0))
    console.log('Progresso:', Math.round((i / arr.length) * 100) + '%')
  }
  return result
}

processChunked(bigArray).then(result => console.log('Resultado:', result))

// SOLUÇÃO 2: Web Worker no browser (thread separada, sem bloquear UI)
const workerCode = \`
  self.onmessage = ({ data: arr }) => {
    const result = arr.reduce((acc, x) => acc + Math.sqrt(x), 0)
    self.postMessage(result)
  }
\`
const blob = new Blob([workerCode], { type: 'application/javascript' })
const worker = new Worker(URL.createObjectURL(blob))
worker.postMessage(bigArray)
worker.onmessage = ({ data }) => {
  console.log('Worker resultado:', data)
  worker.terminate()
}

// SOLUÇÃO 3: worker_threads no Node.js
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
if (isMainThread) {
  const w = new Worker(import.meta.url, { workerData: { arr: bigArray } })
  w.on('message', result => console.log('Thread resultado:', result))
} else {
  const result = workerData.arr.reduce((acc, x) => acc + Math.sqrt(x), 0)
  parentPort.postMessage(result)
}`,
      },
      {
        title: "async/await — microtask queue e paralelização de Promises",
        description: "Explora como async/await funciona internamente com a microtask queue, incluindo a armadilha do await sequencial em loop e patterns de paralelização corretos.",
        language: "javascript",
        code: `// 1. ARMADILHA: await em loop = N round-trips sequenciais
const urls = ['/api/1', '/api/2', '/api/3', '/api/4', '/api/5']

// ERRADO: aguarda cada fetch antes de iniciar o próximo
async function sequentialFetch() {
  const results = []
  for (const url of urls) {
    const res = await fetch(url)  // espera url[0] terminar antes de url[1]
    results.push(await res.json())
  }
  return results
  // Para 5 URLs de 100ms: ~500ms total (5 round-trips em série)
}

// CERTO: inicia todos simultaneamente — Promise.all
async function parallelFetch() {
  const results = await Promise.all(
    urls.map(url => fetch(url).then(r => r.json()))
  )
  return results
  // Para 5 URLs de 100ms: ~100ms total (1 round-trip paralelo)
}

// CERTO com tolerância a falhas: Promise.allSettled
async function safeFetch() {
  const settled = await Promise.allSettled(
    urls.map(url => fetch(url).then(r => r.json()))
  )
  return {
    successes: settled.filter(r => r.status === 'fulfilled').map(r => r.value),
    failures:  settled.filter(r => r.status === 'rejected').map(r => r.reason),
  }
}

// 2. Concorrência limitada (evita sobrecarregar o servidor)
async function fetchWithLimit(urls, concurrency = 3) {
  const results = []
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency)
    const batchResults = await Promise.all(
      batch.map(url => fetch(url).then(r => r.json()))
    )
    results.push(...batchResults)
  }
  return results
}

// 3. Timeout com Promise.race
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(\`Timeout após \${ms}ms\`)), ms)
  )
  return Promise.race([promise, timeout])
}

// Uso: falha depois de 5 segundos se fetch não responder
withTimeout(fetch('/api/data'), 5000)
  .then(res => res.json())
  .catch(err => console.error('Falhou:', err.message))

// 4. async generator com backpressure natural
async function* paginate(baseUrl) {
  let cursor = null
  do {
    const url = cursor ? \`\${baseUrl}?cursor=\${cursor}\` : baseUrl
    const { items, nextCursor } = await fetch(url).then(r => r.json())
    yield items         // pausa até o consumidor pedir mais
    cursor = nextCursor
  } while (cursor)
}

// Consumo: processa página por página sem carregar tudo em memória
for await (const page of paginate('/api/items')) {
  console.log('Página com', page.length, 'itens')
}`,
      },
    ],
    resources: [
      { title: "Jake Archibald — In The Loop (talk JSConf)", url: "https://www.youtube.com/watch?v=cCOL7MC4Pl0", kind: "video" },
      { title: "Loupe — visualizador interativo de event loop", url: "http://latentflip.com/loupe/", kind: "pratica" },
      { title: "MDN — Event loop", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop", kind: "docs" },
      { title: "Node.js docs — Event Loop, Timers e process.nextTick", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick", kind: "docs" },
      { title: "Lydia Hallie — JavaScript Visualized: Event Loop", url: "https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif", kind: "artigo" },
      { title: "HTML spec — Event loop processing model", url: "https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model", kind: "docs" },
      { title: "Tasks, microtasks, queues and schedules — Jake Archibald", url: "https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/", kind: "artigo" },
    ],
  }

export default eventLoop
