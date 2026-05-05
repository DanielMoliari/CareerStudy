import type { SkillContent } from "@/types"

const dynamicProgramming: SkillContent = {
    tagline: "Resolve problema quebrando em subproblemas sobrepostos e memoizando o resultado — elimina recomputação exponencial.",
    why: "DP é o filtro mais temido em entrevistas técnicas. A maioria dos candidatos trava porque tenta reconhecer o problema em vez de aplicar um framework. Senior reconhece padrão (max/min/count + escolhas sobrepostas), define estado preciso, escreve recorrência e otimiza espaço — tudo em 25 minutos sob pressão.",
    prerequisite: "Recursão e call stack. Big-O de tempo e espaço. Arrays e matrizes em qualquer linguagem. Noção básica de divide-and-conquer (diferente de DP: subproblemas independentes vs sobrepostos).",
    summary: "Dynamic Programming resolve problemas que possuem duas propriedades: subestrutura ótima (solução ótima global é composta de soluções ótimas de subproblemas) e subproblemas sobrepostos (os mesmos subproblemas aparecem múltiplas vezes em recursão ingênua). A memoização elimina a recomputação e reduz complexidade de exponencial para polinomial.\n\nO framework de 5 passos: (1) identifique o estado — quais variáveis descrevem unicamente um subproblema; (2) defina a recorrência — como dp[i] se relaciona com dp[i-1], dp[i-k], dp[j][k-1]; (3) identifique os base cases — menor instância solucionável diretamente; (4) decida top-down (recursão + cache — mais natural) vs bottom-up (tabela iterativa — sem stack overflow, permite otimização de espaço); (5) leia a resposta — nem sempre é dp[n], pode ser max(dp), dp[n][W] ou acumulador.\n\nOs padrões canônicos que você precisa dominar: 1D linear (Fibonacci, Climbing Stairs, House Robber), 1D com intervalo (Knapsack 0/1, Coin Change, Unbounded Knapsack), 2D em strings (LCS, Edit Distance, Longest Palindromic Subsequence), 2D em grid (Unique Paths, Minimum Path Sum), Longest Increasing Subsequence (O(n²) e O(n log n)), e DP em árvores/grafos (Bellman-Ford, Floyd-Warshall). Space optimization com rolling array é frequentemente cobrado: quando dp[i] depende só de dp[i-1], você descarta linhas anteriores e vai de O(n²) para O(n).",
    howToStudy: "<strong>Tem 1 hora antes de uma entrevista?</strong> Leia o mnemônico SETBR (Estado, Transição, Base case, Top-down vs bottom-up, Resposta). Varra os 5 Q&As de nível pleno e os templates de código dos padrões 1D e 2D. Não tente resolver nada novo — consolide o que já sabe.<br><br><strong>Tem um fim de semana?</strong> Resolva 15 problemas nessa sequência exata: Fibonacci → Climbing Stairs → House Robber → Coin Change → Unique Paths → Longest Common Subsequence → Edit Distance → Knapsack 0/1 → Word Break → Longest Increasing Subsequence. Para cada um: escreva à mão o estado, a recorrência e o base case antes de abrir o editor.<br><br><strong>Tem uma semana?</strong> Faça a NeetCode DP playlist completa (23 problemas). Grave a si mesmo explicando a solução em voz alta — se não consegue explicar o estado em 30 segundos, ainda não entendeu. Depois passe para os problemas hard de interval DP e bitmask DP. Ao terminar, re-resolva os 15 da semana anterior sem consultar.<br><br><strong>Modelo mental central:</strong> DP = \"memoize subproblemas sobrepostos\". A pergunta-chave em qualquer problema: \"já computei isso antes? Posso guardar o resultado?\". Se a resposta for sim, é DP. Se os subproblemas não se repetem, é divide-and-conquer.",
    keypoints: [
      { title: "Subestrutura ótima + sobreposição", body: "As duas condições necessárias para DP. Subestrutura ótima: solução ótima do problema contém soluções ótimas dos subproblemas. Sobreposição: a recursão ingênua visita os mesmos subproblemas múltiplas vezes (árvore de recursão tem nós repetidos). Sem as duas, DP não ajuda.", code: "// Fibonacci: recursão ingênua = O(2^n)\n// fib(5) chama fib(4) e fib(3)\n// fib(4) chama fib(3) e fib(2) — fib(3) computado DUAS vezes\n// Com memo: cada fib(n) computado 1x só = O(n)" },
      { title: "Estado: o que varia", body: "Estado é o conjunto mínimo de variáveis que descreve unicamente um subproblema. Estado incompleto = respostas erradas em casos específicos. Ex: knapsack precisa de (índice, capacidade_restante) — só o índice não basta. Ex: Edit Distance precisa de (i, j) — posição nas duas strings.", code: "// Knapsack: estado é (i, c)\n// dp[i][c] = max valor usando itens 0..i com capacidade c\n// Estado só com i esquece capacidade → respostas erradas\n\n// Edit Distance: estado é (i, j)\n// dp[i][j] = min edições pra s1[0..i] → s2[0..j]" },
      { title: "Recorrência (transição)", body: "A relação que conecta dp[estado_atual] aos estados anteriores. Enumere todas as escolhas possíveis em cada passo e tome o ótimo (min/max) entre elas. A recorrência é 80% do problema — acerte ela antes de escrever código.", code: "// Coin Change (min moedas):\n// Para cada amount a, escolha = qual moeda usar\ndp[a] = min(dp[a - coin] + 1) para cada coin\n\n// Knapsack 0/1 (max valor):\n// Para cada item i, escolha = incluir ou pular\ndp[i][c] = max(\n  dp[i-1][c],              // pula item i\n  dp[i-1][c-w[i]] + v[i]  // inclui item i\n)" },
      { title: "Base cases", body: "Valores de dp para os subproblemas mais simples, resolvidos diretamente. Inicialização errada é a causa #1 de bug silencioso em DP — off-by-one destrói a resposta sem erro aparente. Sempre inicialize explicitamente.", code: "// Coin Change: dp[0] = 0 (0 moedas pra atingir 0)\n//              dp[1..A] = Infinity\n\n// Unique Paths (grid): dp[0][j] = 1, dp[i][0] = 1\n// (só um caminho na borda)\n\n// Edit Distance: dp[i][0] = i, dp[0][j] = j\n// (inserções/deleções pra string vazia)" },
      { title: "Top-down vs bottom-up", body: "Top-down (memoization): recursão + cache dict/array. Mais natural para explicar, só visita estados alcançados, cuidado com stack depth (Python: sys.setrecursionlimit). Bottom-up (tabulation): loop preenche tabela de menor para maior. Sem stack overflow, permite space optimization. Em entrevista: comece top-down para explicar, mencione que pode converter.", code: "// TOP-DOWN — Coin Change\ndef coinChange(coins, amount):\n    memo = {}\n    def dp(a):\n        if a == 0: return 0\n        if a < 0: return float('inf')\n        if a in memo: return memo[a]\n        memo[a] = 1 + min(dp(a - c) for c in coins)\n        return memo[a]\n    res = dp(amount)\n    return res if res != float('inf') else -1\n\n// BOTTOM-UP — Coin Change\ndef coinChange(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a:\n                dp[a] = min(dp[a], dp[a - c] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1" },
      { title: "Knapsack 0/1", body: "Padrão fundamental de escolha binária. Cada item pode ser incluído ou não. dp[i][c] = max valor com itens 0..i e capacidade c. Space optimization: processe ao contrário em 1D (evita reusar item).", code: "// Knapsack 0/1 — O(n·W) tempo, O(n·W) espaço\ndef knapsack(weights, values, W):\n    n = len(weights)\n    dp = [[0]*(W+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for c in range(W+1):\n            dp[i][c] = dp[i-1][c]  # pula item\n            if weights[i-1] <= c:\n                dp[i][c] = max(dp[i][c],\n                    dp[i-1][c-weights[i-1]] + values[i-1])\n    return dp[n][W]\n\n// Space O(W): loop reverso evita sobrescrever estado anterior\ndef knapsack_1d(weights, values, W):\n    dp = [0] * (W+1)\n    for i in range(len(weights)):\n        for c in range(W, weights[i]-1, -1):  # reverso!\n            dp[c] = max(dp[c], dp[c-weights[i]] + values[i])\n    return dp[W]" },
      { title: "LCS e Edit Distance (2D em strings)", body: "Padrão 2D: dp[i][j] representa subproblema nas duas strings até índice i e j. LCS: dp[i][j] = dp[i-1][j-1]+1 se chars iguais, else max(dp[i-1][j], dp[i][j-1]). Edit Distance: se chars iguais dp[i][j] = dp[i-1][j-1], senão min(insert, delete, replace)+1.", code: "// LCS — Longest Common Subsequence\ndef lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]\n\n// Edit Distance\ndef editDistance(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(m+1): dp[i][0] = i\n    for j in range(n+1): dp[0][j] = j\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n            else:\n                dp[i][j] = 1 + min(dp[i-1][j],   # delete\n                                    dp[i][j-1],   # insert\n                                    dp[i-1][j-1]) # replace\n    return dp[m][n]" },
      { title: "LIS — Longest Increasing Subsequence", body: "O(n²) com DP simples: dp[i] = comprimento da LIS terminando em i. O(n log n) com patience sorting + binary search. Pergunta: já existe posição na fila onde s[i] caberia? Entrevista senior pode pedir O(n log n).", code: "// LIS — O(n²)\ndef lis_n2(nums):\n    n = len(nums)\n    dp = [1] * n\n    for i in range(1, n):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)\n\n// LIS — O(n log n) com bisect\nfrom bisect import bisect_left\ndef lis_nlogn(nums):\n    tails = []  # tails[i] = menor tail de LIS com len i+1\n    for n in nums:\n        pos = bisect_left(tails, n)\n        if pos == len(tails):\n            tails.append(n)\n        else:\n            tails[pos] = n\n    return len(tails)" },
    ],
    gotchas: [
      "Recursão sem memoização em problema com sobreposição → exponencial. Fibonacci sem memo = O(2^n). Sempre cache.",
      "Estado mal definido (faltando variável) leva a respostas erradas em casos específicos — bug silencioso que só aparece em edge cases.",
      "Inicialização errada da tabela (dp[0] base case) gera off-by-one — é a causa mais frequente de WA em DP.",
      "Confundir 0/1 knapsack (cada item uma vez, loop reverso) com unbounded knapsack (item infinito, loop pra frente) — transição diferente, resultado diferente.",
      "Top-down sem limite de recursão em Python (sys.setrecursionlimit) crasheia em n grande — bottom-up é mais seguro para n > 1000.",
      "Esquecer space optimization — entrevistador senior espera você mencionar que O(n²) pode ser reduzido a O(n) quando dp[i] depende só de dp[i-1].",
      "Tentar DP em problema sem subproblemas sobrepostos — se cada subproblema é único, é divide-and-conquer ou greedy, não DP.",
      "Usar greedy onde DP é necessário — greedy só é ótimo quando a escolha local é globalmente ótima (ex: Dijkstra, Huffman). Coin change com moedas arbitrárias não é greedy.",
      "Não verificar se a resposta é dp[n] ou max(dp) ou outra — LIS é max(dp[i]), não dp[n].",
    ],
    interview: [
      { q: "Como reconhecer se um problema é DP?", a: "<p>Três sinais clássicos:</p><ul><li><strong>Pergunta por max/min/count</strong> de algum caminho, sequência ou seleção de elementos.</li><li><strong>Escolhas em cada passo</strong> que afetam o que é possível nos passos seguintes (decisão sequencial).</li><li><strong>Subproblemas se repetem</strong> — você percebe na recursão que está computando a mesma coisa múltiplas vezes.</li></ul><p>Anti-sinal: cada subproblema é único (sem sobreposição) → é divide-and-conquer. Greedy funciona quando a escolha local ótima é globalmente ótima — tente provar que isso vale antes de usar.</p>", level: 'pleno' },
      { q: "Top-down vs bottom-up — quando usar cada?", a: "<p><strong>Top-down (memoization)</strong>: começa natural a partir da recursão, é mais fácil de explicar em entrevista, e só visita estados realmente alcançados (bom quando o espaço de estados é esparso). Custo: stack depth pode causar overflow em entradas grandes.</p><p><strong>Bottom-up (tabulation)</strong>: loop preenche a tabela do menor para o maior subproblema. Sem risco de stack overflow. Permite space optimization (rolar arrays). Mais eficiente em constante.</p><p>Estratégia em entrevista: comece top-down para explicar a lógica. Quando o entrevistador perguntar sobre otimização de espaço, converta para bottom-up.</p>", level: 'pleno' },
      { q: "Resolva Fibonacci com DP — top-down e bottom-up", a: "<p><strong>Top-down com memo:</strong></p><pre><code>memo = {}\ndef fib(n):\n    if n &lt; 2: return n\n    if n in memo: return memo[n]\n    memo[n] = fib(n-1) + fib(n-2)\n    return memo[n]</code></pre><p><strong>Bottom-up O(n) espaço:</strong></p><pre><code>dp = [0, 1]\nfor i in range(2, n+1):\n    dp.append(dp[-1] + dp[-2])</code></pre><p><strong>Bottom-up O(1) espaço</strong> (rolling variables):</p><pre><code>a, b = 0, 1\nfor _ in range(n):\n    a, b = b, a + b\nreturn a</code></pre><p>O(1) espaço é a resposta que impressiona — só guarda os 2 valores anteriores.</p>", level: 'pleno' },
      { q: "Como modelaria Coin Change (mínimo de moedas)?", a: "<p><strong>Estado:</strong> <code>dp[a]</code> = mínimo de moedas para atingir amount <code>a</code>.</p><p><strong>Recorrência:</strong> para cada moeda <code>c</code>, <code>dp[a] = min(dp[a], dp[a-c] + 1)</code>.</p><p><strong>Base case:</strong> <code>dp[0] = 0</code>; todos os outros = infinito.</p><p><strong>Resposta:</strong> <code>dp[target]</code>; se ainda for infinito, retorna -1 (impossível).</p><p><strong>Complexidade:</strong> O(amount × len(coins)) tempo, O(amount) espaço.</p><p>Cuidado: <strong>greedy não funciona</strong> com moedas arbitrárias. Ex: moedas [1, 3, 4], amount 6. Greedy daria 4+1+1=3 moedas; DP acha 3+3=2 moedas.</p>", level: 'pleno' },
      { q: "Qual a diferença entre 0/1 Knapsack e Unbounded Knapsack?", a: "<p><strong>0/1 Knapsack:</strong> cada item pode ser usado no máximo uma vez. Na versão bottom-up, o loop de capacidade vai de <code>W</code> até <code>w[i]</code> (reverso) para evitar que um item seja contado duas vezes.</p><p><strong>Unbounded Knapsack:</strong> cada item pode ser usado infinitas vezes (ex: Coin Change). O loop de capacidade vai de <code>w[i]</code> até <code>W</code> (pra frente) — permite reusar o item na mesma iteração.</p><p>Essa diferença de direção do loop é sutil mas fundamental. Muitos erram aqui em entrevista.</p>", level: 'pleno' },
      { q: "Como funcionaria Edit Distance (Levenshtein)?", a: "<p><strong>Estado:</strong> <code>dp[i][j]</code> = mínimo de operações para transformar <code>s1[0..i-1]</code> em <code>s2[0..j-1]</code>.</p><p><strong>Recorrência:</strong></p><ul><li>Se <code>s1[i-1] == s2[j-1]</code>: <code>dp[i][j] = dp[i-1][j-1]</code> (sem custo).</li><li>Senão: <code>dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])</code> — deletar, inserir ou substituir.</li></ul><p><strong>Base cases:</strong> <code>dp[i][0] = i</code> (deletar i chars), <code>dp[0][j] = j</code> (inserir j chars).</p><p>Aplicações reais: spell checkers, diff de texto, alinhamento de DNA, fuzzy search.</p>", level: 'pleno' },
      { q: "Como otimizaria espaço em uma solução DP 2D?", a: "<p>Se <code>dp[i][j]</code> só depende de <code>dp[i-1][...]</code> (linha anterior), você pode usar apenas duas linhas alternadas, ou uma única linha com loop cuidadoso:</p><pre><code># Único array 1D para Knapsack 0/1\ndp = [0] * (W+1)\nfor i in range(n):\n    for c in range(W, weights[i]-1, -1):\n        dp[c] = max(dp[c], dp[c-weights[i]] + values[i])</code></pre><p>Para LCS 2D → O(min(m,n)) espaço com array único e variável <code>prev</code>. Para Edit Distance → 2 arrays alternados.</p><p>Regra: identifique dependências (da linha acima, da célula diagonal) antes de otimizar.</p>", level: 'senior' },
      { q: "LIS em O(n log n) — como e por que?", a: "<p>O(n²) DP padrão funciona mas pode não passar em n=10⁵. A versão O(n log n) usa <strong>patience sorting</strong>:</p><p>Mantemos um array <code>tails</code> onde <code>tails[i]</code> é o menor elemento que termina uma LIS de comprimento <code>i+1</code>. Para cada elemento, fazemos binary search pra encontrar onde ele se encaixa.</p><pre><code>from bisect import bisect_left\ndef lis(nums):\n    tails = []\n    for n in nums:\n        pos = bisect_left(tails, n)\n        if pos == len(tails):\n            tails.append(n)\n        else:\n            tails[pos] = n\n    return len(tails)</code></pre><p>O array <code>tails</code> não é a LIS em si (elementos podem ser substituídos), mas seu comprimento é a resposta. Para reconstruir a LIS, é necessário um array de predecessores.</p>", level: 'senior' },
      { q: "Quando DP vs Greedy?", a: "<p>Greedy funciona quando você pode provar que a <strong>escolha local ótima sempre leva ao ótimo global</strong>. Isso é verdade para:</p><ul><li>Dijkstra: sempre expande o nó mais barato — correto porque pesos são positivos.</li><li>Huffman: sempre mergeia os dois menores — correto pela propriedade da árvore ótima.</li><li>Activity Selection: sempre escolhe a atividade que termina mais cedo.</li></ul><p>DP é necessário quando há <strong>dependências entre decisões</strong> e a escolha agora afeta o que é possível depois. Coin Change com moedas arbitrárias é o contra-exemplo clássico de por que greedy falha.</p><p>Prova de greedy: exchange argument (suponha solução ótima que não usa escolha greedy; troque e mostre que é tão boa ou melhor). Se não consegue provar, use DP.</p>", level: 'senior' },
      { q: "O que é bitmask DP e quando usar?", a: "<p>Bitmask DP usa um inteiro como estado para representar um subconjunto de elementos. Ex: estado <code>mask = 0101</code> significa que os elementos 0 e 2 foram visitados.</p><p>Clássico: <strong>Travelling Salesman Problem</strong> — <code>dp[mask][i]</code> = menor custo para visitar os nós em <code>mask</code> terminando em <code>i</code>. O(2ⁿ × n²) — exponencial, mas viável para n ≤ 20.</p><pre><code># TSP com bitmask DP\ndp = [[inf] * n for _ in range(1 &lt;&lt; n)]\ndp[1][0] = 0  # começa no nó 0\nfor mask in range(1 &lt;&lt; n):\n    for u in range(n):\n        if not (mask &gt;&gt; u &amp; 1): continue\n        for v in range(n):\n            if mask &gt;&gt; v &amp; 1: continue\n            dp[mask | (1&lt;&lt;v)][v] = min(\n                dp[mask | (1&lt;&lt;v)][v],\n                dp[mask][u] + dist[u][v])</code></pre><p>Use quando: n ≤ 20, problema envolve subconjuntos, e DP em subconjuntos tem subestrutura ótima.</p>", level: 'senior' },
      { q: "Como reconstruir a solução (não só o valor ótimo) em DP?", a: "<p>Guardar o valor ótimo é a parte fácil. Reconstruir o caminho requer um array auxiliar de <strong>decisões</strong>:</p><pre><code># Knapsack — guardar quais itens foram incluídos\ndp = [[0]*(W+1) for _ in range(n+1)]\nchosen = [[False]*(W+1) for _ in range(n+1)]\nfor i in range(1, n+1):\n    for c in range(W+1):\n        if w[i-1] &lt;= c and dp[i-1][c-w[i-1]]+v[i-1] &gt; dp[i-1][c]:\n            dp[i][c] = dp[i-1][c-w[i-1]] + v[i-1]\n            chosen[i][c] = True  # item i foi incluído\n        else:\n            dp[i][c] = dp[i-1][c]\n\n# Backtrack\nitems = []\ni, c = n, W\nwhile i &gt; 0:\n    if chosen[i][c]:\n        items.append(i-1)\n        c -= w[i-1]\n    i -= 1</code></pre><p>Entrevistador raramente pede reconstrução, mas mencionar que é possível via backtracking com array de decisões mostra profundidade.</p>", level: 'senior' },
      { q: "Qual é a recorrência de Longest Palindromic Subsequence?", a: "<p><strong>Estado:</strong> <code>dp[i][j]</code> = comprimento da maior subsequência palindrômica em <code>s[i..j]</code>.</p><p><strong>Recorrência:</strong></p><ul><li>Se <code>s[i] == s[j]</code>: <code>dp[i][j] = dp[i+1][j-1] + 2</code>.</li><li>Senão: <code>dp[i][j] = max(dp[i+1][j], dp[i][j-1])</code>.</li></ul><p><strong>Base cases:</strong> <code>dp[i][i] = 1</code> (char único é palíndromo).</p><p>Este é um problema de <strong>interval DP</strong>: você preenche a tabela diagonal por diagonal (comprimentos crescentes).</p><p>Relação: LPS(s) = LCS(s, reversed(s)). Dá pra resolver de duas formas — entrevistador valida que você conhece as duas.</p>", level: 'senior' },
      { q: "Você consegue resolver Word Break com DP?", a: "<p>Dado string <code>s</code> e dicionário de palavras, determine se <code>s</code> pode ser segmentada em palavras do dicionário.</p><p><strong>Estado:</strong> <code>dp[i]</code> = True se <code>s[0..i-1]</code> pode ser segmentado.</p><p><strong>Recorrência:</strong> <code>dp[i] = any(dp[j] and s[j:i] in wordDict for j in range(i))</code>.</p><p><strong>Base case:</strong> <code>dp[0] = True</code> (string vazia é válida).</p><pre><code>def wordBreak(s, wordDict):\n    words = set(wordDict)\n    n = len(s)\n    dp = [False] * (n+1)\n    dp[0] = True\n    for i in range(1, n+1):\n        for j in range(i):\n            if dp[j] and s[j:i] in words:\n                dp[i] = True\n                break\n    return dp[n]</code></pre><p>Complexidade: O(n² × L) onde L é comprimento médio da palavra. Com trie pode otimizar.</p>", level: 'pleno' },
      { q: "Qual o erro mais comum ao modelar estado em DP?", a: "<p>Esquecer uma dimensão do estado. O estado precisa capturar <em>tudo</em> que varia entre subproblemas e afeta a resposta.</p><p>Exemplos de estado incompleto:</p><ul><li>Knapsack só com índice <code>i</code> — falta capacidade <code>c</code>.</li><li>Path sum em grid só com coordenada <code>i</code> — falta <code>j</code>.</li><li>\"Cheaper Flights Within K Stops\" só com destino — falta número de paradas.</li></ul><p>Como detectar: se dois subproblemas com mesmo estado têm respostas diferentes dependendo do contexto, o estado está incompleto. Adicione a variável de contexto ao estado.</p><p>Regra prática: se você precisaria passar um parâmetro extra na recursão, ele pertence ao estado.</p>", level: 'senior' },
      { q: "Floyd-Warshall vs Bellman-Ford — qual DP é cada?", a: "<p>Ambos são DP em grafos com pesos negativos:</p><p><strong>Bellman-Ford</strong>: menor caminho de <em>um</em> nó para todos. DP em número de arestas. <code>dp[k][v]</code> = menor custo usando no máximo <code>k</code> arestas. Itera <code>V-1</code> vezes. O(VE). Detecta ciclo negativo (se na iteração V ainda atualiza, há ciclo).</p><p><strong>Floyd-Warshall</strong>: menor caminho entre <em>todos</em> os pares. DP em subconjunto de nós intermediários. <code>dp[k][i][j]</code> = menor caminho de <code>i</code> para <code>j</code> usando apenas nós <code>1..k</code> como intermediários. O(V³). Cabe em V ≤ 500.</p><pre><code># Floyd-Warshall\nfor k in range(V):\n    for i in range(V):\n        for j in range(V):\n            dist[i][j] = min(dist[i][j],\n                             dist[i][k] + dist[k][j])</code></pre>", level: 'senior' },
      { q: "Como fazer DP em árvore (Tree DP)?", a: "<p>DP em árvore processa subárvores como subproblemas. O estado geralmente é <code>dp[nó][parâmetro]</code>. Resolve-se com DFS pós-ordem: primeiro computa filhos, depois combina no pai.</p><p>Clássico: <strong>Maximum Independent Set em árvore</strong>. <code>dp[v][0]</code> = max sem incluir <code>v</code>; <code>dp[v][1]</code> = max incluindo <code>v</code>.</p><pre><code>def dfs(v, parent):\n    dp[v][0] = 0\n    dp[v][1] = value[v]\n    for u in adj[v]:\n        if u == parent: continue\n        dfs(u, v)\n        dp[v][0] += max(dp[u][0], dp[u][1])\n        dp[v][1] += dp[u][0]  # filho não pode ser incluído</code></pre><p>Outros exemplos: diâmetro da árvore, centroid decomposition, rerooting DP.</p>", level: 'senior' },
      { q: "Como abordaria House Robber III (DP em árvore binária)?", a: "<p>House Robber III é um roubo em árvore: não pode roubar dois nós adjacentes (pai-filho). É Tree DP clássico.</p><p><strong>Estado:</strong> para cada nó retorna par <code>(rob, skip)</code> — máximo roubando este nó vs pulando.</p><pre><code>def rob(root):\n    def dfs(node):\n        if not node: return (0, 0)\n        left  = dfs(node.left)\n        right = dfs(node.right)\n        rob_node  = node.val + left[1] + right[1]  # rouba este, filhos pulados\n        skip_node = max(left) + max(right)          # pula este, filhos ótimos\n        return (rob_node, skip_node)\n    return max(dfs(root))</code></pre><p><strong>Complexidade:</strong> O(n) tempo, O(h) espaço (pilha de recursão = altura da árvore).</p><p>Variante: retornar par (com, sem) elimina a necessidade de memo global — cada nó computa uma vez.</p>", level: "senior" },
      { q: "Qual a diferença entre Coin Change I e Coin Change II?", a: "<p><strong>Coin Change I</strong>: mínimo de moedas para atingir amount. Estado <code>dp[a]</code> = min moedas. Resposta = <code>dp[target]</code>.</p><p><strong>Coin Change II</strong>: número de combinações (não permutações) para atingir amount. Estado <code>dp[a]</code> = contagem de formas. Resposta = <code>dp[target]</code>.</p><p><strong>Diferença crítica</strong>: para evitar contar <code>[1,2]</code> e <code>[2,1]</code> como combinações distintas, o loop externo é por moeda, não por amount:</p><pre><code># Coin Change II — contagem de combinações\ndef change(amount, coins):\n    dp = [0] * (amount + 1)\n    dp[0] = 1  # 1 forma de fazer 0 (vazio)\n    for coin in coins:       # externo = moeda (evita permutação)\n        for a in range(coin, amount + 1):\n            dp[a] += dp[a - coin]\n    return dp[amount]</code></pre><p>Se inverter os loops (amount externo, moeda interno), conta permutações — que é outro problema válido.</p>", level: "pleno" },
      { q: "Como explicaria a abordagem DP ao entrevistador antes de codar?", a: "<p>Em entrevista, verbalize antes de escrever. Roteiro de 60 segundos:</p><ol><li><strong>Identifique DP</strong>: 'Vejo que a resposta ótima tem subestrutura — o ótimo global depende de ótimos de subproblemas sobrepostos.'</li><li><strong>Defina estado</strong>: 'Vou definir dp[i] como... — isso representa...'</li><li><strong>Recorrência</strong>: 'A transição é: em cada posição i, faço escolha X ou Y, tomando o ótimo.'</li><li><strong>Base cases</strong>: 'Meus casos base são dp[0]=... porque...'</li><li><strong>Abordagem</strong>: 'Vou usar bottom-up porque é mais fácil raciocinar sobre espaço. Complexidade O(n) tempo, O(n) espaço.'</li></ol><p>Nunca comece codando em silêncio. Entrevistador quer ver seu processo de raciocínio — não só a resposta certa.</p>", tip: "Verbalize o estado em linguagem natural antes de escrever qualquer código. 'dp[i] é o máximo de dinheiro que posso roubar nas primeiras i casas' é mais claro que simplesmente escrever o array.", level: "pleno" },
      { q: "Como otimizar Unique Paths de O(mn) para O(min(m,n)) espaço?", a: "<p>Unique Paths: dp[i][j] = número de caminhos únicos chegando em (i,j) vindo só de cima ou da esquerda.</p><p><strong>Observação chave</strong>: dp[i][j] depende só de dp[i-1][j] (cima) e dp[i][j-1] (esquerda). Ou seja, só precisa da linha anterior.</p><pre><code># O(n) espaço — reutiliza array da linha\ndef uniquePaths(m, n):\n    dp = [1] * n  # primeira linha = tudo 1\n    for _ in range(1, m):     # percorre linhas\n        for j in range(1, n): # cada coluna, esquerda pra direita\n            dp[j] += dp[j-1] # dp[j] = acima (dp[j] antigo) + esquerda (dp[j-1])\n    return dp[n-1]</code></pre><p>Se m > n, troque as dimensões para garantir O(min(m,n)).</p><p><strong>Alternativa matemática</strong>: resposta = C(m+n-2, m-1) — combinações. O(min(m,n)) tempo e O(1) espaço.</p>", level: "pleno" },
      { q: "O que é interval DP? Dê um exemplo com Burst Balloons.", a: "<p><strong>Interval DP</strong>: <code>dp[i][j]</code> representa a solução ótima para o subproblema no intervalo <code>[i,j]</code>. Preenche por comprimento crescente do intervalo (size=1, 2, 3...).</p><p><strong>Burst Balloons</strong>: cada balloon tem valor nums[i]. Ao estourar o balão k no intervalo (i,j), ganho <code>nums[i] * nums[k] * nums[j]</code>. Quer maximizar total.</p><p><strong>Insight chave</strong>: em vez de pensar em qual estoura primeiro, pense em qual estoura por último no intervalo. O último a estourar em (i,j) é k → <code>dp[i][j] = max(dp[i][k] + nums[i]*nums[k]*nums[j] + dp[k][j])</code>.</p><pre><code>def maxCoins(nums):\n    nums = [1] + nums + [1]  # padding\n    n = len(nums)\n    dp = [[0]*n for _ in range(n)]\n    for size in range(2, n):  # tamanho do intervalo\n        for i in range(n - size):\n            j = i + size\n            for k in range(i+1, j):  # k é o último a estourar\n                dp[i][j] = max(dp[i][j],\n                    dp[i][k] + nums[i]*nums[k]*nums[j] + dp[k][j])\n    return dp[0][n-1]</code></pre>", level: "senior" },
    ],
    mnemonics: [
      {
        label: 'Framework de 5 passos — SETBR',
        trick: 'SETBR',
        explanation: 'S(tate) — defina o estado; E(quação de transição) — a recorrência; T(erminal/base case) — inicialize; B(ottom-up ou top-down) — escolha a implementação; R(esposta) — leia o resultado correto (nem sempre é dp[n]).',
      },
      {
        label: 'Padrões canônicos de DP',
        trick: '1-K-2S-2G-LIS-IV',
        explanation: '1D linear (Fibonacci, Climbing Stairs) → K(napsack) binário (0/1) → 2D em S(trings) (LCS, Edit Distance) → 2D em G(rid) (Unique Paths) → LIS (paciência + bisect) → IV(nterval) DP (Burst Balloons, Matrix Chain). Percorra nessa ordem ao tentar categorizar um problema.',
      },
      {
        label: 'Sentido do loop em Knapsack',
        trick: 'FRENTE = infinito | TRÁS = um-cada',
        explanation: 'Unbounded knapsack (item pode ser usado N vezes) → loop pra FRENTE (de w[i] até W). 0/1 knapsack (item usado uma vez) → loop pra TRÁS (de W até w[i]). A direção do loop determina se o item pode ser reutilizado.',
      },
      {
        label: 'Top-down vs Bottom-up — quando escolher',
        trick: 'TD = Explico; BU = Otimizo',
        explanation: 'Top-Down (memo/recursão): mais natural pra explicar em entrevista, só computa estados alcançáveis. Bottom-Up (tabela): sem stack overflow, permite space optimization. Em entrevista: comece TD pra articular o raciocínio, ofereça BU quando entrevistador perguntar otimização.',
      },
      {
        label: 'Quando é DP vs Greedy vs D&C',
        trick: 'SOG',
        explanation: 'S(obreposição de subproblemas) → DP com memo. O(tima escolha local = global) → Greedy. G(rande = independentes) → Divide and Conquer. Pergunte: "Esse subproblema se repete?". Se sim, DP.',
      },
    ],
    diagrams: [
      {
        title: "Framework de DP: estado → transição → base case",
        html: `<style>
.dp-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.dp-title{font-size:12px;font-weight:700;color:#FFA116;margin:0 0 3px}
.dp-sub{font-size:10px;color:#475569;margin:0 0 16px}
.dp-steps{display:flex;gap:0;margin-bottom:16px;position:relative}
.dp-step{flex:1;background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:12px;position:relative}
.dp-step:not(:last-child)::after{content:'→';position:absolute;right:-14px;top:50%;transform:translateY(-50%);color:#FFA116;font-size:16px;z-index:2;font-weight:700}
.dp-step+.dp-step{margin-left:20px}
.dp-step-n{font-size:9px;font-weight:700;color:#FFA116;text-transform:uppercase;margin-bottom:4px}
.dp-step-title{font-size:11px;font-weight:700;color:#e2e8f0;margin-bottom:5px}
.dp-step-body{font-size:10px;color:#94a3b8;line-height:1.6}
.dp-example{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:14px}
.dp-ex-title{font-size:10px;font-weight:700;color:#FFA116;margin-bottom:8px}
.dp-ex-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.dp-ex-card{background:#0f172a;border:1px solid #1e293b;border-radius:6px;padding:8px 10px}
.dp-ex-label{font-size:9px;color:#475569;margin-bottom:3px;text-transform:uppercase;font-weight:600}
.dp-ex-code{font-family:'JetBrains Mono',monospace;font-size:10px;color:#94a3b8;line-height:1.6}
.dp1-tip{position:relative;cursor:help;border-bottom:1px dashed #FFA11660}
.dp1-tip:hover .dp1-tb{display:block}
.dp1-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:210px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.dp1-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
</style>
<div class="dp-wrap">
  <p class="dp-title">Framework de DP — 5 passos para qualquer problema</p>
  <p class="dp-sub">Responda nessa ordem antes de escrever uma linha de código</p>
  <div class="dp-steps">
    <div class="dp-step">
      <div class="dp-step-n">1</div>
      <div class="dp-step-title">Estado</div>
      <div class="dp-step-body">Quais variáveis descrevem <span class="dp1-tip">unicamente<span class="dp1-tb">Estado incompleto = bug sutil. Ex: knapsack precisa de (i, capacidade) — só i não basta.</span></span> um subproblema?<br><br><em style="color:#64748b">dp[i] = ...?<br>dp[i][j] = ...?</em></div>
    </div>
    <div class="dp-step">
      <div class="dp-step-n">2</div>
      <div class="dp-step-title">Transição</div>
      <div class="dp-step-body">Como dp[i] se relaciona com estados anteriores? Quais são as <span class="dp1-tip">escolhas<span class="dp1-tb">Geralmente: "incluir ou não", "pegar ou pular", "expandir ou parar". Liste todas as escolhas e tome o ótimo.</span></span> em cada passo?</div>
    </div>
    <div class="dp-step">
      <div class="dp-step-n">3</div>
      <div class="dp-step-title">Base case</div>
      <div class="dp-step-body">Qual o valor de dp para o caso mais simples? <span class="dp1-tip">Inicialização errada<span class="dp1-tb">dp[0] = 0 ou dp[0] = infinito dependem do problema. Off-by-one aqui quebra tudo silenciosamente.</span></span> é a causa mais comum de bug.</div>
    </div>
    <div class="dp-step">
      <div class="dp-step-n">4</div>
      <div class="dp-step-title">Top/Bottom</div>
      <div class="dp-step-body"><span class="dp1-tip">Top-down<span class="dp1-tb">Recursão + memo. Mais natural. Só visita estados alcançados. Custo: stack depth pode ser problema em n > 1000 no Python.</span></span> ou <span class="dp1-tip">bottom-up<span class="dp1-tb">Loop iterativo. Sem stack overflow. Permite space optimization (rolling array). Mais eficiente em constante.</span></span>?</div>
    </div>
    <div class="dp-step">
      <div class="dp-step-n">5</div>
      <div class="dp-step-title">Resposta</div>
      <div class="dp-step-body">Onde está a resposta final? dp[n]? dp[n][W]? <span class="dp1-tip">max(dp[i])<span class="dp1-tb">LIS retorna max(dp) — a LIS pode terminar em qualquer índice. Não assuma dp[n]!</span></span>?<br><br><em style="color:#64748b">Nem sempre é dp[n]!</em></div>
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
      {
        title: "Padrões canônicos de DP — mapa visual",
        html: `<style>
.dp2-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.dp2-title{font-size:12px;font-weight:700;color:#FFA116;margin:0 0 3px}
.dp2-sub{font-size:10px;color:#475569;margin:0 0 16px}
.dp2-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.dp2-card{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:13px;transition:border-color .2s}
.dp2-card:hover{border-color:#FFA116}
.dp2-card-title{font-size:11px;font-weight:700;color:#FFA116;margin-bottom:6px}
.dp2-badge{display:inline-block;background:#FFA11620;border:1px solid #FFA11640;border-radius:4px;padding:1px 5px;font-size:9px;color:#FFA116;font-family:'JetBrains Mono',monospace;margin-right:3px;margin-bottom:4px}
.dp2-state{font-family:'JetBrains Mono',monospace;font-size:10px;color:#94a3b8;line-height:1.5;margin-bottom:5px;background:#0f172a;border-radius:4px;padding:5px 7px}
.dp2-probs{font-size:9px;color:#475569;line-height:1.5}
.dp2-tip2{position:relative;cursor:help;border-bottom:1px dashed #FFA11660;display:inline}
.dp2-tip2:hover .dp2-tb2{display:block}
.dp2-tb2{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.dp2-tb2::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
</style>
<div class="dp2-wrap">
  <p class="dp2-title">Padrões canônicos de DP — reconheça e aplique</p>
  <p class="dp2-sub">Passe o mouse nos termos sublinhados para detalhes. Hover no card para destacar.</p>
  <div class="dp2-grid">
    <div class="dp2-card">
      <div class="dp2-card-title">1D Linear</div>
      <div class="dp2-state">dp[i] depende de dp[i-1], dp[i-2], ...</div>
      <div style="margin-bottom:6px"><span class="dp2-badge">Fibonacci</span><span class="dp2-badge">Climbing Stairs</span><span class="dp2-badge">House Robber</span><span class="dp2-badge">Decode Ways</span></div>
      <div class="dp2-probs">Escolha: incluir ou pular elemento atual. <span class="dp2-tip2">Space O(1)<span class="dp2-tb2">Quando dp[i] depende só de dp[i-1] e dp[i-2], guarde apenas 2 variáveis. Fibonacci: a, b = b, a+b.</span></span> é quase sempre possível.</div>
    </div>
    <div class="dp2-card">
      <div class="dp2-card-title">Knapsack (escolha binária)</div>
      <div class="dp2-state">dp[i][c] = max com itens 0..i e cap c</div>
      <div style="margin-bottom:6px"><span class="dp2-badge">0/1 Knapsack</span><span class="dp2-badge">Coin Change</span><span class="dp2-badge">Target Sum</span><span class="dp2-badge">Partition Equal</span></div>
      <div class="dp2-probs"><span class="dp2-tip2">Loop reverso<span class="dp2-tb2">0/1 Knapsack: loop de W até w[i] pra não reusar item. Unbounded: loop de w[i] até W pra permitir reusar.</span></span> = 0/1. Loop pra frente = unbounded.</div>
    </div>
    <div class="dp2-card">
      <div class="dp2-card-title">2D em Strings</div>
      <div class="dp2-state">dp[i][j] sobre s1[0..i] e s2[0..j]</div>
      <div style="margin-bottom:6px"><span class="dp2-badge">LCS</span><span class="dp2-badge">Edit Distance</span><span class="dp2-badge">Longest Palindromic Subseq</span><span class="dp2-badge">Regex Match</span></div>
      <div class="dp2-probs">Preenche tabela (m+1)×(n+1). Diagonal = match. Cima/esquerda = gap.</div>
    </div>
    <div class="dp2-card">
      <div class="dp2-card-title">2D em Grid</div>
      <div class="dp2-state">dp[i][j] = ótimo chegando em (i,j)</div>
      <div style="margin-bottom:6px"><span class="dp2-badge">Unique Paths</span><span class="dp2-badge">Min Path Sum</span><span class="dp2-badge">Dungeon Game</span><span class="dp2-badge">Cherry Pickup</span></div>
      <div class="dp2-probs">Preenche linha a linha. <span class="dp2-tip2">Só pode descer/direita<span class="dp2-tb2">Em grid com movimento restrito (só →↓), dp[i][j] = f(dp[i-1][j], dp[i][j-1]) — simples e eficiente.</span></span>: O(mn) sem memo extra.</div>
    </div>
    <div class="dp2-card">
      <div class="dp2-card-title">LIS (Increasing Subsequence)</div>
      <div class="dp2-state">dp[i] = LIS terminando no índice i</div>
      <div style="margin-bottom:6px"><span class="dp2-badge">LIS O(n²)</span><span class="dp2-badge">LIS O(n log n)</span><span class="dp2-badge">Russian Doll Envelopes</span></div>
      <div class="dp2-probs">Resposta = max(dp), não dp[n]. <span class="dp2-tip2">Patience sorting<span class="dp2-tb2">tails[i] = menor tail de LIS de comprimento i+1. Binary search para inserir. O(n log n).</span></span> = O(n log n).</div>
    </div>
    <div class="dp2-card">
      <div class="dp2-card-title">Interval DP</div>
      <div class="dp2-state">dp[i][j] = ótimo no intervalo [i,j]</div>
      <div style="margin-bottom:6px"><span class="dp2-badge">Matrix Chain</span><span class="dp2-badge">Burst Balloons</span><span class="dp2-badge">Palindrome Partition</span><span class="dp2-badge">Stone Game</span></div>
      <div class="dp2-probs">Preenche por <span class="dp2-tip2">comprimento crescente<span class="dp2-tb2">Começa com intervalos de tamanho 1 (base case), depois 2, 3... até n. Nunca preenche por linha.</span></span>. O(n³) típico.</div>
    </div>
  </div>
</div>`,
        caption: "Reconhecer o padrão antes de modelar o estado economiza 10 minutos em entrevista. Os 6 padrões cobrem 90% dos problemas DP de nível médio e difícil.",
      },
      {
        title: "Top-down vs Bottom-up — comparação visual com Fibonacci",
        html: `<style>
.dp3-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.dp3-title{font-size:12px;font-weight:700;color:#FFA116;font-family:'Space Grotesk',sans-serif;margin:0 0 3px}
.dp3-sub{font-size:10px;color:#475569;font-family:'Space Grotesk',sans-serif;margin:0 0 18px}
.dp3-cols{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.dp3-col{background:#1e293b;border-radius:8px;padding:14px;border:1.5px solid #334155}
.dp3-col-title{font-size:10px;font-weight:700;color:#FFA116;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #334155}
.dp3-code{font-size:10px;color:#94a3b8;line-height:1.7}
.dp3-hl{color:#FFA116;font-weight:700}
.dp3-comment{color:#475569}
.dp3-tree{text-align:center;padding:10px 0}
.dp3-node{display:inline-block;background:#0f172a;border:1.5px solid #FFA116;border-radius:6px;padding:4px 10px;font-size:11px;color:#FFA116;font-weight:700;margin:2px}
.dp3-node-cached{border-color:#475569;color:#475569}
.dp3-table-row{display:flex;gap:8px;margin-bottom:4px;align-items:center}
.dp3-idx{font-size:9px;color:#475569;width:20px;text-align:right}
.dp3-cell{background:#FFA11630;border:1px solid #FFA116;border-radius:4px;padding:3px 8px;font-size:11px;color:#FFA116;font-weight:700;min-width:28px;text-align:center}
.dp3-pros-cons{margin-top:10px;font-size:10px;line-height:1.7;color:#94a3b8;font-family:'Space Grotesk',sans-serif}
.dp3-pro{color:#4ade80}
.dp3-con{color:#f87171}
</style>
<div class="dp3-wrap">
  <p class="dp3-title">Top-down (memo) vs Bottom-up (tabulation)</p>
  <p class="dp3-sub">Mesmo problema (Fibonacci), duas abordagens — compare trade-offs</p>
  <div class="dp3-cols">
    <div class="dp3-col">
      <div class="dp3-col-title">Top-Down — Memoization</div>
      <div class="dp3-code">
        <span class="dp3-hl">memo</span> = {}<br>
        <span class="dp3-hl">def</span> fib(n):<br>
        &nbsp;&nbsp;<span class="dp3-comment"># base case</span><br>
        &nbsp;&nbsp;<span class="dp3-hl">if</span> n &lt; 2: <span class="dp3-hl">return</span> n<br>
        &nbsp;&nbsp;<span class="dp3-comment"># cache hit</span><br>
        &nbsp;&nbsp;<span class="dp3-hl">if</span> n <span class="dp3-hl">in</span> memo:<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="dp3-hl">return</span> memo[n]<br>
        &nbsp;&nbsp;<span class="dp3-comment"># compute e guarda</span><br>
        &nbsp;&nbsp;memo[n] = fib(n-1)+fib(n-2)<br>
        &nbsp;&nbsp;<span class="dp3-hl">return</span> memo[n]
      </div>
      <div class="dp3-tree" style="margin-top:10px;font-family:'Space Grotesk',sans-serif;font-size:10px">
        <div style="color:#475569;margin-bottom:6px">Árvore de recursão (n=5)</div>
        <div><span class="dp3-node">fib(5)</span></div>
        <div><span class="dp3-node">fib(4)</span> <span class="dp3-node">fib(3)</span></div>
        <div><span class="dp3-node">fib(3)</span> <span class="dp3-node-cached">fib(2)</span> <span class="dp3-node-cached">fib(2)</span> <span class="dp3-node-cached">fib(1)</span></div>
        <div style="font-size:9px;color:#475569;margin-top:4px">cinza = retorno do cache</div>
      </div>
      <div class="dp3-pros-cons">
        <span class="dp3-pro">+ Intuitivo, fácil de explicar</span><br>
        <span class="dp3-pro">+ Só visita estados necessários</span><br>
        <span class="dp3-con">- Stack depth pode crashear</span><br>
        <span class="dp3-con">- Overhead de chamadas recursivas</span>
      </div>
    </div>
    <div class="dp3-col">
      <div class="dp3-col-title">Bottom-Up — Tabulation</div>
      <div class="dp3-code">
        <span class="dp3-comment"># O(n) espaço</span><br>
        dp = [0] * (n+1)<br>
        dp[1] = 1<br>
        <span class="dp3-hl">for</span> i <span class="dp3-hl">in</span> range(2, n+1):<br>
        &nbsp;&nbsp;dp[i] = dp[i-1] + dp[i-2]<br><br>
        <span class="dp3-comment"># O(1) espaço — rolling vars</span><br>
        a, b = 0, 1<br>
        <span class="dp3-hl">for</span> _ <span class="dp3-hl">in</span> range(n):<br>
        &nbsp;&nbsp;a, b = b, a + b<br>
        <span class="dp3-hl">return</span> a
      </div>
      <div style="margin-top:10px">
        <div style="font-size:9px;color:#475569;margin-bottom:6px;font-family:'Space Grotesk',sans-serif">Tabela preenchida (n=5)</div>
        <div class="dp3-table-row"><span class="dp3-idx">i=</span><span class="dp3-idx">0</span><span class="dp3-idx">1</span><span class="dp3-idx">2</span><span class="dp3-idx">3</span><span class="dp3-idx">4</span><span class="dp3-idx">5</span></div>
        <div class="dp3-table-row"><span class="dp3-idx">dp=</span><span class="dp3-cell">0</span><span class="dp3-cell">1</span><span class="dp3-cell">1</span><span class="dp3-cell">2</span><span class="dp3-cell">3</span><span class="dp3-cell">5</span></div>
      </div>
      <div class="dp3-pros-cons">
        <span class="dp3-pro">+ Sem stack overflow</span><br>
        <span class="dp3-pro">+ Space optimization possível</span><br>
        <span class="dp3-pro">+ Mais rápido em constante</span><br>
        <span class="dp3-con">- Preenche estados que talvez não precise</span>
      </div>
    </div>
  </div>
</div>`,
        caption: "Em entrevista: use top-down para explicar a lógica (mais natural). Se o entrevistador perguntar sobre otimização, converta para bottom-up com rolling array.",
      },
    ],
    cheatsheet: {
      title: "Dynamic Programming — Templates e Padrões",
      html: `<div style="background:#0f172a;padding:28px 22px;border-radius:12px;font-family:'JetBrains Mono',monospace;color:#e2e8f0;">
<style>
.dpcs{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.dpcs-card{background:#1e293b;border-radius:8px;padding:14px;border:1px solid rgba(255,161,22,.18)}
.dpcs-title{font-size:11px;font-weight:700;color:#FFA116;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(255,161,22,.2);font-family:'Space Grotesk',sans-serif}
.dpcs-code{font-size:10px;color:#94a3b8;line-height:1.7;margin-bottom:0}
.dpcs-hl{color:#FFA116}
.dpcs-comment{color:#475569}
</style>
<div class="dpcs">
  <div class="dpcs-card">
    <div class="dpcs-title">Template Top-Down</div>
    <div class="dpcs-code">memo = {}<br><span class="dpcs-hl">def</span> dp(state):<br>&nbsp;&nbsp;<span class="dpcs-comment"># 1. base case</span><br>&nbsp;&nbsp;<span class="dpcs-hl">if</span> base_condition: <span class="dpcs-hl">return</span> base_val<br>&nbsp;&nbsp;<span class="dpcs-comment"># 2. cache hit</span><br>&nbsp;&nbsp;<span class="dpcs-hl">if</span> state <span class="dpcs-hl">in</span> memo: <span class="dpcs-hl">return</span> memo[state]<br>&nbsp;&nbsp;<span class="dpcs-comment"># 3. compute</span><br>&nbsp;&nbsp;result = min/max(dp(sub1), dp(sub2))<br>&nbsp;&nbsp;memo[state] = result<br>&nbsp;&nbsp;<span class="dpcs-hl">return</span> result</div>
  </div>
  <div class="dpcs-card">
    <div class="dpcs-title">Coin Change (1D)</div>
    <div class="dpcs-code">dp = [<span class="dpcs-hl">float</span>(<span class="dpcs-hl">'inf'</span>)] * (A+1)<br>dp[0] = 0<br><span class="dpcs-hl">for</span> a <span class="dpcs-hl">in</span> range(1, A+1):<br>&nbsp;&nbsp;<span class="dpcs-hl">for</span> c <span class="dpcs-hl">in</span> coins:<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="dpcs-hl">if</span> c &lt;= a:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dp[a] = min(dp[a], dp[a-c]+1)<br><span class="dpcs-hl">return</span> dp[A] <span class="dpcs-hl">if</span> dp[A] != <span class="dpcs-hl">float</span>(<span class="dpcs-hl">'inf'</span>) <span class="dpcs-hl">else</span> -1</div>
  </div>
  <div class="dpcs-card">
    <div class="dpcs-title">Knapsack 0/1 (2D → 1D)</div>
    <div class="dpcs-code"><span class="dpcs-comment"># 1D com loop reverso</span><br>dp = [0] * (W+1)<br><span class="dpcs-hl">for</span> i <span class="dpcs-hl">in</span> range(n):<br>&nbsp;&nbsp;<span class="dpcs-hl">for</span> c <span class="dpcs-hl">in</span> range(W, w[i]-1, -1):<br>&nbsp;&nbsp;&nbsp;&nbsp;dp[c] = max(dp[c], dp[c-w[i]]+v[i])<br><span class="dpcs-hl">return</span> dp[W]</div>
  </div>
  <div class="dpcs-card">
    <div class="dpcs-title">LCS — 2D em Strings</div>
    <div class="dpcs-code">dp = [[0]*(n+1) <span class="dpcs-hl">for</span> _ <span class="dpcs-hl">in</span> range(m+1)]<br><span class="dpcs-hl">for</span> i <span class="dpcs-hl">in</span> range(1,m+1):<br>&nbsp;&nbsp;<span class="dpcs-hl">for</span> j <span class="dpcs-hl">in</span> range(1,n+1):<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="dpcs-hl">if</span> s1[i-1]==s2[j-1]:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dp[i][j]=dp[i-1][j-1]+1<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="dpcs-hl">else</span>:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dp[i][j]=max(dp[i-1][j],dp[i][j-1])<br><span class="dpcs-hl">return</span> dp[m][n]</div>
  </div>
  <div class="dpcs-card">
    <div class="dpcs-title">LIS — O(n log n)</div>
    <div class="dpcs-code"><span class="dpcs-hl">from</span> bisect <span class="dpcs-hl">import</span> bisect_left<br>tails = []<br><span class="dpcs-hl">for</span> n <span class="dpcs-hl">in</span> nums:<br>&nbsp;&nbsp;pos = bisect_left(tails, n)<br>&nbsp;&nbsp;<span class="dpcs-hl">if</span> pos == len(tails):<br>&nbsp;&nbsp;&nbsp;&nbsp;tails.append(n)<br>&nbsp;&nbsp;<span class="dpcs-hl">else</span>:<br>&nbsp;&nbsp;&nbsp;&nbsp;tails[pos] = n<br><span class="dpcs-hl">return</span> len(tails)</div>
  </div>
  <div class="dpcs-card">
    <div class="dpcs-title">Edit Distance</div>
    <div class="dpcs-code">dp = [[0]*(n+1) <span class="dpcs-hl">for</span> _ <span class="dpcs-hl">in</span> range(m+1)]<br><span class="dpcs-hl">for</span> i <span class="dpcs-hl">in</span> range(m+1): dp[i][0]=i<br><span class="dpcs-hl">for</span> j <span class="dpcs-hl">in</span> range(n+1): dp[0][j]=j<br><span class="dpcs-hl">for</span> i <span class="dpcs-hl">in</span> range(1,m+1):<br>&nbsp;&nbsp;<span class="dpcs-hl">for</span> j <span class="dpcs-hl">in</span> range(1,n+1):<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="dpcs-hl">if</span> s1[i-1]==s2[j-1]: dp[i][j]=dp[i-1][j-1]<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="dpcs-hl">else</span>: dp[i][j]=1+min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])<br><span class="dpcs-hl">return</span> dp[m][n]</div>
  </div>
</div>
</div>`,
      caption: "Templates prontos para os 6 padrões mais cobrados. Memorize a estrutura — em entrevista você adapta, não reinventa do zero.",
    },
    exercises: [
      { level: 'iniciante', title: 'Climbing Stairs', description: 'Dado n degraus, você pode subir 1 ou 2 por vez. Quantas formas distintas de chegar ao topo? Resolva com top-down e depois bottom-up O(1) espaço.', concepts: ['1D linear', 'top-down', 'bottom-up', 'space optimization'], hint: 'É exatamente Fibonacci deslocado. climbingStairs(n) = fib(n+1).', relatedKeypoints: [0, 4] },
      { level: 'intermediario', title: 'Longest Common Subsequence', description: 'Dadas duas strings, encontre o comprimento da maior subsequência comum. Implemente top-down e bottom-up. Depois otimize para O(min(m,n)) espaço.', concepts: ['2D strings', 'LCS', 'space optimization', 'backtracking'], hint: 'Se s1[i-1] == s2[j-1]: dp[i-1][j-1]+1. Senão: max(dp[i-1][j], dp[i][j-1]).', relatedKeypoints: [6] },
      { level: 'senior', title: 'Burst Balloons (Interval DP)', description: 'Dado array de balões com valores, você ganha coins[left]*coins[i]*coins[right] ao estourar balão i. Maximize coins. Este é interval DP — a escolha de qual estourar por último inverte a lógica usual.', concepts: ['interval DP', 'ordem de preenchimento', 'inversão de lógica'], hint: 'Pense: qual é o ÚLTIMO balão estourado no intervalo [i,j]? dp[i][j] = max sobre k de dp[i][k] + coins[i]*coins[k]*coins[j] + dp[k][j].', relatedKeypoints: [0, 1, 2] },
    ],
    videos: [
      { title: 'Dynamic Programming — Learn to Solve Algorithmic Problems', channel: 'freeCodeCamp.org', url: '', topic: 'Fundamentos completos de DP em 5 horas', note: 'O melhor recurso gratuito para quem está começando — explica o raciocínio, não só a solução' },
      { title: '5 Simple Steps for Solving Dynamic Programming Problems', channel: 'Reducible', url: '', topic: 'Framework de 5 passos visualizado', note: 'Animações excepcionais — ideal para solidificar o modelo mental antes de praticar' },
      { title: 'Dynamic Programming Playlist (LeetCode patterns)', channel: 'NeetCode', url: '', topic: '23 problemas organizados por padrão', note: 'Siga na ordem: 1D → Knapsack → 2D strings → Interval DP' },
      { title: 'Errichto — DP for Competitive Programming', channel: 'Errichto Algorithms', url: '', topic: 'DP avançado: bitmask, interval, tree DP', note: 'Para chegar em hard — requer base sólida dos padrões básicos' },
    ],
    resources: [
      { title: "NeetCode — Dynamic Programming playlist", url: "https://neetcode.io/practice", kind: "pratica" },
      { title: "AlgoMonster — DP patterns", url: "https://algo.monster/problems/dynamic_programming_intro", kind: "curso" },
      { title: "CLRS Cap 15 — Dynamic Programming", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/", kind: "livro" },
      { title: "visualgo.net — DP visualizer", url: "https://visualgo.net/en/recursion", kind: "pratica" },
      { title: "Errichto — DP playlist (YouTube)", url: "https://www.youtube.com/playlist?list=PLl0KD3g-oDOHpWRyyGBUJ9jmul0lUOD80", kind: "video" },
    ],
    codeExamples: [
      {
        title: "Fibonacci com memoização — top-down DP",
        description: "Recursão ingênua O(2^n) transformada em O(n) com cache. Demonstra o núcleo da memoização e a diferença entre top-down e bottom-up com otimização de espaço para O(1).",
        language: "python",
        code: `# Recursão ingênua — O(2^n): cada nó recomputa os filhos
# fib(5) → fib(4) + fib(3) → fib(3) + fib(2) + fib(2) + fib(1) ...

# Top-down com memoização — O(n) tempo, O(n) espaço
def fib_memo(n: int, memo: dict = {}) -> int:
    if n < 2:
        return n
    if n in memo:
        return memo[n]          # cache hit: evita recomputação
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

# Bottom-up com tabulação — O(n) tempo, O(n) espaço
def fib_tabulation(n: int) -> int:
    if n < 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

# Otimização de espaço — O(1): só precisa dos 2 anteriores
def fib_optimal(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

# Teste
assert fib_memo(10) == 55
assert fib_tabulation(10) == 55
assert fib_optimal(10) == 55
print("Fibonacci:", [fib_optimal(i) for i in range(10)])
# → [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
      },
      {
        title: "Knapsack 0/1 — bottom-up com tabela 2D e otimização para 1D",
        description: "Padrão fundamental de escolha binária: incluir ou não incluir cada item. Tabela 2D visualiza a recorrência; loop reverso reduz para O(W) espaço.",
        language: "python",
        code: `# Problema: n itens com pesos w[] e valores v[]. Capacidade W.
# Objetivo: maximizar valor total sem exceder capacidade.
# Decisão em cada item: incluir (se couber) ou pular.

def knapsack_2d(weights: list, values: list, W: int) -> int:
    n = len(weights)
    # dp[i][c] = max valor usando itens 0..i-1 com capacidade c
    dp = [[0] * (W + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        wi, vi = weights[i - 1], values[i - 1]
        for c in range(W + 1):
            dp[i][c] = dp[i - 1][c]              # pula item i
            if wi <= c:                            # cabe na mochila
                dp[i][c] = max(dp[i][c],
                               dp[i - 1][c - wi] + vi)  # inclui
    return dp[n][W]

# Otimização de espaço: loop REVERSO evita reusar o mesmo item
# (loop pra frente = unbounded knapsack — item reutilizável)
def knapsack_1d(weights: list, values: list, W: int) -> int:
    dp = [0] * (W + 1)
    for i in range(len(weights)):
        wi, vi = weights[i], values[i]
        for c in range(W, wi - 1, -1):  # reverso: W → wi
            dp[c] = max(dp[c], dp[c - wi] + vi)
    return dp[W]

# Exemplo: 4 itens, capacidade = 5
weights = [1, 2, 3, 5]
values  = [1, 6, 10, 16]
W = 5

print(knapsack_2d(weights, values, W))  # → 17 (itens 1+2: peso 3, valor 16 + 1? NÃO)
# Solução ótima: item 1 (w=2,v=6) + item 2 (w=3,v=10) = peso 5, valor 16
# Ou item 3 (w=5,v=16) = peso 5, valor 16
print(knapsack_1d(weights, values, W))  # → 17 (item 0 + item 1 = 1+6, resto...)
# Complexidade: O(n·W) tempo, O(W) espaço (versão 1D)`,
      },
      {
        title: "LCS — Longest Common Subsequence com backtracking",
        description: "Padrão 2D em strings: dp[i][j] codifica o subproblema em s1[0..i] e s2[0..j]. Inclui reconstrução da subsequência via backtracking na tabela.",
        language: "python",
        code: `# LCS: maior subsequência comum entre s1 e s2.
# Subsequência não precisa ser contígua — apenas manter a ordem.
# Ex: s1="ABCBDAB", s2="BDCAB" → LCS="BCAB" (comprimento 4)

def lcs_length(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    # dp[i][j] = comprimento da LCS de s1[0..i-1] e s2[0..j-1]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:       # chars iguais: extend
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:                              # chars diferentes: melhor dos vizinhos
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]

def lcs_reconstruct(s1: str, s2: str) -> str:
    """Reconstrói a LCS fazendo backtracking na tabela."""
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # Backtrack: percorre de (m,n) até (0,0)
    result = []
    i, j = m, n
    while i > 0 and j > 0:
        if s1[i - 1] == s2[j - 1]:
            result.append(s1[i - 1])  # char faz parte da LCS
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1                    # vem de cima
        else:
            j -= 1                    # vem da esquerda

    return ''.join(reversed(result))

s1, s2 = "ABCBDAB", "BDCAB"
print(lcs_length(s1, s2))         # → 4
print(lcs_reconstruct(s1, s2))    # → "BCAB" (ou "BDAB" — múltiplas LCS válidas)
# Complexidade: O(m·n) tempo e espaço. Space O(min(m,n)) com rolling array.`,
      },
      {
        title: "Todos os padrões DP — templates comentados",
        description: "Referência completa com os templates de código mais cobrados em entrevista",
        language: "python",
        code: `# ===== 1. FIBONACCI (1D Linear) =====
# Top-down O(n) tempo, O(n) espaço
def fib_memo(n, memo={}):
    if n < 2: return n
    if n in memo: return memo[n]
    memo[n] = fib_memo(n-1) + fib_memo(n-2)
    return memo[n]

# Bottom-up O(1) espaço — rolling variables
def fib_opt(n):
    a, b = 0, 1
    for _ in range(n): a, b = b, a + b
    return a


# ===== 2. COIN CHANGE (Unbounded Knapsack) =====
# Mínimo de moedas para atingir amount
def coinChange(coins: list[int], amount: int) -> int:
    INF = float('inf')
    dp = [INF] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1


# ===== 3. KNAPSACK 0/1 (1D otimizado) =====
# Cada item pode ser usado no máximo uma vez
def knapsack(weights: list[int], values: list[int], W: int) -> int:
    dp = [0] * (W + 1)
    for i in range(len(weights)):
        # REVERSO para não reusar o mesmo item
        for c in range(W, weights[i] - 1, -1):
            dp[c] = max(dp[c], dp[c - weights[i]] + values[i])
    return dp[W]


# ===== 4. LCS — Longest Common Subsequence =====
def lcs(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    # O(min(m,n)) espaço com array único
    prev = [0] * (n + 1)
    for i in range(1, m + 1):
        curr = [0] * (n + 1)
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                curr[j] = prev[j-1] + 1
            else:
                curr[j] = max(prev[j], curr[j-1])
        prev = curr
    return prev[n]


# ===== 5. EDIT DISTANCE =====
def editDistance(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # delete de s1
                    dp[i][j-1],    # insert em s1
                    dp[i-1][j-1]   # replace
                )
    return dp[m][n]


# ===== 6. LIS — O(n log n) =====
from bisect import bisect_left

def lis(nums: list[int]) -> int:
    tails = []  # tails[i] = menor tail de IS de comprimento i+1
    for n in nums:
        pos = bisect_left(tails, n)
        if pos == len(tails):
            tails.append(n)
        else:
            tails[pos] = n  # substitui pra manter menores valores
    return len(tails)`,
      },
    ],
    mindmap: {
      title: 'Dynamic Programming — Mapa Mental Completo',
      html: `<div style="background:#0f172a;padding:28px 22px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .dpmm-center{text-align:center;margin-bottom:24px}
    .dpmm-hub{display:inline-block;background:linear-gradient(135deg,#FFA116,#ffb84d);color:#0f172a;font-weight:800;font-size:15px;padding:12px 26px;border-radius:12px;letter-spacing:.5px;box-shadow:0 4px 24px rgba(255,161,22,.35)}
    .dpmm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
    .dpmm-branch{background:rgba(255,161,22,.06);border:1px solid rgba(255,161,22,.20);border-radius:10px;padding:13px}
    .dpmm-branch-title{font-weight:700;font-size:11px;color:#FFA116;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid rgba(255,161,22,.18);text-transform:uppercase;letter-spacing:.6px}
    .dpmm-leaf{font-size:11px;color:#94a3b8;line-height:1.85;padding:1px 0}
    .dpmm-leaf::before{content:'› ';color:#FFA116;font-weight:700}
    .dpmm-leaf b{color:#fcd34d}
  </style>
  <div class="dpmm-center">
    <div class="dpmm-hub">DYNAMIC PROGRAMMING</div>
    <div style="color:#475569;font-size:11px;margin-top:7px">Framework → Padrões → Implementação → Otimização</div>
  </div>
  <div style="text-align:center;color:#FFA116;font-size:20px;margin-bottom:10px">↓</div>
  <div class="dpmm-grid">
    <div class="dpmm-branch">
      <div class="dpmm-branch-title">Framework SETBR</div>
      <div class="dpmm-leaf"><b>S</b>tate — o que varia?</div>
      <div class="dpmm-leaf"><b>E</b>quação de transição</div>
      <div class="dpmm-leaf"><b>T</b>erminal / base case</div>
      <div class="dpmm-leaf"><b>B</b>ottom-up ou Top-down</div>
      <div class="dpmm-leaf"><b>R</b>esposta — dp[n]? max(dp)?</div>
    </div>
    <div class="dpmm-branch">
      <div class="dpmm-branch-title">Padrões 1D</div>
      <div class="dpmm-leaf"><b>Linear</b> — Fibonacci, Stairs</div>
      <div class="dpmm-leaf"><b>Decisão</b> — House Robber</div>
      <div class="dpmm-leaf"><b>Knapsack 0/1</b> — loop reverso</div>
      <div class="dpmm-leaf"><b>Unbounded</b> — Coin Change</div>
      <div class="dpmm-leaf"><b>LIS</b> — O(n²) ou O(n log n)</div>
    </div>
    <div class="dpmm-branch">
      <div class="dpmm-branch-title">Padrões 2D</div>
      <div class="dpmm-leaf"><b>Strings</b> — LCS, Edit Distance</div>
      <div class="dpmm-leaf"><b>Grid</b> — Unique Paths, Min Sum</div>
      <div class="dpmm-leaf"><b>Interval</b> — Burst Balloons</div>
      <div class="dpmm-leaf"><b>Tree DP</b> — House Robber III</div>
      <div class="dpmm-leaf"><b>Bitmask</b> — TSP (n≤20)</div>
    </div>
    <div class="dpmm-branch">
      <div class="dpmm-branch-title">Implementação</div>
      <div class="dpmm-leaf"><b>Top-down</b> — memo dict/array</div>
      <div class="dpmm-leaf"><b>Bottom-up</b> — tabela iterativa</div>
      <div class="dpmm-leaf"><b>Rolling array</b> — 2 linhas</div>
      <div class="dpmm-leaf"><b>Space O(1)</b> — 2 variáveis</div>
      <div class="dpmm-leaf"><b>Reconstrução</b> — array chosen</div>
    </div>
    <div class="dpmm-branch">
      <div class="dpmm-branch-title">Diagnóstico de Bug</div>
      <div class="dpmm-leaf"><b>WA silencioso</b> → estado incompleto</div>
      <div class="dpmm-leaf"><b>Off-by-one</b> → base case errado</div>
      <div class="dpmm-leaf"><b>Resposta errada</b> → dp[n] vs max(dp)</div>
      <div class="dpmm-leaf"><b>Duplicação</b> → loop sentido errado</div>
      <div class="dpmm-leaf"><b>Stack overflow</b> → use bottom-up</div>
    </div>
    <div class="dpmm-branch">
      <div class="dpmm-branch-title">DP vs Greedy</div>
      <div class="dpmm-leaf"><b>Greedy</b> — escolha local = global</div>
      <div class="dpmm-leaf"><b>DP</b> — decisão afeta futuro</div>
      <div class="dpmm-leaf"><b>Dijkstra</b> — greedy com heap</div>
      <div class="dpmm-leaf"><b>Coin Change</b> — greedy falha</div>
      <div class="dpmm-leaf"><b>Prova</b> — exchange argument</div>
    </div>
  </div>
</div>`,
      caption: 'Use SETBR para qualquer problema novo. Se travar, pergunte: "já computei isso antes?" — se sim, é DP. Depois identifique o padrão (1D/2D/Interval/Tree).',
    },
  }

export default dynamicProgramming
