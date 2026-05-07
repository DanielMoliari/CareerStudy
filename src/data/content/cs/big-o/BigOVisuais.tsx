'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { BigOChart } from '@/components/visuals/BigOChart'
import type { AlgorithmEntry } from '@/components/visuals/BigOChart'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { TreeExplorer } from '@/components/visuals/TreeExplorer'
import type { TreeNode, TreeNodeTypeMeta } from '@/components/visuals/TreeExplorer'
import { HeatMap } from '@/components/visuals/HeatMap'
import type { HeatCell, HeatRowGroup } from '@/components/visuals/HeatMap'

// ── Paleta Big-O ──────────────────────────────────────────────────────────────
const C      = '#10B981'   // verde — eficiência
const C2     = '#059669'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#0c1424'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — BigOChart com algoritmos marcados
// ═══════════════════════════════════════════════════════════════════════════════

const ALGORITHMS: AlgorithmEntry[] = [
  { id: 'arr-access',    label: 'Array access',         timeComplexity: 'O(1)',        spaceComplexity: 'O(1)',     category: 'Acesso' },
  { id: 'hash-get',      label: 'HashMap get/set',      timeComplexity: 'O(1)',        spaceComplexity: 'O(n)',     category: 'Acesso' },
  { id: 'stack-push',    label: 'Stack push/pop',       timeComplexity: 'O(1)',        spaceComplexity: 'O(1)',     category: 'Acesso' },
  { id: 'binary-search', label: 'Binary Search',        timeComplexity: 'O(log n)',    spaceComplexity: 'O(1)',     category: 'Busca' },
  { id: 'bst',           label: 'BST balanceada',       timeComplexity: 'O(log n)',    spaceComplexity: 'O(h)',     category: 'Busca' },
  { id: 'heap',          label: 'Heap insert/extract',  timeComplexity: 'O(log n)',    spaceComplexity: 'O(n)',     category: 'Busca' },
  { id: 'linear-scan',   label: 'Linear scan',          timeComplexity: 'O(n)',        spaceComplexity: 'O(1)',     category: 'Linear' },
  { id: 'bfs-dfs',       label: 'BFS / DFS',            timeComplexity: 'O(V+E)',      spaceComplexity: 'O(V)',     category: 'Linear' },
  { id: 'two-pointer',   label: 'Two pointers',         timeComplexity: 'O(n)',        spaceComplexity: 'O(1)',     category: 'Linear' },
  { id: 'merge-sort',    label: 'Merge Sort',           timeComplexity: 'O(n log n)',  spaceComplexity: 'O(n)',     category: 'Sort' },
  { id: 'heap-sort',     label: 'Heap Sort',            timeComplexity: 'O(n log n)',  spaceComplexity: 'O(1)',     category: 'Sort' },
  { id: 'quick-sort',    label: 'Quick Sort (avg)',     timeComplexity: 'O(n log n)',  spaceComplexity: 'O(log n)', category: 'Sort' },
  { id: 'bubble-sort',   label: 'Bubble Sort',          timeComplexity: 'O(n²)',       spaceComplexity: 'O(1)',     category: 'Quadrático' },
  { id: 'naive-pairs',   label: 'Brute force pairs',    timeComplexity: 'O(n²)',       spaceComplexity: 'O(1)',     category: 'Quadrático' },
  { id: 'floyd',         label: 'Floyd-Warshall',       timeComplexity: 'O(n³)',       spaceComplexity: 'O(n²)',    category: 'Cúbico' },
  { id: 'subsets',       label: 'Gerar subsets',        timeComplexity: 'O(2ⁿ)',       spaceComplexity: 'O(n)',     category: 'Exponencial' },
  { id: 'fib-naive',     label: 'Fibonacci recursivo',  timeComplexity: 'O(2ⁿ)',       spaceComplexity: 'O(n)',     category: 'Exponencial' },
  { id: 'permutations',  label: 'Permutações',          timeComplexity: 'O(n!)',       spaceComplexity: 'O(n)',     category: 'Fatorial' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — HeatMap: complexidade por estrutura × operação
// ═══════════════════════════════════════════════════════════════════════════════

const DS_ROWS = [
  'Array (estático)',
  'ArrayList (dinâmico)',
  'LinkedList',
  'HashMap',
  'HashSet',
  'BST não balanceada',
  'BST balanceada (AVL/RB)',
  'Min/Max Heap',
  'Trie',
  'Graph adj list',
  'Graph adj matrix',
]

const DS_COLS = ['Access', 'Search', 'Insert', 'Delete', 'Min/Max']

// 0=O(1) 1=O(log n) 2=O(n) 3=O(n log n)
const DS_DATA: HeatCell[][] = [
  // Array estático
  [{ value: 0, note: 'O(1) por índice' }, { value: 2, note: 'O(n) linear' }, { value: 2, note: 'O(n) shift' }, { value: 2, note: 'O(n) shift' }, { value: 2, note: 'O(n) scan' }],
  // ArrayList dinâmico
  [{ value: 0, note: 'O(1) por índice' }, { value: 2, note: 'O(n) linear' }, { value: 0, note: 'O(1) amortizado' }, { value: 2, note: 'O(n) shift' }, { value: 2, note: 'O(n) scan' }],
  // LinkedList
  [{ value: 2, note: 'O(n) percorrer' }, { value: 2, note: 'O(n) linear' }, { value: 0, note: 'O(1) com nó' }, { value: 0, note: 'O(1) com nó' }, { value: 2, note: 'O(n) scan' }],
  // HashMap
  [{ value: 0, note: 'O(1) amortizado' }, { value: 0, note: 'O(1) amortizado' }, { value: 0, note: 'O(1) amortizado' }, { value: 0, note: 'O(1) amortizado' }, { value: 2, note: 'O(n) sem ordem' }],
  // HashSet
  [{ value: 0, note: 'O(1) amortizado' }, { value: 0, note: 'O(1) amortizado' }, { value: 0, note: 'O(1) amortizado' }, { value: 0, note: 'O(1) amortizado' }, { value: 2, note: 'O(n) sem ordem' }],
  // BST não balanceada
  [{ value: 2, note: 'O(n) pior (lista)' }, { value: 2, note: 'O(n) pior caso' }, { value: 2, note: 'O(n) pior caso' }, { value: 2, note: 'O(n) pior caso' }, { value: 2, note: 'O(n) pior' }],
  // BST balanceada
  [{ value: 1, note: 'O(log n) garantido' }, { value: 1, note: 'O(log n) garantido' }, { value: 1, note: 'O(log n) + rotate' }, { value: 1, note: 'O(log n) + rotate' }, { value: 1, note: 'O(log n) extremo' }],
  // Heap
  [{ value: 2, note: 'O(n) sem índice' }, { value: 2, note: 'O(n) geral' }, { value: 1, note: 'O(log n)' }, { value: 1, note: 'O(log n)' }, { value: 0, note: 'O(1) topo' }],
  // Trie
  [{ value: 0, note: 'O(k) k=len chave' }, { value: 0, note: 'O(k) prefixo' }, { value: 0, note: 'O(k)' }, { value: 0, note: 'O(k)' }, { value: 2, note: 'N/A' }],
  // Graph adj list
  [{ value: 2, note: 'O(V) listar' }, { value: 2, note: 'O(V+E) BFS/DFS' }, { value: 0, note: 'O(1) add edge' }, { value: 2, note: 'O(E) remove edge' }, { value: 2, note: 'N/A' }],
  // Graph adj matrix
  [{ value: 0, note: 'O(1) edge query' }, { value: 2, note: 'O(V²) traversal' }, { value: 0, note: 'O(1) add edge' }, { value: 0, note: 'O(1) remove edge' }, { value: 2, note: 'N/A' }],
]

const DS_ROW_GROUPS: HeatRowGroup[] = [
  { label: 'Lineares', rows: ['Array (estático)', 'ArrayList (dinâmico)', 'LinkedList'] },
  { label: 'Hash', rows: ['HashMap', 'HashSet'] },
  { label: 'Árvores e Heap', rows: ['BST não balanceada', 'BST balanceada (AVL/RB)', 'Min/Max Heap', 'Trie'] },
  { label: 'Grafo', rows: ['Graph adj list', 'Graph adj matrix'] },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — ComparisonTable: algoritmos de ordenação
// ═══════════════════════════════════════════════════════════════════════════════

const SORT_OPTIONS: ComparisonOption[] = [
  { id: 'bubble',   label: 'Bubble Sort',  sublabel: 'Educacional',  color: RED },
  { id: 'merge',    label: 'Merge Sort',   sublabel: 'Estável',      color: GRN },
  { id: 'quick',    label: 'Quick Sort',   sublabel: 'Prático',      color: C },
  { id: 'heap',     label: 'Heap Sort',    sublabel: 'Garantido',    color: AMB },
  { id: 'tim',      label: 'TimSort',      sublabel: 'Híbrido',      color: PRP },
]

const SORT_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'best',
    label: 'Melhor caso',
    category: 'Tempo',
    values: {
      bubble: { rating: 'good',      note: 'O(n)' },
      merge:  { rating: 'good',      note: 'O(n log n)' },
      quick:  { rating: 'good',      note: 'O(n log n)' },
      heap:   { rating: 'good',      note: 'O(n log n)' },
      tim:    { rating: 'excellent', note: 'O(n) — runs' },
    },
  },
  {
    id: 'avg',
    label: 'Caso médio',
    category: 'Tempo',
    values: {
      bubble: { rating: 'poor',      note: 'O(n²)' },
      merge:  { rating: 'excellent', note: 'O(n log n)' },
      quick:  { rating: 'excellent', note: 'O(n log n)' },
      heap:   { rating: 'excellent', note: 'O(n log n)' },
      tim:    { rating: 'excellent', note: 'O(n log n)' },
    },
  },
  {
    id: 'worst',
    label: 'Pior caso',
    category: 'Tempo',
    values: {
      bubble: { rating: 'poor',      note: 'O(n²)' },
      merge:  { rating: 'excellent', note: 'O(n log n)' },
      quick:  { rating: 'fair',      note: 'O(n²) sem random pivot' },
      heap:   { rating: 'excellent', note: 'O(n log n)' },
      tim:    { rating: 'excellent', note: 'O(n log n)' },
    },
  },
  {
    id: 'space',
    label: 'Espaço auxiliar',
    category: 'Espaço',
    values: {
      bubble: { rating: 'excellent', note: 'O(1) in-place' },
      merge:  { rating: 'fair',      note: 'O(n) array temp' },
      quick:  { rating: 'good',      note: 'O(log n) call stack' },
      heap:   { rating: 'excellent', note: 'O(1) in-place' },
      tim:    { rating: 'fair',      note: 'O(n)' },
    },
  },
  {
    id: 'stable',
    label: 'Estável?',
    category: 'Propriedades',
    description: 'Preserva ordem de elementos iguais',
    values: {
      bubble: { rating: 'excellent', note: 'Sim' },
      merge:  { rating: 'excellent', note: 'Sim' },
      quick:  { rating: 'poor',      note: 'Não' },
      heap:   { rating: 'poor',      note: 'Não' },
      tim:    { rating: 'excellent', note: 'Sim' },
    },
  },
  {
    id: 'cache',
    label: 'Cache friendly',
    category: 'Performance',
    values: {
      bubble: { rating: 'excellent', note: 'Acesso sequencial' },
      merge:  { rating: 'good',      note: 'Array auxiliar' },
      quick:  { rating: 'excellent', note: 'In-place' },
      heap:   { rating: 'poor',      note: 'Acesso não-sequencial' },
      tim:    { rating: 'good',      note: 'Aproveita runs' },
    },
  },
  {
    id: 'usage',
    label: 'Onde é usado',
    category: 'Prática',
    values: {
      bubble: { rating: 'poor',      note: 'Apenas didático' },
      merge:  { rating: 'excellent', note: 'Java Arrays.sort objects' },
      quick:  { rating: 'excellent', note: 'C qsort, Java primitivos' },
      heap:   { rating: 'good',      note: 'Sistema crítico (garantia)' },
      tim:    { rating: 'excellent', note: 'Python, Java 7+ objetos' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — CodeStepper: análise de complexidade passo a passo
// ═══════════════════════════════════════════════════════════════════════════════

const ANALYSIS_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'binary-search',
    label: 'Binary Search — O(log n)',
    language: 'javascript',
    code: `function binarySearch(arr, target) {
  let lo = 0
  let hi = arr.length - 1

  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (arr[mid] === target) return mid
    if (arr[mid] < target) lo = mid + 1
    else hi = mid - 1
  }
  return -1
}

// Entrada: arr = [1,3,5,7,9,11,13,15], target = 11`,
    steps: [
      {
        lineStart: 2,
        lineEnd: 3,
        title: 'Iteração 0 — espaço de busca = 8',
        explanation: 'lo=0, hi=7. Espaço de busca cobre todo o array (8 elementos).',
        memory: { lo: '0', hi: '7', tamanho: '8' },
      },
      {
        lineStart: 5,
        lineEnd: 6,
        title: 'Iteração 1 — mid=3, descarta metade esquerda',
        explanation: 'mid = (0+7) >> 1 = 3. arr[3]=7 < 11, então lo=mid+1=4. Espaço reduz para [4..7] (4 elementos).',
        memory: { lo: '0→4', hi: '7', mid: '3', 'arr[mid]': '7', target: '11', tamanho: '4' },
        output: 'arr[3]=7 < 11, descarta esquerda',
      },
      {
        lineStart: 5,
        lineEnd: 6,
        title: 'Iteração 2 — mid=5, descarta metade direita',
        explanation: 'mid = (4+7) >> 1 = 5. arr[5]=11 === target! Retorna 5.',
        memory: { lo: '4', hi: '7', mid: '5', 'arr[mid]': '11', target: '11', tamanho: '2' },
        output: '✓ Encontrado em mid=5. Total: 2 iterações.',
      },
      {
        lineStart: 1,
        lineEnd: 11,
        title: 'Análise: por que O(log n)?',
        explanation: 'Cada iteração REDUZ o espaço de busca pela METADE. Após k iterações, espaço = n / 2^k. Loop termina quando espaço = 1 → k = log₂(n). Para n=8: max 3 iterações. Para n=1.000.000: max 20 iterações.',
        memory: { 'n=8': '3 iter máx', 'n=1024': '10 iter máx', 'n=1M': '20 iter máx' },
      },
    ],
  },
  {
    id: 'merge-sort-tree',
    label: 'Merge Sort — recursion tree → O(n log n)',
    language: 'javascript',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr

  const mid = arr.length >> 1
  const left = mergeSort(arr.slice(0, mid))   // T(n/2)
  const right = mergeSort(arr.slice(mid))     // T(n/2)

  return merge(left, right)                   // O(n)
}

// T(n) = 2T(n/2) + O(n)`,
    steps: [
      {
        lineStart: 1,
        lineEnd: 9,
        title: 'Recorrência inicial',
        explanation: 'mergeSort(n) faz 2 chamadas recursivas em arrays de tamanho n/2, mais merge linear O(n).',
        memory: { recorrencia: 'T(n) = 2T(n/2) + n', 'a (subproblemas)': '2', 'b (redução)': '2', 'f(n)': 'n' },
      },
      {
        lineStart: 4,
        lineEnd: 7,
        title: 'Nível 0 da árvore — trabalho n',
        explanation: 'Raiz: 1 chamada com array de tamanho n. Trabalho de merge: n. Total nível 0 = n.',
        memory: { nivel: '0', chamadas: '1', tamanho_array: 'n', trabalho_total: 'n' },
      },
      {
        lineStart: 4,
        lineEnd: 7,
        title: 'Nível 1 — 2 chamadas, total n',
        explanation: 'Nível 1: 2 chamadas, cada com array tamanho n/2. Trabalho de merge: 2 × (n/2) = n.',
        memory: { nivel: '1', chamadas: '2', tamanho_array: 'n/2', trabalho_total: 'n' },
      },
      {
        lineStart: 4,
        lineEnd: 7,
        title: 'Nível 2 — 4 chamadas, total n',
        explanation: 'Nível 2: 4 chamadas, cada com array tamanho n/4. Trabalho: 4 × (n/4) = n.',
        memory: { nivel: '2', chamadas: '4', tamanho_array: 'n/4', trabalho_total: 'n' },
      },
      {
        lineStart: 1,
        lineEnd: 9,
        title: 'Padrão: cada nível faz n trabalho',
        explanation: 'Cada nível da árvore faz exatamente n unidades de trabalho de merge. Total = n × (número de níveis).',
        memory: { 'trabalho_por_nivel': 'n', 'altura_arvore': 'log₂(n)' },
      },
      {
        lineStart: 1,
        lineEnd: 9,
        title: 'Conclusão: O(n log n)',
        explanation: 'Altura da árvore = log₂(n) (até virar T(1)). Trabalho total = n × log₂(n) = O(n log n). Pelo Master Theorem (caso 2): a=2, b=2, f(n)=n, log_b(a)=1=expoente_de_f → O(n^1 · log n) = O(n log n).',
        memory: { trabalho_total: 'n × log n', resultado: 'O(n log n)', master_theorem: 'caso 2' },
        output: '✓ Provado: Merge Sort = O(n log n)',
      },
    ],
  },
  {
    id: 'amortized-array',
    label: 'Dynamic Array — amortized O(1) push',
    language: 'javascript',
    code: `class DynamicArray {
  constructor() {
    this.data = new Array(1)
    this.length = 0
    this.capacity = 1
  }

  push(value) {
    if (this.length === this.capacity) {
      // resize: dobra capacidade — operação O(capacity)
      const newCap = this.capacity * 2
      const newData = new Array(newCap)
      for (let i = 0; i < this.length; i++) {
        newData[i] = this.data[i]
      }
      this.data = newData
      this.capacity = newCap
    }
    this.data[this.length++] = value
  }
}`,
    steps: [
      {
        lineStart: 8,
        lineEnd: 21,
        title: 'Push #1 — sem resize',
        explanation: 'capacity=1, length=0. Não precisa resize. Custo: O(1). Total operações: 1.',
        memory: { length: '0→1', capacity: '1', resize: 'não', custo: 'O(1)', total_ops: '1' },
      },
      {
        lineStart: 9,
        lineEnd: 17,
        title: 'Push #2 — resize de 1 para 2',
        explanation: 'capacity=1 = length, então resize. Aloca array de 2, copia 1 elemento. Custo: O(2).',
        memory: { length: '1→2', capacity: '1→2', resize: 'sim, copia 1', custo: 'O(1+1)', total_ops: '3' },
      },
      {
        lineStart: 9,
        lineEnd: 17,
        title: 'Push #3 — resize de 2 para 4',
        explanation: 'capacity=2, length=2. Resize. Aloca array de 4, copia 2 elementos. Custo: O(4).',
        memory: { length: '2→3', capacity: '2→4', resize: 'sim, copia 2', custo: 'O(1+2)', total_ops: '6' },
      },
      {
        lineStart: 18,
        lineEnd: 19,
        title: 'Push #4 — sem resize (capacity=4)',
        explanation: 'capacity=4, length=3. Cabe! Custo: O(1).',
        memory: { length: '3→4', capacity: '4', resize: 'não', custo: 'O(1)', total_ops: '7' },
      },
      {
        lineStart: 9,
        lineEnd: 17,
        title: 'Push #5 — resize de 4 para 8',
        explanation: 'capacity=4=length. Resize. Copia 4 elementos. Custo: O(5).',
        memory: { length: '4→5', capacity: '4→8', resize: 'sim, copia 4', custo: 'O(1+4)', total_ops: '12' },
      },
      {
        lineStart: 1,
        lineEnd: 22,
        title: 'Análise amortizada: O(1) por push',
        explanation: 'Após N pushes, total de cópias = 1+2+4+8+...+N/2 = N-1. Custo total = N (insertions) + (N-1) cópias = 2N-1. Amortizado por push = (2N-1)/N ≈ 2 = O(1).',
        memory: { N_pushes: 'N', total_copias: 'N-1', custo_total: '2N-1', amortizado: 'O(1)' },
        output: '✓ Provado: push é O(1) amortizado mesmo com resize O(n) ocasional.',
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — TreeExplorer: árvore de recursão de Fibonacci
// ═══════════════════════════════════════════════════════════════════════════════

const FIB_TYPE_MAP: Record<string, TreeNodeTypeMeta> = {
  call:       { color: C,   label: 'Chamada', icon: '▶', desc: 'Chamada recursiva ativa.' },
  base:       { color: GRN, label: 'Base case', icon: '◉', desc: 'Caso base: retorna direto sem recursão.' },
  duplicated: { color: AMB, label: 'Duplicada', icon: '✕', desc: 'Subproblema já calculado em outro ramo — desperdício!' },
}

const FIB_TREE: TreeNode = {
  id: 'fib-5',
  name: 'fib(5)',
  type: 'call',
  tooltip: 'fib(5) = fib(4) + fib(3). Topo da árvore.',
  tip: 'Sem memoization, cada chamada recalcula tudo do zero.',
  children: [
    {
      id: 'fib-4-a',
      name: 'fib(4)',
      type: 'call',
      tooltip: 'fib(4) = fib(3) + fib(2)',
      children: [
        {
          id: 'fib-3-a',
          name: 'fib(3)',
          type: 'call',
          tooltip: 'fib(3) = fib(2) + fib(1)',
          children: [
            { id: 'fib-2-a', name: 'fib(2)', type: 'duplicated', tooltip: 'fib(2) = fib(1) + fib(0). Já calculada em outros ramos!', children: [
              { id: 'fib-1-a', name: 'fib(1)', type: 'base', tooltip: 'Base case: retorna 1' },
              { id: 'fib-0-a', name: 'fib(0)', type: 'base', tooltip: 'Base case: retorna 0' },
            ] },
            { id: 'fib-1-b', name: 'fib(1)', type: 'base', tooltip: 'Base case: retorna 1' },
          ],
        },
        { id: 'fib-2-b', name: 'fib(2)', type: 'duplicated', tooltip: 'fib(2) recalculada — DUPLICADA. Memoization economizaria!', children: [
          { id: 'fib-1-c', name: 'fib(1)', type: 'base', tooltip: 'Base case' },
          { id: 'fib-0-b', name: 'fib(0)', type: 'base', tooltip: 'Base case' },
        ] },
      ],
    },
    {
      id: 'fib-3-b',
      name: 'fib(3)',
      type: 'duplicated',
      tooltip: 'fib(3) já foi calculada no ramo esquerdo — DUPLICADA.',
      children: [
        { id: 'fib-2-c', name: 'fib(2)', type: 'duplicated', tooltip: 'fib(2) calculada 3 vezes no total!', children: [
          { id: 'fib-1-d', name: 'fib(1)', type: 'base', tooltip: 'Base case' },
          { id: 'fib-0-c', name: 'fib(0)', type: 'base', tooltip: 'Base case' },
        ] },
        { id: 'fib-1-e', name: 'fib(1)', type: 'base', tooltip: 'Base case' },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Master Theorem decision tree
// ═══════════════════════════════════════════════════════════════════════════════

const MASTER_OPTIONS: ComparisonOption[] = [
  { id: 'case1', label: 'Caso 1', sublabel: 'Recursão domina', color: C },
  { id: 'case2', label: 'Caso 2', sublabel: 'Balanceado', color: AMB },
  { id: 'case3', label: 'Caso 3', sublabel: 'Combinação domina', color: PRP },
]

const MASTER_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'condition',
    label: 'Condição',
    category: 'Identificação',
    values: {
      case1: { rating: 'good', note: 'f(n) = O(n^c) com c < log_b(a)' },
      case2: { rating: 'good', note: 'f(n) = Θ(n^c) com c = log_b(a)' },
      case3: { rating: 'good', note: 'f(n) = Ω(n^c) com c > log_b(a)' },
    },
  },
  {
    id: 'result',
    label: 'Resultado T(n)',
    category: 'Solução',
    values: {
      case1: { rating: 'excellent', note: 'Θ(n^log_b(a))' },
      case2: { rating: 'excellent', note: 'Θ(n^c · log n)' },
      case3: { rating: 'excellent', note: 'Θ(f(n))' },
    },
  },
  {
    id: 'merge-sort',
    label: 'Merge Sort: T(n)=2T(n/2)+n',
    category: 'Exemplos',
    description: 'a=2, b=2, f(n)=n, log_b(a)=1, c=1',
    values: {
      case1: { rating: 'na' },
      case2: { rating: 'excellent', note: '✓ c=1 = log_b(a)=1 → O(n log n)' },
      case3: { rating: 'na' },
    },
  },
  {
    id: 'binary',
    label: 'Binary Search: T(n)=T(n/2)+1',
    category: 'Exemplos',
    description: 'a=1, b=2, f(n)=1, log_b(a)=0, c=0',
    values: {
      case1: { rating: 'na' },
      case2: { rating: 'excellent', note: '✓ c=0 = log_b(a)=0 → O(log n)' },
      case3: { rating: 'na' },
    },
  },
  {
    id: 'karatsuba',
    label: 'Karatsuba: T(n)=3T(n/2)+n',
    category: 'Exemplos',
    description: 'a=3, b=2, f(n)=n, log_b(a)≈1.58, c=1',
    values: {
      case1: { rating: 'excellent', note: '✓ c=1 < 1.58 → O(n^1.58)' },
      case2: { rating: 'na' },
      case3: { rating: 'na' },
    },
  },
  {
    id: 'tree-trav',
    label: 'Tree traversal: T(n)=2T(n/2)+1',
    category: 'Exemplos',
    description: 'a=2, b=2, f(n)=1, log_b(a)=1, c=0',
    values: {
      case1: { rating: 'excellent', note: '✓ c=0 < 1 → O(n)' },
      case2: { rating: 'na' },
      case3: { rating: 'na' },
    },
  },
  {
    id: 'matrix-mult',
    label: 'Matrix mult: T(n)=8T(n/2)+n²',
    category: 'Exemplos',
    description: 'a=8, b=2, f(n)=n², log_b(a)=3, c=2',
    values: {
      case1: { rating: 'excellent', note: '✓ c=2 < 3 → O(n³)' },
      case2: { rating: 'na' },
      case3: { rating: 'na' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function BigOVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'big-o-chart',
      title: 'Curvas de Big-O',
      subtitle: 'Visualize a diferença entre O(1), O(log n), O(n), O(n log n), O(n²) e O(2ⁿ) — com algoritmos reais marcados',
      accent: C,
      component: (
        <BigOChart
          complexities={[
            { id: 'O1',     label: 'O(1)',       color: '#22c55e', description: 'Constante',     examples: ['Array access', 'HashMap get', 'Stack push'] },
            { id: 'Ologn',  label: 'O(log n)',   color: '#84cc16', description: 'Logarítmico',   examples: ['Binary Search', 'BST balanceada', 'Heap insert'] },
            { id: 'On',     label: 'O(n)',       color: C,         description: 'Linear',        examples: ['Linear scan', 'BFS/DFS', 'Two pointers'] },
            { id: 'Onlogn', label: 'O(n log n)', color: '#f59e0b', description: 'Log-linear',    examples: ['Merge Sort', 'Heap Sort', 'Quick Sort avg'] },
            { id: 'On2',    label: 'O(n²)',      color: '#ef4444', description: 'Quadrático',    examples: ['Bubble Sort', 'Brute force pairs'] },
            { id: 'O2n',    label: 'O(2ⁿ)',      color: '#a855f7', description: 'Exponencial',   examples: ['Subsets', 'Fib recursivo'] },
          ]}
          algorithms={ALGORITHMS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'ds-heatmap',
      title: 'Heatmap por Estrutura × Operação',
      subtitle: '11 estruturas × 5 operações — verde = O(1), vermelho = O(n). A escolha da estrutura define a complexidade',
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
      id: 'sort-comparison',
      title: 'Algoritmos de Ordenação',
      subtitle: 'Bubble vs Merge vs Quick vs Heap vs TimSort — complexidade, espaço, estabilidade e cache locality',
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
      id: 'analysis-stepper',
      title: 'Análise passo a passo',
      subtitle: 'Como derivar O(log n), O(n log n) e amortized O(1) — execução real com estado das variáveis',
      accent: C,
      component: (
        <CodeStepper
          scenarios={ANALYSIS_SCENARIOS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'fib-recursion-tree',
      title: 'Árvore de recursão de Fibonacci',
      subtitle: 'Por que Fibonacci recursivo é O(2ⁿ) e como memoization reduz para O(n) — visualize as duplicações',
      accent: RED,
      component: (
        <TreeExplorer
          tree={FIB_TREE}
          typeMap={FIB_TYPE_MAP}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          card2Color={CARD2}
        />
      ),
    },
    {
      id: 'master-theorem',
      title: 'Master Theorem — 3 casos',
      subtitle: 'A solução fechada para recorrências divide-and-conquer — quando aplicar cada caso',
      accent: C,
      component: (
        <ComparisonTable
          options={MASTER_OPTIONS}
          criteria={MASTER_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
  ]

  void LINE; void FG; void FGMUTE; void C2; void PRP; void AMB

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
