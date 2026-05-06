import type { SkillContent } from "@/types"

const algoritmoDs: SkillContent = {
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
      { q: "Por que bancos de dados usam B-trees em vez de árvores AVL ou Red-Black?", a: "<p><strong>Disco vs. memória RAM:</strong> árvores balanceadas (AVL, Red-Black) são ótimas em RAM porque cada acesso a nó é barato. Em disco, o custo dominante é o I/O de página — ler 8 bytes custa o mesmo que ler 4 KB (tamanho de uma página de disco/SSD).</p><p><strong>B-tree resolve isso:</strong> cada nó armazena centenas de chaves (fanout alto = 100–1000). Árvore de 1 bilhão de registros tem altura 3–4 em vez de 30 de uma BST. Cada level = um I/O de página. Menos height = menos I/Os = mais rápido.</p><p><strong>Cache lines:</strong> em RAM, nós grandes de B-tree também aproveitam melhor cache lines de CPU (64 bytes). Acessar nó pequeno de AVL desperdiça cache.</p><p><strong>B+ tree (variante):</strong> usada pelo PostgreSQL, MySQL InnoDB. Dados apenas nas folhas, folhas ligadas em lista — range scan = percorrer folhas sem subir/descer na árvore. Perfeito para <code>WHERE age BETWEEN 20 AND 30</code>.</p>", level: "senior", tip: "A resposta completa menciona page size, fanout, height e B+ tree. AVL/Red-Black são corretos em RAM mas errados para disco — a distinção é o que a pergunta quer testar." },
      { q: "O que é skip list e quando usaria no lugar de uma árvore balanceada?", a: "<p>Skip list é uma estrutura probabilística de listas encadeadas em múltiplos níveis. Cada elemento aparece no nível 0 (lista completa) e é promovido para níveis superiores com probabilidade p (tipicamente 0,5). O nível superior funciona como 'atalho' — busca salta pela lista em passos exponencialmente maiores.</p><p><strong>Complexidade:</strong> search, insert, delete em O(log n) esperado. O(n) espaço com constante pequena na prática.</p><p><strong>Vantagens sobre BSTs balanceadas:</strong><ul><li>Implementação mais simples — sem rotações complexas como em AVL ou Red-Black.</li><li>Lock-free concurrency: CAS (compare-and-swap) nas skip lists é mais fácil do que em árvores. Por isso Redis Sorted Set e LevelDB usam skip lists.</li><li>Range scan eficiente: percorrer o nível 0 é sequencial.</li></ul></p><p><strong>Desvantagem:</strong> probabilístico — pior caso O(n), embora extremamente improvável. BSTs balanceadas garantem O(log n) deterministicamente.</p>", level: "senior" },
      { q: "Como funciona consistent hashing e por que é fundamental em sistemas distribuídos?", a: "<p>Hash módulo simples (<code>hash(key) % N</code>): quando N muda (scale out/in), quase todas as chaves remapeiam — cachê invalida, sharding rebalanceia tudo. Em cluster de 100 nós, adicionar 1 invalida ~99% das chaves.</p><p><strong>Consistent hashing:</strong> mapeia chaves e nós em um anel circular (espaço 0 a 2³²). Cada chave vai para o próximo nó no sentido horário. Adicionar/remover nó remap apenas 1/N das chaves.</p><p><strong>Virtual nodes (vnodes):</strong> cada nó físico ocupa M=100–256 posições no anel. Garante distribuição uniforme e faz com que falha de um nó redistribua carga entre muitos outros (não só o vizinho).</p><p><strong>Usado em:</strong> DynamoDB (partition key), Cassandra (token ring), Memcached (Ketama), CDNs para escolha de edge server.</p>", level: "senior", tip: "Mencionar vnodes e replicação (key vai para os N próximos nós no anel) diferencia resposta plena de resposta sênior." },
      { q: "O que é bloom filter e quando aceitar falsos positivos é uma troca válida?", a: "<p>Bloom filter é uma estrutura probabilística espaço-eficiente para testar pertinência. Usa um array de bits + k funções hash. Insert: define k bits. Lookup: testa k bits — se todos 1, <em>provavelmente</em> está no conjunto; se algum 0, definitivamente não está.</p><p><strong>Propriedade fundamental:</strong> falsos positivos possíveis (diz que está quando não está), falsos negativos impossíveis (nunca diz que não está quando está). Taxa de falso positivo é configurável via tamanho do array e k.</p><p><strong>Quando usar:</strong><ul><li>Cache de CDN: antes de ir ao banco verificar se URL existe (evita database lookup para URLs inválidas).</li><li>HBase/Cassandra: cada SSTable tem bloom filter — evita ler disco para keys que não existem.</li><li>Verificação de senha em breach databases (k-anonimato com bloom filter).</li><li>Redes peer-to-peer: checar se bloco já foi visto.</li></ul></p><p><strong>Quando NÃO usar:</strong> precisa de delete (versão padrão não suporta), precisa de zero falsos positivos, conjunto caberá na memória em hash set normal.</p>", level: "senior" },
      { q: "O que é monotonic stack e quando usar para sliding window maximum?", a: "<p>Monotonic stack é uma stack onde os elementos são mantidos em ordem monotônica (crescente ou decrescente). Ao adicionar elemento, pop todos que violam a ordem antes de insertar.</p><p><strong>Sliding window maximum (problema clássico):</strong> dado array e janela de tamanho k, encontrar o máximo de cada janela em O(n) (brute force seria O(n×k)).</p><p>Solução com deque monotônico (monotonic queue):<ul><li>Manter deque com índices em ordem decrescente de valor.</li><li>Ao avançar janela: (1) remover do front se fora da janela (índice < i-k), (2) remover do back enquanto arr[back] ≤ arr[i], (3) adicionar i no back. Máximo é sempre arr[deque.front()].</li></ul></p><p><strong>Outros usos de monotonic stack:</strong> Next Greater Element, Largest Rectangle in Histogram, Trapping Rain Water, Daily Temperatures. Padrão: quando precisar do próximo/anterior maior ou menor elemento em O(n).</p>", level: "senior", tip: "Sliding window maximum com deque é uma das perguntas de nível G (Google, Meta) mais frequentes. A chave é entender o invariante da deque." },
      { q: "Como implementar segment tree e qual problema resolve que prefix sum não resolve?", a: "<p><strong>Prefix sum resolve:</strong> range sum query estático (array não muda) em O(1) query, O(n) build. Mas update é O(n) — precisa reconstruir o array de prefix sums.</p><p><strong>Segment tree resolve:</strong> range query + point update em O(log n) ambos. Útil quando o array muda frequentemente.</p><p><strong>Estrutura:</strong> árvore binária onde cada nó representa um intervalo. Folha = elemento individual. Nó interno = agregação dos filhos (sum, min, max, gcd...). Construção O(n). Armazenado em array de tamanho 4n.</p><pre style='font-size:9px;color:#94a3b8;background:#1e293b;padding:8px;border-radius:4px;overflow-x:auto;margin-top:6px'>function build(node, start, end):\n  if start == end: tree[node] = arr[start]\n  else:\n    mid = (start + end) / 2\n    build(2*node, start, mid)\n    build(2*node+1, mid+1, end)\n    tree[node] = tree[2*node] + tree[2*node+1]\n\nfunction update(node, start, end, idx, val): // O(log n)\nfunction query(node, start, end, l, r): // O(log n)</pre><p><strong>Lazy propagation:</strong> para range updates eficientes (adicionar valor a todos os elementos de um intervalo) — adia propagação das mudanças para nós filhos.</p>", level: "senior" },
    ],
    videos: [
      { title: "Abdul Bari — Algorithms Full Course", channel: "Abdul Bari", url: "https://www.youtube.com/watch?v=0IAPZzGSbME", topic: "Fundamentos de algoritmos e análise de complexidade", note: "Playlist completa cobrindo sorting, graphs, DP e greedy com derivações matemáticas claras" },
      { title: "Errichto — Competitive Programming for Beginners", channel: "Errichto Algorithms", url: "https://www.youtube.com/watch?v=xAeiXy8-9Y8", topic: "Pensamento algorítmico e resolução de problemas", note: "Foca em reconhecimento de padrão e raciocínio — mais útil do que decorar soluções" },
      { title: "MIT 6.006 Introduction to Algorithms (2020)", channel: "MIT OpenCourseWare", url: "https://www.youtube.com/watch?v=ZA-tUyM_y7s", topic: "Fundamentos teóricos: sorting, trees, graphs, DP", note: "Base acadêmica sólida — aulas de Erik Demaine e Jason Ku" },
      { title: "NeetCode — How I would learn LeetCode if I could start over", channel: "NeetCode", url: "https://www.youtube.com/watch?v=aHZW7TuY_yo", topic: "Estratégia de estudo e NeetCode 150", note: "Guia prático de como abordar estudo por padrão, não por problema isolado" },
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
    codeExamples: [
      {
        title: "Busca binária — implementação completa com análise de complexidade",
        description: "O(log n) em array ordenado. Cobre busca exata, lower bound e upper bound. Inclui a variante 'binary search on answer' para problemas de otimização.",
        language: "typescript",
        code: `// Busca binária clássica — O(log n) tempo, O(1) espaço
// Pré-condição: array DEVE estar ordenado
function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;  // evita overflow vs (lo+hi)/2
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;  // não encontrado
}

// Lower bound: primeiro índice onde arr[i] >= target — O(log n)
function lowerBound(arr: number[], target: number): number {
  let lo = 0, hi = arr.length;  // hi = length (não length-1)
  while (lo < hi) {             // invariante: lo < hi (não <=)
    const mid = (lo + hi) >> 1;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;  // pode ser arr.length se target > todos
}

// Upper bound: primeiro índice onde arr[i] > target — O(log n)
function upperBound(arr: number[], target: number): number {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// Binary search on answer: busca a resposta no espaço de soluções
// Problema: capacidade mínima para entregar todos os pacotes em D dias
function minCapacity(weights: number[], D: number): number {
  const canShip = (cap: number): boolean => {
    let days = 1, cur = 0;
    for (const w of weights) {
      if (cur + w > cap) { days++; cur = 0; }
      cur += w;
    }
    return days <= D;
  };
  let lo = Math.max(...weights);              // mínimo: maior pacote
  let hi = weights.reduce((a, b) => a + b);  // máximo: tudo em 1 dia
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    canShip(mid) ? hi = mid : lo = mid + 1;
  }
  return lo;
}

// Complexidade:
// binarySearch:  O(log n) tempo, O(1) espaço
// lowerBound:    O(log n) tempo, O(1) espaço
// minCapacity:   O(n log W) tempo onde W = sum(weights)
const arr = [1, 3, 5, 7, 9, 11];
console.log(binarySearch(arr, 7));   // → 3
console.log(lowerBound(arr, 6));     // → 3 (primeiro >= 6)
console.log(upperBound(arr, 7));     // → 4 (primeiro > 7)`,
      },
      {
        title: "QuickSort — partição in-place com análise de pior/médio caso",
        description: "Algoritmo de ordenação O(n log n) médio e O(n²) pior caso. Implementa partição de Lomuto e Hoare. Inclui randomização para evitar pior caso.",
        language: "typescript",
        code: `// QuickSort com partição de Lomuto — O(n log n) médio, O(n²) pior caso
// Pior caso: array já ordenado com pivot no último elemento

function partition(arr: number[], lo: number, hi: number): number {
  const pivot = arr[hi];  // Lomuto: pivot = último elemento
  let i = lo - 1;         // i aponta para a última posição da partição menor
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];  // swap
    }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];  // coloca pivot no lugar certo
  return i + 1;  // índice final do pivot
}

function quickSort(arr: number[], lo = 0, hi = arr.length - 1): void {
  if (lo >= hi) return;
  const pivotIdx = partition(arr, lo, hi);
  quickSort(arr, lo, pivotIdx - 1);   // ordena lado esquerdo
  quickSort(arr, pivotIdx + 1, hi);   // ordena lado direito
}

// Randomização elimina pior caso esperado → O(n log n) esperado
function randomizedQuickSort(arr: number[], lo = 0, hi = arr.length - 1): void {
  if (lo >= hi) return;
  // Troca pivot aleatório com o último elemento antes de particionar
  const randIdx = lo + Math.floor(Math.random() * (hi - lo + 1));
  [arr[randIdx], arr[hi]] = [arr[hi], arr[randIdx]];
  const pivotIdx = partition(arr, lo, hi);
  randomizedQuickSort(arr, lo, pivotIdx - 1);
  randomizedQuickSort(arr, pivotIdx + 1, hi);
}

// Complexidade:
// Melhor/médio caso: O(n log n) — pivot divide ao meio a cada vez
// Pior caso:         O(n²)     — array ordenado com pivot extremo
// Espaço:            O(log n)  — recursão (profundidade da call stack)
// In-place:          sim (não usa array auxiliar, diferente de MergeSort)

const arr = [3, 6, 8, 10, 1, 2, 1];
quickSort(arr);
console.log(arr);  // → [1, 1, 2, 3, 6, 8, 10]`,
      },
      {
        title: "BFS e DFS em grafo — lista de adjacência com casos de uso distintos",
        description: "BFS para caminho mais curto (não ponderado) e componentes. DFS para ciclo, topological sort e backtracking. Ambos em lista de adjacência O(V+E).",
        language: "typescript",
        code: `type Graph = Map<number, number[]>;

// BFS — Breadth-First Search: nível a nível com queue
// Garante caminho mais curto em grafo não ponderado
function bfs(graph: Graph, start: number): Map<number, number> {
  const dist = new Map<number, number>();
  const queue: number[] = [start];
  dist.set(start, 0);

  while (queue.length > 0) {
    const node = queue.shift()!;
    for (const neighbor of (graph.get(node) ?? [])) {
      if (!dist.has(neighbor)) {
        dist.set(neighbor, dist.get(node)! + 1);
        queue.push(neighbor);
      }
    }
  }
  return dist;  // dist.get(v) = menor número de arestas de start até v
}

// DFS — Depth-First Search: profundidade com stack/recursão
// Detecta ciclo, faz topological sort, calcula componentes
function dfsIterativo(graph: Graph, start: number): Set<number> {
  const visited = new Set<number>();
  const stack: number[] = [start];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);
    for (const neighbor of (graph.get(node) ?? [])) {
      if (!visited.has(neighbor)) stack.push(neighbor);
    }
  }
  return visited;
}

// Topological sort via DFS pós-ordem (para DAG)
function topoSort(graph: Graph, nodes: number[]): number[] {
  const visited = new Set<number>();
  const result: number[] = [];

  function dfs(node: number): void {
    visited.add(node);
    for (const neighbor of (graph.get(node) ?? [])) {
      if (!visited.has(neighbor)) dfs(neighbor);
    }
    result.push(node);  // pós-ordem: adiciona após visitar todos os filhos
  }

  for (const node of nodes) {
    if (!visited.has(node)) dfs(node);
  }
  return result.reverse();  // inverso da pós-ordem = ordem topológica
}

// Complexidade: O(V + E) tempo, O(V) espaço para ambos BFS e DFS
// BFS: memória proporcional à largura do grafo (pode ser enorme)
// DFS: memória proporcional à profundidade (altura da árvore de recursão)

const g: Graph = new Map([
  [0, [1, 2]],
  [1, [3]],
  [2, [3]],
  [3, [4]],
  [4, []],
]);
console.log(bfs(g, 0));             // → {0:0, 1:1, 2:1, 3:2, 4:3}
console.log([...dfsIterativo(g, 0)]); // → [0, 2, 3, 4, 1] (ordem de visita)
console.log(topoSort(g, [0,1,2,3,4])); // → [0, 1, 2, 3, 4]`,
      },
      {
        title: "Hash table com encadeamento — resolução de colisão e análise",
        description: "Implementação de tabela hash com chaining (lista ligada por bucket). Demonstra função hash, fator de carga e por que operações são O(1) amortizado.",
        language: "typescript",
        code: `// Hash table com encadeamento (separate chaining)
// Cada bucket contém uma lista de pares [chave, valor]
// Resolve colisões encadeando múltiplos pares no mesmo bucket

class HashTable<K, V> {
  private buckets: Array<Array<[K, V]>>;
  private size: number;
  private count: number;
  private readonly LOAD_FACTOR = 0.75;  // rehash quando > 75% cheio

  constructor(initialSize = 16) {
    this.size = initialSize;
    this.count = 0;
    this.buckets = Array.from({ length: initialSize }, () => []);
  }

  // Função hash: converte chave para índice de bucket
  private hash(key: K): number {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  // Insert/update — O(1) amortizado
  set(key: K, value: V): void {
    if (this.count / this.size > this.LOAD_FACTOR) {
      this.rehash();  // rehash quando fator de carga excede threshold
    }
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const existing = bucket.find(([k]) => k === key);
    if (existing) {
      existing[1] = value;  // atualiza valor existente
    } else {
      bucket.push([key, value]);  // encadeia novo par no bucket
      this.count++;
    }
  }

  // Lookup — O(1) amortizado; O(n) pior caso (todas as chaves no mesmo bucket)
  get(key: K): V | undefined {
    const idx = this.hash(key);
    const pair = this.buckets[idx].find(([k]) => k === key);
    return pair?.[1];
  }

  // Deleção — O(1) amortizado
  delete(key: K): boolean {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const pos = bucket.findIndex(([k]) => k === key);
    if (pos === -1) return false;
    bucket.splice(pos, 1);
    this.count--;
    return true;
  }

  // Rehash: dobra o tamanho e reinsere todos os pares — O(n)
  // Ocorre com frequência decrescente → amortizado O(1) por insert
  private rehash(): void {
    const old = this.buckets;
    this.size *= 2;
    this.buckets = Array.from({ length: this.size }, () => []);
    this.count = 0;
    for (const bucket of old) {
      for (const [k, v] of bucket) this.set(k, v);
    }
  }

  loadFactor(): number { return this.count / this.size; }
}

// Complexidade: O(1) amortizado para get/set/delete
// Pior caso: O(n) se função hash mapear tudo para o mesmo bucket
// Fator de carga ideal: 0.6–0.75 (equilíbrio espaço × colisões)

const ht = new HashTable<string, number>();
ht.set("alice", 90);
ht.set("bob", 85);
ht.set("carol", 92);
console.log(ht.get("alice"));   // → 90
console.log(ht.get("dave"));    // → undefined
ht.delete("bob");
console.log(ht.loadFactor());   // → ~0.125 (2 itens em 16 buckets)`,
      },
    ],
    mindmap: {
      title: "Algoritmos & Estruturas de Dados — Mapa Mental",
      html: `<div style="background:#0a0a0a;padding:28px 22px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .ads2mm-center{text-align:center;margin-bottom:24px}
    .ads2mm-hub{display:inline-block;background:linear-gradient(135deg,#ef4444,#f87171);color:#fff;font-weight:800;font-size:14px;padding:12px 26px;border-radius:12px;letter-spacing:.5px;box-shadow:0 4px 24px rgba(239,68,68,.35)}
    .ads2mm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
    .ads2mm-branch{background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.20);border-radius:10px;padding:13px}
    .ads2mm-branch-title{font-weight:700;font-size:11px;color:#ef4444;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid rgba(239,68,68,.18);text-transform:uppercase;letter-spacing:.6px}
    .ads2mm-leaf{font-size:11px;color:#94a3b8;line-height:1.85;padding:1px 0}
    .ads2mm-leaf::before{content:'› ';color:#ef4444;font-weight:700}
    .ads2mm-leaf b{color:#fca5a5}
  </style>
  <div class="ads2mm-center">
    <div class="ads2mm-hub">ALGORITMOS &amp; ESTRUTURAS DE DADOS</div>
    <div style="color:#475569;font-size:11px;margin-top:7px">Estruturas → Algoritmos → Complexidade → Padrões de Entrevista</div>
  </div>
  <div style="text-align:center;color:#ef4444;font-size:20px;margin-bottom:10px">↓</div>
  <div class="ads2mm-grid">
    <div class="ads2mm-branch">
      <div class="ads2mm-branch-title">Estruturas Lineares</div>
      <div class="ads2mm-leaf"><b>Array</b> — acesso O(1), busca O(n)</div>
      <div class="ads2mm-leaf"><b>LinkedList</b> — insert O(1), acesso O(n)</div>
      <div class="ads2mm-leaf"><b>Stack</b> — LIFO, push/pop O(1)</div>
      <div class="ads2mm-leaf"><b>Queue</b> — FIFO, enqueue/dequeue O(1)</div>
      <div class="ads2mm-leaf"><b>Deque</b> — insert/delete nas duas pontas</div>
    </div>
    <div class="ads2mm-branch">
      <div class="ads2mm-branch-title">Estruturas Não-Lineares</div>
      <div class="ads2mm-leaf"><b>BST</b> — busca/insert O(log n) balanceada</div>
      <div class="ads2mm-leaf"><b>Heap</b> — peek O(1), insert/extract O(log n)</div>
      <div class="ads2mm-leaf"><b>Trie</b> — busca por prefixo O(m)</div>
      <div class="ads2mm-leaf"><b>Grafo</b> — vértices + arestas, O(V+E)</div>
      <div class="ads2mm-leaf"><b>Hash map</b> — get/set O(1) amortizado</div>
    </div>
    <div class="ads2mm-branch">
      <div class="ads2mm-branch-title">Algoritmos de Busca</div>
      <div class="ads2mm-leaf"><b>Linear</b> — O(n), sem pré-condição</div>
      <div class="ads2mm-leaf"><b>Binária</b> — O(log n), array ordenado</div>
      <div class="ads2mm-leaf"><b>BFS</b> — O(V+E), caminho mais curto</div>
      <div class="ads2mm-leaf"><b>DFS</b> — O(V+E), ciclo e topologia</div>
      <div class="ads2mm-leaf"><b>Dijkstra</b> — O((V+E) log V), pesos pos.</div>
    </div>
    <div class="ads2mm-branch">
      <div class="ads2mm-branch-title">Algoritmos de Ordenação</div>
      <div class="ads2mm-leaf"><b>Bubble/Selection</b> — O(n²), didático</div>
      <div class="ads2mm-leaf"><b>Insertion</b> — O(n²), ótimo para quase-ord.</div>
      <div class="ads2mm-leaf"><b>Merge Sort</b> — O(n log n) estável</div>
      <div class="ads2mm-leaf"><b>Quick Sort</b> — O(n log n) médio, in-place</div>
      <div class="ads2mm-leaf"><b>Heap Sort</b> — O(n log n), O(1) espaço</div>
    </div>
    <div class="ads2mm-branch">
      <div class="ads2mm-branch-title">Complexidade — Big-O</div>
      <div class="ads2mm-leaf"><b>O(1)</b> — hash, array index, push/pop</div>
      <div class="ads2mm-leaf"><b>O(log n)</b> — binary search, BST, heap</div>
      <div class="ads2mm-leaf"><b>O(n)</b> — scan, prefixo, sliding window</div>
      <div class="ads2mm-leaf"><b>O(n log n)</b> — merge/quick/heap sort</div>
      <div class="ads2mm-leaf"><b>O(n²)</b> — loop aninhado, bubble sort</div>
    </div>
    <div class="ads2mm-branch">
      <div class="ads2mm-branch-title">Padrões de Entrevista</div>
      <div class="ads2mm-leaf"><b>Two pointers</b> — array ordenado, par/trio</div>
      <div class="ads2mm-leaf"><b>Sliding window</b> — subarray contígua</div>
      <div class="ads2mm-leaf"><b>Prefix sum</b> — range query O(1)</div>
      <div class="ads2mm-leaf"><b>Union-Find</b> — componentes dinâmicos</div>
      <div class="ads2mm-leaf"><b>Backtracking</b> — todas as combinações</div>
    </div>
  </div>
</div>`,
      caption: "Reconheça a estrutura de dados correta antes de pensar no algoritmo. A escolha da DS determina a complexidade — hash map substitui O(n) search por O(1).",
    },
  }

export default algoritmoDs
