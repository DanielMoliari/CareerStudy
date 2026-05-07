import type { SkillContent } from "@/types"

const memoryManagement: SkillContent = {
  tagline: "Heap, stack, GC, leaks: como linguagens gerenciam memória e como não vazar.",
  why: "Sênior precisa entender por que app cresce sem parar em prod, identificar leak (event listener, closure, cache infinito) e usar dev tools para heap snapshot. É diferencial em entrevista e em debugging de produção.",
  summary: "Memória divide em stack (frame de função, pequeno e rápido) e heap (objetos, gerenciado por GC em linguagens managed). GC traça alcance via roots; o que não é alcançável é coletado. Leaks acontecem quando você mantém referência desnecessária. Em JS/Node: closures, listeners, caches, timers vivos. Saber profile com DevTools/heapdump é diferencial sênior.",
  keypoints: [
    { title: "Stack", body: "Frame por chamada de função. Cresce/encolhe rápido. Tamanho pequeno (1-8MB). Recursão profunda → stack overflow." },
    { title: "Heap", body: "Objetos alocados dinamicamente. Gerenciado por GC ou manual (C/C++/Rust). Maior, mais lento que stack." },
    { title: "Garbage collection", body: "Tipos: mark-and-sweep, generacional (jovem/velho), incremental, concurrent. V8 usa generacional + mark-compact. Pausa pode impactar latência." },
    { title: "Reachability", body: "GC parte das roots (globais, stack frames atuais) e marca tudo alcançável. Resto é coletado. Referência mantida = memória mantida." },
    { title: "Leaks comuns em JS", body: "Event listener não removido, closure capturando ref grande, cache sem TTL, setInterval esquecido, DOM detached referenciado por JS." },
    { title: "Closures", body: "Função que captura escopo externo. Útil mas perigoso: retém tudo que poderia ser usado. Cuidado em factories que criam muitas closures." },
    { title: "WeakMap / WeakSet", body: "Referências fracas. GC pode coletar key se não houver outra ref forte. Bom para cache atrelado a objeto sem prevenir coleta." },
    { title: "Profile e debug", body: "Chrome DevTools → Memory → Heap snapshot. Compara dois snapshots, vê 'retained size' e 'retainers'. Em Node: --inspect, heapdump npm package." },
    { title: "V8 GC generacional", body: "Objetos jovens ficam no young space (Scavenger, frequente). Se sobrevivem 2 GCs, promovidos para old space (Mark-Sweep-Compact, mais raro). Hipótese: maioria dos objetos morre jovem." },
    { title: "Object pooling", body: "Reutilizar objetos em vez de criar/destruir. Reduz pressão no GC. Comum em game engines, parsers de alta performance e buffers de rede." },
  ],
  gotchas: [
    "Adicionar listener sem removeEventListener — se elemento sai do DOM mas listener tem closure ref, leak.",
    "setInterval sem clearInterval em SPA — handler vivo segura todo o escopo.",
    "Cache global sem LRU/TTL cresce sem limite.",
    "Usar Map/Set onde WeakMap resolveria — impede GC de coletar keys.",
    "Confundir 'objeto enorme' com 'leak' — pode só ser uso pesado. Leak = cresce sem parar.",
    "Async listeners (Promise) que esperam evento que nunca vem — Promise + closure ficam pendurados.",
    "Em React: missing cleanup em useEffect (subscriptions, timers).",
    "Closures em loop sem captura correta — todos referenciam mesma variável mutável.",
    "Buffer.allocUnsafe() sem zeramento — lê memória de processos anteriores (segurança!).",
  ],
  interview: [
    {
      level: "pleno",
      q: "Qual a diferença entre stack e heap?",
      a: "<p><strong>Stack</strong>: aloca frames de função em LIFO (Last In, First Out). Crescimento automático a cada chamada, liberação automática ao retornar. Rápida (simples ponteiro de pilha). Tamanho pequeno: 1-8MB. Armazena primitivos e referências (ponteiros) para objetos.</p><p><strong>Heap</strong>: pool maior para objetos alocados dinamicamente. Em linguagens managed (Java, JS, Python), gerenciado pelo GC. Em C/C++, gerenciado manualmente (malloc/free). Mais lento que stack por precisar de busca e gerenciamento de fragmentação.</p><p>Stack overflow = recursão muito profunda. Out of memory = heap cheio após falha do GC.</p>",
      tip: "Mencione que referências (ponteiros) ficam na stack, mas os objetos em si ficam no heap. Essa separação explica por que closures 'capturam' objetos — elas seguram a referência da stack que aponta para o heap.",
    },
    {
      level: "pleno",
      q: "O que causa memory leak em SPA?",
      a: "<ul><li><strong>Listeners não removidos</strong>: addEventListner sem removeEventListener quando componente desmonta — listener segura closure que segura o DOM antigo e objetos.</li><li><strong>Timers ativos</strong>: setInterval/setTimeout rodando após componente desmontado — referência ao escopo do componente nunca liberada.</li><li><strong>Closures capturando refs grandes</strong>: factory que cria funções, cada uma retendo escopo com objeto enorme.</li><li><strong>Cache global sem LRU/TTL</strong>: Map ou objeto em módulo singleton crescendo sem limite.</li><li><strong>DOM detached</strong>: elemento removido do DOM mas referenciado por variável JS — GC não pode coletar.</li><li><strong>Subscriptions não canceladas</strong>: RxJS Observable, EventEmitter, AbortController não chamado.</li></ul>",
      tip: "O caso mais cobrado: listener em SPA. Demonstre que você conhece o padrão React: useEffect retornando função de cleanup que remove listener e cancela subscriptions.",
    },
    {
      level: "senior",
      q: "Como você debugaria um memory leak em produção Node.js?",
      a: "<p><strong>Pipeline:</strong></p><ol><li><strong>Observar</strong>: monitorar heap usage ao longo do tempo (process.memoryUsage().heapUsed). Se crescimento constante sem platô → leak.</li><li><strong>Reproduzir</strong>: identificar operação que causa crescimento (request específico, ação de usuário).</li><li><strong>Heap snapshots</strong>: com <code>--inspect</code> e Chrome DevTools ou <code>heapdump</code> npm. Tire 3 snapshots (baseline, depois de uso, depois de mais uso). Compare 'new' entre snapshot 1 e 3.</li><li><strong>Analisar retainers</strong>: o painel 'Retainers' mostra o caminho de referência que está impedindo a coleta. Geralmente é um array, Map, ou closure.</li><li><strong>Confirmar fix</strong>: após corrigir, retestar com os mesmos snapshots — heap não deve crescer mais.</li></ol><p>Ferramentas: <code>clinic.js heap</code>, <code>node --expose-gc</code> para forçar GC antes do snapshot, <code>v8.writeHeapSnapshot()</code> programaticamente.</p>",
      tip: "Mencione a estratégia de 3 snapshots — diferença entre snapshot 1 e 3 isola objetos que deveriam ser coletados mas não foram. O 'Retained Size' (quanto memória seria liberada se o objeto fosse coletado) é o número mais importante.",
    },
    {
      level: "pleno",
      q: "O que é WeakMap e quando usar?",
      a: "<p><code>WeakMap</code> é um Map onde as chaves são referências <em>fracas</em>. Se não há outra referência forte à chave, o GC pode coletá-la — e a entrada do WeakMap desaparece automaticamente.</p><p><strong>Use cases:</strong></p><ul><li>Cache de metadados associado a objetos sem prevenir coleta: <code>cache.set(domNode, { measurements })</code> — quando o nó é removido do DOM, o cache limpa automaticamente.</li><li>Private instance data em classes (padrão pré-campos privados): <code>const _private = new WeakMap()</code>.</li><li>Memoização de funções recebendo objetos — não prende o objeto em memória.</li></ul><p>Limitação: não é iterável (não dá para listar as chaves). Só funciona com chaves que são objetos (não primitivos).</p>",
      tip: "O exemplo mais claro: WeakMap para metadados de DOM nodes. Quando o node é coletado, o WeakMap limpa automaticamente — com Map normal, o node nunca seria coletado enquanto o Map vivesse.",
    },
    {
      level: "senior",
      q: "Explique o GC generacional do V8. Por que ele existe?",
      a: "<p><strong>Hipótese generacional</strong>: a maioria dos objetos morre jovem. Objetos criados e descartados em uma função raramente sobrevivem além do frame.</p><p>O V8 divide o heap em duas gerações:</p><ul><li><strong>Young Space (Scavenger/Minor GC)</strong>: ~1-8MB. Objetos novos alocam aqui. GC frequente (~a cada MB alocado). Algoritmo: Cheney's copying — copia objetos vivos para outra metade, mata o resto. Rápido porque jovens = maioria morre.</li><li><strong>Old Space (Major GC)</strong>: objetos que sobreviveram 2 Minor GCs são promovidos. GC menos frequente. Algoritmo: Mark-Sweep-Compact — marca vivos, varre mortos, compacta para reduzir fragmentação.</li></ul><p>Resultado: Minor GC é rápido (coleta apenas jovens, raramente sobrevivem), Major GC é mais custoso mas raro.</p>",
      tip: "A hipótese generacional justifica o design. Mostre que você entende que objetos de longa duração (singletons, caches) que chegam ao old space nunca mais são coletados pelo Minor GC — são mais caros de gerenciar.",
    },
    {
      level: "senior",
      q: "Como evitar pausas longas de GC (GC pauses) em aplicações de baixa latência?",
      a: "<ul><li><strong>Reduzir alocação no hot path</strong>: object pooling — reutilize objetos em vez de criar/destruir. Em Node: <code>Buffer.allocUnsafe(N)</code> + reuso manual vs <code>Buffer.alloc(N)</code> toda vez.</li><li><strong>Evitar deep clone desnecessário</strong>: <code>JSON.parse(JSON.stringify(obj))</code> em hot path cria muitos objetos efêmeros.</li><li><strong>Evitar closures em loop</strong>: closure criada em loop captura o escopo e vive até o loop terminar.</li><li><strong>Monitorar GC com perf_hooks</strong>: <code>PerformanceObserver({ entryTypes: ['gc'] })</code> para medir pausas.</li><li><strong>Node flags</strong>: <code>--max-old-space-size</code> ajusta limite do heap; <code>--optimize-for-size</code> prefere menor footprint; <code>--expose-gc</code> permite <code>global.gc()</code> manual em horário de baixo tráfego.</li><li><strong>Incremental/Concurrent GC</strong>: V8 moderno usa Orinoco — faz GC em background concorrentemente com JS. Poucas pausas Stop-The-World.</li></ul>",
      tip: "Object pooling é a técnica mais impactante em produção. Mostre um exemplo: pool de buffers para serialização de respostas HTTP em vez de criar novo Buffer por request.",
    },
    {
      level: "pleno",
      q: "Como closures causam memory leaks? Dê um exemplo concreto.",
      a: "<p>Closure captura referência para o escopo léxico — não uma cópia. Se a closure sobrevive mais que o esperado, tudo que ela referencia também sobrevive.</p><p><strong>Exemplo de leak:</strong></p><pre><code>function setup() {\n  const bigData = new Array(1000000).fill('dados')\n  // bigData nunca vai para o GC enquanto handler viver\n  button.addEventListener('click', function handler() {\n    console.log('clicou') // captura bigData indiretamente\n    // bigData é no mesmo escopo de handler\n  })\n}\nsetup() // bigData: 4MB presos em memória</code></pre><p>Mesmo que <code>bigData</code> nunca seja usado no handler, o motor JS (por segurança) mantém todo o escopo de <code>setup()</code> vivo enquanto <code>handler</code> existir.</p><p><strong>Fix:</strong></p><pre><code>// 1. removeEventListener quando não precisa mais\nbutton.removeEventListener('click', handler)\n// 2. Não capturar escopo grande — extrair a função\nconst handler = createHandler() // escopo menor\n// 3. Usar WeakRef para refs que podem ser coletadas</code></pre>",
      tip: "O detalhe sutil: handler não usa bigData, mas o motor mantém o escopo inteiro. Motores modernos fazem 'scope analysis' para liberar variáveis não usadas — mas isso não é garantido para todas as situações.",
    },
    {
      level: "senior",
      q: "O que é object pooling? Quando vale a pena implementar?",
      a: "<p>Object pooling é reutilizar instâncias de objetos em vez de criar/destruir a cada operação. Mantém um pool de objetos disponíveis; ao precisar de um, pega do pool (reset estado); ao terminar, devolve ao pool em vez de deixar para o GC.</p><pre><code>class BufferPool {\n  private pool: Buffer[] = []\n  acquire(size: number): Buffer {\n    const existing = this.pool.pop()\n    if (existing && existing.length >= size) return existing\n    return Buffer.allocUnsafe(size)\n  }\n  release(buf: Buffer) {\n    this.pool.push(buf)\n  }\n}</code></pre><p><strong>Quando vale:</strong></p><ul><li>Objetos grandes criados em alta frequência (buffers, DTOs, vetores)</li><li>Aplicações de baixa latência onde GC pauses são inaceitáveis (trading, games, streaming)</li><li>Criação tem custo significativo (conexões de banco, workers)</li></ul><p><strong>Quando NÃO vale:</strong> objetos pequenos em baixa frequência — a complexidade não compensa.</p>",
      tip: "Connection pools (PostgreSQL, Redis) são a aplicação mais comum de object pooling em backend. Mencione pg-pool ou ioredis como exemplos que você já usou.",
    },
    {
      level: "pleno",
      q: "O que é reachability (alcançabilidade) no contexto de GC?",
      a: "<p>Um objeto é <strong>alcançável</strong> se pode ser acessado seguindo referências a partir de um conjunto de <em>roots</em>. Tudo não alcançável pode ser coletado.</p><p><strong>Roots em JS:</strong></p><ul><li>Variáveis globais (<code>window</code>, <code>global</code>, módulos)</li><li>Stack frames das funções em execução (chamadas na call stack)</li><li>Objetos referenciados pelo motor (closures ativas, event listeners)</li></ul><p><strong>Algoritmo mark-and-sweep:</strong></p><ol><li><strong>Mark</strong>: começa das roots, traça todas as referências recursivamente, marca objetos alcançados como 'vivos'</li><li><strong>Sweep</strong>: percorre o heap, libera memória de objetos NÃO marcados</li><li><strong>Compact</strong> (opcional): move objetos vivos para eliminar fragmentação</li></ol><p>Um memory leak é simplesmente um objeto <em>alcançável mas inútil</em> — o GC não pode distinguir 'objeto útil' de 'objeto retido por engano'.</p>",
      tip: "Defina leak precisamente: 'objeto alcançável que não deveria mais ser alcançável'. O GC nunca comete erros — ele só libera o inalcançável. Leak = bug no código humano que mantém referência desnecessária.",
    },
    {
      level: "senior",
      q: "Como o Rust gerencia memória sem GC e sem leaks?",
      a: "<p>Rust usa <strong>ownership + borrowing + lifetimes</strong> — verificado em tempo de compilação, sem runtime overhead.</p><p><strong>Ownership:</strong> cada valor tem um único dono. Quando o dono sai de escopo, o valor é <em>dropped</em> (destrutor chamado, memória liberada). Sem possibilidade de double-free ou use-after-free.</p><pre><code>fn main() {\n  let s = String::from('hello') // s é dono\n  let s2 = s // move ownership para s2\n  // s inválido agora! Compiler error se usar\n  println!('{}', s2) // ok\n} // s2 dropped aqui — memória liberada automaticamente</code></pre><p><strong>Borrowing:</strong> referenciar sem transferir ownership via <code>&amp;</code> (shared) ou <code>&amp;mut</code> (exclusive). Compilador garante que referências não sobrevivem ao dono.</p><p><strong>RAII</strong>: Resource Acquisition Is Initialization — recursos liberados automaticamente via destrutores, sem <code>finally</code> ou GC.</p>",
      tip: "Rust zero-cost abstractions: sem GC pauses, sem runtime, sem overhead. O 'borrow checker' é o compilador que substitui o GC. Mencionar isso demonstra conhecimento de sistemas além de JS/Java.",
    },
    {
      level: "pleno",
      q: "Como você implementaria um LRU cache em JavaScript para evitar crescimento ilimitado?",
      a: "<p>LRU (Least Recently Used): quando o cache chega ao limite, remove o item menos recentemente acessado.</p><p>Implementação eficiente usando Map (que mantém ordem de inserção):</p><pre><code>class LRUCache {\n  private map = new Map&lt;string, unknown&gt;()\n  constructor(private max: number) {}\n\n  get(key: string) {\n    if (!this.map.has(key)) return undefined\n    // Move para o final (mais recente)\n    const val = this.map.get(key)\n    this.map.delete(key)\n    this.map.set(key, val)\n    return val\n  }\n\n  set(key: string, value: unknown) {\n    if (this.map.has(key)) this.map.delete(key)\n    else if (this.map.size >= this.max) {\n      // Remove o primeiro (menos recente)\n      const oldest = this.map.keys().next().value!\n      this.map.delete(oldest)\n    }\n    this.map.set(key, value)\n  }\n}</code></pre><p>O Map em JS mantém ordem de inserção — o primeiro item é sempre o mais antigo (LRU). Operações O(1) via delete+set para promover item acessado.</p>",
      tip: "A implementação com Map é O(1) para get e set. A alternativa naive com array seria O(n) para encontrar o LRU. Mencionar também TTL (expiração por tempo) além de LRU — em produção geralmente combinam os dois.",
    },
    {
      level: "senior",
      q: "O que são referências fracas (WeakRef) e como diferem de WeakMap?",
      a: "<p><code>WeakRef</code> (ES2021) cria uma referência que não impede o GC de coletar o objeto. Diferente de WeakMap que só aceita objetos como chaves — WeakRef pode segurar qualquer objeto.</p><pre><code>const obj = { data: 'grande' }\nconst ref = new WeakRef(obj)\n\n// ... tempo depois, obj pode ter sido coletado\nconst alive = ref.deref()\nif (alive) {\n  // ainda vivo — use\n} else {\n  // foi coletado pelo GC\n}</code></pre><p><code>FinalizationRegistry</code>: callback quando objeto é coletado:</p><pre><code>const registry = new FinalizationRegistry((heldValue) => {\n  console.log('Objeto coletado:', heldValue)\n})\nregistry.register(obj, 'identificador')</code></pre><p><strong>WeakRef vs WeakMap:</strong> WeakMap associa dados a um objeto (chave fraca); WeakRef segura uma referência fraca direta. Casos de uso de WeakRef: cache de objetos grandes que podem ser evictados, mapear recursos externos.</p>",
      tip: "Aviso importante: deref() pode retornar undefined entre duas chamadas consecutivas — o GC pode coletar entre elas. Nunca assuma que se deref() retornou o objeto em uma linha, ainda estará vivo na próxima.",
    },
    {
      level: "pleno",
      q: "Como o React gerencia memória em componentes? Quais os padrões de cleanup?",
      a: "<p>React não tem gerenciamento especial — depende do JS GC. Mas o ciclo de vida dos componentes cria oportunidades de leak se não houver cleanup.</p><p><strong>Padrões de cleanup em useEffect:</strong></p><pre><code>useEffect(() => {\n  // setup: cria subscription, listener, timer\n  const sub = someObservable.subscribe(handler)\n  window.addEventListener('resize', onResize)\n  const timerId = setInterval(tick, 1000)\n\n  // OBRIGATÓRIO: função de cleanup\n  return () => {\n    sub.unsubscribe()          // cancela subscription\n    window.removeEventListener('resize', onResize)\n    clearInterval(timerId)     // mata o timer\n  }\n}, [deps])</code></pre><p>O cleanup roda quando o componente desmonta (unmount) ou quando as deps mudam antes do próximo effect.</p><p><strong>Patterns comuns:</strong></p><ul><li>AbortController para cancelar fetch em curso</li><li>Closure de estado: <code>let active = true; return () => { active = false }</code></li><li>WeakRef para refs de componentes pai</li></ul>",
      tip: "O AbortController para fetch é o padrão mais moderno e correto para cancelar requests assíncronos em useEffect. Mencione que setState após unmount gera warning no React — daí o padrão 'let active = true'.",
    },
    {
      level: "senior",
      q: "Como funciona o Mark-Sweep-Compact do V8 para o old space?",
      a: "<p>O Major GC do V8 (Orinoco, implementado em 2016+) roda em 3 fases:</p><p><strong>1. Mark:</strong> começa das roots, traça todos os objetos alcançáveis e os marca. V8 usa <em>tri-color marking</em>: branco (não visitado), cinza (visitado mas filhos não), preto (visitado com filhos). Roda incrementalmente — intercala com JS para evitar pausas longas.</p><p><strong>2. Sweep:</strong> percorre o heap e libera blocos de objetos brancos (não marcados). Não move objetos — O(heap_size).</p><p><strong>3. Compact:</strong> move objetos pretos para um espaço contíguo, eliminando fragmentação. Atualiza ponteiros — Stop-The-World, mas raro (só quando fragmentação é alta).</p><p><strong>Concorrente:</strong> V8 usa helper threads para fazer marking em paralelo com JS thread (concurrent marking). A thread JS faz apenas pequenas pausas para sincronização (write barrier).</p>",
      tip: "Write barrier é o mecanismo que garante que objetos criados durante o concurrent marking não sejam perdidos — toda escrita de ponteiro em objeto preto é interceptada e o ponteiro novo é marcado. Mencionar isso demonstra profundidade real.",
    },
    {
      level: "pleno",
      q: "O que é fragmentation de memória e como afeta performance?",
      a: "<p><strong>Fragmentação externa</strong>: há memória livre suficiente total, mas não em bloco contíguo. Uma alocação de 10MB falha mesmo com 20MB livres em pedaços espalhados.</p><p><strong>Fragmentação interna</strong>: blocos alocados maiores que o necessário (padding para alinhamento). Espaço desperdiçado dentro de blocos alocados.</p><p><strong>Em JavaScript:</strong> o GC compacta o old space periodicamente para eliminar fragmentação externa. Mas a compactação tem custo — mover objetos e atualizar todos os ponteiros é Stop-The-World.</p><p><strong>Como reduzir:</strong></p><ul><li>Objetos de tamanho similar agrupados (alocador de slabs/pools)</li><li>Evitar criar/destruir objetos grandes frequentemente — fragmenta o heap</li><li>Em C/C++: use alocadores customizados (jemalloc, tcmalloc) que gerenciam fragmentação melhor que malloc padrão</li></ul>",
      tip: "Node.js usa tcmalloc (via V8) que lida bem com fragmentação em workloads web. Mas com padrão de criar/destruir objetos grandes frequentemente, mesmo tcmalloc tem dificuldades.",
    },
    {
      level: "senior",
      q: "Como diagnosticar crescimento de heap com heap snapshots no Node.js?",
      a: "<p><strong>Método com --inspect:</strong></p><ol><li><code>node --inspect app.js</code></li><li>Abrir <code>chrome://inspect</code> no Chrome</li><li>Na aba Memory: tirar Heap Snapshot (baseline)</li><li>Executar a operação suspeita N vezes</li><li>Tirar segundo snapshot</li><li>Comparar: filtrar por 'Objects allocated between snapshots'</li><li>Ordenar por Retained Size — objetos que mais seguram memória</li><li>Ver Retainers tree — quem está segurando a referência</li></ol><p><strong>Programático com v8:</strong></p><pre><code>import v8 from 'v8'\nimport { writeFileSync } from 'fs'\n\n// Força GC antes para baseline limpo\nif (global.gc) global.gc()\n\nconst filename = v8.writeHeapSnapshot()\nconsole.log('Snapshot salvo:', filename)\n// Abrir com Chrome DevTools</code></pre><p><strong>Ferramentas alternativas:</strong> <code>clinic heap</code> (Node Clinic), <code>heapdump</code> npm, <code>memwatch-next</code> para alertas automáticos de leak.</p>",
      tip: "O fluxo dos 3 snapshots é o mais confiável: inicial (baseline), após uso moderado, após muito uso. Diferença entre snapshot 1 e 3 isola objetos que crescem. A coluna 'Retained Size' é mais útil que 'Shallow Size'.",
    },
    {
      level: "senior",
      q: "O que é stack overflow e como evitar em código recursivo?",
      a: "<p>Stack overflow ocorre quando a call stack excede seu limite (~10.000 frames em V8, ~1MB em muitos sistemas). Cada chamada de função empilha um frame com: argumentos, variáveis locais, endereço de retorno.</p><p><strong>Causas:</strong></p><ul><li>Recursão sem caso base ou caso base nunca alcançado</li><li>Recursão muito profunda (processar árvore/grafo grande recursivamente)</li></ul><p><strong>Soluções:</strong></p><ul><li><strong>Tail call optimization (TCO)</strong>: em funções tail-recursive, o compilador reutiliza o frame atual em vez de empilhar novo. JS permite TCO mas apenas em strict mode e raro suporte.</li><li><strong>Trampolining</strong>: transformar recursão em iteração com stack explícita gerenciada no heap:</li></ul><pre><code>function trampoline(fn: Function) {\n  return (...args: unknown[]) => {\n    let result = fn(...args)\n    while (typeof result === 'function') {\n      result = result()\n    }\n    return result\n  }\n}</code></pre><ul><li><strong>Iteração com stack manual</strong>: DFS de árvore com array como stack em vez de recursão</li></ul>",
      tip: "Trampolining é a solução elegante para recursão profunda em linguagens sem TCO. Mencionar que JavaScript tem TCO no spec (ES2015) mas V8 não implementa completamente — por isso trampolining é necessário na prática.",
    },
    {
      level: "pleno",
      q: "Qual a diferença entre Buffer.alloc() e Buffer.allocUnsafe() no Node.js?",
      a: "<p><code>Buffer.alloc(size)</code>: aloca buffer de N bytes e <strong>inicializa com zeros</strong>. Seguro — não expõe memória de processos anteriores. Ligeiramente mais lento pelo zeroing.</p><p><code>Buffer.allocUnsafe(size)</code>: aloca buffer sem inicializar. Memória contém dados arbitrários de alocações anteriores (inclusive de outros processos no passado do OS). Mais rápido — sem zeroing.</p><p><strong>Quando usar cada:</strong></p><ul><li><code>alloc()</code>: quando o buffer vai para resposta HTTP, ser enviado ao cliente, ou conteúdo não for imediatamente sobrescrito</li><li><code>allocUnsafe()</code>: apenas quando vai sobrescrever TODOS os bytes antes de usar (ex: escrever um arquivo, serialização completa)</li></ul><p><strong>Perigo de segurança:</strong> usar allocUnsafe e depois enviar antes de preencher completamente pode vazar memória de outros processos no output — information disclosure vulnerability.</p>",
      tip: "Information disclosure via Buffer.allocUnsafe é uma vulnerabilidade real. Em produção, prefira alloc() por padrão e allocUnsafe() só com justificativa de performance e certeza de preenchimento completo.",
    },
    {
      level: "senior",
      q: "Como funciona o reference counting como estratégia de GC? Quais suas limitações?",
      a: "<p>Reference counting mantém um contador em cada objeto: quantas referências apontam para ele. Quando o contador chega a 0, o objeto é coletado imediatamente.</p><p><strong>Vantagens:</strong></p><ul><li>Coleta determinística — objeto liberado imediatamente quando não usado</li><li>Sem pausas Stop-The-World</li><li>Baixa latência</li></ul><p><strong>Limitação crítica — ciclos:</strong></p><pre><code>const a = { b: null }\nconst b = { a: null }\na.b = b  // a→b: contador de b = 1\nb.a = a  // b→a: contador de a = 1\n// Agora remove as variáveis\na = null // contador de A vai de 2 para 1 (b ainda aponta!)\nb = null // contador de B vai de 2 para 1 (a ainda aponta!)\n// Ciclo! Nem A nem B chegam a 0 — leak!</code></pre><p><strong>Solução:</strong> Python (CPython) usa reference counting + cycle detector periódico para ciclos. Swift usa ARC (Automatic Reference Counting) com regras de ownership para evitar ciclos (weak/unowned refs).</p>",
      tip: "JavaScript não usa reference counting exatamente por causa dos ciclos. Mark-and-sweep (V8) detecta ciclos naturalmente pois parte das roots e coleta tudo não alcançável, independente de ciclos.",
    },
    {
      level: "pleno",
      q: "Como setInterval e setTimeout causam leaks em SPAs e como corrigir?",
      a: "<p>Quando um componente cria um timer e não limpa ao desmontar, o callback continua rodando indefinidamente — e segura o escopo do componente (closures) em memória.</p><p><strong>Cenário de leak:</strong></p><pre><code>// React — SEM cleanup\nfunction Ticker() {\n  const [count, setCount] = useState(0)\n  useEffect(() => {\n    // ❌ Sem return de cleanup\n    setInterval(() => setCount(c => c + 1), 1000)\n    // Ao desmontar, interval continua rodando!\n    // setState em componente desmontado: warning\n    // Escopo do componente: preso em memória\n  }, [])\n  return <div>{count}</div>\n}\n\n// ✓ COM cleanup\nfunction Ticker() {\n  const [count, setCount] = useState(0)\n  useEffect(() => {\n    const id = setInterval(() => setCount(c => c + 1), 1000)\n    return () => clearInterval(id)  // cleanup ao desmontar\n  }, [])\n  return <div>{count}</div>\n}</code></pre>",
      tip: "Todo setInterval em React deve ter clearInterval no cleanup do useEffect. Todo setTimeout que pode rodar após unmount deve ser cancelado. Regra simples: se cria timer no useEffect, sempre retorne cleanup.",
    },
    {
      level: "senior",
      q: "Como comparar dois heap snapshots para identificar objetos com leak?",
      a: "<p>No Chrome DevTools (aba Memory):</p><ol><li>Tire o <strong>snapshot baseline</strong> (snapshot 1)</li><li>Execute a operação suspeita várias vezes (50-100 vezes)</li><li>Tire o <strong>snapshot comparativo</strong> (snapshot 2)</li><li>Na view de snapshot 2: mudar o dropdown de 'Summary' para <strong>'Comparison'</strong></li><li>Selecionar snapshot 1 como base</li><li>Ordenar por <strong>'Delta'</strong> (diferença de count) ou <strong>'Size Delta'</strong></li><li>Expandir objetos com delta positivo — esses não foram coletados</li><li>Clicar em um objeto para ver o <strong>Retainers tree</strong> — o caminho de referências que impede a coleta</li></ol><p><strong>Indicadores de leak:</strong></p><ul><li>Closure com escopo enorme no retainer path</li><li>Array ou Map crescendo (muitos Detached DOM Tree)</li><li>EventListener acumulando no mesmo elemento</li></ul>",
      tip: "O retainer path é o insight mais valioso — mostra exatamente qual variável/closure/estrutura está impedindo a coleta. Geralmente é um array push sem pop, ou Map.set sem delete.",
    },
  ],
  diagrams: [
    {
      title: "Stack vs Heap — Modelo Mental de Memória em JS/Node",
      html: `<style>
.mm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.mm-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.mm-sub{font-size:10px;color:#475569;margin:0 0 14px}
.mm-cols{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.mm-box{border-radius:8px;padding:12px;border:1.5px solid #334155}
.mm-box-title{font-size:10px;font-weight:700;text-transform:uppercase;margin-bottom:8px}
.mm-frame{border-radius:5px;padding:7px 10px;margin-bottom:4px;font-size:10px;line-height:1.5;font-family:'JetBrains Mono',monospace}
.mm-label{font-size:9px;font-weight:600;text-transform:uppercase;margin-bottom:4px;color:#475569}
.mm-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.mm-tip:hover .mm-tb{display:block}
.mm-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:210px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.mm-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
.mm-leaks{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px}
.mm-leaks-title{font-size:10px;font-weight:700;color:#ef4444;margin-bottom:8px}
.mm-leak{display:flex;gap:8px;font-size:10px;color:#94a3b8;margin-bottom:6px;line-height:1.5;align-items:flex-start}
.mm-leak-icon{color:#ef4444;flex-shrink:0;margin-top:1px}
.mm-leak-fix{color:#10B981;font-size:9px;margin-top:2px}
</style>
<div class="mm-wrap">
  <p class="mm-title">Stack vs Heap — modelo mental de memória em JS/Node</p>
  <p class="mm-sub">Passe o mouse nos termos para detalhes</p>
  <div class="mm-cols">
    <div class="mm-box" style="background:#1e293b;border-color:#10B98140">
      <div class="mm-box-title" style="color:#10B981">Stack <span style="color:#475569;font-weight:400;font-size:9px">— rápido, limitado (~8 MB)</span></div>
      <div class="mm-label">frames de chamada (LIFO)</div>
      <div class="mm-frame" style="background:#10B98115;color:#10B981;border:1px solid #10B98130">bar() → x=2, y=3</div>
      <div class="mm-frame" style="background:#10B98110;color:#86efac;border:1px solid #10B98120">foo() → n=10</div>
      <div class="mm-frame" style="background:#10B98108;color:#64748b;border:1px solid #10B98115">main() → result</div>
      <div style="font-size:9px;color:#475569;margin-top:8px;line-height:1.6">
        • <span class="mm-tip">Primitivos<span class="mm-tb">number, boolean, string pequena, null, undefined, symbol — armazenados por valor na stack.</span></span> e referências a objetos<br>
        • Liberado automaticamente ao retornar<br>
        • Overflow: recursão sem base case
      </div>
    </div>
    <div class="mm-box" style="background:#1e293b;border-color:#3b82f640">
      <div class="mm-box-title" style="color:#3b82f6">Heap <span style="color:#475569;font-weight:400;font-size:9px">— grande, gerenciado por GC</span></div>
      <div class="mm-label">objetos alocados dinamicamente</div>
      <div class="mm-frame" style="background:#3b82f615;color:#93c5fd;border:1px solid #3b82f630">{ id: 1, data: [...] }</div>
      <div class="mm-frame" style="background:#3b82f610;color:#6b95cd;border:1px solid #3b82f620">() =&gt; { closure ref }</div>
      <div class="mm-frame" style="background:#3b82f608;color:#475569;border:1px solid #3b82f615">[...array grande...]</div>
      <div style="font-size:9px;color:#475569;margin-top:8px;line-height:1.6">
        • <span class="mm-tip">GC generacional<span class="mm-tb">V8: objetos jovens ficam no "young space" (Scavenger GC frequente). Se sobrevivem 2 GCs, vão para "old space" (Mark-Sweep-Compact, mais raro).</span></span> (V8: young → old)<br>
        • Leak = referência desnecessária mantida<br>
        • Debug: heap snapshot no DevTools
      </div>
    </div>
  </div>
  <div class="mm-leaks">
    <div class="mm-leaks-title">Causas mais comuns de memory leak em JS</div>
    <div class="mm-leak">
      <div class="mm-leak-icon">▸</div>
      <div>
        <strong style="color:#e2e8f0">Event listener não removido</strong> — elemento sai do DOM mas handler tem closure capturando objetos grandes.<br>
        <div class="mm-leak-fix">✓ removeEventListener no cleanup / useEffect return</div>
      </div>
    </div>
    <div class="mm-leak">
      <div class="mm-leak-icon">▸</div>
      <div>
        <strong style="color:#e2e8f0">setInterval sem clearInterval</strong> — em SPA, handler vivo segura todo o escopo capturado.<br>
        <div class="mm-leak-fix">✓ clearInterval no unmount do componente</div>
      </div>
    </div>
    <div class="mm-leak">
      <div class="mm-leak-icon">▸</div>
      <div>
        <strong style="color:#e2e8f0">Cache global sem LRU/TTL</strong> — Map ou objeto crescendo sem limite em módulo singleton.<br>
        <div class="mm-leak-fix">✓ Use LRU-cache com tamanho máximo</div>
      </div>
    </div>
    <div class="mm-leak">
      <div class="mm-leak-icon">▸</div>
      <div>
        <strong style="color:#e2e8f0">Closure capturando contexto grande</strong> — factory cria muitas funções, cada uma retém o escopo inteiro do módulo.<br>
        <div class="mm-leak-fix">✓ Use WeakMap para associar dados a objetos sem prender referências</div>
      </div>
    </div>
  </div>
</div>`,
      caption: "Para debugar leak em produção: tire 3 heap snapshots (início, após uso, após mais uso) e compare os objetos que crescem. O painel 'Retainers' mostra quem está segurando a referência.",
    },
    {
      title: "V8 GC Generacional — Young Space e Old Space",
      html: `<style>
.mm2-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.mm2-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.mm2-sub{font-size:10px;color:#475569;margin:0 0 14px}
.mm2-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:8px;align-items:center;margin-bottom:12px}
.mm2-space{background:#1e293b;border-radius:8px;padding:12px;border:1.5px solid #334155}
.mm2-s-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #334155}
.mm2-detail{font-size:10px;color:#94a3b8;line-height:1.6;margin-bottom:4px}
.mm2-arrow{font-size:18px;color:#334155;text-align:center;padding:0 4px}
.mm2-gc-box{background:#1e293b;border-radius:8px;padding:12px;border:1px solid #334155}
.mm2-gc-title{font-size:10px;font-weight:700;color:#f59e0b;margin-bottom:8px}
.mm2-gc-row{display:flex;gap:8px;font-size:10px;color:#94a3b8;margin-bottom:5px;line-height:1.5;align-items:flex-start}
.mm2-gc-key{font-weight:700;min-width:110px;white-space:nowrap}
</style>
<div class="mm2-wrap">
  <p class="mm2-title">V8 GC — Ciclo de Vida de Objetos (Generacional)</p>
  <p class="mm2-sub">Hipótese generacional: maioria dos objetos morre jovem. V8 explora isso.</p>
  <div class="mm2-flow">
    <div class="mm2-space" style="border-color:#10B98140">
      <div class="mm2-s-title" style="color:#10B981">Young Space (Semi-space)</div>
      <div class="mm2-detail">• Tamanho: ~1-8MB (configurável)</div>
      <div class="mm2-detail">• GC: Scavenger (Minor GC)</div>
      <div class="mm2-detail">• Frequência: a cada ~1MB alocado</div>
      <div class="mm2-detail">• Algoritmo: Cheney copying</div>
      <div class="mm2-detail" style="color:#10B981">→ Maioria dos objetos morre aqui</div>
    </div>
    <div class="mm2-arrow">→<br><span style="font-size:10px;color:#10B981">sobrevive<br>2 GCs</span></div>
    <div class="mm2-space" style="border-color:#3b82f640">
      <div class="mm2-s-title" style="color:#3b82f6">Old Space</div>
      <div class="mm2-detail">• Tamanho: maior (~256MB-4GB)</div>
      <div class="mm2-detail">• GC: Mark-Sweep-Compact (Major GC)</div>
      <div class="mm2-detail">• Frequência: raro (baixa pressão)</div>
      <div class="mm2-detail">• Concurrent marking (Orinoco)</div>
      <div class="mm2-detail" style="color:#3b82f6">→ Objetos de longa duração</div>
    </div>
    <div class="mm2-arrow">→<br><span style="font-size:10px;color:#ef4444">não<br>alcançável</span></div>
    <div class="mm2-space" style="border-color:#ef444430">
      <div class="mm2-s-title" style="color:#ef4444">Coletado</div>
      <div class="mm2-detail">• Memória liberada</div>
      <div class="mm2-detail">• Bloco disponível para novas alocações</div>
      <div class="mm2-detail">• Compact: elimina fragmentação</div>
      <div class="mm2-detail" style="color:#ef4444">→ GC não pode ser 'errado'</div>
    </div>
  </div>
  <div class="mm2-gc-box">
    <div class="mm2-gc-title">Fases do Major GC (Mark-Sweep-Compact)</div>
    <div class="mm2-gc-row"><span class="mm2-gc-key" style="color:#10B981">1. Mark</span><span>Traça grafo de referências a partir das roots. Tri-color: branco (não visitado), cinza (em progresso), preto (completo). Roda incrementalmente e concorrentemente.</span></div>
    <div class="mm2-gc-row"><span class="mm2-gc-key" style="color:#3b82f6">2. Sweep</span><span>Libera blocos de objetos brancos (não alcançáveis). Não move objetos — rápido mas deixa fragmentação.</span></div>
    <div class="mm2-gc-row"><span class="mm2-gc-key" style="color:#f59e0b">3. Compact</span><span>Move objetos pretos para espaço contíguo. Elimina fragmentação. Stop-The-World mas raro. Atualiza todos os ponteiros.</span></div>
    <div class="mm2-gc-row"><span class="mm2-gc-key" style="color:#a78bfa">Write barrier</span><span>Garante que novas refs criadas durante marking concorrente são capturadas — sem perder objetos vivos.</span></div>
  </div>
</div>`,
      caption: "Objetos em módulo singleton (caches, registros) vão para o old space e nunca saem. Por isso LRU/WeakMap são essenciais: garantem que referências antigas deixam de existir no old space.",
    },
    {
      title: "WeakMap vs Map — Diferença de Retenção para o GC",
      html: `<style>
.mm3-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.mm3-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.mm3-sub{font-size:10px;color:#475569;margin:0 0 14px}
.mm3-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.mm3-box{background:#1e293b;border-radius:8px;padding:12px}
.mm3-b-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #334155}
.mm3-code{background:#0f172a;border-radius:6px;padding:8px 10px;font-family:'JetBrains Mono',monospace;font-size:10px;line-height:1.8;color:#94a3b8;margin-bottom:8px}
.mm3-point{display:flex;gap:6px;font-size:10px;color:#94a3b8;margin-bottom:4px;line-height:1.5;align-items:flex-start}
.mm3-use{background:#1e293b;border-radius:8px;padding:12px;border:1px solid #334155}
.mm3-u-title{font-size:10px;font-weight:700;color:#f59e0b;margin-bottom:8px}
.mm3-u-row{display:flex;gap:8px;font-size:10px;color:#94a3b8;margin-bottom:5px;line-height:1.6;align-items:flex-start}
</style>
<div class="mm3-wrap">
  <p class="mm3-title">Map vs WeakMap — Impacto no Garbage Collection</p>
  <p class="mm3-sub">A diferença crítica: Map segura keys fortemente; WeakMap deixa o GC coletar</p>
  <div class="mm3-grid">
    <div class="mm3-box" style="border:1.5px solid #ef444430">
      <div class="mm3-b-title" style="color:#ef4444">Map — referência FORTE</div>
      <div class="mm3-code">const cache = new Map()
let domNode = document.getElementById('x')
cache.set(domNode, { w: 100, h: 200 })

// Elemento removido do DOM:
domNode.remove()
domNode = null

// ❌ Map ainda segura o node!
// GC não pode coletar — leak!</div>
      <div class="mm3-point"><span style="color:#ef4444">✗</span><span>Map mantém strong ref para key</span></div>
      <div class="mm3-point"><span style="color:#ef4444">✗</span><span>Objeto vive enquanto Map viver</span></div>
      <div class="mm3-point"><span style="color:#22c55e">✓</span><span>Iterável (keys(), values(), forEach)</span></div>
      <div class="mm3-point"><span style="color:#22c55e">✓</span><span>Primitivos como keys (string, number)</span></div>
    </div>
    <div class="mm3-box" style="border:1.5px solid #10B98140">
      <div class="mm3-b-title" style="color:#10B981">WeakMap — referência FRACA</div>
      <div class="mm3-code">const cache = new WeakMap()
let domNode = document.getElementById('x')
cache.set(domNode, { w: 100, h: 200 })

// Elemento removido do DOM:
domNode.remove()
domNode = null

// ✓ GC pode coletar o node!
// Entry some do WeakMap automaticamente</div>
      <div class="mm3-point"><span style="color:#10B981">✓</span><span>GC pode coletar key sem outra ref forte</span></div>
      <div class="mm3-point"><span style="color:#10B981">✓</span><span>Entry some automaticamente com a key</span></div>
      <div class="mm3-point"><span style="color:#ef4444">✗</span><span>Não iterável (não dá para listar)</span></div>
      <div class="mm3-point"><span style="color:#ef4444">✗</span><span>Apenas objetos como keys</span></div>
    </div>
  </div>
  <div class="mm3-use">
    <div class="mm3-u-title">Casos de uso de WeakMap</div>
    <div class="mm3-u-row"><span style="color:#10B981;font-weight:700;min-width:130px">Metadados de DOM</span><span>Associar measurements/state a DOM nodes sem prevenir GC quando removidos</span></div>
    <div class="mm3-u-row"><span style="color:#10B981;font-weight:700;min-width:130px">Private fields</span><span>Dados privados de classe antes de #private: const _priv = new WeakMap()</span></div>
    <div class="mm3-u-row"><span style="color:#10B981;font-weight:700;min-width:130px">Memoização</span><span>Cache de cálculos por objeto: quando objeto some, cache some junto</span></div>
    <div class="mm3-u-row"><span style="color:#10B981;font-weight:700;min-width:130px">Listeners por obj</span><span>Rastrear listeners por elemento sem prevenir coleta do elemento</span></div>
  </div>
</div>`,
      caption: "Regra de ouro: se os dados devem 'morrer junto com o objeto', use WeakMap. Se precisar iterar ou usar primitivos como chave, use Map mas garanta cleanup manual (delete ou LRU).",
    },
  ],
  cheatsheet: {
    title: "Cheatsheet — Memory Management em JS/Node",
    html: `<style>
.mmcs-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.mmcs-title{font-size:13px;font-weight:700;color:#10B981;margin:0 0 14px;padding-bottom:8px;border-bottom:2px solid #10B98130}
.mmcs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.mmcs-section{background:#1e293b;border-radius:8px;padding:12px}
.mmcs-s-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #334155}
.mmcs-item{display:flex;gap:6px;font-size:10px;color:#94a3b8;margin-bottom:5px;line-height:1.6;align-items:flex-start}
.mmcs-code{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:4px;padding:1px 5px;font-size:9px;color:#34d399}
</style>
<div class="mmcs-wrap">
  <div class="mmcs-title">Memory Management — Referência Rápida</div>
  <div class="mmcs-grid">
    <div class="mmcs-section">
      <div class="mmcs-s-title" style="color:#10B981">Stack vs Heap</div>
      <div class="mmcs-item"><span style="color:#10B981">▸</span><span>Stack: frames LIFO, primitivos, refs. Max 1-8MB</span></div>
      <div class="mmcs-item"><span style="color:#10B981">▸</span><span>Heap: objetos. Gerenciado por GC (JS) ou manual (C)</span></div>
      <div class="mmcs-item"><span style="color:#10B981">▸</span><span>Stack overflow = recursão profunda</span></div>
      <div class="mmcs-item"><span style="color:#10B981">▸</span><span>OOM = heap cheio (leak ou carga real)</span></div>
    </div>
    <div class="mmcs-section">
      <div class="mmcs-s-title" style="color:#3b82f6">V8 GC</div>
      <div class="mmcs-item"><span style="color:#3b82f6">▸</span><span>Young space: Scavenger, frequente, ~1-8MB</span></div>
      <div class="mmcs-item"><span style="color:#3b82f6">▸</span><span>Old space: Mark-Sweep-Compact, raro</span></div>
      <div class="mmcs-item"><span style="color:#3b82f6">▸</span><span>Orinoco: concurrent marking (sem Stop-the-World)</span></div>
      <div class="mmcs-item"><span style="color:#3b82f6">▸</span><span>Sobrevive 2 Minor GCs → promovido ao old</span></div>
    </div>
    <div class="mmcs-section">
      <div class="mmcs-s-title" style="color:#ef4444">Leaks Comuns (JS)</div>
      <div class="mmcs-item"><span style="color:#ef4444">✗</span><span>Listener sem removeEventListener</span></div>
      <div class="mmcs-item"><span style="color:#ef4444">✗</span><span>setInterval sem clearInterval (SPA)</span></div>
      <div class="mmcs-item"><span style="color:#ef4444">✗</span><span>Cache global sem LRU/TTL</span></div>
      <div class="mmcs-item"><span style="color:#ef4444">✗</span><span>DOM detached referenciado por JS</span></div>
      <div class="mmcs-item"><span style="color:#ef4444">✗</span><span>Promise pendurada (nunca resolve)</span></div>
    </div>
    <div class="mmcs-section">
      <div class="mmcs-s-title" style="color:#f59e0b">WeakRef Tools</div>
      <div class="mmcs-item"><span style="color:#f59e0b">▸</span><span><span class="mmcs-code">WeakMap</span>: dados por objeto, coleta junto</span></div>
      <div class="mmcs-item"><span style="color:#f59e0b">▸</span><span><span class="mmcs-code">WeakSet</span>: presença de obj, não retém</span></div>
      <div class="mmcs-item"><span style="color:#f59e0b">▸</span><span><span class="mmcs-code">WeakRef</span>: ref fraca, deref() pode ser null</span></div>
      <div class="mmcs-item"><span style="color:#f59e0b">▸</span><span><span class="mmcs-code">FinalizationRegistry</span>: callback no GC</span></div>
    </div>
    <div class="mmcs-section">
      <div class="mmcs-s-title" style="color:#22c55e">Debug de Leak</div>
      <div class="mmcs-item"><span style="color:#22c55e">▸</span><span>3 snapshots: baseline, uso, mais uso</span></div>
      <div class="mmcs-item"><span style="color:#22c55e">▸</span><span>Comparison view → delta crescente</span></div>
      <div class="mmcs-item"><span style="color:#22c55e">▸</span><span>Retainers tree: quem segura o objeto?</span></div>
      <div class="mmcs-item"><span style="color:#22c55e">▸</span><span>clinic heap / heapdump para Node</span></div>
    </div>
    <div class="mmcs-section">
      <div class="mmcs-s-title" style="color:#a78bfa">Performance</div>
      <div class="mmcs-item"><span style="color:#a78bfa">▸</span><span>Object pooling: reutilize em vez de criar</span></div>
      <div class="mmcs-item"><span style="color:#a78bfa">▸</span><span>Buffer.alloc() vs allocUnsafe (segurança!)</span></div>
      <div class="mmcs-item"><span style="color:#a78bfa">▸</span><span>Evitar deep clone no hot path</span></div>
      <div class="mmcs-item"><span style="color:#a78bfa">▸</span><span>perf_hooks GC observer para medir pausas</span></div>
    </div>
  </div>
</div>`,
    caption: "Leak = referência alcançável mas inútil. GC nunca erra — só libera inalcançável. Se cresce sem parar, há referência desnecessária em algum lugar (event listener, cache, closure, timer).",
  },
  mindmap: {
    title: "Mind Map — Memory Management",
    html: `<style>
.mmmm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.mmmm-title{font-size:13px;font-weight:700;color:#10B981;margin:0 0 14px;text-align:center}
.mmmm-center{display:flex;justify-content:center;margin-bottom:16px}
.mmmm-root{background:#10B98120;border:2px solid #10B981;border-radius:10px;padding:8px 20px;font-size:13px;font-weight:700;color:#10B981}
.mmmm-branches{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.mmmm-branch{background:#1e293b;border-radius:8px;padding:12px;border:1.5px solid #334155}
.mmmm-b-title{font-size:11px;font-weight:700;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #334155}
.mmmm-leaf{font-size:10px;color:#94a3b8;margin-bottom:4px;line-height:1.6;display:flex;gap:6px;align-items:flex-start}
.mmmm-dot{font-weight:700;margin-top:1px}
</style>
<div class="mmmm-wrap">
  <p class="mmmm-title">Mapa Mental — Memory Management</p>
  <div class="mmmm-center">
    <div class="mmmm-root">Memory Management</div>
  </div>
  <div class="mmmm-branches">
    <div class="mmmm-branch" style="border-color:#10B98130">
      <div class="mmmm-b-title" style="color:#10B981">Stack vs Heap</div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#10B981">▸</span><span>Stack: LIFO, frames, rápida, 1-8MB</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#10B981">▸</span><span>Heap: objetos, GC, fragmentação</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#10B981">▸</span><span>Stack overflow: recursão profunda</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#10B981">▸</span><span>OOM: heap cheio</span></div>
    </div>
    <div class="mmmm-branch" style="border-color:#3b82f630">
      <div class="mmmm-b-title" style="color:#3b82f6">GC Strategies</div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#3b82f6">▸</span><span>Mark-and-sweep (V8 old space)</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#3b82f6">▸</span><span>Generacional (young/old)</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#3b82f6">▸</span><span>Reference counting (Python, Swift)</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#3b82f6">▸</span><span>Ownership (Rust — sem GC)</span></div>
    </div>
    <div class="mmmm-branch" style="border-color:#ef444430">
      <div class="mmmm-b-title" style="color:#ef4444">Memory Leaks</div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#ef4444">▸</span><span>Listeners não removidos</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#ef4444">▸</span><span>Timers sem cleanup</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#ef4444">▸</span><span>Cache sem LRU/TTL</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#ef4444">▸</span><span>Closures capturando demais</span></div>
    </div>
    <div class="mmmm-branch" style="border-color:#f59e0b30">
      <div class="mmmm-b-title" style="color:#f59e0b">Weak References</div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#f59e0b">▸</span><span>WeakMap: dados por objeto</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#f59e0b">▸</span><span>WeakRef: ref que pode ser null</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#f59e0b">▸</span><span>FinalizationRegistry</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#f59e0b">▸</span><span>LRU Cache (Map com limite)</span></div>
    </div>
    <div class="mmmm-branch" style="border-color:#22c55e30">
      <div class="mmmm-b-title" style="color:#22c55e">Debug Tools</div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#22c55e">▸</span><span>Chrome DevTools → Memory tab</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#22c55e">▸</span><span>Heap snapshot comparison</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#22c55e">▸</span><span>v8.writeHeapSnapshot()</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#22c55e">▸</span><span>clinic heap / heapdump</span></div>
    </div>
    <div class="mmmm-branch" style="border-color:#a78bfa30">
      <div class="mmmm-b-title" style="color:#a78bfa">Otimização</div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#a78bfa">▸</span><span>Object pooling (reutilizar)</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#a78bfa">▸</span><span>Evitar deep clone no hot path</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#a78bfa">▸</span><span>Buffer.allocUnsafe + fill completo</span></div>
      <div class="mmmm-leaf"><span class="mmmm-dot" style="color:#a78bfa">▸</span><span>Monitorar com perf_hooks GC</span></div>
    </div>
  </div>
</div>`,
    caption: "Leak = objeto alcançável mas inútil. O GC não erra — só libera inalcançável. Se memória cresce sem platô, há referência inútil mantida por closure, cache ou listener.",
  },
  mnemonics: [
    {
      label: "Leak: 'CACT — Closure, Array, Cache, Timer'",
      trick: "CACT — as 4 principais fontes de leak em JS",
      explanation: "Closure capturando escopo grande, Array/Map crescendo sem limite, Cache sem LRU/TTL, Timer (setInterval/setTimeout) sem clearInterval/clearTimeout. Se lembra CACT, lembra as 4 causas mais comuns de memory leak em JavaScript.",
    },
    {
      label: "GC generacional: 'Jovens Morrem Cedo, Velhos Sobrevivem'",
      trick: "JMC-VS: Jovens Morrem Cedo → Velhos Sobrevivem",
      explanation: "Hipótese generacional: a maioria dos objetos morre jovem (JMC). Os que sobrevivem 2 GCs são promovidos ao old space (VS). O V8 explota isso — Scavenger GC frequente no young space (barato, maioria morre), Major GC raro no old space.",
    },
    {
      label: "WeakMap vs Map: 'Weak deixa ir, Map segura'",
      trick: "W=vai, M=fica",
      explanation: "WeakMap deixa o GC levar o objeto quando não há outra referência (Weak = vai). Map segura a referência à chave fortemente (Map = fica). Quando seu dado deve 'morrer com o objeto', use Weak. Quando precisa iterar ou garantir que exista, use Map com cleanup manual.",
    },
    {
      label: "Debug de leak: '3S — Snapshot, Span, Suspect'",
      trick: "3S: Snapshot baseline → Span (usar) → Snapshot comparativo → Suspect (delta positivo)",
      explanation: "Snapshot 1 (baseline antes do uso). Span: executar a operação suspeita N vezes. Snapshot 2. Compare usando Comparison view — objetos com delta crescente são suspects. Retainers tree mostra quem segura o suspect.",
    },
    {
      label: "Reachability: 'Raiz até Objeto — sem caminho, sem vida'",
      trick: "RO: Raiz→Objeto (sem caminho = morto para o GC)",
      explanation: "GC parte das roots (globais, call stack) e traça todos os objetos alcançáveis seguindo referências. Qualquer objeto sem caminho até uma root é inalcançável e pode ser coletado. Leak = objeto com caminho até root mas inútil (referência esquecida).",
    },
  ],
  exercises: [
    {
      level: "iniciante",
      title: "Identificar e corrigir leak com timer em React",
      description: "Crie um componente React que exibe um contador incrementado a cada segundo via setInterval. Primeiro sem cleanup (observe o warning de setState em componente desmontado). Depois adicione o cleanup correto no return do useEffect. Use o React DevTools para verificar que o timer para ao desmontar.",
      concepts: ["setInterval", "clearInterval", "useEffect cleanup", "memory leak", "React lifecycle"],
    },
    {
      level: "intermediario",
      title: "Implementar LRU Cache com WeakMap",
      description: "Implemente uma função `memoize(fn, maxSize)` que faz memoização de funções que recebem objetos. Use WeakMap para cache por objeto (keys são os argumentos-objeto) e LRU para limitar o tamanho máximo quando primitivos são usados como parte da chave. Escreva testes para: hit de cache, eviction LRU, que objetos são coletáveis quando não há outras refs.",
      concepts: ["WeakMap", "LRU", "memoização", "GC", "closure", "object reference"],
    },
    {
      level: "intermediario",
      title: "Debugging de heap leak com snapshots",
      description: "Escreva um script Node.js com um leak intencional (ex: array global crescendo a cada request para um servidor HTTP Express). Use `node --inspect` e Chrome DevTools para tirar 3 snapshots, identificar o objeto causando o leak via Comparison view, e corrija usando LRU ou limpeza periódica. Inclua o before/after do código.",
      concepts: ["heap snapshot", "Chrome DevTools", "retainers", "node --inspect", "comparison view"],
    },
    {
      level: "senior",
      title: "Object Pool para Buffer de Alta Performance",
      description: "Implemente um `BufferPool` em TypeScript para um servidor HTTP que processa uploads. O pool deve: pré-alocar N buffers de tamanho configurável com Buffer.allocUnsafe, fornecer acquire() que bloqueia se pool vazio (via Promise), release() que devolve o buffer (zerando conteúdo com fill(0)), métricas de hits/misses/waits. Compare throughput e GC pressure com e sem o pool usando autocannon.",
      concepts: ["object pooling", "Buffer.allocUnsafe", "GC pressure", "high performance", "Promise queue", "benchmark"],
    },
    {
      level: "senior",
      title: "Monitor de Memory Leak com PerformanceObserver",
      description: "Crie uma utility em Node.js que: monitora `process.memoryUsage().heapUsed` a cada 30 segundos, detecta crescimento contínuo (sem platô em 5 medições consecutivas), emite alerta com stack trace sintético de onde a memória foi alocada usando `--track-heap-objects`, e gera heap snapshot automático ao detectar leak acima de threshold configurável.",
      concepts: ["PerformanceObserver", "heapUsed", "v8.writeHeapSnapshot", "leak detection", "monitoring", "threshold alert"],
    },
  ],
  codeExamples: [
    {
      title: "LRU Cache em JavaScript — O(1) com Map",
      language: "typescript",
      code: `class LRUCache<K, V> {
  private map = new Map<K, V>()

  constructor(private readonly max: number) {}

  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined
    // Promove para o final (mais recente) via delete + set
    const val = this.map.get(key)!
    this.map.delete(key)
    this.map.set(key, val)
    return val
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key)  // remove para reinserir no final
    } else if (this.map.size >= this.max) {
      // Remove o primeiro item (menos recente)
      // Map mantém ordem de inserção
      const oldest = this.map.keys().next().value!
      this.map.delete(oldest)
    }
    this.map.set(key, value)
  }

  get size() { return this.map.size }
  has(key: K) { return this.map.has(key) }
}

// Uso em cache de API com TTL combinado
const apiCache = new LRUCache<string, { data: unknown; ts: number }>(100)

function getCachedData(url: string, ttlMs = 60_000) {
  const cached = apiCache.get(url)
  if (cached && Date.now() - cached.ts < ttlMs) {
    return cached.data  // hit — sem rede
  }
  // Fetch real — será armazenado ao retornar
  return null
}`,
    },
    {
      title: "WeakMap para Dados Privados e Cache sem Leak",
      language: "typescript",
      code: `// ── Padrão 1: Dados privados de instância ────────────────────────────────────
const _private = new WeakMap<object, { token: string; expiry: number }>()

class AuthSession {
  constructor(token: string) {
    // Dados privados: não acessíveis fora da classe
    // WeakMap: quando a instância for coletada, dados vão junto
    _private.set(this, { token, expiry: Date.now() + 3600_000 })
  }

  isValid(): boolean {
    const data = _private.get(this)!
    return Date.now() < data.expiry
  }

  getToken(): string {
    return _private.get(this)!.token
  }
}

// ── Padrão 2: Cache de DOM sem prevenir GC ────────────────────────────────────
const domMetrics = new WeakMap<Element, { width: number; height: number; ts: number }>()

function getElementMetrics(el: Element) {
  const cached = domMetrics.get(el)
  if (cached && Date.now() - cached.ts < 1000) return cached

  const { width, height } = el.getBoundingClientRect()
  const metrics = { width, height, ts: Date.now() }
  domMetrics.set(el, metrics)  // quando el for removido do DOM e GC'd, entry some
  return metrics
}

// ── Padrão 3: WeakRef para cache que pode ser evictado ────────────────────────
class OptionalCache<T extends object> {
  private cache = new Map<string, WeakRef<T>>()

  set(key: string, value: T) {
    this.cache.set(key, new WeakRef(value))
  }

  get(key: string): T | undefined {
    const ref = this.cache.get(key)
    if (!ref) return undefined
    const val = ref.deref()
    if (!val) {
      this.cache.delete(key)  // limpa referência morta
      return undefined
    }
    return val
  }
}`,
    },
    {
      title: "Monitor de Heap e Detecção de Leak em Node.js",
      language: "typescript",
      code: `import v8 from 'v8'
import { PerformanceObserver } from 'perf_hooks'

// ── Monitorar GC pauses com PerformanceObserver ────────────────────────────────
const gcObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    const gcEntry = entry as PerformanceEntry & { detail?: { kind: number } }
    const kind = gcEntry.detail?.kind ?? 0
    const kindName = kind === 1 ? 'Minor' : kind === 2 ? 'Major' : kind === 4 ? 'Incremental' : 'Weak'
    console.log(\`GC \${kindName}: \${entry.duration.toFixed(2)}ms\`)
    if (entry.duration > 100) {
      console.warn('GC pause longa detectada — possível pressão de memória')
    }
  }
})
gcObserver.observe({ entryTypes: ['gc'] })

// ── Detector de leak por crescimento contínuo ──────────────────────────────────
class LeakDetector {
  private samples: number[] = []
  private readonly window = 5   // amostras consecutivas para detectar leak
  private readonly threshold = 0.1  // crescimento de 10% por amostra = suspeito

  check(): 'stable' | 'growing' | 'leak' {
    const { heapUsed } = process.memoryUsage()
    this.samples.push(heapUsed)
    if (this.samples.length > this.window) this.samples.shift()
    if (this.samples.length < this.window) return 'stable'

    // Verifica se cada amostra é >= anterior
    const alwaysGrowing = this.samples.every((v, i) =>
      i === 0 || v >= this.samples[i - 1]
    )
    const totalGrowth = (this.samples.at(-1)! - this.samples[0]) / this.samples[0]

    if (alwaysGrowing && totalGrowth > this.threshold) return 'leak'
    if (totalGrowth > 0) return 'growing'
    return 'stable'
  }

  snapshot() {
    const filename = v8.writeHeapSnapshot()
    console.log('Heap snapshot salvo:', filename)
    return filename
  }
}

const detector = new LeakDetector()
setInterval(() => {
  const status = detector.check()
  const mb = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)
  console.log(\`Heap: \${mb}MB — \${status}\`)
  if (status === 'leak') {
    console.error('Possível memory leak detectado!')
    detector.snapshot()  // salva automaticamente para análise
  }
}, 30_000)`,
    },
    {
      title: "Cleanup Pattern — Abortando Fetch e Timers em React",
      language: "typescript",
      code: `import { useEffect, useState } from 'react'

// ── Padrão completo de cleanup em useEffect ────────────────────────────────────
function useUserData(userId: string) {
  const [data, setData] = useState<unknown>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // AbortController cancela o fetch se o componente desmontar
    const controller = new AbortController()
    let cancelled = false  // guard adicional para setState após unmount

    async function load() {
      try {
        setLoading(true)
        const res = await fetch(\`/api/users/\${userId}\`, {
          signal: controller.signal  // cancela automaticamente
        })
        const json = await res.json()
        if (!cancelled) {  // double-check após await
          setData(json)
          setError(null)
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        if (!cancelled) setError(err as Error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    // Cleanup: cancela fetch em curso e marca como cancelado
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [userId])  // re-executa quando userId muda

  return { data, error, loading }
}

// ── Padrão com subscription (RxJS/Observable) ─────────────────────────────────
function useObservable<T>(observable$: { subscribe: (fn: (v: T) => void) => { unsubscribe: () => void } }) {
  const [value, setValue] = useState<T | null>(null)

  useEffect(() => {
    const sub = observable$.subscribe(setValue)
    return () => sub.unsubscribe()  // cleanup ao desmontar
  }, [observable$])

  return value
}`,
    },
  ],
  videos: [
    { title: "JavaScript Memory Management Masterclass", channel: "Fireship", url: "https://www.youtube.com/watch?v=LaxbdIyBkL0" },
    { title: "V8 Garbage Collector — How it Works", channel: "Google Chrome Developers", url: "https://www.youtube.com/watch?v=v9vPonmEBjQ" },
    { title: "Node.js Memory Leaks — Finding and Fixing", channel: "Node.js Foundation", url: "https://www.youtube.com/watch?v=hliOMEQRqf8" },
    { title: "JavaScript Memory — V8 Deep Dive", channel: "JSConf", url: "https://www.youtube.com/watch?v=ZRtAfHpaaliQ" },
    { title: "Garbage Collection in Programming Languages", channel: "Computerphile", url: "https://www.youtube.com/watch?v=iKXfWv2VDN4" },
  ],
  resources: [
    { title: "V8 blog — Trash talk (Orinoco GC)", url: "https://v8.dev/blog/trash-talk", kind: "artigo" },
    { title: "MDN — Memory Management in JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management", kind: "docs" },
    { title: "Chrome DevTools — Memory Profiling", url: "https://developer.chrome.com/docs/devtools/memory", kind: "docs" },
    { title: "Node.js Diagnostics — Heap Snapshots", url: "https://nodejs.org/en/learn/diagnostics/memory/using-heap-snapshot", kind: "docs" },
    { title: "Brendan Gregg — Memory Profiling and Flamegraphs", url: "https://www.brendangregg.com/memoryflamegraphs.html", kind: "artigo" },
    { title: "Node Clinic.js — Diagnosing Memory Issues", url: "https://clinicjs.org/heap/", kind: "pratica" },
    { title: "WeakRef e FinalizationRegistry — V8 blog", url: "https://v8.dev/features/weak-references", kind: "artigo" },
    { title: "JavaScript V8 engine internals — Franziska Hinkelmann", url: "https://slides.com/franziskahinkelmann/js-engines-workshop", kind: "artigo" },
  ],
}

export default memoryManagement
