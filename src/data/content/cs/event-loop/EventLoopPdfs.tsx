'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, PatternItem, DepRow, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta Event Loop ─────────────────────────────────────────────────────────
const C = '#f59e0b'   // âmbar — representa async/tempo

// ── Metadados dos PDFs ───────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: o que é o event loop, call stack, microtask vs macrotask, por que 1-4-3-2, async/await na prática, blocking vs non-blocking, Node.js fases, process.nextTick, setTimeout vs setImmediate, Promise.all vs sequencial — nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Regras de execução, APIs de tempo e padrões async',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: ordem de prioridade completa (sync → nextTick → microtask → macro), APIs por fila, padrões de composição de Promises, armadilhas comuns e regras de debugging de código assíncrono.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'A ordem de prioridade que você nunca mais esquece',
    type: 'mnemonics',
    pages: 2,
    description: 'SPAM para a ordem de execução (Sync → Promise → API-timer → Macro), as fases do Node.js com TPIPCС, e a regra de ouro "micro drena, macro espera" — truques que grudam.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 4 erros clássicos de código assíncrono',
    type: 'antipatterns',
    pages: 3,
    description: 'setTimeout(0) não é "agora", microtask loop infinito, await sequencial quando deveria ser paralelo, Promise.all sem tratamento de reject — cada um com código errado × correto.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Event Loop do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental completo: call stack, filas, APIs, Node.js vs browser, padrões async e checklist de 15 perguntas que você deve conseguir responder de cabeça antes de qualquer entrevista.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
]

// ── Dados: Q&A ───────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é o event loop? Descreva em uma frase.',
    a: '<p>O event loop é o mecanismo que permite ao JavaScript single-thread executar código assíncrono: quando a call stack está vazia, ele verifica as filas de callbacks (microtasks e macrotasks) e os empurra para execução.</p><ul><li>JavaScript tem <strong>um thread</strong> — executa uma coisa por vez</li><li>Event loop = ciclo infinito: "call stack vazia? → processar fila" → repetir</li><li>A order é fixa: síncrono → microtasks (todas) → uma macrotask → repetir</li></ul>',
    tip: 'Comece pela limitação (single-thread) e explique por que isso não é um problema na prática. O event loop é a solução.',
  },
  {
    level: 'Senior',
    q: 'Qual a saída deste código? console.log(1); setTimeout(()=>log2,0); Promise.resolve().then(()=>log3); console.log(4)',
    a: '<p>A saída é <strong>1, 4, 3, 2</strong>.</p><ul><li>1 e 4 executam sincronamente na call stack</li><li>setTimeout coloca callback na macrotask queue (via Web API/Timer)</li><li>Promise.then coloca callback na microtask queue</li><li>Call stack vazia → drena microtasks (3) → executa uma macrotask (2)</li></ul>',
    tip: 'Esta pergunta é o clássico de event loop. Desenhe mentalmente as filas: sync → micro queue → macro queue. A ordem é determinística.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre microtask e macrotask? Cite exemplos de cada.',
    a: '<p>A diferença é a prioridade e o timing de execução:</p><ul><li><strong>Microtasks:</strong> alta prioridade — TODA a fila drena antes de qualquer macrotask. APIs: Promise.then/catch/finally, queueMicrotask(), MutationObserver, process.nextTick*</li><li><strong>Macrotasks:</strong> baixa prioridade — executa UMA por vez, depois verifica microtasks. APIs: setTimeout, setInterval, setImmediate (Node), I/O callbacks</li><li>Regra de ouro: "após cada task, esvazia a microtask queue inteira"</li></ul>',
    tip: 'A pegadinha: "microtask que gera microtask" pode bloquear indefinidamente (nunca chega às macrotasks). Mencione isso para demonstrar profundidade.',
  },
  {
    level: 'Pleno',
    q: 'O que acontece quando você usa await? Realmente suspende o thread?',
    a: '<p>await não suspende o thread — suspende <em>a função async</em> e devolve o controle ao chamador. O thread continua executando.</p><ul><li>await é açúcar sintático: <code>const x = await p</code> vira <code>p.then(x => restoDaFunção)</code></li><li>Quando encontra o await, a função é suspensa e o código após a chamada da função async executa</li><li>Quando a Promise resolve, o restante da função é enfileirado como microtask</li></ul>',
    tip: 'Mostre com código: fetchData() + console.log("depois") — o "depois" executa ANTES do que está após o await dentro de fetchData().',
  },
  {
    level: 'Senior',
    q: 'O que é blocking do event loop? Cite 3 exemplos e como corrigir.',
    a: '<p>Blocking = qualquer operação que mantém a call stack ocupada por tempo significativo sem liberar o controle.</p><ul><li><strong>Loop CPU-bound:</strong> for(;;) pesado — fix: dividir em chunks com setTimeout(0) ou Web Worker</li><li><strong>fs.readFileSync no Node.js:</strong> I/O síncrono — fix: usar fs.readFile com callback ou promisify</li><li><strong>JSON.parse de objeto gigante:</strong> parsing síncrono — fix: Web Worker ou stream parsing</li><li>Regra prática: qualquer operação que demora >16ms pode causar frame drop no browser</li></ul>',
    tip: 'Mencione que await/Promise NÃO resolve blocking CPU-bound — o executor da Promise ainda roda sincronamente. Isso é armadilha clássica.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre process.nextTick e setImmediate no Node.js?',
    a: '<p>process.nextTick e setImmediate têm timing completamente diferente:</p><ul><li><strong>process.nextTick:</strong> executa antes de qualquer microtask (incluindo Promise.then) — na mesma iteração atual, antes de passar para o event loop</li><li><strong>setImmediate:</strong> executa na fase Check do event loop da Node.js, APÓS callbacks de I/O (fase Poll)</li><li>Armadilha: process.nextTick recursivo pode fazer starvation — nunca sai da iteração atual</li><li>Recomendação Node.js docs: prefira setImmediate para código que deve executar "no próximo tick" — é mais previsível</li></ul>',
    tip: 'A confusão de nomes é clássica: nextTick não é "next tick do event loop" — é mais cedo. setImmediate não é imediato — é depois do I/O. Os nomes são ao contrário do que parecem.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona Promise.all? O que acontece se uma Promise rejeitar?',
    a: '<p>Promise.all recebe um array de Promises e retorna uma Promise que resolve com um array de resultados quando TODAS resolvem.</p><ul><li><strong>Fail fast:</strong> se QUALQUER Promise rejeitar, Promise.all rejeita imediatamente com o erro dessa Promise</li><li>As outras Promises continuam executando (não são canceladas) mas os resultados são ignorados</li><li><strong>Promise.allSettled:</strong> alternativa que nunca rejeita — retorna um array com status (fulfilled/rejected) de cada uma</li><li>Performance: as Promises em Promise.all rodam em paralelo — total = max(tempos), não soma</li></ul>',
    tip: 'Distinga Promise.all (fail fast) vs Promise.allSettled (todos os resultados) vs Promise.race (primeiro que resolve/rejeita) vs Promise.any (primeiro que resolve).',
  },
  {
    level: 'Senior',
    q: 'O que são as fases do event loop do Node.js? Cite-as em ordem.',
    a: '<p>Node.js tem 6 fases em cada iteração do event loop:</p><ol><li><strong>Timers:</strong> setTimeout, setInterval com delay expirado</li><li><strong>Pending Callbacks:</strong> erros de I/O adiados para a próxima iteração</li><li><strong>Idle/Prepare:</strong> uso interno</li><li><strong>Poll:</strong> busca novos eventos de I/O — mais importante, pode fazer blocking wait</li><li><strong>Check:</strong> setImmediate callbacks</li><li><strong>Close Callbacks:</strong> socket.on("close") e similares</li></ol><p>Entre cada fase, microtasks (process.nextTick e Promises) são drenadas.</p>',
    tip: 'Mnemônico: TPIPCС (Timers, Pending, Idle, Poll, Check, Close). O Poll é a fase onde o Node.js espera por I/O — é onde a eficiência acontece.',
  },
  {
    level: 'Pleno',
    q: 'Por que await em um loop pode ser problemático? Como resolver?',
    a: '<p>await dentro de um loop for cria execução sequencial — cada iteração aguarda a anterior, perdendo paralelismo.</p><ul><li><strong>Problemático:</strong> <code>for (const id of ids) await fetch(id)</code> — serializa N requests que poderiam ser paralelas</li><li><strong>Correto para paralelo:</strong> <code>await Promise.all(ids.map(id => fetch(id)))</code> — todas as requests começam ao mesmo tempo</li><li><strong>Quando sequencial é correto:</strong> quando cada iteração depende do resultado da anterior</li><li><strong>Controle de concorrência:</strong> se N é grande, use batching ou p-limit para limitar simultaneidade</li></ul>',
    tip: 'Pergunte-se: "cada iteração depende da anterior?" Se não → Promise.all. Se sim → await sequencial é correto. Se N é enorme → batching.',
  },
  {
    level: 'Senior',
    q: 'Como queueMicrotask se diferencia de Promise.resolve().then()?',
    a: '<p>queueMicrotask() e Promise.resolve().then() têm comportamento praticamente idêntico — ambos enfileiram na microtask queue com a mesma prioridade.</p><ul><li>queueMicrotask é mais explícito sobre a intenção e ligeiramente mais eficiente (sem criar objeto Promise)</li><li>Promise.resolve().then() cria um objeto Promise temporário — overhead mínimo mas mensurável em hot paths</li><li>Caso de uso de queueMicrotask: implementar utilitários que precisam de microtask timing sem a overhead da Promise API</li><li>Ambos executam APÓS o código síncrono atual e ANTES de qualquer macrotask</li></ul>',
    tip: 'Mencionar queueMicrotask demonstra que você vai além das Promises e conhece as primitivas de baixo nível do event loop.',
  },
  {
    level: 'Senior',
    q: 'O que é starvation do event loop? Como detectar e corrigir?',
    a: '<p>Starvation = macrotasks nunca executam porque a microtask queue nunca esvazia. Ou event loop nunca chega a processar novos eventos porque está sempre ocupado.</p><ul><li><strong>Causa típica:</strong> microtask que gera microtask recursivamente (ex: Promise.then que retorna outra Promise)</li><li><strong>Detecção Node.js:</strong> <code>--inspect</code> + Chrome DevTools Performance, ou <code>process.hrtime()</code> para medir tempo entre iterations</li><li><strong>Métricas:</strong> latência de event loop (ideal &lt;1ms, problema &gt;100ms)</li><li><strong>Fix:</strong> mover trabalho pesado para Worker Threads, dividir em chunks com setTimeout(0)</li></ul>',
    tip: 'Mencionar ferramentas de diagnóstico (clinic.js, 0x, --inspect) junto com a teoria demonstra experiência real em produção.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre setTimeout(fn, 0) e setTimeout(fn, 1)?',
    a: '<p>Na prática, a diferença é mínima — ambos colocam um callback na macrotask queue. Mas há detalhes importantes:</p><ul><li>O delay de setTimeout é MÍNIMO, não garantido — o timer é impreciso dependendo do SO</li><li>Browsers têm um mínimo de 4ms para delays aninhados (conforme HTML spec)</li><li>setTimeout(fn, 0) no contexto de um callback é frequentemente clampado para 4ms em browsers</li><li>Em Node.js, o timer pode ser até 1ms de imprecisão dependendo da fase do loop</li><li>Ambos executam na fase Timers do Node.js (ou como macrotask no browser)</li></ul>',
    tip: 'O ponto importante: setTimeout(0) não é "agora" — é "na próxima oportunidade depois do sícrono e das microtasks". A granularidade exata depende do runtime.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o unhandled rejection no Node.js? O que muda no Node.js 15+?',
    a: '<p>Unhandled rejection = Promise que rejeita sem .catch() ou try/catch no await.</p><ul><li><strong>Node.js &lt;15:</strong> apenas warning ("UnhandledPromiseRejectionWarning") — não terminava o processo</li><li><strong>Node.js 15+:</strong> unhandled rejection causa crash do processo por padrão — <code>--unhandled-rejections=throw</code></li><li><strong>Handler global:</strong> <code>process.on("unhandledRejection", (reason, promise) => {})</code></li><li><strong>Best practice:</strong> nunca deixe Promise sem tratamento de erro. Em servidor Express/Fastify, use middleware de erro + async wrapper</li></ul>',
    tip: 'A mudança do Node.js 15 causa surpresas em migração. Código que "só dava warning" antes agora crasha. Mencione isso para demonstrar experiência com versões do Node.',
  },
  {
    level: 'Pleno',
    q: 'O que é requestAnimationFrame? Como se relaciona com o event loop?',
    a: '<p>requestAnimationFrame (rAF) agenda um callback para ser executado ANTES do próximo frame de pintura — sincronizado com o refresh rate do monitor (geralmente ~60fps = ~16ms).</p><ul><li>É uma macrotask com timing especial — executa antes do Paint, depois do JavaScript e do Layout</li><li>Ideal para animações — evita tearing visual que ocorre com setTimeout(fn, 16)</li><li>Pausado quando a aba está em background — economiza CPU/bateria</li><li>Não é adequado para lógica de negócio — apenas para animações e leitura de layout pre-paint</li></ul>',
    tip: 'Distinga rAF de setTimeout: rAF é sincronizado com o display, não com o timer. Em monitores 120Hz, rAF dispara a cada ~8ms, não 16ms.',
  },
  {
    level: 'Senior',
    q: 'Implemente uma função sleep(ms) correta em JavaScript.',
    a: '<p>A implementação correta usa Promise + setTimeout:</p><pre><code>function sleep(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms))\n}\n\n// Uso:\nawait sleep(1000) // aguarda 1s</code></pre><ul><li>Retorna uma Promise que resolve após ms milissegundos</li><li>await na Promise suspende a função async sem bloquear o thread</li><li>Outros events (cliques, requests) são processados durante o sleep</li><li>NUNCA use busy-wait: <code>const end = Date.now() + ms; while(Date.now() &lt; end) {}</code> — bloqueia o thread</li></ul>',
    tip: 'A implementação de sleep é pergunta frequente em entrevista para testar se o candidato entende a diferença entre bloquear o thread vs suspender uma função async.',
  },
  {
    level: 'Senior',
    q: 'Como o event loop se comporta com Promise.race?',
    a: '<p>Promise.race resolve (ou rejeita) com o resultado da PRIMEIRA Promise que resolve ou rejeita — independente do resultado das outras.</p><ul><li>As outras Promises continuam executando (JavaScript não tem mecanismo de cancelamento nativo)</li><li>Use caso: timeout em requisições — <code>Promise.race([fetch(url), sleep(5000).then(() => { throw new Error("timeout") })])</code></li><li>Diferença de Promise.any: race rejeita se a primeira rejeitar; any ignora rejeições e só rejeita se TODAS rejeitarem</li></ul>',
    tip: 'O caso de uso de timeout com Promise.race é o exemplo prático mais citado em entrevista. Demonstre implementando ao vivo se possível.',
  },
  {
    level: 'Pleno',
    q: 'Como lidar com múltiplos awaits em try/catch?',
    a: '<p>try/catch em async functions captura rejeições de qualquer await dentro do bloco.</p><ul><li><strong>Um try/catch para múltiplos awaits:</strong> primeiro erro sai do try imediatamente</li><li><strong>try/catch por await:</strong> permite tratar cada erro independentemente — mais granular</li><li><strong>Promise com .catch inline:</strong> <code>const result = await fetch().catch(err => null)</code> — permite continuar com fallback</li><li>Cuidado: if (result === null) após o await para detectar que houve erro</li></ul>',
    tip: 'Mostre as 3 abordagens e quando usar cada uma. A abordagem .catch inline é útil quando você quer fallback silencioso, mas obscura o handling de erro se mal documentada.',
  },
  {
    level: 'Senior',
    q: 'O que é Promise chaining e quais os erros mais comuns?',
    a: '<p>Promise chaining é encadear .then() para processar resultados em série. Erros comuns:</p><ul><li><strong>Pyramid of doom:</strong> .then dentro de .then (nesting) em vez de retornar Promises em cadeia plana</li><li><strong>Esquecer de retornar:</strong> se .then não retorna a Promise, o próximo .then recebe undefined</li><li><strong>Não propagar erros:</strong> .then sem .catch — erros silenciosos</li><li><strong>Criar Promise desnecessariamente:</strong> new Promise(resolve => resolve(value)) quando Promise.resolve(value) basta</li></ul>',
    tip: 'Em 2025, async/await é preferível ao chaining manual na maioria dos casos — melhor legibilidade e tratamento de erro. Chaining ainda é relevante para pipelines funcionais com .map/.reduce.',
  },
  {
    level: 'Senior',
    q: 'O que são Web Workers? Quando usar para resolver problemas de event loop?',
    a: '<p>Web Workers executam JavaScript em um thread separado — sem acesso ao DOM mas com comunicação via postMessage.</p><ul><li>Use quando: operação CPU-bound levaria &gt;100ms na main thread (image processing, crypto, WASM)</li><li>Comunicação: <code>worker.postMessage(data)</code> e <code>worker.onmessage = e => use(e.data)</code></li><li>Dados são copiados por serialização (structured clone) — sem memória compartilhada exceto com SharedArrayBuffer</li><li>Não solve I/O blocking — apenas CPU blocking. Para I/O, use async/await com callbacks nativos</li></ul>',
    tip: 'Mencionar a limitação "não acessa DOM" é crítico — é a razão pela qual você não pode mover código de manipulação de UI para Worker. Só lógica pura.',
  },
  {
    level: 'Pleno',
    q: 'O que é concorrência em JavaScript? Como difere de paralelismo?',
    a: '<p>JavaScript tem concorrência mas não paralelismo nativo (exceto com Workers):</p><ul><li><strong>Concorrência:</strong> múltiplas tarefas progredindo — o event loop intercala callbacks, dando ilusão de simultaneidade</li><li><strong>Paralelismo:</strong> múltiplas tarefas rodando literalmente ao mesmo tempo — requer múltiplos threads (Web Workers, worker_threads)</li><li>JavaScript é single-thread: duas funções NUNCA executam ao mesmo tempo na main thread</li><li>Isso elimina race conditions de memória compartilhada — mas ainda há race conditions de estado assíncrono</li></ul>',
    tip: 'A distinção concorrência vs paralelismo é pergunta frequente. A ausência de true parallelismo na main thread é uma escolha de design que simplifica a programação mas limita o throughput de CPU-bound tasks.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o AbortController com Promises e fetch?',
    a: '<p>AbortController permite cancelar operações assíncronas que suportam o sinal de abort:</p><ul><li><strong>Criação:</strong> <code>const ctrl = new AbortController()</code></li><li><strong>Uso com fetch:</strong> <code>fetch(url, { signal: ctrl.signal })</code></li><li><strong>Cancelamento:</strong> <code>ctrl.abort()</code> — fetch rejeita com AbortError</li><li><strong>Cleanup em React:</strong> <code>useEffect(() => { const ctrl = new AbortController(); fetch(url, {signal}); return () => ctrl.abort() }, [])</code></li><li>AbortError é diferente de outros erros — detecte com <code>err.name === "AbortError"</code></li></ul>',
    tip: 'AbortController em cleanup de useEffect é a forma correta de evitar memory leaks e setState em componentes desmontados. É sinal de maturidade em código React assíncrono.',
  },
]

// ── Dados: CheatSheet ────────────────────────────────────────────────────────

const CS_HOOKS: HookItem[] = [
  { name: 'setTimeout(fn, ms)',      sig: 'Macrotask após ms milissegundos (mínimo)',         desc: 'Fase Timers do Node.js / macrotask queue no browser' },
  { name: 'setInterval(fn, ms)',     sig: 'Macrotask repetindo a cada ms',                   desc: 'Cancelar com clearInterval para evitar memory leak' },
  { name: 'Promise.resolve(v)',      sig: 'Promise já resolvida com valor v',                 desc: 'Enfileira .then callbacks como microtasks' },
  { name: 'Promise.all(arr)',        sig: 'Resolve quando TODAS resolvem. Fail fast.',        desc: 'Performance: todas as Promises rodam em paralelo' },
  { name: 'Promise.allSettled(arr)', sig: 'Resolve com status de todas — nunca rejeita',     desc: 'Quando você quer processar todas mesmo com falhas' },
  { name: 'Promise.race(arr)',       sig: 'Primeira que resolve ou rejeita "vence"',          desc: 'Timeout pattern: race([fetch(), sleep(5000).then(throw)])' },
  { name: 'Promise.any(arr)',        sig: 'Primeira que RESOLVE (ignora rejeições)',          desc: 'Diferente de race: ignora rejeições individuais' },
  { name: 'queueMicrotask(fn)',      sig: 'Enfileira na microtask queue diretamente',         desc: 'Mais eficiente que Promise.resolve().then() — sem criar objeto' },
]

const CS_HOOKS_EXTRA: HookItem[] = [
  { name: 'process.nextTick(fn)',    sig: 'Node.js: antes de qualquer microtask',            desc: 'Mais prioritário que Promise.then — pode causar starvation' },
  { name: 'setImmediate(fn)',        sig: 'Node.js: fase Check, após I/O callbacks',         desc: 'Use para execução após I/O da iteração atual' },
  { name: 'requestAnimationFrame',   sig: 'Browser: antes do próximo frame de pintura',      desc: 'Sincronizado com display (~60fps). Pausado em background.' },
  { name: 'AbortController',         sig: 'new AbortController() → { signal, abort() }',    desc: 'Cancelar fetch e outras operações assíncronas' },
  { name: 'async function',          sig: 'function sempre retorna Promise',                 desc: 'Return value automaticamente wrapped em Promise.resolve' },
  { name: 'await',                   sig: 'Suspende função async, devolve controle ao caller', desc: 'Restante da função = microtask quando Promise resolve' },
]

const CS_DEP_ROWS: DepRow[] = [
  ['Ordem de prioridade', 'Sync > process.nextTick > Promise.then/micro > macrotask (setTimeout/setInterval/I/O)'],
  ['Fases Node.js (ordem)', 'Timers → Pending → Idle → Poll → Check (setImmediate) → Close'],
  ['Blocking threshold', 'Browser: >16ms congela frames. Node.js: >1ms latência percebida em APIs'],
  ['CPU-bound fix', 'Web Workers (browser) ou worker_threads (Node.js) para offload de thread'],
  ['Promise.all timing', 'Todas as Promises iniciam imediatamente (paralelo). Total = max(tempos), não soma'],
]

const CS_RULES: RuleItem[] = [
  { ok: true,  t: 'Microtasks drenam completamente antes de qualquer macrotask' },
  { ok: true,  t: 'await suspende a função, não o thread — código após a chamada executa' },
  { ok: true,  t: 'Use Promise.all para Promises independentes — paralelismo real' },
  { ok: true,  t: 'Try/catch captura rejeições de await dentro do mesmo bloco' },
  { ok: false, t: 'setTimeout(0) = "executa agora" — é macrotask, menor prioridade que Promise.then' },
  { ok: false, t: 'await em Promise wrapping código síncrono pesado resolve blocking — não resolve' },
  { ok: false, t: 'Microtask recursiva infinita — drena indefinidamente, macrotasks ficam bloqueadas' },
  { ok: false, t: 'process.nextTick recursivo — starvation: nunca sai da iteração atual' },
]

const CS_PERFORMANCE_TIPS: string[] = [
  'Evite operações >16ms na main thread — use Worker para CPU-bound ou async I/O nativo',
  'Promise.all para fetches independentes — nunca await sequencial sem dependência',
  'queueMicrotask() em hot paths em vez de Promise.resolve().then() — menos overhead',
  'AbortController + signal em todos os fetches dentro de useEffect — cleanup obrigatório',
  'Detecte blocking com: performance.now() antes/depois de código suspeito',
  'clinic.js (Node.js) ou Chrome DevTools Performance para profiling de event loop',
]

const CS_PATTERNS: PatternItem[] = [
  { name: 'sleep() não-bloqueante',    code: "function sleep(ms) {\n  return new Promise(r => setTimeout(r, ms))\n}\nawait sleep(1000) // não bloqueia",             desc: 'Suspende a função async sem bloquear o thread' },
  { name: 'Timeout com Promise.race',  code: "const result = await Promise.race([\n  fetch(url),\n  sleep(5000).then(() => { throw new Error('timeout') })\n])",   desc: 'Cancela a operação se demorar mais que N ms' },
  { name: 'Fetch com AbortController', code: "const ctrl = new AbortController()\ntry {\n  const r = await fetch(url, { signal: ctrl.signal })\n} catch(e) {\n  if (e.name === 'AbortError') return // cancelado\n}",  desc: 'Cancelamento limpo de fetch assíncrono' },
  { name: 'Chunks com setTimeout',     code: "function processChunks(items, done) {\n  let i = 0\n  function next() {\n    if (i >= items.length) return done()\n    process(items[i++])\n    setTimeout(next, 0)\n  }\n  setTimeout(next, 0)\n}",  desc: 'Processa array grande sem bloquear o event loop' },
]

const CS_MENTAL_MODELS: string[] = [
  '"Call stack vazia?" → sim → drena microtasks → executa uma macrotask → repete',
  'await = .then implícito. async function = retorna Promise. Ambos são açúcar sintático',
  'setTimeout(0) ≠ "executa agora". É "a próxima oportunidade após todo sícrono e microtasks"',
  'Web Workers = paralelismo real. Event loop = concorrência (intercalação) sem paralelismo',
  'process.nextTick > Promise.then (Node.js). Nomes ao contrário do que parecem.',
]

// ── Dados: Mnemônicos ────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'SPAM — Ordem de execução no browser',
    trick: 'S-P-A-M: "Sincrono Promete Antes de Macrotask"',
    expansion: [
      ['S', 'Síncrono (call stack drena completamente)'],
      ['P', 'Promises / microtasks (toda a fila drena)'],
      ['A', 'APIs de browser (efeito colateral registrado)'],
      ['M', 'Macrotasks (setTimeout, setInterval — um por vez)'],
    ],
    explanation: 'S = Síncrono (call stack), P = Promises/microtasks (todos), A = Apis de browser (efeito colateral), M = Macrotasks (setTimeout, setInterval). A ordem SPAM é a ordem de prioridade — nunca se inverte.',
    example: 'console.log("S") → Promise.then("P") → setTimeout("M") → saída: S, P, M',
    why: 'A ordem de execução é a pergunta mais frequente sobre event loop em entrevistas. SPAM elimina qualquer dúvida sobre quem roda primeiro.',
  },
  {
    label: 'TPIPCС — Fases do Node.js Event Loop',
    trick: 'T-P-I-P-C-С: "Todo Programa I/O Precisa Checar Close"',
    expansion: [
      ['T', 'Timers (setTimeout, setInterval)'],
      ['P', 'Pending Callbacks (erros de I/O do ciclo anterior)'],
      ['I', 'Idle / Prepare (uso interno do Node)'],
      ['P', 'Poll (espera e processa I/O novo)'],
      ['C', 'Check (setImmediate)'],
      ['С', 'Close Callbacks (socket.on("close"))'],
    ],
    explanation: 'T = Timers, P = Pending Callbacks, I = Idle/Prepare, P = Poll (I/O), C = Check (setImmediate), С = Close Callbacks. A fase Poll é onde o Node.js "vive" — espera por I/O novo.',
    example: 'setImmediate roda na fase Check (C), depois de I/O na fase Poll (P)',
    why: 'Saber as fases explica por que setImmediate é garantido antes de setTimeout em contexto I/O — ambos ficam à frente de setTimeout na fase Timers.',
  },
  {
    label: 'Micro drena, Macro espera',
    trick: '"Micro é voraz: come tudo. Macro come um por vez."',
    expansion: [
      ['Microtask voraz', 'Drena completamente antes de qualquer macrotask — inclusive microtasks geradas dentro de microtasks'],
      ['Macrotask paciente', 'Executa UM callback por iteração do event loop, depois verifica microtasks novamente'],
    ],
    explanation: 'Microtask queue é drenada completamente antes de qualquer macrotask executar. Se uma microtask gerar outra microtask, essa também drena antes de macrotasks. Macro executa UM callback por iteração do event loop.',
    example: 'Promise.resolve().then(() => Promise.resolve().then(() => console.log("nested micro"))) → roda antes de qualquer setTimeout',
    why: 'Entender que microtasks se auto-alimentam explica bugs de "loop infinito de Promises" que trava a UI sem nunca lançar exceção visível.',
  },
  {
    label: 'await não é bloqueante',
    trick: '"await = pausa a função, não o trem"',
    expansion: [
      ['A função pausa', 'Sai do call stack, aguarda na microtask queue'],
      ['O trem (thread) continua', 'Outros callbacks sobem e executam normalmente'],
      ['Promise resolve', 'A função volta ao trem como microtask'],
    ],
    explanation: 'O "trem" é o thread. await pausa a função async (ela desce do trem e espera na plataforma) mas o trem (thread) continua andando. Outros passageiros (callbacks) sobem. Quando a Promise resolve, a função volta ao trem como microtask.',
    example: 'async function f() { console.log(1); await delay(0); console.log(3) } f(); console.log(2) → 1, 2, 3',
    why: 'A metáfora do trem elimina a confusão de "await bloqueia o servidor". Node.js nunca bloqueia — a função suspende, o event loop continua.',
  },
  {
    label: 'process.nextTick vs setImmediate — nomes ao contrário',
    trick: '"nextTick = ANTES do loop. setImmediate = DEPOIS do I/O"',
    expansion: [
      ['nextTick', 'Executa AGORA, antes das microtasks de Promise — mais urgente que "next tick"'],
      ['setImmediate', 'Executa na fase Check, DEPOIS do I/O poll — menos "imediato" que parece'],
    ],
    explanation: 'Contra-intuitivo: nextTick NÃO é "no próximo tick do event loop" — é agora, antes das microtasks. setImmediate NÃO é "imediato" — é na fase Check, depois de todo o I/O. Os nomes foram mal escolhidos — a Node.js docs oficialmente recomenda preferir setImmediate.',
    example: 'setImmediate(() => console.log("A")); process.nextTick(() => console.log("B")) → B, A',
    why: 'Os nomes contraintuitivos causam bugs reais. Saber que nextTick tem prioridade máxima (acima de Promises!) evita surpresas de ordenação.',
  },
]

// ── Dados: Anti-patterns ─────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'setTimeout(0) assumido como "executa agora"',
    badDesc: 'setTimeout com delay 0 ainda é macrotask — executa depois de todas as microtasks',
    badCode: [
      { t: '// ❌ assumindo que setTimeout(0) executa logo', c: '#475569' },
      { t: '\nconsole.log(', c: '#e2e8f0' }, { t: "'A'", c: '#fbbf24' }, { t: ')', c: '#e2e8f0' },
      { t: '\nsetTimeout(() => console.log(', c: '#ef4444' }, { t: "'B'", c: '#fbbf24' }, { t: '), 0)', c: '#ef4444' },
      { t: '\nPromise.resolve().then(() => console.log(', c: '#e2e8f0' }, { t: "'C'", c: '#fbbf24' }, { t: '))', c: '#e2e8f0' },
      { t: '\n// ❌ Esperando: A, B, C', c: '#ef4444' },
    ],
    goodDesc: 'A ordem correta é sync → microtasks → macrotasks — setTimeout(0) é sempre o último',
    goodCode: [
      { t: '// ✓ Saída real: A, C, B', c: '#4ade80' },
      { t: '\n// Ordem: sync (A) → micro (C) → macro (B)', c: '#475569' },
      { t: '\nconsole.log(', c: '#e2e8f0' }, { t: "'A'", c: '#fbbf24' }, { t: ')  // sync', c: '#4ade80' },
      { t: '\nsetTimeout(() => console.log(', c: '#e2e8f0' }, { t: "'B'", c: '#fbbf24' }, { t: '), 0)', c: '#e2e8f0' },
      { t: '\n// B → macrotask (menor prioridade)', c: '#4ade80' },
      { t: '\nPromise.resolve().then(() => console.log(', c: '#e2e8f0' }, { t: "'C'", c: '#fbbf24' }, { t: '))', c: '#e2e8f0' },
      { t: '\n// C → microtask (executa antes de B)', c: '#4ade80' },
    ],
    why: 'setTimeout(0) coloca o callback na macrotask queue. Promises/microtasks têm prioridade maior e drenam completamente antes de qualquer macrotask. A ordem é determinística: sync → micro → macro.',
  },
  {
    title: 'await sequencial em operações independentes',
    badDesc: 'Cada await aguarda o anterior — operações que poderiam ser paralelas rodam em série',
    badCode: [
      { t: 'async function loadDashboard() {', c: '#e2e8f0' },
      { t: '\n  const user = await getUser()      ', c: '#ef4444' },
      { t: '// 200ms', c: '#475569' },
      { t: '\n  const posts = await getPosts()    ', c: '#ef4444' },
      { t: '// +300ms (espera user)', c: '#475569' },
      { t: '\n  const stats = await getStats()    ', c: '#ef4444' },
      { t: '// +150ms (espera posts)', c: '#475569' },
      { t: '\n  // Total: ~650ms', c: '#ef4444' },
      { t: '\n}', c: '#e2e8f0' },
    ],
    goodDesc: 'Promise.all paraleliza operações independentes — total = tempo da mais lenta',
    goodCode: [
      { t: 'async function loadDashboard() {', c: '#e2e8f0' },
      { t: '\n  const [user, posts, stats] = await Promise.all([', c: '#4ade80' },
      { t: '\n    getUser(),    ', c: '#4ade80' },
      { t: '// todas começam ao mesmo tempo', c: '#475569' },
      { t: '\n    getPosts(),', c: '#4ade80' },
      { t: '\n    getStats(),', c: '#4ade80' },
      { t: '\n  ])', c: '#4ade80' },
      { t: '\n  // Total: ~300ms (o mais lento)', c: '#4ade80' },
      { t: '\n}', c: '#e2e8f0' },
    ],
    why: 'await sequencial em operações independentes soma os tempos: 200 + 300 + 150 = 650ms. Promise.all executa todas em paralelo: total = max(200, 300, 150) = 300ms. Mais do que 2x mais rápido.',
  },
  {
    title: 'Promise.all sem tratamento de reject',
    badDesc: 'Uma rejeição cancela toda a operação — outras Promises têm resultados ignorados',
    badCode: [
      { t: '// ❌ Se fetchB rejeitar, o resultado de fetchA é perdido', c: '#475569' },
      { t: '\ntry {', c: '#e2e8f0' },
      { t: '\n  const [a, b] = await Promise.all([fetchA(), fetchB()])', c: '#ef4444' },
      { t: '\n} catch (err) {', c: '#e2e8f0' },
      { t: '\n  // não sabemos se fetchA foi OK ou não', c: '#ef4444' },
      { t: '\n}', c: '#e2e8f0' },
    ],
    goodDesc: 'Promise.allSettled processa todos os resultados independente de rejeições',
    goodCode: [
      { t: '// ✓ allSettled — processa todos os resultados', c: '#4ade80' },
      { t: '\nconst results = await Promise.allSettled([fetchA(), fetchB()])', c: '#4ade80' },
      { t: '\nresults.forEach(r => {', c: '#e2e8f0' },
      { t: "\n  if (r.status === 'fulfilled') use(r.value)", c: '#4ade80' },
      { t: "\n  if (r.status === 'rejected')  log(r.reason)", c: '#4ade80' },
      { t: '\n})', c: '#e2e8f0' },
    ],
    why: 'Promise.all tem fail fast: se qualquer Promise rejeitar, toda a operação rejeita imediatamente. Use Promise.allSettled quando você quer processar todos os resultados — sejam sucesso ou falha — sem que um erro descarte os demais.',
  },
  {
    title: 'Envolver código síncrono em Promise para "tornar async"',
    badDesc: 'O executor da Promise roda sincronamente — o código CPU-bound ainda bloqueia o thread',
    badCode: [
      { t: '// ❌ await em código CPU-bound NÃO resolve blocking', c: '#475569' },
      { t: '\nasync function fakeAsync() {', c: '#e2e8f0' },
      { t: '\n  return new Promise(resolve => {', c: '#e2e8f0' },
      { t: '\n    let sum = 0', c: '#e2e8f0' },
      { t: '\n    for (let i = 0; i < 1e9; i++) sum += i', c: '#ef4444' },
      { t: ' // BLOCKING!', c: '#ef4444' },
      { t: '\n    resolve(sum)', c: '#e2e8f0' },
      { t: '\n  })', c: '#e2e8f0' },
      { t: '\n}', c: '#e2e8f0' },
    ],
    goodDesc: 'CPU-bound real precisa de Web Worker (browser) ou worker_threads (Node.js)',
    goodCode: [
      { t: '// ✓ Use Web Worker para CPU-bound', c: '#4ade80' },
      { t: '\nconst worker = new Worker("compute.js")', c: '#4ade80' },
      { t: '\nworker.postMessage({ n: 1e9 })', c: '#4ade80' },
      { t: '\nconst result = await new Promise(resolve => {', c: '#e2e8f0' },
      { t: '\n  worker.onmessage = e => resolve(e.data)', c: '#4ade80' },
      { t: '\n})', c: '#e2e8f0' },
      { t: '\n// Main thread não bloqueia enquanto worker computa', c: '#4ade80' },
    ],
    why: 'O executor do construtor de Promise (a função passada para new Promise) executa SINCRONAMENTE. Wrapping de código CPU-bound em Promise não o torna não-bloqueante. Para verdadeiro paralelismo CPU, use Web Workers (browser) ou worker_threads (Node.js).',
  },
]

// ── Dados: Mind Map ──────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Fundamentos',
    color: '#f59e0b',
    items: [
      { t: 'Single-thread', k: true },
      { t: 'Call Stack (LIFO)', k: true },
      { t: 'Heap (memória)', k: true },
      { t: 'Event Loop ciclo', k: true },
      { t: 'Concorrência vs Paralelismo', a: true },
    ],
  },
  {
    label: 'Filas de Execução',
    color: '#3b82f6',
    items: [
      { t: 'Microtask Queue', k: true },
      { t: 'Macrotask Queue', k: true },
      { t: 'Ordem de prioridade', k: true },
      { t: 'Drena toda microtask antes de macro', k: true },
      { t: 'queueMicrotask()', a: true },
    ],
  },
  {
    label: 'APIs Assíncronas',
    color: '#a78bfa',
    items: [
      { t: 'Promise.then/catch/finally', k: true },
      { t: 'async/await', k: true },
      { t: 'setTimeout / setInterval', k: true },
      { t: 'fetch / XMLHttpRequest', k: true },
      { t: 'MutationObserver', a: true },
    ],
  },
  {
    label: 'Node.js específico',
    color: '#4ade80',
    items: [
      { t: 'Fases: Timers→Poll→Check→Close', k: true },
      { t: 'process.nextTick', k: true },
      { t: 'setImmediate', k: true },
      { t: 'Libuv (I/O engine)', a: true },
      { t: 'worker_threads', a: true },
    ],
  },
  {
    label: 'Padrões Async',
    color: '#fb923c',
    items: [
      { t: 'Promise.all (paralelo)', k: true },
      { t: 'Promise.allSettled', k: true },
      { t: 'Promise.race (timeout)', k: true },
      { t: 'async/await com try/catch', k: true },
      { t: 'AbortController', a: true },
    ],
  },
  {
    label: 'Problemas & Debug',
    color: '#ef4444',
    items: [
      { t: 'Blocking do event loop', k: true },
      { t: 'Starvation de macrotasks', a: true },
      { t: 'Unhandled Promise rejection', k: true },
      { t: 'Stack overflow (recursão)', k: true },
      { t: 'clinic.js / 0x (Node profiling)', a: true },
    ],
  },
  {
    label: 'Browser APIs',
    color: '#38bdf8',
    items: [
      { t: 'requestAnimationFrame', k: true },
      { t: 'Web Workers', k: true },
      { t: 'MessageChannel', a: true },
      { t: 'Intersection Observer (micro)', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Explicar o que é o event loop em uma frase',
  'Prever a saída de: console.log(1); setTimeout(log2,0); Promise.resolve().then(log3); console.log(4)',
  'Explicar a diferença entre microtask e macrotask com 3 exemplos de cada',
  'Descrever o que acontece internamente quando await é encontrado',
  'Explicar por que setTimeout(0) não é "executar agora"',
  'Descrever como process.nextTick difere de Promise.then no Node.js',
  'Explicar o que causa blocking do event loop e 3 formas de corrigir',
  'Implementar sleep(ms) corretamente sem bloquear o thread',
  'Explicar Promise.all vs Promise.allSettled vs Promise.race',
  'Descrever as 6 fases do event loop do Node.js em ordem',
  'Explicar quando usar Promise.all vs await sequencial',
  'Descrever por que wrapping de código síncrono em Promise não resolve blocking',
  'Explicar o que é starvation e como uma microtask recursiva causa',
  'Descrever quando usar Web Workers vs async/await',
  'Explicar AbortController e como usar para cancelar fetch',
]

// ── PDF Builders ─────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Event Loop',
    stackLabel: 'JavaScript / Node.js',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Event Loop',
    accentColor: C,
    stackLabel: 'JavaScript / Node.js',
    sections: {
      hooks: CS_HOOKS,
      hooksExtra: CS_HOOKS_EXTRA,
      depRows: CS_DEP_ROWS,
      rules: CS_RULES,
      performanceTips: CS_PERFORMANCE_TIPS,
      patterns: CS_PATTERNS,
      mentalModels: CS_MENTAL_MODELS,
    },
    coverTitle: 'Event Loop CheatSheet',
    coverSubtitle: 'Microtasks · Macrotasks · async/await · Node.js Fases',
    levelLabel: 'Pleno e Sênior',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Event Loop',
    stackLabel: 'JavaScript / Node.js',
    coverTitle: 'Event Loop — Mnemônicos',
    coverSubtitle: 'A ordem de prioridade que você nunca mais esquece',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Event Loop',
    stackLabel: 'JavaScript / Node.js',
    coverTitle: 'Event Loop — Anti-patterns',
    coverSubtitle: 'Os 4 erros clássicos de código assíncrono',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Event Loop',
    stackLabel: 'JavaScript / Node.js',
    coverTitle: 'Event Loop — Mind Map',
    coverSubtitle: 'Do single-thread ao sênior em uma folha',
    checklistTitle: 'Checklist de Entrevista — Event Loop',
    checklistDesc: 'Responda cada item sem consulta. Se travar, volte ao conteúdo antes da entrevista.',
  }),
}

// ── Componente ───────────────────────────────────────────────────────────────

export default function EventLoopPdfs() {
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
