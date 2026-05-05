import type { SkillContent } from '@/types'

const sequelize: SkillContent = {
  tagline: "ORM Node.js maduro com suporte a MySQL, PostgreSQL, SQLite e MSSQL.",
  why: "Sequelize ainda aparece em projetos legados Node.js. Saber que ele existe, seus trade-offs e quando migrar para Prisma/Drizzle é conhecimento esperado.",
  summary: "Sequelize é um ORM maduro para Node.js com suporte a múltiplos bancos. Usa o padrão Active Record. Tem migrations, associações (hasMany, belongsTo, etc.), hooks (beforeCreate, afterUpdate) e validações. Amplamente usado em projetos legados. Em novos projetos, Prisma e Drizzle são escolhas mais modernas.",
  keypoints: [
    { title: "Models e associações", body: "Model.init() define colunas e tipos. Associações: hasOne, hasMany, belongsTo, belongsToMany. include na query faz eager loading (JOIN)." },
    { title: "Migrations", body: "sequelize-cli gera migration files. up() e down() para aplicar e reverter. queryInterface para DDL direto." },
    { title: "Hooks", body: "beforeCreate, afterCreate, beforeUpdate, etc. Para audit log, hash de senha, validações assíncronas." },
    { title: "Transactions", body: "sequelize.transaction(async (t) => { ... }). Passa t como option para cada operação para incluí-la na transação." },
  ],
  gotchas: [
    "N+1 sem include — cada item faz query separada. Sempre use include para relações.",
    "sync({ force: true }) em produção — dropa e recria tabelas. Nunca em prod.",
    "Tipos inconsistentes — Sequelize não tem type-safety nativa como Prisma. Considere sequelize-typescript.",
  ],
  interview: [
    { q: "Sequelize vs Prisma — qual você prefere para novo projeto?", a: "<p>Prisma para novos projetos: melhor type-safety, schema declarativo mais legível, migrations mais confiáveis, DX superior. Sequelize para manter projetos legados que já o usam — migrar ORM tem custo alto e risco.</p>" },
  ],
  resources: [
    { title: "Sequelize docs", url: "https://sequelize.org/docs/v6/", kind: "docs" },
  ],
}

export default sequelize
