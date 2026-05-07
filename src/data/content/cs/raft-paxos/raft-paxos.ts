import type { SkillContent } from '@/types'

const raftPaxos: SkillContent = {
  tagline: 'Algoritmos de consenso distribuído: como N nós concordam num valor mesmo com falhas.',
  why: 'Base de etcd, Consul, CockroachDB, MongoDB. Em entrevistas de system design, mostrar que você entende quorum, log replication e leader election é diferencial de sênior. É a fundação de todo sistema com strong consistency.',
  summary: 'Consenso distribuído garante que N nós concordam em sequência de operações mesmo com falha de minoria. Paxos é o clássico (Lamport, 1989), notoriamente difícil de entender e implementar. Raft (Stanford 2014) foi desenhado para ser compreensível — leader election + log replication com safety prouvada. Quorum (maioria) é a chave: com 2f+1 nós tolera f falhas. Usado em qualquer banco distribuído moderno com strong consistency.',
  keypoints: [
    { title: 'Quorum', body: 'Maioria simples (mais que metade). Com 2f+1 nós tolera f falhas. 3 nós → tolera 1; 5 → tolera 2. Toda decisão precisa do quorum concordar. Qualquer dois quorums se intersectam em pelo menos um nó.' },
    { title: 'Raft — leader election', body: 'Um nó é leader por term. Recebe writes, replica para followers. Se leader cai, followers iniciam eleição — votam em quem tem log mais atualizado (maior lastLogTerm, depois maior lastLogIndex).' },
    { title: 'Raft — log replication', body: 'Leader appenda ao log, replica AppendEntries para followers, commita apenas quando maioria confirmou. Followers aplicam entradas em ordem. Log é a fonte de verdade.' },
    { title: 'Raft — safety', body: 'Term number monotônico. Eleição com term maior invalida leader antigo. Garante que só um leader por term. Leader commitment rule: leader só commita entradas do seu term (não de terms anteriores diretamente).' },
    { title: 'Raft — snapshot', body: 'Log pode crescer indefinidamente. Snapshot compacta estado aplicado até um index. Log entries anteriores ao snapshot são descartados. Recovery usa snapshot + log posterior.' },
    { title: 'Paxos básico', body: 'Roles: proposer, acceptor, learner. Duas fases: Prepare (proposer pede promise de acceptors — nenhum valor menor que N) → Accept (propõe valor, acceptors aceitam se não prometeram para número maior). Multi-Paxos otimiza com leader para múltiplas rodadas.' },
    { title: 'Raft vs Paxos', body: 'Raft é mais fácil de entender e implementar — decomposição de problemas (leader election, log replication, membership) facilita implementação correta. Paxos é mais flexível mas notoriamente difícil. Em prática, todo mundo usa Raft.' },
    { title: 'Implementações', body: 'etcd (Raft em Go — usado pelo Kubernetes), Consul, CockroachDB, TiKV, etcd raft library. MongoDB usa Raft desde 3.2 (proprietário). Spanner usa Paxos por datacenter.' },
    { title: 'Limitações', body: 'Quorum exige maioria viva — em partição de rede, lado minoritário não opera. Latência ≥ 1 RTT para maioria. Writes não escalam linearmente — passar pelo leader é gargalo. Não é substituto para replicação de leitura.' },
  ],
  gotchas: [
    'Achar que 2 nós é tolerante a falhas — 2 nós precisam de quorum 2 (ambos), não tolera nenhuma falha.',
    'Cluster par (4, 6 nós) — mesma tolerância que o impar menor, com custo maior. Sempre use 3, 5, 7.',
    'Esquecer que leader pode ficar isolado e ainda achar que é leader (stale reads sem lease ou read index).',
    'Confiar só em Raft sem snapshot — log cresce indefinido, recovery fica lento em TBs.',
    'Comparar latência de write entre Raft (consenso) e single primary — Raft sempre paga 1 RTT extra para commit.',
    'Implementar Raft do zero — é fácil errar edge cases (leader completeness, election safety). Use lib (hashicorp/raft, etcd/raft).',
    'Achar que Raft garante eventual consistency — Raft é strong consistency (linearizável se leitura via read index).',
    'Split-brain em cluster de 2 nós: ambos ficam em standby ou ambos viram leader dependendo da implementação.',
  ],
  interview: [
    {
      level: 'pleno',
      q: 'O que é quorum e por que ele é a base do consenso distribuído?',
      a: '<p>Quorum é a maioria simples (mais que metade). Com 2f+1 nós, tolera f falhas: após f nós falharem, ainda sobra uma maioria de f+1 que pode tomar decisões.</p><p>A propriedade fundamental: <strong>qualquer dois quorums se intersectam em pelo menos um nó</strong>. Isso garante que duas decisões diferentes não podem ser tomadas em "lados" do cluster sem que pelo menos um nó tenha visto ambas — esse nó pode rejeitar a segunda decisão conflitante.</p><p>Números práticos: 3 nós → tolera 1 falha. 5 nós → tolera 2. 7 nós → tolera 3. Sweet spot: 3 ou 5 para a maioria dos casos.</p>',
      tip: 'A propriedade de interseção de quorums é o insight central — explique ela. Candidatos que só dizem "maioria" não demonstram entender por que funciona.',
    },
    {
      level: 'pleno',
      q: 'Explique Raft: como funciona leader election?',
      a: '<p>Raft usa <strong>terms</strong> — períodos lógicos numerados monotonicamente. Cada term começa com uma eleição.</p><p>Processo: follower fica sem heartbeat do leader por <code>electionTimeout</code> (150-300ms, aleatório) → vira candidate → incrementa term → vota em si mesmo → solicita votos aos outros nós.</p><p>Regras de voto: um nó vota em um candidate apenas se: (1) ainda não votou neste term, (2) o log do candidate é pelo menos tão atualizado quanto o próprio (lastLogTerm ≥ sender, ou igual e lastLogIndex ≥ sender).</p><p>Candidate que recebe maioria dos votos vira leader. Se empate: novo timeout aleatório e nova eleição no próximo term.</p>',
      tip: 'Detalhe a regra de log comparison (lastLogTerm depois lastLogIndex). Essa é a regra que garante Leader Completeness — somente candidatos com o log mais atualizado ganham eleição.',
    },
    {
      level: 'pleno',
      q: 'Como funciona log replication no Raft?',
      a: '<p>Fluxo: cliente envia write ao leader → leader appenda entry ao log local (com term atual) → replica <code>AppendEntries</code> RPC para todos os followers em paralelo → aguarda confirmação da maioria → commita a entry → responde ao cliente → notifica followers do commit no próximo heartbeat.</p><p>Followers: ao receber <code>AppendEntries</code>, verificam <strong>consistência do log</strong> (prevLogIndex e prevLogTerm batem?) → se sim, appendam → retornam sucesso. Se não batem, retornam falha e o leader decremente nextIndex para encontrar o ponto de divergência.</p><p>Após commit, o estado é aplicado na state machine. A ordem é sempre preservada.</p>',
      tip: 'Mencione a verificação de consistência de log (prevLogIndex/prevLogTerm). Ela é o mecanismo que garante que followers não aceitam entries fora de ordem ou de um leader antigo.',
    },
    {
      level: 'senior',
      q: 'O que acontece quando a partição de rede isola o leader do Raft?',
      a: '<p>Leader isolado (lado minoritário): não consegue replicar para maioria → não consegue commitar novas entries. Fica retentando indefinidamente, mas sem sucesso.</p><p>Lado majoritário: após electionTimeout, um follower inicia eleição com term maior. Elege novo leader. Começa a commitar novas entries.</p><p>Quando partição cura: leader antigo recebe AppendEntries ou RequestVote com term maior → reconhece term maior → reverte para follower. Suas entradas não-commitadas (que nunca tiveram maioria) são sobrescritas pelo log do novo leader.</p><p>Risco de reads stale no leader antigo: solução é <strong>read index</strong> (pergunta maioria antes de ler) ou <strong>lease</strong> (líder renova lease com followers — sem heartbeat, não serve reads).</p>',
      tip: 'O detalhe de reads stale é o que diferencia sênior. Um leader isolado pode servir reads desatualizados por toda a duração do electionTimeout. Lease e read index são as duas soluções — mencione ambas.',
    },
    {
      level: 'pleno',
      q: 'Por que clusters Raft devem ter número ímpar de nós?',
      a: '<p>4 nós precisam de quorum 3 (mesmo que 5 nós). Você paga overhead de replicar para um nó extra sem ganhar tolerância a falhas. Pior: com 4 nós, uma partição 2x2 é perfeitamente possível — cada lado acha que pode ser leader, mas nenhum tem quorum. <strong>Split-brain potencial</strong>.</p><p>3 nós tolera 1 falha. 5 nós tolera 2. 7 nós tolera 3. Em termos de custo-benefício: 3 nós para a maioria dos casos, 5 nós quando 2 falhas simultâneas são um risco real (multi-datacenter), 7 nós é raro.</p>',
      tip: 'Explique que o problema do cluster par não é só desperdício — é o split-brain. Uma partição 2x2 em 4 nós impede que qualquer lado tenha quorum, deixando o cluster completamente parado.',
    },
    {
      level: 'senior',
      q: 'Como Raft lida com reads para garantir linearizabilidade?',
      a: '<p>Read naïve do estado local do leader: pode retornar dados stale se o leader ficou isolado sem saber.</p><p><strong>Read Index</strong>: antes de servir uma read, o leader registra seu commit index atual (readIndex), confirma com a maioria que ainda é o leader via heartbeat, e só serve a read quando o estado aplicado alcança readIndex. Custo: 1 RTT por read.</p><p><strong>Lease Read</strong>: leader mantém lease — garantia de que não há outro leader por um período (baseado em tempo de clock). Durante o lease, pode servir reads sem RTT extra. Requisito: clocks sincronizados (NTP, PTP). Risco: clock drift pode quebrar garantia.</p><p>etcd usa lease read por padrão, com read index como fallback seguro.</p>',
      tip: 'Lease vs read index é a pergunta de sênior. Lease é mais rápido (sem RTT), mas depende de sincronização de clock — em ambientes com clock drift alto, read index é mais seguro.',
    },
    {
      level: 'senior',
      q: 'Quais são as diferenças fundamentais entre Raft e Paxos?',
      a: '<p><strong>Decomposição</strong>: Raft decompõe consenso em sub-problemas separados (leader election, log replication, membership changes). Paxos original resolve uma única instância de consenso — Multi-Paxos é uma extensão informal e difusa.</p><p><strong>Leader</strong>: Raft tem leader forte com log autoritativo. Paxos tem proposer que pode mudar — qualquer acceptor pode tornar-se proposer, levando a conflitos de proposta.</p><p><strong>Compreensibilidade</strong>: Raft foi projetado explicitamente para ser ensinável. O paper de Raft inclui estudos de usuários mostrando que estudantes entendem Raft mais rápido que Paxos.</p><p><strong>Implementação</strong>: Raft especifica todos os detalhes (snapshot, membership change, log compaction). Paxos deixa detalhes de implementação abertos — cada implementação faz escolhas diferentes.</p>',
      tip: 'A decomposição em sub-problemas é o insight de design do Raft. Paxos é mais expressivo e flexível (Spanner usa), mas a falta de especificação detalhada leva a implementações divergentes com bugs sutis.',
    },
    {
      level: 'senior',
      q: 'Como Raft garante que o leader não perde entradas commitadas?',
      a: '<p>Propriedade: <strong>Leader Completeness</strong> — se uma entry foi commitada em um term, ela estará presente no log de qualquer future leader.</p><p>Mecanismo: a regra de votação garante que um candidato só ganha eleição se seu log é pelo menos tão atualizado quanto a maioria dos votantes. Como uma entry commitada foi replicada para maioria, qualquer quorum de votantes incluirá pelo menos um nó com essa entry. Esse nó não votará em candidato com log mais antigo.</p><p>Uma sutileza: <strong>leader não pode commitar entradas de terms anteriores</strong> diretamente — apenas commitando uma entry do term atual (que alcançou maioria), as entries anteriores são implicitamente commitadas pelo Log Matching Property.</p>',
      tip: 'A regra de que leader só commita entradas do term atual (não de terms anteriores diretamente) é o edge case mais difícil do Raft. Poucos candidatos sabem isso — mencioná-lo demonstra leitura profunda do paper.',
    },
    {
      level: 'pleno',
      q: 'Como funciona snapshot no Raft e por que é necessário?',
      a: '<p>Problema: log cresce indefinidamente. Após meses em produção, um nó que precisa de recovery teria que aplicar milhões de entries — isso é impraticável.</p><p>Solução: snapshot. Periodicamente, o nó serializa o estado atual da state machine e anota o <code>lastIncludedIndex</code> e <code>lastIncludedTerm</code>. Entries de log anteriores ao snapshot são descartadas.</p><p>Recovery: nó carrega snapshot → aplica apenas entries de log posteriores ao snapshot.</p><p><code>InstallSnapshot</code> RPC: se um nó está muito atrasado (precisa de entries que o leader já descartou), o leader envia o snapshot completo. Após receber, o follower descarta seu log e inicia do snapshot.</p>',
      tip: 'InstallSnapshot é o mecanismo que permite onboarding de nós novos ou recovery de nós que ficaram muito atrasados. Sem ele, um nó novo teria que receber todo o histórico do log desde o início.',
    },
    {
      level: 'senior',
      q: 'Como Raft gerencia mudanças de membership (adicionar/remover nós)?',
      a: '<p>Problema difícil: durante transição de 3 para 5 nós, há risco de dois leaders simultâneos — quorum de 3 nós e quorum de 5 nós podem não se intersectar.</p><p><strong>One server at a time</strong> (abordagem simples): adicionar ou remover um servidor por vez. Garante que o quorum antigo e o novo sempre se intersectam. Mais conservador mas mais seguro.</p><p><strong>Joint consensus</strong> (abordagem do paper original): fase de transição onde ambas as configurações (Cₒₗd e Cₙₑw) precisam de quorum separado. Mais complexo mas permite mudanças em lote.</p><p>etcd usa a abordagem de one-server-at-a-time por ser mais simples de implementar corretamente.</p>',
      tip: 'Membership change é o tópico mais avançado do Raft. Candidatos que conhecem joint consensus e one-server-at-a-time demonstram leitura profunda. Mencione que a maioria das implementações usa one-server-at-a-time por segurança.',
    },
    {
      level: 'senior',
      q: 'Como o etcd usa Raft internamente?',
      a: '<p>etcd é o banco de configuração do Kubernetes — armazena todos os objetos do cluster (pods, services, deployments). Disponibilidade é crítica.</p><p>Implementação: usa a biblioteca <code>etcd/raft</code> em Go. Cluster típico: 3 ou 5 nós. Leader atende todas as writes e reads (com lease ou read index).</p><p>Operações: writes são propostas de log entries. Reads via linearizable read (read index por padrão) ou serializable read (pode ser stale, mais rápido).</p><p>watch: etcd mantém revision number — cada write incrementa. Clients podem watch a partir de uma revision específica, recebendo todos os eventos desde então. Raft garante que a sequência de eventos é consistente.</p><p>Defragmentation: compacta snapshots e log periodicamente. Necessário — logs não compactados degradam performance.</p>',
      tip: 'A separação entre linearizable read (read index) e serializable read (do estado local) no etcd é um detalhe de produção importante. Kubectl get pods usa serializable read por padrão — pode retornar estado ligeiramente stale.',
    },
    {
      level: 'senior',
      q: 'Quando você NÃO usaria Raft/consenso?',
      a: '<p><strong>Sistemas com eventual consistency</strong>: Cassandra, DynamoDB — usam quorum por operação mas sem consenso global. Muito mais rápido para writes, aceita divergência temporária.</p><p><strong>Write-heavy single primary</strong>: se não precisa de HA automática e writes são muito intensas, single primary com replicação assíncrona tem latência menor (sem esperar quorum).</p><p><strong>Geo-distribuído</strong>: Raft paga 1 RTT por commit para maioria. Entre datacenters, RTT é 50-200ms. Escrita no Raft inter-datacenter seria insuportavelmente lenta. Spanner usa Paxos com GPS clock para sincronização.</p><p><strong>Analytics/OLAP</strong>: bancos analíticos geralmente preferem throughput e latência de leitura — replicação eventual é suficiente.</p>',
      tip: 'A resposta de sênior começa pelos casos onde Raft é errado. Candidatos que propõem Raft para tudo não entendem os trade-offs de custo de latência de consenso.',
    },
    {
      level: 'pleno',
      q: 'Como você configuraria um cluster etcd para produção?',
      a: '<p>Tamanho: 3 nós para maioria dos casos, 5 nós para tolerância a 2 falhas simultâneas (multi-AZ com 1 AZ por nó). Nunca 2 ou 4.</p><p>Hardware: SSD é requisito — etcd é I/O bound (WAL). Latência de fsync impacta diretamente latência de writes. Dedicar hardware separado ao etcd do Kubernetes — competição com pods mata latência.</p><p>Rede: baixa latência entre nós do etcd. Electiontimeout padrão 1s, heartbeat 100ms. RTT entre nós deve ser &lt; 10ms para estabilidade.</p><p>Backup: snapshot regularmente (etcdctl snapshot save). Testar restore! Muitas equipes fazem backup mas nunca testam restore.</p><p>Compaction: configurar auto-compaction para não deixar o etcd crescer indefinidamente.</p>',
      tip: 'SSD é requisito não-negociável para etcd — mencione isso. E o teste de restore de backup: muitas equipes têm backup mas descobrem que não funciona só quando precisam.',
    },
    {
      level: 'senior',
      q: 'O que é Multi-Paxos e como ele difere do Paxos básico?',
      a: '<p>Paxos básico (Single-Decree Paxos): consenso para uma única decisão — um único valor. Duas fases por rodada: Prepare (phase 1) + Accept (phase 2). Para log replication, precisaria de uma instância Paxos por entrada de log — custo imenso.</p><p>Multi-Paxos: otimização para sequência de decisões. Quando um proposer (leader) está estabelecido, pode pular a fase 1 (Prepare) para rodadas subsequentes — apenas fase 2 por decisão. Reduz latência de 2 RTT para 1 RTT por entry.</p><p>Problema: Multi-Paxos não é especificado formalmente no paper original de Lamport (que só especifica Single-Decree). Cada implementação (Chubby do Google, Spanner, Zab do ZooKeeper) tomou decisões diferentes para os detalhes não especificados — liderança, reconfiguration, log compaction.</p>',
      tip: 'A ausência de especificação formal do Multi-Paxos é o argumento principal do paper do Raft para justificar a criação de um novo algoritmo. Mencionar isso demonstra leitura profunda.',
    },
    {
      level: 'senior',
      q: 'Como o Google Spanner usa Paxos e o que é TrueTime?',
      a: '<p>Spanner: banco globalmente distribuído do Google. Cada "shard" (Paxos group) tem um cluster Paxos replicado em 5+ datacenters. Transações globais usam 2PC entre grupos Paxos.</p><p><strong>TrueTime</strong>: API de tempo do Google que retorna um intervalo [earliest, latest] garantindo que o tempo real está dentro do intervalo. Implementado com GPS receivers e atomic clocks em cada datacenter. Incerteza típica: 1-7ms.</p><p>Usada para External Consistency (serializabilidade externa): o servidor aguarda o intervalo de incerteza antes de commitar uma transação, garantindo que o commit timestamp está no passado de qualquer transação futura. Isso permite que clientes globalmente distribuídos vejam uma ordem consistente sem comunicação entre eles.</p>',
      tip: 'TrueTime é o mecanismo mais sofisticado de sistemas distribuídos em produção. Não é necessário para o Raft básico, mas demonstra conhecimento profundo do estado da arte em consensus/distributed transactions.',
    },
    {
      level: 'pleno',
      q: 'Como você monitoraria um cluster Raft em produção?',
      a: '<p>Métricas essenciais:</p><ul><li><strong>Leader changes</strong>: eleições frequentes = instabilidade de rede ou nó sobrecarregado</li><li><strong>Commit latency p99</strong>: impacta diretamente latência de writes da aplicação</li><li><strong>Log apply lag</strong>: followers atrasados podem virar gargalo em eleição</li><li><strong>Snapshot size</strong>: crescimento indica estado acumulado; pode impactar recovery</li><li><strong>Failed proposals</strong>: writes rejeitados por perda de liderança</li></ul><p>Alertas: &gt; 2 eleições/hora → investigar instabilidade. Commit p99 &gt; 500ms → verificar rede ou hardware. Follower lag &gt; 10k entries → risco de recovery lento.</p>',
      tip: 'Leader changes como indicador de instabilidade é o mais importante. Um cluster saudável deve ter eleições rarissimamente (apenas quando nó cai ou se reinicia). Eleições frequentes são sinal de problema.',
    },
    {
      level: 'senior',
      q: 'Qual a diferença entre Raft e ZooKeeper/ZAB?',
      a: '<p>ZAB (ZooKeeper Atomic Broadcast) e Raft são ambos algoritmos de consenso baseados em leader, mas com diferenças:</p><p><strong>Ordered broadcast vs log replication</strong>: ZAB é formalmente um protocolo de broadcast atômico — garante que todas as réplicas recebem e aplicam mensagens na mesma ordem. Raft formula como log replication — semanticamente equivalente mas perspectiva diferente.</p><p><strong>Recovery</strong>: ZAB tem fase de sincronização explícita após eleição onde o novo leader sincroniza seu estado com os followers antes de aceitar novos writes. Raft faz isso via AppendEntries incremental sem fase separada.</p><p><strong>Maturidade</strong>: ZooKeeper + ZAB é mais antigo (2007) e amplamente usado (Kafka coordination até v2.8). etcd + Raft é mais novo (2013) e tornou-se o padrão no ecossistema Kubernetes.</p>',
      tip: 'A distinção ZAB vs Raft demonstra breadth de conhecimento. Kafka migrou de ZooKeeper para KRaft (Kafka com Raft próprio) no Kafka 3.x — mencionar essa migração é ótimo exemplo de evolução do ecossistema.',
    },
    {
      level: 'pleno',
      q: 'Como você implementaria o pattern leader com Raft para um serviço de locks distribuídos?',
      a: '<p>Caso de uso: apenas uma instância de um serviço deve executar uma tarefa crítica por vez (processador de pagamentos, cron crítico).</p><p>Usando etcd: usar <code>concurrency.NewMutex</code> ou <code>concurrency.NewElection</code>. Election usa leases etcd com TTL.</p><p>Fluxo: instância candidata tenta criar lease no etcd → se consegue, é a líder → processa tarefa → renova lease periodicamente. Se instância morre, lease expira após TTL → outra instância vence eleição.</p><p>Cuidados: TTL curto (5s) = handover rápido mas mais heartbeats. TTL longo (30s) = menos overhead mas instância morta bloqueia por mais tempo. Risco de split-brain: instância "morta" ainda processa enquanto lease expira — use fencing token (versão do lock) para tornar operações idempotentes.</p>',
      tip: 'O fencing token é o detalhe de sênior. Sem ele, uma instância com GC pause longa pode acordar com o lease expirado mas ainda executar — duas instâncias executam simultaneamente. O fencing token garante que o banco/serviço downstream rejeite operações com token antigo.',
    },
    {
      level: 'senior',
      q: 'Explique por que RAFT é chamado de algoritmo de consenso e não apenas replicação.',
      a: '<p>Replicação garante que dados estão em múltiplos nós, mas não garante que todos veem os mesmos dados na mesma ordem. Primary-backup replication permite que o primary falhe depois de replicar para alguns followers mas não todos — diferentes followers têm estados diferentes.</p><p>Consenso é mais forte: garante que todos os nós não-falhos concordam em uma única sequência de operações, mesmo com falhas de nós durante o processo. Raft garante:</p><ul><li><strong>Safety</strong>: nunca dois nós commitam valores diferentes para o mesmo índice</li><li><strong>Liveness</strong>: se maioria de nós está viva e se comunicando, o cluster progride</li><li><strong>Leader completeness</strong>: entradas commitadas nunca são perdidas</li></ul><p>Isso permite que a state machine em cada nó seja determinística — dado o mesmo log, chegam ao mesmo estado.</p>',
      tip: 'A distinção safety vs liveness é o cerne da prova formal de corretude do Raft. Safety é nunca fazer algo errado; liveness é eventualmente fazer algo certo. Raft garante ambos (quando maioria de nós é correta e conectada).',
    },
    {
      level: 'senior',
      q: 'Como você desenharia o sharding de um sistema de configuração como Consul/etcd para múltiplas regiões?',
      a: '<p>Problema: Raft com 5 nós em 3 regiões (US, EU, APAC) tem latência de commit = RTT US↔EU ou US↔APAC = 80-150ms. Inaceitável para sistemas que fazem muitas escritas de configuração.</p><p>Opções:</p><p><strong>Regional clusters separados</strong>: cada região tem seu etcd cluster (3 nós). Dados replicados assincronamente entre regiões (ex: etcd mirror controller). Writes vão ao cluster local. Eventual consistency entre regiões para configurações não-críticas.</p><p><strong>Hierarchical consensus</strong>: Spanner-like — shard por tipo de dado. Dados globais (políticas de autenticação) em cluster global Paxos. Dados regionais (configurações de serviço) em clusters regionais Raft.</p><p><strong>CRDTs para configuração</strong>: configurações que podem ser mescladas (feature flags, rate limits por região) usam CRDTs — sem consenso, convergência automática.</p>',
      tip: 'Regional clusters com replicação assíncrona é a abordagem usada pelo etcd em produção em empresas globais. Mencionar que não se pode ter strong consistency global com baixa latência (CAP theorem) é o insight fundamental.',
    },
  ],
  diagrams: [
    {
      title: 'Raft — Leader Election e Log Replication',
      html: `<style>
.rp-main { font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; }
.rp-title { font-size: 13px; font-weight: 700; color: #6366f1; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
.rp-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.rp-section { background: #1e293b; border-radius: 8px; padding: 14px; }
.rp-sec-title { font-size: 11px; font-weight: 700; color: #6366f1; margin-bottom: 10px; text-transform: uppercase; letter-spacing: .04em; }
.rp-node { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.rp-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
.rp-node-info { font-size: 10px; color: #94a3b8; line-height: 1.4; }
.rp-leader { background: #6366f1; color: white; }
.rp-follower { background: #334155; color: #94a3b8; border: 1px solid #475569; }
.rp-candidate { background: #f59e0b; color: #1a1200; }
.rp-arrow { text-align: center; font-size: 18px; color: #6366f1; margin: 6px 0; }
.rp-log { background: #0f172a; border-radius: 4px; padding: 8px; margin-top: 8px; }
.rp-log-row { display: flex; gap: 2px; margin-bottom: 2px; }
.rp-log-cell { width: 24px; height: 20px; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 600; color: white; }
.rp-log-label { font-size: 9px; color: #64748b; width: 50px; line-height: 20px; }
.rp-commit-line { border-left: 2px dashed #4ade80; padding-left: 6px; font-size: 9px; color: #4ade80; margin-top: 4px; }
</style>
<div class="rp-main">
  <div class="rp-title">Raft — Eleição e Replicação de Log</div>
  <div class="rp-cols">
    <div class="rp-section">
      <div class="rp-sec-title">Leader Election</div>
      <div class="rp-node">
        <div class="rp-circle rp-leader">L</div>
        <div class="rp-node-info"><strong style="color:#e2e8f0">Leader (Term 3)</strong><br/>Recebe writes, envia heartbeats</div>
      </div>
      <div class="rp-node">
        <div class="rp-circle rp-follower">F</div>
        <div class="rp-node-info">Follower: aceita AppendEntries do leader</div>
      </div>
      <div class="rp-node">
        <div class="rp-circle rp-follower">F</div>
        <div class="rp-node-info">Follower: sem heartbeat → electionTimeout</div>
      </div>
      <div style="margin-top:10px;padding:8px;background:#0f172a;border-radius:4px;border-left:3px solid #f59e0b">
        <div style="font-size:10px;color:#f59e0b;font-weight:700;margin-bottom:4px">Eleição (se leader cai)</div>
        <div class="rp-node" style="margin-bottom:4px">
          <div class="rp-circle rp-candidate" style="width:24px;height:24px;font-size:9px">C</div>
          <div style="font-size:10px;color:#94a3b8">Candidate: Term 4, vota em si mesmo</div>
        </div>
        <div style="font-size:9px;color:#94a3b8">→ Solicita votos aos outros followers<br/>→ Maioria → vira Leader(Term 4)<br/>→ Começa a enviar heartbeats</div>
      </div>
    </div>
    <div class="rp-section">
      <div class="rp-sec-title">Log Replication</div>
      <div class="rp-log">
        <div class="rp-log-row">
          <div class="rp-log-label">Leader</div>
          <div class="rp-log-cell" style="background:#3b82f6">1</div>
          <div class="rp-log-cell" style="background:#3b82f6">2</div>
          <div class="rp-log-cell" style="background:#3b82f6">3</div>
          <div class="rp-log-cell" style="background:#6366f1">4</div>
          <div class="rp-log-cell" style="background:#475569;opacity:.5">5?</div>
        </div>
        <div class="rp-log-row">
          <div class="rp-log-label">Follower A</div>
          <div class="rp-log-cell" style="background:#3b82f6">1</div>
          <div class="rp-log-cell" style="background:#3b82f6">2</div>
          <div class="rp-log-cell" style="background:#3b82f6">3</div>
          <div class="rp-log-cell" style="background:#6366f1">4</div>
        </div>
        <div class="rp-log-row">
          <div class="rp-log-label">Follower B</div>
          <div class="rp-log-cell" style="background:#3b82f6">1</div>
          <div class="rp-log-cell" style="background:#3b82f6">2</div>
          <div class="rp-log-cell" style="background:#475569;opacity:.5">...</div>
        </div>
        <div class="rp-commit-line">commit index = 4 (maioria confirmou)</div>
      </div>
      <div style="margin-top:8px;font-size:9px;color:#94a3b8;line-height:1.5">
        Azul = commitado (maioria confirmou)<br/>
        Roxo = aguardando quorum<br/>
        Cinza = não replicado ainda
      </div>
      <div style="margin-top:8px;padding:6px;background:#0f172a;border-radius:4px;font-size:9px;color:#4ade80">
        ✓ Entry 4: replicada ao leader + follower A = 2/3 = quorum → commitada
      </div>
    </div>
  </div>
</div>`,
      caption: 'Leader election usa terms monotônicos. Log replication espera quorum (maioria) antes de commitar. Entries não-commitadas podem ser perdidas em troca de leader.',
    },
    {
      title: 'Quorum — Propriedade de Interseção',
      html: `<style>
.rp-q-wrap { font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; }
.rp-q-title { font-size: 13px; font-weight: 700; color: #6366f1; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
.rp-q-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.rp-q-card { background: #1e293b; border-radius: 8px; padding: 12px; border-top: 3px solid #6366f1; }
.rp-q-card-title { font-size: 11px; font-weight: 700; color: #6366f1; margin-bottom: 8px; }
.rp-nodes { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
.rp-n { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; }
.rp-n-alive { background: #6366f1; color: white; }
.rp-n-dead { background: #334155; color: #475569; text-decoration: line-through; }
.rp-n-quorum { background: #4ade80; color: #052e16; }
.rp-q-note { font-size: 10px; color: #94a3b8; line-height: 1.4; }
.rp-q-good { color: #4ade80; }
.rp-q-bad { color: #f87171; }
.rp-q-intersection { background: #0f172a; border-radius: 4px; padding: 8px; margin-top: 8px; border-left: 3px solid #f59e0b; }
.rp-q-int-title { font-size: 10px; font-weight: 700; color: #f59e0b; margin-bottom: 4px; }
.rp-q-int-text { font-size: 10px; color: #94a3b8; line-height: 1.4; }
</style>
<div class="rp-q-wrap">
  <div class="rp-q-title">Quorum — Por que 2f+1 nós</div>
  <div class="rp-q-grid">
    <div class="rp-q-card">
      <div class="rp-q-card-title">3 nós — tolera 1 falha</div>
      <div class="rp-nodes">
        <div class="rp-n rp-n-quorum">1</div>
        <div class="rp-n rp-n-quorum">2</div>
        <div class="rp-n rp-n-dead">3</div>
      </div>
      <div class="rp-q-note"><span class="rp-q-good">✓ Quorum = 2/3</span><br/>Nó 3 morreu. Nós 1 e 2 formam quorum e continuam operando.</div>
    </div>
    <div class="rp-q-card">
      <div class="rp-q-card-title">5 nós — tolera 2 falhas</div>
      <div class="rp-nodes">
        <div class="rp-n rp-n-quorum">1</div>
        <div class="rp-n rp-n-quorum">2</div>
        <div class="rp-n rp-n-quorum">3</div>
        <div class="rp-n rp-n-dead">4</div>
        <div class="rp-n rp-n-dead">5</div>
      </div>
      <div class="rp-q-note"><span class="rp-q-good">✓ Quorum = 3/5</span><br/>Nós 4 e 5 morreram. Nós 1,2,3 formam quorum.</div>
    </div>
    <div class="rp-q-card">
      <div class="rp-q-card-title">4 nós — perigo</div>
      <div class="rp-nodes">
        <div class="rp-n rp-n-quorum">1</div>
        <div class="rp-n rp-n-quorum">2</div>
        <div class="rp-n rp-n-dead">3</div>
        <div class="rp-n rp-n-dead">4</div>
      </div>
      <div class="rp-q-note"><span class="rp-q-bad">✗ Quorum = 3/4</span><br/>Partição 2x2 possível. Nenhum lado tem 3/4 = cluster parado. Mesmo custo que 5 nós, sem benefício.</div>
    </div>
  </div>
  <div class="rp-q-intersection">
    <div class="rp-q-int-title">Propriedade de Interseção de Quorums</div>
    <div class="rp-q-int-text">
      Qualquer dois quorums (conjunto maioria) se intersectam em pelo menos 1 nó. Esse nó "testemunhou" a primeira decisão e pode rejeitar uma segunda decisão conflitante. É por isso que consenso é possível: impossível ter duas maiorias sem sobreposição.
    </div>
  </div>
</div>`,
      caption: 'O cluster par (4 nós) tem o mesmo custo que 5 nós porém a mesma tolerância que 3 nós — pior de dois mundos. Sempre use número ímpar.',
    },
    {
      title: 'Raft vs Paxos — Comparação Conceitual',
      html: `<style>
.rp-cmp-wrap { font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; }
.rp-cmp-title { font-size: 13px; font-weight: 700; color: #6366f1; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
.rp-cmp-table { width: 100%; border-collapse: collapse; }
.rp-cmp-th { font-size: 11px; font-weight: 700; padding: 8px 10px; text-align: left; border-bottom: 1px solid #334155; }
.rp-cmp-td { font-size: 10px; padding: 8px 10px; border-bottom: 1px solid #1e293b; color: #94a3b8; vertical-align: top; line-height: 1.4; }
.rp-cmp-td:first-child { color: #e2e8f0; font-weight: 600; }
.rp-cmp-raft { color: #6366f1 !important; }
.rp-cmp-paxos { color: #f59e0b !important; }
.rp-cmp-badge { display: inline-block; font-size: 9px; padding: 1px 5px; border-radius: 3px; font-weight: 600; margin-right: 3px; }
.rp-badge-blue { background: rgba(99,102,241,.2); color: #818cf8; }
.rp-badge-amber { background: rgba(245,158,11,.2); color: #fbbf24; }
.rp-badge-green { background: rgba(74,222,128,.15); color: #4ade80; }
</style>
<div class="rp-cmp-wrap">
  <div class="rp-cmp-title">Raft vs Paxos</div>
  <table class="rp-cmp-table">
    <thead>
      <tr>
        <th class="rp-cmp-th" style="width:20%">Critério</th>
        <th class="rp-cmp-th rp-cmp-raft" style="width:40%">Raft (2014)</th>
        <th class="rp-cmp-th rp-cmp-paxos" style="width:40%">Paxos / Multi-Paxos</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="rp-cmp-td">Origem</td>
        <td class="rp-cmp-td">Stanford, 2014. Objetivo: understandability.</td>
        <td class="rp-cmp-td">Lamport, 1989. Prova formal rigorosa.</td>
      </tr>
      <tr>
        <td class="rp-cmp-td">Leader</td>
        <td class="rp-cmp-td"><span class="rp-cmp-badge rp-badge-blue">forte</span>Leader único e autoritativo. Log do leader é a verdade.</td>
        <td class="rp-cmp-td"><span class="rp-cmp-badge rp-badge-amber">flexível</span>Qualquer proposer pode tentar. Leader em Multi-Paxos é por convenção, não garantia.</td>
      </tr>
      <tr>
        <td class="rp-cmp-td">Especificação</td>
        <td class="rp-cmp-td">Completa: snapshot, membership change, log compaction — tudo no paper.</td>
        <td class="rp-cmp-td">Single-Decree: apenas uma decisão. Multi-Paxos é informal — cada impl. decide os detalhes.</td>
      </tr>
      <tr>
        <td class="rp-cmp-td">Implementações</td>
        <td class="rp-cmp-td">etcd, CockroachDB, TiKV, Consul, CassandraRaft, KRaft (Kafka)</td>
        <td class="rp-cmp-td">Google Spanner, Google Chubby, Apache ZooKeeper (ZAB ≈ Paxos)</td>
      </tr>
      <tr>
        <td class="rp-cmp-td">Latência write</td>
        <td class="rp-cmp-td">1 RTT por entry (após leader eleito). Previsível.</td>
        <td class="rp-cmp-td">Multi-Paxos: 1 RTT por entry. Fase 1 adicional em conflitos de proposer.</td>
      </tr>
      <tr>
        <td class="rp-cmp-td">Dificuldade</td>
        <td class="rp-cmp-td"><span class="rp-cmp-badge rp-badge-green">mais fácil</span>Estudos de usuário mostram aprendizado mais rápido.</td>
        <td class="rp-cmp-td">Notoriamente difícil. Lamport: "a surprisingly simple protocol" — ninguém concorda.</td>
      </tr>
    </tbody>
  </table>
</div>`,
      caption: 'Raft e Multi-Paxos têm performance similar, mas Raft é mais fácil de implementar corretamente. Na prática, quase toda implementação nova usa Raft.',
    },
  ],
  cheatsheet: {
    title: 'Raft/Paxos — Cheatsheet',
    html: `<style>
.rp-cs-wrap { font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; }
.rp-cs-title { font-size: 13px; font-weight: 700; color: #6366f1; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
.rp-cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.rp-cs-section { background: #1e293b; border-radius: 8px; padding: 12px; }
.rp-cs-sec-title { font-size: 11px; font-weight: 700; color: #6366f1; margin-bottom: 8px; text-transform: uppercase; letter-spacing: .04em; border-bottom: 1px solid #334155; padding-bottom: 4px; }
.rp-cs-row { display: flex; gap: 8px; margin-bottom: 5px; align-items: flex-start; }
.rp-cs-key { font-size: 10px; font-weight: 600; color: #e2e8f0; min-width: 110px; flex-shrink: 0; }
.rp-cs-val { font-size: 10px; color: #94a3b8; line-height: 1.4; }
.rp-cs-formula { font-size: 10px; color: #a5f3fc; font-family: monospace; background: #0f172a; border-radius: 3px; padding: 2px 6px; display: inline-block; }
.rp-cs-badge { display: inline-block; font-size: 9px; padding: 1px 5px; border-radius: 3px; font-weight: 600; margin-right: 3px; }
.rp-cs-green { background: rgba(74,222,128,.15); color: #4ade80; }
.rp-cs-red { background: rgba(248,113,113,.15); color: #f87171; }
</style>
<div class="rp-cs-wrap">
  <div class="rp-cs-title">Raft/Paxos — Referência Rápida</div>
  <div class="rp-cs-grid">
    <div class="rp-cs-section">
      <div class="rp-cs-sec-title">Fórmulas Fundamentais</div>
      <div class="rp-cs-row"><div class="rp-cs-key">Quorum</div><div class="rp-cs-val"><span class="rp-cs-formula">⌊N/2⌋ + 1</span> — maioria simples</div></div>
      <div class="rp-cs-row"><div class="rp-cs-key">Tolerância</div><div class="rp-cs-val">2f+1 nós → tolera f falhas simultâneas</div></div>
      <div class="rp-cs-row"><div class="rp-cs-key">Tamanhos</div><div class="rp-cs-val">3 nós → f=1; 5 → f=2; 7 → f=3</div></div>
      <div class="rp-cs-row"><div class="rp-cs-key">Latência write</div><div class="rp-cs-val">≥ 1 RTT para maioria dos followers</div></div>
      <div class="rp-cs-row"><div class="rp-cs-key">Cluster par</div><div class="rp-cs-val"><span class="rp-cs-badge rp-cs-red">evitar</span>Mesma tolerância que N-1, risco split-brain</div></div>
    </div>
    <div class="rp-cs-section">
      <div class="rp-cs-sec-title">Raft — Sub-problemas</div>
      <div class="rp-cs-row"><div class="rp-cs-key">Leader election</div><div class="rp-cs-val">Term + electionTimeout + votação por log mais atualizado</div></div>
      <div class="rp-cs-row"><div class="rp-cs-key">Log replication</div><div class="rp-cs-val">AppendEntries → maioria confirma → commit → apply</div></div>
      <div class="rp-cs-row"><div class="rp-cs-key">Safety</div><div class="rp-cs-val">Term monotônico invalida leader antigo</div></div>
      <div class="rp-cs-row"><div class="rp-cs-key">Snapshot</div><div class="rp-cs-val">Compacta log → lastIncludedIndex/Term</div></div>
      <div class="rp-cs-row"><div class="rp-cs-key">Membership</div><div class="rp-cs-val">One-server-at-a-time (ou joint consensus)</div></div>
    </div>
    <div class="rp-cs-section">
      <div class="rp-cs-sec-title">Leitura Linearizável</div>
      <div class="rp-cs-row"><div class="rp-cs-key">Read Index</div><div class="rp-cs-val">Leader confirma com maioria que ainda é líder antes de servir read. 1 RTT.</div></div>
      <div class="rp-cs-row"><div class="rp-cs-key">Lease Read</div><div class="rp-cs-val">Leader com lease válido serve read sem RTT. Requer clock sync.</div></div>
      <div class="rp-cs-row"><div class="rp-cs-key">Stale Read</div><div class="rp-cs-val">Ler do estado local sem confirmação. Eventual consistency — aceitar divergência.</div></div>
    </div>
    <div class="rp-cs-section">
      <div class="rp-cs-sec-title">Implementações Principais</div>
      <div class="rp-cs-row"><div class="rp-cs-key">etcd</div><div class="rp-cs-val">Raft em Go. Backend do Kubernetes. Cluster de 3 ou 5 nós.</div></div>
      <div class="rp-cs-row"><div class="rp-cs-key">CockroachDB</div><div class="rp-cs-val">Raft por range de dados. Transações distribuídas via 2PC+Raft.</div></div>
      <div class="rp-cs-row"><div class="rp-cs-key">Consul</div><div class="rp-cs-val">Raft para service discovery e KV store distribuído.</div></div>
      <div class="rp-cs-row"><div class="rp-cs-key">Spanner</div><div class="rp-cs-val">Paxos por shard + TrueTime para external consistency global.</div></div>
    </div>
  </div>
</div>`,
  },
  mindmap: {
    title: 'Raft/Paxos — Mind Map',
    html: `<style>
.rp-mm-wrap { font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; }
.rp-mm-title { font-size: 13px; font-weight: 700; color: #6366f1; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
.rp-mm-center { text-align: center; margin-bottom: 16px; }
.rp-mm-core { display: inline-block; background: #6366f1; color: white; font-weight: 700; font-size: 14px; padding: 8px 20px; border-radius: 20px; }
.rp-mm-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.rp-mm-branch { background: #1e293b; border-radius: 8px; padding: 12px; border-top: 3px solid; }
.rp-mm-branch-title { font-size: 11px; font-weight: 700; margin-bottom: 8px; }
.rp-mm-item { font-size: 10px; color: #94a3b8; padding: 3px 0; border-bottom: 1px solid #0f172a; }
.rp-mm-item:last-child { border-bottom: none; }
.rp-mm-em { color: #e2e8f0; }
</style>
<div class="rp-mm-wrap">
  <div class="rp-mm-title">Consenso Distribuído — Mapa Mental</div>
  <div class="rp-mm-center"><div class="rp-mm-core">CONSENSO</div></div>
  <div class="rp-mm-grid">
    <div class="rp-mm-branch" style="border-color:#6366f1">
      <div class="rp-mm-branch-title" style="color:#6366f1">Raft</div>
      <div class="rp-mm-item"><span class="rp-mm-em">Leader election</span> — terms</div>
      <div class="rp-mm-item"><span class="rp-mm-em">Log replication</span> — quorum</div>
      <div class="rp-mm-item"><span class="rp-mm-em">Safety</span> — term monotônico</div>
      <div class="rp-mm-item"><span class="rp-mm-em">Snapshot</span> — compactação</div>
      <div class="rp-mm-item"><span class="rp-mm-em">Membership</span> — one-at-a-time</div>
    </div>
    <div class="rp-mm-branch" style="border-color:#f59e0b">
      <div class="rp-mm-branch-title" style="color:#f59e0b">Paxos</div>
      <div class="rp-mm-item">Single-Decree — uma decisão</div>
      <div class="rp-mm-item">Prepare → Promise</div>
      <div class="rp-mm-item">Accept → Accepted</div>
      <div class="rp-mm-item">Multi-Paxos — sequência</div>
      <div class="rp-mm-item">Spanner usa por datacenter</div>
    </div>
    <div class="rp-mm-branch" style="border-color:#10b981">
      <div class="rp-mm-branch-title" style="color:#10b981">Quorum</div>
      <div class="rp-mm-item">2f+1 nós → tolera f falhas</div>
      <div class="rp-mm-item">3 nós → 1 falha (sweet spot)</div>
      <div class="rp-mm-item">5 nós → 2 falhas (multi-AZ)</div>
      <div class="rp-mm-item">Cluster par → evitar</div>
      <div class="rp-mm-item">Interseção garante unicidade</div>
    </div>
    <div class="rp-mm-branch" style="border-color:#a855f7">
      <div class="rp-mm-branch-title" style="color:#a855f7">Leitura Consistente</div>
      <div class="rp-mm-item">Read index — 1 RTT</div>
      <div class="rp-mm-item">Lease read — sem RTT</div>
      <div class="rp-mm-item">Stale read — eventual</div>
      <div class="rp-mm-item">Linearizabilidade provada</div>
    </div>
    <div class="rp-mm-branch" style="border-color:#ef4444">
      <div class="rp-mm-branch-title" style="color:#ef4444">Problemas</div>
      <div class="rp-mm-item">Stale reads — leader isolado</div>
      <div class="rp-mm-item">Log ilimitado — usar snapshot</div>
      <div class="rp-mm-item">Latência cross-region</div>
      <div class="rp-mm-item">Não escala writes</div>
      <div class="rp-mm-item">Cluster par = split-brain</div>
    </div>
    <div class="rp-mm-branch" style="border-color:#38bdf8">
      <div class="rp-mm-branch-title" style="color:#38bdf8">Implementações</div>
      <div class="rp-mm-item">etcd — Kubernetes</div>
      <div class="rp-mm-item">CockroachDB — SQL dist.</div>
      <div class="rp-mm-item">Consul — service discovery</div>
      <div class="rp-mm-item">KRaft — Kafka sem ZooKeeper</div>
      <div class="rp-mm-item">Spanner — Paxos + TrueTime</div>
    </div>
  </div>
</div>`,
  },
  mnemonics: [
    {
      label: 'Quorum: "2f+1 tolera f" — sempre calcule assim',
      trick: '2F+1',
      explanation: '3 nós → f=1 (1 pode cair). 5 nós → f=2 (2 podem cair). 7 nós → f=3. A fórmula garante que após f falhas ainda sobra maioria (f+1) para quorum. Nunca use cluster par: 4 nós têm mesmo f=1 que 3, mas com custo maior.',
    },
    {
      label: 'Raft: "ELSE" — Election, Log, Safety, Election(re)',
      trick: 'E-L-S-E',
      explanation: 'Election (leader election por term) → Log (replication para followers) → Safety (term monotônico invalida leaders antigos) → re-Election (se leader cai, processo recomeça). Raft decompõe consenso nesses sub-problemas isolados.',
    },
    {
      label: 'Paxos duas fases: "Prepare Promise, Accept Accepted"',
      trick: 'PP-AA',
      explanation: 'Fase 1: Proposer envia Prepare(N) → Acceptors respondem Promise(N) (prometem não aceitar menor que N). Fase 2: Proposer envia Accept(N, valor) → Acceptors respondem Accepted. Multi-Paxos pula fase 1 quando há líder estabelecido — 1 RTT por decisão.',
    },
    {
      label: 'Reads linearizáveis: "Índice antes, Lease durante, Stale arriscado"',
      trick: 'I-L-S',
      explanation: 'Read Index: confirma com quorum antes de servir — correto mas 1 RTT extra. Lease: relógio garante que você ainda é líder — rápido mas depende de clock sync. Stale: lê estado local sem verificação — pode retornar dados antigos (eventual consistency).',
    },
    {
      label: 'Raft vs Paxos: "Raft é Rigoroso, Paxos é Poderoso"',
      trick: 'R=R, P=P',
      explanation: 'Raft é rigoroso e completo na especificação — snapshot, membership change, tudo definido. Fácil de implementar corretamente. Paxos é mais poderoso e flexível (Spanner), mas a especificação informal do Multi-Paxos leva a implementações divergentes. Na prática: Raft para 99% dos casos.',
    },
  ],
  exercises: [
    {
      level: 'iniciante',
      title: 'Calcular quorum e tolerância a falhas',
      description: 'Para cada tamanho de cluster (3, 5, 7, 9 nós), calcule: (1) tamanho do quorum necessário, (2) quantas falhas simultâneas o cluster tolera, (3) qual seria o quorum se o cluster fosse par (4, 6, 8). Explique por que clusters pares são evitados em produção (especialmente o risco de split-brain em partição de rede).',
      concepts: ['quorum', 'tolerância a falhas', 'cluster impar', 'split-brain'],
    },
    {
      level: 'intermediario',
      title: 'Simular leader election do Raft',
      description: 'Implemente uma simulação de leader election do Raft em TypeScript/Python: N nós com threads/coroutines. Cada nó tem um electionTimeout aleatório (150-300ms). Implemente: estado (follower/candidate/leader), heartbeat do leader, requestVote e processamento de votos. Teste: (1) eleição normal, (2) eleição com 1 nó morto, (3) empate e nova eleição.',
      concepts: ['leader election', 'term', 'electionTimeout', 'requestVote', 'quorum'],
    },
    {
      level: 'intermediario',
      title: 'Usar etcd para distributed lock',
      description: 'Usando etcd Go client ou Python client: implemente um distributed lock com TTL de 5 segundos. Duas goroutines/threads tentam adquirir o lock simultaneamente. Apenas uma deve executar a seção crítica por vez. Implemente também a renovação de lease automática (keep-alive) para operações longas. Teste o comportamento quando o lock holder "morre" (cancelar o contexto).',
      concepts: ['distributed lock', 'etcd', 'lease', 'TTL', 'fencing token', 'keep-alive'],
    },
    {
      level: 'senior',
      title: 'Implementar Raft completo com log replication',
      description: 'Implemente um cluster Raft mínimo funcional com: (1) leader election com terms, (2) log replication com AppendEntries, (3) commit quando maioria confirma, (4) state machine simples (key-value store), (5) snapshot periódico. Teste: (1) cluster de 3 nós com writes concorrentes, (2) derrubar o leader durante replicação — novo leader deve ter todos os commits, (3) nó que ficou offline por 100 entries consegue se recuperar via snapshot ou AppendEntries incremental.',
      concepts: ['Raft', 'leader election', 'log replication', 'commit quorum', 'snapshot', 'InstallSnapshot', 'state machine'],
    },
    {
      level: 'senior',
      title: 'Análise de consistência em cluster etcd multi-região',
      description: 'Cenário: cluster etcd com 5 nós em 3 regiões (US-east: 2, EU: 2, APAC: 1). Latência US↔EU = 80ms, US↔APAC = 150ms. Analise: (1) latência de commit de write (quem forma o quorum mais rápido?), (2) o que acontece se EU fica offline (2 nós) — o cluster continua?, (3) o que acontece se US-east fica offline (2 nós)?, (4) proposta: seria melhor ter 3 nós em US e 1 em EU e 1 em APAC? Calcule a latência de commit para cada cenário.',
      concepts: ['quorum multi-região', 'latência de consenso', 'disponibilidade', 'tolerância a partição', 'CAP theorem'],
    },
  ],
  codeExamples: [
    {
      title: 'Distributed Lock com etcd em Go',
      language: 'go',
      code: `package main

import (
    "context"
    "fmt"
    "log"
    "time"

    clientv3 "go.etcd.io/etcd/client/v3"
    "go.etcd.io/etcd/client/v3/concurrency"
)

func main() {
    // Criar client etcd
    cli, err := clientv3.New(clientv3.Config{
        Endpoints:   []string{"localhost:2379"},
        DialTimeout: 5 * time.Second,
    })
    if err != nil {
        log.Fatal(err)
    }
    defer cli.Close()

    // Session com TTL — se processo morrer, lock expira em 10s
    sess, err := concurrency.NewSession(cli, concurrency.WithTTL(10))
    if err != nil {
        log.Fatal(err)
    }
    defer sess.Close()

    // Mutex distribuído
    mu := concurrency.NewMutex(sess, "/locks/critical-section")

    ctx := context.Background()

    // Adquirir lock
    fmt.Println("Tentando adquirir lock...")
    if err := mu.Lock(ctx); err != nil {
        log.Fatal("Falha ao adquirir lock:", err)
    }
    fmt.Println("Lock adquirido! Executando seção crítica...")

    // Seção crítica — lease é renovado automaticamente pelo Session
    time.Sleep(3 * time.Second) // simula trabalho
    fmt.Println("Seção crítica completa")

    // Liberar lock explicitamente (ou TTL libera automaticamente)
    if err := mu.Unlock(ctx); err != nil {
        log.Fatal("Falha ao liberar lock:", err)
    }
    fmt.Println("Lock liberado")
}

// Para usar fencing token (evitar split-brain):
func doWorkWithFencing(ctx context.Context, mu *concurrency.Mutex, token int64) error {
    // token = versão do lease — operações no banco/API passam o token
    // backend rejeita operações com token menor que o último visto
    // garante que instância "morta" que volta não consegue sobrescrever
    return nil
}`,
    },
    {
      title: 'Leitura linearizável vs stale no etcd',
      language: 'go',
      code: `package main

import (
    "context"
    "fmt"
    "log"

    clientv3 "go.etcd.io/etcd/client/v3"
)

func main() {
    cli, _ := clientv3.New(clientv3.Config{
        Endpoints: []string{"localhost:2379"},
    })
    defer cli.Close()

    ctx := context.Background()

    // ── Leitura linearizável (padrão) ──────────────────────────────────────────
    // Usa read index: leader confirma com maioria que ainda é líder
    // Garante que você vê todos os writes commitados antes desta leitura
    // Custo: ~1 RTT adicional para confirmação com maioria
    resp, err := cli.Get(ctx, "/config/feature-flag")
    if err != nil {
        log.Fatal(err)
    }
    if len(resp.Kvs) > 0 {
        fmt.Printf("Linearizável: %s\n", resp.Kvs[0].Value)
    }

    // ── Leitura serializable (stale) ──────────────────────────────────────────
    // Lê do estado local do servidor — pode ser ligeiramente desatualizado
    // Mais rápido: sem confirmação com quorum
    // Use quando eventual consistency é aceitável (ex: feature flags que raramente mudam)
    resp, err = cli.Get(ctx, "/config/feature-flag",
        clientv3.WithSerializable()) // ← opt-in para stale read
    if err != nil {
        log.Fatal(err)
    }
    if len(resp.Kvs) > 0 {
        fmt.Printf("Serializable (pode ser stale): %s\n", resp.Kvs[0].Value)
    }

    // ── Watch — recebe eventos desde uma revision específica ──────────────────
    // Garante que não perde eventos — Raft preserva sequência
    watchChan := cli.Watch(ctx, "/config/", clientv3.WithPrefix())
    go func() {
        for watchResp := range watchChan {
            for _, event := range watchResp.Events {
                fmt.Printf("Evento: %s %s=%s (rev=%d)\n",
                    event.Type, event.Kv.Key, event.Kv.Value,
                    event.Kv.ModRevision)
            }
        }
    }()
}`,
    },
    {
      title: 'Raft leader election — estado simplificado em TypeScript',
      language: 'typescript',
      code: `// Simulação simplificada de leader election do Raft
// (não é implementação de produção — é educacional)

enum NodeState { FOLLOWER, CANDIDATE, LEADER }

interface LogEntry {
  term: number
  command: string
  index: number
}

class RaftNode {
  id: string
  state: NodeState = NodeState.FOLLOWER
  currentTerm: number = 0
  votedFor: string | null = null
  log: LogEntry[] = []
  commitIndex: number = 0

  // Ao receber RequestVote do candidato
  handleRequestVote(candidateId: string, candidateTerm: number,
    lastLogIndex: number, lastLogTerm: number
  ): { voteGranted: boolean; term: number } {

    // Regra 1: candidato com term menor → rejeitar
    if (candidateTerm < this.currentTerm) {
      return { voteGranted: false, term: this.currentTerm }
    }

    // Candidato com term maior → atualizar term, virar follower
    if (candidateTerm > this.currentTerm) {
      this.currentTerm = candidateTerm
      this.state = NodeState.FOLLOWER
      this.votedFor = null
    }

    // Regra 2: já votou neste term para outro candidato → rejeitar
    if (this.votedFor !== null && this.votedFor !== candidateId) {
      return { voteGranted: false, term: this.currentTerm }
    }

    // Regra 3: log do candidato deve ser pelo menos tão atualizado
    // Comparação: primeiro por lastLogTerm, depois por lastLogIndex
    const myLastEntry = this.log[this.log.length - 1]
    const myLastTerm = myLastEntry?.term ?? 0
    const myLastIndex = myLastEntry?.index ?? 0

    const candidateLogOk =
      candidateLastLogTerm > myLastTerm ||
      (candidateLastLogTerm === myLastTerm && lastLogIndex >= myLastIndex)

    if (!candidateLogOk) {
      return { voteGranted: false, term: this.currentTerm }
    }

    // Concede voto
    this.votedFor = candidateId
    return { voteGranted: true, term: this.currentTerm }
  }
}

// Regra de votação crítica: a comparação de log (lastLogTerm > myLastTerm)
// garante Leader Completeness — somente candidatos com log mais atualizado
// ganham eleição, preservando todas as entradas já commitadas.
// Candidatos com log antigo nunca vencerão candidatos com entradas mais recentes.

const node = new RaftNode()
node.id = 'node-1'`,
    },
    {
      title: 'Configurar etcd cluster de 3 nós com Docker Compose',
      language: 'yaml',
      code: `# docker-compose.yml — etcd cluster de 3 nós para desenvolvimento
version: '3.8'

services:
  etcd0:
    image: quay.io/coreos/etcd:v3.5.10
    container_name: etcd0
    environment:
      - ETCD_NAME=etcd0
      - ETCD_DATA_DIR=/etcd-data
      - ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379
      - ETCD_ADVERTISE_CLIENT_URLS=http://etcd0:2379
      - ETCD_LISTEN_PEER_URLS=http://0.0.0.0:2380
      - ETCD_INITIAL_ADVERTISE_PEER_URLS=http://etcd0:2380
      - ETCD_INITIAL_CLUSTER=etcd0=http://etcd0:2380,etcd1=http://etcd1:2380,etcd2=http://etcd2:2380
      - ETCD_INITIAL_CLUSTER_STATE=new
      - ETCD_INITIAL_CLUSTER_TOKEN=my-cluster-token
    volumes:
      - etcd0-data:/etcd-data
    ports:
      - "2379:2379"

  etcd1:
    image: quay.io/coreos/etcd:v3.5.10
    container_name: etcd1
    environment:
      - ETCD_NAME=etcd1
      - ETCD_DATA_DIR=/etcd-data
      - ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379
      - ETCD_ADVERTISE_CLIENT_URLS=http://etcd1:2379
      - ETCD_LISTEN_PEER_URLS=http://0.0.0.0:2380
      - ETCD_INITIAL_ADVERTISE_PEER_URLS=http://etcd1:2380
      - ETCD_INITIAL_CLUSTER=etcd0=http://etcd0:2380,etcd1=http://etcd1:2380,etcd2=http://etcd2:2380
      - ETCD_INITIAL_CLUSTER_STATE=new
      - ETCD_INITIAL_CLUSTER_TOKEN=my-cluster-token
    volumes:
      - etcd1-data:/etcd-data

  etcd2:
    image: quay.io/coreos/etcd:v3.5.10
    container_name: etcd2
    environment:
      - ETCD_NAME=etcd2
      - ETCD_DATA_DIR=/etcd-data
      - ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379
      - ETCD_ADVERTISE_CLIENT_URLS=http://etcd2:2379
      - ETCD_LISTEN_PEER_URLS=http://0.0.0.0:2380
      - ETCD_INITIAL_ADVERTISE_PEER_URLS=http://etcd2:2380
      - ETCD_INITIAL_CLUSTER=etcd0=http://etcd0:2380,etcd1=http://etcd1:2380,etcd2=http://etcd2:2380
      - ETCD_INITIAL_CLUSTER_STATE=new
      - ETCD_INITIAL_CLUSTER_TOKEN=my-cluster-token
    volumes:
      - etcd2-data:/etcd-data

volumes:
  etcd0-data:
  etcd1-data:
  etcd2-data:

# Verificar saúde do cluster:
# docker exec etcd0 etcdctl endpoint health --endpoints=etcd0:2379,etcd1:2379,etcd2:2379
# docker exec etcd0 etcdctl endpoint status --endpoints=etcd0:2379,etcd1:2379,etcd2:2379 --write-out=table`,
    },
  ],
  videos: [
    { title: 'Raft Consensus Algorithm Explained', channel: 'Martin Kleppmann', url: 'https://www.youtube.com/watch?v=IPnesACYRck', topic: 'Explicação profunda de Raft' },
    { title: 'Distributed Systems — Consensus (Cambridge)', channel: 'Martin Kleppmann', url: 'https://www.youtube.com/watch?v=aILBT-GSOqQ', topic: 'Fundamentos teóricos' },
    { title: 'The Secret Lives of Data — Raft Visualization', channel: 'Secretlivesofdata', url: 'http://thesecretlivesofdata.com/raft/', topic: 'Visualização interativa' },
    { title: 'Paxos Made Live — Google Chubby', channel: 'Google Tech Talks', url: 'https://www.youtube.com/watch?v=d7nAGI_NZPk', topic: 'Paxos em produção no Google' },
    { title: 'etcd: Raft Implementation in Go', channel: 'CNCF', url: 'https://www.youtube.com/watch?v=hQigROzfCVU', topic: 'Raft no etcd e Kubernetes' },
    { title: 'MIT 6.824: Distributed Systems (2021)', channel: 'MIT OpenCourseWare', url: 'https://www.youtube.com/watch?v=cQP8WApzIQQ', topic: 'Curso universitário completo' },
  ],
  resources: [
    { title: 'Raft paper — In Search of an Understandable Consensus Algorithm', url: 'https://raft.github.io/raft.pdf', kind: 'artigo' },
    { title: 'raft.github.io — visualização interativa', url: 'https://raft.github.io/', kind: 'pratica' },
    { title: 'The Secret Lives of Data — Raft animado', url: 'http://thesecretlivesofdata.com/raft/', kind: 'pratica' },
    { title: 'Designing Data-Intensive Applications — Kleppmann (cap. 9)', url: 'https://dataintensive.net/', kind: 'livro' },
    { title: 'Paxos Made Simple — Lamport', url: 'https://lamport.azurewebsites.net/pubs/paxos-simple.pdf', kind: 'artigo' },
    { title: 'etcd documentation', url: 'https://etcd.io/docs/', kind: 'docs' },
    { title: 'MIT 6.824 — Distributed Systems', url: 'https://pdos.csail.mit.edu/6.824/', kind: 'curso' },
    { title: 'Paxos Made Live — Google (implementação real)', url: 'https://research.google.com/archive/paxos_made_live.html', kind: 'artigo' },
  ],
}

export default raftPaxos
