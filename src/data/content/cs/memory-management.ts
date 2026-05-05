import type { SkillContent } from "@/types"

const memoryManagement: SkillContent = {
    tagline: "Heap, stack, GC, leaks: como linguagens gerenciam memória e como não vazar.",
    why: "Senior precisa entender por que app cresce sem parar em prod, identificar leak (event listener, closure, cache infinito) e usar dev tools pra heap snapshot.",
    summary: "Memória divide em stack (frame de função, pequeno e rápido) e heap (objetos, gerenciado por GC em linguagens managed). GC traça alcance via roots; o que não é alcançável é coletado. Leaks acontecem quando você mantém referência desnecessária. Em JS/Node: closures, listeners, caches, timers vivos. Saber profile com DevTools/heapdump é diferencial.",
    keypoints: [
      { title: "Stack", body: "Frame por chamada de função. Cresce/encolhe rápido. Tamanho pequeno (1-8MB). Recursao profunda -> stack overflow." },
      { title: "Heap", body: "Objetos alocados dinamicamente. Gerenciado por GC ou manual (C/C++/Rust). Maior, mais lento que stack." },
      { title: "Garbage collection", body: "Tipos: mark-and-sweep, generational (jovem/velho), incremental, concurrent. V8 usa generational + mark-compact. Pause pode impactar latência." },
      { title: "Reachability", body: "GC parte das roots (globais, stack frames atuais) e marca tudo alcançável. Resto é coletado. Referência mantida = memória mantida." },
      { title: "Leaks comuns em JS", body: "Event listener não removido, closure capturando ref grande, cache sem TTL, setInterval esquecido, DOM detached referenciado por JS." },
      { title: "Closures", body: "Função que captura escopo externo. Útil mas perigoso: retem tudo que poderia ser usado. Cuidado em factories que criam muitas closures." },
      { title: "WeakMap / WeakSet", body: "Referencias fracas. GC pode coletar key se não houver outra ref forte. Bom pra cache atrelado a objeto sem prevenir colete." },
      { title: "Profile e debug", body: "Chrome DevTools -> Memory -> Heap snapshot. Compara dois snapshots, ve \"retained size\" e \"retainers\". Em Node: --inspect, heapdump npm package." },
    ],
    gotchas: [
      "Adicionar listener sem removeEventListener — se elemento sai do DOM mas listener tem closure ref, leak.",
      "setInterval sem clearInterval em SPA — handler vivo segura todo o escopo.",
      "Cache global sem LRU/TTL cresce sem limite.",
      "Usar Map/Set onde WeakMap resolveria — impede GC de coletar keys.",
      "Confundir \"objeto enorme\" com \"leak\" — pode só ser uso pesado. Leak = cresce sem parar.",
      "Async listeners (Promise) que esperam evento que nunca vem — Promise + closure ficam pendurados.",
      "Em React: missing cleanup em useEffect (subscriptions, timers).",
    ],
    interview: [
      { q: "Stack vs heap?", a: "<p><strong>Stack</strong>: aloca frames de função em LIFO. Rápido (push/pop). Tamanho pequeno (1-8MB). Variaveis primitivas e references.</p><p><strong>Heap</strong>: pool maior pra objetos. Aloca dinamicamente. Em JS, todos objetos vão no heap; GC limpa.</p><p>Stack overflow = recursão profunda. Out of memory = heap cheio.</p>" },
      { q: "O que causa memory leak em SPA?", a: "<ul><li><strong>Listeners</strong> não removidos quando componente desmonta.</li><li><strong>Timers</strong> (setInterval, setTimeout) ativos.</li><li><strong>Closures</strong> capturando refs grandes.</li><li><strong>Caches</strong> globais sem LRU/TTL.</li><li><strong>DOM detached</strong>: removido do DOM mas referenciado por JS.</li><li><strong>Subscriptions</strong> não canceladas (RxJS, eventEmitters).</li></ul>" },
      { q: "Como debuga leak em prod?", a: "<p>Pipeline:</p><ul><li>Reproduz: navegação repetida, ver heap crescer no DevTools Memory.</li><li>3 heap snapshots: inicial, após repetir, após repetir mais. Compara — objetos crescentes são suspeitos.</li><li>Ver \"retainers\": quem segura o objeto. Geralmente um array ou closure.</li><li>Em Node: heapdump + chrome://inspect. Ou clinic.js.</li></ul>" },
      { q: "O que é WeakMap e quando usaria?", a: "<p>Map cujo key é referência fraca. Se não há outra ref forte ao key, GC pode coletar (e o entry desaparece).</p><p>Use case: cache de metadata por objeto sem prevenir colete. Ex: \"para cada DOM node, guardo dados extras\". WeakMap não prende o node em memória.</p>" },
      { q: "V8 GC — generational, o que significa?", a: "<p>Hipotese: maioria dos objetos morre jovem. V8 separa heap em <strong>young</strong> (Scavenger, GC frequente, copia) e <strong>old</strong> (Mark-Sweep-Compact, GC raro).</p><p>Objeto sobrevive 2 GCs no young -> promovido pro old. Reduz pausa porque young é pequeno.</p>" },
      { q: "Como evita pausas longas de GC?", a: "<ul><li>Reduzir alocação no hot path (object pooling).</li><li>Evitar deep clone desnecessario.</li><li>Usar buffers reutilizaveis (Buffer.allocUnsafe + reuse).</li><li>Em Node: --max-old-space-size adequado, --expose-gc pra trigger manual em horario calmo.</li><li>Monitorar GC com --trace-gc ou perf_hooks.</li></ul>" },
    ],
    diagrams: [
      {
        title: "Stack vs Heap — e onde os leaks acontecem",
        html: `<style>
.mm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.mm-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.mm-sub{font-size:10px;color:#475569;margin:0 0 14px}
.mm-cols{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.mm-box{border-radius:8px;padding:12px;border:1.5px solid #334155}
.mm-box-title{font-size:10px;font-weight:700;text-transform:uppercase;margin-bottom:8px}
.mm-frame{border-radius:5px;padding:7px 10px;margin-bottom:4px;font-size:10px;line-height:1.5;font-family:'JetBrains Mono',monospace}
.mm-label{font-size:9px;font-weight:600;text-transform:uppercase;margin-bottom:4px;color:#475569}
.mm-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.mm-tip:hover .mm-tb{display:block}
.mm-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:210px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.mm-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
.mm-leaks{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px}
.mm-leaks-title{font-size:10px;font-weight:700;color:#ef4444;margin-bottom:8px}
.mm-leak{display:flex;gap:8px;font-size:10px;color:#94a3b8;margin-bottom:6px;line-height:1.5;align-items:flex-start}
.mm-leak-icon{color:#ef4444;flex-shrink:0;margin-top:1px}
.mm-leak-fix{color:#10B981;font-size:9px;margin-top:2px}
</style>
<div class="mm-wrap">
  <p class="mm-title">Stack vs Heap — modelo mental de memória em JS/Node</p>
  <p class="mm-sub">Passe o mouse nos termos para detalhes</p>
  <div class="mm-cols">
    <div class="mm-box" style="background:#1e293b;border-color:#10B98140">
      <div class="mm-box-title" style="color:#10B981">Stack <span style="color:#475569;font-weight:400;font-size:9px">— rápido, limitado (~8 MB)</span></div>
      <div class="mm-label">frames de chamada (LIFO)</div>
      <div class="mm-frame" style="background:#10B98115;color:#10B981;border:1px solid #10B98130">bar() → x=2, y=3</div>
      <div class="mm-frame" style="background:#10B98110;color:#86efac;border:1px solid #10B98120">foo() → n=10</div>
      <div class="mm-frame" style="background:#10B98108;color:#64748b;border:1px solid #10B98115">main() → result</div>
      <div style="font-size:9px;color:#475569;margin-top:8px;line-height:1.6">
        • <span class="mm-tip">Primitivos<span class="mm-tb">number, boolean, string pequena, null, undefined, symbol — armazenados por valor na stack.</span></span> e referências a objetos<br>
        • Liberado automaticamente ao retornar<br>
        • Overflow: recursão sem base case
      </div>
    </div>
    <div class="mm-box" style="background:#1e293b;border-color:#3b82f640">
      <div class="mm-box-title" style="color:#3b82f6">Heap <span style="color:#475569;font-weight:400;font-size:9px">— grande, gerenciado por GC</span></div>
      <div class="mm-label">objetos alocados dinamicamente</div>
      <div class="mm-frame" style="background:#3b82f615;color:#93c5fd;border:1px solid #3b82f630">{ id: 1, data: [...] }</div>
      <div class="mm-frame" style="background:#3b82f610;color:#6b95cd;border:1px solid #3b82f620">() => { closure ref }</div>
      <div class="mm-frame" style="background:#3b82f608;color:#475569;border:1px solid #3b82f615">[...array grande...]</div>
      <div style="font-size:9px;color:#475569;margin-top:8px;line-height:1.6">
        • <span class="mm-tip">GC generacional<span class="mm-tb">V8: objetos jovens ficam no "young space" (Scavenger GC frequente). Se sobrevivem 2 GCs, vão para "old space" (Mark-Sweep-Compact, mais raro).</span></span> (V8: young → old)<br>
        • Leak = referência desnecessária mantida<br>
        • Debug: heap snapshot no DevTools
      </div>
    </div>
  </div>
  <div class="mm-leaks">
    <div class="mm-leaks-title">⚠ Causas mais comuns de memory leak em JS</div>
    <div class="mm-leak">
      <div class="mm-leak-icon">▸</div>
      <div>
        <strong style="color:#e2e8f0">Event listener não removido</strong> — elemento sai do DOM mas handler tem closure capturando objetos grandes.<br>
        <div class="mm-leak-fix">✓ removeEventListener no cleanup / useEffect return</div>
      </div>
    </div>
    <div class="mm-leak">
      <div class="mm-leak-icon">▸</div>
      <div>
        <strong style="color:#e2e8f0">setInterval sem clearInterval</strong> — em SPA, handler vivo segura todo o escopo capturado.<br>
        <div class="mm-leak-fix">✓ clearInterval no unmount do componente</div>
      </div>
    </div>
    <div class="mm-leak">
      <div class="mm-leak-icon">▸</div>
      <div>
        <strong style="color:#e2e8f0">Cache global sem LRU/TTL</strong> — Map ou objeto crescendo sem limite em módulo singleton.<br>
        <div class="mm-leak-fix">✓ Use LRU-cache com tamanho máximo</div>
      </div>
    </div>
    <div class="mm-leak">
      <div class="mm-leak-icon">▸</div>
      <div>
        <strong style="color:#e2e8f0">Closure capturando contexto grande</strong> — factory cria muitas funções, cada uma retém o escopo inteiro do módulo.<br>
        <div class="mm-leak-fix">✓ Use WeakMap para associar dados a objetos sem prender referências</div>
      </div>
    </div>
  </div>
</div>`,
        caption: "Para debugar leak em produção: tire 3 heap snapshots (início, após uso, após mais uso) e compare os objetos que crescem. O painel 'Retainers' mostra quem está segurando a referência.",
      },
    ],
    resources: [
      { title: "V8 blog — Trash talk (Orinoco GC)", url: "https://v8.dev/blog/trash-talk", kind: "artigo" },
      { title: "MDN — Memory Management", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management", kind: "docs" },
      { title: "Brendan Gregg — Memory Profiling", url: "https://www.brendangregg.com/memoryflamegraphs.html", kind: "artigo" },
      { title: "Chrome DevTools — Memory", url: "https://developer.chrome.com/docs/devtools/memory", kind: "docs" },
      { title: "Node.js diagnostics — heap snapshots", url: "https://nodejs.org/en/learn/diagnostics/memory/using-heap-snapshot", kind: "docs" },
    ],
  }

export default memoryManagement
