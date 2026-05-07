import type { SkillContent } from '@/types'

const dependencyInjection: SkillContent = {
  tagline: 'Injetar dependência em vez de instanciar — habilita teste, troca e desacoplamento.',
  why: 'DI é básico em vaga sênior. Entrevistador testa se você entende o ponto (inversão de controle, testabilidade) ou se decorou framework (Nest, Spring). Aplicar mal vira XML hell ou container mágico que ninguém entende.',
  summary: 'Dependency Injection é técnica onde dependências são injetadas (via construtor, setter, ou framework) em vez de instanciadas dentro da classe. Implementa o princípio de Inversão de Controle (IoC). Benefício: teste isolado com mock, troca de implementação sem mexer no consumidor, configuração centralizada. Três formas: constructor (preferida), setter, interface. Container de DI (Spring, Nest, InversifyJS) automatiza wiring em projetos grandes. Pequeno demais, manual já resolve.',
  keypoints: [
    { title: 'IoC vs DI', body: 'IoC é o princípio: o controle de criação/wiring sai da classe e vai para fora. DI é a técnica específica: passar dependência. Outras formas de IoC: service locator, callbacks, plugins.' },
    { title: 'Constructor injection', body: 'Forma preferida. Dependências declaradas no construtor, classe nunca está sem elas, fica óbvio o que ela precisa. Imutabilidade ajuda concorrência.' },
    { title: 'Setter / Property injection', body: 'Útil quando dependência é opcional ou há ciclo. Risco: classe pode ser usada antes de receber a dep — NPE em runtime. Use com moderação.' },
    { title: 'DI Container', body: 'Framework que cria instâncias e resolve dependências automaticamente (Spring, Nest, Inversify, Dagger). Útil em projeto grande. Pequeno demais, container vira complexidade injustificada.' },
    { title: 'Lifecycle / Scope', body: 'Singleton (uma instância), transient (nova a cada injeção), request-scoped (uma por request HTTP). Errar scope vira bug: state compartilhado entre requests.' },
    { title: 'Circular dependency', body: 'A precisa de B e B precisa de A — geralmente sinal de design ruim. Quebrar via interface intermediária, evento, ou repensar fronteira.' },
    { title: 'DI sem framework', body: 'Em projeto pequeno/médio, dá para fazer DI manual: composition root no main, instância tudo, passa para baixo. Sem magia, sem reflection. Funciona até uns 50-100 classes.' },
    { title: 'Interface Segregation + DI', body: 'DI e ISP andam juntos: injete interfaces pequenas (IEmailSender) em vez de classes concretas grandes (EmailService). Facilita mock, facilita troca de implementação.' },
  ],
  gotchas: [
    'Container mágico sem entender — anotação + reflection + lifecycle vira caixa preta. Quando bug aparece, ninguém sabe debugar.',
    'Service Locator disfarçado — injetar container e pedir container.get("X") dentro. Esconde dependência, perde o ponto.',
    'Scope errado — service singleton com state mutável injetado em request handler = bug de concorrência.',
    'Construtor com 15 parâmetros — sintoma de SRP violado, classe faz coisas demais. DI revelou o problema, não causou.',
    'Mock para tudo em teste — teste vira espelho da implementação, refatorar quebra teste sem bug real. Mock só dependência externa, dependência interna prefere objeto real (test double mais leve).',
    'Injeção por campo (field injection) em Java/Kotlin — dificulta construção manual em testes, esconde dependências. Constructor injection sempre preferível.',
  ],
  interview: [
    {
      level: 'pleno',
      q: 'Por que DI ajuda em teste?',
      a: '<p>Sem DI, classe instância dependência internamente (<code>new PostgresClient()</code>). Para testar, você precisa subir Postgres ou monkey-patch — ambos ruins.</p><p>Com DI, você injeta dependência no construtor. No teste, passa um mock/fake (<code>new OrderService(fakeRepo, fakeNotifier)</code>) e testa lógica isolada em milissegundos. Isso é <strong>testabilidade arquitetural</strong> — design viabilizando teste, não teste forçando design.</p>',
      tip: 'Dê o exemplo concreto do construtor: sem DI, new dentro do método = impossível substituir. Com DI, interface no construtor = você controla o que entra em cada teste.',
    },
    {
      level: 'pleno',
      q: 'Qual a diferença entre IoC e DI?',
      a: '<p><strong>IoC (Inversão de Controle)</strong> é o princípio geral: o controle de fluxo sai da sua classe para um framework ou camada externa. É sobre <em>quem controla</em>.</p><p><strong>DI (Dependency Injection)</strong> é uma técnica específica de IoC: você passa as dependências para dentro da classe, em vez de ela criar. Outras técnicas de IoC: Service Locator, callbacks/event handlers, plugin framework.</p><p>Analogia: IoC é "Hollywood Principle" — don\'t call us, we\'ll call you. DI é uma das formas de implementar isso.</p>',
      tip: 'A distinção IoC vs DI aparece em entrevistas sênior de arquitetura. Demonstrar que DI é uma implementação de IoC, não sinônimo, mostra rigor conceitual.',
    },
    {
      level: 'pleno',
      q: 'Tradeoff: DI manual vs container?',
      a: '<p><strong>Manual</strong>: composition root no main instância tudo e passa. Sem magia, debugável, type-safe. Limite: em projeto com 200 classes, composition root vira gigante.</p><p><strong>Container</strong>: anotação + auto-wire. Escala bem em projeto grande, configura scope, plugins. Custo: curva, magia/reflection, debug mais difícil, configuração errada vira erro em runtime.</p><p>Regra: até 50-100 classes, manual ganha em simplicidade. Acima disso, container compensa.</p>',
      tip: 'Mencione o "composition root" — o ponto único onde tudo é instanciado. Saber o nome demonstra que você conhece a arquitetura, não só o framework.',
    },
    {
      level: 'pleno',
      q: 'O que é Service Locator e por que é considerado anti-pattern?',
      a: '<p>Service Locator: registry global onde você pede dependência <code>locator.get(UserRepo)</code> dentro da classe. Parece DI, mas <strong>esconde a dependência</strong> — assinatura da classe não revela o que ela precisa.</p><p>Problemas: teste precisa configurar locator (mais setup), refactor é perigoso (compilador não pega), e você perde o checklist explícito de deps. Mark Seemann: <em>"Service Locator is an anti-pattern"</em>. DI por construtor é claramente superior.</p>',
      tip: 'O argumento decisivo: com constructor injection, o compilador garante que você passou tudo. Com Service Locator, os erros aparecem em runtime. Segurança de tipo vs descoberta tardia de erros.',
    },
    {
      level: 'pleno',
      q: 'Quando DI vira overkill?',
      a: '<p>Em script pequeno, CLI simples, protótipo de fim de semana — instanciar direto é mais legível. Também em código onde dependência é <strong>pura</strong> e sem efeito colateral (função utilitária) — não precisa injetar Math.</p><p>E em <strong>código de framework</strong> que você não testa unitariamente — Express handler trivial não precisa de IoC container. YAGNI antes de DI.</p>',
      tip: 'A resposta madura menciona YAGNI — DI resolve um problema real (testabilidade, troca de implementação). Se o problema não existe no contexto, a solução é overhead desnecessário.',
    },
    {
      level: 'senior',
      q: 'Como você evita ciclo de dependência?',
      a: '<p>Primeiro: ciclo geralmente é <strong>cheiro de design ruim</strong>. Investiga se as duas classes deveriam ser uma só, ou se há um terceiro conceito escondido.</p><p>Técnicas: extrair interface comum que ambas dependem, usar evento (A publica, B consome — em vez de chamada direta), injeção por setter como último recurso (com risco de uso antes de set).</p><p>Container moderno (Nest, Spring) detecta ciclo em startup com mensagem clara — facilita refactor.</p>',
      tip: 'A resposta sênior propõe refatoração como primeira opção, não workaround. Circular dependency é sintoma de acoplamento — o fix é eliminar o acoplamento, não contorná-lo.',
    },
    {
      level: 'senior',
      q: 'Como scopes de lifecycle funcionam em DI containers?',
      a: '<p><strong>Singleton</strong>: uma instância por container — compartilhada entre todos os consumidores. Ideal para stateless services, connections pools, config.</p><p><strong>Transient</strong>: nova instância a cada injeção. Use para objetos com estado que não deve ser compartilhado, operações que precisam de isolamento.</p><p><strong>Request-scoped</strong> (web): nova instância por request HTTP — destruída ao fim do request. Perfeito para contexto de usuário (user ID, tenant). Risco crítico: singleton que injeta request-scoped recebe a instância do <em>primeiro</em> request para sempre — data leak entre usuários.</p>',
      tip: 'O data leak de request-scoped em singleton é o bug de segurança mais cobrado em entrevistas de NestJS/Spring. Descreva o cenário: usuário B vendo dados do usuário A porque o singleton ficou preso na primeira instância.',
    },
    {
      level: 'senior',
      q: 'Como implementar DI em TypeScript sem framework?',
      a: '<p>Composition root no <code>main.ts</code>: instancie tudo manualmente e passe para baixo.</p><pre><code>// Infraestrutura primeiro\nconst db = new PostgresDatabase(config.db)\nconst emailClient = new SendGridClient(config.sendgrid)\n\n// Repositórios\nconst userRepo = new UserRepository(db)\nconst orderRepo = new OrderRepository(db)\n\n// Services — dependências explícitas\nconst emailService = new EmailService(emailClient)\nconst orderService = new OrderService(orderRepo, emailService)\n\n// Controllers\nconst orderController = new OrderController(orderService)</code></pre><p>Type-safe, debugável, sem magia. Escala até ~100 classes. Acima disso, InversifyJS ou NestJS compensa o custo do framework.</p>',
      tip: 'Demonstrar que você conhece DI manual mostra que você entende o princípio, não só o framework. Entrevistador que usa NestJS todo dia ainda quer saber se você entende o porquê.',
    },
    {
      level: 'senior',
      q: 'Como DI se relaciona com SOLID, especialmente DIP?',
      a: '<p><strong>DIP (Dependency Inversion Principle)</strong>: módulos de alto nível não devem depender de módulos de baixo nível — ambos devem depender de abstrações (interfaces).</p><p>DI é a técnica que implementa DIP: você injeta a interface (<code>IOrderRepository</code>) em vez da implementação (<code>PrismaOrderRepository</code>). A implementação concreta é decidida no composition root.</p><p>Benefício: <code>OrderService</code> não sabe se está falando com Postgres, MongoDB ou um fake em memória. Troca de implementação = mudança no composition root apenas.</p>',
      tip: 'DIP + DI juntos: DIP é o "o quê" (dependa de abstração), DI é o "como" (injete a abstração). Conectar os dois demonstra que você entende a motivação por trás da técnica.',
    },
    {
      level: 'senior',
      q: 'Como você testa código com DI pesada sem criar mocks para tudo?',
      a: '<p>Estratégia em camadas:</p><ul><li><strong>Mock dependências externas</strong> (banco, email, API externa) — efeitos colaterais reais em teste unitário são inaceitáveis.</li><li><strong>Use objetos reais para dependências internas</strong> — se <code>OrderService</code> depende de <code>PriceCalculator</code> (puro, sem side effect), injete o real. Mock seria especular sobre o comportamento interno.</li><li><strong>Use in-memory implementations</strong> para repositórios — mais realista que mock, mais rápido que banco real.</li><li><strong>Teste de integração</strong> com banco real em CI — não tudo precisa ser unitário.</li></ul><p>Over-mocking torna testes frágeis: qualquer refactor interno quebra o teste mesmo sem mudar o comportamento.</p>',
      tip: 'Mencionar a diferença entre mock (substituto programável) e fake (implementação simplificada real, ex: in-memory repo) demonstra sofisticação em teste.',
    },
    {
      level: 'senior',
      q: 'Como DI containers resolvem configuração de ambiente (dev vs prod)?',
      a: '<p>Duas abordagens:</p><ul><li><strong>Módulos condicionais</strong>: container registra implementações diferentes por variável de ambiente. <code>if (env === "test") { bind(IEmailSender).to(FakeEmailSender) } else { bind(IEmailSender).to(SendGridEmailSender) }</code></li><li><strong>Abstract Factory por ambiente</strong>: InfrastructureModule diferente por env, importado condicionalmente no composition root.</li></ul><p>Em NestJS: <code>useFactory</code> com <code>ConfigService</code> permite criar provider assíncrono com base em variáveis de ambiente. Módulo de test override providers com <code>overrideProvider().useValue(mockImpl)</code>.</p>',
      tip: 'Demonstrar que você sabe fazer swap de implementação por ambiente (dev/test/prod) sem tocar no código de negócio é a prova prática de que DIP + DI funcionam na prática.',
    },
    {
      level: 'pleno',
      q: 'Qual a diferença entre constructor injection, setter injection e field injection?',
      a: '<p><strong>Constructor injection</strong>: deps declaradas no construtor. Obrigatórias, imutáveis, visíveis na assinatura. <strong>Preferida</strong> — compilador garante que objeto não pode ser criado sem suas deps.</p><p><strong>Setter injection</strong>: deps passadas via método após construção. Útil para deps opcionais ou ciclos (último recurso). Risco: objeto pode ser usado antes de receber a dep.</p><p><strong>Field injection</strong> (<code>@Autowired</code>, <code>@Inject</code> em campo): deps injetadas diretamente em campos via reflection. Conveniente mas esconde deps, dificulta construção manual em testes, dificulta uso fora do container.</p>',
      tip: 'Field injection é o mais usado por preguiça (menos código), mas o mais problemático para teste. Constructor injection é mais verboso mas garante a invariante de que o objeto sempre está pronto para uso.',
    },
    {
      level: 'senior',
      q: 'Como implementar multi-tenancy com DI?',
      a: '<p>Multi-tenancy via DI requer isolamento por tenant no container. Abordagens:</p><ul><li><strong>Request-scoped TenantContext</strong>: injetado via middleware que lê o tenant do JWT/header. Serviços acessam o contexto para filtrar por tenant.</li><li><strong>Child container por tenant</strong>: container filho herda bindings do pai e adiciona tenant-específicos. Mais isolamento, mais complexidade.</li><li><strong>Strategy por tenant</strong>: TenantResolver injeta a implementação certa (PremiumService vs BasicService) baseado no plano do tenant.</li></ul><p>Armadilha: singleton com estado de tenant é um data leak — singleton deve ser stateless ou usar TenantContext request-scoped.</p>',
      tip: 'Multi-tenancy com DI é um caso avançado que combina scopes, strategy e o risco de data leak. Demonstrar consciência do risco de singleton + tenant state é a resposta sênior.',
    },
    {
      level: 'pleno',
      q: 'O que é composition root e por que é importante?',
      a: '<p>Composition Root é o único lugar onde você instancia classes concretas e faz o wiring das dependências. Em aplicações web: <code>main.ts</code> ou o bootstrap do servidor.</p><p>Importância:</p><ul><li>Centraliza toda a lógica de "qual implementação concreta" — facilita trocar EmailSender em produção vs teste</li><li>O resto do código depende de abstrações — nunca faz <code>new ConcreteClass()</code></li><li>Permite ver o grafo de dependências completo em um lugar</li></ul><p>Violação comum: <code>new</code> espalhado pelo código de domínio. Isso é o oposto de DI — acoplamento concreto escondido na lógica.</p>',
      tip: '"New é cola" — toda vez que você escreve new ConcreteClass() no domínio, você está colando aquela classe concreta ali. Composition root é onde você pode usar cola livremente.',
    },
    {
      level: 'senior',
      q: 'Como decorators TypeScript facilitam DI (InversifyJS, NestJS)?',
      a: '<p>Decorators TypeScript em conjunto com <code>reflect-metadata</code> permitem metadados em tempo de execução que o container usa para resolver dependências:</p><ul><li><code>@injectable()</code>: marca a classe como gerenciável pelo container</li><li><code>@inject(TOKEN)</code>: especifica o token de injeção para o container resolver</li><li>Container usa <code>Reflect.getMetadata(\'design:paramtypes\', target)</code> para descobrir tipos de construtor automaticamente</li></ul><p>NestJS usa o mesmo mecanismo com <code>@Injectable()</code> + TypeScript <code>emitDecoratorMetadata: true</code>. A reflection fornece os tipos de parâmetro, o container resolve no registry de providers.</p>',
      tip: 'Mencionar reflect-metadata e emitDecoratorMetadata = true demonstra que você entende o mecanismo por baixo do NestJS/Inversify, não só o uso da anotação.',
    },
    {
      level: 'senior',
      q: 'Como você migra código legado (sem DI) para código testável (com DI)?',
      a: '<p>Processo incremental — não reescreva tudo:</p><ol><li><strong>Identifique seams</strong>: pontos onde você pode introduzir uma abstração sem reescrever tudo. <code>new DatabaseClient()</code> dentro do service é o seam.</li><li><strong>Extraia interface</strong>: crie <code>IDatabaseClient</code> com apenas os métodos usados (ISP).</li><li><strong>Adicione parâmetro ao construtor</strong> com valor default: <code>constructor(private db: IDatabaseClient = new DatabaseClient())</code> — mantém backward compatibility, permite override em teste.</li><li><strong>Migre gradualmente</strong> para injeção obrigatória conforme os testes provam que o novo design funciona.</li></ol><p>Armadilha: tentar migrar tudo de uma vez. Faça refactoring incremental com cobertura de teste crescendo junto.</p>',
      tip: 'O parâmetro com default value como estratégia de migração incremental é o insight prático. Demonstra experiência real com código legado, não só design greenfield.',
    },
    {
      level: 'pleno',
      q: 'Como DI se relaciona com Clean Architecture?',
      a: '<p>Em Clean Architecture, a regra de dependência diz: <strong>dependências apontam para dentro</strong> — domínio não conhece infraestrutura.</p><p>DI é o mecanismo que inverte a dependência: <code>OrderService</code> depende de <code>IOrderRepository</code> (interface no domínio). A implementação <code>PrismaOrderRepository</code> (na infra) implementa a interface. O container injeta a implementação concreta na fronteira de camadas.</p><p>Sem DI, a inversão de dependência de Clean Architecture é teoricamente possível mas praticamente impossível de manter — sempre há um <code>new</code> escapando para o domínio.</p>',
      tip: 'A frase chave: DI é o mecanismo operacional da regra de dependência de Clean Architecture. Sem DI, o conceito arquitetural existe mas não funciona na prática.',
    },
    {
      level: 'senior',
      q: 'Quais são as limitações de DI que frameworks não resolvem?',
      a: '<p>Limitações reais que DI não resolve:</p><ul><li><strong>Dependências de runtime</strong>: se qual implementação usar depende de dados em runtime (tenant, feature flag dinâmico), o container precisa de factory que recebe esses dados — complexidade extra.</li><li><strong>Objetos de domínio</strong>: entidades e value objects não são providers — você não injeta um <code>Order</code>. DI é para services, não para objetos de domínio.</li><li><strong>Performance</strong>: containers com reflection têm overhead vs instanciação manual. Negligível na maioria dos casos, mas real em hot paths.</li><li><strong>Debugging</strong>: "quem injetou isto?" em containers grandes requer ferramentas específicas. Stack trace passa pelo container.</li></ul>',
      tip: 'A limitação de objetos de domínio (você não injeta uma Order) é frequentemente esquecida. Demonstra que você entende onde DI se aplica e onde não se aplica.',
    },
    {
      level: 'senior',
      q: 'Como você documenta e comunica o grafo de dependências do sistema?',
      a: '<p>Abordagens:</p><ul><li><strong>Composition root explícito</strong>: código legível do main.ts é documentação viva do grafo.</li><li><strong>Diagrama de camadas</strong>: controller → service → repository → database. Nenhuma seta vai para cima.</li><li><strong>Ferramentas</strong>: NestJS tem DevTools que visualiza o grafo de módulos. InversifyJS tem <code>container.snapshot()</code> para debug.</li><li><strong>Testes de arquitetura</strong>: ferramentas como ArchUnit (Java), nestjs-testing ou dependency-cruiser validam que regras de dependência não são violadas em CI.</li></ul>',
      tip: 'Mencionar testes de arquitetura (dependency-cruiser, ArchUnit) demonstra maturidade de engenharia — o grafo de dependências como invariante que o CI protege.',
    },
    {
      level: 'pleno',
      q: 'O que é "new is glue" e por que importa em DI?',
      a: '<p>"New is glue" é uma frase atribuída a Misko Hevery (Google): toda vez que você escreve <code>new ConcreteClass()</code> dentro de outra classe, você está <strong>colando</strong> aquela dependência concreta no código.</p><p>Implicações:</p><ul><li>Impossível substituir a implementação em teste sem monkey-patching</li><li>A classe acumula responsabilidade de criação além de seu propósito</li><li>Mudança na dependência propaga para cima</li></ul><p>Regra: <code>new</code> é permitido no composition root (onde você monta o grafo) e em value objects/entities. No domínio e serviços, sempre injete.</p>',
      tip: '"New is glue" é uma frase de memorização poderosa para entrevista. Se você a citar com contexto, o entrevistador sabe que você entende DI conceitualmente, não só sintaticamente.',
    },
    {
      level: 'senior',
      q: 'Como injeção de dependência se aplica em arquiteturas serverless (Lambda, Cloud Functions)?',
      a: '<p>Em serverless, o ciclo de vida é diferente — função pode ser criada e destruída rapidamente. Adaptações:</p><ul><li><strong>Container no bootstrap da função</strong>: o container é criado uma vez no módulo-nível (fora do handler), reutilizado entre invocações na mesma instância quente.</li><li><strong>Singleton por instância de container</strong>: não há servidor persistente, mas containers quentes (warm instances) reutilizam singletons. Cuidado com estado mutável.</li><li><strong>DI manual em funções simples</strong>: Lambda com 1 responsabilidade raramente precisa de container — compose no handler, mantenha simples.</li><li><strong>Cold start</strong>: container com reflection tem overhead. InversifyJS leve vs Spring pesado faz diferença real em p99.</li></ul>',
      tip: 'A questão de cold start é o detalhe que demonstra experiência com produção serverless. Containers pesados (Spring) são problemáticos em Lambda — Quarkus/Micronaut existem parcialmente por isso.',
    },
  ],
  diagrams: [
    {
      title: 'Sem DI vs Com DI — dependências concretas vs interfaces',
      html: `<style>
.di-comp { font-family: system-ui; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.di-comp-title { font-size: 16px; font-weight: 700; color: #22c55e; margin-bottom: 16px; }
.di-comp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.di-comp-panel { background: #1e293b; border-radius: 8px; padding: 14px; }
.di-comp-panel h4 { font-size: 13px; margin-bottom: 10px; }
.di-comp-panel.bad h4 { color: #ef4444; }
.di-comp-panel.good h4 { color: #22c55e; }
.di-code { font-family: monospace; font-size: 11px; background: #0f172a; padding: 10px; border-radius: 6px; line-height: 1.7; }
.di-bad { color: #ef4444; }
.di-good { color: #22c55e; }
.di-neutral { color: #94a3b8; }
.di-tag { font-size: 11px; color: #64748b; margin-top: 8px; }
</style>
<div class="di-comp">
  <div class="di-comp-title">Sem DI vs Com DI</div>
  <div class="di-comp-row">
    <div class="di-comp-panel bad">
      <h4>❌ Sem DI — new acoplado</h4>
      <div class="di-code">
        <span class="di-bad">class OrderService {</span><br>
        <span class="di-neutral">  private repo =</span> <span class="di-bad">new PrismaOrderRepo()</span><br>
        <span class="di-neutral">  private email =</span> <span class="di-bad">new SendGridEmailer()</span><br>
        <br>
        <span class="di-neutral">  async create(dto) {</span><br>
        <span class="di-neutral">    // testa sem Prisma real? impossível</span><br>
        <span class="di-neutral">    const order = await this.repo.save(dto)</span><br>
        <span class="di-neutral">    await this.email.send(order)</span><br>
        <span class="di-neutral">  }</span><br>
        <span class="di-bad">}</span>
      </div>
      <div class="di-tag">Teste exige banco real. Troca de ORM = editar OrderService.</div>
    </div>
    <div class="di-comp-panel good">
      <h4>✅ Com DI — interfaces injetadas</h4>
      <div class="di-code">
        <span class="di-good">class OrderService {</span><br>
        <span class="di-neutral">  constructor(</span><br>
        <span class="di-good">    private repo: IOrderRepository,</span><br>
        <span class="di-good">    private email: IEmailSender</span><br>
        <span class="di-neutral">  ) {}</span><br>
        <br>
        <span class="di-neutral">  async create(dto) {</span><br>
        <span class="di-neutral">    const order = await this.repo.save(dto)</span><br>
        <span class="di-neutral">    await this.email.send(order)</span><br>
        <span class="di-neutral">  }</span><br>
        <span class="di-good">}</span>
      </div>
      <div class="di-tag">Teste: new OrderService(fakeRepo, fakeEmail). Nenhum banco.</div>
    </div>
  </div>
</div>`,
    },
    {
      title: 'Scopes de lifecycle — Singleton, Transient, Request-Scoped',
      html: `<style>
.di-sc { font-family: system-ui; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.di-sc-title { font-size: 16px; font-weight: 700; color: #22c55e; margin-bottom: 16px; }
.di-sc-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.di-sc-card { background: #1e293b; border-radius: 8px; padding: 14px; border-top: 3px solid; }
.di-sc-name { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
.di-sc-mechanic { font-size: 11px; color: #64748b; margin-bottom: 10px; }
.di-sc-item { font-size: 11px; color: #94a3b8; margin-bottom: 5px; display: flex; gap: 6px; }
.di-sc-bullet { color: #22c55e; }
.di-sc-warn { color: #ef4444; font-size: 11px; margin-top: 8px; border-top: 1px solid #334155; padding-top: 6px; }
.di-sc-viz { display: flex; gap: 4px; margin: 10px 0; align-items: center; font-size: 10px; }
.di-sc-req { background: #1e3a5f; border: 1px solid #3b82f6; border-radius: 4px; padding: 3px 8px; font-size: 10px; color: #93c5fd; }
.di-sc-inst { background: #1a3a2a; border: 1px solid #22c55e; border-radius: 4px; padding: 3px 8px; font-size: 10px; color: #86efac; }
</style>
<div class="di-sc">
  <div class="di-sc-title">Scopes de Lifecycle no DI Container</div>
  <div class="di-sc-row">
    <div class="di-sc-card" style="border-color:#f59e0b">
      <div class="di-sc-name" style="color:#f59e0b">Singleton</div>
      <div class="di-sc-mechanic">Uma instância por container</div>
      <div class="di-sc-viz">
        <div class="di-sc-req">Req 1</div>
        <span style="color:#64748b">→</span>
        <div class="di-sc-inst">Instance A</div>
        <span style="color:#64748b">←</span>
        <div class="di-sc-req">Req 2</div>
      </div>
      <div class="di-sc-item"><span class="di-sc-bullet">✓</span>Conexões ao banco</div>
      <div class="di-sc-item"><span class="di-sc-bullet">✓</span>Config (readonly)</div>
      <div class="di-sc-item"><span class="di-sc-bullet">✓</span>Services stateless</div>
      <div class="di-sc-warn">⚠️ Nunca guarde estado de request em singleton</div>
    </div>
    <div class="di-sc-card" style="border-color:#8b5cf6">
      <div class="di-sc-name" style="color:#8b5cf6">Transient</div>
      <div class="di-sc-mechanic">Nova instância a cada injeção</div>
      <div class="di-sc-viz">
        <div class="di-sc-req">Req 1</div>
        <span style="color:#64748b">→</span>
        <div class="di-sc-inst">Instance A</div>
      </div>
      <div class="di-sc-viz">
        <div class="di-sc-req">Req 2</div>
        <span style="color:#64748b">→</span>
        <div class="di-sc-inst">Instance B</div>
      </div>
      <div class="di-sc-item"><span class="di-sc-bullet">✓</span>Objetos com estado</div>
      <div class="di-sc-item"><span class="di-sc-bullet">✓</span>Operações isoladas</div>
    </div>
    <div class="di-sc-card" style="border-color:#22c55e">
      <div class="di-sc-name" style="color:#22c55e">Request-Scoped</div>
      <div class="di-sc-mechanic">Nova instância por request HTTP</div>
      <div class="di-sc-viz">
        <div class="di-sc-req">Req A (user:1)</div>
        <span style="color:#64748b">→</span>
        <div class="di-sc-inst">CTX user:1</div>
      </div>
      <div class="di-sc-viz">
        <div class="di-sc-req">Req B (user:2)</div>
        <span style="color:#64748b">→</span>
        <div class="di-sc-inst">CTX user:2</div>
      </div>
      <div class="di-sc-item"><span class="di-sc-bullet">✓</span>UserContext, TenantContext</div>
      <div class="di-sc-warn">⚠️ Se injetado em singleton = DATA LEAK</div>
    </div>
  </div>
</div>`,
    },
    {
      title: 'DI manual vs Container — quando cada um',
      html: `<style>
.di-vs { font-family: system-ui; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.di-vs-title { font-size: 16px; font-weight: 700; color: #22c55e; margin-bottom: 16px; }
.di-vs-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.di-vs-col { background: #1e293b; border-radius: 8px; padding: 14px; }
.di-vs-col h4 { font-size: 13px; font-weight: 700; margin-bottom: 10px; }
.di-vs-col:nth-child(1) h4 { color: #22c55e; }
.di-vs-col:nth-child(2) h4 { color: #0ea5e9; }
.di-vs-item { font-size: 11px; color: #94a3b8; margin-bottom: 5px; display: flex; gap: 6px; align-items: flex-start; }
.di-vs-bullet { color: #22c55e; flex-shrink: 0; }
.di-vs-bullet.x { color: #ef4444; }
.di-vs-cutoff { text-align: center; margin-top: 14px; padding: 10px; background: #1e293b; border-radius: 8px; font-size: 12px; color: #94a3b8; }
.di-vs-cutoff span { color: #22c55e; font-weight: 700; }
</style>
<div class="di-vs">
  <div class="di-vs-title">DI Manual vs DI Container</div>
  <div class="di-vs-row">
    <div class="di-vs-col">
      <h4>DI Manual (Composition Root)</h4>
      <div class="di-vs-item"><span class="di-vs-bullet">✓</span>100% type-safe em compile time</div>
      <div class="di-vs-item"><span class="di-vs-bullet">✓</span>Sem magic / reflection</div>
      <div class="di-vs-item"><span class="di-vs-bullet">✓</span>Debuggável: stack trace normal</div>
      <div class="di-vs-item"><span class="di-vs-bullet">✓</span>Zero dependências extras</div>
      <div class="di-vs-item"><span class="di-vs-bullet x">✗</span>Composition root cresce com o projeto</div>
      <div class="di-vs-item"><span class="di-vs-bullet x">✗</span>Scoping manual (singleton, etc.)</div>
    </div>
    <div class="di-vs-col">
      <h4>DI Container (NestJS, Inversify)</h4>
      <div class="di-vs-item"><span class="di-vs-bullet">✓</span>Auto-wire em projeto grande</div>
      <div class="di-vs-item"><span class="di-vs-bullet">✓</span>Scoping declarativo</div>
      <div class="di-vs-item"><span class="di-vs-bullet">✓</span>Plugins e módulos dinâmicos</div>
      <div class="di-vs-item"><span class="di-vs-bullet x">✗</span>Erros em runtime (não compile)</div>
      <div class="di-vs-item"><span class="di-vs-bullet x">✗</span>Curva de aprendizado</div>
      <div class="di-vs-item"><span class="di-vs-bullet x">✗</span>Debug mais difícil</div>
    </div>
  </div>
  <div class="di-vs-cutoff">Ponto de corte: <span>~50-100 classes</span> — abaixo manual é mais simples, acima container escala melhor</div>
</div>`,
    },
  ],
  cheatsheet: {
    title: 'Dependency Injection — Referência rápida',
    html: `<style>
.di-cs { font-family: system-ui; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 12px; font-size: 12px; }
.di-cs-h { font-size: 13px; font-weight: 700; color: #22c55e; border-bottom: 1px solid #1e293b; padding-bottom: 4px; margin: 12px 0 8px; }
.di-cs-grid { display: grid; grid-template-columns: 140px 1fr; gap: 4px; margin-bottom: 8px; }
.di-cs-k { background: #1e293b; padding: 5px 8px; border-radius: 4px; color: #86efac; font-weight: 600; }
.di-cs-v { background: #1e293b; padding: 5px 8px; border-radius: 4px; color: #cbd5e1; }
.di-cs-rule { display: flex; gap: 8px; align-items: flex-start; padding: 5px 8px; background: #1e293b; border-radius: 4px; margin-bottom: 4px; font-size: 11px; }
.di-cs-ok { color: #22c55e; flex-shrink: 0; }
.di-cs-no { color: #ef4444; flex-shrink: 0; }
.di-cs-tip { background: #1e3a2a; border-left: 3px solid #22c55e; padding: 8px 12px; border-radius: 4px; font-size: 11px; color: #86efac; margin-top: 10px; }
</style>
<div class="di-cs">
  <div class="di-cs-h">Tipos de injeção</div>
  <div class="di-cs-grid">
    <div class="di-cs-k">Constructor</div><div class="di-cs-v">Preferido — deps obrigatórias, visíveis, imutáveis</div>
    <div class="di-cs-k">Setter</div><div class="di-cs-v">Deps opcionais ou ciclos — use como último recurso</div>
    <div class="di-cs-k">Field</div><div class="di-cs-v">Conveniente mas esconde deps — evitar, dificulta teste manual</div>
  </div>
  <div class="di-cs-h">Scopes</div>
  <div class="di-cs-grid">
    <div class="di-cs-k">Singleton</div><div class="di-cs-v">1 instância por container — stateless services, conexões</div>
    <div class="di-cs-k">Transient</div><div class="di-cs-v">Nova instância a cada injeção — objetos com estado</div>
    <div class="di-cs-k">Request-Scoped</div><div class="di-cs-v">1 por HTTP request — UserContext, TenantContext</div>
  </div>
  <div class="di-cs-h">Regras</div>
  <div class="di-cs-rule"><span class="di-cs-no">✗</span><span>new ConcreteClass() no domínio — "new is glue"</span></div>
  <div class="di-cs-rule"><span class="di-cs-no">✗</span><span>Service Locator — esconde deps, perde type-safety</span></div>
  <div class="di-cs-rule"><span class="di-cs-no">✗</span><span>Request-scoped injetado em singleton — DATA LEAK</span></div>
  <div class="di-cs-rule"><span class="di-cs-ok">✓</span><span>Injete interfaces, não implementações concretas (DIP)</span></div>
  <div class="di-cs-rule"><span class="di-cs-ok">✓</span><span>Composition root único — só ali use new concreto</span></div>
  <div class="di-cs-rule"><span class="di-cs-ok">✓</span><span>Mock apenas dependências externas em testes</span></div>
  <div class="di-cs-tip">IoC = princípio. DI = técnica de IoC. Container = ferramenta de DI. Entenda os três níveis.</div>
</div>`,
  },
  mindmap: {
    title: 'Dependency Injection — Mapa mental completo',
    html: `<style>
.di-mm { font-family: system-ui; background: #0f172a; border-radius: 12px; padding: 24px; color: #e2e8f0; }
.di-mm-center { text-align: center; margin-bottom: 20px; }
.di-mm-title { font-size: 18px; font-weight: 800; color: #22c55e; }
.di-mm-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
.di-mm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.di-mm-card { background: #1e293b; border-radius: 10px; padding: 14px; border-left: 4px solid; }
.di-mm-card-title { font-size: 13px; font-weight: 700; margin-bottom: 10px; }
.di-mm-item { font-size: 11px; color: #94a3b8; padding: 3px 0; border-bottom: 1px solid #0f172a; display: flex; justify-content: space-between; }
.di-mm-item span { color: #64748b; font-size: 10px; }
</style>
<div class="di-mm">
  <div class="di-mm-center">
    <div class="di-mm-title">Dependency Injection</div>
    <div class="di-mm-sub">IoC · DI · Containers · Testabilidade</div>
  </div>
  <div class="di-mm-grid">
    <div class="di-mm-card" style="border-color:#22c55e">
      <div class="di-mm-card-title" style="color:#22c55e">Princípios</div>
      <div class="di-mm-item">IoC — controle de criação para fora <span>princípio</span></div>
      <div class="di-mm-item">DI — injetar em vez de instanciar <span>técnica</span></div>
      <div class="di-mm-item">DIP — dependa de abstração <span>SOLID</span></div>
      <div class="di-mm-item">"New is glue" <span>heurística</span></div>
      <div class="di-mm-item">Composition root <span>único ponto de new</span></div>
    </div>
    <div class="di-mm-card" style="border-color:#0ea5e9">
      <div class="di-mm-card-title" style="color:#0ea5e9">Tipos de injeção</div>
      <div class="di-mm-item">Constructor injection <span>preferida</span></div>
      <div class="di-mm-item">Setter injection <span>opcional/ciclos</span></div>
      <div class="di-mm-item">Field injection <span>evitar</span></div>
      <div class="di-mm-item">Interface injection <span>raro</span></div>
    </div>
    <div class="di-mm-card" style="border-color:#f59e0b">
      <div class="di-mm-card-title" style="color:#f59e0b">Scopes</div>
      <div class="di-mm-item">Singleton <span>uma instância</span></div>
      <div class="di-mm-item">Transient <span>nova a cada injeção</span></div>
      <div class="di-mm-item">Request-Scoped <span>uma por request</span></div>
      <div class="di-mm-item">Singleton + request-scoped = DATA LEAK <span>⚠️</span></div>
    </div>
    <div class="di-mm-card" style="border-color:#ef4444">
      <div class="di-mm-card-title" style="color:#ef4444">Anti-patterns</div>
      <div class="di-mm-item">Service Locator <span>esconde deps</span></div>
      <div class="di-mm-item">New dentro do domínio <span>cola concreta</span></div>
      <div class="di-mm-item">Construtor com 15 deps <span>SRP violado</span></div>
      <div class="di-mm-item">Mock para tudo <span>teste frágil</span></div>
      <div class="di-mm-item">Scope errado <span>state leak</span></div>
    </div>
  </div>
</div>`,
  },
  mnemonics: [
    {
      label: '"New is glue" — todo new acoplado',
      trick: 'NEW = COLA',
      explanation: 'Toda vez que você escreve new ConcreteClass() dentro de outra classe, você está "colando" aquela dependência ali. Não dá para descolar sem mexer no código. DI = não use cola dentro do domínio, concentre no composition root.',
    },
    {
      label: 'IoC vs DI: "IoC é o princípio, DI é a técnica"',
      trick: 'I-P T-T (IoC=Princípio, DI=Técnica)',
      explanation: 'Hollywood Principle é IoC: "Don\'t call us, we\'ll call you". DI é uma das formas de implementar IoC — você não chama o banco, o container entrega para você. Service Locator também é IoC mas não é DI.',
    },
    {
      label: 'Scopes: "Singleton Divide, Transient Isola, Request Protege"',
      trick: 'S-D, T-I, R-P',
      explanation: 'Singleton Divide uma instância entre todos. Transient Isola cada injeção em instância própria. Request Protege dados de um request de vazar para outro. Escolha errada de scope = bug silencioso ou data leak.',
    },
    {
      label: 'Composition Root: "Só ali use new livremente"',
      trick: 'COMPOSITION ROOT = ZONA DE NEW',
      explanation: 'O composition root é a zona franca do new — é onde você instancia tudo e monta o grafo. Fora dali, new é suspeito. Em NestJS, o bootstrap é o composition root. Em Express, o main.ts onde você instancia tudo.',
    },
    {
      label: 'DI + Clean Architecture: "Deps apontam para dentro, DI injeta de fora"',
      trick: 'CLEAN ARCH: setas para dentro. DI: implementação de fora.',
      explanation: 'Clean Architecture: regra de dependência diz que setas apontam para o domínio. DI é o mecanismo: o domínio declara a interface (aponta para dentro), a infraestrutura implementa, o container injeta de fora sem violar a regra.',
    },
  ],
  exercises: [
    {
      level: 'iniciante',
      title: 'Implementar OrderService com constructor injection',
      description: 'Dado um OrderService que faz new PostgresOrderRepository() e new SendGridEmailer() internamente, refatore para receber IOrderRepository e IEmailSender via construtor. Crie interfaces mínimas (apenas os métodos usados). Escreva um teste sem banco real usando objetos fake em memória.',
      concepts: ['constructor-injection', 'interface', 'DIP', 'fake-em-memória'],
    },
    {
      level: 'iniciante',
      title: 'Composition root manual em Express',
      description: 'Crie uma mini-aplicação Express com 3 camadas: UserRepository (interface + implementação in-memory), UserService (depende de IUserRepository), UserController (depende de IUserService). No main.ts, monte o grafo manualmente no composition root. Nenhum new fora do main.ts.',
      concepts: ['composition-root', 'DI-manual', 'separação-de-camadas'],
    },
    {
      level: 'intermediario',
      title: 'DI com factory para swap dev/prod',
      description: 'Implemente um EmailSender que usa SendGrid em produção e logga no console em dev/test. Use uma Factory que recebe a variável de ambiente NODE_ENV e retorna a implementação correta. O resto do código só conhece a interface IEmailSender. Escreva testes que verificam que o mock foi chamado corretamente.',
      concepts: ['factory', 'interface', 'swap-de-implementação', 'ambiente'],
    },
    {
      level: 'intermediario',
      title: 'Detectar e corrigir Service Locator disfarçado',
      description: 'Dado código que injeta o container e chama container.get("UserService") dentro de um método, refatore para remover o Service Locator. Identifique quais dependências reais o código precisa, declare-as explicitamente no construtor, atualize o composition root. Explique por escrito por que a versão com Service Locator é inferior.',
      concepts: ['service-locator', 'anti-pattern', 'refatoração', 'constructor-injection'],
    },
    {
      level: 'senior',
      title: 'Multi-tenancy com Request-Scoped TenantContext',
      description: 'Implemente um sistema onde cada request HTTP tem um TenantContext (tenant ID extraído do JWT) injetado em todos os repositórios. Os repositórios devem filtrar dados automaticamente pelo tenant. Use um scope request-scoped para o TenantContext. Demonstre que: (1) requests de diferentes tenants nunca se misturam, (2) o TenantContext não vaza para singletons, (3) testes unitários podem injetar um TenantContext fake.',
      concepts: ['request-scoped', 'multi-tenancy', 'DI-container', 'security', 'tenant-isolation'],
    },
  ],
  codeExamples: [
    {
      title: 'Constructor injection — contrato explícito via interface',
      language: 'typescript',
      code: `// Interfaces — contrato do domínio
interface IOrderRepository {
  findById(id: string): Promise<Order | null>
  save(order: Order): Promise<Order>
}

interface IEmailSender {
  send(to: string, subject: string, body: string): Promise<void>
}

// Service — depende de abstrações, nunca de concreto
class OrderService {
  constructor(
    private readonly repo: IOrderRepository,
    private readonly email: IEmailSender,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const order = Order.create(dto)
    const saved = await this.repo.save(order)
    await this.email.send(
      saved.customerEmail,
      'Pedido confirmado',
      \`Seu pedido #\${saved.id} foi recebido.\`,
    )
    return saved
  }
}

// Composition root (main.ts) — único lugar com new concreto
const repo = new PrismaOrderRepository(prismaClient)
const email = new SendGridEmailSender(process.env.SENDGRID_KEY!)
const orderService = new OrderService(repo, email)

// Teste — sem banco, sem email real
const fakeRepo: IOrderRepository = {
  findById: jest.fn().mockResolvedValue(null),
  save: jest.fn().mockResolvedValue(mockOrder),
}
const fakeEmail: IEmailSender = { send: jest.fn() }
const sut = new OrderService(fakeRepo, fakeEmail)`,
    },
    {
      title: 'DI Container com InversifyJS — tokens e bindings',
      language: 'typescript',
      code: `import 'reflect-metadata'
import { Container, injectable, inject } from 'inversify'

// Tokens de injeção — evitam acoplamento a strings
const TYPES = {
  UserRepository: Symbol.for('UserRepository'),
  EmailSender: Symbol.for('EmailSender'),
  UserService: Symbol.for('UserService'),
}

// Interfaces
interface IUserRepository { findById(id: string): Promise<User | null> }
interface IEmailSender { send(to: string, msg: string): Promise<void> }

// Implementações
@injectable()
class PrismaUserRepository implements IUserRepository {
  async findById(id: string) { /* ... */ return null }
}

@injectable()
class SendGridEmailSender implements IEmailSender {
  async send(to: string, msg: string) { /* ... */ }
}

// Service
@injectable()
class UserService {
  constructor(
    @inject(TYPES.UserRepository) private repo: IUserRepository,
    @inject(TYPES.EmailSender) private email: IEmailSender,
  ) {}
}

// Container — composition root
const container = new Container()
container.bind<IUserRepository>(TYPES.UserRepository).to(PrismaUserRepository)
container.bind<IEmailSender>(TYPES.EmailSender).to(SendGridEmailSender)
container.bind<UserService>(TYPES.UserService).to(UserService)

const userService = container.get<UserService>(TYPES.UserService)`,
    },
    {
      title: 'Request-Scoped TenantContext em NestJS',
      language: 'typescript',
      code: `import { Injectable, Scope, Inject } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import type { Request } from 'express'

// Context request-scoped — isolado por request
@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  readonly tenantId: string

  constructor(@Inject(REQUEST) private request: Request) {
    // Extraído do JWT pelo middleware de autenticação
    this.tenantId = (request as any).user?.tenantId
    if (!this.tenantId) throw new Error('TenantContext: tenantId missing')
  }
}

// Repository que usa o contexto para filtrar por tenant
@Injectable({ scope: Scope.REQUEST }) // Também request-scoped!
export class ProductRepository {
  constructor(
    private prisma: PrismaService,
    private tenant: TenantContext, // Injetado com escopo correto
  ) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { tenantId: this.tenant.tenantId }, // Sempre filtrado
    })
  }
}

// ⚠️ ERRADO — singleton injetando request-scoped
@Injectable() // DEFAULT = singleton
export class BuggyService {
  constructor(
    private tenant: TenantContext, // LEAK! Fica preso no primeiro request
  ) {}
}`,
    },
    {
      title: 'Fake in-memory repository para testes rápidos',
      language: 'typescript',
      code: `// Interface do repositório
interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  save(user: User): Promise<User>
  delete(id: string): Promise<void>
}

// Implementação fake — sem banco, para testes
class InMemoryUserRepository implements IUserRepository {
  private store = new Map<string, User>()

  async findById(id: string): Promise<User | null> {
    return this.store.get(id) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    return [...this.store.values()].find(u => u.email === email) ?? null
  }

  async save(user: User): Promise<User> {
    this.store.set(user.id, user)
    return user
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id)
  }

  // Utilitário de teste — limpa entre testes
  clear(): void { this.store.clear() }
  size(): number { return this.store.size }
}

// Uso em teste — muito mais poderoso que mock
describe('UserService', () => {
  let repo: InMemoryUserRepository
  let sut: UserService

  beforeEach(() => {
    repo = new InMemoryUserRepository()
    sut = new UserService(repo, new FakeEmailSender())
  })

  it('deve lançar erro para email duplicado', async () => {
    await repo.save(User.create({ email: 'a@b.com' }))
    await expect(sut.register({ email: 'a@b.com' }))
      .rejects.toThrow('Email já cadastrado')
  })
})`,
    },
  ],
  videos: [
    { title: 'Dependency Injection — Fun Fun Function', channel: 'Fun Fun Function', url: 'https://www.youtube.com/watch?v=0X1Ns2NRfks', topic: 'DI fundamental' },
    { title: 'Dependency Injection & IoC in TypeScript', channel: 'Fireship', url: 'https://www.youtube.com/watch?v=9NIQiZ1YoPs', topic: 'TypeScript + InversifyJS' },
    { title: 'Clean Code - Dependency Inversion', channel: 'Uncle Bob', url: 'https://www.youtube.com/watch?v=TMuno5RZNeE', topic: 'DIP e SOLID' },
    { title: 'DI in NestJS — Providers e Modules', channel: 'Marius Espejo', url: 'https://www.youtube.com/watch?v=sFnAHC9lLaw', topic: 'NestJS DI' },
    { title: 'Is Dependency Injection Dead?', channel: 'GOTO Conferences', url: 'https://www.youtube.com/watch?v=UQpTe6BVNPQ', topic: 'DI moderno' },
  ],
  resources: [
    { title: 'Dependency Injection Principles, Practices, and Patterns (Seemann)', url: 'https://www.manning.com/books/dependency-injection-principles-practices-patterns', kind: 'livro' },
    { title: 'Martin Fowler — Inversion of Control', url: 'https://martinfowler.com/articles/injection.html', kind: 'artigo' },
    { title: 'NestJS Docs — Providers', url: 'https://docs.nestjs.com/providers', kind: 'docs' },
    { title: 'Spring Framework Reference — IoC Container', url: 'https://docs.spring.io/spring-framework/reference/core/beans.html', kind: 'docs' },
    { title: 'Mark Seemann — Service Locator is an Anti-Pattern', url: 'https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/', kind: 'artigo' },
    { title: 'InversifyJS — IoC Container for TypeScript', url: 'https://inversify.io/', kind: 'docs' },
    { title: 'Google Testing Blog — Dependency Injection (Misko Hevery)', url: 'https://testing.googleblog.com/2008/07/how-to-think-about-the-new-operator.html', kind: 'artigo' },
  ],
}

export default dependencyInjection
