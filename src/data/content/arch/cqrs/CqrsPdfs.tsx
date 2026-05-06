'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion } from '@/components/pdfs/ComparativeRefPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta CQRS ───────────────────────────────────────────────────────────────
const C = '#1565C0'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre CQRS em entrevistas sênior',
    type: 'qa',
    pages: 9,
    description: 'Perguntas de nível pleno e sênior sobre CQRS, Event Sourcing, eventual consistency, projeções, Saga Pattern, Outbox e quando não usar CQRS. Com respostas estruturadas e dicas de apresentação.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'Cheatsheet CQRS',
    subtitle: 'Termos, fluxo, padrões e regras numa página',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência rápida: Command vs Query vs Event, Command Handler contract, Projector contract, regras do CQS, padrões associados (Saga, Outbox, Event Sourcing) e red flags de quando não usar.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'comparative',
    title: 'CQRS vs CRUD vs Event Sourcing',
    subtitle: 'Trade-offs reais — quando cada abordagem faz sentido',
    type: 'comparative',
    pages: 2,
    description: 'Tabela comparativa com 6 critérios: complexidade, escala de leitura, audit log, debugging, consistência e caso de uso. Com cenários recomendados para cada abordagem.',
    icon: '03',
    goal: 'Tomada de decisão',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns CQRS',
    subtitle: 'Os erros que eliminam candidatos sênior — e como evitar',
    type: 'antipatterns',
    pages: 3,
    description: 'Os 6 anti-patterns mais críticos: CQRS para CRUD simples, command retornando dados, query com efeito colateral, projeção síncrona, sem idempotência no projector e confundir CQRS com Event Sourcing.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map CQRS',
    subtitle: 'Ecossistema completo — do CQS ao Event Sourcing',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 8 categorias: Fundamentos CQS, Command Side, Query Side, Event Sourcing, Projeções, Padrões Associados, Quando Usar e Ferramentas. Checklist de 15 conceitos para auto-avaliação.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é CQRS e qual problema ele resolve?',
    a: '<p>CQRS (Command Query Responsibility Segregation) separa o modelo de escrita (Commands) do modelo de leitura (Queries) em partes distintas do sistema.</p><p><strong>Problema que resolve:</strong> quando os requisitos de leitura e escrita são fundamentalmente diferentes — write precisa de consistência ACID e modelo normalizado; read precisa de dados denormalizados, joins pré-computados e escalabilidade independente.</p><p><strong>Sem CQRS:</strong> um único modelo serve para ambos — comprometido entre consistência do write e performance do read.</p><p><strong>Com CQRS:</strong> write model focado em invariantes de negócio; read model otimizado por query com storage especializado (Redis, ElasticSearch, etc.).</p><p>Custo: complexidade operacional maior, eventual consistency no read side.</p>',
    tip: 'Comece pelo problema, não pela solução. Diga "CQRS faz sentido quando leitura e escrita têm requisitos que conflitam em um modelo único". O entrevistador quer saber que você sabe quando não usar.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Command, Query e Event no CQRS?',
    a: '<p><strong>Command:</strong> objeto imutável que representa uma intenção de mudança. Nome no imperativo: CreateOrder, PlacePayment. É despachado para um único handler. Retorna void (ou apenas ID). Pode falhar (ser rejeitado por regra de negócio).</p><p><strong>Query:</strong> objeto imutável que representa uma intenção de leitura. Nome interrogativo: GetOrdersByUser. É despachado para um único handler. Retorna dados. Sem efeito colateral — chamar N vezes = mesmo resultado.</p><p><strong>Event:</strong> fato imutável que já aconteceu. Nome no passado: OrderCreated, PaymentPlaced. É publicado para múltiplos subscribers. Representa o que aconteceu, não a intenção.</p><p>CQS (Bertrand Meyer): "Método ou muda estado OU retorna valor — nunca os dois." CQRS é a aplicação do CQS em nível arquitetural.</p>',
    tip: 'Mencione a diferença Command vs Event: Command é intenção (pode ser recusado), Event é fato (já aconteceu). É distinção frequente em entrevistas sênior.',
  },
  {
    level: 'Pleno',
    q: 'O que é um Projector e como ele constrói o Read Model?',
    a: '<p>Projector é um componente que consome eventos e atualiza o read model — ele "projeta" os eventos em uma representação otimizada para leitura.</p><p><strong>Funcionamento:</strong></p><ol><li>Event é publicado pelo Command Handler após persistir no write DB</li><li>Projector consome o evento de forma assíncrona (via Kafka, RabbitMQ ou Outbox)</li><li>Projector atualiza o read model — pode ser Redis (hash), ElasticSearch (doc), PostgreSQL (view materializada), ClickHouse (OLAP)</li></ol><p><strong>Propriedades obrigatórias:</strong></p><ul><li>Idempotente: o mesmo evento processado N vezes deve ter o mesmo resultado que 1 vez (at-least-once delivery)</li><li>Reconstruível: dado o histórico de eventos, o read model pode ser reconstruído do zero</li><li>Sem efeito colateral em outros sistemas: só atualiza o read model, não dispara novos eventos</li></ul>',
    tip: 'Mencione idempotência como propriedade crítica — "at-least-once delivery significa que o projector vai processar o mesmo evento mais de uma vez em falhas. Sem idempotência, o read model fica inconsistente."',
  },
  {
    level: 'Senior',
    q: 'Como lidar com eventual consistency no CQRS? Quais são as estratégias de UX?',
    a: '<p>Eventual consistency no CQRS significa que após um Command, há uma janela de tempo (ms a s) em que o Read Model ainda não reflete o write. Isso cria problemas de UX se não tratado.</p><p><strong>Estratégias técnicas:</strong></p><ul><li><strong>Versão/ETag:</strong> command retorna a versão esperada. Query Handler aguarda até o read model atingir essa versão.</li><li><strong>Read-your-own-writes:</strong> após command, redireciona leitura para o write DB por um período curto (ex: 2s).</li><li><strong>Polling:</strong> client faz poll até o estado esperado aparecer no read model.</li></ul><p><strong>Estratégias de UX:</strong></p><ul><li><strong>Optimistic update:</strong> UI atualiza imediatamente assumindo sucesso. Reverte se command falhar.</li><li><strong>Skeleton/Loading state:</strong> mostra estado "em processamento" até leitura confirmar.</li><li><strong>WebSocket/SSE:</strong> servidor notifica client quando read model é atualizado.</li></ul>',
    tip: 'O entrevistador quer saber que você pensa no usuário final, não só na arquitetura. Diga "eventual consistency não é invisível para o usuário — você precisa de estratégia de UX para mascarar o lag".',
  },
  {
    level: 'Senior',
    q: 'O que é Event Sourcing e como se relaciona com CQRS?',
    a: '<p><strong>Event Sourcing:</strong> em vez de persistir o estado atual do Aggregate, persiste a sequência de eventos que o levou ao estado atual. Estado atual = apply(all events).</p><p><strong>Benefícios:</strong></p><ul><li>Audit log gratuito — todo estado passado pode ser reconstituído</li><li>Temporal queries: "qual era o estado do pedido às 14h de ontem?"</li><li>Replay: reconstruir read models do zero com novos projectors</li><li>Debug: ver exatamente o que aconteceu e em que ordem</li></ul><p><strong>Relação com CQRS:</strong> são complementares mas independentes.</p><ul><li>CQRS sem Event Sourcing: write DB normal (Postgres) + read model separado</li><li>Event Sourcing sem CQRS: possível mas raro — normalmente combinados</li><li>CQRS + Event Sourcing: Event Store é o write side; eventos alimentam read models via projectors</li></ul><p><strong>Custo:</strong> complexidade operacional, snapshot necessário para aggregates com muitos eventos, schema evolution de eventos.</p>',
    tip: 'O erro clássico é tratar CQRS e Event Sourcing como sinônimos. Explique que CQRS é separação de modelos; Event Sourcing é estratégia de persistência. Um pode existir sem o outro.',
  },
  {
    level: 'Senior',
    q: 'O que é o Saga Pattern e quando usar em conjunto com CQRS?',
    a: '<p>Saga é um padrão para gerenciar transações distribuídas sem 2PC. Uma saga é uma sequência de transações locais, cada uma publicando um evento ou mensagem que aciona a próxima. Em caso de falha, executa transações de compensação.</p><p><strong>Dois sabores:</strong></p><ul><li><strong>Choreography:</strong> cada serviço reage a eventos e publica os próprios. Sem coordenador central. Simples, mas difícil de rastrear o fluxo completo.</li><li><strong>Orchestration:</strong> um orquestrador central comanda os steps. Fluxo explícito e rastreável. Ponto central de falha.</li></ul><p><strong>Com CQRS:</strong> Command Handler inicia uma saga publicando o primeiro evento. Saga managers reagem a eventos e emitem novos commands. Compensação via CompensatingCommand.</p><p><strong>Exemplo:</strong> PlaceOrderSaga: ReserveInventory → ProcessPayment → ShipOrder. Se PaymentFailed → CancelInventoryReservation (compensação).</p>',
    tip: 'Mencione que Saga garante eventual consistency entre serviços — não consistência forte. "Se tolerância zero a inconsistência é requisito, você precisa de 2PC, não Saga."',
  },
  {
    level: 'Senior',
    q: 'Como implementar idempotência em Command Handlers e Projectors?',
    a: '<p>Em sistemas distribuídos, mensagens podem ser entregues mais de uma vez (at-least-once). Sem idempotência, re-processamento causa duplicatas ou inconsistências.</p><p><strong>Command Handler:</strong></p><ul><li>Idempotency key no header HTTP: header <code>Idempotency-Key: uuid</code></li><li>Server verifica se a chave já foi processada (Redis SETNX com TTL)</li><li>Se já processado: retorna o resultado cacheado sem executar</li><li>Se novo: processa e salva resultado com a chave</li></ul><p><strong>Projector:</strong></p><ul><li>Rastrear eventId + aggregateVersion já processados</li><li>Antes de upsert: verificar se esse eventId já foi aplicado</li><li>Usar UPSERT (INSERT ON CONFLICT) em vez de INSERT cru</li><li>Para Redis: SETNX ou conditional SET com versão</li></ul><p><strong>Kafka:</strong> enable.idempotence=true no producer + exactly-once semantics com transactions.</p>',
    tip: 'Apresente implementação concreta: "No Projector, guardo o eventId em uma tabela processed_events. Antes de aplicar, faço INSERT IF NOT EXISTS. Se já existe, pulo silenciosamente." Isso demonstra experiência real.',
  },
  {
    level: 'Senior',
    q: 'O que é o Outbox Pattern e por que é necessário em CQRS?',
    a: '<p>O Outbox Pattern resolve o problema de atomicidade entre persistir no write DB e publicar o evento: as duas operações precisam ocorrer, mas são em sistemas diferentes.</p><p><strong>Problema:</strong> se o handler salva no DB e depois tenta publicar no Kafka, o processo pode cair entre os dois — DB atualizado, evento nunca publicado. Ou inversamente.</p><p><strong>Solução Outbox:</strong></p><ol><li>Na mesma transação do write DB, salva o dado E insere o evento na tabela <code>outbox_events</code></li><li>Um worker (ou CDC via Debezium) lê a outbox periodicamente e publica no broker</li><li>Após confirmação de publicação, marca o evento como publicado na outbox</li></ol><p>Garante at-least-once delivery. Projectors devem ser idempotentes para lidar com duplicatas.</p><p><strong>CDC (Debezium):</strong> monitora o WAL (Write-Ahead Log) do Postgres e captura mudanças na tabela outbox, publicando automaticamente no Kafka. Sem polling.</p>',
    tip: 'Mencione que a alternativa ingênua (salvar + publicar) tem um bug de janela de falha. O Outbox transforma o problema em uma única transação ACID, depois propaga de forma confiável.',
  },
  {
    level: 'Pleno',
    q: 'Quando você NÃO deveria usar CQRS?',
    a: '<p>CQRS resolve problemas específicos e não é arquitetura padrão. Não usar quando:</p><ul><li><strong>CRUD simples:</strong> se create/update/delete e as leituras têm o mesmo modelo, CQRS só adiciona indireção sem benefício.</li><li><strong>Time pequeno/startup:</strong> o custo de manutenção de dois modelos, dois bancos, projectors e eventual consistency é alto. MVP deve ser simples.</li><li><strong>Requisito de consistência forte:</strong> se toda operação precisa ser lida imediatamente após o write sem delay, eventual consistency é impedimento.</li><li><strong>Escala moderada:</strong> se read replica + cache resolvem o problema de leitura, CQRS é over-engineering.</li><li><strong>Domínio simples:</strong> poucos aggregates sem invariantes complexas — não há valor em segregar.</li></ul><p>Regra: sinta a dor antes de aplicar CQRS. Se o código sem CQRS funciona e escala adequadamente, CQRS é custo sem benefício.</p>',
    tip: 'Esta pergunta é armadilha — o entrevistador quer saber que você não aplica CQRS em tudo. Responda com exemplos concretos de quando recusaria. "Em 80% dos projetos, CRUD bem feito é a resposta correta."',
  },
  {
    level: 'Senior',
    q: 'Como você reconstruiria um Read Model a partir do zero em produção?',
    a: '<p>Reconstrução do read model é necessária quando: projector tem bug e gerou dados incorretos, nova view é adicionada que precisa de histórico, ou storage do read model é perdido.</p><p><strong>Processo com Event Store / Kafka:</strong></p><ol><li>Criar novo consumer group (sem afetar o consumer group ativo)</li><li>Resetar offset para o início da partição Kafka (ou início do Event Store)</li><li>Rodar novo projector em modo "rebuild" — consome todos os eventos históricos</li><li>Enquanto rebuild roda, novo projector também consome eventos novos (catch-up)</li><li>Após atingir o presente, direcionar tráfego de leitura para o novo read model</li><li>Deletar read model antigo</li></ol><p><strong>Sem Event Store (CQRS simples):</strong> snapshot do write DB + replay de eventos recentes. Mais complexo.</p><p><strong>Snapshot pattern:</strong> para aggregates com muitos eventos, persiste estado em checkpoints para evitar replay completo de toda a história.</p>',
    tip: 'Detalhe que o rebuild acontece sem downtime — novo consumer group é paralelo ao existente. Isso é vantagem crítica de Event Sourcing que CQRS simples não tem automaticamente.',
  },
  {
    level: 'Senior',
    q: 'Como versionar eventos em Event Sourcing? Quais são as estratégias?',
    a: '<p>Eventos são imutáveis e armazenados para sempre — mas o schema evolui. Sem estratégia de versionamento, replay de eventos antigos quebra projectors novos.</p><p><strong>Estratégias:</strong></p><ul><li><strong>Upcasters:</strong> função que transforma evento v1 em v2 antes de chegar no projector. Transparente para o projector — ele sempre recebe a versão mais atual. Composable: v1→v2→v3.</li><li><strong>Weak Schema:</strong> usar schema flexível (JSON) e tratar campos ausentes como default. Resiliente a adição de campos, frágil a remoção ou renomeação.</li><li><strong>Copy-on-Write:</strong> ao adicionar campo obrigatório, cria novo tipo de evento (OrderCreatedV2) e mantém handler para o antigo. Mais código, mais claro.</li><li><strong>Event versioning no nome:</strong> OrderCreated_v1, OrderCreated_v2 — simples mas verboso.</li></ul><p>Nunca deletar ou renomear campos em eventos já persistidos — é dado histórico imutável.</p>',
    tip: 'Upcasters são a solução mais elegante — mencione que frameworks como Axon Framework (Java) têm suporte nativo. Para Node.js, é pattern manual mas bem conhecido.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Command Bus e Event Bus em CQRS?',
    a: '<p><strong>Command Bus:</strong> roteador que direciona um Command para seu único Handler. 1 Command → 1 Handler. Síncrono — o caller aguarda o handler. Pode retornar erro de validação. Exemplo: MediatR (.NET), @nestjs/cqrs CommandBus.</p><p><strong>Event Bus:</strong> pub/sub que distribui um evento para múltiplos subscribers (Projectors, Saga Managers). 1 Event → N subscribers. Geralmente assíncrono — via Kafka, RabbitMQ ou em-processo. Erro em um subscriber não afeta os outros.</p><p><strong>Por que dois buses separados:</strong></p><ul><li>Command = intenção (vai para 1 lugar), Event = fato (vai para todos interessados)</li><li>Command bus pode ser síncrono (request/response); Event bus deve ser assíncrono (fire-and-forget)</li><li>Command bus tem tratamento de erro de negócio; Event bus tem retry e DLQ</li></ul>',
    tip: 'Mencione o padrão Mediator (Martin Fowler) — Command Bus é uma implementação de Mediator. Event Bus é pub/sub. A diferença de intenção (1:1 vs 1:N) é o que define qual usar.',
  },
  {
    level: 'Senior',
    q: 'Como implementar CQRS com NestJS na prática?',
    a: '<p>NestJS tem o módulo <code>@nestjs/cqrs</code> que implementa Command Bus, Query Bus e Event Bus nativamente.</p><p><strong>Setup básico:</strong></p><pre>npm install @nestjs/cqrs</pre><p><strong>Estrutura:</strong></p><ul><li>Commands: <code>CreateOrderCommand</code> implementa <code>ICommand</code></li><li>Handlers: <code>@CommandHandler(CreateOrderCommand)</code> implementa <code>ICommandHandler</code></li><li>Queries: <code>GetOrdersQuery</code> implementa <code>IQuery</code></li><li>Query Handlers: <code>@QueryHandler(GetOrdersQuery)</code></li><li>Events: <code>OrderCreatedEvent</code> implementa <code>IEvent</code></li><li>Event Handlers (Projectors): <code>@EventsHandler(OrderCreatedEvent)</code></li></ul><p>Controller injeta <code>CommandBus</code> e <code>QueryBus</code>. CommandHandler usa <code>EventBus</code> para publicar eventos após persistir.</p><p>Para Event Sourcing: integrar com EventStoreDB ou Kafka. Para read model distribuído: projetores separados consumindo via Kafka.</p>',
    tip: 'Se o entrevistador usa NestJS, este é um diferencial concreto. Mencione que o EventBus nativo do NestJS é em-processo — para produção com múltiplas instâncias, precisa de Kafka/RabbitMQ externo.',
  },
  {
    level: 'Senior',
    q: 'Como migrar de CRUD para CQRS incrementalmente sem big bang?',
    a: '<p>Migração big bang é risco alto — semanas sem deploy, rollback impossível. A estratégia incremental:</p><p><strong>Fase 1 — Separar handlers (sem novo storage):</strong> extrair commands e queries como objetos, criar handlers, manter o mesmo banco. Zero mudança de infra.</p><p><strong>Fase 2 — Adicionar read model para 1 query:</strong> identificar a query mais cara (maior N+1, maior JOIN). Criar projector para ela + read model em Redis. Validar que o read model é correto comparando com write DB.</p><p><strong>Fase 3 — Gradual migration:</strong> migrar queries restantes uma por uma, validando cada projeção antes de cortar o tráfego para ela.</p><p><strong>Fase 4 — Event Bus:</strong> após projetores estáveis, desacoplar via Kafka em vez de chamada síncrona.</p><p>Feature flags controlam quando cada leitura vai para o read model. Rollback é simples — voltar o flag.</p>',
    tip: 'Estratégia incremental demonstra maturidade de engenharia. Diga "big bang de CQRS é o anti-padrão que mais vejo causar falha de adoção — sempre incremental, sempre com validação paralela".',
  },
  {
    level: 'Pleno',
    q: 'O que é o princípio CQS (Command Query Separation) de Bertrand Meyer?',
    a: '<p>CQS (Command Query Separation) é o princípio original definido por Bertrand Meyer no livro "Object-Oriented Software Construction" (1988).</p><p><strong>Princípio:</strong> um método de objeto deve ser:</p><ul><li><strong>Command:</strong> muda estado do objeto, retorna void</li><li><strong>Query:</strong> retorna valor, não muda estado (sem efeito colateral)</li><li>Um método nunca deve ser as duas coisas</li></ul><p><strong>Exceções aceitáveis:</strong> stack.pop() (muda estado E retorna valor) é uma violação pragmática comum.</p><p><strong>CQRS vs CQS:</strong> CQS é o princípio em nível de método; CQRS é a aplicação do mesmo princípio em nível arquitetural, separando em serviços ou modelos distintos.</p><p>Entender a origem ajuda a explicar o "porquê" — não é moda, é princípio com 35 anos de maturidade.</p>',
    tip: 'Mostrar que você conhece a origem do CQS (Meyer, 1988) e distingue CQS de CQRS demonstra profundidade. É detalhe que diferencia candidato que leu sobre o assunto de quem apenas implementou.',
  },
  {
    level: 'Senior',
    q: 'Como garantir que o Projector não processe o mesmo evento duas vezes?',
    a: '<p>At-least-once delivery (padrão no Kafka e maioria dos brokers) significa que o mesmo evento pode chegar mais de uma vez. Sem proteção, o read model acumula duplicatas.</p><p><strong>Estratégias:</strong></p><ul><li><strong>Tabela de eventos processados:</strong> <code>processed_events(event_id, processed_at)</code>. Antes de processar: INSERT IF NOT EXISTS. Se inserção falha (duplicata) → pula. Limpar registros antigos com job de purga.</li><li><strong>UPSERT no read model:</strong> em vez de INSERT, fazer INSERT ON CONFLICT DO UPDATE. Para o mesmo event_id, o resultado é idempotente.</li><li><strong>Versão no Aggregate:</strong> rastrear version do aggregate no read model. Processar apenas eventos com version maior que a atual.</li><li><strong>Kafka exactly-once:</strong> enable.idempotence=true + transações Kafka garantem exactly-once end-to-end (mais complexo de configurar).</li></ul>',
    tip: 'Apresente o UPSERT como solução mais simples para PostgreSQL: "Em vez de pensar em deduplicação, projeto o projector para ser idempotente por natureza — UPSERT nunca cria duplicata, independente de quantas vezes chega."',
  },
  {
    level: 'Pleno',
    q: 'O que é um Aggregate no contexto de CQRS e DDD?',
    a: '<p>Aggregate é um cluster de objetos de domínio tratado como uma unidade transacional. Tem uma raiz (Aggregate Root) que é o único ponto de entrada. Protege as invariantes (regras de negócio) do grupo.</p><p><strong>No CQRS:</strong> Command Handler carrega o Aggregate do repositório, chama um método de domínio (que valida a regra de negócio) e persiste as mudanças. O Aggregate emite Domain Events ao mudar estado.</p><p><strong>Exemplo Order Aggregate:</strong></p><ul><li>Aggregate Root: Order (controla o acesso a OrderItem, Shipping, Payment)</li><li>Método: order.place() — valida que itens existem, que pagamento foi aprovado, altera status</li><li>Invariante: não posso ter Order com 0 itens; status deve seguir máquina de estados válida</li><li>Domain Event emitido: OrderPlacedEvent</li></ul><p>Regra prática: se precisa de consistência transacional entre objetos → mesmo Aggregate. Se é OK ter eventual consistency → dois Aggregates separados.</p>',
    tip: 'Mencione o tamanho do Aggregate como decisão crítica: Aggregates grandes = muita contenção e transações lentas. Regra de Vaughn Vernon: "Design small Aggregates" — na dúvida, dois aggregates com eventual consistency é melhor.',
  },
  {
    level: 'Senior',
    q: 'Como você monitoraria e debugaria um sistema CQRS em produção?',
    a: '<p>CQRS distribui a lógica entre write side e read side, aumentando a superfície para bugs difíceis de rastrear.</p><p><strong>Observabilidade necessária:</strong></p><ul><li><strong>Correlation ID:</strong> mesmo ID em Command → Event → Projector. Rastrear toda a cadeia em logs.</li><li><strong>Métricas de lag:</strong> tempo entre escrita no write DB e atualização no read model. Alert se lag &gt; threshold (ex: 5s).</li><li><strong>DLQ monitoring:</strong> eventos que falharam no projector vão para DLQ. Alert imediato — DLQ crescendo = bug no projector.</li><li><strong>Read model vs Write DB diff:</strong> job periódico que compara contagens e checksums entre modelos. Detecta inconsistência acumulada.</li><li><strong>Projector lag (Kafka):</strong> consumer lag por partition. Alert se lag cresce — projector não está acompanhando o throughput.</li></ul><p>Ferramenta: Kafka consumer group lag no CloudWatch/Datadog. Correlation ID em OpenTelemetry para trace completo.</p>',
    tip: 'O lag do read model é a métrica mais importante e mais negligenciada em CQRS. Se sobe durante pico de tráfego, usuários veem dados defasados. Mencione "eu configuro alert de lag antes de ir para produção".',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre Choreography e Orchestration em Saga?',
    a: '<p>Ambos gerenciam workflows distribuídos com compensação, mas com abordagens opostas de controle.</p><p><strong>Choreography (coreografia):</strong> cada serviço reage a eventos e publica os próprios. Sem coordenador central. O fluxo emerge da soma das reações.</p><ul><li>Pro: sem SPOF de coordenador, serviços completamente desacoplados</li><li>Con: difícil rastrear o fluxo completo ("event spaghetti"), difícil de debugar quando algo falha no meio</li></ul><p><strong>Orchestration (orquestração):</strong> um Saga Manager central conhece todos os steps e comanda cada serviço via Command.</p><ul><li>Pro: fluxo explícito e rastreável em um lugar, mais fácil de debugar, pode ter state machine visual</li><li>Con: Saga Manager é ponto central (mas não SPOF se for idempotente), maior acoplamento</li></ul><p><strong>Na prática:</strong> Orchestration para workflows complexos com 5+ steps e compensação elaborada. Choreography para fluxos simples 2-3 steps.</p>',
    tip: 'Use o exemplo do pedido: PlaceOrderSaga orquestrada (Manager explícito) é mais fácil de testar e debugar do que coreografia onde o fluxo está espalhado em 5 serviços diferentes. Para entrevistas, orchestration é mais fácil de explicar e demonstra domínio.',
  },
  {
    level: 'Senior',
    q: 'Como o Snapshot Pattern resolve o problema de replay lento em Event Sourcing?',
    a: '<p>Em Event Sourcing, o estado atual do Aggregate é calculado fazendo replay de todos os eventos desde o início. Para um Aggregate com 10.000 eventos, isso é lento e custoso toda vez que é carregado.</p><p><strong>Snapshot Pattern:</strong></p><ol><li>Periodicamente (a cada N eventos ou tempo T), serializa o estado atual do Aggregate e persiste como snapshot</li><li>Ao carregar o Aggregate, busca o snapshot mais recente</li><li>Faz replay apenas dos eventos após o snapshot (delta)</li><li>Resultado: em vez de replay de 10.000 eventos, replay de apenas os últimos 50</li></ol><p><strong>Implementação:</strong> tabela <code>snapshots(aggregate_id, version, data, created_at)</code>. Ao carregar: SELECT último snapshot → replay eventos com version &gt; snapshot.version.</p><p><strong>Trade-off:</strong> mais complexidade de código + espaço de armazenamento do snapshot. Usar quando replay &gt; 100-500ms.</p>',
    tip: 'Mencione que snapshot não substitui os eventos — eles continuam existindo para audit e reconstrução. Snapshot é apenas otimização de leitura. O Event Store continua append-only.',
  },
]

// ── Dados: Mind Map ───────────────────────────────────────────────────────────

const MINDMAP_CATS: MindmapCategory[] = [
  {
    label: 'Fundamentos CQS',
    color: '#1565C0',
    items: [
      { t: 'CQS de Bertrand Meyer (1988): método muda estado OU retorna valor', k: true },
      { t: 'CQRS = CQS em nível arquitetural (não apenas método)', k: true },
      { t: 'Command = intenção de mudança (imperativo, retorna void)', k: true },
      { t: 'Query = intenção de leitura (sem efeito colateral, retorna dados)', k: true },
      { t: 'Event = fato imutável que já aconteceu (passado)' },
    ],
  },
  {
    label: 'Command Side (Write)',
    color: '#1565C0',
    items: [
      { t: 'Command Bus → 1 handler por command', k: true },
      { t: 'Command Handler: valida, carrega Aggregate, aplica regras, persiste', k: true },
      { t: 'Aggregate: comportamento rico + emissão de Domain Events', k: true },
      { t: 'Write DB: normalizado, ACID, invariantes protegidas', k: true },
      { t: 'Event publicado APÓS persistência (Outbox para atomicidade)', a: true },
    ],
  },
  {
    label: 'Query Side (Read)',
    color: '#0e4d99',
    items: [
      { t: 'Query Bus → 1 handler por query', k: true },
      { t: 'Query Handler: lê read model, sem lógica de negócio', k: true },
      { t: 'Read Model: denormalizado, otimizado por caso de uso', k: true },
      { t: 'Storage por uso: Redis (lista), Elastic (busca), ClickHouse (OLAP)', a: true },
      { t: 'Eventual consistency: lag de ms a s após write', k: true },
    ],
  },
  {
    label: 'Event Sourcing',
    color: '#0e4d99',
    items: [
      { t: 'Estado = apply(all_events) — Event Store é fonte da verdade', a: true },
      { t: 'Append-only: nunca deleta ou atualiza eventos', a: true },
      { t: 'Temporal queries: estado de um Aggregate em qualquer ponto do tempo', a: true },
      { t: 'Snapshot Pattern: checkpoint periódico para replay eficiente', a: true },
      { t: 'Schema evolution: Upcasters transformam eventos antigos', a: true },
    ],
  },
  {
    label: 'Projeções',
    color: '#0369A1',
    items: [
      { t: 'Projector: consome evento e atualiza read model', k: true },
      { t: 'Idempotente: at-least-once delivery → UPSERT, não INSERT', k: true },
      { t: 'Reconstruível: rebuild completo do zero via replay', a: true },
      { t: 'Múltiplos projectors por evento (fan-out de read models)', a: true },
      { t: 'Lag monitoring: tempo entre write e read model atualizado', k: true },
    ],
  },
  {
    label: 'Padrões Associados',
    color: '#0369A1',
    items: [
      { t: 'Outbox Pattern: evento + dado na mesma TX do write DB', a: true },
      { t: 'Saga: transação distribuída com compensação (sem 2PC)', a: true },
      { t: 'Saga Orchestration vs Choreography: coordenador vs reação a eventos', a: true },
      { t: 'Correlation ID: rastrear command → event → projector', k: true },
      { t: 'DLQ: eventos que falharam no projector para análise', k: true },
    ],
  },
  {
    label: 'Quando Usar',
    color: '#075985',
    items: [
      { t: 'USE: read 10x mais pesado que write + modelos divergentes', k: true },
      { t: 'USE: read models com storage diferente por use case', k: true },
      { t: 'USE + Event Sourcing: audit trail crítico, temporal queries', a: true },
      { t: 'NAO USE: CRUD simples, startup, consistência forte obrigatória', k: true },
      { t: 'Migre incrementalmente — nunca big bang', k: true },
    ],
  },
  {
    label: 'Ferramentas',
    color: '#075985',
    items: [
      { t: '@nestjs/cqrs — CommandBus, QueryBus, EventBus nativos' },
      { t: 'MediatR (.NET) — Mediator pattern, handlers por request' },
      { t: 'EventStoreDB — banco dedicado para Event Sourcing' },
      { t: 'Debezium — CDC para capturar eventos do WAL do Postgres' },
      { t: 'Axon Framework (Java) — CQRS + Event Sourcing full-stack' },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Sei distinguir Command, Query e Event com precisão',
  'Entendo o princípio CQS de Bertrand Meyer (1988)',
  'Sei implementar um Command Handler que retorna void',
  'Sei implementar um Projector idempotente com UPSERT',
  'Entendo eventual consistency e estratégias de UX para mascarar',
  'Sei quando NÃO usar CQRS (CRUD simples, escala moderada)',
  'Entendo a diferença entre CQRS e Event Sourcing',
  'Sei o que é Saga e diferença entre Orchestration e Choreography',
  'Entendo o Outbox Pattern e por que é necessário',
  'Sei como reconstruir um Read Model do zero via replay',
  'Entendo Snapshot Pattern para Event Sourcing com muitos eventos',
  'Sei monitorar lag do read model em produção',
  'Conheço implementação em NestJS (@nestjs/cqrs)',
  'Sei migrar de CRUD para CQRS incrementalmente',
  'Consigo explicar Correlation ID para rastrear command → event → projector',
]

// ── Dados: Comparative ────────────────────────────────────────────────────────

const COMP_OPTIONS: CompOption[] = [
  { name: 'CRUD Simples',          color: '#64748b' },
  { name: 'CQRS',                  color: C },
  { name: 'CQRS + Event Sourcing', color: '#f59e0b' },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Complexidade de implementação',
    values: {
      'CRUD Simples':          'Controller → Service → Repository. Simples.',
      'CQRS':                  'Bus, handlers, projectors, dois bancos.',
      'CQRS + Event Sourcing': 'Event Store, replay, snapshot, upcasters.',
    },
    winner: 'CRUD Simples',
  },
  {
    criterion: 'Escala de leitura',
    values: {
      'CRUD Simples':          'Read replica com mesmo schema.',
      'CQRS':                  'Read model dedicado (Redis, Elastic, etc.).',
      'CQRS + Event Sourcing': 'Múltiplos read models independentes.',
    },
    winner: 'CQRS',
  },
  {
    criterion: 'Audit log / Histórico',
    values: {
      'CRUD Simples':          'Sem histórico — dado sobrescrito.',
      'CQRS':                  'Eventos publicados, mas não persistidos como source of truth.',
      'CQRS + Event Sourcing': 'Event Store É o histórico completo.',
    },
    winner: 'CQRS + Event Sourcing',
  },
  {
    criterion: 'Facilidade de debug',
    values: {
      'CRUD Simples':          'Um banco, estado direto. Simples.',
      'CQRS':                  'Dois bancos + correlation ID para rastrear.',
      'CQRS + Event Sourcing': 'Replay de eventos pode ser longo e não-óbvio.',
    },
    winner: 'CRUD Simples',
  },
  {
    criterion: 'Consistência de leitura',
    values: {
      'CRUD Simples':          'Forte — mesma transação ACID.',
      'CQRS':                  'Eventual — lag de ms a s no read model.',
      'CQRS + Event Sourcing': 'Eventual — mesma limitação do CQRS.',
    },
    winner: 'CRUD Simples',
  },
  {
    criterion: 'Melhor caso de uso',
    values: {
      'CRUD Simples':          '80% dos apps — startups, MVPs, domínios simples.',
      'CQRS':                  'Read muito pesado, read models muito divergentes.',
      'CQRS + Event Sourcing': 'Audit crítico, time-travel, business events como first-class.',
    },
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const CQRS_PDF_ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'CQRS para sistema CRUD simples (over-engineering)',
    badDesc: 'Aplicar CQRS em app com 50 usuários e domínio sem complexidade de leitura.',
    badCode: [
      { t: '// App de gestão de tarefas, 50 usuários', c: '#64748b' },
      { t: 'class CreateTaskCommandHandler { handle(cmd) {} }', c: '#ef4444' },
      { t: 'class TaskCreatedProjector { on(event) {} }', c: '#ef4444' },
      { t: 'class GetTasksQueryHandler { handle(q) {} }', c: '#ef4444' },
      { t: '// 5× mais código, mesma funcionalidade', c: '#ef4444' },
    ],
    goodDesc: 'CRUD direto é adequado quando escala e modelos não divergem.',
    goodCode: [
      { t: '// CRUD direto — adequado para escala e complexidade', c: '#64748b' },
      { t: 'class TaskController {', c: '#22c55e' },
      { t: '  async create(dto: CreateTaskDto) {', c: '#22c55e' },
      { t: '    return this.taskService.create(dto)', c: '#22c55e' },
      { t: '  }', c: '#22c55e' },
      { t: '}  // Simples, testável, sem overhead', c: '#22c55e' },
    ],
    why: 'CQRS resolve problema de escala e modelos divergentes. CRUD sem esse problema = CQRS é custo sem benefício.',
  },
  {
    title: 'Command retornando dados de negócio',
    badDesc: 'Command handler retornando o recurso criado — viola o princípio CQS.',
    badCode: [
      { t: '// ❌ Command viola CQS — retorna o recurso criado', c: '#64748b' },
      { t: 'class CreateOrderHandler {', c: '#ef4444' },
      { t: '  async handle(cmd): Promise<Order> {  // ❌ retorna Order!', c: '#ef4444' },
      { t: '    const order = await this.repo.save(cmd)', c: '#64748b' },
      { t: '    return order  // viola CQRS', c: '#ef4444' },
      { t: '  }', c: '#ef4444' },
      { t: '}', c: '#ef4444' },
    ],
    goodDesc: 'Command retorna void. Leitura feita via Query separada após o event.',
    goodCode: [
      { t: '// ✅ Command retorna void — leitura via Query separada', c: '#64748b' },
      { t: 'class CreateOrderHandler {', c: '#22c55e' },
      { t: '  async handle(cmd): Promise<void> {  // void', c: '#22c55e' },
      { t: '    await this.repo.save(order)', c: '#64748b' },
      { t: '    await this.eventBus.publish(new OrderCreatedEvent(order))', c: '#22c55e' },
      { t: '  }', c: '#22c55e' },
      { t: '}', c: '#22c55e' },
    ],
    why: 'Command misturado com Query viola o princípio CQS. Client usa GetOrderQuery para ler o resultado.',
  },
  {
    title: 'Query Handler com efeito colateral (write)',
    badDesc: 'Query handler escrevendo no DB — viola idempotência e o princípio CQS.',
    badCode: [
      { t: '// ❌ Query Handler muta estado — viola CQS', c: '#64748b' },
      { t: 'class GetUserHandler {', c: '#ef4444' },
      { t: '  async handle(q: GetUserQuery) {', c: '#ef4444' },
      { t: '    const user = await this.rdb.find(q.id)', c: '#64748b' },
      { t: '    user.lastSeenAt = new Date()  // ❌ WRITE em Query!', c: '#ef4444' },
      { t: '    await this.wdb.save(user)  // muta write DB', c: '#ef4444' },
      { t: '    return user', c: '#64748b' },
      { t: '  }', c: '#ef4444' },
      { t: '}', c: '#ef4444' },
    ],
    goodDesc: 'Query apenas lê. Side effects são disparados via evento assíncrono.',
    goodCode: [
      { t: '// ✅ Query apenas lê — side effect via evento assíncrono', c: '#64748b' },
      { t: 'class GetUserHandler {', c: '#22c55e' },
      { t: '  async handle(q: GetUserQuery) {', c: '#22c55e' },
      { t: '    return this.rdb.find(q.id) // só leitura', c: '#22c55e' },
      { t: '  }', c: '#22c55e' },
      { t: '}', c: '#22c55e' },
      { t: '// lastSeenAt atualizado via UserViewedEvent (assíncrono)', c: '#64748b' },
    ],
    why: 'Query com write viola o contrato de idempotência. Leitura N vezes deve ser igual a 1 vez.',
  },
  {
    title: 'Projeção síncrona bloqueando o Command Handler',
    badDesc: 'Handler aguardando projeção antes de retornar — anula o desacoplamento.',
    badCode: [
      { t: '// ❌ Handler espera projeção antes de retornar', c: '#64748b' },
      { t: 'async handle(cmd: CreateOrderCommand) {', c: '#ef4444' },
      { t: '  await this.writeRepo.save(order)', c: '#64748b' },
      { t: '  await this.projector.project(order)  // SINCRONO ❌', c: '#ef4444' },
      { t: '  await this.searchIndex.index(order)  // SINCRONO ❌', c: '#ef4444' },
      { t: '  return response  // latência: save + project + index', c: '#ef4444' },
      { t: '}', c: '#ef4444' },
    ],
    goodDesc: 'Handler persiste e publica evento. Projectors consomem assincronamente.',
    goodCode: [
      { t: '// ✅ Handler persiste + publica evento e retorna', c: '#64748b' },
      { t: 'async handle(cmd: CreateOrderCommand) {', c: '#22c55e' },
      { t: '  await this.writeRepo.save(order)', c: '#64748b' },
      { t: '  await this.eventBus.publish(new OrderCreatedEvent(order))', c: '#22c55e' },
      { t: '  return { orderId: order.id }  // resposta imediata', c: '#22c55e' },
      { t: '}', c: '#22c55e' },
      { t: '// Projectors consomem assincronamente no background', c: '#64748b' },
    ],
    why: 'Projeção síncrona anula o benefício de desacoplamento e aumenta a latência do Command.',
  },
  {
    title: 'Projector sem idempotência',
    badDesc: 'Projector com INSERT simples — duplicatas em retry com at-least-once delivery.',
    badCode: [
      { t: '// ❌ Projector com INSERT simples', c: '#64748b' },
      { t: 'class OrderListProjector {', c: '#ef4444' },
      { t: '  async on(event: OrderCreatedEvent) {', c: '#ef4444' },
      { t: '    await redis.lpush(`orders:${event.userId}`, event.orderId)', c: '#ef4444' },
      { t: '    // at-least-once → mesmo orderId inserido 2× em retry', c: '#ef4444' },
      { t: '  }', c: '#ef4444' },
      { t: '}', c: '#ef4444' },
    ],
    goodDesc: 'Projector idempotente com UPSERT/HSET — mesmo evento N vezes = mesmo resultado.',
    goodCode: [
      { t: '// ✅ Projector idempotente com UPSERT/SET', c: '#64748b' },
      { t: 'class OrderListProjector {', c: '#22c55e' },
      { t: '  async on(event: OrderCreatedEvent) {', c: '#22c55e' },
      { t: '    // HSET é idempotente — mesma chave = sobrescreve', c: '#22c55e' },
      { t: '    await redis.hset(`order:${event.orderId}`, { status: "pending" })', c: '#22c55e' },
      { t: '    // reprocessar o mesmo evento = mesmo resultado', c: '#22c55e' },
      { t: '  }', c: '#22c55e' },
      { t: '}', c: '#22c55e' },
    ],
    why: 'At-least-once delivery é padrão em brokers. Projector não-idempotente cria duplicatas no read model.',
  },
  {
    title: 'Confundir CQRS com Event Sourcing como sinônimos',
    badDesc: 'Tratar CQRS e Event Sourcing como o mesmo padrão é red flag em entrevista sênior.',
    badCode: [
      { t: '// ❌ Confusão comum em entrevistas:', c: '#64748b' },
      { t: '"CQRS usa Event Store para persistir"', c: '#ef4444' },
      { t: '"Event Sourcing é obrigatório no CQRS"', c: '#ef4444' },
      { t: '"CQRS = Event Sourcing + read model"', c: '#ef4444' },
      { t: '// Tecnicamente incorreto — são padrões independentes', c: '#ef4444' },
    ],
    goodDesc: 'São complementares mas independentes — cada um pode existir sem o outro.',
    goodCode: [
      { t: '// ✅ São complementares mas independentes', c: '#22c55e' },
      { t: 'CQRS = segregar read model de write model', c: '#22c55e' },
      { t: 'Event Sourcing = persistir eventos em vez de estado', c: '#22c55e' },
      { t: '', c: '#64748b' },
      { t: '// CQRS sem Event Sourcing → Postgres write + Redis read', c: '#22c55e' },
      { t: '// Event Sourcing sem CQRS → possível mas raro', c: '#22c55e' },
      { t: '// CQRS + ES → mais poderoso, mais complexo', c: '#22c55e' },
    ],
    why: 'Confundir os dois é red flag em entrevista sênior. CQRS é sobre separação de modelos; Event Sourcing é sobre estratégia de persistência.',
  },
]

// ── Cheatsheet hooks ──────────────────────────────────────────────────────────

const CQRS_CS_HOOKS = [
  { name: 'Command',         sig: 'objeto imutável, nome imperativo',         desc: 'Intenção de mudança de estado. Retorna void — nunca dados de negócio.' },
  { name: 'Command Handler', sig: 'handle(cmd): Promise<void>',               desc: '1 handler por command: valida, carrega Aggregate, persiste, publica evento.' },
  { name: 'Query',           sig: 'objeto imutável, nome interrogativo',       desc: 'Intenção de leitura, sem efeito colateral. Idempotente por definição.' },
  { name: 'Query Handler',   sig: 'handle(q): Promise<T>',                    desc: '1 handler por query: lê read model apenas. Nunca escreve no DB.' },
  { name: 'Domain Event',    sig: 'nome no passado: OrderCreated',             desc: 'Fato imutável publicado após command handler persistir. Não é intenção.' },
  { name: 'Projector',       sig: 'on(event: XEvent): Promise<void>',         desc: 'Consome evento e atualiza read model. Idempotente: UPSERT, não INSERT.' },
  { name: 'Command Bus',     sig: 'dispatch(cmd) → 1 handler',                desc: 'Roteamento 1:1 de commands. Para eventos 1:N usar Event Bus.' },
  { name: 'Event Bus',       sig: 'publish(event) → N subscribers',           desc: 'Fan-out para múltiplos projectors e saga managers. Assíncrono.' },
  { name: 'Saga Manager',    sig: 'coordena steps com compensação',            desc: 'Transação distribuída com rollback parcial. Orchestration ou Choreography.' },
  { name: 'Outbox Table',    sig: 'events salvos na mesma TX do DB',          desc: 'Garante atomicidade entre persistir dado e publicar evento. CDC via Debezium.' },
]

const CQRS_CS_PATTERNS = [
  { name: 'CQS (Meyer)',          code: 'cmd(): void | query(): T',                    desc: 'Método OU muda estado OU retorna valor — nunca os dois' },
  { name: 'Mediator',             code: 'bus.dispatch(new CreateCmd(data))',           desc: 'Command Bus roteia para handler correto sem acoplamento direto' },
  { name: 'Event Sourcing',       code: 'state = events.reduce(apply, initial)',       desc: 'Estado = replay(events). Event Store é fonte da verdade' },
  { name: 'Outbox Pattern',       code: 'BEGIN TX; save(data); insert(outbox); COMMIT', desc: 'Evento + dado na mesma TX. Worker publica no broker depois' },
  { name: 'Saga Orchestration',   code: 'saga.start() → step1 → step2 | compensate', desc: 'Manager central comanda steps com compensação explícita' },
  { name: 'Saga Choreography',    code: 'svc1 emits E1 → svc2 reacts → emits E2',    desc: 'Cada serviço reage a eventos — sem coordenador central' },
  { name: 'Snapshot',             code: 'load(lastSnapshot) + replay(deltaEvents)',   desc: 'Checkpoint periódico do Aggregate para evitar replay longo' },
  { name: 'Upcaster',             code: 'upcast(v1Event): v2Event',                   desc: 'Transforma evento v1 → v2 transparentemente para projectors' },
]

const CQRS_CS_RULES = [
  { ok: true,  t: 'Command retorna void (ou apenas ID) — nunca dados de negócio' },
  { ok: true,  t: 'Query não tem efeito colateral — idempotente, N chamadas = 1 chamada' },
  { ok: true,  t: 'Projector é idempotente — UPSERT, não INSERT (at-least-once delivery)' },
  { ok: true,  t: 'Projeção é assíncrona — handler não aguarda projector para retornar' },
  { ok: false, t: 'CQRS ≠ Event Sourcing — são padrões independentes e complementares' },
  { ok: true,  t: 'Use CQRS quando read e write têm modelos fundamentalmente diferentes' },
  { ok: false, t: 'Não use CQRS em CRUD simples — custo de complexidade sem benefício' },
  { ok: true,  t: 'Correlation ID propaga do Command ao Event ao Projector — rastreabilidade' },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'CQRS',
    stackLabel: 'Command Query Responsibility Segregation',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'CQRS',
    accentColor: C,
    stackLabel: 'Command Query Responsibility Segregation',
    sections: {
      hooks: CQRS_CS_HOOKS,
      depRows: [],
      rules: CQRS_CS_RULES,
      performanceTips: [
        'Read Model com Redis: O(1) de leitura vs JOIN pesado no write DB',
        'Projector assíncrono: latência do command não inclui tempo de projeção',
        'Fan-out de read models: 1 evento → N projectors em paralelo',
        'UPSERT é idempotente: seguro para at-least-once delivery',
        'Snapshot: carrega Aggregate em O(1) em vez de replay de N eventos',
        'Consumer group lag < 1s: SLA do read model atualizado rapidamente',
        'Correlation ID: trace completo sem O(N) de busca em logs',
        'Rebuild do zero: Kafka offset reset → novo consumer group sem downtime',
      ],
      patterns: CQRS_CS_PATTERNS,
      mentalModels: [
        'Write model = proteção de invariantes. Read model = otimização de query.',
        'Command = intenção (pode falhar). Event = fato (já aconteceu).',
        'Projector é pure function: event → side effect no read model.',
        'CQRS sem eventual consistency não existe — é o trade-off fundamental.',
        'Migrate incrementally: 1 query por vez, validar antes de cortar tráfego.',
        'CQRS é custo operacional — justifique com benefício mensurável de leitura.',
      ],
    },
  }),
  comparative: () => buildComparativeRefPdf({
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    skillName: 'CQRS',
    accentColor: C,
    stackLabel: 'CQRS vs CRUD vs Event Sourcing',
    scenarios: [
      { scenario: 'App simples / MVP', recommendation: 'CRUD Simples', reason: 'Complexidade não justificada — CRUD atende com 1/5 do código' },
      { scenario: 'Read 10× mais pesado, modelos divergentes', recommendation: 'CQRS', reason: 'Read model dedicado (Redis/Elastic) escala independente do write' },
      { scenario: 'Audit trail crítico (fintech, healthcare)', recommendation: 'CQRS + Event Sourcing', reason: 'Event Store é o audit log — estado em qualquer ponto do tempo' },
      { scenario: 'Dashboard analytics + listas + busca', recommendation: 'CQRS', reason: 'Múltiplos read models otimizados: ClickHouse + Redis + ElasticSearch' },
      { scenario: 'Compliance regulatório (GDPR, PCI-DSS)', recommendation: 'CQRS + Event Sourcing', reason: 'Histórico imutável e rastreabilidade completa de todas as mudanças' },
    ],
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: CQRS_PDF_ANTIPATTERNS,
    accentColor: C,
    skillName: 'CQRS',
    stackLabel: 'Command Query Responsibility Segregation',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATS,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'CQRS',
    stackLabel: 'Command Query Responsibility Segregation',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function CqrsPdfs() {
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
