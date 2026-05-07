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

// ── Paleta RSC ────────────────────────────────────────────────────────────────
const C    = '#61dafb'   // React blue — NUNCA omitir
const GRN  = '#4ade80'
const RED  = '#ef4444'
const AMB  = '#fb923c'

// ── Cards dos PDFs ────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre RSC em entrevista Next.js sênior',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: Server vs Client vs Server Action, RSC payload e hidratação, streaming com Suspense, data fetching paralelo, children pattern, revalidatePath vs revalidateTag, security de Server Actions, Partial Prerendering — tudo que entrevistadores sênior Next.js perguntam.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Server, Client, Action, Streaming e caching numa referência densa',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: o que Server/Client/Action podem e não podem fazer, quando usar cada um, padrões de composição, API de caching (revalidatePath, revalidateTag, fetch + next.revalidate, React cache()), hooks relevantes no React 19.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'As 5 âncoras para nunca confundir Server e Client Components',
    type: 'mnemonics',
    pages: 2,
    description: 'SCA (Secrets, Cache, Async) para Server; EIRS (Events, Interactive state, Refs, Side effects) para Client; regra da folha; children trick; RPC vs HTTP para Server Actions. Âncoras cognitivas para dominar o modelo mental RSC.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns RSC',
    subtitle: 'Os 4 erros mais comuns com React Server Components',
    type: 'antipatterns',
    pages: 3,
    description: "'use client' no layout raiz (infecção total), secrets como props para Client (vazamento de dados), Client importando Server (runtime error), Server Action sem validação nem auth (vulnerabilidade). Diff errado × correto com explicação.",
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
]

// ── Q&A Data ──────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    q: 'Qual a diferença entre Server Component e Client Component?',
    a: 'Server Component: roda apenas no servidor, zero JS ao browser, acessa banco/FS/env, sem state/events. Client Component (use client): roda no browser + servidor (SSR), usa hooks, eventos, browser APIs. Padrão no App Router é Server.',
    tip: 'A pegadinha: use client não impede SSR — Client Components ainda rodam no servidor na hidratação.',
    level: 'Pleno',
  },
  {
    q: "Por que 'use client' infecta a árvore de componentes?",
    a: "Todos os imports de um Client Component viram Client Components — mesmo sem 'use client'. O bundle do cliente inclui tudo. Fix: empurre 'use client' para as folhas (componentes interativos específicos).",
    tip: 'A solução children prop para passar Server dentro de Client é o padrão avançado de sênior.',
    level: 'Senior',
  },
  {
    q: 'Como fazer data fetching em Server Components?',
    a: 'async function com await direto. Promise.all para fetches em paralelo (evita waterfall). Next.js deduplica fetches idênticos na mesma request (request memoization). Zero round trip cliente-servidor.',
    tip: 'Mencionar request memoization (deduplicação automática) mostra leitura profunda da documentação.',
    level: 'Pleno',
  },
  {
    q: 'Quando usar Server Actions vs API Routes?',
    a: 'Server Actions: mutations internas (criar, editar, deletar), sem endpoint público, auth via cookie automático. API Routes: endpoints HTTP públicos para mobile, terceiros, webhooks (Stripe, GitHub).',
    tip: 'Server Actions não funcionam para webhooks externos — sem contexto Next.js. É um edge case importante.',
    level: 'Senior',
  },
  {
    q: 'O que é streaming com React Server Components?',
    a: 'HTML enviado incrementalmente em chunks. Skeleton no HTML inicial (Suspense fallback). Quando dados chegam, chunk do componente real substitui o skeleton — sem fetch adicional no browser. TTFB melhora, conteúdo progressivo.',
    tip: 'A distinção que HTML é streamado (não fetch no cliente) é o que a maioria não sabe explicar.',
    level: 'Senior',
  },
  {
    q: 'Dados sensíveis (API keys) estão seguros em Server Components?',
    a: 'Sim, se não passados como props para Client Components. Props passadas de Server para Client aparecem no RSC payload no browser. Use o pacote server-only para guardar módulos com secrets.',
    tip: 'Mencionar o pacote server-only como guard de importação mostra aplicação prática de segurança.',
    level: 'Pleno',
  },
  {
    q: 'O que é o RSC payload?',
    a: 'Formato binário especial produzido pelo servidor — não HTML puro. Descreve a árvore de componentes. O cliente usa para: montar DOM inicial sem re-executar lógica de servidor, hidratar Client Components, navegar sem full page reload.',
    tip: 'RSC payload não contém código dos Server Components — apenas o resultado renderizado.',
    level: 'Senior',
  },
  {
    q: 'Como funciona o padrão children para Server dentro de Client?',
    a: "Client não pode importar Server. Mas pode receber Server como children. O React resolve o Server Component antes de passar ao Client — o Client recebe o resultado já renderizado. Composição: <Shell><DataTable /></Shell> onde Shell é Client.",
    tip: 'Explicar POR QUE funciona (React resolve Server antes) mostra entendimento dos internos.',
    level: 'Senior',
  },
  {
    q: 'O que são revalidatePath e revalidateTag?',
    a: 'Invalidam cache de dados após mutation. revalidatePath("/posts"): invalida todos os dados da rota. revalidateTag("posts"): invalida fetches com next.tags = ["posts"] — mais granular. Usar após Server Actions de create/update/delete.',
    tip: 'Tag é mais granular (múltiplas rotas); path é mais simples (rota inteira). Saber a diferença é essencial.',
    level: 'Senior',
  },
  {
    q: 'Como Server Actions lidam com validação e erros?',
    a: 'Valide com Zod server-side. Retorne objetos serializáveis para erros — não lance exceções (chegam como erros genéricos). Use useActionState (React 19) ou useFormState (React 18) para capturar o retorno.',
    tip: 'Mostrar que Server Actions exigem validação server-side (não confiar no cliente) é ponto de segurança importante.',
    level: 'Senior',
  },
  {
    q: 'Qual a diferença entre SSR, SSG e RSC?',
    a: 'SSR: HTML gerado a cada request, componentes hidratados. SSG: HTML em build time, CDN. RSC: paradigma onde componentes vivem no servidor permanentemente — sem bundle JS ao cliente. Pode combinar com SSR ou SSG.',
    tip: 'SSR = quando o HTML é gerado. RSC = onde o componente roda permanentemente. Server Component nunca chega ao bundle.',
    level: 'Senior',
  },
  {
    q: 'O que acontece ao usar cookies() ou headers() em Server Component?',
    a: 'next/headers. O componente se torna dinâmico — Next.js desativa cache da rota, pois o resultado depende do request. Implica tradeoff de performance: sem cache entre requests.',
    tip: 'cookies() tornando o componente dinâmico é o tradeoff de performance que sêniors precisam gerenciar.',
    level: 'Senior',
  },
  {
    q: 'Como proteger uma Server Action contra CSRF e acesso indevido?',
    a: 'Next.js verifica header Origin automaticamente (CSRF embutido). Mas sempre: (1) verificar autenticação com getServerSession; (2) verificar autorização — o usuário pode agir sobre AQUELE recurso específico. Auth + Authz.',
    tip: 'Autenticação não é suficiente — verificar autorização (pode deletar ESSE post?) é o diferencial de sênior em segurança.',
    level: 'Senior',
  },
  {
    q: 'Como fazer cache de dados em Server Components?',
    a: 'fetch + next.revalidate: cache por tempo. unstable_cache: wrapper para funções sem fetch (ORM queries). React cache(): deduplicação per-request — não persiste entre requests. revalidateTag após mutations para invalidar seletivamente.',
    tip: 'A distinção entre React cache() (per-request) e fetch revalidate (cross-request) é detalhe que entrevistadores exploram.',
    level: 'Senior',
  },
  {
    q: 'O que é Partial Prerendering (PPR)?',
    a: 'Combina SSG e RSC streaming: shell estático gerado em build time (CDN, baixo TTFB) + partes dinâmicas streamadas pelo servidor. Suspense delimita o que é dinâmico. Next.js 14+ experimental: ppr: true.',
    tip: 'PPR é o futuro do rendering Next.js — mencionar demonstra acompanhamento do roadmap.',
    level: 'Senior',
  },
  {
    q: 'Como testar um Server Component?',
    a: 'Server Components são async functions que retornam JSX — testáveis diretamente: await ServerComponent({ params }). Mock do banco/FS. Para integração: Playwright testa comportamento real com SSR + hidratação.',
    tip: 'Server Components são async functions testáveis sem setup especial — insight que a maioria não tem.',
    level: 'Senior',
  },
  {
    q: "Diferença entre 'use server' no arquivo vs na função?",
    a: "File-level: todas as funções exportadas são Server Actions — ideal para módulos actions/posts.ts. Function-level: só aquela função é Server Action — útil para actions inline em Server Components. Não use file-level em componentes.",
    tip: 'Quando usar cada nível e por que (módulo de actions vs inline) demonstra organização além do básico.',
    level: 'Pleno',
  },
  {
    q: 'O que são Shared Components?',
    a: 'Componentes sem use client e sem API exclusiva de servidor (DB, FS, env). Podem ser importados por Server e Client Components. React decide onde renderizar pelo contexto. Exemplos: Button, Card, Badge — UI pura.',
    tip: 'Identificar quando um componente pode ser Shared (sem API exclusiva de nenhum lado) é habilidade de arquitetura.',
    level: 'Pleno',
  },
  {
    q: 'Como evitar N+1 queries em Server Components?',
    a: 'Fetch no pai com Promise.all + include/join, dados via props. React cache() deduplica a mesma query em componentes distintos na mesma request. DataLoader para batching. Alternativa mais simples: query abrangente no pai.',
    tip: 'React cache() como solução para N+1 sem DataLoader é padrão específico de RSC que poucos conhecem.',
    level: 'Senior',
  },
  {
    q: 'O que muda em Server Actions com React 19 / Next.js 15?',
    a: 'useFormState → useActionState. useFormStatus: status do form pai. Suporte a useOptimistic para updates otimistas. Next.js 15: caching de fetch não é mais default — é opt-in explícito (mudança breaking).',
    tip: 'Caching de fetch mudou de default em Next.js 15 é o tipo de atualização que demonstra acompanhamento de changelog.',
    level: 'Senior',
  },
]

// ── Cheatsheet Data ───────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'Server Component', sig: 'async function Component()', desc: 'Layouts, páginas, listas de dados — sem interação local' },
  { name: "Client Component ('use client')", sig: "'use client' no topo do arquivo", desc: 'Formulários, menus, dropdowns, animações, estado local' },
  { name: "Server Action ('use server')", sig: 'async function action(formData)', desc: 'Mutations internas: criar, editar, deletar' },
  { name: 'fetch + next.revalidate', sig: "fetch(url, { next: { revalidate: 3600 } })", desc: 'Dados que mudam com baixa frequência' },
  { name: 'React cache()', sig: 'const getCachedUser = cache(async (id) => ...)', desc: 'Deduplica chamadas na mesma request (request memoization)' },
  { name: 'unstable_cache', sig: "unstable_cache(fn, keys, { revalidate })", desc: 'Cache de funções que não usam fetch (ORM, cálculos)' },
  { name: 'revalidatePath', sig: "revalidatePath('/rota')", desc: 'Invalidar toda a rota após mutation' },
  { name: 'revalidateTag', sig: "revalidateTag('nome-da-tag')", desc: 'Invalidar fetches específicos em múltiplas rotas' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true, t: "Empurre 'use client' para as folhas — nunca no layout raiz" },
  { ok: true, t: 'Server Component não pode usar hooks, eventos ou browser APIs' },
  { ok: true, t: 'Client Component não pode importar Server Component — mas aceita como children' },
  { ok: true, t: 'Secrets seguros em Server Component — nunca passe como prop para Client' },
  { ok: true, t: 'Server Action: valide com Zod + verifique auth + authz em toda action' },
  { ok: true, t: 'cookies() e headers() tornam o componente dinâmico (opt-out do cache)' },
  { ok: true, t: 'Streaming: envolva componentes lentos em Suspense com skeleton como fallback' },
  { ok: true, t: 'Next.js 15: caching de fetch é opt-in — não mais automático' },
]

// ── Mnemonics Data ────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'SCA — poderes do Server Component',
    trick: 'SCA: Secrets, Cache, Async',
    expansion: [
      ['S — Secrets', 'Acessa banco, env vars, filesystem — sem expor ao cliente'],
      ['C — zero Client JS', 'Não gera bundle JavaScript para o browser'],
      ['A — Async nativo', 'async function com await direto, sem useEffect'],
    ],
    explanation: 'S = Secrets (banco, env, FS sem expor ao cliente); C = zero Client JS (sem bundle ao browser); A = Async nativo (async function com await direto). Se usa algum dos 3, é candidato a Server Component.',
    example: 'async function Page() { const data = await db.query() } — Server Component canônico com os 3 poderes.',
    why: 'Sem esse mnemônico, devs adicionam "use client" por default e perdem todos os benefícios de performance dos RSC.',
  },
  {
    label: 'EIRS — quando usar Client Component',
    trick: 'EIRS: Events, Interactive state, Refs, Side effects',
    expansion: [
      ['E — Events', 'onClick, onChange, onSubmit — handlers de browser'],
      ['I — Interactive state', 'useState, useReducer — estado reativo'],
      ['R — Refs', 'useRef, DOM access direto'],
      ['S — Side effects', 'useEffect, useLayoutEffect — ciclo de vida'],
    ],
    explanation: 'E = Events (onClick, onChange); I = Interactive state (useState, useReducer); R = Refs (useRef, DOM direto); S = Side effects (useEffect, useLayoutEffect). Qualquer um desses: use client.',
    example: '"use client" — se o componente tem onClick ou useState, adicione "use client" e mantenha o pai como Server Component.',
    why: 'EIRS é o checklist de decisão: se nenhuma das 4 letras se aplica, o componente pode ser Server Component.',
  },
  {
    label: 'Regra da folha — onde fica use client',
    trick: "'use client' vai nas folhas, não na raiz",
    expansion: [
      ['Raiz (errado)', "Layout, Page, Provider raiz com 'use client' — infecta toda a subárvore"],
      ['Folha (correto)', "'use client' no Button, Modal, Input — isola JS onde é necessário"],
    ],
    explanation: "Empurre 'use client' o mais fundo possível — nos componentes interativos específicos (botão, input, menu). Nunca no layout, no Shell, no provider de dados. Quanto mais alto, mais JS ao cliente.",
    example: "ThemeProvider.tsx com 'use client' isolado — layout.tsx permanece Server Component sem JS.",
    why: "Cada 'use client' cria uma fronteira de bundle. Na raiz, toda a app vai ao cliente. Nas folhas, apenas os componentes interativos específicos.",
  },
  {
    label: 'Children trick — Server dentro de Client',
    trick: 'Client não importa Server, mas aceita como children',
    expansion: [
      ['Importação (proibido)', 'import ServerComp from "./Server" dentro de Client Component — erro de runtime'],
      ['Children (permitido)', '<ClientWrapper>{children}</ClientWrapper> com ServerComp passado como prop/children'],
    ],
    explanation: 'Client Component não pode importar Server Component (runtime error). Mas pode receber Server como children. O React resolve o Server Component antes de passar ao Client — o Client só vê o resultado.',
    example: '<Layout><HeavyServerComp /></Layout> — Layout é Client, HeavyServerComp é Server passado como children.',
    why: 'Sem esse padrão, devs convertem componentes de dados para Client só porque precisam de interatividade no wrapper — desperdiçando o benefício dos RSC.',
  },
  {
    label: 'RPC vs HTTP — Server Actions vs API Routes',
    trick: 'Server Actions = RPC interno, API Routes = HTTP externo',
    expansion: [
      ['Server Actions (RPC)', 'Sem URL pública, sem CORS, auth via cookie automático, formulários nativos'],
      ['API Routes (HTTP)', 'Endpoints públicos para mobile apps, terceiros, webhooks'],
    ],
    explanation: 'Server Actions: RPC interno ao Next.js, sem URL pública, sem CORS, auth via cookie automático. Use para mutations internas. API Routes: endpoints HTTP públicos para mobile, terceiros, webhooks.',
    example: 'updateProfile() como Server Action para o dashboard. POST /api/webhook para receber eventos do Stripe.',
    why: 'Confundir os dois leva a: Server Actions com CORS desnecessário ou API Routes sem proteção CSRF onde deveriam ser Actions.',
  },
]

// ── Antipatterns Data ─────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: "'use client' no layout raiz — infecção total",
    badDesc: "Adicionar 'use client' no layout raiz transforma TODA a aplicação em Client Component",
    badCode: [
      { t: "// app/layout.tsx" },
      { t: "'use client'   // ❌ toda a app vira Client Component", c: '#ef4444' },
      { t: 'export default function RootLayout({ children }) {' },
      { t: "  const [theme, setTheme] = useState('dark')", c: '#ef4444' },
      { t: '  return <html>{children}</html>' },
    ],
    goodDesc: "Isole 'use client' em Provider específico — mantenha o layout como Server Component",
    goodCode: [
      { t: "// app/layout.tsx — Server Component (padrão)" },
      { t: 'export default function RootLayout({ children }) {' },
      { t: '  return <html><ThemeProvider>{children}</ThemeProvider></html>', c: '#4ade80' },
      { t: '}' },
      { t: "// ThemeProvider.tsx — 'use client' ISOLADO aqui" },
      { t: "'use client'   // ✅ isola o estado no Provider", c: '#4ade80' },
    ],
    why: "'use client' no layout raiz transforma TODA a aplicação. Isole estado interativo em Provider específico — mantenha o layout como Server Component para zero JS ao cliente.",
  },
  {
    title: 'Secrets como props para Client Component',
    badDesc: 'Passar secrets via props expõe a chave no RSC payload enviado ao browser',
    badCode: [
      { t: 'async function Page() {' },
      { t: '  const key = process.env.SECRET_API_KEY' },
      { t: '  // ❌ key aparece no RSC payload enviado ao browser!', c: '#ef4444' },
      { t: '  return <ClientComp apiKey={key} />', c: '#ef4444' },
    ],
    goodDesc: 'Use o secret no servidor e passe apenas os dados resultantes ao cliente',
    goodCode: [
      { t: 'async function Page() {' },
      { t: '  // ✅ usa o secret no servidor — nunca passa ao cliente', c: '#4ade80' },
      { t: '  const data = await fetchWithSecret(process.env.SECRET_API_KEY)', c: '#4ade80' },
      { t: '  return <ClientComp data={data} />', c: '#4ade80' },
    ],
    why: 'Props de Server para Client aparecem no RSC payload — visíveis no browser. Use secrets apenas internamente. Passe apenas os dados resultantes (não a chave).',
  },
  {
    title: 'Server Action sem autenticação nem autorização',
    badDesc: 'Server Actions sem auth/authz são acessíveis por qualquer request HTTP',
    badCode: [
      { t: "'use server'" },
      { t: 'export async function deletePost(id: string) {' },
      { t: '  // ❌ sem auth — qualquer request pode deletar', c: '#ef4444' },
      { t: '  // ❌ sem authz — pode deletar post de outro usuário', c: '#ef4444' },
      { t: '  await db.post.delete({ where: { id } })', c: '#ef4444' },
    ],
    goodDesc: 'Valide autenticação E autorização em toda Server Action',
    goodCode: [
      { t: "'use server'" },
      { t: 'export async function deletePost(id: string) {' },
      { t: '  const session = await getServerSession()', c: '#4ade80' },
      { t: "  if (!session?.user) throw new Error('Não autenticado')", c: '#4ade80' },
      { t: '  const post = await db.post.findUnique({ where: { id } })', c: '#4ade80' },
      { t: "  if (post?.authorId !== session.user.id) throw new Error('Proibido')", c: '#4ade80' },
      { t: '  await db.post.delete({ where: { id } })', c: '#4ade80' },
    ],
    why: 'Server Actions são acessíveis via RPC. Valide autenticação (quem é você?) E autorização (você pode fazer ISSO a ESTE recurso?). Auth sem authz ainda é vulnerável.',
  },
  {
    title: 'N+1 queries sem join ou include',
    badDesc: 'Queries em loop no Server Component resultam em N round-trips sequenciais ao banco',
    badCode: [
      { t: 'async function PostList() {' },
      { t: '  const posts = await db.post.findMany()' },
      { t: '  // ❌ N queries sequenciais — uma por post', c: '#ef4444' },
      { t: '  const withAuthors = await Promise.all(', c: '#ef4444' },
      { t: '    posts.map(p => db.user.findUnique({ where: { id: p.authorId } }))', c: '#ef4444' },
    ],
    goodDesc: 'Use include/join do ORM — 1 query com todos os dados relacionados',
    goodCode: [
      { t: 'async function PostList() {' },
      { t: '  // ✅ 1 query com include — sem N+1', c: '#4ade80' },
      { t: '  const posts = await db.post.findMany({', c: '#4ade80' },
      { t: '    include: { author: true }', c: '#4ade80' },
      { t: '  })', c: '#4ade80' },
    ],
    why: 'N queries sequenciais bloqueiam o streaming e aumentam o tempo de resposta. Use include/join do ORM ou Promise.all para fetches independentes. React cache() deduplica queries iguais na mesma request.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'React Server Components',
    stackLabel: 'Frontend / Next.js',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'React Server Components',
    accentColor: C,
    stackLabel: 'Frontend / Next.js',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [],
      rules: CHEATSHEET_RULES,
      performanceTips: [],
      patterns: [],
      mentalModels: [],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'React Server Components',
    stackLabel: 'Frontend / Next.js',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'React Server Components',
    stackLabel: 'Frontend / Next.js',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function ServerComponentsRscPdfs() {
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
      {open && (
        <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />
      )}
    </>
  )
}
