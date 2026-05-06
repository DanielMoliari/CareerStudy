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
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion, CompScenario } from '@/components/pdfs/ComparativeRefPdf'

// ── Paleta GraphQL ────────────────────────────────────────────────────────────
const C = '#E10098'   // GraphQL pink

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista GraphQL',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: ciclo de execução, N+1 e DataLoader, schema design, resolvers (parent/args/context/info), subscriptions, depth limiting, persisted queries, schema-first vs code-first, federation — com respostas para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'SDL, resolvers, DataLoader e directives numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: SDL completo (types, interfaces, unions, enums, scalars), resolver signature, context factory, DataLoader pattern, built-in directives, operações (query/mutation/subscription), fragments.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os truques que grudam GraphQL na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'DataLoader = "batching no próximo tick", Mutation em série não paralelo, __typename para union type detection, @skip vs @include. Truques verbais para os pontos mais cobrados.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 6 erros mais comuns com GraphQL',
    type: 'antipatterns',
    pages: 3,
    description: 'N+1 sem DataLoader, DataLoader global (vazamento de cache), introspection em produção, sem depth limit, overfetching no resolver, sem persisted queries. Com código errado × correto.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'GraphQL do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 8 categorias (Schema, Resolvers, DataLoader, Queries, Mutations, Subscriptions, Segurança, Ecossistema) e checklist pré-entrevista.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
  {
    id: 'comparative',
    title: 'REST vs GraphQL vs tRPC',
    subtitle: 'Tabela comparativa para decisão técnica',
    type: 'comparative',
    pages: 2,
    description: 'Comparação objetiva de 12 critérios: overfetching, type safety, caching, real-time, curva de aprendizado, tooling, cenários de uso. Com recomendações de quando usar cada um.',
    icon: '06',
    goal: 'Decisão técnica',
  },
]

// ── Q&A ───────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Explique o ciclo de execução de uma query GraphQL.',
    a: 'Parse: texto da query → AST (erros de sintaxe). Validate: AST verificada contra schema (campos inexistentes, tipos errados, regras de complexidade). Execute: executor percorre AST campo a campo, chamando resolver de cada campo com (parent, args, context, info). O resultado do resolver pai é passado como parent para resolvers filhos. Resposta montada e enviada ao cliente.',
    tip: 'Enfatize que Parse e Validate não acessam nenhuma fonte de dados — só o schema. Erros de validação retornam sem executar resolver algum. Isso explica o trade-off: segurança de tipos antes da execução.',
  },
  {
    level: 'Senior',
    q: 'Como o N+1 problem surge no GraphQL e como o DataLoader resolve?',
    a: 'N+1: resolver de lista retorna N items. Para cada item, resolver de campo relacionado executa 1 query. 100 posts → 101 queries. DataLoader usa process.nextTick() para acumular todos os IDs chamados no mesmo tick. No próximo tick, dispara 1 única query IN (id1, id2...). Resulta em sempre 2 queries independente do N.',
    tip: 'Explique o mecanismo de batching: todos os loader.load(id) do mesmo tick síncronos são coletados antes de qualquer microtask resolver. Mencione que DataLoader DEVE ser instanciado por request — nunca global.',
  },
  {
    level: 'Senior',
    q: 'Por que DataLoader deve ser criado por request e não globalmente?',
    a: 'DataLoader tem cache interno: uma vez que load(id) retorna, o resultado fica cacheado para o restante do request. Cache global seria compartilhado entre usuários diferentes — usuário B veria dados cacheados do usuário A. Segurança e consistência exigem cache por request. O context factory (executado por request) é o lugar correto para instanciar DataLoaders.',
    tip: 'Este é um erro de segurança real, não teórico. Cite o exemplo: DataLoader de usuário global → admin faz query → dados ficam no cache → usuário sem privilégio faz query → recebe dados do admin do cache.',
  },
  {
    level: 'Pleno',
    q: 'Qual a assinatura de um resolver e o que é cada parâmetro?',
    a: 'resolver(parent, args, context, info). parent: valor retornado pelo resolver do campo pai (null na raiz). args: argumentos passados pelo cliente para este campo. context: objeto compartilhado por todos os resolvers do request (DataLoaders, auth, db). info: metadados do campo atual (fieldName, returnType, schema, path) — raramente necessário.',
    tip: 'A confusão mais comum: parent não é o objeto inteiro do tipo pai, é o VALOR retornado pelo resolver do campo pai. Demonstre com User.posts: parent é o UserObject retornado por Query.user.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre schema-first e code-first?',
    a: 'Schema-first: escreve SDL (type User { id: ID! }), depois implementa resolvers. Source of truth é o SDL. Vantagens: readable, linguagem-agnóstico, fácil de compartilhar. Code-first: escreve classes/decoradores TypeScript, schema SDL é gerado. Vantagens: type safety native, sem out-of-sync entre tipos TS e SDL, melhor DX em TypeScript. Ferramentas: SDL-first (Apollo, Mercurius), code-first (TypeGraphQL, NestJS GraphQL).',
    tip: 'Posicione pelo projeto: time poliglota → schema-first (SDL é contrato independente de linguagem). Monorepo TypeScript → code-first (TypeGraphQL elimina duplicação de tipos). Não há resposta certa absoluta.',
  },
  {
    level: 'Pleno',
    q: 'Como funcionam mutations e por que elas são executadas em série?',
    a: 'Mutations são executadas serialmente pelo executor quando múltiplas mutations são enviadas no mesmo documento. Isso garante ordem de efeitos colaterais previsível. Queries, ao contrário, podem ser executadas em paralelo (sem efeitos colaterais por design). Cada mutation recebe (root, args, context, info) igual a um resolver de query.',
    tip: 'A regra da especificação: "If the operation is a mutation, the resulting completion value must be completed serially". Mostre o exemplo prático: createOrder + sendEmail no mesmo documento → ordem garantida.',
  },
  {
    level: 'Senior',
    q: 'Como implementar subscriptions e quais são os requisitos de infraestrutura?',
    a: 'Subscriptions requerem: protocolo persistente (graphql-ws via WebSocket ou graphql-sse via SSE), PubSub para distribuir eventos (in-memory para single instance, Redis para múltiplas instâncias), resolver com asyncIterableIterator que retorna stream de eventos. O servidor filtra eventos no subscription resolver antes de enviar ao cliente.',
    tip: 'Mencione o problema de escala: PubSub in-memory só funciona em single instance. Com múltiplas instâncias (Kubernetes), cliente conectado ao pod A não recebe eventos publicados pelo pod B. Redis PubSub resolve com channel broadcast entre pods.',
  },
  {
    level: 'Senior',
    q: 'Como proteger uma API GraphQL em produção?',
    a: 'Desabilitar introspection em produção. Implementar depth limiting (graphql-depth-limit). Complexity limiting (graphql-query-complexity). Timeout de resolvers lentos. Rate limiting por IP ou usuário. Persisted queries (APQ) para aceitar apenas queries aprovadas. Query allowlisting em produção crítica.',
    tip: 'O vetor de ataque mais comum: query exponencial sem depth limit. type User { friends: [User!]! } → user { friends { friends { friends... }}} aborta o servidor. Cite graphql-depth-limit e a regra padrão de 7 níveis.',
  },
  {
    level: 'Pleno',
    q: 'Explique overfetching e underfetching e como GraphQL resolve.',
    a: 'Overfetching (REST): GET /users retorna 20 campos, cliente precisa de 3. Underfetching (REST): GET /user/1 retorna user mas não posts — precisa de outro GET /users/1/posts. GraphQL: cliente especifica exatamente os campos na query. Um único request pode trazer user + posts + autor do post. O servidor só executa resolvers dos campos pedidos.',
    tip: 'Conecte com performance móvel: em mobile com conexão lenta, overfetching desperdiça bandwidth e bateria. Uma query GraphQL bem desenhada pode substituir 4-5 chamadas REST, reduzindo RTT e payload.',
  },
  {
    level: 'Senior',
    q: 'O que são persisted queries (APQ) e por que usá-las?',
    a: 'APQ (Automatic Persisted Queries): cliente envia hash SHA-256 da query em vez do texto completo. Se servidor não conhece o hash, cliente reenvia com o texto completo (1 round-trip extra apenas na primeira vez). Benefícios: GET request cacheable por CDN, menor payload, segurança (aceitar apenas hashes conhecidos = allowlist de queries).',
    tip: 'Conecte com CDN: GET /graphql?extensions={hash}&variables={...} é cacheable por Fastly, Cloudflare, CloudFront. POST /graphql com body nunca é cacheável por CDN sem configuração especial.',
  },
  {
    level: 'Pleno',
    q: 'O que é GraphQL Federation e quando usar?',
    a: 'Federation: múltiplos GraphQL schemas (subgraphs) expostos como um schema unificado por um gateway. Cada serviço controla suas entidades. O gateway faz query planning para distribuir campos entre subgraphs e mesclar respostas. Usa quando a API GraphQL cresceu demais para um único serviço ou times diferentes controlam domínios distintos.',
    tip: 'Cite o exemplo real: serviço de users e serviço de orders com federation — query { user { name orders { total } } } é executada pelo gateway roteando user → UserService e orders → OrderService.',
  },
  {
    level: 'Senior',
    q: 'Como implementar autenticação e autorização em resolvers GraphQL?',
    a: 'Autenticação: verificar token JWT no context factory (executado uma vez por request). Colocar o user no context para todos os resolvers. Autorização: verificar permissões dentro de cada resolver ou via custom directive @auth(requires: ADMIN). Para autorização baseada em objetos (field-level), usar resolvers de campos com lógica de filtragem.',
    tip: 'Custom directive @auth é o padrão mais escalável: a lógica de autenticação fica no schema declarativamente. Mostre: type Mutation { deleteUser(id: ID!): Boolean! @auth(requires: ADMIN) } — legível, testável, centralizado.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o sistema de tipos do GraphQL (nullability e listas)?',
    a: 'Por default, todo campo em GraphQL é nullable. String = nullable. String! = non-null. [String] = lista nullable de strings nullables. [String!] = lista nullable de strings non-null. [String!]! = lista non-null de strings non-null. Non-null: se resolver retorna null em campo non-null, GraphQL propaga null para o campo pai (null bubbling) até encontrar campo nullable.',
    tip: 'Armadilha common: usar String! (non-null) sem considerar que resolver pode falhar. Um erro em campo String! dentro de uma lista pode anular toda a lista se a lista for non-null. Design defensivo: use nullable por default, torne non-null apenas campos verdadeiramente garantidos.',
  },
  {
    level: 'Senior',
    q: 'Como versionar uma API GraphQL sem breaking changes?',
    a: 'GraphQL não tem versões de URL. Estratégia: adicionar novos campos sem remover antigos. Deprecar campos com @deprecated(reason: "...") — clientes são informados mas não quebram. Adicionar campos obrigatórios novos com default. Nunca mudar tipo de campo existente. Nunca remover campo antes de confirmar zero uso (via introspection metrics). Schema changes são incrementais.',
    tip: 'Compare com REST: REST v2 = novo URL, clientes antigos continuam em v1. GraphQL: deprecated fields coexistem com novos — cliente migra quando quiser. O preço: schema cresce e precisa de limpeza eventual (quando uso = zero confirmado).',
  },
  {
    level: 'Pleno',
    q: 'Quando escolher GraphQL vs REST vs tRPC?',
    a: 'GraphQL: múltiplos clientes (web + mobile) com necessidades diferentes, dados relacionados profundos, equipe de frontend autônoma. REST: API pública ou para parceiros externos, recursos simples CRUD, caching HTTP nativo importante. tRPC: monorepo TypeScript fullstack, sem clientes externos, type safety máxima sem codegen.',
    tip: 'A resposta certa depende do contexto. Mostre que você conhece os trade-offs reais: GraphQL resolve overfetching mas adiciona complexidade (DataLoader, depth limit, codegen). REST é simples mas underfetching. tRPC é perfeito internamente mas não serve para API pública.',
  },
  {
    level: 'Senior',
    q: 'O que são custom scalars e quando criar novos?',
    a: 'Scalars built-in: String, Int, Float, Boolean, ID. Custom scalars: Date (ISO string), DateTime (ISO 8601), URL (string válida), Upload (multipart file), JSON, UUID. Implementados com serialize (saída), parseValue (input de variável), parseLiteral (input de literal na query). Pacotes prontos: graphql-scalars (DateTimeISO, PositiveInt, EmailAddress, etc.).',
    tip: 'Scalar Date vs String: retornar Date como String funciona mas perde semântica — GraphiQL não sabe que é uma data, clientes TypeScript recebem string sem type. Custom scalar Date + codegen = Date tipado end-to-end.',
  },
  {
    level: 'Senior',
    q: 'Como usar fragments para co-location com componentes React?',
    a: 'Co-location: cada componente define seu fragment dos dados que precisa. Componente pai compõe fragments dos filhos em sua query. Vantagem: ao modificar o componente (adicionar campo), só o fragment do componente precisa mudar — sem quebrar a query pai. Gql codegen gera tipos TypeScript por fragment. Relay popularizou esse padrão; Apollo Client suporta com fragment colocation.',
    tip: 'Mostre o padrão: UserCard define fragment UserCardFields on User { name avatar }. Feed query usa ...UserCardFields. Ao adicionar bio no UserCard: só o fragment muda. Sem co-location, a query raiz teria que ser editada toda vez.',
  },
  {
    level: 'Pleno',
    q: 'Como lidar com erros parciais em GraphQL?',
    a: 'GraphQL permite resposta com data e errors simultaneamente. Um resolver que lança erro retorna null naquele campo e adiciona o erro em errors[]. Se o campo era non-null, null bubbling propaga até o ancestral nullable. O cliente sempre recebe o que foi possível — dados parciais com informação do erro. Diferente de REST: 200 mesmo com erros de campo.',
    tip: 'Isso é contra-intuitivo para quem vem de REST. Mostre: { data: { user: { name: "Ana", avatar: null } }, errors: [{ path: ["user","avatar"], message: "S3 unavailable" }] }. O componente renderiza com dados parciais — UX melhor que tela de erro total.',
  },
  {
    level: 'Senior',
    q: 'Como otimizar performance além de DataLoader em GraphQL?',
    a: 'Query complexity limiting (rejeitar queries caras). Persisted queries + CDN cache. Response caching (@cacheControl directive, Keyv). Partial query caching com Normalized cache (Apollo Client). Field-level caching com DataLoader cache. Deferred execution (@defer, @stream) para campos lentos. Query batching no cliente (link batching do Apollo). Denormalization no schema para evitar resolvers waterfall.',
    tip: 'O problema de "resolver waterfall": Query.post → Post.author → Author.company → Company.ceo — 4 queries seriais. Solução: DataLoader + loosen de tipos (retornar IDs e deixar o cliente resolver) ou schema redesign com campos denormalizados.',
  },
  {
    level: 'Senior',
    q: 'Explique null bubbling e como ele afeta o schema design.',
    a: 'Null bubbling: se resolver de campo non-null (!) retorna null, o GraphQL substitui o objeto pai por null. Se o pai também for non-null, sobe mais um nível. Pode anular toda a response.data se a raiz for non-null. Impacto no design: use ! criteriosamente. Campos que podem falhar (I/O externo, serviços de terceiros) não devem ser non-null.',
    tip: 'Regra prática: ID, primary keys e campos de sistema = non-null (!). Campos opcionais, enriquecimento externo (avatar, bio, rating) = nullable. Uma falha em avatar não deve nulificar o user inteiro.',
  },
  {
    level: 'Pleno',
    q: 'Como implementar paginação em GraphQL (cursor-based vs offset)?',
    a: 'Offset pagination: skip/limit — simples, mas instável com inserções (pode pular ou repetir itens). Relay cursor connection spec: pageInfo { hasNextPage, endCursor }, edges [{ node, cursor }]. O cursor aponta para um item específico — estável, independente de inserções. Padrão da indústria para listas com muitas escritas.',
    tip: 'Mostre o schema Relay: type UserConnection { edges: [UserEdge!]!, pageInfo: PageInfo! }, type UserEdge { node: User!, cursor: String! }. A query: users(first: 10, after: $cursor) { ...UserConnection }. Ferramentas como Prisma e Apollo Client têm suporte nativo.',
  },
]

// ── CheatSheet ────────────────────────────────────────────────────────────────

const CS_HOOKS: HookItem[] = [
  { name: 'type Object',     sig: 'type User { id: ID! name: String! }',            desc: 'Definir entidades do domínio' },
  { name: 'interface',       sig: 'interface Node { id: ID! }',                     desc: 'Polimorfismo com campos em comum' },
  { name: 'union',           sig: 'union SearchResult = User | Post',               desc: 'Polimorfismo sem campos em comum' },
  { name: 'enum',            sig: 'enum Role { ADMIN USER }',                       desc: 'Valores fixos e conhecidos' },
  { name: 'input',           sig: 'input CreateUserInput { name: String! }',        desc: 'Argumentos complexos de mutation' },
  { name: 'scalar',          sig: 'scalar Date',                                    desc: 'Tipos primitivos customizados' },
  { name: 'query field',     sig: 'user(id: ID!): User',                            desc: 'Leitura — idempotente' },
  { name: 'mutation field',  sig: 'createUser(input: CreateUserInput!): User!',     desc: 'Escrita — efeito colateral' },
  { name: 'subscription',    sig: 'messageAdded(roomId: ID!): Message!',            desc: 'Tempo real via WebSocket' },
  { name: 'fragment',        sig: 'fragment F on User { id name }',                 desc: 'Reutilização de selection sets' },
  { name: '@include',        sig: '@include(if: $cond)',                            desc: 'Incluir campo condicionalmente' },
  { name: '@skip',           sig: '@skip(if: $cond)',                               desc: 'Pular campo condicionalmente' },
  { name: '@deprecated',     sig: '@deprecated(reason: "Use X")',                   desc: 'Sinalizar campo obsoleto' },
  { name: 'DataLoader',      sig: 'new DataLoader<K,V>(batchFn)',                   desc: 'Batch loading para evitar N+1' },
]

const CS_RULES: RuleItem[] = [
  { ok: true,  t: 'Resolver signature: (parent, args, context, info) — context compartilhado, parent vem do pai' },
  { ok: true,  t: 'Mutations executam em série; queries em paralelo — por design da spec' },
  { ok: true,  t: 'DataLoader DEVE ser instanciado por request no context factory — nunca global' },
  { ok: false, t: 'Non-null (!) causa null bubbling para o pai — use nullable em campos que podem falhar' },
  { ok: false, t: 'Introspection deve ser desabilitada em produção (NODE_ENV === production)' },
  { ok: true,  t: 'depth limit padrão: 7 níveis — sem limite = DoS por query circular' },
  { ok: true,  t: 'DataLoader batchFn DEVE retornar resultados na MESMA ORDEM dos IDs de entrada' },
  { ok: true,  t: 'Persisted queries + GET = cacheable por CDN — POST /graphql nunca é cacheável' },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: '"DataLoader batcha no próximo tick"',
    trick: 'DataLoader = D-eferido no próximo tick + L-oader que A-grupa IDs',
    expansion: [['D', 'Deferido (process.nextTick)'], ['L', 'Loader que agrupa'], ['A', 'Agrupa IDs do mesmo tick']],
    explanation: 'DataLoader usa process.nextTick() para aguardar o fim do tick síncrono. Todos os loader.load(id) do mesmo tick são coletados em um array. No próximo tick, chama batchFn([id1, id2, id3]) — uma única query para tudo.',
    example: '10 posts com author → 10× loader.load(id) no mesmo tick → 1 query WHERE id IN (1..10)',
    why: 'N+1 é o problema mais comum em GraphQL. DataLoader é a solução padrão — entender seu mecanismo de batching é essencial.',
  },
  {
    label: '"Mutations Seriais, Queries Paralelas"',
    trick: 'M antes de Q no alfabeto → Mutations ficam antes de Queries = Mutations esperam em Série',
    expansion: [['M', 'Mutations = em Série (serial)'], ['Q', 'Queries = em Paralelo (parallel)']],
    explanation: 'Queries podem rodar em paralelo (sem efeitos colaterais). Mutations rodam em série para garantir ordem de efeitos colaterais. Por spec GraphQL.',
    example: 'createOrder + sendConfirmation no mesmo documento: sendConfirmation sempre executa depois de createOrder',
    why: 'Confundir a ordem de execução de mutations pode causar bugs de estado em operações encadeadas.',
  },
  {
    label: '"Non-null borbulha para o pai"',
    trick: 'Non-null (!) = bomba que explode para cima se null',
    expansion: [['!', 'Non-null = promessa que não pode ser quebrada'], ['null', 'Se quebrada → null sobe para o pai']],
    explanation: 'Se um campo String! recebe null do resolver, GraphQL substitui o objeto pai por null. Se o pai também for non-null, sobe mais um nível. Use ! só em campos verdadeiramente garantidos.',
    example: 'user { avatar! } → avatar falha → user fica null → toda a query retorna null se user for non-null',
    why: 'Null bubbling causa falhas silenciosas em cascata. Design defensivo: nullable por default, ! apenas em campos garantidos como IDs.',
  },
  {
    label: '"Context por request, DataLoader por request"',
    trick: 'Context = mochila do request. DataLoader vive na mochila. Mochila descarta ao fim.',
    expansion: [['Context', 'Criado uma vez por request'], ['DataLoader', 'Instanciado dentro do context factory'], ['Cache', 'Isolado por request — descartado ao fim']],
    explanation: 'O context factory é chamado uma vez por request. Ele cria novos DataLoaders a cada request, garantindo que o cache é isolado por usuário e por request.',
    example: 'Cache global: userA busca id=1 → fica no cache → userB (sem permissão) busca id=1 → recebe do cache',
    why: 'DataLoader global é uma vulnerabilidade de segurança real — não só performance.',
  },
  {
    label: '"Parse-Validate não toca dados"',
    trick: 'P e V de Parse e Validate vêm antes de E de Execute — E é quem faz I/O',
    expansion: [['P', 'Parse: texto → AST (sem I/O)'], ['V', 'Validate: AST vs Schema (sem I/O)'], ['E', 'Execute: chama resolvers (faz I/O)']],
    explanation: 'Parse converte texto em AST sem acessar schema nem banco. Validate confere AST contra schema sem acessar banco. Execute é o único que chama resolvers e faz I/O.',
    example: 'Query com campo inexistente retorna erro de validação sem executar resolver algum — zero custo de banco',
    why: 'O schema é uma barreira de segurança eficiente: erros de tipo/campo são detectados antes de qualquer I/O.',
  },
]

// ── Anti-patterns ─────────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'N+1 sem DataLoader — loop implícito de queries',
    badDesc: 'Post.author chamado individualmente para cada post: 100 posts → 101 queries.',
    goodDesc: 'DataLoader.load() agrupa todos os IDs do mesmo tick: sempre 2 queries, independente do N.',
    why: 'O executor GraphQL chama Post.author para CADA post individualmente. Sem DataLoader, cada chamada dispara 1 query. 100 posts → 101 queries → ~100ms extras de latência de banco.',
    badCode: [
      { t: 'Post: {', c: '#e2e8f0' },
      { t: '\n  async author(parent) {', c: '#e2e8f0' },
      { t: '\n    // 1 query por post:', c: '#64748b' },
      { t: '\n    return db.users.findById(', c: '#ef4444' },
      { t: '\n      parent.authorId', c: '#ef4444' },
      { t: '\n    )', c: '#ef4444' },
      { t: '\n  }', c: '#e2e8f0' },
      { t: '\n}', c: '#e2e8f0' },
    ],
    goodCode: [
      { t: 'Post: {', c: '#e2e8f0' },
      { t: '\n  author(parent, _, ctx) {', c: '#e2e8f0' },
      { t: '\n    // 1 query para todos os posts:', c: '#64748b' },
      { t: '\n    return ctx.loaders.user', c: '#4ade80' },
      { t: '\n      .load(parent.authorId)', c: '#4ade80' },
      { t: '\n  }', c: '#e2e8f0' },
      { t: '\n}', c: '#e2e8f0' },
    ],
  },
  {
    title: 'DataLoader global — cache entre requests/usuários',
    badDesc: 'DataLoader instanciado globalmente: cache persiste entre requests e usuários diferentes.',
    goodDesc: 'DataLoader criado no context factory: novo cache por request, isolado por usuário.',
    why: 'Cache do DataLoader sobrevive entre requests se instanciado globalmente. Usuário A busca usuário ID=1. Usuário B (sem permissão) busca ID=1 — recebe do cache sem verificação. É uma vulnerabilidade de segurança real.',
    badCode: [
      { t: '// GLOBAL — perigoso!', c: '#64748b' },
      { t: '\nconst loader = new DataLoader(', c: '#ef4444' },
      { t: '\n  batchUsers', c: '#ef4444' },
      { t: '\n)', c: '#ef4444' },
      { t: '\n// context usa loader global:', c: '#64748b' },
      { t: '\ncontext: () => ({ loader })', c: '#ef4444' },
    ],
    goodCode: [
      { t: '// Por request — isolado:', c: '#64748b' },
      { t: '\ncontext: () => ({', c: '#4ade80' },
      { t: '\n  loaders: {', c: '#4ade80' },
      { t: '\n    user: new DataLoader(', c: '#4ade80' },
      { t: '\n      batchUsers', c: '#4ade80' },
      { t: '\n    )', c: '#4ade80' },
      { t: '\n  }', c: '#4ade80' },
      { t: '\n})', c: '#4ade80' },
    ],
  },
  {
    title: 'Sem depth/complexity limit — DoS por query aninhada',
    badDesc: 'Sem validationRules: aceita queries de qualquer profundidade — DoS com uma única request.',
    goodDesc: 'graphql-depth-limit(7): bloqueia queries com mais de 7 níveis antes de executar.',
    why: 'type User { friends: [User!]! } sem profundidade máxima → query com 20 níveis → 20^n resolvers. Um único cliente mal-intencionado derruba o servidor sem precisar de muitas conexões.',
    badCode: [
      { t: '# Sem limite: aceita tudo', c: '#64748b' },
      { t: '\nnew ApolloServer({ schema })', c: '#ef4444' },
      { t: '\n\n# Atacante envia:', c: '#64748b' },
      { t: '\nquery { user { friends {', c: '#ef4444' },
      { t: '\n  friends { friends { ... } } } } }', c: '#ef4444' },
    ],
    goodCode: [
      { t: "import depthLimit from 'graphql-depth-limit'", c: '#4ade80' },
      { t: '\nnew ApolloServer({', c: '#e2e8f0' },
      { t: '\n  schema,', c: '#e2e8f0' },
      { t: '\n  validationRules: [', c: '#4ade80' },
      { t: '\n    depthLimit(7)', c: '#4ade80' },
      { t: '\n  ]', c: '#4ade80' },
      { t: '\n})', c: '#e2e8f0' },
    ],
  },
  {
    title: 'Introspection em produção expõe schema completo',
    badDesc: 'Introspection habilitada por padrão: atacante pode mapear todos os tipos e campos da API.',
    goodDesc: 'Desabilitar em produção: process.env.NODE_ENV !== "production" como flag.',
    why: 'Introspection retorna todos os tipos, campos e relações do schema. Facilita descoberta de campos sensíveis (adminPanel, internalId), planejamento de ataques e fuzzing automatizado.',
    badCode: [
      { t: '// Apollo Server 4: introspection', c: '#64748b' },
      { t: '\n// é true por padrão!', c: '#64748b' },
      { t: '\nnew ApolloServer({', c: '#e2e8f0' },
      { t: '\n  schema,', c: '#e2e8f0' },
      { t: '\n  // atacante faz query __schema', c: '#ef4444' },
      { t: '\n  // e mapeia toda a API', c: '#ef4444' },
      { t: '\n})', c: '#e2e8f0' },
    ],
    goodCode: [
      { t: 'new ApolloServer({', c: '#e2e8f0' },
      { t: '\n  schema,', c: '#e2e8f0' },
      { t: '\n  introspection:', c: '#4ade80' },
      { t: "\n    process.env.NODE_ENV !== 'production'", c: '#4ade80' },
      { t: '\n  // Dev: GraphiQL funciona', c: '#64748b' },
      { t: '\n  // Prod: schema não exposto', c: '#64748b' },
      { t: '\n})', c: '#e2e8f0' },
    ],
  },
]

// ── Mind Map ──────────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Schema SDL',
    color: C,
    items: [
      { t: 'type', k: true },
      { t: 'interface', k: true },
      { t: 'union', k: true },
      { t: 'enum', k: true },
      { t: 'scalar', k: true },
      { t: 'input', k: true },
      { t: 'directive', a: true },
      { t: 'extend type', a: true },
    ],
  },
  {
    label: 'Resolvers',
    color: '#ff4dc4',
    items: [
      { t: '(parent, args, ctx, info)', k: true },
      { t: 'context factory', k: true },
      { t: 'resolver chain', k: true },
      { t: 'default resolver', k: true },
      { t: 'custom scalars', a: true },
      { t: 'resolver composition', a: true },
    ],
  },
  {
    label: 'Queries',
    color: '#4ade80',
    items: [
      { t: 'query', k: true },
      { t: 'variables', k: true },
      { t: 'fragments', k: true },
      { t: 'inline fragments', k: true },
      { t: 'operationName', a: true },
      { t: '@include / @skip', k: true },
      { t: 'aliases', a: true },
    ],
  },
  {
    label: 'Mutations',
    color: '#ef4444',
    items: [
      { t: 'mutation', k: true },
      { t: 'input types', k: true },
      { t: 'retornar objeto', k: true },
      { t: 'execução serial', k: true },
      { t: 'optimistic UI', a: true },
    ],
  },
  {
    label: 'DataLoader & N+1',
    color: '#f59e0b',
    items: [
      { t: 'N+1 problem', k: true },
      { t: 'DataLoader', k: true },
      { t: 'batching', k: true },
      { t: 'cache por request', k: true },
      { t: 'DataLoader por request', k: true },
      { t: 'batch scheduling', a: true },
    ],
  },
  {
    label: 'Subscriptions',
    color: '#38bdf8',
    items: [
      { t: 'WebSocket (graphql-ws)', k: true },
      { t: 'PubSub', k: true },
      { t: 'asyncIterableIterator', k: true },
      { t: 'Redis PubSub (multi-instance)', a: true },
      { t: 'SSE (graphql-sse)', a: true },
      { t: 'graphql-ws protocol', a: true },
    ],
  },
  {
    label: 'Segurança',
    color: '#a78bfa',
    items: [
      { t: 'depth limiting', k: true },
      { t: 'complexity limiting', k: true },
      { t: 'introspection off em prod', k: true },
      { t: 'persisted queries (APQ)', a: true },
      { t: 'query allowlist', a: true },
      { t: '@auth directive', k: true },
    ],
  },
  {
    label: 'Ecossistema',
    color: '#fb923c',
    items: [
      { t: 'Apollo Server', k: true },
      { t: 'Apollo Client', k: true },
      { t: 'graphql-codegen', k: true },
      { t: 'TypeGraphQL', a: true },
      { t: 'NestJS GraphQL', a: true },
      { t: 'Federation', a: true },
      { t: 'Relay', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Explico o ciclo Parse → Validate → Execute sem consultar documentação',
  'Sei implementar DataLoader corretamente (por request, batch function, ordenação)',
  'Conheço as 4 partes do resolver signature e o que cada uma representa',
  'Entendo null bubbling e o risco de ! em campos que podem falhar',
  'Sei implementar subscription com WebSocket e PubSub (Redis para escala)',
  'Conheço os mecanismos de segurança: depth limit, complexity, introspection off',
  'Sei quando escolher schema-first vs code-first e os trade-offs',
  'Entendo overfetching vs underfetching e como GraphQL resolve',
  'Conheço persisted queries e seu benefício para CDN caching',
  'Posso comparar REST vs GraphQL vs tRPC com trade-offs reais',
]

// ── Comparative Ref ───────────────────────────────────────────────────────────

const COMP_OPTIONS: CompOption[] = [
  { name: 'REST',    color: '#38bdf8' },
  { name: 'GraphQL', color: C },
  { name: 'tRPC',    color: '#398CCB' },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Overfetching',
    category: 'Data fetching',
    values: { 'REST': 'endpoint retorna tudo', 'GraphQL': 'cliente define campos', 'tRPC': 'TypeScript inference' },
    winner: 'GraphQL',
  },
  {
    criterion: 'Underfetching',
    category: 'Data fetching',
    values: { 'REST': 'N endpoints para N recursos', 'GraphQL': '1 query para tudo', 'tRPC': '1 call por procedure' },
    winner: 'GraphQL',
  },
  {
    criterion: 'Type safety end-to-end',
    category: 'DX',
    values: { 'REST': 'OpenAPI + codegen (manual)', 'GraphQL': 'graphql-codegen (automático)', 'tRPC': 'nativo TypeScript' },
    winner: 'tRPC',
  },
  {
    criterion: 'HTTP GET cache / CDN',
    category: 'Performance',
    values: { 'REST': 'GET nativo', 'GraphQL': 'APQ + GET', 'tRPC': 'GET queries suportado' },
    winner: 'REST',
  },
  {
    criterion: 'Real-time',
    category: 'Funcionalidades',
    values: { 'REST': 'SSE ou polling', 'GraphQL': 'Subscriptions (WebSocket/SSE)', 'tRPC': 'experimental' },
    winner: 'GraphQL',
  },
  {
    criterion: 'Clientes externos',
    category: 'Ecossistema',
    values: { 'REST': 'qualquer HTTP client', 'GraphQL': 'SDL público compartilhável', 'tRPC': 'TypeScript apenas' },
    winner: 'REST',
  },
  {
    criterion: 'Curva de aprendizado',
    category: 'DX',
    values: { 'REST': 'baixa', 'GraphQL': 'média (schema, resolvers, N+1)', 'tRPC': 'baixa (se usa TS)' },
    winner: 'REST',
  },
  {
    criterion: 'Introspection / auto-docs',
    category: 'Funcionalidades',
    values: { 'REST': 'Swagger (manual)', 'GraphQL': 'automático via schema', 'tRPC': 'TypeScript types' },
    winner: 'GraphQL',
  },
  {
    criterion: 'N+1 problem',
    category: 'Armadilhas',
    values: { 'REST': 'pode ter no backend', 'GraphQL': 'garantido sem DataLoader', 'tRPC': 'depende da impl.' },
    winner: 'REST',
  },
  {
    criterion: 'Monorepo TS fullstack',
    category: 'Quando usar',
    values: { 'REST': 'funciona mas verboso', 'GraphQL': 'bom com codegen', 'tRPC': 'perfeito — zero codegen' },
    winner: 'tRPC',
  },
  {
    criterion: 'API pública ou B2B',
    category: 'Quando usar',
    values: { 'REST': 'padrão da indústria', 'GraphQL': 'bom com SDL público', 'tRPC': 'não recomendado' },
    winner: 'REST',
  },
  {
    criterion: 'Mobile + Web (múltiplos clients)',
    category: 'Quando usar',
    values: { 'REST': 'múltiplos endpoints ou BFF', 'GraphQL': 'ideal — cliente define shape', 'tRPC': 'só se TS' },
    winner: 'GraphQL',
  },
]

const COMP_SCENARIOS: CompScenario[] = [
  {
    scenario: 'SaaS B2B com parceiros externos',
    recommendation: 'REST',
    reason: 'API pública deve ser acessível de qualquer linguagem/plataforma. REST é o padrão universal. OpenAPI gera SDKs automaticamente.',
  },
  {
    scenario: 'App mobile + web com dados relacionados',
    recommendation: 'GraphQL',
    reason: 'iOS e Android têm necessidades diferentes. GraphQL deixa cada cliente pedir exatamente o que precisa, evitando overfetching e múltiplos requests.',
  },
  {
    scenario: 'Startup Next.js fullstack TypeScript',
    recommendation: 'tRPC',
    reason: 'Zero configuração de schema. Type safety nativa sem codegen. Deploy no Vercel em minutos. Ideal quando frontend e backend são o mesmo time.',
  },
  {
    scenario: 'Dashboard admin com queries complexas',
    recommendation: 'GraphQL',
    reason: 'Dashboards precisam de dados de múltiplas entidades por tela. GraphQL evita N endpoints e permite queries ad-hoc conforme novas telas são adicionadas.',
  },
]

// ── Componente principal ──────────────────────────────────────────────────────

export default function GraphqlPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)

  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
    qa: () => buildQAReviewPdf({
      qa: QAS,
      accentColor: C,
      skillName: 'GraphQL',
      stackLabel: 'Backend / API',
    }),
    cheatsheet: () => buildCheatsheetPdf({
      skillName: 'GraphQL',
      accentColor: C,
      stackLabel: 'Backend / API',
      sections: {
        hooks: CS_HOOKS,
        rules: CS_RULES,
        depRows: [],
        performanceTips: [
          'DataLoader por request no context factory — nunca global',
          'Depth limit padrão: 7 níveis (graphql-depth-limit)',
          'Persisted queries + GET = CDN cacheable',
          'Introspection desabilitada em produção',
          'batchFn do DataLoader DEVE retornar na mesma ordem dos IDs',
          'Mutations rodam em série — queries em paralelo (por spec)',
        ],
        patterns: [],
        mentalModels: [
          'Schema = contrato tipado entre cliente e servidor',
          'Resolver chain: parent → args → context → info (raramente necessário)',
          'DataLoader = batching no nextTick + cache por request',
          'Non-null (!) = promessa que pode explodir para cima (null bubbling)',
        ],
      },
    }),
    mnemonics: () => buildMnemonicsPdf({
      mnemonics: MNEMONICS,
      accentColor: C,
      skillName: 'GraphQL',
      stackLabel: 'Backend / API',
    }),
    antipatterns: () => buildAntipatternsPdf({
      antipatterns: ANTIPATTERNS,
      accentColor: C,
      skillName: 'GraphQL',
      stackLabel: 'Backend / API',
    }),
    mindmap: () => buildMindmapPdf({
      categories: MINDMAP_CATEGORIES,
      checklist: MINDMAP_CHECKLIST,
      accentColor: C,
      skillName: 'GraphQL',
      stackLabel: 'Backend / API',
    }),
    comparative: () => buildComparativeRefPdf({
      options: COMP_OPTIONS,
      criteria: COMP_CRITERIA,
      scenarios: COMP_SCENARIOS,
      skillName: 'GraphQL',
      accentColor: C,
      stackLabel: 'REST vs GraphQL vs tRPC',
    }),
  }

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
