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
    { title: "Composição correta", body: "Server Components podem passar Client Components como children ou props. Client Components NÃO podem importar Server Components — mas podem recebê-los como children (padrão de composição recomendado).", code: `// Correto: Server Component envolve Client
// page.tsx (Server)
export default function Page() {
  return (
    <Shell>            // Client Component
      <DataTable />    // Server Component como children
    </Shell>
  )
}` },
    { title: "Streaming e Suspense", body: "Server Components suportam streaming: enviam HTML incrementalmente ao browser conforme ficam prontos. Suspense boundary mostra fallback enquanto componentes carregam. Melhora Time To First Byte sem bloquear a página toda.", code: `export default function Page() {
  return (
    <>
      <Header />          // imediato
      <Suspense fallback={<Skeleton />}>
        <SlowDataTable /> // streamado quando pronto
      </Suspense>
    </>
  )
}` },
    { title: "Data fetching direto", body: "Faça fetch diretamente em Server Components — sem useEffect, sem useState. Múltiplos fetches em paralelo com Promise.all. Next.js deduplica fetches idênticos na mesma request (request memoization).", code: `async function Page() {
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
      a: "<p><strong>Server Component</strong>: roda apenas no servidor. Zero JavaScript enviado ao browser. Pode acessar banco de dados, filesystem, variáveis de ambiente diretamente. Não pode usar state (useState), efeitos (useEffect) ou eventos do browser (onClick).</p><p><strong>Client Component</strong>: marcado com <code>'use client'</code>. Roda no browser (e também no servidor durante hidratação — em ambos). Pode usar toda a API React: hooks, eventos, browser APIs.</p><p>No App Router do Next.js, todos os componentes são Server Components por padrão — você opta para Client com <code>'use client'</code>.</p>",
      tip: "A pegadinha: 'use client' não impede o componente de rodar no servidor durante SSR/hidratação — ele roda nos dois lugares. Mencionar isso é diferencial claro.",
      level: "pleno",
    },
    {
      q: "Por que 'use client' infecta a árvore de componentes?",
      a: "<p>Quando você marca um componente com <code>'use client'</code>, todos os componentes <em>importados por ele</em> também se tornam Client Components — mesmo sem terem a diretiva. Isso acontece porque o bundle do cliente precisa incluir tudo que o componente pode precisar renderizar.</p><p>Padrão correto: empurre <code>'use client'</code> para as <strong>folhas</strong> da árvore. Mantenha componentes de dados e layout como Server Components. Componentes interativos (botões, forms, menus) ficam como Client nos seus próprios arquivos.</p>",
      tip: "A solução de passar Server Components como children (children prop) para um Client Component shell é o padrão avançado que diferencia sênior.",
      level: "senior",
    },
    {
      q: "Como você faz data fetching em Server Components?",
      a: "<p>Diretamente — sem useEffect, sem useState. Server Components podem ser <code>async functions</code> que aguardam fetches ou queries ao banco.</p><p>Para fetches em paralelo: <code>Promise.all</code> evita waterfalls sequenciais. Next.js deduplica fetches idênticos na mesma request (request memoization) — dois Server Components fazendo o mesmo fetch recebem a mesma resposta sem duplo hit de rede.</p><p>Benefício principal: zero round trip cliente-servidor. Os dados chegam no HTML inicial — sem loading state visível ao usuário.</p>",
      tip: "Mencionar request memoization (deduplicação automática de fetches) é o detalhe que diferencia quem leu a documentação profundamente.",
      level: "pleno",
    },
    {
      q: "Quando usar Server Actions vs API Routes?",
      a: "<p><strong>Server Actions</strong>: mutations internas do app (criar post, atualizar perfil, deletar item). Integram com formulários HTML nativamente. Auth via cookies automático. Não são endpoints públicos.</p><p><strong>API Routes</strong>: endpoints HTTP públicos consumidos por clientes externos (mobile app, terceiros, webhooks). Precisam de acesso público. Server Actions não servem para webhooks (Stripe, GitHub) porque requerem contexto Next.js.</p>",
      tip: "A distinção de que Server Actions não funcionam para webhooks externos (sem contexto Next.js) é um edge case importante que entrevistadores sênior adoram explorar.",
      level: "senior",
    },
    {
      q: "O que é streaming com React Server Components?",
      a: "<p>Ao invés de aguardar todos os dados antes de enviar HTML, o servidor envia HTML <strong>incrementalmente</strong> conforme cada parte fica pronta. O browser renderiza progressivamente.</p><p>Implementação: envolva componentes lentos em <code>Suspense</code>. O fallback (skeleton) aparece imediatamente no HTML. Quando o dado chega, o chunk de HTML do componente real é enviado e substitui o skeleton — sem re-fetch no cliente.</p><p>Impacto: TTFB melhora, o usuário vê conteúdo progressivamente ao invés de página em branco aguardando todos os dados.</p>",
      tip: "A distinção de que o HTML do componente real é streamado — não há fetch no cliente depois — é o que a maioria não sabe explicar.",
      level: "senior",
    },
    {
      q: "Dados sensíveis (API keys) estão seguros em Server Components?",
      a: "<p>Sim, desde que não sejam passados como props para Client Components. Server Components nunca enviam seu código ou dados internos ao browser — apenas o HTML/RSC payload renderizado.</p><p>Cuidado: se você passa <code>process.env.SECRET_KEY</code> como prop para um Client Component, esse valor vai aparecer no payload enviado ao browser. Use o pacote <code>server-only</code> para garantir que módulos com secrets não sejam importados por Client Components acidentalmente.</p>",
      tip: "Mencionar o pacote server-only como guard de importação — não só a teoria — mostra aplicação prática da segurança de RSC.",
      level: "pleno",
    },
    {
      q: "O que é o RSC payload e como funciona na hidratação?",
      a: "<p>Quando o servidor renderiza Server Components, ele produz um formato binário especial (RSC payload) — não HTML puro. Esse payload descreve a árvore de componentes de forma que o cliente pode usar para: (1) montar o DOM inicial sem re-executar lógica de Server Components; (2) hidratar Client Components com seus dados; (3) navegar com React sem full page reload (Client-side navigation).</p><p>Importante: o RSC payload não contém o código dos Server Components — apenas o resultado renderizado. O cliente nunca recebe a lógica de servidor.</p>",
      tip: "Explicar a diferença entre RSC payload e HTML estático é um nível de profundidade que poucas pessoas alcançam. Demonstra leitura da RFC e documentação interna do React.",
      level: "senior",
    },
    {
      q: "Como o padrão 'children prop' permite Server Components dentro de Client Components?",
      a: "<p>Client Components não podem <em>importar</em> Server Components — mas podem recebê-los como <code>children</code>. Isso funciona porque o React resolve os Server Components antes de passar para o Client Component — o Client só recebe o resultado já renderizado, não o componente em si.</p><pre><code>// Shell.tsx — Client Component\n'use client'\nexport function Shell({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(false)\n  return &lt;div&gt;{children}&lt;/div&gt;\n}\n\n// page.tsx — Server Component\nexport default function Page() {\n  return (\n    &lt;Shell&gt;\n      &lt;DataTable /&gt; {/* Server — OK como children */}\n    &lt;/Shell&gt;\n  )\n}</code></pre>",
      tip: "O padrão children para compor Server dentro de Client é O padrão de composição RSC. Demonstrar que você sabe por que funciona (React resolve Server antes) é o que distingue quem entende a internos.",
      level: "senior",
    },
    {
      q: "O que é revalidatePath e revalidateTag no contexto de RSC?",
      a: "<p>São funções do Next.js para invalidar o cache de dados após uma mutation:</p><ul><li><code>revalidatePath('/posts')</code>: revalida o cache de todas as requisições feitas na rota <code>/posts</code>. Na próxima visita, os dados são refetchados no servidor</li><li><code>revalidateTag('posts')</code>: revalida todos os fetches marcados com <code>fetch('/api', { next: { tags: ['posts'] } })</code> — mais granular</li></ul><p>Uso típico: dentro de Server Actions após criar/editar/deletar dados. Garante que a UI reflita o novo estado sem full page reload.</p>",
      tip: "revalidateTag vs revalidatePath: tag é mais granular (pode revalidar fetches específicos em múltiplas rotas); path é mais simples mas revalida tudo na rota. Saber a diferença é essencial para caching sofisticado.",
      level: "senior",
    },
    {
      q: "Como Server Actions lidam com validação e erros?",
      a: "<p>Server Actions não devem confiar cegamente nos dados do formulário — validação é obrigatória no servidor:</p><pre><code>'use server'\nimport { z } from 'zod'\n\nconst schema = z.object({ title: z.string().min(1).max(200) })\n\nexport async function createPost(formData: FormData) {\n  const parsed = schema.safeParse({\n    title: formData.get('title')\n  })\n  if (!parsed.success) {\n    return { error: parsed.error.flatten() }\n  }\n  await db.post.create({ data: parsed.data })\n  revalidatePath('/posts')\n}</code></pre><p>Para erros, retorne objetos serializáveis — não lance exceções (que chegam ao cliente como erros genéricos). Use o hook <code>useFormState</code> (React 19: <code>useActionState</code>) para capturar o retorno da action.</p>",
      tip: "Mostrar que Server Actions requerem validação server-side (não confiar no cliente) é um ponto de segurança importante. Citar Zod como a biblioteca de validação padrão é excelente.",
      level: "senior",
    },
    {
      q: "Qual a diferença entre SSR, SSG e RSC?",
      a: "<p><strong>SSR</strong> (Server-Side Rendering): renderiza o HTML no servidor a cada requisição. Pages Router com <code>getServerSideProps</code>. Componentes são Client Components renderizados no servidor na hidratação.</p><p><strong>SSG</strong> (Static Site Generation): HTML gerado em build time. Muito rápido — servido do CDN sem cálculo no request.</p><p><strong>RSC</strong>: paradigma diferente. Os componentes <em>vivem</em> no servidor permanentemente — não são hidratados no cliente. Podem ser combinados com SSR ou SSG. No App Router, por padrão os Server Components são renderizados no servidor a cada request (como SSR), mas podem ser cacheados.</p>",
      tip: "A distinção crucial: SSR é sobre quando o HTML é gerado; RSC é sobre onde o componente roda permanentemente. Um Server Component nunca chega ao bundle JS do cliente — um SSR component clássico sim.",
      level: "senior",
    },
    {
      q: "O que acontece quando você usa cookies ou headers em um Server Component?",
      a: "<p>Next.js expõe funções <code>cookies()</code> e <code>headers()</code> do pacote <code>next/headers</code> para ler cookies e headers da requisição atual em Server Components:</p><pre><code>import { cookies, headers } from 'next/headers'\n\nasync function Dashboard() {\n  const cookieStore = cookies()\n  const token = cookieStore.get('token')?.value\n  const userAgent = headers().get('user-agent')\n  // ...\n}</code></pre><p>Importante: usar <code>cookies()</code> ou <code>headers()</code> torna o componente dinâmico — Next.js desativa o cache da rota, pois o resultado depende do request. Use com consciência de performance.</p>",
      tip: "O detalhe de que cookies() e headers() tornam o componente dinâmico (opt-out do cache) é um trade-off de performance que sêniors precisam saber gerenciar.",
      level: "senior",
    },
    {
      q: "Como você protegeria uma Server Action contra CSRF?",
      a: "<p>Server Actions têm proteção CSRF embutida no Next.js: verificam o header <code>Origin</code> e o token CSRF do cookie <code>__Host-next-auth.csrf-token</code>. Requests de origens externas são bloqueados automaticamente.</p><p>Adicionalmente, sempre implemente verificação de autenticação manual no início de toda Server Action:</p><pre><code>'use server'\nimport { getServerSession } from 'next-auth'\n\nexport async function deletePost(id: string) {\n  const session = await getServerSession()\n  if (!session?.user) throw new Error('Não autorizado')\n  // verificar autorização além de autenticação\n  const post = await db.post.findUnique({ where: { id } })\n  if (post?.authorId !== session.user.id) throw new Error('Proibido')\n  await db.post.delete({ where: { id } })\n}</code></pre>",
      tip: "Mostrar que autenticação não é suficiente — é preciso verificar autorização (o usuário pode deletar ESSE post específico?) — é o que diferencia uma resposta de sênior sobre segurança.",
      level: "senior",
    },
    {
      q: "Como você faria cache de dados em Server Components?",
      a: "<p>Três mecanismos de cache no App Router:</p><ul><li><strong>fetch com revalidate</strong>: <code>fetch(url, { next: { revalidate: 3600 } })</code> — cache por 1 hora, ISR-like</li><li><strong>unstable_cache</strong>: wrapper para funções que não usam fetch (queries de ORM, cálculos):<br><code>const getCachedUser = unstable_cache(async (id) =&gt; db.user.findUnique(...), ['user'], { revalidate: 60 })</code></li><li><strong>React cache()</strong>: deduplica chamadas na mesma requisição (request memoization) — não persiste entre requests</li></ul><p>Estratégia: use revalidate para dados que mudam com baixa frequência, revalidateTag após mutations para invalidar seletivamente.</p>",
      tip: "A distinção entre React cache() (per-request memoization) e fetch com revalidate (cross-request cache) é um nível de detalhe que entrevistadores de Next.js sênior adoram explorar.",
      level: "senior",
    },
    {
      q: "O que é Partial Prerendering (PPR) e como se relaciona com RSC?",
      a: "<p>PPR combina SSG e RSC streaming na mesma rota: o shell estático (header, layout, conteúdo que não muda) é gerado em build time e servido instantaneamente do CDN. Partes dinâmicas (dados do usuário, feeds) são streamadas pelo servidor quando o cliente carrega.</p><p>Implementação: use <code>Suspense</code> para delimitar o que é dinâmico — o Next.js identifica automaticamente o que pode ser prerendered vs streamado. O shell chega em milissegundos; o conteúdo dinâmico substitui os skeletons via streaming.</p><p>Habilitado em Next.js 14+ com <code>experimental: { ppr: true }</code>.</p>",
      tip: "PPR é o futuro do rendering no Next.js. Mencioná-lo demonstra que você acompanha o roadmap do framework além da documentação estável.",
      level: "senior",
    },
    {
      q: "Como você testaria um Server Component?",
      a: "<p>Server Components são async functions que retornam JSX — testáveis diretamente:</p><pre><code>// __tests__/UserProfile.test.tsx\nimport { render } from '@testing-library/react'\nimport UserProfile from '../UserProfile'\n\n// Mock do banco\njest.mock('@/lib/db', () => ({\n  user: { findUnique: jest.fn().mockResolvedValue({ id: '1', name: 'Daniel' }) }\n}))\n\ntest('exibe nome do usuário', async () =&gt; {\n  const component = await UserProfile({ params: { id: '1' } })\n  const { getByText } = render(component)\n  expect(getByText('Daniel')).toBeInTheDocument()\n})</code></pre><p>Para integração: use Playwright para testar o comportamento end-to-end no browser real, onde SSR + hidratação acontece de verdade.</p>",
      tip: "O insight de que Server Components são apenas async functions — testáveis sem setup especial — é o que muitos não percebem porque estão acostumados a testar Client Components com hooks.",
      level: "senior",
    },
    {
      q: "O que é use server e quando usá-lo em um arquivo inteiro vs uma função?",
      a: "<p><code>'use server'</code> pode ser declarado em dois níveis:</p><ul><li><strong>Nível de arquivo</strong>: no topo do arquivo — todas as funções exportadas são Server Actions. Ideal para criar módulos de actions organizados por domínio (ex: <code>actions/posts.ts</code>)</li><li><strong>Nível de função</strong>: dentro do corpo de uma função — só aquela função é Server Action. Útil para definir actions dentro de Server Components sem criar arquivo separado</li></ul><p>Erro comum: declarar <code>'use server'</code> em um arquivo de Server Component que não é um módulo de actions — contamina o arquivo com lógica de mutation onde não deve estar.</p>",
      tip: "A distinção file-level vs function-level e quando cada um é adequado (módulo de actions vs action inline) demonstra organização de código além do básico.",
      level: "pleno",
    },
    {
      q: "O que são Shared Components e como se diferenciam de Server e Client Components?",
      a: "<p>Shared Components são componentes que não têm <code>'use client'</code> nem acesso a APIs exclusivas de servidor (banco, FS, cookies). Eles podem ser importados tanto por Server Components quanto por Client Components — o React decide onde renderizá-los baseado no contexto.</p><p>Exemplos: componentes de UI puros (Button, Card, Badge) que usam apenas props, sem state ou efeitos. São os candidatos ideais para ser Shared — podem ser otimizados como Server Components quando usados em Server context, e hidratados como Client quando usados em Client context.</p>",
      tip: "Muitos devs não sabem que existe essa categoria intermediária. Identificar quando um componente pode ser Shared (sem API exclusiva de nenhum lado) é uma habilidade de arquitetura.",
      level: "pleno",
    },
    {
      q: "Como você evitaria N+1 queries em Server Components?",
      a: "<p>N+1 em Server Components: um Server Component pai faz 1 query, depois cada filho faz sua própria query — resultando em N+1 hits de banco. Soluções:</p><ul><li><strong>DataLoader pattern</strong>: batching e deduplicação de queries (biblioteca <code>dataloader</code>)</li><li><strong>Fetch no pai e passar via props</strong>: um fetch com JOIN ou include de Prisma no componente pai, passando dados para os filhos — o mais simples</li><li><strong>React cache()</strong>: mesma query chamada em componentes distintos retorna o mesmo resultado na mesma requisição sem duplo hit</li><li><strong>Promise.all para fetches em paralelo</strong>: fetches independentes em paralelo, não sequenciais</li></ul>",
      tip: "React cache() como solução para N+1 sem precisar de DataLoader é um padrão específico do RSC que poucos conhecem — é o argumento mais forte para devs vindos de GraphQL.",
      level: "senior",
    },
    {
      q: "O que muda em Server Actions com React 19 / Next.js 15?",
      a: "<p>Mudanças principais no React 19 que afetam Server Actions:</p><ul><li><code>useFormState</code> → renomeado para <code>useActionState</code> — mesma funcionalidade, API simplificada</li><li><code>useFormStatus</code>: hook para acessar status do form pai (pending, data, method) sem prop drilling</li><li>Actions agora suportam updates otimistas com <code>useOptimistic</code> — UI atualiza imediatamente enquanto o servidor processa</li><li>Server Actions podem ser usadas em <code>startTransition</code> para manter UI responsiva durante submission</li></ul><p>No Next.js 15: caching de <code>fetch</code> deixou de ser default — é opt-in explícito para evitar confusão com dados desatualizados.</p>",
      tip: "Saber que o caching de fetch mudou de default em Next.js 15 (de automático para opt-in) é o tipo de atualização que demonstra que você acompanha o changelog, não só a documentação de versões antigas.",
      level: "senior",
    },
    {
      q: "Como você organizaria a estrutura de pastas de um projeto com RSC?",
      a: "<p>Organização recomendada para App Router com RSC:</p><ul><li><code>app/</code>: rotas — apenas Server Components por padrão. <code>page.tsx</code>, <code>layout.tsx</code>, <code>loading.tsx</code></li><li><code>components/</code>: componentes reutilizáveis. Subdividir em <code>components/ui/</code> (Shared Components) e <code>components/client/</code> (Client Components com 'use client')</li><li><code>actions/</code>: módulos de Server Actions por domínio (<code>actions/posts.ts</code>, <code>actions/users.ts</code>)</li><li><code>lib/</code>: utilitários de servidor (db, auth, cache). Adicionar <code>import 'server-only'</code> no topo para proteger</li><li><code>hooks/</code>: apenas custom hooks de Client Components</li></ul>",
      tip: "A sugestão de separar components/ui (Shared) de components/client (Client explícito) é uma convenção que escala bem e previne importar Client onde não é necessário.",
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
    {
      title: "Streaming com Suspense — como o HTML chega ao browser",
      html: `<style>
.rsc2-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.rsc2-row{display:flex;gap:10px;margin-bottom:8px;align-items:center}
.rsc2-time{font-size:10px;color:#475569;min-width:50px;text-align:right;font-family:'JetBrains Mono',monospace}
.rsc2-bar{height:36px;border-radius:6px;display:flex;align-items:center;padding:0 10px;font-size:11px;font-weight:600;flex:1}
.rsc2-label{font-size:10px;color:#64748b;font-weight:400;margin-left:8px}
.rsc2-arrow{color:#334155;margin:0 4px}
</style>
<div class="rsc2-wrap">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 4px">Streaming com Suspense — timeline</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Como o HTML é enviado progressivamente ao browser</p>
  <div class="rsc2-row">
    <div class="rsc2-time">0ms</div>
    <div class="rsc2-bar" style="background:#1c3a2a;color:#4ade80;flex:.3">
      Request
      <span class="rsc2-label">browser envia GET</span>
    </div>
  </div>
  <div class="rsc2-row">
    <div class="rsc2-time">~100ms</div>
    <div class="rsc2-bar" style="background:#1e293b;border:1px solid #334155;color:#e2e8f0;flex:.5">
      Shell HTML
      <span class="rsc2-label">header, nav, layout — sem dados</span>
    </div>
  </div>
  <div class="rsc2-row">
    <div class="rsc2-time">~100ms</div>
    <div class="rsc2-bar" style="background:#0c2a3a;color:#38bdf8;flex:.5">
      &lt;Suspense fallback&gt;
      <span class="rsc2-label">skeleton aparece no lugar dos dados</span>
    </div>
  </div>
  <div class="rsc2-row">
    <div class="rsc2-time">~800ms</div>
    <div class="rsc2-bar" style="background:#1c3a2a;color:#4ade80;flex:.8">
      Chunk HTML do componente real
      <span class="rsc2-label">dados prontos → substitui skeleton via script tag</span>
    </div>
  </div>
  <div class="rsc2-row">
    <div class="rsc2-time">~900ms</div>
    <div class="rsc2-bar" style="background:#2a1a0a;color:#fb923c;flex:1">
      Chunk HTML de componente mais lento
      <span class="rsc2-label">multiple Suspense boundaries streamam independentemente</span>
    </div>
  </div>
  <div style="margin-top:12px;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:10px;color:#475569;line-height:1.7">
    <strong style="color:#94a3b8">Por que é diferente de loading state no cliente:</strong> O HTML final dos componentes é streamado do servidor — não há fetch adicional no browser. O skeleton vem no HTML inicial; o componente real vem no mesmo stream HTTP (chunks), sem nova request.
  </div>
</div>`,
      caption: "Streaming: shell estático + skeleton chegam imediatamente. Dados pesados chegam em chunks no mesmo HTTP stream — sem fetch no cliente.",
    },
    {
      title: "Server Actions — fluxo de mutação sem API Route",
      html: `<style>
.rsc3-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.rsc3-flow{display:flex;align-items:center;gap:0;margin:12px 0;flex-wrap:wrap;gap:4px}
.rsc3-box{background:#1e293b;border-radius:8px;padding:8px 12px;font-size:11px;border:1px solid #334155;text-align:center;min-width:90px}
.rsc3-arr{color:#334155;font-size:18px;flex-shrink:0;margin:0 2px}
.rsc3-note{font-size:10px;color:#475569;margin-top:4px}
.rsc3-code{background:#0a0f1a;border-radius:6px;padding:10px 12px;font-size:10px;font-family:'JetBrains Mono',monospace;color:#e2e8f0;line-height:1.7;margin-top:12px}
.rsc3-kw{color:#38bdf8}.rsc3-str{color:#4ade80}.rsc3-fn{color:#fb923c}
</style>
<div class="rsc3-wrap">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">Server Actions — mutação sem endpoint de API</p>
  <div class="rsc3-flow">
    <div class="rsc3-box" style="border-color:#38bdf8;color:#38bdf8">
      Browser<br>
      <span class="rsc3-note">form submit / onClick</span>
    </div>
    <div class="rsc3-arr">→</div>
    <div class="rsc3-box">
      Next.js Runtime<br>
      <span class="rsc3-note">POST /action (interno)</span>
    </div>
    <div class="rsc3-arr">→</div>
    <div class="rsc3-box" style="border-color:#4ade80;color:#4ade80">
      Server Action<br>
      <span class="rsc3-note">valida + persiste</span>
    </div>
    <div class="rsc3-arr">→</div>
    <div class="rsc3-box">
      revalidatePath<br>
      <span class="rsc3-note">invalida cache</span>
    </div>
    <div class="rsc3-arr">→</div>
    <div class="rsc3-box" style="border-color:#4ade80;color:#4ade80">
      UI Atualizada<br>
      <span class="rsc3-note">novo RSC payload</span>
    </div>
  </div>
  <div class="rsc3-code">
<span class="rsc3-kw">'use server'</span>
<span class="rsc3-kw">import</span> { z } <span class="rsc3-kw">from</span> <span class="rsc3-str">'zod'</span>

<span class="rsc3-kw">export async function</span> <span class="rsc3-fn">createPost</span>(formData: FormData) {
  <span class="rsc3-kw">const</span> parsed = schema.safeParse({ title: formData.get(<span class="rsc3-str">'title'</span>) })
  <span class="rsc3-kw">if</span> (!parsed.success) <span class="rsc3-kw">return</span> { error: parsed.error.flatten() }
  <span class="rsc3-kw">await</span> db.post.create({ data: parsed.data })
  revalidatePath(<span class="rsc3-str">'/posts'</span>)  <span style="color:#475569">// invalida cache → UI refetch</span>
}
  </div>
  <div style="margin-top:10px;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:8px 12px;font-size:10px;color:#475569;line-height:1.7">
    <strong style="color:#94a3b8">vs API Route:</strong> Server Action é chamada via RPC interno — sem URL pública, sem CORS, auth via cookie automático. API Route expõe endpoint HTTP — use para integrações externas (webhooks, mobile, terceiros).
  </div>
</div>`,
      caption: "Server Actions: form → Next.js runtime → Server function → revalidatePath → UI atualizada. Sem endpoint público, sem configuração de CORS.",
    },
  ],

  mnemonics: [
    {
      label: "SCA — os 3 poderes do Server Component",
      trick: "SCA: Secrets, Cache, Async",
      explanation: "Server Components têm 3 superpoderes: S = Secrets (acesso a env vars, banco, FS sem expor ao cliente); C = zero Client JS (não envia bundle ao browser); A = Async nativo (pode ser async function com await direto). Se um componente usa algum desses 3, é candidato a Server Component.",
    },
    {
      label: "EIRS — quando usar Client Component",
      trick: "EIRS: Events, Interactive state, Refs, Side effects",
      explanation: "Use Client Component quando precisar de: E = Events (onClick, onChange); I = Interactive state (useState, useReducer, useContext); R = Refs (useRef, DOM direto); S = Side effects (useEffect, useLayoutEffect). Qualquer um desses: 'use client'.",
    },
    {
      label: "Regra da folha — onde fica 'use client'",
      trick: "'use client' vai nas folhas, não na raiz",
      explanation: "Empurre 'use client' o mais fundo possível na árvore de componentes — nos componentes interativos específicos (botão, input, menu). Nunca no layout, no Shell, no provider de dados. Quanto mais alto na árvore, mais JS você envia ao cliente desnecessariamente.",
    },
    {
      label: "Children trick — Server dentro de Client",
      trick: "Client não importa Server, mas aceita como children",
      explanation: "Client Component não pode ter 'import ServerComp' — mas pode receber Server Components como children prop. O React resolve o Server Component antes de passar para o Client. Analogia: você não pode entrar na cozinha (servidor), mas o garçom (React) traz o prato (componente resolvido) até você.",
    },
    {
      label: "RPC vs HTTP — Server Actions",
      trick: "Server Actions = RPC interno, API Routes = HTTP externo",
      explanation: "Server Actions são chamadas RPC (Remote Procedure Call) internas ao Next.js — sem URL pública, sem CORS, auth automática via cookie. Use para mutations internas (criar, editar, deletar). API Routes são endpoints HTTP públicos — use para webhooks externos, mobile apps, integrações de terceiros.",
    },
  ],

  cheatsheet: {
    title: "React Server Components — Cheatsheet completo",
    html: `<style>
.rsc-cs{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.rsc-cs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
.rsc-cs-col{background:#1e293b;border-radius:8px;padding:12px}
.rsc-cs-h{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #334155}
.rsc-cs-row{font-size:10px;color:#94a3b8;margin-bottom:4px;display:flex;gap:6px;align-items:baseline}
.rsc-cs-k{color:#e2e8f0;font-weight:600;flex-shrink:0;min-width:90px;font-size:9px;font-family:'JetBrains Mono',monospace}
.rsc-cs-code{background:#0a0f1a;border-radius:3px;padding:1px 5px;font-size:9px;font-family:'JetBrains Mono',monospace;color:#e2e8f0}
.rsc-cs-srv{color:#4ade80}.rsc-cs-cli{color:#38bdf8}.rsc-cs-act{color:#fb923c}
</style>
<div class="rsc-cs">
  <div style="font-size:13px;font-weight:700;margin-bottom:12px">React Server Components — Referência Rápida</div>
  <div class="rsc-cs-grid">
    <div class="rsc-cs-col">
      <div class="rsc-cs-h rsc-cs-srv">Server Component (padrão)</div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Pode</span> <span>async function, await, db, FS, env</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Não pode</span> <span>useState, useEffect, onClick, browser APIs</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">JS ao cliente</span> <span>Zero</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Caching</span> <span>fetch + next.revalidate, React cache(), unstable_cache</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Dinâmico</span> <span>cookies() ou headers() = opt-out do cache automático</span></div>
    </div>
    <div class="rsc-cs-col">
      <div class="rsc-cs-h rsc-cs-cli">Client Component ('use client')</div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Pode</span> <span>useState, useEffect, hooks, eventos, browser APIs</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Não pode</span> <span>importar Server Components</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Infecta</span> <span>todos os imports também viram Client</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Hydration</span> <span>roda no servidor (SSR) + browser</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Composição</span> <span>aceita Server como children prop</span></div>
    </div>
    <div class="rsc-cs-col">
      <div class="rsc-cs-h rsc-cs-act">Server Actions ('use server')</div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Chamada</span> <span>RPC interno — sem URL pública</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Auth</span> <span>cookie automático — verificar session manualmente</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">CSRF</span> <span>proteção embutida no Next.js</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Revalidar</span> <span>revalidatePath('/rota') ou revalidateTag('tag')</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">vs API Route</span> <span>interno; webhooks externos usam API Route</span></div>
    </div>
    <div class="rsc-cs-col">
      <div class="rsc-cs-h" style="color:#a78bfa">Streaming + Suspense</div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Como</span> <span>envolver componente lento em Suspense</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Fallback</span> <span>skeleton no HTML inicial — sem wait</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Chunk</span> <span>HTML streamado no mesmo HTTP connection</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">Benefício</span> <span>TTFB baixo + conteúdo progressivo</span></div>
      <div class="rsc-cs-row"><span class="rsc-cs-k">PPR</span> <span>shell estático do CDN + streams dinâmicos</span></div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:10px 14px;font-size:10px;color:#64748b;line-height:1.8">
    <strong style="color:#94a3b8">Antipadrões:</strong>
    <span style="margin-right:16px">✗ 'use client' no layout raiz</span>
    <span style="margin-right:16px">✗ Secrets como props para Client</span>
    <span style="margin-right:16px">✗ Server Action sem validação + auth</span>
    <span>✗ N+1 queries sem Promise.all ou React cache()</span>
  </div>
</div>`,
    caption: "Cheatsheet: Server Component (padrão, async, zero JS), Client Component ('use client', hooks, eventos), Server Actions (RPC, auth, revalidate), Streaming.",
  },

  mindmap: {
    title: "React Server Components — Mapa Mental",
    html: `<style>
.rsc-mm{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.rsc-mm-center{background:#61dafb;color:#0a2a33;border-radius:10px;padding:8px 18px;font-size:13px;font-weight:700;text-align:center;margin:0 auto 20px;width:fit-content}
.rsc-mm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.rsc-mm-branch{background:#1e293b;border-radius:8px;padding:12px;border-top:3px solid}
.rsc-mm-title{font-size:11px;font-weight:700;margin-bottom:8px}
.rsc-mm-item{font-size:10px;color:#64748b;margin-bottom:4px;padding-left:10px;position:relative}
.rsc-mm-item::before{content:'·';position:absolute;left:0;color:#475569}
.rsc-mm-sub{font-size:9px;color:#475569;margin-left:10px;padding-left:8px;position:relative}
.rsc-mm-sub::before{content:'→';position:absolute;left:0;color:#334155}
</style>
<div class="rsc-mm">
  <div class="rsc-mm-center">React Server Components</div>
  <div class="rsc-mm-grid">
    <div class="rsc-mm-branch" style="border-color:#4ade80">
      <div class="rsc-mm-title" style="color:#4ade80">Server Component</div>
      <div class="rsc-mm-item">Padrão no App Router</div>
      <div class="rsc-mm-item">Async function nativa</div>
      <div class="rsc-mm-item">Zero JS ao cliente</div>
      <div class="rsc-mm-item">Acesso direto</div>
      <div class="rsc-mm-sub">banco, FS, env, secrets</div>
      <div class="rsc-mm-item">Caching</div>
      <div class="rsc-mm-sub">fetch + revalidate</div>
      <div class="rsc-mm-sub">React cache() per-request</div>
      <div class="rsc-mm-sub">unstable_cache para ORM</div>
    </div>
    <div class="rsc-mm-branch" style="border-color:#38bdf8">
      <div class="rsc-mm-title" style="color:#38bdf8">Client Component</div>
      <div class="rsc-mm-item">'use client' no topo</div>
      <div class="rsc-mm-item">Hooks: useState, useEffect</div>
      <div class="rsc-mm-item">Eventos: onClick, onChange</div>
      <div class="rsc-mm-item">Browser APIs permitidas</div>
      <div class="rsc-mm-item">Infecta imports abaixo</div>
      <div class="rsc-mm-item">Recebe Server como children</div>
      <div class="rsc-mm-item">SSR + hydration no browser</div>
    </div>
    <div class="rsc-mm-branch" style="border-color:#fb923c">
      <div class="rsc-mm-title" style="color:#fb923c">Server Actions</div>
      <div class="rsc-mm-item">'use server' no topo ou função</div>
      <div class="rsc-mm-item">RPC interno — sem URL pública</div>
      <div class="rsc-mm-item">CSRF protection automático</div>
      <div class="rsc-mm-item">Usar em forms: action={'{'}action{'}'}</div>
      <div class="rsc-mm-item">Validar com Zod server-side</div>
      <div class="rsc-mm-item">revalidatePath / revalidateTag</div>
      <div class="rsc-mm-item">useActionState (React 19)</div>
    </div>
    <div class="rsc-mm-branch" style="border-color:#a78bfa">
      <div class="rsc-mm-title" style="color:#a78bfa">Streaming</div>
      <div class="rsc-mm-item">Suspense boundary</div>
      <div class="rsc-mm-sub">fallback = skeleton no HTML</div>
      <div class="rsc-mm-item">HTML em chunks HTTP</div>
      <div class="rsc-mm-sub">sem fetch adicional no browser</div>
      <div class="rsc-mm-item">TTFB baixo</div>
      <div class="rsc-mm-item">Conteúdo progressivo</div>
      <div class="rsc-mm-item">PPR (Next.js 14+ experimental)</div>
      <div class="rsc-mm-sub">shell CDN + streams dinâmicos</div>
    </div>
    <div class="rsc-mm-branch" style="border-color:#ef4444">
      <div class="rsc-mm-title" style="color:#ef4444">Antipadrões</div>
      <div class="rsc-mm-item">'use client' no layout raiz</div>
      <div class="rsc-mm-item">Secrets como props → Client</div>
      <div class="rsc-mm-item">Client importando Server</div>
      <div class="rsc-mm-item">N+1 sem Promise.all</div>
      <div class="rsc-mm-item">Server Action sem auth</div>
      <div class="rsc-mm-item">Server Action sem validação</div>
    </div>
    <div class="rsc-mm-branch" style="border-color:#61dafb">
      <div class="rsc-mm-title" style="color:#61dafb">Organização</div>
      <div class="rsc-mm-item">app/ → Server Components</div>
      <div class="rsc-mm-item">components/ui → Shared</div>
      <div class="rsc-mm-item">components/client → Client</div>
      <div class="rsc-mm-item">actions/ → Server Actions</div>
      <div class="rsc-mm-item">lib/ → server-only guard</div>
      <div class="rsc-mm-item">hooks/ → Client hooks</div>
    </div>
  </div>
</div>`,
    caption: "Mapa mental RSC: Server Components (async, zero JS), Client Components (hooks, eventos), Server Actions (RPC, revalidate), Streaming, antipadrões e organização.",
  },

  exercises: [
    {
      level: "iniciante",
      title: "Criar um Server Component que busca dados do banco",
      description: "Em um projeto Next.js com App Router, crie uma página `/users` que seja um Server Component async. Use Prisma ou qualquer ORM para buscar uma lista de usuários diretamente (sem useEffect, sem useState). Renderize a lista no HTML. Verifique no DevTools Network que nenhum JS extra é enviado para essa rota. Compare o bundle size com uma versão equivalente usando Client Component + useEffect.",
      concepts: ["Server Component", "async function", "data fetching direto", "zero JS ao cliente", "App Router"],
    },
    {
      level: "intermediario",
      title: "Implementar o padrão children para Server dentro de Client",
      description: "Crie um `<InteractiveShell>` Client Component com um estado de sidebar aberta/fechada. Ele recebe `children` como prop. Em `page.tsx` (Server Component), passe um `<DataTable>` (Server Component que busca dados) como children do `<InteractiveShell>`. Verifique que: (1) InteractiveShell tem 'use client'; (2) DataTable não tem 'use client'; (3) a página funciona sem erro; (4) DataTable aparece no HTML inicial.",
      concepts: ["children prop pattern", "'use client' infection", "composição RSC", "Server dentro de Client"],
    },
    {
      level: "intermediario",
      title: "Criar um Server Action com validação e revalidação",
      description: "Implemente um formulário de criação de post com Server Action. A action deve: (1) validar o input com Zod; (2) verificar autenticação com getServerSession; (3) persistir no banco; (4) chamar revalidatePath('/posts'); (5) retornar erros serializáveis. No Client Component do form, use useActionState (ou useFormState no React 18) para exibir erros da action.",
      concepts: ["Server Actions", "'use server'", "Zod validation", "revalidatePath", "useActionState", "autenticação"],
    },
    {
      level: "senior",
      title: "Implementar streaming com múltiplos Suspense boundaries",
      description: "Crie uma dashboard com 3 seções: (1) dados rápidos (sem delay), (2) dados médios (~500ms de delay), (3) dados lentos (~2s). Use Suspense com skeleton para cada seção. Verifique no DevTools Network que a resposta HTTP usa Transfer-Encoding: chunked. Adicione um `loading.tsx` que cobre o fallback inicial da página. Meça o LCP com e sem streaming.",
      concepts: ["Suspense", "streaming", "Transfer-Encoding chunked", "loading.tsx", "LCP", "progressive rendering"],
    },
    {
      level: "senior",
      title: "Implementar cache granular com revalidateTag",
      description: "Crie uma rota que busca dados de posts e usuários. Use `fetch` com `next: { tags: ['posts'] }` para busca de posts e `tags: ['users']` para usuários. Crie Server Actions `createPost` e `updateUser` que chamam `revalidateTag('posts')` e `revalidateTag('users')` respectivamente. Verifique que criar um post invalida apenas o cache de posts, não de usuários. Use o Cache control header para confirmar o comportamento.",
      concepts: ["revalidateTag", "revalidatePath", "granular cache", "Server Actions", "fetch cache", "Next.js caching"],
    },
  ],

  codeExamples: [
    {
      title: "Server Component com data fetching paralelo",
      language: "typescript",
      code: `// app/dashboard/page.tsx — Server Component (padrão, sem 'use client')
import { db } from '@/lib/db'

// Server Components são async functions — sem useEffect, sem useState
export default async function DashboardPage() {
  // Fetches em paralelo — evita waterfall
  const [user, posts, stats] = await Promise.all([
    db.user.findFirst({ where: { id: 'current-user' } }),
    db.post.findMany({ where: { published: true }, take: 5 }),
    db.post.count(),
  ])

  // Zero JS enviado ao browser — apenas HTML
  return (
    <main>
      <h1>Bem-vindo, {user?.name}</h1>
      <p>{stats} posts publicados</p>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  )
}`,
    },
    {
      title: "Padrão children — Server Component dentro de Client Component",
      language: "typescript",
      code: `// components/client/Sidebar.tsx — Client Component
'use client'
import { useState } from 'react'

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ display: 'flex' }}>
      {open && <aside>{children}</aside>}
      <button onClick={() => setOpen(o => !o)}>Toggle</button>
    </div>
  )
}

// ---------------------------------------------------------

// components/server/NavItems.tsx — Server Component (sem 'use client')
import { db } from '@/lib/db'

export async function NavItems() {
  // Acessa banco diretamente — zero JS ao cliente
  const sections = await db.section.findMany({ orderBy: { order: 'asc' } })
  return (
    <nav>
      {sections.map(s => <a key={s.id} href={\`/\${s.slug}\`}>{s.name}</a>)}
    </nav>
  )
}

// ---------------------------------------------------------

// app/layout.tsx — Server Component — monta a composição correta
import { Sidebar } from '@/components/client/Sidebar'
import { NavItems } from '@/components/server/NavItems'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar>
      {/* NavItems é Server Component passado como children para Client */}
      <NavItems />
    </Sidebar>
  )
}`,
    },
    {
      title: "Server Action com validação, auth e revalidação",
      language: "typescript",
      code: `// actions/posts.ts — módulo de Server Actions
'use server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { revalidatePath, revalidateTag } from 'next/cache'

const CreatePostSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
})

export async function createPost(formData: FormData) {
  // 1. Verificar autenticação
  const session = await getServerSession()
  if (!session?.user?.id) {
    return { error: { _root: 'Não autenticado' } }
  }

  // 2. Validar input com Zod
  const parsed = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  })
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // 3. Persistir
  await db.post.create({
    data: {
      ...parsed.data,
      authorId: session.user.id,
    },
  })

  // 4. Invalidar cache granularmente
  revalidateTag('posts')      // invalida fetches com tags: ['posts']
  revalidatePath('/posts')    // invalida a rota inteira

  return { success: true }
}

// ---------------------------------------------------------
// components/client/CreatePostForm.tsx — Client Component
'use client'
import { useActionState } from 'react' // React 19 (useFormState no React 18)
import { createPost } from '@/actions/posts'

export function CreatePostForm() {
  const [state, action, pending] = useActionState(createPost, null)

  return (
    <form action={action}>
      <input name="title" placeholder="Título" />
      {state?.error?.title && <p>{state.error.title}</p>}
      <textarea name="content" />
      <button disabled={pending} type="submit">
        {pending ? 'Criando...' : 'Criar post'}
      </button>
    </form>
  )
}`,
    },
    {
      title: "Streaming com Suspense e loading states",
      language: "typescript",
      code: `// app/dashboard/page.tsx
import { Suspense } from 'react'
import { PostsSkeleton, StatsSkeleton } from '@/components/skeletons'

// Componente lento — query pesada
async function SlowStats() {
  // Simula query lenta
  await new Promise(r => setTimeout(r, 2000))
  const stats = await db.analyticsReport.compute()
  return <div>Receita: R$ {stats.revenue}</div>
}

// Componente médio
async function RecentPosts() {
  await new Promise(r => setTimeout(r, 500))
  const posts = await db.post.findMany({ take: 5 })
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}

export default function Dashboard() {
  return (
    <main>
      {/* Aparece imediatamente — dados estáticos */}
      <h1>Dashboard</h1>

      {/* Skeleton aparece imediatamente; stats chegam em ~2s via stream */}
      <Suspense fallback={<StatsSkeleton />}>
        <SlowStats />
      </Suspense>

      {/* Skeleton separado — stream independente em ~500ms */}
      <Suspense fallback={<PostsSkeleton />}>
        <RecentPosts />
      </Suspense>
    </main>
  )
  // O browser recebe o HTML em chunks:
  // Chunk 1 (~0ms): shell + skeletons
  // Chunk 2 (~500ms): HTML de RecentPosts substitui skeleton
  // Chunk 3 (~2000ms): HTML de SlowStats substitui skeleton
}`,
    },
  ],

  videos: [
    {
      title: "React Server Components — Official Introduction",
      channel: "Vercel",
      url: "https://www.youtube.com/watch?v=TQQPAU21ZUw",
      topic: "Introdução oficial RSC",
    },
    {
      title: "Understanding React Server Components",
      channel: "Josh Comeau",
      url: "https://www.youtube.com/watch?v=XFzSNWZNNr4",
      topic: "Modelo mental RSC",
    },
    {
      title: "Server Actions in Next.js 14",
      channel: "Vercel",
      url: "https://www.youtube.com/watch?v=dDpZfOQBMaI",
      topic: "Server Actions prática",
    },
    {
      title: "Next.js App Router Caching Explained",
      channel: "Theo - t3.gg",
      url: "https://www.youtube.com/watch?v=VBlSe8tvg4U",
      topic: "Caching no App Router",
    },
    {
      title: "Partial Prerendering in Next.js",
      channel: "Vercel",
      url: "https://www.youtube.com/watch?v=MTcPrTIBkpA",
      topic: "PPR e futuro do rendering",
    },
  ],

  resources: [
    { title: "React docs — Server Components", url: "https://react.dev/reference/rsc/server-components", kind: "docs" },
    { title: "Next.js — Server and Client Components", url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components", kind: "docs" },
    { title: "Next.js — Server Actions and Mutations", url: "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations", kind: "docs" },
    { title: "Josh Comeau — Making Sense of RSC", url: "https://www.joshwcomeau.com/react/server-components/", kind: "artigo" },
    { title: "Next.js — Caching in Next.js", url: "https://nextjs.org/docs/app/building-your-application/caching", kind: "docs" },
    { title: "Partial Prerendering (PPR) docs", url: "https://nextjs.org/docs/app/api-reference/next-config-js/partial-prerendering", kind: "docs" },
    { title: "React RFC — Server Components", url: "https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md", kind: "artigo" },
    { title: "Next.js — Data Fetching patterns", url: "https://nextjs.org/docs/app/building-your-application/data-fetching/patterns", kind: "docs" },
  ],

  gotchas: [
    "'use client' infecta a árvore: todos os filhos importados por um Client Component são Client Components, mesmo sem a diretiva.",
    "Passar funções de servidor para cliente requer Server Actions. Não passe funções comuns como props para Client Components.",
    "Dados sensíveis (API keys) seguros em Server Components — nunca chegam ao cliente. Mas se você passar como prop para Client Component, vão.",
    "cookies() e headers() tornam o componente dinâmico — opt-out do cache automático do Next.js. Use com consciência de performance.",
    "Server Actions requerem validação E autorização — autenticação não é suficiente. Verifique se o usuário pode fazer aquela operação específica.",
    "revalidatePath('/posts') invalida todos os dados da rota. revalidateTag('posts') é mais granular — invalida apenas fetches com aquela tag.",
    "No Next.js 15, o caching de fetch não é mais automático — é opt-in explícito com next.revalidate ou next.tags.",
  ],
}

export default serverComponentsRsc
