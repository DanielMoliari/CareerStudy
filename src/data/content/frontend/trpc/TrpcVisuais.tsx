'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

// ── Paleta tRPC ─────────────────────────────────────────────────────────────────
const C      = '#398ccb'   // tRPC blue
const SEC    = '#2d6fa8'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const RED    = '#ef4444'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Request lifecycle: Client → tRPC → Server
// Justificativa: o fluxo completo de uma chamada tRPC (httpBatchLink agrupando,
// handler decodificando, middleware executando, procedure respondendo) não é
// intuitivo. Um diagrama de sequência com os atores reais torna o caminho
// inequívoco e ajuda a debugar problemas de auth e context.
// ═══════════════════════════════════════════════════════════════════════════════

const TRPC_ACTORS: SeqActor[] = [
  { id: 'component', label: 'Componente React', color: GRN,  icon: '⚛️' },
  { id: 'link',      label: 'httpBatchLink',    color: C,    icon: '🔗' },
  { id: 'handler',   label: 'API Handler',      color: AMB,  icon: '🖥️' },
  { id: 'context',   label: 'createContext',    color: PRP,  icon: '🔑' },
  { id: 'mw',        label: 'Middleware',        color: RED,  icon: '🛡️' },
  { id: 'procedure', label: 'Procedure',         color: GRN,  icon: '⚙️' },
]

const TRPC_MESSAGES: SeqMessage[] = [
  { from: 'component', to: 'link',      label: 'trpc.user.getById.useQuery({ id })',   type: 'sync',   note: 'React Query dispara o fetch' },
  { from: 'link',      to: 'handler',   label: 'POST /api/trpc/user.getById',          type: 'sync',   note: 'httpBatchLink agrupa N calls em 1 request' },
  { from: 'handler',   to: 'context',   label: 'createContext(req, res)',              type: 'create', note: 'Executado 1x por request' },
  { from: 'context',   to: 'handler',   label: '{ session, db }',                      type: 'return', note: 'ctx passado para toda a cadeia' },
  { from: 'handler',   to: 'mw',        label: 'protectedProcedure.use(middleware)',   type: 'sync',   note: 'Middleware de auth executa' },
  { from: 'mw',        to: 'procedure', label: 'next({ ctx: { ...ctx, userId } })',    type: 'sync',   note: 'Tipo de ctx refinado — userId existe' },
  { from: 'procedure', to: 'handler',   label: 'return db.user.findUnique(...)',        type: 'return', note: 'Output inferido automaticamente' },
  { from: 'handler',   to: 'link',      label: '{ result: { data: User } }',           type: 'return', note: 'JSON serializado' },
  { from: 'link',      to: 'component', label: '{ data: User } — tipado!',             type: 'return', note: 'React Query armazena no cache' },
]

const TRPC_GROUPS: SeqGroup[] = [
  { label: 'Cliente (Browser)',  kind: 'alt', fromMsg: 0, toMsg: 1 },
  { label: 'Servidor (Node.js)', kind: 'alt', fromMsg: 2, toMsg: 7 },
  { label: 'Cliente (Browser)',  kind: 'alt', fromMsg: 8, toMsg: 8 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — tRPC vs REST vs GraphQL (ComparisonTable)
// Justificativa: "quando usar tRPC vs REST vs GraphQL?" é a pergunta de
// entrevista mais comum sobre tRPC. A tabela multi-critério dá uma resposta
// defensável baseada em evidências — não em opinião.
// ═══════════════════════════════════════════════════════════════════════════════

const CMP_OPTIONS: ComparisonOption[] = [
  { id: 'trpc',    label: 'tRPC',    sublabel: 'v10/v11',          color: C },
  { id: 'rest',    label: 'REST',    sublabel: 'HTTP padrão',      color: AMB },
  { id: 'graphql', label: 'GraphQL', sublabel: 'BFF pattern',      color: PRP },
]

const CMP_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'typesafety',
    label: 'Type safety',
    category: 'Qualidade',
    description: 'Tipos compartilhados entre servidor e cliente sem declaração manual',
    values: {
      trpc:    { rating: 'excellent', note: 'Tipos inferidos automaticamente — sem codegen, sem contrato explícito' },
      rest:    { rating: 'fair',      note: 'OpenAPI/Swagger com codegen — mais verboso, erro humano possível' },
      graphql: { rating: 'good',      note: 'graphql-codegen — bom mas requer schema + codegen step' },
    },
  },
  {
    id: 'publicapi',
    label: 'API pública / multi-cliente',
    category: 'Alcance',
    description: 'Suporte a clientes não-TypeScript (mobile nativo, terceiros)',
    values: {
      trpc:    { rating: 'poor',      note: 'Não serve para clientes não-TypeScript — acoplamento forte' },
      rest:    { rating: 'excellent', note: 'Padrão universal — qualquer cliente consome sem dependência de TS' },
      graphql: { rating: 'excellent', note: 'Schema auto-documentado, qualquer cliente com geração de tipos' },
    },
  },
  {
    id: 'versioning',
    label: 'Versionamento',
    category: 'Evolução',
    description: 'Facilidade de fazer breaking changes sem quebrar clientes',
    values: {
      trpc:    { rating: 'poor',      note: 'Breaking changes chegam imediatamente ao cliente — bom em monorepo, ruim com clientes externos' },
      rest:    { rating: 'excellent', note: '/v1, /v2 — clientes antigos continuam funcionando' },
      graphql: { rating: 'good',      note: 'Deprecation de campos — remoção gradual sem breaking change' },
    },
  },
  {
    id: 'flexdata',
    label: 'Flexibilidade de dados',
    category: 'DX Cliente',
    description: 'Cliente escolhe quais campos buscar (evita over/under-fetching)',
    values: {
      trpc:    { rating: 'fair',      note: 'use select para transformar, mas output é o que o servidor define' },
      rest:    { rating: 'fair',      note: 'Campos fixos por endpoint — necessita ?fields= customizado' },
      graphql: { rating: 'excellent', note: 'Cliente define exatamente os campos — ideal para múltiplos clientes com necessidades diferentes' },
    },
  },
  {
    id: 'httpcache',
    label: 'Cache HTTP / CDN',
    category: 'Performance',
    description: 'Aproveitar cache de rede nativo (CDN, browser)',
    values: {
      trpc:    { rating: 'fair',      note: 'httpBatchLink usa POST — não cacheable por CDN. httpLink GET cacheable mas sem batch' },
      rest:    { rating: 'excellent', note: 'GET com Cache-Control — CDNs cacheiam nativamente' },
      graphql: { rating: 'poor',      note: 'POST padrão — sem cache HTTP. Persisted queries + GET contornam mas aumentam complexidade' },
    },
  },
  {
    id: 'realtime',
    label: 'Tempo real (subscriptions)',
    category: 'Features',
    description: 'Suporte nativo a eventos server-push',
    values: {
      trpc:    { rating: 'good',      note: 'WebSocket (v10) e SSE (v11 nativo) — configuração adicional' },
      rest:    { rating: 'fair',      note: 'SSE com EventSource ou polling — implementação manual' },
      graphql: { rating: 'excellent', note: 'Subscriptions são primitiva nativa do schema — bem suportado' },
    },
  },
  {
    id: 'devex',
    label: 'DX e setup',
    category: 'Experiência',
    description: 'Velocidade para começar e produtividade no dia a dia',
    values: {
      trpc:    { rating: 'excellent', note: 'Sem schema, sem codegen, autocomplete completo no editor imediato' },
      rest:    { rating: 'good',      note: 'Simples para começar — mais boilerplate para types no cliente' },
      graphql: { rating: 'fair',      note: 'Schema + codegen + resolver — overhead de setup significativo' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Anti-patterns em tRPC
// Justificativa: os erros mais caros em tRPC (expor para clientes externos,
// mutation sem Zod, context sem tipagem) são invisíveis em texto descritivo.
// O diff errado×correto cria reconhecimento de padrão imediato.
// ═══════════════════════════════════════════════════════════════════════════════

const TRPC_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Procedure sem validação de input com Zod',
    wrong: [
      [{ text: 'publicProcedure', color: FG }],
      [{ text: '  .query(async ({ input }) => {', color: RED }],
      [{ text: '    // input é any — sem validação', color: FGMUTE }],
      [{ text: '    return db.user.findUnique({', color: FGMUTE }],
      [{ text: '      where: { id: input.id }', color: RED }],
      [{ text: '    })', color: FGMUTE }],
      [{ text: '  })', color: FG }],
    ],
    right: [
      [{ text: 'publicProcedure', color: FG }],
      [{ text: '  .input(z.object({ id: z.string().uuid() }))', color: GRN }],
      [{ text: '  .query(async ({ input }) => {', color: GRN }],
      [{ text: '    // input.id é string uuid — garantido pelo Zod', color: FGMUTE }],
      [{ text: '    return db.user.findUnique({', color: FGMUTE }],
      [{ text: '      where: { id: input.id }', color: GRN }],
      [{ text: '    })', color: FGMUTE }],
      [{ text: '  })', color: FG }],
    ],
    why: 'Sem .input(zod), input é any — sem validação de runtime e sem type safety. Qualquer dado malformado pode causar erro de runtime ou pior, SQL injection se passado direto para a query.',
  },
  {
    title: 'Usar tRPC para API consumida por clientes externos',
    wrong: [
      [{ text: '// ❌ App mobile iOS tentando consumir tRPC:', color: RED }],
      [{ text: "fetch('/api/trpc/user.getById?input={\"id\":\"123\"}')", color: RED }],
      [{ text: '// Sem tipos, sem autocomplete, formato frágil', color: FGMUTE }],
      [{ text: '// Mudança no servidor quebra silenciosamente', color: FGMUTE }],
    ],
    right: [
      [{ text: '// ✓ Para APIs externas: REST com documentação', color: GRN }],
      [{ text: "// GET /api/users/:id", color: GRN }],
      [{ text: '// OpenAPI spec → gera tipos para qualquer cliente', color: FGMUTE }],
      [{ text: '// tRPC fica para: web app TypeScript interno', color: FGMUTE }],
    ],
    why: 'tRPC é para monorepos TypeScript onde servidor e cliente compartilham código. Clientes externos (iOS, Android, terceiros) não se beneficiam da inferência de tipos — o acoplamento fica sem o benefício.',
  },
  {
    title: 'Não sanitizar erros antes de retornar ao cliente',
    wrong: [
      [{ text: '// Sem errorFormatter — erros internos expostos', color: FG }],
      [{ text: 'const t = initTRPC.create()', color: RED }],
      [{ text: '// Stack traces, detalhes de banco, senhas', color: RED }],
      [{ text: '// podem vazar para o cliente em produção', color: RED }],
    ],
    right: [
      [{ text: 'const t = initTRPC.create({', color: FG }],
      [{ text: '  errorFormatter({ shape, error }) {', color: GRN }],
      [{ text: '    return {', color: GRN }],
      [{ text: '      ...shape,', color: GRN }],
      [{ text: '      data: {', color: GRN }],
      [{ text: '        zodError: error.code === "BAD_REQUEST"', color: GRN }],
      [{ text: '          ? error.cause?.flatten() : null,', color: GRN }],
      [{ text: '      },', color: GRN }],
      [{ text: '    }', color: GRN }],
      [{ text: '  },', color: GRN }],
      [{ text: '})', color: FG }],
    ],
    why: 'Sem errorFormatter, stack traces e detalhes internos são expostos em produção. Configure errorFormatter para filtrar o que o cliente pode ver — erros Zod são seguros, detalhes de DB não são.',
  },
  {
    title: 'Ignorar o transformer superjson — Date viram string',
    wrong: [
      [{ text: '// Servidor define:', color: FGMUTE }],
      [{ text: '.query(() => ({ createdAt: new Date() }))', color: FG }],
      [{ text: '', color: FG }],
      [{ text: '// Cliente recebe:', color: FGMUTE }],
      [{ text: 'const { data } = trpc.item.get.useQuery({})', color: FG }],
      [{ text: 'data.createdAt // string — "2024-01-01T..."', color: RED }],
      [{ text: 'data.createdAt.getFullYear() // TypeError!', color: RED }],
    ],
    right: [
      [{ text: '// Servidor — com superjson:', color: FGMUTE }],
      [{ text: 'initTRPC.create({ transformer: superjson })', color: GRN }],
      [{ text: '', color: GRN }],
      [{ text: '// Cliente — com superjson no link:', color: FGMUTE }],
      [{ text: 'httpBatchLink({ url, transformer: superjson })', color: GRN }],
      [{ text: '', color: GRN }],
      [{ text: 'data.createdAt // Date — .getFullYear() funciona!', color: GRN }],
    ],
    why: 'JSON.stringify serializa Date como string. superjson preserva Date, Map, Set, BigInt, undefined. Configure nos dois lados (servidor e cliente) para dados complexos.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Árvore de decisão: quando usar tRPC
// Justificativa: a decisão "devo usar tRPC aqui?" tem muitas variáveis.
// A árvore de decisão interativa converte um raciocínio que levaria parágrafos
// em uma travessia de 3-4 cliques com conclusão acionável.
// ═══════════════════════════════════════════════════════════════════════════════

const DECISION_ROOT: DTNode = {
  id: 'root',
  question: 'O servidor e o cliente são TypeScript controlados pela mesma equipe?',
  children: [
    { label: 'Sim — monorepo ou mesmo repositório', nodeId: 'same-team', color: GRN },
    { label: 'Não — equipes ou linguagens diferentes', nodeId: 'different', color: RED },
  ],
}

const DECISION_NODES: Record<string, DTNode> = {
  'same-team': {
    id: 'same-team',
    question: 'Haverá clientes externos consumindo essa API (mobile nativo, terceiros)?',
    children: [
      { label: 'Não — só web app TypeScript', nodeId: 'trpc-yes', color: C },
      { label: 'Sim — múltiplos clientes', nodeId: 'multi-client', color: AMB },
    ],
  },
  'different': {
    id: 'different',
    recommendation: 'REST ou GraphQL',
    detail: 'tRPC requer TypeScript em ambos os lados e compartilhamento de código. Com equipes separadas ou linguagens diferentes, o overhead de alinhar o monorepo não vale o benefício. REST com OpenAPI é mais adequado.',
    color: RED,
    icon: '🚫',
  },
  'trpc-yes': {
    id: 'trpc-yes',
    question: 'Precisará de cache HTTP nativo via CDN (alta escala de leitura)?',
    children: [
      { label: 'Sim — muitas leituras cacheable por CDN', nodeId: 'rest-cache', color: AMB },
      { label: 'Não — cache de cliente (React Query) é suficiente', nodeId: 'trpc-final', color: GRN },
    ],
  },
  'multi-client': {
    id: 'multi-client',
    question: 'Os clientes precisam de flexibilidade para compor queries diferentes?',
    children: [
      { label: 'Sim — cada cliente precisa de campos diferentes', nodeId: 'graphql-rec', color: PRP },
      { label: 'Não — resposta fixa por endpoint é OK', nodeId: 'rest-external', color: AMB },
    ],
  },
  'trpc-final': {
    id: 'trpc-final',
    recommendation: 'tRPC',
    detail: 'Stack ideal para tRPC: TypeScript full-stack, mesma equipe, sem clientes externos, React Query como cache suficiente. DX máxima com zero overhead de contrato ou codegen.',
    color: C,
    icon: '✅',
  },
  'rest-cache': {
    id: 'rest-cache',
    recommendation: 'REST com CDN',
    detail: 'Para leituras massivas onde cache HTTP de CDN é necessário, REST com GET e Cache-Control é mais adequado. tRPC com httpBatchLink usa POST — não cacheable por CDNs. Pode usar tRPC internamente e REST para endpoints críticos de leitura.',
    color: AMB,
    icon: '📦',
  },
  'graphql-rec': {
    id: 'graphql-rec',
    recommendation: 'GraphQL',
    detail: 'BFF pattern ou múltiplos clientes com necessidades diferentes de dados é o caso de uso central do GraphQL. Schema auto-documentado, flexibilidade de queries, subscriptions nativas.',
    color: PRP,
    icon: '🔮',
  },
  'rest-external': {
    id: 'rest-external',
    recommendation: 'REST com OpenAPI',
    detail: 'API pública ou multi-cliente com resposta fixa por endpoint. REST com OpenAPI/Swagger gera tipos para qualquer linguagem e é universalmente compreendido por qualquer cliente.',
    color: AMB,
    icon: '🌐',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function TrpcVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'request-lifecycle',
      title: 'Request Lifecycle',
      subtitle: 'Do useQuery no componente até a procedure — com middleware e context',
      accent: C,
      component: (
        <SequenceDiagram
          actors={TRPC_ACTORS}
          messages={TRPC_MESSAGES}
          groups={TRPC_GROUPS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'trpc-vs-rest-graphql',
      title: 'tRPC × REST × GraphQL',
      subtitle: 'Comparação por 7 critérios — qual usar em cada cenário',
      accent: AMB,
      component: (
        <ComparisonTable
          options={CMP_OPTIONS}
          criteria={CMP_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns tRPC',
      subtitle: 'Os 4 erros mais comuns — sem Zod, API pública, erros expostos, sem superjson',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={TRPC_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'when-to-use',
      title: 'Quando Usar tRPC',
      subtitle: 'Árvore de decisão interativa — tRPC vs REST vs GraphQL',
      accent: GRN,
      component: (
        <DecisionTree
          root={DECISION_ROOT}
          nodes={DECISION_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
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
