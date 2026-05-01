import type { SkillContentMap } from "@/types"

const data: SkillContentMap = {
  "algoritmos-ds": {
    tagline: "Pensamento por padrões (sliding window, two pointers, BFS, DP, greedy) — não decoreba.",
    why: "Entrevista de big tech (e cada vez mais mid) cobra coding. Senior não decora algoritmos: reconhece padrão, escolhe DS adequado, justifica trade-off. Saber pensar > saber Dijkstra de cor. A diferença entre pleno e sênior em entrevistas técnicas não é quantos algoritmos você sabe — é a velocidade com que você reconhece qual padrão aplicar dado o enunciado. Pratique até que o padrão seja reflexo, não raciocínio.",
    prerequisite: "Big-O notation básico (saber expressar complexidade de tempo e espaço), JavaScript ou Python com sintaxe fluente (loops, arrays, funções, closures), recursão básica (entender call stack). Não precisa saber tudo — mas sem Big-O você não consegue justificar nenhuma escolha.",
    summary: "Estrutura de dados é ferramenta; algoritmo é técnica. Senior precisa reconhecer rápido o padrão do problema e escolher a DS certa. Domínio essencial: array, hash map/set, stack, queue, heap, linked list, árvore binária, grafo e trie. Padrões de algoritmo: two pointers, sliding window, prefix sum, binary search, BFS, DFS, backtracking, greedy, dynamic programming, union-find. Foque em reconhecimento de padrão + comunicação clara da abordagem antes de escrever código. O framework de 5 passos (clarify → example → brute force → optimize → code+test) é protocolo não-negociável em entrevista.",
    howToStudy: "<strong>Tem 30 minutos antes de uma entrevista?</strong> Abra o diagrama de árvore de decisão, percorra cada padrão em voz alta com um exemplo concreto. Revise os gotchas de edge case. Não tente resolver problemas novos agora — ative o que já sabe.<br><br><strong>Tem um fim de semana?</strong> Escolha 2 padrões (ex: sliding window + BFS). Leia a seção de quando usar, implemente o template de memória, depois resolva 3-4 problemas de cada no NeetCode. No segundo dia, revise os mesmos problemas sem consultar solução.<br><br><strong>Tem uma semana?</strong> Siga o NeetCode 150 em ordem de padrão (não de dificuldade). 2 problemas por dia, foco total em reconhecimento. No fim da semana, implemente cada estrutura de dados do zero a partir do cookbook desta skill.",
    diagrams: [
      {
        title: "Mapa de padrões de algoritmos — quando usar cada técnica",
        html: `<style>
.ads1-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.ads1-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.ads1-sub{font-size:10px;color:#475569;margin:0 0 14px}
.ads1-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ads1-card{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:11px;cursor:pointer;transition:border-color .2s,background .2s}
.ads1-card:hover,.ads1-card.open{border-color:#10B981;background:#10B98108}
.ads1-card-hd{display:flex;align-items:center;gap:7px;margin-bottom:0}
.ads1-badge{background:#10B98118;border:1px solid #10B98140;border-radius:4px;padding:1px 6px;font-size:9px;color:#10B981;font-family:'JetBrains Mono',monospace;flex-shrink:0}
.ads1-name{font-size:11px;font-weight:700;color:#e2e8f0}
.ads1-detail{display:none;margin-top:9px;padding-top:9px;border-top:1px solid #334155}
.ads1-card.open .ads1-detail{display:block}
.ads1-when{font-size:10px;color:#94a3b8;line-height:1.6;margin-bottom:6px}
.ads1-signal{font-size:9px;color:#10B981;margin-bottom:4px;font-weight:600}
.ads1-ex{font-size:9px;color:#475569;font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:4px;padding:4px 8px;line-height:1.7}
.ads1-code{font-family:'JetBrains Mono',monospace;font-size:9px;color:#94a3b8;background:#0f172a;border-radius:6px;padding:8px 10px;margin-top:6px;line-height:1.7;white-space:pre;overflow-x:auto}
.ads1-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.ads1-tip:hover .ads1-tb{display:block}
.ads1-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:40;color:#94a3b8;width:210px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.8);white-space:normal}
.ads1-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
.ads1-hint{font-size:9px;color:#475569;margin-top:10px;text-align:center}
</style>
<div class="ads1-wrap">
  <p class="ads1-title">Padrões de algoritmos — clique num padrão para ver quando usar + template</p>
  <p class="ads1-sub">10 padrões que cobrem &gt;90% dos problemas de entrevista</p>
  <div class="ads1-grid">

    <div class="ads1-card" onclick="this.classList.toggle('open')">
      <div class="ads1-card-hd"><span class="ads1-badge">O(1)</span><span class="ads1-name">Hash map / set</span></div>
      <div class="ads1-detail">
        <div class="ads1-signal">Sinais no enunciado:</div>
        <div class="ads1-when">Precisa de lookup por chave · frequência de elementos · "existe X?" · deduplicação · "dois elementos com soma Y" · anagramas</div>
        <div class="ads1-ex">two sum · group anagrams · LRU cache · contains duplicate</div>
        <div class="ads1-code">// Template hash map
const map = new Map()
for (const x of arr) {
  const need = target - x
  if (map.has(need)) return [map.get(need), i]
  map.set(x, i)
}</div>
      </div>
    </div>

    <div class="ads1-card" onclick="this.classList.toggle('open')">
      <div class="ads1-card-hd"><span class="ads1-badge">O(n)</span><span class="ads1-name">Two pointers</span></div>
      <div class="ads1-detail">
        <div class="ads1-signal">Sinais no enunciado:</div>
        <div class="ads1-when">Array <span class="ads1-tip">ordenado<span class="ads1-tb">Two pointers exige ordenação. Sem ordem: sort O(n log n) ou use hash O(n).</span></span> · busca de par com soma/condição · palindrome · remover duplicatas in-place · "container with most water"</div>
        <div class="ads1-ex">two sum II · 3sum · container with water · valid palindrome</div>
        <div class="ads1-code">let l = 0, r = arr.length - 1
while (l &lt; r) {
  const sum = arr[l] + arr[r]
  if (sum === target) return [l, r]
  else if (sum &lt; target) l++
  else r--
}</div>
      </div>
    </div>

    <div class="ads1-card" onclick="this.classList.toggle('open')">
      <div class="ads1-card-hd"><span class="ads1-badge">O(n)</span><span class="ads1-name">Sliding window</span></div>
      <div class="ads1-detail">
        <div class="ads1-signal">Sinais no enunciado:</div>
        <div class="ads1-when">Subarray/substring <span class="ads1-tip">contígua<span class="ads1-tb">Contígua = janela. Não contígua = two pointers ou DP.</span></span> com condição · "máximo/mínimo subarray com X" · "menor substring contendo K chars" · janela de tamanho fixo</div>
        <div class="ads1-ex">max sum subarray · min window substring · longest substring without repeat</div>
        <div class="ads1-code">let l = 0, maxLen = 0
const window = new Map()
for (let r = 0; r &lt; s.length; r++) {
  window.set(s[r], (window.get(s[r])||0)+1)
  while (window.size &gt; k) {  // invariante
    const c = window.get(s[l])
    if (c === 1) window.delete(s[l])
    else window.set(s[l], c-1)
    l++
  }
  maxLen = Math.max(maxLen, r-l+1)
}</div>
      </div>
    </div>

    <div class="ads1-card" onclick="this.classList.toggle('open')">
      <div class="ads1-card-hd"><span class="ads1-badge">O(log n)</span><span class="ads1-name">Binary search</span></div>
      <div class="ads1-detail">
        <div class="ads1-signal">Sinais no enunciado:</div>
        <div class="ads1-when">Array ordenado (ou rotacionado) · "encontre ponto de inflexão" · <span class="ads1-tip">predicate monotônico<span class="ads1-tb">"Se X funciona, X+1 também" → binary search on answer. Ex: capacidade mínima, janela mínima.</span></span> no espaço de respostas</div>
        <div class="ads1-ex">rotated sorted array · binary search on answer · peak element · koko eating bananas</div>
        <div class="ads1-code">let lo = 0, hi = arr.length - 1
while (lo &lt;= hi) {
  const mid = (lo + hi) >> 1
  if (arr[mid] === target) return mid
  else if (arr[mid] &lt; target) lo = mid + 1
  else hi = mid - 1
}
return -1</div>
      </div>
    </div>

    <div class="ads1-card" onclick="this.classList.toggle('open')">
      <div class="ads1-card-hd"><span class="ads1-badge">O(V+E)</span><span class="ads1-name">BFS</span></div>
      <div class="ads1-detail">
        <div class="ads1-signal">Sinais no enunciado:</div>
        <div class="ads1-when"><span class="ads1-tip">Caminho mais curto<span class="ads1-tb">BFS garante caminho mínimo em grafo não-ponderado. Com pesos: Dijkstra (heap + BFS).</span></span> sem peso · "nível a nível" · componentes conexos · transformação em passos mínimos</div>
        <div class="ads1-ex">shortest path · word ladder · number of islands · 01 matrix</div>
        <div class="ads1-code">const queue = [start], visited = new Set([start])
while (queue.length) {
  const node = queue.shift()
  for (const nb of graph[node]) {
    if (!visited.has(nb)) {
      visited.add(nb)
      queue.push(nb)
    }
  }
}</div>
      </div>
    </div>

    <div class="ads1-card" onclick="this.classList.toggle('open')">
      <div class="ads1-card-hd"><span class="ads1-badge">O(V+E)</span><span class="ads1-name">DFS / Backtracking</span></div>
      <div class="ads1-detail">
        <div class="ads1-signal">Sinais no enunciado:</div>
        <div class="ads1-when">Detectar ciclo · topological sort · todas combinações/permutações · árvore/grafo em profundidade · "todas as soluções possíveis"</div>
        <div class="ads1-ex">combinations · n-queens · cycle detection · topo sort · path sum</div>
        <div class="ads1-code">function backtrack(start, path) {
  if (path.length === k) { res.push([...path]); return }
  for (let i = start; i &lt;= n; i++) {
    path.push(i)
    backtrack(i+1, path)
    path.pop()          // desfaz escolha
  }
}</div>
      </div>
    </div>

    <div class="ads1-card" onclick="this.classList.toggle('open')">
      <div class="ads1-card-hd"><span class="ads1-badge">O(log n)</span><span class="ads1-name">Heap (priority queue)</span></div>
      <div class="ads1-detail">
        <div class="ads1-signal">Sinais no enunciado:</div>
        <div class="ads1-when">Top-k elementos · merge K listas · <span class="ads1-tip">processamento por prioridade<span class="ads1-tb">Heap extrai sempre o maior/menor em O(log n). Ideal quando você processa elements em ordem de valor, não de inserção.</span></span> · Dijkstra (grafo ponderado) · "k-ésimo maior/menor"</div>
        <div class="ads1-ex">kth largest · merge k sorted lists · task scheduler · dijkstra</div>
        <div class="ads1-code">// Min-heap em JS (usando array ordenado simulado)
// Em Python: import heapq; heapq.heappush(h, val)
// Top-k largest: manter min-heap de tamanho k
const heap = []
for (const n of nums) {
  heap.push(n); heap.sort((a,b)=>a-b)
  if (heap.length > k) heap.shift()
}
return heap[0] // k-th largest</div>
      </div>
    </div>

    <div class="ads1-card" onclick="this.classList.toggle('open')">
      <div class="ads1-card-hd"><span class="ads1-badge">O(n·k)</span><span class="ads1-name">Dynamic programming</span></div>
      <div class="ads1-detail">
        <div class="ads1-signal">Sinais no enunciado:</div>
        <div class="ads1-when">Max/min/count + escolhas em cada passo · <span class="ads1-tip">subproblemas sobrepostos<span class="ads1-tb">Recursão natural recomputa os mesmos subproblemas. Adicione memo → DP top-down. Convert para tabulação → bottom-up.</span></span> · subestrutura ótima · "número de formas de atingir X"</div>
        <div class="ads1-ex">coin change · knapsack · LIS · edit distance · climbing stairs</div>
        <div class="ads1-code">// Bottom-up: coin change
const dp = Array(amount+1).fill(Infinity)
dp[0] = 0
for (let a = 1; a &lt;= amount; a++)
  for (const c of coins)
    if (c &lt;= a) dp[a] = Math.min(dp[a], dp[a-c]+1)
return dp[amount] === Infinity ? -1 : dp[amount]</div>
      </div>
    </div>

    <div class="ads1-card" onclick="this.classList.toggle('open')">
      <div class="ads1-card-hd"><span class="ads1-badge">O(α(n))</span><span class="ads1-name">Union-Find</span></div>
      <div class="ads1-detail">
        <div class="ads1-signal">Sinais no enunciado:</div>
        <div class="ads1-when">Componentes conexos dinâmicos · "estão no mesmo grupo?" · detectar ciclo em grafo não-dirigido · merge de conjuntos · Kruskal MST</div>
        <div class="ads1-ex">number of provinces · redundant connection · accounts merge · min cost connect</div>
        <div class="ads1-code">const parent = Array.from({length:n}, (_,i)=>i)
const rank = Array(n).fill(0)
function find(x) {
  if (parent[x]!==x) parent[x]=find(parent[x])
  return parent[x]
}
function union(x,y) {
  const [px,py] = [find(x),find(y)]
  if (px===py) return false
  rank[px]>=rank[py] ? parent[py]=px : parent[px]=py
  if (rank[px]===rank[py]) rank[px]++
  return true
}</div>
      </div>
    </div>

    <div class="ads1-card" onclick="this.classList.toggle('open')">
      <div class="ads1-card-hd"><span class="ads1-badge">O(n·m)</span><span class="ads1-name">Prefix sum</span></div>
      <div class="ads1-detail">
        <div class="ads1-signal">Sinais no enunciado:</div>
        <div class="ads1-when">Range sum query repetida · "soma de subarray" em O(1) após pre-processamento · diferença de prefixos para range update · "subarray com soma igual a k"</div>
        <div class="ads1-ex">range sum query · subarray sum equals k · product except self · 2D matrix sum</div>
        <div class="ads1-code">// Prefix sum + hash map: subarray sum == k
const prefix = new Map([[0,1]])
let sum = 0, count = 0
for (const n of nums) {
  sum += n
  count += prefix.get(sum-k) || 0
  prefix.set(sum, (prefix.get(sum)||0)+1)
}</div>
      </div>
    </div>

  </div>
  <p class="ads1-hint">Clique em cada padrão para expandir • Template de código + quando usar</p>
</div>`,
        caption: "Reconhecimento de padrão é a habilidade-chave em entrevista. Treine associar o enunciado do problema ao padrão, não à solução memorizada.",
      },
      {
        title: "Estruturas de dados e complexidades de operações",
        html: `<style>
.ads2-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.ads2-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px;font-family:'Space Grotesk',sans-serif}
.ads2-sub{font-size:10px;color:#475569;margin:0 0 14px;font-family:'Space Grotesk',sans-serif}
.ads2-table{width:100%;border-collapse:collapse;font-size:9.5px}
.ads2-table th{background:#1e293b;color:#94a3b8;padding:7px 9px;text-align:center;font-weight:700;border-bottom:2px solid #334155;border-right:1px solid #0f172a;white-space:nowrap}
.ads2-table th:first-child{text-align:left;min-width:100px}
.ads2-table td{padding:6px 9px;border-bottom:1px solid #1e293b;border-right:1px solid #0f172a;text-align:center;color:#e2e8f0;font-weight:600}
.ads2-table td:first-child{text-align:left;color:#94a3b8;font-weight:400}
.ads2-table tr:hover td{background:#1e293b80}
.c1{color:#10B981}.c2{color:#34d399}.c3{color:#86efac}.cy{color:#fbbf24}.co{color:#f97316}.cr{color:#ef4444}
.ads2-legend{display:flex;gap:10px;margin-top:10px;flex-wrap:wrap}
.ads2-leg{display:flex;align-items:center;gap:5px;font-size:9px}
.ads2-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.ads2-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.ads2-tip:hover .ads2-tb{display:block}
.ads2-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:-20px;background:#020617;border:1px solid #334155;border-radius:8px;padding:9px 11px;font-size:10px;line-height:1.6;z-index:40;color:#94a3b8;width:220px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.8);white-space:normal;font-family:'Space Grotesk',sans-serif}
.ads2-tb::after{content:'';position:absolute;top:100%;left:24px;border:5px solid transparent;border-top-color:#334155}
</style>
<div class="ads2-wrap">
  <p class="ads2-title">Estruturas de dados — complexidades de operações</p>
  <p class="ads2-sub">Cores: verde = ótimo · amarelo = ok · vermelho = evitar quando possível</p>
  <table class="ads2-table">
    <thead>
      <tr>
        <th>Estrutura</th>
        <th>Access</th>
        <th>Search</th>
        <th>Insert</th>
        <th>Delete</th>
        <th>Space</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="ads2-tip">Array<span class="ads2-tb">Cache-friendly, memória contígua. Search linear → use quando índice é conhecido ou dataset pequeno.</span></span></td>
        <td class="c1">O(1)</td><td class="cr">O(n)</td><td class="co">O(n)*</td><td class="co">O(n)*</td><td class="c1">O(n)</td>
      </tr>
      <tr>
        <td><span class="ads2-tip">Linked list<span class="ads2-tb">Insert/delete O(1) no nó conhecido, mas search linear. Cache-unfriendly. Use em queues implementadas.</span></span></td>
        <td class="cr">O(n)</td><td class="cr">O(n)</td><td class="c1">O(1)</td><td class="c1">O(1)</td><td class="c1">O(n)</td>
      </tr>
      <tr>
        <td><span class="ads2-tip">Stack / Queue<span class="ads2-tb">Stack: LIFO. Queue: FIFO. Ambas O(1) para push/pop quando implementadas com linked list ou deque.</span></span></td>
        <td class="cr">O(n)</td><td class="cr">O(n)</td><td class="c1">O(1)</td><td class="c1">O(1)</td><td class="c1">O(n)</td>
      </tr>
      <tr>
        <td><span class="ads2-tip">Hash map<span class="ads2-tb">O(1) amortizado. Pior caso O(n) em colisão. Não preserva ordem. Em JS: Map preserva ordem de inserção.</span></span></td>
        <td class="c1">O(1)*</td><td class="c1">O(1)*</td><td class="c1">O(1)*</td><td class="c1">O(1)*</td><td class="c1">O(n)</td>
      </tr>
      <tr>
        <td><span class="ads2-tip">BST (balanceada)<span class="ads2-tb">AVL ou Red-Black garante O(log n). BST sem balanceamento degenera para O(n). Em JS não há BST nativa.</span></span></td>
        <td class="c2">O(log n)</td><td class="c2">O(log n)</td><td class="c2">O(log n)</td><td class="c2">O(log n)</td><td class="c1">O(n)</td>
      </tr>
      <tr>
        <td><span class="ads2-tip">Heap (min/max)<span class="ads2-tb">Insert e extract O(log n). Peek (min/max) O(1). Não suporta search arbitrária. Use para top-k e Dijkstra.</span></span></td>
        <td class="c1">O(1)*</td><td class="cr">O(n)</td><td class="c2">O(log n)</td><td class="c2">O(log n)</td><td class="c1">O(n)</td>
      </tr>
      <tr>
        <td><span class="ads2-tip">Trie<span class="ads2-tb">Insert/search em O(m) onde m = comprimento da string. Espaço pode ser grande: O(n·m). Ideal para prefixos.</span></span></td>
        <td class="c1">O(m)</td><td class="c1">O(m)</td><td class="c1">O(m)</td><td class="c1">O(m)</td><td class="co">O(n·m)</td>
      </tr>
      <tr>
        <td><span class="ads2-tip">Grafo adj list<span class="ads2-tb">V vértices, E arestas. BFS/DFS em O(V+E). Espaço O(V+E). Melhor para grafos esparsos (E &lt;&lt; V²).</span></span></td>
        <td class="c2">O(V)</td><td class="co">O(V+E)</td><td class="c1">O(1)</td><td class="c2">O(E)</td><td class="c1">O(V+E)</td>
      </tr>
    </tbody>
  </table>
  <div class="ads2-legend">
    <div class="ads2-leg"><div class="ads2-dot" style="background:#10B981"></div><span style="color:#94a3b8">O(1) — constante</span></div>
    <div class="ads2-leg"><div class="ads2-dot" style="background:#34d399"></div><span style="color:#94a3b8">O(log n) — ótimo</span></div>
    <div class="ads2-leg"><div class="ads2-dot" style="background:#fbbf24"></div><span style="color:#94a3b8">O(n log n) — ok</span></div>
    <div class="ads2-leg"><div class="ads2-dot" style="background:#f97316"></div><span style="color:#94a3b8">O(n) — linear</span></div>
    <div class="ads2-leg"><div class="ads2-dot" style="background:#ef4444"></div><span style="color:#94a3b8">O(n²)+ — evitar</span></div>
    <div style="font-size:9px;color:#475569;margin-left:auto">* = amortizado</div>
  </div>
</div>`,
        caption: "Memorize esta tabela. Em entrevista, você vai justificar a escolha de DS com ela. Perguntas comuns: 'por que hash e não array?' e 'qual a complexidade de insert no heap?'",
      },
      {
        title: "Árvore de decisão — qual padrão usar dado o tipo de problema",
        html: `<style>
.ads3-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.ads3-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.ads3-sub{font-size:10px;color:#475569;margin:0 0 14px}
.ads3-q{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:10px 13px;font-size:10px;font-weight:600;color:#e2e8f0;cursor:pointer;transition:border-color .2s;margin-bottom:4px;display:flex;align-items:center;gap:8px}
.ads3-q:hover{border-color:#10B981}
.ads3-q-icon{font-size:12px;min-width:18px;text-align:center}
.ads3-answers{display:none;margin-left:16px;padding-left:12px;border-left:2px solid #334155;margin-bottom:8px}
.ads3-q.open+.ads3-answers{display:block}
.ads3-ans{display:flex;gap:6px;margin-bottom:4px;align-items:flex-start}
.ads3-ans-label{font-size:9px;font-weight:700;min-width:24px;text-align:center;padding:2px 0;border-radius:3px;flex-shrink:0;margin-top:2px}
.ads3-ans-text{font-size:10px;color:#94a3b8;line-height:1.6}
.ads3-pattern{font-size:9px;font-weight:700;display:inline-block;background:#10B98118;border:1px solid #10B98140;border-radius:3px;padding:1px 6px;color:#10B981;margin-left:4px;font-family:'JetBrains Mono',monospace}
</style>
<div class="ads3-wrap">
  <p class="ads3-title">Árvore de decisão — qual padrão escolher?</p>
  <p class="ads3-sub">Clique na pergunta para expandir o diagnóstico</p>

  <div class="ads3-q" onclick="this.classList.toggle('open')"><span class="ads3-q-icon">🔍</span>Preciso encontrar ou verificar existência de algo em dados lineares?</div>
  <div class="ads3-answers">
    <div class="ads3-ans">
      <span class="ads3-ans-label" style="background:#10B98120;color:#10B981">Sim</span>
      <div class="ads3-ans-text">Dados ordenados? → <span class="ads3-pattern">Binary search</span> O(log n)<br>Não ordenado, lookup por chave? → <span class="ads3-pattern">Hash map</span> O(1)<br>Não ordenado, sem key? → scan linear O(n)</div>
    </div>
    <div class="ads3-ans">
      <span class="ads3-ans-label" style="background:#ef444420;color:#ef4444">Não</span>
      <div class="ads3-ans-text">Continua nas próximas perguntas</div>
    </div>
  </div>

  <div class="ads3-q" onclick="this.classList.toggle('open')"><span class="ads3-q-icon">📏</span>Problema envolve subarray/substring contígua com alguma condição?</div>
  <div class="ads3-answers">
    <div class="ads3-ans">
      <span class="ads3-ans-label" style="background:#10B98120;color:#10B981">Sim</span>
      <div class="ads3-ans-text">Janela de tamanho fixo → <span class="ads3-pattern">Sliding window fixo</span><br>Tamanho variável (max/min com condição) → <span class="ads3-pattern">Sliding window variável</span><br>Soma de range em O(1) → <span class="ads3-pattern">Prefix sum</span></div>
    </div>
  </div>

  <div class="ads3-q" onclick="this.classList.toggle('open')"><span class="ads3-q-icon">🔢</span>Problema envolve par/trio de elementos com soma ou condição?</div>
  <div class="ads3-answers">
    <div class="ads3-ans">
      <span class="ads3-ans-label" style="background:#10B98120;color:#10B981">Sim</span>
      <div class="ads3-ans-text">Array ordenado → <span class="ads3-pattern">Two pointers</span> O(n)<br>Não ordenado → sort + two pointers ou <span class="ads3-pattern">Hash map</span><br>Frequência de pares → <span class="ads3-pattern">Hash map de contagem</span></div>
    </div>
  </div>

  <div class="ads3-q" onclick="this.classList.toggle('open')"><span class="ads3-q-icon">🌐</span>Problema envolve grafo ou árvore?</div>
  <div class="ads3-answers">
    <div class="ads3-ans">
      <span class="ads3-ans-label" style="background:#10B98120;color:#10B981">Sim</span>
      <div class="ads3-ans-text">Caminho mais curto sem peso → <span class="ads3-pattern">BFS</span><br>Caminho mais curto com peso → <span class="ads3-pattern">Dijkstra (heap+BFS)</span><br>Ciclo / topological sort / DFS problems → <span class="ads3-pattern">DFS</span><br>Componentes conexos dinâmicos → <span class="ads3-pattern">Union-Find</span><br>Menor árvore geradora → <span class="ads3-pattern">Kruskal/Prim</span></div>
    </div>
  </div>

  <div class="ads3-q" onclick="this.classList.toggle('open')"><span class="ads3-q-icon">🏆</span>Problema pede "top-k" ou processamento por prioridade?</div>
  <div class="ads3-answers">
    <div class="ads3-ans">
      <span class="ads3-ans-label" style="background:#10B98120;color:#10B981">Sim</span>
      <div class="ads3-ans-text">Top-k maior → <span class="ads3-pattern">Min-heap tamanho k</span> O(n log k)<br>Top-k menor → <span class="ads3-pattern">Max-heap tamanho k</span><br>Merge K listas/arrays → <span class="ads3-pattern">Min-heap</span> O(n log k)<br>Processo por menor custo → <span class="ads3-pattern">Heap</span> (Dijkstra)</div>
    </div>
  </div>

  <div class="ads3-q" onclick="this.classList.toggle('open')"><span class="ads3-q-icon">🎯</span>Problema pede "todas as combinações/permutações/subsets"?</div>
  <div class="ads3-answers">
    <div class="ads3-ans">
      <span class="ads3-ans-label" style="background:#10B98120;color:#10B981">Sim</span>
      <div class="ads3-ans-text">Use <span class="ads3-pattern">Backtracking</span> com poda de candidatos inválidos.<br>Estado: [escolhas feitas], [candidatos restantes]<br>Poda: constraints do problema reduzem árvore</div>
    </div>
  </div>

  <div class="ads3-q" onclick="this.classList.toggle('open')"><span class="ads3-q-icon">💰</span>Problema pede "máximo/mínimo/contagem" com escolhas em cada passo?</div>
  <div class="ads3-answers">
    <div class="ads3-ans">
      <span class="ads3-ans-label" style="background:#10B98120;color:#10B981">Sim</span>
      <div class="ads3-ans-text">Escolha local ótima funciona? → <span class="ads3-pattern">Greedy</span> O(n)<br>Subproblemas se repetem? → <span class="ads3-pattern">Dynamic programming</span><br>DP 1D (depende de dp[i-1])? → array simples<br>DP 2D (duas dimensões)? → matriz</div>
    </div>
  </div>

  <div class="ads3-q" onclick="this.classList.toggle('open')"><span class="ads3-q-icon">📝</span>Problema envolve strings com prefixo/autocompletar?</div>
  <div class="ads3-answers">
    <div class="ads3-ans">
      <span class="ads3-ans-label" style="background:#10B98120;color:#10B981">Sim</span>
      <div class="ads3-ans-text">Muitas strings com prefixo comum → <span class="ads3-pattern">Trie</span> O(m) por operação<br>Substring search → <span class="ads3-pattern">KMP ou sliding window</span><br>Anagramas/grupos → <span class="ads3-pattern">Hash map (sorted key ou count)</span></div>
    </div>
  </div>
</div>`,
        caption: "Esta árvore de decisão deve se tornar reflexo. Em entrevista, percorra mentalmente estas perguntas nos primeiros 2 minutos após ler o enunciado.",
      },
    ],
    cheatsheet: {
      title: "Cheatsheet — templates de código e mnemonics de padrão",
      html: `<style>
.ads-cs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.ads-cs-h{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.ads-cs-sub{font-family:'Space Grotesk',sans-serif;font-size:10px;color:#475569;margin:0 0 14px}
.ads-cs-sec{margin-bottom:14px}
.ads-cs-sec-title{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;color:#10B981;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #1e293b}
.ads-cs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ads-cs-card{background:#1e293b;border:1px solid #334155;border-radius:7px;padding:9px 11px}
.ads-cs-ct{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:600;color:#e2e8f0;margin-bottom:5px}
.ads-cs-code{font-size:9px;color:#94a3b8;line-height:1.7;white-space:pre;overflow-x:auto}
.ads-cs-mnemonic{background:#10B98110;border:1px solid #10B98130;border-radius:5px;padding:6px 10px;font-family:'Space Grotesk',sans-serif;font-size:10px;color:#10B981;margin-bottom:4px}
.ads-cs-mnem-label{font-size:9px;color:#475569;margin-bottom:2px;text-transform:uppercase;font-weight:600}
.ads-cs-row{display:flex;gap:8px;flex-wrap:wrap}
</style>
<div class="ads-cs-wrap">
  <p class="ads-cs-h">Cheatsheet de algoritmos e DS</p>
  <p class="ads-cs-sub">Templates de código + mnemonics para entrevista</p>

  <div class="ads-cs-sec">
    <div class="ads-cs-sec-title">Mnemonics de reconhecimento de padrão</div>
    <div class="ads-cs-row">
      <div style="flex:1;min-width:200px">
        <div class="ads-cs-mnemonic"><span class="ads-cs-mnem-label">Hash map</span><br>"Preciso encontrar X dado Y?" → hash em Y</div>
        <div class="ads-cs-mnemonic"><span class="ads-cs-mnem-label">Two pointers</span><br>Ordenado + par/trio + condição de soma</div>
        <div class="ads-cs-mnemonic"><span class="ads-cs-mnem-label">Sliding window</span><br>Subarray contígua + max/min/condição</div>
        <div class="ads1-mnemonic" style="background:#10B98110;border:1px solid #10B98130;border-radius:5px;padding:6px 10px;font-family:'Space Grotesk',sans-serif;font-size:10px;color:#10B981;margin-bottom:4px"><span class="ads-cs-mnem-label">Prefix sum</span><br>Range query repetida em array imutável</div>
      </div>
      <div style="flex:1;min-width:200px">
        <div class="ads-cs-mnemonic"><span class="ads-cs-mnem-label">BFS</span><br>Menor número de passos → nível a nível</div>
        <div class="ads-cs-mnemonic"><span class="ads-cs-mnem-label">DFS/Backtracking</span><br>"Todas as soluções" ou ciclo/topologia</div>
        <div class="ads-cs-mnemonic"><span class="ads-cs-mnem-label">DP</span><br>Max/min/count + escolhas + subproblemas repetem</div>
        <div class="ads-cs-mnemonic"><span class="ads-cs-mnem-label">Heap</span><br>Top-k ou processamento por prioridade</div>
      </div>
    </div>
  </div>

  <div class="ads-cs-sec">
    <div class="ads-cs-sec-title">Templates essenciais (JavaScript)</div>
    <div class="ads-cs-grid">
      <div class="ads-cs-card">
        <div class="ads-cs-ct">BFS genérico</div>
        <div class="ads-cs-code">const q = [[start, 0]], seen = new Set([start])
while (q.length) {
  const [node, dist] = q.shift()
  if (node === end) return dist
  for (const nb of adj[node])
    if (!seen.has(nb)) {
      seen.add(nb); q.push([nb, dist+1])
    }
}</div>
      </div>
      <div class="ads-cs-card">
        <div class="ads-cs-ct">DFS iterativo</div>
        <div class="ads-cs-code">const stack = [root], visited = new Set()
while (stack.length) {
  const node = stack.pop()
  if (visited.has(node)) continue
  visited.add(node)
  // processa node
  for (const nb of adj[node])
    if (!visited.has(nb)) stack.push(nb)
}</div>
      </div>
      <div class="ads-cs-card">
        <div class="ads-cs-ct">Binary search (variações)</div>
        <div class="ads-cs-code">// lower_bound (primeiro >= target)
let lo=0, hi=n
while (lo &lt; hi) {
  const mid=(lo+hi)>>1
  if (arr[mid] &lt; target) lo=mid+1
  else hi=mid
}
// upper_bound: arr[mid] &lt;= target → lo=mid+1</div>
      </div>
      <div class="ads-cs-card">
        <div class="ads-cs-ct">Backtracking genérico</div>
        <div class="ads-cs-code">function bt(start, path, res) {
  if (isGoal(path)) { res.push([...path]); return }
  for (let i=start; i&lt;n; i++) {
    if (!isValid(i, path)) continue // poda
    path.push(candidates[i])
    bt(i+1, path, res)              // ou i para repetição
    path.pop()
  }
}</div>
      </div>
      <div class="ads-cs-card">
        <div class="ads-cs-ct">Union-Find com path compression</div>
        <div class="ads-cs-code">const p=Array.from({length:n},(_,i)=>i), r=Array(n).fill(0)
const find=x=>p[x]===x?x:(p[x]=find(p[x]))
const union=(x,y)=>{
  const [a,b]=[find(x),find(y)]; if(a===b) return false
  r[a]>=r[b]?p[b]=a:p[a]=b; if(r[a]===r[b])r[a]++
  return true
}</div>
      </div>
      <div class="ads-cs-card">
        <div class="ads-cs-ct">Trie (implementação)</div>
        <div class="ads-cs-code">class TrieNode { children={}; end=false }
class Trie {
  root=new TrieNode()
  insert(w){let n=this.root;for(const c of w){if(!n.children[c])n.children[c]=new TrieNode();n=n.children[c]}n.end=true}
  search(w){let n=this.root;for(const c of w){if(!n.children[c])return false;n=n.children[c]}return n.end}
  startsWith(p){let n=this.root;for(const c of p){if(!n.children[c])return false;n=n.children[c]}return true}
}</div>
      </div>
    </div>
  </div>

  <div class="ads-cs-sec">
    <div class="ads-cs-sec-title">Protocolo de entrevista — 5 passos obrigatórios</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <div style="background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 11px;flex:1;min-width:120px">
        <div style="font-family:'Space Grotesk',sans-serif;font-size:9px;color:#10B981;font-weight:700;margin-bottom:3px">① CLARIFY</div>
        <div style="font-size:9px;color:#94a3b8;line-height:1.6">Input type/range · output esperado · edge cases (vazio, negativo, duplicado) · constraints</div>
      </div>
      <div style="background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 11px;flex:1;min-width:120px">
        <div style="font-family:'Space Grotesk',sans-serif;font-size:9px;color:#3b82f6;font-weight:700;margin-bottom:3px">② EXAMPLES</div>
        <div style="font-size:9px;color:#94a3b8;line-height:1.6">Roda manual 2-3 casos. Inclui edge case. Confirma entendimento com entrevistador.</div>
      </div>
      <div style="background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 11px;flex:1;min-width:120px">
        <div style="font-family:'Space Grotesk',sans-serif;font-size:9px;color:#f59e0b;font-weight:700;margin-bottom:3px">③ BRUTE FORCE</div>
        <div style="font-size:9px;color:#94a3b8;line-height:1.6">Solução O(n²) ou O(n!) primeiro. Comunica complexidade. Não code — apenas descreve.</div>
      </div>
      <div style="background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 11px;flex:1;min-width:120px">
        <div style="font-family:'Space Grotesk',sans-serif;font-size:9px;color:#a855f7;font-weight:700;margin-bottom:3px">④ OPTIMIZE</div>
        <div style="font-size:9px;color:#94a3b8;line-height:1.6">Identifica padrão. Justifica escolha de DS. Comunica trade-off espaço × tempo.</div>
      </div>
      <div style="background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 11px;flex:1;min-width:120px">
        <div style="font-family:'Space Grotesk',sans-serif;font-size:9px;color:#ef4444;font-weight:700;margin-bottom:3px">⑤ CODE + TEST</div>
        <div style="font-size:9px;color:#94a3b8;line-height:1.6">Escreve código limpo. Testa com exemplo + edge case. Analisa complexidade final.</div>
      </div>
    </div>
  </div>
</div>`,
    },
    keypoints: [
      { title: "Hash map / set", body: "O(1) lookup amortizado. Resolve 30%+ dos problemas de entrevista (two sum, anagramas, contagem de frequência). Pergunta-chave: o que você indexa? Frequência? Posição? Diferença? Complemento? A chave do map é sempre o que você busca, o valor é o que você guarda.", code: "// Two sum O(n)\nconst map = new Map()\nfor (let i = 0; i < nums.length; i++) {\n  const need = target - nums[i]\n  if (map.has(need)) return [map.get(need), i]\n  map.set(nums[i], i)\n}" },
      { title: "Two pointers", body: "Array ordenado com dois ponteiros convergindo das pontas. Reduz O(n²) → O(n) em busca de pares. Exige ordenação — sem ela: sort primeiro (O(n log n) total) ou use hash map. Variação: slow/fast pointer para ciclo em linked list (Floyd's algorithm).", code: "// Pair sum em array ordenado O(n)\nlet l = 0, r = arr.length - 1\nwhile (l < r) {\n  const s = arr[l] + arr[r]\n  if (s === target) return [l, r]\n  s < target ? l++ : r--\n}" },
      { title: "Sliding window", body: "Janela deslizante sobre array/string. Útil para 'maior/menor subarray com condição', 'min substring contendo X'. Invariante: a janela [l, r] sempre satisfaz a condição. Quando viola, move l para restaurar. Quando válida, atualiza resposta e move r.", code: "// Longest substring with at most k distinct chars O(n)\nconst freq = new Map(); let l = 0, res = 0\nfor (let r = 0; r < s.length; r++) {\n  freq.set(s[r], (freq.get(s[r])||0)+1)\n  while (freq.size > k) {\n    const c = s[l++]\n    freq.set(c, freq.get(c)-1)\n    if (!freq.get(c)) freq.delete(c)\n  }\n  res = Math.max(res, r-l+1)\n}" },
      { title: "BFS vs DFS", body: "BFS: nível a nível com queue. Garante caminho mais curto em grafo não-ponderado. Memória O(largura) — pode ser enorme em grafos largos. DFS: profundidade com stack/recursão. Bom para ciclo, topological sort, backtracking. Memória O(altura). Em árvore balanceada: largura ~= 2^h, altura ~= h — DFS é muito mais econômico em memória." },
      { title: "Heap (priority queue)", body: "Estrutura que extrai sempre o mínimo (min-heap) ou máximo (max-heap) em O(log n). Use para top-k, merge de K listas ordenadas, Dijkstra. Insert: O(log n). Extract-min/max: O(log n). Peek: O(1). Em Python: heapq é min-heap nativo. Em JS não há heap nativo — simule com array ordenado para entrevista ou use solução de biblioteca.", code: "// Top-k largest elements O(n log k)\n// Python\nimport heapq\ndef topK(nums, k):\n    return heapq.nlargest(k, nums)\n# Ou: min-heap de tamanho k\nh = []\nfor n in nums:\n    heapq.heappush(h, n)\n    if len(h) > k: heapq.heappop(h)\nreturn h[0]  # k-th largest" },
      { title: "Binary search", body: "Divide e conquista em espaço ordenado. Reduz O(n) → O(log n). Template clássico: lo=0, hi=n-1, mid=(lo+hi)>>1. Atenção ao loop invariant: lo <= hi vs lo < hi muda o resultado. 'Binary search on answer': ao invés de buscar elemento, busca o valor da resposta em espaço [min, max] com predicate monotônico.", code: "// Binary search on answer: min capacity to ship in D days\nfunction canShip(capacity, weights, days) {\n  let d=1, cur=0\n  for (const w of weights) {\n    if (cur+w > capacity) { d++; cur=0 }\n    cur += w\n  }\n  return d <= days\n}\nlet lo=Math.max(...weights), hi=weights.reduce((a,b)=>a+b)\nwhile (lo<hi) {\n  const mid=(lo+hi)>>1\n  canShip(mid,weights,D) ? hi=mid : lo=mid+1\n}\nreturn lo" },
      { title: "Dynamic programming", body: "Memoize resultados de subproblemas sobrepostos. Reconhecimento: 'max/min/count + escolhas em cada passo + subproblemas se repetem'. Framework: 1) define estado, 2) define transição (relação recursiva), 3) base case, 4) ordem de computação (top-down com memo ou bottom-up com tabulação)." },
      { title: "Backtracking", body: "DFS com poda. Gera candidatos, verifica constraint, avança ou desfaz escolha (backtrack). Use para todas as combinações/permutações/subsets. Complexidade sem poda: O(n!). Com poda eficiente pode ser muito melhor. Sempre desfaça a escolha antes de retornar para explorar outros candidatos." },
      { title: "Union-Find (DSU)", body: "Gerencia componentes conexos dinâmicos com duas operações: find(x) = raiz do componente de x, union(x,y) = une os componentes. Com path compression + union by rank: O(α(n)) ≈ O(1) amortizado. Use para detectar ciclo em grafo não-dirigido, componentes conexos que se mesclam, e MST (Kruskal)." },
      { title: "Trie", body: "Árvore de prefixos onde cada nó representa um caractere. Insert/search em O(m) onde m = comprimento da string. Espaço O(n·m) no pior caso. Use para autocomplete, busca por prefixo, problemas de string com prefixo comum. Cada nó tem mapa de filhos e flag 'isEnd'." },
    ],
    mnemonics: [
      { label: "HASH quando: FPD", trick: "Frequência · Presença · Diferença", explanation: "Se o problema pede frequência de elementos, verificação de presença/ausência, ou diferença/complemento (como target - x no two sum), use hash map. É o padrão mais versátil." },
      { label: "SLIDING WINDOW quando: SCC", trick: "Subarray · Contígua · Condição", explanation: "Subarray ou substring Contígua com alguma Condição (max length, min length, contém K chars distintos) → sliding window com invariante na janela." },
      { label: "BFS quando: MC", trick: "Mínimo · Contagem de passos", explanation: "BFS encontra o caminho com Mínimo de passos (Contagem de níveis) em grafo não-ponderado. Se o enunciado fala em 'menor número de operações', pense BFS primeiro." },
      { label: "DP quando: MOC", trick: "Max/Min/Count + Overlapping", explanation: "Se o problema pede Max, Min ou Count com escolhas em cada passo, E os subproblemas se Overlap (mesma recursão aparece múltiplas vezes) → Dynamic Programming." },
    ],
    gotchas: [
      "Começar a codar antes de entender o problema — sempre pergunte: input type/range, output esperado, edge cases (array vazio, um elemento, negativos, duplicados).",
      "Não comunicar o trade-off — entrevistador quer ouvir 'O(n²) tempo, O(1) espaço; posso otimizar com hash para O(n) tempo mas O(n) espaço'.",
      "Decorar Dijkstra mas não saber quando usar — entrevista premia reconhecimento de padrão, não memória de algoritmo.",
      "Confundir índice e valor em problemas com hash — debug clássico: você indexou pelo valor quando devia indexar pelo índice, ou vice-versa.",
      "Recursão sem memo em DP → exponencial. Sempre cheque se há subproblemas sobrepostos antes de decidir se DP ajuda.",
      "Off-by-one em binary search e sliding window — pratique boundary conditions: lo <= hi vs lo < hi, incluir ou excluir mid.",
      "Usar BFS quando o problema pede caminho mais curto ponderado — precisa Dijkstra (heap + distâncias).",
      "Não checar edge cases depois de codificar: array vazio, único elemento, todos iguais, negativos — sempre teste 2-3 casos antes de declarar pronto.",
      "Usar sort quando não precisa (O(n log n) desnecessário) — pergunte 'precisa de ordenação ou só de lookup?' → muitas vezes hash resolve em O(n).",
      "Não comunicar a abordagem verbal antes de escrever código — entrevistador não consegue avaliar raciocínio se você codifica em silêncio.",
    ],
    interview: [
      { q: "Como você aborda um problema novo numa entrevista?", a: "<p>Sempre 5 passos — nunca pule nenhum:</p><ol><li><strong>Clarify</strong>: input (tipo, range, constraints), output esperado, edge cases. Pergunte: array pode ser vazio? Tem negativos? Duplicatas?</li><li><strong>Examples</strong>: rode manualmente 2-3 casos, incluindo edge case. Confirme com o entrevistador.</li><li><strong>Brute force</strong>: descreva (não code) a solução óbvia O(n²) ou O(n!). Anuncie a complexidade.</li><li><strong>Optimize</strong>: identifique o padrão (hash? two pointers? DP?). Justifique a escolha e o trade-off espaço × tempo.</li><li><strong>Code + test</strong>: escreva código limpo, teste com seus exemplos + edge case, anuncie complexidade final.</li></ol>", level: "pleno" },
      { q: "Quando usar hash map?", a: "<p>Quando preciso de O(1) lookup por chave. Padrões clássicos:</p><ul><li><strong>Two sum</strong>: indexa <code>target - x</code> → encontra complemento.</li><li><strong>Anagramas</strong>: indexa por sorted(s) ou tuple de contagem de chars.</li><li><strong>Frequência</strong>: conta ocorrências de cada elemento.</li><li><strong>Dedup/presença</strong>: Set é suficiente.</li><li><strong>Memoização DP</strong>: indexa pelo estado (i, j, capacidade...).</li></ul>", level: "pleno" },
      { q: "Diferença entre BFS e DFS?", a: "<p><strong>BFS</strong>: explora por nível, usa queue. Encontra caminho mais curto em grafo não-ponderado. Memória O(largura do grafo) — pode ser enorme.</p><p><strong>DFS</strong>: explora em profundidade, usa stack ou recursão. Bom para detectar ciclo, topological sort, backtracking, DFS em árvore. Memória O(altura).</p><p>Regra prática: se o problema fala em 'menor número de passos/transformações' → BFS. Se fala em 'existe caminho', 'todas as soluções' → DFS.</p>", level: "pleno" },
      { q: "Como reconhecer DP num problema?", a: "<p>Sinais clássicos:</p><ul><li>Pergunta 'max/min/count de algo com escolhas em cada passo'.</li><li>Solução recursiva natural recomputa os mesmos subproblemas.</li><li>Estado pode ser descrito por poucas variáveis discretas (índice, capacidade restante, caractere atual).</li><li>Solução envolve 'incluir ou não incluir', 'pegar ou pular', 'expandir ou parar'.</li></ul><p>Anti-sinal: cada subproblema é único → divide-and-conquer simples, não DP.</p><p>Framework: comece com recursão, identifique o estado, adicione memo (top-down). Depois converta para tabulação se quiser O(1) espaço extra.</p>", level: "pleno" },
      { q: "O que é 'binary search on answer' e quando usar?", a: "<p>Ao invés de buscar elemento em array, busca o <em>valor da resposta</em> no espaço de respostas possíveis.</p><p>Exemplo clássico: 'menor capacidade para entregar todos os pacotes em D dias'. Binary search no espaço [max(weights), sum(weights)]. Para cada capacidade candidata, verifica em O(n) se é viável. Total: O(n log W).</p><p>Reconhecimento: resposta tem range numérico + existe predicate monotônico ('se X funciona, X+1 também funciona' ou vice-versa).</p>", level: "senior" },
      { q: "Como implementaria LRU Cache?", a: "<p>Combina HashMap + Doubly Linked List:</p><ul><li><strong>HashMap</strong>: key → node (O(1) lookup)</li><li><strong>DLL</strong>: nós em ordem de uso (mais recente na frente, menos recente no fim)</li></ul><p><code>get(key)</code>: encontra no map, move nó para frente, retorna valor. O(1).</p><p><code>put(key, val)</code>: se existe, atualiza e move para frente. Se novo: cria nó, adiciona no map e na frente da DLL. Se capacidade excedida: remove nó do fim da DLL e do map. O(1).</p><p>Em JavaScript: <code>Map</code> preserva ordem de inserção — use deleteKey+reinsert para simular LRU sem DLL manual.</p>", level: "senior" },
      { q: "Qual a complexidade de operações do heap?", a: "<p>Insert: O(log n) — elemento vai ao fim, faz heapify-up.</p><p>Extract-min/max: O(log n) — remove raiz, coloca último no topo, faz heapify-down.</p><p>Peek (min/max): O(1) — raiz é sempre o min/max.</p><p>Build-heap de n elementos: O(n) — não O(n log n). Heapify-down de cada nó interno: trabalho total é O(n) (série geométrica).</p><p>Delete elemento arbitrário: O(log n) se você tem ponteiro para o nó.</p>", level: "senior" },
      { q: "Quando usar Greedy vs DP?", a: "<p><strong>Greedy</strong>: escolha localmente ótima leva à solução globalmente ótima. Não revisita. Exemplos: Huffman, Kruskal, scheduling de tarefas por deadline, fractional knapsack.</p><p><strong>DP</strong>: escolha local ótima não garante global. Precisa considerar todas as combinações memoizadas. Exemplos: 0/1 knapsack, LCS, coin change.</p><p>Teste: tente contraexemplo para greedy. Se encontrar caso onde escolha gulosa falha → DP. Se não conseguir → provavelmente greedy.</p>", level: "senior" },
      { q: "Como funciona o Union-Find e qual sua complexidade?", a: "<p>Duas operações: <code>find(x)</code> retorna raiz do componente de x; <code>union(x,y)</code> une os dois componentes.</p><p><strong>Path compression</strong>: em cada find, aponta o nó diretamente para a raiz (achatamento da árvore).</p><p><strong>Union by rank</strong>: sempre anexa árvore menor na maior — evita degenerar em lista.</p><p>Com ambas: O(α(n)) ≈ O(1) amortizado. α é a função inversa de Ackermann — cresce tão devagar que é efetivamente constante para qualquer n prático.</p>", level: "senior" },
      { q: "Como abordaria um problema de grafo numa entrevista?", a: "<p>Perguntas de clarificação primeiro:</p><ul><li>Grafo dirigido ou não-dirigido?</li><li>Ponderado ou não?</li><li>Pode ter ciclos?</li><li>Conectado ou pode ter componentes separados?</li></ul><p>Depois escolhe algoritmo:</p><ul><li>Caminho mais curto sem peso → BFS</li><li>Caminho mais curto com peso positivo → Dijkstra</li><li>Caminho mais curto com peso negativo → Bellman-Ford</li><li>Todas as distâncias → Floyd-Warshall (V³)</li><li>Detectar ciclo → DFS com estados (branco/cinza/preto)</li><li>Ordem topológica → DFS + stack ou BFS (Kahn's algorithm)</li><li>Componentes conexos → BFS/DFS ou Union-Find</li><li>MST → Kruskal (Union-Find) ou Prim (heap)</li></ul>", level: "senior" },
      { q: "O que é topological sort e quando usar?", a: "<p>Ordenação linear de nós de um DAG (grafo dirigido acíclico) tal que para toda aresta u→v, u vem antes de v.</p><p>Algoritmos:</p><ul><li><strong>DFS</strong>: faz DFS, adiciona nó à stack quando termina todos os filhos. Reverte a stack = topo sort.</li><li><strong>Kahn's (BFS)</strong>: começa por nós com in-degree 0. Remove nó, decrementa in-degree dos vizinhos, adiciona os que chegarem a 0.</li></ul><p>Uso: ordem de build de tarefas com dependências, resolução de imports/módulos, schedule de cursos com pré-requisitos.</p><p>Detecta ciclo: se Kahn's terminar sem processar todos os V nós → há ciclo (in-degree nunca chega a 0).</p>", level: "senior" },
      { q: "Como implementar Dijkstra?", a: "<p>Min-heap de (distância, nó). Inicializa dist[start]=0, todos outros=Infinity.</p><p>Loop: extrai nó com menor distância. Para cada vizinho: se dist[node] + peso &lt; dist[vizinho], atualiza e adiciona ao heap.</p><p>Complexidade: O((V+E) log V) com heap adjacente.</p><p>Restrição: não funciona com pesos negativos (use Bellman-Ford: O(V·E)).</p><pre style='font-size:9px;color:#94a3b8;background:#1e293b;padding:8px;border-radius:4px;overflow-x:auto;margin-top:6px'>const dist=Array(V).fill(Infinity); dist[s]=0\nconst heap=[[0,s]] // [dist, node]\nwhile(heap.length){\n  const [d,u]=heap.shift() // simula min-heap\n  if(d>dist[u]) continue\n  for(const[v,w] of adj[u])\n    if(dist[u]+w&lt;dist[v]){\n      dist[v]=dist[u]+w; heap.push([dist[v],v])\n    }\n}</pre>", level: "senior" },
      { q: "Como pratica de forma eficiente?", a: "<p>NeetCode 150 (roadmap por padrão, não por dificuldade) + AlgoMonster para reconhecimento de padrão explícito. 2 problemas por dia, foco em compreender o padrão — não memorizar solução.</p><p>Protocolo de prática: tente resolver, trave por mais de 15-20 min → leia a solução, entenda o padrão, implemente do zero sem consultar. Refaça após 7 dias sem olhar.</p><p>Se conseguiu após 7 dias: padrão aprendido. Se não conseguiu: você apenas memorizou — precisa de mais repetição espaçada.</p>", level: "pleno" },
      { q: "Quando usar backtracking vs DP?", a: "<p><strong>Backtracking</strong>: quer explorar todas as soluções ou todas as combinações/permutações válidas. Não há subproblemas sobrepostos. Poda elimina candidatos inválidos cedo.</p><p><strong>DP</strong>: quer o ótimo (max/min/count) E há subproblemas sobrepostos que se repetem. Não precisa explorar tudo — memoiza para evitar recomputação.</p><p>Às vezes usa os dois: backtracking com memo quando você explora combinações mas alguns estados se repetem (ex: word break).</p>", level: "senior" },
      { q: "Diferença entre in-order, pre-order e post-order DFS em árvore?", a: "<p><strong>In-order (esq → raiz → dir)</strong>: em BST produz elementos em ordem crescente. Use para validar BST ou extrair elementos ordenados.</p><p><strong>Pre-order (raiz → esq → dir)</strong>: raiz vem primeiro. Use para serialização de árvore, cópia.</p><p><strong>Post-order (esq → dir → raiz)</strong>: raiz vem por último. Use para deletar árvore, avaliar expressão, altura de árvore (filhos primeiro).</p>", level: "pleno" },
      { q: "O que é amortized analysis e por que hash é O(1) amortizado?", a: "<p>Análise amortizada distribui o custo de operações caras raras sobre muitas operações baratas.</p><p>Hash map: inserção normalmente O(1). Quando load factor excede threshold (ex: 0.75), resize: O(n) para copiar todos os elementos. Mas resize acontece a cada vez que o tamanho dobra — então n inserções custam O(n) total de resize. Amortizado: O(1) por inserção.</p><p>Mesmo raciocínio para ArrayList/vector: append amortizado O(1) mesmo que resize seja O(n) esporádico.</p>", level: "senior" },
    ],
    resources: [
      { title: "NeetCode 150 — roadmap por padrão", url: "https://neetcode.io/roadmap", kind: "pratica" },
      { title: "AlgoMonster — reconhecimento de padrão", url: "https://algo.monster/", kind: "curso" },
      { title: "visualgo.net — visualizador interativo", url: "https://visualgo.net/", kind: "pratica" },
      { title: "Cracking the Coding Interview", url: "https://www.crackingthecodinginterview.com/", kind: "livro" },
      { title: "Elements of Programming Interviews", url: "https://elementsofprogramminginterviews.com/", kind: "livro" },
      { title: "CLRS — Introduction to Algorithms", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/", kind: "livro" },
      { title: "Blind 75 LeetCode problems", url: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions", kind: "pratica" },
      { title: "CP-algorithms.com — referência de algoritmos", url: "https://cp-algorithms.com/", kind: "artigo" },
    ],
  },

  "big-o": {
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
  <div class="bigo1-chart" id="bigo1-chart">
    <!-- preenchido por JS -->
  </div>
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
      { q: "Qual a diferença entre O(n log n) e O(n²)?", a: "<p>O crescimento é radicalmente diferente:</p><ul><li>n=1.000: O(n log n) ≈ 10.000 ops · O(n²) = 1.000.000 ops → 100x mais</li><li>n=1.000.000: O(n log n) ≈ 20M ops · O(n²) = 10¹² ops → 50.000x mais</li></ul><p>Por isso mergesort/quicksort existem e bubble sort não é usado em produção. A diferença que parece pequena em n pequeno vira catástrofe em escala.</p>", level: "pleno" },
      { q: "Por que hash map é O(1) amortizado e não O(1) garantido?", a: "<p>Em hash bem distribuído, cada bucket tem ~1 item → lookup O(1).</p><p>Pior caso: todos os elementos colidem no mesmo bucket (hash function ruim ou ataque adversarial) → vira lista ligada → O(n).</p><p>Amortizado: quando load factor excede threshold (~0.75), rehash copia tudo em O(n). Mas acontece tão raramente (a cada dobra de capacidade) que o custo amortizado por operação é O(1).</p>", level: "pleno" },
      { q: "Qual a complexidade de BFS em um grafo?", a: "<p>Tempo: O(V + E) — visita cada vértice (V) e cada aresta (E) uma vez.</p><p>Espaço: O(V) — visited set + queue podem conter todos os vértices.</p><p>Atenção: com matriz de adjacência, scan dos vizinhos é O(V) por vértice → total O(V²). Com lista de adjacência, é O(grau) por vértice → total O(V + E).</p><p>Para grafos esparsos (E &lt;&lt; V²), lista de adjacência é muito mais eficiente.</p>", level: "pleno" },
      { q: "Como otimizaria um algoritmo O(n²)?", a: "<p>Padrões de otimização:</p><ul><li><strong>Hash map</strong>: substitui busca linear O(n) por lookup O(1) → two sum vira O(n)</li><li><strong>Sort + two pointers</strong>: O(n log n) em vez de comparar todos os pares O(n²)</li><li><strong>Sliding window</strong>: reaproveita trabalho da janela anterior → O(n)</li><li><strong>Prefix sum</strong>: pre-processa O(n) para range queries em O(1)</li><li><strong>DP / memo</strong>: elimina recomputação de subproblemas sobrepostos</li><li><strong>Heap</strong>: mantém top-k em O(n log k) em vez de sort O(n log n) ou scan repetido O(n²)</li></ul>", level: "pleno" },
      { q: "O que é análise amortizada?", a: "<p>Técnica para analisar custo por operação ao longo de uma sequência de N operações, mesmo que operações individuais variem.</p><p>Exemplo: ArrayList.append(). Normalmente O(1). Quando array está cheio: resize dobra o tamanho, copia tudo — O(n). Mas isso acontece a cada vez que o tamanho dobra: após 1, 2, 4, 8, 16... inserções. Custo total de N inserts: N + N/2 + N/4 + ... ≈ 2N = O(N). Custo amortizado por insert: O(N)/N = O(1).</p>", level: "senior" },
      { q: "Quando constante importa na prática apesar do Big-O?", a: "<p>Casos onde O grande igual mas constante diferente importa:</p><ul><li><strong>Cache locality</strong>: scan sequencial de array é 10-100x mais rápido que acesso aleatório em hash (memória contígua vs espalhada)</li><li><strong>n pequeno</strong>: insertion sort (O(n²)) vence mergesort (O(n log n)) para n &lt; ~16 — sem overhead de recursão</li><li><strong>TimSort</strong>: Python/Java usam insertion sort para 'runs' pequenos e mergesort para combinar</li><li><strong>Branch prediction</strong>: código sem condições aleatórias é mais rápido por causa do pipeline do CPU</li></ul>", level: "senior" },
      { q: "Como calcular complexidade de recursão com Master Theorem?", a: "<p>Para recorrências T(n) = a·T(n/b) + f(n):</p><ul><li>Calcule c = log_b(a)</li><li>Compare f(n) com n^c:<br>— f(n) cresce MENOS que n^c → T(n) = O(n^c)<br>— f(n) = Θ(n^c) → T(n) = O(n^c · log n)<br>— f(n) cresce MAIS que n^c → T(n) = O(f(n))</li></ul><p>Exemplos:<br>• Mergesort: a=2, b=2, f=n → c=1 → f=Θ(n^c) → O(n log n)<br>• Binary search: a=1, b=2, f=1 → c=0 → f=Θ(n^0) → O(log n)<br>• Fibonacci recursivo: não se aplica (a≠inteiro fixo por nível)</p>", level: "senior" },
      { q: "Qual a diferença entre O, Ω e Θ?", a: "<p><strong>O(f(n))</strong>: limite superior — 'no máximo tão ruim quanto f(n)'. Big-O de pior caso.</p><p><strong>Ω(f(n))</strong>: limite inferior — 'no mínimo tão bom quanto f(n)'. Omega de melhor caso.</p><p><strong>Θ(f(n))</strong>: ambos os lados — 'exatamente tão ruim/bom quanto f(n)'. Theta = análise exata.</p><p>Em entrevista usa-se O por convenção mesmo quando seria Θ. Mas se entrevistador perguntar a distinção, demonstre que sabe.</p><p>Exemplo: mergesort é Θ(n log n) — melhor E pior caso são n log n. Quicksort é O(n²) pior caso mas Ω(n log n) melhor caso.</p>", level: "senior" },
      { q: "Como calcular espaço de call stack em recursão?", a: "<p>Cada chamada recursiva adiciona um frame à call stack. O espaço total é O(profundidade máxima).</p><ul><li>Fibonacci T(n) = T(n-1) + T(n-2): profundidade máxima = n → O(n) espaço</li><li>Binary search recursivo: profundidade log n → O(log n) espaço</li><li>Mergesort: profundidade log n → O(log n) de call stack + O(n) para merge = O(n) total</li><li>Quicksort in-place: O(log n) espaço de call stack (pior caso O(n) com pivot ruim)</li></ul><p>Isso é por que tail call optimization importa — evita crescer a stack em linguagens que suportam.</p>", level: "senior" },
      { q: "O que é amortized O(1) vs expected O(1)?", a: "<p><strong>Amortizado O(1)</strong>: garantia determinística ao longo de N operações. Não depende de aleatoriedade. Ex: ArrayList append — sempre verdadeiro independente dos dados.</p><p><strong>Esperado O(1)</strong>: depende de aleatoriedade ou assumir distribuição uniforme. Ex: quicksort com pivot aleatório é O(n log n) esperado. Hash map com input adversarial pode ser O(n) esperado mas O(n²) garantido.</p><p>Diferença prática: amortizado é mais forte. Em sistemas críticos (sem aleatoriedade), prefira amortizado.</p>", level: "senior" },
    ],
    resources: [
      { title: "Big-O Cheatsheet — bigocheatsheet.com", url: "https://www.bigocheatsheet.com/", kind: "artigo" },
      { title: "visualgo.net — algorithm visualizer", url: "https://visualgo.net/", kind: "pratica" },
      { title: "CLRS Cap 3 — Growth of Functions", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/", kind: "livro" },
      { title: "NeetCode — Big-O playlist", url: "https://neetcode.io/courses/lessons/big-o-notation", kind: "video" },
      { title: "Asymptotic Notation — Khan Academy", url: "https://www.khanacademy.org/computing/computer-science/algorithms/asymptotic-notation/a/asymptotic-notation", kind: "artigo" },
      { title: "Master Theorem explicado — brilliant.org", url: "https://brilliant.org/wiki/master-theorem/", kind: "artigo" },
    ],
  },

  "dynamic-programming": {
    tagline: "Resolve problema quebrando em subproblemas que se sobrepoem, memoizando resultado.",
    why: "DP é o filtro: muito candidato trava. Senior precisa reconhecer padrão (max/min/count + escolhas), modelar estado, escolher top-down vs bottom-up.",
    summary: "DP resolve problemas com (1) subestrutura ótima e (2) subproblemas sobrepostos. Você identifica estado (variáveis que descrevem subproblema), define transição (relação recursiva) e memoiza pra evitar recalculo. Top-down = recursão + cache; bottom-up = tabulacao iterativa. Padroes: knapsack, LIS, LCS, edit distance, coin change, matrix paths.",
    keypoints: [
      { title: "Estado", body: "Variaveis que descrevem unicamente um subproblema. Ex: knapsack -> (i, capacidade_restante). Quanto menor o estado, melhor." },
      { title: "Transicao", body: "Relacao recursiva. dp[i] em função de dp[i-1], dp[i-k]. Identifica escolhas em cada passo." },
      { title: "Top-down (memo)", body: "Recursao + dict/array que cacheia. Mais natural; evita estados desnecessarios. Custo: stack depth." },
      { title: "Bottom-up (tabulação)", body: "Loop preenche tabela do menor pro maior. Sem stack; permite otimização de espaço (só guarda última linha/coluna)." },
      { title: "Knapsack 0/1", body: "Itens com peso/valor. Capacidade C. Max valor sem ultrapassar. dp[i][c] = max(dp[i-1][c], dp[i-1][c-w[i]] + v[i])." },
      { title: "LIS — longest increasing subseq", body: "O(n^2) DP simples. O(n log n) com binary search + array auxiliar." },
      { title: "LCS / edit distance", body: "2D DP. Usado em diff, spell check. dp[i][j] depende de dp[i-1][j], dp[i][j-1], dp[i-1][j-1]." },
      { title: "Otimização de espaço", body: "Quando dp[i] depende só de dp[i-1] (ou poucos), usa array 1D ou 2 vars. Reduz O(n) -> O(1)." },
    ],
    gotchas: [
      "Recursao sem memo em problema com sobreposição -> exponencial. Sempre cache.",
      "Estado mal definido (faltando variável) leva a respostas erradas em casos específicos.",
      "Inicialização errada da tabela (dp[0] base case) gera off-by-one.",
      "Confundir 0/1 knapsack (cada item 1x) com unbounded (infinito) — transição diferente.",
      "Top-down sem limite de recursão em Python (sys.setrecursionlimit) crashea em n grande.",
      "Esquecer otimização de espaco — entrevistador valoriza.",
      "Tentar DP em problema sem subproblemas sobrepostos — DP não ajuda, é greedy ou divide-and-conquer.",
    ],
    interview: [
      { q: "Como reconhecer DP num problema?", a: "<p>Sinais clássicos:</p><ul><li>Pergunta \"max/min/count\" + escolhas em cada passo.</li><li>Recursao natural tem subproblemas que se repetem.</li><li>Estado descrito por poucas variáveis discretas.</li><li>\"Decompor em subproblema ótimo\" faz sentido.</li></ul><p>Anti-sinal: cada subproblema é único (sem sobreposição) -> divide-and-conquer simples, não DP.</p>" },
      { q: "Top-down vs bottom-up — quando cada?", a: "<p><strong>Top-down</strong>: começa natural a partir da recursão. Bom quando estado é esparso (nem todo subproblema é visitado).</p><p><strong>Bottom-up</strong>: melhor quando você visita todos os estados anyway. Permite otimização de espaco. Sem stack overflow.</p><p>Em entrevista, prefiro top-down pra explicar (mais natural), depois converto se pedirem.</p>" },
      { q: "Resolva fibonacci com DP", a: "<p>Top-down:</p><p><code>memo = {}<br>def fib(n):<br>&nbsp;&nbsp;if n &lt; 2: return n<br>&nbsp;&nbsp;if n in memo: return memo[n]<br>&nbsp;&nbsp;memo[n] = fib(n-1) + fib(n-2)<br>&nbsp;&nbsp;return memo[n]</code></p><p>Bottom-up otimizado: <code>a, b = 0, 1; for i in range(n): a, b = b, a+b; return a</code> — O(1) espaco.</p>" },
      { q: "Como modelaria coin change (número mínimo de moedas)?", a: "<p>Estado: <code>dp[amount]</code> = min moedas pra atingir amount.</p><p>Transicao: <code>dp[a] = min(dp[a-c] + 1)</code> pra cada coin c.</p><p>Base: <code>dp[0] = 0</code>; outros = infinito.</p><p>Resposta: <code>dp[target]</code>; se infinito, impossivel. O(amount * coins) tempo.</p>" },
      { q: "Por que DP é difícil em entrevista?", a: "<p>Três razões:</p><ul><li>Modelar estado correto requer prática — muitos esquecem variável.</li><li>Transição tem casos (incluir/pular/dividir) — fácil errar um.</li><li>Pressao pra otimizar espaco em poucos minutos.</li></ul><p>Antidoto: praticar reconhecimento de padrão com 30-50 problemas clássicos (NeetCode DP playlist).</p>" },
    ],
    diagrams: [
      {
        title: "Framework de DP: estado → transição → base case",
        html: `<style>
.dp-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.dp-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.dp-sub{font-size:10px;color:#475569;margin:0 0 16px}
.dp-steps{display:flex;gap:0;margin-bottom:16px;position:relative}
.dp-step{flex:1;background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:12px;position:relative}
.dp-step:not(:last-child)::after{content:'→';position:absolute;right:-14px;top:50%;transform:translateY(-50%);color:#10B981;font-size:16px;z-index:2;font-weight:700}
.dp-step+.dp-step{margin-left:20px}
.dp-step-n{font-size:9px;font-weight:700;color:#10B981;text-transform:uppercase;margin-bottom:4px}
.dp-step-title{font-size:11px;font-weight:700;color:#e2e8f0;margin-bottom:5px}
.dp-step-body{font-size:10px;color:#94a3b8;line-height:1.6}
.dp-example{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:14px}
.dp-ex-title{font-size:10px;font-weight:700;color:#10B981;margin-bottom:8px}
.dp-ex-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.dp-ex-card{background:#0f172a;border:1px solid #1e293b;border-radius:6px;padding:8px 10px}
.dp-ex-label{font-size:9px;color:#475569;margin-bottom:3px;text-transform:uppercase;font-weight:600}
.dp-ex-code{font-family:'JetBrains Mono',monospace;font-size:10px;color:#94a3b8;line-height:1.6}
.dp-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.dp-tip:hover .dp-tb{display:block}
.dp-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:210px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.dp-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
</style>
<div class="dp-wrap">
  <p class="dp-title">Framework de DP — 4 perguntas para qualquer problema</p>
  <p class="dp-sub">Responda nessa ordem antes de escrever uma linha de código</p>
  <div class="dp-steps">
    <div class="dp-step">
      <div class="dp-step-n">1</div>
      <div class="dp-step-title">Estado</div>
      <div class="dp-step-body">Quais variáveis descrevem <span class="dp-tip">unicamente<span class="dp-tb">Estado incompleto = bug sutil. Ex: knapsack precisa de (i, capacidade) — só i não basta.</span></span> um subproblema?<br><br><em style="color:#64748b">dp[i] = ...?<br>dp[i][j] = ...?</em></div>
    </div>
    <div class="dp-step">
      <div class="dp-step-n">2</div>
      <div class="dp-step-title">Transição</div>
      <div class="dp-step-body">Como dp[i] se relaciona com estados anteriores? Quais são as <span class="dp-tip">escolhas<span class="dp-tb">Geralmente: "incluir ou não", "pegar ou pular", "expandir ou parar". Liste todas as escolhas e tome o ótimo.</span></span> em cada passo?</div>
    </div>
    <div class="dp-step">
      <div class="dp-step-n">3</div>
      <div class="dp-step-title">Base case</div>
      <div class="dp-step-body">Qual o valor de dp para o caso mais simples? <span class="dp-tip">Inicialização errada<span class="dp-tb">dp[0] = 0 ou dp[0] = infinito dependem do problema. Off-by-one aqui quebra tudo silenciosamente.</span></span> é a causa mais comum de bug.</div>
    </div>
    <div class="dp-step">
      <div class="dp-step-n">4</div>
      <div class="dp-step-title">Resposta</div>
      <div class="dp-step-body">Onde está a resposta final? dp[n]? dp[n][W]? max(dp[i])?<br><br><em style="color:#64748b">Nem sempre é dp[n]!</em></div>
    </div>
  </div>
  <div class="dp-example">
    <div class="dp-ex-title">Exemplo: Coin Change (mínimo de moedas para amount A)</div>
    <div class="dp-ex-grid">
      <div class="dp-ex-card">
        <div class="dp-ex-label">Estado</div>
        <div class="dp-ex-code">dp[a] = min moedas<br>para atingir amount a</div>
      </div>
      <div class="dp-ex-card">
        <div class="dp-ex-label">Transição</div>
        <div class="dp-ex-code">dp[a] = min(<br>  dp[a - coin] + 1<br>) para cada coin</div>
      </div>
      <div class="dp-ex-card">
        <div class="dp-ex-label">Base case</div>
        <div class="dp-ex-code">dp[0] = 0<br>dp[1..A] = ∞</div>
      </div>
      <div class="dp-ex-card">
        <div class="dp-ex-label">Resposta</div>
        <div class="dp-ex-code">dp[A]<br>(∞ = impossível)</div>
      </div>
    </div>
  </div>
</div>`,
        caption: "Top-down (recursão + memo) é mais natural para explicar. Bottom-up (tabulação) permite otimização de espaço. Em entrevista: comece top-down, mencione que pode converter.",
      },
    ],
    resources: [
      { title: "NeetCode — Dynamic Programming playlist", url: "https://neetcode.io/practice", kind: "pratica" },
      { title: "AlgoMonster — DP patterns", url: "https://algo.monster/problems/dynamic_programming_intro", kind: "curso" },
      { title: "CLRS Cap 15 — Dynamic Programming", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/", kind: "livro" },
      { title: "visualgo.net — DP visualizer", url: "https://visualgo.net/en/recursion", kind: "pratica" },
      { title: "Errichto — DP playlist (YouTube)", url: "https://www.youtube.com/playlist?list=PLl0KD3g-oDOHpWRyyGBUJ9jmul0lUOD80", kind: "video" },
    ],
  },

  "grafos": {
    tagline: "Modelo pra qualquer problema com entidades + relações: rotas, dependência, redes.",
    why: "Grafos aparecem em system design (replicação, dependências) e coding (caminho mais curto, ciclo, topological sort). Senior precisa modelar problema como grafo rápido.",
    summary: "Grafo = vertices + arestas. Pode ser dirigido/não, ponderado/não, ciclico/aciclico. Representacoes: lista adj (esparso, padrão), matriz adj (denso, lookup O(1)). Algoritmos chave: BFS (shortest path não ponderado), DFS (ciclo, topological), Dijkstra (ponderado positivo), Union-Find (componentes), Kruskal/Prim (MST).",
    keypoints: [
      { title: "Lista adj vs matriz adj", body: "Lista: O(V+E) memória, esparso. Matriz: O(V^2), denso, lookup O(1). Lista vence em quase todos os problemas reais." },
      { title: "BFS", body: "Queue. Visita por nível. Caminho mais curto em grafo não ponderado. Também detecta componente conexa." },
      { title: "DFS", body: "Stack/recursão. Bom pra ciclo, topological sort, conectividade, backtracking. Visited set evita loop." },
      { title: "Dijkstra", body: "Caminho mais curto com pesos positivos. Heap (min-priority queue). O((V+E) log V). Falha com peso negativo." },
      { title: "Bellman-Ford", body: "Aceita peso negativo. Detecta ciclo negativo. O(V*E). Usado em routing (RIP)." },
      { title: "Topological sort", body: "Ordem linear de DAG (sem ciclo). DFS pós-ordem ou Kahn (BFS com indegree). Usado em build systems, dependency resolution." },
      { title: "Union-Find", body: "DS pra componentes conexos dinâmicos. Path compression + union by rank ~= O(1) amortizado. Usado em Kruskal, friend circles." },
      { title: "Detecta ciclo", body: "Em dirigido: DFS com 3 cores (white/gray/black). Em não dirigido: DFS marca pais; aresta pra visitado não-pai = ciclo. Ou Union-Find." },
    ],
    gotchas: [
      "Esquecer visited set em DFS/BFS -> loop infinito em grafo ciclico.",
      "Aplicar Dijkstra em grafo com peso negativo — resposta errada silenciosa.",
      "Usar matriz adj em grafo grande esparso — explode memória.",
      "Não tratar grafo desconexo — BFS só visita componente do start.",
      "Topological sort em grafo com ciclo -> não existe; tem que detectar.",
      "Backtracking em grafo sem desfazer estado (visited) na volta.",
      "BFS pra caminho mais curto ponderado — errado, precisa Dijkstra.",
    ],
    interview: [
      { q: "Diferenca entre BFS e Dijkstra?", a: "<p><strong>BFS</strong>: assume todos os pesos iguais (1). Acha caminho com menor número de arestas. O(V+E).</p><p><strong>Dijkstra</strong>: pesos diferentes positivos. Acha caminho com menor soma de pesos. Heap. O((V+E) log V).</p><p>Em grafo não ponderado, BFS = Dijkstra. Use BFS por simplicidade.</p>" },
      { q: "Como detectar ciclo em DAG?", a: "<p>DAG por definição não tem ciclo. Você detecta ciclo durante construcao ou validação.</p><p>DFS com 3 cores: white (não visitado), gray (em recursão), black (terminado). Aresta pra gray = back edge = ciclo.</p><p>Alternativa: topological sort com Kahn — se não consegue ordenar todos os V, tem ciclo.</p>" },
      { q: "Quando usaria Union-Find?", a: "<p>Problemas de \"estao na mesma componente?\" com merges dinâmicos. Ex:</p><ul><li>Friend circles, contas conectadas.</li><li>Kruskal MST (uma adição por vez).</li><li>Conectividade em grid (islands com union).</li></ul><p>Op union/find em ~O(1) amortizado com path compression + rank.</p>" },
      { q: "Como faria topological sort?", a: "<p>Duas abordagens:</p><ul><li><strong>Kahn (BFS)</strong>: calcula indegree de cada nó. Adiciona indegree=0 em queue. Pop, \"remove\" arestas, adiciona novos com indegree=0. Resultado é a ordem.</li><li><strong>DFS pós-ordem</strong>: DFS por todos. Ao terminar um nó, push em stack. Stack invertida = ordem.</li></ul><p>Se Kahn não processa todos os V, há ciclo.</p>" },
      { q: "Como modelaria \"menor caminho com transferencia máxima de K\"?", a: "<p>Estado expandido: (no, transferencias_usadas). BFS/Dijkstra nesse grafo expandido.</p><p>Padrão: sempre que algo limita seu caminho, adiciona dimensão no estado. Ex: \"menor custo com no máximo k arestas\" -> dp[no][k_remaining].</p>" },
    ],
    diagrams: [
      {
        title: "Algoritmos de grafo — quando usar cada um",
        html: `<style>
.grf-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.grf-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.grf-sub{font-size:10px;color:#475569;margin:0 0 14px}
.grf-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.grf-card{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:11px 13px;transition:border-color .2s}
.grf-card:hover{border-color:#10B981}
.grf-card-title{font-size:11px;font-weight:700;color:#10B981;margin-bottom:4px}
.grf-badge{display:inline-block;background:#10B98120;border:1px solid #10B98140;border-radius:4px;padding:1px 5px;font-size:9px;color:#10B981;font-family:'JetBrains Mono',monospace;margin-right:4px}
.grf-when{font-size:10px;color:#94a3b8;line-height:1.5;margin-bottom:3px}
.grf-warn{font-size:9px;color:#f59e0b;margin-top:3px}
.grf-ex{font-size:9px;color:#475569;font-family:'JetBrains Mono',monospace}
.grf-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.grf-tip:hover .grf-tb{display:block}
.grf-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:200px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.grf-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
.grf-decision{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px}
.grf-decision-title{font-size:10px;font-weight:700;color:#10B981;margin-bottom:8px;text-transform:uppercase}
.grf-row{display:flex;gap:8px;font-size:10px;color:#94a3b8;align-items:flex-start;margin-bottom:5px;line-height:1.5}
.grf-q{color:#e2e8f0;font-weight:600;min-width:160px}
</style>
<div class="grf-wrap">
  <p class="grf-title">Algoritmos de grafo — guia de escolha rápida</p>
  <p class="grf-sub">Passe o mouse nos termos para detalhes</p>
  <div class="grf-grid">
    <div class="grf-card">
      <div class="grf-card-title"><span class="grf-badge">O(V+E)</span> BFS</div>
      <div class="grf-when">Caminho mais curto em <span class="grf-tip">grafo não ponderado<span class="grf-tb">Todos os pesos iguais (ou sem peso). BFS garante menor número de arestas — não menor soma de pesos.</span></span>. Exploração nível a nível. Componentes conexos.</div>
      <div class="grf-ex">word ladder · islands · bipartite check</div>
    </div>
    <div class="grf-card">
      <div class="grf-card-title"><span class="grf-badge">O(V+E)</span> DFS</div>
      <div class="grf-when">Detectar ciclo. <span class="grf-tip">Topological sort<span class="grf-tb">Pós-ordem DFS invertida = ordem topológica. Só funciona em DAG (grafo dirigido acíclico).</span></span>. Backtracking. Componentes fortemente conexos (Tarjan/Kosaraju).</div>
      <div class="grf-ex">cycle detection · topo sort · SCC · maze</div>
    </div>
    <div class="grf-card">
      <div class="grf-card-title"><span class="grf-badge">O((V+E) log V)</span> Dijkstra</div>
      <div class="grf-when">Caminho mais curto com pesos <span class="grf-tip">positivos<span class="grf-tb">Dijkstra falha com pesos negativos — usa Bellman-Ford nesses casos. Dijkstra com heap min processa sempre o nó de menor distância acumulada.</span></span>. Usa min-heap.</div>
      <div class="grf-warn">⚠ falha com peso negativo</div>
      <div class="grf-ex">shortest path · network delay · cheapest flights</div>
    </div>
    <div class="grf-card">
      <div class="grf-card-title"><span class="grf-badge">O(V·E)</span> Bellman-Ford</div>
      <div class="grf-when">Pesos negativos. Detecta <span class="grf-tip">ciclo negativo<span class="grf-tb">Ciclo negativo = soma de pesos negativa → caminho mais curto seria −∞. Bellman-Ford detecta se após V-1 iterações ainda há relaxamento.</span></span>. Mais lento que Dijkstra.</div>
      <div class="grf-ex">currency arbitrage · negative weights</div>
    </div>
    <div class="grf-card">
      <div class="grf-card-title"><span class="grf-badge">~O(1)</span> Union-Find</div>
      <div class="grf-when">"Estão na mesma componente?" com merges dinâmicos. <span class="grf-tip">Path compression + rank<span class="grf-tb">Path compression: ao fazer find, conecta o nó direto à raiz. Union by rank: sempre pendura árvore menor embaixo da maior. Juntos: O(α(n)) ≈ O(1).</span></span> amortizado.</div>
      <div class="grf-ex">Kruskal MST · friend circles · accounts merge</div>
    </div>
    <div class="grf-card">
      <div class="grf-card-title"><span class="grf-badge">O(V + E)</span> Kahn (BFS topo)</div>
      <div class="grf-when">Topological sort alternativo. Calcula indegree, processa nós com indegree=0. Detecta ciclo: se não processa todos os V, há ciclo.</div>
      <div class="grf-ex">course schedule · build order · task deps</div>
    </div>
  </div>
  <div class="grf-decision">
    <div class="grf-decision-title">Árvore de decisão rápida</div>
    <div class="grf-row"><span class="grf-q">Caminho mais curto?</span><span>Sem peso → BFS · Com peso positivo → Dijkstra · Com peso negativo → Bellman-Ford</span></div>
    <div class="grf-row"><span class="grf-q">Ordem de execução?</span><span>Topological sort (DFS pós-ordem ou Kahn BFS)</span></div>
    <div class="grf-row"><span class="grf-q">Componentes / mesma rede?</span><span>Union-Find (dinâmico) ou BFS/DFS (estático)</span></div>
    <div class="grf-row"><span class="grf-q">Ciclo em grafo dirigido?</span><span>DFS com 3 cores (white/gray/black)</span></div>
  </div>
</div>`,
        caption: "O erro mais comum: usar BFS quando o grafo tem pesos diferentes, ou Dijkstra com pesos negativos. Sempre cheque se o grafo é ponderado antes de escolher o algoritmo.",
      },
    ],
    resources: [
      { title: "NeetCode — Graph playlist", url: "https://neetcode.io/practice", kind: "pratica" },
      { title: "visualgo.net — graph algorithms", url: "https://visualgo.net/en/graphds", kind: "pratica" },
      { title: "CLRS Cap 22-25 — Graphs", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/", kind: "livro" },
      { title: "AlgoMonster — Graph patterns", url: "https://algo.monster/problems/graph_intro", kind: "curso" },
    ],
  },

  "tcp-ip-dns": {
    tagline: "Stack de protocolos da internet: como dois computadores se acham e conversam.",
    why: "Senior precisa explicar o que acontece quando você digita URL no browser. DNS, TCP handshake, congestion control aparecem em entrevista de backend e system design.",
    summary: "Stack TCP/IP: aplicação (HTTP, gRPC) -> transporte (TCP/UDP) -> rede (IP) -> link (Ethernet). DNS resolve hostname em IP. TCP é conexão confiável (handshake, ACK, retransmit, congestion control). UDP é best-effort. Saber portas, NAT, traceroute, e o que pode dar errado em cada camada é esperado.",
    keypoints: [
      { title: "Modelo OSI vs TCP/IP", body: "7 camadas OSI vs 4 do TCP/IP. Na prática usa TCP/IP. Conhecer ambos é padrão em entrevista." },
      { title: "IP", body: "Endereco 32 bits (IPv4) ou 128 bits (IPv6). Roteamento via tabelas. Best-effort (perde pacotes, não garante ordem)." },
      { title: "TCP", body: "Connection-oriented, confiável. 3-way handshake (SYN, SYN-ACK, ACK). ACK + retransmit + ordering. Slow start + congestion control." },
      { title: "UDP", body: "Sem conexão, sem garantia. Header pequeno. Bom pra DNS, video streaming, gaming, QUIC." },
      { title: "DNS", body: "Hierarquia: root -> TLD -> authoritative. Resolver recursivo cacheia. Records: A (IPv4), AAAA (IPv6), CNAME, MX, TXT." },
      { title: "NAT", body: "Traduz IP privado <-> público. Multiplos hosts compartilham um IP público via portas. Quebra peer-to-peer." },
      { title: "TCP windows", body: "Sliding window controla flow. Congestion window cresce/encolhe baseado em loss. AIMD é clássico." },
      { title: "Portas", body: "0-1023 reservadas (HTTP 80, HTTPS 443, SSH 22, DNS 53). 1024-49151 user-assigned. 49152+ ephemeral." },
    ],
    gotchas: [
      "Confundir TCP e IP — IP é endereço/roteamento; TCP é conexão confiável sobre IP.",
      "Achar que UDP é \"TCP rápido\" — UDP não tem garantia, você reimplementa em app.",
      "Esquecer cache do DNS — TTL controla. Mudar A record não propaga instante.",
      "Ignorar NAT em desenvolvimento — funciona local, falha em prod por tras de firewall.",
      "Pensar que HTTPS é sobre TCP simples — é sobre TLS sobre TCP. Camadas adicionais.",
      "IPv6 não é \"IPv4 com mais bits\" — protocolo diferente, sem NAT obrigatório.",
      "TCP slow start em conexões curtas penaliza throughput — HTTP/2 multiplexing ajuda.",
    ],
    interview: [
      { q: "O que acontece quando digito google.com?", a: "<p>Resumo:</p><ul><li><strong>DNS</strong>: resolver consulta cache; senao recursive query (root -> com -> google.com authoritative). Retorna IP.</li><li><strong>TCP handshake</strong>: SYN, SYN-ACK, ACK pra IP:443.</li><li><strong>TLS handshake</strong>: ClientHello, ServerHello, cert, key exchange.</li><li><strong>HTTP request</strong>: GET / HTTP/2 com headers.</li><li><strong>Response</strong>: HTML chega; browser parseia, baixa CSS/JS/img em paralelo.</li><li><strong>Render</strong>: parse, layout, paint.</li></ul>" },
      { q: "Diferenca entre TCP e UDP?", a: "<p><strong>TCP</strong>: connection-oriented (handshake), confiável (ACK + retransmit), ordenado, controle de fluxo e congestao. Mais overhead. Bom pra HTTP, SSH, DB.</p><p><strong>UDP</strong>: sem conexão, sem garantia, header pequeno. Bom pra DNS, video, gaming, VoIP, QUIC.</p>" },
      { q: "Como funciona DNS?", a: "<p>Hierarquia: root (.) -> TLD (.com) -> authoritative (google.com).</p><p>Cliente pergunta resolver recursivo (do ISP, ou 8.8.8.8). Resolver tem cache. Cache miss: pergunta root -> recebe ref pra TLD -> TLD ref pra authoritative -> authoritative responde IP.</p><p>Resposta cacheada por TTL (segundos a horas).</p>" },
      { q: "O que é TCP 3-way handshake?", a: "<p>Estabelecimento de conexão:</p><ul><li><strong>SYN</strong>: cliente envia com seu seq number x.</li><li><strong>SYN-ACK</strong>: server responde com seu seq y e ACK x+1.</li><li><strong>ACK</strong>: cliente confirma com ACK y+1. Conexão estabelecida.</li></ul><p>Encerramento é 4-way (FIN, ACK, FIN, ACK).</p>" },
      { q: "Por que DNS usa UDP por padrão?", a: "<p>Queries DNS são pequenas (< 512 bytes), únicas, e tolerantes a perda (cliente repete). UDP evita overhead de handshake — resposta em 1 round trip.</p><p>Quando resposta > 512 bytes (DNSSEC, multi-record), DNS troca pra TCP. DoH e DoT usam TCP/TLS por privacidade.</p>" },
      { q: "Como funciona NAT?", a: "<p>Roteador mantem tabela mapeando (IP_priv:porta_priv) -> (IP_pub:porta_pub). Quando host interno envia, roteador troca source pelo IP_pub e nova porta. Resposta volta, roteador desfaz.</p><p>Side effect: peer-to-peer difícil — você não pode \"discar\" pra IP atras de NAT sem hole punching.</p>" },
    ],
    diagrams: [
      {
        title: "O que acontece quando você digita uma URL — fluxo completo",
        html: `<style>
.tcpd-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tcpd-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.tcpd-sub{font-size:10px;color:#475569;margin:0 0 14px}
.tcpd-flow{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.tcpd-step{display:flex;align-items:flex-start;gap:10px;background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:10px 12px;transition:border-color .2s}
.tcpd-step:hover{border-color:#10B981}
.tcpd-num{min-width:22px;height:22px;border-radius:50%;background:#10B98120;border:1px solid #10B981;color:#10B981;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.tcpd-label{font-size:10px;font-weight:700;color:#10B981;min-width:90px}
.tcpd-body{font-size:10px;color:#94a3b8;line-height:1.6}
.tcpd-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.tcpd-tip:hover .tcpd-tb{display:block}
.tcpd-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.tcpd-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
.tcpd-layers{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.tcpd-layer{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 10px;text-align:center}
.tcpd-layer-name{font-size:9px;font-weight:700;color:#10B981;margin-bottom:3px}
.tcpd-layer-ex{font-size:9px;color:#64748b;font-family:'JetBrains Mono',monospace;line-height:1.5}
</style>
<div class="tcpd-wrap">
  <p class="tcpd-title">URL → resposta: cada camada em ação</p>
  <p class="tcpd-sub">Passe o mouse para detalhes de cada etapa</p>
  <div class="tcpd-flow">
    <div class="tcpd-step">
      <div class="tcpd-num">1</div>
      <div><div class="tcpd-label">DNS lookup</div><div class="tcpd-body">Resolver consulta <span class="tcpd-tip">cache local<span class="tcpd-tb">Ordem: cache do SO → cache do resolver ISP → root → TLD (.com) → authoritative (google.com). Resposta cacheada por TTL (segundos a horas).</span></span>. Cache miss: pergunta root → TLD → authoritative. Retorna IP. UDP porta 53 (ou TCP se &gt;512 bytes).</div></div>
    </div>
    <div class="tcpd-step">
      <div class="tcpd-num">2</div>
      <div><div class="tcpd-label">TCP handshake</div><div class="tcpd-body"><span class="tcpd-tip">SYN → SYN-ACK → ACK<span class="tcpd-tb">3-way handshake estabelece números de sequência. Cada parte confirma que recebeu o seq do outro. Leva 1 RTT.</span></span> para IP:443. Conexão estabelecida. Leva 1 RTT.</div></div>
    </div>
    <div class="tcpd-step">
      <div class="tcpd-num">3</div>
      <div><div class="tcpd-label">TLS handshake</div><div class="tcpd-body">TLS 1.3: <span class="tcpd-tip">ClientHello + key share<span class="tcpd-tb">Cliente envia lista de cipher suites e chave pública ECDHE. Server responde com cert e sua chave. Ambos derivam a mesma chave de sessão. 1 RTT no total.</span></span> → ServerHello + cert → Finished. Chave de sessão gerada. 1 RTT.</div></div>
    </div>
    <div class="tcpd-step">
      <div class="tcpd-num">4</div>
      <div><div class="tcpd-label">HTTP request</div><div class="tcpd-body">GET / HTTP/2 com headers comprimidos (HPACK). Em HTTP/2: múltiplos streams multiplexados na mesma conexão TCP.</div></div>
    </div>
    <div class="tcpd-step">
      <div class="tcpd-num">5</div>
      <div><div class="tcpd-label">Response + render</div><div class="tcpd-body">Server responde HTML. Browser parseia, descobre CSS/JS/img, faz requests paralelos. <span class="tcpd-tip">Parse → Layout → Paint<span class="tcpd-tb">Critical rendering path: HTML→DOM, CSS→CSSOM, DOM+CSSOM→Render tree, Layout (geometry), Paint (pixels), Composite (GPU layers).</span></span>. Tela visível.</div></div>
    </div>
  </div>
  <div style="margin-bottom:10px;font-size:10px;font-weight:700;color:#10B981;text-transform:uppercase">Stack TCP/IP — camadas</div>
  <div class="tcpd-layers">
    <div class="tcpd-layer"><div class="tcpd-layer-name">Aplicação</div><div class="tcpd-layer-ex">HTTP · gRPC<br>DNS · SMTP</div></div>
    <div class="tcpd-layer"><div class="tcpd-layer-name">Transporte</div><div class="tcpd-layer-ex">TCP (confiável)<br>UDP (best-effort)</div></div>
    <div class="tcpd-layer"><div class="tcpd-layer-name">Rede (IP)</div><div class="tcpd-layer-ex">IPv4 / IPv6<br>roteamento</div></div>
    <div class="tcpd-layer"><div class="tcpd-layer-name">Link</div><div class="tcpd-layer-ex">Ethernet<br>Wi-Fi · MAC</div></div>
  </div>
</div>`,
        caption: "Esta pergunta ('o que acontece quando você digita uma URL?') aparece em praticamente toda entrevista de backend e system design. Saiba responder em 60 segundos.",
      },
    ],
    resources: [
      { title: "Beej's Guide to Network Programming", url: "https://beej.us/guide/bgnet/", kind: "livro" },
      { title: "High Performance Browser Networking (Ilya Grigorik)", url: "https://hpbn.co/", kind: "livro" },
      { title: "Cloudflare Learning — DNS", url: "https://www.cloudflare.com/learning/dns/what-is-dns/", kind: "docs" },
      { title: "Julia Evans — networking zines", url: "https://wizardzines.com/zines/networking/", kind: "artigo" },
      { title: "MIT 6.829 — Computer Networks", url: "https://web.mit.edu/6.829/www/", kind: "curso" },
    ],
  },

  "tls-https": {
    tagline: "Camada de segurança sobre TCP: encripta, autentica, garante integridade.",
    why: "HTTPS é universal. Senior precisa saber TLS handshake completo, certificate chain, perfect forward secrecy, TLS 1.3 vs 1.2.",
    summary: "TLS (sucessor do SSL) prove tres garantias: confidencialidade (criptografia simétrica negociada), integridade (MAC), autenticação (certificado X.509 assinado por CA). Roda sobre TCP. Handshake estabelece chave de sessão via troca assimetrica (RSA legacy ou ECDHE moderno) -> dali em diante conversa simétrica (AES-GCM, ChaCha20).",
    keypoints: [
      { title: "Handshake TLS 1.3", body: "ClientHello (versão, ciphers, key share) -> ServerHello + cert + key share + Finished. Cliente verifica cert, gera chave, Finished. 1 RTT." },
      { title: "Handshake TLS 1.2", body: "2 RTT. ClientHello, ServerHello, Cert, ServerKeyExchange, ServerHelloDone, ClientKeyExchange, ChangeCipherSpec, Finished. Mais lento, mais ciphers fracos." },
      { title: "Certificate chain", body: "Server cert assinado por intermediário, assinado por root CA. Browser tem CAs root pre-instaladas. Válida cadeia + nome (SAN) + não expirado." },
      { title: "Cipher suites", body: "TLS 1.3: AEAD only (AES-128-GCM, ChaCha20). TLS 1.2: legado tem CBC, RC4 (quebrados, evitar)." },
      { title: "Perfect forward secrecy", body: "Chave de sessão gerada por ECDHE — não deriva da chave privada do server. Comprometer chave do server NÃO descriptografa sessões passadas." },
      { title: "SNI", body: "Server Name Indication: cliente envia hostname no ClientHello em claro (TLS 1.2) ou encriptado (ESNI/ECH). Permite virtual hosting HTTPS." },
      { title: "OCSP / CRL", body: "Revogacao de cert. CRL = lista batch. OCSP = query online. OCSP stapling: server inclui resposta no handshake." },
      { title: "mTLS", body: "Mutual TLS: cliente também apresenta cert. Usado em serviço-a-serviço, zero trust. Mais seguro que API key." },
    ],
    gotchas: [
      "Confiar em certificado self-signed em prod — browsers gritam, atacante pode MITM fácil.",
      "Cert intermediário não instalado no server — alguns clientes (Java, mobile) falham silenciosamente.",
      "TLS 1.0/1.1 ainda habilitado — vulneravel (BEAST, POODLE). Force >= 1.2.",
      "Esquecer SNI quando hospeda múltiplos sites — server retorna cert errado.",
      "Cert expira em domingo as 3am — sem monitoring, app cai. Use Let s Encrypt + cert-manager.",
      "Confundir TLS com HTTPS — TLS é a camada; HTTPS é HTTP sobre TLS. mTLS, gRPC, SMTP-TLS também usam TLS.",
      "Usar RSA 1024 ou SHA-1 — quebrado. Use RSA 2048+, ECDSA P-256, SHA-256+.",
    ],
    interview: [
      { q: "Resuma o TLS handshake", a: "<p>TLS 1.3 (1 RTT):</p><ul><li><strong>ClientHello</strong>: versões, cipher suites, key share (chave pública ECDHE).</li><li><strong>ServerHello</strong>: cipher escolhido + key share. Server deriva chave de sessão.</li><li><strong>Certificate + Finished</strong>: server envia cert + MAC autenticado.</li><li><strong>Cliente válida cert</strong>, deriva mesma chave, manda Finished.</li></ul><p>Dali pra frente: AES-GCM com chave de sessão.</p>" },
      { q: "Como funciona certificate chain?", a: "<p>Server tem cert assinado por <strong>intermediário</strong> da CA. Intermediário é assinado por <strong>root CA</strong> (pre-instalada no client). Cliente segue a cadeia até root, válida cada assinatura.</p><p>Adicionalmente: hostname (SAN) bate, valid period, não revogado. Falha em qualquer = \"NET::ERR_CERT_INVALID\".</p>" },
      { q: "Por que TLS 1.3 é melhor que 1.2?", a: "<ul><li><strong>1 RTT</strong> em vez de 2 (0-RTT em resume).</li><li>Removeu ciphers fracos (RSA key exchange, CBC, RC4, MD5).</li><li>PFS obrigatório (só ECDHE).</li><li>Handshake parcialmente encriptado (cert não em claro).</li><li>AEAD only (autenticação integrada).</li></ul>" },
      { q: "O que é perfect forward secrecy?", a: "<p>Chave de sessão gerada por troca efemera (ECDHE). Mesmo se atacante grava trafego e depois rouba a chave privada do server, NÃO consegue descriptografar sessões passadas.</p><p>Sem PFS (RSA key exchange), comprometer chave privada vaza tudo retroativamente.</p>" },
      { q: "Quando usar mTLS?", a: "<p>Serviço-a-serviço em zero trust. Cada microservico tem cert, prova identidade. Mais seguro que API key (que pode vazar) e mais granular.</p><p>Pra usuário final é ruim UX (precisa instalar cert no browser) (precisa instalar cert no browser). Pra workloads, padrão moderno (service mesh, Istio, Linkerd).</p>" },
      { q: "Como funciona OCSP stapling?", a: "<p>Em vez de cliente perguntar OCSP responder se cert é válido (lento, vaza navegação), o server pergunta periodicamente, recebe resposta assinada e cola (staples) no handshake. Cliente confia na resposta sem trip externa.</p>" },
    ],
    diagrams: [
      {
        title: "TLS 1.3 vs TLS 1.2 — handshake comparado",
        html: `<style>
.tls-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tls-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.tls-sub{font-size:10px;color:#475569;margin:0 0 14px}
.tls-cols{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
.tls-col-title{font-size:10px;font-weight:700;text-transform:uppercase;margin-bottom:8px;padding:5px 10px;border-radius:5px;text-align:center}
.tls-msg{display:flex;align-items:flex-start;gap:6px;margin-bottom:6px}
.tls-dir-right{justify-content:flex-start}
.tls-dir-left{justify-content:flex-end}
.tls-bubble{border-radius:6px;padding:5px 9px;font-size:10px;line-height:1.4;max-width:85%}
.tls-arrow{font-size:11px;align-self:center;flex-shrink:0}
.tls-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.tls-tip:hover .tls-tb{display:block}
.tls-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:210px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.tls-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
.tls-rtt{background:#10B98115;border:1px dashed #10B98150;border-radius:4px;font-size:9px;color:#10B981;padding:3px 8px;text-align:center;margin-bottom:4px}
.tls-rtt-red{background:#ef444415;border:1px dashed #ef444450;border-radius:4px;font-size:9px;color:#ef4444;padding:3px 8px;text-align:center;margin-bottom:4px}
.tls-props{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.tls-prop{font-size:10px;color:#94a3b8;line-height:1.6}
.tls-prop strong{color:#10B981}
</style>
<div class="tls-wrap">
  <p class="tls-title">TLS handshake — 1.3 vs 1.2</p>
  <p class="tls-sub">Passe o mouse para detalhes de cada mensagem</p>
  <div class="tls-cols">
    <div>
      <div class="tls-col-title" style="background:#10B98115;color:#10B981">TLS 1.3 — 1 RTT</div>
      <div class="tls-rtt">← RTT 1 →</div>
      <div class="tls-msg tls-dir-right">
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #10B98140;color:#e2e8f0">
          <span class="tls-tip">ClientHello<span class="tls-tb">Inclui: versões suportadas, cipher suites e — novidade do 1.3 — key_share com chave pública ECDHE. Já envia o material criptográfico.</span></span> + key_share
        </div>
        <span class="tls-arrow" style="color:#10B981">→</span>
      </div>
      <div class="tls-msg tls-dir-left">
        <span class="tls-arrow" style="color:#10B981">←</span>
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #10B98140;color:#e2e8f0">
          <span class="tls-tip">ServerHello<span class="tls-tb">Server escolhe cipher, envia seu key_share. Ambos derivam a chave de sessão. As próximas mensagens já são criptografadas.</span></span> + key_share<br>
          <span class="tls-tip">Certificate<span class="tls-tb">No TLS 1.3, o certificado é enviado já criptografado (ao contrário do 1.2). Mais privacidade.</span></span> + <span class="tls-tip">Finished<span class="tls-tb">MAC que autentica o handshake inteiro. Cliente verifica, manda seu Finished. Sessão estabelecida.</span></span>
        </div>
      </div>
      <div class="tls-msg tls-dir-right">
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #10B98140;color:#94a3b8">Finished → dados</div>
        <span class="tls-arrow" style="color:#10B981">→</span>
      </div>
    </div>
    <div>
      <div class="tls-col-title" style="background:#ef444415;color:#ef4444">TLS 1.2 — 2 RTT</div>
      <div class="tls-rtt-red">← RTT 1 →</div>
      <div class="tls-msg tls-dir-right">
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #ef444430;color:#e2e8f0">ClientHello</div>
        <span class="tls-arrow" style="color:#ef4444">→</span>
      </div>
      <div class="tls-msg tls-dir-left">
        <span class="tls-arrow" style="color:#ef4444">←</span>
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #ef444430;color:#e2e8f0">ServerHello + Cert<br>ServerKeyExchange<br>ServerHelloDone</div>
      </div>
      <div class="tls-rtt-red" style="margin-top:2px">← RTT 2 →</div>
      <div class="tls-msg tls-dir-right">
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #ef444430;color:#94a3b8">ClientKeyExchange<br>ChangeCipherSpec<br>Finished</div>
        <span class="tls-arrow" style="color:#ef4444">→</span>
      </div>
      <div class="tls-msg tls-dir-left">
        <span class="tls-arrow" style="color:#ef4444">←</span>
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #ef444430;color:#94a3b8">ChangeCipherSpec<br>Finished → dados</div>
      </div>
    </div>
  </div>
  <div class="tls-props">
    <div class="tls-prop"><strong>Perfect Forward Secrecy</strong><br>TLS 1.3: ECDHE obrigatório. Chave de sessão não deriva da chave privada do server. Comprometer o server não decripta sessões passadas.</div>
    <div class="tls-prop"><strong>Ciphers removidos no 1.3</strong><br>RSA key exchange, CBC, RC4, MD5, SHA-1. Só AEAD: AES-GCM, ChaCha20-Poly1305. Mais seguro e mais simples.</div>
    <div class="tls-prop"><strong>0-RTT (early data)</strong><br>Em sessão retomada (resumption), cliente pode enviar dados junto ao ClientHello. Sem RTT de handshake. Risco: replay attacks.</div>
    <div class="tls-prop"><strong>mTLS</strong><br>Cliente também apresenta certificado. Usado em serviço-a-serviço (zero trust, service mesh). Mais seguro que API key.</div>
  </div>
</div>`,
        caption: "TLS 1.3 é obrigatório em qualquer sistema novo — 1 RTT a menos, ciphers modernos, PFS obrigatório e cert criptografado. Force TLS ≥ 1.2 em produção, prefira 1.3.",
      },
    ],
    resources: [
      { title: "Cloudflare — TLS 1.3", url: "https://blog.cloudflare.com/rfc-8446-aka-tls-1-3/", kind: "artigo" },
      { title: "High Performance Browser Networking — TLS", url: "https://hpbn.co/transport-layer-security-tls/", kind: "livro" },
      { title: "Illustrated TLS 1.3", url: "https://tls13.xargs.org/", kind: "pratica" },
      { title: "SSL Labs Server Test", url: "https://www.ssllabs.com/ssltest/", kind: "pratica" },
      { title: "Beej's Guide to Network Programming", url: "https://beej.us/guide/bgnet/", kind: "livro" },
    ],
  },

  "event-loop": {
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
  },

  "memory-management": {
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
  },

  "cap-theorem": {
    tagline: "Em partição de rede, sistema distribuido escolhe entre consistencia ou disponibilidade.",
    why: "Pergunta clássica em entrevista de system design. Senior precisa explicar trade-off com casos reais (Postgres CP, Cassandra AP, DynamoDB tunable).",
    summary: "CAP: dado uma partição de rede (P), você escolhe entre Consistency (todos os nodes veem mesmo dado) ou Availability (cada request retorna sucesso). Sem partição, é consistente E disponível — mas partição acontece. PACELC estende: Else (sem partição) escolhe entre Latency e Consistency. Entender CAP é entender por que não existe DB perfeito.",
    keypoints: [
      { title: "Consistency (linearizability)", body: "Toda leitura ve a última escrita confirmada. Como se fosse single node. Forte mas custa coordenacao." },
      { title: "Availability", body: "Toda request a um node não falho recebe resposta (pode ser stale). Sistema continua respondendo durante partição." },
      { title: "Partition tolerance", body: "Sistema continua operando apesar de mensagens perdidas/atrasadas entre nodes. Em rede real, partição acontece — você escolhe entre C e A." },
      { title: "CP exemplos", body: "Postgres com replica sync, MongoDB (default), HBase, Zookeeper, etcd. Em partição, prefere falhar a retornar inconsistente." },
      { title: "AP exemplos", body: "Cassandra, DynamoDB (default), CouchDB, Riak. Em partição, retorna stale ou aceita escrita conflitante (resolve depois)." },
      { title: "PACELC", body: "Else (sem partição): escolhe entre Latency e Consistency. Spanner/Postgres = PC/EC. DynamoDB = PA/EL." },
      { title: "Tunable consistency", body: "Cassandra, DynamoDB permitem ajustar por query: ONE, QUORUM, ALL. Tradeoff entre latência e consistencia." },
      { title: "Eventual consistency", body: "Sistema converge eventualmente sem coordenacao forte. Usado em AP. Exige merge logic (LWW, CRDTs, vector clocks)." },
    ],
    gotchas: [
      "Achar que pode ser CA (consistente e disponível sem P) — partição acontece em rede real, não da pra ignorar.",
      "Generalizar \"Cassandra é AP\" sem entender que é tunable — você pode rodar com QUORUM e ter consistência forte.",
      "Confundir consistency (CAP) com ACID consistency (Postgres) — são conceitos distintos.",
      "Esquecer PACELC — em operação normal (sem partição), latência ainda é trade-off.",
      "Usar AP em sistema financeiro — saldo negativo por escrita concorrente.",
      "Esperar que CRDTs resolvem qualquer conflito — funcionam pra estruturas específicas (counter, set, map).",
      "Linearizability vs serializability — diferentes garantias. Linearizability é sobre ordem real-time; serializability é sobre ordem de transações.",
    ],
    interview: [
      { q: "Explique CAP em uma frase", a: "<p>Sistema distribuído não pode garantir simultaneamente <strong>Consistencia</strong> (toda leitura ve última escrita), <strong>Disponibilidade</strong> (toda request recebe resposta) e <strong>Tolerância a partição</strong>. Como partição é inevitável em rede real, você escolhe entre C e A.</p>" },
      { q: "Postgres com replica sync: CP ou AP?", a: "<p><strong>CP</strong>. Em partição entre primary e replica sync, primary trava (espera ack que não vem). Sistema fica indisponível até resolver. Garante que dado é consistente — leitor sempre vê igual.</p><p>Async réplica é diferente: replica fica stale, mas primary continua. Mais AP.</p>" },
      { q: "Cassandra: CP ou AP?", a: "<p>Padrão <strong>AP</strong> com tunable consistency. CL=ONE é muito disponível (uma réplica responde) e eventualmente consistente.</p><p>Mas você pode rodar CL=QUORUM em escrita E leitura: garante (W+R) > N replicas, então toda leitura ve última escrita. Vira mais CP.</p>" },
      { q: "O que é PACELC?", a: "<p>Extensão do CAP. <strong>P</strong>articao + <strong>A</strong>/C, <strong>E</strong>lse <strong>L</strong>atency/<strong>C</strong>onsistency.</p><p>Em partição, escolhe A ou C. SEM partição, escolhe latência ou consistência. Spanner = PC/EC (sempre prefere C). DynamoDB = PA/EL (prefere disponibilidade e baixa latência).</p>" },
      { q: "Quando usaria sistema AP?", a: "<p>Quando disponibilidade > consistencia exata. Ex:</p><ul><li>Carrinho de compras (resolve duplicata depois).</li><li>Feed social (atraso aceitavel).</li><li>Counters (visualizações, likes).</li><li>Telemetria, logs.</li></ul><p>Não use AP em saldo bancario, estoque crit, payments — exige consistencia.</p>" },
      { q: "Como implementaria pagamento em sistema distribuido?", a: "<p>Precisa CP. Opcoes:</p><ul><li><strong>Spanner / CockroachDB</strong>: ACID distribuido com 2PC + Paxos.</li><li><strong>Postgres single primary</strong> com replica sync.</li><li><strong>Saga pattern</strong> com compensating transactions em caso de falha — eventual mas com semantica correta.</li><li><strong>Idempotency keys</strong> em todas operações.</li></ul>" },
    ],
    diagrams: [
      {
        title: "CAP Theorem — triângulo de trade-offs com exemplos reais",
        html: `<style>
.cap-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.cap-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.cap-sub{font-size:10px;color:#475569;margin:0 0 14px}
.cap-main{display:grid;grid-template-columns:auto 1fr;gap:16px;margin-bottom:14px;align-items:start}
.cap-triangle{position:relative;width:180px;height:160px;flex-shrink:0}
.cap-triangle svg{width:180px;height:160px}
.cap-grid{display:flex;flex-direction:column;gap:8px}
.cap-card{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:10px 12px;transition:border-color .2s}
.cap-card:hover{border-color:#10B981}
.cap-card-title{font-size:11px;font-weight:700;margin-bottom:3px}
.cap-card-body{font-size:10px;color:#94a3b8;line-height:1.5;margin-bottom:3px}
.cap-card-ex{font-size:9px;font-family:'JetBrains Mono',monospace;color:#475569}
.cap-pacelc{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px}
.cap-pacelc-title{font-size:10px;font-weight:700;color:#10B981;margin-bottom:8px}
.cap-row{display:flex;gap:6px;align-items:flex-start;font-size:10px;margin-bottom:5px;line-height:1.5}
.cap-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.cap-tip:hover .cap-tb{display:block}
.cap-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.cap-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
</style>
<div class="cap-wrap">
  <p class="cap-title">CAP Theorem — em partição de rede, escolha C ou A</p>
  <p class="cap-sub">Partição (P) é inevitável em rede real — a escolha é entre Consistency e Availability</p>
  <div class="cap-main">
    <div class="cap-triangle">
      <svg viewBox="0 0 180 160">
        <!-- triangle -->
        <polygon points="90,10 10,150 170,150" fill="none" stroke="#334155" stroke-width="1.5"/>
        <!-- shaded regions -->
        <polygon points="90,10 50,80 130,80" fill="#10B98112" stroke="none"/>
        <!-- vertices -->
        <circle cx="90" cy="10" r="18" fill="#1e293b" stroke="#10B981" stroke-width="1.5"/>
        <text x="90" y="8" text-anchor="middle" font-size="8" font-weight="700" fill="#10B981" font-family="Space Grotesk,sans-serif">
          <tspan x="90" dy="4">C</tspan>
        </text>
        <text x="90" y="20" text-anchor="middle" font-size="7" fill="#64748b" font-family="Space Grotesk,sans-serif">Consistency</text>
        <circle cx="10" cy="150" r="18" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="10" y="148" text-anchor="middle" font-size="8" font-weight="700" fill="#3b82f6" font-family="Space Grotesk,sans-serif">
          <tspan x="10" dy="4">A</tspan>
        </text>
        <text x="10" y="162" text-anchor="middle" font-size="7" fill="#64748b" font-family="Space Grotesk,sans-serif">Availability</text>
        <circle cx="170" cy="150" r="18" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="170" y="148" text-anchor="middle" font-size="8" font-weight="700" fill="#f59e0b" font-family="Space Grotesk,sans-serif">
          <tspan x="170" dy="4">P</tspan>
        </text>
        <text x="170" y="162" text-anchor="middle" font-size="7" fill="#64748b" font-family="Space Grotesk,sans-serif">Partition</text>
        <!-- CP label -->
        <text x="130" y="75" font-size="8" fill="#10B981" font-family="Space Grotesk,sans-serif" font-weight="600">CP</text>
        <text x="110" y="85" font-size="7" fill="#475569" font-family="Space Grotesk,sans-serif">Postgres,etcd</text>
        <!-- AP label -->
        <text x="42" y="75" font-size="8" fill="#3b82f6" font-family="Space Grotesk,sans-serif" font-weight="600">AP</text>
        <text x="25" y="85" font-size="7" fill="#475569" font-family="Space Grotesk,sans-serif">Cassandra,DynamoDB</text>
        <!-- CA note -->
        <text x="90" y="130" text-anchor="middle" font-size="7" fill="#ef4444" font-family="Space Grotesk,sans-serif">CA = não existe</text>
        <text x="90" y="140" text-anchor="middle" font-size="6" fill="#475569" font-family="Space Grotesk,sans-serif">em rede real</text>
      </svg>
    </div>
    <div class="cap-grid">
      <div class="cap-card">
        <div class="cap-card-title" style="color:#10B981">CP — Consistente + Tolerante a partição</div>
        <div class="cap-card-body">Em partição, sistema <span class="cap-tip">recusa resposta<span class="cap-tb">Prefere retornar erro a retornar dado potencialmente desatualizado. O node isolado fica indisponível até a partição sarar.</span></span> ao invés de retornar dado stale. Garante que toda leitura vê a última escrita.</div>
        <div class="cap-card-ex">PostgreSQL (sync replica) · etcd · Zookeeper · HBase · MongoDB</div>
      </div>
      <div class="cap-card">
        <div class="cap-card-title" style="color:#3b82f6">AP — Disponível + Tolerante a partição</div>
        <div class="cap-card-body">Em partição, sistema <span class="cap-tip">continua respondendo<span class="cap-tb">Pode retornar dados desatualizados (stale reads) ou aceitar escritas conflitantes que serão reconciliadas depois (eventual consistency).</span></span> mesmo que o dado possa estar desatualizado. Eventual consistency.</div>
        <div class="cap-card-ex">Cassandra · DynamoDB (padrão) · CouchDB · Riak</div>
      </div>
    </div>
  </div>
  <div class="cap-pacelc">
    <div class="cap-pacelc-title">PACELC — o CAP estendido (sem partição, ainda há trade-off)</div>
    <div class="cap-row">
      <span style="color:#10B981;font-weight:700;min-width:70px">PC/EC</span>
      <span style="color:#94a3b8">Prefere consistência sempre — com e sem partição. Ex: <strong style="color:#e2e8f0">Spanner, CockroachDB, PostgreSQL</strong></span>
    </div>
    <div class="cap-row">
      <span style="color:#3b82f6;font-weight:700;min-width:70px">PA/EL</span>
      <span style="color:#94a3b8">Prefere disponibilidade em partição e baixa latência no normal. Ex: <strong style="color:#e2e8f0">DynamoDB, Cassandra (padrão)</strong></span>
    </div>
    <div style="font-size:9px;color:#475569;margin-top:6px">⚠ Cassandra com QUORUM em escrita+leitura vira CP. O CAP de um sistema pode ser ajustado por query.</div>
  </div>
</div>`,
        caption: "CAP é um trade-off, não uma falha. Sistemas como Cassandra e DynamoDB são AP por padrão mas oferecem consistency tunable por operação. Conheça o padrão do seu banco antes de garantir consistência em entrevista.",
      },
    ],
    resources: [
      { title: "Brewer — CAP twelve years later", url: "https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/", kind: "artigo" },
      { title: "Designing Data-Intensive Applications (Kleppmann)", url: "https://dataintensive.net/", kind: "livro" },
      { title: "Aphyr — Jepsen analyses", url: "https://jepsen.io/analyses", kind: "artigo" },
      { title: "Martin Kleppmann — Distributed Systems lecture", url: "https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB", kind: "video" },
      { title: "MIT 6.824 — Distributed Systems", url: "https://pdos.csail.mit.edu/6.824/", kind: "curso" },
    ],
  },

  "http-2-http-3": {
    tagline: "Evolucao do HTTP: HTTP/2 multiplexa em uma TCP, HTTP/3 troca por QUIC sobre UDP.",
    why: "Web moderna roda HTTP/2 e HTTP/3. Senior precisa explicar head-of-line blocking, multiplexing, server push (e por que morreu) e QUIC.",
    summary: "HTTP/1.1 abre uma conexão por request (ou keep-alive serial) — gargalo. HTTP/2 multiplexa varios streams em uma TCP, header compression (HPACK), binary framing. Mas HTTP/2 sofre head-of-line blocking em TCP loss. HTTP/3 substitui TCP por QUIC (sobre UDP), com streams independentes, conexão mais rápida, migração de IP.",
    keypoints: [
      { title: "HTTP/1.1 problemas", body: "Uma request por vez por conexão. Browsers abrem 6 conexões paralelas por host. Head-of-line blocking dentro da conexão." },
      { title: "HTTP/2 multiplexing", body: "Multiplos streams em uma TCP. Cada stream tem id, frames intercalados. Sem keep-alive serial." },
      { title: "HPACK", body: "Compressao de headers via dicionario dinâmico. Headers repetidos viram referência curta. Reduz overhead." },
      { title: "HTTP/2 binary framing", body: "Mensagens viram frames binarios (HEADERS, DATA, SETTINGS). Mais eficiente de parsear que ASCII." },
      { title: "TCP HoL em HTTP/2", body: "Perda de pacote TCP bloqueia TODOS os streams (porque TCP exige ordem). Limitacao fundamental." },
      { title: "QUIC (HTTP/3)", body: "Protocolo novo sobre UDP. Streams independentes (loss em um não bloqueia outro). 0-RTT resume. TLS 1.3 integrado. Migração de IP (mobile)." },
      { title: "Server push (deprecated)", body: "HTTP/2 podia \"empurrar\" recursos antes do client pedir. Pouco usado, difícil de fazer certo, removido em browsers." },
      { title: "Adocao", body: "2026: ~70%% dos sites usam HTTP/2; HTTP/3 cresce rápido (Cloudflare, Google). Browsers todos suportam." },
    ],
    gotchas: [
      "Achar que HTTP/2 elimina HoL — não, é em camada de aplicação mas TCP ainda tem.",
      "Concatenar arquivos (bundling) e sprite era pra HTTP/1.1 — em HTTP/2 está subótimo (cache invalidation pior).",
      "CDN diz \"HTTP/3 enabled\" mas backend ainda em HTTP/1.1 — gargalo no origem.",
      "Server Push já morreu — ainda ve em tutoriais antigos. Use 103 Early Hints.",
      "QUIC é sobre UDP — alguns firewalls bloqueiam ou rate-limit UDP, fallback pra TCP.",
      "HTTP/2 sem TLS — possível mas todos browsers exigem TLS na prática.",
      "Confundir h2 (HTTP/2) com h2c (HTTP/2 cleartext) — diferentes.",
    ],
    interview: [
      { q: "O que HTTP/2 melhorou vs 1.1?", a: "<ul><li><strong>Multiplexing</strong>: varios streams em uma TCP. Sem fila por conexão.</li><li><strong>HPACK</strong>: compressão de headers.</li><li><strong>Binary framing</strong>: mais eficiente.</li><li><strong>Stream priority</strong>: cliente sinaliza quais são mais importantes.</li><li><strong>Server push</strong> (deprecated agora).</li></ul>" },
      { q: "Qual o problema fundamental do HTTP/2?", a: "<p><strong>Head-of-line blocking em TCP</strong>. HTTP/2 multiplexa em camada de aplicação, mas TCP exige ordem de pacotes — perda de um pacote bloqueia todos os streams até retransmit.</p><p>Em redes com perda (mobile, wifi ruim) penaliza HTTP/2.</p>" },
      { q: "Como HTTP/3 resolve isso?", a: "<p>HTTP/3 roda sobre QUIC (sobre UDP). QUIC implementa streams em nível de transporte — cada stream tem seu controle de fluxo, perda em um não bloqueia outros.</p><p>Bonus: QUIC integra TLS 1.3 (handshake em 1 RTT, 0-RTT resume), e suporta migração de IP (troca wifi pra 4G sem perder conexão).</p>" },
      { q: "Bundling com HTTP/2 — ainda vale?", a: "<p>Menos. Em HTTP/1.1 era crítico (1 request por conexão). Em HTTP/2 multiplexa — vários arquivos em paralelo é barato.</p><p>Mas bundling reduz overhead de runtime e melhora compressão gzip global. Trade-off vs cache granular. Em prática: bundle inteligente (split por rota), não tudo num arquivo.</p>" },
      { q: "Como está a adoção do HTTP/3?", a: "<p>2026: maior parte dos browsers suportam, e CDN (Cloudflare, Fastly, Google) servem por padrão. Adoção em sites cresceu rápido. Backend pra origin ainda majoritariamente HTTP/2 ou 1.1.</p><p>Pra cliente final, já é real. Pra interno (microsserviços), gRPC sobre HTTP/2 domina.</p>" },
      { q: "Quando usaria server push (ou alternativa)?", a: "<p>Server push em HTTP/2 está deprecated. Use <strong>103 Early Hints</strong> (HTTP/2 e 3) — server retorna 103 com Link: prefetch antes de processar request, browser começa download de CSS/JS crítico em paralelo.</p><p>Suporte: Chrome, Cloudflare, Fastly. Bom ganho em LCP.</p>" },
    ],
    resources: [
      { title: "High Performance Browser Networking — HTTP/2", url: "https://hpbn.co/http2/", kind: "livro" },
      { title: "Cloudflare — HTTP/3", url: "https://blog.cloudflare.com/http3-the-past-present-and-future/", kind: "artigo" },
      { title: "IETF — QUIC RFC 9000", url: "https://datatracker.ietf.org/doc/html/rfc9000", kind: "docs" },
      { title: "Google — HTTP/3 explained", url: "https://http3-explained.haxx.se/", kind: "docs" },
      { title: "web.dev — Early Hints", url: "https://web.dev/articles/early-hints", kind: "artigo" },
    ],
    diagram: "http-versions",
  },

  "processos-threads": {
    tagline: "Processo é isolado com sua memória; thread compartilha memória com outras do mesmo processo.",
    why: "Senior precisa entender concorrência em sistema. Por que Node usa cluster (processo) vs worker_threads. Por que Python tem GIL. Quando race condition vira bug.",
    summary: "Processo: unidade de execução isolada (memória própria, file descriptors). Thread: leve, compartilha memória do processo. Threads permitem paralelismo (em CPUs múltiplas) com overhead menor, mas exigem sync (mutex, semaforo) por causa de race condition. JS roda single-thread no event loop; pra paralelo usa Worker. Python tem GIL — threads não paralelizam CPU; use multiprocessing.",
    keypoints: [
      { title: "Processo", body: "Espaco de memória próprio. fork() cria copia. IPC via pipe, socket, shared mem. Crash de um não mata outros." },
      { title: "Thread", body: "Compartilha heap do processo, tem stack próprio. Overhead menor pra criar. Bug em uma derruba processo todo." },
      { title: "Race condition", body: "Resultado depende de ordem de execução não determinista. Ex: i++ em duas threads sem lock perde incremento." },
      { title: "Mutex", body: "Mutual exclusion. So uma thread no critical section. Risco: deadlock (A espera B, B espera A)." },
      { title: "Semaforo", body: "Conta N slots. Threads esperam slot livre. Útil pra limitar concorrência (rate limiter, connection pool)." },
      { title: "GIL (Python)", body: "Global Interpreter Lock — só uma thread Python executa bytecode por vez. Threads ainda úteis pra I/O (libera GIL); pra CPU usa multiprocessing." },
      { title: "Node concurrency", body: "JS single-thread no event loop. Cluster: processo por core (pra HTTP server). Worker threads: thread separada pra CPU-bound (compartilha memória via SharedArrayBuffer)." },
      { title: "Async I/O", body: "Alternativa a threads pra I/O. Single thread atende milhares de conexões via epoll/kqueue. Eh o que Node, Go, asyncio fazem." },
    ],
    gotchas: [
      "Compartilhar variável entre threads sem lock — race condition silenciosa.",
      "Esquecer release de mutex em path de erro — deadlock.",
      "Em Python, esperar threads paralelizem CPU — GIL impede. Use multiprocessing ou C extension.",
      "Em Node, achar que worker é \"free\" — IPC tem overhead, usa SharedArrayBuffer pra zero-copy.",
      "Fork em processo com varios threads -> child fica em estado inconsistente.",
      "Thread pool sem limite -> esgota memória. Sempre cap.",
      "Async com bloqueio síncrono (fs.readFileSync, requests sync) trava o event loop.",
    ],
    interview: [
      { q: "Diferenca entre processo e thread?", a: "<p><strong>Processo</strong>: memória isolada. Crash não afeta outros. Custo de criação maior. IPC é explícito.</p><p><strong>Thread</strong>: compartilha memória do processo. Cria rápido, comunica fácil. Bug em uma derruba processo todo. Precisa sync.</p><p>Processo pra isolamento; thread pra paralelismo barato.</p>" },
      { q: "O que é GIL e por que existe?", a: "<p>Global Interpreter Lock (CPython): um lock que só deixa uma thread executar bytecode Python por vez.</p><p>Existe pra simplicidade do interpretador (memory management de objects não precisa ser thread-safe).</p><p>Consequência: threads não paralelizam CPU. Pra workload CPU-bound em Python, use <code>multiprocessing</code> ou C extensions (numpy, que solta GIL).</p>" },
      { q: "Como Node.js consegue ser concorrente sendo single-thread?", a: "<p>Event loop + async I/O. JS roda em uma thread, mas I/O (fs, net, http) é feito em thread pool da libuv (4 threads default). Quando termina, callback volta pra event loop.</p><p>Pra CPU-bound: <code>worker_threads</code> (thread real). Pra paralelizar HTTP server: <code>cluster</code> (múltiplos processos, balanceam por kernel).</p>" },
      { q: "O que é race condition? Da exemplo", a: "<p>Resultado depende de ordem não determinista. Clássico:</p><p><code>// counter compartilhado<br>counter = counter + 1; // 3 instruções (load, add, store)</code></p><p>Duas threads simultaneas: ambas leem 0, ambas escrevem 1. Esperado 2, virou 1. Solução: mutex em volta, ou atomic op.</p>" },
      { q: "Quando usaria threads vs processos?", a: "<ul><li><strong>Threads</strong>: workload precisa compartilhar muita memória (cache, model em memória). Custo de IPC seria alto.</li><li><strong>Processos</strong>: precisa isolamento (security, sandboxing) ou linguagem com GIL (Python, Ruby) pra CPU. HTTP servers em Python/Ruby usam workers (gunicorn, puma).</li></ul>" },
      { q: "Como evita deadlock?", a: "<ul><li><strong>Lock ordering</strong>: sempre aquire locks em mesma ordem global.</li><li><strong>Timeout</strong> em lock: se não consegue em N segundos, libera tudo e retry.</li><li><strong>Avoid nested locks</strong>: simplifica regiao crítica.</li><li><strong>Use higher-level primitives</strong>: channels, atomic, lock-free DSs.</li></ul>" },
    ],
    resources: [
      { title: "OSTEP — Operating Systems: Three Easy Pieces", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", kind: "livro" },
      { title: "Beej's Guide to Unix IPC", url: "https://beej.us/guide/bgipc/", kind: "livro" },
      { title: "Python — multiprocessing vs threading", url: "https://docs.python.org/3/library/multiprocessing.html", kind: "docs" },
      { title: "Node.js — Worker Threads", url: "https://nodejs.org/api/worker_threads.html", kind: "docs" },
      { title: "Brendan Gregg — concurrency", url: "https://www.brendangregg.com/", kind: "artigo" },
    ],
  },

  "raft-paxos": {
    tagline: "Algoritmos de consenso distribuido: como N nodes concordam num valor com falhas.",
    why: "Base de etcd, Consul, CockroachDB, MongoDB. Em entrevista de system design, mostrar que você entende quorum, log replication e leader election é diferencial.",
    summary: "Consenso distribuido garante que N nodes concordam em sequência de operações mesmo com falha de minoria. Paxos é o clássico (Lamport), notoriamente difícil. Raft (Stanford 2014) foi desenhado pra ser entendivel — leader election + log replication. Quorum (maioria) é chave: com 2f+1 nodes tolera f falhas. Usado em qualquer DB distribuido moderno com strong consistency.",
    keypoints: [
      { title: "Quorum", body: "Maioria. Com 2f+1 nodes tolera f falhas. 3 nodes -> tolera 1; 5 -> tolera 2. Toda decisão precisa do quorum concordar." },
      { title: "Raft — leader election", body: "Um node é leader. Recebe writes, replica pra followers. Se leader cai, followers fazem eleicao (votam em quem tem log mais novo)." },
      { title: "Raft — log replication", body: "Leader appendlog, replica pra followers, commitam apenas quando maioria confirmou. Followers aplicam em ordem." },
      { title: "Raft — safety", body: "Term number monotonic. Eleição com term maior inválida leader antigo. Garante que só um leader por term." },
      { title: "Paxos básico", body: "Roles: proposer, acceptor, learner. Two phases: prepare (gain promise), accept (commit value). Multi-Paxos otimiza pra leader." },
      { title: "Raft vs Paxos", body: "Raft é mais fácil de entender e implementar. Paxos é mais flexível mas notoriamente difícil. Em prática, todo mundo usa Raft." },
      { title: "Implementacoes", body: "etcd (Raft em Go), Consul, CockroachDB, MongoDB (proprietario), Tigris, Spanner (Paxos)." },
      { title: "Limitações", body: "Quorum exige maioria viva — em partição, lado minoritario não opera. Latência >= 1 RTT pra majoria. Não escala write linearmente." },
    ],
    gotchas: [
      "Achar que 2 nodes é tolerante — precisa quorum, 2 não tem maioria sem ambos.",
      "Cluster par (4, 6 nodes) — fica em split-brain mais fácil que impar. Sempre use 3, 5, 7.",
      "Esquecer que leader pode ficar isolado e ainda achar que é leader (need lease + pre-vote em Raft).",
      "Confiar só em Raft sem snapshot — log cresce indefinido, recovery fica lento.",
      "Comparar latência de write entre Raft (consenso) e single primary — Raft sempre paga 1 RTT extra.",
      "Implementar Raft do zero — é fácil errar edge case. Use lib (hashicorp/raft, etcd/raft).",
    ],
    interview: [
      { q: "O que é quorum e por que importa?", a: "<p>Maioria simples (mais que metade). Com 2f+1 nodes, tolera f falhas: ainda sobra maioria.</p><p>Por que: garante que duas decisões não podem ser tomadas em \"lados\" diferentes (qualquer dois quorums se cruzam em pelo menos um node, que pode rejeitar a segunda).</p>" },
      { q: "Resuma Raft em uma frase", a: "<p>Algoritmo de consenso baseado em <strong>leader election</strong> + <strong>log replication</strong>: um leader único por term recebe writes, replica pra followers, commita quando maioria confirmou. Se leader cai, eleicao em term novo.</p>" },
      { q: "O que acontece se a partição isola o leader?", a: "<p>Lado da partição com leader não tem quorum -> não consegue commitar novas entries. Lado com maioria elege novo leader (term maior).</p><p>Quando partição cura: leader antigo ve term maior, vira follower. Reverte uncommitted entries. Sistema são novamente.</p>" },
      { q: "Por que clusters Raft são impares (3, 5, 7)?", a: "<p>4 nodes precisam de quorum 3 (mesmo que 5). Você paga overhead de mais um node sem ganhar tolerancia. Pior: chance de split-brain em 2x2 igual.</p><p>3 tolera 1 falha; 5 tolera 2; 7 tolera 3. Sweet spot: 3 ou 5 pra maioria dos casos.</p>" },
      { q: "Como Raft lida com leader que ficou isolado mas ainda acha que é leader?", a: "<p>Risco: leader antigo aceita reads stale. Mitigação:</p><ul><li><strong>Lease</strong>: leader periodicamente renova lease com followers. Sem heartbeat, não serve reads.</li><li><strong>Read index</strong>: pra read consistente, leader pergunta majoria se ainda é leader antes de responder.</li><li><strong>Pre-vote</strong>: candidato confirma com maioria antes de incrementar term, evitando disrupcao desnecessaria.</li></ul>" },
      { q: "Quando NÃO usar Raft?", a: "<ul><li>Sistemas que tolera eventual consistency (Cassandra, DynamoDB).</li><li>Workload write-heavy single-primary serve melhor.</li><li>Geo-distribuido com latência alta — Raft penaliza muito (1 RTT por commit). Considere Paxos com flexibility ou CRDTs.</li></ul>" },
    ],
    resources: [
      { title: "Raft paper (Ongaro, Ousterhout)", url: "https://raft.github.io/raft.pdf", kind: "artigo" },
      { title: "raft.github.io — visualization", url: "https://raft.github.io/", kind: "pratica" },
      { title: "The Secret Lives of Data — Raft", url: "http://thesecretlivesofdata.com/raft/", kind: "pratica" },
      { title: "MIT 6.824 — lectures", url: "https://pdos.csail.mit.edu/6.824/", kind: "curso" },
      { title: "Designing Data-Intensive Applications (Kleppmann)", url: "https://dataintensive.net/", kind: "livro" },
      { title: "Paxos Made Simple (Lamport)", url: "https://lamport.azurewebsites.net/pubs/paxos-simple.pdf", kind: "artigo" },
    ],
  },

  "crdts": {
    tagline: "Estruturas de dados que mergeiam automaticamente entre replicas — sem coordenacao.",
    why: "Base de apps colaborativos (Figma, Linear, Notion offline). Senior precisa explicar trade-off vs OT, tipos de CRDT, e quando NÃO usar.",
    summary: "CRDT (Conflict-free Replicated Data Type) é uma estrutura onde merge é associativo, comutativo e idempotente — qualquer ordem de operações converge pro mesmo estado. Permite replicas operarem offline e mergiarem sem conflito. Tipos: state-based (CvRDT) e operation-based (CmRDT). Trade-off: convergencia automática custa metadata e semantica restrita.",
    keypoints: [
      { title: "Propriedades", body: "Merge associativo, comutativo, idempotente (ACI). Garante convergencia eventual sem coordenacao central." },
      { title: "G-Counter", body: "Counter só cresce. Cada replica tem contador próprio; merge = max por replica + sum. Útil pra likes, views." },
      { title: "PN-Counter", body: "G-Counter pra positivo + outro pra negativo. Merge = max por replica em cada. Permite increment e decrement." },
      { title: "G-Set", body: "Set só add. Merge = union. Sem remove." },
      { title: "2P-Set", body: "G-Set + tombstone set. Add/remove, mas item removido não volta." },
      { title: "OR-Set (Observed-Remove)", body: "Add com unique tag; remove só tira tags observados. Permite re-add. Mais complexo, mais útil." },
      { title: "Yjs / Automerge", body: "Libs de CRDT pra docs colaborativos. Yjs é padrão em editors (Notion-like). Automerge é JSON-like." },
      { title: "Vector clocks / version vectors", body: "Metadata pra detectar concurrency. Cada replica incrementa seu contador a cada update. Merge usa pra ordenar." },
    ],
    gotchas: [
      "CRDT cresce metadata indefinidamente sem garbage collection (tombstones em OR-Set).",
      "Achar que CRDT serve pra qualquer estrutura — semantica é restrita (counter, set, list, json específico).",
      "Comparar CRDT com OT (Operational Transform) sem entender — OT exige server central; CRDT é peer-to-peer.",
      "Esquecer que LWW (Last-Write-Wins) com timestamp é CRDT mas perde dados em concorrência.",
      "Implementar do zero — use Yjs, Automerge, Loro. Bug em CRDT é sutil.",
      "Performance: alguns CRDTs (state-based) tem merge O(n).",
    ],
    interview: [
      { q: "Por que CRDTs?", a: "<p>Permitem replicas operarem offline e mergerar automaticamente sem coordenacao central — convergencia eventual garantida pelas propriedades algebricas (associativo, comutativo, idempotente).</p><p>Casos: editores colaborativos, apps mobile offline-first, multi-region eventual consistency.</p>" },
      { q: "CRDT vs OT (Operational Transform)?", a: "<p><strong>OT</strong>: usado por Google Docs. Operações são transformadas em função do estado. Funciona com server central que serializa e transforma.</p><p><strong>CRDT</strong>: estruturas onde merge é sempre seguro. Não precisa server central. Peer-to-peer ou multi-server.</p><p>OT é mais maduro mas exige central. CRDT é padrão novo (Figma, Linear).</p>" },
      { q: "Como funciona G-Counter?", a: "<p>Counter só cresce. Cada réplica tem array de contadores (um por réplica). Increment local incrementa só o seu.</p><p>Merge: max por replica. Read: sum.</p><p>Ex: replica A tem [3,0,0]; B tem [0,2,0]. Após merge ambos têm [3,2,0]; read = 5.</p>" },
      { q: "CRDT cresce metadata pra sempre?", a: "<p>Em alguns casos sim. OR-Set acumula tombstones. Yjs tem garbage collection com snapshot. Trade-off: economiza memória vs perde história.</p><p>Mitigar: snapshots periódicos com agreement, GC de tombstones antigos com vector clock min.</p>" },
      { q: "Quando NÃO usar CRDT?", a: "<ul><li>Operações que exigem invariante global (saldo não negativo, estoque exato).</li><li>Estruturas complexas sem CRDT pronto (relacional).</li><li>Latência crítica em single-primary suficiente.</li><li>Time pequeno sem expertise — CRDTs são sutis.</li></ul>" },
      { q: "Como funciona Yjs?", a: "<p>Yjs implementa CRDT pra documentos: arrays, maps, texto, XML. Cada operação tem ID único (clock + clientID). Merge é determinista.</p><p>Suporta peer-to-peer (WebRTC, y-webrtc) e server-based (y-websocket). Usado em editores Tiptap, Slate, Monaco. Provavelmente roda nos seus apps colaborativos favoritos.</p>" },
    ],
    resources: [
      { title: "Martin Kleppmann — CRDTs talk", url: "https://www.youtube.com/watch?v=B5NULPSiOGw", kind: "video" },
      { title: "Designing Data-Intensive Applications (Kleppmann)", url: "https://dataintensive.net/", kind: "livro" },
      { title: "CRDT.tech", url: "https://crdt.tech/", kind: "docs" },
      { title: "Yjs docs", url: "https://docs.yjs.dev/", kind: "docs" },
      { title: "Automerge docs", url: "https://automerge.org/", kind: "docs" },
      { title: "Shapiro et al — A comprehensive study of CRDTs", url: "https://hal.inria.fr/inria-00555588/document", kind: "artigo" },
    ],
  },

  "consistent-hashing": {
    tagline: "Algoritmo pra mapear chaves a nodes minimizando rehash quando cluster muda.",
    why: "Base de DynamoDB, Cassandra, Memcached, CDNs, load balancers. Senior precisa explicar virtual nodes, ring topology e por que hash módulo não escala.",
    summary: "Hash módulo (key % N) é simples mas remap massivo quando N muda — adicionar 1 node remap quase tudo. Consistent hashing mapeia keys e nodes em ring (0 a 2^32). Cada key vai pro próximo node no ring no sentido horário. Adicionar/remover node remap só 1/N keys. Virtual nodes (vnodes) balanceiam carga e suavizam falhas.",
    keypoints: [
      { title: "Problema do hash módulo", body: "hash(k) % N. Mudar N inválida quase todo cache/sharding. Em N=3 -> N=4, ~75%% das keys remapeam." },
      { title: "Ring", body: "Espaco hash circular (ex: 0 a 2^32-1). Cada node tem hash(node_id), key vai pro próximo node horario." },
      { title: "Adicionar node", body: "Soh keys entre node anterior e o novo migram. Resto fica. Reduz rehash de O(N) pra O(K/N)." },
      { title: "Virtual nodes", body: "Cada node físico tem M tokens no ring (100-256 tipico). Distribuição mais uniforme, falha de um node redistribui carga entre varios." },
      { title: "Replicação", body: "Em DynamoDB/Cassandra, key vai pro primeiro node + N-1 seguintes no ring. R+W>N pra consistencia tunable." },
      { title: "Hot keys", body: "Consistent hashing não resolve hot key (uma chave com trafego desproporcional). Usa cache local, replicas extras ou sharding por sub-chave." },
      { title: "Jump consistent hash", body: "Algoritmo do Google sem ring. Mais rápido, mas adiciona node soh no fim. Bom pra cluster com crescimento monotonic." },
      { title: "Rendezvous hashing (HRW)", body: "Alternativa: para cada (key, node) calcula hash; pega node com maior. Sem ring, mas O(N) por lookup." },
    ],
    gotchas: [
      "Hash módulo simples explode em rehash quando cluster cresce.",
      "Sem virtual nodes, distribuição fica desigual — alguns nodes 2x mais carga.",
      "Hot key derruba o node responsável — precisa estrategia adicional.",
      "Ring pequeno (2^16) gera colisoes em cluster grande.",
      "Comparar consistent hashing com sharding por range — são trade-offs (range permite sequential scan, hashing não).",
      "Esquecer que adicionar node migra dados — em DBs é operação cara, fazer com cuidado.",
      "Inconsistent vs consistent — confundir com CAP \"consistency\". São temas diferentes.",
    ],
    interview: [
      { q: "Por que não usar hash módulo simples?", a: "<p>Quando N (número de nodes) muda, quase TODAS as keys remapeiam. Ex: cache distribuido de 10 nodes -> escalar pra 11 inválida ~91%% do cache. Tempestade de cache miss derruba o backend.</p><p>Consistent hashing reduz pra 1/N (~9%%). Diferenca de ordem de magnitude.</p>" },
      { q: "Como funciona o ring?", a: "<p>Espaco hash circular (0 a 2^32). Cada node tem hash(node_id) -> posição no ring. Cada key também -> posição. Key vai pro primeiro node no sentido horário.</p><p>Adicionar node N: soh as keys entre o predecessor e N migram pra N. O resto fica.</p>" },
      { q: "Por que virtual nodes?", a: "<p>Sem vnodes, hash de N nodes pode cair desigual no ring — alguns node ganha 2x mais espaco. Distribuição desbalanceada.</p><p>Com vnodes, cada node ocupa M=100-256 posições pseudoaleatorias. Distribuição uniforme. Bonus: quando node falha, sua carga distribui entre varios outros (não soh o vizinho).</p>" },
      { q: "Como faz replicação com consistent hashing?", a: "<p>Padrão DynamoDB/Cassandra: key vai pro node X (primeiro no ring). Réplicas vão pros N-1 próximos. Tipicamente N=3.</p><p>Read: contata R nodes, leitor compara versões. Write: W nodes confirmam. Consistencia: R+W>N garante read ve última write.</p>" },
      { q: "Como lida com hot key?", a: "<p>Consistent hashing não resolve sozinho. Estrategias:</p><ul><li><strong>Cache local</strong> antes de hit no node (Redis local, in-memory).</li><li><strong>Replicas extras</strong> pra hot keys conhecidos.</li><li><strong>Sub-sharding</strong>: hash(key + counter) pra distribuir.</li><li><strong>Detect e isolar</strong>: monitora top-k keys, trata especialmente.</li></ul>" },
      { q: "Onde você já viu consistent hashing em produção?", a: "<ul><li>Memcached client (Ketama).</li><li>DynamoDB partition key.</li><li>Cassandra token ring.</li><li>CDN Akamai/Cloudflare pra escolher edge.</li><li>Service mesh load balancing por session.</li></ul>" },
    ],
    resources: [
      { title: "Karger et al — Consistent Hashing paper", url: "https://www.akamai.com/site/en/documents/research-paper/consistent-hashing-and-random-trees-distributed-caching-protocols-for-relieving-hot-spots-on-the-world-wide-web-technical-publication.pdf", kind: "artigo" },
      { title: "High Scalability — Consistent Hashing", url: "https://highscalability.com/consistent-hashing-algorithm/", kind: "artigo" },
      { title: "Designing Data-Intensive Applications (Kleppmann)", url: "https://dataintensive.net/", kind: "livro" },
      { title: "Toptal — Consistent Hashing explained", url: "https://www.toptal.com/big-data/consistent-hashing", kind: "artigo" },
      { title: "Jump Consistent Hash paper", url: "https://arxiv.org/abs/1406.2294", kind: "artigo" },
    ],
    diagram: "consistent-hashing",
  },
}

export default data
