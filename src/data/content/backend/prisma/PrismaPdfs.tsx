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
import { buildCommandRefPdf } from '@/components/pdfs/CommandRefPdf'
import type { CommandEntry } from '@/components/pdfs/CommandRefPdf'

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
  {
    id: 'schema-language',
    title: 'Schema Language Reference',
    subtitle: 'Todas as diretivas da DSL .prisma numa página densa',
    type: 'cheatsheet',
    pages: 1,
    description: 'Referência densa A4 landscape focada na DSL do schema.prisma — tipos escalares completos com mapeamento SQL, modificadores (?, [], @db.X), todos os atributos @ (id, default, unique, relation, updatedAt, map, ignore) e @@ (id, unique, index, fulltext, map), sintaxe de relações 1:1 / 1:N / N:N, sintaxe de enum e cardinalidades. Substitui ler a docs em 80% dos casos de schema authoring.',
    icon: '05',
    goal: 'Schema authoring',
  },
  {
    id: 'migrations-cli',
    title: 'Migration Operations Guide',
    subtitle: 'Cada comando do CLI de migrate com efeito interno e edge cases',
    type: 'migrations-cli',
    pages: 5,
    description: 'Referência completa de prisma migrate — dev, deploy, reset, status, resolve — com o que cada comando faz internamente (gera SQL? aplica? regenera client?), o estado da tabela _prisma_migrations, drift detection, shadow database, recovery de migration corrupta, e comparação com db push. Comandos destrutivos sinalizados. Inclui o fluxo seguro do generate ao deploy em CI/CD.',
    icon: '06',
    goal: 'Migrations em produção',
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

// ── Dados — Schema Language Reference (QuickRef format) ──────────────────────

const SCHEMA_QR_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Blocos top-level',
        entries: [
          { key: 'datasource db { provider, url, directUrl? }', value: 'postgresql, mysql, sqlite, sqlserver, mongodb, cockroachdb. directUrl para Accelerate.' },
          { key: 'generator client { provider, output? }', value: 'prisma-client-js. output customiza local — útil em monorepo.' },
          { key: 'previewFeatures = ["..."]', value: 'fullTextSearch, fullTextIndex, driverAdapters, metrics, tracing, postgresqlExtensions' },
          { key: 'model X {} / enum Y {}', value: 'model = tabela. enum = literal type tipado.' },
        ],
      },
      {
        title: 'Tipos escalares (Postgres mapping)',
        entries: [
          { key: 'String', value: 'TEXT (default) — use @db.VarChar(N) para limitar' },
          { key: 'Int / BigInt', value: 'INTEGER / BIGINT — use BigInt para IDs > 2³¹' },
          { key: 'Float / Decimal', value: 'DOUBLE PRECISION / DECIMAL(p,s) — Decimal para dinheiro' },
          { key: 'Boolean', value: 'BOOLEAN' },
          { key: 'DateTime', value: 'TIMESTAMP(3) — milissegundos. Use @db.Timestamptz para timezone-aware.' },
          { key: 'Json', value: 'JSONB no Postgres (não JSON simples) — index com @@index e operadores' },
          { key: 'Bytes', value: 'BYTEA — para binários, use @db.ByteA' },
        ],
      },
      {
        title: 'Modificadores de campo',
        entries: [
          { key: '?', value: 'Nullable. ex: name String? — coluna NULLABLE' },
          { key: '[]', value: 'Array — só Postgres / MongoDB. ex: tags String[]' },
          { key: '@db.VarChar(255)', value: 'Tipo SQL nativo — VARCHAR(255). Sem isso = TEXT.' },
          { key: '@db.Text / @db.Citext', value: 'Texto longo / case-insensitive (Postgres)' },
          { key: '@db.Timestamptz(6)', value: 'TIMESTAMP WITH TIME ZONE — recomendado para produção' },
          { key: '@db.Uuid', value: 'UUID nativo Postgres — combine com @default(uuid())' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Atributos @ (campo)',
        entries: [
          { key: '@id', value: 'Chave primária. Combine com @default()' },
          { key: '@default(...)', value: 'cuid() / uuid() / autoincrement() / now() / dbgenerated("...") / env("VAR")' },
          { key: '@unique', value: 'Constraint UNIQUE — usado em findUnique. Cria índice automaticamente.' },
          { key: '@updatedAt', value: 'Touch automático em update — Prisma seta NOW(). Não cria trigger no banco.' },
          { key: '@map("col_no_db")', value: 'Renomeia coluna no banco mantendo nome TS limpo' },
          { key: '@relation(fields, references, onDelete, onUpdate)', value: 'Define FK. onDelete: Cascade | Restrict | SetNull | NoAction' },
          { key: '@ignore', value: 'Prisma ignora o campo (introspect de tabela legada)' },
        ],
      },
      {
        title: 'Atributos @@ (modelo)',
        entries: [
          { key: '@@id([a, b])', value: 'PK composta — usado em N:N explícitas' },
          { key: '@@unique([a, b])', value: 'Constraint UNIQUE composta — ex: (tenantId, slug)' },
          { key: '@@index([a, b])', value: 'Índice composto. Ordem importa para prefixos!', badge: '★ critico', badgeColor: '#5A67D8' },
          { key: '@@index([col(sort: Desc)])', value: 'Índice com direção — Postgres only' },
          { key: '@@fulltext([title, content])', value: 'Índice FTS — requer previewFeatures fullTextIndex' },
          { key: '@@map("tabela_no_db")', value: 'Renomeia tabela. ex: @@map("users") com model User' },
          { key: '@@ignore', value: 'Prisma ignora o model — útil em introspect' },
        ],
      },
      {
        title: 'Sintaxe de relações',
        entries: [
          { key: '1:1', value: 'profile Profile? + userId String @unique + user @relation(...)' },
          { key: '1:N (one)', value: 'posts Post[] — virtual, sem coluna no banco' },
          { key: '1:N (many)', value: 'authorId String + author User @relation(fields: [authorId], references: [id])' },
          { key: 'N:N implícita', value: 'tags Tag[] + posts Post[] — Prisma cria _PostToTag automaticamente' },
          { key: 'N:N explícita', value: 'model PostTag { postId, tagId, ...meta, @@id([postId, tagId]) }' },
          { key: 'auto-relação', value: 'parent Post? @relation("Parent", fields:[parentId], references:[id]) + replies Post[] @relation("Parent")' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Enum',
        entries: [
          { key: 'enum Role { ADMIN USER GUEST }', value: 'Literal type — gerado em TS como string union' },
          { key: 'role Role @default(USER)', value: 'Uso em campo — autocomplete dos valores' },
          { key: '@map em enum', value: 'value @map("admin") — controla string no banco' },
        ],
      },
      {
        title: 'Geradores de @default',
        entries: [
          { key: 'cuid()', value: 'Collision-resistant ID — 24 chars, ordenável por tempo' },
          { key: 'uuid()', value: 'UUID v4 — universalmente compatível, não ordenável' },
          { key: 'autoincrement()', value: 'Sequence Postgres — Int @id @default(autoincrement())' },
          { key: 'now()', value: 'Timestamp atual — DateTime @default(now())' },
          { key: 'dbgenerated("...")', value: 'SQL nativo — ex: dbgenerated("gen_random_uuid()") usa pg crypto' },
          { key: 'env("VAR_NAME")', value: 'Lê env var em build time — só em datasource.url' },
        ],
      },
      {
        title: 'Schema completo — exemplo canônico',
        entries: [
          { key: 'model User', value: 'id String @id @default(cuid()), email String @unique, posts Post[]' },
          { key: 'model Post', value: 'id String @id, title String @db.VarChar(255), authorId String, author User @relation(fields:[authorId], references:[id], onDelete: Cascade), @@index([authorId])' },
          { key: 'enum Status', value: 'DRAFT, PUBLISHED, ARCHIVED' },
          { key: 'Validações', value: 'String? = nullable. Sem ? = NOT NULL. SEMPRE @@index em FK manual.' },
        ],
      },
    ],
  },
]

// ── Dados — Migration Operations Guide ────────────────────────────────────────

const MIGRATION_COMMANDS: CommandEntry[] = [
  {
    category: 'Desenvolvimento local',
    command: 'prisma migrate dev --name <descricao>',
    description: 'Comando completo de dev. (1) Compara schema.prisma com migrations já aplicadas (não com banco direto), (2) gera SQL de diff em prisma/migrations/<timestamp>_<descricao>/migration.sql, (3) aplica no banco de dev, (4) regenera @prisma/client com novos tipos, (5) roda seed se package.json tiver "prisma": { "seed": "..." }. Pode pedir reset se detectar drift entre banco e migrations.',
    flags: [
      { flag: '--name', description: 'string — nome curto da migration (snake_case). Vira nome da pasta.' },
      { flag: '--create-only', description: 'Gera o arquivo SQL mas NÃO aplica — útil para revisar antes' },
      { flag: '--skip-seed', description: 'Pula execução do seed após aplicar' },
      { flag: '--skip-generate', description: 'Pula prisma generate (raro, útil em pipeline custom)' },
    ],
    example: '$ npx prisma migrate dev --name add_post_status\n# Gera prisma/migrations/20250506120000_add_post_status/migration.sql\n# Aplica no banco de dev\n# Regenera @prisma/client',
  },
  {
    category: 'Produção e CI/CD',
    command: 'prisma migrate deploy',
    description: 'Comando de produção. SÓ aplica migrations já versionadas em ordem cronológica. Não gera novas migrations, não regenera client (rode generate explicitamente no build), idempotente — rodar duas vezes não causa problema. Faz lock no banco para impedir aplicações simultâneas em CI paralelo. Falha se schema.prisma diverge das migrations (drift).',
    example: '# .github/workflows/deploy.yml\n- run: npx prisma generate\n- run: npx prisma migrate deploy\n- run: npm run build\n# Idempotente — pode rodar várias vezes',
  },
  {
    category: 'Desenvolvimento local',
    command: 'prisma migrate reset',
    description: 'DROP de todo o banco e re-aplica todas as migrations do zero. Roda automaticamente o seed ao final. Útil quando banco local está corrompido ou divergiu (drift). NUNCA em produção — apaga TUDO. Em CI de teste pode ser útil para garantir banco limpo entre runs.',
    danger: true,
    flags: [
      { flag: '--force', description: 'Pula confirmação interativa — útil em CI' },
      { flag: '--skip-seed', description: 'Não roda o seed após reset' },
    ],
    example: '$ npx prisma migrate reset --force\n# DROP DATABASE; CREATE DATABASE;\n# Re-aplica todas as migrations\n# Roda o seed',
  },
  {
    category: 'Inspeção',
    command: 'prisma migrate status',
    description: 'Mostra o estado das migrations: quais estão aplicadas no banco, quais estão pendentes, se há drift entre schema e banco. Use antes de deploy em prod para verificar que tudo está sincronizado.',
    example: '$ npx prisma migrate status\n# Status\n# - 3 migrations found\n# - 3 migrations applied\n# Database schema is up to date.',
  },
  {
    category: 'Recovery (situações de drift)',
    command: 'prisma migrate resolve --applied <name>',
    description: 'Marca manualmente uma migration como aplicada na tabela _prisma_migrations sem rodar o SQL. Use APENAS quando a migration já foi aplicada manualmente (hotfix em prod) e você precisa atualizar o histórico do Prisma.',
    danger: true,
    flags: [
      { flag: '--applied', description: 'Nome da migration a marcar como aplicada' },
      { flag: '--rolled-back', description: 'Marca migration falhada como revertida (limpa estado)' },
    ],
    example: '$ npx prisma migrate resolve --applied 20250506120000_add_post_status\n# Insert em _prisma_migrations sem executar SQL\n# Use SOMENTE em recovery — não rotineiro',
  },
  {
    category: 'Geração e introspect',
    command: 'prisma generate',
    description: 'Apenas regenera o @prisma/client com tipos atualizados — NÃO toca no banco. Útil quando você fez pull de migrations do colega e precisa atualizar o client. Roda automático no postinstall e depois de migrate dev. Em CI/build, sempre execute antes do build do app.',
    flags: [
      { flag: '--watch', description: 'Re-gera quando schema.prisma muda — útil em desenvolvimento' },
      { flag: '--no-engine', description: 'Pula download do query engine binário (em CI custom)' },
    ],
    example: '$ npx prisma generate\n# Lê schema.prisma\n# Gera node_modules/.prisma/client com tipos TS',
  },
  {
    category: 'Geração e introspect',
    command: 'prisma db pull',
    description: 'Introspect — lê o schema do banco existente e gera/atualiza schema.prisma. Útil para greenfield em DB legado. Não toca em migrations — você ainda precisa rodar migrate dev para criar baseline.',
    example: '$ npx prisma db pull\n# Conecta no banco\n# Atualiza schema.prisma com models, campos, FKs detectados',
  },
  {
    category: 'Prototipação (NÃO produção)',
    command: 'prisma db push',
    description: 'Sincroniza schema.prisma → banco SEM gerar migration. Pula histórico, sem rollback controlado, sem revisão de SQL. APENAS protótipos descartáveis ou desenho rápido de schema. NUNCA em produção. Em projetos sérios, vire para migrate dev assim que o schema estabilizar.',
    danger: true,
    flags: [
      { flag: '--accept-data-loss', description: 'Aceita perda de dados se mudança implica DROP' },
      { flag: '--force-reset', description: 'Reset do banco antes do push' },
    ],
    example: '$ npx prisma db push\n# Faz DDL direto no banco\n# Nenhum arquivo gerado em prisma/migrations/\n# Histórico pulado — uso restrito a protótipos',
  },
  {
    category: 'Inspeção',
    command: 'prisma studio',
    description: 'GUI no browser para inspecionar e editar dados. Roda em http://localhost:5555. Útil para debug rápido em dev. Não use em produção — não tem auth, edita dados sem validação de aplicação.',
    example: '$ npx prisma studio\n# Abre http://localhost:5555\n# UI tabular para todos os models',
  },
  {
    category: 'Conceitos importantes',
    command: '_prisma_migrations (tabela interna)',
    description: 'Tabela criada automaticamente no banco para registrar quais migrations foram aplicadas. Colunas: id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count. NUNCA edite manualmente — use prisma migrate resolve.',
    example: '-- Estrutura simplificada\nCREATE TABLE _prisma_migrations (\n  id VARCHAR(36) PRIMARY KEY,\n  checksum VARCHAR(64),\n  finished_at TIMESTAMP,\n  migration_name VARCHAR(255),\n  logs TEXT,\n  rolled_back_at TIMESTAMP,\n  started_at TIMESTAMP DEFAULT NOW(),\n  applied_steps_count INTEGER\n);',
  },
  {
    category: 'Conceitos importantes',
    command: 'Shadow database',
    description: 'Banco temporário que o Prisma cria para detectar drift e gerar SQL correto. Usado em migrate dev. Em Postgres, exige permissão CREATE DATABASE. Em managed services (Supabase, Neon) que não permitem isso, configure shadowDatabaseUrl no datasource.',
    example: '// schema.prisma\ndatasource db {\n  provider          = "postgresql"\n  url               = env("DATABASE_URL")\n  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")\n}',
  },
  {
    category: 'Conceitos importantes',
    command: 'Drift detection',
    description: 'Prisma detecta drift quando o schema do banco diverge do esperado pelas migrations já aplicadas (alguém alterou direto no banco, ou hotfix manual). Em migrate dev, oferece reset; em migrate deploy, falha. Para resolver: revertir mudança manual ou usar migrate resolve.',
    example: '# Detecção:\n$ prisma migrate dev\n# > Drift detected: Your database schema is not in sync\n# > Soluções:\n# > 1. Reverter mudança manual no banco\n# > 2. prisma migrate resolve (marca como aplicada)\n# > 3. prisma migrate reset (apaga tudo, dev only)',
  },
  {
    category: 'Workflow seguro (deploy CI/CD)',
    command: 'Pipeline completo recomendado',
    description: 'Sequência segura para deploy em produção: (1) dev local roda migrate dev e revisa SQL gerado em PR; (2) PR mergeada faz CI rodar tests com banco limpo; (3) deploy roda generate + migrate deploy + build; (4) app sobe com client regenerado. NUNCA db push em CI.',
    example: '# 1. DEV local\nnpx prisma migrate dev --name add_index\ngit add prisma/migrations\ngit commit -m "feat: add index"\n\n# 2. CI test\nnpx prisma migrate reset --force\nnpm test\n\n# 3. CI deploy\nnpx prisma generate\nnpx prisma migrate deploy\nnpm run build && npm start',
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
    cheatsheet: () => buildQuickRefPdf({
      columns: SCHEMA_QR_COLUMNS,
      skillName: 'Prisma',
      accentColor: C,
      stackLabel: 'ORM / Backend TS',
      tagline: 'Schema Language Reference — DSL .prisma em uma página',
      version: '5.x',
    }),
    'migrations-cli': () => buildCommandRefPdf({
      commands: MIGRATION_COMMANDS,
      accentColor: C,
      skillName: 'Prisma',
      stackLabel: 'ORM / Backend TS',
      coverTitle: 'Migration Operations Guide',
      coverSubtitle: 'Cada comando do prisma migrate (dev, deploy, reset, status, resolve), o efeito interno de cada um, recovery de drift, shadow database e o pipeline seguro para CI/CD. Comandos destrutivos sinalizados.',
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
