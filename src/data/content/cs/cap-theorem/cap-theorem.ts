import type { SkillContent } from '@/types'

const capTheorem: SkillContent = {
  tagline: 'CAP, PACELC e modelos de consistência: as decisões fundamentais de qualquer sistema distribuído.',
  why: 'CAP theorem é a base teórica de toda discussão de sistemas distribuídos em entrevista sênior — saber explicar por que P não é opcional, dar exemplos reais (Cassandra AP, etcd CP), entender PACELC e modelos de consistência (linearizability, eventual, causal) separa pleno de sênior. Toda escolha de banco em system design depende desse trade-off.',
  summary:
    'CAP theorem (Brewer, 2000): em uma partição de rede, um sistema distribuído escolhe entre Consistency (toda leitura vê a última escrita) e Availability (toda request recebe resposta). Partition tolerance (P) não é opcional — partições acontecem, então a escolha real é entre CP e AP. PACELC estende: Else (sem partição) escolhe entre Latency e Consistency. Modelos de consistência variam de linearizability (mais forte) a eventual consistency (mais fraco). Mecanismos como quorum reads/writes, CRDTs, vector clocks, gossip protocols e 2PC/Saga implementam diferentes pontos do espectro.',
  prerequisite:
    'Entender o que é replicação de dados, latência de rede, partição de rede (network partition), eventual vs strong consistency, e ter familiaridade com pelo menos um banco SQL (Postgres) e um NoSQL (Cassandra/DynamoDB/Mongo).',
  howToStudy:
    'Comece pelo paper original de Brewer e o "CAP twelve years later". Implemente um G-Counter CRDT em TypeScript e veja convergência sem coordenação. Faça experimentos com Cassandra: rode com CL=ONE e veja stale reads, depois CL=QUORUM e veja consistency forte. Leia "Designing Data-Intensive Applications" (Kleppmann) — é o livro de referência. Estude Jepsen analyses (jepsen.io) para ver como bancos reais falham em partição.',
  keypoints: [
    {
      title: 'CAP theorem — a definição precisa',
      body: 'Em sistemas distribuídos com replicação de dados: dado que partições de rede (P) acontecem, você escolhe entre Consistency (linearizability — toda leitura vê última escrita confirmada globalmente) e Availability (todo node não-falho responde a toda request). NÃO existe sistema CA em rede real — partições são inevitáveis. CAP só se aplica DURANTE partição; sem partição, o sistema pode ser consistente E disponível.',
    },
    {
      title: 'Por que P não é opcional',
      body: 'Mensagens entre nodes podem ser perdidas, atrasadas ou reordenadas — é uma garantia da rede TCP/IP, não uma falha. Particionamento (split-brain) acontece em datacenters reais por: cabo cortado, switch falhando, latência alta degradando para timeout, GC pause de 30s parecendo morte. Sistema "CA" só existe em single-node ou em redes assumidas perfeitas — fantasia. CAP é PA ou PC na prática.',
    },
    {
      title: 'Sistemas CP — exemplos e comportamento',
      body: 'CP escolhe Consistency > Availability em partição. Exemplos: ZooKeeper, etcd, Consul, HBase, MongoDB (com w=majority desde 4.0), PostgreSQL com replica sync, Spanner. Comportamento: durante partição, o lado minoritário fica indisponível (não aceita escritas, pode rejeitar leituras). O lado majoritário continua. Garante linearizability — toda leitura vê última escrita. Custo: latência mais alta (espera quorum), indisponibilidade local em partição.',
    },
    {
      title: 'Sistemas AP — exemplos e comportamento',
      body: 'AP escolhe Availability > Consistency em partição. Exemplos: Cassandra (default), DynamoDB (default), CouchDB, Riak, Redis (replication sem WAIT). Comportamento: ambos os lados da partição continuam aceitando reads/writes. Pode resultar em escritas conflitantes que precisam ser reconciliadas (LWW, vector clocks, CRDTs, manual merge). Garante eventual consistency — sistema converge eventualmente. Trade-off: stale reads, possível perda silenciosa de updates concorrentes.',
    },
    {
      title: 'PACELC — extensão do CAP',
      body: 'CAP só fala sobre comportamento durante partição. PACELC (Abadi 2010) estende: P + A/C, Else (sem partição) L/C. Em operação normal, sistema ainda escolhe entre Latency (resposta rápida com possível stale data) e Consistency (espera coordenação, latência maior). Classificações: Spanner = PC/EC (sempre prefere C), DynamoDB = PA/EL (prefere A em partição, L em normal), MongoDB = PA/EC (com configuração padrão). Resposta nuançada vs CAP simples.',
    },
    {
      title: 'Modelos de consistência — espectro',
      body: 'Do mais forte ao mais fraco: (1) Linearizability — toda operação parece atômica em algum ponto entre invocação e resposta; ordem global respeita real-time. (2) Sequential consistency — todas operações em alguma ordem total consistente com ordem de cada processo. (3) Causal consistency — operações relacionadas causalmente (read-then-write) preservam ordem; operações concorrentes podem aparecer em qualquer ordem. (4) Eventual consistency — sistema converge eventualmente sem garantia de ordem. (5) Read-your-writes, monotonic reads, monotonic writes — garantias session-level. Linearizability é o "single-machine" de bancos distribuídos.',
    },
    {
      title: 'Quorum reads/writes — fórmula R + W > N',
      body: 'Em sistema com N réplicas, escrita confirma quando W réplicas confirmaram, leitura consulta R réplicas e retorna o valor mais recente. Se R + W > N, leitura SEMPRE vê última escrita (overlap entre quorum de read e write). Trade-offs: W=N (todas) = consistency forte mas baixa availability; W=1 = alta availability mas inconsistência; W=⌈N/2⌉+1 (majority) = balance. Cassandra suporta tunable: ONE, QUORUM (majority), ALL, LOCAL_QUORUM (em DC local). Mesmo sistema pode ser CP ou AP dependendo de configuração por query.',
    },
    {
      title: 'Vector clocks e versioning',
      body: 'Como detectar conflitos em sistemas eventualmente consistentes? Vector clock: cada node mantém [(node_id, counter)]. Versão A → B se vetor de A é dominado por B componente-a-componente. Concorrente se nenhum domina. Dynamo/Riak usam vector clocks; cliente recebe ambas versões em conflito e aplica merge logic. Last-Write-Wins (LWW): ignora vector clock, usa só timestamp — perde updates concorrentes silenciosamente. Cassandra usa LWW por default — não é "vector clock real".',
    },
    {
      title: 'CRDTs — Conflict-free Replicated Data Types',
      body: 'Estruturas de dados que convergem automaticamente sem coordenação, sem perder updates concorrentes. Tipos: G-Counter (counter monotônico, merge via max por node), PN-Counter (positivos + negativos), G-Set (add only), 2P-Set (add + tombstone), OR-Set (add wins concurrent remove), LWW-Register (LWW com timestamp), Sequence CRDTs (RGA, Yjs — para edição colaborativa). Usados em: Riak, Redis (CRDB), Yjs/Automerge (Google Docs alternative). Limitação: nem toda estrutura tem CRDT eficiente.',
    },
    {
      title: 'Two-Phase Commit (2PC) — protocolo CP',
      body: 'Coordinator pergunta a todos participants "preparem-se?" → todos respondem prepared/abort. Se todos prepared → "commit". Se algum abort → "abort all". Garante atomicidade distribuída. Problema: blocking — se coordinator crash entre prepare e commit, participants ficam locked esperando indefinidamente. 2PC NÃO é tolerante a falhas (CP forte mas sem A em coordinator failure). Variações: 3PC adiciona estado intermediário mas tem cenários de erro também. Paxos/Raft são alternativas que tolera falha de minoria.',
    },
    {
      title: 'Saga pattern — alternativa AP a 2PC',
      body: 'Para transações longas em microserviços, 2PC é inviável (locks por horas). Saga: sequência de transações locais; se uma falha, executa transações compensatórias em ordem inversa. Dois estilos: (1) Orchestration — orchestrator central (state machine) chama serviços. (2) Choreography — eventos via message broker, cada serviço reage e emite próximo evento. Trade-offs: não garante isolamento ACID (estados intermediários visíveis), exige idempotência em compensações, debugging complexo em choreography. Padrão de e-commerce moderno.',
    },
    {
      title: 'Linearizability vs serializability — não confundir',
      body: 'Conceitos diferentes que entrevistadores misturam. Linearizability: garantia sobre operações ÚNICAS em objetos com ordem real-time global (registers, key-value). Serializability: garantia sobre TRANSAÇÕES (múltiplas operações) executando como se fosse em alguma ordem serial. Strict serializability = serializability + linearizability (Spanner). PostgreSQL serializable isolation: serializable mas não linearizable em replicas. Distinção crítica: bancos distribuídos podem ser serializable sem ser linearizable (e vice-versa).',
    },
    {
      title: 'Read-your-writes consistency',
      body: 'Sessão A escreve X=5, depois lê X. Garante ler 5 (não valor antigo). Difícil em sistemas com replicação assíncrona — read pode ir para replica que ainda não recebeu write. Soluções: (1) sticky session — todas requests de A vão para mesmo node. (2) Read after write quorum — read consulta master OU quorum. (3) Client tracking — client envia versão da sua última escrita; servidor garante read >= versão. DynamoDB tem ConsistentRead flag que ativa isso por query.',
    },
    {
      title: 'Anti-entropy e gossip protocols',
      body: 'Como sistemas eventualmente consistentes garantem convergência? (1) Read repair — durante read, se replicas divergem, propaga versão mais nova. (2) Hinted handoff — node temporariamente offline tem writes guardados por outros e entregues quando volta. (3) Anti-entropy via Merkle trees — comparação eficiente de árvores de hash entre replicas para detectar diferenças. (4) Gossip — nodes periodicamente trocam estado com peers aleatórios, propagando informação em O(log N). Cassandra usa todos esses mecanismos.',
    },
    {
      title: 'BASE vs ACID',
      body: 'ACID (bancos tradicionais): Atomicity, Consistency, Isolation, Durability — garantias fortes por transação. BASE (sistemas distribuídos AP): Basically Available (sistema sempre responde), Soft state (estado pode mudar sem input — propagação assíncrona), Eventual consistency. Não é "ACID ruim" — é trade-off consciente para escala. ACID em distribuído (Spanner) é caro: TrueTime atomic clocks, latência adicional. BASE é o default para escala web; ACID é o default para finanças, inventário, dados críticos. Hybrid: NewSQL (CockroachDB, YugabyteDB) tenta ACID em escala distribuída.',
    },
  ],
  diagrams: [
    {
      title: 'CAP Theorem — triângulo com sistemas reais',
      html: `<style>
.captx-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.captx-grid{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:start}
.captx-tri{position:relative;width:240px;height:220px}
.captx-tri svg{width:240px;height:220px}
.captx-cards{display:flex;flex-direction:column;gap:8px}
.captx-card{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:10px 12px}
.captx-h{font-size:11px;font-weight:700;margin-bottom:4px}
.captx-body{font-size:10px;color:#94a3b8;line-height:1.5}
.captx-ex{font-size:9px;font-family:'JetBrains Mono',monospace;color:#475569;margin-top:4px}
</style>
<div class="captx-wrap">
<div style="font-size:13px;font-weight:700;color:#A855F7;margin-bottom:12px">CAP Theorem — escolha em partição de rede</div>
<div class="captx-grid">
  <div class="captx-tri">
    <svg viewBox="0 0 240 220">
      <polygon points="120,15 20,200 220,200" fill="none" stroke="#475569" stroke-width="1.5"/>
      <polygon points="120,15 70,107 170,107" fill="rgba(168,85,247,.10)" stroke="none"/>
      <polygon points="70,107 20,200 120,200" fill="rgba(74,222,128,.06)" stroke="none"/>
      <polygon points="170,107 120,200 220,200" fill="rgba(56,189,248,.06)" stroke="none"/>
      <circle cx="120" cy="15" r="22" fill="#1e293b" stroke="#A855F7" stroke-width="2"/>
      <text x="120" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="#A855F7" font-family="Space Grotesk,sans-serif"><tspan x="120" dy="4">C</tspan></text>
      <text x="120" y="32" text-anchor="middle" font-size="8" fill="#94a3b8" font-family="Space Grotesk,sans-serif">Consistency</text>
      <circle cx="20" cy="200" r="22" fill="#1e293b" stroke="#4ade80" stroke-width="2"/>
      <text x="20" y="199" text-anchor="middle" font-size="11" font-weight="700" fill="#4ade80" font-family="Space Grotesk,sans-serif"><tspan x="20" dy="4">A</tspan></text>
      <text x="20" y="217" text-anchor="middle" font-size="8" fill="#94a3b8" font-family="Space Grotesk,sans-serif">Availability</text>
      <circle cx="220" cy="200" r="22" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
      <text x="220" y="199" text-anchor="middle" font-size="11" font-weight="700" fill="#fbbf24" font-family="Space Grotesk,sans-serif"><tspan x="220" dy="4">P</tspan></text>
      <text x="220" y="217" text-anchor="middle" font-size="8" fill="#94a3b8" font-family="Space Grotesk,sans-serif">Partition</text>
      <text x="160" y="100" font-size="10" fill="#A855F7" font-family="Space Grotesk,sans-serif" font-weight="700">CP</text>
      <text x="148" y="115" font-size="8" fill="#64748b" font-family="Space Grotesk,sans-serif">etcd · Spanner</text>
      <text x="148" y="125" font-size="8" fill="#64748b" font-family="Space Grotesk,sans-serif">ZooKeeper · HBase</text>
      <text x="55" y="100" font-size="10" fill="#4ade80" font-family="Space Grotesk,sans-serif" font-weight="700">AP</text>
      <text x="40" y="115" font-size="8" fill="#64748b" font-family="Space Grotesk,sans-serif">Cassandra</text>
      <text x="40" y="125" font-size="8" fill="#64748b" font-family="Space Grotesk,sans-serif">DynamoDB · Riak</text>
      <text x="120" y="170" text-anchor="middle" font-size="9" fill="#ef4444" font-family="Space Grotesk,sans-serif" font-weight="700">CA = mito</text>
      <text x="120" y="183" text-anchor="middle" font-size="7" fill="#94a3b8" font-family="Space Grotesk,sans-serif">single-node ou rede ideal</text>
    </svg>
  </div>
  <div class="captx-cards">
    <div class="captx-card" style="border-color:rgba(168,85,247,.4)">
      <div class="captx-h" style="color:#A855F7">CP — Consistency + Partition tolerance</div>
      <div class="captx-body">Em partição, lado minoritário fica indisponível para preservar consistency. Toda leitura vê última escrita confirmada globalmente.</div>
      <div class="captx-ex">PostgreSQL (sync) · etcd · Zookeeper · Spanner · MongoDB (w=majority)</div>
    </div>
    <div class="captx-card" style="border-color:rgba(74,222,128,.4)">
      <div class="captx-h" style="color:#4ade80">AP — Availability + Partition tolerance</div>
      <div class="captx-body">Em partição, ambos os lados continuam aceitando reads/writes. Pode resultar em stale reads ou conflitos a serem reconciliados depois.</div>
      <div class="captx-ex">Cassandra · DynamoDB · CouchDB · Riak · Redis (replication async)</div>
    </div>
    <div class="captx-card" style="border-color:rgba(239,68,68,.4)">
      <div class="captx-h" style="color:#ef4444">CA — não existe na prática</div>
      <div class="captx-body">Em rede real, partição é inevitável. Sistemas que se descrevem como CA assumem rede perfeita — assumption falsa em produção. CAP real é PA ou PC.</div>
    </div>
  </div>
</div>
</div>`,
      caption: 'Toda escolha de banco em sistema distribuído cai num dos dois lados — sabe-se que P sempre vence. Cassandra com QUORUM se aproxima de CP; Postgres async-replica se aproxima de AP. CAP é tunable, não estático.',
    },
    {
      title: 'PACELC — CAP estendido para operação normal',
      html: `<style>
.pacelc-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.pacelc-row{display:grid;grid-template-columns:120px 1fr 1fr;gap:12px;padding:10px 12px;background:#1e293b;border:1px solid #334155;border-radius:8px;margin-bottom:8px;align-items:center}
.pacelc-tag{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:11px;letter-spacing:.05em}
.pacelc-cell{font-size:10px;color:#94a3b8;line-height:1.5}
.pacelc-strong{color:#e2e8f0;font-weight:700}
.pacelc-h{display:grid;grid-template-columns:120px 1fr 1fr;gap:12px;padding:8px 12px;font-size:9px;letter-spacing:.1em;color:#A855F7;font-weight:700;text-transform:uppercase;margin-bottom:4px}
</style>
<div class="pacelc-wrap">
<div style="font-size:13px;font-weight:700;color:#A855F7;margin-bottom:6px">PACELC — Partition: A/C, Else: L/C</div>
<div style="font-size:10px;color:#94a3b8;margin-bottom:14px">CAP só fala da partição. PACELC adiciona: SEM partição, ainda há trade-off entre Latency e Consistency.</div>
<div class="pacelc-h">
  <div>Sistema</div><div>Em partição</div><div>Em operação normal</div>
</div>
<div class="pacelc-row">
  <div class="pacelc-tag" style="color:#A855F7">PC / EC</div>
  <div class="pacelc-cell"><span class="pacelc-strong">Spanner, CockroachDB</span> — escolhe Consistency: lado minoritário fica indisponível.</div>
  <div class="pacelc-cell">Escolhe Consistency: aguarda quorum global, latência maior mas linearizability.</div>
</div>
<div class="pacelc-row">
  <div class="pacelc-tag" style="color:#4ade80">PA / EL</div>
  <div class="pacelc-cell"><span class="pacelc-strong">DynamoDB, Cassandra</span> — escolhe Availability: ambos lados aceitam, eventual consistency.</div>
  <div class="pacelc-cell">Escolhe Latency: lê do nó local, possível stale, latência mínima.</div>
</div>
<div class="pacelc-row">
  <div class="pacelc-tag" style="color:#fbbf24">PA / EC</div>
  <div class="pacelc-cell"><span class="pacelc-strong">MongoDB</span> (w=majority) — escolhe Availability na partição minoritária.</div>
  <div class="pacelc-cell">Escolhe Consistency: leituras com readConcern majority esperam quorum.</div>
</div>
<div class="pacelc-row">
  <div class="pacelc-tag" style="color:#38bdf8">PC / EL</div>
  <div class="pacelc-cell"><span class="pacelc-strong">PNUTS</span> (Yahoo) — escolhe Consistency em partição via timeline-per-record.</div>
  <div class="pacelc-cell">Escolhe Latency: lê réplica local mesmo se stale (sub-segundo de stale).</div>
</div>
<div style="font-size:9px;color:#64748b;margin-top:10px;line-height:1.6">
<strong style="color:#fbbf24">⚠</strong> Cassandra com CL=QUORUM em read+write vira PC/EC efetivamente — o "tipo CAP" depende de configuração por query, não do produto.<br>
<strong style="color:#fbbf24">⚠</strong> DynamoDB com ConsistentRead=true vira PC/EC para essa query — stronger consistency com latência ~2× maior.
</div>
</div>`,
      caption: 'PACELC é a resposta sênior em entrevista — CAP simples ignora que sistemas distribuídos têm trade-off mesmo quando a rede está saudável. Spanner sempre prefere C; DynamoDB sempre prefere L.',
    },
    {
      title: 'Quorum — fórmula R + W > N',
      html: `<style>
.quor-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.quor-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
.quor-cell{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:14px;text-align:center}
.quor-cell.consistent{border-color:rgba(168,85,247,.5);background:rgba(168,85,247,.06)}
.quor-cell.weak{border-color:rgba(248,113,113,.4)}
.quor-formula{font-size:14px;font-weight:700;color:#A855F7;margin-bottom:6px}
.quor-h{font-size:10px;color:#94a3b8;margin-bottom:8px;letter-spacing:.05em;text-transform:uppercase}
.quor-detail{font-size:9.5px;color:#94a3b8;line-height:1.6;text-align:left}
.quor-strong{color:#e2e8f0}
.quor-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed #334155}
.quor-row:last-child{border-bottom:none}
</style>
<div class="quor-wrap">
<div style="font-size:13px;font-weight:700;color:#A855F7;margin-bottom:8px;font-family:'Space Grotesk',sans-serif">Quorum — N=3 réplicas</div>
<div style="font-size:10px;color:#94a3b8;margin-bottom:14px;font-family:'Space Grotesk',sans-serif">Strong consistency: R + W &gt; N. Read consulta R réplicas, write confirma W. Sobreposição garante leitura ver última escrita.</div>
<div class="quor-grid">
  <div class="quor-cell consistent">
    <div class="quor-h">Strong consistency</div>
    <div class="quor-formula">W=3, R=1</div>
    <div class="quor-detail">
      <div class="quor-row"><span>R+W</span><span class="quor-strong">4 &gt; 3 ✓</span></div>
      <div class="quor-row"><span>Read latency</span><span class="quor-strong">baixa</span></div>
      <div class="quor-row"><span>Write latency</span><span class="quor-strong">alta</span></div>
      <div class="quor-row"><span>Falha aceita</span><span class="quor-strong">0 nodes write</span></div>
    </div>
  </div>
  <div class="quor-cell consistent">
    <div class="quor-h">Strong consistency (balance)</div>
    <div class="quor-formula">W=2, R=2 (QUORUM)</div>
    <div class="quor-detail">
      <div class="quor-row"><span>R+W</span><span class="quor-strong">4 &gt; 3 ✓</span></div>
      <div class="quor-row"><span>Read latency</span><span class="quor-strong">média</span></div>
      <div class="quor-row"><span>Write latency</span><span class="quor-strong">média</span></div>
      <div class="quor-row"><span>Falha aceita</span><span class="quor-strong">1 node</span></div>
    </div>
  </div>
  <div class="quor-cell weak">
    <div class="quor-h">Eventual consistency</div>
    <div class="quor-formula" style="color:#f87171">W=1, R=1</div>
    <div class="quor-detail">
      <div class="quor-row"><span>R+W</span><span style="color:#f87171">2 ≤ 3 ✗</span></div>
      <div class="quor-row"><span>Read latency</span><span class="quor-strong">mínima</span></div>
      <div class="quor-row"><span>Write latency</span><span class="quor-strong">mínima</span></div>
      <div class="quor-row"><span>Falha aceita</span><span class="quor-strong">2 nodes</span></div>
    </div>
  </div>
</div>
<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px;font-size:10px;line-height:1.7;font-family:'Space Grotesk',sans-serif;color:#94a3b8">
<strong style="color:#e2e8f0">Dynamic-Cassandra LOCAL_QUORUM:</strong> quorum DENTRO de um datacenter, não cross-DC. Latência ms vs cross-region 100+ms.<br>
<strong style="color:#e2e8f0">Sloppy quorum (Dynamo):</strong> se W nodes não disponíveis, escreve em healthy nodes "fora do anel" — eventually consistent mas alta availability. Hinted handoff entrega depois.<br>
<strong style="color:#e2e8f0">Read repair:</strong> se R nodes retornam versões diferentes, propaga última versão em background. Cassandra faz isso por default em CL=QUORUM.
</div>
</div>`,
      caption: 'Quorum é o mecanismo que torna sistemas tunable entre CP e AP. R+W > N garante linearizability mas custa latência; R+W ≤ N é eventual mas rápido. Cassandra/DynamoDB permitem ajustar por query.',
    },
  ],
  mnemonics: [
    {
      label: 'CAP-PIE',
      trick: 'CAP é P + escolha (A ou C) — Particao impõe escolha',
      explanation: 'Como toda fatia de pizza tem que ter borda, todo sistema distribuído real tem que ter P. A escolha é entre A (continuar respondendo) ou C (recusar para preservar consistência). Sistema "CA" é mito — equivale a assumir rede sem falhas. CAP real é PA ou PC.',
    },
    {
      label: 'PACELC = "Pace LC"',
      trick: 'PACELC adiciona "pace" (ritmo/latência) ao CAP normal',
      explanation: 'PA/CL: em partição escolha A/C, ELSE (sem partição) escolhe L/C. Spanner é PC/EC (sempre C, latência alta). DynamoDB é PA/EL (sempre rápido, eventual). MongoDB padrão é PA/EC. A maioria dos sistemas tem trade-off mesmo SEM partição — só CAP simples não captura.',
    },
    {
      label: 'BASE',
      trick: 'BAse Soft Eventual — oposto de ACID',
      explanation: 'Basically Available: sistema sempre responde (mesmo que stale). Soft state: estado pode mudar sem input externo (propagação assíncrona). Eventually consistent: converge eventualmente. NÃO é "ACID ruim" — trade-off consciente para escala. ACID = finanças/inventário; BASE = web/social/feed.',
    },
    {
      label: 'R+W>N',
      trick: 'Read + Write > N réplicas = strong consistency',
      explanation: 'Em sistema com N réplicas, se quorum de read R + quorum de write W somam mais que N, há sobreposição garantida — leitura sempre vê última escrita. R=W=⌈N/2⌉+1 (majority) é o balanço clássico. R=1+W=N = read rápido, write lento. R=N+W=1 = oposto. Cassandra QUORUM = majority.',
    },
    {
      label: 'CRDT = "Convergem Replicações Distribuídas Tranquilamente"',
      trick: 'CRDTs são tipos que se mergem sozinhos sem conflito',
      explanation: 'Conflict-free Replicated Data Types: estruturas de dados projetadas para convergir sem coordenação. Counters (G-Counter, PN-Counter), Sets (G-Set, OR-Set), Registers (LWW), Sequences (Yjs). Se merge é commutativo + associativo + idempotente, dois nodes podem operar offline e juntar depois sem perder updates.',
    },
    {
      label: 'LinSer ≠ SerLin',
      trick: 'Linearizability ≠ Serializability — não confundir',
      explanation: 'Linearizability: ordem REAL-TIME global em operações únicas (registers, KV). Serializability: ordem serial em TRANSAÇÕES (multi-op). PostgreSQL serializable não é linearizable em replicas. Spanner é strict serializable (ambos). Saber a diferença separa pleno de sênior em system design.',
    },
  ],
  cheatsheet: {
    title: 'CAP & sistemas distribuídos — cheatsheet',
    html: `<style>
.captcs{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:18px;color:#e2e8f0;font-size:10.5px}
.captcs-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.captcs-section{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px}
.captcs-h{font-size:10px;font-weight:700;color:#A855F7;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;font-family:'Space Grotesk',sans-serif}
.captcs-line{padding:3px 0;border-bottom:1px dashed #334155;display:flex;justify-content:space-between;gap:10px}
.captcs-line:last-child{border-bottom:none}
.captcs-key{color:#94a3b8;flex-shrink:0}
.captcs-val{color:#e2e8f0;text-align:right}
.captcs-good{color:#4ade80}
.captcs-bad{color:#f87171}
.captcs-warn{color:#fbbf24}
</style>
<div class="captcs">
<div class="captcs-grid">
  <div class="captcs-section">
    <div class="captcs-h">CAP — sistemas comuns</div>
    <div class="captcs-line"><span class="captcs-key">PostgreSQL (sync)</span><span class="captcs-val">CP</span></div>
    <div class="captcs-line"><span class="captcs-key">PostgreSQL (async)</span><span class="captcs-val">AP-ish</span></div>
    <div class="captcs-line"><span class="captcs-key">MongoDB (w=majority)</span><span class="captcs-val">CP</span></div>
    <div class="captcs-line"><span class="captcs-key">Cassandra (default)</span><span class="captcs-val">AP</span></div>
    <div class="captcs-line"><span class="captcs-key">Cassandra (QUORUM)</span><span class="captcs-val">CP-ish</span></div>
    <div class="captcs-line"><span class="captcs-key">DynamoDB (default)</span><span class="captcs-val">AP</span></div>
    <div class="captcs-line"><span class="captcs-key">DynamoDB (consistent)</span><span class="captcs-val">CP</span></div>
    <div class="captcs-line"><span class="captcs-key">etcd / Zookeeper</span><span class="captcs-val">CP</span></div>
    <div class="captcs-line"><span class="captcs-key">Redis (replication)</span><span class="captcs-val">AP</span></div>
    <div class="captcs-line"><span class="captcs-key">Spanner / CockroachDB</span><span class="captcs-val">CP (strict)</span></div>
  </div>
  <div class="captcs-section">
    <div class="captcs-h">PACELC</div>
    <div class="captcs-line"><span class="captcs-key">Spanner</span><span class="captcs-val">PC/EC</span></div>
    <div class="captcs-line"><span class="captcs-key">CockroachDB</span><span class="captcs-val">PC/EC</span></div>
    <div class="captcs-line"><span class="captcs-key">PostgreSQL (sync)</span><span class="captcs-val">PC/EC</span></div>
    <div class="captcs-line"><span class="captcs-key">DynamoDB</span><span class="captcs-val">PA/EL</span></div>
    <div class="captcs-line"><span class="captcs-key">Cassandra</span><span class="captcs-val">PA/EL</span></div>
    <div class="captcs-line"><span class="captcs-key">MongoDB</span><span class="captcs-val">PA/EC</span></div>
    <div class="captcs-line"><span class="captcs-key">Riak</span><span class="captcs-val">PA/EL</span></div>
  </div>
  <div class="captcs-section">
    <div class="captcs-h">Modelos de consistência (forte → fraco)</div>
    <div class="captcs-line"><span class="captcs-key">Strict serializable</span><span class="captcs-val">Spanner</span></div>
    <div class="captcs-line"><span class="captcs-key">Linearizability</span><span class="captcs-val">etcd, ZK</span></div>
    <div class="captcs-line"><span class="captcs-key">Serializability</span><span class="captcs-val">PostgreSQL</span></div>
    <div class="captcs-line"><span class="captcs-key">Snapshot isolation</span><span class="captcs-val">PG read committed+</span></div>
    <div class="captcs-line"><span class="captcs-key">Causal consistency</span><span class="captcs-val">MongoDB causal</span></div>
    <div class="captcs-line"><span class="captcs-key">Read-your-writes</span><span class="captcs-val">DynamoDB consistent</span></div>
    <div class="captcs-line"><span class="captcs-key">Eventual</span><span class="captcs-val">Cassandra ONE</span></div>
  </div>
  <div class="captcs-section">
    <div class="captcs-h">Quorum (N=3)</div>
    <div class="captcs-line"><span class="captcs-key">W=1, R=1</span><span class="captcs-val captcs-bad">eventual (ONE)</span></div>
    <div class="captcs-line"><span class="captcs-key">W=2, R=2</span><span class="captcs-val captcs-good">strong (QUORUM)</span></div>
    <div class="captcs-line"><span class="captcs-key">W=3, R=1</span><span class="captcs-val captcs-warn">read-fast strong</span></div>
    <div class="captcs-line"><span class="captcs-key">W=1, R=3</span><span class="captcs-val captcs-warn">write-fast strong</span></div>
    <div class="captcs-line"><span class="captcs-key">Sobreposição</span><span class="captcs-val">R+W &gt; N</span></div>
    <div class="captcs-line"><span class="captcs-key">Falha tolerada</span><span class="captcs-val">N - W writes</span></div>
  </div>
  <div class="captcs-section">
    <div class="captcs-h">Mecanismos AP</div>
    <div class="captcs-line"><span class="captcs-key">Vector clocks</span><span class="captcs-val">Dynamo, Riak</span></div>
    <div class="captcs-line"><span class="captcs-key">LWW timestamp</span><span class="captcs-val">Cassandra</span></div>
    <div class="captcs-line"><span class="captcs-key">CRDTs</span><span class="captcs-val">Riak, Yjs</span></div>
    <div class="captcs-line"><span class="captcs-key">Read repair</span><span class="captcs-val">Cassandra</span></div>
    <div class="captcs-line"><span class="captcs-key">Hinted handoff</span><span class="captcs-val">Dynamo</span></div>
    <div class="captcs-line"><span class="captcs-key">Anti-entropy (Merkle)</span><span class="captcs-val">DynamoDB</span></div>
    <div class="captcs-line"><span class="captcs-key">Gossip</span><span class="captcs-val">Cassandra</span></div>
  </div>
  <div class="captcs-section">
    <div class="captcs-h">Mecanismos CP</div>
    <div class="captcs-line"><span class="captcs-key">Paxos</span><span class="captcs-val">Spanner, Chubby</span></div>
    <div class="captcs-line"><span class="captcs-key">Raft</span><span class="captcs-val">etcd, CockroachDB</span></div>
    <div class="captcs-line"><span class="captcs-key">2PC</span><span class="captcs-val">XA, MySQL Cluster</span></div>
    <div class="captcs-line"><span class="captcs-key">Saga</span><span class="captcs-val">microservices</span></div>
    <div class="captcs-line"><span class="captcs-key">TrueTime</span><span class="captcs-val">Spanner</span></div>
  </div>
  <div class="captcs-section">
    <div class="captcs-h">Quando usar AP</div>
    <div class="captcs-line"><span class="captcs-good">✓</span><span>Carrinho de compras</span></div>
    <div class="captcs-line"><span class="captcs-good">✓</span><span>Feed social</span></div>
    <div class="captcs-line"><span class="captcs-good">✓</span><span>Counters (likes, views)</span></div>
    <div class="captcs-line"><span class="captcs-good">✓</span><span>Telemetria, logs</span></div>
    <div class="captcs-line"><span class="captcs-good">✓</span><span>Cache distribuído</span></div>
    <div class="captcs-line"><span class="captcs-bad">✗</span><span>Saldo bancário</span></div>
    <div class="captcs-line"><span class="captcs-bad">✗</span><span>Estoque crítico</span></div>
    <div class="captcs-line"><span class="captcs-bad">✗</span><span>Payments</span></div>
  </div>
  <div class="captcs-section">
    <div class="captcs-h">Pegadinhas</div>
    <div class="captcs-line"><span class="captcs-warn">⚠</span><span>CAP "C" ≠ ACID "C"</span></div>
    <div class="captcs-line"><span class="captcs-warn">⚠</span><span>Linearizability ≠ Serializability</span></div>
    <div class="captcs-line"><span class="captcs-warn">⚠</span><span>"CA" = mito, é PA ou PC</span></div>
    <div class="captcs-line"><span class="captcs-warn">⚠</span><span>Cassandra é tunable</span></div>
    <div class="captcs-line"><span class="captcs-warn">⚠</span><span>LWW perde concurrent updates</span></div>
    <div class="captcs-line"><span class="captcs-warn">⚠</span><span>2PC é blocking</span></div>
  </div>
</div>
</div>`,
  },
  mindmap: {
    title: 'CAP — mapa do ecossistema de sistemas distribuídos',
    html: `<style>
.captmm{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.captmm-center{display:flex;justify-content:center;margin-bottom:16px}
.captmm-core{background:#A855F7;color:#fff;padding:10px 22px;border-radius:8px;font-weight:700;letter-spacing:.05em}
.captmm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.captmm-cat{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:12px;border-top:3px solid var(--cat-color)}
.captmm-cat-h{font-size:11px;font-weight:700;margin-bottom:8px;color:var(--cat-color);letter-spacing:.05em;text-transform:uppercase}
.captmm-item{font-size:10px;padding:3px 0;color:#cbd5e1}
.captmm-item strong{color:#e2e8f0}
.captmm-item small{color:#64748b;display:block;font-size:9px;font-style:italic}
</style>
<div class="captmm">
<div class="captmm-center">
  <div class="captmm-core">CAP & Sistemas Distribuídos</div>
</div>
<div class="captmm-grid">
  <div class="captmm-cat" style="--cat-color:#A855F7">
    <div class="captmm-cat-h">CAP — fundamentos</div>
    <div class="captmm-item"><strong>Consistency</strong><small>linearizability — última escrita</small></div>
    <div class="captmm-item"><strong>Availability</strong><small>todo node responde</small></div>
    <div class="captmm-item"><strong>Partition tolerance</strong><small>inevitável em rede real</small></div>
    <div class="captmm-item"><strong>CA = mito</strong><small>só single-node</small></div>
    <div class="captmm-item"><strong>Brewer (2000)</strong><small>conjectura, depois provada</small></div>
  </div>
  <div class="captmm-cat" style="--cat-color:#fbbf24">
    <div class="captmm-cat-h">PACELC (extensão)</div>
    <div class="captmm-item"><strong>P + A/C</strong><small>em partição</small></div>
    <div class="captmm-item"><strong>Else + L/C</strong><small>sem partição</small></div>
    <div class="captmm-item"><strong>PC/EC</strong><small>Spanner, Cockroach</small></div>
    <div class="captmm-item"><strong>PA/EL</strong><small>DynamoDB, Cassandra</small></div>
    <div class="captmm-item"><strong>PA/EC</strong><small>MongoDB</small></div>
  </div>
  <div class="captmm-cat" style="--cat-color:#38bdf8">
    <div class="captmm-cat-h">Modelos de consistência</div>
    <div class="captmm-item"><strong>Linearizability</strong><small>real-time order, registers</small></div>
    <div class="captmm-item"><strong>Sequential</strong><small>ordem total consistente</small></div>
    <div class="captmm-item"><strong>Causal</strong><small>preserva happens-before</small></div>
    <div class="captmm-item"><strong>Read-your-writes</strong><small>session-level</small></div>
    <div class="captmm-item"><strong>Monotonic reads</strong><small>nunca volta no tempo</small></div>
    <div class="captmm-item"><strong>Eventual</strong><small>converge eventualmente</small></div>
  </div>
  <div class="captmm-cat" style="--cat-color:#4ade80">
    <div class="captmm-cat-h">Sistemas AP</div>
    <div class="captmm-item"><strong>Cassandra</strong><small>tunable, gossip</small></div>
    <div class="captmm-item"><strong>DynamoDB</strong><small>multi-region</small></div>
    <div class="captmm-item"><strong>CouchDB</strong><small>master-master</small></div>
    <div class="captmm-item"><strong>Riak</strong><small>vector clocks, CRDTs</small></div>
    <div class="captmm-item"><strong>Redis (async)</strong><small>master-replica</small></div>
  </div>
  <div class="captmm-cat" style="--cat-color:#ec4899">
    <div class="captmm-cat-h">Sistemas CP</div>
    <div class="captmm-item"><strong>etcd</strong><small>Raft, K8s storage</small></div>
    <div class="captmm-item"><strong>Zookeeper</strong><small>ZAB protocol</small></div>
    <div class="captmm-item"><strong>HBase</strong><small>HDFS-backed</small></div>
    <div class="captmm-item"><strong>MongoDB (majority)</strong><small>w=majority, j=true</small></div>
    <div class="captmm-item"><strong>Spanner</strong><small>TrueTime, Paxos</small></div>
    <div class="captmm-item"><strong>CockroachDB</strong><small>open source Spanner</small></div>
  </div>
  <div class="captmm-cat" style="--cat-color:#f87171">
    <div class="captmm-cat-h">Mecanismos AP</div>
    <div class="captmm-item"><strong>Vector clocks</strong><small>detect concurrent</small></div>
    <div class="captmm-item"><strong>LWW timestamp</strong><small>simples mas perde dados</small></div>
    <div class="captmm-item"><strong>CRDTs</strong><small>convergence garantida</small></div>
    <div class="captmm-item"><strong>Read repair</strong><small>corrige no read</small></div>
    <div class="captmm-item"><strong>Hinted handoff</strong><small>guarda offline</small></div>
    <div class="captmm-item"><strong>Anti-entropy</strong><small>Merkle tree sync</small></div>
    <div class="captmm-item"><strong>Gossip</strong><small>O(log N) propagação</small></div>
  </div>
  <div class="captmm-cat" style="--cat-color:#a78bfa">
    <div class="captmm-cat-h">Mecanismos CP</div>
    <div class="captmm-item"><strong>Paxos</strong><small>Lamport, complex</small></div>
    <div class="captmm-item"><strong>Raft</strong><small>understandable Paxos</small></div>
    <div class="captmm-item"><strong>2PC</strong><small>blocking on coordinator fail</small></div>
    <div class="captmm-item"><strong>3PC</strong><small>non-blocking, mais lento</small></div>
    <div class="captmm-item"><strong>Quorum (R+W&gt;N)</strong><small>strong via overlap</small></div>
    <div class="captmm-item"><strong>TrueTime</strong><small>Google atomic clocks</small></div>
  </div>
  <div class="captmm-cat" style="--cat-color:#10b981">
    <div class="captmm-cat-h">Padrões transação</div>
    <div class="captmm-item"><strong>ACID</strong><small>single node forte</small></div>
    <div class="captmm-item"><strong>BASE</strong><small>Basically Available, Soft, Eventual</small></div>
    <div class="captmm-item"><strong>Saga</strong><small>compensating transactions</small></div>
    <div class="captmm-item"><strong>Outbox pattern</strong><small>atomicidade event + DB</small></div>
    <div class="captmm-item"><strong>Idempotency keys</strong><small>retry-safe</small></div>
  </div>
  <div class="captmm-cat" style="--cat-color:#f59e0b">
    <div class="captmm-cat-h">Pegadinhas e nuances</div>
    <div class="captmm-item"><strong>CAP "C" ≠ ACID "C"</strong><small>nomes iguais, conceitos distintos</small></div>
    <div class="captmm-item"><strong>Linearizability ≠ Serializability</strong><small>únicas vs transações</small></div>
    <div class="captmm-item"><strong>CAP é tunable</strong><small>Cassandra QUORUM vira CP</small></div>
    <div class="captmm-item"><strong>Network partition</strong><small>= delay grande, não corte</small></div>
    <div class="captmm-item"><strong>"Strong eventual"</strong><small>CRDTs — converge sem coordenar</small></div>
  </div>
</div>
</div>`,
  },
  exercises: [
    {
      level: 'iniciante',
      title: 'Implementar G-Counter CRDT em TypeScript',
      description: 'Crie um G-Counter (Grow-only Counter) que possa ser incrementado em múltiplos nodes independentemente e mergeado sem conflito. Estado: Map<nodeId, count>. Increment: incrementa só o próprio nodeId. Value: soma de todos os values. Merge: max componente-a-componente. Demonstre: 3 nodes incrementam offline, depois mergeiam, valor final = soma de todos os incrementos sem perda.',
      concepts: ['CRDT', 'eventual consistency', 'merge', 'commutativity', 'TypeScript'],
      hint: 'Tip: increment(nodeId) → state[nodeId]++. merge(other) → for each k: state[k] = max(state[k] || 0, other[k] || 0). value() → sum(values).',
    },
    {
      level: 'intermediario',
      title: 'Demonstração de stale read em sistema AP',
      description: 'Suba Cassandra com 3 nodes (Docker Compose). Crie keyspace com replication_factor=3. Configure CL=ONE em scripts. Escreva valor X=5 no node 1. Imediatamente leia do node 3 ANTES da propagação async — observe leitura retornar valor antigo (null ou stale). Repita com CL=QUORUM em ambos os lados — observe consistência forte.',
      concepts: ['Cassandra', 'consistency levels', 'eventual consistency', 'quorum', 'replication'],
      hint: 'Use docker exec para conectar ao node específico. cqlsh -h cassandra-node-1 vs cqlsh -h cassandra-node-3. CL define via CONSISTENCY ONE no cqlsh antes do query.',
    },
    {
      level: 'intermediario',
      title: 'Calcular quorum mínimo para diferentes garantias',
      description: 'Implemente função quorumCalc(N, target) que retorna {R, W} mínimos para cada target: "fastest read", "fastest write", "strong consistency balanced", "max fault tolerance with strong". Para N=5: fastest read = R=1, W=5; fastest write = R=5, W=1; balanced = R=W=3; max fault tolerance = R=W=3 (sobrevive a 2 nodes down). Adicione função canTolerateFailures(N, R, W) que retorna max nodes que podem falhar mantendo capacidade de operar.',
      concepts: ['quorum', 'R+W>N', 'fault tolerance', 'strong consistency', 'algoritmos'],
      hint: 'Para strong consistency: R + W > N. Falha tolerada em writes: N - W. Em reads: N - R. Balance ideal R=W=⌈N/2⌉+1 = majority quorum.',
    },
    {
      level: 'senior',
      title: 'Detectar conflito com vector clock',
      description: 'Implemente VectorClock como Map<nodeId, counter>. Operações: increment(nodeId), compare(a, b) retornando "before" | "after" | "concurrent" | "equal". Demonstre cenário: Node A incrementa local, sync com B, B modifica, paralelamente A modifica antes de sync — vector clocks devem detectar concurrent. Implemente merge que mantém ambas versões em conflito ou retorna ambas para o cliente resolver (Riak-style).',
      concepts: ['vector clocks', 'concurrent detection', 'happens-before', 'conflict resolution', 'distributed systems'],
      hint: 'compare: A before B se all A[k] ≤ B[k] AND exists A[k] < B[k]. concurrent se nem A before B nem B before A. merge para concurrent: max componente-a-componente, mas marca como conflito.',
    },
    {
      level: 'senior',
      title: 'Implementar Saga pattern com compensações',
      description: 'Modele uma reserva de viagem: book hotel → book flight → book car → process payment. Cada falha aciona compensações em ordem inversa. Implemente em TypeScript com state machine: cada step é uma função (do, undo). Saga executa do em sequência; se algum falha, executa undo dos previously-completed em ordem inversa. Adicione idempotency: cada step recebe transactionId; chamadas repetidas com mesmo ID retornam resultado prévio sem re-executar.',
      concepts: ['Saga pattern', 'compensating transactions', 'distributed transactions', 'state machine', 'idempotency'],
      hint: 'Estrutura: type Step<T> = { name: string, do: (ctx: T) => Promise<T>, undo: (ctx: T) => Promise<void> }. SagaExecutor mantém stack de steps completed para undo em caso de falha.',
    },
  ],
  codeExamples: [
    {
      title: 'G-Counter CRDT — convergência sem coordenação',
      language: 'typescript',
      code: `// G-Counter (Grow-only Counter) CRDT
// Convergência garantida sem coordenacao entre nodes
// Operações: increment, value, merge
// Propriedades: comutativo, associativo, idempotente

type NodeId = string

class GCounter {
  private state: Map<NodeId, number> = new Map()

  constructor(public readonly nodeId: NodeId) {}

  // Cada node só incrementa seu próprio counter
  increment(amount: number = 1): void {
    if (amount < 0) throw new Error('G-Counter only grows')
    const current = this.state.get(this.nodeId) ?? 0
    this.state.set(this.nodeId, current + amount)
  }

  // Valor total = soma de todos os counters
  value(): number {
    let sum = 0
    for (const count of this.state.values()) sum += count
    return sum
  }

  // Merge: max componente-a-componente
  // Comutativo: a.merge(b) === b.merge(a)
  // Associativo: (a.merge(b)).merge(c) === a.merge(b.merge(c))
  // Idempotente: a.merge(a) === a
  merge(other: GCounter): void {
    for (const [nodeId, count] of other.state) {
      const current = this.state.get(nodeId) ?? 0
      this.state.set(nodeId, Math.max(current, count))
    }
  }

  // Para serialização entre nodes
  serialize(): Record<NodeId, number> {
    return Object.fromEntries(this.state)
  }

  static deserialize(nodeId: NodeId, data: Record<NodeId, number>): GCounter {
    const c = new GCounter(nodeId)
    c.state = new Map(Object.entries(data))
    return c
  }
}

// ── Demonstração: 3 nodes incrementam offline, mergeiam, sem perda ──

const nodeA = new GCounter('A')
const nodeB = new GCounter('B')
const nodeC = new GCounter('C')

// Cada node opera independentemente, sem comunicação
nodeA.increment(5)   // A=5
nodeA.increment(3)   // A=8
nodeB.increment(7)   // B=7
nodeC.increment(2)   // C=2

console.log('Antes do merge:')
console.log('  A vê:', nodeA.value())  // 8
console.log('  B vê:', nodeB.value())  // 7
console.log('  C vê:', nodeC.value())  // 2

// Sync: cada node recebe estado dos outros (anti-entropy)
nodeA.merge(nodeB)
nodeA.merge(nodeC)

console.log('Após A receber B e C:', nodeA.value())  // 17 = 8+7+2

// Merge é comutativo + associativo + idempotente
nodeA.merge(nodeA)              // idempotente
nodeA.merge(nodeB).merge(nodeC) // associativo

// Mesmo se incrementarem em paralelo durante o sync...
nodeB.increment(10)  // B=17 (7+10)
nodeA.merge(nodeB)
console.log('Final:', nodeA.value())  // 27 — sem perda mesmo com escritas concorrentes

// ⚠ Limitação do G-Counter: só cresce. Para decrement, use PN-Counter
// (dois G-Counters: P para increments, N para decrements; value = P - N)`,
    },
    {
      title: 'Quorum calculator — strong vs eventual consistency',
      language: 'typescript',
      code: `type ConsistencyTarget =
  | 'fastest-read'         // R=1, W=N (strong, slow write)
  | 'fastest-write'        // R=N, W=1 (strong, slow read)
  | 'balanced-strong'      // R=W=⌈N/2⌉+1 (majority quorum)
  | 'eventual'             // R=1, W=1 (no overlap, fast both)
  | 'max-fault-tolerance'  // R=W=⌈N/2⌉+1 = balanced

interface QuorumConfig {
  R: number       // read quorum
  W: number       // write quorum
  N: number       // total replicas
  strong: boolean // R + W > N?
  faultTolerance: { readsBefore: number; writesBefore: number }
  description: string
}

function quorumCalc(N: number, target: ConsistencyTarget): QuorumConfig {
  if (N < 1) throw new Error('N must be >= 1')

  let R: number, W: number, description: string

  switch (target) {
    case 'fastest-read':
      R = 1
      W = N
      description = 'Strong consistency. Reads sub-ms (1 réplica). Writes esperam todas — 0 falhas toleradas em write.'
      break
    case 'fastest-write':
      R = N
      W = 1
      description = 'Strong consistency. Writes sub-ms (1 réplica). Reads esperam todas — 0 falhas toleradas em read.'
      break
    case 'balanced-strong':
    case 'max-fault-tolerance':
      R = Math.floor(N / 2) + 1   // majority
      W = Math.floor(N / 2) + 1
      description = \`Majority quorum (R=W=\${R}). Strong consistency. Sobrevive a \${N - W} nodes down.\`
      break
    case 'eventual':
      R = 1
      W = 1
      description = 'Eventual consistency (R+W ≤ N). Reads/writes sub-ms. Pode retornar stale data. Conflitos resolvidos via LWW/vector clocks.'
      break
  }

  return {
    R, W, N,
    strong: R + W > N,
    faultTolerance: {
      readsBefore: N - R,    // até quantos nodes podem falhar antes do read falhar
      writesBefore: N - W,   // mesmo para write
    },
    description,
  }
}

// ── Demonstrar diferentes targets para N=5 ──

const N = 5
const targets: ConsistencyTarget[] = [
  'fastest-read',
  'fastest-write',
  'balanced-strong',
  'eventual',
]

console.log(\`Quorum configs para N=\${N} replicas:\\n\`)
for (const t of targets) {
  const c = quorumCalc(N, t)
  console.log(\`[\${t}]\`)
  console.log(\`  R=\${c.R}, W=\${c.W}, R+W=\${c.R + c.W} (\${c.strong ? 'strong ✓' : 'eventual ✗'})\`)
  console.log(\`  Tolera \${c.faultTolerance.writesBefore} writes / \${c.faultTolerance.readsBefore} reads\`)
  console.log(\`  \${c.description}\\n\`)
}

// Output:
// [fastest-read]
//   R=1, W=5, R+W=6 (strong ✓)
//   Tolera 0 writes / 4 reads
//   Strong consistency. Reads sub-ms...
//
// [balanced-strong]
//   R=3, W=3, R+W=6 (strong ✓)
//   Tolera 2 writes / 2 reads
//   Majority quorum (R=W=3). Strong consistency. Sobrevive a 2 nodes down.
//
// [eventual]
//   R=1, W=1, R+W=2 (eventual ✗)
//   Tolera 4 writes / 4 reads
//   Eventual consistency. Reads/writes sub-ms...

// ── Cassandra equivalents ──
// CL=ONE         ≈ R=1 ou W=1
// CL=QUORUM      ≈ R=W=⌈N/2⌉+1 (majority)
// CL=ALL         ≈ R=N ou W=N
// CL=LOCAL_QUORUM = QUORUM dentro do mesmo DC (latência baixa)`,
    },
    {
      title: 'Eventual consistency — demonstração de stale read',
      language: 'typescript',
      code: `// Simulação de sistema AP com replicação assíncrona
// Demonstra como stale reads acontecem e como evitá-los

type Value = { value: any; version: number; timestamp: number }

class AsyncReplica {
  private store = new Map<string, Value>()

  constructor(public readonly id: string, private syncDelayMs = 100) {}

  // Write local — não espera replicação
  write(key: string, value: any): void {
    const existing = this.store.get(key)
    this.store.set(key, {
      value,
      version: (existing?.version ?? 0) + 1,
      timestamp: Date.now(),
    })
  }

  // Read local — pode retornar stale
  read(key: string): Value | undefined {
    return this.store.get(key)
  }

  // Replicação assíncrona após delay
  async replicateTo(other: AsyncReplica, key: string): Promise<void> {
    await new Promise(r => setTimeout(r, this.syncDelayMs))
    const v = this.store.get(key)
    if (!v) return

    const remote = other.store.get(key)
    // Last-Write-Wins via timestamp (Cassandra-style)
    if (!remote || v.timestamp > remote.timestamp) {
      other.store.set(key, v)
    }
  }
}

// ── Cenário 1: Stale read sem coordenação ──

async function demoStaleRead() {
  const A = new AsyncReplica('A', 200)  // 200ms de delay
  const B = new AsyncReplica('B', 200)
  const C = new AsyncReplica('C', 200)

  // Cliente escreve no A
  A.write('balance', 1000)
  console.log('Cliente escreveu balance=1000 no A')
  console.log('A lê:', A.read('balance')?.value)  // 1000

  // Cliente lê IMEDIATAMENTE de B antes de propagar
  console.log('B lê:', B.read('balance')?.value)  // undefined (stale!)

  // Replicação acontece em background
  A.replicateTo(B, 'balance')
  A.replicateTo(C, 'balance')

  await new Promise(r => setTimeout(r, 250))

  console.log('Após sync:')
  console.log('  B lê:', B.read('balance')?.value)  // 1000
  console.log('  C lê:', C.read('balance')?.value)  // 1000
}

// ── Cenário 2: Resolução via quorum (R+W > N) ──

async function quorumRead(replicas: AsyncReplica[], key: string, R: number): Promise<Value | undefined> {
  // Lê de R réplicas em paralelo
  const responses = await Promise.all(replicas.slice(0, R).map(r => r.read(key)))
  // Retorna a versão mais recente (vencedora por timestamp)
  return responses.reduce((latest, current) => {
    if (!current) return latest
    if (!latest) return current
    return current.timestamp > latest.timestamp ? current : latest
  }, undefined as Value | undefined)
}

async function demoQuorumRead() {
  const N = 3
  const replicas = [
    new AsyncReplica('A', 0),
    new AsyncReplica('B', 0),
    new AsyncReplica('C', 0),
  ]

  // Write em quorum (W=2)
  replicas[0].write('balance', 5000)
  replicas[1].write('balance', 5000)
  // C ainda não tem o write (W=2 já alcançado)

  // Read com R=2 — sobreposição de quorum garante ler 5000
  // mesmo que C seja consultado, A ou B já tem o valor
  const result = await quorumRead([replicas[1], replicas[2]], 'balance', 2)
  console.log('Quorum read (R=2, W=2, N=3): R+W=4 > 3 → strong consistency')
  console.log('Valor lido:', result?.value)  // 5000 ✓
}

demoStaleRead().then(() => demoQuorumRead())

// Lições:
// 1. Replicação async = stale reads inevitáveis se ler do node "errado"
// 2. Sticky session (cliente sempre no mesmo node) ajuda mas não escala
// 3. Quorum R+W > N garante strong consistency mesmo com replicas async
// 4. Trade-off: latência (espera R nodes) vs consistency forte`,
    },
  ],
  gotchas: [
    'Achar que pode ser CA (consistente e disponível sem P) — partição é inevitável em rede real, não dá para ignorar.',
    'Generalizar "Cassandra é AP" sem entender que é tunable — você pode rodar com QUORUM e ter consistency forte por query.',
    'Confundir consistency do CAP com consistency do ACID — são conceitos distintos: CAP "C" = linearizability cross-replicas; ACID "C" = invariantes do schema.',
    'Esquecer PACELC — em operação normal (sem partição), latência ainda é trade-off explícito vs consistency.',
    'Usar AP em sistema financeiro — saldo negativo, double-spending, perda silenciosa de updates concorrentes.',
    'Esperar que CRDTs resolvem qualquer conflito — funcionam para estruturas específicas (counter, set, register, sequence). Tipos arbitrários não têm CRDT trivial.',
    'Confundir linearizability com serializability — uma é sobre operações únicas (registers) com ordem real-time; outra é sobre transações multi-op com ordem serial. PostgreSQL serializable não é linearizable em replicas.',
    'Last-Write-Wins (LWW) com timestamp de cliente — clocks dessincronizados causam dados perdidos silenciosamente. Use clock fence ou hybrid logical clock.',
    '2PC para transações que cruzam múltiplos serviços — bloqueio em coordinator failure deixa locks por horas. Use Saga.',
    'Sloppy quorum em Dynamo — strong consistency NÃO é garantida em sloppy mode mesmo com R+W > N (escreve em "non-preference" nodes durante falha).',
    'Read-your-writes não é eventual consistency — é session consistency. Sticky sessions ajudam mas não funcionam com mobile/multiple-tabs.',
    'Spanner usa "strict serializability" mas custo é TrueTime (atomic clocks no datacenter) — replicar essa garantia em datacenter normal é caro/impossível.',
  ],
  interview: [
    {
      level: 'pleno',
      q: 'Explique CAP em uma frase e dê exemplos reais de CP e AP.',
      a: '<p>CAP: em sistema distribuído com replicação, durante uma <strong>partição de rede (P)</strong>, você escolhe entre <strong>Consistency</strong> (toda leitura vê última escrita confirmada) e <strong>Availability</strong> (todo node não-falho responde a toda request). Não existe sistema CA na prática — partições acontecem.</p><p><strong>CP (escolhe consistency em partição):</strong> PostgreSQL com replica sync, etcd, ZooKeeper, MongoDB com w=majority, Spanner. Em partição, o lado minoritário fica indisponível.</p><p><strong>AP (escolhe availability em partição):</strong> Cassandra (default), DynamoDB (default), CouchDB, Riak. Em partição, ambos lados continuam — eventual consistency.</p>',
      tip: 'Sempre cite exemplos REAIS por nome. "Sistema CP" é vago; "etcd e ZooKeeper" mostra que você operou.',
    },
    {
      level: 'pleno',
      q: 'Por que P (partition tolerance) não é opcional?',
      a: '<p>Em uma rede real, mensagens podem ser perdidas, atrasadas ou reordenadas — é uma característica de TCP/IP, não uma falha pontual. <strong>Partição de rede acontece</strong> por:</p><ul><li>Cabo de rede cortado</li><li>Switch/router falhando</li><li>Latência alta degradando para timeout (a aplicação trata como "morto")</li><li>GC pause de 30s parece morte do node</li><li>Cross-region link instabilidade</li></ul><p>Sistema "CA" só faria sentido em single-node ou em ambiente de rede assumido perfeito — fantasia em produção. CAP real é <strong>PA ou PC</strong>: você escolhe, durante a partição inevitável, entre availability e consistency.</p>',
      tip: 'Mencionar GC pause como causa de "partição percebida" é detalhe sênior — mostra que você leu Jepsen.',
    },
    {
      level: 'pleno',
      q: 'Postgres com replica sync: CP ou AP?',
      a: '<p><strong>CP</strong>. Em partição entre primary e replica sync, primary trava (espera ack que não vem). Sistema fica indisponível para writes até a partição sarar — garante que dado é consistente entre primary e replica.</p><p>Async replica é diferente: replica fica stale, mas primary continua aceitando writes. Mais próximo de AP — leitura na replica pode retornar dados antigos.</p><p><strong>Detalhe sênior:</strong> Postgres tem múltiplos níveis: <code>synchronous_commit = on</code> (espera local commit), <code>remote_write</code> (espera replica receber, não aplicar), <code>remote_apply</code> (espera replica aplicar — mais forte). Cada nível é trade-off entre latência e consistency.</p>',
      tip: 'Os 3 níveis de synchronous_commit no Postgres são pegadinha clássica — mencionar mostra hands-on real.',
    },
    {
      level: 'pleno',
      q: 'Cassandra: CP ou AP? Como tunar?',
      a: '<p>Padrão <strong>AP</strong> com tunable consistency. CL=ONE é altamente disponível (uma réplica responde) e eventualmente consistente.</p><p>Mas você pode rodar <strong>CL=QUORUM</strong> em escrita E leitura: garante (W+R) &gt; N replicas, então toda leitura vê última escrita. Vira mais CP (continua disponível na maioria dos casos, mas em partição com majoria do lado errado, falha).</p><p><strong>LOCAL_QUORUM:</strong> quorum dentro do mesmo datacenter — latência baixa. Bom para single-region apps.</p><p><strong>EACH_QUORUM:</strong> quorum em CADA datacenter — strong consistency multi-DC, latência alta cross-region.</p><p>Mesmo banco pode ser CP ou AP por query — depende do CL escolhido na operação.</p>',
      tip: 'LOCAL_QUORUM e EACH_QUORUM são detalhes de produção — citar mostra que você operou multi-DC.',
    },
    {
      level: 'pleno',
      q: 'O que é PACELC e por que estende o CAP?',
      a: '<p>CAP só fala sobre comportamento durante <strong>partição</strong>. Mas sistemas distribuídos têm trade-off mesmo SEM partição.</p><p>PACELC (Daniel Abadi, 2010): <strong>P</strong>artition + <strong>A</strong>/<strong>C</strong>, <strong>E</strong>lse <strong>L</strong>atency/<strong>C</strong>onsistency.</p><ul><li>Em partição, escolhe A ou C (CAP clássico).</li><li>Sem partição, ainda escolhe entre L (latência baixa, possível stale) e C (consistency forte, mais lento).</li></ul><p><strong>Classificações:</strong></p><ul><li><strong>Spanner = PC/EC:</strong> sempre prefere consistency, custa latência (TrueTime + Paxos).</li><li><strong>DynamoDB = PA/EL:</strong> em partição prefere availability; em normal prefere latência baixa (lê do nó local).</li><li><strong>MongoDB = PA/EC (default majority):</strong> availability em partição; consistency em normal.</li></ul><p>PACELC é resposta sênior: CAP simples ignora trade-off de operação normal.</p>',
      tip: 'Citar Abadi por nome e o ano (2010) demonstra que você leu a literatura, não só "sabe CAP".',
    },
    {
      level: 'senior',
      q: 'Explique linearizability vs serializability.',
      a: '<p>Conceitos diferentes que entrevistadores misturam.</p><p><strong>Linearizability:</strong> garantia sobre <strong>operações únicas</strong> em objetos (registers, key-value). Toda operação parece atômica em algum ponto entre invocação e resposta. Ordem GLOBAL respeita real-time: se A.completou antes de B.começou, A é ordenada antes de B em qualquer leitor. É o "single-machine" model — leitor não distingue de single-node.</p><p><strong>Serializability:</strong> garantia sobre <strong>transações</strong> (múltiplas operações). Resultado equivale a alguma ordem serial das transações. NÃO especifica qual ordem ou se respeita real-time.</p><p><strong>Strict serializability:</strong> serializability + linearizability — Spanner faz isso via TrueTime.</p><p><strong>PostgreSQL SERIALIZABLE isolation:</strong> serializable mas não linearizable em replicas async — primary é serializable, replicas podem ser stale.</p><p>Em entrevista de system design, distinguir esses dois mostra profundidade real.</p>',
      tip: 'A pegadinha: alguns dizem "MySQL com REPEATABLE READ é serializable" — não é, é snapshot isolation. Saber a hierarquia é raro.',
    },
    {
      level: 'senior',
      q: 'Explique quorum (R+W > N) e por que garante strong consistency.',
      a: '<p>Em sistema com N réplicas, escrita confirma quando W réplicas responderam OK; leitura consulta R réplicas e retorna versão mais recente.</p><p><strong>Por que R+W > N → strong consistency:</strong> qualquer conjunto de W writes e qualquer conjunto de R reads se SOBREPÕEM em pelo menos um node. Esse node tem a última escrita. Read sempre encontra versão mais recente entre as R respostas.</p><p><strong>Exemplos com N=3:</strong></p><ul><li>R=1, W=3 (todos): leitura mínima, escrita lenta. Strong.</li><li>R=2, W=2 (QUORUM): balanceado. R+W=4 &gt; 3. Strong. Tolera 1 node down.</li><li>R=3, W=1: escrita rápida, leitura lenta. Strong.</li><li>R=1, W=1 (ONE): R+W=2 ≤ 3. Eventual consistency, sem garantia. Trade-off por latência mínima.</li></ul><p><strong>Pegadinha:</strong> sloppy quorum em Dynamo — em partição, escreve em "non-preference" nodes para manter A. NÃO garante strong consistency mesmo com R+W &gt; N técnica.</p>',
      tip: 'Mencionar sloppy quorum como exceção é o tipo de detalhe que diferencia. Vem de ler o paper original do Dynamo.',
    },
    {
      level: 'senior',
      q: 'O que são CRDTs e quando usaria?',
      a: '<p>CRDTs (Conflict-free Replicated Data Types) são estruturas de dados projetadas para convergir SEM coordenação, mesmo com escritas concorrentes. Propriedades dos operações de merge: comutativo, associativo, idempotente.</p><p><strong>Tipos:</strong></p><ul><li><strong>G-Counter:</strong> counter monotônico. Cada node tem contador próprio; merge = max componente-a-componente.</li><li><strong>PN-Counter:</strong> increment + decrement (dois G-Counters).</li><li><strong>G-Set:</strong> set add-only. Merge = union.</li><li><strong>OR-Set:</strong> add wins concurrent remove. Cada elemento tem unique ID; remove tombstone com ID específico.</li><li><strong>LWW-Register:</strong> register com last-write-wins via timestamp.</li><li><strong>Sequence CRDTs (Yjs, Automerge, RGA):</strong> para edição colaborativa de texto.</li></ul><p><strong>Quando usar:</strong> sistemas multi-master que precisam funcionar offline (Riak), edição colaborativa real-time (Google Docs alternative), counters distribuídos (likes, views) sem coordenação.</p><p><strong>Limitação:</strong> nem toda estrutura tem CRDT trivial. Strings arbitrárias, banking transactions — geralmente exigem coordenação.</p>',
      tip: 'Citar Yjs e Automerge (libs JS modernas) ancora hands-on. Citar Riak data types (counter, set, map, hll) mostra que você operou um sistema CRDT-native.',
    },
    {
      level: 'senior',
      q: 'Quando usaria sistema AP em vez de CP?',
      a: '<p>Quando <strong>availability é mais valiosa que consistency exata</strong>. Casos típicos:</p><ul><li><strong>Carrinho de compras:</strong> melhor mostrar estado ligeiramente desatualizado do que o site cair. Conflitos resolvidos no checkout (merge).</li><li><strong>Feed social:</strong> atraso de segundos é aceitável; ser AP permite escala global.</li><li><strong>Counters (likes, views, telemetria):</strong> CRDTs convergem eventually, não precisam de strong consistency.</li><li><strong>Logs e métricas:</strong> append-only, eventual é suficiente.</li><li><strong>Sessões e cache:</strong> stale por segundos é OK.</li><li><strong>Recommendations e search index:</strong> dados antigos por minutos é OK; downtime impactaria muito mais.</li></ul><p><strong>NÃO use AP em:</strong></p><ul><li>Saldo bancário, payments, transações financeiras (perda silenciosa = fraude)</li><li>Estoque crítico (oversell)</li><li>Booking de assentos/recursos únicos</li><li>Locks distribuídos (use etcd/ZooKeeper)</li></ul><p><strong>Híbrido:</strong> sistemas modernos usam ambos. Catálogo (AP, eventual) + checkout (CP, strict) + payments (CP, ACID). Saga conecta os dois mundos.</p>',
      tip: 'Resposta sênior usa pattern híbrido — sistema real é mistura. "Tudo CP" ou "tudo AP" é resposta junior.',
    },
    {
      level: 'senior',
      q: 'Como implementaria pagamento em sistema distribuído?',
      a: '<p>Precisa <strong>strong consistency (CP)</strong>. Opções:</p><ul><li><strong>Spanner / CockroachDB:</strong> ACID distribuído com TrueTime/Paxos. Strict serializable. Caro mas correto.</li><li><strong>PostgreSQL single primary com replica sync:</strong> ACID local + sync replica para HA. Funciona até a escala não exigir sharding.</li><li><strong>Saga pattern:</strong> sequência de transações locais (debit_account → reserve_inventory → charge_payment); falha em qualquer step aciona compensações em ordem inversa. Eventually consistent mas com semântica correta. Padrão moderno em microserviços.</li><li><strong>Idempotency keys:</strong> em todas as operações. Cliente envia key único; servidor garante que retry não duplica. Crítico para retry safety em network failures.</li><li><strong>Outbox pattern:</strong> garantir que evento "payment_processed" seja publicado atomicamente com a mudança no DB (mesma transação grava na tabela outbox; relay assíncrono publica no Kafka).</li><li><strong>Reconciliation jobs:</strong> jobs noturnos verificam consistency entre payment provider e DB local — detectam discrepâncias para correção.</li></ul><p><strong>Anti-pattern:</strong> 2PC entre microserviços — locks distribuídos por minutos/horas, blocking em coordinator failure.</p>',
      tip: 'Mencionar idempotency keys + outbox + reconciliation é a tríade de produção. Sem eles, "Saga" é só palavra-chave.',
    },
    {
      level: 'senior',
      q: 'O que é eventual consistency e como funciona na prática?',
      a: '<p>Sistema garante que, <strong>ausência de novos updates</strong>, eventualmente todas as réplicas convergem para o mesmo valor. NÃO especifica QUANDO — pode ser ms ou minutos.</p><p><strong>Mecanismos de convergência:</strong></p><ul><li><strong>Read repair:</strong> durante read, se replicas divergem, propaga versão mais recente para as que estão atrás. Cassandra faz por default.</li><li><strong>Hinted handoff:</strong> node temporariamente offline tem writes guardados por outros (hints); quando volta, recebe os hints. Resolve falhas curtas sem perda.</li><li><strong>Anti-entropy via Merkle trees:</strong> comparação eficiente entre replicas — calcula hashes hierárquicos dos dados, descobre quais ranges divergem, sincroniza apenas eles. DynamoDB usa.</li><li><strong>Gossip:</strong> nodes periodicamente trocam estado com peers aleatórios. Propagação O(log N). Cassandra usa para metadata (cluster topology, schema).</li></ul><p><strong>Garantias mais fortes que "eventual" (mas mais fracas que linearizability):</strong></p><ul><li><strong>Read-your-writes:</strong> sessão sempre vê suas próprias escritas.</li><li><strong>Monotonic reads:</strong> leituras sucessivas nunca voltam no tempo.</li><li><strong>Causal consistency:</strong> preserva ordem de operações relacionadas (read-then-write).</li></ul><p>Esse "espectro" é onde sistemas modernos vivem — eventual puro é raro; geralmente é eventual + algumas garantias session-level.</p>',
      tip: 'O espectro de consistency models (não só "strong vs eventual") é tópico de Kleppmann — citar mostra leitura profunda.',
    },
    {
      level: 'senior',
      q: 'Como funciona Saga pattern e quando substitui 2PC?',
      a: '<p><strong>2PC limitações:</strong></p><ul><li>Blocking — se coordinator crash entre prepare e commit, participants ficam locked indefinidamente.</li><li>Lentidão — locks por toda duração (pode ser segundos a minutos em microserviços com latência cross-network).</li><li>Acoplamento — todos os serviços precisam suportar o protocolo XA.</li></ul><p><strong>Saga:</strong> sequência de transações locais; cada uma tem uma operação compensatória (undo). Se step N falha, executa undo dos steps 1..N-1 em ordem inversa.</p><p><strong>Dois estilos:</strong></p><ul><li><strong>Orchestration:</strong> orchestrator central (state machine) chama serviços e coordena. Mais visível, debugging mais fácil.</li><li><strong>Choreography:</strong> eventos via message broker (Kafka). Cada serviço reage ao evento e publica próximo. Mais loosely-coupled, mas debugging complexo.</li></ul><p><strong>Trade-offs:</strong></p><ul><li>NÃO é ACID — estados intermediários visíveis (eventual consistency).</li><li>Compensações precisam ser idempotentes e reversíveis (cancel_order vs delete_order — semântica importa).</li><li>Não pode ter "Two Phase Locking" — outras transações veem e modificam o estado intermediário.</li></ul><p><strong>Padrão e-commerce:</strong> place_order → reserve_inventory → process_payment → ship → notify. Falha em payment aciona unreserve_inventory + cancel_order.</p>',
      tip: 'Diferença orchestration vs choreography é tópico de entrevista clássica. Saber quando usar cada (orchestration para fluxos críticos, choreography para sistemas evolutivos) é diferencial.',
    },
    {
      level: 'senior',
      q: 'O que é vector clock e por que é melhor que timestamp?',
      a: '<p><strong>Problema com timestamp puro:</strong> clocks de servidores não são sincronizados perfeitamente (NTP tem skew de ms-segundos). Last-Write-Wins via timestamp pode SILENCIOSAMENTE descartar updates concorrentes.</p><p><strong>Vector clock:</strong> cada node mantém um vetor de counters [(node_id, counter), ...]. Em cada operação, incrementa seu próprio counter. Em sync com outro node, mergeia vetores via max componente-a-componente.</p><p><strong>Comparação:</strong></p><ul><li><strong>A happens-before B</strong> (A → B): todos componentes de A ≤ B, e pelo menos um &lt; B.</li><li><strong>A == B:</strong> idênticos.</li><li><strong>A concurrent B:</strong> nem A → B nem B → A. Conflito que precisa resolução.</li></ul><p><strong>Como Riak usa:</strong> em vez de fazer LWW silencioso, retorna AMBAS versões para o cliente — cliente faz merge logic específica do domínio (somar carts, escolher preferência, etc).</p><p><strong>Cassandra usa LWW por default</strong> — não é "vector clock real". Para consistency forte, use QUORUM. Para conflict-free, CRDTs.</p><p><strong>Hybrid Logical Clocks (HLC):</strong> combinação de wall clock (ordering humano) + logical counter (causality). CockroachDB usa para ordering em escala de DC.</p>',
      tip: 'HLC é tópico recente (Cockroach paper) — citar mostra que você acompanha estado da arte. Vector clocks "puros" são raros em produção moderna.',
    },
    {
      level: 'senior',
      q: 'Como projeta um sistema 24/7 com 99.99% de availability?',
      a: '<p>99.99% = 52 minutos/ano de downtime permitido. Exige design defensivo em múltiplas camadas.</p><p><strong>1. Eliminação de SPOFs:</strong> N+1 ou N+2 redundância em cada layer. Multi-AZ obrigatório, multi-region para 99.99%+.</p><p><strong>2. Escolhas CAP:</strong> serviços críticos com fail-fast (CP) — falha rápida e clara é melhor que comportamento errado lento. Serviços de feed/cache podem ser AP — sobrevivem a partições.</p><p><strong>3. Health checks profundos:</strong> não apenas TCP — testar dependencies (DB query, downstream API). Liveness vs readiness probes.</p><p><strong>4. Circuit breakers:</strong> evitar cascading failures (Hystrix, Resilience4j). Half-open state para recovery automático.</p><p><strong>5. Bulkheads:</strong> isolamento de recursos por feature/tenant. Falha em um não derruba o resto.</p><p><strong>6. Graceful degradation:</strong> features não-essenciais desligam primeiro. Loading skeleton em vez de erro.</p><p><strong>7. Async retries com backoff:</strong> exponencial + jitter. Idempotency keys para retry safety.</p><p><strong>8. Chaos engineering:</strong> injetar falhas em produção controladamente (Chaos Monkey, Gremlin). Descobrir SPOFs ANTES dos clientes.</p><p><strong>9. Observability:</strong> SLI/SLO/SLA bem definidos. Alarmes em SLO violation, não em CPU. Distributed tracing para debugging.</p><p><strong>10. Runbooks + on-call:</strong> resposta sub-15min para incidentes Sev1.</p>',
      tip: 'Resposta completa cobre arquitetura + operação. SLI/SLO/SLA + chaos engineering são diferenciais sêniores.',
    },
    {
      level: 'senior',
      q: 'Como você diferencia ACID de BASE e quando usa cada?',
      a: '<p><strong>ACID (bancos tradicionais, single-node):</strong></p><ul><li><strong>Atomicity:</strong> transação é tudo ou nada</li><li><strong>Consistency:</strong> invariantes do schema preservadas</li><li><strong>Isolation:</strong> transações concorrentes não interferem</li><li><strong>Durability:</strong> commit persiste mesmo em crash</li></ul><p><strong>BASE (sistemas distribuídos AP):</strong></p><ul><li><strong>Basically Available:</strong> sistema sempre responde (mesmo que stale)</li><li><strong>Soft state:</strong> estado pode mudar sem input externo (propagação async)</li><li><strong>Eventual consistency:</strong> converge eventualmente</li></ul><p><strong>NÃO é "ACID ruim"</strong> — trade-off consciente. ACID em distribuído é caro: consenso (Paxos/Raft), coordenação cross-DC, latência alta.</p><p><strong>Quando ACID:</strong></p><ul><li>Finanças, payments, inventário crítico</li><li>Sistemas com invariantes hard (saldo &gt;= 0, unique constraints)</li><li>Single-node ou small clusters onde latência não dói</li></ul><p><strong>Quando BASE:</strong></p><ul><li>Escala web (user content, feeds, search)</li><li>Multi-region com latência mandatória &lt; 100ms</li><li>Tolerância a stale reads</li><li>Volume de writes que ACID não suporta</li></ul><p><strong>NewSQL (CockroachDB, YugabyteDB, Spanner):</strong> tenta entregar ACID em escala distribuída. Custa latência extra mas elimina dilema. Tendência moderna para sistemas que precisam ACID + escala.</p>',
      tip: 'NewSQL como categoria é diferencial sênior. "Spanner é Postgres mas distribuído" simplifica demais — saber TrueTime + Paxos + cost differentiates.',
    },
    {
      level: 'senior',
      q: 'O que é split-brain e como resolveria?',
      a: '<p><strong>Split-brain:</strong> partição de rede divide cluster em dois "ilhas" que cada uma se considera o cluster válido. Ambos aceitam writes. Quando rede volta, há conflito de estado — qual é o "verdadeiro"?</p><p><strong>Causa típica:</strong> network partition + sistemas que NÃO usam quorum/leader election. Master-master replication ingênuo, ou clusters Redis Sentinel mal configurados.</p><p><strong>Soluções (CP):</strong></p><ul><li><strong>Quorum-based leader election:</strong> Raft, Paxos. Líder eleito por majoria. Lado minoritário não consegue eleger novo líder — fica indisponível para writes (preserva consistency). etcd, ZooKeeper, CockroachDB.</li><li><strong>Fencing token:</strong> líder eleito recebe token monotônico. Storage rejeita writes com token antigo. Previne split-brain mesmo se velho líder ressurgir.</li><li><strong>STONITH (Shoot The Other Node In The Head):</strong> em HA clusters, novo líder força reboot/power-off do antigo. Pacemaker/Corosync.</li></ul><p><strong>Soluções (AP — vive com split-brain):</strong></p><ul><li><strong>Vector clocks + cliente resolve conflito:</strong> Riak retorna ambas versões; cliente decide merge.</li><li><strong>CRDTs:</strong> projetados para mergear automaticamente sem conflito.</li><li><strong>Last-Write-Wins:</strong> simples mas perde dados concorrentes silenciosamente.</li></ul><p><strong>Detecção:</strong> monitoring de "split-brain" como métrica explícita (líderes simultâneos, divergência de quorum) é prática moderna.</p>',
      tip: 'STONITH parece tópico de DevOps mas é central em HA. Saber por nome é detalhe que diferencia.',
    },
    {
      level: 'senior',
      q: 'Como projetaria um lock distribuído e quais cuidados teria?',
      a: '<p>Locks distribuídos parecem simples mas têm armadilhas profundas. Casos genuínos: leader election, garantir que único worker processa um job, exclusão mútua em recurso externo.</p><p><strong>Implementações:</strong></p><ul><li><strong>etcd / ZooKeeper:</strong> primitivos nativos (CompareAndSwap, ephemeral nodes). Strong consistency via Raft/ZAB. Recommended.</li><li><strong>Redis com SETNX + EX:</strong> simples mas tem problemas com timeout e clock drift.</li><li><strong>Redlock (Redis multi-node):</strong> propôs por antirez, criticado por Martin Kleppmann — assumções sobre clocks são frágeis.</li><li><strong>DynamoDB conditional write:</strong> com TTL para auto-release.</li></ul><p><strong>Armadilhas:</strong></p><ul><li><strong>GC pause / processo pausado:</strong> processo adquire lock, sofre 30s de GC pause, lock expira, outro processo adquire. Quando o primeiro acorda, ainda acha que tem lock e modifica recurso. Resultado: dois processos no mesmo recurso.</li><li><strong>Solução: fencing tokens.</strong> Lock service emite token monotônico junto. Storage rejeita writes com token velho. Funciona mesmo com pausas.</li><li><strong>Clock skew:</strong> Redlock assume clocks NTP-sync — frágil.</li><li><strong>Network partition:</strong> nó com lock fica isolado mas continua "achando" que tem.</li></ul><p><strong>Recomendação prática:</strong> usar lock service confiável (etcd/ZooKeeper), não implementar do zero. Sempre fencing tokens se o recurso protegido permite. Lock distribuído é último recurso — preferir designs sem locking (idempotency, optimistic concurrency).</p>',
      tip: 'A crítica de Kleppmann ao Redlock é entrevista classic. Mencionar fencing tokens (do mesmo artigo) demonstra que leu o material profundo.',
    },
    {
      level: 'senior',
      q: 'O que é "outbox pattern" e que problema resolve?',
      a: '<p><strong>Problema:</strong> em microserviços event-driven, você precisa modificar o DB E publicar evento (Kafka). Sem coordenação, há cenários de inconsistência:</p><ul><li>Modifica DB, falha ao publicar evento → estado divergente entre serviços.</li><li>Publica evento, falha ao modificar DB → consumers reagem a algo que não aconteceu.</li><li>Modifica DB, publica evento, consumer processa, depois rollback no DB original → consumer já agiu sobre estado revertido.</li></ul><p><strong>Outbox pattern:</strong></p><ol><li>Em vez de publicar evento direto no Kafka, escreve evento numa tabela "outbox" na MESMA transação que modifica o DB. ACID local garante atomicidade: ou ambos commitam ou ambos revertem.</li><li>Um relay process (CDC, Debezium) lê tail da tabela outbox e publica no Kafka. Idempotência via offset/sequence.</li><li>Após publicar, marca evento como "published" (ou DELETE — depende da implementação).</li></ol><p><strong>Garantias:</strong> at-least-once delivery (relay pode reentregar). Consumers precisam ser idempotentes (idempotency key no evento).</p><p><strong>Implementações:</strong></p><ul><li>Debezium CDC + Kafka Connect — lê WAL do Postgres, publica eventos automaticamente.</li><li>Custom relay que faz polling periódico da tabela outbox.</li><li>Eventuate, Axon — frameworks que abstraem o pattern.</li></ul><p><strong>Antipattern alternativo:</strong> dual-write sem outbox — escrever no DB e Kafka separadamente, esperando que ambos funcionem. Falha silenciosa em qualquer falha de rede.</p>',
      tip: 'Outbox + Debezium é arquitetura moderna de microserviços event-driven. Citar Debezium nominalmente mostra exposição a tooling moderno.',
    },
    {
      level: 'senior',
      q: 'Como você analisaria um sistema distribuído real para decidir CAP?',
      a: '<p>Não é "qual letra escolho" — é uma análise por componente.</p><p><strong>1. Identifique as partes do sistema:</strong> autenticação, catálogo, carrinho, payments, inventário, search, recommendation, notification, audit log.</p><p><strong>2. Para cada parte, pergunte:</strong></p><ul><li>Quão crítica é a consistency? (strong, causal, eventual aceitável?)</li><li>Quão crítica é availability? (downtime tolerável em segundos, minutos, horas?)</li><li>Latência aceitável? (sub-100ms global, sub-1s, sub-10s)</li><li>Volume de writes? (units, milhares/s, milhões/s)</li><li>Multi-region necessário?</li></ul><p><strong>3. Mapeie escolhas:</strong></p><ul><li><strong>Payments, inventário crítico:</strong> CP/ACID. Postgres + idempotency keys + Saga para coordenação cross-service.</li><li><strong>Catálogo, search:</strong> AP. Cassandra/DynamoDB + Elasticsearch.</li><li><strong>Carrinho:</strong> AP com merge logic. CRDTs ou cliente resolve.</li><li><strong>Audit log:</strong> AP + append-only. S3 + Athena, ou Kafka.</li><li><strong>Sessions / cache:</strong> AP. Redis cluster.</li><li><strong>Leader election / locks:</strong> CP. etcd/ZooKeeper.</li></ul><p><strong>4. Conecte os mundos:</strong> Saga + outbox + idempotency + reconciliation jobs garantem consistency cross-service mesmo com mistura AP/CP.</p><p><strong>5. Documente os trade-offs:</strong> SLOs explícitos por serviço (99.9% para payments, 99.99% para auth, 99% para recommendations). Stakeholders entendem o que estão pagando em cada eixo.</p><p>Sistema "tudo CP" é caro e lento; "tudo AP" perde dados em casos errados. Híbrido bem desenhado é o que distingue arquiteto sênior.</p>',
      tip: 'Resposta sênior é arquitetural, não dogmática. Mapeamento por componente + SLO por serviço é o nível de profundidade esperado em system design final round.',
    },
    {
      level: 'senior',
      q: 'O que é "happens-before" relation e por que importa?',
      a: '<p><strong>Happens-before (Lamport, 1978):</strong> relação parcial entre eventos em sistema distribuído que captura causalidade.</p><p><strong>Definição:</strong> A → B (A happens-before B) se:</p><ol><li>A e B estão no mesmo processo, e A acontece antes de B na ordem do programa.</li><li>A é o envio de uma mensagem, e B é o recebimento dela.</li><li>Transitividade: A → C e C → B implica A → B.</li></ol><p><strong>Por que importa:</strong></p><ul><li><strong>Define causalidade:</strong> sem clock global, ainda podemos ordenar eventos relacionados causalmente.</li><li><strong>Eventos concorrentes:</strong> A e B são concurrent (A || B) se nem A → B nem B → A. Significa que não podem ter influenciado um ao outro.</li><li><strong>Implementação:</strong> Lamport timestamps (counters monotônicos por processo) ou vector clocks (mais preciso, detecta concurrency).</li></ul><p><strong>Aplicações:</strong></p><ul><li><strong>Causal consistency:</strong> garante que operações relacionadas causalmente são vistas em ordem. Read-then-write preserva ordem.</li><li><strong>Distributed snapshots:</strong> Chandy-Lamport algorithm usa happens-before para snapshot consistente sem freezing.</li><li><strong>Conflict detection:</strong> dois writes concurrent são potenciais conflitos (vector clocks detectam).</li><li><strong>Hybrid Logical Clocks:</strong> CockroachDB combina happens-before com wall clock para ordering em escala de DC.</li></ul><p><strong>Prática:</strong> entender happens-before é o que torna possível raciocinar sobre sistemas distribuídos sem confundir "concorrente" com "ao mesmo tempo".</p>',
      tip: 'Lamport (1978) é foundational. Mencionar o paper "Time, Clocks and the Ordering of Events" mostra que você fez homework de fundamentos teóricos.',
    },
  ],
  videos: [
    { title: 'Designing Data-Intensive Applications — Martin Kleppmann lecture', channel: 'University of Cambridge', url: 'https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB' },
    { title: 'CAP Theorem Explained — System Design Interview', channel: 'ByteByteGo', url: 'https://www.youtube.com/watch?v=BHqjEjzAicA' },
    { title: 'CRDTs and the Quest for Distributed Consistency', channel: 'InfoQ', url: 'https://www.youtube.com/watch?v=B5NULPSiOGw' },
    { title: 'Jepsen: testing the correctness of distributed systems', channel: 'Strange Loop', url: 'https://www.youtube.com/watch?v=tRc0O9VgzB0' },
    { title: 'How does Raft work? — distributed consensus visualized', channel: 'The Secret Developer', url: 'https://www.youtube.com/watch?v=IujMVjKvWP4' },
  ],
  resources: [
    { title: 'Brewer — CAP twelve years later', url: 'https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/', kind: 'artigo' },
    { title: 'Designing Data-Intensive Applications (Kleppmann)', url: 'https://dataintensive.net/', kind: 'livro' },
    { title: 'Aphyr — Jepsen analyses', url: 'https://jepsen.io/analyses', kind: 'artigo' },
    { title: 'MIT 6.824 — Distributed Systems', url: 'https://pdos.csail.mit.edu/6.824/', kind: 'curso' },
    { title: 'PACELC paper (Abadi 2010)', url: 'http://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf', kind: 'artigo' },
    { title: 'Lamport — Time, Clocks, and the Ordering of Events', url: 'https://lamport.azurewebsites.net/pubs/time-clocks.pdf', kind: 'artigo' },
    { title: 'Marc Shapiro — A comprehensive study of CRDTs', url: 'https://hal.inria.fr/inria-00555588/document', kind: 'artigo' },
    { title: 'Martin Kleppmann — How to do distributed locking', url: 'https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html', kind: 'artigo' },
  ],
}

export default capTheorem
