'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, DepRow, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion } from '@/components/pdfs/ComparativeRefPdf'

// ── Paleta Algoritmos & DS ─────────────────────────────────────────────────────
const C = '#06B6D4'

// ── Metadados dos PDFs ─────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista técnica',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: 20 perguntas de algoritmos e estruturas de dados — Big-O, dois ponteiros, janela deslizante, busca binária, BFS/DFS, heap, backtracking, Union-Find, trie — com resposta estruturada nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet de Complexidades',
    subtitle: 'Big-O de cada operação por estrutura de dados',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: complexidade de tempo e espaço de insert, delete, search e acesso para array, linked list, stack, queue, hash map, BST, heap e trie. O que todo dev precisa durante a entrevista.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos de Padrão',
    subtitle: 'Truques para reconhecer qual padrão aplicar',
    type: 'mnemonics',
    pages: 2,
    description: 'Mnemônicos de HASH (quando usar hash map), SLIDE (sliding window), BIPS (binary search), SOG (DP vs Greedy vs D&C) e outros truques verbais para reconhecimento rápido de padrão em entrevista.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns de Algoritmos',
    subtitle: 'Erros que geram TLE e bugs silenciosos',
    type: 'antipatterns',
    pages: 3,
    description: 'Os 5 anti-patterns mais comuns: O(n²) onde hash dá O(1), off-by-one em binary search, Array.shift() em BFS, DFS sem visited e modificar array durante iteração.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'comparative',
    title: 'Algoritmos de Ordenação',
    subtitle: 'Bubble vs Merge vs Quick vs Heap vs Radix',
    type: 'comparative',
    pages: 2,
    description: 'Tabela comparativa de algoritmos de ordenação com tempo médio, pior caso, espaço, estabilidade e cache-friendliness. Saber defender a escolha de Merge vs Quick é pergunta frequente de entrevista sênior.',
    icon: '05',
    goal: 'Tomada de decisão',
  },
]

// ── Dados: Q&A ─────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é Big-O notation e por que importa?',
    a: 'Big-O descreve como o tempo ou espaço de um algoritmo cresce em relação ao tamanho da entrada no pior caso (ou caso médio). Importa porque a diferença entre O(n) e O(n²) para n=10⁶ é a diferença entre milissegundos e horas.\n\nAs complexidades mais comuns:\n• O(1) — constante: array access, hash map get\n• O(log n) — logarítmico: binary search, heap insert\n• O(n) — linear: scan, BFS/DFS\n• O(n log n) — quase-linear: merge sort, heap sort\n• O(n²) — quadrático: bubble sort, nested loops\n• O(2ⁿ) — exponencial: recursão sem memo, subsets\n\nSenior também justifica espaço: O(1) extra (in-place), O(n) (hash map), O(log n) (call stack de recursão).',
    tip: 'Sempre mencione tempo E espaço. "O(n) tempo, O(1) espaço" — entrevistador percebe que você pensa nas duas dimensões.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar HashMap versus Array?',
    a: 'Use HashMap quando:\n• Precisa de lookup O(1) por chave arbitrária\n• Precisa contar frequência de elementos\n• Precisa verificar existência ("já vi esse elemento?")\n• Chave não é um índice inteiro sequencial\n\nUse Array quando:\n• Acessa por índice inteiro sequencial (0, 1, 2...)\n• Precisa de cache-friendliness (iteração sequencial é muito mais rápida por localidade de memória)\n• Tamanho é fixo e pequeno\n• Precisa manter ordem de inserção sem overhead de hash\n\nO erro mais comum: usar loop O(n) para busca onde Map resolveria em O(1).',
    tip: 'Mencione cache locality: arrays contíguos em memória são 5-10x mais rápidos para iterar que linked lists ou hash maps em benchmarks reais — mesmo sendo a mesma complexidade O(n).',
  },
  {
    level: 'Pleno',
    q: 'Explique o padrão Two Pointers e quando aplicar.',
    a: 'Two Pointers usa dois índices (l e r) que se movem em direção oposta ou na mesma direção para reduzir O(n²) para O(n).\n\nCasos de uso:\n• Array ordenado + par com soma alvo → l=0, r=n-1, convergem\n• Palíndromo → l=0, r=n-1, verificam chars\n• Remover duplicatas in-place → slow/fast pointers\n• Container with most water → l e r, move o menor\n\nTemplate básico:\n  let l = 0, r = n - 1\n  while (l < r) {\n    const sum = a[l] + a[r]\n    if (sum === target) return [l, r]\n    else if (sum < target) l++\n    else r--\n  }\n\nExige array ordenado (ou que a propriedade de monotonicidade valha).',
    tip: 'Sinais no enunciado: "array ordenado", "par com soma X", "palindrome", "remover duplicatas in-place". Se viu qualquer um, teste two pointers primeiro.',
  },
  {
    level: 'Pleno',
    q: 'O que é Sliding Window e como implementar?',
    a: 'Sliding Window mantém uma janela [l, r] sobre um array/string e a contrai/expande para encontrar subarray/substring contígua que satisfaça uma condição.\n\nDuas variantes:\n1. Janela de tamanho fixo: r avança, l avança junto. Use para "max sum subarray de tamanho k".\n2. Janela variável: r sempre avança; l avança quando invariante é violado. Use para "longest substring without repeat".\n\nTemplate variável:\n  let l = 0, maxLen = 0\n  const window = new Map()\n  for (let r = 0; r < s.length; r++) {\n    // adiciona s[r] na janela\n    while (invariante_violado) {\n      // remove s[l] da janela\n      l++\n    }\n    maxLen = Math.max(maxLen, r - l + 1)\n  }\n\nChave: O invariante da janela nunca deve ser violado após o while interno.',
    tip: 'Sinais: "subarray contíguo", "substring", "menor/maior X com condição". Distinguish de two pointers: sliding window mantém janela de elementos com uma propriedade; two pointers trabalha com pares específicos.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre BFS e DFS? Quando usar cada?',
    a: 'BFS (Breadth-First Search) explora nível por nível usando uma Queue. Garante caminho mais curto em grafo não-ponderado. Complexidade: O(V+E).\n\nDFS (Depth-First Search) explora fundo antes de voltar usando recursão ou Stack. Complexidade: O(V+E).\n\nBFS — quando usar:\n• Caminho mais curto entre dois nós (não ponderado)\n• Processamento nível a nível (árvore BFS level-order)\n• "Menor número de passos para transformar X em Y"\n\nDFS — quando usar:\n• Detecção de ciclo\n• Ordenação topológica\n• Backtracking e geração de combinações\n• DFS pós-ordem em árvore (altura, isBalanced)\n• Problemas onde precisa explorar todos os caminhos\n\nNão confunda: BFS usa Queue; DFS usa recursão (ou Stack explícita).',
    tip: '"Caminho mais curto" → BFS. "Existe caminho?" ou "todos os caminhos" → DFS. A maioria dos problemas de árvore aceita ambos, mas BFS level-order é mais natural para perguntas de nível.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona um Heap (min-heap / max-heap)?',
    a: 'Heap é uma árvore binária completa onde cada nó satisfaz a propriedade de heap: no min-heap, o pai é sempre ≤ filhos (raiz = mínimo global).\n\nImplementação com array: nó no índice i tem filhos em 2i+1 e 2i+2, e pai em (i-1)//2.\n\nOperações:\n• insert: adiciona no fim, heapify-up — O(log n)\n• extractMin: remove raiz, coloca último elemento na raiz, heapify-down — O(log n)\n• peek: raiz — O(1)\n• heapify (construir heap de n elementos): O(n)\n\nUso em entrevista:\n• Top-k elementos: min-heap de tamanho k, O(n log k)\n• Merge K listas ordenadas: heap com (valor, lista, índice)\n• Dijkstra: min-heap de (custo, nó)',
    tip: 'Em Python use heapq (min-heap nativo). Para max-heap negate os valores. Em JS não há heap nativa — implemente ou descreva a lógica com pseudocódigo.',
  },
  {
    level: 'Pleno',
    q: 'O que é Binary Search e quais são os erros mais comuns?',
    a: 'Binary Search encontra elemento em array ordenado em O(log n) dividindo o espaço de busca ao meio a cada passo.\n\nTemplate correto (hi inclusivo):\n  let lo = 0, hi = arr.length - 1\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1\n    if (arr[mid] === target) return mid\n    else if (arr[mid] < target) lo = mid + 1\n    else hi = mid - 1\n  }\n  return -1\n\nErros clássicos:\n• hi = arr.length (índice fora do array)\n• while (lo < hi) com hi inclusivo → perde o último elemento\n• mid = (lo + hi) / 2 sem inteiro → índice float → undefined\n• lo = mid (sem +1) → loop infinito quando lo=hi-1',
    tip: 'Decore UMA variante e mantenha absolutamente consistente. A variante hi-inclusivo com lo <= hi e lo=mid+1/hi=mid-1 é a mais segura.',
  },
  {
    level: 'Pleno',
    q: 'Explique Backtracking e como podá-lo eficientemente.',
    a: 'Backtracking é DFS exaustivo que faz uma escolha, recursiona, e desfaz a escolha ao retornar (undo). Gera todas as soluções possíveis.\n\nEstrutura geral:\n  function backtrack(start, path) {\n    if (condição_de_parada) { res.push([...path]); return }\n    for (const choice of candidates.slice(start)) {\n      path.push(choice)       // faz escolha\n      backtrack(next, path)   // recursão\n      path.pop()              // desfaz escolha\n    }\n  }\n\nPoda (pruning):\n• Soma já excede alvo → para de explorar\n• Candidatos restantes insuficientes → para\n• Estado já visitado → memo\n\nProblemas clássicos: combinations, permutations, subsets, N-queens, Sudoku.',
    tip: 'A linha path.pop() após a recursão é o "undo" que diferencia backtracking de DFS puro. Escreva "faz, recursiona, desfaz" como comentário antes de codar.',
  },
  {
    level: 'Pleno',
    q: 'O que é Prefix Sum e como resolve range queries em O(1)?',
    a: 'Prefix sum pré-computa somas acumuladas: prefix[i] = sum(arr[0..i-1]). Com isso, sum(l..r) = prefix[r+1] - prefix[l] em O(1).\n\nImplementação:\n  const prefix = [0]\n  for (const x of arr) prefix.push(prefix.at(-1) + x)\n  // sum(l..r) = prefix[r+1] - prefix[l]\n\nUsos além de range sum:\n• Subarray sum equals k: use hash map de prefix sums\n• 2D matrix sum: prefix[i][j] = acumulado 2D\n• "Número de subarrays com soma ≤ k": sliding window + prefix\n\nCusto: O(n) de pré-processamento, O(1) por query.',
    tip: 'Sempre inicialize prefix com [0] (prefixo vazio). Isso simplifica: sum(0..r) = prefix[r+1] - prefix[0] = prefix[r+1], sem if especial para l=0.',
  },
  {
    level: 'Pleno',
    q: 'Como detectar ciclo em grafo dirigido vs não-dirigido?',
    a: 'Grafo NÃO-DIRIGIDO:\n• DFS com visited Set: se vizinho já está visitado E não é o pai → ciclo.\n• Union-Find: se union(u,v) falhar (find(u) === find(v)) → ciclo.\n\nGrafo DIRIGIDO:\n• DFS com 3 cores: WHITE (não visitado), GRAY (na call stack), BLACK (concluído).\n• Se durante DFS você encontrar nó GRAY → há ciclo (back edge).\n• Alternativa: topological sort (Kahn). Se ao final nem todos os nós foram processados → ciclo.\n\nErro comum: usar apenas visited Set em grafo dirigido — isso detecta re-visita, não ciclo real.',
    tip: 'Em entrevista, grafo dirigido → DFS com GRAY/BLACK ou Kahn. Não-dirigido → DFS com "não é o pai" ou Union-Find.',
  },
  {
    level: 'Senior',
    q: 'Como implementar Dijkstra e qual sua complexidade?',
    a: 'Dijkstra encontra o menor caminho de um nó source para todos os outros em grafo com pesos não-negativos.\n\nAlgoritmo:\n1. dist[source] = 0, dist[outros] = ∞\n2. Min-heap com (dist, nó)\n3. A cada iteração: extrai o nó com menor dist do heap\n4. Para cada vizinho: se dist[atual] + peso < dist[vizinho], atualiza e insere no heap\n\nComplexidade: O((V + E) log V) com min-heap. Não funciona com pesos negativos — use Bellman-Ford.\n\nA linha "if (cost > dist[u]) continue" descarta entradas desatualizadas do heap (lazy deletion).',
    tip: 'Sem lazy deletion o algoritmo ainda funciona mas é mais lento. Com lazy deletion, garante que cada nó é processado no máximo uma vez.',
  },
  {
    level: 'Senior',
    q: 'O que é Union-Find (DSU) e quais são as otimizações?',
    a: 'Union-Find (Disjoint Set Union) mantém conjuntos disjuntos com duas operações: find(x) retorna o representante do conjunto de x; union(x,y) une os conjuntos de x e y.\n\nDuas otimizações:\n1. Path compression: ao navegar para a raiz, faz todos os nós apontarem diretamente para ela.\n   function find(x) {\n     if (parent[x] !== x) parent[x] = find(parent[x])\n     return parent[x]\n   }\n\n2. Union by rank: sempre une o conjunto menor sob o maior.\n\nCom ambas: quase O(1) amortizado por operação (O(α(n))).\n\nUsos: componentes conexos, cycle detection em grafo não-dirigido, Kruskal MST.',
    tip: 'Se union() retornar false (px === py), há ciclo. Isso resolve "redundant connection" em uma linha por aresta.',
  },
  {
    level: 'Senior',
    q: 'Como implementar uma Trie e para que serve?',
    a: 'Trie (árvore de prefixos) armazena strings onde cada nó representa um caractere e o caminho root→nó forma um prefixo.\n\nImplementação:\n  class TrieNode { children = {}; isEnd = false }\n  class Trie {\n    root = new TrieNode()\n    insert(word) {\n      let cur = this.root\n      for (const c of word) {\n        if (!cur.children[c]) cur.children[c] = new TrieNode()\n        cur = cur.children[c]\n      }\n      cur.isEnd = true\n    }\n  }\n\nComplexidade: O(m) por operação (m = comprimento da string).\n\nUsos: autocomplete, spell checker, IP routing (longest prefix match), word search em grid.',
    tip: 'Trie substitui sorted map para busca de prefixo: O(m) vs O(m log n). Em entrevista, mencionar Trie para qualquer problema de prefixo impressiona.',
  },
  {
    level: 'Senior',
    q: 'O que é ordenação topológica e como implementar?',
    a: 'Topological sort é uma ordenação linear dos vértices de um DAG onde, para toda aresta u→v, u aparece antes de v.\n\nDuas implementações:\n\n1. DFS pós-ordem: processa todos os filhos, depois adiciona ao stack. Reverso do stack = topological order.\n\n2. Kahn (BFS + in-degree):\n   Compute in-degree de cada nó. Inicialize queue com nós de in-degree 0.\n   A cada passo: remove da queue, reduz in-degree dos vizinhos, adiciona à queue se in-degree chegar a 0.\n   Se ao final nem todos foram processados → ciclo.\n\nComplexidade: O(V+E) ambos.\n\nAplicações: compiladores, task scheduling, build systems.',
    tip: 'Kahn é preferível em entrevista: detecta ciclo naturalmente e é mais fácil de explicar sem recursão.',
  },
  {
    level: 'Senior',
    q: 'Compare Merge Sort e Quick Sort — quando cada um vence?',
    a: 'Merge Sort:\n• O(n log n) garantido em todos os casos\n• Estável (preserva ordem de iguais)\n• O(n) espaço extra\n• Cache-unfriendly para arrays grandes\n\nQuick Sort:\n• O(n log n) esperado, O(n²) pior caso com pivot ruim\n• Não estável\n• O(log n) espaço (call stack) — in-place\n• Cache-friendly: opera no mesmo array\n• Na prática mais rápido que Merge por menor constante\n\nArray.sort() em JS/V8: TimSort (híbrido merge+insertion) — estável desde 2019.\nPython: TimSort. Java: dual-pivot quick sort para primitivos.',
    tip: '"Para n grande sem estabilidade, Quick Sort. Para dados externos, linked lists ou quando estabilidade é necessária, Merge Sort."',
  },
  {
    level: 'Senior',
    q: 'O que é LIS (Longest Increasing Subsequence) e como otimizar para O(n log n)?',
    a: 'LIS é a maior subsequência estritamente crescente de um array.\n\nO(n²) DP:\n  dp[i] = max length de LIS terminando em i\n  resposta = max(dp)\n\nO(n log n) com patience sorting:\n  tails[i] = menor elemento que termina LIS de comprimento i+1.\n  Para cada nums[k]: binary search para achar onde encaixar em tails.\n  Se nums[k] > tails.at(-1): extende LIS. Senão: substitui tails[pos].\n\n  const tails = []\n  for (const n of nums) {\n    let lo = 0, hi = tails.length\n    while (lo < hi) {\n      const mid = (lo + hi) >> 1\n      tails[mid] < n ? lo = mid + 1 : hi = mid\n    }\n    tails[lo] = n\n  }\n  return tails.length\n\nImportante: tails NÃO é a LIS real — seu comprimento é correto, mas os elementos podem ser substituídos.',
    tip: 'O(n log n) é esperado em entrevista sênior para n=10⁵. Mencionar que tails não é a LIS real demonstra domínio.',
  },
  {
    level: 'Senior',
    q: 'O que são Segment Trees e Fenwick Trees (BIT)?',
    a: 'Ambas resolvem range queries com updates em O(log n).\n\nFenwick Tree (BIT):\n• ~10 linhas de código\n• Suporta: prefix sum update e query — O(log n)\n• Não suporta: range min/max\n  update(i, delta): while i <= n: bit[i] += delta; i += i & (-i)\n  query(i): while i > 0: sum += bit[i]; i -= i & (-i)\n\nSegment Tree:\n• Mais complexa mas mais poderosa\n• Suporta range min, max, sum, GCD, XOR com lazy propagation\n• Constrói em O(n), query e update em O(log n)\n• Ideal para: "range minimum query", "range sum with point update"\n\nUse BIT para range sum simples. Use Segment Tree quando precisar de range min/max ou lazy propagation.',
    tip: 'Fenwick vale implementar de cor — são 10 linhas. Segment Tree: saber descrever a ideia já impressiona.',
  },
  {
    level: 'Senior',
    q: 'Como implementar Merge Sort do zero?',
    a: 'Merge Sort divide o array ao meio recursivamente e merge os sub-arrays ordenados.\n\n  function mergeSort(arr) {\n    if (arr.length <= 1) return arr\n    const mid = Math.floor(arr.length / 2)\n    const left  = mergeSort(arr.slice(0, mid))\n    const right = mergeSort(arr.slice(mid))\n    return merge(left, right)\n  }\n\n  function merge(left, right) {\n    const result = []\n    let i = 0, j = 0\n    while (i < left.length && j < right.length) {\n      if (left[i] <= right[j]) result.push(left[i++])\n      else result.push(right[j++])\n    }\n    return [...result, ...left.slice(i), ...right.slice(j)]\n  }\n\nComplexidade: T(n) = 2T(n/2) + O(n) → O(n log n) por Master Theorem.\nEspaço: O(n) pelo array auxiliar + O(log n) de call stack = O(n).',
    tip: 'A versão com slice cria arrays novos. Para economizar memória: implemente com índices e um buffer auxiliar pre-alocado.',
  },
  {
    level: 'Senior',
    q: 'Explique hashing, colisões e técnicas de resolução.',
    a: 'Uma hash function mapeia chaves para índices em uma tabela. Colisão ocorre quando duas chaves distintas mapeiam para o mesmo índice.\n\n1. Chaining: cada bucket é uma linked list. Load factor α = n/m. Rehash quando α > 0.75.\n   Pior caso: todas no mesmo bucket → O(n). Caso médio: O(1).\n\n2. Open addressing: colisão → procura próximo slot livre.\n   • Linear probing: slot+1, slot+2 (clustering)\n   • Quadratic: slot+1², slot+2² (melhor distribuição)\n   • Double hashing: usa segunda hash function\n   Deleção problemática (precisa de tombstone).\n\nLoad factor crítico em open addressing: < 0.5-0.7.\n\nJavaScript Map: usa hash table com chaining. Preserva ordem de inserção.',
    tip: '"Por que Map preserva ordem?" — JavaScript spec garante desde ES2015; internamente usa linked list sobre o hash table.',
  },
  {
    level: 'Senior',
    q: 'Como resolver "Number of Islands" — e quais variações cobram?',
    a: 'Number of Islands: dado grid de 0s e 1s, contar componentes conexos de 1s.\n\nSolução DFS:\n  let count = 0\n  for (let i = 0; i < rows; i++) {\n    for (let j = 0; j < cols; j++) {\n      if (grid[i][j] === "1") {\n        count++\n        dfs(grid, i, j)  // "afoga" a ilha\n      }\n    }\n  }\n  function dfs(grid, i, j) {\n    if (fora dos limites || grid[i][j] !== "1") return\n    grid[i][j] = "0"\n    dfs(grid, i+1, j); dfs(grid, i-1, j)\n    dfs(grid, i, j+1); dfs(grid, i, j-1)\n  }\n\nO(rows × cols). Variações:\n• Max area of island → conta tamanho durante DFS\n• Number of islands II → Union-Find dinâmico\n• Surrounded regions → DFS a partir das bordas',
    tip: '"Afundar" a ilha elimina a necessidade de visited Set separado. Se não pode modificar o grid, use Set de pares (i,j).',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Stack e Queue? Quando cada uma é necessária?',
    a: 'Stack (LIFO — Last In, First Out):\n• push/pop no mesmo extremo (topo)\n• Casos de uso: DFS iterativo, validação de parênteses, undo/redo, monotonic stack\n• Em JS: array com push()/pop()\n\nQueue (FIFO — First In, First Out):\n• enqueue em um extremo, dequeue no outro\n• Casos de uso: BFS, processamento em ordem, task scheduling\n• Em JS: array com push()/shift() — mas shift() é O(n)! Use head pointer.\n\nMonotonic Stack:\n• Mantém elementos em ordem crescente ou decrescente\n• Resolve "próximo elemento maior à direita" em O(n)\n• Problemas: largest rectangle, daily temperatures, trapping rain water\n\nDeque: insert/delete em ambos os extremos em O(1) — sliding window maximum.',
    tip: '"Qual estrutura para BFS?" → Queue. Mais sofisticado: "queue ou deque?" — quando precisa do máximo/mínimo da janela, deque monotônico é a resposta.',
  },
]

// ── Dados: Cheatsheet ──────────────────────────────────────────────────────────

const COMPLEXITY_HOOKS: HookItem[] = [
  { name: 'Array',          sig: 'access: O(1) | search: O(n) | insert-end: O(1)* | insert-mid: O(n)', desc: 'Acesso por índice, cache-friendly, push/pop na cauda' },
  { name: 'LinkedList',     sig: 'access: O(n) | insert@nó: O(1) | delete@nó: O(1)',                  desc: 'Insert/delete frequente dado ponteiro ao nó; LRU cache' },
  { name: 'HashMap',        sig: 'get/set/has/delete: O(1)* amortizado',                              desc: 'Lookup por chave, frequência, deduplicação, two sum' },
  { name: 'HashSet',        sig: 'add/has/delete: O(1)* amortizado',                                  desc: 'Existência de elemento, deduplicação, visited em BFS/DFS' },
  { name: 'Stack',          sig: 'push/pop/peek: O(1)',                                                desc: 'DFS, parênteses, undo/redo, monotonic stack' },
  { name: 'Queue',          sig: 'enqueue/dequeue: O(1) [com deque ou head pointer]',                 desc: 'BFS, processamento FIFO, task scheduling' },
  { name: 'Min/Max Heap',   sig: 'insert: O(log n) | extractMin: O(log n) | peek: O(1)',              desc: 'Top-k, Dijkstra, merge K listas, scheduling por prioridade' },
  { name: 'BST Balanceada', sig: 'search/insert/delete: O(log n) | min/max: O(log n)',                desc: 'Ordem + busca, range queries, árvore de busca dinâmica' },
  { name: 'Trie',           sig: 'insert/search/startsWith: O(m) m=len(string)',                      desc: 'Prefixo, autocomplete, spell checker, word search' },
  { name: 'Union-Find',     sig: 'find/union: O(α(n)) ≈ O(1)',                                        desc: 'Componentes conexos, cycle detection, Kruskal MST' },
]

const COMPLEXITY_DEP_ROWS: DepRow[] = [
  ['O(1)',      'Constante — hash map, array access, stack push/pop'],
  ['O(log n)',  'Logarítmico — binary search, heap insert, BST op'],
  ['O(n)',      'Linear — scan, BFS/DFS, two pointers, sliding window'],
  ['O(n log n)','Log-linear — merge/quick/heap sort'],
  ['O(n²)',     'Quadrático — nested loops, bubble sort — evitar para n > 10⁴'],
  ['O(2ⁿ)',     'Exponencial — recursão sem memo, subsets — n ≤ 20'],
]

const COMPLEXITY_RULES: RuleItem[] = [
  { ok: true,  t: 'Hash antes de loop: Se precisa de lookup, use Map/Set antes de iterar. O(1) vs O(n).' },
  { ok: false, t: 'shift() é O(n): Array.shift() em BFS → O(V² + VE). Use head pointer ou deque.' },
  { ok: true,  t: 'Binary search on answer: "Se X vale, X+1 também" → aplique binary search no espaço de respostas.' },
  { ok: false, t: 'Recursão = O(h) espaço: Call stack consome O(h). h = profundidade da recursão.' },
  { ok: true,  t: 'Heap sort é in-place: O(n log n) tempo, O(1) espaço — mas cache-unfriendly na prática.' },
  { ok: false, t: 'visited antes de enqueue: Em BFS, marque visited ao enfileirar, não ao desenfileirar — evita duplicatas.' },
]

// ── Dados: Mnemônicos ──────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'HASH — quando usar Hash Map',
    trick: 'HASH',
    expansion: [['H', 'Há lookup por chave?'], ['A', 'Acesso O(1) com Map'], ['S', 'Set para existência'], ['H', 'Hashtable antes de loop']],
    explanation: 'Qualquer pergunta "existe X?" ou "quantos X?" → HashMap antes de pensar em loop.',
    example: 'Two Sum: ao invés de dois loops O(n²), use Map para guardar complement em O(n).',
    why: 'Loop com includes/indexOf é O(n) por chamada. Map.has() é O(1). A diferença é TLE vs AC.',
  },
  {
    label: 'SLIDE — padrão Sliding Window',
    trick: 'SLIDE',
    expansion: [['S', 'Subarray/substring'], ['L', 'Left pointer'], ['I', 'Invariant que mantém'], ['D', 'Direita expande'], ['E', 'Encolhe quando invariant quebra']],
    explanation: 'Se o problema menciona subarray contíguo com condição, SLIDE.',
    example: 'Longest substring without repeat: janela [l,r] mantém chars únicos. l avança quando há duplicata.',
    why: 'Sliding window evita O(n²) de todas as subarrays testando só as que satisfazem o invariante.',
  },
  {
    label: 'BIPS — Binary Search',
    trick: 'BIPS',
    expansion: [['B', 'Buscou a variante correta?'], ['I', 'Igual? return mid'], ['P', 'Pequeno? lo = mid+1'], ['S', 'Se não: hi = mid-1']],
    explanation: 'Decore UMA variante e mantenha-a consistente. Off-by-one vem de misturar variantes.',
    example: 'hi-inclusivo: lo <= hi, lo=mid+1, hi=mid-1. Qualquer desvio → bug.',
    why: 'Binary search tem 3 variantes incompatíveis. Misturá-las causa loop infinito ou elemento perdido.',
  },
  {
    label: 'SOG — DP vs Greedy vs D&C',
    trick: 'SOG',
    expansion: [['S', 'Sobreposição de subproblemas → DP'], ['O', 'Ótima escolha local → Greedy'], ['G', 'Grande divisão independente → D&C']],
    explanation: 'Pergunte: "esse subproblema se repete?" Se sim → DP. Se local = global provável → Greedy. Se independentes → D&C.',
    example: 'Coin Change: greedy falha com [1,3,4], amount=6. DP acha 3+3=2; greedy dá 4+1+1=3.',
    why: 'Greedy funciona apenas quando existe prova de exchange argument. Na dúvida, use DP.',
  },
  {
    label: 'FADU — poda de Backtracking',
    trick: 'FADU',
    expansion: [['F', 'Faz escolha'], ['A', 'Avança na recursão'], ['D', 'Desfaz ao retornar'], ['U', 'Utiliza poda se impossível']],
    explanation: 'Sem o D (undo), o path acumula elementos incorretos. A poda reduz a constante exponencial.',
    example: 'Combinations: path.push(n) → backtrack() → path.pop(). Poda: if (n > target) return.',
    why: 'path.pop() é o "undo" que faz backtracking. Sem ele, o algoritmo é apenas DFS acumulativo.',
  },
  {
    label: 'FRENTE = Infinito, TRÁS = Um-só',
    trick: 'FRENTE/TRÁS',
    expansion: [['FRENTE', 'Loop crescente = unbounded (reutilizável)'], ['TRÁS', 'Loop reverso = 0/1 (usado uma vez)']],
    explanation: 'Em Knapsack 1D: direção do loop define se o item pode ser reutilizado. A diferença é apenas uma linha.',
    example: 'Coin Change (unbounded): for a from coin to amount. 0/1 Knapsack: for c from W down to w[i].',
    why: 'Inverter a direção gera bug silencioso: código roda mas produz resposta errada em casos específicos.',
  },
]

// ── Dados: Anti-patterns ───────────────────────────────────────────────────────

const ANTI_PATTERNS: AntiPatternItem[] = [
  {
    title: 'Loop O(n) onde Set daria O(1)',
    badDesc: 'Verificar duplicatas com includes/indexOf é O(n) por chamada — resulta em O(n²) total.',
    goodDesc: 'HashSet detecta duplicata em O(1) por elemento — O(n) total.',
    why: 'A causa mais comum de TLE em entrevista. Qualquer busca "existe X na lista?" com includes/indexOf é O(n). Com Set é O(1).',
    badCode: [
      { t: '// Verificar duplicatas — O(n²)', c: '#475569' },
      { t: '\nfor (let i = 0; i < arr.length; i++)', c: '#e2e8f0' },
      { t: '\n  for (let j = i+1; j < arr.length; j++)', c: '#ef4444' },
      { t: '\n    if (arr[i] === arr[j]) return true', c: '#ef4444' },
    ],
    goodCode: [
      { t: '// HashSet — O(n)', c: '#475569' },
      { t: '\nconst seen = new Set()', c: '#22c55e' },
      { t: '\nfor (const x of arr) {', c: '#e2e8f0' },
      { t: '\n  if (seen.has(x)) return true', c: '#22c55e' },
      { t: '\n  seen.add(x)', c: '#22c55e' },
      { t: '\n}', c: '#e2e8f0' },
    ],
  },
  {
    title: 'Binary search com off-by-one',
    badDesc: 'Misturar variantes de binary search causa loop infinito ou elementos perdidos.',
    goodDesc: 'Uma única variante consistente: hi inclusivo, lo <= hi, lo=mid+1, hi=mid-1.',
    why: 'Binary search tem 3 variantes; misturá-las causa loop infinito ou elementos perdidos. Escolha UMA e seja consistente.',
    badCode: [
      { t: '// Bug: hi fora do array + sem +1 no lo', c: '#475569' },
      { t: '\nlet lo = 0, hi = arr.length', c: '#ef4444' },
      { t: '\nwhile (lo < hi) {', c: '#e2e8f0' },
      { t: '\n  const mid = (lo + hi) / 2  // float!', c: '#ef4444' },
      { t: '\n  if (arr[mid] < target) lo = mid  // loop infinito', c: '#ef4444' },
      { t: '\n  else hi = mid', c: '#e2e8f0' },
      { t: '\n}', c: '#e2e8f0' },
    ],
    goodCode: [
      { t: '// Correto: hi inclusivo, lo=mid+1', c: '#475569' },
      { t: '\nlet lo = 0, hi = arr.length - 1', c: '#22c55e' },
      { t: '\nwhile (lo <= hi) {', c: '#22c55e' },
      { t: '\n  const mid = (lo + hi) >> 1  // inteiro', c: '#22c55e' },
      { t: '\n  if (arr[mid] === target) return mid', c: '#22c55e' },
      { t: '\n  if (arr[mid] < target) lo = mid + 1', c: '#22c55e' },
      { t: '\n  else hi = mid - 1', c: '#22c55e' },
      { t: '\n}', c: '#e2e8f0' },
    ],
  },
  {
    title: 'Array.shift() em BFS — O(n) dequeue',
    badDesc: 'shift() move todos os elementos — BFS O(V+E) vira O(V² + VE).',
    goodDesc: 'Head pointer: queue[head++] é O(1). BFS fica O(V+E).',
    why: 'shift() move todos os elementos → BFS O(V+E) vira O(V² + VE). Use head pointer ou biblioteca deque.',
    badCode: [
      { t: '// BFS com shift() — O(V² + VE)', c: '#475569' },
      { t: '\nconst queue = [start]', c: '#e2e8f0' },
      { t: '\nwhile (queue.length) {', c: '#e2e8f0' },
      { t: '\n  const node = queue.shift()  // O(n)!', c: '#ef4444' },
      { t: '\n  for (const nb of graph[node]) queue.push(nb)', c: '#e2e8f0' },
      { t: '\n}', c: '#e2e8f0' },
    ],
    goodCode: [
      { t: '// BFS com head pointer — O(V+E)', c: '#475569' },
      { t: '\nconst queue = [start]', c: '#e2e8f0' },
      { t: '\nlet head = 0', c: '#22c55e' },
      { t: '\nwhile (head < queue.length) {', c: '#22c55e' },
      { t: '\n  const node = queue[head++]  // O(1)', c: '#22c55e' },
      { t: '\n  for (const nb of graph[node]) queue.push(nb)', c: '#e2e8f0' },
      { t: '\n}', c: '#e2e8f0' },
    ],
  },
  {
    title: 'DFS em grafo sem Set de visitados',
    badDesc: 'Em grafo com ciclo, DFS sem visited entra em loop infinito e estoura a call stack.',
    goodDesc: 'Set de visited inicializado fora da recursão previne revisitas em O(1) por nó.',
    why: 'Em grafo com ciclo, DFS sem visited entra em loop infinito e estoura a call stack. Sempre inicialize o Set fora da recursão.',
    badCode: [
      { t: '// DFS sem visited → loop infinito em ciclos', c: '#475569' },
      { t: '\nfunction dfs(graph, node) {', c: '#e2e8f0' },
      { t: '\n  console.log(node)', c: '#e2e8f0' },
      { t: '\n  for (const nb of graph[node])', c: '#e2e8f0' },
      { t: '\n    dfs(graph, nb)  // revisita nós!', c: '#ef4444' },
      { t: '\n}', c: '#e2e8f0' },
    ],
    goodCode: [
      { t: '// DFS correto com visited Set', c: '#475569' },
      { t: '\nfunction dfs(graph, node, vis = new Set()) {', c: '#22c55e' },
      { t: '\n  if (vis.has(node)) return', c: '#22c55e' },
      { t: '\n  vis.add(node)', c: '#22c55e' },
      { t: '\n  console.log(node)', c: '#e2e8f0' },
      { t: '\n  for (const nb of graph[node])', c: '#e2e8f0' },
      { t: '\n    dfs(graph, nb, vis)', c: '#22c55e' },
      { t: '\n}', c: '#e2e8f0' },
    ],
  },
  {
    title: 'Modificar array durante iteração',
    badDesc: 'splice() durante for loop pula elementos — o índice não acompanha a remoção.',
    goodDesc: 'filter() cria novo array sem modificar o original; loop reverso é safe para splice().',
    why: 'splice() durante for loop pula elementos (índice não acompanha remoção). Filtre antes ou itere de trás para frente.',
    badCode: [
      { t: '// Pula elemento após splice', c: '#475569' },
      { t: '\nfor (let i = 0; i < arr.length; i++) {', c: '#e2e8f0' },
      { t: '\n  if (arr[i] % 2 === 0)', c: '#e2e8f0' },
      { t: '\n    arr.splice(i, 1)  // i não retrocede!', c: '#ef4444' },
      { t: '\n}', c: '#e2e8f0' },
    ],
    goodCode: [
      { t: '// filter (imutável)', c: '#475569' },
      { t: '\nconst result = arr.filter(x => x % 2 !== 0)', c: '#22c55e' },
      { t: '\n// ou loop reverso:', c: '#475569' },
      { t: '\nfor (let i = arr.length - 1; i >= 0; i--)', c: '#22c55e' },
      { t: '\n  if (arr[i] % 2 === 0) arr.splice(i, 1)', c: '#22c55e' },
    ],
  },
]

// ── Dados: Comparativo de Sorting ──────────────────────────────────────────────

const SORT_OPTIONS: CompOption[] = [
  { name: 'Merge Sort',  color: '#06B6D4' },
  { name: 'Quick Sort',  color: '#22c55e' },
  { name: 'Heap Sort',   color: '#f59e0b' },
  { name: 'Radix Sort',  color: '#a78bfa' },
  { name: 'Bubble Sort', color: '#ef4444' },
]

const SORT_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Pior caso',
    values: {
      'Merge Sort':  'O(n log n) sempre',
      'Quick Sort':  'O(n²) sem pivot rand',
      'Heap Sort':   'O(n log n) sempre',
      'Radix Sort':  'O(nk)',
      'Bubble Sort': 'O(n²)',
    },
    winner: 'Merge Sort',
  },
  {
    criterion: 'Espaço extra',
    values: {
      'Merge Sort':  'O(n) auxiliar',
      'Quick Sort':  'O(log n) call stack',
      'Heap Sort':   'O(1) in-place',
      'Radix Sort':  'O(n+k) buckets',
      'Bubble Sort': 'O(1) in-place',
    },
    winner: 'Heap Sort',
  },
  {
    criterion: 'Estável',
    values: {
      'Merge Sort':  'Sim',
      'Quick Sort':  'Não (padrão)',
      'Heap Sort':   'Não',
      'Radix Sort':  'Sim (LSD)',
      'Bubble Sort': 'Sim',
    },
    winner: 'Merge Sort',
  },
  {
    criterion: 'Cache friendly',
    values: {
      'Merge Sort':  'Razoável',
      'Quick Sort':  'Excelente',
      'Heap Sort':   'Ruim (acesso salteado)',
      'Radix Sort':  'Depende da impl',
      'Bubble Sort': 'Excelente',
    },
    winner: 'Quick Sort',
  },
  {
    criterion: 'Usar quando',
    values: {
      'Merge Sort':  'Estabilidade, dados externos, linked list',
      'Quick Sort':  'Perf prática, n grande, sem estabilidade',
      'Heap Sort':   'Garantia worst-case, in-place obrigatório',
      'Radix Sort':  'Chaves numéricas, n muito grande',
      'Bubble Sort': 'Apenas didático ou n ≤ 50',
    },
  },
]

// ── Builders ───────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Algoritmos & Estruturas de Dados',
    stackLabel: 'Ciência da Computação',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Algoritmos & DS',
    accentColor: C,
    stackLabel: 'Ciência da Computação',
    sections: {
      hooks: COMPLEXITY_HOOKS,
      depRows: COMPLEXITY_DEP_ROWS,
      rules: COMPLEXITY_RULES,
      performanceTips: [
        'Para n > 10⁶, qualquer loop O(n²) vai dar TLE — pense em hash map ou dois ponteiros.',
        'BFS caminho mais curto não ponderado. DFS todos os caminhos / ciclos / componentes.',
        'Heap top-k: min-heap de tamanho k — O(n log k) ao invés de O(n log n) com sort.',
        'Prefixo sum pré-processamento O(n) → query O(1). Trade-off espaço-tempo clássico.',
        'Union-Find com path compression + rank: quase O(1) por operação amortizado.',
      ],
      patterns: [
        { name: 'Two Pointers', code: 'let l=0, r=n-1; while(l<r) { ...converge... }', desc: 'Array ordenado, pares, palíndromo' },
        { name: 'Sliding Window', code: 'let l=0; for r in range: window; while violated: l++', desc: 'Subarray/substring contígua com condição' },
        { name: 'BFS', code: 'queue=[start]; while queue: node=queue.shift(); add neighbors', desc: 'Caminho mais curto, nível a nível' },
        { name: 'Binary Search', code: 'lo=0,hi=n-1; while lo<=hi: mid=(lo+hi)>>1', desc: 'Array ordenado, espaço monotônico' },
      ],
      mentalModels: [
        'Vejo lookup/existência → Map/Set antes de loop',
        'Vejo "mais curto" → BFS',
        'Vejo subarray contíguo com condição → Sliding Window',
        'Vejo array ordenado + busca → Binary Search',
        'Vejo todos os caminhos/combinações → Backtracking com DFS',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Algoritmos & Estruturas de Dados',
    stackLabel: 'Padrões de Entrevista',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTI_PATTERNS,
    accentColor: C,
    skillName: 'Algoritmos & DS',
    stackLabel: 'Erros Comuns',
  }),
  comparative: () => buildComparativeRefPdf({
    options: SORT_OPTIONS,
    criteria: SORT_CRITERIA,
    skillName: 'Algoritmos de Ordenação',
    accentColor: C,
    stackLabel: 'Trade-offs de Algoritmos',
    scenarios: [
      { scenario: 'Dados com estabilidade necessária', recommendation: 'Merge Sort', reason: 'Único estável com O(n log n) garantido.' },
      { scenario: 'Performance prática (n > 10⁴)', recommendation: 'Quick Sort', reason: 'Melhor constante, cache-friendly, pivot aleatório evita O(n²).' },
      { scenario: 'Garantia de worst-case + in-place', recommendation: 'Heap Sort', reason: 'O(n log n) garantido sem O(n) extra.' },
      { scenario: 'Chaves numéricas inteiras, n enorme', recommendation: 'Radix Sort', reason: 'O(nk) com k pequeno bate O(n log n) assintoticamente.' },
    ],
  }),
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function AlgoritmosDsPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)
  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />
        ))}
      </div>
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
