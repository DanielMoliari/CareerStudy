import type { SkillContent } from '@/types'

const nextJs: SkillContent = {
    tagline: "Framework React full-stack com SSR, SSG, App Router e Server Components.",
    why: "Next.js é o framework React mais adotado em produção. App Router (Next 13+) com Server Components muda o paradigma de desenvolvimento. Sênior precisa entender rendering strategies, caching layers, quando usar cada abordagem e como depurar problemas de cache. Em vagas fullstack e frontend sênior, Next.js é pergunta quase certa.",
    prerequisite: "React (hooks, composição de componentes, JSX). TypeScript básico. HTTP e conceitos de servidor/cliente.",
    summary: "Next.js estende React com: routing baseado em arquivo, React Server Components (RSC), Server Actions, múltiplas rendering strategies (SSR, SSG, ISR, CSR), otimizações automáticas de imagens/fontes/scripts e deployment otimizado para Vercel. O App Router (Next 13+) usa RSC por padrão — uma mudança de paradigma em relação ao Pages Router. Caching é a área mais complexa: existem quatro camadas independentes que podem interagir de formas surpreendentes. Entender qual layer está causando dado obsoleto é o principal ponto de debugging em Next.js sênior. O Pages Router ainda existe e coexiste com o App Router — projetos legados migram gradualmente.",
    howToStudy: "<strong>Modelo mental central:</strong> No App Router, cada componente é Server Component por padrão — zero JS ao cliente. Você opt-in em Client Component com 'use client'. A pergunta que guia cada decisão é: 'esse componente precisa de interatividade (estado, eventos, browser APIs)?' Se não, mantém como Server Component.<br><br><strong>Sequência recomendada:</strong><ol><li>Estude o tutorial oficial next.js/learn — passa por App Router, data fetching, caching, Server Actions em ordem lógica.</li><li>Leia a documentação de caching — é o tema mais complexo e mais cobrado em entrevistas sênior.</li><li>Construa um projeto real com: Server Components para dados, Client Components para UI interativa, Server Actions para mutations.</li><li>Depois, explore: Streaming com Suspense, Route Groups, Parallel Routes, Intercepting Routes.</li></ol>",
    diagrams: [
      {
        title: "App Router — Server vs Client Component e composição correta",
        html: `<style>
.nja-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.nja-srv{background:#1c2a1c;border:1.5px solid rgba(74,222,128,.35);border-radius:8px;padding:10px 14px}
.nja-cli{background:#1c1c2a;border:1.5px solid rgba(226,232,240,.25);border-radius:8px;padding:10px 14px}
.nja-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(226,232,240,.3);display:inline}
.nja-tip:hover .nja-tb{display:block}
.nja-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.nja-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.nja-row{display:flex;align-items:center;gap:6px;margin-bottom:6px;font-size:11px;color:#94a3b8}
.nja-ok{color:#4ade80}
.nja-no{color:#ef4444}
</style>
<div class="nja-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 4px">App Router — Server vs Client Component</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(226,232,240,.3)">sublinhados</span></p>
  <div style="display:flex;gap:10px;margin-bottom:14px">
    <div class="nja-srv" style="flex:1">
      <div style="font-size:10px;color:#4ade80;font-weight:700;letter-spacing:.06em;margin-bottom:10px">SERVER COMPONENT (padrão)</div>
      <div class="nja-row"><span class="nja-ok">✓</span> <span class="nja-tip">async/await<span class="nja-tb">Server Components podem ser funções async. Faça fetch diretamente, sem useEffect. Next.js deduplica fetches idênticos na mesma request.</span></span> diretamente</div>
      <div class="nja-row"><span class="nja-ok">✓</span> Acesso a banco e filesystem</div>
      <div class="nja-row"><span class="nja-ok">✓</span> Ler env vars do servidor</div>
      <div class="nja-row"><span class="nja-ok">✓</span> Zero JS enviado ao cliente</div>
      <div class="nja-row"><span class="nja-no">✗</span> <span class="nja-tip">useState / useReducer<span class="nja-tb">Estado requer o browser. Server Components não têm estado — eles rodam no servidor e produzem HTML/RSC payload. Para interatividade, crie um Client Component filho.</span></span></div>
      <div class="nja-row"><span class="nja-no">✗</span> onClick, onChange, eventos</div>
      <div class="nja-row"><span class="nja-no">✗</span> window, localStorage, document</div>
    </div>
    <div class="nja-cli" style="flex:1">
      <div style="font-size:10px;color:#e2e8f0;font-weight:700;letter-spacing:.06em;margin-bottom:10px">'use client' — CLIENT COMPONENT</div>
      <div class="nja-row"><span class="nja-ok">✓</span> useState, useReducer, hooks</div>
      <div class="nja-row"><span class="nja-ok">✓</span> onClick, onChange, eventos</div>
      <div class="nja-row"><span class="nja-ok">✓</span> window, localStorage, APIs do browser</div>
      <div class="nja-row"><span class="nja-ok">✓</span> <span class="nja-tip">Receber Server Components via children<span class="nja-tb">Padrão de composição chave: Client Component com shell interativo recebe Server Components como children. O Server Component continua rodando no servidor — não vira Client só por estar dentro de um Client.</span></span></div>
      <div class="nja-row"><span class="nja-no">✗</span> Importar Server Component diretamente</div>
      <div class="nja-row"><span class="nja-no">✗</span> Acessar banco/secrets diretamente</div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 16px">
    <div style="font-size:9px;color:#e2e8f0;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Padrão de composição correto</div>
    <div style="font-size:11px;color:#64748b;line-height:2">
      <span style="color:#475569">// page.tsx (Server Component)</span><br>
      <span style="color:#7c3aed">export default async function</span> <span style="color:#4ade80">Page</span>() {<br>
      &nbsp;&nbsp;<span style="color:#7c3aed">const</span> data = <span style="color:#7c3aed">await</span> db.posts.findMany()<br>
      &nbsp;&nbsp;<span style="color:#7c3aed">return</span> (<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="nja-tip">InteractiveShell<span class="nja-tb">'use client' — tem useState, menu, animações. Recebe os dados como children/props do Server Component pai.</span></span>&gt; <span style="color:#475569">{'// Client Component'}</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="nja-tip">DataTable data={data}<span class="nja-tb">Server Component como children. Roda no servidor — zero JS ao cliente para renderizar a tabela de dados.</span></span> /&gt; <span style="color:#475569">{'// Server Component'}</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&lt;/InteractiveShell&gt;<br>
      &nbsp;&nbsp;)<br>
      }
    </div>
  </div>
</div>`,
        caption: "Server Component = dados + zero JS. Client Component = interatividade. Empurre 'use client' para as folhas — componentes de dados ficam como Server Components.",
      },
      {
        title: "Rendering strategies — quando usar cada uma",
        html: `<style>
.nj-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.nj-card{background:#1e293b;border-radius:10px;padding:14px 16px;border:1.5px solid #334155;flex:1}
.nj-label{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px}
.nj-tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:4px;margin:2px 2px 2px 0}
.nj-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(255,153,0,.4);display:inline}
.nj-tip:hover .nj-tb{display:block}
.nj-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.nj-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
</style>
<div class="nj-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 4px">Next.js — 4 estratégias de rendering</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(255,153,0,.4)">sublinhados</span></p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div class="nj-card">
      <div class="nj-label" style="color:#4ade80">SSG — Static Site Generation</div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.7">
        HTML gerado em <span class="nj-tip">build time<span class="nj-tb">O HTML existe antes da request. Servido do CDN — latência mínima. Não personaliza por usuário.</span></span>.<br>
        Serve do CDN. Mais rápido.<br><br>
        <strong style="color:#e2e8f0">Use para:</strong><br>
        <span class="nj-tag" style="background:#1c3a2a;color:#4ade80">blog / docs</span>
        <span class="nj-tag" style="background:#1c3a2a;color:#4ade80">landing page</span>
        <span class="nj-tag" style="background:#1c3a2a;color:#4ade80">marketing</span>
      </div>
    </div>
    <div class="nj-card">
      <div class="nj-label" style="color:#fb923c">ISR — Incremental Static Regen</div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.7">
        SSG com <span class="nj-tip">revalidação em background<span class="nj-tb">Após N segundos, o próximo visitante recebe o HTML antigo, e Next.js regenera no background. Zero downtime.</span></span>.<br>
        export const revalidate = 3600<br><br>
        <strong style="color:#e2e8f0">Use para:</strong><br>
        <span class="nj-tag" style="background:#3a2010;color:#fb923c">catálogo de produtos</span>
        <span class="nj-tag" style="background:#3a2010;color:#fb923c">preços</span>
      </div>
    </div>
    <div class="nj-card">
      <div class="nj-label" style="color:#38bdf8">SSR — Server-Side Rendering</div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.7">
        HTML gerado <span class="nj-tip">por request<span class="nj-tb">Cada request gera um novo HTML no servidor. Personalizável por usuário — cookies, headers, params.</span></span> no servidor.<br>
        Usa cookies, headers, auth.<br><br>
        <strong style="color:#e2e8f0">Use para:</strong><br>
        <span class="nj-tag" style="background:#0c2a3a;color:#38bdf8">dashboard</span>
        <span class="nj-tag" style="background:#0c2a3a;color:#38bdf8">checkout</span>
        <span class="nj-tag" style="background:#0c2a3a;color:#38bdf8">perfil</span>
      </div>
    </div>
    <div class="nj-card">
      <div class="nj-label" style="color:#a78bfa">CSR — Client-Side Rendering</div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.7">
        JS baixado e executado no <span class="nj-tip">browser<span class="nj-tb">Sem HTML inicial. O browser baixa o bundle, executa, e renderiza. SEO comprometido sem pré-rendering.</span></span>.<br>
        Sem SEO. SPA pura.<br><br>
        <strong style="color:#e2e8f0">Use para:</strong><br>
        <span class="nj-tag" style="background:#2a1c3a;color:#a78bfa">editor rico</span>
        <span class="nj-tag" style="background:#2a1c3a;color:#a78bfa">app interno</span>
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 16px;margin-top:10px">
    <div style="font-size:9px;color:#FF9900;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">Regra de ouro — App Router</div>
    <div style="font-size:11px;color:#94a3b8;line-height:1.7">
      No App Router, Next.js decide automaticamente: rota que usa <code style="color:#e2e8f0;background:#0f172a;padding:1px 4px;border-radius:3px">cookies()</code> / <code style="color:#e2e8f0;background:#0f172a;padding:1px 4px;border-radius:3px">headers()</code> → SSR. Rota com <code style="color:#e2e8f0;background:#0f172a;padding:1px 4px;border-radius:3px">export const revalidate</code> → ISR. Rota sem dados dinâmicos → SSG.
    </div>
  </div>
</div>`,
        caption: "SSG = mais rápido, ISR = catálogos que mudam raramente, SSR = personalizado por usuário, CSR = interatividade máxima sem SEO.",
      },
    ],
    keypoints: [
      {
        title: "App Router vs Pages Router — o que mudou",
        body: "App Router (Next 13+): Server Components por padrão, layouts aninhados que preservam estado ao navegar, loading.tsx e error.tsx por rota, Route Handlers. Pages Router: modelo antigo com getServerSideProps/getStaticProps, _app.tsx e _document.tsx globais. Em projetos novos, use App Router. Projetos legados migram gradualmente — ambos coexistem no mesmo projeto.",
        code: `// Pages Router (legado):
// pages/users/[id].tsx
export async function getServerSideProps({ params }) {
  const user = await db.user.findUnique({ where: { id: params.id } })
  return { props: { user } }
}

// App Router (atual):
// app/users/[id]/page.tsx
export default async function UserPage({ params }) {
  const user = await db.user.findUnique({ where: { id: params.id } })
  return <UserProfile user={user} />   // Server Component — zero boilerplate
}`,
      },
      {
        title: "Rendering strategies — implícitas no App Router",
        body: "No App Router, a estratégia de rendering é inferida automaticamente: rota com cookies()/headers() → SSR por request. Rota com fetch() normal → ISR ou SSG. Rota com export const revalidate = N → ISR. Rota totalmente estática → SSG em build time. Você não escolhe explicitamente — Next.js decide pelo que a rota usa.",
        code: `// SSG — sem dados dinâmicos (gerado em build)
export default function AboutPage() { return <About /> }

// ISR — revalida a cada 1 hora em background
export const revalidate = 3600
export default async function CatalogPage() {
  const products = await db.product.findMany()
  return <ProductGrid products={products} />
}

// SSR — usa cookies → dinâmico por request
import { cookies } from 'next/headers'
export default async function DashboardPage() {
  const session = cookies().get('session')
  const data = await getUserData(session?.value)
  return <Dashboard data={data} />
}`,
      },
      {
        title: "Caching em 4 camadas — a área mais complexa do Next.js",
        body: "Next.js tem 4 camadas independentes de cache. Entender qual está causando dado obsoleto é o principal skill de debugging em produção. (1) Request Memoization: deduplication de fetch na mesma árvore de render — dura uma request. (2) Data Cache: resultado de fetch() entre requests (persistente, em disco). (3) Full Route Cache: HTML + RSC payload para rotas estáticas. (4) Router Cache: client-side, RSC payload durante a sessão.",
        code: `// Data Cache — invalida por path ou tag
fetch('/api/posts', { next: { tags: ['posts'] } })
revalidateTag('posts')    // invalida todos com tag 'posts'
revalidatePath('/posts')  // invalida rota específica

// Opt-out de cache para dado sempre fresco:
fetch('/api/realtime', { cache: 'no-store' })

// Router Cache (client-side): invalida via:
import { useRouter } from 'next/navigation'
const router = useRouter()
router.refresh() // força re-fetch do RSC payload atual`,
      },
      {
        title: "Server Actions — mutations sem endpoint de API",
        body: "Server Actions são funções async marcadas com 'use server' que rodam no servidor e são chamadas do cliente via RPC transparente. Eliminam a necessidade de criar endpoints de API para mutations internas. Integram com formulários HTML nativamente (action={serverAction}) e com useFormStatus para loading state.",
        code: `// app/actions.ts
'use server'
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const parsed = postSchema.safeParse({ title })
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }
  await db.post.create({ data: { title: parsed.data.title } })
  revalidatePath('/posts')
}

// Em Client Component:
'use client'
import { useFormStatus } from 'react-dom'
function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Salvando...' : 'Criar'}</button>
}
export function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <SubmitButton />
    </form>
  )
}`,
      },
      {
        title: "Streaming com Suspense — carregamento progressivo",
        body: "Server Components suportam streaming: o servidor envia HTML incrementalmente ao browser conforme partes ficam prontas. Suspense boundary mostra fallback enquanto componentes pesados carregam. Melhora Time To First Byte — o usuário vê conteúdo imediatamente enquanto dados lentos carregam em background.",
        code: `// page.tsx — streaming com Suspense
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <Header />              {/* imediato — sem dados */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />     {/* streamado quando os dados chegam */}
      </Suspense>
      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />    {/* streamado independentemente */}
      </Suspense>
    </>
  )
}

// DashboardData.tsx — Server Component async
async function DashboardData() {
  const data = await fetchSlowData() // pode levar 2s — sem bloquear a página
  return <Dashboard data={data} />
}`,
      },
      {
        title: "Organização de projeto — Route Groups e colocação",
        body: "Route Groups com (parênteses) organizam rotas sem afetar a URL — útil para layouts separados (área pública vs autenticada). Colocação: componentes, hooks e utils perto das rotas que os usam. Private folders com _ nunca viram rotas. Parallel Routes (@slot) para layouts complexos com múltiplas seções independentes.",
        code: `// Estrutura recomendada com Route Groups:
app/
  (public)/               // sem layout de auth
    page.tsx              // /
    about/page.tsx        // /about
  (dashboard)/            // com layout autenticado
    layout.tsx            // shell com sidebar, nav
    dashboard/page.tsx    // /dashboard
    settings/page.tsx     // /settings
  api/
    users/route.ts        // GET/POST /api/users
  _lib/                   // _ = nunca vira rota
    db.ts`,
      },
      {
        title: "Metadata API e SEO",
        body: "App Router tem API de Metadata tipada para meta tags, Open Graph, Twitter Cards. Estático com export const metadata, dinâmico com async function generateMetadata(). Muito mais ergonômico que o Head manualizado do Pages Router. Suporta icons, manifest, robots, canonical e muito mais.",
        code: `// Metadata estático:
export const metadata: Metadata = {
  title: 'Meu Site',
  description: 'Descrição para SEO',
  openGraph: { title: 'Meu Site', images: ['/og.png'] },
}

// Metadata dinâmico (por produto, por exemplo):
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await db.product.findUnique({ where: { id: params.id } })
  return {
    title: product?.name ?? 'Produto',
    description: product?.description,
    openGraph: { images: [product?.image ?? '/og.png'] },
  }
}`,
      },
    ],
    gotchas: [
      "Colocar 'use client' no topo da árvore transforma todos os filhos importados em Client Components. Mova a interatividade para as folhas — componentes de dados ficam como Server Components.",
      "Cache agressivo do Data Cache pode servir dado obsoleto após mutations. Use revalidatePath(), revalidateTag() ou cache: 'no-store' explicitamente nos fetches críticos.",
      "Server Actions não substituem API Routes para casos de uso público (webhooks, apps mobile) — elas requerem o contexto Next.js e autenticação via cookies de sessão.",
      "Usar cookies() ou headers() em Server Component faz a rota se tornar dinamicamente renderizada (opt-out de Full Route Cache). Isso é silencioso — pode surpreender em produção.",
      "O Router Cache (client-side) dura 30s para páginas dinâmicas e 5min para estáticas. Não é invalidado por revalidatePath no servidor — requer router.refresh() no cliente.",
      "Passar funções como props de Server Component para Client Component não funciona (funções não são serializáveis). Use Server Actions para isso.",
      "next/font e next/image têm comportamento de loading diferente em desenvolvimento vs produção — sempre teste o build de produção antes de ajustar performance.",
    ],
    interview: [
      {
        q: "Quando usar SSR vs SSG vs ISR no App Router?",
        a: "<p>No App Router, a estratégia é inferida pelo que a rota usa — não é uma escolha explícita na maioria dos casos:</p><ul><li><strong>SSG</strong> (padrão): rota sem dados dinâmicos. Gerado em build time, serve do CDN. Blog, landing page, docs.</li><li><strong>ISR</strong>: <code>export const revalidate = N</code>. Dados que mudam raramente. Catálogo de produtos, preços. Regenera em background — zero downtime.</li><li><strong>SSR</strong>: rota usa cookies()/headers() ou searchParams — automaticamente dinâmica por request. Dados personalizados por usuário: dashboard, checkout.</li><li><strong>CSR</strong>: componente marcado 'use client' com fetch no browser (SWR, React Query). Apps interativos sem SEO: editores, apps internos.</li></ul>",
        tip: "Mencione ISR como 'melhor dos dois mundos' para catálogos — é o caso de uso mais ilustrativo e mostra que você entende a tradeoff performance/freshness.",
        level: "pleno",
      },
      {
        q: "O que são Server Components e quais são suas limitações?",
        a: "<p>Server Components rodam apenas no servidor, nunca no browser. Benefícios: zero bundle JS enviado ao cliente, acesso direto a DB/filesystem/secrets sem round-trip, eliminação de waterfalls cliente-servidor.</p><p>Limitações: sem useState/useReducer (requer browser), sem event handlers (onClick, onChange), sem browser APIs (window, localStorage, document), sem React Context que depende de estado client-side.</p><p>Padrão correto: toda lógica de dados vai em Server Components; interatividade fica em Client Components nas folhas da árvore. Passe Server Components como children de Client Components quando precisar manter ambos.</p>",
        tip: "A pegadinha: 'use client' não impede o componente de rodar no servidor durante SSR/hidratação — ele roda nos dois lados. Mencionar isso mostra profundidade real.",
        level: "pleno",
      },
      {
        q: "Explique as 4 camadas de cache do Next.js App Router.",
        a: "<p><strong>1. Request Memoization</strong>: deduplica fetches idênticos dentro de uma mesma árvore de render. Dois Server Components fazendo o mesmo fetch recebem a mesma resposta sem duplo hit de rede. Dura apenas por uma request — sem persistência.</p><p><strong>2. Data Cache</strong>: armazena resultado de fetch() entre requests, em disco. Persiste entre deployments por padrão. Invalida via revalidatePath/revalidateTag ou cache: 'no-store'. É aqui que dado 'grudado' mais aparece.</p><p><strong>3. Full Route Cache</strong>: armazena HTML + RSC payload para rotas estáticas em build time. Invalida via revalidação de dados ou novo build.</p><p><strong>4. Router Cache</strong>: client-side, no browser. Armazena RSC payload por segmento de rota durante a sessão. Invalida via router.refresh() ou nova navegação completa — não via revalidatePath do servidor.</p>",
        tip: "Poucos candidatos conhecem todas as 4 camadas distintas. Se você souber, claramente está além do pleno comum. Mencione o Router Cache como a camada mais surpreedente para devs — dado obsoleto que persiste mesmo após revalidation no servidor.",
        level: "senior",
      },
      {
        q: "Qual a diferença entre Server Actions e API Routes (Route Handlers)?",
        a: "<p><strong>Server Actions</strong>: funções async com 'use server', chamadas via RPC transparente. Autenticação via cookies automática. Integram com formulários HTML nativamente. Ideais para mutations internas do app. Não são endpoints HTTP públicos.</p><p><strong>Route Handlers</strong>: endpoints HTTP explícitos em app/api/. Acessíveis por qualquer cliente (mobile, terceiros). Suportam todos os métodos HTTP. Necessários para webhooks (Stripe, GitHub) — precisam de URL pública sem autenticação de sessão.</p><p>Regra prática: Server Actions para mutations de UI interna; Route Handlers para endpoints consumidos por clientes externos ou webhooks.</p>",
        tip: "Citar webhooks como o caso claro de Route Handler — precisam de acesso público sem sessão — é o diferencial concreto que o entrevistador quer ouvir.",
        level: "senior",
      },
      {
        q: "Como você organiza um projeto grande com App Router?",
        a: "<p>Padrões que funcionam em produção: (1) <strong>Route Groups</strong> com (parênteses) para separar layouts sem afetar URL — ex: (public)/sobre, (dashboard)/settings. (2) <strong>Colocação de arquivos</strong>: componentes, hooks e utils perto das rotas que os usam — não tudo em /components global. (3) <strong>Private folders</strong> com underscore (_lib, _components) — nunca viram rotas. (4) <strong>Parallel Routes</strong> (@slot) para layouts complexos com seções independentes (sidebar + main + modal). (5) <strong>Intercepting Routes</strong> para abrir modais mantendo a URL original (galeria de fotos, quick preview).</p>",
        tip: "Citar Route Groups é o indicador de quem realmente usou App Router em projeto real — a maioria não conhece. Parallel e Intercepting Routes são diferenciais sênior.",
        level: "senior",
      },
      {
        q: "Como Next.js otimiza imagens e fonts e por que isso importa?",
        a: "<p><strong>next/image</strong>: converte para WebP/AVIF automaticamente, gera srcset responsivo por tamanho de tela, lazy loading por padrão (acima da dobra: loading='eager'), reserva espaço no layout com width/height — evita CLS, serve via CDN configurado.</p><p><strong>next/font</strong>: baixa e serve fontes localmente (zero request para Google Fonts em produção), elimina FOUT (Flash of Unstyled Text) com font-display: swap, aplica size-adjust para evitar CLS de substituição de fonte.</p><p>Por que importa: imagens e fontes são as principais causas de LCP ruim e CLS — as duas métricas que mais afetam o ranking SEO via Core Web Vitals. Usar img e @import de Google Fonts em Next.js é desperdiçar otimizações automáticas.</p>",
        tip: "Conectar next/image com LCP e next/font com CLS mostra que você entende o propósito das otimizações, não só como usar.",
        level: "pleno",
      },
      {
        q: "Como você depuraria um problema de dado obsoleto em Next.js App Router?",
        a: "<p>Abordagem sistemática por camada de cache: (1) <strong>Data Cache</strong>: adicione logging no fetch e veja se a resposta está sendo servida de cache. Adicione cache: 'no-store' temporariamente para confirmar. Se o dado fresco aparece, a invalidação não está funcionando — verifique revalidatePath/revalidateTag. (2) <strong>Full Route Cache</strong>: veja se a rota está sendo tratada como estática quando deveria ser dinâmica. cookies() ou headers() devem opt-out automaticamente. (3) <strong>Router Cache</strong>: se o dado parece correto após reload mas fica obsoleto em navegação — é o Router Cache. Chame router.refresh() no cliente após mutations. (4) <strong>Request Memoization</strong>: raramente é o problema, mas se dois fetches idênticos estão conflitando, adicione parâmetros únicos ou desabilite com AbortController.</p>",
        tip: "Mostrar uma abordagem de debugging por camada (não 'tentativa e erro') é o que diferencia sênior de pleno. O entrevistador quer ver pensamento sistemático.",
        level: "senior",
      },
      {
        q: "Como funciona o App Router em comparação ao Pages Router? Quais são as diferenças fundamentais?",
        a: "<p>As diferenças são profundas — não é só uma mudança de pasta:</p><ul><li><strong>Componentes padrão</strong>: App Router usa React Server Components por padrão. Pages Router usa componentes que sempre hidratam no cliente.</li><li><strong>Data fetching</strong>: App Router usa <code>async/await</code> diretamente no componente. Pages Router usa <code>getServerSideProps</code>, <code>getStaticProps</code> e <code>getStaticPaths</code> — funções especiais fora do componente.</li><li><strong>Layouts</strong>: App Router tem <code>layout.tsx</code> aninhado por segmento. Pages Router tem <code>_app.tsx</code> e <code>_document.tsx</code> globais.</li><li><strong>Mutations</strong>: App Router tem Server Actions. Pages Router não tem — usa API Routes + fetch no cliente.</li><li><strong>Streaming</strong>: App Router suporta Suspense nativo com <code>loading.tsx</code>. Pages Router exige implementação manual.</li><li><strong>Coexistência</strong>: os dois roteadores coexistem no mesmo projeto — <code>app/</code> e <code>pages/</code> podem existir juntos. Migração é incremental.</li></ul>",
        tip: "Mencionar que Pages Router ainda é amplamente usado e que os dois coexistem mostra maturidade. Muitos candidatos tratam Pages Router como obsoleto — mas é a realidade de 90% dos projetos legados.",
        level: "pleno",
      },
      {
        q: "Como funciona o Streaming com Suspense no Next.js App Router?",
        a: "<p>Streaming permite enviar o HTML da página em pedaços (chunks) ao invés de aguardar o componente inteiro renderizar. O browser começa a exibir o conteúdo mais rápido.</p><p>Como funciona: o servidor envia o shell da página (layout, partes estáticas) imediatamente. Partes envolvidas em <code>&lt;Suspense&gt;</code> são enviadas conforme ficam prontas — HTTP streaming usa chunked transfer encoding.</p><pre><code>// app/dashboard/page.tsx\nimport { Suspense } from 'react'\n\nexport default function DashboardPage() {\n  return (\n    &lt;main&gt;\n      &lt;h1&gt;Dashboard&lt;/h1&gt; {/* renderizado imediatamente */}\n      &lt;Suspense fallback={&lt;MetricsSkeleton /&gt;}&gt;\n        &lt;Metrics /&gt; {/* streaming — aparece quando pronto */}\n      &lt;/Suspense&gt;\n      &lt;Suspense fallback={&lt;ChartSkeleton /&gt;}&gt;\n        &lt;RevenueChart /&gt; {/* streaming paralelo */}\n      &lt;/Suspense&gt;\n    &lt;/main&gt;\n  )\n}</code></pre><p>Benefício: o LCP (Largest Contentful Paint) melhora porque o shell visível aparece antes dos dados lentos. Cada <code>&lt;Suspense&gt;</code> resolve em paralelo — não é waterfall.</p>",
        tip: "Mencione que o <code>loading.tsx</code> é syntactic sugar para um <code>&lt;Suspense&gt;</code> automático envolvendo o <code>page.tsx</code> inteiro. A granularidade manual é mais poderosa.",
        level: "pleno",
      },
      {
        q: "O que são Route Handlers e como diferem das API Routes do Pages Router?",
        a: "<p>Route Handlers vivem em <code>app/api/route.ts</code> (ou qualquer sub-rota com <code>route.ts</code>). São funções exportadas nomeadas pelo método HTTP: <code>export async function GET(req: Request)</code>, <code>POST</code>, <code>PUT</code>, etc.</p><p>Diferenças em relação às API Routes do Pages Router:</p><ul><li><strong>Web API nativa</strong>: recebem <code>Request</code> padrão e retornam <code>Response</code> padrão — não os objetos <code>req</code>/<code>res</code> do Node.js. Portáveis para Edge Runtime.</li><li><strong>Nomeação por método</strong>: sem switch em <code>req.method</code>. Cada método HTTP é uma export separada.</li><li><strong>Coexistência com page.tsx</strong>: você não pode ter <code>page.tsx</code> e <code>route.ts</code> no mesmo segmento — são mutuamente exclusivos.</li><li><strong>Cache</strong>: GET Route Handlers são cached por padrão (como Static). Use <code>export const dynamic = 'force-dynamic'</code> para opt-out.</li></ul><pre><code>// app/api/users/route.ts\nexport async function GET() {\n  const users = await db.user.findMany()\n  return Response.json(users)\n}\n\nexport async function POST(req: Request) {\n  const body = await req.json()\n  const user = await db.user.create({ data: body })\n  return Response.json(user, { status: 201 })\n}</code></pre>",
        tip: "A mudança de <code>res.json()</code> para <code>Response.json()</code> com Web API padrão é o diferencial de quem sabe a diferença real — não apenas a localização do arquivo.",
        level: "pleno",
      },
      {
        q: "Como funciona o Middleware no Next.js? Quando usar e quais são as limitações?",
        a: "<p>Middleware é um arquivo <code>middleware.ts</code> na raiz do projeto que roda antes de toda request, no Edge Runtime (não Node.js). Recebe <code>NextRequest</code> e retorna <code>NextResponse</code>.</p><p><strong>Casos de uso:</strong></p><ul><li>Autenticação: redirecionar para /login se não houver sessão</li><li>Internacionalização: detectar Accept-Language e redirecionar para /pt/ ou /en/</li><li>Feature flags: redirecionar para variante A/B baseado em cookie</li><li>Rewrite de URL: mapear paths legados para novas rotas</li><li>Bloqueio por país (geo via header)</li></ul><p><strong>Limitações do Edge Runtime:</strong></p><ul><li>Sem APIs Node.js (fs, crypto nativo, etc.) — use Web Crypto API</li><li>Sem conexão direta com banco de dados — Middleware deve ser leve</li><li>Tamanho máximo do bundle: 1 MB</li><li>Cold start ultra-baixo (&lt;1ms) mas sem persistência de estado</li></ul><pre><code>// middleware.ts\nimport { NextResponse } from 'next/server'\nimport type { NextRequest } from 'next/server'\n\nexport function middleware(request: NextRequest) {\n  const token = request.cookies.get('session')?.value\n  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {\n    return NextResponse.redirect(new URL('/login', request.url))\n  }\n  return NextResponse.next()\n}\n\nexport const config = { matcher: ['/dashboard/:path*'] }</code></pre>",
        tip: "Enfatize que o Middleware não substitui validação nas Server Actions ou Route Handlers — é a primeira linha de defesa, não a única. Um middleware bypassado não deve dar acesso a dados reais.",
        level: "senior",
      },
      {
        q: "Como o Next.js faz code splitting? Qual a diferença entre automático e next/dynamic?",
        a: "<p>Next.js faz code splitting automático por rota: o JS de cada <code>page.tsx</code> é um chunk separado — o browser só baixa o código da rota atual. Isso é implícito e zero-config.</p><p><strong>next/dynamic</strong>: code splitting manual dentro de uma rota, para componentes pesados que não são necessários na renderização inicial.</p><pre><code>import dynamic from 'next/dynamic'\n\n// O bundle do Editor só é baixado quando o componente é montado\nconst Editor = dynamic(() => import('./Editor'), {\n  loading: () => &lt;div&gt;Carregando editor...&lt;/div&gt;,\n  ssr: false, // não renderizar no servidor (usa browser APIs)\n})\n\nexport default function WritePage() {\n  const [editing, setEditing] = useState(false)\n  return editing ? &lt;Editor /&gt; : &lt;PreviewMode /&gt;\n}</code></pre><p>Use <code>next/dynamic</code> com <code>ssr: false</code> para componentes que usam browser APIs (window, localStorage) — eles não podem ser server-rendered. Também útil para componentes de terceiros pesados (Monaco Editor, Chart.js, mapas) que não precisam estar no bundle inicial.</p>",
        tip: "Mencionar <code>ssr: false</code> como a solução para 'Component uses window' errors é o caso de uso mais comum e pedido em entrevista.",
        level: "pleno",
      },
      {
        q: "Quais são as diferenças de deploy: Vercel vs self-hosted Node.js vs static export?",
        a: "<p>Três formas de deploy com trade-offs bem distintos:</p><ul><li><strong>Vercel</strong>: plataforma proprietária que otimiza automaticamente para Next.js. SSR via Edge Functions, Full Route Cache em CDN global, Image Optimization integrada, revalidação ISR sob demanda. Melhor performance 'sem esforço'. Custo cresce com tráfego — pode ser alto em produção.</li><li><strong>Self-hosted Node.js</strong>: <code>next build &amp;&amp; next start</code>. Controle total. Requer infraestrutura própria (EC2, ECS, Railway, Fly.io). Funciona com todas as features do Next.js (SSR, Server Actions, ISR). Precisa configurar cache CDN, Image Optimization (sharp), e OTel separadamente. Mais trabalho, mais controle de custo.</li><li><strong>Static export</strong>: <code>output: 'export'</code> no next.config. Gera HTML/CSS/JS puro sem runtime Node.js. Pode ser deployado em S3+CloudFront, GitHub Pages, Netlify. Limitações críticas: sem SSR, sem Server Actions, sem Route Handlers, sem middleware, sem Image Optimization automática. Use apenas para sites puramente estáticos sem dados dinâmicos por usuário.</li></ul>",
        tip: "A pergunta sobre static export é armadilha — muitos candidatos não sabem que Server Actions não funcionam nesse modo. Saber as limitações demonstra experiência prática.",
        level: "senior",
      },
      {
        q: "O que são Parallel Routes e Intercepting Routes? Dê um caso de uso real de cada.",
        a: "<p><strong>Parallel Routes</strong> (slots <code>@nome</code>): permitem renderizar múltiplas páginas no mesmo layout simultaneamente, cada uma com sua própria navegação e estado de loading/error. São slots paralelos dentro de um layout.</p><pre><code>// app/dashboard/@analytics/page.tsx\n// app/dashboard/@team/page.tsx\n// app/dashboard/layout.tsx\nexport default function DashboardLayout({\n  analytics, team\n}: { analytics: React.ReactNode; team: React.ReactNode }) {\n  return (\n    &lt;div className=\"grid grid-cols-2\"&gt;\n      {analytics}\n      {team}\n    &lt;/div&gt;\n  )\n}</code></pre><p>Caso de uso: dashboard com sidebar independente da área principal — cada um pode ter seu próprio loading state e error boundary.</p><p><strong>Intercepting Routes</strong> (<code>(.)rota</code>, <code>(..)rota</code>): interceptam a navegação para uma rota e mostram seu conteúdo em outro contexto (modal), preservando a URL original.</p><p>Caso de uso real: galeria de fotos do Instagram — clicar em uma foto abre ela em modal com a URL <code>/photo/123</code>. Compartilhar essa URL abre a foto em página cheia. A mesma rota funciona nos dois contextos.</p>",
        tip: "Intercepting Routes explicadas com o exemplo de modal/galeria é a explicação mais clara — evite jargão e vá direto para o comportamento do usuário.",
        level: "senior",
      },
      {
        q: "Como você faz fetch de dados com cache granular no App Router usando tags?",
        a: "<p>O <code>next: { tags }</code> no fetch permite invalidação granular via <code>revalidateTag()</code>. Você etiqueta fetches e invalida apenas os dados relevantes — sem forçar rebuild de toda a rota.</p><pre><code>// Server Component com tagged fetch\nasync function getUser(id: string) {\n  const res = await fetch(`/api/users/${id}`, {\n    next: { tags: [`user:${id}`, 'users'] }\n  })\n  return res.json()\n}\n\n// Server Action para atualizar\nasync function updateUser(id: string, data: FormData) {\n  'use server'\n  await db.user.update({ where: { id }, data: Object.fromEntries(data) })\n  // Invalida apenas os fetches com essa tag\n  revalidateTag(`user:${id}`)\n  // ou invalida todos os usuários:\n  // revalidateTag('users')\n}\n\n// unstable_cache para funções não-fetch (DB queries, etc.)\nimport { unstable_cache } from 'next/cache'\nconst getCachedUser = unstable_cache(getUser, ['user'], { tags: ['users'] })</code></pre><p><code>unstable_cache</code> é para cache de funções arbitrárias (chamadas diretas a DB sem fetch). Funciona com os mesmos tags e revalidação.</p>",
        tip: "A combinação <code>next: { tags }</code> + <code>revalidateTag()</code> + <code>unstable_cache</code> é o padrão de produção para invalidação eficiente. Quem conhece os três demonstra domínio real.",
        level: "senior",
      },
      {
        q: "Como garantir segurança em Server Actions? Quais vetores de ataque existem?",
        a: "<p>Server Actions são endpoints HTTP implícitos — o Next.js gera um endpoint POST para cada uma. Sem proteção, um atacante pode chamá-las diretamente com dados arbitrários.</p><p><strong>Vetores de ataque e proteções:</strong></p><ul><li><strong>Chamada direta sem sessão</strong>: sempre valide a sessão dentro da Server Action — não dependa apenas do Middleware. O Middleware protege a rota, mas a Action pode ser chamada de qualquer origin.</li><li><strong>CSRF</strong>: Next.js 14+ inclui proteção automática via Origin header check para mesma origem. Verifique se está na versão correta.</li><li><strong>Input não validado</strong>: use Zod para validar todo input antes de qualquer operação com banco.</li><li><strong>Autorização</strong>: verificar que o usuário autenticado TEM permissão para a operação (não apenas que está autenticado).</li></ul><pre><code>'use server'\nimport { auth } from '@/lib/auth'\nimport { z } from 'zod'\n\nconst schema = z.object({ id: z.string().uuid(), content: z.string().max(1000) })\n\nexport async function updatePost(input: unknown) {\n  const session = await auth() // 1. Autenticação\n  if (!session) throw new Error('Não autorizado')\n\n  const { id, content } = schema.parse(input) // 2. Validação\n\n  const post = await db.post.findUnique({ where: { id } })\n  if (post?.authorId !== session.user.id) // 3. Autorização\n    throw new Error('Proibido')\n\n  return db.post.update({ where: { id }, data: { content } })\n}</code></pre>",
        tip: "Autenticação + Zod + autorização (ACL) nos três níveis é a resposta completa. Quem só menciona autenticação demonstra gap de segurança.",
        level: "senior",
      },
      {
        q: "Como o next/image funciona internamente e quais propriedades são obrigatórias?",
        a: "<p><code>next/image</code> é um componente que combina três otimizações:</p><ol><li><strong>Conversão de formato</strong>: converte para WebP ou AVIF baseado no Accept header do browser — menor tamanho de arquivo.</li><li><strong>Redimensionamento responsivo</strong>: gera múltiplos tamanhos (srcset) baseado na prop <code>sizes</code> — browser baixa o tamanho certo para a tela.</li><li><strong>Reserva de espaço</strong>: exige <code>width</code> e <code>height</code> (ou <code>fill</code>) para reservar o espaço antes da imagem carregar — elimina CLS (Cumulative Layout Shift).</li></ol><p><strong>Propriedades importantes:</strong></p><ul><li><code>src</code>: URL ou import estático</li><li><code>alt</code>: obrigatório para acessibilidade</li><li><code>width</code> e <code>height</code>: dimensões intrínsecas (ou <code>fill</code> para preencher container)</li><li><code>priority</code>: para imagens above-the-fold (desativa lazy loading, preload)</li><li><code>sizes</code>: hints de largura por breakpoint (afeta o srcset gerado)</li></ul><p>Para imagens dinâmicas de domínios externos: configurar <code>images.remotePatterns</code> no <code>next.config.mjs</code>. O Next.js faz proxy da otimização pelo servidor.</p>",
        tip: "Explicar que <code>priority</code> na imagem do hero/banner é crítico para LCP — é o impacto de performance mais direto e frequentemente esquecido.",
        level: "pleno",
      },
      {
        q: "Como o next/font melhora Core Web Vitals e como configurar Google Fonts corretamente?",
        a: "<p><code>next/font</code> elimina requests externas a fonts.googleapis.com em produção — as fontes são baixadas em build time e servidas como assets estáticos do próprio servidor.</p><p><strong>Como configura e por que importa para CWV:</strong></p><pre><code>// app/layout.tsx\nimport { Inter, JetBrains_Mono } from 'next/font/google'\n\nconst inter = Inter({\n  subsets: ['latin'],\n  display: 'swap',   // font-display: swap — evita texto invisível\n  variable: '--font-inter', // CSS variable para Tailwind\n})\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    &lt;html lang=\"pt-BR\" className={inter.variable}&gt;\n      &lt;body&gt;{children}&lt;/body&gt;\n    &lt;/html&gt;\n  )\n}</code></pre><p><strong>Impacto em CWV:</strong></p><ul><li><strong>CLS (Cumulative Layout Shift)</strong>: aplica <code>size-adjust</code> na fonte fallback para que ela ocupe o mesmo espaço da fonte real — eliminando o layout shift quando a fonte carrega.</li><li><strong>LCP</strong>: sem request bloqueante para fonts.googleapis.com — a fonte começa a carregar junto com os outros assets.</li><li><strong>FID/INP</strong>: sem preload de terceiro — uma request a menos bloqueia o main thread.</li></ul>",
        tip: "O <code>size-adjust</code> automático na font fallback é o detalhe técnico que demonstra conhecimento profundo — a maioria não sabe que o Next.js faz isso automaticamente.",
        level: "pleno",
      },
      {
        q: "Como funciona o Pages Router vs App Router em coexistência e como migrar incrementalmente?",
        a: "<p>O Next.js suporta <code>pages/</code> e <code>app/</code> simultaneamente no mesmo projeto. Isso permite migração incremental — rota a rota — sem big bang rewrite.</p><p><strong>Regra de prioridade:</strong> se a mesma rota existir em <code>app/</code> e <code>pages/</code>, o App Router tem precedência. Durante a migração, você move rotas uma por vez.</p><p><strong>Estratégia recomendada:</strong></p><ol><li>Comece pelo <code>app/layout.tsx</code> raiz — substitui <code>_app.tsx</code> e <code>_document.tsx</code></li><li>Mova rotas simples primeiro (sem getServerSideProps — SSG puro)</li><li>Migre rotas com data fetching: <code>getStaticProps</code> → <code>async</code> Server Component com <code>fetch()</code></li><li>Migre rotas com <code>getServerSideProps</code> → <code>cookies()</code>/<code>headers()</code> + <code>fetch({ cache: 'no-store' })</code></li><li>Migre API Routes para Route Handlers por último</li></ol><p>Armadilhas da coexistência: <code>useRouter()</code> do <code>next/router</code> (Pages) vs <code>next/navigation</code> (App) são diferentes — importar o errado causa erro silencioso. O <code>next/navigation</code> não funciona em Pages Router.</p>",
        tip: "Mencionar que <code>useRouter</code> muda de <code>next/router</code> para <code>next/navigation</code> é o gotcha mais comum na migração. Quem migrou um projeto real sabe disso.",
        level: "senior",
      },
      {
        q: "Como funciona o prefetching de rotas no Next.js e quando desabilitar?",
        a: "<p>O Next.js faz prefetch automático de rotas quando um <code>&lt;Link&gt;</code> entra no viewport. No App Router, isso baixa o RSC payload (não o HTML completo) da rota de destino, armazenando no Router Cache. Na navegação, o conteúdo já está disponível — zero latência perceptível.</p><p><strong>Como funciona por router:</strong></p><ul><li><strong>App Router</strong>: prefetch baixa o RSC payload dos layouts compartilhados. Segmentos de loading.tsx são incluídos para UI instantânea enquanto o restante carrega.</li><li><strong>Pages Router</strong>: prefetch baixa o JavaScript da página de destino (bundle splitting).</li></ul><p><strong>Quando desabilitar:</strong></p><pre><code>&lt;Link href=\"/heavy-page\" prefetch={false}&gt;\n  Ir para página pesada\n&lt;/Link&gt;</code></pre><p>Desabilite quando: (1) a rota de destino tem data fetching muito custoso e você não quer pré-executar no servidor para cada usuário que passa o mouse; (2) listas longas de links — prefetch de centenas de rotas simultâneas pode sobrecarregar; (3) rotas atrás de autenticação onde o prefetch retornaria 401.</p>",
        tip: "A pergunta sobre prefetch é frequente em otimização de performance. Saber quando desabilitar (lista longa de links, rotas custosas) demonstra pensamento de produção, não apenas conhecimento da feature.",
        level: "senior",
      },
    ],
    mnemonics: [
      {
        trick: "SSIC",
        label: "As 4 rendering strategies do Next.js",
        explanation: "S = Static (SSG) — gerado em build, serve do CDN. S = Server (SSR) — gerado por request, usa cookies/headers. I = Incremental (ISR) — SSG com revalidação periódica em background. C = Client (CSR) — renderizado no browser, sem SEO. Lembre: 'Slow Server Is Client' — do mais rápido ao mais interativo.",
      },
      {
        trick: "D-F-R-R",
        label: "As 4 camadas de cache do App Router",
        explanation: "D = Deduplication (Request Memoization) — deduplication numa request. F = Fetch cache (Data Cache) — persiste entre requests. R = Route cache (Full Route Cache) — HTML+RSC em build. R = Router cache — client-side, sessão do browser. 'Do Fetch Ao Route'.",
      },
      {
        trick: "PUSH",
        label: "Quando usar 'use client'",
        explanation: "P = Props interativas (onClick, onChange). U = useEffect/useState/hooks. S = Session/cookies do browser. H = HTML APIs (window, document, localStorage). Se o componente usa qualquer um desses, precisa de 'use client'. Caso contrário, mantenha como Server Component.",
      },
    ],
    cheatsheet: {
      title: "Next.js App Router — Referência Rápida",
      html: `<style>
.njc-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.njc-section{margin-bottom:18px}
.njc-title{font-size:9px;color:#e2e8f0;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid #1e293b}
.njc-table{width:100%;border-collapse:collapse;font-size:10.5px}
.njc-table th{color:#475569;font-weight:500;text-align:left;padding:4px 8px;border-bottom:1px solid #1e293b}
.njc-table td{padding:5px 8px;border-bottom:1px solid #0f172a;vertical-align:top}
.njc-table tr:hover td{background:#1e293b}
.njc-name{color:#4ade80}
.njc-code{color:#94a3b8;font-size:10px}
.njc-note{color:#475569;font-size:10px}
</style>
<div class="njc-wrap">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 18px">Next.js App Router — Referência Rápida</p>
  <div class="njc-section">
    <div class="njc-title">Arquivos especiais do App Router</div>
    <table class="njc-table">
      <tr><th>Arquivo</th><th>Propósito</th></tr>
      <tr><td class="njc-name">page.tsx</td><td class="njc-code">Rota — renderiza a UI da URL</td></tr>
      <tr><td class="njc-name">layout.tsx</td><td class="njc-code">UI persistente entre navegações no segmento</td></tr>
      <tr><td class="njc-name">template.tsx</td><td class="njc-code">Como layout, mas recriado em cada navegação</td></tr>
      <tr><td class="njc-name">loading.tsx</td><td class="njc-code">Skeleton/fallback enquanto page.tsx carrega</td></tr>
      <tr><td class="njc-name">error.tsx</td><td class="njc-code">UI de erro ('use client' obrigatório)</td></tr>
      <tr><td class="njc-name">not-found.tsx</td><td class="njc-code">UI quando notFound() é chamado</td></tr>
      <tr><td class="njc-name">route.ts</td><td class="njc-code">Route Handler — API endpoint HTTP</td></tr>
      <tr><td class="njc-name">middleware.ts</td><td class="njc-code">Roda antes de toda request (Edge Runtime)</td></tr>
    </table>
  </div>
  <div class="njc-section">
    <div class="njc-title">Rendering strategies — inferência automática</div>
    <table class="njc-table">
      <tr><th>O que a rota usa</th><th>Estratégia inferida</th></tr>
      <tr><td class="njc-name">Nada dinâmico</td><td class="njc-code">SSG — gerado em build</td></tr>
      <tr><td class="njc-name">export const revalidate = N</td><td class="njc-code">ISR — revalida a cada N segundos</td></tr>
      <tr><td class="njc-name">cookies() / headers()</td><td class="njc-code">SSR — gerado por request</td></tr>
      <tr><td class="njc-name">cache: 'no-store'</td><td class="njc-code">SSR — sem cache de data</td></tr>
      <tr><td class="njc-name">'use client' + fetch no browser</td><td class="njc-code">CSR — renderizado no browser</td></tr>
    </table>
  </div>
  <div class="njc-section">
    <div class="njc-title">Cache — invalidação</div>
    <table class="njc-table">
      <tr><th>Função</th><th>O que invalida</th></tr>
      <tr><td class="njc-name">revalidatePath('/posts')</td><td class="njc-code">Full Route Cache + Data Cache da rota</td></tr>
      <tr><td class="njc-name">revalidateTag('posts')</td><td class="njc-code">Todos os fetches com { next: { tags: ['posts'] } }</td></tr>
      <tr><td class="njc-name">router.refresh()</td><td class="njc-code">Router Cache (client-side) da rota atual</td></tr>
      <tr><td class="njc-name">cache: 'no-store'</td><td class="njc-code">Opt-out do Data Cache por fetch</td></tr>
    </table>
  </div>
  <div class="njc-section">
    <div class="njc-title">Variáveis de ambiente</div>
    <table class="njc-table">
      <tr><th>Prefixo</th><th>Disponível em</th></tr>
      <tr><td class="njc-name">NEXT_PUBLIC_*</td><td class="njc-code">Browser + servidor (exposta no bundle)</td></tr>
      <tr><td class="njc-name">Sem prefixo</td><td class="njc-code">Somente no servidor — nunca chega ao cliente</td></tr>
    </table>
  </div>
  <div class="njc-section">
    <div class="njc-title">Imports essenciais — App Router</div>
    <table class="njc-table">
      <tr><th>Hook/função</th><th>De onde importar</th></tr>
      <tr><td class="njc-name">useRouter, usePathname, useParams</td><td class="njc-code">next/navigation (App Router)</td></tr>
      <tr><td class="njc-name">cookies, headers</td><td class="njc-code">next/headers (Server Component)</td></tr>
      <tr><td class="njc-name">notFound, redirect</td><td class="njc-code">next/navigation (Server Component)</td></tr>
      <tr><td class="njc-name">Image</td><td class="njc-code">next/image</td></tr>
      <tr><td class="njc-name">Link</td><td class="njc-code">next/link</td></tr>
    </table>
  </div>
</div>`,
    },
    mindmap: {
      title: "Next.js App Router — Mapa mental",
      html: `<style>
.njm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.njm-center{background:#1a2a1a;border:2px solid #4ade80;border-radius:10px;padding:10px 18px;text-align:center;font-weight:700;font-size:13px;color:#4ade80;display:inline-block}
.njm-node{background:#1e293b;border:1.5px solid #334155;border-radius:7px;padding:6px 12px;font-size:11px;color:#94a3b8;cursor:default;margin-bottom:5px}
.njm-node:hover{border-color:#4ade80;color:#e2e8f0}
.njm-label{font-size:9px;color:#4ade80;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:6px}
.njm-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:start}
.njm-col{display:flex;flex-direction:column;gap:12px}
</style>
<div class="njm-wrap">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 20px">Next.js App Router — Mapa de Conceitos</p>
  <div class="njm-grid">
    <div class="njm-col">
      <div>
        <div class="njm-label">Rendering</div>
        <div class="njm-node">SSG — build time, CDN</div>
        <div class="njm-node">ISR — revalidate periódico</div>
        <div class="njm-node">SSR — por request, cookies</div>
        <div class="njm-node">CSR — browser, 'use client'</div>
      </div>
      <div>
        <div class="njm-label">Arquivos especiais</div>
        <div class="njm-node">page.tsx — UI da rota</div>
        <div class="njm-node">layout.tsx — UI persistente</div>
        <div class="njm-node">loading.tsx — Suspense fallback</div>
        <div class="njm-node">error.tsx — captura erros</div>
        <div class="njm-node">route.ts — API endpoint</div>
      </div>
      <div>
        <div class="njm-label">Organização</div>
        <div class="njm-node">(group) — Route Groups</div>
        <div class="njm-node">_folder — sem rota</div>
        <div class="njm-node">@slot — Parallel Routes</div>
        <div class="njm-node">(.)rota — Intercepting</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;justify-content:center">
      <div class="njm-center">Next.js<br><span style="font-size:10px;opacity:.7">App Router</span></div>
    </div>
    <div class="njm-col">
      <div>
        <div class="njm-label">Cache (4 camadas)</div>
        <div class="njm-node">Request Memoization — 1 request</div>
        <div class="njm-node">Data Cache — persiste entre requests</div>
        <div class="njm-node">Full Route Cache — HTML em build</div>
        <div class="njm-node">Router Cache — client, sessão</div>
      </div>
      <div>
        <div class="njm-label">Data &amp; mutations</div>
        <div class="njm-node">fetch() em Server Component</div>
        <div class="njm-node">Server Actions ('use server')</div>
        <div class="njm-node">revalidatePath / revalidateTag</div>
        <div class="njm-node">Route Handlers para APIs públicas</div>
      </div>
      <div>
        <div class="njm-label">Otimizações</div>
        <div class="njm-node">next/image — WebP + srcset</div>
        <div class="njm-node">next/font — self-hosted fonts</div>
        <div class="njm-node">next/dynamic — code splitting</div>
        <div class="njm-node">Middleware — Edge Runtime</div>
      </div>
    </div>
  </div>
</div>`,
      caption: "Visão geral do Next.js App Router — rendering strategies, arquivos especiais, cache em 4 camadas e otimizações automáticas.",
    },
    exercises: [
      {
        level: "iniciante",
        title: "Criar um blog estático com App Router",
        description: "Crie um blog com Next.js App Router: página inicial listando posts, página de detalhe [slug]/page.tsx. Use um array de objetos como data source (sem banco). Todos os componentes devem ser Server Components. Gere as páginas de detalhe estaticamente com generateStaticParams.",
        concepts: ["Server Components", "SSG", "generateStaticParams", "layout.tsx", "page.tsx"],
        hint: "generateStaticParams retorna o array de slugs para geração estática. A rota [slug]/page.tsx recebe params.slug como prop.",
      },
      {
        level: "intermediario",
        title: "Dashboard com Server Actions e revalidação",
        description: "Crie um dashboard com lista de tarefas. Server Component busca as tarefas. Client Component tem formulário para criar nova tarefa usando Server Action. Após criar, a lista deve atualizar sem reload — use revalidatePath. Adicione loading.tsx como skeleton e error.tsx para erros de rede.",
        concepts: ["Server Actions", "revalidatePath", "loading.tsx", "error.tsx", "useFormStatus"],
        hint: "O formulário usa action={serverAction}. useFormStatus() (de react-dom) dá acesso ao estado pending sem state manual.",
      },
      {
        level: "senior",
        title: "Implementar autenticação com Middleware e Route Groups",
        description: "Organize o projeto com Route Groups: (public) sem auth e (dashboard) com auth. Crie Middleware que verifica o cookie de sessão e redireciona para /login se a rota /dashboard/* for acessada sem sessão. Use Server Actions para login/logout. Garanta que Server Actions dentro do dashboard validem a sessão independentemente do Middleware.",
        concepts: ["Middleware", "Route Groups", "Server Actions", "cookies", "auth pattern"],
        hint: "O Middleware protege as rotas no nível de HTTP. A validação nas Server Actions é a segunda linha de defesa — sempre valide nos dois lugares.",
      },
    ],
    videos: [
      { title: "Next.js 14 Full Course", channel: "Traversy Media", url: "", topic: "Next.js 14 com App Router do zero ao deploy" },
      { title: "Next.js App Router: The Good, The Bad, The Ugly", channel: "Theo - t3.gg", url: "", topic: "Análise honesta do App Router em produção" },
      { title: "Server Actions Are Here", channel: "Vercel", url: "", topic: "Server Actions em profundidade com exemplos reais" },
      { title: "Next.js Caching Explained", channel: "Fireship", url: "", topic: "As 4 camadas de cache do App Router explicadas" },
      { title: "I Fixed My Next.js App Performance", channel: "Lee Robinson", url: "", topic: "Otimizações de performance com next/image, font e streaming" },
    ],
    codeExamples: [
      {
        title: "Composição Server + Client Component correta",
        description: "Padrão fundamental: Server Component busca dados, Client Component cuida da interatividade. Server Component pode ser passado como children.",
        language: "tsx",
        code: `// app/posts/page.tsx — Server Component
import { PostList } from './_components/PostList'
import { CreatePostButton } from './_components/CreatePostButton'
import { db } from '@/lib/db'

export default async function PostsPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    // CreatePostButton é Client Component com estado de modal
    // PostList é Server Component renderizado como children
    <CreatePostButton>
      <PostList posts={posts} />
    </CreatePostButton>
  )
}

// app/posts/_components/CreatePostButton.tsx — Client Component
'use client'
import { useState } from 'react'

export function CreatePostButton({ children }: { children: React.ReactNode }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Criar post</button>
      {showForm && <CreatePostForm onClose={() => setShowForm(false)} />}
      {children}  {/* Server Component renderizado aqui — sem virar Client */}
    </div>
  )
}`,
      },
      {
        title: "Server Action com validação Zod e revalidação",
        description: "Server Action completa: autenticação, validação, persistência e revalidação de cache.",
        language: "typescript",
        code: `// app/actions/post.ts
'use server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const createPostSchema = z.object({
  title:   z.string().min(3, 'Mínimo 3 caracteres').max(100),
  content: z.string().min(10, 'Mínimo 10 caracteres'),
})

export async function createPost(formData: FormData) {
  // 1. Autenticação
  const session = await auth()
  if (!session) return { error: 'Não autenticado' }

  // 2. Validação
  const result = createPostSchema.safeParse({
    title:   formData.get('title'),
    content: formData.get('content'),
  })
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // 3. Persistência
  try {
    const post = await db.post.create({
      data: { ...result.data, authorId: session.user.id },
    })
    // 4. Invalidação de cache
    revalidatePath('/posts')
    return { success: true, postId: post.id }
  } catch {
    return { error: 'Erro ao criar post. Tente novamente.' }
  }
}`,
      },
      {
        title: "Middleware de autenticação com Route Groups",
        description: "Proteger rotas automaticamente via Middleware — centralizado, sem código de proteção nos componentes.",
        language: "typescript",
        code: `// middleware.ts (raiz do projeto)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas — não verificar
  const publicRoutes = ['/login', '/register', '/api/auth']
  if (publicRoutes.some(r => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  // Verificar sessão via cookie
  const token = request.cookies.get('session')?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const payload = await verifyJWT(token)
    // Passar userId para Server Components via header
    const response = NextResponse.next()
    response.headers.set('x-user-id', payload.userId)
    return response
  } catch {
    // Token inválido
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('session')
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}`,
      },
    ],
    resources: [
      { title: "Next.js docs", url: "https://nextjs.org/docs", kind: "docs" },
      { title: "Next.js App Router tutorial", url: "https://nextjs.org/learn", kind: "curso" },
      { title: "Next.js caching — documentação completa", url: "https://nextjs.org/docs/app/building-your-application/caching", kind: "docs" },
      { title: "Vercel — Next.js Conf talks", url: "https://nextjs.org/conf", kind: "video" },
      { title: "Josh Comeau — Joy of React + Next.js", url: "https://www.joyofreact.com/", kind: "curso" },
      { title: "Dominik D. — Practical React Query", url: "https://tkdodo.eu/blog/practical-react-query", kind: "artigo" },
    ],
}

export default nextJs
