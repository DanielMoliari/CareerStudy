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
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildRecipeBookPdf } from '@/components/pdfs/RecipeBookPdf'
import type { Recipe } from '@/components/pdfs/RecipeBookPdf'
import { buildCommandRefPdf } from '@/components/pdfs/CommandRefPdf'
import type { CommandEntry } from '@/components/pdfs/CommandRefPdf'

// ── Paleta Node.js ───────────────────────────────────────────────────────────
const C = '#68A063'  // Node.js green — NUNCA omitir, default seria cyan React

// ── Metadados dos PDFs ───────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre Node.js em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: event loop em profundidade, libuv e thread pool, streams e backpressure, cluster vs worker_threads, memory leaks, módulos CJS/ESM, async patterns, graceful shutdown, performance tuning e muito mais — com resposta estruturada para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'APIs de streams, events, cluster e process numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: EventEmitter API, Streams API (Readable/Writable/Transform), Cluster API, Worker Threads, process APIs (env, exit, signals), módulos built-in essenciais e regras críticas de performance.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 6 truques que grudam Node.js na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'Ordem do event loop, diferença nextTick vs setImmediate, quando usar worker_threads vs cluster, regra do backpressure, CJS vs ESM e o mnemônico de graceful shutdown. Âncoras cognitivas para os pontos mais cobrados.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 8 erros mais comuns com Node.js',
    type: 'antipatterns',
    pages: 3,
    description: 'Sync em loop de requisição, callback hell, Promises sem catch, memory leak por EventEmitter, bloquear o event loop com JSON.parse gigante, não liberar recursos de stream, nextTick recursivo e require() de ESM em CJS.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Node.js do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental completo com 8 categorias (Event Loop, libuv, Streams, Módulos, Cluster/Workers, HTTP, Performance, Ecosystem) e checklist de 10 perguntas para auto-avaliar o domínio.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
  {
    id: 'recipes',
    title: 'Recipe Book',
    subtitle: '8 receitas práticas para o dia a dia com Node.js',
    type: 'recipes',
    pages: 6,
    description: 'Receitas prontas: HTTP server com graceful shutdown, stream pipeline com tratamento de erro, worker_thread para CPU-bound, cluster com respawn automático, EventEmitter tipado, timeout em Promise, abort controller e healthcheck endpoint. Cada receita com passos e armadilhas.',
    icon: '06',
    goal: 'Implementação rápida',
  },
  {
    id: 'node-cli',
    title: 'Node CLI Ref',
    subtitle: 'Flags, process APIs e módulos built-in essenciais',
    type: 'commands',
    pages: 4,
    description: 'Referência do CLI node: flags de debug (--inspect, --prof, --heap-prof), variáveis de processo (process.env, process.argv, process.exit), módulos essenciais (path, os, crypto, url, perf_hooks) e comandos npm/npx mais usados.',
    icon: '07',
    goal: 'Consulta de comandos',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Explique as 6 fases do event loop e a ordem de prioridade das filas.',
    a: 'O event loop tem 6 fases sequenciais: timers (setTimeout/setInterval), pending I/O (callbacks de I/O do ciclo anterior), idle/prepare (interno), poll (nova entrada I/O — aguarda aqui se fila vazia), check (setImmediate) e close callbacks. Entre CADA fase, o Node drena completamente: primeiro process.nextTick, depois microtasks de Promise (.then, async/await). Prioridade: nextTick > Promise microtasks > setImmediate > setTimeout(0) > I/O callbacks.',
    bullets: [
      'nextTick recursivo strava o loop — drena completamente antes de avançar à próxima fase.',
      'setTimeout(0) vs setImmediate: fora de I/O a ordem é não-determinística; dentro de I/O, setImmediate sempre vem primeiro.',
      'Fase poll é onde Node "dorme" aguardando eventos quando não há trabalho.',
    ],
    tip: 'Desenhe as 6 fases em círculo com setas. Mostre as filas de microtask entre as fases. O entrevistador que conhece o tema vai reconhecer imediatamente a precisão.',
  },
  {
    level: 'Senior',
    q: 'O que é libuv e qual o papel do thread pool?',
    a: 'libuv é a biblioteca C que implementa o event loop do Node e abstrai I/O assíncrono cross-platform. O thread pool (default: 4 threads, UV_THREADPOOL_SIZE) executa operações que não têm AIO nativo no OS: fs.readFile, crypto (scrypt, pbkdf2, randomBytes), dns.lookup e algumas operações de compressão. Operações de rede (TCP, UDP) usam epoll/kqueue/IOCP diretamente — sem thread pool.',
    bullets: [
      'UV_THREADPOOL_SIZE pode ser aumentado até 1024 — útil se muitas operações fs/crypto concorrentes.',
      'Cuidado: mais threads = mais memória + overhead de context switch.',
      'dns.resolve* usa o resolver async do OS (não thread pool) — mas dns.lookup usa thread pool.',
    ],
    tip: 'A distinção "rede usa kernel AIO, fs/crypto usa thread pool" é o que separa quem realmente conhece libuv. Mencione UV_THREADPOOL_SIZE como sinal de maturidade.',
  },
  {
    level: 'Senior',
    q: 'O que é backpressure em streams e como evitá-la?',
    a: 'Backpressure ocorre quando o produtor (Readable) emite dados mais rápido do que o consumidor (Writable) processa. O Writable buffer enche, write() retorna false. Se ignorado, o buffer de memória cresce sem limite. A solução correta é pausar o Readable quando write() retorna false e retomar no evento "drain".',
    bullets: [
      'stream.pipeline() gerencia backpressure automaticamente — use sempre em vez de .pipe() manual.',
      '.pipe() não propaga erros — um erro no meio da cadeia deixa streams abertas (memory leak).',
      'highWaterMark controla o tamanho do buffer interno — padrão 16KB para object mode, 64KB para bytes.',
    ],
    tip: 'Descreva o cenário concreto: download de 10GB → processamento → upload. Sem backpressure, toda a RAM seria consumida. pipeline() resolve isso com 2 linhas.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre cluster e worker_threads?',
    a: 'cluster cria N processos filho com fork() — cada processo tem seu próprio event loop, memória e heap V8. Ideal para escalar HTTP servers em múltiplos cores. worker_threads cria threads dentro do mesmo processo — compartilham memória via SharedArrayBuffer, têm overhead menor. Ideal para CPU-bound em background (hashing, parsing, compressão) sem criar processo completo.',
    bullets: [
      'cluster: isolamento total de falha — worker crash não afeta outros. Cada worker pode escutar na mesma porta.',
      'worker_threads: SharedArrayBuffer + Atomics para comunicação de alta performance.',
      'child_process.spawn(): para comandos de sistema externos — mais isolado que worker_threads.',
    ],
    tip: 'Critério de decisão simples: CPU-bound que precisa de memória compartilhada → worker_threads. Escalar HTTP server → cluster. Executar binário externo → child_process.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o graceful shutdown em Node.js?',
    a: 'Graceful shutdown escuta SIGTERM/SIGINT, para de aceitar novas conexões, aguarda conexões ativas finalizarem e fecha recursos (DB, fila). Essencial em Kubernetes onde o pod recebe SIGTERM antes de ser removido.',
    bullets: [
      'server.close() para de aceitar conexões mas aguarda as existentes.',
      'Timeout forçado (5-30s) caso conexões não fechem — process.exit(0) no timeout.',
      'Fechar pool de banco, conexões Redis/RabbitMQ antes de process.exit.',
    ],
    tip: 'Mencione o contexto Kubernetes: SIGTERM → terminationGracePeriodSeconds → SIGKILL. O graceful shutdown deve terminar antes do timeout do k8s (default 30s).',
  },
  {
    level: 'Senior',
    q: 'Como diagnosticar e evitar memory leaks no Node.js?',
    a: 'Fontes mais comuns: listeners não removidos em EventEmitter, closures que capturam referências grandes, caches sem limite (Map/Set crescendo indefinidamente), timers não cancelados. Diagnóstico: node --heap-prof ou --heapsnapshot-signal, Chrome DevTools heap snapshot, clinic.js heap.',
    bullets: [
      'emitter.setMaxListeners(0) desabilita o warning — não resolve o leak.',
      'Use WeakMap/WeakRef para caches que não devem impedir GC.',
      'node --inspect + takeHeapSnapshot no Chrome DevTools identifica objetos retidos.',
    ],
    tip: 'Mostre o fluxo de diagnóstico: node --heapsnapshot-signal=SIGUSR2, kill -USR2 <pid>, snapshot no DevTools, comparar objetos retidos. Isso demonstra habilidade prática real.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre CommonJS (require) e ES Modules (import)?',
    a: 'CJS: síncrono, dinâmico (require em if/try), não faz tree shaking, usa module.exports. ESM: estático (analisado em parse-time, permite tree shaking), top-level await, strict mode sempre ativo, sem __dirname/__filename (use import.meta.url). CJS pode importar ESM via import() dinâmico (Promise). ESM não pode require() CJS.',
    bullets: [
      '"type":"module" no package.json torna .js = ESM no pacote inteiro.',
      'TypeScript com "module":"NodeNext" requer extensão explícita nos imports (.js em .ts!).',
      'Pacotes duais: exports com "require" e "import" condicional.',
    ],
    tip: 'A pegadinha mais comum: ESM requer extensão explícita no import mesmo em TypeScript (.js, não .ts). Candidatos que sabem disso demonstram experiência prática com ESM moderno.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o V8 e qual o impacto no código Node.js?',
    a: 'V8 usa JIT em duas fases: Ignition (interpretador baseline rápido) e TurboFan (compilador otimizador). TurboFan cria código nativo otimizado para funções "hot" com tipos estáveis. Se o tipo mudar (deoptimization), TurboFan descarta e recompila — "megamorphic dispatch".',
    bullets: [
      'Funções com tipos consistentes são mais rápidas — evite polimorfismo de tipo em hot paths.',
      'V8 GC: geracional — objetos novos em "new space" (coletados frequentemente), longevos vão para "old space".',
      '--prof e --prof-process geram flamegraph do V8 para identificar funções quentes.',
    ],
    tip: 'Mencione hidden classes: V8 cria classes implícitas para objetos com a mesma estrutura. Adicionar propriedades fora do construtor invalida a hidden class — impacto de 2-10x em loops.',
  },
  {
    level: 'Pleno',
    q: 'Como implementar um HTTP server com timeout e rate limiting básico?',
    a: 'Use http.createServer() com server.headersTimeout e server.requestTimeout para proteger de slowloris e requests lentos. Rate limiting via Map de IPs com contador e TTL, ou middleware express-rate-limit em APIs Express/Fastify.',
    bullets: [
      'server.keepAliveTimeout > nginx/ALB timeout — evita 502 por fechar conexão antes do proxy.',
      'server.headersTimeout protege contra slowloris (envio de headers infinitamente devagar).',
      'Para produção: use nginx ou AWS ALB para rate limiting — Node em processo único tem memória limitada.',
    ],
    tip: 'Mencione keepAliveTimeout maior que o timeout do load balancer — é um bug sutil que causa 502 aleatórios em produção e surpreende candidatos que nunca depuraram isso.',
  },
  {
    level: 'Senior',
    q: 'O que são async_hooks e AsyncLocalStorage?',
    a: 'async_hooks é uma API experimental/estável que rastreia o ciclo de vida de recursos assíncronos (Promises, timers, callbacks). AsyncLocalStorage constrói sobre async_hooks para propagar contexto por toda a cadeia assíncrona sem passar props — ideal para request ID, tracing, user context.',
    bullets: [
      'AsyncLocalStorage.run(store, fn) — qualquer código dentro de fn (e suas promises) acessa store via getStore().',
      'Caso de uso: request ID automático em logs sem passar o ID pela cadeia de chamadas.',
      'Performance: async_hooks tem overhead real (~10-20%) — use apenas onde necessário.',
    ],
    tip: 'AsyncLocalStorage é o "React Context do backend" — contexto implícito por toda a chain async. Mencionar isso em entrevista demonstra conhecimento avançado de Node internals.',
  },
  {
    level: 'Senior',
    q: 'Como Node.js lida com operações de I/O de rede vs arquivo?',
    a: 'I/O de rede (TCP, UDP) usa as primitivas de I/O não-bloqueante do OS diretamente: epoll (Linux), kqueue (macOS), IOCP (Windows). Node registra file descriptors e recebe callbacks quando há dados — zero threads de I/O. I/O de arquivo usa o thread pool da libuv (4 threads default) porque nem todos os sistemas suportam AIO nativo para arquivos.',
    bullets: [
      'fs.open + read com O_DIRECT é AIO real no Linux, mas libuv usa thread pool por portabilidade.',
      'fs.promises.open + streaming evita carregar arquivo inteiro em memória.',
      'Muitas operações fs concorrentes podem saturar o thread pool — aumente UV_THREADPOOL_SIZE.',
    ],
    tip: 'Distinção chave: rede = epoll/kqueue sem threads, arquivo = thread pool. Isso explica por que Node é excelente para rede e pode ter gargalos em fs intensivo.',
  },
  {
    level: 'Pleno',
    q: 'Como estruturar uma aplicação Node.js para escalar horizontalmente?',
    a: 'Aplique 12-factor app: sem estado em memória (use Redis/DB), configuração via env vars, logs para stdout, port binding via env. Para escala: cluster (multi-core) ou múltiplas instâncias com load balancer. Sessões em Redis (connect-redis), caches compartilhados.',
    bullets: [
      'Sem estado em memória: qualquer instância pode servir qualquer requisição.',
      'cluster.setupPrimary + worker respawn automático em crash.',
      'PM2 em produção: pm2 start app.js -i max (auto-detect CPU count).',
    ],
    tip: 'A resposta de sênior vai além de cluster: mencione 12-factor, sessões compartilhadas, e que em Kubernetes o cluster nativo do Node é desnecessário (k8s já escala pods).',
  },
  {
    level: 'Pleno',
    q: 'Como implementar Pub/Sub com EventEmitter?',
    a: 'EventEmitter.on(event, listener) registra listener. emit(event, ...args) dispara todos os listeners. removeListener()/off() remove listener específico. once() registra listener que auto-remove após primeiro disparo. Extenda EventEmitter para criar bus de eventos tipado.',
    bullets: [
      'setMaxListeners(n) controla o aviso de possível memory leak (default: 10).',
      'emit("error", err) sem listener de "error" lança uncaughtException — sempre registre listener de erro.',
      'Para pub/sub cross-process/instância, use Redis pub/sub ou BullMQ.',
    ],
    tip: 'Mencione a regra crítica: todo EventEmitter deve ter listener de "error". Sem ele, um emit("error") mata o processo. É o bug mais silencioso do Node.',
  },
  {
    level: 'Senior',
    q: 'O que é cluster stickiness e quando é necessário?',
    a: 'Por padrão, o master do cluster distribui conexões em round-robin entre workers. Stickiness (sticky sessions) faz com que o mesmo cliente sempre chegue ao mesmo worker — necessário quando estado da sessão está em memória local (WebSocket stateful, Socket.io sem Redis adapter).',
    bullets: [
      'cluster-key-grp ou nginx ip_hash para sticky sessions.',
      'Solução ideal: externalizar estado (Redis) e eliminar a necessidade de stickiness.',
      'Socket.io: use @socket.io/redis-adapter para escalar sem sticky sessions.',
    ],
    tip: 'Posicione a resposta: "sticky sessions são um workaround — o design ideal externaliza o estado para Redis e elimina a dependência de stickiness".',
  },
  {
    level: 'Pleno',
    q: 'Como usar AbortController para cancelar operações assíncronas?',
    a: 'AbortController cria um AbortSignal que pode ser passado para fetch, fs.promises.readFile, setTimeout(fn, delay, options), stream.pipeline e APIs customizadas. Ao chamar controller.abort(), o signal dispara "abort" event e operações pendentes lançam AbortError.',
    bullets: [
      'Nativo desde Node.js 15 — sem depender de bibliotecas de cancelamento.',
      'Useful para request timeout: AbortSignal.timeout(ms) cria signal que aborta automaticamente.',
      'Promise.race com AbortSignal não é suficiente — a operação subjacente ainda roda.',
    ],
    tip: 'AbortSignal.timeout(5000) é mais limpo que Promise.race com setTimeout. Mencione que Node 17.3+ tem suporte nativo em fetch — demonstra conhecimento das releases recentes.',
  },
  {
    level: 'Senior',
    q: 'Como configurar Node.js para produção (flags e variáveis de ambiente)?',
    a: 'NODE_ENV=production ativa otimizações em Express/NestJS (cache de views, stack traces comprimidas). --max-old-space-size=<MB> ajusta o heap V8 (default ~1.5GB em 64-bit). --enable-source-maps para stack traces legíveis de TypeScript compilado. --max-http-header-size para APIs com headers grandes.',
    bullets: [
      'UV_THREADPOOL_SIZE: aumentar para fs/crypto intensivo (default 4, max 1024).',
      'NODE_OPTIONS env var: aplica flags sem mudar o script de entrada.',
      '--prof + --prof-process para profiling em produção sem reiniciar.',
    ],
    tip: 'Candidatos sênior mencionam --max-old-space-size e UV_THREADPOOL_SIZE como primeiro passo de tuning. São as alavancas mais impactantes sem mudar código.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre process.nextTick e queueMicrotask?',
    a: 'process.nextTick é específico do Node.js — sua fila é drenada completamente antes de microtasks de Promise. queueMicrotask usa a fila de microtasks padrão da spec JavaScript (WHATWG) — mesma fila de Promise.then. Em termos práticos: nextTick tem prioridade ligeiramente maior que queueMicrotask.',
    bullets: [
      'queueMicrotask é mais portável (funciona em browser também) e compatível com a spec.',
      'process.nextTick recursivo pode starvar microtasks de Promise.',
      'Em Node.js moderno (v11+): prefira queueMicrotask para código portável; nextTick para APIs internas do Node.',
    ],
    tip: 'A diferença é sutil mas real: nextTick strava Promises se chamado recursivamente. É uma pergunta de nível sênior que separa quem conhece o event loop de verdade.',
  },
  {
    level: 'Senior',
    q: 'Como implementar um circuit breaker em Node.js?',
    a: 'Circuit breaker tem 3 estados: Closed (operação normal), Open (falhou N vezes — rejeita imediatamente), Half-Open (permite 1 tentativa após timeout). Implementação: contador de falhas com reset em sucesso, timer para transição Open→Half-Open, wrapper de funções assíncronas.',
    bullets: [
      'Bibliotecas: opossum (Node.js nativa), cockatiel (TypeScript-first).',
      'Métricas essenciais: failureThreshold, resetTimeout, halfOpenSuccessThreshold.',
      'Combine com retry + jitter para não sobrecarregar o serviço downstream ao reabrir.',
    ],
    tip: 'Descreva o estado Half-Open — é onde candidatos erram. Open → aguarda resetTimeout → Half-Open (1 tentativa) → sucesso volta para Closed, falha volta para Open.',
  },
  {
    level: 'Pleno',
    q: 'Como testar código Node.js com I/O (fs, http, banco)?',
    a: 'Três estratégias: mock manual (jest.mock, vi.mock para módulos de I/O), injeção de dependência (passar fs/db como argumento — testável sem mock global), testes de integração com banco real em container (testcontainers, banco SQLite em memória).',
    bullets: [
      'jest.mock("fs/promises") + jest.fn() para testar lógica sem tocar no disco.',
      'Dependency injection é preferível ao mock global — mais explícito e refactorable.',
      'nock ou msw para mockar chamadas HTTP externas.',
    ],
    tip: 'Argumente por DI como abordagem padrão: funções que recebem fs/db como parâmetro são mais testáveis E mais compostavéis do que funções que importam diretamente.',
  },
  {
    level: 'Senior',
    q: 'O que são Diagnostic Channels e como usar para observabilidade?',
    a: 'diagnostics_channel (Node.js 15.1+) é um pub/sub de baixo overhead para instrumentação de bibliotecas. http, undici, postgresql e outros publicam eventos de diagnóstico sem código adicional. Use para tracing, logging de queries e métricas sem monkey-patching.',
    bullets: [
      'channel.subscribe("http.client.request.start", handler) — zero overhead quando sem subscriber.',
      'Usado internamente por OpenTelemetry Node.js SDK para auto-instrumentação.',
      'Diferente de async_hooks — mais leve e semântico.',
    ],
    tip: 'diagnostics_channel é pouco conhecido mas é como o SDK do OpenTelemetry funciona internamente. Mencioná-lo demonstra profundidade em observabilidade Node.js.',
  },
  {
    level: 'Senior',
    q: 'Como Node.js lida com sinais de sistema operacional (SIGTERM, SIGINT, SIGHUP)?',
    a: 'process.on("SIGTERM", handler) registra handler para signal de terminação (Kubernetes, Docker stop). SIGINT = Ctrl+C. SIGHUP = terminal fechado / reload de config. No Windows, sinais POSIX têm suporte limitado — apenas SIGINT e alguns simulados.',
    bullets: [
      'SIGTERM é o sinal de graceful shutdown — ouça e inicie shutdown sequence.',
      'SIGHUP em processos daemon: recarregar configuração sem restart.',
      'Sinais são síncronos no Node — handler bloqueia o event loop se demorar.',
    ],
    tip: 'Mencione que em Kubernetes, SIGTERM é enviado 30s antes de SIGKILL — o handler deve completar o graceful shutdown nesse intervalo. Timeout forçado com process.exit(0) é essencial.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'EventEmitter.on()', sig: 'emitter.on(event, listener)', desc: 'Registra listener persistente. Retorna o emitter para chaining.' },
  { name: 'EventEmitter.once()', sig: 'emitter.once(event, listener)', desc: 'Listener que auto-remove após primeiro disparo.' },
  { name: 'EventEmitter.off()', sig: 'emitter.off(event, listener)', desc: 'Remove listener específico (alias de removeListener).' },
  { name: 'EventEmitter.emit()', sig: 'emitter.emit(event, ...args)', desc: 'Dispara evento. Retorna true se havia listeners.' },
  { name: 'stream.pipeline()', sig: 'await pipeline(readable, ...transforms, writable)', desc: 'Conecta streams com backpressure e cleanup de erros automáticos.' },
  { name: 'stream.Readable.from()', sig: 'Readable.from(iterable)', desc: 'Cria Readable de array, generator ou async generator.' },
  { name: 'worker.postMessage()', sig: 'worker.postMessage(data, [transferList])', desc: 'Envia mensagem ao worker. Transferíveis: ArrayBuffer, SharedArrayBuffer.' },
  { name: 'cluster.fork()', sig: 'cluster.fork([env])', desc: 'Cria worker process (master only). env sobrescreve process.env.' },
  { name: 'process.nextTick()', sig: 'process.nextTick(callback, ...args)', desc: 'Agenda callback com PRIORIDADE MÁXIMA — antes de qualquer Promise.' },
  { name: 'AbortSignal.timeout()', sig: 'AbortSignal.timeout(milliseconds)', desc: 'Cria signal que aborta após N ms. Nativo Node.js 17.3+.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'readFileSync em handler de request — bloqueia event loop' },
  { ok: false, t: 'Promises sem .catch() — UnhandledRejection termina processo (Node 15+)' },
  { ok: false, t: 'EventEmitter.on() em loop sem off() — memory leak' },
  { ok: false, t: '.pipe() em vez de pipeline() — não propaga erros' },
  { ok: false, t: 'synchronize: true em TypeORM em produção — DROP automático' },
  { ok: true, t: 'UV_THREADPOOL_SIZE=8 para fs/crypto intensivo (default: 4)' },
  { ok: true, t: 'stream.pipeline() com async/await para streaming seguro' },
  { ok: true, t: 'AsyncLocalStorage para request context sem prop drilling' },
  { ok: true, t: 'process.on("SIGTERM") → graceful shutdown antes do SIGKILL' },
  { ok: true, t: 'node --inspect para debug remoto sem reiniciar em produção' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Ordem do event loop: "Timers Pulam Inutilmente Por Check Closes"',
    trick: 'T-P-I-P-C-C',
    expansion: [
      ['T', 'Timers (setTimeout, setInterval)'],
      ['P', 'Pending I/O'],
      ['I', 'Idle/Prepare (interno)'],
      ['P', 'Poll (main I/O wait)'],
      ['C', 'Check (setImmediate)'],
      ['C', 'Close callbacks'],
    ],
    explanation: 'As 6 fases do event loop em ordem. Entre cada fase: nextTick e Promises drenam completamente.',
    example: 'setTimeout(→T), setImmediate(→C), fs.readFile callback(→P poll/check)',
    why: 'Saber a ordem resolve 80% das perguntas de event loop em entrevista — é o fundamento de tudo em Node.',
  },
  {
    label: 'Prioridade de fila: "Next Promise Set Set I/O"',
    trick: 'nextTick > Promise > setImmediate > setTimeout > I/O',
    expansion: [
      ['nextTick', 'Mais alta — drena tudo antes de qualquer coisa'],
      ['Promise.then', 'Segunda — microtask da spec JS'],
      ['setImmediate', 'Terceira — fase check do loop'],
      ['setTimeout(0)', 'Quarta — fase timers'],
      ['I/O callback', 'Após nova entrada na fase poll'],
    ],
    explanation: 'A hierarquia de quem roda primeiro quando há concorrência de callbacks.',
    example: 'Promise.resolve().then(A); process.nextTick(B) → B roda antes de A',
    why: 'Responder "qual a ordem de execução?" sem hesitar é o que separa sênior de pleno em entrevista Node.',
  },
  {
    label: 'Cluster vs Worker: "Cluster para HTTP, Worker para CPU"',
    trick: 'C-HTTP, W-CPU',
    expansion: [
      ['C = Cluster', 'HTTP server em múltiplos cores — porta compartilhada, processo isolado'],
      ['W = Worker', 'CPU-bound em thread — hashing, parsing, compressão — memória compartilhável'],
    ],
    explanation: 'Cluster escala o servidor web. Worker Threads escala computação pesada sem bloquear.',
    example: 'cluster.fork() × 8 para API REST; workerData para bcrypt.hash em background',
    why: 'Escolher a ferramenta errada (worker thread para HTTP) é o erro mais comum de candidatos.',
  },
  {
    label: 'Backpressure: "write() false? pause! drain? resume!"',
    trick: 'FALSE=PAUSE, DRAIN=RESUME',
    expansion: [
      ['write() → false', 'Buffer lotou — pause o Readable (rs.pause())'],
      ['"drain" event', 'Buffer esvaziou — resume o Readable (rs.resume())'],
      ['pipeline()', 'Faz isso automaticamente — use sempre'],
    ],
    explanation: 'Backpressure é o mecanismo de controle de fluxo das streams. Ignorar = OOM.',
    example: 'if (!ws.write(chunk)) rs.pause(); ws.on("drain", () => rs.resume())',
    why: 'Entender backpressure é o que diferencia quem faz streaming de verdade de quem apenas usa .pipe().',
  },
  {
    label: 'Módulos: "CJS Síncrono Dinâmico, ESM Estático Puro"',
    trick: 'CJS=SD, ESM=EP',
    expansion: [
      ['CJS Síncrono', 'require() bloqueia — mas é ok porque é cache após 1ª vez'],
      ['CJS Dinâmico', 'require() em if/try — condicional possível'],
      ['ESM Estático', 'Analisado em parse-time — tree shaking funciona'],
      ['ESM Puro', 'Strict mode sempre, top-level await, sem __dirname'],
    ],
    explanation: 'CJS e ESM têm trade-offs. ESM é o futuro — mas interoperabilidade ainda é complexa.',
    example: 'CJS→ESM: await import(). ESM→CJS: import lodash from "lodash" funciona.',
    why: 'ERR_REQUIRE_ESM é o erro mais frequente ao migrar projetos. Saber a regra evita horas de debug.',
  },
  {
    label: 'Graceful Shutdown: "STOP → DRAIN → CLOSE → EXIT"',
    trick: 'S-D-C-E',
    expansion: [
      ['STOP', 'server.close() — para de aceitar novas conexões'],
      ['DRAIN', 'Aguarda requisições ativas finalizarem (com timeout)'],
      ['CLOSE', 'Fecha DB pool, Redis, filas'],
      ['EXIT', 'process.exit(0) — limpo'],
    ],
    explanation: 'Sequência de graceful shutdown para Kubernetes e Docker.',
    example: 'process.on("SIGTERM", async () => { server.close(); await db.end(); process.exit(0) })',
    why: 'Em Kubernetes, SIGTERM precede SIGKILL por 30s. Sem graceful shutdown, requisições em voo são perdidas.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Operação síncrona em handler de requisição',
    badDesc: 'fs.readFileSync, bcrypt.hashSync, JSON.parse em estrutura enorme — bloqueiam o event loop para TODOS os clientes',
    badCode: [
      { t: 'app.get', c: '#ef4444' }, { t: "('/data', (req, res) => {\n" },
      { t: '  // BLOQUEIA event loop!\n', c: '#ef4444' },
      { t: '  const d = ', c: '#e2e8f0' }, { t: 'fs.readFileSync', c: '#ef4444' }, { t: "('cache.json')\n" },
      { t: '  res.json(JSON.parse(d))\n' },
      { t: '})', c: '#e2e8f0' },
    ],
    goodDesc: 'Use fs.promises ou streaming assíncrono — event loop permanece livre',
    goodCode: [
      { t: 'app.get', c: '#68A063' }, { t: "('/data', async (req, res) => {\n" },
      { t: '  const d = ', c: '#e2e8f0' }, { t: 'await', c: '#a78bfa' }, { t: " fs.promises.readFile", c: '#4ade80' }, { t: "('cache.json')\n" },
      { t: '  res.json(JSON.parse(d))\n' },
      { t: '})', c: '#e2e8f0' },
    ],
    why: 'Node é single-threaded. Uma chamada síncrona bloqueia TODAS as requisições — 1000 usuários esperam por 1.',
  },
  {
    title: 'Promises sem tratamento de erro',
    badDesc: 'Rejeição silenciosa — em Node 15+ termina o processo com UnhandledPromiseRejection',
    badCode: [
      { t: '// ❌ sem .catch()\n', c: '#ef4444' },
      { t: 'fetchUserData(id)', c: '#ef4444' }, { t: '.then(process)\n\n' },
      { t: '// ❌ async handler sem try/catch\n', c: '#ef4444' },
      { t: 'app.get', c: '#ef4444' }, { t: "('/x', async (req, res) => {\n" },
      { t: '  const r = await riskyOp() // crash\n', c: '#ef4444' },
      { t: '  res.json(r)\n})', c: '#e2e8f0' },
    ],
    goodDesc: 'Toda Promise precisa de catch ou try/catch; passe erros para next(err) no Express',
    goodCode: [
      { t: 'fetchUserData(id).then(process)\n', c: '#e2e8f0' },
      { t: '  .', c: '#e2e8f0' }, { t: 'catch', c: '#4ade80' }, { t: '(err => logger.error(err))\n\n' },
      { t: 'app.get', c: '#68A063' }, { t: "('/x', async (req, res, next) => {\n" },
      { t: '  try {\n', c: '#e2e8f0' },
      { t: '    const r = await riskyOp()\n', c: '#4ade80' },
      { t: '    res.json(r)\n', c: '#e2e8f0' },
      { t: '  } catch (e) { ', c: '#e2e8f0' }, { t: 'next(e)', c: '#4ade80' }, { t: ' }\n})', c: '#e2e8f0' },
    ],
    why: 'Node 15+ encerra o processo em UnhandledRejection por padrão. Express 5 propaga automaticamente.',
  },
  {
    title: 'Memory leak por EventEmitter (listeners não removidos)',
    badDesc: 'Adicionar listeners a cada requisição sem removê-los esgota memória progressivamente',
    badCode: [
      { t: 'app.get', c: '#ef4444' }, { t: "('/stream', (req, res) => {\n" },
      { t: '  // NOVO listener a cada req!\n', c: '#ef4444' },
      { t: '  emitter.', c: '#ef4444' }, { t: "on('data', d => res.write(d))\n", c: '#ef4444' },
      { t: '  // listener nunca removido\n})', c: '#e2e8f0' },
    ],
    goodDesc: 'Remova o listener quando a conexão fechar — use off() no evento "close" do request',
    goodCode: [
      { t: 'app.get', c: '#68A063' }, { t: "('/stream', (req, res) => {\n" },
      { t: '  const handler = (d) => res.write(d)\n', c: '#e2e8f0' },
      { t: '  emitter.', c: '#4ade80' }, { t: 'on', c: '#4ade80' }, { t: "('data', handler)\n" },
      { t: '  req.on(', c: '#e2e8f0' }, { t: "'close'", c: '#4ade80' }, { t: ', () =>\n' },
      { t: '    emitter.', c: '#4ade80' }, { t: 'off', c: '#4ade80' }, { t: "('data', handler))\n})", c: '#e2e8f0' },
    ],
    why: 'MaxListenersExceededWarning avisa, mas o leak já começou. Cada listener retém closure — memória cresce indefinidamente.',
  },
  {
    title: '.pipe() em vez de stream.pipeline()',
    badDesc: '.pipe() não propaga erros — streams ficam abertas em erro (file descriptors não liberados)',
    badCode: [
      { t: '// .pipe() não propaga erros!\n', c: '#ef4444' },
      { t: 'fs.createReadStream', c: '#ef4444' }, { t: "('big.csv')\n" },
      { t: '  .', c: '#e2e8f0' }, { t: 'pipe', c: '#ef4444' }, { t: '(zlib.createGzip())\n' },
      { t: '  .', c: '#e2e8f0' }, { t: 'pipe', c: '#ef4444' }, { t: "(fs.createWriteStream('out.gz'))\n" },
      { t: '  // erro no meio = streams abertas forever\n', c: '#ef4444' },
    ],
    goodDesc: 'stream.pipeline() propaga erros e fecha todos os streams automaticamente',
    goodCode: [
      { t: 'import { pipeline } from ', c: '#e2e8f0' }, { t: "'stream/promises'\n", c: '#4ade80' },
      { t: 'await ', c: '#a78bfa' }, { t: 'pipeline(\n', c: '#4ade80' },
      { t: "  fs.createReadStream('big.csv'),\n", c: '#e2e8f0' },
      { t: '  zlib.createGzip(),\n', c: '#e2e8f0' },
      { t: "  fs.createWriteStream('out.gz')\n", c: '#e2e8f0' },
      { t: ') // cleanup automático em erro\n', c: '#4ade80' },
    ],
    why: 'Com .pipe() e erro, o processo fica com file descriptors abertos. Em produção = EMFILE (too many open files) após horas.',
  },
]

// ── Dados: Mind Map ───────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Event Loop',
    color: C,
    items: [
      { t: '6 fases (T-P-I-P-C-C)', k: true },
      { t: 'nextTick > Promise > setImmediate', k: true },
      { t: 'poll aguarda I/O', k: true },
      { t: 'microtasks entre fases', k: true },
      { t: 'starving com nextTick recursivo', a: true },
    ],
  },
  {
    label: 'libuv / V8',
    color: '#a78bfa',
    items: [
      { t: 'thread pool (4 default)', k: true },
      { t: 'epoll / kqueue / IOCP', k: true },
      { t: 'UV_THREADPOOL_SIZE', a: true },
      { t: 'V8 JIT (Ignition + TurboFan)', a: true },
      { t: 'hidden classes / GC', a: true },
    ],
  },
  {
    label: 'Streams',
    color: '#4ade80',
    items: [
      { t: 'Readable / Writable / Transform', k: true },
      { t: 'pipeline() vs pipe()', k: true },
      { t: 'backpressure (write → false)', k: true },
      { t: 'highWaterMark', a: true },
      { t: 'objectMode', a: true },
    ],
  },
  {
    label: 'Módulos',
    color: '#f59e0b',
    items: [
      { t: 'CJS: require() síncrono', k: true },
      { t: 'ESM: import estático', k: true },
      { t: 'ESM top-level await', k: true },
      { t: 'interop CJS↔ESM', a: true },
      { t: 'dual packages (exports)', a: true },
    ],
  },
  {
    label: 'Cluster / Workers',
    color: '#38bdf8',
    items: [
      { t: 'cluster.fork() / CLUSTER_WORKERS', k: true },
      { t: 'worker_threads para CPU-bound', k: true },
      { t: 'SharedArrayBuffer + Atomics', a: true },
      { t: 'child_process.spawn()', k: true },
      { t: 'sticky sessions', a: true },
    ],
  },
  {
    label: 'HTTP / Performance',
    color: '#f472b6',
    items: [
      { t: 'keepAliveTimeout > LB timeout', a: true },
      { t: 'headersTimeout (slowloris)', a: true },
      { t: 'graceful shutdown (SIGTERM)', k: true },
      { t: '--max-old-space-size', a: true },
      { t: 'AbortController / AbortSignal', k: true },
    ],
  },
  {
    label: 'Observabilidade',
    color: '#fbbf24',
    items: [
      { t: 'async_hooks / AsyncLocalStorage', a: true },
      { t: 'diagnostics_channel', a: true },
      { t: 'node --inspect / --prof', k: true },
      { t: 'clinic.js (heap, flame)', a: true },
      { t: 'heapsnapshot para leak', a: true },
    ],
  },
  {
    label: 'Ecossistema',
    color: '#94a3b8',
    items: [
      { t: 'Express / Fastify / NestJS', k: true },
      { t: 'nodemon / tsx para dev', k: true },
      { t: 'PM2 para produção', k: true },
      { t: 'nvm / fnm para versões', k: true },
      { t: 'npm workspaces / pnpm', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Consigo desenhar as 6 fases do event loop de memória?',
  'Sei explicar por que nextTick tem prioridade sobre Promise.then?',
  'Consigo implementar stream.pipeline() com tratamento de erro?',
  'Entendo backpressure e quando write() retorna false?',
  'Sei quando usar cluster vs worker_threads vs child_process?',
  'Consigo implementar graceful shutdown para Kubernetes?',
  'Entendo a diferença entre CJS e ESM e seus trade-offs?',
  'Sei o que é libuv e por que fs usa thread pool mas rede não?',
  'Consigo diagnosticar memory leak com node --heapsnapshot-signal?',
  'Entendo hidden classes do V8 e seu impacto em performance?',
]

// ── Dados: Recipe Book ───────────────────────────────────────────────────────

const RECIPES: Recipe[] = [
  {
    title: 'HTTP Server com Graceful Shutdown',
    goal: 'Servidor Express que finaliza conexões em voo ao receber SIGTERM',
    category: 'Server',
    ingredients: ['express', 'node:http', 'process signals'],
    steps: [
      {
        title: 'Criar o servidor',
        description: 'Crie o server HTTP explicitamente para ter controle do close()',
        code: `const app = express()
const server = http.createServer(app)`,
      },
      {
        title: 'Registrar handler SIGTERM/SIGINT',
        description: 'Escute os sinais de shutdown antes de iniciar',
        code: `const shutdown = async () => {
  server.close(async () => {
    await db.end()        // fecha pool do banco
    process.exit(0)
  })
  // forçar saída após 30s
  setTimeout(() => process.exit(1), 30_000)
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)`,
      },
      {
        title: 'Iniciar o servidor',
        description: 'Inicie após configurar todos os handlers',
        code: `server.listen(PORT, () =>
  console.log(\`Servidor na porta \${PORT}\`)
)`,
      },
    ],
    pitfalls: [
      'server.close() não fecha conexões keep-alive — use server.closeIdleConnections() (Node 18.2+)',
      'await db.end() pode travar se o pool tiver queries pendentes — adicione timeout',
    ],
  },
  {
    title: 'Stream Pipeline com Tratamento de Erro',
    goal: 'Processar arquivo grande sem carregar tudo em memória, com cleanup automático',
    category: 'Streams',
    steps: [
      {
        title: 'Importar pipeline e streams',
        description: 'Use stream/promises para async/await',
        code: `import { pipeline } from 'stream/promises'
import { createReadStream, createWriteStream } from 'fs'
import { createGzip } from 'zlib'`,
      },
      {
        title: 'Executar pipeline',
        description: 'pipeline() gerencia backpressure e propaga erros',
        code: `await pipeline(
  createReadStream('input.csv'),
  new Transform({
    transform(chunk, _, cb) {
      cb(null, chunk.toString().toUpperCase())
    }
  }),
  createGzip(),
  createWriteStream('output.csv.gz')
)`,
      },
    ],
    pitfalls: [
      'Nunca use .pipe() para pipelines de produção — erros não propagam',
      'highWaterMark padrão é 16KB; para grandes arquivos, 64KB-256KB é mais eficiente',
    ],
  },
  {
    title: 'Worker Thread para CPU-Bound',
    goal: 'Executar hashing ou parsing pesado em thread separada sem bloquear o event loop',
    category: 'Workers',
    steps: [
      {
        title: 'Criar arquivo do worker',
        description: 'worker.js recebe dados via workerData e retorna via parentPort',
        code: `// worker.js
import { workerData, parentPort } from 'worker_threads'
import { scryptSync } from 'crypto'
const hash = scryptSync(workerData.password, workerData.salt, 64)
parentPort.postMessage(hash.toString('hex'))`,
      },
      {
        title: 'Invocar o worker',
        description: 'Crie uma Promise wrapper para uso limpo',
        code: `function hashPassword(password, salt) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', {
      workerData: { password, salt }
    })
    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', code => {
      if (code !== 0) reject(new Error(\`Exit \${code}\`))
    })
  })
}`,
      },
    ],
    pitfalls: [
      'Workers são caros de criar — use worker pool (piscina, workerpool) para reutilização',
      'Transferíveis (ArrayBuffer) evitam cópia de memória — use para dados grandes',
    ],
  },
  {
    title: 'Cluster com Auto-Respawn',
    goal: 'Escalar HTTP server em todos os CPUs com restart automático de workers com crash',
    category: 'Cluster',
    steps: [
      {
        title: 'Configurar cluster',
        description: 'Master cria N workers; worker cria o servidor',
        code: `import cluster from 'cluster'
import os from 'os'

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length
  for (let i = 0; i < cpuCount; i++) cluster.fork()

  cluster.on('exit', (worker, code) => {
    if (code !== 0) {
      console.log(\`Worker \${worker.id} morreu. Reiniciando...\`)
      cluster.fork()
    }
  })
} else {
  // worker: inicia o servidor Express normalmente
  startServer()
}`,
      },
    ],
    pitfalls: [
      'Em Kubernetes, escale via pods — cluster dentro de container apenas usa CPUs do pod',
      'Estado em memória não é compartilhado entre workers — use Redis para sessões/cache',
    ],
  },
  {
    title: 'AsyncLocalStorage para Request Context',
    goal: 'Propagar request ID em logs sem passar o ID manualmente por toda a cadeia de chamadas',
    category: 'Observabilidade',
    steps: [
      {
        title: 'Criar o store',
        description: 'AsyncLocalStorage propagado por toda a cadeia async',
        code: `import { AsyncLocalStorage } from 'async_hooks'

export const requestContext = new AsyncLocalStorage()

// middleware Express
app.use((req, res, next) => {
  const store = { requestId: req.headers['x-request-id'] || crypto.randomUUID() }
  requestContext.run(store, next)
})`,
      },
      {
        title: 'Consumir em qualquer lugar da cadeia',
        description: 'Acesse o store sem passar props',
        code: `// service.ts — sem receber requestId por parâmetro
function createAuditLog(action) {
  const { requestId } = requestContext.getStore()
  logger.info({ requestId, action }, 'Audit log')
}`,
      },
    ],
    pitfalls: [
      'AsyncLocalStorage tem overhead (~10-20%) — use apenas onde necessário',
      'getStore() pode retornar undefined fora do run() — verifique antes de usar',
    ],
  },
  {
    title: 'AbortController com Timeout',
    goal: 'Cancelar operações assíncronas (fetch, db query) após timeout configurável',
    category: 'Async',
    steps: [
      {
        title: 'Cancelar fetch após timeout',
        description: 'AbortSignal.timeout cria signal automático',
        code: `// Nativo Node 17.3+ — sem biblioteca adicional
const response = await fetch('https://api.example.com/data', {
  signal: AbortSignal.timeout(5_000) // 5 segundos
})`,
      },
      {
        title: 'Cancelar operação customizada',
        description: 'Passe o signal para qualquer operação que o suporte',
        code: `const controller = new AbortController()
const { signal } = controller

// timeout manual
const timeoutId = setTimeout(() => controller.abort(), 10_000)

try {
  const result = await db.query(sql, { signal })
  clearTimeout(timeoutId)
  return result
} catch (err) {
  if (err.name === 'AbortError') throw new TimeoutError()
  throw err
}`,
      },
    ],
    pitfalls: [
      'Promise.race não cancela a operação subjacente — AbortController é a solução correta',
      'AbortError é lançado como erro — sempre trate explicitamente',
    ],
  },
  {
    title: 'EventEmitter Tipado com TypeScript',
    goal: 'EventEmitter com type safety completo — sem erros em tempo de execução por nomes de evento errados',
    category: 'TypeScript',
    steps: [
      {
        title: 'Criar EventEmitter tipado',
        description: 'Extenda EventEmitter com interface de eventos',
        code: `import { EventEmitter } from 'events'

interface UserEvents {
  'user:created': [user: User]
  'user:deleted': [userId: string]
  'error': [err: Error]
}

class UserEventBus extends EventEmitter {
  emit<K extends keyof UserEvents>(
    event: K, ...args: UserEvents[K]
  ): boolean { return super.emit(event, ...args) }

  on<K extends keyof UserEvents>(
    event: K, listener: (...args: UserEvents[K]) => void
  ): this { return super.on(event, listener) }
}`,
      },
    ],
    pitfalls: [
      'Registre sempre listener de "error" — EventEmitter sem handler de erro lança exceção uncaught',
      'Use once() para listeners temporários (ex: aguardar um único evento)',
    ],
  },
  {
    title: 'Healthcheck Endpoint',
    goal: 'Endpoint /health para Kubernetes liveness/readiness probes',
    category: 'Server',
    steps: [
      {
        title: 'Liveness e Readiness',
        description: 'Liveness: processo está vivo. Readiness: pode receber tráfego',
        code: `// Liveness — roda mesmo sem DB
app.get('/health/live', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

// Readiness — verifica dependências
app.get('/health/ready', async (req, res) => {
  try {
    await db.query('SELECT 1')
    await redis.ping()
    res.json({ status: 'ready' })
  } catch (err) {
    res.status(503).json({ status: 'not ready', error: err.message })
  }
})`,
      },
    ],
    pitfalls: [
      'Liveness NÃO deve verificar DB — se o DB cair, o k8s mata todos os pods, agravando o problema',
      'Readiness com timeout: se o DB demorar > 2s, retorne 503 — evita timeout do probe',
    ],
  },
]

// ── Dados: CLI Ref ────────────────────────────────────────────────────────────

const CLI_COMMANDS: CommandEntry[] = [
  {
    command: 'node --inspect app.js',
    description: 'Inicia com debugger Chrome DevTools na porta 9229',
    flags: [
      { flag: '--inspect-brk', description: 'Pausa na primeira linha (aguarda attach)' },
      { flag: '--inspect=0.0.0.0:9229', description: 'Expõe para rede (cuidado em produção)' },
    ],
    example: 'node --inspect-brk dist/server.js',
    category: 'Debug',
  },
  {
    command: 'node --prof app.js',
    description: 'Gera arquivo de profiling do V8 (isolate-*.log)',
    flags: [
      { flag: '--prof-process', description: 'Processa o log e exibe flamegraph no terminal' },
    ],
    example: 'node --prof app.js && node --prof-process isolate-*.log',
    category: 'Performance',
  },
  {
    command: 'node --heap-prof app.js',
    description: 'Gera heap snapshot ao final do processo para análise de memória',
    flags: [
      { flag: '--heapsnapshot-signal=SIGUSR2', description: 'Tira snapshot ao receber o sinal' },
    ],
    example: 'node --heapsnapshot-signal=SIGUSR2 app.js # kill -USR2 <pid> em runtime',
    category: 'Memory',
  },
  {
    command: 'node --max-old-space-size=4096 app.js',
    description: 'Define o heap V8 máximo em MB (default ~1.5GB em 64-bit)',
    example: 'NODE_OPTIONS=--max-old-space-size=4096 node app.js',
    category: 'Memory',
  },
  {
    command: 'node --enable-source-maps app.js',
    description: 'Usa source maps em stack traces — essencial para TypeScript compilado',
    example: 'NODE_OPTIONS=--enable-source-maps node dist/app.js',
    category: 'Debug',
  },
  {
    command: 'UV_THREADPOOL_SIZE=8 node app.js',
    description: 'Aumenta thread pool da libuv (default: 4, max: 1024)',
    example: 'UV_THREADPOOL_SIZE=16 node server.js # para fs/crypto intensivo',
    category: 'Performance',
  },
  {
    command: 'node --version',
    description: 'Exibe versão do Node.js instalada',
    example: 'node -v  # alias',
    category: 'Info',
  },
  {
    command: 'node -e "código"',
    description: 'Executa snippet JavaScript direto na linha de comando',
    example: 'node -e "console.log(process.versions)"',
    category: 'Utility',
  },
  {
    command: 'node --watch app.js',
    description: 'Reinicia automaticamente ao detectar mudanças nos arquivos (Node 18+)',
    flags: [
      { flag: '--watch-path=./src', description: 'Observa apenas o diretório especificado' },
    ],
    example: 'node --watch --watch-path=./src dist/server.js',
    category: 'Dev',
  },
  {
    command: 'npm run dev',
    description: 'Script customizado de desenvolvimento (nodemon, tsx, ts-node etc)',
    example: 'tsx watch src/server.ts  # TypeScript sem compilar',
    category: 'Dev',
  },
  {
    command: 'node --loader ts-node/esm',
    description: 'Executa TypeScript ESM diretamente sem compilação',
    example: 'node --loader ts-node/esm src/server.ts',
    category: 'TypeScript',
    danger: false,
  },
  {
    command: 'node --input-type=module',
    description: 'Permite pipe de ESM code no stdin',
    example: 'echo "import os from \'os\'; console.log(os.cpus().length)" | node --input-type=module',
    category: 'Utility',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Node.js',
    stackLabel: 'Backend · Runtime',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Node.js',
    accentColor: C,
    stackLabel: 'Backend · Runtime',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['process.nextTick', 'Fila nextTick (prioridade máxima)'],
        ['Promise.then', 'Microtask queue (spec JS)'],
        ['setImmediate', 'Fase check do event loop'],
        ['setTimeout(0)', 'Fase timers (heap-based)'],
        ['fs.readFile', 'Thread pool libuv (4 threads default)'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'UV_THREADPOOL_SIZE=8+ para fs/crypto intensivo',
        '--max-old-space-size=4096 para heap grande',
        'stream.pipeline() para processar arquivos grandes',
        'worker_threads para CPU-bound (não bloqueia event loop)',
        'AsyncLocalStorage para context propagation (evita prop drilling)',
        'node --prof para profiling V8 em produção',
      ],
      patterns: [
        {
          name: 'Graceful Shutdown',
          code: `process.on('SIGTERM', async () => {
  server.close()
  await db.end()
  process.exit(0)
})`,
          desc: 'Para conexões, drena requisições, fecha recursos, sai',
        },
        {
          name: 'Error-first callback → Promise',
          code: `import { promisify } from 'util'
const readFile = promisify(fs.readFile)`,
          desc: 'promisify transforma callback legado em Promise',
        },
        {
          name: 'AbortSignal.timeout()',
          code: `await fetch(url, {
  signal: AbortSignal.timeout(5_000)
})`,
          desc: 'Timeout nativo sem bibliotecas (Node 17.3+)',
        },
      ],
      mentalModels: [
        'Node é single-threaded para JS — mas libuv usa threads para fs/crypto',
        'Event loop não bloqueia em I/O de rede — bloqueia em CPU-bound',
        'Backpressure: write() false = pause; drain event = resume',
        'CJS síncrono + dinâmico; ESM estático + tree-shakeable',
        'worker_threads para CPU; cluster para HTTP multi-core',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Node.js',
    stackLabel: 'Backend · Runtime',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Node.js',
    stackLabel: 'Backend · Runtime',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Node.js',
    stackLabel: 'Backend · Runtime',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de ir a uma entrevista sênior.',
  }),
  recipes: () => buildRecipeBookPdf({
    recipes: RECIPES,
    skillName: 'Node.js',
    accentColor: C,
    stackLabel: 'Backend · Runtime',
    coverTitle: 'Node.js Recipe Book',
    coverSubtitle: '8 receitas para o dia a dia',
  }),
  commands: () => buildCommandRefPdf({
    commands: CLI_COMMANDS,
    skillName: 'Node.js',
    accentColor: C,
    stackLabel: 'Backend · Runtime',
    coverTitle: 'Node.js CLI Reference',
    coverSubtitle: 'Flags, process APIs e módulos essenciais',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function NodeJsPdfs() {
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
