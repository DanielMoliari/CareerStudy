import type { SkillContent } from '@/types'

const rds: SkillContent = {
  tagline: "Banco relacional gerenciado — backup, patching, Multi-AZ e Read Replicas automáticos.",
  why: "RDS é o banco de produção padrão em AWS. Saber Multi-AZ vs Read Replica, Aurora vs RDS standard, RDS Proxy e monitoramento com Performance Insights é necessário para qualquer stack AWS séria.",
  summary: "Amazon RDS (Relational Database Service) gerencia bancos relacionais (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, Aurora). Cuida de backup automático, software patching, failover Multi-AZ, monitoramento e escalabilidade vertical. Aurora é engine compatível com MySQL/PostgreSQL com storage distribuído em 6 cópias em 3 AZs, failover mais rápido e melhor performance de leitura com até 15 Read Replicas.",
  keypoints: [
    { title: "Multi-AZ", body: "Standby replicado sincronamente em outra AZ. Failover automático em 30–60 s em falha da primária. O standby não recebe leituras — existe apenas para HA. Não confunda com Read Replica." },
    { title: "Read Replicas", body: "Réplicas assíncronas para distribuir leitura. RDS padrão: até 5 réplicas. Aurora: até 15, com lag < 100 ms. Podem ser promovidas a primary. Cross-region para latência próxima de usuários e DR." },
    { title: "Aurora", body: "Storage distribuído em 6 cópias em 3 AZs (quorum de escrita em 4/6). Leitura em qualquer cópia. Failover automático < 30 s. Aurora Serverless v2: autoscaling de ACUs (Aurora Capacity Units) sem downtime, bom para workloads variáveis." },
    { title: "RDS Proxy", body: "Connection pooler gerenciado. Mantém pool de conexões com o RDS e serve múltiplos clientes por conexão. Essencial quando Lambda + RDS: Lambda escala para centenas de instâncias simultâneas, cada uma com conexão própria — RDS Proxy reduz conexões reais ao banco." },
    { title: "Performance Insights", body: "Visualização de carga por tipo de espera (CPU, I/O, locks, network). Identifica queries lentas e gargalos. Gratuito para 7 dias de retenção, pago para mais. Combinado com pg_stat_statements (PostgreSQL) e EXPLAIN ANALYZE para diagnóstico completo." },
    { title: "Backup e PITR", body: "Automated backup: até 35 dias de retenção. Point-in-time recovery: restaura para qualquer segundo dentro do período de retenção. Snapshot manual: retido indefinidamente até deletar explicitamente. Restaurar snapshot cria uma nova instância — não restaura in-place." },
  ],
  gotchas: [
    "Multi-AZ não serve leituras do standby — use Read Replicas para escala de leitura. São propósitos distintos.",
    "Escalabilidade vertical requer breve downtime (1–2 min) — planeje janela de manutenção ou use Aurora (scaling mais suave).",
    "max_connections padrão baixo — em instâncias menores, saturado rapidamente. Configure no Parameter Group e use RDS Proxy para connection pooling.",
    "Snapshot criptografado não restaura em instância sem criptografia — e vice-versa. Defina criptografia desde o início.",
    "Aurora I/O-Optimized vs Standard — I/O-Optimized paga preço fixo por storage sem cobrança por I/O. Melhor a partir de ~25% de I/O no custo total. Calcule antes de migrar.",
    "Read Replica de RDS standard tem replication lag — para leituras críticas onde consistência importa, leia da primária.",
  ],
  interview: [
    { q: "Diferença entre Multi-AZ e Read Replica?", a: "<p><strong>Multi-AZ:</strong> réplica síncrona em outra AZ, failover automático, standby <em>não</em> serve leituras. Objetivo: alta disponibilidade (HA).</p><p><strong>Read Replica:</strong> réplica assíncrona, serve leituras, pode ter replication lag. Objetivo: escala de leitura e DR.</p><p>Em produção: use os dois juntos — Multi-AZ para HA do primary, Read Replicas para distribuir carga de leitura.</p>", level: "pleno" },
    { q: "Quando usar Aurora em vez de RDS PostgreSQL padrão?", a: "<p><strong>Use Aurora quando:</strong> precisa de alta escala de leitura (até 15 réplicas com lag < 100 ms), failover mais rápido (< 30 s vs 60 s), Aurora Serverless para workload variável, ou a performance 3–5× do storage distribuído compensa o custo.</p><p><strong>Use RDS PostgreSQL padrão quando:</strong> precisa de compatibilidade total (Aurora tem pequenas diferenças de comportamento), usa extensões que Aurora não suporta (pglogical, algumas de terceiros), ou o workload é pequeno e o custo de Aurora não se justifica.</p>", level: "pleno" },
    { q: "Por que usar RDS Proxy com Lambda?", a: "<p>Lambda escala horizontalmente — 100 invocações simultâneas = 100 conexões abertas no RDS. Bancos relacionais têm custo alto por conexão (memória, processos). RDS Proxy mantém um pool de conexões com o banco e multiplexa centenas de clientes Lambda em poucas conexões reais.</p><p>Benefício adicional: RDS Proxy suporta failover mais rápido (< 30 s vs 60 s), pois mantém a conexão e redireciona transparentemente em failover Multi-AZ.</p>", level: "pleno" },
    { q: "Como funcionam backups e PITR no RDS?", a: "<p>Automated backup: RDS tira snapshot diário (janela de manutenção) e armazena transaction logs continuamente. Isso permite PITR — restaurar para qualquer segundo dentro do período de retenção (1–35 dias).</p><p>Snapshot manual: criado sob demanda, retido até deletar explicitamente. Útil antes de migrações arriscadas.</p><p>Importante: restaurar cria uma <em>nova instância</em> com novo endpoint — não é restore in-place. Planeje atualização de connection strings e DNS.</p>", level: "senior" },
    { q: "Como diagnosticaria uma query lenta em produção no RDS PostgreSQL?", a: "<p>1. <strong>Performance Insights:</strong> identifica a query pelo tempo de espera — CPU, I/O, lock. Obtém o SQL top-N por carga.</p><p>2. <strong>pg_stat_statements:</strong> extensão que agrega estatísticas de execução por query (calls, mean_exec_time, rows, shared_blk_hit). Identifica queries com alto total_exec_time.</p><p>3. <strong>EXPLAIN (ANALYZE, BUFFERS):</strong> roda em staging com dados reais. Identifica Seq Scan em tabela grande (falta de índice), Nested Loop com estimativa errada de rows, bitmap heap scan ineficiente.</p><p>4. <strong>Ação:</strong> índice faltante, reescrita da query, VACUUM/ANALYZE, ou ajuste de parâmetros (work_mem, effective_cache_size).</p>", level: "senior" },
    { q: "O que é Aurora Global Database e quando usar?", a: "<p>Aurora Global Database replica de uma região primária para até 5 regiões secundárias com lag típico < 1 s (replicação de storage, não de redo logs). Leituras servidas localmente em cada região secundária.</p><p>Use quando: aplicação global com usuários em múltiplas regiões que precisam de leituras de baixa latência; DR com RPO < 1 s e RTO < 1 min (failover regional controlado); compliance de residência de dados com leituras locais mas escrita centralizada.</p><p>Diferente de Cross-Region Read Replica do RDS padrão: Global Database tem lag menor e failover regional mais rápido.</p>", level: "senior" },
  ],
  resources: [
    { title: "AWS RDS docs", url: "https://docs.aws.amazon.com/rds/", kind: "docs" },
    { title: "AWS Aurora docs", url: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/", kind: "docs" },
    { title: "RDS Proxy docs", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html", kind: "docs" },
  ],
}

export default rds
