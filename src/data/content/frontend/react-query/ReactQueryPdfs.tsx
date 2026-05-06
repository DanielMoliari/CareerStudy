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
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion, CompScenario } from '@/components/pdfs/ComparativeRefPdf'

// ── Paleta React Query ──────────────────────────────────────────────────────────
const C   = '#FF4154'
const GRN = '#4ade80'
const AMB = '#f59e0b'
const SKY = '#38bdf8'
const PRP = '#a78bfa'

// ── Metadados dos PDFs ──────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 20 perguntas de React Query — estado de servidor vs cliente, query keys hierárquicas, staleTime vs gcTime, optimistic updates com rollback, SSR com Next.js, useInfiniteQuery, prefetch e WebSocket integration — com resposta estruturada para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Hooks, opções, QueryClient e padrões numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: assinatura dos 5 hooks principais, todas as opções de useQuery, métodos do QueryClient, callbacks de useMutation e padrão de query factory. Tudo que você precisa checar rapidamente sem abrir a documentação.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'SGA, CASE e DEIS — os truques que grudam',
    type: 'mnemonics',
    pages: 2,
    description: 'SGA para o ciclo fresh→stale→gc, CASE para os callbacks do useMutation na ordem correta, DEIS para quando usar enabled=false. Associações que grudam na memória e são acionáveis na entrevista.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 5 erros mais comuns — e como corrigir',
    type: 'antipatterns',
    pages: 3,
    description: 'Os anti-patterns mais comuns: queryKey instável, fetch em useEffect, isLoading durante refetch, omitir onSettled no optimistic update, invalidar chave errada. Com código errado × correto e explicação do porquê.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'comparative',
    title: 'React Query vs Alternativas',
    subtitle: 'RQ × SWR × RTK Query × fetch — tabela de decisão',
    type: 'comparative',
    pages: 2,
    description: 'Tabela densa comparando React Query, SWR, RTK Query e fetch puro em 8 critérios: cache, mutations, devtools, bundle size, SSR, infinite scroll, TypeScript e curva de aprendizado. Com cenários de quando usar cada um — resposta pronta para a entrevista.',
    icon: '05',
    goal: 'Decisão técnica defensável',
  },
]

// ── Dados: Q&A ──────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é "estado de servidor" e por que React Query existe?',
    a: 'Estado de servidor são dados que vivem no backend e precisam ser sincronizados com o cliente. Têm características únicas: podem ficar desatualizados, são assíncronos, precisam de loading/error states e podem ser cacheados. useState + useEffect para isso vira boilerplate sem cache, sem deduplicação e sem retry automático. React Query abstrai o ciclo de vida: fetching, caching, background refetch.',
    bullets: [
      'Estado de servidor ≠ estado de UI (useState/Zustand).',
      'React Query abstrai o ciclo de vida: fetching, caching, background refetch.',
      'Elimina boilerplate: loading flag, error state, refetch manual.',
    ],
    tip: 'A distinção clara entre estado de servidor e estado de cliente é o que o entrevistador quer ouvir primeiro.',
  },
  {
    level: 'Pleno',
    q: 'Como funcionam as query keys e por que são importantes?',
    a: "Query keys são a identidade de um dado no cache — array com hierarquia de especificidade. Mesma key = mesma entrada no cache. Array hierárquico permite invalidação granular: invalidar ['posts'] invalida ['posts', id] e ['posts', id, 'comments'] — todos os filhos.",
    bullets: [
      'Use query factories para centralizar keys por domínio.',
      'Só primitivos na key — objetos inline causam refetch desnecessário.',
      'invalidateQueries hierárquico: pai invalida todos os filhos.',
    ],
    tip: 'Mostrar query factories é diferencial — a maioria só sabe passar arrays simples.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre staleTime e gcTime?',
    a: 'staleTime: por quanto tempo o dado é "fresco". Com staleTime=0 (padrão), o dado fica stale imediatamente — React Query refetch em background no próximo mount ou window focus. gcTime: por quanto tempo dado inativo (sem observers) permanece na memória antes de ser descartado. Dado stale ainda é exibido durante o refetch (stale-while-revalidate).',
    bullets: [
      'staleTime controla quando background refetch ocorre.',
      'gcTime controla quando o dado some da memória.',
      'Dado stale NÃO desaparece — aparece enquanto refetch acontece.',
    ],
    tip: 'A confusão entre staleTime e gcTime é universal. Enfatize que dado stale ainda aparece na tela.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre isLoading e isFetching?',
    a: 'isLoading: true apenas na primeira busca quando não há dado em cache. isFetching: true sempre que há fetch em andamento, incluindo background refetch com dado antigo disponível. Use isLoading para exibir skeleton (sem dado). Use isFetching para indicadores sutis durante background refetch.',
    bullets: [
      'isLoading = primeira vez, sem dado no cache.',
      'isFetching = qualquer fetch, incluindo background refetch.',
      'Exibir skeleton só com isLoading — não esconder dados durante refetch.',
    ],
    tip: 'Usar isLoading para esconder dados durante refetch é o anti-pattern mais comum. Deixe claro que isFetching serve para indicadores sutis.',
  },
  {
    level: 'Pleno',
    q: 'O que é o prop enabled e como usar em queries dependentes?',
    a: 'enabled controla se a query deve executar. enabled={false} pausa a query — não busca, não aparece em loading. Essencial para queries que dependem de outra: buscar posts de um usuário que ainda não foi carregado.',
    bullets: [
      'enabled={!!userId}: só executa quando userId existe.',
      'Também útil para buscas com input mínimo: enabled={query.length > 2}.',
      "Status: 'pending' quando pausada, não 'loading'.",
    ],
    tip: 'Demonstrar um caso real de query dependente mostra domínio prático.',
  },
  {
    level: 'Pleno',
    q: 'Como configurar React Query globalmente?',
    a: 'QueryClient é configurado com defaultOptions no QueryClientProvider. Opções mais importantes: staleTime (padrão 0 — considere 60s globalmente), gcTime (5min), retry (3 — reduza para 1-2 em produção), refetchOnWindowFocus (true — desative se desnecessário), queryCache.subscribe para logging de erros global.',
    bullets: [
      'staleTime global evita refetch excessivo.',
      'retry: 1-2 em produção — 3 retries em endpoints lentos adicionam latência percebida.',
      'DevTools: @tanstack/react-query-devtools no QueryClientProvider.',
    ],
    tip: 'Mencionar ajuste de retry para produção mostra que você já sofreu com os defaults.',
  },
  {
    level: 'Senior',
    q: 'Como implementar optimistic updates com useMutation?',
    a: 'Três callbacks trabalham juntos: (1) onMutate: cancelQueries em flight + getQueryData para salvar estado anterior + setQueryData para aplicar update otimista + retornar contexto. (2) onError: usar contexto para rollback. (3) onSettled: invalidateQueries para consistência final.',
    bullets: [
      'cancelQueries evita que refetch em andamento sobrescreva o otimismo.',
      'onError recebe ctx retornado por onMutate — use para rollback.',
      'onSettled sempre executa — garante consistência independente do resultado.',
    ],
    tip: 'Citar os 3 callbacks com papel específico de cada mostra que você implementou de verdade.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre invalidateQueries e refetchQueries?',
    a: 'invalidateQueries: marca queries como stale. Refetch acontece apenas se houver observers ativos (componentes montados). Se não houver, o refetch ocorre na próxima montagem. refetchQueries: força refetch imediato independente de observers. Use invalidateQueries 95% do tempo — mais eficiente.',
    bullets: [
      'invalidateQueries: marca como stale, refetch condicional ao observer.',
      'refetchQueries: força fetch imediato mesmo sem componente montado.',
      'Use refetchQueries após logout para limpar dados sensíveis.',
    ],
    tip: 'A distinção "marca como stale" vs "força refetch imediato" separa quem usa bem de quem usa no piloto automático.',
  },
  {
    level: 'Senior',
    q: 'Como usar React Query com Next.js App Router?',
    a: 'Padrão recomendado: prefetch no Server Component + HydrationBoundary no cliente. No Server Component: crie QueryClient, chame prefetchQuery, serialize com dehydrate. No Client Component: useQuery com a mesma queryKey — cache já populado, sem loading inicial.',
    bullets: [
      'dehydrate serializa o cache e passa ao cliente via HydrationBoundary.',
      'Alternativa mais simples: initialData no useQuery — mas sem background refetch.',
      'Funciona com Suspense: useSuspenseQuery + Suspense boundary no cliente.',
    ],
    tip: 'Mencionar dehydrate/HydrationBoundary vs initialData e o tradeoff situa a resposta em nível de arquitetura.',
  },
  {
    level: 'Senior',
    q: 'Como usar useInfiniteQuery para scroll infinito?',
    a: 'useInfiniteQuery gerencia múltiplas páginas. getNextPageParam recebe a última página e retorna o parâmetro da próxima (cursor ou page) — undefined quando acabou. fetchNextPage() busca a próxima página. data.pages é array de todas as páginas — faça flatMap para um array único.',
    bullets: [
      'getNextPageParam: retorna undefined quando não há mais páginas.',
      'isFetchingNextPage: loading da próxima página (vs isLoading da primeira).',
      'IntersectionObserver no último item → chama fetchNextPage quando no viewport.',
    ],
    tip: 'Detalhar isFetchingNextPage vs isLoading e IntersectionObserver mostra implementação real.',
  },
  {
    level: 'Senior',
    q: 'Como integrar React Query com WebSocket para tempo real?',
    a: 'React Query não gerencia WebSockets diretamente. Configure o listener em useEffect e ao receber evento do servidor: setQueryData(key, newData) se o evento traz o dado completo, ou invalidateQueries({queryKey}) se o evento sinaliza que algo mudou. React Query permanece como source of truth.',
    bullets: [
      'setQueryData: evento traz o objeto completo — injeta diretamente no cache.',
      'invalidateQueries: evento sinaliza mudança — dispara refetch.',
      'Crie o listener uma única vez fora do queryFn — limpe em cleanup.',
    ],
    tip: 'A diferença entre setQueryData e invalidateQueries nesse contexto demonstra que você já resolveu isso em produção.',
  },
  {
    level: 'Senior',
    q: 'O que é o prop select em useQuery e para que serve?',
    a: 'O prop select transforma o dado retornado pelo queryFn antes de entregá-lo ao componente. O dado bruto continua no cache inalterado. React Query memoriza o resultado — o componente só re-renderiza se o dado transformado mudar. Envolva em useCallback para garantir estabilidade de referência.',
    bullets: [
      'select não muda o cache — só o valor derivado retornado pelo hook.',
      'Memoização: re-render só se o resultado do select mudar.',
      'Usos: extrair campos específicos, transformar formato, filtrar lista.',
    ],
    tip: 'Mencionar que select não muda o cache e precisa de useCallback para memoização é o detalhe de quem leu o tkdodo.',
  },
  {
    level: 'Senior',
    q: 'Como organizar queries de múltiplos domínios em projeto grande?',
    a: "Query factories: para cada domínio (posts, users, comments), crie um objeto que centraliza todas as keys e queryFns. Combine com hooks customizados: usePost(id), usePosts(filters), useCreatePost(). Os componentes nunca veem query keys diretamente — só importam os hooks.",
    bullets: [
      "Query factory: objeto com all(), lists(), list(filters), detail(id).",
      'Hooks customizados por domínio encapsulam keys e queryFns.',
      'Invalidar postKeys.all() atualiza todas as views do domínio de uma vez.',
    ],
    tip: 'Query factories é o padrão recomendado pelo maintainer Dominik (tkdodo.eu). Citar isso mostra que você vai além da documentação.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona prefetchQuery e quando usar?',
    a: 'prefetchQuery inicia o fetch antes do componente que vai consumir os dados ser montado. Quando o componente monta com useQuery da mesma key, o dado já está disponível — sem loading state. Casos: hover em links de navegação (prefetch ao hover), rotas próximas, SSR com Next.js.',
    bullets: [
      'Hover prefetch: ao hoverar em um link, prefetch a próxima página.',
      'SSR: chame prefetchQuery em Server Components para hidratar o cliente.',
      'queryClient.prefetchQuery({ queryKey, queryFn }) — sem observers.',
    ],
    tip: 'Mencionar prefetch on hover e SSR situa a resposta em nível de arquitetura real.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar React Query vs SWR vs fetch em Server Component?',
    a: 'React Query: mutations com invalidação, optimistic updates, infinite scroll, SSR com hidratação, devtools — para complexidade justificada (~13KB). SWR: fetching de leitura simples, bundle menor (~4KB). fetch em Server Component: dados que existem só no servidor, sem interatividade, sem cache de cliente.',
    bullets: [
      'React Query: complexidade de dados, mutations frequentes.',
      'SWR: dashboards simples sem mutations complexas.',
      'Server Component: dado não precisa ser manipulado no cliente.',
    ],
    tip: 'Ser honesto sobre quando NÃO usar React Query demonstra maturidade técnica.',
  },
  {
    level: 'Senior',
    q: 'Como usar placeholderData para melhorar UX em paginação?',
    a: 'placeholderData: keepPreviousData (ou função que retorna dado anterior) mantém os dados da página atual visíveis enquanto a próxima página carrega. O usuário não vê loading state entre páginas — UX muito mais suave. isFetching=true indica que novos dados estão sendo carregados.',
    bullets: [
      'placeholderData: keepPreviousData — mantém dado anterior durante refetch.',
      'isPlaceholderData: true indica que o dado exibido é o anterior.',
      'Combine com isFetching para indicador sutil de carregamento.',
    ],
    tip: 'A distinção entre placeholderData (UI suave) e initialData (conta como cache) é o nível que separa pleno de sênior.',
  },
  {
    level: 'Senior',
    q: 'Como usar useSuspenseQuery e quando preferir sobre useQuery?',
    a: 'useSuspenseQuery integra com React Suspense boundary. data sempre definida — sem checar isLoading. O componente "suspende" e o boundary exibe o fallback. Prefira quando: você tem Suspense boundary no pai, quer centralizar loading states, usa useTransition para transições não-bloqueantes.',
    bullets: [
      'Requer Suspense boundary no ancestral — sem ele, erro de runtime.',
      'data sempre definida: sem isLoading, sem undefined check.',
      'useTransition + useSuspenseQuery: transições não-bloqueantes no App Router.',
    ],
    tip: 'Mencionar a necessidade do Suspense boundary e o erro sem ele mostra que você testou de verdade.',
  },
  {
    level: 'Pleno',
    q: 'Como usar mutate vs mutateAsync?',
    a: 'mutate: fire-and-forget, callbacks via onSuccess/onError/onSettled da configuração. mutateAsync: retorna Promise — use com async/await. Permite capturar o resultado diretamente ou encadear lógica após a mutation. onSuccess/onError ainda disparam normalmente.',
    bullets: [
      'mutate: sem await, callbacks na configuração do useMutation.',
      'mutateAsync: com await, permite redirect ou lógica após a mutation.',
      'Envolver mutateAsync em try/catch se usar no componente.',
    ],
    tip: 'A distinção mutate (callbacks) vs mutateAsync (Promise) é usada em entrevista para ver se você sabe o padrão correto de redirect após form submit.',
  },
  {
    level: 'Senior',
    q: 'Como usar queryCache.subscribe para logging global de erros?',
    a: "queryCache.subscribe observa eventos do cache — incluindo erros. Configure no QueryClient para logging centralizado sem onError repetido em cada useQuery. Recebe events com { type, query, error }. Integre com Sentry ou Datadog para captura automática de todos os erros de fetch.",
    bullets: [
      'Evita onError duplicado em cada useQuery — centraliza o logging.',
      "Integre com Sentry: queryCache.subscribe(event => captureException(event.error)).",
      "Filtre por event.type === 'observerResultsUpdated' e query.state.status === 'error'.",
    ],
    tip: 'Demonstrar conhecimento de queryCache.subscribe é o detalhe de nível staff — poucos sabem disso.',
  },
  {
    level: 'Senior',
    q: 'Como React Query lida com retry e backoff automático?',
    a: 'Por padrão: retry=3 (tenta 3x antes de erro), retryDelay com exponential backoff. retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000). Personalizar: retry pode ser boolean, número ou função que recebe count e error — retornar false em erros 4xx (não adianta retentar).',
    bullets: [
      'Padrão retry=3 com exponential backoff automático.',
      'retry: (count, err) => err.status !== 404 && count < 3 — evitar retry em 404.',
      'Em produção: retry=1-2 — 3 retries em endpoints lentos aumentam latência percebida.',
    ],
    tip: 'Customizar retry para não retentar em erros 4xx é a otimização de produção que demonstra experiência.',
  },
]

// ── Dados: Cheatsheet ───────────────────────────────────────────────────────────

const CS_HOOKS: HookItem[] = [
  { name: 'useQuery',           sig: '{ queryKey, queryFn, staleTime?, enabled?, select?, placeholderData? }',  desc: 'Busca e cacheia dados — retorna { data, isLoading, isFetching, isError, error }' },
  { name: 'useMutation',        sig: '{ mutationFn, onMutate?, onSuccess?, onError?, onSettled? }',              desc: 'Criar/atualizar/deletar — retorna { mutate, mutateAsync, isPending, isError }' },
  { name: 'useInfiniteQuery',   sig: '{ queryKey, queryFn, getNextPageParam, initialPageParam }',                desc: 'Paginação infinita — data.pages, fetchNextPage(), hasNextPage' },
  { name: 'useSuspenseQuery',   sig: '{ queryKey, queryFn } — requer Suspense boundary',                        desc: 'Integração com Suspense — data sempre definida, sem isLoading check' },
  { name: 'useQueryClient',     sig: 'const qc = useQueryClient()',                                              desc: 'Acesso ao QueryClient — invalidate, setQueryData, prefetch, getQueryData' },
]

const CS_PATTERNS: PatternItem[] = [
  {
    name: 'Query factory',
    code: "const postKeys = { all: () => ['posts'], list: (f) => [...postKeys.all(), 'list', f], detail: (id) => [...postKeys.all(), id] }",
    desc: 'Centraliza keys por domínio — invalide postKeys.all() para atualizar tudo relacionado a posts',
  },
  {
    name: 'Custom hook por domínio',
    code: "export function usePosts(filters) { return useQuery({ queryKey: postKeys.list(filters), queryFn: () => api.posts.list(filters) }) }",
    desc: 'Componentes nunca veem query keys diretamente — apenas importam hooks semânticos',
  },
  {
    name: 'Mutation com invalidação',
    code: "useMutation({ mutationFn: createPost, onSuccess: () => qc.invalidateQueries({ queryKey: postKeys.all() }) })",
    desc: 'Padrão CRUD básico — invalidar o domínio inteiro após sucesso',
  },
  {
    name: 'Optimistic update completo',
    code: 'onMutate: async (v) => { await qc.cancelQueries(key); const prev = qc.getQueryData(key); qc.setQueryData(key, updater); return { prev } }',
    desc: 'cancelQueries + getQueryData + setQueryData + retornar contexto para rollback',
  },
  {
    name: 'SSR com Next.js',
    code: 'const qc = new QueryClient(); await qc.prefetchQuery(opts); return <HydrationBoundary state={dehydrate(qc)}><Client /></HydrationBoundary>',
    desc: 'Server Component prefetcha; HydrationBoundary hidrata o cache no cliente',
  },
]

const CS_DEP_ROWS: DepRow[] = [
  ['staleTime: 0',          'Padrão — dado é stale imediatamente após fetch'],
  ['staleTime: 60_000',     'Dado fresco por 1min — sem background refetch nesse período'],
  ['staleTime: Infinity',   'Nunca refetch automático — dado estático (config, países)'],
  ['gcTime: 5 * 60_000',    'Padrão — dado inativo 5min na memória antes de ser removido'],
  ['retry: 3',              'Padrão — 3 tentativas antes de marcar como erro'],
  ['retry: 1',              'Recomendado em produção — menos latência percebida em falhas'],
  ['enabled: !!userId',     'Query pausada até userId existir — queries dependentes'],
  ['refetchOnWindowFocus',  'Padrão: true — desative se causar requests desnecessários'],
]

const CS_RULES: RuleItem[] = [
  { ok: true,  t: 'Use apenas primitivos na queryKey — strings, números, booleans' },
  { ok: false, t: 'Objetos inline na queryKey — criados novos a cada render' },
  { ok: true,  t: 'isLoading para skeleton (sem dado); isFetching para indicador sutil' },
  { ok: false, t: 'Esconder dados com isLoading durante background refetch' },
  { ok: true,  t: 'onSettled sempre invalida para garantir consistência com o servidor' },
  { ok: false, t: 'Omitir onSettled no optimistic update — cache pode ficar inconsistente' },
  { ok: true,  t: 'Query factories centralizam keys e evitam magic strings espalhadas' },
  { ok: false, t: 'Magic strings de queryKey duplicadas em múltiplos componentes' },
]

const CS_TIPS: string[] = [
  'Dado stale ainda aparece na tela durante o background refetch (stale-while-revalidate)',
  'cancelQueries no onMutate é obrigatório em optimistic updates — evita sobrescrever o otimismo',
  'select é memoizado — componente só re-renderiza se o dado transformado mudar',
  '@tanstack/react-query-devtools é essencial em desenvolvimento — inspecione o cache visualmente',
  "invalidateQueries hierárquico: ['posts'] invalida tudo que começa com 'posts'",
]

const CS_MENTAL_MODELS: string[] = [
  'Servidor = fonte da verdade; cache local = snapshot com TTL',
  'staleTime = por quanto tempo confio no snapshot; gcTime = por quanto tempo guardo na memória',
  'Mutation = ação; invalidation = sincronização; optimistic update = otimismo com rede de segurança',
]

// ── Dados: Mnemônicos ───────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Ciclo de vida de uma query no cache',
    trick: 'SGA',
    expansion: [
      ['S', 'Stale — staleTime expirou, dado pode estar desatualizado'],
      ['G', 'Garbage collected — gcTime expirou, removido da memória'],
      ['A', 'Active — componente observando, não será coletado'],
    ],
    explanation: 'SGA é o caminho de saída de uma query do cache. Fresh → Stale → Inactive → Garbage. Stale significa que o dado está pronto para ser atualizado em background — não que desapareceu. Garbage collected significa que o próximo acesso começa do zero (loading real).',
    example: 'staleTime: 60_000 → dado Fresh por 1min → Stale → qualquer mount ou window focus dispara background refetch → se ninguém observar por 5min → Garbage collected',
    why: 'Confundir Stale com "dado removido" é o erro mais comum. Stale ainda aparece na tela durante o refetch — isso é o stale-while-revalidate que torna React Query tão bom para UX.',
  },
  {
    label: 'Callbacks do useMutation na ordem correta',
    trick: 'CASE',
    expansion: [
      ['C', 'onMutate — Cancel queries + salvar Contexto anterior'],
      ['A', 'onSuccess — Atualizar cache (invalidate ou setQueryData)'],
      ['S', 'onSettled — Sincronizar (refetch final independente do resultado)'],
      ['E', 'onError — Estado de Erro + rollback com o contexto salvo'],
    ],
    explanation: 'CASE como "Cover All Side Effects". onMutate e onError lidam com o otimismo e o rollback. onSuccess e onSettled com a atualização do cache. Nunca omita onSettled — é o que garante consistência final com o servidor.',
    example: 'Curtir post: onMutate cancela requests, salva estado anterior, aplica like. onSuccess invalida. onSettled invalida novamente (garante). onError restaura estado anterior.',
    why: 'Implementar só onSuccess e onError sem onSettled é o erro que deixa o cache inconsistente em casos de erro parcial. CASE garante que você cobre todos os casos.',
  },
  {
    label: 'Quando usar enabled=false em queries',
    trick: 'DEIS',
    expansion: [
      ['D', 'Dependente de outra query — userId ainda não disponível'],
      ['E', 'Esperar input mínimo — busca só com 3+ caracteres'],
      ['I', 'Inativada por feature flag ou permissão insuficiente'],
      ['S', 'Suspensa até autenticação confirmada'],
    ],
    explanation: "DEIS como 'DEsabilita Intelligently, Sênior'. enabled={!!valor} é o padrão — undefined e null são falsy, string vazia também. Quando enabled=false a query fica em status 'pending', não 'loading'.",
    example: "const { data: user } = useQuery({...}); const { data: posts } = useQuery({ queryKey: ['posts', user?.id], enabled: !!user?.id })",
    why: 'Não usar enabled em queries dependentes causa erros de runtime — a queryFn tenta usar valores undefined. enabled={!!valor} é a guarda mais segura.',
  },
]

// ── Dados: Anti-patterns ────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'queryKey instável — objeto inline',
    badDesc: 'Objeto criado a cada render = key diferente a cada render = refetch infinito',
    badCode: [
      { t: 'useQuery({' },
      { t: '  queryKey: ' }, { t: "[{ userId, page }]", c: '#ef4444' },
      { t: '  // objeto = nova referência a cada render', c: '#475569' },
      { t: '})' },
    ],
    goodDesc: 'Use primitivos — React Query compara por valor, não por referência',
    goodCode: [
      { t: 'useQuery({' },
      { t: '  queryKey: ' }, { t: "['posts', userId, page]", c: '#4ade80' },
      { t: '  // primitivos = comparação estável', c: '#475569' },
      { t: '})' },
    ],
    why: 'Objetos inline são criados novos a cada render. React Query compara keys por valor estrutural para strings/números, mas objetos precisam de estabilidade de referência. Use apenas primitivos.',
  },
  {
    title: 'Fetch em useEffect em vez de useQuery',
    badDesc: 'Boilerplate manual sem cache, deduplicação, retry ou background refetch',
    badCode: [
      { t: 'const [data, setData] = useState(null)' },
      { t: 'useEffect(() => {', c: '#ef4444' },
      { t: "  fetch('/api/posts')" },
      { t: '    .then(r => r.json())' },
      { t: '    .then(d => setData(d))' },
      { t: '}, [userId])', c: '#ef4444' },
    ],
    goodDesc: 'useQuery cuida de tudo com menos código e mais funcionalidades',
    goodCode: [
      { t: 'const { data, isLoading } = useQuery({', c: '#4ade80' },
      { t: "  queryKey: ['posts', userId]," },
      { t: "  queryFn: () => fetch('/api/posts')" },
      { t: '    .then(r => r.json()),' },
      { t: '  staleTime: 60_000,' },
      { t: '})', c: '#4ade80' },
    ],
    why: 'useEffect para fetch não tem cache, não deduplica requests paralelos, não faz retry automático, não faz background refetch. React Query resolve tudo isso com menos código.',
  },
  {
    title: 'isLoading para ocultar dados durante refetch',
    badDesc: 'isLoading=true esconde dados existentes durante background refetch',
    badCode: [
      { t: 'const { data, isLoading } = useQuery(...)' },
      { t: 'if (isLoading) return <Skeleton />', c: '#ef4444' },
      { t: '// UX quebrada: dados somem durante refetch', c: '#475569' },
    ],
    goodDesc: 'isLoading só para primeira busca; isFetching para indicador sutil',
    goodCode: [
      { t: 'const { data, isLoading, isFetching } = useQuery(...)' },
      { t: 'if (isLoading) return <Skeleton />', c: '#4ade80' },
      { t: '{isFetching && <Spinner size="sm" />}', c: '#4ade80' },
      { t: '// dados permanecem visíveis durante refetch', c: '#475569' },
    ],
    why: 'isLoading é true apenas na primeira busca. Durante background refetch, isLoading=false e dados estão disponíveis. Usar isLoading para ocultar dados destrói a UX stale-while-revalidate.',
  },
  {
    title: 'Omitir onSettled no optimistic update',
    badDesc: 'Sem onSettled, cache pode ficar inconsistente com o servidor após erro',
    badCode: [
      { t: 'useMutation({' },
      { t: '  mutationFn: toggleLike,' },
      { t: '  onMutate: async () => { /* otimismo */ },', c: '#ef4444' },
      { t: '  onError: (_, __, ctx) => { /* rollback */ },', c: '#ef4444' },
      { t: '  // sem onSettled = cache pode ser inconsistente', c: '#475569' },
      { t: '})' },
    ],
    goodDesc: 'onSettled sempre invalida para consistência final',
    goodCode: [
      { t: 'useMutation({' },
      { t: '  mutationFn: toggleLike,' },
      { t: '  onMutate: async () => { /* otimismo */ },' },
      { t: '  onError: (_, __, ctx) => { /* rollback */ },' },
      { t: '  onSettled: () => {', c: '#4ade80' },
      { t: "    qc.invalidateQueries({ queryKey: ['posts'] })", c: '#4ade80' },
      { t: '  },', c: '#4ade80' },
      { t: '})' },
    ],
    why: 'onSettled executa sempre (sucesso ou erro). Sem ele, o cache pode ficar com dado otimista incorreto após erro parcial. É o último escudo de consistência.',
  },
  {
    title: 'Magic strings de queryKey espalhadas',
    badDesc: 'Strings duplicadas causam invalidação incorreta e bugs silenciosos',
    badCode: [
      { t: "// ComponentA.tsx", c: '#475569' },
      { t: "useQuery({ queryKey: ['posts', userId], ... })" },
      { t: "// ComponentB.tsx — TYPO: 'post' sem 's'", c: '#ef4444' },
      { t: "useQuery({ queryKey: ['post', userId], ... })" },
      { t: "// Mutation invalida ['posts'] — ComponentB nunca atualiza", c: '#ef4444' },
    ],
    goodDesc: "Query factory centraliza todas as keys — typos viram erros de TypeScript",
    goodCode: [
      { t: "// queries/postKeys.ts", c: '#475569' },
      { t: 'export const postKeys = {', c: '#4ade80' },
      { t: "  all:    () => ['posts'] as const," },
      { t: '  detail: (id: string) => [...postKeys.all(), id] as const,' },
      { t: '}', c: '#4ade80' },
      { t: "useQuery({ queryKey: postKeys.detail(userId), ... })" },
    ],
    why: 'Query factories centralizam todas as keys de um domínio. Typos viram erros de TypeScript. Invalide postKeys.all() e todos os filhos são atualizados — sem magic strings.',
  },
]

// ── Dados: Comparative ─────────────────────────────────────────────────────────

const COMP_OPTIONS: CompOption[] = [
  { name: 'React Query (v5)',  color: '#FF4154' },
  { name: 'SWR',              color: '#38bdf8' },
  { name: 'RTK Query',        color: '#a78bfa' },
  { name: 'fetch puro',       color: '#4ade80' },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Cache automático',
    category: 'Core',
    values: {
      'React Query (v5)': 'staleTime, gcTime, background refetch, stale-while-revalidate',
      'SWR': 'revalidation, dedupe, focusThrottleInterval — mais simples',
      'RTK Query': 'cache semelhante ao React Query, ligado ao Redux store',
      'fetch puro': 'sem cache de cliente — novo fetch a cada render',
    },
    winner: 'React Query (v5)',
  },
  {
    criterion: 'Mutations com callbacks',
    category: 'Core',
    values: {
      'React Query (v5)': 'useMutation: onMutate, onSuccess, onError, onSettled — optimistic updates',
      'SWR': 'mutate() simples, sem callbacks estruturados — menos ergonômico',
      'RTK Query': 'endpoints com invalidatesTags — acoplado ao Redux',
      'fetch puro': 'implementação manual com useEffect + useState',
    },
    winner: 'React Query (v5)',
  },
  {
    criterion: 'DevTools e DX',
    category: 'Experiência',
    values: {
      'React Query (v5)': 'DevTools visuais (@tanstack/react-query-devtools), TypeScript excelente',
      'SWR': 'sem DevTools próprios, TypeScript ok',
      'RTK Query': 'Redux DevTools maduros, verbose',
      'fetch puro': 'sem abstração — total controle, zero overhead',
    },
    winner: 'React Query (v5)',
  },
  {
    criterion: 'Bundle size',
    category: 'Performance',
    values: {
      'React Query (v5)': '~13KB gzipped — custo justificável pela DX em projetos complexos',
      'SWR': '~4KB gzipped — muito leve, melhor para apps simples',
      'RTK Query': '~15KB (Redux + RTK + RTK Query) — só se já usa Redux',
      'fetch puro': '0KB — nativo do browser',
    },
    winner: 'SWR',
  },
  {
    criterion: 'SSR / Next.js App Router',
    category: 'Integração',
    values: {
      'React Query (v5)': 'dehydrate + HydrationBoundary + prefetchQuery em Server Components',
      'SWR': 'fallback prop — funciona mas menos ergonômico',
      'RTK Query': 'possível com setup mais complexo',
      'fetch puro': 'é exatamente o caso de uso de Server Components',
    },
    winner: 'React Query (v5)',
  },
  {
    criterion: 'Scroll infinito',
    category: 'Features',
    values: {
      'React Query (v5)': 'useInfiniteQuery com getNextPageParam — nativo e ergonômico',
      'SWR': 'useSWRInfinite — funciona bem',
      'RTK Query': 'implementação manual',
      'fetch puro': 'tudo manual com useState + useEffect',
    },
    winner: 'React Query (v5)',
  },
  {
    criterion: 'Curva de aprendizado',
    category: 'Experiência',
    values: {
      'React Query (v5)': 'conceitos de cache, staleTime, gcTime — leva alguns dias',
      'SWR': 'API mínima — mais fácil de começar',
      'RTK Query': 'requer entender Redux + RTK antes',
      'fetch puro': 'sem curva — você já sabe',
    },
    winner: 'SWR',
  },
  {
    criterion: 'Quando usar',
    category: 'Decisão',
    values: {
      'React Query (v5)': 'Mutations frequentes, optimistic updates, infinite scroll, SSR complexo',
      'SWR': 'Apps de leitura simples, dashboards, bundle budget apertado',
      'RTK Query': 'Projeto já usa Redux/RTK — evita adicionar outra lib de cache',
      'fetch puro': 'Server Components, dados que não precisam de cache de cliente',
    },
    winner: 'React Query (v5)',
  },
]

const COMP_SCENARIOS: CompScenario[] = [
  {
    scenario: 'CRUD com optimistic updates',
    recommendation: 'React Query',
    reason: 'useMutation com onMutate/onError/onSettled é a abstração mais ergonômica para esse padrão',
  },
  {
    scenario: 'Dashboard de leitura, sem mutations',
    recommendation: 'SWR',
    reason: 'Bundle menor, API mais simples, cobre 100% do caso de uso sem overhead',
  },
  {
    scenario: 'App Next.js com Server Components',
    recommendation: 'fetch puro + React Query nos Client Components',
    reason: 'Server Components usam fetch nativo; React Query nos Client Components que precisam de interatividade',
  },
  {
    scenario: 'Projeto com Redux já estabelecido',
    recommendation: 'RTK Query',
    reason: 'Sem adicionar nova lib de cache — aproveita o store Redux existente',
  },
]

// ── Builders ────────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'React Query',
    stackLabel: 'Frontend — Data Fetching',
    coverTitle: 'React Query Q&A Review',
    coverSubtitle: 'TanStack Query v5 — nível pleno/sênior',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'React Query',
    accentColor: C,
    stackLabel: 'Frontend — Data Fetching',
    coverTitle: 'React Query CheatSheet',
    coverSubtitle: 'Hooks, opções, QueryClient e padrões',
    sections: {
      hooks: CS_HOOKS,
      depRows: CS_DEP_ROWS,
      rules: CS_RULES,
      performanceTips: CS_TIPS,
      patterns: CS_PATTERNS,
      mentalModels: CS_MENTAL_MODELS,
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'React Query',
    stackLabel: 'Frontend — Data Fetching',
    coverTitle: 'React Query Mnemônicos',
    coverSubtitle: 'SGA, CASE e DEIS — os truques que grudam',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'React Query',
    stackLabel: 'Frontend — Data Fetching',
    coverTitle: 'React Query Anti-patterns',
    coverSubtitle: 'Os 5 erros mais comuns — e como corrigir',
  }),
  comparative: () => buildComparativeRefPdf({
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    scenarios: COMP_SCENARIOS,
    skillName: 'React Query',
    accentColor: C,
    stackLabel: 'Frontend — Data Fetching',
    coverTitle: 'React Query vs Alternativas',
  }),
}

// ── Componente ──────────────────────────────────────────────────────────────────

export default function ReactQueryPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />)}
      </div>
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
