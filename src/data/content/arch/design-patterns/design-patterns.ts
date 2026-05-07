import type { SkillContent } from '@/types'

const designPatterns: SkillContent = {
  tagline: 'Soluções recorrentes para problemas de design — vocabulário comum entre devs.',
  why: 'Design patterns aparecem em entrevista de código e arquitetura. Sênior precisa saber QUANDO usar (raro) e quando o pattern vira overkill ou anti-pattern. Decorar GoF não basta — entrevistador testa aplicação em problema real.',
  summary: 'Design patterns (Gang of Four e descendentes) são soluções reutilizáveis para problemas comuns de design OO. Três categorias: criacionais (Factory, Singleton, Builder), estruturais (Adapter, Decorator, Facade, Proxy), comportamentais (Strategy, Observer, Command, State). Útil como vocabulário de design — falar "Strategy" comunica em uma palavra. Risco: aplicar pattern por aplicar complica código simples. Aplicar bem reduz complexidade; aplicar mal aumenta.',
  keypoints: [
    { title: 'Strategy', body: 'Define família de algoritmos intercambiáveis. Use quando há múltiplas formas de fazer a mesma coisa (calcular frete, validar pagamento). Evita if/switch gigante.' },
    { title: 'Factory / Abstract Factory', body: 'Encapsula criação de objetos. Útil quando criação é complexa, depende de configuração, ou precisa abstrair tipo concreto. Em DI moderno, container resolve maior parte do caso.' },
    { title: 'Decorator', body: 'Adiciona comportamento sem modificar a classe (logging, caching, retry em handler HTTP). Combina via composição. Express middleware é exemplo clássico.' },
    { title: 'Observer / Pub-Sub', body: 'Objeto notifica observadores em mudança. Base de event-driven, UI reativa, hooks. Cuidado com leak (esquecer de remover observer).' },
    { title: 'Adapter', body: 'Traduz interface entre dois sistemas. Útil para integrar lib legada, API externa, biblioteca com interface diferente da que você quer. Em DDD, é o anti-corruption layer.' },
    { title: 'Singleton', body: 'Uma instância global. Famoso anti-pattern em código testável — esconde dependência, dificulta mock. DI container substitui melhor. Use só para recurso realmente único (logger, config).' },
    { title: 'Repository', body: 'Abstrai persistência, expõe coleção de aggregates. Permite trocar storage e testar com mock. Padrão em DDD e Clean Architecture.' },
    { title: 'Builder', body: 'Constrói objetos complexos passo a passo. Evita construtores com 10 parâmetros. Muito usado em testes (TestBuilder, Fixture) e queries complexas.' },
    { title: 'Command', body: 'Encapsula ação como objeto. Permite undo/redo, filas de execução, log de auditoria. Base de CQRS e event sourcing.' },
    { title: 'Proxy', body: 'Controla acesso a outro objeto. Usado para lazy loading, cache, controle de acesso, logging transparente. ORM faz proxy de entidades para lazy relations.' },
  ],
  gotchas: [
    'Aplicar pattern por aplicar — Factory para criar objeto trivial, Strategy com uma só estratégia, Observer para um listener só. Indireção sem ganho.',
    'Singleton em todo lugar — vira global state escondido, dificulta teste, gera bug em concorrência.',
    'Confundir pattern com framework — Repository é padrão, não precisa de generic class enorme.',
    'Combinar 5 patterns numa classe para parecer "limpo" — Factory que retorna Builder que cria Strategy via Adapter. Código vira labirinto.',
    'Ignorar idiomas da linguagem — em JS funcional, closures resolvem sem precisar Strategy formal. Em Go, interface implícita simplifica muito.',
    'Pattern Matching vs Visitor — Visitor é raramente legível em linguagens modernas que têm pattern matching ou discriminated unions.',
  ],
  interview: [
    {
      level: 'pleno',
      q: 'Quando você escolhe Strategy vs simples if/else?',
      a: '<p>Uso <strong>if/else</strong> quando: ramos são 2-3, raramente mudam, e não há comportamento complexo em cada um. Código simples ganha.</p><p>Vou para <strong>Strategy</strong> quando: há vários algoritmos (5+), eles são adicionados/trocados frequentemente, ou cada um tem complexidade significativa (e merece arquivo próprio). Strategy permite OCP — adicionar novo algoritmo sem mexer nos existentes.</p><p>Red flag: criar Strategy com uma só implementação "antecipando o futuro" é overkill especulativo.</p>',
      tip: 'Mencione o princípio OCP como motivador — não é "mais limpo", é aberto para extensão sem modificação. Dê um exemplo real: formas de pagamento (Pix, Cartão, Boleto) como estratégias.',
    },
    {
      level: 'pleno',
      q: 'Singleton é anti-pattern?',
      a: '<p>Quase sempre, em código de aplicação. <strong>Esconde dependência</strong> (a classe usa, mas não declara), dificulta teste (mock é difícil), causa bug em concorrência, vira global state mascarado.</p><p>DI container faz o trabalho melhor: cria uma instância, injeta onde precisa, mantém testável. <strong>Exceções legítimas</strong>: logger global, config readonly carregado uma vez. Mesmo nesses casos, abstração + injeção em vez de Singleton clássico é mais limpo.</p>',
      tip: 'A resposta sênior vai além de "Singleton é ruim" — explique por que DI container resolve o mesmo problema de forma superior e mencione o problema de concorrência com estado mutável.',
    },
    {
      level: 'pleno',
      q: 'Como Decorator se compara a herança?',
      a: '<p><strong>Herança</strong> adiciona comportamento estaticamente em compile-time. Rígida, gera explosão de subclasses se você quer combinar features (<code>LoggingAndCachingAndRetryingHandler</code>).</p><p><strong>Decorator</strong> adiciona em runtime via composição. Combina livremente: <code>logging(caching(retry(handler)))</code>. Cada decorator tem responsabilidade única (SRP) e você pluga conforme precisa.</p><p>HTTP middleware (Express, Koa, Nest interceptor) é Decorator pattern aplicado. NestJS <code>@UseInterceptors</code> é composição de decorators.</p>',
      tip: 'Use o princípio "Prefira composição à herança" como âncora. Concrete Example: handler de autenticação + cache + logging = 3 decorators em vez de 7 subclasses.',
    },
    {
      level: 'senior',
      q: 'Tradeoff: Repository pattern vs ORM direto?',
      a: '<p><strong>ORM direto</strong> (Prisma, TypeORM no service): rápido, menos código, ótimo para CRUD simples. Custo: regra de query espalha, troca de ORM é dolorosa, mock de teste é complicado.</p><p><strong>Repository pattern</strong>: abstrai persistência, domínio não depende de ORM, teste mocka fácil. Custo: boilerplate, risco de virar DAO disfarcado com 50 métodos custom.</p><p>Em CRUD simples, ORM direto. Em domínio rico (DDD), Repository encapsula bem o aggregate. Misturar nas camadas certas é o equilíbrio.</p>',
      tip: 'Mencione o Anti-pattern "Repository com 50 métodos" — quando você vê findByNameAndAgeGreaterThan, provavelmente a lógica deveria estar no domínio, não no repositório.',
    },
    {
      level: 'senior',
      q: 'Que pattern você considera overrated?',
      a: '<p><strong>Singleton</strong> (anti-pattern em maior parte dos casos) e <strong>Visitor</strong> (raramente legível, geralmente substituído melhor por pattern matching ou polimorfismo simples).</p><p>Também desconfio de <strong>uso excessivo de Factory</strong> em projeto Node/TS moderno — DI container e closure resolvem sem cerimônia. Pattern é ferramenta — usar com moderação e contexto.</p><p><strong>Abstract Factory</strong> frequentemente vira complexidade desnecessária — trocar implementação em runtime raramente acontece na prática.</p>',
      tip: 'A resposta demonstra maturidade: não é sobre saber todos os patterns, é sobre saber quando NÃO usar. Citar a linguagem como contexto (JavaScript vs Java) mostra consciência arquitetural.',
    },
    {
      level: 'senior',
      q: 'Como Command pattern se relaciona com CQRS e Event Sourcing?',
      a: '<p><strong>Command pattern</strong> básico: encapsula ação como objeto — <code>CreateOrderCommand</code>, <code>CancelOrderCommand</code>. Permite undo, fila de execução, log.</p><p>Em <strong>CQRS</strong>: Command é a parte de escrita — objeto imutável com intenção de mudança, despachado para handler. Separa leitura (Query) de escrita (Command) por pipeline diferente.</p><p>Em <strong>Event Sourcing</strong>: Command gera Event — <code>OrderCreatedEvent</code> — que é persistido. Estado é reconstituído reproduzindo eventos. Command pattern vira o input que dispara o pipeline inteiro.</p>',
      tip: 'Conecte os três conceitos: Command → Handler → Event → Store. Isso demonstra visão de arquitetura, não apenas o pattern isolado.',
    },
    {
      level: 'senior',
      q: 'Observer vs Pub/Sub — qual a diferença?',
      a: '<p><strong>Observer clássico</strong>: observer referencia diretamente o subject e vice-versa. Acoplamento direto — o subject conhece seus observers (lista). Síncrono por padrão. Exemplo: EventEmitter do Node.js.</p><p><strong>Pub/Sub</strong>: publisher e subscriber não se conhecem — comunicam via broker/canal intermediário. Desacoplado, assíncrono, distribuído. Exemplo: Redis Pub/Sub, RabbitMQ, evento de DOM.</p><p>Prático: Observer para state management local (store → components), Pub/Sub para comunicação entre serviços ou componentes distantes.</p>',
      tip: 'O detalhe que diferencia a resposta sênior: mencionar que Pub/Sub introduz latência e complexidade de infra, enquanto Observer é mais simples mas cria acoplamento. Trade-off real.',
    },
    {
      level: 'pleno',
      q: 'Como o pattern Adapter é usado em DDD como Anti-Corruption Layer?',
      a: '<p>Em DDD, o Anti-Corruption Layer (ACL) é um Adapter que traduz entre o modelo do domínio e um modelo externo (API legada, sistema de terceiros).</p><p>Sem ACL: conceitos externos contaminam o domínio — entidade <code>Pedido</code> começa a ter campos que fazem sentido só para a API do fornecedor. Com ACL: Adapter traduz <code>SupplierOrderDTO → DomainOrder</code>, isolando o domínio de mudanças externas.</p><p>Implementação: interface de porta no domínio (<code>IOrderGateway</code>), implementação no adapter com ORM/HTTP do sistema externo. Inversão de dependência + Adapter.</p>',
      tip: 'Mencione o problema sem ACL: "corruption" não é palavra aleatória — sem o layer, o modelo do domínio fica corrompido por terminologia e estrutura do sistema externo.',
    },
    {
      level: 'senior',
      q: 'Proxy pattern: onde você usa na prática?',
      a: '<p><strong>Lazy loading</strong>: ORM cria proxy de entidade para carregar relações só quando acessadas. TypeORM/Hibernate fazem isso com <code>Lazy</code>.</p><p><strong>Cache proxy</strong>: wrapper que primeiro consulta cache, chama o real só no miss. Transparente para o consumidor.</p><p><strong>Logging/Monitoring</strong>: proxy que loga chamadas ao serviço real sem modificar o serviço. Útil para métricas de terceiros.</p><p><strong>Access control</strong>: proxy que verifica permissão antes de delegar. Diferente de Guard (que é protocolo-level) — proxy atua em nível de objeto.</p>',
      tip: 'Mencione que Proxy (estrutural) é diferente de Decorator (também estrutural) em intenção: Proxy controla acesso, Decorator adiciona comportamento. Entrevistador que conhece GoF vai testar essa distinção.',
    },
    {
      level: 'pleno',
      q: 'Quando usar Builder vs construtor com parâmetros opcionais?',
      a: '<p><strong>Construtor com parâmetros opcionais</strong>: suficiente para objetos simples com poucos campos. TypeScript + interface é mais direto.</p><p><strong>Builder</strong> se justifica quando: objeto tem muitos campos opcionais (8+), validação de combinações é necessária (campo A obriga campo B), ou o objeto é imutável após construção e precisa de validação antes de criar.</p><p>Uso mais comum em testes: <code>UserBuilder.withEmail("x").withRole("admin").build()</code>. Facilita criação de fixtures sem parâmetros irrelevantes para o teste.</p><p>Alternativa moderna: objeto de configuração com <code>Partial&lt;Config&gt;</code> + defaults via spread.</p>',
      tip: 'O caso de uso de teste (Test Data Builder) é o mais prático e sênior vai reconhecer. Mencionar o problema de "telescoping constructor" (construtor com 10 params) explica a motivação original do GoF.',
    },
    {
      level: 'senior',
      q: 'Como você testa código que usa design patterns sem acoplar o teste à implementação?',
      a: '<p>O risco é testar o <em>pattern</em> em vez do <em>comportamento</em>. Soluções:</p><ul><li><strong>Strategy</strong>: teste cada estratégia isoladamente + teste o contexto com estratégia fake. Não teste se a estratégia foi chamada — teste o resultado.</li><li><strong>Observer</strong>: teste que o evento foi emitido, não que o observer específico foi registrado.</li><li><strong>Factory</strong>: teste o que a factory produz, não como produz. Interface/tipo é o contrato.</li><li><strong>Decorator</strong>: teste o comportamento composto, não cada decorator individualmente (exceto se têm lógica complexa).</li></ul><p>Regra geral: <strong>teste o contrato (interface), não a implementação (como a interface é satisfeita).</strong></p>',
      tip: 'A pergunta sobre teste é a que mais separa sênior de pleno em design patterns. A resposta errada é descrever como fazer mock de cada classe interna — isso cria testes frágeis.',
    },
    {
      level: 'senior',
      q: 'Facade vs Adapter — qual a diferença?',
      a: '<p><strong>Adapter</strong>: faz uma interface funcionar como outra que o cliente espera. Um-para-um. O adapter <em>traduz</em>.</p><p><strong>Facade</strong>: simplifica um subsistema complexo atrás de interface única. Muitos-para-um. A facade <em>esconde complexidade</em>.</p><p>Exemplo prático: biblioteca de envio de e-mail tem 15 classes e configurações — Facade expõe <code>emailService.send(to, subject, body)</code>. Adapter seria necessário se você quer trocar Nodemailer por SendGrid sem mudar o resto do código.</p><p>Facade não é sobre compatibilidade — é sobre conveniência e isolamento de complexidade interna.</p>',
      tip: 'A distinção GoF: Adapter = compatibilidade de interface; Facade = simplificação de subsistema. Ambos são "wrappers" mas com intenções diferentes.',
    },
    {
      level: 'pleno',
      q: 'Quando Chain of Responsibility é preferível a uma série de if/else?',
      a: '<p><strong>Chain of Responsibility</strong> é preferível quando: cada handler tem lógica não-trivial, handlers são configurados/ordenados dinamicamente, novos handlers são adicionados sem mudar o fluxo principal.</p><p>Exemplos reais: pipeline de middleware Express (cada middleware decide passar ou responder), validações encadeadas (cada validator verifica uma regra e passa se ok), pipeline de transformação de dados.</p><p>O if/else serial é mais legível para 3-4 condições simples. Chain of Responsibility escala melhor mas adiciona indireção — use quando a escalabilidade justifica.</p>',
      tip: 'Express middleware é o exemplo mais convincente: <code>app.use(cors(), helmet(), rateLimit(), auth, handler)</code> — cada middleware é um handler na chain.',
    },
    {
      level: 'senior',
      q: 'Template Method vs Strategy — quando cada um?',
      a: '<p><strong>Template Method</strong> (herança): define o esqueleto do algoritmo na classe base com "slots" abstratos para partes variáveis. Variação via subclasse. Risco: explosão de subclasses, acoplamento via herança.</p><p><strong>Strategy</strong> (composição): algoritmo inteiro é substituível. Variação via composição/injeção. Mais flexível, mais testável.</p><p>Regra prática: Template Method quando o invariante (estrutura) é mais importante que o variante (partes). Strategy quando o algoritmo todo varia e você quer composição.</p><p>Tendência moderna: Strategy via função de primeira classe em vez de interface formal — <code>processOrder(calculateTax: TaxStrategy)</code> pode ser simplesmente uma função.</p>',
      tip: 'Mencionar funções de primeira classe como "Strategy sem cerimônia" demonstra entendimento de que patterns são soluções para problemas de linguagem — em linguagens funcionais, muitos GoF patterns se dissolvem.',
    },
    {
      level: 'senior',
      q: 'O que é o pattern Null Object e quando ele evita verificações de null?',
      a: '<p>Null Object implementa a interface com comportamento neutro/vazio. Em vez de verificar <code>if (logger !== null) logger.log()</code> em todo lugar, você injeta um <code>NullLogger</code> que não faz nada.</p><p>Casos de uso: logger opcional (ambiente de teste vs produção), feature flag desabilitada (NullNotifier), permissão negada (NullPolicy que bloqueia tudo).</p><p>Vantagem: elimina verificações de null espalhadas. Desvantagem: pode mascarar bugs — se o objeto real deveria estar presente mas não está, o Null Object silencia o problema.</p>',
      tip: 'O risco de mascarar bugs é o que separa a resposta sênior: Null Object é útil para comportamento opcional intencional, não para esconder erros de configuração.',
    },
    {
      level: 'pleno',
      q: 'Como State pattern se diferencia de State Machine?',
      a: '<p><strong>State pattern</strong> (GoF): objeto delega comportamento para objeto de estado atual. Estado muda o comportamento sem if/else — polimorfismo. Implementação OO de máquina de estados.</p><p><strong>State Machine</strong>: modelo formal de estados, transições e eventos. Pode ser implementada com State pattern, switch/case, biblioteca (XState), ou tabela de transições.</p><p>State pattern é uma implementação possível de state machine. State machine é o conceito — State pattern é o como. Para estados simples (3-5), switch pode ser mais legível. Para estados complexos com guards e ações, XState ou State pattern escalam melhor.</p>',
      tip: 'Mencionar XState como alternativa moderna demonstra que você conhece o espaço além do GoF clássico.',
    },
    {
      level: 'senior',
      q: 'Como você decide se um problema pede um pattern ou uma solução mais simples?',
      a: '<p>Processo de decisão:</p><ul><li><strong>Existe o problema agora?</strong> Se não, YAGNI — não introduza pattern antecipando complexidade futura.</li><li><strong>O código atual está difícil de modificar/testar?</strong> Se não, está simples o suficiente.</li><li><strong>A indireção paga a dívida?</strong> Cada pattern adiciona uma camada — ela precisa ser justificada pelo problema que resolve.</li><li><strong>A equipe conhece o pattern?</strong> Pattern desconhecido pela equipe é complexidade, não solução.</li></ul><p>Heurística: se você precisa comentar "aqui apliquei Strategy porque...", talvez o nome da classe já devesse comunicar isso.</p>',
      tip: 'A resposta mais sênior possível: o melhor pattern é o mais simples que resolve o problema. Demonstra que você usa patterns como ferramenta, não como demonstração de conhecimento.',
    },
    {
      level: 'senior',
      q: 'Como patterns criacionais diferem em cenários com DI Container?',
      a: '<p>Em projetos com DI Container (Spring, NestJS, Inversify):</p><ul><li><strong>Singleton</strong>: resolvido pelo container — <code>@Injectable()</code> padrão já é singleton por módulo. Não implemente manualmente.</li><li><strong>Factory</strong>: use <code>useFactory</code> no container para criação condicional ou assíncrona. Container é a Factory.</li><li><strong>Abstract Factory</strong>: raramente necessário — container + tokens de injeção resolvem a maioria dos casos de troca de implementação.</li><li><strong>Builder</strong>: ainda útil para objetos de valor/domínio que não são providers — DTOs de teste, Value Objects complexos.</li></ul><p>Regra: em aplicação com DI Container, prefira tokens e providers à instância manual de patterns criacionais.</p>',
      tip: 'Conectar patterns GoF com a realidade de frameworks modernos demonstra experiência prática — não é sobre decorar GoF, é sobre resolver o problema com a ferramenta certa do contexto.',
    },
    {
      level: 'pleno',
      q: 'O que é o pattern Event Aggregator e quando ele evita acoplamento?',
      a: '<p>Event Aggregator é um mediador central de eventos — componentes publicam e assinam eventos sem se conhecer diretamente. É Pub/Sub em nível de aplicação local.</p><p>Exemplos: Redux store (componentes despacham actions, outros componentes reagem), EventBus de Vue.js (legado), EventEmitter central em NestJS.</p><p>Evita acoplamento quando: componentes distantes na árvore precisam se comunicar, ação em A precisa trigger em B sem que A conheça B.</p><p>Risco: eventos se tornam contratos implícitos — difícil rastrear quem publica/assina, debugging vira caçada. Não use para comunicação que seria mais clara como chamada direta.</p>',
      tip: 'Mencionar o risco de debugging — o rastreamento de "quem disparou este evento" é o pain point real de Event Aggregator mal usado.',
    },
    {
      level: 'senior',
      q: 'Como o pattern Iterator é usado em JavaScript moderno?',
      a: '<p>JavaScript tem protocolo de iteração nativo (<code>Symbol.iterator</code>, <code>Symbol.asyncIterator</code>). Qualquer objeto que implemente o protocolo funciona com <code>for...of</code>, spread (<code>...</code>), destructuring, <code>Array.from()</code>.</p><p>Generators como iterators: <code>function* range(start, end)</code> implementa iterator sem objeto explícito. Lazy — cada valor é gerado sob demanda.</p><p>Async iterators: <code>for await...of</code> para streams, paginação de API (<code>async *paginate(url)</code>), processamento de Kafka/RabbitMQ mensagem a mensagem.</p><p>Iterator pattern no GoF virou protocolo de linguagem no JS moderno — você o usa todo dia com <code>for...of</code>.</p>',
      tip: 'Async iterators para paginação é o exemplo mais prático e moderno. Demonstra que você conhece além do GoF clássico — patterns evoluíram com as linguagens.',
    },
    {
      level: 'senior',
      q: 'Memento pattern — quando e como aplicar para undo/redo?',
      a: '<p>Memento captura e externaliza o estado interno de um objeto sem violar encapsulamento. O objeto sabe como salvar e restaurar seu próprio estado; quem gerencia o histórico não sabe o que está dentro.</p><p>Implementação: <code>originator.save() → Memento</code>, <code>originator.restore(memento)</code>. Stack de mementos no Caretaker para undo/redo.</p><p>Usos reais: editor de texto (Ctrl+Z), editor de diagrama, transação de banco local, <code>git stash</code> no nível de domínio.</p><p>Custo: memória — cada memento captura estado completo. Para objetos grandes, use snapshot incremental (só o diff) ou event sourcing (reconstrua o estado reproduzindo eventos).</p>',
      tip: 'O trade-off de memória vs imutabilidade é a resposta sênior. Event Sourcing como alternativa demonstra visão ampla.',
    },
    {
      level: 'pleno',
      q: 'O que são anti-patterns e cite 3 clássicos?',
      a: '<p>Anti-pattern é uma solução que parece razoável, é usada com frequência, mas tem consequências negativas previsíveis.</p><ul><li><strong>God Object</strong>: classe que sabe/faz tudo. Viola SRP. Atrai ainda mais responsabilidades. Sintoma: classe com 30+ métodos e 500+ linhas.</li><li><strong>Shotgun Surgery</strong>: uma mudança exige modificar muitas classes. Sintoma de baixa coesão e alto acoplamento.</li><li><strong>Cargo Cult Pattern</strong>: aplicar pattern sem entender o problema que ele resolve — Factory para tudo, Singleton "porque é elegante". Indireção sem propósito.</li><li><strong>Anemic Domain Model</strong>: entidades com só getters/setters, sem comportamento. Toda a lógica no service. Parece OO, é procedural.</li></ul>',
      tip: 'Anemic Domain Model é o anti-pattern mais cobrado em contexto de DDD — é a violação mais comum e sutil. Prepare um exemplo de OrderService com 200 linhas de lógica que deveria estar na entidade Order.',
    },
  ],
  diagrams: [
    {
      title: 'Os 3 grupos GoF — mapa mental de categorias',
      html: `<style>
.dp-map { font-family: system-ui; padding: 20px; background: #0f172a; border-radius: 12px; color: #e2e8f0; }
.dp-map-title { text-align: center; font-size: 18px; font-weight: 700; color: #0ea5e9; margin-bottom: 20px; }
.dp-groups { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.dp-group { background: #1e293b; border-radius: 10px; padding: 16px; border-top: 3px solid; }
.dp-group.criacional { border-color: #f59e0b; }
.dp-group.estrutural { border-color: #8b5cf6; }
.dp-group.comportamental { border-color: #10b981; }
.dp-group-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
.dp-group.criacional .dp-group-label { color: #f59e0b; }
.dp-group.estrutural .dp-group-label { color: #8b5cf6; }
.dp-group.comportamental .dp-group-label { color: #10b981; }
.dp-group-desc { font-size: 11px; color: #64748b; margin-bottom: 10px; }
.dp-item { font-size: 12px; background: #0f172a; padding: 5px 8px; border-radius: 5px; margin-bottom: 4px; color: #cbd5e1; display: flex; justify-content: space-between; }
.dp-item-tag { font-size: 10px; color: #475569; }
</style>
<div class="dp-map">
  <div class="dp-map-title">Design Patterns — Gang of Four</div>
  <div class="dp-groups">
    <div class="dp-group criacional">
      <div class="dp-group-label">Criacionais</div>
      <div class="dp-group-desc">Como criar objetos</div>
      <div class="dp-item">Factory Method <span class="dp-item-tag">★★★</span></div>
      <div class="dp-item">Abstract Factory <span class="dp-item-tag">★★</span></div>
      <div class="dp-item">Builder <span class="dp-item-tag">★★★</span></div>
      <div class="dp-item">Prototype <span class="dp-item-tag">★</span></div>
      <div class="dp-item">Singleton <span class="dp-item-tag">⚠️</span></div>
    </div>
    <div class="dp-group estrutural">
      <div class="dp-group-label">Estruturais</div>
      <div class="dp-group-desc">Como compor objetos</div>
      <div class="dp-item">Adapter <span class="dp-item-tag">★★★</span></div>
      <div class="dp-item">Decorator <span class="dp-item-tag">★★★</span></div>
      <div class="dp-item">Facade <span class="dp-item-tag">★★★</span></div>
      <div class="dp-item">Proxy <span class="dp-item-tag">★★★</span></div>
      <div class="dp-item">Bridge / Composite / Flyweight <span class="dp-item-tag">★</span></div>
    </div>
    <div class="dp-group comportamental">
      <div class="dp-group-label">Comportamentais</div>
      <div class="dp-group-desc">Como objetos comunicam</div>
      <div class="dp-item">Strategy <span class="dp-item-tag">★★★</span></div>
      <div class="dp-item">Observer <span class="dp-item-tag">★★★</span></div>
      <div class="dp-item">Command <span class="dp-item-tag">★★★</span></div>
      <div class="dp-item">State <span class="dp-item-tag">★★</span></div>
      <div class="dp-item">Template Method / Iterator / Chain... <span class="dp-item-tag">★★</span></div>
    </div>
  </div>
  <div style="text-align:center;font-size:11px;color:#475569;margin-top:12px;">★★★ muito cobrado em entrevista &nbsp;|&nbsp; ⚠️ anti-pattern na maioria dos casos</div>
</div>`,
    },
    {
      title: 'Strategy vs State vs Template Method — quando cada um?',
      html: `<style>
.dp-dec { font-family: system-ui; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.dp-dec-title { font-size: 16px; font-weight: 700; color: #0ea5e9; margin-bottom: 16px; }
.dp-dec-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.dp-dec-card { background: #1e293b; border-radius: 8px; padding: 14px; }
.dp-dec-name { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
.dp-dec-card:nth-child(1) .dp-dec-name { color: #0ea5e9; }
.dp-dec-card:nth-child(2) .dp-dec-name { color: #f59e0b; }
.dp-dec-card:nth-child(3) .dp-dec-name { color: #8b5cf6; }
.dp-dec-mechanic { font-size: 11px; color: #94a3b8; margin-bottom: 10px; font-style: italic; }
.dp-dec-when { font-size: 12px; color: #cbd5e1; }
.dp-dec-when li { margin-bottom: 4px; padding-left: 4px; }
.dp-dec-ex { font-size: 11px; color: #64748b; margin-top: 8px; border-top: 1px solid #334155; padding-top: 8px; }
</style>
<div class="dp-dec">
  <div class="dp-dec-title">Strategy × State × Template Method</div>
  <div class="dp-dec-row">
    <div class="dp-dec-card">
      <div class="dp-dec-name">Strategy</div>
      <div class="dp-dec-mechanic">Composição — injete o algoritmo</div>
      <ul class="dp-dec-when">
        <li>Algoritmo intercambiável em runtime</li>
        <li>Múltiplas variações independentes</li>
        <li>Teste de cada variação isolado</li>
        <li>Algoritmo pode ser função simples</li>
      </ul>
      <div class="dp-dec-ex">Ex: formas de pagamento, algoritmos de sorting, cálculo de frete</div>
    </div>
    <div class="dp-dec-card">
      <div class="dp-dec-name">State</div>
      <div class="dp-dec-mechanic">Polimorfismo — objeto delega ao estado</div>
      <ul class="dp-dec-when">
        <li>Comportamento muda com estado interno</li>
        <li>Transições de estado são o negócio</li>
        <li>if/else com muito estado interno</li>
        <li>Máquina de estados formal</li>
      </ul>
      <div class="dp-dec-ex">Ex: pedido (criado→pago→enviado), conexão TCP, semáforo</div>
    </div>
    <div class="dp-dec-card">
      <div class="dp-dec-name">Template Method</div>
      <div class="dp-dec-mechanic">Herança — subclasse preenche slots</div>
      <ul class="dp-dec-when">
        <li>Estrutura fixa, partes variáveis</li>
        <li>Invariante importante, variante secundário</li>
        <li>Poucos pontos de extensão</li>
        <li>Subclasses especializadas fazem sentido</li>
      </ul>
      <div class="dp-dec-ex">Ex: importador de arquivo (parse fixo, transform variável)</div>
    </div>
  </div>
</div>`,
    },
    {
      title: 'Decorator vs Herança — composição na prática',
      html: `<style>
.dp-comp { font-family: system-ui; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.dp-comp-title { font-size: 16px; font-weight: 700; color: #0ea5e9; margin-bottom: 16px; }
.dp-comp-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.dp-comp-col h4 { font-size: 13px; margin-bottom: 10px; }
.dp-comp-col.bad h4 { color: #ef4444; }
.dp-comp-col.good h4 { color: #22c55e; }
.dp-comp-box { background: #1e293b; border-radius: 8px; padding: 12px; font-size: 11px; font-family: monospace; color: #cbd5e1; line-height: 1.6; border-left: 3px solid; }
.dp-comp-col.bad .dp-comp-box { border-color: #ef4444; }
.dp-comp-col.good .dp-comp-box { border-color: #22c55e; }
.dp-comp-label { font-size: 11px; color: #64748b; margin-top: 8px; }
.dp-comp-chain { display: flex; gap: 6px; align-items: center; margin-top: 14px; flex-wrap: wrap; }
.dp-comp-chip { background: #1e293b; border: 1px solid #0ea5e9; border-radius: 20px; padding: 4px 10px; font-size: 11px; color: #7dd3fc; }
.dp-comp-arrow { color: #0ea5e9; font-size: 14px; }
</style>
<div class="dp-comp">
  <div class="dp-comp-title">Herança vs Composição via Decorator</div>
  <div class="dp-comp-cols">
    <div class="dp-comp-col bad">
      <h4>❌ Herança — explosão de subclasses</h4>
      <div class="dp-comp-box">Handler<br>├── LoggingHandler<br>├── CachingHandler<br>├── RetryingHandler<br>├── LoggingCachingHandler<br>├── LoggingRetryingHandler<br>├── CachingRetryingHandler<br>└── LoggingCachingRetryingHandler<br><br>// 7 classes para 3 comportamentos</div>
      <div class="dp-comp-label">Combinatório: N features = 2^N subclasses</div>
    </div>
    <div class="dp-comp-col good">
      <h4>✅ Decorator — composição livre</h4>
      <div class="dp-comp-box">class LoggingDecorator implements Handler {<br>  constructor(private inner: Handler) {}<br>  handle(req) {<br>    log(req);<br>    return this.inner.handle(req);<br>  }<br>}</div>
      <div class="dp-comp-label">3 decorators = qualquer combinação</div>
    </div>
  </div>
  <div class="dp-comp-chain">
    <div class="dp-comp-chip">logging()</div>
    <div class="dp-comp-arrow">→</div>
    <div class="dp-comp-chip">caching()</div>
    <div class="dp-comp-arrow">→</div>
    <div class="dp-comp-chip">retry()</div>
    <div class="dp-comp-arrow">→</div>
    <div class="dp-comp-chip">realHandler</div>
    <span style="color:#64748b;font-size:11px;margin-left:8px;">compõe na ordem que precisar</span>
  </div>
</div>`,
    },
    {
      title: 'Observer vs Pub/Sub — acoplamento e escala',
      html: `<style>
.dp-obs { font-family: system-ui; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.dp-obs-title { font-size: 16px; font-weight: 700; color: #0ea5e9; margin-bottom: 16px; }
.dp-obs-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.dp-obs-card { background: #1e293b; border-radius: 8px; padding: 14px; }
.dp-obs-card h4 { font-size: 14px; font-weight: 700; margin-bottom: 10px; }
.dp-obs-card:nth-child(1) h4 { color: #f59e0b; }
.dp-obs-card:nth-child(2) h4 { color: #22c55e; }
.dp-obs-row2 { display: flex; justify-content: space-between; margin-top: 4px; }
.dp-obs-prop { font-size: 11px; color: #94a3b8; }
.dp-obs-val { font-size: 11px; }
.dp-obs-diagram { background: #0f172a; border-radius: 6px; padding: 10px; font-size: 11px; font-family: monospace; margin-top: 10px; line-height: 1.8; }
</style>
<div class="dp-obs">
  <div class="dp-obs-title">Observer (local) vs Pub/Sub (distribuído)</div>
  <div class="dp-obs-row">
    <div class="dp-obs-card">
      <h4>Observer (GoF)</h4>
      <div class="dp-obs-row2"><span class="dp-obs-prop">Acoplamento</span><span class="dp-obs-val" style="color:#ef4444">Direto — subject conhece observers</span></div>
      <div class="dp-obs-row2"><span class="dp-obs-prop">Execução</span><span class="dp-obs-val">Síncrono por padrão</span></div>
      <div class="dp-obs-row2"><span class="dp-obs-prop">Escopo</span><span class="dp-obs-val">In-process / local</span></div>
      <div class="dp-obs-row2"><span class="dp-obs-prop">Exemplo</span><span class="dp-obs-val">EventEmitter, hooks React</span></div>
      <div class="dp-obs-diagram">subject.subscribe(observer)<br>subject.notify() → observer.update()</div>
    </div>
    <div class="dp-obs-card">
      <h4>Pub/Sub</h4>
      <div class="dp-obs-row2"><span class="dp-obs-prop">Acoplamento</span><span class="dp-obs-val" style="color:#22c55e">Indireto — via broker</span></div>
      <div class="dp-obs-row2"><span class="dp-obs-prop">Execução</span><span class="dp-obs-val">Assíncrono, distribuível</span></div>
      <div class="dp-obs-row2"><span class="dp-obs-prop">Escopo</span><span class="dp-obs-val">Cross-process / rede</span></div>
      <div class="dp-obs-row2"><span class="dp-obs-prop">Exemplo</span><span class="dp-obs-val">Redis Pub/Sub, RabbitMQ</span></div>
      <div class="dp-obs-diagram">publisher → broker → subscriber<br>publisher não sabe quem assina</div>
    </div>
  </div>
</div>`,
    },
  ],
  cheatsheet: {
    title: 'Design Patterns — Referência rápida GoF',
    html: `<style>
.dp-cs { font-family: system-ui; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 12px; font-size: 12px; }
.dp-cs-section { margin-bottom: 16px; }
.dp-cs-h { font-size: 13px; font-weight: 700; color: #0ea5e9; border-bottom: 1px solid #1e293b; padding-bottom: 4px; margin-bottom: 8px; }
.dp-cs-grid { display: grid; grid-template-columns: 120px 1fr 1fr; gap: 4px; }
.dp-cs-grid-hd { font-size: 11px; color: #64748b; font-weight: 700; padding: 2px 6px; }
.dp-cs-row { display: contents; }
.dp-cs-cell { padding: 4px 8px; background: #1e293b; border-radius: 4px; line-height: 1.4; }
.dp-cs-cell:first-child { color: #7dd3fc; font-weight: 600; }
.dp-cs-warn { color: #ef4444; font-size: 11px; margin-top: 6px; }
.dp-cs-tip { background: #1e3a2a; border-left: 3px solid #22c55e; padding: 8px 12px; border-radius: 4px; font-size: 11px; color: #86efac; margin-top: 8px; }
</style>
<div class="dp-cs">
  <div class="dp-cs-section">
    <div class="dp-cs-h">Criacionais</div>
    <div class="dp-cs-grid">
      <div class="dp-cs-grid-hd">Pattern</div><div class="dp-cs-grid-hd">Problema</div><div class="dp-cs-grid-hd">Quando usar</div>
      <div class="dp-cs-row"><div class="dp-cs-cell">Factory Method</div><div class="dp-cs-cell">Subclasse decide qual objeto criar</div><div class="dp-cs-cell">Criação varia por subclasse/context</div></div>
      <div class="dp-cs-row"><div class="dp-cs-cell">Builder</div><div class="dp-cs-cell">Objeto complexo passo a passo</div><div class="dp-cs-cell">Muitos parâmetros opcionais, imutável</div></div>
      <div class="dp-cs-row"><div class="dp-cs-cell">Singleton ⚠️</div><div class="dp-cs-cell">Uma instância global</div><div class="dp-cs-cell">Config readonly — DI container preferível</div></div>
    </div>
  </div>
  <div class="dp-cs-section">
    <div class="dp-cs-h">Estruturais</div>
    <div class="dp-cs-grid">
      <div class="dp-cs-grid-hd">Pattern</div><div class="dp-cs-grid-hd">Problema</div><div class="dp-cs-grid-hd">Quando usar</div>
      <div class="dp-cs-row"><div class="dp-cs-cell">Adapter</div><div class="dp-cs-cell">Interface incompatível</div><div class="dp-cs-cell">Integrar lib legada, ACL em DDD</div></div>
      <div class="dp-cs-row"><div class="dp-cs-cell">Decorator</div><div class="dp-cs-cell">Adicionar comportamento</div><div class="dp-cs-cell">Logging, cache, retry — composição livre</div></div>
      <div class="dp-cs-row"><div class="dp-cs-cell">Facade</div><div class="dp-cs-cell">Simplificar subsistema</div><div class="dp-cs-cell">Esconder complexidade de lib/módulo</div></div>
      <div class="dp-cs-row"><div class="dp-cs-cell">Proxy</div><div class="dp-cs-cell">Controlar acesso</div><div class="dp-cs-cell">Lazy load, cache, access control</div></div>
    </div>
  </div>
  <div class="dp-cs-section">
    <div class="dp-cs-h">Comportamentais</div>
    <div class="dp-cs-grid">
      <div class="dp-cs-grid-hd">Pattern</div><div class="dp-cs-grid-hd">Problema</div><div class="dp-cs-grid-hd">Quando usar</div>
      <div class="dp-cs-row"><div class="dp-cs-cell">Strategy</div><div class="dp-cs-cell">Algoritmo intercambiável</div><div class="dp-cs-cell">Múltiplas variações, OCP</div></div>
      <div class="dp-cs-row"><div class="dp-cs-cell">Observer</div><div class="dp-cs-cell">Notificar interessados</div><div class="dp-cs-cell">Event-driven, UI reativa</div></div>
      <div class="dp-cs-row"><div class="dp-cs-cell">Command</div><div class="dp-cs-cell">Ação como objeto</div><div class="dp-cs-cell">Undo/redo, fila, CQRS</div></div>
      <div class="dp-cs-row"><div class="dp-cs-cell">State</div><div class="dp-cs-cell">Comportamento por estado</div><div class="dp-cs-cell">Máquina de estados, fluxos complexos</div></div>
      <div class="dp-cs-row"><div class="dp-cs-cell">Chain of Resp.</div><div class="dp-cs-cell">Pipeline de handlers</div><div class="dp-cs-cell">Middleware, validações encadeadas</div></div>
    </div>
  </div>
  <div class="dp-cs-tip">Regra de ouro: use o pattern mais simples que resolve o problema. Cada camada de indireção precisa pagar sua dívida com o problema que resolve.</div>
</div>`,
  },
  mindmap: {
    title: 'Design Patterns — Mapa mental completo',
    html: `<style>
.dp-mm { font-family: system-ui; background: #0f172a; border-radius: 12px; padding: 24px; color: #e2e8f0; }
.dp-mm-center { text-align: center; margin-bottom: 20px; }
.dp-mm-title { font-size: 18px; font-weight: 800; color: #0ea5e9; }
.dp-mm-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
.dp-mm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.dp-mm-card { background: #1e293b; border-radius: 10px; padding: 14px; border-left: 4px solid; }
.dp-mm-card-title { font-size: 13px; font-weight: 700; margin-bottom: 10px; }
.dp-mm-item { font-size: 11px; color: #94a3b8; padding: 3px 0; border-bottom: 1px solid #0f172a; display: flex; justify-content: space-between; }
.dp-mm-item span { color: #64748b; font-size: 10px; }
</style>
<div class="dp-mm">
  <div class="dp-mm-center">
    <div class="dp-mm-title">Design Patterns</div>
    <div class="dp-mm-sub">Gang of Four + patterns modernos</div>
  </div>
  <div class="dp-mm-grid">
    <div class="dp-mm-card" style="border-color:#f59e0b">
      <div class="dp-mm-card-title" style="color:#f59e0b">Criacionais — Como criar</div>
      <div class="dp-mm-item">Factory Method <span>subclasse escolhe</span></div>
      <div class="dp-mm-item">Abstract Factory <span>família de objetos</span></div>
      <div class="dp-mm-item">Builder <span>passo a passo</span></div>
      <div class="dp-mm-item">Prototype <span>clone</span></div>
      <div class="dp-mm-item">Singleton ⚠️ <span>uma instância — cuidado</span></div>
    </div>
    <div class="dp-mm-card" style="border-color:#8b5cf6">
      <div class="dp-mm-card-title" style="color:#8b5cf6">Estruturais — Como compor</div>
      <div class="dp-mm-item">Adapter <span>traduz interface</span></div>
      <div class="dp-mm-item">Decorator <span>adiciona comportamento</span></div>
      <div class="dp-mm-item">Facade <span>simplifica subsistema</span></div>
      <div class="dp-mm-item">Proxy <span>controla acesso</span></div>
      <div class="dp-mm-item">Composite <span>árvore de objetos</span></div>
    </div>
    <div class="dp-mm-card" style="border-color:#10b981">
      <div class="dp-mm-card-title" style="color:#10b981">Comportamentais — Como comunicam</div>
      <div class="dp-mm-item">Strategy <span>algoritmo intercambiável</span></div>
      <div class="dp-mm-item">Observer <span>notificação de mudança</span></div>
      <div class="dp-mm-item">Command <span>ação como objeto</span></div>
      <div class="dp-mm-item">State <span>comportamento por estado</span></div>
      <div class="dp-mm-item">Template Method <span>esqueleto + hooks</span></div>
      <div class="dp-mm-item">Chain of Resp. <span>pipeline de handlers</span></div>
      <div class="dp-mm-item">Iterator <span>percorrer coleção</span></div>
    </div>
    <div class="dp-mm-card" style="border-color:#0ea5e9">
      <div class="dp-mm-card-title" style="color:#0ea5e9">Patterns modernos / Enterprise</div>
      <div class="dp-mm-item">Repository <span>abstrai persistência</span></div>
      <div class="dp-mm-item">Unit of Work <span>transação de domínio</span></div>
      <div class="dp-mm-item">Specification <span>regra de negócio composta</span></div>
      <div class="dp-mm-item">Null Object <span>objeto padrão neutro</span></div>
      <div class="dp-mm-item">Event Aggregator <span>pub/sub local</span></div>
      <div class="dp-mm-item">Anti-Corruption Layer <span>adapter em DDD</span></div>
    </div>
  </div>
</div>`,
  },
  mnemonics: [
    {
      label: 'GoF grupos: "Cria Estrutura e se Comporta"',
      trick: 'C-E-C',
      explanation: 'Criacionais (como criar objetos), Estruturais (como compor objetos), Comportamentais (como objetos se comunicam). Toda vez que você ouve um pattern, classifique: é sobre criação, composição ou comunicação?',
    },
    {
      label: 'Estruturais mais usados: "A Deca Faz Proxy"',
      trick: 'A-D-F-P (Adapter, Decorator, Facade, Proxy)',
      explanation: 'Os 4 estruturais de alto valor em entrevista: Adapter traduz interface incompatível, Decorator adiciona comportamento sem modificar, Facade simplifica subsistema, Proxy controla acesso. "A Deca Faz Proxy" = Adapter, Decorator, Facade, Proxy.',
    },
    {
      label: 'Strategy vs State: "Strategy troca O QUÊ, State muda COMO"',
      trick: 'Strategy = O QUÊ é feito. State = COMO depende do estado.',
      explanation: 'Strategy: você injeta um algoritmo diferente (o comportamento é escolhido de fora). State: o objeto muda como se comporta conforme seu estado interno muda. Pedido no estado "pago" se comporta diferente de pedido "pendente" — sem injeção externa.',
    },
    {
      label: 'Quando NÃO usar pattern: "YAGNI antes de GoF"',
      trick: 'YAGNI = You Ain\'t Gonna Need It',
      explanation: 'Antes de aplicar qualquer pattern, pergunte: "o problema já existe e é real?". Se não, o pattern é complexidade prematura. GoF foi criado para resolver problemas que existem — não para antecipar problemas futuros.',
    },
    {
      label: 'Decorator vs Herança: "N features → 2^N subclasses vs N decoradores"',
      trick: 'Herança = combinatório. Composição = linear.',
      explanation: '3 comportamentos via herança requerem 7 subclasses (todas as combinações). 3 decorators bastam para qualquer combinação. Quando você quiser combinar comportamentos livremente, Decorator é sempre melhor que herança.',
    },
  ],
  exercises: [
    {
      level: 'iniciante',
      title: 'Refatorar if/else de pagamento para Strategy',
      description: 'Dado um método processPayment(type: string, amount: number) com um if/else para "pix", "card" e "boleto", refatore usando Strategy pattern. Crie uma interface PaymentStrategy, três implementações concretas e um PaymentContext que recebe a estratégia via construtor. Escreva um teste para cada estratégia.',
      concepts: ['strategy', 'interface', 'composição', 'OCP'],
    },
    {
      level: 'intermediario',
      title: 'Implementar pipeline de middleware com Chain of Responsibility',
      description: 'Crie um pipeline de processamento de requisição HTTP simulado com 3 handlers encadeados: AuthHandler (verifica token), LoggingHandler (loga requisição) e RateLimitHandler (conta chamadas por IP). Cada handler pode passar para o próximo ou responder diretamente. Implemente sem framework — apenas o pattern puro. Teste cenários onde cada handler bloqueia.',
      concepts: ['chain-of-responsibility', 'handler', 'pipeline', 'single-responsibility'],
    },
    {
      level: 'intermediario',
      title: 'Builder para objetos de teste (Test Data Builder)',
      description: 'Implemente um UserBuilder para facilitar a criação de fixtures em testes. O builder deve ter métodos fluentes: withEmail(), withRole(), withPlan(), asAdmin(), withRandomData(). O método build() deve validar que campos obrigatórios estão presentes. Use em pelo menos 5 testes diferentes para mostrar como reduz duplicação.',
      concepts: ['builder', 'test-data-builder', 'fluent-api', 'fixture'],
    },
    {
      level: 'senior',
      title: 'Event Sourcing com Command e Memento',
      description: 'Implemente um editor de documento simples com histórico completo de undo/redo usando Command e Memento. Cada ação (InsertTextCommand, DeleteTextCommand, FormatCommand) deve ser reversível. O Caretaker mantém um stack de mementos. Implemente também a serialização do histórico para JSON (para replay). Escreva testes que verificam o estado após 5 operações e 3 undos.',
      concepts: ['command', 'memento', 'undo-redo', 'event-sourcing', 'caretaker'],
    },
    {
      level: 'senior',
      title: 'Anti-Corruption Layer com Adapter para API legada',
      description: 'Dada uma API de pedidos legada (LegacyOrderAPI) com nomenclatura inconsistente (order_id, cust_nm, ord_dt), implemente um OrderGatewayAdapter que traduz para o modelo de domínio (Order com id, customerName, createdAt). O adapter deve: sanitizar tipos (datas como strings → Date), lidar com campos ausentes, mapear status codes para enums do domínio. Escreva testes com respostas simuladas da API legada.',
      concepts: ['adapter', 'anti-corruption-layer', 'DDD', 'interface', 'port-adapter'],
    },
  ],
  codeExamples: [
    {
      title: 'Strategy — formas de pagamento intercambiáveis',
      language: 'typescript',
      code: `// Interface do contrato
interface PaymentStrategy {
  process(amount: number): Promise<PaymentResult>
}

// Implementações concretas
class PixStrategy implements PaymentStrategy {
  async process(amount: number): Promise<PaymentResult> {
    const qrCode = await generatePixQR(amount)
    return { method: 'pix', qrCode, status: 'pending' }
  }
}

class CreditCardStrategy implements PaymentStrategy {
  constructor(private gateway: CardGateway) {}
  async process(amount: number): Promise<PaymentResult> {
    return this.gateway.charge(amount)
  }
}

// Contexto — não conhece a implementação concreta
class OrderCheckout {
  constructor(private strategy: PaymentStrategy) {}

  async pay(amount: number): Promise<PaymentResult> {
    // valida, aplica desconto, etc.
    return this.strategy.process(amount)
  }
}

// Uso
const checkout = new OrderCheckout(new PixStrategy())
await checkout.pay(100)

// Troca em runtime sem mudar o contexto
const premiumCheckout = new OrderCheckout(new CreditCardStrategy(gateway))
await premiumCheckout.pay(100)`,
    },
    {
      title: 'Decorator — composição de comportamentos',
      language: 'typescript',
      code: `interface RequestHandler {
  handle(req: Request): Promise<Response>
}

// Decorator base — delega ao handler envolvido
abstract class HandlerDecorator implements RequestHandler {
  constructor(protected inner: RequestHandler) {}
  abstract handle(req: Request): Promise<Response>
}

// Logging decorator
class LoggingDecorator extends HandlerDecorator {
  async handle(req: Request): Promise<Response> {
    console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`)
    const start = Date.now()
    const response = await this.inner.handle(req)
    console.log(\`Completed in \${Date.now() - start}ms\`)
    return response
  }
}

// Cache decorator
class CacheDecorator extends HandlerDecorator {
  private cache = new Map<string, Response>()

  async handle(req: Request): Promise<Response> {
    const key = \`\${req.method}:\${req.url}\`
    if (this.cache.has(key)) {
      return this.cache.get(key)!
    }
    const response = await this.inner.handle(req)
    if (req.method === 'GET') this.cache.set(key, response)
    return response
  }
}

// Composição — ordem importa (logging vê tudo, cache fica interno)
const handler: RequestHandler = new LoggingDecorator(
  new CacheDecorator(
    new UserApiHandler()
  )
)`,
    },
    {
      title: 'Observer — store reativo simples',
      language: 'typescript',
      code: `type Observer<T> = (value: T) => void

class Store<T> {
  private observers: Set<Observer<T>> = new Set()
  private state: T

  constructor(initial: T) {
    this.state = initial
  }

  getState(): T {
    return this.state
  }

  setState(updater: (prev: T) => T): void {
    this.state = updater(this.state)
    this.notify()
  }

  subscribe(observer: Observer<T>): () => void {
    this.observers.add(observer)
    // Retorna função de unsubscribe — evita memory leak
    return () => this.observers.delete(observer)
  }

  private notify(): void {
    this.observers.forEach(obs => obs(this.state))
  }
}

// Uso
const cartStore = new Store({ items: [], total: 0 })

const unsubscribe = cartStore.subscribe(cart => {
  console.log('Cart updated:', cart.total)
})

cartStore.setState(prev => ({
  items: [...prev.items, { id: 1, price: 50 }],
  total: prev.total + 50,
}))

// Limpar ao desmontar
unsubscribe()`,
    },
    {
      title: 'Command com undo/redo',
      language: 'typescript',
      code: `interface Command {
  execute(): void
  undo(): void
}

// Documento que sofre os comandos
class TextDocument {
  content = ''
}

// Comando concreto
class InsertTextCommand implements Command {
  constructor(
    private doc: TextDocument,
    private position: number,
    private text: string
  ) {}

  execute(): void {
    this.doc.content =
      this.doc.content.slice(0, this.position) +
      this.text +
      this.doc.content.slice(this.position)
  }

  undo(): void {
    this.doc.content =
      this.doc.content.slice(0, this.position) +
      this.doc.content.slice(this.position + this.text.length)
  }
}

// Caretaker — gerencia o histórico
class CommandHistory {
  private history: Command[] = []
  private cursor = -1

  execute(cmd: Command): void {
    // Descarta redo history ao executar nova ação
    this.history = this.history.slice(0, this.cursor + 1)
    this.history.push(cmd)
    this.cursor++
    cmd.execute()
  }

  undo(): void {
    if (this.cursor < 0) return
    this.history[this.cursor].undo()
    this.cursor--
  }

  redo(): void {
    if (this.cursor >= this.history.length - 1) return
    this.cursor++
    this.history[this.cursor].execute()
  }
}`,
    },
  ],
  videos: [
    { title: 'Design Patterns in Object Oriented Programming', channel: 'Christopher Okhravi', url: 'https://www.youtube.com/watch?v=v9ejT8FO-7I', topic: 'Strategy Pattern' },
    { title: 'Design Patterns Revisited (GOTO 2017)', channel: 'GOTO Conferences', url: 'https://www.youtube.com/watch?v=KFcpB5_xOSA', topic: 'Patterns modernos' },
    { title: 'Padrões de Projeto com TypeScript', channel: 'Otavio Lemos', url: 'https://www.youtube.com/watch?v=arAz2Ff8s88', topic: 'TypeScript' },
    { title: 'Design Patterns — Fireship', channel: 'Fireship', url: 'https://www.youtube.com/watch?v=tv-_1er1mWI', topic: 'Resumo rápido' },
    { title: 'Gang of Four Design Patterns', channel: 'Derek Banas', url: 'https://www.youtube.com/watch?v=vNHpsC5ng_E', topic: 'GoF completo' },
  ],
  resources: [
    { title: 'Refactoring Guru — Design Patterns', url: 'https://refactoring.guru/design-patterns', kind: 'docs' },
    { title: 'Design Patterns (GoF — Gamma et al.)', url: 'https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612', kind: 'livro' },
    { title: 'Patterns of Enterprise Application Architecture (Fowler)', url: 'https://martinfowler.com/eaaCatalog/', kind: 'livro' },
    { title: 'Head First Design Patterns', url: 'https://www.oreilly.com/library/view/head-first-design/9781492077992/', kind: 'livro' },
    { title: 'Sourcemaking — Design Patterns', url: 'https://sourcemaking.com/design_patterns', kind: 'docs' },
    { title: 'Martin Fowler — Patterns of Enterprise Architecture', url: 'https://martinfowler.com/articles/enterprisePatterns.html', kind: 'artigo' },
    { title: 'TypeScript Design Patterns (GitHub)', url: 'https://github.com/torokmark/design_patterns_in_typescript', kind: 'pratica' },
  ],
}

export default designPatterns
