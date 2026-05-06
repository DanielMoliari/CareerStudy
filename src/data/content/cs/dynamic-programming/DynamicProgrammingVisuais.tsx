'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { FeaturesCarousel } from '@/components/visuals/FeaturesCarousel'
import type { Feature } from '@/components/visuals/FeaturesCarousel'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'
import { HeatMap } from '@/components/visuals/HeatMap'
import type { HeatCell, HeatRowGroup } from '@/components/visuals/HeatMap'

// ── Paleta Dynamic Programming ────────────────────────────────────────────────
const C      = '#8B5CF6'   // roxo — DP/algoritmos
const C2     = '#7c3aed'   // roxo escuro
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — FeaturesCarousel: Top-down vs Bottom-up no mesmo problema
// ═══════════════════════════════════════════════════════════════════════════════

const MEMO_VS_TAB_FEATURES: Feature[] = [
  {
    tag: 'Fibonacci',
    name: 'Top-down (Memoization)',
    color: C,
    beforeLabel: 'Recursão pura O(2ⁿ)',
    afterLabel: 'Com memo O(n)',
    before: `def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)
# fib(5) chama fib(4) E fib(3)
# fib(4) chama fib(3) E fib(2)
# fib(3) recomputado 2x!
# Total: O(2ⁿ) chamadas`,
    after: `memo = {}
def fib(n):
    if n < 2: return n
    if n in memo: return memo[n]
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]
# Cada fib(k) computado 1 vez
# Total: O(n) chamadas`,
    desc: 'Memoization adiciona um cache na recursão natural. Mais fácil de escrever a partir da recursão ingênua. Só visita estados alcançados (bom para espaços de estado esparsos).',
  },
  {
    tag: 'Fibonacci',
    name: 'Bottom-up (Tabulation)',
    color: C2,
    beforeLabel: 'Top-down (com stack)',
    afterLabel: 'Bottom-up (sem stack)',
    before: `# Top-down: usa call stack
# Python default: 1000 frames
# fib(5000) → RecursionError!
memo = {}
def fib(n):
    if n < 2: return n
    if n in memo: return memo[n]
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]`,
    after: `# Bottom-up: preenche tabela
# Sem risco de stack overflow
dp = [0, 1]
for i in range(2, n + 1):
    dp.append(dp[-1] + dp[-2])
return dp[n]

# Space O(1): só 2 variáveis
a, b = 0, 1
for _ in range(n):
    a, b = b, a + b
return a`,
    desc: 'Bottom-up resolve subproblemas em ordem crescente iterativamente. Sem risco de stack overflow. Permite space optimization (descartar linhas antigas da tabela).',
  },
  {
    tag: 'Coin Change',
    name: 'State: dp[amount]',
    color: C,
    beforeLabel: 'Estado incompleto',
    afterLabel: 'Estado correto',
    before: `# Estado SÓ com "moedas usadas"
# (não captura o amount atual)
def coinChange(coins, amount):
    used = 0
    while amount > 0:
        for c in sorted(coins, rev=True):
            if c <= amount:
                amount -= c
                used += 1
                break
    return used  # ERRADO: greedy falha!
# Moedas [1,3,4], amount=6
# Greedy: 4+1+1=3 moedas
# DP: 3+3=2 moedas`,
    after: `# Estado correto: dp[a] = min moedas
dp = [float('inf')] * (amount + 1)
dp[0] = 0  # base case

for a in range(1, amount + 1):
    for coin in coins:
        if coin <= a:
            dp[a] = min(dp[a],
                        dp[a - coin] + 1)

return dp[amount] if dp[amount] != inf else -1
# dp[6] com coins=[1,3,4]:
# dp[3]=1, dp[4]=1, dp[6]=2 ✓`,
    desc: 'O estado define o que o DP "sabe" em cada subproblema. Estado incompleto → respostas erradas em casos específicos. dp[a] = min moedas para atingir amount a.',
  },
  {
    tag: 'Knapsack',
    name: 'Space Optimization',
    color: C2,
    beforeLabel: 'O(n×W) espaço',
    afterLabel: 'O(W) espaço',
    before: `# 2D: dp[i][c] = max valor
# com itens 0..i e capacidade c
dp = [[0]*(W+1) for _ in range(n+1)]
for i in range(1, n+1):
    for c in range(W+1):
        dp[i][c] = dp[i-1][c]  # pula
        if w[i-1] <= c:
            dp[i][c] = max(dp[i][c],
                dp[i-1][c-w[i-1]] + v[i-1])
return dp[n][W]
# O(n*W) espaço`,
    after: `# 1D: reutiliza array, loop reverso
dp = [0] * (W + 1)
for i in range(n):
    # Loop REVERSO evita reusar item i
    for c in range(W, w[i]-1, -1):
        dp[c] = max(dp[c],
                    dp[c-w[i]] + v[i])
return dp[W]
# O(W) espaço — O(n) vezes menor!
# Reverso: garante que dp[c-w[i]]
# é da linha anterior (item i-1)`,
    desc: 'Quando dp[i][j] depende só da linha anterior, você pode usar um único array 1D. No 0/1 Knapsack: loop REVERSO garante que dp[c-w] ainda é da iteração anterior.',
  },
  {
    tag: 'LCS',
    name: 'Recorrência 2D em Strings',
    color: C,
    beforeLabel: 'Brute force O(2ⁿ⁺ᵐ)',
    afterLabel: 'DP O(nm)',
    before: `# Recursão ingênua sem memo
def lcs(s1, s2, i, j):
    if i == 0 or j == 0:
        return 0
    if s1[i-1] == s2[j-1]:
        return 1 + lcs(s1,s2,i-1,j-1)
    return max(
        lcs(s1, s2, i-1, j),
        lcs(s1, s2, i, j-1)
    )
# lcs("ABCD","ACBD"):
# expande em árvore binária → O(2^(n+m))`,
    after: `# Bottom-up: preenche tabela n×m
def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(
                    dp[i-1][j],
                    dp[i][j-1])
    return dp[m][n]  # O(nm) tempo e espaço`,
    desc: 'Problemas 2D em strings usam dp[i][j] = solução ótima para as primeiras i chars de s1 e j chars de s2. LCS, Edit Distance, Longest Palindromic Subsequence seguem esse padrão.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — DecisionTree: "É DP?" — diagnóstico interativo
// ═══════════════════════════════════════════════════════════════════════════════

const DP_DECISION_ROOT: DTNode = {
  id: 'root',
  question: 'O problema pede max, min ou contagem de alguma configuração?',
  children: [
    { label: 'Sim, otimização/contagem', nodeId: 'overlap-check', color: C },
    { label: 'Não, pede lista ou estrutura', nodeId: 'not-dp-structure', color: FGMUTE },
  ],
}

const DP_DECISION_NODES: Record<string, DTNode> = {
  'overlap-check': {
    id: 'overlap-check',
    question: 'Os mesmos subproblemas aparecem múltiplas vezes na recursão?',
    children: [
      { label: 'Sim — recursão recomputa os mesmos valores', nodeId: 'optimal-substructure', color: C },
      { label: 'Não — cada subproblema é único', nodeId: 'divide-and-conquer', color: SKY },
    ],
  },
  'optimal-substructure': {
    id: 'optimal-substructure',
    question: 'Decisão ótima em cada passo leva ao ótimo global?',
    children: [
      { label: 'Não tenho certeza — escolhas dependem umas das outras', nodeId: 'is-dp', color: C },
      { label: 'Sim, posso provar com exchange argument', nodeId: 'greedy-check', color: AMB },
    ],
  },
  'is-dp': {
    id: 'is-dp',
    question: 'Qual é o padrão?',
    children: [
      { label: '1D — problema depende de dp[i-1]', nodeId: 'dp-1d', color: C },
      { label: '2D — duas strings ou grid', nodeId: 'dp-2d', color: C2 },
      { label: 'Escolha binária por item (knapsack)', nodeId: 'dp-knapsack', color: AMB },
      { label: 'Intervalo dp[i][j]', nodeId: 'dp-interval', color: SKY },
    ],
  },
  'dp-1d': {
    id: 'dp-1d',
    recommendation: 'DP 1D Linear',
    detail: 'Padrões: Fibonacci, Climbing Stairs, House Robber, Decode Ways. dp[i] depende de dp[i-1] (ou dp[i-2]). Base case: dp[0] e dp[1]. Resposta: dp[n]. Space O(1) possível com rolling variables.',
    color: C,
    icon: '📈',
  },
  'dp-2d': {
    id: 'dp-2d',
    recommendation: 'DP 2D em Strings ou Grid',
    detail: 'Padrões: LCS, Edit Distance, Unique Paths, Minimum Path Sum, LPS. dp[i][j] = solução para (s1[0..i], s2[0..j]) ou célula (i,j) do grid. Space optimization possível: dp[i][j] depende só da linha anterior.',
    color: C2,
    icon: '🔢',
  },
  'dp-knapsack': {
    id: 'dp-knapsack',
    recommendation: '0/1 Knapsack ou Unbounded',
    detail: '0/1: cada item usado no máximo uma vez → loop de capacidade REVERSO. Unbounded: item usado infinitas vezes (Coin Change) → loop PÁRA FRENTE. Coin Change II (contagem de combinações): loop externo por moeda.',
    color: AMB,
    icon: '🎒',
  },
  'dp-interval': {
    id: 'dp-interval',
    recommendation: 'Interval DP',
    detail: 'dp[i][j] = ótimo para o intervalo [i,j]. Preenche diagonal por diagonal (tamanho crescente). Padrões: Matrix Chain Multiplication, Burst Balloons, Palindromic Substrings, Optimal BST. Complexidade geralmente O(n³).',
    color: SKY,
    icon: '🎯',
  },
  'greedy-check': {
    id: 'greedy-check',
    recommendation: 'Provavelmente Greedy',
    detail: 'Se você conseguiu provar com exchange argument que escolha local = ótimo global, use Greedy. Exemplos: Activity Selection, Dijkstra (pesos positivos), Huffman. Mas cuidado: Coin Change com moedas arbitrárias NÃO é greedy — greedy falha em [1,3,4] com amount=6.',
    color: AMB,
    icon: '💡',
  },
  'divide-and-conquer': {
    id: 'divide-and-conquer',
    recommendation: 'Divide and Conquer (não DP)',
    detail: 'Se cada subproblema é único (sem sobreposição), D&C é suficiente. Exemplos: Merge Sort, Binary Search, Quick Sort. Subproblemas não se repetem → memoização não ajuda. D&C + sobreposição = DP.',
    color: SKY,
    icon: '✂️',
  },
  'not-dp-structure': {
    id: 'not-dp-structure',
    recommendation: 'Provavelmente não é DP',
    detail: 'Se o problema pede a lista completa de soluções (não o ótimo ou contagem), ou envolve uma estrutura a construir, considere backtracking, BFS/DFS ou construção gulosa. DP não gera facilmente listas — só valores ótimos ou contagens.',
    color: RED,
    icon: '❌',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — CodeStepper: Fibonacci top-down e Knapsack bottom-up passo a passo
// ═══════════════════════════════════════════════════════════════════════════════

const DP_STEPPERS: CodeStepperScenario[] = [
  {
    id: 'coin-change',
    label: 'Coin Change bottom-up',
    language: 'python',
    code: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1

# coins = [1, 3, 4], amount = 6`,
    steps: [
      {
        lineStart: 2,
        lineEnd: 3,
        title: 'Inicialização — base case',
        explanation: 'dp[0] = 0: zero moedas para atingir amount 0. Todos os outros = infinito (impossível até provarmos o contrário). Inicialização errada é a causa #1 de bug silencioso em DP.',
        memory: { 'dp[0]': '0', 'dp[1..6]': '∞', coins: '[1, 3, 4]', amount: '6' },
      },
      {
        lineStart: 5,
        lineEnd: 8,
        title: 'a=1: testa cada moeda',
        explanation: 'Moeda 1: dp[1] = min(∞, dp[0]+1) = 1. Moeda 3: 3 > 1, pula. Moeda 4: 4 > 1, pula. dp[1] = 1.',
        memory: { 'dp[0]': '0', 'dp[1]': '1', 'dp[2..6]': '∞' },
        output: 'dp[1] = min(∞, dp[0]+1) = 1',
      },
      {
        lineStart: 5,
        lineEnd: 8,
        title: 'a=2,3: acumulando soluções',
        explanation: 'a=2: moeda 1 → dp[2]=min(∞,dp[1]+1)=2. a=3: moeda 1 → dp[3]=3, depois moeda 3 → dp[3]=min(3,dp[0]+1)=1. Construção bottom-up: cada dp[a] usa resultados já computados.',
        memory: { 'dp[1]': '1', 'dp[2]': '2', 'dp[3]': '1', 'dp[4..6]': '∞' },
        output: 'dp[3] = 1 (uma moeda de 3)',
      },
      {
        lineStart: 5,
        lineEnd: 8,
        title: 'a=4,5: mais soluções encontradas',
        explanation: 'a=4: moeda 1 → dp[3]+1=2; moeda 4 → dp[0]+1=1. dp[4]=1. a=5: moeda 1 → dp[4]+1=2; moeda 4 → dp[1]+1=2. dp[5]=2.',
        memory: { 'dp[3]': '1', 'dp[4]': '1', 'dp[5]': '2', 'dp[6]': '∞' },
        output: 'dp[4] = 1 (uma moeda de 4)',
      },
      {
        lineStart: 5,
        lineEnd: 8,
        title: 'a=6: resposta final',
        explanation: 'a=6: moeda 1 → dp[5]+1=3; moeda 3 → dp[3]+1=2; moeda 4 → dp[2]+1=3. dp[6] = 2. Greedy teria dado 4+1+1=3 — DP achou o ótimo real: 3+3.',
        memory: { 'dp[3]': '1', 'dp[4]': '1', 'dp[5]': '2', 'dp[6]': '2' },
        output: '✓ dp[6] = 2 (moedas 3+3)',
      },
      {
        lineStart: 10,
        lineEnd: 10,
        title: 'Leitura da resposta',
        explanation: 'dp[amount] = dp[6] = 2. Como não é infinito, a resposta é 2. Importante: a resposta sempre está em dp[target], não em max(dp) — diferente de LIS onde é max(dp[i]).',
        memory: { 'dp[6]': '2', 'resposta': '2' },
        output: 'Retorna 2 — mínimo de 2 moedas (3+3)',
      },
    ],
  },
  {
    id: 'lcs',
    label: 'LCS — preenchimento da tabela 2D',
    language: 'python',
    code: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]

    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]

# s1 = "ABC", s2 = "AC"`,
    steps: [
      {
        lineStart: 3,
        lineEnd: 3,
        title: 'Tabela (m+1)×(n+1) zerada',
        explanation: 'dp[i][j] = comprimento da LCS de s1[0..i-1] e s2[0..j-1]. Linha/coluna 0 = string vazia, todos zero. A tabela crescerá de cima-esquerda para baixo-direita.',
        memory: { s1: '"ABC"', s2: '"AC"', 'dp shape': '4×3', 'todos dp[i][j]': '0' },
      },
      {
        lineStart: 5,
        lineEnd: 10,
        title: 'i=1 (s1[0]="A"): varre s2',
        explanation: 'j=1: s1[0]="A" == s2[0]="A" → dp[1][1] = dp[0][0]+1 = 1. j=2: s1[0]="A" ≠ s2[1]="C" → dp[1][2] = max(dp[0][2], dp[1][1]) = max(0, 1) = 1.',
        memory: { 'dp[1][1]': '1', 'dp[1][2]': '1' },
        output: '"A" está em s2 → LCS até aqui = 1',
      },
      {
        lineStart: 5,
        lineEnd: 10,
        title: 'i=2 (s1[1]="B"): varre s2',
        explanation: 'j=1: "B" ≠ "A" → dp[2][1] = max(dp[1][1], dp[2][0]) = max(1, 0) = 1. j=2: "B" ≠ "C" → dp[2][2] = max(dp[1][2], dp[2][1]) = max(1, 1) = 1.',
        memory: { 'dp[2][1]': '1', 'dp[2][2]': '1' },
        output: '"B" não está em prefixo de s2 → LCS mantida em 1',
      },
      {
        lineStart: 5,
        lineEnd: 10,
        title: 'i=3 (s1[2]="C"): varre s2',
        explanation: 'j=1: "C" ≠ "A" → dp[3][1] = max(dp[2][1], dp[3][0]) = 1. j=2: "C" == "C" → dp[3][2] = dp[2][1]+1 = 2.',
        memory: { 'dp[3][1]': '1', 'dp[3][2]': '2' },
        output: '"C" encontrado → LCS cresce para 2',
      },
      {
        lineStart: 12,
        lineEnd: 12,
        title: 'Resposta: dp[m][n] = dp[3][2] = 2',
        explanation: 'LCS("ABC", "AC") = 2 — a subsequência é "AC". Para reconstruir: backtrack pela tabela (diagonal se chars iguais, sobe/esquerda para max). Tempo O(nm), espaço O(nm) — reduzível a O(min(m,n)).',
        memory: { 'dp[3][2]': '2', 'LCS': '"AC"' },
        output: '✓ Comprimento da LCS = 2',
      },
    ],
  },
  {
    id: 'house-robber',
    label: 'House Robber — DP 1D',
    language: 'javascript',
    code: `function rob(nums) {
  if (nums.length === 1) return nums[0]

  let prev2 = 0         // dp[i-2]
  let prev1 = 0         // dp[i-1]

  for (const num of nums) {
    const curr = Math.max(prev1, prev2 + num)
    prev2 = prev1
    prev1 = curr
  }

  return prev1
}

// nums = [2, 7, 9, 3, 1]`,
    steps: [
      {
        lineStart: 3,
        lineEnd: 5,
        title: 'Rolling variables — O(1) espaço',
        explanation: 'Em vez de array dp[], usamos só duas variáveis: prev2 (dp[i-2]) e prev1 (dp[i-1]). Recorrência: dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Semântica: max entre pular casa i vs roubar casa i + melhor das casas anteriores.',
        memory: { prev2: '0', prev1: '0', 'nums': '[2,7,9,3,1]' },
      },
      {
        lineStart: 7,
        lineEnd: 10,
        title: 'num=2: primeira casa',
        explanation: 'curr = max(prev1=0, prev2+2=2) = 2. Decisão: roubar casa 0 (valor 2) é melhor que não roubar nada. Atualiza: prev2=0, prev1=2.',
        memory: { prev2: '0', prev1: '2', curr: '2' },
        output: 'Rouba casa 0 (2). Acumulado: 2',
      },
      {
        lineStart: 7,
        lineEnd: 10,
        title: 'num=7: segunda casa',
        explanation: 'curr = max(prev1=2, prev2+7=7) = 7. Pular casa 0 e roubar casa 1 (7) é melhor que roubar casa 0 (2). Atualiza: prev2=2, prev1=7.',
        memory: { prev2: '2', prev1: '7', curr: '7' },
        output: 'Roubar casa 1 (7) é melhor. Acumulado: 7',
      },
      {
        lineStart: 7,
        lineEnd: 10,
        title: 'num=9: terceira casa',
        explanation: 'curr = max(prev1=7, prev2+9=11) = 11. Roubar casa 0 (2) + casa 2 (9) = 11 > 7. A restrição "não-adjacente" é satisfeita: pulou casa 1. Atualiza: prev2=7, prev1=11.',
        memory: { prev2: '7', prev1: '11', curr: '11' },
        output: 'Rouba casas 0+2 (2+9=11). Acumulado: 11',
      },
      {
        lineStart: 7,
        lineEnd: 10,
        title: 'num=3,1: últimas casas',
        explanation: 'num=3: curr = max(11, 7+3=10) = 11. num=1: curr = max(11, 11+1=12) = 12. Roubar casas 0+2+4 (2+9+1=12) é ótimo.',
        memory: { prev2: '11', prev1: '12', curr: '12' },
        output: 'Sequência ótima: casas [0,2,4] = 2+9+1=12',
      },
      {
        lineStart: 13,
        lineEnd: 13,
        title: 'Retorna prev1 = 12',
        explanation: 'A resposta está em prev1 (= dp[n-1]). Space O(1) — descartamos todos os dp[i] exceto os dois últimos. Tempo O(n).',
        memory: { 'resposta': '12' },
        output: '✓ Máximo que pode roubar = 12',
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — HeatMap: padrões de DP × propriedades
// ═══════════════════════════════════════════════════════════════════════════════

const DP_PATTERN_ROWS = [
  'Fibonacci / Climbing Stairs',
  'House Robber',
  'Coin Change (min)',
  'Coin Change II (contagem)',
  'Knapsack 0/1',
  'Knapsack Unbounded',
  'LCS / Edit Distance',
  'Longest Palindromic Subseq',
  'Unique Paths (grid)',
  'LIS (n²)',
  'LIS (n log n)',
  'Word Break',
  'Burst Balloons (interval)',
]

const DP_PATTERN_COLS = ['Dim', '1D?', '2D?', 'Reverso?', 'Space Opt', 'Hard?']

// 0=sim/fácil  1=parcial  2=não/difícil
const DP_PATTERN_DATA: HeatCell[][] = [
  // Fibonacci
  [{ value: 0, note: '1D' }, { value: 0, note: 'Sim' }, { value: 2, note: 'Não' }, { value: 2, note: 'Não' }, { value: 0, note: 'O(1) com vars' }, { value: 2, note: 'Fácil' }],
  // House Robber
  [{ value: 0, note: '1D' }, { value: 0, note: 'Sim' }, { value: 2, note: 'Não' }, { value: 2, note: 'Não' }, { value: 0, note: 'O(1) com vars' }, { value: 1, note: 'Médio' }],
  // Coin Change min
  [{ value: 0, note: '1D' }, { value: 0, note: 'Sim' }, { value: 2, note: 'Não' }, { value: 2, note: 'Loop frente (unbounded)' }, { value: 0, note: 'Já é O(n)' }, { value: 1, note: 'Médio' }],
  // Coin Change II
  [{ value: 0, note: '1D' }, { value: 0, note: 'Sim' }, { value: 2, note: 'Não' }, { value: 2, note: 'Loop frente (moeda ext)' }, { value: 0, note: 'Já é O(n)' }, { value: 1, note: 'Médio' }],
  // Knapsack 0/1
  [{ value: 1, note: '2D→1D' }, { value: 1, note: 'Após opt' }, { value: 0, note: 'Sim (original)' }, { value: 0, note: 'Sim — evita reuso' }, { value: 0, note: 'O(W)' }, { value: 1, note: 'Médio' }],
  // Knapsack Unbounded
  [{ value: 0, note: '1D' }, { value: 0, note: 'Sim' }, { value: 2, note: 'Não' }, { value: 2, note: 'Loop frente' }, { value: 0, note: 'Já é O(W)' }, { value: 1, note: 'Médio' }],
  // LCS / Edit Distance
  [{ value: 2, note: '2D' }, { value: 2, note: 'Não' }, { value: 0, note: 'Sim' }, { value: 2, note: 'Não' }, { value: 0, note: 'O(min(m,n))' }, { value: 1, note: 'Médio' }],
  // LPS
  [{ value: 2, note: '2D' }, { value: 2, note: 'Não' }, { value: 0, note: 'Sim' }, { value: 2, note: 'Não' }, { value: 1, note: 'O(n)' }, { value: 1, note: 'Médio' }],
  // Unique Paths
  [{ value: 2, note: '2D' }, { value: 2, note: 'Não' }, { value: 0, note: 'Sim' }, { value: 2, note: 'Não' }, { value: 0, note: 'O(n)' }, { value: 2, note: 'Fácil' }],
  // LIS n²
  [{ value: 0, note: '1D' }, { value: 0, note: 'Sim' }, { value: 2, note: 'Não' }, { value: 2, note: 'Não' }, { value: 2, note: 'O(n) — sem melhora' }, { value: 1, note: 'Médio' }],
  // LIS n log n
  [{ value: 0, note: '1D' }, { value: 0, note: 'Sim' }, { value: 2, note: 'Não' }, { value: 2, note: 'Não' }, { value: 0, note: 'O(n) tails array' }, { value: 2, note: 'Difícil' }],
  // Word Break
  [{ value: 0, note: '1D' }, { value: 0, note: 'Sim' }, { value: 2, note: 'Não' }, { value: 2, note: 'Não' }, { value: 2, note: 'Sem otimização clara' }, { value: 1, note: 'Médio' }],
  // Burst Balloons
  [{ value: 2, note: '2D interval' }, { value: 2, note: 'Não' }, { value: 0, note: 'Sim (interval)' }, { value: 2, note: 'Não' }, { value: 2, note: 'Sem' }, { value: 0, note: 'Hard!' }],
]

const DP_PATTERN_ROW_GROUPS: HeatRowGroup[] = [
  { label: 'DP 1D Linear', rows: ['Fibonacci / Climbing Stairs', 'House Robber'] },
  { label: 'Knapsack / Coin Change', rows: ['Coin Change (min)', 'Coin Change II (contagem)', 'Knapsack 0/1', 'Knapsack Unbounded'] },
  { label: 'DP 2D em Strings', rows: ['LCS / Edit Distance', 'Longest Palindromic Subseq', 'Unique Paths (grid)'] },
  { label: 'Sequência / Avançado', rows: ['LIS (n²)', 'LIS (n log n)', 'Word Break', 'Burst Balloons (interval)'] },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — ComparisonTable: DP vs Greedy vs Divide and Conquer
// ═══════════════════════════════════════════════════════════════════════════════

const PARADIGM_OPTIONS: ComparisonOption[] = [
  { id: 'dp',     label: 'Dynamic Programming', sublabel: 'Memo + recorrência', color: C },
  { id: 'greedy', label: 'Greedy',               sublabel: 'Escolha local ótima', color: AMB },
  { id: 'dc',     label: 'Divide & Conquer',     sublabel: 'Divisão independente', color: SKY },
  { id: 'bt',     label: 'Backtracking',          sublabel: 'Exploração exaustiva', color: RED },
]

const PARADIGM_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'overlap',
    label: 'Subproblemas sobrepostos',
    category: 'Propriedades',
    description: 'Os mesmos subproblemas aparecem múltiplas vezes?',
    values: {
      dp:     { rating: 'excellent', note: 'Sim — memoização elimina recomputation' },
      greedy: { rating: 'poor',      note: 'Não relevante — uma passagem' },
      dc:     { rating: 'poor',      note: 'Não — cada subproblema é único' },
      bt:     { rating: 'poor',      note: 'Pode haver, mas não é memo' },
    },
  },
  {
    id: 'optimal-local',
    label: 'Escolha local = global',
    category: 'Propriedades',
    description: 'Decisão ótima agora garante ótimo global?',
    values: {
      dp:     { rating: 'poor',      note: 'Não — decisões são dependentes' },
      greedy: { rating: 'excellent', note: 'Sim — provável com exchange argument' },
      dc:     { rating: 'na',        note: 'N/A — combina resultados' },
      bt:     { rating: 'poor',      note: 'Não — explora todos os caminhos' },
    },
  },
  {
    id: 'complexity',
    label: 'Complexidade típica',
    category: 'Performance',
    values: {
      dp:     { rating: 'good',      note: 'O(n), O(nm), O(n·W) — polinomial' },
      greedy: { rating: 'excellent', note: 'O(n) ou O(n log n) — linear/quase-linear' },
      dc:     { rating: 'good',      note: 'O(n log n) — Master Theorem' },
      bt:     { rating: 'poor',      note: 'O(2ⁿ), O(n!) — exponencial com poda' },
    },
  },
  {
    id: 'proof',
    label: 'Requer prova de corretude',
    category: 'Dificuldade',
    values: {
      dp:     { rating: 'good',      note: 'Recorrência e base case corretos — menos propenso a erro' },
      greedy: { rating: 'poor',      note: 'Requer prova formal (exchange argument) — fácil de errar' },
      dc:     { rating: 'fair',      note: 'Master Theorem prova complexidade' },
      bt:     { rating: 'excellent', note: 'Trivialmente correto se completar busca' },
    },
  },
  {
    id: 'examples',
    label: 'Exemplos clássicos',
    category: 'Prática',
    values: {
      dp:     { rating: 'excellent', note: 'Coin Change, Knapsack, LCS, Edit Distance, LIS' },
      greedy: { rating: 'excellent', note: 'Dijkstra, Activity Selection, Huffman, Jump Game I' },
      dc:     { rating: 'good',      note: 'Merge Sort, Quick Sort, Binary Search, Closest Pair' },
      bt:     { rating: 'good',      note: 'N-Queens, Sudoku, Combinations, Permutations' },
    },
  },
  {
    id: 'when-use',
    label: 'Usar quando',
    category: 'Decisão',
    values: {
      dp:     { rating: 'excellent', note: 'Max/min/count + subproblemas se repetem' },
      greedy: { rating: 'good',      note: 'Consegue provar exchange argument' },
      dc:     { rating: 'good',      note: 'Subproblemas independentes + recombinar' },
      bt:     { rating: 'fair',      note: 'Precisa de todas as soluções ou é NP' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Anti-patterns de DP
// ═══════════════════════════════════════════════════════════════════════════════

const DP_ANTI_PATTERNS: AntiPattern[] = [
  {
    title: 'Recursão sem memoização (O(2ⁿ) desnecessário)',
    wrong: [
      [{ text: '// Fibonacci sem memo — O(2ⁿ)', color: '#475569' }],
      [{ text: 'def fib(n):', color: FG }],
      [{ text: '    if n < 2: return n', color: FG }],
      [{ text: '    return fib(n-1) + fib(n-2)  # recomputa!', color: RED }],
      [{ text: '# fib(40): 2⁴⁰ = ~10⁹ chamadas', color: RED }],
    ],
    right: [
      [{ text: '// Com memo — O(n)', color: '#475569' }],
      [{ text: 'from functools import lru_cache', color: GRN }],
      [{ text: '@lru_cache(maxsize=None)', color: GRN }],
      [{ text: 'def fib(n):', color: FG }],
      [{ text: '    if n < 2: return n', color: FG }],
      [{ text: '    return fib(n-1) + fib(n-2)', color: FG }],
      [{ text: '# fib(40): 40 chamadas únicas', color: GRN }],
    ],
    why: 'Qualquer recursão que chama a si mesma mais de uma vez com os mesmos argumentos é exponencial sem memo. Identifique pelo fato de que a árvore de recursão tem nós repetidos.',
  },
  {
    title: 'Estado incompleto (falta dimensão no dp)',
    wrong: [
      [{ text: '// Knapsack com estado só de índice', color: '#475569' }],
      [{ text: 'dp = [0] * (n + 1)', color: RED }],
      [{ text: 'for i in range(n):', color: FG }],
      [{ text: '    dp[i+1] = dp[i] + values[i]  # errado!', color: RED }],
      [{ text: '# Ignora capacidade W — sempre pega tudo', color: RED }],
    ],
    right: [
      [{ text: '// Estado correto: dp[i][c] — índice E capacidade', color: '#475569' }],
      [{ text: 'dp = [[0]*(W+1) for _ in range(n+1)]', color: GRN }],
      [{ text: 'for i in range(1, n+1):', color: FG }],
      [{ text: '    for c in range(W+1):', color: FG }],
      [{ text: '        dp[i][c] = dp[i-1][c]  # pula item', color: GRN }],
      [{ text: '        if w[i-1] <= c:', color: FG }],
      [{ text: '            dp[i][c] = max(dp[i][c],', color: GRN }],
      [{ text: '                dp[i-1][c-w[i-1]] + v[i-1])', color: GRN }],
    ],
    why: 'Estado incompleto é a causa de bugs silenciosos: o código executa sem erro mas produz respostas erradas em certos casos. O estado precisa capturar TUDO que afeta a resposta.',
  },
  {
    title: 'Greedy onde DP é necessário',
    wrong: [
      [{ text: '// Coin Change com greedy — ERRADO para moedas arbitrárias', color: '#475569' }],
      [{ text: 'def coinChange(coins, amount):', color: FG }],
      [{ text: '    coins.sort(reverse=True)', color: FG }],
      [{ text: '    count = 0', color: FG }],
      [{ text: '    for c in coins:', color: FG }],
      [{ text: '        count += amount // c', color: RED }],
      [{ text: '        amount %= c', color: RED }],
      [{ text: '    return count  # coins=[1,3,4], amount=6: 4+1+1=3 ERRADO!', color: RED }],
    ],
    right: [
      [{ text: '// DP correto — O(amount × |coins|)', color: '#475569' }],
      [{ text: 'def coinChange(coins, amount):', color: FG }],
      [{ text: '    dp = [float("inf")] * (amount + 1)', color: GRN }],
      [{ text: '    dp[0] = 0', color: GRN }],
      [{ text: '    for a in range(1, amount + 1):', color: FG }],
      [{ text: '        for c in coins:', color: FG }],
      [{ text: '            if c <= a:', color: FG }],
      [{ text: '                dp[a] = min(dp[a], dp[a-c] + 1)', color: GRN }],
      [{ text: '    return dp[amount]  # coins=[1,3,4], amount=6: 3+3=2 ✓', color: GRN }],
    ],
    why: 'Greedy funciona para moedas canônicas (1, 5, 10, 25) mas falha com moedas arbitrárias. Regra: só use greedy se você PROVOU que a escolha local é globalmente ótima.',
  },
  {
    title: 'Loop em direção errada no Knapsack',
    wrong: [
      [{ text: '// 0/1 Knapsack com loop para FRENTE — conta item N vezes!', color: '#475569' }],
      [{ text: 'dp = [0] * (W + 1)', color: FG }],
      [{ text: 'for i in range(n):', color: FG }],
      [{ text: '    for c in range(w[i], W+1):  # FRENTE = unbounded!', color: RED }],
      [{ text: '        dp[c] = max(dp[c], dp[c-w[i]] + v[i])', color: RED }],
      [{ text: '# dp[c-w[i]] já foi atualizado nesta iteração!', color: RED }],
    ],
    right: [
      [{ text: '// 0/1 Knapsack com loop REVERSO — usa item 1x', color: '#475569' }],
      [{ text: 'dp = [0] * (W + 1)', color: FG }],
      [{ text: 'for i in range(n):', color: FG }],
      [{ text: '    for c in range(W, w[i]-1, -1):  # REVERSO = 0/1', color: GRN }],
      [{ text: '        dp[c] = max(dp[c], dp[c-w[i]] + v[i])', color: GRN }],
      [{ text: '# dp[c-w[i]] ainda é da iteração anterior (item i-1)', color: GRN }],
    ],
    why: 'No 0/1 Knapsack, o loop de capacidade deve ser REVERSO para garantir que dp[c-w[i]] ainda reflete o estado ANTES do item i. Loop para frente permite reusar o mesmo item múltiplas vezes (unbounded).',
  },
  {
    title: 'Ler dp[n] quando resposta é max(dp)',
    wrong: [
      [{ text: '// LIS — lendo dp[n] é errado!', color: '#475569' }],
      [{ text: 'dp = [1] * n', color: FG }],
      [{ text: 'for i in range(1, n):', color: FG }],
      [{ text: '    for j in range(i):', color: FG }],
      [{ text: '        if nums[j] < nums[i]:', color: FG }],
      [{ text: '            dp[i] = max(dp[i], dp[j] + 1)', color: FG }],
      [{ text: 'return dp[n-1]  # ERRADO — LIS pode terminar em qualquer índice', color: RED }],
    ],
    right: [
      [{ text: '// LIS — resposta é max(dp), não dp[n]', color: '#475569' }],
      [{ text: 'dp = [1] * n', color: FG }],
      [{ text: 'for i in range(1, n):', color: FG }],
      [{ text: '    for j in range(i):', color: FG }],
      [{ text: '        if nums[j] < nums[i]:', color: FG }],
      [{ text: '            dp[i] = max(dp[i], dp[j] + 1)', color: FG }],
      [{ text: 'return max(dp)  # LIS pode terminar em qualquer índice', color: GRN }],
    ],
    why: 'Nem todo DP tem resposta em dp[n]. LIS: resposta é max(dp[i]) porque a subsequência crescente mais longa pode terminar em qualquer posição. Pergunte sempre: "a resposta está em dp[n] ou em algum ótimo de dp[i]?"',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Mapa de progressão em DP
// ═══════════════════════════════════════════════════════════════════════════════

const DP_PROGRESSION: ProgressionLevel[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    label: 'Junior',
    emoji: '🌱',
    concepts: [
      { name: 'Recursão + base case', tip: 'Fundação de tudo. Sem entender recursão, DP não faz sentido.' },
      { name: 'Memoization manual', tip: 'Adicionar dict/objeto de cache na recursão existente. Primeiro passo para DP.' },
      { name: 'Fibonacci com memo', tip: 'O "Hello World" de DP. Entender por que O(2ⁿ) vira O(n).' },
      { name: 'Climbing Stairs', tip: 'Fibonacci disfarçado. dp[i] = dp[i-1] + dp[i-2].' },
    ],
  },
  {
    id: 'pleno-1',
    name: 'Pleno I',
    label: 'Pleno I',
    emoji: '📐',
    concepts: [
      { name: 'Framework SETBR', tip: 'Estado + Equação + Terminal + Bottom/Top + Resposta. Aplicar antes de codar.' },
      { name: 'Coin Change', tip: 'DP 1D canônico. dp[a] = min(dp[a-c]+1). Base case dp[0]=0.' },
      { name: 'House Robber', tip: 'Decisão binária por elemento. dp[i] = max(dp[i-1], dp[i-2]+nums[i]).' },
      { name: 'Top-down vs Bottom-up', tip: 'Saber converter entre as duas. Entrevista: comece top-down para explicar.' },
    ],
  },
  {
    id: 'pleno-2',
    name: 'Pleno II',
    label: 'Pleno II',
    emoji: '🔧',
    concepts: [
      { name: 'Knapsack 0/1', tip: 'Loop de capacidade REVERSO. dp[i][c] = max(pular, incluir).' },
      { name: 'Coin Change II (contagem)', tip: 'Loop externo por moeda. Coin Change I = loop externo por amount.' },
      { name: 'LCS básico', tip: 'DP 2D. dp[i][j]: chars iguais → +1; diferentes → max(cima, esquerda).' },
      { name: 'Unique Paths', tip: 'Grid DP. dp[i][j] = dp[i-1][j] + dp[i][j-1]. Space O(n).' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Sênior',
    emoji: '⚡',
    concepts: [
      { name: 'Edit Distance (Levenshtein)', tip: '3 operações: insert, delete, replace. dp[i][j] usa dp[i-1][j-1], dp[i-1][j], dp[i][j-1].' },
      { name: 'LIS O(n²) e O(n log n)', tip: 'O(n log n) com patience sorting + binary search em tails array.' },
      { name: 'Space optimization 2D→1D', tip: 'Quando dp[i][j] depende só da linha anterior, usa 1D com cuidado no loop.' },
      { name: 'Word Break', tip: 'dp[i] = any(dp[j] and s[j:i] in dict). Loop duplo O(n²).' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Expert',
    emoji: '🎯',
    concepts: [
      { name: 'Interval DP', tip: 'dp[i][j] = ótimo no intervalo. Burst Balloons, Matrix Chain. Preenche diagonal.' },
      { name: 'Tree DP', tip: 'DFS pós-ordem. dp[nó][0/1] = ótimo sem/com nó. House Robber III.' },
      { name: 'Bitmask DP', tip: 'Estado = inteiro com bits representando subconjunto. TSP, Assignment. n ≤ 20.' },
      { name: 'Floyd-Warshall / Bellman-Ford', tip: 'DP em grafos. All-pairs shortest path vs single-source com pesos negativos.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function DynamicProgrammingVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'memo-vs-tab',
      title: 'Top-down vs Bottom-up',
      subtitle: 'Memoization vs Tabulation — o mesmo problema, duas abordagens; veja a diferença em código',
      accent: C,
      component: (
        <FeaturesCarousel
          features={MEMO_VS_TAB_FEATURES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'e-dp',
      title: 'É DP? Diagnóstico Interativo',
      subtitle: 'Árvore de decisão para identificar padrão — DP, Greedy, D&C ou Backtracking',
      accent: C,
      component: (
        <DecisionTree
          root={DP_DECISION_ROOT}
          nodes={DP_DECISION_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'dp-stepper',
      title: 'Preenchimento da Tabela DP',
      subtitle: 'Execução passo a passo: Coin Change, LCS e House Robber — veja cada dp[i] sendo calculado',
      accent: C,
      component: (
        <CodeStepper
          scenarios={DP_STEPPERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'padroes-heatmap',
      title: 'Mapa de Padrões de DP',
      subtitle: 'Heatmap: cada padrão × suas propriedades — dimensão, space opt, dificuldade',
      accent: C,
      component: (
        <HeatMap
          rows={DP_PATTERN_ROWS}
          cols={DP_PATTERN_COLS}
          data={DP_PATTERN_DATA}
          accentColor={C}
          bgColor={BG}
          lowColor={GRN}
          highColor={RED}
          rowGroups={DP_PATTERN_ROW_GROUPS}
          valueFormatter={(v) => ['Sim', 'Parcial', 'Não'][v] ?? 'Não'}
        />
      ),
    },
    {
      id: 'paradigmas',
      title: 'DP vs Greedy vs D&C vs Backtracking',
      subtitle: 'Comparação de paradigmas — quando cada um se aplica e por quê',
      accent: C,
      component: (
        <ComparisonTable
          options={PARADIGM_OPTIONS}
          criteria={PARADIGM_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'anti-patterns',
      title: 'Anti-patterns de DP',
      subtitle: 'Os 5 erros mais comuns — código errado × correto com explicação técnica',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={DP_ANTI_PATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'progressao',
      title: 'Jornada em Dynamic Programming',
      subtitle: 'Conceitos por nível — do Fibonacci ao bitmask DP sênior',
      accent: C,
      component: (
        <ProgressionMap
          levels={DP_PROGRESSION}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
  ]

  // Suprimir variáveis não usadas diretamente em JSX
  void LINE; void FG; void FGMUTE; void SKY; void C2; void CARD

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
