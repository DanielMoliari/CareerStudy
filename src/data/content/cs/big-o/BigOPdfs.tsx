'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'

// ── Paleta Big-O ──────────────────────────────────────────────────────────────
const C = '#10B981'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas de Big-O mais cobradas em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: 20 Q&As nível pleno e sênior cobrindo curvas O(1) a O(n!), análise amortizada, Master Theorem, espaço de call stack, P/NP, profiling — com respostas em HTML rico e dicas de entrevista.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet de Complexidades',
    subtitle: 'Tabela definitiva: estruturas, algoritmos e regras',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: complexidade de cada operação por estrutura (array, hash, BST, heap, trie), algoritmos de ordenação (merge, quick, heap, tim), regras de derivação (drop constants, loops aninhados), Master Theorem em uma página.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Truques para memorizar curvas e regras',
    type: 'mnemonics',
    pages: 2,
    description: 'Acrônimos que grudam: ordem das curvas (1 < log < n < ...), DROP (regras de simplificação), PAEW (tipos de análise), MASTER (Master Theorem em 6 passos), ARROZ (análise de espaço).',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
]

// ── Q&A data ──────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual a diferença entre O(n log n) e O(n²)?',
    a: 'O crescimento é radicalmente diferente:\n\n• n=1.000: O(n log n) ≈ 10.000 ops · O(n²) = 1.000.000 ops → 100x mais\n• n=1.000.000: O(n log n) ≈ 20M ops · O(n²) = 10¹² ops → 50.000x mais\n\nPor isso mergesort/quicksort existem e bubble sort não é usado em produção. A diferença que parece pequena em n pequeno vira catástrofe em escala.',
    tip: 'Use números concretos para n=1k e n=1M. A diferença de 50.000x em produção é o argumento mais forte.',
  },
  {
    level: 'Pleno',
    q: 'Por que hash map é O(1) amortizado e não O(1) garantido?',
    a: 'Em hash bem distribuído, cada bucket tem ~1 item → lookup O(1).\n\nPior caso: todos os elementos colidem no mesmo bucket (hash function ruim ou ataque adversarial) → vira lista ligada → O(n).\n\nAmortizado: quando load factor excede threshold (~0.75), rehash copia tudo em O(n). Mas acontece tão raramente (a cada dobra de capacidade) que o custo amortizado por operação é O(1).',
    tip: 'Mencione hash flooding attack como exemplo prático de pior caso O(n). Java mudou para tree em buckets >8 items para mitigar.',
  },
  {
    level: 'Pleno',
    q: 'Qual a complexidade de BFS em um grafo?',
    a: 'Tempo: O(V + E) — visita cada vértice (V) e cada aresta (E) uma vez.\n\nEspaço: O(V) — visited set + queue podem conter todos os vértices.\n\nAtenção: com matriz de adjacência, scan dos vizinhos é O(V) por vértice → total O(V²). Com lista de adjacência, é O(grau) por vértice → total O(V + E).\n\nPara grafos esparsos (E << V²), lista de adjacência é muito mais eficiente.',
    tip: 'Sempre distinguir: a complexidade depende da representação. Adj matrix → O(V²). Adj list → O(V+E).',
  },
  {
    level: 'Pleno',
    q: 'Como otimizaria um algoritmo O(n²)?',
    a: 'Padrões de otimização:\n\n• Hash map: substitui busca linear O(n) por lookup O(1) → two sum vira O(n)\n• Sort + two pointers: O(n log n) em vez de comparar todos os pares O(n²)\n• Sliding window: reaproveita trabalho da janela anterior → O(n)\n• Prefix sum: pre-processa O(n) para range queries em O(1)\n• DP / memo: elimina recomputação de subproblemas sobrepostos\n• Heap: mantém top-k em O(n log k) em vez de sort O(n log n) ou scan repetido O(n²)',
    tip: 'Tenha esses 6 padrões de otimização na ponta da língua. Em entrevista, ao ver O(n²), pergunte: "qual desses padrões se aplica?"',
  },
  {
    level: 'Senior',
    q: 'O que é análise amortizada?',
    a: 'Técnica para analisar custo por operação ao longo de uma sequência de N operações, mesmo que operações individuais variem.\n\nExemplo: ArrayList.append(). Normalmente O(1). Quando array está cheio: resize dobra o tamanho, copia tudo — O(n). Mas isso acontece a cada vez que o tamanho dobra: após 1, 2, 4, 8, 16... inserções. Custo total de N inserts: N + N/2 + N/4 + ... ≈ 2N = O(N). Custo amortizado por insert: O(N)/N = O(1).\n\nExistem 3 métodos formais: aggregate, accounting (banker\'s), e potential.',
    tip: 'Mencione os 3 métodos formais (aggregate, banker\'s, potential) — demonstra conhecimento profundo. Use o exemplo do dynamic array que é o mais clássico.',
  },
  {
    level: 'Senior',
    q: 'Quando constante importa na prática apesar do Big-O?',
    a: 'Casos onde O grande igual mas constante diferente importa:\n\n• Cache locality: scan sequencial de array é 10-100x mais rápido que acesso aleatório em hash\n• n pequeno: insertion sort (O(n²)) vence mergesort (O(n log n)) para n < ~16\n• TimSort: Python/Java usam insertion sort para "runs" pequenos e mergesort para combinar\n• Branch prediction: código sem condições aleatórias é mais rápido por causa do pipeline do CPU',
    tip: 'Cite TimSort como exemplo concreto: produção real do Python e Java usam algoritmo híbrido por essas razões. Não é teoria, é prática.',
  },
  {
    level: 'Senior',
    q: 'Como calcular complexidade de recursão com Master Theorem?',
    a: 'Para recorrências T(n) = a·T(n/b) + f(n):\n\n• Calcule c = log_b(a)\n• Compare f(n) com n^c:\n  — f(n) cresce MENOS que n^c → T(n) = O(n^c)\n  — f(n) = Θ(n^c) → T(n) = O(n^c · log n)\n  — f(n) cresce MAIS que n^c → T(n) = O(f(n))\n\nExemplos:\n• Mergesort: a=2, b=2, f=n → c=1 → f=Θ(n^c) → O(n log n)\n• Binary search: a=1, b=2, f=1 → c=0 → f=Θ(n^0) → O(log n)\n• Karatsuba: a=3, b=2, f=n → c=log₂3≈1.58 → caso 1 → O(n^1.58)',
    tip: 'Decore os 3 casos. Em entrevista, identifique a, b, f(n) primeiro — depois compare. Karatsuba é exemplo legal porque mostra um caso 1 incomum.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre O, Ω e Θ?',
    a: 'O(f(n)): limite superior — "no máximo tão ruim quanto f(n)". Big-O de pior caso.\n\nΩ(f(n)): limite inferior — "no mínimo tão bom quanto f(n)". Omega de melhor caso.\n\nΘ(f(n)): ambos os lados — "exatamente tão ruim/bom quanto f(n)". Theta = análise exata.\n\nEm entrevista usa-se O por convenção mesmo quando seria Θ.\n\nExemplo: mergesort é Θ(n log n) — melhor E pior caso são n log n. Quicksort é O(n²) pior caso mas Ω(n log n) melhor caso.',
    tip: 'Tenha pronto: "Big-O é convenção mas tecnicamente é Theta na maioria dos casos". Mostra rigor matemático sem ser pedante.',
  },
  {
    level: 'Senior',
    q: 'Como calcular espaço de call stack em recursão?',
    a: 'Cada chamada recursiva adiciona um frame à call stack. O espaço total é O(profundidade máxima).\n\n• Fibonacci T(n) = T(n-1) + T(n-2): profundidade máxima = n → O(n) espaço\n• Binary search recursivo: profundidade log n → O(log n) espaço\n• Mergesort: profundidade log n → O(log n) de call stack + O(n) para merge = O(n) total\n• Quicksort in-place: O(log n) espaço de call stack (pior caso O(n) com pivot ruim)\n\nIsso é por que tail call optimization importa — evita crescer a stack em linguagens que suportam.',
    tip: 'JavaScript V8 NÃO faz TCO em produção (apesar do ES2015 spec). Conhecer isso diferencia: "recursão profunda em JS = stack overflow real".',
  },
  {
    level: 'Senior',
    q: 'O que é amortized O(1) vs expected O(1)?',
    a: 'Amortizado O(1): garantia determinística ao longo de N operações. Não depende de aleatoriedade. Ex: ArrayList append — sempre verdadeiro independente dos dados.\n\nEsperado O(1): depende de aleatoriedade ou assumir distribuição uniforme. Ex: quicksort com pivot aleatório é O(n log n) esperado. Hash map com input adversarial pode ser O(n) esperado mas O(n²) garantido.\n\nDiferença prática: amortizado é mais forte. Em sistemas críticos (sem aleatoriedade), prefira amortizado.',
    tip: 'Em sistemas de tempo real ou hard real-time, evite estruturas com pior caso ruim — mesmo que amortizado seja bom. GC pause é exemplo.',
  },
  {
    level: 'Senior',
    q: 'Por que O(n log n) é o limite inferior para sort comparativo?',
    a: 'Argumento information-theoretic: existem n! permutações possíveis do input. Para distinguir cada uma, precisamos de pelo menos log₂(n!) decisões binárias (comparações). Por aproximação de Stirling: log₂(n!) ≈ n·log₂(n) - n/ln(2) = Θ(n log n).\n\nToda comparação produz no máximo 1 bit de informação. Logo, para reduzir n! possibilidades a 1 (a permutação ordenada), precisamos de Ω(n log n) comparações.\n\nCounting/Radix/Bucket sort quebram isso porque NÃO usam comparações — usam estrutura do input (valores limitados, dígitos). Counting sort: O(n+k). Radix: O(n·d).',
    tip: 'Mencione Stirling para mostrar formalidade matemática. E lembre: o limite vale APENAS para sort comparativo.',
  },
  {
    level: 'Senior',
    q: 'Qual a complexidade de Dijkstra e por que depende da estrutura?',
    a: 'Dijkstra com diferentes implementações:\n\n• Array simples: extrair mínimo é O(V) → total O(V² + E) = O(V²)\n• Binary heap: extract-min O(log V), decrease-key O(log V) → total O((V+E) log V)\n• Fibonacci heap: extract-min O(log V), decrease-key O(1) amortizado → total O(E + V log V)\n\nGrafo denso (E ≈ V²): array simples vence. Grafo esparso (E ≈ V): binary heap muito melhor.\n\nFibonacci heap só vale a pena teoricamente — na prática constantes ruins.',
    tip: 'Mencionar "Fibonacci heap é teoricamente melhor mas raramente usado na prática" demonstra conhecimento de teoria E prática.',
  },
  {
    level: 'Senior',
    q: 'Quando usar memoization vs tabulation em DP?',
    a: 'Memoization (top-down): recursão + cache. Mais natural para escrever, recursão segue a estrutura matemática. Custo: overhead de chamadas de função, call stack pode estourar.\n\nTabulation (bottom-up): loop iterativo preenchendo tabela. Mais rápido na prática (sem overhead de função, melhor cache locality), call stack constante. Mas exige raciocinar sobre ordem de preenchimento.\n\nAmbos têm a MESMA complexidade Big-O. Diferença é constante e estilo. Em entrevista, comece com memoization (mais intuitivo) e ofereça converter para tabulation se otimização for cobrada.',
    tip: 'Tabulation permite space optimization (rolling array) que memoization não permite naturalmente. Knapsack: O(n·W) → O(W) com tabulation.',
  },
  {
    level: 'Senior',
    q: 'Como analisar complexidade quando há entrada multidimensional?',
    a: 'Quando o input tem múltiplas dimensões, use múltiplas variáveis na complexidade. Ex: BFS em matriz m×n é O(m·n), não O(n²).\n\nCasos comuns:\n• Matrix m×n: usar O(m·n) ou O(rows·cols)\n• Grafo: O(V+E), não O(n²)\n• String com palavras: O(W·L) onde W=palavras, L=tamanho médio\n• Two arrays: O(m+n) ou O(m·n) dependendo do algoritmo\n\nErro comum: chamar tudo de "n" e perder informação. "O(n²)" para uma matriz pode esconder se é m=n=1000 vs m=10, n=10⁶.',
    tip: 'Sempre defina suas variáveis no início da resposta: "Seja m=rows, n=cols, então...". Demonstra rigor.',
  },
  {
    level: 'Senior',
    q: 'O que é P, NP, NP-completo na prática?',
    a: 'P: problemas resolvíveis em tempo polinomial — O(n^k) para algum k. Ex: sort, shortest path, MST.\n\nNP: problemas cuja solução pode ser VERIFICADA em tempo polinomial. Inclui P. Ex: dado um Sudoku resolvido, verificar é polinomial; resolver pode não ser.\n\nNP-completo: subconjunto de NP onde todo problema NP é redutível polinomialmente. Se um for resolvido em P, todos são. Ex: SAT, TSP, knapsack, subset sum.\n\nNa prática: ao reconhecer NP-completude, mude estratégia: aproximação, heurística (genéticos, simulated annealing), branch-and-bound com poda, programação inteira, ou aceitar input pequeno.',
    tip: 'Em entrevista, reconhecer NP-completude é mais valioso que tentar resolver. "Isso é variante de subset sum, NP-completo. Vou usar DP O(n·W) para input pequeno ou aproximação se W grande."',
  },
  {
    level: 'Senior',
    q: 'Como o tamanho da palavra do CPU afeta a análise de Big-O?',
    a: 'Big-O assume operações elementares O(1). Mas comparar/somar inteiros de B bits é O(B). Para inteiros que cabem em uma palavra do CPU (32 ou 64 bits), B é constante.\n\nQuando B importa:\n• Inteiros grandes (BigInt): soma é O(B), multiplicação é O(B²) ou O(B log B) com FFT\n• String comparison: O(min(len₁, len₂))\n• Hash de string: O(len) — não O(1)!\n\nEm entrevista, é comum simplificar: assumir comparação O(1) para tipos primitivos. Mas se a pergunta envolve strings ou números enormes, mencione o custo real.',
    tip: 'Hash map com chaves de string é tecnicamente O(L) por op, onde L = tamanho da chave. Mencionar isso em entrevista de sistema é diferencial.',
  },
  {
    level: 'Senior',
    q: 'Por que Quick Sort é frequentemente mais rápido que Merge Sort?',
    a: 'Em teoria empate, mas Quick Sort vence na prática:\n\n• In-place: Quick Sort O(log n) auxiliar (call stack); Merge Sort O(n) auxiliar (array temp)\n• Cache locality: Quick Sort opera em sub-arrays contíguos; Merge Sort precisa copiar\n• Constantes: o código de partição do Quick Sort é mais simples e tight que o merge\n• Pivot bom: median-of-three ou randomized evita pior caso O(n²)\n\nPor isso Java Arrays.sort() para primitivos usa Quick Sort (Dual-Pivot), e para objetos usa TimSort (variante de Merge). Stability importa para objetos — Quick Sort não é estável.',
    tip: 'Java usa Dual-Pivot QuickSort (Yaroslavskiy 2009) — é mais rápido que QS clássico em ~30%. Mencionar isso é nível sênior+.',
  },
  {
    level: 'Senior',
    q: 'Como otimizar memória de DP de O(n²) para O(n)?',
    a: 'Técnica chamada rolling array ou space-optimized DP. Funciona quando dp[i][j] depende apenas de dp[i-1][·] (linha anterior) ou de algumas células fixas.\n\nExemplo — Knapsack 0/1:\n\n// O(n·W) tempo, O(n·W) espaço:\nfor i in items: for w in 0..W:\n  dp[i][w] = max(dp[i-1][w], dp[i-1][w-items[i]]+v[i])\n\n// O(W) espaço — itera de trás pra frente:\nfor i in items: for w in W..items[i]:\n  dp[w] = max(dp[w], dp[w-items[i]]+v[i])\n\nO truque: iterar de trás para frente para que dp[w-items[i]] ainda represente a "linha anterior".',
    tip: 'Space optimization é cobrança comum em entrevista de FAANG. Saber que existe e quando aplicar é o suficiente.',
  },
  {
    level: 'Senior',
    q: 'O que é a notação "little-o" e quando usar?',
    a: 'o(f(n)): limite superior estrito — f cresce ESTRITAMENTE mais rápido que g. Formalmente: lim(g(n)/f(n)) = 0 quando n→∞.\n\nExemplos:\n• n = o(n²) — n cresce estritamente mais devagar que n²\n• log n = o(n) — log cresce estritamente mais devagar que linear\n• n = O(n) mas n ≠ o(n) — Big-O permite igualdade, little-o não\n\nUso em entrevista é raro. Aparece em provas de algoritmos, análise probabilística, e papers acadêmicos.',
    tip: 'Saber que existe e diferença com Big-O é suficiente. Não traz para resposta a menos que perguntem — pode soar pedante.',
  },
  {
    level: 'Senior',
    q: 'Como medir complexidade na prática (profiling)?',
    a: 'Big-O é teórico. Na prática, use profiling para validar:\n\n• Microbenchmark: medir N tempos com dados de tamanhos crescentes (10, 100, 1k, 10k, 100k). Plotar — a curva confirma a complexidade?\n• Profiler: Chrome DevTools Performance, Node.js --inspect, Python cProfile, Go pprof. Identifica onde tempo é gasto.\n• Big-O experimental: log-log plot do tempo vs n. Inclinação ≈ expoente. Linha horizontal: O(1). Inclinação 1: O(n). Inclinação 2: O(n²).\n\nBig-O é necessário mas não suficiente. Algoritmo O(n log n) lento em produção pode ter problema de cache, GC, IO, locks — não complexidade.',
    tip: 'Em entrevista de sistema, mencionar "medir antes de otimizar" (Knuth: premature optimization) e ferramentas de profiling diferencia.',
  },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Curvas de Big-O — ordem crescente',
    trick: '1 < log < n < n·log < n² < 2ⁿ < n!',
    expansion: [
      ['O(1)', 'Constante — array[i], hash get'],
      ['O(log n)', 'Logarítmico — binary search, BST'],
      ['O(n)', 'Linear — scan, BFS/DFS'],
      ['O(n log n)', 'Linearítmico — merge sort, heap sort'],
      ['O(n²)', 'Quadrático — nested loops, bubble sort'],
      ['O(2ⁿ)', 'Exponencial — subsets, fib recursivo'],
      ['O(n!)', 'Fatorial — permutações brutas'],
    ],
    explanation: 'Memorize as 7 curvas em ordem. Cada termo é estritamente mais lento que o anterior para n grande. Saber a ordem permite identificar otimização: se algo é O(2ⁿ), o alvo é O(n²). Se é O(n²), o alvo é O(n log n) ou O(n).',
    example: 'Para n=100: O(1)=1 op, O(log n)=7 ops, O(n)=100, O(n²)=10k, O(2ⁿ) é ASTRONÔMICO.',
    why: 'Identificar a curva atual e a curva alvo é o primeiro passo de toda otimização.',
  },
  {
    label: 'DROP — regras de simplificação',
    trick: 'Drop constants · Reduce smaller terms · Outer multiply · Parallel add',
    expansion: [
      ['D', 'Drop constants: O(5n²) = O(n²)'],
      ['R', 'Reduce smaller terms: O(n² + n) = O(n²)'],
      ['O', 'Outer loops aninhados → multiplica: for n {for n} = O(n²)'],
      ['P', 'Parallel/sequential loops → soma: for n; for n = O(2n) = O(n)'],
    ],
    explanation: 'Quatro regras para simplificar qualquer Big-O. Aplique nessa ordem em qualquer código para chegar à forma final canônica.',
    example: 'O(3n² + 5n + 7) → drop terms → O(n² + n) → drop term → O(n²). Loop {n} dentro de loop {n} → multiplica → O(n²).',
    why: 'Sem essas regras, derivações ficam ambíguas e respostas em entrevista parecem inseguras.',
  },
  {
    label: 'PAEW — tipos de análise',
    trick: 'Pior caso · Amortizado · Esperado · Worst-amortized',
    expansion: [
      ['P', 'Pior caso: garantia absoluta (heap sort = O(n log n) sempre)'],
      ['A', 'Amortizado: custo médio em N ops (ArrayList append = O(1)*)'],
      ['E', 'Esperado: depende de aleatoriedade (quicksort = O(n log n) esperado)'],
      ['W', 'Worst-amortized: pior caso da análise amortizada (raro)'],
    ],
    explanation: 'Quatro tipos de análise frequentemente confundidos. Saber distinguir é crucial — em entrevista a pergunta "qual a complexidade?" pode ter respostas diferentes dependendo de qual tipo.',
    example: 'Quicksort: pior=O(n²), esperado=O(n log n). HashMap: pior=O(n), amortizado=O(1).',
    why: 'Em sistemas críticos (sem aleatoriedade), prefira amortizado. Em FAANG, mencionar a distinção é diferencial.',
  },
  {
    label: 'MASTER — Master Theorem em 6 passos',
    trick: 'Match a · Set b · Take f · Exponent c · Read case · Result',
    expansion: [
      ['M', 'Match a — quantas subchamadas recursivas'],
      ['S', 'Set b — fator de redução (n/b)'],
      ['T', 'Take f(n) — trabalho fora da recursão'],
      ['E', 'Exponent — calcule c = log_b(a)'],
      ['R', 'Read case — compare f(n) com n^c (caso 1, 2 ou 3)'],
      ['R', 'Result — caso 1: O(n^c); caso 2: O(n^c log n); caso 3: O(f(n))'],
    ],
    explanation: 'Pratique com mergesort, binary search, karatsuba para fixar. Master Theorem só serve para divisão em subproblemas de tamanho n/b — não para T(n) = T(n-1) + ... .',
    example: 'Mergesort T(n)=2T(n/2)+n: a=2, b=2, c=log₂2=1, f(n)=n=Θ(n^1) → caso 2 → O(n log n).',
    why: 'Sem Master Theorem, calcular complexidade de divide-and-conquer exige desenhar árvore de recursão — lento e propenso a erro.',
  },
  {
    label: 'ARROZ — Análise de espaço',
    trick: 'Array auxiliares · Recursão (stack) · Resultados acumulados · Outras estruturas · Zerar in-place',
    expansion: [
      ['A', 'Array auxiliares criados — somar tamanhos'],
      ['R', 'Recursão — profundidade da call stack vira espaço'],
      ['R', 'Resultados acumulados (output) — geralmente conta'],
      ['O', 'Outras estruturas auxiliares (hash, set, queue) — somar'],
      ['Z', 'Zerar in-place se possível para reduzir'],
    ],
    explanation: 'Para calcular espaço extra, percorra essas 5 fontes. Mergesort: O(n) array + O(log n) stack = O(n). Quicksort in-place: O(log n) stack apenas.',
    example: 'BFS em grafo: visited Set O(V) + queue O(V) + sem call stack (iterativo) = O(V).',
    why: 'Entrevistadores valorizam menção explícita de espaço. Ignorar ou esquecer call stack é erro clássico de júnior.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Big-O',
    stackLabel: 'Análise de Algoritmos',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Big-O',
    accentColor: C,
    stackLabel: 'Análise de Algoritmos',
    sections: {
      hooks: [
        { name: 'O(1)',         sig: 'array[i] · hash.get() · stack.push()',          desc: 'Constante. Não depende de n. Operações ideais.' },
        { name: 'O(log n)',     sig: 'binary search · BST balanceada · heap insert',  desc: 'Logarítmico. Divide o problema pela metade. Escala infinitamente.' },
        { name: 'O(n)',         sig: 'scan · BFS/DFS · two pointers · sliding window', desc: 'Linear. Visita cada elemento uma vez. Alvo padrão.' },
        { name: 'O(n log n)',   sig: 'merge sort · heap sort · quick sort avg',       desc: 'Linearítmico. Limite teórico para sort comparativo.' },
        { name: 'O(n²)',        sig: 'bubble sort · nested loops · brute force pairs', desc: 'Quadrático. Aceitável para n ≤ 1.000. Otimize com hash/sort.' },
        { name: 'O(n³)',        sig: 'Floyd-Warshall · matrix multiplication',        desc: 'Cúbico. Aceitável para n ≤ 100. Otimize ou aceite.' },
        { name: 'O(2ⁿ)',        sig: 'subsets · fib recursivo · backtracking',        desc: 'Exponencial. Limite n ≤ 25. Adicione memoization.' },
        { name: 'O(n!)',        sig: 'permutações · TSP brute force',                 desc: 'Fatorial. Limite n ≤ 10. Geralmente NP-completo.' },
        { name: 'Master Th.',   sig: 'T(n) = a·T(n/b) + f(n)',                        desc: 'Para divide-and-conquer. 3 casos baseados em log_b(a) vs f(n).' },
        { name: 'Amortizado',   sig: 'ArrayList append · HashMap rehash',             desc: 'Custo médio em N ops. ≠ pior caso, ≠ esperado.' },
      ],
      depRows: [
        ['Hash Map',        'O(1) amortizado tudo · pior O(n) com colisões'],
        ['LinkedList',      'O(1) insert/delete (com nó) · O(n) busca'],
        ['BST balanceada',  'O(log n) tudo · mantém ordem'],
        ['Heap',            'O(log n) insert/extract · O(1) peek'],
        ['Trie',            'O(m) onde m = comprimento da chave'],
        ['Graph adj list',  'O(V+E) BFS/DFS · O(V+E) espaço'],
      ],
      rules: [
        { ok: true,  t: 'Drop constants: O(5n²) = O(n²)' },
        { ok: true,  t: 'Drop smaller terms: O(n² + n) = O(n²)' },
        { ok: true,  t: 'Loops aninhados → multiplica' },
        { ok: true,  t: 'Loops sequenciais → soma' },
        { ok: true,  t: 'Base do log não importa: O(log₂ n) = O(log n)' },
        { ok: true,  t: 'Sempre anuncie TEMPO e ESPAÇO separadamente' },
        { ok: false, t: 'Não confundir pior caso com amortizado com esperado' },
        { ok: false, t: 'Não esquecer do call stack em recursão (O(profundidade))' },
      ],
      performanceTips: [
        'Hash map troca espaço O(n) por busca O(n) → O(1)',
        'Memoization troca espaço por tempo: 2ⁿ → poly',
        'Prefix sum: range query O(n) → O(1) com pré-processamento O(n)',
        'Sort + two pointers: O(n²) → O(n log n) com auxiliar O(log n)',
        'Cache locality: scan de array sequencial supera hash para n < ~50',
      ],
      patterns: [
        { name: 'Two Sum hash', code: 'for x in arr: if (target-x in seen) return; seen.add(x)', desc: 'O(n²) → O(n) com hash. Trade espaço por tempo.' },
        { name: 'Two pointers',  code: 'l=0, r=n-1; while l<r: ajusta l ou r conforme soma', desc: 'O(n²) → O(n) em arrays ordenados.' },
        { name: 'Sliding window',code: 'l=0; for r: contrai l enquanto invariante violado', desc: 'Subarray contígua O(n).' },
        { name: 'Prefix sum',    code: 'prefix[i+1] = prefix[i] + arr[i]; range = prefix[r] - prefix[l]', desc: 'Pré-proc O(n), query O(1).' },
        { name: 'Memoization',   code: 'if (n in cache) return cache[n]; cache[n] = recurse(...)', desc: 'Elimina recomputação. 2ⁿ → poly.' },
      ],
      mentalModels: [
        'Loop simples → conta iterações → O(n)',
        'Loop aninhado mesmo input → multiplica → O(n²)',
        'Recursão T(n) = a T(n/b) + f(n) → Master Theorem',
        'Recursão T(n) = T(n-1) + f(n) → árvore linear → soma f(0..n)',
        'Espaço = arrays auxiliares + call stack + estruturas auxiliares',
        'Constante importa quando: cache, n pequeno, branch prediction',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Big-O',
    stackLabel: 'Análise de Algoritmos',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function BigOPdfs() {
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
      {open && (
        <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />
      )}
    </>
  )
}
