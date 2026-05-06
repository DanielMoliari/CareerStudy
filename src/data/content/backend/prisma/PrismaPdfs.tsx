'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'

// ── Paleta Prisma (indigo brand) ────────────────────────────────────────────────
const C = '#5A67D8'

// ── Cards de PDF ──────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'Schema DSL + Client API + CLI num cartão A4',
    type: 'quick-ref',
    pages: 1,
    description: 'Cartão de bolso A4 landscape com 3 colunas: schema DSL (datasource, generator, model, atributos), Prisma Client (CRUD com select/include/where/orderBy/take/skip), CLI completo (migrate dev, deploy, db push, generate, studio). O que você precisa ter na mesa ao escrever Prisma.',
    icon: '01',
    goal: 'Consulta rápida',
    featured: true,
  },
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 18 perguntas mais cobradas em entrevista backend TS',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 18 perguntas nível pleno/sênior cobrindo schema vs migrate vs deploy, transações interativas, soft delete via Extensions, edge runtime com Accelerate, N+1, comparação com TypeORM/Drizzle, multi-tenancy, raw queries seguras e debugging de queries lentas. Respostas com profundidade de entrevista.',
    icon: '02',
    goal: 'Recuperação ativa',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os erros que aparecem em code review de Prisma',
    type: 'antipatterns',
    pages: 4,
    description: 'Os 6 anti-patterns mais destruidores em projetos Prisma: N+1 com loop em vez de include, prisma global dentro de $transaction interativa, instanciar PrismaClient a cada request em Next.js dev, db push em produção, $queryRawUnsafe com input do usuário e cursor pagination sem tiebreaker. Código errado x correto.',
    icon: '03',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Truques para gravar os conceitos que mais confundem',
    type: 'mnemonics',
    pages: 2,
    description: 'PIPELINE para os 4 estágios (schema → generate → migrate → client), DvD para a diferença entre migrate dev e deploy, SI para select vs include e TX-tx para a regra de transações interativas. Os conceitos do Prisma que ninguém consegue lembrar na entrevista.',
    icon: '04',
    goal: 'Memória de longo prazo',
  },
]

// ── Dados — Quick Reference ───────────────────────────────────────────────────

const QR_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Schema — blocos top-level',
        entries: [
          { key: 'datasource db { provider, url }', value: 'Conexão ao banco — postgresql, mysql, sqlite, mongodb' },
          { key: 'generator client { provider }', value: 'Cliente a gerar — geralmente prisma-client-js' },
          { key: 'previewFeatures = ["..."]', value: 'fullTextSearch, driverAdapters, metrics, tracing' },
          { key: 'model X {} / enum Y {}', value: 'Tabela ou enum — fonte de verdade' },
        ],
      },
      {
        title: 'Tipos de campo',
        entries: [
          { key: 'String, Int, BigInt, Float', value: 'Escalares numéricos e texto' },
          { key: 'Decimal, Boolean, DateTime', value: 'Tipos especializados' },
          { key: 'Json, Bytes', value: 'Json (jsonb no PG), binário' },
          { key: '? = nullable, [] = array', value: 'Modificadores de cardinalidade' },
          { key: '@db.VarChar(255), @db.Text', value: 'Tipo nativo SQL específico' },
        ],
      },
      {
        title: 'Atributos @ (campo)',
        entries: [
          { key: '@id @default(cuid())', value: 'Chave primária com gerador' },
          { key: '@unique', value: 'Constraint única' },
          { key: '@default(now())', value: 'Default — now, autoincrement, uuid, cuid, env, dbgenerated' },
          { key: '@updatedAt', value: 'Touch automático em update' },
          { key: '@relation(fields, references, onDelete)', value: 'Define FK e cascata' },
          { key: '@map("nome_no_db")', value: 'Renomeia coluna no banco' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Atributos @@ (modelo)',
        entries: [
          { key: '@@id([a, b])', value: 'PK composta' },
          { key: '@@unique([a, b])', value: 'Constraint única composta' },
          { key: '@@index([a, b])', value: 'Índice — ordem importa para prefixos', badge: '★ critico', badgeColor: '#5A67D8' },
          { key: '@@index([col(sort: Desc)])', value: 'Índice com direção (Postgres)' },
          { key: '@@map("tabela_no_db")', value: 'Renomeia tabela no banco' },
          { key: '@@fulltext([title, content])', value: 'Índice de full-text search' },
        ],
      },
      {
        title: 'Client — CRUD essencial',
        entries: [
          { key: 'findUnique({ where })', value: 'Por chave única — retorna T | null' },
          { key: 'findFirst({ where })', value: 'Por filtro flexível — retorna T | null' },
          { key: 'findMany({ where, select, include, orderBy, take, skip, cursor })', value: 'Lista — modificadores combinam' },
          { key: 'create({ data })', value: 'Insert único — suporta nested writes' },
          { key: 'createMany({ data, skipDuplicates })', value: 'Bulk insert — skipDuplicates ignora @unique' },
          { key: 'update({ where, data })', value: 'Update por chave única' },
          { key: 'upsert({ where, create, update })', value: 'INSERT ou UPDATE atômico' },
          { key: 'delete({ where })', value: 'Delete por chave única' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'where — operadores',
        entries: [
          { key: 'equals, not, in, notIn', value: 'Comparação básica e listas' },
          { key: 'lt, lte, gt, gte', value: 'Comparações numéricas / data' },
          { key: 'contains, startsWith, endsWith', value: 'String — adicionar mode: "insensitive"' },
          { key: 'AND, OR, NOT', value: 'Composição lógica de filtros' },
          { key: 'some, every, none', value: 'Filtros em relação 1:N' },
        ],
      },
      {
        title: 'CLI — comandos',
        entries: [
          { key: 'prisma init', value: 'Cria schema.prisma e .env' },
          { key: 'prisma generate', value: 'Gera @prisma/client (não toca no banco)' },
          { key: 'prisma migrate dev --name X', value: 'Dev — gera + aplica + regenera client', badge: '★ DEV', badgeColor: '#5A67D8' },
          { key: 'prisma migrate deploy', value: 'CI/Prod — só aplica versionadas (idempotente)', badge: '★ PROD', badgeColor: '#4ade80' },
          { key: 'prisma migrate reset', value: 'Drop + re-aplica (dev only)' },
          { key: 'prisma db push', value: 'Sync sem migration — NUNCA em produção', badge: 'cuidado', badgeColor: '#ef4444' },
          { key: 'prisma db pull', value: 'Introspect — atualiza schema a partir do banco' },
          { key: 'prisma studio', value: 'GUI de dados no browser' },
        ],
      },
      {
        title: 'Transactions e raw',
        entries: [
          { key: '$transaction([op1, op2])', value: 'Sequential — array atômico de operações' },
          { key: '$transaction(async tx => {})', value: 'Interactive — use SEMPRE tx, nunca prisma global', badge: '★', badgeColor: '#5A67D8' },
          { key: '{ isolationLevel, timeout, maxWait }', value: 'Opções — Serializable é o mais forte' },
          { key: '$queryRaw`SELECT ${var}`', value: 'Parametrizado — seguro contra SQL injection' },
          { key: '$queryRawUnsafe(sql)', value: 'Apenas para SQL gerado programaticamente' },
        ],
      },
    ],
  },
]

// ── Dados — Q&A ───────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Explique o pipeline schema → generate → migrate → client. O que cada estágio produz?',
    a: 'Schema.prisma é a fonte única de verdade — DSL declarativa com datasource, generator e models. prisma generate lê o schema e gera @prisma/client em node_modules/.prisma com tipos TypeScript completos — não toca no banco. prisma migrate calcula diff entre schema e migrations já aplicadas, gera SQL versionado em prisma/migrations/{ts}_name/migration.sql, aplica no banco e regenera o client. Em dev: migrate dev faz tudo. Em produção: migrate deploy só aplica migrations versionadas, idempotente.',
    tip: 'Saber que generate NÃO toca no banco é o ponto de virada. Muitos confundem com migrate.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre migrate dev e migrate deploy?',
    a: 'migrate dev é o comando de desenvolvimento local: (1) compara schema atual com migrations aplicadas e gera SQL de diff em prisma/migrations/{ts}_name/migration.sql; (2) aplica no banco de dev; (3) regenera @prisma/client com novos tipos. Pode pedir reset se detectar drift. migrate deploy é para CI/CD e produção: apenas aplica migrations já versionadas em ordem cronológica. Não gera novas migrations, não regenera client (você roda generate explicitamente no build), idempotente. Faz lock no banco para impedir aplicações simultâneas em CI paralelo.',
    tip: 'Saber que migrations já aplicadas são imutáveis e que correções viram NOVAS migrations é o que separa pleno de júnior.',
  },
  {
    level: 'Pleno',
    q: 'O que é o problema N+1 em ORMs e como Prisma evita?',
    a: 'N+1 acontece quando você itera uma lista e faz uma query por item para buscar relação. Sem include: const posts = findMany() seguido de for (post of posts) prisma.user.findUnique({ where: { id: post.authorId } }) → 1 query inicial + N queries (101 queries para 100 posts). Com Prisma include: findMany({ include: { author: true } }) → Prisma faz 2 queries (SELECT FROM posts; SELECT FROM users WHERE id IN (...)) — total constante. Para casos onde include é insuficiente (GraphQL com resolvers independentes), use DataLoader na camada GraphQL.',
    tip: 'Mostre o caso concreto: 100 posts → 101 vs 2 queries. Latência é a moeda — N+1 é morte por mil cortes.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre select e include em uma query Prisma?',
    a: 'select é WHITELIST de campos: o tipo retornado contém apenas os campos pedidos. Reduz payload e o TypeScript estreita o tipo automaticamente. include adiciona RELAÇÕES ao tipo base: mantém todos os campos escalares e adiciona o array/objeto da relação. Não dá para usar os dois no mesmo nível — Prisma rejeita. Para combinar (limitar campos do pai E incluir relação), use select aninhado: select: { id: true, posts: { select: { id: true } } }.',
    tip: 'A explicação técnica: select narrows, include extends. É a diferença entre subset e union no tipo retornado.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o singleton pattern em Next.js e por que é necessário?',
    a: 'Em desenvolvimento Next.js, hot reload recarrega módulos a cada save — sem singleton, cada reload cria nova PrismaClient com seu próprio pool de conexões. Em poucos minutos, banco recusa novas conexões (Postgres tem limite ~100 por padrão). A solução é armazenar a instância em globalThis: const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }; export const prisma = globalForPrisma.prisma ?? new PrismaClient(); if (NODE_ENV !== "production") globalForPrisma.prisma = prisma. Em produção, build cria uma única instância naturalmente.',
    tip: 'Mencione o hot reload como gatilho — sem ele, o problema não existiria. Em scripts CLI sempre $disconnect() ao final.',
  },
  {
    level: 'Pleno',
    q: 'Explique os 3 tipos de relação em Prisma e quando usar cada um.',
    a: '1:1 — User tem 1 Profile. O lado many tem FK + @unique. Ex: Profile.userId String @unique + user User @relation(...). 1:N — User tem N Posts. Apenas o lado many tem FK; o lado one tem array virtual (Post[]) que não vira coluna. SEMPRE adicionar @@index([authorId]). N:N implícita — Post tags Tag[] e Tag posts Post[]. Prisma cria automaticamente _PostToTag (gerada). Use quando não precisa de metadados na junção. N:N explícita — você cria PostTag manualmente com postId + tagId + assignedAt + assignedBy + @@id([postId, tagId]). Use quando precisa de campos extras na junção.',
    tip: 'A pergunta sobre N:N implícita vs explícita aparece em entrevistas — é o que separa quem leu docs de quem só copia exemplos.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o $transaction interativo? Quais cuidados em produção?',
    a: 'prisma.$transaction(async (tx) => {}) recebe callback com cliente transacional tx. Tudo feito com tx roda na mesma transação atômica. CRÍTICO: dentro do callback, sempre use tx — chamar prisma.user.update (global) executa FORA da transação, em outra conexão, e quebra atomicidade silenciosamente. Outros cuidados: (1) timeout default 5s — para transações longas configure { timeout: 30000 }; (2) maxWait — tempo de espera se o pool está saturado; (3) isolationLevel Serializable previne phantom reads e write skew mas reduz throughput; (4) NUNCA chame APIs externas dentro — segura conexão e contém deadlocks; (5) evite long-running — segura row locks.',
    tip: 'O gotcha do prisma global vs tx é o mais comum em entrevistas. Mencionar isolation levels mostra profundidade.',
  },
  {
    level: 'Senior',
    q: 'Quando você escolheria Prisma vs TypeORM vs Drizzle? Trade-offs?',
    a: 'Prisma: projeto novo TypeScript-first, schema declarativo como fonte de verdade, type-safety end-to-end com inference profunda, migrations confiáveis com diff automático. Padrão de mercado 2024-25. Trade-off: bundle pesado (~5MB query engine Rust), edge runtime exige Accelerate (pago), queries complexas caem em $queryRaw. TypeORM: projetos NestJS legados, ActiveRecord pattern, MongoDB no mesmo ORM, equipes vindas de Java/Hibernate. Trade-off: migrations manuais com sync perigoso em produção. Drizzle: edge runtime nativo (Cloudflare/Vercel sem proxy), performance crítica, equipe confortável com SQL, bundle pequeno. Schema em TypeScript puro. Trade-off: migrations e ecossistema mais novos, sem MongoDB.',
    tip: 'Mencionar Accelerate para edge é o que diferencia sênior. Se a vaga é edge/serverless, conheça os 3 com profundidade.',
  },
  {
    level: 'Senior',
    q: 'Como rodar Prisma em edge runtime (Cloudflare Workers, Vercel Edge)?',
    a: 'Prisma Client tradicional usa drivers TCP nativos (pg, mysql2) — não funcionam em edge. Duas estratégias: (1) Prisma Accelerate (recomendado para Prisma) — proxy HTTP gerenciado pela Prisma. Você importa de @prisma/client/edge e usa $extends(withAccelerate()). DATABASE_URL aponta para prisma://accelerate.prisma-data.net/?api_key=...; DIRECT_URL aponta direto para o banco (necessário para migrate). Ganhos: connection pooling global (resolve cold start), cache distribuído com TTL/SWR, suporte edge. Custos: por query e tier mensal. (2) Driver Adapters (preview) — @prisma/adapter-neon, @prisma/adapter-planetscale: drivers HTTP nativos do banco. Mais barato mas amarra ao provider. Alternativa: Drizzle tem suporte edge nativo sem proxy.',
    tip: 'Saber que Accelerate é gerenciado e custa diferencia sênior. Mencionar Drizzle como alternativa edge-nativa mostra horizonte.',
  },
  {
    level: 'Senior',
    q: 'Como implementar soft delete em Prisma sem repetir filtros em todos os resolvers?',
    a: 'Errado: adicionar deletedAt: null em cada findMany/findUnique — fácil esquecer e vazar dados deletados. Correto: Prisma Client Extension com query interception. const prisma = basePrisma.$extends({ query: { user: { findMany: async ({ args, query }) => { args.where = { ...args.where, deletedAt: null }; return query(args) } } }, model: { user: { softDelete: async (id) => basePrisma.user.update({ where: { id }, data: { deletedAt: new Date() } }) } } }). Para acesso de admin (ver deletados), use basePrisma diretamente. Use $allModels para aplicar em vários models por convenção.',
    tip: 'Substituir $use middleware deprecated por $extends é detalhe que mostra atualização — antes era $use, agora é Extensions composáveis e tipadas.',
  },
  {
    level: 'Senior',
    q: 'O que são Prisma Client Extensions e quando usar?',
    a: 'Extensions ($extends) são a forma moderna e composável de estender o Prisma Client (substituem $use deprecated). 4 tipos: (1) query — intercepta queries, modifica args ou result. Casos: soft delete, multi-tenancy, row-level security, logging. (2) model — adiciona métodos a um model. Caso: prisma.user.softDelete(id). (3) client — adiciona métodos no client raiz. Caso: prisma.$auditLog(). (4) result — campos virtuais computados sem ir no banco. Caso: fullName que concatena firstName + lastName. São composáveis: encadeie vários $extends. Tipados: TypeScript reconhece os métodos adicionados. Cuidado: extensions interceptam apenas chamadas via Client — $queryRaw bypassa.',
    tip: 'A composabilidade é o diferencial vs $use. Você pode encadear extensions de plugins separados sem conflito.',
  },
  {
    level: 'Senior',
    q: 'Como otimizar uma query Prisma que está lenta em produção?',
    a: 'Roteiro: (1) Reproduza com log de query — new PrismaClient({ log: ["query"] }) e capture o SQL. (2) EXPLAIN ANALYZE no Postgres / EXPLAIN no MySQL — identifique Seq Scan (sem índice) vs Index Scan. (3) Adicione @@index para campos de filtro frequente. Composto cobre prefixos: @@index([authorId, status]) cobre filtro por authorId sozinho ou authorId+status, mas NÃO status sozinho. (4) Reduza payload com select/include explícito — não traga colunas Json e Text desnecessárias. (5) Para listas grandes use cursor pagination — skip/take com offset alto faz banco varrer N linhas. (6) Evite include profundamente aninhado em listas — quebrar em queries separadas pode ser mais rápido. (7) Considere $queryRaw para CTE, window functions, agregações específicas. (8) Connection pooling: serverless precisa PgBouncer ou Accelerate.',
    tip: 'A ordem importa. Antes de adicionar índice, MEÇA com EXPLAIN. Adicionar índice errado degrada writes sem ganho.',
  },
  {
    level: 'Senior',
    q: 'Como você debugaria uma query Prisma lenta? Quais ferramentas?',
    a: '(1) Log de query: new PrismaClient({ log: [{ level: "query", emit: "event" }] }); prisma.$on("query", e => if (e.duration > 100) console.log(e.query, e.params, e.duration + "ms"). (2) Prisma Studio (npx prisma studio) — GUI de dados no browser para inspecionar. (3) EXPLAIN ANALYZE no banco — copie o SQL do log e rode direto. Verifique Index Scan vs Seq Scan, custos, rows estimadas vs reais. (4) Métricas Prisma: previewFeatures = ["metrics"] — expõe métricas Prometheus de pool, queries em flight, durations. (5) Dashboards Pulse / Accelerate em produção. (6) tracing: previewFeatures = ["tracing"] integra com OpenTelemetry — visualize traces em Jaeger/Tempo.',
    tip: 'Mencionar tracing OpenTelemetry mostra que conhece observabilidade moderna — diferencial em vagas SRE-adjacentes.',
  },
  {
    level: 'Senior',
    q: 'Como configurar Prisma em monorepo com múltiplos packages?',
    a: 'Padrão: packages/database/ contém schema.prisma, migrations e exporta Prisma Client gerado. packages/database/src/index.ts exporta { PrismaClient }. Em package.json: "postinstall": "prisma generate" garante client gerado após install em qualquer máquina/CI. Apps consumidores (apps/web, apps/api) dependem de @org/database e importam o singleton. Cuidados: (1) output customizado — generator client { output = "../node_modules/.prisma/client" } para o gerado ficar acessível por todos os packages. (2) Singleton compartilhado: exporte uma única instância com globalThis pattern para evitar múltiplos pools. (3) Migrations só em um lugar: packages/database é o único que roda migrate deploy.',
    tip: 'O postinstall com prisma generate é a chave — sem ele, novo dev clona o repo e o build quebra com "Cannot find module @prisma/client".',
  },
  {
    level: 'Senior',
    q: 'O que são Prisma Pulse e Accelerate? Quais problemas resolvem?',
    a: 'Accelerate: proxy HTTP + connection pooling global + cache distribuído. Resolve: (1) Cold start em serverless — cada Lambda nova abriria conexão TCP (300-500ms); Accelerate mantém pool quente globalmente. (2) Edge runtime — workers sem TCP nativo só fazem HTTP. (3) Cache — TTL e SWR (stale-while-revalidate) por query, distribuído em edge. Pulse: Change Data Capture (CDC) gerenciado — você subscreve a mudanças em tabelas via stream. Resolve: (1) Real-time sem polling — recebe push quando algo muda em vez de SELECT a cada 5s. (2) Substitui webhooks internos. (3) Casos: notificações, sync cross-service, materialização de views, analytics em tempo real. Ambos pagos — alternativa Pulse: Postgres logical replication direto + pg-logical-replication.',
    tip: 'Diferenciar Accelerate (read path) de Pulse (change path) mostra entendimento dos dois lados — leitura escalada vs escrita observada.',
  },
  {
    level: 'Senior',
    q: 'Como prevenir SQL injection ao usar raw queries em Prisma?',
    a: 'SEMPRE use $queryRaw com template literal — NUNCA $queryRawUnsafe com input do usuário. $queryRaw\\`SELECT * FROM users WHERE id = ${userId}\\` traduz para SELECT * FROM users WHERE id = $1 com $1 parametrizado pelo driver — escape automático, injection impossível. $queryRawUnsafe faz interpolação de string — input vira SQL literal, abre injection. Use Unsafe APENAS quando você está construindo SQL programaticamente sem input externo (ex: ORDER BY dinâmico whitelisted, nome de tabela dinâmico em ferramenta interna). Para composição condicional, use Prisma.sql: const where = filterByStatus ? Prisma.sql\\`WHERE status = ${"PUBLISHED"}\\` : Prisma.empty.',
    tip: 'A regra dos dois template literals (string vs Prisma.sql) é o ponto crítico. SQL injection é vetor de #1 do OWASP — qualquer dúvida derruba o candidato.',
  },
  {
    level: 'Pleno',
    q: 'Diferença entre upsert e createMany com skipDuplicates?',
    a: 'upsert (find + update OR create) — atômico para um registro. Você define lógica diferente em create e update: prisma.user.upsert({ where: { email: "x" }, create: { email: "x", name: "Ana" }, update: { lastLoginAt: new Date() } }). Use quando precisa lógica diferenciada entre "novo" e "já existe" (criar usuário ou atualizar last login). createMany com skipDuplicates — bulk insert ignorando conflitos de @unique. Não atualiza nada — só pula. Use quando: bulk insert idempotente onde não interessa atualizar o existente (seed de tags). Bulk upsert real não existe nativo — use loop de upsert ou raw SQL com ON CONFLICT (Postgres).',
    tip: 'Upsert é atômico para 1 registro; createMany com skip é bulk mas não atualiza. São casos de uso ortogonais.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar cursor pagination vs offset (skip/take)?',
    a: 'Offset (skip/take): banco precisa varrer todas as N linhas até a posição. Para skip: 100000, full scan até a posição 100k antes de retornar 20 itens. OK para listas pequenas e admin paginado. Cursor: O(1) — você passa o id do último item visto e pede os próximos N. Ideal para feeds infinitos. Combine cursor com orderBy estável (geralmente createdAt + id como tiebreaker) para garantir ordem determinística — sem id, dois registros com mesmo createdAt causam ordem indefinida e cursor pode pular ou duplicar. skip: 1 quando há cursor para pular o próprio cursor recebido como limite.',
    tip: 'O tiebreaker estável (createdAt + id) é detalhe que separa quem implementou cursor de quem só copiou exemplo simples.',
  },
]

// ── Dados — Anti-patterns ─────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'N+1 query — loop com findUnique',
    badDesc: 'Iterar lista e fazer query por item. 100 posts viram 101 queries — latência multiplica em produção.',
    badCode: [
      { t: 'const posts = await prisma.post.findMany();' },
      { t: '\nfor (const post of posts) {', c: '#ef4444' },
      { t: '\n  // 1 query por post — N+1!', c: '#ef4444' },
      { t: '\n  post.author = await prisma.user.findUnique({', c: '#ef4444' },
      { t: '\n    where: { id: post.authorId }', c: '#ef4444' },
      { t: '\n  });' },
      { t: '\n}' },
      { t: '\n// 100 posts → 101 queries', c: '#ef4444' },
    ],
    goodDesc: 'include otimiza para 2 queries (SELECT da entidade + SELECT IN dos relacionados) — total constante.',
    goodCode: [
      { t: 'const posts = await prisma.post.findMany({', c: '#4ade80' },
      { t: '\n  include: { author: true }', c: '#4ade80' },
      { t: '\n});' },
      { t: '\n// Prisma faz internamente:' },
      { t: '\n// SELECT * FROM posts;', c: '#4ade80' },
      { t: '\n// SELECT * FROM users WHERE id IN (...);', c: '#4ade80' },
      { t: '\n// 100 posts → 2 queries', c: '#4ade80' },
    ],
    why: 'N+1 é morte por mil cortes — cada query tem latência de rede ao banco (~1-5ms). 100 queries = ~500ms só de roundtrips. Com include, 2 queries = ~10ms. Em GraphQL com resolvers independentes, use DataLoader na camada GraphQL.',
  },
  {
    title: 'prisma global dentro de $transaction interativa',
    badDesc: 'Usar prisma global no callback executa FORA da transação — quebra atomicidade silenciosamente.',
    badCode: [
      { t: 'await prisma.$transaction(async (tx) => {' },
      { t: '\n  const user = await tx.user.findUnique(...);  // ok, tx', c: '#4ade80' },
      { t: '\n  if (user.balance < amount) {' },
      { t: '\n    // Usa prisma global — FORA DA TRANSAÇÃO!', c: '#ef4444' },
      { t: '\n    await prisma.audit.create({ data: {...} });', c: '#ef4444' },
      { t: '\n  }' },
      { t: '\n  await tx.user.update(...);  // ok' },
      { t: '\n});' },
    ],
    goodDesc: 'Dentro do callback, sempre tx. Nunca prisma global. Audit trail e qualquer write fica na mesma transação.',
    goodCode: [
      { t: 'await prisma.$transaction(async (tx) => {', c: '#4ade80' },
      { t: '\n  const user = await tx.user.findUnique(...);' },
      { t: '\n  if (user.balance < amount) {' },
      { t: '\n    // Sempre tx — dentro da transação', c: '#4ade80' },
      { t: '\n    await tx.audit.create({ data: {...} });', c: '#4ade80' },
      { t: '\n  }' },
      { t: '\n  await tx.user.update(...);' },
      { t: '\n});' },
    ],
    why: 'O callback recebe tx — qualquer chamada com prisma global executa em outra conexão, FORA da transação. Se a transação faz rollback, o write com prisma global persiste — quebra de consistência sutil. Regra: dentro do callback, sempre tx; nunca prisma.',
  },
  {
    title: 'PrismaClient instanciado em cada request (Next.js dev)',
    badDesc: 'Em dev com hot reload, cada reload cria nova instância — pool de conexões esgota em minutos.',
    badCode: [
      { t: '// app/api/users/route.ts' },
      { t: '\nimport { PrismaClient } from "@prisma/client";' },
      { t: '\n' },
      { t: '\nexport async function GET() {' },
      { t: '\n  const prisma = new PrismaClient();', c: '#ef4444' },
      { t: '\n  // hot reload em dev → N instâncias → pool exhaust', c: '#ef4444' },
      { t: '\n  return Response.json(await prisma.user.findMany());' },
      { t: '\n}' },
    ],
    goodDesc: 'Singleton via globalThis em dev — uma única instância sobrevive ao hot reload.',
    goodCode: [
      { t: '// lib/prisma.ts' },
      { t: '\nimport { PrismaClient } from "@prisma/client";' },
      { t: '\n' },
      { t: '\nconst globalForPrisma = globalThis as unknown as {', c: '#4ade80' },
      { t: '\n  prisma: PrismaClient | undefined' },
      { t: '\n};' },
      { t: '\nexport const prisma = globalForPrisma.prisma ?? new PrismaClient();', c: '#4ade80' },
      { t: '\nif (process.env.NODE_ENV !== "production") {', c: '#4ade80' },
      { t: '\n  globalForPrisma.prisma = prisma;' },
      { t: '\n}' },
      { t: '\n// app/api/users/route.ts: import { prisma } from "@/lib/prisma"' },
    ],
    why: 'Hot reload do Next.js em dev recarrega módulos — sem singleton, cada reload cria nova PrismaClient com seu pool. Em poucos minutos, banco recusa conexões (Postgres tem limite ~100). Em produção, build cria uma única instância naturalmente — mas o pattern globalThis é defensivo para todos os ambientes.',
  },
  {
    title: 'db push em produção',
    badDesc: 'Pula histórico de migrations, sem rollback, SQL nunca foi revisado em PR.',
    badCode: [
      { t: '# .github/workflows/deploy.yml' },
      { t: '\n- name: Deploy' },
      { t: '\n  run: |' },
      { t: '\n    npx prisma db push', c: '#ef4444' },
      { t: '\n    npm run build && npm start' },
      { t: '\n# db push pula histórico, sem rollback,', c: '#ef4444' },
      { t: '\n# sem revisão de SQL antes de aplicar', c: '#ef4444' },
    ],
    goodDesc: 'migrate deploy aplica apenas migrations já versionadas — você revisou o SQL gerado em PR.',
    goodCode: [
      { t: '# .github/workflows/deploy.yml' },
      { t: '\n- name: Generate Prisma Client' },
      { t: '\n  run: npx prisma generate', c: '#4ade80' },
      { t: '\n- name: Apply migrations' },
      { t: '\n  run: npx prisma migrate deploy', c: '#4ade80' },
      { t: '\n- name: Build' },
      { t: '\n  run: npm run build' },
      { t: '\n# migrate deploy só aplica versionadas, idempotente', c: '#4ade80' },
    ],
    why: 'db push é destrutivo em produção: pula histórico de migrations, impossibilita rollback controlado, e o SQL nunca foi revisado em PR. migrate deploy aplica apenas migrations já versionadas — você revisou o SQL gerado quando rodou migrate dev local. Idempotente: pode rodar duas vezes sem efeito colateral.',
  },
  {
    title: '$queryRawUnsafe com input do usuário',
    badDesc: 'Interpolação de string permite SQL injection — input vira SQL literal sem escape.',
    badCode: [
      { t: 'const userId = req.query.id;' },
      { t: '\n// SQL injection — interpolação direta', c: '#ef4444' },
      { t: '\nconst user = await prisma.$queryRawUnsafe(', c: '#ef4444' },
      { t: '\n  `SELECT * FROM users WHERE id = "${userId}"`', c: '#ef4444' },
      { t: '\n);' },
      { t: '\n// userId="1; DROP TABLE users--" = catastrofe', c: '#ef4444' },
    ],
    goodDesc: '$queryRaw com template literal parametriza automaticamente — driver escapa, injection impossível.',
    goodCode: [
      { t: 'const userId = req.query.id;' },
      { t: '\n// $queryRaw com template literal — parametrizado', c: '#4ade80' },
      { t: '\nconst user = await prisma.$queryRaw<User[]>`', c: '#4ade80' },
      { t: '\n  SELECT * FROM users WHERE id = ${userId}', c: '#4ade80' },
      { t: '\n`;' },
      { t: '\n// Prisma traduz para WHERE id = $1, parametrizado' },
      { t: '\n// SQL injection impossível por design', c: '#4ade80' },
    ],
    why: '$queryRawUnsafe interpola string — input do usuário vira SQL literal. $queryRaw com template literal converte ${var} em parâmetro $N do driver — escape automático. Use Unsafe APENAS quando você está construindo SQL programaticamente sem input externo (ORDER BY dinâmico whitelisted). Nunca com input direto de request.',
  },
  {
    title: 'Cursor pagination sem tiebreaker estável',
    badDesc: 'orderBy só por createdAt — registros com mesmo timestamp têm ordem indefinida, cursor quebra.',
    badCode: [
      { t: '// Cursor pagination sem tiebreaker' },
      { t: '\nconst posts = await prisma.post.findMany({' },
      { t: '\n  take: 20,' },
      { t: '\n  cursor: cursor ? { id: cursor } : undefined,' },
      { t: '\n  orderBy: { createdAt: "desc" }', c: '#ef4444' },
      { t: '\n  // Posts com mesmo createdAt → ordem indefinida', c: '#ef4444' },
      { t: '\n  // Cursor pula registros ou mostra duplicados', c: '#ef4444' },
      { t: '\n});' },
    ],
    goodDesc: 'orderBy array com id como segundo critério garante ordem total. skip: 1 pula o próprio cursor.',
    goodCode: [
      { t: 'const posts = await prisma.post.findMany({' },
      { t: '\n  take: 20,' },
      { t: '\n  cursor: cursor ? { id: cursor } : undefined,' },
      { t: '\n  skip: cursor ? 1 : 0,', c: '#4ade80' },
      { t: '\n  orderBy: [' },
      { t: '\n    { createdAt: "desc" },', c: '#4ade80' },
      { t: '\n    { id: "desc" }  // tiebreaker estável', c: '#4ade80' },
      { t: '\n  ]' },
      { t: '\n});' },
    ],
    why: 'Cursor pagination depende de ordem determinística. Se dois registros têm o mesmo createdAt, a ordem é indefinida no banco — cursor pode pular ou duplicar registros entre páginas. Adicione id (PK estável) como segundo critério para garantir ordem total. skip: 1 quando há cursor pula o próprio cursor recebido.',
  },
]

// ── Dados — Mnemônicos ────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'PIPELINE — os 4 estágios',
    trick: 'Schema → Generate → Migrate → Client',
    expansion: [
      ['S', 'Schema — schema.prisma é a fonte única de verdade'],
      ['G', 'Generate — produz @prisma/client com tipos TS (não toca no banco)'],
      ['M', 'Migrate — calcula diff e gera SQL versionado em prisma/migrations/'],
      ['C', 'Client — app importa { prisma } e usa com type-safety'],
    ],
    explanation: 'A ordem nunca muda. Edita schema, roda migrate dev (que internamente faz generate + aplica + regenera). Em produção: prisma generate no build + prisma migrate deploy antes do app subir. db push existe mas é apenas para protótipos.',
    example: '# Dev:\nnpx prisma migrate dev --name add_user\n# Prod (CI):\nnpx prisma generate && npx prisma migrate deploy',
    why: 'Saber que generate NÃO toca no banco e migrate SIM é o ponto de virada. Confundir os dois é o erro #1 em onboarding de Prisma.',
  },
  {
    label: 'DvD — dev vs deploy',
    trick: 'dev = gera + aplica + regenera client · deploy = só aplica versionadas',
    expansion: [
      ['D', 'Dev — interativo, gera novas migrations, regenera @prisma/client'],
      ['v', 'vs — comandos diferentes, ambientes diferentes'],
      ['D', 'Deploy — idempotente, só aplica versionadas em ordem cronológica'],
    ],
    explanation: 'migrate dev é local: cria novas migrations e regenera tipos. NUNCA em produção (geraria migrations em runtime). migrate deploy é CI/CD: aplica migrations já criadas e revisadas em PR. Idempotente — pode rodar duas vezes sem efeito.',
    example: '# Local: cria 20240501_add_post.sql\nnpx prisma migrate dev --name add_post\n# CI: só aplica o que já existe\nnpx prisma migrate deploy',
    why: 'A regra de ouro: migrations já aplicadas são imutáveis. Para corrigir uma migration ruim, crie uma NOVA que ajuste — nunca edite a anterior. Em produção, sempre deploy.',
  },
  {
    label: 'SI — select estreita, include amplia',
    trick: 'Select = Subset · Include = Inclui relações',
    expansion: [
      ['S', 'Select — whitelist de campos. Tipo de retorno encolhe.'],
      ['I', 'Include — adiciona relações ao tipo base. Mantém escalares.'],
      ['—', 'Não pode usar os dois no mesmo nível. Para combinar, select aninhado.'],
    ],
    explanation: 'select reduz: { select: { id: true } } retorna { id: string } — sem outros campos. include amplia: { include: { posts: true } } retorna User & { posts: Post[] }. TypeScript estreita o tipo automaticamente baseado no que você pede.',
    example: '// select aninhado para limitar pai E incluir relação:\nselect: { id: true, posts: { select: { title: true } } }',
    why: 'select para reduzir payload de rede e memória. include quando precisa do registro completo. select aninhado quando você quer os dois benefícios — limitar pai e incluir relação enxuta.',
  },
  {
    label: 'TX-tx — sempre tx, nunca prisma global',
    trick: '$transaction(async (tx) => { use tx, NEVER prisma })',
    expansion: [
      ['t', 'tx é o cliente transacional recebido no callback'],
      ['x', 'eXclusivo da transação — todas as ops via tx ficam atômicas'],
      ['!', 'prisma global dentro do callback executa FORA da transação'],
    ],
    explanation: 'Dentro do callback de $transaction interativo, qualquer chamada com o prisma global (não o tx recebido) executa em conexão diferente, fora da transação. Se a transação faz rollback, o write com prisma global persiste — bug sutil de consistência.',
    example: '$transaction(async (tx) => {\n  await tx.user.update(...)  // ✓ tx\n  await prisma.audit.create(...) // ✗ FORA\n})',
    why: 'É o erro número 1 de transações em Prisma. Em entrevista, mostre o exemplo concreto — diferencia quem realmente usou de quem só leu docs.',
  },
]

// ── Componente principal ──────────────────────────────────────────────────────

export default function PrismaPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)

  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
    'quick-ref': () => buildQuickRefPdf({
      columns: QR_COLUMNS,
      skillName: 'Prisma',
      accentColor: C,
      stackLabel: 'ORM / Backend TS',
      tagline: 'ORM TypeScript-first — schema, migrate, client tipado',
      version: '5.x',
    }),
    qa: () => buildQAReviewPdf({
      qa: QAS,
      accentColor: C,
      skillName: 'Prisma',
      stackLabel: 'ORM / Backend TS',
    }),
    antipatterns: () => buildAntipatternsPdf({
      antipatterns: ANTIPATTERNS,
      accentColor: C,
      skillName: 'Prisma',
      stackLabel: 'ORM / Backend TS',
    }),
    mnemonics: () => buildMnemonicsPdf({
      mnemonics: MNEMONICS,
      accentColor: C,
      skillName: 'Prisma',
      stackLabel: 'ORM / Backend TS',
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
