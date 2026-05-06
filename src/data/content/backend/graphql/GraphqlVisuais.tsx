'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { HookTimeline } from '@/components/visuals/HookTimeline'
import type { TimelinePhase } from '@/components/visuals/HookTimeline'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'

// ── Paleta GraphQL ────────────────────────────────────────────────────────────
const C      = '#E10098'   // GraphQL pink
const C2     = '#ff4dc4'   // rosa claro
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const RED    = '#ef4444'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'

void LINE; void FG; void FGMUTE; void PRP; void SKY

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Query Execution Flow (SequenceDiagram)
// ═══════════════════════════════════════════════════════════════════════════════

const GQL_ACTORS: SeqActor[] = [
  { id: 'client',   label: 'Cliente',          color: '#e2e8f0' },
  { id: 'server',   label: 'GraphQL Server',   color: C },
  { id: 'resolver', label: 'Resolvers',        color: AMB },
  { id: 'db',       label: 'Data Sources',     color: GRN },
]

const GQL_MESSAGES: SeqMessage[] = [
  { from: 'client',   to: 'server',   label: 'POST /graphql — query document',          note: 'Sempre POST. Body: { query, variables, operationName }', type: 'sync' },
  { from: 'server',   to: 'server',   label: 'Parse — query text → AST',               note: 'Lexer + Parser converte a string em uma Abstract Syntax Tree. Erros de sintaxe retornam aqui.' },
  { from: 'server',   to: 'server',   label: 'Validate — AST vs Schema',                note: 'Valida campos, tipos, argumentos e regras de complexidade. Sem executar resolver algum.' },
  { from: 'server',   to: 'resolver', label: 'Execute — resolver raiz (Query.field)',   note: 'Executor percorre AST, chama resolver raiz com (null, args, ctx, info)', type: 'sync' },
  { from: 'resolver', to: 'db',       label: 'Busca dado principal',                    note: 'Ex: SELECT * FROM users WHERE id = $1', type: 'sync' },
  { from: 'db',       to: 'resolver', label: 'Resultado (parent object)',               type: 'return' },
  { from: 'resolver', to: 'resolver', label: 'Resolve campos filhos (posts, profile…)', note: 'Cada campo filho tem seu resolver chamado com parent = resultado do pai', type: 'sync' },
  { from: 'resolver', to: 'db',       label: 'Busca dados relacionados',               note: 'Sem DataLoader: 1 query por item → N+1', type: 'sync' },
  { from: 'db',       to: 'resolver', label: 'Resultados',                             type: 'return' },
  { from: 'resolver', to: 'server',   label: 'Árvore de resultados montada',           type: 'return' },
  { from: 'server',   to: 'client',   label: '{ data: {...} } ou { errors: [...] }',   note: 'Resposta pode ter data E errors simultaneamente — erros parciais são válidos em GraphQL', type: 'return' },
]

const GQL_GROUPS: SeqGroup[] = [
  { label: 'Parse + Validate (sem I/O)', kind: 'ref', fromMsg: 1, toMsg: 2, color: PRP },
  { label: 'Execution chain — resolver a resolver', kind: 'loop', fromMsg: 3, toMsg: 9, color: AMB },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Schema Anatomy (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const SCHEMA_LAYERS: Layer[] = [
  {
    id: 'scalars',
    label: 'Scalars & Enums',
    sublabel: 'Tipos folha — não têm sub-campos',
    description: 'Scalars são os tipos primitivos: String, Int, Float, Boolean, ID (built-in) + customizados (Date, Upload, UUID). Enums definem conjuntos fixos de valores. São os nós folha do grafo de tipos.',
    examples: ['scalar Date', 'scalar Upload', 'enum Role { ADMIN USER GUEST }', 'type ID = String (opaque)'],
    color: FGMUTE,
    icon: '🔤',
  },
  {
    id: 'types',
    label: 'Object Types',
    sublabel: 'Nós do grafo — campos e relações',
    description: 'Types são os objetos do domínio. Cada campo tem um tipo (scalar ou outro object type). Interface e Union permitem polimorfismo. Input types são usados exclusivamente como argumentos.',
    examples: ['type User { id: ID! name: String! posts: [Post!]! }', 'interface Node { id: ID! }', 'union SearchResult = User | Post', 'input CreateUserInput { name: String! }'],
    color: C2,
    icon: '📦',
  },
  {
    id: 'queries',
    label: 'Query Type',
    sublabel: 'Ponto de entrada — leitura',
    description: 'O type Query define todos os campos que clientes podem solicitar. Queries são idempotentes — sem efeitos colaterais. O servidor pode executar múltiplos campos em paralelo.',
    examples: ['type Query { user(id: ID!): User, users(filter: UserFilter): [User!]! }', 'Executor pode rodar user() e users() em paralelo', 'Nenhum efeito colateral'],
    color: GRN,
    icon: '🔍',
  },
  {
    id: 'mutations',
    label: 'Mutation Type',
    sublabel: 'Ponto de entrada — escrita',
    description: 'Mutations definem operações que modificam estado. Múltiplos campos de uma Mutation são executados em série (não paralelo). Retornam o objeto modificado para permitir refetch inline.',
    examples: ['type Mutation { createUser(input: CreateUserInput!): User!, deleteUser(id: ID!): Boolean! }', 'Múltiplas mutations em série (não paralelo)', 'Retornar objeto atualizado evita refetch separado'],
    color: RED,
    icon: '✏️',
  },
  {
    id: 'subscriptions',
    label: 'Subscription Type',
    sublabel: 'Ponto de entrada — tempo real',
    description: 'Subscriptions estabelecem conexão persistente (WebSocket ou SSE) e publicam eventos quando dados mudam. O servidor usa pub/sub (Redis, in-memory) para distribuir eventos.',
    examples: ['type Subscription { messageAdded(roomId: ID!): Message! }', 'WebSocket (graphql-ws) ou SSE (graphql-sse)', 'PubSub: Redis para múltiplas instâncias'],
    color: C,
    icon: '📡',
  },
  {
    id: 'directives',
    label: 'Directives',
    sublabel: 'Meta-instruções do schema e queries',
    description: 'Directives modificam comportamento do schema ou da query. Built-in: @deprecated, @include(if: Bool) e @skip(if: Bool). Custom directives implementam lógica transversal: @auth, @rateLimit.',
    examples: ['@deprecated(reason: "Use newField")', '@include(if: $showEmail)', '@skip(if: $hidePrice)', '@auth(requires: ADMIN) — custom directive'],
    color: AMB,
    icon: '🏷️',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — N+1 & DataLoader Timeline (HookTimeline)
// ═══════════════════════════════════════════════════════════════════════════════

const DATALOADER_PHASES: TimelinePhase[] = [
  {
    id: 'query',
    emoji: '①',
    name: 'Query Recebida',
    color: C,
    short: 'Cliente envia query pedindo lista de posts com autor.',
    detail: 'O executor GraphQL inicia a travessia do campo Query.posts. O resolver de posts executa uma query e retorna N objetos. Para cada objeto, Post.author será chamado individualmente.',
    code: [
      [{ text: 'query {', color: C }],
      [{ text: '  posts {' }],
      [{ text: '    id title' }],
      [{ text: '    author {', color: AMB }, { text: '     # ← problema aqui', color: '#475569' }],
      [{ text: '      name avatar' }],
      [{ text: '    }' }],
      [{ text: '  }' }],
      [{ text: '}' }],
    ],
  },
  {
    id: 'resolvers-fire',
    emoji: '②',
    name: 'Resolvers Disparados (N+1)',
    color: RED,
    short: 'Post.author chamado para CADA post — 1 query por item.',
    detail: 'O executor chama Post.author para cada post individualmente. Sem DataLoader: 10 posts = 10 queries de banco. O event loop fica bloqueado com round-trips desnecessários.',
    code: [
      [{ text: '// Resolver sem DataLoader (N+1):', color: '#475569' }],
      [{ text: 'async', color: AMB }, { text: ' author(parent, _, ctx) {' }],
      [{ text: '  // Chamado para CADA post!', color: RED }],
      [{ text: '  return', color: AMB }, { text: ' db.query(' }],
      [{ text: "    'SELECT * FROM users WHERE id=$1',", color: '#4ade80' }],
      [{ text: '    [parent.authorId]', color: RED }],
      [{ text: '  ) // 10 posts → 10 queries', color: RED }],
      [{ text: '}' }],
    ],
  },
  {
    id: 'batch-collection',
    emoji: '③',
    name: 'DataLoader Batching',
    color: AMB,
    short: 'DataLoader usa process.nextTick() para acumular IDs do mesmo tick.',
    detail: 'Todos os loader.load(id) chamados no mesmo tick síncrono são coletados. No próximo tick, DataLoader chama a batchFn com todos os IDs de uma vez — 1 query IN para N posts.',
    code: [
      [{ text: '// DataLoader por REQUEST (no context):', color: '#475569' }],
      [{ text: 'const', color: AMB }, { text: ' userLoader = ' }, { text: 'new', color: AMB }, { text: ' DataLoader(' }],
      [{ text: '  async', color: AMB }, { text: ' (ids) => {' }],
      [{ text: '    const', color: AMB }, { text: ' users = ' }, { text: 'await', color: AMB }, { text: ' db.query(' }],
      [{ text: "      'SELECT * FROM users WHERE id=ANY($1)',", color: '#4ade80' }],
      [{ text: '      [ids]' }],
      [{ text: '    )' }],
      [{ text: '    // Retorna na MESMA ORDEM:', color: '#475569' }],
      [{ text: '    return', color: AMB }, { text: ' ids.map(id => users.find(u => u.id===id))' }],
      [{ text: '  }' }],
      [{ text: ')' }],
    ],
  },
  {
    id: 'batch-execute',
    emoji: '④',
    name: 'Batch Executado',
    color: GRN,
    short: '1 query para todos os autores. Sempre 2 queries total.',
    detail: 'No próximo tick, DataLoader chama a batchFn com todos os IDs coletados. Uma única query WHERE id IN (1,2,3...) traz todos os autores. O resultado é distribuído para cada Promise individual.',
    code: [
      [{ text: '// Resolver COM DataLoader:', color: '#475569' }],
      [{ text: 'async', color: AMB }, { text: ' author(parent, _, ctx) {' }],
      [{ text: '  // ctx.loaders.user é o DataLoader', color: '#475569' }],
      [{ text: '  return', color: AMB }, { text: ' ctx.loaders.user' }],
      [{ text: '    .load(parent.authorId)', color: GRN }],
      [{ text: '  // 10 posts → loader.load() × 10', color: '#475569' }],
      [{ text: '  // DataLoader combina: WHERE id IN (...)', color: GRN }],
      [{ text: '  // → 1 query para todos os autores', color: GRN }],
      [{ text: '}' }],
    ],
  },
  {
    id: 'distribution',
    emoji: '⑤',
    name: 'Resultados Distribuídos',
    color: C2,
    short: 'Cada Promise recebe seu objeto. Cache por request evita recarregar.',
    detail: 'DataLoader distribui os resultados para cada Promise individual. O cache interno evita recarregar o mesmo autor múltiplas vezes no mesmo request. Cache DEVE ser por request — nunca global.',
    code: [
      [{ text: '// DataLoader garante ordem correta:', color: '#475569' }],
      [{ text: '// batchFn recebe [1, 2, 3, 1]' }],
      [{ text: '// retorna [UserA, UserB, UserC, UserA]', color: GRN }],
      [{ text: '// (UserA do cache na 2ª vez)', color: '#475569' }],
      [{ text: '' }],
      [{ text: '// Cache por request (não global!):', color: '#475569' }],
      [{ text: 'new', color: AMB }, { text: ' DataLoader(fn, { cache: ', color: '#e2e8f0' }, { text: 'true', color: GRN }, { text: ' })' }],
      [{ text: '// Cada request tem seu próprio cache', color: '#475569' }],
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — REST vs GraphQL (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const RESTGQL_OPTIONS: ComparisonOption[] = [
  { id: 'REST',    label: 'REST',    color: SKY },
  { id: 'GraphQL', label: 'GraphQL', color: C },
  { id: 'tRPC',    label: 'tRPC',    color: '#398CCB' },
]

const RESTGQL_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'overfetching',
    label: 'Overfetching (dados extras)',
    values: {
      'REST':    { rating: 'poor',      note: 'endpoint retorna tudo' },
      'GraphQL': { rating: 'excellent', note: 'cliente define campos' },
      'tRPC':    { rating: 'good',      note: 'TypeScript inference' },
    },
  },
  {
    id: 'underfetching',
    label: 'Underfetching (múltiplos requests)',
    values: {
      'REST':    { rating: 'poor',      note: 'N endpoints para N recursos' },
      'GraphQL': { rating: 'excellent', note: '1 query para tudo' },
      'tRPC':    { rating: 'fair',      note: '1 call por procedure' },
    },
  },
  {
    id: 'type-safety',
    label: 'Type safety end-to-end',
    values: {
      'REST':    { rating: 'fair',      note: 'OpenAPI/Swagger (gerado)' },
      'GraphQL': { rating: 'good',      note: 'codegen (graphql-codegen)' },
      'tRPC':    { rating: 'excellent', note: 'nativo TypeScript' },
    },
  },
  {
    id: 'learning-curve',
    label: 'Curva de aprendizado',
    values: {
      'REST':    { rating: 'excellent', note: 'baixa — padrão conhecido' },
      'GraphQL': { rating: 'fair',      note: 'média — schema, resolvers, N+1' },
      'tRPC':    { rating: 'good',      note: 'baixa se já usa TS' },
    },
  },
  {
    id: 'cdn-cache',
    label: 'Caching HTTP (CDN)',
    values: {
      'REST':    { rating: 'excellent', note: 'GET cacheable nativamente' },
      'GraphQL': { rating: 'poor',      note: 'POST por padrão — requer APQ' },
      'tRPC':    { rating: 'fair',      note: 'GET queries suportado' },
    },
  },
  {
    id: 'realtime',
    label: 'Real-time (subscriptions)',
    values: {
      'REST':    { rating: 'fair',      note: 'SSE/polling' },
      'GraphQL': { rating: 'excellent', note: 'Subscriptions nativo' },
      'tRPC':    { rating: 'fair',      note: 'experimental' },
    },
  },
  {
    id: 'introspection',
    label: 'Introspection / auto-docs',
    values: {
      'REST':    { rating: 'fair',      note: 'Swagger (manual/gerado)' },
      'GraphQL': { rating: 'excellent', note: 'automático via schema' },
      'tRPC':    { rating: 'fair',      note: 'via TypeScript types' },
    },
  },
  {
    id: 'external-clients',
    label: 'Clientes externos',
    values: {
      'REST':    { rating: 'excellent', note: 'universal — qualquer HTTP client' },
      'GraphQL': { rating: 'good',      note: 'bom com SDL público' },
      'tRPC':    { rating: 'poor',      note: 'TypeScript-only' },
    },
  },
  {
    id: 'n-plus-one',
    label: 'N+1 problem',
    values: {
      'REST':    { rating: 'fair',   note: 'pode ter no backend' },
      'GraphQL': { rating: 'poor',   note: 'garantido sem DataLoader' },
      'tRPC':    { rating: 'fair',   note: 'depende do impl.' },
    },
  },
  {
    id: 'when-to-use',
    label: 'Quando usar',
    values: {
      'REST':    { rating: 'good',  note: 'APIs públicas, B2B, simples' },
      'GraphQL': { rating: 'good',  note: 'Produto com mobile+web, múltiplos clients' },
      'tRPC':    { rating: 'good',  note: 'Monorepo TypeScript fullstack' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Anti-patterns GraphQL (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const GQL_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'N+1 sem DataLoader — query por item',
    wrong: [
      [{ text: 'const resolvers = {' }],
      [{ text: '  Post: {' }],
      [{ text: '    async author(parent) {' }],
      [{ text: '      // N queries para N posts!', color: '#475569' }],
      [{ text: '      return db.users.findOne(', color: RED }],
      [{ text: '        { id: parent.authorId }', color: RED }],
      [{ text: '      )', color: RED }],
      [{ text: '    }' }],
      [{ text: '  }' }],
      [{ text: '}' }],
    ],
    right: [
      [{ text: 'const resolvers = {' }],
      [{ text: '  Post: {' }],
      [{ text: '    author(parent, _, ctx) {' }],
      [{ text: '      // 1 query para todos os posts', color: '#475569' }],
      [{ text: '      return ctx.loaders', color: GRN }],
      [{ text: '        .user.load(parent.authorId)', color: GRN }],
      [{ text: '    }' }],
      [{ text: '  }' }],
      [{ text: '}' }],
    ],
    why: 'Resolver de lista chama 1 query por item. 100 posts → 101 queries. DataLoader batching agrupa todos os IDs do mesmo tick em 1 query IN — sempre 2 queries total independente do N.',
  },
  {
    title: 'DataLoader global — cache entre usuários',
    wrong: [
      [{ text: '// GLOBAL — cache vaza entre usuários!', color: '#475569' }],
      [{ text: 'const userLoader = new DataLoader(', color: RED }],
      [{ text: '  batchUsers', color: RED }],
      [{ text: ')', color: RED }],
      [{ text: 'const server = new ApolloServer({' }],
      [{ text: '  context: () => ({ userLoader })', color: RED }],
      [{ text: '})' }],
    ],
    right: [
      [{ text: '// Por REQUEST — cache isolado', color: '#475569' }],
      [{ text: 'const server = new ApolloServer({' }],
      [{ text: '  context: () => ({', color: GRN }],
      [{ text: '    loaders: {', color: GRN }],
      [{ text: '      user: new DataLoader(batchUsers)', color: GRN }],
      [{ text: '    }', color: GRN }],
      [{ text: '  })', color: GRN }],
      [{ text: '})' }],
    ],
    why: 'DataLoader com cache compartilhado entre requests vaza dados entre usuários. Usuário A vê dados cacheados do usuário B. DataLoader DEVE ser criado por request no context factory.',
  },
  {
    title: 'Introspection habilitada em produção',
    wrong: [
      [{ text: '// Apollo Server 4 — default: habilitado', color: '#475569' }],
      [{ text: 'new ApolloServer({' }],
      [{ text: '  schema,' }],
      [{ text: '  // introspection sempre ligado', color: RED }],
      [{ text: '  // atacante descobre todos os tipos', color: RED }],
      [{ text: '})' }],
    ],
    right: [
      [{ text: 'new ApolloServer({' }],
      [{ text: '  schema,' }],
      [{ text: '  introspection:', color: GRN }],
      [{ text: "    process.env.NODE_ENV !== 'production'", color: GRN }],
      [{ text: '  // Dev: habilitado para GraphiQL', color: '#475569' }],
      [{ text: '  // Prod: desabilitado', color: '#475569' }],
      [{ text: '})' }],
    ],
    why: 'Introspection expõe o schema completo — todos os tipos, campos e relações. Em produção facilita ataques. Desabilitar em produção, manter em dev.',
  },
  {
    title: 'Sem depth/complexity limiting — DoS por query',
    wrong: [
      [{ text: '# Query maliciosa sem limite:', color: '#475569' }],
      [{ text: 'query {', color: RED }],
      [{ text: '  user(id: "1") {', color: RED }],
      [{ text: '    friends { friends {', color: RED }],
      [{ text: '      friends { friends {', color: RED }],
      [{ text: '        # 100 níveis de profundidade', color: '#475569' }],
      [{ text: '      }}}}}}', color: RED }],
      [{ text: '}', color: RED }],
    ],
    right: [
      [{ text: '// graphql-depth-limit:', color: '#475569' }],
      [{ text: "import depthLimit from 'graphql-depth-limit'", color: GRN }],
      [{ text: 'new ApolloServer({' }],
      [{ text: '  validationRules: [', color: GRN }],
      [{ text: '    depthLimit(7) // máx 7 níveis', color: GRN }],
      [{ text: '  ]', color: GRN }],
      [{ text: '})' }],
    ],
    why: 'Query profundamente aninhada (user{friends{friends{...}}}) pode causar exponencial de resolvers. Sem limite: qualquer cliente pode derrubar o servidor com uma query.',
  },
  {
    title: 'Sem persisted queries em produção',
    wrong: [
      [{ text: '// Cada request envia a query completa:', color: '#475569' }],
      [{ text: 'fetch("/graphql", {', color: RED }],
      [{ text: "  method: 'POST'," }],
      [{ text: '  body: JSON.stringify({' }],
      [{ text: '    query: `query GetUser($id: ID!) {', color: RED }],
      [{ text: '      user(id: $id) { name email ... }', color: RED }],
      [{ text: '    `', color: RED }],
      [{ text: '  })' }],
      [{ text: '})' }],
    ],
    right: [
      [{ text: '// APQ: envia só o hash (GET cacheable):', color: '#475569' }],
      [{ text: 'fetch(`/graphql?', color: GRN }],
      [{ text: '  extensions={"persistedQuery":{', color: GRN }],
      [{ text: '    "version":1,', color: GRN }],
      [{ text: '    "sha256Hash":"abc123..."}}', color: GRN }],
      [{ text: '  &variables={"id":"1"}`', color: GRN }],
      [{ text: '// CDN cacheia o GET!', color: '#475569' }],
    ],
    why: 'Queries grandes enviadas a cada request desperdiçam bandwidth e impedem cache na CDN. Persisted queries (APQ) enviam hash — CDN cacheia GET requests. Body da query trafega uma única vez.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Subscription Lifecycle (HookTimeline)
// ═══════════════════════════════════════════════════════════════════════════════

const SUB_PHASES: TimelinePhase[] = [
  {
    id: 'connect',
    emoji: '①',
    name: 'WebSocket Connect',
    color: C,
    short: 'Cliente abre WebSocket. Handshake graphql-ws. Autenticação via connection_init.',
    detail: 'O protocolo graphql-ws (novo) ou subscriptions-transport-ws (legado) realiza o handshake. O servidor autentica via connection_init payload. Sessão persistente estabelecida.',
    code: [
      [{ text: "import { createClient } from 'graphql-ws'" }],
      [{ text: '' }],
      [{ text: 'const', color: AMB }, { text: ' client = createClient({' }],
      [{ text: "  url: 'wss://api.app.com/graphql'," }],
      [{ text: '  connectionParams: () => ({' }],
      [{ text: "    authToken: localStorage.getItem('token')", color: GRN }],
      [{ text: '  })' }],
      [{ text: '})' }],
    ],
  },
  {
    id: 'subscribe',
    emoji: '②',
    name: 'Subscribe',
    color: AMB,
    short: 'Cliente envia query de subscription. Servidor valida e registra no PubSub.',
    detail: 'Cliente envia mensagem de subscription com a query. O servidor valida a query contra o schema e registra o subscriber no pub/sub. O resolver define o canal de escuta (asyncIterableIterator).',
    code: [
      [{ text: 'const resolvers = {' }],
      [{ text: '  Subscription: {' }],
      [{ text: '    messageAdded: {' }],
      [{ text: '      subscribe: (_, { roomId }, { pubsub }) =>' }],
      [{ text: '        pubsub.asyncIterableIterator(', color: GRN }],
      [{ text: '          `ROOM_${roomId}`', color: GRN }],
      [{ text: '        ),' }],
      [{ text: '      resolve: (payload) => payload.message' }],
      [{ text: '    }' }],
      [{ text: '  }' }],
      [{ text: '}' }],
    ],
  },
  {
    id: 'publish',
    emoji: '③',
    name: 'Evento Publicado',
    color: RED,
    short: 'Mutation publica evento no PubSub. Distribuído para todos os subscribers.',
    detail: 'Quando uma mutation cria/modifica dado relevante, ela publica um evento no canal PubSub. O servidor distribui para todos os subscribers registrados naquele canal.',
    code: [
      [{ text: 'const resolvers = {' }],
      [{ text: '  Mutation: {' }],
      [{ text: '    async', color: AMB }, { text: ' sendMessage(_, { roomId, text }, { pubsub }) {' }],
      [{ text: '      const', color: AMB }, { text: ' message = await db.create({ roomId, text })' }],
      [{ text: '      await', color: AMB }, { text: ' pubsub.publish(', color: GRN }],
      [{ text: '        `ROOM_${roomId}`,', color: GRN }],
      [{ text: '        { message }', color: GRN }],
      [{ text: '      )' }],
      [{ text: '      return', color: AMB }, { text: ' message' }],
      [{ text: '    }' }],
      [{ text: '  }' }],
      [{ text: '}' }],
    ],
  },
  {
    id: 'deliver',
    emoji: '④',
    name: 'Entrega ao Cliente',
    color: GRN,
    short: 'Servidor executa resolver, aplica selection set e envia via WebSocket.',
    detail: 'O servidor executa o resolver de subscription com o payload do evento, aplica a selection set do cliente (filtrando campos) e envia via WebSocket. O cliente recebe a resposta GraphQL padrão.',
    code: [
      [{ text: 'client.subscribe(' }],
      [{ text: '  {' }],
      [{ text: '    query: `subscription($roomId: ID!) {', color: C }],
      [{ text: '      messageAdded(roomId: $roomId) {', color: C }],
      [{ text: '        id text author { name }', color: C }],
      [{ text: '      }', color: C }],
      [{ text: '    }`,', color: C }],
      [{ text: "    variables: { roomId: '42' }" }],
      [{ text: '  },' }],
      [{ text: '  {' }],
      [{ text: '    next: (data) => updateUI(data.messageAdded)', color: GRN }],
      [{ text: '    error: (err) => console.error(err)' }],
      [{ text: '  }' }],
      [{ text: ')' }],
    ],
  },
  {
    id: 'cleanup',
    emoji: '⑤',
    name: 'Unsubscribe / Disconnect',
    color: FGMUTE,
    short: 'Cliente cancela subscription. Servidor remove do PubSub e libera memória.',
    detail: 'O cliente pode enviar stop para cancelar. Ao fechar o WebSocket, todas as subscriptions são limpas. O servidor remove o subscriber do PubSub. Para múltiplas instâncias: Redis PubSub.',
    code: [
      [{ text: 'const', color: AMB }, { text: ' unsubscribe = client.subscribe(' }],
      [{ text: '  { query: SUBSCRIPTION_QUERY },' }],
      [{ text: '  handlers' }],
      [{ text: ')' }],
      [{ text: '' }],
      [{ text: '// Cancelar subscription específica:', color: '#475569' }],
      [{ text: 'unsubscribe()', color: GRN }],
      [{ text: '' }],
      [{ text: '// PubSub com Redis (multi-instâncias):', color: '#475569' }],
      [{ text: "import { RedisPubSub } from 'graphql-redis-subscriptions'" }],
      [{ text: 'const', color: AMB }, { text: ' pubsub = ' }, { text: 'new', color: AMB }, { text: ' RedisPubSub({ redis })' }],
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Fragments & Directives (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const FRAGMENTS_SLIDES: Slide[] = [
  {
    title: 'Fragments — reutilização de selection sets',
    paragraphs: [
      'Fragment é um trecho nomeado e reutilizável de seleção de campos. Evita repetição em múltiplas queries. Define campos: fragment UserFields on User { ... } e usa com spread: ...UserFields.',
      'Fragmentos são fortemente tipados — binding ao type que os declara (on User). Fragmentos inline: ... on User { name } (sem nome, uso único).',
      'Co-location com componentes React: cada componente define seu fragment dos dados que precisa. Ao mudar o componente, só o fragment dele muda — sem tocar a query raiz.',
    ],
    gradient: [C, '#7c3aed'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.8, background: BG, border: `1px solid ${C}40`, borderRadius: 8, padding: 14 }}>
        <div style={{ color: AMB, marginBottom: 6, fontSize: 10 }}>fragment reutilizável</div>
        <div><span style={{ color: C }}>fragment</span> <span style={{ color: AMB }}>UserCard</span> <span style={{ color: FGMUTE }}>on</span> <span style={{ color: GRN }}>User</span> {'{'}</div>
        <div style={{ paddingLeft: 12, color: SKY }}>id</div>
        <div style={{ paddingLeft: 12, color: SKY }}>name</div>
        <div style={{ paddingLeft: 12, color: SKY }}>avatar</div>
        <div>{'}'}</div>
        <div style={{ marginTop: 10, color: AMB, fontSize: 10 }}>uso em query</div>
        <div><span style={{ color: C }}>query</span> {'{'}</div>
        <div style={{ paddingLeft: 12 }}>user(id: <span style={{ color: GRN }}>"1"</span>) {'{'}</div>
        <div style={{ paddingLeft: 24 }}><span style={{ color: C }}>...UserCard</span></div>
        <div style={{ paddingLeft: 24, color: SKY }}>posts {'{'} title {'}'}</div>
        <div style={{ paddingLeft: 12 }}>{'}'}</div>
        <div>{'}'}</div>
      </div>
    ),
  },
  {
    title: 'Inline Fragments & Union Types',
    paragraphs: [
      'Inline fragments permitem selecionar campos específicos de cada type concreto em uma Union ou Interface. Fundamental para APIs polimórficas.',
      '... on TypeConcreto { campos } — seleciona só quando o tipo bate. __typename — campo especial que retorna o nome do tipo concreto.',
      'Union: SearchResult = User | Post | Article. Interface: qualquer type que implementa os campos da interface. Ferramenta para rendering condicional type-safe no cliente.',
    ],
    gradient: [AMB, '#b45309'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 1.8, background: BG, border: `1px solid ${AMB}40`, borderRadius: 8, padding: 14 }}>
        <div style={{ color: AMB, marginBottom: 6, fontSize: 10 }}>union SearchResult = User | Post</div>
        <div><span style={{ color: C }}>query</span> Search {'{'}</div>
        <div style={{ paddingLeft: 12 }}>search(q: <span style={{ color: GRN }}>"GraphQL"</span>) {'{'}</div>
        <div style={{ paddingLeft: 24, color: FGMUTE }}>__typename</div>
        <div style={{ paddingLeft: 24 }}><span style={{ color: C }}>... on</span> <span style={{ color: AMB }}>User</span> {'{'}</div>
        <div style={{ paddingLeft: 36, color: SKY }}>name email</div>
        <div style={{ paddingLeft: 24 }}>{'}'}</div>
        <div style={{ paddingLeft: 24 }}><span style={{ color: C }}>... on</span> <span style={{ color: AMB }}>Post</span> {'{'}</div>
        <div style={{ paddingLeft: 36, color: SKY }}>title author {'{'} name {'}'}</div>
        <div style={{ paddingLeft: 24 }}>{'}'}</div>
        <div style={{ paddingLeft: 12 }}>{'}'}</div>
        <div>{'}'}</div>
      </div>
    ),
  },
  {
    title: '@include e @skip — controle condicional',
    paragraphs: [
      '@include(if: Boolean) — inclui o campo se true. @skip(if: Boolean) — pula o campo se true. Ambos recebem variáveis da query: @include(if: $showEmail).',
      'Aplicáveis em campos, fragments e inline fragments. Reduzem overfetching sem precisar de queries separadas.',
      'Diferença de múltiplas queries: uma query única com @include/@skip evita round-trips extras e simplifica o estado do cliente.',
    ],
    gradient: [GRN, '#15803d'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 1.8, background: BG, border: `1px solid ${GRN}40`, borderRadius: 8, padding: 14 }}>
        <div style={{ color: GRN, marginBottom: 6, fontSize: 10 }}>campo condicional por variável</div>
        <div><span style={{ color: C }}>query</span> GetUser(<span style={{ color: AMB }}>$showEmail</span>: <span style={{ color: SKY }}>Boolean!</span>) {'{'}</div>
        <div style={{ paddingLeft: 12 }}>user(id: <span style={{ color: GRN }}>"1"</span>) {'{'}</div>
        <div style={{ paddingLeft: 24, color: SKY }}>id name</div>
        <div style={{ paddingLeft: 24 }}>email <span style={{ color: C }}>@include</span>(if: <span style={{ color: AMB }}>$showEmail</span>)</div>
        <div style={{ paddingLeft: 24 }}>phone <span style={{ color: C }}>@skip</span>(if: <span style={{ color: RED }}>$isPublic</span>)</div>
        <div style={{ paddingLeft: 12 }}>{'}'}</div>
        <div>{'}'}</div>
      </div>
    ),
  },
  {
    title: 'Custom Directives — lógica transversal',
    paragraphs: [
      'Directives customizados implementam cross-cutting concerns no schema: autenticação, rate limiting, caching, formatação. Lógica aplicada declarativamente no SDL sem poluir resolvers.',
      '@auth(requires: Role) — verifica autenticação no resolve. @rateLimit(max: 10, window: "1m"). @deprecated(reason: "...") — built-in para campos obsoletos.',
      'Implementados via SchemaTransformer (mapSchema) ou custom middleware. A vantagem: lógica de auth fica no schema — legível, testável, centralizada.',
    ],
    gradient: [C, '#9333ea'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 1.8, background: BG, border: `1px solid ${C}40`, borderRadius: 8, padding: 14 }}>
        <div style={{ color: C, marginBottom: 6, fontSize: 10 }}>directives no schema SDL</div>
        <div><span style={{ color: FGMUTE }}>directive</span> <span style={{ color: C }}>@auth</span>(</div>
        <div style={{ paddingLeft: 12 }}>requires: <span style={{ color: AMB }}>Role</span> = ADMIN</div>
        <div>) on FIELD_DEFINITION</div>
        <div style={{ marginTop: 8 }}><span style={{ color: FGMUTE }}>type</span> <span style={{ color: GRN }}>Mutation</span> {'{'}</div>
        <div style={{ paddingLeft: 12 }}>deleteUser(id: ID!): <span style={{ color: SKY }}>Boolean</span></div>
        <div style={{ paddingLeft: 20 }}><span style={{ color: C }}>@auth</span>(requires: <span style={{ color: AMB }}>ADMIN</span>)</div>
        <div style={{ paddingLeft: 20 }}><span style={{ color: FGMUTE }}>@deprecated</span>(reason: <span style={{ color: GRN }}>"use deactivateUser"</span>)</div>
        <div>{'}'}</div>
      </div>
    ),
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function GraphqlVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'execution-flow',
      title: 'Execution Flow',
      subtitle: 'Cliente → Parse → Validate → Execute → Resolvers → Response',
      accent: C,
      component: (
        <SequenceDiagram
          actors={GQL_ACTORS}
          messages={GQL_MESSAGES}
          groups={GQL_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="GraphQL Query Execution"
          description="Ciclo completo de uma query: do POST do cliente até a resposta com data/errors"
        />
      ),
    },
    {
      id: 'schema-anatomy',
      title: 'Schema Anatomy',
      subtitle: 'Scalars → Types → Query → Mutation → Subscription → Directives',
      accent: C2,
      component: (
        <LayerStack
          layers={SCHEMA_LAYERS}
          accentColor={C2}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'dataloader-timeline',
      title: 'N+1 & DataLoader',
      subtitle: 'Batch loading: do N+1 ao 2 queries sempre',
      accent: AMB,
      component: (
        <HookTimeline
          phases={DATALOADER_PHASES}
          accentColor={AMB}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'rest-vs-graphql',
      title: 'REST vs GraphQL',
      subtitle: 'REST vs GraphQL vs tRPC — quando usar cada um',
      accent: GRN,
      component: (
        <ComparisonTable
          options={RESTGQL_OPTIONS}
          criteria={RESTGQL_CRITERIA}
          accentColor={GRN}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'N+1, DataLoader global, introspection em prod, sem depth limit',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={GQL_ANTIPATTERNS}
          accentColor={RED}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'subscription-lifecycle',
      title: 'Subscription Lifecycle',
      subtitle: 'WebSocket → Subscribe → Publish → Deliver → Cleanup',
      accent: C,
      component: (
        <HookTimeline
          phases={SUB_PHASES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'fragments-directives',
      title: 'Fragments & Directives',
      subtitle: 'Reutilização, Union types, @include, @skip, custom directives',
      accent: AMB,
      component: (
        <ConceptCarousel
          slides={FRAGMENTS_SLIDES}
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
