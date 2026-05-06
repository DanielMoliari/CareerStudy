'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildCommandRefPdf } from '@/components/pdfs/CommandRefPdf'
import type { CommandEntry } from '@/components/pdfs/CommandRefPdf'

// ── Paleta NestJS ─────────────────────────────────────────────────────────────
const C    = '#E0234E'  // NestJS red — NUNCA omitir, default seria cyan React
const AMB  = '#f59e0b'
const SKY  = '#38bdf8'
const GRN  = '#4ade80'
const PRP  = '#a78bfa'
const GOLD = '#fbbf24'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 21 perguntas mais cobradas sobre NestJS em entrevista',
    type: 'qa',
    pages: 11,
    description: 'Recuperação ativa: ciclo de vida de requisição, DI e container IoC, módulos dinâmicos, escopos de provider, guards vs interceptors vs pipes, testes unitários e de integração, microservices, WebSockets e tudo que entrevistadores sênior realmente perguntam.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Decorators, ciclo de vida, CLI e regras críticas numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: todos os decorators por categoria (classe, método, parâmetro), ordem do ciclo de vida de requisição, CLI commands (nest generate, build, start), escopos de provider e as regras críticas de arquitetura.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam NestJS na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'Ordem do ciclo de vida (M-G-I-P-H-I-E), diferença Guard vs Middleware, regra de exports/imports de módulos, escopos DEFAULT/REQUEST/TRANSIENT e o mnemônico de custom providers.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 6 erros mais comuns com NestJS',
    type: 'antipatterns',
    pages: 3,
    description: 'Lógica no controller, provider sem exports no módulo, @Res() que bypassa interceptors, request-scoped em singleton (data leak), circular dependency entre módulos e não usar ValidationPipe global.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'NestJS do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental completo com 8 categorias (Módulos, DI, Ciclo de Requisição, Decorators, Guards/Pipes/Interceptors, Testes, Microservices, CLI) e checklist de 10 perguntas para auto-avaliar o domínio.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
  {
    id: 'nestjs-cli',
    title: 'NestJS CLI Ref',
    subtitle: 'nest generate, build, start e decorators rápidos',
    type: 'commands',
    pages: 3,
    description: 'Referência do CLI Nest: nest generate (module, controller, service, guard, pipe, interceptor, filter, middleware), nest build, nest start com opções. Decorators mais usados por categoria com assinaturas.',
    icon: '06',
    goal: 'Consulta de comandos',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Descreva a ordem exata do ciclo de vida de uma requisição NestJS.',
    a: 'A ordem completa é: <strong>1. Middleware</strong> (Express-level, sem contexto Nest) → <strong>2. Guards</strong> (autorização, CanActivate) → <strong>3. Interceptors pre</strong> (antes do handler) → <strong>4. Pipes</strong> (transformação/validação de parâmetros) → <strong>5. Route Handler</strong> (método do controller) → <strong>6. Interceptors post</strong> (após resposta) → <strong>7. Exception Filters</strong> (se exceção lançada). Middlewares rodam antes dos mecanismos NestJS. Guards rodam antes de pipes e interceptors — se retornarem false, lançam ForbiddenException (403).',
    tip: 'Escreva a sigla M-G-I-P-H-I-E de memória (Middleware-Guard-Interceptor-Pipe-Handler-Interceptor-ExceptionFilter). Entrevistadores adoram pedir essa ordem e verificar se você sabe que o interceptor tem DUAS fases (pre e post).',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre Guard, Middleware e Interceptor? Quando usar cada um?',
    a: '<strong>Middleware:</strong> Express-level, acessa req/res brutos, sem contexto NestJS (sem Reflector, sem ExecutionContext). Use para helmet, CORS, parsing. <strong>Guard:</strong> autorização e autenticação, tem ExecutionContext com acesso a metadata de decorators via Reflector. Retorna boolean. Use para JWT, RBAC. <strong>Interceptor:</strong> AOP ao redor do handler via Observable (RxJS). Tem fase PRE e POST. Use para logging de latência, cache, transformar resposta. Regra de ouro: autorização → Guard; comportamento transversal → Interceptor; lógica Express → Middleware.',
    tip: 'Mencione o Reflector nos Guards — é o que permite ler metadata de @SetMetadata() / @Roles(). Isso demonstra que você entende como implementar RBAC real em NestJS.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o sistema de módulos e injeção de dependência do NestJS?',
    a: 'NestJS tem um container IoC (Inversão de Controle) que gerencia providers. <code>@Module({ providers })</code> registra providers no módulo. <code>@Injectable()</code> marca a classe como injetável. O container resolve dependências em grafo acíclico — instancia providers na ordem correta. Por padrão, providers são <strong>singletons por módulo</strong>. Para compartilhar entre módulos: o módulo provedor deve <code>exports</code> o provider, e o módulo consumidor deve <code>imports</code> o módulo provedor.',
    tip: 'O erro mais comum é esquecer o exports ou o imports — CanNotResolveDependencies. Explique o fluxo com um exemplo: UsersModule exporta UsersService; AuthModule importa UsersModule; AuthService pode injetar UsersService.',
  },
  {
    level: 'Senior',
    q: 'O que são escopos de provider (Scope) e qual o impacto de REQUEST-scoped?',
    a: '<strong>DEFAULT (singleton):</strong> uma instância compartilhada por todo o módulo — o padrão. <strong>REQUEST:</strong> nova instância para cada request HTTP — destruída ao fim do request. <strong>TRANSIENT:</strong> nova instância a cada injeção. REQUEST-scoped tem implicação crítica: qualquer provider que injete um REQUEST-scoped também deve ser REQUEST-scoped, ou os dados da primeira requisição vazam para outras (bug de segurança). A propagação de escopo sobe a árvore de dependências.',
    tip: 'O vazamento de dados em REQUEST-scoped injetado em singleton é o bug de segurança mais sério de escopos. Descreva o cenário: singleton recebe instância do primeiro request e nunca atualiza — usuário B vê dados do usuário A.',
  },
  {
    level: 'Pleno',
    q: 'Como implementar autenticação JWT com Guards no NestJS?',
    a: 'Use <code>@nestjs/jwt</code> (JwtModule) + <code>@nestjs/passport</code> (PassportStrategy). Crie JwtStrategy estendendo PassportStrategy(Strategy): valida token em validate(payload). JwtAuthGuard estende AuthGuard("jwt"). Aplique com <code>@UseGuards(JwtAuthGuard)</code> no controller ou globalmente. Para marcar rotas públicas: <code>@Public()</code> custom decorator + JwtAuthGuard verifica o metadata com Reflector.',
    tip: 'Detalhe a estratégia de rotas públicas: sem @Public(), o guard global bloquearia login/register. Com Reflector, o guard verifica se a rota está marcada como pública antes de validar o token.',
  },
  {
    level: 'Senior',
    q: 'O que são módulos dinâmicos e como implementar forRoot() e forRootAsync()?',
    a: 'Módulos dinâmicos retornam <code>DynamicModule</code> — um módulo configurável em runtime. <code>forRoot(options)</code>: configuração síncrona. <code>forRootAsync({ useFactory, inject })</code>: assíncrona, permite injetar ConfigService para ler variáveis de ambiente. <code>forFeature()</code>: registrar entidades/esquemas por módulo (TypeORM, Mongoose). Pattern: estático na classe, dinâmico no método estático que retorna <code>{ module: ClasseDoModulo, providers: [...], exports: [...] }</code>.',
    tip: 'TypeOrmModule.forRootAsync com ConfigService é o exemplo mais cobrado. Explique o inject array: lista de tokens resolvidos pelo container e passados como argumentos para a factory function.',
  },
  {
    level: 'Pleno',
    q: 'Como usar Pipes para validação automática de DTOs?',
    a: 'Instale <code>class-validator</code> e <code>class-transformer</code>. Defina DTO com decorators de validação (<code>@IsEmail</code>, <code>@MinLength</code>, <code>@IsUUID</code>). Registre ValidationPipe globalmente: <code>app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))</code>. <code>whitelist</code> remove campos não decorados. <code>transform</code> converte tipos (string → number, string → Date). Erros geram BadRequestException com detalhes por campo.',
    tip: 'Mencione whitelist: true — sem ele, campos extras chegam ao handler (possível mass assignment vulnerability). É uma regra de segurança, não só de limpeza.',
  },
  {
    level: 'Senior',
    q: 'Como testar unitariamente um Service NestJS com dependências?',
    a: 'Use <code>Test.createTestingModule({ providers: [ServiceUnderTest, { provide: DepService, useValue: { method: jest.fn() } }] })</code>. <code>module.get(ServiceUnderTest)</code> retorna a instância com dependências mockadas. Para repositórios TypeORM: <code>{ provide: getRepositoryToken(Entity), useValue: mockRepo }</code>. Para testes de integração: use <code>@nestjs/testing</code> + SQLite em memória com synchronize: true.',
    tip: 'getRepositoryToken(Entity) é o detalhe que a maioria dos candidatos não conhece — é como NestJS nomeia o token de DI de um repositório TypeORM. Sem isso, o mock de repositório não funciona.',
  },
  {
    level: 'Senior',
    q: 'Como implementar microservices com NestJS?',
    a: 'NestJS suporta vários transportes: TCP, Redis, NATS, RabbitMQ, Kafka, gRPC. No microservice: <code>NestFactory.createMicroservice(AppModule, { transport: Transport.TCP })</code>. Use <code>@MessagePattern("pattern")</code> para handlers de mensagem e <code>@EventPattern("event")</code> para events. No cliente: <code>@nestjs/microservices ClientProxy</code> com <code>send()</code> (request-response) ou <code>emit()</code> (fire-and-forget).',
    tip: 'Diferencie send() vs emit(): send() aguarda resposta (request-response pattern, retorna Observable), emit() é fire-and-forget. Candidatos que sabem essa diferença demonstram experiência prática.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o ClassSerializerInterceptor?',
    a: '<code>ClassSerializerInterceptor</code> (de <code>@nestjs/common</code>) usa <code>class-transformer</code> para serializar a resposta do handler. Aplique <code>@Exclude()</code> em campos sensíveis (senha, token) e <code>@Expose()</code> para controle fino. <strong>Cuidado:</strong> só funciona se o handler retornar instância da classe (não plain object). Não funciona com <code>@Res()</code>.',
    tip: 'Mencione a armadilha: retornar {} em vez de new User() faz o ClassSerializerInterceptor não aplicar as transformações. O retorno deve ser a instância da entidade decorada.',
  },
  {
    level: 'Senior',
    q: 'Como resolver circular dependency entre módulos no NestJS?',
    a: 'Circular dependency acontece quando ModuleA importa ModuleB e ModuleB importa ModuleA. Soluções: <strong>1)</strong> <code>forwardRef(() => ModuleB)</code> em ambos os módulos. <strong>2)</strong> Extrair o provider compartilhado para um módulo separado (SharedModule) — a solução arquiteturalmente correta. <strong>3)</strong> Usar <code>forwardRef</code> no construtor do provider: <code>@Inject(forwardRef(() => ServiceB)) private serviceB: ServiceB</code>.',
    tip: 'Posicione forwardRef como workaround, não solução definitiva. A solução correta é refatorar: criar SharedModule. Candidatos que propõem refatoração mostram maturidade arquitetural.',
  },
  {
    level: 'Pleno',
    q: 'Como implementar WebSockets com NestJS?',
    a: 'Use <code>@WebSocketGateway(port, { cors: ... })</code> na classe. <code>@SubscribeMessage("event")</code> para handlers de mensagem. <code>@WebSocketServer()</code> para injetar o server Socket.IO. Gateways participam do mesmo ciclo de DI — podem injetar services normalmente. Guards, Pipes e Interceptors funcionam via <code>WsGuard</code>, <code>WsPipe</code>.',
    tip: 'Gateways são providers como qualquer outro — podem ser injetados e testados. A diferença é que @SubscribeMessage recebe WebSocket events em vez de HTTP requests.',
  },
  {
    level: 'Senior',
    q: 'O que são custom providers e qual a diferença entre useClass, useValue e useFactory?',
    a: '<strong>useClass:</strong> troca a implementação da classe (estratégia, environment-based). <strong>useValue:</strong> injeta um valor já instanciado — constante, config, mock para testes. <strong>useFactory:</strong> função que cria o provider, pode ser async, recebe injeções via <code>inject: []</code>. Todos usam um token: pode ser a classe, string, Symbol ou <code>InjectionToken<T></code>. Para injetar por token: <code>@Inject("TOKEN") private client: Redis</code>.',
    tip: 'useFactory async é o pattern de forRootAsync — aguarda Promise antes de injetar. Explique como isso permite conectar ao banco antes da aplicação iniciar (o container aguarda a factory resolver).',
  },
  {
    level: 'Pleno',
    q: 'Como configurar CORS, Helmet e Rate Limiting no NestJS?',
    a: '<code>app.enableCors({ origin: [...], credentials: true })</code> para CORS. <code>app.use(helmet())</code> para headers de segurança. Rate limiting: <code>@nestjs/throttler</code> com <code>ThrottlerModule.forRoot</code> + <code>ThrottlerGuard</code> globalmente. <code>@Throttle({ limit, ttl })</code> por rota para override. Em Kubernetes com múltiplos pods, use Redis store para rate limiting compartilhado entre instâncias.',
    tip: 'Mencione o ThrottlerRedisStorage para produção com múltiplos pods. Throttling com estado em memória por pod significa que cada pod tem limite individual — o rate limit real é N × limit.',
  },
  {
    level: 'Senior',
    q: 'Como implementar health checks para Kubernetes no NestJS?',
    a: 'Use <code>@nestjs/terminus</code>: <code>HealthModule</code> com <code>HealthController</code> que injeta <code>HealthCheckService</code>. <code>TypeOrmHealthIndicator</code>, <code>HttpHealthIndicator</code>, <code>MemoryHealthIndicator</code>, <code>DiskHealthIndicator</code>. <code>/health/live</code>: liveness (processo vivo). <code>/health/ready</code>: readiness (DB acessível, dependências ok). Liveness NÃO deve verificar DB — se o DB cair, o k8s não derruba os pods.',
    tip: 'Separar liveness de readiness é a resposta sênior. Explicar por que liveness não deve verificar DB (cascata de falhas) demonstra entendimento de operações em produção.',
  },
  {
    level: 'Senior',
    q: 'Como estruturar um projeto NestJS para escalar o time?',
    a: 'Organize por domínio de negócio (UsersModule, AuthModule, PostsModule) — não por camada técnica. Cada módulo encapsula controller, service, repository e DTOs. Shared/ para módulos transversais (DatabaseModule, LoggingModule, ConfigModule). Core/ para pipes, guards, interceptors globais. DTOs separados de entidades — evita vazar campos sensíveis. Use Barrel exports (index.ts) por módulo.',
    tip: 'Mencione a separação DTO ≠ Entidade como regra de arquitetura. O entrevistador que pergunta isso quer saber se você sabe manter um codebase NestJS com múltiplos devs sem caos.',
  },
  {
    level: 'Pleno',
    q: 'Quais os lifecycle hooks do NestJS e quando usar?',
    a: '<strong>OnModuleInit:</strong> após o módulo ser inicializado — conectar a serviços externos. <strong>OnApplicationBootstrap:</strong> após toda a aplicação inicializar — seeds, warmup de cache. <strong>OnModuleDestroy:</strong> ao receber sinal de shutdown — fechar conexões do módulo. <strong>OnApplicationShutdown:</strong> ao finalizar a aplicação — cleanup global. Para hooks de shutdown: <code>app.enableShutdownHooks()</code> obrigatório.',
    tip: 'enableShutdownHooks() é esquecido por 80% dos candidatos — sem ele, OnModuleDestroy e OnApplicationShutdown nunca rodam. Mencionar isso demonstra experiência em produção.',
  },
  {
    level: 'Senior',
    q: 'Como usar Interceptors para caching com Redis?',
    a: 'Implemente <code>NestInterceptor</code>: na fase PRE, verifique Redis com a chave (ex: URL + user ID). Se cache hit, retorne <code>of(cachedValue)</code> em vez de <code>next.handle()</code>. Se cache miss, use <code>next.handle().pipe(tap(response => redis.set(key, response, "EX", ttl)))</code> para cachear a resposta. NestJS tem <code>CacheInterceptor</code> pronto, mas customizar permite cache por usuário e invalidação granular.',
    tip: 'Detalhe a chave de cache: URL + usuário evita vazamento de dados entre usuários. CacheInterceptor padrão usa apenas a URL — por isso um interceptor custom é necessário para dados autenticados.',
  },
  {
    level: 'Pleno',
    q: 'Como usar @nestjs/config com ConfigService e validação de variáveis de ambiente?',
    a: '<code>ConfigModule.forRoot({ validationSchema: Joi.object({ PORT: Joi.number().default(3000) }) })</code>. Injete <code>ConfigService</code> e use <code>config.get<string>("DATABASE_URL")</code> com type generic. Para configuração tipada: <code>ConfigModule.forRoot({ load: [databaseConfig] })</code> com namespaced configs. <code>envFilePath</code> para múltiplos .env por ambiente.',
    tip: 'Validação com Joi no forRoot é o que diferencia projeto profissional de amador — aplicação não sobe se variável obrigatória faltando. Mencione isso como regra de segurança de deploy.',
  },
  {
    level: 'Senior',
    q: 'Descreva como implementar Soft Delete com TypeORM no NestJS.',
    a: 'Adicione <code>@DeleteDateColumn() deletedAt: Date | null</code> na entidade. TypeORM filtra automaticamente registros com <code>deletedAt != null</code>. <code>repo.softDelete(id)</code> preenche deletedAt. <code>repo.restore(id)</code> limpa deletedAt. Armadilha: <code>@IsUnique email</code> + soft delete precisa de índice parcial <code>WHERE deletedAt IS NULL</code> para permitir re-cadastro do mesmo e-mail.',
    tip: 'O índice parcial é o detalhe que sênior deve mencionar. Sem ele, não é possível recadastrar um e-mail de usuário deletado — ou pior, a UNIQUE constraint nunca é violada (dependendo do banco).',
  },
  {
    level: 'Pleno',
    q: 'Como usar @UseInterceptors(FileInterceptor) para upload de arquivos?',
    a: '<code>@nestjs/platform-express</code> + <code>multer</code>. <code>@UploadedFile()</code> para arquivo único, <code>@UploadedFiles()</code> para múltiplos. Configure <code>MulterModule.register({ storage: diskStorage({ ... }) })</code>. Validação de tipo/tamanho via <code>FileInterceptor("field", { limits: { fileSize: 5MB } })</code>. Para S3: use <code>multer-s3</code> como storage engine.',
    tip: 'Mencione validação de MIME type no FileInterceptor — sem ela, um atacante pode fazer upload de arquivo .exe renomeado como .jpg. É um item de segurança, não só de UX.',
  },
  {
    level: 'Senior',
    q: 'Como implementar Exception Filters para transformar erros de ORM em HTTP?',
    a: 'Crie <code>@Catch(EntityNotFoundError)</code> para capturar <code>TypeORM EntityNotFoundError</code> e retornar 404. <code>@Catch(QueryFailedError)</code> para erros de constraint (email duplicado → 409 ConflictException). Aplique globalmente com <code>app.useGlobalFilters()</code>. Isso mantém os services desacoplados de HTTP — service lança erros de domínio, filter traduz para HTTP.',
    tip: 'O princípio de desacoplamento é a resposta sênior: service não deve conhecer HTTP status codes. Usar exception filters para a tradução mantém a camada de serviço testável sem HTTP context.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: '@Module()', sig: '@Module({ imports, controllers, providers, exports })', desc: 'Declara um módulo NestJS. Providers são privados por padrão — use exports para compartilhar.' },
  { name: '@Controller()', sig: '@Controller("prefixo")', desc: 'Registra controller com prefixo de rota. Métodos mapeados com @Get, @Post etc.' },
  { name: '@Injectable()', sig: '@Injectable({ scope?: Scope })', desc: 'Marca como provider injetável. Scope: DEFAULT (singleton), REQUEST, TRANSIENT.' },
  { name: '@UseGuards()', sig: '@UseGuards(Guard1, Guard2)', desc: 'Aplica guards ao controller ou método. Guards rodam antes de pipes e interceptors.' },
  { name: '@UseInterceptors()', sig: '@UseInterceptors(Interceptor)', desc: 'Aplica interceptor com fases PRE (antes) e POST (após) o handler.' },
  { name: '@UsePipes()', sig: '@UsePipes(new ValidationPipe())', desc: 'Aplica pipe de validação/transformação ao controller ou método.' },
  { name: '@UseFilters()', sig: '@UseFilters(new ExceptionFilter())', desc: 'Aplica exception filter ao controller ou método.' },
  { name: '@Param() / @Query()', sig: '@Param("id", ParseUUIDPipe) id: string', desc: 'Extrai parâmetro de rota ou query string. Pipe como segundo argumento para conversão.' },
  { name: '@Body()', sig: '@Body() dto: CreateUserDto', desc: 'Extrai corpo da requisição. ValidationPipe valida automaticamente se global.' },
  { name: '@InjectRepository()', sig: '@InjectRepository(Entity) repo: Repository<Entity>', desc: 'Injeta repositório TypeORM. Token resolvido com getRepositoryToken(Entity).' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'Lógica de negócio no Controller — vai no Service' },
  { ok: false, t: '@Res() bypass interceptors e exception filters' },
  { ok: false, t: 'Injetar REQUEST-scoped em singleton → data leak entre usuários' },
  { ok: false, t: 'Esquecer exports no módulo → CanNotResolveDependencies' },
  { ok: false, t: 'Esquecer app.enableShutdownHooks() → lifecycle hooks não rodam' },
  { ok: true, t: 'ValidationPipe global com whitelist: true → segurança contra mass assignment' },
  { ok: true, t: 'forwardRef() para circular dependency, mas prefira SharedModule' },
  { ok: true, t: 'useGlobalPipes/Guards/Interceptors/Filters no main.ts para aplicação global' },
  { ok: true, t: 'getRepositoryToken(Entity) para mock de repositório em testes' },
  { ok: true, t: 'ClassSerializerInterceptor + @Exclude() para nunca vazar senha/tokens' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Ciclo de requisição: "Muito Gato Injeta Pipe, Handler Intercepta Erros"',
    trick: 'M-G-I-P-H-I-E',
    expansion: [
      ['M', 'Middleware (Express-level)'],
      ['G', 'Guard (autorização)'],
      ['I', 'Interceptor PRE'],
      ['P', 'Pipe (validação/transformação)'],
      ['H', 'Handler (método do controller)'],
      ['I', 'Interceptor POST'],
      ['E', 'Exception Filter'],
    ],
    explanation: 'A ordem exata do ciclo de vida de uma requisição NestJS. Interceptor aparece duas vezes (PRE e POST).',
    example: 'Guard retorna false → ForbiddenException → Exception Filter captura → 403',
    why: 'A ordem do ciclo de vida é A pergunta de NestJS em entrevistas sênior. Saber de cor é obrigatório.',
  },
  {
    label: 'Guard vs Middleware: "Guard sabe Quem, Middleware não sabe Nada"',
    trick: 'GUARD=QUEM, MIDDLEWARE=NADA',
    expansion: [
      ['Guard sabe Quem', 'ExecutionContext: classe, método, decorators (Reflector), usuário autenticado'],
      ['Middleware não sabe Nada', 'Apenas req/res Express brutos — sem contexto NestJS, sem metadata'],
    ],
    explanation: 'Guard tem acesso ao contexto do NestJS (Reflector, metadata). Middleware é Express puro.',
    example: '@Roles("admin") só funciona em Guard (Reflector), não em Middleware',
    why: 'A confusão entre Guard e Middleware é o erro mais frequente de quem vem do Express puro para o NestJS.',
  },
  {
    label: 'Módulos: "EXporta, IMporta — sem isso, CanNot!"',
    trick: 'EX-IM ou CanNot',
    expansion: [
      ['EX = exports', 'Módulo provedor coloca o service em exports'],
      ['IM = imports', 'Módulo consumidor coloca o módulo provedor em imports'],
      ['CanNot', 'CanNotResolveDependencies se um dos dois faltar'],
    ],
    explanation: 'Compartilhar um provider entre módulos exige DOIS passos: exports + imports.',
    example: 'EmailModule exports EmailService → AuthModule imports EmailModule → AuthService injeta EmailService',
    why: 'É o erro de runtime mais frequente em NestJS. Saber a regra resolve em segundos o que leva horas sem saber.',
  },
  {
    label: 'Escopos: "DEFAULT Divide, REQUEST Isola, TRANSIENT Duplica"',
    trick: 'D-I-D',
    expansion: [
      ['DEFAULT Divide', 'Singleton — UMA instância compartilhada por todo o módulo'],
      ['REQUEST Isola', 'Nova instância por request — dados isolados entre usuários'],
      ['TRANSIENT Duplica', 'Nova instância a cada injeção — nunca compartilhada'],
    ],
    explanation: 'Escolha o escopo pelo isolamento necessário. REQUEST-scoped contamina singletons que o injetam.',
    example: 'REQUEST no UserContext + DEFAULT no LoggerService = bug de segurança (dados do usuário A no usuário B)',
    why: 'Scope leak é o bug silencioso mais perigoso em NestJS — dados de um usuário visíveis para outro.',
  },
  {
    label: 'Custom Providers: "Class Troca, Value Fixa, Factory Cria"',
    trick: 'C-V-F',
    expansion: [
      ['useClass Troca', 'Substitui implementação — mock em teste, variante por env'],
      ['useValue Fixa', 'Valor já instanciado — config, constante, mock simples'],
      ['useFactory Cria', 'Função assíncrona — conecta a serviços antes de injetar'],
    ],
    explanation: 'Três formas de registrar providers customizados além da classe direta.',
    example: 'useFactory + async + inject: [ConfigService] = forRootAsync pattern',
    why: 'useFactory é o mecanismo de forRootAsync — entendê-lo é fundamental para qualquer integração (TypeORM, Redis, Stripe etc.).',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Lógica de negócio no Controller',
    badDesc: 'Queries, hashing, validação de negócio — tudo que não é HTTP vai no Service',
    badCode: [
      { t: '@Post()\n', c: C }, { t: 'async create(@Body() dto) {\n' },
      { t: '  // ❌ lógica no controller\n', c: '#ef4444' },
      { t: '  if (await this.db.exists(dto.email))\n', c: '#ef4444' },
      { t: '    throw new ConflictException()\n', c: '#ef4444' },
      { t: '  const h = await bcrypt.hash(dto.pw, 10)\n', c: '#ef4444' },
      { t: '  return this.db.save({...dto, password: h})\n}', c: '#e2e8f0' },
    ],
    goodDesc: 'Controller extrai dados do HTTP e delega ao service — sem lógica de negócio',
    goodCode: [
      { t: '@Post()\n', c: C }, { t: 'async create(@Body() dto: CreateUserDto) {\n' },
      { t: '  return ', c: '#e2e8f0' }, { t: 'this.usersService.create(dto)\n', c: '#4ade80' },
      { t: '  // service contém a lógica\n}', c: '#4ade80' },
    ],
    why: 'Controller no Service = impossível testar unitariamente sem HTTP. Service desacoplado = testável com jest.fn() simples.',
  },
  {
    title: 'Provider sem exports / módulo sem imports',
    badDesc: 'CanNotResolveDependencies — esquecer exports ou imports é o erro mais frequente em NestJS',
    badCode: [
      { t: '// EmailModule — sem exports\n', c: '#ef4444' },
      { t: '@Module({ providers: [EmailService] })\n', c: '#ef4444' },
      { t: 'class EmailModule {}\n\n', c: '#e2e8f0' },
      { t: '// AuthModule — sem imports\n', c: '#ef4444' },
      { t: '@Module({ providers: [AuthService] })\n', c: '#ef4444' },
      { t: 'class AuthModule {}\n', c: '#e2e8f0' },
      { t: '// AuthService injeta EmailService → ERRO\n', c: '#ef4444' },
    ],
    goodDesc: 'Módulo provedor usa exports; módulo consumidor usa imports — ambos necessários',
    goodCode: [
      { t: '@Module({ providers: [EmailService], ', c: '#e2e8f0' },
      { t: 'exports: [EmailService]', c: '#4ade80' }, { t: ' })\n', c: '#e2e8f0' },
      { t: 'class EmailModule {}\n\n', c: '#e2e8f0' },
      { t: '@Module({ ', c: '#e2e8f0' }, { t: 'imports: [EmailModule],', c: '#4ade80' },
      { t: '\n  providers: [AuthService] })\n', c: '#e2e8f0' },
      { t: 'class AuthModule {}', c: '#e2e8f0' },
    ],
    why: 'Providers são encapsulados por módulo. Sem exports + imports, o container não sabe onde achar a dependência.',
  },
  {
    title: '@Res() que bypassa interceptors',
    badDesc: '@Res() com res.send() pula ClassSerializerInterceptor, CacheInterceptor e exception filters',
    badCode: [
      { t: '@Get(":id")\n', c: C },
      { t: 'async findOne(\n  @Param("id") id: string,\n', c: '#e2e8f0' },
      { t: '  @Res() res: Response // ❌ bypassa tudo\n', c: '#ef4444' },
      { t: ') {\n  const user = await this.service.find(id)\n', c: '#e2e8f0' },
      { t: '  res.json(user) // interceptors não rodam!\n}', c: '#ef4444' },
    ],
    goodDesc: 'Retorne o valor diretamente do handler — interceptors e exception filters funcionam normalmente',
    goodCode: [
      { t: '@Get(":id")\n', c: C },
      { t: 'async findOne(\n  @Param("id", ParseUUIDPipe) id: string\n', c: '#e2e8f0' },
      { t: '  // ✅ sem @Res() — interceptors funcionam\n', c: '#4ade80' },
      { t: '): Promise<UserDto> {\n', c: '#e2e8f0' },
      { t: '  return ', c: '#e2e8f0' }, { t: 'this.service.findById(id)\n}', c: '#4ade80' },
    ],
    why: 'NestJS interceptors só são acionados quando o handler retorna um valor. res.send() bypassa o mecanismo de retorno.',
  },
  {
    title: 'REQUEST-scoped injetado em singleton (data leak)',
    badDesc: 'Singleton recebe instância do primeiro request — todos os usuários subsequentes compartilham os mesmos dados',
    badCode: [
      { t: '@Injectable({ scope: Scope.REQUEST })\n', c: '#ef4444' },
      { t: 'class UserContext { user: User }\n\n', c: '#e2e8f0' },
      { t: '// ❌ singleton injeta REQUEST-scoped\n', c: '#ef4444' },
      { t: '@Injectable() // DEFAULT = singleton\n', c: '#ef4444' },
      { t: 'class LoggerService {\n', c: '#e2e8f0' },
      { t: '  constructor(private ctx: UserContext) {} // LEAK!\n}', c: '#ef4444' },
    ],
    goodDesc: 'LoggerService também REQUEST-scoped, ou receba o usuário via parâmetro de método',
    goodCode: [
      { t: '// ✅ LoggerService também é REQUEST-scoped\n', c: '#4ade80' },
      { t: '@Injectable({ scope: Scope.REQUEST })\n', c: '#4ade80' },
      { t: 'class LoggerService {\n  constructor(private ctx: UserContext) {}\n}\n\n', c: '#e2e8f0' },
      { t: '// ✅ Ou: parâmetro explícito\n', c: '#4ade80' },
      { t: '@Injectable()\nclass LoggerService {\n', c: '#e2e8f0' },
      { t: '  log(msg: string, user: User) {}\n}', c: '#4ade80' },
    ],
    why: 'Singleton NestJS é instanciado uma vez. REQUEST-scoped injetado nele fica preso na instância do primeiro request. Bug de segurança grave.',
  },
]

// ── Dados: Mind Map ───────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Módulos',
    color: C,
    items: [
      { t: '@Module (imports, controllers, providers, exports)', k: true },
      { t: 'exports para compartilhar providers', k: true },
      { t: 'Módulos dinâmicos (forRoot/forRootAsync)', a: true },
      { t: 'forFeature para entidades/escopos', k: true },
      { t: 'Circular dependency → forwardRef', a: true },
    ],
  },
  {
    label: 'DI Container',
    color: AMB,
    items: [
      { t: '@Injectable({ scope })', k: true },
      { t: 'DEFAULT / REQUEST / TRANSIENT', k: true },
      { t: 'useClass / useValue / useFactory', a: true },
      { t: 'InjectionToken<T>', a: true },
      { t: '@Inject("TOKEN")', a: true },
    ],
  },
  {
    label: 'Ciclo de Requisição',
    color: SKY,
    items: [
      { t: 'Middleware → Guard → Interceptor(pre)', k: true },
      { t: '→ Pipe → Handler → Interceptor(post)', k: true },
      { t: '→ Exception Filter', k: true },
      { t: 'enableShutdownHooks() para lifecycle', a: true },
    ],
  },
  {
    label: 'Guards & Autorização',
    color: GRN,
    items: [
      { t: 'CanActivate → true/false → 403', k: true },
      { t: 'ExecutionContext + Reflector', k: true },
      { t: 'JwtAuthGuard (passport)', k: true },
      { t: 'RolesGuard + @Roles()', a: true },
      { t: '@Public() para rotas abertas', a: true },
    ],
  },
  {
    label: 'Pipes & Validação',
    color: PRP,
    items: [
      { t: 'ValidationPipe + class-validator', k: true },
      { t: 'whitelist + forbidNonWhitelisted', k: true },
      { t: 'transform: true (string→number)', k: true },
      { t: 'ParseUUIDPipe, ParseIntPipe', k: true },
      { t: 'Custom pipe: PipeTransform', a: true },
    ],
  },
  {
    label: 'Testes',
    color: '#f472b6',
    items: [
      { t: 'Test.createTestingModule()', k: true },
      { t: 'overrideProvider + useValue (mock)', k: true },
      { t: 'getRepositoryToken(Entity)', k: true },
      { t: 'supertest para e2e', a: true },
      { t: 'SQLite in-memory para integração', a: true },
    ],
  },
  {
    label: 'Microservices',
    color: GOLD,
    items: [
      { t: 'Transport: TCP, Redis, NATS, Kafka', a: true },
      { t: '@MessagePattern / @EventPattern', a: true },
      { t: 'send() vs emit()', a: true },
      { t: 'Hybrid app (HTTP + microservice)', a: true },
    ],
  },
  {
    label: 'CLI & Tooling',
    color: '#94a3b8',
    items: [
      { t: 'nest generate module/service/controller', k: true },
      { t: 'nest g guard/pipe/interceptor/filter', k: true },
      { t: 'nest build / nest start --watch', k: true },
      { t: '@nestjs/config + Joi validation', k: true },
      { t: '@nestjs/terminus (health checks)', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Consigo desenhar o ciclo M-G-I-P-H-I-E de memória?',
  'Sei a diferença entre Guard, Middleware e Interceptor?',
  'Entendo como exports/imports compartilham providers entre módulos?',
  'Sei implementar JwtAuthGuard com @Public() para rotas abertas?',
  'Consigo configurar ValidationPipe global com whitelist?',
  'Sei o que é scope REQUEST e por que vazar em singleton é crítico?',
  'Entendo useFactory assíncrono para forRootAsync?',
  'Consigo testar Service com repositório mockado (getRepositoryToken)?',
  'Sei configurar health checks separando liveness de readiness?',
  'Entendo ClassSerializerInterceptor e quando ele NÃO funciona (@Res)?',
]

// ── Dados: CLI Ref ─────────────────────────────────────────────────────────────

const CLI_COMMANDS: CommandEntry[] = [
  {
    command: 'nest generate module <nome>',
    description: 'Gera módulo com arquivo de módulo e atualiza AppModule',
    flags: [{ flag: '--no-spec', description: 'Sem arquivo de teste' }],
    example: 'nest g module users',
    category: 'Scaffolding',
  },
  {
    command: 'nest generate controller <nome>',
    description: 'Gera controller com spec e registra no módulo mais próximo',
    flags: [{ flag: '--flat', description: 'Sem subdiretório' }],
    example: 'nest g controller users/users',
    category: 'Scaffolding',
  },
  {
    command: 'nest generate service <nome>',
    description: 'Gera service @Injectable com spec',
    example: 'nest g service users/users',
    category: 'Scaffolding',
  },
  {
    command: 'nest generate guard <nome>',
    description: 'Gera guard com CanActivate skeleton',
    example: 'nest g guard common/jwt-auth',
    category: 'Scaffolding',
  },
  {
    command: 'nest generate interceptor <nome>',
    description: 'Gera interceptor NestInterceptor com intercept() skeleton',
    example: 'nest g interceptor common/logging',
    category: 'Scaffolding',
  },
  {
    command: 'nest generate pipe <nome>',
    description: 'Gera pipe PipeTransform com transform() skeleton',
    example: 'nest g pipe common/parse-positive-int',
    category: 'Scaffolding',
  },
  {
    command: 'nest generate filter <nome>',
    description: 'Gera exception filter com @Catch() skeleton',
    example: 'nest g filter common/http-exception',
    category: 'Scaffolding',
  },
  {
    command: 'nest generate middleware <nome>',
    description: 'Gera middleware NestMiddleware com use() skeleton',
    example: 'nest g middleware common/logger',
    category: 'Scaffolding',
  },
  {
    command: 'nest build',
    description: 'Compila TypeScript para dist/ (tsc ou webpack)',
    flags: [
      { flag: '--webpack', description: 'Bundle com webpack em vez de tsc' },
      { flag: '--watch', description: 'Modo watch' },
    ],
    example: 'nest build --webpack',
    category: 'Build',
  },
  {
    command: 'nest start',
    description: 'Inicia aplicação (compila e executa)',
    flags: [
      { flag: '--watch', description: 'Reinicia ao mudar arquivos (dev)' },
      { flag: '--debug', description: 'Inicia com --inspect do Node.js' },
    ],
    example: 'nest start --watch',
    category: 'Dev',
  },
  {
    command: 'nest info',
    description: 'Exibe versões do NestJS, Node.js e dependências instaladas',
    example: 'nest info',
    category: 'Info',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'NestJS',
    stackLabel: 'Backend · Framework',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'NestJS',
    accentColor: C,
    stackLabel: 'Backend · Framework',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['@Module()', 'Declara módulo — imports/providers/exports'],
        ['@Injectable()', 'Marca provider para DI container'],
        ['@Controller()', 'Define prefixo de rota'],
        ['CanActivate', 'Interface de Guard (retorna boolean)'],
        ['NestInterceptor', 'Interface de Interceptor (retorna Observable)'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'ValidationPipe global com whitelist: true (segurança)',
        'ClassSerializerInterceptor + @Exclude() para nunca vazar dados',
        'app.enableShutdownHooks() para lifecycle hooks funcionarem',
        'REQUEST scope contamina singletons — use com cuidado',
        'forwardRef() para circular dependency, SharedModule como alternativa',
        'getRepositoryToken(Entity) para mockar repositórios em testes',
      ],
      patterns: [
        {
          name: 'Guard global com rota pública',
          code: `// main.ts
app.useGlobalGuards(new JwtAuthGuard())

// rota pública
@Public()
@Post('login')
login(@Body() dto: LoginDto) {}`,
          desc: 'Guard global + @Public() decorator para exceções',
        },
        {
          name: 'ValidationPipe global',
          code: `app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}))`,
          desc: 'Remove extras, proíbe campos não mapeados, converte tipos',
        },
        {
          name: 'Custom provider useFactory',
          code: `{
  provide: 'REDIS',
  useFactory: async (cfg: ConfigService) =>
    new Redis({ host: cfg.get('REDIS_HOST') }),
  inject: [ConfigService]
}`,
          desc: 'Criação assíncrona de provider com injeção',
        },
      ],
      mentalModels: [
        'M-G-I-P-H-I-E: ordem do ciclo de vida de requisição',
        'Guard = quem pode; Pipe = o quê é válido; Interceptor = como responder',
        'EXporta + IMporta = provider compartilhado entre módulos',
        'useFactory async = forRootAsync pattern para conexões',
        'ClassSerializer + @Exclude() = nunca vazar campos sensíveis',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'NestJS',
    stackLabel: 'Backend · Framework',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'NestJS',
    stackLabel: 'Backend · Framework',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'NestJS',
    stackLabel: 'Backend · Framework',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de ir a uma entrevista sênior.',
  }),
  commands: () => buildCommandRefPdf({
    commands: CLI_COMMANDS,
    skillName: 'NestJS',
    accentColor: C,
    stackLabel: 'Backend · Framework',
    coverTitle: 'NestJS CLI Reference',
    coverSubtitle: 'Scaffolding, build e decorators rápidos',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function NestjsPdfs() {
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
