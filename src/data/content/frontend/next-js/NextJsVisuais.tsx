'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { HookTimeline } from '@/components/visuals/HookTimeline'
import type { TimelinePhase } from '@/components/visuals/HookTimeline'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { VersionTimeline } from '@/components/visuals/VersionTimeline'
import type { VersionMilestone } from '@/components/visuals/VersionTimeline'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'

// ── Paleta Next.js ────────────────────────────────────────────────────────────
const C      = '#e2e8f0'   // Next.js branco/cinza claro
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const RED    = '#ef4444'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'

void LINE; void FG; void FGMUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — App Router vs Pages Router (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const ROUTER_OPTIONS: ComparisonOption[] = [
  { id: 'app', label: 'App Router', sublabel: 'Next.js 13+', color: C },
  { id: 'pages', label: 'Pages Router', sublabel: 'Legado / estável', color: FGMUTE },
]

const ROUTER_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'rsc',
    label: 'React Server Components',
    category: 'Paradigma',
    description: 'Suporte nativo a RSC — componentes que rodam exclusivamente no servidor',
    values: {
      app:   { rating: 'excellent', note: 'RSC por padrão — opt-in com "use client"' },
      pages: { rating: 'poor',      note: 'Não suporta RSC — todos os componentes são Client' },
    },
  },
  {
    id: 'data-fetching',
    label: 'Data Fetching',
    category: 'Paradigma',
    description: 'Como buscar dados para renderizar a página',
    values: {
      app:   { rating: 'excellent', note: 'async/await direto no componente Server' },
      pages: { rating: 'good',      note: 'getServerSideProps / getStaticProps / getInitialProps' },
    },
  },
  {
    id: 'caching',
    label: 'Caching granular',
    category: 'Performance',
    description: 'Controle fino de cache por fetch, segment ou rota',
    values: {
      app:   { rating: 'excellent', note: 'Per-fetch cache: force-cache, no-store, revalidate' },
      pages: { rating: 'fair',      note: 'ISR via revalidate no getStaticProps' },
    },
  },
  {
    id: 'layouts',
    label: 'Layouts aninhados',
    category: 'Roteamento',
    description: 'Suporte a múltiplos layouts persistentes em nested routes',
    values: {
      app:   { rating: 'excellent', note: 'layout.tsx aninhados por segment — persistem entre navegações' },
      pages: { rating: 'fair',      note: 'Requer wrappers manuais via _app.tsx' },
    },
  },
  {
    id: 'streaming',
    label: 'Streaming com Suspense',
    category: 'Performance',
    description: 'Enviar HTML progressivamente — UI aparece antes de todos os dados chegarem',
    values: {
      app:   { rating: 'excellent', note: 'Suspense + loading.tsx nativos, streaming automático' },
      pages: { rating: 'poor',      note: 'Não suportado' },
    },
  },
  {
    id: 'mutations',
    label: 'Server Actions',
    category: 'Mutações',
    description: 'Funções de servidor chamadas diretamente do cliente sem endpoint REST',
    values: {
      app:   { rating: 'excellent', note: '"use server" — sem API route necessária para forms/mutations' },
      pages: { rating: 'poor',      note: 'Não suportado — requer API routes' },
    },
  },
  {
    id: 'migration',
    label: 'Facilidade de migração',
    category: 'DX',
    description: 'Curva de aprendizado e compatibilidade com código existente',
    values: {
      app:   { rating: 'fair',  note: 'Nova paradigma — RSC requer rethinking de fetching' },
      pages: { rating: 'excellent', note: 'Familiar, bem documentado, estável' },
    },
  },
  {
    id: 'coexistence',
    label: 'Coexistência',
    category: 'Migração',
    description: 'Possibilidade de usar ambos no mesmo projeto durante migração',
    values: {
      app:   { rating: 'excellent', note: 'app/ e pages/ podem coexistir no mesmo projeto' },
      pages: { rating: 'excellent', note: 'Continua funcionando lado a lado com App Router' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Rendering Strategies: SSR, SSG, ISR, CSR (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const RENDER_OPTIONS: ComparisonOption[] = [
  { id: 'ssg',  label: 'SSG',  sublabel: 'Static Site Generation',  color: GRN },
  { id: 'isr',  label: 'ISR',  sublabel: 'Incremental Static Regen', color: AMB },
  { id: 'ssr',  label: 'SSR',  sublabel: 'Server-Side Rendering',   color: SKY },
  { id: 'csr',  label: 'CSR',  sublabel: 'Client-Side Rendering',   color: PRP },
]

const RENDER_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'when-rendered',
    label: 'Quando o HTML é gerado',
    category: 'Fundamento',
    values: {
      ssg: { rating: 'excellent', note: 'Build time — antes de qualquer request' },
      isr: { rating: 'good',      note: 'Build time + regeneração em background' },
      ssr: { rating: 'fair',      note: 'Por request — no servidor, a cada visita' },
      csr: { rating: 'poor',      note: 'No browser — depois do JS carregar' },
    },
  },
  {
    id: 'ttfb',
    label: 'TTFB (Time to First Byte)',
    category: 'Performance',
    values: {
      ssg: { rating: 'excellent', note: 'Mínimo — servido de CDN' },
      isr: { rating: 'excellent', note: 'Quase igual ao SSG' },
      ssr: { rating: 'fair',      note: 'Depende da latência do servidor' },
      csr: { rating: 'good',      note: 'Shell HTML rápido, dados chegam depois' },
    },
  },
  {
    id: 'freshness',
    label: 'Dados sempre atuais',
    category: 'Dados',
    values: {
      ssg: { rating: 'poor',      note: 'Stale até próximo build' },
      isr: { rating: 'good',      note: 'Stale-while-revalidate — eventual consistency' },
      ssr: { rating: 'excellent', note: 'Sempre fresco — dados buscados a cada request' },
      csr: { rating: 'excellent', note: 'Sempre fresco — fetch no browser após montar' },
    },
  },
  {
    id: 'seo',
    label: 'SEO',
    category: 'SEO',
    values: {
      ssg: { rating: 'excellent', note: 'HTML completo indexado pelos crawlers' },
      isr: { rating: 'excellent', note: 'Igual ao SSG' },
      ssr: { rating: 'excellent', note: 'HTML completo por request' },
      csr: { rating: 'poor',      note: 'Crawlers podem não executar JS — conteúdo não indexado' },
    },
  },
  {
    id: 'personalization',
    label: 'Personalização por usuário',
    category: 'Dados',
    values: {
      ssg: { rating: 'poor',      note: 'Conteúdo idêntico para todos' },
      isr: { rating: 'poor',      note: 'Conteúdo idêntico para todos' },
      ssr: { rating: 'excellent', note: 'Acessa cookies/headers — personaliza por usuário' },
      csr: { rating: 'excellent', note: 'Fetch autenticado no browser' },
    },
  },
  {
    id: 'server-load',
    label: 'Carga no servidor',
    category: 'Infra',
    values: {
      ssg: { rating: 'excellent', note: 'Zero — CDN serve tudo' },
      isr: { rating: 'excellent', note: 'Quase zero — regeneração eventual' },
      ssr: { rating: 'fair',      note: 'Servidor executa por request' },
      csr: { rating: 'good',      note: 'Apenas API calls — shell é estático' },
    },
  },
  {
    id: 'use-case',
    label: 'Casos de uso ideais',
    category: 'Quando usar',
    values: {
      ssg: { rating: 'excellent', note: 'Blog, docs, landing pages, marketing' },
      isr: { rating: 'excellent', note: 'Catálogos, e-commerce, preços' },
      ssr: { rating: 'excellent', note: 'Dashboard pessoal, search results, auth pages' },
      csr: { rating: 'good',      note: 'Admin panels, formulários complexos, mapas' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Server Components vs Client Components (visual interativo custom)
// ═══════════════════════════════════════════════════════════════════════════════

type SCCCFeature = {
  id: string
  label: string
  server: boolean | 'partial'
  client: boolean | 'partial'
  note: string
}

const SC_CC_FEATURES: SCCCFeature[] = [
  { id: 'async-await',     label: 'async/await direto',          server: true,      client: false,    note: 'Server Components podem ser funções async. Client Components precisam de useEffect + setState.' },
  { id: 'db-access',       label: 'Acessar banco de dados',       server: true,      client: false,    note: 'Server Components leem banco diretamente. Client Components precisam de API routes ou Server Actions.' },
  { id: 'env-vars',        label: 'Env vars secretas (sem NEXT_PUBLIC_)', server: true, client: false,  note: 'Server Components têm acesso total às env vars. Client Components só acessam as prefixadas com NEXT_PUBLIC_.' },
  { id: 'zero-js',         label: 'Zero JS enviado ao cliente',   server: true,      client: false,    note: 'Server Components geram apenas HTML/RSC payload. Nenhum JS da lógica de busca vai ao bundle do cliente.' },
  { id: 'use-state',       label: 'useState / useReducer',        server: false,     client: true,     note: 'Estado requer o browser. Server Components não têm estado — criam HTML estático.' },
  { id: 'events',          label: 'onClick, onChange, eventos',   server: false,     client: true,     note: 'Event handlers requerem JS no browser. Definem interatividade que só existe no cliente.' },
  { id: 'browser-apis',    label: 'window, localStorage, document', server: false,  client: true,      note: 'APIs do browser não existem no servidor. Acessá-las em Server Component causa erro de runtime.' },
  { id: 'effects',         label: 'useEffect / useLayoutEffect',  server: false,     client: true,     note: 'Effects são parte do ciclo de vida do React no cliente. Server Components não têm ciclo de vida.' },
  { id: 'receive-children', label: 'Receber Server Components como children', server: true, client: true, note: 'Padrão chave: Client Component com shell interativo recebe Server Components como children prop. O Server Component continua rodando no servidor.' },
  { id: 'use-context',     label: 'useContext',                    server: false,     client: true,     note: 'Context requer a árvore React no cliente. Server Components não têm acesso ao contexto de Client Components.' },
  { id: 'third-party',     label: 'Libs sem "use client" próprio', server: 'partial', client: true,    note: 'Muitas libs de UI dependem de window/useState. Wrap em Client Component com "use client" resolve.' },
]

function SCCCVisual() {
  const [selected, setSelected] = useState<string | null>(null)
  const sel = SC_CC_FEATURES.find(f => f.id === selected)

  function icon(val: boolean | 'partial') {
    if (val === true) return { text: '✓', color: GRN }
    if (val === false) return { text: '✗', color: RED }
    return { text: '~', color: AMB }
  }

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: FG, marginBottom: 4 }}>Server vs Client Components — capacidades</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Clique numa linha para ver a explicação detalhada</div>
      </div>

      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', gap: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Capacidade</div>
        <div style={{ fontSize: 10, color: GRN, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Server</div>
        <div style={{ fontSize: 10, color: C, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Client</div>
      </div>

      {SC_CC_FEATURES.map(f => {
        const si = icon(f.server)
        const ci = icon(f.client)
        const isActive = selected === f.id
        return (
          <div
            key={f.id}
            onClick={() => setSelected(isActive ? null : f.id)}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 120px 120px', gap: 8,
              padding: '8px 12px', borderRadius: 8, marginBottom: 4, cursor: 'pointer',
              background: isActive ? `${C}12` : `${CARD}80`,
              border: `1px solid ${isActive ? C : LINE}`,
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: 11, color: isActive ? FG : FGMUTE }}>{f.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: si.color, textAlign: 'center' }}>{si.text}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: ci.color, textAlign: 'center' }}>{ci.text}</div>
          </div>
        )
      })}

      {sel && (
        <div style={{
          marginTop: 12, padding: '12px 16px', borderRadius: 8,
          background: `${C}10`, border: `1px solid ${C}40`,
          fontSize: 12, color: FG, lineHeight: 1.7,
        }}>
          <span style={{ fontWeight: 700, color: C }}>{sel.label}: </span>{sel.note}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 10, color: FGMUTE }}>
        <span><span style={{ color: GRN, fontWeight: 700 }}>✓</span> Suportado</span>
        <span><span style={{ color: RED, fontWeight: 700 }}>✗</span> Não suportado</span>
        <span><span style={{ color: AMB, fontWeight: 700 }}>~</span> Parcial / requer wrapper</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Data Fetching Flow (CodeStepper)
// ═══════════════════════════════════════════════════════════════════════════════

const FETCH_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'server-fetch',
    label: 'Server Component fetch',
    code: `// app/posts/page.tsx (Server Component)
export default async function PostsPage() {
  // Fetch direto — sem useEffect, sem estado
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }, // ISR: revalida 1h
  }).then(r => r.json())

  return (
    <ul>
      {posts.map((p: Post) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  )
}`,
    steps: [
      { lineStart: 1, lineEnd: 2,  title: 'Server Component', explanation: 'Este arquivo é um Server Component — executa APENAS no servidor. Nenhum JS desta lógica vai para o bundle do cliente.', callStack: ['PostsPage()'] },
      { lineStart: 4, lineEnd: 7,  title: 'fetch() no servidor', explanation: 'Next.js estende o fetch nativo com opções de cache. `next: { revalidate: 3600 }` ativa ISR — o resultado é cacheado e revalidado em background a cada hora.', callStack: ['PostsPage()', 'fetch()'], memory: { posts: 'Promise<pending>' } },
      { lineStart: 7, lineEnd: 7,  title: 'Await resolve', explanation: 'Server Components podem usar await diretamente — são funções async. O resultado da Promise fica disponível como variável local.', callStack: ['PostsPage()'], memory: { posts: '[{id:1,title:...}, ...]' } },
      { lineStart: 9, lineEnd: 15, title: 'Render do HTML', explanation: 'O servidor renderiza o JSX para HTML/RSC payload. Os dados já estão disponíveis — zero loading state, zero skeleton, zero re-fetch no cliente.', callStack: ['PostsPage()'], output: 'HTML com posts já renderizados' },
    ],
  },
  {
    id: 'client-fetch',
    label: 'Client Component + React Query',
    code: `'use client'
import { useQuery } from '@tanstack/react-query'

export default function PostsClient() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      fetch('/api/posts').then(r => r.json()),
  })

  if (isLoading) return <Skeleton />

  return (
    <ul>
      {data?.map((p: Post) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  )
}`,
    steps: [
      { lineStart: 1, lineEnd: 1,  title: '"use client"', explanation: 'Marca este arquivo como Client Component. Todo o bundle JS desta função e suas dependências vai para o cliente.', callStack: ['hydration'] },
      { lineStart: 4, lineEnd: 9,  title: 'useQuery hook', explanation: 'React Query gerencia o fetch: caching, background refetch, deduplicação. O fetch acontece no browser depois do componente montar.', callStack: ['PostsClient()', 'useQuery()'], memory: { isLoading: 'true', data: 'undefined' } },
      { lineStart: 11, lineEnd: 11, title: 'Loading state', explanation: 'Enquanto o fetch está em andamento, isLoading=true. O componente renderiza o skeleton. Isso é um flash visível — diferente do Server Component que entrega o HTML pronto.', output: '<Skeleton /> exibido', memory: { isLoading: 'true' } },
      { lineStart: 13, lineEnd: 18, title: 'Dados chegam', explanation: 'Quando o fetch resolve, React Query atualiza o cache e força re-render. data agora tem os posts. isLoading=false, skeleton some.', output: '<ul> com posts renderizados', memory: { isLoading: 'false', data: '[{...}, ...]' } },
    ],
  },
  {
    id: 'server-action',
    label: 'Server Action (mutation)',
    code: `// actions.ts
'use server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string

  // Salva direto no banco — sem API route
  await db.posts.create({ data: { title } })

  // Invalida o cache da rota /posts
  revalidatePath('/posts')
}

// app/new-post/page.tsx
export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Criar</button>
    </form>
  )
}`,
    steps: [
      { lineStart: 2, lineEnd: 2,  title: '"use server"', explanation: 'Marca funções exportadas como Server Actions. Estas funções rodam SEMPRE no servidor — nunca são expostas ao cliente como código JS.', callStack: ['build'] },
      { lineStart: 5, lineEnd: 11, title: 'Função de servidor', explanation: 'createPost recebe FormData (do form HTML). Escreve no banco diretamente — sem precisar de API route. O segredo do banco nunca sai do servidor.', callStack: ['createPost()', 'db.posts.create()'] },
      { lineStart: 13, lineEnd: 13, title: 'revalidatePath', explanation: 'Invalida o cache da rota /posts. Próximo visitante da página /posts vai ver o post novo — Next.js regenera a página em background.', output: 'Cache /posts invalidado' },
      { lineStart: 16, lineEnd: 23, title: 'Form no cliente', explanation: 'O form usa a Server Action diretamente no atributo action. Next.js gera uma referência segura — o código da Server Action nunca vai para o browser.', output: 'Form com progressive enhancement' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Middleware Pipeline (HookTimeline)
// ═══════════════════════════════════════════════════════════════════════════════

const MIDDLEWARE_PHASES: TimelinePhase[] = [
  {
    id: 'request',
    emoji: '📥',
    name: 'Request chega',
    color: FGMUTE,
    short: 'Entrada',
    detail: 'O request HTTP chega ao Edge Runtime do Next.js antes de qualquer processamento. O middleware é executado ANTES do cache e ANTES do roteamento — ou seja, antes de qualquer coisa.',
    code: [
      [{ text: '// middleware.ts', color: '#475569' }],
      [{ text: 'export function ', color: '#a78bfa' }, { text: 'middleware', color: GRN }, { text: '(req: NextRequest) {', color: FG }],
      [{ text: '  // executa a cada request', color: '#475569' }],
      [{ text: '}', color: FG }],
    ],
  },
  {
    id: 'auth-check',
    emoji: '🔐',
    name: 'Verificação de auth',
    color: AMB,
    short: 'Auth',
    detail: 'Caso de uso mais comum: verificar o token JWT nos cookies. Se inválido, redireciona para /login. Isso acontece no Edge — zero latência, nenhum servidor de aplicação é atingido.',
    code: [
      [{ text: '  const token = req.cookies.get(', color: FG }, { text: "'token'", color: '#fbbf24' }, { text: ')', color: FG }],
      [{ text: '  if ', color: '#a78bfa' }, { text: '(!isValid(token)) {', color: FG }],
      [{ text: '    return NextResponse.redirect(', color: FG }],
      [{ text: "      new URL('/login', req.url)", color: '#fbbf24' }],
      [{ text: '    )', color: FG }],
      [{ text: '  }', color: FG }],
    ],
  },
  {
    id: 'headers',
    emoji: '📝',
    name: 'Manipulação de headers',
    color: SKY,
    short: 'Headers',
    detail: 'O middleware pode adicionar, remover ou modificar headers antes de passar o request adiante. Útil para injetar contexto (user ID, locale) sem que o componente precise parsear o token.',
    code: [
      [{ text: '  const res = NextResponse.next()', color: FG }],
      [{ text: '  res.headers.set(', color: FG }, { text: "'x-user-id'", color: '#fbbf24' }, { text: ', userId)', color: FG }],
      [{ text: '  res.headers.set(', color: FG }, { text: "'x-locale'", color: '#fbbf24' }, { text: ', locale)', color: FG }],
      [{ text: '  return res', color: FG }],
    ],
  },
  {
    id: 'rewrite',
    emoji: '🔀',
    name: 'Rewrite / Redirect',
    color: PRP,
    short: 'Rewrite',
    detail: 'Rewrites alteram a URL internamente sem redirecionar o browser. Útil para A/B testing, feature flags e i18n. Redirects mudam a URL visível no browser (301/302).',
    code: [
      [{ text: '  // A/B test: 50% vê /experiment', color: '#475569' }],
      [{ text: '  if ', color: '#a78bfa' }, { text: '(Math.random() > 0.5) {', color: FG }],
      [{ text: '    return NextResponse.rewrite(', color: FG }],
      [{ text: "      new URL('/experiment', req.url)", color: '#fbbf24' }],
      [{ text: '    )', color: FG }],
      [{ text: '  }', color: FG }],
    ],
  },
  {
    id: 'matcher',
    emoji: '🎯',
    name: 'Matcher (config)',
    color: GRN,
    short: 'Matcher',
    detail: 'O matcher define em quais rotas o middleware executa. Sem matcher, executa em TODAS as rotas (incluindo /_next/static, imagens, etc) — péssimo para performance. Sempre configure.',
    code: [
      [{ text: 'export const config = {', color: FG }],
      [{ text: '  matcher: [', color: FG }],
      [{ text: "    '/((?!_next|favicon.ico|api).*)',", color: '#fbbf24' }],
      [{ text: '  ]', color: FG }],
      [{ text: '}', color: FG }],
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Route Segments Anatomy (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const ROUTE_LAYERS: Layer[] = [
  {
    id: 'layout',
    label: 'layout.tsx',
    sublabel: 'Persiste entre navegações',
    description: 'Define a UI que envolve a página e persiste entre rotas filhas. Não re-renderiza quando o usuário navega entre filhos. Ideal para nav, sidebar, theme providers.',
    color: PRP,
    code: 'export default function Layout({ children }) {\n  return <div><Sidebar />{children}</div>\n}',
    examples: ['RootLayout', 'DashboardLayout', 'AuthLayout'],
  },
  {
    id: 'template',
    label: 'template.tsx',
    sublabel: 'Re-monta em cada navegação',
    description: 'Similar ao layout, mas cria nova instância a cada navegação — estado e effects resetam. Use quando você PRECISA que algo reinicie a cada troca de rota.',
    color: SKY,
    code: 'export default function Template({ children }) {\n  return <motion.div animate="enter">{children}</motion.div>\n}',
    examples: ['AnimatedTransition', 'AnalyticsTemplate'],
  },
  {
    id: 'loading',
    label: 'loading.tsx',
    sublabel: 'Suspense boundary automático',
    description: 'Next.js envolve automaticamente a página com <Suspense fallback={<loading.tsx />}>. Exibido enquanto o Server Component resolve seu fetch. Sem este arquivo, o usuário espera sem feedback.',
    color: AMB,
    code: 'export default function Loading() {\n  return <PageSkeleton />\n}',
    examples: ['PostsLoading', 'DashboardLoading'],
  },
  {
    id: 'error',
    label: 'error.tsx',
    sublabel: 'Error Boundary automático',
    description: '"use client" obrigatório — error boundaries precisam ser Client Components. Recebe props error e reset. reset() tenta recuperar re-renderizando o segment. Isola erros por rota.',
    color: RED,
    code: '"use client"\nexport default function Error({ error, reset }) {\n  return <div><p>{error.message}</p><button onClick={reset}>Retry</button></div>\n}',
    examples: ['PostError', 'APIError'],
  },
  {
    id: 'not-found',
    label: 'not-found.tsx',
    sublabel: 'Acionado por notFound()',
    description: 'Renderizado quando notFound() é chamado em um Server Component ou quando a rota não existe. Permite customizar o 404 por segment — o 404 de /dashboard pode ser diferente do 404 raiz.',
    color: FGMUTE,
    code: "import { notFound } from 'next/navigation'\n\n// Em qualquer Server Component:\nif (!post) notFound()",
    examples: ['PostNotFound'],
  },
  {
    id: 'page',
    label: 'page.tsx',
    sublabel: 'Conteúdo único da rota',
    description: 'O único arquivo que torna uma rota acessível publicamente. Recebe params (route segments) e searchParams (query string). Server Component por padrão — async function para fetch direto.',
    color: GRN,
    code: 'export default async function Page({ params, searchParams }) {\n  const post = await getPost(params.id)\n  return <PostDetail post={post} />\n}',
    examples: ['HomePage', 'PostPage', 'DashboardPage'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const NEXTJS_ANTIPATTERNS: AntiPattern[] = [
  {
    title: '"use client" no topo da árvore',
    wrong: [
      [{ text: '// app/page.tsx', color: '#475569' }],
      [{ text: '"use client"', color: RED }, { text: ' // ❌ página inteira vira Client', color: '#475569' }],
      [{ text: '', color: FG }],
      [{ text: 'export default async function Page() {', color: FG }],
      [{ text: '  const data = await fetch(...)', color: FG }, { text: ' // ❌ fetch em Client Component', color: '#475569' }],
      [{ text: '  return <Dashboard data={data} />', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// app/page.tsx (Server Component)', color: '#475569' }],
      [{ text: 'export default async function Page() {', color: FG }],
      [{ text: '  const data = await fetch(...)  ', color: FG }, { text: '// ✓ Server', color: GRN }],
      [{ text: '  return <Dashboard data={data} />', color: FG }, { text: '// Client Component filho', color: '#475569' }],
      [{ text: '}', color: FG }],
      [{ text: '', color: FG }],
      [{ text: '// components/Dashboard.tsx', color: '#475569' }],
      [{ text: '"use client"', color: GRN }, { text: ' // ✓ apenas onde há interatividade', color: GRN }],
    ],
    why: '"use client" deve ficar nas folhas da árvore — nos componentes que precisam de interatividade (estado, eventos, browser APIs). Colocar no topo transforma toda a subárvore em Client Components, eliminando os benefícios de Server Components.',
  },
  {
    title: 'Importar Server Component dentro de Client Component',
    wrong: [
      [{ text: '"use client"', color: RED }],
      [{ text: 'import ServerData from ', color: FG }, { text: "'./ServerData'", color: '#fbbf24' }],
      [{ text: '', color: FG }],
      [{ text: 'export function ClientShell() {', color: FG }],
      [{ text: '  return <div><ServerData /></div>', color: RED }, { text: ' // ❌ ServerData vira Client', color: '#475569' }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// app/page.tsx (Server Component)', color: '#475569' }],
      [{ text: 'export default function Page() {', color: FG }],
      [{ text: '  return (', color: FG }],
      [{ text: '    <ClientShell>', color: FG }],
      [{ text: '      <ServerData />', color: GRN }, { text: ' // ✓ passado como children', color: GRN }],
      [{ text: '    </ClientShell>', color: FG }],
      [{ text: '  )', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'Importar um Server Component dentro de um Client Component transforma o Server Component em Client (herança de contexto). A solução é passar o Server Component via children prop a partir de um Server Component pai — assim ele permanece server-side.',
  },
  {
    title: 'Chamar Server Action em useEffect',
    wrong: [
      [{ text: '"use client"', color: FG }],
      [{ text: 'import { fetchPosts } from ', color: FG }, { text: "'./actions'", color: '#fbbf24' }],
      [{ text: '', color: FG }],
      [{ text: 'useEffect(() => {', color: RED }],
      [{ text: "  fetchPosts()  ", color: RED }, { text: '// ❌ Server Action em effect', color: '#475569' }],
      [{ text: '}, [])', color: RED }],
    ],
    right: [
      [{ text: '// ✓ Use React Query para fetches em Client Components', color: GRN }],
      [{ text: 'const { data } = useQuery({', color: FG }],
      [{ text: "  queryKey: ['posts'],", color: FG }],
      [{ text: "  queryFn: () => fetch('/api/posts').then(r => r.json()),", color: FG }],
      [{ text: '})', color: FG }],
      [{ text: '', color: FG }],
      [{ text: '// ✓ Server Actions são para MUTATIONS (POST/PUT/DELETE)', color: GRN }],
      [{ text: '<form action={createPost}>', color: FG }],
    ],
    why: 'Server Actions existem para mutações — criar, atualizar, deletar. Chamá-las em useEffect para leitura de dados é anti-padrão: mistura paradigmas, não aproveita cache e perde os benefícios de Server Components. Para leitura em Client Components, use React Query ou fetch direto.',
  },
  {
    title: 'Middleware sem matcher',
    wrong: [
      [{ text: '// middleware.ts', color: '#475569' }],
      [{ text: 'export function middleware(req) {', color: FG }],
      [{ text: '  const token = req.cookies.get(', color: FG }, { text: "'token'", color: '#fbbf24' }, { text: ')', color: FG }],
      [{ text: '  // ...', color: '#475569' }],
      [{ text: '}', color: FG }],
      [{ text: '', color: FG }],
      [{ text: '// ❌ Sem config.matcher — executa em TUDO', color: RED }],
      [{ text: '// /_next/static, /favicon.ico, /api, imagens...', color: RED }],
    ],
    right: [
      [{ text: 'export function middleware(req) { /* ... */ }', color: FG }],
      [{ text: '', color: FG }],
      [{ text: 'export const config = {', color: FG }],
      [{ text: '  matcher: [', color: GRN }],
      [{ text: "    '/((?!_next|favicon.ico|api/public).*)',", color: GRN }],
      [{ text: '  ]', color: GRN }],
      [{ text: '}', color: GRN }],
      [{ text: "// ✓ Só executa em rotas relevantes", color: GRN }],
    ],
    why: 'Sem matcher, o middleware executa em CADA request — incluindo arquivos estáticos (_next/static), favicon, imagens e API routes públicas. Isso aumenta a latência desnecessariamente e pode quebrar funcionalidades que não precisam de middleware.',
  },
  {
    title: 'Passar dados não serializáveis do Server para Client',
    wrong: [
      [{ text: '// ❌ Passar classes, funções, Date objects', color: RED }],
      [{ text: 'const user = await db.user.findFirst()', color: FG }],
      [{ text: '// user é instância da classe User com métodos', color: '#475569' }],
      [{ text: '<ClientComponent user={user} />', color: RED }],
      [{ text: '// Error: Only plain objects can be passed', color: RED }],
    ],
    right: [
      [{ text: '// ✓ Serialize antes de passar', color: GRN }],
      [{ text: 'const userRaw = await db.user.findFirst()', color: FG }],
      [{ text: 'const user = {', color: FG }],
      [{ text: '  id: userRaw.id,', color: GRN }],
      [{ text: '  name: userRaw.name,', color: GRN }],
      [{ text: '  email: userRaw.email,', color: GRN }],
      [{ text: '}  // objeto plain — serializável', color: GRN }],
      [{ text: '<ClientComponent user={user} />', color: FG }],
    ],
    why: 'Entre Server e Client Components, apenas valores serializáveis podem trafegar: strings, números, arrays, objetos plain, boolean, null. Instâncias de classes (com métodos), funções, Dates, Maps, Sets ou símbolos causam erro de serialização. Sempre extraia apenas os campos necessários.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Next.js Evolution (VersionTimeline)
// ═══════════════════════════════════════════════════════════════════════════════

const NEXTJS_VERSIONS: VersionMilestone[] = [
  {
    id: 'v9',
    version: '9.x',
    year: '2019',
    title: 'API Routes + Dynamic Routing',
    description: 'Next.js ganha rotas dinâmicas ([param]) e API routes — backend e frontend no mesmo projeto.',
    highlights: [
      'Rotas dinâmicas com [slug].js',
      'API routes em pages/api/ — backend sem servidor separado',
      'Automatic static optimization',
      'TypeScript built-in',
    ],
    color: FGMUTE,
  },
  {
    id: 'v10',
    version: '10.x',
    year: '2020',
    title: 'ISR + next/image + i18n',
    description: 'Incremental Static Regeneration muda como pensamos sobre caching. Otimização automática de imagens.',
    highlights: [
      'ISR: revalidate por rota — SSG + frescor de dados',
      'next/image: otimização automática, lazy load, formatos modernos',
      'Internacionalização (i18n) built-in',
      'next/script para carregamento de scripts terceiros',
    ],
    color: SKY,
  },
  {
    id: 'v12',
    version: '12.x',
    year: '2021–2022',
    title: 'Middleware + Edge Runtime',
    description: 'Middleware executa no Edge antes do request. SWC compiler substitui Babel — 17x mais rápido.',
    highlights: [
      'Middleware: intercepta requests no Edge',
      'SWC compiler: 17x faster builds vs Babel',
      'React 18 concurrent features',
      'Edge Runtime para latência mínima',
    ],
    color: AMB,
  },
  {
    id: 'v13',
    version: '13.x',
    year: '2022–2023',
    title: 'App Router + React Server Components',
    description: 'Mudança de paradigma: App Router com RSC, layouts aninhados, Suspense nativo e Server Actions.',
    highlights: [
      'App Router: nova convenção de arquivos (layout.tsx, loading.tsx)',
      'React Server Components por padrão',
      'Layouts aninhados persistentes',
      'Streaming com Suspense automático',
      'Turbopack em alpha (bundler em Rust)',
    ],
    breakingChanges: [
      'App Router e Pages Router coexistem mas têm comportamentos diferentes',
      'getServerSideProps não existe no App Router',
      'Caching behaviors completamente redesenhados',
    ],
    color: C,
    isCurrent: false,
  },
  {
    id: 'v14',
    version: '14.x',
    year: '2023–2024',
    title: 'Server Actions estáveis + Turbopack beta',
    description: 'Server Actions saem de alpha para estável. Turbopack entra em beta com 76% de melhoria em builds locais.',
    highlights: [
      'Server Actions estáveis (antes era experimental)',
      'Turbopack beta: 76% faster local server startup',
      'Partial Prerendering (PPR) em experimental',
      'next/font estável com self-hosting de fontes',
      'Metadata API estável',
    ],
    color: C,
    isLTS: false,
    isCurrent: false,
  },
  {
    id: 'v15',
    version: '15.x',
    year: '2024',
    title: 'React 19 + Async Request APIs + PPR',
    description: 'React 19 support, Partial Prerendering em produção, e mudança controversial no caching padrão.',
    highlights: [
      'React 19 support: use(), useOptimistic, useActionState',
      'Async Request APIs: cookies(), headers(), params — agora async',
      'Partial Prerendering (PPR) estável em opt-in',
      'Turbopack estável para next dev',
      'Caching opt-in por padrão (mudança do 14 → 15)',
    ],
    breakingChanges: [
      'fetch não é mais cached por padrão (era force-cache, agora é no-store)',
      'cookies(), headers(), params são agora async — requerem await',
      'Migração de "use cache" diretiva experimental',
    ],
    color: GRN,
    isCurrent: true,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — Caching Layers (visual custom interativo)
// ═══════════════════════════════════════════════════════════════════════════════

type CacheLayer = {
  id: string
  name: string
  where: string
  color: string
  scope: string
  invalidation: string
  opt: string
  detail: string
}

const CACHE_LAYERS: CacheLayer[] = [
  {
    id: 'request-memo',
    name: 'Request Memoization',
    where: 'Memória do servidor (por request)',
    color: PRP,
    scope: 'Uma única request HTTP',
    invalidation: 'Automático — ao fim da request',
    opt: 'React.cache() para funções',
    detail: 'O React deduplica fetches idênticos durante uma request. Se dois Server Components chamarem fetch() com a mesma URL na mesma request, o segundo retorna o resultado do primeiro — sem segunda chamada real.',
  },
  {
    id: 'data-cache',
    name: 'Data Cache',
    where: 'Servidor Next.js (persistente)',
    color: AMB,
    scope: 'Todas as requests — entre deploys',
    invalidation: 'revalidatePath(), revalidateTag(), revalidate: N',
    opt: "fetch(url, { next: { revalidate: 60 } })",
    detail: 'Cache persistente do servidor Next.js. Sobrevive entre requests e entre reinícios do servidor. Compartilhado entre todos os usuários. É aqui que ISR funciona — Next.js regenera em background enquanto serve o cache.',
  },
  {
    id: 'full-route',
    name: 'Full Route Cache',
    where: 'Servidor Next.js (filesystem)',
    color: SKY,
    scope: 'Rotas estáticas — entre deploys',
    invalidation: 'Novo deploy ou revalidatePath()',
    opt: 'export const revalidate = 0 (desativa)',
    detail: 'Next.js armazena o resultado de renderização de rotas estáticas no filesystem. Rotas dinâmicas (params, cookies, headers) não são armazenadas. É o que SSG e ISR usam internamente.',
  },
  {
    id: 'router-cache',
    name: 'Router Cache',
    where: 'Memória do browser (cliente)',
    color: GRN,
    scope: 'Sessão do usuário',
    invalidation: 'router.refresh(), revalidatePath() via Server Action',
    opt: 'staleTimes config no next.config.js',
    detail: 'Cache no browser para navegação instantânea. Quando o usuário navega para uma rota já visitada, Next.js usa o cache do router — sem request ao servidor. Inclui prefetching automático de rotas visíveis no viewport.',
  },
]

function CachingLayersVisual() {
  const [active, setActive] = useState<string | null>(null)
  const sel = CACHE_LAYERS.find(l => l.id === active)

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: FG, marginBottom: 4 }}>As 4 camadas de cache do Next.js</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Clique em uma camada para ver como funciona e como invalidar</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {CACHE_LAYERS.map((layer, idx) => {
          const isActive = active === layer.id
          return (
            <div
              key={layer.id}
              onClick={() => setActive(isActive ? null : layer.id)}
              style={{
                padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                background: isActive ? `${layer.color}18` : `${CARD}`,
                border: `1.5px solid ${isActive ? layer.color : LINE}`,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: `${layer.color}25`, border: `1px solid ${layer.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, color: layer.color, flexShrink: 0,
                }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? FG : FG }}>{layer.name}</div>
                  <div style={{ fontSize: 10, color: FGMUTE, marginTop: 2 }}>{layer.where}</div>
                </div>
                <div style={{ fontSize: 10, color: layer.color, fontWeight: 600, textAlign: 'right' }}>
                  {layer.scope}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {sel && (
        <div style={{
          padding: '16px', borderRadius: 10,
          background: `${sel.color}10`, border: `1px solid ${sel.color}40`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: sel.color, marginBottom: 10 }}>{sel.name}</div>
          <div style={{ fontSize: 12, color: FG, lineHeight: 1.7, marginBottom: 12 }}>{sel.detail}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: `${BG}`, borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 9, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Invalidação</div>
              <div style={{ fontSize: 11, color: AMB, fontFamily: "'JetBrains Mono', monospace" }}>{sel.invalidation}</div>
            </div>
            <div style={{ background: `${BG}`, borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 9, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Controle</div>
              <div style={{ fontSize: 11, color: GRN, fontFamily: "'JetBrains Mono', monospace" }}>{sel.opt}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function NextJsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'app-vs-pages',
      title: 'App vs Pages Router',
      subtitle: 'Comparação completa de recursos — quando usar cada um',
      accent: C,
      component: (
        <ComparisonTable
          options={ROUTER_OPTIONS}
          criteria={ROUTER_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="App Router vs Pages Router"
          description="Comparação de recursos entre os dois roteadores do Next.js"
          highlightBest
        />
      ),
    },
    {
      id: 'rendering-strategies',
      title: 'Estratégias de Rendering',
      subtitle: 'SSG vs ISR vs SSR vs CSR — trade-offs por critério',
      accent: C,
      component: (
        <ComparisonTable
          options={RENDER_OPTIONS}
          criteria={RENDER_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="SSG · ISR · SSR · CSR — trade-offs"
          description="Escolha a estratégia certa com base no tipo de dado e requisito de SEO"
          highlightBest
        />
      ),
    },
    {
      id: 'sc-vs-cc',
      title: 'Server vs Client Components',
      subtitle: 'O que cada tipo pode e não pode fazer — boundary completo',
      accent: C,
      component: <SCCCVisual />,
    },
    {
      id: 'data-fetching',
      title: 'Data Fetching — passo a passo',
      subtitle: 'Server Component fetch, React Query e Server Actions comparados',
      accent: C,
      component: (
        <CodeStepper
          scenarios={FETCH_SCENARIOS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Como dados fluem no Next.js"
          description="Compare Server Component fetch vs Client Component + Server Actions"
        />
      ),
    },
    {
      id: 'middleware',
      title: 'Middleware Pipeline',
      subtitle: 'Auth, headers, rewrites e matcher — fases em ordem',
      accent: C,
      component: (
        <HookTimeline
          phases={MIDDLEWARE_PHASES}
          accentColor={C}
          bgColor={BG}
          label="Middleware Pipeline"
          heading="Next.js Middleware — fases de execução"
          description="O middleware executa no Edge antes de qualquer cache ou roteamento"
        />
      ),
    },
    {
      id: 'route-segments',
      title: 'Anatomy de Route Segments',
      subtitle: 'layout, template, loading, error, not-found, page — cada arquivo',
      accent: C,
      component: (
        <LayerStack
          layers={ROUTE_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Route Segment Files"
          description="Cada arquivo especial do App Router tem uma função única — clique para ver detalhes"
          direction="top-down"
        />
      ),
    },
    {
      id: 'caching',
      title: 'As 4 Camadas de Cache',
      subtitle: 'Request memoization, Data Cache, Full Route Cache, Router Cache',
      accent: C,
      component: <CachingLayersVisual />,
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'Os 5 erros mais comuns com Next.js — e como corrigir',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={NEXTJS_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
          label="Next.js Anti-patterns"
          heading="O que não fazer — e por quê"
          description="Padrões que parecem corretos mas causam problemas de bundle, cache ou SSR"
        />
      ),
    },
    {
      id: 'evolution',
      title: 'Evolução do Next.js',
      subtitle: 'v9 até v15 — o que mudou em cada versão',
      accent: C,
      component: (
        <VersionTimeline
          milestones={NEXTJS_VERSIONS}
          techName="Next.js"
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Next.js — Linha do Tempo"
          description="Da introdução das API Routes ao App Router e React 19"
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
