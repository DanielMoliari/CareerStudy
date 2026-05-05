import type { SkillContent } from '@/types'

const nestjs: SkillContent = {
  tagline: "Framework Node.js opinativo com DI, decorators e arquitetura modular — Angular no servidor.",
  why: "NestJS domina o mercado de backend TypeScript enterprise no Brasil. Saber módulos, DI, guards, pipes, interceptors e como testar é obrigatório em vaga sênior. Entender o container IoC, custom providers e o ciclo de vida de uma requisição diferencia sênior de pleno em entrevistas técnicas.",
  prerequisite: "TypeScript (decorators, generics, reflect-metadata), Node.js básico (módulos, async/await), conceitos de HTTP (verbos, status codes, body, headers). Express ou Fastify ajudam a entender o que NestJS abstrai, mas não são obrigatórios.",
  summary: "NestJS é um framework Node.js construído sobre Express (ou Fastify) que adiciona arquitetura Angular-like: módulos, controllers, providers com injeção de dependência, decorators para rotas, validação e autenticação. O modelo mental central é 'Angular no servidor': @Module organiza a aplicação em blocos coesos, @Injectable marca providers que o container IoC gerencia, e decorators como @Get, @Post, @Body, @Param transformam métodos de classe em handlers de rota. O container IoC cuida do ciclo de vida dos providers — instanciação, injeção de dependências, escopos. Excelente para APIs REST e GraphQL, microserviços (transportes: gRPC, NATS, Redis, RabbitMQ, Kafka) e WebSockets. A CLI gera scaffolding de modules, controllers e services, acelerando muito o desenvolvimento.",
  howToStudy: "<strong>30 minutos antes de entrevista?</strong> Revise o diagrama do ciclo de vida de uma requisição (Middleware → Guard → Interceptor → Pipe → Handler → Interceptor → ExceptionFilter) e treine as diferenças entre Guard, Middleware e Interceptor em voz alta. São as perguntas mais frequentes.<br><br><strong>Fim de semana?</strong> Crie uma API REST completa com autenticação JWT: AppModule, AuthModule, UsersModule. Implemente JwtAuthGuard, ValidationPipe global, um Interceptor de logging e um ExceptionFilter customizado. Testar com supertest solidifica os conceitos de forma prática.<br><br><strong>Para ir fundo:</strong> estude custom providers (useFactory, useValue, useExisting, useClass), módulos dinâmicos (forRoot/forRootAsync com opções) e request-scoped providers. Esses são os tópicos que separam quem conhece NestJS de quem entende NestJS.",
  diagrams: [
    {
      title: "Ciclo de vida de uma requisição — ordem exata das camadas NestJS",
      html: `<style>
.nes1-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;user-select:none}
.nes1-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(224,35,78,.5);display:inline}
.nes1-tip:hover .nes1-tb{display:block}
.nes1-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.nes1-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes nes1-pulse{0%,100%{border-color:rgba(224,35,78,.4);background:rgba(224,35,78,.08)}50%{border-color:rgba(224,35,78,.9);background:rgba(224,35,78,.2)}}
.nes1-layer{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px;margin-bottom:6px;cursor:default;transition:border-color .2s,background .2s}
.nes1-layer:hover{border-color:rgba(224,35,78,.5);background:rgba(224,35,78,.06)}
.nes1-layer.active{animation:nes1-pulse 1s ease-in-out 2}
.nes1-num{width:22px;height:22px;border-radius:50%;background:rgba(224,35,78,.15);border:1px solid rgba(224,35,78,.4);font-size:10px;color:#E0234E;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.nes1-name{font-size:11px;color:#e2e8f0;font-weight:600;min-width:120px}
.nes1-desc{font-size:10px;color:#475569;line-height:1.4;flex:1}
.nes1-badge{font-size:8px;padding:2px 7px;border-radius:10px;font-weight:600;white-space:nowrap;flex-shrink:0}
.nes1-bg-exp{background:rgba(59,130,246,.1);color:#60a5fa;border:1px solid rgba(59,130,246,.25)}
.nes1-bg-nest{background:rgba(224,35,78,.1);color:#E0234E;border:1px solid rgba(224,35,78,.25)}
.nes1-bg-both{background:rgba(74,222,128,.08);color:#4ade80;border:1px solid rgba(74,222,128,.2)}
</style>
<div class="nes1-wrap">
<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px">
  <div>
    <p style="color:#e2e8f0;font-size:12px;margin:0 0 3px;font-weight:600">Ciclo de vida de uma requisição NestJS</p>
    <p style="color:#475569;font-size:10px;margin:0">Passe o mouse nas camadas para detalhes · <button onclick="nes1Run()" style="background:#1e293b;border:1px solid #334155;border-radius:5px;color:#94a3b8;font-size:9px;padding:4px 10px;cursor:pointer;font-family:inherit">Animar</button></p>
  </div>
  <div style="display:flex;gap:6px;align-items:center;flex-shrink:0">
    <span class="nes1-badge nes1-bg-exp">Express</span>
    <span class="nes1-badge nes1-bg-nest">Nest</span>
    <span class="nes1-badge nes1-bg-both">Ambos</span>
  </div>
</div>
<div style="background:#0d1829;border:1px solid #1e293b;border-radius:6px;padding:8px 12px;margin-bottom:14px;min-height:30px;display:flex;align-items:center;gap:8px">
  <span id="nes1-dot" style="width:7px;height:7px;border-radius:50%;background:#334155;flex-shrink:0;transition:background .3s"></span>
  <span id="nes1-txt" style="font-size:10px;color:#475569">Clique em Animar para ver o fluxo completo.</span>
</div>

<div style="margin-bottom:8px;font-size:9px;color:#64748b;text-align:right">REQUEST →</div>

<div id="nes1-l1" class="nes1-layer">
  <div class="nes1-num">1</div>
  <div class="nes1-name"><span class="nes1-tip">Middleware<span class="nes1-tb">Express-level: acesso a req/res brutos. Sem contexto Nest. Uso típico: logging de request, parsing de cookies, CORS manual. Registrado em AppModule via configure(consumer). Executa antes de tudo no Nest.</span></span></div>
  <div class="nes1-desc">Express-level: req/res brutos, sem contexto Nest. CORS, logging, parsing.</div>
  <span class="nes1-badge nes1-bg-exp">Express</span>
</div>

<div id="nes1-l2" class="nes1-layer">
  <div class="nes1-num">2</div>
  <div class="nes1-name"><span class="nes1-tip">Guards<span class="nes1-tb">Decisão de autorização. Implementam CanActivate. Têm acesso ao ExecutionContext (classe, método, decorators). Retornam true/false. JwtAuthGuard, RolesGuard são os mais comuns. Rodam antes de pipes e interceptors.</span></span></div>
  <div class="nes1-desc">Autorização. CanActivate → true prossegue, false lança 403. Acessa metadata de decorators.</div>
  <span class="nes1-badge nes1-bg-nest">Nest</span>
</div>

<div id="nes1-l3" class="nes1-layer">
  <div class="nes1-num">3</div>
  <div class="nes1-name"><span class="nes1-tip">Interceptors (pre)<span class="nes1-tb">AOP ao redor do handler. Implementam NestInterceptor com intercept(ctx, next). A fase PRE executa antes do handler — use para logging de entrada, adicionar headers, iniciar timer. A fase POST executa depois, com acesso ao Observable da resposta.</span></span></div>
  <div class="nes1-desc">AOP: logging de entrada, headers, timer start. Acesso ao Observable da resposta.</div>
  <span class="nes1-badge nes1-bg-nest">Nest</span>
</div>

<div id="nes1-l4" class="nes1-layer">
  <div class="nes1-num">4</div>
  <div class="nes1-name"><span class="nes1-tip">Pipes<span class="nes1-tb">Transformam e validam o input antes do handler. PipeTransform com transform(value, metadata). ValidationPipe integra com class-validator. ParseIntPipe converte string para number. ParseUUIDPipe valida UUID. Erro aqui lança BadRequestException.</span></span></div>
  <div class="nes1-desc">Transformação e validação do input. ValidationPipe, ParseIntPipe, ParseUUIDPipe.</div>
  <span class="nes1-badge nes1-bg-nest">Nest</span>
</div>

<div id="nes1-l5" class="nes1-layer" style="border-color:rgba(224,35,78,.4);background:rgba(224,35,78,.05)">
  <div class="nes1-num" style="background:rgba(224,35,78,.25);border-color:#E0234E;color:#E0234E">★</div>
  <div class="nes1-name" style="color:#E0234E">Route Handler</div>
  <div class="nes1-desc">O método do controller. @Get, @Post, etc. Lógica de negócio via serviços injetados.</div>
  <span class="nes1-badge nes1-bg-both">Handler</span>
</div>

<div style="margin-bottom:8px;margin-top:2px;font-size:9px;color:#64748b;text-align:right">← RESPONSE</div>

<div id="nes1-l6" class="nes1-layer">
  <div class="nes1-num">5</div>
  <div class="nes1-name"><span class="nes1-tip">Interceptors (post)<span class="nes1-tb">Fase POST: manipula o Observable da resposta. Use para transformar formato de resposta (wrapping em { data, meta }), logging de saída (duração, status), caching do resultado. pipe(map(data => ({ data }))) é o padrão de response transformation.</span></span></div>
  <div class="nes1-desc">Transforma response, logging de saída, duração. pipe(map(data =&gt; ({data}))</div>
  <span class="nes1-badge nes1-bg-nest">Nest</span>
</div>

<div id="nes1-l7" class="nes1-layer">
  <div class="nes1-num">6</div>
  <div class="nes1-name"><span class="nes1-tip">Exception Filters<span class="nes1-tb">Só executa se houve exceção. @Catch(HttpException) captura tipo específico. @Catch() sem argumento captura tudo. Built-in: HttpExceptionFilter formata erro padrão Nest. Custom filter formata como você quiser (adicionar requestId, timestamp, stack em dev).</span></span></div>
  <div class="nes1-desc">Só em erro: captura exceções e formata a resposta. @Catch(HttpException).</div>
  <span class="nes1-badge nes1-bg-nest">Nest</span>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid #1e293b">
  <div style="background:#1e293b;border-radius:8px;padding:9px 11px">
    <div style="font-size:10px;color:#E0234E;font-weight:bold;margin-bottom:4px">Escopo de aplicação</div>
    <div style="font-size:9px;color:#475569;line-height:1.7">Global: app.useGlobalXxx()<br>Controller: @UseXxx() no @Controller<br>Route: @UseXxx() no método<br>Ordem: global → controller → route</div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:9px 11px">
    <div style="font-size:10px;color:#ef4444;font-weight:bold;margin-bottom:4px">Armadilha clássica</div>
    <div style="font-size:9px;color:#475569;line-height:1.7">Usar @Res() no handler perde interceptors POST e exception filters automáticos — o Nest não processa mais a resposta. Use passthrough: true se precisar do res E do fluxo do Nest.</div>
  </div>
</div>
</div>
<script>
(function(){
var layers=['nes1-l1','nes1-l2','nes1-l3','nes1-l4','nes1-l5','nes1-l6','nes1-l7'];
var descs=[
  {dot:'#60a5fa',txt:'1 - Middleware: executa antes de tudo. Express-level, sem contexto Nest. CORS, logging.'},
  {dot:'#E0234E',txt:'2 - Guards: autorização. CanActivate retorna true/false. JwtAuthGuard verifica token aqui.'},
  {dot:'#E0234E',txt:'3 - Interceptors PRE: logging de entrada, iniciar timer. Acessa ExecutionContext.'},
  {dot:'#E0234E',txt:'4 - Pipes: ValidationPipe valida DTO, ParseIntPipe converte string para number.'},
  {dot:'#E0234E',txt:'★ Route Handler: seu método do controller executa. Injeta serviços via DI.'},
  {dot:'#E0234E',txt:'5 - Interceptors POST: transforma response, logging de saída, duração da request.'},
  {dot:'#ef4444',txt:'6 - Exception Filter (só em erro): captura e formata exceção. @Catch(HttpException).'},
];
var running=false;
function clearAll(){layers.forEach(function(id){var el=document.getElementById(id);if(el)el.classList.remove('active');});}
function setStatus(color,txt){var d=document.getElementById('nes1-dot');var t=document.getElementById('nes1-txt');if(d)d.style.background=color;if(t)t.textContent=txt;}
window.nes1Run=function(){
  if(running)return;running=true;
  var i=0;
  function next(){
    if(i>=layers.length){setTimeout(function(){clearAll();setStatus('#334155','Ciclo completo. Exception Filters só rodam se houver erro — fluxo normal pula a etapa 6.');running=false;},600);return;}
    clearAll();var el=document.getElementById(layers[i]);if(el)el.classList.add('active');
    setStatus(descs[i].dot,descs[i].txt);i++;setTimeout(next,900);
  }
  next();
};
})();
</script>`,
      caption: "A ordem é fixa e não pode ser alterada. Middleware é Express-level (sem DI). Guards decidem acesso. Pipes transformam/validam. Interceptors fazem AOP. ExceptionFilters capturam erros.",
    },
    {
      title: "Hierarquia de módulos e injeção de dependência",
      html: `<style>
.nes2-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.nes2-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(224,35,78,.5);display:inline}
.nes2-tip:hover .nes2-tb{display:block}
.nes2-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.nes2-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.nes2-mod{border:2px solid rgba(224,35,78,.3);border-radius:12px;padding:14px;background:#120a14;margin-bottom:10px}
.nes2-mod-title{font-size:10px;color:#E0234E;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px}
.nes2-row{display:flex;gap:8px;flex-wrap:wrap}
.nes2-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:8px 11px;flex:1;min-width:90px}
.nes2-box-title{font-size:9px;color:#94a3b8;font-weight:700;margin-bottom:4px;letter-spacing:.08em;text-transform:uppercase}
.nes2-box-body{font-size:9px;color:#475569;line-height:1.5}
.nes2-box.highlight{border-color:rgba(224,35,78,.5);background:rgba(224,35,78,.06)}
.nes2-arrow{font-size:18px;color:#334155;text-align:center;margin:4px 0}
</style>
<div class="nes2-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Hierarquia de módulos e DI no NestJS</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(224,35,78,.5)">sublinhados</span></p>

<!-- AppModule -->
<div class="nes2-mod">
  <div class="nes2-mod-title">AppModule (root)</div>
  <div class="nes2-row">
    <div class="nes2-box">
      <div class="nes2-box-title">imports</div>
      <div class="nes2-box-body"><span class="nes2-tip">AuthModule<span class="nes2-tb">Módulo de autenticação importado no AppModule. Seus exports (JwtService, AuthGuard) ficam disponíveis para quem importar AuthModule.</span></span><br>UsersModule<br>ConfigModule.forRoot()</div>
    </div>
    <div class="nes2-box">
      <div class="nes2-box-title">controllers</div>
      <div class="nes2-box-body"><span class="nes2-tip">AppController<span class="nes2-tb">Controller raiz: healthcheck, /. Em apps reais, controllers ficam nos módulos feature.</span></span></div>
    </div>
    <div class="nes2-box">
      <div class="nes2-box-title">providers</div>
      <div class="nes2-box-body"><span class="nes2-tip">AppService<span class="nes2-tb">Serviço singleton do AppModule. Singleton = uma instância para toda a aplicação. Outros escopos: REQUEST (uma por request), TRANSIENT (uma por injeção).</span></span></div>
    </div>
  </div>
</div>

<div class="nes2-arrow">↙ ↘</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
  <!-- AuthModule -->
  <div class="nes2-mod" style="border-color:rgba(96,165,250,.3);background:#0a1020">
    <div class="nes2-mod-title" style="color:#60a5fa">AuthModule</div>
    <div style="font-size:9px;color:#475569;margin-bottom:8px">imports: [JwtModule.registerAsync(...)]</div>
    <div class="nes2-row">
      <div class="nes2-box highlight" style="border-color:rgba(96,165,250,.4)">
        <div class="nes2-box-title">providers</div>
        <div class="nes2-box-body">AuthService<br>JwtStrategy<br><span class="nes2-tip">LOCAL_OPTIONS<span class="nes2-tb">Custom provider com useValue: { provide: 'LOCAL_OPTIONS', useValue: { ... } }. Injetado via @Inject('LOCAL_OPTIONS').</span></span></div>
      </div>
      <div class="nes2-box highlight" style="border-color:rgba(74,222,128,.4)">
        <div class="nes2-box-title">exports</div>
        <div class="nes2-box-body">AuthService<br>JwtModule<br><em style="color:#64748b">→ disponível para quem importar AuthModule</em></div>
      </div>
    </div>
  </div>

  <!-- UsersModule -->
  <div class="nes2-mod" style="border-color:rgba(250,204,21,.3);background:#0f120a">
    <div class="nes2-mod-title" style="color:#facc15">UsersModule</div>
    <div style="font-size:9px;color:#475569;margin-bottom:8px">imports: [TypeOrmModule.forFeature([User])]</div>
    <div class="nes2-row">
      <div class="nes2-box highlight" style="border-color:rgba(250,204,21,.4)">
        <div class="nes2-box-title">providers</div>
        <div class="nes2-box-body">UsersService<br><span class="nes2-tip">UsersRepository<span class="nes2-tb">TypeORM injetado via @InjectRepository(User). O TypeOrmModule.forFeature([User]) registra o repositório como provider automático.</span></span></div>
      </div>
      <div class="nes2-box highlight" style="border-color:rgba(74,222,128,.4)">
        <div class="nes2-box-title">exports</div>
        <div class="nes2-box-body">UsersService<br><em style="color:#64748b">→ AuthModule pode injetar UsersService</em></div>
      </div>
    </div>
  </div>
</div>

<div style="background:#1e293b;border-radius:8px;padding:12px;margin-top:14px">
  <div style="font-size:10px;color:#E0234E;font-weight:700;margin-bottom:8px">Custom Providers — quando @Injectable não é suficiente</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:9px;color:#475569">
    <div><span style="color:#94a3b8;font-weight:600">useValue</span><br>Valor estático, configs, mocks em teste.</div>
    <div><span style="color:#94a3b8;font-weight:600">useFactory</span><br>Factory async para conexões, configs dinâmicas.</div>
    <div><span style="color:#94a3b8;font-weight:600">useExisting</span><br>Alias: mapeia um token para provider existente.</div>
  </div>
</div>
</div>`,
      caption: "Providers só são visíveis dentro do módulo onde foram declarados, a menos que sejam exportados. Sem exports, o 'provider not found' é o erro mais comum de iniciantes em NestJS.",
    },
    {
      title: "NestJS vs Express puro — quando cada um faz sentido",
      html: `<style>
.nes3-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.nes3-col{background:#1e293b;border-radius:10px;padding:14px;flex:1}
.nes3-head{font-size:11px;font-weight:700;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #334155}
.nes3-item{font-size:10px;color:#64748b;padding:7px 0;border-bottom:1px solid #1e293b;line-height:1.5;display:flex;gap:8px;align-items:flex-start}
.nes3-item:last-child{border-bottom:none}
.nes3-pro{color:#4ade80}
.nes3-con{color:#ef4444}
.nes3-neu{color:#facc15}
</style>
<div class="nes3-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 16px;font-weight:600">NestJS vs Express puro — guia de decisão</p>
<div style="display:flex;gap:10px;margin-bottom:14px">
  <div class="nes3-col">
    <div class="nes3-head" style="color:#E0234E">NestJS</div>
    <div class="nes3-item"><span class="nes3-pro">✓</span> Times grandes ou múltiplos times: arquitetura guiada reduz decisões locais</div>
    <div class="nes3-item"><span class="nes3-pro">✓</span> APIs complexas com autenticação, autorização granular, microserviços</div>
    <div class="nes3-item"><span class="nes3-pro">✓</span> Projetos de longa duração: estrutura modular facilita refactor</div>
    <div class="nes3-item"><span class="nes3-pro">✓</span> Geração de código e scaffolding via CLI acelera onboarding</div>
    <div class="nes3-item"><span class="nes3-pro">✓</span> Stack Angular: devs migram com menos atrito</div>
    <div class="nes3-item"><span class="nes3-con">✗</span> Curva de entrada maior: decorators, DI, escopos</div>
    <div class="nes3-item"><span class="nes3-con">✗</span> Overhead de abstração para APIs simples (&lt; 10 rotas)</div>
  </div>
  <div class="nes3-col">
    <div class="nes3-head" style="color:#68A063">Express / Fastify puro</div>
    <div class="nes3-item"><span class="nes3-pro">✓</span> Protótipos, MVPs, scripts internos, APIs de vida curta</div>
    <div class="nes3-item"><span class="nes3-pro">✓</span> Performance máxima: sem overhead de DI e decorators</div>
    <div class="nes3-item"><span class="nes3-pro">✓</span> Time pequeno que não quer aprender DI</div>
    <div class="nes3-item"><span class="nes3-pro">✓</span> Serverless functions (Lambda, Workers): sem cold start de módulos</div>
    <div class="nes3-item"><span class="nes3-con">✗</span> Sem convenção: cada dev estrutura diferente</div>
    <div class="nes3-item"><span class="nes3-con">✗</span> Validação, serialização, DI — você monta na mão</div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:12px;font-size:10px;color:#64748b;line-height:1.7">
  <span style="color:#e2e8f0;font-weight:600">Regra prática 2025:</span> Se a API vai crescer, tem mais de 2 devs ou já usa TypeScript com decorators (TypeORM, Prisma), comece com NestJS. O custo de estrutura paga em 3 meses. Se é microserviço pequeníssimo (1-2 rotas, vida curta), Fastify puro ou Hono é mais simples.
</div>
</div>`,
      caption: "NestJS não é sempre a resposta certa. Para APIs simples ou serverless de latência crítica, Express ou Fastify puro tem menos overhead. Avalie o tamanho do time e a vida do projeto.",
    },
  ],
  keypoints: [
    { title: "Módulos", body: "@Module agrupa controller + providers. imports/exports controlam visibilidade. Global modules (@Global) disponibilizados em toda app. Formas dinâmicas: forRoot, forFeature, forRootAsync.", code: `@Module({
imports: [TypeOrmModule.forFeature([User])],
controllers: [UsersController],
providers: [UsersService],
exports: [UsersService], // disponível para quem importar UsersModule
})
export class UsersModule {}` },
    { title: "DI Container e escopos", body: "Container IoC gerencia instâncias por scope: Singleton (default — uma instância para toda app), Transient (nova instância por injeção), Request-scoped (nova instância por request HTTP, propaga para toda a cadeia). @Injectable marca provider. @Inject injeta token customizado.", code: `@Injectable({ scope: Scope.REQUEST })
export class CatsService {
constructor(
  @InjectRepository(Cat) private repo: Repository<Cat>,
  @Inject('CONFIG') private config: AppConfig, // custom token
) {}
}` },
    { title: "Controllers e Rotas", body: "@Controller, @Get, @Post, @Put, @Delete, @Patch. @Param, @Body, @Query, @Headers. DTO com class-validator para validação. @Res() para acesso ao response raw — cuidado: perde interceptors automaticamente.", code: `@Controller('cats')
export class CatsController {
constructor(private catsService: CatsService) {}

@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string) {
  return this.catsService.findOne(id);
}

@Post()
@HttpCode(HttpStatus.CREATED)
create(@Body() dto: CreateCatDto) {
  return this.catsService.create(dto);
}
}` },
    { title: "Pipes — validação e transformação", body: "Transformam e validam input antes do handler. PipeTransform com transform(value, metadata). ValidationPipe integra class-validator + class-transformer. Globalmente com app.useGlobalPipes(). Erro lança BadRequestException.", code: `// DTO com class-validator
import { IsString, IsInt, Min, IsOptional } from 'class-validator'

export class CreateCatDto {
@IsString()
name: string

@IsInt()
@Min(0)
age: number

@IsOptional()
@IsString()
breed?: string
}

// Global: app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))` },
    { title: "Guards — autorização", body: "Decisão de autorização. Implementam CanActivate. Acesso ao ExecutionContext (classe, método, handler, args). @SetMetadata para passar dados ao guard. Combinam com Reflector para ler metadata. Rodam antes de pipes e interceptors.", code: `@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
canActivate(context: ExecutionContext) {
  return super.canActivate(context) // valida JWT via Passport
}
}

@Injectable()
export class RolesGuard implements CanActivate {
constructor(private reflector: Reflector) {}
canActivate(ctx: ExecutionContext): boolean {
  const roles = this.reflector.get<string[]>('roles', ctx.getHandler())
  const { user } = ctx.switchToHttp().getRequest()
  return roles?.some(r => user.roles.includes(r)) ?? true
}
}` },
    { title: "Interceptors — AOP", body: "Ao redor do handler. Implementam NestInterceptor com intercept(ctx, next). O CallHandler.handle() retorna Observable. Use pipe(map()), tap(), catchError(). Fase PRE: antes do handler. Fase POST: depois (manipula response). Casos de uso: logging, transformar response, caching, timeout.", code: `@Injectable()
export class TransformInterceptor<T>
implements NestInterceptor<T, Response<T>> {
intercept(ctx: ExecutionContext, next: CallHandler): Observable<Response<T>> {
  const start = Date.now()
  return next.handle().pipe(
    map(data => ({ data, meta: { duration: Date.now() - start } })),
    tap(() => console.log('Response sent')),
  )
}
}` },
    { title: "Exception Filters", body: "Capturam exceções e formatam resposta. HttpException hierarquia built-in (NotFoundException, BadRequestException, etc). Custom filtro com @Catch(ExceptionType). @Catch() sem argumento captura tudo. Acessa request e response via ArgumentsHost.", code: `@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
catch(exception: HttpException, host: ArgumentsHost) {
  const ctx = host.switchToHttp()
  const response = ctx.getResponse<Response>()
  const request = ctx.getRequest<Request>()
  const status = exception.getStatus()
  response.status(status).json({
    statusCode: status,
    timestamp: new Date().toISOString(),
    path: request.url,
    message: exception.message,
  })
}
}` },
    { title: "Custom Providers", body: "Quando @Injectable não é suficiente: useValue (valor estático, mocks em teste), useFactory (factory async — conexões, configs dinâmicas), useExisting (alias de provider), useClass (override de classe). Token pode ser string, Symbol ou class.", code: `// useFactory async (ex: configurar DatabaseService com opções do ConfigService)
{
provide: 'DATABASE_CONNECTION',
useFactory: async (config: ConfigService): Promise<DataSource> => {
  const ds = new DataSource({ url: config.get('DB_URL') })
  await ds.initialize()
  return ds
},
inject: [ConfigService],
}

// useValue (mock em teste)
{ provide: CatsService, useValue: { findAll: jest.fn().mockResolvedValue([]) } }` },
  ],
  gotchas: [
    "Circular dependency entre módulos: NestJS lança 'A circular dependency has been detected'. Use forwardRef(() => OtherModule) como paliativo, mas prefira redesenhar a dependência — circular geralmente indica problema de design.",
    "Request-scoped provider em singleton: provider singleton não tem acesso ao contexto de request (req.user, headers). Se precisar de dados do request dentro de um singleton, passe via parâmetro ou use AsyncLocalStorage.",
    "Usar @Res() no controller sem passthrough: perde interceptors POST e exception filters automáticos. O Nest para de gerenciar a resposta. Use @Res({ passthrough: true }) se precisar do objeto res E do fluxo Nest.",
    "ValidationPipe sem transform: true: DTO chega com tipos errados (age como string '25' em vez de number 25). Sempre use new ValidationPipe({ transform: true, whitelist: true }) globalmente.",
    "Module sem exports: provider registrado em UsersModule não é acessível em AuthModule mesmo que importe UsersModule. Adicione o provider ao array exports.",
    "Módulo não importado: '@Module imports' e 'AppModule imports' são coisas diferentes. Importar um módulo feature sem adicioná-lo ao AppModule.imports faz os providers não serem resolvidos.",
    "forwardRef() em DI circular: forwardRef(() => UsersService) no construtor de AuthService resolve circular, mas NestJS pode instanciar com undefined se o módulo ainda não foi resolvido. Sintoma: TypeError na primeira request.",
    "Esquecer async/await no useFactory: DataSource.initialize() é async. Se o factory não retorna Promise, a DataSource não está pronta quando injetada.",
  ],
  interview: [
    {
      q: "Como funciona o ciclo de vida de um request no NestJS?",
      level: "pleno",
      a: "<p>A ordem exata é: <strong>Middleware → Guards → Interceptors (PRE) → Pipes → Route Handler → Interceptors (POST) → Exception Filters (se erro)</strong>.</p><ul><li><strong>Middleware</strong>: Express-level, sem DI do Nest, executa antes de tudo.</li><li><strong>Guards</strong>: decisão de autorização. Implementam CanActivate. Retornam true/false.</li><li><strong>Interceptors PRE</strong>: logging de entrada, timer, headers.</li><li><strong>Pipes</strong>: validação e transformação do input. Erro aqui lança BadRequestException.</li><li><strong>Handler</strong>: método do controller executa com serviços injetados.</li><li><strong>Interceptors POST</strong>: manipulam o Observable da resposta — transformação, caching.</li><li><strong>Exception Filters</strong>: só se houver exceção — capturam e formatam o erro.</li></ul>",
      tip: "Desenhe o ciclo em papel durante a entrevista. A ordem exata (especialmente interceptors em torno do handler) diferencia quem usou NestJS de fato.",
    },
    {
      q: "Qual a diferença entre Guard, Middleware e Interceptor?",
      level: "pleno",
      a: "<p><strong>Middleware</strong>: Express-level. Acessa req/res brutos. Sem contexto Nest (sem DI, sem ExecutionContext). Registrado em configure(consumer). Útil para CORS, logging bruto, parsing.</p><p><strong>Guard</strong>: decisão de autorização. Implementa CanActivate. Acessa ExecutionContext (metadata de decorators, contexto da classe e método). Retorna boolean. Executa antes de pipes e interceptors.</p><p><strong>Interceptor</strong>: AOP ao redor do handler. Executa ANTES (fase PRE) e DEPOIS (fase POST via Observable). Acessa contexto e resposta. Usado para logging, transformação de response, timeout, caching.</p><p><strong>Resumo</strong>: Middleware é Express. Guards decidem quem entra. Interceptors decoram a execução.</p>",
      tip: "A resposta que distingue sênior: Interceptors usam RxJS Observable — o CallHandler.handle() retorna Observable que você pode pipe(map()), pipe(catchError()) etc. Essa é a parte que pleno normalmente não sabe.",
    },
    {
      q: "Como testaria um controller e um service NestJS?",
      level: "pleno",
      a: "<p><strong>Unit test de Service</strong>: não precisa de Test.createTestingModule. O service é uma classe TypeScript — instancie diretamente com dependências mockadas.</p><p><strong>Unit test de Controller</strong>: Test.createTestingModule() com overrideProvider dos serviços por jest.fn() mocks. Testa o handler isolado — sem HTTP real.</p><p><strong>E2E test</strong>: Test.createTestingModule() com o módulo real, NestFactory.createApplicationContext() ou app.init(). Use supertest para fazer requests HTTP reais. Banco de dados real (SQLite in-memory ou Docker Compose).</p>",
      tip: "A armadilha: usar TestingModule para tudo, inclusive services simples. Overengineering. Service sem deps de framework é testado sem TestingModule — simples e rápido.",
    },
    {
      q: "O que são custom providers e quando usar cada tipo?",
      level: "senior",
      a: "<p>Custom providers permitem registrar providers com lógica de criação customizada:</p><ul><li><strong>useValue</strong>: valor estático — configs, mocks em teste, constantes. <code>{ provide: 'CONFIG', useValue: { env: 'prod' } }</code>.</li><li><strong>useFactory</strong>: factory function (pode ser async) — para inicialização assíncrona (conexão de banco, cliente HTTP). Injeta dependências via <code>inject: [ConfigService]</code>.</li><li><strong>useClass</strong>: substitui uma implementação por outra. Útil para ambientes diferentes (produção vs teste).</li><li><strong>useExisting</strong>: alias — mapeia um token para provider já registrado. Economiza instâncias.</li></ul><p>Caso de uso real: ConfigurableModuleBuilder + useFactory para módulos dinâmicos que recebem opções (ex: JwtModule.registerAsync).</p>",
      tip: "Citar useFactory async com inject[] demonstra experiência real — é o padrão de todos os módulos de terceiros (TypeOrmModule, JwtModule). Quem não usou fica no useValue simples.",
    },
    {
      q: "Como funciona a injeção de dependência no NestJS? O que é o container IoC?",
      level: "senior",
      a: "<p>O container IoC do NestJS é responsável por instanciar providers e injetar dependências automaticamente. Quando a aplicação inicializa, o Nest resolve a árvore de dependências: para cada provider @Injectable, lê os tipos dos parâmetros do construtor (via reflect-metadata), instancia os providers necessários e injeta.</p><p>Escopos controlam ciclo de vida: <strong>Singleton</strong> (padrão) — uma instância compartilhada. <strong>Request</strong> — nova instância por request HTTP, a instância propaga para todos os providers da cadeia. <strong>Transient</strong> — nova instância a cada injeção.</p><p>Problema do Request scope: um provider REQUEST injetado em um Singleton eleva o Singleton para REQUEST também — pode ser surpreendente e causar vazamento de estado entre requests se não tratado corretamente.</p>",
      tip: "Request scope propagação é o gotcha mais profundo do DI do Nest. Mencionar isso demonstra que você entendeu o modelo de container, não só a sintaxe.",
    },
    {
      q: "Como implementar autorização baseada em roles no NestJS?",
      level: "pleno",
      a: "<p>Combinação de 3 peças: decorator customizado, guard que lê o decorator, e JWT que carrega os roles.</p><p>1. Decorator: <code>export const Roles = (...roles: string[]) => SetMetadata('roles', roles)</code></p><p>2. Guard: injeta Reflector, lê metadata do handler via <code>reflector.get('roles', ctx.getHandler())</code>, compara com user.roles do JWT.</p><p>3. Controller: <code>@UseGuards(JwtAuthGuard, RolesGuard)</code> + <code>@Roles('admin')</code> no método.</p><p>Registrar JwtAuthGuard globalmente evita esquecer em rotas novas. Marcar rotas públicas com <code>@Public()</code> decorator e verificar no guard.</p>",
    },
    {
      q: "O que são módulos dinâmicos e quando usar?",
      level: "senior",
      a: "<p>Módulos dinâmicos retornam a configuração do módulo em runtime, permitindo passar opções. O padrão é forRoot (sincono) e forRootAsync (async com factory).</p><p>Use quando: o módulo precisa de configuração externa (URL de banco, chave de API, timeout). Exemplos: JwtModule.register({ secret: '...' }), TypeOrmModule.forRoot({ ... }), seu próprio ConfigurableModule.</p><p>ConfigurableModuleBuilder (NestJS 9+) gera automaticamente forRoot/forRootAsync/registerAsync com tipo seguro — elimina boilerplate manual.</p>",
      tip: "Quem usou apenas módulos estáticos não encontrou módulos dinâmicos. Mencionar ConfigurableModuleBuilder (NestJS 9+) demonstra que você acompanha o framework.",
    },
    {
      q: "Como NestJS lida com microserviços? Quais transporters existem?",
      level: "senior",
      a: "<p>NestJS tem um pacote @nestjs/microservices que abstrai diferentes protocolos de comunicação através da mesma API de decorators.</p><p><strong>Transporters disponíveis</strong>: TCP (padrão, request-reply), Redis (pub/sub), NATS, RabbitMQ, Kafka, gRPC, MQTT.</p><p><strong>Padrões de mensagem</strong>: message pattern (@MessagePattern — request-reply síncrono) e event pattern (@EventPattern — fire-and-forget assíncrono).</p><p>Híbrido: uma aplicação pode ser HTTP + microserviço simultaneamente. Em produção, Kafka é o mais comum para event-driven entre microserviços NestJS.</p>",
    },
    {
      q: "Como estruturaria um projeto NestJS enterprise de médio/grande porte?",
      level: "senior",
      a: "<p>Estrutura por domínio (Domain-Driven): cada domínio tem seu módulo com controller, service, repository, DTOs, entities e specs. Ex: /auth, /users, /orders.</p><p>Shared modules: DatabaseModule (conexão), CommonModule (pipes globais, interceptors), ConfigModule. Exportados e importados onde necessário.</p><p>Patterns recomendados: Repository pattern (TypeORM DataMapper, não ActiveRecord) para separar lógica de acesso a dados. Command/Query handlers se CQRS for necessário (@nestjs/cqrs). Validation: ValidationPipe global, DTOs com class-validator. Configuração: ConfigModule.forRoot com validation via Joi ou Zod.</p>",
      tip: "A resposta que diferencia sênior: mencionar que coloca SharedModule/CommonModule separados dos domain modules, e explica o motivo (separação de concerns, DRY sem acoplamento). Quem só conhece tutorial não pensa em shared modules.",
    },
    {
      q: "Como lidar com circular dependency no NestJS?",
      level: "senior",
      a: "<p>Circular dependency acontece quando ModuleA importa ModuleB e ModuleB importa ModuleA, ou ServiceA injeta ServiceB que injeta ServiceA.</p><p><strong>Solução de provider circular</strong>: forwardRef(() => ServiceB) no construtor. O Nest resolve a referência em runtime, depois que ambos foram instanciados.</p><p><strong>Solução de módulo circular</strong>: forwardRef(() => ModuleB) no imports. Mesmo mecanismo.</p><p><strong>Causa raiz</strong>: circular geralmente indica que os dois serviços compartilham uma responsabilidade que deveria estar num terceiro serviço. Prefira extrair o código compartilhado para um SharedService em um módulo comum, eliminar a circular.</p>",
      tip: "A resposta sênior não para em 'use forwardRef'. Mencionar que circular dependency é cheiro de design ruim e que a solução real é refactor demonstra maturidade.",
    },
    {
      q: "Como implementar um Interceptor para logging e response transformation?",
      level: "pleno",
      a: "<p>O Interceptor usa RxJS Observable. O CallHandler.handle() retorna Observable com a resposta do handler.</p><pre><code>@Injectable()\nexport class LoggingInterceptor implements NestInterceptor {\n  intercept(ctx: ExecutionContext, next: CallHandler): Observable&lt;any&gt; {\n    const start = Date.now()\n    const req = ctx.switchToHttp().getRequest()\n    return next.handle().pipe(\n      tap(data =&gt; {\n        const ms = Date.now() - start\n        console.log(`${req.method} ${req.url} ${ms}ms`)\n      }),\n      map(data =&gt; ({ data, timestamp: new Date().toISOString() })),\n    )\n  }\n}</code></pre><p>Registrar globalmente em app.useGlobalInterceptors() ou via APP_INTERCEPTOR no AppModule (que tem DI, ao contrário do useGlobalInterceptors).</p>",
    },
    {
      q: "Diferença entre ValidationPipe global no main.ts vs no módulo?",
      level: "pleno",
      a: "<p><strong>main.ts com app.useGlobalPipes()</strong>: simples, funciona. Mas não tem acesso ao container DI do Nest — não pode injetar serviços customizados no pipe.</p><p><strong>No AppModule com APP_PIPE</strong>: tem acesso ao DI. Se você criar um CustomValidationPipe que injeta um serviço (ex: CacheService), só funciona via APP_PIPE no módulo.</p><pre><code>{ provide: APP_PIPE, useClass: ValidationPipe }</code></pre><p>Para pipes simples (ValidationPipe padrão), os dois são equivalentes. Para pipes customizados com dependências, use APP_PIPE.</p><p>Mesmo padrão vale para APP_GUARD, APP_INTERCEPTOR, APP_FILTER.</p>",
    },
    {
      q: "Como implementar health checks em NestJS para Kubernetes?",
      a: "<p>Use @nestjs/terminus. Cria um HealthController em /health que verifica: banco de dados (TypeOrmHealthIndicator), Redis (MicroserviceHealthIndicator), disco (DiskHealthIndicator), memória (MemoryHealthIndicator).</p><p>Kubernetes configura liveness probe em /health/liveness (só verifica o processo — nunca dependências externas) e readiness probe em /health/readiness (verifica banco, cache — se falhar, tira do service).</p><p>Armadilha: nunca cheque DB na liveness probe. Se o banco cair, o K8s mata todos os pods, amplificando o problema. Liveness = 'estou vivo'. Readiness = 'posso receber tráfego'.</p>",
      level: "senior",
    },
    {
      q: "Como gerenciar variáveis de ambiente de forma type-safe no NestJS?",
      level: "pleno",
      a: "<p>ConfigModule.forRoot() com validação de schema. Dois padrões:</p><p><strong>Com Joi</strong>: validationSchema: Joi.object({ PORT: Joi.number().default(3000), DB_URL: Joi.string().required() }). Lança erro na inicialização se variável obrigatória estiver faltando.</p><p><strong>Com Zod + typed config</strong>: crie um ConfigSchema com z.object(), use validationSchema customizado, injete ConfigService tipado via ConfigService.get&lt;string&gt;('DB_URL').</p><p>Nunca use process.env direto no código — use ConfigService para centralizar e permitir override em teste.</p>",
    },
    {
      q: "O que é o Nest CLI e como ele acelera o desenvolvimento?",
      level: "pleno",
      a: "<p>O Nest CLI (nest g) gera scaffolding seguindo as convenções do framework:</p><ul><li><code>nest g module users</code> — cria UsersModule e adiciona ao AppModule.imports</li><li><code>nest g controller users --no-spec</code> — cria UsersController e adiciona ao módulo</li><li><code>nest g service users</code> — cria UsersService com @Injectable</li><li><code>nest g resource users</code> — gera CRUD completo (module, controller, service, DTOs, entities)</li></ul><p>Em projeto grande, usar resource para scaffolding e depois ajustar é muito mais rápido que escrever do zero. A geração garante que as convenções de nomenclatura e estrutura estejam corretas.</p>",
    },
    {
      q: "Como seria sua estratégia de tratamento de erros em uma API NestJS?",
      level: "senior",
      a: "<p><strong>Camadas de tratamento</strong>:</p><ul><li>Domain errors: exceções de domínio próprias (UserNotFoundException extends NotFoundException) — self-documenting e type-safe.</li><li>Exception Filter global: captura HttpException e formata resposta padrão com { statusCode, message, timestamp, path }. Captura Exception genérica e loga com nível error antes de retornar 500.</li><li>Interceptor para logging: todo request/response logado com duração, método, URL, status.</li><li>Unhandled: process.on('unhandledRejection') como último recurso — loga e encerra gracefully.</li></ul><p>Nunca exponha stack trace em produção. Use variável de ambiente para habilitar stack em desenvolvimento.</p>",
      tip: "A sequência camadas → tipos de exceção → logging → não expor stack é o que demonstra experiência real em API de produção.",
    },
    {
      q: "Como NestJS se integra com TypeORM e Prisma?",
      level: "pleno",
      a: "<p><strong>TypeORM</strong>: @nestjs/typeorm. TypeOrmModule.forRoot() no AppModule com opções de conexão. TypeOrmModule.forFeature([Entity]) em cada módulo feature — registra o Repository&lt;Entity&gt; como provider. Injete com @InjectRepository(Entity).</p><p><strong>Prisma</strong>: não tem pacote oficial NestJS, mas o pattern padrão é criar um PrismaService que extends PrismaClient e implementa OnModuleInit (chamar $connect()) e OnModuleDestroy (chamar $disconnect()). Exportar do PrismaModule global. Injetar onde precisar.</p><p>Vantagem Prisma no Nest: PrismaService é um provider comum, sem decorators específicos — mais simples de testar e mockar.</p>",
    },
    {
      q: "Como fazer upload de arquivos no NestJS?",
      level: "pleno",
      a: "<p>Use @nestjs/platform-express com Multer integrado.</p><pre><code>@Post('upload')\n@UseInterceptors(FileInterceptor('file', {\n  storage: diskStorage({ destination: './uploads', filename: editFileName }),\n  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB\n  fileFilter: imageFileFilter,\n}))\nuploadFile(@UploadedFile() file: Express.Multer.File) {\n  return { filename: file.filename }\n}</code></pre><p>Para múltiplos arquivos: FilesInterceptor('files', 10). Para campos nomeados: FileFieldsInterceptor. Em produção, armazene em S3 via multer-s3, não no disco local (sem estado em pods K8s).</p>",
    },
    {
      q: "Como implementar WebSockets no NestJS?",
      level: "senior",
      a: "<p>@nestjs/websockets com adapter @nestjs/platform-socket.io (Socket.io) ou platform-ws (ws). Gateway é como um Controller para WebSocket.</p><pre><code>@WebSocketGateway({ cors: true })\nexport class EventsGateway {\n  @WebSocketServer() server: Server\n\n  @SubscribeMessage('chat')\n  handleChat(@MessageBody() data: string, @ConnectedSocket() client: Socket) {\n    this.server.emit('chat', { text: data, from: client.id })\n  }\n\n  handleConnection(client: Socket) { ... }\n  handleDisconnect(client: Socket) { ... }\n}</code></pre><p>Gateway tem acesso ao contexto do DI: injete serviços normalmente. Para escalar horizontalmente, use Redis adapter do Socket.io para sincronizar mensagens entre instâncias.</p>",
    },
    {
      q: "Como testar um guard ou interceptor customizado?",
      level: "senior",
      a: "<p><strong>Testando Guard</strong>: mock do ExecutionContext e do Reflector. O ExecutionContext é difícil de mockar manualmente — use createMock de @golevelup/ts-jest ou construa manualmente com getHandler/getClass.</p><pre><code>const mockContext = createMock&lt;ExecutionContext&gt;()\nmockContext.switchToHttp().getRequest.mockReturnValue({ user: { roles: ['admin'] } })\nconst result = await guard.canActivate(mockContext)\nexpect(result).toBe(true)</code></pre><p><strong>Testando Interceptor</strong>: mock do CallHandler com of(mockResponse). Subscreva ao Observable retornado e valide o valor transformado.</p>",
    },
    {
      q: "O que é o ExecutionContext e para que serve?",
      level: "pleno",
      a: "<p>ExecutionContext estende ArgumentsHost e fornece informações sobre o contexto de execução atual — qual handler está sendo chamado, qual classe, quais argumentos.</p><p>Métodos principais: <code>getClass()</code> (classe do controller), <code>getHandler()</code> (método que vai executar), <code>switchToHttp()</code> (retorna HttpArgumentsHost com getRequest/getResponse), <code>switchToRpc()</code>, <code>switchToWs()</code>.</p><p>Usado em Guards e Interceptors para: ler metadata de decorators via Reflector, acessar o request/response, saber qual endpoint está sendo chamado. O Reflector usa getClass()/getHandler() para buscar metadata de decorators customizados.</p>",
    },
  ],
  mnemonics: [
    {
      label: "MGIP-HIF — ciclo de vida de uma requisição",
      trick: "Middleware → Guard → Interceptor → Pipe → Handler → Interceptor → Filter",
      explanation: "'Meu Gatinho Interessante Peludo Habita Insossa Fazenda' — Middleware, Guard, Interceptor PRE, Pipe, Handler, Interceptor POST, Exception Filter. Os interceptors aparecem duas vezes: antes e depois do handler.",
    },
    {
      label: "MCSP — building blocks do NestJS",
      trick: "Module · Controller · Service · Provider",
      explanation: "Os 4 blocos fundamentais: Module (organiza a feature), Controller (recebe requests e define rotas), Service (lógica de negócio), Provider (qualquer injetável — service, repository, factory). Providers são o geral, services são um tipo especial de provider.",
    },
    {
      label: "VUF — custom providers",
      trick: "useValue · useFactory · useExisting (+ useClass)",
      explanation: "Value pra constantes e mocks. Factory pra inicialização async (banco, HTTP client). Existing pra aliases. Class pra troca de implementação. useFactory com inject[] é o padrão de todos os módulos de terceiros.",
    },
  ],
  cheatsheet: {
    title: "NestJS — Decorators, building blocks e padrões essenciais",
    html: `<style>
.nescs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px}
.nescs-h{font-size:9px;color:#E0234E;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:16px 0 8px;padding-top:12px;border-top:1px solid #1e293b}
.nescs-h:first-child{margin-top:0;padding-top:0;border-top:none}
.nescs-t{width:100%;border-collapse:collapse;margin-bottom:4px}
.nescs-t td{border-bottom:1px solid #1e293b;padding:7px 10px;font-size:10px;vertical-align:top}
.nescs-t tr:last-child td{border-bottom:none}
.nescs-t td:first-child{color:#94a3b8;white-space:nowrap;padding-right:14px;min-width:160px}
.nescs-t td:last-child{color:#64748b;line-height:1.5}
.nescs-code{color:#E0234E;background:rgba(224,35,78,.1);padding:1px 5px;border-radius:3px;font-size:9px}
.nescs-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:4px}
.nescs-card{background:#1e293b;border-radius:6px;padding:8px 10px}
.nescs-card-title{font-size:9px;color:#94a3b8;font-weight:700;margin-bottom:4px}
.nescs-card-body{font-size:9px;color:#475569;line-height:1.6}
</style>
<div class="nescs-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 16px;font-weight:600">NestJS — Cheatsheet</p>

<div class="nescs-h">Decorators de Controller e Rota</div>
<table class="nescs-t">
  <tr><td><span class="nescs-code">@Controller('path')</span></td><td>Define o prefixo da rota. Pode receber versão: @Controller({ path: 'cats', version: '1' }).</td></tr>
  <tr><td><span class="nescs-code">@Get / @Post / @Put / @Delete / @Patch</span></td><td>Verbos HTTP. Aceita subpath: @Get(':id'), @Post('bulk').</td></tr>
  <tr><td><span class="nescs-code">@Param('id')</span></td><td>Parâmetro de rota. Com pipe: @Param('id', ParseUUIDPipe).</td></tr>
  <tr><td><span class="nescs-code">@Body()</span></td><td>Corpo da requisição. Validado se ValidationPipe estiver ativo.</td></tr>
  <tr><td><span class="nescs-code">@Query('page')</span></td><td>Query string. @Query() sem argumento pega todos.</td></tr>
  <tr><td><span class="nescs-code">@Headers('authorization')</span></td><td>Header específico ou todos se sem argumento.</td></tr>
  <tr><td><span class="nescs-code">@HttpCode(201)</span></td><td>Override do status code padrão (POST = 201, GET = 200).</td></tr>
  <tr><td><span class="nescs-code">@Redirect('url', 301)</span></td><td>Redireciona. Retornar { url, statusCode } sobrescreve.</td></tr>
</table>

<div class="nescs-h">Decorators de Injeção e Provider</div>
<table class="nescs-t">
  <tr><td><span class="nescs-code">@Injectable()</span></td><td>Marca a classe como provider gerenciado pelo container IoC.</td></tr>
  <tr><td><span class="nescs-code">@Injectable({ scope: Scope.REQUEST })</span></td><td>Scope: DEFAULT (singleton), REQUEST (por request), TRANSIENT (por injeção).</td></tr>
  <tr><td><span class="nescs-code">@Inject('TOKEN')</span></td><td>Injeta provider por token string. Para class token, não precisa — TypeScript resolve.</td></tr>
  <tr><td><span class="nescs-code">@InjectRepository(Entity)</span></td><td>TypeORM — injeta Repository&lt;Entity&gt; registrado pelo forFeature.</td></tr>
  <tr><td><span class="nescs-code">@Optional()</span></td><td>Dependência opcional — não lança erro se não encontrar o provider.</td></tr>
</table>

<div class="nescs-h">Ciclo de vida e hooks</div>
<table class="nescs-t">
  <tr><td><span class="nescs-code">OnModuleInit</span></td><td>onModuleInit(): executa após o módulo ser instanciado. Use em PrismaService para $connect().</td></tr>
  <tr><td><span class="nescs-code">OnModuleDestroy</span></td><td>onModuleDestroy(): cleanup antes de encerrar. Fecha conexões.</td></tr>
  <tr><td><span class="nescs-code">OnApplicationBootstrap</span></td><td>Depois que todos os módulos foram inicializados. Pré-carregamento de cache.</td></tr>
  <tr><td><span class="nescs-code">BeforeApplicationShutdown</span></td><td>Antes do shutdown — útil para graceful shutdown.</td></tr>
</table>

<div class="nescs-h">Building blocks — resumo de interfaces</div>
<div class="nescs-grid">
  <div class="nescs-card">
    <div class="nescs-card-title">Guard → CanActivate</div>
    <div class="nescs-card-body">canActivate(ctx: ExecutionContext): boolean | Observable&lt;boolean&gt;<br>true = passa, false = 403 Forbidden.</div>
  </div>
  <div class="nescs-card">
    <div class="nescs-card-title">Interceptor → NestInterceptor</div>
    <div class="nescs-card-body">intercept(ctx, next: CallHandler): Observable&lt;any&gt;<br>next.handle() retorna Observable da resposta.</div>
  </div>
  <div class="nescs-card">
    <div class="nescs-card-title">Pipe → PipeTransform</div>
    <div class="nescs-card-body">transform(value: any, metadata: ArgumentMetadata): any<br>Retorna valor transformado ou lança exceção.</div>
  </div>
  <div class="nescs-card">
    <div class="nescs-card-title">ExceptionFilter → ExceptionFilter</div>
    <div class="nescs-card-body">catch(exception: T, host: ArgumentsHost): void<br>@Catch(ExceptionType) sem args = captura tudo.</div>
  </div>
</div>

<div class="nescs-h">Registro global vs módulo</div>
<table class="nescs-t">
  <tr><td><span class="nescs-code">app.useGlobalPipes()</span></td><td>Sem DI. Bom para ValidationPipe simples.</td></tr>
  <tr><td><span class="nescs-code">APP_PIPE / APP_GUARD / APP_INTERCEPTOR</span></td><td>No AppModule providers[] — tem acesso ao DI. Prefira para pipes/guards com dependências.</td></tr>
  <tr><td><span class="nescs-code">@UseGuards / @UsePipes / @UseInterceptors</span></td><td>Por controller ou por rota. Sobrepõe o global para aquele escopo.</td></tr>
</table>
</div>`,
  },
  mindmap: {
    title: "NestJS — mapa de conceitos",
    html: `<style>
.nesm-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.nesm-center{background:rgba(224,35,78,.15);border:2px solid #E0234E;border-radius:12px;padding:12px 20px;display:inline-block;font-size:13px;color:#E0234E;font-weight:700;text-align:center;white-space:nowrap}
.nesm-branch{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:8px 12px;font-size:10px;color:#94a3b8;cursor:default;transition:border-color .2s}
.nesm-branch:hover{border-color:rgba(224,35,78,.5);color:#e2e8f0}
.nesm-leaf{font-size:9px;color:#475569;padding:2px 0;line-height:1.4}
.nesm-line{background:#334155}
</style>
<div class="nesm-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 18px;font-weight:600">NestJS — mapa mental</p>

<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center">

  <!-- Coluna esquerda -->
  <div style="display:flex;flex-direction:column;gap:8px">
    <div class="nesm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#E0234E">Módulos</div>
      <div class="nesm-leaf">@Module({ imports, controllers, providers, exports })</div>
      <div class="nesm-leaf">forRoot / forRootAsync / forFeature</div>
      <div class="nesm-leaf">@Global() — disponível em toda a app</div>
    </div>
    <div class="nesm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#E0234E">DI Container</div>
      <div class="nesm-leaf">Scopes: Singleton | Request | Transient</div>
      <div class="nesm-leaf">useValue | useFactory | useExisting | useClass</div>
      <div class="nesm-leaf">reflect-metadata para resolução de tipos</div>
    </div>
    <div class="nesm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#E0234E">Controllers</div>
      <div class="nesm-leaf">@Controller, @Get, @Post, @Param, @Body</div>
      <div class="nesm-leaf">DTO + class-validator + ValidationPipe</div>
      <div class="nesm-leaf">Versioning: URI / Header / Media Type</div>
    </div>
  </div>

  <!-- Centro -->
  <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
    <div class="nesm-center">NestJS</div>
    <div style="font-size:9px;color:#475569;text-align:center;margin-top:4px">Angular no servidor<br>DI + Módulos + Decorators</div>
  </div>

  <!-- Coluna direita -->
  <div style="display:flex;flex-direction:column;gap:8px">
    <div class="nesm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#E0234E">Request Pipeline</div>
      <div class="nesm-leaf">Middleware → Guard → Interceptor</div>
      <div class="nesm-leaf">→ Pipe → Handler → Interceptor → Filter</div>
      <div class="nesm-leaf">APP_GUARD | APP_INTERCEPTOR | APP_PIPE</div>
    </div>
    <div class="nesm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#E0234E">Microserviços</div>
      <div class="nesm-leaf">Transporters: TCP, Redis, NATS, Kafka, gRPC</div>
      <div class="nesm-leaf">@MessagePattern (req-reply) | @EventPattern (fire-forget)</div>
      <div class="nesm-leaf">Híbrido: HTTP + Microservice na mesma app</div>
    </div>
    <div class="nesm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#E0234E">Extras</div>
      <div class="nesm-leaf">WebSocket: @WebSocketGateway, @SubscribeMessage</div>
      <div class="nesm-leaf">CQRS: @nestjs/cqrs — CommandHandler, EventHandler</div>
      <div class="nesm-leaf">Terminus: health checks para Kubernetes</div>
    </div>
  </div>
</div>
</div>`,
  },
  exercises: [
    {
      level: "iniciante",
      title: "API REST de usuários com validação e tratamento de erros",
      description: "Crie um módulo UsersModule com UsersController e UsersService. Implemente endpoints CRUD: GET /users, GET /users/:id, POST /users, PATCH /users/:id, DELETE /users/:id. Use DTOs com class-validator (IsString, IsEmail, IsOptional). Configure ValidationPipe globalmente com { transform: true, whitelist: true }. Crie um ExceptionFilter que formata erros com { statusCode, message, timestamp, path }. Use armazenamento in-memory (Map) — sem banco de dados.",
      concepts: ["@Module", "@Controller", "@Injectable", "DTO", "class-validator", "ValidationPipe", "ExceptionFilter", "ParseUUIDPipe"],
      hint: "Comece com nest g resource users --no-spec. Isso gera o módulo completo. Depois adicione a ExceptionFilter global no AppModule com { provide: APP_FILTER, useClass: HttpExceptionFilter }.",
      relatedKeypoints: [0, 2, 3, 6],
    },
    {
      level: "intermediario",
      title: "Autenticação JWT com Guards e módulo de configuração",
      description: "Adicione autenticação à API do exercício anterior. AuthModule com AuthService e JwtModule.registerAsync() (opções vindas do ConfigService). Implement um JwtAuthGuard que estende AuthGuard('jwt') do Passport. Adicione decorator @Public() para rotas públicas (login, register). Crie um RolesGuard com decorator @Roles('admin') que lê o payload do JWT. Proteja DELETE e PATCH de admin apenas. Configure o guard globalmente via APP_GUARD.",
      concepts: ["JwtModule.registerAsync", "JwtAuthGuard", "AuthGuard Passport", "@Roles", "RolesGuard", "Reflector", "APP_GUARD", "@Public"],
      hint: "Para verificar se rota é pública no JwtAuthGuard: const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [ctx.getHandler(), ctx.getClass()]). Se true, retorne true sem verificar token.",
      relatedKeypoints: [4, 7],
    },
    {
      level: "senior",
      title: "Microserviço com Kafka e módulo dinâmico customizado",
      description: "Converta parte da API para arquitetura híbrida: o endpoint POST /users continua HTTP, mas emite um evento user.created para um microserviço de notificações via Kafka. Crie um NotificationsModule que consome o evento @EventPattern('user.created') e simula envio de e-mail. Implemente um KafkaModule dinâmico com forRootAsync que aceita opções de conexão via ConfigService. Adicione observabilidade: um Interceptor que loga cada request com requestId (AsyncLocalStorage) e um HealthController com @nestjs/terminus checando Kafka e PostgreSQL.",
      concepts: ["@nestjs/microservices", "Kafka transporter", "@EventPattern", "módulo dinâmico forRootAsync", "AsyncLocalStorage", "@nestjs/terminus", "hybrid app"],
      hint: "Para hybrid app: const app = await NestFactory.create(AppModule); app.connectMicroservice({ transport: Transport.KAFKA, options: { client: { brokers: ['localhost:9092'] } } }); await app.startAllMicroservices(); await app.listen(3000).",
      relatedKeypoints: [0, 1, 7],
    },
  ],
  videos: [
    { title: "NestJS Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=0M8AYU_hPas", topic: "introdução completa", note: "Melhor vídeo de introdução ao NestJS. Cobre módulos, controllers, services, DI em 1h30." },
    { title: "NestJS Full Course for Beginners", channel: "Dave Gray", url: "https://www.youtube.com/watch?v=8_X0nSrzrCw", topic: "CRUD completo", note: "CRUD completo com TypeORM e PostgreSQL. Ótimo para entender integração real com banco." },
    { title: "NestJS Authentication with JWT", channel: "Marius Espejo", url: "https://www.youtube.com/watch?v=_L225zgyx0A", topic: "autenticação JWT", note: "Implementação step-by-step de JWT + Passport no NestJS. Cobre AuthGuard, estratégias e refresh tokens." },
    { title: "NestJS Microservices with RabbitMQ", channel: "Ariel Weinberger", url: "https://www.youtube.com/watch?v=yuVVKB0EaOQ", topic: "microserviços", note: "Arquitetura de microserviços com NestJS e RabbitMQ. Cobre transport, patterns e error handling." },
    { title: "NestJS Unit Testing and E2E Testing", channel: "Codevolution", url: "https://www.youtube.com/watch?v=dXOfOgFFKuY", topic: "testes", note: "Testes unitários e E2E no NestJS. Cobre TestingModule, mocks, supertest e cobertura." },
  ],
  codeExamples: [
    {
      title: "Setup completo: ValidationPipe global + Exception Filter + Swagger",
      description: "Configuração de main.ts de produção com todas as peças essenciais: CORS, prefixo global, ValidationPipe com whitelist, ExceptionFilter, shutdown hooks e Swagger.",
      language: "typescript",
      code: `import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
const app = await NestFactory.create(AppModule)

// CORS
app.enableCors({ origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*' })

// Prefixo global
app.setGlobalPrefix('api/v1')

// ValidationPipe global: transform converte string → tipo correto, whitelist remove campos extras
app.useGlobalPipes(new ValidationPipe({
  transform: true,
  whitelist: true,           // remove campos não declarados no DTO
  forbidNonWhitelisted: true, // lança erro se campo extra vier
  errorHttpStatusCode: 422,   // Unprocessable Entity para erros de validação
}))

// ExceptionFilter global (via useGlobalFilters não tem DI — use APP_FILTER no módulo para DI)
app.useGlobalFilters(new HttpExceptionFilter())

// Graceful shutdown para Kubernetes
app.enableShutdownHooks()

// Swagger (só em não-produção)
if (process.env.NODE_ENV !== 'production') {
  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config))
}

await app.listen(process.env.PORT ?? 3000)
}
bootstrap()`,
    },
    {
      title: "Módulo de autenticação completo: JWT + Guards + Decorator @Public",
      description: "AuthModule com JwtAuthGuard global, RolesGuard e decorator @Public para rotas não protegidas. Padrão de produção.",
      language: "typescript",
      code: `// auth/auth.module.ts
@Module({
imports: [
  PassportModule,
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      secret: config.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '15m' },
    }),
  }),
  UsersModule,
],
providers: [AuthService, JwtStrategy],
exports: [AuthService],
})
export class AuthModule {}

// auth/decorators/public.decorator.ts
export const Public = () => SetMetadata('isPublic', true)

// auth/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
constructor(private reflector: Reflector) { super() }

canActivate(context: ExecutionContext) {
  // Rota marcada com @Public() → passa sem verificar token
  const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
    context.getHandler(),
    context.getClass(),
  ])
  if (isPublic) return true
  return super.canActivate(context)
}
}

// auth/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
constructor(private reflector: Reflector) {}
canActivate(ctx: ExecutionContext): boolean {
  const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
    ctx.getHandler(), ctx.getClass(),
  ])
  if (!requiredRoles?.length) return true
  const { user } = ctx.switchToHttp().getRequest()
  return requiredRoles.some(r => user?.roles?.includes(r))
}
}

// app.module.ts — registra guards globalmente com DI
@Module({
providers: [
  { provide: APP_GUARD, useClass: JwtAuthGuard },
  { provide: APP_GUARD, useClass: RolesGuard },
],
})
export class AppModule {}

// uso no controller
@Controller('admin')
export class AdminController {
@Get('dashboard')
@Roles('admin')  // requer role admin no JWT
getDashboard() { return { data: 'admin stuff' } }

@Post('login')
@Public()  // sem autenticação
login(@Body() dto: LoginDto) { return this.authService.login(dto) }
}`,
    },
    {
      title: "Interceptor de logging + RequestId com AsyncLocalStorage",
      description: "Pattern de produção para propagar requestId por toda a cadeia assíncrona sem poluir as assinaturas das funções.",
      language: "typescript",
      code: `// common/request-context.ts
import { AsyncLocalStorage } from 'async_hooks'

interface RequestContext {
requestId: string
userId?: string
}

export const requestContext = new AsyncLocalStorage<RequestContext>()

export function getRequestId(): string {
return requestContext.getStore()?.requestId ?? 'unknown'
}

// common/interceptors/logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
private readonly logger = new Logger(LoggingInterceptor.name)

intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
  const req = ctx.switchToHttp().getRequest<Request>()
  const requestId = (req.headers['x-request-id'] as string) ?? randomUUID()
  const { method, url } = req
  const start = Date.now()

  // Propaga requestId por toda a cadeia via AsyncLocalStorage
  return new Observable(subscriber => {
    requestContext.run({ requestId }, () => {
      this.logger.log(\`[\${requestId}] \${method} \${url} — início\`)
      next.handle().pipe(
        tap(response => {
          const ms = Date.now() - start
          this.logger.log(\`[\${requestId}] \${method} \${url} \${ms}ms — sucesso\`)
        }),
        catchError(err => {
          const ms = Date.now() - start
          this.logger.error(\`[\${requestId}] \${method} \${url} \${ms}ms — erro: \${err.message}\`)
          throw err
        }),
      ).subscribe(subscriber)
    })
  })
}
}

// Uso em qualquer serviço — sem precisar passar como parâmetro
@Injectable()
export class UsersService {
create(dto: CreateUserDto) {
  const reqId = getRequestId() // disponível automaticamente
  this.logger.log(\`[\${reqId}] Criando usuário \${dto.email}\`)
  // ...
}
}`,
    },
  ],
  resources: [
    { title: "NestJS docs oficiais", url: "https://docs.nestjs.com/", kind: "docs" },
    { title: "NestJS Fundamentals — curso oficial", url: "https://courses.nestjs.com/", kind: "curso" },
    { title: "NestJS Techniques — Authentication", url: "https://docs.nestjs.com/security/authentication", kind: "docs" },
    { title: "NestJS Microservices", url: "https://docs.nestjs.com/microservices/basics", kind: "docs" },
    { title: "NestJS Testing", url: "https://docs.nestjs.com/fundamentals/testing", kind: "docs" },
    { title: "Awesome NestJS (GitHub)", url: "https://github.com/nestjs/awesome-nestjs", kind: "docs" },
  ],
}

export default nestjs
