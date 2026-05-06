'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, DepRow, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion } from '@/components/pdfs/ComparativeRefPdf'

// ── Paleta Dynamic Programming ─────────────────────────────────────────────────
const C = '#8B5CF6'

// ── Metadados dos PDFs ─────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista — DP nível pleno/sênior',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: 20 perguntas de Dynamic Programming — reconhecimento de DP, framework SETBR, Coin Change, Knapsack, LCS, Edit Distance, LIS, Word Break, interval DP, bitmask DP — com respostas estruturadas nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet de Recorrências',
    subtitle: 'As recorrências mais cobradas em entrevista numa página',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: recorrências de Fibonacci, Coin Change, Knapsack, LCS, Edit Distance, LIS, Unique Paths, Word Break e padrões de base case, space optimization e leitura da resposta.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos de DP',
    subtitle: 'SETBR, SOG, FRENTE/TRÁS e outros truques para a entrevista',
    type: 'mnemonics',
    pages: 2,
    description: 'Mnemônicos de SETBR (5 passos de DP), SOG (DP vs Greedy vs D&C), FRENTE/TRÁS (direção do loop em Knapsack), TD=Explico/BU=Otimizo e outros truques verbais para reconhecimento e implementação rápida.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns de DP',
    subtitle: 'Os 5 erros que destroem a solução sem erro de compilação',
    type: 'antipatterns',
    pages: 3,
    description: 'Recursão sem memo (O(2ⁿ)), estado incompleto (bug silencioso), greedy onde DP é necessário, loop em direção errada no knapsack, e ler dp[n] quando resposta é max(dp).',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'comparative',
    title: 'DP vs Greedy vs D&C',
    subtitle: 'Quando usar cada paradigma — critérios e exemplos',
    type: 'comparative',
    pages: 2,
    description: 'Comparação estruturada de Dynamic Programming, Greedy, Divide and Conquer e Backtracking — subproblemas sobrepostos, otimalidade local, complexidade e exemplos canônicos. Essencial para justificar a escolha em entrevista.',
    icon: '05',
    goal: 'Tomada de decisão',
  },
]

// ── Dados: Q&A ─────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Como reconhecer se um problema é DP?',
    a: 'Três sinais clássicos:\n\n1. Pergunta por max, min ou contagem de alguma configuração ou caminho.\n2. Decisões em cada passo que afetam o que é possível nos próximos passos.\n3. Subproblemas se repetem — você percebe na recursão que está computando a mesma coisa várias vezes.\n\nAnti-sinal: cada subproblema é único (sem sobreposição) → é Divide and Conquer. Greedy funciona quando a escolha local ótima é globalmente ótima — tente provar isso antes de usar.\n\nPasso prático: escreva a recursão ingênua primeiro. Se a árvore de recursão tem nós repetidos → é DP.',
    tip: 'O teste mais rápido: escreva a recursão sem memo e pergunte "fib(3) vai ser chamado mais de uma vez?". Se sim, é DP.',
  },
  {
    level: 'Pleno',
    q: 'Explique o framework de 5 passos para DP (SETBR).',
    a: 'SETBR — Estado, Equação, Terminal, Bottom/Top, Resposta:\n\n1. Estado: quais variáveis descrevem unicamente um subproblema? (dp[i]? dp[i][j]? dp[i][c]?)\n2. Equação de transição: como dp[estado_atual] se relaciona com estados anteriores?\n3. Terminal (base case): qual o valor de dp nos casos mais simples? Inicialização errada = bug silencioso.\n4. Bottom-up ou Top-down: top-down para explicar; bottom-up para otimizar espaço.\n5. Resposta: onde está? dp[n]? dp[n][W]? max(dp[i])? LIS = max(dp) — não dp[n].\n\nVerbalize antes de escrever qualquer código.',
    tip: 'Em entrevista, diga em voz alta: "dp[i] é o máximo que posso roubar nas primeiras i casas". Isso mostra que você entende o estado antes de qualquer código.',
  },
  {
    level: 'Pleno',
    q: 'Resolva Fibonacci com memo e com bottom-up.',
    a: 'Top-down com memo:\n  memo = {}\n  def fib(n):\n      if n < 2: return n\n      if n in memo: return memo[n]\n      memo[n] = fib(n-1) + fib(n-2)\n      return memo[n]\n  # O(n) tempo, O(n) espaço\n\nBottom-up:\n  dp = [0, 1]\n  for i in range(2, n+1): dp.append(dp[-1] + dp[-2])\n  # O(n) tempo, O(n) espaço\n\nBottom-up com O(1) espaço (rolling variables):\n  a, b = 0, 1\n  for _ in range(n): a, b = b, a + b\n  return a\n  # O(1) espaço — só guarda os 2 últimos\n\nA versão O(1) é a que impressiona o entrevistador.',
    tip: 'Bottom-up O(1) é a pergunta de follow-up esperada. "Como você reduziria o espaço?" — rolling variables. dp[i] depende só de dp[i-1] e dp[i-2] → dois scalars bastam.',
  },
  {
    level: 'Pleno',
    q: 'Como modelar Coin Change (mínimo de moedas)?',
    a: 'Estado: dp[a] = mínimo de moedas para atingir amount a.\nRecorrência: para cada moeda c: dp[a] = min(dp[a], dp[a - c] + 1)\nBase case: dp[0] = 0; dp[1..A] = infinito.\nResposta: dp[target]. Se ainda for infinito, retorna -1.\n\n  dp = [float("inf")] * (amount + 1)\n  dp[0] = 0\n  for a in range(1, amount + 1):\n      for coin in coins:\n          if coin <= a:\n              dp[a] = min(dp[a], dp[a - coin] + 1)\n  return dp[amount] if dp[amount] != float("inf") else -1\n\nComplexidade: O(amount × |coins|) tempo, O(amount) espaço.\n\nCuidado: greedy não funciona com moedas arbitrárias. Com [1,3,4] e amount=6: greedy dá 3; DP acha 2.',
    tip: 'Sempre mencione que greedy falha com moedas arbitrárias — o entrevistador espera esse contra-exemplo.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre 0/1 Knapsack e Unbounded Knapsack?',
    a: '0/1 Knapsack: cada item pode ser usado no máximo UMA vez.\n→ Loop de capacidade REVERSO (de W para w[i]):\n  for c in range(W, w[i]-1, -1):\n      dp[c] = max(dp[c], dp[c-w[i]] + v[i])\nReverso garante que dp[c-w[i]] ainda reflete o estado ANTES do item i.\n\nUnbounded Knapsack: cada item pode ser usado INFINITAS vezes.\n→ Loop de capacidade PARA FRENTE (de w[i] para W):\n  for c in range(w[i], W+1):\n      dp[c] = max(dp[c], dp[c-w[i]] + v[i])\nPara frente permite reusar o item na mesma iteração.\n\nEssa diferença de direção é sutil mas fundamental. Inverter causa bug silencioso.',
    tip: 'Mnemônico: TRÁS = zero ou um (0/1 Knapsack). FRENTE = infinito (Unbounded). A direção do loop é O critério que diferencia os dois.',
  },
  {
    level: 'Pleno',
    q: 'Explique Edit Distance (distância de Levenshtein).',
    a: 'Estado: dp[i][j] = mínimo de operações para transformar s1[0..i-1] em s2[0..j-1].\n\nRecorrência:\n• Se s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1] (sem custo)\n• Senão: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n  (delete, insert, replace)\n\nBase cases:\n• dp[i][0] = i (deletar i chars de s1)\n• dp[0][j] = j (insertar j chars)\n\nComplexidade: O(mn) tempo, O(mn) espaço (reduzível a O(min(m,n)) com rolling row).',
    tip: 'Memorize: "se iguais, grátis (diagonal); se diferentes, custa 1 + melhor das 3 direções".',
  },
  {
    level: 'Pleno',
    q: 'Coin Change II: contar combinações vs permutações.',
    a: 'Coin Change II: número de COMBINAÇÕES de moedas que somam amount.\n\nChave: para não contar [1,2] e [2,1] como distintas, o loop externo é por moeda:\n  dp = [0] * (amount + 1)\n  dp[0] = 1\n  for coin in coins:       # externo = moeda\n      for a in range(coin, amount + 1):\n          dp[a] += dp[a - coin]\n\nSe inverter os loops (amount externo, moeda interno), conta permutações — Combination Sum IV.\n\nDiferença de Coin Change I: I quer MIN moedas, II quer CONTAGEM de formas.',
    tip: '"Por que loop externo por moeda?" — para garantir que cada combinação é contada uma vez. Loop externo por amount contaria a mesma moeda em ordens diferentes.',
  },
  {
    level: 'Pleno',
    q: 'Como resolver Unique Paths com DP e otimizar o espaço?',
    a: 'Grid m×n, mover só para baixo ou direita. Contar caminhos únicos de (0,0) a (m-1,n-1).\n\nEstado: dp[i][j] = número de caminhos para (i,j).\nRecorrência: dp[i][j] = dp[i-1][j] + dp[i][j-1]\nBase case: dp[0][j] = 1, dp[i][0] = 1\n\nO(n) espaço com 1D:\n  dp = [1] * n\n  for _ in range(1, m):\n      for j in range(1, n):\n          dp[j] += dp[j-1]\n  return dp[n-1]\n\nAlternativa matemática: C(m+n-2, m-1) → O(1) espaço.',
    tip: '"Como otimizar para O(1)?" — resposta matemática: C(m+n-2, m-1). Mencionar isso mostra conhecimento além do DP mecânico.',
  },
  {
    level: 'Senior',
    q: 'LIS em O(n log n) — como e por quê?',
    a: 'O(n²) com DP: dp[i] = comprimento da LIS terminando em i. Funciona mas não passa para n=10⁵.\n\nO(n log n) com patience sorting:\ntails[i] = menor elemento que termina LIS de comprimento i+1.\n\nPara cada elemento nums[k]:\n• Binary search para encontrar a primeira posição onde tails[pos] >= nums[k]\n• Se pos == len(tails): extende LIS\n• Senão: substitui tails[pos] = nums[k]\n\n  tails = []\n  for n in nums:\n      lo, hi = 0, len(tails)\n      while lo < hi:\n          mid = (lo + hi) >> 1\n          if tails[mid] < n: lo = mid + 1\n          else: hi = mid\n      if lo == len(tails): tails.append(n)\n      else: tails[lo] = n\n  return len(tails)\n\nATENÇÃO: tails NÃO é a LIS real. Para reconstruir, precisa de predecessores separados.',
    tip: 'Explique o insight: "tails[i] é o menor elemento possível como tail de LIS de comprimento i+1. Menor tail = mais candidatos para extensão futura."',
  },
  {
    level: 'Senior',
    q: 'Como otimizar espaço em DP 2D?',
    a: 'Quando dp[i][j] depende APENAS da linha anterior (dp[i-1][...]), você pode usar um único array 1D.\n\nExemplo — LCS 2D para 1D:\n  # 1D: O(n) espaço com variável prev\n  dp = [0] * (n + 1)\n  for i in range(1, m+1):\n      prev = 0\n      for j in range(1, n+1):\n          temp = dp[j]\n          if s1[i-1] == s2[j-1]: dp[j] = prev + 1\n          else: dp[j] = max(dp[j], dp[j-1])\n          prev = temp\n\nprev guarda dp[i-1][j-1] (diagonal) que seria sobrescrito.\n\nRegra: identifique exatamente quais células a recorrência usa antes de otimizar.',
    tip: 'Entrevistador sênior espera que você mencione a otimização espontaneamente. "Posso reduzir de O(mn) para O(n) mantendo uma só linha."',
  },
  {
    level: 'Senior',
    q: 'O que é bitmask DP? Dê um exemplo.',
    a: 'Bitmask DP usa um inteiro como estado para representar um SUBCONJUNTO de elementos. Bit k em 1 = elemento k foi "visitado".\n\nClássico: Travelling Salesman Problem.\ndp[mask][i] = menor custo para visitar os nós em mask, terminando em i.\n\n  dp = [[inf] * n for _ in range(1 << n)]\n  dp[1][0] = 0  # começa no nó 0, mask=0001\n\n  for mask in range(1 << n):\n      for u in range(n):\n          if not (mask >> u & 1): continue\n          for v in range(n):\n              if mask >> v & 1: continue\n              new_mask = mask | (1 << v)\n              dp[new_mask][v] = min(dp[new_mask][v], dp[mask][u] + dist[u][v])\n\n  ans = min(dp[(1<<n)-1][i] + dist[i][0] for i in range(n))\n\nComplexidade: O(2ⁿ × n²) — viável para n ≤ 20.',
    tip: 'Quando usar: "possível subconjuntos de elementos", n ≤ 20, e DP nesse subconjunto tem subestrutura ótima.',
  },
  {
    level: 'Senior',
    q: 'Explique interval DP com Burst Balloons.',
    a: 'Interval DP: dp[i][j] = ótimo para o subproblema no intervalo [i,j]. Preenchido diagonal por diagonal (comprimentos crescentes).\n\nBurst Balloons: cada balloon tem valor nums[i]. Estourar k entre i e j dá nums[i]*nums[k]*nums[j].\n\nInsight chave: pense em qual balão estoura POR ÚLTIMO no intervalo — não o primeiro.\n  dp[i][j] = max(dp[i][k] + nums[i]*nums[k]*nums[j] + dp[k][j])\n\n  nums = [1] + nums + [1]\n  n = len(nums)\n  dp = [[0]*n for _ in range(n)]\n  for size in range(2, n):\n      for i in range(n - size):\n          j = i + size\n          for k in range(i+1, j):\n              dp[i][j] = max(dp[i][j], dp[i][k] + nums[i]*nums[k]*nums[j] + dp[k][j])\n  return dp[0][n-1]\n\nComplexidade: O(n³).',
    tip: '"Último a estourar, não o primeiro" é a chave de toda interval DP. Pensar no último cria subproblemas independentes.',
  },
  {
    level: 'Senior',
    q: 'Como fazer Tree DP? Exemplo com House Robber III.',
    a: 'Tree DP resolve subproblemas em subárvores via DFS pós-ordem: processa filhos primeiro, combina no pai.\n\nHouse Robber III: roubar em árvore binária sem dois nós adjacentes pai-filho.\nEstado por nó: retorna par (rob, skip).\n\n  def rob(root):\n      def dfs(node):\n          if not node: return (0, 0)\n          left  = dfs(node.left)\n          right = dfs(node.right)\n          rob_node  = node.val + left[1] + right[1]\n          skip_node = max(left) + max(right)\n          return (rob_node, skip_node)\n      return max(dfs(root))\n\nComplexidade: O(n) tempo, O(h) espaço.',
    tip: 'Tree DP é o padrão de retornar tupla ao invés de valor único. Cada nó retorna múltiplos cenários para que o pai possa escolher o ótimo.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre Floyd-Warshall e Bellman-Ford como DP?',
    a: 'Bellman-Ford — menor caminho de UM nó para todos:\n• DP em número de arestas. dp[k][v] = menor custo usando no máximo k arestas.\n• Itera V-1 vezes.\n• Detecta ciclo negativo: se na V-ésima iteração ainda atualiza → ciclo.\n• O(VE) tempo, O(V) espaço.\n\nFloyd-Warshall — menor caminho entre TODOS os pares:\n• DP em subconjunto de nós intermediários.\n• Recorrência: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).\n• O(V³) tempo, O(V²) espaço.\n• Detecta ciclo negativo: dist[i][i] < 0 após o algoritmo.',
    tip: 'Bellman-Ford: single-source, detecta ciclo negativo, O(VE). Floyd-Warshall: all-pairs, O(V³).',
  },
  {
    level: 'Senior',
    q: 'Como reconstruir a solução (não só o valor ótimo) em DP?',
    a: 'Guardar o valor ótimo é fácil. Reconstruir o caminho requer um array auxiliar de decisões.\n\nExemplo — Knapsack: qual itens foram incluídos?\n  chosen = [[False]*(W+1) for _ in range(n+1)]\n  # Preenche dp E chosen ao mesmo tempo\n  # chosen[i][c] = True quando item i foi incluído\n\n  # Backtrack:\n  items, i, c = [], n, W\n  while i > 0:\n      if chosen[i][c]:\n          items.append(i-1)\n          c -= w[i-1]\n      i -= 1\n\nPara LCS: backtrack pela tabela diagonal (chars iguais) ou para a célula maior (max).',
    tip: 'Mencionar espontaneamente que "é possível via backtracking com array de decisões" demonstra domínio profundo. Vale mencionar o custo extra de O(n) ou O(mn) espaço.',
  },
  {
    level: 'Senior',
    q: 'Qual o erro mais comum ao definir o estado em DP?',
    a: 'Esquecer uma dimensão — o estado incompleto. O estado precisa capturar TUDO que varia entre subproblemas e afeta a resposta.\n\nExemplos de estado incompleto:\n• Knapsack só com índice i → falta capacidade c\n• Cheapest Flights Within K Stops só com destino → falta número de paradas k\n• Edit Distance com só i → falta posição j na segunda string\n\nComo detectar: se você precisaria passar um parâmetro extra na recursão para distinguir casos, esse parâmetro pertence ao estado.\n\nBug típico: código roda sem erro mas produz respostas incorretas em casos específicos.',
    tip: 'Antes de codar, tente encontrar um contra-exemplo. "Consigo construir dois subproblemas com o mesmo estado mas respostas diferentes?" Se sim, adicione dimensão.',
  },
  {
    level: 'Pleno',
    q: 'Resolva Word Break com DP.',
    a: 'Dado string s e dicionário wordDict, determine se s pode ser segmentada em palavras do dicionário.\n\nEstado: dp[i] = True se s[0..i-1] pode ser segmentado.\nRecorrência: dp[i] = any(dp[j] and s[j:i] in wordDict for j in range(i))\nBase case: dp[0] = True (string vazia é válida).\n\n  def wordBreak(s, wordDict):\n      words = set(wordDict)\n      n = len(s)\n      dp = [False] * (n + 1)\n      dp[0] = True\n      for i in range(1, n + 1):\n          for j in range(i):\n              if dp[j] and s[j:i] in words:\n                  dp[i] = True\n                  break\n      return dp[n]\n\nComplexidade: O(n² × L) onde L = comprimento médio da palavra.',
    tip: 'dp[j] && s[j:i] in words: dp[j] garante prefixo até j válido; s[j:i] garante que o sufixo é uma palavra. Dois requisitos para dp[i] ser True.',
  },
  {
    level: 'Pleno',
    q: 'O que é Longest Palindromic Subsequence (LPS)?',
    a: 'LPS é a maior subsequência palindrômica em uma string s.\n\nEstado: dp[i][j] = comprimento da maior LPS em s[i..j].\nRecorrência:\n• Se s[i] == s[j]: dp[i][j] = dp[i+1][j-1] + 2\n• Senão: dp[i][j] = max(dp[i+1][j], dp[i][j-1])\nBase cases: dp[i][i] = 1\n\n  for i in range(n): dp[i][i] = 1\n  for length in range(2, n+1):\n      for i in range(n - length + 1):\n          j = i + length - 1\n          if s[i] == s[j]: dp[i][j] = dp[i+1][j-1] + 2\n          else: dp[i][j] = max(dp[i+1][j], dp[i][j-1])\n  return dp[0][n-1]\n\nRelação com LCS: LPS(s) = LCS(s, reversed(s)).',
    tip: '"LPS = LCS(s, reversed(s))" é o insight elegante. Ambas têm O(n²) — mas a visão LCS torna a recorrência mais intuitiva.',
  },
  {
    level: 'Pleno',
    q: 'Como abordar um problema de DP em entrevista antes de codificar?',
    a: 'Roteiro de 60-90 segundos antes de abrir o editor:\n\n1. Identifique DP: "Vejo subproblemas sobrepostos e subestrutura ótima."\n2. Defina estado em linguagem natural: "dp[i] é o máximo que posso roubar nas primeiras i casas."\n3. Escreva a recorrência: "Em cada casa, escolho roubar (dp[i-2]+nums[i]) ou pular (dp[i-1])."\n4. Identifique base cases: "dp[0]=0, dp[1]=nums[0]."\n5. Escolha implementação: "Vou usar bottom-up — sem risco de stack overflow."\n6. Identifique onde está a resposta: "dp[n] é a resposta final."\n7. Mencione complexidade: "O(n) tempo, O(1) espaço com rolling variables."\n\nNunca comece codificando em silêncio.',
    tip: 'O momento mais valioso da entrevista é antes de codar. Entrevistadores contratam desenvolvedores que pensam em voz alta e articulam trade-offs.',
  },
  {
    level: 'Senior',
    q: 'Como identificar se espaço pode ser otimizado de O(nm) para O(n)?',
    a: 'O critério é analisar quais células a recorrência usa:\n\n1. dp[i][j] depende de dp[i-1][j] SOMENTE → 1 array 1D\n2. dp[i][j] depende de dp[i][j-1] SOMENTE → 1 variável escalar\n3. dp[i][j] depende de cima + esquerda → 1 array 1D, atualiza left-to-right\n4. dp[i][j] depende da diagonal dp[i-1][j-1] → precisa de variável prev\n\nUnique Paths (caso 3):\n  dp[j] += dp[j-1]\n\nLCS (caso 4 — diagonal):\n  prev = dp[j]; dp[j] = ...; prev = temp\n\nRegra prática: desenhe um diagrama 3×3 e anote as setas de dependências.',
    tip: 'Antes de qualquer otimização, desenhe o diagrama de dependências. As setas mostram exatamente o que precisa ser guardado.',
  },
]

// ── Dados: Cheatsheet de recorrências ─────────────────────────────────────────

const RECURRENCE_HOOKS: HookItem[] = [
  { name: 'Fibonacci / Climbing Stairs', sig: 'dp[i] = dp[i-1] + dp[i-2]',                          desc: 'Base: dp[0]=0, dp[1]=1. Resposta: dp[n]. Space O(1) com vars.' },
  { name: 'House Robber',                sig: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i])',             desc: 'Decisão binária por elemento adjacente. Resposta: dp[n].' },
  { name: 'Coin Change (min)',            sig: 'dp[a] = min(dp[a], dp[a-coin] + 1)',                  desc: 'Base: dp[0]=0, resto=∞. Resposta: dp[target]. Loop: amount×coin.' },
  { name: 'Knapsack 0/1',                sig: 'dp[c] = max(dp[c], dp[c-w] + v)  [loop reverso]',    desc: 'Loop de W para w[i]. Reverso evita reusar item.' },
  { name: 'Unbounded Knapsack',          sig: 'dp[c] = max(dp[c], dp[c-w] + v)  [loop frente]',     desc: 'Loop de w[i] para W. Frente permite reusar item.' },
  { name: 'LCS',                         sig: 'dp[i][j] = dp[i-1][j-1]+1 se iguais; max(↑,←) senão', desc: 'Base: linha/col 0 = zeros. Resposta: dp[m][n].' },
  { name: 'Edit Distance',               sig: 'dp[i][j] = dp[i-1][j-1] se iguais; 1+min(↑,←,↖) senão', desc: 'Base: dp[i][0]=i, dp[0][j]=j. Resposta: dp[m][n].' },
  { name: 'Unique Paths',                sig: 'dp[i][j] = dp[i-1][j] + dp[i][j-1]',                 desc: 'Base: borda = 1. Space O(n) com 1D array.' },
  { name: 'LIS O(n²)',                   sig: 'dp[i] = max(dp[j]+1 para j<i onde nums[j]<nums[i])', desc: 'Base: dp[i]=1. Resposta: max(dp) — não dp[n]!' },
  { name: 'LIS O(n log n)',              sig: 'tails array + bisect_left por elemento',              desc: 'tails[i] = menor tail de LIS com len i+1. len(tails) = resposta.' },
  { name: 'Word Break',                  sig: 'dp[i] = any(dp[j] and s[j:i] in dict for j<i)',      desc: 'Base: dp[0]=True. Resposta: dp[n]. O(n²·L).' },
  { name: 'Interval DP',                 sig: 'dp[i][j] = opt sobre k em (i,j) de f(dp[i][k], dp[k][j])', desc: 'Preenche diagonal por diagonal (size=2 até n).' },
]

const RECURRENCE_DEP_ROWS: DepRow[] = [
  ['dp[0] = 0',            'Base case de soma/mínimo — zero é possível com zero elementos'],
  ['dp[0] = True',         'Base case booleano — string/conjunto vazio é válido'],
  ['dp[i][0] = i, dp[0][j] = j', 'Base case 2D — custo de transformar string vazia (Edit Distance, LCS)'],
  ['dp[i][i] = 1',         'Base case diagonal — palíndromo de um char tem comprimento 1 (LPS)'],
  ['resposta = dp[n]',     'Maioria dos DP 1D — Coin Change, House Robber, Fibonacci'],
  ['resposta = max(dp)',   'LIS, LCS de um array consigo mesmo — pode terminar em qualquer índice'],
  ['resposta = dp[0][n-1]','Interval DP — solução para o intervalo completo'],
]

const RECURRENCE_RULES: RuleItem[] = [
  { ok: true,  t: 'Estado = mínimo necessário: adicione uma dimensão só quando precisar distinguir subproblemas.' },
  { ok: false, t: 'Base case antes de tudo: erro de base case é silencioso — código roda mas produz respostas erradas.' },
  { ok: true,  t: 'Reverso = 0/1, Frente = ∞: loop reverso → cada item uma vez. Loop frente → reutilizável.' },
  { ok: false, t: 'Resposta nem sempre é dp[n]: LIS: max(dp). Interval DP: dp[0][n-1]. Verifique SEMPRE.' },
  { ok: true,  t: 'Space opt: desenhe as setas de dependência. Se só da linha anterior: 1D. Se diagonal: variável prev.' },
  { ok: false, t: 'Top-down para explicar: em entrevista, explique com top-down (mais natural), ofereça bottom-up como otimização.' },
]

// ── Dados: Mnemônicos ──────────────────────────────────────────────────────────

const DP_MNEMONICS: MnemonicItem[] = [
  {
    label: 'Framework de 5 passos — SETBR',
    trick: 'SETBR',
    expansion: [['S', 'State — defina o estado'], ['E', 'Equação de transição'], ['T', 'Terminal/base case'], ['B', 'Bottom-up ou top-down'], ['R', 'Resposta — nem sempre dp[n]']],
    explanation: 'Verbalize cada passo antes de codar. "dp[i] é..." é o sinal de que você entende o estado.',
    example: 'House Robber: S=dp[i] casas até i, E=max(dp[i-1], dp[i-2]+nums[i]), T=dp[0]=0, B=bottom-up, R=dp[n].',
    why: 'SETBR garante que você nunca code sem entender o estado. Estado errado = bug silencioso.',
  },
  {
    label: 'DP vs Greedy vs D&C — SOG',
    trick: 'SOG',
    expansion: [['S', 'Sobreposição de subproblemas → DP'], ['O', 'Ótima escolha local provável → Greedy'], ['G', 'Grande divisão independente → D&C']],
    explanation: 'Pergunte sempre: "esse subproblema se repete?" Se sim → DP.',
    example: 'Coin Change: subproblemas se repetem (S) → DP. Dijkstra: escolha local ótima provada (O) → Greedy.',
    why: 'Greedy só funciona com exchange argument provado. Na dúvida, use DP — é mais seguro.',
  },
  {
    label: 'Knapsack: direção do loop',
    trick: 'TRÁS = um só | FRENTE = infinito',
    expansion: [['TRÁS', 'Loop reverso W→w: 0/1 knapsack, item UMA vez'], ['FRENTE', 'Loop w→W: unbounded, item reutilizável']],
    explanation: 'A direção DEFINE o comportamento. Inverter = bug silencioso — código roda mas produz resposta errada.',
    example: 'Coin Change (reutilizável): for a in range(coin, amount+1). 0/1: for c in range(W, w[i]-1, -1).',
    why: 'É a diferença mais sutil de DP. Uma linha diferente, semântica completamente diferente.',
  },
  {
    label: 'Top-down vs Bottom-up',
    trick: 'TD = Explico, BU = Otimizo',
    expansion: [['TD', 'Top-Down: recursão + memo, natural, só visita alcançados'], ['BU', 'Bottom-Up: tabela, sem stack overflow, permite space opt']],
    explanation: 'Em entrevista: comece TD para explicar o raciocínio, ofereça BU quando perguntarem otimização.',
    example: 'Fibonacci: TD é fib(n-1)+fib(n-2) com memo. BU é for i in range(2,n+1). Rolling → O(1) espaço.',
    why: 'TD é mais legível. BU é mais eficiente. Saber ambos e quando usar cada demonstra maturidade.',
  },
  {
    label: 'Onde está a resposta?',
    trick: 'n vs MAX vs [0][n-1]',
    expansion: [['dp[n]', 'Maioria dos DP lineares e knapsack'], ['max(dp)', 'LIS e qualquer DP onde o ótimo termina em qualquer índice'], ['dp[0][n-1]', 'Interval DP — intervalo completo']],
    explanation: 'SEMPRE verifique onde está a resposta antes de retornar. É onde mais se erra.',
    example: 'LIS: return max(dp) — não dp[n-1]. Knapsack: dp[n][W]. Burst Balloons: dp[0][n-1].',
    why: 'Retornar dp[n] quando a resposta é max(dp) está tecnicamente certo no código mas errado na resposta.',
  },
  {
    label: 'State incompleto — o bug silencioso',
    trick: 'MAIS dimensão = menos bugs',
    expansion: [['Sinal', 'Dois subproblemas com mesmo estado têm respostas diferentes'], ['Fix', 'Adicione a variável de contexto como dimensão extra']],
    explanation: 'Se você precisaria passar um parâmetro extra na recursão para distinguir casos, ele pertence ao estado.',
    example: 'Cheapest Flights: estado só com destino → errado. Estado com (destino, paradas) → correto.',
    why: 'Bug silencioso: código passa nos casos simples, falha em edge cases. Mais difícil de detectar que um erro de compilação.',
  },
]

// ── Dados: Anti-patterns ───────────────────────────────────────────────────────

const DP_ANTI_PATTERNS: AntiPatternItem[] = [
  {
    title: 'Recursão sem memoização — O(2ⁿ)',
    badDesc: 'Fibonacci ingênuo recomputa fib(3) exponencialmente — O(2ⁿ) chamadas para n=40.',
    goodDesc: '@lru_cache ou dict manual: cada subproblema computado UMA vez — O(n) total.',
    why: 'A causa #1 de TLE em DP. Qualquer recursão que chama a si mesma com os mesmos argumentos é exponencial sem cache.',
    badCode: [
      { t: '# Fibonacci ingênuo — O(2ⁿ)', c: '#475569' },
      { t: '\ndef fib(n):', c: '#e2e8f0' },
      { t: '\n    if n < 2: return n', c: '#e2e8f0' },
      { t: '\n    return fib(n-1) + fib(n-2)  # recomputa!', c: '#ef4444' },
    ],
    goodCode: [
      { t: '# Com lru_cache — O(n)', c: '#475569' },
      { t: '\nfrom functools import lru_cache', c: '#22c55e' },
      { t: '\n@lru_cache(maxsize=None)', c: '#22c55e' },
      { t: '\ndef fib(n):', c: '#e2e8f0' },
      { t: '\n    if n < 2: return n', c: '#e2e8f0' },
      { t: '\n    return fib(n-1) + fib(n-2)', c: '#e2e8f0' },
    ],
  },
  {
    title: 'Greedy onde DP é necessário',
    badDesc: 'Greedy com moedas [1,3,4] e amount=6 dá 4+1+1=3 moedas — resposta errada.',
    goodDesc: 'DP encontra 3+3=2 moedas — a solução ótima que greedy não encontra.',
    why: 'Greedy falha com moedas arbitrárias. Só use greedy se puder provar exchange argument.',
    badCode: [
      { t: '# Greedy: coins=[1,3,4], amount=6 → ERRADO', c: '#475569' },
      { t: '\ncoins.sort(reverse=True)', c: '#e2e8f0' },
      { t: '\ncount = 0', c: '#e2e8f0' },
      { t: '\nfor c in coins:', c: '#e2e8f0' },
      { t: '\n    count += amount // c  # 4+1+1=3 ERRADO', c: '#ef4444' },
      { t: '\n    amount %= c', c: '#e2e8f0' },
    ],
    goodCode: [
      { t: '# DP correto — acha 3+3=2 moedas', c: '#475569' },
      { t: '\ndp = [float("inf")] * (amount + 1)', c: '#22c55e' },
      { t: '\ndp[0] = 0', c: '#22c55e' },
      { t: '\nfor a in range(1, amount + 1):', c: '#e2e8f0' },
      { t: '\n    for c in coins:', c: '#e2e8f0' },
      { t: '\n        if c <= a: dp[a] = min(dp[a], dp[a-c]+1)', c: '#22c55e' },
    ],
  },
  {
    title: 'Knapsack 0/1 com loop para frente',
    badDesc: 'Loop crescente permite reusar o mesmo item — 0/1 vira unbounded inadvertidamente.',
    goodDesc: 'Loop reverso garante que dp[c-w[i]] ainda reflete o estado ANTES do item i ser considerado.',
    why: 'Loop frente permite reusar o mesmo item múltiplas vezes — 0/1 vira unbounded inadvertidamente.',
    badCode: [
      { t: '# 0/1 Knapsack com loop FRENTE — ERRADO', c: '#475569' },
      { t: '\nfor i in range(n):', c: '#e2e8f0' },
      { t: '\n    for c in range(w[i], W+1):  # frente = unbounded!', c: '#ef4444' },
      { t: '\n        dp[c] = max(dp[c], dp[c-w[i]] + v[i])', c: '#e2e8f0' },
    ],
    goodCode: [
      { t: '# 0/1 Knapsack com loop REVERSO — correto', c: '#475569' },
      { t: '\nfor i in range(n):', c: '#e2e8f0' },
      { t: '\n    for c in range(W, w[i]-1, -1):  # reverso = 0/1', c: '#22c55e' },
      { t: '\n        dp[c] = max(dp[c], dp[c-w[i]] + v[i])', c: '#e2e8f0' },
    ],
  },
  {
    title: 'Ler dp[n] quando resposta é max(dp)',
    badDesc: 'LIS pode terminar em qualquer índice — dp[n-1] é só a LIS terminando no último elemento.',
    goodDesc: 'max(dp) retorna o comprimento da LIS global, independente de onde termina.',
    why: 'LIS pode terminar em qualquer índice — dp[n-1] é apenas a LIS terminando no último elemento, não a global.',
    badCode: [
      { t: '# LIS: dp[n-1] é ERRADO para resposta global', c: '#475569' },
      { t: '\ndp = [1] * n', c: '#e2e8f0' },
      { t: '\nfor i in range(1, n):', c: '#e2e8f0' },
      { t: '\n    for j in range(i):', c: '#e2e8f0' },
      { t: '\n        if nums[j] < nums[i]:', c: '#e2e8f0' },
      { t: '\n            dp[i] = max(dp[i], dp[j] + 1)', c: '#e2e8f0' },
      { t: '\nreturn dp[n-1]  # ERRADO!', c: '#ef4444' },
    ],
    goodCode: [
      { t: '# LIS: resposta é max(dp)', c: '#475569' },
      { t: '\ndp = [1] * n', c: '#e2e8f0' },
      { t: '\nfor i in range(1, n):', c: '#e2e8f0' },
      { t: '\n    for j in range(i):', c: '#e2e8f0' },
      { t: '\n        if nums[j] < nums[i]:', c: '#e2e8f0' },
      { t: '\n            dp[i] = max(dp[i], dp[j] + 1)', c: '#e2e8f0' },
      { t: '\nreturn max(dp)  # LIS global', c: '#22c55e' },
    ],
  },
  {
    title: 'Estado incompleto — bug silencioso',
    badDesc: 'Estado só com destino em Cheapest Flights: dois subproblemas com mesmo destino podem ter custos diferentes dependendo de paradas usadas.',
    goodDesc: 'Estado (dest, paradas): cada combinação de destino e paradas é um subproblema único.',
    why: 'Estado sem dimensão suficiente produz respostas erradas em casos específicos sem erro de execução.',
    badCode: [
      { t: '# Cheapest Flights: estado SÓ com destino — ERRADO', c: '#475569' },
      { t: '\ndist = [inf] * n', c: '#ef4444' },
      { t: '\ndist[src] = 0', c: '#e2e8f0' },
      { t: '\n# Falta: paradas restantes K no estado', c: '#ef4444' },
      { t: '\n# Dois caminhos ao mesmo dest com paradas diferentes', c: '#ef4444' },
    ],
    goodCode: [
      { t: '# Estado correto: (dest, paradas usadas)', c: '#475569' },
      { t: '\ndp = [[inf]*(k+2) for _ in range(n)]', c: '#22c55e' },
      { t: '\ndp[src][0] = 0', c: '#22c55e' },
      { t: '\n# dp[dest][stops] = menor custo chegando em dest', c: '#22c55e' },
      { t: '\n# usando exatamente stops paradas', c: '#22c55e' },
    ],
  },
]

// ── Dados: Comparativo de paradigmas ──────────────────────────────────────────

const PARADIGM_OPTIONS: CompOption[] = [
  { name: 'Dynamic Programming', color: C },
  { name: 'Greedy',              color: '#f59e0b' },
  { name: 'Divide & Conquer',    color: '#38bdf8' },
  { name: 'Backtracking',        color: '#ef4444' },
]

const PARADIGM_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Subproblemas sobrepostos',
    values: {
      'Dynamic Programming': 'Sim — memoização elimina recomputation',
      'Greedy':              'Não relevante',
      'Divide & Conquer':    'Não — cada subproblema é único',
      'Backtracking':        'Pode haver, não é o foco',
    },
    winner: 'Dynamic Programming',
  },
  {
    criterion: 'Complexidade típica',
    values: {
      'Dynamic Programming': 'O(n), O(nm), O(n·W) — polinomial',
      'Greedy':              'O(n) ou O(n log n)',
      'Divide & Conquer':    'O(n log n) — Master Theorem',
      'Backtracking':        'O(2ⁿ), O(n!) — exponencial',
    },
    winner: 'Greedy',
  },
  {
    criterion: 'Exemplos clássicos',
    values: {
      'Dynamic Programming': 'Coin Change, Knapsack, LCS, LIS, Edit Distance',
      'Greedy':              'Dijkstra, Activity Selection, Huffman, Jump Game I',
      'Divide & Conquer':    'Merge Sort, Binary Search, Closest Pair of Points',
      'Backtracking':        'N-Queens, Sudoku, Combinations, Permutations',
    },
  },
  {
    criterion: 'Usar quando',
    values: {
      'Dynamic Programming': 'Max/min/count + subproblemas se repetem',
      'Greedy':              'Prova de exchange argument existe',
      'Divide & Conquer':    'Subproblemas independentes + recombinar',
      'Backtracking':        'Precisa de todas as soluções',
    },
  },
]

// ── Builders ───────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Dynamic Programming',
    stackLabel: 'Ciência da Computação',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Dynamic Programming',
    accentColor: C,
    stackLabel: 'Recorrências & Padrões',
    sections: {
      hooks: RECURRENCE_HOOKS,
      depRows: RECURRENCE_DEP_ROWS,
      rules: RECURRENCE_RULES,
      performanceTips: [
        'Estado incompleto é o bug silencioso mais comum — sempre verifique se há parâmetros extras na recursão.',
        'Loop reverso = 0/1 (item uma vez). Loop frente = unbounded (reutilizável). Uma linha, semântica diferente.',
        'Resposta nem sempre é dp[n]: LIS = max(dp), interval DP = dp[0][n-1].',
        'Space optimization: se só depende da linha anterior, 1D array basta. Se depende da diagonal, use prev.',
        'Top-down para explicar, bottom-up para otimizar. Saber ambos demonstra maturidade.',
      ],
      patterns: [
        { name: 'Top-down (memo)', code: '@lru_cache\ndef dp(i, ...): return max(dp(i-1,...), dp(i-2,...)+x)', desc: 'Recursão natural + cache automático' },
        { name: 'Bottom-up 1D', code: 'for i in range(n): dp[i] = max(dp[i-1], dp[i-2]+nums[i])', desc: 'Tabela iterativa, sem stack overflow' },
        { name: '2D para 1D (rolling)', code: 'prev=0; for j: temp=dp[j]; dp[j]=...; prev=temp', desc: 'Elimina dimensão quando só usa linha anterior + diagonal' },
        { name: 'Interval DP', code: 'for size in 2..n: for i: j=i+size-1: for k in i..j: dp[i][j]=...', desc: 'Diagonal por diagonal, comprimentos crescentes' },
      ],
      mentalModels: [
        'Subproblemas se repetem? → DP com memo',
        'Estado = tudo que varia entre subproblemas e afeta a resposta',
        'Base case errado = bug silencioso nos edge cases',
        'Antes de retornar: é dp[n]? ou max(dp)? ou dp[0][n-1]?',
        'Loop reverso vs frente define 0/1 vs unbounded knapsack',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: DP_MNEMONICS,
    accentColor: C,
    skillName: 'Dynamic Programming',
    stackLabel: 'Padrões de Entrevista',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: DP_ANTI_PATTERNS,
    accentColor: C,
    skillName: 'Dynamic Programming',
    stackLabel: 'Erros Comuns',
  }),
  comparative: () => buildComparativeRefPdf({
    options: PARADIGM_OPTIONS,
    criteria: PARADIGM_CRITERIA,
    skillName: 'DP vs Greedy vs D&C vs Backtracking',
    accentColor: C,
    stackLabel: 'Paradigmas de Algoritmos',
    scenarios: [
      { scenario: 'Subproblemas se repetem + max/min/count', recommendation: 'Dynamic Programming', reason: 'DP é exatamente para isso: memo elimina recomputation exponencial.' },
      { scenario: 'Pode provar exchange argument', recommendation: 'Greedy', reason: 'Se a escolha local é globalmente ótima: greedy é O(n) vs O(n²) de DP.' },
      { scenario: 'Subproblemas independentes e divisíveis', recommendation: 'Divide & Conquer', reason: 'D&C sem overlap = sem necessidade de memo. Merge Sort, Quick Sort.' },
      { scenario: 'Precisa de TODAS as soluções', recommendation: 'Backtracking', reason: 'Backtracking é o único que gera todas as soluções. DP gera o valor ótimo.' },
    ],
  }),
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function DynamicProgrammingPdfs() {
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
