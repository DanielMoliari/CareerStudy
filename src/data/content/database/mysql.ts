import type { SkillContent } from '@/types'

const mysql: SkillContent = {
  tagline: "Banco relacional mais usado do mundo — legado robusto, InnoDB, replicação e MySQL 8.",
  why: "MySQL é base de inúmeros sistemas legados e ainda é adotado em novos projetos. Entender suas diferenças em relação ao Postgres e os gotchas do InnoDB evita surpresas em migração ou manutenção.",
  gotchas: [
    "ENUM e SET: alterações de schema em tabelas grandes requerem ALTER TABLE com lock — use VARCHAR + constraint de aplicação para colunas que mudam.",
    "Charset padrão histórico é latin1 — sempre especifique CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci para suporte completo a Unicode (emojis incluídos).",
    "SELECT sem ORDER BY com LIMIT — ordem de retorno não garantida no MySQL (ao contrário do Postgres que também não garante mas é mais consistente na prática).",
    "InnoDB tem row-level locking mas gap locks podem causar deadlocks inesperados em INSERTs concorrentes em ranges.",
    "ONLY_FULL_GROUP_BY desabilitado em versões antigas — permite GROUP BY com colunas não agregadas, resultado não determinístico.",
  ],
  summary: "MySQL usa InnoDB como engine default desde 5.5 (ACID, row-level locking, FK, MVCC). MySQL 8 trouxe window functions, CTEs, roles e JSON nativo. Diferenças chave vs Postgres: sem suporte a arrays, JSONB mais limitado (JSON), sem herança de tabela, tipos de dados menos ricos. Mas replicação é madura, ferramentas de DBA abundantes e performance para workloads read-heavy é sólida.",
}

export default mysql
