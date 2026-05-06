'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildPatternsPdf } from '@/components/pdfs/PatternsPdf'
import type { DesignPattern } from '@/components/pdfs/PatternsPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion } from '@/components/pdfs/ComparativeRefPdf'

// ── Paleta DDD ────────────────────────────────────────────────────────────────
const C = '#E91E63'   // rosa — domínio/negócio

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas de DDD mais cobradas em entrevista sênior',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: Entity vs VO, Aggregate Root, Bounded Context, Domain Events, Repository vs DAO, quando não usar DDD, Event Storming, invariantes entre aggregates, Ubiquitous Language e mais. Nível pleno e sênior com respostas ricas e dicas de entrevista.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'patterns',
    title: 'Building Blocks',
    subtitle: 'Catálogo completo dos padrões táticos e estratégicos',
    type: 'patterns',
    pages: 4,
    description: 'Entity, Value Object, Aggregate Root, Domain Service, Application Service, Repository, Factory, Domain Events — intent, quando usar, quando evitar, e exemplos de código TypeScript para cada building block.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos DDD',
    subtitle: 'Truques para fixar os conceitos abstratos',
    type: 'mnemonics',
    pages: 2,
    description: 'BCU para Strategic DDD, EVARDS para building blocks táticos, SMALL ROOT ONE para regras de Aggregate, ID OU VALOR para Entity vs VO. Âncoras cognitivas que grudam no dia da entrevista.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns DDD',
    subtitle: 'O que destrói um projeto com DDD',
    type: 'antipatterns',
    pages: 3,
    description: 'Modelo anêmico, Aggregate gordo, lógica de negócio no Application Service, Repository com 40 métodos, Domain Events sem Outbox. Código errado × correto para cada anti-pattern.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'comparative',
    title: 'DDD vs alternativas',
    subtitle: 'DDD × Transaction Script × CRUD × Active Record',
    type: 'comparative',
    pages: 2,
    description: 'Tabela comparativa com critérios de escolha: complexidade de domínio, testabilidade, custo de manutenção, curva de aprendizado. Para defender a escolha em entrevista com clareza.',
    icon: '05',
    goal: 'Decisão técnica',
  },
]

// ── Q&A Review ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Entity e Value Object?',
    a: '<strong>Entity</strong> tem identidade única que persiste mesmo com campos mutados. User#123 continua sendo o mesmo usuário mesmo trocando nome e email. Igualdade por ID. Rastreável ao longo do tempo.<br><br><strong>Value Object</strong> não tem ID — é definido pelos seus valores. <code>Money(100, BRL)</code> é igual a qualquer outro <code>Money(100, BRL)</code>. Imutável — operações retornam novo VO. Centraliza validação no construtor (CPF inválido falha cedo) e encapsula comportamento (<code>Money.add()</code>, <code>Money.convert()</code>).<br><br>Pergunta de decisão rápida: "preciso rastrear ao longo do tempo com identidade?" SIM → Entity. NÃO → VO.',
    tip: 'Dê exemplo de VO com comportamento real (Money.add, Money.convert) — mostra que VO não é só "struct readonly".',
  },
  {
    level: 'Pleno',
    q: 'O que é Aggregate Root e por que é a única porta de entrada?',
    a: '<p>Aggregate Root é a entidade principal de um cluster transacional. É a única porta de entrada porque:</p><ul><li><strong>Garante invariantes:</strong> "Order não confirma sem itens" só é verificável se Root controla o acesso a items.</li><li><strong>Uma transação por aggregate:</strong> Root coordena o que entra e sai atomicamente.</li><li><strong>Ciclo de vida encapsulado:</strong> entidades filhas não existem sem o Root.</li></ul><p>Anti-pattern: expor <code>order.items.push(item)</code> diretamente quebra o encapsulamento. Correto: <code>order.addItem(sku, qty, price)</code> — root valida a invariante.</p>',
    tip: 'Enfatize "invariante" — é o ponto central. Se não há invariante, talvez não precise de aggregate.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar Domain Events?',
    a: '<p>Domain Events quando:</p><ul><li>Algo importante aconteceu que outros bounded contexts precisam saber — <code>OrderConfirmed</code> dispara Inventory, Payments, Notifications sem acoplamento direto.</li><li>Desacoplar reação da ação — <code>Order.confirm()</code> não precisa saber de email service.</li><li>Event Sourcing como write side.</li><li>Saga para fluxo distribuído.</li></ul><p>Nome sempre no passado (<code>OrderConfirmed</code>, <code>PaymentApproved</code>). Publicar na mesma transação via <strong>Transactional Outbox</strong> — nunca após o save sem garantia.</p>',
    tip: 'Cite Transactional Outbox Pattern — diferencial que mostra maturidade além da teoria.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Domain Service e Application Service?',
    a: '<p><strong>Domain Service</strong>: contém regra de negócio que cruza aggregates, sem I/O. <code>PricingService.calculate(customer, product)</code> — regra depende dos dois. Testável unitariamente sem banco.</p><p><strong>Application Service</strong>: orquestra — busca aggregates via repo, chama domain/aggregate, salva, publica eventos. Não contém IF de negócio.</p><p>Sinal de alarme: Application Service com <code>if(order.status === "confirmed" && payment.amount &gt; 1000)</code> — regra de negócio no lugar errado. Domain Service recebe os objetos como parâmetro; Application Service é quem os busca no repositório.</p>',
    tip: 'Teste prático: consegue testar sem banco? Domain Service sim. Application Service não.',
  },
  {
    level: 'Pleno',
    q: 'O que é Ubiquitous Language e como garantir no código?',
    a: '<p>Vocabulário único entre devs, PO e especialistas de domínio, refletido <strong>literalmente no código</strong>. Se negócio fala "shipment" e código tem "delivery", o tradutor humano vira bug.</p><p>Como garantir:</p><ul><li>Event Storming extrai vocabulário diretamente dos especialistas.</li><li>Glossário vivo no repositório — atualizado a cada PR.</li><li>Code review foca em nomenclatura — <code>delivery</code> quando deveria ser <code>shipment</code> é rejeitado.</li><li>Testes que leem como especificação de negócio.</li></ul><p>Sinal de sucesso: especialista de negócio lê um teste e reconhece o processo.</p>',
    tip: 'O sinal de sucesso da Ubiquitous Language: especialista de negócio lê o teste e reconhece o processo sem precisar de tradução.',
  },
  {
    level: 'Pleno',
    q: 'O que é Bounded Context?',
    a: '<p>Fronteira lógica onde um modelo coeso faz sentido. <code>Customer</code> em Sales tem limite de crédito e histórico de compra. <code>Customer</code> em Support tem tickets e SLA. Mesmo nome, modelos completamente diferentes — e está correto.</p><p>Tentar unificar num único <code>Customer</code> gera um modelo monstruoso que serve mal a todos os contextos. <strong>Context Map</strong> descreve como os bounded contexts se relacionam:</p><ul><li><strong>ACL</strong>: camada de tradução que isola seu domínio do externo.</li><li><strong>Customer-Supplier</strong>: upstream define API, downstream consome.</li><li><strong>Conformist</strong>: downstream aceita modelo upstream sem adaptar.</li><li><strong>Shared Kernel</strong>: modelo compartilhado — coordenação constante.</li></ul>',
    tip: 'O mesmo termo com significados diferentes em contextos diferentes não é inconsistência — é Bounded Context correto. Mencionar o exemplo Customer em Sales vs Support é eficaz.',
  },
  {
    level: 'Senior',
    q: 'Como você identifica bounded contexts num sistema novo?',
    a: '<p><strong>Event Storming</strong> (Alberto Brandolini): técnica colaborativa onde devs e especialistas de negócio mapeiam o domínio com post-its:</p><ol><li>Laranja = Domain Events na ordem temporal.</li><li>Azul = Commands que causaram os eventos.</li><li>Amarelo = Aggregates que processaram os commands.</li><li>Identificar onde a linguagem muda — fronteira de contexto.</li></ol><p>Heurísticas: onde o vocabulário muda; o que muda junto fica junto; cada time deveria ter um ou poucos contextos.</p><p>Erro clássico: criar contexto por entidade (UserService, OrderService) sem analisar coesão de modelo — gera distributed monolith onde todo request cruza 5 serviços.</p>',
    tip: 'Citar Event Storming e Brandolini é sinal de maturidade em DDD sênior.',
  },
  {
    level: 'Senior',
    q: 'Como DDD e Clean Architecture se complementam?',
    a: '<p>São perfeitamente complementares e costumam ser usados juntos:</p><ul><li><strong>DDD</strong> responde "o que construir" — bounded contexts, aggregates, domain events, ubiquitous language.</li><li><strong>Clean Architecture</strong> responde "como organizar" — camadas, Dependency Rule, ports e adapters.</li></ul><p>Mapeamento: DDD Entities/VOs/Aggregates → Clean Entities (centro); DDD Application Services → Clean Use Cases; DDD Repository interface → Clean Port; DDD Infrastructure → Clean Adapters. Bounded Context vira pasta/módulo.</p><p>Juntos: vocabulário de negócio com isolamento de dependência — código que especialista reconhece E testável sem framework.</p>',
    tip: 'Fazer o mapeamento explícito (DDD Aggregate → Clean Entity, DDD App Service → Clean Use Case) demonstra que você aplicou os dois juntos e não só leu sobre eles.',
  },
  {
    level: 'Senior',
    q: 'O que é Anti-Corruption Layer e quando usar?',
    a: '<p>ACL é camada de tradução entre seu bounded context e um sistema externo que você não controla. Se o ERP tem <code>PEDIDO_VENDA</code> com <code>COD_CLI</code>, seu domínio nunca vê esses termos. ACL converte para <code>Order</code>, <code>customerId</code> — vocabulário do seu domínio.</p><p>Quando usar: integração com legado, API de terceiro que muda, bounded context upstream incompatível, migração gradual. Se externo muda <code>COD_CLI</code> para <code>CODIGO_CLIENTE</code>, só o ACL quebra — domínio intacto.</p><p>Quando não usar: externo tem modelo limpo e Conformist é suficiente. ACL tem custo — só vale quando o externo é realmente incompatível.</p>',
    tip: 'O exemplo ERP com campos ALLCAPS é concreto e familiar. Mencionar que ACL tem custo e quando Conformist é suficiente diferencia resposta sênior de resposta decorada.',
  },
  {
    level: 'Senior',
    q: 'Como lidar com invariantes que cruzam aggregates?',
    a: '<p>Regra de ouro: apenas um aggregate por transação. Três estratégias:</p><ol><li><strong>Redefinir o limite:</strong> se invariante exige ver dois objetos juntos, talvez sejam o mesmo aggregate.</li><li><strong>Eventual consistency via Domain Events:</strong> Order confirmado (tx 1), <code>OrderConfirmed</code> event dispara Inventory que reserva estoque (tx 2). Negócio aceita inconsistência temporária.</li><li><strong>Saga:</strong> sequência de transações locais coordenadas por eventos, com compensating transactions em falha.</li></ol><p>O que não fazer: transação que salva dois aggregates ao mesmo tempo — cria acoplamento físico e mostra fronteira errada.</p>',
    tip: 'Diferençar as três estratégias e citar Eventual Consistency diferencia sênior de júnior.',
  },
  {
    level: 'Senior',
    q: 'Como implementar Domain Events com garantia de entrega?',
    a: '<p>Problema: publicar evento diretamente após <code>save()</code> tem race condition — salva, falha antes de publicar, estado inconsistente.</p><p><strong>Transactional Outbox Pattern:</strong> na mesma transação do aggregate, salva estado + escreve evento em tabela <code>outbox_events</code>. Worker ou CDC (Debezium) lê da outbox e publica no broker. At-least-once garantido.</p><pre><code>await prisma.$transaction(async (tx) =&gt; {\n  await tx.order.update({ ... })\n  await tx.outboxEvent.create({ data: { type: "OrderConfirmed", payload: "..." } })\n})</code></pre><p>Handlers devem ser idempotentes — mesmo evento chega 2x sem problema.</p>',
    tip: 'Transactional Outbox + idempotência é o diferencial sênior. Qualquer dev publica evento depois do save — sênior sabe por que isso é race condition e como resolver.',
  },
  {
    level: 'Senior',
    q: 'Qual a relação entre Bounded Context e microservices?',
    a: '<p>Bounded context é <strong>lógico</strong> — fronteira de modelo. Microservice é <strong>físico</strong> — fronteira de deploy. Não há relação 1:1 obrigatória.</p><p>Erro clássico: criar microservice por entidade (UserService, OrderService, ItemService) sem analisar bounded contexts — gera distributed monolith onde todo request cruza 5 serviços.</p><p>Abordagem recomendada: começa com monolito modular com bounded contexts bem separados; extrai para microservice quando escala independente, deploy independente ou time autônomo justificam. A fronteira física deve seguir a fronteira lógica já validada pelo Event Storming.</p>',
    tip: 'Mostrar que contexto ≠ microservice diferencia sênior de júnior.',
  },
  {
    level: 'Senior',
    q: 'Como você testa lógica de domínio em DDD?',
    a: '<p>O ganho central de DDD tático: lógica de negócio em Entities, VOs e Aggregates sem dependência de infraestrutura. Teste é trivial:</p><pre><code>const order = Order.create("customer-1")\norder.addItem("sku-123", 2, Money.of(50, "BRL"))\norder.confirm()\nexpect(order.status).toBe("confirmed")\nexpect(order.total.amount).toBe(100)</code></pre><p>Sem banco, sem mock, sem framework. Testes unitários de domínio rodam em &lt;1ms cada.</p><p>Sinal de alarme: precisou de mock de infraestrutura para testar regra de negócio — a regra vazou de camada.</p>',
    tip: 'Mostrar código de teste de aggregate sem mock de infra é a prova de que você entende o benefício central do DDD tático.',
  },
  {
    level: 'Pleno',
    q: 'Quando NÃO usar DDD?',
    a: '<p>CRUD sem regra de negócio rica — DDD vira cerimônia cara sem benefício. Controller → Service → ORM resolve com muito menos código.</p><p>Outros casos:</p><ul><li>Time sem acesso a especialista de domínio — sem conversa com negócio, você inventa domínio em vez de modelar.</li><li>Produto pré-PMF com pivots semanais — modelo muda toda semana.</li><li>Time inexperiente que aplicará cargo-cult (pasta com nomes DDD, entities anêmicas).</li><li>Prazo muito curto — ROI de DDD é longo prazo.</li></ul><p>Critério: <strong>complexidade do domínio × vida do sistema</strong>. Fintech com regras fiscais complexas + 10 anos → DDD. Dashboard analytics interno → não.</p>',
    tip: 'Demonstrar que sabe quando não usar é tão importante quanto saber usar.',
  },
  {
    level: 'Senior',
    q: 'Como você define o tamanho correto de um aggregate?',
    a: '<p>Vaughn Vernon: <em>"design small aggregates"</em>. Critério principal: a <strong>invariante que precisa ser mantida consistentemente</strong>.</p><ul><li>Se invariante exige ver dois objetos juntos para validar → mesmo aggregate.</li><li>Se a regra tolera eventual consistency ("estoque vai ser atualizado em segundos") → aggregates separados, comunicação via Domain Event.</li></ul><p>Heurísticas: aggregate com 10+ entidades filhas é candidato a quebrar; Order com OrderItems está ok; Order com Customer inteiro está errado (Customer é aggregate próprio, referência por customerId). Em caso de dúvida: começa menor.</p>',
    tip: 'Citar Vaughn Vernon e "design small aggregates" é referência correta. O exemplo Order com customerId (referência) vs Order com Customer inteiro (errado) é concreto e eficaz.',
  },
  {
    level: 'Senior',
    q: 'O que é Event Storming e como usaria?',
    a: '<p>Event Storming (Alberto Brandolini) é técnica colaborativa para explorar domínio. Fluxo:</p><ol><li><strong>Laranja</strong> = Domain Events na ordem temporal — "o que acontece no negócio?"</li><li><strong>Azul</strong> = Commands — "o que causou?"</li><li><strong>Amarelo</strong> = Aggregates — "quem decidiu?"</li><li><strong>Roxo</strong> = Policies — automações e reações.</li><li><strong>Rosa</strong> = External Systems.</li></ol><p>Resultado: bounded contexts emergem onde a linguagem muda. Ubiquitous Language nasce da conversa. Dura 4-8h para sistema médio. Mais valioso que qualquer documento de requisito.</p>',
    tip: 'Saber as cores dos post-its e o que cada uma representa demonstra que você participou de um Event Storming real, não só leu sobre ele.',
  },
  {
    level: 'Senior',
    q: 'Qual o tradeoff entre Rich Domain Model e Anemic Model + Service?',
    a: '<p><strong>Anemic model + Service:</strong> rápido de escrever, familiar, baixa curva. Risco: regra de negócio espalha pelos services, duplicação de validação, sem encapsulamento real.</p><p><strong>Rich model (DDD):</strong> comportamento no aggregate. <code>order.confirm()</code> valida invariantes internamente. Testável unitariamente. Mais código upfront, exige disciplina do time.</p><p>Quando anemic vence: CRUD simples, reporting, dados fluem do banco ao cliente. Quando rich vence: domínio com regras complexas, invariantes críticas, sistema de longa vida.</p><p>Anti-pattern: rich model com lógica toda no Application Service — é anemic com nomes de DDD.</p>',
    tip: 'O anti-pattern "rich model com lógica no Application Service" é o sinal de cargo-cult DDD. Mencioná-lo diferencia quem entendeu o modelo rico de quem só renomeou classes.',
  },
  {
    level: 'Pleno',
    q: 'Como você implementa Repository em DDD?',
    a: '<p>Interface no domínio: <code>IOrderRepository</code> com <code>findById</code>, <code>findByCustomerId</code>, <code>save</code>. Implementação na infra: <code>PrismaOrderRepository implements IOrderRepository</code>.</p><p>Regras:</p><ul><li>Um repositório por aggregate root — não por entidade filha.</li><li>Métodos simples: save, findById, poucos finders de domínio.</li><li>Queries complexas de leitura vão para Read Model (CQRS), não no repositório.</li><li>Mappers traduzem: domain → persistence e persistence → domain entity.</li></ul>',
    tip: 'A regra "um repositório por aggregate root, nunca por entidade filha" é o critério mais cobrado em entrevistas sobre Repository em DDD. Mencionar CQRS para queries complexas mostra maturidade.',
  },
  {
    level: 'Senior',
    q: 'Como representar estados complexos em aggregates (State Machine)?',
    a: '<p>Aggregates com fluxo de estados (Order: pending → confirmed → paid → shipped → cancelled) são naturalmente State Machines.</p><p>Abordagem com enum + guard clauses:</p><pre><code>confirm(): void {\n  if (this.status !== "pending") throw new InvalidStatusTransitionError()\n  this.status = "confirmed"\n  this.addEvent(new OrderConfirmed(this.id))\n}</code></pre><p>Alternativa com <strong>State pattern</strong>: cada estado é uma classe que implementa as transições válidas. Mais verboso, mas elimina guard clauses espalhadas e torna estados explícitos.</p><p>Vantagens: transições inválidas são impossíveis no banco; Domain Events acoplados à transição; histórico de estados é o Event Log em Event Sourcing.</p>',
    tip: 'Mencionar State pattern como alternativa a guard clauses espalhadas mostra conexão entre DDD tático e GoF. A ligação com Event Sourcing eleva a resposta ao nível sênior.',
  },
  {
    level: 'Senior',
    q: 'Qual a relação entre Repository e Unit of Work em DDD?',
    a: '<p><strong>Repository</strong> provê a ilusão de coleção em memória: <code>findById</code>, <code>save</code>. <strong>Unit of Work</strong> rastreia todas as mudanças numa operação e as aplica numa única transação.</p><p>Com Prisma: <code>IUnitOfWork.run(work)</code> usa <code>prisma.$transaction</code> internamente. Repositories filhos do UoW compartilham a mesma conexão de transação.</p><p>Quando usar: use cases que tocam múltiplos aggregates. Quando não usar: use case toca só 1 aggregate — repository único com <code>save()</code> é suficiente.</p>',
    tip: 'Saber quando Unit of Work é necessário (múltiplos aggregates) vs desnecessário (único aggregate) mostra que você não aplica padrões por hábito, mas por necessidade.',
  },
]

// ── Building Blocks (PatternsPdf) ─────────────────────────────────────────────

const BUILDING_BLOCKS: DesignPattern[] = [
  {
    name: 'Entity',
    category: 'Tático',
    intent: 'Objeto com identidade única que persiste e é rastreável ao longo do tempo.',
    whenToUse: [
      'Precisa rastrear com ID próprio ao longo do tempo',
      'Igualdade por identidade, não por valor dos campos',
      'Ciclo de vida: nasce, muda, morre',
      'Exemplos: User, Order, Product, Invoice',
    ],
    whenToAvoid: [
      'Objeto definido completamente pelos seus valores → use Value Object',
      'Nunca precisa de identidade própria ou rastreabilidade',
    ],
    code: `class User {\n  constructor(\n    public readonly id: string,  // identidade\n    public name: string,         // mutável\n    public email: Email,         // VO encapsulado\n  ) {}\n\n  equals(other: User): boolean {\n    return this.id === other.id  // igualdade por ID\n  }\n\n  changeEmail(email: Email): void {\n    this.email = email  // muta, identidade permanece\n  }\n}`,
  },
  {
    name: 'Value Object',
    category: 'Tático',
    intent: 'Imutável, sem identidade, definido pelos seus valores. Encapsula validação e comportamento.',
    whenToUse: [
      'Definido completamente pelos seus valores (Money(100, BRL))',
      'Imutável — operações retornam novo VO',
      'Encapsular validação (CPF inválido no construtor)',
      'Exemplos: Money, Address, CPF, Email, DateRange, Quantity',
    ],
    whenToAvoid: [
      'Precisa rastrear ao longo do tempo → use Entity',
      'Objeto gigante com dezenas de campos — dividir em VOs menores',
    ],
    code: `class Money {\n  private constructor(\n    public readonly amount: number,\n    public readonly currency: 'BRL' | 'USD',\n  ) {}\n\n  static of(amount: number, currency: 'BRL' | 'USD'): Money {\n    if (amount < 0) throw new Error('valor negativo')\n    return new Money(Math.round(amount * 100) / 100, currency)\n  }\n\n  add(other: Money): Money {\n    if (other.currency !== this.currency)\n      throw new CurrencyMismatchError()\n    return Money.of(this.amount + other.amount, this.currency)\n  }\n\n  equals(other: Money): boolean {\n    return this.amount === other.amount &&\n           this.currency === other.currency\n  }\n}`,
  },
  {
    name: 'Aggregate Root',
    category: 'Tático',
    intent: 'Cluster transacional com entidade raiz que garante invariantes e é a única porta de entrada.',
    whenToUse: [
      'Cluster de entidades com invariante que exige consistência transacional',
      'Grupo de objetos que devem mudar juntos atomicamente',
      'Exemplos: Order+Items, BankAccount+Transactions, Cart+Lines',
    ],
    whenToAvoid: [
      'Aggregate com 10+ entidades filhas — considere redesenhar fronteiras',
      'Quando invariante tolera eventual consistency — aggregates separados',
    ],
    participants: ['Aggregate Root (Entity principal)', 'Entidades filhas (acesso só via Root)', 'Value Objects', 'Domain Events emitidos pelo Root'],
    code: `class Order {\n  private items: OrderItem[] = []\n  private status: 'pending' | 'confirmed' | 'cancelled' = 'pending'\n\n  // única porta de entrada para addItem\n  addItem(sku: string, qty: number, price: Money): void {\n    if (this.status !== 'pending') throw new OrderClosedError()\n    this.items.push(new OrderItem(sku, qty, price))\n  }\n\n  // garante invariantes, emite Domain Event\n  confirm(): OrderConfirmed {\n    if (!this.items.length) throw new EmptyOrderError()\n    if (this.status !== 'pending') throw new InvalidStatusError()\n    this.status = 'confirmed'\n    return new OrderConfirmed(this.id, this.total())\n  }\n}`,
  },
  {
    name: 'Domain Event',
    category: 'Tático',
    intent: 'Fato imutável que ocorreu no domínio. Nome no passado. Desacopla reação entre aggregates e bounded contexts.',
    whenToUse: [
      'Algo importante aconteceu que outros contextos precisam saber',
      'Desacoplar reação da ação (Order.confirm não precisa saber de email)',
      'Event Sourcing como write side',
      'Saga para fluxo distribuído com compensação',
    ],
    whenToAvoid: [
      'Reação imediata e síncrona no mesmo bounded context — sobrecomplica',
      'Quando a consistência eventual é inaceitável para o negócio',
    ],
    code: `// Domain Event — imutável, nome no passado\nclass OrderConfirmed {\n  constructor(\n    public readonly orderId: string,\n    public readonly total: Money,\n    public readonly confirmedAt: Date = new Date(),\n  ) {}\n}\n\n// Transactional Outbox — at-least-once garantido\nawait prisma.$transaction(async (tx) => {\n  await tx.order.update({ where: { id }, data: orderData })\n  await tx.outboxEvent.create({\n    data: { type: 'OrderConfirmed', payload: JSON.stringify(event) }\n  })\n})\n// Worker lê outbox e publica no broker`,
  },
  {
    name: 'Repository',
    category: 'Tático',
    intent: 'Abstração de persistência por aggregate root. Interface no domínio, implementação na infra.',
    whenToUse: [
      'Um repositório por aggregate root — não por entidade filha',
      'Isolar o domínio de detalhes de persistência',
      'Permitir troca de ORM sem afetar o domínio',
    ],
    whenToAvoid: [
      'Queries analíticas complexas — vão para Read Model (CQRS)',
      'Nunca criar repositório por entidade filha (OrderItemRepository)',
    ],
    code: `// Interface no DOMÍNIO\nexport interface IOrderRepository {\n  findById(id: OrderId): Promise<Order | null>\n  findByCustomerId(cId: CustomerId): Promise<Order[]>\n  save(order: Order): Promise<void>\n  // ❌ sem findByStatus, findByDate — vão pro Read Model\n}\n\n// Implementação na INFRA\nclass PrismaOrderRepository implements IOrderRepository {\n  async save(order: Order): Promise<void> {\n    const data = OrderMapper.toPersistence(order)\n    await this.prisma.order.upsert({ where: { id: order.id }, ...data })\n  }\n  async findById(id: OrderId): Promise<Order | null> {\n    const row = await this.prisma.order.findUnique({ where: { id } })\n    return row ? OrderMapper.toDomain(row) : null\n  }\n}`,
  },
  {
    name: 'Domain Service',
    category: 'Tático',
    intent: 'Lógica de negócio que cruza múltiplos aggregates e não pertence naturalmente a nenhum deles.',
    whenToUse: [
      'Regra envolve 2+ aggregates e não cabe em nenhum',
      'Lógica stateless sem I/O — recebe objetos, retorna resultado',
      'Exemplo: PricingService.calculate(customer, product)',
    ],
    whenToAvoid: [
      'Se cabe em um único aggregate — coloque lá',
      'Nunca chamar repositório direto — Domain Service recebe objetos prontos',
    ],
    code: `class PricingService {\n  // Regra cruza Customer e Product\n  // Nenhum dos dois é o "dono" natural da regra\n  calculate(customer: Customer, product: Product): Money {\n    if (customer.isPremium() && product.isDiscountable())\n      return product.price.multiply(0.15)\n    if (customer.hasCoupon('BLACK_FRIDAY'))\n      return product.price.multiply(0.10)\n    return Money.zero('BRL')\n  }\n}\n\n// Application Service busca os objetos e passa pro Domain Service\nclass CreateOrderUseCase {\n  async execute(input: Input) {\n    const customer = await this.customerRepo.findById(input.customerId)\n    const product  = await this.productRepo.findById(input.productId)\n    const discount = this.pricingService.calculate(customer, product)\n    // ...\n  }\n}`,
  },
]

// ── Mnemonics ─────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'BCU — Strategic DDD',
    trick: 'Bounded Context · Context Map · Ubiquitous Language',
    expansion: [
      ['B', 'Bounded Context — fronteira lógica onde um modelo coeso faz sentido'],
      ['C', 'Context Map — como os contextos se relacionam (ACL, Conformist, Customer-Supplier)'],
      ['U', 'Ubiquitous Language — vocabulário único entre devs e negócio, no código'],
    ],
    explanation: 'Os três pilares estratégicos do DDD. Sem BCU, você tem building blocks táticos sem direção estratégica. Contexto errado = modelo errado. Linguagem errada = bug humano.',
    example: 'B: Orders Context vs Payments Context. C: Orders → Payments via ACL. U: "shipment" no código, "shipment" na conversa.',
    why: 'Toda entrevista sênior sobre DDD começa com Strategic. BCU em 3 segundos.',
  },
  {
    label: 'EVARDS — Building Blocks Táticos',
    trick: 'Entity · Value Object · Aggregate · Repository · Domain Service',
    expansion: [
      ['E', 'Entity — identidade única, igualdade por ID, rastreável ao longo do tempo'],
      ['V', 'Value Object — imutável, igualdade por valor, sem ID próprio'],
      ['A', 'Aggregate — cluster transacional com Root como única porta de entrada'],
      ['R', 'Repository — interface no domínio, implementação na infra'],
      ['D', 'Domain Service — lógica cross-aggregate, stateless, sem I/O'],
    ],
    explanation: 'Os cinco building blocks táticos principais. Acrescente "+S" de Stories (Domain Events) para o quadro completo. Cada um tem um papel específico — misturar é o erro mais comum.',
    example: 'Order (A), OrderItem (E), Money (V), IOrderRepository (R), PricingService (D), OrderConfirmed (evento +S)',
    why: 'EVARDS → "o Professor Evards ensina DDD tático". Lembrar os 5 em ordem de entrevista.',
  },
  {
    label: 'SMALL ROOT ONE — Regras de Aggregate',
    trick: 'Design Small · Root is the only door · One transaction per aggregate',
    expansion: [
      ['SMALL', 'Aggregate pequeno — se tem 10+ entidades filhas, redesenhe a fronteira'],
      ['ROOT', 'Root é a única porta — nunca acesse entidade filha diretamente'],
      ['ONE', 'Uma transação por aggregate — se precisar de dois, use eventual consistency'],
    ],
    explanation: 'As três regras de ouro de Vaughn Vernon para aggregates. Violar qualquer uma gera lock contention, invariantes quebradas ou fronteiras erradas.',
    example: 'SMALL: Order com 3-5 items, ok. Order com Customer + Payment + Shipment, errado. ROOT: order.addItem() não order.items.push(). ONE: OrderConfirmed event para Inventory, não transação cruzada.',
    why: '"Small Root One" — as três leis do aggregate saudável. Fácil de lembrar, difícil de violar depois.',
  },
  {
    label: 'ID OU VALOR? — Entity vs Value Object',
    trick: 'Precisa rastrear ao longo do tempo? Entity. Definido pelos valores? Value Object.',
    expansion: [
      ['ID', 'Precisa de identidade única, rastreável, com ciclo de vida → Entity'],
      ['OU', 'Se nenhuma das duas perguntas se aplica, reavalie se precisa de objeto'],
      ['VALOR', 'Definido pelos seus valores, imutável, sem ciclo de vida → Value Object'],
    ],
    explanation: 'Pergunta de decisão em 2 segundos. Errar aqui gera IDs desnecessários (overengineering) ou mutabilidade onde não deveria (bug). A maioria dos objetos de domínio deveria ser VO.',
    example: 'User → ID (rastreia ao longo do tempo). Money → VALOR (100 BRL == 100 BRL qualquer instância). Address → VALOR (imutável, igualdade pelos campos). Order → ID (tem ciclo de vida rastreável).',
    why: 'A pergunta mais frequente de DDD em entrevista pleno. Resposta em 2 segundos com o mnemônico.',
  },
]

// ── Anti-patterns PDF ─────────────────────────────────────────────────────────

const PDF_ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Modelo anêmico — Entity sem comportamento',
    badDesc: 'Entity só com dados (getters/setters), toda lógica nos Services',
    badCode: [
      { t: 'class Order {' },
      { t: '  status: string  // público, mutável diretamente', c: '#ef4444' },
      { t: '  items: OrderItem[]' },
      { t: '}' },
      { t: 'class OrderService {' },
      { t: '  confirm(order: Order) {', c: '#ef4444' },
      { t: '    if (order.items.length === 0) throw new Error()', c: '#ef4444' },
      { t: '    order.status = "confirmed"  // invariante violável', c: '#ef4444' },
      { t: '  }' },
      { t: '}  // 3 services duplicam a mesma validação', c: '#94a3b8' },
    ],
    goodDesc: 'Modelo rico — invariantes encapsuladas na própria entidade',
    goodCode: [
      { t: 'class Order {', c: '#4ade80' },
      { t: '  private status = "pending"' },
      { t: '  confirm(): OrderConfirmed {', c: '#4ade80' },
      { t: '    if (!this.items.length) throw new EmptyOrderError()', c: '#4ade80' },
      { t: '    if (this.status !== "pending") throw new InvalidStatusError()', c: '#4ade80' },
      { t: '    this.status = "confirmed"' },
      { t: '    return new OrderConfirmed(this.id, this.total())', c: '#4ade80' },
      { t: '  }' },
      { t: '}' },
      { t: '// Application Service só orquestra:', c: '#94a3b8' },
      { t: 'const event = order.confirm()  // regra no domínio', c: '#4ade80' },
    ],
    why: 'Modelo anêmico espalha regra pelos services: duplicação de validação, invariante violável por qualquer chamador, teste exige mock de infra. Modelo rico: invariantes testáveis sem banco.',
  },
  {
    title: 'Aggregate gordo — tudo no mesmo aggregate',
    badDesc: 'Aggregate carrega entidades de outros bounded contexts como filhas',
    badCode: [
      { t: 'class Order {' },
      { t: '  items: OrderItem[]       // ✅ ok', c: '#4ade80' },
      { t: '  customer: Customer       // ❌ outro aggregate', c: '#ef4444' },
      { t: '  payment: Payment         // ❌ outro aggregate', c: '#ef4444' },
      { t: '  shipment: Shipment       // ❌ outro aggregate', c: '#ef4444' },
      { t: '  notifications: Notification[]  // ❌ nem é de Order', c: '#ef4444' },
      { t: '}' },
      { t: '// Transação carrega 200 objetos — lock contention', c: '#ef4444' },
    ],
    goodDesc: 'Aggregates pequenos, referência por ID, comunicação via Domain Events',
    goodCode: [
      { t: 'class Order {', c: '#4ade80' },
      { t: '  id: OrderId' },
      { t: '  customerId: CustomerId    // referência por ID', c: '#4ade80' },
      { t: '  items: OrderItem[]        // dentro do limite', c: '#4ade80' },
      { t: '}' },
      { t: '// Customer, Payment, Shipment são aggregates próprios', c: '#94a3b8' },
      { t: '// Comunicação via Domain Events (desacoplado)', c: '#4ade80' },
    ],
    why: 'Aggregate gordo: transações longas, lock contention, queries pesadas. Regra de Vernon: prefira aggregates de 1-3 entidades. Referência por ID entre aggregates.',
  },
  {
    title: 'Domain Events sem Transactional Outbox',
    badDesc: 'Race condition: salva aggregate, falha antes de publicar o evento',
    badCode: [
      { t: 'const event = order.confirm()' },
      { t: 'await orderRepo.save(order)        // ✅ salvo', c: '#4ade80' },
      { t: '// ← falha aqui = estado inconsistente!', c: '#ef4444' },
      { t: 'await eventBus.publish(event)      // ❌ pode nunca chegar', c: '#ef4444' },
      { t: '// Handlers nunca recebem o evento — bug silencioso', c: '#94a3b8' },
    ],
    goodDesc: 'Outbox Pattern: mesma transação garante at-least-once',
    goodCode: [
      { t: 'await prisma.$transaction(async (tx) => {', c: '#4ade80' },
      { t: '  await tx.order.update({ ... })  // salva aggregate', c: '#4ade80' },
      { t: '  await tx.outboxEvent.create({   // mesma transação', c: '#4ade80' },
      { t: '    data: { type: "OrderConfirmed", payload: "..." }' },
      { t: '  })' },
      { t: '})  // Worker lê outbox e publica no broker', c: '#4ade80' },
      { t: '// Handlers idempotentes — evento 2x não é problema', c: '#94a3b8' },
    ],
    why: 'Publicar evento após save sem transação tem race condition. Outbox: save + evento na mesma transação. At-least-once garantido. Handlers devem ser idempotentes.',
  },
  {
    title: 'Repository com 40 métodos (virou DAO)',
    badDesc: 'Interface com todas as queries possíveis — acopla domínio a queries analíticas',
    badCode: [
      { t: 'interface IOrderRepository {' },
      { t: '  findByStatus(s: string): Order[]          // ❌ analítica', c: '#ef4444' },
      { t: '  countByMonth(month: number): number        // ❌ relatório', c: '#ef4444' },
      { t: '  getTopCustomers(n: number): Customer[]     // ❌ cruza aggregate', c: '#ef4444' },
      { t: '  findByStatusAndCustomerAndDate(...): Order[] // ❌', c: '#ef4444' },
      { t: '}  // 40 métodos depois', c: '#94a3b8' },
    ],
    goodDesc: 'Repository focado + Read Model separado para queries complexas',
    goodCode: [
      { t: 'interface IOrderRepository {', c: '#4ade80' },
      { t: '  findById(id: OrderId): Promise<Order | null>  // ✅', c: '#4ade80' },
      { t: '  findByCustomerId(cId: CustomerId): Promise<Order[]>  // ✅', c: '#4ade80' },
      { t: '  save(order: Order): Promise<void>  // ✅', c: '#4ade80' },
      { t: '}' },
      { t: '// Queries complexas → Read Model (CQRS):', c: '#94a3b8' },
      { t: 'class OrderQueryService {  // SQL otimizado, sem aggregate', c: '#4ade80' },
      { t: '  async getMonthlyReport(month: Date) { ... }', c: '#4ade80' },
      { t: '}' },
    ],
    why: 'Repository com muitos métodos virou DAO disfarçado. Queries analíticas → Read Model (CQRS). Repository fica limpo com apenas o que o aggregate precisa para garantir invariantes.',
  },
]

// ── Comparative ───────────────────────────────────────────────────────────────

const COMP_OPTIONS: CompOption[] = [
  { name: 'DDD',                color: '#E91E63' },
  { name: 'Transaction Script', color: '#64748b' },
  { name: 'CRUD / Active Record', color: '#94a3b8' },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Domínio complexo com regras ricas',
    values: { 'DDD': 'excellent — projetado para isso', 'Transaction Script': 'fair — degradando', 'CRUD / Active Record': 'poor — sem lugar para regras' },
    winner: 'DDD',
  },
  {
    criterion: 'Testabilidade unitária (sem banco)',
    values: { 'DDD': 'excellent — aggregates sem infra', 'Transaction Script': 'fair — services com mocks', 'CRUD / Active Record': 'poor — lógica acoplada ao ORM' },
    winner: 'DDD',
  },
  {
    criterion: 'Custo inicial de implementação',
    values: { 'DDD': 'poor — Event Storming, camadas, aggregates', 'Transaction Script': 'excellent — scripts diretos', 'CRUD / Active Record': 'excellent — ORM + controller + tela' },
    winner: 'CRUD / Active Record',
  },
  {
    criterion: 'Manutenibilidade no longo prazo',
    values: { 'DDD': 'excellent — encapsulamento real', 'Transaction Script': 'fair — scripts entrelaçados', 'CRUD / Active Record': 'poor — lógica espalhada, mudança afeta vários pontos' },
    winner: 'DDD',
  },
  {
    criterion: 'Curva de aprendizado do time',
    values: { 'DDD': 'poor — requer time experiente e especialista de domínio', 'Transaction Script': 'excellent — scripts procedurais', 'CRUD / Active Record': 'excellent — ensinado em todo curso web' },
    winner: 'CRUD / Active Record',
  },
  {
    criterion: 'CRUD simples / telas admin',
    values: { 'DDD': 'poor — overkill, boilerplate sem benefício', 'Transaction Script': 'good — scripts simples', 'CRUD / Active Record': 'excellent — solução ideal' },
    winner: 'CRUD / Active Record',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Domain-Driven Design',
    stackLabel: 'Arquitetura',
  }),
  patterns: () => buildPatternsPdf({
    patterns: BUILDING_BLOCKS,
    accentColor: C,
    skillName: 'DDD Building Blocks',
    stackLabel: 'Guia tático de padrões DDD',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'DDD',
    stackLabel: 'Mnemônicos para fixar os conceitos',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: PDF_ANTIPATTERNS,
    accentColor: C,
    skillName: 'DDD Anti-patterns',
    stackLabel: 'O que destrói um projeto com DDD',
  }),
  comparative: () => buildComparativeRefPdf({
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    accentColor: C,
    skillName: 'DDD vs alternativas',
    stackLabel: 'DDD × Transaction Script × CRUD',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function DddPdfs() {
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
