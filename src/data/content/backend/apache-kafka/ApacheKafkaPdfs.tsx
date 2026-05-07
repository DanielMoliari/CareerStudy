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
import { buildCommandRefPdf } from '@/components/pdfs/CommandRefPdf'
import type { CommandEntry } from '@/components/pdfs/CommandRefPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta Kafka ──────────────────────────────────────────────────────────────
const C = '#8b5cf6'   // roxo — Kafka em tema dark — NUNCA omitir, default seria cyan React

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 19 perguntas mais cobradas sobre Kafka em entrevista sênior',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: partition ordering, consumer lag, acks e ISR, rebalancing, exactly-once, Schema Registry, KRaft, high watermark, poison pills, producer tuning e padrão outbox com Debezium.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Config crítica de producer, consumer e tópicos numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: parâmetros de producer (acks, linger.ms, batch.size, idempotência), consumer (session.timeout, max.poll.interval, isolation.level), topic (retention, compaction, replication) e regras críticas.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'commands',
    title: 'CLI Reference',
    subtitle: 'kafka-topics, kafka-consumer-groups e perf-test por categoria',
    type: 'commands',
    pages: 3,
    description: 'Referência do Kafka CLI: kafka-topics.sh (create, describe, alter, delete), kafka-console-producer/consumer, kafka-consumer-groups (list, describe, reset-offsets) e perf-test para benchmarks.',
    icon: '03',
    goal: 'Consulta de comandos',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 4 truques que fixam Kafka na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'KAPRO para config de producer, ISR = "I Still Replicate", HW = "High Water Mark" e LAG = ALERT. Revisão de 10 minutos antes da entrevista.',
    icon: '04',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Kafka do log imutável ao ecossistema completo em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 6 categorias (Armazenamento, Producer, Consumer, Replicação, Ecossistema, Operação) e checklist de 10 perguntas para auto-avaliar domínio.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Por que mensagens dentro de uma partition são ordenadas, mas entre partitions não?',
    a: 'Kafka garante ordem dentro de uma partition porque as mensagens são escritas em log sequencial e consumidas em ordem de offset. Cada partition tem um único writer (leader) em dado momento — sem concorrência de escrita.\n\nEntre partitions não há coordenação — cada uma progride independentemente.\n\nPara garantir ordem de eventos de uma entidade, use o ID da entidade como partition key — todos os eventos do mesmo usuário sempre vão para a mesma partition.',
    tip: 'A resposta esperada cita partition key como solução para ordem por entidade. Quem só diz "não tem ordem entre partitions" demonstra conhecimento incompleto.',
  },
  {
    level: 'Pleno',
    q: 'O que é consumer lag e por que monitorar?',
    a: 'Consumer lag é a diferença entre o último offset produzido (log end offset) e o último offset commitado pelo consumer group. Lag crescente significa que o consumer não processa rápido o suficiente.\n\nImpacto: dados processados com atraso crescente. Em pagamentos ou alertas de fraude, isso pode significar horas de delay.\n\nMonitorar com: kafka-consumer-groups.sh --describe, Burrow, Prometheus JMX Exporter + Grafana.\n\nAção: aumentar consumers (até limite de partitions), otimizar processamento, ou aumentar partitions.',
    tip: 'Demonstrar que sabe tanto como medir (ferramenta específica) quanto o que fazer quando lag cresce diferencia candidatos.',
  },
  {
    level: 'Pleno',
    q: 'Explique a diferença entre acks=0, acks=1 e acks=all.',
    a: 'acks=0: producer não aguarda confirmação. Máximo throughput, risco de perda (fire-and-forget).\n\nacks=1: leader confirma escrita. Falha se leader cair antes de replicar — mensagem confirmada mas não replicada é perdida.\n\nacks=all (ou -1): leader + todas as ISRs confirmam. Mais seguro. Requer min.insync.replicas configurado (ex: 2).\n\nPara dados críticos: acks=all + replication.factor=3 + min.insync.replicas=2.',
    tip: 'Mencionar min.insync.replicas junto com acks=all é o detalhe profundo — sem essa config, acks=all com 1 ISR não é mais seguro que acks=1.',
  },
  {
    level: 'Senior',
    q: 'O que são ISRs e o que acontece quando um follower sai da ISR?',
    a: 'ISR (In-Sync Replicas) é o conjunto de replicas sincronizadas com o leader — receberam todas as mensagens até o high watermark.\n\nUm follower sai quando: fica mais lento que replica.lag.time.max.ms (padrão 10s) ou perde conectividade.\n\nImpacto: com acks=all, a durabilidade diminui se só 1 ISR restou. Se ISRs caem abaixo de min.insync.replicas, o broker rejeita writes com NotEnoughReplicasException.\n\nQuando o follower volta, resincroniza e entra novamente na ISR.',
    tip: 'NotEnoughReplicasException é um erro real de produção. Saber a causa e a config que o controla impressiona.',
  },
  {
    level: 'Senior',
    q: 'Como você garante exactly-once semantics no Kafka?',
    a: 'Exactly-once requer três camadas:\n\n1. Idempotent producer: enable.idempotence=true. Sequence number por partition — broker descarta duplicatas de retry.\n\n2. Transações: transactional.id configurado. beginTransaction() → processa → commitTransaction(). Se falhar, abortTransaction().\n\n3. Consumer transacional: isolation.level=read_committed — só vê mensagens de transações commitadas.\n\nNa prática, at-least-once + idempotência no consumer downstream é mais simples e igualmente seguro.',
    tip: 'Quem adiciona "at-least-once + idempotência no consumer é mais pragmático" demonstra julgamento de engenharia real.',
  },
  {
    level: 'Senior',
    q: 'O que é rebalancing e quais problemas pode causar?',
    a: 'Rebalancing ocorre quando a composição de um consumer group muda: consumer entra, sai, ou estoura session.timeout.ms. O Kafka redistribui as partitions.\n\nProblemas:\n- Stop-the-world: TODOS os consumers param (Eager rebalancing).\n- Duplicatas: consumer que processou mas não commitou offset perde progresso.\n- Rebalancing frequente: processamento lento → timeout → ciclo se repete.\n\nMitigações: Cooperative Sticky Assignor (incremental), ajuste de session.timeout.ms, max.poll.records menor.',
    tip: 'Citar Cooperative Sticky Assignor como evolução do Eager rebalancing demonstra que você acompanha o ecossistema moderno.',
  },
  {
    level: 'Senior',
    q: 'Qual é a diferença entre log compaction e retention por tempo?',
    a: 'Retention por tempo (retention.ms): segmentos antigos são deletados integralmente após o período. Para eventos transitórios.\n\nLog compaction (cleanup.policy=compact): Kafka mantém apenas o último valor para cada key. Permite reconstruir o estado atual sem replay de todo o histórico.\n\nCasos de uso de compaction: topic de usuários (último estado por user_id), CDC de tabelas, configurações.\n\nDeletar registro: mensagem com key da entidade e value null (tombstone).',
    tip: 'O tombstone (value null para deletar) é o detalhe que demonstra uso real de compaction em produção.',
  },
  {
    level: 'Senior',
    q: 'Como o Kafka garante alta throughput?',
    a: 'Múltiplos mecanismos:\n\n- Sequential disk I/O: append-only log — muito mais rápido que escrita aleatória.\n- Batching: producer agrupa mensagens (linger.ms, batch.size) — menos round trips.\n- Compressão: lz4/snappy/zstd por batch — reduz volume em rede e disco.\n- Zero-copy: sendfile() do OS envia dados do disco direto para a rede sem cópia para user space.\n- Partições: paralelismo horizontal em múltiplos brokers.\n- Page cache do OS: evita GC do heap Java.',
    tip: 'Zero-copy (sendfile syscall) é o detalhe técnico que impressiona em entrevistas sênior. Poucos candidatos sabem.',
  },
  {
    level: 'Senior',
    q: 'Como você escolhe o número de partitions de um topic?',
    a: 'Partitions = paralelismo máximo de consumo. Regras práticas:\n\n- Número de partitions ≥ número de consumers desejados em paralelo\n- Throughput alvo ÷ throughput por partition ≈ mínimo de partitions\n- Mais partitions = mais overhead: arquivos no disco, conexões, rebalancing mais lento\n\nAumentar partitions é fácil; diminuir é impossível sem recriar o topic. Comece com 6–12.',
    tip: 'A assimetria "aumentar é fácil, diminuir é impossível" é um gotcha real que todo engenheiro sênior deve conhecer.',
  },
  {
    level: 'Pleno',
    q: 'O que é Kafka Connect e quando usá-lo?',
    a: 'Kafka Connect é um framework para integrar Kafka com sistemas externos sem código custom.\n\nSource Connector: lê de sistema externo e publica no Kafka (PostgreSQL via Debezium → Kafka).\n\nSink Connector: consome do Kafka e escreve em sistema externo (Kafka → Elasticsearch, Kafka → S3).\n\nBenefícios: gerenciamento de offset automático, escalabilidade de workers, schema evolution com Schema Registry.\n\nAlternativas: Kafka Streams para transformações, Flink para ETL complexo.',
    tip: 'Citar Debezium como o connector de CDC mais popular demonstra contexto de uso real.',
  },
  {
    level: 'Senior',
    q: 'Como você monitora um cluster Kafka em produção?',
    a: 'Métricas essenciais:\n\n- Consumer lag por grupo e partition: métrica #1. Lag crescente = alarme.\n- Under-replicated partitions: menos ISRs que o replication factor — cluster degradado.\n- Leader election rate: eleições frequentes = brokers instáveis.\n- Request rate e latência: produce/fetch latency por broker.\n- Disk usage: alertar antes de encher.\n\nFerramentas: Prometheus JMX Exporter + Grafana, Burrow (lag), Cruise Control (rebalancing automático).',
    tip: 'Under-replicated partitions é o alerta mais crítico depois de consumer lag — indica que qualquer falha de broker pode causar perda.',
  },
  {
    level: 'Senior',
    q: 'Explique o papel do Zookeeper e o que mudou com o KRaft.',
    a: 'ZooKeeper: armazenava metadata do cluster, elegia o controller broker, gerenciava ISR e broker registry.\n\nKRaft (Kafka Raft Metadata): o próprio Kafka gerencia metadata via protocolo Raft em um conjunto de nodes controller.\n\nVantagens: menos componentes para operar, startup mais rápido, suporte a muito mais partitions (ZooKeeper era gargalo com >200k).\n\nKafka 3.3+ suporta KRaft em produção. Kafka 4.0 remove ZooKeeper completamente.',
    tip: 'Saber que ZooKeeper foi removido no Kafka 4.0 demonstra atualização do ecossistema.',
  },
  {
    level: 'Senior',
    q: 'O que é high watermark e qual seu papel na replicação?',
    a: 'High watermark (HW) é o offset até o qual todas as ISRs replicaram — a "borda segura" do log. Consumers só leem até o HW, nunca além — garante que dados lidos são duráveis.\n\nFluxo: producer escreve no leader (log end offset avança). Followers replicam. Quando todas as ISRs replicaram até certo offset, leader avança o HW.\n\nSe o leader cair antes de um follower replicar, mensagens acima do HW do novo leader são truncadas. Com acks=all, o producer só recebe ACK após o HW avançar.',
    tip: 'High watermark é o internals que separa quem leu a documentação de quem estudou a implementação.',
  },
  {
    level: 'Senior',
    q: 'Como você lida com poison pills no consumer?',
    a: 'Poison pill = mensagem que causa exceção repetidamente — offset não avança, lag cresce infinitamente.\n\nEstratégias:\n- Dead Letter Topic (DLT): após N tentativas, move para orders.DLT com headers de diagnóstico.\n- Skip com log: para erros não-críticos, log detalhado + commitar offset mesmo sem processar.\n- Retry topic: backoff exponencial antes de DLT (padrão do Spring Kafka).\n\nNunca deixe o consumer em loop de retry sem DLT — o consumer group fica bloqueado naquela partition.',
    tip: 'Dead Letter Topic é padrão de produção obrigatório. Spring Kafka implementa retry + DLT nativamente.',
  },
  {
    level: 'Senior',
    q: 'Como você implementa o padrão de outbox com Kafka?',
    a: 'Problema: salvar no banco E publicar no Kafka são duas operações distintas — crash entre elas = evento perdido.\n\nTransactional Outbox: escreva na tabela outbox dentro da mesma transação do banco. Um processo separado lê e publica no Kafka.\n\nCom Debezium: CDC captura INSERTs na tabela outbox e publica automaticamente — sem polling, sem perda.\n\nGarante: at-least-once delivery + consistência entre banco e evento publicado.',
    tip: 'O padrão outbox com Debezium é a referência para garantir consistência entre banco relacional e Kafka.',
  },
  {
    level: 'Senior',
    q: 'Como você decide entre Kafka e RabbitMQ para um novo projeto?',
    a: 'Kafka quando: alto volume (>100k msgs/s), replay necessário, múltiplos consumers independentes, event sourcing, CDC, retenção longa.\n\nRabbitMQ quando: roteamento complexo (exchanges, routing keys), mensagem deve ser deletada após consumo, volume moderado, dead-letter queues nativas simples.\n\nDiferença fundamental: Kafka é log persistente — consumers leem sem deletar. RabbitMQ é fila — mensagem some após consumo.',
    tip: 'A distinção "log persistente vs fila clássica" é o núcleo. Confundir os dois modelos mentais demonstra falta de experiência.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o Schema Registry e por que é importante?',
    a: 'Schema Registry armazena schemas Avro, Protobuf ou JSON Schema versionados. Producer serializa com o schema registrado. Consumer busca o schema pelo ID para deserializar.\n\nImportância: sem SR, uma mudança de campo quebra silenciosamente todos os consumers.\n\nModos de compatibilidade:\n- BACKWARD: novo consumer lê mensagens antigas\n- FORWARD: consumer antigo lê mensagens novas\n- FULL: ambos\n\nAdição de campo com default = compatível. Remoção de campo obrigatório = incompatível.',
    tip: 'Dar um exemplo concreto de incompatibilidade (remover campo obrigatório) é mais impactante que listar os modos abstratamente.',
  },
  {
    level: 'Senior',
    q: 'Quais são os principais parâmetros de performance do producer?',
    a: 'Parâmetros mais impactantes:\n\n- linger.ms: espera para acumular batch. 0 = baixa latência. 5-20ms = melhor throughput.\n- batch.size: tamanho máximo do batch (padrão 16KB). 64-256KB melhora throughput.\n- compression.type: lz4 ou snappy para throughput, zstd para melhor ratio.\n- buffer.memory: memória total para buffers. Se producer produz mais rápido que envia, bloqueia aqui.\n- max.in.flight.requests.per.connection: com idempotência, deve ser ≤ 5.',
    tip: 'A relação entre linger.ms e latência vs throughput é o trade-off fundamental. Tunar sem medir com kafka-producer-perf-test.sh é chute.',
  },
  {
    level: 'Senior',
    q: 'O que acontece com mensagens não confirmadas quando um producer tem retries?',
    a: 'Com retries > 0 e enable.idempotence=false: o producer reenvia após timeout. Se o broker recebeu mas a confirmação foi perdida na rede, recebe novamente → duplicata.\n\nCom enable.idempotence=true: sequence number por partition. Broker rastreia o último sequence aceito — duplicata é descartada silenciosamente.\n\nCom transações: atomicidade entre múltiplos topics — ou tudo commita ou tudo aborta.\n\nRegra: sempre use enable.idempotence=true em produção. Overhead mínimo, garantia significativa.',
    tip: 'Demonstrar o caminho completo (retry → duplicata → sequence number → deduplicação) mostra que você entende o mecanismo.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'acks=all', sig: 'acks=all + min.insync.replicas=2', desc: 'Durabilidade máxima. Leader + ISRs confirmam. Obrigatório para dados críticos (pagamentos).' },
  { name: 'enable.idempotence', sig: 'enable.idempotence=true', desc: 'Evita duplicatas em retry via sequence number por partition. Use sempre em produção.' },
  { name: 'linger.ms + batch.size', sig: 'linger.ms=10, batch.size=65536', desc: 'Throughput: acumula batch antes de enviar. linger.ms=0 = latência mínima, baixo throughput.' },
  { name: 'compression.type', sig: 'compression.type=lz4', desc: 'Melhor ratio throughput/CPU. snappy similar. zstd para melhor compressão total.' },
  { name: 'enable.auto.commit=false', sig: 'enable.auto.commit=false + commitSync()', desc: 'Controle manual de offset. Evita perda de dados em crash. Commit APÓS processar.' },
  { name: 'isolation.level', sig: 'isolation.level=read_committed', desc: 'Só lê mensagens de transações commitadas. Obrigatório para exactly-once consumer.' },
  { name: 'max.poll.records', sig: 'max.poll.records=100', desc: 'Limita mensagens por poll. Evita estouro de max.poll.interval.ms em processamento lento.' },
  { name: 'session.timeout.ms', sig: 'session.timeout.ms=30000', desc: 'Tempo sem heartbeat antes de ser removido do grupo. Distinto de max.poll.interval.ms.' },
  { name: 'cleanup.policy=compact', sig: 'cleanup.policy=compact', desc: 'Log compaction: mantém último valor por key. Tombstone (value=null) deleta a key.' },
  { name: 'retention.ms', sig: 'retention.ms=604800000', desc: '7 dias. Para event sourcing, retenção maior ou compaction. Tradeoff: custo de disco.' },
  { name: 'replication.factor', sig: 'RF=3 + min.insync.replicas=2', desc: 'RF=3: tolera 1 broker caindo. min.insync.replicas=2: pelo menos 2 ISRs para aceitar writes.' },
  { name: 'partition key', sig: 'key = ID da entidade (user_id, order_id)', desc: 'Garante ordem dentro de uma entidade: todos os eventos do user-123 vão para a mesma partition.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'Consumer lag crescente não monitorado — use Burrow ou Prometheus JMX Exporter' },
  { ok: false, t: 'Under-replicated partitions ignorado — cluster degradado, qualquer falha vira perda' },
  { ok: false, t: 'Aumentar consumers acima de partitions — extras ficam ociosos, paralelismo não aumenta' },
  { ok: false, t: 'Auto-commit + processamento longo — commit antes de processar = perda em crash' },
  { ok: false, t: 'Sem Dead Letter Topic — poison pill bloqueia o consumer group indefinidamente' },
  { ok: true, t: 'enable.idempotence=true em produção — overhead mínimo, evita duplicatas em retry' },
  { ok: true, t: 'Partition key = ID da entidade — única forma de garantir ordem entre eventos de uma entidade' },
]

// ── Dados: CLI Reference ──────────────────────────────────────────────────────

const CLI_COMMANDS: CommandEntry[] = [
  {
    category: 'Topics',
    command: 'kafka-topics.sh --create',
    description: 'Criar topic',
    example: 'kafka-topics.sh --create --topic orders --partitions 6 --replication-factor 3 --bootstrap-server kafka:9092',
  },
  {
    category: 'Topics',
    command: 'kafka-topics.sh --list',
    description: 'Listar todos os topics',
    example: 'kafka-topics.sh --list --bootstrap-server kafka:9092',
  },
  {
    category: 'Topics',
    command: 'kafka-topics.sh --describe',
    description: 'Detalhes do topic (leader, ISR, partitions)',
    example: 'kafka-topics.sh --describe --topic orders --bootstrap-server kafka:9092',
  },
  {
    category: 'Topics',
    command: 'kafka-topics.sh --alter',
    description: 'Aumentar partitions (só aumenta, nunca diminui)',
    example: 'kafka-topics.sh --alter --topic orders --partitions 12 --bootstrap-server kafka:9092',
  },
  {
    category: 'Topics',
    command: 'kafka-topics.sh --delete',
    description: 'Deletar topic',
    example: 'kafka-topics.sh --delete --topic orders --bootstrap-server kafka:9092',
  },
  {
    category: 'Produzir / Consumir',
    command: 'kafka-console-producer.sh',
    description: 'Publicar mensagens interativamente',
    example: 'kafka-console-producer.sh --topic orders --bootstrap-server kafka:9092',
  },
  {
    category: 'Produzir / Consumir',
    command: 'kafka-console-consumer.sh --from-beginning',
    description: 'Consumir desde o início (replay)',
    example: 'kafka-console-consumer.sh --topic orders --from-beginning --bootstrap-server kafka:9092',
  },
  {
    category: 'Produzir / Consumir',
    command: 'kafka-console-consumer.sh --group',
    description: 'Consumir como parte de um consumer group',
    example: 'kafka-console-consumer.sh --topic orders --group my-group --bootstrap-server kafka:9092',
  },
  {
    category: 'Consumer Groups',
    command: 'kafka-consumer-groups.sh --list',
    description: 'Listar todos os consumer groups',
    example: 'kafka-consumer-groups.sh --list --bootstrap-server kafka:9092',
  },
  {
    category: 'Consumer Groups',
    command: 'kafka-consumer-groups.sh --describe',
    description: 'Ver lag por partition do grupo',
    example: 'kafka-consumer-groups.sh --describe --group order-processor --bootstrap-server kafka:9092',
  },
  {
    category: 'Consumer Groups',
    command: '--reset-offsets --to-earliest',
    description: 'Replay: resetar offset para o início',
    example: 'kafka-consumer-groups.sh --reset-offsets --group order-processor --topic orders --to-earliest --execute --bootstrap-server kafka:9092',
  },
  {
    category: 'Consumer Groups',
    command: '--reset-offsets --to-datetime',
    description: 'Resetar offset para um ponto no tempo',
    example: 'kafka-consumer-groups.sh --reset-offsets --group g1 --topic orders --to-datetime 2024-01-15T10:00:00.000 --execute --bootstrap-server kafka:9092',
  },
  {
    category: 'Performance',
    command: 'kafka-producer-perf-test.sh',
    description: 'Benchmark de throughput do producer',
    example: 'kafka-producer-perf-test.sh --topic orders --num-records 1000000 --record-size 1000 --throughput -1 --producer-props bootstrap.servers=kafka:9092',
  },
  {
    category: 'Performance',
    command: 'kafka-consumer-perf-test.sh',
    description: 'Benchmark de throughput do consumer',
    example: 'kafka-consumer-perf-test.sh --topic orders --messages 1000000 --bootstrap-server kafka:9092',
  },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Producer Config — KAPRO',
    trick: 'KAPRO',
    expansion: [
      ['K', 'Key → determina a partition (ordem por entidade)'],
      ['A', 'Acks → durabilidade: 0 / 1 / all'],
      ['P', 'Partition count → paralelismo máximo'],
      ['R', 'Retry com idempotência → evita duplicatas'],
      ['O', 'Order → garantida só dentro de uma partition'],
    ],
    explanation: 'Os 5 aspectos fundamentais de configuração do producer Kafka.',
    example: 'acks=all + enable.idempotence=true + partition key = setup de produção correto.',
    why: 'Config de producer é a pergunta mais comum em troubleshooting de Kafka. KAPRO cobre os 5 vetores de problema.',
  },
  {
    label: 'ISR = I Still Replicate',
    trick: 'ISR = "I Still Replicate"',
    expansion: [
      ['I', 'In-Sync — dentro do replica.lag.time.max.ms'],
      ['S', 'Still — acompanha o leader continuamente'],
      ['R', 'Replicate — recebeu todos os offsets até o HW'],
    ],
    explanation: 'ISR são os followers que ainda estão sincronizados com o leader. acks=all exige confirmação de todas ISRs.',
    example: 'Follower cai da ISR → acks=all ainda pode funcionar se restam ISRs. Abaixo de min.insync.replicas → NotEnoughReplicasException.',
    why: 'ISR é o mecanismo central de durabilidade do Kafka. Entender quem está na ISR explica todos os comportamentos de acks.',
  },
  {
    label: 'HW = High Water Mark',
    trick: 'Consumer só bebe até a linha d\'água',
    expansion: [
      ['High', 'O offset mais alto que todas as ISRs já confirmaram'],
      ['Water', 'Limite de visibilidade para consumers'],
      ['Mark', 'Fronteira entre "durável" e "ainda replicando"'],
    ],
    explanation: 'Consumer nunca lê além do HW. Log End Offset > HW quando há mensagens sendo replicadas. acks=all só retorna ACK após HW avançar.',
    example: 'Leader tem offset 7, ISRs replicaram até 5 → HW=5. Consumer vê offsets 0-5, não vê 6-7.',
    why: 'HW é o internals de Kafka que poucos candidatos conhecem. Explica por que consumers "atrasam" em relação ao log end offset.',
  },
  {
    label: 'LAG = ALERT',
    trick: 'Lag crescente = consumer morrendo ou processamento lento',
    expansion: [
      ['L', 'Log end offset — onde o producer está'],
      ['A', 'Alert — lag crescendo é sempre alarme'],
      ['G', 'Gap — diferença entre produção e consumo'],
    ],
    explanation: 'Consumer lag = log end offset - committed offset. Lag estável pode ser aceitável. Lag crescendo = consumer não acompanha.',
    example: 'Lag de 10k estável = ok. Lag de 10k crescendo 1k/min = alarme. Ação: mais consumers (até N partitions) ou otimizar processamento.',
    why: 'Consumer lag é a métrica #1 de saúde de um sistema Kafka. Todo engenheiro de backend deve saber monitorar e agir.',
  },
]

// ── Dados: Mindmap ────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Armazenamento',
    color: '#f59e0b',
    items: [
      { t: 'Topic: canal lógico de mensagens', k: true },
      { t: 'Partition: unidade de paralelismo', k: true },
      { t: 'Offset: posição no log', k: true },
      { t: 'Retention: tempo ou tamanho', k: true },
      { t: 'Log compaction: último valor por key', a: true },
      { t: 'Tombstone (value=null): deletar key', a: true },
    ],
  },
  {
    label: 'Producer',
    color: '#ef4444',
    items: [
      { t: 'acks: 0 / 1 / all', k: true },
      { t: 'Partition key → ordem por entidade', k: true },
      { t: 'Batching: linger.ms + batch.size', k: true },
      { t: 'enable.idempotence=true', k: true },
      { t: 'Transações: transactional.id', a: true },
      { t: 'compression.type: lz4/snappy/zstd', a: true },
    ],
  },
  {
    label: 'Consumer',
    color: '#22c55e',
    items: [
      { t: 'Consumer Group: paralelismo', k: true },
      { t: 'Offset commit: auto vs manual', k: true },
      { t: 'Rebalancing: trigger e impacto', k: true },
      { t: 'Consumer lag: métrica #1', k: true },
      { t: 'Cooperative Sticky Assignor', a: true },
      { t: 'Dead Letter Topic (DLT)', a: true },
    ],
  },
  {
    label: 'Replicação',
    color: '#8b5cf6',
    items: [
      { t: 'Replication Factor: RF=3', k: true },
      { t: 'ISR: In-Sync Replicas', k: true },
      { t: 'High Watermark: limite de leitura', k: true },
      { t: 'Leader election em falha', k: true },
      { t: 'min.insync.replicas: mínimo ISRs', a: true },
      { t: 'NotEnoughReplicasException', a: true },
    ],
  },
  {
    label: 'Ecossistema',
    color: '#38bdf8',
    items: [
      { t: 'Schema Registry: Avro/Protobuf', k: true },
      { t: 'Kafka Connect: source/sink', k: true },
      { t: 'Kafka Streams: stream processing', k: true },
      { t: 'KRaft: sem ZooKeeper (Kafka 4.0)', k: true },
      { t: 'ksqlDB: SQL sobre streams', a: true },
      { t: 'Debezium: CDC para outbox', a: true },
    ],
  },
  {
    label: 'Operação',
    color: '#4ade80',
    items: [
      { t: 'Consumer lag (Burrow / JMX)', k: true },
      { t: 'Under-replicated partitions', k: true },
      { t: 'Disk usage por broker', k: true },
      { t: 'Leader election rate', k: true },
      { t: 'Prometheus JMX Exporter + Grafana', a: true },
      { t: 'Cruise Control: rebalance automático', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Explico por que ordem é garantida dentro de uma partition?',
  'Sei a diferença entre acks=0, acks=1 e acks=all?',
  'Entendo o que são ISRs e quando saem do grupo?',
  'Sei o que é high watermark e por que consumer não lê além?',
  'Consigo explicar rebalancing e suas consequências?',
  'Sei quando usar log compaction vs retention por tempo?',
  'Entendo a diferença entre Kafka e RabbitMQ?',
  'Sei implementar Dead Letter Topic para poison pills?',
  'Conheço o padrão outbox com Debezium?',
  'Sei por que diminuir partitions é impossível sem recriar o topic?',
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Apache Kafka',
    stackLabel: 'Streaming Distribuído',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Apache Kafka',
    accentColor: C,
    stackLabel: 'Producer · Consumer · Topic Config',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['kafkajs', 'Cliente TypeScript/Node.js — producer, consumer, admin'],
        ['Debezium', 'CDC connector — captura WAL do Postgres/MySQL → Kafka'],
        ['Schema Registry', 'Confluent — schemas Avro/Protobuf versionados'],
        ['Kafka Streams', 'Biblioteca JVM para stream processing stateful'],
        ['Burrow', 'Monitor de consumer lag por grupo e partition'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'linger.ms=10 + batch.size=65536 dobra throughput vs defaults',
        'compression.type=lz4 reduz 60-70% de bytes em rede sem custo CPU alto',
        'max.poll.records=100 para evitar estouro de max.poll.interval.ms',
        'Cooperative Sticky Assignor reduz stop-the-world em rebalancing',
        'Zero-copy (sendfile) é automático — não precisa configurar, só entender',
      ],
      patterns: [
        {
          name: 'Producer idempotente com DLT',
          code: `const producer = kafka.producer({ idempotent: true })\n// consumer com retry + DLT\nfor (let i = 1; i <= 3; i++) {\n  try { await process(msg); return }\n  catch (e) { if (i === 3) await sendToDLT(msg, e) }\n}`,
          desc: 'Idempotência no producer + DLT no consumer = at-least-once seguro.',
        },
        {
          name: 'Transactional Outbox',
          code: `// Dentro da transação do banco:\nawait db.transaction(async trx => {\n  await trx('orders').insert(order)\n  await trx('outbox').insert({\n    topic: 'orders', payload: order\n  })\n})\n// Debezium captura a tabela outbox → Kafka`,
          desc: 'Consistência entre banco e Kafka sem two-phase commit.',
        },
        {
          name: 'Exactly-once com transações',
          code: `const txProducer = kafka.producer({\n  idempotent: true,\n  transactionalId: 'order-tx'\n})\nconst tx = await txProducer.transaction()\ntry {\n  await tx.send({ topic: 'orders', ... })\n  await tx.commit()\n} catch { await tx.abort() }`,
          desc: 'Atomicidade entre múltiplos topics. Use isolation.level=read_committed no consumer.',
        },
      ],
      mentalModels: [
        'KAPRO: Key, Acks, Partitions, Retry, Order — os 5 vetores do producer',
        'ISR = "I Still Replicate" — followers sincronizados. acks=all exige todos confirmarem.',
        'HW (High Watermark) = consumer só lê até aqui. Log End Offset > HW = replicando.',
        'LAG = ALERT: lag estável ok, lag crescendo = consumer não acompanha o throughput.',
        'Partition key = ID da entidade: única garantia de ordem entre eventos da mesma entidade.',
      ],
    },
  }),
  commands: () => buildCommandRefPdf({
    commands: CLI_COMMANDS,
    skillName: 'Apache Kafka',
    accentColor: C,
    stackLabel: 'kafka-topics · kafka-consumer-groups · perf-test',
    coverTitle: 'Apache Kafka CLI Reference',
    coverSubtitle: 'Topics, Consumer Groups, Performance',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Apache Kafka',
    stackLabel: 'Streaming Distribuído',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Apache Kafka',
    stackLabel: 'Log Distribuído · Event Streaming',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de ir a uma entrevista sênior de backend.',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function ApacheKafkaPdfs() {
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
