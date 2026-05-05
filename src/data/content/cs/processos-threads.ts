import type { SkillContent } from "@/types"

const processosThreads: SkillContent = {
    tagline: "Processo é isolado com sua memória; thread compartilha memória com outras do mesmo processo.",
    why: "Senior precisa entender concorrência em sistema. Por que Node usa cluster (processo) vs worker_threads. Por que Python tem GIL. Quando race condition vira bug.",
    summary: "Processo: unidade de execução isolada (memória própria, file descriptors). Thread: leve, compartilha memória do processo. Threads permitem paralelismo (em CPUs múltiplas) com overhead menor, mas exigem sync (mutex, semaforo) por causa de race condition. JS roda single-thread no event loop; pra paralelo usa Worker. Python tem GIL — threads não paralelizam CPU; use multiprocessing.",
    keypoints: [
      { title: "Processo", body: "Espaco de memória próprio. fork() cria copia. IPC via pipe, socket, shared mem. Crash de um não mata outros." },
      { title: "Thread", body: "Compartilha heap do processo, tem stack próprio. Overhead menor pra criar. Bug em uma derruba processo todo." },
      { title: "Race condition", body: "Resultado depende de ordem de execução não determinista. Ex: i++ em duas threads sem lock perde incremento." },
      { title: "Mutex", body: "Mutual exclusion. So uma thread no critical section. Risco: deadlock (A espera B, B espera A)." },
      { title: "Semaforo", body: "Conta N slots. Threads esperam slot livre. Útil pra limitar concorrência (rate limiter, connection pool)." },
      { title: "GIL (Python)", body: "Global Interpreter Lock — só uma thread Python executa bytecode por vez. Threads ainda úteis pra I/O (libera GIL); pra CPU usa multiprocessing." },
      { title: "Node concurrency", body: "JS single-thread no event loop. Cluster: processo por core (pra HTTP server). Worker threads: thread separada pra CPU-bound (compartilha memória via SharedArrayBuffer)." },
      { title: "Async I/O", body: "Alternativa a threads pra I/O. Single thread atende milhares de conexões via epoll/kqueue. Eh o que Node, Go, asyncio fazem." },
    ],
    gotchas: [
      "Compartilhar variável entre threads sem lock — race condition silenciosa.",
      "Esquecer release de mutex em path de erro — deadlock.",
      "Em Python, esperar threads paralelizem CPU — GIL impede. Use multiprocessing ou C extension.",
      "Em Node, achar que worker é \"free\" — IPC tem overhead, usa SharedArrayBuffer pra zero-copy.",
      "Fork em processo com varios threads -> child fica em estado inconsistente.",
      "Thread pool sem limite -> esgota memória. Sempre cap.",
      "Async com bloqueio síncrono (fs.readFileSync, requests sync) trava o event loop.",
    ],
    interview: [
      { q: "Diferenca entre processo e thread?", a: "<p><strong>Processo</strong>: memória isolada. Crash não afeta outros. Custo de criação maior. IPC é explícito.</p><p><strong>Thread</strong>: compartilha memória do processo. Cria rápido, comunica fácil. Bug em uma derruba processo todo. Precisa sync.</p><p>Processo pra isolamento; thread pra paralelismo barato.</p>" },
      { q: "O que é GIL e por que existe?", a: "<p>Global Interpreter Lock (CPython): um lock que só deixa uma thread executar bytecode Python por vez.</p><p>Existe pra simplicidade do interpretador (memory management de objects não precisa ser thread-safe).</p><p>Consequência: threads não paralelizam CPU. Pra workload CPU-bound em Python, use <code>multiprocessing</code> ou C extensions (numpy, que solta GIL).</p>" },
      { q: "Como Node.js consegue ser concorrente sendo single-thread?", a: "<p>Event loop + async I/O. JS roda em uma thread, mas I/O (fs, net, http) é feito em thread pool da libuv (4 threads default). Quando termina, callback volta pra event loop.</p><p>Pra CPU-bound: <code>worker_threads</code> (thread real). Pra paralelizar HTTP server: <code>cluster</code> (múltiplos processos, balanceam por kernel).</p>" },
      { q: "O que é race condition? Da exemplo", a: "<p>Resultado depende de ordem não determinista. Clássico:</p><p><code>// counter compartilhado<br>counter = counter + 1; // 3 instruções (load, add, store)</code></p><p>Duas threads simultaneas: ambas leem 0, ambas escrevem 1. Esperado 2, virou 1. Solução: mutex em volta, ou atomic op.</p>" },
      { q: "Quando usaria threads vs processos?", a: "<ul><li><strong>Threads</strong>: workload precisa compartilhar muita memória (cache, model em memória). Custo de IPC seria alto.</li><li><strong>Processos</strong>: precisa isolamento (security, sandboxing) ou linguagem com GIL (Python, Ruby) pra CPU. HTTP servers em Python/Ruby usam workers (gunicorn, puma).</li></ul>" },
      { q: "Como evita deadlock?", a: "<ul><li><strong>Lock ordering</strong>: sempre aquire locks em mesma ordem global.</li><li><strong>Timeout</strong> em lock: se não consegue em N segundos, libera tudo e retry.</li><li><strong>Avoid nested locks</strong>: simplifica regiao crítica.</li><li><strong>Use higher-level primitives</strong>: channels, atomic, lock-free DSs.</li></ul>" },
    ],
    resources: [
      { title: "OSTEP — Operating Systems: Three Easy Pieces", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", kind: "livro" },
      { title: "Beej's Guide to Unix IPC", url: "https://beej.us/guide/bgipc/", kind: "livro" },
      { title: "Python — multiprocessing vs threading", url: "https://docs.python.org/3/library/multiprocessing.html", kind: "docs" },
      { title: "Node.js — Worker Threads", url: "https://nodejs.org/api/worker_threads.html", kind: "docs" },
      { title: "Brendan Gregg — concurrency", url: "https://www.brendangregg.com/", kind: "artigo" },
    ],
  }

export default processosThreads
