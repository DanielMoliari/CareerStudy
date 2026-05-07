import type { SkillContent } from "@/types"

const consistentHashing: SkillContent = {
  tagline: "Algoritmo que mapeia chaves a nós minimizando rehash quando o cluster muda de tamanho.",
  why: "Base de DynamoDB, Cassandra, Memcached, CDNs e load balancers. Engenheiros sênior precisam explicar o anel circular, virtual nodes, jump consistent hashing e por que hash módulo não escala em produção.",
  summary: "Hash módulo (key % N) é simples mas causa remapeamento massivo quando N muda — adicionar 1 nó remapeia quase tudo. Consistent hashing resolve mapeando chaves e nós num anel circular de hash space (0 a 2^32). Cada chave vai para o próximo nó no sentido horário. Adicionar/remover um nó remapeia apenas 1/N das chaves. Virtual nodes (vnodes) com 100–256 tokens por nó físico garantem distribuição uniforme e redistribuem carga de falhas entre múltiplos nós. Jump consistent hashing (Google) dispensa o anel e faz lookup em O(ln n).",
  keypoints: [
    {
      title: "Problema do hash módulo",
      body: "hash(k) % N. Mudar N invalida quase todo cache/sharding. Em N=10 → N=11, ~91% das chaves remapeiam. Tempestade de cache misses derruba o backend.",
    },
    {
      title: "Ring — espaço hash circular",
      body: "Espaço hash circular (0 a 2^32−1). Cada nó recebe hash(node_id) → posição no anel. Cada chave também tem uma posição. A chave vai para o primeiro nó no sentido horário a partir da sua posição.",
    },
    {
      title: "Adicionar/remover nós",
      body: "Ao adicionar nó N entre A e B: apenas as chaves entre A e N migram para N. O resto permanece. Remapeamento reduz de O(K) para O(K/N) — redução de ordem de magnitude.",
    },
    {
      title: "Virtual nodes (vnodes)",
      body: "Cada nó físico recebe M tokens no anel (tipicamente 100–256). Distribuição estatisticamente uniforme. Quando um nó falha, sua carga é redistribuída entre vários outros (não apenas o vizinho imediato). Amazon Dynamo e Cassandra usam vnodes.",
    },
    {
      title: "Replicação com preference list",
      body: "DynamoDB/Cassandra: a chave vai para o primeiro nó (coordenador) + N−1 nós seguintes no anel (réplicas). Preference list exclui nós no mesmo rack/AZ para tolerância a falhas físicas. R+W>N garante consistência tunável.",
    },
    {
      title: "Jump consistent hashing",
      body: "Algoritmo do Google (2014) sem anel. Dado (key, num_buckets), calcula bucket em O(ln n) com apenas duas variáveis. Mais rápido e menor footprint de memória. Limitação: só adiciona nós no final (crescimento monotônico). Ideal para clusters estáveis que só crescem.",
    },
    {
      title: "Rendezvous hashing (HRW)",
      body: "Alternativa ao anel: para cada par (chave, nó), calcula hash(chave, nó). A chave vai para o nó com maior hash. Sem anel, sem estado — O(N) por lookup. Bom para N pequeno. Usado em CDNs para selecionar edge server.",
    },
    {
      title: "Bounded loads e hot keys",
      body: "Consistent hashing não resolve hot key (uma chave com tráfego desproporcional). Consistent hashing with bounded loads (Google 2017) limita carga máxima de cada nó a (1+ε) × carga média. Hot keys exigem: cache local, réplicas extras ou sub-sharding.",
    },
  ],
  gotchas: [
    "Hash módulo simples causa tempestade de cache miss quando cluster cresce — nunca use em sistemas que escalam.",
    "Sem virtual nodes, distribuição fica desigual — alguns nós recebem 2× mais carga que outros.",
    "Hot key derruba o nó responsável — consistent hashing não resolve sozinho.",
    "Ring muito pequeno (2^16) gera colisões em clusters grandes com muitos vnodes.",
    "Confundir consistent hashing com sharding por range — range permite sequential scan, hash não.",
    "Ao adicionar nó em produção com BD, migração de dados é cara — planejar com antecedência.",
    "Confundir 'consistent' de consistent hashing com 'consistency' do CAP theorem — temas completamente diferentes.",
    "Jump consistent hashing só aceita adição de nós no final — não funciona para remoção de nó arbitrário.",
    "Rendezvous hashing é O(N) por lookup — inaceitável para N grande; use anel para N alto.",
  ],
  interview: [
    {
      q: "Por que não usar hash módulo simples em cache distribuído?",
      a: "<p>Quando N (número de nós) muda, quase TODAS as chaves remapeiam. Exemplo prático: cache com 10 servidores escala para 11. Hash módulo remapeia ~91% das chaves.</p><p>Resultado: <b>tempestade de cache misses</b> simultâneos. Todas as requisições que chegam encontram cache vazio e vão ao banco — que colapsa sob a carga.</p><p>Consistent hashing reduz o remapeamento para <b>1/N (~9%)</b> das chaves. Diferença de ordem de magnitude que separa sistemas que escalam dos que não escalam.</p>",
      level: "pleno",
      tip: "Mencione a 'thundering herd' — o efeito cascata é o verdadeiro problema, não o remapeamento em si.",
    },
    {
      q: "Como funciona o anel de consistent hashing?",
      a: "<p>O espaço de hash é modelado como um <b>anel circular</b> (0 a 2^32−1). Tanto os nós quanto as chaves são mapeados nesse espaço:</p><ol><li>Cada nó recebe uma posição via <code>hash(node_id)</code></li><li>Cada chave recebe uma posição via <code>hash(key)</code></li><li>A chave é atribuída ao <b>primeiro nó no sentido horário</b> a partir da sua posição</li></ol><p>Ao <b>adicionar</b> nó N entre A e B: apenas as chaves entre A e N migram para N. O resto permanece intacto.</p><p>Ao <b>remover</b> nó B: suas chaves vão para o próximo nó C. Todos os outros ficam onde estão.</p>",
      level: "pleno",
      tip: "Explique visualmente com uma linha de 0 a 360 graus. Entrevistadores adoram o desenho na lousa.",
    },
    {
      q: "Por que virtual nodes (vnodes) são necessários?",
      a: "<p>Sem vnodes, N nós mapeados no anel podem cair em posições desiguais por acaso estatístico — alguns nós recebem arcos maiores e portanto mais carga.</p><p>Com <b>virtual nodes</b>, cada nó físico recebe M posições pseudoaleatórias no anel (M = 100–256). Benefícios:</p><ul><li>Distribuição <b>estatisticamente uniforme</b> de carga</li><li>Falha de um nó: carga redistribuída entre <b>vários</b> nós (não só o vizinho)</li><li>Nós heterogêneos: máquina mais potente recebe mais tokens</li><li>Cassandra e DynamoDB usam vnodes por esses motivos</li></ul>",
      level: "pleno",
      tip: "Amazon Dynamo usou 'token ranges' por nó, DynamoDB usa vnodes. Cassandra usa vnodes por padrão desde a versão 1.2.",
    },
    {
      q: "Explique a matemática do remapeamento ao adicionar um nó.",
      a: "<p>Em um cluster com N nós e K chaves, cada nó é responsável por K/N chaves em média.</p><p>Ao adicionar 1 nó (N → N+1):</p><ul><li>O novo nó 'reclama' sua fatia do anel no sentido anti-horário até o nó predecessor</li><li>Apenas as chaves nesse intervalo migram</li><li>Quantidade esperada de chaves migrando: <b>K/(N+1)</b> ≈ K/N = 1 nó equivalente</li></ul><p>Comparando: hash módulo move K × (1 − N/(N+1)) = K/(N+1) × N chaves. Para N=10: muda 10× mais chaves que consistent hashing.</p><p>Em termos assintóticos: hash módulo rehash <b>O(K)</b>, consistent hashing rehash <b>O(K/N)</b>.</p>",
      level: "senior",
      tip: "Mencionar a fórmula exata K/(N+1) diferencia — a maioria diz 'só 1/N' sem derivar.",
    },
    {
      q: "Como funciona replicação com consistent hashing no Dynamo/Cassandra?",
      a: "<p>A chave é coordenada pelo <b>primeiro nó no anel</b> (nó coordenador). Réplicas vão para os <b>N−1 nós seguintes</b> no sentido horário.</p><p>Amazon Dynamo usa <b>preference list</b>: a lista de nós pula nós que estão no mesmo rack físico ou zona de disponibilidade — garantindo tolerância a falhas de infraestrutura.</p><p>Configuração típica: N=3 réplicas, W=2 writes confirmados, R=2 reads consultados. Como R+W=4 &gt; N=3, garante <b>strong consistency tunável</b>.</p><p>Em partição: ambos lados continuam (AP). Após recuperação, reconciliam via vector clocks ou LWW.</p>",
      level: "senior",
      tip: "Preference list é detalhe do paper original do Dynamo (2007) — citar mostra que você leu a literatura.",
    },
    {
      q: "O que é jump consistent hashing e quando usá-lo?",
      a: "<p>Algoritmo do Google (2014) que descarta o anel completamente. Dado (key, num_buckets), determina o bucket em <b>O(ln n)</b> com apenas um loop e duas variáveis.</p><p><b>Vantagens:</b> mais rápido que anel, footprint de memória mínimo, distribuição uniforme perfeita.</p><p><b>Limitação crítica:</b> só suporta adição de nós no final — não permite remoção de nó arbitrário. Ideal para clusters que <b>só crescem</b>.</p><p>Lookup em O(ln n) vs O(log N×M) do anel — para N grande, jump é significativamente mais rápido.</p>",
      level: "senior",
      tip: "Citar o paper 'A Fast, Minimal Memory, Consistent Hash Algorithm' (Lamping & Veach, 2014) é diferencial.",
    },
    {
      q: "O que é rendezvous hashing (HRW) e quando é melhor que o anel?",
      a: "<p><b>Rendezvous hashing (Highest Random Weight)</b>: para cada chave, calcula <code>hash(chave, nó)</code> para todos os N nós. A chave vai para o nó com o <b>maior hash resultante</b>.</p><p><b>Propriedades:</b> sem estado (sem anel para manter), sem necessidade de coordenação, distribuição uniforme, fácil de implementar.</p><p><b>Complexidade:</b> O(N) por lookup — inapropriado para N grande.</p><p><b>Quando usar:</b></p><ul><li>N pequeno (ex: 5–20 nós)</li><li>CDNs selecionando edge servers</li><li>Load balancing de sessão em grupos pequenos</li></ul>",
      level: "senior",
      tip: "Akamai usa rendezvous hashing para selecionar edge servers — bom exemplo de produção.",
    },
    {
      q: "Como consistent hashing com bounded loads resolve o problema de hot keys?",
      a: "<p>Consistent hashing básico não resolve hot keys — uma chave muito popular sobrecarrega o nó responsável independente do algoritmo de distribuição.</p><p><b>Consistent hashing with bounded loads</b> (Google 2017): cada nó tem capacidade máxima de <code>(1 + ε) × (total_load / num_nodes)</code>. Quando o nó responsável está na capacidade, a requisição é roteada para o <b>próximo nó disponível</b> no anel.</p><p><b>Estratégias adicionais para hot keys:</b></p><ul><li>Cache local antes do hit no nó</li><li>Réplicas de leitura extras para as chaves mais quentes</li><li>Sub-sharding: <code>hash(key + counter % R)</code> distribui em R réplicas</li></ul>",
      level: "senior",
      tip: "Citar o paper 'Consistent Hashing with Bounded Loads' (Mirrokni et al., Google 2017) mostra state of the art.",
    },
    {
      q: "Onde você viu consistent hashing em sistemas reais?",
      a: "<ul><li><b>Memcached (Ketama):</b> cliente PHP/Python usa consistent hashing para distribuir keys entre servidores de cache</li><li><b>Amazon DynamoDB:</b> partition key usa consistent hashing para mapear dados a storage nodes</li><li><b>Cassandra:</b> token ring com vnodes — nó coordenador + N−1 réplicas no anel</li><li><b>Redis Cluster:</b> usa hash slots (0–16383) — variante de consistent hashing com 16384 tokens fixos</li><li><b>CDNs (Akamai, Cloudflare):</b> rendezvous hashing para selecionar edge server mais próximo</li><li><b>Nginx upstream consistent:</b> módulo de load balancing com sticky sessions via consistent hashing</li></ul>",
      level: "pleno",
      tip: "Redis Cluster usa hash slots, não anel puro — mencionar a diferença mostra profundidade.",
    },
    {
      q: "Qual a diferença entre consistent hashing e sharding por range?",
      a: "<p><b>Consistent hashing:</b> distribui dados via função de hash. Distribuição uniforme, sem hotspots por padrão de acesso sequencial. Não suporta range queries eficientes.</p><p><b>Sharding por range:</b> cada shard é responsável por um intervalo de chaves. Suporta range queries e sequential scans. Vulnerável a <b>hotspots</b> (chaves sequenciais sobrecarregam o mesmo shard).</p><p><b>DynamoDB combina os dois:</b> partition key (hash) para distribuição uniforme + sort key (range) para queries ordenadas dentro da partição — melhor dos dois mundos.</p>",
      level: "senior",
      tip: "DynamoDB combina os dois: partition key (hash) para distribuição + sort key (range) para queries dentro do shard.",
    },
    {
      q: "Como implementar consistent hashing em código? Quais estruturas de dados usar?",
      a: "<p><b>Estrutura central:</b> sorted map (árvore balanceada ou array ordenado) mapeando hash → nó.</p><p><b>Operações:</b></p><ul><li><b>Adicionar nó:</b> inserir M tokens <code>hash(node_id + ':' + i)</code> para i em 0..M−1 no sorted map</li><li><b>Remover nó:</b> deletar todos os M tokens do nó do sorted map</li><li><b>Lookup:</b> calcular <code>hash(key)</code>, encontrar o próximo token no sorted map via <code>upperBound</code> (ou wrap para o início)</li></ul><p><b>Complexidade:</b></p><ul><li>Lookup: O(log N×M) via binary search</li><li>Adicionar nó: O(M log N×M)</li><li>Memória: O(N×M) entradas</li></ul>",
      level: "senior",
      tip: "Mencionar bisect/upper_bound mostra que você pensa na implementação real, não só no conceito.",
    },
    {
      q: "Explique o token ring do Amazon Dynamo original vs vnodes modernos.",
      a: "<p><b>Dynamo original (2007):</b> cada nó recebe um único token no anel. O anel é dividido em N arcos iguais, um por nó. Simples, mas sem heterogeneidade e redistribuição manual ao escalar.</p><p><b>Vnodes modernos (DynamoDB, Cassandra):</b> cada nó recebe <b>múltiplos tokens</b> pseudoaleatórios. Benefícios:</p><ul><li>Distribuição mais uniforme estatisticamente</li><li>Heterogeneidade: máquinas mais potentes recebem mais tokens</li><li>Adição de nó: cada novo nó 'rouba' tokens de vários nós existentes simultaneamente — operação mais paralela</li><li>Falha: carga distribuída entre vários nós, não causa hotspot no vizinho</li></ul>",
      level: "senior",
      tip: "O paper do Dynamo (DeCandia et al., Amazon, 2007) é leitura obrigatória para qualquer sênior em distributed systems.",
    },
    {
      q: "Como consistent hashing se relaciona com o particionamento de dados no Cassandra?",
      a: "<p>Cassandra usa consistent hashing como base do <b>token ring</b>. O partition key de cada row é hasheado pelo <b>Murmur3Partitioner</b> (padrão) para gerar um token no espaço −2^63 a 2^63−1.</p><p><b>Fluxo:</b></p><ol><li>Partition key → Murmur3 hash → token</li><li>Token → posição no anel → nó coordenador</li><li>Coordenador replica para N−1 nós seguintes</li></ol><p><b>Vnodes no Cassandra:</b> por padrão, cada nó recebe 256 vnodes. O rebalanceamento ao adicionar/remover nó é feito automaticamente via streaming.</p><p><b>Atenção:</b> mudar o partitioner em produção exige full rewrite de todos os dados — decisão arquitetural irreversível.</p>",
      level: "senior",
      tip: "Murmur3Partitioner vs RandomPartitioner: Murmur3 distribui melhor porque é não-criptográfico e mais rápido.",
    },
    {
      q: "Como você diagnosticaria e resolveria um hotspot em cluster com consistent hashing?",
      a: "<p><b>Diagnóstico:</b></p><ul><li>Monitor CPU/memória/latência por nó — hotspot aparece como um nó com 3-5× mais carga</li><li>Verificar distribuição de tokens: <code>nodetool status</code> no Cassandra mostra % de tokens por nó</li><li>Identificar as chaves quentes com <code>nodetool toppartitions</code></li></ul><p><b>Soluções por tipo:</b></p><ul><li><b>Desequilíbrio de tokens:</b> adicionar vnodes ao nó menor</li><li><b>Hot partition key:</b> adicionar sufixo aleatório à chave (key + '_' + random(R)) e usar R réplicas. Leitura faz scatter-gather nas R partições</li><li><b>Hot key de cache:</b> local cache em front do cache distribuído</li></ul>",
      level: "senior",
      tip: "nodetool toppartitions é o comando específico do Cassandra — citar ferramentas reais diferencia.",
    },
    {
      q: "Por que Redis Cluster não usa consistent hashing puro?",
      a: "<p>Redis Cluster usa <b>hash slots</b>: o espaço de chaves é dividido em <b>16384 slots fixos</b>. Cada chave é mapeada para um slot via <code>CRC16(key) % 16384</code>. Cada nó é responsável por um subconjunto de slots.</p><p><b>Por que não anel puro:</b></p><ul><li>Slots fixos facilitam o rebalanceamento manual — mover 100 slots de um nó a outro é operação bem definida</li><li>Gossip protocol dissemina a tabela de slots eficientemente (16384 bits)</li><li>Permite operações multi-chave em mesmo slot via hashtag: <code>{user}.posts</code> e <code>{user}.profile</code> vão para o mesmo slot</li></ul><p><b>Limitação:</b> sem vnodes — distribuição depende de configuração manual.</p>",
      level: "senior",
      tip: "Hashtags no Redis Cluster (<code>{...}</code>) são mecanismo para forçar co-location de chaves relacionadas — detalhe de produção.",
    },
    {
      q: "Qual a complexidade de tempo das operações em consistent hashing com anel?",
      a: "<p><b>Estrutura: sorted array ou balanced BST (ex: TreeMap Java, SortedList) de tokens.</b></p><ul><li><b>Adicionar nó:</b> O(M log(N×M)) onde M = vnodes por nó, N = nós. Inserção ordenada de M tokens.</li><li><b>Remover nó:</b> O(M log(N×M)). Deletar M tokens.</li><li><b>Lookup (get node for key):</b> O(log(N×M)). Binary search no array de tokens para encontrar successor.</li></ul><p><b>Comparação com jump consistent hashing:</b></p><ul><li>Jump: lookup O(ln n), sem estrutura de dados extra, sem vnodes</li><li>Ring: lookup O(log N), mas suporta remoção arbitrária e heterogeneidade via vnodes</li></ul>",
      level: "senior",
      tip: "A pergunta de complexidade mostra que o entrevistador quer implementação real, não só conceito. Mencione TreeMap ou SortedList pelo nome.",
    },
    {
      q: "Como consistent hashing é usado em CDNs para selecionar edge servers?",
      a: "<p>CDNs como Akamai e Cloudflare usam consistent hashing para mapear requisições a edge servers com estabilidade:</p><p><b>Problema:</b> se a URL <code>cdn.example.com/image.jpg</code> deve sempre ir para o mesmo edge server (para aproveitar cache local), o algoritmo de seleção precisa ser determinístico e estável a mudanças de topologia.</p><p><b>Solução com rendezvous hashing:</b> para cada edge server E, calcula <code>hash(URL + E.id)</code>. A requisição vai para o servidor com maior hash. Mudança de 1 servidor afeta apenas ~1/N das URLs.</p><p><b>Consistent hashing com geo:</b> na prática, filtra por latência geográfica primeiro, depois aplica hashing entre os candidatos próximos para maximizar cache hit rate.</p>",
      level: "senior",
      tip: "A combinação 'geo-proximity filter + consistent hashing' é arquitetura real de CDNs enterprise.",
    },
    {
      q: "O que acontece com dados quando um nó falha em cluster com consistent hashing?",
      a: "<p>Com <b>replicação N=3</b> (padrão Cassandra/Dynamo):</p><ol><li>Nó falho: suas partições ficam inacessíveis no nó primário</li><li>Com R=1 (eventual): requisições são roteadas para réplicas automaticamente — <b>sem interrupção visível</b></li><li>Com R=2 (quorum): precisa de 2 réplicas respondendo</li></ol><p><b>Hinted handoff (Dynamo/Cassandra):</b> writes para o nó falho são armazenados em outro nó como 'hints'. Quando o nó retorna, recebe os writes pendentes — eventually consistent.</p><p><b>Anti-entropy via Merkle trees:</b> após recovery, compara o hash tree do nó com outros para identificar e sincronizar dados perdidos.</p><p><b>Com vnodes:</b> carga do nó falho é redistribuída entre <b>todos os nós que têm tokens adjacentes</b> — muitos nós, impacto diluído.</p>",
      level: "senior",
      tip: "Hinted handoff + Merkle tree são os dois mecanismos de recuperação do Dynamo paper. Citar ambos por nome diferencia.",
    },
    {
      q: "Como você dimensionaria o número de virtual nodes por nó físico?",
      a: "<p>M (tokens por nó físico) é trade-off entre:</p><p><b>M alto (256+):</b></p><ul><li>Distribuição mais uniforme</li><li>Falha de nó distribui carga entre mais vizinhos</li><li>Overhead: mais metadados de routing, mais operações de rebalanceamento</li></ul><p><b>M baixo (1–10):</b></p><ul><li>Menos overhead</li><li>Distribuição desigual estatisticamente</li></ul><p><b>Regras práticas:</b></p><ul><li>Cassandra padrão: 256 vnodes. Para cluster &gt;32 nós: considerar reduzir para 128</li><li>Nó mais potente (2× CPU/RAM): dar 2× tokens → recebe 2× mais dados/tráfego</li><li>Fórmula: desvio padrão de carga ≈ 1/√(N×M) × carga_média</li></ul>",
      level: "senior",
      tip: "A fórmula do desvio padrão mostra raciocínio quantitativo — rara em entrevistas mas impressiona.",
    },
    {
      q: "Compare consistent hashing com o algoritmo de particionamento do HBase/Bigtable.",
      a: "<p><b>Consistent hashing (hash-based):</b> distribuição uniforme por hash, point lookups O(log N), range queries ineficientes — dados sequenciais vão para nós aleatórios.</p><p><b>HBase/Bigtable (range-based):</b> dados ordenados por row key. Cada 'region' serve um intervalo contíguo. Suporta range scans eficientes. Vulnerável a <b>hotspots sequenciais</b> (ex: timestamp como row key).</p><p><b>HBase resolve hotspot com:</b></p><ul><li>Salt prefix: adicionar hash(key) como prefixo inverte a ordem</li><li>Bucket prefix: prefixo módulo N distribui writes entre N regions</li></ul><p>DynamoDB combina ambos: partition key (hash) para distribuição uniforme + sort key (range) para queries ordenadas dentro da partição.</p>",
      level: "senior",
      tip: "O pattern 'salt prefix' do HBase para evitar hotspot sequencial é análogo ao sub-sharding de hot keys no consistent hashing.",
    },
    {
      q: "Quais são as garantias matemáticas de consistent hashing sobre uniformidade?",
      a: "<p>O paper original (Karger et al., 1997) prova que consistent hashing com vnodes oferece:</p><p><b>Load balance:</b> com alta probabilidade, nenhum nó recebe mais que <code>O((log N) / N)</code> fração do total de chaves.</p><p><b>Monotonicidade:</b> ao adicionar nó, chaves só movem de nós existentes para o novo nó — nunca entre nós existentes.</p><p><b>Balance com vnodes:</b> com M = O(log N) tokens por nó, a carga máxima é <code>O(1)</code> × carga média com alta probabilidade.</p><p><b>Prova intuitiva:</b> M tokens por nó no espaço hash 2^32 se comportam como M amostras uniformes — distribuição binomial converge para uniforme.</p>",
      level: "senior",
      tip: "Citar o paper de Karger et al. (1997, MIT/Akamai) é o nível teórico que impressiona em entrevistas de sistemas distribuídos em grandes empresas.",
    },
  ],
  codeExamples: [
    {
      title: "Consistent hashing ring em TypeScript",
      language: "typescript",
      code: `import { createHash } from 'crypto'

type Node = { id: string; address: string }

class ConsistentHashRing {
  private ring: Map<number, Node> = new Map()
  private sortedTokens: number[] = []
  private readonly vnodes: number

  constructor(vnodes = 150) {
    this.vnodes = vnodes
  }

  private hash(key: string): number {
    const buf = createHash('sha256').update(key).digest()
    return buf.readUInt32BE(0) // primeiros 4 bytes como uint32
  }

  addNode(node: Node): void {
    for (let i = 0; i < this.vnodes; i++) {
      const token = this.hash(\`\${node.id}:\${i}\`)
      this.ring.set(token, node)
      const pos = this.bisectRight(token)
      this.sortedTokens.splice(pos, 0, token)
    }
  }

  removeNode(nodeId: string): void {
    for (let i = 0; i < this.vnodes; i++) {
      const token = this.hash(\`\${nodeId}:\${i}\`)
      this.ring.delete(token)
      const idx = this.sortedTokens.indexOf(token)
      if (idx !== -1) this.sortedTokens.splice(idx, 1)
    }
  }

  getNode(key: string): Node | null {
    if (this.sortedTokens.length === 0) return null
    const keyHash = this.hash(key)
    const idx = this.bisectRight(keyHash)
    // wrap around: se passou do último token, volta ao primeiro
    const token = idx < this.sortedTokens.length
      ? this.sortedTokens[idx]
      : this.sortedTokens[0]
    return this.ring.get(token) ?? null
  }

  private bisectRight(value: number): number {
    let lo = 0, hi = this.sortedTokens.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (this.sortedTokens[mid] <= value) lo = mid + 1
      else hi = mid
    }
    return lo
  }
}

// Uso
const ring = new ConsistentHashRing(150)
ring.addNode({ id: 'node-1', address: '10.0.0.1:6379' })
ring.addNode({ id: 'node-2', address: '10.0.0.2:6379' })
ring.addNode({ id: 'node-3', address: '10.0.0.3:6379' })

console.log(ring.getNode('user:1234'))    // → { id: 'node-2', ... }
console.log(ring.getNode('product:5678')) // → { id: 'node-1', ... }`,
    },
    {
      title: "Jump consistent hashing (Google) — implementação mínima",
      language: "typescript",
      code: `// Paper: "A Fast, Minimal Memory, Consistent Hash Algorithm"
// Lamping & Veach, Google, 2014
// Complexidade: O(ln n), memória O(1)

function jumpHash(key: bigint, numBuckets: number): number {
  let b = -1n
  let j = 0n

  while (j < BigInt(numBuckets)) {
    b = j
    // Gerador linear congruencial (64-bit)
    key = (key * 2862933555777941757n + 1n) & BigInt('0xFFFFFFFFFFFFFFFF')
    j = BigInt(Math.floor(
      Number(b + 1n) * (2147483648 / (Number(key >> 33n) + 1))
    ))
  }

  return Number(b)
}

// Demonstração: escalar de N=10 para N=11
let changed = 0
const total = 10000
for (let k = 0n; k < BigInt(total); k++) {
  const old = jumpHash(k, 10)
  const next = jumpHash(k, 11)
  if (old !== next) changed++
}
console.log(\`Chaves remapeadas: \${changed}/\${total} (~\${(changed/total*100).toFixed(1)}%)\`)
// Output esperado: ~9.1% — exatamente 1/N`,
    },
    {
      title: "Simulação: hash módulo vs consistent hashing — remapeamento ao escalar",
      language: "typescript",
      code: `// Demonstração quantitativa do problema do hash módulo

function simpleHash(key: string, n: number): number {
  let h = 5381
  for (let i = 0; i < key.length; i++) h = ((h * 33) ^ key.charCodeAt(i)) >>> 0
  return h % n
}

function simulateRemap(keyCount = 10000) {
  const keys = Array.from({ length: keyCount }, (_, i) => \`key:\${i}\`)

  // Hash módulo: N=10 → N=11
  const modBefore = keys.map(k => simpleHash(k, 10))
  const modAfter  = keys.map(k => simpleHash(k, 11))
  const modChanged = keys.filter((_, i) => modBefore[i] !== modAfter[i]).length

  // Consistent hash simplificado (anel sem vnodes)
  const nodeTokens = Array.from({ length: 10 }, (_, i) =>
    simpleHash(\`node:\${i}\`, 2 ** 16)
  ).sort((a, b) => a - b)

  const ringGet = (key: string, ring: number[]) => {
    const h = simpleHash(key, 2 ** 16)
    const idx = ring.findIndex(t => t >= h)
    return idx === -1 ? ring[0] : ring[idx]
  }

  const ringBefore = keys.map(k => ringGet(k, nodeTokens))
  const newToken   = simpleHash('node:10', 2 ** 16)
  const newRing    = [...nodeTokens, newToken].sort((a, b) => a - b)
  const ringAfter  = keys.map(k => ringGet(k, newRing))
  const ringChanged = keys.filter((_, i) => ringBefore[i] !== ringAfter[i]).length

  console.log('=== Adicionando 1 nó (N: 10 → 11) ===')
  console.log(\`Hash módulo mudou:    \${modChanged}/\${keyCount} (\${(modChanged/keyCount*100).toFixed(1)}%)\`)
  console.log(\`Consistent hash mudou: \${ringChanged}/\${keyCount} (\${(ringChanged/keyCount*100).toFixed(1)}%)\`)
  // Hash módulo: ~90.9% | Consistent: ~10% (1/N)
}

simulateRemap()`,
    },
    {
      title: "Consistent hashing com replicação — preference list (estilo Dynamo)",
      language: "typescript",
      code: `// Replicação N=3 com preference list evitando mesmo rack físico

class ReplicatedHashRing extends ConsistentHashRing {
  private nodeRacks: Map<string, string> = new Map()

  addNodeWithRack(nodeId: string, address: string, rack: string, vnodes = 150) {
    this.addNode({ id: nodeId, address })
    this.nodeRacks.set(nodeId, rack)
  }

  // Preference list: N réplicas distintas em racks diferentes
  getPreferenceList(key: string, n = 3): { id: string; address: string }[] {
    const seenNodes = new Set<string>()
    const seenRacks = new Set<string>()
    const result: { id: string; address: string }[] = []

    // Em implementação real: iterar tokens no anel a partir do hash(key)
    // Aqui: simplificação com getNode + simulação de vizinhos
    const primary = this.getNode(key)
    if (!primary) return []

    seenNodes.add(primary.id)
    seenRacks.add(this.nodeRacks.get(primary.id) ?? 'default')
    result.push(primary)

    // Continuar pelo anel buscando réplicas em racks diferentes
    // Na implementação real: percorrer sortedTokens a partir do índice do primary
    // Pulando tokens do mesmo nó físico (vnodes) e mesmo rack

    return result.slice(0, n)
  }

  // Write quorum W=2 com at-least-once
  async quorumWrite(key: string, value: unknown, W = 2) {
    const nodes = this.getPreferenceList(key, 3)
    let confirmed = 0

    await Promise.allSettled(
      nodes.map(async node => {
        try {
          // await client(node.address).set(key, value)
          confirmed++
        } catch { /* hinted handoff: guardar write para entregar depois */ }
      })
    )

    if (confirmed < W) throw new Error(\`Write quorum falhou: \${confirmed}/\${W}\`)
    console.log(\`Write confirmado: \${confirmed}/\${nodes.length} réplicas\`)
  }
}`,
    },
  ],
  diagrams: [
    {
      title: "Hash Módulo vs Consistent Hashing — Remapeamento",
      caption: "Comparação visual do impacto de adicionar 1 nó em cada abordagem.",
      html: `<style>
.ch-wrap { font-family: 'Space Grotesk', sans-serif; padding: 16px; background: #0f172a; border-radius: 10px; color: #e2e8f0; font-size: 13px; }
.ch-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.ch-box { background: #1e293b; border-radius: 8px; padding: 14px; }
.ch-box h4 { margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; }
.ch-box.bad h4 { color: #ef4444; }
.ch-box.good h4 { color: #34d399; }
.ch-bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 11px; }
.ch-bar-bg { flex: 1; background: #0f172a; border-radius: 3px; height: 12px; overflow: hidden; }
.ch-bar-fill { height: 12px; border-radius: 3px; }
.ch-bar-fill.bad { background: #ef4444; }
.ch-bar-fill.good { background: #34d399; }
.ch-label { min-width: 70px; color: #94a3b8; }
.ch-pct { min-width: 45px; text-align: right; font-weight: 700; }
.ch-pct.bad { color: #ef4444; }
.ch-pct.good { color: #34d399; }
.ch-stat { background: #0f172a; border-radius: 6px; padding: 10px; margin-top: 10px; font-size: 11px; color: #94a3b8; }
.ch-stat b { display: block; font-size: 16px; font-weight: 800; margin-bottom: 2px; }
.ch-stat b.bad { color: #ef4444; }
.ch-stat b.good { color: #34d399; }
</style>
<div class="ch-wrap">
  <p style="color:#94a3b8;font-size:11px;margin:0 0 14px">Cenário: cluster de 10 nós → adicionar 1 nó (N=11). 10.000 chaves.</p>
  <div class="ch-row">
    <div class="ch-box bad">
      <h4>Hash Módulo (key % N)</h4>
      <div class="ch-bar-row"><span class="ch-label">N=10→11</span><div class="ch-bar-bg"><div class="ch-bar-fill bad" style="width:91%"></div></div><span class="ch-pct bad">91%</span></div>
      <div class="ch-bar-row"><span class="ch-label">N=5→6</span><div class="ch-bar-bg"><div class="ch-bar-fill bad" style="width:83%"></div></div><span class="ch-pct bad">83%</span></div>
      <div class="ch-bar-row"><span class="ch-label">N=3→4</span><div class="ch-bar-bg"><div class="ch-bar-fill bad" style="width:75%"></div></div><span class="ch-pct bad">75%</span></div>
      <div class="ch-stat">
        <b class="bad">O(K)</b>
        Quase todas as chaves remapeiam. Thundering herd no backend.
      </div>
    </div>
    <div class="ch-box good">
      <h4>Consistent Hashing</h4>
      <div class="ch-bar-row"><span class="ch-label">N=10→11</span><div class="ch-bar-bg"><div class="ch-bar-fill good" style="width:9%"></div></div><span class="ch-pct good">~9%</span></div>
      <div class="ch-bar-row"><span class="ch-label">N=5→6</span><div class="ch-bar-bg"><div class="ch-bar-fill good" style="width:17%"></div></div><span class="ch-pct good">~17%</span></div>
      <div class="ch-bar-row"><span class="ch-label">N=3→4</span><div class="ch-bar-bg"><div class="ch-bar-fill good" style="width:25%"></div></div><span class="ch-pct good">~25%</span></div>
      <div class="ch-stat">
        <b class="good">O(K/N)</b>
        Apenas 1/N das chaves migram. Sistema continua estável.
      </div>
    </div>
  </div>
</div>`,
    },
    {
      title: "Ring com Virtual Nodes",
      caption: "3 nós físicos com 4 vnodes cada — distribuição no espaço hash.",
      html: `<style>
.chvn-wrap { font-family: 'JetBrains Mono', monospace; padding: 16px; background: #0f172a; border-radius: 10px; color: #e2e8f0; }
.chvn-svg-wrap { display: flex; justify-content: center; margin-bottom: 16px; }
.chvn-legend { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.chvn-legend-item { background: #1e293b; border-radius: 6px; padding: 10px; font-size: 11px; }
.chvn-legend-item h5 { margin: 0 0 6px; font-size: 11px; }
.chvn-tok { font-size: 10px; color: #94a3b8; padding: 2px 0; }
</style>
<div class="chvn-wrap">
<div class="chvn-svg-wrap">
<svg viewBox="0 0 300 300" width="260" height="260">
  <circle cx="150" cy="150" r="110" fill="none" stroke="#334155" stroke-width="2"/>
  <text x="150" y="32" text-anchor="middle" font-size="9" fill="#475569" font-family="monospace">0</text>
  <text x="268" y="154" text-anchor="start" font-size="9" fill="#475569" font-family="monospace">2^32/4</text>
  <text x="150" y="278" text-anchor="middle" font-size="9" fill="#475569" font-family="monospace">2^32/2</text>
  <text x="18" y="154" text-anchor="start" font-size="9" fill="#475569" font-family="monospace">3/4</text>
  <circle cx="205" cy="95" r="10" fill="#6366f1" stroke="#fff" stroke-width="1.5"/>
  <text x="205" y="99" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="monospace">A1</text>
  <circle cx="95" cy="95" r="10" fill="#6366f1" stroke="#fff" stroke-width="1.5"/>
  <text x="95" y="99" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="monospace">A2</text>
  <circle cx="95" cy="205" r="10" fill="#6366f1" stroke="#fff" stroke-width="1.5"/>
  <text x="95" y="209" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="monospace">A3</text>
  <circle cx="205" cy="205" r="10" fill="#6366f1" stroke="#fff" stroke-width="1.5"/>
  <text x="205" y="209" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="monospace">A4</text>
  <circle cx="220" cy="122" r="10" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
  <text x="220" y="126" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="monospace">B1</text>
  <circle cx="70" cy="122" r="10" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
  <text x="70" y="126" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="monospace">B2</text>
  <circle cx="122" cy="230" r="10" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
  <text x="122" y="234" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="monospace">B3</text>
  <circle cx="178" cy="230" r="10" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
  <text x="178" y="234" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="monospace">B4</text>
  <circle cx="221" cy="66" r="10" fill="#34d399" stroke="#fff" stroke-width="1.5"/>
  <text x="221" y="70" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="monospace">C1</text>
  <circle cx="66" cy="175" r="10" fill="#34d399" stroke="#fff" stroke-width="1.5"/>
  <text x="66" y="179" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="monospace">C2</text>
  <circle cx="150" cy="260" r="10" fill="#34d399" stroke="#fff" stroke-width="1.5"/>
  <text x="150" y="264" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="monospace">C3</text>
  <circle cx="234" cy="175" r="10" fill="#34d399" stroke="#fff" stroke-width="1.5"/>
  <text x="234" y="179" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="monospace">C4</text>
  <text x="150" y="148" text-anchor="middle" font-size="11" fill="#64748b" font-family="monospace">hash</text>
  <text x="150" y="162" text-anchor="middle" font-size="11" fill="#64748b" font-family="monospace">space</text>
</svg>
</div>
<div class="chvn-legend">
  <div class="chvn-legend-item">
    <h5 style="color:#6366f1">Nó A (4 vnodes)</h5>
    <div class="chvn-tok">A1, A2, A3, A4</div>
    <div class="chvn-tok" style="margin-top:4px">~33% das chaves</div>
  </div>
  <div class="chvn-legend-item">
    <h5 style="color:#f59e0b">Nó B (4 vnodes)</h5>
    <div class="chvn-tok">B1, B2, B3, B4</div>
    <div class="chvn-tok" style="margin-top:4px">~33% das chaves</div>
  </div>
  <div class="chvn-legend-item">
    <h5 style="color:#34d399">Nó C (4 vnodes)</h5>
    <div class="chvn-tok">C1, C2, C3, C4</div>
    <div class="chvn-tok" style="margin-top:4px">~33% das chaves</div>
  </div>
</div>
</div>`,
    },
    {
      title: "Jump Consistent Hashing vs Ring — Comparação de Algoritmos",
      caption: "Trade-offs entre as principais variantes de consistent hashing.",
      html: `<style>
.chjmp-wrap { font-family: sans-serif; background: #0f172a; border-radius: 10px; padding: 16px; color: #e2e8f0; font-size: 12px; }
.chjmp-table { width: 100%; border-collapse: collapse; }
.chjmp-table th { background: #1e293b; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; }
.chjmp-table td { padding: 8px 10px; border-bottom: 1px solid #1e293b; vertical-align: top; font-size: 11px; }
.chjmp-table tr:last-child td { border-bottom: none; }
.chjmp-alg { font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.chjmp-a { color: #6366f1; }
.chjmp-b { color: #f59e0b; }
.chjmp-c { color: #34d399; }
.chjmp-good { color: #34d399; }
.chjmp-bad { color: #ef4444; }
.chjmp-ok { color: #f59e0b; }
</style>
<div class="chjmp-wrap">
  <table class="chjmp-table">
    <tr>
      <th>Algoritmo</th><th>Lookup</th><th>Memória</th><th>Adicionar nó</th><th>Remover nó</th><th>Melhor para</th>
    </tr>
    <tr>
      <td class="chjmp-alg chjmp-a">Ring + vnodes</td>
      <td class="chjmp-ok">O(log N)</td>
      <td class="chjmp-ok">O(N × M)</td>
      <td class="chjmp-good">Qualquer posição</td>
      <td class="chjmp-good">Qualquer nó</td>
      <td>Cassandra, DynamoDB — clusters heterogêneos e com scale/down</td>
    </tr>
    <tr>
      <td class="chjmp-alg chjmp-b">Jump hash</td>
      <td class="chjmp-good">O(ln n)</td>
      <td class="chjmp-good">O(1)</td>
      <td class="chjmp-ok">Só no final</td>
      <td class="chjmp-bad">Não suporta</td>
      <td>Clusters que só crescem (sharding de storage escalável)</td>
    </tr>
    <tr>
      <td class="chjmp-alg chjmp-c">Rendezvous (HRW)</td>
      <td class="chjmp-bad">O(N)</td>
      <td class="chjmp-good">O(1)</td>
      <td class="chjmp-good">Qualquer posição</td>
      <td class="chjmp-good">Qualquer nó</td>
      <td>N pequeno: CDNs, edge selection, grupos de cache pequenos</td>
    </tr>
  </table>
</div>`,
    },
  ],
  mnemonics: [
    {
      label: "ANEL = Apenas Nós Escalonados Linearmente",
      trick: "Ring: chave encontra seu Nó girando no sentido horário",
      explanation: "O anel de consistent hashing pode ser lembrado com a frase 'apenas nós escalonados linearmente': espaço de hash linear dobrado em anel, cada chave encontra o próximo nó no sentido horário. Adicionar 1 nó afeta apenas 1/N das chaves — o arco entre o nó anterior e o novo.",
    },
    {
      label: "VN = Vários Nomes por Nó",
      trick: "Virtual Nodes: cada nó físico tem M identidades (tokens) no anel",
      explanation: "Vnodes são 'vários nomes' para o mesmo servidor físico. Um servidor com 150 vnodes aparece 150 vezes no anel — 150 bilhetes de loteria distribuídos ao longo do anel em vez de 1. Quando o servidor falha, suas 150 posições são absorvidas por vários vizinhos diferentes, diluindo o impacto.",
    },
    {
      label: "JHR — Jump Horário Ring",
      trick: "Jump = sem anel, O(ln n). Ring = com anel, O(log N). Rendezvous = O(N).",
      explanation: "Hierarquia de performance: Jump (mais rápido, sem estado) → Ring com vnodes (flexível, crescimento arbitrário) → Rendezvous (mais simples, N pequeno). Mnemônico JHR em ordem de velocidade de lookup. Jump ganha em velocidade mas perde em flexibilidade de remoção.",
    },
    {
      label: "1/N — A Lei do Consistent Hashing",
      trick: "Adicionar 1 nó move apenas 1/N das chaves. Remover move apenas 1/(N-1).",
      explanation: "A propriedade fundamental: com N nós, cada nó é responsável por 1/N do espaço. Ao adicionar 1 nó, ele 'rouba' aproximadamente K/(N+1) chaves — total muito menor que hash módulo que move K×N/(N+1) chaves. Diferença de fator N que determina se o sistema sobrevive ao scaling.",
    },
  ],
  cheatsheet: {
    title: "Consistent Hashing Cheatsheet",
    caption: "Referência rápida: algoritmos, trade-offs e casos de uso.",
    html: `<style>
.chcs-wrap { font-family: sans-serif; background: #0f172a; border-radius: 10px; padding: 16px; color: #e2e8f0; font-size: 12px; }
.chcs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.chcs-card { background: #1e293b; border-radius: 8px; padding: 12px; }
.chcs-card h4 { margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #6366f1; }
.chcs-item { padding: 3px 0; color: #cbd5e1; display: flex; gap: 6px; font-size: 11px; }
.chcs-item::before { content: '▸'; color: #6366f1; flex-shrink: 0; }
.chcs-code { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: #0f172a; padding: 2px 5px; border-radius: 3px; color: #34d399; }
.chcs-warn { color: #f87171; }
.chcs-good { color: #34d399; }
</style>
<div class="chcs-wrap">
  <div class="chcs-grid">
    <div class="chcs-card">
      <h4>Algoritmos</h4>
      <div class="chcs-item">Ring + vnodes: <span class="chcs-code">O(log N)</span> lookup</div>
      <div class="chcs-item">Jump hash: <span class="chcs-code">O(ln n)</span>, O(1) mem</div>
      <div class="chcs-item">Rendezvous: <span class="chcs-code">O(N)</span> — N pequeno</div>
      <div class="chcs-item">Vnodes típicos: <span class="chcs-code">100–256</span> por nó</div>
    </div>
    <div class="chcs-card">
      <h4>Sistemas Reais</h4>
      <div class="chcs-item">Cassandra: Murmur3 + vnodes</div>
      <div class="chcs-item">DynamoDB: partition key hash</div>
      <div class="chcs-item">Redis Cluster: 16384 slots (CRC16)</div>
      <div class="chcs-item">Memcached: Ketama library</div>
      <div class="chcs-item">CDN Akamai: rendezvous hashing</div>
    </div>
    <div class="chcs-card">
      <h4>Propriedades Garantidas</h4>
      <div class="chcs-item chcs-good">Adicionar 1 nó: move K/(N+1) chaves</div>
      <div class="chcs-item chcs-good">Monotonicidade: chaves só saem de nós existentes</div>
      <div class="chcs-item chcs-good">Com R+W&gt;N: strong consistency tunável</div>
      <div class="chcs-item chcs-good">Vnodes: reduz desvio de carga a O(1/√(N×M))</div>
    </div>
    <div class="chcs-card">
      <h4>Gotchas</h4>
      <div class="chcs-item"><span class="chcs-warn">Hot keys:</span> mesmo nó sempre — cache local</div>
      <div class="chcs-item"><span class="chcs-warn">Jump hash:</span> sem remoção arbitrária</div>
      <div class="chcs-item"><span class="chcs-warn">Range queries:</span> hash ≠ ordem, use range shard</div>
      <div class="chcs-item"><span class="chcs-warn">Adicionar nó em BD:</span> migração cara — planejar</div>
    </div>
  </div>
</div>`,
  },
  mindmap: {
    title: "Consistent Hashing — Mapa Mental",
    html: `<style>
.chmm-wrap { font-family: sans-serif; background: #0f172a; border-radius: 10px; padding: 20px; color: #e2e8f0; font-size: 12px; }
.chmm-center { text-align: center; background: #6366f1; color: #fff; border-radius: 50%; width: 90px; height: 90px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; margin: 0 auto 20px; padding: 8px; box-sizing: border-box; }
.chmm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.chmm-node { background: #1e293b; border-radius: 8px; padding: 10px; }
.chmm-node h4 { margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #6366f1; }
.chmm-leaf { font-size: 11px; color: #94a3b8; padding: 2px 0; }
</style>
<div class="chmm-wrap">
  <div class="chmm-center">Consistent<br>Hashing</div>
  <div class="chmm-grid">
    <div class="chmm-node">
      <h4>O Problema</h4>
      <div class="chmm-leaf">Hash módulo % N</div>
      <div class="chmm-leaf">Thundering herd</div>
      <div class="chmm-leaf">91% remapeado</div>
      <div class="chmm-leaf">Cache miss storm</div>
    </div>
    <div class="chmm-node">
      <h4>Ring</h4>
      <div class="chmm-leaf">Espaço 0 a 2^32</div>
      <div class="chmm-leaf">hash(node) + hash(key)</div>
      <div class="chmm-leaf">Próximo nó horário</div>
      <div class="chmm-leaf">1/N chaves migram</div>
    </div>
    <div class="chmm-node">
      <h4>Virtual Nodes</h4>
      <div class="chmm-leaf">M tokens por nó físico</div>
      <div class="chmm-leaf">100–256 típico</div>
      <div class="chmm-leaf">Falha → diluída</div>
      <div class="chmm-leaf">Heterogeneidade</div>
    </div>
    <div class="chmm-node">
      <h4>Replicação</h4>
      <div class="chmm-leaf">N nós próximos</div>
      <div class="chmm-leaf">Preference list</div>
      <div class="chmm-leaf">R+W&gt;N = strong</div>
      <div class="chmm-leaf">Cassandra, Dynamo</div>
    </div>
    <div class="chmm-node">
      <h4>Variantes</h4>
      <div class="chmm-leaf">Jump: O(ln n)</div>
      <div class="chmm-leaf">Rendezvous: O(N)</div>
      <div class="chmm-leaf">Bounded loads</div>
      <div class="chmm-leaf">Redis: hash slots</div>
    </div>
    <div class="chmm-node">
      <h4>Gotchas</h4>
      <div class="chmm-leaf">Hot keys</div>
      <div class="chmm-leaf">Range ≠ hash</div>
      <div class="chmm-leaf">Jump: sem remove</div>
      <div class="chmm-leaf">Migração cara em BD</div>
    </div>
  </div>
</div>`,
  },
  exercises: [
    {
      level: "iniciante",
      title: "Simular o anel e calcular remapeamento",
      description: "Escreva uma função que mapeia 1000 chaves (key:0 a key:999) para 5 nós usando hash módulo. Depois simule adicionar 1 nó (N=6) e conte quantas chaves mudaram. Repita com consistent hashing básico (anel sem vnodes). Compare os resultados e calcule a diferença percentual de remapeamento entre as duas abordagens.",
      concepts: ["hash módulo", "anel de hash", "remapeamento", "chaves migradas"],
    },
    {
      level: "intermediario",
      title: "Implementar consistent hashing com vnodes",
      description: "Implemente a classe ConsistentHashRing em TypeScript com: addNode(id, address, vnodes=150), removeNode(id), getNode(key) e getStats() que retorna { nodeId, keyCount, percentLoad } para cada nó. Use SHA-256 para os tokens. Adicione 4 nós e distribua 10.000 chaves aleatórias. Verifique que a distribuição de carga tem desvio padrão menor que 5% da média. Teste remoção de 1 nó e meça quantas chaves migraram.",
      concepts: ["virtual nodes", "ring", "sorted array", "bisect", "distribuição de carga"],
      hint: "Use um array ordenado de tokens + binary search para lookup eficiente. A inserção no array ordenado é O(M log M).",
    },
    {
      level: "senior",
      title: "Consistent hashing com replicação e detecção de hotspot",
      description: "Expanda o ConsistentHashRing para suportar replicação: getPreferenceList(key, n=3) retorna os N próximos nós distintos no anel (sem repetir o mesmo nó físico mesmo com vnodes). Implemente bounded loads: se um nó está com mais de 1.5× a carga média, o lookup deve redirecionar para o próximo nó disponível. Simule: 1 nó com o dobro de vnodes (nó mais potente), distribuição de 100.000 chaves, 10 chaves 'hot' com 1000× mais acessos. Meça: distribuição de carga por nó, quantas hot keys foram redirecionadas pelo bounded loads, e P99 de profundidade de lookup.",
      concepts: ["replicação", "preference list", "bounded loads", "hot keys", "vnodes heterogêneos"],
      hint: "Preference list: ao iterar o anel para réplicas, manter um Set<nodeId> para evitar repetir o mesmo nó físico que pode ter múltiplos tokens adjacentes.",
    },
  ],
  videos: [
    {
      title: "Consistent Hashing — System Design Primer",
      channel: "Gaurav Sen",
      url: "https://www.youtube.com/watch?v=zaRkONvyGr8",
      topic: "Conceito fundamental, anel, vnodes — melhor introdução visual disponível",
    },
    {
      title: "Consistent Hashing Explained",
      channel: "ByteByteGo",
      url: "https://www.youtube.com/watch?v=UF9Iqmg94tk",
      topic: "Visualização animada do anel e impacto de vnodes na distribuição",
    },
    {
      title: "Amazon DynamoDB — Architecture Deep Dive",
      channel: "AWS re:Invent",
      url: "https://www.youtube.com/watch?v=yvBR71D0nAQ",
      topic: "Como DynamoDB usa consistent hashing internamente com partition keys",
    },
    {
      title: "Designing a Distributed Cache",
      channel: "System Design Interview",
      url: "https://www.youtube.com/watch?v=iuqZvajTOyA",
      topic: "Aplicação prática de consistent hashing em cache distribuído tipo Memcached",
    },
    {
      title: "Cassandra's Consistent Hashing and Vnodes",
      channel: "DataStax Developers",
      url: "https://www.youtube.com/watch?v=E3u0H7rkH_0",
      topic: "Token ring, vnodes e rebalanceamento automático no Cassandra",
    },
  ],
  resources: [
    {
      title: "Consistent Hashing and Random Trees (Karger et al., 1997)",
      url: "https://www.akamai.com/site/en/documents/research-paper/consistent-hashing-and-random-trees-distributed-caching-protocols-for-relieving-hot-spots-on-the-world-wide-web-technical-publication.pdf",
      kind: "artigo",
    },
    {
      title: "Amazon Dynamo: Amazon's Highly Available Key-value Store (2007)",
      url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
      kind: "artigo",
    },
    {
      title: "A Fast, Minimal Memory, Consistent Hash Algorithm (Jump Hash — Google, 2014)",
      url: "https://arxiv.org/abs/1406.2294",
      kind: "artigo",
    },
    {
      title: "Consistent Hashing with Bounded Loads (Google, 2017)",
      url: "https://research.google/pubs/consistent-hashing-with-bounded-loads/",
      kind: "artigo",
    },
    {
      title: "Designing Data-Intensive Applications — Martin Kleppmann",
      url: "https://dataintensive.net/",
      kind: "livro",
    },
    {
      title: "Toptal — A Guide to Consistent Hashing",
      url: "https://www.toptal.com/big-data/consistent-hashing",
      kind: "artigo",
    },
    {
      title: "High Scalability — Consistent Hashing Algorithm",
      url: "https://highscalability.com/consistent-hashing-algorithm/",
      kind: "artigo",
    },
  ],
}

export default consistentHashing
