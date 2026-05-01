import type { SkillContentMap } from "@/types"

const data: SkillContentMap = {
  "aws": {
    tagline: "Líder de cloud com 200+ serviços — saber combiná-los é o que diferencia sênior de pleno.",
    why: "AWS domina o mercado de cloud com mais de 32% de market share. Qualquer vaga de backend sênior em 2025 pressupõe conhecimento prático de EC2, S3, RDS, Lambda, IAM e VPC. Certificações abrem portas, mas entender os tradeoffs reais — quando usar RDS vs DynamoDB, ECS vs Lambda, Security Group vs NACL — é o que diferencia sênior de pleno em entrevista técnica. Saber desenhar uma arquitetura 3-tier na AWS com VPC, subnets públicas/privadas, ALB, ECS e RDS Multi-AZ em 10 minutos num quadro branco é pré-requisito para vagas de arquitetura.",
    prerequisite: "Conceitos de rede (IP, sub-redes, DNS, HTTP/S, TCP/UDP), linux básico (ssh, permissões de arquivo, variáveis de ambiente), containers (o que é um container Docker), banco de dados relacional (SQL básico, o que é um índice). Sem esses fundamentos, os serviços AWS não vão fazer sentido — eles são abstrações em cima dessas tecnologias.",
    summary: "AWS oferece infraestrutura como serviço (IaaS), plataforma (PaaS) e software (SaaS) em escala global. Regiões são localizações geográficas independentes; dentro de cada região existem múltiplas AZs (datacenters fisicamente separados). Serviços fundamentais: computação (EC2, Lambda, ECS/Fargate, EKS), storage (S3, EBS, EFS), banco de dados (RDS/Aurora, DynamoDB, ElastiCache), rede (VPC, Route 53, CloudFront, ALB/NLB), segurança (IAM, KMS, Secrets Manager, WAF, GuardDuty), observabilidade (CloudWatch, X-Ray, CloudTrail) e mensageria (SQS, SNS, EventBridge). O modelo pay-as-you-go permite escalar sem CAPEX, mas exige atenção constante ao custo — egress de dados e instâncias ociosas são as armadilhas mais comuns.",
    howToStudy: "<strong>30 minutos antes de entrevista?</strong> Revise o diagrama de arquitetura 3-tier (Diagrama 2), memorize os serviços por camada do Diagrama 1 e treine as Q&As de <strong>nível pleno</strong> em voz alta. Garanta que você consegue explicar IAM roles vs users, Multi-AZ vs Multi-Region e quando usar Lambda vs ECS.<br><br><strong>Fim de semana?</strong> Crie uma conta AWS free tier. Suba um EC2, configure um S3 bucket, crie uma role IAM com least privilege. Siga o Cookbook de deploy 3-tier. A prática com a console e CLI vale mais do que qualquer leitura.<br><br><strong>Uma semana?</strong> Faça o AWS Cloud Practitioner (ou Solutions Architect Associate). Estude em ordem: IAM → VPC → EC2 → S3 → RDS → Lambda → CloudWatch. Cada serviço faz mais sentido depois do anterior.",
    diagrams: [
      {
        title: "Mapa de serviços AWS por camada — com quando usar cada um",
        html: `<style>
.awsm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.awsm-layer{margin-bottom:10px}
.awsm-ltitle{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#FF9900;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.awsm-ltitle::after{content:'';flex:1;height:1px;background:rgba(255,153,0,.2)}
.awsm-chips{display:flex;flex-wrap:wrap;gap:5px}
.awsm-chip{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:5px 10px;font-size:10.5px;cursor:default;position:relative;transition:border-color .2s,background .2s;white-space:nowrap}
.awsm-chip:hover{border-color:#FF9900;background:#1e293b}
.awsm-chip:hover .awsm-tt{display:block}
.awsm-tt{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 13px;font-size:11px;line-height:1.65;z-index:40;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 6px 24px rgba(0,0,0,.9)}
.awsm-tt::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.awsm-tt b{color:#e2e8f0;display:block;margin-bottom:3px}
.awsm-tt .use{color:#4ade80;font-size:10px}
</style>
<div class="awsm-wrap">
  <p style="font-size:10px;color:#64748b;margin:0 0 14px">Passe o mouse em cada serviço — <span style="color:#FF9900">quando usar</span> e resumo aparecem no tooltip</p>

  <div class="awsm-layer">
    <div class="awsm-ltitle">Computação</div>
    <div class="awsm-chips">
      <div class="awsm-chip">EC2<div class="awsm-tt"><b>VMs na nuvem</b>Controle total sobre OS, rede, storage. 400+ tipos de instância otimizados (CPU, memória, GPU, NVMe).<span class="use">Usar quando: precisa de controle de OS, software legado, workloads persistentes, GPU.</span></div></div>
      <div class="awsm-chip">Lambda<div class="awsm-tt"><b>Funções serverless event-driven</b>Executa em resposta a eventos (S3, SQS, API GW, EventBridge). Paga por invocação + duração (1 ms). Max 15 min, 10 GB RAM.<span class="use">Usar quando: event-driven, esporádico, curta duração, escala zero.</span></div></div>
      <div class="awsm-chip">ECS / Fargate<div class="awsm-tt"><b>Containers sem gerenciar cluster</b>Fargate = serverless containers — AWS gerencia os workers. ECS+EC2 = você gerencia os workers mas AWS gerencia o orquestrador.<span class="use">Usar quando: containers com carga previsível, sem precisar de Kubernetes.</span></div></div>
      <div class="awsm-chip">EKS<div class="awsm-tt"><b>Kubernetes gerenciado</b>Control plane gerenciado pela AWS. Workers em EC2 ou Fargate. Portabilidade e ecossistema Kubernetes completo.<span class="use">Usar quando: time já usa K8s, workloads complexos, portabilidade multi-cloud.</span></div></div>
      <div class="awsm-chip">Batch<div class="awsm-tt"><b>Jobs batch de alta escala</b>Provisiona e gerencia workers EC2/Spot automaticamente para filas de jobs. Integra com Step Functions.<span class="use">Usar quando: processamento em lote, ML training, simulações científicas.</span></div></div>
    </div>
  </div>

  <div class="awsm-layer">
    <div class="awsm-ltitle">Storage</div>
    <div class="awsm-chips">
      <div class="awsm-chip">S3<div class="awsm-tt"><b>Object storage durável</b>11 noves de durabilidade. Escala infinita. Classes: Standard, IA, Glacier. Pre-signed URLs, Lifecycle policies, Replication.<span class="use">Usar quando: arquivos de qualquer tipo, backups, data lake, assets estáticos.</span></div></div>
      <div class="awsm-chip">EBS<div class="awsm-tt"><b>Disco de bloco para EC2</b>Tipos: gp3 (geral, padrão), io2 (alta IOPS — DBs), st1 (throughput — logs). Snapshots para backup.<span class="use">Usar quando: disco persistente de uma EC2, banco de dados em EC2.</span></div></div>
      <div class="awsm-chip">EFS<div class="awsm-tt"><b>Filesystem NFS compartilhado</b>Múltiplas EC2 simultâneas lendo/escrevendo. Escala automática. Modes: General Purpose e Max I/O.<span class="use">Usar quando: múltiplos servidores precisam do mesmo filesystem (ex: CMS, dados compartilhados).</span></div></div>
      <div class="awsm-chip">Glacier<div class="awsm-tt"><b>Arquivamento de longo prazo</b>Instant Retrieval (ms), Flexible (min/h), Deep Archive (12–48h). Custo de storage mínimo.<span class="use">Usar quando: retenção regulatória, backups frios que raramente precisam ser acessados.</span></div></div>
    </div>
  </div>

  <div class="awsm-layer">
    <div class="awsm-ltitle">Banco de dados</div>
    <div class="awsm-chips">
      <div class="awsm-chip">RDS<div class="awsm-tt"><b>Bancos relacionais gerenciados</b>PostgreSQL, MySQL, MariaDB, Oracle, SQL Server. Backups automáticos, patching, Multi-AZ failover.<span class="use">Usar quando: dados relacionais estruturados, transações ACID, JOINS complexos.</span></div></div>
      <div class="awsm-chip">Aurora<div class="awsm-tt"><b>Relacional 5× mais rápido que MySQL</b>Storage compartilhado que escala automaticamente até 128 TB. Aurora Serverless v2 para cargas variáveis. Global Database para multi-region.<span class="use">Usar quando: PostgreSQL/MySQL com alta performance e HA como requisito.</span></div></div>
      <div class="awsm-chip">DynamoDB<div class="awsm-tt"><b>NoSQL serverless, latência de ms</b>Key-value + documento. Escala automática. GSI/LSI. Streams. Point-in-time recovery. DAX para cache.<span class="use">Usar quando: acesso por chave, escala imprevisível, sem JOINS complexos, gaming, IoT.</span></div></div>
      <div class="awsm-chip">ElastiCache<div class="awsm-tt"><b>Cache gerenciado Redis/Memcached</b>Redis: estruturas de dados, pub/sub, Lua, persistência. Memcached: cache simples multi-thread.<span class="use">Usar quando: reduzir latência de leituras repetidas no banco, sessões de usuário, rate limiting.</span></div></div>
      <div class="awsm-chip">Redshift<div class="awsm-tt"><b>Data warehouse analítico</b>Queries SQL em petabytes. Columnar storage. Integra com S3 (Spectrum). Serverless disponível.<span class="use">Usar quando: analytics, BI, queries OLAP sobre grandes volumes de dados históricos.</span></div></div>
    </div>
  </div>

  <div class="awsm-layer">
    <div class="awsm-ltitle">Rede</div>
    <div class="awsm-chips">
      <div class="awsm-chip">VPC<div class="awsm-tt"><b>Rede virtual isolada</b>Subnets públicas/privadas, Internet Gateway, NAT Gateway, Security Groups (stateful), NACLs (stateless), VPC Peering, Transit Gateway.<span class="use">Usar quando: qualquer arquitetura com recursos que precisam de rede isolada (sempre).</span></div></div>
      <div class="awsm-chip">CloudFront<div class="awsm-tt"><b>CDN global com 400+ PoPs</b>Cache de S3, ALB, origens customizadas. WAF integrado. Lambda@Edge para lógica no edge. TLS grátis.<span class="use">Usar quando: assets estáticos globais, reduzir egress do S3, WAF na borda, baixa latência global.</span></div></div>
      <div class="awsm-chip">Route 53<div class="awsm-tt"><b>DNS gerenciado com health checks</b>Políticas de roteamento: Simple, Weighted, Failover, Geolocation, Latency-based, Multivalue.<span class="use">Usar quando: DNS do domínio, failover automático, roteamento geográfico de tráfego.</span></div></div>
      <div class="awsm-chip">ALB<div class="awsm-tt"><b>Application Load Balancer L7</b>Roteamento por path (/api/*) e host (api.domain.com). Terminação TLS. Sticky sessions. Target Groups.<span class="use">Usar quando: múltiplos serviços atrás de um endpoint, microserviços, roteamento HTTP.</span></div></div>
      <div class="awsm-chip">NLB<div class="awsm-tt"><b>Network Load Balancer L4</b>Ultra-alta performance (milhões de req/s), latência <1ms. IP estático. TCP/UDP/TLS passthrough.<span class="use">Usar quando: gaming, IoT, VoIP, protocolo não-HTTP, IP fixo obrigatório.</span></div></div>
    </div>
  </div>

  <div class="awsm-layer">
    <div class="awsm-ltitle">Segurança e Identidade</div>
    <div class="awsm-chips">
      <div class="awsm-chip">IAM<div class="awsm-tt"><b>Controle de acesso granular</b>Users, Groups, Roles, Policies (identity + resource). Principle of Least Privilege. Roles para EC2/Lambda — nunca credenciais hardcoded.<span class="use">Usar quando: sempre — toda ação na AWS passa por IAM.</span></div></div>
      <div class="awsm-chip">KMS<div class="awsm-tt"><b>Gerenciamento de chaves</b>Customer Managed Keys (CMK) ou AWS Managed. Integra com S3, RDS, EBS, Secrets Manager. Auditável via CloudTrail.<span class="use">Usar quando: criptografia em repouso com controle de chave, compliance regulatório (SOC2, HIPAA).</span></div></div>
      <div class="awsm-chip">Secrets Manager<div class="awsm-tt"><b>Armazena e rotaciona secrets</b>DB passwords, API keys, OAuth tokens. Rotação automática com Lambda. Integra nativamente com RDS.<span class="use">Usar quando: guardar credentials de banco, API keys — nunca em variáveis de ambiente plaintext.</span></div></div>
      <div class="awsm-chip">WAF<div class="awsm-tt"><b>Web Application Firewall</b>Regras contra SQLi, XSS, bots, rate limiting por IP. Integra com CloudFront, ALB, API Gateway.<span class="use">Usar quando: API pública, proteção contra ataques comuns, rate limiting de endpoints.</span></div></div>
      <div class="awsm-chip">GuardDuty<div class="awsm-tt"><b>Detecção de ameaças com ML</b>Analisa CloudTrail, VPC Flow Logs, DNS logs. Detecta: IPs maliciosos, mineração de crypto, vazamento de credenciais.<span class="use">Usar quando: monitoramento contínuo de segurança — ativar em toda conta de produção.</span></div></div>
    </div>
  </div>

  <div class="awsm-layer">
    <div class="awsm-ltitle">Observabilidade</div>
    <div class="awsm-chips">
      <div class="awsm-chip">CloudWatch<div class="awsm-tt"><b>Métricas, logs e alarmes</b>Métricas de todos os serviços AWS. Log Groups para centralizar logs. Alarmes para notificação e auto-scaling. Dashboards.<span class="use">Usar quando: monitorar qualquer serviço AWS, criar alarmes de billing/performance.</span></div></div>
      <div class="awsm-chip">X-Ray<div class="awsm-tt"><b>Distributed tracing</b>Trace de requests ponta a ponta em microserviços e serverless. Service map visual. Identifica gargalos e erros.<span class="use">Usar quando: debugar latência em arquitetura distribuída, Lambda + API Gateway + DynamoDB.</span></div></div>
      <div class="awsm-chip">CloudTrail<div class="awsm-tt"><b>Auditoria de ações na conta</b>Registra toda chamada de API na AWS (quem fez, quando, de onde). Essencial para compliance e investigação de incidentes.<span class="use">Usar quando: auditoria de segurança, compliance, investigar mudanças de configuração.</span></div></div>
    </div>
  </div>

  <div class="awsm-layer">
    <div class="awsm-ltitle">Mensageria e Eventos</div>
    <div class="awsm-chips">
      <div class="awsm-chip">SQS<div class="awsm-tt"><b>Fila de mensagens gerenciada</b>Standard (at-least-once, ordem não garantida) e FIFO (exactly-once, ordenada). DLQ para mensagens com falha. Visibility timeout.<span class="use">Usar quando: desacoplar produtor de consumidor, processamento assíncrono, retry automático.</span></div></div>
      <div class="awsm-chip">SNS<div class="awsm-tt"><b>Pub/sub gerenciado</b>Tópico → múltiplos subscribers (SQS, Lambda, HTTP, email, SMS). Fan-out pattern. Message filtering.<span class="use">Usar quando: notificar múltiplos consumidores de um evento, fan-out de eventos.</span></div></div>
      <div class="awsm-chip">EventBridge<div class="awsm-tt"><b>Event bus serverless</b>Regras de roteamento com filtros avançados. Integra com 200+ serviços AWS e SaaS (Stripe, GitHub, Zendesk). Schema registry.<span class="use">Usar quando: arquitetura event-driven, integrar SaaS com AWS, regras de negócio baseadas em eventos.</span></div></div>
    </div>
  </div>
</div>`,
        caption: "Cada camada tem serviços com tradeoffs diferentes. Em entrevista: não memorize APIs — entenda quando usar cada um e por quê.",
      },
      {
        title: "Arquitetura 3-tier bem arquitetada na AWS",
        html: `<style>
.aws3t-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.aws3t-tip{position:relative;cursor:help}
.aws3t-tip:hover .aws3t-tb{display:block}
.aws3t-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:50;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 6px 24px rgba(0,0,0,.9)}
.aws3t-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.aws3t-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:8px 12px;text-align:center;font-size:10px}
.aws3t-arr{color:#475569;font-size:13px;display:flex;align-items:center;justify-content:center;padding:0 3px;flex-shrink:0}
.aws3t-zone{border:1px dashed;border-radius:10px;padding:10px 12px;margin-bottom:10px}
.aws3t-zone-title{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px}
.aws3t-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
</style>
<div class="aws3t-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Arquitetura 3-tier bem arquitetada na AWS</p>
  <p style="color:#475569;font-size:10px;margin:0 0 14px">Passe o mouse nos componentes para ver detalhes de cada camada</p>

  <!-- Internet -->
  <div class="aws3t-row" style="justify-content:center;margin-bottom:8px">
    <div class="aws3t-box" style="border-color:#3b82f6;color:#3b82f6;min-width:80px">
      <div style="font-size:16px">🌐</div>
      <div>Internet</div>
    </div>
    <div class="aws3t-arr">↓</div>
    <div class="aws3t-box aws3t-tip" style="border-color:#FF9900;color:#FF9900;min-width:100px">
      Route 53
      <div style="font-size:9px;color:#64748b">DNS + Health Checks</div>
      <div class="aws3t-tb"><b style="color:#e2e8f0;display:block;margin-bottom:3px">Route 53</b>DNS com failover automático. Weighted routing para canary deploys. Latency-based routing para global. Health checks testam o ALB.</div>
    </div>
    <div class="aws3t-arr">↓</div>
    <div class="aws3t-box aws3t-tip" style="border-color:#FF9900;color:#FF9900;min-width:100px">
      CloudFront
      <div style="font-size:9px;color:#64748b">CDN + WAF + TLS</div>
      <div class="aws3t-tb"><b style="color:#e2e8f0;display:block;margin-bottom:3px">CloudFront</b>Cache de assets estáticos do S3. WAF integrado bloqueia ataques. TLS terminado no edge. Reduz latência global e custo de egress.</div>
    </div>
  </div>

  <!-- VPC -->
  <div class="aws3t-zone" style="border-color:rgba(59,130,246,.3)">
    <div class="aws3t-zone-title" style="color:#3b82f6">VPC — rede privada isolada (ex: 10.0.0.0/16)</div>

    <!-- Subnet pública -->
    <div class="aws3t-zone" style="border-color:rgba(74,222,128,.3);margin-bottom:8px">
      <div class="aws3t-zone-title" style="color:#4ade80">Subnets públicas (2 AZs) — 10.0.1.0/24, 10.0.2.0/24</div>
      <div class="aws3t-row" style="justify-content:center">
        <div class="aws3t-box aws3t-tip" style="border-color:#4ade80;color:#4ade80;flex:1;max-width:180px">
          ALB
          <div style="font-size:9px;color:#64748b">Application Load Balancer</div>
          <div class="aws3t-tb"><b style="color:#e2e8f0;display:block;margin-bottom:3px">ALB em múltiplas AZs</b>L7 load balancer. Roteamento por path/host. Health check em /health. Distribui entre instâncias ECS nas 2 AZs. Sticky sessions opcionais.</div>
        </div>
        <div class="aws3t-arr">↔</div>
        <div class="aws3t-box aws3t-tip" style="border-color:#4ade80;color:#4ade80;flex:1;max-width:180px">
          NAT Gateway
          <div style="font-size:9px;color:#64748b">saída para internet</div>
          <div class="aws3t-tb"><b style="color:#e2e8f0;display:block;margin-bottom:3px">NAT Gateway</b>Permite que recursos em subnets privadas acessem a internet (ex: baixar pacotes, chamar APIs externas) sem receber conexões de entrada. Um por AZ para HA.</div>
        </div>
      </div>
    </div>

    <!-- Subnet privada — app -->
    <div class="aws3t-zone" style="border-color:rgba(168,85,247,.3);margin-bottom:8px">
      <div class="aws3t-zone-title" style="color:#a855f7">Subnets privadas — camada de aplicação (10.0.3.0/24, 10.0.4.0/24)</div>
      <div class="aws3t-row" style="justify-content:center">
        <div class="aws3t-box aws3t-tip" style="border-color:#a855f7;color:#a855f7;flex:1;max-width:130px">
          ECS Fargate
          <div style="font-size:9px;color:#64748b">AZ-1</div>
          <div class="aws3t-tb"><b style="color:#e2e8f0;display:block;margin-bottom:3px">ECS / Fargate</b>Containers sem gerenciar EC2. Auto Scaling por CPU/memória/req. Sem acesso direto da internet. Acessa DB via Security Group específico.</div>
        </div>
        <div class="aws3t-arr">+</div>
        <div class="aws3t-box aws3t-tip" style="border-color:#a855f7;color:#a855f7;flex:1;max-width:130px">
          ECS Fargate
          <div style="font-size:9px;color:#64748b">AZ-2</div>
          <div class="aws3t-tb"><b style="color:#e2e8f0;display:block;margin-bottom:3px">Multi-AZ obrigatório</b>Se uma AZ cair, o ALB redireciona todo o tráfego para a AZ saudável automaticamente. Minimum 1 task por AZ para HA real.</div>
        </div>
        <div class="aws3t-arr">↔</div>
        <div class="aws3t-box aws3t-tip" style="border-color:#f59e0b;color:#f59e0b;flex:1;max-width:130px">
          ElastiCache
          <div style="font-size:9px;color:#64748b">Redis cluster</div>
          <div class="aws3t-tb"><b style="color:#e2e8f0;display:block;margin-bottom:3px">ElastiCache Redis</b>Sessões de usuário, cache de queries frequentes, rate limiting, pub/sub. Replica em 2 AZs. Latência <1ms para ECS na mesma VPC.</div>
        </div>
      </div>
    </div>

    <!-- Subnet privada — dados -->
    <div class="aws3t-zone" style="border-color:rgba(239,68,68,.3);margin-bottom:0">
      <div class="aws3t-zone-title" style="color:#ef4444">Subnets privadas — camada de dados (10.0.5.0/24, 10.0.6.0/24)</div>
      <div class="aws3t-row" style="justify-content:center">
        <div class="aws3t-box aws3t-tip" style="border-color:#ef4444;color:#ef4444;flex:1;max-width:160px">
          RDS Aurora
          <div style="font-size:9px;color:#64748b">Primary (AZ-1)</div>
          <div class="aws3t-tb"><b style="color:#e2e8f0;display:block;margin-bottom:3px">RDS Multi-AZ</b>Primary em AZ-1, Standby em AZ-2. Failover automático em ~30s. Backups automáticos para S3. Encryption at rest com KMS.</div>
        </div>
        <div class="aws3t-arr">⇄</div>
        <div class="aws3t-box aws3t-tip" style="border-color:#ef4444;color:#ef4444;flex:1;max-width:160px">
          RDS Aurora
          <div style="font-size:9px;color:#64748b">Standby (AZ-2)</div>
          <div class="aws3t-tb"><b style="color:#e2e8f0;display:block;margin-bottom:3px">Standby automático</b>Replica síncrona do primary. Assume automaticamente em caso de falha — zero intervenção manual. Read Replicas opcionais para escalar leituras.</div>
        </div>
        <div class="aws3t-arr">↔</div>
        <div class="aws3t-box aws3t-tip" style="border-color:#FF9900;color:#FF9900;flex:1;max-width:130px">
          S3
          <div style="font-size:9px;color:#64748b">assets + backups</div>
          <div class="aws3t-tb"><b style="color:#e2e8f0;display:block;margin-bottom:3px">S3 via VPC Endpoint</b>Acesso ao S3 sem sair da VPC (sem NAT Gateway). VPC Endpoint Gateway gratuito. Versioning ativo. Lifecycle para Glacier após 90 dias.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Observabilidade -->
  <div style="background:#1e293b;border-radius:8px;padding:10px 12px;margin-top:8px">
    <div style="font-size:9px;color:#3b82f6;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:6px">Observabilidade transversal</div>
    <div class="aws3t-row">
      <div class="aws3t-box aws3t-tip" style="flex:1">CloudWatch Logs + Métricas<div class="aws3t-tb">Logs centralizados de ECS, RDS, Lambda. Alarmes de CPU, erros 5xx, latência. Dashboard de saúde da aplicação.</div></div>
      <div class="aws3t-box aws3t-tip" style="flex:1">X-Ray Tracing<div class="aws3t-tb">Trace distribuído de cada request: ALB → ECS → ElastiCache → RDS. Identifica onde está o gargalo de latência.</div></div>
      <div class="aws3t-box aws3t-tip" style="flex:1">Secrets Manager<div class="awsm-tb" style="display:none"></div><div class="aws3t-tb">DB password e API keys fora do código. Rotação automática a cada 30 dias. ECS injeta como env var no container.</div></div>
    </div>
  </div>
</div>`,
        caption: "Esta arquitetura cobre os pilares de Segurança (subnets privadas, SGs, KMS), Confiabilidade (Multi-AZ), Performance (ElastiCache, CloudFront) e Custo (Fargate paga só pelo uso). É o padrão mínimo para produção.",
      },
      {
        title: "Well-Architected Framework — 6 pilares com práticas chave",
        html: `<style>
.awswaf-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.awswaf-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
@media(max-width:600px){.awswaf-grid{grid-template-columns:1fr 1fr}}
.awswaf-card{background:#1e293b;border-radius:10px;padding:12px 14px;border-top:3px solid}
.awswaf-title{font-size:10.5px;font-weight:700;margin-bottom:8px}
.awswaf-items{list-style:none;padding:0;margin:0}
.awswaf-items li{font-size:9.5px;color:#64748b;padding:3px 0;border-bottom:1px solid #0f172a;line-height:1.5}
.awswaf-items li:last-child{border-bottom:none}
.awswaf-items li::before{content:'▸ ';color:#475569}
.awswaf-badge{display:inline-block;font-size:8px;letter-spacing:.08em;font-weight:700;padding:1px 5px;border-radius:3px;margin-bottom:6px;text-transform:uppercase}
</style>
<div class="awswaf-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Well-Architected Framework — 6 Pilares</p>
  <p style="color:#475569;font-size:10px;margin:0 0 14px">Framework da AWS para avaliar e melhorar arquiteturas de cloud</p>
  <div class="awswaf-grid">
    <div class="awswaf-card" style="border-color:#3b82f6">
      <div class="awswaf-badge" style="background:rgba(59,130,246,.15);color:#3b82f6">Pilar 1</div>
      <div class="awswaf-title" style="color:#3b82f6">Operational Excellence</div>
      <ul class="awswaf-items">
        <li>Tudo como código (IaC + config)</li>
        <li>Deploy frequente e pequeno</li>
        <li>Observabilidade: logs, métricas, traces</li>
        <li>Runbooks e playbooks documentados</li>
        <li>Reversão automatizada (rollback)</li>
        <li>GameDays para testar resiliência</li>
      </ul>
    </div>
    <div class="awswaf-card" style="border-color:#ef4444">
      <div class="awswaf-badge" style="background:rgba(239,68,68,.15);color:#ef4444">Pilar 2</div>
      <div class="awswaf-title" style="color:#ef4444">Security</div>
      <ul class="awswaf-items">
        <li>IAM least privilege — nunca root</li>
        <li>MFA em todas as contas humanas</li>
        <li>Criptografia em repouso (KMS) e trânsito (TLS)</li>
        <li>GuardDuty + Security Hub ativados</li>
        <li>VPC endpoints — sem tráfego na internet</li>
        <li>Secrets Manager — zero hardcode</li>
      </ul>
    </div>
    <div class="awswaf-card" style="border-color:#4ade80">
      <div class="awswaf-badge" style="background:rgba(74,222,128,.15);color:#4ade80">Pilar 3</div>
      <div class="awswaf-title" style="color:#4ade80">Reliability</div>
      <ul class="awswaf-items">
        <li>Multi-AZ para todo serviço crítico</li>
        <li>Circuit breakers e retries com backoff</li>
        <li>Backups testados e automatizados</li>
        <li>RTO e RPO definidos por serviço</li>
        <li>Chaos engineering (Fault Injection)</li>
        <li>Health checks e auto-healing</li>
      </ul>
    </div>
    <div class="awswaf-card" style="border-color:#f59e0b">
      <div class="awswaf-badge" style="background:rgba(245,158,11,.15);color:#f59e0b">Pilar 4</div>
      <div class="awswaf-title" style="color:#f59e0b">Performance Efficiency</div>
      <ul class="awswaf-items">
        <li>Tipo de instância/serviço certo para o workload</li>
        <li>Caching em múltiplas camadas (CDN, Redis)</li>
        <li>Graviton (ARM) — 20-40% mais barato/eficiente</li>
        <li>Serverless quando adequado (escala automática)</li>
        <li>Benchmarking antes de otimizar</li>
        <li>Global Accelerator para latência internacional</li>
      </ul>
    </div>
    <div class="awswaf-card" style="border-color:#a855f7">
      <div class="awswaf-badge" style="background:rgba(168,85,247,.15);color:#a855f7">Pilar 5</div>
      <div class="awswaf-title" style="color:#a855f7">Cost Optimization</div>
      <ul class="awswaf-items">
        <li>Savings Plans para baseline previsível</li>
        <li>Spot Instances para batch/CI/ML</li>
        <li>Desligar ambientes não-prod fora do horário</li>
        <li>Rightsizing com Compute Optimizer</li>
        <li>CloudFront reduz egress do S3</li>
        <li>Lifecycle policies no S3 para Glacier</li>
      </ul>
    </div>
    <div class="awswaf-card" style="border-color:#06b6d4">
      <div class="awswaf-badge" style="background:rgba(6,182,212,.15);color:#06b6d4">Pilar 6</div>
      <div class="awswaf-title" style="color:#06b6d4">Sustainability</div>
      <ul class="awswaf-items">
        <li>Serverless reduz infraestrutura ociosa</li>
        <li>Graviton: ARM usa menos energia</li>
        <li>Rightsizing elimina capacidade desperdiçada</li>
        <li>Regiões com energia renovável quando possível</li>
        <li>Data tiering — Glacier para dados frios</li>
        <li>Auto Scaling — zero instâncias em carga zero</li>
      </ul>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:10px 14px;margin-top:10px;font-size:10px;color:#64748b;border-left:3px solid #FF9900">
    <strong style="color:#FF9900">Como usar em entrevista:</strong> quando perguntarem sobre decisões de arquitetura, enquadre sua resposta nos pilares relevantes. Ex: "Escolhi Multi-AZ para o RDS porque é o pilar de Reliability, e ElastiCache para Performance Efficiency reduzindo latência de leituras."
  </div>
</div>`,
        caption: "O Well-Architected Framework é a linguagem comum de arquitetura AWS. Saber enquadrar decisões técnicas nesses pilares é o que separa sênior de pleno em entrevistas de design de sistemas.",
      },
    ],
    keypoints: [
      {
        title: "IAM — identidade e acesso",
        body: "IAM é a fundação de segurança de toda arquitetura AWS. Users têm credenciais de longo prazo (evite para serviços — use roles). Roles têm credenciais temporárias via STS — sempre prefira para EC2, Lambda, ECS. Policies são documentos JSON que definem Allow/Deny em Actions, Resources e Conditions. Dois tipos: identity-based (attached a user/role) e resource-based (attached ao recurso, ex: S3 bucket policy). Princípio do menor privilégio: comece com zero, adicione só o necessário.",
        code: `// IAM Policy para Lambda acessar S3 (least privilege)
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::meu-bucket/uploads/*"
    }
  ]
}

// Trust policy da role — quem pode assumir
{
  "Principal": { "Service": "lambda.amazonaws.com" },
  "Action": "sts:AssumeRole"
}`,
      },
      {
        title: "VPC — rede isolada",
        body: "VPC é a rede virtual onde seus recursos vivem. Subnets públicas têm rota para Internet Gateway (tráfego de entrada/saída). Subnets privadas não têm Internet Gateway — recursos só acessam a internet via NAT Gateway (saída apenas). Security Groups são firewalls stateful por instância: você define regras de entrada (inbound) e saída (outbound) — respostas são automáticas. NACLs são stateless e aplicam em subnet. Regra de ouro: banco de dados e ECS em subnets privadas, ALB em subnet pública.",
        code: `# CIDR típico de VPC 3-tier
VPC: 10.0.0.0/16

# Subnets públicas (ALB, NAT Gateway)
10.0.1.0/24  — AZ us-east-1a
10.0.2.0/24  — AZ us-east-1b

# Subnets privadas — aplicação (ECS/EC2)
10.0.3.0/24  — AZ us-east-1a
10.0.4.0/24  — AZ us-east-1b

# Subnets privadas — dados (RDS, ElastiCache)
10.0.5.0/24  — AZ us-east-1a
10.0.6.0/24  — AZ us-east-1b

# Security Group: ECS → RDS
# Inbound no SG do RDS: Port 5432, Source: SG do ECS
# Nenhuma outra fonte pode acessar o banco`,
      },
      {
        title: "EC2 e Auto Scaling",
        body: "EC2 fornece VMs com controle total. Famílias: t-série (burstable, dev/test), m-série (uso geral), c-série (compute-intensive), r-série (memory-intensive — DBs in-memory), g/p-série (GPU — ML). Auto Scaling Group (ASG) mantém número desejado de instâncias e escala baseado em métricas do CloudWatch. Launch Template define AMI, tipo, user data, IAM role, security groups. Estratégia de custo: baseline em Savings Plans, escala em Spot (batch/CI) ou On-Demand (picos críticos).",
        code: `# CLI: listar instâncias rodando
aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" \
  --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,PublicIpAddress]' \
  --output table

# User Data (bootstrap script — roda no primeiro boot)
#!/bin/bash
yum update -y
yum install -y docker
systemctl start docker
docker run -d -p 80:3000 minha-imagem:latest

# ARN format de instância
arn:aws:ec2:us-east-1:123456789012:instance/i-0abc123def456789`,
      },
      {
        title: "S3 — object storage",
        body: "S3 armazena objetos em buckets — qualquer arquivo, qualquer tamanho, escala infinita, 11 noves de durabilidade. Classes de storage: Standard (acesso frequente), Standard-IA (acesso infrequente, paga por retrieval), Glacier Instant (arquivamento com acesso em ms), Deep Archive (mais barato, retrieval em 12-48h). Pre-signed URLs permitem upload/download temporário sem expor credenciais. Lifecycle policies automatizam transição entre classes. Block Public Access: ativar sempre na conta.",
        code: `# AWS CLI — operações básicas
aws s3 ls s3://meu-bucket/
aws s3 cp arquivo.txt s3://meu-bucket/uploads/
aws s3 sync ./dist s3://meu-bucket/static/ --delete

# Gerar pre-signed URL para download (válida por 1h)
aws s3 presign s3://meu-bucket/arquivo.pdf --expires-in 3600

# Lifecycle policy (JSON) — mover para Glacier após 90 dias
{
  "Rules": [{
    "Status": "Enabled",
    "Transitions": [
      {"Days": 30, "StorageClass": "STANDARD_IA"},
      {"Days": 90, "StorageClass": "GLACIER"}
    ],
    "Expiration": {"Days": 365}
  }]
}`,
      },
      {
        title: "RDS e Aurora — bancos relacionais gerenciados",
        body: "RDS gerencia instâncias de PostgreSQL, MySQL, Aurora, Oracle, SQL Server. AWS cuida de patching, backups automáticos (até 35 dias de retention), failover Multi-AZ. Aurora é compatível com PostgreSQL/MySQL mas 5× mais rápido — storage distribuído que replica em 6 cópias em 3 AZs. Aurora Serverless v2 escala de 0.5 ACU para 128 ACU em segundos. RDS Proxy faz connection pooling — crítico quando Lambda ou ECS escala para centenas de instâncias simultâneas.",
        code: `# Multi-AZ: failover automático em ~30-60 segundos
# Read Replica: leituras escalam horizontalmente

# Connection string típica (via Secrets Manager)
postgres://user:pass@meu-rds.cluster-xxxx.us-east-1.rds.amazonaws.com:5432/db

# RDS Proxy — sem esgotar conexões quando Lambda escala
postgres://user:pass@meu-rds-proxy.proxy-xxxx.us-east-1.rds.amazonaws.com:5432/db

# Snapshot manual (backup point-in-time)
aws rds create-db-snapshot \
  --db-instance-identifier meu-rds \
  --db-snapshot-identifier backup-$(date +%Y%m%d)`,
      },
      {
        title: "Lambda — serverless event-driven",
        body: "Lambda executa código em resposta a eventos sem gerenciar servidores. Paga por invocação e duração (granularidade de 1ms). Limites: 15 min máx, 10 GB RAM, 512 MB /tmp. Cold start: primeira invocação inicializa o runtime (100ms–1s). Mitigação: Provisioned Concurrency (mantém instâncias quentes), minimize tamanho do pacote, prefira Node.js/Python. Inicialize conexões e SDKs fora do handler — reutilizadas entre invocações quentes.",
        code: `// Handler Node.js — SDK inicializado fora do handler (warm reuse)
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

// inicializado UMA VEZ — reutilizado em invocações quentes
const dynamo = new DynamoDBClient({ region: 'us-east-1' })

export const handler = async (event: any) => {
  // event vem do trigger (API GW, SQS, S3, EventBridge, etc.)
  await dynamo.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: { id: { S: event.id }, data: { S: JSON.stringify(event) } }
  }))
  return { statusCode: 200, body: 'ok' }
}`,
      },
      {
        title: "CloudWatch — observabilidade",
        body: "CloudWatch é a plataforma de observabilidade nativa da AWS. Métricas: coletadas automaticamente de todos os serviços (CPU, memória, req count, erros). Logs: Log Groups centralizam logs de Lambda, ECS, EC2, RDS. Alarmes: notificam via SNS ou executam ações automáticas (scaling, recuperação). Insights: queries SQL sobre logs estruturados. X-Ray complementa com tracing distribuído. CloudTrail audita toda chamada de API na conta.",
        code: `# Criar alarme de billing (nunca esquecer isso!)
aws cloudwatch put-metric-alarm \
  --alarm-name billing-alert-100 \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 86400 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:123456789:billing-alerts \
  --dimensions Name=Currency,Value=USD

# Query CloudWatch Logs Insights — erros das últimas 1h
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 50`,
      },
      {
        title: "SQS e SNS — mensageria",
        body: "SQS é uma fila gerenciada que desacopla produtor de consumidor. Standard Queue: at-least-once, ordem não garantida, escala ilimitada. FIFO Queue: exactly-once, ordenada, até 3.000 msg/s. Visibility timeout: mensagem fica invisível enquanto sendo processada — se o worker morrer, reaparece. DLQ (Dead Letter Queue): mensagens que falharam N vezes vão para análise. SNS é pub/sub: um tópico notifica múltiplos subscribers (SQS, Lambda, HTTP, email) — fan-out pattern.",
        code: `// Fan-out pattern: SNS → múltiplos SQS
// 1 evento de upload → 2 processamentos paralelos

SNS Topic: novo-arquivo-upload
  ├── SQS: fila-gerar-thumbnail    → Lambda redimensiona imagem
  └── SQS: fila-extrair-metadata  → Lambda extrai EXIF/metadata

// Enviar para SQS (Node.js)
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
const sqs = new SQSClient({ region: 'us-east-1' })
await sqs.send(new SendMessageCommand({
  QueueUrl: process.env.QUEUE_URL,
  MessageBody: JSON.stringify({ orderId: '123', total: 99.90 }),
  MessageGroupId: 'orders',  // FIFO: agrupa por cliente
}))`,
      },
      {
        title: "Precificação e otimização de custo",
        body: "Os 4 modelos de cobrança de EC2: On-Demand (sem compromisso, mais caro), Savings Plans (compromisso de $/h por 1-3 anos, até 66% desconto, flexível), Reserved Instances (instância específica, até 72% desconto), Spot (capacidade ociosa, 90% desconto, interruptível com 2 min). Armadilhas mais comuns: egress de dados (cobrado por GB saindo da AWS), NAT Gateway (cobrado por GB processado + hora), instâncias paradas com EBS rodando, snapshots acumulados, CloudWatch Logs sem política de retenção.",
        code: `# Custo oculto: NAT Gateway
# Cada GB que passa pelo NAT Gateway custa ~$0.045
# 1 TB/mês = ~$45 SÓ de processamento
# Solução: VPC Endpoints para S3/DynamoDB/outros serviços AWS
# (tráfego não passa pelo NAT Gateway, é gratuito)

# Comandos de diagnóstico de custo
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE

# Compute Optimizer — rightsizing automático
aws compute-optimizer get-ec2-instance-recommendations \
  --filters name=FindingReasonCodes,values=CPUUnderprovisioned`,
      },
      {
        title: "CDK — IaC em TypeScript",
        body: "AWS CDK (Cloud Development Kit) permite definir infraestrutura em TypeScript, Python, Go ou Java — compila para CloudFormation. Vantagem sobre YAML/JSON: loops, condicionais, abstrações com tipos, testes com Jest. Constructs são as unidades: L1 (CloudFormation direto), L2 (abstrações de alto nível — a maioria do uso), L3 (patterns prontos, ex: ApplicationLoadBalancedFargateService). cdk synth gera o CloudFormation, cdk deploy provisiona.",
        code: `import * as cdk from 'aws-cdk-lib'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns'

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id)

    // L3 Construct: ALB + ECS Fargate + Auto Scaling em ~10 linhas
    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'Api', {
      cluster: new ecs.Cluster(this, 'Cluster'),
      cpu: 256,
      memoryLimitMiB: 512,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset('./app'),
        environment: { NODE_ENV: 'production' },
      },
      publicLoadBalancer: true,
    })

    // Auto Scaling baseado em CPU
    service.scalableTaskCount.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 60,
    })
  }
}`,
      },
      {
        title: "Segurança — práticas essenciais",
        body: "Nunca use root para operações do dia a dia — crie usuários IAM com MFA. Nunca coloque credenciais em código — use roles IAM (para EC2/Lambda/ECS) ou Secrets Manager. Security Groups: prefira referenciar outros SGs pelo ID em vez de CIDRs (ex: 'permitir acesso do SG do ECS'). Habilite CloudTrail em todas as regiões. GuardDuty detecta IPs maliciosos, mineração de crypto, exfiltração de dados. AWS Config monitora conformidade de configuração continuamente.",
        code: `# Verificar se MFA está ativo para todos os usuários
aws iam get-account-summary
aws iam list-users --query 'Users[*].UserName'
aws iam list-mfa-devices --user-name usuario

# Verificar S3 buckets com acesso público
aws s3api list-buckets --query 'Buckets[*].Name' | \
  xargs -I {} aws s3api get-bucket-acl --bucket {}

# Verificar security groups com 0.0.0.0/0 (qualquer IP)
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName]'`,
      },
      {
        title: "ARN — Amazon Resource Name",
        body: "ARN é o identificador único global de qualquer recurso na AWS. Formato: arn:partition:service:region:account-id:resource. Usado em policies IAM para especificar a quem a permissão se aplica, em CloudFormation e CDK para referenciar recursos, e em logs/auditoria para identificar o recurso afetado.",
        code: `# Formato ARN
arn:aws:s3:::meu-bucket             # S3 (sem região/conta — global)
arn:aws:s3:::meu-bucket/uploads/*   # path dentro do bucket

arn:aws:ec2:us-east-1:123456789012:instance/i-0abc123
arn:aws:rds:us-east-1:123456789012:db:meu-postgres
arn:aws:lambda:us-east-1:123456789012:function:minha-funcao
arn:aws:iam::123456789012:role/MinhaRole   # IAM sem região
arn:aws:iam::123456789012:user/daniel

# Wildcard em Resource de policy
"Resource": "arn:aws:s3:::bucket-prod-*"  # qualquer bucket com prefixo
"Resource": "*"                             # qualquer recurso (evitar)`,
      },
    ],
    cheatsheet: {
      title: "AWS Cheatsheet — serviços, CLI e ARN",
      html: `<style>
.awscs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.awscs-h2{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#FF9900;font-weight:700;margin:16px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(255,153,0,.2)}
.awscs-h2:first-child{margin-top:0}
.awscs-table{width:100%;border-collapse:collapse;font-size:10px}
.awscs-table th{text-align:left;color:#64748b;font-weight:600;padding:4px 8px;border-bottom:1px solid #1e293b;font-size:9px;letter-spacing:.06em;text-transform:uppercase}
.awscs-table td{padding:5px 8px;border-bottom:1px solid #0f172a;color:#94a3b8;vertical-align:top;line-height:1.5}
.awscs-table tr:last-child td{border-bottom:none}
.awscs-table td:first-child{color:#e2e8f0;white-space:nowrap;font-weight:500}
.awscs-code{background:#0f172a;border-radius:6px;padding:10px 14px;font-size:10px;color:#94a3b8;line-height:2;overflow-x:auto;margin-bottom:4px}
.awscs-code .kw{color:#7c3aed}
.awscs-code .svc{color:#FF9900}
.awscs-code .flag{color:#61DAFB}
.awscs-code .val{color:#4ade80}
.awscs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
@media(max-width:500px){.awscs-grid{grid-template-columns:1fr}}
</style>
<div class="awscs-wrap">
  <p style="font-size:12px;font-weight:600;color:#e2e8f0;margin:0 0 4px">AWS Cheatsheet</p>
  <p style="font-size:10px;color:#475569;margin:0 0 14px">Referência rápida de serviços, CLI e ARN format</p>

  <div class="awscs-h2">Serviços por categoria — quando usar cada</div>
  <div class="awscs-grid">
    <div>
      <table class="awscs-table">
        <tr><th>Computação</th><th>Quando usar</th></tr>
        <tr><td>EC2</td><td>Controle total de OS, software legado, GPU</td></tr>
        <tr><td>ECS Fargate</td><td>Containers sem gerenciar EC2, carga previsível</td></tr>
        <tr><td>Lambda</td><td>Event-driven, esporádico, &lt; 15 min, escala zero</td></tr>
        <tr><td>EKS</td><td>Kubernetes, portabilidade, workloads complexos</td></tr>
      </table>
    </div>
    <div>
      <table class="awscs-table">
        <tr><th>Banco de dados</th><th>Quando usar</th></tr>
        <tr><td>RDS / Aurora</td><td>Dados relacionais, transações ACID, JOINS</td></tr>
        <tr><td>DynamoDB</td><td>Acesso por chave, escala imprevisível, IoT</td></tr>
        <tr><td>ElastiCache</td><td>Cache de queries, sessões, rate limiting</td></tr>
        <tr><td>Redshift</td><td>Data warehouse, analytics, BI sobre petabytes</td></tr>
      </table>
    </div>
    <div>
      <table class="awscs-table">
        <tr><th>Storage</th><th>Quando usar</th></tr>
        <tr><td>S3 Standard</td><td>Arquivos de acesso frequente</td></tr>
        <tr><td>S3 Standard-IA</td><td>Acesso infrequente (paga retrieval)</td></tr>
        <tr><td>S3 Glacier</td><td>Arquivamento, retenção regulatória</td></tr>
        <tr><td>EBS gp3</td><td>Disco de EC2 — padrão para uso geral</td></tr>
      </table>
    </div>
    <div>
      <table class="awscs-table">
        <tr><th>Rede</th><th>Quando usar</th></tr>
        <tr><td>ALB</td><td>HTTP/S com roteamento por path/host</td></tr>
        <tr><td>NLB</td><td>TCP/UDP, ultra-alta performance, IP fixo</td></tr>
        <tr><td>CloudFront</td><td>CDN global, WAF, reduzir egress S3</td></tr>
        <tr><td>Route 53</td><td>DNS, failover, roteamento geográfico</td></tr>
      </table>
    </div>
  </div>

  <div class="awscs-h2">CLI Commands essenciais</div>
  <div class="awscs-code">
<span class="kw"># Configurar credenciais</span>
aws configure                        <span class="kw"># interativo</span>
aws configure --profile prod         <span class="kw"># profile nomeado</span>
aws sts get-caller-identity          <span class="kw"># ver quem você é</span>

<span class="kw"># EC2</span>
aws ec2 describe-instances <span class="flag">--filters</span> <span class="val">"Name=instance-state-name,Values=running"</span>
aws ec2 start-instances <span class="flag">--instance-ids</span> i-0abc123
aws ec2 stop-instances <span class="flag">--instance-ids</span> i-0abc123

<span class="kw"># S3</span>
aws s3 ls s3://bucket/
aws s3 cp file.txt s3://bucket/path/
aws s3 sync ./dist s3://bucket/ <span class="flag">--delete</span>
aws s3 presign s3://bucket/file.pdf <span class="flag">--expires-in</span> 3600

<span class="kw"># Lambda</span>
aws lambda list-functions
aws lambda invoke <span class="flag">--function-name</span> <span class="val">minha-funcao</span> <span class="flag">--payload</span> <span class="val">'{"key":"val"}'</span> out.json
aws lambda update-function-code <span class="flag">--function-name</span> fn <span class="flag">--zip-file</span> fileb://fn.zip

<span class="kw"># CloudWatch Logs</span>
aws logs tail /aws/lambda/minha-funcao <span class="flag">--follow</span>
aws logs filter-log-events <span class="flag">--log-group-name</span> /aws/ecs/app <span class="flag">--filter-pattern</span> ERROR

<span class="kw"># IAM</span>
aws iam list-roles <span class="flag">--query</span> <span class="val">'Roles[*].RoleName'</span>
aws iam create-role <span class="flag">--role-name</span> <span class="val">MinhaRole</span> <span class="flag">--assume-role-policy-document</span> file://trust.json
aws iam attach-role-policy <span class="flag">--role-name</span> MinhaRole <span class="flag">--policy-arn</span> arn:aws:iam::aws:policy/ReadOnlyAccess
  </div>

  <div class="awscs-h2">ARN Format</div>
  <div class="awscs-code">
<span class="kw"># Formato geral</span>
arn:<span class="svc">partition</span>:<span class="svc">service</span>:<span class="svc">region</span>:<span class="svc">account-id</span>:<span class="svc">resource</span>

<span class="kw"># Exemplos</span>
arn:aws:<span class="svc">s3</span>:::meu-bucket                         <span class="kw"># S3 sem região (global)</span>
arn:aws:<span class="svc">s3</span>:::meu-bucket/uploads/*               <span class="kw"># path no bucket</span>
arn:aws:<span class="svc">ec2</span>:us-east-1:123456789012:instance/i-0abc
arn:aws:<span class="svc">rds</span>:us-east-1:123456789012:db:meu-postgres
arn:aws:<span class="svc">lambda</span>:us-east-1:123456789012:function:minha-fn
arn:aws:<span class="svc">iam</span>::123456789012:role/MinhaRole        <span class="kw"># IAM sem região</span>
arn:aws:<span class="svc">iam</span>::aws:policy/ReadOnlyAccess           <span class="kw"># policy gerenciada pela AWS</span>
arn:aws:<span class="svc">sqs</span>:us-east-1:123456789012:minha-fila
arn:aws:<span class="svc">sns</span>:us-east-1:123456789012:meu-topico
  </div>

  <div class="awscs-h2">Comparativo de precificação EC2</div>
  <table class="awscs-table">
    <tr><th>Modelo</th><th>Desconto</th><th>Compromisso</th><th>Quando usar</th></tr>
    <tr><td>On-Demand</td><td>—</td><td>Nenhum</td><td>Picos imprevisíveis, dev/test</td></tr>
    <tr><td>Savings Plans</td><td>até 66%</td><td>$/hora por 1-3 anos</td><td>Baseline previsível, flexível por tipo</td></tr>
    <tr><td>Reserved Instances</td><td>até 72%</td><td>Instância específica 1-3 anos</td><td>Baseline com tipo de instância fixo</td></tr>
    <tr><td>Spot</td><td>até 90%</td><td>Nenhum (interruptível)</td><td>Batch, CI/CD workers, ML training</td></tr>
  </table>
</div>`,
    },
    mnemonics: [
      {
        label: "CRISP — camadas de uma arquitetura AWS",
        trick: "Compute, Routing, Infra (VPC), Storage, Policies (IAM)",
        explanation: "Quando for desenhar uma arquitetura AWS do zero, pense nestas 5 camadas em ordem: o que Computa (EC2/Lambda/ECS), o que faz o Roteamento de tráfego (Route53/CloudFront/ALB), a Infraestrutura de rede (VPC/subnets/SGs), o Storage (S3/RDS/ElastiCache) e as Políticas de segurança (IAM roles, KMS, Secrets Manager).",
      },
      {
        label: "SG vs NACL — Stateful vs Stateless",
        trick: "Security Group = Stateful (S=S). NACL = Não-stateful (N=Não).",
        explanation: "Security Groups são stateful: se você permite entrada na porta 443, a resposta de saída é automática. NACLs são stateless: você precisa de regra de entrada E de saída explicitamente. Na prática, Security Groups cobrem 99% dos casos. NACLs são para regras de subnet que se aplicam a múltiplos recursos.",
      },
    ],
    gotchas: [
      "Usar a conta root para operações do dia a dia — a conta root tem acesso irrestrito a tudo, incluindo fechar a conta e deletar billing. Crie um usuário IAM com MFA desde o primeiro dia.",
      "Credenciais hardcoded no código — aws_access_key_id e aws_secret_access_key no repositório é um dos vetores de ataque mais comuns. Use roles IAM para EC2/Lambda/ECS.",
      "Security Group com 0.0.0.0/0 em portas de banco — RDS na porta 5432 aberta para qualquer IP é um desastre de segurança. SG do banco deve aceitar apenas do SG da aplicação.",
      "Sem Multi-AZ em produção — uma AZ pode falhar. RDS, ElastiCache e ECS devem ter réplicas em pelo menos 2 AZs.",
      "Sem tagging de recursos — sem tags, você não consegue filtrar custo por projeto/ambiente no Cost Explorer, não consegue automatizar limpeza de recursos, e não consegue aplicar políticas IAM baseadas em tags.",
      "Egress de dados ignorado no orçamento — transferência para fora da AWS é cobrada por GB. Uma aplicação com muito download de S3 pode ter custo de egress maior que de computação. Solução: CloudFront.",
      "NAT Gateway em cada AZ esquecido no custo — NAT Gateway cobra por hora ($0.045) + por GB processado ($0.045). 2 NAT Gateways (multi-AZ) + tráfego alto = custo considerável. Use VPC Endpoints para serviços AWS.",
      "Snapshots EBS acumulados indefinidamente — cada snapshot ocupa storage e custa. Implemente política de retenção com Data Lifecycle Manager.",
    ],
    interview: [
      {
        q: "Qual a diferença entre IAM Role e IAM User? Quando usar cada?",
        a: "<p><strong>IAM User:</strong> identidade permanente com credenciais de longo prazo (access key + secret). Criado para pessoas humanas ou aplicações legadas que não suportam roles. Credenciais de longo prazo são risco de segurança — se vazar, persiste até ser revogada manualmente.</p><p><strong>IAM Role:</strong> identidade assumível com credenciais temporárias (STS, válidas por 1h-12h). Nenhum usuário ou senha permanente. EC2, Lambda, ECS Tasks, CodeBuild — todos usam roles para acessar serviços AWS sem credenciais hardcoded.</p><p>Regra: use User para humanos com console/MFA. Use Role para qualquer serviço ou aplicação. Nunca coloque credenciais de User em código ou variáveis de ambiente de produção.</p>",
        tip: "Mencione o AssumeRole: mesmo um humano pode assumir uma role temporariamente para acessar produção com auditoria.",
        level: "pleno",
      },
      {
        q: "Como desenharia a VPC para uma aplicação 3-tier em produção?",
        a: "<p>VPC com CIDR /16 (ex: 10.0.0.0/16) em pelo menos 2 AZs. Três camadas de subnets:</p><p><strong>Subnets públicas:</strong> ALB e NAT Gateway. Têm Internet Gateway. Nenhuma instância de aplicação aqui.</p><p><strong>Subnets privadas — app:</strong> ECS/EC2. Sem acesso direto da internet. Saída via NAT Gateway. Security Group: aceita do ALB na porta da aplicação.</p><p><strong>Subnets privadas — dados:</strong> RDS, ElastiCache. Security Group do RDS: aceita APENAS do SG da aplicação na porta 5432. Zero acesso externo.</p><p>VPC Endpoints para S3 e DynamoDB (tráfego não passa pelo NAT Gateway — gratuito e mais seguro). CloudWatch Logs Endpoints para enviar logs sem NAT.</p>",
        level: "pleno",
      },
      {
        q: "O que é Lambda cold start e como mitigar em produção?",
        a: "<p>Cold start ocorre quando Lambda precisa inicializar um novo execution environment: baixar o código, inicializar o runtime (Node.js, Python, JVM), executar código fora do handler. Adiciona 100ms a 1s+ de latência.</p><p><strong>Quando ocorre:</strong> primeiro request após deploy, após períodos de inatividade (~15 min), quando há burst de concorrência acima das instâncias quentes disponíveis.</p><p><strong>Mitigações:</strong> (1) <strong>Provisioned Concurrency</strong>: mantém N instâncias sempre quentes — elimina cold start, tem custo fixo por hora. (2) <strong>Minimize o pacote</strong>: use bundler (esbuild) — menos código = boot mais rápido. (3) <strong>Node.js ou Python</strong> em vez de Java/.NET — JVM tem cold start 5-10× maior. (4) <strong>Inicialização fora do handler</strong>: SDK clients, DB connections, config — reutilizados em invocações quentes.</p>",
        tip: "Lambda SnapStart (para Java) é uma nova opção que reduz cold start de JVM capturando e restaurando um snapshot do estado inicializado.",
        level: "pleno",
      },
      {
        q: "RDS vs Aurora vs DynamoDB — quando usar cada?",
        a: "<p><strong>RDS (PostgreSQL/MySQL):</strong> quando você precisa de SQL completo, transações ACID, JOINS complexos, schema definido. Workloads OLTP tradicionais. Mais simples de operar que Aurora para cargas menores.</p><p><strong>Aurora:</strong> quando você precisa de PostgreSQL/MySQL com alta performance (5× mais rápido), HA nativa (6 cópias em 3 AZs), aurora Serverless v2 para carga variável, ou Global Database para multi-region. O custo é maior — justificado a partir de workloads exigentes.</p><p><strong>DynamoDB:</strong> quando o acesso é sempre por chave (sem JOINS), a escala é imprevisível (serverless autoescala de 0 a milhões de req/s), latência de milissegundos é requisito, ou o modelo de dados é flexível (documento). Gaming, IoT, catálogos de produto, carrinho de compras.</p>",
        level: "pleno",
      },
      {
        q: "Como o S3 garante consistência? O que mudou em 2020?",
        a: "<p>Antes de dezembro de 2020: S3 era <em>eventually consistent</em> para sobrescritas e deletes. Um objeto recém-sobrescrito podia retornar a versão antiga por segundos. Isso obrigava aplicações a adicionar lógica de retry e delays.</p><p>A partir de dezembro de 2020: S3 passou a oferecer <strong>strong read-after-write consistency</strong> para todas as operações (GET, PUT, DELETE, LIST) sem custo adicional. Após uma escrita confirmada, qualquer leitura subsequente retorna o valor mais recente — sem exceção.</p><p>Impacto prático: pipelines de dados que antes precisavam de sleeps ou retries para ver objetos recém-criados funcionam agora sem isso. LIST também é consistente — você vê todos os objetos imediatamente após upload.</p>",
        level: "pleno",
      },
      {
        q: "Como implementaria CI/CD com CodePipeline + ECS na AWS?",
        a: "<p>Pipeline com 4 stages:</p><p><strong>Source:</strong> GitHub → CodeStar Connection (webhook). Qualquer push na branch main dispara o pipeline.</p><p><strong>Build:</strong> CodeBuild roda <code>docker build</code>, testa, faz <code>docker push</code> para ECR. Gera <code>imagedefinitions.json</code> com a nova tag da imagem.</p><p><strong>Test:</strong> CodeBuild roda testes de integração contra ambiente de staging (opcional).</p><p><strong>Deploy:</strong> CodeDeploy + ECS faz rolling update (ou blue/green com 2 target groups no ALB). Rollback automático se health check falhar.</p><p>Secrets no CodeBuild via Secrets Manager — sem credenciais no buildspec.yml. IAM Role do CodeBuild com permissão mínima: só ECR push + ECS update.</p>",
        level: "senior",
      },
      {
        q: "Explique os 6 pilares do Well-Architected Framework com exemplos práticos.",
        a: "<p><strong>Operational Excellence:</strong> deploy via CDK/Terraform (IaC), alertas automáticos no CloudWatch, runbook documentado para cada tipo de incidente.</p><p><strong>Security:</strong> IAM least privilege, nenhuma credencial hardcoded (Secrets Manager), GuardDuty ativado, VPC com subnets privadas para dados.</p><p><strong>Reliability:</strong> RDS Multi-AZ, ECS em 2 AZs, Circuit Breaker com retry exponencial, backups testados mensalmente com restore em ambiente separado.</p><p><strong>Performance Efficiency:</strong> ElastiCache reduz queries ao RDS, CloudFront para assets estáticos, Graviton (c7g) para compute-intensive — 20-40% mais barato com mesma performance.</p><p><strong>Cost Optimization:</strong> Savings Plans para baseline, Spot para CI/CD workers, S3 Lifecycle para mover logs para Glacier após 90 dias, Compute Optimizer para rightsizing.</p><p><strong>Sustainability:</strong> serverless onde possível (zero infraestrutura ociosa), Auto Scaling desliga instâncias desnecessárias, Graviton usa menos energia que x86.</p>",
        tip: "Em entrevistas de arquitetura, enquadrar cada decisão em um pilar demonstra maturidade — é a linguagem que arquitetos AWS sênior usam.",
        level: "senior",
      },
      {
        q: "O que é o Shared Responsibility Model e como muda por serviço?",
        a: "<p>AWS é responsável pela segurança <em>da</em> cloud: hardware físico, rede física, datacenter, hypervisor, refrigeração.</p><p>O cliente é responsável pela segurança <em>na</em> cloud: dados, criptografia, IAM, configuração de serviços, SO de EC2, patches de aplicação.</p><p>A fronteira se move com o nível de abstração:</p><p><strong>EC2:</strong> você gerencia SO, patching, firewall (SG), criptografia de disco (EBS).</p><p><strong>RDS:</strong> AWS gerencia SO e patching do banco. Você gerencia IAM, SG, criptografia e backups configurados corretamente.</p><p><strong>Lambda:</strong> AWS gerencia runtime, patching, escala. Você gerencia o código, variáveis de ambiente, IAM role da função e a lógica de segurança dentro do handler.</p><p><strong>S3:</strong> AWS gerencia a infraestrutura de storage. Você gerencia bucket policies, ACLs, criptografia, Block Public Access e lifecycle.</p>",
        level: "pleno",
      },
      {
        q: "Como otimizaria custo em uma conta AWS com $10k/mês de gastos?",
        a: "<p><strong>1. Diagnóstico:</strong> AWS Cost Explorer por serviço, por tag, por conta. Identificar os top 3 serviços por custo.</p><p><strong>2. Rightsizing:</strong> AWS Compute Optimizer analisa utilização real e sugere instâncias menores. Instâncias com CPU < 10% por semanas são candidatas.</p><p><strong>3. Savings Plans:</strong> comprometer a baseline estável (ex: $3k/mês em EC2 previsível) com Savings Plans de 1 ano — desconto de ~40%.</p><p><strong>4. Spot para workloads tolerantes:</strong> CI/CD workers, ML training, batch — 90% de desconto com interrupt handler.</p><p><strong>5. Storage tiering:</strong> S3 Lifecycle para Glacier, expirar snapshots EBS antigos, EBS gp2 → gp3 (20% mais barato).</p><p><strong>6. NAT Gateway e egress:</strong> VPC Endpoints eliminam NAT para S3/DynamoDB. CloudFront reduz egress S3.</p><p><strong>7. Ambientes não-prod:</strong> Lambda + EventBridge desliga RDS e EC2 fora do horário comercial.</p>",
        level: "senior",
      },
      {
        q: "Como garantiria alta disponibilidade para um banco RDS em produção?",
        a: "<p><strong>Multi-AZ:</strong> RDS mantém uma réplica síncrona em outra AZ. Em caso de falha da primary (hardware, rede, SO), failover automático em ~30-60 segundos — o CNAME do endpoint muda para a standby. Sem intervenção manual.</p><p><strong>Read Replicas:</strong> réplicas assíncronas para escalar leituras (até 5 para RDS, 15 para Aurora). Promovíveis a primary se necessário — DR manual.</p><p><strong>Backups:</strong> automated backups (1-35 dias de retenção, ponto no tempo). Snapshots manuais antes de mudanças críticas. Teste de restore mensalmente em ambiente separado.</p><p><strong>RDS Proxy:</strong> connection pooling — quando ECS/Lambda escala para centenas de instâncias, sem esgotar conexões do banco. Failover mais rápido (RDS Proxy detecta falha e redireciona mais rápido que DNS TTL).</p><p><strong>Monitoramento:</strong> CloudWatch alarmes em FreeableMemory, DatabaseConnections, ReadLatency. Enhanced Monitoring para métricas de OS em 1s.</p>",
        level: "senior",
      },
      {
        q: "O que é egress cost e como minimizar?",
        a: "<p>Egress = transferência de dados saindo da AWS. Cobrado por GB:</p><p>- Dentro da mesma AZ: grátis. Entre AZs: ~$0.01/GB. Entre regiões: ~$0.02/GB. Para internet: ~$0.09/GB.</p><p><strong>Armadilha clássica:</strong> S3 com muito download direto para usuários — egress S3→internet é $0.09/GB. Com 100 TB/mês = $9.000 só de egress.</p><p><strong>Mitigações:</strong></p><p><strong>CloudFront na frente do S3:</strong> CloudFront→internet é mais barato ($0.0085-0.085/GB) + cache reduz chamadas ao S3.</p><p><strong>VPC Endpoints:</strong> tráfego EC2/ECS para S3 e DynamoDB via endpoint privado — sem cobrar egress entre AZs, sem passar pelo NAT Gateway.</p><p><strong>Compressão:</strong> gzip/brotli antes de transferir reduz volume.</p><p><strong>Regional afinidade:</strong> recursos que se comunicam muito na mesma AZ — zero custo entre eles.</p>",
        level: "senior",
      },
      {
        q: "Quando usar SQS vs SNS vs EventBridge?",
        a: "<p><strong>SQS (fila):</strong> quando um consumidor (ou grupo de consumidores em paralelo) precisa processar mensagens de forma assíncrona com retry automático e DLQ. Desacopla produtor de consumidor — se o consumidor cai, as mensagens ficam na fila. Use para workloads de processamento (orders, emails, notificações, jobs).</p><p><strong>SNS (pub/sub):</strong> quando um evento precisa notificar múltiplos sistemas diferentes em paralelo (fan-out). Ex: novo pedido → SQS-estoque + SQS-faturamento + Lambda-email ao mesmo tempo.</p><p><strong>EventBridge:</strong> quando você precisa de roteamento sofisticado com filtros complexos (JSON match), integração com SaaS (Stripe, GitHub, Zendesk) ou quando quer schema registry para validação de eventos. É o mais flexível e o mais moderno — preferir para novas arquiteturas event-driven.</p><p>Padrão comum: SNS fan-out → múltiplas SQS queues (uma por consumidor), cada consumidor processa em seu próprio ritmo.</p>",
        level: "senior",
      },
      {
        q: "Como protegeria uma aplicação contra os ataques mais comuns na AWS?",
        a: "<p><strong>SQLi, XSS, bots:</strong> WAF na frente do CloudFront ou ALB com AWS Managed Rules. Rate limiting por IP para prevenir DDoS de aplicação.</p><p><strong>Vazamento de credenciais:</strong> IAM roles em vez de access keys. Secrets Manager para DB passwords. Verificar GitHub com git-secrets ou tfsec em CI.</p><p><strong>Movimento lateral:</strong> Security Groups granulares (ECS só acessa RDS na porta 5432 via SG ID). VPC Flow Logs ativados. GuardDuty detecta comunicação com IPs maliciosos.</p><p><strong>Privilege escalation:</strong> políticas IAM sem wildcard em Action ou Resource. SCPs (Service Control Policies) em AWS Organizations para impedir ações perigosas na conta.</p><p><strong>Data exfiltration:</strong> S3 Block Public Access em nível de conta. Macie para detectar dados sensíveis em S3. VPC Endpoints para evitar que dados saiam pela internet.</p>",
        level: "senior",
      },
      {
        q: "O que é RTO e RPO e como dimensionar DR na AWS?",
        a: "<p><strong>RTO (Recovery Time Objective):</strong> tempo máximo aceitável para a aplicação voltar após uma falha. Ex: RTO de 1h significa que você pode ficar 1h fora do ar.</p><p><strong>RPO (Recovery Point Objective):</strong> perda máxima de dados aceitável. Ex: RPO de 1h significa que você pode perder os dados da última hora.</p><p><strong>Estratégias de DR na AWS (custo crescente, RTO decrescente):</strong></p><p><strong>Backup & Restore (RTO hours):</strong> snapshots para S3, restore quando necessário. Mais barato, maior RTO.</p><p><strong>Pilot Light (RTO minutes):</strong> infra mínima rodando na região de DR (banco replicado), escala quando necessário.</p><p><strong>Warm Standby (RTO minutes):</strong> ambiente completo rodando em escala reduzida. Scale up rapidamente.</p><p><strong>Multi-Site Active/Active (RTO seconds):</strong> duas regiões com Route 53 failover. Mais caro, menor RTO — para aplicações críticas.</p>",
        level: "senior",
      },
      {
        q: "Como funcionam os VPC Endpoints e quando são necessários?",
        a: "<p>VPC Endpoints permitem que recursos em subnets privadas acessem serviços AWS sem tráfego sair para a internet pública (sem NAT Gateway, sem Internet Gateway).</p><p><strong>Gateway Endpoints (gratuitos):</strong> S3 e DynamoDB. Adicionam rotas na route table. Tráfego fica dentro da rede AWS.</p><p><strong>Interface Endpoints (cobrado por hora + GB):</strong> todos os outros serviços (CloudWatch, Secrets Manager, ECR, SSM, etc.). Criam uma ENI na sua subnet com IP privado.</p><p><strong>Quando são necessários:</strong></p><p>- Lambda ou ECS em VPC acessando S3/DynamoDB — sem endpoint, passa pelo NAT Gateway (cobra por GB). Com endpoint Gateway, é gratuito.</p><p>- EC2 em subnet privada acessando SSM Parameter Store ou Secrets Manager — sem endpoint, precisa de NAT ou acesso público.</p><p>- Conformidade que exige que dados nunca saiam da rede AWS (HIPAA, PCI).</p>",
        level: "senior",
      },
    ],
    resources: [
      { title: "AWS docs", url: "https://docs.aws.amazon.com/", kind: "docs" },
      { title: "AWS Well-Architected Framework", url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html", kind: "docs" },
      { title: "AWS Solutions Architect Associate (Adrian Cantrill)", url: "https://learn.cantrill.io/", kind: "curso" },
      { title: "A Cloud Guru", url: "https://acloudguru.com/", kind: "curso" },
      { title: "AWS Pricing Calculator", url: "https://calculator.aws/", kind: "pratica" },
      { title: "EC2 instances comparison (Vantage)", url: "https://instances.vantage.sh/", kind: "pratica" },
      { title: "AWS Architecture Center", url: "https://aws.amazon.com/architecture/", kind: "docs" },
    ],
  },

  "ec2": {
    tagline: "VMs escaláveis na AWS com controle total sobre OS, rede e storage.",
    why: "EC2 é o serviço de computação mais fundamental da AWS. Entender famílias de instância, storage (EBS vs Instance Store), Auto Scaling e modelos de precificação é pré-requisito para qualquer arquitetura AWS.",
    summary: "Amazon EC2 (Elastic Compute Cloud) fornece instâncias de máquinas virtuais com escolha de CPU, RAM, rede e storage. Famílias de instâncias otimizadas para diferentes workloads. EBS para storage persistente. AMI para imagem base. Security Groups para firewall. User Data para bootstrap. Auto Scaling Group para elasticidade horizontal.",
    keypoints: [
      { title: "Famílias de instância", body: "t-séries (burstable, dev/test), m-séries (uso geral), c-séries (compute-optimized — CPU intensivo), r-séries (memory-optimized — in-memory DB), i-séries (storage-optimized — NVMe local), p/g-séries (GPU — ML/rendering). Size: .nano → .48xlarge." },
      { title: "EBS vs Instance Store", body: "EBS: disco de bloco persistente, sobrevive a stop/start/terminate com snapshots. Instance Store: disco NVMe físico no host, efêmero — dados perdidos em stop ou falha. Instance Store é mais rápido (latência local), EBS é mais flexível e durável. Use Instance Store para cache, buffer, scratch — nunca para dados críticos." },
      { title: "Auto Scaling Group (ASG)", body: "Define min/max/desired de instâncias. Políticas: target tracking (manter CPU em 60%), step scaling (escala em degraus por alarme), scheduled (horário fixo). Launch Template define AMI, tipo, user data. ALB distribui tráfego e faz health checks." },
      { title: "Modelos de precificação", body: "On-demand: sem compromisso, mais caro. Reserved (1–3 anos): 30–72% desconto, instância específica. Savings Plans: compromisso de gasto por hora, mais flexível. Spot: 90% desconto, interruptível com 2 min de aviso. Use Spot para batch/CI/ML, On-demand para picos, Reserved/Savings para baseline." },
      { title: "Placement Groups", body: "Cluster: instâncias fisicamente próximas no mesmo rack — baixa latência (<10μs), HPC, ideal para MPI. Spread: instâncias em racks diferentes — máxima HA para apps críticos (limite de 7 por AZ). Partition: grupos isolados em hardware diferente — Hadoop, Cassandra, Kafka." },
      { title: "User Data e AMI baked", body: "User Data: script executado na primeira inicialização (cloud-init). Instala pacotes, configura app. AMI baked: AMI já com a aplicação instalada — boot mais rápido, ideal para ASG. Estratégia imutável: não atualiza instância em produção, recria com nova AMI." },
    ],
    diagrams: [
      {
        title: "Auto Scaling Group — fluxo de escala horizontal",
        html: `<style>
.ec2-asg{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.ec2-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:10px 14px;font-size:11px;text-align:center}
.ec2-inst{background:#1e293b;border:1.5px solid #ff9900;border-radius:8px;padding:8px 12px;font-size:11px;text-align:center;color:#ff9900;font-weight:600}
.ec2-inst.new{border-color:#4ade80;color:#4ade80;animation:ec2-pop .6s ease}
@keyframes ec2-pop{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}
.ec2-arrow{color:#475569;font-size:16px;display:flex;align-items:center;justify-content:center;padding:0 4px}
.ec2-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.ec2-label{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px}
</style>
<div class="ec2-asg">
  <div style="display:flex;gap:10px;align-items:stretch;margin-bottom:14px">
    <div style="flex:1">
      <div class="ec2-label" style="color:#ff9900">ALB (Load Balancer)</div>
      <div class="ec2-box" style="border-color:#ff9900;color:#ff9900">Application Load Balancer<br><span style="font-size:9px;color:#64748b">distribui tráfego + health checks</span></div>
    </div>
    <div class="ec2-arrow">↓</div>
    <div style="flex:2">
      <div class="ec2-label" style="color:#ff9900">Auto Scaling Group</div>
      <div style="background:#0f172a;border:1px dashed #334155;border-radius:8px;padding:10px;display:flex;gap:6px;flex-wrap:wrap">
        <div class="ec2-inst">EC2 #1</div>
        <div class="ec2-inst">EC2 #2</div>
        <div class="ec2-inst new">EC2 #3 ✦</div>
      </div>
      <div style="font-size:10px;color:#64748b;margin-top:5px">min=1 · desired=3 · max=10</div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:12px 14px;font-size:11px">
    <div class="ec2-label" style="color:#3b82f6">Gatilho de scale-out (Target Tracking)</div>
    <div class="ec2-row">
      <div class="ec2-box" style="flex:1">CloudWatch Alarm<br><span style="color:#f59e0b;font-size:10px">CPU &gt; 60% por 2 min</span></div>
      <div class="ec2-arrow">→</div>
      <div class="ec2-box" style="flex:1">ASG lança nova instância<br><span style="color:#4ade80;font-size:10px">usando Launch Template</span></div>
      <div class="ec2-arrow">→</div>
      <div class="ec2-box" style="flex:1">ALB registra após<br><span style="color:#94a3b8;font-size:10px">health check passar</span></div>
    </div>
  </div>
  <p style="font-size:10px;color:#475569;margin:10px 0 0">EC2 #3 marcado com ✦ = instância recém-lançada pelo ASG. Scale-in remove a mais recente após cooldown (300s padrão).</p>
</div>`,
        caption: "O ASG mantém o número desejado de instâncias e escala automaticamente baseado em métricas do CloudWatch. O ALB garante que só instâncias saudáveis recebam tráfego.",
      },
    ],
    gotchas: [
      "Stop vs Terminate — Stop mantém o EBS, Terminate destrói. Ative proteção contra encerramento em produção.",
      "Reservar instância do tipo errado — Reserved Instances têm baixa portabilidade. Prefira Savings Plans para flexibilidade.",
      "Security Group é stateful — resposta de conexão de saída é permitida automaticamente. NACL é stateless e exige regras de retorno.",
      "Spot Instance sem interrupt handler — aplicação não sabe que vai ser encerrada. SIGTERM chega 2 min antes. Implemente checkpoint.",
      "AMI muito antiga — patches de segurança desatualizados. Rebuilde periodicamente com pipeline de golden AMI.",
      "Conexão de banco dentro do Auto Scaling — quando ASG escala para 100 instâncias, 100 conexões abertas no RDS. Use RDS Proxy para connection pooling.",
    ],
    interview: [
      { q: "Quando usar Spot Instances?", a: "<p>Workloads tolerantes a interrupção: batch processing, CI/CD workers, treinamento de ML, rendering. <strong>Nunca</strong> para produção stateful sem estratégia de checkpointing.</p><p>Sempre implemente interrupt handler (SIGTERM) que salva estado antes dos 2 min de aviso da AWS. Combine Spot com On-demand no ASG (base On-demand, escala em Spot) para garantir capacidade mínima.</p>", level: "pleno" },
      { q: "Como desenharia Auto Scaling para uma API REST?", a: "<p>Launch Template com AMI baked (app já instalada — boot rápido). ASG em multi-AZ (pelo menos 2 AZs). Target Tracking Policy: CPUUtilization target 60% ou ALBRequestCountPerTarget.</p><p>Application Load Balancer com health check no endpoint /health. Scale-in protection para instâncias processando jobs longos. Cooldown de 300s para evitar scale-in prematuro após scale-out.</p>", level: "pleno" },
      { q: "Qual a diferença entre EBS gp2, gp3 e io2?", a: "<p><strong>gp2:</strong> IOPS vinculado ao tamanho (3 IOPS/GB, burst até 3.000). Legado — evitar em produção nova.</p><p><strong>gp3:</strong> IOPS e throughput configuráveis independentemente do tamanho (baseline 3.000 IOPS, até 16.000). 20% mais barato que gp2. Padrão para uso geral.</p><p><strong>io2/io2 Block Express:</strong> IOPS provisionadas até 256.000, latência sub-milissegundo. Para bancos de dados com I/O intensivo (Oracle, SQL Server). Custo alto — use só quando necessário.</p>", level: "pleno" },
      { q: "O que é uma AMI e como automatizaria o processo de criação?", a: "<p>AMI (Amazon Machine Image) é uma snapshot do estado de um EC2: OS, configurações, software instalado. Base para Launch Templates e ASG.</p><p>Pipeline de golden AMI: EC2 Image Builder (ou Packer + CI) instala dependências, roda testes de smoke, cria AMI, publica ARN. ASG usa a nova AMI no próximo refresh de instâncias. Immutable infrastructure: não atualize instâncias em produção — recrie com nova AMI.</p>", level: "senior" },
      { q: "Como funcionam Placement Groups e quando importam?", a: "<p><strong>Cluster:</strong> instâncias no mesmo rack físico, rede de 100 Gbps entre elas, latência <10μs. Para HPC, MPI, jobs que precisam de comunicação intensiva entre nós. Risco: falha de rack afeta todas.</p><p><strong>Spread:</strong> cada instância em hardware diferente, máxima isolação de falha. Para aplicações críticas com poucas instâncias (máximo 7 por AZ).</p><p><strong>Partition:</strong> grupos de instâncias isoladas entre si, mas instâncias dentro do mesmo partition compartilham hardware. Para Hadoop, Cassandra, HDFS — onde você quer isolamento por shard, não por instância.</p>", level: "senior" },
      { q: "Como reduziria custo de EC2 em produção?", a: "<p>1. <strong>Rightsizing:</strong> AWS Compute Optimizer analisa CloudWatch e sugere instância mais barata com mesma performance.</p><p>2. <strong>Savings Plans:</strong> commita $X/hora por 1–3 anos. Mais flexível que RI.</p><p>3. <strong>Spot para workers:</strong> ASG misto com base On-demand e escala em Spot.</p><p>4. <strong>Schedule:</strong> desligar ambientes não-prod fora do horário comercial (Lambda + EventBridge).</p><p>5. <strong>Graviton:</strong> instâncias ARM (m7g, c7g) 20–40% mais baratas com mesma performance para a maioria das workloads.</p>", level: "senior" },
    ],
    resources: [
      { title: "AWS EC2 docs", url: "https://docs.aws.amazon.com/ec2/", kind: "docs" },
      { title: "EC2 instance types comparison", url: "https://instances.vantage.sh/", kind: "pratica" },
      { title: "AWS Compute Optimizer", url: "https://aws.amazon.com/compute-optimizer/", kind: "docs" },
    ],
  },

  "s3": {
    tagline: "Object storage durável, escalável e barato — o armazenamento padrão da AWS.",
    why: "S3 está em praticamente toda arquitetura AWS: uploads de usuário, assets estáticos, backups, data lake, pipelines de dados. Saber lifecycle policies, pre-signed URLs, versionamento, replicação e segurança é esperado em qualquer vaga.",
    summary: "Amazon S3 (Simple Storage Service) armazena objetos (arquivos de qualquer tipo e tamanho) em buckets, com 11 noves de durabilidade (99,999999999%). Classes de armazenamento com diferentes tradeoffs de custo/acesso: Standard, Intelligent-Tiering, Standard-IA, Glacier. Pre-signed URLs para acesso temporário. Versioning e Object Lock para proteção de dados. Lifecycle policies para gerenciamento automático de custo. S3 Events para pipelines serverless.",
    keypoints: [
      { title: "Classes de storage", body: "S3 Standard: acesso frequente, menor latência. Standard-IA: acesso infrequente, custo de armazenamento 40% menor, mas cobra por retrieval. Glacier Instant Retrieval: arquivamento com acesso em milissegundos. Glacier Flexible: retrieval em minutos/horas. Deep Archive: mais barato, retrieval em 12–48h. Intelligent-Tiering: move automaticamente entre camadas baseado no padrão de acesso." },
      { title: "Pre-signed URLs", body: "URL temporária gerada com credenciais AWS para acesso a objeto privado sem expor as credenciais. GET (download) e PUT (upload direto do cliente). TTL configurável (padrão 1h, máximo 7 dias com STS). O cliente acessa diretamente — seu servidor nunca toca o arquivo." },
      { title: "Versioning", body: "Mantém todas as versões anteriores de cada objeto. Protege contra delete e sobrescrita acidental. MFA Delete exige MFA para deletar versão ou desativar versioning. Custo: cada versão ocupa storage. Combine com lifecycle para expirar versões antigas." },
      { title: "Lifecycle policies", body: "Automatiza transição entre classes e expiração. Exemplo: mover para IA após 30 dias → Glacier após 90 dias → deletar após 365 dias. Aplica-se também a versões anteriores de objetos. Reduz custo sem intervenção manual." },
      { title: "Replicação", body: "CRR (Cross-Region Replication): replica para outra região — DR, latência para usuários distantes. SRR (Same-Region Replication): replica dentro da região — compliance (cópia imutável), log aggregation. Replicação é assíncrona e não retroativa (replica apenas objetos novos após ativar)." },
      { title: "S3 Events", body: "Dispara Lambda, SQS ou SNS em eventos PutObject, DeleteObject, etc. Base de pipelines serverless: upload de imagem → Lambda redimensiona → salva thumbnail. EventBridge como alternativa mais flexível (filtragem avançada por prefixo, sufixo, tipo)." },
      { title: "Segurança", body: "Bucket policies (resource-based, JSON), IAM policies (identity-based). ACLs são legado — desabilitar. Block Public Access: ativar sempre (conta e bucket). Criptografia: SSE-S3 (AWS gerencia chave), SSE-KMS (chave no KMS, auditável, rotacionável), SSE-C (cliente fornece chave). Object Lock (WORM): proteção contra delete por período fixo — compliance." },
    ],
    diagrams: [
      {
        title: "Upload seguro via pre-signed URL — fluxo sem expor credenciais",
        html: `<style>
.s3-flow{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.s3-actor{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:8px 14px;font-size:11px;text-align:center;min-width:90px}
.s3-arrow{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:0 4px}
.s3-arrow-line{color:#ff9900;font-size:10px;letter-spacing:.03em;white-space:nowrap;font-weight:600}
.s3-arrow-icon{color:#475569;font-size:14px}
.s3-step{background:#1e293b;border-left:3px solid #ff9900;border-radius:0 6px 6px 0;padding:7px 11px;font-size:11px;margin-bottom:6px;color:#94a3b8}
.s3-step strong{color:#e2e8f0}
</style>
<div class="s3-flow">
  <div style="display:flex;align-items:center;gap:6px;margin-bottom:16px;flex-wrap:wrap">
    <div class="s3-actor" style="border-color:#60a5fa;color:#60a5fa">Browser<br><span style="font-size:9px;color:#475569">usuário</span></div>
    <div class="s3-arrow">
      <span class="s3-arrow-line">① GET /upload-url</span>
      <span class="s3-arrow-icon">→</span>
    </div>
    <div class="s3-actor" style="border-color:#a78bfa;color:#a78bfa">Seu Backend<br><span style="font-size:9px;color:#475569">Node/Lambda</span></div>
    <div class="s3-arrow">
      <span class="s3-arrow-line">② getSignedUrl(PUT)</span>
      <span class="s3-arrow-icon">→</span>
    </div>
    <div class="s3-actor" style="border-color:#ff9900;color:#ff9900">AWS S3<br><span style="font-size:9px;color:#475569">bucket privado</span></div>
  </div>
  <div style="display:flex;align-items:center;gap:6px;margin-bottom:16px;flex-wrap:wrap">
    <div class="s3-actor" style="border-color:#60a5fa;color:#60a5fa">Browser</div>
    <div class="s3-arrow">
      <span class="s3-arrow-line">③ PUT direto ao S3</span>
      <span class="s3-arrow-icon">→</span>
    </div>
    <div class="s3-actor" style="border-color:#ff9900;color:#ff9900">AWS S3</div>
    <div style="font-size:10px;color:#4ade80;margin-left:6px">✓ arquivo salvo</div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:12px">
    <div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#ff9900;font-weight:700;margin-bottom:8px">Por que funciona</div>
    <div class="s3-step"><strong>Pre-signed URL</strong> contém credenciais temporárias assinadas. Válida por N segundos. S3 valida a assinatura.</div>
    <div class="s3-step"><strong>Seu servidor nunca toca o arquivo</strong> — sem custo de CPU, sem egress do backend, sem limite de tamanho.</div>
    <div class="s3-step"><strong>Bucket permanece privado</strong> — a URL assinada é o único acesso temporário. Após TTL, a URL expira.</div>
  </div>
</div>`,
        caption: "Pre-signed URL é o padrão para upload de arquivos grandes. O backend só gera a URL — o arquivo vai direto do browser para o S3.",
      },
    ],
    gotchas: [
      "Bucket público acidentalmente — Block Public Access desabilitado + política com Principal: '*'. Consequência: data breach. Ative Block Public Access em nível de conta.",
      "Listar bucket sem paginação — S3 retorna 1.000 objetos por página. Com 10M de objetos e sem paginator, você processa apenas os primeiros 1.000.",
      "Versioning ativo sem lifecycle — versões acumulam infinitamente. Defina lifecycle para expirar versões antigas (ex: manter apenas 5 versões).",
      "Pre-signed URL com TTL muito longo — acesso persiste mesmo após revogar a permissão IAM do usuário (até expirar o token da URL).",
      "CRR não é retroativa — replicação copia apenas objetos criados após ativar. Objetos existentes precisam ser copiados manualmente (aws s3 sync).",
      "Custo de Glacier por retrieval — recuperar dados do Glacier pode ser mais caro que armazená-los, dependendo do volume. Planeje retrieval com antecedência.",
    ],
    interview: [
      { q: "Como faria upload seguro de arquivo diretamente para S3 sem passar pelo servidor?", a: "<p>Pre-signed URL para PUT: backend gera URL temporária (1–60 min) com credenciais AWS. Frontend faz PUT diretamente para S3. O servidor nunca vê o arquivo — sem custo de CPU ou egress do backend.</p><p>Validações: tipo e tamanho no frontend (client-side) + Lambda trigger após PutObject para validação server-side (tipo real via magic bytes, antivírus, resize de imagem). Bucket privado + CloudFront na frente para servir os arquivos ao público.</p>", level: "pleno" },
      { q: "Como reduziria custos de S3 em um sistema com 10 TB de arquivos?", a: "<p>Intelligent-Tiering para objetos com padrão de acesso imprevisível — move automaticamente sem cobrança de retrieval. Lifecycle policy para arquivos com padrão conhecido: IA após 30 dias, Glacier após 90, expirar após 365.</p><p>CloudFront na frente do S3 reduz egress (CloudFront egress é mais barato que S3 direto, e cache reduz chamadas). Comprimir objetos antes de enviar. Expirar versões antigas se versioning ativo.</p>", level: "pleno" },
      { q: "Quais são as opções de criptografia no S3 e quando usar cada uma?", a: "<p><strong>SSE-S3:</strong> AWS gerencia as chaves automaticamente. Zero overhead. Suficiente para a maioria dos casos — compliance básico.</p><p><strong>SSE-KMS:</strong> chave no AWS KMS, auditável via CloudTrail (quem acessou, quando), rotacionável. Exigida para compliance regulatório (SOC 2, HIPAA, PCI). Adiciona latência mínima e custo por chamada KMS.</p><p><strong>SSE-C:</strong> cliente fornece e gerencia a chave a cada request. Máximo controle, máxima responsabilidade. Raro na prática.</p><p><strong>Client-side:</strong> criptografia antes de enviar — AWS nunca vê os dados em plaintext. Para dados ultra-sensíveis.</p>", level: "senior" },
      { q: "Como implementaria um data lake simples com S3?", a: "<p>Estrutura de prefixos: <code>s3://bucket/raw/year=2024/month=01/day=15/</code> (particionamento Hive-style para Athena).</p><p>Ingestão: Kinesis Data Firehose ou Lambda para gravar no S3 raw. Lifecycle move raw para Glacier após 1 ano. Bucket separado para processed (Parquet, comprimido com Snappy/Zstd).</p><p>Consulta: Athena lê direto do S3 (paga por TB escaneado — particionamento reduz custo). AWS Glue Catalog como metastore. S3 Select para filtrar dentro de objetos sem baixar o arquivo todo.</p>", level: "senior" },
      { q: "O que é S3 Object Lock e quando usar?", a: "<p>Object Lock implementa WORM (Write Once, Read Many) — um objeto em modo Compliance não pode ser deletado nem sobrescrito por ninguém, nem pelo root da conta, até expirar o período de retenção.</p><p>Dois modos: Governance (admin pode sobrescrever com permissão especial) e Compliance (ninguém pode sobrescrever — imutabilidade total). Usado para compliance regulatório: FINRA, SEC 17a-4, LGPD em logs de auditoria, HIPAA.</p>", level: "senior" },
      { q: "Como o S3 garante consistência e o que mudou em 2020?", a: "<p>Antes de dezembro de 2020: S3 era <em>eventually consistent</em> para sobrescritas e deletes — um objeto recém-sobrescrito podia retornar a versão antiga por alguns segundos.</p><p>A partir de dezembro de 2020: S3 passou a oferecer <strong>strong consistency</strong> para todas as operações (GET, PUT, LIST, DELETE) sem custo adicional. Após uma escrita confirmada, qualquer leitura subsequente retorna o valor mais recente. Isso simplificou drasticamente a lógica de aplicações que usam S3 como storage primário.</p>", level: "senior" },
    ],
    resources: [
      { title: "AWS S3 docs", url: "https://docs.aws.amazon.com/s3/", kind: "docs" },
      { title: "S3 storage classes", url: "https://aws.amazon.com/s3/storage-classes/", kind: "docs" },
      { title: "S3 pricing", url: "https://aws.amazon.com/s3/pricing/", kind: "docs" },
    ],
  },

  "lambda": {
    tagline: "Computação serverless — você envia a função, AWS executa em resposta a eventos.",
    why: "Lambda é o núcleo do serverless na AWS. Saber cold start, limites, invocação síncrona vs assíncrona, concorrência e quando Lambda perde para ECS é diferencial em qualquer vaga de backend com AWS.",
    summary: "AWS Lambda executa código em resposta a eventos (API Gateway, S3, SQS, DynamoDB Streams, EventBridge, etc.) sem gerenciar servidores. Paga por invocação e duração (granularidade de 1 ms). Limites: 15 min máx, 10 GB de memória, 512 MB em /tmp (6 GB com EFS). Suporta container images até 10 GB. Provisioned Concurrency elimina cold start para funções críticas.",
    keypoints: [
      { title: "Cold start", body: "Primeira invocação (ou após inatividade) inicializa o execution environment: download de código, inicialização do runtime, execução do código fora do handler. Latência extra de 100 ms–1 s dependendo da linguagem e tamanho do pacote. Python/Node são mais rápidos que Java/.NET. Container images são mais lentos que ZIP." },
      { title: "Execution environment", body: "Container reutilizado entre invocações da mesma função (warm). Variáveis e objetos fora do handler persistem entre invocações na mesma instância. Use isso a seu favor: inicialize conexões de DB, clientes SDK e configurações fora do handler — eles são reutilizados sem custo de inicialização." },
      { title: "Invocação síncrona vs assíncrona", body: "Síncrona (API Gateway, ALB, SDK InvocationType=RequestResponse): aguarda resposta, retorna resultado. Assíncrona (S3 Events, SNS, EventBridge): Lambda recebe, processa, resposta não retornada ao invocador — retry automático 2× em erro. SQS: Lambda faz polling, entrega at-least-once, configura DLQ para falhas." },
      { title: "Concorrência", body: "Lambda escala horizontalmente por padrão — uma instância por requisição simultânea. Burst limit: 3.000 instâncias simultâneas iniciais por região (depois +500/min). Reserved concurrency: limite máximo de uma função (protege o banco). Provisioned concurrency: mantém N instâncias quentes — elimina cold start, tem custo fixo." },
      { title: "Layers", body: "Compartilha dependências entre funções (libs, binários, runtime customizado). Reduz tamanho do deployment. Máximo de 5 layers por função. Tamanho total descomprimido ≤ 250 MB." },
      { title: "Lambda em VPC", body: "Lambda em VPC acessa recursos privados (RDS, ElastiCache, instâncias EC2). A partir de 2019 usa ENI compartilhadas (Hyperplane) — cold start de VPC caiu de ~1 s para < 100 ms. Sem NAT Gateway, Lambda em VPC não acessa a internet. Use VPC Endpoints para acessar S3/DynamoDB/outros serviços AWS sem passar pela internet." },
    ],
    diagrams: [
      {
        title: "Ciclo de vida do execution environment — warm vs cold",
        html: `<style>
.lmb-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.lmb-phase{background:#1e293b;border-radius:8px;padding:10px 14px;font-size:11px;flex:1;min-width:120px}
.lmb-phase-title{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:5px}
.lmb-arrow{color:#475569;font-size:16px;display:flex;align-items:center;padding:0 4px}
.lmb-tag{display:inline-block;border-radius:4px;padding:2px 6px;font-size:9px;font-weight:700;margin-top:4px}
.lmb-cold{border-left:3px solid #f59e0b}
.lmb-warm{border-left:3px solid #4ade80}
@keyframes lmb-pulse{0%,100%{opacity:.4}50%{opacity:1}}
.lmb-dot{display:inline-block;width:8px;height:8px;border-radius:50%;animation:lmb-pulse 1.8s ease-in-out infinite}
</style>
<div class="lmb-wrap">
  <div style="margin-bottom:14px">
    <div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#f59e0b;font-weight:700;margin-bottom:8px">❄ Cold start — primeira invocação</div>
    <div style="display:flex;align-items:stretch;gap:6px;flex-wrap:wrap">
      <div class="lmb-phase lmb-cold">
        <div class="lmb-phase-title" style="color:#f59e0b">① Init</div>
        <div style="color:#94a3b8">Download código<br>Inicializa runtime<br>Executa código global</div>
        <div class="lmb-tag" style="background:rgba(245,158,11,.15);color:#f59e0b">~100ms–1s</div>
      </div>
      <div class="lmb-arrow">→</div>
      <div class="lmb-phase lmb-cold">
        <div class="lmb-phase-title" style="color:#f59e0b">② Invoke</div>
        <div style="color:#94a3b8">Executa o handler<br>Retorna resposta</div>
        <div class="lmb-tag" style="background:rgba(245,158,11,.15);color:#f59e0b">seu código</div>
      </div>
      <div class="lmb-arrow">→</div>
      <div class="lmb-phase lmb-cold">
        <div class="lmb-phase-title" style="color:#64748b">③ Freeze</div>
        <div style="color:#475569">Container pausado<br>aguardando próxima<br>invocação</div>
      </div>
    </div>
  </div>
  <div>
    <div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#4ade80;font-weight:700;margin-bottom:8px">♨ Warm — invocação subsequente (mesmo container)</div>
    <div style="display:flex;align-items:stretch;gap:6px;flex-wrap:wrap">
      <div class="lmb-phase lmb-warm">
        <div class="lmb-phase-title" style="color:#4ade80">① Thaw</div>
        <div style="color:#94a3b8">Container reutilizado<br>Variáveis globais<br>ainda na memória</div>
        <div class="lmb-tag" style="background:rgba(74,222,128,.15);color:#4ade80">&lt;1ms</div>
      </div>
      <div class="lmb-arrow">→</div>
      <div class="lmb-phase lmb-warm">
        <div class="lmb-phase-title" style="color:#4ade80">② Invoke</div>
        <div style="color:#94a3b8">Executa o handler<br>Reutiliza conexão DB<br>Retorna resposta</div>
        <div class="lmb-tag" style="background:rgba(74,222,128,.15);color:#4ade80">seu código</div>
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:10px 14px;margin-top:12px;font-size:11px">
    <strong style="color:#e2e8f0">Padrão recomendado:</strong>
    <span style="color:#94a3b8"> inicialize conexões de DB, clientes SDK e cache fora do handler — são reutilizados em invocações warm.</span>
  </div>
</div>`,
        caption: "O container Lambda é reutilizado enquanto a função recebe invocações frequentes. Variáveis globais persistem — use para conexões de DB (fora do handler) e evite para estado que deve ser isolado por invocação.",
      },
    ],
    gotchas: [
      "Conexão de DB dentro do handler — nova conexão a cada invocação. Inicialize fora do handler para reutilização. Com escala alta, use RDS Proxy para connection pooling.",
      "Lambda em VPC sem NAT Gateway — sem acesso a APIs externas ou serviços AWS públicos. Adicione NAT Gateway ou VPC Endpoints.",
      "Timeout muito curto — Lambda encerra a função no limite, mesmo que uma operação crítica esteja em andamento. Configure com margem.",
      "Pacote de deployment grande — cold start mais lento. Use bundler (esbuild/rollup), remova dependências não usadas, ou container image para dependências pesadas.",
      "Sem DLQ para invocação assíncrona — falha silenciosa após 2 retries. Configure DLQ (SQS/SNS) ou Destinations (on failure).",
      "Assumir stateless sem verificar — Lambda pode reutilizar container entre invocações. Estado em variável global persiste. Não armazene state de request em globais.",
    ],
    interview: [
      { q: "Como reduziria cold start em Lambda?", a: "<p><strong>Provisioned Concurrency:</strong> mantém N instâncias quentes permanentemente. Tem custo fixo — use só para funções críticas de latência.</p><p><strong>Redução do pacote:</strong> bundler (esbuild para Node), remover devDependencies, tree-shaking. Pacote menor = init mais rápido.</p><p><strong>Escolha de runtime:</strong> Node.js e Python têm cold start mais rápido que Java e .NET. <strong>SnapStart</strong> para Java: tira snapshot do estado inicializado e restaura em ms.</p><p><strong>Lazy initialization:</strong> só inicialize recursos no primeiro uso — evite inicializar tudo no global scope se não for sempre usado.</p>", level: "pleno" },
      { q: "Lambda vs ECS — quando usar cada?", a: "<p><strong>Lambda:</strong> event-driven, esporádico, curto (< 15 min), escala de zero a N automaticamente, sem gerenciamento de infraestrutura. Custo-eficiente para baixo volume de requisições.</p><p><strong>ECS Fargate:</strong> serviços de longa duração, workload contínuo, latência previsível sem cold start, conexão de DB persistente (sem reconnect a cada invocação), containers maiores que 10 GB de memória.</p><p>Regra prática: começa com Lambda. Quando o custo de Lambda superar ECS em $, ou quando precisar de latência consistente sem Provisioned Concurrency, migra para ECS.</p>", level: "pleno" },
      { q: "O que é reserved concurrency e por que é importante?", a: "<p>Reserved concurrency define o número máximo de instâncias simultâneas de uma função específica. Serve para dois propósitos opostos:</p><p>1. <strong>Proteção:</strong> limitar uma função que consome muitas conexões de DB (ex: máximo 50 instâncias = máximo 50 conexões).</p><p>2. <strong>Garantia:</strong> reservar capacidade para funções críticas — as N instâncias reservadas não são consumidas por outras funções da conta.</p><p>Atenção: definir reserved concurrency = 0 efetivamente desabilita a função (throttle em todas as invocações).</p>", level: "pleno" },
      { q: "Como funciona o modelo de retry para invocação assíncrona?", a: "<p>Em invocação assíncrona (S3 Events, SNS, EventBridge), se a função retornar erro ou timeout, Lambda faz retry automaticamente 2 vezes com backoff exponencial (espera ~1 min e ~2 min).</p><p>Após os retries, a invocação é descartada silenciosamente — a menos que você configure:</p><p><strong>DLQ:</strong> SQS ou SNS recebe a mensagem falhada. <strong>Destinations on failure:</strong> EventBridge, SQS, SNS ou outra Lambda recebe o contexto da falha. Destinations é mais rico que DLQ (inclui o input, output e metadados da falha).</p>", level: "senior" },
      { q: "Como Lambda escala e quais são os limites?", a: "<p>Lambda escala automaticamente: uma instância por requisição simultânea. Não há limite de instâncias por conta por padrão — mas há limites de concorrência.</p><p><strong>Burst limit:</strong> 3.000 instâncias simultâneas instantâneas por região (us-east-1, eu-west-1, ap-northeast-1 têm 3.000; outras têm 500–1.000). Depois do burst, +500 instâncias/minuto.</p><p><strong>Account limit:</strong> 1.000 instâncias simultâneas por padrão (aumentável via suporte). Compartilhado entre todas as funções da conta/região.</p><p>Implicação: uma função sem reserved concurrency pode consumir toda a capacidade da conta e causar throttling nas outras.</p>", level: "senior" },
      { q: "O que é Lambda SnapStart e para qual cenário foi criado?", a: "<p>SnapStart é uma feature para funções Java (Corretto 11+). O problema: Java tem cold start lento (JVM startup + inicialização de frameworks como Spring Boot pode levar 5–10 s).</p><p>Como funciona: na publicação de uma nova versão, Lambda executa a função até o fim do init, tira um snapshot do estado da memória e do disco. Em cada cold start, restaura esse snapshot em vez de reinicializar do zero. Cold start cai de segundos para ~150 ms.</p><p>Restrições: a função deve ser determinística na inicialização (sem random seeds, timestamps ou I/O não-reproduzíveis no init). Disponível apenas para Java no momento.</p>", level: "senior" },
    ],
    resources: [
      { title: "AWS Lambda docs", url: "https://docs.aws.amazon.com/lambda/", kind: "docs" },
      { title: "Lambda Power Tuning (otimização de memória/custo)", url: "https://github.com/alexcasalboni/aws-lambda-power-tuning", kind: "pratica" },
      { title: "Lambda best practices", url: "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html", kind: "docs" },
    ],
  },

  "rds": {
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
  },

  "iam": {
    tagline: "Controle de acesso da AWS — users, roles, policies e princípio do menor privilégio.",
    why: "IAM mal configurado é a causa de 90% dos incidents de segurança na AWS. Sênior precisa entender roles, policies, SCP, permission boundaries e como implementar least privilege de forma escalável.",
    summary: "AWS IAM (Identity and Access Management) controla quem pode fazer o que na AWS. Componentes: Users (pessoas), Groups (conjunto de users), Roles (identidade assumível por serviço ou usuário), Policies (documento JSON de permissões). Princípio do menor privilégio: conceda só o necessário. SCPs controlam os limites de toda a Organization. IAM Access Analyzer detecta acessos não intencionais.",
    keypoints: [
      { title: "Policies", body: "JSON com Statement[]: Effect (Allow/Deny), Action (serviço:operação), Resource (ARN), Condition opcional. Identity-based: anexada ao principal (user, group, role). Resource-based: anexada ao recurso (S3 bucket policy, Lambda resource policy). Deny explícito sempre prevalece sobre Allow." },
      { title: "Roles", body: "Identidade sem credencial permanente. Assumida por EC2 (instance profile), Lambda (execution role), ECS (task role), serviços AWS e usuários federated (SSO/SAML). Credenciais temporárias rotacionadas automaticamente (15 min–12 h). Nunca use access keys em serviços — sempre roles." },
      { title: "Least Privilege", body: "Comece sem nenhuma permissão, adicione só o necessário. IAM Access Analyzer identifica permissões não usadas nos últimos 90 dias. Policy Generation analisa CloudTrail e gera policy com o mínimo necessário. Revisar permissões periodicamente." },
      { title: "SCP (Service Control Policy)", body: "Política de AWS Organizations que define o limite máximo de permissões para contas e OUs inteiras. Mesmo AdministratorAccess não pode fazer o que um SCP nega. Guardrail organizacional: bloquear regiões não aprovadas, serviços fora do escopo, ações críticas sem MFA." },
      { title: "Permission Boundaries", body: "Define o limite máximo de permissões que um user ou role pode ter, independentemente das policies anexadas. Útil para delegar criação de IAM a times sem risco de privilege escalation: o time pode criar roles, mas nunca com mais permissões do que o boundary permite." },
      { title: "Assume Role / STS", body: "aws sts assume-role retorna credenciais temporárias (AccessKeyId + SecretAccessKey + SessionToken). Fluxo cross-account: conta A assume role na conta B com trust policy que permite a conta A. Base para acesso multi-conta seguro." },
    ],
    diagrams: [
      {
        title: "Avaliação de permissão IAM — ordem de decisão",
        html: `<style>
.iam-flow{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.iam-step{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px}
.iam-num{background:#1e293b;border:1.5px solid #334155;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;color:#94a3b8}
.iam-box{background:#1e293b;border-radius:8px;padding:9px 13px;font-size:11px;flex:1}
.iam-deny{border-left:3px solid #ef4444}
.iam-allow{border-left:3px solid #4ade80}
.iam-neutral{border-left:3px solid #475569}
.iam-result{border-radius:8px;padding:10px 14px;font-size:12px;font-weight:700;text-align:center;margin-top:8px}
</style>
<div class="iam-flow">
  <p style="font-size:10px;color:#64748b;margin:0 0 14px">Quando um principal faz uma chamada à API AWS, esta sequência é avaliada em ordem:</p>
  <div class="iam-step">
    <div class="iam-num" style="border-color:#ef4444;color:#ef4444">1</div>
    <div class="iam-box iam-deny">
      <strong style="color:#ef4444">Deny explícito?</strong>
      <span style="color:#94a3b8"> — Qualquer Deny em qualquer policy (SCP, resource-based, identity-based, permissions boundary) encerra imediatamente.</span>
      <div style="margin-top:4px;font-size:10px;color:#ef4444">→ DENY (sem exceção)</div>
    </div>
  </div>
  <div class="iam-step">
    <div class="iam-num" style="border-color:#f59e0b;color:#f59e0b">2</div>
    <div class="iam-box iam-neutral" style="border-color:#f59e0b">
      <strong style="color:#f59e0b">SCP permite?</strong>
      <span style="color:#94a3b8"> — Se há SCP (AWS Organizations), a ação deve estar dentro do que o SCP permite.</span>
      <div style="margin-top:4px;font-size:10px;color:#f59e0b">→ Não permite: DENY</div>
    </div>
  </div>
  <div class="iam-step">
    <div class="iam-num" style="border-color:#f59e0b;color:#f59e0b">3</div>
    <div class="iam-box iam-neutral" style="border-color:#f59e0b">
      <strong style="color:#f59e0b">Permissions boundary permite?</strong>
      <span style="color:#94a3b8"> — Se o principal tem boundary definido, a ação deve estar dentro do boundary.</span>
      <div style="margin-top:4px;font-size:10px;color:#f59e0b">→ Não permite: DENY</div>
    </div>
  </div>
  <div class="iam-step">
    <div class="iam-num" style="border-color:#4ade80;color:#4ade80">4</div>
    <div class="iam-box iam-allow">
      <strong style="color:#4ade80">Allow em alguma policy?</strong>
      <span style="color:#94a3b8"> — Identity-based ou resource-based policy permite explicitamente.</span>
      <div style="margin-top:4px;font-size:10px;color:#4ade80">→ Sim: ALLOW | Não: DENY implícito</div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:10px 14px;margin-top:4px;font-size:11px;color:#94a3b8">
    <strong style="color:#e2e8f0">Regra de ouro:</strong> IAM começa negando tudo. Você precisa de Allow explícito em todos os níveis aplicáveis. Um único Deny explícito encerra — sem exceção.
  </div>
</div>`,
        caption: "A avaliação de permissão percorre essa ordem. Um Deny explícito em qualquer camada é definitivo. O Allow só é concedido quando todas as camadas aplicáveis permitem.",
      },
    ],
    gotchas: [
      "AdministratorAccess para tudo — viola least privilege. Em caso de comprometimento, blast radius é total.",
      "Access keys de usuário em código ou repositório — rotacionar imediatamente, usar roles em serviços. Ferramentas como git-secrets ou gitleaks detectam antes do commit.",
      "Role com trust policy aberta (Principal: '*') — qualquer conta AWS pode assumir a role. Sempre especifique o principal exato.",
      "Root account sem MFA — a conta root pode fazer qualquer coisa, inclusive deletar a própria conta. MFA é obrigatório.",
      "Policy com Resource: '*' quando deveria ser ARN específico — acesso a todos os recursos do tipo, não apenas os necessários.",
      "Inline policies em vez de managed — inline policies são invisíveis ao IAM Access Analyzer e difíceis de auditar em escala. Prefira customer managed policies.",
    ],
    interview: [
      { q: "Por que usar roles em vez de access keys para serviços AWS?", a: "<p>Roles fornecem credenciais temporárias rotacionadas automaticamente (15 min–12 h). Access keys são permanentes — se vazadas comprometem indefinidamente até rotação manual.</p><p>EC2 com instance profile, Lambda com execution role, ECS com task role — todos usam roles. A credencial nunca precisa ser gerenciada ou rotacionada manualmente. Em caso de comprometimento, a credencial temporária expira sozinha.</p>", level: "pleno" },
      { q: "Como implementaria least privilege na prática?", a: "<p>1. Negar tudo por padrão (IAM faz isso automaticamente).</p><p>2. <strong>Policy Generation:</strong> IAM analisa CloudTrail dos últimos 90 dias e gera policy com as ações realmente usadas pelo principal.</p><p>3. <strong>IAM Access Analyzer:</strong> identifica permissões concedidas mas não utilizadas, recursos acessíveis de fora da conta, e acessos cross-account não intencionais.</p><p>4. <strong>SCPs:</strong> guardrails no nível organizacional — bloquear regiões não aprovadas, serviços fora do escopo, ações destrutivas sem condição MFA.</p><p>5. Revisão periódica — permissões crescem por acréscimo, raramente por remoção.</p>", level: "pleno" },
      { q: "Explique como funciona Assume Role entre contas.", a: "<p>Cenário: Conta A (developer) precisa acessar recurso na Conta B (produção).</p><p>1. Conta B cria uma role com trust policy que permite <code>sts:AssumeRole</code> para a Conta A (ou principal específico).</p><p>2. Principal na Conta A chama <code>aws sts assume-role --role-arn arn:aws:iam::CONTA-B:role/NomeRole</code>.</p><p>3. STS retorna credenciais temporárias (access key + secret + session token) válidas por 1–12 h.</p><p>4. Principal usa essas credenciais para chamar APIs da Conta B com as permissões da role.</p><p>Auditável via CloudTrail em ambas as contas. Base para acesso multi-conta seguro sem compartilhamento de credenciais.</p>", level: "senior" },
      { q: "Qual a diferença entre SCP e permissions boundary?", a: "<p><strong>SCP (Service Control Policy):</strong> aplica-se a toda uma conta ou OU no AWS Organizations. Define o teto máximo de permissões para <em>todos</em> os principals da conta. Não concede permissões — apenas restringe. Configurado pelo administrador da organização.</p><p><strong>Permissions Boundary:</strong> aplica-se a um user ou role específico. Define o teto máximo de permissões daquele principal. Útil para delegação segura: um time pode criar roles para sua aplicação, mas o boundary garante que nenhuma role criada exceda o que o boundary permite — sem risco de escalada de privilégio.</p>", level: "senior" },
      { q: "Como o IAM Access Analyzer ajuda na segurança?", a: "<p>Access Analyzer analisa resource-based policies (S3, KMS, Lambda, SQS, IAM roles) e identifica recursos acessíveis de fora da zona de confiança definida (conta ou organização).</p><p>Exemplos de findings: bucket S3 com policy que permite acesso público ou cross-account não intencional; role IAM com trust policy que permite AssumeRole de conta externa; chave KMS compartilhada com principal fora da organização.</p><p>Além disso, o módulo de análise de acessos não utilizados (IAM Access Analyzer for unused access) identifica roles e access keys que não foram usados nos últimos 90 dias — candidatos a remoção ou redução de permissões.</p>", level: "senior" },
      { q: "O que é uma condition em uma IAM policy e cite exemplos práticos?", a: "<p>Condition adiciona lógica condicional à avaliação do statement. Sintaxe: operador de condição → chave de condição → valor.</p><p>Exemplos práticos:</p><p><code>aws:MultiFactorAuthPresent: true</code> — exige MFA para ações destrutivas (DeleteBucket, TerminateInstances).</p><p><code>aws:RequestedRegion</code> — restringe chamadas a regiões aprovadas (SCP alternativo).</p><p><code>s3:prefix</code> — limita acesso a prefixo específico no bucket (multi-tenant com prefixo por cliente).</p><p><code>aws:PrincipalOrgID</code> — permite acesso apenas a principals da própria organização AWS (resource-based policies).</p>", level: "senior" },
    ],
    resources: [
      { title: "AWS IAM docs", url: "https://docs.aws.amazon.com/iam/", kind: "docs" },
      { title: "AWS Security Best Practices", url: "https://docs.aws.amazon.com/security/", kind: "docs" },
      { title: "IAM Access Analyzer", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html", kind: "docs" },
    ],
  },

  "vpc": {
    tagline: "Rede privada virtual na AWS — subnets, routing, security groups, NAT e peering.",
    why: "VPC é a fundação de toda arquitetura AWS segura. Saber subnets públicas/privadas, NAT Gateway, Security Groups vs NACLs, VPC Peering vs Transit Gateway é necessário para projetar infraestrutura corretamente.",
    summary: "Amazon VPC (Virtual Private Cloud) é uma rede virtual isolada na AWS. Define range de IPs (CIDR), divide em subnets públicas (acesso à internet via IGW) e privadas (sem acesso direto). NAT Gateway permite instâncias privadas iniciarem conexões para a internet. Security Groups (stateful) e NACLs (stateless) para controle de tráfego. VPC Peering e Transit Gateway para conectar VPCs entre si e com on-premises.",
    keypoints: [
      { title: "Subnets", body: "Segmento de rede dentro do VPC, vinculado a uma AZ. Pública: route table aponta para IGW, recurso tem public IP. Privada: route table sem rota para IGW, sem IP público — acessa internet via NAT Gateway. Best practice: 1 subnet pública + 1 privada por AZ (mínimo 2 AZs para HA)." },
      { title: "Security Groups", body: "Firewall stateful no nível de instância/ENI. Somente Allow — sem regras de Deny explícito. Inbound e outbound configurados separadamente. Stateful: resposta de conexão autorizada automaticamente sem regra de retorno. Múltiplos SGs por instância — permissões são a união de todos." },
      { title: "NACLs (Network ACLs)", body: "Firewall stateless no nível de subnet. Suporta Allow e Deny. Regras numeradas por prioridade (menor número = avaliado primeiro, asterisco = deny padrão). Stateless: a resposta HTTP precisa de regra de saída para portas efêmeras (1024–65535)." },
      { title: "NAT Gateway", body: "Permite instâncias em subnet privada iniciarem conexões para a internet (updates, APIs externas). NAT Gateway fica em subnet pública e tem Elastic IP. Custo por hora + por GB de dados. Para HA: um NAT Gateway por AZ com route table separada por AZ." },
      { title: "Internet Gateway (IGW)", body: "Ponto de entrada/saída bidirecional entre o VPC e a internet pública. Altamente disponível e gerenciado pela AWS — sem custo por hora. Necessário para subnets públicas. Recurso em subnet pública precisa de IGW na route table E de um IP público." },
      { title: "VPC Peering vs Transit Gateway", body: "Peering: conexão ponto-a-ponto entre dois VPCs (mesma conta ou cross-account). Não é transitivo — A↔B e B↔C não implica A↔C. Bom para poucos VPCs. Transit Gateway: hub central que conecta dezenas de VPCs e on-premises (VPN, Direct Connect). Transitivo e escalável — preferido em arquiteturas multi-conta." },
      { title: "VPC Endpoints", body: "Conexão privada entre o VPC e serviços AWS sem tráfego passar pela internet ou NAT. Gateway Endpoint: S3 e DynamoDB, gratuito, adiciona rota na route table. Interface Endpoint (PrivateLink): outros serviços AWS e SaaS, cria ENI na subnet, custo por hora e por GB." },
    ],
    diagrams: [
      {
        title: "Arquitetura VPC — subnets públicas e privadas em multi-AZ",
        html: `<style>
.vpc-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.vpc-border{border:2px dashed #334155;border-radius:10px;padding:12px;margin-bottom:10px}
.vpc-az{background:#0f172a;border:1.5px solid #1e3a5f;border-radius:8px;padding:10px;flex:1}
.vpc-az-title{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#3b82f6;font-weight:700;margin-bottom:8px}
.vpc-subnet{border-radius:6px;padding:7px 10px;margin-bottom:6px;font-size:10px}
.vpc-pub{background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.3)}
.vpc-priv{background:rgba(148,163,184,.05);border:1px solid #1e293b}
.vpc-resource{background:#1e293b;border-radius:4px;padding:3px 7px;display:inline-block;margin-top:4px;font-size:9px;color:#94a3b8}
.vpc-center{display:flex;align-items:center;justify-content:center;padding:0 6px;color:#475569;font-size:14px}
.vpc-igw{background:rgba(74,222,128,.1);border:1.5px solid rgba(74,222,128,.4);border-radius:8px;padding:7px 14px;text-align:center;color:#4ade80;font-weight:700;font-size:11px;margin-bottom:10px}
.vpc-nat{background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.3);border-radius:4px;padding:3px 7px;display:inline-block;margin-top:4px;font-size:9px;color:#fbbf24}
</style>
<div class="vpc-wrap">
  <div style="text-align:center;margin-bottom:10px">
    <div style="display:inline-block;background:#1e293b;border:1px solid #334155;border-radius:6px;padding:5px 14px;font-size:10px;color:#94a3b8">Internet</div>
    <div style="color:#475569;font-size:14px;margin:2px 0">↕</div>
    <div class="vpc-igw">Internet Gateway (IGW)</div>
  </div>
  <div class="vpc-border">
    <div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#ff9900;font-weight:700;margin-bottom:10px">VPC — 10.0.0.0/16</div>
    <div style="display:flex;gap:8px">
      <div class="vpc-az">
        <div class="vpc-az-title">AZ — us-east-1a</div>
        <div class="vpc-subnet vpc-pub">
          <div style="color:#4ade80;font-weight:600">Subnet Pública</div>
          <div style="color:#64748b">10.0.1.0/24</div>
          <div class="vpc-resource">ALB / NAT GW / Bastion</div>
          <div class="vpc-nat">NAT Gateway ✦</div>
        </div>
        <div style="color:#475569;font-size:12px;text-align:center;margin:3px 0">↕</div>
        <div class="vpc-subnet vpc-priv">
          <div style="color:#94a3b8;font-weight:600">Subnet Privada</div>
          <div style="color:#64748b">10.0.2.0/24</div>
          <div class="vpc-resource">EC2 / ECS / RDS</div>
        </div>
      </div>
      <div class="vpc-center">↔</div>
      <div class="vpc-az">
        <div class="vpc-az-title">AZ — us-east-1b</div>
        <div class="vpc-subnet vpc-pub">
          <div style="color:#4ade80;font-weight:600">Subnet Pública</div>
          <div style="color:#64748b">10.0.3.0/24</div>
          <div class="vpc-resource">ALB / NAT GW</div>
          <div class="vpc-nat">NAT Gateway ✦</div>
        </div>
        <div style="color:#475569;font-size:12px;text-align:center;margin:3px 0">↕</div>
        <div class="vpc-subnet vpc-priv">
          <div style="color:#94a3b8;font-weight:600">Subnet Privada</div>
          <div style="color:#64748b">10.0.4.0/24</div>
          <div class="vpc-resource">EC2 / ECS / RDS standby</div>
        </div>
      </div>
    </div>
  </div>
  <div style="color:#64748b;font-size:10px;margin-top:6px">✦ Um NAT Gateway por AZ = HA + evita custo de tráfego cross-AZ</div>
</div>`,
        caption: "Padrão multi-AZ: subnets públicas para recursos com IP público (ALB, NAT GW), subnets privadas para aplicação e banco. Dois NAT Gateways (um por AZ) garantem HA e evitam tráfego inter-AZ cobrado.",
      },
    ],
    gotchas: [
      "Subnet com rota para IGW não é automaticamente pública — o recurso também precisa de IP público ou Elastic IP associado.",
      "NACL é stateless — precisa de regra de saída para portas efêmeras (1024–65535) para resposta de conexões HTTP/HTTPS inbound.",
      "Um NAT Gateway por região (não por AZ) cria single point of failure — para HA, crie um por AZ com route table separada.",
      "VPC CIDR muito pequeno não é expansível facilmente — planeje com /16 e subnets /24 desde o início. Adicionar CIDR secundário tem limitações.",
      "VPC Peering não é transitivo — A↔B e B↔C não cria A↔C. Para conectar muitos VPCs, use Transit Gateway.",
      "Default VPC em produção — security groups e configurações padrão não são adequados para produção. Crie VPC dedicada com design explícito.",
    ],
    interview: [
      { q: "Diferença entre Security Group e NACL?", a: "<p><strong>Security Group:</strong> stateful, no nível de instância/ENI. Apenas Allow, sem Deny. A resposta de uma conexão autorizada é permitida automaticamente (sem regra de retorno).</p><p><strong>NACL:</strong> stateless, no nível de subnet. Suporta Allow e Deny, numeradas por prioridade. A resposta precisa de regra explícita para portas efêmeras.</p><p>Na prática: use SG para controle fino por instância (a maioria dos casos). Use NACL como guardrail de subnet para bloquear IPs/ranges específicos no perímetro.</p>", level: "pleno" },
      { q: "Quando usar VPC Endpoints?", a: "<p>Sempre que recursos em subnet privada acessam S3, DynamoDB ou outros serviços AWS — evita o tráfego passar pelo NAT Gateway (segurança + custo). <strong>Gateway Endpoint</strong> para S3 e DynamoDB é gratuito e adiciona uma rota na route table.</p><p><strong>Interface Endpoint (PrivateLink)</strong> para outros serviços AWS (SSM, Secrets Manager, ECR, CloudWatch) e SaaS de terceiros. Cria uma ENI privada na subnet — custo por hora e por GB, mas sem tráfego saindo da AWS.</p>", level: "pleno" },
      { q: "Como desenharia a rede VPC para uma aplicação de três camadas?", a: "<p>Subnets públicas (2 AZs): ALB e NAT Gateway. Sem instâncias de aplicação aqui.</p><p>Subnets privadas de aplicação (2 AZs): instâncias EC2 ou tasks ECS. Tráfego de saída via NAT Gateway. Recebem tráfego apenas do ALB (Security Group source = SG do ALB).</p><p>Subnets privadas de banco (2 AZs, se possível em /24 separado): RDS Multi-AZ. Tráfego apenas da camada de aplicação (SG source = SG da aplicação). Sem acesso à internet.</p><p>VPC Endpoint para S3 (assets) e Secrets Manager (credenciais). Flow Logs para auditoria de tráfego.</p>", level: "senior" },
      { q: "Transit Gateway vs VPC Peering — quando usar cada?", a: "<p><strong>VPC Peering:</strong> conexão direta e barata (sem custo por hora, só por dados). Simples para 2–5 VPCs. Não é transitivo: N VPCs precisam de N×(N-1)/2 peerings = cresce quadraticamente.</p><p><strong>Transit Gateway:</strong> hub central que conecta N VPCs e conexões on-premises (VPN/Direct Connect) de forma transitiva. Um único attachment por VPC. Suporta roteamento granular por tabelas de rota do TGW. Custo por hora por attachment + por GB — se justifica a partir de ~5 VPCs ou quando precisa de roteamento centralizado.</p>", level: "senior" },
      { q: "O que são VPC Flow Logs e como usaria em investigação de incidente?", a: "<p>Flow Logs capturam metadados de tráfego IP em uma ENI, subnet ou VPC inteiro: source/destination IP, porta, protocolo, bytes, ação (ACCEPT/REJECT). Não captura o conteúdo do pacote — apenas o cabeçalho.</p><p>Em investigação de incidente: habilite Flow Logs para o VPC com destino S3 ou CloudWatch Logs. Use Athena sobre S3 para queries SQL nos logs. Identifique: IPs comunicando com C&C conhecidos, portas incomuns aceitas, tráfego saindo da subnet privada que não deveria sair, tentativas de conexão rejeitadas em massa (port scan).</p>", level: "senior" },
      { q: "Como funciona o roteamento dentro de um VPC?", a: "<p>Cada subnet tem uma route table associada. A route table define para onde vai o tráfego por destino CIDR:</p><p><code>10.0.0.0/16 → local</code> (tráfego dentro do VPC, sempre presente, não removível).</p><p><code>0.0.0.0/0 → igw-xxx</code> → subnet pública (acessa internet).</p><p><code>0.0.0.0/0 → nat-xxx</code> → subnet privada (acessa internet via NAT).</p><p>Rotas mais específicas têm prioridade. VPC Endpoints adicionam rotas automáticas (Gateway Endpoint). Transit Gateway e Peering adicionam rotas para os CIDRs remotos.</p>", level: "senior" },
    ],
    resources: [
      { title: "AWS VPC docs", url: "https://docs.aws.amazon.com/vpc/", kind: "docs" },
      { title: "AWS VPC Reachability Analyzer", url: "https://docs.aws.amazon.com/vpc/latest/reachability/", kind: "docs" },
    ],
  },

  "terraform": {
    tagline: "IaC declarativo multi-cloud — o padrão de mercado para provisionar infraestrutura com código.",
    why: "Terraform é a ferramenta de IaC mais usada no mercado (mais de 1.000 providers, 14M+ downloads/semana). Qualquer vaga de DevOps, SRE ou backend sênior espera que você saiba escrever HCL, entender o ciclo de vida do state, organizar módulos e trabalhar com remote backend em time. Saber o que acontece em cada fase (init → plan → apply), como evitar destruição acidental de recursos críticos e como estruturar um repositório para múltiplos ambientes é o que diferencia quem 'usou Terraform alguma vez' de quem domina a ferramenta.",
    prerequisite: "Conceitos de cloud (pelo menos AWS básico — saber o que é EC2, S3, VPC), linha de comando Linux, git básico (commit, branch, PR). HCL é simples de aprender, mas para fazer sentido você precisa saber o que está sendo provisionado.",
    summary: "Terraform é uma ferramenta de IaC open source da HashiCorp que usa HCL (HashiCorp Configuration Language) para definir infraestrutura de forma declarativa. Você descreve o estado desejado — Terraform calcula o diff em relação ao estado atual (armazenado no tfstate) e aplica só as mudanças necessárias. Fluxo: terraform init (baixa providers e módulos) → terraform plan (calcula diff sem aplicar) → terraform apply (aplica as mudanças) → state atualizado. Suporta 1.000+ providers: AWS, GCP, Azure, Kubernetes, GitHub, Datadog, Cloudflare e muito mais.",
    howToStudy: "<strong>30 minutos antes de entrevista?</strong> Revise o Diagrama 1 (ciclo completo), memorize a estrutura de módulos (Diagrama 3) e treine as Q&As de nível pleno. Garanta que você consegue explicar state locking, create_before_destroy e a diferença entre workspace e diretório separado.<br><br><strong>Fim de semana?</strong> Configure uma conta AWS free tier e siga o Cookbook do início ao fim: backend remoto no S3, módulo de VPC, ECS service com ALB. Escreva o Terraform do zero — não copie e cole. A memória muscular do HCL importa em entrevistas de live coding.<br><br><strong>Uma semana?</strong> Leia 'Terraform: Up and Running' (Yevgeniy Brikman). Faça o Terraform Associate Certification. Contribua com um módulo público no Terraform Registry.",
    diagrams: [
      {
        title: "Ciclo de vida Terraform — write → init → plan → apply → state",
        html: `<style>
.tflc-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tflc-phase{background:#1e293b;border-radius:10px;padding:12px 14px;flex:1;min-width:120px;position:relative}
.tflc-phase-title{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:6px}
.tflc-arr{color:#475569;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0 4px}
.tflc-row{display:flex;align-items:stretch;gap:4px;margin-bottom:12px;flex-wrap:wrap}
.tflc-cmd{font-size:10.5px;font-weight:700;margin-bottom:5px}
.tflc-detail{font-size:9.5px;color:#64748b;line-height:1.6}
.tflc-tag{display:inline-block;border-radius:4px;padding:2px 6px;font-size:8.5px;font-weight:700;margin-top:5px}
@keyframes tflc-pulse{0%,100%{opacity:.5}50%{opacity:1}}
.tflc-pulse{animation:tflc-pulse 2s ease-in-out infinite}
</style>
<div class="tflc-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Ciclo de vida Terraform — do código à infraestrutura</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Cada fase tem uma responsabilidade clara. Nunca pule o plan.</p>

  <div class="tflc-row">
    <!-- WRITE -->
    <div class="tflc-phase" style="border:1.5px solid #7B42BC">
      <div class="tflc-phase-title" style="color:#7B42BC">① WRITE</div>
      <div class="tflc-cmd" style="color:#7B42BC">HCL / .tf files</div>
      <div class="tflc-detail">
        Você descreve o estado desejado.<br>
        resource, variable, output,<br>
        module, data source.
      </div>
      <div class="tflc-tag" style="background:rgba(123,66,188,.15);color:#7B42BC">estado desejado</div>
    </div>
    <div class="tflc-arr">→</div>

    <!-- INIT -->
    <div class="tflc-phase" style="border:1.5px solid #3b82f6">
      <div class="tflc-phase-title" style="color:#3b82f6">② INIT</div>
      <div class="tflc-cmd" style="color:#3b82f6">terraform init</div>
      <div class="tflc-detail">
        Baixa providers (.terraform/)<br>
        Configura backend remoto<br>
        Baixa módulos referenciados<br>
        Gera .terraform.lock.hcl
      </div>
      <div class="tflc-tag" style="background:rgba(59,130,246,.15);color:#3b82f6">roda uma vez por workspace</div>
    </div>
    <div class="tflc-arr">→</div>

    <!-- PLAN -->
    <div class="tflc-phase" style="border:1.5px solid #f59e0b">
      <div class="tflc-phase-title" style="color:#f59e0b">③ PLAN</div>
      <div class="tflc-cmd" style="color:#f59e0b">terraform plan</div>
      <div class="tflc-detail">
        Lê o state atual (S3)<br>
        Consulta a API da cloud<br>
        Calcula o diff:<br>
        <span style="color:#4ade80">+ create</span> <span style="color:#f59e0b">~ update</span> <span style="color:#ef4444">- destroy</span>
      </div>
      <div class="tflc-tag" style="background:rgba(245,158,11,.15);color:#f59e0b">não aplica nada</div>
    </div>
    <div class="tflc-arr">→</div>

    <!-- APPLY -->
    <div class="tflc-phase" style="border:1.5px solid #4ade80">
      <div class="tflc-phase-title" style="color:#4ade80">④ APPLY</div>
      <div class="tflc-cmd" style="color:#4ade80">terraform apply</div>
      <div class="tflc-detail">
        Exibe o plan novamente<br>
        Aguarda confirmação (yes)<br>
        Chama APIs da cloud<br>
        Atualiza o state
      </div>
      <div class="tflc-tag" style="background:rgba(74,222,128,.15);color:#4ade80">modifica infra real</div>
    </div>
  </div>

  <!-- State box -->
  <div style="background:#1e293b;border:1.5px solid rgba(255,153,0,.4);border-radius:10px;padding:12px 14px;margin-bottom:12px">
    <div style="font-size:9px;color:#FF9900;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px">⑤ STATE — terraform.tfstate</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <div style="flex:1;min-width:160px">
        <div style="font-size:10px;color:#94a3b8;line-height:1.7">
          Mapeia: <span style="color:#7B42BC">aws_instance.app</span> → <span style="color:#4ade80">i-0abc123def456789</span><br>
          Mapeia: <span style="color:#7B42BC">aws_s3_bucket.data</span> → <span style="color:#4ade80">meu-bucket-prod</span><br>
          Armazena atributos e metadados dos recursos
        </div>
      </div>
      <div style="flex:1;min-width:160px">
        <div style="font-size:10px;color:#94a3b8;line-height:1.7">
          <span style="color:#ef4444">Nunca edite manualmente</span><br>
          Use <span style="color:#7B42BC">terraform state mv</span> para mover<br>
          Use <span style="color:#7B42BC">terraform import</span> para importar<br>
          Use <span style="color:#7B42BC">terraform state rm</span> para remover
        </div>
      </div>
    </div>
  </div>

  <!-- Terraform destroy -->
  <div style="background:#1e293b;border:1.5px solid rgba(239,68,68,.3);border-radius:10px;padding:10px 14px">
    <div style="font-size:9px;color:#ef4444;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:6px">⑥ DESTROY — use com cuidado</div>
    <div style="font-size:10px;color:#64748b;line-height:1.7">
      <span style="color:#ef4444">terraform destroy</span> remove TODOS os recursos gerenciados pelo state.<br>
      Proteção: <span style="color:#7B42BC">lifecycle { prevent_destroy = true }</span> bloqueia destroy em recursos críticos (bancos, buckets com dados).
    </div>
  </div>
</div>`,
        caption: "O plan é a única porta de segurança antes de mudanças reais. Leia sempre o output — especialmente linhas marcadas com '-' (destroy) e '~' (update in-place vs replace).",
      },
      {
        title: "State management — local vs remote com S3 + DynamoDB",
        html: `<style>
.tfst-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tfst-col{flex:1;min-width:200px;border-radius:10px;padding:12px 14px}
.tfst-badge{display:inline-block;font-size:8px;letter-spacing:.08em;font-weight:700;padding:2px 6px;border-radius:3px;text-transform:uppercase;margin-bottom:8px}
.tfst-title{font-size:11px;font-weight:700;margin-bottom:6px}
.tfst-item{font-size:9.5px;color:#64748b;padding:3px 0;border-bottom:1px solid #0f172a;line-height:1.5}
.tfst-item:last-child{border-bottom:none}
.tfst-item.bad{color:#ef4444}
.tfst-item.good{color:#4ade80}
.tfst-item::before{content:'▸ '}
.tfst-code{background:#0f172a;border-radius:6px;padding:10px 13px;font-size:9.5px;color:#94a3b8;line-height:1.9;margin-top:10px}
.tfst-code .kw{color:#7B42BC}
.tfst-code .str{color:#4ade80}
.tfst-code .cmt{color:#475569}
</style>
<div class="tfst-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">State management — local vs remote</p>
  <p style="color:#475569;font-size:10px;margin:0 0 14px">State remoto é obrigatório em qualquer time. State local só para testes individuais.</p>

  <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">
    <!-- Local state -->
    <div class="tfst-col" style="background:#1e293b;border:1.5px solid rgba(239,68,68,.3)">
      <div class="tfst-badge" style="background:rgba(239,68,68,.15);color:#ef4444">Evitar em time</div>
      <div class="tfst-title" style="color:#ef4444">State local (padrão)</div>
      <div class="tfst-item bad">terraform.tfstate no disco local</div>
      <div class="tfst-item bad">Perdido se máquina morre ou formato</div>
      <div class="tfst-item bad">Sem locking — dois applies simultâneos corrompem</div>
      <div class="tfst-item bad">Commitar no git vaza secrets (IPs, ARNs, passwords)</div>
      <div class="tfst-item bad">Nenhum histórico de versões auditável</div>
      <div class="tfst-item" style="color:#64748b">OK apenas para: aprendizado solo, módulos locais sem cloud</div>
    </div>

    <!-- Remote state -->
    <div class="tfst-col" style="background:#1e293b;border:1.5px solid rgba(74,222,128,.3)">
      <div class="tfst-badge" style="background:rgba(74,222,128,.15);color:#4ade80">Obrigatório em produção</div>
      <div class="tfst-title" style="color:#4ade80">State remoto (S3 + DynamoDB)</div>
      <div class="tfst-item good">State no S3 — durável, versionado, auditável</div>
      <div class="tfst-item good">Criptografado com SSE-KMS em repouso</div>
      <div class="tfst-item good">DynamoDB Lock — apenas 1 apply por vez</div>
      <div class="tfst-item good">IAM: apenas CI/CD e admins acessam o bucket</div>
      <div class="tfst-item good">terraform_remote_state: outputs compartilhados entre stacks</div>
      <div class="tfst-item good">Histórico de versões no S3 Versioning</div>
    </div>
  </div>

  <!-- Configuração -->
  <div style="background:#1e293b;border-radius:10px;padding:12px 14px;margin-bottom:10px">
    <div style="font-size:9px;color:#7B42BC;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px">Configuração do backend remoto</div>
    <div class="tfst-code">
<span class="cmt"># backend.tf — configurar antes do terraform init</span>
<span class="kw">terraform</span> {
  <span class="kw">required_version</span> = <span class="str">"~> 1.7"</span>

  <span class="kw">backend</span> <span class="str">"s3"</span> {
    bucket         = <span class="str">"minha-empresa-tf-state"</span>
    key            = <span class="str">"prod/ecs-app/terraform.tfstate"</span>
    region         = <span class="str">"us-east-1"</span>
    encrypt        = <span class="str">true</span>
    kms_key_id     = <span class="str">"arn:aws:kms:us-east-1:123:key/abc"</span>
    dynamodb_table = <span class="str">"terraform-locks"</span>  <span class="cmt"># LockID como partition key</span>
  }
}
    </div>
  </div>

  <!-- Locking -->
  <div style="background:#1e293b;border-radius:10px;padding:12px 14px">
    <div style="font-size:9px;color:#f59e0b;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px">Como o locking funciona</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <div style="flex:1;font-size:9.5px;color:#64748b;line-height:1.7">
        <span style="color:#4ade80">CI/CD #1</span> roda <span style="color:#7B42BC">terraform apply</span><br>
        → Cria item no DynamoDB: <span style="color:#94a3b8">LockID=state.tfstate</span><br>
        → Aplica mudanças na AWS<br>
        → Remove o lock após completar
      </div>
      <div style="flex:1;font-size:9.5px;color:#64748b;line-height:1.7">
        <span style="color:#ef4444">CI/CD #2</span> tenta <span style="color:#7B42BC">terraform apply</span> ao mesmo tempo<br>
        → Tenta criar item no DynamoDB<br>
        → DynamoDB retorna ConditionalCheckFailedException<br>
        → <span style="color:#ef4444">Terraform aborta</span>: "Error acquiring the state lock"
      </div>
    </div>
    <div style="margin-top:8px;font-size:9.5px;color:#475569">
      Se um apply travar e o lock não for liberado: <span style="color:#7B42BC">terraform force-unlock &lt;LockID&gt;</span> (use com cautela — confirme que nenhum apply está em execução)
    </div>
  </div>
</div>`,
        caption: "State remoto é a primeira coisa a configurar antes de compartilhar o código com o time. Sem locking, dois applies simultâneos corrompem o state — e um state corrompido é muito trabalhoso de recuperar.",
      },
      {
        title: "Hierarquia de módulos — root module, child modules e providers",
        html: `<style>
.tfmod-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tfmod-box{background:#1e293b;border-radius:8px;padding:10px 14px;font-size:10px;position:relative}
.tfmod-title{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:5px}
.tfmod-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.tfmod-tip:hover .tfmod-tb{display:block}
.tfmod-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:40;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 6px 24px rgba(0,0,0,.9)}
.tfmod-tb::after{content:'';position:absolute;top:100%;left:20px;border:5px solid transparent;border-top-color:#334155}
.tfmod-arr{color:#475569;font-size:13px;text-align:center;padding:3px 0}
.tfmod-code{background:#0f172a;border-radius:5px;padding:7px 10px;font-size:9.5px;color:#94a3b8;line-height:1.8;margin-top:6px}
.tfmod-code .kw{color:#7B42BC}
.tfmod-code .str{color:#4ade80}
.tfmod-code .ref{color:#61DAFB}
</style>
<div class="tfmod-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Hierarquia de módulos — como inputs e outputs fluem</p>
  <p style="color:#475569;font-size:10px;margin:0 0 14px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span></p>

  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <!-- Coluna esquerda: árvore visual -->
    <div style="flex:1;min-width:220px">
      <!-- Root module -->
      <div class="tfmod-box" style="border:1.5px solid #7B42BC;margin-bottom:6px">
        <div class="tfmod-title" style="color:#7B42BC">Root Module (envs/prod/)</div>
        <div style="color:#94a3b8;line-height:1.7;font-size:9.5px">
          <span class="tfmod-tip">main.tf<span class="tfmod-tb">Arquivo principal que chama os módulos child. Define os recursos de alto nível. Pode chamar múltiplos módulos.</span></span>,
          <span class="tfmod-tip">variables.tf<span class="tfmod-tb">Declara os inputs do root module — valores que vêm de .tfvars ou do CI/CD (TF_VAR_nome).</span></span>,
          <span class="tfmod-tip">outputs.tf<span class="tfmod-tb">Exporta valores do root — ex: ALB DNS name, RDS endpoint, VPC ID. Visíveis no terminal após apply e acessíveis via terraform_remote_state.</span></span><br>
          <span class="tfmod-tip">backend.tf<span class="tfmod-tb">Configura onde o state fica (S3 + DynamoDB). Deve ser o primeiro arquivo criado.</span></span>
        </div>
        <div class="tfmod-code">
<span class="kw">module</span> <span class="str">"vpc"</span> {
  source  = <span class="str">"../modules/vpc"</span>
  cidr    = <span class="ref">var.vpc_cidr</span>       <span style="color:#475569"># input</span>
  azs     = <span class="ref">var.azs</span>
}
<span class="kw">module</span> <span class="str">"ecs"</span> {
  source     = <span class="str">"../modules/ecs-service"</span>
  vpc_id     = <span class="ref">module.vpc.vpc_id</span>   <span style="color:#475569"># output de vpc</span>
  subnet_ids = <span class="ref">module.vpc.private_subnets</span>
}
        </div>
      </div>

      <!-- Seta -->
      <div class="tfmod-arr">↙ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↘</div>

      <!-- Child modules -->
      <div style="display:flex;gap:8px;margin-bottom:6px">
        <div class="tfmod-box" style="flex:1;border:1.5px solid rgba(123,66,188,.5)">
          <div class="tfmod-title" style="color:#a78bfa">modules/vpc/</div>
          <div style="font-size:9px;color:#64748b;line-height:1.6">
            Cria: VPC, subnets, IGW, NAT GW, route tables<br>
            <span style="color:#61DAFB">output "vpc_id"</span><br>
            <span style="color:#61DAFB">output "private_subnets"</span>
          </div>
        </div>
        <div class="tfmod-box" style="flex:1;border:1.5px solid rgba(123,66,188,.5)">
          <div class="tfmod-title" style="color:#a78bfa">modules/ecs-service/</div>
          <div style="font-size:9px;color:#64748b;line-height:1.6">
            Cria: ECS Cluster, Task, Service, ALB, Target Group<br>
            <span style="color:#61DAFB">output "alb_dns"</span><br>
            <span style="color:#61DAFB">output "service_arn"</span>
          </div>
        </div>
      </div>

      <!-- Providers -->
      <div class="tfmod-arr">↓</div>
      <div class="tfmod-box" style="border:1.5px solid rgba(255,153,0,.4);margin-top:6px">
        <div class="tfmod-title" style="color:#FF9900">Providers (plugins)</div>
        <div style="font-size:9px;color:#64748b;line-height:1.6">
          Cada resource type pertence a um provider.<br>
          <span class="tfmod-tip" style="color:#94a3b8">aws_instance<span class="tfmod-tb">Resource do provider hashicorp/aws. Terraform baixa o plugin do Registry e usa as credenciais AWS para chamar a API EC2.</span></span>,
          <span class="tfmod-tip" style="color:#94a3b8">aws_s3_bucket<span class="tfmod-tb">Mesmo provider aws. Cada provider é um binário separado que implementa CRUD para os recursos daquele serviço.</span></span> → provider hashicorp/aws<br>
          kubernetes_deployment → provider hashicorp/kubernetes
        </div>
      </div>
    </div>

    <!-- Coluna direita: fluxo de variáveis -->
    <div style="flex:1;min-width:220px">
      <div class="tfmod-box" style="border:1.5px solid #334155;margin-bottom:8px">
        <div class="tfmod-title" style="color:#94a3b8">Variáveis — como fluem</div>
        <div class="tfmod-code" style="font-size:9px">
<span style="color:#475569"># 1. Declaração (variables.tf)</span>
<span class="kw">variable</span> <span class="str">"vpc_cidr"</span> {
  type        = string
  default     = <span class="str">"10.0.0.0/16"</span>
  description = <span class="str">"CIDR da VPC"</span>
}

<span style="color:#475569"># 2. Valores (prod.tfvars)</span>
vpc_cidr = <span class="str">"10.1.0.0/16"</span>

<span style="color:#475569"># 3. Passagem para módulo</span>
<span class="kw">module</span> <span class="str">"vpc"</span> {
  cidr = <span class="ref">var.vpc_cidr</span>
}

<span style="color:#475569"># 4. Dentro do módulo</span>
resource <span class="str">"aws_vpc" "main"</span> {
  cidr_block = <span class="ref">var.cidr</span>  <span style="color:#475569"># local var</span>
}

<span style="color:#475569"># 5. Output do módulo</span>
<span class="kw">output</span> <span class="str">"vpc_id"</span> {
  value = <span class="ref">aws_vpc.main.id</span>
}
        </div>
      </div>

      <div class="tfmod-box" style="border:1.5px solid #334155">
        <div class="tfmod-title" style="color:#94a3b8">Passagem de variáveis — 4 formas</div>
        <div style="font-size:9px;color:#64748b;line-height:1.8">
          <span style="color:#4ade80">1.</span> <span style="color:#94a3b8">-var="vpc_cidr=10.0.0.0/16"</span> (CLI)<br>
          <span style="color:#4ade80">2.</span> <span style="color:#94a3b8">prod.tfvars</span> (arquivo, -var-file)<br>
          <span style="color:#4ade80">3.</span> <span style="color:#94a3b8">TF_VAR_vpc_cidr</span> (env var — CI/CD)<br>
          <span style="color:#4ade80">4.</span> <span style="color:#94a3b8">default</span> na declaração (fallback)
        </div>
      </div>
    </div>
  </div>
</div>`,
        caption: "Módulos são a unidade de reutilização do Terraform. Um bom módulo aceita inputs, esconde a complexidade interna e exporta só o que o chamador precisa via outputs.",
      },
    ],
    keypoints: [
      {
        title: "HCL — a linguagem do Terraform",
        body: "HCL (HashiCorp Configuration Language) é declarativo: você descreve o que quer, não como criar. Blocos principais: resource (o que criar), data (ler recurso existente), variable (input), output (exportar valor), local (valor computado interno), module (chamar outro módulo), provider (configurar o plugin), terraform (configurações globais — versão, backend). Expressões: referências com resource_type.resource_name.attribute, condicionais com condition ? a : b, loops com for_each e count.",
        code: `# resource — cria/gerencia um recurso
resource "aws_s3_bucket" "assets" {
  bucket = "minha-empresa-assets-\${var.env}"
  tags   = local.common_tags
}

# data — lê recurso existente sem gerenciar
data "aws_vpc" "default" {
  default = true
}

# local — valor computado interno
locals {
  common_tags = {
    Environment = var.env
    Project     = "minha-app"
    ManagedBy   = "terraform"
  }
}

# output — exporta valores para outros módulos ou console
output "bucket_name" {
  value       = aws_s3_bucket.assets.id
  description = "Nome do bucket S3 de assets"
}`,
      },
      {
        title: "State — o coração do Terraform",
        body: "O state (terraform.tfstate) é o mapeamento entre o HCL e os recursos reais na cloud. Sem ele, Terraform não sabe o que já existe. Nunca edite manualmente — use comandos: terraform state list (listar recursos), terraform state show (ver detalhes), terraform state mv (renomear), terraform state rm (remover do state sem destruir), terraform import (adicionar recurso existente). State contém senhas, IPs e ARNs — nunca commite no git. Use remote backend com criptografia desde o primeiro dia.",
        code: `# Comandos de gerenciamento de state
terraform state list                          # lista todos os recursos
terraform state show aws_s3_bucket.assets     # detalhes de um recurso
terraform state mv aws_s3_bucket.old aws_s3_bucket.assets  # renomear
terraform state rm aws_security_group.legacy  # remove do state (NÃO destrói)

# Importar recurso criado manualmente
terraform import aws_s3_bucket.assets meu-bucket-existente

# Terraform 1.5+ — bloco import declarativo no HCL
import {
  to = aws_s3_bucket.assets
  id = "meu-bucket-existente"
}`,
      },
      {
        title: "Módulos — reutilização e organização",
        body: "Módulo é qualquer diretório com arquivos .tf. O módulo raiz é o diretório onde você roda terraform. Módulos child são chamados via bloco module com source apontando para caminho local, git ou Terraform Registry. Sempre versione módulos externos — uma mudança upstream sem version fixa quebra toda a infra. Variáveis de input e outputs são a interface pública do módulo — defina com description e type. Módulos bem desenhados são testáveis e reutilizáveis entre ambientes.",
        code: `# Chamando módulo local
module "vpc" {
  source = "../modules/vpc"
  cidr   = "10.0.0.0/16"
  azs    = ["us-east-1a", "us-east-1b"]
}

# Módulo do Terraform Registry (sempre fixe versão!)
module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "~> 9.0"  # aceita 9.x, mas não 10.x

  name    = "minha-app-alb"
  vpc_id  = module.vpc.vpc_id
  subnets = module.vpc.public_subnets
}

# Módulo do git (ref = tag ou commit hash)
module "ecs_service" {
  source = "git::https://github.com/minha-empresa/tf-modules.git//ecs-service?ref=v2.3.1"
  ...
}`,
      },
      {
        title: "for_each e count — recursos dinâmicos",
        body: "count cria N cópias de um recurso. for_each cria uma instância por item de um map ou set. Prefira for_each quando os recursos têm identidade própria — remover um item de count[2] remove e recria o count[3], enquanto for_each remove só o item específico. dynamic block gera blocos internos de forma programática (ex: múltiplas regras de Security Group). locals e for expressions permitem transformar estruturas de dados antes de usar.",
        code: `# for_each com map — cada subnet tem nome e AZ
resource "aws_subnet" "private" {
  for_each          = var.private_subnets  # map: { "us-east-1a" = "10.0.1.0/24" }
  vpc_id            = aws_vpc.main.id
  cidr_block        = each.value
  availability_zone = each.key
  tags = { Name = "private-\${each.key}" }
}

# dynamic block — regras de SG dinâmicas
resource "aws_security_group" "app" {
  name   = "app-sg"
  vpc_id = var.vpc_id

  dynamic "ingress" {
    for_each = var.ingress_rules  # lista de { port, protocol, cidr }
    content {
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = ingress.value.protocol
      cidr_blocks = [ingress.value.cidr]
    }
  }
}`,
      },
      {
        title: "Lifecycle rules — controle de criação e destruição",
        body: "lifecycle é um bloco dentro de resource que altera o comportamento padrão do Terraform. create_before_destroy: cria o novo antes de destruir o antigo — essencial para recursos com nome único (certificados ACM, target groups). prevent_destroy: impede terraform destroy — proteção para bancos e buckets de produção. ignore_changes: ignora campos específicos no diff (útil para tags gerenciadas externamente ou campos que mudam automaticamente pela AWS).",
        code: `resource "aws_acm_certificate" "api" {
  domain_name       = "api.minha-empresa.com"
  validation_method = "DNS"

  lifecycle {
    # Cria o novo certificado antes de destruir o antigo
    # Necessário pois ALB deve sempre ter um certificado válido
    create_before_destroy = true
  }
}

resource "aws_db_instance" "prod" {
  identifier = "prod-postgres"
  ...

  lifecycle {
    # Terraform destroy nesta resource vai FALHAR com erro explicativo
    prevent_destroy = true

    # Ignore mudanças de senha feitas fora do Terraform (Secrets Manager rotation)
    ignore_changes = [password]
  }
}`,
      },
      {
        title: "Providers — configuração e versionamento",
        body: "Provider é um plugin que implementa o CRUD de recursos de um serviço específico. Versionado em required_providers — sempre fixe a versão com constraints. .terraform.lock.hcl armazena os hashes exatos dos providers baixados — commite esse arquivo no git para garantir reprodutibilidade em toda a equipe. Para AWS: configure credenciais via environment variables (AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY) ou IAM role (preferível em CI/CD).",
        code: `# versions.tf — configuração de providers
terraform {
  required_version = ">= 1.7, < 2.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"  # aceita 5.x, não 6.x
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "aws" {
  region = var.aws_region

  # Alias — múltiplas regiões no mesmo Terraform
  alias = "us-east-1"
  assume_role {
    role_arn = "arn:aws:iam::123456789012:role/TerraformDeployRole"
  }

  default_tags {
    tags = { ManagedBy = "terraform", Env = var.env }
  }
}`,
      },
      {
        title: "Workspaces vs diretórios separados",
        body: "Workspaces permitem múltiplos states com o mesmo código (terraform workspace new staging). São úteis para ambientes efêmeros (PR environments). Para prod/staging/dev em empresas, prefira diretórios separados — cada ambiente tem seu próprio state e seu próprio conjunto de tfvars. Motivo: workspaces compartilham o mesmo backend S3 e é mais fácil fazer apply no ambiente errado acidentalmente. Módulos reutilizáveis são a ponte entre as abordagens.",
        code: `# Estrutura com diretórios separados (mais segura para prod)
infra/
  modules/
    vpc/           # módulo reutilizável
    ecs-service/   # módulo reutilizável
    rds/           # módulo reutilizável
  envs/
    dev/
      main.tf      # usa módulos, var env=dev
      dev.tfvars
      backend.tf   # state em s3://tf-state/dev/
    staging/
      main.tf
      staging.tfvars
      backend.tf   # state em s3://tf-state/staging/
    prod/
      main.tf
      prod.tfvars
      backend.tf   # state em s3://tf-state/prod/

# Cada diretório = state independente
# apply em dev NÃO toca staging ou prod`,
      },
      {
        title: "CI/CD com Terraform — fluxo seguro",
        body: "Em CI/CD, o Terraform deve rodar sem interação humana, mas com portões de segurança. Fluxo: PR → terraform plan (comentado no PR via GitHub Actions + tfcmt) → revisão humana → merge → terraform apply automático (ou manual com aprovação). Nunca automatize o apply sem o plan ter sido revisado em produção. Use OpenID Connect (OIDC) para que o CI/CD assuma uma IAM Role sem credenciais de longa duração armazenadas em secrets.",
        code: `# .github/workflows/terraform.yml (trecho)
jobs:
  plan:
    runs-on: ubuntu-latest
    permissions:
      id-token: write  # OIDC
      contents: read
      pull-requests: write
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/TerraformPlanRole
          aws-region: us-east-1
          # Sem AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY! Usa OIDC.

      - run: terraform init
      - run: terraform plan -out=tfplan -no-color > plan.txt
      - uses: actions/github-script@v7
        with:
          script: |
            const plan = require('fs').readFileSync('plan.txt', 'utf8')
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              body: \`\\\`\\\`\\\`hcl\n\${plan}\n\\\`\\\`\\\`\`
            })`,
      },
      {
        title: "Testing — terratest e checkov",
        body: "Terratest é uma biblioteca Go para testes de integração de módulos Terraform: provisiona infra real, valida o comportamento com asserções Go, destrói. É lento (minutos) mas é o teste mais confiável. checkov é um linter de segurança estático para HCL — detecta S3 buckets públicos, SGs abertos, criptografia desabilitada, sem tags. Roda em segundos, integra no CI antes do plan. terraform validate verifica sintaxe HCL sem acessar a cloud.",
        code: `// Terratest — Go test para módulo de S3
func TestS3Module(t *testing.T) {
  opts := &terraform.Options{
    TerraformDir: "../modules/s3",
    Vars: map[string]interface{}{
      "bucket_name": "test-" + random.UniqueId(),
      "env": "test",
    },
  }
  defer terraform.Destroy(t, opts)  // cleanup automático
  terraform.InitAndApply(t, opts)

  bucketName := terraform.Output(t, opts, "bucket_name")
  assert.Equal(t, true, aws.DoesBucketExist(t, "us-east-1", bucketName))

  // Verifica que o bucket não é público
  aclOutput := aws.GetS3BucketPublicAccessBlock(t, "us-east-1", bucketName)
  assert.Equal(t, true, *aclOutput.BlockPublicAcls)
}`,
      },
    ],
    cheatsheet: {
      title: "Terraform Cheatsheet — HCL syntax, CLI e boas práticas",
      html: `<style>
.tfcs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tfcs-h2{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#7B42BC;font-weight:700;margin:16px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(123,66,188,.2)}
.tfcs-h2:first-child{margin-top:0}
.tfcs-code{background:#1e293b;border-radius:6px;padding:10px 14px;font-size:10px;color:#94a3b8;line-height:2;overflow-x:auto;margin-bottom:4px}
.tfcs-code .kw{color:#7B42BC}
.tfcs-code .str{color:#4ade80}
.tfcs-code .ref{color:#61DAFB}
.tfcs-code .cmt{color:#475569}
.tfcs-code .cmd{color:#FF9900;font-weight:700}
.tfcs-table{width:100%;border-collapse:collapse;font-size:10px}
.tfcs-table th{text-align:left;color:#64748b;font-weight:600;padding:4px 8px;border-bottom:1px solid #1e293b;font-size:9px;letter-spacing:.06em;text-transform:uppercase}
.tfcs-table td{padding:5px 8px;border-bottom:1px solid #0f172a;color:#94a3b8;vertical-align:top;line-height:1.5}
.tfcs-table tr:last-child td{border-bottom:none}
.tfcs-table td:first-child{color:#e2e8f0;white-space:nowrap;font-weight:500}
.tfcs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:500px){.tfcs-grid{grid-template-columns:1fr}}
</style>
<div class="tfcs-wrap">
  <p style="font-size:12px;font-weight:600;color:#e2e8f0;margin:0 0 4px">Terraform Cheatsheet</p>
  <p style="font-size:10px;color:#475569;margin:0 0 14px">HCL syntax, CLI commands e boas práticas</p>

  <div class="tfcs-h2">HCL — blocos principais</div>
  <div class="tfcs-grid">
    <div class="tfcs-code">
<span class="cmt"># resource — o que criar</span>
<span class="kw">resource</span> <span class="str">"aws_instance" "app"</span> {
  ami           = <span class="ref">var.ami_id</span>
  instance_type = <span class="str">"t3.micro"</span>
  tags          = <span class="ref">local.common_tags</span>
}

<span class="cmt"># data — ler existente</span>
<span class="kw">data</span> <span class="str">"aws_ami" "ubuntu"</span> {
  most_recent = <span class="str">true</span>
  owners      = [<span class="str">"099720109477"</span>]
  filter {
    name   = <span class="str">"name"</span>
    values = [<span class="str">"ubuntu/images/hvm-ssd/ubuntu-*"</span>]
  }
}
    </div>
    <div class="tfcs-code">
<span class="cmt"># variable — input</span>
<span class="kw">variable</span> <span class="str">"env"</span> {
  type        = string
  description = <span class="str">"Ambiente: dev, staging, prod"</span>
  validation {
    condition     = contains([<span class="str">"dev","staging","prod"</span>], <span class="ref">var.env</span>)
    error_message = <span class="str">"Valor inválido."</span>
  }
}

<span class="cmt"># local — computado internamente</span>
<span class="kw">locals</span> {
  name_prefix = <span class="str">"minha-app-\${var.env}"</span>
  common_tags = {
    Env       = <span class="ref">var.env</span>
    ManagedBy = <span class="str">"terraform"</span>
  }
}
    </div>
    <div class="tfcs-code">
<span class="cmt"># output — exportar valor</span>
<span class="kw">output</span> <span class="str">"alb_dns"</span> {
  value       = <span class="ref">aws_lb.main.dns_name</span>
  description = <span class="str">"DNS do ALB para configurar Route53"</span>
}

<span class="cmt"># module — chamar child module</span>
<span class="kw">module</span> <span class="str">"vpc"</span> {
  source  = <span class="str">"terraform-aws-modules/vpc/aws"</span>
  version = <span class="str">"~> 5.0"</span>
  cidr    = <span class="str">"10.0.0.0/16"</span>
  azs     = <span class="ref">var.azs</span>
}
    </div>
    <div class="tfcs-code">
<span class="cmt"># for_each — recursos dinâmicos</span>
resource <span class="str">"aws_subnet" "private"</span> {
  for_each   = <span class="ref">var.subnets</span>  <span class="cmt"># map</span>
  vpc_id     = <span class="ref">aws_vpc.main.id</span>
  cidr_block = <span class="ref">each.value</span>
  availability_zone = <span class="ref">each.key</span>
}

<span class="cmt"># count — N cópias</span>
resource <span class="str">"aws_instance" "worker"</span> {
  count         = <span class="ref">var.worker_count</span>
  instance_type = <span class="str">"t3.medium"</span>
  tags = { Name = <span class="str">"worker-\${count.index}"</span> }
}
    </div>
  </div>

  <div class="tfcs-h2">CLI Commands</div>
  <div class="tfcs-code">
<span class="cmd">terraform init</span>          <span class="cmt"># baixa providers e módulos, configura backend</span>
<span class="cmd">terraform init -upgrade</span> <span class="cmt"># atualiza providers dentro das constraints</span>
<span class="cmd">terraform validate</span>      <span class="cmt"># valida sintaxe HCL sem acessar a cloud</span>
<span class="cmd">terraform fmt</span>           <span class="cmt"># formata .tf files (use -recursive para diretórios)</span>
<span class="cmd">terraform plan</span>          <span class="cmt"># calcula diff, exibe, não aplica</span>
<span class="cmd">terraform plan -out=tfplan</span>       <span class="cmt"># salva plan para apply determinístico</span>
<span class="cmd">terraform plan -target=module.vpc</span> <span class="cmt"># plan só de um módulo/resource</span>
<span class="cmd">terraform apply</span>                   <span class="cmt"># pede confirmação antes de aplicar</span>
<span class="cmd">terraform apply tfplan</span>            <span class="cmt"># aplica plan salvo (sem confirmação)</span>
<span class="cmd">terraform apply -auto-approve</span>     <span class="cmt"># sem confirmação (CI apenas)</span>
<span class="cmd">terraform destroy</span>       <span class="cmt"># DESTRÓI todos os recursos — confirme o plan!</span>
<span class="cmd">terraform output</span>        <span class="cmt"># exibe outputs do state atual</span>
<span class="cmd">terraform output -json</span>  <span class="cmt"># outputs em JSON (para scripts)</span>
<span class="cmd">terraform state list</span>    <span class="cmt"># lista recursos no state</span>
<span class="cmd">terraform state show aws_instance.app</span>  <span class="cmt"># detalhes do recurso</span>
<span class="cmd">terraform import aws_s3_bucket.data meu-bucket</span>  <span class="cmt"># importar existente</span>
<span class="cmd">terraform workspace new staging</span>  <span class="cmt"># criar workspace</span>
<span class="cmd">terraform workspace select prod</span>  <span class="cmt"># mudar workspace</span>
  </div>

  <div class="tfcs-h2">Lifecycle rules</div>
  <table class="tfcs-table">
    <tr><th>Rule</th><th>O que faz</th><th>Quando usar</th></tr>
    <tr><td>create_before_destroy</td><td>Cria o novo antes de destruir o antigo</td><td>Certificados ACM, Target Groups, SGs com dependências</td></tr>
    <tr><td>prevent_destroy</td><td>Bloqueia terraform destroy com erro</td><td>RDS de produção, S3 buckets com dados críticos</td></tr>
    <tr><td>ignore_changes</td><td>Ignora diff em campos específicos</td><td>Campos modificados por auto-scaling, senhas rotacionadas externamente</td></tr>
    <tr><td>replace_triggered_by</td><td>Força replace quando outro recurso muda</td><td>Forçar recriação de EC2 quando AMI base é atualizada</td></tr>
  </table>

  <div class="tfcs-h2">Boas práticas de estrutura</div>
  <div class="tfcs-grid">
    <div>
      <table class="tfcs-table">
        <tr><th>Arquivo</th><th>Conteúdo</th></tr>
        <tr><td>main.tf</td><td>Resources e módulos principais</td></tr>
        <tr><td>variables.tf</td><td>Declarações de variáveis</td></tr>
        <tr><td>outputs.tf</td><td>Outputs exportados</td></tr>
        <tr><td>versions.tf</td><td>required_providers e terraform block</td></tr>
        <tr><td>backend.tf</td><td>Configuração do backend remoto</td></tr>
        <tr><td>*.tfvars</td><td>Valores por ambiente (NÃO commite secrets)</td></tr>
      </table>
    </div>
    <div>
      <table class="tfcs-table">
        <tr><th>Prática</th><th>Por quê</th></tr>
        <tr><td>Versione providers</td><td>Reprodutibilidade — sem surpresas em team</td></tr>
        <tr><td>Remote state desde o dia 1</td><td>State local = perda garantida em time</td></tr>
        <tr><td>Módulos com versão fixa</td><td>Upstream quebra = infra quebra</td></tr>
        <tr><td>prevent_destroy em prod DB</td><td>Terraform destroy em prod = desastre</td></tr>
        <tr><td>default_tags no provider AWS</td><td>Todos os recursos taggeados sem esforço</td></tr>
        <tr><td>OIDC no CI — sem access keys</td><td>Sem credenciais de longa duração em secrets</td></tr>
      </table>
    </div>
  </div>
</div>`,
    },
    mnemonics: [
      {
        label: "IPADS — ciclo de vida Terraform",
        trick: "Init, Plan, Apply, Destroy, State",
        explanation: "Os 5 comandos fundamentais do Terraform em ordem de uso. Init uma vez por workspace. Plan antes de qualquer Apply. Destroy com muito cuidado. State é o que o Terraform lê para calcular o diff — sem ele, nada funciona.",
      },
      {
        label: "SG do State: S3 guarda, DynamoDB bloqueia",
        trick: "S3 = Storage do state. DynamoDB = trava (Lock).",
        explanation: "S3 armazena o arquivo terraform.tfstate (durável, versionado, criptografado). DynamoDB evita que dois applies rodem ao mesmo tempo com uma trava distribuída. Sempre os dois juntos — um sem o outro não é suficiente.",
      },
    ],
    gotchas: [
      "State em disco local em time — se dois devs rodam terraform apply ao mesmo tempo sem locking, o state é corrompido e a recuperação é manual e trabalhosa. Configure remote backend com DynamoDB locking antes do primeiro apply em time.",
      "terraform destroy sem revisar o plan — destroy sem -target destrói TUDO na stack, incluindo o banco de produção. Use prevent_destroy em recursos críticos e sempre revise o plan de destroy antes de confirmar.",
      "Módulos sem versionamento de fonte — source = 'git::url' sem ?ref= sempre pega a última versão. Uma breaking change upstream quebra toda a infra na próxima vez que alguém rodar terraform init -upgrade.",
      "Variáveis sensíveis visíveis no state — mesmo com sensitive=true, o valor fica em plaintext no tfstate. Nunca coloque passwords ou API keys como variáveis Terraform — use Secrets Manager e data sources para lê-los.",
      "apply sem revisar o plan em CI — automatize o plan (postar diff no PR), mas exija aprovação humana antes do apply em produção. Apply automático em main sem revisão é risco desnecessário.",
      "Hardcode de account ID e region no código — torna o código não-portável. Use data.aws_caller_identity.current.account_id e data.aws_region.current.name como data sources.",
      "for_each com lista em vez de map — for_each requer set ou map de strings, não list. Converter: toset(var.lista). Motivo: lista usa índice [0,1,2] — remover item do meio muda os índices e recria recursos errados.",
      "Ignorar o .terraform.lock.hcl — esse arquivo deve ser commitado no git. Ele garante que todos no time (e o CI) usam exatamente os mesmos hashes de providers, tornando o ambiente reprodutível.",
    ],
    interview: [
      {
        q: "Como gerenciaria o state do Terraform em um time com múltiplos desenvolvedores?",
        a: "<p><strong>Remote backend obrigatório:</strong> S3 com DynamoDB locking. State no S3 (versionado, criptografado com KMS). DynamoDB evita dois applies simultâneos com locking distribuído.</p><p><strong>IAM:</strong> bucket de state acessível apenas pela IAM Role do CI/CD e por admins. Devs não têm acesso direto — aplicam mudanças via PR → pipeline.</p><p><strong>CI/CD flow:</strong> PR → terraform plan (postado como comentário no PR via tfcmt) → revisão humana → merge → apply automático (staging) ou manual com aprovação (prod).</p><p><strong>State separado por ambiente:</strong> diretórios separados (infra/envs/dev, infra/envs/prod) cada um com seu backend.tf apontando para key diferente no S3. Apply em dev não pode tocar prod por construção.</p><p>Nunca commitar state no git — contém ARNs, IPs, e em casos descuidados, passwords.</p>",
        level: "pleno",
      },
      {
        q: "O que é state locking e o que acontece se o lock não for liberado?",
        a: "<p>State locking garante que apenas um terraform apply roda por vez para um dado state. Sem locking, dois applies simultâneos leem o mesmo state, fazem mudanças em paralelo e sobrescrevem o state um do outro — resultando em state corrompido.</p><p><strong>Com DynamoDB:</strong> antes de modificar o state, Terraform cria um item no DynamoDB com o LockID. Se outro process tentar criar o mesmo item, DynamoDB retorna ConditionalCheckFailedException e o Terraform aborta com 'Error acquiring the state lock'.</p><p><strong>Lock não liberado:</strong> pode acontecer se o processo for morto durante o apply (kill -9, instância CI crashou). O lock fica no DynamoDB indefinidamente. Solução: terraform force-unlock &lt;LockID&gt;. O LockID está na mensagem de erro e também pode ser lido diretamente no DynamoDB. Confirme antes que nenhum apply está em execução.</p>",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre count e for_each? Quando usar cada um?",
        a: "<p><strong>count:</strong> cria N instâncias do recurso identificadas por índice (0, 1, 2...). Problema: se você remove um item do meio da lista, os índices subsequentes mudam e Terraform recria todos os recursos após o índice removido. Evite para recursos com identidade própria.</p><p><strong>for_each:</strong> cria uma instância por key de um map ou set. Cada instância é identificada pela key — remover uma key só remove aquela instância. Mais seguro e mais explícito.</p><p>Use count para: recursos homogêneos sem identidade própria (ex: 3 instâncias EC2 idênticas de um cluster). Use for_each para: qualquer recurso com nome, configuração ou identidade própria (subnets por AZ, DNS records por domínio, security groups por serviço).</p>",
        tip: "Se você usar uma lista com for_each, converta para set: for_each = toset(var.lista). Sets não têm índice — remoção de item remove só aquele.",
        level: "pleno",
      },
      {
        q: "Terraform vs CloudFormation vs CDK — quando usar cada?",
        a: "<p><strong>Terraform:</strong> HCL declarativo, multi-cloud (AWS, GCP, Azure, Kubernetes, GitHub, Datadog, etc.), 1.000+ providers, state próprio (S3). Padrão de mercado para times multi-cloud ou que querem portabilidade. Use como default.</p><p><strong>CloudFormation:</strong> nativo AWS, sem state separado (AWS gerencia), suporte imediato a novos serviços AWS (antes que o Terraform tenha o provider atualizado). Mais verboso (YAML/JSON). Use quando a integração AWS nativa importa mais que portabilidade.</p><p><strong>CDK:</strong> compila para CloudFormation. IaC em TypeScript/Python/Go. L2/L3 constructs reduzem drasticamente o código necessário. Times TypeScript que já usam a linguagem no app podem compartilhar tipos e utilitários. Use quando a expressividade da linguagem é necessária e o stack é 100% AWS.</p>",
        level: "pleno",
      },
      {
        q: "O que é terraform import e qual o fluxo correto para usá-lo?",
        a: "<p>terraform import associa um recurso existente na cloud (criado manualmente ou por outro sistema) ao state do Terraform, permitindo gerenciá-lo com IaC daqui em diante.</p><p><strong>Fluxo clássico (pré-1.5):</strong> (1) Escreva o bloco resource correspondente no HCL com a configuração que você acha que o recurso tem. (2) terraform import aws_s3_bucket.data meu-bucket-existente — Terraform adiciona o recurso ao state. (3) terraform plan — deve mostrar zero diff se o HCL está correto. Se houver diff, ajuste o HCL e repita o plan até zerar.</p><p><strong>Terraform 1.5+ — bloco import declarativo:</strong> adicione um bloco import { to = aws_s3_bucket.data; id = 'meu-bucket' } no HCL. terraform plan já mostra a importação. terraform generate-config-out=generated.tf gera o HCL automaticamente (experimental — revise antes de usar).</p><p>Armadilha: o ID do recurso no import é o ID real da cloud (bucket name para S3, instance-id para EC2, ARN para alguns serviços) — não é o nome do Terraform.</p>",
        level: "senior",
      },
      {
        q: "Como estruturaria um repositório Terraform para múltiplos ambientes e equipes?",
        a: "<p>Estrutura por diretório com módulos centralizados:</p><p><code>infra/<br>&nbsp;&nbsp;modules/<br>&nbsp;&nbsp;&nbsp;&nbsp;vpc/         # módulo VPC reutilizável<br>&nbsp;&nbsp;&nbsp;&nbsp;ecs-service/ # módulo ECS + ALB<br>&nbsp;&nbsp;&nbsp;&nbsp;rds/         # módulo RDS + Proxy<br>&nbsp;&nbsp;envs/<br>&nbsp;&nbsp;&nbsp;&nbsp;dev/main.tf  # usa módulos, state em s3://tf-state/dev/<br>&nbsp;&nbsp;&nbsp;&nbsp;staging/     # state em s3://tf-state/staging/<br>&nbsp;&nbsp;&nbsp;&nbsp;prod/        # state em s3://tf-state/prod/</code></p><p>Módulos versionados por git tag. Cada ambiente tem state isolado — apply em dev não pode afetar prod por construção. Módulos têm README, examples e testes (Terratest).</p><p>Para múltiplas equipes: cada time tem seu diretório de módulos e envs, com IAM Roles separadas por time/ambiente. Service Control Policies (SCPs) no AWS Organizations para guardrails centralizados.</p>",
        level: "senior",
      },
      {
        q: "Explique create_before_destroy e quando é necessário.",
        a: "<p>Por padrão, Terraform destrói o recurso antigo antes de criar o novo (destroy → create). Para recursos com nome único, isso causa erro (conflict) pois o nome já existe. Para recursos referenciados por outros, causa downtime.</p><p>create_before_destroy = true inverte: (1) cria o novo recurso. (2) atualiza todas as referências para o novo. (3) destrói o antigo. Zero downtime para substituições.</p><p><strong>Casos onde é necessário:</strong></p><p>- ACM Certificate: ALB sempre precisa de um certificado válido. Se o antigo for destruído primeiro, há gap de cobertura.</p><p>- Launch Template: novo template criado, ASG atualizado para usar o novo, antigo deletado.</p><p>- Security Groups com dependências circulares: SG-A referencia SG-B e vice-versa. Criar um antes de destruir o outro quebra o ciclo.</p><p><strong>Cuidado:</strong> create_before_destroy pode falhar se o recurso tem nome fixo sem suffixo aleatório — use random_pet ou random_id para names únicos.</p>",
        level: "senior",
      },
      {
        q: "Como lidar com drift de infraestrutura no Terraform?",
        a: "<p><strong>Drift</strong> = diferença entre o state do Terraform e o estado real da cloud. Causas: mudança manual no console AWS, outra ferramenta modificando o recurso, AWS modificando automaticamente campos.</p><p><strong>Detecção:</strong> terraform plan sempre detecta drift — mostra o que o Terraform faria para reconciliar. terraform refresh atualiza o state com o estado real sem aplicar mudanças (equivalente a um plan que só lê).</p><p><strong>Resolução:</strong></p><p>- Drift intencional (mudança manual válida): use ignore_changes no campo específico, ou importe o recurso atualizado.</p><p>- Drift indesejado (alguém mudou manualmente): o próximo apply reverte a mudança. Previna com IAM — bloqueie acesso manual em produção, só CI/CD pode aplicar mudanças.</p><p>- Drift em campos auto-modificados pela AWS (ex: AWS adiciona tags automaticamente): ignore_changes = [tags] resolve sem ruído nos plans.</p><p><strong>Prevenção com AWS Config:</strong> monitora compliance de configuração continuamente e alerta sobre mudanças não gerenciadas.</p>",
        level: "senior",
      },
      {
        q: "Como testaria módulos Terraform antes de aplicar em produção?",
        a: "<p><strong>Camadas de teste em ordem de velocidade:</strong></p><p><strong>1. terraform validate + fmt (segundos):</strong> valida sintaxe HCL e formatting. Integrar em pre-commit hook.</p><p><strong>2. checkov / tfsec / trivy (segundos):</strong> análise estática de segurança — detecta S3 públicos, SGs abertos, criptografia desabilitada, sem MFA. Roda no CI antes do plan.</p><p><strong>3. terraform plan (30s-2min):</strong> calcula diff real contra a cloud. Postado no PR como comentário. Se mostra 0 adds/changes/destroys no module isolado, a sintaxe e a lógica estão corretas.</p><p><strong>4. Terratest (minutos):</strong> testes de integração Go que provisionam infra real, fazem asserções (bucket existe? endpoint responde? SG correto?) e destroem. Roda em stacks efêmeras no CI — cada PR cria e destrói um ambiente temporário.</p><p><strong>5. Canary deploy:</strong> aplica em dev, verifica por 1h, aplica em staging, verifica, aplica em prod.</p>",
        level: "senior",
      },
      {
        q: "O que são workspaces e quando preferiria diretórios separados?",
        a: "<p><strong>Workspaces:</strong> múltiplos states com o mesmo código HCL. terraform workspace new staging cria um workspace — o state fica em s3://bucket/env:/staging/terraform.tfstate. Você usa ${terraform.workspace} no código para diferenciar ambientes.</p><p><strong>Quando usar workspaces:</strong> ambientes efêmeros de PR (criar e destruir por feature branch), ambientes muito similares sem variação de infraestrutura.</p><p><strong>Por que preferir diretórios separados para dev/staging/prod:</strong></p><p>- Workspaces compartilham o mesmo backend e código — é mais fácil fazer apply no workspace errado por acidente.</p><p>- Diretórios separados têm IAM policies separadas — CI/CD de dev não tem credenciais para tocar prod por construção.</p><p>- Diferenças entre prod e dev (tamanho de instância, Multi-AZ, número de réplicas) ficam em tfvars separados — mais explícito e revisável.</p><p>- Blast radius contido — um erro em dev não pode afetar o state de prod.</p>",
        level: "senior",
      },
      {
        q: "Como implementaria um módulo VPC reutilizável e bem documentado?",
        a: "<p>Interface do módulo (variables.tf): vpc_cidr (string), azs (list(string)), private_subnets (map(string)), public_subnets (map(string)), enable_nat_gateway (bool, default true), tags (map(string)).</p><p>Resources internos: aws_vpc, aws_subnet (public + private com for_each), aws_internet_gateway, aws_nat_gateway (por AZ se HA), aws_route_table (public + private), aws_route_table_association.</p><p>Outputs: vpc_id, public_subnet_ids, private_subnet_ids, nat_gateway_ids, vpc_cidr.</p><p>Qualidade: README com exemplo de uso, validation blocks nas variáveis, tags passadas para todos os recursos, lifecycle prevent_destroy no VPC, Terratest que verifica que subnets são criadas em AZs corretas e que NAT Gateway existe quando ativado.</p><p>Publicação: versionado com git tags (v1.0.0, v1.1.0), CHANGELOG.md, source no Terraform Registry ou repositório privado da empresa.</p>",
        tip: "O Terraform Registry tem módulos prontos (terraform-aws-modules/vpc/aws) — use como referência de API e implemente internamente para ganhar controle e confiança.",
        level: "senior",
      },
      {
        q: "Como configuraria CI/CD seguro para Terraform sem access keys hardcoded?",
        a: "<p><strong>OIDC (OpenID Connect):</strong> GitHub Actions (ou qualquer CI moderno) suporta OIDC — o CI prova para a AWS sua identidade sem credenciais de longa duração. A AWS assume uma IAM Role para o job, com credenciais temporárias (STS, válidas por 1h).</p><p><strong>Configuração:</strong> (1) Criar IAM OIDC Provider para token.actions.githubusercontent.com na conta AWS. (2) Criar IAM Role com trust policy que permite assumir só pelo repositório e branch corretos (condition: sub = repo:minha-empresa/infra:ref:refs/heads/main). (3) No GitHub Actions: permissions: id-token: write + uses: aws-actions/configure-aws-credentials@v4 com role-to-assume.</p><p><strong>Permissões mínimas:</strong> Role de plan com read-only. Role de apply com permissões para criar/modificar os recursos específicos. Nunca AdministratorAccess para CI.</p><p><strong>Separação de preocupações:</strong> plan roda em todo PR, apply roda só após merge em main com environment protection rules que exigem aprovação manual para prod.</p>",
        level: "senior",
      },
    ],
    resources: [
      { title: "Terraform docs", url: "https://developer.hashicorp.com/terraform/docs", kind: "docs" },
      { title: "Terraform: Up and Running — Yevgeniy Brikman (O'Reilly)", url: "https://www.terraformupandrunning.com/", kind: "livro" },
      { title: "Terraform Registry", url: "https://registry.terraform.io/", kind: "pratica" },
      { title: "terraform-aws-modules (VPC, ECS, RDS)", url: "https://github.com/terraform-aws-modules", kind: "pratica" },
      { title: "Terratest", url: "https://terratest.gruntwork.io/", kind: "docs" },
      { title: "checkov — static analysis", url: "https://www.checkov.io/", kind: "pratica" },
    ],
  },

  "pulumi": {
    tagline: "IaC com linguagens de programação reais (TypeScript, Python, Go) em vez de YAML/HCL.",
    why: "Pulumi é alternativa crescente ao Terraform, especialmente em times TypeScript. Saber quando a expressividade de uma linguagem real resolve o que HCL não consegue expressar é diferencial em arquitetura de plataforma.",
    summary: "Pulumi permite definir infraestrutura como código em TypeScript, Python, Go e .NET. Reutiliza providers do Terraform via Pulumi Terraform Bridge. State gerenciado pelo Pulumi Cloud (SaaS) ou self-hosted (S3, Azure Blob, GCS). Vantagem sobre Terraform: lógica real (loops, condicionais, abstrações com tipos), testes com Jest/pytest, Automation API para plataformas de self-service. Desvantagem: ecossistema menor, comunidade menor.",
    keypoints: [
      { title: "Linguagens suportadas", body: "TypeScript/JavaScript, Python, Go, .NET, Java, YAML (casos simples). Mesmo provider que Terraform em muitos casos via Pulumi Terraform Bridge. Nativos: AWS, Azure, GCP têm providers próprios (pulumi-aws, pulumi-azure-native, pulumi-gcp)." },
      { title: "Stack", body: "Equivalente ao workspace do Terraform. Cada stack tem seu state independente (dev, staging, prod). pulumi up aplica mudanças, pulumi preview mostra o diff sem aplicar, pulumi destroy remove todos os recursos da stack." },
      { title: "ComponentResource", body: "Classes que agrupam recursos em abstrações reutilizáveis — equivalente aos módulos do Terraform, mas com toda a expressividade da linguagem. Encapsula padrões (ex: VpcComponent, EcsServiceComponent) com tipos TypeScript, validações e lógica real." },
      { title: "Secrets", body: "Config secrets criptografados no state. pulumi config set --secret DB_PASSWORD. Integra nativamente com AWS Secrets Manager, HashiCorp Vault, Azure Key Vault. Valores secretos não aparecem em plaintext no state ou nos logs." },
      { title: "Automation API", body: "Biblioteca que permite controlar Pulumi programaticamente (sem CLI). Permite criar plataformas de self-service de infraestrutura: um endpoint HTTP que provisiona stacks sob demanda. Base para Internal Developer Platforms." },
      { title: "Testing", body: "Unit tests com mocks (sem provisionar infra real) — testa a lógica de ComponentResources. Integration tests com pulumi preview e stacks efêmeras em CI. Policy as Code (CrossGuard) para guardrails: verificar se todos os recursos têm tags, se buckets S3 são privados, etc." },
    ],
    gotchas: [
      "Código arbitrário roda durante pulumi up — side effects (chamadas de API, escrita em disco) executam durante o preview. Isole lógica com Output.apply para evitar execução prematura.",
      "State inconsistente é difícil de recuperar — como no Terraform, state corrompido exige intervenção manual. Use backend remoto e não interrompa aplys.",
      "Pulumi Cloud (SaaS) vs self-hosted — self-hosted requer gerenciar o backend de state e a criptografia de secrets manualmente.",
      "Bridge providers podem ter lag em relação ao provider Terraform original — novos recursos da AWS podem demorar a chegar. Verifique antes de migrar.",
    ],
    interview: [
      { q: "Quando Pulumi é melhor que Terraform?", a: "<p>Quando você precisa de lógica que HCL não expressa bem: loops sobre listas dinâmicas de recursos, condicionais complexas baseadas em outputs de API, abstrações com herança e composição.</p><p>Times TypeScript podem reutilizar tipos, funções utilitárias e validações entre o código da aplicação e o da infraestrutura. Testes de infra com Jest sem ferramentas externas. Automation API para plataformas de self-service que provisionam stacks dinamicamente.</p>", level: "pleno" },
      { q: "Como Pulumi gerencia state em comparação ao Terraform?", a: "<p>Mesmo conceito: state é o mapeamento entre o código e os recursos reais na cloud. Pulumi usa os mesmos backends: Pulumi Cloud (SaaS com UI e histórico), S3, Azure Blob, GCS (self-hosted).</p><p>Diferença principal: secrets no state são criptografados nativamente (Pulumi Cloud gerencia as chaves, ou você fornece uma chave própria). No Terraform, valores sensíveis ficam em plaintext no state a menos que você use sensitive=true (que só oculta no output, não criptografa no arquivo).</p>", level: "pleno" },
      { q: "O que é a Automation API e quando faz sentido usar?", a: "<p>Automation API é um SDK que expõe as operações do Pulumi (up, preview, destroy, refresh, config) como funções de biblioteca, sem depender do CLI. Permite integrar Pulumi em aplicações Node.js, Python, Go ou .NET.</p><p>Casos de uso: Internal Developer Platform onde um endpoint HTTP provisiona uma stack por tenant; pipeline de testes que cria e destrói infraestrutura efêmera por PR; sistemas de orquestração que precisam de IaC programático sem shell exec.</p>", level: "senior" },
      { q: "Como testaria código Pulumi antes de provisionar infra real?", a: "<p><strong>Unit tests com mocks:</strong> Pulumi SDK permite mockar todos os recursos — o código TypeScript/Python roda, mas nenhuma chamada real à AWS acontece. Testa a lógica dos ComponentResources (nomes, tags, configurações derivadas).</p><p><strong>pulumi preview:</strong> calcula o diff contra o state atual sem aplicar. Integrado no CI — qualquer mudança gera um preview comentado no PR.</p><p><strong>Stacks efêmeras:</strong> CI cria uma stack temporária (ex: pr-123), aplica, roda testes de integração, destrói. Confirma que a infra funciona de ponta a ponta.</p><p><strong>CrossGuard (Policy as Code):</strong> políticas que rodam no preview e bloqueiam recursos não conformes (bucket S3 público, instância sem tag de custo, etc.).</p>", level: "senior" },
    ],
    resources: [
      { title: "Pulumi docs", url: "https://www.pulumi.com/docs/", kind: "docs" },
      { title: "Pulumi vs Terraform", url: "https://www.pulumi.com/docs/intro/vs/terraform/", kind: "artigo" },
      { title: "Pulumi Automation API", url: "https://www.pulumi.com/docs/using-pulumi/automation-api/", kind: "docs" },
    ],
  },
}

export default data
