import type { SkillContent } from '@/types'

const apacheKafka: SkillContent = {
  tagline: "Plataforma de streaming distribuído — log imutável, alta throughput, replay de eventos.",
  why: "Kafka é o backbone de dados em empresas com escala. CDC, event sourcing, analytics em tempo real e integração de microserviços passam por Kafka. Saber o modelo mental e os trade-offs é esperado em vaga sênior de backend.",
  summary: "Apache Kafka é uma plataforma de streaming distribuído baseada em log. Produtores publicam em topics, divididos em partitions distribuídas entre brokers. Consumidores leem em grupos (consumer groups). Mensagens são imutáveis e retidas por período configurável — permite replay. Alta throughput (milhões de msgs/s). Casos de uso: event sourcing, CDC, stream processing, audit log, integração de microserviços.",
  keypoints: [
    { title: "Topics e Partitions", body: "Topic é o canal lógico. Cada topic é dividido em N partitions. Partitions distribuídas entre brokers para escala. Mensagens dentro de uma partition são ordenadas — entre partitions, não." },
    { title: "Producer e Consumer Groups", body: "Producer escolhe partition (por key ou round-robin). Consumer Group: cada partition é consumida por exatamente um consumer no grupo. Adicionar consumers no grupo aumenta paralelismo até o número de partitions." },
    { title: "Offsets e replay", body: "Cada mensagem tem offset (posição na partition). Consumer group guarda qual offset foi processado. Para replay: reset o offset para o início. Mensagens ficam até o retention period." },
    { title: "Replication", body: "Cada partition tem N réplicas (replication factor). Uma é leader (recebe writes), outras são followers (ISR — in-sync replicas). Em falha do leader, um follower vira leader automaticamente." },
    { title: "Exactly-once semantics", body: "Kafka suporta exactly-once com idempotent producers + transações. Complexo de implementar end-to-end. At-least-once é mais comum e aceito com idempotency no consumer." },
    { title: "Schema Registry", body: "Confluentplatform: schemas Avro/Protobuf versionados. Producer e consumer usam schema compatível. Evita breaking changes nos eventos." },
  ],
  gotchas: [
    "Partition key mal escolhida — todas as mensagens no mesmo partition, paralelismo zero.",
    "Consumer group com mais consumers que partitions — consumers extras ficam ociosos.",
    "Retention period curto — replay impossível após o período.",
    "Mensagem grande (>1MB) — degrada performance. Armazene payload grande no S3, envie referência no evento.",
    "Kafka sem monitoramento de consumer lag — grupo atrasado não detectado, dado processado com horas de delay.",
  ],
  interview: [
    { q: "Por que mensagens dentro de uma partition são ordenadas, mas entre partitions não?", a: "<p>Kafka garante ordem dentro de uma partition porque as mensagens são escritas em log sequencial e consumidas em ordem de offset. Cada partition tem um único writer (leader) em um dado momento.</p><p>Entre partitions não há coordenação — cada partition progride independentemente. Para garantir ordem global de um cliente específico (ex: todos os eventos do usuário X na ordem certa), use a user ID como partition key — todos os eventos do mesmo usuário caem na mesma partition.</p>", level: "senior" },
    { q: "O que é consumer lag e por que monitorar?", a: "<p>Consumer lag é a diferença entre o último offset produzido e o último offset consumido pelo consumer group. Lag crescente significa que o consumer não está processando rápido o suficiente.</p><p>Impacto: dados processados com atraso crescente. Em streaming de eventos financeiros ou notificações, isso significa delay de horas para o usuário final.</p><p>Monitorar com Kafka consumer group describe ou ferramentas como Confluent Control Center, Burrow, ou métricas Prometheus.</p>", level: "senior" },
  ],
  resources: [
    { title: "Apache Kafka docs", url: "https://kafka.apache.org/documentation/", kind: "docs" },
    { title: "Confluent — Kafka fundamentals", url: "https://developer.confluent.io/courses/apache-kafka/events/", kind: "curso" },
  ],
}

export default apacheKafka
