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

// ── Paleta Memory Management ──────────────────────────────────────────────────
const C    = '#10b981'  // emerald
const BLU  = '#3b82f6'
const AMB  = '#f59e0b'
const RED  = '#ef4444'
const PRP  = '#a78bfa'
const SKY  = '#38bdf8'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre gerenciamento de memória',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: stack vs heap, GC generacional (young/old space, Scavenger, Mark-Sweep-Compact, Orinoco), reachability, leaks em JS/SPA (listeners, timers, closures, DOM detached), WeakMap/WeakRef, object pooling, heap snapshots, stack overflow, Rust ownership/RAII e reference counting com ciclos.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam gerenciamento de memória na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'SHGR para Stack vs Heap, LTCD para os 4 leaks mais comuns em JS/SPA (Listener, Timer, Cache, DOM detached), Jovem-Sobrevive-Promovido para GC generacional, Mark-Sweep-Compact em 3 passos e WeakMap = GC Friendly.',
    icon: '02',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'GC, leaks e debugging numa folha de referência',
    type: 'cheatsheet',
    pages: 3,
    description: 'Stack vs heap; GC generacional V8 (young/old, Scavenger, MSC, Orinoco); leaks mais comuns e fixes (listener, timer, cache, closure, DOM detached); WeakMap vs Map; Buffer.alloc vs allocUnsafe; heap snapshot workflow.',
    icon: '03',
    goal: 'Consulta rápida',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Gerenciamento de memória do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 6 ramos: Stack/Heap, GC Generacional, Leaks em JS, Ferramentas de Debug, WeakMap/WeakRef/Pool e Rust Ownership. Inclui checklist de auto-avaliação pré-entrevista.',
    icon: '04',
    goal: 'Mapeamento mental',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual a diferença entre stack e heap?',
    a: '<strong>Stack</strong>: frames de função em LIFO. Crescimento automático a cada chamada, liberação automática ao retornar. Rápida (simples ponteiro de pilha). Tamanho pequeno (~1-8MB). Armazena primitivos e referências (ponteiros) para objetos. Stack overflow = recursão muito profunda. <strong>Heap</strong>: pool maior para objetos dinâmicos. Em linguagens managed (JS, Java), gerenciado pelo GC. Em C/C++, gerenciado manualmente. Mais lento por busca e fragmentação.',
    tip: 'Mencione que referências (ponteiros) ficam na stack, mas os objetos em si ficam no heap. Isso explica por que closures capturam objetos — elas seguram a referência na stack que aponta para o heap.',
  },
  {
    level: 'Pleno',
    q: 'O que causa memory leak em SPA?',
    a: 'Causas mais comuns: (1) <strong>Listeners não removidos</strong>: addEventListener sem removeEventListener quando componente desmonta. (2) <strong>Timers ativos</strong>: setInterval/setTimeout após unmount — segura todo o escopo. (3) <strong>Cache global sem LRU/TTL</strong>: Map em singleton crescendo sem limite. (4) <strong>DOM detached</strong>: elemento removido do DOM mas referenciado por variável JS. (5) <strong>Subscriptions não canceladas</strong>: RxJS, EventEmitter sem unsubscribe.',
    tip: 'O caso mais cobrado: listener em SPA. Demonstre que você conhece o padrão React: useEffect retornando cleanup que remove listener e cancela subscriptions.',
  },
  {
    level: 'Senior',
    q: 'Como debugar um memory leak em produção Node.js?',
    a: '<strong>Pipeline</strong>: (1) Observar: <code>process.memoryUsage().heapUsed</code> ao longo do tempo — crescimento sem platô = leak. (2) Reproduzir: identificar operação que cresce. (3) Heap snapshots com <code>--inspect</code> + Chrome DevTools ou <code>v8.writeHeapSnapshot()</code>. (4) Comparar: 3 snapshots (baseline, após uso, após mais uso) — diff 1 vs 3 isola objetos que deveriam ser coletados. (5) Analisar Retainers tree — caminho de referência que impede coleta. (6) Confirmar fix.',
    tip: 'A estratégia de 3 snapshots é a mais confiável. O "Retained Size" (quanto seria liberado ao coletar) é mais importante que "Shallow Size".',
  },
  {
    level: 'Pleno',
    q: 'O que é WeakMap e quando usar?',
    a: '<code>WeakMap</code>: chaves são referências <em>fracas</em>. Se não há outra referência forte à chave, o GC pode coletá-la — a entrada desaparece automaticamente. <strong>Use cases</strong>: cache de metadados de DOM nodes (quando o node é removido, o WeakMap limpa); private instance data em classes (pré-campos privados); memoização de funções recebendo objetos. <strong>Limitação</strong>: não é iterável, só aceita objetos como chaves.',
    tip: 'Exemplo mais claro: WeakMap para metadados de DOM. Com Map normal, o node nunca seria coletado enquanto o Map vivesse.',
  },
  {
    level: 'Senior',
    q: 'Explique o GC generacional do V8. Por que ele existe?',
    a: '<strong>Hipótese generacional</strong>: a maioria dos objetos morre jovem. V8 divide em duas gerações: <strong>Young Space (Scavenger/Minor GC)</strong>: ~1-8MB, GC frequente (~a cada MB alocado), algoritmo Cheney copying — copia objetos vivos para outra metade, rápido porque jovens = maioria morre. <strong>Old Space (Major GC)</strong>: objetos que sobreviveram 2 Minor GCs. Mark-Sweep-Compact, menos frequente, concurrent marking (Orinoco). Resultado: Minor GC é rápido e frequente; Major GC é custoso mas raro.',
    tip: 'Objetos de longa duração (singletons, caches) no old space nunca saem pelo Minor GC — por isso LRU/WeakMap são essenciais: garantem que objetos antigos deixam de ser alcançáveis.',
  },
  {
    level: 'Senior',
    q: 'Como evitar pausas longas de GC em aplicações de baixa latência?',
    a: 'Técnicas: (1) <strong>Object pooling</strong>: reutilize objetos em vez de criar/destruir — reduz pressão no GC. (2) <strong>Evitar deep clone em hot path</strong>: JSON.parse(JSON.stringify()) cria muitos efêmeros. (3) <strong>Monitorar GC</strong>: PerformanceObserver ({ entryTypes: ["gc"] }). (4) <strong>Node flags</strong>: <code>--max-old-space-size</code>, <code>--expose-gc</code> para GC manual em horário baixo. (5) <strong>Orinoco (V8 moderno)</strong>: concurrent marking em background — poucas pausas Stop-The-World.',
    tip: 'Object pooling é a técnica mais impactante. Exemplo concreto: pool de Buffers para serialização de respostas HTTP vs criar novo Buffer por request.',
  },
  {
    level: 'Pleno',
    q: 'Como closures causam memory leaks?',
    a: 'Closure captura referência para o escopo léxico inteiro. Se a closure sobrevive mais que o esperado, tudo que ela referencia também sobrevive. <strong>Exemplo</strong>: button.addEventListener cria handler que fecha sobre bigData (array enorme). Mesmo que handler não use bigData diretamente, o motor mantém o escopo inteiro de setup() vivo enquanto handler existir. <strong>Fix</strong>: removeEventListener quando não precisa; extrair a função para escopo menor; usar WeakRef para refs que podem ser coletadas.',
    tip: 'O detalhe sutil: handler não usa bigData, mas o motor mantém o escopo inteiro. Motores modernos fazem scope analysis — mas não é garantido para todas as situações.',
  },
  {
    level: 'Senior',
    q: 'O que é object pooling? Quando vale implementar?',
    a: 'Reutilizar instâncias de objetos em vez de criar/destruir a cada operação. Mantém pool de objetos disponíveis; ao precisar, pega do pool (reset estado); ao terminar, devolve em vez de deixar para o GC. <strong>Quando vale</strong>: objetos grandes criados em alta frequência (Buffers, DTOs), aplicações de baixa latência (trading, games, streaming), criação com custo significativo (conexões de banco). <strong>Quando não vale</strong>: objetos pequenos em baixa frequência — complexidade não compensa.',
    tip: 'Connection pools (pg-pool, ioredis) são a aplicação mais comum de object pooling em backend. Mencione que você já usou — demonstra experiência prática.',
  },
  {
    level: 'Pleno',
    q: 'O que é reachability e como o GC usa o conceito?',
    a: 'Um objeto é <strong>alcançável</strong> se pode ser acessado seguindo referências a partir das <em>roots</em>. Tudo não alcançável pode ser coletado. <strong>Roots em JS</strong>: variáveis globais (window, global), stack frames das funções em execução, closures ativas, event listeners. <strong>Mark-and-sweep</strong>: (1) Mark — começa das roots, traça todas as referências, marca objetos alcançados como vivos. (2) Sweep — libera memória de objetos não marcados. Um memory leak é simplesmente um objeto alcançável que não deveria mais ser alcançável.',
    tip: 'Defina leak precisamente: "objeto alcançável que não deveria ser". O GC nunca comete erros — ele só libera o inalcançável. Leak = bug humano que mantém referência desnecessária.',
  },
  {
    level: 'Senior',
    q: 'Como o Rust gerencia memória sem GC?',
    a: 'Rust usa <strong>ownership + borrowing + lifetimes</strong> verificado em tempo de compilação, sem runtime overhead. <strong>Ownership</strong>: cada valor tem um único dono. Ao sair de escopo, o valor é dropped (destrutor chamado, memória liberada). Sem double-free ou use-after-free. <strong>Borrowing</strong>: referenciar sem transferir ownership via & (shared) ou &mut (exclusive). Compilador garante que referências não sobrevivem ao dono. <strong>RAII</strong>: recursos liberados automaticamente via destrutores.',
    tip: 'Rust zero-cost abstractions: sem GC pauses, sem runtime, sem overhead. O borrow checker é o compilador que substitui o GC. Demonstra conhecimento de sistemas além de JS/Java.',
  },
  {
    level: 'Pleno',
    q: 'Como implementar LRU cache em JavaScript?',
    a: 'Usando Map (que mantém ordem de inserção): get() deleta a chave e re-insere no final (mais recente); set() verifica se atingiu max, remove o primeiro item (mais antigo = Map.keys().next().value) antes de inserir. Operações O(1) via delete+set. <strong>Alternativa</strong>: doubly linked list + hashmap para O(1) em linguagens sem Map com ordem garantida. Em produção: combinar LRU + TTL (expiração por tempo além de por uso).',
    tip: 'A implementação com Map é O(1) para get e set. Array seria O(n). Mencione TTL além de LRU — em produção geralmente combinam os dois.',
  },
  {
    level: 'Senior',
    q: 'O que são WeakRef e FinalizationRegistry?',
    a: '<code>WeakRef</code> (ES2021): referência que não impede o GC de coletar o objeto. <code>ref.deref()</code> retorna o objeto ou undefined se foi coletado. <strong>WeakRef vs WeakMap</strong>: WeakMap associa dados a um objeto (chave fraca); WeakRef segura referência fraca direta. <code>FinalizationRegistry</code>: callback quando objeto é coletado — para cleanup de recursos externos. <strong>Aviso</strong>: deref() pode retornar undefined entre chamadas consecutivas — o GC pode coletar entre elas.',
    tip: 'Nunca assuma que se deref() retornou o objeto em uma linha, ainda estará vivo na próxima. Sempre verifique o retorno antes de usar.',
  },
  {
    level: 'Pleno',
    q: 'Como React gerencia memória? Quais os padrões de cleanup?',
    a: 'React não tem gerenciamento especial — depende do JS GC. O ciclo de vida dos componentes cria oportunidades de leak sem cleanup. <strong>useEffect com cleanup obrigatório</strong>: retornar função que cancela subscription, remove listener e limpa timer ao desmontar. <strong>Patterns</strong>: AbortController para cancelar fetch; closure de estado (<code>let active = true; return () => { active = false }</code>); WeakRef para refs de componentes pai. O cleanup roda ao unmount ou quando deps mudam.',
    tip: 'AbortController para fetch é o padrão mais moderno. Mencione que setState após unmount gera warning no React — daí o padrão "let active = true".',
  },
  {
    level: 'Senior',
    q: 'Como funciona o Mark-Sweep-Compact do V8 (Orinoco)?',
    a: '<strong>3 fases do Major GC</strong>: (1) <strong>Mark</strong>: tri-color marking (branco/cinza/preto), incrementalmente e concorrentemente com JS. (2) <strong>Sweep</strong>: libera blocos de objetos brancos (não alcançáveis) sem mover — rápido, mas deixa fragmentação. (3) <strong>Compact</strong>: move objetos pretos para espaço contíguo, elimina fragmentação — Stop-The-World mas raro. <strong>Write barrier</strong>: intercepta escritas de ponteiro durante marking concorrente — garante que novos objetos não sejam perdidos.',
    tip: 'Write barrier é o mecanismo que garante consistência durante concurrent marking. Mencionar demonstra profundidade real além do básico.',
  },
  {
    level: 'Pleno',
    q: 'O que é fragmentação de memória?',
    a: '<strong>Fragmentação externa</strong>: há memória livre total suficiente, mas não em bloco contíguo. Alocação de 10MB falha com 20MB livres em pedaços espalhados. <strong>Fragmentação interna</strong>: blocos alocados maiores que necessário (alinhamento). Em JavaScript: GC compacta o old space periodicamente para eliminar fragmentação externa — mas a compactação é Stop-The-World. <strong>Redução</strong>: objetos de tamanho similar agrupados (slab/pool); evitar criar/destruir objetos grandes frequentemente.',
    tip: 'Node.js usa tcmalloc (via V8) que lida bem com fragmentação em workloads web. Mas criação/destruição de objetos grandes frequentemente ainda é problemática.',
  },
  {
    level: 'Senior',
    q: 'Como comparar heap snapshots para identificar leaks?',
    a: '<strong>Workflow no Chrome DevTools (aba Memory)</strong>: (1) Snapshot baseline. (2) Executar a operação suspeita 50-100 vezes. (3) Snapshot comparativo. (4) Mudar view de "Summary" para "Comparison", selecionar snapshot 1 como base. (5) Ordenar por "Delta" ou "Size Delta". (6) Expandir objetos com delta positivo. (7) Clicar no objeto para ver Retainers tree — caminho de referências que impede coleta. <strong>Indicadores de leak</strong>: Closure com escopo enorme, Array/Map crescendo, Detached DOM Tree acumulando.',
    tip: 'O Retainers tree é o insight mais valioso — mostra exatamente qual closure/array/Map está impedindo a coleta. Geralmente é um array push sem pop, ou Map.set sem delete.',
  },
  {
    level: 'Senior',
    q: 'O que é stack overflow e como evitar em código recursivo?',
    a: 'Ocorre quando a call stack excede seu limite (~10k frames em V8). Cada chamada empilha frame com argumentos, variáveis locais e endereço de retorno. <strong>Causas</strong>: recursão sem caso base ou árvore/grafo muito profundo. <strong>Soluções</strong>: (1) <strong>Tail call optimization (TCO)</strong>: compilador reutiliza frame atual em tail-recursive — JS permite mas V8 não implementa completamente. (2) <strong>Trampolining</strong>: recursão retorna funções em vez de chamar — loop executa até retornar valor. (3) <strong>Iteração com stack manual</strong>: DFS de árvore com array como stack.',
    tip: 'V8 não implementa TCO completamente — trampolining é a solução prática para recursão profunda em JS. Mencionar isso demonstra conhecimento real da runtime.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Buffer.alloc() e Buffer.allocUnsafe()?',
    a: '<code>Buffer.alloc(size)</code>: inicializa com zeros. Seguro. Ligeiramente mais lento. <code>Buffer.allocUnsafe(size)</code>: sem inicialização — memória contém dados arbitrários de alocações anteriores. Mais rápido. <strong>Risco</strong>: se enviar Buffer.allocUnsafe sem preencher todos os bytes = information disclosure — vaza memória de outros processos no output. <strong>Regra</strong>: use alloc() por padrão; allocUnsafe() apenas quando vai sobrescrever TODOS os bytes antes de usar.',
    tip: 'Information disclosure via allocUnsafe é uma vulnerabilidade real. Prefira alloc() por padrão — a diferença de performance raramente justifica o risco.',
  },
  {
    level: 'Senior',
    q: 'Como funciona reference counting como GC? Quais suas limitações?',
    a: 'Mantém contador em cada objeto: quantas referências apontam para ele. Quando chega a 0, o objeto é coletado imediatamente. <strong>Vantagens</strong>: coleta determinística, sem pausas Stop-The-World, baixa latência. <strong>Limitação crítica — ciclos</strong>: se A aponta para B e B aponta para A, e ambas as variáveis são apagadas, os contadores ficam em 1 (não chegam a 0) = leak permanente. <strong>Soluções</strong>: Python usa RC + cycle detector periódico. Swift usa ARC com weak/unowned refs para quebrar ciclos.',
    tip: 'JavaScript não usa reference counting exatamente por causa dos ciclos. Mark-and-sweep detecta ciclos naturalmente — coleta tudo não alcançável das roots, independente de referências circulares.',
  },
  {
    level: 'Pleno',
    q: 'Como setInterval e setTimeout causam leaks em SPAs?',
    a: 'Timer criado sem cleanup continua rodando indefinidamente após unmount do componente — e segura o escopo (closures) em memória. Em React: setInterval sem clearInterval no cleanup do useEffect = interval vivo, setState em componente desmontado (warning), escopo do componente preso em memória. <strong>Fix obrigatório</strong>: retornar cleanup em useEffect que chama clearInterval/clearTimeout. <strong>Regra simples</strong>: se cria timer no useEffect, sempre retorne cleanup.',
    tip: 'Todo setInterval em React precisa de clearInterval no cleanup. Sem exceções. É a pergunta de "memory leak em React" mais frequente.',
  },
  {
    level: 'Senior',
    q: 'Como diagnosticar crescimento de heap programaticamente no Node.js?',
    a: 'Ferramentas: (1) <code>process.memoryUsage()</code>: heapUsed/heapTotal/rss — monitorar tendência ao longo do tempo. (2) <code>v8.writeHeapSnapshot()</code>: gera arquivo .heapsnapshot para Chrome DevTools sem parar a aplicação. (3) <code>--expose-gc</code>: habilita global.gc() — forçar GC antes de snapshot para baseline limpo. (4) <code>PerformanceObserver({ entryTypes: ["gc"] })</code>: medir pausas de GC. (5) <code>clinic heap</code> (Node Clinic): análise automática de leaks com relatório visual.',
    tip: 'global.gc() antes do snapshot garante que objetos realmente não coletáveis aparecem — sem ela, objetos elegíveis para coleta poluem os resultados.',
  },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Stack vs Heap: "SHGR — Stack é Simples, Heap é Grande, Roots são o GC"',
    trick: 'S-H-G-R: Stack (simples, pequena), Heap (grande, GC), Roots (ponto de partida do mark)',
    expansion: [
      ['S — Stack', 'Simples (LIFO), pequena (~8MB), rápida, primitivos + referências, overflow = recursão'],
      ['H — Heap', 'Grande (GBs), lenta (fragmentação), objetos dinâmicos, gerenciada pelo GC'],
      ['G — GC', 'Generacional (young/old), parte das Roots, coleta tudo não alcançável'],
      ['R — Roots', 'Ponto de partida do mark: globais, call stack ativa, closures, listeners'],
    ],
    explanation: 'Stack e heap têm trade-offs complementares. Referências ficam na stack, objetos no heap — por isso closures capturam objetos: elas seguram a referência que aponta para o heap.',
    example: 'function foo() { const x = 42 /* stack */ ; const obj = {} /* heap */ }. Ao retornar, stack frame liberado; obj no heap aguarda GC.',
    why: 'Stack vs Heap é a primeira pergunta de memória em entrevistas de qualquer nível. SHGR cobre os 4 conceitos essenciais em ordem lógica.',
  },
  {
    label: 'Leaks em JS: "LTCD — Listener, Timer, Cache, DOM detached"',
    trick: 'L-T-C-D: os 4 leaks mais comuns em SPAs',
    expansion: [
      ['L — Listener', 'addEventListener sem removeEventListener ao desmontar — handler segura closure + DOM antigo'],
      ['T — Timer', 'setInterval sem clearInterval — continua rodando após unmount, segura o escopo'],
      ['C — Cache', 'Map/objeto global sem LRU/TTL — cresce sem limite em singleton de módulo'],
      ['D — DOM detached', 'Elemento removido do DOM mas referenciado por variável JS — GC não pode coletar'],
    ],
    explanation: 'Em React: useEffect deve retornar cleanup que trata todos os 4. L = removeEventListener, T = clearInterval, C = cache com limite, D = null na ref ao desmontar.',
    example: 'Componente Chart que adiciona window listener + setInterval + cria cache de dados + mantém ref ao canvas sem cleanup = 4 leaks simultâneos.',
    why: 'Esses 4 padrões cobrem 90% dos leaks que entrevistadores pedem. LTCD é fácil de memorizar e de recitar ao vivo.',
  },
  {
    label: 'GC Generacional: "Jovem Nasce, Sobrevive 2 GCs, é Promovido para o Velho"',
    trick: 'J-S-P: Jovem space (nasce), Sobrevive 2 Minor GCs, Promovido ao Old space',
    expansion: [
      ['J — Jovem', 'Young space (~1-8MB): Scavenger (Minor GC), frequente, Cheney copying'],
      ['S — Sobrevive', 'Se o objeto sobrevive a 2 Minor GCs, é considerado de longa duração'],
      ['P — Promovido', 'Vai para o Old space: Mark-Sweep-Compact (Major GC), raro, Orinoco concurrent'],
    ],
    explanation: 'Hipótese generacional: maioria dos objetos morre jovem. Minor GC é rápido porque processa apenas objetos jovens — a maioria morre, poucos sobrevivem. Major GC é raro mas custoso.',
    example: 'Variável em função executada uma vez: jovem, morre no Minor GC. Cache global: sobrevive, promovido ao old space, coletado apenas pelo Major GC.',
    why: 'GC generacional é a pergunta de V8 mais cobrada. J-S-P cobre a hipótese + o ciclo de vida + os dois algoritmos.',
  },
  {
    label: 'Mark-Sweep-Compact: "Marcar, Varrer, Compactar — MSC"',
    trick: 'MSC: Mark (alcançável), Sweep (liberar), Compact (eliminar fragmentação)',
    expansion: [
      ['M — Mark', 'Começa das roots, traça refs recursivamente, marca objetos vivos. Tri-color: branco/cinza/preto. Roda concorrentemente (Orinoco).'],
      ['S — Sweep', 'Libera blocos brancos (não marcados). Não move objetos — rápido, mas deixa fragmentação.'],
      ['C — Compact', 'Move objetos pretos para espaço contíguo. Elimina fragmentação. Stop-The-World, mas raro (só com alta fragmentação).'],
    ],
    explanation: 'Write barrier complementa o MSC concorrente: intercepta escritas de ponteiro durante marking — garante que objetos criados durante o mark não sejam perdidos.',
    example: 'Compact só roda quando fragmentação é alta. Sem compact, o heap ficaria com "buracos" entre objetos — novas alocações falhariam mesmo com espaço total suficiente.',
    why: 'A fase Compact e o Write barrier são os detalhes que diferenciam candidatos pleno de sênior. MSC é fácil de lembrar e demonstra profundidade.',
  },
  {
    label: 'WeakMap: "Weak = GC Friendly — Chave Some, Entrada Some"',
    trick: 'WeakMap: chave fraca → GC coleta a chave → entrada some automaticamente',
    expansion: [
      ['Map forte', 'Map.set(obj, dados) — obj nunca é coletado enquanto o Map existir. Pode viver para sempre em singleton.'],
      ['WeakMap fraco', 'WeakMap.set(obj, dados) — se obj não tem outra ref forte, GC pode coletar. Entrada some automaticamente.'],
      ['Caso de uso 1', 'Metadados de DOM nodes: WeakMap.set(domNode, { medições }) — quando o node é removido, dados somem.'],
      ['Caso de uso 2', 'Cache de resultados de função: WeakMap.set(parâmetroObj, resultado) — não prende o parâmetro em memória.'],
    ],
    explanation: 'WeakMap não é iterável — não dá para listar as chaves. Só aceita objetos como chaves (não primitivos). FinalizationRegistry complementa com callback ao coletar.',
    example: 'componente React que usa Map para cache de medições de DOM nodes: nodes removidos do DOM nunca são coletados. Substituir por WeakMap: nodes coletados automaticamente.',
    why: 'WeakMap é o pattern de prevenção de leak mais subutilizado. Saber quando usá-lo e explicar por que a entrada "some automaticamente" demonstra entendimento profundo do GC.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'process.memoryUsage()', sig: '{ heapUsed, heapTotal, rss, external }', desc: 'Monitorar crescimento de heap em produção. heapUsed crescendo sem platô = possível leak. rss = resident set size (total de memória do processo).' },
  { name: 'v8.writeHeapSnapshot()', sig: 'v8.writeHeapSnapshot() → filename', desc: 'Gera .heapsnapshot sem parar a aplicação. Abrir no Chrome DevTools → Memory. Use após global.gc() para baseline limpo.' },
  { name: 'global.gc()', sig: 'node --expose-gc → global.gc()', desc: 'Força GC antes de snapshot para garantir que objetos elegíveis são coletados. Nunca usar em produção sem medição — pausas STW.' },
  { name: 'WeakMap / WeakSet', sig: 'new WeakMap<object, T>()', desc: 'Chaves com referência fraca — GC pode coletar a chave se não há outra ref forte. Entrada some automaticamente. Não iterável.' },
  { name: 'WeakRef / FinalizationRegistry', sig: 'new WeakRef(obj) → ref.deref()', desc: 'WeakRef: ref que não impede GC. Sempre verificar deref() !== undefined. FinalizationRegistry: callback ao coletar — cleanup de recursos externos.' },
  { name: 'Buffer.alloc(n)', sig: 'Buffer.alloc(n) vs Buffer.allocUnsafe(n)', desc: 'alloc(): inicializa com zeros — seguro. allocUnsafe(): sem init — mais rápido. NUNCA enviar allocUnsafe sem preencher todos os bytes = information disclosure.' },
  { name: 'PerformanceObserver GC', sig: '{ entryTypes: ["gc"] }', desc: 'Mede pausas de GC por tipo (minor, major, incremental). Use para monitorar impacto de GC em latência de API.' },
  { name: 'Object pooling', sig: 'pool.acquire() → use → pool.release()', desc: 'Reutilizar objetos caros em vez de criar/destruir. Reduz pressão no GC. Use para Buffers, conexões de banco, objetos grandes em alta frequência.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'addEventListener sem removeEventListener ao desmontar — listener preso com closure' },
  { ok: false, t: 'setInterval sem clearInterval em useEffect — timer vivo após unmount' },
  { ok: false, t: 'Map global sem LRU/TTL — cresce sem limite no old space' },
  { ok: false, t: 'Buffer.allocUnsafe() sem preencher todos os bytes — information disclosure' },
  { ok: false, t: 'JSON.parse(JSON.stringify()) em hot path — muitos efêmeros = pressão no GC' },
  { ok: true, t: 'useEffect sempre retorna cleanup: removeEventListener + clearInterval + cancel' },
  { ok: true, t: 'WeakMap para metadados de DOM nodes — não previne coleta do node' },
  { ok: true, t: 'LRU cache com tamanho máximo para caches globais em singletons' },
  { ok: true, t: '3 snapshots (baseline, uso, mais uso) — diff 1 vs 3 isola objetos com leak' },
  { ok: true, t: 'Object pooling para Buffers/objetos grandes em alta frequência — reduz GC pressure' },
]

// ── Dados: Mind Map ───────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Stack & Heap',
    color: C,
    items: [
      { t: 'Stack: LIFO, pequena (~8MB), frames de função', k: true },
      { t: 'Heap: grande, GC, objetos dinâmicos', k: true },
      { t: 'Refs na stack apontam para heap (closures!)', k: true },
      { t: 'Stack overflow: recursão sem base case', k: true },
    ],
  },
  {
    label: 'GC Generacional',
    color: BLU,
    items: [
      { t: 'Hipótese: maioria morre jovem', k: true },
      { t: 'Young space: Scavenger (Minor GC), frequente', k: true },
      { t: 'Old space: Mark-Sweep-Compact (Major GC)', k: true },
      { t: 'Orinoco: concurrent marking em background', a: true },
      { t: 'Write barrier: garante consistência durante mark', a: true },
    ],
  },
  {
    label: 'Leaks em JS',
    color: RED,
    items: [
      { t: 'Listener sem remove — closure segura DOM antigo', k: true },
      { t: 'setInterval sem clear — timer vivo, escopo preso', k: true },
      { t: 'Cache sem LRU/TTL — crescimento ilimitado', k: true },
      { t: 'DOM detached + ref JS — GC bloqueado', k: true },
      { t: 'Subscription não cancelada (RxJS, EventEmitter)', k: true },
    ],
  },
  {
    label: 'Debug de Memória',
    color: AMB,
    items: [
      { t: 'process.memoryUsage().heapUsed — monitorar tendência', k: true },
      { t: '3 snapshots: baseline → uso → mais uso', k: true },
      { t: 'Comparison view: Delta + Size Delta', k: true },
      { t: 'Retainers tree: quem segura a referência', k: true },
      { t: 'clinic heap / heapdump / --inspect', a: true },
    ],
  },
  {
    label: 'WeakMap & Pool',
    color: PRP,
    items: [
      { t: 'WeakMap: chave fraca — GC coleta, entrada some', k: true },
      { t: 'WeakRef: deref() pode ser undefined — sempre checar', k: true },
      { t: 'FinalizationRegistry: callback ao coletar', a: true },
      { t: 'Object pooling: acquire → use → release', k: true },
    ],
  },
  {
    label: 'Rust & Referências',
    color: SKY,
    items: [
      { t: 'Ownership: 1 dono, drop automático ao sair de escopo', a: true },
      { t: 'Borrowing: & (shared) ou &mut (exclusive)', a: true },
      { t: 'RAII: recursos liberados via destrutores', a: true },
      { t: 'Reference counting: AC problem (ciclos)', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Consigo explicar por que closures causam leaks com exemplo concreto?',
  'Sei os 4 leaks mais comuns em SPA (LTCD) e como corrigir cada um?',
  'Entendo a diferença entre Young Space e Old Space no V8?',
  'Sei o workflow dos 3 snapshots para identificar um leak?',
  'Consigo explicar quando usar WeakMap vs Map?',
  'Sei a diferença entre Buffer.alloc() e Buffer.allocUnsafe()?',
  'Entendo o que é o Retainers tree e como ler?',
  'Sei implementar um LRU cache com Map em O(1)?',
  'Entendo por que reference counting falha com ciclos?',
  'Consigo explicar object pooling com um exemplo real (pg-pool, Buffer pool)?',
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Memory Management',
    stackLabel: 'CS · GC & Leaks',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Memory Management',
    stackLabel: 'CS · GC & Leaks',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Memory Management',
    accentColor: C,
    stackLabel: 'CS · GC & Leaks',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['Stack', 'LIFO, ~8MB, frames de função, primitivos + refs'],
        ['Heap (Young space)', 'Scavenger/Minor GC, frequente, Cheney copying'],
        ['Heap (Old space)', 'Mark-Sweep-Compact, raro, Orinoco concurrent'],
        ['WeakMap', 'Chave fraca — GC coleta a chave, entrada some automaticamente'],
        ['Object pool', 'acquire → use → release — reduz pressão no GC'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'useEffect: sempre retornar cleanup com removeEventListener + clearInterval + cancel',
        'WeakMap para metadados de DOM nodes — não previne coleta do node pelo GC',
        'LRU cache com max size em singletons — nunca Map crescendo sem limite',
        'Buffer.alloc() por padrão — allocUnsafe() apenas com preenchimento total garantido',
        'Object pooling para Buffers e objetos caros em hot path de alta frequência',
        '3 snapshots para identificar leak: baseline → uso → mais uso → comparar Delta',
      ],
      patterns: [
        {
          name: 'useEffect com cleanup completo',
          code: `useEffect(() => {
  const sub = obs.subscribe(handler)
  window.addEventListener('resize', onResize)
  const id = setInterval(tick, 1000)
  const ctrl = new AbortController()
  fetch(url, { signal: ctrl.signal })

  return () => {  // cleanup obrigatório
    sub.unsubscribe()
    window.removeEventListener('resize', onResize)
    clearInterval(id)
    ctrl.abort()
  }
}, [deps])`,
          desc: 'Todo resource criado no effect deve ser liberado no cleanup — sem exceções',
        },
        {
          name: 'LRU Cache com Map O(1)',
          code: `class LRUCache<T> {
  private map = new Map<string, T>()
  constructor(private max: number) {}

  get(key: string): T | undefined {
    if (!this.map.has(key)) return undefined
    const val = this.map.get(key)!
    this.map.delete(key)
    this.map.set(key, val)  // move para o final
    return val
  }

  set(key: string, val: T) {
    if (this.map.has(key)) this.map.delete(key)
    else if (this.map.size >= this.max)
      this.map.delete(this.map.keys().next().value!)
    this.map.set(key, val)
  }
}`,
          desc: 'Map mantém ordem de inserção — primeiro = menos recente (LRU). O(1) para get e set.',
        },
        {
          name: 'Buffer pool para baixa latência',
          code: `class BufferPool {
  private pool: Buffer[] = []

  acquire(size: number): Buffer {
    const buf = this.pool.pop()
    if (buf && buf.length >= size) return buf
    return Buffer.allocUnsafe(size)  // ok: vai preencher tudo
  }

  release(buf: Buffer) {
    this.pool.push(buf)  // reutiliza sem criar/destruir
  }
}
// Uso em serialização de resposta HTTP — mesmos buffers,
// nenhuma alocação nova no hot path`,
          desc: 'Reutiliza buffers em vez de alocar/coletar — elimina GC pressure em alta frequência',
        },
      ],
      mentalModels: [
        'SHGR: Stack (simples), Heap (grande), GC (generacional), Roots (ponto de partida do mark)',
        'LTCD: os 4 leaks — Listener, Timer, Cache, DOM detached',
        'JSP: Jovem nasce, Sobrevive 2 GCs, Promovido ao old space',
        'MSC: Mark (alcançável) → Sweep (liberar) → Compact (fragmentação)',
        'WeakMap: chave fraca = GC friendly — chave some, entrada some',
      ],
    },
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Memory Management',
    stackLabel: 'CS · GC & Leaks',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de ir a uma entrevista sênior de Node.js ou Java.',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function MemoryManagementPdfs() {
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
