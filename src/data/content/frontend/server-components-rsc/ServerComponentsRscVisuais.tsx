'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'

// ── Paleta RSC ────────────────────────────────────────────────────────────────
const C      = '#61dafb'   // React blue
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const AMB    = '#fb923c'
const PRP    = '#a78bfa'

void LINE; void FG; void FGMUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Server vs Client vs Server Action (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const RSC_OPTIONS: ComparisonOption[] = [
  { id: 'server', label: 'Server Component', sublabel: 'padrão no App Router', color: GRN },
  { id: 'client', label: 'Client Component', sublabel: "'use client'", color: C },
  { id: 'action', label: 'Server Action', sublabel: "'use server'", color: AMB },
]

const RSC_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'runs-where',
    label: 'Roda onde',
    category: 'Paradigma',
    description: 'Em qual ambiente o código executa',
    values: {
      server: { rating: 'excellent', note: 'Apenas no servidor — nunca chega ao browser' },
      client: { rating: 'good', note: 'Servidor (SSR/hidratação) + browser' },
      action: { rating: 'excellent', note: 'Apenas no servidor — chamado via RPC pelo cliente' },
    },
  },
  {
    id: 'js-bundle',
    label: 'JS ao cliente',
    category: 'Paradigma',
    description: 'Quanto JavaScript é enviado ao browser',
    values: {
      server: { rating: 'excellent', note: 'Zero — sem código JS no bundle do cliente' },
      client: { rating: 'fair', note: 'Todo o código do componente vai no bundle' },
      action: { rating: 'excellent', note: 'Zero — função fica no servidor' },
    },
  },
  {
    id: 'data-access',
    label: 'Acesso a dados',
    category: 'Capacidades',
    description: 'Que tipo de recursos pode acessar diretamente',
    values: {
      server: { rating: 'excellent', note: 'Banco, FS, env vars, APIs internas — sem round trip' },
      client: { rating: 'poor', note: 'Apenas via fetch/API — nunca banco ou FS direto' },
      action: { rating: 'excellent', note: 'Banco, FS, env vars — mesmos poderes do Server Component' },
    },
  },
  {
    id: 'interactivity',
    label: 'Interatividade',
    category: 'Capacidades',
    description: 'Suporte a hooks de estado e eventos de browser',
    values: {
      server: { rating: 'poor', note: 'Sem useState, useEffect, onClick — apenas dados' },
      client: { rating: 'excellent', note: 'useState, useEffect, onClick, useRef — tudo' },
      action: { rating: 'na', note: 'Não é componente — é função chamada por formulários/handlers' },
    },
  },
  {
    id: 'async',
    label: 'Async nativo',
    category: 'Capacidades',
    description: 'Suporte a await diretamente no corpo do componente/função',
    values: {
      server: { rating: 'excellent', note: 'async function nativa — await direto no componente' },
      client: { rating: 'poor', note: 'Sem async no render — use useEffect + estado ou React Query' },
      action: { rating: 'excellent', note: 'async function — await banco, validação, revalidatePath' },
    },
  },
  {
    id: 'use-case',
    label: 'Quando usar',
    category: 'Decisão',
    description: 'O caso de uso primário de cada tipo',
    values: {
      server: { rating: 'excellent', note: 'Layouts, listas de dados, páginas sem interação local' },
      client: { rating: 'good', note: 'Formulários, menus dropdown, animações, estado local' },
      action: { rating: 'good', note: 'Mutations: criar, editar, deletar — sem endpoint público' },
    },
  },
  {
    id: 'caching',
    label: 'Caching',
    category: 'Performance',
    description: 'Estratégias de cache disponíveis',
    values: {
      server: { rating: 'excellent', note: 'fetch + next.revalidate, React cache(), unstable_cache' },
      client: { rating: 'fair', note: 'Depende do que usa — React Query, SWR, localStorage' },
      action: { rating: 'good', note: 'Invalida cache: revalidatePath() e revalidateTag()' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — RSC Rendering Pipeline (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const RSC_PIPELINE_LAYERS: Layer[] = [
  {
    id: 'browser-display',
    label: 'Browser — UI final',
    sublabel: 'O que o usuário vê',
    description: 'O DOM final no browser — resultado da hidratação. Client Components são interativos. Server Components aparecem como HTML estático sem JS associado. Navegações subsequentes usam RSC payload (sem full page reload).',
    color: C,
    icon: '🖥',
    examples: ['DOM hidratado', 'Client Components interativos', 'Server Components como HTML estático'],
    code: "// Client Component hidratado no browser\n'use client'\nfunction Counter() {\n  const [n, setN] = useState(0)\n  return <button onClick={() => setN(n+1)}>{n}</button>\n}",
  },
  {
    id: 'hydration',
    label: 'Hidratação',
    sublabel: 'React no browser',
    description: 'React no browser lê o HTML + RSC payload e "hidrata" os Client Components — anexa event listeners sem re-renderizar o DOM. Server Components não são hidratados — seu HTML já é o resultado final.',
    color: AMB,
    icon: '💧',
    examples: ['Apenas Client Components são hidratados', 'Event listeners anexados ao DOM existente', 'RSC payload guia o processo'],
    code: "// Hydration: React reconhece o HTML existente e anexa handlers\n// Nenhum re-render ocorre se o HTML do servidor e do cliente coincidirem",
  },
  {
    id: 'rsc-payload',
    label: 'RSC Payload',
    sublabel: 'Formato especial do servidor',
    description: 'O servidor não envia apenas HTML — produz também o RSC payload: uma representação compacta da árvore de componentes que o React usa para hidratação e navegações client-side. Não contém código de Server Components — apenas o resultado renderizado.',
    color: PRP,
    icon: '📦',
    examples: ['Árvore de componentes serializada', 'Client Components como referências (não código)', 'Placeholders de Suspense para streaming'],
    code: "// RSC payload não é HTML nem JS — é formato interno do React\n// Browser o usa para hidratar sem re-fetch dos dados de servidor",
  },
  {
    id: 'server-render',
    label: 'Renderização no servidor',
    sublabel: 'Server Components executam aqui',
    description: 'Server Components são renderizados no servidor — acesso a banco, FS, env. O resultado é HTML + RSC payload. Com streaming, o servidor envia o resultado em chunks conforme fica pronto (um Suspense boundary por vez).',
    color: GRN,
    icon: '⚙',
    examples: ['async functions com await ao banco', 'Zero JS gerado para Server Components', 'Streaming: chunks por Suspense boundary'],
    code: "// Server Component — executa no servidor, zero JS ao cliente\nasync function UserList() {\n  const users = await db.user.findMany()\n  return <ul>{users.map(u => <li>{u.name}</li>)}</ul>\n}",
  },
  {
    id: 'request',
    label: 'Requisição HTTP',
    sublabel: 'Browser → Next.js',
    description: 'O browser faz GET para a URL. O Next.js determina o layout e a página a renderizar. Roteamento baseado em arquivos no diretório app/. Parâmetros de rota, search params e cookies/headers ficam disponíveis nos Server Components.',
    color: FGMUTE,
    icon: '🌐',
    examples: ['GET /dashboard', 'Next.js route resolution', 'cookies(), headers(), params disponíveis no Server'],
    code: "// Acesso a parâmetros e cookies em Server Components\nexport async function Page({ params, searchParams }) {\n  const session = await getServerSession()\n  const data = await db.query({ id: params.id })\n  return <Component data={data} />\n}",
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Anti-patterns RSC (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const RSC_ANTIPATTERNS: AntiPattern[] = [
  {
    title: "'use client' no layout raiz — infecção total",
    wrong: [
      [{ text: "// app/layout.tsx", color: '#475569' }],
      [{ text: "'use client'", color: RED }],
      [{ text: "export default function RootLayout({ children }) {", color: '#e2e8f0' }],
      [{ text: "  const [theme, setTheme] = useState('dark')", color: RED }],
      [{ text: "  return <html>{children}</html>", color: '#e2e8f0' }],
      [{ text: "}", color: '#e2e8f0' }],
    ],
    right: [
      [{ text: "// app/layout.tsx — Server Component (sem 'use client')", color: '#475569' }],
      [{ text: "export default function RootLayout({ children }) {", color: '#e2e8f0' }],
      [{ text: "  return <html><ThemeProvider>{children}</ThemeProvider></html>", color: GRN }],
      [{ text: "}", color: '#e2e8f0' }],
      [{ text: "", color: '#e2e8f0' }],
      [{ text: "// ThemeProvider.tsx — 'use client' APENAS aqui", color: '#475569' }],
      [{ text: "'use client'", color: GRN }],
      [{ text: "export function ThemeProvider({ children }) { /* useState */ }", color: GRN }],
    ],
    why: "'use client' no layout raiz transforma TODA a aplicação em Client Components — perdendo os benefícios de RSC. Isole o estado em um Provider específico e mantenha o layout como Server Component.",
  },
  {
    title: "Secrets passados como props para Client Component",
    wrong: [
      [{ text: "// Server Component — parece seguro, mas...", color: '#475569' }],
      [{ text: "async function Page() {", color: '#e2e8f0' }],
      [{ text: "  const apiKey = process.env.SECRET_API_KEY", color: '#e2e8f0' }],
      [{ text: "  return <ClientComponent apiKey={apiKey} />", color: RED }],
      [{ text: "  // ❌ apiKey aparece no RSC payload enviado ao browser!", color: RED }],
      [{ text: "}", color: '#e2e8f0' }],
    ],
    right: [
      [{ text: "// Server Component — usa o secret internamente", color: '#475569' }],
      [{ text: "async function Page() {", color: '#e2e8f0' }],
      [{ text: "  // Usa o secret NO servidor — nunca passa ao cliente", color: '#475569' }],
      [{ text: "  const data = await fetchWithSecret(process.env.SECRET_API_KEY)", color: GRN }],
      [{ text: "  return <ClientComponent data={data} />", color: GRN }],
      [{ text: "  // ✅ Apenas 'data' (resultado) vai ao cliente", color: GRN }],
      [{ text: "}", color: '#e2e8f0' }],
    ],
    why: "Props passadas de Server para Client Components aparecem no RSC payload enviado ao browser. Use secrets apenas internamente no Server Component — passe apenas os dados resultantes.",
  },
  {
    title: "Client Component importando Server Component",
    wrong: [
      [{ text: "// ❌ Não funciona — Server Component em Client Component", color: RED }],
      [{ text: "'use client'", color: '#e2e8f0' }],
      [{ text: "import { ServerDataTable } from './ServerDataTable'", color: RED }],
      [{ text: "", color: '#e2e8f0' }],
      [{ text: "export function Shell() {", color: '#e2e8f0' }],
      [{ text: "  return <ServerDataTable />  // Runtime error!", color: RED }],
      [{ text: "}", color: '#e2e8f0' }],
    ],
    right: [
      [{ text: "// ✅ Server passa Client como children", color: GRN }],
      [{ text: "// Shell.tsx — Client Component", color: '#475569' }],
      [{ text: "'use client'", color: '#e2e8f0' }],
      [{ text: "export function Shell({ children }: { children: React.ReactNode }) {", color: GRN }],
      [{ text: "  return <div>{children}</div>", color: GRN }],
      [{ text: "}", color: '#e2e8f0' }],
      [{ text: "", color: '#e2e8f0' }],
      [{ text: "// page.tsx — Server Component monta a composição", color: '#475569' }],
      [{ text: "export default function Page() {", color: '#e2e8f0' }],
      [{ text: "  return <Shell><ServerDataTable /></Shell>", color: GRN }],
      [{ text: "}", color: '#e2e8f0' }],
    ],
    why: "Client Components não podem importar Server Components — mas podem recebê-los como children. O React resolve o Server Component antes de passar o resultado ao Client.",
  },
  {
    title: "Server Action sem validação nem auth",
    wrong: [
      [{ text: "'use server'", color: '#e2e8f0' }],
      [{ text: "export async function deletePost(id: string) {", color: '#e2e8f0' }],
      [{ text: "  // ❌ Sem autenticação — qualquer pessoa pode deletar", color: RED }],
      [{ text: "  // ❌ Sem autorização — pode deletar posts de outros", color: RED }],
      [{ text: "  await db.post.delete({ where: { id } })", color: RED }],
      [{ text: "}", color: '#e2e8f0' }],
    ],
    right: [
      [{ text: "'use server'", color: '#e2e8f0' }],
      [{ text: "export async function deletePost(id: string) {", color: '#e2e8f0' }],
      [{ text: "  const session = await getServerSession()", color: GRN }],
      [{ text: "  if (!session?.user) throw new Error('Não autenticado')", color: GRN }],
      [{ text: "  const post = await db.post.findUnique({ where: { id } })", color: GRN }],
      [{ text: "  if (post?.authorId !== session.user.id) {", color: GRN }],
      [{ text: "    throw new Error('Sem permissão')", color: GRN }],
      [{ text: "  }", color: GRN }],
      [{ text: "  await db.post.delete({ where: { id } })", color: GRN }],
      [{ text: "}", color: '#e2e8f0' }],
    ],
    why: "Server Actions são funções de servidor acessíveis via RPC. Sem auth, qualquer request pode disparar a action. Valide autenticação E autorização — verificar se o usuário pode operar sobre AQUELE recurso específico.",
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Streaming com Suspense (SequenceDiagram)
// ═══════════════════════════════════════════════════════════════════════════════

const SEQ_ACTORS: SeqActor[] = [
  { id: 'browser', label: 'Browser', color: C, icon: '🖥' },
  { id: 'nextjs', label: 'Next.js Server', color: GRN, icon: '⚙' },
  { id: 'db', label: 'Database', color: AMB, icon: '🗄' },
]

const SEQ_MESSAGES: SeqMessage[] = [
  {
    from: 'browser', to: 'nextjs',
    label: 'GET /dashboard',
    note: 'Primeira navegação ou refresh',
    type: 'sync',
  },
  {
    from: 'nextjs', to: 'browser',
    label: 'Chunk 1: HTML shell + skeletons',
    note: 'Shell estático (header, nav) + Suspense fallbacks enviados imediatamente',
    type: 'return',
  },
  {
    from: 'nextjs', to: 'db',
    label: 'Query rápida (posts)',
    note: 'Componente leve — query simples',
    type: 'async',
  },
  {
    from: 'db', to: 'nextjs',
    label: 'Posts result (~200ms)',
    type: 'return',
  },
  {
    from: 'nextjs', to: 'browser',
    label: 'Chunk 2: HTML dos posts',
    note: 'Substitui skeleton de posts via script tag inline — sem fetch no browser',
    type: 'return',
  },
  {
    from: 'nextjs', to: 'db',
    label: 'Query pesada (analytics)',
    note: 'Componente lento — relatório complexo',
    type: 'async',
  },
  {
    from: 'db', to: 'nextjs',
    label: 'Analytics result (~2000ms)',
    type: 'return',
  },
  {
    from: 'nextjs', to: 'browser',
    label: 'Chunk 3: HTML analytics',
    note: 'Substitui skeleton de analytics — mesmo HTTP connection (chunked transfer)',
    type: 'return',
  },
  {
    from: 'nextjs', to: 'browser',
    label: 'RSC payload completo',
    note: 'React usa para hidratação e navegações client-side subsequentes',
    type: 'return',
  },
]

const SEQ_GROUPS: SeqGroup[] = [
  { label: 'Imediato (~0-50ms)', kind: 'alt', fromMsg: 0, toMsg: 1, color: 'rgba(97,218,251,.08)' },
  { label: 'Primeiro stream (~200ms)', kind: 'alt', fromMsg: 2, toMsg: 4, color: 'rgba(74,222,128,.06)' },
  { label: 'Segundo stream (~2000ms)', kind: 'alt', fromMsg: 5, toMsg: 8, color: 'rgba(251,146,60,.06)' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function ServerComponentsRscVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'rsc-comparison',
      title: 'Server vs Client vs Action',
      subtitle: 'Comparação completa: onde roda, o que pode fazer, quando usar',
      accent: C,
      component: (
        <ComparisonTable
          options={RSC_OPTIONS}
          criteria={RSC_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'rendering-pipeline',
      title: 'Pipeline de Rendering',
      subtitle: 'Da requisição HTTP ao DOM hidratado — onde cada coisa acontece',
      accent: C,
      component: (
        <LayerStack
          layers={RSC_PIPELINE_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          direction="bottom-up"
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns RSC',
      subtitle: 'Os 4 erros mais comuns — errado vs correto com explicação',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={RSC_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'streaming-sequence',
      title: 'Streaming com Suspense',
      subtitle: 'Fluxo temporal: como o HTML chega em chunks ao browser',
      accent: C,
      component: (
        <SequenceDiagram
          actors={SEQ_ACTORS}
          messages={SEQ_MESSAGES}
          groups={SEQ_GROUPS}
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
