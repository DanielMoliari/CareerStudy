import type { SkillContent } from '@/types'

const ec2: SkillContent = {
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
}

export default ec2
