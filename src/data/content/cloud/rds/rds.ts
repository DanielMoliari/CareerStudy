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
    { title: "Storage — gp3 vs io2", body: "gp3: uso geral, até 16.000 IOPS e 1.000 MB/s de throughput, configuráveis independentemente do tamanho. io2 Block Express: até 256.000 IOPS, para workloads OLTP intensivos. Autoscaling de storage disponível em ambos (nunca diminui automaticamente)." },
    { title: "Parameter Groups e Option Groups", body: "Parameter Group: configuração do engine (max_connections, work_mem, innodb_buffer_pool_size). Alterações em parâmetros estáticos exigem reboot; dinâmicos aplicam sem reiniciar. Option Group: features adicionais do engine (Oracle Enterprise, MySQL memcached). RDS PostgreSQL não usa Option Groups." },
  ],
  diagrams: [
    {
      title: "Multi-AZ vs Read Replica — diferença de propósito",
      html: `<style>
.rds-mv{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.rds-mv-cols{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:12px}
.rds-mv-card{background:#1e293b;border-radius:8px;padding:13px}
.rds-mv-h{font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:9px;padding-bottom:6px;border-bottom:1px solid #334155}
.rds-mv-row{display:flex;gap:8px;margin:5px 0;align-items:flex-start}
.rds-mv-dot{width:7px;height:7px;border-radius:50%;margin-top:3px;flex-shrink:0}
.rds-mv-text{color:#94a3b8}
.rds-mv-arc{background:#0f172a;border-radius:8px;padding:10px 13px;margin-top:10px}
.rds-mv-arc-title{font-weight:700;font-size:10px;color:#64748b;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em}
</style>
<div class="rds-mv">
<div class="rds-mv-cols">
  <div class="rds-mv-card" style="border-top:2px solid #3b82f6">
    <div class="rds-mv-h" style="color:#60a5fa">Multi-AZ — Alta Disponibilidade</div>
    <div class="rds-mv-row"><div class="rds-mv-dot" style="background:#3b82f6"></div><div class="rds-mv-text">Replicação <strong style="color:#e2e8f0">síncrona</strong> — cada escrita confirmada em ambas as AZs</div></div>
    <div class="rds-mv-row"><div class="rds-mv-dot" style="background:#3b82f6"></div><div class="rds-mv-text">Standby <strong style="color:#ef4444">não serve leituras</strong> — existe apenas para failover</div></div>
    <div class="rds-mv-row"><div class="rds-mv-dot" style="background:#3b82f6"></div><div class="rds-mv-text">Failover automático: DNS aponta para standby em 30–60 s</div></div>
    <div class="rds-mv-row"><div class="rds-mv-dot" style="background:#3b82f6"></div><div class="rds-mv-text">Objetivo: <strong style="color:#e2e8f0">HA — tolerância a falha de AZ</strong></div></div>
    <div class="rds-mv-row"><div class="rds-mv-dot" style="background:#3b82f6"></div><div class="rds-mv-text">Custo: ~2× a instância primária</div></div>
    <div class="rds-mv-arc">
      <div class="rds-mv-arc-title">Quando usar</div>
      <div style="color:#94a3b8">Sempre em produção. SLA de uptime exige failover automático para sobreviver a falha de AZ.</div>
    </div>
  </div>
  <div class="rds-mv-card" style="border-top:2px solid #10b981">
    <div class="rds-mv-h" style="color:#34d399">Read Replica — Escala de Leitura</div>
    <div class="rds-mv-row"><div class="rds-mv-dot" style="background:#10b981"></div><div class="rds-mv-text">Replicação <strong style="color:#e2e8f0">assíncrona</strong> — pode ter replication lag</div></div>
    <div class="rds-mv-row"><div class="rds-mv-dot" style="background:#10b981"></div><div class="rds-mv-text"><strong style="color:#e2e8f0">Serve leituras</strong> — endpoint próprio para SELECT</div></div>
    <div class="rds-mv-row"><div class="rds-mv-dot" style="background:#10b981"></div><div class="rds-mv-text">Pode ser promovida a primary (manual, com downtime)</div></div>
    <div class="rds-mv-row"><div class="rds-mv-dot" style="background:#10b981"></div><div class="rds-mv-text">Objetivo: <strong style="color:#e2e8f0">escala de leitura e DR cross-region</strong></div></div>
    <div class="rds-mv-row"><div class="rds-mv-dot" style="background:#10b981"></div><div class="rds-mv-text">RDS: até 5 réplicas | Aurora: até 15 com lag &lt; 100 ms</div></div>
    <div class="rds-mv-arc">
      <div class="rds-mv-arc-title">Quando usar</div>
      <div style="color:#94a3b8">Workloads com alto volume de leitura (relatórios, dashboards, analytics). Cross-region para DR ou latência de usuários remotos.</div>
    </div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:10px 14px;font-size:11px;color:#94a3b8">
  <strong style="color:#e2e8f0">Em produção:</strong> use os dois juntos. Multi-AZ garante HA do primary. Read Replicas distribuem carga de SELECT. São complementares, não alternativos.
</div>
</div>`,
      caption: "Multi-AZ = HA (não lê do standby). Read Replica = escala de leitura (pode ter lag). Propósitos distintos, devem coexistir em produção.",
    },
    {
      title: "Aurora — arquitetura de storage distribuído",
      html: `<style>
.rds-aur{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.rds-aur-row{display:flex;gap:10px;margin-bottom:10px;align-items:stretch}
.rds-aur-box{background:#1e293b;border-radius:8px;padding:11px;flex:1}
.rds-aur-h{font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:7px}
.rds-aur-az{display:flex;gap:6px;margin-bottom:8px}
.rds-aur-azbox{border-radius:6px;padding:7px 10px;font-size:10px;flex:1;text-align:center}
.rds-aur-seg{background:#1e40af;border-radius:4px;padding:2px 5px;font-size:9px;color:#93c5fd;display:inline-block;margin:1px}
.rds-aur-stat{display:flex;justify-content:space-between;margin:3px 0;font-size:10px}
.rds-aur-k{color:#64748b}
.rds-aur-v{color:#e2e8f0;font-weight:600}
</style>
<div class="rds-aur">
<div class="rds-aur-row">
  <div class="rds-aur-box" style="border-top:2px solid #7c3aed">
    <div class="rds-aur-h" style="color:#a78bfa">Storage distribuído (6 cópias em 3 AZs)</div>
    <div class="rds-aur-az">
      <div class="rds-aur-azbox" style="background:#1e1b4b;border:1px solid #3730a3;color:#a5b4fc">
        AZ-a<br/>
        <span class="rds-aur-seg">seg 1</span><span class="rds-aur-seg">seg 4</span>
      </div>
      <div class="rds-aur-azbox" style="background:#1e1b4b;border:1px solid #3730a3;color:#a5b4fc">
        AZ-b<br/>
        <span class="rds-aur-seg">seg 2</span><span class="rds-aur-seg">seg 5</span>
      </div>
      <div class="rds-aur-azbox" style="background:#1e1b4b;border:1px solid #3730a3;color:#a5b4fc">
        AZ-c<br/>
        <span class="rds-aur-seg">seg 3</span><span class="rds-aur-seg">seg 6</span>
      </div>
    </div>
    <div style="color:#94a3b8;font-size:10px">Quorum de escrita: 4/6 confirmados. Quorum de leitura: 3/6. Tolera: 1 AZ + 1 nó adicionais sem perda de dados, 2 AZs sem perda de disponibilidade de leitura.</div>
  </div>
  <div class="rds-aur-box" style="border-top:2px solid #10b981">
    <div class="rds-aur-h" style="color:#34d399">Aurora vs RDS Standard</div>
    <div class="rds-aur-stat"><span class="rds-aur-k">Failover</span><span class="rds-aur-v">Aurora &lt; 30 s | RDS 60 s</span></div>
    <div class="rds-aur-stat"><span class="rds-aur-k">Read Replicas</span><span class="rds-aur-v">Aurora 15 | RDS 5</span></div>
    <div class="rds-aur-stat"><span class="rds-aur-k">Replica lag</span><span class="rds-aur-v">Aurora &lt; 100 ms | RDS segundos</span></div>
    <div class="rds-aur-stat"><span class="rds-aur-k">Storage max</span><span class="rds-aur-v">Aurora 128 TiB | RDS 64 TiB</span></div>
    <div class="rds-aur-stat"><span class="rds-aur-k">Serverless</span><span class="rds-aur-v">Aurora v2 ✓ | RDS ✗</span></div>
    <div class="rds-aur-stat"><span class="rds-aur-k">Global DB</span><span class="rds-aur-v">Aurora ✓ | RDS cross-region replica</span></div>
    <div class="rds-aur-stat"><span class="rds-aur-k">Custo base</span><span class="rds-aur-v">Aurora ~20% maior</span></div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:10px 14px;font-size:11px;color:#94a3b8">
  <strong style="color:#e2e8f0">Aurora Serverless v2:</strong> escala de 0,5 a 128 ACUs (Aurora Capacity Units) em incrementos finos, sem downtime. Ideal para workloads imprevisíveis. Custo por ACU-hora — eficiente para desenvolvimento e ambientes com baixo tráfego noturno.
</div>
</div>`,
      caption: "Aurora distribui storage em 6 segmentos em 3 AZs. O storage cresce automaticamente em incrementos de 10 GiB — você nunca provisiona storage manualmente.",
    },
    {
      title: "RDS Proxy — connection pooling para Lambda",
      html: `<style>
.rds-prx{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.rds-prx-cols{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin-bottom:12px}
.rds-prx-side{background:#1e293b;border-radius:8px;padding:11px}
.rds-prx-center{background:#4c1d95;border-radius:8px;padding:11px;text-align:center;min-width:110px}
.rds-prx-h{font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px}
.rds-prx-fn{background:#0f172a;border-radius:5px;padding:4px 8px;font-size:9.5px;color:#93c5fd;margin:2px 0;font-family:'JetBrains Mono',monospace}
.rds-prx-arrow{text-align:center;color:#475569;font-size:20px}
.rds-prx-conn{display:flex;align-items:center;gap:6px;margin:4px 0}
.rds-prx-badge{background:#4c1d95;color:#c4b5fd;border-radius:4px;padding:1px 6px;font-size:9px;font-weight:700}
.rds-prx-rds{border-radius:6px;padding:6px 10px;font-size:10px;margin:4px 0}
</style>
<div class="rds-prx">
<div style="font-size:10px;color:#64748b;margin-bottom:12px">Sem Proxy: 200 Lambdas simultâneas = 200 conexões no banco (max_connections saturado). Com Proxy: 200 Lambdas → pool de 10–20 conexões reais.</div>
<div class="rds-prx-cols">
  <div class="rds-prx-side">
    <div class="rds-prx-h" style="color:#60a5fa">Lambda Functions (200 simultâneas)</div>
    <div class="rds-prx-fn">fn-handler-1</div>
    <div class="rds-prx-fn">fn-handler-2</div>
    <div class="rds-prx-fn">fn-handler-3</div>
    <div style="color:#475569;font-size:10px;margin-top:4px">... 197 mais</div>
  </div>
  <div>
    <div class="rds-prx-arrow">→</div>
    <div class="rds-prx-center">
      <div style="color:#a78bfa;font-weight:700;font-size:10px;text-transform:uppercase;margin-bottom:6px">RDS Proxy</div>
      <div style="color:#c4b5fd;font-size:9.5px">Pool: 10–20 conexões</div>
      <div style="color:#7c3aed;font-size:9px;margin-top:4px">Secrets Manager integrado</div>
    </div>
    <div class="rds-prx-arrow">→</div>
  </div>
  <div class="rds-prx-side">
    <div class="rds-prx-h" style="color:#34d399">RDS / Aurora (primary)</div>
    <div class="rds-prx-rds" style="background:#064e3b;color:#6ee7b7">Conexão 1 (ativa)</div>
    <div class="rds-prx-rds" style="background:#064e3b;color:#6ee7b7">Conexão 2 (ativa)</div>
    <div class="rds-prx-rds" style="background:#1e293b;color:#475569">Conexão 3 (idle pool)</div>
    <div style="color:#475569;font-size:9px;margin-top:4px">max_connections preservado</div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:10px 14px;font-size:11px;color:#94a3b8">
  <strong style="color:#e2e8f0">Bônus do Proxy:</strong> failover Multi-AZ mais rápido para clientes — o Proxy mantém a conexão e redireciona transparentemente para o novo primary. Aplicação não recebe o reset de TCP.
</div>
</div>`,
      caption: "RDS Proxy multiplexa centenas de conexões Lambda em poucas conexões reais ao banco. Indispensável quando Lambda + RDS, pois cada invocação Lambda abre uma conexão nova.",
    },
    {
      title: "Backup, Snapshot e PITR — estratégia de recuperação",
      html: `<style>
.rds-bk{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.rds-bk-timeline{position:relative;padding:10px 0;margin-bottom:14px}
.rds-bk-line{height:2px;background:#1e293b;margin:0 10px;position:relative}
.rds-bk-marks{display:flex;justify-content:space-between;margin-top:-1px;padding:0 10px}
.rds-bk-mark{display:flex;flex-direction:column;align-items:center;gap:4px}
.rds-bk-dot{width:10px;height:10px;border-radius:50%;margin-top:-4px}
.rds-bk-label{font-size:9px;color:#64748b;text-align:center}
.rds-bk-cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.rds-bk-card{background:#1e293b;border-radius:8px;padding:10px}
.rds-bk-h{font-weight:700;font-size:9.5px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:7px}
.rds-bk-item{color:#94a3b8;margin:3px 0;font-size:10px}
.rds-bk-item strong{color:#e2e8f0}
</style>
<div class="rds-bk">
<div class="rds-bk-timeline">
  <div class="rds-bk-line"></div>
  <div class="rds-bk-marks">
    <div class="rds-bk-mark">
      <div class="rds-bk-dot" style="background:#3b82f6"></div>
      <div class="rds-bk-label">Snapshot<br/>manual</div>
    </div>
    <div class="rds-bk-mark">
      <div class="rds-bk-dot" style="background:#10b981"></div>
      <div class="rds-bk-label">Automated<br/>backup diário</div>
    </div>
    <div class="rds-bk-mark">
      <div class="rds-bk-dot" style="background:#f59e0b"></div>
      <div class="rds-bk-label">Transaction<br/>logs contínuos</div>
    </div>
    <div class="rds-bk-mark">
      <div class="rds-bk-dot" style="background:#ef4444"></div>
      <div class="rds-bk-label">Incidente<br/>agora</div>
    </div>
    <div class="rds-bk-mark">
      <div class="rds-bk-dot" style="background:#a78bfa"></div>
      <div class="rds-bk-label">PITR:<br/>qualquer segundo</div>
    </div>
  </div>
</div>
<div class="rds-bk-cols">
  <div class="rds-bk-card" style="border-top:2px solid #3b82f6">
    <div class="rds-bk-h" style="color:#60a5fa">Snapshot Manual</div>
    <div class="rds-bk-item"><strong>Retenção:</strong> indefinida (até deletar)</div>
    <div class="rds-bk-item"><strong>Trigger:</strong> manual ou via CLI/SDK</div>
    <div class="rds-bk-item"><strong>Uso:</strong> antes de migração de schema, upgrade de engine</div>
    <div class="rds-bk-item"><strong>Restore:</strong> nova instância, novo endpoint</div>
    <div class="rds-bk-item"><strong>Cross-region:</strong> copiar snapshot para outra região para DR</div>
  </div>
  <div class="rds-bk-card" style="border-top:2px solid #10b981">
    <div class="rds-bk-h" style="color:#34d399">Automated Backup</div>
    <div class="rds-bk-item"><strong>Retenção:</strong> 1–35 dias</div>
    <div class="rds-bk-item"><strong>Janela:</strong> configurável (madrugada)</div>
    <div class="rds-bk-item"><strong>Habilita:</strong> PITR (pré-requisito)</div>
    <div class="rds-bk-item"><strong>Armazenamento:</strong> S3 gerenciado pela AWS</div>
    <div class="rds-bk-item"><strong>Custo:</strong> storage gratuito até tamanho da DB</div>
  </div>
  <div class="rds-bk-card" style="border-top:2px solid #a78bfa">
    <div class="rds-bk-h" style="color:#c4b5fd">PITR</div>
    <div class="rds-bk-item"><strong>Granularidade:</strong> qualquer segundo</div>
    <div class="rds-bk-item"><strong>Alcance:</strong> últimos N dias (retenção configurada)</div>
    <div class="rds-bk-item"><strong>Como:</strong> snapshot + transaction logs</div>
    <div class="rds-bk-item"><strong>Restore:</strong> nova instância (não in-place)</div>
    <div class="rds-bk-item"><strong>Uso:</strong> recuperação de delete acidental, corrupção</div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:9px 13px;margin-top:10px;font-size:11px;color:#94a3b8">
  <strong style="color:#ef4444">Atenção:</strong> restaurar qualquer backup (snapshot ou PITR) cria uma <em>nova instância RDS com novo endpoint</em>. Planeje atualização de DNS (Route 53 CNAME) ou connection strings da aplicação.
</div>
</div>`,
      caption: "Automated backup habilita PITR (qualquer segundo). Snapshot manual tem retenção indefinida. Ambos criam nova instância ao restaurar — nunca restore in-place.",
    },
  ],
  mnemonics: [
    {
      label: "MARS — componentes de HA do RDS",
      trick: "M-A-R-S: Multi-AZ (sincrono), Automated backup, Read Replica (assincrono), Snapshot manual",
      explanation: "Multi-AZ é síncrono e para HA. Automated backup habilita PITR. Read Replica é assíncrona e para escala de leitura. Snapshot é manual e retido indefinidamente. Os quatro são complementares e cobrem diferentes cenários de resiliência.",
    },
    {
      label: "PITR = Pizza In The Room (qualquer momento)",
      trick: "PITR = 'Para a qualquer Instante, restaure o banco'. Pizza pode ser requentada a qualquer hora — assim como PITR restaura para qualquer segundo.",
      explanation: "Point-in-time recovery usa automated backup (snapshot diário) + transaction logs contínuos para reconstruir o estado do banco em qualquer segundo dentro do período de retenção. Indispensável para recuperar deletes acidentais ou corrupção de dados.",
    },
    {
      label: "Proxy = Garçom de conexões",
      trick: "RDS Proxy é o garçom: 200 clientes (Lambda) fazem pedidos, mas só 10 garçons (conexões reais) vão à cozinha (banco).",
      explanation: "Sem proxy, cada invocação Lambda abre e fecha conexão diretamente no banco — com 200 simultâneas, o max_connections satura. O Proxy mantém um pool de conexões persistentes e as reutiliza entre invocações, reduzindo a carga de conexão no banco.",
    },
    {
      label: "Aurora 4/6 — escreve quando 4 de 6 confirmam",
      trick: "Aurora nunca perde dados se perder 1 AZ inteira + 1 nó extra. Quorum: 4 confirmam = escrita confirmada. 3 confirmam = leitura possível.",
      explanation: "Aurora distribui 6 segmentos de storage em 3 AZs (2 por AZ). Escreve quando 4/6 segmentos confirmam — garante durabilidade mesmo perdendo 2 segmentos. Lê quando 3/6 confirmam — funciona mesmo perdendo 3 segmentos (inclui perda de 1 AZ completa).",
    },
    {
      label: "gp3 = 'Grátis Por 3' variáveis",
      trick: "gp3: configure IOPS, throughput e tamanho de forma independente — 3 dimensões separadas. gp2 amarrava IOPS ao tamanho.",
      explanation: "gp3 é a evolução do gp2: você especifica IOPS (até 16.000) e throughput (até 1.000 MB/s) independentemente do tamanho do volume. gp2 forçava provisionar storage maior só para ter mais IOPS. gp3 é mais barato e mais flexível — padrão recomendado para novos bancos.",
    },
  ],
  cheatsheet: {
    title: "RDS — Cheatsheet de referência rápida",
    html: `<style>
.rds-cs{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.rds-cs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
.rds-cs-card{background:#1e293b;border-radius:8px;padding:11px}
.rds-cs-h{font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:7px;padding-bottom:5px;border-bottom:1px solid #334155}
.rds-cs-row{display:flex;justify-content:space-between;align-items:baseline;margin:4px 0;gap:8px}
.rds-cs-k{color:#94a3b8;flex-shrink:0}
.rds-cs-v{color:#e2e8f0;font-weight:600;text-align:right;font-size:10px}
.rds-cs-code{background:#0f172a;border-radius:6px;padding:8px 10px;font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#7dd3fc;margin-top:8px;line-height:1.65}
</style>
<div class="rds-cs">
<div class="rds-cs-grid">
  <div class="rds-cs-card">
    <div class="rds-cs-h" style="color:#60a5fa">Multi-AZ vs Read Replica</div>
    <div class="rds-cs-row"><span class="rds-cs-k">Multi-AZ replicação</span><span class="rds-cs-v">Síncrona</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Read Replica replicação</span><span class="rds-cs-v">Assíncrona</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Standby serve leituras</span><span class="rds-cs-v" style="color:#ef4444">Não</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Replica serve leituras</span><span class="rds-cs-v" style="color:#4ade80">Sim</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Failover Multi-AZ</span><span class="rds-cs-v">30–60 s automático</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Promoção Replica</span><span class="rds-cs-v">Manual, com downtime</span></div>
  </div>
  <div class="rds-cs-card">
    <div class="rds-cs-h" style="color:#34d399">Aurora vs RDS Padrão</div>
    <div class="rds-cs-row"><span class="rds-cs-k">Max Read Replicas</span><span class="rds-cs-v">Aurora 15 | RDS 5</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Replica lag</span><span class="rds-cs-v">Aurora &lt;100ms | RDS s</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Failover</span><span class="rds-cs-v">Aurora &lt;30s | RDS 60s</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Max storage</span><span class="rds-cs-v">Aurora 128TiB | RDS 64TiB</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Serverless</span><span class="rds-cs-v">Aurora v2 ✓</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Global DB</span><span class="rds-cs-v">Aurora Global ✓</span></div>
  </div>
  <div class="rds-cs-card">
    <div class="rds-cs-h" style="color:#fb923c">Backup e Retenção</div>
    <div class="rds-cs-row"><span class="rds-cs-k">Automated backup</span><span class="rds-cs-v">1–35 dias</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Snapshot manual</span><span class="rds-cs-v">Indefinido</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">PITR granularidade</span><span class="rds-cs-v">Qualquer segundo</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Restore cria</span><span class="rds-cs-v">Nova instância</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Cross-region backup</span><span class="rds-cs-v">Copiar snapshot</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Blue/Green deploy</span><span class="rds-cs-v">Zero-downtime upgrade</span></div>
  </div>
  <div class="rds-cs-card">
    <div class="rds-cs-h" style="color:#a78bfa">Storage e Performance</div>
    <div class="rds-cs-row"><span class="rds-cs-k">gp3 max IOPS</span><span class="rds-cs-v">16.000</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">io2 max IOPS</span><span class="rds-cs-v">256.000 (Block Express)</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Performance Insights</span><span class="rds-cs-v">Grátis 7 dias</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Enhanced Monitoring</span><span class="rds-cs-v">1–60 s granularidade</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">Storage autoscaling</span><span class="rds-cs-v">Só cresce, nunca diminui</span></div>
    <div class="rds-cs-row"><span class="rds-cs-k">RDS Proxy overhead</span><span class="rds-cs-v">~1 ms de latência</span></div>
  </div>
</div>
<div class="rds-cs-code">
# Performance Insights top queries via CLI<br/>
aws pi get-resource-metrics \\<br/>
  --service-type RDS --identifier db-XXXX \\<br/>
  --metric-queries '[{"Metric":"db.load.avg","GroupBy":{"Group":"db.sql"}}]' \\<br/>
  --start-time $(date -d '1 hour ago' +%s) --end-time $(date +%s) --period-in-seconds 60
</div>
</div>`,
    caption: "Referência rápida dos principais parâmetros RDS: comparações Multi-AZ vs Replica, Aurora vs Standard, tipos de backup e limites de storage/performance.",
  },
  mindmap: {
    title: "RDS — Mapa mental de conceitos",
    html: `<style>
.rds-mm{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.rds-mm-center{background:#ef4444;color:#fff;border-radius:10px;padding:8px 18px;font-weight:700;font-size:13px;text-align:center;display:inline-block;margin-bottom:16px}
.rds-mm-branches{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.rds-mm-branch{background:#1e293b;border-radius:8px;padding:11px}
.rds-mm-bh{font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:7px}
.rds-mm-leaf{color:#94a3b8;margin:3px 0;padding-left:8px;border-left:2px solid #334155;font-size:10px}
.rds-mm-leaf strong{color:#e2e8f0}
</style>
<div class="rds-mm">
<div style="text-align:center"><div class="rds-mm-center">Amazon RDS</div></div>
<div class="rds-mm-branches">
  <div class="rds-mm-branch">
    <div class="rds-mm-bh" style="color:#60a5fa">Engines</div>
    <div class="rds-mm-leaf"><strong>PostgreSQL</strong> — open source, extensões</div>
    <div class="rds-mm-leaf"><strong>MySQL</strong> — amplamente compatível</div>
    <div class="rds-mm-leaf"><strong>MariaDB</strong> — fork MySQL</div>
    <div class="rds-mm-leaf"><strong>Oracle</strong> — licença bring-your-own</div>
    <div class="rds-mm-leaf"><strong>SQL Server</strong> — licença AWS inclusa</div>
    <div class="rds-mm-leaf"><strong>Aurora</strong> — MySQL/PostgreSQL compat.</div>
  </div>
  <div class="rds-mm-branch">
    <div class="rds-mm-bh" style="color:#34d399">Alta Disponibilidade</div>
    <div class="rds-mm-leaf"><strong>Multi-AZ</strong> — standby síncrono</div>
    <div class="rds-mm-leaf"><strong>Read Replica</strong> — leitura assíncrona</div>
    <div class="rds-mm-leaf"><strong>Aurora Global</strong> — multi-região</div>
    <div class="rds-mm-leaf"><strong>Failover</strong> — DNS automático</div>
    <div class="rds-mm-leaf"><strong>RDS Proxy</strong> — absorve failover</div>
  </div>
  <div class="rds-mm-branch">
    <div class="rds-mm-bh" style="color:#f59e0b">Backup e DR</div>
    <div class="rds-mm-leaf"><strong>Automated backup</strong> — 1–35 dias</div>
    <div class="rds-mm-leaf"><strong>Snapshot manual</strong> — retido forever</div>
    <div class="rds-mm-leaf"><strong>PITR</strong> — qualquer segundo</div>
    <div class="rds-mm-leaf"><strong>Cross-region copy</strong> — snapshot DR</div>
    <div class="rds-mm-leaf"><strong>Blue/green</strong> — upgrade sem downtime</div>
  </div>
  <div class="rds-mm-branch">
    <div class="rds-mm-bh" style="color:#a78bfa">Performance</div>
    <div class="rds-mm-leaf"><strong>Performance Insights</strong> — load por wait</div>
    <div class="rds-mm-leaf"><strong>Enhanced Monitoring</strong> — OS metrics</div>
    <div class="rds-mm-leaf"><strong>pg_stat_statements</strong> — PostgreSQL</div>
    <div class="rds-mm-leaf"><strong>EXPLAIN ANALYZE</strong> — plano de query</div>
    <div class="rds-mm-leaf"><strong>Parameter Group</strong> — tuning engine</div>
  </div>
  <div class="rds-mm-branch">
    <div class="rds-mm-bh" style="color:#fb923c">Storage</div>
    <div class="rds-mm-leaf"><strong>gp3</strong> — uso geral, 16k IOPS</div>
    <div class="rds-mm-leaf"><strong>io2</strong> — OLTP intensivo, 256k IOPS</div>
    <div class="rds-mm-leaf"><strong>Autoscaling</strong> — só cresce</div>
    <div class="rds-mm-leaf"><strong>Criptografia</strong> — KMS, definida no create</div>
    <div class="rds-mm-leaf"><strong>Aurora I/O Opt.</strong> — preço fixo por storage</div>
  </div>
  <div class="rds-mm-branch">
    <div class="rds-mm-bh" style="color:#f87171">Segurança</div>
    <div class="rds-mm-leaf"><strong>VPC</strong> — banco não é público</div>
    <div class="rds-mm-leaf"><strong>Security Group</strong> — porta 5432/3306</div>
    <div class="rds-mm-leaf"><strong>IAM auth</strong> — token em vez de senha</div>
    <div class="rds-mm-leaf"><strong>SSL/TLS</strong> — in-transit obrigatório</div>
    <div class="rds-mm-leaf"><strong>Secrets Manager</strong> — rotação automática</div>
  </div>
</div>
</div>`,
    caption: "Visão panorâmica do RDS: engines, alta disponibilidade, backup/DR, performance, storage e segurança.",
  },
  codeExamples: [
    {
      title: "Criar instância RDS PostgreSQL com Multi-AZ via Terraform",
      language: "hcl",
      code: `resource "aws_db_instance" "main" {
  identifier        = "myapp-postgres"
  engine            = "postgres"
  engine_version    = "16.2"
  instance_class    = "db.t3.medium"
  allocated_storage = 100
  storage_type      = "gp3"
  storage_encrypted = true
  kms_key_id        = aws_kms_key.rds.arn

  # HA
  multi_az               = true
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  # Backup / PITR
  backup_retention_period = 14
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"
  copy_tags_to_snapshot   = true
  deletion_protection     = true

  # Performance
  performance_insights_enabled          = true
  performance_insights_retention_period = 7
  enabled_cloudwatch_logs_exports       = ["postgresql", "upgrade"]

  # Credenciais via Secrets Manager
  manage_master_user_password = true

  tags = { Environment = "production" }
}`,
    },
    {
      title: "Diagnosticar queries lentas com pg_stat_statements",
      language: "sql",
      code: `-- Habilitar extensão (uma vez, como superuser)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Top 10 queries por tempo total acumulado
SELECT
  query,
  calls,
  round(total_exec_time::numeric, 2)    AS total_ms,
  round(mean_exec_time::numeric, 2)     AS mean_ms,
  round(stddev_exec_time::numeric, 2)   AS stddev_ms,
  rows,
  round((shared_blks_hit::numeric /
    NULLIF(shared_blks_hit + shared_blks_read, 0)) * 100, 2) AS cache_hit_pct
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- EXPLAIN ANALYZE da query suspeita (em staging, com dados reais)
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.*, o.total
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.created_at > NOW() - INTERVAL '30 days'
ORDER BY o.total DESC
LIMIT 100;
-- Procurar: Seq Scan em tabela grande, Nested Loop com rows >> estimado`,
    },
    {
      title: "Configurar RDS Proxy para Lambda com Secrets Manager",
      language: "hcl",
      code: `resource "aws_db_proxy" "main" {
  name                   = "myapp-proxy"
  debug_logging          = false
  engine_family          = "POSTGRESQL"
  idle_client_timeout    = 1800
  require_tls            = true
  role_arn               = aws_iam_role.rds_proxy.arn
  vpc_security_group_ids = [aws_security_group.rds_proxy.id]
  vpc_subnet_ids         = aws_db_subnet_group.main.subnet_ids

  auth {
    auth_scheme = "SECRETS"
    description = "RDS master credentials"
    iam_auth    = "DISABLED"
    secret_arn  = aws_secretsmanager_secret.rds_password.arn
  }
}

resource "aws_db_proxy_default_target_group" "main" {
  db_proxy_name = aws_db_proxy.main.name

  connection_pool_config {
    connection_borrow_timeout    = 120
    max_connections_percent      = 100
    max_idle_connections_percent = 50
  }
}

resource "aws_db_proxy_target" "main" {
  db_instance_identifier = aws_db_instance.main.id
  db_proxy_name          = aws_db_proxy.main.name
  target_group_name      = aws_db_proxy_default_target_group.main.name
}`,
    },
    {
      title: "Blue/Green Deployment para upgrade de engine sem downtime",
      language: "bash",
      code: `# Criar ambiente Green (cópia da produção Blue)
aws rds create-blue-green-deployment \\
  --blue-green-deployment-name myapp-upgrade \\
  --source arn:aws:rds:us-east-1:123456789:db:myapp-postgres \\
  --target-engine-version 16.3 \\
  --target-db-parameter-group-name postgres16-prod

# Aguardar Green ficar disponível e replicando
aws rds describe-blue-green-deployments \\
  --filters Name=blue-green-deployment-name,Values=myapp-upgrade \\
  --query 'BlueGreenDeployments[0].Status'
# Aguardar: AVAILABLE

# Executar switchover (downtime < 1 min — apenas flush de conexões)
aws rds switchover-blue-green-deployment \\
  --blue-green-deployment-identifier bgd-abc123 \\
  --switchover-timeout 300

# Verificar que Green virou produção
aws rds describe-db-instances \\
  --db-instance-identifier myapp-postgres \\
  --query 'DBInstances[0].EngineVersion'

# Após validação, deletar ambiente Blue
aws rds delete-blue-green-deployment \\
  --blue-green-deployment-identifier bgd-abc123 \\
  --delete-target`,
    },
    {
      title: "Aurora Serverless v2 com autoscaling de ACUs",
      language: "hcl",
      code: `resource "aws_rds_cluster" "serverless" {
  cluster_identifier      = "myapp-aurora-serverless"
  engine                  = "aurora-postgresql"
  engine_mode             = "provisioned"  # v2 usa "provisioned" com scaling config
  engine_version          = "16.2"
  database_name           = "myapp"
  master_username         = "admin"
  manage_master_user_password = true

  serverlessv2_scaling_configuration {
    min_capacity = 0.5   # ACUs — 0,5 ACU = ~1GB RAM
    max_capacity = 32    # ACUs — escala conforme demand
  }

  backup_retention_period = 14
  storage_encrypted       = true
  deletion_protection     = true
}

resource "aws_rds_cluster_instance" "serverless_writer" {
  cluster_identifier = aws_rds_cluster.serverless.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.serverless.engine
  engine_version     = aws_rds_cluster.serverless.engine_version
}`,
    },
  ],
  gotchas: [
    "Multi-AZ não serve leituras do standby — use Read Replicas para escala de leitura. São propósitos distintos.",
    "Escalabilidade vertical requer breve downtime (1–2 min) — planeje janela de manutenção ou use Aurora (scaling mais suave).",
    "max_connections padrão baixo — em instâncias menores, saturado rapidamente. Configure no Parameter Group e use RDS Proxy para connection pooling.",
    "Snapshot criptografado não restaura em instância sem criptografia — e vice-versa. Defina criptografia desde o início.",
    "Aurora I/O-Optimized vs Standard — I/O-Optimized paga preço fixo por storage sem cobrança por I/O. Melhor a partir de ~25% de I/O no custo total. Calcule antes de migrar.",
    "Read Replica de RDS standard tem replication lag — para leituras críticas onde consistência importa, leia da primária.",
    "Storage autoscaling só cresce — se provisionar demais (pico temporário), você paga o storage maior para sempre até criar nova instância menor.",
    "Parameter Group estático exige reboot — alterar work_mem (dinâmico) é safe, alterar shared_buffers (estático) reinicia o banco. Verifique apply_type antes de aplicar em produção.",
    "Blue/green deployment não suporta todas as engines — Oracle e SQL Server não têm suporte. Verifique antes de depender do recurso para upgrades críticos.",
  ],
  interview: [
    {
      q: "Diferença entre Multi-AZ e Read Replica?",
      a: "<p><strong>Multi-AZ:</strong> réplica síncrona em outra AZ, failover automático, standby <em>não</em> serve leituras. Objetivo: alta disponibilidade (HA).</p><p><strong>Read Replica:</strong> réplica assíncrona, serve leituras, pode ter replication lag. Objetivo: escala de leitura e DR.</p><p>Em produção: use os dois juntos — Multi-AZ para HA do primary, Read Replicas para distribuir carga de leitura.</p>",
      tip: "A confusão mais comum é assumir que Multi-AZ escala leitura. O standby sequer tem endpoint público. Lembre: Multi-AZ = HA, Read Replica = read scale.",
      level: "pleno",
    },
    {
      q: "Quando usar Aurora em vez de RDS PostgreSQL padrão?",
      a: "<p><strong>Use Aurora quando:</strong> precisa de alta escala de leitura (até 15 réplicas com lag &lt; 100 ms), failover mais rápido (&lt; 30 s vs 60 s), Aurora Serverless para workload variável, ou a performance 3–5× do storage distribuído compensa o custo.</p><p><strong>Use RDS PostgreSQL padrão quando:</strong> precisa de compatibilidade total (Aurora tem pequenas diferenças de comportamento), usa extensões que Aurora não suporta (pglogical, algumas de terceiros), ou o workload é pequeno e o custo de Aurora não se justifica.</p>",
      tip: "Aurora custa ~20% a mais por instância. Mas com storage distribuído e réplicas muito mais rápidas, o custo total pode ser menor em produção com alto tráfego de leitura. A decisão é de custo × SLA.",
      level: "pleno",
    },
    {
      q: "Por que usar RDS Proxy com Lambda?",
      a: "<p>Lambda escala horizontalmente — 100 invocações simultâneas = 100 conexões abertas no RDS. Bancos relacionais têm custo alto por conexão (memória, processos). RDS Proxy mantém um pool de conexões com o banco e multiplexa centenas de clientes Lambda em poucas conexões reais.</p><p>Benefício adicional: RDS Proxy suporta failover mais rápido (&lt; 30 s vs 60 s), pois mantém a conexão e redireciona transparentemente em failover Multi-AZ.</p>",
      tip: "RDS Proxy adiciona ~1 ms de latência. Para workloads de baixa latência (< 5 ms), isso pode ser relevante. Para a maioria dos casos de API, o trade-off é amplamente positivo.",
      level: "pleno",
    },
    {
      q: "Como funcionam backups e PITR no RDS?",
      a: "<p>Automated backup: RDS tira snapshot diário (janela de manutenção) e armazena transaction logs continuamente. Isso permite PITR — restaurar para qualquer segundo dentro do período de retenção (1–35 dias).</p><p>Snapshot manual: criado sob demanda, retido até deletar explicitamente. Útil antes de migrações arriscadas.</p><p>Importante: restaurar cria uma <em>nova instância</em> com novo endpoint — não é restore in-place. Planeje atualização de connection strings e DNS.</p>",
      tip: "PITR mínimo recomendado para produção: 7 dias. 14 dias é razoável para a maioria. 35 dias só se compliance exigir — o custo de storage aumenta proporcionalmente.",
      level: "senior",
    },
    {
      q: "Como diagnosticaria uma query lenta em produção no RDS PostgreSQL?",
      a: "<p>1. <strong>Performance Insights:</strong> identifica a query pelo tempo de espera — CPU, I/O, lock. Obtém o SQL top-N por carga.</p><p>2. <strong>pg_stat_statements:</strong> extensão que agrega estatísticas de execução por query (calls, mean_exec_time, rows, shared_blk_hit). Identifica queries com alto total_exec_time.</p><p>3. <strong>EXPLAIN (ANALYZE, BUFFERS):</strong> roda em staging com dados reais. Identifica Seq Scan em tabela grande (falta de índice), Nested Loop com estimativa errada de rows, bitmap heap scan ineficiente.</p><p>4. <strong>Ação:</strong> índice faltante, reescrita da query, VACUUM/ANALYZE, ou ajuste de parâmetros (work_mem, effective_cache_size).</p>",
      tip: "Performance Insights mostra 'top SQL by load' — uma query que roda 1 ms mas 10.000× por segundo aparece no topo. pg_stat_statements confirma com dados históricos. EXPLAIN ANALYZE é o diagnóstico final do plano.",
      level: "senior",
    },
    {
      q: "O que é Aurora Global Database e quando usar?",
      a: "<p>Aurora Global Database replica de uma região primária para até 5 regiões secundárias com lag típico &lt; 1 s (replicação de storage, não de redo logs). Leituras servidas localmente em cada região secundária.</p><p>Use quando: aplicação global com usuários em múltiplas regiões que precisam de leituras de baixa latência; DR com RPO &lt; 1 s e RTO &lt; 1 min (failover regional controlado); compliance de residência de dados com leituras locais mas escrita centralizada.</p><p>Diferente de Cross-Region Read Replica do RDS padrão: Global Database tem lag menor e failover regional mais rápido.</p>",
      tip: "Em um failover de Aurora Global, você promove manualmente uma região secundária a primária. Não é automático — exige runbook e teste periódico de DR. O RTO real depende do tempo de execução do runbook, não apenas do lag de replicação.",
      level: "senior",
    },
    {
      q: "Como funciona o storage do Aurora e por que ele é diferente do RDS padrão?",
      a: "<p>RDS padrão: cada instância tem um volume EBS dedicado. Backup = snapshot do EBS. Read Replica tem volume EBS próprio, replicado via binlog/WAL — lag proporcional à carga de escrita.</p><p>Aurora: storage é compartilhado por todas as instâncias do cluster (writer + readers). 6 cópias distribuídas em 3 AZs. Reads das réplicas são do mesmo storage físico que o writer — lag mínimo porque não há replicação lógica de dados, apenas do redo log.</p><p>Consequência prática: adicionar uma Read Replica Aurora é instantâneo (sem copiar dados). Promover replica é rápido (storage já tem todos os dados). Failover não precisa copiar dados para o novo primary.</p>",
      tip: "O storage compartilhado é o que permite lag < 100 ms no Aurora. No RDS padrão, a replica precisa aplicar binlog/WAL — quanto mais writes, maior o lag. No Aurora, a replica apenas lê do storage compartilhado.",
      level: "senior",
    },
    {
      q: "O que são Parameter Groups e como alterar parâmetros com segurança em produção?",
      a: "<p>Parameter Groups são conjuntos de configurações do engine de banco (equivalente ao postgresql.conf e pg_hba.conf). Cada instância tem exatamente um Parameter Group.</p><p>Parâmetros têm dois tipos: <strong>dinâmicos</strong> (apply_type=dynamic) — aplicados imediatamente sem reboot (ex: work_mem, log_min_duration_statement); <strong>estáticos</strong> (apply_type=static) — exigem reboot da instância (ex: shared_buffers, max_connections).</p><p>Processo seguro: criar novo Parameter Group (nunca editar o default), aplicar na instância de staging, testar, depois aplicar em produção. Para parâmetros estáticos, agendar reboot na janela de manutenção ou usar blue/green deployment.</p>",
      tip: "Alterar max_connections sem RDS Proxy é arriscado: aumentar demais consome mais memória e pode degradar performance. A fórmula para PostgreSQL: max_connections = RAM_GB × 100 é um ponto de partida, mas workloads OLTP pesados preferem menos conexões com connection pool.",
      level: "senior",
    },
    {
      q: "O que é Blue/Green Deployment no RDS e como usar para upgrade de engine?",
      a: "<p>Blue/Green Deployment cria uma cópia da instância de produção (Green) sincronizada com replicação lógica. Você aplica mudanças no Green (upgrade de engine, schema changes), valida, e faz o switchover — o DNS é atualizado para apontar para o Green com downtime mínimo (&lt; 1 min).</p><p>Processo: CreateBlueGreenDeployment → aguardar Green replicar → aplicar mudanças no Green → testar → SwitchoverBlueGreenDeployment → validar → deletar Blue (antigo primary).</p><p>Vantagem sobre upgrade in-place: o Blue original permanece disponível como rollback imediato. Se algo der errado, basta apontar o DNS de volta para o Blue. Sem Blue/Green, um upgrade de engine é irreversível.</p>",
      tip: "Blue/Green não suporta Oracle e SQL Server. Para Aurora, é recomendado usar cluster endpoint — o switchover redireciona automaticamente. Para RDS padrão com endpoint fixo em código, usar Route 53 CNAME ou RDS Proxy torna o switchover transparente para a aplicação.",
      level: "senior",
    },
    {
      q: "Como configurar criptografia em repouso no RDS e quais são as limitações?",
      a: "<p>Criptografia em repouso é habilitada no momento de criação da instância — não pode ser habilitada ou desabilitada depois. Usa KMS (chave AWS gerenciada ou CMK customer-managed).</p><p>O que é criptografado: storage da instância, snapshots automáticos, snapshots manuais, Read Replicas na mesma região, logs. Logs de transaction do Aurora também são criptografados.</p><p>Limitações: instância não criptografada não pode ser migrada para criptografada diretamente. O caminho: tirar snapshot → copiar o snapshot com criptografia habilitada → restaurar o snapshot criptografado em nova instância. Planejar downtime ou usar replicação lógica para migração sem downtime.</p>",
      tip: "Usar CMK (Customer Managed Key) em vez da chave AWS gerenciada permite rotação manual, auditoria de uso no CloudTrail, e revogação de acesso sem deletar dados. Para dados sensíveis (PCI, HIPAA), CMK é o caminho correto.",
      level: "senior",
    },
    {
      q: "Como usar autenticação IAM no RDS em vez de senha?",
      a: "<p>RDS suporta autenticação via token IAM para PostgreSQL e MySQL. Em vez de senha, a aplicação gera um token temporário (validade 15 min) assinado pelas credenciais AWS da role.</p><p>Configuração: habilitar IAM auth na instância RDS, criar usuário DB com GRANT rds_iam (PostgreSQL) ou IDENTIFIED WITH AWSAuthenticationPlugin (MySQL), dar permissão <code>rds-db:connect</code> na IAM policy.</p><p>Vantagem: sem senha hardcoded ou no Secrets Manager, rotação automática via IAM, auditoria completa de quem conectou e quando via CloudTrail. Ideal para serviços AWS com role (Lambda, ECS).</p>",
      tip: "IAM auth tem overhead de ~100–200 ms para gerar o token. Para Lambda com RDS Proxy, o Proxy autentica com Secrets Manager e serve o pool — a Lambda não precisa gerar token a cada invocação. Combine RDS Proxy + Secrets Manager para o melhor dos dois mundos.",
      level: "senior",
    },
    {
      q: "Como o Performance Insights funciona e como interpretar os dados?",
      a: "<p>Performance Insights coleta métricas de carga do banco (DB Load) e as decompõe por tipo de espera (wait type): CPU, I/O Read, I/O Write, Lock, Network, etc. A métrica principal é DB Load — número médio de sessions ativas no banco.</p><p>DB Load > número de vCPUs = banco sob pressão. Decomposição por wait type direciona a investigação: muito CPU → query ineficiente (Seq Scan, falta de índice); muito Lock → contenção de transações concorrentes; muito I/O → tabelas grandes sem índice ou cache miss.</p><p>O dashboard Top SQL mostra as queries que mais contribuem para o DB Load — filtrável por wait type. Exportável via API para dashboards Grafana/CloudWatch.</p>",
      tip: "Performance Insights free tier: 7 dias de retenção e 1 chamada de API por segundo. Para histogramas de longo prazo (trend de semanas), exportar métricas para CloudWatch Metrics com resolução de 1 minuto e criar alarmes de DB Load > n_vcpus.",
      level: "senior",
    },
    {
      q: "Qual a diferença entre Enhanced Monitoring e Performance Insights?",
      a: "<p><strong>Enhanced Monitoring:</strong> coleta métricas do sistema operacional onde o RDS roda (CPU por processo, memory, disk I/O, network, processos). Granularidade de 1–60 segundos. Dados vão para CloudWatch Logs → CloudWatch Metrics. Útil para identificar se o gargalo é no OS (ex: swap usage, CPU steal).</p><p><strong>Performance Insights:</strong> coleta métricas do banco de dados (DB Load, wait types, top SQL). Foca no que o banco está fazendo, não no hardware. Gratuito por 7 dias, pago para mais.</p><p>São complementares: Enhanced Monitoring vê 'como está o servidor', Performance Insights vê 'o que o banco está fazendo'. Um alto I/O no Enhanced Monitoring + alto I/O wait no Performance Insights = diagnóstico completo de gargalo de disco.</p>",
      tip: "Em um incident de lentidão, começar pelo Performance Insights (top SQL, wait type) → se wait type for I/O, verificar Enhanced Monitoring (disk throughput, IOPS utilizados vs provisionados) → ajustar storage type ou provisionar mais IOPS.",
      level: "senior",
    },
    {
      q: "Como estruturar multi-região para DR com RDS?",
      a: "<p>Três abordagens com trade-offs diferentes:</p><p><strong>1. Cross-Region Read Replica:</strong> RPO minutos (lag assíncrono), RTO 30–60 min (promoção manual + atualização de DNS). Mais simples, mais barato. Bom para DR de menor criticidade.</p><p><strong>2. Aurora Global Database:</strong> RPO &lt; 1 s, RTO &lt; 1 min (switchover controlado). Mais caro, melhor SLA. Para aplicações que não toleram minutos de dados perdidos.</p><p><strong>3. Multi-região ativo-ativo:</strong> requer replicação bidirecional (sem suporte nativo no RDS — usar Aurora com custom replication ou PostgreSQL logical replication). Complexidade alta, latência de escrita cross-region. Raramente necessário.</p><p>RPO e RTO são os drivers da decisão, não a tecnologia.</p>",
      tip: "Testar o failover periodicamente é obrigatório — um plano de DR não testado não é um plano. Usar game days trimestrais para exercitar o runbook de promoção de Read Replica ou Aurora Global switchover.",
      level: "senior",
    },
    {
      q: "Como otimizar custo de RDS em produção sem comprometer disponibilidade?",
      a: "<p>Principais alavancas de custo:</p><ul><li><strong>Right-sizing:</strong> usar Performance Insights + CloudWatch para identificar instâncias super-provisionadas. Escalar para baixo em horários de baixo tráfego (não disponível automaticamente no RDS standard — apenas Aurora Serverless v2).</li><li><strong>Reserved Instances:</strong> compromisso de 1–3 anos com desconto de 30–60%. Fazer após right-sizing — compromisso com instância errada não tem rollback barato.</li><li><strong>Storage:</strong> gp3 é 20% mais barato que gp2 com mesma ou melhor performance. Migrar snapshots antigos para S3 Glacier (não automático — scripts de lifecycle).</li><li><strong>Aurora I/O pricing:</strong> medir % de I/O no custo total. Se &gt; 25%, Aurora I/O-Optimized (preço fixo) pode ser mais barato que Standard (cobrado por I/O).</li><li><strong>Read Replicas desnecessárias:</strong> cada replica paga instância + storage. Avaliar se o volume de leitura justifica.</li></ul>",
      tip: "Reserved Instances no RDS: converter instâncias já em uso para reserved é imediato (billing muda, não há ação na instância). Mas é compromisso — se o tipo de instância mudar, o RI fica pago sem uso. Preferir RIs de 1 ano para flexibilidade.",
      level: "senior",
    },
    {
      q: "Como funciona o RDS Event Notifications e para quais eventos configurar alertas?",
      a: "<p>RDS Event Notifications usa SNS para publicar eventos de instâncias, snapshots, parameter groups e security groups. Categorias de eventos são assinadas por subscription.</p><p><strong>Eventos críticos para monitorar:</strong></p><ul><li><code>RDS-EVENT-0006</code>: failover iniciado — Multi-AZ switched over</li><li><code>RDS-EVENT-0034</code>: instância reiniciada</li><li><code>RDS-EVENT-0043</code>: backup failed</li><li><code>RDS-EVENT-0045</code>: storage 90% cheio</li><li><code>RDS-EVENT-0049</code>: automated backup iniciado (para correlacionar com lentidão)</li><li><code>RDS-EVENT-0187</code>: RDS Proxy connection refused</li></ul><p>Combinar com CloudWatch Alarms: DB Load, FreeStorageSpace, DatabaseConnections, ReadLatency, WriteLatency.</p>",
      tip: "FreeStorageSpace < 10% do total é o alarme mais crítico — quando storage satura, o banco para completamente. Habilitar storage autoscaling é o safety net, mas o alarme é necessário para investigar crescimento anormal (carga inesperada, bulk insert acidental).",
      level: "pleno",
    },
    {
      q: "Como escalar verticalmente uma instância RDS em produção com downtime mínimo?",
      a: "<p>Escala vertical no RDS padrão exige reinicialização da instância — downtime de 1–2 minutos. Estratégias para minimizar impacto:</p><p>1. <strong>Multi-AZ ativo:</strong> o failover automático reduz o downtime da aplicação para o tempo de reconexão TCP (30–60 s). Sem Multi-AZ, o downtime é o tempo de restart da instância.</p><p>2. <strong>Janela de manutenção:</strong> agendar a modificação para a janela configurada (madrugada). RDS aplica as mudanças pendentes automaticamente.</p><p>3. <strong>Blue/Green:</strong> criar Green com novo instance type, validar, switchover. Downtime de &lt; 1 min + rollback disponível se algo der errado.</p><p>4. <strong>Aurora:</strong> réplicas podem ser escaladas independentemente. Promover uma réplica maior a writer — quase zero downtime de escrita no cluster.</p>",
      tip: "Com Aurora, a estratégia preferida é adicionar uma instância de replica com o novo instance type, fazer failover manual para ela (30 s de downtime), e depois reduzir/remover a antiga. O cluster não precisa de maintenance window.",
      level: "senior",
    },
    {
      q: "O que é o RDS Storage Autoscaling e quais são seus limites?",
      a: "<p>Storage Autoscaling aumenta automaticamente o storage da instância RDS quando o armazenamento livre fica abaixo de 10% ou 5 GiB (o menor dos dois) por mais de 5 minutos consecutivos. O incremento mínimo é 10 GiB ou 10% do tamanho atual.</p><p>Configuração: ao criar ou modificar a instância, habilitar autoscaling com um limite máximo (Max allocated storage). O RDS nunca excede esse limite.</p><p><strong>Limitações críticas:</strong> storage só cresce — nunca diminui automaticamente. Para reduzir storage, é necessário criar uma nova instância com storage menor a partir de um snapshot. Também há um cooldown de 6 horas entre expansões automáticas.</p>",
      tip: "Defina o limite máximo do autoscaling com cuidado: se a aplicação tiver um bug de acúmulo de dados (log table sem cleanup), o storage crescerá até o limite sem alarmar — e você paga o custo. Configure alarme de FreeStorageSpace < 20% para investigar antes do autoscaling entrar em ação.",
      level: "pleno",
    },
    {
      q: "Quando e como usar o Aurora Serverless v2?",
      a: "<p>Aurora Serverless v2 escala automaticamente entre um mínimo e máximo de ACUs (Aurora Capacity Units) com granularidade de 0,5 ACU, sem downtime. 1 ACU ≈ 2 GB de RAM.</p><p><strong>Casos de uso ideais:</strong> ambientes de desenvolvimento/staging (min 0,5 ACU = custo mínimo quando idle), workloads imprevisíveis com picos, aplicações novas sem baseline de uso, SaaS multi-tenant onde o tráfego varia por tenant.</p><p><strong>Não recomendado para:</strong> workloads com SLA de latência sub-milissegundo (o scaling tem latência de alguns segundos), bancos que nunca ficam idle (o benefício de scaling é menor que Reserved Instance do tamanho correto).</p><p>Diferença v1 vs v2: v1 escalava entre zero e N ACUs mas tinha cold start de 25+ segundos. v2 escala de 0,5 ACU (sem cold start), mais granular e mais rápido.</p>",
      tip: "O custo do Aurora Serverless v2 é por ACU-hora. Se o banco fica em 2 ACUs 24/7, comparar com uma instância db.t4g.medium (4 vCPU, 16 GB) em Reserved. O ponto de quebra varia com o padrão de uso — calcular antes de migrar.",
      level: "senior",
    },
    {
      q: "Como funciona a janela de manutenção do RDS e o que acontece durante ela?",
      a: "<p>A janela de manutenção é um intervalo semanal de 30 minutos (ex: Mon:04:00-Mon:04:30) durante o qual a AWS aplica patches de segurança do sistema operacional, atualizações do engine e modificações de instância pendentes.</p><p><strong>O que acontece:</strong> para instâncias sem Multi-AZ, há breve downtime durante o patch (1–2 min). Para instâncias Multi-AZ, a AWS aplica o patch no standby primeiro, executa failover, e aplica no antigo primary — downtime reduzido ao tempo de failover (~30–60 s).</p><p><strong>Modificações pendentes:</strong> alterações de instância marcadas como 'Apply during maintenance window' ficam acumuladas e são aplicadas em bloco na próxima janela. Você pode forçar aplicação imediata via console ou CLI.</p><p><strong>Boas práticas:</strong> definir janela em horário de menor tráfego, ter Multi-AZ em produção para minimizar impacto, monitorar RDS Events para notificações de manutenção antecipada.</p>",
      tip: "A AWS avisa com 2–3 dias de antecedência quando manutenção obrigatória está programada. Assinar RDS Event Notifications no SNS com categoria 'maintenance' é essencial para não ser pego de surpresa em produção.",
      level: "pleno",
    },
  ],
  exercises: [
    {
      level: "iniciante",
      title: "Criar instância RDS e testar failover Multi-AZ",
      description: "Crie uma instância RDS PostgreSQL com Multi-AZ habilitado. Conecte com psql e monitore via CloudWatch. Simule um failover forçando um reboot com opção de failover (AWS Console > Reboot with failover). Meça o tempo de downtime e confirme que o endpoint DNS permanece o mesmo após o failover.",
      concepts: ["multi-az", "failover", "dns-endpoint", "alta-disponibilidade"],
      hint: "O endpoint do RDS é um CNAME do Route 53 que aponta para a instância ativa. Após o failover, o CNAME é atualizado automaticamente — a aplicação não precisa mudar a connection string.",
    },
    {
      level: "iniciante",
      title: "Restaurar banco via PITR para um momento específico",
      description: "Com automated backup habilitado (retenção de 7 dias), simule um delete acidental em uma tabela de teste. Em seguida, use Point-in-Time Recovery para restaurar a instância para 5 minutos antes do delete. Conecte na nova instância e confirme que os dados foram recuperados.",
      concepts: ["pitr", "automated-backup", "recovery", "snapshot"],
      hint: "PITR cria uma nova instância com novo endpoint. Para simular o cenário real, você precisará atualizar a connection string da aplicação ou Route 53 CNAME para apontar para a nova instância restaurada.",
    },
    {
      level: "intermediario",
      title: "Configurar RDS Proxy para uma função Lambda",
      description: "Crie uma Lambda que conecta em um RDS PostgreSQL via RDS Proxy usando credenciais do Secrets Manager. Compare: (1) Lambda conectando diretamente ao RDS — meça DatabaseConnections no CloudWatch com 50 invocações simultâneas; (2) Lambda conectando via Proxy — meça o mesmo metric. Documente a redução de conexões.",
      concepts: ["rds-proxy", "lambda", "connection-pooling", "secrets-manager", "max-connections"],
    },
    {
      level: "intermediario",
      title: "Diagnosticar e otimizar uma query lenta com Performance Insights",
      description: "Habilite Performance Insights e pg_stat_statements em um RDS PostgreSQL. Crie uma tabela com 1 milhão de registros sem índice e execute uma query que faz full scan. Observe o DB Load e wait type no Performance Insights. Adicione o índice adequado e compare o DB Load antes e depois. Documente o plano de execução (EXPLAIN ANALYZE) em ambos os casos.",
      concepts: ["performance-insights", "pg_stat_statements", "explain-analyze", "indexing", "seq-scan"],
    },
    {
      level: "intermediario",
      title: "Migrar RDS padrão para Aurora PostgreSQL",
      description: "Com uma instância RDS PostgreSQL existente, migre para Aurora PostgreSQL usando: (1) snapshot da instância RDS → restore em Aurora; (2) valide que todas as tabelas, índices, extensões e dados estão presentes; (3) compare performance de leitura com pgbench entre as duas instâncias; (4) execute o switchover de tráfego atualizando a connection string.",
      concepts: ["aurora", "migration", "snapshot-restore", "pgbench", "switchover"],
    },
    {
      level: "senior",
      title: "Implementar blue/green deployment para upgrade de engine sem downtime",
      description: "Execute um upgrade de engine major (ex: PostgreSQL 15 → 16) usando Blue/Green Deployment. Etapas: (1) criar o ambiente Green com a nova versão; (2) executar testes de compatibilidade de queries no Green enquanto Blue serve produção; (3) executar o switchover; (4) medir downtime real com uma aplicação em teste contínuo de conectividade; (5) deletar o Blue após validação. Documentar o runbook completo.",
      concepts: ["blue-green", "engine-upgrade", "zero-downtime", "switchover", "rollback"],
    },
  ],
  videos: [
    {
      title: "Amazon RDS Deep Dive and Best Practices",
      channel: "AWS re:Invent",
      url: "https://www.youtube.com/watch?v=TJxC-B9Q9tQ",
    },
    {
      title: "Amazon Aurora Deep Dive — Storage Architecture",
      channel: "AWS re:Invent",
      url: "https://www.youtube.com/watch?v=U42mC_iKSBg",
    },
    {
      title: "RDS Proxy — Managing Database Connections at Scale",
      channel: "AWS Online Tech Talks",
      url: "https://www.youtube.com/watch?v=ULRnn5_RbSo",
    },
    {
      title: "Performance Insights — Deep Dive into Database Performance",
      channel: "AWS re:Invent",
      url: "https://www.youtube.com/watch?v=4462hcfkApM",
    },
    {
      title: "Blue/Green Deployments for Amazon RDS",
      channel: "AWS Online Tech Talks",
      url: "https://www.youtube.com/watch?v=V0TBxGJvpSM",
    },
    {
      title: "Aurora Serverless v2 — Auto Scaling for Aurora",
      channel: "AWS re:Invent",
      url: "https://www.youtube.com/watch?v=drr4RB3kRTQ",
    },
  ],
  resources: [
    { title: "Amazon RDS User Guide", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/", kind: "docs" },
    { title: "Amazon Aurora User Guide", url: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/", kind: "docs" },
    { title: "RDS Proxy User Guide", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html", kind: "docs" },
    { title: "Performance Insights User Guide", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.html", kind: "docs" },
    { title: "Blue/Green Deployments for RDS", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/blue-green-deployments.html", kind: "docs" },
    { title: "RDS Best Practices", url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html", kind: "docs" },
    { title: "Aurora Global Database", url: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html", kind: "docs" },
    { title: "RDS Pricing Calculator", url: "https://aws.amazon.com/rds/pricing/", kind: "docs" },
  ],
}

export default rds
