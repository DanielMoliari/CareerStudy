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
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion, CompScenario } from '@/components/pdfs/ComparativeRefPdf'

// ── Paleta Consistent Hashing ─────────────────────────────────────────────────
const C = '#6366f1'

// ── Cards de PDF ──────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review — Consistent Hashing',
    subtitle: 'As 20 perguntas mais cobradas em entrevista sobre consistent hashing',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa nível pleno e sênior: hash módulo vs consistent hashing, anel circular, vnodes, matemática de remapeamento K/(N+1), replicação com preference list, R+W>N, jump consistent hashing, rendezvous hashing, bounded loads, Redis hash slots, Cassandra Murmur3, hotspot diagnosis com nodetool.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet — Consistent Hashing',
    subtitle: 'Algoritmos, complexidades, sistemas reais e implementação',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: Ring + vnodes (O(log N)), Jump hash (O(ln n)), Rendezvous HRW (O(N)), comparativo de algoritmos, sistemas reais (Cassandra Murmur3, DynamoDB token ring, Redis hash slots, Memcached Ketama, Akamai HRW), fórmula de remapeamento K/(N+1), dimensionamento de vnodes.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos — Consistent Hashing',
    subtitle: 'Âncoras verbais para anel, vnodes, algoritmos e sistemas',
    type: 'mnemonics',
    pages: 3,
    description: 'Truques verbais: ANEL (Apenas Nós Escalonados Linearmente), VN (Vários Nomes por Nó), JHR (Jump Horário Ring), Lei 1/N. Cartões de memorização para recall em entrevistas de system design.',
    icon: '03',
    goal: 'Memorização ativa',
  },
  {
    id: 'comparative',
    title: 'Comparativo — Variantes e Sistemas',
    subtitle: 'Ring, Jump hash, Rendezvous vs Cassandra, DynamoDB, Redis em critérios',
    type: 'comparative',
    pages: 4,
    description: 'Tabela comparativa de algoritmos (Ring+vnodes, Jump, Rendezvous) e sistemas reais (Cassandra, DynamoDB, Redis Cluster, Memcached, CDN). Critérios: lookup complexity, memória, add/remove node, uso ideal. Cenários: cache distribuído, time-series, CDN, key-value managed.',
    icon: '04',
    goal: 'Decisão de arquitetura',
  },
]

// ── Q&As ──────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Por que hash módulo (key % N) não escala em sistemas distribuídos?',
    a: 'Ao mudar N, quase <strong>todas as chaves remapeiam</strong>. Em N=10 → N=11: <code>(hash(key) % 10) ≠ (hash(key) % 11)</code> para ~91% das chaves.<br><br>Resultado: <strong>thundering herd</strong> — N requisições simultâneas para todos os novos nós com cache vazio. O backend colapsa sob carga súbita.<br><br>Fórmula exata de remapeamento hash módulo: <strong>K × N/(N+1)</strong> chaves. Para K=1M e N=10: 909.090 chaves precisam ser buscadas no backend.<br><br>Consistent hashing resolve: apenas <strong>K/(N+1)</strong> chaves mudam — ~1/N das chaves.',
    tip: 'Mencione o thundering herd pelo nome — é o efeito cascata, não o remapeamento em si, que derruba sistemas em produção.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o anel de consistent hashing? Explique step by step.',
    a: 'O espaço de hash (0 a 2^32−1) é modelado como anel circular:<br><br>1. <strong>Mapear nós:</strong> cada nó recebe <code>hash(node_id)</code> → posição no anel<br>2. <strong>Mapear chave:</strong> cada chave recebe <code>hash(key)</code> → posição no anel<br>3. <strong>Lookup:</strong> a chave vai para o <strong>primeiro nó no sentido horário</strong> a partir da sua posição<br><br><strong>Operações:</strong><br>• Adicionar nó X entre A e B: chaves no arco (A, X] migram para X. Resto permanece.<br>• Remover nó B: chaves de B migram para o próximo nó C. Resto intacto.',
    tip: 'Desenhar o anel na lousa com 3 nós e 3 chaves é a melhor resposta — entrevistadores adoram visualização.',
  },
  {
    level: 'Pleno',
    q: 'O que são virtual nodes (vnodes) e por que resolver o problema de distribuição?',
    a: 'Sem vnodes, N nós podem cair em posições desiguais no anel por acaso estatístico — alguns recebem arcos maiores e portanto mais chaves.<br><br>Com <strong>vnodes</strong>: cada nó físico recebe M posições pseudoaleatórias no anel (M=100-256 típico).<br><br><strong>Benefícios:</strong><br>• Distribuição <strong>estatisticamente uniforme</strong> (desvio padrão ≈ 1/√(N×M) × carga_média)<br>• Falha de nó: carga redistribuída entre <strong>vários</strong> vizinhos, não apenas o próximo<br>• Heterogeneidade: servidor mais potente recebe 2× tokens → 2× carga<br><br>Cassandra: 256 vnodes por padrão. DynamoDB: vnodes internos gerenciados.',
    tip: 'A analogia: 1 nó no anel = 1 bilhete de loteria. 150 vnodes = 150 bilhetes — muito mais estável.',
  },
  {
    level: 'Pleno',
    q: 'Onde consistent hashing é usado em sistemas que você conhece?',
    a: '<strong>Memcached (Ketama):</strong> cliente PHP/Python distribui keys entre servidores de cache via ring.<br><br><strong>Cassandra:</strong> Murmur3Partitioner mapeia partition key para token no anel. 256 vnodes por nó. N réplicas nos próximos nós por preference list.<br><br><strong>Amazon DynamoDB:</strong> partition key hasheada para mapear dados a storage nodes. Preference list por AZ.<br><br><strong>Redis Cluster:</strong> 16.384 hash slots via CRC16(key) % 16384. Variante com slots fixos em vez de anel contínuo.<br><br><strong>CDN Akamai/Cloudflare:</strong> rendezvous hashing (HRW) para selecionar edge server por URL.<br><br><strong>Nginx upstream consistent:</strong> sticky sessions via consistent hashing do IP do cliente.',
    tip: 'Redis Cluster usa hash slots, não anel puro — mencionar a diferença mostra profundidade.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre consistent hashing e sharding por range?',
    a: '<strong>Consistent hashing (hash-based):</strong><br>• Distribuição uniforme por hash<br>• Point lookups O(log N)<br>• Range queries ineficientes — dados sequenciais em nós aleatórios<br><br><strong>Sharding por range:</strong><br>• Cada shard serve intervalo contíguo de chaves<br>• Range queries e sequential scans eficientes<br>• Vulnerável a <strong>hotspots sequenciais</strong> (ex: timestamp como chave → escritas sempre no mesmo shard)<br><br><strong>HBase resolve hotspot com salt prefix:</strong> adicionar hash(key) como prefixo distribui writes entre shards.<br><br><strong>DynamoDB combina ambos:</strong> partition key (hash) para distribuição uniforme + sort key (range) para queries dentro da partição.',
    tip: 'DynamoDB combinando os dois modelos é resposta sênior para "como ter range queries com distribuição uniforme".',
  },
  {
    level: 'Pleno',
    q: 'Como funciona replicação com consistent hashing no Cassandra/DynamoDB?',
    a: 'A chave vai para o <strong>primeiro nó no anel</strong> (coordenador). Réplicas vão para os <strong>N-1 nós seguintes</strong> no sentido horário.<br><br><strong>Preference list (Dynamo paper):</strong> a lista de nós pula nós no mesmo rack físico ou AZ — garantindo tolerância a falhas de infraestrutura física.<br><br><strong>Cassandra exemplo com N=3, R=2, W=2:</strong><br>• Write confirma quando 2 réplicas respondem OK<br>• Read consulta 2 réplicas e retorna versão mais recente<br>• R+W=4 > N=3 → <strong>strong consistency</strong> (quorum)<br><br>Alternar entre CL=ONE (eventual, rápido) e CL=QUORUM (strong, mais lento) é o "tunable consistency".',
    tip: 'Preference list é detalhe do Dynamo paper (2007) — citar mostra que você leu a literatura primária.',
  },
  {
    level: 'Pleno',
    q: 'Como Redis Cluster difere de consistent hashing puro?',
    a: 'Redis Cluster usa <strong>hash slots</strong>: 16.384 slots fixos. Cada chave mapeia para <code>CRC16(key) % 16384</code>. Cada nó é responsável por um subconjunto de slots.<br><br><strong>Diferenças do anel puro:</strong><br>• Slots fixos (16.384) vs anel contínuo (2^32)<br>• Gossip protocol dissemina tabela de slots eficientemente (16.384 bits = ~2KB)<br>• Rebalanceamento: mover N slots de A para B, operação bem definida<br>• Sem vnodes — distribuição depende de configuração manual<br><br><strong>Hashtag:</strong> <code>{user}.posts</code> e <code>{user}.profile</code> vão para o mesmo slot → permite operações multi-key (MGET, pipeline) em chaves relacionadas.',
    tip: 'Hashtag no Redis Cluster é detalhe de produção que impressiona — forçar co-location de chaves relacionadas para operações atômicas.',
  },
  {
    level: 'Senior',
    q: 'Explique a matemática de remapeamento ao adicionar um nó em consistent hashing.',
    a: 'Com N nós e K chaves, cada nó é responsável em média por K/N chaves.<br><br><strong>Adicionando 1 nó (N → N+1):</strong><br>• Novo nó ocupa posição no anel entre dois nós existentes (A e B)<br>• Chaves no arco (A, novo_nó] migram para o novo nó<br>• Esperança matemática: <strong>K/(N+1)</strong> chaves migram<br><br><strong>Hash módulo para comparação:</strong><br>• Chaves que mudam = K × (1 - N/(N+1)) = K × 1/(N+1) × N<br>• Para N=10: K × 10/11 ≈ 0.91K = 91% das chaves<br><br>Consistent hashing migra <strong>N× menos</strong> chaves.<br><br><strong>Com vnodes (M tokens por nó):</strong> desvio padrão de carga ≈ 1/√(N×M) × carga_média. Para N=10, M=150: σ ≈ 2.6% da carga média.',
    tip: 'A derivação exata K/(N+1) e a fórmula do desvio padrão com vnodes são o nível de profundidade que diferencia em final round.',
  },
  {
    level: 'Senior',
    q: 'O que é jump consistent hashing e quando usá-lo em vez do anel?',
    a: 'Algoritmo do Google (Lamping & Veach, 2014) que descarta o anel completamente.<br><br><strong>Algoritmo:</strong><br><code>function jump(key: bigint, numBuckets: number): number</code><br>Loop com gerador linear congruencial. O(ln n) lookup, O(1) memória. Sem estrutura de dados, sem vnodes.<br><br><strong>Vantagens:</strong> mais rápido que anel, footprint mínimo, distribuição uniforme perfeita.<br><br><strong>Limitação crítica:</strong> só suporta adição de nós no <strong>final</strong> — não permite remoção de nó arbitrário.<br><br><strong>Quando usar:</strong> clusters que só crescem, sem necessidade de remover nós específicos. Sharding de storage escalável linear.<br><br><strong>Comparação:</strong> Ring O(log N×M), Jump O(ln n). Para N=1000 nós com M=150 vnodes: Ring faz busca em log(150000)≈17 passos; Jump faz ln(1000)≈7 passos.',
    tip: 'Citar "A Fast, Minimal Memory, Consistent Hash Algorithm" (Lamping & Veach, Google, 2014) pelo título é diferencial.',
  },
  {
    level: 'Senior',
    q: 'O que é rendezvous hashing (HRW) e quando preferir ao anel?',
    a: '<strong>Rendezvous hashing (Highest Random Weight):</strong> para cada chave, calcula <code>hash(chave + nó)</code> para todos os N nós. A chave vai para o nó com o <strong>maior hash resultante</strong>.<br><br><strong>Propriedades:</strong><br>• Sem anel, sem estado persistente<br>• Sem coordenação entre clientes<br>• Distribuição uniforme garantida matematicamente<br>• O(N) por lookup<br><br><strong>Quando preferir ao anel:</strong><br>• N pequeno (5-20 nós)<br>• CDNs: Akamai seleciona edge server por URL via HRW<br>• Sistemas onde simplicidade supera performance<br>• Quando não há banco de dados de estado do anel<br><br><strong>Quando não usar:</strong> N > 50 — O(N) lookup inaceitável.',
    tip: 'Akamai foi onde HRW foi inventado (Thaler & Ravishankar, 1998). Citar a origem histórica mostra profundidade.',
  },
  {
    level: 'Senior',
    q: 'Como consistent hashing com bounded loads resolve hot keys?',
    a: 'Consistent hashing básico não resolve hot keys — uma chave muito popular sobrecarrega sempre o mesmo nó.<br><br><strong>Bounded loads (Mirrokni et al., Google, 2017):</strong> cada nó tem capacidade máxima de <code>(1 + ε) × (total_load / num_nodes)</code>. Quando o nó responsável está na capacidade, redireciona para o <strong>próximo nó disponível</strong> no anel.<br><br>Resultado: carga máxima de qualquer nó nunca excede (1+ε) × carga média. ε=0.25 é típico.<br><br><strong>Estratégias adicionais:</strong><br>• Cache local antes do nó primário<br>• Sub-sharding: <code>hash(key + "_" + random(R))</code> distribui em R réplicas, scatter-gather na leitura<br>• Detecção de top-K keys e tratamento especial (réplicas extras)',
    tip: 'Citar "Consistent Hashing with Bounded Loads" (Mirrokni et al., Google, 2017) mostra que você acompanha state of the art.',
  },
  {
    level: 'Senior',
    q: 'Implemente ConsistentHashRing em TypeScript. Quais estruturas de dados usar?',
    a: '<strong>Estrutura central:</strong> sorted array de tokens + Map de token → nó.<br><br><strong>Por que sorted array e não Set?</strong> Lookup é binary search — O(log N×M). Não é possível com Set não-ordenado.<br><br><strong>Operações:</strong><br>• <strong>addNode(node, M=150):</strong> para i em 0..M-1, gerar <code>token = hash(`${node.id}:${i}`)</code>, inserir no sorted array na posição correta<br>• <strong>removeNode(nodeId):</strong> deletar todos os M tokens do mapa e do sorted array<br>• <strong>getNode(key):</strong> calcular <code>hash(key)</code>, bisectRight no sorted array, obter token, Map lookup. Se idx >= length, wrap para índice 0.<br><br><strong>Complexidades:</strong><br>• addNode: O(M log N×M)<br>• removeNode: O(M log N×M)<br>• getNode: O(log N×M)<br>• Memória: O(N×M)',
    tip: 'Mencionar bisect/upperBound por nome e wrap around para o primeiro token ao passar do último diferencia quem conhece a implementação real.',
  },
  {
    level: 'Senior',
    q: 'Como o Cassandra usa consistent hashing internamente?',
    a: 'Cassandra usa o <strong>Murmur3Partitioner</strong> (padrão desde 1.2) para mapear partition keys para tokens no espaço −2^63 a 2^63−1.<br><br><strong>Fluxo completo:</strong><br>1. Partition key → Murmur3 hash → token (64-bit)<br>2. Token → posição no anel → nó coordenador<br>3. Coordenador replica para N-1 próximos nós (NetworkTopologyStrategy respeita racks/DCs)<br><br><strong>Vnodes no Cassandra:</strong> num_tokens=256 por padrão em cassandra.yaml. Cada nó gera 256 tokens aleatórios. Streaming automático ao adicionar/remover nó.<br><br><strong>Diagnóstico:</strong><br>• <code>nodetool status</code>: % de tokens por nó<br>• <code>nodetool toppartitions</code>: hot partition keys<br>• <code>nodetool decommission</code>: remover nó com streaming automático',
    tip: 'Mudar o partitioner em produção exige full rewrite de todos os dados — RandomPartitioner legacy não tem as garantias do Murmur3.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o recovery de nó com consistent hashing? Explique hinted handoff e Merkle trees.',
    a: '<strong>Hinted handoff:</strong> quando nó B está offline, writes para B são armazenados em outro nó (hintee) com identificação do destinatário. Quando B retorna, o hintee entrega os hints. Garante eventually consistent sem perder writes durante falhas temporárias.<br><br><strong>Anti-entropy via Merkle trees:</strong> após recovery de B, compara sua árvore de hash (Merkle tree) com réplicas. Merkle tree permite identificar quais ranges de chaves estão inconsistentes em O(log K) comparações em vez de comparar todas as K chaves.<br><br><strong>Com vnodes:</strong> carga de nó falho distribuída entre todos os nós com tokens adjacentes — muitos nós, impacto diluído. Sem vnodes, o vizinho imediato absorve toda a carga.',
    tip: 'Hinted handoff + Merkle tree são dois mecanismos centrais do Dynamo paper (2007). Citar ambos por nome é o nível de profundidade de quem leu o paper.',
  },
  {
    level: 'Senior',
    q: 'Quais são as garantias matemáticas provadas no paper original de consistent hashing (Karger 1997)?',
    a: 'O paper de Karger et al. (MIT/Akamai, 1997) prova formalmente:<br><br><strong>1. Balance:</strong> com alta probabilidade, nenhum nó recebe mais que O((log N)/N) fração do total de chaves — distribuição uniforme assintótica.<br><br><strong>2. Monotonicidade:</strong> ao adicionar nó, chaves <strong>só movem de nós existentes para o novo nó</strong> — nunca entre nós já existentes. Propriedade fundamental de correctness.<br><br><strong>3. Spread:</strong> a mesma chave nunca vai para mais que O(log N) servidores diferentes conforme o conjunto de servidores varia.<br><br><strong>Com vnodes:</strong> M tokens por nó no espaço 2^32 comportam-se como M amostras uniformes. Desvio padrão de carga ≈ 1/√(N×M) × carga média.',
    tip: 'Citar "Consistent Hashing and Random Trees" (Karger et al., MIT, 1997) pelo título e instituição é o nível teórico que diferencia em final rounds de empresas top.',
  },
  {
    level: 'Senior',
    q: 'Como diagnosticar e resolver um hotspot de partição em Cassandra?',
    a: '<strong>Diagnóstico:</strong><br>• Monitorar CPU/latência por nó — hotspot = 1 nó com 3-10× mais carga<br>• <code>nodetool tpstats</code>: ver throughput por nó<br>• <code>nodetool toppartitions</code>: identificar partition keys mais quentes<br><br><strong>Soluções por tipo:</strong><br>1. <strong>Desequilíbrio de tokens:</strong> aumentar num_tokens do nó menos carregado + repair<br>2. <strong>Hot partition key por design:</strong><br>   • Adicionar bucket: <code>partition_key = "user:" + user_id + ":" + (timestamp/3600)</code><br>   • Compound key: separar em múltiplas partições por sub-chave<br>3. <strong>Hot key de leitura:</strong> usar replicas com LOCAL_ONE + caching local (in-memory ou Redis na frente)<br>4. <strong>Bounded loads:</strong> configurar cassandra.yaml para distribuir se uma partição excede threshold',
    tip: 'nodetool toppartitions é o comando específico — citar ferramentas reais mostra que você operou Cassandra em produção.',
  },
  {
    level: 'Senior',
    q: 'Compare consistent hashing com hash slot approach (Redis Cluster) — trade-offs.',
    a: '<strong>Consistent hashing (anel + vnodes):</strong><br>• Espaço contínuo (2^32 ou 2^64)<br>• Adição de nó: reclama tokens de vários vizinhos simultaneamente<br>• Mais adequado para clusters que crescem e diminuem arbitrariamente<br>• Cassandra, DynamoDB<br><br><strong>Hash slots (Redis Cluster):</strong><br>• Espaço discreto fixo (16.384 slots)<br>• Rebalanceamento explícito: mover N slots de A para B<br>• Gossip protocol carrega apenas 16.384 bits de estado (~2KB) por nó<br>• Hashtag: <code>{user}.posts</code> e <code>{user}.profile</code> co-locam chaves relacionadas<br>• Mais previsível para operações manuais<br><br><strong>Trade-off central:</strong> anel = automático e flexível. Slots = explícito e controlado.',
    tip: 'Hashtag é a killer feature do Redis Cluster que não existe em anel puro — permite MGET e transactions em chaves relacionadas no mesmo slot.',
  },
  {
    level: 'Senior',
    q: 'Como dimensionar o número ideal de vnodes por nó físico?',
    a: '<strong>Trade-off central:</strong> M alto = mais uniforme mas mais overhead; M baixo = menos overhead mas desequilíbrio.<br><br><strong>Fórmula do desvio padrão:</strong> σ ≈ 1/√(N×M) × carga_média<br>• N=10, M=1: σ ≈ 31.6% (inaceitável)<br>• N=10, M=150: σ ≈ 2.6% (bom)<br>• N=10, M=256: σ ≈ 2.0% (ótimo)<br><br><strong>Regras práticas:</strong><br>• Cassandra padrão: 256. Para clusters >32 nós: considerar 128 para reduzir overhead de repair<br>• Nó com 2× RAM/CPU: dar 2× tokens → 2× carga<br>• Cluster homogêneo grande (100+ nós): M=64 é suficiente estatisticamente<br>• Repair após adicionar nó: mais vnodes = mais streams paralelos, mas mais coordenação',
    tip: 'A fórmula σ ≈ 1/√(N×M) mostra raciocínio quantitativo — rara em entrevistas mas impressiona muito.',
  },
  {
    level: 'Senior',
    q: 'Como consistent hashing é usado em CDNs para maximizar cache hit rate?',
    a: 'CDNs precisam que a mesma URL sempre vá para o mesmo edge server (para cache hits). Consistent hashing garante estabilidade com adição/remoção de POPs.<br><br><strong>Akamai usa rendezvous hashing (HRW):</strong><br>1. Para cada request: lista de candidate edge servers (por latência/geo)<br>2. Para cada candidato: calcula <code>hash(URL + server_id)</code><br>3. Seleciona servidor com maior hash → determinístico e estável<br>4. Remover 1 servidor: apenas ~1/N das URLs redirecionam para outro servidor<br><br><strong>Consistent hashing com vnodes em CDN:</strong> alguns CDNs usam anel com vnodes para distribuir capacidade heterogênea (POPs com diferentes números de servidores).<br><br><strong>Cache efficiency:</strong> sem consistent hashing, qualquer mudança de topologia invalida % alto do cache. Com HRW, apenas ~1/N invalida.',
    tip: 'Akamai foi co-fundada por Tom Leighton e Daniel Lewin, co-autores do paper original de consistent hashing (Karger et al., 1997) — história que ancora o contexto.',
  },
  {
    level: 'Senior',
    q: 'Quais são os principais gotchas de consistent hashing em produção?',
    a: '<strong>1. Hotspot de read sequencial:</strong> hash distribui uniformemente mas acesso temporal (últimas N horas) concentra no mesmo nó em DBs de time-series sem composite key.<br><br><strong>2. Skew de vnodes:</strong> após muitos add/remove sem rebalanceamento cuidadoso, vnodes podem ficar desiguais.<br><br><strong>3. Jump hash: sem removal:</strong> jump hash não suporta remover nó arbitrário — usar anel se o cluster precisa de scale down.<br><br><strong>4. HRW com N grande:</strong> O(N) lookup inapropriado para N>50 — usar anel.<br><br><strong>5. Migração de dados em BD:</strong> adicionar nó em Cassandra/DynamoDB migra dados reais — operação cara, fazer com antecedência (não em pico de tráfego).<br><br><strong>6. Confundir consistent de consistent hashing com consistency do CAP theorem:</strong> temas completamente diferentes.',
    tip: '"Consistent" em consistent hashing refere-se a consistência da função de mapeamento (monotonicidade), não a consistency do CAP. Acertar essa distinção em entrevista é diferencial.',
  },
  {
    level: 'Senior',
    q: 'Como projetaria o particionamento de dados de um sistema de mensagens de alta escala?',
    a: '<strong>Requisitos típicos:</strong> 100M usuários, 1B mensagens/dia, queries por conversation_id, baixa latência de write.<br><br><strong>Design:</strong><br>1. <strong>Partition key:</strong> <code>conversation_id</code> → distribui via Murmur3 para nó responsável<br>2. <strong>Sort key:</strong> <code>timestamp</code> → range queries de mensagens em ordem dentro da conversa<br>3. <strong>Replicação N=3</strong> com preference list por AZ<br>4. <strong>Writes:</strong> CL=QUORUM (W=2) para durabilidade<br>5. <strong>Reads:</strong> CL=LOCAL_ONE (eventual) para latência mínima em listagem<br><br><strong>Hotspot:</strong> grup chat com 1M membros → hot partition. Sub-sharding: <code>conv_id + "_" + (timestamp/3600 % 10)</code> distribui por hora em 10 shards. Scatter-gather na leitura.<br><br>Discord usou Cassandra com exatamente esse modelo.',
    tip: 'Citar Discord como referência real (eles publicaram o artigo técnico sobre migração Cassandra→ScyllaDB) ancora a solução em produção real.',
  },
]

// ── Mnemonics ─────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'ANEL — Apenas Nós Escalonados Linearmente',
    trick: 'Ring: espaço hash linear dobrado em anel. Chave encontra nó no sentido horário.',
    expansion: [
      ['A', 'Apenas — espaço hash é contínuo (0 a 2^32), sem buracos'],
      ['N', 'Nós — cada nó tem hash(node_id) como posição no anel'],
      ['E', 'Escalonados — chaves distribuídas uniformemente pelo anel'],
      ['L', 'Linearmente — lookup é linear (next clockwise node)'],
    ],
    explanation: 'O anel de consistent hashing é um espaço hash linear (0 a 2^32) dobrado em círculo. Adicionar 1 nó afeta apenas 1/N das chaves — o arco entre o predecessor e o novo nó. Lembre: ANEL = anel do hash space.',
    example: 'N=5 nós no anel. Chave "user:1234" cai na posição 750.000. Próximo nó no sentido horário é o nó na posição 900.000. Essa é a resposta.',
    why: 'O conceito de anel circular é o que diferencia consistent hashing de hash módulo. ANEL ancora a estrutura e o fato de que chaves e nós vivem no mesmo espaço.',
  },
  {
    label: 'VN — Vários Nomes por Nó',
    trick: 'Virtual Nodes: cada nó físico tem M identidades (tokens) distribuídas pelo anel.',
    expansion: [
      ['V', 'Vários — M tokens (100-256) por nó físico'],
      ['N', 'Nomes — cada token é uma posição/identidade diferente no anel'],
      ['Uniforme', 'M tokens aleatórios → distribuição estatisticamente uniforme'],
      ['Falha', 'Nó falho tem M posições → carga redistribuída entre M vizinhos diferentes'],
    ],
    explanation: 'Vnodes = "vários nomes" para o mesmo servidor físico. Um servidor com 150 vnodes aparece 150 vezes no anel — como ter 150 bilhetes de loteria. Quando o servidor falha, suas 150 posições são absorvidas por muitos vizinhos, não apenas um.',
    example: 'Nó A com 1 token: se A falha, o vizinho B absorve 100% da carga de A. Nó A com 150 tokens: carga distribuída entre ~150 vizinhos diferentes → cada um absorve ~1/150 da carga de A.',
    why: 'Vnodes são obrigatórios em produção — sem eles, falha de nó causa hotspot no vizinho. Cassandra usa 256 por padrão. Heterogeneidade: servidor 2× mais potente → 2× mais tokens.',
  },
  {
    label: 'JHR — Jump, Horário (Ring), Rendezvous',
    trick: 'Hierarquia de velocidade: Jump O(ln n) > Ring O(log N) > Rendezvous O(N)',
    expansion: [
      ['Jump', 'O(ln n), O(1) mem — mais rápido, sem anel. Só crescimento monotônico.'],
      ['Horário (Ring)', 'O(log N) — flexível, qualquer add/remove, vnodes. Cassandra, DynamoDB.'],
      ['Rendezvous', 'O(N) — N pequeno, CDNs. Sem estado. Akamai usa HRW.'],
    ],
    explanation: 'Os três algoritmos principais em ordem de performance de lookup. Jump Hash (Google 2014) é o mais rápido mas só aceita crescimento. Ring com vnodes é o mais flexível. Rendezvous (HRW) é o mais simples para N pequeno.',
    example: 'Cache distribuído com 1000 nós que cresce mas nunca shrink → Jump Hash. Cluster Cassandra que escala e diminui → Ring + vnodes. CDN com 10 edge servers por região → Rendezvous.',
    why: 'Saber os três algoritmos com complexidade e limitações é o que diferencia o nível sênior do pleno nessa topic.',
  },
  {
    label: '1/N — A Lei do Consistent Hashing',
    trick: 'Adicionar 1 nó move apenas K/(N+1) chaves ≈ 1/N do total.',
    expansion: [
      ['K/(N+1)', 'Chaves que migram ao adicionar 1 nó — fórmula exata'],
      ['Hash módulo', 'Move K × N/(N+1) chaves ≈ N× mais que consistent hashing'],
      ['Thundering herd', 'Cache miss simultâneo ao escalar com hash módulo'],
      ['Monotonicidade', 'Chaves só movem de nós existentes para o novo — nunca entre existentes'],
    ],
    explanation: 'A propriedade fundamental: com N nós, adicionar 1 novo move apenas 1/N das chaves. Hash módulo move N× mais. Para N=10 e K=1M chaves: consistent hashing move ~91K chaves; hash módulo move ~909K chaves — thundering herd de 909K cache misses simultâneos.',
    example: 'N=10 nós, K=1M chaves. Adicionar 1 nó: consistent hashing → 91K chaves migram. Hash módulo → 909K chaves remapeiam simultaneamente → backend recebe 909K misses em segundos.',
    why: '1/N é a promessa e o argumento de venda do consistent hashing. Saber a fórmula exata K/(N+1) e a comparação com hash módulo é o que convence em entrevistas de system design.',
  },
]

// ── Comparative ───────────────────────────────────────────────────────────────

const COMP_OPTIONS: CompOption[] = [
  { name: 'Ring + vnodes', color: '#6366f1' },
  { name: 'Jump Hash', color: '#f59e0b' },
  { name: 'Rendezvous', color: '#4ade80' },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Lookup complexity',
    category: 'Performance',
    values: {
      'Ring + vnodes': 'O(log N×M) — binary search no sorted array de tokens',
      'Jump Hash': 'O(ln n) — loop com LCG. Mais rápido para N grande.',
      'Rendezvous': 'O(N) — calcula hash(key, node) para todos os N nós',
    },
  },
  {
    criterion: 'Memória',
    category: 'Performance',
    values: {
      'Ring + vnodes': 'O(N×M) — sorted array + map de token→nó',
      'Jump Hash': 'O(1) — apenas 2 variáveis (b, j). Zero estado.',
      'Rendezvous': 'O(1) — apenas lista de nós. Sem anel.',
    },
  },
  {
    criterion: 'Adicionar nó',
    category: 'Flexibilidade',
    values: {
      'Ring + vnodes': 'Qualquer posição — insere tokens do nó no sorted array',
      'Jump Hash': 'Apenas no final (crescimento monotônico)',
      'Rendezvous': 'Qualquer posição — adicionar à lista de nós',
    },
  },
  {
    criterion: 'Remover nó',
    category: 'Flexibilidade',
    values: {
      'Ring + vnodes': 'Qualquer nó — remove todos os tokens do nó',
      'Jump Hash': 'NÃO suporta remoção arbitrária',
      'Rendezvous': 'Qualquer nó — remover da lista',
    },
  },
  {
    criterion: 'Distribuição',
    category: 'Qualidade',
    values: {
      'Ring + vnodes': 'Uniforme com M alto (256+). σ ≈ 1/√(N×M) × média',
      'Jump Hash': 'Perfeita — distribuição uniforme matemática garantida',
      'Rendezvous': 'Perfeita — mesma garantia do Jump por construção',
    },
  },
  {
    criterion: 'Caso de uso ideal',
    category: 'Decisão',
    values: {
      'Ring + vnodes': 'Clusters que crescem e diminuem. Heterogeneidade. Cassandra, DynamoDB.',
      'Jump Hash': 'Clusters que só crescem. Storage escalável linear. Alta performance.',
      'Rendezvous': 'N pequeno (5-20 nós). CDNs, edge selection. Sem estado.',
    },
  },
]

const COMP_SCENARIOS: CompScenario[] = [
  {
    scenario: 'Cache distribuído (Memcached-like)',
    recommendation: 'Ring + vnodes',
    reason: 'Cluster cresce e diminui com tráfego. Vnodes garantem distribuição uniforme. Ketama library usa ring.',
  },
  {
    scenario: 'Time-series DB (Cassandra)',
    recommendation: 'Ring + vnodes (Cassandra nativo)',
    reason: 'Cassandra usa Murmur3 + 256 vnodes. Replicação por preference list, tunable consistency com R+W>N.',
  },
  {
    scenario: 'Storage escalável (só cresce)',
    recommendation: 'Jump Hash',
    reason: 'O(ln n) lookup com O(1) memória. Escalabilidade linear sem overhead de anel.',
  },
  {
    scenario: 'CDN — selecionar edge server',
    recommendation: 'Rendezvous (HRW)',
    reason: 'N pequeno de edge servers por região. Sem estado, sem coordenação. Akamai usa HRW.',
  },
  {
    scenario: 'Key-value gerenciado (DynamoDB)',
    recommendation: 'Ring + vnodes (gerenciado)',
    reason: 'DynamoDB abstrai o particionamento. Partition key vai para nó via token ring gerenciado.',
  },
  {
    scenario: 'Redis Cluster (cache in-memory)',
    recommendation: 'Hash slots (16384)',
    reason: 'Redis usa variante de hash slots, não anel puro. Hashtag permite co-location de chaves relacionadas.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Consistent Hashing',
    stackLabel: 'Algoritmos de Sistemas Distribuídos',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Consistent Hashing',
    accentColor: C,
    stackLabel: 'Algoritmos de Sistemas Distribuídos',
    sections: {
      hooks: [
        { name: 'addNode(node, M=150)', sig: 'for i in 0..M: token = hash(`${node.id}:${i}`); bisect_insert(token)', desc: 'Inserir M tokens no sorted array. O(M log N×M).' },
        { name: 'getNode(key)', sig: 'h = hash(key); idx = bisectRight(h); wrap to 0 if idx >= length', desc: 'Lookup O(log N×M). Retorna o próximo token no anel.' },
        { name: 'removeNode(nodeId)', sig: 'for i in 0..M: del map[hash(`${nodeId}:${i}`)]; del sorted_array[...]', desc: 'Remover todos os M tokens do nó.' },
        { name: 'jumpHash(key, n)', sig: 'while j < n: b=j; key=LCG(key); j=f(b, key)', desc: 'O(ln n), O(1) mem. Google 2014. Só adiciona no final.' },
        { name: 'rendezvousGet(key, nodes)', sig: 'max(nodes, key=lambda n: hash(key+n))', desc: 'O(N). Sem estado. Akamai CDN usa para edge selection.' },
        { name: 'R+W > N', sig: 'quorum: R = W = ceil(N/2)+1', desc: 'Strong consistency: qualquer R reads sobrepõe qualquer W writes em pelo menos 1 nó.' },
        { name: 'preference list', sig: 'N réplicas nos próximos nós únicos, pulando mesmo rack/AZ', desc: 'DynamoDB/Cassandra: fault isolation física. Dynamo paper (2007).' },
        { name: 'vnodes dimensionamento', sig: 'σ ≈ 1/√(N×M) × média_carga', desc: 'M=256 → σ ≈ 2% para N=10. Nó 2× → 2× tokens.' },
      ] as HookItem[],
      depRows: [
        ['Ring + vnodes: lookup', 'O(log N×M) — sorted array + binary search'],
        ['Jump Hash: lookup', 'O(ln n) — LCG loop, zero estado'],
        ['Rendezvous HRW: lookup', 'O(N) — calcula hash(key, node) para todos'],
        ['Vnodes padrão Cassandra', '256 por nó (num_tokens em cassandra.yaml)'],
        ['Hash space padrão', '0 a 2^32−1 (uint32) ou −2^63 a 2^63−1 (int64 Cassandra)'],
        ['Cassandra partitioner', 'Murmur3Partitioner (default). RandomPartitioner (legado).'],
        ['Redis Cluster slots', 'CRC16(key) % 16384 = slot. 16384 slots fixos.'],
        ['Remapeamento add nó', 'K/(N+1) chaves (≈ 1/N). Hash módulo: K×N/(N+1) (≈ N× mais).'],
        ['Replicação Dynamo/Cassandra', 'N=3, W=2, R=2. R+W=4>3=N → strong consistency.'],
        ['Preference list', 'N réplicas em nós de racks/AZs distintos no anel.'],
      ],
      rules: [
        { ok: true, t: 'Usar vnodes (M=100-256) para distribuição uniforme' },
        { ok: true, t: 'Replicação N=3, W=2, R=2 para strong consistency tunable' },
        { ok: true, t: 'Jump hash para clusters que só crescem — O(ln n)' },
        { ok: true, t: 'Rendezvous para N pequeno (CDNs, grupos de cache)' },
        { ok: true, t: 'Preference list por rack/AZ para fault isolation' },
        { ok: true, t: 'Sub-sharding para hot partition keys' },
        { ok: true, t: 'nodetool toppartitions para diagnosticar hotspot em Cassandra' },
        { ok: true, t: 'DynamoDB = hash partition + sort key range (melhor dos dois mundos)' },
        { ok: false, t: 'Hash módulo (key % N) em sistemas que escalam' },
        { ok: false, t: 'Ring sem vnodes — distribuição desigual estatisticamente' },
        { ok: false, t: 'Jump hash em clusters que precisam de scale down' },
        { ok: false, t: 'Rendezvous para N > 50 — O(N) lookup inapropriado' },
        { ok: false, t: 'Consistent hashing como solução para hot keys (não resolve sem bounded loads)' },
        { ok: false, t: 'Confundir consistent (mapeamento) com consistency (CAP theorem)' },
        { ok: false, t: 'Adicionar nó em BD em horário de pico — migração de dados é cara' },
      ] as RuleItem[],
      performanceTips: [
        'Binary search em sorted array de tokens é O(log N×M) — bisectRight em Python, SortedList, TreeMap',
        'Jump hash é 3-10× mais rápido que ring para N grande',
        'vnodes M=256 → σ ≈ 2% de desvio de carga para N=10 nós',
        'Cassandra LOCAL_QUORUM é sub-10ms; cross-DC EACH_QUORUM é 100ms+',
        'Redis Cluster hashtag: {user}.posts e {user}.profile no mesmo slot → MGET atômico',
        'Rendezvous: calcular hash(key+node) é rápido — MurmurHash ou xxHash para performance',
        'Consistent hashing com bounded loads: ε=0.25 → 25% de overhead máximo sobre a média',
      ],
      patterns: [
        { name: 'ConsistentHashRing', code: 'ring.addNode(node, 150); ring.getNode("user:1234");', desc: 'Sorted array + bisectRight. O(log N×M) lookup. Wrap around ao passar do último token.' },
        { name: 'Jump Hash', code: 'function jumpHash(key: bigint, n: number): number — while j < n: b=j, key=LCG(key), j=f(b,key)', desc: 'O(ln n), O(1) memória. Só adiciona no final. Implementação completa em 5 linhas.' },
        { name: 'R+W > N quorum', code: 'N=3, R=2, W=2 → R+W=4>3 → strong consistency', desc: 'Qualquer R reads e W writes se sobrepõem em ≥1 nó que tem o write mais recente.' },
        { name: 'Sub-sharding hot key', code: 'partition_key = base_key + "_" + random(R) // R réplicas', desc: 'Distribui hot key em R partições. Reads fazem scatter-gather e merge. Resolve bounded loads.' },
        { name: 'nodetool toppartitions', code: 'nodetool toppartitions keyspace table 1000 10', desc: 'Identifica as 10 partition keys mais quentes no Cassandra. Diagnóstico de hotspot.' },
      ],
      mentalModels: [
        'Hash módulo = thundering herd ao escalar. Consistent hashing = 1/N migram.',
        'Vnodes = vários bilhetes no anel. Mais bilhetes = distribuição mais uniforme = falha mais diluída.',
        'Jump hash: mais rápido mas sem scale down. Ring: flexível mas mais estado.',
        'R+W>N garante que toda leitura encontra o write mais recente — sobreposição garantida.',
        'Preference list por rack/AZ = fault isolation física — não perde quorum em falha de AZ.',
        'Consistent hashing não resolve hot key — bounded loads, sub-sharding ou cache local fazem.',
        '"Consistent" se refere a monotonicidade do mapeamento, não CAP consistency.',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Consistent Hashing',
    stackLabel: 'Algoritmos de Sistemas Distribuídos',
    coverTitle: 'Consistent Hashing — Mnemônicos',
  }),
  comparative: () => buildComparativeRefPdf({
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    scenarios: COMP_SCENARIOS,
    skillName: 'Consistent Hashing',
    accentColor: C,
    stackLabel: 'Algoritmos de Sistemas Distribuídos',
    coverTitle: 'Ring + Vnodes vs Jump Hash vs Rendezvous',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function ConsistentHashingPdfs() {
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
