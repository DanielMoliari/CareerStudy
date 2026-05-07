import type { SkillContent } from "@/types"

const bigO: SkillContent = {
    tagline: "Notação para descrever crescimento de tempo/memória conforme o input cresce — base de toda análise de algoritmo.",
    why: "Entrevistador sempre pergunta 'qual a complexidade?'. Saber explicar O(n log n) com exemplo real (mergesort, heap, binary search dentro de loop) é o mínimo para vaga pleno. Sênior precisa ir além: distinguir pior caso vs amortizado vs esperado, analisar recursão com recorrência (Master Theorem), e saber quando constante importa na prática. Sem dominar Big-O, você não consegue justificar nenhuma escolha de algoritmo ou estrutura de dados.",
    prerequisite: "Funções básicas: log, exponencial, fatorial. Saber o que é loop simples e loop aninhado. Recursão básica (call stack). Não precisa de matemática avançada — mas precisa entender intuitivamente que log n cresce muito mais devagar que n.",
    summary: "Big-O descreve o comportamento assintótico no pior caso: o que acontece quando n cresce sem limite. Ignora constantes e termos menores (O(2n) = O(n), O(n² + n) = O(n²)). Sênior precisa identificar complexidade de código rapidamente, conhecer trade-off espaço × tempo, saber calcular recursão via Master Theorem, e entender quando constantes importam na prática (cache locality, branch prediction, tamanho de n).",
    howToStudy: "<strong>Tem 30 minutos?</strong> Abra o diagrama de curvas de crescimento, anote as 7 complexidades de cabeça, depois leia o cheatsheet de derivação e treine as Q&As principais.<br><br><strong>Tem um fim de semana?</strong> Para cada complexidade: encontre 3 algoritmos reais com aquela complexidade, derive a complexidade do código na mão, verifique com o diagrama de análise de código.<br><br><strong>Quer dominar de verdade?</strong> Sempre que resolver um problema no LeetCode, force-se a anunciar tempo E espaço em voz alta antes de submeter. Depois compare com a editorial. Erros comuns se tornam evidentes rapidamente.",
    diagrams: [
      {
        title: "Curvas de crescimento — comparação visual para n = 10, 100 e 1.000",
        html: `<style>
.bigo1-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.bigo1-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.bigo1-sub{font-size:10px;color:#475569;margin:0 0 14px}
.bigo1-controls{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.bigo1-btn{background:#1e293b;border:1.5px solid #334155;border-radius:6px;color:#94a3b8;font-size:10px;padding:5px 12px;cursor:pointer;transition:all .2s;font-family:inherit}
.bigo1-btn:hover,.bigo1-btn.active{border-color:#10B981;color:#10B981;background:#10B98110}
.bigo1-chart{display:flex;flex-direction:column;gap:8px}
.bigo1-row{display:flex;align-items:center;gap:10px}
.bigo1-label{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;min-width:80px;text-align:right;flex-shrink:0}
.bigo1-bar-wrap{flex:1;background:#1e293b;border-radius:4px;height:22px;position:relative;overflow:hidden}
.bigo1-bar{height:100%;border-radius:4px;transition:width .5s ease;display:flex;align-items:center;padding-left:6px;font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(0,0,0,.7);font-weight:700;min-width:2px;white-space:nowrap;overflow:hidden}
.bigo1-val{font-family:'JetBrains Mono',monospace;font-size:9px;color:#64748b;min-width:80px;flex-shrink:0}
.bigo1-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.bigo1-tip:hover .bigo1-tb{display:block}
.bigo1-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:40;color:#94a3b8;width:230px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.8);white-space:normal}
.bigo1-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
.bigo1-note{background:#1e293b;border-radius:7px;padding:10px 13px;margin-top:12px;font-size:10px;color:#94a3b8;line-height:1.7}
</style>
<div class="bigo1-wrap">
  <p class="bigo1-title">Curvas de crescimento — quanto cada complexidade cresce</p>
  <p class="bigo1-sub">Selecione n para ver como as operações escalam</p>
  <div class="bigo1-controls">
    <button class="bigo1-btn active" onclick="bigo1Show(10,this)">n = 10</button>
    <button class="bigo1-btn" onclick="bigo1Show(100,this)">n = 100</button>
    <button class="bigo1-btn" onclick="bigo1Show(1000,this)">n = 1.000</button>
    <button class="bigo1-btn" onclick="bigo1Show(10000,this)">n = 10.000</button>
  </div>
  <div class="bigo1-chart" id="bigo1-chart"></div>
  <div class="bigo1-note" id="bigo1-note">
    Com n=10: todas as complexidades são aceitáveis — a diferença parece pequena. O impacto de escolha errada aparece quando n cresce.
  </div>
</div>
<script>
(function(){
  const complexities=[
    {label:'O(1)',color:'#10B981',fn:n=>1,tip:'Constante: hash.get(), array[i], push/pop. Não depende de n.'},
    {label:'O(log n)',color:'#34d399',fn:n=>Math.round(Math.log2(n)),tip:'Logarítmico: binary search, BST balanceada, heap insert/extract.'},
    {label:'O(n)',color:'#86efac',fn:n=>n,tip:'Linear: scan, max/min, sum, single loop. O padrão alvo.'},
    {label:'O(n log n)',color:'#fbbf24',fn:n=>Math.round(n*Math.log2(n)),tip:'Linearítmico: mergesort, heapsort, FFT. Limite inferior para sort comparativo.'},
    {label:'O(n²)',color:'#f97316',fn:n=>n*n,tip:'Quadrático: loop aninhado no mesmo input. Aceitável para n<1000.'},
    {label:'O(2ⁿ)',color:'#ef4444',fn:n=>Math.min(Math.pow(2,n),1e15),tip:'Exponencial: subsets, fibonacci sem memo. Prático apenas para n≤25.'},
    {label:'O(n!)',color:'#a855f7',fn:n=>Math.min([1,1,2,6,24,120,720,5040,40320,362880,3628800][n]||Infinity,1e15),tip:'Fatorial: permutações brutas. Limite real: n≤10.'},
  ];
  const notes={
    10:'Com n=10: todas as complexidades parecem aceitáveis. Mas O(2ⁿ) já gera 1.024 ops — 100x mais que O(n).',
    100:'Com n=100: O(n²) chega a 10.000 ops. O(2ⁿ) e O(n!) são completamente inviáveis — valores astronômicos.',
    1000:'Com n=1.000: O(n²) = 1M ops (lento). O(n log n) = 10k (ótimo). A distância entre complexidades fica óbvia.',
    10000:'Com n=10.000: O(n²) = 100M ops (segundos). O(n) = 10k (milissegundos). Essa diferença determina se sua aplicação escala.',
  };
  function fmt(v){
    if(v>=1e12) return '>10¹²';
    if(v>=1e9) return (v/1e9).toFixed(1)+'B';
    if(v>=1e6) return (v/1e6).toFixed(1)+'M';
    if(v>=1e3) return (v/1e3).toFixed(1)+'k';
    return v.toString();
  }
  function bigo1Show(n, btn){
    document.querySelectorAll('.bigo1-btn').forEach(b=>b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    const vals=complexities.map(c=>({...c,val:c.fn(n)}));
    const maxVal=Math.max(...vals.map(v=>v.val));
    const chart=document.getElementById('bigo1-chart');
    chart.innerHTML=vals.map(c=>{
      const pct=maxVal===0?0:Math.min(100,Math.round((c.val/maxVal)*100));
      const pw=Math.max(2,pct);
      return \`<div class="bigo1-row">
        <div class="bigo1-label" style="color:\${c.color}"><span class="bigo1-tip">\${c.label}<span class="bigo1-tb">\${c.tip}</span></span></div>
        <div class="bigo1-bar-wrap">
          <div class="bigo1-bar" style="width:\${pw}%;background:\${c.color}">\${pw>20?fmt(c.val):''}</div>
        </div>
        <div class="bigo1-val">\${fmt(c.val)} ops</div>
      </div>\`;
    }).join('');
    const note=document.getElementById('bigo1-note');
    if(note) note.textContent=notes[n]||'';
  }
  window.bigo1Show=bigo1Show;
  bigo1Show(10,null);
})();
</script>`,
        caption: "A curva mais importante de memorizar: entre O(n log n) e O(n²) existe uma diferença de 100x para n=1.000 e de 50.000x para n=1.000.000.",
      },
      {
        title: "Complexidades de operações por estrutura de dados",
        html: `<style>
.bigo2-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.bigo2-h{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.bigo2-sub{font-family:'Space Grotesk',sans-serif;font-size:10px;color:#475569;margin:0 0 14px}
.bigo2-table{width:100%;border-collapse:collapse;font-size:9.5px}
.bigo2-table th{background:#1e293b;color:#94a3b8;padding:7px 9px;text-align:center;font-weight:700;border-bottom:2px solid #334155;border-right:1px solid #0f172a;white-space:nowrap}
.bigo2-table th:first-child{text-align:left;min-width:110px}
.bigo2-table td{padding:6px 9px;border-bottom:1px solid #1e293b;border-right:1px solid #0f172a;text-align:center;font-weight:600}
.bigo2-table td:first-child{text-align:left;color:#94a3b8;font-weight:400;font-family:'Space Grotesk',sans-serif}
.bigo2-table tr:hover td{background:#1e293b80}
.g1{color:#10B981}.g2{color:#34d399}.g3{color:#86efac}.cy{color:#fbbf24}.co{color:#f97316}.cr{color:#ef4444}
.bigo2-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.bigo2-tip:hover .bigo2-tb{display:block}
.bigo2-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:-10px;background:#020617;border:1px solid #334155;border-radius:8px;padding:9px 12px;font-size:10px;line-height:1.6;z-index:40;color:#94a3b8;width:230px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.8);white-space:normal;font-family:'Space Grotesk',sans-serif}
.bigo2-tb::after{content:'';position:absolute;top:100%;left:14px;border:5px solid transparent;border-top-color:#334155}
.bigo2-sort{margin-top:14px}
.bigo2-sort-title{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;color:#10B981;margin-bottom:8px;text-transform:uppercase;letter-spacing:.07em}
.bigo2-sort-table{width:100%;border-collapse:collapse;font-size:9.5px}
.bigo2-sort-table th{background:#1e293b;color:#94a3b8;padding:6px 9px;font-weight:600;border-bottom:1px solid #334155;text-align:center}
.bigo2-sort-table th:first-child{text-align:left}
.bigo2-sort-table td{padding:5px 9px;border-bottom:1px solid #1e293b;text-align:center;font-weight:600}
.bigo2-sort-table td:first-child{text-align:left;color:#94a3b8;font-weight:400;font-family:'Space Grotesk',sans-serif}
</style>
<div class="bigo2-wrap">
  <p class="bigo2-h">Complexidades por estrutura de dados</p>
  <p class="bigo2-sub">Cores: verde = ótimo · amarelo = razoável · vermelho = evitar. * = amortizado</p>
  <table class="bigo2-table">
    <thead>
      <tr><th>Estrutura</th><th>Access</th><th>Search</th><th>Insert</th><th>Delete</th><th>Espaço</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="bigo2-tip">Array<span class="bigo2-tb">Cache-friendly. Acesso O(1) por índice. Insert/delete no meio exige shift de elementos: O(n).</span></span></td>
        <td class="g1">O(1)</td><td class="cr">O(n)</td><td class="co">O(n)</td><td class="co">O(n)</td><td class="g1">O(n)</td>
      </tr>
      <tr>
        <td><span class="bigo2-tip">ArrayList dinâmico<span class="bigo2-tb">Append amortizado O(1) — quando expande, copia tudo mas acontece raramente (a cada dobrar de capacidade).</span></span></td>
        <td class="g1">O(1)</td><td class="cr">O(n)</td><td class="g1">O(1)*</td><td class="co">O(n)</td><td class="g1">O(n)</td>
      </tr>
      <tr>
        <td><span class="bigo2-tip">Linked list<span class="bigo2-tb">Insert/delete O(1) se você já tem o nó. Search sempre O(n). Cache-unfriendly (memória não contígua).</span></span></td>
        <td class="cr">O(n)</td><td class="cr">O(n)</td><td class="g1">O(1)</td><td class="g1">O(1)</td><td class="g1">O(n)</td>
      </tr>
      <tr>
        <td><span class="bigo2-tip">Hash map/set<span class="bigo2-tb">O(1) amortizado. Pior caso O(n) com colisões ruins. Python dict, JS Map, Java HashMap.</span></span></td>
        <td class="g1">O(1)*</td><td class="g1">O(1)*</td><td class="g1">O(1)*</td><td class="g1">O(1)*</td><td class="g1">O(n)</td>
      </tr>
      <tr>
        <td><span class="bigo2-tip">BST balanceada<span class="bigo2-tb">AVL ou Red-Black tree. Garante O(log n) em todas operações. Mantém ordem — pode iterar ordenado em O(n).</span></span></td>
        <td class="g2">O(log n)</td><td class="g2">O(log n)</td><td class="g2">O(log n)</td><td class="g2">O(log n)</td><td class="g1">O(n)</td>
      </tr>
      <tr>
        <td><span class="bigo2-tip">Heap (min/max)<span class="bigo2-tb">Peek O(1). Insert e extract O(log n). Search arbitrária O(n) — heap não é para busca, é para prioridade.</span></span></td>
        <td class="g1">O(1)*</td><td class="cr">O(n)</td><td class="g2">O(log n)</td><td class="g2">O(log n)</td><td class="g1">O(n)</td>
      </tr>
      <tr>
        <td><span class="bigo2-tip">Trie<span class="bigo2-tb">Operações em O(m) onde m = comprimento da string. Excelente para prefixo, mas consome mais espaço que hash.</span></span></td>
        <td class="g1">O(m)</td><td class="g1">O(m)</td><td class="g1">O(m)</td><td class="g1">O(m)</td><td class="co">O(n·m)</td>
      </tr>
      <tr>
        <td><span class="bigo2-tip">Grafo adj list<span class="bigo2-tb">BFS/DFS em O(V+E). Melhor para grafos esparsos. Adj matrix gasta O(V²) de espaço mas dá acesso O(1).</span></span></td>
        <td class="g3">O(V)</td><td class="co">O(V+E)</td><td class="g1">O(1)</td><td class="cy">O(E)</td><td class="g1">O(V+E)</td>
      </tr>
    </tbody>
  </table>

  <div class="bigo2-sort">
    <div class="bigo2-sort-title">Algoritmos de sort — complexidades</div>
    <table class="bigo2-sort-table">
      <thead><tr><th>Algoritmo</th><th>Melhor</th><th>Médio</th><th>Pior</th><th>Espaço</th><th>Estável?</th></tr></thead>
      <tbody>
        <tr><td><span class="bigo2-tip">Merge sort<span class="bigo2-tb">Divide e conquista. Garantido O(n log n) em todos casos. Estável. Usa O(n) espaço auxiliar.</span></span></td><td class="g2">O(n log n)</td><td class="g2">O(n log n)</td><td class="g2">O(n log n)</td><td class="cy">O(n)</td><td style="color:#10B981">Sim</td></tr>
        <tr><td><span class="bigo2-tip">Quick sort<span class="bigo2-tb">Pior caso O(n²) com pivot ruim (array já ordenado). Na prática melhor que merge em cache. TimSort usa ambos.</span></span></td><td class="g2">O(n log n)</td><td class="g2">O(n log n)</td><td class="cr">O(n²)</td><td class="g2">O(log n)</td><td style="color:#ef4444">Não</td></tr>
        <tr><td><span class="bigo2-tip">Heap sort<span class="bigo2-tb">Garantido O(n log n). In-place. Mas cache-unfriendly — pior constante que quicksort na prática.</span></span></td><td class="g2">O(n log n)</td><td class="g2">O(n log n)</td><td class="g2">O(n log n)</td><td class="g1">O(1)</td><td style="color:#ef4444">Não</td></tr>
        <tr><td><span class="bigo2-tip">TimSort<span class="bigo2-tb">Python sort() e Java Arrays.sort(). Híbrido merge+insertion. Explora sequências já ordenadas (runs). O(n) em dados quase ordenados.</span></span></td><td class="g3">O(n)</td><td class="g2">O(n log n)</td><td class="g2">O(n log n)</td><td class="cy">O(n)</td><td style="color:#10B981">Sim</td></tr>
        <tr><td>Counting sort</td><td class="g3">O(n+k)</td><td class="g3">O(n+k)</td><td class="g3">O(n+k)</td><td class="cy">O(k)</td><td style="color:#10B981">Sim</td></tr>
        <tr><td>Bubble sort</td><td class="g3">O(n)</td><td class="cr">O(n²)</td><td class="cr">O(n²)</td><td class="g1">O(1)</td><td style="color:#10B981">Sim</td></tr>
      </tbody>
    </table>
  </div>
</div>`,
        caption: "Memorize: para sort genérico, O(n log n) é o limite inferior teórico com comparações. Counting/Radix sort quebram esse limite com restrições no input.",
      },
      {
        title: "Análise de código — como derivar Big-O de loops, recursão e chamadas",
        html: `<style>
.bigo3-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.bigo3-h{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.bigo3-sub{font-size:10px;color:#475569;margin:0 0 14px}
.bigo3-sec{margin-bottom:14px}
.bigo3-sec-title{font-size:10px;font-weight:700;color:#10B981;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #1e293b}
.bigo3-ex{display:flex;gap:10px;margin-bottom:8px;align-items:flex-start}
.bigo3-code{font-family:'JetBrains Mono',monospace;font-size:9px;color:#94a3b8;background:#1e293b;border-radius:6px;padding:9px 11px;line-height:1.7;flex:1;white-space:pre;min-width:0;overflow-x:auto}
.bigo3-analysis{font-size:10px;flex:1;min-width:0}
.bigo3-result{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;margin-bottom:5px}
.bigo3-why{font-size:9px;color:#94a3b8;line-height:1.6}
.bigo3-rules{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.bigo3-rule{background:#1e293b;border:1px solid #334155;border-radius:7px;padding:9px 11px}
.bigo3-rule-title{font-size:10px;font-weight:700;color:#e2e8f0;margin-bottom:4px}
.bigo3-rule-body{font-size:9px;color:#94a3b8;line-height:1.6}
.bigo3-rule-ex{font-family:'JetBrains Mono',monospace;font-size:9px;color:#10B981;margin-top:3px}
</style>
<div class="bigo3-wrap">
  <p class="bigo3-h">Análise de código — como derivar complexidade</p>
  <p class="bigo3-sub">Exemplos anotados com raciocínio passo a passo</p>

  <div class="bigo3-sec">
    <div class="bigo3-sec-title">Exemplos de código → Big-O</div>

    <div class="bigo3-ex">
      <div class="bigo3-code">for (let i = 0; i &lt; n; i++)    // n iterações
  for (let j = 0; j &lt; n; j++)  // n iterações cada
    sum += arr[i][j]            // O(1)</div>
      <div class="bigo3-analysis">
        <div class="bigo3-result" style="color:#f97316">O(n²)</div>
        <div class="bigo3-why">Loop externo: n. Loop interno: n. Total: n × n = n². Regra: loops sequencialmente aninhados no mesmo input → multiplica.</div>
      </div>
    </div>

    <div class="bigo3-ex">
      <div class="bigo3-code">for (let i = 0; i &lt; n; i++) sum++  // O(n)
for (let j = 0; j &lt; n; j++) max++  // O(n)</div>
      <div class="bigo3-analysis">
        <div class="bigo3-result" style="color:#86efac">O(n)</div>
        <div class="bigo3-why">Loops sequenciais (não aninhados): soma as complexidades. O(n) + O(n) = O(2n) = O(n). Regra: soma → fica com o maior termo.</div>
      </div>
    </div>

    <div class="bigo3-ex">
      <div class="bigo3-code">function rec(n) {
  if (n &lt;= 1) return 1
  return rec(n-1) + rec(n-1)  // 2 chamadas recursivas
}</div>
      <div class="bigo3-analysis">
        <div class="bigo3-result" style="color:#ef4444">O(2ⁿ)</div>
        <div class="bigo3-why">Cada chamada faz 2 subchamadas. Árvore de recursão tem 2^n folhas. Sem memo → exponencial. Com memo → O(n).</div>
      </div>
    </div>

    <div class="bigo3-ex">
      <div class="bigo3-code">function binarySearch(arr, t, lo, hi) {
  if (lo &gt; hi) return -1
  const mid = (lo+hi) >> 1
  if (arr[mid]===t) return mid
  if (arr[mid]&lt;t) return binarySearch(arr,t,mid+1,hi)
  return binarySearch(arr,t,lo,mid-1)
}</div>
      <div class="bigo3-analysis">
        <div class="bigo3-result" style="color:#34d399">O(log n)</div>
        <div class="bigo3-why">A cada chamada, descarta metade do input. T(n) = T(n/2) + O(1). Pela Master Theorem (caso 2): O(log n).</div>
      </div>
    </div>

    <div class="bigo3-ex">
      <div class="bigo3-code">for (let i = 0; i &lt; n; i++)
  for (let j = i; j &lt; n; j++)  // j começa em i
    process(i, j)</div>
      <div class="bigo3-analysis">
        <div class="bigo3-result" style="color:#f97316">O(n²)</div>
        <div class="bigo3-why">Iterações: n + (n-1) + ... + 1 = n(n+1)/2. Big-O ignora constantes: O(n²). Não confunda com O(n) só porque j começa em i.</div>
      </div>
    </div>

    <div class="bigo3-ex">
      <div class="bigo3-code">function mergeSort(arr) {
  if (arr.length &lt;= 1) return arr
  const mid = arr.length >> 1
  const L = mergeSort(arr.slice(0, mid))   // T(n/2)
  const R = mergeSort(arr.slice(mid))      // T(n/2)
  return merge(L, R)                       // O(n)
}</div>
      <div class="bigo3-analysis">
        <div class="bigo3-result" style="color:#fbbf24">O(n log n)</div>
        <div class="bigo3-why">T(n) = 2T(n/2) + O(n). Master Theorem caso 2: a=2, b=2, f(n)=n. n^(log₂2)=n. Como f(n)=Θ(n^log_b(a)) → O(n log n).</div>
      </div>
    </div>
  </div>

  <div class="bigo3-sec">
    <div class="bigo3-sec-title">Regras de derivação</div>
    <div class="bigo3-rules">
      <div class="bigo3-rule">
        <div class="bigo3-rule-title">Drop constants</div>
        <div class="bigo3-rule-body">Constantes somem em Big-O.</div>
        <div class="bigo3-rule-ex">O(2n) = O(n) · O(5n²) = O(n²)</div>
      </div>
      <div class="bigo3-rule">
        <div class="bigo3-rule-title">Drop smaller terms</div>
        <div class="bigo3-rule-body">Quando n→∞, só o maior termo importa.</div>
        <div class="bigo3-rule-ex">O(n² + n) = O(n²)</div>
      </div>
      <div class="bigo3-rule">
        <div class="bigo3-rule-title">Loops aninhados → multiplica</div>
        <div class="bigo3-rule-body">for i in n: for j in m: → O(n·m)</div>
        <div class="bigo3-rule-ex">for n: for n: → O(n²)</div>
      </div>
      <div class="bigo3-rule">
        <div class="bigo3-rule-title">Loops sequenciais → soma</div>
        <div class="bigo3-rule-body">for n: ... ; for m: ... → O(n+m)</div>
        <div class="bigo3-rule-ex">for n: O(n) ; for n: O(n) → O(n)</div>
      </div>
      <div class="bigo3-rule">
        <div class="bigo3-rule-title">Log de qual base?</div>
        <div class="bigo3-rule-body">Base não importa em Big-O — é constante.</div>
        <div class="bigo3-rule-ex">O(log₂n) = O(log₁₀n) = O(log n)</div>
      </div>
      <div class="bigo3-rule">
        <div class="bigo3-rule-title">Recursão → árvore</div>
        <div class="bigo3-rule-body">Desenhe a árvore de chamadas. Total = nós × trabalho por nó.</div>
        <div class="bigo3-rule-ex">T(n)=2T(n/2)+n → O(n log n)</div>
      </div>
    </div>
  </div>
</div>`,
        caption: "Regra prática: toda vez que ver um loop, pergunte 'quantas iterações faz?'. Toda recursão: 'qual a profundidade e quantos nós na árvore?'.",
      },
      {
        title: "Master Theorem — recorrências e suas soluções",
        html: `<style>
.bigo4-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.bigo4-h{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.bigo4-sub{font-size:10px;color:#475569;margin:0 0 14px}
.bigo4-formula{background:#1e293b;border:1px solid #10B98140;border-radius:8px;padding:12px;margin-bottom:12px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#86efac;text-align:center;line-height:1.7}
.bigo4-cases{display:grid;grid-template-columns:1fr;gap:8px;margin-bottom:14px}
.bigo4-case{background:#1e293b;border-left:3px solid #10B981;border-radius:6px;padding:10px 13px}
.bigo4-case-title{font-size:11px;font-weight:700;color:#10B981;margin-bottom:4px}
.bigo4-case-cond{font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#fbbf24;margin-bottom:3px}
.bigo4-case-result{font-family:'JetBrains Mono',monospace;font-size:10px;color:#86efac;font-weight:700;margin-bottom:5px}
.bigo4-case-body{font-size:9.5px;color:#94a3b8;line-height:1.6}
.bigo4-ex-title{font-size:10px;font-weight:700;color:#10B981;text-transform:uppercase;letter-spacing:.08em;margin:14px 0 8px}
.bigo4-ex-row{display:grid;grid-template-columns:1fr 1.5fr 0.7fr;gap:8px;background:#1e293b;border-radius:6px;padding:8px 11px;margin-bottom:5px;align-items:center;font-size:9.5px}
.bigo4-ex-name{font-weight:700;color:#e2e8f0}
.bigo4-ex-rec{font-family:'JetBrains Mono',monospace;color:#94a3b8}
.bigo4-ex-result{font-family:'JetBrains Mono',monospace;font-weight:700;color:#86efac;text-align:right}
</style>
<div class="bigo4-wrap">
  <p class="bigo4-h">Master Theorem — solução fechada para recorrências</p>
  <p class="bigo4-sub">Para algoritmos divide-and-conquer: divide o problema em a subproblemas de tamanho n/b, com f(n) de trabalho extra</p>

  <div class="bigo4-formula">T(n) = a · T(n/b) + f(n)<br><span style="color:#64748b;font-size:9px">a ≥ 1 (subproblemas) · b > 1 (fator de redução) · f(n) (trabalho fora da recursão)</span></div>

  <div class="bigo4-cases">
    <div class="bigo4-case">
      <div class="bigo4-case-title">Caso 1 — recursão domina</div>
      <div class="bigo4-case-cond">Se f(n) = O(n^c) com c &lt; log_b(a):</div>
      <div class="bigo4-case-result">T(n) = Θ(n^log_b(a))</div>
      <div class="bigo4-case-body">A árvore de recursão tem mais trabalho nas folhas. Trabalho de combinação é desprezível.</div>
    </div>
    <div class="bigo4-case">
      <div class="bigo4-case-title">Caso 2 — recursão e combinação balanceadas</div>
      <div class="bigo4-case-cond">Se f(n) = Θ(n^c · log^k n) com c = log_b(a):</div>
      <div class="bigo4-case-result">T(n) = Θ(n^c · log^(k+1) n)</div>
      <div class="bigo4-case-body">Trabalho por nível é constante. A altura da árvore (log n) determina o fator extra.</div>
    </div>
    <div class="bigo4-case">
      <div class="bigo4-case-title">Caso 3 — combinação domina</div>
      <div class="bigo4-case-cond">Se f(n) = Ω(n^c) com c &gt; log_b(a) e regularidade:</div>
      <div class="bigo4-case-result">T(n) = Θ(f(n))</div>
      <div class="bigo4-case-body">Trabalho de combinação é o gargalo. A raiz da árvore domina o custo total.</div>
    </div>
  </div>

  <div class="bigo4-ex-title">Exemplos clássicos</div>
  <div class="bigo4-ex-row">
    <div class="bigo4-ex-name">Merge Sort</div>
    <div class="bigo4-ex-rec">T(n) = 2T(n/2) + O(n) · log_b(a)=1 · caso 2</div>
    <div class="bigo4-ex-result">O(n log n)</div>
  </div>
  <div class="bigo4-ex-row">
    <div class="bigo4-ex-name">Binary Search</div>
    <div class="bigo4-ex-rec">T(n) = T(n/2) + O(1) · log_b(a)=0 · caso 2</div>
    <div class="bigo4-ex-result">O(log n)</div>
  </div>
  <div class="bigo4-ex-row">
    <div class="bigo4-ex-name">Karatsuba (mult)</div>
    <div class="bigo4-ex-rec">T(n) = 3T(n/2) + O(n) · log₂3 ≈ 1.58 · caso 1</div>
    <div class="bigo4-ex-result">O(n^1.58)</div>
  </div>
  <div class="bigo4-ex-row">
    <div class="bigo4-ex-name">Strassen (matrix)</div>
    <div class="bigo4-ex-rec">T(n) = 7T(n/2) + O(n²) · log₂7 ≈ 2.81 · caso 1</div>
    <div class="bigo4-ex-result">O(n^2.81)</div>
  </div>
  <div class="bigo4-ex-row">
    <div class="bigo4-ex-name">Tree traversal</div>
    <div class="bigo4-ex-rec">T(n) = 2T(n/2) + O(1) · log_b(a)=1 · caso 1</div>
    <div class="bigo4-ex-result">O(n)</div>
  </div>
  <div class="bigo4-ex-row">
    <div class="bigo4-ex-name">Quick Sort (avg)</div>
    <div class="bigo4-ex-rec">T(n) = 2T(n/2) + O(n) · log_b(a)=1 · caso 2</div>
    <div class="bigo4-ex-result">O(n log n)</div>
  </div>
</div>`,
        caption: "Decore os 3 casos. Em entrevista, identificar a=número de subchamadas, b=fator de redução, f(n)=trabalho extra é tudo que precisa para classificar.",
      },
    ],
    cheatsheet: {
      title: "Cheatsheet — Big-O: regras, complexidades e análise rápida",
      html: `<style>
.bigo-cs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.bigo-cs-h{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.bigo-cs-sub{font-family:'Space Grotesk',sans-serif;font-size:10px;color:#475569;margin:0 0 14px}
.bigo-cs-sec{margin-bottom:14px}
.bigo-cs-sec-title{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;color:#10B981;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #1e293b}
.bigo-cs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.bigo-cs-card{background:#1e293b;border:1px solid #334155;border-radius:7px;padding:9px 11px}
.bigo-cs-ct{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:600;color:#e2e8f0;margin-bottom:5px}
.bigo-cs-body{font-size:9.5px;color:#94a3b8;line-height:1.7}
.bigo-cs-rule{background:#10B98110;border:1px solid #10B98130;border-radius:5px;padding:6px 10px;font-family:'Space Grotesk',sans-serif;font-size:10px;color:#10B981;margin-bottom:5px;line-height:1.5}
.bigo-cs-table{width:100%;border-collapse:collapse;font-size:9.5px}
.bigo-cs-table th{background:#1e293b;color:#94a3b8;padding:6px 8px;text-align:left;font-weight:600;border-bottom:1px solid #334155}
.bigo-cs-table td{padding:5px 8px;border-bottom:1px solid #1e293b;color:#94a3b8;line-height:1.5}
.bigo-cs-table td:first-child{font-weight:700;font-family:'JetBrains Mono',monospace}
.g1{color:#10B981}.g2{color:#34d399}.g3{color:#86efac}.cy{color:#fbbf24}.co{color:#f97316}.cr{color:#ef4444}.cp{color:#a855f7}
</style>
<div class="bigo-cs-wrap">
  <p class="bigo-cs-h">Cheatsheet de Big-O</p>
  <p class="bigo-cs-sub">Referência rápida para entrevista — regras, complexidades e análise</p>

  <div class="bigo-cs-sec">
    <div class="bigo-cs-sec-title">Regras de ouro</div>
    <div class="bigo-cs-rule">Drop constants: O(5n²) = O(n²) · O(2n + 3) = O(n)</div>
    <div class="bigo-cs-rule">Drop smaller terms: O(n² + n) = O(n²) · O(n log n + n) = O(n log n)</div>
    <div class="bigo-cs-rule">Loops aninhados mesmo input → multiplica: for n { for n { } } = O(n²)</div>
    <div class="bigo-cs-rule">Loops sequenciais → soma depois drop: for n { } + for n { } = O(2n) = O(n)</div>
    <div class="bigo-cs-rule">Base do log não importa: O(log₂n) = O(ln n) = O(log n)</div>
    <div class="bigo-cs-rule">Sempre anuncie TEMPO e ESPAÇO separadamente em entrevista</div>
  </div>

  <div class="bigo-cs-sec">
    <div class="bigo-cs-sec-title">Limite de n por complexidade aceitável</div>
    <table class="bigo-cs-table">
      <thead><tr><th>Complexidade</th><th>n máx prático</th><th>Exemplos</th></tr></thead>
      <tbody>
        <tr><td class="g1">O(1)</td><td>Ilimitado</td><td>hash.get(), array[i], operação matemática</td></tr>
        <tr><td class="g2">O(log n)</td><td>Ilimitado</td><td>binary search, BST, heap insert</td></tr>
        <tr><td class="g3">O(n)</td><td>10⁸</td><td>scan, max/min, sliding window, BFS/DFS</td></tr>
        <tr><td class="cy">O(n log n)</td><td>10⁶-10⁷</td><td>sort, merge sort, heap sort</td></tr>
        <tr><td class="co">O(n²)</td><td>10³-10⁴</td><td>bubble sort, brute force pairs, DP 2D simples</td></tr>
        <tr><td class="co">O(n³)</td><td>10²-10³</td><td>Floyd-Warshall, matrix multiplication naive</td></tr>
        <tr><td class="cr">O(2ⁿ)</td><td>≤25</td><td>subsets, backtracking sem poda, fibonacci sem memo</td></tr>
        <tr><td class="cp">O(n!)</td><td>≤10</td><td>permutações brutas, TSP brute force</td></tr>
      </tbody>
    </table>
  </div>

  <div class="bigo-cs-sec">
    <div class="bigo-cs-sec-title">Distinções importantes</div>
    <div class="bigo-cs-grid">
      <div class="bigo-cs-card">
        <div class="bigo-cs-ct">Pior caso vs Amortizado vs Esperado</div>
        <div class="bigo-cs-body">
          <span class="g3">Pior caso</span>: garantia absoluta (heap sort = O(n log n) sempre)<br>
          <span class="cy">Amortizado</span>: custo por op ao longo de N ops (ArrayList append = O(1)*)<br>
          <span class="co">Esperado</span>: com inputs aleatórios (quicksort = O(n log n) esperado, O(n²) pior caso)
        </div>
      </div>
      <div class="bigo-cs-card">
        <div class="bigo-cs-ct">Espaço auxiliar vs Espaço total</div>
        <div class="bigo-cs-body">
          <span class="g3">Espaço auxiliar</span>: memória extra além do input (mais comum em entrevista)<br>
          <span class="cy">Espaço total</span>: inclui o próprio input<br><br>
          Mergesort: espaço auxiliar O(n), total O(n)<br>
          Quicksort in-place: auxiliar O(log n) (call stack)
        </div>
      </div>
      <div class="bigo-cs-card">
        <div class="bigo-cs-ct">Quando constante importa na prática</div>
        <div class="bigo-cs-body">
          n pequeno (&lt;1000): insertion sort vence mergesort<br>
          Cache locality: scan de array supera hash para n&lt;50<br>
          Branch prediction: código previsível é mais rápido<br>
          Por isso TimSort mistura insertion + mergesort
        </div>
      </div>
      <div class="bigo-cs-card">
        <div class="bigo-cs-ct">Master Theorem (recursão T(n)=aT(n/b)+f(n))</div>
        <div class="bigo-cs-body">
          c = log_b(a)<br>
          f(n) &lt; n^c → O(n^c)<br>
          f(n) = Θ(n^c) → O(n^c log n)<br>
          f(n) &gt; n^c → O(f(n))<br><br>
          <span class="g3">Merge sort: a=2,b=2,f=n → c=1=f → O(n log n)</span>
        </div>
      </div>
    </div>
  </div>

  <div class="bigo-cs-sec">
    <div class="bigo-cs-sec-title">Trade-offs espaço × tempo mais comuns</div>
    <table class="bigo-cs-table">
      <thead><tr><th>Técnica</th><th>Espaço extra</th><th>Ganho de tempo</th></tr></thead>
      <tbody>
        <tr><td>Hash map</td><td>O(n)</td><td>O(n) search → O(1) lookup</td></tr>
        <tr><td>Memoização DP</td><td>O(estados)</td><td>O(2ⁿ) → O(n·k)</td></tr>
        <tr><td>Prefix sum</td><td>O(n)</td><td>range query O(n) → O(1)</td></tr>
        <tr><td>Sorted order</td><td>O(n log n) tempo</td><td>search O(n) → O(log n)</td></tr>
        <tr><td>Trie vs hash</td><td>O(n·m)</td><td>prefix search O(n) → O(m)</td></tr>
      </tbody>
    </table>
  </div>
</div>`,
    },
    mindmap: {
      title: "Mindmap de Big-O — ecossistema completo",
      html: `<style>
.bigo-mm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.bigo-mm-h{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.bigo-mm-sub{font-size:10px;color:#475569;margin:0 0 16px}
.bigo-mm-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.bigo-mm-block{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:11px 13px}
.bigo-mm-bt{font-size:11px;font-weight:700;color:#10B981;margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid #10B98140}
.bigo-mm-list{font-size:9.5px;color:#94a3b8;line-height:1.8;list-style:none;padding:0;margin:0}
.bigo-mm-list li{padding-left:14px;position:relative}
.bigo-mm-list li::before{content:'▸';color:#10B981;position:absolute;left:0}
.bigo-mm-tag{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:8.5px;background:#10B98115;color:#10B981;padding:1px 6px;border-radius:3px;margin-left:5px}
</style>
<div class="bigo-mm-wrap">
  <p class="bigo-mm-h">Mindmap de Big-O</p>
  <p class="bigo-mm-sub">Categorias e conceitos essenciais — para revisão rápida do ecossistema completo</p>
  <div class="bigo-mm-grid">
    <div class="bigo-mm-block">
      <div class="bigo-mm-bt">Complexidades de tempo</div>
      <ul class="bigo-mm-list">
        <li>O(1) — constante <span class="bigo-mm-tag">array[i]</span></li>
        <li>O(log n) — logarítmico <span class="bigo-mm-tag">binary search</span></li>
        <li>O(n) — linear <span class="bigo-mm-tag">scan</span></li>
        <li>O(n log n) — linearítmico <span class="bigo-mm-tag">merge sort</span></li>
        <li>O(n²) — quadrático <span class="bigo-mm-tag">nested loop</span></li>
        <li>O(n³) — cúbico <span class="bigo-mm-tag">Floyd-Warshall</span></li>
        <li>O(2ⁿ) — exponencial <span class="bigo-mm-tag">subsets</span></li>
        <li>O(n!) — fatorial <span class="bigo-mm-tag">permutações</span></li>
      </ul>
    </div>
    <div class="bigo-mm-block">
      <div class="bigo-mm-bt">Complexidade de espaço</div>
      <ul class="bigo-mm-list">
        <li>Auxiliar vs total</li>
        <li>Call stack de recursão (O(profundidade))</li>
        <li>Estruturas auxiliares (hash, set, array temp)</li>
        <li>In-place: O(1) auxiliar</li>
        <li>Trade-off espaço × tempo</li>
        <li>Memoization (DP) e prefix sums</li>
      </ul>
    </div>
    <div class="bigo-mm-block">
      <div class="bigo-mm-bt">Tipos de análise</div>
      <ul class="bigo-mm-list">
        <li>Best case (Ω) — limite inferior</li>
        <li>Average case — esperado</li>
        <li>Worst case (O) — pior cenário</li>
        <li>Amortized — custo médio em N ops</li>
        <li>Expected — com aleatoriedade</li>
        <li>Tight bound (Θ) — ambos lados</li>
      </ul>
    </div>
    <div class="bigo-mm-block">
      <div class="bigo-mm-bt">Estruturas e custos</div>
      <ul class="bigo-mm-list">
        <li>Array: O(1) access, O(n) search</li>
        <li>LinkedList: O(n) access, O(1) insert/delete</li>
        <li>HashMap: O(1)* todas operações</li>
        <li>BST balanceada: O(log n)</li>
        <li>Heap: O(log n) insert, O(1) peek</li>
        <li>Trie: O(m) onde m = len chave</li>
        <li>Graph adj list: O(V+E) traversal</li>
      </ul>
    </div>
    <div class="bigo-mm-block">
      <div class="bigo-mm-bt">Algoritmos de ordenação</div>
      <ul class="bigo-mm-list">
        <li>Merge Sort: O(n log n) garantido, estável</li>
        <li>Quick Sort: O(n log n) avg, O(n²) worst</li>
        <li>Heap Sort: O(n log n) garantido, in-place</li>
        <li>TimSort: O(n) best (dados quase ordenados)</li>
        <li>Counting/Radix: O(n+k) — não-comparativo</li>
        <li>Limite teórico (comparativo): Ω(n log n)</li>
      </ul>
    </div>
    <div class="bigo-mm-block">
      <div class="bigo-mm-bt">Algoritmos de grafo</div>
      <ul class="bigo-mm-list">
        <li>BFS/DFS: O(V+E)</li>
        <li>Dijkstra (heap): O((V+E) log V)</li>
        <li>Bellman-Ford: O(V·E)</li>
        <li>Floyd-Warshall: O(V³)</li>
        <li>Kruskal/Prim (MST): O(E log V)</li>
        <li>Topological sort: O(V+E)</li>
      </ul>
    </div>
    <div class="bigo-mm-block">
      <div class="bigo-mm-bt">Notações e símbolos</div>
      <ul class="bigo-mm-list">
        <li>O(f) — limite superior (≤)</li>
        <li>Ω(f) — limite inferior (≥)</li>
        <li>Θ(f) — limite exato (=)</li>
        <li>o(f) — estritamente menor (&lt;)</li>
        <li>ω(f) — estritamente maior (&gt;)</li>
        <li>Convenção em entrevista: O por padrão</li>
      </ul>
    </div>
    <div class="bigo-mm-block">
      <div class="bigo-mm-bt">Master Theorem & recorrências</div>
      <ul class="bigo-mm-list">
        <li>T(n) = a·T(n/b) + f(n)</li>
        <li>Caso 1: f(n) menor → Θ(n^log_b a)</li>
        <li>Caso 2: f(n) igual → Θ(n^c log n)</li>
        <li>Caso 3: f(n) maior → Θ(f(n))</li>
        <li>Substitution method (provar com indução)</li>
        <li>Recursion tree (visualização)</li>
      </ul>
    </div>
    <div class="bigo-mm-block">
      <div class="bigo-mm-bt">Padrões de otimização</div>
      <ul class="bigo-mm-list">
        <li>Hash map: linear → constante</li>
        <li>Two pointers: O(n²) → O(n)</li>
        <li>Sliding window: subarray O(n)</li>
        <li>Binary search: linear → log</li>
        <li>Memoization (DP): exponencial → poly</li>
        <li>Prefix sum: range query O(1)</li>
      </ul>
    </div>
    <div class="bigo-mm-block">
      <div class="bigo-mm-bt">Constantes na prática</div>
      <ul class="bigo-mm-list">
        <li>Cache locality (CPU L1/L2/L3)</li>
        <li>Branch prediction</li>
        <li>SIMD vetorização</li>
        <li>Memory allocator overhead</li>
        <li>Tradeoff legibilidade × performance</li>
        <li>Profiling antes de otimizar</li>
      </ul>
    </div>
  </div>
</div>`,
      caption: "Use este mindmap como roadmap: cada bloco é uma área que você deve dominar para Big-O nível sênior.",
    },
    keypoints: [
      { title: "O(1) — constante", body: "Tempo independe do tamanho do input. Exemplos: array[i] por índice, hash.get(key), push/pop em stack, operação aritmética. É o ideal — escala infinitamente.", code: "// Todos O(1)\nconst x = arr[5]         // acesso por índice\nconst v = map.get('k')   // hash lookup\nstack.push(item)         // push em array JS" },
      { title: "O(log n) — logarítmico", body: "Divide o problema pela metade a cada passo. O input pode dobrar sem dobrar o trabalho — log₂(1.000.000) ≈ 20. Exemplos: binary search, BST balanceada (insert/search/delete), heap insert/extract.", code: "// Binary search O(log n)\nlet lo=0, hi=n-1\nwhile(lo<=hi){\n  const mid=(lo+hi)>>1\n  if(arr[mid]===t) return mid\n  arr[mid]<t ? lo=mid+1 : hi=mid-1\n}" },
      { title: "O(n) — linear", body: "Visita cada elemento uma vez. Loop simples, scan, max/min, sum, filter, map. É o caso 'alvo' para a maioria dos problemas de entrevista quando O(1) não é possível. BFS e DFS em grafo são O(V+E) ≈ O(n)." },
      { title: "O(n log n) — linearítmico", body: "Sort comparativo (mergesort, heapsort, quicksort médio), divide-and-conquer com merge linear. É o limite inferior teórico para sort por comparação. TimSort (Python/Java) é O(n) em dados quase ordenados." },
      { title: "O(n²) — quadrático", body: "Loop dentro de loop no mesmo input. Bubble sort, comparar todos os pares, brute force two sum, DP 2D sem otimização. Aceitável para n ≤ 1.000 em entrevista, mas sempre mencione que existe solução melhor.", code: "// O(n²) — dois loops aninhados\nfor(let i=0;i<n;i++)\n  for(let j=i+1;j<n;j++)\n    if(arr[i]+arr[j]===target) return [i,j]\n// Otimização: substituir loop interno por hash → O(n)" },
      { title: "O(2ⁿ) — exponencial", body: "Recursão binária sem memoização. Fibonacci recursivo sem memo, geração de todos os subsets, backtracking sem poda. Aceitável apenas para n ≤ 25. Quase sempre indica que falta memoização (→ DP)." },
      { title: "O(n!) — fatorial", body: "Geração de todas as permutações. TSP brute force, n-queens sem poda. Limite prático: n ≤ 10. 10! = 3.628.800 — ainda manejável. 15! = 1.3 trilhão — inviável." },
      { title: "Espaço auxiliar vs total", body: "Em entrevista, 'complexidade de espaço' geralmente significa espaço auxiliar (memória extra além do input). Mergesort: espaço auxiliar O(n), pior que heapsort O(1). Quicksort in-place: O(log n) de call stack mesmo sendo 'in-place'. Recursão de profundidade n usa O(n) de call stack." },
      { title: "Amortizado vs pior caso", body: "Amortizado: custo médio por operação ao longo de N operações. ArrayList append: O(1) amortizado — resize copia tudo a cada dobrada de capacidade, mas o custo amortizado por append é O(1). HashMap insert: O(1) amortizado. Pior caso de ambos: O(n) quando há resize/rehash." },
      { title: "Quando constante importa", body: "Big-O ignora constantes, mas na prática: cache locality (scan de array sequencial é muito mais rápido que hash para n < ~100 por causa de CPU cache), branch prediction, e overhead de estrutura de dados. Por isso algoritmos híbridos (TimSort) existem." },
    ],
    gotchas: [
      "Esquecer o espaço da call stack em recursão — recursão de profundidade n usa O(n) de memória mesmo que o código pareça 'in-place'.",
      "Achar que hash map é sempre O(1) — pior caso é O(n) com muitas colisões. Amortizado é O(1). Em entrevista, diga 'O(1) amortizado'.",
      "Misturar pior caso, amortizado e esperado — são coisas diferentes. Quicksort é O(n²) pior caso mas O(n log n) esperado.",
      "Otimização prematura: refatorar O(n) para O(n/2) não muda a complexidade — mas pode melhorar em 2x na prática.",
      "Não contar trabalho dentro de chamadas de função — str.slice(0, n) dentro de loop é O(n²) no total, não O(n).",
      "Confundir O(log n) com 'rápido' e O(n²) com 'lento' sem contexto de n — para n=10, n² = 100 e log n ≈ 3, a diferença é irrelevante.",
      "Não anunciar complexidade de espaço além da de tempo — entrevistadores valorizam muito quem menciona os dois.",
      "Ignorar que sort muda a complexidade do algoritmo — se você sort antes de two pointers, o algoritmo é O(n log n), não O(n).",
    ],
    interview: [
      { q: "Qual a diferença entre O(n log n) e O(n²)?", a: "<p>O crescimento é radicalmente diferente:</p><ul><li>n=1.000: O(n log n) ≈ 10.000 ops · O(n²) = 1.000.000 ops → 100x mais</li><li>n=1.000.000: O(n log n) ≈ 20M ops · O(n²) = 10¹² ops → 50.000x mais</li></ul><p>Por isso mergesort/quicksort existem e bubble sort não é usado em produção. A diferença que parece pequena em n pequeno vira catástrofe em escala.</p>", level: "pleno", tip: "Use números concretos para n=1k e n=1M. A diferença de 50.000x em produção é o argumento mais forte." },
      { q: "Por que hash map é O(1) amortizado e não O(1) garantido?", a: "<p>Em hash bem distribuído, cada bucket tem ~1 item → lookup O(1).</p><p>Pior caso: todos os elementos colidem no mesmo bucket (hash function ruim ou ataque adversarial) → vira lista ligada → O(n).</p><p>Amortizado: quando load factor excede threshold (~0.75), rehash copia tudo em O(n). Mas acontece tão raramente (a cada dobra de capacidade) que o custo amortizado por operação é O(1).</p>", level: "pleno", tip: "Mencione hash flooding attack como exemplo prático de pior caso O(n). Java mudou para tree em buckets >8 items para mitigar." },
      { q: "Qual a complexidade de BFS em um grafo?", a: "<p>Tempo: O(V + E) — visita cada vértice (V) e cada aresta (E) uma vez.</p><p>Espaço: O(V) — visited set + queue podem conter todos os vértices.</p><p>Atenção: com matriz de adjacência, scan dos vizinhos é O(V) por vértice → total O(V²). Com lista de adjacência, é O(grau) por vértice → total O(V + E).</p><p>Para grafos esparsos (E &lt;&lt; V²), lista de adjacência é muito mais eficiente.</p>", level: "pleno", tip: "Sempre distinguir: a complexidade depende da representação. Adj matrix → O(V²). Adj list → O(V+E)." },
      { q: "Como otimizaria um algoritmo O(n²)?", a: "<p>Padrões de otimização:</p><ul><li><strong>Hash map</strong>: substitui busca linear O(n) por lookup O(1) → two sum vira O(n)</li><li><strong>Sort + two pointers</strong>: O(n log n) em vez de comparar todos os pares O(n²)</li><li><strong>Sliding window</strong>: reaproveita trabalho da janela anterior → O(n)</li><li><strong>Prefix sum</strong>: pre-processa O(n) para range queries em O(1)</li><li><strong>DP / memo</strong>: elimina recomputação de subproblemas sobrepostos</li><li><strong>Heap</strong>: mantém top-k em O(n log k) em vez de sort O(n log n) ou scan repetido O(n²)</li></ul>", level: "pleno", tip: "Tenha esses 6 padrões de otimização na ponta da língua. Em entrevista, ao ver O(n²), pergunte: 'qual desses padrões se aplica?'" },
      { q: "O que é análise amortizada?", a: "<p>Técnica para analisar custo por operação ao longo de uma sequência de N operações, mesmo que operações individuais variem.</p><p>Exemplo: ArrayList.append(). Normalmente O(1). Quando array está cheio: resize dobra o tamanho, copia tudo — O(n). Mas isso acontece a cada vez que o tamanho dobra: após 1, 2, 4, 8, 16... inserções. Custo total de N inserts: N + N/2 + N/4 + ... ≈ 2N = O(N). Custo amortizado por insert: O(N)/N = O(1).</p><p>Existem 3 métodos formais: aggregate, accounting (banker's), e potential.</p>", level: "senior", tip: "Mencione os 3 métodos formais (aggregate, banker's, potential) — demonstra conhecimento profundo. Use o exemplo do dynamic array que é o mais clássico." },
      { q: "Quando constante importa na prática apesar do Big-O?", a: "<p>Casos onde O grande igual mas constante diferente importa:</p><ul><li><strong>Cache locality</strong>: scan sequencial de array é 10-100x mais rápido que acesso aleatório em hash (memória contígua vs espalhada)</li><li><strong>n pequeno</strong>: insertion sort (O(n²)) vence mergesort (O(n log n)) para n &lt; ~16 — sem overhead de recursão</li><li><strong>TimSort</strong>: Python/Java usam insertion sort para 'runs' pequenos e mergesort para combinar</li><li><strong>Branch prediction</strong>: código sem condições aleatórias é mais rápido por causa do pipeline do CPU</li></ul>", level: "senior", tip: "Cite TimSort como exemplo concreto: produção real do Python e Java usam algoritmo híbrido por essas razões. Não é teoria, é prática." },
      { q: "Como calcular complexidade de recursão com Master Theorem?", a: "<p>Para recorrências T(n) = a·T(n/b) + f(n):</p><ul><li>Calcule c = log_b(a)</li><li>Compare f(n) com n^c:<br>— f(n) cresce MENOS que n^c → T(n) = O(n^c)<br>— f(n) = Θ(n^c) → T(n) = O(n^c · log n)<br>— f(n) cresce MAIS que n^c → T(n) = O(f(n))</li></ul><p>Exemplos:<br>• Mergesort: a=2, b=2, f=n → c=1 → f=Θ(n^c) → O(n log n)<br>• Binary search: a=1, b=2, f=1 → c=0 → f=Θ(n^0) → O(log n)<br>• Karatsuba: a=3, b=2, f=n → c=log₂3≈1.58 → caso 1 → O(n^1.58)</p>", level: "senior", tip: "Decore os 3 casos. Em entrevista, identifique a, b, f(n) primeiro — depois compare. Karatsuba é exemplo legal porque mostra um caso 1 incomum." },
      { q: "Qual a diferença entre O, Ω e Θ?", a: "<p><strong>O(f(n))</strong>: limite superior — 'no máximo tão ruim quanto f(n)'. Big-O de pior caso.</p><p><strong>Ω(f(n))</strong>: limite inferior — 'no mínimo tão bom quanto f(n)'. Omega de melhor caso.</p><p><strong>Θ(f(n))</strong>: ambos os lados — 'exatamente tão ruim/bom quanto f(n)'. Theta = análise exata.</p><p>Em entrevista usa-se O por convenção mesmo quando seria Θ. Mas se entrevistador perguntar a distinção, demonstre que sabe.</p><p>Exemplo: mergesort é Θ(n log n) — melhor E pior caso são n log n. Quicksort é O(n²) pior caso mas Ω(n log n) melhor caso.</p>", level: "senior", tip: "Tenha pronto: 'Big-O é convenção mas tecnicamente é Theta na maioria dos casos'. Mostra rigor matemático sem ser pedante." },
      { q: "Como calcular espaço de call stack em recursão?", a: "<p>Cada chamada recursiva adiciona um frame à call stack. O espaço total é O(profundidade máxima).</p><ul><li>Fibonacci T(n) = T(n-1) + T(n-2): profundidade máxima = n → O(n) espaço</li><li>Binary search recursivo: profundidade log n → O(log n) espaço</li><li>Mergesort: profundidade log n → O(log n) de call stack + O(n) para merge = O(n) total</li><li>Quicksort in-place: O(log n) espaço de call stack (pior caso O(n) com pivot ruim)</li></ul><p>Isso é por que tail call optimization importa — evita crescer a stack em linguagens que suportam.</p>", level: "senior", tip: "JavaScript V8 NÃO faz TCO em produção (apesar do ES2015 spec). Conhecer isso diferencia: 'recursão profunda em JS = stack overflow real'." },
      { q: "O que é amortized O(1) vs expected O(1)?", a: "<p><strong>Amortizado O(1)</strong>: garantia determinística ao longo de N operações. Não depende de aleatoriedade. Ex: ArrayList append — sempre verdadeiro independente dos dados.</p><p><strong>Esperado O(1)</strong>: depende de aleatoriedade ou assumir distribuição uniforme. Ex: quicksort com pivot aleatório é O(n log n) esperado. Hash map com input adversarial pode ser O(n) esperado mas O(n²) garantido.</p><p>Diferença prática: amortizado é mais forte. Em sistemas críticos (sem aleatoriedade), prefira amortizado.</p>", level: "senior", tip: "Em sistemas de tempo real ou hard real-time, evite estruturas com pior caso ruim — mesmo que amortizado seja bom. GC pause é exemplo." },
      { q: "Por que O(n log n) é o limite inferior para sort comparativo?", a: "<p>Argumento information-theoretic: existem n! permutações possíveis do input. Para distinguir cada uma, precisamos de pelo menos log₂(n!) decisões binárias (comparações). Por aproximação de Stirling: log₂(n!) ≈ n·log₂(n) - n/ln(2) = Θ(n log n).</p><p>Toda comparação produz no máximo 1 bit de informação. Logo, para reduzir n! possibilidades a 1 (a permutação ordenada), precisamos de Ω(n log n) comparações.</p><p>Counting/Radix/Bucket sort quebram isso porque NÃO usam comparações — usam estrutura do input (valores limitados, dígitos). Counting sort: O(n+k). Radix: O(n·d).</p>", level: "senior", tip: "Mencione Stirling para mostrar formalidade matemática. E lembre: o limite vale APENAS para sort comparativo." },
      { q: "Qual a complexidade de Dijkstra e por que depende da estrutura de dados?", a: "<p>Dijkstra com diferentes implementações:</p><ul><li><strong>Array simples</strong>: extrair mínimo é O(V) → total O(V² + E) = O(V²)</li><li><strong>Binary heap</strong>: extract-min O(log V), decrease-key O(log V) → total O((V+E) log V)</li><li><strong>Fibonacci heap</strong>: extract-min O(log V), decrease-key O(1) amortizado → total O(E + V log V)</li></ul><p>Para grafo denso (E ≈ V²): array simples é O(V²) e binary heap é O(V² log V) → array simples vence.</p><p>Para grafo esparso (E ≈ V): binary heap é O(V log V) → muito melhor.</p><p>Fibonacci heap só vale a pena teoricamente — na prática constantes ruins.</p>", level: "senior", tip: "Mencionar 'Fibonacci heap é teoricamente melhor mas raramente usado na prática' demonstra conhecimento de teoria E prática." },
      { q: "Quando usar memoization vs tabulation em DP?", a: "<p><strong>Memoization (top-down)</strong>: recursão + cache. Mais natural para escrever, recursão segue a estrutura matemática. Custo: overhead de chamadas de função, call stack pode estourar.</p><p><strong>Tabulation (bottom-up)</strong>: loop iterativo preenchendo tabela. Mais rápido na prática (sem overhead de função, melhor cache locality), call stack constante. Mas exige raciocinar sobre ordem de preenchimento.</p><p>Ambos têm a MESMA complexidade Big-O. Diferença é constante e estilo. Em entrevista, comece com memoization (mais intuitivo) e ofereça converter para tabulation se otimização for cobrada.</p>", level: "senior", tip: "Tabulation permite space optimization (rolling array) que memoization não permite naturalmente. Knapsack: O(n·W) → O(W) com tabulation." },
      { q: "Como analisar complexidade quando há entrada multidimensional?", a: "<p>Quando o input tem múltiplas dimensões, use múltiplas variáveis na complexidade. Ex: BFS em matriz m×n é O(m·n), não O(n²).</p><p>Casos comuns:</p><ul><li>Matrix m×n: usar O(m·n) ou O(rows·cols)</li><li>Grafo: O(V+E), não O(n²)</li><li>String com palavras: O(W·L) onde W=palavras, L=tamanho médio</li><li>Two arrays: O(m+n) ou O(m·n) dependendo do algoritmo</li></ul><p>Erro comum: chamar tudo de 'n' e perder informação. 'O(n²)' para uma matriz pode esconder se é m=n=1000 vs m=10, n=10⁶.</p>", level: "senior", tip: "Sempre defina suas variáveis no início da resposta: 'Seja m=rows, n=cols, então...'. Demonstra rigor." },
      { q: "O que é P, NP, NP-completo na prática?", a: "<p><strong>P</strong>: problemas resolvíveis em tempo polinomial — O(n^k) para algum k. Ex: sort, shortest path, MST.</p><p><strong>NP</strong>: problemas cuja solução pode ser VERIFICADA em tempo polinomial. Inclui P. Ex: dado um Sudoku resolvido, verificar é polinomial; resolver pode não ser.</p><p><strong>NP-completo</strong>: subconjunto de NP onde todo problema NP é redutível polinomialmente. Se um for resolvido em P, todos são. Ex: SAT, TSP, knapsack, subset sum.</p><p>Na prática: ao reconhecer que um problema é NP-completo, mude estratégia: aproximação, heurística (genéticos, simulated annealing), branch-and-bound com poda, programação inteira, ou aceitar input pequeno.</p>", level: "senior", tip: "Em entrevista, reconhecer NP-completude é mais valioso que tentar resolver. 'Isso é variante de subset sum, NP-completo. Vou usar DP O(n·W) para input pequeno ou aproximação se W grande.'" },
      { q: "Como o tamanho da palavra do CPU afeta a análise de Big-O?", a: "<p>Big-O assume operações elementares O(1). Mas comparar/somar inteiros de B bits é O(B). Para inteiros que cabem em uma palavra do CPU (32 ou 64 bits), B é constante.</p><p>Quando B importa:</p><ul><li>Inteiros grandes (BigInt): soma é O(B), multiplicação é O(B²) ou O(B log B) com FFT</li><li>String comparison: O(min(len₁, len₂))</li><li>Hash de string: O(len) — não O(1)!</li></ul><p>Em entrevista, é comum simplificar: assumir comparação O(1) para tipos primitivos. Mas se a pergunta envolve strings ou números enormes, mencione o custo real.</p>", level: "senior", tip: "Hash map com chaves de string é tecnicamente O(L) por op, onde L = tamanho da chave. Mencionar isso em entrevista de sistema (não LeetCode) é diferencial." },
      { q: "Por que Quick Sort é frequentemente mais rápido que Merge Sort apesar de ambos serem O(n log n)?", a: "<p>Em teoria empate, mas Quick Sort vence na prática:</p><ul><li><strong>In-place</strong>: Quick Sort O(log n) auxiliar (call stack); Merge Sort O(n) auxiliar (array temp)</li><li><strong>Cache locality</strong>: Quick Sort opera em sub-arrays contíguos; Merge Sort precisa copiar para auxiliar</li><li><strong>Constantes</strong>: o código de partição do Quick Sort é mais simples e tight que o merge</li><li><strong>Pivot bom</strong>: median-of-three ou randomized evita pior caso O(n²)</li></ul><p>Por isso Java Arrays.sort() para primitivos usa Quick Sort (Dual-Pivot), e para objetos usa TimSort (variante de Merge). Stability importa para objetos — Quick Sort não é estável.</p>", level: "senior", tip: "Java usa Dual-Pivot QuickSort (Yaroslavskiy 2009) — é mais rápido que QS clássico em ~30%. Mencionar isso em entrevista de Java/algoritmos é nível sênior+." },
      { q: "Como otimizar memória de DP de O(n²) para O(n)?", a: "<p>Técnica chamada <strong>rolling array</strong> ou <strong>space-optimized DP</strong>. Funciona quando dp[i][j] depende apenas de dp[i-1][·] (linha anterior) ou de algumas células fixas.</p><p>Exemplo — Knapsack 0/1:</p><pre>// O(n·W) tempo, O(n·W) espaço:\nfor i in items: for w in 0..W:\n  dp[i][w] = max(dp[i-1][w], dp[i-1][w-items[i]]+v[i])\n\n// O(W) espaço — itera de trás pra frente:\nfor i in items: for w in W..items[i]:\n  dp[w] = max(dp[w], dp[w-items[i]]+v[i])</pre><p>O truque: iterar de trás para frente para que dp[w-items[i]] ainda represente a 'linha anterior'.</p>", level: "senior", tip: "Space optimization é cobrança comum em entrevista de FAANG. Saber que existe e quando aplicar (DP linha-única-dependência) é o suficiente." },
      { q: "O que é a notação 'little-o' (o pequeno) e quando usá-la?", a: "<p><strong>o(f(n))</strong>: limite superior estrito — f cresce ESTRITAMENTE mais rápido que g. Formalmente: lim(g(n)/f(n)) = 0 quando n→∞.</p><p>Exemplos:</p><ul><li>n = o(n²) — n cresce estritamente mais devagar que n²</li><li>log n = o(n) — log cresce estritamente mais devagar que linear</li><li>n = O(n) mas n ≠ o(n) — Big-O permite igualdade, little-o não</li></ul><p>Uso em entrevista é raro. Aparece em provas de algoritmos, análise probabilística, e papers acadêmicos. Em entrevista, conhecer a definição mostra cultura matemática.</p>", level: "senior", tip: "Saber que existe e diferença com Big-O é suficiente. Não traz para resposta a menos que perguntem — pode soar pedante." },
      { q: "Como medir complexidade na prática (profiling) e quando confiar?", a: "<p>Big-O é teórico. Na prática, use profiling para validar:</p><ul><li><strong>Microbenchmark</strong>: medir N tempos com dados de tamanhos crescentes (10, 100, 1k, 10k, 100k). Plotar — a curva confirma a complexidade?</li><li><strong>Profiler</strong>: Chrome DevTools Performance, Node.js --inspect, Python cProfile, Go pprof. Identifica onde tempo é gasto.</li><li><strong>Big-O experimental</strong>: log-log plot do tempo vs n. Inclinação ≈ expoente. Linha horizontal: O(1). Inclinação 1: O(n). Inclinação 2: O(n²).</li></ul><p>Big-O é necessário mas não suficiente. Algoritmo O(n log n) lento em produção pode ter problema de cache, GC, IO, locks — não complexidade.</p>", level: "senior", tip: "Em entrevista de sistema, mencionar 'medir antes de otimizar' (Knuth: premature optimization) e ferramentas de profiling diferencia." },
    ],
    codeExamples: [
      {
        title: "Binary Search — análise passo a passo de O(log n)",
        language: "typescript",
        code: `// Binary Search clássico em array ordenado
// Tempo: O(log n) | Espaço: O(1) iterativo, O(log n) recursivo (call stack)

function binarySearch(arr: number[], target: number): number {
  let lo = 0
  let hi = arr.length - 1

  // Cada iteração reduz o espaço de busca pela METADE.
  // Após k iterações: espaço = n / 2^k
  // Loop termina quando 1 = n / 2^k -> k = log2(n)
  // Logo: O(log n) iterações no pior caso.

  while (lo <= hi) {
    // mid = (lo + hi) / 2 — usar >> 1 para evitar overflow em ints grandes
    // (lo + hi) pode estourar Number.MAX_SAFE_INTEGER — em produção real
    // use lo + ((hi - lo) >> 1) que é seguro para qualquer tamanho.
    const mid = lo + ((hi - lo) >> 1)

    if (arr[mid] === target) return mid
    if (arr[mid] < target) lo = mid + 1
    else hi = mid - 1
  }
  return -1
}

// Exemplo: array de 1.000.000 elementos
// Linear search O(n): até 1.000.000 iterações
// Binary search O(log n): até 20 iterações (log2 de 10^6 ~= 20)
// Speedup: 50.000x

const arr = Array.from({ length: 1_000_000 }, (_, i) => i)
console.time('binary')
binarySearch(arr, 999_999)  // ~20 iteracoes
console.timeEnd('binary')`,
      },
      {
        title: "Dynamic Array — O(1) amortizado provado",
        language: "typescript",
        code: `// Implementação de array dinâmico para mostrar amortized O(1) push.
// Toda vez que ficamos sem espaço, DOBRAMOS a capacidade.

class DynamicArray<T> {
  private data: T[] = new Array(1)  // capacidade inicial
  private length = 0
  private capacity = 1
  totalCopies = 0  // tracker para análise

  push(value: T): void {
    if (this.length === this.capacity) {
      // Resize: dobra a capacidade. Operação custosa: O(capacity).
      const newCap = this.capacity * 2
      const newData = new Array(newCap)
      for (let i = 0; i < this.length; i++) {
        newData[i] = this.data[i]
        this.totalCopies++  // contagem de cópias
      }
      this.data = newData
      this.capacity = newCap
    }
    this.data[this.length++] = value
  }
}

// Análise amortizada (aggregate method):
// Apos N pushes, quantas copias totais?
// Resizes acontecem em N=1, 2, 4, 8, 16, ... 2^k
// Total de copias = 1 + 2 + 4 + ... + N/2 = N - 1
// Custo total dos N pushes = N (inserts) + (N-1) (copias) = 2N - 1
// Custo amortizado por push = (2N - 1) / N ~ 2 = O(1) amortizado

const arr = new DynamicArray<number>()
for (let i = 0; i < 1024; i++) arr.push(i)
console.log('1024 pushes resultaram em ' + arr.totalCopies + ' copias')
// Output: ~1023 copias = aproximadamente N. Amortized = ~2 ops/push.`,
      },
      {
        title: "Comparando complexidades — O(n²) vs O(n log n) vs O(n) no mesmo problema",
        language: "typescript",
        code: `// Problema: encontrar par com soma = target em array
// 3 implementações com complexidades crescentes — mesma resposta correta.

// === Implementacao 1: O(n^2) — brute force ===
function twoSumBrute(nums: number[], target: number): [number, number] | null {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j]
    }
  }
  return null
}

// === Implementacao 2: O(n log n) — sort + two pointers ===
function twoSumSorted(nums: number[], target: number): [number, number] | null {
  // O(n log n) sort. Mas perdemos os indices originais — precisamos guardar.
  const indexed = nums.map((v, i) => [v, i] as const).sort((a, b) => a[0] - b[0])
  let l = 0, r = indexed.length - 1
  while (l < r) {
    const sum = indexed[l][0] + indexed[r][0]
    if (sum === target) return [indexed[l][1], indexed[r][1]]
    sum < target ? l++ : r--
  }
  return null
}

// === Implementacao 3: O(n) — hash map ===
function twoSumHash(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>()  // valor -> indice
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (seen.has(need)) return [seen.get(need)!, i]
    seen.set(nums[i], i)
  }
  return null
}

// === Benchmark com n = 10.000 ===
const big = Array.from({ length: 10_000 }, (_, i) => i)
const target = 19_998

console.time('brute O(n2)')   // ~100ms — 50M ops
twoSumBrute(big, target)
console.timeEnd('brute O(n2)')

console.time('sorted O(n log n)')  // ~5ms — 130k ops
twoSumSorted(big, target)
console.timeEnd('sorted O(n log n)')

console.time('hash O(n)')      // ~1ms — 10k ops
twoSumHash(big, target)
console.timeEnd('hash O(n)')

// Conclusao pratica: trade-off espaco x tempo.
// O(n^2): zero espaco extra, lento.
// O(n log n): O(log n) auxiliar (sort), mais rapido.
// O(n): O(n) auxiliar (hash), mais rapido — geralmente a melhor escolha.`,
      },
      {
        title: "Recurrence Tree — provando O(n log n) de Merge Sort",
        language: "typescript",
        code: `// Merge Sort: divide o array em 2, recursivamente, depois faz merge linear.
// Recorrencia: T(n) = 2*T(n/2) + O(n)

function mergeSort<T>(arr: T[]): T[] {
  // Caso base
  if (arr.length <= 1) return arr

  // Divide — O(1) com slice (na verdade O(n) por slice, mas ignoramos)
  const mid = arr.length >> 1
  const left = mergeSort(arr.slice(0, mid))   // T(n/2)
  const right = mergeSort(arr.slice(mid))     // T(n/2)

  // Merge — O(n)
  return merge(left, right)
}

function merge<T>(a: T[], b: T[]): T[] {
  const result: T[] = []
  let i = 0, j = 0
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) result.push(a[i++])
    else              result.push(b[j++])
  }
  while (i < a.length) result.push(a[i++])
  while (j < b.length) result.push(b[j++])
  return result
}

// === Analise pela arvore de recursao ===
// Nivel 0:                T(n)                       trabalho: n
// Nivel 1:        T(n/2)        T(n/2)               trabalho total: 2*(n/2) = n
// Nivel 2:    T(n/4) T(n/4) T(n/4) T(n/4)            trabalho total: 4*(n/4) = n
// ...
// Nivel log n: T(1) T(1) ... T(1)                    trabalho total: n*1 = n
//
// Cada nivel faz O(n) trabalho de merge.
// Existem log2(n) niveis (ate virar T(1)).
// Trabalho total: O(n) * log2(n) = O(n log n)
//
// Pelo Master Theorem: a=2, b=2, f(n)=n
//   -> log_b(a) = log2(2) = 1
//   -> f(n) = n = Theta(n^1) -> caso 2
//   -> T(n) = O(n^1 * log n) = O(n log n) [OK]

// Espaco: O(n) auxiliar (array de merge) + O(log n) call stack = O(n) total.
// Por isso quicksort in-place tem espaco melhor — O(log n) — apesar do pior caso pior.`,
      },
    ],
    mnemonics: [
      {
        label: "Curvas de Big-O — ordem crescente",
        trick: "1 < log < n < n·log < n² < 2ⁿ < n!",
        explanation: "Memorize as 7 curvas em ordem: constante, logarítmica, linear, linearítmica, quadrática, exponencial, fatorial. Use a regrinha visual: 'COnstante, LOG, Linear, LiNear-LOG, quadrado, expoNenTe, fatorial' — cada termo é estritamente mais lento que o anterior para n grande. Saber a ordem permite identificar otimização: se algo é O(2ⁿ), o alvo é O(n²). Se é O(n²), o alvo é O(n log n) ou O(n).",
      },
      {
        label: "DRoP — regras de simplificação",
        trick: "DROP: Drop constants · Reduce smaller terms · Outer loops multiply · Parallel loops add",
        explanation: "Quatro regras para simplificar qualquer Big-O: (D) Drop constants — O(5n²) vira O(n²). (R) Reduce smaller terms — O(n² + n) vira O(n²). (O) Outer loops aninhados multiplicam — for n { for n } vira O(n²). (P) Parallel/sequential loops somam e depois drop — O(n) + O(n) = O(2n) = O(n). Aplique nessa ordem em qualquer código para chegar à forma final.",
      },
      {
        label: "PAEW — tipos de análise",
        trick: "PAEW: Pior caso · Amortizado · Esperado · Worst-amortized",
        explanation: "Quatro tipos de análise frequentemente confundidos. (P) Pior caso — garantia absoluta independente do input. (A) Amortizado — custo médio em N operações, determinístico. (E) Esperado — depende de aleatoriedade ou distribuição uniforme. (W) Worst-amortized — pior caso da análise amortizada (mais raro). Quicksort: pior=O(n²), esperado=O(n log n). HashMap: pior=O(n), amortizado=O(1).",
      },
      {
        label: "MASTER — Master Theorem em 6 passos",
        trick: "MASTER: Match a · Set b · Take f · Exponent c=log_b(a) · Read case · Result",
        explanation: "Para T(n) = a·T(n/b) + f(n): (M) Match — identifique a (subchamadas). (A) (S) Set — identifique b (fator de redução). (T) Take — identifique f(n) (trabalho fora). (E) Exponent — calcule c = log_b(a). (R) Read — compare f(n) com n^c, identifique caso 1/2/3. (R) Result — caso 1 → O(n^c); caso 2 → O(n^c log n); caso 3 → O(f(n)). Pratique com mergesort, binary search, karatsuba para fixar.",
      },
      {
        label: "ARROZ — Análise de espaço (call stack + auxiliar)",
        trick: "ARROZ: Array auxiliares · Recursão (stack) · Resultados acumulados · Outras estruturas · Zerar in-place",
        explanation: "Para calcular espaço extra: (A) Array auxiliares criados — somar tamanhos. (R) Recursão — profundidade da call stack vira espaço. (R) Resultados acumulados (output array) — geralmente conta. (O) Outras estruturas auxiliares (hash, set, queue) — somar. (Z) Zerar in-place se possível para reduzir. Mergesort: O(n) array + O(log n) stack = O(n). Quicksort in-place: O(log n) stack apenas.",
      },
    ],
    exercises: [
      {
        level: "iniciante",
        title: "Identifique a complexidade de 10 trechos de código",
        description: "Para cada trecho de código abaixo, identifique tempo e espaço. Comece com loops simples e termine com recursão. Foque em derivar — não chute. (1) sum de array; (2) busca de elemento em array; (3) checar duplicata com loop aninhado; (4) reverse de string concatenando char a char; (5) função recursiva fatorial(n); (6) função que imprime todos os pares de array; (7) loop com i *= 2 (i dobra); (8) mergeSort visto na seção de exemplos; (9) binary search iterativo; (10) Fibonacci recursivo sem memoização.",
        concepts: ["loops", "recursão", "drop constants", "Master Theorem básico", "espaço de call stack"],
        hint: "Para cada item, anote: 'tempo = ___, espaço = ___'. Para recursão, desenhe a árvore. Para loops, multiplique iterações.",
      },
      {
        level: "intermediario",
        title: "Otimize 5 algoritmos O(n²) para complexidade menor",
        description: "Para cada problema abaixo, escreva primeiro a solução O(n²), depois otimize: (1) Two Sum — par com soma alvo (otimize com hash); (2) verificar se array tem duplicata (otimize com Set); (3) intersecção de dois arrays (otimize com Set); (4) substring sem caracteres repetidos máxima (otimize com sliding window); (5) maior subarray contígua com soma máxima (Kadane — otimize com DP O(n)). Para cada um, comente sobre o trade-off de espaço.",
        concepts: ["hash map", "set", "sliding window", "Kadane", "trade-off espaço × tempo"],
        hint: "Toda vez que ver 'busca dentro de loop', tente substituir por hash/set lookup O(1). Se ver 'subarray contígua', pense em sliding window ou DP.",
      },
      {
        level: "intermediario",
        title: "Aplique Master Theorem em 6 recorrências",
        description: "Para cada recorrência, identifique a, b, f(n), calcule c=log_b(a), determine o caso e dê o resultado: (1) T(n) = 2T(n/2) + n (mergesort); (2) T(n) = T(n/2) + 1 (binary search); (3) T(n) = 4T(n/2) + n (matriz multiplicação naive); (4) T(n) = 7T(n/2) + n² (Strassen); (5) T(n) = 3T(n/4) + n·log n; (6) T(n) = T(n-1) + 1 (recursão linear — Master Theorem NÃO se aplica; resolva por substituição). Mostre todos os passos.",
        concepts: ["Master Theorem", "recorrência", "casos 1/2/3", "limitações do Master Theorem"],
        hint: "Master Theorem só serve para divisão em subproblemas de tamanho fração de n (n/b). Para T(n) = T(n-1) + ... use substituição — geralmente vira O(n) ou O(n²).",
      },
      {
        level: "senior",
        title: "Análise amortizada de uma estrutura de dados customizada",
        description: "Implemente uma 'Multistack' — uma estrutura que suporta push, pop e popMin (remove e retorna o menor elemento). Operações esperadas: push O(1), pop O(1), popMin O(?). Usando análise amortizada (aggregate, banker's, ou potential), prove que popMin é O(1) amortizado se você manter uma pilha auxiliar de mínimos. Inclua: (1) implementação completa em TypeScript; (2) prova de amortização escrita; (3) cenário onde o pior caso de uma operação individual é O(n) mas o amortizado ainda é O(1); (4) comparar com solução naive sem amortização.",
        concepts: ["análise amortizada", "aggregate method", "banker's method", "potential method", "estruturas de dados auxiliares"],
        hint: "A pilha auxiliar mantém apenas elementos que JÁ FORAM mínimos em algum momento. Toda push potencialmente adiciona à aux; toda pop potencialmente remove. O 'crédito' que cada push deposita paga pelo trabalho futuro.",
      },
      {
        level: "senior",
        title: "Espaço otimizado para DP — converta 3 problemas de O(n²) para O(n) espaço",
        description: "Para cada problema, escreva a solução DP padrão (espaço O(n²)) e depois otimize para O(n) usando rolling array: (1) 0/1 Knapsack — máximo valor com peso ≤ W; (2) Longest Common Subsequence (LCS) entre duas strings; (3) Edit Distance entre duas strings (Levenshtein). Para cada um: (a) escreva a versão O(n²) espaço; (b) identifique a dependência em dp[i][j] — apenas dp[i-1][·] ou também dp[i][j-1]?; (c) decida a direção de iteração para a versão otimizada (frente vs trás); (d) verifique correção com 3 testes; (e) discuta o trade-off: perda de capacidade de reconstruir o caminho ótimo.",
        concepts: ["DP", "rolling array", "space optimization", "ordem de iteração", "trade-off rastreamento × espaço"],
        hint: "0/1 Knapsack precisa iterar w de TRÁS para FRENTE para que dp[w-items[i]] ainda seja 'linha anterior'. LCS precisa de duas linhas (current e previous). Edit Distance: três células (i-1,j-1), (i-1,j), (i,j-1) — pode usar duas linhas + variável.",
      },
      {
        level: "senior",
        title: "Profile e otimização de código real",
        description: "Pegue qualquer função sua de produção (ou de uma biblioteca open-source) que receba input grande. Faça: (1) análise teórica de Big-O do código; (2) microbenchmark com n=100, 1k, 10k, 100k — mede tempo de execução; (3) plote tempo vs n em log-log e verifique se a inclinação bate com a Big-O teórica; (4) identifique gargalos com profiler (Chrome DevTools, Node --inspect, ou similar); (5) proponha 2 otimizações com base no profile, não em chute; (6) re-meça e compare. Documente diferença entre constante teórica e prática (cache, allocations, GC).",
        concepts: ["profiling", "microbenchmark", "log-log plot", "constantes na prática", "cache locality", "garbage collection"],
        hint: "Use console.time/timeEnd em JS, ou performance.now() para precisão maior. O log-log plot revela: inclinação 1 = O(n), 2 = O(n²), 0 = O(1). Inclinação fracionária pode indicar O(n log n) (≈1.1).",
      },
    ],
    videos: [
      { title: "Big O Notation - MIT OpenCourseWare 6.046", channel: "MIT", url: "https://www.youtube.com/watch?v=WoG-2omS2Cg" },
      { title: "Big O Notation in 5 Minutes", channel: "TechWithTim", url: "https://www.youtube.com/watch?v=__vX2sjlpXU" },
      { title: "Master Theorem Explained", channel: "Abdul Bari", url: "https://www.youtube.com/watch?v=OynWkEj0S-s" },
      { title: "Asymptotic Analysis Crash Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=Mo4vesaut8g" },
      { title: "Amortized Analysis (CLRS Chapter 17)", channel: "Bo Brinkman", url: "https://www.youtube.com/watch?v=R2Aa4PivG0g" },
      { title: "Big-O notation in 5 minutes — The basics", channel: "Michael Sambol", url: "https://www.youtube.com/watch?v=__vX2sjlpXU" },
    ],
    resources: [
      { title: "Big-O Cheatsheet — bigocheatsheet.com", url: "https://www.bigocheatsheet.com/", kind: "artigo" },
      { title: "visualgo.net — algorithm visualizer", url: "https://visualgo.net/", kind: "pratica" },
      { title: "CLRS Cap 3 — Growth of Functions", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/", kind: "livro" },
      { title: "NeetCode — Big-O playlist", url: "https://neetcode.io/courses/lessons/big-o-notation", kind: "video" },
      { title: "Asymptotic Notation — Khan Academy", url: "https://www.khanacademy.org/computing/computer-science/algorithms/asymptotic-notation/a/asymptotic-notation", kind: "artigo" },
      { title: "Master Theorem explicado — brilliant.org", url: "https://brilliant.org/wiki/master-theorem/", kind: "artigo" },
      { title: "Sedgewick — Analysis of Algorithms (Princeton)", url: "https://aofa.cs.princeton.edu/", kind: "livro" },
      { title: "CLRS Cap 17 — Amortized Analysis", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/", kind: "livro" },
    ],
  }

export default bigO
