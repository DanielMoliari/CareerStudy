'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem, PatternItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta Clean Architecture ──────────────────────────────────────────────────
const C = '#455A64'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista Clean Arch',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: Dependency Rule, camadas concêntricas, inversão de dependência, ports and adapters, entities ricas vs anêmicas, use cases como orquestradores, testes sem framework, quando usar vs não usar Clean Arch e diferenças para Hexagonal e DDD.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet Clean Arch',
    subtitle: 'Camadas, regras e padrões numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência rápida: as 4 camadas com o que vai em cada uma, regras de importação, padrões de implementação (mapper, port, presenter), regras de ouro e checklist antes de fazer code review.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Truques para fixar as regras que mais caem',
    type: 'mnemonics',
    pages: 2,
    description: 'EUAF para as 4 camadas, DEPENDE para a Dependency Rule, PORT para o padrão port/adapter, THIN para controller lean. Âncoras cognitivas que grudam.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 6 erros mais comuns — e como corrigi-los',
    type: 'antipatterns',
    pages: 3,
    description: 'Use case acessando banco diretamente, controller gordo, entity anêmica, decorator de ORM no domínio, service onipotente, God Use Case. Com código errado vs correto.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map Clean Arch',
    subtitle: 'Ecossistema completo em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com as 4 camadas, princípios SOLID relacionados, padrões táticos (entity, VO, aggregate, use case, port, adapter, presenter, mapper) e checklist de entrevista.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
]

// ── Q&As ──────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'O que é a Dependency Rule e por que ela é o princípio central da Clean Arch?',
    a: '<strong>Dependency Rule</strong>: o código-fonte de uma camada interna nunca pode depender de qualquer coisa de uma camada mais externa. Setas de dependência apontam sempre para dentro.<br><br>Na prática: Entities não importam Use Cases. Use Cases não importam Controllers. Controllers não importam Express.<br><br><strong>Por que é central:</strong> sem essa regra, qualquer camada pode importar qualquer outra — em semanas o código se torna um big ball of mud onde mudar o ORM quebra regras de negócio. Com a regra enforçada, você pode trocar Express por Fastify, Postgres por MongoDB ou React por Vue sem tocar no domínio.<br><br><strong>Inversão de dependência (DIP)</strong> é o mecanismo que torna isso possível quando a camada interna precisar de algo externo — ela define uma interface; a externa implementa.',
    tip: 'Explique o mecanismo: a regra é absoluta, e quando existe necessidade de comunicação de dentro para fora, use DIP — a camada interna define a interface, a externa implementa.',
  },
  {
    level: 'Pleno',
    q: 'Quais são as 4 camadas da Clean Architecture e o que pertence a cada uma?',
    a: '<ul><li><strong>Entities</strong>: regra de negócio empresarial. Objetos de domínio puros (Order, User, Money). Calculam, validam invariantes. Zero imports externos.</li><li><strong>Use Cases</strong>: regra de aplicação. Orquestram entities. Definem interfaces (ports) que a infra deve implementar. Exemplos: CreateOrderUseCase, ApprovePayment.</li><li><strong>Interface Adapters</strong>: tradutores. Controllers (HTTP → use case), Presenters (use case → HTTP), Repositories (domínio → ORM), Gateways (domínio → API externa).</li><li><strong>Frameworks and Drivers</strong>: a borda. Express, Prisma, AWS SDK, pg driver, React. Puro detalhe plugável.</li></ul>',
    tip: 'Use o mnemônico EUAF (Entities → Use Cases → Adapters → Frameworks). A dependência sempre flui de fora para dentro.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o padrão Port e Adapter? Dê um exemplo concreto.',
    a: '<strong>Port</strong> (porto): interface definida pela camada de aplicação. Descreve o contrato que a infra deve cumprir.<br><br><strong>Adapter</strong> (adaptador): implementação concreta do port na camada de infra.<br><br><strong>Exemplo concreto:</strong><br>1. Use case define: <code>interface IOrderRepository { save(order: Order): Promise&lt;void&gt; }</code><br>2. Infra implementa: <code>class PrismaOrderRepository implements IOrderRepository</code><br>3. Use case recebe via construtor o <code>IOrderRepository</code> — não sabe se é Prisma ou Fake<br>4. Teste usa <code>FakeOrderRepository</code> — roda em milissegundos sem banco<br><br>Se o time trocar Prisma por TypeORM, apenas o adapter muda. Use case e entity ficam intactos.',
    tip: 'Dê o exemplo completo com interface + implementação + fake de teste. Isso prova que você aplicou em código real.',
  },
  {
    level: 'Senior',
    q: 'O que é inversão de dependência (DIP) e como ela resolve o problema de apontar pra dentro?',
    a: '<strong>Problema:</strong> o use case precisa salvar dados — mas não pode importar Prisma (violaria a dependency rule).<br><br><strong>DIP resolve assim:</strong><br>1. O use case <em>define</em> a interface: <code>interface IOrderRepository</code><br>2. A infra <em>implementa</em>: <code>class PrismaOrderRepository implements IOrderRepository</code><br>3. O módulo de composição (main.ts / NestJS Module) injeta a implementação concreta no use case<br><br><strong>Resultado:</strong> o source code dependency vai de <code>PrismaOrderRepository → IOrderRepository</code> (de fora para dentro). O fluxo de execução vai de dentro para fora. São direções inversas — daí "inversão".<br><br>DIP é o que torna toda a Clean Architecture possível sem violar a dependency rule.',
    tip: 'A distinção source code dependency vs fluxo de controle é o que diferencia quem entende de quem decorou. Explique ambos.',
  },
  {
    level: 'Senior',
    q: 'Quando NÃO usar Clean Architecture?',
    a: '<strong>Clean Arch tem custo real:</strong> cada feature simples vira 5-7 arquivos (entity, use case, port, adapter, controller, DTO, mapper). Em sistemas triviais, esse custo não se paga.<br><br><strong>Não use quando:</strong><ul><li>CRUD puro sem regra de negócio significativa</li><li>MVP ou protótipo de validação de hipótese</li><li>Sistema de curto prazo (menos de 2 anos de vida esperada)</li><li>Time pequeno (1-2 devs) sem necessidade de isolamento</li><li>Landing pages, painéis administrativos simples</li></ul><br><strong>Use quando:</strong> regra de negócio rica e complexa, sistema de 5+ anos, time grande que precisa de contratos claros, previsão concreta de troca de tecnologia, testes unitários rápidos são requisito de time.',
    tip: 'Saber quando NÃO usar diferencia sênior de pleno. Defenda a escolha com contexto — não com gosto pessoal.',
  },
  {
    level: 'Pleno',
    q: 'O que é uma Entity rica? Como ela difere de uma Entity anêmica?',
    a: '<strong>Entity anêmica</strong>: só dados e getters/setters. A lógica de negócio vaza para services ou controllers. Qualquer código pode violar invariantes diretamente.<br><br><strong>Entity rica</strong>: encapsula comportamento e invariantes. Você não pode colocar um pedido em estado inválido de fora — a entity impede isso.<br><br><strong>Exemplo:</strong><br>• Anêmica: <code>order.status = "approved"</code> — sem validação, qualquer lugar faz isso<br>• Rica: <code>order.approve()</code> — lança <code>OrderNotPendingError</code> se não puder aprovar<br><br>Entity rica segue o princípio <em>Tell, Don\'t Ask</em>: você diz à entity o que fazer, não pergunta seu estado e toma a decisão fora.',
    tip: 'O exemplo order.approve() vs order.status = "approved" é concreto e eficaz. Mencione Tell, Don\'t Ask para mostrar fluência em OOP.',
  },
  {
    level: 'Pleno',
    q: 'O que são Value Objects e qual a diferença para Entities?',
    a: '<strong>Entity</strong>: identidade por ID. Dois objetos com mesmo ID são a mesma entity, mesmo que outros campos difiram. Mutável ao longo do tempo.<br><br><strong>Value Object</strong>: identidade por valor. Dois objetos com os mesmos valores são equivalentes — não há ID. Imutável — operações retornam novo VO.<br><br><strong>Exemplos de VOs:</strong><br>• <code>Money { amount: 100, currency: BRL }</code> — dois Money com mesmo valor são iguais<br>• <code>CPF { number: "123.456.789-09" }</code> — encapsula validação<br>• <code>Email { address: "user@example.com" }</code><br>• <code>DateRange { start, end }</code><br><br><strong>Vantagem:</strong> VOs eliminam primitive obsession, centralizam validação e tornam o código mais expressivo.',
    tip: 'Mencione imutabilidade e identidade por valor como critérios. O exemplo Money é clássico — dinheiro não tem ID, tem valor.',
  },
  {
    level: 'Senior',
    q: 'Como testar Use Cases sem subir banco de dados ou framework?',
    a: '<strong>Estratégia: Fake Repositories</strong><br><br>O use case depende de <code>IOrderRepository</code> (interface). O teste cria um <code>FakeOrderRepository</code> que implementa a mesma interface usando um array em memória.<br><br><strong>Resultado:</strong><br>• Teste roda em menos de 5ms — sem conexão de banco<br>• Sem Docker, sem test database, sem migrations<br>• Cenários de falha são triviais: <code>FakeOrderRepository.failOnSave()</code><br>• 100% dos caminhos cobertos sem overhead<br><br><strong>Pirâmide de testes clean:</strong><br>• Unitários (use cases + entities): 80% — milissegundos<br>• Integração (adapter + DB real): 15% — segundos<br>• E2E (HTTP → DB): 5% — mais lentos, cobertura de smoke test',
    tip: 'A pirâmide de testes é o argumento de venda. Testes unitários de 5ms vs E2E de 10s — Clean Arch paga o custo de boilerplate em velocidade de teste.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre Clean Architecture e Hexagonal Architecture (Ports & Adapters)?',
    a: 'São variações do mesmo princípio: isolar o core de domínio de detalhes externos.<br><br><strong>Hexagonal (Alistair Cockburn, 2005):</strong> Metáfora de hexágono com portas de entrada (driving adapters — HTTP, CLI) e saída (driven adapters — banco, email). Mais focada em deixar o core plugável. Não define quantas camadas internas existem.<br><br><strong>Clean (Robert Martin, 2012):</strong> Especifica 4 camadas concêntricas explícitas. Dependency Rule formalizada. Mais prescritivo sobre o que vai em cada camada.<br><br><strong>Na prática:</strong> quase idênticos. Hexagonal usa "port" e "adapter" como termos. Clean usa "use case" e "gateway/repository". Ambos resolvem o mesmo problema com nomes ligeiramente diferentes.',
    tip: 'A resposta sênior é "são variações do mesmo princípio". Mostrar que você vê o padrão subjacente, não só os nomes, é o diferencial.',
  },
  {
    level: 'Senior',
    q: 'O que é um Mapper e por que é necessário em Clean Architecture?',
    a: '<strong>Mapper</strong>: componente responsável por converter dados entre os formatos de diferentes camadas. Vive na camada de Interface Adapters.<br><br><strong>Por que necessário:</strong> o objeto de domínio <code>Order</code> tem um formato; o objeto Prisma <code>OrderRecord</code> tem outro; o JSON da API tem um terceiro. Se o use case ou a entity precisassem conhecer esses formatos, violariam a dependency rule.<br><br><strong>Tipos de mapper:</strong><br>• <code>OrderPrismaMapper</code>: <code>domain.Order → prisma.order</code> e vice-versa<br>• <code>OrderPresenter</code>: <code>use case output → HTTP response JSON</code><br>• <code>OrderInputMapper</code>: <code>HTTP request body → use case input DTO</code><br><br>Mappers são boilerplate — mas são o preço do isolamento. Uma vez escrito, raramente muda.',
    tip: 'Mostrar os 3 tipos de mapper demonstra que você aplicou em código real. Mencione que é boilerplate inevitável mas localizado.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona a injeção de dependência em Clean Arch com NestJS?',
    a: '<strong>NestJS usa um container de DI</strong> que resolve automaticamente as dependências pelo construtor.<br><br><strong>Configuração Clean Arch em NestJS:</strong><br>1. Define <code>IOrderRepository</code> como token de injeção<br>2. No módulo: <code>{ provide: IOrderRepository, useClass: PrismaOrderRepository }</code><br>3. Use case recebe via construtor: <code>constructor(private repo: IOrderRepository)</code><br>4. NestJS injeta <code>PrismaOrderRepository</code> automaticamente<br><br><strong>Para testes:</strong> no test module substitua: <code>{ provide: IOrderRepository, useClass: FakeOrderRepository }</code><br><br><strong>Cuidado:</strong> em NestJS puro os tokens são classes, não interfaces (TypeScript apaga interfaces em runtime). Use <code>Symbol</code> ou classe abstrata como token.',
    tip: 'O detalhe de TypeScript apagar interfaces em runtime é o que diferencia quem aplicou na prática. Mencione Symbol ou abstract class como solução.',
  },
  {
    level: 'Pleno',
    q: 'O que são Domain Events e como integrar com Clean Architecture?',
    a: '<strong>Domain Event</strong>: algo que aconteceu no domínio, imutável e em passado. <code>OrderCreated</code>, <code>PaymentApproved</code>, <code>UserRegistered</code>.<br><br><strong>Onde vivem:</strong> entities emitem eventos quando algo significativo acontece. Use cases os coletam e publicam via <code>IEventBus</code> (port na camada de aplicação).<br><br><strong>Fluxo:</strong><br>1. <code>order.approve()</code> adiciona <code>OrderApproved</code> à lista interna da entity<br>2. Use case chama <code>eventBus.publish(order.pullDomainEvents())</code><br>3. EventBus (adapter) despacha para outros bounded contexts ou módulos<br><br><strong>Ganho:</strong> módulos se comunicam sem acoplamento direto — o módulo de notificação reage a <code>OrderCreated</code> sem o módulo de pedido saber que notificação existe.',
    tip: 'Mencione o padrão pullDomainEvents() — entity acumula eventos, use case publica ao final da transação. Demonstra conhecimento de DDD tático.',
  },
  {
    level: 'Senior',
    q: 'Como enforçar a Dependency Rule automaticamente no CI?',
    a: '<strong>eslint-plugin-boundaries</strong>: plugin ESLint que bloqueia imports que violam as regras definidas.<br><br><strong>Configuração típica:</strong><br>• Define zonas: <code>domain</code>, <code>application</code>, <code>infrastructure</code>, <code>presentation</code><br>• Regras: <code>domain</code> não pode importar nada. <code>application</code> pode importar <code>domain</code>. <code>infrastructure</code> pode importar <code>application</code> e <code>domain</code>.<br>• CI falha se alguém importar infra de dentro do domínio<br><br><strong>Outros mecanismos:</strong><br>• NX workspaces com <code>@nx/enforce-module-boundaries</code> para monorepos<br>• Architectural tests com <code>ts-arch</code>: teste que falha se a dependency rule for violada<br><br>Enforçar no CI remove a dependência de revisão humana — a máquina bloqueia automaticamente.',
    tip: 'eslint-plugin-boundaries é a ferramenta do mercado. Mencionar que CI automatiza o enforcement (vs confiar em code review humano) mostra maturidade de processo.',
  },
  {
    level: 'Senior',
    q: 'Como estruturar pastas em um projeto NestJS com Clean Architecture?',
    a: '<strong>Estrutura por feature (recomendado):</strong><br><br>Por feature em vez de por camada. Cada feature é auto-contida:<br><br><code>src/order/<br>&nbsp;&nbsp;domain/<br>&nbsp;&nbsp;&nbsp;&nbsp;entities/order.entity.ts<br>&nbsp;&nbsp;&nbsp;&nbsp;value-objects/money.vo.ts<br>&nbsp;&nbsp;&nbsp;&nbsp;events/order-created.event.ts<br>&nbsp;&nbsp;application/<br>&nbsp;&nbsp;&nbsp;&nbsp;use-cases/create-order.usecase.ts<br>&nbsp;&nbsp;&nbsp;&nbsp;ports/order-repository.port.ts<br>&nbsp;&nbsp;&nbsp;&nbsp;dto/create-order.input.ts<br>&nbsp;&nbsp;infrastructure/<br>&nbsp;&nbsp;&nbsp;&nbsp;repositories/prisma-order.repository.ts<br>&nbsp;&nbsp;&nbsp;&nbsp;mappers/order-prisma.mapper.ts<br>&nbsp;&nbsp;presentation/<br>&nbsp;&nbsp;&nbsp;&nbsp;controllers/order.controller.ts<br>&nbsp;&nbsp;&nbsp;&nbsp;presenters/order.presenter.ts</code><br><br>Estrutura por camada (menos recomendado) cria pastas <code>domain/</code>, <code>application/</code>, <code>infrastructure/</code> globais — difícil de navegar em projetos grandes.',
    tip: 'Defenda estrutura por feature: agrupar por domínio facilita navigação e ownership. Cada dev sabe onde fica o código de um feature sem conhecer o sistema inteiro.',
  },
  {
    level: 'Pleno',
    q: 'O que é o padrão Presenter e como ele difere de um DTO de saída?',
    a: '<strong>DTO de saída (Output DTO)</strong>: estrutura de dados que o use case retorna. Define o contrato entre o use case e quem o chama. Agnóstico de formato de entrega.<br><br><strong>Presenter</strong>: responsável por transformar o Output DTO no formato específico de entrega. Pode haver múltiplos presenters para o mesmo use case:<br>• <code>OrderHttpPresenter</code>: transforma em JSON com os campos da API v1<br>• <code>OrderGraphQLPresenter</code>: transforma em tipo GraphQL<br>• <code>OrderCsvPresenter</code>: transforma em linha CSV<br><br>Use case retorna sempre o mesmo Output DTO — quem chama decide como apresentar.<br><br>Em projetos simples os dois colapsam: o use case retorna diretamente o que o controller serializa.',
    tip: 'A distinção prática: em projetos simples não há presenter separado. Em sistemas com múltiplos protocolos (REST + GraphQL), o presenter paga o custo.',
  },
  {
    level: 'Senior',
    q: 'Como lidar com validação em Clean Architecture? Onde colocar regras de validação?',
    a: '<strong>Dois tipos de validação com locais diferentes:</strong><br><br><strong>Validação de formato (sintaxe):</strong> valores válidos segundo o protocolo de entrada. Acontece na borda — Controller ou Input DTO com class-validator. Ex: "email deve ser string", "total deve ser número positivo".<br><br><strong>Validação de invariante de negócio:</strong> regras que existem independentemente de tecnologia. Acontece no domínio — Entity ou Value Object. Ex: "pedido aprovado não pode receber novos itens", "desconto máximo é 50%".<br><br><strong>Onde NÃO colocar:</strong> no banco de dados como constraint — isso é última linha de defesa, não validação primária. Confiar em erro de DB é tratar exceção como fluxo normal.<br><br>Use Case pode ter validação de fluxo: "usuário existe?", "produto em estoque?" — mas não de formato ou de invariante.',
    tip: 'A distinção formato vs invariante é sofisticada. Quem separa isso corretamente entende onde cada regra pertence — e evita duplicação.',
  },
  {
    level: 'Senior',
    q: 'Como integrar Clean Architecture com CQRS?',
    a: '<strong>CQRS (Command Query Responsibility Segregation)</strong>: separar operações de escrita (Commands) de leituras (Queries).<br><br><strong>Integração com Clean Arch:</strong><br>• Commands → Use Cases que modificam estado (CreateOrder, ApprovePayment). Aplicam a dependency rule completa: entities, ports, adapters.<br>• Queries → não precisam passar por todas as camadas. Podem acessar a infra diretamente (Prisma) para construir projeções eficientes. Clean Arch para queries = over-engineering em muitos casos.<br><br><strong>Padrão prático:</strong><br>• Write side: Clean Arch completo com entities ricas, domain events<br>• Read side: Query Handler vai direto ao banco com SQL otimizado ou Prisma — sem entidades, sem use case, sem mapper<br><br>Isso reduz 60% do boilerplate nas leituras sem sacrificar o isolamento nas escritas.',
    tip: 'Saber que queries podem usar infra diretamente mostra pragmatismo. CQRS resolve o over-engineering de Clean Arch em leituras.',
  },
  {
    level: 'Pleno',
    q: 'O que é o Aggregate Root em DDD e como se relaciona com Clean Architecture?',
    a: '<strong>Aggregate Root</strong>: entity que agrupa outras entities e value objects como uma unidade de consistência. É o único ponto de entrada para modificar o aggregate inteiro.<br><br><strong>Exemplo:</strong> <code>Order</code> é o aggregate root. <code>OrderItem</code> não pode ser modificado diretamente — apenas através de <code>order.addItem()</code>.<br><br><strong>Em Clean Architecture:</strong> aggregate root é uma entity (camada de domínio). Regra: repositório persiste e carrega o aggregate root inteiro — nunca <code>OrderItemRepository</code> separado.<br><br><strong>Fronteira de consistência:</strong> dentro do aggregate, consistência imediata. Entre aggregates, eventual consistency via domain events.<br><br>Clean Arch define onde vive (domínio). DDD define como se comporta (fronteiras de consistência).',
    tip: 'Mencionar "fronteira de consistência" é o que diferencia quem leu o livro de quem usa DDD de verdade.',
  },
  {
    level: 'Pleno',
    q: 'Como lidar com erros e exceções em Clean Architecture?',
    a: '<strong>Domain Exceptions</strong>: erros de regra de negócio — vivem na camada de domínio ou aplicação. Ex: <code>OrderNotPendingError</code>, <code>InsufficientStockError</code>. Não são erros técnicos — são parte do fluxo esperado.<br><br><strong>Infrastructure Exceptions</strong>: erros técnicos — vivem nos adapters. Ex: erro de conexão com banco, timeout de API externa. São capturados e traduzidos para erros de domínio quando relevante.<br><br><strong>Tratamento no controller:</strong> o controller captura domain exceptions e as mapeia para códigos HTTP corretos: <code>OrderNotPendingError → 409 Conflict</code>, <code>UserNotFoundError → 404</code>.<br><br><strong>Alternativa: Either/Result pattern</strong> em vez de throw — use case retorna <code>Result&lt;Order, OrderError&gt;</code>. Mais explícito, sem try/catch.',
    tip: 'Mencionar Either/Result como alternativa a throw mostra que você conhece padrões funcionais além do convencional.',
  },
  {
    level: 'Senior',
    q: 'Clean Architecture realmente vale o custo de boilerplate? Como você decide?',
    a: '<strong>Framework de decisão:</strong><br><br><strong>A favor (cada ponto válido = +1):</strong><br>• Regra de negócio rica e complexa<br>• Sistema com vida útil esperada de 3+ anos<br>• Time com 3+ devs que precisam trabalhar em paralelo<br>• Testes de velocidade são requisito (TDD, CI rápido)<br>• Probabilidade alta de troca de tecnologia (banco, framework)<br><br><strong>Contra:</strong><br>• CRUD simples sem regra de negócio<br>• MVP ou proof of concept<br>• Time de 1-2 devs<br>• Prazo apertado sem plano de manutenção longa<br><br><strong>Minha abordagem:</strong> comece simples. Extraia Clean Arch quando o custo de testar e mudar começar a crescer. "Você não vai precisar disso" (YAGNI) é válido — até o sistema crescer e doer.',
    tip: 'A resposta honesta "depende" com critérios explícitos é o que o entrevistador quer ouvir. Evite defender Clean Arch em qualquer contexto — isso é sinal de inexperiência.',
  },
]

// ── Dados: Cheatsheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'Entity', sig: 'class Order { private _status; approve(): void }', desc: 'Domínio puro. Invariantes encapsulados. Sem imports externos.' },
  { name: 'Value Object', sig: 'class Money { readonly amount: number; add(m: Money): Money }', desc: 'Imutável. Identidade por valor. Encapsula validação e comportamento.' },
  { name: 'Use Case', sig: 'class CreateOrderUseCase { constructor(private repo: IOrderRepository) }', desc: 'Orquestra entities. Recebe ports via DI. Sem imports de infra.' },
  { name: 'Port (Interface)', sig: 'interface IOrderRepository { save(o: Order): Promise<void> }', desc: 'Contrato definido pelo use case. Implementado pela infra.' },
  { name: 'Adapter / Repository', sig: 'class PrismaOrderRepository implements IOrderRepository', desc: 'Implementa o port usando tecnologia concreta. Contém mapper.' },
  { name: 'Controller', sig: 'async create(@Body() b: DTO) { return useCase.execute(mapper.toInput(b)) }', desc: 'Lean: só traduz HTTP → input e output → response. Sem lógica de negócio.' },
  { name: 'Mapper', sig: 'class OrderMapper { toDomain(orm: OrmEntity): Order; toPersistence(o: Order): OrmEntity }', desc: 'Converte entre formatos de camadas. Vive em Interface Adapters.' },
  { name: 'Domain Event', sig: 'class OrderCreated { constructor(readonly orderId: string, readonly at: Date) }', desc: 'Algo que aconteceu. Imutável. Desacopla bounded contexts.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true,  t: 'Dependency Rule: dependência sempre aponta para dentro' },
  { ok: true,  t: 'Entity não importa framework, ORM, HTTP ou serviço externo' },
  { ok: true,  t: 'Use Case define interfaces (ports) para tudo que precisa de fora' },
  { ok: true,  t: 'Mapper fica na camada de Interface Adapters' },
  { ok: true,  t: 'Testes de Use Case usam Fake Repositories em memória' },
  { ok: true,  t: 'Domain Exception lançada na entity, mapeada para HTTP no controller' },
  { ok: true,  t: 'eslint-plugin-boundaries para enforçar dependency rule no CI' },
  { ok: false, t: 'Use case importar Prisma, TypeORM ou pg diretamente' },
  { ok: false, t: 'Lógica de negócio (desconto, validação de invariante) no controller' },
  { ok: false, t: 'Decorator @Entity() ou @Column() na entity de domínio' },
  { ok: false, t: 'Repository retornando tipo do ORM em vez de tipo de domínio' },
  { ok: false, t: 'Entity anêmica com só getters/setters e status público mutável' },
]

const CHEATSHEET_PATTERNS: PatternItem[] = [
  { name: 'Fake Repository', code: 'class FakeOrderRepo implements IOrderRepository { orders: Order[] = [] }', desc: 'Implementa a interface usando array em memória. Testes unitários em <5ms.' },
  { name: 'Factory Method na Entity', code: 'static Order.create(userId: string, items: Item[]): Order', desc: 'Construção controlada — valida invariantes antes de criar. Nunca new Order() diretamente.' },
  { name: 'Pull Domain Events', code: 'order.approve(); eventBus.publish(order.pullDomainEvents())', desc: 'Entity acumula eventos, use case publica ao final da transação.' },
  { name: 'Result Pattern', code: 'type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }', desc: 'Alternativa a throw — use case retorna Result. Erros explícitos no tipo.' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'EUAF — As 4 camadas',
    trick: 'Entities Use-cases Adapters Frameworks',
    expansion: [
      ['E', 'Entities — regra de negócio pura, zero imports externos'],
      ['U', 'Use Cases — orquestra entities, define ports'],
      ['A', 'Adapters — traduz entre domínio e mundo (controllers, repos, mappers)'],
      ['F', 'Frameworks — detalhe plugável (Express, Prisma, AWS SDK)'],
    ],
    explanation: 'As camadas em ordem de dentro para fora. Dependência sempre vai de F para E — nunca o contrário.',
    example: 'Order.approve() = E. CreateOrderUseCase = U. PrismaOrderRepository = A. NestJS Module = F.',
    why: 'Memorizar a ordem e o que vai em cada camada é o fundamento de qualquer entrevista sobre Clean Architecture.',
  },
  {
    label: 'PORT — Padrão Port/Adapter',
    trick: 'Port define, Outside implementa, Runtime injeta, Teste troca',
    expansion: [
      ['P', 'Port (interface) — definido pela camada de aplicação (use case)'],
      ['O', 'Outside (adapter) — implementado pela camada de infra (Prisma, AWS)'],
      ['R', 'Runtime — container de DI (NestJS) injeta o adapter correto'],
      ['T', 'Teste — injeta Fake adapter em memória, roda em <5ms'],
    ],
    explanation: 'O port é o contrato. O adapter é a implementação. DI conecta os dois. O fake permite testar sem dependências externas.',
    example: 'IOrderRepository (P) → PrismaOrderRepository (O) → NestJS Module provide (R) → FakeOrderRepository no teste (T).',
    why: 'A maioria das perguntas de entrevista sobre Clean Arch testam se você entende ports/adapters na prática.',
  },
  {
    label: 'THIN — Controller lean',
    trick: 'Translate Http Input Nothing-more',
    expansion: [
      ['T', 'Translate — converte body HTTP em input do use case'],
      ['H', 'Http — lida com status codes, headers, serialização'],
      ['I', 'Input — mapeia para o DTO de entrada do use case'],
      ['N', 'Nothing more — sem lógica de negócio, sem acesso a banco'],
    ],
    explanation: 'Controller tem um papel: traduzir. Regra de negócio, validação de invariante e acesso a dados ficam fora.',
    example: 'const input = mapper.toInput(req.body); const output = await useCase.execute(input); return presenter.toHttp(output);',
    why: 'Controller gordo é o anti-pattern mais comum em entrevistas. THIN ajuda a lembrar o que não colocar no controller.',
  },
  {
    label: 'DEPENDE — Dependency Rule',
    trick: 'DEpendência Ponta ENtro, DE fora pra Entidade',
    expansion: [
      ['D', 'Dependência — source code dependency (import)'],
      ['E', 'Entidade é o núcleo — ninguém importa a Entity de fora'],
      ['P', 'Ponta sempre — para dentro, sem exceção'],
      ['E', 'Externo implementa — infra implementa interface do domínio'],
      ['N', 'Nunca — nunca importe camada mais externa de dentro'],
      ['D', 'DIP — Dependency Inversion quando precisar de fora'],
      ['E', 'Enforçar — eslint-plugin-boundaries no CI'],
    ],
    explanation: 'A regra absoluta de Clean Architecture. Se você lembrar só uma coisa: dependência aponta para dentro.',
    example: 'PrismaOrderRepository → IOrderRepository (OK). CreateOrderUseCase → PrismaClient (NUNCA).',
    why: 'A Dependency Rule é o princípio central. Qualquer entrevistador sênior vai perguntar sobre ela.',
  },
  {
    label: 'RICA — Entity rica',
    trick: 'Regras Invariantes Comportamento Acesso-controlado',
    expansion: [
      ['R', 'Regras de negócio encapsuladas na entity'],
      ['I', 'Invariantes protegidos — impossível violar de fora'],
      ['C', 'Comportamento real — order.approve(), order.addItem()'],
      ['A', 'Acesso controlado — private state, public methods'],
    ],
    explanation: 'Entity rica controla seu próprio estado. Entity anêmica expõe tudo como público e a lógica vaza para fora.',
    example: 'order.approve() lança OrderNotPendingError se inválido. Com entity anêmica: order.status = "approved" — sem proteção.',
    why: 'Entity anêmica é o erro mais citado em code reviews de Clean Arch. Reconhecer a diferença é básico de nível pleno.',
  },
]

// ── Dados: Anti-patterns PDF ──────────────────────────────────────────────────

const PDF_ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Use Case com Prisma importado',
    badDesc: 'Use case importa PrismaClient — viola Dependency Rule',
    badCode: [
      { t: 'import { PrismaClient } from "@prisma/client"', c: '#ef4444' },
      { t: 'class CreateOrderUseCase {' },
      { t: '  private prisma = new PrismaClient()' },
      { t: '  async execute(input: Input) {' },
      { t: '    return this.prisma.order.create(...)' },
      { t: '  }' },
      { t: '}' },
    ],
    goodDesc: 'Use case recebe IOrderRepository via DI — desacoplado',
    goodCode: [
      { t: 'class CreateOrderUseCase {', c: '#4ade80' },
      { t: '  constructor(' },
      { t: '    private repo: IOrderRepository  // interface', c: '#4ade80' },
      { t: '  ) {}' },
      { t: '  async execute(input: Input) {' },
      { t: '    const order = new Order(input)' },
      { t: '    await this.repo.save(order)', c: '#4ade80' },
      { t: '  }' },
      { t: '}' },
    ],
    why: 'Use case importar Prisma quebra a Dependency Rule. Teste exige banco real. Trocar ORM reescreve o use case.',
  },
  {
    title: 'Controller gordo com lógica de negócio',
    badDesc: 'Desconto calculado no controller — fora do domínio',
    badCode: [
      { t: '@Post("/orders")', c: '#ef4444' },
      { t: 'async create(@Body() body: DTO) {' },
      { t: '  const discount = body.total > 1000 ? 0.1 : 0', c: '#ef4444' },
      { t: '  const final = body.total * (1 - discount)', c: '#ef4444' },
      { t: '  return this.prisma.order.create({ data: { total: final } })' },
      { t: '}' },
    ],
    goodDesc: 'Controller lean — delega tudo ao use case',
    goodCode: [
      { t: '@Post("/orders")', c: '#4ade80' },
      { t: 'async create(@Body() body: DTO) {' },
      { t: '  const input = { userId: body.userId, total: body.total }', c: '#4ade80' },
      { t: '  const output = await this.useCase.execute(input)', c: '#4ade80' },
      { t: '  return { id: output.orderId, total: output.finalTotal }', c: '#4ade80' },
      { t: '}' },
    ],
    why: 'Lógica no controller é intestável sem subir HTTP. A regra de desconto vive no Use Case ou Entity.',
  },
  {
    title: 'Entity anêmica — sem comportamento',
    badDesc: 'Status público mutável — qualquer código viola invariante',
    badCode: [
      { t: 'class Order {', c: '#ef4444' },
      { t: '  public status: string  // mutável diretamente!', c: '#ef4444' },
      { t: '  public total: number' },
      { t: '}' },
      { t: '// Qualquer código viola o invariante:', c: '#ef4444' },
      { t: 'order.status = "approved"  // sem validação', c: '#ef4444' },
    ],
    goodDesc: 'Entity rica encapsula invariantes',
    goodCode: [
      { t: 'class Order {', c: '#4ade80' },
      { t: '  private _status: OrderStatus' },
      { t: '  approve(): void {', c: '#4ade80' },
      { t: '    if (this._status !== OrderStatus.Pending)', c: '#4ade80' },
      { t: '      throw new OrderNotPendingError()', c: '#4ade80' },
      { t: '    this._status = OrderStatus.Approved' },
      { t: '  }' },
      { t: '}' },
    ],
    why: 'Entity anêmica move lógica para fora. Qualquer código pode colocar pedido em estado inválido.',
  },
  {
    title: 'Decorator de ORM na Entity de domínio',
    badDesc: 'Entity importa TypeORM — acoplamento duro ao framework',
    badCode: [
      { t: 'import { Entity, Column } from "typeorm"', c: '#ef4444' },
      { t: '@Entity()  // decorator TypeORM na entity de domínio', c: '#ef4444' },
      { t: 'class User {' },
      { t: '  @Column()  // TypeORM aqui', c: '#ef4444' },
      { t: '  email: string' },
      { t: '}' },
    ],
    goodDesc: 'Entity de domínio pura + entity de ORM separada na infra',
    goodCode: [
      { t: '// domain/entities/user.entity.ts', c: '#4ade80' },
      { t: 'class User {  // zero imports externos', c: '#4ade80' },
      { t: '  constructor(readonly email: Email) {}' },
      { t: '}' },
      { t: '// infrastructure/persistence/user.orm-entity.ts', c: '#4ade80' },
      { t: 'import { Entity, Column } from "typeorm"' },
      { t: '@Entity() class UserOrmEntity { @Column() email: string }', c: '#4ade80' },
    ],
    why: 'Decorator de ORM acopla o domínio ao TypeORM. Trocar para Prisma exige editar entities de domínio.',
  },
  {
    title: 'God Use Case — faz tudo',
    badDesc: 'Use case com 200+ linhas, múltiplas responsabilidades',
    badCode: [
      { t: 'class ProcessOrderUseCase {', c: '#ef4444' },
      { t: '  async execute(input: any) {', c: '#ef4444' },
      { t: '    // validação de usuário, estoque, pagamento,', c: '#ef4444' },
      { t: '    // notificação, histórico, fatura, envio de email...' },
      { t: '    // 200+ linhas misturando tudo', c: '#ef4444' },
      { t: '  }' },
      { t: '}' },
    ],
    goodDesc: 'Cada use case tem uma única responsabilidade',
    goodCode: [
      { t: 'class CreateOrderUseCase { ... }    // SRP', c: '#4ade80' },
      { t: 'class ReserveStockUseCase { ... }   // separado', c: '#4ade80' },
      { t: 'class ProcessPaymentUseCase { ... } // separado', c: '#4ade80' },
      { t: 'class SendOrderEmailUseCase { ... } // separado', c: '#4ade80' },
      { t: '// Orquestração via Saga ou choreografia', c: '#4ade80' },
      { t: '// cada use case testável individualmente', c: '#4ade80' },
    ],
    why: 'God Use Case viola SRP e é impossível de testar em isolamento. Separe por responsabilidade — use Saga para coordenar.',
  },
  {
    title: 'Repository retornando tipo do ORM',
    badDesc: 'Use case recebe PrismaOrder — conhece a infra indiretamente',
    badCode: [
      { t: '// Repository retorna tipo do ORM — vazamento', c: '#ef4444' },
      { t: 'interface IOrderRepository {', c: '#ef4444' },
      { t: '  findById(id: string): Promise<PrismaOrder>  // ❌', c: '#ef4444' },
      { t: '}' },
      { t: '// Use case recebe PrismaOrder — sabe de Prisma!', c: '#ef4444' },
      { t: 'const order = await this.repo.findById(id)', c: '#ef4444' },
      { t: 'order.createdAt  // campo do Prisma, não do domínio', c: '#ef4444' },
    ],
    goodDesc: 'Repository retorna tipo de domínio — use case agnóstico de ORM',
    goodCode: [
      { t: '// Repository retorna domain entity', c: '#4ade80' },
      { t: 'interface IOrderRepository {', c: '#4ade80' },
      { t: '  findById(id: string): Promise<Order | null>  // ✅', c: '#4ade80' },
      { t: '}' },
      { t: '// Adapter faz o mapping internamente', c: '#4ade80' },
      { t: 'class PrismaOrderRepository implements IOrderRepository {', c: '#4ade80' },
      { t: '  async findById(id: string): Promise<Order | null> {' },
      { t: '    const row = await prisma.order.findUnique(...)' },
      { t: '    return row ? mapper.toDomain(row) : null', c: '#4ade80' },
      { t: '  }' },
      { t: '}' },
    ],
    why: 'Repository com tipo de ORM no contrato faz o use case conhecer Prisma indiretamente. O port deve retornar entity de domínio — o adapter faz o mapping.',
  },
]

// ── Dados: Mindmap ────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Camadas',
    color: '#455A64',
    items: [
      { t: 'Entities (domínio puro)', k: true },
      { t: 'Use Cases (orquestração)', k: true },
      { t: 'Interface Adapters (tradução)', k: true },
      { t: 'Frameworks & Drivers (borda)', k: true },
    ],
  },
  {
    label: 'Princípios',
    color: '#6366f1',
    items: [
      { t: 'Dependency Rule', k: true },
      { t: 'DIP (Dependency Inversion)', k: true },
      { t: 'SRP (Single Responsibility)', k: true },
      { t: 'ISP (Interface Segregation)', a: true },
      { t: 'OCP (Open/Closed)', a: true },
    ],
  },
  {
    label: 'Padrões táticos',
    color: '#14b8a6',
    items: [
      { t: 'Entity Rica', k: true },
      { t: 'Value Object', k: true },
      { t: 'Use Case / Interactor', k: true },
      { t: 'Port (interface)', k: true },
      { t: 'Adapter (implementação)', k: true },
      { t: 'Mapper', k: true },
      { t: 'Domain Event', a: true },
      { t: 'Aggregate Root', a: true },
    ],
  },
  {
    label: 'Testes',
    color: '#4ade80',
    items: [
      { t: 'Fake Repository (in-memory)', k: true },
      { t: 'Teste unitário de Use Case', k: true },
      { t: 'Pirâmide: unit 80% / int 15% / e2e 5%', a: true },
      { t: 'eslint-plugin-boundaries', a: true },
    ],
  },
  {
    label: 'Trade-offs',
    color: '#f59e0b',
    items: [
      { t: 'Quando usar: regra rica + 3+ anos', k: true },
      { t: 'Quando NÃO: CRUD, MVP, prazo curto', k: true },
      { t: 'CQRS: queries podem bypassar camadas', a: true },
      { t: 'Modular Monolith como primeiro passo', a: true },
    ],
  },
  {
    label: 'Relacionamentos',
    color: '#a78bfa',
    items: [
      { t: 'Hexagonal = mesma ideia (Ports & Adapters)', k: true },
      { t: 'DDD: Aggregates, Bounded Contexts', a: true },
      { t: 'CQRS + Event Sourcing', a: true },
      { t: 'Onion Architecture = variação', a: true },
    ],
  },
]

// ── Builders de PDF ───────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Clean Architecture',
    stackLabel: 'Arquitetura de Software',
  }),

  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Clean Architecture',
    accentColor: C,
    stackLabel: 'Arquitetura de Software',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'Comece sem Clean Arch — adicione quando a dor de testar crescer',
        'Estrutura por feature, não por camada — facilita navegação e ownership',
        'Use Fake Repositories para 80% dos testes — milissegundos vs segundos',
        'eslint-plugin-boundaries no CI — enforcement automático da dependency rule',
        'CQRS: queries podem ir direto ao banco — não force Clean Arch em leituras simples',
        'Comece com uma entity rica e um use case antes de criar toda a estrutura',
        'Result pattern evita try/catch implícito — erros explícitos no tipo de retorno',
        'Domain Events desacoplam bounded contexts sem precisar de message broker no MVP',
      ],
      patterns: CHEATSHEET_PATTERNS,
      mentalModels: [
        'Domínio é o coração — não conhece ninguém. O mundo externo se adapta a ele.',
        'A dependency rule é absoluta — se sentir necessidade de importar de fora para dentro, use DIP.',
        '"Faria sentido sem banco de dados?" → Entity ou Use Case. Se não → Adapter ou Framework.',
        'Boilerplate é o preço do isolamento — paga em velocidade de teste e longevidade.',
        'Entity rica = Tell, Don\'t Ask. Diga o que fazer, não pergunte o estado e decida fora.',
      ],
    },
  }),

  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Clean Architecture',
    stackLabel: 'Arquitetura de Software',
  }),

  antipatterns: () => buildAntipatternsPdf({
    antipatterns: PDF_ANTIPATTERNS,
    accentColor: C,
    skillName: 'Clean Architecture',
    stackLabel: 'Arquitetura de Software',
  }),

  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    skillName: 'Clean Architecture',
    accentColor: C,
    stackLabel: 'Arquitetura de Software',
    checklist: [
      'As 4 camadas e o que vai em cada uma (EUAF)',
      'Dependency Rule — dependência aponta para dentro',
      'Ports & Adapters — interface definida pelo use case, implementada pela infra',
      'Dependency Inversion — como usar DIP sem violar a Dependency Rule',
      'Entity rica vs anêmica — invariantes encapsulados',
      'Value Objects — imutáveis, identidade por valor',
      'Controller lean — sem lógica de negócio',
      'Fake Repository — testes unitários sem banco em <5ms',
      'Quando NÃO usar Clean Arch — CRUD, MVP, vida curta',
      'Clean Arch vs Hexagonal vs Layered MVC',
      'Domain Events — desacoplamento entre módulos',
      'CQRS — queries podem bypassar camadas',
    ],
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function CleanArchitecturePdfs() {
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
