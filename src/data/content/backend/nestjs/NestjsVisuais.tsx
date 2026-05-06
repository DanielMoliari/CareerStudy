'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { HookTimeline } from '@/components/visuals/HookTimeline'
import type { TimelinePhase } from '@/components/visuals/HookTimeline'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

// ── Paleta NestJS ─────────────────────────────────────────────────────────────
const C      = '#E0234E'   // NestJS red
const BG     = '#0f172a'
const CARD   = '#1e293b'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const MUTE   = '#475569'
const RED    = '#ef4444'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'

void CARD; void FG; void FGMUTE; void MUTE; void RED

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Módulos e DI Container (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const DI_LAYERS: Layer[] = [
  {
    id: 'ioc-container',
    label: 'Container IoC',
    sublabel: 'Gerencia instâncias, escopos e injeção de dependências',
    color: MUTE,
    description: 'O container central do NestJS. Resolve dependências em grafo acíclico, cria instâncias com escopos corretos e gerencia o ciclo de vida dos providers.',
    examples: ['Instanciação lazy na primeira injeção', 'Singleton por padrão (por módulo)', 'resolve() para injeção dinâmica', 'Tokens: class, string, Symbol, InjectionToken'],
  },
  {
    id: 'service',
    label: 'Service / Provider',
    sublabel: '@Injectable() — lógica de negócio injetável',
    color: GRN,
    description: 'O coração da aplicação. @Injectable() marca a classe para o container IoC. Injeção no construtor: constructor(private usersService: UsersService).',
    examples: ['Lógica de negócio', 'Acesso a repositórios / ORMs', 'Escopos: DEFAULT (singleton), REQUEST, TRANSIENT'],
  },
  {
    id: 'controller',
    label: 'Controller',
    sublabel: '@Controller("users") — mapeia rotas HTTP para handlers',
    color: SKY,
    description: 'Responsável apenas por receber request, extrair dados e chamar o service. Sem lógica de negócio no controller.',
    examples: ['@Get, @Post, @Put, @Delete, @Patch', '@Param, @Body, @Query, @Headers', '@UseGuards, @UsePipes, @UseInterceptors'],
  },
  {
    id: 'feature-module',
    label: 'Feature Module',
    sublabel: '@Module({ ... }) — UsersModule, AuthModule, PostsModule',
    color: AMB,
    description: 'Módulos de funcionalidade encapsulam um domínio. exports torna providers disponíveis para módulos que importarem este.',
    examples: ['controllers: [UsersController]', 'providers: [UsersService, UsersRepository]', 'exports: [UsersService] — compartilha com outros módulos'],
  },
  {
    id: 'app-module',
    label: 'AppModule (Root)',
    sublabel: '@Module({ imports, controllers, providers, exports })',
    color: C,
    description: 'O módulo raiz importa todos os outros módulos. NestFactory.create(AppModule) inicia o container IoC a partir daqui.',
    examples: ['imports: [UsersModule, AuthModule]', 'providers: [AppService]', 'Módulo raiz — bootstrap entry point'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Ciclo de vida de uma requisição (HookTimeline)
// ═══════════════════════════════════════════════════════════════════════════════

const REQUEST_LIFECYCLE: TimelinePhase[] = [
  {
    id: 'middleware',
    emoji: '🔧',
    name: 'Middleware',
    color: '#94a3b8',
    short: 'Express-level, antes do Nest',
    detail: 'Express-level. Acesso a req/res brutos. Sem contexto NestJS. Registrado via configure(consumer) no módulo. Uso: CORS manual, parsing de cookies, logging de request bruto.',
    code: [
      [{ text: '@Injectable()' }],
      [{ text: 'class LogMiddleware implements NestMiddleware {' }],
      [{ text: '  use(req: Request, res: Response, next: () => void) {' }],
      [{ text: "    console.log(`${req.method} ${req.url}`)" }],
      [{ text: '    next()' }],
      [{ text: '  }' }],
      [{ text: '}' }],
    ],
  },
  {
    id: 'guard',
    emoji: '🛡️',
    name: 'Guard',
    color: GRN,
    short: 'Autorização — CanActivate',
    detail: 'AUTORIZAÇÃO. Implementa CanActivate. Acessa ExecutionContext (classe, método, decorators via Reflector). Retorna true (continua) ou false (lança ForbiddenException). Roda ANTES de pipes e interceptors.',
    code: [
      [{ text: '@Injectable()' }],
      [{ text: 'class JwtAuthGuard implements CanActivate {' }],
      [{ text: '  canActivate(ctx: ExecutionContext): boolean {' }],
      [{ text: '    const req = ctx.switchToHttp().getRequest()' }],
      [{ text: "    const token = req.headers.authorization?.split(' ')[1]" }],
      [{ text: '    return this.jwt.verify(token)' }],
      [{ text: '  }' }],
      [{ text: '}' }],
    ],
  },
  {
    id: 'interceptor-pre',
    emoji: '🔄',
    name: 'Interceptor (pre)',
    color: AMB,
    short: 'AOP ao redor do handler — fase PRE',
    detail: 'AOP ao redor do handler. Fase PRE: antes do handler. Use para logging de entrada, adicionar headers, iniciar timer, transformar input. Retorna Observable — encapsula toda a execução.',
    code: [
      [{ text: '@Injectable()' }],
      [{ text: 'class LoggingInterceptor implements NestInterceptor {' }],
      [{ text: '  intercept(ctx: ExecutionContext, next: CallHandler) {' }],
      [{ text: '    const start = Date.now()' }],
      [{ text: '    return next.handle().pipe(' }],
      [{ text: '      tap(() => console.log(`${Date.now() - start}ms`))' }],
      [{ text: '    )' }],
      [{ text: '  }' }],
      [{ text: '}' }],
    ],
  },
  {
    id: 'pipe',
    emoji: '🔩',
    name: 'Pipe',
    color: SKY,
    short: 'Transformação e validação do input',
    detail: 'TRANSFORMAÇÃO e VALIDAÇÃO do input. ValidationPipe + class-validator valida DTOs automaticamente. ParseIntPipe, ParseUUIDPipe convertem tipos. Erro = BadRequestException (400).',
    code: [
      [{ text: 'app.useGlobalPipes(new ValidationPipe({' }],
      [{ text: '  whitelist: true,' }],
      [{ text: '  forbidNonWhitelisted: true,' }],
      [{ text: '  transform: true,' }],
      [{ text: '}))' }],
      [{ text: '' }],
      [{ text: "@Get(':id')" }],
      [{ text: 'findOne(@Param(\'id\', ParseUUIDPipe) id: string) {}' }],
    ],
  },
  {
    id: 'handler',
    emoji: '⚡',
    name: 'Route Handler',
    color: C,
    short: 'Método do controller',
    detail: 'O método do controller com @Get/@Post/@Put etc. Aqui fica a chamada ao service. Sem lógica de negócio — apenas extrai dados do request e delega.',
    code: [
      [{ text: "@Get(':id')" }],
      [{ text: '@UseGuards(JwtAuthGuard)' }],
      [{ text: 'async findOne(' }],
      [{ text: "  @Param('id', ParseUUIDPipe) id: string" }],
      [{ text: '): Promise<UserDto> {' }],
      [{ text: '  return this.usersService.findById(id)' }],
      [{ text: '}' }],
    ],
  },
  {
    id: 'exception-filter',
    emoji: '🚨',
    name: 'Exception Filter',
    color: RED,
    short: 'Captura exceções não tratadas',
    detail: 'Captura exceções não tratadas. Implementa ExceptionFilter. Pode ser global, por controller ou por handler. Formata a resposta de erro de forma consistente para toda a API.',
    code: [
      [{ text: '@Catch(HttpException)' }],
      [{ text: 'class HttpExceptionFilter implements ExceptionFilter {' }],
      [{ text: '  catch(exception: HttpException, host: ArgumentsHost) {' }],
      [{ text: '    const ctx = host.switchToHttp()' }],
      [{ text: '    const status = exception.getStatus()' }],
      [{ text: '    ctx.getResponse().status(status).json({' }],
      [{ text: '      statusCode: status,' }],
      [{ text: '      message: exception.message,' }],
      [{ text: '    })' }],
      [{ text: '  }' }],
      [{ text: '}' }],
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Decorators (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const DECORATOR_SLIDES: Slide[] = [
  {
    title: 'Decorators de Classe',
    paragraphs: [
      '@Module({ imports, controllers, providers, exports }) — declara um módulo NestJS',
      '@Controller("prefixo") — registra controller com prefixo de rota',
      '@Injectable({ scope }) — marca como provider injetável',
      '@Catch(ExceptionClass) — exception filter para tipo específico',
    ],
    gradient: [C, '#6d0f25'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 2, padding: 16 }}>
        <div><span style={{ color: C }}>@Module</span>({'({'}</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>imports</span>: [<span style={{ color: AMB }}>TypeOrmModule</span>],</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>controllers</span>: [<span style={{ color: GRN }}>UsersController</span>],</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>providers</span>: [<span style={{ color: PRP }}>UsersService</span>],</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>exports</span>: [<span style={{ color: PRP }}>UsersService</span>],</div>
        <div>{'})'}</div>
        <div><span style={{ color: AMB }}>export</span> <span style={{ color: PRP }}>class</span> <span style={{ color: GRN }}>UsersModule</span> {'{}'}</div>
      </div>
    ),
  },
  {
    title: 'Decorators de Método',
    paragraphs: [
      '@Get/:Post/:Put/:Delete/:Patch("rota") — mapeia verbo HTTP',
      '@HttpCode(201) — sobrescreve status code padrão',
      '@Header("key", "value") — adiciona header na resposta',
      '@UseGuards(Guard1, Guard2) — guards locais por handler',
    ],
    gradient: [SKY, '#1e4a6e'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 2, padding: 16 }}>
        <div><span style={{ color: C }}>@Post</span>(<span style={{ color: GRN }}>'/'</span>)</div>
        <div><span style={{ color: C }}>@HttpCode</span>(<span style={{ color: AMB }}>201</span>)</div>
        <div><span style={{ color: C }}>@UseGuards</span>(<span style={{ color: SKY }}>JwtAuthGuard</span>)</div>
        <div><span style={{ color: AMB }}>async</span> <span style={{ color: GRN }}>create</span>(</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: C }}>@Body</span>() dto: <span style={{ color: SKY }}>CreateUserDto</span></div>
        <div>): <span style={{ color: PRP }}>Promise</span>{'<'}<span style={{ color: GRN }}>User</span>{'>'} {'{'}</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: PRP }}>return</span> this.service.create(dto)</div>
        <div>{'}'}</div>
      </div>
    ),
  },
  {
    title: 'Decorators de Parâmetro',
    paragraphs: [
      '@Body() / @Body("campo") — corpo completo ou campo específico',
      '@Param("id") / @Param() — parâmetro de rota',
      '@Query("page") / @Query() — query string',
      '@Headers("Authorization") — header específico',
    ],
    gradient: [GRN, '#1a5c2e'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 2, padding: 16 }}>
        <div><span style={{ color: AMB }}>async</span> <span style={{ color: GRN }}>findAll</span>(</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: C }}>@Query</span>(<span style={{ color: GRN }}>'page'</span>, <span style={{ color: SKY }}>ParseIntPipe</span>) page: <span style={{ color: PRP }}>number</span>,</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: C }}>@Query</span>(<span style={{ color: GRN }}>'limit'</span>, <span style={{ color: SKY }}>ParseIntPipe</span>) limit: <span style={{ color: PRP }}>number</span>,</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: C }}>@Headers</span>(<span style={{ color: GRN }}>'x-tenant-id'</span>) tenant: <span style={{ color: PRP }}>string</span></div>
        <div>)</div>
      </div>
    ),
  },
  {
    title: 'Decorators Customizados',
    paragraphs: [
      'createParamDecorator((data, ctx) => ctx.switchToHttp().getRequest().user)',
      'Composição: applyDecorators(UseGuards(...), UseInterceptors(...))',
      '@SetMetadata("roles", ["admin"]) + Reflector para RBAC',
      'Decorator de propriedade com reflect-metadata para validação',
    ],
    gradient: [PRP, '#3d1a6e'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 2, padding: 16 }}>
        <div style={{ color: MUTE, fontSize: 9 }}>// Custom @User() decorator</div>
        <div><span style={{ color: PRP }}>export const</span> <span style={{ color: GRN }}>User</span> = <span style={{ color: C }}>createParamDecorator</span>(</div>
        <div style={{ paddingLeft: 14 }}>(data: <span style={{ color: PRP }}>{'unknown'}</span>, ctx: <span style={{ color: SKY }}>ExecutionContext</span>) =&gt;</div>
        <div style={{ paddingLeft: 28 }}>ctx.switchToHttp().getRequest().user</div>
        <div>)</div>
      </div>
    ),
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Custom Providers (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const PROVIDER_SLIDES: Slide[] = [
  {
    title: 'useClass',
    paragraphs: [
      'Padrão: { provide: Service, useClass: ConcreteService }',
      'Útil para testes: substituir serviço real por mock',
      'Injetar pela interface: { provide: "MAILER", useClass: SendgridMailer }',
      'Em testes: overrideProvider(MailService).useClass(MockMailService)',
    ],
    gradient: [C, '#6d0f25'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 2, padding: 16 }}>
        <div style={{ color: MUTE, fontSize: 9 }}>// providers no módulo</div>
        <div>{'{'}</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>provide</span>: <span style={{ color: GRN }}>MailService</span>,</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>useClass</span>:</div>
        <div style={{ paddingLeft: 28 }}><span style={{ color: AMB }}>process.env.NODE_ENV</span> === <span style={{ color: GRN }}>'test'</span></div>
        <div style={{ paddingLeft: 42 }}>? <span style={{ color: PRP }}>MockMailService</span></div>
        <div style={{ paddingLeft: 42 }}>: <span style={{ color: C }}>SendgridMailService</span></div>
        <div>{'}'}</div>
      </div>
    ),
  },
  {
    title: 'useValue',
    paragraphs: [
      '{ provide: CONFIG_TOKEN, useValue: { apiKey: process.env.API_KEY } }',
      'Ideal para configurações, clientes de SDK já instanciados',
      'Em testes: useValue com jest.fn() para mocks de objetos',
      'InjectionToken<T>: type-safe token de DI',
    ],
    gradient: [AMB, '#6e3d00'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 2, padding: 16 }}>
        <div><span style={{ color: PRP }}>const</span> DB_CONFIG = <span style={{ color: PRP }}>new</span> <span style={{ color: AMB }}>InjectionToken</span>{'<'}DbConfig{'>'}(<span style={{ color: GRN }}>'DB_CONFIG'</span>)</div>
        <div style={{ marginTop: 8 }}>{'{'} <span style={{ color: SKY }}>provide</span>: DB_CONFIG, <span style={{ color: SKY }}>useValue</span>: {'{'}</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>host</span>: <span style={{ color: GRN }}>{`process.env.DB_HOST`}</span>,</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>port</span>: <span style={{ color: AMB }}>5432</span></div>
        <div>{'}'} {'}'}</div>
      </div>
    ),
  },
  {
    title: 'useFactory',
    paragraphs: [
      '{ provide: TOKEN, useFactory: async (dep) => await createInstance(dep), inject: [Dep] }',
      'Suporta async — aguarda a Promise antes de injetar',
      'inject: [...] especifica dependências do factory',
      'Usado por TypeOrmModule.forRootAsync(), JwtModule.registerAsync()',
    ],
    gradient: [GRN, '#1a5c2e'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 2, padding: 16 }}>
        <div>{'{'}</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>provide</span>: <span style={{ color: GRN }}>'REDIS_CLIENT'</span>,</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>useFactory</span>: <span style={{ color: AMB }}>async</span> (config: <span style={{ color: SKY }}>ConfigService</span>) =&gt; {'{'}</div>
        <div style={{ paddingLeft: 28 }}><span style={{ color: PRP }}>const</span> client = <span style={{ color: PRP }}>new</span> <span style={{ color: C }}>Redis</span>({'{'}</div>
        <div style={{ paddingLeft: 42 }}>host: config.get(<span style={{ color: GRN }}>'REDIS_HOST'</span>)</div>
        <div style={{ paddingLeft: 28 }}>{'}'}) </div>
        <div style={{ paddingLeft: 28 }}><span style={{ color: PRP }}>await</span> client.connect()</div>
        <div style={{ paddingLeft: 28 }}><span style={{ color: PRP }}>return</span> client</div>
        <div style={{ paddingLeft: 14 }}>{'}'}, </div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>inject</span>: [<span style={{ color: SKY }}>ConfigService</span>]</div>
        <div>{'}'}</div>
      </div>
    ),
  },
  {
    title: 'Módulos Dinâmicos',
    paragraphs: [
      'forRoot(options): retorna ModuleWithProviders com providers configurados',
      'forRootAsync({ useFactory, inject }): configuração assíncrona (ex: ConfigService)',
      'forFeature(entities): registra entidades por módulo (TypeORM, Mongoose)',
      'Pattern: módulo de biblioteca que precisa de configuração do usuário',
    ],
    gradient: [PRP, '#3d1a6e'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 2, padding: 16 }}>
        <div style={{ color: MUTE, fontSize: 9 }}>// usando TypeOrmModule</div>
        <div><span style={{ color: C }}>TypeOrmModule.forRootAsync</span>({'('}{'{'}</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>imports</span>: [<span style={{ color: AMB }}>ConfigModule</span>],</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>useFactory</span>: (config: <span style={{ color: SKY }}>ConfigService</span>) =&gt; ({'('}{'{'}</div>
        <div style={{ paddingLeft: 28 }}><span style={{ color: SKY }}>type</span>: <span style={{ color: GRN }}>'postgres'</span>,</div>
        <div style={{ paddingLeft: 28 }}>url: config.get(<span style={{ color: GRN }}>'DATABASE_URL'</span>)</div>
        <div style={{ paddingLeft: 14 }}>{'}'}{'})'}</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: SKY }}>inject</span>: [<span style={{ color: SKY }}>ConfigService</span>]</div>
        <div>{'}'}{'})'}</div>
      </div>
    ),
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Anti-patterns NestJS (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const NEST_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Lógica de negócio no Controller',
    wrong: [
      [{ text: '@Post()', color: C }],
      [{ text: 'async create(@Body() dto) {', color: '#e2e8f0' }],
      [{ text: '  // ❌ lógica no controller!', color: '#ef4444' }],
      [{ text: '  const exists = await this.db.findOne(dto.email)', color: '#ef4444' }],
      [{ text: '  if (exists) throw new ConflictException()', color: '#ef4444' }],
      [{ text: '  const hash = await bcrypt.hash(dto.password, 10)', color: '#ef4444' }],
      [{ text: '  return this.db.save({ ...dto, password: hash })', color: '#ef4444' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: '@Post()', color: C }],
      [{ text: 'async create(@Body() dto: CreateUserDto) {', color: '#e2e8f0' }],
      [{ text: '  // ✅ delega ao service', color: '#4ade80' }],
      [{ text: '  return this.usersService.create(dto)', color: '#4ade80' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    why: 'Controller no Service = impossível testar unitariamente sem HTTP. Service desacoplado = testável com jest.fn() simples.',
  },
  {
    title: 'Injetar Provider de outro módulo sem exports',
    wrong: [
      [{ text: '// ❌ EmailModule NÃO exporta EmailService', color: '#ef4444' }],
      [{ text: '@Module({ providers: [EmailService] })', color: '#ef4444' }],
      [{ text: 'class EmailModule {}', color: '#e2e8f0' }],
      [{ text: '// UsersModule NÃO importa EmailModule', color: '#ef4444' }],
      [{ text: '@Module({ providers: [UsersService] })', color: '#ef4444' }],
      [{ text: 'class UsersModule {}', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: '@Module({ providers: [EmailService],', color: '#e2e8f0' }],
      [{ text: '  exports: [EmailService] })', color: '#4ade80' }],
      [{ text: 'class EmailModule {}', color: '#e2e8f0' }],
      [{ text: '@Module({ imports: [EmailModule],', color: '#4ade80' }],
      [{ text: '  providers: [UsersService] })', color: '#e2e8f0' }],
      [{ text: 'class UsersModule {}', color: '#e2e8f0' }],
    ],
    why: 'Providers são privados ao módulo por padrão. exports + imports = dois passos obrigatórios. Sem ambos: CanNotResolveDependencies.',
  },
  {
    title: '@Res() bypass nos interceptors e pipes',
    wrong: [
      [{ text: "@Get(':id')", color: C }],
      [{ text: 'async findOne(', color: '#e2e8f0' }],
      [{ text: '  @Param("id") id: string,', color: '#e2e8f0' }],
      [{ text: '  @Res() res: Response // ❌ bypassa interceptors', color: '#ef4444' }],
      [{ text: ') {', color: '#e2e8f0' }],
      [{ text: '  const user = await this.service.findById(id)', color: '#e2e8f0' }],
      [{ text: '  res.json(user) // interceptors não rodam', color: '#ef4444' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: "@Get(':id')", color: C }],
      [{ text: 'async findOne(', color: '#e2e8f0' }],
      [{ text: '  @Param("id", ParseUUIDPipe) id: string', color: '#e2e8f0' }],
      [{ text: '  // ✅ sem @Res() — interceptors funcionam', color: '#4ade80' }],
      [{ text: '): Promise<UserDto> {', color: '#e2e8f0' }],
      [{ text: '  return this.service.findById(id)', color: '#4ade80' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    why: 'Usar @Res() e res.send() pula interceptors e exception filters. ClassSerializerInterceptor e CacheInterceptor NÃO funcionam para endpoints com @Res().',
  },
  {
    title: 'Request-scoped provider em singleton',
    wrong: [
      [{ text: '// ❌ UserContext é REQUEST-scoped', color: '#ef4444' }],
      [{ text: '@Injectable({ scope: Scope.REQUEST })', color: '#ef4444' }],
      [{ text: 'class UserContext { user: User }', color: '#e2e8f0' }],
      [{ text: '// ❌ LoggerService é SINGLETON mas injeta REQUEST', color: '#ef4444' }],
      [{ text: '@Injectable() // DEFAULT = singleton', color: '#ef4444' }],
      [{ text: 'class LoggerService {', color: '#e2e8f0' }],
      [{ text: '  constructor(private ctx: UserContext) {} // LEAK!', color: '#ef4444' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: '// ✅ LoggerService também precisa ser REQUEST', color: '#4ade80' }],
      [{ text: '@Injectable({ scope: Scope.REQUEST })', color: '#4ade80' }],
      [{ text: 'class LoggerService {', color: '#e2e8f0' }],
      [{ text: '  constructor(private ctx: UserContext) {}', color: '#e2e8f0' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    why: 'Se um provider REQUEST-scoped for injetado em um SINGLETON, o singleton terá sempre a instância da PRIMEIRA requisição. Dados vazam entre usuários — bug de segurança grave.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Guard/Interceptor/Pipe scope selector (DecisionTree)
// ═══════════════════════════════════════════════════════════════════════════════

const SCOPE_ROOT: DTNode = {
  id: 'root',
  question: 'O que você precisa fazer?',
  children: [
    { label: 'Verificar se o usuário pode acessar o recurso', nodeId: 'auth-type' },
    { label: 'Transformar ou validar dados de entrada', nodeId: 'pipe-type' },
    { label: 'Adicionar comportamento transversal (logging, cache, timeout)', nodeId: 'interceptor-type' },
    { label: 'Formatar resposta de erro de forma consistente', nodeId: 'exception-filter' },
  ],
}

const SCOPE_NODES: Record<string, DTNode> = {
  'auth-type': {
    id: 'auth-type',
    question: 'Qual tipo de verificação?',
    children: [
      { label: 'Verificar token JWT / session', nodeId: 'guard-jwt' },
      { label: 'Verificar role/permission (RBAC)', nodeId: 'guard-roles' },
    ],
  },
  'guard-jwt': {
    id: 'guard-jwt',
    recommendation: 'Guard — JwtAuthGuard',
    detail: 'Implemente CanActivate. Extraia o token do header, verifique com JwtService. Retorne true/false. Use @UseGuards(JwtAuthGuard) no controller ou globalmente.',
  },
  'guard-roles': {
    id: 'guard-roles',
    recommendation: 'Guard + @SetMetadata',
    detail: 'Use @Roles("admin") com @SetMetadata + RolesGuard com Reflector. O guard lê a metadata do método/classe para checar as roles do usuário autenticado.',
  },
  'pipe-type': {
    id: 'pipe-type',
    question: 'O que precisa fazer com os dados?',
    children: [
      { label: 'Validar DTO com class-validator', nodeId: 'pipe-validation' },
      { label: 'Converter tipo de parâmetro (string → number)', nodeId: 'pipe-parse' },
    ],
  },
  'pipe-validation': {
    id: 'pipe-validation',
    recommendation: 'ValidationPipe',
    detail: 'app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })). Adicione @IsEmail(), @MinLength() etc. nos campos do DTO.',
  },
  'pipe-parse': {
    id: 'pipe-parse',
    recommendation: 'ParseIntPipe / ParseUUIDPipe',
    detail: '@Param("id", ParseIntPipe) id: number — converte e valida. Lança BadRequestException se a conversão falhar.',
  },
  'interceptor-type': {
    id: 'interceptor-type',
    question: 'Precisa de acesso à resposta do handler?',
    children: [
      { label: 'Sim (logging de latência, transformar response, cache)', nodeId: 'interceptor-response' },
      { label: 'Não (apenas pré-processing, CORS, parsing)', nodeId: 'middleware-choice' },
    ],
  },
  'interceptor-response': {
    id: 'interceptor-response',
    recommendation: 'Interceptor',
    detail: 'NestInterceptor com intercept(ctx, next). Use next.handle().pipe(tap(...), map(...)) para pré e pós-processamento. Retorna Observable — pode usar todos os operadores RxJS.',
  },
  'middleware-choice': {
    id: 'middleware-choice',
    recommendation: 'Middleware',
    detail: 'Para lógica Express-level sem contexto NestJS. Register via configure(consumer) no AppModule. Use para helmet, compression, morgan, CORS — bibliotecas que não conhecem NestJS.',
  },
  'exception-filter': {
    id: 'exception-filter',
    recommendation: 'Exception Filter',
    detail: '@Catch(HttpException) para erros HTTP específicos, ou @Catch() para todos. Use @UseFilters() por handler/controller ou useGlobalFilters() para toda a app.',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function NestjsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'modulos-di',
      title: 'Módulos & DI',
      subtitle: 'Container IoC, módulos, controllers, providers e escopos',
      accent: C,
      component: (
        <LayerStack
          layers={DI_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'request-lifecycle',
      title: 'Ciclo de Requisição',
      subtitle: 'Middleware → Guard → Interceptor → Pipe → Handler → Exception Filter',
      accent: C,
      component: (
        <HookTimeline
          phases={REQUEST_LIFECYCLE}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'decorators',
      title: 'Decorators',
      subtitle: 'Classe, método, parâmetro e custom decorators — anatomia completa',
      accent: C,
      component: (
        <ConceptCarousel
          slides={DECORATOR_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={'#1e293b'}
        />
      ),
    },
    {
      id: 'antipatterns-nest',
      title: 'Anti-patterns',
      subtitle: 'Lógica no controller, exports faltando, @Res() bypass, scope leak',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={NEST_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'custom-providers',
      title: 'Custom Providers',
      subtitle: 'useClass, useValue, useFactory e módulos dinâmicos',
      accent: C,
      component: (
        <ConceptCarousel
          slides={PROVIDER_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={'#1e293b'}
        />
      ),
    },
    {
      id: 'scope-decision',
      title: 'Qual usar?',
      subtitle: 'Árvore de decisão — Guard vs Interceptor vs Pipe vs Middleware vs Filter',
      accent: C,
      component: (
        <DecisionTree
          root={SCOPE_ROOT}
          nodes={SCOPE_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
