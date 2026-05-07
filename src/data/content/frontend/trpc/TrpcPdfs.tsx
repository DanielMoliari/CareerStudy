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
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion } from '@/components/pdfs/ComparativeRefPdf'

// ── Paleta tRPC ──────────────────────────────────────────────────────────────
const C   = '#398ccb'
const GRN = '#4ade80'
const AMB = '#f59e0b'
const PRP = '#a78bfa'
const RED = '#ef4444'

// ── Metadados dos PDFs ───────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 20 perguntas cobrindo type safety sem codegen, middleware e context, versioning, httpBatchLink, subscriptions, createCaller, superjson transformer e integração com Next.js App Router — com respostas estruturadas para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Servidor, cliente e regras numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: setup do servidor (initTRPC, router, procedure, middleware), hooks do cliente (useQuery, useMutation, useInfiniteQuery, useUtils), configurações de link e regras práticas. Tudo que você precisa sem abrir a documentação.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'MATE, CMP, TAC — os truques que grudam',
    type: 'mnemonics',
    pages: 2,
    description: 'MATE para quando usar tRPC (Monorepo, Acoplamento, Team única, Erros compile-time). CMP para a cadeia de middleware. TAC para os tradeoffs centrais. Associações acionáveis na entrevista.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 4 erros mais comuns — e como corrigir',
    type: 'antipatterns',
    pages: 3,
    description: 'Sem Zod no input, uso para API pública, erros não sanitizados, Date sem superjson. Com código errado × correto e explicação do porquê cada um é perigoso em produção.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'comparative',
    title: 'tRPC vs REST vs GraphQL',
    subtitle: 'Tabela de decisão técnica com 7 critérios',
    type: 'comparative',
    pages: 2,
    description: 'Comparação estruturada: type safety, API pública, versionamento, flexibilidade, cache HTTP, tempo real e DX. Com cenários de quando usar cada um — resposta pronta para a pergunta de entrevista mais comum sobre tRPC.',
    icon: '05',
    goal: 'Decisão técnica defensável',
  },
]

// ── Q&A ──────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Como tRPC garante type safety sem codegen?',
    a: 'tRPC usa o sistema de tipos TypeScript diretamente. O servidor exporta um tipo AppRouter. O cliente importa apenas esse tipo (não o código — o tipo é apagado em runtime) e TypeScript infere os tipos de todas as chamadas. Mudou o servidor? Erro em compile-time no cliente.',
    bullets: [
      'AppRouter é um tipo, não código executável — erased em runtime.',
      'Inferência TypeScript traversa os tipos das procedures automaticamente.',
      'Sem codegen = sem etapa de geração, sem arquivos intermediários.',
    ],
    tip: 'Explicar que é inferência TypeScript fazendo o trabalho — não geração de código — é o que diferencia quem entende de quem só usa.',
  },
  {
    level: 'Pleno',
    q: 'O que é httpBatchLink e qual sua vantagem?',
    a: 'httpBatchLink agrupa múltiplas chamadas tRPC que acontecem no mesmo tick em uma única requisição HTTP. Se um componente monta e dispara 3 queries, o link agrupa as 3 em um único request, reduzindo latência e overhead de conexão TCP.',
    bullets: [
      'Batch automático sem configuração — transparente para o desenvolvedor.',
      'Alternativa: httpLink (uma request por procedure) para debugging.',
      'Em produção: httpBatchLink é o padrão recomendado.',
    ],
    tip: 'Mencionar que o batch acontece automaticamente sem configuração explícita mostra que você entende o mecanismo.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o createContext e o que ele retorna?',
    a: 'createContext é executado uma vez por request. Recebe req e res (ou equivalentes). Retorna o objeto que será ctx em todas as procedures e middlewares. Pattern típico: decodifica JWT, conecta ao DB, retorna { session, db }.',
    bullets: [
      'Executado uma vez por request — não uma vez por procedure.',
      'ctx tipado: TypeScript sabe exatamente o que está disponível.',
      'Middlewares refinam o tipo do ctx — protectedProcedure garante ctx.userId.',
    ],
    tip: 'Enfatizar que createContext roda uma vez por request — não por procedure — é o detalhe que demonstra entendimento do mecanismo.',
  },
  {
    level: 'Pleno',
    q: 'Como usar useUtils() para invalidação tipada?',
    a: 'trpc.useUtils() expõe os mesmos helpers do QueryClient do React Query, mas com tipos derivados do AppRouter. utils.post.list.invalidate() invalida as queries de post.list sem passar query keys como string.',
    bullets: [
      'utils.post.list.invalidate() — tipado, sem magic strings.',
      'utils.user.get.setData({ id }, newData) — atualiza cache com tipo correto.',
      'utils.post.list.prefetch() — prefetch tipado.',
    ],
    tip: 'useUtils() como substituto tipado do QueryClient é o que torna tRPC superior ao React Query puro para monorepos — sem magic strings.',
  },
  {
    level: 'Pleno',
    q: 'Como implementar paginação cursor-based com tRPC?',
    a: 'A procedure aceita cursor opcional e limit no input Zod. Retorna { items, nextCursor }. No cliente: trpc.post.list.useInfiniteQuery({ limit: 20 }, { getNextPageParam: (last) => last.nextCursor }). React Query acumula páginas em data.pages.',
    bullets: [
      'getNextPageParam retorna undefined quando nextCursor é null — hasNextPage=false.',
      'data.pages é array de todas as páginas — flatMap para um único array.',
      'useInfiniteQuery funciona igual ao React Query, mas com tipos do servidor.',
    ],
    tip: 'Mostrar que useInfiniteQuery é idêntico ao React Query puro — só com tipos tRPC — diferencia quem entende a camada de abstração.',
  },
  {
    level: 'Pleno',
    q: 'Como usar tRPC com Next.js App Router?',
    a: 'Dois patterns: (1) Server Components — use createCaller para chamadas diretas sem HTTP. (2) Client Components — use TRPCReactProvider com httpBatchStreamLink. A API Route fica em app/api/trpc/[trpc]/route.ts usando fetchRequestHandler.',
    bullets: [
      'createCaller: Server Components chamam procedures sem network.',
      'fetchRequestHandler: substitui o adaptador Next.js Pages Router.',
      'TRPCReactProvider com httpBatchStreamLink: suporte a streaming no App Router.',
    ],
    tip: 'Distinguir createCaller (Server Components, sem HTTP) de TRPCReactProvider (Client Components, com HTTP) demonstra entendimento da arquitetura do App Router.',
  },
  {
    level: 'Senior',
    q: 'Qual a principal limitação do tRPC e quando não usá-lo?',
    a: 'tRPC requer TypeScript em servidor e cliente compartilhando código. Limitações: (1) Não serve para APIs públicas ou clientes não-TypeScript. (2) Versionamento difícil — breaking changes chegam imediatamente. (3) Cache HTTP limitado com httpBatchLink (POST). Use REST para API pública ou quando clientes externos precisam consumir.',
    bullets: [
      'API pública ou mobile nativo → REST com OpenAPI.',
      'Múltiplos clientes com flexibilidade → GraphQL.',
      'Cache HTTP CDN crítico → REST com GET.',
    ],
    tip: 'Saber quando não usar tRPC é tão importante quanto saber usá-lo. Citar as 3 limitações mostra maturidade.',
  },
  {
    level: 'Senior',
    q: 'Como middlewares refinam o tipo do contexto?',
    a: 'O middleware recebe ctx com o tipo completo do createContext (session pode ser null). Após verificar ctx.session, chama next({ ctx: { ...ctx, userId: ctx.session.userId } }). TypeScript infere que dentro da procedure protegida, ctx.userId existe — sem checagem manual.',
    bullets: [
      'next({ ctx: ... }) — o tipo retornado por next é o ctx da procedure.',
      'TypeScript garante que ctx.userId existe em protectedProcedure.',
      'Múltiplos middlewares encadeiam refinamentos de tipo.',
    ],
    tip: 'Mostrar que o middleware não apenas valida mas refina o tipo do ctx é o ponto de nível sênior que a maioria não cita.',
  },
  {
    level: 'Senior',
    q: 'Como usar createCaller em Server Components?',
    a: 'createCaller cria um cliente que executa procedures diretamente (sem HTTP). Em Server Components: import { appRouter } from "@/server/root"; const caller = appRouter.createCaller(await createContext()); const data = await caller.post.list({ limit: 10 }). Sem fetch, sem latência de rede, ainda processa middlewares.',
    bullets: [
      'Sem HTTP: ideal para Server Components e testes.',
      'Middlewares ainda executam — auth é validada.',
      'Não usar em loops de alta frequência — executa toda a lógica do handler.',
    ],
    tip: 'Enfatizar que middlewares ainda executam no createCaller é o detalhe que demonstra entendimento profundo — não é um bypass de auth.',
  },
  {
    level: 'Senior',
    q: 'O que é o transformer superjson e por que é necessário?',
    a: 'JSON.stringify serializa Date como string, Map/Set como {}, undefined some. superjson preserva Date, Map, Set, BigInt, undefined. Configure nos dois lados: initTRPC.create({ transformer: superjson }) e httpBatchLink({ transformer: superjson }). Sem ele, Date retornada pelo servidor chega como string ao cliente.',
    bullets: [
      'Date sem superjson: servidor retorna Date, cliente recebe string.',
      'Map, Set, BigInt: perdidos sem superjson.',
      'Configure nos dois lados — servidor e cliente.',
    ],
    tip: 'Mencionar que Date vira string sem superjson é o detalhe que demonstra experiência real em produção.',
  },
  {
    level: 'Senior',
    q: 'Como escrever testes para procedures tRPC?',
    a: 'Use createCaller diretamente: const caller = appRouter.createCaller({ session: mockSession, db: mockDb }). Chame como funções async: await caller.user.getById({ id: "1" }). Sem HTTP, sem mocks de transporte. Teste que UNAUTHORIZED é lançado sem session, e output correto com dados mockados.',
    bullets: [
      'createCaller: testes sem HTTP, sem mocks de fetch.',
      'Passe ctx mockado para simular autenticado/não-autenticado.',
      'expect(caller.protected.action()).rejects.toThrow("UNAUTHORIZED").',
    ],
    tip: 'Usar createCaller em testes — sem mocks de fetch — é o padrão recomendado. Demonstra que você conhece além do uso básico.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o errorFormatter e quando configurar?',
    a: 'errorFormatter é chamado para cada erro antes de ser enviado ao cliente. Sem ele, stack traces e detalhes internos são expostos. Configure para: (1) Filtrar informações sensíveis em produção. (2) Expor detalhes de validação Zod estruturados. (3) Integrar com Sentry para logging.',
    bullets: [
      'Em produção: nunca retorne stack traces ao cliente.',
      'Erros Zod: error.cause?.flatten() retorna detalhes por campo — seguro.',
      'errorFormatter: último ponto de controle do que o cliente vê.',
    ],
    tip: 'Citar errorFormatter como camada de segurança obrigatória em produção — não opcional — demonstra maturidade em segurança.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre publicProcedure e protectedProcedure?',
    a: 'publicProcedure: nenhuma verificação de auth — qualquer request pode chamar. protectedProcedure: estende publicProcedure com middleware que verifica ctx.session. Se ausente, lança UNAUTHORIZED antes de chegar ao handler. Em TypeScript, ctx.userId existe dentro de protectedProcedure — sem o check manual.',
    bullets: [
      'publicProcedure: rotas de login, cadastro, dados públicos.',
      'protectedProcedure: qualquer ação que exige login.',
      'TypeScript garante ctx.userId em protectedProcedure — sem undefined.',
    ],
    tip: 'Destacar que TypeScript garante ctx.userId em protectedProcedure — sem checar undefined — é o diferencial de type safety do tRPC sobre auth manual.',
  },
  {
    level: 'Senior',
    q: 'O que são subscriptions no tRPC e quando usar?',
    a: 'Subscriptions permitem comunicação em tempo real: servidor emite eventos via async generator, cliente recebe com useSubscription. Requerem transporte WebSocket (v10) ou SSE — tRPC v11 nativo. Use para: chat, notificações push, colaboração em tempo real. Para atualizações simples, polling com staleTime baixo no React Query é suficiente.',
    bullets: [
      'WebSocket: full-duplex, latência menor, setup mais complexo.',
      'SSE (v11 nativo): mais simples, só server-push, sem setup extra.',
      'useSubscription: hook do cliente para consumir subscriptions.',
    ],
    tip: 'Citar SSE como alternativa mais simples ao WebSocket para notificações unidirecionais demonstra que você conhece as trocas de cada abordagem.',
  },
  {
    level: 'Senior',
    q: 'Como organizar procedures em projetos grandes com sub-routers?',
    a: 'Divida por domínio: postRouter, userRouter, commentRouter em arquivos separados. O appRouter raiz mescla: router({ post: postRouter, user: userRouter }). Cada domínio tem seu arquivo com procedures, tipos locais e validações. O tipo AppRouter exportado para o cliente reflete a estrutura aninhada.',
    bullets: [
      'router({ post: postRouter }): no cliente, trpc.post.list.useQuery().',
      'Cada sub-router em seu arquivo — sem router monolítico.',
      'Tipos aninhados: RouterInputs["post"]["list"] funciona automaticamente.',
    ],
    tip: 'Mostrar que a estrutura aninhada do router se reflete no cliente com trpc.post.list.useQuery() ilustra o poder da inferência de tipos do tRPC.',
  },
  {
    level: 'Pleno',
    q: 'Como tratar erros com TRPCError?',
    a: "TRPCError tem codes mapeados para HTTP status: UNAUTHORIZED (401), FORBIDDEN (403), NOT_FOUND (404), BAD_REQUEST (400), INTERNAL_SERVER_ERROR (500). Throw dentro do handler ou middleware. O cliente recebe o erro tipado via onError do useMutation ou error do useQuery.",
    bullets: [
      'throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" }).',
      'Erros Zod: lançados automaticamente como BAD_REQUEST com detalhes por campo.',
      'Cliente: err.data.code para o código, err.message para a mensagem.',
    ],
    tip: 'Saber que Zod lança BAD_REQUEST automaticamente — sem precisar de try/catch manual — mostra que você conhece a integração tRPC+Zod.',
  },
  {
    level: 'Pleno',
    q: 'Como exportar e usar tipos de input/output no cliente?',
    a: 'Exporte RouterInputs e RouterOutputs do arquivo do servidor: type RouterInputs = inferRouterInputs<AppRouter>; type RouterOutputs = inferRouterOutputs<AppRouter>. No cliente: type PostListOutput = RouterOutputs["post"]["list"]. Compartilhe em tipos do monorepo.',
    bullets: [
      'inferRouterInputs<AppRouter>: tipos de todos os inputs.',
      'inferRouterOutputs<AppRouter>: tipos de todos os outputs.',
      'Use em interfaces de componentes sem duplicar tipos.',
    ],
    tip: 'inferRouterInputs e inferRouterOutputs são o mecanismo que permite usar os tipos tRPC fora dos hooks — em interfaces de componentes, por exemplo.',
  },
  {
    level: 'Senior',
    q: 'Como lidar com upload de arquivo em tRPC?',
    a: 'tRPC não é ideal para upload de arquivo grande. Opções: (1) Arquivo pequeno: base64 no input Zod. (2) Arquivo grande: procedure gera presigned URL do S3, cliente faz upload direto para S3. (3) Endpoint HTTP separado fora do tRPC. Nunca faça upload de binário grande via JSON.',
    bullets: [
      'Presigned URL: procedure gera URL, cliente envia diretamente ao S3.',
      'Base64: só para arquivos pequenos — tráfego 33% maior.',
      'Endpoint HTTP separado: escape hatch quando tRPC não serve.',
    ],
    tip: 'Citar presigned URL como padrão para arquivos grandes demonstra que você conhece a solução correta — e os limites do tRPC.',
  },
  {
    level: 'Senior',
    q: 'Quais são as melhores práticas de segurança em tRPC?',
    a: 'Toda procedure que acessa dados do usuário deve usar protectedProcedure. Valide todo input com Zod. Configure CORS correto no handler HTTP. Use errorFormatter para sanitizar erros em produção. Rate limiting no nível HTTP antes de chegar ao tRPC. Não retorne IDs internos — use UUIDs ou slugs.',
    bullets: [
      'protectedProcedure em tudo que exige auth — TypeScript garante.',
      'Zod em todo input — nunca confie em dados do cliente.',
      'errorFormatter: stack traces nunca chegam ao cliente em produção.',
    ],
    tip: 'Mencionar rate limiting no nível HTTP — antes do tRPC — mostra que você entende defesa em profundidade.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre tRPC v10 e v11?',
    a: 'tRPC v11: (1) SSE (Server-Sent Events) nativo — subscriptions sem WebSocket setup. (2) httpBatchStreamLink para streaming com Next.js App Router. (3) Melhor integração com React Query v5 (TanStack Query). (4) API de procedimento mais ergonômica. (5) Performance melhorada na inferência de tipos TypeScript.',
    bullets: [
      'SSE nativo: subscriptions sem WebSocket — configuração mais simples.',
      'httpBatchStreamLink: streaming support no Next.js App Router.',
      'TanStack Query v5: integração com a versão mais recente.',
    ],
    tip: 'Citar httpBatchStreamLink como a mudança que viabiliza tRPC no App Router com streaming é o detalhe de quem acompanha os releases.',
  },
]

// ── Cheatsheet ───────────────────────────────────────────────────────────────

const CS_HOOKS: HookItem[] = [
  { name: 'trpc.[proc].useQuery(input)',         sig: '{ enabled?, staleTime?, select?, placeholderData? }', desc: 'Query com tipos inferidos — equivale a React Query useQuery' },
  { name: 'trpc.[proc].useMutation()',           sig: '{ onSuccess?, onError?, onSettled? }',                desc: 'Mutation — retorna { mutate, mutateAsync, isPending, isError }' },
  { name: 'trpc.[proc].useInfiniteQuery(input)', sig: '{ getNextPageParam }',                               desc: 'Paginação infinita — data.pages, fetchNextPage(), hasNextPage' },
  { name: 'trpc.useUtils()',                     sig: '() => utils',                                        desc: 'Acesso tipado ao QueryClient — utils.post.list.invalidate()' },
  { name: 'appRouter.createCaller(ctx)',         sig: '(context) => caller',                                desc: 'Server Components e testes — sem HTTP, ainda processa middlewares' },
]

const CS_RULES: RuleItem[] = [
  { ok: true,  t: 'Sempre use .input(z.object(...)) em toda procedure' },
  { ok: false, t: 'Procedure sem Zod — input é any, sem type safety de runtime' },
  { ok: true,  t: 'Configure superjson transformer nos dois lados (servidor e cliente)' },
  { ok: false, t: 'Date retornada pelo servidor sem superjson — chega como string no cliente' },
  { ok: true,  t: 'errorFormatter sanitiza erros — stack traces nunca ao cliente em produção' },
  { ok: false, t: 'Expor detalhes internos de erro (stack, mensagens de DB) ao cliente' },
  { ok: true,  t: 'createCaller para Server Components e testes — sem overhead de rede' },
  { ok: false, t: 'Usar tRPC para API pública consumida por clientes não-TypeScript' },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Quando usar tRPC',
    trick: 'MATE',
    expansion: [
      ['M — Monorepo TypeScript', 'servidor e cliente compartilham código no mesmo repositório'],
      ['A — Acoplamento aceito', 'breaking changes chegam imediatamente — equipe está OK com isso'],
      ['T — Team única', 'front e back controlados pela mesma equipe, sem clientes externos'],
      ['E — Erros em compile-time', 'type safety end-to-end sem codegen é o superpoder principal'],
    ],
    explanation: 'MATE resume as condições para tRPC brilhar. Se qualquer uma falhar — clientes externos, equipes separadas, necessidade de cache HTTP de CDN — REST ou GraphQL são mais adequados. Use MATE como checklist antes de adotar tRPC em um projeto.',
    example: 'Checklist: Monorepo TS? ✓ Acoplamento OK? ✓ Team única? ✓ Erros compile-time? ✓ → Use tRPC',
    why: 'MATE evita a armadilha de adotar tRPC onde não faz sentido — especialmente APIs públicas ou projetos com clientes não-TypeScript. O custo do acoplamento forte não vale sem os benefícios de type safety.',
  },
  {
    label: 'Cadeia de middleware tRPC',
    trick: 'CMP',
    expansion: [
      ['C — Context', 'createContext executa uma vez por request — JWT decodificado, DB conectado'],
      ['M — Middleware', 'protectedProcedure.use() valida e refina o tipo do ctx'],
      ['P — Procedure', 'handler executa com ctx tipado — TypeScript garante o que existe'],
    ],
    explanation: 'CMP = Context, Middleware, Procedure. A ordem é sempre essa. O contexto é criado uma vez. O middleware o refina e valida (auth). A procedure o usa com o tipo correto. Lembrar CMP ajuda a saber onde implementar cada responsabilidade em vez de colocar tudo no handler.',
    example: 'createContext → { session } → middleware verifica session → next({ ctx: { userId } }) → procedure usa ctx.userId',
    why: 'Confundir onde validar auth (middleware vs handler) é o erro que cria procedures públicas que deveriam ser protegidas. CMP deixa claro: validação é responsabilidade do middleware, não da procedure.',
  },
  {
    label: 'Os tradeoffs centrais do tRPC',
    trick: 'TAC',
    expansion: [
      ['T — Type safety', 'inferência automática do servidor ao cliente sem codegen — o superpoder'],
      ['A — Acoplamento forte', 'breaking changes chegam imediatamente — bom em monorepo, ruim com externos'],
      ['C — Codegen-free', 'sem etapa de geração, sem arquivos intermediários, sem schema separado'],
    ],
    explanation: 'TAC resume os tradeoffs do tRPC em três palavras. Type safety é o benefício central. Acoplamento forte é o risco — clientes externos ficam sem o benefício dos tipos e com o risco de breaking changes. Codegen-free é o diferencial de DX que torna tRPC atrativo para monorepos.',
    example: 'Entrevista: "tRPC dá type safety end-to-end (T), mas cria acoplamento forte (A) — ideal para monorepos onde servidor e cliente deployam juntos e não há clientes externos (C)."',
    why: 'TAC em 3 palavras cobre o que o entrevistador quer ouvir sobre tRPC. É mais defensável do que "é melhor que REST" — demonstra que você entende os custos e benefícios reais.',
  },
]

// ── Anti-patterns ─────────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Procedure sem validação de input Zod',
    badDesc: 'Input any — sem type safety de runtime, vulnerável a dados malformados',
    badCode: [
      { t: 'publicProcedure' },
      { t: '  // sem .input() — input é any', c: '#ef4444' },
      { t: '  .query(async ({ input }) => {' },
      { t: '    return db.user.findUnique({', c: '#ef4444' },
      { t: '      where: { id: input.id }', c: '#ef4444' },
      { t: '    })' },
      { t: '  })' },
    ],
    goodDesc: 'Zod valida e tipa o input — erros reportados antes de chegar ao handler',
    goodCode: [
      { t: 'publicProcedure' },
      { t: '  .input(z.object({ id: z.string().uuid() }))', c: '#4ade80' },
      { t: '  .query(async ({ input }) => {', c: '#4ade80' },
      { t: '    return db.user.findUnique({' },
      { t: '      where: { id: input.id }  // tipado: string uuid', c: '#4ade80' },
      { t: '    })' },
      { t: '  })' },
    ],
    why: 'Sem .input(zod), input é any — sem validação de runtime. Dados malformados chegam ao handler e podem causar erros de DB ou comportamento inesperado. Zod valida antes, retorna BAD_REQUEST estruturado.',
  },
  {
    title: 'Usar tRPC para API consumida por clientes externos',
    badDesc: 'App mobile iOS tentando consumir tRPC — sem tipos, formato frágil',
    badCode: [
      { t: '// iOS Swift — tentando consumir tRPC:', c: '#475569' },
      { t: "let url = '/api/trpc/user.getById'", c: '#ef4444' },
      { t: "  + '?input={\"id\":\"abc\"}'", c: '#ef4444' },
      { t: '// Sem tipos, sem autocomplete', c: '#475569' },
      { t: '// Mudança no servidor quebra silenciosamente', c: '#ef4444' },
    ],
    goodDesc: 'REST com OpenAPI para clientes externos; tRPC para o web app TypeScript',
    goodCode: [
      { t: '// Para clientes externos: REST', c: '#475569' },
      { t: 'GET /api/users/:id', c: '#4ade80' },
      { t: '// OpenAPI spec → tipos para qualquer linguagem', c: '#475569' },
      { t: '// tRPC fica para: web app TypeScript interno', c: '#4ade80' },
    ],
    why: 'tRPC é para monorepos TypeScript. Clientes externos não se beneficiam da inferência de tipos — ficam com o acoplamento sem o benefício. REST com OpenAPI gera tipos para qualquer linguagem e é universalmente compreendido.',
  },
  {
    title: 'Erros internos expostos ao cliente sem errorFormatter',
    badDesc: 'Stack traces e detalhes de DB chegam ao cliente em produção',
    badCode: [
      { t: '// Sem errorFormatter — defaults expõem internos:', c: '#475569' },
      { t: 'const t = initTRPC.create()', c: '#ef4444' },
      { t: '', c: '#475569' },
      { t: '// Cliente recebe em produção:', c: '#475569' },
      { t: '{ message: "Connection refused postgres://...", ', c: '#ef4444' },
      { t: '  stack: "Error at /opt/app/server/..." }', c: '#ef4444' },
    ],
    goodDesc: 'errorFormatter filtra o que o cliente pode ver',
    goodCode: [
      { t: 'initTRPC.create({', c: '#4ade80' },
      { t: '  errorFormatter({ shape, error }) {', c: '#4ade80' },
      { t: '    return { ...shape, data: {', c: '#4ade80' },
      { t: '      zodError: error.code === "BAD_REQUEST"', c: '#4ade80' },
      { t: '        ? error.cause?.flatten() : null,', c: '#4ade80' },
      { t: '    } }', c: '#4ade80' },
      { t: '  },', c: '#4ade80' },
      { t: '})', c: '#4ade80' },
    ],
    why: 'Sem errorFormatter, stack traces com caminhos de arquivo, strings de conexão ao banco e detalhes internos chegam ao cliente. errorFormatter é o último ponto de controle — filtre tudo exceto o que o cliente precisa ver.',
  },
  {
    title: 'Date retornada pelo servidor sem superjson',
    badDesc: 'JSON.stringify serializa Date como string — cliente recebe tipo errado',
    badCode: [
      { t: '// Servidor retorna:', c: '#475569' },
      { t: '.query(() => ({ createdAt: new Date() }))', c: '#ef4444' },
      { t: '', c: '#475569' },
      { t: '// Cliente recebe:', c: '#475569' },
      { t: 'data.createdAt  // string: "2024-01-01T..."', c: '#ef4444' },
      { t: 'data.createdAt.getFullYear()  // TypeError!', c: '#ef4444' },
    ],
    goodDesc: 'superjson preserva Date, Map, Set, BigInt — configure nos dois lados',
    goodCode: [
      { t: '// Servidor:', c: '#475569' },
      { t: 'initTRPC.create({ transformer: superjson })', c: '#4ade80' },
      { t: '', c: '#475569' },
      { t: '// Cliente (link):', c: '#475569' },
      { t: 'httpBatchLink({ url, transformer: superjson })', c: '#4ade80' },
      { t: '', c: '#475569' },
      { t: 'data.createdAt  // Date — .getFullYear() funciona!', c: '#4ade80' },
    ],
    why: 'JSON não tem tipo Date — serializa como string. superjson adiciona metadados de tipo ao payload e deserializa corretamente. Configure em ambos os lados — servidor e cliente — caso contrário o transformer de um lado não tem correspondência no outro.',
  },
]

// ── Comparative ───────────────────────────────────────────────────────────────

const COMP_OPTIONS: CompOption[] = [
  { name: 'tRPC',    color: C },
  { name: 'REST',    color: AMB },
  { name: 'GraphQL', color: PRP },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Type safety',
    category: 'Qualidade',
    values: {
      'tRPC':    'Inferência automática — sem codegen, sem contrato explícito',
      'REST':    'OpenAPI/Swagger com codegen — verboso, erro humano possível',
      'GraphQL': 'graphql-codegen — bom mas requer schema + geração extra',
    },
    winner: 'tRPC',
  },
  {
    criterion: 'API pública / multi-cliente',
    category: 'Alcance',
    values: {
      'tRPC':    'Não serve — requer TypeScript em ambos os lados',
      'REST':    'Universal — qualquer cliente sem dependência de TS',
      'GraphQL': 'Schema auto-documentado — qualquer cliente com geração de tipos',
    },
    winner: 'REST',
  },
  {
    criterion: 'Versionamento',
    category: 'Evolução',
    values: {
      'tRPC':    'Difícil — breaking changes chegam imediatamente ao cliente',
      'REST':    '/v1, /v2 — clientes antigos continuam funcionando',
      'GraphQL': 'Deprecation de campos — remoção gradual sem breaking change',
    },
    winner: 'REST',
  },
  {
    criterion: 'Cache HTTP / CDN',
    category: 'Performance',
    values: {
      'tRPC':    'Limitado — httpBatchLink usa POST, não cacheable por CDN',
      'REST':    'Excelente — GET com Cache-Control, CDNs cacheiam nativamente',
      'GraphQL': 'Limitado — POST padrão, persisted queries contornam mas aumentam complexidade',
    },
    winner: 'REST',
  },
  {
    criterion: 'DX e produtividade',
    category: 'Experiência',
    values: {
      'tRPC':    'Máxima — autocomplete completo, sem schema, sem codegen',
      'REST':    'Boa — simples mas sem type safety automático',
      'GraphQL': 'Boa — schema + codegen add overhead inicial',
    },
    winner: 'tRPC',
  },
  {
    criterion: 'Tempo real (subscriptions)',
    category: 'Features',
    values: {
      'tRPC':    'WebSocket (v10) e SSE nativo (v11) — configuração adicional',
      'REST':    'SSE com EventSource — implementação manual',
      'GraphQL': 'Subscriptions são primitiva nativa do schema',
    },
    winner: 'GraphQL',
  },
  {
    criterion: 'Quando usar',
    category: 'Decisão',
    values: {
      'tRPC':    'Monorepo TypeScript, mesma equipe, sem clientes externos',
      'REST':    'API pública, múltiplos clientes, cache HTTP crítico',
      'GraphQL': 'BFF, múltiplos clientes com necessidades diferentes de dados',
    },
    winner: 'tRPC',
  },
]

// ── Builders ─────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'tRPC',
    stackLabel: 'Frontend / TypeScript',
    coverTitle: 'tRPC Q&A Review',
    coverSubtitle: 'Type-safe RPC — nível pleno/sênior',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'tRPC',
    accentColor: C,
    stackLabel: 'Frontend / TypeScript',
    coverTitle: 'tRPC CheatSheet',
    coverSubtitle: 'Servidor, cliente e regras numa página',
    sections: {
      hooks: CS_HOOKS,
      depRows: [],
      rules: CS_RULES,
      performanceTips: [
        'httpBatchLink agrupa N calls em 1 request HTTP — use em produção',
        'createCaller em Server Components: sem HTTP, sem latência de rede',
        'superjson nos dois lados — servidor e cliente — para preservar Date/Map/Set',
        'errorFormatter em produção: nunca retorne stack traces ao cliente',
      ],
      patterns: [],
      mentalModels: [
        'AppRouter é um tipo, não código — erased em runtime pelo TypeScript',
        'Context → Middleware → Procedure: cada camada tem responsabilidade clara',
        'useUtils() é o QueryClient do React Query, mas tipado com o AppRouter',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'tRPC',
    stackLabel: 'Frontend / TypeScript',
    coverTitle: 'tRPC Mnemônicos',
    coverSubtitle: 'MATE, CMP, TAC — os truques que grudam',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'tRPC',
    stackLabel: 'Frontend / TypeScript',
    coverTitle: 'tRPC Anti-patterns',
    coverSubtitle: 'Os 4 erros mais comuns — e como corrigir',
  }),
  comparative: () => buildComparativeRefPdf({
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    scenarios: [
      {
        scenario: 'Monorepo Next.js + TypeScript full-stack',
        recommendation: 'tRPC',
        reason: 'DX máxima, zero codegen, type safety automático — caso de uso central do tRPC',
      },
      {
        scenario: 'API pública consumida por mobile nativo',
        recommendation: 'REST com OpenAPI',
        reason: 'Clientes não-TypeScript precisam de contrato explícito — REST com geração de tipos para cada linguagem',
      },
      {
        scenario: 'BFF para múltiplos clientes com dados diferentes',
        recommendation: 'GraphQL',
        reason: 'Flexibilidade de campos por cliente é o caso de uso central do GraphQL',
      },
    ],
    skillName: 'tRPC',
    accentColor: C,
    stackLabel: 'Frontend / TypeScript',
    coverTitle: 'tRPC vs REST vs GraphQL',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function TrpcPdfs() {
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
