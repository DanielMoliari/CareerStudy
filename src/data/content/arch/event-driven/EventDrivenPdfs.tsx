'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'

// ── Paleta Event-Driven ───────────────────────────────────────────────────────
const C    = '#8b5cf6'  // purple — NUNCA omitir
const GRN  = '#22c55e'
const RED  = '#ef4444'
const AMB  = '#f59e0b'
const SKY  = '#38bdf8'
const PNK  = '#f472b6'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre Event-Driven em entrevista sênior',
    type: 'qa',
    pages: 11,
    description: 'Evento vs Comando vs Query, idempotência, outbox pattern, choreography vs orchestration, sagas, schema evolution, exactly-once, Kafka vs SQS vs EventBridge, event sourcing, CQRS, CloudEvents, tracing distribuído e quando NÃO usar EDA.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'Tipos de mensagem, brokers, padrões e observabilidade em uma página',
    type: 'quick-ref',
    pages: 2,
    description: 'Referência densa: evento/comando/query com naming canônico, garantias de entrega (at-most/at-least/exactly-once), brokers por caso de uso, padrões (outbox, DLQ, saga, schema registry) e métricas de observabilidade.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam Event-Driven na memória',
    type: 'mnemonics',
    pages: 3,
    description: 'ECI (tipos de mensagem), OIDR (pipeline confiável), CLO (choreography vs orchestration), BAF (schema evolution) e LCDE (observabilidade). Com expansões e exemplos de aplicação.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 4 erros que causam bugs graves em sistemas event-driven',
    type: 'antipatterns',
    pages: 3,
    description: 'Consumer não idempotente, evento como comando disfarçado, schema breaking change sem coordenação e ausência de correlation ID. Com código wrong/right e impacto em produção.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual a diferença entre evento, comando e query em sistemas distribuídos?',
    a: '<strong>Evento</strong>: fato imutável no passado. Broadcast — qualquer consumidor pode reagir. Producer não sabe nem se importa com consumidores. Ex: <code>OrderPlaced</code>, <code>UserRegistered</code>. <strong>Comando</strong>: intenção dirigida a um destino. Pode ser recusado. Ex: <code>PlaceOrder</code>, <code>SendEmail</code>. <strong>Query</strong>: leitura sem efeito colateral (CQS de Meyer). Erro de naming: <code>UserShouldBeNotified</code> é comando disfarçado — indica acoplamento oculto ao consumidor.',
    tip: 'Nomear eventos no passado e identificar "evento como comando disfarçado" é o que diferencia candidatos que entendem a semântica dos que só usam filas.',
  },
  {
    level: 'Pleno',
    q: 'O que é idempotência e por que é obrigatória em consumers de eventos?',
    a: 'At-least-once delivery significa: a mesma mensagem pode chegar mais de uma vez. Consumer idempotente processa N vezes com o mesmo resultado de 1 vez. Técnicas: (1) <strong>Chave de idempotência</strong>: armazene <code>eventId</code> com TTL em Redis antes de processar — se já existe, ignore. (2) <strong>Unique constraint</strong>: INSERT com constraint — segundo insert gera violação, trate. (3) <strong>Check de estado</strong>: verifique estado antes de aplicar — se já <code>SHIPPED</code>, ignore <code>ShipOrder</code>. Sem idempotência: cobrança dupla, e-mail duplicado, saldo errado.',
    tip: 'Apresentar as três técnicas concretas é o que diferencia quem implementou em produção de quem só leu sobre o padrão.',
  },
  {
    level: 'Pleno',
    q: 'O que é o outbox pattern e por que ele existe?',
    a: 'Problema: após COMMIT no banco, publicação no broker pode falhar — evento perdido, inconsistência silenciosa. <strong>Outbox pattern</strong>: na mesma transação do write, grava o evento em tabela <code>outbox</code>. Relay separado (Debezium CDC ou polling) lê e publica com retry — garantia at-least-once. Sem outbox: janela de falha entre commit e publish. Alternativa: event sourcing elimina o problema — o store de eventos É o banco.',
    tip: 'Mencionar Debezium CDC (lê o WAL do Postgres) mostra a solução de produção real. Zero overhead de polling vs consistência imediata é o tradeoff a discutir.',
  },
  {
    level: 'Pleno',
    q: 'Choreography vs Orchestration para Sagas — quando usar cada um?',
    a: '<strong>Choreography</strong>: cada serviço reage a eventos sem coordenador. Baixo acoplamento, fácil de adicionar consumidores. Desvantagem: fluxo implícito e invisível, difícil debugar saga quebrada, compensação complexa. <strong>Orchestration</strong>: orquestrador (Step Functions, Temporal, Camunda) controla a sequência. Visível, debugável, compensação explícita. Desvantagem: ponto central. Regra: saga curta (2-3 passos) → choreography. Saga longa com compensação → orchestration. Na prática: 80% dos times migra para orchestration após debugar choreography pela primeira vez.',
    tip: 'A honestidade sobre "80% dos times" demonstra experiência real. Candidatos que defendem choreography sem ressalvas nunca debugaram uma saga quebrada.',
  },
  {
    level: 'Pleno',
    q: 'Quais são as diferenças entre Kafka, SQS e EventBridge?',
    a: '<strong>Kafka</strong>: log imutável, alta vazão (milhões/s), retenção longa, replay, ordering por partição. Custo: operação pesada. Ideal para event streaming e analytics. <strong>SQS Standard</strong>: managed, sem ordering, alta vazão. <strong>SQS FIFO</strong>: ordering garantida, até 300 msg/s — custo de throughput. <strong>EventBridge</strong>: roteamento por filtros JSON ricos, integração SaaS nativa, até 10k/s. Regra: replay + alta vazão → Kafka. Task queue simples → SQS. Routing entre serviços AWS → EventBridge.',
    tip: 'O limite de 300 msg/s do SQS FIFO é o detalhe que elimina candidatos — muitos escolhem FIFO sem saber do tradeoff. Citar esse número demonstra experiência.',
  },
  {
    level: 'Pleno',
    q: 'O que é schema evolution e como garantir backward e forward compatibility?',
    a: '<strong>Backward compatibility</strong>: consumidor novo lê eventos na versão antiga. <strong>Forward compatibility</strong>: consumidor antigo lê eventos na versão nova (ignora campos desconhecidos). Regras: adicionar campo opcional = backward+forward safe. Remover campo = apenas backward. Renomear ou mudar tipo = breaking. Use Schema Registry (Confluent + Avro/Protobuf) com enforcement. Para breaking change: deprecate → dual-publish novo+antigo → migrar consumers → remover antigo.',
    tip: 'Saber a diferença exata entre backward e forward é pergunta frequente de sênior. A maioria confunde os dois. Conectar com Schema Registry mostra que você sabe como enforçar em produção.',
  },
  {
    level: 'Pleno',
    q: 'O que é exactly-once delivery e é possível garantir end-to-end?',
    a: '<strong>Exactly-once end-to-end não existe</strong> sem 2PC (impraticável). O que existe é <strong>at-least-once + idempotência = efeito de exactly-once</strong>. Kafka tem exactly-once dentro do cluster (<code>enable.idempotence=true</code> no producer + transações producer-consumer). Mas o efeito externo (DB, API) ainda precisa de idempotência lógica. Exact-once é marketing — projete at-least-once + idempotência e viva bem.',
    tip: 'Afirmar que exactly-once end-to-end não existe é a resposta de arquiteto. Candidatos que dizem "Kafka tem exactly-once" sem ressalvas não entenderam o escopo da garantia.',
  },
  {
    level: 'Pleno',
    q: 'O que é Dead Letter Queue e quando configurar?',
    a: 'DLQ recebe mensagens que falharam após N tentativas. Permite inspecionar, corrigir e re-enfileirar sem bloquear o pipeline principal. Configure SEMPRE para consumers em produção: SQS (maxReceiveCount), RabbitMQ (DLX), Kafka (retry topic pattern). Sem DLQ: mensagem com bug trava consumer FIFO para sempre ou é descartada silenciosamente. <strong>Obrigatório</strong>: alarme quando DLQ cresce — indica bug ou schema incompatível. Re-enfileirar após fix deve ser idempotente.',
    tip: 'Mencionar que é obrigatório ter alarme na DLQ diferencia. Muitas equipes têm DLQ mas descobrem problemas tarde por falta de alerta.',
  },
  {
    level: 'Senior',
    q: 'Como você desenha um pipeline de eventos confiável do zero?',
    a: '<strong>Producer</strong>: outbox pattern, schema registry, correlation ID, acks=all (Kafka). <strong>Broker</strong>: replicação ≥3 + retention adequada. Chave de partição com chave de negócio (customerId). <strong>Consumer</strong>: idempotência com eventId antes de efeito colateral. Retry com backoff. DLQ após N falhas. Observabilidade: consumer lag, DLQ depth, error rate, end-to-end latency. Tracing distribuído com OTEL (W3C TraceContext em headers). <strong>Schema</strong>: backward-compatible, consumer contract testing (Pact).',
    tip: 'Mencionar consumer contract testing (Pact) diferencia muito — é onde mais bugs de schema são encontrados antes de IR para staging.',
  },
  {
    level: 'Senior',
    q: 'O que é Event Sourcing e como difere de CRUD?',
    a: 'CRUD: salva estado atual, atualização sobrescreve, histórico perdido. <strong>Event Sourcing</strong>: banco é log append-only. Estado = replay de todos os eventos. Exemplo: AccountOpened + MoneyDeposited(100) + MoneyWithdrawn(30) = saldo 70. Vantagens: audit log imutável, time travel, debug por replay, CQRS nativo. Custos: eventual consistency nas projeções, schema evolution complexa, snapshots necessários. Quando usar: domínios onde histórico é o produto (fintech, contabilidade, games). Para CRUD simples: overengineering.',
    tip: 'Dizer explicitamente "para CRUD simples, overengineering" é a resposta de arquiteto maduro. Candidatos que aplicam event sourcing em tudo nunca calibraram complexidade vs benefício.',
  },
  {
    level: 'Senior',
    q: 'Como integrar CQRS com Event Sourcing?',
    a: 'Fluxo: Command → Aggregate (valida, emite evento) → Event Store (append-only). Event Store publica eventos → Projectors → Read Models. Query → Read Model (nunca event store diretamente). Read models são otimizados por use case: Elasticsearch para busca, Redis para sessão, Postgres desnormalizado para relatório. Consistência entre event store e read model é <strong>eventual</strong> — latência entre evento publicado e read model atualizado. Design de produto deve aceitar isso ou implementar read-your-writes.',
    tip: 'A eventual consistency entre event store e read model é o ponto mais importante e mais negligenciado em produto. Mencionar read-your-writes como solução para UX mostra maturidade de sistema.',
  },
  {
    level: 'Senior',
    q: 'Como você implementa saga com orchestration usando AWS Step Functions?',
    a: 'Step Functions como orquestrador: state machine em Amazon States Language. Cada estado é um Lambda (ou SDK integration). OrderSaga: ProcessPayment (se falha → CancelOrder). ReserveInventory (se falha → RefundPayment + CancelOrder). ShipOrder com waitForTaskToken (aguarda callback do sistema de logística sem polling). Compensações são idempotentes — podem ser chamadas múltiplas vezes. Vantagem: Step Functions Dashboard mostra execução de cada saga individualmente — debugável. Histórico de 90 dias.',
    tip: 'O waitForTaskToken é o detalhe que candidatos esquecem — permite que a saga aguarde callback externo (gateway de pagamento) sem polling ativo.',
  },
  {
    level: 'Senior',
    q: 'Como garantir ordering de eventos em Kafka?',
    a: 'Ordering garantida apenas DENTRO de uma partição. Estratégia: usar a chave do aggregate como key do Kafka record (ex: customerId, orderId). Kafka faz hash → mesma partição → mesma ordem. Tradeoff: mais partições = mais paralelismo, mas hotspot possível. Se um tenant gera muito mais eventos, a partição dele fica sobrecarregada. Soluções: chave composta (tenantId + customerId), sharding de consumers por tenant.',
    tip: 'O hotspot de partição por tenant em sistema multi-tenant é o problema que aparece em produção e que a maioria não menciona. Demonstra experiência operacional real.',
  },
  {
    level: 'Senior',
    q: 'Como você monitora a saúde de um sistema event-driven?',
    a: '<strong>Consumer lag</strong>: distância entre produtor e consumer. Crescimento → alerta. <strong>DLQ depth</strong>: alarme imediato quando cresce. <strong>Error rate</strong>: taxa de falha no processamento. <strong>End-to-end latency</strong>: tempo entre evento publicado e efeito no read model — mede eventual consistency real para o usuário. <strong>Schema violations</strong>: eventos rejeitados por schema registry. Ferramentas: Kafka Exporter + Prometheus + Grafana, CloudWatch para SQS, OTEL + Jaeger para tracing.',
    tip: 'End-to-end latency (evento → read model) é a métrica mais negligenciada e mais importante para UX. Mencioná-la demonstra que você conecta operações com experiência do usuário.',
  },
  {
    level: 'Senior',
    q: 'Como você testa um sistema event-driven?',
    a: '<strong>Consumer contract testing (Pact)</strong>: consumer define contrato do evento que espera. Producer verifica. Roda em CI — detecta breaking change antes do deploy. <strong>Integração com broker real</strong>: Testcontainers (Kafka real) ou EmbeddedKafka. Valida fluxo completo: publish → consume → efeito no banco. <strong>Chaos engineering</strong>: injete falhas no broker — valide idempotência, DLQ recebe corretamente, recovery após restart. Armadilha: 90% dos testes cobrem happy path. O comportamento de falha (retry, DLQ, compensação) é o que quebra em produção.',
    tip: 'Consumer contract testing com Pact é o diferencial mais citado por arquitetos sênior. É onde mais bugs de schema são encontrados antes de staging.',
  },
  {
    level: 'Senior',
    q: 'Quando NÃO usar event-driven architecture?',
    a: '<strong>Fluxo síncrono interativo</strong>: UI aguardando resposta — async via evento adiciona latência e complexidade sem ganho. REST/gRPC ganha. <strong>Sistema simples</strong>: monolito ou 2-3 serviços sem necessidade de desacoplamento — Kafka + idempotência + DLQ = premature optimization. <strong>Time sem maturidade em EDA</strong>: idempotência, ordering e schema evolution têm curva íngreme — sem experiência, bugs em produção difíceis de rastrear. <strong>Transações com consistência forte</strong>: transferência bancária precisa de ACID, não eventual consistency.',
    tip: 'Explicitar quando NÃO usar é o que diferencia arquiteto de dev que quer Kafka em todo projeto. Mostra julgamento de engenharia, não entusiasmo tecnológico.',
  },
  {
    level: 'Senior',
    q: 'O que é o padrão CloudEvents e por que importa?',
    a: 'CloudEvents (CNCF) é especificação aberta para formato padronizado de eventos. Campos obrigatórios: <code>specversion</code>, <code>type</code> (com.mystore.order.placed), <code>source</code> (/orders), <code>id</code> (base para idempotência), <code>time</code> (ISO 8601). Importância: interoperabilidade entre Kafka, SQS, EventBridge, NATS, HTTP — mesmo consumer processa eventos de qualquer origem. EventBridge suporta CloudEvents nativamente. SDKs oficiais para 10+ linguagens.',
    tip: 'CloudEvents é o detalhe de arquiteto que candidatos raramente conhecem. Citar CNCF e mencionar que EventBridge o suporta demonstra amplitude de conhecimento.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre domain events e integration events?',
    a: '<strong>Domain Event</strong>: interno ao bounded context. Carrega semântica rica do domínio. Muda com ritmo do domínio. Ex: <code>OrderLineAdded</code> com detalhes internos. Não deve sair do BC diretamente. <strong>Integration Event</strong>: publicado para outros serviços. Mais estável, mais genérico, é um contrato público. Transformado a partir do domain event pela camada de aplicação. Ex: <code>OrderPlaced</code> com apenas campos que outros serviços precisam. Um domain event pode gerar zero ou múltiplos integration events.',
    tip: 'A separação domain vs integration event é DDD avançado que a maioria omite. Conecta EDA com bounded contexts — demonstra pensamento arquitetural completo.',
  },
  {
    level: 'Senior',
    q: 'Como tracing distribuído funciona em sistemas event-driven?',
    a: 'Em sistemas síncronos, context OTEL propaga via headers HTTP. Em EDA, precisa viajar nos metadados do evento. Padrão W3C TraceContext: serializar <code>traceparent</code> + <code>tracestate</code> nos headers Kafka ou atributos SQS ao publicar. Ao consumir: extrair context e iniciar span filho. Resultado: Jaeger/Tempo mostra trace completa atravessando producer → broker → consumer com latência em cada salto. Sem isso, um erro no consumer 6 de uma cadeia de 8 é impossível de rastrear.',
    tip: 'Mencionar W3C TraceContext e o código de inject/extract diferencia completamente de candidatos que falam "adiciona correlation ID" sem saber do padrão real.',
  },
  {
    level: 'Senior',
    q: 'O que é temporal decoupling e quais são seus trade-offs?',
    a: 'Temporal decoupling: producer e consumer não precisam estar disponíveis ao mesmo tempo. Producer publica e continua; consumer processa quando pronto. <strong>Vantagens</strong>: producer não é impactado por consumer lento, escala independente, tolerância a manutenção. <strong>Trade-offs</strong>: consistência eventual — UX deve ser projetada para isso. Backpressure: consumer lento + producer rápido = lag crescente — precisa estratégia de scaling. Debug sem callback síncrono: problema aparece horas depois sem correlação óbvia. Negócio precisa aceitar que "dado atualizado" pode demorar N segundos.',
    tip: 'Backpressure e o impacto em UX de consistência eventual são pontos operacionais que demonstram que você já gerenciou sistema EDA em produção.',
  },
  {
    level: 'Senior',
    q: 'Como event storming contribui para o design de sistemas event-driven?',
    a: 'Event Storming (Alberto Brandolini) é workshop de descoberta: post-its laranja (domain events), azul (commands), amarelo (aggregates/actors), rosa (external systems) em timeline. Identifica naturalmente: (1) eventos canônicos com naming da ubiquitous language. (2) Bounded contexts — grupos de eventos do mesmo domínio → candidatos a serviços. (3) Hotspots (vermelho) — conflitos de processo. (4) Sagas — sequências com compensação visível na timeline. Event storming como step 0 garante que eventos modelados refletem o negócio, não a estrutura técnica.',
    tip: 'Conectar event storming com bounded context discovery é DDD↔EDA que poucas entrevistas exploram. Mostra que você pensa em design antes de código.',
  },
]

// ── Dados: Quick Reference ────────────────────────────────────────────────────

const QUICK_REF_DATA = {
  columns: [
    {
      sections: [
        {
          title: 'Tipos de Mensagem',
          entries: [
            { key: 'Evento', value: 'Fato passado — OrderPlaced, UserRegistered', badge: 'Passado', badgeColor: C },
            { key: 'Comando', value: 'Intenção futura — PlaceOrder, SendEmail', badge: 'Futuro', badgeColor: AMB },
            { key: 'Query', value: 'Leitura sem efeito colateral — GetOrder', badge: 'CQS', badgeColor: SKY },
          ],
        },
        {
          title: 'Garantias de Entrega',
          entries: [
            { key: 'at-most-once', value: 'Pode perder — UDP, métricas de baixo impacto', badge: 'Pode perder', badgeColor: RED },
            { key: 'at-least-once', value: 'Pode duplicar — padrão em Kafka/SQS', badge: 'Padrão', badgeColor: AMB },
            { key: 'exactly-once', value: 'at-least-once + idempotência = efeito', badge: 'Efeito', badgeColor: GRN },
          ],
        },
        {
          title: 'Brokers por Caso de Uso',
          entries: [
            { key: 'Kafka', value: 'Replay + alta vazão + streaming', badge: 'Streaming', badgeColor: AMB },
            { key: 'SQS Standard', value: 'Task queue simples, managed', badge: 'Simples', badgeColor: SKY },
            { key: 'SQS FIFO', value: 'Ordering garantida — max 300 msg/s', badge: 'Ordering', badgeColor: GRN },
            { key: 'EventBridge', value: 'Routing AWS, filtros JSON ricos', badge: 'Routing', badgeColor: '#22c55e' },
            { key: 'RabbitMQ', value: 'AMQP, exchanges flexíveis', badge: 'AMQP', badgeColor: PNK },
          ],
        },
      ],
    },
    {
      sections: [
        {
          title: 'Padrões Essenciais',
          entries: [
            { key: 'Outbox Pattern', value: 'Atomic publish — mesma transação do write', badge: 'Garantia', badgeColor: C },
            { key: 'Idempotência', value: 'eventId + TTL antes de efeito colateral', badge: 'Obrigatório', badgeColor: RED },
            { key: 'DLQ', value: 'Falhas isoladas — alarme quando cresce', badge: 'Observ.', badgeColor: AMB },
            { key: 'Schema Registry', value: 'Avro/Protobuf — enforça compatibilidade', badge: 'Contrato', badgeColor: SKY },
            { key: 'Saga Choreography', value: 'Implícito, desacoplado, difícil debug', badge: 'Simples', badgeColor: '#94a3b8' },
            { key: 'Saga Orchestration', value: 'Explícito, visível, compensação clara', badge: 'Debug', badgeColor: GRN },
          ],
        },
        {
          title: 'Observabilidade Essencial',
          entries: [
            { key: 'Consumer lag', value: 'Crescimento → alerta imediato', badge: 'Crítico', badgeColor: RED },
            { key: 'DLQ depth', value: 'Qualquer valor → alarme', badge: 'Alarme', badgeColor: RED },
            { key: 'Error rate', value: 'Pico → schema ou dep. indisponível', badge: 'Diagnose', badgeColor: AMB },
            { key: 'E2E latency', value: 'Evento → read model — SLA de eventual consistency', badge: 'UX', badgeColor: C },
            { key: 'Correlation ID', value: 'W3C traceparent em todos os eventos', badge: 'Tracing', badgeColor: SKY },
          ],
        },
      ],
    },
  ],
}

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'ECI — os três tipos de mensagem',
    trick: 'Eventos Contam o que já ocorreu, Comandos Indicam',
    expansion: [
      ['E = Evento', 'Fato passado imutável — OrderPlaced, UserRegistered'],
      ['C = Comando', 'Intenção futura dirigida — PlaceOrder, SendEmail'],
      ['I = (I)nterogação / Query', 'Leitura sem efeito colateral — GetOrder'],
    ],
    explanation: 'ECI: Evento (passado), Comando (futuro), Query (leitura pura). Naming no passado = evento. Naming imperativo = comando. Naming como pergunta = query.',
    example: '"UserShouldBeNotified" → Comando disfarçado. "UserRegistered" → Evento correto.',
    why: 'A distinção semântica entre evento e comando é fundamental. Confundir os dois cria acoplamento oculto entre serviços.',
  },
  {
    label: 'OIDR — pipeline de eventos confiável',
    trick: 'Outbox Isola, Idempotência Desinfeta, Relay Republica',
    expansion: [
      ['O = Outbox', 'Grava evento atomicamente com o dado — sem outbox = evento pode ser perdido'],
      ['I = Idempotência', 'Consumer processa N vezes com mesmo resultado — sem ela = duplicatas'],
      ['D = Desinfeta', 'Checa eventId antes de qualquer efeito colateral'],
      ['R = Relay', 'Processo separado lê outbox e publica com retry at-least-once'],
    ],
    explanation: 'OIDR = os três pilares de um pipeline de eventos confiável. Outbox garante publicação. Idempotência trata duplicatas. Relay garante entrega mesmo com broker indisponível.',
    example: 'Sem outbox: commit no banco → kafka down → evento perdido. Com OIDR: outbox grava → relay publica → consumer ignora duplicata.',
    why: 'Esses três conceitos juntos garantem consistência eventual sem 2PC. É a arquitetura de produção para qualquer sistema event-driven sério.',
  },
  {
    label: 'CLO — choreography vs orchestration',
    trick: 'Choreography é Livre e Opaco; Orchestration é Ordenada',
    expansion: [
      ['C = Choreography', 'Cada serviço reage livremente, sem coordenador'],
      ['L = Livre', 'Baixo acoplamento — fácil adicionar novo consumidor'],
      ['O = Opaco', 'Fluxo implícito — difícil debugar saga quebrada'],
      ['Orchestration', 'Orquestrador controla a ordem — explícito e visível'],
    ],
    explanation: 'CLO = Choreography Livre Opaco, Orchestration Ordenada. Escolha: saga curta (≤3 passos) sem compensação → Choreography. Saga longa com compensação obrigatória → Orchestration.',
    example: 'Saga de checkout com 7 etapas + estorno parcial → Orchestration (Step Functions). Notificação simples após pedido → Choreography.',
    why: 'Escolher entre os dois sem entender os trade-offs é o erro mais comum. CLO fixa na memória os prós e contras de cada abordagem.',
  },
  {
    label: 'BAF — schema evolution segura',
    trick: 'Backward Adiciona, Forward Aceita desconhecidos',
    expansion: [
      ['B = Backward', 'Consumer novo lê evento antigo — pode adicionar campo opcional'],
      ['A = Adiciona', 'Adicionar campo = sempre backward+forward safe'],
      ['F = Forward', 'Consumer antigo lê evento novo — ignora campos desconhecidos'],
      ['Breaking', 'Renomear ou remover campo obrigatório = BREAKING'],
    ],
    explanation: 'BAF = regras de compatibilidade de schema. Backward: novo código + dados antigos. Forward: código antigo + dados novos. Adicionar é sempre seguro. Renomear nunca é.',
    example: 'v1: { amount: 100 } → v2: { amount: 100, description: "salário" } = BAF safe. v2: { totalValue: 100 } = BREAKING.',
    why: 'Schema evolution é onde mais sistemas event-driven falham em produção. BAF reduz a regra a uma fórmula simples.',
  },
  {
    label: 'LCDE — observabilidade de sistemas event-driven',
    trick: 'Lag, Consumer error, Dead, End-to-end',
    expansion: [
      ['L = Lag', 'Consumer lag — distância entre producer e consumer. Crescimento = alerta'],
      ['C = Consumer error rate', 'Taxa de falhas no processamento. Pico = bug ou schema break'],
      ['D = Dead letter queue', 'DLQ depth — alarme imediato. Zero deveria ser o normal'],
      ['E = End-to-end latency', 'Tempo do evento até efeito no read model — SLA de eventual consistency'],
    ],
    explanation: 'LCDE = as quatro métricas que um engenheiro sênior olha primeiro ao investigar problema em sistema EDA.',
    example: 'Lag cresce → consumer está lento ou parado. DLQ cresce → há bug no consumer ou schema breaking change. E2E latency alta → projector atrasado.',
    why: 'Saber exatamente o que monitorar e o que cada métrica significa é diferencial de quem opera sistemas EDA em produção.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Consumer não idempotente — duplicata gera side-effect duplo',
    badDesc: 'Processamento sem verificar eventId: at-least-once gera cobranças, e-mails e registros duplicados',
    badCode: [
      { t: 'async function handleOrderPlaced(event) {\n', c: '#e2e8f0' },
      { t: '  // ❌ sem verificação de idempotência\n', c: RED },
      { t: '  await chargeCard(event.customerId, event.total)\n', c: RED },
      { t: '  await sendConfirmationEmail(event.email)\n', c: RED },
      { t: '  // Se este handler rodar 2x:\n', c: RED },
      { t: '  // cobrança dupla + email duplicado!\n', c: RED },
      { t: '}\n', c: '#e2e8f0' },
    ],
    goodDesc: 'Verifica eventId antes de qualquer efeito colateral — segunda entrega é ignorada',
    goodCode: [
      { t: 'async function handleOrderPlaced(event) {\n', c: '#e2e8f0' },
      { t: '  const seen = ', c: '#e2e8f0' },
      { t: 'await redis.get(`idem:${event.eventId}`)\n', c: GRN },
      { t: '  ', c: '#e2e8f0' }, { t: 'if (seen) return // duplicata ignorada\n', c: GRN },
      { t: '  await chargeCard(event.customerId, event.total)\n', c: '#e2e8f0' },
      { t: '  await sendConfirmationEmail(event.email)\n', c: '#e2e8f0' },
      { t: '  await redis.set(`idem:${event.eventId}`, 1, "EX", 86400)\n', c: GRN },
      { t: '}\n', c: '#e2e8f0' },
    ],
    why: 'At-least-once delivery garante duplicatas. Sem idempotência, duplicata = cobrança dupla, e-mail duplicado, saldo errado. Verificar o eventId antes de qualquer efeito colateral é regra não-negociável.',
  },
  {
    title: 'Evento como comando disfarçado — acoplamento semântico',
    badDesc: 'Naming imperativo revela que producer está controlando o consumer — é um comando, não um evento',
    badCode: [
      { t: '// ❌ Naming imperativo = comando disfarçado\n', c: RED },
      { t: 'await publish("UserShouldReceiveEmail", {\n', c: RED },
      { t: '  to: "user@email.com",\n', c: '#e2e8f0' },
      { t: '  template: "welcome",\n', c: '#e2e8f0' },
      { t: '  subject: "Bem-vindo!"\n', c: '#e2e8f0' },
      { t: '})\n', c: '#e2e8f0' },
      { t: '// Producer sabe o que o consumer deve fazer\n', c: RED },
    ],
    goodDesc: 'Evento descreve fato — consumer decide autonomamente o que fazer com ele',
    goodCode: [
      { t: '// ✅ Evento descreve fato no passado\n', c: GRN },
      { t: 'await publish("UserRegistered", {\n', c: GRN },
      { t: '  userId: "u-123",\n', c: '#e2e8f0' },
      { t: '  email: "user@email.com",\n', c: '#e2e8f0' },
      { t: '  registeredAt: new Date().toISOString()\n', c: '#e2e8f0' },
      { t: '})\n', c: '#e2e8f0' },
      { t: '// NotificationService decide enviar welcome email\n', c: GRN },
    ],
    why: 'Evento imperativo cria acoplamento oculto: se o comportamento do consumer mudar, você precisa mudar o produtor. O ponto do EDA é que o producer não sabe nem quem consome.',
  },
  {
    title: 'Schema breaking change sem coordenação',
    badDesc: 'Renomear campo quebra silenciosamente consumers que dependem do nome antigo',
    badCode: [
      { t: '// v1 — schema atual em produção\n', c: '#94a3b8' },
      { t: '{ orderId: "123", amount: 99.90 }\n\n', c: '#e2e8f0' },
      { t: '// ❌ v2 — breaking change sem coordenação\n', c: RED },
      { t: '{ orderId: "123", totalValue: 99.90 }\n', c: RED },
      { t: '// Consumer v1 lê "amount" → undefined\n', c: RED },
      { t: '// Dados corrompidos silenciosamente\n', c: RED },
    ],
    goodDesc: 'Adicionar campo opcional (backward-compatible) com período de deprecação antes de remover o antigo',
    goodCode: [
      { t: '// ✅ v2 backward-compatible\n', c: GRN },
      { t: '{ orderId: "123",\n', c: '#e2e8f0' },
      { t: '  amount: 99.90,      // mantém campo antigo\n', c: GRN },
      { t: '  totalValue: 99.90 } // adiciona novo campo\n', c: GRN },
      { t: '// Consumer v1 lê "amount" normalmente\n', c: GRN },
      { t: '// Consumer v2 lê "totalValue"\n', c: GRN },
      { t: '// Após todos migrarem → remove "amount"\n', c: AMB },
    ],
    why: 'Consumers em versões diferentes coexistem. Schema Registry com Avro enforça compatibilidade em tempo de publicação — detecta breaking change antes de impactar produção.',
  },
  {
    title: 'Sem correlation ID — debug impossível',
    badDesc: 'Evento sem contexto de rastreamento — impossível seguir uma transação através de múltiplos serviços',
    badCode: [
      { t: '// ❌ Evento sem rastreamento\n', c: RED },
      { t: 'await publish("OrderPlaced", {\n', c: '#e2e8f0' },
      { t: '  orderId: "abc123",\n', c: '#e2e8f0' },
      { t: '  customerId: "u-99"\n', c: '#e2e8f0' },
      { t: '  // sem eventId, sem traceId\n', c: RED },
      { t: '})\n', c: '#e2e8f0' },
      { t: '// 8 serviços processam → erro no 6º\n', c: RED },
      { t: '// Impossível rastrear a causa raiz\n', c: RED },
    ],
    goodDesc: 'Correlation ID + W3C TraceContext propagados em todos os eventos da cadeia',
    goodCode: [
      { t: '// ✅ Rastreamento completo\n', c: GRN },
      { t: 'await publish("OrderPlaced", {\n', c: '#e2e8f0' },
      { t: '  orderId: "abc123",\n', c: '#e2e8f0' },
      { t: '  eventId: ', c: '#e2e8f0' }, { t: 'crypto.randomUUID(),\n', c: GRN },
      { t: '  correlationId: ', c: '#e2e8f0' }, { t: 'requestCtx.correlationId,\n', c: GRN },
      { t: '  traceparent: ', c: '#e2e8f0' }, { t: 'otelCtx.traceparent,\n', c: GRN },
      { t: '})\n', c: '#e2e8f0' },
    ],
    why: 'Sem correlation ID, um erro no consumer 6 de uma cadeia de 8 serviços leva horas para rastrear. W3C traceparent + correlationId habilitam tracing distribuído completo com Jaeger/Tempo.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Event-Driven Architecture',
    stackLabel: 'Arquitetura · Sistemas Distribuídos',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_DATA.columns,
    skillName: 'Event-Driven Architecture',
    accentColor: C,
    stackLabel: 'Arquitetura · Sistemas Distribuídos',
    tagline: 'Desacoplar produtor e consumidor no tempo e no espaço',
    version: 'Kafka 3.x · SQS · EventBridge · CloudEvents 1.0',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Event-Driven Architecture',
    stackLabel: 'Arquitetura · Sistemas Distribuídos',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Event-Driven Architecture',
    stackLabel: 'Arquitetura · Sistemas Distribuídos',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function EventDrivenPdfs() {
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
