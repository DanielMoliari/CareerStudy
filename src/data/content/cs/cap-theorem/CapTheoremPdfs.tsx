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

// ── Paleta CAP Theorem ────────────────────────────────────────────────────────
const C = '#A855F7'

// ── Cards de PDF ──────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20+ perguntas mais cobradas em entrevista de sistemas distribuídos',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa nível pleno e sênior: CAP/PACELC, modelos de consistência (linearizability, serializability, causal), quorum, CRDTs, vector clocks, 2PC vs Saga, outbox pattern, split-brain, lock distribuído. Respostas com profundidade de Designing Data-Intensive Applications.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet — CAP & sistemas',
    subtitle: 'CAP, PACELC, modelos de consistência, quorum, mecanismos AP/CP',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: classificação CAP de sistemas reais (Postgres, MongoDB, Cassandra, DynamoDB, etcd, Spanner), PACELC, espectro de consistência (linear → eventual), fórmula de quorum R+W>N, mecanismos AP (vector clocks, CRDTs, gossip) vs CP (Paxos, Raft, 2PC).',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos — CAP, BASE, PACELC',
    subtitle: 'Âncoras verbais para conceitos abstratos de sistemas distribuídos',
    type: 'mnemonics',
    pages: 4,
    description: 'Truques verbais e expansões: CAP-PIE, PACELC = "pace LC", BASE = oposto de ACID, R+W>N = strong consistency, CRDTs convergem sozinhos, LinSer ≠ SerLin. Cartões de memorização para recall em entrevista.',
    icon: '03',
    goal: 'Memorização ativa',
  },
  {
    id: 'comparative',
    title: 'Comparativo — bancos distribuídos',
    subtitle: 'Cassandra, DynamoDB, MongoDB, Spanner, etcd em 7 critérios',
    type: 'comparative',
    pages: 4,
    description: 'Tabela comparativa: CAP class, PACELC, modelo de consistência, latência típica, escala, custo operacional, caso de uso ideal. 5 sistemas mainstream para system design interview. Cenários: payments, feed social, time-series, leader election.',
    icon: '04',
    goal: 'Decisão de arquitetura',
  },
]

// ── Q&As ──────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Explique CAP em uma frase e dê exemplos reais de CP e AP.',
    a: 'CAP: em sistema distribuído com replicação, durante uma <strong>partição de rede (P)</strong>, você escolhe entre <strong>Consistency</strong> (toda leitura vê última escrita confirmada) e <strong>Availability</strong> (todo node responde). Não existe "CA" na prática.<br><br><strong>CP:</strong> PostgreSQL com replica sync, etcd, ZooKeeper, MongoDB w=majority, Spanner. Em partição, lado minoritário fica indisponível.<br><br><strong>AP:</strong> Cassandra (default), DynamoDB (default), CouchDB, Riak. Em partição, ambos lados continuam — eventual consistency.',
    tip: 'Sempre cite exemplos REAIS por nome. "Sistema CP" é vago; "etcd e ZooKeeper" mostra que você operou.',
  },
  {
    level: 'Pleno',
    q: 'Por que P (partition tolerance) não é opcional?',
    a: 'Mensagens em rede real podem ser perdidas, atrasadas ou reordenadas — característica de TCP/IP. Partição acontece por: cabo cortado, switch falhando, latência alta degradando para timeout, GC pause de 30s parecendo morte do node, cross-region instabilidade.<br><br>Sistema "CA" só faria sentido em single-node ou em ambiente assumido de rede perfeita — fantasia em produção. CAP real é PA ou PC: você escolhe, durante partição inevitável, entre availability e consistency.',
    tip: 'Mencionar GC pause como causa de "partição percebida" é detalhe sênior — mostra que você leu Jepsen.',
  },
  {
    level: 'Pleno',
    q: 'Postgres com replica sync: CP ou AP?',
    a: '<strong>CP</strong>. Em partição entre primary e replica sync, primary trava esperando ack que não vem. Sistema fica indisponível para writes — garante consistência entre primary e replica.<br><br>Async replica é diferente: replica fica stale, mas primary continua. Mais próximo de AP.<br><br><strong>Detalhe sênior:</strong> Postgres tem múltiplos níveis de synchronous_commit:<br>• <code>on</code>: espera local commit<br>• <code>remote_write</code>: espera replica receber<br>• <code>remote_apply</code>: espera replica aplicar (mais forte)<br><br>Cada nível é trade-off latência vs consistência.',
    tip: 'Os 3 níveis de synchronous_commit no Postgres são pegadinha clássica — mencionar mostra hands-on real.',
  },
  {
    level: 'Pleno',
    q: 'Cassandra: CP ou AP? Como tunar?',
    a: 'Padrão <strong>AP</strong> com tunable consistency. CL=ONE é altamente disponível e eventualmente consistente.<br><br>Mas você pode rodar <strong>CL=QUORUM</strong> em escrita E leitura: garante (W+R) &gt; N replicas, então toda leitura vê última escrita. Vira mais CP.<br><br><strong>LOCAL_QUORUM:</strong> quorum dentro do mesmo datacenter — latência baixa.<br><strong>EACH_QUORUM:</strong> quorum em CADA datacenter — strong consistency multi-DC.<br><br>Mesmo banco pode ser CP ou AP por query — depende do CL escolhido.',
    tip: 'LOCAL_QUORUM e EACH_QUORUM são detalhes de produção — citar mostra que operou multi-DC.',
  },
  {
    level: 'Pleno',
    q: 'O que é PACELC e por que estende o CAP?',
    a: 'CAP só fala sobre comportamento durante <strong>partição</strong>. Mas sistemas distribuídos têm trade-off mesmo SEM partição.<br><br>PACELC (Daniel Abadi, 2010): <strong>P</strong>artition + <strong>A</strong>/<strong>C</strong>, <strong>E</strong>lse <strong>L</strong>atency/<strong>C</strong>onsistency.<br><br>Sem partição, ainda escolhe entre L (latência baixa, possível stale) e C (consistência forte, mais lento).<br><br><strong>Classificações:</strong><br>• Spanner = PC/EC: sempre prefere consistency<br>• DynamoDB = PA/EL: sempre prefere latência baixa<br>• MongoDB = PA/EC: availability em partição, consistency em normal',
    tip: 'Citar Abadi por nome e o ano (2010) demonstra que você leu a literatura.',
  },
  {
    level: 'Senior',
    q: 'Explique linearizability vs serializability.',
    a: 'Conceitos diferentes que entrevistadores misturam.<br><br><strong>Linearizability:</strong> garantia sobre <strong>operações únicas</strong> em objetos (registers, KV). Toda operação parece atômica em algum ponto entre invocação e resposta. Ordem GLOBAL respeita real-time.<br><br><strong>Serializability:</strong> garantia sobre <strong>transações</strong> (multi-op). Resultado equivale a alguma ordem serial das transações. NÃO especifica qual ordem.<br><br><strong>Strict serializability:</strong> serializability + linearizability — Spanner faz isso via TrueTime.<br><br><strong>PostgreSQL SERIALIZABLE isolation:</strong> serializable mas não linearizable em replicas async.',
    tip: 'A pegadinha: alguns dizem "MySQL com REPEATABLE READ é serializable" — não é, é snapshot isolation. Saber a hierarquia é raro.',
  },
  {
    level: 'Senior',
    q: 'Explique quorum (R+W>N) e por que garante strong consistency.',
    a: 'Em sistema com N réplicas, escrita confirma quando W réplicas responderam OK; leitura consulta R réplicas e retorna versão mais recente.<br><br><strong>Por que R+W &gt; N → strong:</strong> qualquer conjunto de W writes e qualquer R reads se sobrepõem em pelo menos um node. Esse node tem a última escrita.<br><br><strong>Exemplos N=3:</strong><br>• R=1, W=3: leitura mínima, escrita lenta. Strong.<br>• R=2, W=2 (QUORUM): balanceado. R+W=4 &gt; 3.<br>• R=1, W=1: R+W=2 ≤ 3. Eventual consistency.<br><br><strong>Pegadinha:</strong> sloppy quorum em Dynamo NÃO garante strong mesmo com R+W &gt; N.',
    tip: 'Mencionar sloppy quorum como exceção é detalhe que diferencia. Vem do paper original do Dynamo.',
  },
  {
    level: 'Senior',
    q: 'O que são CRDTs e quando usaria?',
    a: 'CRDTs (Conflict-free Replicated Data Types) são estruturas de dados que convergem SEM coordenação. Operações de merge: comutativo, associativo, idempotente.<br><br><strong>Tipos:</strong><br>• G-Counter: counter monotônico, merge = max<br>• PN-Counter: G-Counter para increments + decrements<br>• G-Set, OR-Set: sets add-only, add-wins-remove<br>• LWW-Register: register com last-write-wins<br>• Sequence (Yjs, Automerge, RGA): edição colaborativa<br><br><strong>Quando usar:</strong> sistemas multi-master offline-first (Riak), edição colaborativa (Google Docs alternative), counters distribuídos sem coordenação.<br><br><strong>Limitação:</strong> nem toda estrutura tem CRDT trivial.',
    tip: 'Citar Yjs e Automerge ancora hands-on. Riak data types (counter, set, map, hll) mostra exposição a sistema CRDT-native.',
  },
  {
    level: 'Senior',
    q: 'Quando usaria sistema AP em vez de CP?',
    a: 'Quando availability é mais valiosa que consistency exata.<br><br><strong>AP é apropriado:</strong><br>• Carrinho de compras (resolve conflito no checkout)<br>• Feed social (atraso aceitável)<br>• Counters (likes, views, telemetria) — CRDTs convergem<br>• Logs e métricas append-only<br>• Sessions e cache<br>• Search index (dados antigos por minutos é OK)<br><br><strong>NÃO use AP em:</strong><br>• Saldo bancário, payments<br>• Estoque crítico (oversell)<br>• Booking de assentos únicos<br>• Locks distribuídos (use etcd/ZooKeeper)<br><br>Sistemas modernos usam HÍBRIDO — catálogo (AP) + checkout (CP) + payments (CP). Saga conecta.',
    tip: 'Resposta sênior usa pattern híbrido — sistema real é mistura. "Tudo CP" ou "tudo AP" é resposta junior.',
  },
  {
    level: 'Senior',
    q: 'Como implementaria pagamento em sistema distribuído?',
    a: 'Precisa <strong>strong consistency (CP)</strong>.<br><br><strong>Opções:</strong><br>• Spanner / CockroachDB: ACID distribuído via TrueTime/Paxos<br>• Postgres single primary com replica sync<br>• Saga pattern: transações locais + compensações<br><br><strong>Práticas obrigatórias:</strong><br>• <strong>Idempotency keys</strong> em toda operação — retry sem duplicar<br>• <strong>Outbox pattern</strong> — atomicidade entre DB e event publication<br>• <strong>Reconciliation jobs</strong> — verificam consistency vs payment provider<br><br><strong>Anti-pattern:</strong> 2PC entre microserviços — locks por minutos, blocking em coordinator failure.',
    tip: 'Mencionar idempotency keys + outbox + reconciliation é a tríade de produção. Sem eles, "Saga" é só palavra-chave.',
  },
  {
    level: 'Senior',
    q: 'O que é eventual consistency e como funciona na prática?',
    a: 'Sistema garante que, ausência de novos updates, eventualmente todas as réplicas convergem. NÃO especifica QUANDO.<br><br><strong>Mecanismos de convergência:</strong><br>• <strong>Read repair:</strong> durante read, propaga versão mais recente para replicas atrás<br>• <strong>Hinted handoff:</strong> node offline tem writes guardados; recebe quando volta<br>• <strong>Anti-entropy via Merkle trees:</strong> comparação eficiente entre replicas — DynamoDB usa<br>• <strong>Gossip:</strong> propagação O(log N) — Cassandra usa<br><br><strong>Garantias session-level (mais fortes que puro eventual):</strong> read-your-writes, monotonic reads, causal consistency. Sistemas modernos vivem nesse espectro.',
    tip: 'O espectro de consistency models (não só "strong vs eventual") é tópico de Kleppmann — citar mostra leitura profunda.',
  },
  {
    level: 'Senior',
    q: 'Como funciona Saga pattern e quando substitui 2PC?',
    a: '<strong>2PC limitações:</strong> blocking em coordinator failure, lentidão (locks toda duração), exige protocolo XA.<br><br><strong>Saga:</strong> sequência de transações locais; cada uma tem operação compensatória. Se step N falha, executa undo dos steps 1..N-1 em ordem inversa.<br><br><strong>Dois estilos:</strong><br>• <strong>Orchestration:</strong> orchestrator central. Mais visível, debugging mais fácil.<br>• <strong>Choreography:</strong> eventos via Kafka, cada serviço reage. Loosely-coupled.<br><br><strong>Trade-offs:</strong><br>• NÃO é ACID — estados intermediários visíveis<br>• Compensações idempotentes e reversíveis<br>• Não pode usar Two Phase Locking<br><br><strong>Padrão e-commerce:</strong> place_order → reserve_inventory → process_payment → ship → notify.',
    tip: 'Diferença orchestration vs choreography é entrevista clássica. Orchestration para fluxos críticos, choreography para sistemas evolutivos.',
  },
  {
    level: 'Senior',
    q: 'O que é vector clock e por que é melhor que timestamp?',
    a: '<strong>Problema com timestamp puro:</strong> clocks de servidores não são sincronizados perfeitamente (NTP skew). LWW via timestamp pode descartar updates concorrentes silenciosamente.<br><br><strong>Vector clock:</strong> cada node mantém Map&lt;nodeId, counter&gt;. Em cada operação, incrementa próprio counter. Em sync, mergeia via max componente-a-componente.<br><br><strong>Comparação:</strong><br>• A → B (happens-before): all A[k] ≤ B[k] AND exists A[k] &lt; B[k]<br>• A == B: idênticos<br>• A concurrent B: nem A → B nem B → A — CONFLITO<br><br><strong>Riak vs Cassandra:</strong> Riak retorna AMBAS versões em conflito — cliente faz merge. Cassandra usa LWW por default — perde dados concorrentes.<br><br><strong>HLC (Hybrid Logical Clocks):</strong> CockroachDB combina wall clock + logical counter.',
    tip: 'HLC é tópico recente (Cockroach paper) — citar mostra estado da arte.',
  },
  {
    level: 'Senior',
    q: 'Como projeta sistema 24/7 com 99.99% availability?',
    a: '99.99% = 52 minutos/ano de downtime. Exige design defensivo em camadas:<br><br>1. <strong>Eliminar SPOFs:</strong> N+1 ou N+2 redundância. Multi-AZ obrigatório, multi-region para 99.99%+<br>2. <strong>CAP por componente:</strong> serviços críticos CP (fail-fast), feed/cache AP<br>3. <strong>Health checks profundos:</strong> não só TCP — testar dependencies. Liveness vs readiness<br>4. <strong>Circuit breakers:</strong> evitar cascading failures (Hystrix, Resilience4j)<br>5. <strong>Bulkheads:</strong> isolamento de recursos por feature/tenant<br>6. <strong>Graceful degradation:</strong> features não-essenciais desligam primeiro<br>7. <strong>Async retries com backoff:</strong> exponencial + jitter + idempotency keys<br>8. <strong>Chaos engineering:</strong> injetar falhas controladamente<br>9. <strong>SLI/SLO/SLA:</strong> alarmes em SLO violation<br>10. <strong>Runbooks + on-call:</strong> resposta sub-15min Sev1',
    tip: 'Resposta completa cobre arquitetura + operação. SLI/SLO/SLA + chaos engineering são diferenciais sêniores.',
  },
  {
    level: 'Senior',
    q: 'ACID vs BASE — quando usar cada?',
    a: '<strong>ACID:</strong> Atomicity, Consistency, Isolation, Durability — bancos tradicionais single-node.<br><strong>BASE:</strong> Basically Available, Soft state, Eventual consistency — sistemas distribuídos AP.<br><br><strong>Quando ACID:</strong><br>• Finanças, payments, inventário crítico<br>• Sistemas com invariantes hard (saldo &gt;= 0)<br>• Single-node ou small clusters<br><br><strong>Quando BASE:</strong><br>• Escala web (user content, feeds)<br>• Multi-region com latência mandatória &lt; 100ms<br>• Volume que ACID não suporta<br><br><strong>NewSQL (CockroachDB, YugabyteDB, Spanner):</strong> tenta ACID em escala distribuída. Custa latência mas elimina dilema. Tendência moderna para sistemas que precisam ambos.',
    tip: 'NewSQL como categoria é diferencial sênior. "Spanner é Postgres distribuído" simplifica demais — saber TrueTime + Paxos diferencia.',
  },
  {
    level: 'Senior',
    q: 'O que é split-brain e como resolveria?',
    a: '<strong>Split-brain:</strong> partição divide cluster em "ilhas" que cada uma se considera o cluster válido. Ambos aceitam writes — quando rede volta, conflito.<br><br><strong>Soluções CP:</strong><br>• <strong>Quorum-based leader election:</strong> Raft, Paxos. Líder eleito por majoria. Lado minoritário não elege novo líder.<br>• <strong>Fencing token:</strong> líder eleito recebe token monotônico. Storage rejeita writes com token antigo.<br>• <strong>STONITH</strong> (Shoot The Other Node In The Head): novo líder força reboot do antigo. Pacemaker.<br><br><strong>Soluções AP:</strong><br>• <strong>Vector clocks + cliente resolve:</strong> Riak retorna ambas versões<br>• <strong>CRDTs:</strong> mergem automaticamente<br>• <strong>LWW:</strong> simples mas perde dados',
    tip: 'STONITH parece DevOps mas é central em HA. Saber por nome diferencia.',
  },
  {
    level: 'Senior',
    q: 'Como implementaria lock distribuído com cuidados?',
    a: 'Locks distribuídos têm armadilhas profundas.<br><br><strong>Implementações:</strong><br>• etcd / ZooKeeper: nativos (CompareAndSwap, ephemeral nodes). Recommended.<br>• Redis SETNX + EX: simples mas problemas com timeout e clock drift<br>• Redlock (Redis multi-node): criticado por Kleppmann — assumções sobre clocks são frágeis<br>• DynamoDB conditional write com TTL<br><br><strong>Armadilha clássica:</strong> processo adquire lock, sofre 30s GC pause, lock expira, outro adquire. Quando o primeiro acorda, ainda acha que tem lock.<br><br><strong>Solução: fencing tokens.</strong> Lock service emite token monotônico junto. Storage rejeita writes com token velho. Funciona mesmo com pausas.<br><br><strong>Recomendação:</strong> usar lock service confiável, não implementar do zero. Sempre fencing tokens. Lock distribuído é último recurso.',
    tip: 'Crítica de Kleppmann ao Redlock é entrevista classic. Fencing tokens demonstram leitura profunda.',
  },
  {
    level: 'Senior',
    q: 'O que é "outbox pattern" e que problema resolve?',
    a: '<strong>Problema:</strong> em microserviços event-driven, modificar DB E publicar evento não é atômico. Falha entre os dois → inconsistência.<br><br><strong>Outbox pattern:</strong><br>1. Em vez de publicar evento direto, escreve evento numa tabela "outbox" na MESMA transação. ACID local garante atomicidade.<br>2. Relay process (CDC, Debezium) lê tail da outbox e publica no Kafka.<br>3. Após publicar, marca evento como "published".<br><br><strong>Garantias:</strong> at-least-once delivery (relay pode reentregar). Consumers precisam ser idempotentes.<br><br><strong>Implementações:</strong><br>• Debezium CDC + Kafka Connect — lê WAL do Postgres<br>• Custom relay com polling periódico<br>• Eventuate, Axon — frameworks<br><br><strong>Antipattern:</strong> dual-write sem outbox — escrever em DB e Kafka separadamente, esperando ambos funcionarem.',
    tip: 'Outbox + Debezium é arquitetura moderna de microserviços event-driven. Citar Debezium nominalmente mostra exposição a tooling moderno.',
  },
  {
    level: 'Senior',
    q: 'Como você analisa um sistema distribuído real para decidir CAP?',
    a: 'Não é "qual letra escolho" — é análise por componente.<br><br>1. <strong>Identifique partes:</strong> auth, catálogo, carrinho, payments, inventário, search, recommendation, notification, audit.<br>2. <strong>Para cada, pergunte:</strong> consistency necessária? availability tolerável? latência? volume? multi-region?<br>3. <strong>Mapeie:</strong><br>• Payments, inventário: CP/ACID. Postgres + idempotency + Saga<br>• Catálogo, search: AP. Cassandra + Elasticsearch<br>• Carrinho: AP com merge. CRDTs ou cliente resolve<br>• Audit log: AP append-only. S3 + Athena ou Kafka<br>• Sessions / cache: AP. Redis<br>• Leader election: CP. etcd/ZooKeeper<br>4. <strong>Conecte:</strong> Saga + outbox + idempotency + reconciliation<br>5. <strong>Documente:</strong> SLOs explícitos por serviço<br><br>Sistema "tudo CP" é caro; "tudo AP" perde dados. Híbrido bem desenhado é arquiteto sênior.',
    tip: 'Resposta sênior é arquitetural, não dogmática. Mapeamento por componente + SLO por serviço é nível de profundidade esperado em system design final round.',
  },
  {
    level: 'Senior',
    q: 'O que é "happens-before" e por que importa?',
    a: '<strong>Happens-before (Lamport, 1978):</strong> relação parcial entre eventos que captura causalidade.<br><br><strong>Definição:</strong> A → B se:<br>1. A e B no mesmo processo, A antes de B na ordem do programa<br>2. A é envio de mensagem, B é recebimento<br>3. Transitividade<br><br><strong>Por que importa:</strong><br>• Define causalidade sem clock global<br>• Eventos concurrent (A || B): nem A → B nem B → A<br>• Implementação: Lamport timestamps ou vector clocks<br><br><strong>Aplicações:</strong><br>• Causal consistency<br>• Distributed snapshots (Chandy-Lamport)<br>• Conflict detection<br>• HLC do CockroachDB combina happens-before + wall clock<br><br>Entender happens-before torna possível raciocinar sobre sistemas distribuídos sem confundir "concorrente" com "ao mesmo tempo".',
    tip: 'Lamport (1978) é foundational. Mencionar o paper "Time, Clocks and the Ordering of Events" mostra homework de fundamentos teóricos.',
  },
]

// ── Mnemonics ─────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'CAP-PIE',
    trick: 'Particao impõe escolha (A ou C) — CA é mito',
    expansion: [
      ['P', 'Partition tolerance — inevitável em rede real'],
      ['A', 'Availability — todo node responde'],
      ['C', 'Consistency — toda leitura vê última escrita'],
      ['Mito', 'CA = single-node ou rede perfeita'],
    ],
    explanation: 'Como toda fatia de pizza tem borda, todo sistema distribuído real tem que ter P. A escolha é entre A (continuar respondendo) ou C (recusar para preservar consistência). Sistema "CA" só existe em single-node.',
    example: 'Postgres com replica sync = CP (primary trava em partição). Cassandra default = AP (ambos lados continuam, eventual).',
    why: 'Em entrevista de system design, o erro mais comum é dizer "vou usar CA". P não é opcional. Sempre PA ou PC.',
  },
  {
    label: 'PACELC = "Pace LC"',
    trick: 'PACELC adiciona "pace" (ritmo/latência) ao CAP',
    expansion: [
      ['PA / PC', 'Em partição, escolhe Availability ou Consistency (CAP clássico)'],
      ['EL', 'Else (sem partição), prefere Latency baixa'],
      ['EC', 'Else, prefere Consistency forte'],
      ['Spanner', 'PC/EC — sempre consistency'],
      ['DynamoDB', 'PA/EL — sempre rápido, eventual'],
    ],
    explanation: 'CAP só fala da partição. PACELC (Abadi 2010) estende: SEM partição, ainda há trade-off entre latência baixa (lê réplica local, possível stale) e consistency forte (espera quorum, mais lento).',
    example: 'Spanner = PC/EC: sempre consistency (TrueTime + Paxos), custa latência. DynamoDB = PA/EL: sub-10ms global, eventual default.',
    why: 'Resposta sênior usa PACELC, não só CAP. Mostra que entende trade-off em operação normal, não só durante partição.',
  },
  {
    label: 'BASE',
    trick: 'BAse Soft Eventual — oposto de ACID',
    expansion: [
      ['BA', 'Basically Available — sempre responde (mesmo stale)'],
      ['S', 'Soft state — estado pode mudar sem input externo'],
      ['E', 'Eventually consistent — converge eventualmente'],
    ],
    explanation: 'Não é "ACID ruim" — trade-off consciente para escala. ACID em distribuído é caro (consenso, coordenação cross-DC). BASE é o default para escala web; ACID é default para finanças/inventário.',
    example: 'Cassandra (CL=ONE) = BASE puro. Postgres single-node = ACID puro. Spanner/CockroachDB tentam ACID em distribuído (NewSQL).',
    why: 'BASE não é "lower consistency" — é estratégia diferente. Sistemas modernos usam híbrido: catálogo BASE, payments ACID.',
  },
  {
    label: 'R+W>N',
    trick: 'Read + Write > N réplicas = strong consistency',
    expansion: [
      ['R', 'Read quorum — réplicas consultadas'],
      ['W', 'Write quorum — réplicas que confirmam'],
      ['N', 'Total de réplicas'],
      ['Sobreposição', 'R+W > N → reads e writes sobrepõem em ≥1 node'],
    ],
    explanation: 'Em N réplicas, escrita confirma quando W respondem; leitura consulta R. Se R + W > N, há sobreposição garantida — leitura sempre encontra última escrita. Cassandra QUORUM = ⌈N/2⌉+1 majority quorum.',
    example: 'N=5: R=3, W=3 (QUORUM) → R+W=6>5, strong, tolera 2 nodes down. R=1, W=1 → R+W=2≤5, eventual, mais rápido.',
    why: 'Quorum é o mecanismo que torna sistemas tunable entre CP e AP. Saber a fórmula permite responder "como ajusto Cassandra para strong?" em entrevista.',
  },
  {
    label: 'CRDT',
    trick: 'Convergem Replicações Distribuídas Tranquilamente',
    expansion: [
      ['Conflict-free', 'Sem conflito por design'],
      ['Replicated', 'Réplicas trabalham independentemente'],
      ['Data Type', 'Counters, sets, registers, sequences'],
      ['Merge', 'Comutativo + associativo + idempotente'],
    ],
    explanation: 'Tipos de dados projetados para convergir SEM coordenação, mesmo com escritas concorrentes. G-Counter (counter), OR-Set (add wins remove), LWW-Register, Yjs (sequência colaborativa).',
    example: 'Google Docs alternative usa Yjs/Automerge. Riak tem CRDTs nativos (counter, set). Riak G-Counter: 3 nodes incrementam offline, mergeam sem perda.',
    why: 'CRDTs resolvem o problema de "AP sem perder dados concorrentes". Saber dizer onde funciona (counters, sets) e onde não funciona (transações arbitrárias) diferencia sênior.',
  },
  {
    label: 'LinSer ≠ SerLin',
    trick: 'Linearizability ≠ Serializability — operações vs transações',
    expansion: [
      ['Linearizable', 'Operações únicas com ordem real-time global'],
      ['Serializable', 'Transações multi-op em alguma ordem serial'],
      ['Strict Serial', 'Ambos — Spanner via TrueTime'],
      ['PG Serializable', 'Serializable mas não linearizable em replicas'],
    ],
    explanation: 'Conceitos misturados em entrevista. Linearizability é sobre registers/KV com ordem real-time. Serializability é sobre transações em alguma ordem serial (não necessariamente real-time).',
    example: 'PostgreSQL SERIALIZABLE isolation: transações serializable single-node. Spanner: strict serializable global. etcd: linearizable por chave.',
    why: 'Em system design final round, distinguir esses dois mostra profundidade real. Erro de pleno: "PostgreSQL é linearizable" — não é, em replicas async é stale.',
  },
  {
    label: '2PC vs Saga',
    trick: '2PC trava (CP forte), Saga compensa (eventual)',
    expansion: [
      ['2PC', 'Two-Phase Commit: prepare + commit. Blocking em coordinator failure.'],
      ['Saga', 'Transações locais + compensações em ordem inversa'],
      ['Orchestration', 'Orchestrator central coordena steps'],
      ['Choreography', 'Eventos via Kafka, cada serviço reage'],
    ],
    explanation: '2PC garante atomicidade distribuída mas bloqueia se coordinator falha. Saga substitui em microserviços: cada step tem operação compensatória; falha aciona compensações em ordem inversa.',
    example: 'E-commerce: place_order → reserve_inventory → process_payment → ship. Falha em payment aciona unreserve_inventory + cancel_order.',
    why: '2PC é antipattern em microserviços modernos. Saga é resposta correta em entrevista de system design distribuído.',
  },
  {
    label: 'Vector Clock',
    trick: 'Cada node tem counter próprio + max no merge = detecta concurrent',
    expansion: [
      ['Increment', 'Cada node incrementa só seu próprio counter'],
      ['Merge', 'Max componente-a-componente'],
      ['A → B', 'all A[k] ≤ B[k] AND exists A[k] < B[k]'],
      ['Concurrent', 'Nem A → B nem B → A — CONFLITO'],
    ],
    explanation: 'Substitui timestamp puro (que perde dados em clock skew). Detecta updates concorrentes em vez de descartá-los. Riak retorna ambas versões em conflito; cliente resolve.',
    example: 'Node A:{A:2,B:0}, Node B:{A:0,B:2} = concurrent (conflito). Após sync: {A:2,B:2}. Compare LWW: timestamp escolhe um, perde o outro.',
    why: 'Cassandra usa LWW (perde dados); Riak usa vector clocks (preserva conflitos). Saber a diferença é diferencial em entrevista de Riak/DynamoDB.',
  },
]

// ── Comparative ───────────────────────────────────────────────────────────────

const COMPARATIVE_OPTIONS: CompOption[] = [
  { name: 'Cassandra', color: '#f59e0b' },
  { name: 'DynamoDB', color: '#fb923c' },
  { name: 'MongoDB', color: '#4ade80' },
  { name: 'etcd', color: '#22c55e' },
  { name: 'Spanner', color: '#a855f7' },
]

const COMPARATIVE_CRITERIA: CompCriterion[] = [
  {
    criterion: 'CAP classification',
    category: 'Fundamentos',
    values: {
      Cassandra: 'AP (default), tunable para CP via QUORUM',
      DynamoDB: 'AP (default), CP com ConsistentRead=true',
      MongoDB: 'CP (com w=majority + readConcern majority em 4.0+)',
      etcd: 'CP (Raft consensus, sempre forte)',
      Spanner: 'CP estrito (TrueTime + Paxos, strict serializable)',
    },
  },
  {
    criterion: 'PACELC',
    category: 'Fundamentos',
    values: {
      Cassandra: 'PA/EL — disponibilidade + latência baixa',
      DynamoDB: 'PA/EL — multi-region < 10ms',
      MongoDB: 'PA/EC — disponível em partição, consistente em normal',
      etcd: 'PC/EC — sempre consistência',
      Spanner: 'PC/EC — sempre consistência, custa latência',
    },
  },
  {
    criterion: 'Modelo de consistência',
    category: 'Garantias',
    values: {
      Cassandra: 'Tunable: ONE (eventual) → ALL (strong)',
      DynamoDB: 'Eventual ou strongly consistent (ConsistentRead)',
      MongoDB: 'Linearizable com readConcern linearizable',
      etcd: 'Linearizable (com lease para reads)',
      Spanner: 'External / strict serializable',
    },
  },
  {
    criterion: 'Latência típica',
    category: 'Performance',
    values: {
      Cassandra: 'Sub-ms (LOCAL_ONE), 5-10ms (LOCAL_QUORUM)',
      DynamoDB: 'Sub-10ms global, 2× mais lento com ConsistentRead',
      MongoDB: '5-20ms com w=majority',
      etcd: '1-5ms para writes (cluster local)',
      Spanner: '50-200ms cross-region (custo TrueTime + Paxos)',
    },
  },
  {
    criterion: 'Modelo de dados',
    category: 'Dados',
    values: {
      Cassandra: 'Wide-column store, queries por partition key',
      DynamoDB: 'Key-value e document, queries por hash + sort key',
      MongoDB: 'Document store (BSON), queries flexíveis',
      etcd: 'Key-value simples, watches reactive',
      Spanner: 'Relational (SQL ANSI), interleaved tables',
    },
  },
  {
    criterion: 'Caso de uso ideal',
    category: 'Decisão',
    values: {
      Cassandra: 'Multi-DC com latência baixa, time-series, escrita pesada',
      DynamoDB: 'Serverless apps, event sourcing, key-value baixa latência',
      MongoDB: 'Document store flexível, prototipagem, geo-distributed',
      etcd: 'Leader election, locks, config, K8s storage',
      Spanner: 'Finanças globais, inventário crítico, multi-region ACID',
    },
  },
  {
    criterion: 'Custo operacional',
    category: 'Custo',
    values: {
      Cassandra: 'Self-host complexo. DataStax Astra = managed.',
      DynamoDB: 'Managed, pricing por RCU/WCU pode surpreender',
      MongoDB: 'Atlas managed disponível, comunity self-host',
      etcd: 'Geralmente self-host em K8s; relativamente leve',
      Spanner: 'Caro. Mínimo $0.30/h por node + storage',
    },
  },
]

const COMPARATIVE_SCENARIOS: CompScenario[] = [
  {
    scenario: 'Sistema de payments / banking',
    recommendation: 'Spanner ou CockroachDB',
    reason: 'Strict serializability + ACID em escala global. Erro de consistência em payment é fraude — vale a latência extra.',
  },
  {
    scenario: 'Feed social / timeline',
    recommendation: 'Cassandra ou DynamoDB',
    reason: 'AP é apropriado — atraso de segundos é aceitável. Latência baixa em multi-region é prioridade.',
  },
  {
    scenario: 'Time-series / metrics',
    recommendation: 'Cassandra (com OpenTSDB ou pure)',
    reason: 'Wide-column é ótimo para time-series. Escrita pesada, leitura por intervalo de tempo. Cassandra escala linearmente.',
  },
  {
    scenario: 'Leader election / locks distribuídos',
    recommendation: 'etcd ou ZooKeeper',
    reason: 'CP estrito é necessário. Evite implementar em Redis (Redlock criticado). etcd é o padrão moderno (K8s usa).',
  },
  {
    scenario: 'Catálogo de e-commerce',
    recommendation: 'MongoDB ou DynamoDB',
    reason: 'Schema flexível para variações de produto. AP aceitável (atraso em update de catálogo OK). Search via Elasticsearch separado.',
  },
  {
    scenario: 'Sessões e cache',
    recommendation: 'Redis (com replicação)',
    reason: 'Latência sub-ms é prioridade. Stale por segundos OK. Sentinel ou Cluster para HA.',
  },
  {
    scenario: 'Inventário com sales globais',
    recommendation: 'Spanner ou Postgres com Saga',
    reason: 'Oversell é problema sério. CP estrito ou Saga com reservation pattern (reserve → confirm/cancel).',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'CAP Theorem',
    stackLabel: 'Sistemas Distribuídos',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'CAP Theorem',
    accentColor: C,
    stackLabel: 'Sistemas Distribuídos',
    sections: {
      hooks: [
        { name: 'CAP', sig: 'Consistency · Availability · Partition', desc: 'Em partição, escolha A ou C. P é inevitável em rede real. CA é mito.' },
        { name: 'PACELC', sig: 'P + A/C, Else L/C', desc: 'Estende CAP — em operação normal, ainda há trade-off latência vs consistency.' },
        { name: 'Linearizability', sig: 'Operações únicas, real-time order', desc: 'Garantia mais forte para registers/KV. Toda leitura vê última escrita global.' },
        { name: 'Serializability', sig: 'Transações em alguma ordem serial', desc: 'Garantia para transações multi-op. Não exige real-time global.' },
        { name: 'Quorum (R+W>N)', sig: 'Strong via overlap', desc: 'R reads + W writes maior que N réplicas garante sobreposição.' },
        { name: 'CRDTs', sig: 'Convergência sem coordenação', desc: 'G-Counter, OR-Set, LWW-Register, sequences — merge comutativo.' },
        { name: 'Vector clocks', sig: 'Detecta concurrent', desc: 'Map<nodeId, counter> + merge max. Riak usa, Cassandra não.' },
        { name: 'Saga pattern', sig: 'Compensações em ordem inversa', desc: 'Substitui 2PC para transações distribuídas em microserviços.' },
        { name: 'Outbox pattern', sig: 'Atomicidade DB + event', desc: 'Evento na mesma tx do DB. Relay (Debezium) publica no Kafka.' },
        { name: 'Read-your-writes', sig: 'Session consistency', desc: 'Sessão sempre vê suas escritas. Sticky sessions ou cliente envia versão.' },
      ] as HookItem[],
      depRows: [
        ['CP — sistemas', 'Spanner, CockroachDB, etcd, ZooKeeper, MongoDB w=majority, Postgres sync'],
        ['AP — sistemas', 'Cassandra, DynamoDB, CouchDB, Riak, Redis async'],
        ['PC/EC', 'Spanner, CockroachDB, Postgres sync — sempre consistency'],
        ['PA/EL', 'DynamoDB, Cassandra — sempre disponibilidade + latência'],
        ['PA/EC', 'MongoDB — disponível em partição, consistente em normal'],
        ['Strict Serial', 'Spanner via TrueTime'],
        ['Linearizable', 'etcd, ZooKeeper (com sync), DynamoDB ConsistentRead'],
        ['Serializable', 'Postgres SERIALIZABLE, MySQL Serializable'],
        ['Eventual', 'Cassandra CL=ONE, DynamoDB default, CouchDB'],
      ],
      rules: [
        { ok: true, t: 'P sempre presente em sistema distribuído real (rede falha)' },
        { ok: true, t: 'Cite sistemas reais por nome em entrevista (etcd, Cassandra, Spanner)' },
        { ok: true, t: 'PACELC é resposta sênior, não só CAP' },
        { ok: true, t: 'CRDTs para AP sem perder dados concorrentes' },
        { ok: true, t: 'Saga + idempotency + outbox em microserviços' },
        { ok: true, t: 'etcd/ZooKeeper para locks distribuídos (não Redis)' },
        { ok: true, t: 'Híbrido: payments CP, feed AP, cache AP, audit AP' },
        { ok: true, t: 'Quorum tunable: Cassandra QUORUM vira CP' },
        { ok: true, t: 'Fencing tokens em locks distribuídos' },
        { ok: false, t: 'Achar que sistema "CA" é possível em distribuído' },
        { ok: false, t: 'Confundir CAP "C" com ACID "C"' },
        { ok: false, t: 'Confundir linearizability com serializability' },
        { ok: false, t: 'LWW timestamp puro (perde dados em clock skew)' },
        { ok: false, t: '2PC entre microserviços (blocking em failure)' },
        { ok: false, t: 'Redlock para locks críticos (criticado por Kleppmann)' },
        { ok: false, t: 'Dual-write DB + Kafka sem outbox' },
      ] as RuleItem[],
      performanceTips: [
        'Cassandra LOCAL_QUORUM é sub-10ms; cross-DC EACH_QUORUM é 100ms+',
        'DynamoDB ConsistentRead custa 2× latência mas elimina stale reads',
        'Spanner cross-region é 50-200ms — usar single-region quando possível',
        'Quorum balanceado (R=W=majority) tolera N - majority nodes down',
        'Read repair em Cassandra corrige inconsistências em background',
        'Hinted handoff entrega writes para nodes temporariamente offline',
        'Anti-entropy via Merkle trees é eficiente — DynamoDB usa',
        'Gossip propaga em O(log N) — Cassandra usa para metadata',
      ],
      patterns: [
        { name: 'Saga + Compensations', code: 'place_order → reserve_inv → process_pay → ship | falha aciona compensações inversas', desc: 'Substitui 2PC em microserviços. Estados intermediários visíveis (não ACID).' },
        { name: 'Outbox pattern', code: 'INSERT INTO outbox + UPDATE state em mesma tx | relay (Debezium) → Kafka', desc: 'Atomicidade entre DB e event publication. At-least-once delivery — consumers idempotentes.' },
        { name: 'Idempotency keys', code: 'POST /payments { idempotency_key, ... }', desc: 'Cliente envia key único; servidor garante que retry não duplica. Crítico para retry safety em network failures.' },
        { name: 'Read-your-writes via versioning', code: 'cliente envia versão; servidor garante read >= versão', desc: 'Session consistency sem sticky sessions. DynamoDB Conditional Read implementa.' },
        { name: 'Quorum tunable per query', code: 'Cassandra: SELECT ... CONSISTENCY QUORUM', desc: 'Mesmo banco pode ser CP ou AP por query. Use QUORUM para writes críticos, ONE para reads aceitáveis stale.' },
      ],
      mentalModels: [
        'P sempre — só escolha é entre A e C durante partição inevitável',
        'PACELC > CAP simples — operação normal também tem trade-off',
        'Sistemas modernos vivem no espectro de consistency, não em "CP vs AP" binário',
        'Vector clocks > LWW timestamp — preservam updates concorrentes',
        'Saga substitui 2PC em microserviços — eventual mas correto',
        'Lock distribuído é último recurso — preferir designs sem locking (idempotency, optimistic concurrency)',
        'Se a resposta é "depends on consistency requirements", você está pensando como sênior',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'CAP Theorem',
    stackLabel: 'Sistemas Distribuídos',
    coverTitle: 'CAP & Sistemas Distribuídos — Mnemônicos',
  }),
  comparative: () => buildComparativeRefPdf({
    options: COMPARATIVE_OPTIONS,
    criteria: COMPARATIVE_CRITERIA,
    scenarios: COMPARATIVE_SCENARIOS,
    skillName: 'Bancos Distribuídos',
    accentColor: C,
    stackLabel: 'Sistemas Distribuídos',
    coverTitle: 'Cassandra vs DynamoDB vs MongoDB vs etcd vs Spanner',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function CapTheoremPdfs() {
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
