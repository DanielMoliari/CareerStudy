import type { SkillContent } from '@/types'

const serverComponentsRsc: SkillContent = {
    tagline: "Componentes React que rodam no servidor: zero JS cliente, acesso direto a recursos.",
    why: "RSC é a mudança mais significativa no React desde hooks. Entender o modelo mental (servidor vs cliente), quando usar cada um, e como evitar pitfalls é requisito em vaga Next.js sênior 2024+.",
    summary: "React Server Components (RSC) rodam exclusivamente no servidor. São renderizados para um formato especial (RSC payload) que o cliente usa para montar o DOM. Podem fazer fetch direto de banco, ler arquivos, usar secrets. Não enviam JS ao cliente. Client Components ('use client') são os tradicionais — interativos, com state e event handlers.",
    keypoints: [
      { title: "Server vs Client Component", body: "Server Component: sem 'use client', roda no servidor, pode acessar DB/FS/env, sem state/events, zero JS ao cliente. Client Component: 'use client' no topo, roda no browser (e também no servidor na hidratação), pode usar state/effects/events.", code: `// Server Component (default no App Router)
async function UserPage({ params }) {
  const user = await db.user.findUnique({ where: { id: params.id } })
  return <UserProfile user={user} />  // zero JS ao cliente
}

// Client Component
'use client'
function Counter() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n+1)}>{n}</button>
}` },
      { title: "Composição correta", body: "Server Components podem passar Client Components como children ou props. Client Components NÃO podem importar Server Components — mas podem recebê-los como children (padrão de composição recomendado).", code: `// ✓ Correto: Server Component envolve Client
// page.tsx (Server)
export default function Page() {
  return (
    <Shell>            {/* Client Component */}
      <DataTable />    {/* Server Component como children */}
    </Shell>
  )
}

// ✗ Errado: Client importando Server
'use client'
import { ServerComp } from './server' // erro!` },
      { title: "Streaming e Suspense", body: "Server Components suportam streaming: enviam HTML incrementalmente ao browser conforme ficam prontos. Suspense boundary mostra fallback enquanto componentes carregam. Melhora Time To First Byte sem bloquear a página toda.", code: `export default function Page() {
  return (
    <>
      <Header />          {/* imediato */}
      <Suspense fallback={<Skeleton />}>
        <SlowDataTable /> {/* streamado quando pronto */}
      </Suspense>
    </>
  )
}` },
      { title: "Data fetching direto", body: "Faça fetch diretamente em Server Components — sem useEffect, sem useState. Múltiplos fetches em paralelo com Promise.all. Next.js deduplica fetches idênticos na mesma request (request memoization).", code: `async function Page() {
  // fetches em paralelo
  const [user, posts] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    db.post.findMany({ where: { published: true } }),
  ])
  return <Layout user={user} posts={posts} />
}` },
      { title: "Server Actions", body: "Funções marcadas com 'use server' que rodam no servidor e são chamadas do cliente via RPC. Permitem mutations (forms, updates) sem criar endpoint de API separado. Integram com formulários HTML nativamente.", code: `'use server'
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  await db.post.create({ data: { title } })
  revalidatePath('/posts')
}

// No Client Component:
<form action={createPost}>
  <input name="title" />
  <button type="submit">Criar</button>
</form>` },
    ],
    interview: [
      {
        q: "Qual a diferença entre Server Component e Client Component?",
        a: "<p><strong>Server Component</strong>: roda apenas no servidor. Zero JavaScript enviado ao browser. Pode acessar banco de dados, filesystem, variáveis de ambiente diretamente. Não pode usar state (useState), efeitos (useEffect) ou eventos do browser (onClick).</p><p><strong>Client Component</strong>: marcado com 'use client'. Roda no browser (e também no servidor durante hidratação — em ambos). Pode usar toda a API React: hooks, eventos, browser APIs.</p><p>No App Router do Next.js, todos os componentes são Server Components por padrão — você opta para Client com 'use client'.</p>",
        tip: "A pegadinha: 'use client' não impede o componente de rodar no servidor durante SSR/hidratação — ele roda nos dois lugares. Mencionar isso é diferencial claro.",
        level: "pleno",
      },
      {
        q: "Por que 'use client' infecta a árvore de componentes?",
        a: "<p>Quando você marca um componente com 'use client', todos os componentes importados por ele também se tornam Client Components — mesmo sem terem a diretiva. Isso acontece porque o bundle do cliente precisa incluir tudo que o componente pode precisar renderizar.</p><p>Padrão correto: empurre 'use client' para as folhas da árvore. Mantenha componentes de dados e layout como Server Components. Componentes interativos (botões, forms, menus) ficam como Client nos seus próprios arquivos.</p>",
        tip: "A solução de passar Server Components como children (children prop) para um Client Component shell é o padrão avançado que diferencia sênior.",
        level: "senior",
      },
      {
        q: "Como você faz data fetching em Server Components?",
        a: "<p>Diretamente — sem useEffect, sem useState. Server Components podem ser async functions que aguardam fetches ou queries ao banco.</p><p>Para fetches em paralelo: Promise.all evita waterfalls sequenciais. Next.js deduplica fetches idênticos na mesma request (request memoization) — dois Server Components fazendo o mesmo fetch recebem a mesma resposta sem duplo hit de rede.</p><p>Benefício principal: zero round trip cliente-servidor. Os dados chegam no HTML inicial — sem loading state visível ao usuário.</p>",
        level: "pleno",
      },
      {
        q: "Quando usar Server Actions vs API Routes?",
        a: "<p><strong>Server Actions</strong>: mutations internas do app (criar post, atualizar perfil, deletar item). Integram com formulários HTML nativamente. Auth via cookies automático. Não expostas como endpoint público.</p><p><strong>API Routes</strong>: endpoints HTTP públicos consumidos por clientes externos (mobile app, terceiros, webhooks). Precisam de acesso público. Server Actions não servem para webhooks (Stripe, GitHub) porque requerem contexto Next.js.</p>",
        level: "senior",
      },
      {
        q: "O que é streaming com React Server Components?",
        a: "<p>Ao invés de aguardar todos os dados antes de enviar HTML, o servidor envia HTML incrementalmente conforme cada parte fica pronta. O browser renderiza progressivamente.</p><p>Implementação: envolva componentes lentos em Suspense. O fallback (skeleton) aparece imediatamente no HTML. Quando o dado chega, o chunk de HTML do componente real é enviado e substitui o skeleton — sem re-fetch no cliente.</p><p>Impacto: TTFB melhora, o usuário vê conteúdo progressivamente ao invés de página em branco aguardando todos os dados.</p>",
        tip: "A distinção de que o HTML do componente real é streamado — não há fetch no cliente depois — é o que a maioria não sabe explicar.",
        level: "senior",
      },
      {
        q: "Dados sensíveis (API keys) estão seguros em Server Components?",
        a: "<p>Sim, desde que não sejam passados como props para Client Components. Server Components nunca enviam seu código ou dados internos ao browser — apenas o HTML/RSC payload renderizado.</p><p>Mas cuidado: se você passa process.env.SECRET_KEY como prop para um Client Component, esse valor vai aparecer no payload enviado ao browser. Use bibliotecas como 'server-only' para garantir que módulos com secrets não sejam importados por Client Components acidentalmente.</p>",
        level: "pleno",
      },
    ],
    diagrams: [
      {
        title: "Server vs Client Component — o que roda onde",
        html: `<style>
.rsc-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.rsc-col{background:#1e293b;border-radius:10px;padding:14px 16px;border:1.5px solid #334155;flex:1}
.rsc-tag{display:inline-block;font-size:10px;padding:2px 7px;border-radius:4px;margin-bottom:4px}
.rsc-row{display:flex;align-items:center;gap:6px;font-size:11px;color:#94a3b8;margin-bottom:6px}
.rsc-chk{color:#4ade80;font-size:13px}
.rsc-x{color:#ef4444;font-size:13px}
</style>
<div class="rsc-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">React Server Components — o que cada lado pode fazer</p>
  <div style="display:flex;gap:10px;margin-bottom:12px">
    <div class="rsc-col">
      <div style="font-size:9px;color:#4ade80;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px">Server Component</div>
      <div><span class="rsc-tag" style="background:#1c3a2a;color:#4ade80">padrão no App Router</span></div>
      <br>
      <div class="rsc-row"><span class="rsc-chk">✓</span> Acessar banco de dados</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> Ler variáveis de ambiente</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> Ler filesystem</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> Zero JS enviado ao browser</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> Async functions nativas</div>
      <br>
      <div class="rsc-row"><span class="rsc-x">✗</span> useState / useReducer</div>
      <div class="rsc-row"><span class="rsc-x">✗</span> useEffect / useRef</div>
      <div class="rsc-row"><span class="rsc-x">✗</span> onClick, onChange, eventos</div>
      <div class="rsc-row"><span class="rsc-x">✗</span> window, localStorage, document</div>
    </div>
    <div class="rsc-col">
      <div style="font-size:9px;color:#38bdf8;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px">Client Component ('use client')</div>
      <div><span class="rsc-tag" style="background:#0c2a3a;color:#38bdf8">roda no browser + servidor (SSR)</span></div>
      <br>
      <div class="rsc-row"><span class="rsc-chk">✓</span> useState, useReducer, hooks</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> useEffect, useRef, useContext</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> onClick, onChange, eventos</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> window, localStorage, document</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> Receber Server Components via children</div>
      <br>
      <div class="rsc-row"><span class="rsc-x">✗</span> Importar Server Components diretamente</div>
      <div class="rsc-row"><span class="rsc-x">✗</span> Acessar banco/secrets diretamente</div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:11px;color:#475569;line-height:1.8">
    <strong style="color:#94a3b8">Padrão de composição:</strong> Server Component envolve Client Component. Passe Server Components como <code style="color:#e2e8f0">children</code> para Client Components shell — assim a interatividade fica na borda e os dados ficam no servidor.
  </div>
</div>`,
        caption: "Server Components = dados + zero JS. Client Components = interatividade. Empurre 'use client' para as folhas da árvore.",
      },
    ],
    gotchas: [
      "'use client' infecta a árvore: todos os filhos de um Client Component são Client Components, mesmo sem a diretiva.",
      "Passar funções de servidor para cliente requer Server Actions. Não passe funções comuns como props para Client Components.",
      "Dados sensíveis (API keys) seguros em Server Components — nunca chegam ao cliente. Mas se você passar como prop para Client Component, vão.",
    ],
    resources: [
      { title: "React docs — Server Components", url: "https://react.dev/reference/rsc/server-components", kind: "docs" },
      { title: "Next.js — Server and Client Components", url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components", kind: "docs" },
      { title: "Josh Comeau — Making Sense of RSC", url: "https://www.joshwcomeau.com/react/server-components/", kind: "artigo" },
    ],
}

export default serverComponentsRsc
