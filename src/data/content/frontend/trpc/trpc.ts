import type { SkillContent } from '@/types'

const trpc: SkillContent = {
  tagline: "RPC type-safe end-to-end entre servidor e cliente sem schema separado.",
  why: "tRPC elimina o contrato manual entre frontend e backend TypeScript. Leve, sem codegen, integra com React Query. Popular em stacks Next.js + TypeScript. Entender quando tRPC vs REST/GraphQL é ponto de entrevista.",
  summary: "tRPC permite criar APIs type-safe sem schema definition language. O servidor define procedures (queries e mutations) e o cliente as consome com tipos automaticamente inferidos. Usa React Query no cliente para caching. Ideal para monorepos TypeScript onde frontend e backend compartilham tipos.",
  keypoints: [
    {
      title: "Router e procedures",
      body: "Router agrupa procedures. Procedure pode ser query (leitura) ou mutation (escrita). Input validado com Zod. Output inferido automaticamente.",
      code: `// server: router com procedures
const appRouter = router({
  user: router({
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.user.findUnique({ where: { id: input.id } })
      }),
    create: protectedProcedure
      .input(z.object({ name: z.string() }))
      .mutation(async ({ input, ctx }) => {
        return db.user.create({ data: { ...input, userId: ctx.userId } })
      }),
  }),
})
export type AppRouter = typeof appRouter`,
    },
    {
      title: "Type safety end-to-end",
      body: "Cliente importa apenas o tipo AppRouter do servidor. Mudança no procedure — campo adicionado, tipo alterado — é refletida no cliente em tempo de compilação sem codegen.",
      code: `// client: tipos inferidos automaticamente
const user = trpc.user.getById.useQuery({ id: '123' })
// user.data é tipado com o retorno exato do servidor`,
    },
    {
      title: "Middleware e contexto",
      body: "t.procedure.use(middleware) adiciona lógica antes de procedures. O contexto (ctx) é construído uma vez por request e passado para todos os procedures — padrão para autenticação e injeção de dependências.",
      code: `const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next({ ctx: { ...ctx, userId: ctx.session.userId } })
})`,
    },
    {
      title: "React Query integration",
      body: "tRPC usa React Query embaixo. Você tem acesso a useQuery, useMutation, useInfiniteQuery com types completos do servidor. Invalida queries via utils.invalidate().",
      code: `const utils = trpc.useUtils()
const mutation = trpc.post.create.useMutation({
  onSuccess: () => utils.post.list.invalidate(),
})`,
    },
    {
      title: "Quando NÃO usar tRPC",
      body: "tRPC requer TypeScript no servidor e no cliente compartilhando código. Não funciona para APIs públicas consumidas por clientes não-TypeScript (mobile nativo, terceiros), webhooks recebidos de serviços externos, ou quando o backend é de uma equipe diferente com outra linguagem.",
    },
  ],
  interview: [
    {
      q: "Como tRPC garante type safety sem codegen?",
      a: "<p>tRPC usa o sistema de tipos TypeScript diretamente. O servidor define um AppRouter — um tipo que descreve todas as procedures, inputs e outputs. O cliente importa apenas esse tipo (não o código — só o tipo, que é apagado em runtime) e usa para inferir os tipos de todas as chamadas.</p><p>Sem codegen porque TypeScript já consegue atravessar os tipos importados e inferir o que a procedure retorna. Mudou o servidor? O erro aparece no cliente em compile-time.</p>",
      tip: "Explicar que é o sistema de tipos do TS fazendo o trabalho — não geração de código — é o que diferencia quem entende de quem só usa.",
      level: "senior",
    },
    {
      q: "Quando usar tRPC vs REST vs GraphQL?",
      a: "<p><strong>tRPC</strong>: stack TypeScript full-stack no mesmo repositório ou monorepo. Cliente e servidor controlados pela mesma equipe. Sem clientes externos. DX máxima, zero contrato explícito.</p><p><strong>REST</strong>: API pública ou consumida por múltiplos clientes (mobile, terceiros). Versionável, cacheable por HTTP, sem dependência de TypeScript no cliente.</p><p><strong>GraphQL</strong>: cliente precisa de flexibilidade para compor queries (BFF pattern, múltiplos clientes com necessidades diferentes). Overhead de schema definition e codegen se justifica pela flexibilidade.</p>",
      tip: "Saber quando não usar tRPC é tão importante quanto saber usá-lo. Citar a limitação de clientes externos mostra maturidade.",
      level: "senior",
    },
    {
      q: "Como você implementa autenticação em procedures tRPC?",
      a: "<p>Via middleware e contexto. O contexto é construído uma vez por request (ex: decodifica o JWT do cookie/header). Um protectedProcedure estende publicProcedure com um middleware que verifica ctx.session — lança UNAUTHORIZED se ausente. Todas as procedures que requerem auth estendem protectedProcedure.</p><p>O contexto tipado garante que dentro de um protectedProcedure, ctx.userId existe — TypeScript sabe disso.</p>",
      level: "pleno",
    },
    {
      q: "Como tRPC se integra com React Query?",
      a: "<p>tRPC usa React Query como engine de caching no cliente. Queries mapeiam para useQuery, mutations para useMutation, paginação para useInfiniteQuery — todos com tipos inferidos do servidor.</p><p>Para invalidação: trpc.useUtils() expõe os mesmos helpers do queryClient mas com tipos tRPC. utils.post.list.invalidate() invalida todas as queries de post.list sem passar query keys manualmente.</p>",
      level: "pleno",
    },
    {
      q: "Como você versiona uma API tRPC?",
      a: "<p>Versionar é o maior ponto fraco do tRPC: breaking changes no servidor quebram o cliente imediatamente (em compile-time — o que é bom). Estratégias: (1) Deprecate fields com comentários JSDoc @deprecated antes de remover. (2) Manter procedures antigas por um período. (3) Para apps mobile que não atualizam instantaneamente, considere REST ou GraphQL.</p><p>tRPC é ideal quando o servidor e o cliente deployam juntos (monorepo, Next.js full-stack). Quando há clientes que não atualizam em sincronia, o acoplamento forte é um problema.</p>",
      tip: "Citar essa limitação honestamente é o que sênior faz. Entrevistador quer ver que você conhece os tradeoffs.",
      level: "senior",
    },
    {
      q: "O que são subscriptions no tRPC?",
      a: "<p>tRPC suporta subscriptions via WebSocket para comunicação em tempo real. O servidor emite eventos via async generators, o cliente recebe com useSubscription. Requer configuração do transport WebSocket além do HTTP padrão.</p><p>Alternativa mais simples para muitos casos: Server-Sent Events (SSE) ou polling com staleTime baixo no React Query. Subscriptions tRPC fazem sentido para notificações em tempo real, colaboração, chats.</p>",
      level: "senior",
    },
    {
      q: "Como funciona o sistema de contexto no tRPC?",
      a: "<p>O contexto é criado uma vez por request via a função createContext, recebendo a req e res. É compartilhado com todos os procedures e middlewares da requisição. Pattern típico: decodificar token JWT em createContext, expor session no ctx. Procedures públicas recebem ctx com session possivelmente nulo. Procedures protegidas refinam o tipo via middleware — TypeScript sabe que ctx.userId existe após o middleware de auth.</p>",
      tip: "Mostrar que o middleware não apenas valida mas também refina o tipo do ctx é o ponto de nível sênior.",
      level: "senior",
    },
    {
      q: "Como tratar erros customizados no tRPC?",
      a: "<p>Use TRPCError com um dos códigos padrão (UNAUTHORIZED, FORBIDDEN, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR). O cliente recebe o erro tipado. Para erros de validação Zod, tRPC lança BAD_REQUEST automaticamente com os detalhes dos campos.</p><p>Para erros de domínio: crie uma subclasse de TRPCError ou use o campo data para passar informação adicional ao cliente.</p>",
      level: "pleno",
    },
    {
      q: "Quais são as principais diferenças entre tRPC v10 e v11?",
      a: "<p>tRPC v11 introduziu: (1) suporte nativo a SSE (Server-Sent Events) além de WebSocket para subscriptions. (2) API mais ergonômica para batch de queries. (3) Melhorias de performance na inferência de tipos. (4) Melhor integração com React Query v5 (tanstack query). (5) Novo formato de procedimento com tipagem mais precisa de output.</p>",
      level: "senior",
    },
    {
      q: "Como configurar tRPC com Next.js App Router?",
      a: "<p>No App Router há dois patterns: (1) Server Components — use os procedimentos diretamente via caller: const caller = appRouter.createCaller(ctx). (2) Client Components — use o provider tRPC com React Query.</p><p>Para o provider: crie um TRPCReactProvider em um 'use client' component, configure o httpBatchStreamLink com a URL da API Route. A API Route fica em app/api/trpc/[trpc]/route.ts usando fetchRequestHandler.</p>",
      tip: "Mencionar o uso de caller em Server Components vs provider em Client Components demonstra que você entende os dois mundos do App Router.",
      level: "senior",
    },
    {
      q: "O que é httpBatchLink e qual sua vantagem?",
      a: "<p>httpBatchLink agrupa múltiplas chamadas tRPC que acontecem no mesmo tick em uma única requisição HTTP. Se um componente chama 3 procedures ao montar, o link agrupa as 3 em um único request, reduzindo latência e overhead de conexão.</p><p>Alternativa: httpLink (uma requisição por procedure). Use httpBatchLink em produção — é o padrão. Use httpLink para debugging ou quando o servidor não suporta batch.</p>",
      level: "pleno",
    },
    {
      q: "Como você organiza procedures em projetos grandes?",
      a: "<p>Divida por domínio em sub-routers: userRouter, postRouter, commentRouter. Cada sub-router tem seu arquivo com as procedures do domínio. O appRouter raiz mescla todos via router({ user: userRouter, post: postRouter }). A separação mantém cada arquivo focado e evita um arquivo de router monolítico.</p>",
      level: "pleno",
    },
    {
      q: "Como fazer upload de arquivo com tRPC?",
      a: "<p>tRPC não é ideal para upload de arquivo grande — procedures usam JSON por padrão. Estratégias: (1) Para arquivos pequenos: converter para base64 e passar no input Zod. (2) Para arquivos grandes: criar uma route HTTP separada fora do tRPC ou usar serviço de upload direto (S3 presigned URL) — a procedure tRPC apenas gera a URL de upload. (3) Com formData: configure um link customizado no cliente que suporte multipart.</p>",
      tip: "Citar presigned URL como padrão para arquivos grandes demonstra que você conhece o padrão correto.",
      level: "senior",
    },
    {
      q: "O que é um procedure transformer no tRPC?",
      a: "<p>Transformer serializa e deserializa os dados trocados entre cliente e servidor. O padrão (sem transformer) só suporta JSON — Date vira string, Map e Set perdem tipo. Com superjson como transformer, Date, Map, Set, BigInt, undefined são preservados corretamente.</p><p>Configure em ambos os lados: initTRPC.transformer(superjson) no servidor, e superjson no cliente.</p>",
      level: "senior",
    },
    {
      q: "Como escrever testes para procedures tRPC?",
      a: "<p>Use o caller diretamente: const caller = appRouter.createCaller({ session: mockSession }). Chame as procedures como funções async: await caller.user.getById({ id: '1' }). Sem HTTP, sem mocks de transporte. Teste o contrato de input/output e a lógica de negócio isoladamente.</p><p>Para middlewares: teste que UNAUTHORIZED é lançado sem session, e que o tipo correto de ctx é passado com session válida.</p>",
      tip: "Usar caller em vez de fazer fetch para o servidor em testes é o padrão recomendado — mais rápido e sem dependência de rede.",
      level: "pleno",
    },
    {
      q: "Quais os tradeoffs do tRPC vs REST em termos de cacheabilidade HTTP?",
      a: "<p>REST aproveita o cache HTTP nativamente: GETs são cacheados por CDNs e browsers via headers Cache-Control. tRPC queries usam GET via httpBatchLink, mas o batch agrupado em query string limita o cache granular por procedure.</p><p>tRPC v11 com httpLink (sem batch) permite cache HTTP por query. Para alta escala com muitos clientes não-TypeScript, REST ainda é superior em cacheabilidade. Em monorepos onde cache de servidor (React Query) é suficiente, tRPC é adequado.</p>",
      level: "senior",
    },
    {
      q: "Como implementar paginação cursor-based com tRPC?",
      a: "<p>O input da query inclui cursor opcional. A procedure retorna os itens + nextCursor. No cliente, use trpc.post.list.useInfiniteQuery com getNextPageParam retornando o cursor da última página. React Query acumula as páginas em data.pages.</p>",
      level: "pleno",
      tip: "Mostrar que useInfiniteQuery funciona igual ao React Query puro, só com tipos do servidor, diferencia quem entende a integração tRPC + React Query.",
    },
    {
      q: "O que é inferência de tipos de input e output no tRPC?",
      a: "<p>tRPC infere o tipo de output do retorno do handler async. Se o handler retorna um objeto com { id: string, name: string }, o cliente recebe exatamente esse tipo sem declaração explícita. O input é inferido do schema Zod — .input(z.object({ id: z.string() })) gera o tipo { id: string } automaticamente.</p><p>Você pode exportar tipos derivados: type Input = RouterInputs['user']['getById'] e RouterOutputs['user']['getById'] para compartilhar nos componentes.</p>",
      level: "senior",
    },
    {
      q: "Como lidar com autenticação via cookie em tRPC com Next.js?",
      a: "<p>Configure credentials: 'include' no fetch do link para enviar cookies cross-origin. No createContext do servidor, acesse cookies via req.headers.cookie ou via next/headers em App Router. Decodifique o session token, e retorne { session } no contexto. Procedures protegidas verificam ctx.session no middleware.</p>",
      level: "pleno",
    },
    {
      q: "Quais são as melhores práticas de segurança no tRPC?",
      a: "<p>(1) Toda procedure que acessa dados do usuário deve usar protectedProcedure. (2) Valide input com Zod em todas as procedures — nunca confie em dados do cliente. (3) Use CORS correto no handler HTTP. (4) Evite expor IDs internos — use slug ou UUID. (5) Rate limiting no nível HTTP antes de chegar às procedures. (6) Não retorne stack traces em produção — configure errorFormatter para sanitizar erros.</p>",
      level: "senior",
    },
    {
      q: "O que é o padrão de 'caller' e quando usá-lo?",
      a: "<p>createCaller cria um cliente que chama procedures diretamente, sem HTTP. Usos: (1) Server Components chamam procedures sem ir pela rede. (2) Testes unitários de procedures. (3) Procedures chamando outras procedures do mesmo router.</p><p>Atenção: não use caller em loops ou operações de alto volume — ainda executa a lógica do handler. Para batch interno use Promise.all no handler.</p>",
      level: "senior",
    },
  ],
  diagrams: [
    {
      title: "tRPC — type safety end-to-end sem codegen",
      html: `<style>
.trpc-diag{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.trpc-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:12px 14px;font-size:11px}
.trpc-arr{color:#398ccb;text-align:center;font-size:22px;line-height:1}
.trpc-label{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px}
</style>
<div class="trpc-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">tRPC — um tipo viaja do servidor ao cliente</p>
  <div style="display:flex;gap:8px;align-items:center">
    <div class="trpc-box" style="flex:1;border-color:#398ccb">
      <div class="trpc-label" style="color:#398ccb">Servidor</div>
      <div style="color:#94a3b8;line-height:2">
        <span style="color:#475569">// define a procedure</span><br>
        <span style="color:#7c3aed">const</span> appRouter = router({<br>
        &nbsp; getUser: procedure<br>
        &nbsp;&nbsp; .input(z.object({ id: <span style="color:#38bdf8">string</span> }))<br>
        &nbsp;&nbsp; .query(<span style="color:#7c3aed">async</span> ({ input }) =&gt; {<br>
        &nbsp;&nbsp;&nbsp; <span style="color:#7c3aed">return</span> db.user.findUnique(...)<br>
        &nbsp;&nbsp; }),<br>
        })<br>
        <span style="color:#7c3aed">export type</span> AppRouter = <span style="color:#7c3aed">typeof</span> appRouter
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
      <div style="font-size:9px;color:#398ccb;text-align:center;white-space:nowrap">só o tipo<br>viaja →</div>
      <div class="trpc-arr">→</div>
      <div style="font-size:9px;color:#475569;text-align:center">(sem codegen)</div>
    </div>
    <div class="trpc-box" style="flex:1;border-color:#4ade80">
      <div class="trpc-label" style="color:#4ade80">Cliente</div>
      <div style="color:#94a3b8;line-height:2">
        <span style="color:#475569">// tipos inferidos automaticamente</span><br>
        <span style="color:#7c3aed">const</span> { data } = trpc.getUser.useQuery(<br>
        &nbsp; { id: <span style="color:#4ade80">'123'</span> }<br>
        )<br>
        <span style="color:#475569">// data é tipado com o retorno exato</span><br>
        <span style="color:#475569">// do servidor — sem declarar nada</span>
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;margin-top:10px;font-size:11px;color:#475569;line-height:1.8">
    <strong style="color:#94a3b8">Sem codegen:</strong> TypeScript importa o tipo AppRouter e infere tudo a partir daí. Mudar o tipo de retorno no servidor → erro no cliente em compile-time.
  </div>
</div>`,
      caption: "O tipo AppRouter viaja do servidor ao cliente em tempo de compilação — sem gerar arquivos intermediários. Runtime: chamadas HTTP normais.",
    },
    {
      title: "tRPC — Middleware e contexto de autenticação",
      html: `<style>
.trpc-auth{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.trpc-auth-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:14px;font-size:11px;margin-bottom:10px}
.trpc-auth-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700;letter-spacing:.08em;margin-bottom:8px}
</style>
<div class="trpc-auth">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">Cadeia de middleware: Request → Context → Procedure</p>
  <div class="trpc-auth-box" style="border-color:#f59e0b">
    <div class="trpc-auth-badge" style="background:#3a2d0a;color:#f59e0b">1. createContext</div>
    <div style="color:#94a3b8;font-family:'JetBrains Mono',monospace;line-height:1.8">
      <span style="color:#475569">// executa uma vez por request</span><br>
      <span style="color:#7c3aed">export function</span> createContext({ req }) {<br>
      &nbsp; <span style="color:#7c3aed">const</span> session = verifyJWT(req.headers.authorization)<br>
      &nbsp; <span style="color:#7c3aed">return</span> { session, db }<br>
      }
    </div>
  </div>
  <div style="text-align:center;color:#334155;font-size:20px;margin:-4px 0">↓</div>
  <div class="trpc-auth-box" style="border-color:#398ccb">
    <div class="trpc-auth-badge" style="background:#0a2039;color:#398ccb">2. Middleware de auth</div>
    <div style="color:#94a3b8;font-family:'JetBrains Mono',monospace;line-height:1.8">
      <span style="color:#7c3aed">const</span> protectedProcedure = publicProcedure<br>
      &nbsp; .use(({ ctx, next }) =&gt; {<br>
      &nbsp;&nbsp;&nbsp; <span style="color:#7c3aed">if</span> (!ctx.session)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color:#ef4444">throw</span> <span style="color:#7c3aed">new</span> TRPCError({ code: <span style="color:#4ade80">'UNAUTHORIZED'</span> })<br>
      &nbsp;&nbsp;&nbsp; <span style="color:#7c3aed">return</span> next({ ctx: { ...ctx, <span style="color:#4ade80">userId: ctx.session.userId</span> } })<br>
      &nbsp; })
    </div>
  </div>
  <div style="text-align:center;color:#334155;font-size:20px;margin:-4px 0">↓</div>
  <div class="trpc-auth-box" style="border-color:#4ade80">
    <div class="trpc-auth-badge" style="background:#0a3a1a;color:#4ade80">3. Procedure protegida</div>
    <div style="color:#94a3b8;font-family:'JetBrains Mono',monospace;line-height:1.8">
      protectedProcedure.mutation(<span style="color:#7c3aed">async</span> ({ ctx }) =&gt; {<br>
      &nbsp; <span style="color:#475569">// TypeScript sabe que ctx.userId existe aqui</span><br>
      &nbsp; <span style="color:#7c3aed">return</span> db.post.create({ data: { userId: ctx.userId } })<br>
      })
    </div>
  </div>
</div>`,
      caption: "Context criado uma vez por request. Middleware refina o tipo do ctx — TypeScript garante que ctx.userId existe em procedures protegidas.",
    },
    {
      title: "tRPC vs REST vs GraphQL — quando usar cada um",
      html: `<style>
.trpc-cmp{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.trpc-cmp-row{display:grid;grid-template-columns:140px 1fr 1fr 1fr;gap:1px;background:#334155;border-radius:8px;overflow:hidden;margin-bottom:1px}
.trpc-cmp-cell{background:#1e293b;padding:10px 12px;font-size:10px;color:#94a3b8;line-height:1.5}
.trpc-cmp-hdr{background:#0f172a;padding:8px 12px;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
</style>
<div class="trpc-cmp">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">Quando usar tRPC × REST × GraphQL</p>
  <div class="trpc-cmp-row">
    <div class="trpc-cmp-cell trpc-cmp-hdr"></div>
    <div class="trpc-cmp-cell trpc-cmp-hdr" style="color:#398ccb">tRPC</div>
    <div class="trpc-cmp-cell trpc-cmp-hdr" style="color:#f59e0b">REST</div>
    <div class="trpc-cmp-cell trpc-cmp-hdr" style="color:#e040fb">GraphQL</div>
  </div>
  <div class="trpc-cmp-row">
    <div class="trpc-cmp-cell" style="color:#e2e8f0;font-weight:600">Stack</div>
    <div class="trpc-cmp-cell">TypeScript full-stack, monorepo</div>
    <div class="trpc-cmp-cell">Qualquer cliente, API pública</div>
    <div class="trpc-cmp-cell">BFF, múltiplos clientes</div>
  </div>
  <div class="trpc-cmp-row">
    <div class="trpc-cmp-cell" style="color:#e2e8f0;font-weight:600">Codegen</div>
    <div class="trpc-cmp-cell" style="color:#4ade80">Não precisa</div>
    <div class="trpc-cmp-cell">OpenAPI/Swagger</div>
    <div class="trpc-cmp-cell">graphql-codegen</div>
  </div>
  <div class="trpc-cmp-row">
    <div class="trpc-cmp-cell" style="color:#e2e8f0;font-weight:600">API pública</div>
    <div class="trpc-cmp-cell" style="color:#ef4444">Não</div>
    <div class="trpc-cmp-cell" style="color:#4ade80">Sim</div>
    <div class="trpc-cmp-cell" style="color:#4ade80">Sim</div>
  </div>
  <div class="trpc-cmp-row">
    <div class="trpc-cmp-cell" style="color:#e2e8f0;font-weight:600">Versionamento</div>
    <div class="trpc-cmp-cell">Difícil (breaking changes)</div>
    <div class="trpc-cmp-cell" style="color:#4ade80">Fácil (URL v1/v2)</div>
    <div class="trpc-cmp-cell">Deprecation de campos</div>
  </div>
  <div class="trpc-cmp-row">
    <div class="trpc-cmp-cell" style="color:#e2e8f0;font-weight:600">Cache HTTP</div>
    <div class="trpc-cmp-cell">Limitado (batch limita CDN)</div>
    <div class="trpc-cmp-cell" style="color:#4ade80">Excelente (GET + CDN)</div>
    <div class="trpc-cmp-cell">Limitado (POST GraphQL)</div>
  </div>
</div>`,
      caption: "Escolha tRPC para monorepos TypeScript onde servidor e cliente deployam juntos. REST para APIs públicas. GraphQL quando clientes precisam compor queries.",
    },
  ],
  mnemonics: [
    {
      label: "Como lembrar quando usar tRPC",
      trick: "MATE",
      explanation: "MATE resume quando tRPC brilha: Monorepo TypeScript, Acoplamento aceito, Team única (front+back), Erros em compile-time. Se qualquer condição falhar, REST ou GraphQL é melhor.",
    },
    {
      label: "Cadeia de middleware tRPC",
      trick: "CMP",
      explanation: "CMP = Context, Middleware, Procedure. O contexto é criado por request, o middleware o refina e valida, a procedure o usa. Lembrar essa ordem ajuda a nunca confundir onde validar auth.",
    },
    {
      label: "Tradeoffs de tRPC em três palavras",
      trick: "TAC",
      explanation: "TAC = Type safety, Acoplamento, Codegen-free. Type safety end-to-end é o superpoder. Acoplamento forte é o risco. Sem codegen é o diferencial. Citar TAC em entrevista cobre todos os aspectos do tradeoff.",
    },
  ],
  cheatsheet: {
    title: "tRPC — Referência rápida",
    html: `<style>
.trpc-cs{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0;font-size:11px}
.trpc-cs-section{margin-bottom:18px}
.trpc-cs-title{font-size:9px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:#398ccb;margin-bottom:10px}
.trpc-cs-row{display:flex;gap:8px;margin-bottom:6px;align-items:flex-start}
.trpc-cs-key{color:#f59e0b;min-width:200px;flex-shrink:0}
.trpc-cs-val{color:#94a3b8;line-height:1.5}
.trpc-cs-ok{color:#4ade80}
.trpc-cs-bad{color:#ef4444}
</style>
<div class="trpc-cs">
  <div class="trpc-cs-section">
    <div class="trpc-cs-title">Servidor — setup</div>
    <div class="trpc-cs-row"><span class="trpc-cs-key">initTRPC.context&lt;Ctx&gt;().create()</span><span class="trpc-cs-val">Cria o t com tipo de contexto. Inclua transformer: superjson para suporte a Date/Map</span></div>
    <div class="trpc-cs-row"><span class="trpc-cs-key">t.router({ ... })</span><span class="trpc-cs-val">Agrupa procedures. Sub-routers: router({ user: userRouter })</span></div>
    <div class="trpc-cs-row"><span class="trpc-cs-key">t.procedure.input(z.object(...))</span><span class="trpc-cs-val">Valida e tipa o input. Zod obrigatório para type safety completo</span></div>
    <div class="trpc-cs-row"><span class="trpc-cs-key">.query(async ({ input, ctx }) ⇒)</span><span class="trpc-cs-val">Procedure de leitura (GET)</span></div>
    <div class="trpc-cs-row"><span class="trpc-cs-key">.mutation(async ({ input, ctx }) ⇒)</span><span class="trpc-cs-val">Procedure de escrita (POST)</span></div>
    <div class="trpc-cs-row"><span class="trpc-cs-key">procedure.use(middleware)</span><span class="trpc-cs-val">Adiciona middleware. Retorna next({ ctx: ...ctx, userId }) para refinar o tipo</span></div>
  </div>
  <div class="trpc-cs-section">
    <div class="trpc-cs-title">Cliente — hooks React Query</div>
    <div class="trpc-cs-row"><span class="trpc-cs-key">trpc.user.get.useQuery({ id })</span><span class="trpc-cs-val">useQuery com tipos. Suporta todas as opções: enabled, staleTime, select</span></div>
    <div class="trpc-cs-row"><span class="trpc-cs-key">trpc.post.create.useMutation()</span><span class="trpc-cs-val">useMutation. Callbacks: onSuccess, onError, onSettled</span></div>
    <div class="trpc-cs-row"><span class="trpc-cs-key">trpc.post.list.useInfiniteQuery(...)</span><span class="trpc-cs-val">Paginação infinita com getNextPageParam</span></div>
    <div class="trpc-cs-row"><span class="trpc-cs-key">trpc.useUtils()</span><span class="trpc-cs-val">utils.post.list.invalidate(), utils.user.get.setData() — com tipos</span></div>
  </div>
  <div class="trpc-cs-section">
    <div class="trpc-cs-title">Regras práticas</div>
    <div class="trpc-cs-row"><span class="trpc-cs-ok">✓</span><span class="trpc-cs-val">Sempre valide input com Zod em toda procedure</span></div>
    <div class="trpc-cs-row"><span class="trpc-cs-ok">✓</span><span class="trpc-cs-val">Use superjson transformer para suporte a Date, Map, Set</span></div>
    <div class="trpc-cs-row"><span class="trpc-cs-ok">✓</span><span class="trpc-cs-val">createCaller para Server Components e testes (sem HTTP)</span></div>
    <div class="trpc-cs-row"><span class="trpc-cs-bad">✗</span><span class="trpc-cs-val">Não exponha tRPC para clientes não-TypeScript (mobile nativo, terceiros)</span></div>
    <div class="trpc-cs-row"><span class="trpc-cs-bad">✗</span><span class="trpc-cs-val">Não retorne stack traces em produção — configure errorFormatter</span></div>
  </div>
</div>`,
    caption: "Setup mínimo: initTRPC + router + procedures + createContext. Cliente: TRPCReactProvider + httpBatchLink. Transformer superjson é opcional mas recomendado.",
  },
  mindmap: {
    title: "tRPC — Mapa mental completo",
    html: `<style>
.trpc-mm{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.trpc-mm-center{background:#398ccb;color:#fff;border-radius:50px;padding:10px 24px;font-weight:800;font-size:14px;text-align:center;display:inline-block;margin:0 auto}
.trpc-mm-branch{margin-top:16px;display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.trpc-mm-node{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:11px;min-width:140px}
.trpc-mm-node-title{color:#f59e0b;font-weight:700;font-size:10px;margin-bottom:6px}
.trpc-mm-item{color:#94a3b8;margin-bottom:3px;padding-left:8px;border-left:2px solid #334155}
</style>
<div class="trpc-mm">
  <div style="text-align:center;margin-bottom:20px"><div class="trpc-mm-center">tRPC</div></div>
  <div class="trpc-mm-branch">
    <div class="trpc-mm-node">
      <div class="trpc-mm-node-title">Servidor</div>
      <div class="trpc-mm-item">initTRPC</div>
      <div class="trpc-mm-item">router()</div>
      <div class="trpc-mm-item">procedure</div>
      <div class="trpc-mm-item">middleware</div>
      <div class="trpc-mm-item">createContext</div>
    </div>
    <div class="trpc-mm-node">
      <div class="trpc-mm-node-title">Validação</div>
      <div class="trpc-mm-item">Zod .input()</div>
      <div class="trpc-mm-item">TRPCError</div>
      <div class="trpc-mm-item">errorFormatter</div>
      <div class="trpc-mm-item">superjson</div>
    </div>
    <div class="trpc-mm-node">
      <div class="trpc-mm-node-title">Cliente</div>
      <div class="trpc-mm-item">useQuery</div>
      <div class="trpc-mm-item">useMutation</div>
      <div class="trpc-mm-item">useInfiniteQuery</div>
      <div class="trpc-mm-item">useUtils</div>
    </div>
    <div class="trpc-mm-node">
      <div class="trpc-mm-node-title">Transport</div>
      <div class="trpc-mm-item">httpBatchLink</div>
      <div class="trpc-mm-item">httpLink</div>
      <div class="trpc-mm-item">wsLink (subs)</div>
      <div class="trpc-mm-item">SSE (v11)</div>
    </div>
    <div class="trpc-mm-node">
      <div class="trpc-mm-node-title">Next.js</div>
      <div class="trpc-mm-item">App Router</div>
      <div class="trpc-mm-item">fetchRequestHandler</div>
      <div class="trpc-mm-item">createCaller</div>
      <div class="trpc-mm-item">Server Components</div>
    </div>
    <div class="trpc-mm-node">
      <div class="trpc-mm-node-title">Tradeoffs</div>
      <div class="trpc-mm-item">Sem API pública</div>
      <div class="trpc-mm-item">Sem versionamento fácil</div>
      <div class="trpc-mm-item">Type safety total</div>
      <div class="trpc-mm-item">Sem codegen</div>
    </div>
  </div>
</div>`,
    caption: "tRPC combina inferência de tipos TypeScript com React Query. Perfeito para monorepos full-stack onde servidor e cliente são da mesma equipe.",
  },
  exercises: [
    {
      level: "iniciante",
      title: "Criar um router tRPC básico com CRUD de tarefas",
      description: "Configure um servidor tRPC com procedures para listar, criar, atualizar e deletar tarefas. Use Zod para validação de input. No cliente, use useQuery para listar e useMutation para criar.",
      concepts: ["router", "procedure", "query", "mutation", "Zod"],
    },
    {
      level: "intermediario",
      title: "Autenticação via middleware com protectedProcedure",
      description: "Implemente createContext que extrai JWT do header Authorization. Crie um middleware que verifica ctx.session e lança UNAUTHORIZED se ausente. Crie uma protectedProcedure e use em uma mutation de criação de post. Teste que a procedure rejeita requests sem token.",
      concepts: ["createContext", "middleware", "TRPCError", "protectedProcedure", "ctx"],
    },
    {
      level: "intermediario",
      title: "Paginação cursor-based com useInfiniteQuery",
      description: "Crie uma procedure de listagem que aceita cursor opcional e limit. Retorne { items, nextCursor }. No cliente, use trpc.post.list.useInfiniteQuery com getNextPageParam. Implemente um botão 'Carregar mais' que chama fetchNextPage.",
      concepts: ["useInfiniteQuery", "getNextPageParam", "cursor", "data.pages"],
    },
    {
      level: "senior",
      title: "Integração tRPC com Next.js App Router e Server Components",
      description: "Configure fetchRequestHandler em app/api/trpc/[trpc]/route.ts. Crie um TRPCReactProvider. Em um Server Component, use createCaller para buscar dados sem HTTP. Em um Client Component, use useQuery normal. Compare o output de ambos.",
      concepts: ["fetchRequestHandler", "createCaller", "Server Components", "TRPCReactProvider", "App Router"],
    },
    {
      level: "senior",
      title: "Mutation com optimistic update e invalidação tipada",
      description: "Use trpc.useUtils() para invalidação tipada. Implemente uma mutation de like em post com: onMutate cancelando a query tipada, update otimista via utils.post.get.setData, rollback no onError, e invalidação no onSettled. Compare utils.invalidate() com o queryClient.invalidateQueries genérico.",
      concepts: ["useUtils", "optimistic update", "setData tipado", "invalidate", "onSettled"],
    },
  ],
  videos: [
    {
      title: "tRPC in 45 minutes",
      channel: "Theo — t3.gg",
      url: "https://www.youtube.com/watch?v=UfUbBWIFdJs",
      topic: "Introdução prática completa",
    },
    {
      title: "Build a full-stack app with tRPC and Next.js",
      channel: "Jack Herrington",
      url: "https://www.youtube.com/watch?v=UkKMmArAFG4",
      topic: "Next.js App Router + tRPC",
    },
    {
      title: "tRPC makes me happy",
      channel: "Fireship",
      url: "https://www.youtube.com/watch?v=2LYM8gf184U",
      topic: "Visão geral e motivação",
    },
    {
      title: "tRPC vs REST vs GraphQL",
      channel: "James Perkins",
      url: "https://www.youtube.com/watch?v=F_WbMVd4jbc",
      topic: "Comparação técnica dos três",
    },
    {
      title: "tRPC v11 — What's new",
      channel: "Alex / tRPC",
      url: "https://www.youtube.com/watch?v=Lam0cR2fAEk",
      topic: "Novidades da v11: SSE, DX melhorias",
    },
  ],
  resources: [
    { title: "tRPC docs — Quickstart", url: "https://trpc.io/docs/quickstart", kind: "docs" },
    { title: "tRPC + Next.js App Router setup", url: "https://trpc.io/docs/client/nextjs/setup", kind: "docs" },
    { title: "tRPC — Server-side calls (createCaller)", url: "https://trpc.io/docs/server/server-side-calls", kind: "docs" },
    { title: "create-t3-app — template tRPC + Next.js + Prisma", url: "https://create.t3.gg/", kind: "pratica" },
    { title: "tRPC — GitHub com exemplos oficiais", url: "https://github.com/trpc/trpc/tree/main/examples", kind: "pratica" },
    { title: "Total TypeScript — tRPC deep dive", url: "https://www.totaltypescript.com/tutorials/trpc", kind: "curso" },
    { title: "Theo — Why I use tRPC (artigo)", url: "https://t3.gg/blog/post/why-we-use-trpc", kind: "artigo" },
  ],
  codeExamples: [
    {
      title: "Setup mínimo: servidor tRPC com Next.js API Route",
      code: `// server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import superjson from 'superjson'
import { z } from 'zod'

export async function createContext(opts: CreateNextContextOptions) {
  const session = await getSession(opts.req) // seu auth
  return { session, db }
}

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next({ ctx: { ...ctx, userId: ctx.session.userId } })
})

// server/routers/post.ts
export const postRouter = router({
  list: publicProcedure
    .input(z.object({ cursor: z.string().optional(), limit: z.number().default(20) }))
    .query(async ({ input, ctx }) => {
      const items = await ctx.db.post.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' },
      })
      const nextCursor = items.length > input.limit ? items.pop()!.id : undefined
      return { items, nextCursor }
    }),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.post.create({ data: { ...input, authorId: ctx.userId } })
    }),
})

// server/root.ts
export const appRouter = router({ post: postRouter })
export type AppRouter = typeof appRouter

// pages/api/trpc/[trpc].ts
import { createNextApiHandler } from '@trpc/server/adapters/next'
export default createNextApiHandler({ router: appRouter, createContext })`,
      language: "typescript",
    },
    {
      title: "Cliente tRPC com React Query: useQuery, useMutation e invalidação",
      code: `// utils/trpc.ts
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server/root'
export const trpc = createTRPCReact<AppRouter>()

// _app.tsx
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: '/api/trpc', transformer: superjson })],
    })
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

// components/PostList.tsx
function PostList() {
  const utils = trpc.useUtils()

  const { data, fetchNextPage, hasNextPage } = trpc.post.list.useInfiniteQuery(
    { limit: 20 },
    { getNextPageParam: (last) => last.nextCursor }
  )

  const create = trpc.post.create.useMutation({
    onSuccess: () => utils.post.list.invalidate(), // tipado!
  })

  const allPosts = data?.pages.flatMap(p => p.items) ?? []

  return (
    <>
      {allPosts.map(post => <PostCard key={post.id} post={post} />)}
      {hasNextPage && <button onClick={() => fetchNextPage()}>Carregar mais</button>}
      <button onClick={() => create.mutate({ title: 'Novo', content: '...' })}>
        Criar post
      </button>
    </>
  )
}`,
      language: "typescript",
    },
    {
      title: "tRPC com Next.js App Router: Server Components + Client Components",
      code: `// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/root'
import { createContext } from '@/server/trpc'

const handler = (req: Request) =>
  fetchRequestHandler({ endpoint: '/api/trpc', req, router: appRouter, createContext })

export { handler as GET, handler as POST }

// app/_trpc/server.ts — createCaller para Server Components
import { createCaller } from '@/server/root'
import { createContext } from '@/server/trpc'
import { headers } from 'next/headers'

export const trpcServer = createCaller(async () =>
  createContext({ req: { headers: Object.fromEntries(headers().entries()) } } as any)
)

// app/posts/page.tsx — Server Component
export default async function PostsPage() {
  // Sem HTTP — chamada direta ao router
  const { items } = await trpcServer.post.list({ limit: 10 })
  return <PostListClient initialPosts={items} />
}

// app/posts/PostListClient.tsx — Client Component
'use client'
function PostListClient({ initialPosts }: { initialPosts: Post[] }) {
  // useQuery com dado inicial do servidor — sem loading state inicial
  const { data } = trpc.post.list.useQuery(
    { limit: 10 },
    { initialData: { pages: [{ items: initialPosts, nextCursor: undefined }] } }
  )
  return <div>{data?.pages[0].items.map(p => <div key={p.id}>{p.title}</div>)}</div>
}`,
      language: "typescript",
    },
  ],
  gotchas: [
    "tRPC só funciona em stacks onde servidor e cliente compartilham código TypeScript. Não serve para APIs públicas ou clientes não-TypeScript.",
    "Versionar API com tRPC é difícil — breaking changes chegam ao cliente imediatamente. Use com cuidado em APIs que clientes externos consomem.",
    "Subscriptions requerem transporte WebSocket além do HTTP padrão — configuração adicional no servidor.",
    "Sem transformer superjson, Date é serializado como string — você receberá string no cliente mesmo com tipo Date no servidor.",
    "createCaller em Server Components executa a lógica do handler diretamente (sem HTTP), mas ainda processa todos os middlewares — incluindo auth.",
  ],
}

export default trpc
