'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, PatternItem, DepRow, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion } from '@/components/pdfs/ComparativeRefPdf'

// ── Paleta Next.js ────────────────────────────────────────────────────────────
const C = '#e2e8f0'   // Next.js branco/cinza claro

// ── Metadados dos PDFs ───────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: Server vs Client Components, rendering strategies, caching layers, App Router vs Pages Router, Server Actions, Middleware, Partial Prerendering, Next.js 15 breaking changes — com resposta estruturada para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'App Router API, data fetching, metadata, image — numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: APIs do App Router (layout, loading, error, page, route), fetch com opções de cache, Metadata API, next/image, Server Actions, revalidatePath/revalidateTag. Tudo que você precisa checar sem abrir a documentação.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Regras de cache, rendering e composição que grudam',
    type: 'mnemonics',
    pages: 2,
    description: 'CIRF para as 4 camadas de cache, CLEP para os arquivos especiais de route segment, SICS para as rendering strategies — associações que você não esquece.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 5 erros mais comuns — e como corrigir',
    type: 'antipatterns',
    pages: 3,
    description: '"use client" no topo da árvore, importar Server Component em Client Component, Server Action em useEffect, middleware sem matcher, passar dados não serializáveis — cada um com código errado × correto.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Next.js do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental completo com App Router, Rendering, Caching, Server Components, Middleware, Performance e checklist de 20 perguntas que você deve conseguir responder de cabeça.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
  {
    id: 'comparative',
    title: 'Referência Comparativa',
    subtitle: 'SSR vs SSG vs ISR vs CSR — trade-offs lado a lado',
    type: 'comparative',
    pages: 2,
    description: 'Tabela completa das 4 estratégias de rendering: quando o HTML é gerado, TTFB, frescor de dados, SEO, personalização, carga no servidor e quando usar cada uma. Decisões documentadas com cenários.',
    icon: '06',
    goal: 'Decisão arquitetural',
  },
]

// ── Dados: Q&A ───────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Qual a diferença fundamental entre App Router e Pages Router?',
    a: '<p>O App Router (Next.js 13+) usa React Server Components por padrão e tem nova convenção de arquivos. O Pages Router usa o modelo clássico onde tudo é Client Component.</p><ul><li>App Router: RSC padrão, layouts aninhados, Suspense/streaming nativo, Server Actions</li><li>Pages Router: getServerSideProps/getStaticProps, componentes todos Client, sem RSC</li><li>Eles coexistem no mesmo projeto — migração gradual é possível</li><li>App Router é o futuro; Pages Router continua recebendo correções mas não novidades</li></ul>',
    tip: 'Mencione que a coexistência (app/ + pages/) permite migração incremental — pergunta comum em empresas com codebase legado.',
  },
  {
    level: 'Senior',
    q: 'O que são as 4 camadas de cache do Next.js? Como cada uma funciona?',
    a: '<p>Next.js tem 4 camadas de cache independentes que operam em escopos diferentes:</p><ul><li><strong>Request Memoization:</strong> React deduplicar fetches idênticos dentro de uma request — automático, sem configuração</li><li><strong>Data Cache:</strong> cache persistente no servidor Next.js — sobrevive entre requests. Controlado com <code>next: { revalidate }</code> e <code>revalidateTag()</code></li><li><strong>Full Route Cache:</strong> HTML renderizado de rotas estáticas no filesystem — invalidado por deploy ou <code>revalidatePath()</code></li><li><strong>Router Cache:</strong> cache de RSC payload no browser — navegação instantânea entre rotas já visitadas</li></ul>',
    tip: 'A camada mais cobrada é o Data Cache — explique a diferença entre force-cache (Next 14 padrão) e no-store (Next 15 padrão). A mudança do comportamento padrão no v15 é armadilha de entrevista.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o boundary entre Server e Client Components? O que pode e não pode passar entre eles?',
    a: '<p>Server Components produzem HTML/RSC payload — nenhum JS vai ao cliente. Client Components ("use client") têm bundle JS enviado ao browser.</p><ul><li>Só valores serializáveis trafegam de SC para CC: strings, números, arrays, objetos plain, null, boolean</li><li>Funções, instâncias de classes, Date, Map, Set, Promises — não serializáveis → erro</li><li>Client Component NÃO pode importar Server Component diretamente — o SC vira CC</li><li>Padrão correto: SC passa CC como children prop de um SC pai — CC recebe SC via prop, não import</li></ul>',
    tip: 'A pegadinha mais testada: "importar Server Component dentro de um Client Component transforma o SC em CC". A solução via children prop é o que diferencia candidatos pleno de sênior.',
  },
  {
    level: 'Senior',
    q: 'O que são Server Actions? Quando usar vs API routes?',
    a: '<p>Server Actions são funções marcadas com "use server" que rodam sempre no servidor e podem ser chamadas do cliente sem expor código.</p><ul><li>Ideal para mutações (POST/PUT/DELETE) — acessa banco, cookies, auth diretamente</li><li>Usa com forms: <code>&lt;form action={serverAction}&gt;</code> — progressive enhancement, funciona sem JS</li><li>revalidatePath/revalidateTag dentro da Server Action atualiza o cache automaticamente</li><li>Use API routes quando: precisa de verbo GET público, integração com terceiros via webhook, streaming de dados</li><li>Server Actions não são REST — não têm URL pública por padrão</li></ul>',
    tip: 'Critério de decisão: mutation com acesso a banco/auth → Server Action. API com URL pública, GET externo ou webhook → API route.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar SSG, ISR, SSR e CSR? Quais são os trade-offs principais?',
    a: '<p>Cada estratégia tem trade-off entre performance, frescor de dados e personalização:</p><ul><li><strong>SSG:</strong> HTML em build time, serve do CDN — máxima performance. Para conteúdo que não muda (blog, docs)</li><li><strong>ISR:</strong> SSG com revalidação em background — eventual consistency. Para catálogos, e-commerce</li><li><strong>SSR:</strong> HTML por request no servidor — sempre fresco, personalização por usuário. Para dashboards, search</li><li><strong>CSR:</strong> shell HTML + fetch no browser — ótimo para SPAs, admin panels interativos</li></ul>',
    tip: 'Critério decisivo: "os dados precisam ser personalizados por usuário?" → SSR ou CSR. "SEO é crítico?" → não CSR. "Dados mudam raramente?" → SSG ou ISR.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o Middleware do Next.js? Quais são os casos de uso e armadilhas?',
    a: '<p>Middleware executa no Edge Runtime (V8 isolate, sem Node.js APIs) ANTES do cache e do roteamento — para toda request que satisfaz o matcher.</p><ul><li>Casos de uso: autenticação (verificar JWT), redirecionamentos, i18n, A/B testing, manipulação de headers</li><li>Armadilha principal: sem <code>config.matcher</code>, executa em TUDO — incluindo _next/static, imagens, favicon</li><li>Edge Runtime: sem Node.js APIs nativas (fs, crypto completo). Use Web Crypto API</li><li>Latência: executa em CDN Edge — não acessa banco diretamente (somente via fetch)</li></ul>',
    tip: 'A armadilha do matcher é a pergunta mais comum. Mostre o pattern de exclusão: <code>/((?!_next|favicon.ico).*)/</code>.',
  },
  {
    level: 'Pleno',
    q: 'Quais são os arquivos especiais do App Router? O que cada um faz?',
    a: '<p>O App Router usa convenções de arquivo para cada tipo de UI em uma rota:</p><ul><li><strong>layout.tsx:</strong> persiste entre navegações do mesmo segment — ideal para nav, sidebar</li><li><strong>page.tsx:</strong> único arquivo que torna a rota pública — recebe params e searchParams</li><li><strong>loading.tsx:</strong> Suspense boundary automático — exibido enquanto page está carregando</li><li><strong>error.tsx:</strong> Error boundary automático — obriga "use client", recebe error e reset()</li><li><strong>not-found.tsx:</strong> exibido quando notFound() é chamado ou rota não existe</li><li><strong>template.tsx:</strong> como layout, mas re-monta a cada navegação — para animações ou analytics</li></ul>',
    tip: 'A diferença layout vs template é pergunta clássica: layout persiste (estado mantido), template re-monta (estado resetado).',
  },
  {
    level: 'Senior',
    q: 'Como otimizar imagens no Next.js? O que next/image faz internamente?',
    a: '<p>next/image é um wrapper do elemento img que adiciona otimizações automáticas:</p><ul><li>Conversão automática para formatos modernos (WebP, AVIF) — reduz tamanho 25-50%</li><li>Resize automático pelo servidor Next.js — envia apenas o tamanho necessário</li><li>Lazy loading por padrão — <code>loading="lazy"</code> apenas para imagens abaixo do fold</li><li>Prevenção de Cumulative Layout Shift (CLS) — reserva espaço antes de carregar</li><li>Prop <code>priority</code> para LCP images — desativa lazy loading e adiciona preload</li><li>Domains externos requerem configuração em <code>next.config.js</code> para segurança</li></ul>',
    tip: 'Mencione o trade-off: next/image gera custo de CPU no servidor (resize). Para imagens em CDN externo já otimizadas, avalie o benefício real.',
  },
  {
    level: 'Pleno',
    q: 'Como implementar internacionalização (i18n) no Next.js App Router?',
    a: '<p>App Router não tem i18n built-in como Pages Router. A abordagem recomendada usa route groups com locale:</p><ul><li>Estrutura: <code>app/[locale]/page.tsx</code> — locale como parâmetro dinâmico</li><li>Middleware redireciona o root para o locale correto com base em Accept-Language</li><li>Dicionários de tradução: arquivos JSON por locale carregados no Server Component</li><li>Libs populares: next-intl, next-i18next (adaptado para App Router)</li><li>generateStaticParams para SSG com todos os locales em build time</li></ul>',
    tip: 'A diferença Pages Router vs App Router para i18n é cobrada: Pages Router tinha config nativa; App Router requer estratégia manual ou lib.',
  },
  {
    level: 'Senior',
    q: 'O que é Partial Prerendering (PPR)? Como resolve o dilema SSG vs SSR?',
    a: '<p>PPR é uma inovação do Next.js 14/15 que combina SSG e SSR na mesma página:</p><ul><li>O shell estático da página (header, nav, layout) é gerado em build time — serve do CDN imediatamente</li><li>As partes dinâmicas (dashboard personalizado, carrinho) são streamadas assim que ficam prontas</li><li>Resolve o dilema: "ou tudo estático OU tudo dinâmico". PPR permite ter os dois na mesma rota</li><li>Usa Suspense boundaries para marcar o que é dinâmico: <code>&lt;Suspense fallback={...}&gt;</code></li><li>Ativação: <code>experimental: { ppr: true }</code> no next.config.js (Next.js 14 experimental, 15 opt-in)</li></ul>',
    tip: 'PPR é a pergunta que separa candidatos que acompanham o ecossistema. Explique o problema que resolve (TTFB de rotas dinâmicas) antes de descrever a solução.',
  },
  {
    level: 'Senior',
    q: 'Quais foram as mudanças de breaking changes no Next.js 15?',
    a: '<p>Next.js 15 teve mudanças significativas especialmente em caching e APIs assíncronas:</p><ul><li><strong>Caching padrão:</strong> fetch sem opções agora é <code>no-store</code> por padrão (antes era <code>force-cache</code>) — dado sempre fresco por padrão</li><li><strong>APIs assíncronas:</strong> <code>cookies()</code>, <code>headers()</code>, <code>params</code>, <code>searchParams</code> são agora Promises — requerem <code>await</code></li><li><strong>React 19:</strong> suporte completo a <code>use()</code>, <code>useOptimistic</code>, <code>useActionState</code></li><li><strong>Turbopack estável</strong> para <code>next dev</code></li></ul>',
    tip: 'A mudança de caching padrão é a armadilha principal na migração 14→15. Código que funcionava com fetch cacheado pode retornar dados stale inesperadamente após migrar.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o streaming no Next.js App Router?',
    a: '<p>Streaming envia HTML progressivamente ao browser — partes estáticas chegam imediatamente, partes dinâmicas chegam quando ficam prontas.</p><ul><li>Server Components async suspensos fazem streaming automático com Suspense</li><li><code>loading.tsx</code> é o Suspense boundary de nível de rota — exibido enquanto o servidor processa</li><li><code>&lt;Suspense fallback={&lt;Skeleton /&gt;}&gt;</code> inline para granularidade dentro da página</li><li>Resultado: LCP do shell é imediato mesmo que dados demorem — melhora percepção de performance</li><li>Funciona com o <code>Transfer-Encoding: chunked</code> HTTP/1.1 ou HTTP/2 multiplexing</li></ul>',
    tip: 'Explique o benefício de LCP: o usuário vê o layout imediatamente, mesmo que o conteúdo personalizado demore 500ms. Isso melhora tanto a performance percebida quanto o Core Web Vital.',
  },
  {
    level: 'Pleno',
    q: 'Como usar a Metadata API do Next.js? Quais são os campos mais importantes para SEO?',
    a: '<p>App Router exporta um objeto <code>metadata</code> ou função <code>generateMetadata</code> de qualquer layout ou page:</p><ul><li><code>title</code>: string simples ou template (<code>{ template: "%s | My App", default: "My App" }</code>)</li><li><code>description</code>: meta description para SEO</li><li><code>openGraph</code>: título, descrição, imagem para compartilhamento social</li><li><code>robots</code>: <code>{ index: true, follow: true }</code> para crawlers</li><li><code>generateMetadata</code> (async): quando metadata depende de dados dinâmicos (título do post, preço do produto)</li></ul>',
    tip: 'Distinguir metadata estático vs generateMetadata demonstra domínio. O segundo permite personalização por rota com base em dados do banco.',
  },
  {
    level: 'Senior',
    q: 'Como depurar problemas de cache stale no Next.js? Quais ferramentas usar?',
    a: '<p>Debugging de cache no Next.js é um dos problemas mais frequentes em produção:</p><ul><li><strong>Identificar a camada:</strong> Data Cache? Full Route Cache? Router Cache? Cada uma tem comportamento diferente</li><li><strong>Data Cache:</strong> <code>fetch(url, { cache: "no-store" })</code> para desativar completamente durante debug</li><li><strong>Full Route Cache:</strong> <code>export const dynamic = "force-dynamic"</code> força SSR na rota</li><li><strong>Router Cache:</strong> <code>router.refresh()</code> no cliente para limpar</li><li><strong>Headers de diagnóstico:</strong> Next.js adiciona <code>x-nextjs-cache: HIT/MISS/STALE</code> — verifique no DevTools</li></ul>',
    tip: 'Mencionar o header x-nextjs-cache demonstra experiência real de debugging em produção. A maioria dos candidatos não sabe da sua existência.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o Route Groups no App Router?',
    a: '<p>Route Groups usam parênteses no nome da pasta <code>(groupName)</code> — não afetam a URL mas permitem organização e layouts compartilhados:</p><ul><li>Organização: <code>(auth)/login</code> e <code>(auth)/register</code> compartilham layout sem <code>/auth</code> na URL</li><li>Múltiplos root layouts: app com áreas com designs completamente diferentes (marketing vs app)</li><li>Layouts opcionais: <code>(shop)</code> tem seu próprio layout; <code>(blog)</code> tem outro — sem afetar URL</li><li>Parallel Routes (avançado): <code>@modal/page.tsx</code> renderiza dois segmentos simultaneamente</li></ul>',
    tip: 'Route Groups são a resposta para "como ter múltiplos designs (marketing vs dashboard) numa mesma app sem prefixo de URL?".',
  },
  {
    level: 'Pleno',
    q: 'Como usar next/font? Quais são os benefícios para performance?',
    a: '<p>next/font baixa e serve fontes auto-hospedadas — zero dependência de CDN externo em runtime:</p><ul><li>Google Fonts: <code>import { Inter } from "next/font/google"</code> — baixa em build time, serve do mesmo domínio</li><li>Fontes locais: <code>import localFont from "next/font/local"</code></li><li>CSS variable: <code>const font = Inter({ variable: "--font-inter" })</code> para uso com Tailwind</li><li>Benefícios: elimina requests externos para fonts.googleapis.com, melhora LCP, sem layout shift com <code>display: swap</code> automático</li></ul>',
    tip: 'O benefício de privacidade é frequentemente esquecido: usar next/font impede o Google de rastrear usuários via requests de fonte.',
  },
  {
    level: 'Senior',
    q: 'O que são Parallel Routes e Intercepting Routes? Quando usar?',
    a: '<p>São features avançadas do App Router para layouts complexos:</p><ul><li><strong>Parallel Routes (<code>@slot</code>):</strong> renderiza múltiplas páginas na mesma URL simultaneamente — ideal para dashboards com seções independentes, modais</li><li><strong>Intercepting Routes (<code>(..)</code>):</strong> renderiza uma rota "por cima" de outra mantendo o contexto — padrão modal da galeria do Instagram (URL muda, modal abre, refresh carrega a página completa)</li><li>Caso mais comum: modal que tem URL própria mas não perde o contexto da página de fundo</li></ul>',
    tip: 'Usar o exemplo do Instagram/Twitter (clique em foto abre modal com URL, F5 abre a página completa) é a melhor forma de explicar Intercepting Routes em entrevista.',
  },
  {
    level: 'Senior',
    q: 'Como Next.js otimiza o bundle JavaScript para o cliente?',
    a: '<p>Next.js tem várias estratégias de otimização de bundle automáticas e manuais:</p><ul><li><strong>Automático:</strong> Server Components geram zero JS ao cliente — a lógica de fetch/transform fica no servidor</li><li><strong>Code splitting:</strong> cada rota tem seu próprio bundle — carregado sob demanda na navegação</li><li><strong>Tree shaking:</strong> SWC remove código não utilizado em build time</li><li><strong>Dynamic import:</strong> <code>dynamic(() => import("./Heavy"), { ssr: false })</code> para componentes pesados</li><li><strong>Análise:</strong> <code>@next/bundle-analyzer</code> gera visualização do bundle — identifica dependências pesadas</li></ul>',
    tip: 'Mencione que Server Components são a maior inovação para bundle size — uma página inteiramente em RSC tem zero JS de lógica de dados no cliente.',
  },
  {
    level: 'Pleno',
    q: 'Como implementar autenticação no Next.js? Quais são as abordagens comuns?',
    a: '<p>Autenticação no Next.js tem múltiplos layers:</p><ul><li><strong>Auth.js (NextAuth v5):</strong> provider completo com OAuth, credentials, email magic link — integra com App Router e Server Actions</li><li><strong>Middleware:</strong> verificação de JWT no Edge — redireciona para /login antes do Server Component executar</li><li><strong>Server Components:</strong> acessa cookies/session diretamente para personalizar o render</li><li><strong>Server Actions:</strong> login/logout como mutations — sem API route para o fluxo de auth</li><li>Nunca armazene tokens sensíveis em localStorage — use httpOnly cookies</li></ul>',
    tip: 'O fluxo completo: Middleware verifica JWT (Edge) → Server Component lê session → Server Action faz login/logout — demonstra entendimento de cada layer.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o Turbopack? Quais são os trade-offs vs Webpack?',
    a: '<p>Turbopack é o novo bundler do Next.js, escrito em Rust:</p><ul><li><strong>Performance:</strong> 76% faster local server startup vs Webpack; HMR incremental — altera apenas o módulo modificado</li><li><strong>Compatibilidade:</strong> Next.js 15 tem Turbopack estável para <code>next dev</code>; <code>next build</code> ainda usa Webpack por padrão</li><li><strong>Trade-offs:</strong> ecossistema de plugins Webpack não é compatível; algumas configurações avançadas não migram ainda</li><li><strong>Ativação:</strong> <code>next dev --turbopack</code> ou <code>devIndicators: { buildActivity: true }</code></li></ul>',
    tip: 'A distinção importante: Turbopack estável em next dev, mas next build ainda usa Webpack. Saber isso evita surpresas em CI/CD.',
  },
]

// ── Dados: CheatSheet ────────────────────────────────────────────────────────

const CS_HOOKS: HookItem[] = [
  { name: 'layout.tsx',    sig: 'export default function Layout({ children })',          desc: 'Persiste entre navegações — não re-renderiza. Para nav, sidebar, providers.' },
  { name: 'page.tsx',      sig: 'export default async function Page({ params, searchParams })', desc: 'Único arquivo que torna rota pública. Server Component por padrão.' },
  { name: 'loading.tsx',   sig: 'export default function Loading()',                     desc: 'Suspense boundary automático — exibido enquanto page resolve.' },
  { name: 'error.tsx',     sig: '"use client"\nexport default function Error({ error, reset })', desc: 'Error boundary automático — "use client" obrigatório.' },
  { name: 'not-found.tsx', sig: 'export default function NotFound()',                    desc: 'Exibido quando notFound() é chamado ou rota não existe.' },
  { name: 'route.ts',      sig: 'export async function GET/POST/PUT/DELETE(req: Request)', desc: 'API route — handler HTTP em app/api/[path]/route.ts.' },
]

const CS_HOOKS_EXTRA: HookItem[] = [
  { name: 'fetch com cache',     sig: "fetch(url, { next: { revalidate: 60 } })",         desc: 'ISR por fetch: revalida a cada 60s em background.' },
  { name: 'fetch sem cache',     sig: "fetch(url, { cache: 'no-store' })",                desc: 'SSR por fetch: sempre busca dados frescos.' },
  { name: 'revalidatePath',      sig: "revalidatePath('/posts')",                         desc: 'Invalida Full Route Cache de uma rota.' },
  { name: 'revalidateTag',       sig: "revalidateTag('posts')",                           desc: 'Invalida Data Cache por tag — granular.' },
  { name: 'notFound()',          sig: "import { notFound } from 'next/navigation'",       desc: 'Dispara not-found.tsx no segment atual.' },
  { name: 'redirect()',          sig: "import { redirect } from 'next/navigation'",       desc: 'Redireciona no servidor — funciona em Server Components e Actions.' },
  { name: 'useRouter',           sig: "const router = useRouter(); router.push('/path')", desc: '"use client" — navegação programática no cliente.' },
  { name: 'usePathname',         sig: "const path = usePathname()",                       desc: '"use client" — pathname atual sem query string.' },
  { name: 'useSearchParams',     sig: "const params = useSearchParams()",                 desc: '"use client" — query string como URLSearchParams.' },
]

const CS_DEP_ROWS: DepRow[] = [
  ['next/image',   'Substituir <img> — converte para WebP/AVIF, lazy load, CLS prevention'],
  ['next/font',    'Self-host Google Fonts — zero request externo, melhora LCP'],
  ['next/link',    'Navegação client-side com prefetch automático de rotas visíveis'],
  ['next/headers', 'Acessar headers/cookies em Server Components e Route Handlers'],
  ['next/cache',   'revalidatePath, revalidateTag — invalidação de cache programática'],
]

const CS_RULES: RuleItem[] = [
  { ok: true,  t: 'Server Components são padrão — "use client" só quando necessário' },
  { ok: true,  t: 'Passe RSC como children prop para Client Components — não importe direto' },
  { ok: true,  t: 'Serialize antes de passar dados de SC para CC — apenas objetos plain' },
  { ok: true,  t: 'Configure config.matcher no middleware — sem ele executa em tudo' },
  { ok: false, t: '"use client" no topo de page.tsx — torna tudo Client Component' },
  { ok: false, t: 'Importar Server Component dentro de "use client" — transforma em Client' },
  { ok: false, t: 'Server Action para fetching (GET) — use React Query ou Server Component' },
  { ok: false, t: 'Acessar window/localStorage em Server Component — crash em runtime' },
]

const CS_PERFORMANCE_TIPS: string[] = [
  'Server Components = zero JS ao cliente — mantenha o máximo como SC',
  'next/image com priority={true} no LCP hero image',
  'dynamic import para componentes pesados: dynamic(() => import("./Heavy"), { ssr: false })',
  'revalidatePath/revalidateTag para ISR granular — invalide só o que mudou',
  'generateStaticParams para SSG de rotas dinâmicas com dados conhecidos',
  'Streaming com Suspense — shell aparece imediatamente, dados chegam depois',
]

const CS_PATTERNS: PatternItem[] = [
  { name: 'Server Component com fetch',    code: 'export default async function Page() {\n  const data = await fetch(...).then(r => r.json())\n  return <List items={data} />\n}',                 desc: 'Fetch direto, zero JS ao cliente para a lógica de dados' },
  { name: 'Server Action em form',          code: '"use server"\nexport async function create(fd: FormData) {\n  await db.create({ title: fd.get("title") })\n  revalidatePath("/")\n}',            desc: 'Mutation sem API route — progressive enhancement' },
  { name: 'Client Component com React Query', code: '"use client"\nconst { data } = useQuery({\n  queryKey: ["posts"],\n  queryFn: () => fetch("/api/posts").then(r => r.json()),\n})',              desc: 'Fetch no cliente com cache, loading state e background refetch' },
  { name: 'Middleware de auth',              code: 'export function middleware(req: NextRequest) {\n  const token = req.cookies.get("token")\n  if (!token) return NextResponse.redirect(new URL("/login", req.url))\n}', desc: 'Guard de autenticação no Edge antes do rendering' },
]

const CS_MENTAL_MODELS: string[] = [
  '"use client" = onde o BUNDLE JS começa — SC pai de CC ainda roda no servidor',
  'Caching padrão: Next.js 14 → force-cache. Next.js 15 → no-store. Saiba qual versão está usando',
  'Middleware = Edge Layer. Não tem acesso a Node.js APIs — apenas Web APIs',
  'Server Actions = RPCs servidor — são para mutations, não para reads',
  'Route Segment Files = hierarquia aninhada — cada pasta app/ é um segment',
]

// ── Dados: Mnemônicos ────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'CIRF — As 4 camadas de cache',
    trick: 'C-I-R-F: "Cada Iteração Retém Facilmente"',
    expansion: [
      ['C', 'Client — Router Cache (navegação no browser, 30s/5min)'],
      ['I', 'Internal Server — Full Route Cache (HTML+RSC payload em disco)'],
      ['R', 'Request — Memoization (deduplicação de fetch na mesma requisição)'],
      ['F', 'Fetch — Data Cache (resultado de fetch, persistente entre requisições)'],
    ],
    explanation: 'C = Client (Router Cache), I = Internal Server (Full Route Cache), R = Request (Memoization), F = Fetch (Data Cache). Ordenado de mais próximo do usuário (C) ao mais próximo dos dados (F).',
    example: 'revalidatePath("/posts") invalida F e I; navegação de volta usa C se ainda válido',
    why: 'Next.js 14 tem 4 camadas de cache sobrepostas. Saber CIRF evita confundir qual cache invalidar quando dados não atualizam.',
  },
  {
    label: 'CLEP — Arquivos especiais do Route Segment',
    trick: 'C-L-E-P: "Construir Layout É Prioritário"',
    expansion: [
      ['C', 'Component — page.tsx (conteúdo da rota)'],
      ['L', 'Layout — layout.tsx (wraps filhos, persiste entre navegações)'],
      ['E', 'Error — error.tsx (boundary de erro da rota)'],
      ['P', 'Page skeleton — loading.tsx (Suspense boundary automático)'],
    ],
    explanation: 'C = Component da rota (page.tsx), L = Layout (layout.tsx), E = Error boundary (error.tsx), P = Page skeleton (loading.tsx). Todos aninhados do mais externo (L) ao conteúdo (C).',
    example: 'app/dashboard/layout.tsx wraps app/dashboard/page.tsx — layout persiste, page recarrega',
    why: 'Os 4 arquivos especiais são o vocabulário do App Router. Confundi-los leva a bugs de persistência de estado e error boundaries no lugar errado.',
  },
  {
    label: 'SICS — Quando usar cada rendering strategy',
    trick: 'S-I-C-S: "Servidor Incrementa, Cliente Serve"',
    expansion: [
      ['S', 'SSG — Static Site Generation (build time, zero custo de servidor)'],
      ['I', 'ISR — Incremental Static Regeneration (revalida em background)'],
      ['C', 'CSR — Client-Side Rendering (SPA clássico, fetch no browser)'],
      ['S', 'SSR — Server-Side Rendering (por request, sempre fresco)'],
    ],
    explanation: 'S = SSG (Static), I = ISR (Incremental), C = CSR (Client), S = SSR (Server). Ordem de carga no servidor: SSG=0, ISR=baixo, CSR=baixo, SSR=alto. Ordem de frescor: SSG=baixo, ISR=médio, CSR=alto, SSR=alto.',
    example: 'Blog post → SSG. Catálogo de produtos → ISR. Dashboard pessoal → SSR. Widget interativo → CSR.',
    why: 'Escolher a strategy errada causa ou dados desatualizados (SSG demais) ou custo desnecessário de servidor (SSR demais).',
  },
  {
    label: 'Boundary Rule — "use client" sempre nas FOLHAS',
    trick: '"Empurre use client para as folhas da árvore"',
    expansion: [
      ['Folhas', 'Componentes com hooks, eventos, estado — recebem dados como props'],
      ['Tronco/Galhos', 'Layouts, páginas, fetch logic — ficam como Server Components'],
      ['Regra', 'import de CC dentro de SC não existe — SC passa CC como children'],
    ],
    explanation: 'Visualize a árvore de componentes como uma planta. "use client" deve estar nas folhas (componentes sem filhos de dados). O tronco e os galhos (layouts, páginas, fetch logic) ficam como Server Components.',
    example: 'page.tsx (SC) → <Layout> → <DataTable data={data} /> (SC) → <SortButton /> (CC com "use client")',
    why: '"use client" no topo da página transforma toda a subárvore em CC, enviando toda a lógica de fetch para o bundle do cliente — anula os benefícios de RSC.',
  },
  {
    label: 'Server Actions ≠ API Routes',
    trick: '"Actions são MUTATIONS, Routes são APIS"',
    expansion: [
      ['Server Actions', 'RPC servidor para mutations — form actions, botões, revalidação'],
      ['API Routes', 'Endpoints HTTP públicos — GET público, webhooks, integrações externas'],
      ['Diferença chave', 'Actions não têm URL pública; Routes têm URL e aceitam qualquer cliente HTTP'],
    ],
    explanation: 'Server Actions: chamadas RPC do cliente para o servidor — ideais para CREATE/UPDATE/DELETE. API Routes (route.ts): endpoints HTTP com URL pública — ideais para GET público, webhooks, integração com terceiros que chamam sua API.',
    example: 'Formulário de criação → Server Action. Webhook do Stripe → API Route (POST /api/webhook).',
    why: 'Usar Server Actions para endpoints públicos expõe lógica interna. Usar API Routes para mutations em formulários é verboso demais — Server Actions têm revalidação automática.',
  },
]

// ── Dados: Anti-patterns ─────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: '"use client" no topo da página',
    badDesc: 'Toda a página vira Client Component — perde os benefícios de Server Components',
    badCode: [
      { t: '"use client"', c: '#ef4444' },
      { t: '\n', c: '#e2e8f0' },
      { t: '// ❌ page.tsx inteiro vira Client Component', c: '#475569' },
      { t: '\nexport default async function Page() {', c: '#e2e8f0' },
      { t: '\n  const data = await fetch(...)', c: '#ef4444' },
      { t: '\n  return <Dashboard data={data} />', c: '#e2e8f0' },
      { t: '\n}', c: '#e2e8f0' },
    ],
    goodDesc: '"use client" apenas nos componentes com interatividade — page.tsx fica como Server Component',
    goodCode: [
      { t: '// ✓ page.tsx (Server Component)', c: '#475569' },
      { t: '\nexport default async function Page() {', c: '#e2e8f0' },
      { t: '\n  const data = await fetch(...)', c: '#4ade80' },
      { t: '\n  return <Dashboard data={data} />', c: '#e2e8f0' },
      { t: '\n}\n\n', c: '#e2e8f0' },
      { t: '// ✓ components/Dashboard.tsx', c: '#475569' },
      { t: '\n"use client"', c: '#4ade80' },
      { t: ' // apenas onde há hooks/eventos', c: '#475569' },
    ],
    why: '"use client" no topo transforma toda a subárvore em Client Components, eliminando os benefícios de RSC. Todo JS da lógica de fetch vai para o bundle do cliente.',
  },
  {
    title: 'Importar Server Component em Client Component',
    badDesc: 'Import direto transforma o Server Component em Client Component silenciosamente',
    badCode: [
      { t: '"use client"', c: '#e2e8f0' },
      { t: "\nimport ServerData from './ServerData'", c: '#ef4444' },
      { t: '\n\n// ❌ ServerData vira Client Component', c: '#475569' },
      { t: '\nexport function Shell() {', c: '#e2e8f0' },
      { t: '\n  return <div><ServerData /></div>', c: '#ef4444' },
      { t: '\n}', c: '#e2e8f0' },
    ],
    goodDesc: 'Passe o Server Component como children do Server Component pai',
    goodCode: [
      { t: '// ✓ app/page.tsx (Server Component)', c: '#475569' },
      { t: '\nexport default function Page() {', c: '#e2e8f0' },
      { t: '\n  return (', c: '#e2e8f0' },
      { t: '\n    <Shell>', c: '#e2e8f0' },
      { t: '\n      <ServerData />', c: '#4ade80' },
      { t: ' // ✓ via children', c: '#4ade80' },
      { t: '\n    </Shell>', c: '#e2e8f0' },
      { t: '\n  )', c: '#e2e8f0' },
      { t: '\n}', c: '#e2e8f0' },
    ],
    why: 'Import direto dentro de "use client" transforma o SC em CC (herança de boundary). A solução via children prop mantém o SC executando no servidor.',
  },
  {
    title: 'Middleware sem config.matcher',
    badDesc: 'Sem matcher, o middleware executa em TODA request — estáticos, imagens, API',
    badCode: [
      { t: '// ❌ executa em /_next/static, favicon, imagens...', c: '#475569' },
      { t: '\nexport function middleware(req: NextRequest) {', c: '#e2e8f0' },
      { t: '\n  const token = req.cookies.get("token")', c: '#e2e8f0' },
      { t: '\n  // verificação de auth...', c: '#475569' },
      { t: '\n}', c: '#e2e8f0' },
      { t: '\n\n// ❌ sem config.matcher!', c: '#ef4444' },
    ],
    goodDesc: 'Configure matcher para excluir assets estáticos e rotas públicas',
    goodCode: [
      { t: 'export function middleware(req: NextRequest) {', c: '#e2e8f0' },
      { t: '\n  // ...', c: '#475569' },
      { t: '\n}\n\n', c: '#e2e8f0' },
      { t: 'export const config = {', c: '#e2e8f0' },
      { t: '\n  matcher: [', c: '#4ade80' },
      { t: "\n    '/((?!_next|favicon.ico|api/public).*)',", c: '#4ade80' },
      { t: '\n  ]', c: '#4ade80' },
      { t: '\n}', c: '#4ade80' },
    ],
    why: 'Sem matcher, cada request a arquivos estáticos passa pelo middleware — aumenta latência e pode quebrar funcionalidades que não precisam de auth (como imagens públicas).',
  },
]

// ── Dados: Mind Map ──────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'App Router Core',
    color: '#e2e8f0',
    items: [
      { t: 'layout.tsx', k: true },
      { t: 'page.tsx', k: true },
      { t: 'loading.tsx', k: true },
      { t: 'error.tsx', k: true },
      { t: 'not-found.tsx' },
      { t: 'route.ts' },
      { t: 'middleware.ts', k: true },
      { t: 'template.tsx' },
    ],
  },
  {
    label: 'Rendering',
    color: '#38bdf8',
    items: [
      { t: 'SSG', k: true },
      { t: 'ISR', k: true },
      { t: 'SSR', k: true },
      { t: 'CSR', k: true },
      { t: 'PPR (Partial Prerendering)', a: true },
      { t: 'Streaming', k: true },
      { t: 'React Suspense' },
    ],
  },
  {
    label: 'Server Components',
    color: '#4ade80',
    items: [
      { t: '"use client" boundary', k: true },
      { t: 'async/await direto', k: true },
      { t: 'Zero JS ao cliente', k: true },
      { t: 'children prop pattern', k: true },
      { t: 'Serialization rules', a: true },
    ],
  },
  {
    label: 'Data Fetching',
    color: '#f59e0b',
    items: [
      { t: 'fetch com next.revalidate', k: true },
      { t: 'no-store vs force-cache', k: true },
      { t: 'Server Actions', k: true },
      { t: 'revalidatePath', k: true },
      { t: 'revalidateTag', a: true },
      { t: 'React Query (Client)', k: true },
    ],
  },
  {
    label: 'Caching',
    color: '#a78bfa',
    items: [
      { t: 'Request Memoization', a: true },
      { t: 'Data Cache', k: true },
      { t: 'Full Route Cache', k: true },
      { t: 'Router Cache', k: true },
      { t: 'x-nextjs-cache header', a: true },
    ],
  },
  {
    label: 'Otimizações',
    color: '#fb923c',
    items: [
      { t: 'next/image', k: true },
      { t: 'next/font', k: true },
      { t: 'next/link (prefetch)', k: true },
      { t: 'dynamic import', k: true },
      { t: 'bundle analyzer', a: true },
      { t: 'Turbopack', a: true },
    ],
  },
  {
    label: 'Roteamento Avançado',
    color: '#ec4899',
    items: [
      { t: 'Dynamic routes [slug]', k: true },
      { t: 'Catch-all [...slug]' },
      { t: 'Route Groups (groupName)' },
      { t: 'Parallel Routes @slot', a: true },
      { t: 'Intercepting Routes (..)', a: true },
      { t: 'generateStaticParams', k: true },
    ],
  },
  {
    label: 'Auth & Segurança',
    color: '#ef4444',
    items: [
      { t: 'Middleware auth guard', k: true },
      { t: 'httpOnly cookies', k: true },
      { t: 'Auth.js (NextAuth v5)', k: true },
      { t: 'CSRF em Server Actions', a: true },
      { t: 'Env vars (NEXT_PUBLIC_)' },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Explicar a diferença entre App Router e Pages Router',
  'Descrever as 4 estratégias de rendering e quando usar cada uma',
  'Explicar as 4 camadas de cache do Next.js',
  'Descrever o boundary Server vs Client Component',
  'Explicar por que "use client" não deve ficar no topo da árvore',
  'Descrever como Server Actions funcionam e quando preferir vs API routes',
  'Explicar como Middleware funciona e por que matcher é obrigatório',
  'Descrever o que layout.tsx vs template.tsx fazem diferente',
  'Explicar como usar revalidatePath e revalidateTag para ISR granular',
  'Descrever a mudança de caching padrão do Next.js 14 para 15',
  'Explicar o que são Parallel Routes e Intercepting Routes',
  'Descrever como next/image melhora performance e CLS',
  'Explicar o que é Partial Prerendering (PPR) e o problema que resolve',
  'Descrever como implementar auth com Middleware + Server Actions',
  'Explicar como depurar cache stale usando headers de diagnóstico',
]

// ── Dados: Comparative Ref ───────────────────────────────────────────────────

const COMP_OPTIONS: CompOption[] = [
  { name: 'SSG',  color: '#4ade80' },
  { name: 'ISR',  color: '#f59e0b' },
  { name: 'SSR',  color: '#38bdf8' },
  { name: 'CSR',  color: '#a78bfa' },
]

const COMP_CRITERIA: CompCriterion[] = [
  { criterion: 'HTML gerado em', category: 'Fundamento', values: { SSG: 'build time', ISR: 'build time + background', SSR: 'por request (servidor)', CSR: 'browser (JS)' } },
  { criterion: 'TTFB', category: 'Performance', values: { SSG: 'mínimo (CDN)', ISR: 'mínimo (CDN)', SSR: 'depende do servidor', CSR: 'shell rápido' }, winner: 'SSG' },
  { criterion: 'Dados sempre frescos', category: 'Dados', values: { SSG: 'não — stale até build', ISR: 'eventual consistency', SSR: 'sim — por request', CSR: 'sim — fetch no browser' }, winner: 'SSR' },
  { criterion: 'SEO', category: 'SEO', values: { SSG: 'excelente', ISR: 'excelente', SSR: 'excelente', CSR: 'ruim (JS-only)' }, winner: 'SSG' },
  { criterion: 'Personalização por usuário', category: 'Dados', values: { SSG: 'não', ISR: 'não', SSR: 'sim (cookies/headers)', CSR: 'sim (fetch autenticado)' }, winner: 'SSR' },
  { criterion: 'Carga no servidor', category: 'Infra', values: { SSG: 'zero (CDN)', ISR: 'mínima', SSR: 'por request', CSR: 'apenas API calls' }, winner: 'SSG' },
  { criterion: 'Ideal para', category: 'Casos de uso', values: { SSG: 'blog, docs, marketing', ISR: 'catálogos, e-commerce', SSR: 'dashboard, search, auth', CSR: 'admin panels, formulários' } },
  { criterion: 'API Next.js', category: 'Como ativar', values: { SSG: 'fetch s/ opts ou revalidate: false', ISR: 'next: { revalidate: N }', SSR: "cache: 'no-store' ou dynamic", CSR: '"use client" + useEffect/React Query' } },
]

// ── PDF Builders ─────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Next.js',
    stackLabel: 'Frontend / Fullstack',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Next.js',
    accentColor: C,
    stackLabel: 'Frontend / Fullstack',
    sections: {
      hooks: CS_HOOKS,
      hooksExtra: CS_HOOKS_EXTRA,
      depRows: CS_DEP_ROWS,
      rules: CS_RULES,
      performanceTips: CS_PERFORMANCE_TIPS,
      patterns: CS_PATTERNS,
      mentalModels: CS_MENTAL_MODELS,
    },
    coverTitle: 'Next.js CheatSheet',
    coverSubtitle: 'App Router · Server Components · Caching · Performance',
    levelLabel: 'Pleno e Sênior',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Next.js',
    stackLabel: 'Frontend / Fullstack',
    coverTitle: 'Next.js — Mnemônicos',
    coverSubtitle: 'Regras de cache, rendering e composição que grudam',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Next.js',
    stackLabel: 'Frontend / Fullstack',
    coverTitle: 'Next.js — Anti-patterns',
    coverSubtitle: 'Os 5 erros mais comuns — e como corrigir',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Next.js',
    stackLabel: 'Frontend / Fullstack',
    coverTitle: 'Next.js — Mind Map',
    coverSubtitle: 'Do App Router ao sênior em uma folha',
    checklistTitle: 'Checklist de Entrevista — Next.js',
    checklistDesc: 'Responda cada item sem consulta. Se travar, volte ao conteúdo antes da entrevista.',
  }),
  comparative: () => buildComparativeRefPdf({
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    skillName: 'Next.js',
    accentColor: C,
    stackLabel: 'Frontend / Fullstack',
    coverTitle: 'Next.js — Rendering Strategies',
  }),
}

// ── Componente ───────────────────────────────────────────────────────────────

export default function NextJsPdfs() {
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
