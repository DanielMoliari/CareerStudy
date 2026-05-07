import type { SkillContent } from '@/types'

const crdts: SkillContent = {
  tagline: 'Estruturas de dados que mergeiam automaticamente entre réplicas — sem coordenação central.',
  why: 'Base de apps colaborativos (Figma, Linear, Notion offline). Sênior precisa explicar trade-off vs OT, tipos de CRDT, e quando NÃO usar. Diferencial real em entrevistas de sistemas distribuídos.',
  summary: 'CRDT (Conflict-free Replicated Data Type) é uma estrutura onde merge é associativo, comutativo e idempotente — qualquer ordem de operações converge para o mesmo estado. Permite réplicas operarem offline e mergiarem sem conflito. Tipos: state-based (CvRDT) e operation-based (CmRDT). Trade-off: convergência automática custa metadata e semântica restrita.',
  keypoints: [
    { title: 'Propriedades ACI', body: 'Merge Associativo, Comutativo, Idempotente (ACI). Garante convergência eventual sem coordenação central. Qualquer ordem de operações produz o mesmo resultado final.' },
    { title: 'G-Counter', body: 'Counter só cresce. Cada réplica tem contador próprio; merge = max por réplica + sum. Útil para likes, views, eventos contados.' },
    { title: 'PN-Counter', body: 'G-Counter positivo + G-Counter negativo. Merge = max por réplica em cada vetor. Permite increment e decrement sem conflito.' },
    { title: 'G-Set', body: 'Set só add. Merge = union. Sem remove. Simples e sem custo de tombstones. Útil para listas de tags imutáveis.' },
    { title: '2P-Set', body: 'G-Set + tombstone set. Add/remove, mas item removido não volta. Tombstones crescem indefinidamente sem GC.' },
    { title: 'OR-Set (Observed-Remove)', body: 'Add com unique tag; remove só tira tags observados. Permite re-add após remove. Mais complexo e mais útil. Padrão em Riak KV.' },
    { title: 'Yjs / Automerge', body: 'Libs de CRDT para docs colaborativos. Yjs é padrão em editors (Tiptap, Slate, Monaco). Automerge é JSON-like com histórico de operações.' },
    { title: 'Vector clocks / version vectors', body: 'Metadata para detectar concorrência. Cada réplica incrementa seu contador a cada update. Merge usa para ordenar e detectar conflitos causais.' },
  ],
  gotchas: [
    'CRDT cresce metadata indefinidamente sem garbage collection (tombstones em OR-Set, 2P-Set).',
    'Achar que CRDT serve para qualquer estrutura — semântica é restrita (counter, set, list, JSON específico).',
    'Comparar CRDT com OT (Operational Transform) sem entender — OT exige server central; CRDT é peer-to-peer.',
    'Esquecer que LWW (Last-Write-Wins) com timestamp é CRDT mas perde dados em concorrência real.',
    'Implementar do zero — use Yjs, Automerge, Loro. Bug em CRDT é sutil e difícil de testar.',
    'Performance: alguns CRDTs state-based têm merge O(n) — importante para sistemas de alta escala.',
    'Confundir convergência eventual com consistência eventual — CRDT garante o mesmo estado final, mas não ordenação de eventos.',
  ],
  interview: [
    {
      level: 'pleno',
      q: 'O que é um CRDT e por que ele garante convergência sem coordenação?',
      a: '<p><strong>CRDT (Conflict-free Replicated Data Type)</strong> é uma estrutura de dados projetada matematicamente para que qualquer conjunto de operações, em qualquer ordem, produza o mesmo resultado final em todas as réplicas.</p><p>A convergência sem coordenação vem das três propriedades algébricas:</p><ul><li><strong>Associativo</strong>: merge(A, merge(B, C)) = merge(merge(A, B), C) — ordem de agrupamento não importa</li><li><strong>Comutativo</strong>: merge(A, B) = merge(B, A) — ordem de chegada não importa</li><li><strong>Idempotente</strong>: merge(A, A) = A — receber a mesma mensagem duas vezes não tem efeito</li></ul><p>Juntas, garantem que réplicas podem operar offline, receber updates em qualquer ordem, e ainda convergir para o mesmo estado.</p>',
      tip: 'Mencione as três propriedades (ACI) pelo nome. Isso demonstra que você entende a base matemática, não só o uso prático.',
    },
    {
      level: 'pleno',
      q: 'Qual a diferença entre state-based (CvRDT) e operation-based (CmRDT)?',
      a: '<p>Duas famílias de CRDT com trade-offs diferentes:</p><ul><li><strong>CvRDT (state-based)</strong>: envia o estado completo. Merge é função que combina dois estados. Mais robusto — funciona em redes não-confiáveis (idempotência garante re-envio seguro). Custo: estados podem ser grandes.</li><li><strong>CmRDT (operation-based)</strong>: envia apenas a operação (ex: "increment"). Exige entrega at-least-once e causal ordering pelo canal. Mais eficiente — pequenas mensagens. Custo: canal deve garantir entrega e ordem causal.</li></ul><p>Exemplos: G-Counter state-based envia vetor inteiro; G-Counter op-based envia só "+1 de replica X". Yjs usa operações com IDs únicos.</p>',
      tip: 'A diferença prática: state-based funciona com broadcast simples; op-based precisa de canal mais sofisticado (causal delivery). Mencione que Yjs é essencialmente op-based com YATA algorithm.',
    },
    {
      level: 'pleno',
      q: 'Como funciona um G-Counter e onde você o usaria?',
      a: '<p><strong>G-Counter (Grow-only Counter)</strong>: counter que só cresce. Cada réplica mantém array de contadores — um slot por réplica.</p><p>Operações:</p><ul><li><strong>Increment</strong>: replica X incrementa só o seu slot: <code>counter[X]++</code></li><li><strong>Merge</strong>: <code>merge(A, B)[i] = max(A[i], B[i])</code> — pega o maior valor por slot</li><li><strong>Read</strong>: soma todos os slots: <code>sum(counter[0..n])</code></li></ul><p>Exemplo: replicas A=[3,0,0] e B=[0,2,0]. Após merge: [3,2,0]. Read = 5.</p><p>Casos de uso: likes em post social, views de vídeo, eventos analíticos, métricas de monitoramento em sistema distribuído.</p>',
      tip: 'Desenhe ou descreva o array de vetores. Entrevistadores de sistema distribuído adoram quando você vai ao mecanismo interno.',
    },
    {
      level: 'pleno',
      q: 'O que é um OR-Set e por que é mais útil que 2P-Set?',
      a: '<p><strong>2P-Set</strong>: dois G-Sets — um de adds e um de removes (tombstones). Item removido não pode ser re-adicionado. Tombstones crescem indefinidamente.</p><p><strong>OR-Set (Observed-Remove Set)</strong>: cada add gera tag única (ex: UUID). Remove especifica as tags observadas no momento do remove. Re-add cria novas tags — o item "volta" com identidade nova.</p><p>Por que é mais útil:</p><ul><li>Permite re-add após remove (2P-Set não permite)</li><li>Semântica clara em concorrência: add concurrent com remove → add vence (observed-remove)</li><li>Padrão em Riak KV, Riak DT</li></ul><p>Custo: metadata maior — cada elemento carrega conjunto de tags.</p>',
      tip: 'Mencione a semântica "add wins" em operações concorrentes — é a decisão de design que define o comportamento do OR-Set e que aparece em entrevistas.',
    },
    {
      level: 'pleno',
      q: 'CRDT vs OT (Operational Transform) — quando usar cada um?',
      a: '<p>Dois paradigmas para colaboração em tempo real com trade-offs bem distintos:</p><p><strong>OT (Operational Transform)</strong>:<br>Operações são transformadas em função do estado de concorrência. Exige servidor central para serializar e transformar operações.<br>Pros: modelo de texto rico, histórico com undo, maturidade (Google Docs desde 2006).<br>Cons: exige servidor central, algoritmos complexos, difícil de implementar corretamente.</p><p><strong>CRDT</strong>:<br>Estruturas com merge semanticamente seguro. Peer-to-peer ou multi-servidor.<br>Pros: sem servidor central, offline-first natural, peer-to-peer possível.<br>Cons: metadata cresce, semântica pode ser menos intuitiva, mais novo.</p><p><strong>Quando usar cada:</strong><br>OT: Google Docs, docs ricos com undo/redo complexo, já tem servidor central.<br>CRDT: Figma (Yjs), Linear, apps offline-first, sem servidor central, multi-region.</p>',
      tip: 'A frase que diferencia: "OT exige servidor para serializar; CRDT é peer-to-peer por natureza". Mencione que Figma migrou de OT para CRDT (Yjs).',
    },
    {
      level: 'pleno',
      q: 'Como vector clocks funcionam com CRDTs?',
      a: '<p><strong>Vector clock</strong> (relógio vetorial): estrutura que mapeia <code>replicaId → contador</code>. Permite determinar relação causal entre eventos.</p><p>Operações:</p><ul><li>Cada réplica incrementa seu próprio slot a cada evento que produz</li><li>Ao receber mensagem com vector clock V, merge: <code>local[i] = max(local[i], V[i])</code></li><li>Compara: A precede causalmente B se <code>∀i: A[i] ≤ B[i]</code> (e pelo menos um é estritamente menor)</li></ul><p>Uso em CRDTs:</p><ul><li>Detectar se operação já foi recebida (idempotência em CmRDT)</li><li>Determinar causalidade para ordenação de operações</li><li>G-Counter é essencialmente um vector clock com semântica de soma</li></ul>',
      tip: 'A diferença entre vector clock e version vector: ambos têm a mesma estrutura, mas versão vector é usado para detectar conflito; vector clock para causalidade. Muitos usam como sinônimos.',
    },
    {
      level: 'senior',
      q: 'Quando NÃO usar CRDT?',
      a: '<p>Situações onde CRDT não é a resposta certa:</p><ul><li><strong>Invariantes globais</strong>: saldo bancário não negativo, estoque exato. CRDT não pode garantir que réplica X não gaste estoque que réplica Y já reservou simultaneamente.</li><li><strong>Estruturas sem CRDT pronto</strong>: relacional com JOINs, transações ACID entre múltiplas entidades. CRDT não resolve coordenação cross-entidade.</li><li><strong>Single-primary suficiente</strong>: se latência de single-primary é aceitável (ex: app regional simples), CRDT adiciona complexidade desnecessária.</li><li><strong>Time pequeno sem expertise</strong>: bugs em CRDT são sutis. LWW errado, semântica de remove incorreta. Use Yjs/Automerge em vez de implementar.</li><li><strong>Dados altamente relacionados</strong>: quando operações em A dependem do estado atual de B, coordenação é necessária — CRDT não coordena.</li></ul>',
      tip: 'A resposta que impressiona: mencionar invariantes globais. É o limite fundamental de CRDT — convergência sem coordenação implica que você não pode garantir restrições que dependem de estado global.',
    },
    {
      level: 'senior',
      q: 'Como Yjs funciona internamente e por que é o padrão para editores colaborativos?',
      a: '<p><strong>Yjs</strong> implementa CRDT para documentos usando o algoritmo YATA (Yet Another Transformation Approach).</p><p>Mecanismo interno:</p><ul><li>Cada operação tem ID único: <code>{client, clock}</code> — determinístico e globalmente único</li><li>Texto é modelado como lista de itens, cada um com ID e referência ao predecessor e successor</li><li>Conflitos de inserção simultânea: resolvidos deterministicamente pelo ID do cliente</li><li>Deletar: marca item como "deleted" (tombstone) — posição é preservada para ordering</li><li>Garbage collection: quando possível, tombstones são removidos via snapshot agreement</li></ul><p>Por que é padrão:</p><ul><li>Suporte a múltiplas estruturas: YText, YArray, YMap, YXmlElement</li><li>Plugins de binding para ProseMirror, TipTap, Slate, Monaco, CodeMirror</li><li>Transportes: y-websocket, y-webrtc, y-indexeddb (offline)</li><li>Performance: updates incrementais, não estado completo</li></ul>',
      tip: 'Mencione os bindings específicos (TipTap, ProseMirror) — demonstra que você já integrou ou pesquisou profundamente. "Yjs provavelmente roda nos seus apps colaborativos favoritos" é uma afirmação forte e verdadeira.',
    },
    {
      level: 'senior',
      q: 'Como o problema do crescimento de metadata é resolvido em sistemas CRDT reais?',
      a: '<p>Três estratégias principais:</p><ul><li><strong>Snapshots periódicos</strong>: todos os clientes concordam em fazer snapshot do estado atual em um ponto de tempo (usando vector clock para consenso). Operações anteriores ao snapshot são descartadas. Yjs usa y-indexeddb com snapshots para GC offline.</li><li><strong>Vector clock minimum</strong>: tombstones e entradas antigas são removidos quando todos os participantes conhecidos confirmaram receber o update. Usa-se o mínimo do vector clock de todos os peers.</li><li><strong>Compactação de histórico</strong>: Automerge permite "squash" de histórico antigo mantendo estado atual correto. Troca: perde histórico completo de operações antigas.</li></ul><p>Trade-offs:</p><ul><li>GC agressivo: menos memória, mas clientes muito atrasados podem não conseguir sincronizar</li><li>GC conservador: mais memória, mas qualquer cliente atrasado consegue convergir</li></ul>',
      tip: 'Mencione o dilema do GC: você precisa que todos os participantes confirmem para descartar, mas se um participante some para sempre, metadata fica preso. Sistemas reais têm TTL para participantes inativos.',
    },
    {
      level: 'senior',
      q: 'Como CRDTs são usados em bancos de dados distribuídos?',
      a: '<p>Bancos com suporte nativo a CRDTs:</p><ul><li><strong>Riak KV</strong>: pioneiro. Data types CRDT nativos: counters (PN-Counter), sets (OR-Set), maps, registers, flags. Substituiu "last write wins" por semântica clara.</li><li><strong>Redis</strong>: Redis Cluster usa slots mas não CRDTs. Redis Enterprise tem CRDT (Active-Active) para multi-região — G-Counter, PN-Counter, OR-Set nativo.</li><li><strong>AntidoteDB</strong>: banco de pesquisa focado em CRDTs. Suporta transações com CRDTs.</li></ul><p>Integração com sistemas de mensageria:</p><ul><li>Kafka + CRDT: consumidores em diferentes partições podem usar CRDT state para fazer merge sem coordenação</li><li>EventSourcing + CRDT: operações como eventos imutáveis, estado derivado via CRDT merge</li></ul>',
      tip: 'Mencionar Riak mostra que você conhece a história — foi o primeiro banco a popularizar CRDTs em produção. Redis Enterprise CRDT é diferencial para candidatos de infra.',
    },
    {
      level: 'senior',
      q: 'Qual a diferença entre CRDT, eventual consistency e strong eventual consistency?',
      a: '<p>Três níveis de garantia:</p><ul><li><strong>Eventual consistency</strong>: garantia de convergência eventual se operações pararem. Não especifica como nem quando. Pode haver múltiplos estados finais dependendo da ordem de aplicação.</li><li><strong>Strong Eventual Consistency (SEC)</strong>: duas réplicas que receberam o mesmo conjunto de updates têm o mesmo estado — garantia determinística. CRDTs implementam SEC por propriedade matemática (ACI).</li><li><strong>CRDT</strong>: estrutura de dados concreta que implementa SEC. A convergência é automática e sem coordenação — é consequência das propriedades algébricas, não de um protocolo de consenso.</li></ul><p>Hierarquia: CRDT ⊂ SEC ⊂ Eventual Consistency. CRDT garante o nível mais forte de eventual consistency possível sem coordenação.</p>',
      tip: 'O termo "Strong Eventual Consistency" foi cunhado por Shapiro et al. em 2011 — o mesmo paper que formalizou CRDTs. Citar a origem impressiona.',
    },
    {
      level: 'senior',
      q: 'Como você implementaria um contador de likes com CRDT em sistema distribuído multi-região?',
      a: '<p>Design usando PN-Counter:</p><ul><li><strong>Estrutura</strong>: dois vetores, um por operação: <code>P[replicaId]</code> (positivo) e <code>N[replicaId]</code> (negativo). Cada região tem seu slot.</li><li><strong>Operações</strong>: like → <code>P[thisRegion]++</code>; unlike → <code>N[thisRegion]++</code>. Operações locais são instantâneas.</li><li><strong>Merge</strong>: <code>merged.P[i] = max(A.P[i], B.P[i])</code> para cada região. Igual para N.</li><li><strong>Read</strong>: <code>sum(P) - sum(N)</code>.</li><li><strong>Replicação</strong>: cada região transmite seu vetor periodicamente (gossip ou pub/sub).</li></ul><p>Tradeoffs:</p><ul><li>Leitura local: sempre disponível, zero latência de rede</li><li>Escrita local: zero coordenação, latência de rede apenas para propagação assíncrona</li><li>Consistência: eventualmente consistente — usuários em regiões diferentes veem contagens ligeiramente diferentes por alguns segundos</li><li>Metadata: O(n) onde n é número de regiões — aceitável para sistemas com &lt;100 regiões</li></ul>',
      tip: 'Mencione que o contador nunca ficará negativo por limitação do PN-Counter padrão — se precisar evitar likes negativos, você precisa de coordenação ou aceitar eventual consistency no read.',
    },
    {
      level: 'pleno',
      q: 'O que é LWW (Last-Write-Wins) e como difere de um CRDT?',
      a: '<p><strong>LWW (Last-Write-Wins)</strong>: estratégia de resolução de conflito onde a operação com timestamp mais recente vence. Tecnicamente é um CRDT (Register LWW) — tem semântica de merge determinística.</p><p>O problema:</p><ul><li>Relógios físicos não são confiáveis em sistemas distribuídos — skew de relógio pode fazer com que operações mais novas pareçam mais velhas</li><li>Perde dados: se dois usuários editam simultaneamente, apenas um sobrevive</li><li>Falsa semântica de merge — parece limpo mas descarta dados silenciosamente</li></ul><p>Quando LWW é aceitável:</p><ul><li>Last update genuinamente vence (ex: status online/offline de usuário)</li><li>Dados de configuração onde "mais novo é correto"</li><li>Cassandra usa LWW por padrão — funciona bem para dados com timestamp natural</li></ul>',
      tip: 'LWW é CRDT matematicamente, mas é considerado "CRDT perigoso" porque perde dados sem aviso. Demonstrar essa nuance mostra profundidade.',
    },
    {
      level: 'pleno',
      q: 'Como você testaria a corretude de uma implementação CRDT?',
      a: '<p>Estratégia de testes em três camadas:</p><ul><li><strong>Testes de propriedade (Property-based testing)</strong>: usando fast-check ou similar, gerar operações aleatórias em ordens aleatórias e verificar que merge produz o mesmo resultado. Testa as três propriedades ACI automaticamente com centenas de combinações.</li><li><strong>Testes de concorrência</strong>: simular múltiplas réplicas em paralelo com atrasos aleatórios de rede. Verificar que estado final converge independente de qual réplica recebeu operações primeiro.</li><li><strong>Testes de tombstone e GC</strong>: verificar que elementos removidos não "ressurgem" após merge, e que GC não descarta operações necessárias para sincronizar réplicas atrasadas.</li></ul><p>Framework recomendado: Jepsen para testes de distribuição em nível de banco de dados.</p>',
      tip: 'Mencionar property-based testing (não só testes unitários) demonstra sofisticação. CRDTs com bugs passam em testes unitários triviais mas falham em ordens de operação específicas.',
    },
    {
      level: 'senior',
      q: 'Quais são as limitações fundamentais de CRDTs que nunca podem ser superadas?',
      a: '<p>Limitações teoricamente fundamentais (derivam do CAP theorem e da natureza de convergência sem coordenação):</p><ul><li><strong>Invariantes globais</strong>: impossível garantir sem coordenação que "saldo >= 0" em todas as réplicas simultaneamente enquanto operam offline. CRDT pode ter valor negativo durante partição.</li><li><strong>Semântica restrita</strong>: só estruturas com operações comutativas são implementáveis como CRDT. Operações que dependem do estado atual de outras entidades exigem coordenação.</li><li><strong>Trade-off de metadata</strong>: crescimento de metadata é teoricamente inevitável para GC seguro sem coordenação — você precisa de consenso para descartar, o que contradiz "sem coordenação".</li><li><strong>Complexidade de implementação</strong>: CRDTs corretos são matematicamente não-triviais. Cada nova estrutura precisa ser provada correta — não é extensível de forma ad-hoc.</li></ul><p>Em suma: CRDTs são a melhor resposta para o problema de convergência sem coordenação, mas o problema de coordenação em si é irredutível para certos casos.</p>',
      tip: 'Esta pergunta separa quem entendeu de quem memorizou. A resposta correta aponta o CAP theorem como raiz: disponibilidade + partição = eventual consistency, e CRDT é o melhor que se pode fazer nesse quadrante.',
    },
    {
      level: 'senior',
      q: 'Como o Automerge difere do Yjs e quando você escolheria um sobre o outro?',
      a: '<p>Duas implementações maduras de CRDT para documentos com filosofias diferentes:</p><p><strong>Yjs</strong>:<br>Algoritmo YATA. Focado em performance e integração com editores de texto ricos. Bindings oficiais para ProseMirror, TipTap, Slate, Monaco, CodeMirror. Suporte a y-webrtc (P2P) e y-websocket. Garbage collection de tombstones. Mais eficiente para documentos de texto.</p><p><strong>Automerge</strong>:<br>Baseado em JSON — array, object, text, number. Histórico completo de operações como event log imutável. Permite "travel" no histórico (undo arbitrário). Mais expressivo para estruturas de dados complexas. Port em Rust (automerge-rs) com WASM para browser. Menos plugins de editor, mais flexível para dados genéricos.</p><p><strong>Quando usar cada:</strong><br>Editor de texto colaborativo → Yjs (ecossistema de plugins).<br>JSON distribuído / app colaborativo sem editor rico → Automerge.<br>Precisar de histórico completo de operações → Automerge.</p>',
      tip: 'Mencionar Automerge em Rust/WASM demonstra que você acompanha o estado da arte. A lib está sendo reescrita em Rust para ser usada em qualquer linguagem via WASM.',
    },
    {
      level: 'senior',
      q: 'Como CRDTs se integram com sistemas de event sourcing?',
      a: '<p>Integração natural porque ambos tratam operações como eventos imutáveis:</p><ul><li><strong>Operações CRDT como events</strong>: cada operação CmRDT (increment, add, remove) é um evento imutável no event store. Re-aplicar eventos em qualquer ordem produz o mesmo estado.</li><li><strong>Estado como projeção CRDT</strong>: o read model é o resultado do merge de todos os eventos CRDT. Permite múltiplas projeções diferentes do mesmo log.</li><li><strong>Replicação via event log</strong>: réplicas sincronizam compartilhando o event log — causal ordering é garantido pelo log, simplificando o CmRDT.</li><li><strong>Particionamento</strong>: diferentes partes do documento/entidade podem ser armazenadas em diferentes partições Kafka e mergiadas via CRDT no consumer.</li></ul><p>Cuidado: event sourcing com CRDT exige que operações sejam comutativas. Se o domínio tem operações não-comutativas (ex: "set price" seguido de "apply 10% discount"), event sourcing simples com replay é mais adequado.</p>',
      tip: 'Esta combinação aparece em sistemas como Linear (issues distribuídos) e em sistemas de analytics. Mencionar a limitação de comutatividade demonstra pensamento crítico.',
    },
    {
      level: 'senior',
      q: 'Como você apresentaria CRDTs para um time que nunca trabalhou com consistência eventual?',
      a: '<p>Abordagem em três etapas pedagógicas:</p><ul><li><strong>Etapa 1 — O problema concreto</strong>: mostrar o cenário de edição colaborativa. "Dois usuários editam o mesmo documento offline. Como mergiamos sem conflito?" Fazer a experiência visceral antes da teoria.</li><li><strong>Etapa 2 — A intuição antes da matemática</strong>: "Pense num contador de likes — se eu somar meus likes e você somar os seus, e depois juntar tudo, o resultado é correto independente da ordem." Mostrar G-Counter visualmente antes de falar em vetores.</li><li><strong>Etapa 3 — Ferramentas prontas</strong>: demonstrar Yjs funcionando com TipTap em 30 linhas de código. O time não precisa entender YATA para usar. Educação progressiva: use a lib → entenda a estrutura → entenda o algoritmo.</li></ul><p>Evitar: começar com a prova matemática de ACI ou vector clocks. Começar pelo problema, não pela solução.</p>',
      tip: 'Esta pergunta avalia habilidade de comunicação técnica, não só conhecimento. A resposta "começo pela intuição, não pela matemática" é o sinal de quem ensina bem.',
    },
    {
      level: 'pleno',
      q: 'O que é um LWW-Register e como funciona na prática?',
      a: '<p><strong>LWW-Register (Last Write Wins Register)</strong>: CRDT mais simples. Armazena um único valor com timestamp. Merge: vence o maior timestamp.</p><p>Estrutura: <code>{ value: T, timestamp: number }</code></p><p>Merge: <code>merge(A, B) = A.timestamp > B.timestamp ? A : B</code></p><p>Usos práticos:</p><ul><li>Status online/offline de usuário — "último update vence" é semanticamente correto</li><li>Configuração de perfil — última atualização é a válida</li><li>Cassandra usa LWW-Register por padrão com timestamp do cliente</li></ul><p>Problemas:</p><ul><li>Clock skew: relógios de clientes diferentes têm desvio. AWS tem ~200μs, mas em condições adversas pode chegar a segundos.</li><li>Perde dados silenciosamente: update simultâneo — apenas um sobrevive sem erro.</li></ul>',
      tip: 'Mencionar clock skew como problema prático, não teórico. Em Cassandra com múltiplos datacenters, clock skew de segundos pode fazer LWW descartar updates recentes.',
    },
    {
      level: 'pleno',
      q: 'Quais bibliotecas CRDT você usaria em produção hoje e por quê?',
      a: '<p>Recomendações por caso de uso:</p><ul><li><strong>Yjs</strong>: editor colaborativo em tempo real. Melhor integração com editores de texto (ProseMirror, TipTap, Monaco). Suporte a WebRTC peer-to-peer, WebSocket e offline com IndexedDB. Comunidade ativa.</li><li><strong>Automerge 2.0</strong>: dados JSON colaborativos sem editor de texto. Reescrito em Rust com WASM — funciona em qualquer linguagem. Histórico completo de operações. Flexível para estruturas arbitrárias.</li><li><strong>Loro</strong>: biblioteca Rust nova (2023) focada em performance extrema. WASM para browser. Suporte a movimentação de nós em árvore — problema difícil que Yjs e Automerge não resolvem bem.</li><li><strong>Redis Enterprise CRDT</strong>: para dados transacionais em multi-região. Não exige mudança na aplicação — semântica CRDT na camada de storage.</li></ul>',
      tip: 'Mencionar Loro demonstra que você está acompanhando o estado da arte em 2024-2025. O problema de "tree move" (mover subárvore sem criar ciclos) é um avanço recente.',
    },
  ],
  diagrams: [
    {
      title: 'Tipos de CRDT — Hierarquia e Uso',
      html: `<style>
.crdt-hier { font-family: 'Space Grotesk', sans-serif; background: #0f172a; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.crdt-row { display: grid; grid-template-columns: 120px 1fr 1fr; gap: 12px; padding: 10px 14px; border-radius: 8px; margin-bottom: 8px; align-items: start; }
.crdt-name { font-weight: 700; font-size: 13px; }
.crdt-how { font-size: 11px; color: #94a3b8; line-height: 1.4; }
.crdt-use { font-size: 11px; color: #7dd3fc; line-height: 1.4; }
.crdt-header { display: grid; grid-template-columns: 120px 1fr 1fr; gap: 12px; padding: 6px 14px; margin-bottom: 4px; font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #475569; }
</style>
<div class="crdt-hier">
  <h3 style="margin:0 0 16px;font-size:15px;color:#8b5cf6;">TIPOS DE CRDT — DO SIMPLES AO COMPLEXO</h3>
  <div class="crdt-header"><div>Tipo</div><div>Como Funciona</div><div>Quando Usar</div></div>
  <div class="crdt-row" style="background:#1a1f2e;">
    <div><div class="crdt-name" style="color:#4ade80;">G-Counter</div><div style="font-size:10px;color:#475569;margin-top:2px;">Grow-only</div></div>
    <div class="crdt-how">Vetor por réplica. Merge = max. Read = sum. Só incrementa.</div>
    <div class="crdt-use">Likes, views, eventos analíticos</div>
  </div>
  <div class="crdt-row" style="background:#1e1f2e;">
    <div><div class="crdt-name" style="color:#a78bfa;">PN-Counter</div><div style="font-size:10px;color:#475569;margin-top:2px;">Increment/Decrement</div></div>
    <div class="crdt-how">P-vetor + N-vetor. Merge = max em cada. Read = sum(P) - sum(N).</div>
    <div class="crdt-use">Estoque eventual, score, rating</div>
  </div>
  <div class="crdt-row" style="background:#1a1f2e;">
    <div><div class="crdt-name" style="color:#38bdf8;">G-Set</div><div style="font-size:10px;color:#475569;margin-top:2px;">Add-only Set</div></div>
    <div class="crdt-how">Conjunto. Merge = union. Sem remove. Idempotente por natureza.</div>
    <div class="crdt-use">Tags imutáveis, whitelist</div>
  </div>
  <div class="crdt-row" style="background:#1e1f2e;">
    <div><div class="crdt-name" style="color:#f59e0b;">2P-Set</div><div style="font-size:10px;color:#475569;margin-top:2px;">Add + Remove</div></div>
    <div class="crdt-how">G-Set adds + G-Set removes. Elemento no removes → deletado. Sem re-add.</div>
    <div class="crdt-use">Listas com delete permanente</div>
  </div>
  <div class="crdt-row" style="background:#1a1f2e;">
    <div><div class="crdt-name" style="color:#f97316;">OR-Set</div><div style="font-size:10px;color:#475569;margin-top:2px;">Observed-Remove</div></div>
    <div class="crdt-how">Add gera UUID-tag. Remove especifica tags observadas. Re-add cria novas tags. Add concurrent ganha.</div>
    <div class="crdt-use">Listas colaborativas, Riak KV</div>
  </div>
  <div class="crdt-row" style="background:#1e1f2e;">
    <div><div class="crdt-name" style="color:#ec4899;">LWW-Register</div><div style="font-size:10px;color:#475569;margin-top:2px;">Last Write Wins</div></div>
    <div class="crdt-how">Valor + timestamp. Merge = maior timestamp vence. Pode perder dados em clock skew.</div>
    <div class="crdt-use">Status usuário, config simples</div>
  </div>
  <div style="margin-top:12px;background:#1e293b;border-radius:8px;padding:10px;font-size:11px;color:#94a3b8;">
    <strong style="color:#8b5cf6;">Regra de ouro:</strong> quanto mais complexo o CRDT, mais expressivo mas mais metadata. OR-Set &gt; 2P-Set &gt; G-Set em expressividade. G-Counter &gt; PN-Counter em simplicidade.
  </div>
</div>`,
      caption: 'Cada tipo de CRDT resolve um problema específico com trade-off de complexidade vs expressividade.',
    },
    {
      title: 'G-Counter — Merge Visual entre Réplicas',
      html: `<style>
.crdt-gc { font-family: 'JetBrains Mono', monospace; background: #0f172a; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.crdt-replicas { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.crdt-replica { background: #1e293b; border-radius: 10px; padding: 16px; }
.crdt-replica-title { font-size: 12px; font-weight: 700; margin-bottom: 12px; }
.crdt-vec { display: flex; gap: 6px; margin-bottom: 8px; }
.crdt-slot { width: 48px; height: 48px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.crdt-slot-label { font-size: 9px; color: #64748b; margin-bottom: 2px; }
.crdt-slot-val { font-size: 20px; font-weight: 700; }
.crdt-read { font-size: 12px; color: #94a3b8; margin-top: 8px; }
.crdt-arrow { text-align: center; font-size: 24px; color: #8b5cf6; margin: 8px 0; }
.crdt-merged { background: #1a1a2e; border-radius: 10px; padding: 16px; border: 2px solid #8b5cf6; }
</style>
<div class="crdt-gc">
  <h3 style="margin:0 0 16px;font-size:15px;color:#8b5cf6;">G-COUNTER — MERGE ENTRE RÉPLICAS</h3>
  <p style="margin:0 0 16px;font-size:12px;color:#94a3b8;">Três réplicas (A, B, C) incrementam independentemente e se mergeiam.</p>
  <div class="crdt-replicas">
    <div class="crdt-replica" style="border-left:3px solid #4ade80;">
      <div class="crdt-replica-title" style="color:#4ade80;">Réplica A — 3 likes locais</div>
      <div class="crdt-vec">
        <div class="crdt-slot" style="background:#0d2a0d;">
          <div class="crdt-slot-label">A</div>
          <div class="crdt-slot-val" style="color:#4ade80;">3</div>
        </div>
        <div class="crdt-slot" style="background:#1e293b;">
          <div class="crdt-slot-label">B</div>
          <div class="crdt-slot-val" style="color:#475569;">0</div>
        </div>
        <div class="crdt-slot" style="background:#1e293b;">
          <div class="crdt-slot-label">C</div>
          <div class="crdt-slot-val" style="color:#475569;">0</div>
        </div>
      </div>
      <div class="crdt-read">Read local: 3 + 0 + 0 = <strong style="color:#4ade80;">3</strong></div>
    </div>
    <div class="crdt-replica" style="border-left:3px solid #38bdf8;">
      <div class="crdt-replica-title" style="color:#38bdf8;">Réplica B — 2 likes locais</div>
      <div class="crdt-vec">
        <div class="crdt-slot" style="background:#1e293b;">
          <div class="crdt-slot-label">A</div>
          <div class="crdt-slot-val" style="color:#475569;">0</div>
        </div>
        <div class="crdt-slot" style="background:#0d1a2e;">
          <div class="crdt-slot-label">B</div>
          <div class="crdt-slot-val" style="color:#38bdf8;">2</div>
        </div>
        <div class="crdt-slot" style="background:#1e293b;">
          <div class="crdt-slot-label">C</div>
          <div class="crdt-slot-val" style="color:#475569;">0</div>
        </div>
      </div>
      <div class="crdt-read">Read local: 0 + 2 + 0 = <strong style="color:#38bdf8;">2</strong></div>
    </div>
  </div>
  <div class="crdt-arrow">⬇ merge(A, B) = max por slot ⬇</div>
  <div class="crdt-merged">
    <div style="font-size:12px;font-weight:700;color:#8b5cf6;margin-bottom:12px;">Estado Mergeado (todas as réplicas convergem)</div>
    <div class="crdt-vec" style="justify-content:center;">
      <div class="crdt-slot" style="background:#0d2a0d;">
        <div class="crdt-slot-label">A</div>
        <div class="crdt-slot-val" style="color:#4ade80;">3</div>
      </div>
      <div class="crdt-slot" style="background:#0d1a2e;">
        <div class="crdt-slot-label">B</div>
        <div class="crdt-slot-val" style="color:#38bdf8;">2</div>
      </div>
      <div class="crdt-slot" style="background:#1e293b;">
        <div class="crdt-slot-label">C</div>
        <div class="crdt-slot-val" style="color:#475569;">0</div>
      </div>
    </div>
    <div style="text-align:center;margin-top:12px;font-size:14px;">Read total: 3 + 2 + 0 = <strong style="color:#8b5cf6;font-size:18px;">5</strong></div>
    <div style="text-align:center;font-size:11px;color:#94a3b8;margin-top:6px;">Merge = max(A[i], B[i]) por slot. Qualquer ordem produz o mesmo resultado.</div>
  </div>
</div>`,
      caption: 'G-Counter: merge é simplesmente o máximo por slot. Qualquer ordem de operações converge para o mesmo total.',
    },
    {
      title: 'CRDT vs OT — Comparação Arquitetural',
      html: `<style>
.crdt-vs { font-family: 'Space Grotesk', sans-serif; background: #0f172a; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.crdt-vs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 16px; }
.crdt-vs-col { border-radius: 10px; padding: 16px; }
.crdt-vs-title { font-size: 14px; font-weight: 700; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #334155; }
.crdt-vs-item { display: flex; gap: 8px; margin-bottom: 8px; font-size: 12px; align-items: flex-start; }
.crdt-vs-icon { flex-shrink: 0; margin-top: 1px; }
.crdt-vs-text { color: #94a3b8; }
.crdt-vs-arch { margin-top: 16px; background: #1e293b; border-radius: 8px; padding: 14px; font-size: 12px; }
</style>
<div class="crdt-vs">
  <h3 style="margin:0 0 4px;font-size:15px;color:#8b5cf6;">CRDT vs OT — ABORDAGENS PARA COLABORAÇÃO</h3>
  <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Dois paradigmas com trade-offs fundamentais diferentes.</p>
  <div class="crdt-vs-grid">
    <div class="crdt-vs-col" style="background:#1a1f2e;border-top:3px solid #8b5cf6;">
      <div class="crdt-vs-title" style="color:#8b5cf6;">CRDT</div>
      <div class="crdt-vs-item"><span class="crdt-vs-icon" style="color:#4ade80;">✓</span><span class="crdt-vs-text">Peer-to-peer — sem servidor central</span></div>
      <div class="crdt-vs-item"><span class="crdt-vs-icon" style="color:#4ade80;">✓</span><span class="crdt-vs-text">Offline-first nativo</span></div>
      <div class="crdt-vs-item"><span class="crdt-vs-icon" style="color:#4ade80;">✓</span><span class="crdt-vs-text">Merge determinístico por propriedade matemática</span></div>
      <div class="crdt-vs-item"><span class="crdt-vs-icon" style="color:#4ade80;">✓</span><span class="crdt-vs-text">Multi-servidor sem coordenação</span></div>
      <div class="crdt-vs-item"><span class="crdt-vs-icon" style="color:#f87171;">✗</span><span class="crdt-vs-text">Metadata cresce (tombstones)</span></div>
      <div class="crdt-vs-item"><span class="crdt-vs-icon" style="color:#f87171;">✗</span><span class="crdt-vs-text">Semântica restrita (estruturas suportadas)</span></div>
      <div style="margin-top:10px;font-size:11px;color:#8b5cf6;font-weight:600;">Usado por: Figma, Linear, Notion offline, Riak</div>
    </div>
    <div class="crdt-vs-col" style="background:#1e1a2e;border-top:3px solid #38bdf8;">
      <div class="crdt-vs-title" style="color:#38bdf8;">OT (Operational Transform)</div>
      <div class="crdt-vs-item"><span class="crdt-vs-icon" style="color:#4ade80;">✓</span><span class="crdt-vs-text">Modelo de texto rico (formatação complexa)</span></div>
      <div class="crdt-vs-item"><span class="crdt-vs-icon" style="color:#4ade80;">✓</span><span class="crdt-vs-text">Undo/redo arbitrário</span></div>
      <div class="crdt-vs-item"><span class="crdt-vs-icon" style="color:#4ade80;">✓</span><span class="crdt-vs-text">Maduro (Google Docs desde 2006)</span></div>
      <div class="crdt-vs-item"><span class="crdt-vs-icon" style="color:#f87171;">✗</span><span class="crdt-vs-text">Exige servidor central para ordenar operações</span></div>
      <div class="crdt-vs-item"><span class="crdt-vs-icon" style="color:#f87171;">✗</span><span class="crdt-vs-text">Algoritmos de transformação complexos e difíceis de provar corretos</span></div>
      <div class="crdt-vs-item"><span class="crdt-vs-icon" style="color:#f87171;">✗</span><span class="crdt-vs-text">Não funciona offline sem servidor</span></div>
      <div style="margin-top:10px;font-size:11px;color:#38bdf8;font-weight:600;">Usado por: Google Docs, Etherpad</div>
    </div>
  </div>
</div>`,
      caption: 'CRDT e OT resolvem o mesmo problema com arquiteturas opostas. A escolha depende de se você tem servidor central e qual nível de offline você precisa.',
    },
  ],
  mnemonics: [
    {
      label: 'ACI — As Três Propriedades que Garantem Convergência',
      trick: 'ACI: Associativo, Comutativo, Idempotente',
      explanation: 'Associativo = ordem de agrupamento não importa (merge(A, merge(B,C)) = merge(merge(A,B),C)). Comutativo = ordem de chegada não importa (merge(A,B) = merge(B,A)). Idempotente = receber duas vezes não muda nada (merge(A,A) = A). As três juntas garantem que qualquer ordem de operações converge.',
    },
    {
      label: 'GSO — Hierarquia dos Sets',
      trick: 'GSO: G-Set → 2P-Set → OR-Set (do simples ao poderoso)',
      explanation: 'G-Set: só add (mais simples). 2P-Set: add e remove permanente (mas sem re-add). OR-Set: add, remove e re-add (mais expressivo). Mais poder = mais metadata. Escolha o mais simples que resolve o problema.',
    },
    {
      label: '"P2P sem conflito, mas sem invariante"',
      trick: 'CRDT = convergência peer-to-peer SEM coordenação, MAS SEM invariantes globais',
      explanation: 'CRDT garante que todas as réplicas convergem para o mesmo estado (peer-to-peer, sem servidor). O que NÃO garante: invariantes globais como "saldo >= 0". Para isso, você precisa de coordenação — e coordenação anula o benefício do CRDT.',
    },
    {
      label: 'LWW — Last-Write-Wins Perde Dados',
      trick: 'LWW = Loses Work Willingly (perde trabalho voluntariamente)',
      explanation: 'LWW é tecnicamente um CRDT, mas é perigoso porque dois usuários editando simultaneamente — apenas um sobrevive, silenciosamente. Funciona quando "último update é correto" (status online), mas não em colaboração real.',
    },
  ],
  cheatsheet: {
    title: 'CRDTs — Cheatsheet',
    html: `<style>
.crdt-cs { font-family: 'JetBrains Mono', monospace; background: #0f172a; padding: 20px; border-radius: 10px; color: #e2e8f0; font-size: 12px; }
.crdt-cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.crdt-cs-sec { background: #1e293b; border-radius: 8px; padding: 14px; }
.crdt-cs-title { font-size: 11px; font-weight: 700; color: #8b5cf6; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #334155; padding-bottom: 6px; }
.crdt-cs-row { display: flex; gap: 8px; margin-bottom: 6px; }
.crdt-cs-lbl { color: #a78bfa; font-weight: 700; min-width: 90px; }
.crdt-cs-val { color: #94a3b8; }
</style>
<div class="crdt-cs">
  <div style="text-align:center;margin-bottom:14px;font-size:14px;color:#8b5cf6;font-weight:700;">CRDTs — REFERÊNCIA RÁPIDA</div>
  <div class="crdt-cs-grid">
    <div class="crdt-cs-sec">
      <div class="crdt-cs-title">Propriedades (ACI)</div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl">Associativo</span><span class="crdt-cs-val">merge(A, merge(B,C)) = merge(merge(A,B), C)</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl">Comutativo</span><span class="crdt-cs-val">merge(A, B) = merge(B, A)</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl">Idempotente</span><span class="crdt-cs-val">merge(A, A) = A</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl">Resultado</span><span class="crdt-cs-val">Convergência garantida sem coordenação</span></div>
    </div>
    <div class="crdt-cs-sec">
      <div class="crdt-cs-title">Tipos de CRDT</div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#4ade80;">G-Counter</span><span class="crdt-cs-val">Vetor max. Só incrementa.</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#a78bfa;">PN-Counter</span><span class="crdt-cs-val">G-Counter P+N. Inc e Dec.</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#38bdf8;">G-Set</span><span class="crdt-cs-val">Union. Só add.</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#f59e0b;">2P-Set</span><span class="crdt-cs-val">Add + tombstone. Sem re-add.</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#f97316;">OR-Set</span><span class="crdt-cs-val">UUID-tag. Re-add ok. Padrão.</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#ec4899;">LWW-Reg</span><span class="crdt-cs-val">Maior timestamp. Perde dados.</span></div>
    </div>
    <div class="crdt-cs-sec">
      <div class="crdt-cs-title">Bibliotecas</div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#4ade80;">Yjs</span><span class="crdt-cs-val">Editor colaborativo. YATA algorithm. TipTap/ProseMirror/Monaco.</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#a78bfa;">Automerge</span><span class="crdt-cs-val">JSON genérico. Rust+WASM. Histórico completo.</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#38bdf8;">Loro</span><span class="crdt-cs-val">Rust. Tree move. Alta performance.</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#f87171;">Riak DT</span><span class="crdt-cs-val">DB com CRDT nativo. OR-Set, PN-Counter.</span></div>
    </div>
    <div class="crdt-cs-sec">
      <div class="crdt-cs-title">Quando NÃO usar</div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#f87171;">Invariante</span><span class="crdt-cs-val">Saldo &gt;= 0, estoque exato — exige coordenação</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#f87171;">Cross-entidade</span><span class="crdt-cs-val">Operação depende de estado de outra entidade</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#f87171;">Estrutura ad-hoc</span><span class="crdt-cs-val">Use lib existente — CRDT caseiro tem bugs sutis</span></div>
      <div class="crdt-cs-row"><span class="crdt-cs-lbl" style="color:#f59e0b;">CRDT vs OT</span><span class="crdt-cs-val">OT exige server central; CRDT é P2P</span></div>
    </div>
  </div>
</div>`,
    caption: 'Referência rápida: propriedades, tipos, bibliotecas e quando não usar.',
  },
  mindmap: {
    title: 'CRDTs — Mind Map',
    html: `<style>
.crdt-mm { font-family: 'Space Grotesk', sans-serif; background: #0f172a; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.crdt-mm-center { background: #8b5cf6; color: #fff; border-radius: 12px; padding: 12px 24px; text-align: center; font-weight: 700; font-size: 15px; display: inline-block; margin-bottom: 20px; }
.crdt-mm-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
.crdt-mm-branch { background: #1e293b; border-radius: 10px; padding: 14px; border-top: 3px solid; }
.crdt-mm-title { font-weight: 700; font-size: 13px; margin-bottom: 8px; }
.crdt-mm-leaf { font-size: 11px; color: #94a3b8; padding: 3px 0; display: flex; gap: 6px; }
.crdt-mm-leaf::before { content: "•"; flex-shrink: 0; }
</style>
<div class="crdt-mm">
  <div style="text-align:center;"><div class="crdt-mm-center">CRDTs</div></div>
  <div class="crdt-mm-grid">
    <div class="crdt-mm-branch" style="border-color:#a78bfa;">
      <div class="crdt-mm-title" style="color:#a78bfa;">Propriedades (ACI)</div>
      <div class="crdt-mm-leaf">Associativo (agrupamento)</div>
      <div class="crdt-mm-leaf">Comutativo (ordem)</div>
      <div class="crdt-mm-leaf">Idempotente (duplicata)</div>
      <div class="crdt-mm-leaf">Strong Eventual Consistency</div>
    </div>
    <div class="crdt-mm-branch" style="border-color:#4ade80;">
      <div class="crdt-mm-title" style="color:#4ade80;">Counters</div>
      <div class="crdt-mm-leaf">G-Counter (grow-only)</div>
      <div class="crdt-mm-leaf">PN-Counter (+ e -)</div>
      <div class="crdt-mm-leaf">Merge = max por slot</div>
      <div class="crdt-mm-leaf">Read = sum de todos</div>
    </div>
    <div class="crdt-mm-branch" style="border-color:#f97316;">
      <div class="crdt-mm-title" style="color:#f97316;">Sets</div>
      <div class="crdt-mm-leaf">G-Set (add-only)</div>
      <div class="crdt-mm-leaf">2P-Set (tombstones)</div>
      <div class="crdt-mm-leaf">OR-Set (UUID tags)</div>
      <div class="crdt-mm-leaf">Add concurrent wins</div>
    </div>
    <div class="crdt-mm-branch" style="border-color:#38bdf8;">
      <div class="crdt-mm-title" style="color:#38bdf8;">Variantes</div>
      <div class="crdt-mm-leaf">CvRDT (state-based)</div>
      <div class="crdt-mm-leaf">CmRDT (op-based)</div>
      <div class="crdt-mm-leaf">LWW-Register</div>
      <div class="crdt-mm-leaf">MV-Register (multi-value)</div>
    </div>
    <div class="crdt-mm-branch" style="border-color:#ec4899;">
      <div class="crdt-mm-title" style="color:#ec4899;">Bibliotecas</div>
      <div class="crdt-mm-leaf">Yjs (YATA, editores)</div>
      <div class="crdt-mm-leaf">Automerge (JSON, Rust)</div>
      <div class="crdt-mm-leaf">Loro (tree move)</div>
      <div class="crdt-mm-leaf">Riak DT (banco nativo)</div>
    </div>
    <div class="crdt-mm-branch" style="border-color:#f59e0b;">
      <div class="crdt-mm-title" style="color:#f59e0b;">Limitações</div>
      <div class="crdt-mm-leaf">Sem invariantes globais</div>
      <div class="crdt-mm-leaf">Metadata cresce (GC)</div>
      <div class="crdt-mm-leaf">Semântica restrita</div>
      <div class="crdt-mm-leaf">LWW perde dados</div>
    </div>
  </div>
</div>`,
    caption: 'Mapa mental completo: propriedades, tipos, variantes, bibliotecas e limitações de CRDTs.',
  },
  exercises: [
    {
      level: 'iniciante',
      title: 'Implementar G-Counter do zero',
      description: 'Implemente um G-Counter em TypeScript com três réplicas simuladas. Cada réplica deve incrementar seu próprio slot. Implemente as funções increment(replicaId), merge(a, b) e read(counter). Escreva testes que confirmam que merge([3,0,0], [0,2,0]) = [3,2,0] e que merge é comutativo (merge(A,B) = merge(B,A)) e idempotente (merge(A,A) = A).',
      concepts: ['G-Counter', 'vector clock', 'merge', 'comutatividade', 'idempotência', 'ACI'],
    },
    {
      level: 'intermediario',
      title: 'Editor colaborativo offline com Yjs',
      description: 'Crie uma aplicação React com dois "clientes" simulados que editam um documento de texto compartilhado usando Yjs (Y.Text). Simule offline: desconecte os clientes, faça edições em ambos, reconecte e observe a convergência automática. Adicione um provider y-indexeddb para persistência offline. Teste o cenário: cliente A edita linha 1 offline, cliente B deleta linha 1 offline — qual é o comportamento após reconexão?',
      concepts: ['Yjs', 'Y.Text', 'offline-first', 'convergência', 'y-indexeddb', 'provider'],
    },
    {
      level: 'senior',
      title: 'OR-Set com garbage collection',
      description: 'Implemente um OR-Set completo em TypeScript com: add(item) → gera UUID único para o item, remove(item) → marca todos UUIDs do item como removidos, merge(a, b) → union de adds, union de removes, read() → items sem todos os UUIDs removidos. Adicione garbage collection: implementa snapshot que descarta tombstones quando vector clock de todos os peers confirma que conhecem o remove. Documente os trade-offs do GC (o que acontece se peer atrasado tenta sincronizar após GC).',
      concepts: ['OR-Set', 'tombstone', 'UUID', 'garbage collection', 'vector clock', 'snapshot', 'semântica add-wins'],
    },
  ],
  videos: [
    {
      title: 'CRDTs: The Hard Parts — Martin Kleppmann',
      channel: 'Hydra Distributed Computing Conference',
      url: 'https://www.youtube.com/watch?v=PMVBuMK_pJY',
      topic: 'Problemas difíceis em CRDTs: tree move, undo, interação com UI',
    },
    {
      title: 'An introduction to CRDTs — Martin Kleppmann',
      channel: 'Martin Kleppmann',
      url: 'https://www.youtube.com/watch?v=B5NULPSiOGw',
      topic: 'Fundamentos de CRDTs, propriedades, tipos, exemplos',
    },
    {
      title: 'Yjs — Collaborative Editing at Scale',
      channel: 'Kevin Jahns (criador do Yjs)',
      url: 'https://www.youtube.com/watch?v=0l5XgnQ6rB4',
      topic: 'Como Yjs funciona internamente, YATA algorithm, performance',
    },
    {
      title: 'Automerge 2.0 — CRDTs in Rust with WASM',
      channel: 'Strange Loop Conference',
      url: 'https://www.youtube.com/watch?v=Mr0a5KyD6BU',
      topic: 'Automerge reescrito em Rust, WASM, performance, API',
    },
    {
      title: 'Conflict-Free Replicated Data Types — Shapiro',
      channel: 'INRIA',
      url: 'https://www.youtube.com/watch?v=ebWVLVhiaiY',
      topic: 'Paper original de CRDTs — fundamentos matemáticos',
    },
  ],
  resources: [
    { title: 'CRDT.tech — Papers e recursos sobre CRDTs', url: 'https://crdt.tech/', kind: 'docs' },
    { title: 'Yjs — Documentação oficial', url: 'https://docs.yjs.dev/', kind: 'docs' },
    { title: 'Automerge — Documentação oficial', url: 'https://automerge.org/docs/', kind: 'docs' },
    { title: 'Shapiro et al — A comprehensive study of CRDTs (paper original)', url: 'https://inria.hal.science/inria-00555588/document', kind: 'artigo' },
    { title: 'Designing Data-Intensive Applications — Kleppmann (capítulo 9)', url: 'https://dataintensive.net/', kind: 'livro' },
    { title: 'Loro — CRDT library in Rust', url: 'https://loro.dev/', kind: 'docs' },
    { title: 'Riak Data Types Documentation', url: 'https://docs.riak.com/riak/kv/latest/developing/data-types/', kind: 'docs' },
    { title: 'Joseph Gentle — "I was wrong. CRDTs are the future"', url: 'https://josephg.com/blog/crdts-are-the-future/', kind: 'artigo' },
  ],
  codeExamples: [
    {
      title: 'G-Counter — Implementação completa em TypeScript',
      language: 'typescript',
      code: `// G-Counter: counter que só cresce, merge sem conflito
// Cada réplica tem um slot exclusivo no vetor

type ReplicaId = string
type GCounter = Record<ReplicaId, number>

function increment(counter: GCounter, replicaId: ReplicaId): GCounter {
  return {
    ...counter,
    [replicaId]: (counter[replicaId] ?? 0) + 1,
  }
}

function merge(a: GCounter, b: GCounter): GCounter {
  // merge = max por chave — COMUTATIVO e IDEMPOTENTE
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  const result: GCounter = {}
  for (const key of keys) {
    result[key] = Math.max(a[key] ?? 0, b[key] ?? 0)
  }
  return result
}

function read(counter: GCounter): number {
  return Object.values(counter).reduce((sum, v) => sum + v, 0)
}

// Simulação: 3 réplicas offline editando simultaneamente
let replicaA: GCounter = {}
let replicaB: GCounter = {}
let replicaC: GCounter = {}

// Réplica A: 3 likes
replicaA = increment(replicaA, 'A')
replicaA = increment(replicaA, 'A')
replicaA = increment(replicaA, 'A')

// Réplica B: 2 likes
replicaB = increment(replicaB, 'B')
replicaB = increment(replicaB, 'B')

// Réplica C: 1 like
replicaC = increment(replicaC, 'C')

// Merge — qualquer ordem produz o mesmo resultado
const merged = merge(merge(replicaA, replicaB), replicaC)
console.log(read(merged)) // 6

// Prova de comutatividade
const merged2 = merge(merge(replicaC, replicaA), replicaB)
console.log(read(merged) === read(merged2)) // true

// Prova de idempotência
const merged3 = merge(merged, merged)
console.log(JSON.stringify(merged) === JSON.stringify(merged3)) // true`,
    },
    {
      title: 'Yjs — Editor colaborativo com dois clientes simulados',
      language: 'typescript',
      code: `// Simulação de edição colaborativa offline com Yjs
// npm install yjs

import * as Y from 'yjs'

// Dois documentos Yjs simulando dois clientes
const docA = new Y.Doc()
const docB = new Y.Doc()

// Ambos têm Y.Text compartilhado
const textA = docA.getText('shared')
const textB = docB.getText('shared')

// Estado inicial: ambos têm o mesmo texto
docA.transact(() => {
  textA.insert(0, 'Hello World')
})

// Sincroniza estado de A para B
const updateFromA = Y.encodeStateAsUpdate(docA)
Y.applyUpdate(docB, updateFromA)

console.log(textA.toString()) // "Hello World"
console.log(textB.toString()) // "Hello World"

// SIMULA OFFLINE: A e B editam ao mesmo tempo sem saber um do outro
docA.transact(() => {
  textA.insert(5, ', Alice') // "Hello, Alice World"
})

docB.transact(() => {
  textB.insert(6, 'Bob ') // "Hello Bob World"
})

// RECONECTA: troca updates
const updateA = Y.encodeStateAsUpdate(docA)
const updateB = Y.encodeStateAsUpdate(docB)

// Ambos aplicam o update do outro
Y.applyUpdate(docA, updateB)
Y.applyUpdate(docB, updateA)

// CONVERGÊNCIA: ambos chegam ao mesmo estado
console.log(textA.toString()) // determinístico — sempre o mesmo resultado
console.log(textB.toString()) // igual ao de cima
console.log(textA.toString() === textB.toString()) // true — sempre

// Observer para mudanças em tempo real
textA.observe(event => {
  event.changes.delta.forEach(op => {
    if (op.insert) console.log('Inserido:', op.insert)
    if (op.delete) console.log('Deletado:', op.delete, 'chars')
  })
})`,
    },
    {
      title: 'OR-Set — Implementação com UUID tags',
      language: 'typescript',
      code: `// OR-Set: Set com add, remove e re-add
// Cada add gera tag única (UUID). Remove especifica as tags observadas.
// Semantica "add wins": add concurrent com remove → add sobrevive

import { randomUUID } from 'crypto'

type Tag = string  // UUID único
type ItemTags = Set<Tag>

interface ORSet<T> {
  // Map de item → conjunto de tags (de adds ativos)
  entries: Map<string, ItemTags>
  // Tags removidas (tombstones)
  removed: Set<Tag>
}

function createORSet<T>(): ORSet<T> {
  return { entries: new Map(), removed: new Set() }
}

function add<T>(set: ORSet<T>, item: T): { set: ORSet<T>; tag: Tag } {
  const key = JSON.stringify(item)
  const tag = randomUUID()
  const existing = set.entries.get(key) ?? new Set()
  const newEntries = new Map(set.entries)
  newEntries.set(key, new Set([...existing, tag]))
  return { set: { ...set, entries: newEntries }, tag }
}

function remove<T>(set: ORSet<T>, item: T): ORSet<T> {
  const key = JSON.stringify(item)
  const tags = set.entries.get(key) ?? new Set()
  // Remove apenas as tags que observamos neste momento
  const newRemoved = new Set([...set.removed, ...tags])
  const newEntries = new Map(set.entries)
  newEntries.delete(key)
  return { ...set, entries: newEntries, removed: newRemoved }
}

function merge<T>(a: ORSet<T>, b: ORSet<T>): ORSet<T> {
  const allKeys = new Set([...a.entries.keys(), ...b.entries.keys()])
  const allRemoved = new Set([...a.removed, ...b.removed])
  const merged = new Map<string, ItemTags>()

  for (const key of allKeys) {
    const tagsA = a.entries.get(key) ?? new Set()
    const tagsB = b.entries.get(key) ?? new Set()
    // Union de tags — remove apenas os que estão em allRemoved
    const combinedTags = new Set([...tagsA, ...tagsB])
    const activeTags = new Set([...combinedTags].filter(t => !allRemoved.has(t)))
    if (activeTags.size > 0) merged.set(key, activeTags)
  }

  return { entries: merged, removed: allRemoved }
}

function read<T>(set: ORSet<T>): T[] {
  return [...set.entries.keys()].map(k => JSON.parse(k) as T)
}

// Teste: add concurrent com remove → add wins
let setA = createORSet<string>()
let setB = createORSet<string>()

const { set: setA1, tag } = add(setA, 'item-1')
setA = setA1

// Sincroniza A → B
setB = merge(setA, setB)

// Agora A e B editam offline:
// A adiciona 'item-1' novamente (re-add)
const { set: setA2 } = add(setA, 'item-1')
setA = setA2

// B remove 'item-1' (remove os tags que conhecia)
setB = remove(setB, 'item-1')

// Merge: A adicionou, B removeu — add wins porque a nova tag de A não está em removed de B
const final = merge(setA, setB)
console.log(read(final)) // ['item-1'] — add wins em concorrência`,
    },
  ],
}

export default crdts
