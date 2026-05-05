import type { SkillContent } from '@/types'

const rabbitmq: SkillContent = {
  tagline: "Message broker AMQP — roteamento flexível de mensagens com exchanges e queues.",
  why: "RabbitMQ é amplamente usado para comunicação assíncrona entre microserviços. Saber exchanges, bindings, routing keys e garantia de entrega diferencia sênior de pleno em arquitetura de sistemas.",
  summary: "RabbitMQ é um message broker que implementa o protocolo AMQP. Produtores publicam mensagens em exchanges, que as roteiam para queues via bindings e routing keys. Consumidores leem das queues. Tipos de exchange: direct (routing key exata), fanout (broadcast), topic (wildcard), headers. Suporta ack manual, dead letter queues, TTL de mensagem, e persistência.",
  keypoints: [
    { title: "Modelo de roteamento", body: "Producer → Exchange → Binding → Queue → Consumer. Exchange decide para qual(is) queue(s) rotear baseado no tipo e routing key." },
    { title: "Exchange types", body: "Direct: routing key exata. Fanout: broadcast para todas as queues ligadas. Topic: wildcards (* = uma palavra, # = zero ou mais). Headers: roteamento por headers da mensagem." },
    { title: "Acknowledgments", body: "ack manual: consumer confirma processamento antes de AMQP remover a mensagem. Sem ack, mensagem volta para queue em caso de falha do consumer (at-least-once delivery)." },
    { title: "Dead Letter Exchange", body: "DLX recebe mensagens rejeitadas (nack), com TTL expirado, ou queue cheia. Permite inspecionar e reprocessar mensagens problemáticas." },
    { title: "Persistência", body: "Exchange e queue durable: sobrevivem a restart do broker. Mensagem persistent: gravada em disco. Ambos necessários para não perder mensagens." },
  ],
  gotchas: [
    "Consumer sem ack manual — mensagem removida antes de processar. Em falha, dado perdido.",
    "Queue sem DLX — mensagens rejeitadas ou expiradas somem sem rastro.",
    "Exchange e queue não-durable — perdidos em restart do RabbitMQ.",
    "Prefetch sem configurar — consumer recebe todas as mensagens pendentes de uma vez, saturando memória.",
    "Sem monitoramento de queue depth — queue cresce indefinidamente sem alerta.",
  ],
  interview: [
    { q: "RabbitMQ vs Kafka — quando usar cada?", a: "<p>RabbitMQ: roteamento complexo (múltiplos consumidores com regras diferentes), task queue (job processing), quando mensagens devem ser removidas após consumo, latência baixa prioritária.</p><p>Kafka: event log imutável, replay de eventos, alta throughput (milhões de msgs/s), múltiplos consumidores independentes lendo o mesmo evento em tempos diferentes, event sourcing.</p><p>RabbitMQ é mais simples de operar; Kafka é mais poderoso para event streaming.</p>", level: "senior" },
    { q: "O que é at-least-once delivery e quando é problemático?", a: "<p>At-least-once: o broker garante que a mensagem é entregue pelo menos uma vez. Em falha de rede, a mensagem pode ser reentregue. O consumer pode processar o mesmo evento duas vezes.</p><p>Problemático em operações não-idempotentes: débito bancário duplicado, email enviado duas vezes. Solução: idempotency key — consumer verifica se já processou a mensagem antes de agir (usando o message ID no banco ou cache).</p>", level: "senior" },
  ],
  resources: [
    { title: "RabbitMQ docs", url: "https://www.rabbitmq.com/documentation.html", kind: "docs" },
    { title: "CloudAMQP — RabbitMQ tutorials", url: "https://www.cloudamqp.com/blog/part1-rabbitmq-for-beginners-what-is-rabbitmq.html", kind: "artigo" },
  ],
}

export default rabbitmq
