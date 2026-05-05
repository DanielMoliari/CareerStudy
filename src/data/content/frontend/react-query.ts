import type { SkillContent } from '@/types'

const reactQuery: SkillContent = {
    tagline: "Biblioteca para data fetching, caching e sincronização de estado servidor no React.",
    why: "React Query (TanStack Query) resolve o problema de gerenciar estado assíncrono de servidor. Elimina boilerplate de loading/error/refetch e é padrão em stacks React modernas. Qualquer dev que trabalha com API em React precisa saber usar — é a diferença entre useEffect com loading manual e um sistema de cache robusto com background refetch.",
    prerequisite: "React básico (hooks — useState, useEffect, useContext). Async/await e fetch. Noção de HTTP (GET, POST, PUT, DELETE). Ajuda ter sentido o problema: estado de loading/error gerenciado manualmente com useEffect.",
    summary: "TanStack Query (React Query) gerencia o ciclo de vida de dados remotos: fetching, caching, background refetching, pagination, optimistic updates. A distinção fundamental: estado de servidor (dados do backend, podem ficar desatualizados, múltiplos usuários) vs estado de cliente (UI local, modal aberto, input). React Query lida com o servidor; useState/Zustand com o cliente. O sistema de cache usa query keys como identificadores hierárquicos — invalidar uma key pai invalida todos os filhos. staleTime e gcTime controlam quando buscar novamente e quando descartar. Elimina a necessidade de Redux para estado assíncrono.",
    howToStudy: "<strong>Modelo mental central:</strong> servidor = fonte da verdade; cache local é um snapshot com TTL. <code>staleTime</code> controla quando o snapshot expira (e React Query busca novamente em background). <code>gcTime</code> controla quando o snapshot é descartado da memória.<br><br><strong>Sequência recomendada:</strong><ol><li>Instale e configure o QueryClientProvider. Faça um useQuery simples — veja o estado loading/error/data funcionando.</li><li>Entenda query keys: por que são arrays, como a hierarquia funciona na invalidação.</li><li>Pratique useMutation com invalidação após sucesso — o padrão mais comum.</li><li>Estude staleTime e gcTime com exemplos reais — mude os valores e observe o comportamento.</li><li>Depois: optimistic updates, useInfiniteQuery, SSR com Next.js (dehydrate/hydrate).</li></ol><br><strong>Em 30 minutos:</strong> Tutorial quickstart da documentação — montar um useQuery que busca posts.<br><strong>Em um fim de semana:</strong> CRUD completo com useMutation, invalidação e optimistic update.<br><strong>Em uma semana:</strong> Infinite scroll, SSR com Next.js App Router, query factories pattern.",
    keypoints: [
      { title: "useQuery — o hook fundamental", body: "useQuery busca, cacheia e gerencia o estado de um dado remoto. Retorna { data, isLoading, isError, error, isFetching, refetch }. A diferença entre isLoading (nunca teve dado) e isFetching (está buscando, pode ter dado antigo) é sutil mas importante para UX.", code: `import { useQuery } from '@tanstack/react-query'

function Posts() {
  const {
    data: posts,
    isLoading,    // true apenas na primeira busca (sem dado no cache)
    isFetching,   // true sempre que está buscando (inclusive background refetch)
    isError,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
    staleTime: 5 * 60 * 1000,  // fresco por 5 minutos
  })

  if (isLoading) return <Skeleton />
  if (isError) return <Error message={error.message} />
  return <PostList posts={posts} />
}` },
      { title: "Query keys — identidade hierárquica do cache", body: "Query keys são a identidade de um dado no cache. Mesmo key = mesma entrada. Array hierárquico permite invalidação granular: invalidar ['posts'] invalida ['posts', userId] e ['posts', id, 'comments']. Use query factories para consistência — centraliza todas as keys do domínio em um objeto.", code: `// Query factory — evita keys duplicadas/inconsistentes:
const postQueries = {
  all:     () => ['posts'] as const,
  lists:   () => [...postQueries.all(), 'list'] as const,
  list:    (filters: PostFilters) => [...postQueries.lists(), filters] as const,
  details: () => [...postQueries.all(), 'detail'] as const,
  detail:  (id: string) => [...postQueries.details(), id] as const,
  comments:(id: string) => [...postQueries.detail(id), 'comments'] as const,
}

// Uso:
useQuery({ queryKey: postQueries.list({ status: 'published' }), queryFn: ... })

// Invalida tudo relacionado a posts:
queryClient.invalidateQueries({ queryKey: postQueries.all() })` },
      { title: "staleTime vs gcTime — duas dimensões do cache", body: "staleTime: por quanto tempo o dado é 'fresco' (sem background refetch). gcTime: por quanto tempo dado inativo (sem observers) fica na memória antes de ser descartado. Padrão: staleTime=0 (sempre stale), gcTime=5min. Dado stale ainda é exibido enquanto refetch acontece (stale-while-revalidate).", code: `// Config global (QueryClientProvider):
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,  // 1min — dado fresco por padrão
      gcTime:    5 * 60 * 1000,  // 5min — mantém em memória
      retry: 2,              // tenta 2x antes de marcar como erro
      refetchOnWindowFocus: false,  // desativa refetch ao voltar para a aba
    },
  },
})

// Por query — sobrescreve o padrão:
useQuery({
  queryKey: ['config'],
  queryFn: fetchConfig,
  staleTime: Infinity,  // nunca refetch automático (dado estático)
  gcTime: Infinity,     // nunca descarta da memória
})` },
      { title: "useMutation e invalidação", body: "useMutation para operações que alteram dados (POST, PUT, PATCH, DELETE). Callbacks: onMutate (antes, para optimistic updates), onSuccess (após sucesso — invalide queries), onError, onSettled (sempre, para refetch final). Invalide queries relacionadas em onSuccess para sincronizar o cache.", code: `const createPost = useMutation({
  mutationFn: (data: CreatePostInput) =>
    fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.json()),

  onSuccess: (newPost) => {
    // Invalida a lista — forçará refetch:
    queryClient.invalidateQueries({ queryKey: ['posts', 'list'] })
    // Ou adiciona diretamente ao cache sem refetch:
    queryClient.setQueryData(['posts', 'detail', newPost.id], newPost)
  },
  onError: (error) => {
    toast.error('Erro ao criar post: ' + error.message)
  },
})

// Uso:
createPost.mutate({ title: 'Novo post', content: '...' })
// Ou com callback específico:
createPost.mutateAsync(data).then(() => router.push('/posts'))` },
      { title: "Optimistic updates — UX instantânea com rollback", body: "Atualiza o cache antes da resposta do servidor — o usuário vê o resultado imediatamente. Em onMutate: cancel queries em flight + salva estado anterior + aplica atualização otimista. Em onError: rollback. Em onSettled: refetch para garantir consistência.", code: `const toggleLike = useMutation({
  mutationFn: (postId: string) => api.toggleLike(postId),

  onMutate: async (postId) => {
    // Cancela queries em flight para não sobrescrever o otimismo:
    await queryClient.cancelQueries({ queryKey: ['posts'] })
    // Salva estado anterior para rollback:
    const prev = queryClient.getQueryData<Post[]>(['posts'])
    // Aplica update otimista:
    queryClient.setQueryData<Post[]>(['posts'], old =>
      old?.map(p => p.id === postId ? { ...p, liked: !p.liked } : p) ?? []
    )
    return { prev }  // retornado como ctx nos outros callbacks
  },

  onError: (_err, _vars, ctx) => {
    // Rollback:
    if (ctx?.prev) queryClient.setQueryData(['posts'], ctx.prev)
  },

  onSettled: () => {
    // Refetch para garantir consistência com o servidor:
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
})` },
      { title: "Queries dependentes e enabled", body: "Queries que dependem de outras: use enabled para controlar quando a query roda. enabled={!!userId} só executa quando userId existe. Útil para: queries que precisam de auth, queries que dependem de resultado de outra query, queries condicionais.", code: `// Busca o usuário primeiro:
const { data: user } = useQuery({
  queryKey: ['user'],
  queryFn: fetchCurrentUser,
})

// Só busca posts quando o usuário está disponível:
const { data: posts } = useQuery({
  queryKey: ['posts', { userId: user?.id }],
  queryFn: () => fetchUserPosts(user!.id),
  enabled: !!user?.id,  // false = query pausada, não executa nem aparece em loading
})

// select — transforma o dado sem novo fetch:
const { data: postTitles } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  select: (posts) => posts.map(p => p.title),  // só re-renderiza se os títulos mudarem
})` },
      { title: "useInfiniteQuery — scroll infinito", body: "useInfiniteQuery para listas paginadas com carregamento progressivo. Retorna pages (array de páginas) e fetchNextPage(). getNextPageParam extrai o cursor/page da última página para buscar a próxima.", code: `const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['posts', 'infinite'],
  queryFn: ({ pageParam }) =>
    fetch(\`/api/posts?cursor=\${pageParam}&limit=20\`).then(r => r.json()),
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
})

// data.pages é array de páginas — flatten para renderizar:
const allPosts = data?.pages.flatMap(page => page.items) ?? []

// Scroll detection (simplificado):
const ref = useRef<HTMLDivElement>(null)
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting && hasNextPage) fetchNextPage() }
  )
  if (ref.current) observer.observe(ref.current)
  return () => observer.disconnect()
}, [hasNextPage, fetchNextPage])` },
      { title: "SSR com Next.js — dehydrate e HydrationBoundary", body: "Para SSR com Next.js App Router: prefetch no Server Component + hydrate no Client. Usuário recebe HTML já com dados e cache do React Query populado — sem loading state inicial.", code: `// app/posts/page.tsx — Server Component
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { PostList } from './_components/PostList'

export default async function PostsPage() {
  const queryClient = new QueryClient()

  // Prefetch no servidor:
  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPostsFromDB(),
  })

  return (
    // Serializa o cache e passa para o cliente:
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostList />  {/* Client Component — recebe cache já populado */}
    </HydrationBoundary>
  )
}

// app/posts/_components/PostList.tsx — Client Component
'use client'
export function PostList() {
  // Cache já existe — sem loading state inicial:
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,  // só roda se o cache expirar no cliente
  })
  return <ul>{posts?.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}` },
    ],
    interview: [
      {
        q: "O que é o conceito de 'estado de servidor' e por que React Query existe?",
        a: "<p>Estado de servidor são dados que vivem no backend e precisam ser sincronizados com o cliente. Têm características únicas: podem ficar desatualizados (outro usuário criou um post), são assíncronos por natureza, precisam de loading/error states, podem ser cacheados.</p><p>useState + useEffect para gerenciar isso vira boilerplate: loading flag, error state, refetch manual ao mudar filtros, invalidação após mutation, deduplicação de requests. React Query abstrai tudo isso — você declara o que quer buscar e como cachear, ele cuida do ciclo de vida.</p><p>Distinção fundamental: estado de servidor (React Query) ≠ estado de UI (useState/Zustand). Misturar os dois é o erro que React Query resolve.</p>",
        tip: "A distinção clara entre estado de servidor e estado de cliente é o que o entrevistador quer ouvir primeiro. Demonstra que você entende o problema, não só a solução.",
        level: "pleno",
      },
      {
        q: "Como funcionam as query keys e por que são importantes?",
        a: "<p>Query keys são a identidade de um dado no cache — array com hierarquia de especificidade. Mesma key = mesma entrada no cache. Array hierárquico permite invalidação granular: invalidar ['posts'] invalida também ['posts', 'list', { status }] e ['posts', id, 'comments'] — todos os filhos da key.</p><p>Boas práticas: use query factories — objeto que centraliza todas as keys do domínio e evita chaves inconsistentes espalhadas pelo código. Estruture como fatos sobre o dado ('quais posts?', 'de qual usuário?'), não como URLs.</p>",
        tip: "Mostrar query factories e invalidação hierárquica é diferencial claro — a maioria só sabe passar arrays simples e invalidar keys exatas.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre staleTime e gcTime (cacheTime)?",
        a: "<p><strong>staleTime</strong>: por quanto tempo o dado é 'fresco'. Com staleTime=0 (padrão), o dado fica stale imediatamente após o fetch — React Query refetch em background no próximo mount ou window focus. Com staleTime=5min, nenhum background refetch por 5 minutos.</p><p><strong>gcTime</strong>: por quanto tempo um dado inativo (sem nenhum componente observando) permanece na memória antes de ser descartado. Após gcTime, o próximo acesso recomeça do zero — sem dado antigo para mostrar enquanto busca.</p><p>Dado stale ainda é exibido enquanto o refetch acontece (stale-while-revalidate) — é isso que torna o React Query tão bom para UX.</p>",
        tip: "A confusão entre staleTime e gcTime é muito comum. Explicar que dado stale ainda aparece (não desaparece da tela) é o ponto que a maioria não sabe.",
        level: "senior",
      },
      {
        q: "Como implementar optimistic updates com React Query?",
        a: "<p>Três callbacks do useMutation trabalham juntos: (1) <strong>onMutate</strong>: cancele queries em flight (evitar sobreposição), salve o valor anterior do cache, aplique o update otimista no cache, retorne o contexto com o valor anterior. (2) <strong>onError</strong>: use o contexto retornado pelo onMutate para fazer rollback. (3) <strong>onSettled</strong>: invalide para refetch e garantir consistência com o servidor independente do resultado.</p><p>Resultado: UX instantânea com segurança — o usuário vê o resultado imediatamente e em caso de erro a UI reverte automaticamente.</p>",
        tip: "Citar os 3 callbacks com o papel de cada um (onMutate=otimismo, onError=rollback, onSettled=consistência) mostra que você implementou de verdade.",
        level: "senior",
      },
      {
        q: "Como usar React Query com Next.js App Router (Server Components)?",
        a: "<p>Padrão recomendado: prefetch no Server Component + HydrationBoundary no cliente. No Server Component: crie um QueryClient, chame prefetchQuery com a queryFn que busca do banco, serialize com dehydrate. Passe o estado serializado para HydrationBoundary. No Client Component: useQuery com a mesma queryKey — o cache já estará populado, sem loading state inicial.</p><p>Alternativa mais simples para casos simples: passe os dados como props do Server Component e use initialData no useQuery. Desvantagem: React Query não trata esse dado como cache — não refetch em background.</p>",
        level: "senior",
      },
      {
        q: "Quando usar React Query vs SWR vs fetch puro em Server Component?",
        a: "<p><strong>React Query</strong>: mutations com invalidação, optimistic updates, infinite scroll, prefetch com hover, SSR com hidratação, devtools. API mais completa. Bundle ~13KB. Escolha quando a complexidade de dados justifica.</p><p><strong>SWR</strong>: fetching de leitura simples. Bundle menor (~4KB). Menos features que React Query mas suficiente para dashboards sem mutations complexas.</p><p><strong>fetch em Server Component</strong>: dados que só existem no servidor — sem interatividade, sem cache de cliente. É a opção mais simples no App Router quando o dado não precisa ser manipulado no cliente.</p>",
        level: "pleno",
      },
      {
        q: "Como você organizaria queries de múltiplos domínios em um projeto grande?",
        a: "<p>Query factories: para cada domínio (posts, users, comments), crie um objeto que centraliza todas as query keys e queryFns. Isso garante consistência e permite invalidação granular sem magic strings espalhadas.</p><pre><code>// hooks/queries/postQueries.ts\nexport const postQueries = {\n  all:    () => ['posts'] as const,\n  lists:  () => [...postQueries.all(), 'list'] as const,\n  list:   (f: Filters) => [...postQueries.lists(), f] as const,\n  detail: (id: string) => [...postQueries.all(), 'detail', id] as const,\n}</code></pre><p>Combine com hooks customizados por domínio: usePost(id), usePosts(filters), useCreatePost(). Os componentes nunca veem query keys diretamente — só importam os hooks.</p>",
        tip: "Query factories é o padrão recomendado pelo próprio Dominik (maintainer) no blog tkdodo.eu. Citar isso mostra que você vai além da documentação oficial.",
        level: "senior",
      },
      {
        q: "O que é o prop 'enabled' e como usar em queries dependentes?",
        a: "<p>enabled controla se a query deve executar. enabled={false} pausa a query — não busca, não aparece em loading. Essencial para queries que dependem de outra: buscar posts de um usuário que ainda não foi carregado.</p><p>Padrão: useQuery(..., { enabled: !!userId }) — só executa quando userId existe (não é null/undefined/'').</p><p>Também útil para: queries de busca (enabled={query.length > 2}), queries detrás de feature flags, queries que precisam de autenticação verificada primeiro.</p>",
        level: "pleno",
      },
      {
        q: "Como funciona o useInfiniteQuery para scroll infinito?",
        a: "<p>useInfiniteQuery busca dados em páginas. getNextPageParam recebe a última página e retorna o parâmetro para a próxima (cursor, page number). fetchNextPage() busca a próxima página. hasNextPage é true enquanto getNextPageParam retorna algo diferente de undefined.</p><p>data.pages é um array de respostas — faça flatMap para obter todos os itens em um array único. Para detectar o scroll: IntersectionObserver no último elemento da lista, chame fetchNextPage quando entrar no viewport.</p>",
        level: "senior",
      },
      {
        q: "Como funciona o select nas queries e quando usar?",
        a: "<p>O prop select transforma o dado retornado pelo queryFn antes de entregá-lo ao componente. React Query memoriza o resultado — o componente só re-renderiza se o dado transformado mudar, mesmo que o dado bruto no cache seja diferente.</p><p>Casos de uso: extrair apenas um campo de um objeto grande (evitar re-renders desnecessários), transformar formato (API retorna snake_case, componente quer camelCase), filtrar uma lista no cliente sem novo fetch.</p>",
        level: "senior",
      },
      {
        q: "Como configurar React Query globalmente e quais são as opções mais importantes?",
        a: "<p>QueryClient é configurado com defaultOptions no QueryClientProvider. Opções mais importantes: <strong>staleTime</strong> (padrão: 0 — considere 60s globalmente), <strong>gcTime</strong> (padrão: 5min), <strong>retry</strong> (padrão: 3 — considere 1 ou 2 em produção), <strong>refetchOnWindowFocus</strong> (padrão: true — desative se causar requests desnecessários), <strong>refetchOnReconnect</strong> (padrão: true — mantenha).</p><p>Para erros: use queryCache.subscribe para observar e logar erros globalmente. Para DevTools: instale @tanstack/react-query-devtools e adicione no QueryClientProvider — essencial em desenvolvimento para inspecionar o cache.</p>",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre invalidateQueries e refetchQueries?",
        a: "<p><strong>invalidateQueries</strong>: marca as queries como stale. Refetch acontece apenas se houver observers ativos (componentes montados). Se não houver, o refetch ocorre na próxima vez que um componente montar com aquela key.</p><p><strong>refetchQueries</strong>: força refetch imediato independente de observers. Útil quando você quer garantir que o cache está atualizado mesmo sem componente montado.</p><p>Na prática: use invalidateQueries 95% do tempo — é mais eficiente. Use refetchQueries quando precisa de garantia de refetch imediato (ex: após logout para limpar dados sensíveis).</p>",
        tip: "A distinção entre 'marca como stale' e 'força refetch imediato' é o que separa quem usa bem de quem usa no piloto automático.",
        level: "senior",
      },
      {
        q: "O que é staleTime e como difere de gcTime (antigo cacheTime)?",
        a: "<p><strong>staleTime</strong> define por quanto tempo os dados são considerados frescos. Durante esse período, uma nova montagem do mesmo useQuery <em>não</em> vai ao servidor — usa o cache diretamente sem background refetch. Default: 0 (dado é stale imediatamente após o fetch).</p><p><strong>gcTime</strong> (antigo cacheTime) define quanto tempo dados <em>inativos</em> (sem nenhum componente observando) ficam na memória antes de serem descartados pelo garbage collector. Default: 5 minutos. Um dado pode estar <em>stale</em> mas ainda em cache — React Query exibe o dado stale enquanto faz background refetch, criando a UX stale-while-revalidate. Após gcTime sem observers, o dado some da memória e o próximo acesso inicia um loading do zero.</p>",
        tip: "A confusão entre staleTime e gcTime é universal. O ponto decisivo: dado stale ainda aparece na tela durante o refetch. gcTime controla quando some da memória, não quando fica desatualizado.",
        level: "pleno",
      },
      {
        q: "Como usar queryKey de forma hierárquica para invalidação eficiente?",
        a: "<p>queryKey é um array que identifica unicamente uma query no cache. O array suporta hierarquia: <code>['todos']</code> é pai de <code>['todos', 'list']</code> e de <code>['todos', { status: 'active' }]</code>. <code>queryClient.invalidateQueries({ queryKey: ['todos'] })</code> invalida <em>todas</em> as queries que começam com <code>'todos'</code> — filhos incluídos.</p><p>Use <strong>query factories</strong> para centralizar as keys por domínio e evitar strings mágicas espalhadas pelo código:</p><pre><code>const todoQueries = {\n  all: () => ['todos'] as const,\n  lists: () => [...todoQueries.all(), 'list'] as const,\n  list: (filters: Filters) => [...todoQueries.lists(), filters] as const,\n}</code></pre><p>Após uma mutation que cria um todo, invalide <code>todoQueries.all()</code> para atualizar todas as views do domínio de uma vez.</p>",
        tip: "Query factories é o padrão recomendado pelo maintainer Dominik (blog tkdodo.eu). Citar isso mostra que você vai além da documentação oficial.",
        level: "pleno",
      },
      {
        q: "Como funciona prefetchQuery e quando usar?",
        a: "<p><code>queryClient.prefetchQuery</code> inicia o fetch de uma query antes do componente que vai consumi-la ser montado, populando o cache antecipadamente. Quando o componente monta e chama <code>useQuery</code> com a mesma key, o dado já está disponível — sem estado de loading.</p><p><strong>Casos de uso:</strong> hover em links de navegação (prefetch ao hover, dado disponível ao clicar), rotas que provavelmente serão visitadas em seguida, e SSR no Next.js App Router onde você chama <code>prefetchQuery</code> em Server Components para entregar a página com dados já hidratados (padrão com <code>dehydrate</code> + <code>HydrationBoundary</code>).</p>",
        tip: "Mencionar prefetch on hover e a integração com SSR via dehydrate/HydrationBoundary situa a resposta no nível de arquitetura real, não só de hooks básicos.",
        level: "senior",
      },
      {
        q: "Como sincronizar React Query com atualizações em tempo real via WebSocket ou SSE?",
        a: "<p>React Query não gerencia WebSockets diretamente — você integra no ponto de recebimento de eventos. Configure o listener WebSocket/SSE em um hook separado ou em <code>useEffect</code> e, ao receber um evento do servidor, chame:</p><ul><li><code>queryClient.setQueryData(key, newData)</code> — atualiza o cache diretamente com o dado recebido (ideal quando o evento traz o objeto completo).</li><li><code>queryClient.invalidateQueries({ queryKey: key })</code> — marca como stale e dispara refetch (ideal quando o evento apenas sinaliza que algo mudou, sem trazer o dado).</li></ul><p>Isso mantém React Query como fonte de verdade para a UI enquanto o servidor empurra atualizações em tempo real. Importante: crie o listener uma única vez (não dentro do queryFn) e limpe-o em cleanup.</p>",
        tip: "Explicar a diferença entre setQueryData (dado chegou no evento) e invalidateQueries (só o sinal chegou) demonstra que você já resolveu esse problema em produção.",
        level: "senior",
      },
      {
        q: "Como usar useInfiniteQuery para paginação infinita?",
        a: "<p><code>useInfiniteQuery</code> gerencia múltiplas páginas de dados em um único cache entry. <code>getNextPageParam</code> recebe a última página retornada e deve retornar o parâmetro da próxima (cursor, número de página) — ou <code>undefined</code> quando não há mais dados. <code>fetchNextPage()</code> busca a próxima página. <code>hasNextPage</code> é <code>true</code> enquanto <code>getNextPageParam</code> retornar algo diferente de <code>undefined</code>.</p><p><code>data.pages</code> é um array de todas as páginas carregadas — faça <code>flatMap</code> para obter um array único de itens. Para detecção de scroll: use <code>IntersectionObserver</code> no último elemento da lista e chame <code>fetchNextPage()</code> quando ele entrar no viewport. <code>isFetchingNextPage</code> distingue o loading da próxima página do loading inicial.</p>",
        tip: "Detalhar getNextPageParam e a distinção isFetchingNextPage vs isLoading mostra que você implementou infinite scroll de verdade, não só leu a documentação.",
        level: "senior",
      },
      {
        q: "O que é o prop select em useQuery e para que serve?",
        a: "<p>O prop <code>select</code> transforma o dado retornado pelo <code>queryFn</code> antes de entregá-lo ao componente. O dado bruto continua no cache inalterado — <code>select</code> é aplicado apenas na derivação do valor retornado pelo hook.</p><p>React Query memoriza o resultado do <code>select</code>: o componente só re-renderiza se o dado transformado mudar, mesmo que o dado bruto no cache seja atualizado. Para garantir estabilidade de referência e evitar re-renders desnecessários, envolva a função <code>select</code> em <code>useCallback</code>.</p><p>Casos de uso: extrair apenas os campos necessários de um objeto grande (evitar re-renders por campos irrelevantes), transformar formato (snake_case → camelCase), filtrar ou ordenar uma lista no cliente sem novo fetch.</p>",
        tip: "Mencionar que select não muda o cache, só o valor derivado — e que precisa de useCallback para memoização correta — é o detalhe que separa quem leu do tkdodo de quem só usou superficialmente.",
        level: "senior",
      },
      {
        q: "Como implementar optimistic updates com useMutation?",
        a: "<p>Três callbacks do <code>useMutation</code> trabalham juntos para criar UX instantânea com segurança de rollback:</p><ol><li><strong>onMutate</strong>: execute antes da request. Cancele queries em flight (<code>cancelQueries</code>) para evitar que um refetch sobrescreva o update otimista. Salve o estado anterior com <code>getQueryData</code>. Aplique o update otimista com <code>setQueryData</code>. Retorne o estado anterior como contexto.</li><li><strong>onError</strong>: receba o contexto do <code>onMutate</code> e restaure o estado anterior com <code>setQueryData(key, ctx.previous)</code> — rollback automático se a request falhar.</li><li><strong>onSettled</strong>: invalide a query para garantir consistência com o servidor, independente do resultado (sucesso ou erro). O servidor é sempre a fonte de verdade final.</li></ol><p>Resultado: o usuário vê o efeito imediatamente; em caso de erro, a UI reverte automaticamente com o estado real.</p>",
        tip: "Citar os 3 callbacks com papel específico de cada (onMutate=otimismo+contexto, onError=rollback, onSettled=consistência) mostra que você implementou de verdade, não apenas leu.",
        level: "senior",
      },
      {
        q: "Como configurar React Query globalmente e quais opções são mais importantes em produção?",
        a: "<p>O <code>QueryClient</code> aceita <code>defaultOptions</code> que se aplicam a todas as queries do app. Opções mais relevantes para produção:</p><ul><li><strong>staleTime</strong> (padrão: 0): considere 30–60s globalmente para evitar refetches excessivos em dados que não mudam com frequência.</li><li><strong>gcTime</strong> (padrão: 5min): aumente para dados pesados que valem manter em memória; reduza para dados sensíveis.</li><li><strong>retry</strong> (padrão: 3): reduza para 1–2 em produção — 3 retries em endpoints lentos adicionam latência percebida significativa.</li><li><strong>refetchOnWindowFocus</strong> (padrão: true): desative se causar requests desnecessários (ex: app desktop ou dashboard com dados raramente atualizados).</li><li><strong>queryCache.subscribe</strong>: observe erros globalmente para logging centralizado — evita ter <code>onError</code> repetido em cada <code>useQuery</code>.</li></ul><p>DevTools: <code>@tanstack/react-query-devtools</code> no <code>QueryClientProvider</code> — inspecione o cache, status e tempo de cada query durante desenvolvimento.</p>",
        tip: "Demonstrar que você ajusta retry e refetchOnWindowFocus para produção — em vez de deixar os defaults — mostra que você já sofreu com os defaults inadequados em sistema real.",
        level: "pleno",
      },
    ],
    mnemonics: [
      {
        trick: "SGA",
        label: "Ciclo de vida de uma query React Query",
        explanation: "S = Stale (staleTime expirou — dado pode estar desatualizado). G = Garbage collected (gcTime expirou — dado removido da memória quando sem observers). A = Active (algum componente está usando — não será garbage collected). Lembre: um dado vai de Fresh → Stale → Inactive → Garbage. SGA é o caminho de saída de uma query do cache.",
      },
      {
        trick: "CASE",
        label: "Callbacks do useMutation na ordem correta",
        explanation: "C = onMutate: Cancel queries + salvar contexto anterior. A = onSuccess: Atualizar cache (invalidate ou setQueryData). S = onSettled: Sincronizar (refetch final independente do resultado). E = onError: Estado de erro + rollback com o contexto salvo. Lembre 'CASE' como 'Cover All Side Effects'. onMutate e onError lidam com o otimismo e o rollback; onSuccess e onSettled com a atualização do cache.",
      },
      {
        trick: "DEIS",
        label: "Quando usar enabled={false} em queries",
        explanation: "D = Dependente de outra query (dados do userId ainda não disponíveis). E = Esperar input mínimo (busca só com 3+ caracteres). I = Inativada por feature flag ou permissão. S = Suspensa até autenticação confirmada. Lembre 'DEIS' como 'DEsabilita Intelligently, Sênior'. enabled={!!valor} é o padrão — undefined e null são falsy, string vazia também.",
      },
    ],
    cheatsheet: {
      title: "React Query (TanStack Query) — Referência Rápida",
      html: `<style>
.rqc-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.rqc-sec{margin-bottom:18px}
.rqc-title{font-size:9px;color:#FF4154;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid #1e293b}
.rqc-table{width:100%;border-collapse:collapse;font-size:10.5px}
.rqc-table th{color:#475569;font-weight:500;text-align:left;padding:4px 8px;border-bottom:1px solid #1e293b}
.rqc-table td{padding:5px 8px;border-bottom:1px solid #0f172a;vertical-align:top}
.rqc-table tr:hover td{background:#1e293b}
.rqc-name{color:#FF4154}
.rqc-code{color:#94a3b8;font-size:10px}
.rqc-note{color:#475569;font-size:10px}
</style>
<div class="rqc-wrap">
  <p style="color:#FF4154;font-size:12px;font-weight:700;margin:0 0 18px">TanStack Query — Referência Rápida</p>
  <div class="rqc-sec">
    <div class="rqc-title">Hooks principais</div>
    <table class="rqc-table">
      <tr><th>Hook</th><th>Retorna</th><th>Quando usar</th></tr>
      <tr><td class="rqc-name">useQuery</td><td class="rqc-code">data, isLoading, isFetching, isError</td><td class="rqc-note">Buscar e cachear dados</td></tr>
      <tr><td class="rqc-name">useMutation</td><td class="rqc-code">mutate, mutateAsync, isPending</td><td class="rqc-note">Criar, atualizar, deletar</td></tr>
      <tr><td class="rqc-name">useInfiniteQuery</td><td class="rqc-code">data.pages, fetchNextPage, hasNextPage</td><td class="rqc-note">Scroll infinito / paginação</td></tr>
      <tr><td class="rqc-name">useQueryClient</td><td class="rqc-code">queryClient instance</td><td class="rqc-note">Invalidar, setar, prefetch</td></tr>
      <tr><td class="rqc-name">useSuspenseQuery</td><td class="rqc-code">data (sem undefined)</td><td class="rqc-note">Com React Suspense boundary</td></tr>
    </table>
  </div>
  <div class="rqc-sec">
    <div class="rqc-title">Opções de useQuery essenciais</div>
    <table class="rqc-table">
      <tr><th>Opção</th><th>Padrão</th><th>O que faz</th></tr>
      <tr><td class="rqc-name">staleTime</td><td class="rqc-code">0</td><td class="rqc-note">ms que o dado é fresco (sem background refetch)</td></tr>
      <tr><td class="rqc-name">gcTime</td><td class="rqc-code">5min</td><td class="rqc-note">ms que dado inativo fica na memória</td></tr>
      <tr><td class="rqc-name">enabled</td><td class="rqc-code">true</td><td class="rqc-note">false = pausa a query</td></tr>
      <tr><td class="rqc-name">select</td><td class="rqc-code">—</td><td class="rqc-note">Transforma o dado antes de retornar</td></tr>
      <tr><td class="rqc-name">placeholderData</td><td class="rqc-code">—</td><td class="rqc-note">Dado temporário enquanto busca (ex: keepPreviousData)</td></tr>
      <tr><td class="rqc-name">initialData</td><td class="rqc-code">—</td><td class="rqc-note">Dado inicial (SSR props) — conta como cache</td></tr>
      <tr><td class="rqc-name">retry</td><td class="rqc-code">3</td><td class="rqc-note">Tentativas em caso de erro</td></tr>
    </table>
  </div>
  <div class="rqc-sec">
    <div class="rqc-title">QueryClient — métodos importantes</div>
    <table class="rqc-table">
      <tr><th>Método</th><th>O que faz</th></tr>
      <tr><td class="rqc-name">invalidateQueries({ queryKey })</td><td class="rqc-code">Marca como stale — refetch se houver observers</td></tr>
      <tr><td class="rqc-name">refetchQueries({ queryKey })</td><td class="rqc-code">Força refetch imediato</td></tr>
      <tr><td class="rqc-name">setQueryData(key, updater)</td><td class="rqc-code">Atualiza cache manualmente (sem fetch)</td></tr>
      <tr><td class="rqc-name">getQueryData(key)</td><td class="rqc-code">Lê dado do cache</td></tr>
      <tr><td class="rqc-name">prefetchQuery({ queryKey, queryFn })</td><td class="rqc-code">Busca antecipadamente (SSR, hover)</td></tr>
      <tr><td class="rqc-name">cancelQueries({ queryKey })</td><td class="rqc-code">Cancela requests em andamento</td></tr>
      <tr><td class="rqc-name">removeQueries({ queryKey })</td><td class="rqc-code">Remove do cache imediatamente</td></tr>
    </table>
  </div>
  <div class="rqc-sec">
    <div class="rqc-title">Callbacks de useMutation</div>
    <table class="rqc-table">
      <tr><th>Callback</th><th>Parâmetros</th><th>Quando usar</th></tr>
      <tr><td class="rqc-name">onMutate</td><td class="rqc-code">(variables)</td><td class="rqc-note">Optimistic update + salvar contexto</td></tr>
      <tr><td class="rqc-name">onSuccess</td><td class="rqc-code">(data, variables, context)</td><td class="rqc-note">Invalidar queries, redirecionar, toast</td></tr>
      <tr><td class="rqc-name">onError</td><td class="rqc-code">(error, variables, context)</td><td class="rqc-note">Rollback optimistic, mostrar erro</td></tr>
      <tr><td class="rqc-name">onSettled</td><td class="rqc-code">(data, error, variables, ctx)</td><td class="rqc-note">Sempre — refetch final de consistência</td></tr>
    </table>
  </div>
</div>`,
    },
    mindmap: {
      title: "React Query — Mapa mental do ciclo de dados",
      html: `<style>
.rqm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.rqm-center{background:#2a0a0f;border:2px solid #FF4154;border-radius:10px;padding:10px 18px;text-align:center;font-weight:700;font-size:13px;color:#FF4154;display:inline-block}
.rqm-node{background:#1e293b;border:1.5px solid #334155;border-radius:7px;padding:6px 12px;font-size:11px;color:#94a3b8;cursor:default;margin-bottom:5px}
.rqm-node:hover{border-color:#FF4154;color:#e2e8f0}
.rqm-label{font-size:9px;color:#FF4154;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:6px}
.rqm-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:start}
.rqm-col{display:flex;flex-direction:column;gap:12px}
</style>
<div class="rqm-wrap">
  <p style="color:#FF4154;font-size:12px;font-weight:700;margin:0 0 20px">TanStack Query — Mapa de Conceitos</p>
  <div class="rqm-grid">
    <div class="rqm-col">
      <div>
        <div class="rqm-label">Cache e ciclo de vida</div>
        <div class="rqm-node">fresh → stale → inactive → gc</div>
        <div class="rqm-node">staleTime — quando refetch</div>
        <div class="rqm-node">gcTime — quando descartar</div>
        <div class="rqm-node">Background refetch automático</div>
        <div class="rqm-node">Stale-while-revalidate</div>
      </div>
      <div>
        <div class="rqm-label">Query keys</div>
        <div class="rqm-node">['posts'] — escopo de domínio</div>
        <div class="rqm-node">['posts', id] — item específico</div>
        <div class="rqm-node">Hierarquia — invalidar pai invalida filhos</div>
        <div class="rqm-node">Query factories — centralizar keys</div>
      </div>
      <div>
        <div class="rqm-label">Controle de execução</div>
        <div class="rqm-node">enabled — pausar query</div>
        <div class="rqm-node">select — transformar dado</div>
        <div class="rqm-node">placeholderData — dado temporário</div>
        <div class="rqm-node">refetch() — disparar manualmente</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;justify-content:center">
      <div class="rqm-center">React Query<br><span style="font-size:10px;opacity:.7">TanStack Query v5</span></div>
    </div>
    <div class="rqm-col">
      <div>
        <div class="rqm-label">Mutations</div>
        <div class="rqm-node">useMutation — criar/editar/deletar</div>
        <div class="rqm-node">onSuccess → invalidateQueries</div>
        <div class="rqm-node">onMutate → optimistic update</div>
        <div class="rqm-node">onError → rollback</div>
        <div class="rqm-node">onSettled → refetch final</div>
      </div>
      <div>
        <div class="rqm-label">Recursos avançados</div>
        <div class="rqm-node">useInfiniteQuery — scroll infinito</div>
        <div class="rqm-node">prefetchQuery — antecipar dados</div>
        <div class="rqm-node">dehydrate/hydrate — SSR Next.js</div>
        <div class="rqm-node">useSuspenseQuery — Suspense</div>
      </div>
      <div>
        <div class="rqm-label">Ferramentas</div>
        <div class="rqm-node">DevTools — inspecionar cache</div>
        <div class="rqm-node">queryClient.getQueryData</div>
        <div class="rqm-node">queryClient.setQueryData</div>
      </div>
    </div>
  </div>
</div>`,
      caption: "Visão geral do TanStack Query — do ciclo de vida do cache (fresh→stale→gc) às mutations com optimistic updates e SSR.",
    },
    exercises: [
      {
        level: "iniciante",
        title: "Busca de dados com loading e error states",
        description: "Configure o QueryClientProvider numa aplicação React. Crie um hook usePosts() que usa useQuery para buscar posts de uma API pública (jsonplaceholder.typicode.com/posts). No componente, exiba um skeleton enquanto isLoading, mensagem de erro em isError e a lista de posts em data. Adicione um botão de refetch manual.",
        concepts: ["useQuery", "QueryClient", "isLoading vs isFetching", "error handling", "refetch"],
        hint: "isLoading é true apenas na primeira busca. isFetching é true também durante background refetch. Use isFetching para exibir um indicador sutil de atualização sem esconder os dados.",
      },
      {
        level: "intermediario",
        title: "CRUD com useMutation e invalidação de cache",
        description: "Implemente um gerenciador de tarefas com React Query: useQuery para listar, useMutation para criar, useMutation para marcar como concluída (toggle), useMutation para deletar. Cada mutation deve invalidar a lista após sucesso. Implemente um sistema de toast de sucesso/erro. Use query keys hierárquicas com query factory.",
        concepts: ["useMutation", "invalidateQueries", "query keys", "onSuccess", "onError"],
        hint: "Crie um taskQueries factory com all(), lists(), detail(id). invalidateQueries({ queryKey: taskQueries.all() }) invalida tudo relacionado a tasks.",
      },
      {
        level: "senior",
        title: "Optimistic update com rollback automático e SSR",
        description: "Implemente um sistema de 'curtir posts' com optimistic update completo: (1) UI atualiza imediatamente ao clicar, (2) rollback automático se o servidor retornar erro, (3) toast diferenciado para erro de rede vs erro de negócio. Adicione SSR com Next.js App Router: prefetch no Server Component e HydrationBoundary no cliente para que a lista de posts já apareça no HTML sem loading state.",
        concepts: ["optimistic updates", "onMutate", "onError rollback", "onSettled", "dehydrate", "HydrationBoundary"],
        hint: "onMutate deve: cancelar queries em flight, salvar estado anterior, aplicar update otimista, retornar { previousPosts }. onError usa context?.previousPosts para rollback. onSettled invalida sempre para consistência.",
      },
    ],
    videos: [
      { title: "React Query in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=novnyCaa7To", topic: "Visão geral rápida do que React Query resolve" },
      { title: "React Query Tutorial for Beginners", channel: "Codevolution", url: "https://www.youtube.com/playlist?list=PLC3y8-rFHvwjTELCrPrcZlo6blLBUspd2", topic: "Série completa React Query do zero" },
      { title: "React Query — Curso Completo", channel: "Rocketseat", url: "", topic: "React Query com TypeScript e boas práticas" },
      { title: "Dominik Dorfmeister — React Query patterns", channel: "ReactConf", url: "", topic: "Query factories, optimistic updates, SSR avançado" },
      { title: "React Query v5 — What Changed", channel: "TkDodo", url: "", topic: "Breaking changes e novos recursos do v5" },
    ],
    codeExamples: [
      {
        title: "Query factory + hooks customizados por domínio",
        description: "Padrão production-ready: centraliza keys e queryFns em um objeto, expõe hooks semânticos para os componentes.",
        code: `// lib/queries/posts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Post, CreatePostInput, PostFilters } from '@/types'

// Query factory — centraliza todas as keys:
export const postKeys = {
  all:     ()           => ['posts'] as const,
  lists:   ()           => [...postKeys.all(), 'list'] as const,
  list:    (f: PostFilters) => [...postKeys.lists(), f] as const,
  details: ()           => [...postKeys.all(), 'detail'] as const,
  detail:  (id: string) => [...postKeys.details(), id] as const,
}

// Hooks customizados — componentes não veem keys diretamente:
export function usePosts(filters: PostFilters = {}) {
  return useQuery({
    queryKey: postKeys.list(filters),
    queryFn: () => api.posts.list(filters),
    staleTime: 60 * 1000,
    select: (data) => data.items,  // memorizado — re-render só se items mudar
  })
}

export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => api.posts.get(id),
    enabled: !!id,
  })
}

export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePostInput) => api.posts.create(data),
    onSuccess: (newPost) => {
      // Adiciona ao cache sem refetch:
      qc.setQueryData(postKeys.detail(newPost.id), newPost)
      // Invalida listas — serão refetchadas quando acessadas:
      qc.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}`,
        language: "typescript",
      },
      {
        title: "Optimistic update completo — like com rollback",
        description: "Implementação production-ready de optimistic update com rollback e consistência final.",
        code: `// hooks/useToggleLike.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postKeys } from '@/lib/queries/posts'
import type { Post } from '@/types'

export function useToggleLike() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, liked }: { postId: string; liked: boolean }) =>
      api.posts.toggleLike(postId, liked),

    onMutate: async ({ postId, liked }) => {
      // 1. Cancela requests em andamento para não sobrescrever:
      await qc.cancelQueries({ queryKey: postKeys.lists() })

      // 2. Salva estado anterior para rollback:
      const prevLists = qc.getQueryData<Post[]>(postKeys.list({}))

      // 3. Aplica otimismo no cache:
      qc.setQueryData<Post[]>(postKeys.list({}), (old) =>
        old?.map((p) =>
          p.id === postId
            ? { ...p, liked, likesCount: liked ? p.likesCount + 1 : p.likesCount - 1 }
            : p
        ) ?? []
      )

      return { prevLists }  // retornado como ctx nos callbacks seguintes
    },

    onError: (_err, _vars, ctx) => {
      // Rollback — restaura estado anterior:
      if (ctx?.prevLists) {
        qc.setQueryData(postKeys.list({}), ctx.prevLists)
      }
      toast.error('Não foi possível atualizar. Tente novamente.')
    },

    onSettled: () => {
      // Sempre ao final — garante consistência com o servidor:
      qc.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}`,
        language: "typescript",
      },
      {
        title: "useInfiniteQuery — scroll infinito com cursor",
        description: "Scroll infinito production-ready com IntersectionObserver e loading states granulares.",
        code: `// components/InfinitePostList.tsx
'use client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRef, useEffect } from 'react'

function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam }) =>
      fetch(\`/api/posts?cursor=\${pageParam ?? ''}&limit=20\`)
        .then<{ items: Post[]; nextCursor: string | null }>(r => r.json()),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}

export function InfinitePostList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfinitePosts()

  const sentinelRef = useRef<HTMLDivElement>(null)

  // IntersectionObserver — busca mais quando o sentinel entra no viewport:
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasNextPage) fetchNextPage() },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  if (isLoading) return <PostSkeleton count={5} />

  const posts = data?.pages.flatMap((p) => p.items) ?? []

  return (
    <div>
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
      {/* Sentinel — observado pelo IntersectionObserver */}
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && <Spinner />}
      {!hasNextPage && <p>Todos os posts carregados.</p>}
    </div>
  )
}`,
        language: "tsx",
      },
    ],
    diagrams: [
      {
        title: "Ciclo de vida de uma query — stale, fetch, cache",
        html: `<style>
.rq-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.rq-state{border-radius:8px;padding:8px 12px;font-size:11px;text-align:center;border:1.5px solid;flex:1}
.rq-arr{color:#FF4154;font-size:16px;text-align:center;flex-shrink:0}
.rq1-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(255,65,84,.4);display:inline}
.rq1-tip:hover .rq1-tb{display:block}
.rq1-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:210px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.rq1-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
</style>
<div class="rq-diag">
  <p style="color:#FF4154;font-size:12px;font-weight:700;margin:0 0 16px">React Query — ciclo de vida de uma query</p>
  <div style="display:flex;gap:6px;align-items:center;margin-bottom:16px;flex-wrap:wrap">
    <div class="rq-state" style="background:#1a2a3a;border-color:#38bdf8;color:#38bdf8">
      <span class="rq1-tip">fresh<span class="rq1-tb">staleTime ainda não expirou. Nenhum refetch em background. Dado considerado atual — React Query não vai buscar novamente.</span></span>
      <div style="font-size:9px;color:#475569;margin-top:4px">staleTime não expirou</div>
    </div>
    <div class="rq-arr">→</div>
    <div class="rq-state" style="background:#2a1a0a;border-color:#fb923c;color:#fb923c">
      <span class="rq1-tip">stale<span class="rq1-tb">staleTime expirou (default: imediatamente). React Query vai refetch em background na próxima oportunidade: mount, focus de janela, reconexão.</span></span>
      <div style="font-size:9px;color:#475569;margin-top:4px">staleTime expirou</div>
    </div>
    <div class="rq-arr">→</div>
    <div class="rq-state" style="background:#2a1a1a;border-color:#ef4444;color:#ef4444">
      <span class="rq1-tip">fetching<span class="rq1-tb">Refetch em background. O dado antigo (stale) ainda é exibido — sem tela de loading. isFetching=true. Quando termina, cache atualizado.</span></span>
      <div style="font-size:9px;color:#475569;margin-top:4px">refetch em background</div>
    </div>
    <div class="rq-arr">→</div>
    <div class="rq-state" style="background:#1a2a1a;border-color:#4ade80;color:#4ade80">
      <span class="rq1-tip">fresh<span class="rq1-tb">Fetch completou. Dado atualizado no cache. staleTime começa a contar novamente.</span></span>
      <div style="font-size:9px;color:#475569;margin-top:4px">dado atualizado</div>
    </div>
  </div>
  <div style="display:flex;gap:10px">
    <div style="flex:1;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px">
      <div style="font-size:9px;color:#FF4154;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">staleTime = 0 (padrão)</div>
      <div style="color:#94a3b8;line-height:1.6">Dado é imediatamente stale após fetch. Refetch em background em qualquer mount ou window focus. Sempre atualizado — mais requests de rede.</div>
    </div>
    <div style="flex:1;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px">
      <div style="font-size:9px;color:#4ade80;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">staleTime = 5min</div>
      <div style="color:#94a3b8;line-height:1.6">Dado é fresco por 5 min após o último fetch. Zero refetch em background nesse período. Menos requests — bom para dados estáveis como configurações.</div>
    </div>
  </div>
</div>`,
        caption: "staleTime controla quando o dado vira stale (dispara refetch). gcTime controla quando o dado inativo é removido da memória. Stale ≠ removido — dado stale ainda aparece enquanto refetch acontece em background.",
      },
    ],
    gotchas: [
      "Query key muito genérica (ex: ['users']) cacheia todos os usuários juntos — use keys específicas com parâmetros: ['users', { page, filter }]. Invalidar ['users'] invalida todas as variações.",
      "Refetch automático em window focus pode surpreender — o usuário alterna a aba e a tela 'pisca' com novos dados. Configure refetchOnWindowFocus: false globalmente se não for desejado.",
      "Estado de servidor e estado de cliente são conceitos distintos. Não use React Query para UI local (modal aberto, input de formulário) — use useState ou Zustand.",
      "isLoading vs isFetching: isLoading=true apenas na primeira busca (sem dado no cache). isFetching=true em qualquer refetch incluindo background. Misturar os dois esconde dados antigos desnecessariamente.",
      "Optimistic update sem cancelQueries em onMutate pode sobrescrever o update otimista com uma resposta antiga. Sempre cancele queries em flight antes de aplicar o otimismo.",
      "QueryClient deve ser criado fora do componente (ou com useMemo/useRef) para não ser recriado em cada render — isso limparia o cache inteiro.",
      "gcTime menor que staleTime não faz sentido: dados poderiam ser descartados da memória antes de ficarem stale. gcTime deve ser sempre maior ou igual a staleTime.",
      "select memoiza por igualdade referencial. Se o select retornar um novo objeto/array a cada chamada, o componente vai re-renderizar mesmo sem mudança real — use valores primitivos ou memoize com useMemo.",
    ],
    resources: [
      { title: "TanStack Query docs", url: "https://tanstack.com/query/latest", kind: "docs" },
      { title: "Dominik Dorfmeister — blog Practical React Query", url: "https://tkdodo.eu/blog/practical-react-query", kind: "artigo" },
      { title: "TanStack Query DevTools", url: "https://tanstack.com/query/latest/docs/framework/react/devtools", kind: "pratica" },
      { title: "Query Key Factory pattern", url: "https://tkdodo.eu/blog/effective-react-query-keys", kind: "artigo" },
      { title: "TanStack Query GitHub", url: "https://github.com/TanStack/query", kind: "pratica" },
      { title: "TanStack Query — SSR com Next.js", url: "https://tanstack.com/query/latest/docs/framework/react/guides/ssr", kind: "docs" },
    ],
}

export default reactQuery
