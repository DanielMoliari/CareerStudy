import type { SkillContent } from '@/types'

const sqlite: SkillContent = {
  tagline: "Banco embarcado, serverless, zero-config — perfeito para apps locais, testes e edge.",
  why: "SQLite é o banco mais instalado do mundo (browsers, mobile, apps desktop, IoT). Para testes locais e apps edge/WASM é a escolha natural. Entender suas limitações evita uso inadequado.",
  gotchas: [
    "Sem concorrência de escrita — apenas um writer por vez (WAL mode melhora, mas não elimina). Para múltiplos escritores concorrentes, use Postgres.",
    "Type affinity, não type enforcement — você pode inserir texto em coluna INTEGER sem erro. Validação deve ser na aplicação.",
    "Sem ALTER TABLE completo — não suporta DROP COLUMN, RENAME COLUMN (antes do 3.25) ou ADD CONSTRAINT. Requer recriar a tabela.",
    "Arquivo de banco pode corromper com crash sem WAL mode habilitado — sempre use PRAGMA journal_mode=WAL em produção.",
  ],
  summary: "SQLite armazena tudo em um arquivo. Sem servidor, sem configuração, ACID com WAL mode. Ideal para: testes (in-memory :memory:), apps desktop (Electron, Tauri), mobile (iOS/Android via native bindings), edge computing e WASM (sql.js, wa-sqlite). Não use para: múltiplos escritores concorrentes, dados compartilhados entre múltiplos processos em rede, replicação.",
}

export default sqlite
