import type { SkillContent } from '@/types'

const cdcDebezium: SkillContent = {
  tagline: "Change Data Capture — captura mudanças no banco de dados como eventos em tempo real.",
  why: "CDC com Debezium é a solução padrão para sincronizar dados entre sistemas sem polling. Aparece em stacks de data engineering, microserviços e event-driven architecture.",
  summary: "CDC (Change Data Capture) captura INSERT/UPDATE/DELETE no banco de dados e publica como eventos em tempo real. Debezium é o CDC open-source mais popular: lê o WAL (Write-Ahead Log) do PostgreSQL, binlog do MySQL, etc., e publica eventos no Kafka. Casos de uso: sincronizar banco com Elasticsearch, popular cache, audit log imutável, replicação de dados entre sistemas.",
  keypoints: [
    { title: "Como funciona", body: "Debezium lê o transaction log do banco (WAL no Postgres, binlog no MySQL) — não faz queries. Cada mudança gera um evento com before e after da linha." },
    { title: "Evento CDC", body: "Payload: op (c=create, u=update, d=delete, r=read/snapshot), before (estado anterior), after (estado novo), source (ts, table, lsn/offset)." },
    { title: "Connectors", body: "Debezium tem connectors para PostgreSQL, MySQL, MongoDB, Oracle, SQL Server. Roda como Kafka Connect connector." },
    { title: "Replication slots", body: "PostgreSQL: Debezium usa replication slot. Cuidado: replication slot retém WAL até o consumer processar — disco pode encher se Debezium ficar offline." },
    { title: "Casos de uso", body: "Sincronização Postgres → Elasticsearch para busca. Invalidação de cache quando dado muda. Audit log de todas as mudanças. Replicação para data warehouse." },
  ],
  gotchas: [
    "Replication slot de PostgreSQL sem consumidor ativo — WAL acumula, disco enche, banco trava.",
    "Schema evolution sem cuidado — mudança de coluna no banco quebra o consumer do evento.",
    "Snapshot inicial lento — tabelas grandes geram snapshot enorme antes de iniciar streaming.",
    "Event ordering em múltiplos processos — mesmo com Kafka, mudanças em tabelas diferentes não têm ordem global garantida.",
  ],
  interview: [
    { q: "Por que CDC é melhor que polling para sincronizar dados?", a: "<p>Polling: SELECT WHERE updated_at > last_check. Problemas: latência (depende do intervalo), deletes não capturados, sobrecarga no banco com queries frequentes, dados podem ser perdidos se updated_at não for confiável.</p><p>CDC: captura evento no momento da mudança no transaction log. Latência de milissegundos, captura deletes, zero sobrecarga de leitura no banco primário, ordenação garantida por log.</p>", level: "senior" },
  ],
  resources: [
    { title: "Debezium docs", url: "https://debezium.io/documentation/", kind: "docs" },
    { title: "PostgreSQL CDC com Debezium — tutorial", url: "https://debezium.io/documentation/reference/stable/connectors/postgresql.html", kind: "docs" },
  ],
}

export default cdcDebezium
