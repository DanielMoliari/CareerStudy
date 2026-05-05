import type { SkillContent } from "@/types"

const grafos: SkillContent = {
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
  }

export default grafos
