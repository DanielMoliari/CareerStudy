import type { SkillContent } from "@/types"

const processosThreads: SkillContent = {
  tagline: "Processo é isolado com sua memória; thread compartilha memória com outras do mesmo processo.",
  why: "Sênior precisa entender concorrência em sistema. Por que Node usa cluster (processo) vs worker_threads. Por que Python tem GIL. Quando race condition vira bug. Como projetar sistema seguro com múltiplas threads.",
  summary: "Processo: unidade de execução isolada (memória própria, file descriptors). Thread: leve, compartilha memória do processo. Threads permitem paralelismo (em CPUs múltiplas) com overhead menor, mas exigem sync (mutex, semáforo) por causa de race condition. JS roda single-thread no event loop; para paralelo usa Worker. Python tem GIL — threads não paralelizam CPU; use multiprocessing.",
  keypoints: [
    { title: "Processo", body: "Espaço de memória próprio. fork() cria cópia. IPC via pipe, socket, shared mem. Crash de um não mata outros." },
    { title: "Thread", body: "Compartilha heap do processo, tem stack própria. Overhead menor para criar. Bug em uma derruba processo todo." },
    { title: "Race condition", body: "Resultado depende de ordem de execução não determinista. Ex: i++ em duas threads sem lock perde incremento." },
    { title: "Mutex", body: "Mutual exclusion. Só uma thread no critical section. Risco: deadlock (A espera B, B espera A)." },
    { title: "Semáforo", body: "Conta N slots. Threads esperam slot livre. Útil para limitar concorrência (rate limiter, connection pool)." },
    { title: "GIL (Python)", body: "Global Interpreter Lock — só uma thread Python executa bytecode por vez. Threads ainda úteis para I/O (libera GIL); para CPU usa multiprocessing." },
    { title: "Node concurrency", body: "JS single-thread no event loop. Cluster: processo por core (para HTTP server). Worker threads: thread separada para CPU-bound (compartilha memória via SharedArrayBuffer)." },
    { title: "Async I/O", body: "Alternativa a threads para I/O. Single thread atende milhares de conexões via epoll/kqueue. É o que Node, Go, asyncio fazem." },
    { title: "Context switch", body: "OS pausa thread (salva registradores, stack pointer), carrega contexto de outra. Custo real: ~1-10µs. Muitas threads = muito overhead de context switch." },
    { title: "Thread pool", body: "Pool de threads reutilizáveis. Evita custo de criação por tarefa. libuv (Node) usa pool de 4 threads para I/O; Java ForkJoinPool para computação paralela." },
  ],
  gotchas: [
    "Compartilhar variável entre threads sem lock — race condition silenciosa.",
    "Esquecer release de mutex em path de erro — deadlock.",
    "Em Python, esperar threads paralelizem CPU — GIL impede. Use multiprocessing ou C extension.",
    "Em Node, achar que worker é 'free' — IPC tem overhead; usa SharedArrayBuffer para zero-copy.",
    "Fork em processo com vários threads — child fica em estado inconsistente (apenas uma thread sobrevive no child).",
    "Thread pool sem limite — esgota memória. Sempre limitar.",
    "Async com bloqueio síncrono (fs.readFileSync, requests sync) trava o event loop.",
    "Lock ordering não seguido — deadlock clássico quando A adquire mutex1→mutex2 e B adquire mutex2→mutex1.",
    "Usar variável como flag de sincronização sem volatile/atomic — CPU reordena instruções.",
  ],
  interview: [
    {
      level: "pleno",
      q: "Qual a diferença entre processo e thread?",
      a: "<p><strong>Processo</strong>: memória isolada (code, data, heap, stack separados). Crash não afeta outros processos. Custo de criação maior. Comunicação entre processos (IPC) é explícita via pipe, socket ou shared memory.</p><p><strong>Thread</strong>: compartilha memória do processo (heap, globals). Cria rápido (~microsegundos), comunica direto via memória compartilhada. Bug em uma thread pode derrubar o processo inteiro. Precisa de sincronização (mutex, semáforo).</p><p>Use processo para isolamento e sandboxing; thread para paralelismo barato dentro do mesmo contexto.</p>",
      tip: "Mencione o custo de IPC vs memória compartilhada. Destaque que processos são mais seguros (crash isolation) enquanto threads são mais eficientes mas exigem disciplina de sincronização.",
    },
    {
      level: "senior",
      q: "O que é GIL e por que o CPython tem?",
      a: "<p><strong>Global Interpreter Lock</strong>: um mutex global no CPython que só deixa uma thread executar bytecode Python por vez.</p><p><strong>Por que existe:</strong> simplifica o gerenciamento de memória do interpretador — reference counting de objetos Python não precisa ser thread-safe se apenas uma thread roda por vez. Retirar o GIL exigiria locking fino em cada operação de objeto, com custo de performance em código single-thread.</p><p><strong>Consequência:</strong> threads Python não paralelizam workload CPU-bound. Para CPU: use <code>multiprocessing</code> (processos separados, cada um com seu GIL) ou C extensions que soltam o GIL (numpy, pandas). Para I/O: threads ainda funcionam — bibliotecas I/O soltam o GIL enquanto aguardam.</p>",
      tip: "Mencione que PEP 703 (Python 3.13) está removendo o GIL de forma opcional. Mostre que você conhece o roadmap da linguagem.",
    },
    {
      level: "pleno",
      q: "Como Node.js consegue ser concorrente sendo single-thread?",
      a: "<p><strong>Event loop + async I/O</strong>. JS roda em uma thread (V8), mas I/O (fs, net, http) é delegado para:</p><ul><li><strong>Thread pool da libuv</strong> (4 threads por padrão) para fs, DNS, crypto</li><li><strong>Kernel async I/O</strong> (epoll/kqueue/IOCP) para network sockets</li></ul><p>Quando I/O termina, callback volta para a fila do event loop e executa na thread JS.</p><p>Para CPU-bound: <code>worker_threads</code> — thread real compartilhando memória via <code>SharedArrayBuffer</code>. Para paralelizar HTTP server: <code>cluster</code> — múltiplos processos com balanceamento de carga pelo kernel.</p>",
      tip: "Diferencie cluster vs worker_threads: cluster é multi-processo (isolamento), worker_threads é multi-thread (memória compartilhada). A escolha depende do workload.",
    },
    {
      level: "pleno",
      q: "O que é race condition? Dê um exemplo.",
      a: "<p>Resultado depende de ordem de execução não determinista entre threads. Exemplo clássico:</p><pre><code>// counter compartilhado\ncounter = counter + 1\n// 3 instruções de máquina:\n// LOAD counter → registrador\n// ADD 1\n// STORE registrador → counter</code></pre><p>Se duas threads executam simultaneamente: ambas leem 0 (LOAD), ambas somam 1 (ADD), ambas escrevem 1 (STORE). Esperado: 2. Resultado: 1. Um incremento foi perdido.</p><p><strong>Solução:</strong> mutex em volta do bloco crítico, ou operação atômica (<code>std::atomic</code> em C++, <code>AtomicInteger</code> em Java, <code>Atomics</code> em JS com SharedArrayBuffer).</p>",
      tip: "Descreva a sequência de instruções de máquina — isso demonstra entendimento de que a abstração de linguagem esconde múltiplas operações não-atômicas.",
    },
    {
      level: "senior",
      q: "Como evitar deadlock? Quais as condições necessárias para deadlock ocorrer?",
      a: "<p><strong>4 condições de Coffman</strong> (todas precisam se cumular):</p><ul><li><strong>Mutual Exclusion</strong>: recurso não pode ser compartilhado</li><li><strong>Hold and Wait</strong>: thread segura recurso enquanto espera outro</li><li><strong>No Preemption</strong>: recurso não pode ser forçadamente liberado</li><li><strong>Circular Wait</strong>: A espera B, B espera A (ou cadeia circular)</li></ul><p><strong>Prevenção:</strong></p><ul><li><strong>Lock ordering</strong>: sempre adquira locks em ordem global fixa (elimina Circular Wait)</li><li><strong>Timeout</strong>: se não adquire em N ms, libera tudo e retry (elimina No Preemption)</li><li><strong>Trylock</strong>: tenta adquirir, falha imediatamente se não disponível</li><li><strong>Primitivas de alto nível</strong>: channels (Go), actors (Erlang), lock-free structures</li></ul>",
      tip: "Comece sempre pelas 4 condições de Coffman — mostra embasamento teórico. Depois discuta as estratégias práticas de prevenção em código real.",
    },
    {
      level: "pleno",
      q: "Quando você usaria threads vs processos?",
      a: "<ul><li><strong>Threads</strong>: workload precisa compartilhar muita memória (modelo em memória, cache). Custo de IPC seria proibitivo. Linguagem não tem GIL (Java, C++, Go, Rust).</li><li><strong>Processos</strong>: precisa de isolamento (segurança, sandboxing, crash isolation). Linguagem tem GIL (Python, Ruby) e workload é CPU-bound. HTTP servers em Python/Ruby usam workers (gunicorn, puma). Cada processo tem seu GIL independente.</li></ul><p>Go e Erlang oferecem uma terceira opção: goroutines/processes leves gerenciados pelo runtime — combinam leveza de threads com isolamento de processos.</p>",
      tip: "Mencione Go como modelo de terceiro caminho — goroutines são M:N threads (N goroutines em M OS threads). Isso demonstra conhecimento além do básico.",
    },
    {
      level: "senior",
      q: "O que é context switch e qual seu custo?",
      a: "<p>Context switch é quando o OS pausa uma thread e retoma outra. Envolve:</p><ul><li>Salvar registradores da CPU da thread atual (PC, SP, registradores gerais)</li><li>Atualizar estruturas do kernel (PCB/TCB)</li><li>Carregar contexto da próxima thread</li><li>Invalidar TLB parcialmente (se processo diferente)</li><li>Possível cache miss de L1/L2 — o custo maior em produção</li></ul><p>Custo: <strong>~1-10 µs</strong> por context switch. Com muitas threads (ex: 1.000 threads em servidor web tradicional), o overhead de context switch pode consumir mais CPU que o trabalho útil. Motivo pelo qual event loop (Nginx, Node) e goroutines (Go) escalam melhor que thread-per-connection.</p>",
      tip: "O custo de cache miss é o insight de sênior aqui — não é só o tempo de salvar/restaurar registradores, é a pressão no cache de CPU. Mencione Nginx vs Apache como case clássico.",
    },
    {
      level: "senior",
      q: "Como funciona SharedArrayBuffer no Node.js worker_threads?",
      a: "<p><code>SharedArrayBuffer</code> é um bloco de memória bruta compartilhada entre a thread principal e workers sem cópia (zero-copy). Diferente de <code>postMessage</code> que serializa/deserializa (cópia = overhead).</p><pre><code>const sab = new SharedArrayBuffer(4)\nconst arr = new Int32Array(sab)\nworker.postMessage({ sab })\n// worker acessa o mesmo buffer</code></pre><p><strong>Sincronização com Atomics:</strong></p><ul><li><code>Atomics.add(arr, 0, 1)</code> — incremento atômico, sem race condition</li><li><code>Atomics.wait(arr, 0, 0)</code> — block-espera (thread dorme enquanto valor é 0)</li><li><code>Atomics.notify(arr, 0, 1)</code> — acorda uma thread esperando</li></ul><p>Sem Atomics, SharedArrayBuffer por si só tem race conditions como qualquer memória compartilhada.</p>",
      tip: "Atomics.wait é bloqueante e não funciona na thread principal (evita travar o event loop). Worker threads podem usar; thread principal deve usar Atomics.waitAsync.",
    },
    {
      level: "senior",
      q: "O que é uma condition variable e como difere de um mutex?",
      a: "<p><strong>Mutex</strong>: trava acesso a seção crítica. Permite que apenas uma thread execute.</p><p><strong>Condition variable</strong>: mecanismo para thread aguardar uma <em>condição</em> ser verdadeira, sem busy-wait. Thread libera o mutex e dorme atomicamente até ser notificada.</p><pre><code>// Producer\nstd::unique_lock lock(mutex)\nqueue.push(item)\ncv.notify_one() // acorda consumer\n\n// Consumer\nstd::unique_lock lock(mutex)\ncv.wait(lock, [] { return !queue.empty() })\nauto item = queue.front()</code></pre><p>O <code>wait</code> libera o lock atomicamente — sem janela de race. Quando a condição for falsa novamente, volta a dormir. Evita busy-wait (spinning que consome CPU enquanto aguarda).</p>",
      tip: "Explique a atomicidade do wait — sem ela, haveria race condition entre checar a condição e dormir. É o insight que separa quem leu o conceito de quem realmente implementou.",
    },
    {
      level: "pleno",
      q: "O que é semáforo? Quando usar vs mutex?",
      a: "<p><strong>Semáforo</strong>: contador que controla acesso a N recursos simultâneos. <code>wait()</code> decrementa (ou bloqueia se 0). <code>signal()</code> incrementa (acorda thread bloqueada).</p><p><strong>Mutex</strong>: caso especial de semáforo binário (0 ou 1), mas com propriedade de <em>ownership</em> — só a thread que travou pode destravar.</p><p><strong>Quando usar semáforo:</strong></p><ul><li>Limitar conexões simultâneas a um banco (ex: máx 10)</li><li>Implementar buffer circular (produtor/consumidor)</li><li>Rate limiting entre threads</li></ul><p><strong>Quando usar mutex:</strong></p><ul><li>Acesso exclusivo a recurso compartilhado (um de cada vez)</li><li>Seções críticas simples</li></ul>",
      tip: "Use semáforo quando o limite é maior que 1 (connection pool). Use mutex quando o acesso é exclusivo. Mencione que mutex tem dono (ownership) — importante para depuração de deadlock.",
    },
    {
      level: "senior",
      q: "O que é fork-safe? Por que fork em processo multi-thread é perigoso?",
      a: "<p><code>fork()</code> cria processo filho como cópia do pai. Em processo multi-thread, apenas a thread que chamou <code>fork()</code> sobrevive no filho. As outras threads param de existir — mas os locks que elas seguravam <strong>permanecem travados</strong>.</p><p>Cenário de bug:</p><ol><li>Thread B está em malloc(), segura o lock interno do heap</li><li>Thread A chama fork()</li><li>No filho: apenas Thread A existe. Lock do heap está travado mas Thread B não existe para liberar</li><li>Qualquer malloc() no filho → deadlock</li></ol><p><strong>Soluções:</strong></p><ul><li>Fork antes de criar threads (padrão Apache prefork)</li><li>Usar <code>pthread_atfork()</code> para registrar handlers que limpam locks</li><li>No filho, chamar apenas async-signal-safe functions (execve) imediatamente</li></ul>",
      tip: "Este é um bug de produção clássico em servidores que fazem fork() para processar requisições. Mencionar que a solução é fork antes de criar threads demonstra experiência real.",
    },
    {
      level: "pleno",
      q: "Como implementar um producer-consumer thread-safe em Node.js?",
      a: "<p>Com <code>worker_threads</code> e <code>SharedArrayBuffer + Atomics</code>:</p><pre><code>// main.ts (producer)\nconst sab = new SharedArrayBuffer(4 * 100) // 100 slots\nconst buf = new Int32Array(sab)\nconst worker = new Worker('./consumer.js')\nworker.postMessage({ sab })\n\n// producer loop\nfor (let i = 0; i < items.length; i++) {\n  Atomics.store(buf, i, items[i])\n  Atomics.notify(buf, i, 1)\n}\n\n// consumer.js\nconst { sab } = workerData\nconst buf = new Int32Array(sab)\nfor (let i = 0; i < 100; i++) {\n  Atomics.wait(buf, i, 0) // dorme enquanto 0\n  const item = Atomics.load(buf, i)\n  process(item)\n}</code></pre><p>Para workloads mais simples: use <code>MessageChannel</code> com postMessage — mais seguro (sem race), mas com overhead de serialização.</p>",
      tip: "Mencione que Atomics.wait bloqueia a OS thread — só use em worker threads. Para código mais seguro, prefira MessageChannel (serialização JSON) e aceite o custo de cópia.",
    },
    {
      level: "senior",
      q: "O que é lock-free programming? Quando vale a pena?",
      a: "<p><strong>Lock-free</strong>: estruturas de dados onde operações concorrentes não bloqueiam umas às outras — usam operações atômicas (CAS — Compare-And-Swap) em vez de mutex.</p><p><strong>CAS:</strong> atômico — compara valor atual com esperado; se igual, substitui pelo novo. Se alguém modificou antes, retry.</p><pre><code>// Incremento lock-free com CAS\nfunction increment(counter) {\n  let old, newVal\n  do {\n    old = counter.load()\n    newVal = old + 1\n  } while (!counter.compareAndSet(old, newVal))\n}</code></pre><p><strong>Quando vale:</strong></p><ul><li>Contenção muito alta em mutex (threads ficam spinning esperando)</li><li>Lock-free queues (MPSC, SPSC) em sistemas de baixa latência</li><li>Contadores de performance (semáforos leves)</li></ul><p><strong>Quando NÃO vale:</strong> complexidade enorme, difícil de depurar, ABA problem. Na maioria dos casos, um mutex bem usado é suficiente.</p>",
      tip: "Mencione o ABA problem — CAS pode falsamente suceder se valor volta ao original. Usar versioned CAS (double-word CAS) resolve. Isso diferencia quem conhece lock-free na prática.",
    },
    {
      level: "pleno",
      q: "O que é thread starvation? Como prevenir?",
      a: "<p><strong>Thread starvation</strong>: uma thread nunca consegue acesso ao recurso porque outras threads são sempre priorizadas. Resultado: tarefa nunca completa, timeout, ou filas crescendo sem limite.</p><p><strong>Causas comuns:</strong></p><ul><li>Prioridade de thread muito baixa vs threads competidoras</li><li>Mutex injusto: threads entram em ordem aleatória, mesmas threads dominam</li><li>Connection pool saturado: conexões nunca disponíveis para certas requisições</li></ul><p><strong>Prevenção:</strong></p><ul><li>Mutex com política FIFO (fair mutex) — ordem de chegada garante que todos avançam</li><li>Prioridade de thread balanceada ou aging (aumenta prioridade com tempo de espera)</li><li>Timeouts em aquisição de locks</li><li>Dimensionamento correto de pools (thread pool e connection pool)</li></ul>",
      tip: "Ligue starvation a problemas reais: serviço de alta prioridade domina CPU, requisições de baixa prioridade nunca completam. Fair locks e aging são as soluções padrão.",
    },
    {
      level: "senior",
      q: "Como o Go trata concorrência diferente de threads POSIX?",
      a: "<p>Go usa <strong>goroutines</strong> — threads leves gerenciadas pelo runtime Go, não pelo OS. O scheduler de Go mapeia N goroutines em M OS threads (M:N threading).</p><p><strong>Vantagens:</strong></p><ul><li>Stack inicial de 2-8KB (vs ~1MB de OS thread) — pode ter milhões de goroutines</li><li>Crescimento de stack dinâmico (não precisa dimensionar no início)</li><li>Context switch leve (ring 3, sem syscall) — ~100ns vs ~1µs</li></ul><p><strong>Modelo de comunicação</strong>: <strong>CSP — Communicating Sequential Processes</strong>. Em vez de memória compartilhada + mutex, Go usa channels:</p><pre><code>ch := make(chan int)\ngo func() { ch <- compute() }() // goroutine\nresult := <-ch // aguarda</code></pre><p>Mantra Go: <em>'Do not communicate by sharing memory; share memory by communicating.'</em></p>",
      tip: "O mantra CSP é o diferencial. Compare com threads POSIX: Go inverte o paradigma — em vez de mutex em memória compartilhada, usa passagem de mensagem via channels.",
    },
    {
      level: "senior",
      q: "O que é false sharing em cache de CPU? Como afeta performance de threads?",
      a: "<p><strong>False sharing</strong>: duas threads modificam variáveis diferentes, mas que estão na <em>mesma cache line</em> (geralmente 64 bytes). O hardware invalida a cache line inteira quando qualquer byte é modificado — forçando a outra thread a recarregar do L3/RAM.</p><p><strong>Impacto:</strong> código aparentemente paralelo executa quase sequencialmente por causa de cache invalidation constante. Pode degradar performance em 10x.</p><p><strong>Exemplo:</strong></p><pre><code>// ❌ false sharing — counter[0] e counter[1] na mesma cache line\nint64_t counters[2];\n// Thread 0: counters[0]++\n// Thread 1: counters[1]++\n\n// ✓ padding para separar em cache lines diferentes\nstruct alignas(64) PaddedCounter {\n  int64_t value;\n  char padding[56];\n};\nPaddedCounter counters[2];</code></pre><p>Em JS/Node com SharedArrayBuffer, usar índices distantes o suficiente (ex: Int32Array com stride de 16 slots por thread).</p>",
      tip: "False sharing é o tipo de bug que só aparece em profiling de performance. Mencionar que a CPU line size é tipicamente 64 bytes e como usar padding para isolamento demonstra conhecimento de hardware.",
    },
    {
      level: "pleno",
      q: "Como diagnosticar e resolver um deadlock em produção?",
      a: "<p><strong>Diagnóstico:</strong></p><ul><li><strong>JVM:</strong> <code>jstack &lt;pid&gt;</code> ou VisualVM — mostra thread dump com estado BLOCKED e qual lock aguarda</li><li><strong>Python:</strong> <code>py-spy dump --pid &lt;pid&gt;</code> para stack traces; <code>faulthandler</code></li><li><strong>Node.js:</strong> inspector (<code>--inspect</code>) + pausa todas as threads; ou <code>clinic</code></li><li><strong>Go:</strong> o runtime detecta automaticamente e lança <code>all goroutines are asleep — deadlock!</code></li></ul><p><strong>Resolução:</strong></p><ul><li>Analisar o grafo de espera (wait-for graph) — identificar o ciclo</li><li>Quebrar o ciclo: liberar um lock, mudar a ordem de aquisição</li><li>Adicionar timeout para evitar que reaparece</li><li>Refatorar para não precisar de múltiplos locks simultaneamente</li></ul>",
      tip: "Comece pelo diagnóstico específico da stack — jstack para JVM é o mais comum em entrevistas. Mencionar wait-for graph mostra embasamento teórico.",
    },
    {
      level: "senior",
      q: "O que é o modelo de memória Java Memory Model (JMM) e por que importa para threads?",
      a: "<p>O JMM define quando uma thread enxerga as escritas de outra. Sem garantias explícitas, o compilador e CPU podem reordenar instruções, fazer cache em registradores, e uma thread pode nunca ver a escrita de outra.</p><p><strong>Regra happens-before:</strong> se ação A happens-before ação B, então B enxerga o estado escrito por A.</p><p><strong>Garantias de happens-before:</strong></p><ul><li><code>volatile</code>: escrita para variável volatile happens-before toda leitura posterior</li><li><code>synchronized</code>: saída de bloco synchronized happens-before entrada de qualquer outro synchronized no mesmo lock</li><li><code>Thread.start()</code>: código antes do start happens-before código da thread iniciada</li></ul><p><strong>Problema sem garantia:</strong></p><pre><code>boolean running = true\n// Thread A:\nrunning = false // pode ficar só em cache\n\n// Thread B:\nwhile (running) {} // pode lopar infinito!</code></pre><p>Solução: <code>volatile boolean running</code></p>",
      tip: "O exemplo de flag de parada de thread (volatile) é o mais cobrado. Mostre que você entende que o problema não é de lógica mas de visibilidade de memória entre cores de CPU.",
    },
    {
      level: "pleno",
      q: "Qual a diferença entre paralelismo e concorrência?",
      a: "<p><strong>Concorrência</strong>: capacidade de lidar com múltiplas tarefas que se sobrepõem no tempo. <em>Não necessariamente simultâneas</em> — pode ser um único core alternando entre tarefas (interleaving).</p><p><strong>Paralelismo</strong>: execução <em>genuinamente simultânea</em> de múltiplas tarefas em múltiplos cores/processadores.</p><p>Analogia:</p><ul><li><strong>Concorrente não paralelo</strong>: um garçom atendendo várias mesas, mas uma de cada vez — vai e vem</li><li><strong>Paralelo</strong>: vários garçons, cada um em sua mesa ao mesmo tempo</li><li><strong>Concorrente e paralelo</strong>: vários garçons, cada um atendendo múltiplas mesas</li></ul><p>Node.js é concorrente (event loop) mas não paralelo (single thread JS). Go é concorrente e paralelo (goroutines em múltiplos OS threads). Python threads são concorrentes mas não paralelas em CPU (GIL).</p>",
      tip: "A distinção Go/Node ilustra perfeitamente. Node pode ser concorrente e paralelo se usar cluster ou worker_threads — detalhar isso em follow-up demonstra conhecimento aprofundado.",
    },
    {
      level: "senior",
      q: "Como dimensionar um thread pool? Quais fatores considerar?",
      a: "<p>Depende do tipo de workload:</p><p><strong>CPU-bound</strong>:</p><ul><li>Número de threads ≈ número de cores (N ou N+1)</li><li>Mais threads causam context switch overhead, não ganho</li></ul><p><strong>I/O-bound</strong>:</p><ul><li>Número de threads &gt;&gt; número de cores — threads ficam bloqueadas em I/O e liberam CPU</li><li>Fórmula de Little's Law: N = L / (λ × W) onde L é taxa de chegada, W é latência de I/O</li><li>Ou empiricamente: começar com Ncores × 2 e ajustar com profiling</li></ul><p><strong>Fatores adicionais:</strong></p><ul><li>Footprint de memória: cada thread tem stack (1-8MB) — 1000 threads = 1-8GB só em stacks</li><li>Tempo de resposta vs throughput: muitos threads = mais throughput em I/O, mas mais latência por context switch</li><li>Pool separado por tipo: não misturar CPU-bound com I/O-bound no mesmo pool</li></ul>",
      tip: "Little's Law é o insight de sênior — demonstra raciocínio quantitativo. Mencionar pool separado por tipo de workload é prática de produção.",
    },
    {
      level: "senior",
      q: "O que é POSIX fork() e como funciona internamente?",
      a: "<p><code>fork()</code> cria um processo filho como cópia quase exata do pai via <strong>Copy-On-Write (COW)</strong>:</p><ol><li>Kernel cria nova entrada na tabela de processos</li><li>Copia o page table do pai (apontando para as mesmas páginas físicas)</li><li>Marca todas as páginas como read-only em ambos</li><li>Quando qualquer processo escreve em uma página: kernel cria cópia física, atualiza o page table do processo que escreveu</li></ol><p>Retorno: no pai retorna PID do filho; no filho retorna 0.</p><pre><code>pid_t pid = fork()\nif (pid == 0) {\n  // executa no filho\n  exec(...)  // substitui imagem do processo\n} else {\n  // executa no pai\n  wait(&status)  // espera filho terminar\n}</code></pre><p>COW torna fork() rápido mesmo para processos grandes — cópias físicas só acontecem quando necessário.</p>",
      tip: "COW é o detalhe técnico que demonstra entendimento real. Mencione que fork()+exec() é o padrão UNIX para criar novos programas — fork cria, exec substitui a imagem.",
    },
    {
      level: "pleno",
      q: "Como Node.js cluster module funciona e quando usar?",
      a: "<p><code>cluster</code> usa <code>fork()</code> para criar múltiplos processos Node.js, cada um escutando na mesma porta. O processo master faz o balanceamento de carga entre os workers.</p><pre><code>import cluster from 'cluster'\nimport os from 'os'\n\nif (cluster.isPrimary) {\n  for (let i = 0; i < os.cpus().length; i++) {\n    cluster.fork()\n  }\n  cluster.on('exit', (worker) => {\n    cluster.fork() // reinicia worker morto\n  })\n} else {\n  // código do servidor HTTP aqui\n  app.listen(3000)\n}</code></pre><p><strong>Quando usar:</strong></p><ul><li>Servidor HTTP com tráfego alto — aproveitar múltiplos cores</li><li>Workload é I/O-bound (event loop com async)</li><li>Preferência por isolamento de processo (crash de um não afeta outros)</li></ul><p><strong>Alternativa:</strong> PM2 com <code>cluster mode</code> — mesma ideia com gerenciamento de processos.</p>",
      tip: "O exemplo de restart automático (reinicia worker morto) é prática de produção. Mencione que Estado (cache, sessões) não é compartilhado entre workers — precisa de Redis ou outro store externo.",
    },
  ],
  diagrams: [
    {
      title: "Processos vs Threads — Modelo de Memória",
      html: `<style>
.pt-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.pt-title{font-size:13px;font-weight:700;color:#06b6d4;margin:0 0 4px}
.pt-sub{font-size:10px;color:#475569;margin:0 0 16px}
.pt-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
.pt-proc{background:#1e293b;border:1.5px solid #06b6d430;border-radius:10px;padding:14px}
.pt-proc-title{font-size:11px;font-weight:700;color:#06b6d4;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #334155}
.pt-seg{border-radius:6px;padding:7px 10px;margin-bottom:5px;font-size:10px;line-height:1.5;display:flex;justify-content:space-between;align-items:center}
.pt-shared{background:#0f172a;border:1.5px dashed #22c55e40;border-radius:10px;padding:14px}
.pt-shared-title{font-size:11px;font-weight:700;color:#22c55e;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #334155}
.pt-badge{font-size:9px;font-weight:700;text-transform:uppercase;border-radius:4px;padding:2px 6px}
.pt-ipc{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px}
.pt-ipc-title{font-size:10px;font-weight:700;color:#f59e0b;margin-bottom:8px}
.pt-ipc-row{display:flex;gap:8px;font-size:10px;color:#94a3b8;margin-bottom:5px;align-items:center;line-height:1.5}
</style>
<div class="pt-wrap">
  <p class="pt-title">Processos vs Threads — Isolamento de Memória</p>
  <p class="pt-sub">Processo tem espaço de endereçamento próprio; threads compartilham heap do processo</p>
  <div class="pt-grid">
    <div class="pt-proc">
      <div class="pt-proc-title">Processo A <span style="color:#475569;font-weight:400;font-size:9px">memória isolada</span></div>
      <div class="pt-seg" style="background:#06b6d415;border:1px solid #06b6d430;color:#67e8f9">
        <span>Stack (Thread A1)</span><span class="pt-badge" style="background:#06b6d420;color:#06b6d4">privado</span>
      </div>
      <div class="pt-seg" style="background:#06b6d40d;border:1px solid #06b6d420;color:#94a3b8">
        <span>Heap — objetos, closures</span><span class="pt-badge" style="background:#06b6d410;color:#06b6d4">privado</span>
      </div>
      <div class="pt-seg" style="background:#06b6d408;border:1px solid #06b6d415;color:#64748b">
        <span>Code segment</span><span class="pt-badge" style="background:#06b6d408;color:#475569">privado</span>
      </div>
      <div style="font-size:9px;color:#475569;margin-top:8px;line-height:1.7">
        ✓ Crash não afeta Processo B<br>
        ✗ IPC é necessário pra comunicar<br>
        ✗ Custo de fork() maior
      </div>
    </div>
    <div class="pt-proc">
      <div class="pt-proc-title">Processo B <span style="color:#475569;font-weight:400;font-size:9px">memória isolada</span></div>
      <div class="pt-seg" style="background:#a78bfa15;border:1px solid #a78bfa30;color:#c4b5fd">
        <span>Stack (Thread B1)</span><span class="pt-badge" style="background:#a78bfa20;color:#a78bfa">privado</span>
      </div>
      <div class="pt-seg" style="background:#a78bfa10;border:1px solid #a78bfa20;color:#94a3b8">
        <span>Stack (Thread B2)</span><span class="pt-badge" style="background:#a78bfa15;color:#a78bfa">privado</span>
      </div>
      <div class="pt-seg" style="background:#22c55e12;border:1px solid #22c55e30;color:#86efac">
        <span>Heap COMPARTILHADO</span><span class="pt-badge" style="background:#22c55e20;color:#22c55e">shared</span>
      </div>
      <div style="font-size:9px;color:#475569;margin-top:8px;line-height:1.7">
        ✓ Comunicação via memória direta<br>
        ✗ Bug em B1 pode derrubar B2<br>
        ✗ Race condition sem mutex
      </div>
    </div>
  </div>
  <div class="pt-ipc">
    <div class="pt-ipc-title">IPC — Comunicação entre Processos (quando isolados)</div>
    <div class="pt-ipc-row"><span style="color:#f59e0b;font-weight:700">Pipe</span><span>— fluxo unidirecional de bytes (stdin/stdout redirecionado)</span></div>
    <div class="pt-ipc-row"><span style="color:#f59e0b;font-weight:700">Socket</span><span>— bidirecional, TCP/Unix domain socket</span></div>
    <div class="pt-ipc-row"><span style="color:#f59e0b;font-weight:700">Shared Memory</span><span>— mmap() / SharedArrayBuffer — rápido mas precisa sync</span></div>
    <div class="pt-ipc-row"><span style="color:#f59e0b;font-weight:700">Message Queue</span><span>— fila assíncrona (POSIX mq / Redis / Kafka)</span></div>
  </div>
</div>`,
      caption: "Cada thread tem sua própria stack (frames de chamada), mas todas as threads de um processo compartilham o heap. Por isso mutex é necessário — sem sync, duas threads no heap = race condition.",
    },
    {
      title: "Race Condition e Mutex — Visualização Passo a Passo",
      html: `<style>
.pt2-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.pt2-title{font-size:13px;font-weight:700;color:#ef4444;margin:0 0 4px}
.pt2-sub{font-size:10px;color:#475569;margin:0 0 14px}
.pt2-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
.pt2-box{background:#1e293b;border-radius:8px;padding:12px}
.pt2-box-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #334155}
.pt2-step{display:flex;gap:8px;font-size:10px;color:#94a3b8;margin-bottom:6px;line-height:1.6;align-items:flex-start}
.pt2-num{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0;margin-top:1px}
.pt2-danger{color:#ef4444;font-weight:700}
.pt2-safe{color:#22c55e;font-weight:700}
.pt2-code{background:#0f172a;border-radius:6px;padding:8px 10px;font-family:'JetBrains Mono',monospace;font-size:10px;line-height:1.7;color:#94a3b8;margin-top:8px}
.pt2-result{background:#1e293b;border-radius:8px;padding:12px;border:1.5px solid #334155}
.pt2-r-title{font-size:10px;font-weight:700;margin-bottom:8px;color:#f59e0b}
.pt2-r-row{display:flex;gap:12px;font-size:10px;color:#94a3b8;margin-bottom:5px}
</style>
<div class="pt2-wrap">
  <p class="pt2-title">Race Condition vs Mutex — Sem e Com Sincronização</p>
  <p class="pt2-sub">Por que counter++ em duas threads sem lock perde incrementos</p>
  <div class="pt2-row">
    <div class="pt2-box" style="border:1.5px solid #ef444430">
      <div class="pt2-box-title" style="color:#ef4444">Sem mutex — RACE CONDITION</div>
      <div class="pt2-step">
        <div class="pt2-num" style="background:#ef444420;color:#ef4444">1</div>
        <div>Thread A: <code>LOAD counter</code> → registrador A = <span class="pt2-danger">0</span></div>
      </div>
      <div class="pt2-step">
        <div class="pt2-num" style="background:#ef444420;color:#ef4444">2</div>
        <div>Thread B: <code>LOAD counter</code> → registrador B = <span class="pt2-danger">0</span> (leu antes do store de A!)</div>
      </div>
      <div class="pt2-step">
        <div class="pt2-num" style="background:#ef444420;color:#ef4444">3</div>
        <div>Thread A: <code>ADD 1</code> → reg A = 1, <code>STORE</code> → counter = 1</div>
      </div>
      <div class="pt2-step">
        <div class="pt2-num" style="background:#ef444420;color:#ef4444">4</div>
        <div>Thread B: <code>ADD 1</code> → reg B = 1, <code>STORE</code> → counter = <span class="pt2-danger">1</span> (sobrescreveu!)</div>
      </div>
      <div style="font-size:10px;color:#ef4444;margin-top:8px;padding:6px 10px;background:#ef444410;border-radius:6px">
        Esperado: 2 &nbsp;|&nbsp; Resultado: 1 &nbsp;|&nbsp; Incremento perdido silenciosamente
      </div>
    </div>
    <div class="pt2-box" style="border:1.5px solid #22c55e30">
      <div class="pt2-box-title" style="color:#22c55e">Com mutex — SEGURO</div>
      <div class="pt2-step">
        <div class="pt2-num" style="background:#22c55e20;color:#22c55e">1</div>
        <div>Thread A: <code>mutex.lock()</code> → adquiriu, Thread B bloqueia</div>
      </div>
      <div class="pt2-step">
        <div class="pt2-num" style="background:#22c55e20;color:#22c55e">2</div>
        <div>Thread A: <code>LOAD</code> → 0, <code>ADD 1</code>, <code>STORE</code> → counter = <span class="pt2-safe">1</span></div>
      </div>
      <div class="pt2-step">
        <div class="pt2-num" style="background:#22c55e20;color:#22c55e">3</div>
        <div>Thread A: <code>mutex.unlock()</code> → Thread B desbloqueada</div>
      </div>
      <div class="pt2-step">
        <div class="pt2-num" style="background:#22c55e20;color:#22c55e">4</div>
        <div>Thread B: <code>LOAD</code> → 1, <code>ADD 1</code>, <code>STORE</code> → counter = <span class="pt2-safe">2</span></div>
      </div>
      <div style="font-size:10px;color:#22c55e;margin-top:8px;padding:6px 10px;background:#22c55e10;border-radius:6px">
        Esperado: 2 &nbsp;|&nbsp; Resultado: 2 &nbsp;|&nbsp; Correto!
      </div>
    </div>
  </div>
  <div class="pt2-result">
    <div class="pt2-r-title">Alternativas ao mutex para contadores:</div>
    <div class="pt2-r-row"><span style="color:#06b6d4">Atomic ops</span><span>— CPU garante atomicidade: AtomicInteger (Java), atomic (C++), Atomics (JS)</span></div>
    <div class="pt2-r-row"><span style="color:#06b6d4">Sem compartilhamento</span><span>— cada thread tem seu contador local; merge no final (reduce)</span></div>
    <div class="pt2-r-row"><span style="color:#06b6d4">Canal (Go)</span><span>— goroutine dedicada ao contador; outros enviam via channel</span></div>
  </div>
</div>`,
      caption: "counter++ não é atômica — são 3 instruções de máquina (LOAD, ADD, STORE). O OS pode interromper a thread entre qualquer duas delas. Mutex garante que a sequência inteira é executada sem interrupção.",
    },
    {
      title: "Deadlock — Condições e Prevenção",
      html: `<style>
.pt3-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.pt3-title{font-size:13px;font-weight:700;color:#f59e0b;margin:0 0 4px}
.pt3-sub{font-size:10px;color:#475569;margin:0 0 14px}
.pt3-conds{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px}
.pt3-cond{background:#1e293b;border-radius:8px;padding:10px;border:1.5px solid #f59e0b20;text-align:center}
.pt3-cond-icon{font-size:20px;margin-bottom:6px}
.pt3-cond-name{font-size:10px;font-weight:700;color:#fbbf24;margin-bottom:4px}
.pt3-cond-body{font-size:9px;color:#64748b;line-height:1.6}
.pt3-example{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.pt3-ex-box{background:#1e293b;border-radius:8px;padding:12px;border:1.5px solid #ef444430}
.pt3-ex-title{font-size:10px;font-weight:700;color:#ef4444;margin-bottom:8px}
.pt3-ex-step{font-size:10px;color:#94a3b8;margin-bottom:5px;line-height:1.6;display:flex;gap:6px;align-items:flex-start}
.pt3-arrow{color:#ef4444}
.pt3-fix{background:#1e293b;border-radius:8px;padding:12px;border:1px solid #334155}
.pt3-fix-title{font-size:10px;font-weight:700;color:#22c55e;margin-bottom:8px}
.pt3-fix-row{display:flex;gap:8px;font-size:10px;color:#94a3b8;margin-bottom:6px;align-items:flex-start;line-height:1.6}
.pt3-fix-key{color:#06b6d4;font-weight:700;white-space:nowrap;min-width:90px}
</style>
<div class="pt3-wrap">
  <p class="pt3-title">Deadlock — As 4 Condições de Coffman</p>
  <p class="pt3-sub">Deadlock só ocorre quando TODAS as 4 condições se cumprem simultaneamente</p>
  <div class="pt3-conds">
    <div class="pt3-cond">
      <div class="pt3-cond-icon">🔒</div>
      <div class="pt3-cond-name">Mutual Exclusion</div>
      <div class="pt3-cond-body">Recurso não pode ser compartilhado — só uma thread por vez</div>
    </div>
    <div class="pt3-cond">
      <div class="pt3-cond-icon">🤝</div>
      <div class="pt3-cond-name">Hold &amp; Wait</div>
      <div class="pt3-cond-body">Thread segura recurso A enquanto espera pelo recurso B</div>
    </div>
    <div class="pt3-cond">
      <div class="pt3-cond-icon">🚫</div>
      <div class="pt3-cond-name">No Preemption</div>
      <div class="pt3-cond-body">Recurso só é liberado voluntariamente — não pode ser tomado à força</div>
    </div>
    <div class="pt3-cond">
      <div class="pt3-cond-icon">🔄</div>
      <div class="pt3-cond-name">Circular Wait</div>
      <div class="pt3-cond-body">A espera B, B espera A — cadeia circular de espera</div>
    </div>
  </div>
  <div class="pt3-example">
    <div class="pt3-ex-box">
      <div class="pt3-ex-title">Cenário de Deadlock Clássico</div>
      <div class="pt3-ex-step"><span class="pt3-arrow">▸</span><span>Thread A adquire <strong>mutex1</strong></span></div>
      <div class="pt3-ex-step"><span class="pt3-arrow">▸</span><span>Thread B adquire <strong>mutex2</strong></span></div>
      <div class="pt3-ex-step"><span class="pt3-arrow">▸</span><span>Thread A tenta adquirir <strong>mutex2</strong> → <span style="color:#ef4444">BLOQUEIA</span></span></div>
      <div class="pt3-ex-step"><span class="pt3-arrow">▸</span><span>Thread B tenta adquirir <strong>mutex1</strong> → <span style="color:#ef4444">BLOQUEIA</span></span></div>
      <div style="font-size:10px;color:#ef4444;margin-top:8px;padding:6px 8px;background:#ef444410;border-radius:6px;line-height:1.6">
        Deadlock! A e B esperam uma pela outra para sempre. Nem uma avança.
      </div>
    </div>
    <div class="pt3-fix">
      <div class="pt3-fix-title">Como Prevenir — Estratégias Práticas</div>
      <div class="pt3-fix-row">
        <span class="pt3-fix-key">Lock ordering</span>
        <span>Toda thread adquire locks na mesma ordem global. A e B: sempre mutex1 antes de mutex2.</span>
      </div>
      <div class="pt3-fix-row">
        <span class="pt3-fix-key">Timeout</span>
        <span>Se não adquire em N ms, libera tudo e tenta novamente (retry com backoff).</span>
      </div>
      <div class="pt3-fix-row">
        <span class="pt3-fix-key">Trylock</span>
        <span>Tenta adquirir; se não consegue imediatamente, libera o que tem e recomeça.</span>
      </div>
      <div class="pt3-fix-row">
        <span class="pt3-fix-key">Alto nível</span>
        <span>Channels (Go), actors, transações STM — eliminam locks explícitos.</span>
      </div>
    </div>
  </div>
</div>`,
      caption: "Lock ordering é a prevenção mais simples e eficaz: se todo mundo sempre adquire mutex1 antes de mutex2, nunca haverá espera circular. Codifique a ordem como constante global, nunca deixe implícito.",
    },
    {
      title: "Cheatsheet — Sincronização, GIL e Node.js",
      html: `<style>
.pt4-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.pt4-title{font-size:13px;font-weight:700;color:#06b6d4;margin:0 0 4px}
.pt4-sub{font-size:10px;color:#475569;margin:0 0 14px}
.pt4-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pt4-section{background:#1e293b;border-radius:8px;padding:12px;border:1px solid #334155}
.pt4-s-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #334155}
.pt4-row{display:flex;gap:8px;font-size:10px;color:#94a3b8;margin-bottom:6px;align-items:flex-start;line-height:1.6}
.pt4-key{font-weight:700;min-width:90px;white-space:nowrap}
.pt4-tag{font-size:9px;font-weight:700;border-radius:3px;padding:1px 5px;margin-left:4px}
</style>
<div class="pt4-wrap">
  <p class="pt4-title">Cheatsheet — Concorrência e Paralelismo</p>
  <p class="pt4-sub">Referência rápida de primitivas, GIL e padrões Node.js</p>
  <div class="pt4-grid">
    <div class="pt4-section">
      <div class="pt4-s-title" style="color:#06b6d4">Primitivas de Sincronização</div>
      <div class="pt4-row"><span class="pt4-key" style="color:#06b6d4">Mutex</span><span>1 thread na seção crítica. Lock/unlock obrigatórios.</span></div>
      <div class="pt4-row"><span class="pt4-key" style="color:#06b6d4">Semáforo</span><span>N slots. wait() decrementa, signal() incrementa.</span></div>
      <div class="pt4-row"><span class="pt4-key" style="color:#06b6d4">Condition Var</span><span>Thread dorme esperando condição. Libera mutex atomicamente.</span></div>
      <div class="pt4-row"><span class="pt4-key" style="color:#06b6d4">Atomic</span><span>CAS hardware. Lock-free para contadores simples.</span></div>
      <div class="pt4-row"><span class="pt4-key" style="color:#06b6d4">RWLock</span><span>Múltiplos readers OU um writer. Leitura não bloqueia leitura.</span></div>
    </div>
    <div class="pt4-section">
      <div class="pt4-s-title" style="color:#f59e0b">GIL por Linguagem</div>
      <div class="pt4-row"><span class="pt4-key" style="color:#f59e0b">Python</span><span>GIL sim. CPU-bound: multiprocessing. I/O: threads ok.</span></div>
      <div class="pt4-row"><span class="pt4-key" style="color:#f59e0b">Ruby MRI</span><span>GIL sim. Igual Python. JRuby não tem GIL.</span></div>
      <div class="pt4-row"><span class="pt4-key" style="color:#f59e0b">Java</span><span>Sem GIL. Threads reais com JMM (volatile, synchronized).</span></div>
      <div class="pt4-row"><span class="pt4-key" style="color:#f59e0b">Go</span><span>Sem GIL. Goroutines + channels. M:N threading.</span></div>
      <div class="pt4-row"><span class="pt4-key" style="color:#f59e0b">Node.js</span><span>Single-thread JS. Cluster (procs) ou worker_threads.</span></div>
    </div>
    <div class="pt4-section">
      <div class="pt4-s-title" style="color:#22c55e">Node.js — Quando Usar Cada</div>
      <div class="pt4-row"><span class="pt4-key" style="color:#22c55e">Event loop</span><span>I/O-bound. Padrão. Async/await. Não bloquear.</span></div>
      <div class="pt4-row"><span class="pt4-key" style="color:#22c55e">worker_threads</span><span>CPU-bound. Compartilha memória via SharedArrayBuffer.</span></div>
      <div class="pt4-row"><span class="pt4-key" style="color:#22c55e">cluster</span><span>HTTP server. Fork por core. Isolamento de processo.</span></div>
      <div class="pt4-row"><span class="pt4-key" style="color:#22c55e">child_process</span><span>Executar binário externo. IPC via stdin/stdout.</span></div>
    </div>
    <div class="pt4-section">
      <div class="pt4-s-title" style="color:#ef4444">Armadilhas Comuns</div>
      <div class="pt4-row"><span style="color:#ef4444;font-weight:700">Race</span><span>Variável compartilhada sem lock. Incremento perdido.</span></div>
      <div class="pt4-row"><span style="color:#ef4444;font-weight:700">Deadlock</span><span>Ciclo de espera. Lock ordering previne.</span></div>
      <div class="pt4-row"><span style="color:#ef4444;font-weight:700">Starvation</span><span>Thread nunca avança. Fair locks e timeout resolvem.</span></div>
      <div class="pt4-row"><span style="color:#ef4444;font-weight:700">False sharing</span><span>Variáveis na mesma cache line. Padding de 64 bytes.</span></div>
    </div>
  </div>
</div>`,
      caption: "Regra geral: se linguagem tem GIL, use processos para CPU; se não tem (Java, Go, C++), use threads. Em Node.js, prefira event loop + async para I/O e worker_threads apenas para computação pesada.",
    },
  ],
  cheatsheet: {
    title: "Cheatsheet de Processos e Threads",
    html: `<style>
.ptcs-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.ptcs-title{font-size:13px;font-weight:700;color:#06b6d4;margin:0 0 14px;padding-bottom:8px;border-bottom:2px solid #06b6d430}
.ptcs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.ptcs-section{background:#1e293b;border-radius:8px;padding:12px}
.ptcs-s-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #334155}
.ptcs-item{display:flex;gap:6px;font-size:10px;color:#94a3b8;margin-bottom:5px;line-height:1.6;align-items:flex-start}
.ptcs-code{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:4px;padding:1px 5px;font-size:9px;color:#67e8f9}
</style>
<div class="ptcs-wrap">
  <div class="ptcs-title">Processos &amp; Threads — Referência Rápida</div>
  <div class="ptcs-grid">
    <div class="ptcs-section">
      <div class="ptcs-s-title" style="color:#06b6d4">Processo</div>
      <div class="ptcs-item"><span style="color:#06b6d4">▸</span><span>Memória isolada (code+data+heap+stack)</span></div>
      <div class="ptcs-item"><span style="color:#06b6d4">▸</span><span>Criado via <span class="ptcs-code">fork()</span> (Unix) ou <span class="ptcs-code">CreateProcess()</span> (Win)</span></div>
      <div class="ptcs-item"><span style="color:#06b6d4">▸</span><span>Crash isolado — não afeta outros processos</span></div>
      <div class="ptcs-item"><span style="color:#06b6d4">▸</span><span>IPC: pipe, socket, shared memory, mqueue</span></div>
      <div class="ptcs-item"><span style="color:#06b6d4">▸</span><span>Overhead maior de criação (~ms)</span></div>
    </div>
    <div class="ptcs-section">
      <div class="ptcs-s-title" style="color:#a78bfa">Thread</div>
      <div class="ptcs-item"><span style="color:#a78bfa">▸</span><span>Compartilha heap/globals do processo</span></div>
      <div class="ptcs-item"><span style="color:#a78bfa">▸</span><span>Stack própria (1-8MB por thread)</span></div>
      <div class="ptcs-item"><span style="color:#a78bfa">▸</span><span>Criação rápida (~µs)</span></div>
      <div class="ptcs-item"><span style="color:#a78bfa">▸</span><span>Bug pode derrubar processo inteiro</span></div>
      <div class="ptcs-item"><span style="color:#a78bfa">▸</span><span>Context switch: ~1-10µs</span></div>
    </div>
    <div class="ptcs-section">
      <div class="ptcs-s-title" style="color:#22c55e">Sincronização</div>
      <div class="ptcs-item"><span style="color:#22c55e">▸</span><span>Mutex: acesso exclusivo</span></div>
      <div class="ptcs-item"><span style="color:#22c55e">▸</span><span>RWLock: múltiplos readers, 1 writer</span></div>
      <div class="ptcs-item"><span style="color:#22c55e">▸</span><span>Semáforo: N slots simultâneos</span></div>
      <div class="ptcs-item"><span style="color:#22c55e">▸</span><span>Condition var: dormir até condição</span></div>
      <div class="ptcs-item"><span style="color:#22c55e">▸</span><span>Atomic/CAS: lock-free para inteiros</span></div>
    </div>
    <div class="ptcs-section">
      <div class="ptcs-s-title" style="color:#f59e0b">GIL</div>
      <div class="ptcs-item"><span style="color:#f59e0b">▸</span><span>Python, Ruby MRI: threads não paralelizam CPU</span></div>
      <div class="ptcs-item"><span style="color:#f59e0b">▸</span><span>CPU-bound → multiprocessing / subprocess</span></div>
      <div class="ptcs-item"><span style="color:#f59e0b">▸</span><span>I/O-bound → threads ok (libera GIL)</span></div>
      <div class="ptcs-item"><span style="color:#f59e0b">▸</span><span>C extensions (numpy): soltam GIL</span></div>
    </div>
    <div class="ptcs-section">
      <div class="ptcs-s-title" style="color:#38bdf8">Node.js</div>
      <div class="ptcs-item"><span style="color:#38bdf8">▸</span><span>JS single-thread (event loop)</span></div>
      <div class="ptcs-item"><span style="color:#38bdf8">▸</span><span>I/O: libuv thread pool (4 threads)</span></div>
      <div class="ptcs-item"><span style="color:#38bdf8">▸</span><span>CPU: worker_threads + SharedArrayBuffer</span></div>
      <div class="ptcs-item"><span style="color:#38bdf8">▸</span><span>HTTP scale: cluster (1 proc/core)</span></div>
    </div>
    <div class="ptcs-section">
      <div class="ptcs-s-title" style="color:#ef4444">Anti-patterns</div>
      <div class="ptcs-item"><span style="color:#ef4444">✗</span><span>Variável sem lock entre threads</span></div>
      <div class="ptcs-item"><span style="color:#ef4444">✗</span><span>Lock ordering inconsistente → deadlock</span></div>
      <div class="ptcs-item"><span style="color:#ef4444">✗</span><span>Unlock em path de erro esquecido</span></div>
      <div class="ptcs-item"><span style="color:#ef4444">✗</span><span>Thread pool ilimitado → OOM</span></div>
      <div class="ptcs-item"><span style="color:#ef4444">✗</span><span>fork() com threads ativas → child inconsistente</span></div>
    </div>
  </div>
</div>`,
    caption: "Use SEMPRE lock ordering para evitar deadlock. Dimensione thread pool: CPU-bound = N cores; I/O-bound = N × 2-4 (threads dormem aguardando I/O).",
  },
  mindmap: {
    title: "Mind Map — Processos e Threads",
    html: `<style>
.ptmm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.ptmm-title{font-size:13px;font-weight:700;color:#06b6d4;margin:0 0 14px;text-align:center}
.ptmm-center{display:flex;justify-content:center;margin-bottom:16px}
.ptmm-root{background:#06b6d420;border:2px solid #06b6d4;border-radius:10px;padding:8px 20px;font-size:13px;font-weight:700;color:#06b6d4}
.ptmm-branches{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.ptmm-branch{background:#1e293b;border-radius:8px;padding:12px;border:1.5px solid #334155}
.ptmm-b-title{font-size:11px;font-weight:700;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #334155}
.ptmm-leaf{font-size:10px;color:#94a3b8;margin-bottom:4px;line-height:1.6;display:flex;gap:6px;align-items:flex-start}
.ptmm-dot{font-weight:700;margin-top:1px}
</style>
<div class="ptmm-wrap">
  <p class="ptmm-title">Mapa Mental — Processos, Threads e Concorrência</p>
  <div class="ptmm-center">
    <div class="ptmm-root">Concorrência &amp; Paralelismo</div>
  </div>
  <div class="ptmm-branches">
    <div class="ptmm-branch" style="border-color:#06b6d430">
      <div class="ptmm-b-title" style="color:#06b6d4">Processo</div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#06b6d4">▸</span><span>Memória isolada</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#06b6d4">▸</span><span>fork() + exec()</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#06b6d4">▸</span><span>IPC: pipe/socket/shm</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#06b6d4">▸</span><span>Crash isolation</span></div>
    </div>
    <div class="ptmm-branch" style="border-color:#a78bfa30">
      <div class="ptmm-b-title" style="color:#a78bfa">Thread</div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#a78bfa">▸</span><span>Heap compartilhado</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#a78bfa">▸</span><span>Stack própria (1-8MB)</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#a78bfa">▸</span><span>Context switch: 1-10µs</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#a78bfa">▸</span><span>Pool: CPU=N, I/O=N×2-4</span></div>
    </div>
    <div class="ptmm-branch" style="border-color:#22c55e30">
      <div class="ptmm-b-title" style="color:#22c55e">Sincronização</div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#22c55e">▸</span><span>Mutex (exclusão mútua)</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#22c55e">▸</span><span>Semáforo (N slots)</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#22c55e">▸</span><span>Condition var (wait)</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#22c55e">▸</span><span>Atomic CAS (lock-free)</span></div>
    </div>
    <div class="ptmm-branch" style="border-color:#ef444430">
      <div class="ptmm-b-title" style="color:#ef4444">Problemas</div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#ef4444">▸</span><span>Race condition</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#ef4444">▸</span><span>Deadlock (4 condições)</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#ef4444">▸</span><span>Starvation</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#ef4444">▸</span><span>False sharing (cache)</span></div>
    </div>
    <div class="ptmm-branch" style="border-color:#f59e0b30">
      <div class="ptmm-b-title" style="color:#f59e0b">GIL</div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#f59e0b">▸</span><span>Python/Ruby: 1 thread/vez</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#f59e0b">▸</span><span>CPU → multiprocessing</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#f59e0b">▸</span><span>I/O → threads ok</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#f59e0b">▸</span><span>PEP 703: GIL opcional</span></div>
    </div>
    <div class="ptmm-branch" style="border-color:#38bdf830">
      <div class="ptmm-b-title" style="color:#38bdf8">Node.js</div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#38bdf8">▸</span><span>Event loop (single-thread)</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#38bdf8">▸</span><span>worker_threads (CPU)</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#38bdf8">▸</span><span>cluster (HTTP scale)</span></div>
      <div class="ptmm-leaf"><span class="ptmm-dot" style="color:#38bdf8">▸</span><span>SharedArrayBuffer + Atomics</span></div>
    </div>
  </div>
</div>`,
    caption: "Concorrência ≠ Paralelismo: concorrência é lidar com múltiplas tarefas (pode ser single-core); paralelismo é executá-las genuinamente ao mesmo tempo (múltiplos cores). Node é concorrente. Go é concorrente e paralelo.",
  },
  mnemonics: [
    {
      label: "Processo vs Thread: 'Processo tem PRAIA própria; Thread COMPARTILHA a praia'",
      trick: "P.R.A.I.A — Privado, Robusto (crash isolation), Alto custo, IPC necessário, Área própria",
      explanation: "Processo: tudo privado (memória, file descriptors). Crash de um não afeta outro (Robusto). Custo de criação Alto. Para comunicar, precisa de IPC. Thread: compartilha a 'praia' (heap) com outras threads do mesmo processo — mais rápida mas com risco de 'colisão'.",
    },
    {
      label: "Deadlock: '4 Condições Mal Hão de Criar'",
      trick: "MNCP — Mutual exclusion, No preemption, Circular wait, hold and wait (Plus)",
      explanation: "As 4 condições de Coffman: Mutual exclusion (recurso não compartilhável), No preemption (recurso não pode ser tomado à força), Circular wait (A→B→A), Hold and wait (segura recurso enquanto espera outro). TODAS as 4 precisam ocorrer simultaneamente para deadlock.",
    },
    {
      label: "GIL lembra: 'Python Grilhado, I/O Livre'",
      trick: "GIL = Grilhão para CPU, Liberdade para I/O",
      explanation: "GIL é um grilhão para threads que querem paralizar CPU: só uma thread executa bytecode por vez. Mas para I/O (rede, disco), a thread solta o GIL enquanto aguarda — outras threads podem executar. Grilhado em CPU, Livre em I/O.",
    },
    {
      label: "Context switch custo: 'Switch é SIR: Save, Invalidate, Restore'",
      trick: "SIR — Save registers, Invalidate caches, Restore context",
      explanation: "Context switch: Save (salva registradores/PC da thread atual no PCB), Invalidate (TLB e caches ficam quentes para outra thread — cache miss), Restore (carrega contexto da próxima thread). O custo de cache miss (I) é frequentemente maior que Save+Restore.",
    },
    {
      label: "Node.js concorrência: 'I/O Assíncrono, CPU Trabalhador, HTTP Cluster'",
      trick: "I-C-H: I/O async (event loop), CPU → worker_threads, HTTP scale → cluster",
      explanation: "Para I/O: event loop assíncrono — async/await. Para CPU pesado: worker_threads (thread com SharedArrayBuffer). Para escalar servidor HTTP em múltiplos cores: cluster (fork por core, isolamento de processo). Cada tipo de problema tem sua solução em Node.",
    },
  ],
  exercises: [
    {
      level: "iniciante",
      title: "Race Condition com Atomics em Node.js",
      description: "Crie dois worker threads que incrementam um contador compartilhado via SharedArrayBuffer. Primeiro sem Atomics (observe race condition: resultado menor que 2000), depois use Atomics.add() e verifique resultado correto (2000).",
      concepts: ["SharedArrayBuffer", "worker_threads", "race condition", "Atomics", "Int32Array"],
    },
    {
      level: "intermediario",
      title: "Pool de Workers para CPU-bound",
      description: "Implemente um pool de 4 worker threads em Node.js que processa tarefas CPU-bound (cálculo de Fibonacci(40) × 100). O pool deve aceitar tarefas via uma fila, distribuir entre workers ociosos e retornar os resultados em ordem. Compare o tempo de execução sequencial vs paralelo.",
      concepts: ["worker_threads", "thread pool", "task queue", "paralelismo", "CPU-bound"],
    },
    {
      level: "intermediario",
      title: "Producer-Consumer com Semáforo",
      description: "Implemente um producer-consumer em Node.js usando worker_threads e Atomics para simular semáforo: um producer thread gera números em um buffer circular de tamanho 10; um consumer processa. Use Atomics.wait/notify para sincronizar sem busy-wait. Produza 1000 números e verifique que todos foram consumidos.",
      concepts: ["semáforo", "buffer circular", "producer-consumer", "Atomics.wait", "Atomics.notify", "sincronização"],
    },
    {
      level: "senior",
      title: "Detecção de Deadlock com Timeout",
      description: "Implemente em JavaScript (ou pseudocódigo TypeScript) uma classe LockManager que gerencia mutexes com detecção de deadlock via timeout. A classe deve: registrar qual lock cada 'thread' (identificada por ID) está segurando; lançar erro com wait-for graph se detectar ciclo após 5s de espera; logar a sequência de aquisição de locks.",
      concepts: ["deadlock", "wait-for graph", "timeout", "lock ordering", "mutex", "prevenção de deadlock"],
    },
    {
      level: "senior",
      title: "Servidor HTTP Multi-Core com Cluster e Estado Compartilhado",
      description: "Crie um servidor HTTP Express com cluster (1 processo por core). O servidor tem um endpoint /counter que incrementa e retorna um contador global. Resolva o problema de estado não compartilhado entre processos usando Redis como store compartilhado. Compare com uma implementação naive que não funciona (contador local por processo). Adicione graceful shutdown com SIGTERM.",
      concepts: ["cluster", "multi-core", "estado distribuído", "Redis", "IPC", "graceful shutdown", "fork"],
    },
  ],
  codeExamples: [
    {
      title: "Worker Threads com SharedArrayBuffer e Atomics",
      language: "typescript",
      code: `import { Worker, isMainThread, workerData, parentPort } from 'worker_threads'
import { fileURLToPath } from 'url'

// ── Cenário: contador compartilhado entre threads ─────────────────────────────

const ITERATIONS = 1_000_000

if (isMainThread) {
  // Buffer compartilhado — 1 Int32 para o contador
  const sab = new SharedArrayBuffer(4)
  const counter = new Int32Array(sab)

  const workers = [
    new Worker(fileURLToPath(import.meta.url), { workerData: { sab } }),
    new Worker(fileURLToPath(import.meta.url), { workerData: { sab } }),
  ]

  let done = 0
  for (const worker of workers) {
    worker.on('message', () => {
      done++
      if (done === workers.length) {
        // Com Atomics: resultado sempre = 2_000_000
        // Sem Atomics: resultado < 2_000_000 (race condition)
        console.log('Resultado:', Atomics.load(counter, 0))
      }
    })
  }
} else {
  const counter = new Int32Array(workerData.sab)

  for (let i = 0; i < ITERATIONS; i++) {
    // Atomic add — garante que LOAD+ADD+STORE são atômicos
    Atomics.add(counter, 0, 1)
    // Sem Atomics (race condition):
    // counter[0] = counter[0] + 1  // 3 ops não-atômicas
  }

  parentPort!.postMessage('done')
}`,
    },
    {
      title: "Cluster Node.js — Servidor HTTP Multi-Core com Graceful Shutdown",
      language: "typescript",
      code: `import cluster from 'cluster'
import os from 'os'
import http from 'http'

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length
  console.log(\`Master \${process.pid} rodando. Forkando \${numCPUs} workers\`)

  // Forka 1 worker por core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  // Reinicia worker que morreu
  cluster.on('exit', (worker, code, signal) => {
    console.log(\`Worker \${worker.process.pid} morreu (\${signal || code}). Reiniciando.\`)
    cluster.fork()
  })

  // Graceful shutdown
  process.on('SIGTERM', () => {
    for (const id in cluster.workers) {
      cluster.workers[id]?.process.kill('SIGTERM')
    }
    setTimeout(() => process.exit(0), 5000)
  })
} else {
  // Código do worker — servidor HTTP
  const server = http.createServer((req, res) => {
    // Cada worker responde com seu PID
    res.end(\`Worker \${process.pid} respondeu\\n\`)
  })

  server.listen(3000, () => {
    console.log(\`Worker \${process.pid} escutando na porta 3000\`)
  })

  // Graceful shutdown do worker
  process.on('SIGTERM', () => {
    server.close(() => {
      console.log(\`Worker \${process.pid} finalizou conexões\`)
      process.exit(0)
    })
  })
}`,
    },
    {
      title: "Simulação de Deadlock e Prevenção com Lock Ordering",
      language: "typescript",
      code: `// Simulação de deadlock via lock ordering em JavaScript
// (Em produção real seria com Mutex nativo, aqui usamos Promise pra simular)

class Mutex {
  private locked = false
  private queue: Array<() => void> = []

  async acquire(timeoutMs = 5000): Promise<() => void> {
    return new Promise((resolve, reject) => {
      const tryAcquire = () => {
        if (!this.locked) {
          this.locked = true
          resolve(() => this.release())
          return
        }
        this.queue.push(tryAcquire)
      }

      const timeout = setTimeout(() => {
        const idx = this.queue.indexOf(tryAcquire)
        if (idx !== -1) this.queue.splice(idx, 1)
        reject(new Error('Mutex timeout — possível deadlock'))
      }, timeoutMs)

      const originalTryAcquire = tryAcquire.bind(this)
      this.queue.push(() => {
        clearTimeout(timeout)
        originalTryAcquire()
      })
      tryAcquire()
    })
  }

  private release() {
    this.locked = false
    const next = this.queue.shift()
    if (next) next()
  }
}

const mutex1 = new Mutex()
const mutex2 = new Mutex()

// ❌ Deadlock — Thread A: mutex1→mutex2; Thread B: mutex2→mutex1
async function deadlockScenario() {
  const threadA = async () => {
    const unlock1 = await mutex1.acquire()
    await new Promise(r => setTimeout(r, 10)) // Simula trabalho
    try {
      const unlock2 = await mutex2.acquire(500) // timeout 500ms
      unlock2()
    } catch (e) {
      console.error('Thread A detectou deadlock:', (e as Error).message)
    } finally {
      unlock1()
    }
  }

  const threadB = async () => {
    const unlock2 = await mutex2.acquire()
    await new Promise(r => setTimeout(r, 10))
    try {
      const unlock1 = await mutex1.acquire(500)
      unlock1()
    } catch (e) {
      console.error('Thread B detectou deadlock:', (e as Error).message)
    } finally {
      unlock2()
    }
  }

  await Promise.all([threadA(), threadB()])
}

// ✓ Prevenção — Lock ordering: ambos sempre mutex1→mutex2
async function safeScenario() {
  const withBothLocks = async (name: string) => {
    const unlock1 = await mutex1.acquire()   // sempre mutex1 primeiro
    const unlock2 = await mutex2.acquire()   // sempre mutex2 segundo
    console.log(\`\${name}: dentro da seção crítica\`)
    await new Promise(r => setTimeout(r, 10))
    unlock2()
    unlock1()
  }

  await Promise.all([
    withBothLocks('Thread A'),
    withBothLocks('Thread B'),
  ])
}`,
    },
    {
      title: "Pool de Threads com Tarefa Queue",
      language: "typescript",
      code: `import { Worker, isMainThread, workerData, parentPort } from 'worker_threads'

// ── Worker Thread ─────────────────────────────────────────────────────────────
if (!isMainThread) {
  // Worker espera tarefas via message
  parentPort!.on('message', ({ taskId, input }: { taskId: number; input: number }) => {
    // Simula trabalho CPU-bound
    let result = 0
    for (let i = 0; i < input; i++) result += Math.sqrt(i)
    parentPort!.postMessage({ taskId, result })
  })
}

// ── Thread Pool ───────────────────────────────────────────────────────────────
class WorkerPool {
  private workers: Worker[] = []
  private queue: Array<{ taskId: number; input: number; resolve: (v: number) => void }> = []
  private available: Worker[] = []
  private resolvers = new Map<number, (v: number) => void>()
  private taskCounter = 0

  constructor(size: number, workerFile: string) {
    for (let i = 0; i < size; i++) {
      const worker = new Worker(workerFile)
      worker.on('message', ({ taskId, result }) => {
        this.resolvers.get(taskId)?.(result)
        this.resolvers.delete(taskId)
        this.available.push(worker)
        this.drain() // processa próxima tarefa da fila
      })
      this.workers.push(worker)
      this.available.push(worker)
    }
  }

  async run(input: number): Promise<number> {
    return new Promise((resolve) => {
      const taskId = ++this.taskCounter
      this.resolvers.set(taskId, resolve)
      this.queue.push({ taskId, input, resolve })
      this.drain()
    })
  }

  private drain() {
    while (this.queue.length && this.available.length) {
      const task = this.queue.shift()!
      const worker = this.available.shift()!
      worker.postMessage({ taskId: task.taskId, input: task.input })
    }
  }

  async terminate() {
    await Promise.all(this.workers.map(w => w.terminate()))
  }
}

// Uso — paralela 8 tarefas em 4 workers
async function main() {
  if (!isMainThread) return
  const pool = new WorkerPool(4, import.meta.filename)
  const tasks = Array.from({ length: 8 }, (_, i) => 10_000_000 * (i + 1))
  const results = await Promise.all(tasks.map(n => pool.run(n)))
  console.log('Resultados:', results.map(r => r.toFixed(0)))
  await pool.terminate()
}

main()`,
    },
  ],
  videos: [
    { title: "Processes and Threads — Computer Science Fundamentals", channel: "Computerphile", url: "https://www.youtube.com/watch?v=exbKr6fnoUw" },
    { title: "Threading in Python — The GIL and Multiprocessing", channel: "Corey Schafer", url: "https://www.youtube.com/watch?v=IEEhzQoKtQU" },
    { title: "Node.js Worker Threads Tutorial", channel: "Academind", url: "https://www.youtube.com/watch?v=MuwJJrfIfsU" },
    { title: "Race Conditions and How to Avoid Them", channel: "Reducible", url: "https://www.youtube.com/watch?v=RDzLOKh9jMI" },
    { title: "Concurrency vs Parallelism — Go Language Patterns", channel: "Google Open Source", url: "https://www.youtube.com/watch?v=cN_DpYBzKso" },
    { title: "Operating Systems — Processes and Threads (MIT OpenCourseWare)", channel: "MIT OpenCourseWare", url: "https://www.youtube.com/watch?v=dxLU5p5QLPY" },
  ],
  resources: [
    { title: "OSTEP — Operating Systems: Three Easy Pieces (Concurrency)", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", kind: "livro" },
    { title: "Beej's Guide to Unix IPC", url: "https://beej.us/guide/bgipc/", kind: "livro" },
    { title: "Node.js — Worker Threads Docs", url: "https://nodejs.org/api/worker_threads.html", kind: "docs" },
    { title: "Python — multiprocessing vs threading", url: "https://docs.python.org/3/library/multiprocessing.html", kind: "docs" },
    { title: "MDN — SharedArrayBuffer e Atomics", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer", kind: "docs" },
    { title: "Brendan Gregg — Linux Performance (CPU Profiling)", url: "https://www.brendangregg.com/linuxperf.html", kind: "artigo" },
    { title: "Go Concurrency Patterns (Google I/O 2012)", url: "https://go.dev/blog/concurrency-patterns", kind: "artigo" },
    { title: "Java Concurrency in Practice — Brian Goetz", url: "https://jcip.net/", kind: "livro" },
  ],
}

export default processosThreads
