import type { SkillContent } from '@/types'

const drizzle: SkillContent = {
  tagline: "ORM TypeScript SQL-first, leve e type-safe, emergindo como alternativa ao Prisma.",
  why: "Drizzle está crescendo rapidamente como alternativa ao Prisma para quem quer mais controle sobre SQL com type-safety. Aparece em vagas que usam stack moderna TS.",
  summary: "Drizzle ORM é SQL-first: você define o schema em TypeScript e o client gerado reflete exatamente esse schema com tipos precisos. Não tem um runtime pesado — é essencialmente um query builder type-safe. Suporta PostgreSQL, MySQL, SQLite. Migrations via drizzle-kit. Ponto forte: zero overhead em runtime, queries próximas ao SQL, bundle size pequeno (bom para edge/serverless).",
  keypoints: [
    { title: "Schema definition", body: "Tabelas definidas com pgTable(), mysqlTable(), etc. Colunas tipadas: text(), integer(), timestamp(). Relações declaradas com relations()." },
    { title: "Query API", body: "db.select().from(users).where(eq(users.id, 1)). Type-safe: tipos inferidos do schema. Alternativa: SQL template tag para queries arbitrárias." },
    { title: "Drizzle-kit migrations", body: "drizzle-kit generate cria SQL de migration. drizzle-kit push para desenvolvimento rápido (sem arquivo de migration). Similar ao Prisma migrate." },
    { title: "Edge runtime", body: "Bundle pequeno e sem dependências nativas — funciona em Cloudflare Workers, Vercel Edge, Bun. Prisma tem problemas nesses ambientes." },
    { title: "Prisma vs Drizzle", body: "Prisma: melhor DX, schema mais legível, ecossistema maior. Drizzle: mais leve, SQL mais explícito, edge-friendly, crescendo rapidamente." },
  ],
  gotchas: [
    "Relations em Drizzle são apenas para query API — não criam foreign keys no banco. Declare FK separadamente.",
    "drizzle-kit push em produção — aplica mudanças direto sem migration file. Use generate + migrate em prod.",
    "Ecosistema menor que Prisma — menos plugins e exemplos disponíveis.",
  ],
  interview: [
    { q: "Quando escolheria Drizzle em vez de Prisma?", a: "<p>Drizzle: edge runtime (Cloudflare Workers, Vercel Edge), bundle size crítico, queremos SQL mais explícito, projeto novo com time que prefere SQL-first.</p><p>Prisma: DX prioridade, equipe menos familiarizada com SQL, ecossistema maduro importante, NestJS com integração profunda.</p><p>Em 2025, ambos são opções válidas — Drizzle está amadurecendo rapidamente.</p>" },
  ],
  resources: [
    { title: "Drizzle docs", url: "https://orm.drizzle.team/docs/overview", kind: "docs" },
  ],
}

export default drizzle
