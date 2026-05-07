import type { SkillContent } from '@/types'

const eventDriven: SkillContent = {
  tagline: 'Sistemas comunicando via eventos para desacoplar produtor e consumidor no tempo e no espaço.',
  why: 'Event-driven architecture é tema-chave em entrevista sênior de backend e sistemas distribuídos. Saber diferenciar evento de comando, explicar idempotência, outbox pattern e saga é o que separa quem já sentiu a dor em produção de quem só leu sobre. Kafka, EventBridge, event sourcing e CQRS aparecem juntos em qualquer design review sério.',
  summary: 'Event-driven architecture (EDA) tem produtores publicando eventos — fatos imutáveis sobre o que aconteceu (OrderPlaced, UserSignedUp) — e consumidores reagindo de forma assíncrona. Desacopla serviços no tempo e no espaço: o produtor não sabe quem consome nem quando. Habilita escala independente, evolução isolada de serviços e audit trail natural. O custo é complexidade operacional: idempotência obrigatória, gestão de ordering, schema evolution com backward compatibility, observabilidade em cadeia de eventos e debugging distribuído difícil. Existem três sabores principais: pub/sub simples (notificação), event streaming com replay (Kafka), e event sourcing (eventos como única source of truth do estado).',
  keypoints: [
    { title: 'Evento vs Comando vs Query (CQS)', body: 'Evento = "aconteceu" — passado, imutável, broadcast para múltiplos consumidores. Nenhum consumidor é obrigatório. Comando = "faz isso" — futuro, dirigido a um destino, espera processamento. Query = "me diz" — sem efeito colateral, retorna dado. Misturar semânticas gera acoplamento oculto. Naming canônico: OrderPlaced (evento), PlaceOrder (comando), GetOrder (query).' },
    { title: 'At-least-once e idempotência', body: 'Filas e Kafka garantem at-least-once por padrão — mensagem pode chegar mais de uma vez por retry, rebalanceamento ou falha de ACK. Consumer DEVE ser idempotente: processar a mesma mensagem N vezes tem o mesmo efeito que processar uma vez. Padrões: chave de idempotência armazenada com TTL, unique constraint no banco, check de estado antes de processar.' },
    { title: 'Outbox Pattern (garantia transacional)', body: 'Para publicar evento atomicamente com o write no banco: grava o evento em tabela outbox na mesma transação do dado. Um relay (Debezium CDC ou polling) lê a outbox e publica no broker. Garante at-least-once sem 2PC. Sem outbox, você tem window de falha entre commit e publicação — evento perdido silenciosamente.' },
    { title: 'Choreography vs Orchestration (Sagas)', body: 'Choreography: serviços reagem a eventos sem coordenador central. Baixo acoplamento, fluxo emerge dos eventos, mas é invisível e difícil de debugar. Orchestration: um orquestrador (Step Functions, Temporal, Camunda) controla a sequência explicitamente. Mais visível, suporta compensação, mas cria ponto central e acoplamento ao orquestrador. Sagas longas geralmente exigem orchestration.' },
    { title: 'Schema Evolution (backward/forward compatibility)', body: 'Eventos duram mais que código — consumidores antigos devem processar eventos novos (forward compatibility) e consumidores novos devem processar eventos antigos (backward compatibility). Use schema registry (Confluent Schema Registry com Avro ou Protobuf). Regras: adicionar campo opcional é backward-compatible; renomear ou remover campo quebra contratos. Versionar namespace do evento quando breaking change for inevitável.' },
    { title: 'Event Sourcing', body: 'Em vez de salvar estado atual, salva a sequência imutável de eventos que levaram a esse estado. Banco de dados é append-only event store. Estado atual é calculado reproduzindo (replaying) eventos desde o início ou desde um snapshot. Habilita replay para debug, projeções, CQRS nativo e audit log perfeito. Custo: complexidade de evolução de schema de eventos antigos, eventual consistency nas projeções.' },
    { title: 'Dead Letter Queue e observabilidade', body: 'Mensagens que falharam N vezes vão para DLQ. Permite análise sem bloquear o pipeline principal. Sem DLQ, mensagem com bug trava consumer para sempre. Observabilidade essencial: consumer lag (atraso em relação ao producer), throughput, taxa de DLQ, correlation ID em todo evento para tracing distribuído.' },
  ],
  gotchas: [
    'Consumer não idempotente — duplicata gera cobrança dupla, e-mail duplicado, saldo incorreto. Sempre projete com chave de idempotência antes de qualquer efeito colateral.',
    'Evento como comando disfarçado — "UserShouldBeNotified" é um comando, não evento. Naming imperativo indica acoplamento: o produtor está controlando o consumidor.',
    'Esquecer DLQ + alarme — mensagem com bug desaparece silenciosamente. Você descobre o problema semanas depois ao perceber inconsistência nos dados.',
    'Schema breaking change sem coordenação — produtor publica campo renomeado, consumer antigo quebra silenciosamente. Use compatibilidade backward-first e schema registry obrigatório.',
    'Mega-event com tudo dentro — evento com 50 campos vira contrato implícito acoplado a todos os consumidores. Prefira eventos pequenos e focados. Se consumidor precisa de mais dados, use enrichment via query.',
    'Debug em event chain longa sem tracing — sem correlation ID e distributed tracing (OTEL), você não consegue rastrear uma ordem através de 8 serviços. Adicione desde o dia 1.',
    'Consistência eventual não comunicada ao time de produto — UX assume consistência forte. Se o pedido aparece como "criado" só depois de 2s no painel, o produto precisa saber e projetar para isso.',
    'Ordering assumida sem particionamento correto — em Kafka, ordering só é garantida dentro de uma partição. Sem chave de partição correta (ex: customerId), eventos do mesmo cliente podem ser processados fora de ordem.',
  ],

  interview: [
    {
      level: 'pleno',
      q: 'Qual a diferença entre evento, comando e query em sistemas distribuídos?',
      a: '<p><strong>Evento</strong> é um fato sobre algo que aconteceu no passado. É imutável, broadcast — qualquer número de consumidores pode reagir (ou nenhum). Ex: <code>OrderPlaced</code>, <code>UserRegistered</code>. O produtor não sabe nem se importa com os consumidores.</p><p><strong>Comando</strong> é uma intenção de realizar uma ação. É dirigido a um destino específico. Ex: <code>PlaceOrder</code>, <code>SendEmail</code>. Pode ser recusado pelo destinatário.</p><p><strong>Query</strong> é uma leitura sem efeito colateral. Princípio CQS de Meyer: separar operações que mudam estado (commands) de operações que retornam dados (queries). Em EDA, queries são geralmente síncronas (REST/gRPC) ou via read model de CQRS.</p><p>A confusão mais comum: nomear evento no imperativo (<code>UserShouldBeNotified</code>) — isso é comando disfarçado, indica acoplamento oculto ao consumidor.</p>',
      tip: 'Mencionar CQS (Command-Query Separation) de Bertrand Meyer mostra raiz teórica. Depois mostre a aplicação prática com exemplos de naming correto vs incorreto.',
    },
    {
      level: 'pleno',
      q: 'O que é idempotência e por que é obrigatória em consumers de eventos?',
      a: '<p>Uma operação é <strong>idempotente</strong> quando aplicá-la múltiplas vezes produz o mesmo resultado que aplicar uma vez. Em event-driven, obrigatória porque brokers como Kafka e SQS garantem <strong>at-least-once delivery</strong>: uma mensagem pode chegar mais de uma vez por retry, rebalanceamento de partição ou falha de ACK.</p><p>Técnicas de implementação:</p><ul><li><strong>Chave de idempotência</strong>: armazene o <code>eventId</code> (com TTL) em Redis ou banco antes de processar. Se já existe, ignore — retorne 200/ACK sem processar novamente.</li><li><strong>Unique constraint</strong>: <code>INSERT INTO orders WHERE event_id = ...</code> com UNIQUE constraint — segundo insert gera violação, ignore a exceção.</li><li><strong>Check de estado</strong>: verifique estado atual antes de aplicar. Se pedido já está <code>SHIPPED</code>, ignorar <code>ShipOrder</code>.</li></ul><p>Sem idempotência, duplicata causa cobrança dupla, e-mail duplicado, saldo errado.</p>',
      tip: 'Apresentar as três técnicas concretas é o que diferencia quem sabe na teoria de quem já implementou em produção.',
    },
    {
      level: 'pleno',
      q: 'O que é o outbox pattern e por que ele existe?',
      a: '<p>O problema: após fazer commit no banco, a publicação no broker pode falhar. O evento é perdido. Sem outbox, há uma janela de falha entre commit e publish — inconsistência silenciosa.</p><p>O <strong>outbox pattern</strong> resolve: na mesma transação do write, grava o evento em uma tabela <code>outbox</code>. Um relay separado (CDC com Debezium ou polling) lê os registros não publicados e publica no broker. Se a publicação falhar, o relay tenta novamente — garantia de at-least-once.</p><pre><code>BEGIN;\nINSERT INTO orders VALUES (...);\nINSERT INTO outbox (event_type, payload, created_at) VALUES (...);\nCOMMIT;\n-- relay lê outbox e publica no broker</code></pre><p>Alternativa: event sourcing nativo elimina o problema — o store de eventos é o banco.</p>',
      tip: 'Mencionar Debezium CDC mostra que você conhece a solução de produção, não só o conceito. CDC lê o WAL do Postgres — zero polling overhead.',
    },
    {
      level: 'pleno',
      q: 'Choreography vs Orchestration para Sagas — quando usar cada um?',
      a: '<p><strong>Choreography</strong>: cada serviço reage a eventos e publica próximos eventos sem coordenador. Ex: <code>OrderPlaced → PaymentService reage → PaymentProcessed → InventoryService reage → StockReserved</code>. Vantagem: baixo acoplamento, escala bem. Desvantagem: fluxo de negócio é implícito, disperso por N serviços — difícil rastrear estado da saga, difícil implementar compensação.</p><p><strong>Orchestration</strong>: um orquestrador central (Step Functions, Temporal, Camunda) controla a sequência explicitamente, conhece o estado da saga, dispara compensações se algo falha. Vantagem: visível, debugável, suporta timeout e retry por etapa. Desvantagem: ponto central, acoplamento ao orquestrador.</p><p>Regra prática: saga com 2-3 passos sem compensação → choreography. Saga longa com compensação obrigatória (cancelamento de pedido com estorno) → orchestration. Na prática, 80% dos times migra para orchestration após debugar choreography na primeira vez.</p>',
      tip: 'A honestidade sobre "80% dos times" demonstra experiência real. Candidatos que defendem choreography sem ressalvas nunca debugaram uma saga quebrada em produção.',
    },
    {
      level: 'pleno',
      q: 'Quais são as diferenças entre Kafka, SQS e EventBridge?',
      a: '<p><strong>Kafka</strong>: log distribuído imutável, alta vazão (milhões/s), retenção longa (dias a anos), replay desde qualquer offset, ordering por partição. Custo: operação pesada (cluster, ZooKeeper/KRaft, schema registry). Ideal para event streaming, analytics, event sourcing.</p><p><strong>SQS</strong>: fila gerenciada pela AWS, sem retenção longa, sem replay nativo. <code>Standard</code>: alta vazão, sem ordering. <code>FIFO</code>: ordering garantida, até 300 msg/s por fila. Simples, barato, zero operação. Ideal para desacoplamento simples de serviços, task queues.</p><p><strong>EventBridge</strong>: barramento de eventos AWS, roteamento por regra (filtros JSON), integração com SaaS nativos, baixo throughput (10k/s por bus). Ideal para integração entre serviços AWS, eventos de terceiros (Stripe, PagerDuty), routing complexo.</p><p>Regra: precisa de replay e alta vazão? Kafka. Task queue simples? SQS. Routing entre serviços AWS? EventBridge.</p>',
      tip: 'Citar o limite de 300 msg/s do SQS FIFO é o detalhe que elimina candidatos — muitos escolhem FIFO sem saber do tradeoff de throughput.',
    },
    {
      level: 'pleno',
      q: 'O que é exactly-once delivery e é possível garantir end-to-end?',
      a: '<p><strong>Exactly-once end-to-end não existe em geral</strong> em sistemas distribuídos — é impossível sem 2PC, que tem custo impraticável. O que existe é <strong>at-least-once + idempotência</strong> = efeito de exactly-once.</p><p>Kafka tem exactly-once <em>dentro do cluster</em> com <code>enable.idempotence=true</code> no producer + transações para atomicidade read-process-write. Mas o consumer ainda precisa de idempotência lógica para garantir que o efeito externo (DB, API) não se repete.</p><p>Na prática: projete consumers idempotentes e aceite at-least-once como modelo. Exactly-once é marketing que esconde a complexidade real.</p>',
      tip: 'Afirmar que exactly-once não existe end-to-end é a resposta de arquiteto sênior. Candidatos que dizem "Kafka tem exactly-once" sem ressalvas não entenderam o scope da garantia.',
    },
    {
      level: 'pleno',
      q: 'O que é schema evolution e como gerenciar backward e forward compatibility?',
      a: '<p>Eventos são publicados por um produtor e consumidos por N consumidores que podem estar em versões diferentes. <strong>Backward compatibility</strong>: consumidor na versão nova consegue ler eventos na versão antiga. <strong>Forward compatibility</strong>: consumidor na versão antiga consegue ler eventos na versão nova (ignora campos desconhecidos).</p><p>Regras de compatibilidade:</p><ul><li><strong>Safe (backward + forward)</strong>: adicionar campo opcional com default. Ambos os lados toleram.</li><li><strong>Apenas backward</strong>: remover campo — consumidor novo ignora, consumidor antigo não encontra campo que esperava.</li><li><strong>Breaking</strong>: renomear campo, mudar tipo, tornar opcional → obrigatório.</li></ul><p>Use Schema Registry (Confluent + Avro ou Protobuf) com enforcement de compatibilidade. Para breaking changes: deprecate → novo namespace de evento → dual-publish por N semanas → remover versão antiga.</p>',
      tip: 'Saber a diferença exata entre backward e forward compatibility é pergunta frequente de entrevista sênior. Maioria dos candidatos confunde os dois.',
    },
    {
      level: 'pleno',
      q: 'O que é o padrão Dead Letter Queue e quando uma mensagem vai para ele?',
      a: '<p><strong>Dead Letter Queue (DLQ)</strong> é uma fila separada para mensagens que falharam no processamento após N tentativas. O broker (SQS, Kafka com customização, RabbitMQ) move automaticamente mensagens que excederam o limite de reprocessamento para a DLQ.</p><p>Gatilhos comuns:</p><ul><li>Exceção não tratada no consumer em todas as N retentativas.</li><li>Mensagem corrompida (schema inválido, campo obrigatório ausente).</li><li>Bug no consumer que faz crash repetido.</li><li>Timeout por dependência indisponível.</li></ul><p>Operação na DLQ: inspecionar a mensagem, corrigir o bug, re-enfileirar para reprocessamento. Sem DLQ, a mensagem trava o consumer para sempre (em FIFO) ou é descartada silenciosamente. Alerte quando DLQ cresce — é sinal de bug ou mudança de schema.</p>',
      tip: 'Mencionar que a DLQ precisa de alarme configurado diferencia — muitas equipes têm DLQ mas descobrem os problemas tarde demais por falta de alerta.',
    },
    {
      level: 'senior',
      q: 'Como você desenha um pipeline de eventos confiável do zero?',
      a: '<p>Camadas de confiabilidade:</p><p><strong>Producer</strong>: outbox pattern para atomicidade entre write e publish. Schema registry com Avro/Protobuf. Correlation ID gerado no request de origem, propagado em todo evento. Acks configurado como <code>acks=all</code> no Kafka.</p><p><strong>Broker</strong>: Kafka com replicação ≥3 e retention adequada ao SLA de replay. SQS com DLQ configurada. Particionamento com chave de negócio relevante (customerId, tenantId) para garantir ordering onde necessário.</p><p><strong>Consumer</strong>: idempotência com evento ID armazenado antes de efeito colateral. At-least-once aceito como modelo. Retry com backoff exponencial. DLQ após N falhas. Observabilidade: consumer lag, throughput, taxa de DLQ, error rate. Tracing distribuído com OTEL.</p><p><strong>Schema Evolution</strong>: backward-compatible por padrão, deprecation process para breaking changes. Testes de consumer contract (Pact).</p>',
      tip: 'Descrever as quatro camadas (producer, broker, consumer, schema) mostra visão sistêmica. Mencionar consumer contract testing (Pact) diferencia muito.',
    },
    {
      level: 'senior',
      q: 'O que é Event Sourcing e como difere de CRUD tradicional?',
      a: '<p><strong>CRUD tradicional</strong>: estado atual salvo na tabela. Atualização sobrescreve. Histórico perdido — você não sabe como chegou no estado atual.</p><p><strong>Event Sourcing</strong>: o banco é um log append-only de eventos imutáveis. Estado atual é calculado reproduzindo todos os eventos (<em>replay</em>) ou desde um snapshot. Exemplo: <code>AccountOpened → MoneyDeposited(100) → MoneyWithdrawn(30) → MoneyDeposited(50)</code> → saldo atual = 120.</p><p>Vantagens:</p><ul><li>Audit log perfeito e imutável — mandatório em fintech e saúde.</li><li>Time travel: recalcular estado em qualquer ponto no passado.</li><li>CQRS nativo: projeções construídas a partir dos eventos para read models otimizados.</li><li>Debug facilitado: replay do evento exato que causou o bug.</li></ul><p>Custos:</p><ul><li>Eventual consistency nas projeções.</li><li>Schema evolution de eventos antigos é complexa.</li><li>Snapshots necessários para aggregates com histórico longo.</li></ul>',
      tip: 'A regra prática: Event Sourcing brilha em domínios onde o histórico é o produto (banking, contabilidade, games). Em CRUD simples, é overengineering — diga isso explicitamente.',
    },
    {
      level: 'senior',
      q: 'Como integrar CQRS com Event Sourcing?',
      a: '<p>CQRS separa o modelo de escrita (Command Model) do modelo de leitura (Query Model / Read Model). Event Sourcing alimenta ambos:</p><ol><li><strong>Command side</strong>: recebe comando, valida contra aggregate atual, emite evento(s) se válido. Salva evento(s) no event store (append-only).</li><li><strong>Event store</strong> publica eventos para os projectors (pode ser via Kafka ou change stream).</li><li><strong>Projectors (Query side)</strong>: consomem eventos e mantêm read models otimizados para queries — tabelas desnormalizadas, Elasticsearch, Redis, etc.</li><li><strong>Query</strong>: lê diretamente do read model, sem toque no event store.</li></ol><p>A consistência entre event store e read model é <strong>eventual</strong> — há latência entre o evento ser publicado e o read model ser atualizado. Design de produto precisa aceitar isso ou implementar read-your-writes com a versão do evento.</p>',
      tip: 'A eventual consistency entre event store e read model é o ponto mais importante e o que mais gera confusão em produto. Mencioná-la explicitamente demonstra maturidade.',
    },
    {
      level: 'senior',
      q: 'Como você implementa o padrão Saga com orchestration usando AWS Step Functions?',
      a: '<p>Step Functions como orquestrador: define a máquina de estados da saga em JSON/YAML (Amazon States Language). Cada estado é uma chamada a uma Lambda ou serviço externo via SDK integration.</p><p>Exemplo — OrderSaga:</p><ol><li>Estado <code>ProcessPayment</code>: invoca PaymentService. Se falha → <code>CancelOrder</code> (compensação).</li><li>Estado <code>ReserveInventory</code>: invoca InventoryService. Se falha → <code>RefundPayment</code> + <code>CancelOrder</code>.</li><li>Estado <code>ShipOrder</code>: invoca ShippingService.</li></ol><p>Vantagens sobre choreography: Step Functions Dashboard mostra execução de cada saga individualmente — debugável. Suporte nativo a retry, catch, wait for callback (waitForTaskToken para operações assíncronas longas). Histórico de execução por 90 dias.</p><p>Compensação: cada passo de compensação é idempotente (pode ser chamado múltiplas vezes).</p>',
      tip: 'O <code>waitForTaskToken</code> é o detalhe que candidatos esquecem — permite que a saga aguarde um callback externo (pagamento processado por gateway de terceiro) sem polling.',
    },
    {
      level: 'senior',
      q: 'Como você garante ordering de eventos em Kafka para um domínio de negócio específico?',
      a: '<p>Kafka garante ordering <strong>apenas dentro de uma partição</strong>. Para garantir que eventos de um mesmo aggregate (ex: pedidos do mesmo cliente) sejam processados em ordem:</p><p><strong>1. Chave de partição</strong>: ao publicar, use a chave do aggregate como key do Kafka record. Ex: <code>customerId</code> ou <code>orderId</code>. Kafka faz hash da key e roteia para a mesma partição. Todos os eventos do mesmo customerId vão para a mesma partição → processados em ordem.</p><p><strong>2. Tradeoff de paralelismo</strong>: aumentar partições → mais paralelismo, mas a chave distribui melhor. Se você tem 10k customers e 6 partições, cada partição tem ~1.6k customers processados em ordem entre si, mas em paralelo com outras partições.</p><p><strong>3. Cuidado com hotspot</strong>: se uma chave específica gera muito mais eventos (ex: tenant grande em sistema multi-tenant), a partição correspondente fica sobrecarregada. Considere uma chave composta ou sharding de consumers.</p>',
      tip: 'O hotspot de partição é o problema que aparece em produção e que a maioria não menciona na entrevista. Mostra experiência operacional real.',
    },
    {
      level: 'senior',
      q: 'Como você implementa tracing distribuído em um sistema event-driven?',
      a: '<p>Em sistemas síncronos, tracing com OTEL propaga context via headers HTTP. Em event-driven, o context precisa viajar nos metadados do evento:</p><p><strong>Padrão W3C TraceContext</strong>: ao publicar evento, serialize <code>traceparent</code> e <code>tracestate</code> nos headers Kafka ou atributos da mensagem SQS. Ao consumir, extraia e inicie span filho.</p><p>Implementação em Node.js com @opentelemetry:</p><pre><code>// Producer: injeta context nos headers\nconst ctx = context.active()\nconst headers: Record&lt;string,string&gt; = {}\npropagator.inject(ctx, headers)\nawait producer.send({ headers })\n\n// Consumer: extrai context dos headers\nconst ctx = propagator.extract(ROOT_CONTEXT, msg.headers)\nconst span = tracer.startSpan("process.event", {}, ctx)</code></pre><p>Resultado: Jaeger/Tempo mostra a trace completa atravessando produtor → broker → consumer, com latência em cada salto.</p>',
      tip: 'Mostrar o código concreto de inject/extract diferencia completamente. Candidatos que falam "adiciona correlation ID" sem saber do W3C TraceContext não conhecem o padrão real.',
    },
    {
      level: 'senior',
      q: 'Quando NÃO usar event-driven architecture?',
      a: '<p><strong>Fluxo síncrono interativo</strong>: UI esperando resposta imediata (checkout, login, busca). Adicionar camada de evento aumenta latência e complexidade sem ganho. REST/gRPC ganha.</p><p><strong>Sistema simples com poucos serviços</strong>: monolito ou 2-3 serviços sem necessidade de desacoplamento. EDA seria premature optimization — custo de Kafka, observabilidade e idempotência supera o ganho.</p><p><strong>Time sem maturidade em EDA</strong>: idempotência, ordering, schema evolution e debugging distribuído têm curva de aprendizado íngreme. Implementar sem experiência → bugs em produção difíceis de rastrear.</p><p><strong>Transações críticas com consistência forte</strong>: transferência bancária precisa de ACID. Você pode ter event sourcing no aggregate, mas a operação em si precisa de transação atômica, não eventual consistency.</p><p>Regra: EDA brilha em escala, desacoplamento real e audit trail. Em CRUD simples ou aplicações pequenas, é overengineering.</p>',
      tip: 'Explicitar quando NÃO usar é o que diferencia arquiteto de developer que quer usar Kafka em todo projeto. Mostra maturidade de julgamento.',
    },
    {
      level: 'senior',
      q: 'O que é o padrão CloudEvents e por que ele importa?',
      a: '<p><strong>CloudEvents</strong> é uma especificação aberta (CNCF) para padronizar o formato de eventos em diferentes plataformas e linguagens. Define um envelope com metadados obrigatórios:</p><ul><li><code>specversion</code>: versão da spec (ex: "1.0")</li><li><code>type</code>: tipo do evento (ex: "com.mystore.order.placed")</li><li><code>source</code>: origin URI (ex: "/orders")</li><li><code>id</code>: identificador único — base para idempotência</li><li><code>time</code>: timestamp ISO 8601</li><li><code>datacontenttype</code>: ex: "application/json"</li><li><code>data</code>: payload do evento</li></ul><p>Importância: interoperabilidade entre Kafka, SQS, EventBridge, NATS, HTTP — o mesmo consumer processa eventos de qualquer origem. SDKs oficiais para 10+ linguagens. EventBridge usa CloudEvents nativamente. Facilita migração de broker sem mudança de consumidores.</p>',
      tip: 'CloudEvents é o detalhe de arquiteto que candidatos raramente conhecem. Mencioná-lo na discussão de schema evolution mostra que você pensa em interoperabilidade de longo prazo.',
    },
    {
      level: 'senior',
      q: 'Como você monitora a saúde de um sistema event-driven em produção?',
      a: '<p>Métricas essenciais:</p><ul><li><strong>Consumer lag</strong>: diferença entre offset do último evento publicado e offset do consumer. Crescimento indica consumer lento ou parado. Alerte quando lag > threshold por > 5min.</li><li><strong>DLQ depth</strong>: mensagens acumulando na DLQ. Alarme imediato — indica bug ou schema incompatível.</li><li><strong>Throughput (msg/s)</strong>: por tópico/fila, produtor e consumer. Drop súbito indica problema.</li><li><strong>Error rate</strong>: taxa de falhas no processamento de mensagens. Pico indica breaking change ou indisponibilidade de dependência.</li><li><strong>End-to-end latency</strong>: tempo entre publicação do evento e efeito visível no read model. Informa se eventual consistency está dentro do SLA.</li></ul><p>Ferramentas: Kafka → Kafka Exporter + Prometheus + Grafana. SQS → CloudWatch metrics + alarmes. Tracing → OpenTelemetry + Jaeger/Tempo.</p>',
      tip: 'A latência end-to-end (evento publicado → read model atualizado) é a métrica mais negligenciada e a mais importante para UX em sistemas EDA. Mencionar ela diferencia.',
    },
    {
      level: 'senior',
      q: 'Como você testa um sistema event-driven?',
      a: '<p>Em três camadas:</p><p><strong>Consumer Contract Tests (Pact)</strong>: valida que o consumer consegue desserializar eventos do producer. Testa a compatibilidade do schema sem infraestrutura real. Roda no pipeline de CI de ambos os lados — detecta breaking change antes do deploy.</p><p><strong>Testes de integração com broker em memória</strong>: para Kafka, use Testcontainers (broker real em Docker) ou EmbeddedKafka. Valide o fluxo completo: publicar evento → consumer processa → verificar efeito no banco.</p><p><strong>Chaos engineering</strong>: injete falhas no broker (latência, partição, down) e valide que o sistema mantém idempotência, que DLQ recebe mensagens corretamente, que consumer lag volta ao normal após recovery.</p><p>Armadilha: não testar retry → DLQ flow. 90% dos testes cobrem happy path, mas o comportamento de falha é o que quebra em produção.</p>',
      tip: 'Consumer contract testing com Pact é o item que a maioria ignora — e é onde mais se encontram bugs de schema em staging que deveriam ter sido pegos no CI.',
    },
    {
      level: 'senior',
      q: 'Como event-driven e event storming se relacionam?',
      a: '<p><strong>Event Storming</strong> é uma técnica de workshop de descoberta de domínio criada por Alberto Brandolini. Equipes colam post-its laranja (domain events), azul (commands), amarelo (aggregates/actors) e rosa (external systems) em uma timeline. O resultado é um mapa visual do fluxo de negócio.</p><p>Conexão com EDA: event storming naturalmente identifica:</p><ul><li>Os eventos que devem existir no sistema e seus nomes canônicos (ubiquitous language).</li><li>Bounded contexts — grupos de eventos que pertencem ao mesmo domínio → candidatos a microsserviços.</li><li>Hotspots (post-it vermelho) — pontos de dúvida ou conflito de processo.</li><li>Sagas naturais — sequências de eventos com compensação visível na timeline.</li></ul><p>Event storming como step 0 de EDA garante que os eventos modelados refletem o negócio real, não a estrutura técnica.</p>',
      tip: 'Conectar event storming com bounded context discovery é a ponte DDD↔EDA que poucas entrevistas exploram. Mostra que você pensa em design antes de código.',
    },
    {
      level: 'senior',
      q: 'Como você lida com domain events vs integration events em sistemas distribuídos?',
      a: '<p><strong>Domain Event</strong>: evento interno a um bounded context, carrega a semântica rica do domínio. Gerado dentro do aggregate, persistido junto com o estado (ou no event store). Exemplo: <code>OrderLineAdded</code> com todos os detalhes internos do Order aggregate. Não deve sair do bounded context diretamente — pode ser acoplamento.</p><p><strong>Integration Event</strong>: evento publicado para outros serviços ou bounded contexts. Mais estável, mais genérico, segue um contrato público. Transformado a partir do domain event pela camada de aplicação. Exemplo: <code>OrderPlaced</code> com apenas os campos que outros serviços precisam saber.</p><p>Separação importante porque:</p><ul><li>Domain events mudam com o ritmo do domínio — alta frequência de mudança.</li><li>Integration events são contratos — breaking change impacta múltiplos serviços.</li><li>Um domain event pode gerar zero ou múltiplos integration events.</li></ul>',
      tip: 'A separação domain event vs integration event é DDD avançado que a maioria não menciona. É a resposta que fecha a discussão sobre bounded contexts com EDA.',
    },
    {
      level: 'senior',
      q: 'Como implementar event-driven com NestJS e Kafka em produção?',
      a: '<p>Stack: <code>@nestjs/microservices</code> com <code>KafkaClient</code> + <code>kafkajs</code>. Para controle fino, prefer usar kafkajs diretamente com um provider custom.</p><pre><code>// Producer: provider custom com outbox\n@Injectable()\nexport class EventPublisher {\n  constructor(\n    private readonly kafka: KafkaProducerService,\n    private readonly outbox: OutboxRepository,\n  ) {}\n\n  async publish(event: DomainEvent, tx: EntityManager) {\n    await this.outbox.save(event, tx) // mesma transação\n    // relay separado lê e publica\n  }\n}\n\n// Consumer com idempotência\n@Injectable()\nexport class OrderEventConsumer {\n  @KafkaListener("orders.placed")\n  async handle(msg: OrderPlaced) {\n    if (await this.idempotency.seen(msg.eventId)) return\n    await this.idempotency.markSeen(msg.eventId)\n    await this.process(msg)\n  }\n}</code></pre><p>Observabilidade: Kafka Exporter para métricas Prometheus, consumer lag dashboard no Grafana, alerta em DLQ via AlertManager.</p>',
      tip: 'Mostrar o outbox + idempotência como estrutura completa (não só conceitos isolados) é a resposta de sênior. A maioria mostra um ou outro, não os dois integrados.',
    },
    {
      level: 'senior',
      q: 'O que é temporal decoupling e quais são seus trade-offs em sistemas event-driven?',
      a: '<p><strong>Temporal decoupling</strong>: produtor e consumidor não precisam estar disponíveis ao mesmo tempo. Produtor publica e continua; consumidor processa quando estiver pronto. O broker absorve a mensagem no intervalo.</p><p><strong>Vantagens</strong>:</p><ul><li>Produtor não é impactado por consumidor lento ou indisponível.</li><li>Consumer pode escalar independentemente do producer.</li><li>Tolerância a janelas de manutenção sem perda de dados.</li></ul><p><strong>Trade-offs</strong>:</p><ul><li>Consistência eventual — estado do consumidor atrasa em relação ao produtor. UX precisa ser projetada para isso.</li><li>Debugging mais complexo — problema pode aparecer horas depois no consumidor, sem correlação óbvia com o evento original.</li><li>Backpressure: se consumer está lento e producer é rápido, lag cresce. Precisa de estratégia de scaling do consumer (mais partições/instâncias) ou throttling do producer.</li><li>Sequências de negócio assumem que o processamento aconteceu — sem callback síncrono, o produtor não sabe se deu certo.</li></ul>',
      tip: 'Backpressure e como lidar com consumer lag são pontos operacionais que diferenciam arquiteto sênior. Mencionar que UX precisa ser projetada para consistência eventual é diferencial de pensamento de produto.',
    },
  ],

  diagrams: [
    {
      title: 'Fluxo Pub/Sub — Desacoplamento Temporal e Espacial',
      caption: 'Produtor publica evento; consumidores independentes reagem sem conhecimento mútuo',
      html: `
<style>
.eda-d1 { font-family: 'JetBrains Mono', monospace; background: #0f1117; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.eda-row { display: flex; align-items: center; gap: 8px; margin: 10px 0; flex-wrap: wrap; justify-content: center; }
.eda-box { border-radius: 8px; padding: 10px 14px; font-size: 11px; font-weight: 700; border: 2px solid; min-width: 100px; text-align: center; }
.eda-producer { background: #1a0a2e; border-color: #8b5cf6; color: #c4b5fd; }
.eda-broker { background: #1a1500; border-color: #f59e0b; color: #fcd34d; }
.eda-consumer { background: #052e16; border-color: #22c55e; color: #86efac; }
.eda-arrow { color: #475569; font-size: 18px; }
.eda-consumers { display: flex; flex-direction: column; gap: 8px; }
.eda-event { background: #1e2233; border-radius: 6px; padding: 8px 12px; font-size: 10px; border-left: 3px solid #8b5cf6; margin: 8px 0; }
.eda-label { font-size: 10px; color: #64748b; text-align: center; margin: 4px 0; }
.eda-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; background: #1a0a2e; color: #c4b5fd; border: 1px solid #8b5cf6; margin: 2px; }
.eda-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 16px; }
.eda-principle { background: #1e2233; border-radius: 8px; padding: 10px 12px; font-size: 10px; }
.eda-ph { font-weight: 700; margin-bottom: 4px; }
</style>
<div class="eda-d1">
  <div class="eda-row">
    <div>
      <div class="eda-box eda-producer">Order Service<br><small>Producer</small></div>
      <div class="eda-label">Publica evento</div>
    </div>
    <div class="eda-arrow">→</div>
    <div>
      <div class="eda-box eda-broker">Kafka / SQS<br><small>Broker</small></div>
      <div class="eda-event">{ type: "OrderPlaced",<br>  orderId: "abc123",<br>  customerId: "u-99" }</div>
    </div>
    <div class="eda-arrow">→</div>
    <div class="eda-consumers">
      <div class="eda-box eda-consumer">Notification Svc</div>
      <div class="eda-box eda-consumer">Inventory Svc</div>
      <div class="eda-box eda-consumer">Analytics Svc</div>
    </div>
  </div>
  <div class="eda-grid">
    <div class="eda-principle">
      <div class="eda-ph" style="color:#8b5cf6">Desacoplamento temporal</div>
      Producer não espera consumidores. Consumidores processam quando estiverem prontos.
    </div>
    <div class="eda-principle">
      <div class="eda-ph" style="color:#22c55e">Múltiplos consumidores</div>
      Cada serviço reage ao mesmo evento independentemente. Novos consumidores sem mudar producer.
    </div>
    <div class="eda-principle">
      <div class="eda-ph" style="color:#f59e0b">Idempotência obrigatória</div>
      At-least-once: o mesmo evento pode chegar mais de uma vez. Consumer deve ser idempotente.
    </div>
  </div>
</div>`,
    },
    {
      title: 'Choreography vs Orchestration (Saga Pattern)',
      caption: 'Dois modos de coordenar sagas distribuídas: implícito via eventos vs explícito via orquestrador',
      html: `
<style>
.eda-d2 { font-family: 'JetBrains Mono', monospace; background: #0f1117; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.eda-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.eda-col { background: #1e2233; border-radius: 8px; padding: 14px; }
.eda-colh { font-size: 12px; font-weight: 700; text-align: center; padding: 6px; border-radius: 6px; margin-bottom: 12px; }
.eda-choreo { background: #1a0a2e; color: #c4b5fd; }
.eda-orch { background: #052e16; color: #86efac; }
.eda-step { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 4px; margin: 4px 0; font-size: 10px; }
.eda-svc-s { background: #1a0a2e; border: 1px solid #8b5cf6; border-radius: 4px; padding: 2px 6px; color: #c4b5fd; white-space: nowrap; }
.eda-svc-g { background: #052e16; border: 1px solid #22c55e; border-radius: 4px; padding: 2px 6px; color: #86efac; white-space: nowrap; }
.eda-svc-o { background: #1a1500; border: 1px solid #f59e0b; border-radius: 4px; padding: 2px 6px; color: #fcd34d; white-space: nowrap; }
.eda-arr2 { color: #475569; }
.eda-ev { color: #8b5cf6; font-size: 9px; margin-top: 2px; font-style: italic; }
.eda-pros-cons { margin-top: 12px; font-size: 10px; }
.eda-pro { color: #86efac; padding: 2px 0; }
.eda-con { color: #fca5a5; padding: 2px 0; }
</style>
<div class="eda-d2">
  <div class="eda-cols">
    <div class="eda-col">
      <div class="eda-colh eda-choreo">Choreography</div>
      <div class="eda-step"><div class="eda-svc-s">Order Svc</div><div class="eda-arr2">→ emite →</div><div class="eda-ev">OrderPlaced</div></div>
      <div class="eda-step"><div class="eda-svc-s">Payment Svc</div><div class="eda-arr2">→ reage →</div><div class="eda-ev">PaymentProcessed</div></div>
      <div class="eda-step"><div class="eda-svc-s">Inventory Svc</div><div class="eda-arr2">→ reage →</div><div class="eda-ev">StockReserved</div></div>
      <div class="eda-step"><div class="eda-svc-s">Shipping Svc</div><div class="eda-arr2">→ reage →</div><div class="eda-ev">OrderShipped</div></div>
      <div class="eda-pros-cons">
        <div class="eda-pro">+ Baixo acoplamento</div>
        <div class="eda-pro">+ Fácil adicionar novo consumidor</div>
        <div class="eda-con">− Fluxo invisível / implícito</div>
        <div class="eda-con">− Difícil debugar saga quebrada</div>
        <div class="eda-con">− Compensação complexa</div>
      </div>
    </div>
    <div class="eda-col">
      <div class="eda-colh eda-orch">Orchestration</div>
      <div style="text-align:center; margin-bottom: 8px;">
        <div class="eda-svc-o" style="display:inline-block; padding: 6px 12px;">Saga Orchestrator<br><small>(Step Functions / Temporal)</small></div>
      </div>
      <div class="eda-step"><div class="eda-arr2">1.</div><div class="eda-svc-g">→ chama Payment Svc</div></div>
      <div class="eda-step"><div class="eda-arr2">2.</div><div class="eda-svc-g">→ chama Inventory Svc</div></div>
      <div class="eda-step"><div class="eda-arr2">3.</div><div class="eda-svc-g">→ chama Shipping Svc</div></div>
      <div class="eda-step"><div class="eda-arr2">❌</div><div class="eda-svc-g">→ compensação explícita</div></div>
      <div class="eda-pros-cons">
        <div class="eda-pro">+ Fluxo visível e explícito</div>
        <div class="eda-pro">+ Debug facilitado</div>
        <div class="eda-pro">+ Compensação clara</div>
        <div class="eda-con">− Ponto central (acoplamento)</div>
        <div class="eda-con">− Mais complexo de implementar</div>
      </div>
    </div>
  </div>
</div>`,
    },
    {
      title: 'Outbox Pattern — Garantia Transacional de Publicação',
      caption: 'Como garantir que evento é publicado exatamente quando o dado é salvo no banco',
      html: `
<style>
.eda-d3 { font-family: 'JetBrains Mono', monospace; background: #0f1117; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.eda-flow { display: flex; flex-direction: column; gap: 10px; }
.eda-fstep { display: flex; align-items: flex-start; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 11px; }
.eda-ok { background: #052e16; border: 1px solid #22c55e; }
.eda-bad { background: #2d0000; border: 1px solid #ef4444; }
.eda-warn { background: #1a1500; border: 1px solid #f59e0b; }
.eda-num { font-weight: 800; min-width: 20px; }
.eda-num-g { color: #86efac; }
.eda-num-r { color: #fca5a5; }
.eda-num-y { color: #fcd34d; }
.eda-code { background: #0d1117; border-radius: 6px; padding: 8px 12px; margin-top: 12px; font-size: 10px; color: #a78bfa; white-space: pre; overflow-x: auto; }
.eda-vs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
.eda-vs-col { background: #1e2233; border-radius: 8px; padding: 12px; }
.eda-vs-title { font-size: 11px; font-weight: 700; margin-bottom: 8px; }
.eda-vs-item { font-size: 10px; padding: 3px 0; }
</style>
<div class="eda-d3">
  <div class="eda-vs">
    <div class="eda-vs-col">
      <div class="eda-vs-title" style="color:#ef4444">Sem Outbox (problema)</div>
      <div class="eda-vs-item">1. BEGIN TRANSACTION</div>
      <div class="eda-vs-item">2. INSERT INTO orders ✅</div>
      <div class="eda-vs-item">3. COMMIT ✅</div>
      <div class="eda-vs-item" style="color:#ef4444">4. kafka.send() ❌ FALHA</div>
      <div class="eda-vs-item" style="color:#ef4444">→ Order criada, evento perdido</div>
      <div class="eda-vs-item" style="color:#ef4444">→ Outros serviços nunca souberam</div>
    </div>
    <div class="eda-vs-col">
      <div class="eda-vs-title" style="color:#22c55e">Com Outbox (solução)</div>
      <div class="eda-vs-item">1. BEGIN TRANSACTION</div>
      <div class="eda-vs-item">2. INSERT INTO orders ✅</div>
      <div class="eda-vs-item">3. INSERT INTO outbox ✅</div>
      <div class="eda-vs-item">4. COMMIT (ambos juntos) ✅</div>
      <div class="eda-vs-item" style="color:#22c55e">5. Relay lê outbox e publica</div>
      <div class="eda-vs-item" style="color:#22c55e">→ Consistência garantida</div>
    </div>
  </div>
  <div class="eda-code">-- Relay (Debezium CDC lê WAL ou polling)
SELECT * FROM outbox WHERE published = false ORDER BY created_at LIMIT 100;
-- Para cada row: kafka.send(event); UPDATE outbox SET published=true WHERE id=?</div>
</div>`,
    },
    {
      title: 'Event Sourcing — Estado via Replay de Eventos',
      caption: 'Banco é append-only log; estado atual calculado replaying todos os eventos',
      html: `
<style>
.eda-d4 { font-family: 'JetBrains Mono', monospace; background: #0f1117; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.eda-es-flow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px; }
.eda-es-ev { background: #1a0a2e; border: 1px solid #8b5cf6; border-radius: 6px; padding: 8px 10px; font-size: 10px; text-align: center; min-width: 90px; }
.eda-es-ev-t { color: #c4b5fd; font-weight: 700; font-size: 9px; }
.eda-es-ev-v { color: #f1f5f9; font-size: 11px; font-weight: 800; margin-top: 4px; }
.eda-es-arr { color: #475569; font-size: 18px; }
.eda-es-state { background: #052e16; border: 2px solid #22c55e; border-radius: 8px; padding: 12px 16px; text-align: center; }
.eda-es-state-v { color: #86efac; font-size: 20px; font-weight: 800; }
.eda-es-state-l { color: #64748b; font-size: 10px; margin-top: 4px; }
.eda-es-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.eda-es-block { background: #1e2233; border-radius: 8px; padding: 12px; font-size: 10px; }
.eda-es-bh { font-weight: 700; margin-bottom: 8px; }
.eda-es-item { padding: 3px 0; color: #94a3b8; }
.eda-es-item b { color: #e2e8f0; }
</style>
<div class="eda-d4">
  <div style="text-align:center; font-size:11px; color:#64748b; margin-bottom:12px;">Event Store (append-only) → replay → Estado Atual</div>
  <div class="eda-es-flow">
    <div class="eda-es-ev"><div class="eda-es-ev-t">AccountOpened</div><div class="eda-es-ev-v">R$ 0</div></div>
    <div class="eda-es-arr">+</div>
    <div class="eda-es-ev"><div class="eda-es-ev-t">MoneyDeposited</div><div class="eda-es-ev-v">+R$100</div></div>
    <div class="eda-es-arr">+</div>
    <div class="eda-es-ev"><div class="eda-es-ev-t">MoneyWithdrawn</div><div class="eda-es-ev-v">−R$30</div></div>
    <div class="eda-es-arr">+</div>
    <div class="eda-es-ev"><div class="eda-es-ev-t">MoneyDeposited</div><div class="eda-es-ev-v">+R$50</div></div>
    <div class="eda-es-arr">=</div>
    <div class="eda-es-state"><div class="eda-es-state-v">R$120</div><div class="eda-es-state-l">Saldo atual</div></div>
  </div>
  <div class="eda-es-grid">
    <div class="eda-es-block">
      <div class="eda-es-bh" style="color:#22c55e">Vantagens</div>
      <div class="eda-es-item"><b>Audit log perfeito</b> — imutável, todos os eventos preservados</div>
      <div class="eda-es-item"><b>Time travel</b> — recalcular estado em qualquer ponto do passado</div>
      <div class="eda-es-item"><b>Debug facilitado</b> — replay do evento exato que causou o bug</div>
      <div class="eda-es-item"><b>CQRS nativo</b> — projeções a partir dos eventos</div>
    </div>
    <div class="eda-es-block">
      <div class="eda-es-bh" style="color:#ef4444">Custos</div>
      <div class="eda-es-item"><b>Eventual consistency</b> nas projeções (read models)</div>
      <div class="eda-es-item"><b>Schema evolution</b> de eventos antigos é complexa</div>
      <div class="eda-es-item"><b>Snapshots</b> necessários para aggregates com histórico longo</div>
      <div class="eda-es-item"><b>Overengineering</b> para CRUD simples sem necessidade de histórico</div>
    </div>
  </div>
</div>`,
    },
  ],

  cheatsheet: {
    title: 'Event-Driven Architecture — Cheat Sheet',
    html: `
<style>
.eda-cs { font-family: 'JetBrains Mono', monospace; background: #0f1117; color: #e2e8f0; padding: 20px; border-radius: 12px; font-size: 11px; }
.eda-cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.eda-cs-section { background: #1e2233; border-radius: 8px; padding: 12px; }
.eda-cs-h { font-weight: 700; font-size: 12px; margin-bottom: 8px; color: #8b5cf6; border-bottom: 1px solid #2d3748; padding-bottom: 4px; }
.eda-cs-row { display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #2d3748; }
.eda-cs-key { color: #94a3b8; }
.eda-cs-val { color: #e2e8f0; font-weight: 600; }
.eda-cs-tag { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 10px; }
.eda-cs-tag-g { background: #052e16; color: #86efac; }
.eda-cs-tag-r { background: #2d0000; color: #fca5a5; }
.eda-cs-tag-y { background: #1a1500; color: #fcd34d; }
.eda-cs-tag-p { background: #1a0a2e; color: #c4b5fd; }
.eda-cs-code { background: #0d1117; padding: 6px 8px; border-radius: 4px; margin-top: 6px; font-size: 10px; color: #a78bfa; white-space: pre; overflow-x: auto; }
</style>
<div class="eda-cs">
  <div class="eda-cs-grid">
    <div class="eda-cs-section">
      <div class="eda-cs-h">Tipos de Mensagem</div>
      <div class="eda-cs-row"><span class="eda-cs-key">Evento</span><span><span class="eda-cs-tag eda-cs-tag-p">Aconteceu (passado)</span></span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">Comando</span><span><span class="eda-cs-tag eda-cs-tag-y">Faz isso (futuro)</span></span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">Query</span><span><span class="eda-cs-tag eda-cs-tag-g">Me diz (sem efeito)</span></span></div>
      <div class="eda-cs-h" style="margin-top:12px">Brokers</div>
      <div class="eda-cs-row"><span class="eda-cs-key">Kafka</span><span class="eda-cs-val">replay, alta vazão</span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">SQS</span><span class="eda-cs-val">managed, simples</span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">EventBridge</span><span class="eda-cs-val">routing AWS</span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">RabbitMQ</span><span class="eda-cs-val">AMQP, flexível</span></div>
    </div>
    <div class="eda-cs-section">
      <div class="eda-cs-h">Garantias de Entrega</div>
      <div class="eda-cs-row"><span class="eda-cs-key">at-most-once</span><span class="eda-cs-val">pode perder</span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">at-least-once</span><span class="eda-cs-val">pode duplicar</span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">exactly-once</span><span class="eda-cs-val">idempotência</span></div>
      <div class="eda-cs-h" style="margin-top:12px">Padrões Essenciais</div>
      <div class="eda-cs-row"><span class="eda-cs-key">Outbox</span><span class="eda-cs-val">atomic publish</span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">DLQ</span><span class="eda-cs-val">falha isolada</span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">Schema Registry</span><span class="eda-cs-val">contratos</span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">Saga</span><span class="eda-cs-val">transação distribuída</span></div>
    </div>
    <div class="eda-cs-section">
      <div class="eda-cs-h">Saga Patterns</div>
      <div class="eda-cs-row"><span class="eda-cs-key">Choreography</span><span class="eda-cs-val">implícito, desacoplado</span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">Orchestration</span><span class="eda-cs-val">explícito, debugável</span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">Compensação</span><span class="eda-cs-val">desfaz etapas</span></div>
      <div class="eda-cs-h" style="margin-top:12px">Observabilidade</div>
      <div class="eda-cs-row"><span class="eda-cs-key">Consumer lag</span><span class="eda-cs-val">alerta crítico</span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">DLQ depth</span><span class="eda-cs-val">alarme imediato</span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">Correlation ID</span><span class="eda-cs-val">tracing end-to-end</span></div>
    </div>
    <div class="eda-cs-section">
      <div class="eda-cs-h">Schema Evolution</div>
      <div class="eda-cs-row"><span class="eda-cs-key">Backward-compat</span><span><span class="eda-cs-tag eda-cs-tag-g">adicionar campo</span></span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">Breaking</span><span><span class="eda-cs-tag eda-cs-tag-r">renomear campo</span></span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">Formato</span><span class="eda-cs-val">Avro / Protobuf</span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">Registry</span><span class="eda-cs-val">Confluent SR</span></div>
      <div class="eda-cs-h" style="margin-top:12px">Kafka Ordering</div>
      <div class="eda-cs-row"><span class="eda-cs-key">Dentro partição</span><span><span class="eda-cs-tag eda-cs-tag-g">garantido</span></span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">Entre partições</span><span><span class="eda-cs-tag eda-cs-tag-r">não garantido</span></span></div>
      <div class="eda-cs-row"><span class="eda-cs-key">Chave partição</span><span class="eda-cs-val">customerId</span></div>
    </div>
  </div>
</div>`,
  },

  mindmap: {
    title: 'Event-Driven Architecture — Mind Map',
    html: `
<style>
.eda-mm { font-family: 'Space Grotesk', sans-serif; background: #0f1117; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.eda-mm-center { text-align: center; margin-bottom: 20px; }
.eda-mm-node { display: inline-block; background: #8b5cf6; color: #fff; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 14px; }
.eda-mm-branches { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.eda-mm-branch { background: #1e2233; border-radius: 8px; padding: 12px; border-top: 3px solid; }
.eda-mm-branch-title { font-size: 12px; font-weight: 700; margin-bottom: 8px; }
.eda-mm-item { font-size: 11px; color: #94a3b8; padding: 3px 0; padding-left: 8px; border-left: 2px solid; margin: 2px 0; }
</style>
<div class="eda-mm">
  <div class="eda-mm-center"><div class="eda-mm-node">Event-Driven Architecture</div></div>
  <div class="eda-mm-branches">
    <div class="eda-mm-branch" style="border-color:#8b5cf6">
      <div class="eda-mm-branch-title" style="color:#8b5cf6">Mensagens</div>
      <div class="eda-mm-item" style="border-color:#8b5cf6">Evento — fato, passado</div>
      <div class="eda-mm-item" style="border-color:#8b5cf6">Comando — intenção, futuro</div>
      <div class="eda-mm-item" style="border-color:#8b5cf6">Query — leitura, sem efeito</div>
      <div class="eda-mm-item" style="border-color:#8b5cf6">CQS: separar write/read</div>
    </div>
    <div class="eda-mm-branch" style="border-color:#22c55e">
      <div class="eda-mm-branch-title" style="color:#22c55e">Garantias</div>
      <div class="eda-mm-item" style="border-color:#22c55e">at-least-once (padrão)</div>
      <div class="eda-mm-item" style="border-color:#22c55e">idempotência obrigatória</div>
      <div class="eda-mm-item" style="border-color:#22c55e">outbox pattern (atomic)</div>
      <div class="eda-mm-item" style="border-color:#22c55e">DLQ para falhas</div>
    </div>
    <div class="eda-mm-branch" style="border-color:#f59e0b">
      <div class="eda-mm-branch-title" style="color:#f59e0b">Brokers</div>
      <div class="eda-mm-item" style="border-color:#f59e0b">Kafka — replay, streaming</div>
      <div class="eda-mm-item" style="border-color:#f59e0b">SQS — managed, simples</div>
      <div class="eda-mm-item" style="border-color:#f59e0b">EventBridge — routing AWS</div>
      <div class="eda-mm-item" style="border-color:#f59e0b">RabbitMQ — AMQP</div>
    </div>
    <div class="eda-mm-branch" style="border-color:#38bdf8">
      <div class="eda-mm-branch-title" style="color:#38bdf8">Saga</div>
      <div class="eda-mm-item" style="border-color:#38bdf8">Choreography — implícito</div>
      <div class="eda-mm-item" style="border-color:#38bdf8">Orchestration — explícito</div>
      <div class="eda-mm-item" style="border-color:#38bdf8">Step Functions / Temporal</div>
      <div class="eda-mm-item" style="border-color:#38bdf8">Compensação idempotente</div>
    </div>
    <div class="eda-mm-branch" style="border-color:#ef4444">
      <div class="eda-mm-branch-title" style="color:#ef4444">Event Sourcing</div>
      <div class="eda-mm-item" style="border-color:#ef4444">Append-only event store</div>
      <div class="eda-mm-item" style="border-color:#ef4444">Estado via replay</div>
      <div class="eda-mm-item" style="border-color:#ef4444">CQRS nativo</div>
      <div class="eda-mm-item" style="border-color:#ef4444">Snapshot para performance</div>
    </div>
    <div class="eda-mm-branch" style="border-color:#f472b6">
      <div class="eda-mm-branch-title" style="color:#f472b6">Observabilidade</div>
      <div class="eda-mm-item" style="border-color:#f472b6">Consumer lag — alerta</div>
      <div class="eda-mm-item" style="border-color:#f472b6">DLQ depth — alarme</div>
      <div class="eda-mm-item" style="border-color:#f472b6">Correlation ID + OTEL</div>
      <div class="eda-mm-item" style="border-color:#f472b6">Schema Registry (Avro)</div>
    </div>
  </div>
</div>`,
  },

  mnemonics: [
    {
      label: 'ECI — os três tipos de mensagem',
      trick: 'Eventos Contam o que já ocorreu, Comandos Indicam o que fazer',
      explanation: 'Evento = passado imutável (OrderPlaced), Comando = futuro dirigido (PlaceOrder), Query = sem efeito colateral (GetOrder). ECI em ordem: Evento → já foi, Comando → vai ser, Integração (Query) → só lê. Naming no passado = evento; naming no imperativo = comando.',
    },
    {
      label: 'OIDR — pipeline confiável',
      trick: 'Outbox Isola, Idempotência Desinfeta, Relay Republica',
      explanation: 'Outbox: grava evento atomicamente com o dado (sem outbox = evento pode ser perdido). Idempotência: consumer processa a mesma mensagem N vezes com o mesmo resultado (without = duplicate side-effects). Relay: processo separado publica da outbox para o broker com retry. OIDR = os três pilares de confiabilidade em EDA.',
    },
    {
      label: 'CLO — choreography vs orchestration',
      trick: 'Choreography é Livre e Opaco; Orchestration é Ordenado',
      explanation: 'Choreography: cada serviço reage livremente, sem coordenador, fluxo implícito e opaco. Orchestration: orquestrador controla a ordem, fluxo explícito e visível. CLO = Choreography Livre Opaco, Orchestration Ordenada. Escolha: saga curta → Choreography. Saga longa com compensação → Orchestration.',
    },
    {
      label: 'BAF — schema evolution segura',
      trick: 'Backward Adiciona, Forward Aceita desconhecido',
      explanation: 'Backward compatibility: consumidor novo lê evento antigo. Regra: pode remover campo opcional. Forward compatibility: consumidor antigo lê evento novo — ignora campos desconhecidos. Regra: pode adicionar campo opcional. BAF = Backward Adiciona (campo novo OK), Forward Aceita desconhecidos. Breaking = renomear ou remover campo obrigatório.',
    },
    {
      label: 'LCDE — observabilidade EDA',
      trick: 'Lag, Consumer, Dead, End-to-end',
      explanation: 'As quatro métricas essenciais: Lag (distância entre produtor e consumer — crescimento é alerta), Consumer error rate (taxa de falhas no processamento), Dead letter queue depth (alarme imediato — indica bug), End-to-end latency (tempo do evento até efeito no read model — mede eventual consistency para o usuário). LCDE = as métricas que um engenheiro sênior monitora primeiro.',
    },
  ],

  exercises: [
    {
      level: 'iniciante',
      title: 'Pub/Sub com SQS + DLQ e idempotência',
      description: 'Crie dois serviços Node.js. O primeiro publica mensagens de "OrderPlaced" com UUID no SQS a cada 2s. O segundo consome e processa, armazenando o eventId em memória. Simule uma duplicata enviando a mesma mensagem duas vezes e verifique que ela é processada apenas uma vez. Configure uma DLQ com maxReceiveCount=3 e envie uma mensagem inválida (sem campo obrigatório) — observe ela ser movida para a DLQ após 3 tentativas.',
      concepts: ['at-least-once', 'idempotência', 'DLQ', 'SQS', 'chave de idempotência'],
    },
    {
      level: 'iniciante',
      title: 'Evento vs Comando na prática — naming e semântica',
      description: 'Pegue um fluxo de negócio (e-commerce, banco, delivery) e identifique 5 eventos, 5 comandos e 3 queries. Para cada um: escreva o nome correto (evento no passado, comando no imperativo), defina o payload mínimo e identifique quem produz e quem consome. Exemplo ruim: "UserShouldBeNotified" (comando disfarçado). Exemplo bom: "UserRegistered" (evento). Explique por que o nome importa.',
      concepts: ['evento vs comando', 'CQS', 'naming', 'ubiquitous language', 'bounded context'],
    },
    {
      level: 'intermediario',
      title: 'Outbox Pattern com Postgres e Debezium CDC',
      description: 'Implemente o outbox pattern: crie tabela outbox no Postgres (id, event_type, payload, published, created_at). Na mesma transação de INSERT em orders, insira na outbox. Configure Debezium para ler o WAL do Postgres e publicar no Kafka. Valide que se o Kafka estiver down e subir depois, os eventos acumulados na outbox são todos publicados. Compare com a abordagem sem outbox (publicação direta) e demonstre a janela de inconsistência.',
      concepts: ['outbox pattern', 'Debezium', 'CDC', 'WAL', 'consistência transacional', 'Kafka'],
    },
    {
      level: 'intermediario',
      title: 'Saga com orchestration usando Step Functions',
      description: 'Implemente uma OrderSaga com 3 etapas: ProcessPayment, ReserveInventory, ShipOrder. Cada etapa é uma Lambda. Configure compensação: se ReserveInventory falha, execute RefundPayment e CancelOrder. Use waitForTaskToken em ShipOrder (simula gateway externo). Valide nos cenários: (1) fluxo feliz — saga completa com sucesso, (2) falha em ReserveInventory — compensação executa corretamente, (3) timeout em ShipOrder — saga cancela após N minutos.',
      concepts: ['saga', 'orchestration', 'Step Functions', 'compensação', 'waitForTaskToken', 'idempotência'],
    },
    {
      level: 'senior',
      title: 'Event Sourcing + CQRS + schema evolution',
      description: 'Construa um aggregate BankAccount com event sourcing: eventos AccountOpened, MoneyDeposited, MoneyWithdrawn, AccountClosed. Implemente replay para calcular saldo atual. Crie projeção read model para "saldo atual" e "extrato dos últimos 30 dias". Adicione snapshot após 100 eventos. Implemente schema evolution: v1 de MoneyDeposited tem "amount"; v2 adiciona "description" (backward-compatible). Escreva testes que validam que consumidores v1 leem eventos v2 sem quebrar.',
      concepts: ['event sourcing', 'CQRS', 'aggregate', 'snapshot', 'schema evolution', 'backward compatibility', 'projeção', 'read model'],
    },
    {
      level: 'senior',
      title: 'Consumer contract testing com Pact',
      description: 'Configure Pact entre um producer (Order Service) e dois consumers (Notification Service, Inventory Service). Consumer define o contrato do evento que espera receber. Producer verifica que seus eventos satisfazem os contratos. Simule um breaking change no producer (renomeia campo) e valide que o pipeline de CI detecta o contrato quebrado antes do deploy. Compare com a detecção tardia sem Pact (bug descoberto em staging).',
      concepts: ['consumer contract testing', 'Pact', 'schema evolution', 'CI/CD', 'breaking change detection', 'contrato de evento'],
    },
  ],

  codeExamples: [
    {
      title: 'Outbox Pattern + Idempotência em TypeScript (NestJS)',
      language: 'typescript',
      code: `import { Injectable, Logger } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import { OutboxEvent } from './entities/outbox-event.entity'
import { Order } from './entities/order.entity'
import { ProcessedEvent } from './entities/processed-event.entity'

// ── Publisher: outbox atômico ─────────────────────────────────────────────────

@Injectable()
export class OrderService {
  constructor(
    @InjectEntityManager() private readonly em: EntityManager
  ) {}

  async placeOrder(dto: CreateOrderDto): Promise<Order> {
    return this.em.transaction(async (tx) => {
      // 1. Salva o pedido
      const order = await tx.save(Order, {
        customerId: dto.customerId,
        total: dto.total,
        status: 'pending',
      })

      // 2. Na MESMA transação, grava o evento na outbox
      await tx.save(OutboxEvent, {
        eventId: crypto.randomUUID(),
        eventType: 'OrderPlaced',
        payload: JSON.stringify({
          orderId: order.id,
          customerId: order.customerId,
          total: order.total,
        }),
        published: false,
        createdAt: new Date(),
      })

      return order
      // Se o commit falhar, AMBOS os inserts são revertidos.
      // Se o Kafka estiver down, outbox garante que o evento não se perde.
    })
  }
}

// ── Consumer: idempotência com tabela de eventos processados ──────────────────

@Injectable()
export class OrderEventConsumer {
  private readonly logger = new Logger(OrderEventConsumer.name)

  constructor(
    @InjectEntityManager() private readonly em: EntityManager
  ) {}

  async handleOrderPlaced(msg: {
    eventId: string
    orderId: string
    customerId: string
  }): Promise<void> {
    // 1. Verifica se já processou este eventId
    const alreadyProcessed = await this.em.findOne(ProcessedEvent, {
      where: { eventId: msg.eventId },
    })

    if (alreadyProcessed) {
      this.logger.debug(\`Duplicate event \${msg.eventId} — ignoring\`)
      return // Idempotente: segunda entrega ignorada
    }

    await this.em.transaction(async (tx) => {
      // 2. Processa o evento (efeito colateral)
      await tx.update(Order, msg.orderId, { status: 'confirmed' })

      // 3. Marca como processado DENTRO da mesma transação
      await tx.save(ProcessedEvent, {
        eventId: msg.eventId,
        processedAt: new Date(),
      })
    })
  }
}`,
    },
    {
      title: 'Saga com Orchestration — Step Functions (TypeScript CDK)',
      language: 'typescript',
      code: `import * as sfn from 'aws-cdk-lib/aws-stepfunctions'
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks'

// ── OrderSaga: ProcessPayment → ReserveInventory → ShipOrder ─────────────────

const processPayment = new tasks.LambdaInvoke(this, 'ProcessPayment', {
  lambdaFunction: paymentLambda,
  resultPath: '$.paymentResult',
})

const refundPayment = new tasks.LambdaInvoke(this, 'RefundPayment', {
  lambdaFunction: refundLambda, // compensação idempotente
})

const cancelOrder = new tasks.LambdaInvoke(this, 'CancelOrder', {
  lambdaFunction: cancelLambda, // compensação idempotente
})

const reserveInventory = new tasks.LambdaInvoke(this, 'ReserveInventory', {
  lambdaFunction: inventoryLambda,
  resultPath: '$.inventoryResult',
})

// ShipOrder usa waitForTaskToken — aguarda callback do sistema de logística
const shipOrder = new tasks.LambdaInvoke(this, 'ShipOrder', {
  lambdaFunction: shippingLambda,
  integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  payload: sfn.TaskInput.fromObject({
    orderId: sfn.JsonPath.stringAt('$.orderId'),
    taskToken: sfn.JsonPath.taskToken, // callback token
  }),
  timeout: cdk.Duration.hours(24), // timeout se logística não responder
})

// Compensação: se reserva falha → estorna pagamento → cancela pedido
const compensationChain = refundPayment.next(cancelOrder)

// Fluxo completo com compensações
const orderSagaDefinition = processPayment
  .addCatch(cancelOrder, { errors: ['PaymentFailed'] })
  .next(
    reserveInventory
      .addCatch(compensationChain, { errors: ['InventoryUnavailable'] })
      .next(shipOrder)
  )

// Criação da state machine
new sfn.StateMachine(this, 'OrderSaga', {
  definition: orderSagaDefinition,
  timeout: cdk.Duration.days(7),
})`,
    },
    {
      title: 'Consumer Kafka com Tracing Distribuído (OTEL)',
      language: 'typescript',
      code: `import { Kafka, Consumer, EachMessagePayload } from 'kafkajs'
import {
  context,
  propagation,
  trace,
  SpanStatusCode,
  ROOT_CONTEXT,
} from '@opentelemetry/api'

const kafka = new Kafka({ clientId: 'order-consumer', brokers: ['kafka:9092'] })
const consumer: Consumer = kafka.consumer({ groupId: 'order-events-group' })
const tracer = trace.getTracer('order-consumer')

await consumer.connect()
await consumer.subscribe({ topic: 'orders.placed', fromBeginning: false })

await consumer.run({
  eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
    // ── 1. Extrai contexto de tracing dos headers Kafka ──────────────────────
    // Headers chegam como Buffer — converte para Record<string, string>
    const headers: Record<string, string> = {}
    for (const [key, val] of Object.entries(message.headers ?? {})) {
      if (val) headers[key] = val.toString()
    }

    // Extrai W3C TraceContext (traceparent / tracestate)
    const parentCtx = propagation.extract(ROOT_CONTEXT, headers)

    // ── 2. Inicia span filho do trace original ───────────────────────────────
    const span = tracer.startSpan(
      'kafka.consume orders.placed',
      {
        attributes: {
          'messaging.system': 'kafka',
          'messaging.destination': topic,
          'messaging.kafka.partition': partition,
          'messaging.kafka.offset': message.offset,
        },
      },
      parentCtx
    )

    await context.with(trace.setSpan(parentCtx, span), async () => {
      try {
        const payload = JSON.parse(message.value?.toString() ?? '{}')

        // ── 3. Idempotência: verifica eventId ───────────────────────────────
        const eventId = headers['x-event-id'] ?? payload.eventId
        if (!eventId) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: 'Missing eventId' })
          return // Mensagem malformada → DLQ após N retries
        }

        const seen = await idempotencyStore.has(eventId)
        if (seen) {
          span.addEvent('duplicate.ignored', { eventId })
          return
        }

        // ── 4. Processa ─────────────────────────────────────────────────────
        await processOrderPlaced(payload)
        await idempotencyStore.mark(eventId, { ttlSeconds: 86400 })

        span.setStatus({ code: SpanStatusCode.OK })
      } catch (err) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: String(err) })
        span.recordException(err as Error)
        throw err // kafkajs vai para DLQ após maxRetries
      } finally {
        span.end()
      }
    })
  },
})`,
    },
    {
      title: 'Event Sourcing — Aggregate com Replay',
      language: 'typescript',
      code: `// ── Types ─────────────────────────────────────────────────────────────────────
type DomainEvent =
  | { type: 'AccountOpened'; accountId: string; ownerId: string }
  | { type: 'MoneyDeposited'; accountId: string; amount: number; description?: string }
  | { type: 'MoneyWithdrawn'; accountId: string; amount: number }
  | { type: 'AccountClosed'; accountId: string; reason: string }

interface AccountState {
  id: string
  ownerId: string
  balance: number
  status: 'open' | 'closed'
}

// ── Aggregate: estado calculado via replay ─────────────────────────────────────
class BankAccountAggregate {
  private state: AccountState | null = null
  private uncommittedEvents: DomainEvent[] = []

  // Aplica evento ao estado (pure function)
  private apply(event: DomainEvent): void {
    switch (event.type) {
      case 'AccountOpened':
        this.state = { id: event.accountId, ownerId: event.ownerId, balance: 0, status: 'open' }
        break
      case 'MoneyDeposited':
        if (this.state) this.state.balance += event.amount
        break
      case 'MoneyWithdrawn':
        if (this.state) this.state.balance -= event.amount
        break
      case 'AccountClosed':
        if (this.state) this.state.status = 'closed'
        break
    }
  }

  // Reconstrói estado a partir do event store (replay)
  static fromEvents(events: DomainEvent[]): BankAccountAggregate {
    const agg = new BankAccountAggregate()
    for (const event of events) agg.apply(event)
    return agg
  }

  // Comando: depositar dinheiro
  deposit(amount: number, description?: string): void {
    if (!this.state || this.state.status !== 'open')
      throw new Error('Account not open')
    if (amount <= 0)
      throw new Error('Amount must be positive')

    const event: DomainEvent = {
      type: 'MoneyDeposited',
      accountId: this.state.id,
      amount,
      description,
    }
    this.apply(event)                    // atualiza estado local
    this.uncommittedEvents.push(event)   // pendente para salvar no store
  }

  getBalance(): number {
    return this.state?.balance ?? 0
  }

  pullUncommittedEvents(): DomainEvent[] {
    const events = [...this.uncommittedEvents]
    this.uncommittedEvents = []
    return events
  }
}

// ── Event Store (append-only) ─────────────────────────────────────────────────
class InMemoryEventStore {
  private store = new Map<string, DomainEvent[]>()

  async append(accountId: string, events: DomainEvent[]): Promise<void> {
    const existing = this.store.get(accountId) ?? []
    this.store.set(accountId, [...existing, ...events])
  }

  async load(accountId: string): Promise<DomainEvent[]> {
    return this.store.get(accountId) ?? []
  }
}

// ── Uso ───────────────────────────────────────────────────────────────────────
const store = new InMemoryEventStore()

// Carrega aggregate do event store
const events = await store.load('acc-001')
const account = BankAccountAggregate.fromEvents(events)

// Aplica comando
account.deposit(100, 'Salário')
account.deposit(50, 'Freelance')

// Persiste novos eventos
await store.append('acc-001', account.pullUncommittedEvents())

console.log(account.getBalance()) // 150`,
    },
  ],

  videos: [
    {
      title: 'Event-Driven Architecture — Full Course',
      channel: 'ByteByteGo',
      url: 'https://www.youtube.com/watch?v=rJHTK2TfZ1I',
      topic: 'Visão geral completa de EDA com animações e exemplos reais',
    },
    {
      title: 'The Many Meanings of Event-Driven Architecture',
      channel: 'GOTO Conferences',
      url: 'https://www.youtube.com/watch?v=STKCRSUsyP0',
      topic: 'Martin Fowler diferencia os três sabores de EDA',
    },
    {
      title: 'Event Sourcing You are doing it wrong by David Schmitz',
      channel: 'Devoxx',
      url: 'https://www.youtube.com/watch?v=GzrZworHpIk',
      topic: 'Erros comuns em event sourcing e como evitar',
    },
    {
      title: 'Saga Pattern — Managing Distributed Transactions',
      channel: 'InfoQ',
      url: 'https://www.youtube.com/watch?v=0UTOLRTwOX0',
      topic: 'Saga choreography vs orchestration com casos reais',
    },
    {
      title: 'Apache Kafka in 6 minutes',
      channel: 'ByteByteGo',
      url: 'https://www.youtube.com/watch?v=Ch5VhJzaoaI',
      topic: 'Como Kafka funciona por dentro — partições, offsets, consumer groups',
    },
    {
      title: 'Designing Event-Driven Systems — Ben Stopford',
      channel: 'Confluent',
      url: 'https://www.youtube.com/watch?v=Kwz_SJgvnQo',
      topic: 'Padrões avançados: event streaming, CQRS, schema evolution',
    },
  ],

  resources: [
    { title: 'Designing Event-Driven Systems — Ben Stopford (gratuito)', url: 'https://www.confluent.io/designing-event-driven-systems/', kind: 'livro' },
    { title: 'Martin Fowler — What do you mean by Event-Driven?', url: 'https://martinfowler.com/articles/201701-event-driven.html', kind: 'artigo' },
    { title: 'Enterprise Integration Patterns', url: 'https://www.enterpriseintegrationpatterns.com/', kind: 'docs' },
    { title: 'microservices.io — Saga Pattern', url: 'https://microservices.io/patterns/data/saga.html', kind: 'docs' },
    { title: 'microservices.io — Outbox Pattern', url: 'https://microservices.io/patterns/data/transactional-outbox.html', kind: 'docs' },
    { title: 'Confluent Schema Registry — Compatibility Types', url: 'https://docs.confluent.io/platform/current/schema-registry/avro.html', kind: 'docs' },
    { title: 'CloudEvents Spec (CNCF)', url: 'https://cloudevents.io/', kind: 'docs' },
    { title: 'Eventual Consistency Revisited — Werner Vogels (Amazon CTO)', url: 'https://www.allthingsdistributed.com/2008/12/eventually_consistent.html', kind: 'artigo' },
    { title: 'Kafka: The Definitive Guide (O\'Reilly — free PDF)', url: 'https://www.confluent.io/resources/kafka-the-definitive-guide-v2/', kind: 'livro' },
    { title: 'AWS — Building Event-Driven Architectures on AWS', url: 'https://aws.amazon.com/event-driven-architecture/', kind: 'docs' },
  ],

  diagram: 'event-driven',
}

export default eventDriven
