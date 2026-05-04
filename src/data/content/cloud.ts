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
  },

  "ec2": {
    tagline: "VMs escaláveis na AWS com controle total sobre OS, rede e storage.",
    why: "EC2 é o serviço de computação mais fundamental da AWS. Entender famílias de instância, storage (EBS vs Instance Store), Auto Scaling e modelos de precificação é pré-requisito para qualquer arquitetura AWS.",
    prerequisite: "Conceitos básicos de virtualização (o que é uma VM, hypervisor), Linux básico (ssh, systemd, variáveis de ambiente, permissões de arquivo), redes (IP, sub-rede, portas TCP/UDP). É útil ter entendido VPC e IAM antes — EC2 vive dentro de uma VPC e age com uma IAM Role.",
    summary: "Amazon EC2 (Elastic Compute Cloud) fornece instâncias de máquinas virtuais com escolha de CPU, RAM, rede e storage. Famílias de instâncias otimizadas para diferentes workloads. EBS para storage persistente. AMI para imagem base. Security Groups para firewall. User Data para bootstrap. Auto Scaling Group para elasticidade horizontal.",
    keypoints: [
      { title: "Famílias de instância", body: "t-séries (burstable — créditos de CPU para bursts, dev/test), m-séries (uso geral — balanced), c-séries (compute-optimized — CPU intensivo, web servers, encoders), r-séries (memory-optimized — in-memory DB, caches), i-séries (storage-optimized — NVMe local, bancos NoSQL), p/g-séries (GPU — ML training, rendering). Graviton (g) = ARM 64-bit: m7g, c7g, r7g — 20-40% mais barato com mesma performance. Size: .nano → .48xlarge.", code: `# Instâncias por workload
t3.micro   → dev/test, tráfego esporádico (créditos de CPU)
m6i.xlarge → API REST de uso geral (4 vCPU, 16 GB)
c6i.2xlarge → encoding, compilação (CPU intensivo)
r6i.xlarge → banco Redis em EC2, in-memory analytics
i3.xlarge  → Cassandra, Elasticsearch (NVMe local rápido)
g4dn.xlarge → inferência de ML, rendering GPU
m7g.xlarge → mesmo de m6i porém ~20% mais barato (ARM/Graviton)` },
      { title: "EBS — tipos e quando usar", body: "gp3: uso geral, 3.000 IOPS baseline (até 16.000), throughput até 1.000 MB/s, configurável independentemente do tamanho. Padrão para a maioria dos workloads. gp2: legado — IOPS atrelado ao tamanho (3 IOPS/GB). Migre para gp3. io2/io2 Block Express: IOPS provisionadas até 256.000, latência sub-milissegundo — bancos com I/O intensivo (Oracle, SQL Server). st1: throughput-optimized HDD — logs, big data sequencial. sc1: cold HDD — dados frios acessados raramente. Todos suportam snapshots incrementais para S3.", code: `# Verificar tipo e IOPS de volumes EBS
aws ec2 describe-volumes \
  --filters "Name=attachment.instance-id,Values=i-0abc123" \
  --query 'Volumes[*].[VolumeId,VolumeType,Iops,Size]' \
  --output table

# Migrar gp2 para gp3 sem downtime (elastic volumes)
aws ec2 modify-volume \
  --volume-id vol-0abc123 \
  --volume-type gp3 \
  --iops 3000 \
  --throughput 125` },
      { title: "Instance Store vs EBS", body: "Instance Store: disco NVMe físico soldado no host — latência extremamente baixa (microsegundos), I/O altíssimo. Efêmero: dados perdidos em stop, hibernation ou falha de hardware. Use para cache local, buffer temporário, scratch de ML. EBS: rede (subsistema de storage distribuído) — persiste após stop/start, sobrevive a falhas de hardware, suporta snapshots. Use para dados críticos, SO, bancos de dados." },
      { title: "Auto Scaling Group (ASG)", body: "Define min/max/desired de instâncias. Políticas: Target Tracking (manter CPU em 60% — AWS ajusta sozinha), Step Scaling (escala em degraus por alarme — mais controle), Scheduled (horário fixo — escala antes do pico previsível). Launch Template: AMI, tipo, user data, IAM instance profile, security groups, key pair. ALB distribui tráfego e faz health checks — só registra instância após health check passar. Cooldown padrão 300s após scale-in.", code: `# Criar ASG com target tracking (via CLI)
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name minha-api-asg \
  --launch-template LaunchTemplateName=api-lt,Version='$Latest' \
  --min-size 2 --max-size 10 --desired-capacity 2 \
  --vpc-zone-identifier "subnet-a,subnet-b" \
  --health-check-type ELB \
  --health-check-grace-period 120

aws autoscaling put-scaling-policy \
  --auto-scaling-group-name minha-api-asg \
  --policy-name cpu-target-tracking \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration '{"PredefinedMetricSpecification":{"PredefinedMetricType":"ASGAverageCPUUtilization"},"TargetValue":60}'` },
      { title: "Modelos de precificação", body: "On-Demand: sem compromisso, mais caro — picos imprevisíveis, dev/test. Reserved Instances (1–3 anos): até 72% desconto, instância específica (tipo, região, OS) — baseline estável. Savings Plans: compromisso de $/hora por 1–3 anos, até 66% desconto, mais flexível (aceita qualquer tipo de instância) — preferir RI para baseline. Spot: 90% desconto, interruptível com 2 min de aviso — batch, CI/CD, ML training. Dedicated Host: servidor físico dedicado — compliance, licenças por socket." },
      { title: "Placement Groups", body: "Cluster: instâncias fisicamente próximas no mesmo rack — latência <10μs entre nós, throughput de rede 100 Gbps. Para HPC, MPI, bancos de dados distribuídos que se comunicam intensamente. Risco: falha de rack afeta todas. Spread: instâncias em racks diferentes — máxima HA (limite 7 por AZ). Para apps críticos com poucas instâncias. Partition: grupos de N instâncias em hardware isolado entre grupos — Hadoop, Cassandra, Kafka onde você quer isolamento por shard/nó." },
      { title: "User Data, AMI e imutabilidade", body: "User Data: script bash executado na primeira inicialização via cloud-init. Instala pacotes, configura serviço, puxa código. Lento em ASG — cada nova instância reinstala tudo. AMI baked (golden AMI): EC2 Image Builder ou Packer pré-instala tudo, tira snapshot — boot muito mais rápido em ASG. Infraestrutura imutável: não atualiza instância em produção — cria nova AMI, atualiza Launch Template, ASG faz instância refresh. Nunca faça SSH em produção para mudar configuração." },
      { title: "IMDSv2 — metadata service seguro", body: "Instance Metadata Service permite que o código na instância descubra seu IP, region, IAM role, user data, etc. sem credenciais. IMDSv2 é a versão segura — requer token de sessão (PUT antes de GET), protege contra SSRF. IMDSv1 (GET direto) é vulnerável a SSRF — desative ou restrinja. Para recuperar credenciais temporárias da IAM Role anexada: GET /latest/meta-data/iam/security-credentials/{role-name}.", code: `# IMDSv2 — recuperar dados da instância com token
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

# Usar token para acessar metadata
curl -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/instance-id

curl -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/iam/security-credentials/MinhaRole` },
      { title: "Ciclo de vida da instância", body: "pending → running → stopping → stopped → terminated. Stop: desaloca o hardware mas mantém EBS e Elastic IP (cobra por EIP parado). Terminate: destrói a instância e o EBS root (se DeleteOnTermination=true, padrão). Hibernate: salva memória RAM no EBS e para — útil para workloads que demoram a inicializar. Reboot: reinicia sem desalocar. Ative Instance Termination Protection em instâncias críticas (API ou console)." },
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
      {
        title: "Ciclo de vida da instância EC2 — estados e transições",
        html: `<style>
.ec2lc-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.ec2lc-state{border-radius:8px;padding:9px 14px;font-size:11px;font-weight:700;text-align:center;flex-shrink:0}
.ec2lc-arr{color:#475569;font-size:13px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:2px;padding:0 4px;min-width:70px}
.ec2lc-arr-label{font-size:8.5px;color:#64748b;text-align:center;white-space:nowrap}
.ec2lc-tip{position:relative;cursor:help}
.ec2lc-tip:hover .ec2lc-tb{display:block}
.ec2lc-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.ec2lc-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.ec2lc-row{display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-bottom:10px}
</style>
<div class="ec2lc-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Ciclo de vida da instância EC2</p>
  <p style="color:#475569;font-size:10px;margin:0 0 14px">Passe o mouse nos estados para ver o que acontece em cada um</p>

  <div class="ec2lc-row">
    <div class="ec2lc-state ec2lc-tip" style="background:rgba(251,191,36,.15);border:1.5px solid #fbbf24;color:#fbbf24">
      pending
      <div class="ec2lc-tb"><strong style="color:#e2e8f0;display:block">pending</strong>AWS aloca hardware, copia AMI, inicializa rede. User Data roda aqui (cloud-init). Não cobra por CPU/hora ainda.</div>
    </div>
    <div class="ec2lc-arr"><span>→</span><span class="ec2lc-arr-label">boot completo</span></div>
    <div class="ec2lc-state ec2lc-tip" style="background:rgba(74,222,128,.15);border:1.5px solid #4ade80;color:#4ade80">
      running
      <div class="ec2lc-tb"><strong style="color:#e2e8f0;display:block">running</strong>Instância ativa e cobrando. SSH disponível. EBS montado. IP público/privado atribuídos. Heartbeat do CloudWatch ativo.</div>
    </div>
    <div class="ec2lc-arr"><span>→</span><span class="ec2lc-arr-label">stop</span></div>
    <div class="ec2lc-state ec2lc-tip" style="background:rgba(100,116,139,.15);border:1.5px solid #64748b;color:#94a3b8">
      stopping
      <div class="ec2lc-tb"><strong style="color:#e2e8f0;display:block">stopping</strong>OS recebe ACPI power off. Aguarda processos encerrarem. Desaloca o hardware.</div>
    </div>
    <div class="ec2lc-arr"><span>→</span></div>
    <div class="ec2lc-state ec2lc-tip" style="background:rgba(100,116,139,.15);border:1.5px solid #334155;color:#64748b">
      stopped
      <div class="ec2lc-tb"><strong style="color:#e2e8f0;display:block">stopped</strong>Sem hardware alocado, sem cobrança de CPU. EBS persiste (cobra por GB/mês). IP público dinâmico liberado. Elastic IP permanece (cobra se não associado).</div>
    </div>
  </div>

  <div class="ec2lc-row">
    <div class="ec2lc-state" style="background:rgba(74,222,128,.15);border:1.5px solid #4ade80;color:#4ade80">running</div>
    <div class="ec2lc-arr"><span>→</span><span class="ec2lc-arr-label">terminate</span></div>
    <div class="ec2lc-state ec2lc-tip" style="background:rgba(239,68,68,.15);border:1.5px solid #ef4444;color:#ef4444">
      shutting-down
      <div class="ec2lc-tb"><strong style="color:#e2e8f0;display:block">shutting-down</strong>Estado transitório antes de terminated. EBS root é deletado (se DeleteOnTermination=true, padrão). EBS extras permanecem até deletar manualmente.</div>
    </div>
    <div class="ec2lc-arr"><span>→</span></div>
    <div class="ec2lc-state ec2lc-tip" style="background:rgba(239,68,68,.08);border:1.5px solid rgba(239,68,68,.4);color:#ef4444">
      terminated
      <div class="ec2lc-tb"><strong style="color:#e2e8f0;display:block">terminated</strong>Instância destruída permanentemente. Fica visível por ~1h no console. Sem cobrança. Irreversível — ative Termination Protection em produção.</div>
    </div>
  </div>

  <div style="background:#1e293b;border-radius:8px;padding:10px 14px;margin-top:4px;font-size:10px;color:#64748b">
    <strong style="color:#FF9900">Stop vs Terminate:</strong> Stop mantém EBS e configurações — pode religar. Terminate é irreversível e destrói o EBS root.
    <strong style="color:#4ade80"> Hibernate</strong> = stop especial que salva RAM no EBS para restauração rápida.
  </div>
</div>`,
        caption: "Entender os estados evita o erro mais comum: terminar acidentalmente uma instância achando que estava só parando. Ative Termination Protection em instâncias de produção.",
      },
      {
        title: "Tipos de instância por workload — guia visual de família",
        html: `<style>
.ec2fam-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.ec2fam-row{display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;padding:10px 12px;background:#1e293b;border-radius:8px;border-left:3px solid}
.ec2fam-badge{font-size:11px;font-weight:700;min-width:50px;flex-shrink:0}
.ec2fam-info{flex:1}
.ec2fam-title{font-size:11px;font-weight:600;margin-bottom:3px}
.ec2fam-desc{font-size:9.5px;color:#64748b;line-height:1.5}
.ec2fam-use{font-size:9px;color:#4ade80;margin-top:3px}
</style>
<div class="ec2fam-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Famílias de instância EC2 — quando usar cada</p>
  <p style="color:#475569;font-size:10px;margin:0 0 12px">Escolha a família certa reduz custo sem sacrificar performance</p>

  <div class="ec2fam-row" style="border-color:#fbbf24">
    <div class="ec2fam-badge" style="color:#fbbf24">t-série</div>
    <div class="ec2fam-info">
      <div class="ec2fam-title" style="color:#fbbf24">Burstable — créditos de CPU</div>
      <div class="ec2fam-desc">CPU baseline baixo (5–30%). Acumula créditos de CPU em períodos de ociosidade. Usa créditos para bursts de CPU. Custo mínimo.</div>
      <div class="ec2fam-use">✓ Dev/test, sites baixo tráfego, microserviços esporádicos</div>
    </div>
  </div>

  <div class="ec2fam-row" style="border-color:#FF9900">
    <div class="ec2fam-badge" style="color:#FF9900">m-série</div>
    <div class="ec2fam-info">
      <div class="ec2fam-title" style="color:#FF9900">General Purpose — balanced</div>
      <div class="ec2fam-desc">CPU e memória equilibrados (4 GB/vCPU). m6i, m7i (Intel), m7g (Graviton). Padrão para a maioria das APIs.</div>
      <div class="ec2fam-use">✓ APIs REST, backends, servidores de aplicação, bancos de dados pequenos</div>
    </div>
  </div>

  <div class="ec2fam-row" style="border-color:#3b82f6">
    <div class="ec2fam-badge" style="color:#3b82f6">c-série</div>
    <div class="ec2fam-info">
      <div class="ec2fam-title" style="color:#3b82f6">Compute Optimized — CPU intensivo</div>
      <div class="ec2fam-desc">Alta proporção CPU/memória (2 GB/vCPU). c6i, c7i (Intel), c7g (Graviton). Melhor performance por vCPU.</div>
      <div class="ec2fam-use">✓ Encoding de vídeo, compilação, modelos matemáticos, jogos, batch CPU</div>
    </div>
  </div>

  <div class="ec2fam-row" style="border-color:#a855f7">
    <div class="ec2fam-badge" style="color:#a855f7">r-série</div>
    <div class="ec2fam-info">
      <div class="ec2fam-title" style="color:#a855f7">Memory Optimized — alta memória</div>
      <div class="ec2fam-desc">Muita RAM por vCPU (8–32 GB). r6i, r7i, r7g. Para workloads que precisam de grandes datasets em memória.</div>
      <div class="ec2fam-use">✓ Redis/Memcached em EC2, bancos in-memory, análise de dados em memória</div>
    </div>
  </div>

  <div class="ec2fam-row" style="border-color:#4ade80">
    <div class="ec2fam-badge" style="color:#4ade80">i-série</div>
    <div class="ec2fam-info">
      <div class="ec2fam-title" style="color:#4ade80">Storage Optimized — NVMe local</div>
      <div class="ec2fam-desc">NVMe local de altíssima IOPS e throughput (Instance Store). Efêmero mas muito rápido.</div>
      <div class="ec2fam-use">✓ Elasticsearch, Cassandra, MongoDB, buffers de alta escrita</div>
    </div>
  </div>

  <div class="ec2fam-row" style="border-color:#ef4444">
    <div class="ec2fam-badge" style="color:#ef4444">g/p-série</div>
    <div class="ec2fam-info">
      <div class="ec2fam-title" style="color:#ef4444">GPU — aceleração gráfica e ML</div>
      <div class="ec2fam-desc">g4dn (inferência ML, gaming), g5 (gráficos, ML), p3/p4 (treinamento ML de larga escala com NVIDIA V100/A100).</div>
      <div class="ec2fam-use">✓ Treinamento de modelos ML, inferência GPU, rendering 3D, streaming de jogos</div>
    </div>
  </div>
</div>`,
        caption: "Regra prática: comece com m-série. Se CPU for gargalo → c-série. Se memória → r-série. Se storage → i-série. Graviton (sufixo g) = mesma performance, 20-40% mais barato.",
      },
    ],
    gotchas: [
      "Stop vs Terminate — Stop mantém o EBS, Terminate destrói. Ative proteção contra encerramento em produção.",
      "Reservar instância do tipo errado — Reserved Instances têm baixa portabilidade. Prefira Savings Plans para flexibilidade.",
      "Security Group é stateful — resposta de conexão de saída é permitida automaticamente. NACL é stateless e exige regras de retorno.",
      "Spot Instance sem interrupt handler — aplicação não sabe que vai ser encerrada. SIGTERM chega 2 min antes. Implemente checkpoint.",
      "AMI muito antiga — patches de segurança desatualizados. Rebuilde periodicamente com pipeline de golden AMI.",
      "Conexão de banco dentro do Auto Scaling — quando ASG escala para 100 instâncias, 100 conexões abertas no RDS. Use RDS Proxy para connection pooling.",
      "IP público dinâmico muda a cada start — se a aplicação depende do IP fixo da instância, use Elastic IP ou, melhor, Route 53 apontando para o DNS da instância. Elastic IP cobra $0.005/h quando não associado.",
      "gp2 vs gp3 — gp2 tem IOPS atrelado ao tamanho (precisa de 1 TB para 3.000 IOPS). gp3 oferece 3.000 IOPS base em qualquer tamanho, 20% mais barato. Migre todos os gp2 para gp3 via Elastic Volumes (sem downtime).",
      "IMDSv1 habilitado — vulnerável a SSRF: se a aplicação fizer requisição para qualquer URL fornecida pelo usuário, um atacante pode roubar as credenciais temporárias da IAM Role via http://169.254.169.254. Desabilite IMDSv1 e force IMDSv2.",
    ],
    interview: [
      { q: "Quando usar Spot Instances?", a: "<p>Workloads tolerantes a interrupção: batch processing, CI/CD workers, treinamento de ML, rendering. <strong>Nunca</strong> para produção stateful sem estratégia de checkpointing.</p><p>Sempre implemente interrupt handler (SIGTERM) que salva estado antes dos 2 min de aviso da AWS. Combine Spot com On-demand no ASG (base On-demand, escala em Spot) para garantir capacidade mínima.</p>", level: "pleno" },
      { q: "Como desenharia Auto Scaling para uma API REST?", a: "<p>Launch Template com AMI baked (app já instalada — boot rápido). ASG em multi-AZ (pelo menos 2 AZs). Target Tracking Policy: CPUUtilization target 60% ou ALBRequestCountPerTarget.</p><p>Application Load Balancer com health check no endpoint /health. Scale-in protection para instâncias processando jobs longos. Cooldown de 300s para evitar scale-in prematuro após scale-out.</p>", level: "pleno" },
      { q: "Qual a diferença entre EBS gp2, gp3 e io2?", a: "<p><strong>gp2:</strong> IOPS vinculado ao tamanho (3 IOPS/GB, burst até 3.000). Legado — evitar em produção nova.</p><p><strong>gp3:</strong> IOPS e throughput configuráveis independentemente do tamanho (baseline 3.000 IOPS, até 16.000). 20% mais barato que gp2. Padrão para uso geral.</p><p><strong>io2/io2 Block Express:</strong> IOPS provisionadas até 256.000, latência sub-milissegundo. Para bancos de dados com I/O intensivo (Oracle, SQL Server). Custo alto — use só quando necessário.</p>", level: "pleno" },
      { q: "O que é uma AMI e como automatizaria o processo de criação?", a: "<p>AMI (Amazon Machine Image) é uma snapshot do estado de um EC2: OS, configurações, software instalado. Base para Launch Templates e ASG.</p><p>Pipeline de golden AMI: EC2 Image Builder (ou Packer + CI) instala dependências, roda testes de smoke, cria AMI, publica ARN. ASG usa a nova AMI no próximo refresh de instâncias. Immutable infrastructure: não atualize instâncias em produção — recrie com nova AMI.</p>", level: "senior" },
      { q: "Como funcionam Placement Groups e quando importam?", a: "<p><strong>Cluster:</strong> instâncias no mesmo rack físico, rede de 100 Gbps entre elas, latência <10μs. Para HPC, MPI, jobs que precisam de comunicação intensiva entre nós. Risco: falha de rack afeta todas.</p><p><strong>Spread:</strong> cada instância em hardware diferente, máxima isolação de falha. Para aplicações críticas com poucas instâncias (máximo 7 por AZ).</p><p><strong>Partition:</strong> grupos de instâncias isoladas entre si, mas instâncias dentro do mesmo partition compartilham hardware. Para Hadoop, Cassandra, HDFS — onde você quer isolamento por shard, não por instância.</p>", level: "senior" },
      { q: "Como reduziria custo de EC2 em produção?", a: "<p>1. <strong>Rightsizing:</strong> AWS Compute Optimizer analisa CloudWatch e sugere instância mais barata com mesma performance.</p><p>2. <strong>Savings Plans:</strong> commita $X/hora por 1–3 anos. Mais flexível que RI.</p><p>3. <strong>Spot para workers:</strong> ASG misto com base On-demand e escala em Spot.</p><p>4. <strong>Schedule:</strong> desligar ambientes não-prod fora do horário comercial (Lambda + EventBridge).</p><p>5. <strong>Graviton:</strong> instâncias ARM (m7g, c7g) 20–40% mais baratas com mesma performance para a maioria das workloads.</p>", level: "senior" },
      { q: "Qual a diferença entre Launch Template e Launch Configuration?", a: "<p><strong>Launch Configuration</strong> é o formato legado — imutável (não pode editar, só criar nova versão), sem suporte a instâncias diversas no mesmo ASG, sem suporte a Spot + On-demand mix, depreciado pela AWS.</p><p><strong>Launch Template</strong> é o formato atual — versionado (edita criando nova versão, ASG pode usar $Latest ou $Default), suporta Fleet e Spot mix na mesma ASG, suporta várias famílias de instância para diversidade de Spot, suporta instance requirements (ao invés de tipo específico).</p><p>Sempre use Launch Templates — Launch Configurations não recebem novas features da AWS.</p>", level: "pleno" },
      { q: "Como funciona o IMDSv2 e por que IMDSv1 é perigoso?", a: "<p>O Instance Metadata Service (IMDS) é um endpoint local (169.254.169.254) que fornece informações sobre a instância: IP, region, IAM role credentials, user data, etc.</p><p><strong>IMDSv1</strong> é stateless — qualquer processo na instância faz um GET e obtém dados, incluindo as credenciais temporárias da IAM Role. Vulnerabilidade: SSRF. Se a aplicação faz requisições para URLs fornecidas pelo usuário (ex: crawler, webhook) sem sanitização, um atacante envia uma URL apontando para o IMDS e rouba as credenciais da Role em segundos.</p><p><strong>IMDSv2</strong> exige um token de sessão obtido via PUT com TTL. O token não pode ser obtido por SSRF (a maioria dos proxies HTTP não faz PUT cross-domain). Configure via Metadata Options: HttpTokens=required. Desabilite IMDSv1 em todas as instâncias e no Launch Template do ASG.</p>", level: "senior" },
      { q: "Como desenharia um pipeline de golden AMI automatizado?", a: "<p><strong>EC2 Image Builder (opção nativa AWS):</strong> pipeline declarativo — define a imagem base (Amazon Linux 2023), componentes (instala Docker, Node.js, configura systemd), testes (health check, smoke test), distribui para múltiplas regiões. Dispara em schedule ou via CI.</p><p><strong>Packer + CI (alternativa):</strong> Packer HCL define a imagem, GitHub Actions roda <code>packer build</code>, AMI é publicada com tag <code>Environment=base,Version=1.2.3</code>. ASG usa data source do Terraform para obter a AMI mais recente com as tags corretas.</p><p><strong>Instance Refresh:</strong> após nova AMI disponível, atualiza o Launch Template e chama <code>aws autoscaling start-instance-refresh</code>. ASG substitui instâncias gradualmente (ex: 20% por vez, aguardando health check passar) sem downtime.</p>", level: "senior" },
      { q: "Explique a diferença entre tipos de monitoramento EC2 — Basic vs Detailed.", a: "<p><strong>Basic Monitoring (padrão, gratuito):</strong> métricas do CloudWatch publicadas a cada 5 minutos — CPU, rede, disco, status checks.</p><p><strong>Detailed Monitoring (pago):</strong> métricas publicadas a cada 1 minuto. Necessário quando o ASG precisa reagir rapidamente a picos de CPU. Habilite no Launch Template.</p><p><strong>Enhanced Monitoring (nível de OS):</strong> CPU steal, processos, memória, I/O por processo — via CloudWatch Agent instalado na instância. Coleta métricas que o hypervisor não vê (memória, disco de SO). Essencial para diagnóstico de performance real.</p><p><strong>Status Checks:</strong> System Status Check (problema no hardware AWS) e Instance Status Check (problema no SO ou aplicação). Crie alarme CloudWatch que faz auto-recover em System Status Check failure.</p>", level: "pleno" },
      { q: "O que é Elastic IP e quando usar?", a: "<p>Elastic IP é um IPv4 público estático alocado à sua conta AWS — persiste mesmo após stop/start da instância. Útil quando você precisa de IP fixo: whitelist de parceiro/firewall externo, configuração DNS de baixo TTL, instância que precisa de IP constante.</p><p><strong>Custo:</strong> Elastic IP é gratuito enquanto associado a uma instância running. Cobra $0.005/h se não associado (ou associado a instância parada). AWS limita 5 EIPs por conta por região (limite aumentável).</p><p><strong>Alternativas melhores na maioria dos casos:</strong> Route 53 com CNAME para o DNS público da instância (muda com start/stop mas DNS abstrai). ALB com IP estático via Global Accelerator. NLB com IP estático nativo (sem EIP necessário).</p>", level: "pleno" },
      { q: "Qual a diferença entre Instance Store e EBS? Como escolher?", a: "<p><strong>Instance Store:</strong> discos NVMe soldados fisicamente no servidor onde a instância roda. Latência de microsegundos, IOPS e throughput máximos (não tem limite de rede). <strong>Efêmero:</strong> dados perdidos em stop, hibernate, terminate ou falha de hardware. Disponível apenas em tipos específicos (i3, d2, h1, alguns c5d, m5d, etc.).</p><p><strong>EBS:</strong> storage de rede — o disco está em outro servidor conectado via rede de alta velocidade. Persiste após stop/start/terminate. Suporta snapshots. Limites de IOPS/throughput por volume e por instância.</p><p><strong>Como escolher:</strong> dados críticos, banco de dados, SO → EBS (sempre). Cache local, buffer de processamento, scratch de ML → Instance Store (mais rápido, mais barato por IOPS). Combinação comum: SO + dados no EBS, temporários no Instance Store.</p>", level: "pleno" },
      { q: "Como gerenciaria patches de segurança em uma frota de EC2?", a: "<p><strong>Abordagem imutável (preferida):</strong> pipeline de golden AMI constrói nova imagem com patches aplicados, publica. ASG faz Instance Refresh substituindo instâncias antigas pela nova AMI. Zero SSH em produção, zero configuration drift.</p><p><strong>AWS Systems Manager Patch Manager:</strong> para instâncias com SSM Agent instalado, define Patch Baselines (quais patches aplicar por severity) e Maintenance Windows (quando aplicar). Relatórios de compliance mostram instâncias fora do padrão.</p><p><strong>AWS Systems Manager Session Manager:</strong> substitui SSH (sem portas abertas, sem key pairs) — acesso ao terminal via IAM, auditado no CloudTrail. Mais seguro para acesso emergencial.</p><p>Em hipótese alguma deixar porta 22 aberta para 0.0.0.0/0 no Security Group — é o vetor de ataque mais comum em EC2.</p>", level: "senior" },
      { q: "O que é Hibernation no EC2 e quando faz sentido?", a: "<p>Hibernation salva o conteúdo da RAM no EBS root volume (criptografado obrigatoriamente) e para a instância. Na retomada, o estado da memória é restaurado — a instância volta exatamente de onde parou, sem reiniciar aplicações ou recarregar estado.</p><p><strong>Quando faz sentido:</strong> aplicações com inicialização lenta (JVM, carregamento de modelos ML, aquecimento de caches) onde o tempo de boot é um problema. Ambientes de desenvolvimento onde você quer continuar o trabalho sem perder estado. Workloads com estado em memória que seriam custosos de reconstruir.</p><p><strong>Requisitos:</strong> instância com menos de 150 GB de RAM. EBS root criptografado. Família suportada (C, I, M, R, T e outros). Hibernation habilitado no Launch Template. Não suportado em instâncias Spot de longa duração.</p>", level: "senior" },
      { q: "Como faria deploy blue-green com EC2 e ALB?", a: "<p>Deploy blue-green elimina downtime e permite rollback instantâneo. Estrutura: dois Target Groups (blue e green) atrás do mesmo ALB.</p><p><strong>Fluxo:</strong> (1) Blue = produção atual com 100% do tráfego. (2) Provisionar ASG green com a nova versão via Instance Refresh ou nova instância. (3) Registrar instâncias green no Target Group green. (4) ALB Weighted Target Group: direcionar 10% para green (canary). Monitorar erros e latência no CloudWatch. (5) Gradualmente aumentar para 50% → 100% para green. (6) Quando green = 100%, desalocar blue. (7) Rollback: mudar o peso de volta para blue instantaneamente (< 30s).</p><p>Alternativamente: Route 53 weighted routing entre dois ALBs (blue e green) — mais flexível para múltiplas regiões.</p>", level: "senior" },
      { q: "O que são Security Groups e como diferem das NACLs?", a: "<p><strong>Security Groups (SG):</strong> firewall stateful no nível da instância/interface de rede (ENI). Stateful significa que a resposta de uma conexão permitida entra automaticamente, sem regra de retorno explícita. Regras apenas de Allow (não tem Deny — o padrão é negar tudo). Aplicam-se a instâncias individuais e podem referenciar outros SGs (ex: 'permitir do SG do ALB' em vez de um CIDR).</p><p><strong>Network ACLs (NACL):</strong> firewall stateless no nível da subnet. Stateless = você precisa de regras de Allow explícitas para entrada E saída de cada conexão (incluindo as respostas, que usam portas efêmeras 1024-65535). Suportam regras de Allow E Deny. Avaliadas em ordem numérica — a primeira regra que corresponde vence. Mais complexas de gerenciar para a maioria dos casos.</p><p>Regra prática: use SGs para 99% dos casos. NACLs só para bloqueio de IPs específicos na subnet (ex: bloquear range de IPs maliciosos, compliance que exige defense in depth).</p>", tip: "Em entrevista, a resposta completa sempre menciona stateful vs stateless como a diferença fundamental, não apenas o nível (instância vs subnet).", level: "pleno" },
      { q: "Como configuraria monitoramento de custos para não ser surpreendido na fatura AWS?", a: "<p><strong>Billing Alarm (obrigatório desde o primeiro dia):</strong> CloudWatch alarm no total de cobrança estimada. Habilite via Billing Console → Billing Preferences → Receive Billing Alerts. Crie alarme em $10, $50 e $100 — você saberá imediatamente se algo saiu do controle.</p><p><strong>AWS Budgets:</strong> orçamentos por serviço, equipe ou conta. Alertas em % do orçamento (ex: alerta quando atingir 80%). Pode disparar ação automática (desabilitar IAM, aplicar SCP) quando ultrapassar.</p><p><strong>Cost Explorer:</strong> análise retroativa de custo por serviço, região, tag, conta. Identificar top 3 serviços por custo, picos inesperados, projeção para o mês.</p><p><strong>Resource Tags:</strong> tag 'Project' e 'Environment' em todos os recursos desde o início — sem tags não consegue filtrar custo por projeto. Use AWS Config rule 'required-tags' para enforcement.</p><p><strong>Cost Anomaly Detection:</strong> ML que detecta gastos incomuns e envia alerta. Exemplo: EC2 nova com custo 3× acima do histórico = possível recurso criado acidentalmente ou comprometimento de credenciais.</p>", level: "pleno" },
      { q: "Como o EBS garante performance com gp3 vs io2? Quando usar cada um?", a: "<p><strong>gp3:</strong> SSD de propósito geral. Performance desacoplada do tamanho — você paga por IOPS e throughput separadamente do armazenamento. Baseline: 3.000 IOPS + 125 MB/s incluídos sem custo adicional. Pode escalar até 16.000 IOPS e 1.000 MB/s. 20% mais barato que gp2. <strong>Use para:</strong> SO de instâncias, aplicações web, bancos de dados de baixo a médio I/O (PostgreSQL com < 10k IOPS).</p><p><strong>io2/io2 Block Express:</strong> IOPS provisionadas de até 256.000 com latência sub-milissegundo garantida por SLA. Durabilidade de 99.999% (vs 99.8-99.9% dos gp3). io2 Block Express suporta multi-attach (mesma volume montada em múltiplas instâncias simultaneamente — para clusters de alta disponibilidade). <strong>Use para:</strong> Oracle, SQL Server, SAP HANA, bancos com requisito de I/O crítico onde latência de microsegundos faz diferença.</p><p>Regra: comece com gp3 para tudo. Só migre para io2 se a aplicação saturar o gp3 ou exigir garantia de latência sub-ms por SLA.</p>", level: "pleno" },
      { q: "O que é uma Dedicated Instance vs Dedicated Host e quando são necessários?", a: "<p><strong>Dedicated Instance:</strong> instância que roda em hardware físico dedicado para sua conta (não compartilhado com outras contas AWS). Não há controle sobre qual servidor físico específico. Cobra por instância. Suficiente para compliance básico de isolamento de hardware.</p><p><strong>Dedicated Host:</strong> servidor físico inteiro alocado para você. Você controla qual servidor específico (e quando substituí-lo). Visibilidade dos sockets e núcleos físicos. Suporte a licenças de software baseadas em sockets/núcleos (Oracle, Windows Server com licença BYOL). Cobra por host/hora — mais caro, mas permite otimizar licenças.</p><p><strong>Quando são necessários:</strong></p><p>- Compliance regulatório que exige isolamento físico entre clientes (HIPAA, PCI em alguns contextos).</p><p>- BYOL (Bring Your Own License): Oracle Database com licença baseada em processador — Dedicated Host permite controlar o número de sockets e core físicos, reduzindo o custo de licença.</p><p>- Auditoria que exige saber exatamente em qual servidor físico os dados residem.</p>", level: "senior" },
      { q: "Como implementaria Disaster Recovery com EC2 e qual a diferença entre as estratégias?", a: "<p><strong>Backup & Restore (RTO horas):</strong> snapshots EBS e AMIs replicados para a região de DR. Em caso de desastre, restaurar snapshots e recriar instâncias a partir das AMIs. Mais barato, maior RTO. Use para sistemas não-críticos.</p><p><strong>Pilot Light (RTO minutos):</strong> infraestrutura mínima rodando na região de DR — dados replicados (RDS Read Replica, S3 CRR), mas instâncias EC2 desligadas ou em número mínimo. Em desastre: ligar instâncias, escalar ASG, atualizar Route 53. Custo moderado.</p><p><strong>Warm Standby (RTO minutos):</strong> ambiente completo rodando na região de DR em escala reduzida (1 instância onde prod tem 10). Em desastre: escalar via ASG + mudança de DNS. Detecta problemas mais cedo (ambiente ativo recebe tráfego real de teste).</p><p><strong>Multi-Site Active/Active (RTO segundos):</strong> duas regiões com tráfego real simultâneo via Route 53 Latency-based routing. Sem failover — redundância constante. Mais caro e complexo (dados sincronizados em tempo real). Para sistemas onde downtime é inaceitável.</p>", tip: "Sempre pergunte: qual é o RTO (tempo para voltar) e RPO (perda de dados aceitável) aceitável? A estratégia de DR deve ser dimensionada pelo que o negócio tolera, não pela complexidade técnica preferida.", level: "senior" },
    ],
    mnemonics: [
      {
        label: "TCRIGPe — famílias EC2 em ordem de uso",
        trick: "T (burstable), C (compute), R (ram), I (iops), G (gpu), P (processamento ML)",
        explanation: "Mnemônico para lembrar as famílias de instância EC2: T de Temporário/Esporádico (burstable com créditos), C de CPU/Computação intensiva, R de RAM (memory optimized), I de I/O (NVMe local), G de GPU (gráficos, games), P de Potência GPU (treinamento ML de larga escala). A série M (general purpose) fica no meio — balanced entre todas.",
      },
      {
        label: "SOS-R — modelos de precificação EC2",
        trick: "Sob demanda, On-demand, Savings, Reserved, Spot",
        explanation: "Os 4 modelos em ordem crescente de desconto: On-Demand (sem desconto, sem compromisso — picos), Savings Plans (até 66% — baseline com flexibilidade de tipo), Reserved Instances (até 72% — baseline com tipo fixo), Spot (até 90% — interruptível). Regra de ouro: combine Savings Plans (baseline) + Spot (escala) + On-Demand (picos críticos).",
      },
      {
        label: "CBD — placement group para escolher",
        trick: "Cluster (latência), Broadcast (HA), Distributed (partições)",
        explanation: "Cluster = latência mínima entre nós (HPC, MPI). Spread (Broadcast) = máxima HA, cada instância em rack diferente (apps críticos com poucas instâncias). Partition (Distributed) = isolamento por grupos de nós, sem compartilhar hardware entre partições (Kafka, Hadoop, Cassandra — isolamento por shard).",
      },
    ],
    cheatsheet: {
      title: "EC2 Cheatsheet — CLI, famílias e precificação",
      html: `<style>
.ec2cs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.ec2cs-h2{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#FF9900;font-weight:700;margin:16px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(255,153,0,.2)}
.ec2cs-h2:first-child{margin-top:0}
.ec2cs-table{width:100%;border-collapse:collapse;font-size:10px}
.ec2cs-table th{text-align:left;color:#64748b;font-weight:600;padding:4px 8px;border-bottom:1px solid #1e293b;font-size:9px;letter-spacing:.06em;text-transform:uppercase}
.ec2cs-table td{padding:5px 8px;border-bottom:1px solid #0f172a;color:#94a3b8;vertical-align:top;line-height:1.5}
.ec2cs-table tr:last-child td{border-bottom:none}
.ec2cs-table td:first-child{color:#e2e8f0;white-space:nowrap;font-weight:500}
.ec2cs-code{background:#1e293b;border-radius:6px;padding:10px 14px;font-size:10px;color:#94a3b8;line-height:2;overflow-x:auto;margin-bottom:4px}
.ec2cs-code .kw{color:#64748b}
.ec2cs-code .svc{color:#FF9900;font-weight:700}
.ec2cs-code .flag{color:#61DAFB}
.ec2cs-code .val{color:#4ade80}
</style>
<div class="ec2cs-wrap">
  <p style="font-size:12px;font-weight:600;color:#e2e8f0;margin:0 0 4px">EC2 Cheatsheet</p>
  <p style="font-size:10px;color:#475569;margin:0 0 14px">Famílias, precificação, EBS e CLI</p>

  <div class="ec2cs-h2">Famílias de instância</div>
  <table class="ec2cs-table">
    <tr><th>Família</th><th>Otimizada para</th><th>Exemplos</th><th>Usar quando</th></tr>
    <tr><td>t3/t4g</td><td>Burstable CPU</td><td>t3.micro, t4g.small</td><td>Dev/test, tráfego esporádico</td></tr>
    <tr><td>m6i/m7g</td><td>Uso geral</td><td>m6i.xlarge, m7g.large</td><td>APIs, backends, apps de propósito geral</td></tr>
    <tr><td>c6i/c7g</td><td>Compute intensivo</td><td>c7g.2xlarge</td><td>Encoding, compilação, batch CPU</td></tr>
    <tr><td>r6i/r7g</td><td>Memory-optimized</td><td>r6i.xlarge</td><td>Redis, caches, análise em memória</td></tr>
    <tr><td>i3/i4i</td><td>Storage (NVMe)</td><td>i3.xlarge</td><td>Cassandra, Elasticsearch, NoSQL</td></tr>
    <tr><td>g4dn/g5</td><td>GPU gráfico/ML</td><td>g4dn.xlarge</td><td>Inferência ML, rendering, gaming</td></tr>
    <tr><td>p3/p4</td><td>GPU HPC</td><td>p3.2xlarge</td><td>Treinamento ML, deep learning</td></tr>
  </table>

  <div class="ec2cs-h2">Tipos de EBS</div>
  <table class="ec2cs-table">
    <tr><th>Tipo</th><th>IOPS</th><th>Throughput</th><th>Usar quando</th></tr>
    <tr><td>gp3 (padrão)</td><td>3.000–16.000</td><td>125–1.000 MB/s</td><td>Uso geral — SO, dados, apps</td></tr>
    <tr><td>gp2 (legado)</td><td>3 IOPS/GB</td><td>250 MB/s</td><td>Evitar — migre para gp3</td></tr>
    <tr><td>io2/io2bx</td><td>até 256.000</td><td>até 4.000 MB/s</td><td>Oracle, SQL Server I/O intensivo</td></tr>
    <tr><td>st1</td><td>baixo</td><td>até 500 MB/s</td><td>Logs, big data sequencial</td></tr>
    <tr><td>sc1</td><td>baixíssimo</td><td>até 250 MB/s</td><td>Dados frios, backups</td></tr>
  </table>

  <div class="ec2cs-h2">Precificação</div>
  <table class="ec2cs-table">
    <tr><th>Modelo</th><th>Desconto</th><th>Quando usar</th></tr>
    <tr><td>On-Demand</td><td>—</td><td>Picos imprevisíveis, dev/test</td></tr>
    <tr><td>Savings Plans</td><td>até 66%</td><td>Baseline previsível, tipo flexível</td></tr>
    <tr><td>Reserved Instances</td><td>até 72%</td><td>Baseline com tipo de instância fixo</td></tr>
    <tr><td>Spot</td><td>até 90%</td><td>Batch, CI/CD, ML — tolerante a interrupção</td></tr>
  </table>

  <div class="ec2cs-h2">CLI Commands essenciais</div>
  <div class="ec2cs-code">
<span class="kw"># Listar instâncias rodando</span>
aws <span class="svc">ec2</span> describe-instances <span class="flag">--filters</span> <span class="val">"Name=instance-state-name,Values=running"</span> <span class="flag">--query</span> <span class="val">'Reservations[*].Instances[*].[InstanceId,InstanceType,State.Name,PublicIpAddress]'</span> <span class="flag">--output</span> table

<span class="kw"># Iniciar / parar / terminar</span>
aws <span class="svc">ec2</span> start-instances <span class="flag">--instance-ids</span> i-0abc123
aws <span class="svc">ec2</span> stop-instances <span class="flag">--instance-ids</span> i-0abc123
aws <span class="svc">ec2</span> terminate-instances <span class="flag">--instance-ids</span> i-0abc123

<span class="kw"># Criar snapshot do EBS</span>
aws <span class="svc">ec2</span> create-snapshot <span class="flag">--volume-id</span> vol-0abc123 <span class="flag">--description</span> <span class="val">"backup-$(date +%Y%m%d)"</span>

<span class="kw"># Modificar volume EBS (gp2 → gp3, sem downtime)</span>
aws <span class="svc">ec2</span> modify-volume <span class="flag">--volume-id</span> vol-0abc123 <span class="flag">--volume-type</span> gp3 <span class="flag">--iops</span> 3000

<span class="kw"># Descrever ASG</span>
aws <span class="svc">autoscaling</span> describe-auto-scaling-groups <span class="flag">--auto-scaling-group-names</span> minha-api-asg

<span class="kw"># Instance Refresh (troca AMI sem downtime)</span>
aws <span class="svc">autoscaling</span> start-instance-refresh <span class="flag">--auto-scaling-group-name</span> minha-api-asg <span class="flag">--preferences</span> <span class="val">'{"MinHealthyPercentage":90,"InstanceWarmup":120}'</span>

<span class="kw"># SSM Session Manager — acesso sem SSH/porta 22</span>
aws <span class="svc">ssm</span> start-session <span class="flag">--target</span> i-0abc123
  </div>
</div>`,
    },
    resources: [
      { title: "AWS EC2 docs", url: "https://docs.aws.amazon.com/ec2/", kind: "docs" },
      { title: "EC2 instance types comparison", url: "https://instances.vantage.sh/", kind: "pratica" },
      { title: "AWS Compute Optimizer", url: "https://aws.amazon.com/compute-optimizer/", kind: "docs" },
      { title: "EC2 Image Builder", url: "https://docs.aws.amazon.com/imagebuilder/", kind: "docs" },
      { title: "AWS Spot Instances — Interruption Advisor", url: "https://aws.amazon.com/ec2/spot/instance-advisor/", kind: "pratica" },
    ],
    videos: [
      { title: "Amazon EC2 Fundamentals — Complete Beginner Guide", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=iHX-jtKIVNA", topic: "EC2 do zero: instâncias, AMI, Security Groups, Elastic IP" },
      { title: "EC2 Auto Scaling Deep Dive — re:Invent", channel: "AWS Events", url: "https://www.youtube.com/watch?v=9BlsFNBnKHc", topic: "Target tracking, step scaling, mixed instances, Spot + On-demand" },
      { title: "EC2 Spot Instances Best Practices", channel: "AWS Online Tech Talks", url: "https://www.youtube.com/watch?v=Z4L0SxVSG2M", topic: "Interrupt handler, mixed ASG, economia real de custo" },
      { title: "EBS Volume Types Explained — gp2 vs gp3 vs io2", channel: "Be A Better Dev", url: "https://www.youtube.com/watch?v=77qLAl-lRpo", topic: "Diferença prática de performance e custo entre tipos EBS" },
    ],
    codeExamples: [
      {
        title: "Launch Template com Auto Scaling Group — Terraform",
        description: "ASG com Launch Template, Target Tracking e mixed instances (On-Demand + Spot)",
        language: "hcl",
        code: `# Launch Template — define a configuração de cada instância
resource "aws_launch_template" "api" {
  name_prefix   = "minha-api-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = "m7g.large"  # Graviton — mais barato

  iam_instance_profile {
    name = aws_iam_instance_profile.api.name
  }

  vpc_security_group_ids = [aws_security_group.api.id]

  # Desabilitar IMDSv1 — segurança contra SSRF
  metadata_options {
    http_tokens                 = "required"   # força IMDSv2
    http_put_response_hop_limit = 1
  }

  # EBS root: gp3, encriptado, tamanho adequado
  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_type           = "gp3"
      volume_size           = 30
      iops                  = 3000
      encrypted             = true
      delete_on_termination = true
    }
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    # User Data minimalista — prefira AMI baked para ASG
    systemctl start minha-api
  EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = { Name = "minha-api", Env = var.env }
  }
}

# Auto Scaling Group com mixed instances (On-Demand base + Spot escala)
resource "aws_autoscaling_group" "api" {
  name                = "minha-api-asg"
  vpc_zone_identifier = module.vpc.private_subnet_ids
  target_group_arns   = [aws_lb_target_group.api.arn]
  health_check_type   = "ELB"
  health_check_grace_period = 120

  min_size         = 2
  max_size         = 20
  desired_capacity = 2

  mixed_instances_policy {
    instances_distribution {
      on_demand_base_capacity                  = 2    # mínimo On-Demand
      on_demand_percentage_above_base_capacity = 0    # escala toda em Spot
      spot_allocation_strategy                 = "price-capacity-optimized"
    }
    launch_template {
      launch_template_specification {
        launch_template_id = aws_launch_template.api.id
        version            = "$Latest"
      }
      # Diversidade de tipos para aumentar disponibilidade de Spot
      override {
        instance_type = "m7g.large"
      }
      override {
        instance_type = "m6g.large"
      }
      override {
        instance_type = "c7g.xlarge"
      }
    }
  }

  # Target Tracking — mantém CPU em 60%
  lifecycle { create_before_destroy = true }
}

resource "aws_autoscaling_policy" "cpu" {
  name                   = "cpu-target-tracking"
  autoscaling_group_name = aws_autoscaling_group.api.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 60.0
  }
}`,
      },
      {
        title: "User Data script — bootstrap de instância Node.js",
        description: "Script de inicialização que instala dependências, configura serviço systemd e habilita SSM",
        language: "bash",
        code: `#!/bin/bash
set -e  # aborta se qualquer comando falhar

# Atualizar pacotes do sistema
yum update -y

# Instalar Node.js 20 via NodeSource
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# Instalar SSM Agent (para Session Manager sem SSH)
yum install -y amazon-ssm-agent
systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent

# Criar usuário para a aplicação
useradd -r -s /bin/false appuser

# Criar diretório da aplicação
mkdir -p /opt/minha-api
cd /opt/minha-api

# Buscar código do S3 (bucket privado — acesso via IAM Role)
aws s3 cp s3://minha-empresa-deploys/api-latest.tar.gz .
tar -xzf api-latest.tar.gz
npm ci --only=production

# Ajustar permissões
chown -R appuser:appuser /opt/minha-api

# Configurar variáveis de ambiente via Secrets Manager
DB_SECRET=$(aws secretsmanager get-secret-value \
  --secret-id prod/minha-api/db \
  --query SecretString \
  --output text)

# Criar arquivo de environment para o serviço systemd
cat > /etc/minha-api/env << EOF
NODE_ENV=production
PORT=3000
DB_HOST=$(echo $DB_SECRET | jq -r .host)
DB_USER=$(echo $DB_SECRET | jq -r .username)
DB_PASS=$(echo $DB_SECRET | jq -r .password)
EOF

# Criar unidade systemd
cat > /etc/systemd/system/minha-api.service << EOF
[Unit]
Description=Minha API Node.js
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/minha-api
EnvironmentFile=/etc/minha-api/env
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable minha-api
systemctl start minha-api

# Health check — aguardar app subir antes de sinalizar ASG
for i in $(seq 1 30); do
  if curl -sf http://localhost:3000/health; then
    echo "API OK"
    break
  fi
  sleep 2
done`,
      },
      {
        title: "Interrupt Handler para Spot Instances — Node.js",
        description: "Captura o sinal de interrupção Spot (2 min de aviso) e faz checkpoint do estado antes de encerrar",
        language: "typescript",
        code: `import { EC2MetadataClient, GetSpotInstanceActionCommand } from '@aws-sdk/client-ec2-instance-connect'

// Verifica a cada 5s se a instância Spot vai ser interrompida
async function pollSpotInterruption(): Promise<void> {
  // IMDSv2 — obter token primeiro
  const tokenResponse = await fetch('http://169.254.169.254/latest/api/token', {
    method: 'PUT',
    headers: { 'X-aws-ec2-metadata-token-ttl-seconds': '21600' },
  })
  const token = await tokenResponse.text()

  const checkInterruption = async () => {
    try {
      const res = await fetch(
        'http://169.254.169.254/latest/meta-data/spot/instance-action',
        { headers: { 'X-aws-ec2-metadata-token': token } }
      )

      if (res.status === 200) {
        // Aviso de interrupção recebido! Temos ~2 minutos.
        const action = await res.json() as { action: string; time: string }
        console.log('⚠ SPOT INTERRUPTION WARNING:', action)
        await gracefulShutdown()
      }
    } catch {
      // 404 = sem aviso de interrupção (normal)
    }
  }

  setInterval(checkInterruption, 5000)
}

// Encerramento gracioso: para de aceitar novos jobs, finaliza em andamento
let isShuttingDown = false
const activeJobs = new Set<string>()

async function gracefulShutdown(): Promise<void> {
  if (isShuttingDown) return
  isShuttingDown = true

  console.log('Iniciando encerramento gracioso. Jobs ativos:', activeJobs.size)

  // Notificar ALB para parar de enviar tráfego
  // (ASG remove a instância do target group em ~30s)

  // Aguardar jobs em andamento finalizarem (máximo 90s — sobram 30s de margem)
  const timeout = Date.now() + 90_000
  while (activeJobs.size > 0 && Date.now() < timeout) {
    console.log(\`Aguardando \${activeJobs.size} jobs...\`)
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  if (activeJobs.size > 0) {
    console.log(\`Timeout: \${activeJobs.size} jobs não finalizaram. Salvando checkpoint...\`)
    await saveCheckpoint([...activeJobs])
  }

  process.exit(0)
}

async function saveCheckpoint(jobIds: string[]): Promise<void> {
  // Salvar estado no S3 ou DynamoDB para retomar na próxima instância
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')
  const s3 = new S3Client({ region: 'us-east-1' })

  await s3.send(new PutObjectCommand({
    Bucket: process.env.CHECKPOINT_BUCKET!,
    Key: \`checkpoints/\${process.env.INSTANCE_ID}-\${Date.now()}.json\`,
    Body: JSON.stringify({ jobIds, savedAt: new Date().toISOString() }),
    ContentType: 'application/json',
  }))
}

// Iniciar polling ao subir o processo
pollSpotInterruption()`,
      },
    ],
    exercises: [
      {
        level: "iniciante",
        title: "Subir uma EC2 e configurar um servidor web com User Data",
        description: "Crie uma instância EC2 t3.micro com Amazon Linux 2023 em uma subnet pública. Use User Data para instalar nginx e criar uma página HTML simples. Configure o Security Group para aceitar HTTPS (443) apenas e HTTP (80) de qualquer IP. Acesse via IP público e verifique que o nginx responde. Depois, pare a instância (stop, não terminate) e observe que o IP público muda ao reiniciar — compare com Elastic IP.",
        concepts: ["EC2", "User Data", "Security Group", "AMI", "Elastic IP"],
        hint: "O User Data roda como root na primeira inicialização. Use '#!/bin/bash' na primeira linha. Para instalar nginx no Amazon Linux 2023: 'dnf install -y nginx && systemctl enable nginx && systemctl start nginx'. Lembre de abrir a porta 80 no Security Group — sem isso o nginx não é acessível de fora.",
      },
      {
        level: "intermediario",
        title: "Auto Scaling Group com ALB e Target Tracking",
        description: "Crie um ALB em subnets públicas com listener HTTP:80. Crie um Launch Template com uma AMI que tenha uma aplicação simples expondo /health. Crie um ASG com min=2, desired=2, max=6 em subnets privadas. Configure Target Tracking Policy com CPUUtilization target 60%. Registre o ASG no Target Group do ALB. Gere carga artificial com 'stress' na instância e observe o scale-out acontecer no CloudWatch. Verifique os logs do ALB para confirmar distribuição de tráfego.",
        concepts: ["ALB", "ASG", "Target Tracking", "Launch Template", "Health Check", "CloudWatch"],
        hint: "Para gerar carga: ssh na instância (ou SSM Session Manager) e rode 'stress --cpu 4 --timeout 300'. Crie um CloudWatch dashboard com as métricas CPUUtilization do ASG e GroupDesiredCapacity para visualizar o scale-out em tempo real. A instância nova demora ~2-3min para aparecer (boot + health check grace period).",
      },
      {
        level: "senior",
        title: "Pipeline de Golden AMI com EC2 Image Builder + Instance Refresh",
        description: "Configure um pipeline de Golden AMI: (1) EC2 Image Builder pipeline com Amazon Linux 2023 base, componente para instalar Node.js 20 e sua aplicação, e um test component que roda 'npm test'. (2) EventBridge rule que dispara o pipeline semanalmente (para pegar patches do OS). (3) Lambda que, após o pipeline completar com sucesso, atualiza o Launch Template do ASG com a nova AMI ID e dispara um Instance Refresh com MinHealthyPercentage=90%. (4) CloudWatch Alarm que alerta se o Instance Refresh falhar. Documente a estratégia de rollback (reverter Launch Template para versão anterior + novo Instance Refresh).",
        concepts: ["EC2 Image Builder", "Golden AMI", "Instance Refresh", "Lambda", "EventBridge", "CloudWatch", "imutable infrastructure"],
        hint: "A Lambda precisa de permissões: ec2:DescribeLaunchTemplateVersions, ec2:CreateLaunchTemplateVersion, autoscaling:StartInstanceRefresh. Use o SDK boto3 (Python) ou @aws-sdk (Node.js). O ARN da nova AMI chega no evento do EventBridge quando o Image Builder pipeline completa com status SUCCESS. Para rollback: guarde a versão anterior do Launch Template e tenha um runbook documentado com o comando de Instance Refresh usando a versão antiga.",
      },
    ],
    mindmap: {
      title: "EC2 — mapa mental de conceitos",
      html: `<style>
.ec2mm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.ec2mm-center{background:#FF9900;color:#0f172a;border-radius:10px;padding:10px 18px;font-weight:700;font-size:12px;text-align:center;display:inline-block}
.ec2mm-branch{margin-bottom:10px}
.ec2mm-branch-title{font-size:9px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.ec2mm-branch-title::before{content:'';display:block;width:12px;height:2px;background:currentColor}
.ec2mm-nodes{display:flex;flex-wrap:wrap;gap:5px;margin-left:18px}
.ec2mm-node{background:#1e293b;border-radius:6px;padding:4px 9px;font-size:9.5px;color:#94a3b8;border:1px solid #334155}
</style>
<div class="ec2mm-wrap">
  <div style="text-align:center;margin-bottom:16px"><div class="ec2mm-center">EC2</div></div>

  <div class="ec2mm-branch">
    <div class="ec2mm-branch-title" style="color:#f59e0b">Famílias de instância</div>
    <div class="ec2mm-nodes">
      <div class="ec2mm-node">t-série — burstable</div>
      <div class="ec2mm-node">m-série — uso geral</div>
      <div class="ec2mm-node">c-série — CPU intensivo</div>
      <div class="ec2mm-node">r-série — memória</div>
      <div class="ec2mm-node">i-série — NVMe local</div>
      <div class="ec2mm-node">g/p — GPU</div>
      <div class="ec2mm-node">Graviton — ARM, 20-40% mais barato</div>
    </div>
  </div>

  <div class="ec2mm-branch">
    <div class="ec2mm-branch-title" style="color:#3b82f6">Storage</div>
    <div class="ec2mm-nodes">
      <div class="ec2mm-node">EBS gp3 — uso geral</div>
      <div class="ec2mm-node">EBS io2 — I/O intensivo</div>
      <div class="ec2mm-node">Instance Store — NVMe efêmero</div>
      <div class="ec2mm-node">Snapshots → S3</div>
      <div class="ec2mm-node">Elastic Volumes — sem downtime</div>
    </div>
  </div>

  <div class="ec2mm-branch">
    <div class="ec2mm-branch-title" style="color:#4ade80">Auto Scaling</div>
    <div class="ec2mm-nodes">
      <div class="ec2mm-node">Launch Template</div>
      <div class="ec2mm-node">ASG — min/desired/max</div>
      <div class="ec2mm-node">Target Tracking</div>
      <div class="ec2mm-node">Step Scaling</div>
      <div class="ec2mm-node">Scheduled Scaling</div>
      <div class="ec2mm-node">Instance Refresh</div>
    </div>
  </div>

  <div class="ec2mm-branch">
    <div class="ec2mm-branch-title" style="color:#a855f7">Precificação</div>
    <div class="ec2mm-nodes">
      <div class="ec2mm-node">On-Demand</div>
      <div class="ec2mm-node">Savings Plans — até 66%</div>
      <div class="ec2mm-node">Reserved — até 72%</div>
      <div class="ec2mm-node">Spot — até 90%</div>
      <div class="ec2mm-node">Dedicated Host</div>
    </div>
  </div>

  <div class="ec2mm-branch">
    <div class="ec2mm-branch-title" style="color:#ef4444">Segurança</div>
    <div class="ec2mm-nodes">
      <div class="ec2mm-node">IAM Instance Profile</div>
      <div class="ec2mm-node">Security Groups</div>
      <div class="ec2mm-node">IMDSv2 obrigatório</div>
      <div class="ec2mm-node">EBS encryption</div>
      <div class="ec2mm-node">SSM Session Manager</div>
    </div>
  </div>

  <div class="ec2mm-branch">
    <div class="ec2mm-branch-title" style="color:#FF9900">Placement</div>
    <div class="ec2mm-nodes">
      <div class="ec2mm-node">Cluster — latência HPC</div>
      <div class="ec2mm-node">Spread — HA isolado</div>
      <div class="ec2mm-node">Partition — Kafka/Hadoop</div>
    </div>
  </div>
</div>`,
      caption: "EC2 tem muitas dimensões — família, storage, scaling, precificação, segurança e placement. A combinação certa para cada workload é o que diferencia sênior de pleno.",
    },
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
      { q: "O que é S3 Transfer Acceleration e quando usar?", a: "<p>Transfer Acceleration usa a rede global de edge locations do CloudFront para acelerar uploads de longa distância para o S3. Em vez de enviar direto para o bucket na região, o cliente envia para o edge location mais próximo — o dado trafega pela rede backbone privada da AWS (muito mais rápida e confiável que a internet pública) até o bucket.</p><p><strong>Quando faz sentido:</strong> clientes distribuídos globalmente fazendo upload para um bucket centralizado (ex: usuários no Brasil e Ásia uploading para bucket em us-east-1). Não faz sentido para transferências na mesma região.</p><p><strong>Como habilitar:</strong> ativar na configuração do bucket, usar o endpoint <code>bucket.s3-accelerate.amazonaws.com</code> em vez do endpoint padrão. AWS cobra um adicional por GB transferido via acceleração.</p><p>Para verificar se vale: use o <strong>Amazon S3 Transfer Acceleration Speed Comparison Tool</strong> — compara a velocidade com e sem acceleração para sua localização.</p>", level: "pleno" },
      { q: "Como funcionam os S3 Access Points?", a: "<p>S3 Access Points são endpoints nomeados e configuráveis anexados a um bucket. Cada Access Point tem sua própria política de acesso (como uma bucket policy dedicada) e pode ser restrito a uma VPC específica.</p><p><strong>Problema que resolvem:</strong> um bucket compartilhado por múltiplos workloads (equipe de dados, aplicação web, pipeline de ML) acaba com uma bucket policy monstruosa e difícil de manter. Cada Access Point tem sua política focada em um único caso de uso.</p><p><strong>Exemplo:</strong> bucket <code>dados-prod</code> com 3 Access Points: <code>analytics-ap</code> (só leitura, acesso de qualquer lugar), <code>webapp-ap</code> (leitura + escrita, restrito à VPC da aplicação), <code>ml-pipeline-ap</code> (leitura de prefix específico, restrito à VPC de ML).</p><p><strong>Restrição de VPC:</strong> um Access Point com VPC restriction garante que o acesso ao S3 só ocorra dentro da VPC — sem acesso público, sem internet.</p>", level: "senior" },
      { q: "O que é multipart upload e quando é necessário?", a: "<p>Multipart upload divide arquivos grandes em partes e as envia em paralelo. Cada parte é enviada independentemente (pode ser em threads ou máquinas diferentes). O S3 remonta o objeto apenas após todas as partes serem confirmadas.</p><p><strong>Quando obrigatório:</strong> objetos maiores que 5 GB. AWS não aceita PUT simples acima desse limite.</p><p><strong>Quando recomendado:</strong> a partir de 100 MB — uploads em paralelo são muito mais rápidos. Se uma parte falhar, só essa parte é reenviada (não o arquivo inteiro). Ideal para uploads via rede instável.</p><p><strong>Armadilha:</strong> partes incompletas (upload iniciado mas não concluído) continuam ocupando storage e gerando custo. Configure uma lifecycle rule para abortar multipart uploads incompletos após X dias: <code>AbortIncompleteMultipartUpload { DaysAfterInitiation: 7 }</code>.</p><p>AWS CLI usa multipart upload automaticamente para arquivos maiores que 8 MB com o comando <code>aws s3 cp</code>.</p>", level: "pleno" },
      { q: "Qual a diferença entre CRR e SRR no S3 Replication?", a: "<p><strong>CRR (Cross-Region Replication):</strong> replica objetos para um bucket em outra região AWS. Requer versioning ativado nos dois buckets. Casos de uso: DR com cópia em outra região, servir dados com latência menor para usuários em outra região, requisito de compliance de data residency (cópia em jurisdição diferente).</p><p><strong>SRR (Same-Region Replication):</strong> replica dentro da mesma região. Casos de uso: consolidar logs de múltiplos buckets em um único bucket centralizado, criar cópia imutável separada (bucket de destino com Object Lock) para proteção contra ransomware, separar ambientes (prod replica para bucket de test com dados reais mascarados).</p><p><strong>Características comuns:</strong> replicação é assíncrona (lag de segundos a minutos). Não é retroativa — replica apenas objetos criados/modificados após ativar. Delete markers são replicados se configurado explicitamente (não por padrão). Replication Time Control (RTC) garante replicação em 15 minutos com SLA — cobrado adicionalmente.</p>", level: "senior" },
      { q: "Como implementar segurança em profundidade no S3?", a: "<p><strong>Camada 1 — Block Public Access (primeira linha de defesa):</strong> ativar em nível de conta AWS (bloqueia todos os buckets, inclusive os criados futuramente). Não depende de configuração por bucket.</p><p><strong>Camada 2 — Bucket Policy:</strong> controla acesso ao bucket (quem pode fazer o quê). Deny explícito com condition para bloquear acesso de fora da VPC: <code>Condition: {StringNotEquals: {\"aws:SourceVpc\": \"vpc-xxx\"}}</code>.</p><p><strong>Camada 3 — IAM Policies:</strong> o que a identidade (usuário, role) pode fazer. Combine com bucket policy — para acesso cross-account, as duas precisam permitir.</p><p><strong>Camada 4 — Criptografia:</strong> SSE-KMS com chave gerenciada pelo cliente. Auditoria via CloudTrail de toda operação de descriptografia.</p><p><strong>Camada 5 — Monitoramento:</strong> Amazon Macie detecta automaticamente dados sensíveis (PII, credenciais, dados financeiros) em objetos S3. CloudTrail S3 data events para auditoria de acesso a objetos específicos. Alertas no CloudWatch em acessos anômalos (volume alto de GetObject de IP desconhecido).</p>", tip: "Mencione a sequência de avaliação: Block Public Access → Bucket Policy → IAM Policy. Se qualquer camada negar, o acesso é negado.", level: "senior" },
      { q: "O que são S3 Event Notifications e como usá-las para pipelines?", a: "<p>S3 Event Notifications disparam automaticamente quando eventos ocorrem em um bucket: PutObject, DeleteObject, RestoreObject, Replication, etc. Você pode filtrar por prefixo (uploads/), sufixo (.jpg) ou ambos.</p><p><strong>Destinos possíveis:</strong> Lambda (processamento inline), SQS (fila para processamento assíncrono com retry), SNS (fan-out para múltiplos destinos), EventBridge (roteamento avançado com filtros complexos).</p><p><strong>Pipeline típico de processamento de mídia:</strong> usuário faz upload de vídeo → S3 Event → SQS → Lambda pega da fila → chama MediaConvert para transcodificar → salva em bucket de destino → S3 Event → Lambda envia notificação ao usuário.</p><p><strong>EventBridge vs S3 Notifications diretas:</strong> EventBridge tem filtros mais sofisticados (filtra por atributos do objeto, tamanho, etc.) e histórico de eventos. S3 Notifications diretas têm menor latência. Para novas arquiteturas, prefira EventBridge — mais flexível para evoluir o pipeline sem alterar a configuração do bucket.</p>", level: "pleno" },
      { q: "Como usar S3 Select para reduzir custo de consultas em data lakes?", a: "<p>S3 Select permite executar expressões SQL simples diretamente em objetos S3 individuais (CSV, JSON, Parquet, ORC com compressão GZIP/BZIP2) sem baixar o arquivo completo. A computação ocorre no S3 — somente os dados filtrados são transferidos.</p><p><strong>Quando faz diferença:</strong> objeto de 1 GB mas você precisa só de 1% dos dados (10 MB). Sem S3 Select: baixa 1 GB, filtra localmente. Com S3 Select: AWS processa e transfere apenas 10 MB. Reduz custo de transferência e latência.</p><p><strong>Quando usar Athena em vez de S3 Select:</strong> Athena processa múltiplos objetos em paralelo (escaneia toda a partição). S3 Select processa um objeto por vez. Para queries que varrrem centenas de arquivos, Athena é muito mais eficiente. S3 Select é melhor quando você sabe exatamente qual arquivo processar (ex: processando um arquivo específico numa Lambda).</p><p>Custo: paga por dados escaneados e dados retornados — sempre mais barato que baixar o arquivo todo.</p>", level: "senior" },
      { q: "Como configurar um site estático no S3 com HTTPS via CloudFront?", a: "<p><strong>1. Bucket S3:</strong> criar bucket com nome do domínio (ou qualquer nome), habilitar Static Website Hosting, fazer upload dos arquivos estáticos. Block Public Access ativado — bucket privado, acesso apenas via CloudFront.</p><p><strong>2. Certificado ACM:</strong> criar certificado SSL/TLS para o domínio no ACM (obrigatoriamente em us-east-1 para CloudFront). Validação via DNS (CNAME no Route 53 — automático se o domínio estiver no Route 53).</p><p><strong>3. CloudFront Distribution:</strong> Origin = bucket S3 (usar S3 REST API endpoint, não o website endpoint). Origin Access Control (OAC) — substitui o OAI legado. O CloudFront gera automaticamente a bucket policy necessária. Alternate Domain Names = seu domínio. Certificado = o do ACM. HTTPS Only ou Redirect HTTP to HTTPS.</p><p><strong>4. Route 53:</strong> registro A (Alias) apontando para o distribution do CloudFront.</p><p>Custo: S3 storage + CloudFront (mais barato que egress direto S3) + ACM (gratuito) + Route 53 ($0.50/hosted zone/mês).</p>", level: "pleno" },
    ],
    mnemonics: [
      {
        label: "SSIG-DA — classes de storage S3 em ordem de custo",
        trick: "Standard → Standard-IA → Intelligent-Tiering → Glacier Instant → Deep Archive",
        explanation: "As classes S3 em ordem crescente de economia (e crescente de restrição de acesso): Standard (acesso frequente, sem retrieval), Standard-IA (Infrequent Access — paga retrieval, storage mais barato), Intelligent-Tiering (move automaticamente entre camadas), Glacier Instant (arquivamento com acesso em ms, retrieval pago), Deep Archive (mais barato de todos, retrieval em 12-48h). Em entrevista: o critério de escolha é frequência de acesso vs custo de retrieval vs latência aceitável.",
      },
      {
        label: "BBIA — camadas de segurança S3",
        trick: "Block Public Access → Bucket Policy → IAM Policy → Audit (CloudTrail/Macie)",
        explanation: "Quatro camadas de segurança em profundidade no S3. Block Public Access: nível de conta/bucket, bloqueia tudo. Bucket Policy: quem pode acessar o bucket (resource-based). IAM Policy: o que a identidade pode fazer (identity-based). Audit: CloudTrail registra todo acesso, Macie detecta dados sensíveis. Deny em qualquer camada cancela o acesso — independentemente das outras.",
      },
      {
        label: "VPC — Versionamento protege contra Perda acidental de Conteúdo",
        trick: "V de Versioning, P de Proteção, C de Conteúdo (e MFA Delete como tranca extra)",
        explanation: "Habilitar Versionamento no S3 preserva todas as versões anteriores de cada objeto. Um DELETE cria apenas um delete marker — a versão real ainda existe e pode ser restaurada. MFA Delete adiciona uma segunda camada: exige código MFA para deletar versões permanentemente ou desabilitar o versionamento. Combine Versioning + MFA Delete + Object Lock para proteção máxima contra deleção acidental ou ransomware.",
      },
      {
        label: "CRR-SRR: Cross = outra Região, Same = mesma Região",
        trick: "Cross-Region Replication = DR + latência global. Same-Region = consolidação + cópia imutável.",
        explanation: "CRR replica para outra região: DR geográfico, latência para usuários distantes, compliance de data residency. SRR replica dentro da mesma região: consolidar logs em bucket central, criar cópia com Object Lock (proteção contra ransomware), separar dados prod/dev. Ambos requerem versioning nos dois buckets e são assíncronos — não substitui backup.",
      },
    ],
    cheatsheet: {
      title: "S3 Cheatsheet — classes, segurança e CLI",
      html: `<style>
.s3cs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.s3cs-h2{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#FF9900;font-weight:700;margin:16px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(255,153,0,.2)}
.s3cs-h2:first-child{margin-top:0}
.s3cs-table{width:100%;border-collapse:collapse;font-size:10px}
.s3cs-table th{text-align:left;color:#64748b;font-weight:600;padding:4px 8px;border-bottom:1px solid #1e293b;font-size:9px;letter-spacing:.06em;text-transform:uppercase}
.s3cs-table td{padding:5px 8px;border-bottom:1px solid #0f172a;color:#94a3b8;vertical-align:top;line-height:1.5}
.s3cs-table tr:last-child td{border-bottom:none}
.s3cs-table td:first-child{color:#e2e8f0;font-weight:500}
.s3cs-code{background:#1e293b;border-radius:6px;padding:10px 14px;font-size:10px;color:#94a3b8;line-height:2;overflow-x:auto;margin-bottom:4px}
.s3cs-code .kw{color:#64748b}
.s3cs-code .svc{color:#FF9900;font-weight:700}
.s3cs-code .val{color:#4ade80}
.s3cs-code .flag{color:#93c5fd}
.s3cs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:500px){.s3cs-grid{grid-template-columns:1fr}}
</style>
<div class="s3cs-wrap">
  <p style="font-size:12px;font-weight:600;color:#e2e8f0;margin:0 0 4px">S3 Cheatsheet</p>
  <p style="font-size:10px;color:#475569;margin:0 0 14px">Classes de storage, segurança, lifecycle e CLI</p>

  <div class="s3cs-h2">Classes de storage — custo vs acesso</div>
  <table class="s3cs-table">
    <tr><th>Classe</th><th>Acesso</th><th>Retrieval</th><th>Usar quando</th></tr>
    <tr><td>Standard</td><td>Frequente</td><td>Sem taxa</td><td>Assets ativos, uploads recentes</td></tr>
    <tr><td>Standard-IA</td><td>Infrequente</td><td>Por GB</td><td>Backups, dados acessados raramente</td></tr>
    <tr><td>Intelligent-Tiering</td><td>Variável</td><td>Sem taxa</td><td>Padrão de acesso imprevisível</td></tr>
    <tr><td>Glacier Instant</td><td>Arquivamento</td><td>Por GB (ms)</td><td>Arquivamento com acesso ocasional</td></tr>
    <tr><td>Glacier Flexible</td><td>Arquivo frio</td><td>Por GB (min/h)</td><td>Retenção regulatória, DR frio</td></tr>
    <tr><td>Deep Archive</td><td>Arquivo gelado</td><td>Por GB (12-48h)</td><td>Retenção de 7-10 anos, compliance</td></tr>
  </table>

  <div class="s3cs-h2">Segurança — checklist</div>
  <table class="s3cs-table">
    <tr><th>Controle</th><th>Configuração</th></tr>
    <tr><td>Block Public Access</td><td>Ativar em conta + bucket — sempre</td></tr>
    <tr><td>Bucket Policy</td><td>Deny sem aws:SourceVpc se acesso só interno</td></tr>
    <tr><td>Criptografia em repouso</td><td>SSE-S3 (default) ou SSE-KMS (compliance)</td></tr>
    <tr><td>Versioning</td><td>Habilitar + MFA Delete em buckets críticos</td></tr>
    <tr><td>Object Lock (WORM)</td><td>Compliance mode para dados regulatórios</td></tr>
    <tr><td>Audit</td><td>CloudTrail S3 data events + Macie</td></tr>
  </table>

  <div class="s3cs-h2">CLI Commands essenciais</div>
  <div class="s3cs-code">
<span class="kw"># Listar e navegar</span>
aws <span class="svc">s3</span> ls s3://meu-bucket/
aws <span class="svc">s3</span> ls s3://meu-bucket/ <span class="flag">--recursive</span> <span class="flag">--human-readable</span>

<span class="kw"># Copiar e sincronizar</span>
aws <span class="svc">s3</span> cp arquivo.txt s3://meu-bucket/pasta/
aws <span class="svc">s3</span> cp s3://meu-bucket/arquivo.txt ./local/
aws <span class="svc">s3</span> sync ./dist s3://meu-bucket/static/ <span class="flag">--delete</span>
aws <span class="svc">s3</span> sync s3://bucket-origem/ s3://bucket-destino/

<span class="kw"># Pre-signed URL</span>
aws <span class="svc">s3</span> presign s3://meu-bucket/arquivo.pdf <span class="flag">--expires-in</span> 3600
aws <span class="svc">s3</span> presign s3://meu-bucket/upload.jpg <span class="flag">--expires-in</span> 900

<span class="kw"># Versioning e Object Lock</span>
aws <span class="svc">s3api</span> put-bucket-versioning <span class="flag">--bucket</span> meu-bucket <span class="flag">--versioning-configuration</span> <span class="val">Status=Enabled</span>
aws <span class="svc">s3api</span> list-object-versions <span class="flag">--bucket</span> meu-bucket <span class="flag">--prefix</span> arquivo.txt

<span class="kw"># Lifecycle policy</span>
aws <span class="svc">s3api</span> put-bucket-lifecycle-configuration <span class="flag">--bucket</span> meu-bucket <span class="flag">--lifecycle-configuration</span> file://lifecycle.json

<span class="kw"># Criar bucket com região específica</span>
aws <span class="svc">s3api</span> create-bucket <span class="flag">--bucket</span> meu-bucket <span class="flag">--region</span> us-east-1
aws <span class="svc">s3api</span> put-public-access-block <span class="flag">--bucket</span> meu-bucket <span class="flag">--public-access-block-configuration</span> <span class="val">'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true'</span>

<span class="kw"># Remover bucket com conteúdo (cuidado!)</span>
aws <span class="svc">s3</span> rb s3://meu-bucket <span class="flag">--force</span>
  </div>

  <div class="s3cs-h2">Lifecycle policy JSON — template</div>
  <div class="s3cs-code">
{
  <span class="val">"Rules"</span>: [{
    <span class="val">"ID"</span>: <span class="val">"MoverParaGlacier"</span>,
    <span class="val">"Status"</span>: <span class="val">"Enabled"</span>,
    <span class="val">"Filter"</span>: { <span class="val">"Prefix"</span>: <span class="val">"uploads/"</span> },
    <span class="val">"Transitions"</span>: [
      { <span class="val">"Days"</span>: 30,  <span class="val">"StorageClass"</span>: <span class="val">"STANDARD_IA"</span> },
      { <span class="val">"Days"</span>: 90,  <span class="val">"StorageClass"</span>: <span class="val">"GLACIER"</span> },
      { <span class="val">"Days"</span>: 365, <span class="val">"StorageClass"</span>: <span class="val">"DEEP_ARCHIVE"</span> }
    ],
    <span class="val">"Expiration"</span>: { <span class="val">"Days"</span>: 2555 },
    <span class="val">"AbortIncompleteMultipartUpload"</span>: { <span class="val">"DaysAfterInitiation"</span>: 7 }
  }]
}
  </div>
</div>`,
    },
    mindmap: {
      title: "S3 — mapa mental de conceitos",
      html: `<style>
.s3mm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.s3mm-center{background:#FF9900;color:#0f172a;border-radius:10px;padding:10px 18px;font-weight:700;font-size:12px;text-align:center;display:inline-block}
.s3mm-branch{margin-bottom:10px}
.s3mm-branch-title{font-size:9px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.s3mm-branch-title::before{content:'';display:block;width:12px;height:2px;background:currentColor}
.s3mm-nodes{display:flex;flex-wrap:wrap;gap:5px;margin-left:18px}
.s3mm-node{background:#1e293b;border-radius:6px;padding:4px 9px;font-size:9.5px;color:#94a3b8;border:1px solid #334155;cursor:default;transition:border-color .2s}
.s3mm-node:hover{border-color:#FF9900;color:#e2e8f0}
.s3mm-divider{width:100%;height:1px;background:#1e293b;margin:8px 0}
</style>
<div class="s3mm-wrap">
  <div style="text-align:center;margin-bottom:16px">
    <div class="s3mm-center">S3</div>
    <div style="font-size:10px;color:#475569;margin-top:6px">Object Storage — bucket + key + object</div>
  </div>

  <div class="s3mm-branch">
    <div class="s3mm-branch-title" style="color:#3b82f6">Classes de Storage</div>
    <div class="s3mm-nodes">
      <div class="s3mm-node">Standard — acesso frequente</div>
      <div class="s3mm-node">Standard-IA — infrequente</div>
      <div class="s3mm-node">Intelligent-Tiering — automático</div>
      <div class="s3mm-node">Glacier Instant — arquivo rápido</div>
      <div class="s3mm-node">Glacier Flexible — arquivo médio</div>
      <div class="s3mm-node">Deep Archive — 12-48h retrieval</div>
    </div>
  </div>

  <div class="s3mm-branch">
    <div class="s3mm-branch-title" style="color:#ef4444">Segurança</div>
    <div class="s3mm-nodes">
      <div class="s3mm-node">Block Public Access</div>
      <div class="s3mm-node">Bucket Policy</div>
      <div class="s3mm-node">IAM Policy</div>
      <div class="s3mm-node">SSE-S3 / SSE-KMS / SSE-C</div>
      <div class="s3mm-node">Object Lock (WORM)</div>
      <div class="s3mm-node">MFA Delete</div>
      <div class="s3mm-node">Macie — PII detector</div>
    </div>
  </div>

  <div class="s3mm-branch">
    <div class="s3mm-branch-title" style="color:#4ade80">Proteção de dados</div>
    <div class="s3mm-nodes">
      <div class="s3mm-node">Versioning</div>
      <div class="s3mm-node">CRR — Cross-Region Replication</div>
      <div class="s3mm-node">SRR — Same-Region Replication</div>
      <div class="s3mm-node">Lifecycle policies</div>
      <div class="s3mm-node">Transfer Acceleration</div>
    </div>
  </div>

  <div class="s3mm-branch">
    <div class="s3mm-branch-title" style="color:#f59e0b">Acesso e performance</div>
    <div class="s3mm-nodes">
      <div class="s3mm-node">Pre-signed URLs (GET/PUT)</div>
      <div class="s3mm-node">Multipart Upload (&gt;100 MB)</div>
      <div class="s3mm-node">S3 Select — SQL em objetos</div>
      <div class="s3mm-node">S3 Access Points</div>
      <div class="s3mm-node">VPC Endpoint Gateway (gratuito)</div>
      <div class="s3mm-node">CloudFront Origin</div>
    </div>
  </div>

  <div class="s3mm-branch">
    <div class="s3mm-branch-title" style="color:#a855f7">Eventos e integração</div>
    <div class="s3mm-nodes">
      <div class="s3mm-node">S3 Event Notifications → Lambda/SQS/SNS</div>
      <div class="s3mm-node">EventBridge S3 Events</div>
      <div class="s3mm-node">Athena — query SQL</div>
      <div class="s3mm-node">Glue Catalog — metastore</div>
      <div class="s3mm-node">Kinesis Firehose → S3</div>
    </div>
  </div>

  <div class="s3mm-divider"></div>
  <div style="background:#1e293b;border-radius:8px;padding:10px 14px;font-size:10px;color:#64748b;border-left:3px solid #FF9900">
    <strong style="color:#FF9900">Modelo mental:</strong> S3 não é um filesystem — objetos são imutáveis identificados por bucket + key. Não há hierarquia real (prefixos com "/" são convenção). Upload = nova versão se versioning ativo. Latência de PUT: dezenas de ms. Durabilidade: 11 noves (99,999999999%).
  </div>
</div>`,
      caption: "S3 é o serviço de storage mais versátil da AWS. O mapa mental cobre desde armazenamento simples até data lake e pipelines event-driven.",
    },
    videos: [
      { title: "Amazon S3 Deep Dive — Complete Tutorial", channel: "Stephane Maarek", url: "https://www.youtube.com/watch?v=_I14_sXjMjY", topic: "S3 completo: classes, versioning, replicação, segurança, pre-signed URLs" },
      { title: "S3 Security Best Practices — re:Invent", channel: "AWS Events", url: "https://www.youtube.com/watch?v=g0nI-dMQW6s", topic: "Bucket policies, Block Public Access, Object Lock, Macie" },
      { title: "S3 Lifecycle Policies and Cost Optimization", channel: "Be A Better Dev", url: "https://www.youtube.com/watch?v=hiRaGYQBPrE", topic: "Lifecycle rules na prática, economia real entre classes" },
      { title: "Building a Serverless Data Lake on AWS S3 and Athena", channel: "AWS Online Tech Talks", url: "https://www.youtube.com/watch?v=a3713oGB6Zk", topic: "S3 + Glue + Athena para data lake: particionamento, Parquet, custo por query" },
      { title: "S3 Pre-Signed URLs — Upload de Arquivos sem Backend", channel: "Rocketseat", url: "https://www.youtube.com/watch?v=X7zluOsYHkM", topic: "Implementação prática de upload direto para S3 com pre-signed URL" },
    ],
    resources: [
      { title: "AWS S3 docs", url: "https://docs.aws.amazon.com/s3/", kind: "docs" },
      { title: "S3 storage classes", url: "https://aws.amazon.com/s3/storage-classes/", kind: "docs" },
      { title: "S3 pricing", url: "https://aws.amazon.com/s3/pricing/", kind: "docs" },
      { title: "S3 Transfer Acceleration Speed Comparison", url: "https://s3-accelerate-speedtest.s3-accelerate.amazonaws.com/en/accelerate-speed-comparsion.html", kind: "pratica" },
      { title: "Amazon Macie — dados sensíveis no S3", url: "https://aws.amazon.com/macie/", kind: "docs" },
      { title: "S3 Object Lock e WORM compliance", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html", kind: "docs" },
      { title: "AWS S3 Performance Guidelines", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html", kind: "artigo" },
    ],
    codeExamples: [
      {
        title: "Pre-signed URL para upload direto do browser — Node.js",
        description: "Backend gera URL temporária; frontend faz PUT direto ao S3 sem passar pelo servidor",
        language: "typescript",
        code: `import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({ region: 'us-east-1' })
const BUCKET = process.env.S3_BUCKET!

// Backend: gera URL de upload (PUT)
export async function getUploadUrl(
  fileName: string,
  contentType: string,
  userId: string
): Promise<{ uploadUrl: string; objectKey: string }> {
  // Chave com prefixo por usuário — evita colisões e facilita controle de acesso
  const objectKey = \`uploads/\${userId}/\${Date.now()}-\${fileName}\`

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: objectKey,
    ContentType: contentType,
    // Metadata customizado — acessível depois sem baixar o objeto
    Metadata: {
      'uploaded-by': userId,
      'original-name': fileName,
    },
  })

  // URL válida por 15 minutos
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 })

  return { uploadUrl, objectKey }
}

// Backend: gera URL de download (GET) — acesso temporário
export async function getDownloadUrl(objectKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: objectKey,
    // Force download em vez de abrir no browser
    ResponseContentDisposition: 'attachment',
  })

  return getSignedUrl(s3, command, { expiresIn: 3600 }) // 1 hora
}

// Frontend: usa a URL para fazer upload direto ao S3
// const { uploadUrl, objectKey } = await fetch('/api/upload-url?name=foto.jpg&type=image/jpeg').then(r => r.json())
// await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })`,
      },
      {
        title: "Lifecycle Policy + Versionamento via SDK — configuração programática",
        description: "Configura versionamento, lifecycle e Block Public Access em bucket de produção",
        language: "typescript",
        code: `import {
  S3Client,
  PutBucketVersioningCommand,
  PutBucketLifecycleConfigurationCommand,
  PutPublicAccessBlockCommand,
  PutBucketEncryptionCommand,
} from '@aws-sdk/client-s3'

const s3 = new S3Client({ region: 'us-east-1' })
const BUCKET = 'minha-empresa-assets'

async function configureBucket() {
  // 1. Block Public Access — sempre primeiro
  await s3.send(new PutPublicAccessBlockCommand({
    Bucket: BUCKET,
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      IgnorePublicAcls: true,
      BlockPublicPolicy: true,
      RestrictPublicBuckets: true,
    },
  }))
  console.log('✓ Block Public Access ativado')

  // 2. Criptografia padrão SSE-S3
  await s3.send(new PutBucketEncryptionCommand({
    Bucket: BUCKET,
    ServerSideEncryptionConfiguration: {
      Rules: [{
        ApplyServerSideEncryptionByDefault: {
          SSEAlgorithm: 'AES256', // SSE-S3. Use 'aws:kms' para SSE-KMS
        },
        BucketKeyEnabled: true, // Reduz chamadas KMS e custo
      }],
    },
  }))
  console.log('✓ Criptografia SSE-S3 configurada')

  // 3. Habilitar versionamento
  await s3.send(new PutBucketVersioningCommand({
    Bucket: BUCKET,
    VersioningConfiguration: { Status: 'Enabled' },
  }))
  console.log('✓ Versionamento habilitado')

  // 4. Lifecycle policy
  await s3.send(new PutBucketLifecycleConfigurationCommand({
    Bucket: BUCKET,
    LifecycleConfiguration: {
      Rules: [
        {
          ID: 'UploadsTiering',
          Status: 'Enabled',
          Filter: { Prefix: 'uploads/' },
          Transitions: [
            { Days: 30,  StorageClass: 'STANDARD_IA' },
            { Days: 90,  StorageClass: 'GLACIER_IR' }, // Glacier Instant Retrieval
            { Days: 365, StorageClass: 'DEEP_ARCHIVE' },
          ],
          // Limpar uploads multipart abandonados (evita custo oculto)
          AbortIncompleteMultipartUpload: { DaysAfterInitiation: 7 },
        },
        {
          ID: 'ExpireOldVersions',
          Status: 'Enabled',
          Filter: { Prefix: '' },
          NoncurrentVersionExpiration: {
            NoncurrentDays: 30,           // versões antigas expiram em 30 dias
            NewerNoncurrentVersions: 5,   // mantém as 5 versões mais recentes
          },
        },
      ],
    },
  }))
  console.log('✓ Lifecycle policy configurada')
}

configureBucket().catch(console.error)`,
      },
      {
        title: "S3 Event Notification → Lambda — pipeline de processamento de imagens",
        description: "Upload de imagem no S3 dispara Lambda que gera thumbnail e salva em bucket de destino",
        language: "typescript",
        code: `import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import type { S3Event } from 'aws-lambda'
// Nota: sharp deve ser instalado como layer Lambda (binário nativo)
// aws lambda publish-layer-version --layer-name sharp --zip-file fileb://sharp-layer.zip

const s3 = new S3Client({ region: process.env.AWS_REGION })
const DEST_BUCKET = process.env.DEST_BUCKET!

export const handler = async (event: S3Event): Promise<void> => {
  for (const record of event.Records) {
    const srcBucket = record.s3.bucket.name
    // Decodificar key — S3 URL-encoda caracteres especiais (espaços como '+')
    const srcKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '))

    // Ignorar arquivos que não são imagens
    if (!/\.(jpg|jpeg|png|webp)$/i.test(srcKey)) {
      console.log(\`Ignorando: \${srcKey} (não é imagem)\`)
      continue
    }

    try {
      // 1. Baixar imagem original do S3
      const getResp = await s3.send(new GetObjectCommand({
        Bucket: srcBucket,
        Key: srcKey,
      }))

      const originalBuffer = Buffer.from(
        await getResp.Body!.transformToByteArray()
      )

      // 2. Gerar thumbnail 200x200 (Sharp — binário nativo no Layer)
      // const sharp = require('sharp') -- importado do Layer em runtime
      // const thumbnail = await sharp(originalBuffer).resize(200, 200, { fit: 'cover' }).webp({ quality: 80 }).toBuffer()

      // Simulação sem sharp (remova em produção):
      const thumbnail = originalBuffer

      // 3. Salvar thumbnail no bucket de destino
      const destKey = srcKey.replace('uploads/', 'thumbnails/').replace(/\.[^.]+$/, '.webp')

      await s3.send(new PutObjectCommand({
        Bucket: DEST_BUCKET,
        Key: destKey,
        Body: thumbnail,
        ContentType: 'image/webp',
        Metadata: {
          'original-key': srcKey,
          'original-size': String(record.s3.object.size),
        },
      }))

      console.log(\`Thumbnail gerado: s3://\${DEST_BUCKET}/\${destKey}\`)
    } catch (err) {
      // Logar e continuar — não falhar o batch inteiro por uma imagem
      console.error(\`Erro ao processar \${srcKey}:\`, err)
      throw err // Re-throw para Lambda tentar novamente (retry automático)
    }
  }
}`,
      },
    ],
    exercises: [
      {
        level: "iniciante",
        title: "Configurar lifecycle policy para otimizar custo de armazenamento",
        description: "Crie um bucket S3 com versioning habilitado. Faça upload de 5 arquivos de teste. Configure uma lifecycle policy que: (1) move objetos do prefix 'uploads/' para Standard-IA após 30 dias; (2) move para Glacier após 90 dias; (3) expira versões não-correntes após 30 dias (mantendo apenas as 3 mais recentes); (4) aborta uploads multipart incompletos após 7 dias. Verifique a policy no console e confirme que não há erros de validação.",
        concepts: ["Lifecycle Policy", "Versioning", "Storage Classes", "Standard-IA", "Glacier", "Multipart Upload"],
        hint: "No console S3 → bucket → Management → Lifecycle rules. Crie uma regra com 'Limit the scope to specific prefixes' = 'uploads/'. Para versões não-correntes, vá em 'Noncurrent versions' e defina expiration. A opção de abortar multipart uploads incompletos está em 'Delete expired object delete markers or incomplete multipart uploads'.",
      },
      {
        level: "intermediario",
        title: "Upload seguro via pre-signed URL com validação Lambda",
        description: "Implemente o fluxo completo de upload de arquivo: (1) Endpoint API Gateway + Lambda que valida autenticação e gera pre-signed URL para PUT. (2) Cliente faz PUT direto ao S3 com a URL. (3) S3 Event Notification dispara uma segunda Lambda para validação (verificar content-type real via magic bytes, tamanho máximo). Se inválido, a Lambda deleta o objeto e registra o evento no CloudWatch. Configure CORS no bucket para aceitar PUT do domínio do frontend. Teste com um arquivo válido e um arquivo com extensão falsa (malware.exe renomeado para foto.jpg).",
        concepts: ["Pre-signed URL", "S3 Events", "Lambda", "CORS", "validação server-side", "API Gateway"],
        hint: "Para CORS no S3: S3 → bucket → Permissions → CORS Configuration. Permita o método PUT com o header Content-Type. A Lambda de validação precisa de permissão s3:GetObject (para ler e verificar) e s3:DeleteObject (para remover inválidos). Os magic bytes de JPEG começam com FF D8 FF — compare o início do buffer com a extensão declarada.",
      },
      {
        level: "senior",
        title: "Implementar compliance storage com Object Lock, Replicação e auditoria Macie",
        description: "Configure um bucket de compliance para logs de auditoria financeira: (1) Object Lock em modo Compliance com retenção de 7 anos (nenhum usuário pode deletar — nem o root). (2) Cross-Region Replication para outra região (ex: us-east-1 → us-west-2) com Replication Time Control (garantia de 15min). (3) Habilitar Amazon Macie para escaneamento automático de dados sensíveis (PII, dados de cartão). (4) CloudTrail S3 data events para auditar todo GetObject e PutObject. (5) Alarme CloudWatch que alerta se qualquer GetObject vier de IP fora da VPC da empresa. Documente a política de retenção e o procedimento de recuperação de dados (que deve envolver abertura de case na AWS para modo Compliance).",
        concepts: ["Object Lock", "WORM", "Compliance Mode", "CRR", "Replication Time Control", "Macie", "CloudTrail data events", "auditoria"],
        hint: "Object Lock Compliance não pode ser desabilitado nem mesmo pelo root. Configure antes de colocar dados. O RTC (Replication Time Control) tem custo adicional mas garante SLA de 15 minutos. Para Macie: ative no console, crie um job de discovery que escaneia o bucket periodicamente. Para o alarme de IP: use CloudWatch Logs Insights sobre os logs do CloudTrail filtrando por eventName=GetObject e sourceIPAddress não pertencente aos CIDRs da empresa.",
      },
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
      { q: "Como processar mensagens SQS com Lambda de forma confiável?", a: "<p>Lambda faz polling automático do SQS quando configurado como event source. A cada poll, Lambda recebe um batch de mensagens (batch size configurável: 1–10.000 para Standard, 1–10 para FIFO).</p><p><strong>Visibility Timeout:</strong> deve ser maior que o timeout da Lambda (pelo menos 6×). Se a Lambda demorar mais que o visibility timeout, a mensagem fica visível novamente e é processada duas vezes — duplicação.</p><p><strong>Batch failure:</strong> se a Lambda retornar erro, <em>todas</em> as mensagens do batch voltam para a fila. Configure <code>ReportBatchItemFailures</code> — a Lambda retorna quais messageIds falharam, e só esses voltam para a fila. Evita reprocessar mensagens que já foram processadas com sucesso no mesmo batch.</p><p><strong>DLQ:</strong> configure na fila SQS (não na Lambda em modo polling). Mensagens que falharem N vezes (maxReceiveCount) vão para a DLQ para análise.</p><p><strong>Concorrência:</strong> Lambda cria uma instância por shard/batch em paralelo. Para FIFO queue, uma instância por grupo de mensagens.</p>", tip: "O erro mais comum é timeout da Lambda menor que o visibility timeout da fila — resulta em processamento duplicado. Sempre: visibility timeout >= 6 × Lambda timeout.", level: "senior" },
      { q: "Quando usar Lambda@Edge vs CloudFront Functions?", a: "<p>Ambos executam código na edge (próximo ao usuário) integrado ao CloudFront. As diferenças são de latência, capacidade e preço:</p><p><strong>CloudFront Functions:</strong> JavaScript puro, executa em &lt; 1 ms (sub-milissegundo), custo 1/6 do Lambda@Edge. Suporta apenas Viewer Request e Viewer Response (antes/depois do cache). Sem acesso à rede ou sistema de arquivos. Limite de 10 KB de código. Use para: rewrites de URL, manipulação de headers (Cache-Control, CORS), redirect de país, normalização de query strings.</p><p><strong>Lambda@Edge:</strong> Node.js ou Python, até 30 s (origin) ou 5 s (viewer), acesso à rede e ao filesystem. Suporta 4 eventos (Viewer Request/Response + Origin Request/Response). Use para: autenticação JWT antes de chegar à origem, A/B testing baseado em cookies, personalização de conteúdo com chamada a API externa, header injection com lógica complexa.</p><p>Regra: tente CloudFront Functions primeiro — é mais rápido e mais barato. Se precisar de I/O, runtime longo ou acesso a serviços externos, use Lambda@Edge.</p>", level: "senior" },
      { q: "Como otimizaria o custo de uma Lambda com alto volume de invocações?", a: "<p><strong>Lambda Power Tuning:</strong> ferramenta open source que testa sua função com diferentes configurações de memória (128 MB → 10 GB) e mede custo × performance. Em Lambda, memória = CPU proporcional — mais memória pode ser mais barato se a função terminar muito mais rápido.</p><p><strong>Ajuste de memória:</strong> a maioria das funções performa melhor entre 512 MB e 2 GB. Funções CPU-bound precisam de mais memória para mais vCPU. Funções I/O-bound não se beneficiam de muita memória.</p><p><strong>Redução de duração:</strong> inicializar SDKs e conexões fora do handler. Usar cliente HTTP persistente (keep-alive). Paralelizar I/O independente (Promise.all). Otimizar tamanho do bundle (esbuild com tree-shaking).</p><p><strong>Arquitetura:</strong> batching para SQS (batch size maior = menos invocações). Evitar invocações desnecessárias com filtros em EventBridge. Considerar ECS Fargate para cargas de trabalho muito altas e contínuas — Lambda tem custo maior por hora de execução que ECS em workloads previsíveis acima de ~1M req/dia.</p>", level: "senior" },
      { q: "O que são Lambda Destinations e como diferem de DLQ?", a: "<p>Lambda Destinations configuram onde enviar o resultado de uma invocação assíncrona — tanto em caso de sucesso quanto de falha.</p><p><strong>On Success:</strong> SQS, SNS, Lambda ou EventBridge recebe o resultado da invocação bem-sucedida. Permite encadear funções sem polling.</p><p><strong>On Failure:</strong> SQS, SNS, Lambda ou EventBridge recebe o contexto da falha após todos os retries esgotados.</p><p><strong>Destinations vs DLQ:</strong></p><p>- DLQ: SQS ou SNS, só para falha, contém apenas o payload original da invocação.</p><p>- Destinations: suporta EventBridge e Lambda (além de SQS/SNS), tanto sucesso quanto falha, payload inclui o evento original + a resposta da função + contexto de execução (requestId, condition, timestamp). Muito mais rico para debugging e orquestração.</p><p>Use Destinations para novas implementações — DLQ é legado para casos simples onde só SQS basta.</p>", level: "pleno" },
      { q: "Como Lambda funciona com DynamoDB Streams?", a: "<p>DynamoDB Streams captura toda mudança nos itens da tabela (INSERT, MODIFY, REMOVE) em ordem, particionada por shard. Lambda faz polling automático do stream quando configurado como event source.</p><p><strong>Tipos de view de stream:</strong> KEYS_ONLY (só chaves do item), NEW_IMAGE (estado atual), OLD_IMAGE (estado anterior), NEW_AND_OLD_IMAGES (ambos — mais completo, mais custo).</p><p><strong>Processamento em ordem:</strong> Lambda processa registros de cada shard em ordem. Se uma invocação falhar e não tratar o erro, Lambda fica tentando o mesmo batch indefinidamente (bloqueia o shard). Configure <code>bisectBatchOnFunctionError</code> para dividir o batch e isolar o registro problemático, e <code>destinationConfig.onFailure</code> para enviar falhas para SQS/SNS após esgotar retries.</p><p><strong>Casos de uso:</strong> invalidação de cache (ElastiCache) quando dado muda, replicação para ElasticSearch/OpenSearch, fan-out de eventos de negócio (pedido criado → email + estoque + analytics).</p>", level: "senior" },
      { q: "O que são Lambda Layers e quando usar?", a: "<p>Lambda Layers são pacotes ZIP que podem ser compartilhados entre múltiplas funções. O layer é montado em /opt no filesystem da Lambda em tempo de execução.</p><p><strong>Casos de uso ideais:</strong></p><p>- Dependências pesadas compartilhadas (sharp para processamento de imagem, pandas, numpy para ML) — uma atualização do layer beneficia todas as funções simultaneamente.</p><p>- Runtime customizado (qualquer linguagem com Runtime Interface Client).</p><p>- Extensões Lambda (agentes de observabilidade, segredos injetados, proxies de segurança).</p><p><strong>Limites:</strong> máximo 5 layers por função. Tamanho total descomprimido (código + layers) ≤ 250 MB. Container image não usa layers — as dependências estão no próprio container.</p><p><strong>Quando não usar:</strong> dependências pequenas que não são compartilhadas. A complexidade de gerenciar versões de layers não compensa para libs de alguns MB usadas em uma única função. Bundler (esbuild) que inclui só o necessário pode ser mais simples.</p>", level: "pleno" },
      { q: "Como monitorar e debugar Lambda em produção?", a: "<p><strong>CloudWatch Logs:</strong> todo console.log/print vai para o Log Group /aws/lambda/{function-name}. Estruture logs em JSON — facilita queries no CloudWatch Logs Insights. Inclua requestId, userId, e contexto de negócio em cada log.</p><p><strong>CloudWatch Metrics:</strong> monitorar Invocations, Errors, Duration (p99), Throttles, ConcurrentExecutions. Crie alarmes em Errors > 0 e Throttles > 0.</p><p><strong>X-Ray:</strong> tracing distribuído — trace completo de API Gateway → Lambda → DynamoDB → S3. Identifica onde está o gargalo de latência. Instrumente com AWS X-Ray SDK (@aws-sdk/client-xray-daemon-interface ou usando Powertools).</p><p><strong>AWS Lambda Powertools:</strong> biblioteca open source da AWS com Logger estruturado (JSON), Tracer (X-Ray automático), Metrics (EMF — Embedded Metrics Format para CloudWatch sem custo de PutMetricData), Idempotency (com DynamoDB), e Batch Processing (ReportBatchItemFailures automático).</p><p>Use Powertools desde o início — economiza horas de implementação de observabilidade e evita os erros comuns de instrumentação.</p>", tip: "Em entrevista: mencionar Lambda Powertools demonstra familiaridade com as melhores práticas da comunidade AWS.", level: "senior" },
    ],
    mnemonics: [
      {
        label: "SAP — tipos de invocação Lambda",
        trick: "Sync (API Gateway/ALB), Async (S3/SNS/EventBridge), Poll (SQS/Kinesis/DynamoDB Streams)",
        explanation: "Os três modelos de invocação Lambda: Síncrono — o chamador espera a resposta (API Gateway, ALB, SDK direto). Assíncrono — Lambda recebe e processa, o chamador não espera; retry automático 2× em erro (S3 Events, SNS, EventBridge). Poll/Streaming — Lambda faz polling do source e processa batches; gerencia checkpoints (SQS, Kinesis, DynamoDB Streams, MSK). Cada modelo tem comportamento de retry e DLQ diferente.",
      },
      {
        label: "FRIO = cold start — os 3 fatores que aumentam o cold start",
        trick: "Framework pesado, Runtime lento (JVM), Imagem grande, O-VPC (overhead de ENI)",
        explanation: "Quatro fatores que aumentam o cold start Lambda: Framework pesado (Spring Boot, Express com muitas dependências — bundle grande = download demorado). Runtime lento (Java e .NET têm JVM/CLR startup mais lento que Node.js/Python). Imagem grande (container image de 1 GB vs ZIP de 5 MB — download muito mais lento). O-VPC (Lambda em VPC precisa provisionar ENI — adiciona latência). Mitigação: bundle pequeno, Node.js/Python, Provisioned Concurrency ou SnapStart para Java.",
      },
      {
        label: "RPDT — concorrência Lambda",
        trick: "Reserved (máximo da função), Provisioned (instâncias quentes), Default (compartilhado), Throttle (429)",
        explanation: "Quatro conceitos de concorrência Lambda: Reserved Concurrency — teto máximo para uma função (protege banco de dados de sobrecarga). Provisioned Concurrency — instâncias pré-inicializadas para eliminar cold start (tem custo fixo). Default Pool — concorrência compartilhada entre todas as funções sem reserved (1.000 por conta por padrão). Throttle (429) — quando a função atinge o limite, invocações são rejeitadas (async: retry; sync: 429 imediato para o cliente).",
      },
    ],
    cheatsheet: {
      title: "Lambda Cheatsheet — invocação, concorrência e CLI",
      html: `<style>
.lmbcs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.lmbcs-h2{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#FF9900;font-weight:700;margin:16px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(255,153,0,.2)}
.lmbcs-h2:first-child{margin-top:0}
.lmbcs-table{width:100%;border-collapse:collapse;font-size:10px}
.lmbcs-table th{text-align:left;color:#64748b;font-weight:600;padding:4px 8px;border-bottom:1px solid #1e293b;font-size:9px;letter-spacing:.06em;text-transform:uppercase}
.lmbcs-table td{padding:5px 8px;border-bottom:1px solid #0f172a;color:#94a3b8;vertical-align:top;line-height:1.5}
.lmbcs-table tr:last-child td{border-bottom:none}
.lmbcs-table td:first-child{color:#e2e8f0;font-weight:500}
.lmbcs-code{background:#1e293b;border-radius:6px;padding:10px 14px;font-size:10px;color:#94a3b8;line-height:2;overflow-x:auto;margin-bottom:4px}
.lmbcs-code .kw{color:#64748b}
.lmbcs-code .svc{color:#FF9900;font-weight:700}
.lmbcs-code .val{color:#4ade80}
.lmbcs-code .flag{color:#93c5fd}
</style>
<div class="lmbcs-wrap">
  <p style="font-size:12px;font-weight:600;color:#e2e8f0;margin:0 0 4px">Lambda Cheatsheet</p>
  <p style="font-size:10px;color:#475569;margin:0 0 14px">Tipos de invocação, limites, concorrência e CLI</p>

  <div class="lmbcs-h2">Tipos de invocação — comportamento e retry</div>
  <table class="lmbcs-table">
    <tr><th>Tipo</th><th>Sources</th><th>Retry</th><th>DLQ/Destination</th></tr>
    <tr><td>Síncrono</td><td>API GW, ALB, SDK</td><td>Nenhum (cliente decide)</td><td>Não se aplica</td></tr>
    <tr><td>Assíncrono</td><td>S3, SNS, EventBridge</td><td>2× automático</td><td>SQS/SNS DLQ ou Destinations</td></tr>
    <tr><td>Poll (SQS)</td><td>SQS Standard/FIFO</td><td>Até maxReceiveCount</td><td>DLQ na fila SQS</td></tr>
    <tr><td>Stream</td><td>Kinesis, DynamoDB Streams</td><td>Até expirar ou bisect</td><td>destinationConfig.onFailure</td></tr>
  </table>

  <div class="lmbcs-h2">Limites relevantes</div>
  <table class="lmbcs-table">
    <tr><th>Limite</th><th>Valor</th></tr>
    <tr><td>Timeout máximo</td><td>15 minutos</td></tr>
    <tr><td>Memória</td><td>128 MB – 10.240 MB (10 GB)</td></tr>
    <tr><td>Armazenamento /tmp</td><td>512 MB (padrão) – 10.240 MB</td></tr>
    <tr><td>Pacote ZIP descomprimido</td><td>250 MB (+ layers)</td></tr>
    <tr><td>Container image</td><td>até 10 GB</td></tr>
    <tr><td>Concorrência padrão por conta</td><td>1.000 (aumentável)</td></tr>
    <tr><td>Burst limit (us-east-1)</td><td>3.000 instâncias simultâneas</td></tr>
    <tr><td>Variáveis de ambiente</td><td>4 KB total</td></tr>
  </table>

  <div class="lmbcs-h2">CLI Commands essenciais</div>
  <div class="lmbcs-code">
<span class="kw"># Listar funções</span>
aws <span class="svc">lambda</span> list-functions <span class="flag">--query</span> <span class="val">'Functions[*].[FunctionName,Runtime,MemorySize]'</span>

<span class="kw"># Invocar função (síncrono)</span>
aws <span class="svc">lambda</span> invoke <span class="flag">--function-name</span> minha-funcao <span class="flag">--payload</span> <span class="val">'{"key":"value"}'</span> output.json
cat output.json

<span class="kw"># Invocar assíncrono</span>
aws <span class="svc">lambda</span> invoke <span class="flag">--function-name</span> minha-funcao <span class="flag">--invocation-type</span> Event <span class="flag">--payload</span> <span class="val">'{"key":"value"}'</span> /dev/null

<span class="kw"># Deploy de novo código</span>
aws <span class="svc">lambda</span> update-function-code <span class="flag">--function-name</span> minha-funcao <span class="flag">--zip-file</span> fileb://function.zip

<span class="kw"># Ver logs em tempo real</span>
aws <span class="svc">logs</span> tail /aws/lambda/minha-funcao <span class="flag">--follow</span>

<span class="kw"># Configurar concorrência reservada</span>
aws <span class="svc">lambda</span> put-function-concurrency <span class="flag">--function-name</span> minha-funcao <span class="flag">--reserved-concurrent-executions</span> 50

<span class="kw"># Habilitar Provisioned Concurrency</span>
aws <span class="svc">lambda</span> put-provisioned-concurrency-config <span class="flag">--function-name</span> minha-funcao <span class="flag">--qualifier</span> prod <span class="flag">--provisioned-concurrent-executions</span> 10

<span class="kw"># Publicar versão e criar alias</span>
aws <span class="svc">lambda</span> publish-version <span class="flag">--function-name</span> minha-funcao
aws <span class="svc">lambda</span> create-alias <span class="flag">--function-name</span> minha-funcao <span class="flag">--name</span> prod <span class="flag">--function-version</span> 3
  </div>
</div>`,
    },
    mindmap: {
      title: "Lambda — mapa mental de conceitos",
      html: `<style>
.lmbmm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.lmbmm-center{background:#FF9900;color:#0f172a;border-radius:10px;padding:10px 18px;font-weight:700;font-size:12px;text-align:center;display:inline-block}
.lmbmm-branch{margin-bottom:10px}
.lmbmm-branch-title{font-size:9px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.lmbmm-branch-title::before{content:'';display:block;width:12px;height:2px;background:currentColor}
.lmbmm-nodes{display:flex;flex-wrap:wrap;gap:5px;margin-left:18px}
.lmbmm-node{background:#1e293b;border-radius:6px;padding:4px 9px;font-size:9.5px;color:#94a3b8;border:1px solid #334155;cursor:default;transition:border-color .2s}
.lmbmm-node:hover{border-color:#FF9900;color:#e2e8f0}
.lmbmm-divider{width:100%;height:1px;background:#1e293b;margin:8px 0}
</style>
<div class="lmbmm-wrap">
  <div style="text-align:center;margin-bottom:16px">
    <div class="lmbmm-center">λ Lambda</div>
    <div style="font-size:10px;color:#475569;margin-top:6px">Serverless — evento → execução → resultado</div>
  </div>

  <div class="lmbmm-branch">
    <div class="lmbmm-branch-title" style="color:#f59e0b">Event Sources</div>
    <div class="lmbmm-nodes">
      <div class="lmbmm-node">API Gateway (sync)</div>
      <div class="lmbmm-node">ALB (sync)</div>
      <div class="lmbmm-node">S3 Events (async)</div>
      <div class="lmbmm-node">SNS (async)</div>
      <div class="lmbmm-node">EventBridge (async)</div>
      <div class="lmbmm-node">SQS (poll)</div>
      <div class="lmbmm-node">DynamoDB Streams (poll)</div>
      <div class="lmbmm-node">Kinesis (poll)</div>
    </div>
  </div>

  <div class="lmbmm-branch">
    <div class="lmbmm-branch-title" style="color:#ef4444">Cold Start</div>
    <div class="lmbmm-nodes">
      <div class="lmbmm-node">Init — download + runtime</div>
      <div class="lmbmm-node">Invoke — handler</div>
      <div class="lmbmm-node">Warm — container reutilizado</div>
      <div class="lmbmm-node">Provisioned Concurrency</div>
      <div class="lmbmm-node">SnapStart (Java)</div>
      <div class="lmbmm-node">Minimize bundle size</div>
    </div>
  </div>

  <div class="lmbmm-branch">
    <div class="lmbmm-branch-title" style="color:#3b82f6">Concorrência</div>
    <div class="lmbmm-nodes">
      <div class="lmbmm-node">Reserved — teto da função</div>
      <div class="lmbmm-node">Provisioned — instâncias quentes</div>
      <div class="lmbmm-node">Default Pool — compartilhado</div>
      <div class="lmbmm-node">Throttle 429</div>
    </div>
  </div>

  <div class="lmbmm-branch">
    <div class="lmbmm-branch-title" style="color:#4ade80">Observabilidade</div>
    <div class="lmbmm-nodes">
      <div class="lmbmm-node">CloudWatch Logs</div>
      <div class="lmbmm-node">X-Ray Tracing</div>
      <div class="lmbmm-node">Lambda Powertools</div>
      <div class="lmbmm-node">Destinations on failure</div>
      <div class="lmbmm-node">DLQ</div>
    </div>
  </div>

  <div class="lmbmm-branch">
    <div class="lmbmm-branch-title" style="color:#a855f7">Configuração e otimização</div>
    <div class="lmbmm-nodes">
      <div class="lmbmm-node">Memória = CPU proporcional</div>
      <div class="lmbmm-node">Layers — dependências compartilhadas</div>
      <div class="lmbmm-node">VPC — acesso a recursos privados</div>
      <div class="lmbmm-node">Variáveis de ambiente</div>
      <div class="lmbmm-node">Lambda Power Tuning</div>
    </div>
  </div>

  <div class="lmbmm-divider"></div>
  <div style="background:#1e293b;border-radius:8px;padding:10px 14px;font-size:10px;color:#64748b;border-left:3px solid #FF9900">
    <strong style="color:#FF9900">Modelo mental:</strong> Lambda é stateless por design — cada invocação pode pegar um container novo (cold start) ou reutilizado (warm). Código fora do handler persiste no container warm. Não armazene estado de usuário em variáveis globais. Use DynamoDB, ElastiCache ou S3 para estado persistente.
  </div>
</div>`,
      caption: "Lambda cobre um amplo espectro de patterns serverless. O mapa organiza os conceitos em 5 dimensões: fontes de evento, cold start, concorrência, observabilidade e configuração.",
    },
    videos: [
      { title: "AWS Lambda Full Course — Serverless Deep Dive", channel: "Stephane Maarek", url: "https://www.youtube.com/watch?v=97q30JjEq9Y", topic: "Lambda completo: cold start, concorrência, VPC, Layers, pricing, DLQ" },
      { title: "Lambda Cold Start Optimization — re:Invent", channel: "AWS Events", url: "https://www.youtube.com/watch?v=oQbmrrwr5Uo", topic: "Estratégias reais de mitigação de cold start em produção" },
      { title: "Building Event-Driven Architectures with Lambda and SQS", channel: "AWS Online Tech Talks", url: "https://www.youtube.com/watch?v=Jj6hJPkymMI", topic: "SQS + Lambda: batch processing, DLQ, ReportBatchItemFailures" },
      { title: "Lambda Powertools for TypeScript — Observabilidade sem esforço", channel: "AWS Developer", url: "https://www.youtube.com/watch?v=xEyTJjJkCXU", topic: "Logger estruturado, Tracer X-Ray, Metrics EMF com Lambda Powertools" },
      { title: "Serverless Patterns — API Gateway + Lambda + DynamoDB", channel: "Fireship", url: "https://www.youtube.com/watch?v=GH6aKdSZjy8", topic: "Construindo API REST serverless completa do zero em 10 minutos" },
    ],
    resources: [
      { title: "AWS Lambda docs", url: "https://docs.aws.amazon.com/lambda/", kind: "docs" },
      { title: "Lambda Power Tuning (otimização de memória/custo)", url: "https://github.com/alexcasalboni/aws-lambda-power-tuning", kind: "pratica" },
      { title: "Lambda best practices", url: "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html", kind: "docs" },
      { title: "AWS Lambda Powertools for TypeScript", url: "https://docs.powertools.aws.dev/lambda/typescript/", kind: "docs" },
      { title: "Serverless Land — padrões e exemplos", url: "https://serverlessland.com/", kind: "pratica" },
      { title: "Lambda pricing calculator", url: "https://aws.amazon.com/lambda/pricing/", kind: "pratica" },
    ],
    codeExamples: [
      {
        title: "Handler com Lambda Powertools — Logger, Tracer e Metrics",
        description: "Padrão de produção com observabilidade completa usando AWS Lambda Powertools for TypeScript",
        language: "typescript",
        code: `import { Logger } from '@aws-lambda-powertools/logger'
import { Tracer } from '@aws-lambda-powertools/tracer'
import { Metrics, MetricUnit } from '@aws-lambda-powertools/metrics'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const logger = new Logger({ serviceName: 'orders-api', logLevel: 'INFO' })
const tracer = new Tracer({ serviceName: 'orders-api' })
const metrics = new Metrics({ namespace: 'OrdersService', serviceName: 'orders-api' })

// Inicializar clientes FORA do handler (reutilizados em warm invocations)
const { DynamoDBClient } = await import('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, PutCommand } = await import('@aws-sdk/lib-dynamodb')

const dynamo = DynamoDBDocumentClient.from(
  tracer.captureAWSv3Client(new DynamoDBClient({ region: process.env.AWS_REGION }))
)

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Injeta requestId e userId em todos os logs desta invocação
  logger.appendKeys({
    requestId: event.requestContext.requestId,
    userId: event.requestContext.authorizer?.claims?.sub,
  })

  const segment = tracer.getSegment()
  const subsegment = segment?.addNewSubsegment('processOrder')

  try {
    const body = JSON.parse(event.body ?? '{}')
    logger.info('Pedido recebido', { orderId: body.orderId, total: body.total })

    await dynamo.send(new PutCommand({
      TableName: process.env.ORDERS_TABLE!,
      Item: {
        orderId: body.orderId,
        userId: event.requestContext.authorizer?.claims?.sub,
        total: body.total,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      ConditionExpression: 'attribute_not_exists(orderId)', // idempotência
    }))

    // Métrica de negócio — visível no CloudWatch com dimensão SERVICE
    metrics.addMetric('OrderCreated', MetricUnit.Count, 1)
    metrics.addMetric('OrderValue', MetricUnit.None, body.total)

    logger.info('Pedido criado com sucesso', { orderId: body.orderId })

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: body.orderId, status: 'pending' }),
    }
  } catch (err) {
    logger.error('Erro ao criar pedido', err as Error)
    subsegment?.addError(err as Error)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  } finally {
    subsegment?.close()
    metrics.publishStoredMetrics() // Garante que métricas são emitidas
  }
}`,
      },
      {
        title: "SQS Event Source com ReportBatchItemFailures",
        description: "Processamento confiável de SQS com tratamento granular de falhas por mensagem",
        language: "typescript",
        code: `import type { SQSEvent, SQSBatchResponse } from 'aws-lambda'

interface OrderMessage {
  orderId: string
  userId: string
  items: Array<{ productId: string; quantity: number; price: number }>
}

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  // Rastrear quais mensagens falharam — só elas voltarão para a fila
  const batchItemFailures: SQSBatchResponse['batchItemFailures'] = []

  // Processar em paralelo (com limite de concorrência se necessário)
  await Promise.allSettled(
    event.Records.map(async (record) => {
      try {
        const message: OrderMessage = JSON.parse(record.body)

        console.log(JSON.stringify({
          level: 'INFO',
          msg: 'Processando mensagem',
          messageId: record.messageId,
          orderId: message.orderId,
          // Inclui no log para facilitar correlação
        }))

        await processOrder(message)

        // Sucesso — a mensagem é automaticamente deletada da fila
        // (Lambda deleta o batch inteiro se não retornar failures)

      } catch (err) {
        console.error(JSON.stringify({
          level: 'ERROR',
          msg: 'Falha ao processar mensagem',
          messageId: record.messageId,
          error: (err as Error).message,
        }))

        // Apenas essa mensagem volta para a fila após visibility timeout
        // Outras mensagens do batch são deletadas normalmente
        batchItemFailures.push({ itemIdentifier: record.messageId })
      }
    })
  )

  return { batchItemFailures }
  // Se batchItemFailures.length === 0: todas as mensagens foram deletadas
  // Mensagens com failure voltam para a fila; após maxReceiveCount → DLQ
}

async function processOrder(order: OrderMessage): Promise<void> {
  // Lógica de negócio: validar estoque, calcular total, persistir, notificar
  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (total <= 0) throw new Error(\`Pedido com valor inválido: \${total}\`)

  // await saveOrderToDatabase(order)
  // await notifyInventoryService(order)
  console.log(\`Pedido \${order.orderId} processado. Total: R$ \${total.toFixed(2)}\`)
}`,
      },
      {
        title: "Lambda + API Gateway — REST API serverless completa",
        description: "API REST com roteamento por path, validação de input e tratamento de erros padronizado",
        language: "typescript",
        code: `import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({ region: process.env.AWS_REGION })
const dynamo = DynamoDBDocumentClient.from(client)
const TABLE = process.env.TABLE_NAME!

// Helper para resposta padronizada
const response = (statusCode: number, body: unknown): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Configurar CORS para origem específica em prod
  },
  body: JSON.stringify(body),
})

// Handler principal — roteador
export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const { routeKey, pathParameters, body } = event

  try {
    switch (routeKey) {
      case 'GET /items':
        return handleListItems()

      case 'GET /items/{id}':
        return handleGetItem(pathParameters?.id!)

      case 'POST /items':
        return handleCreateItem(JSON.parse(body ?? '{}'))

      default:
        return response(404, { error: 'Rota não encontrada' })
    }
  } catch (err) {
    console.error('Erro não tratado:', err)
    return response(500, { error: 'Erro interno do servidor' })
  }
}

async function handleListItems(): Promise<APIGatewayProxyResultV2> {
  const result = await dynamo.send(new ScanCommand({ TableName: TABLE, Limit: 100 }))
  return response(200, { items: result.Items ?? [], count: result.Count })
}

async function handleGetItem(id: string): Promise<APIGatewayProxyResultV2> {
  if (!id) return response(400, { error: 'ID obrigatório' })

  const result = await dynamo.send(new GetCommand({ TableName: TABLE, Key: { id } }))

  if (!result.Item) return response(404, { error: 'Item não encontrado' })

  return response(200, result.Item)
}

async function handleCreateItem(data: Record<string, unknown>): Promise<APIGatewayProxyResultV2> {
  if (!data.name || typeof data.name !== 'string') {
    return response(400, { error: 'Campo name obrigatório' })
  }

  const item = {
    id: crypto.randomUUID(),
    name: data.name,
    createdAt: new Date().toISOString(),
  }

  await dynamo.send(new PutCommand({ TableName: TABLE, Item: item }))

  return response(201, item)
}`,
      },
    ],
    exercises: [
      {
        level: "iniciante",
        title: "Função Lambda que processa eventos S3 — redimensionar imagem",
        description: "Crie uma função Lambda em Node.js 20.x que dispara quando uma imagem é enviada para um bucket S3 (prefix 'uploads/'). A função deve: (1) ler o objeto do S3; (2) usar a biblioteca 'sharp' (via Lambda Layer) para redimensionar para 300x300 mantendo proporção; (3) salvar o thumbnail em outro bucket S3 (prefix 'thumbnails/'). Configure as permissões IAM necessárias (s3:GetObject no bucket de origem, s3:PutObject no bucket de destino). Teste manualmente com aws lambda invoke e verifique o thumbnail no bucket de destino.",
        concepts: ["Lambda", "S3 Events", "IAM Role", "Lambda Layer", "Node.js runtime"],
        hint: "Para criar o Layer com sharp: npm install sharp --arch=x64 --platform=linux && zip -r sharp-layer.zip node_modules/ && aws lambda publish-layer-version --layer-name sharp --zip-file fileb://sharp-layer.zip --compatible-runtimes nodejs20.x. O S3 Event chega como event.Records[0].s3.bucket.name e event.Records[0].s3.object.key. Lembre de decodificar a key: decodeURIComponent(key.replace(/\\+/g, ' ')).",
      },
      {
        level: "intermediario",
        title: "API serverless com Lambda + API Gateway + DynamoDB com observabilidade",
        description: "Implemente uma API REST serverless completa: (1) HTTP API no API Gateway com rotas GET /items e POST /items. (2) Lambda (Node.js) que roteie por routeKey, valide input e persista em DynamoDB. (3) Lambda Powertools para logging estruturado JSON (com requestId em todos os logs), Tracer X-Ray (captura a chamada ao DynamoDB automaticamente), e Metrics (EmitMetric: ItemCreated count). (4) CloudWatch Dashboard com gráficos de Invocations, Errors, Duration P99 e a métrica customizada ItemCreated. (5) Alarme em Errors > 0 por 5min.",
        concepts: ["API Gateway", "Lambda", "DynamoDB", "Lambda Powertools", "X-Ray", "CloudWatch Dashboard", "CloudWatch Alarms"],
        hint: "Instale: npm install @aws-lambda-powertools/logger @aws-lambda-powertools/tracer @aws-lambda-powertools/metrics. O Tracer captura automaticamente chamadas ao DynamoDB se você wrappear o cliente: tracer.captureAWSv3Client(dynamoClient). Para o Dashboard, crie widgets de linha para as métricas AWS/Lambda e métricas customizadas do namespace que você definiu no Metrics.",
      },
      {
        level: "senior",
        title: "Pipeline event-driven resiliente com Lambda + SQS + DLQ + Destinations",
        description: "Construa um pipeline de processamento de pedidos event-driven: (1) Producer Lambda que recebe pedidos via API Gateway e publica no SQS. (2) Consumer Lambda que processa a fila SQS com batch size 10, ReportBatchItemFailures habilitado, e reserved concurrency de 10 (para não sobrecarregar o banco). (3) DLQ (SQS) que recebe mensagens após 3 falhas. (4) Monitor Lambda que escuta a DLQ via Event Source Mapping e envia alerta no Slack/SNS com contexto da falha. (5) Visibility Timeout da fila = 6× o timeout da Consumer Lambda. (6) CloudWatch Dashboard com métricas de NumberOfMessagesSent, NumberOfMessagesDeleted, ApproximateNumberOfMessagesVisible e ApproximateAgeOfOldestMessage na fila principal e na DLQ.",
        concepts: ["SQS", "DLQ", "Lambda", "ReportBatchItemFailures", "Reserved Concurrency", "Visibility Timeout", "CloudWatch"],
        hint: "A armadilha mais comum: Visibility Timeout muito curto. Se a Consumer Lambda tem timeout de 30s, o Visibility Timeout deve ser pelo menos 180s (6×). Configure no SQS: aws sqs set-queue-attributes --queue-url <url> --attributes VisibilityTimeout=180. Para o alarme de DLQ: alerta quando ApproximateNumberOfMessagesVisible na DLQ > 0 por 1 minuto.",
      },
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
      {
        label: "MDF — quando usar módulos",
        trick: "Módulo = Duas ou mais vezes o mesmo padrão. Docs + For_each = poder.",
        explanation: "Extraia um módulo quando você perceber que está copiando e colando blocos HCL para ambientes diferentes. Um bom módulo tem: variáveis documentadas (description obrigatória), outputs úteis e for_each ou count no chamador para criar múltiplas instâncias. Sem for_each, o módulo perde metade do valor.",
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
      {
        q: "O que é terraform taint e quando usaria terraform replace?",
        a: "<p><strong>terraform taint (depreciado no 1.5+):</strong> marcava um recurso no state como 'corrompido' — o próximo plan geraria um destroy + create desse recurso. Era usado quando uma instância EC2 ficava em estado inválido ou um certificado precisava ser forçosamente recriado.</p><p><strong>terraform apply -replace (1.5+):</strong> substituto moderno do taint. Força a recriação de um recurso específico em um único comando, sem alterar o state entre operações.</p><pre>terraform apply -replace=aws_instance.web</pre><p><strong>Diferenças importantes:</strong></p><p>- -replace gera um plan mostrando o destroy + create antes de executar — você confirma o que vai acontecer.</p><p>- -replace pode ser combinado com -target para substituir só o recurso específico sem tocar nos demais.</p><p>- taint alterava o state sem mostrar preview — era perigoso em times porque o próximo apply de qualquer pessoa destruía o recurso.</p><p><strong>Casos de uso válidos:</strong> forçar rotação de certificados, recriar instância EC2 que ficou corrompida sem mudar o código HCL, forçar recriação de secret no Secrets Manager após vazamento.</p>",
        level: "pleno",
      },
      {
        q: "Como funciona o terraform plan -out e por que é importante em CI/CD?",
        a: "<p><strong>terraform plan -out=tfplan</strong> salva o plano calculado em um arquivo binário. O <strong>terraform apply tfplan</strong> posterior aplica exatamente aquele plano — sem recalcular, sem surpresas.</p><p><strong>Por que isso importa em CI/CD:</strong></p><p>Sem -out: o pipeline faz plan na etapa 1, aguarda aprovação humana, faz apply na etapa 2. Mas entre plan e apply podem passar horas — alguém pode ter mudado a infra, o plano ficou stale. O apply recalcula um novo plano e aplica sem revisão humana.</p><p>Com -out: o plan é salvo como artefato do CI, revisado e aprovado. O apply consome exatamente esse artefato — sem recalcular. Zero divergência entre o que foi aprovado e o que foi aplicado.</p><p><strong>Fluxo seguro completo:</strong></p><p>1. PR → plan -out=tfplan → salvar tfplan como artefato de CI<br>2. Postar diff no PR (via tfcmt ou gh CLI)<br>3. Revisão e aprovação humana<br>4. Merge → apply tfplan (consome o artefato aprovado)</p><p>O arquivo tfplan contém credenciais implicitamente — não commite no git. Use o sistema de artefatos do CI (GitHub Actions artifacts, S3) com TTL curto.</p>",
        level: "pleno",
      },
      {
        q: "Como Terraform lida com dependências entre recursos?",
        a: "<p>Terraform constrói um grafo de dependências (DAG — Directed Acyclic Graph) automaticamente a partir das referências no HCL.</p><p><strong>Dependências implícitas</strong> (automáticas): quando você referencia o atributo de um recurso em outro, Terraform entende que o segundo depende do primeiro.</p><pre>resource \"aws_subnet\" \"private\" {\n  vpc_id = aws_vpc.main.id  # implica: vpc deve existir primeiro\n}</pre><p><strong>Dependências explícitas</strong> (depends_on): para dependências que não aparecem como referência direta — por exemplo, uma Lambda que precisa de uma IAM Role, mas a referência está no ARN passado como variável de ambiente, não como atributo direto.</p><pre>resource \"aws_lambda_function\" \"processor\" {\n  ...\n  depends_on = [aws_iam_role_policy_attachment.lambda_exec]\n}</pre><p><strong>Execução paralela:</strong> recursos sem dependência entre si são criados em paralelo (até 10 por padrão, configurável com terraform apply -parallelism=N). Isso reduz drasticamente o tempo de apply para stacks grandes.</p><p><strong>Ciclos:</strong> Terraform detecta dependências circulares e rejeita com erro. Se você se deparar com um ciclo (SG-A referencia SG-B e vice-versa), a solução é usar aws_security_group_rule em vez de regras inline, quebrando o ciclo.</p>",
        level: "pleno",
      },
      {
        q: "Como validar variáveis e garantir que o módulo receba inputs corretos?",
        a: "<p>Terraform oferece múltiplas camadas de validação de variáveis:</p><p><strong>1. Tipo (type):</strong> valida o tipo estático da variável — string, number, bool, list, map, object, set. Erros de tipo são detectados no plan, antes de qualquer chamada à API.</p><p><strong>2. Validation blocks (Terraform 0.13+):</strong> lógica customizada com condition (expressão booleana) e error_message. Roda durante plan e apply.</p><pre>variable \"env\" {\n  type = string\n  validation {\n    condition     = contains([\"dev\",\"staging\",\"prod\"], var.env)\n    error_message = \"env deve ser dev, staging ou prod.\"\n  }\n}\n\nvariable \"instance_count\" {\n  type = number\n  validation {\n    condition     = var.instance_count >= 1 && var.instance_count <= 10\n    error_message = \"Entre 1 e 10 instâncias.\"\n  }\n}</pre><p><strong>3. sensitive = true:</strong> marca variáveis que contêm secrets — o valor não aparece nos logs do plan/apply. Mas atenção: o valor ainda fica em plaintext no state.</p><p><strong>4. nullable = false:</strong> força que a variável nunca seja null, mesmo que o chamador passe null explicitamente.</p><p><strong>5. object com atributos tipados:</strong> para configurações complexas, defina o type como object({ campo = tipo }) — Terraform valida que todos os atributos obrigatórios estão presentes com os tipos corretos.</p>",
        level: "pleno",
      },
      {
        q: "O que é Terraform Cloud e Terraform Enterprise? Quando fazem sentido?",
        a: "<p><strong>Terraform Cloud (TFC):</strong> SaaS da HashiCorp que gerencia state, runs (plan/apply), variáveis sensíveis, RBAC por workspace, módulos privados e políticas (Sentinel). Plano gratuito cobre equipes pequenas. Pago a partir de 20 usuários ou recursos enterprise.</p><p><strong>Terraform Enterprise (TFE):</strong> versão self-hosted do TFC. Instalado na VPC da empresa. Para organizações com compliance estrito que não podem ter state em SaaS externo (HIPAA, PCI-DSS, financeiro).</p><p><strong>Quando TFC/TFE fazem sentido:</strong></p><p>- Times grandes sem capacidade de manter o pipeline de CI/CD Terraform internamente.</p><p>- Necessidade de VCS-driven workflows (push → plan automático) sem configurar GitHub Actions.</p><p>- Sentinel (Policy as Code enterprise) para guardrails centralizados e auditoria.</p><p>- Private Module Registry para compartilhar módulos entre times de forma governada.</p><p><strong>Alternativa open source:</strong> pipeline próprio com GitHub Actions + S3 backend + checkov + tfcmt cobre 90% dos casos sem custo de licença. Use TFC/TFE quando a complexidade de manutenção do pipeline próprio superar o custo da licença.</p>",
        level: "senior",
      },
      {
        q: "Como migrar infraestrutura existente (criada manualmente ou com CloudFormation) para Terraform?",
        a: "<p><strong>Estratégia geral: import incremental, não big bang.</strong></p><p><strong>1. Inventário:</strong> liste todos os recursos a migrar. Priorize por criticidade — comece pelos menos críticos (buckets S3 de logs, SGs auxiliares) para aprender o fluxo antes de tocar banco de produção.</p><p><strong>2. Escreva o HCL primeiro:</strong> crie os blocos resource correspondentes com os atributos que você acha que o recurso tem. Para CloudFormation: muitos atributos mapeiam diretamente.</p><p><strong>3. terraform import:</strong> associa o recurso ao state. Após o import, rode terraform plan — se houver diff, ajuste o HCL até o plan mostrar zero mudanças (No changes).</p><p><strong>4. Terraform 1.5+ — bloco import + generate-config:</strong></p><pre>import {\n  to = aws_s3_bucket.data\n  id = \"meu-bucket-prod\"\n}\n</pre><p>terraform plan -generate-config-out=generated.tf gera o HCL automaticamente. Revise, limpe e incorpore ao código real.</p><p><strong>5. Validação pós-import:</strong> após zerar o plan, rode um apply e confirme que mostra zero mudanças — infraestrutura está totalmente sob controle do Terraform.</p><p><strong>Armadilha CloudFormation:</strong> stacks CF e Terraform não se comunicam nativamente. Opções: usar data sources para ler outputs de stacks CF, ou migrar completamente (import todos os recursos, depois deletar a stack CF sem destruir os recursos — aws cloudformation delete-stack --retain-resources).</p>",
        level: "senior",
      },
      {
        q: "Explique o conceito de provider aliases e multiple provider configurations.",
        a: "<p>Por padrão, um provider tem uma única configuração (região, credenciais). Provider aliases permitem múltiplas configurações do mesmo provider no mesmo módulo — essencial para recursos multi-região ou multi-conta.</p><p><strong>Caso 1 — Multi-região:</strong> CloudFront exige certificado ACM em us-east-1, mas a aplicação roda em sa-east-1.</p><pre>provider \"aws\" {\n  region = \"sa-east-1\"         # provider default\n}\nprovider \"aws\" {\n  alias  = \"us-east-1\"\n  region = \"us-east-1\"         # provider alternativo\n}\nresource \"aws_acm_certificate\" \"cdn\" {\n  provider          = aws.us-east-1  # usa o alias\n  domain_name       = \"*.minha-app.com\"\n  validation_method = \"DNS\"\n}</pre><p><strong>Caso 2 — Multi-conta:</strong> recurso em conta de segurança diferente da conta de aplicação.</p><pre>provider \"aws\" {\n  alias      = \"security-account\"\n  assume_role { role_arn = \"arn:aws:iam::SECURITY_ACCOUNT:role/TerraformRole\" }\n}</pre><p><strong>Passagem para módulos:</strong> o root module passa o alias para o child module via providers = { aws = aws.us-east-1 }. Módulos recebem o provider como argumento — isso mantém o módulo portável e testável.</p>",
        level: "senior",
      },
      {
        q: "Como identificar e corrigir performance lenta em terraform plan ou apply?",
        a: "<p>Plans e applies lentos geralmente têm causas específicas e soluções diretas.</p><p><strong>1. Muitos recursos em um único state:</strong> Terraform lê o state e chama a API de cada recurso durante o refresh (para detectar drift). Com 500+ recursos, isso pode demorar minutos. Solução: fragmentar o state — separar infra de rede (VPC, subnets) de infra de aplicação (ECS, RDS). Cada state tem um scope menor e o plan é mais rápido.</p><p><strong>2. data sources lentos:</strong> data sources que consultam a API da AWS durante o plan adicionam latência. Use -refresh=false para planos em que você sabe que o state está atualizado (mas com cuidado — você pode perder drift). Alternativa: cachear outputs de módulos de rede em terraform_remote_state.</p><p><strong>3. -parallelism:</strong> o padrão é 10 operações paralelas. Aumentar para -parallelism=20 pode acelerar applies com muitos recursos independentes. Mas rate limits de API da AWS podem causar erros — teste com cautela.</p><p><strong>4. -target:</strong> plan/apply de um módulo ou recurso específico. Usar em desenvolvimento para iterar rápido, nunca em produção como prática regular (pode criar drift entre módulos).</p><p><strong>5. TF_LOG=JSON + timestamps:</strong> ativar logging detalhado ajuda a identificar qual chamada de API está demorando — frequentemente é um serviço específico com latência alta.</p>",
        level: "senior",
      },
    ],
    videos: [
      { title: "Terraform in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=tomUWcQ0P3k", topic: "Visão geral rápida do conceito de IaC com Terraform" },
      { title: "Terraform Course — Automate your AWS cloud infrastructure", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", topic: "Curso completo do zero: providers, state, módulos, S3 backend" },
      { title: "Terraform Remote State & Backend S3 Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=RA1mNClGYJ4", topic: "Configuração de backend remoto com S3 + DynamoDB locking passo a passo" },
      { title: "How to Structure Terraform Projects", channel: "Anton Babenko", url: "https://www.youtube.com/watch?v=mOsiLZGdXS4", topic: "Estrutura de repositório, módulos, multi-ambiente — boas práticas de autor de módulos AWS oficiais" },
      { title: "Terraform Modules Deep Dive", channel: "HashiCorp", url: "https://www.youtube.com/watch?v=Q3kbXAOAFSk", topic: "Módulos reutilizáveis, inputs, outputs, versioning, Registry" },
    ],
    exercises: [
      {
        level: "iniciante",
        title: "VPC + EC2 com Security Group em HCL do zero",
        description: "Provisione uma VPC com subnets pública e privada, Internet Gateway, Security Group e uma instância EC2 na subnet pública. Configure o backend remoto com S3 + DynamoDB antes de aplicar.",
        concepts: ["aws_vpc", "aws_subnet", "aws_internet_gateway", "aws_security_group", "aws_instance", "remote backend S3 + DynamoDB"],
        hint: "Comece criando o bucket S3 e a tabela DynamoDB manualmente ou via console, configure o backend.tf, rode terraform init. Use data.aws_ami para encontrar a AMI Ubuntu mais recente em vez de hardcodar o ID.",
        relatedKeypoints: [0, 1, 4],
      },
      {
        level: "intermediario",
        title: "Módulo VPC reutilizável com for_each e múltiplos ambientes",
        description: "Extraia a VPC do exercício anterior para um módulo reutilizável (modules/vpc/). Crie dois environments (envs/dev/ e envs/staging/) que chamam o módulo com CIDRs e números de AZs diferentes. Use for_each para criar subnets dinamicamente por AZ. Outputs do módulo: vpc_id, private_subnet_ids, public_subnet_ids.",
        concepts: ["módulos child", "for_each com map", "inputs/outputs de módulo", "diretórios separados por ambiente", "tfvars por ambiente"],
        hint: "Defina var.private_subnets como map(string) no módulo — chaves são AZs, valores são CIDRs. O root module passa o mapa e o for_each itera. Outputs do módulo devem usar values(aws_subnet.private) para retornar lista de IDs.",
        relatedKeypoints: [2, 3],
      },
      {
        level: "senior",
        title: "Pipeline GitOps com Terraform, GitHub Actions, OIDC e Checkov",
        description: "Configure um pipeline completo de GitOps para a infra do exercício anterior: (1) PR trigger: checkov para análise de segurança + terraform plan postado como comentário no PR. (2) Merge em main: terraform apply automático para dev, apply com aprovação manual para staging. (3) Autenticação via OIDC — sem AWS_ACCESS_KEY_ID em secrets. (4) Separação de roles: PlanRole (read-only) e ApplyRole (write restrito). Adicione prevent_destroy no VPC e no Security Group principal.",
        concepts: ["OIDC com GitHub Actions", "IAM Role trust policy por repositório/branch", "checkov no CI", "terraform plan -out + artefato", "environment protection rules", "prevent_destroy", "lifecycle rules"],
        hint: "A trust policy da IAM Role deve conter a condition: token.actions.githubusercontent.com:sub = repo:OWNER/REPO:ref:refs/heads/main para apply, e repo:OWNER/REPO:pull_request para plan. Use aws-actions/configure-aws-credentials@v4 com role-to-assume. Salve o tfplan como artifact e consuma no job de apply.",
        relatedKeypoints: [7, 8],
      },
    ],
    mindmap: {
      title: "Terraform — mapa mental completo",
      html: `<style>
.tfmm-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:24px 20px;color:#e2e8f0;overflow:auto}
.tfmm-center{background:linear-gradient(135deg,rgba(123,66,188,.25),rgba(123,66,188,.1));border:2px solid #7B42BC;border-radius:12px;padding:10px 18px;text-align:center;font-size:13px;font-weight:700;color:#c4b5fd;display:inline-block;margin:0 auto;white-space:nowrap}
.tfmm-root{display:flex;flex-direction:column;align-items:center;gap:20px}
.tfmm-ring{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:4px}
.tfmm-branch{background:#1e293b;border-radius:10px;padding:12px 14px;min-width:180px;max-width:220px;flex:1}
.tfmm-btitle{font-size:9px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid rgba(255,255,255,.06)}
.tfmm-leaf{font-size:9.5px;color:#64748b;padding:3px 0;line-height:1.5;border-bottom:1px solid rgba(255,255,255,.03)}
.tfmm-leaf:last-child{border-bottom:none}
.tfmm-leaf::before{content:'▸ ';color:#475569}
.tfmm-leaf span{color:#94a3b8}
.tfmm-connector{color:#334155;font-size:11px;text-align:center;padding:2px 0}
</style>
<div class="tfmm-wrap">
  <div class="tfmm-root">
    <div class="tfmm-center">TERRAFORM</div>
    <div class="tfmm-connector">↓ IaC declarativo multi-cloud — HCL → Estado → Infra Real</div>

    <div class="tfmm-ring">
      <!-- Fluxo -->
      <div class="tfmm-branch" style="border:1.5px solid #7B42BC">
        <div class="tfmm-btitle" style="color:#7B42BC">Ciclo de vida</div>
        <div class="tfmm-leaf"><span>terraform init</span> — providers + backend</div>
        <div class="tfmm-leaf"><span>terraform validate</span> — sintaxe HCL</div>
        <div class="tfmm-leaf"><span>terraform plan</span> — diff sem aplicar</div>
        <div class="tfmm-leaf"><span>terraform apply</span> — modifica infra</div>
        <div class="tfmm-leaf"><span>terraform destroy</span> — remove tudo</div>
        <div class="tfmm-leaf"><span>-replace</span> — recria recurso específico</div>
      </div>

      <!-- State -->
      <div class="tfmm-branch" style="border:1.5px solid #FF9900">
        <div class="tfmm-btitle" style="color:#FF9900">State</div>
        <div class="tfmm-leaf">terraform.tfstate — mapeamento HCL ↔ cloud</div>
        <div class="tfmm-leaf"><span>Remote backend:</span> S3 + DynamoDB</div>
        <div class="tfmm-leaf"><span>Locking:</span> DynamoDB ConditionalCheck</div>
        <div class="tfmm-leaf"><span>state list / show / mv / rm</span></div>
        <div class="tfmm-leaf"><span>terraform import</span> — adota existente</div>
        <div class="tfmm-leaf">Nunca edite manualmente!</div>
      </div>

      <!-- HCL Blocks -->
      <div class="tfmm-branch" style="border:1.5px solid #4ade80">
        <div class="tfmm-btitle" style="color:#4ade80">Blocos HCL</div>
        <div class="tfmm-leaf"><span>resource</span> — o que criar/gerenciar</div>
        <div class="tfmm-leaf"><span>data</span> — ler recurso existente</div>
        <div class="tfmm-leaf"><span>variable</span> — input com tipo + validação</div>
        <div class="tfmm-leaf"><span>output</span> — exportar valores</div>
        <div class="tfmm-leaf"><span>locals</span> — valores computados</div>
        <div class="tfmm-leaf"><span>module</span> — chamar child module</div>
      </div>

      <!-- Módulos -->
      <div class="tfmm-branch" style="border:1.5px solid #a78bfa">
        <div class="tfmm-btitle" style="color:#a78bfa">Módulos</div>
        <div class="tfmm-leaf">Root module — diretório de trabalho</div>
        <div class="tfmm-leaf">Child modules — source local/git/registry</div>
        <div class="tfmm-leaf"><span>Versione</span> sempre com version = "~> X.Y"</div>
        <div class="tfmm-leaf">Interface: variables.tf + outputs.tf</div>
        <div class="tfmm-leaf">terraform-aws-modules VPC / ECS / RDS</div>
        <div class="tfmm-leaf">Teste com Terratest (Go)</div>
      </div>

      <!-- Loops e Condicionais -->
      <div class="tfmm-branch" style="border:1.5px solid #f59e0b">
        <div class="tfmm-btitle" style="color:#f59e0b">Iteração e controle</div>
        <div class="tfmm-leaf"><span>for_each</span> map/set — identidade por key</div>
        <div class="tfmm-leaf"><span>count</span> — N cópias por índice</div>
        <div class="tfmm-leaf"><span>dynamic block</span> — blocos dinâmicos</div>
        <div class="tfmm-leaf"><span>condition ? a : b</span> — ternário</div>
        <div class="tfmm-leaf">toset() para converter lista → set</div>
        <div class="tfmm-leaf">for expr + locals para transformações</div>
      </div>

      <!-- Lifecycle -->
      <div class="tfmm-branch" style="border:1.5px solid #ef4444">
        <div class="tfmm-btitle" style="color:#ef4444">Lifecycle Rules</div>
        <div class="tfmm-leaf"><span>create_before_destroy</span> — zero downtime</div>
        <div class="tfmm-leaf"><span>prevent_destroy</span> — proteção prod</div>
        <div class="tfmm-leaf"><span>ignore_changes</span> — drift intencional</div>
        <div class="tfmm-leaf"><span>replace_triggered_by</span> — cascata</div>
        <div class="tfmm-leaf">Usar em ACM certs, RDS, SGs críticos</div>
        <div class="tfmm-leaf">depends_on para dependências implícitas</div>
      </div>

      <!-- CI/CD -->
      <div class="tfmm-branch" style="border:1.5px solid #38bdf8">
        <div class="tfmm-btitle" style="color:#38bdf8">CI/CD Seguro</div>
        <div class="tfmm-leaf"><span>OIDC</span> — sem access keys em secrets</div>
        <div class="tfmm-leaf">PR → plan -out → artefato → revisão</div>
        <div class="tfmm-leaf">Merge → apply artefato aprovado</div>
        <div class="tfmm-leaf"><span>checkov / tfsec</span> — linting de segurança</div>
        <div class="tfmm-leaf">PlanRole (read) vs ApplyRole (write)</div>
        <div class="tfmm-leaf">Environment protection rules para prod</div>
      </div>

      <!-- Multi-ambiente -->
      <div class="tfmm-branch" style="border:1.5px solid #34d399">
        <div class="tfmm-btitle" style="color:#34d399">Multi-ambiente</div>
        <div class="tfmm-leaf">Diretórios separados: envs/dev, envs/prod</div>
        <div class="tfmm-leaf">State isolado por ambiente no S3</div>
        <div class="tfmm-leaf">tfvars por ambiente (prod.tfvars)</div>
        <div class="tfmm-leaf">Workspaces — apenas ambientes efêmeros</div>
        <div class="tfmm-leaf">IAM roles separadas por ambiente</div>
        <div class="tfmm-leaf">terraform_remote_state para outputs cross-stack</div>
      </div>
    </div>
  </div>
</div>`,
      caption: "Terraform como sistema: state conecta o HCL à realidade. Módulos organizam o código. Lifecycle protege produção. CI/CD com OIDC elimina credenciais de longa duração.",
    },
    resources: [
      { title: "Terraform docs", url: "https://developer.hashicorp.com/terraform/docs", kind: "docs" },
      { title: "Terraform: Up and Running — Yevgeniy Brikman (O'Reilly)", url: "https://www.terraformupandrunning.com/", kind: "livro" },
      { title: "Terraform Registry", url: "https://registry.terraform.io/", kind: "pratica" },
      { title: "terraform-aws-modules (VPC, ECS, RDS)", url: "https://github.com/terraform-aws-modules", kind: "pratica" },
      { title: "Terratest", url: "https://terratest.gruntwork.io/", kind: "docs" },
      { title: "checkov — static analysis", url: "https://www.checkov.io/", kind: "pratica" },
      { title: "Terraform Best Practices — Anton Babenko", url: "https://www.terraform-best-practices.com/", kind: "artigo" },
      { title: "HashiCorp Learn — Terraform", url: "https://developer.hashicorp.com/terraform/tutorials", kind: "curso" },
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
