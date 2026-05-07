'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta Processos & Threads ────────────────────────────────────────────────
const C    = '#06b6d4'  // cyan
const AMB  = '#f59e0b'
const GRN  = '#22c55e'
const PRP  = '#a78bfa'
const RED  = '#ef4444'
const SKY  = '#38bdf8'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre concorrência em entrevistas',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: processo vs thread, GIL, race condition, deadlock (4 condições de Coffman), context switch, SharedArrayBuffer com Atomics, lock-free/CAS, false sharing, goroutines Go vs POSIX threads, dimensionamento de thread pool e fork() com COW.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam concorrência na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'PRAIA (Processo), 4 condições de Coffman, GIL = Grilhão para CPU / Livre para I/O, SIR para context switch (Save-Invalidate-Restore) e I-C-H para Node.js (I/O async, CPU worker_threads, HTTP cluster).',
    icon: '02',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Primitivas de sync, GIL e Node.js numa folha',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: mutex, semáforo, condition variable, atomic/CAS, RWLock; GIL por linguagem (Python, Ruby, Java, Go, Node); padrões Node.js (event loop, worker_threads, cluster, child_process); armadilhas (race, deadlock, starvation, false sharing).',
    icon: '03',
    goal: 'Consulta rápida',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Concorrência e paralelismo do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 6 ramos: Processo, Thread, Sincronização, Problemas (race/deadlock/starvation/false sharing), GIL e Node.js. Inclui checklist de auto-avaliação pré-entrevista sênior.',
    icon: '04',
    goal: 'Mapeamento mental',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual a diferença entre processo e thread?',
    a: '<strong>Processo</strong>: memória isolada (code, data, heap, stack separados). Crash não afeta outros processos. Custo de criação maior. Comunicação via IPC (pipe, socket, shared memory). <strong>Thread</strong>: compartilha heap do processo. Cria rápido (~µs), comunica via memória diretamente. Bug em uma thread pode derrubar o processo inteiro — precisa de sync. Use processo para isolamento; thread para paralelismo barato no mesmo contexto.',
    tip: 'Mencione o custo de IPC vs memória compartilhada. Processos = mais seguros (crash isolation); threads = mais eficientes mas exigem disciplina de sync.',
  },
  {
    level: 'Senior',
    q: 'O que é GIL e por que o CPython tem?',
    a: '<strong>Global Interpreter Lock</strong>: mutex global que só deixa uma thread executar bytecode Python por vez. Simplifica o reference counting do interpretador — sem ele, cada operação de objeto precisaria de lock granular, custoso. <strong>Consequência</strong>: threads Python não paralelizam CPU-bound. Para CPU: use <code>multiprocessing</code>. Para I/O: threads ok (liberam o GIL enquanto aguardam). PEP 703 (Python 3.13) torna o GIL opcional.',
    tip: 'Mencione PEP 703 — saber o roadmap da linguagem demonstra que você acompanha a evolução do ecossistema.',
  },
  {
    level: 'Pleno',
    q: 'Como Node.js consegue ser concorrente sendo single-thread?',
    a: '<strong>Event loop + async I/O</strong>. I/O é delegado para: thread pool da libuv (4 threads: fs, DNS, crypto) e kernel async I/O (epoll/kqueue) para sockets. Quando I/O termina, callback volta para a fila do event loop. Para CPU-bound: <code>worker_threads</code> (thread real com SharedArrayBuffer). Para escalar HTTP server: <code>cluster</code> — múltiplos processos com 1 por core.',
    tip: 'Diferencie cluster vs worker_threads: cluster é multi-processo (isolamento), worker_threads é multi-thread (memória compartilhada). A escolha depende do workload.',
  },
  {
    level: 'Pleno',
    q: 'O que é race condition? Dê um exemplo.',
    a: 'Resultado depende de ordem não determinista entre threads. <strong>Exemplo</strong>: counter++ não é atômica — são 3 instruções de máquina (LOAD, ADD, STORE). Duas threads podem executar LOAD antes que qualquer uma faça STORE → ambas somam 1 sobre o mesmo valor → um incremento é perdido silenciosamente. <strong>Solução</strong>: mutex no bloco crítico, ou operação atômica (Atomics em JS, AtomicInteger em Java, std::atomic em C++).',
    tip: 'Descreva as 3 instruções de máquina — demonstra que você entende que a abstração de alto nível esconde operações não-atômicas.',
  },
  {
    level: 'Senior',
    q: 'Como evitar deadlock? Quais as 4 condições necessárias?',
    a: '<strong>4 condições de Coffman</strong> (todas precisam se cumular): Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. <strong>Prevenção</strong>: (1) <strong>Lock ordering</strong> — sempre adquira locks em ordem global fixa (elimina Circular Wait); (2) <strong>Timeout</strong> — se não adquire em N ms, libera tudo e retry; (3) <strong>Trylock</strong> — falha imediatamente se não disponível; (4) primitivas de alto nível: channels (Go), actors (Erlang), lock-free.',
    tip: 'Comece sempre pelas 4 condições de Coffman — demonstra embasamento teórico. Depois discuta as estratégias práticas.',
  },
  {
    level: 'Senior',
    q: 'O que é context switch e qual seu custo real?',
    a: 'O OS pausa uma thread e retoma outra. Envolve: salvar registradores (PC, SP), atualizar PCB/TCB, carregar contexto da próxima thread, invalidar TLB parcialmente (se processo diferente). <strong>Custo: ~1-10µs</strong>. Mas o custo maior em produção é cache miss de L1/L2 — a thread nova acessa dados que não estão no cache quente da anterior. É por isso que event loop (Nginx, Node) e goroutines (Go) escalam melhor que thread-per-connection.',
    tip: 'O custo de cache miss é o insight de sênior — não é só salvar/restaurar registradores. Mencione Nginx vs Apache como case clássico de C10K problem.',
  },
  {
    level: 'Senior',
    q: 'Como funciona SharedArrayBuffer e Atomics no Node.js?',
    a: '<code>SharedArrayBuffer</code>: bloco de memória compartilhado entre thread principal e workers sem cópia (zero-copy). <code>postMessage</code> serializa (cópia = overhead); SAB não. <strong>Sincronização com Atomics</strong>: <code>Atomics.add(arr, 0, 1)</code> — incremento atômico; <code>Atomics.wait(arr, 0, 0)</code> — bloqueia enquanto valor é 0; <code>Atomics.notify(arr, 0, 1)</code> — acorda uma thread. Sem Atomics, SAB por si só tem race conditions.',
    tip: '<code>Atomics.wait</code> é bloqueante e não funciona na thread principal (travaria o event loop). Workers podem usar; thread principal deve usar <code>Atomics.waitAsync</code>.',
  },
  {
    level: 'Senior',
    q: 'O que é false sharing em cache de CPU?',
    a: 'Duas threads modificam variáveis <em>diferentes</em>, mas que estão na mesma cache line (64 bytes). O hardware invalida a cache line inteira quando qualquer byte é modificado — forçando a outra thread a recarregar do L3/RAM. <strong>Impacto</strong>: código aparentemente paralelo executa quase sequencialmente — pode degradar 10x. <strong>Fix</strong>: padding de 64 bytes entre variáveis que threads diferentes escrevem (<code>alignas(64)</code> em C++; stride de 16 slots em Int32Array do JS).',
    tip: 'False sharing aparece só em profiling de performance — é um bug silencioso. Mencionar a cache line size de 64 bytes e padding demonstra conhecimento de hardware.',
  },
  {
    level: 'Senior',
    q: 'Como Go trata concorrência diferente de threads POSIX?',
    a: 'Go usa <strong>goroutines</strong> — threads leves gerenciadas pelo runtime, não pelo OS. Stack inicial de 2-8KB (vs ~1MB de OS thread), crescimento dinâmico, context switch leve (~100ns vs ~1µs). Modelo: <strong>CSP — Communicating Sequential Processes</strong>. Em vez de memória compartilhada + mutex, usa channels. Mantra: <em>"Do not communicate by sharing memory; share memory by communicating."</em> O scheduler Go mapeia N goroutines em M OS threads (M:N threading).',
    tip: 'O mantra CSP é o diferencial. Compare com threads POSIX: Go inverte o paradigma — passagem de mensagem via channels em vez de mutex em memória compartilhada.',
  },
  {
    level: 'Senior',
    q: 'O que é lock-free programming e quando vale a pena?',
    a: 'Estruturas de dados onde operações concorrentes não bloqueiam umas às outras — usam CAS (Compare-And-Swap) atômico em vez de mutex. CAS: compara valor atual com esperado; se igual, substitui pelo novo; se alguém modificou, retry. <strong>Quando vale</strong>: contenção muito alta em mutex, queues de baixa latência (trading, streaming), contadores de performance. <strong>Quando NÃO vale</strong>: complexidade enorme, difícil depurar, ABA problem. Na maioria dos casos, mutex bem usado é suficiente.',
    tip: 'Mencione o ABA problem — CAS pode falsamente suceder se valor volta ao original. Usar versioned CAS (double-word CAS) resolve. Isso diferencia quem conhece lock-free na prática.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar threads vs processos?',
    a: '<strong>Threads</strong>: workload precisa compartilhar muita memória, custo de IPC seria proibitivo, linguagem sem GIL (Java, C++, Go, Rust). <strong>Processos</strong>: precisa de isolamento (segurança, crash isolation), linguagem tem GIL (Python, Ruby) com workload CPU-bound. Gunicorn (Python), Puma (Ruby) usam workers. <strong>Terceira opção</strong>: goroutines/actors — leveza de threads com isolamento similar a processos, gerenciados pelo runtime.',
    tip: 'Mencione Go como modelo de terceiro caminho — goroutines são M:N threads. Demonstra conhecimento além do básico processo/thread.',
  },
  {
    level: 'Senior',
    q: 'O que é condição de corrida de variável volátil (Java Memory Model)?',
    a: 'O JMM define quando uma thread enxerga as escritas de outra. Sem garantias, o compilador e CPU podem reordenar instruções ou manter valor em cache de registrador — outra thread nunca vê a escrita. <strong>volatile</strong>: garante visibilidade entre threads (happens-before). Sem volatile: flag de parada de thread pode lopar indefinidamente. <strong>synchronized</strong>: exclusão mútua + visibilidade. <strong>Happens-before</strong>: se A happens-before B, então B enxerga o estado escrito por A.',
    tip: 'O exemplo de <code>volatile boolean running</code> é o mais cobrado. Mostre que o problema não é de lógica mas de visibilidade de memória entre cores de CPU.',
  },
  {
    level: 'Pleno',
    q: 'O que é semáforo? Quando usar vs mutex?',
    a: '<strong>Semáforo</strong>: contador de N recursos. wait() decrementa (bloqueia se 0). signal() incrementa (acorda thread bloqueada). <strong>Mutex</strong>: caso especial binário (0 ou 1) com propriedade de ownership — só quem travou pode destravar. <strong>Semáforo quando</strong>: limitar conexões simultâneas ao banco (max 10), buffer circular producer/consumer, rate limiting entre threads. <strong>Mutex quando</strong>: acesso exclusivo a seção crítica, um de cada vez.',
    tip: 'Mutex tem ownership — importante para depuração de deadlock. Semáforo não tem dono — qualquer thread pode signal(). Mencione que mutex pode ser usado para implementar semáforo binário.',
  },
  {
    level: 'Senior',
    q: 'Por que fork() em processo multi-thread é perigoso?',
    a: 'fork() cria filho como cópia do pai. Em processo multi-thread, apenas a thread que chamou fork() sobrevive no filho — mas os locks que outras threads seguravam <strong>permanecem travados</strong>. Cenário: Thread B está em malloc() com lock interno do heap; Thread A faz fork(). No filho: apenas Thread A existe, lock do heap travado, Thread B não existe para liberar → qualquer malloc() no filho = deadlock. <strong>Soluções</strong>: fork antes de criar threads; usar pthread_atfork(); no filho, chamar apenas async-signal-safe functions (execve).',
    tip: 'Bug de produção clássico em servidores que fazem fork() para processar requisições. Fork antes de criar threads é a solução correta (padrão Apache prefork).',
  },
  {
    level: 'Senior',
    q: 'Como funciona fork() internamente com Copy-On-Write?',
    a: 'fork() cria processo filho via <strong>COW (Copy-On-Write)</strong>: copia page table do pai (apontando para as mesmas páginas físicas), marca todas as páginas como read-only em ambos. Quando qualquer processo escreve numa página: kernel cria cópia física, atualiza page table do processo que escreveu. Retorno: pai recebe PID do filho; filho recebe 0. COW torna fork() rápido mesmo para processos grandes — cópias físicas só ocorrem quando necessário.',
    tip: 'COW é o detalhe técnico que demonstra entendimento real. Mencione que fork()+exec() é o padrão UNIX para criar novos programas — fork cria, exec substitui a imagem.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre paralelismo e concorrência?',
    a: '<strong>Concorrência</strong>: lidar com múltiplas tarefas que se sobrepõem no tempo. Não necessariamente simultâneas — pode ser um único core alternando (interleaving). <strong>Paralelismo</strong>: execução genuinamente simultânea em múltiplos cores. Analogia: um garçom atendendo várias mesas = concorrente não paralelo. Vários garçons = paralelo. Node.js: concorrente mas não paralelo (single-thread JS). Go: concorrente e paralelo (goroutines em múltiplos OS threads). Python threads: concorrentes mas não paralelas em CPU (GIL).',
    tip: 'A distinção Go/Node ilustra perfeitamente. Node pode ser paralelo com cluster ou worker_threads — detalhar isso demonstra conhecimento aprofundado.',
  },
  {
    level: 'Pleno',
    q: 'Como diagnosticar e resolver um deadlock em produção?',
    a: '<strong>Diagnóstico</strong>: JVM: <code>jstack &lt;pid&gt;</code> — thread dump com estado BLOCKED; Python: <code>py-spy dump</code>; Node.js: inspector (<code>--inspect</code>); Go: o runtime detecta automaticamente e lança erro. <strong>Resolução</strong>: analisar o wait-for graph — identificar o ciclo; quebrar o ciclo: liberar um lock, mudar a ordem de aquisição; adicionar timeout para evitar reincidência; refatorar para não precisar de múltiplos locks simultâneos.',
    tip: 'Mencionar wait-for graph mostra embasamento teórico. jstack para JVM é o mais comum em entrevistas. Go auto-detecta deadlock — isso é um diferencial da linguagem.',
  },
  {
    level: 'Senior',
    q: 'Como dimensionar um thread pool?',
    a: '<strong>CPU-bound</strong>: threads ≈ número de cores (N ou N+1). Mais threads = context switch overhead, sem ganho. <strong>I/O-bound</strong>: threads >> cores — ficam bloqueadas em I/O e liberam CPU. Fórmula: Little\'s Law N = L / (λ × W) onde L é throughput, W é latência de I/O. Empiricamente: Ncores × 2 ajustando com profiling. <strong>Fatores adicionais</strong>: footprint de stack (1-8MB por thread); pools separados para CPU vs I/O.',
    tip: 'Little\'s Law é o insight de sênior — demonstra raciocínio quantitativo. Pools separados por tipo de workload é prática de produção.',
  },
  {
    level: 'Pleno',
    q: 'O que é thread starvation e como prevenir?',
    a: '<strong>Starvation</strong>: uma thread nunca consegue acesso ao recurso porque outras são sempre priorizadas. <strong>Causas</strong>: mutex injusto (order aleatória, mesmas threads dominam), prioridade muito baixa, connection pool saturado. <strong>Prevenção</strong>: mutex com política FIFO (fair mutex — ordem de chegada); aging (aumenta prioridade com tempo de espera); timeouts em aquisição de locks; dimensionamento correto de pools.',
    tip: 'Ligue starvation a problemas reais: serviço de alta prioridade domina CPU, requisições de baixa prioridade nunca completam. Fair locks e aging são as soluções padrão.',
  },
  {
    level: 'Pleno',
    q: 'Como Node.js cluster module funciona e quando usar?',
    a: '<code>cluster</code> usa fork() para criar múltiplos processos Node.js, cada um escutando na mesma porta. O master faz balanceamento de carga. <strong>Quando usar</strong>: servidor HTTP com tráfego alto para aproveitar múltiplos cores; workload I/O-bound; preferência por crash isolation. <strong>Estado</strong>: não compartilhado entre workers — use Redis ou outro store externo. <strong>Alternativa</strong>: PM2 com cluster mode. Padrão de produção: reiniciar worker morto automaticamente (<code>cluster.on("exit", () => cluster.fork())</code>).',
    tip: 'O restart automático de workers mortos é prática de produção. Estado não compartilhado entre processos é o gotcha mais importante — Redis como solução é a resposta esperada.',
  },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Processo: "Processo tem P.R.A.I.A. própria; Thread compartilha a praia"',
    trick: 'P.R.A.I.A. — Privado, Robusto, Alto custo, IPC necessário, Área própria',
    expansion: [
      ['P', 'Privado — memória própria (code, data, heap, stack isolados)'],
      ['R', 'Robusto — crash isolation: processo A não mata B'],
      ['A', 'Alto custo — fork() é mais caro que criar thread'],
      ['I', 'IPC necessário — pipe, socket, shared memory para comunicar'],
      ['A', 'Área própria — cada processo tem seu espaço de endereçamento'],
    ],
    explanation: 'Thread compartilha a praia (heap) com outras threads do mesmo processo — mais rápida mas com risco de colisão (race condition). Por isso precisa de sync.',
    example: 'Python com CPU: processos separados (cada um tem sua praia). Go com goroutines: compartilham a praia mas via channels disciplinados.',
    why: 'A distinção processo vs thread é a pergunta mais frequente de concorrência em entrevistas. PRAIA condensa os 5 atributos de processo em um acrônimo.',
  },
  {
    label: 'Deadlock: "4 Condições de Coffman: MNHC"',
    trick: 'MNHC — Mutual exclusion, No preemption, Hold and wait, Circular wait',
    expansion: [
      ['M', 'Mutual exclusion — recurso não pode ser compartilhado simultaneamente'],
      ['N', 'No preemption — recurso só é liberado voluntariamente'],
      ['H', 'Hold and wait — thread segura recurso enquanto espera outro'],
      ['C', 'Circular wait — A espera B, B espera A (ou cadeia circular)'],
    ],
    explanation: 'Todas as 4 condições precisam se cumular para deadlock ocorrer. Eliminar qualquer uma previne deadlock. Lock ordering elimina C (Circular Wait) — a estratégia mais simples e eficaz.',
    example: 'A adquire mutex1, B adquire mutex2; A tenta mutex2 (bloqueia), B tenta mutex1 (bloqueia) = deadlock. Lock ordering (sempre mutex1→mutex2) quebra C.',
    why: 'Entrevistadores perguntam sobre deadlock em quase toda vaga sênior. Saber as 4 condições e que você pode prevenir quebrando qualquer uma é a resposta esperada.',
  },
  {
    label: 'GIL: "Python Grilhado em CPU, Livre em I/O"',
    trick: 'GIL = Grilhão para CPU, Liberdade para I/O',
    expansion: [
      ['Grilhado em CPU', 'Só uma thread executa bytecode Python por vez — não paraleliza CPU-bound'],
      ['Livre em I/O', 'Bibliotecas I/O liberam o GIL enquanto aguardam — outras threads executam'],
      ['Solução CPU', 'multiprocessing: cada processo tem seu próprio GIL independente'],
      ['Solução I/O', 'threads funcionam normalmente (asyncio ainda é melhor para muitas conexões)'],
    ],
    explanation: 'O GIL é um mutex global no CPython que protege o reference counting de objetos. Retirar exigiria locking fino por operação de objeto — overhead em código single-thread.',
    example: 'web scraping com threads: ok (I/O-bound). Processamento de imagem com threads: não paraleliza (CPU-bound) → use multiprocessing ou ProcessPoolExecutor.',
    why: 'GIL é a pergunta de Python/Python Backend mais cobrada em entrevistas sênior. Entender quando threads ajudam e quando não ajudam é diferencial.',
  },
  {
    label: 'Context switch: "SIR — Save, Invalidate cache, Restore"',
    trick: 'SIR — custo = Save + I (cache miss) + Restore',
    expansion: [
      ['Save', 'Salva registradores e PC da thread atual no PCB/TCB'],
      ['Invalidate', 'Caches L1/L2 ficam frias para a nova thread — cache miss = custo maior'],
      ['Restore', 'Carrega contexto da próxima thread do PCB/TCB'],
    ],
    explanation: 'O custo de cache miss (I) é frequentemente maior que Save+Restore. É por isso que event loop (Node, Nginx) e goroutines (Go) são mais eficientes que thread-per-connection — menos context switches.',
    example: 'Apache thread-per-connection com 10k conexões: 10k context switches por tick de scheduler. Nginx event loop com 10k conexões: 1 thread, sem context switch.',
    why: 'Mencionar cache miss como o custo dominante diferencia candidatos que entenderam o hardware dos que apenas memorizaram o conceito.',
  },
  {
    label: 'Node.js concorrência: "I-C-H: I/O async, CPU worker, HTTP cluster"',
    trick: 'I-C-H — I/O event loop, CPU worker_threads, HTTP scale cluster',
    expansion: [
      ['I — I/O async', 'Event loop + async/await: não bloquear, deixar libuv/kernel cuidar'],
      ['C — CPU worker_threads', 'Thread separada com SharedArrayBuffer: zero-copy, Atomics para sync'],
      ['H — HTTP cluster', 'fork() por core: processo isolado, aproveita múltiplos CPUs, estado em Redis'],
    ],
    explanation: 'Cada tipo de problema em Node.js tem uma solução específica. Misturá-los ou usar a errada gera gargalos — ex: usar cluster para CPU-bound não ajuda se cada processo ainda trava o event loop.',
    example: 'API REST: event loop. Resize de imagem: worker_threads. Servidor HTTP de alta demanda: cluster + event loop em cada worker.',
    why: 'A pergunta "como escalar Node.js" é frequente em entrevistas. I-C-H cobre as três dimensões de escala e demonstra entendimento prático.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'Mutex', sig: 'mutex.lock() / mutex.unlock()', desc: 'Exclusão mútua — 1 thread na seção crítica. Tem ownership (só quem travou pode destravar). Risco: deadlock se lock ordering inconsistente.' },
  { name: 'Semáforo', sig: 'sem.wait() / sem.signal()', desc: 'N slots simultâneos. wait() decrementa (bloqueia se 0). signal() incrementa. Sem ownership — qualquer thread pode signal(). Use para connection pool.' },
  { name: 'Condition Variable', sig: 'cv.wait(lock, pred) / cv.notify_one()', desc: 'Thread dorme esperando condição. Libera mutex atomicamente — sem janela de race. Evita busy-wait. Producer-consumer pattern.' },
  { name: 'Atomic / CAS', sig: 'Atomics.add(arr, idx, val)', desc: 'Operação hardware atômica: LOAD+ADD+STORE como instrução única. Lock-free para contadores. JS: Atomics API com SharedArrayBuffer.' },
  { name: 'RWLock', sig: 'rwlock.readLock() / rwlock.writeLock()', desc: 'Múltiplos readers simultâneos OU um writer exclusivo. Leitura não bloqueia leitura. Use para dados lidos frequentemente e escritos raramente.' },
  { name: 'SharedArrayBuffer', sig: 'new SharedArrayBuffer(byteLength)', desc: 'Memória compartilhada zero-copy entre worker_threads. Sem Atomics = race condition. Atomics.wait() bloqueante — só em workers, não na main thread.' },
  { name: 'cluster.fork()', sig: 'cluster.fork() — 1 proc/core', desc: 'Processo filho com event loop isolado. Não compartilha memória — use Redis para estado. Restart automático em exit. Melhor para HTTP scale.' },
  { name: 'worker_threads', sig: 'new Worker(file, { workerData })', desc: 'Thread real com memória compartilhável (SAB). Para CPU-bound. postMessage copia; SharedArrayBuffer não. workerData é cópia (estruturado-clone).' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'Variável compartilhada entre threads sem lock — race condition silenciosa' },
  { ok: false, t: 'Lock ordering inconsistente (A→B e B→A) — deadlock clássico' },
  { ok: false, t: 'Esquecer unlock em path de erro — deadlock' },
  { ok: false, t: 'Thread pool sem limite — esgota memória' },
  { ok: false, t: 'Atomics.wait() na main thread Node.js — trava o event loop' },
  { ok: false, t: 'fork() com threads ativas — child em estado inconsistente (heap lock preso)' },
  { ok: true, t: 'Lock ordering: toda thread adquire locks na mesma ordem global fixa' },
  { ok: true, t: 'Timeout em aquisição de lock + retry com backoff — previne deadlock permanente' },
  { ok: true, t: 'Pool separado por tipo: CPU-bound (N cores) vs I/O-bound (N×2-4 threads)' },
  { ok: true, t: 'cluster + Redis para estado compartilhado em servidor HTTP multi-core' },
]

// ── Dados: Mind Map ───────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Processo',
    color: C,
    items: [
      { t: 'Memória isolada (code + data + heap + stack)', k: true },
      { t: 'fork() com COW (Copy-On-Write)', k: true },
      { t: 'IPC: pipe / socket / shared memory', k: true },
      { t: 'Crash isolation — não afeta outros', k: true },
      { t: 'cluster: 1 proc/core para HTTP scale', a: true },
    ],
  },
  {
    label: 'Thread',
    color: PRP,
    items: [
      { t: 'Compartilha heap do processo', k: true },
      { t: 'Stack própria (~1-8MB)', k: true },
      { t: 'Context switch: ~1-10µs', k: true },
      { t: 'CPU-bound: N cores. I/O-bound: N×2-4', a: true },
      { t: 'False sharing: padding de 64 bytes', a: true },
    ],
  },
  {
    label: 'Sincronização',
    color: GRN,
    items: [
      { t: 'Mutex: acesso exclusivo (1 thread)', k: true },
      { t: 'Semáforo: N slots simultâneos', k: true },
      { t: 'Condition variable: dormir até condição', k: true },
      { t: 'Atomic/CAS: lock-free para contadores', k: true },
      { t: 'RWLock: N readers OU 1 writer', a: true },
    ],
  },
  {
    label: 'Problemas',
    color: RED,
    items: [
      { t: 'Race condition: LOAD+ADD+STORE não-atômico', k: true },
      { t: 'Deadlock: 4 cond. Coffman — lock ordering previne', k: true },
      { t: 'Starvation: fair mutex + aging', k: true },
      { t: 'False sharing: mesma cache line, vars diferentes', a: true },
    ],
  },
  {
    label: 'GIL',
    color: AMB,
    items: [
      { t: 'Python/Ruby MRI: 1 thread/vez em bytecode', k: true },
      { t: 'CPU-bound → multiprocessing', k: true },
      { t: 'I/O-bound → threads ok (liberam GIL)', k: true },
      { t: 'PEP 703: GIL opcional em Python 3.13', a: true },
    ],
  },
  {
    label: 'Node.js',
    color: SKY,
    items: [
      { t: 'Event loop: I/O async, não bloquear', k: true },
      { t: 'worker_threads: CPU-bound + SharedArrayBuffer', k: true },
      { t: 'cluster: HTTP scale — 1 proc/core', k: true },
      { t: 'Atomics: sync sem mutex em SAB', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Consigo explicar a diferença de memória entre processo e thread?',
  'Sei quais são as 4 condições de Coffman e como quebrá-las?',
  'Entendo por que counter++ não é thread-safe (3 instruções de máquina)?',
  'Sei quando usar cluster vs worker_threads em Node.js?',
  'Consigo explicar por que Python threads não paralelizam CPU?',
  'Entendo o custo real de context switch (cache miss)?',
  'Sei implementar lock ordering para prevenir deadlock?',
  'Consigo explicar false sharing e como mitigar com padding?',
  'Sei a diferença entre mutex e semáforo?',
  'Entendo como SharedArrayBuffer + Atomics funciona no Node.js?',
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Processos & Threads',
    stackLabel: 'CS · Concorrência',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Processos & Threads',
    stackLabel: 'CS · Concorrência',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Processos & Threads',
    accentColor: C,
    stackLabel: 'CS · Concorrência',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['Mutex', 'Exclusão mútua — 1 thread na seção crítica'],
        ['Semáforo', 'N slots simultâneos — wait/signal'],
        ['Condition Variable', 'Dorme esperando condição — libera mutex atomicamente'],
        ['CAS/Atomic', 'Compare-And-Swap — lock-free para contadores'],
        ['SharedArrayBuffer + Atomics', 'Memória zero-copy entre worker_threads — sync atômica'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'Lock ordering: toda thread adquire locks na mesma ordem global — elimina deadlock',
        'Thread pool CPU-bound = N cores; I/O-bound = N×2-4 (threads dormem aguardando I/O)',
        'False sharing: variáveis de threads diferentes com padding de 64 bytes (cache line)',
        'Prefer event loop para I/O; worker_threads apenas para CPU pesado em Node.js',
        'cluster + Redis para estado: processos isolados com store externo compartilhado',
        'Atomics.wait() bloqueante — nunca usar na main thread do Node.js',
      ],
      patterns: [
        {
          name: 'Worker pool com drain()',
          code: `class WorkerPool {
  private available: Worker[] = []
  private queue: Task[] = []

  run(input): Promise<number> {
    return new Promise(resolve => {
      this.queue.push({ input, resolve })
      this.drain()
    })
  }
  private drain() {
    while (this.queue.length && this.available.length) {
      const task = this.queue.shift()!
      const worker = this.available.shift()!
      worker.postMessage(task.input)
    }
  }
}`,
          desc: 'Pool que distribui tarefas para workers ociosos — drain() sempre que worker fica livre',
        },
        {
          name: 'Cluster com restart automático',
          code: `if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++)
    cluster.fork()
  cluster.on('exit', (w) => {
    console.log(\`Worker \${w.pid} morreu. Reiniciando.\`)
    cluster.fork()
  })
} else {
  app.listen(3000)
}`,
          desc: 'Aproveita todos os cores + reinicia workers mortos automaticamente',
        },
        {
          name: 'Lock ordering para deadlock prevention',
          code: `// SEMPRE acquire na mesma ordem global
// Thread A e Thread B ambas fazem:
const unlock1 = await mutex1.acquire()
const unlock2 = await mutex2.acquire()
// ... trabalho ...
unlock2()  // release na ordem inversa
unlock1()
// Nunca: A faz mutex1→mutex2, B faz mutex2→mutex1`,
          desc: 'Elimina Circular Wait — a condição mais fácil de quebrar entre as 4 de Coffman',
        },
      ],
      mentalModels: [
        'PRAIA: Processo = Privado, Robusto, Alto custo, IPC necessário, Área própria',
        '4 condições de Coffman (MNHC): Mutual exclusion, No preemption, Hold&Wait, Circular wait',
        'GIL = Grilhão para CPU, Liberdade para I/O (Python/Ruby)',
        'SIR: context switch = Save + Invalidate cache + Restore',
        'I-C-H Node.js: I/O → event loop, CPU → worker_threads, HTTP → cluster',
      ],
    },
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Processos & Threads',
    stackLabel: 'CS · Concorrência',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de ir a uma entrevista sênior de backend.',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function ProcessosThreadsPdfs() {
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
