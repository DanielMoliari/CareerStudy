import type { SkillContent } from '@/types'

const apacheKafka: SkillContent = {
  tagline: "Plataforma de streaming distribuído — log imutável, alta throughput, replay de eventos.",
  why: "Kafka é o backbone de dados em empresas com escala. CDC, event sourcing, analytics em tempo real e integração de microserviços passam por Kafka. Saber o modelo mental (log, partição, offset, consumer group) e os trade-offs (exactly-once vs at-least-once, rebalancing, compaction) é esperado em vaga sênior de backend.",
  summary: "Apache Kafka é uma plataforma de streaming distribuído baseada em log imutável. Produtores publicam em topics, divididos em partitions distribuídas entre brokers. Consumidores leem em grupos (consumer groups) — cada partition é consumida por exatamente um consumer no grupo. Mensagens são retidas por período configurável, permitindo replay. Alta throughput (milhões de msgs/s) via batching e sequential disk I/O. Casos de uso: event sourcing, CDC, stream processing, audit log, integração de microserviços.",
  keypoints: [
    { title: "Topic, Partition e Offset", body: "Topic é o canal lógico. Cada topic tem N partitions distribuídas entre brokers. Mensagens dentro de uma partition são ordenadas por offset (posição). Entre partitions não há ordem global. Partition key determina para qual partition a mensagem vai — mesma key → mesma partition → ordem garantida para aquela entidade." },
    { title: "Producer — acks, idempotência e batching", body: "acks=0: fire-and-forget (risco de perda). acks=1: líder confirmou (risco se líder cair antes de replicar). acks=all: líder + todas ISRs confirmaram (mais seguro). Idempotent producer (enable.idempotence=true) garante exatamente uma entrega mesmo com retries. Batching (linger.ms + batch.size) aumenta throughput agrupando mensagens." },
    { title: "Consumer Group e rebalancing", body: "Consumer Group: cada partition é atribuída a exatamente um consumer no grupo. Paralelismo máximo = número de partitions. Adicionar consumers acima do número de partitions não aumenta paralelismo — consumidores extras ficam ociosos. Rebalancing ocorre quando consumer entra ou sai do grupo — pode causar duplicatas sem cuidado no offset commit." },
    { title: "ISR e replicação", body: "Cada partition tem leader (recebe writes do producer) e N followers. ISR (In-Sync Replicas): followers que estão sincronizados com o leader. acks=all só confirma após todas ISRs escreverem. Follower fora do ISR não conta para confirmação. Em falha do leader, broker controller elege um ISR como novo leader." },
    { title: "Offset commit e exactly-once", body: "Consumer comita offsets para indicar até onde processou. auto.commit pode gerar duplicatas (comita antes de processar). Manual commit após processamento garante at-least-once. Exactly-once requer: idempotent producer + transações Kafka + consumo transacional — complexo, use at-least-once com idempotência no consumer na maioria dos casos." },
    { title: "Compaction e retention", body: "Retention por tempo (retention.ms) ou tamanho (retention.bytes): mensagens antigas são apagadas. Log compaction: Kafka mantém apenas o último valor por key — ideal para tabelas de estado (changelog). Tópicos compactados permitem reconstruir estado atual sem processar todo o histórico." },
    { title: "Schema Registry e serialização", body: "Avro/Protobuf/JSON Schema versionados no Confluent Schema Registry. Producer registra schema, consumer valida compatibilidade ao deserializar. Evita breaking changes silenciosos. Compatibilidade: BACKWARD (novo consumer lê mensagens antigas), FORWARD (consumidor antigo lê novas mensagens), FULL (ambos)." },
    { title: "Kafka Streams e ksqlDB", body: "Kafka Streams: biblioteca Java para stream processing sem cluster extra. Operações: filter, map, groupBy, windowing, join entre topics. ksqlDB: SQL sobre streams Kafka (SELECT FROM topic GROUP BY ...). Alternativa: Flink ou Spark Structured Streaming para processamento mais complexo." },
  ],
  gotchas: [
    "Partition key mal escolhida — todas as mensagens na mesma partition, paralelismo zero e hot partition.",
    "Consumer group com mais consumers que partitions — consumers extras ficam ociosos sem processar nada.",
    "auto.commit.enable=true com processamento longo — offset commitado antes de processar, crash = dados perdidos (não reprocessados).",
    "Retention period curto — replay impossível após o período. Para event sourcing, defina retention longo ou compaction.",
    "Mensagem grande (>1MB por padrão) — degrada performance. Armazene payload no S3, envie referência/link no evento.",
    "Kafka sem monitoramento de consumer lag — grupo atrasado horas não detectado. Use Burrow, Prometheus JMX exporter ou Confluent.",
    "Rebalancing frequente — session.timeout.ms muito baixo ou processamento lento causam rebalancing constante, parando consumo.",
    "Sem idempotência no producer com retries — mensagem duplicada em caso de timeout de rede (retry após ACK não recebido).",
  ],
  interview: [
    {
      q: "Por que mensagens dentro de uma partition são ordenadas, mas entre partitions não?",
      a: "<p>Kafka garante ordem dentro de uma partition porque as mensagens são escritas em log sequencial e consumidas em ordem de offset. Cada partition tem um único writer (leader) em dado momento — sem concorrência de escrita.</p><p>Entre partitions não há coordenação — cada partition progride independentemente em velocidades distintas. Para garantir ordem de eventos de uma entidade específica (ex: todos os eventos do usuário X na sequência certa), use a user ID como partition key — todos os eventos do mesmo usuário sempre vão para a mesma partition.</p>",
      level: "senior",
      tip: "A resposta esperada cita partition key como solução para ordem por entidade. Quem só diz 'não tem ordem entre partitions' sem oferecer solução demonstra conhecimento incompleto.",
    },
    {
      q: "O que é consumer lag e por que monitorar?",
      a: "<p>Consumer lag é a diferença entre o último offset produzido (log end offset) e o último offset comitado pelo consumer group. Lag crescente significa que o consumer não processa rápido o suficiente — o grupo está ficando para trás.</p><p>Impacto: dados processados com atraso crescente. Em pagamentos, notificações ou alertas de fraude, isso pode significar horas de delay para o usuário final.</p><p>Monitorar com: <code>kafka-consumer-groups.sh --describe --group my-group</code>, Burrow, Prometheus JMX Exporter + Grafana, ou Confluent Control Center.</p><p>Ação quando lag cresce: aumentar número de consumers (até limite de partitions), otimizar processamento, ou aumentar partitions (com cuidado — rebalancing).</p>",
      level: "pleno",
      tip: "Demonstrar que sabe tanto como medir (comando ou ferramenta) quanto o que fazer quando lag cresce diferencia candidatos.",
    },
    {
      q: "Explique a diferença entre acks=0, acks=1 e acks=all.",
      a: "<p><b>acks=0</b>: producer não aguarda confirmação. Máximo throughput, risco de perda de mensagem (fire-and-forget).</p><p><b>acks=1</b>: leader confirma escrita. Falha se leader cair antes de replicar para os followers — mensagem confirmada mas não replicada é perdida.</p><p><b>acks=all</b> (ou -1): leader + todas as ISRs confirmam antes de retornar ao producer. Mais seguro. Latência um pouco maior. Requer min.insync.replicas configurado (ex: 2) para ter significado real.</p><p>Para dados críticos (pagamentos, transações): acks=all + replication.factor=3 + min.insync.replicas=2.</p>",
      level: "pleno",
      tip: "Mencionar min.insync.replicas junto com acks=all demonstra entendimento profundo — sem essa config, acks=all com 1 ISR não é mais seguro que acks=1.",
    },
    {
      q: "O que são ISRs e o que acontece quando um follower sai da ISR?",
      a: "<p>ISR (In-Sync Replicas) é o conjunto de replicas que estão sincronizadas com o leader — receberam todas as mensagens até o high watermark.</p><p>Um follower sai da ISR quando: fica mais lento que replica.lag.time.max.ms (padrão 10s), ou perde conectividade com o leader.</p><p>Impacto: com acks=all, o producer só precisa de confirmação das ISRs atuais — se só 1 ISR restou e min.insync.replicas=1, a durabilidade diminui. Se número de ISRs cai abaixo de min.insync.replicas, o broker rejeita writes com NotEnoughReplicasException.</p><p>Quando o follower volta, ele resincroniza e entra novamente na ISR.</p>",
      level: "senior",
      tip: "NotEnoughReplicasException é um erro real de produção que ocorre quando brokers caem. Saber a causa e a config que o controla impressiona.",
    },
    {
      q: "Como você garante exactly-once semantics no Kafka?",
      a: "<p>Exactly-once requer três camadas:</p><ol><li><b>Idempotent producer</b>: <code>enable.idempotence=true</code>. Producer recebe sequence number por partition — broker descarta duplicatas de retry.</li><li><b>Transações no producer</b>: <code>transactional.id</code> configurado. <code>beginTransaction()</code> → processa → <code>commitTransaction()</code>. Se falhar, <code>abortTransaction()</code>. Garante atomicidade entre múltiplos topics/partitions.</li><li><b>Consumer transacional</b>: <code>isolation.level=read_committed</code> — consumer só vê mensagens de transações comitadas.</li></ol><p>Complexidade alta. Na prática, at-least-once + idempotência na operação downstream (ex: upsert por ID) é mais simples e igualmente seguro para a maioria dos casos.</p>",
      level: "senior",
      tip: "A maioria dos candidatos sênior sabe os três componentes no papel. Quem adiciona 'at-least-once + idempotência no consumer é mais pragmático' demonstra julgamento de engenharia.",
    },
    {
      q: "O que é rebalancing e quais problemas pode causar?",
      a: "<p>Rebalancing ocorre quando a composição de um consumer group muda: consumer entra, sai, ou fica silencioso por mais de session.timeout.ms. O Kafka redistribui as partitions entre os consumers ativos.</p><p>Problemas:</p><ul><li><b>Stop-the-world</b>: durante rebalancing, TODOS os consumers param de processar (Eager rebalancing, padrão antigo).</li><li><b>Duplicatas</b>: consumer que processou mas não comitou offset perde o progresso — messages são reprocessadas.</li><li><b>Rebalancing frequente</b>: processamento lento causa timeout, o consumer é removido, rebalancing, ciclo se repete.</li></ul><p>Mitigações: Cooperative Sticky Assignor (rebalancing incremental — só movimenta partitions necessárias), heartbeat.interval.ms e session.timeout.ms ajustados, max.poll.records menor para não estourar max.poll.interval.ms.</p>",
      level: "senior",
      tip: "Citar Cooperative Sticky Assignor como evolução do Eager rebalancing demonstra que você acompanha o ecossistema Kafka moderno.",
    },
    {
      q: "Qual é a diferença entre log compaction e retention por tempo?",
      a: "<p><b>Retention por tempo</b> (<code>retention.ms</code>) ou tamanho (<code>retention.bytes</code>): segmentos antigos do log são deletados integralmente após o período. Usado para eventos transitórios (logs de acesso, métricas).</p><p><b>Log compaction</b> (<code>cleanup.policy=compact</code>): Kafka mantém apenas o último valor para cada key. Mensagens com key anteriores são removidas em background. Permite reconstruir o estado atual de uma entidade sem replay de todo o histórico.</p><p>Casos de uso de compaction: topic de usuários (último estado de cada user_id), CDC de tabelas de banco de dados, configurações de aplicação.</p><p>Deletar registro: envie mensagem com key da entidade e value null (tombstone) — compaction remove a entrada.</p>",
      level: "senior",
      tip: "O tombstone (value null para deletar) é um detalhe que demonstra uso real de compaction em produção.",
    },
    {
      q: "Como o Kafka garante alta throughput?",
      a: "<p>Múltiplos mecanismos em conjunto:</p><ul><li><b>Sequential disk I/O</b>: Kafka escreve em append-only log, não em posições aleatórias. SSDs e HDDs são muito mais rápidos em escrita sequencial.</li><li><b>Batching</b>: producer agrupa mensagens (<code>linger.ms</code>, <code>batch.size</code>) antes de enviar — menos round trips.</li><li><b>Compressão</b>: lz4/snappy/zstd por batch — reduz volume de dados em rede e disco.</li><li><b>Zero-copy</b>: <code>sendfile()</code> do OS envia dados do disco diretamente para a rede sem cópia para user space.</li><li><b>Partições</b>: paralelismo horizontal — múltiplas partições em múltiplos brokers, múltiplos consumers em paralelo.</li><li><b>Page cache do OS</b>: Kafka usa page cache em vez de heap Java — evita GC e usa memória eficientemente.</li></ul>",
      level: "senior",
      tip: "Zero-copy (sendfile syscall) é o detalhe técnico que impressiona em entrevistas sênior. Poucos candidatos sabem disso.",
    },
    {
      q: "Como você escolhe o número de partitions de um topic?",
      a: "<p>Partitions = paralelismo máximo de consumo. Regras práticas:</p><ul><li>Número de partitions ≥ número de consumers que você quer em paralelo</li><li>Throughput alvo ÷ throughput por partition ≈ mínimo de partitions</li><li>Mais partitions = mais overhead: mais arquivos no disco, mais conexões, rebalancing mais lento, eleição de leader mais lenta em falha</li></ul><p>Aumentar partitions é fácil; diminuir é impossível sem recriar o topic. Comece conservador (6–12) e aumente se necessário.</p><p>Cuidado: muitas partitions com replication factor 3 multiplicam os arquivos nos brokers — 10.000 partitions pode ser problema operacional.</p>",
      level: "senior",
      tip: "A assimetria 'aumentar é fácil, diminuir é impossível' é um gotcha real que todo engenheiro sênior deve conhecer antes de criar topics em produção.",
    },
    {
      q: "O que é Kafka Connect e quando usá-lo?",
      a: "<p>Kafka Connect é um framework para integrar Kafka com sistemas externos sem escrever código custom. Connectors prontos para centenas de sistemas.</p><p><b>Source Connector</b>: lê de sistema externo e publica no Kafka (PostgreSQL via Debezium → Kafka, S3 → Kafka).</p><p><b>Sink Connector</b>: consome do Kafka e escreve em sistema externo (Kafka → Elasticsearch, Kafka → S3, Kafka → Snowflake).</p><p>Benefícios: gerenciamento de offset automático, escalabilidade horizontal de workers, schema evolution com Schema Registry, monitoramento centralizado.</p><p>Alternativas: Kafka Streams para transformações, scripts custom para casos simples, ou Flink para ETL complexo.</p>",
      level: "pleno",
      tip: "Citar Debezium como o connector de CDC mais popular (captura mudanças do PostgreSQL/MySQL em tempo real) demonstra contexto de uso real.",
    },
    {
      q: "Como você monitora um cluster Kafka em produção?",
      a: "<p>Métricas essenciais a monitorar:</p><ul><li><b>Consumer lag por grupo e partition</b>: métrica #1. Lag crescente = alarme.</li><li><b>Under-replicated partitions</b>: partitions com menos ISRs que o replication factor — sinal de broker lento ou falha.</li><li><b>Leader election rate</b>: elecões frequentes indicam brokers instáveis.</li><li><b>Request rate e latência</b>: produce/fetch latency por broker.</li><li><b>Disk usage</b>: Kafka usa muito disco. Alertar antes de ficar cheio.</li><li><b>Network I/O</b>: bytes-in/bytes-out por broker.</li></ul><p>Ferramentas: Prometheus JMX Exporter + Grafana, Confluent Control Center, Burrow (consumer lag), Cruise Control (rebalancing automático de carga entre brokers).</p>",
      level: "senior",
      tip: "Under-replicated partitions é o alerta mais crítico depois de consumer lag — indica que o cluster está em estado degradado e qualquer falha de broker pode causar perda de dados.",
    },
    {
      q: "Explique o papel do Zookeeper e o que mudou com o KRaft.",
      a: "<p>Historicamente, Kafka usava ZooKeeper para: armazenar metadata do cluster (topics, partitions, configs), eleger o controller broker, gerenciar listas de ISR e broker registry.</p><p><b>KRaft (Kafka Raft Metadata)</b>: introduzido no Kafka 3.x, elimina o ZooKeeper. O próprio Kafka gerencia metadata via protocolo Raft em um conjunto de nodes controller.</p><p>Vantagens do KRaft: menos componentes para operar, startup mais rápido, suporte a muito mais partitions (ZooKeeper era gargalo com >200k partitions), modelo de metadata mais simples.</p><p>Kafka 3.3+ suporta KRaft para produção. Kafka 4.0 remove ZooKeeper completamente.</p>",
      level: "senior",
      tip: "Saber que KRaft está maduro e é o futuro (ZooKeeper removido no Kafka 4.0) é contexto de atualização do ecossistema que demonstra senioridade.",
    },
    {
      q: "Como funciona o Schema Registry e por que é importante?",
      a: "<p>Schema Registry (Confluent) armazena schemas Avro, Protobuf ou JSON Schema versionados. Producer serializa com o schema registrado (ID do schema vai no header da mensagem). Consumer busca o schema pelo ID para deserializar.</p><p>Importância: sem Schema Registry, uma mudança de campo no producer quebra silenciosamente todos os consumers. Com SR, compatibilidade é verificada antes do registro:</p><ul><li><b>BACKWARD</b>: novo consumer consegue ler mensagens antigas (safe para upgrade de consumers)</li><li><b>FORWARD</b>: consumer antigo consegue ler mensagens com schema novo</li><li><b>FULL</b>: ambas as direções</li></ul><p>Adição de campo com default = compatível. Remoção de campo obrigatório = incompatível — quebra consumers.</p>",
      level: "senior",
      tip: "Dar um exemplo concreto de incompatibilidade (remover campo obrigatório) é mais impactante que listar os modos de compatibilidade abstratamente.",
    },
    {
      q: "Qual é a diferença entre Kafka Streams e um consumer group comum?",
      a: "<p><b>Consumer group comum</b>: você lê eventos, processa, e escreve o resultado onde quiser. Simples, flexível, sem estado gerenciado automaticamente. Adequado para processamento sem join ou agregações complexas.</p><p><b>Kafka Streams</b>: biblioteca que abstrai consumer + producer com suporte a: stateful operations (count, aggregate, join), windowing (tumbling, hopping, session windows), KTable (visão de tabela sobre um topic compactado), joins entre streams e tabelas. Estado armazenado em RocksDB local + changelog topic para recuperação após falha.</p><p>Kafka Streams é adequado quando: você precisa de join entre streams, agregações com janela de tempo, ou manter estado local eficientemente.</p>",
      level: "senior",
      tip: "Citar que o estado do Kafka Streams é armazenado em RocksDB + backed by changelog topic (para recuperação) demonstra entendimento da durabilidade do processamento stateful.",
    },
    {
      q: "Como você implementa um padrão de outbox com Kafka?",
      a: "<p>O problema: salvar no banco E publicar no Kafka são duas operações distintas — se o serviço cair após salvar mas antes de publicar, o evento é perdido.</p><p><b>Transactional Outbox</b>: escreva na tabela outbox dentro da mesma transação do banco. Um processo separado (ou Debezium CDC) lê a tabela outbox e publica no Kafka. Delete ou marque como publicado após confirmação.</p><p>Com Debezium: o CDC captura INSERTs na tabela outbox e publica automaticamente no Kafka — sem polling periódico, sem perda entre commit e publicação.</p><p>Garante: at-least-once delivery + consistência entre banco e evento publicado.</p>",
      level: "senior",
      tip: "O padrão outbox com Debezium é a implementação de referência para garantir consistência entre banco relacional e Kafka. Candidatos que conhecem essa combinação mostram experiência com sistemas distribuídos reais.",
    },
    {
      q: "Como você decide entre Kafka e RabbitMQ para um novo projeto?",
      a: "<p><b>Kafka quando</b>: alto volume (>100k msgs/s), replay de eventos necessário, múltiplos consumers independentes lendo o mesmo evento, event sourcing / auditoria, stream processing, CDC, retenção de histórico longo.</p><p><b>RabbitMQ quando</b>: filas tradicionais com roteamento complexo (exchanges, routing keys), mensagem deve ser deletada após consumo, volume moderado, dead-letter queues nativas simples, protocolo AMQP necessário, time-to-live por mensagem.</p><p>Diferença fundamental: Kafka é um log persistente — consumers leem sem deletar. RabbitMQ é uma fila — mensagem some após consumo. Kafka escala horizontalmente adicionando partitions; RabbitMQ escala de forma mais limitada.</p>",
      level: "senior",
      tip: "A distinção 'log persistente vs fila clássica' é o núcleo do trade-off. Candidatos que confundem os dois modelos mentais demonstram falta de experiência com ambos.",
    },
    {
      q: "O que é high watermark e qual seu papel na replicação?",
      a: "<p>High watermark (HW) é o offset até o qual todas as ISRs replicaram — é a 'borda segura' do log. Consumers só leem até o HW, nunca além — garante que dados lidos sejam duráveis.</p><p>Fluxo: producer escreve na partition leader (log end offset avança). Followers fazem fetch e replicam. Quando todas as ISRs replicaram até determinado offset, o leader avança o HW. Consumer pode ler até o HW.</p><p>Se o leader cair antes de um follower replicar, mensagens acima do HW do novo leader são truncadas — producer precisa reenviar. Com acks=all, o producer só recebe confirmação após o HW avançar, então não há perda.</p>",
      level: "senior",
      tip: "High watermark é o detalhe de internals que separa quem leu a documentação de quem estudou a implementação. Saber que consumer nunca lê além do HW é fundamental para entender o modelo de consistência.",
    },
    {
      q: "Como você lida com poison pills (mensagens que causam exceção no consumer)?",
      a: "<p>Poison pill = mensagem que causa exceção repetidamente, impedindo progresso do consumer (offset não avança, lag cresce infinitamente).</p><p>Estratégias:</p><ul><li><b>Dead Letter Topic (DLT)</b>: após N tentativas, mova a mensagem para um topic separado (ex: orders.DLT). Consumer do DLT analisa e trata manualmente ou com lógica de compensação.</li><li><b>Skip com log</b>: para erros não-críticos, log detalhado + comitar o offset mesmo sem processar.</li><li><b>Retry topic</b>: publicar em topic de retry com backoff exponencial antes de ir para DLT (padrão do Spring Kafka).</li></ul><p>Nunca deixe o consumer parar indefinidamente em loop de retry sem DLT — o consumer lag crescerá e o grupo ficará bloqueado naquela partition.</p>",
      level: "senior",
      tip: "Dead Letter Topic é padrão de produção obrigatório. Spring Kafka implementa retry + DLT nativamente — citar frameworks específicos valoriza a resposta.",
    },
    {
      q: "Como funciona a eleição de líder no Kafka (com KRaft)?",
      a: "<p>No KRaft (Kafka moderno sem ZooKeeper), um subconjunto de brokers são controllers (tipicamente 3). Eles mantêm o metadata log usando protocolo Raft.</p><p>O controller ativo (raft leader) gerencia todo o metadata: quem é leader de cada partition, quais brokers estão online, ISR de cada partition.</p><p>Eleição de partition leader: quando um broker falha, o controller ativo detecta e elege um membro da ISR como novo leader da partition. O processo é rápido (&lt;30s para detectar + eleger).</p><p>Eleição de controller: se o controller ativo falha, os outros controllers fazem eleição Raft entre si — o candidato com log mais atualizado vence.</p>",
      level: "senior",
      tip: "Diferenciar 'eleição de partition leader' (gerenciada pelo controller) de 'eleição de controller' (protocolo Raft entre controllers) demonstra entendimento da arquitetura KRaft.",
    },
    {
      q: "Quais são os principais parâmetros de performance do producer para tunar?",
      a: "<p>Parâmetros mais impactantes:</p><ul><li><code>linger.ms</code>: tempo de espera para acumular mensagens no batch antes de enviar. 0 = máxima latência baixa. 5–20ms = throughput melhor.</li><li><code>batch.size</code>: tamanho máximo do batch em bytes (padrão 16KB). Aumentar para 64–256KB melhora throughput.</li><li><code>compression.type</code>: lz4 ou snappy para throughput, zstd para melhor ratio. Compressão reduz bytes em rede e disco.</li><li><code>buffer.memory</code>: memória total do producer para buffers. Se producer produz mais rápido que pode enviar, bloqueia aqui.</li><li><code>max.in.flight.requests.per.connection</code>: com idempotência, deve ser ≤ 5. Sem idempotência, mais = mais throughput mas risco de reordenação.</li></ul>",
      level: "senior",
      tip: "A relação entre linger.ms e latência vs throughput é o trade-off fundamental. Tunar sem medir com benchmarks reais (kafka-producer-perf-test.sh) é chute.",
    },
    {
      q: "O que acontece com mensagens não confirmadas quando um producer tem retries configurado?",
      a: "<p>Com <code>retries > 0</code> e <code>enable.idempotence=false</code>: o producer reenvia a mensagem após timeout. Se o broker recebeu mas a confirmação foi perdida na rede, o broker recebe a mensagem novamente → <b>duplicata</b>.</p><p>Com <code>enable.idempotence=true</code>: cada mensagem tem sequence number por partition. O broker rastreia o último sequence number aceito de cada producer — duplicata é detectada e descartada silenciosamente. O producer recebe ACK normalmente.</p><p>Com transações: atomicidade entre múltiplos topics — ou tudo comita ou tudo aborta, mesmo após falha e reinício do producer.</p><p>Regra prática: sempre use <code>enable.idempotence=true</code> em produção. O overhead é mínimo e a garantia é significativa.</p>",
      level: "senior",
      tip: "Demonstrar o caminho completo (retry → duplicata → sequence number → deduplicação) mostra que você entende o mecanismo, não apenas a flag de configuração.",
    },
  ],
  diagrams: [
    {
      title: "Arquitetura Kafka — Topics, Partitions e Consumer Groups",
      caption: "Fluxo de dados do producer para consumer group, com partitions distribuídas entre brokers",
      html: `<style>
.kafka-arch { font-family: 'Space Grotesk', sans-serif; color: #e2e8f0; padding: 16px; background: #0f172a; border-radius: 12px; }
.kafka-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
.kafka-block { background: #1e293b; border-radius: 10px; padding: 12px; border: 1px solid #334155; }
.kafka-label { font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; letter-spacing: .08em; }
.kafka-prod-c { color: #f59e0b; border-color: #f59e0b !important; }
.kafka-broker-c { color: #8b5cf6; border-color: #334155; }
.kafka-cons-c { color: #10b981; border-color: #10b981 !important; }
.kafka-part { background: #0f172a; border-radius: 6px; padding: 5px 8px; font-size: 11px; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
.kafka-part-name { font-weight: 600; }
.kafka-part-msgs { display: flex; gap: 3px; }
.kafka-msg { width: 16px; height: 16px; border-radius: 3px; font-size: 9px; display: flex; align-items: center; justify-content: center; font-weight: 700; }
.kafka-msg-0 { background: #ef4444; color: white; }
.kafka-msg-1 { background: #f59e0b; color: white; }
.kafka-msg-2 { background: #10b981; color: white; }
.kafka-arr { color: #64748b; font-size: 20px; align-self: center; }
.kafka-cg { background: #1e293b; border: 1px solid #10b981; border-radius: 10px; padding: 12px; }
.kafka-consumer { background: #0f172a; border-radius: 6px; padding: 5px 10px; font-size: 11px; margin-bottom: 4px; color: #10b981; }
</style>
<div class="kafka-arch">
  <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:12px;">Arquitetura Kafka</div>
  <div class="kafka-row">
    <div class="kafka-block" style="border-color:#f59e0b;flex-shrink:0;">
      <div class="kafka-label kafka-prod-c">Producers</div>
      <div class="kafka-consumer" style="color:#f59e0b;">Producer A (key: user-1)</div>
      <div class="kafka-consumer" style="color:#f59e0b;">Producer B (key: user-2)</div>
      <div class="kafka-consumer" style="color:#f59e0b;">Producer C (sem key)</div>
    </div>
    <div class="kafka-arr">→</div>
    <div class="kafka-block" style="flex:1;">
      <div class="kafka-label kafka-broker-c">Topic: orders (3 partitions, RF=3)</div>
      <div class="kafka-part">
        <div class="kafka-part-name" style="color:#8b5cf6;">P-0</div>
        <div class="kafka-part-msgs">
          <div class="kafka-msg kafka-msg-0">0</div>
          <div class="kafka-msg kafka-msg-0">3</div>
          <div class="kafka-msg kafka-msg-0">6</div>
        </div>
        <span style="font-size:10px;color:#64748b;">leader: broker-1</span>
      </div>
      <div class="kafka-part">
        <div class="kafka-part-name" style="color:#8b5cf6;">P-1</div>
        <div class="kafka-part-msgs">
          <div class="kafka-msg kafka-msg-1">1</div>
          <div class="kafka-msg kafka-msg-1">4</div>
          <div class="kafka-msg kafka-msg-1">7</div>
        </div>
        <span style="font-size:10px;color:#64748b;">leader: broker-2</span>
      </div>
      <div class="kafka-part">
        <div class="kafka-part-name" style="color:#8b5cf6;">P-2</div>
        <div class="kafka-part-msgs">
          <div class="kafka-msg kafka-msg-2">2</div>
          <div class="kafka-msg kafka-msg-2">5</div>
          <div class="kafka-msg kafka-msg-2">8</div>
        </div>
        <span style="font-size:10px;color:#64748b;">leader: broker-3</span>
      </div>
    </div>
    <div class="kafka-arr">→</div>
    <div class="kafka-cg" style="flex-shrink:0;">
      <div class="kafka-label kafka-cons-c">Consumer Group: order-processor</div>
      <div class="kafka-consumer">Consumer-1 ← P-0</div>
      <div class="kafka-consumer">Consumer-2 ← P-1</div>
      <div class="kafka-consumer">Consumer-3 ← P-2</div>
    </div>
  </div>
  <div style="font-size:11px;color:#64748b;margin-top:4px;">⚠ Adicionar Consumer-4 no grupo: fica ocioso (3 partitions, 3 consumers já = paralelismo máximo)</div>
</div>`,
    },
    {
      title: "Replicação, ISR e High Watermark",
      caption: "Como o Kafka garante durabilidade com replication factor=3 e ISR",
      html: `<style>
.kafka-rep { font-family: 'Space Grotesk', sans-serif; color: #e2e8f0; padding: 16px; background: #0f172a; border-radius: 12px; }
.kafka-broker-row { display: flex; gap: 10px; margin-bottom: 12px; }
.kafka-br { background: #1e293b; border-radius: 10px; padding: 12px; flex: 1; border: 1px solid #334155; }
.kafka-br-leader { border-color: #ef4444; }
.kafka-br-isr { border-color: #10b981; }
.kafka-br-title { font-size: 11px; font-weight: 700; margin-bottom: 8px; }
.kafka-br-leader .kafka-br-title { color: #ef4444; }
.kafka-br-isr .kafka-br-title { color: #10b981; }
.kafka-offset-row { display: flex; gap: 3px; margin-bottom: 6px; }
.kafka-offset { background: #0f172a; border-radius: 4px; padding: 3px 6px; font-size: 10px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.kafka-offset-written { color: #10b981; }
.kafka-offset-hw { background: #10b981; color: #0f172a; }
.kafka-offset-future { color: #334155; border: 1px solid #334155; }
.kafka-hw-label { font-size: 10px; color: #64748b; margin-bottom: 8px; }
.kafka-acks-box { background: #1e293b; border-radius: 8px; padding: 10px; margin-top: 10px; }
.kafka-acks-title { font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 6px; }
.kafka-ack-row { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; padding: 4px 6px; border-radius: 4px; }
.kafka-ack-0 { background: #450a0a; color: #fca5a5; }
.kafka-ack-1 { background: #451a03; color: #fdba74; }
.kafka-ack-all { background: #052e16; color: #86efac; }
</style>
<div class="kafka-rep">
  <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:12px;">Replicação — Partition P-0 (RF=3)</div>
  <div class="kafka-broker-row">
    <div class="kafka-br kafka-br-leader">
      <div class="kafka-br-title">Broker-1 (LEADER)</div>
      <div class="kafka-hw-label">Log End Offset = 7</div>
      <div class="kafka-offset-row">
        <div class="kafka-offset kafka-offset-written">0</div>
        <div class="kafka-offset kafka-offset-written">1</div>
        <div class="kafka-offset kafka-offset-written">2</div>
        <div class="kafka-offset kafka-offset-written">3</div>
        <div class="kafka-offset kafka-offset-written">4</div>
        <div class="kafka-offset kafka-offset-hw">HW=5</div>
        <div class="kafka-offset kafka-offset-written">6</div>
        <div class="kafka-offset kafka-offset-written">7</div>
      </div>
    </div>
    <div class="kafka-br kafka-br-isr">
      <div class="kafka-br-title">Broker-2 (ISR follower)</div>
      <div class="kafka-hw-label">Replicado até offset 5</div>
      <div class="kafka-offset-row">
        <div class="kafka-offset kafka-offset-written">0</div>
        <div class="kafka-offset kafka-offset-written">1</div>
        <div class="kafka-offset kafka-offset-written">2</div>
        <div class="kafka-offset kafka-offset-written">3</div>
        <div class="kafka-offset kafka-offset-written">4</div>
        <div class="kafka-offset kafka-offset-hw">HW=5</div>
        <div class="kafka-offset kafka-offset-future">-</div>
        <div class="kafka-offset kafka-offset-future">-</div>
      </div>
    </div>
    <div class="kafka-br kafka-br-isr">
      <div class="kafka-br-title">Broker-3 (ISR follower)</div>
      <div class="kafka-hw-label">Replicado até offset 5</div>
      <div class="kafka-offset-row">
        <div class="kafka-offset kafka-offset-written">0</div>
        <div class="kafka-offset kafka-offset-written">1</div>
        <div class="kafka-offset kafka-offset-written">2</div>
        <div class="kafka-offset kafka-offset-written">3</div>
        <div class="kafka-offset kafka-offset-written">4</div>
        <div class="kafka-offset kafka-offset-hw">HW=5</div>
        <div class="kafka-offset kafka-offset-future">-</div>
        <div class="kafka-offset kafka-offset-future">-</div>
      </div>
    </div>
  </div>
  <div style="font-size:11px;color:#64748b;margin-bottom:10px;">Consumer só lê até HW=5. Offsets 6-7 ainda não estão no HW → não visíveis.</div>
  <div class="kafka-acks-box">
    <div class="kafka-acks-title">acks — trade-off durabilidade vs latência</div>
    <div class="kafka-ack-row kafka-ack-0"><span>acks=0</span><span>Fire-and-forget. Pode perder mensagens.</span></div>
    <div class="kafka-ack-row kafka-ack-1"><span>acks=1</span><span>Leader confirma. Perde se leader cair antes de replicar.</span></div>
    <div class="kafka-ack-row kafka-ack-all"><span>acks=all</span><span>Leader + todas ISRs confirmam. Mais seguro.</span></div>
  </div>
</div>`,
    },
    {
      title: "Consumer Group — Rebalancing e Offset Commit",
      caption: "Ciclo de vida do consumer, rebalancing e estratégias de commit de offset",
      html: `<style>
.kafka-cg { font-family: 'Space Grotesk', sans-serif; color: #e2e8f0; padding: 16px; background: #0f172a; border-radius: 12px; }
.kafka-cg-states { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.kafka-cg-state { padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; }
.kafka-st-join { background: #1e293b; border: 1px solid #f59e0b; color: #f59e0b; }
.kafka-st-sync { background: #1e293b; border: 1px solid #8b5cf6; color: #8b5cf6; }
.kafka-st-stable { background: #1e293b; border: 1px solid #10b981; color: #10b981; }
.kafka-st-rebal { background: #1e293b; border: 1px solid #ef4444; color: #ef4444; }
.kafka-arr-sm { color: #64748b; font-size: 14px; align-self: center; }
.kafka-commit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.kafka-commit-card { background: #1e293b; border-radius: 8px; padding: 10px; border: 1px solid #334155; }
.kafka-commit-title { font-size: 11px; font-weight: 700; color: #f8fafc; margin-bottom: 6px; }
.kafka-commit-desc { font-size: 11px; color: #94a3b8; line-height: 1.4; }
.kafka-commit-risk { font-size: 10px; margin-top: 6px; padding: 3px 6px; border-radius: 4px; }
.kafka-risk-low { background: #052e16; color: #86efac; }
.kafka-risk-high { background: #450a0a; color: #fca5a5; }
.kafka-offset-diagram { background: #1e293b; border-radius: 8px; padding: 10px; margin-bottom: 10px; }
.kafka-offset-track { display: flex; align-items: center; gap: 4px; font-size: 11px; }
.kafka-ot-msg { background: #334155; border-radius: 4px; padding: 3px 6px; font-family: 'JetBrains Mono', monospace; color: #94a3b8; }
.kafka-ot-committed { background: #10b981; border-radius: 4px; padding: 3px 6px; font-family: 'JetBrains Mono', monospace; color: #0f172a; font-weight: 700; }
.kafka-ot-processing { background: #f59e0b; border-radius: 4px; padding: 3px 6px; font-family: 'JetBrains Mono', monospace; color: #0f172a; font-weight: 700; }
</style>
<div class="kafka-cg">
  <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:10px;">Consumer Group Lifecycle</div>
  <div class="kafka-cg-states">
    <div class="kafka-cg-state kafka-st-join">JOIN (heartbeat)</div>
    <div class="kafka-arr-sm">→</div>
    <div class="kafka-cg-state kafka-st-sync">SYNC (assign partitions)</div>
    <div class="kafka-arr-sm">→</div>
    <div class="kafka-cg-state kafka-st-stable">STABLE (consuming)</div>
    <div class="kafka-arr-sm">→</div>
    <div class="kafka-cg-state kafka-st-rebal">REBALANCING</div>
  </div>
  <div class="kafka-offset-diagram">
    <div style="font-size:11px;font-weight:700;color:#94a3b8;margin-bottom:6px;">Posição de offset no log</div>
    <div class="kafka-offset-track">
      <div class="kafka-ot-msg">off:0</div>
      <div class="kafka-ot-msg">off:1</div>
      <div class="kafka-ot-committed">off:2 ✓</div>
      <div class="kafka-ot-processing">off:3 (processando)</div>
      <div class="kafka-ot-msg">off:4</div>
      <div class="kafka-ot-msg">off:5</div>
      <span style="font-size:10px;color:#64748b;margin-left:4px;">← não lidos ainda</span>
    </div>
    <div style="font-size:10px;color:#64748b;margin-top:6px;">Se crash ocorrer agora: off:3 será reprocessado (at-least-once)</div>
  </div>
  <div class="kafka-commit-grid">
    <div class="kafka-commit-card">
      <div class="kafka-commit-title">Auto-commit (enable.auto.commit=true)</div>
      <div class="kafka-commit-desc">Comita a cada auto.commit.interval.ms (5s por padrão), independente de processar.</div>
      <div class="kafka-commit-risk kafka-risk-high">Risco: commit antes de processar → perda em crash</div>
    </div>
    <div class="kafka-commit-card">
      <div class="kafka-commit-title">Manual commit (commitSync/Async)</div>
      <div class="kafka-commit-desc">Processa → chama commitSync() após confirmar sucesso. Controle total sobre o momento do commit.</div>
      <div class="kafka-commit-risk kafka-risk-low">Garante at-least-once. Duplicatas possíveis, não perda.</div>
    </div>
  </div>
</div>`,
    },
  ],
  mnemonics: [
    {
      label: "KAPRO — Producer Config",
      trick: "Key, Acks, Partition, Retry, Order",
      explanation: "Key determina a partição (ordem por entidade). Acks define durabilidade (0/1/all). Partition count define paralelismo. Retry com idempotência evita duplicatas. Order é garantida só dentro de uma partição.",
    },
    {
      label: "ISR = 'I Still Replicate'",
      trick: "ISR = replicas que ainda estão sincronizadas com o leader",
      explanation: "In-Sync Replicas são os followers que acompanham o leader dentro do replica.lag.time.max.ms. acks=all exige confirmação de todas ISRs. Follower atrasado sai da ISR — não conta para acks. Volta quando resincrona.",
    },
    {
      label: "HW — High Water Mark",
      trick: "Consumer só bebe até a linha d'água",
      explanation: "High Watermark é o offset até onde todas as ISRs replicaram. Consumer nunca lê além do HW — garante que o que foi lido é durável. Log End Offset é maior que HW quando há mensagens ainda sendo replicadas.",
    },
    {
      label: "LAG = ALERT",
      trick: "Lag crescente = consumer morrendo ou processamento lento",
      explanation: "Consumer lag = log end offset - committed offset. Lag estável (mesmo que alto) pode ser ok. Lag crescendo linearmente = consumer não consegue acompanhar o throughput. Ação: mais consumers (até limite de partitions) ou otimizar o processamento.",
    },
  ],
  cheatsheet: {
    title: "Kafka CLI — Cheatsheet de Operações",
    caption: "Comandos essenciais do kafka-topics, kafka-console-producer/consumer e kafka-consumer-groups",
    html: `<style>
.kafka-cs { font-family: 'JetBrains Mono', monospace; background: #0f172a; border-radius: 12px; padding: 16px; color: #e2e8f0; }
.kafka-cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.kafka-cs-section { background: #1e293b; border-radius: 8px; padding: 12px; border: 1px solid #334155; }
.kafka-cs-title { font-size: 11px; font-weight: 700; color: #8b5cf6; text-transform: uppercase; margin-bottom: 8px; letter-spacing: .08em; font-family: 'Space Grotesk', sans-serif; }
.kafka-cs-cmd { font-size: 10px; color: #10b981; margin-bottom: 5px; line-height: 1.4; }
.kafka-cs-comment { color: #64748b; }
</style>
<div class="kafka-cs">
  <div style="font-size:13px;font-weight:700;font-family:'Space Grotesk',sans-serif;color:#f8fafc;margin-bottom:12px;">Kafka CLI Cheatsheet</div>
  <div class="kafka-cs-grid">
    <div class="kafka-cs-section">
      <div class="kafka-cs-title">Topics</div>
      <div class="kafka-cs-cmd">kafka-topics.sh --create --topic orders \<br>&nbsp; --partitions 6 --replication-factor 3 \<br>&nbsp; --bootstrap-server kafka:9092</div>
      <div class="kafka-cs-cmd">kafka-topics.sh --list --bootstrap-server kafka:9092</div>
      <div class="kafka-cs-cmd">kafka-topics.sh --describe --topic orders \<br>&nbsp; --bootstrap-server kafka:9092 <span class="kafka-cs-comment"># ISR, leader</span></div>
      <div class="kafka-cs-cmd">kafka-topics.sh --alter --topic orders \<br>&nbsp; --partitions 12 <span class="kafka-cs-comment"># só aumenta</span></div>
    </div>
    <div class="kafka-cs-section">
      <div class="kafka-cs-title">Produzir / Consumir</div>
      <div class="kafka-cs-cmd">kafka-console-producer.sh \<br>&nbsp; --topic orders --bootstrap-server kafka:9092</div>
      <div class="kafka-cs-cmd">kafka-console-consumer.sh \<br>&nbsp; --topic orders --from-beginning \<br>&nbsp; --bootstrap-server kafka:9092</div>
      <div class="kafka-cs-cmd">kafka-console-consumer.sh \<br>&nbsp; --group my-group --topic orders \<br>&nbsp; --bootstrap-server kafka:9092</div>
    </div>
    <div class="kafka-cs-section">
      <div class="kafka-cs-title">Consumer Groups</div>
      <div class="kafka-cs-cmd">kafka-consumer-groups.sh --list \<br>&nbsp; --bootstrap-server kafka:9092</div>
      <div class="kafka-cs-cmd">kafka-consumer-groups.sh --describe \<br>&nbsp; --group order-processor \<br>&nbsp; --bootstrap-server kafka:9092 <span class="kafka-cs-comment"># lag!</span></div>
      <div class="kafka-cs-cmd">kafka-consumer-groups.sh --reset-offsets \<br>&nbsp; --group order-processor --topic orders \<br>&nbsp; --to-earliest --execute \<br>&nbsp; --bootstrap-server kafka:9092 <span class="kafka-cs-comment"># replay</span></div>
    </div>
    <div class="kafka-cs-section">
      <div class="kafka-cs-title">Performance</div>
      <div class="kafka-cs-cmd">kafka-producer-perf-test.sh \<br>&nbsp; --topic orders --num-records 1000000 \<br>&nbsp; --record-size 1000 --throughput -1 \<br>&nbsp; --producer-props bootstrap.servers=kafka:9092</div>
      <div class="kafka-cs-cmd">kafka-consumer-perf-test.sh \<br>&nbsp; --topic orders --messages 1000000 \<br>&nbsp; --bootstrap-server kafka:9092</div>
    </div>
  </div>
</div>`,
  },
  mindmap: {
    title: "Mapa Mental — Apache Kafka",
    html: `<style>
.kafka-mm { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.kafka-mm-center { text-align: center; background: #8b5cf6; color: white; padding: 10px 24px; border-radius: 30px; font-weight: 800; font-size: 16px; display: inline-block; }
.kafka-mm-wrap { display: flex; justify-content: center; margin-bottom: 16px; }
.kafka-mm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.kafka-mm-node { background: #1e293b; border-radius: 10px; padding: 10px 12px; border: 1px solid #334155; }
.kafka-mm-node-title { font-size: 12px; font-weight: 700; margin-bottom: 6px; }
.kafka-mm-item { font-size: 11px; color: #94a3b8; margin-bottom: 2px; padding-left: 8px; position: relative; }
.kafka-mm-item::before { content: "·"; position: absolute; left: 0; color: #8b5cf6; }
</style>
<div class="kafka-mm">
  <div class="kafka-mm-wrap"><div class="kafka-mm-center">Apache Kafka</div></div>
  <div class="kafka-mm-grid">
    <div class="kafka-mm-node">
      <div class="kafka-mm-node-title" style="color:#f59e0b;">Armazenamento</div>
      <div class="kafka-mm-item">Topic / Partition</div>
      <div class="kafka-mm-item">Offset (posição)</div>
      <div class="kafka-mm-item">Retention (tempo/tamanho)</div>
      <div class="kafka-mm-item">Log compaction</div>
    </div>
    <div class="kafka-mm-node">
      <div class="kafka-mm-node-title" style="color:#ef4444;">Producer</div>
      <div class="kafka-mm-item">acks (0/1/all)</div>
      <div class="kafka-mm-item">Partition key</div>
      <div class="kafka-mm-item">Batching (linger.ms)</div>
      <div class="kafka-mm-item">Idempotência</div>
    </div>
    <div class="kafka-mm-node">
      <div class="kafka-mm-node-title" style="color:#10b981;">Consumer</div>
      <div class="kafka-mm-item">Consumer Group</div>
      <div class="kafka-mm-item">Offset commit</div>
      <div class="kafka-mm-item">Rebalancing</div>
      <div class="kafka-mm-item">Consumer lag</div>
    </div>
    <div class="kafka-mm-node">
      <div class="kafka-mm-node-title" style="color:#8b5cf6;">Replicação</div>
      <div class="kafka-mm-item">Replication Factor</div>
      <div class="kafka-mm-item">ISR (In-Sync Replicas)</div>
      <div class="kafka-mm-item">High Watermark</div>
      <div class="kafka-mm-item">Leader election</div>
    </div>
    <div class="kafka-mm-node">
      <div class="kafka-mm-node-title" style="color:#38bdf8;">Ecossistema</div>
      <div class="kafka-mm-item">Schema Registry</div>
      <div class="kafka-mm-item">Kafka Connect</div>
      <div class="kafka-mm-item">Kafka Streams / ksqlDB</div>
      <div class="kafka-mm-item">KRaft (sem ZooKeeper)</div>
    </div>
    <div class="kafka-mm-node">
      <div class="kafka-mm-node-title" style="color:#06b6d4;">Operação</div>
      <div class="kafka-mm-item">Prometheus JMX Exporter</div>
      <div class="kafka-mm-item">Burrow (lag tracking)</div>
      <div class="kafka-mm-item">Cruise Control</div>
      <div class="kafka-mm-item">Dead Letter Topic</div>
    </div>
  </div>
</div>`,
  },
  exercises: [
    {
      level: "iniciante",
      title: "Criar topic e publicar/consumir mensagens via CLI",
      description: "Usando Docker Compose com Kafka (bitnami/kafka ou confluentinc), crie um topic 'pedidos' com 3 partitions e replication factor 1. Use kafka-console-producer para publicar 10 mensagens. Use kafka-console-consumer --from-beginning para consumir todas. Observe a distribuição por partition com kafka-topics --describe.",
      concepts: ["topic", "partition", "offset", "replication factor", "kafka-console-producer", "kafka-console-consumer"],
    },
    {
      level: "iniciante",
      title: "Consumer groups e paralelismo",
      description: "Com o topic 'pedidos' de 3 partitions, inicie 3 consumers no mesmo grupo 'processador-grupo'. Publique 30 mensagens e observe cada consumer recebendo apenas 1/3 das mensagens. Depois adicione um 4º consumer ao grupo — observe que ele fica ocioso. Remova um consumer e observe o rebalancing redistribuindo as partitions.",
      concepts: ["consumer group", "partition assignment", "rebalancing", "paralelismo"],
    },
    {
      level: "intermediario",
      title: "Partition key para garantia de ordem",
      description: "Crie um topic 'eventos-usuario' com 6 partitions. Escreva um producer que envia eventos de 3 usuários (IDs: 'user-1', 'user-2', 'user-3') usando o user-ID como partition key. Produza 50 eventos para cada usuário em ordem crescente (seq=1..50). Escreva um consumer e verifique que todos os eventos de cada usuário chegam em ordem sequencial, mesmo que eventos de usuários diferentes cheguem intercalados.",
      concepts: ["partition key", "ordering guarantee", "hash partitioner", "consumer ordering"],
    },
    {
      level: "intermediario",
      title: "Offset commit manual e simulação de reprocessamento",
      description: "Implemente um consumer com commitSync() manual (auto.commit=false). Processe mensagens que somam valores em um acumulador. Após processar um lote de 10 mensagens, comite o offset. Simule um crash (exception) na mensagem 7 de um lote sem comitar. Reinicie o consumer e verifique que as 10 mensagens do lote são reprocessadas desde o último offset comitado (at-least-once). Compare com auto-commit e documente a diferença.",
      concepts: ["offset commit", "at-least-once", "manual commit", "commitSync", "reprocessamento"],
    },
    {
      level: "senior",
      title: "Exactly-once com producer transacional e dead letter topic",
      description: "Implemente um pipeline: Producer transacional lê de um banco de dados e publica em Kafka com enable.idempotence=true e transactional.id. Consumer com isolation.level=read_committed processa os eventos e chama uma API externa. Implemente Dead Letter Topic: após 3 tentativas de chamar a API, publique a mensagem no topic 'pedidos.DLT' com headers de diagnóstico (erro, tentativas, timestamp). Implemente consumer do DLT que gera alerta. Verifique que poison pills não bloqueiam o consumer principal.",
      concepts: ["exactly-once", "transactional producer", "isolation.level", "dead letter topic", "poison pill", "idempotence"],
    },
  ],
  codeExamples: [
    {
      title: "Producer com acks=all, idempotência e serialização Avro",
      language: "typescript",
      code: `import { Kafka, CompressionTypes } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka-1:9092', 'kafka-2:9092', 'kafka-3:9092'],
})

const producer = kafka.producer({
  // Idempotência: garante exatamente uma entrega por partition
  idempotent: true,
  // acks=all é obrigatório com idempotência
  // maxInFlightRequests=5 é o máximo permitido com idempotência
  maxInFlightRequests: 5,
  // Retry automático com backoff exponencial
  retry: {
    initialRetryTime: 100,
    retries: 10,
  },
})

interface OrderEvent {
  orderId: string
  userId: string
  total: number
  status: 'created' | 'paid' | 'shipped'
  timestamp: string
}

async function publishOrderEvent(event: OrderEvent): Promise<void> {
  await producer.connect()

  await producer.send({
    topic: 'orders',
    compression: CompressionTypes.LZ4,  // throughput melhor
    messages: [
      {
        // Partition key = userId → todos os eventos do mesmo usuário
        // vão para a mesma partition → ordem garantida por usuário
        key: event.userId,
        value: JSON.stringify(event),
        headers: {
          'event-type': 'order.created',
          'correlation-id': crypto.randomUUID(),
          'source-service': 'order-service',
        },
        // timestamp opcional (Kafka usa o do broker se omitido)
        timestamp: Date.now().toString(),
      },
    ],
  })

  console.log(\`Published order \${event.orderId} to partition key \${event.userId}\`)
}

// Transação: publicar atomicamente em múltiplos topics
async function publishOrderWithPayment(
  orderEvent: OrderEvent,
  paymentEvent: { paymentId: string; amount: number }
): Promise<void> {
  const transactionalProducer = kafka.producer({
    idempotent: true,
    transactionalId: \`order-tx-\${orderEvent.orderId}\`, // único por instância
    maxInFlightRequests: 5,
  })

  await transactionalProducer.connect()

  const transaction = await transactionalProducer.transaction()
  try {
    await transaction.send({
      topic: 'orders',
      messages: [{ key: orderEvent.userId, value: JSON.stringify(orderEvent) }],
    })
    await transaction.send({
      topic: 'payments',
      messages: [{ key: orderEvent.orderId, value: JSON.stringify(paymentEvent) }],
    })
    // Ambas as mensagens são visíveis juntas ou nenhuma (isolation.level=read_committed)
    await transaction.commit()
  } catch (error) {
    await transaction.abort()
    throw error
  }
}`,
    },
    {
      title: "Consumer com manual commit, retry e Dead Letter Topic",
      language: "typescript",
      code: `import { Kafka, EachMessagePayload } from 'kafkajs'

const kafka = new Kafka({ clientId: 'order-processor', brokers: ['kafka:9092'] })

const consumer = kafka.consumer({
  groupId: 'order-processor-group',
  // Heartbeat para evitar rebalancing por timeout
  heartbeatInterval: 3000,
  sessionTimeout: 30000,
  // Quantas mensagens buscar por poll (impacta max.poll.interval.ms)
  maxBytesPerPartition: 1048576, // 1MB
})

const producer = kafka.producer({ idempotent: true })

const DLT_TOPIC = 'orders.DLT'
const MAX_RETRIES = 3

async function processMessage(payload: EachMessagePayload): Promise<void> {
  const { topic, partition, message } = payload
  const value = message.value?.toString()
  if (!value) return

  const event = JSON.parse(value)
  let lastError: Error | null = null

  // Retry com backoff exponencial antes de enviar para DLT
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await callExternalApi(event)
      return // sucesso: sai do loop
    } catch (error) {
      lastError = error as Error
      console.warn(\`Attempt \${attempt}/\${MAX_RETRIES} failed for offset \${message.offset}\`)
      if (attempt < MAX_RETRIES) {
        await sleep(100 * Math.pow(2, attempt)) // 200ms, 400ms
      }
    }
  }

  // Todas as tentativas falharam: enviar para DLT
  await producer.send({
    topic: DLT_TOPIC,
    messages: [{
      key: message.key,
      value: message.value,
      headers: {
        'original-topic': topic,
        'original-partition': String(partition),
        'original-offset': message.offset,
        'failure-reason': lastError?.message ?? 'unknown',
        'attempts': String(MAX_RETRIES),
        'failed-at': new Date().toISOString(),
      },
    }],
  })

  console.error(\`Message sent to DLT after \${MAX_RETRIES} failures. Offset: \${message.offset}\`)
  // NÃO lançamos exceção aqui: queremos comitar o offset e avançar
}

async function startConsumer(): Promise<void> {
  await consumer.connect()
  await producer.connect()

  await consumer.subscribe({
    topics: ['orders'],
    fromBeginning: false,
  })

  await consumer.run({
    // auto-commit DESABILITADO — controle manual
    autoCommit: false,
    eachMessage: async (payload) => {
      try {
        await processMessage(payload)
      } finally {
        // Comita SEMPRE após processar (com ou sem DLT)
        // Garante at-least-once: nunca perdemos mensagens
        await consumer.commitOffsets([{
          topic: payload.topic,
          partition: payload.partition,
          offset: String(Number(payload.message.offset) + 1),
        }])
      }
    },
  })
}

async function callExternalApi(event: unknown): Promise<void> {
  // simulação de API externa que pode falhar
  const response = await fetch('https://api.example.com/process', {
    method: 'POST',
    body: JSON.stringify(event),
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error(\`API returned \${response.status}\`)
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))`,
    },
    {
      title: "Docker Compose — Kafka + Schema Registry + UI",
      language: "yaml",
      code: `# docker-compose.yml — Kafka local com KRaft (sem ZooKeeper)
version: "3.8"

services:
  kafka:
    image: bitnami/kafka:3.7
    ports:
      - "9092:9092"
      - "9093:9093"
    environment:
      # KRaft mode — sem ZooKeeper
      KAFKA_CFG_NODE_ID: 1
      KAFKA_CFG_PROCESS_ROLES: controller,broker
      KAFKA_CFG_CONTROLLER_QUORUM_VOTERS: "1@kafka:9093"
      KAFKA_CFG_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_CFG_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      KAFKA_CFG_CONTROLLER_LISTENER_NAMES: CONTROLLER
      # Configurações de desempenho e durabilidade
      KAFKA_CFG_DEFAULT_REPLICATION_FACTOR: 1   # local: 1, produção: 3
      KAFKA_CFG_MIN_INSYNC_REPLICAS: 1           # local: 1, produção: 2
      KAFKA_CFG_NUM_PARTITIONS: 3
      KAFKA_CFG_LOG_RETENTION_HOURS: 168         # 7 dias
      KAFKA_CFG_LOG_SEGMENT_BYTES: 1073741824    # 1GB por segmento
    volumes:
      - kafka_data:/bitnami/kafka

  schema-registry:
    image: confluentinc/cp-schema-registry:7.6.0
    ports:
      - "8081:8081"
    environment:
      SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: kafka:9092
      SCHEMA_REGISTRY_HOST_NAME: schema-registry
      SCHEMA_REGISTRY_LISTENERS: http://0.0.0.0:8081
    depends_on:
      - kafka

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    ports:
      - "8080:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
      KAFKA_CLUSTERS_0_SCHEMAREGISTRY: http://schema-registry:8081
    depends_on:
      - kafka
      - schema-registry

volumes:
  kafka_data:`,
    },
    {
      title: "Kafka Streams — Agregação com janela de tempo",
      language: "java",
      code: `// Kafka Streams: conta pedidos por usuário em janelas de 5 minutos
// (Java — Kafka Streams é biblioteca JVM)
import org.apache.kafka.streams.*;
import org.apache.kafka.streams.kstream.*;
import java.time.Duration;
import java.util.Properties;

public class OrderCountStream {

    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "order-count-app");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        // Exactly-once no Streams
        props.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE_V2);

        StreamsBuilder builder = new StreamsBuilder();

        // Input topic: orders (key=userId, value=JSON do pedido)
        KStream<String, String> orders = builder.stream("orders");

        // Janela tumbling de 5 minutos: conta pedidos por usuário
        orders
            .groupByKey()
            .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(5)))
            .count(Materialized.as("order-counts-store"))
            .toStream()
            .map((windowedKey, count) -> {
                String userId = windowedKey.key();
                String windowStart = windowedKey.window().startTime().toString();
                return KeyValue.pair(
                    userId,
                    String.format(
                        "{\"userId\":\"%s\",\"window\":\"%s\",\"count\":%d}",
                        userId, windowStart, count
                    )
                );
            })
            .to("order-counts-per-user"); // Output topic

        KafkaStreams streams = new KafkaStreams(builder.build(), props);

        // State store: consulta interativa (sem precisar de outro consumer)
        // ReadOnlyWindowStore<String, Long> store =
        //   streams.store(StoreQueryParameters.fromNameAndType(
        //     "order-counts-store", QueryableStoreTypes.windowStore()));

        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
        streams.start();
    }
}`,
    },
  ],
  videos: [
    {
      title: "Apache Kafka Fundamentals (Full Course)",
      channel: "Confluent",
      url: "https://developer.confluent.io/courses/apache-kafka/events/",
      topic: "Fundamentos: topics, partitions, consumer groups, ISR",
    },
    {
      title: "Apache Kafka in 1 hour for Beginners",
      channel: "Stephane Maarek",
      url: "https://www.youtube.com/watch?v=ut5kp56wW_4",
      topic: "Visão geral prática com exemplos reais",
    },
    {
      title: "Kafka Producer Internals — Deep Dive",
      channel: "Confluent",
      url: "https://www.youtube.com/watch?v=huB7FbBMYG0",
      topic: "acks, idempotência, batching, linger.ms, compression",
    },
    {
      title: "Kafka Consumer Group Protocol",
      channel: "Confluent",
      url: "https://www.youtube.com/watch?v=En56n5gE7BQ",
      topic: "Rebalancing, Cooperative Sticky Assignor, offsets",
    },
    {
      title: "Kafka Streams Tutorial",
      channel: "Stephane Maarek",
      url: "https://www.youtube.com/watch?v=Z3JKCLG3VP4",
      topic: "KStream, KTable, windowing, stateful operations",
    },
  ],
  resources: [
    { title: "Apache Kafka Documentação Oficial", url: "https://kafka.apache.org/documentation/", kind: "docs" },
    { title: "Confluent Developer — Kafka Fundamentals Course", url: "https://developer.confluent.io/courses/apache-kafka/events/", kind: "curso" },
    { title: "Kafka: The Definitive Guide (O'Reilly)", url: "https://www.oreilly.com/library/view/kafka-the-definitive/9781492043072/", kind: "livro" },
    { title: "Conduktor — Kafka Tutorials Interativos", url: "https://conduktor.io/kafka-tutorials/", kind: "pratica" },
    { title: "Awesome Kafka — Recursos Curados", url: "https://github.com/infoslack/awesome-kafka", kind: "artigo" },
    { title: "Burrow — Kafka Consumer Lag Monitoring", url: "https://github.com/linkedin/Burrow", kind: "pratica" },
  ],
}

export default apacheKafka
