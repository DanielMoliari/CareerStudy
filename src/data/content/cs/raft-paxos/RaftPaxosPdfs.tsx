'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'

// ── Paleta Raft/Paxos (indigo) ────────────────────────────────────────────────
const C = '#6366f1'   // indigo — NUNCA omitir, default seria cyan React

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas de consenso distribuído mais cobradas em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: quorum, leader election, log replication, safety, reads linearizáveis (read index vs lease), Raft vs Paxos, etcd, cluster size, membership change e quando NÃO usar consenso. Tudo que entrevistadores de sênior cobram.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Consenso distribuído do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental completo com 6 categorias (Raft, Paxos, Quorum, Leitura Consistente, Problemas, Implementações) e checklist pré-entrevista de system design.',
    icon: '02',
    goal: 'Mapeamento mental',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam Raft na memória para a entrevista',
    type: 'mnemonics',
    pages: 2,
    description: 'Quorum 2f+1, Raft ELSE (Election-Log-Safety-Election), Paxos PP-AA (Prepare-Promise, Accept-Accepted), leituras I-L-S e Raft vs Paxos R=R/P=P — âncoras cognitivas para não travar na entrevista.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é quorum e por que ele é a base do consenso distribuído?',
    a: 'Quorum é a maioria simples (mais que metade). Com 2f+1 nós, tolera f falhas: após f nós falharem, ainda sobra maioria de f+1 para tomar decisões. A propriedade fundamental: <strong>qualquer dois quorums se intersectam em pelo menos 1 nó</strong>. Esse nó testemunhou a primeira decisão e pode rejeitar uma segunda conflitante. É isso que torna consenso matematicamente possível.',
    tip: 'A propriedade de interseção de quorums é o insight central — explique ela. Candidatos que só dizem "maioria" não demonstram entender por que funciona.',
  },
  {
    level: 'Pleno',
    q: 'Explique Raft: como funciona leader election?',
    a: 'Raft usa <strong>terms</strong> numerados monotonicamente. Follower sem heartbeat por electionTimeout (150–300ms aleatório) vira candidate: incrementa term, vota em si mesmo, solicita votos. Regra de voto: (1) não votou neste term, (2) log do candidato pelo menos tão atualizado (lastLogTerm maior, ou igual e lastLogIndex maior). Candidate com maioria → leader. Empate → novo timeout aleatório, nova eleição.',
    tip: 'Detalhe a regra de log comparison. Ela garante Leader Completeness — somente candidatos com log mais atualizado ganham, preservando entradas commitadas.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona log replication no Raft?',
    a: 'Cliente envia write ao leader → leader appenda entry ao log local → replica AppendEntries RPC para followers em paralelo → aguarda confirmação da maioria → commita entry → responde ao cliente → notifica followers do commit no próximo heartbeat. Followers verificam consistência (prevLogIndex/prevLogTerm) antes de appendar. Se não bater, retornam falha e o leader recua nextIndex para encontrar ponto de divergência.',
    tip: 'Mencione a verificação prevLogIndex/prevLogTerm. Ela garante que followers não aceitam entries fora de ordem ou de leader antigo.',
  },
  {
    level: 'Senior',
    q: 'O que acontece quando partição isola o leader do Raft?',
    a: 'Leader isolado (minoria): não consegue replicar para maioria → não commita novas entries. Lado majoritário: após electionTimeout, inicia eleição com term maior. Quando partição cura: leader antigo recebe mensagem com term maior → vira follower. Suas entradas não-commitadas são sobrescritas. Risco de stale reads: leader antigo pode servir reads desatualizados. Solução: <strong>read index</strong> (confirma com maioria) ou <strong>lease</strong> (clock-based).',
    tip: 'O detalhe de stale reads diferencia sênior. Um leader isolado serve reads desatualizados por toda duração do electionTimeout. Mencione as duas soluções.',
  },
  {
    level: 'Pleno',
    q: 'Por que clusters Raft devem ter número ímpar de nós?',
    a: '4 nós precisam de quorum 3 — mesmo que 5 nós. Sem ganho de tolerância. Pior: partição 2×2 é possível — nenhum lado tem quorum, cluster para completamente. 3 nós tolera 1 falha; 5 tolera 2; 7 tolera 3. Sweet spot: 3 para maioria dos casos, 5 para multi-AZ onde 2 falhas simultâneas são risco real.',
    tip: 'O problema do cluster par não é só desperdício — é o split-brain. Uma partição 2×2 impede que qualquer lado tenha quorum, paralisando o cluster inteiramente.',
  },
  {
    level: 'Senior',
    q: 'Como Raft garante leitura linearizável? Diferença entre read index e lease.',
    a: '<strong>Read naïve</strong>: lê estado local — pode retornar stale se leader isolado. <strong>Read Index</strong>: antes de servir read, leader registra commitIndex atual, confirma com maioria que ainda é leader via heartbeat, serve read quando state machine alcança esse index. Custo: 1 RTT por read. <strong>Lease Read</strong>: leader mantém lease de que não há outro leader por período determinado. Serve reads sem RTT extra. Requisito: clocks sincronizados. Risco: clock drift quebra garantia.',
    tip: 'Lease vs read index é a pergunta de sênior. Lease é mais rápido (sem RTT) mas depende de sincronização de clock — em ambientes com drift alto, read index é mais seguro.',
  },
  {
    level: 'Senior',
    q: 'Quais são as diferenças fundamentais entre Raft e Paxos?',
    a: '<strong>Decomposição</strong>: Raft decompõe consenso em sub-problemas separados (election, replication, membership). Paxos original resolve uma única instância — Multi-Paxos é extensão informal. <strong>Leader</strong>: Raft tem leader forte e autoritativo. Paxos tem proposer que pode mudar — qualquer acceptor pode tornar-se proposer. <strong>Especificação</strong>: Raft especifica snapshot, membership change, tudo. Multi-Paxos é informal — cada implementação decide os detalhes.',
    tip: 'A decomposição em sub-problemas é o insight de design do Raft. Paxos é mais expressivo mas a falta de especificação leva a implementações divergentes com bugs sutis.',
  },
  {
    level: 'Senior',
    q: 'Como Raft garante que o leader não perde entradas commitadas?',
    a: 'Propriedade <strong>Leader Completeness</strong>: se uma entry foi commitada em um term, ela estará em qualquer future leader. Mecanismo: regra de votação garante que candidato só ganha eleição se log é ao menos tão atualizado quanto a maioria dos votantes. Como entry commitada foi replicada para maioria, qualquer quorum de votantes inclui ao menos um nó com essa entry. Uma sutileza: leader não pode commitar entries de terms anteriores diretamente — apenas commitando entry do term atual, as anteriores são implicitamente commitadas.',
    tip: 'A regra de que leader só commita entries do term atual (não terms anteriores diretamente) é o edge case mais difícil do Raft. Mencioná-lo demonstra leitura profunda do paper.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona snapshot no Raft e por que é necessário?',
    a: 'Log cresce indefinidamente. Snapshot serializa estado atual da state machine + anota lastIncludedIndex e lastIncludedTerm. Entries anteriores ao snapshot são descartadas. Recovery: carrega snapshot → aplica entries posteriores. InstallSnapshot RPC: se nó está muito atrasado (precisa de entries que o leader descartou), leader envia snapshot completo. Após receber, follower descarta log e inicia do snapshot.',
    tip: 'InstallSnapshot permite onboarding de nós novos ou recovery de nós muito atrasados. Sem ele, nó novo teria que receber todo o histórico.',
  },
  {
    level: 'Senior',
    q: 'Como Raft gerencia mudanças de membership?',
    a: 'Problema: durante transição de 3 para 5 nós, dois quorums podem não se intersectar — risco de dois leaders simultâneos. <strong>One server at a time</strong>: adicionar ou remover um servidor por vez. Garante que quorum antigo e novo sempre se intersectam. Mais conservador mas correto. <strong>Joint consensus</strong>: fase de transição onde ambas configurações precisam de quorum separado. Mais complexo. etcd usa one-server-at-a-time por ser mais simples de implementar corretamente.',
    tip: 'Joint consensus vs one-server-at-a-time é o tópico mais avançado do Raft. Mencionar que a maioria das implementações usa one-server-at-a-time demonstra leitura do paper.',
  },
  {
    level: 'Senior',
    q: 'Como o etcd usa Raft internamente?',
    a: 'etcd é o banco de configuração do Kubernetes — armazena pods, services, deployments. Usa etcd/raft library em Go. Cluster de 3 ou 5 nós. Leader atende writes e reads linearizáveis. Reads: linearizable read (read index, padrão) ou serializable read (pode ser stale, mais rápido). watch: revision number por write — clients podem watch desde uma revision específica. Defragmentation: compacta snapshots e log periodicamente.',
    tip: 'A separação entre linearizable read (read index) e serializable read é detalhe de produção importante. kubectl get pods usa serializable read por padrão — pode retornar estado ligeiramente stale.',
  },
  {
    level: 'Pleno',
    q: 'Como você configuraria um cluster etcd para produção?',
    a: 'Tamanho: 3 nós para maioria dos casos, 5 nós para multi-AZ. Nunca 2 ou 4. Hardware: SSD é requisito — etcd é I/O bound (WAL). Latência de fsync impacta diretamente writes. Dedique hardware separado ao etcd do Kubernetes — competição com pods mata latência. Rede: RTT entre nós < 10ms. Backup: snapshot regularmente (etcdctl snapshot save). Testar restore! Compaction: configurar auto-compaction para evitar crescimento indefinido.',
    tip: 'SSD é requisito não-negociável para etcd — mencione isso. E teste de restore: muitas equipes têm backup mas nunca testam o restore — descobrem que não funciona só quando precisam.',
  },
  {
    level: 'Senior',
    q: 'Quando você NÃO usaria Raft?',
    a: '1. <strong>Sistemas com eventual consistency aceitável</strong> (Cassandra, DynamoDB) — muito mais rápido para writes. 2. <strong>Write-heavy single primary</strong> — sem HA automática, latência menor. 3. <strong>Geo-distribuído</strong> — Raft paga 1 RTT para maioria. Entre datacenters, RTT é 50–200ms — inaceitável. 4. <strong>Analytics/OLAP</strong> — replicação eventual é suficiente para throughput analítico.',
    tip: 'A resposta sênior começa pelos casos onde Raft é errado. Candidatos que propõem Raft para tudo não entendem o custo de latência de consenso.',
  },
  {
    level: 'Senior',
    q: 'O que é Multi-Paxos e como difere do Paxos básico?',
    a: 'Paxos básico (Single-Decree): consenso para uma única decisão. Duas fases por rodada: Prepare + Accept. Para log replication, precisaria de uma instância por entry — custo imenso. Multi-Paxos: quando proposer (leader) está estabelecido, pula fase 1 para rodadas subsequentes — apenas fase 2 por decisão. Reduz de 2 RTT para 1 RTT por entry. Problema: Multi-Paxos não é especificado formalmente — cada implementação tomou decisões diferentes.',
    tip: 'A ausência de especificação formal do Multi-Paxos é o argumento principal do paper do Raft. Mencioná-la demonstra leitura profunda do campo.',
  },
  {
    level: 'Senior',
    q: 'Como o Google Spanner usa Paxos e o que é TrueTime?',
    a: 'Spanner: banco globalmente distribuído. Cada shard (Paxos group) replicado em 5+ datacenters. TrueTime: API que retorna intervalo [earliest, latest] garantindo que tempo real está dentro. Implementado com GPS receivers e atomic clocks. Incerteza típica: 1–7ms. Usada para External Consistency: servidor aguarda intervalo de incerteza antes de commitar, garantindo que commit timestamp está no passado de qualquer transação futura.',
    tip: 'TrueTime é o mecanismo mais sofisticado de sistemas distribuídos em produção. Demonstra breadth de conhecimento do estado da arte em consensus e distributed transactions.',
  },
  {
    level: 'Pleno',
    q: 'Como você monitoraria um cluster Raft em produção?',
    a: 'Métricas essenciais: leader changes (eleições frequentes = instabilidade), commit latency p99 (impacta writes da aplicação), log apply lag (followers atrasados = risco em eleição), snapshot size (crescimento indica estado acumulado), failed proposals (writes rejeitados por perda de liderança). Alertas: > 2 eleições/hora → investigar instabilidade. Commit p99 > 500ms → rede ou hardware. Follower lag > 10k entries → risco de recovery lento.',
    tip: 'Leader changes como indicador primário de instabilidade é o mais importante. Cluster saudável tem eleições rarissimamente — apenas quando nó cai ou se reinicia.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre Raft e ZooKeeper/ZAB?',
    a: 'ZAB (ZooKeeper Atomic Broadcast): protocolo de broadcast atômico — garante que réplicas recebem mensagens na mesma ordem. Raft formula como log replication — semanticamente equivalente mas perspectiva diferente. ZAB tem fase de sincronização explícita após eleição. Raft usa AppendEntries incremental. ZooKeeper + ZAB é mais antigo (2007), amplamente usado. Kafka migrou de ZooKeeper para KRaft (Kafka com Raft próprio) no Kafka 3.x.',
    tip: 'A migração do Kafka de ZooKeeper para KRaft é ótimo exemplo de evolução do ecossistema. Mencioná-la demonstra conhecimento de tendências recentes da indústria.',
  },
  {
    level: 'Senior',
    q: 'Como implementar distributed lock com etcd usando fencing token?',
    a: 'etcd concurrency.NewMutex com TTL de lease. Session mantém lease com keep-alive automático. Se processo morre, lease expira após TTL → outro candidato vence. Fencing token: versão do lock (lease ID ou revision). Passar o token para operações no backend — banco/serviço downstream rejeita operações com token antigo. Garante que instância com GC pause longa que volta com lease expirado não consegue sobrescrever operações do novo holder.',
    tip: 'O fencing token é o detalhe de sênior. Sem ele, instância com GC pause longa acorda com lease expirado mas ainda executa — two active holders simultâneos. Mencionar isso demonstra experiência real com distributed systems.',
  },
  {
    level: 'Senior',
    q: 'Por que Raft é chamado de algoritmo de consenso e não apenas replicação?',
    a: 'Replicação garante dados em múltiplos nós mas não garante que todos veem a mesma sequência. Primary-backup permite que primary falhe após replicar para alguns followers — estados divergentes. Consenso é mais forte: todos os nós não-falhos concordam em uma única sequência de operações. Raft garante: <strong>Safety</strong> (nunca dois nós commitam valores diferentes para o mesmo índice), <strong>Liveness</strong> (se maioria viva, cluster progride), <strong>Leader Completeness</strong> (entradas commitadas nunca perdidas).',
    tip: 'Safety vs liveness é o cerne da prova formal. Safety é nunca fazer algo errado; liveness é eventualmente fazer algo certo. Raft garante ambos quando maioria de nós é correta e conectada.',
  },
  {
    level: 'Senior',
    q: 'Como você desenharia o etcd para múltiplas regiões globais?',
    a: 'Problema: Raft com 5 nós em 3 regiões tem latência de commit = RTT inter-region = 80–200ms — inaceitável. Opções: <strong>Regional clusters separados</strong>: cada região com cluster etcd de 3 nós. Replicação assíncrona entre regiões. Eventual consistency para configurações não-críticas. <strong>Hierarchical</strong>: dados globais em cluster global Paxos, dados regionais em clusters Raft locais. Conclusão: strong consistency global com baixa latência é impossível (CAP theorem).',
    tip: 'A conclusão do CAP theorem (impossibilidade de strong consistency global com baixa latência) é o insight fundamental. Regional clusters com replicação assíncrona é a abordagem usada em produção.',
  },
  {
    level: 'Pleno',
    q: 'Como Paxos funciona? Descreva as duas fases.',
    a: '<strong>Fase 1 — Prepare/Promise</strong>: Proposer envia Prepare(N) para acceptors. Acceptors respondem Promise(N) se não prometeram para número maior. Promise contém: "não aceitarei proposta menor que N" + qualquer valor já aceito. <strong>Fase 2 — Accept/Accepted</strong>: Proposer envia Accept(N, valor) para acceptors que prometeram. Valor = o valor já aceito de maior número (se algum), ou qualquer valor se nenhum aceito ainda. Acceptors aceitam se não prometeram para número maior e notificam learners.',
    tip: 'A regra de que o valor proposto deve ser o de maior número já aceito (fase 1) é o que garante que Paxos não pode sobrescrever decisões anteriores. É a Safety do protocolo.',
  },
]

// ── Dados: Mind Map ────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Raft',
    color: C,
    items: [
      { t: 'Leader election — terms', k: true },
      { t: 'Log replication — quorum', k: true },
      { t: 'Safety — term monotônico', k: true },
      { t: 'Snapshot — compactação de log', k: true },
      { t: 'Membership — one-at-a-time', a: true },
    ],
  },
  {
    label: 'Paxos',
    color: '#f59e0b',
    items: [
      { t: 'Single-Decree — uma decisão', k: true },
      { t: 'Prepare → Promise (fase 1)', k: true },
      { t: 'Accept → Accepted (fase 2)', k: true },
      { t: 'Multi-Paxos — pula fase 1', a: true },
      { t: 'Spanner usa Paxos por datacenter', a: true },
    ],
  },
  {
    label: 'Quorum',
    color: '#10b981',
    items: [
      { t: '2f+1 nós → tolera f falhas', k: true },
      { t: '3 nós → f=1 (sweet spot)', k: true },
      { t: '5 nós → f=2 (multi-AZ)', k: true },
      { t: 'Cluster par → evitar', k: true },
      { t: 'Interseção garante unicidade', k: true },
    ],
  },
  {
    label: 'Leitura Consistente',
    color: '#a855f7',
    items: [
      { t: 'Read index — 1 RTT extra', k: true },
      { t: 'Lease read — sem RTT', k: true },
      { t: 'Stale read — eventual', k: true },
      { t: 'Linearizabilidade: read index', a: true },
      { t: 'etcd: linearizable vs serializable', a: true },
    ],
  },
  {
    label: 'Problemas',
    color: '#ef4444',
    items: [
      { t: 'Stale reads — leader isolado', k: true },
      { t: 'Log ilimitado — usar snapshot', k: true },
      { t: 'Latência cross-region', k: true },
      { t: 'Writes não escalam (leader)', k: true },
      { t: 'Cluster par = split-brain', k: true },
    ],
  },
  {
    label: 'Implementações',
    color: '#38bdf8',
    items: [
      { t: 'etcd — Kubernetes (Raft em Go)', k: true },
      { t: 'CockroachDB — SQL distribuído', k: true },
      { t: 'Consul — service discovery', k: true },
      { t: 'KRaft — Kafka sem ZooKeeper', a: true },
      { t: 'Spanner — Paxos + TrueTime', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Consigo calcular quorum e tolerância para qualquer N (fórmula 2f+1)?',
  'Sei explicar por que cluster par é problemático (split-brain 2×2)?',
  'Consigo descrever leader election do Raft com a regra de log comparison?',
  'Sei o fluxo de log replication: AppendEntries → quorum → commit → apply?',
  'Entendo a diferença entre read index e lease read para linearizabilidade?',
  'Sei as duas fases do Paxos (Prepare/Promise, Accept/Accepted)?',
  'Consigo explicar por que Multi-Paxos é difícil de implementar corretamente?',
  'Sei quando NÃO usar Raft (geo-distribuído, eventual consistency)?',
  'Conheço etcd como backend do Kubernetes e suas opções de leitura?',
  'Entendo o fencing token em distributed locks para prevenir split-brain?',
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Quorum: "2f+1 tolera f" — calcule sempre assim',
    trick: '2F+1',
    expansion: [
      ['f', 'Número de falhas toleradas'],
      ['2f+1', 'Tamanho mínimo do cluster'],
      ['⌊N/2⌋+1', 'Tamanho do quorum'],
      ['3 nós', 'f=1, quorum=2'],
      ['5 nós', 'f=2, quorum=3'],
    ],
    explanation: 'A fórmula garante que após f falhas, ainda sobra f+1 nós — a maioria. Nunca use cluster par: 4 nós têm mesmo f=1 que 3, com risco de split-brain 2×2.',
    example: '5 nós em 3 AZs: AZ1=2, AZ2=2, AZ3=1. Se AZ1 cai: 3/5 nós vivos = quorum. Cluster continua.',
    why: 'Entrevistadores perguntam "por que 3 nós e não 2?" — 2f+1 é a resposta instantânea.',
  },
  {
    label: 'Raft: "ELSE" — Election, Log, Safety, re-Election',
    trick: 'E-L-S-E',
    expansion: [
      ['E', 'Election: leader por term via votação'],
      ['L', 'Log: replication para followers com AppendEntries'],
      ['S', 'Safety: term monotônico invalida leaders antigos'],
      ['E', 're-Election: se leader cai, processo recomeça'],
    ],
    explanation: 'Raft decompõe consenso em sub-problemas isolados. Cada letra é um sub-problema com suas próprias regras e provas de corretude.',
    example: 'Leader de Term 3 cai → Term 4 election → novo leader eleito → L: replica log → S: term 3 leader vira follower ao ver term 4',
    why: 'ELSE dá estrutura para explicar Raft em qualquer entrevista sem travar na ordem dos componentes.',
  },
  {
    label: 'Paxos duas fases: "PP-AA" (Prepare Promise, Accept Accepted)',
    trick: 'PP-AA',
    expansion: [
      ['PP', 'Prepare → Promise: proposer pede promises, acceptors comprometem-se'],
      ['AA', 'Accept → Accepted: proposer propõe valor, acceptors aceitam'],
      ['Multi', 'Multi-Paxos pula PP quando há leader estável'],
      ['1 RTT', 'Multi-Paxos: apenas AA por decisão após estabilizar'],
    ],
    explanation: 'Paxos básico precisa de 2 RTTs por decisão (PP + AA). Multi-Paxos otimiza pulando PP quando o proposer está estabelecido.',
    example: 'Single-Decree: PP (1 RTT) + AA (1 RTT) = 2 RTTs. Multi-Paxos leader estável: apenas AA = 1 RTT — igual ao Raft.',
    why: 'PP-AA é o mnemônico mais denso: captura as fases, a ordem e por que Multi-Paxos é mais eficiente.',
  },
  {
    label: 'Reads linearizáveis: "Índice antes, Lease durante, Stale arriscado"',
    trick: 'I-L-S',
    expansion: [
      ['I = Read Index', 'Confirma com quorum antes de servir — 1 RTT extra, correto'],
      ['L = Lease Read', 'Lease válido garante que ainda é líder — sem RTT, requer clock'],
      ['S = Stale Read', 'Lê estado local sem verificação — pode retornar dados antigos'],
    ],
    explanation: 'I é o mais seguro (1 RTT extra). L é o mais rápido (sem RTT extra, mas depende de clock sync). S é eventual consistency — sem garantia de linearizabilidade.',
    example: 'etcd: Get() = I (read index). Get(WithSerializable()) = S. Lease usado para otimização interna.',
    why: 'Candidatos que confundem reads linearizáveis com stale reads no etcd não conhecem o sistema em profundidade.',
  },
  {
    label: 'Raft vs Paxos: "Raft é Rigoroso, Paxos é Poderoso"',
    trick: 'R=R, P=P',
    expansion: [
      ['R = Rigoroso', 'Raft especifica tudo: snapshot, membership, log compaction'],
      ['P = Poderoso', 'Paxos é mais flexível e expressivo (Spanner usa por datacenter)'],
      ['R vence', 'Para implementação: Raft é mais fácil de fazer corretamente'],
      ['P vence', 'Para geo-distribuído com TrueTime: Paxos com mais flexibilidade'],
    ],
    explanation: 'Raft é a escolha padrão para novas implementações. Paxos é usado onde flexibilidade supera complexidade (Google Spanner, Chubby).',
    example: 'etcd, CockroachDB, KRaft → Raft. Google Spanner, Chubby → Paxos.',
    why: 'R=R/P=P ajuda a lembrar o contexto de uso de cada um sem confundir as propriedades.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Raft / Paxos',
    stackLabel: 'CS · Sistemas Distribuídos',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Raft / Paxos',
    stackLabel: 'CS · Sistemas Distribuídos',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de uma entrevista de system design sênior.',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Raft / Paxos',
    stackLabel: 'CS · Sistemas Distribuídos',
  }),
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function RaftPaxosPdfs() {
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
