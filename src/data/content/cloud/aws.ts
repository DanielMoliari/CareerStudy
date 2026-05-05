import type { SkillContent } from '@/types'

const aws: SkillContent = {
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
    {
      label: "WASPCO — 6 pilares Well-Architected",
      trick: "Well-Architected: Workload, Availability, Security, Performance, Cost, Operations",
      explanation: "Os 6 pilares do AWS Well-Architected Framework: Operational Excellence (operações como código), Security (IAM, criptografia, GuardDuty), Reliability (Multi-AZ, retries, backups), Performance Efficiency (instância certa, cache, Graviton), Cost Optimization (Savings Plans, Spot, rightsizing), Sustainability (serverless, ARM, tiering). Em entrevista, enquadre qualquer decisão de arquitetura em um ou mais desses pilares.",
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
    {
      q: "Como monitoraria e auditaria uma conta AWS de produção?",
      a: "<p><strong>CloudTrail:</strong> ative em todas as regiões com trail de management events + S3 data events. Armazene logs em bucket separado com MFA Delete e Object Lock (compliance). Alertas no CloudWatch Events para ações críticas: console login sem MFA, mudanças de IAM policy, desativação do CloudTrail.</p><p><strong>AWS Config:</strong> monitora configuração de recursos continuamente. Regras managed (s3-bucket-public-read-prohibited, ec2-security-group-attached-to-eni, iam-root-access-key-check). Conformidade em tempo real — alerta quando recurso sai do padrão desejado.</p><p><strong>GuardDuty:</strong> ML sobre CloudTrail + VPC Flow Logs + DNS logs. Detecta mineração de crypto, credenciais comprometidas, exfiltração de dados, comunicação com IPs maliciosos. Ative em todas as contas — custo baixo comparado ao valor.</p><p><strong>Security Hub:</strong> agregador de findings do GuardDuty, Inspector, Config, Macie. Dashboard unificado de postura de segurança com score por categoria NIST/CIS.</p>",
      tip: "Em entrevista de arquitetura de segurança, estruture em 3 camadas: Detective (CloudTrail, Config, GuardDuty), Protective (IAM, SG, KMS, WAF), Responsive (Lambda que reverte mudanças fora de conformidade).",
      level: "senior",
    },
    {
      q: "Qual a diferença entre Multi-Region e Multi-AZ na AWS?",
      a: "<p><strong>Multi-AZ:</strong> implantação em pelo menos 2 Availability Zones dentro da mesma região. Protege contra falha de datacenter único. Latência entre AZs: 1–2 ms. Custo moderado (NAT Gateway por AZ, réplica de banco). Padrão mínimo para produção.</p><p><strong>Multi-Region:</strong> implantação em duas ou mais regiões geográficas. Protege contra falha regional inteira (desastre natural, falha de rede regional). Latência entre regiões: 50–300 ms. Custo muito maior. Necessário para RTO < 1 min em caso de desastre regional.</p><p><strong>Serviços com suporte nativo Multi-Region:</strong> Route 53 (failover automático), CloudFront (CDN global), DynamoDB Global Tables (replicação ativa-ativa), Aurora Global Database (replicação com lag < 1s), S3 Cross-Region Replication.</p><p>Para a maioria das aplicações: Multi-AZ é suficiente. Multi-Region só se o negócio exige RTO de segundos após falha regional — o custo e a complexidade operacional são substancialmente maiores.</p>",
      level: "senior",
    },
    {
      q: "Como funcionam as políticas de IAM — evaluation logic com múltiplas policies?",
      a: "<p>A avaliação segue uma ordem estrita com prioridade máxima para Deny explícito:</p><p><strong>1. Deny explícito:</strong> qualquer Deny (em qualquer policy — SCP, identity, resource-based, permissions boundary) cancela qualquer Allow. Sempre vence.</p><p><strong>2. Allow explícito:</strong> a ação é permitida se pelo menos uma policy tem Allow sem Deny conflitante.</p><p><strong>3. Deny implícito (padrão):</strong> tudo que não tem Allow explícito é negado.</p><p><strong>Tipos de policy e interação:</strong> SCPs (AWS Organizations) — limites máximos para contas da Org; Permissions Boundaries — limites máximos para o que a role pode fazer; Identity policies — o que a identidade pode fazer; Resource policies — quem pode acessar o recurso. Para uma ação ser permitida entre conta e recurso cross-account: a identity policy da conta originadora E a resource policy do recurso devem permitir.</p>",
      tip: "Para cruzar contas (cross-account access): a role da conta A faz AssumeRole da role da conta B. A conta B precisa ter uma trust policy que aceita a conta A. A conta A precisa ter policy que permite sts:AssumeRole para o ARN da role B.",
      level: "senior",
    },
    {
      q: "Como implementaria rate limiting e proteção DDoS na AWS?",
      a: "<p><strong>AWS WAF:</strong> regras managed (AWSManagedRulesCommonRuleSet — SQLi, XSS, bots). Rate-based rules: bloquear IP que fizer mais de N requests/5min. Integra com CloudFront (global) ou ALB (regional). Custo: $5/mês por WebACL + $1/rule + $0.60/million requests.</p><p><strong>AWS Shield Standard (gratuito):</strong> proteção automática contra ataques DDoS volumétricos de camada 3/4 para todos os serviços AWS. Ativo por padrão.</p><p><strong>AWS Shield Advanced ($3.000/mês):</strong> proteção adicional de camada 7, DRT (DDoS Response Team) 24/7, cost protection (reembolso de custo extra gerado pelo ataque), visibilidade de ataques em tempo real via CloudWatch. Só para aplicações críticas com SLA agressivo.</p><p><strong>Arquitetura de proteção:</strong> CloudFront + WAF na borda (absorve ataque antes de chegar à infraestrutura), ALB com ALB WAF como segunda camada, Security Groups bloqueando tudo exceto CloudFront (IP ranges da AWS), Rate limiting no API Gateway para APIs.</p>",
      level: "senior",
    },
    {
      q: "Como auditar e monitorar uma conta AWS para compliance e segurança?",
      a: "<p><strong>AWS CloudTrail:</strong> registra todas as chamadas de API na conta — quem fez o quê, quando e de onde. Habilite em todas as regiões e salve em S3 com integridade verificável. CloudTrail Insights detecta atividade incomum automaticamente (ex: pico de chamadas de DescribeInstances que pode indicar reconhecimento).</p><p><strong>AWS Config:</strong> rastreia mudanças de configuração de recursos ao longo do tempo e verifica conformidade com regras — ex: S3 bucket não pode ser público, EC2 deve ter tag de custo, Security Groups não podem ter porta 22 aberta para 0.0.0.0/0. Violations geram alertas automáticos via SNS.</p><p><strong>AWS Security Hub:</strong> consolida findings de segurança de múltiplos serviços (GuardDuty, Inspector, Macie, Config) em um único painel com score de postura de segurança. GuardDuty detecta ameaças via ML (ex: conexão a IP malicioso, exfiltração de dados). Inspector escaneia vulnerabilidades em EC2 e imagens de container.</p><p><strong>IAM Access Analyzer:</strong> identifica recursos com acesso externo não intencional (S3, KMS, Lambda) — detecta quando um bucket foi acidentalmente tornado público ou quando uma role tem trust policy muito permissiva.</p>",
      tip: "Citar CloudTrail (auditoria), Config (compliance contínua), Security Hub (visão consolidada) e Access Analyzer (acesso externo) como quatro pilares complementares demonstra que você já pensou na camada de governança de produção.",
      level: "senior",
    },
    {
      q: "Quais são as famílias de instância EC2 e quando escolher cada uma?",
      a: "<p>As famílias EC2 são organizadas por otimização de recurso:</p><p><strong>t3/t4g (Burstable):</strong> para cargas com uso de CPU variável e com picos curtos. Acumulam créditos de CPU ociosa e gastam em bursts. Ideais para ambientes de desenvolvimento, aplicações web de baixo tráfego, bancos de dados pequenos. Mais barato por vCPU mas não para workloads CPU-sustained.</p><p><strong>m6i/m7g (General Purpose):</strong> equilíbrio entre CPU, memória e rede. Ponto de partida para a maioria dos workloads de produção: APIs, microserviços, aplicações web de médio porte. m7g usa Graviton3 — 20-40% mais barato e mais eficiente que m6i equivalente.</p><p><strong>c6i/c7g (Compute Optimized):</strong> alta proporção de vCPU/RAM. Para cargas CPU-intensive: encoding de vídeo, renderização, motores de inferência de ML, servidores de jogo, processamento de dados em batch.</p><p><strong>r6i/r7g (Memory Optimized):</strong> alta RAM por vCPU. Para bancos de dados em memória (Redis, SAP HANA), caches grandes, workloads analíticos in-memory. r6i.xlarge: 32 GB RAM com 4 vCPUs.</p><p><strong>x2idn (High Memory):</strong> até 24 TB de RAM. Bancos SAP HANA, Oracle em memória, workloads que exigem terabytes de RAM.</p><p><strong>g4dn/p4d (GPU):</strong> treinamento de ML, inferência, workloads CUDA. g4dn para inferência de menor custo, p4d para treinamento distribuído de LLMs.</p>",
      tip: "Regra prática: comece com m-family para produção, t-family para dev/staging. Graviton (g-suffix: m7g, c7g, r7g) é até 40% mais barato — preferir sempre que o stack suportar ARM.",
      level: "pleno",
    },
    {
      q: "Como funciona o Auto Scaling? Qual a diferença entre Target Tracking, Step Scaling e Scheduled Scaling?",
      a: "<p>Auto Scaling ajusta automaticamente a capacidade do serviço (EC2 Fleet, ECS Tasks, DynamoDB throughput, etc.) baseado em demanda. Evita over-provisioning (custo) e under-provisioning (latência/falha).</p><p><strong>Target Tracking (80% dos casos):</strong> você define uma métrica alvo (ex: CPU = 60%). O Auto Scaling adiciona ou remove instâncias para manter a métrica no target. Simples de configurar — o algoritmo de controle é gerenciado pela AWS. Funciona bem para cargas que escalam linearmente com a carga de trabalho. Configuração: <code>TargetValue: 60, PredefinedMetricType: ASGAverageCPUUtilization</code>.</p><p><strong>Step Scaling:</strong> define ajustes de capacidade por intervalo da métrica. Ex: CPU 60-80% → +1 instância; CPU 80-100% → +3 instâncias. Mais controle granular para cargas com comportamento irregular. Útil quando o impacto de uma instância adicional na métrica não é linear.</p><p><strong>Scheduled Scaling:</strong> escala em horários predefinidos. Ex: scale out às 8h (início do horário comercial), scale in às 20h. Perfeito para cargas previsíveis: varejo (Black Friday), relatórios que rodam à meia-noite, jogos com pico de fin de semana. Combinar com Target Tracking para lidar com variações dentro do horário.</p><p><strong>Predictive Scaling:</strong> AWS analisa histórico e pré-escala antes do pico. Elimina a latência de scale-out reativo. Ótimo para padrões diários/semanais previsíveis — habilitar junto com Target Tracking.</p>",
      tip: "Em entrevista: Target Tracking para caso geral, Step para controle fino, Scheduled para padrões previsíveis, Predictive para eliminar latência de scale-out. Mencionar warm-up period (instance_warmup_period) para evitar flapping.",
      level: "pleno",
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
  videos: [
    { title: "AWS Certified Solutions Architect - Complete Course", channel: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=Ia-UEYYR44s", topic: "Visão geral completa dos serviços AWS para arquitetura de soluções" },
    { title: "AWS IAM Tutorial — Roles, Policies and Best Practices", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=iF9fs8Rw4Uo", topic: "IAM na prática: roles, policies, least privilege" },
    { title: "AWS VPC Explained — Subnets, Internet Gateway, NAT", channel: "Fireship", url: "https://www.youtube.com/watch?v=7XnpdZF_COA", topic: "VPC em 10 minutos com clareza visual" },
    { title: "AWS Well-Architected Framework Deep Dive", channel: "AWS Events", url: "https://www.youtube.com/watch?v=vTjasx3ajdo", topic: "Os 6 pilares explicados com exemplos reais de arquitetura" },
    { title: "Building a 3-Tier Architecture on AWS", channel: "AWS re:Invent", url: "https://www.youtube.com/watch?v=9Nikqn_02Oc", topic: "Arquitetura 3-tier com VPC, ALB, ECS e RDS Multi-AZ na prática" },
  ],
  codeExamples: [
    {
      title: "Arquitetura 3-tier com AWS CDK (TypeScript)",
      description: "ALB + ECS Fargate + RDS Aurora com Auto Scaling — padrão de produção completo",
      language: "typescript",
      code: `import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns'
import * as rds from 'aws-cdk-lib/aws-rds'
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'

export class AppStack extends cdk.Stack {
constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
  super(scope, id, props)

  // VPC com subnets públicas e privadas em 2 AZs
  const vpc = new ec2.Vpc(this, 'Vpc', {
    maxAzs: 2,
    natGateways: 1, // 1 NAT Gateway (reduz custo em dev; use 2 em prod)
    subnetConfiguration: [
      { name: 'public',  subnetType: ec2.SubnetType.PUBLIC,            cidrMask: 24 },
      { name: 'private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, cidrMask: 24 },
      { name: 'data',    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,  cidrMask: 24 },
    ],
  })

  // Secret para senha do banco (rotação automática)
  const dbSecret = new secretsmanager.Secret(this, 'DbSecret', {
    generateSecretString: {
      secretStringTemplate: JSON.stringify({ username: 'appuser' }),
      generateStringKey: 'password',
      excludePunctuation: true,
    },
  })

  // Aurora PostgreSQL Serverless v2 — escala de 0.5 a 8 ACUs
  const cluster = new rds.DatabaseCluster(this, 'AuroraCluster', {
    engine: rds.DatabaseClusterEngine.auroraPostgres({
      version: rds.AuroraPostgresEngineVersion.VER_15_3,
    }),
    serverlessV2MinCapacity: 0.5,
    serverlessV2MaxCapacity: 8,
    writer: rds.ClusterInstance.serverlessV2('writer'),
    readers: [rds.ClusterInstance.serverlessV2('reader')],
    vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    credentials: rds.Credentials.fromSecret(dbSecret),
    storageEncrypted: true,
    deletionProtection: true,
  })

  // ECS Cluster com Fargate
  const ecsCluster = new ecs.Cluster(this, 'EcsCluster', { vpc })

  // ALB + Fargate Service com Auto Scaling (L3 construct)
  const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'Api', {
    cluster: ecsCluster,
    cpu: 512,
    memoryLimitMiB: 1024,
    desiredCount: 2,
    taskImageOptions: {
      image: ecs.ContainerImage.fromAsset('./src'),
      containerPort: 3000,
      secrets: {
        DB_SECRET: ecs.Secret.fromSecretsManager(dbSecret),
      },
      environment: {
        NODE_ENV: 'production',
        DB_HOST: cluster.clusterEndpoint.hostname,
      },
    },
    publicLoadBalancer: true,
    assignPublicIp: false, // tasks em subnet privada
  })

  // Permitir ECS acessar Aurora
  cluster.connections.allowFrom(service.service, ec2.Port.tcp(5432))

  // Auto Scaling baseado em CPU
  const scaling = service.service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 2 })
  scaling.scaleOnCpuUtilization('CpuScaling', { targetUtilizationPercent: 60 })

  // Output do DNS do ALB
  new cdk.CfnOutput(this, 'LoadBalancerDns', { value: service.loadBalancer.loadBalancerDnsName })
}
}`,
    },
    {
      title: "IAM Policy com least privilege — Lambda acessa S3 e DynamoDB",
      description: "Exemplo de trust policy e permission policy com escopo mínimo necessário",
      language: "json",
      code: `// Trust Policy — quem pode assumir a role
{
"Version": "2012-10-17",
"Statement": [{
  "Effect": "Allow",
  "Principal": { "Service": "lambda.amazonaws.com" },
  "Action": "sts:AssumeRole"
}]
}

// Permission Policy — o que a role pode fazer (mínimo necessário)
{
"Version": "2012-10-17",
"Statement": [
  {
    "Sid": "S3ReadWrite",
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
    "Resource": "arn:aws:s3:::minha-empresa-uploads/*"
  },
  {
    "Sid": "DynamoDBAccess",
    "Effect": "Allow",
    "Action": [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:Query"
    ],
    "Resource": [
      "arn:aws:dynamodb:us-east-1:123456789012:table/Pedidos",
      "arn:aws:dynamodb:us-east-1:123456789012:table/Pedidos/index/*"
    ]
  },
  {
    "Sid": "CloudWatchLogs",
    "Effect": "Allow",
    "Action": [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ],
    "Resource": "arn:aws:logs:us-east-1:123456789012:log-group:/aws/lambda/minha-funcao:*"
  }
]
}`,
    },
    {
      title: "Fan-out com SNS + SQS — processamento paralelo de eventos",
      description: "Padrão event-driven: upload de arquivo dispara múltiplos processamentos em paralelo",
      language: "typescript",
      code: `import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs'

const sns = new SNSClient({ region: 'us-east-1' })
const sqs = new SQSClient({ region: 'us-east-1' })

// PRODUTOR: Lambda disparada no upload S3
// Topologia: S3 Event → Lambda (produtor) → SNS Topic → 2 SQS Queues
//   SQS fila-thumbnail → Lambda geradora de thumbnail
//   SQS fila-metadata  → Lambda extratora de metadados

export const s3EventHandler = async (event: any) => {
const s3Record = event.Records[0].s3
const bucket = s3Record.bucket.name
const key    = decodeURIComponent(s3Record.object.key.replace(/\+/g, ' '))

// Publica no SNS — fan-out para múltiplos consumidores
await sns.send(new PublishCommand({
  TopicArn: process.env.TOPIC_ARN,
  Message: JSON.stringify({ bucket, key, uploadedAt: new Date().toISOString() }),
  MessageAttributes: {
    // Message filtering: cada subscriber filtra por fileType
    fileType: {
      DataType: 'String',
      StringValue: key.split('.').pop()?.toLowerCase() ?? 'unknown',
    },
  },
}))

return { statusCode: 200 }
}

// CONSUMIDOR: Lambda que processa mensagens da fila SQS
export const sqsConsumerHandler = async (event: any) => {
for (const record of event.Records) {
  const body = JSON.parse(record.body)        // mensagem do SNS
  const msg  = JSON.parse(body.Message)       // payload original

  console.log(\`Processando: s3://\${msg.bucket}/\${msg.key}\`)
  // ... lógica de processamento (thumbnail, metadata, etc.)

  // SQS deleta automaticamente após Lambda retornar sem erro
  // Em caso de erro, a mensagem retorna à fila após Visibility Timeout
  // Após N tentativas → DLQ (Dead Letter Queue)
}
}`,
    },
  ],
  exercises: [
    {
      level: "iniciante",
      title: "Subir um site estático no S3 + CloudFront",
      description: "Crie um bucket S3 com Block Public Access ativado. Faça upload de index.html e style.css. Configure uma distribuição CloudFront apontando para o bucket como origem. Use Origin Access Control (OAC) para que apenas o CloudFront acesse o bucket. Teste o acesso via URL do CloudFront e verifique que o acesso direto ao S3 é negado.",
      concepts: ["S3", "CloudFront", "OAC", "bucket policy", "CDN"],
      hint: "Origin Access Control (OAC) substitui o antigo Origin Access Identity (OAI). No console, ao criar a distribuição CloudFront, selecione 'Origin access control settings' e crie um novo OAC. O CloudFront gera automaticamente a bucket policy necessária — copie e aplique no bucket.",
      relatedKeypoints: [2, 4],
    },
    {
      level: "intermediario",
      title: "Arquitetura serverless: API Gateway + Lambda + DynamoDB",
      description: "Crie uma API REST serverless completa: API Gateway (HTTP API) com rotas GET /items e POST /items. Cada rota aciona uma Lambda diferente. As Lambdas leem e escrevem em uma tabela DynamoDB. Configure IAM Roles com least privilege (Lambda só acessa a tabela específica). Adicione uma SQS Queue como destino de falha (on-failure destination) para a Lambda assíncrona. Teste com curl e verifique logs no CloudWatch.",
      concepts: ["API Gateway", "Lambda", "DynamoDB", "IAM Role", "SQS DLQ", "CloudWatch Logs"],
      hint: "Use HTTP API (não REST API) no API Gateway — é mais barato e suficiente para integração com Lambda. Para DynamoDB, crie a tabela com partition key 'id' (String). No SDK da Lambda, use o v3 (@aws-sdk/client-dynamodb) e inicialize o cliente fora do handler para reutilização em invocações warm.",
    },
    {
      level: "senior",
      title: "Redesenhar uma arquitetura monolítica para multi-tier com HA",
      description: "Dado um monolito rodando em uma única EC2 em subnet pública com RDS acessível pela internet: redesenhe a arquitetura para ser production-grade. Crie VPC com 6 subnets (2 públicas, 2 privadas-app, 2 privadas-data) em 2 AZs. Mova a aplicação para ECS Fargate em subnets privadas atrás de ALB. Mova o RDS para subnet privada isolada com Multi-AZ. Configure Security Groups com least privilege (ALB só aceita 443, ECS só aceita do SG do ALB, RDS só aceita do SG do ECS). Adicione ElastiCache Redis para sessões. Configure CloudWatch alarmes em CPU, erros 5xx e latência P99.",
      concepts: ["VPC", "subnets", "ALB", "ECS Fargate", "RDS Multi-AZ", "ElastiCache", "Security Groups", "CloudWatch", "High Availability"],
      hint: "Comece pelo VPC — defina o CIDR /16 e as 6 subnets /24. Security Groups são a parte mais crítica: SG do ALB aceita 0.0.0.0/0:443, SG do ECS aceita do SG-ALB:3000, SG do RDS aceita do SG-ECS:5432, SG do Redis aceita do SG-ECS:6379. Nunca abra portas de banco para 0.0.0.0/0.",
    },
  ],
  mindmap: {
    title: "AWS — mapa mental de serviços e pilares",
    html: `<style>
.awsmm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;overflow-x:auto}
.awsmm-center{background:#FF9900;color:#0f172a;border-radius:10px;padding:10px 18px;font-weight:700;font-size:12px;text-align:center;display:inline-block;margin:0 auto}
.awsmm-branch{margin-bottom:10px}
.awsmm-branch-title{font-size:9px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.awsmm-branch-title::before{content:'';display:block;width:12px;height:2px;background:currentColor}
.awsmm-nodes{display:flex;flex-wrap:wrap;gap:5px;margin-left:18px}
.awsmm-node{background:#1e293b;border-radius:6px;padding:4px 9px;font-size:9.5px;color:#94a3b8;border:1px solid #334155;cursor:default;transition:border-color .2s}
.awsmm-node:hover{border-color:#FF9900;color:#e2e8f0}
.awsmm-divider{width:100%;height:1px;background:#1e293b;margin:8px 0}
</style>
<div class="awsmm-wrap">
<div style="text-align:center;margin-bottom:16px">
  <div class="awsmm-center">☁ AWS</div>
  <div style="font-size:10px;color:#475569;margin-top:6px">Passe o mouse nos serviços para destacar</div>
</div>

<div class="awsmm-branch">
  <div class="awsmm-branch-title" style="color:#f59e0b">Computação</div>
  <div class="awsmm-nodes">
    <div class="awsmm-node">EC2 — VMs</div>
    <div class="awsmm-node">Lambda — serverless</div>
    <div class="awsmm-node">ECS Fargate — containers</div>
    <div class="awsmm-node">EKS — Kubernetes</div>
    <div class="awsmm-node">Batch — jobs em lote</div>
  </div>
</div>

<div class="awsmm-branch">
  <div class="awsmm-branch-title" style="color:#3b82f6">Storage</div>
  <div class="awsmm-nodes">
    <div class="awsmm-node">S3 — object storage</div>
    <div class="awsmm-node">EBS — disco de bloco</div>
    <div class="awsmm-node">EFS — filesystem NFS</div>
    <div class="awsmm-node">Glacier — arquivamento</div>
  </div>
</div>

<div class="awsmm-branch">
  <div class="awsmm-branch-title" style="color:#a855f7">Banco de dados</div>
  <div class="awsmm-nodes">
    <div class="awsmm-node">RDS/Aurora — relacional</div>
    <div class="awsmm-node">DynamoDB — NoSQL</div>
    <div class="awsmm-node">ElastiCache — Redis/Memcached</div>
    <div class="awsmm-node">Redshift — data warehouse</div>
  </div>
</div>

<div class="awsmm-branch">
  <div class="awsmm-branch-title" style="color:#4ade80">Rede</div>
  <div class="awsmm-nodes">
    <div class="awsmm-node">VPC — rede isolada</div>
    <div class="awsmm-node">ALB/NLB — load balancer</div>
    <div class="awsmm-node">CloudFront — CDN</div>
    <div class="awsmm-node">Route 53 — DNS</div>
    <div class="awsmm-node">Transit Gateway — hub VPC</div>
  </div>
</div>

<div class="awsmm-branch">
  <div class="awsmm-branch-title" style="color:#ef4444">Segurança</div>
  <div class="awsmm-nodes">
    <div class="awsmm-node">IAM — identidade e acesso</div>
    <div class="awsmm-node">KMS — gerenciamento de chaves</div>
    <div class="awsmm-node">Secrets Manager — secrets</div>
    <div class="awsmm-node">WAF — firewall de aplicação</div>
    <div class="awsmm-node">GuardDuty — detecção de ameaças</div>
  </div>
</div>

<div class="awsmm-branch">
  <div class="awsmm-branch-title" style="color:#06b6d4">Observabilidade</div>
  <div class="awsmm-nodes">
    <div class="awsmm-node">CloudWatch — métricas e logs</div>
    <div class="awsmm-node">X-Ray — tracing distribuído</div>
    <div class="awsmm-node">CloudTrail — auditoria de API</div>
  </div>
</div>

<div class="awsmm-branch">
  <div class="awsmm-branch-title" style="color:#FF9900">Mensageria</div>
  <div class="awsmm-nodes">
    <div class="awsmm-node">SQS — filas gerenciadas</div>
    <div class="awsmm-node">SNS — pub/sub</div>
    <div class="awsmm-node">EventBridge — event bus</div>
    <div class="awsmm-node">Kinesis — streaming</div>
  </div>
</div>

<div class="awsmm-divider"></div>
<div class="awsmm-branch">
  <div class="awsmm-branch-title" style="color:#94a3b8">Well-Architected Framework</div>
  <div class="awsmm-nodes">
    <div class="awsmm-node" style="border-color:#3b82f6;color:#3b82f6">Operational Excellence</div>
    <div class="awsmm-node" style="border-color:#ef4444;color:#ef4444">Security</div>
    <div class="awsmm-node" style="border-color:#4ade80;color:#4ade80">Reliability</div>
    <div class="awsmm-node" style="border-color:#f59e0b;color:#f59e0b">Performance Efficiency</div>
    <div class="awsmm-node" style="border-color:#a855f7;color:#a855f7">Cost Optimization</div>
    <div class="awsmm-node" style="border-color:#06b6d4;color:#06b6d4">Sustainability</div>
  </div>
</div>
</div>`,
    caption: "Mapa dos principais serviços AWS por categoria. Em entrevistas de arquitetura, a capacidade de navegar entre categorias e justificar escolhas é mais valiosa que decorar APIs.",
  },
}

export default aws
