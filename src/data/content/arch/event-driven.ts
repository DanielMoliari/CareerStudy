import type { SkillContent } from '@/types'

const eventDriven: SkillContent = {
  tagline: 'Sistemas comunicando via eventos pra desacoplar produtor e consumidor.',
  why: 'Event-driven architecture é tema chave em entrevista senior backend. Saber diferenciar evento de comando, escolher entre Kafka/SQS/EventBridge e explicar idempotência separa quem já sentiu a dor de quem só leu sobre.',
  summary: 'Event-driven architecture (EDA) tem produtores publicando eventos (algo aconteceu: OrderPlaced, UserSignedUp) e consumidores reagindo. Desacopla serviços no tempo e no espaco — produtor não sabe quem consome. Habilita escala, evolucao independente, audit trail. Custo: complexidade operacional (idempotencia, ordering, schema evolution, debugging distribuido). Tres sabores: simple pub/sub (notificacao), event streaming (Kafka, replay), event sourcing (eventos como source of truth).',
  keypoints: [
    { title: 'Evento vs Comando', body: 'Evento = "aconteceu", passado, broadcast, múltiplos consumidores. Comando = "faz isso", futuro, dirigido, um destinatario. Misturar gera acoplamento ruim. Naming: OrderPlaced (evento) vs PlaceOrder (comando).' },
    { title: 'At-least-once', body: 'Padrão em fila/Kafka. Mensagem pode chegar mais de uma vez. Consumer DEVE ser idempotente — chave de idempotencia ou estado check antes de processar. Ignorar isso = duplicata em produção.' },
    { title: 'Ordem', body: 'Kafka garante ordem dentro de uma partição (chave). SQS standard não garante; FIFO sim mas tem throughput limitado. Senior define chave de partição com cuidado pra balancear ordem e paralelismo.' },
    { title: 'Outbox pattern', body: 'Pra publicar evento na mesma transação do write: grava evento numa tabela outbox, relay le e pública. Garante at-least-once sem 2PC. Padrão em serviços serios.' },
    { title: 'Schema evolution', body: 'Evento dura mais que código. Use schema registry (Avro, Protobuf) com regras de compatibilidade (backward, forward). Evite breaking — adicione campo, nunca renomeie/remova sem deprecacao longa.' },
    { title: 'Choreography vs Orchestration', body: 'Choreography: serviços reagem a eventos sem coordenador. Simples, fluxo emerge. Orchestration: um serviço controla a sequência. Mais claro mas vira ponto central. Saga complexa geralmente exige orchestration.' },
    { title: 'Dead Letter Queue', body: 'Mensagens que falharam N vezes vão pra DLQ. Permite análise sem bloquear pipeline. Sem DLQ, mensagem ruim trava consumer para sempre.' },
  ],
  gotchas: [
    'Consumer não idempotente — duplicata gera dado em duplicata, cobranca dupla, email duplicado. Sempre projete com chave de idempotencia.',
    'Evento como comando disfarcado — "UserShouldBeNotified" e comando, não evento. Naming reflete acoplamento.',
    'Esquecer DLQ + alarme — mensagem ruim some silenciosamente, você descobre o bug 2 semanas depois.',
    'Schema breaking change sem coordenacao — produtor pública novo formato, consumer antigo quebra. Use compatibilidade backward.',
    'Eventos gigantes (mega-event) com tudo dentro — vira contrato implícito, difícil evoluir. Prefira eventos pequenos focados.',
    'Debug em event chain longa = pesadelo sem tracing distribuido. Adicione correlation id + tracing desde dia 1.',
  ],
  interview: [
    { q: 'Tradeoff: Kafka vs SQS vs EventBridge?', a: '<p><strong>Kafka</strong>: alto throughput, retention longa, replay, ordering por partição. Custo: operação pesada (ZK/KRaft, brokers, cluster). Pra event streaming serio.</p><p><strong>SQS</strong>: managed, simples, pay-per-use, sem retention longa, sem replay. Standard ou FIFO. Pra task queue / desacoplamento simples.</p><p><strong>EventBridge</strong>: AWS-native, routing por regra, integração SaaS, baixo throughput. Pra integração entre serviços AWS e SaaS.</p><p>Regra: precisa replay e analytics? Kafka. Task queue simples? SQS. Routing AWS? EventBridge. Comecar com SQS/EventBridge e migrar pra Kafka quando tem caso real.</p>' },
    { q: 'Como você garante exactly-once em sistema event-driven?', a: '<p>Spoiler: <strong>exactly-once não existe</strong> end-to-end em geral. O que da pra ter e <strong>at-least-once + idempotencia</strong> = efeito exactly-once.</p><p>Técnicas: chave de idempotencia (request-id) armazenada com TTL, check antes de processar. Para writes, transação com unique constraint na chave. Em Kafka especificamente, <code>enable.idempotence=true</code> garante producer-side; consumer ainda precisa de idempotencia lógica.</p>' },
    { q: 'Quando NÃO usar event-driven?', a: '<p>Em fluxo <strong>síncrono interativo</strong> (UI esperando resposta) — async via evento adiciona latência e complexidade pra zero ganho. REST direto ganha.</p><p>Em sistema <strong>simples com poucos serviços</strong> sem necessidade de desacoplamento. Eventos virariam premature optimization. Custo de Kafka/observability supera ganho.</p><p>Também evito quando time não tem maturidade em idempotencia, ordering, schema evolution — vai virar bug em produção.</p>' },
    { q: 'Como você desenha um pipeline de evento confiável?', a: '<p>Producer: outbox pattern pra garantir consistencia entre write e publish. Schema registry. Correlation id em todo evento.</p><p>Broker: Kafka com replicação e retention adequada, ou SQS com DLQ.</p><p>Consumer: idempotencia (chave + tabela ou store), at-least-once aceito, retry com backoff, DLQ após N falhas, observability (lag, throughput, error rate).</p><p>Schema evolution backward-compatible. Tracing distribuido. Alarme em DLQ e em consumer lag.</p>' },
    { q: 'Choreography ou Orchestration pra saga?', a: '<p><strong>Choreography</strong>: cada serviço reage a evento e pública próximo. Simples, baixo acoplamento. Risco: <strong>fluxo invisivel</strong>, difícil entender o todo e debugar quando trava no meio.</p><p><strong>Orchestration</strong>: um orquestrador (Step Functions, Temporal, Camunda) controla a sequência. Visivel, debugavel, suporta compensacao explícita. Custo: ponto central, acoplamento ao orquestrador.</p><p>Regra: saga curta (2-3 passos)? Choreography. Saga longa com decisão complexa? Orchestration. Honestidade: 80% dos times faz melhor com orchestration depois que sente a dor de debugar choreography.</p>' },
  ],
  resources: [
    { title: 'Designing Event-Driven Systems (Stopford)', url: 'https://www.confluent.io/designing-event-driven-systems/', kind: 'livro' },
    { title: 'Martin Fowler — Event-Driven', url: 'https://martinfowler.com/articles/201701-event-driven.html', kind: 'artigo' },
    { title: 'Enterprise Integration Patterns', url: 'https://www.enterpriseintegrationpatterns.com/', kind: 'docs' },
    { title: 'Confluent — Kafka Tutorials', url: 'https://kafka-tutorials.confluent.io/', kind: 'curso' },
    { title: 'microservices.io — Event-Driven', url: 'https://microservices.io/patterns/data/event-driven-architecture.html', kind: 'docs' },
  ],
}

export default eventDriven
