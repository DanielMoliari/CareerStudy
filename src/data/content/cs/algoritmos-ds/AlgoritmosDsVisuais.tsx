'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { BigOChart } from '@/components/visuals/BigOChart'
import type { AlgorithmEntry } from '@/components/visuals/BigOChart'
import { HeatMap } from '@/components/visuals/HeatMap'
import type { HeatCell, HeatRowGroup } from '@/components/visuals/HeatMap'
import { DataStructureAnimator } from '@/components/visuals/DataStructureAnimator'
import type { DSExample } from '@/components/visuals/DataStructureAnimator'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'

// ── Paleta Algoritmos & DS ────────────────────────────────────────────────────
const C      = '#06B6D4'   // ciano — estruturas de dados
const C2     = '#0891b2'   // ciano escuro
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Big-O Chart: curvas de complexidade com algoritmos marcados
// ═══════════════════════════════════════════════════════════════════════════════

const BIG_O_ALGORITHMS: AlgorithmEntry[] = [
  { id: 'array-access',      label: 'Array access',          timeComplexity: 'O(1)',        spaceComplexity: 'O(1)',      category: 'Estruturas' },
  { id: 'hashmap-get',       label: 'HashMap get/set',       timeComplexity: 'O(1)',        spaceComplexity: 'O(n)',      category: 'Estruturas' },
  { id: 'binary-search',     label: 'Binary Search',         timeComplexity: 'O(log n)',    spaceComplexity: 'O(1)',      category: 'Busca' },
  { id: 'bst-balanced',      label: 'BST busca (balanceada)',timeComplexity: 'O(log n)',    spaceComplexity: 'O(h)',      category: 'Busca' },
  { id: 'array-linear',      label: 'Array linear scan',     timeComplexity: 'O(n)',        spaceComplexity: 'O(1)',      category: 'Busca' },
  { id: 'linkedlist-search', label: 'LinkedList busca',      timeComplexity: 'O(n)',        spaceComplexity: 'O(1)',      category: 'Estruturas' },
  { id: 'two-pointers',      label: 'Two pointers',          timeComplexity: 'O(n)',        spaceComplexity: 'O(1)',      category: 'Padrões' },
  { id: 'sliding-window',    label: 'Sliding window',        timeComplexity: 'O(n)',        spaceComplexity: 'O(k)',      category: 'Padrões' },
  { id: 'merge-sort',        label: 'Merge Sort',            timeComplexity: 'O(n log n)',  spaceComplexity: 'O(n)',      category: 'Ordenação' },
  { id: 'heap-sort',         label: 'Heap Sort',             timeComplexity: 'O(n log n)',  spaceComplexity: 'O(1)',      category: 'Ordenação' },
  { id: 'quick-sort',        label: 'Quick Sort (avg)',       timeComplexity: 'O(n log n)',  spaceComplexity: 'O(log n)', category: 'Ordenação' },
  { id: 'bfs-dfs',           label: 'BFS / DFS',             timeComplexity: 'O(V+E)',      spaceComplexity: 'O(V)',      category: 'Grafos' },
  { id: 'bubble-sort',       label: 'Bubble Sort',           timeComplexity: 'O(n²)',       spaceComplexity: 'O(1)',      category: 'Ordenação' },
  { id: 'selection-sort',    label: 'Selection Sort',        timeComplexity: 'O(n²)',       spaceComplexity: 'O(1)',      category: 'Ordenação' },
  { id: 'naive-string',      label: 'Naive string search',   timeComplexity: 'O(n²)',       spaceComplexity: 'O(1)',      category: 'Busca' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — HeatMap de complexidade por estrutura × operação
// ═══════════════════════════════════════════════════════════════════════════════

const DS_ROWS = [
  'Array (dinâmico)',
  'LinkedList (simples)',
  'Stack',
  'Queue',
  'HashMap',
  'HashSet',
  'BST (não balanceada)',
  'BST (AVL/Red-Black)',
  'Min/Max Heap',
  'Trie',
]

const DS_COLS = ['Acesso', 'Busca', 'Inserção início', 'Inserção fim', 'Deleção', 'Min/Max']

// 0=O(1) 1=O(log n) 2=O(n) 3=O(n log n)  — escala de 0..3
const DS_DATA: HeatCell[][] = [
  // Array dinâmico
  [{ value: 0, note: 'O(1) por índice' }, { value: 2, note: 'O(n) linear scan' }, { value: 2, note: 'O(n) shift' }, { value: 0, note: 'O(1) amortizado' }, { value: 2, note: 'O(n) shift' }, { value: 2, note: 'O(n) scan' }],
  // LinkedList
  [{ value: 2, note: 'O(n) percorre nós' }, { value: 2, note: 'O(n) linear scan' }, { value: 0, note: 'O(1) sem percorrer' }, { value: 2, note: 'O(n) chegar ao fim' }, { value: 2, note: 'O(n) sem ref ao nó' }, { value: 2, note: 'O(n) scan' }],
  // Stack
  [{ value: 0, note: 'O(1) topo direto' }, { value: 2, note: 'O(n) sem hash' }, { value: 0, note: 'N/A — push/pop topo' }, { value: 0, note: 'O(1) push' }, { value: 0, note: 'O(1) pop' }, { value: 2, note: 'O(n) scan' }],
  // Queue
  [{ value: 0, note: 'O(1) frente/fim' }, { value: 2, note: 'O(n) linear' }, { value: 0, note: 'O(1) enqueue' }, { value: 0, note: 'O(1) enqueue fim' }, { value: 0, note: 'O(1) dequeue' }, { value: 2, note: 'O(n) scan' }],
  // HashMap
  [{ value: 0, note: 'O(1) amortizado' }, { value: 0, note: 'O(1) por chave' }, { value: 0, note: 'O(1) amortizado' }, { value: 0, note: 'O(1) amortizado' }, { value: 0, note: 'O(1) amortizado' }, { value: 2, note: 'O(n) sem ordenação' }],
  // HashSet
  [{ value: 0, note: 'O(1) amortizado' }, { value: 0, note: 'O(1) por elemento' }, { value: 0, note: 'O(1) amortizado' }, { value: 0, note: 'O(1) amortizado' }, { value: 0, note: 'O(1) amortizado' }, { value: 2, note: 'O(n) sem ordenação' }],
  // BST não balanceada
  [{ value: 2, note: 'O(n) pior caso (lista)' }, { value: 2, note: 'O(n) pior caso' }, { value: 2, note: 'O(n) pior caso' }, { value: 2, note: 'O(n) pior caso' }, { value: 2, note: 'O(n) pior caso' }, { value: 2, note: 'O(n) mais à esq/dir' }],
  // BST balanceada
  [{ value: 1, note: 'O(log n) garantido' }, { value: 1, note: 'O(log n) garantido' }, { value: 1, note: 'O(log n) + rotate' }, { value: 1, note: 'O(log n) + rotate' }, { value: 1, note: 'O(log n) + rotate' }, { value: 1, note: 'O(log n) no mais esq/dir' }],
  // Min/Max Heap
  [{ value: 2, note: 'O(n) sem índice' }, { value: 2, note: 'O(n) geral; O(1) min/max' }, { value: 1, note: 'O(log n) heapify up' }, { value: 1, note: 'O(log n) heapify up' }, { value: 1, note: 'O(log n) heapify down' }, { value: 0, note: 'O(1) topo do heap' }],
  // Trie
  [{ value: 0, note: 'O(k) k=len da chave' }, { value: 0, note: 'O(k) prefixo' }, { value: 0, note: 'O(k) por char' }, { value: 0, note: 'O(k) por char' }, { value: 0, note: 'O(k) por char' }, { value: 2, note: 'N/A — sem min/max intrínseco' }],
]

const DS_ROW_GROUPS: HeatRowGroup[] = [
  { label: 'Lineares', rows: ['Array (dinâmico)', 'LinkedList (simples)', 'Stack', 'Queue'] },
  { label: 'Hash', rows: ['HashMap', 'HashSet'] },
  { label: 'Árvores', rows: ['BST (não balanceada)', 'BST (AVL/Red-Black)', 'Min/Max Heap', 'Trie'] },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — DataStructureAnimator: Array interativo
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Árvore de decisão: qual estrutura usar?
// ═══════════════════════════════════════════════════════════════════════════════

const DS_DECISION_ROOT: DTNode = {
  id: 'root',
  question: 'Que operação é mais crítica no seu problema?',
  children: [
    { label: 'Lookup por chave / existência', nodeId: 'hash-branch', color: C },
    { label: 'Ordem / min / max', nodeId: 'order-branch', color: AMB },
    { label: 'Acesso por índice / posição', nodeId: 'index-branch', color: GRN },
    { label: 'Conectividade / vizinhos', nodeId: 'graph-branch', color: PRP },
    { label: 'Prefixo / autocomplete', nodeId: 'prefix-branch', color: RED },
  ],
}

const DS_DECISION_NODES: Record<string, DTNode> = {
  'hash-branch': {
    id: 'hash-branch',
    question: 'Precisa de ordem nos elementos?',
    children: [
      { label: 'Não — só lookup', nodeId: 'hashmap-end', color: GRN },
      { label: 'Sim — iterar em ordem', nodeId: 'sorted-map-end', color: AMB },
    ],
  },
  'hashmap-end': {
    id: 'hashmap-end',
    recommendation: 'HashMap / HashSet',
    detail: 'O(1) médio para get/set/has. Use Map para pares chave-valor, Set para deduplicação ou verificação de existência. Cuidado com colisões em chaves de objeto (use strings ou primitivos como chave).',
    color: C,
    icon: '🗂️',
  },
  'sorted-map-end': {
    id: 'sorted-map-end',
    recommendation: 'BST Balanceada (TreeMap) ou Array Ordenado',
    detail: 'O(log n) para busca/inserção/deleção com ordem garantida. Em JS nativo use array + sort; para hot paths use uma biblioteca como avl ou sorted-btree. Python tem SortedList (sortedcontainers).',
    color: AMB,
    icon: '🌳',
  },
  'order-branch': {
    id: 'order-branch',
    question: 'Precisa acessar min/max repetidamente (com inserções)?',
    children: [
      { label: 'Sim — hot path de min/max', nodeId: 'heap-end', color: AMB },
      { label: 'Não — só ordenação pontual', nodeId: 'sort-end', color: FGMUTE },
    ],
  },
  'heap-end': {
    id: 'heap-end',
    recommendation: 'Min-Heap ou Max-Heap (Priority Queue)',
    detail: 'O(log n) insert, O(1) peek, O(log n) extractMin/Max. Ideal para dijkstra, k menores elementos, merge de k listas ordenadas, scheduling. Em JS: use uma biblioteca heap (ou implemente com array).',
    color: AMB,
    icon: '⛰️',
  },
  'sort-end': {
    id: 'sort-end',
    recommendation: 'Array + sort() pontual',
    detail: 'Se a ordenação é esporádica (não em hot loop), Array.sort() O(n log n) é suficiente e simples. Evite over-engenharia com heap quando a lista raramente muda.',
    color: GRN,
    icon: '📋',
  },
  'index-branch': {
    id: 'index-branch',
    question: 'Inserções/deleções no meio são frequentes?',
    children: [
      { label: 'Não — leitura dominante', nodeId: 'array-end', color: C },
      { label: 'Sim — mutações frequentes no meio', nodeId: 'linkedlist-end', color: PRP },
    ],
  },
  'array-end': {
    id: 'array-end',
    recommendation: 'Array Dinâmico',
    detail: 'O(1) acesso por índice. O(1) amortizado push/pop na cauda. Cache-friendly (contíguo em memória). A estrutura padrão para 90% dos casos. Evite inserção/deleção no meio — é O(n).',
    color: C,
    icon: '📦',
  },
  'linkedlist-end': {
    id: 'linkedlist-end',
    recommendation: 'LinkedList Duplamente Encadeada',
    detail: 'O(1) inserção/deleção dado o nó (sem mover elementos). O(n) busca. Use quando: LRU cache (com HashMap → ponteiro para nó), deque, ou problema exige inserção em posição arbitrária com alta frequência.',
    color: PRP,
    icon: '🔗',
  },
  'graph-branch': {
    id: 'graph-branch',
    question: 'O grafo é denso (E ≈ V²) ou esparso (E ≈ V)?',
    children: [
      { label: 'Esparso — poucos vizinhos', nodeId: 'adjlist-end', color: GRN },
      { label: 'Denso — muitas arestas', nodeId: 'adjmatrix-end', color: RED },
    ],
  },
  'adjlist-end': {
    id: 'adjlist-end',
    recommendation: 'Lista de Adjacência (Array de listas / HashMap)',
    detail: 'O(V + E) espaço. Ideal para BFS/DFS em grafos esparsos (redes sociais, mapas). Em JS: Map<nó, nó[]>. A representação padrão em entrevista.',
    color: GRN,
    icon: '📌',
  },
  'adjmatrix-end': {
    id: 'adjmatrix-end',
    recommendation: 'Matriz de Adjacência',
    detail: 'O(V²) espaço. O(1) verificar aresta. Ideal para grafos densos onde queries de aresta são frequentes ou algoritmos de DP em grafo (Floyd-Warshall). Não use para grafos com V > 10⁴.',
    color: RED,
    icon: '⬛',
  },
  'prefix-branch': {
    id: 'prefix-branch',
    recommendation: 'Trie (Árvore de Prefixos)',
    detail: 'O(k) para insert/search onde k = comprimento da string. Ideal para autocomplete, spell checker, IP routing. Cada nó representa um caractere; nó com isEnd=true marca palavra completa.',
    color: RED,
    icon: '🔤',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — ComparisonTable: algoritmos de ordenação
// ═══════════════════════════════════════════════════════════════════════════════

const SORT_OPTIONS: ComparisonOption[] = [
  { id: 'bubble',    label: 'Bubble Sort',  sublabel: 'O(n²)',       color: RED },
  { id: 'merge',     label: 'Merge Sort',   sublabel: 'O(n log n)',  color: GRN },
  { id: 'quick',     label: 'Quick Sort',   sublabel: 'O(n log n)',  color: C },
  { id: 'heap',      label: 'Heap Sort',    sublabel: 'O(n log n)',  color: AMB },
  { id: 'radix',     label: 'Radix Sort',   sublabel: 'O(nk)',       color: PRP },
]

const SORT_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'time-avg',
    label: 'Tempo médio',
    category: 'Complexidade',
    description: 'Complexidade de tempo no caso médio',
    values: {
      bubble: { rating: 'poor',      note: 'O(n²)' },
      merge:  { rating: 'excellent', note: 'O(n log n) garantido' },
      quick:  { rating: 'excellent', note: 'O(n log n) esperado' },
      heap:   { rating: 'excellent', note: 'O(n log n) garantido' },
      radix:  { rating: 'excellent', note: 'O(nk) — k dígitos' },
    },
  },
  {
    id: 'time-worst',
    label: 'Pior caso',
    category: 'Complexidade',
    description: 'Complexidade de tempo no pior caso',
    values: {
      bubble: { rating: 'poor',      note: 'O(n²)' },
      merge:  { rating: 'excellent', note: 'O(n log n)' },
      quick:  { rating: 'fair',      note: 'O(n²) sem pivot rand' },
      heap:   { rating: 'excellent', note: 'O(n log n)' },
      radix:  { rating: 'good',      note: 'O(nk)' },
    },
  },
  {
    id: 'space',
    label: 'Espaço extra',
    category: 'Complexidade',
    description: 'Memória auxiliar necessária',
    values: {
      bubble: { rating: 'excellent', note: 'O(1) in-place' },
      merge:  { rating: 'fair',      note: 'O(n) array auxiliar' },
      quick:  { rating: 'good',      note: 'O(log n) call stack' },
      heap:   { rating: 'excellent', note: 'O(1) in-place' },
      radix:  { rating: 'fair',      note: 'O(n+k) buckets' },
    },
  },
  {
    id: 'stable',
    label: 'Estável',
    category: 'Propriedades',
    description: 'Preserva ordem de elementos iguais',
    values: {
      bubble: { rating: 'excellent', note: 'Sim' },
      merge:  { rating: 'excellent', note: 'Sim' },
      quick:  { rating: 'poor',      note: 'Não (padrão)' },
      heap:   { rating: 'poor',      note: 'Não' },
      radix:  { rating: 'excellent', note: 'Sim (LSD)' },
    },
  },
  {
    id: 'cache',
    label: 'Cache friendly',
    category: 'Propriedades',
    description: 'Aproveita localidade de cache da CPU',
    values: {
      bubble: { rating: 'excellent', note: 'Array contíguo' },
      merge:  { rating: 'good',      note: 'Array auxiliar' },
      quick:  { rating: 'excellent', note: 'In-place, bom locality' },
      heap:   { rating: 'poor',      note: 'Acesso não sequencial' },
      radix:  { rating: 'fair',      note: 'Depende da implementação' },
    },
  },
  {
    id: 'use-when',
    label: 'Usar quando',
    category: 'Prática',
    description: 'Caso de uso ideal',
    values: {
      bubble: { rating: 'poor',      note: 'Apenas didático ou n≤50' },
      merge:  { rating: 'excellent', note: 'Estabilidade necessária, merge externo, n grande' },
      quick:  { rating: 'excellent', note: 'Performance prática, n grande, sem estabilidade' },
      heap:   { rating: 'good',      note: 'Garantia worst-case, in-place obrigatório' },
      radix:  { rating: 'good',      note: 'Chaves numéricas ou strings, n muito grande' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — CodeStepper: Two Pointers passo a passo
// ═══════════════════════════════════════════════════════════════════════════════

const TWO_POINTERS_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'two-sum-sorted',
    label: 'Two Sum (array ordenado)',
    language: 'javascript',
    code: `function twoSum(nums, target) {
  let l = 0
  let r = nums.length - 1

  while (l < r) {
    const sum = nums[l] + nums[r]

    if (sum === target) {
      return [l, r]
    } else if (sum < target) {
      l++
    } else {
      r--
    }
  }
  return []
}

// Entrada: nums=[2,7,11,15], target=9`,
    steps: [
      {
        lineStart: 2,
        lineEnd: 3,
        title: 'Inicialização dos ponteiros',
        explanation: 'l aponta pro início, r pro fim. Com array ordenado podemos raciocinar: soma pequena → mova l para direita; soma grande → mova r para esquerda.',
        memory: { l: '0', r: '3', 'nums[l]': '2', 'nums[r]': '15' },
      },
      {
        lineStart: 5,
        lineEnd: 6,
        title: 'Primeira iteração — soma = 17',
        explanation: 'sum = 2 + 15 = 17 > target(9). Soma grande demais → reduzir r.',
        memory: { l: '0', r: '3', sum: '17', target: '9' },
        output: 'sum(17) > target(9) → r--',
      },
      {
        lineStart: 11,
        lineEnd: 11,
        title: 'Mover ponteiro direito',
        explanation: 'r vira 2. Agora nums[r] = 11.',
        memory: { l: '0', r: '2', 'nums[l]': '2', 'nums[r]': '11' },
      },
      {
        lineStart: 5,
        lineEnd: 6,
        title: 'Segunda iteração — soma = 13',
        explanation: 'sum = 2 + 11 = 13 > target(9). Ainda grande → r--.',
        memory: { l: '0', r: '2', sum: '13', target: '9' },
        output: 'sum(13) > target(9) → r--',
      },
      {
        lineStart: 11,
        lineEnd: 11,
        title: 'Mover ponteiro direito novamente',
        explanation: 'r vira 1. nums[r] = 7.',
        memory: { l: '0', r: '1', 'nums[l]': '2', 'nums[r]': '7' },
      },
      {
        lineStart: 5,
        lineEnd: 8,
        title: 'Terceira iteração — ACHOU!',
        explanation: 'sum = 2 + 7 = 9 === target. Retorna [0, 1]. Complexidade: O(n) tempo, O(1) espaço.',
        memory: { l: '0', r: '1', sum: '9', target: '9' },
        output: '✓ Encontrado! Retorna [0, 1]',
      },
    ],
  },
  {
    id: 'sliding-window',
    label: 'Sliding Window (max substring)',
    language: 'javascript',
    code: `function lengthOfLongestSubstring(s) {
  const window = new Map()
  let l = 0
  let maxLen = 0

  for (let r = 0; r < s.length; r++) {
    const char = s[r]

    while (window.has(char)) {
      window.delete(s[l])
      l++
    }

    window.set(char, r)
    maxLen = Math.max(maxLen, r - l + 1)
  }
  return maxLen
}

// Entrada: s = "abcab"`,
    steps: [
      {
        lineStart: 2,
        lineEnd: 4,
        title: 'Estado inicial',
        explanation: 'window guarda chars da janela atual. l=0 (início da janela), maxLen=0. A janela se expande para a direita com r e contrai pela esquerda com l quando há repetição.',
        memory: { l: '0', r: '-', maxLen: '0', window: '{}' },
      },
      {
        lineStart: 6,
        lineEnd: 15,
        title: 'r=0 → char="a"',
        explanation: '"a" não está na janela. Insere. maxLen = max(0, 0-0+1) = 1.',
        memory: { l: '0', r: '0', char: '"a"', maxLen: '1', window: '{a:0}' },
      },
      {
        lineStart: 6,
        lineEnd: 15,
        title: 'r=1,2 → "b","c"',
        explanation: '"b" e "c" não estão na janela. Janela cresce para {a,b,c}. maxLen = 3.',
        memory: { l: '0', r: '2', maxLen: '3', window: '{a,b,c}' },
      },
      {
        lineStart: 9,
        lineEnd: 12,
        title: 'r=3 → char="a" (repetição!)',
        explanation: '"a" já está na janela. Contrai: remove s[0]="a", l++. Janela vira {b,c}.',
        memory: { l: '1', r: '3', char: '"a"', maxLen: '3', window: '{b,c}' },
        output: 'Colisão detectada → encolhe janela pela esquerda',
      },
      {
        lineStart: 13,
        lineEnd: 14,
        title: 'Insere "a" de novo',
        explanation: 'Janela = {b,c,a}. maxLen = max(3, 3-1+1) = 3. Tamanho mantido.',
        memory: { l: '1', r: '3', maxLen: '3', window: '{b,c,a}' },
      },
      {
        lineStart: 6,
        lineEnd: 15,
        title: 'r=4 → char="b" (repetição!)',
        explanation: '"b" já está. Remove s[1]="b", l=2. Janela={c,a}. Insere "b" → {c,a,b}. maxLen = 3.',
        memory: { l: '2', r: '4', char: '"b"', maxLen: '3', window: '{c,a,b}' },
        output: 'Resposta final: 3 ("abc" ou "cab")',
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns de estruturas de dados e algoritmos
// ═══════════════════════════════════════════════════════════════════════════════

const DS_ANTI_PATTERNS: AntiPattern[] = [
  {
    title: 'Busca O(n) onde HashMap daria O(1)',
    wrong: [
      [{ text: '// Verificar duplicatas em array — O(n²)', color: '#475569' }],
      [{ text: 'function hasDuplicate(arr) {', color: FG }],
      [{ text: '  for (let i = 0; i < arr.length; i++) {', color: FG }],
      [{ text: '    for (let j = i + 1; j < arr.length; j++) {', color: RED }],
      [{ text: '      if (arr[i] === arr[j]) return true', color: RED }],
      [{ text: '    }', color: FG }],
      [{ text: '  }', color: FG }],
      [{ text: '  return false', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// HashSet reduz para O(n)', color: '#475569' }],
      [{ text: 'function hasDuplicate(arr) {', color: FG }],
      [{ text: '  const seen = new Set()', color: GRN }],
      [{ text: '  for (const x of arr) {', color: FG }],
      [{ text: '    if (seen.has(x)) return true', color: GRN }],
      [{ text: '    seen.add(x)', color: GRN }],
      [{ text: '  }', color: FG }],
      [{ text: '  return false', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'Loop aninhado é a causa mais comum de TLE (Time Limit Exceeded) em entrevista. Sempre pergunte: "preciso de lookup? Um Set/Map não resolveria em O(1)?"',
  },
  {
    title: 'Usar índice como índice de array (off-by-one em binary search)',
    wrong: [
      [{ text: '// Bug clássico: condição errada → loop infinito', color: '#475569' }],
      [{ text: 'function binarySearch(arr, target) {', color: FG }],
      [{ text: '  let lo = 0, hi = arr.length', color: RED }],
      [{ text: '  while (lo < hi) {', color: FG }],
      [{ text: '    const mid = (lo + hi) / 2  // não inteiro!', color: RED }],
      [{ text: '    if (arr[mid] < target) lo = mid', color: RED }],
      [{ text: '    else hi = mid', color: FG }],
      [{ text: '  }', color: FG }],
      [{ text: '  return arr[lo] === target ? lo : -1', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// Versão correta: hi inclusivo, mid inteiro, lo=mid+1', color: '#475569' }],
      [{ text: 'function binarySearch(arr, target) {', color: FG }],
      [{ text: '  let lo = 0, hi = arr.length - 1', color: GRN }],
      [{ text: '  while (lo <= hi) {', color: GRN }],
      [{ text: '    const mid = (lo + hi) >> 1  // inteiro seguro', color: GRN }],
      [{ text: '    if (arr[mid] === target) return mid', color: GRN }],
      [{ text: '    if (arr[mid] < target) lo = mid + 1', color: GRN }],
      [{ text: '    else hi = mid - 1', color: GRN }],
      [{ text: '  }', color: FG }],
      [{ text: '  return -1', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'Binary search tem 3 variantes (lo..hi inclusive, lo..hi exclusive, lo..hi half-open) e cada uma tem condição de parada e atualização diferentes. Decore uma só e mantenha consistente.',
  },
  {
    title: 'Modificar array/lista durante iteração',
    wrong: [
      [{ text: '// Pular elementos ao deletar durante iteração', color: '#475569' }],
      [{ text: 'const arr = [1, 2, 3, 4, 5]', color: FG }],
      [{ text: 'for (let i = 0; i < arr.length; i++) {', color: FG }],
      [{ text: '  if (arr[i] % 2 === 0) {', color: FG }],
      [{ text: '    arr.splice(i, 1)  // pula o próximo elemento!', color: RED }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: '// arr = [1, 3, 5] — mas 4 foi pulado', color: RED }],
    ],
    right: [
      [{ text: '// Opção 1: filtrar (imutável)', color: '#475569' }],
      [{ text: 'const result = arr.filter(x =&gt; x % 2 !== 0)', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: '// Opção 2: iterar de trás pra frente (mutável)', color: '#475569' }],
      [{ text: 'for (let i = arr.length - 1; i &gt;= 0; i--) {', color: GRN }],
      [{ text: '  if (arr[i] % 2 === 0) arr.splice(i, 1)', color: GRN }],
      [{ text: '}', color: FG }],
    ],
    why: 'Modificar a coleção durante iteração causa bugs de pular elementos ou índices inválidos. Sempre prefira filter() ou itere de trás pra frente quando precisar deletar in-place.',
  },
  {
    title: 'DFS recursivo sem verificação de visitado (grafo com ciclo)',
    wrong: [
      [{ text: '// DFS sem visited → loop infinito em ciclo', color: '#475569' }],
      [{ text: 'function dfs(graph, node) {', color: FG }],
      [{ text: '  console.log(node)', color: FG }],
      [{ text: '  for (const neighbor of graph[node]) {', color: FG }],
      [{ text: '    dfs(graph, neighbor)  // revisita nós!', color: RED }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// DFS correto com Set de visitados', color: '#475569' }],
      [{ text: 'function dfs(graph, node, visited = new Set()) {', color: GRN }],
      [{ text: '  if (visited.has(node)) return', color: GRN }],
      [{ text: '  visited.add(node)', color: GRN }],
      [{ text: '  console.log(node)', color: FG }],
      [{ text: '  for (const neighbor of graph[node]) {', color: FG }],
      [{ text: '    dfs(graph, neighbor, visited)', color: GRN }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'Em grafos com ciclos, DFS sem Set de visitados entra em loop infinito e estoura a call stack. Sempre inicialize o Set fora da recursão e passe como argumento.',
  },
  {
    title: 'Usar Array como Queue (O(n) dequeue)',
    wrong: [
      [{ text: '// BFS com array.shift() — O(n) por operação!', color: '#475569' }],
      [{ text: 'function bfs(graph, start) {', color: FG }],
      [{ text: '  const queue = [start]', color: FG }],
      [{ text: '  while (queue.length > 0) {', color: FG }],
      [{ text: '    const node = queue.shift()  // O(n) shift!', color: RED }],
      [{ text: '    for (const n of graph[node]) queue.push(n)', color: FG }],
      [{ text: '  }', color: FG }],
      [{ text: '}  // Total: O(V + E) × O(V) = O(V² + VE)', color: RED }],
    ],
    right: [
      [{ text: '// Use ponteiro como head da queue — O(1) dequeue', color: '#475569' }],
      [{ text: 'function bfs(graph, start) {', color: FG }],
      [{ text: '  const queue = [start]', color: FG }],
      [{ text: '  let head = 0  // ponteiro substitui shift()', color: GRN }],
      [{ text: '  while (head < queue.length) {', color: GRN }],
      [{ text: '    const node = queue[head++]  // O(1)!', color: GRN }],
      [{ text: '    for (const n of graph[node]) queue.push(n)', color: FG }],
      [{ text: '  }', color: FG }],
      [{ text: '}  // Total: O(V + E) correto', color: GRN }],
    ],
    why: 'Array.shift() é O(n) porque desloca todos os elementos. Em BFS com V nós, isso eleva a complexidade de O(V+E) para O(V² + VE). Use ponteiro ou deque para O(1) dequeue.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Mapa de progressão: junior → sênior em algoritmos
// ═══════════════════════════════════════════════════════════════════════════════

const PROGRESSION_LEVELS: ProgressionLevel[] = [
  {
    id: 'junior',
    name: 'Iniciante',
    label: 'Junior',
    emoji: '🌱',
    concepts: [
      { name: 'Array e loops', tip: 'Acesso por índice, iteração, map/filter/reduce — base de tudo.' },
      { name: 'Big-O básico', tip: 'Reconhecer O(1), O(n), O(n²) no código que você escreve.' },
      { name: 'HashMap / Set', tip: 'Deduplicação, frequência, lookup O(1) — resolve 30% dos problemas.' },
      { name: 'Stack e Queue', tip: 'Stack para backtrack/undo; Queue para processamento em ordem (BFS).' },
      { name: 'Recursão básica', tip: 'Call stack mental, base case, Fibonacci, fatorial.' },
    ],
  },
  {
    id: 'pleno-iniciante',
    name: 'Pleno I',
    label: 'Pleno I',
    emoji: '📐',
    concepts: [
      { name: 'Two pointers', tip: 'Array ordenado, par com soma alvo, palindrome. Template: l=0, r=n-1.' },
      { name: 'Sliding window', tip: 'Subarray contígua com condição. Template: l, r, Map de janela.' },
      { name: 'Binary search', tip: 'Array ordenado ou "predicate monotônico". Decorar uma variante só.' },
      { name: 'Árvore binária básica', tip: 'DFS in/pre/post-order, BFS por nível, altura, simetria.' },
      { name: 'Sorting correto', tip: 'Merge sort, quick sort — saber implementar e justificar.' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno II',
    label: 'Pleno II',
    emoji: '🔧',
    concepts: [
      { name: 'BFS / DFS em grafo', tip: 'visited Set, fila para BFS, pilha implícita para DFS.' },
      { name: 'BST operações', tip: 'Inserção, busca, deleção. Balanceamento conceitual (AVL/RB).' },
      { name: 'Heap / Priority Queue', tip: 'Dijkstra, k menores elementos, merge de k listas.' },
      { name: 'Prefix sum', tip: 'Range sum query O(1) após O(n) de pré-processamento.' },
      { name: 'LinkedList ponteiros', tip: 'Ciclo (Floyd), reverse in-place, merge, k-th from end.' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Sênior',
    emoji: '⚡',
    concepts: [
      { name: 'Dynamic Programming', tip: 'Estado + recorrência + base case. Knapsack, LCS, Edit Distance.' },
      { name: 'Backtracking', tip: 'N-queens, permutações, subsets, Sudoku. Poda de ramos inviáveis.' },
      { name: 'Union-Find (DSU)', tip: 'Componentes conexos, cycle detection em grafo não-dirigido.' },
      { name: 'Trie', tip: 'Autocomplete, prefix match, word search. O(k) por operação.' },
      { name: 'Topological sort', tip: 'DAG ordering, course schedule, build dependencies.' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Expert',
    emoji: '🎯',
    concepts: [
      { name: 'Segment Tree / BIT', tip: 'Range queries com updates. O(log n) ambos.' },
      { name: 'Dijkstra / Bellman-Ford', tip: 'Shortest path com pesos. Dijkstra positivo; BF com negativo.' },
      { name: 'KMP / Rabin-Karp', tip: 'Busca de padrão em string em O(n+m).' },
      { name: 'Bitmask DP', tip: 'TSP, subconjuntos. Estado = inteiro com bits. n ≤ 20.' },
      { name: 'LIS O(n log n)', tip: 'Patience sorting + binary search. Crucial para n=10⁵.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — Comparação: representações de grafo
// ═══════════════════════════════════════════════════════════════════════════════

const GRAPH_OPTIONS: ComparisonOption[] = [
  { id: 'adjlist',  label: 'Lista de Adjacência', sublabel: 'Map/Array de listas', color: C },
  { id: 'adjmatrix', label: 'Matriz de Adjacência', sublabel: 'Array 2D V×V', color: AMB },
  { id: 'edgelist', label: 'Lista de Arestas', sublabel: 'Array de pares [u,v]', color: PRP },
]

const GRAPH_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'space',
    label: 'Espaço',
    category: 'Complexidade',
    values: {
      adjlist:   { rating: 'excellent', note: 'O(V + E) — linear' },
      adjmatrix: { rating: 'poor',      note: 'O(V²) — cresce quadrático' },
      edgelist:  { rating: 'excellent', note: 'O(E) — só arestas' },
    },
  },
  {
    id: 'edge-check',
    label: 'Verificar aresta (u,v)',
    category: 'Operações',
    values: {
      adjlist:   { rating: 'fair',      note: 'O(grau de u)' },
      adjmatrix: { rating: 'excellent', note: 'O(1)' },
      edgelist:  { rating: 'poor',      note: 'O(E) busca linear' },
    },
  },
  {
    id: 'neighbors',
    label: 'Listar vizinhos de u',
    category: 'Operações',
    values: {
      adjlist:   { rating: 'excellent', note: 'O(grau de u)' },
      adjmatrix: { rating: 'poor',      note: 'O(V) percorre linha inteira' },
      edgelist:  { rating: 'poor',      note: 'O(E) filtrar por u' },
    },
  },
  {
    id: 'bfs-dfs',
    label: 'BFS / DFS',
    category: 'Algoritmos',
    values: {
      adjlist:   { rating: 'excellent', note: 'O(V+E) — padrão de entrevista' },
      adjmatrix: { rating: 'fair',      note: 'O(V²) — percorre linha inteira' },
      edgelist:  { rating: 'fair',      note: 'Possível mas trabalhoso' },
    },
  },
  {
    id: 'dense-sparse',
    label: 'Melhor para',
    category: 'Uso',
    values: {
      adjlist:   { rating: 'excellent', note: 'Grafo esparso (maioria dos casos)' },
      adjmatrix: { rating: 'good',      note: 'Grafo denso, Floyd-Warshall' },
      edgelist:  { rating: 'good',      note: 'Kruskal (MST), ordenar por peso' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function AlgoritmosDsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'big-o-chart',
      title: 'Curvas Big-O',
      subtitle: 'Complexidade de algoritmos e estruturas — visualize a diferença entre O(1) e O(n²)',
      accent: C,
      component: (
        <BigOChart
          complexities={[
            { id: 'O1',    label: 'O(1)',       color: '#22c55e', description: 'Constante',     examples: ['Array access', 'HashMap get'] },
            { id: 'Ologn', label: 'O(log n)',   color: '#84cc16', description: 'Logarítmico',  examples: ['Binary Search', 'BST balanceada'] },
            { id: 'On',    label: 'O(n)',        color: C,         description: 'Linear',        examples: ['BFS/DFS', 'Two Pointers'] },
            { id: 'Onlogn',label: 'O(n log n)', color: '#f59e0b', description: 'Log-linear',   examples: ['Merge Sort', 'Heap Sort'] },
            { id: 'On2',   label: 'O(n²)',       color: '#ef4444', description: 'Quadrático',   examples: ['Bubble Sort', 'Nested loops'] },
          ]}
          algorithms={BIG_O_ALGORITHMS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'heatmap-complexidade',
      title: 'Complexidade por Operação',
      subtitle: 'Heatmap de complexidade: estrutura × operação — verde = O(1), vermelho = O(n)',
      accent: C,
      component: (
        <HeatMap
          rows={DS_ROWS}
          cols={DS_COLS}
          data={DS_DATA}
          accentColor={C}
          bgColor={BG}
          lowColor={GRN}
          highColor={RED}
          rowGroups={DS_ROW_GROUPS}
          valueFormatter={(v) => ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'][v] ?? 'O(n)'}
        />
      ),
    },
    {
      id: 'animator-structures',
      title: 'Estruturas de Dados Animadas',
      subtitle: 'Array, Stack, Queue e BST — visualize inserção, busca e remoção passo a passo',
      accent: C,
      component: (
        <DataStructureAnimator
          examples={[
            {
              id: 'array-ex',
              label: 'Array dinâmico',
              type: 'array',
              initialData: [4, 8, 15, 16, 23, 42],
              operations: [
                { id: 'a1', label: 'push', type: 'insert', value: 99, description: 'push(99) ao final' },
                { id: 'a2', label: 'indexOf', type: 'search', value: 15, description: 'indexOf(15)' },
                { id: 'a3', label: 'remove', type: 'delete', value: 8,  description: 'remove(8)' },
              ],
            },
            {
              id: 'stack-ex',
              label: 'Stack (LIFO)',
              type: 'stack',
              initialData: [10, 20, 30],
              operations: [
                { id: 's1', label: 'push', type: 'insert', value: 40, description: 'push(40)' },
                { id: 's2', label: 'pop',  type: 'delete', description: 'pop()' },
              ],
            },
            {
              id: 'queue-ex',
              label: 'Queue (FIFO)',
              type: 'queue',
              initialData: [5, 10, 15],
              operations: [
                { id: 'q1', label: 'enqueue', type: 'insert', value: 20, description: 'enqueue(20)' },
                { id: 'q2', label: 'dequeue', type: 'delete', description: 'dequeue()' },
              ],
            },
            {
              id: 'tree-ex',
              label: 'BST (Binary Search Tree)',
              type: 'tree',
              initialData: [8, 3, 10, 1, 6, 14],
              operations: [
                { id: 't1', label: 'insert', type: 'insert', value: 7, description: 'insert(7)' },
                { id: 't2', label: 'search', type: 'search', value: 6, description: 'search(6)' },
              ],
            },
          ] satisfies DSExample[]}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'qual-estrutura',
      title: 'Qual Estrutura Usar?',
      subtitle: 'Árvore de decisão interativa — dado o problema, qual DS escolher?',
      accent: C,
      component: (
        <DecisionTree
          root={DS_DECISION_ROOT}
          nodes={DS_DECISION_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'sorting-comparison',
      title: 'Algoritmos de Ordenação',
      subtitle: 'Comparação de Bubble, Merge, Quick, Heap e Radix — trade-offs de tempo, espaço e estabilidade',
      accent: C,
      component: (
        <ComparisonTable
          options={SORT_OPTIONS}
          criteria={SORT_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'two-pointers-stepper',
      title: 'Two Pointers & Sliding Window',
      subtitle: 'Execução passo a passo dos padrões mais cobrados em entrevista',
      accent: C,
      component: (
        <CodeStepper
          scenarios={TWO_POINTERS_SCENARIOS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'anti-patterns',
      title: 'Anti-patterns Comuns',
      subtitle: 'Erros clássicos de DS/Algoritmos com código errado × correto e explicação',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={DS_ANTI_PATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'representacoes-grafo',
      title: 'Representações de Grafo',
      subtitle: 'Lista de adjacência vs Matriz vs Lista de arestas — quando usar cada uma',
      accent: C,
      component: (
        <ComparisonTable
          options={GRAPH_OPTIONS}
          criteria={GRAPH_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'progressao',
      title: 'Jornada Junior → Expert',
      subtitle: 'Conceitos que você precisa dominar em cada nível — do array ao bitmask DP',
      accent: C,
      component: (
        <ProgressionMap
          levels={PROGRESSION_LEVELS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
  ]

  // Suprimir variáveis não usadas diretamente em JSX mas usadas indiretamente
  void LINE; void FG; void FGMUTE; void PRP; void C2

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
