import type { SkillContent } from '@/types'

const vpc: SkillContent = {
  tagline: 'Rede privada virtual na AWS — subnets, routing, security groups, NAT, peering, endpoints e flow logs.',
  why: 'VPC é a fundação de toda arquitetura AWS segura. Saber subnets públicas vs privadas, route tables, NAT Gateway, Security Groups vs NACLs, VPC Peering vs Transit Gateway, VPC Endpoints e Flow Logs é necessário para projetar infraestrutura corretamente em entrevista de cloud sênior. 70% dos casos de "EC2 não responde" são problemas de VPC.',
  summary:
    'Amazon VPC (Virtual Private Cloud) é uma rede virtual isolada na AWS. Define um CIDR principal, divide em subnets públicas (route table com Internet Gateway) e privadas (sem rota para IGW). NAT Gateway permite saída de subnets privadas. Security Groups (stateful, por ENI) e NACLs (stateless, por subnet) controlam tráfego. VPC Peering, Transit Gateway, VPN e Direct Connect conectam VPCs entre si e com on-premises. VPC Endpoints (Gateway para S3/DynamoDB, Interface PrivateLink para os demais) eliminam tráfego pela internet. Flow Logs capturam metadados de pacotes para auditoria e debugging.',
  prerequisite:
    'Entender CIDR (RFC 1918), subnetting básico, diferença entre TCP stateful e UDP stateless, conceitos de roteamento por longest prefix match e DNS.',
  howToStudy:
    'Construa uma VPC do zero com Terraform: VPC /16 + 2 AZs × (1 subnet pública + 1 privada) + IGW + 2 NAT Gateways + route tables + Security Groups em padrão 3-tier. Habilite Flow Logs e leia no CloudWatch. Crie um Gateway Endpoint para S3 e veja o tráfego deixando de passar pelo NAT. Faça peering entre duas VPCs e descubra na prática que peering não é transitivo.',
  keypoints: [
    {
      title: 'VPC e CIDR planning',
      body: 'VPC é uma rede virtual isolada na AWS, definida por um CIDR block (RFC 1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16). Padrão de produção: VPC /16 (65k IPs) com subnets /24 (256 IPs, 251 utilizáveis — AWS reserva 5 por subnet). Planejar com folga: VPC /16 não é expansível trivialmente (CIDRs secundários têm limitações de overlap com peering). Em arquitetura multi-conta, alocar ranges não-sobrepostos por VPC desde o início.',
    },
    {
      title: 'Subnets públicas vs privadas',
      body: 'A diferença NÃO é um flag — é a route table associada. Pública: route table tem rota 0.0.0.0/0 → IGW E o recurso recebe IP público (auto-assign ou Elastic IP). Privada: sem rota para IGW, sem IP público. Subnet vive em UMA AZ — multi-AZ exige múltiplas subnets. Padrão 3-tier: subnets públicas para ALB/NAT GW, subnets privadas de aplicação para EC2/ECS, subnets privadas isoladas para RDS (sem nem rota para NAT).',
    },
    {
      title: 'Route tables',
      body: 'Determinam o próximo salto baseado no CIDR de destino. Cada subnet tem UMA route table associada (main route table se nenhuma associação explícita). Rota local 10.0.0.0/16 → local existe sempre (não removível). Longest prefix match: rota mais específica vence (10.0.5.0/24 vence sobre 0.0.0.0/0). Rotas comuns: 0.0.0.0/0 → igw-xxx (pública), 0.0.0.0/0 → nat-xxx (privada), pl-63a5400a → vpce-s3-xxx (Gateway Endpoint).',
    },
    {
      title: 'Internet Gateway (IGW)',
      body: 'Componente horizontalmente escalável e altamente disponível, gerenciado pela AWS. Sem custo por hora. Habilita comunicação bidirecional entre VPC e internet. Anexado a UMA VPC. Subnet só é pública se a route table aponta 0.0.0.0/0 para o IGW E a instância tem IP público (auto-assign na subnet OU Elastic IP). NAT é apenas para saída — IGW é entrada e saída.',
    },
    {
      title: 'NAT Gateway',
      body: 'Permite instâncias em subnet privada iniciarem conexões para a internet (apt update, chamadas a APIs externas) — internet NUNCA inicia conexão para a privada. Vive em subnet pública e tem Elastic IP. Custo: ~$0.045/h + $0.045/GB processado (caro em escala). Para HA: UM NAT Gateway por AZ, com route table separada por AZ apontando para o NAT da própria AZ — evita single point of failure E custo de tráfego cross-AZ. Limites: 45 Gbps por NAT, 55k conexões simultâneas por destino.',
    },
    {
      title: 'Security Groups (stateful, por ENI)',
      body: 'Firewall stateful no nível da Elastic Network Interface (ENI). Stateful: resposta de conexão autorizada entra automaticamente sem regra explícita de retorno. Apenas Allow (não tem Deny). Múltiplos SGs por instância — permissões são UNIÃO. Pode referenciar outros SGs em vez de CIDRs (source = sg-alb permite "qualquer instância no SG do ALB"). Default: bloqueia tudo de entrada, permite tudo de saída. SG não é compartilhado entre VPCs (criar por VPC).',
    },
    {
      title: 'NACLs (Network ACLs, stateless por subnet)',
      body: 'Firewall stateless no nível da subnet. Stateless: precisa de regra Allow explícita para ida E volta (incluindo respostas em portas efêmeras 1024-65535). Suporta Allow E Deny. Regras avaliadas por número crescente (rule 100 vence rule 200) — primeira que casa decide. Asterisco (*) = deny all implícito ao final. Default NACL = allow all. Use somente para bloqueio amplo (range de IPs maliciosos, defense in depth) — para 99% dos casos, deixe NACL default e configure tudo no SG.',
    },
    {
      title: 'VPC Peering vs Transit Gateway vs VPN vs Direct Connect',
      body: 'Peering: conexão direta entre 2 VPCs (mesma conta ou cross-account, mesma região ou cross-region). Não transitivo: A↔B e B↔C não cria A↔C. Sem custo por hora, só por dados. Bom para 2-5 VPCs. Transit Gateway (TGW): hub central transitivo que conecta dezenas de VPCs e on-premises (VPN/Direct Connect). Custa $0.05/h por attachment + $/GB. Justifica acima de ~5 VPCs ou quando precisa de roteamento centralizado. VPN site-to-site: IPsec sobre internet, ~1-1.25 Gbps por túnel, latência variável. Direct Connect: link físico dedicado (1-100 Gbps), latência baixa e previsível, custa caro mas necessário para workloads sensíveis.',
    },
    {
      title: 'VPC Endpoints (eliminam tráfego pela internet)',
      body: 'Gateway Endpoint: APENAS S3 e DynamoDB. Gratuito. Adiciona uma rota implícita na route table (ex: pl-63a5400a → vpce-s3-xxx). O tráfego para S3 passa pela rede AWS sem nem tocar o NAT. Interface Endpoint (AWS PrivateLink): outros serviços AWS (SSM, KMS, Secrets Manager, ECR, CloudWatch Logs) e SaaS de terceiros. Cria ENI privada na subnet com IP da subnet. Custo ~$0.01/h por endpoint por AZ + $0.01/GB processado. VPC Endpoint Policies: restringem quais buckets/recursos podem ser acessados pelo endpoint (defense in depth contra dados saindo para buckets fora da org).',
    },
    {
      title: 'Bastion vs SSM Session Manager',
      body: 'Padrão antigo: bastion host em subnet pública com porta 22 aberta — qualquer um na internet pode tentar SSH. Padrão moderno: SSM Session Manager. Sem porta aberta, sem chaves SSH, sem bastion. Acesso ao terminal via IAM (com MFA, SCP organizacional) e auditado em CloudTrail. Requisitos: SSM Agent na instância (já vem em AMIs Amazon Linux 2/2023) + IAM Instance Profile com policy AmazonSSMManagedInstanceCore + saída para endpoints SSM (via NAT, IGW ou Interface Endpoints). Acesso via aws ssm start-session --target i-xxx.',
    },
    {
      title: 'VPC Flow Logs',
      body: 'Capturam metadados de tráfego IP em ENI, subnet ou VPC inteiro: timestamp, source/dest IP+porta, protocolo, bytes, ação (ACCEPT/REJECT). NÃO captura conteúdo de pacote. Destino: CloudWatch Logs (queries em tempo real, custo alto) ou S3 (custo baixo, queries via Athena). Format v2 (default) ou customizado (campos extras como pkt-srcaddr para tráfego dentro de Container/IPv6). Use para: investigação de incidente (IPs comunicando com C&C, port scans, dados saindo de subnet privada), troubleshooting de conectividade, auditoria de compliance.',
    },
    {
      title: 'Elastic Network Interface (ENI)',
      body: 'Interface de rede virtual em uma VPC. Toda instância EC2 tem pelo menos uma (eth0, primary). ENI tem: IP privado primary, possíveis IPs privados secundários, Elastic IP opcional, MAC address, lista de Security Groups. Pode ser destacada de uma instância e anexada a outra (failover de aparelho de rede, mover IP entre instâncias sem mudar DNS). Cada tipo de instância tem limite de ENIs e IPs por ENI (m5.large = 3 ENIs, 10 IPs cada). Source/Dest Check ativado por padrão — desabilitar para NAT instance.',
    },
    {
      title: 'IPv6 e dual-stack',
      body: 'VPC pode ser dual-stack (IPv4 + IPv6). IPv6 sempre é público globalmente — não há "IPv6 privado". Para impedir que instâncias IPv6 sejam alcançáveis de fora: Egress-Only Internet Gateway (equivalente NAT para IPv6, gratuito). Subnet pode ter IPv4 only, IPv6 only, ou dual. Casos de uso de IPv6: economia (cobrança por NAT GW desaparece para IPv6), futuro-proofing, integração com serviços que demandam IPv6.',
    },
    {
      title: 'DNS na VPC',
      body: 'enableDnsSupport (default true): DNS resolution dentro da VPC funciona. Resolver Route 53 em x.x.x.2 (segundo IP da VPC) responde queries internas. enableDnsHostnames (default false na maioria dos casos): instâncias com IP público recebem hostname público (ex: ec2-x-x-x-x.compute-1.amazonaws.com). Route 53 Resolver Endpoints: inbound (queries vindo de on-premises para zonas privadas Route 53) e outbound (queries da VPC para DNS on-premises). Split-horizon DNS via Private Hosted Zones associadas a múltiplas VPCs.',
    },
    {
      title: 'Multi-AZ e design 3-tier',
      body: 'Padrão de produção: 3 AZs (us-east-1a, 1b, 1c) × 3 tiers (público, app, db) = 9 subnets. Mínimo aceitável: 2 AZs × 3 tiers = 6 subnets. Por que 3 AZs: ALB e RDS Multi-AZ exigem ao menos 2; 3 AZs garante HA mesmo durante falha + manutenção concorrente. Cada subnet tem CIDR distinto que não overlap. Route tables: uma para subnets públicas (apontando para IGW), uma por AZ para subnets privadas (apontando para o NAT da própria AZ). Security Groups em cascata: sg-alb (público) → sg-app (privado, inbound só de sg-alb) → sg-rds (db, inbound só de sg-app).',
    },
    {
      title: 'AWS PrivateLink',
      body: 'Tecnologia por trás dos Interface Endpoints. Permite que serviços (seu ou de terceiros) sejam expostos na sua VPC como uma ENI privada — o consumidor nunca vê o IP do produtor. Provedor cria um Network Load Balancer + Endpoint Service. Consumidor cria Interface Endpoint apontando para o serviço. Aplicação chama o IP da ENI privada. Tráfego não passa pela internet. Casos: SaaS (Datadog, MongoDB Atlas, Snowflake), microserviços compartilhados entre contas, exposição de internal API sem peering.',
    },
    {
      title: 'Limites e quotas críticas',
      body: 'Por região, por conta (limites soft/aumentáveis): 5 VPCs, 5 IGWs, 200 subnets por VPC, 200 route tables por VPC, 60 inbound + 60 outbound rules por SG, 2500 SGs por VPC, 50 NACLs por VPC, 5 Elastic IPs (limite famoso pequeno — aumentar via Service Quotas). Limites hard: 5 CIDRs por VPC, 200 routes por route table. Custos invisíveis: NAT GW idle, Elastic IP não associado ($0.005/h), Interface Endpoint por AZ (multiplicar custo por AZs), Flow Logs em CloudWatch (volume).',
    },
  ],
  diagrams: [
    {
      title: 'Arquitetura VPC — multi-AZ 3-tier',
      html: `<style>
.vpc-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.vpc-border{border:2px dashed #334155;border-radius:10px;padding:12px;margin-bottom:10px}
.vpc-az{background:#0f172a;border:1.5px solid #1e3a5f;border-radius:8px;padding:10px;flex:1}
.vpc-az-title{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#4A90E2;font-weight:700;margin-bottom:8px}
.vpc-subnet{border-radius:6px;padding:7px 10px;margin-bottom:6px;font-size:10px}
.vpc-pub{background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.3)}
.vpc-app{background:rgba(168,85,247,.08);border:1px solid rgba(168,85,247,.3)}
.vpc-db{background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.3)}
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
  <div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#4A90E2;font-weight:700;margin-bottom:10px">VPC — 10.0.0.0/16</div>
  <div style="display:flex;gap:8px">
    <div class="vpc-az">
      <div class="vpc-az-title">AZ — us-east-1a</div>
      <div class="vpc-subnet vpc-pub">
        <div style="color:#4ade80;font-weight:600">Pública 10.0.0.0/24</div>
        <div class="vpc-resource">ALB</div>
        <div class="vpc-nat">NAT Gateway</div>
      </div>
      <div style="color:#475569;font-size:12px;text-align:center;margin:3px 0">↕</div>
      <div class="vpc-subnet vpc-app">
        <div style="color:#a78bfa;font-weight:600">App 10.0.10.0/24</div>
        <div class="vpc-resource">EC2 / ECS</div>
      </div>
      <div style="color:#475569;font-size:12px;text-align:center;margin:3px 0">↕</div>
      <div class="vpc-subnet vpc-db">
        <div style="color:#f87171;font-weight:600">DB 10.0.20.0/24</div>
        <div class="vpc-resource">RDS primary</div>
      </div>
    </div>
    <div class="vpc-center">↔</div>
    <div class="vpc-az">
      <div class="vpc-az-title">AZ — us-east-1b</div>
      <div class="vpc-subnet vpc-pub">
        <div style="color:#4ade80;font-weight:600">Pública 10.0.1.0/24</div>
        <div class="vpc-resource">ALB</div>
        <div class="vpc-nat">NAT Gateway</div>
      </div>
      <div style="color:#475569;font-size:12px;text-align:center;margin:3px 0">↕</div>
      <div class="vpc-subnet vpc-app">
        <div style="color:#a78bfa;font-weight:600">App 10.0.11.0/24</div>
        <div class="vpc-resource">EC2 / ECS</div>
      </div>
      <div style="color:#475569;font-size:12px;text-align:center;margin:3px 0">↕</div>
      <div class="vpc-subnet vpc-db">
        <div style="color:#f87171;font-weight:600">DB 10.0.21.0/24</div>
        <div class="vpc-resource">RDS standby</div>
      </div>
    </div>
    <div class="vpc-center">↔</div>
    <div class="vpc-az">
      <div class="vpc-az-title">AZ — us-east-1c</div>
      <div class="vpc-subnet vpc-pub">
        <div style="color:#4ade80;font-weight:600">Pública 10.0.2.0/24</div>
        <div class="vpc-resource">ALB</div>
      </div>
      <div style="color:#475569;font-size:12px;text-align:center;margin:3px 0">↕</div>
      <div class="vpc-subnet vpc-app">
        <div style="color:#a78bfa;font-weight:600">App 10.0.12.0/24</div>
        <div class="vpc-resource">EC2 / ECS</div>
      </div>
      <div style="color:#475569;font-size:12px;text-align:center;margin:3px 0">↕</div>
      <div class="vpc-subnet vpc-db">
        <div style="color:#f87171;font-weight:600">DB 10.0.22.0/24</div>
        <div class="vpc-resource">RDS replica</div>
      </div>
    </div>
  </div>
</div>
<div style="color:#64748b;font-size:10px;margin-top:6px">3 AZs × 3 tiers = 9 subnets. NAT GW por AZ evita single point of failure e tráfego cross-AZ cobrado.</div>
</div>`,
      caption: 'Padrão de produção 3-tier multi-AZ. Subnets públicas só hospedam ALB e NAT GW. App em subnet privada com saída via NAT. DB em subnet isolada (sem rota para NAT) acessível só pelo SG da app.',
    },
    {
      title: 'Security Group vs NACL — fluxo de tráfego',
      html: `<style>
.sgnacl-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.sgnacl-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:8px}
.sgnacl-col{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:14px}
.sgnacl-h{font-size:11px;font-weight:700;margin-bottom:10px;letter-spacing:.05em;text-transform:uppercase}
.sgnacl-row{display:flex;justify-content:space-between;align-items:center;background:#0f172a;border:1px solid #334155;border-radius:6px;padding:6px 10px;font-size:10px;margin-bottom:4px}
.sgnacl-arrow{display:flex;justify-content:center;color:#475569;margin:6px 0;font-size:14px}
.sgnacl-tag{font-size:8px;font-weight:700;padding:2px 6px;border-radius:3px;letter-spacing:.05em}
</style>
<div class="sgnacl-wrap">
<div style="font-size:13px;font-weight:700;color:#4A90E2;margin-bottom:10px">Security Group (stateful) vs NACL (stateless) — request HTTPS</div>
<div class="sgnacl-grid">
  <div class="sgnacl-col" style="border-color:rgba(74,222,128,.3)">
    <div class="sgnacl-h" style="color:#4ade80">Security Group — stateful</div>
    <div class="sgnacl-row" style="background:rgba(74,222,128,.06)">
      <span>1. Cliente → Server (TCP 443)</span>
      <span class="sgnacl-tag" style="background:#4ade8030;color:#4ade80">INBOUND ALLOW</span>
    </div>
    <div class="sgnacl-arrow">↓</div>
    <div class="sgnacl-row">
      <span>2. App processa request</span>
      <span style="color:#94a3b8;font-size:9px">conexão tracked</span>
    </div>
    <div class="sgnacl-arrow">↓</div>
    <div class="sgnacl-row" style="background:rgba(74,222,128,.06)">
      <span>3. Server → Cliente (response)</span>
      <span class="sgnacl-tag" style="background:#4ade8020;color:#4ade80">AUTO-ALLOW</span>
    </div>
    <div style="font-size:9px;color:#64748b;margin-top:8px;padding-top:8px;border-top:1px dashed #334155">
      ✓ Resposta passa automaticamente — sem regra outbound necessária.<br>
      ✓ Apenas Allow (sem Deny). Default deny tudo de entrada.<br>
      ✓ Pode referenciar outros SGs (source = sg-alb).
    </div>
  </div>
  <div class="sgnacl-col" style="border-color:rgba(251,191,36,.3)">
    <div class="sgnacl-h" style="color:#fbbf24">NACL — stateless</div>
    <div class="sgnacl-row" style="background:rgba(251,191,36,.06)">
      <span>1. Cliente → Server (TCP 443)</span>
      <span class="sgnacl-tag" style="background:#fbbf2430;color:#fbbf24">INBOUND ALLOW</span>
    </div>
    <div class="sgnacl-arrow">↓</div>
    <div class="sgnacl-row">
      <span>2. App processa request</span>
      <span style="color:#94a3b8;font-size:9px">sem tracking</span>
    </div>
    <div class="sgnacl-arrow">↓</div>
    <div class="sgnacl-row" style="background:rgba(248,113,113,.06)">
      <span>3. Server → Cliente (porta efêmera)</span>
      <span class="sgnacl-tag" style="background:#f8717130;color:#f87171">PRECISA OUTBOUND ALLOW</span>
    </div>
    <div style="font-size:9px;color:#64748b;margin-top:8px;padding-top:8px;border-top:1px dashed #334155">
      ⚠ Esquecer outbound 1024-65535 = "EC2 não responde".<br>
      ✓ Suporta Allow E Deny, avaliada por rule_number.<br>
      ✓ Por subnet (não por instância).
    </div>
  </div>
</div>
</div>`,
      caption: 'A diferença prática: SG track conexão e libera resposta automaticamente. NACL avalia cada pacote independentemente e exige regras explícitas para portas efêmeras de resposta. Esquecer isso é a fonte mais comum de "EC2 não responde" depois de configurar NACL custom.',
    },
    {
      title: 'CIDR — subnetting de uma VPC /16',
      html: `<style>
.cidr-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.cidr-vpc{background:#1e293b;border:2px solid #4A90E2;border-radius:8px;padding:14px;margin-bottom:14px}
.cidr-row{display:grid;grid-template-columns:160px 100px 100px 1fr;gap:8px;padding:6px 10px;border-bottom:1px dashed #334155;font-size:10px}
.cidr-row:last-child{border-bottom:none}
.cidr-h{display:grid;grid-template-columns:160px 100px 100px 1fr;gap:8px;padding:6px 10px;font-size:9px;letter-spacing:.1em;color:#4A90E2;font-weight:700;text-transform:uppercase;border-bottom:1px solid #334155;margin-bottom:4px}
.cidr-tier-pub{color:#4ade80}
.cidr-tier-app{color:#a78bfa}
.cidr-tier-db{color:#f87171}
.cidr-num{color:#94a3b8}
</style>
<div class="cidr-wrap">
<div style="font-size:13px;font-weight:700;color:#4A90E2;margin-bottom:10px;font-family:'Space Grotesk',sans-serif">VPC 10.0.0.0/16 — 65536 IPs totais</div>
<div class="cidr-vpc">
  <div class="cidr-h">
    <div>SUBNET</div><div>CIDR</div><div>IPs</div><div>USO</div>
  </div>
  <div class="cidr-row"><div class="cidr-tier-pub">pub-1a</div><div>10.0.0.0/24</div><div class="cidr-num">256 (251 úteis)</div><div>ALB + NAT GW (us-east-1a)</div></div>
  <div class="cidr-row"><div class="cidr-tier-pub">pub-1b</div><div>10.0.1.0/24</div><div class="cidr-num">256</div><div>ALB + NAT GW (us-east-1b)</div></div>
  <div class="cidr-row"><div class="cidr-tier-pub">pub-1c</div><div>10.0.2.0/24</div><div class="cidr-num">256</div><div>ALB (us-east-1c)</div></div>
  <div class="cidr-row"><div class="cidr-tier-app">app-1a</div><div>10.0.10.0/24</div><div class="cidr-num">256</div><div>EC2/ECS aplicação</div></div>
  <div class="cidr-row"><div class="cidr-tier-app">app-1b</div><div>10.0.11.0/24</div><div class="cidr-num">256</div><div>EC2/ECS aplicação</div></div>
  <div class="cidr-row"><div class="cidr-tier-app">app-1c</div><div>10.0.12.0/24</div><div class="cidr-num">256</div><div>EC2/ECS aplicação</div></div>
  <div class="cidr-row"><div class="cidr-tier-db">db-1a</div><div>10.0.20.0/24</div><div class="cidr-num">256</div><div>RDS primary</div></div>
  <div class="cidr-row"><div class="cidr-tier-db">db-1b</div><div>10.0.21.0/24</div><div class="cidr-num">256</div><div>RDS standby</div></div>
  <div class="cidr-row"><div class="cidr-tier-db">db-1c</div><div>10.0.22.0/24</div><div class="cidr-num">256</div><div>RDS read replica</div></div>
</div>
<div style="font-size:10px;color:#94a3b8;line-height:1.7">
<strong style="color:#fbbf24">AWS reserva 5 IPs por subnet:</strong> .0 (network), .1 (VPC router), .2 (DNS resolver), .3 (futuro), .255 (broadcast). Subnet /24 = 256 - 5 = 251 utilizáveis.<br>
<strong style="color:#fbbf24">Padrão de numeração:</strong> reservar 10.0.0.0/20 para pub (4096 IPs), 10.0.10.0/20 para app, 10.0.20.0/20 para db. Permite expansão sem refatorar.<br>
<strong style="color:#fbbf24">Multi-conta:</strong> alocar /16 não-sobreposto por VPC (10.0.0.0/16 prod, 10.1.0.0/16 staging). Crítico para peering futuro.
</div>
</div>`,
      caption: 'CIDR planning é decisão de design crítica — refatorar depois é doloroso. Reservar /20 por tier permite crescer de /24 para /22 sem mudar a estrutura de IPs.',
    },
  ],
  mnemonics: [
    {
      label: 'SR-IGW',
      trick: 'Subnet, Route table, IGW — os 3 mínimos para "público"',
      explanation: 'Para uma subnet ser pública você precisa de TODOS os 3: (1) Subnet criada na VPC, (2) Route table com 0.0.0.0/0 → IGW associada à subnet, (3) IGW anexado à VPC. Faltando qualquer um, instâncias na subnet não acessam internet mesmo com IP público.',
    },
    {
      label: 'SAN',
      trick: 'SG = Allow, NACL = Allow + Deny',
      explanation: 'Security Group: apenas Allow (default deny implícito). NACL: Allow ou Deny avaliados em ordem numérica (rule_number ascendente). Quando precisar bloquear IP específico, NACL é a única opção — SG não tem Deny.',
    },
    {
      label: 'STATE-ful x STATE-less',
      trick: 'SG STATEful — guarda estado da conexão. NACL STATEless — esquece tudo',
      explanation: 'SG stateful: track conexão TCP via 5-tuple (src IP+porta, dst IP+porta, protocolo). Resposta entra automática. NACL stateless: cada pacote avaliado isoladamente — esquecer outbound 1024-65535 (portas efêmeras) é a fonte #1 de "EC2 não responde" depois de NACL custom.',
    },
    {
      label: 'IGN (NAT)',
      trick: 'IGW = bidirecional, NAT = Saída apenas',
      explanation: 'Internet Gateway: tráfego entra E sai. NAT Gateway: instâncias privadas saem para internet, mas internet NUNCA inicia conexão para elas. NAT é "porta de saída" — para receber tráfego, use ALB em subnet pública.',
    },
    {
      label: 'PEER NOT TRANSIT',
      trick: 'Peering NÃO é transitivo — TGW é',
      explanation: 'VPC Peering A↔B + B↔C NÃO cria A↔C. Para conectar muitas VPCs use Transit Gateway (transitivo nativo) — uma rota da VPC A para o TGW alcança qualquer VPC anexada. Peering só faz sentido para 2-5 VPCs; acima disso, TGW.',
    },
    {
      label: 'GIE (Endpoint)',
      trick: 'Gateway = grátis (S3, DDB). Interface = $$$ (todo o resto)',
      explanation: 'Gateway Endpoint: APENAS S3 e DynamoDB. Gratuito. Adiciona rota na route table. Interface Endpoint (PrivateLink): qualquer outro serviço AWS. Cobra ~$0.01/h por endpoint por AZ + $/GB. Lembre-se: Gateway é SEMPRE preferível quando disponível — economia direta de NAT GW.',
    },
  ],
  cheatsheet: {
    title: 'VPC — Cheatsheet de design e operação',
    html: `<style>
.vpc-cs{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:18px;color:#e2e8f0;font-size:10.5px}
.vpc-cs-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.vpc-cs-section{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px}
.vpc-cs-h{font-size:10px;font-weight:700;color:#4A90E2;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;font-family:'Space Grotesk',sans-serif}
.vpc-cs-line{padding:3px 0;border-bottom:1px dashed #334155;display:flex;justify-content:space-between;gap:10px}
.vpc-cs-line:last-child{border-bottom:none}
.vpc-cs-key{color:#94a3b8;flex-shrink:0}
.vpc-cs-val{color:#e2e8f0;text-align:right}
.vpc-cs-bad{color:#f87171}
.vpc-cs-good{color:#4ade80}
.vpc-cs-warn{color:#fbbf24}
</style>
<div class="vpc-cs">
<div class="vpc-cs-grid">
  <div class="vpc-cs-section">
    <div class="vpc-cs-h">CIDR planning</div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">VPC padrão</span><span class="vpc-cs-val">/16 (65k IPs)</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Subnet padrão</span><span class="vpc-cs-val">/24 (256, 251 úteis)</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">AWS reserva</span><span class="vpc-cs-val">5 IPs/subnet</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">RFC 1918</span><span class="vpc-cs-val">10/8 · 172.16/12 · 192.168/16</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Multi-conta</span><span class="vpc-cs-val vpc-cs-warn">/16 não-overlap</span></div>
  </div>
  <div class="vpc-cs-section">
    <div class="vpc-cs-h">Subnet pública vs privada</div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Pública</span><span class="vpc-cs-val">RT: 0.0.0.0/0 → IGW</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Privada (saída)</span><span class="vpc-cs-val">RT: 0.0.0.0/0 → NAT</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Privada isolada</span><span class="vpc-cs-val">RT: só local</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">IP público</span><span class="vpc-cs-val">auto-assign OU EIP</span></div>
  </div>
  <div class="vpc-cs-section">
    <div class="vpc-cs-h">Security Group (stateful, ENI)</div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Default in</span><span class="vpc-cs-val vpc-cs-bad">deny tudo</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Default out</span><span class="vpc-cs-val vpc-cs-good">allow tudo</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Tipo</span><span class="vpc-cs-val">Allow only</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Source</span><span class="vpc-cs-val">CIDR ou outro SG</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Limite</span><span class="vpc-cs-val">60 in + 60 out</span></div>
  </div>
  <div class="vpc-cs-section">
    <div class="vpc-cs-h">NACL (stateless, subnet)</div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Default</span><span class="vpc-cs-val vpc-cs-good">allow all</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Avaliação</span><span class="vpc-cs-val">rule_number asc</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Tipo</span><span class="vpc-cs-val">Allow ou Deny</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Resposta</span><span class="vpc-cs-val vpc-cs-warn">allow 1024-65535</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Quando usar</span><span class="vpc-cs-val">block IP malicioso</span></div>
  </div>
  <div class="vpc-cs-section">
    <div class="vpc-cs-h">Conectividade</div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Peering</span><span class="vpc-cs-val">2-5 VPCs, não transitivo</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Transit Gateway</span><span class="vpc-cs-val">5+ VPCs, transitivo</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">VPN</span><span class="vpc-cs-val">IPsec, ~1 Gbps</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Direct Connect</span><span class="vpc-cs-val">link físico, baixa latência</span></div>
  </div>
  <div class="vpc-cs-section">
    <div class="vpc-cs-h">VPC Endpoints</div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Gateway</span><span class="vpc-cs-val vpc-cs-good">S3 + DynamoDB grátis</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Interface</span><span class="vpc-cs-val">~$0.01/h por AZ + $/GB</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">Cobertos</span><span class="vpc-cs-val">SSM · KMS · ECR · Secrets</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">PrivateLink</span><span class="vpc-cs-val">SaaS terceiros</span></div>
  </div>
  <div class="vpc-cs-section">
    <div class="vpc-cs-h">Regras de ouro</div>
    <div class="vpc-cs-line"><span class="vpc-cs-good">✓</span><span>SSM Session Manager &gt; bastion</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-good">✓</span><span>NAT GW por AZ (HA)</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-good">✓</span><span>Flow Logs sempre</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-good">✓</span><span>Gateway Endpoint para S3</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-bad">✗</span><span>SSH 22 0.0.0.0/0</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-bad">✗</span><span>Default VPC em produção</span></div>
  </div>
  <div class="vpc-cs-section">
    <div class="vpc-cs-h">Diagnóstico — "não responde"</div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">1.</span><span>SG inbound</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">2.</span><span>NACL in + out</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">3.</span><span>Route table 0.0.0.0/0</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">4.</span><span>IP público / EIP</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">5.</span><span>OS firewall (iptables)</span></div>
    <div class="vpc-cs-line"><span class="vpc-cs-key">6.</span><span>App ouvindo (ss -lntp)</span></div>
  </div>
</div>
</div>`,
  },
  mindmap: {
    title: 'VPC — mapa do ecossistema',
    html: `<style>
.vpc-mm{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0;font-size:11px}
.vpc-mm-center{display:flex;justify-content:center;margin-bottom:16px}
.vpc-mm-core{background:#4A90E2;color:#fff;padding:10px 22px;border-radius:8px;font-weight:700;letter-spacing:.05em}
.vpc-mm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.vpc-mm-cat{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:12px;border-top:3px solid var(--cat-color)}
.vpc-mm-cat-h{font-size:11px;font-weight:700;margin-bottom:8px;color:var(--cat-color);letter-spacing:.05em;text-transform:uppercase}
.vpc-mm-item{font-size:10px;padding:3px 0;color:#cbd5e1}
.vpc-mm-item strong{color:#e2e8f0}
.vpc-mm-item small{color:#64748b;display:block;font-size:9px;font-style:italic}
</style>
<div class="vpc-mm">
<div class="vpc-mm-center">
  <div class="vpc-mm-core">VPC — Virtual Private Cloud</div>
</div>
<div class="vpc-mm-grid">
  <div class="vpc-mm-cat" style="--cat-color:#4ade80">
    <div class="vpc-mm-cat-h">Componentes Core</div>
    <div class="vpc-mm-item"><strong>VPC</strong><small>CIDR /16, isolamento de rede</small></div>
    <div class="vpc-mm-item"><strong>Subnet</strong><small>/24, vinculada a 1 AZ</small></div>
    <div class="vpc-mm-item"><strong>Route Table</strong><small>longest prefix match</small></div>
    <div class="vpc-mm-item"><strong>Internet Gateway</strong><small>bidirecional, grátis</small></div>
    <div class="vpc-mm-item"><strong>NAT Gateway</strong><small>saída privada, $/h + $/GB</small></div>
    <div class="vpc-mm-item"><strong>Egress-Only IGW</strong><small>NAT para IPv6, grátis</small></div>
  </div>
  <div class="vpc-mm-cat" style="--cat-color:#f87171">
    <div class="vpc-mm-cat-h">Segurança</div>
    <div class="vpc-mm-item"><strong>Security Group</strong><small>stateful, ENI, allow only</small></div>
    <div class="vpc-mm-item"><strong>NACL</strong><small>stateless, subnet, allow+deny</small></div>
    <div class="vpc-mm-item"><strong>Flow Logs</strong><small>metadados, S3/CloudWatch</small></div>
    <div class="vpc-mm-item"><strong>SSM Session Manager</strong><small>substitui bastion+SSH</small></div>
    <div class="vpc-mm-item"><strong>VPC Endpoint Policy</strong><small>defense in depth</small></div>
    <div class="vpc-mm-item"><strong>Network Firewall</strong><small>L7 stateful, custo alto</small></div>
  </div>
  <div class="vpc-mm-cat" style="--cat-color:#a78bfa">
    <div class="vpc-mm-cat-h">Conectividade</div>
    <div class="vpc-mm-item"><strong>VPC Peering</strong><small>2-5 VPCs, não transitivo</small></div>
    <div class="vpc-mm-item"><strong>Transit Gateway</strong><small>hub central, transitivo</small></div>
    <div class="vpc-mm-item"><strong>Site-to-Site VPN</strong><small>IPsec sobre internet</small></div>
    <div class="vpc-mm-item"><strong>Direct Connect</strong><small>link físico dedicado</small></div>
    <div class="vpc-mm-item"><strong>Client VPN</strong><small>OpenVPN gerenciado</small></div>
  </div>
  <div class="vpc-mm-cat" style="--cat-color:#38bdf8">
    <div class="vpc-mm-cat-h">DNS</div>
    <div class="vpc-mm-item"><strong>Route 53 Resolver</strong><small>x.x.x.2 dentro da VPC</small></div>
    <div class="vpc-mm-item"><strong>enableDnsSupport</strong><small>resolução interna</small></div>
    <div class="vpc-mm-item"><strong>enableDnsHostnames</strong><small>hostnames públicos</small></div>
    <div class="vpc-mm-item"><strong>Resolver Endpoints</strong><small>inbound/outbound on-prem</small></div>
    <div class="vpc-mm-item"><strong>Private Hosted Zones</strong><small>split-horizon DNS</small></div>
    <div class="vpc-mm-item"><strong>DHCP Options Set</strong><small>DNS custom, NTP</small></div>
  </div>
  <div class="vpc-mm-cat" style="--cat-color:#fbbf24">
    <div class="vpc-mm-cat-h">Endpoints</div>
    <div class="vpc-mm-item"><strong>Gateway Endpoint</strong><small>S3 + DynamoDB grátis</small></div>
    <div class="vpc-mm-item"><strong>Interface Endpoint</strong><small>PrivateLink, ENI</small></div>
    <div class="vpc-mm-item"><strong>Endpoint Service</strong><small>expor seu serviço</small></div>
    <div class="vpc-mm-item"><strong>Endpoint Policy</strong><small>limita buckets/recursos</small></div>
  </div>
  <div class="vpc-mm-cat" style="--cat-color:#ec4899">
    <div class="vpc-mm-cat-h">Endereçamento</div>
    <div class="vpc-mm-item"><strong>CIDR Block</strong><small>/16 primário, secundários</small></div>
    <div class="vpc-mm-item"><strong>IPv6 dual-stack</strong><small>sempre público</small></div>
    <div class="vpc-mm-item"><strong>Elastic IP</strong><small>$0.005/h se ocioso</small></div>
    <div class="vpc-mm-item"><strong>ENI</strong><small>Elastic Network Interface</small></div>
    <div class="vpc-mm-item"><strong>Secondary IPs</strong><small>múltiplos IPs por ENI</small></div>
  </div>
  <div class="vpc-mm-cat" style="--cat-color:#10b981">
    <div class="vpc-mm-cat-h">Design Patterns</div>
    <div class="vpc-mm-item"><strong>3-tier Multi-AZ</strong><small>pub/app/db × 3 AZs</small></div>
    <div class="vpc-mm-item"><strong>Hub-Spoke (TGW)</strong><small>centralizado</small></div>
    <div class="vpc-mm-item"><strong>Shared Services VPC</strong><small>DNS, Active Directory</small></div>
    <div class="vpc-mm-item"><strong>Egress VPC</strong><small>NAT centralizado</small></div>
    <div class="vpc-mm-item"><strong>Inspection VPC</strong><small>Network Firewall central</small></div>
  </div>
  <div class="vpc-mm-cat" style="--cat-color:#f59e0b">
    <div class="vpc-mm-cat-h">Observabilidade</div>
    <div class="vpc-mm-item"><strong>Flow Logs</strong><small>5-tuple + ação</small></div>
    <div class="vpc-mm-item"><strong>Reachability Analyzer</strong><small>simulador de rota</small></div>
    <div class="vpc-mm-item"><strong>Network Manager</strong><small>visualizar TGW topology</small></div>
    <div class="vpc-mm-item"><strong>VPC Lattice</strong><small>service mesh AWS</small></div>
  </div>
  <div class="vpc-mm-cat" style="--cat-color:#8b5cf6">
    <div class="vpc-mm-cat-h">Anti-patterns</div>
    <div class="vpc-mm-item"><strong>Default VPC em prod</strong><small>configurações inseguras</small></div>
    <div class="vpc-mm-item"><strong>SSH 22 público</strong><small>vetor #1 de ataque</small></div>
    <div class="vpc-mm-item"><strong>NAT GW único</strong><small>SPOF</small></div>
    <div class="vpc-mm-item"><strong>VPC /28</strong><small>sem espaço para crescer</small></div>
    <div class="vpc-mm-item"><strong>EIP esquecido</strong><small>cobra ocioso</small></div>
  </div>
</div>
</div>`,
  },
  exercises: [
    {
      level: 'iniciante',
      title: 'Construir VPC 3-tier multi-AZ com Terraform',
      description: 'Crie uma VPC /16 com 2 AZs, cada AZ com 1 subnet pública (/24) e 1 privada (/24). Anexe um IGW. Crie 2 NAT Gateways (um por AZ). Configure route tables: pública aponta 0.0.0.0/0 → IGW; cada privada aponta 0.0.0.0/0 para o NAT da própria AZ. Provisione uma instância EC2 em cada subnet privada e valide que ela acessa internet via NAT mas não recebe conexão de fora.',
      concepts: ['VPC', 'subnets', 'route tables', 'IGW', 'NAT Gateway', 'multi-AZ', 'Terraform'],
      hint: 'Use o módulo terraform-aws-modules/vpc/aws — ele já implementa esse padrão. Foque em entender o que ele cria, não em escrever do zero.',
    },
    {
      level: 'intermediario',
      title: 'Padrão 3-tier de Security Groups com referências cruzadas',
      description: 'Crie 3 Security Groups: sg-alb (inbound 80/443 de 0.0.0.0/0), sg-app (inbound 8080 com source = sg-alb), sg-rds (inbound 5432 com source = sg-app). Atribua a um ALB, instâncias EC2 e um RDS PostgreSQL. Confirme que: (a) ALB recebe HTTPS público; (b) tráfego do ALB chega ao app; (c) app conecta ao RDS; (d) tentativa de conectar ao RDS direto da internet falha; (e) tentativa do ALB de conectar ao RDS falha (não deveria, mas valida o pattern).',
      concepts: ['Security Groups', 'SG referencing', 'stateful', '3-tier architecture', 'least privilege'],
      hint: 'Use authorize-security-group-ingress --source-group sg-xxx em vez de --cidr. Esse pattern (SG → SG) é o padrão de produção sênior.',
    },
    {
      level: 'intermediario',
      title: 'Investigar conectividade quebrada com Flow Logs',
      description: 'Em uma VPC com EC2 em subnet privada que deveria acessar S3, simule um bug: configure NACL custom que bloqueia portas efêmeras de saída (allow apenas 1-1023). Habilite Flow Logs com destino CloudWatch Logs. Tente fazer aws s3 ls da instância. Use Logs Insights query para identificar pacotes REJECT, identificar a porta efêmera bloqueada e a regra NACL responsável. Corrija a NACL.',
      concepts: ['Flow Logs', 'CloudWatch Logs Insights', 'NACL stateless', 'portas efêmeras', 'troubleshooting'],
      hint: 'Logs Insights query: filter action="REJECT" | stats count() by srcAddr, dstAddr, dstPort | sort count desc. Portas efêmeras Linux: 32768-60999.',
    },
    {
      level: 'senior',
      title: 'Reduzir custo de NAT eliminando tráfego para S3',
      description: 'Em produção com 3 NAT Gateways processando 5 TB/mês para S3 (~$225/mês de processamento de NAT), implemente Gateway Endpoint para S3. Compare o custo antes/depois via Cost Explorer (filtro por NAT processing bytes). Crie endpoint policy restringindo acesso a APENAS os buckets da org (Resource: arn:aws:s3:::myorg-*). Valide via Flow Logs que tráfego S3 não passa mais pelo NAT.',
      concepts: ['VPC Endpoints', 'Gateway Endpoint', 'Endpoint Policy', 'cost optimization', 'NAT GW'],
      hint: 'Gateway Endpoint é gratuito. Endpoint Policy é JSON IAM-like com Principal/Action/Resource — sempre adicione Effect: Deny para Resource não-aprovado para impedir exfiltration.',
    },
    {
      level: 'senior',
      title: 'Migrar arquitetura de peering para Transit Gateway',
      description: 'Você tem 8 VPCs com peering full-mesh (28 conexões) que ficou inviável. Desenhe a migração para Transit Gateway: crie TGW central, anexe cada VPC, configure route tables do TGW (uma por ambiente — prod, staging, dev — com rotas cross-environment proibidas), atualize route tables de cada VPC apontando outros CIDRs para o TGW, remova peerings em fases. Garanta zero downtime: (1) adicionar TGW, (2) propagar rotas, (3) validar conectividade, (4) remover peering antigo.',
      concepts: ['Transit Gateway', 'TGW route tables', 'segmentação por ambiente', 'migração zero-downtime', 'peering'],
      hint: 'TGW route tables permitem isolamento por ambiente: uma rota table para prod (associa só VPCs prod, propaga só CIDRs prod), separadas de dev. Replicar segurança que peering separado dava.',
    },
  ],
  codeExamples: [
    {
      title: 'VPC 3-tier multi-AZ completa em Terraform',
      language: 'hcl',
      code: `locals {
  vpc_cidr = "10.0.0.0/16"
  azs      = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

resource "aws_vpc" "main" {
  cidr_block           = local.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = { Name = "prod-vpc" }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "prod-igw" }
}

# Subnets públicas (1 por AZ)
resource "aws_subnet" "public" {
  for_each                = toset(local.azs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.\${index(local.azs, each.value)}.0/24"
  availability_zone       = each.value
  map_public_ip_on_launch = true
  tags = {
    Name = "public-\${each.value}"
    Tier = "public"
  }
}

# Subnets de aplicação (privadas, com NAT)
resource "aws_subnet" "app" {
  for_each          = toset(local.azs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.\${10 + index(local.azs, each.value)}.0/24"
  availability_zone = each.value
  tags = {
    Name = "app-\${each.value}"
    Tier = "app"
  }
}

# Subnets de banco (privadas isoladas)
resource "aws_subnet" "db" {
  for_each          = toset(local.azs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.\${20 + index(local.azs, each.value)}.0/24"
  availability_zone = each.value
  tags = {
    Name = "db-\${each.value}"
    Tier = "db"
  }
}

# Elastic IPs para NAT (1 por AZ)
resource "aws_eip" "nat" {
  for_each = toset(local.azs)
  domain   = "vpc"
  tags     = { Name = "nat-eip-\${each.value}" }
}

# NAT Gateways (1 por AZ — HA + evita cross-AZ)
resource "aws_nat_gateway" "nat" {
  for_each      = toset(local.azs)
  allocation_id = aws_eip.nat[each.key].id
  subnet_id     = aws_subnet.public[each.key].id
  tags          = { Name = "nat-\${each.value}" }
  depends_on    = [aws_internet_gateway.igw]
}

# Route table pública (compartilhada — todas as subnets pub apontam pro mesmo IGW)
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = { Name = "rt-public" }
}

resource "aws_route_table_association" "public" {
  for_each       = toset(local.azs)
  subnet_id      = aws_subnet.public[each.key].id
  route_table_id = aws_route_table.public.id
}

# Route tables privadas (uma por AZ — aponta pro NAT da própria AZ)
resource "aws_route_table" "private" {
  for_each = toset(local.azs)
  vpc_id   = aws_vpc.main.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat[each.key].id
  }
  tags = { Name = "rt-private-\${each.value}" }
}

resource "aws_route_table_association" "app" {
  for_each       = toset(local.azs)
  subnet_id      = aws_subnet.app[each.key].id
  route_table_id = aws_route_table.private[each.key].id
}

# DBs sem rota para NAT — totalmente isoladas
resource "aws_route_table" "db" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "rt-db-isolated" }
}

resource "aws_route_table_association" "db" {
  for_each       = toset(local.azs)
  subnet_id      = aws_subnet.db[each.key].id
  route_table_id = aws_route_table.db.id
}

# VPC Flow Logs para auditoria
resource "aws_flow_log" "main" {
  vpc_id          = aws_vpc.main.id
  traffic_type    = "ALL"
  log_destination = aws_s3_bucket.flow_logs.arn
  log_destination_type = "s3"
}`,
    },
    {
      title: 'Security Groups em padrão 3-tier (SG referencing)',
      language: 'hcl',
      code: `# ─── ALB — recebe tráfego público ───────────────────────────────
resource "aws_security_group" "alb" {
  name        = "alb-public"
  description = "ALB público — HTTPS da internet"
  vpc_id      = aws_vpc.main.id
}

resource "aws_vpc_security_group_ingress_rule" "alb_https" {
  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
  description       = "HTTPS público"
}

# Outbound: SG default permite tudo, mas seja explícito em produção
resource "aws_vpc_security_group_egress_rule" "alb_to_app" {
  security_group_id            = aws_security_group.alb.id
  referenced_security_group_id = aws_security_group.app.id
  from_port                    = 8080
  to_port                      = 8080
  ip_protocol                  = "tcp"
}

# ─── App — recebe SOMENTE do ALB ────────────────────────────────
resource "aws_security_group" "app" {
  name        = "app-tier"
  description = "Aplicação — só recebe do ALB"
  vpc_id      = aws_vpc.main.id
}

# Pattern crítico: source = SG ID do ALB, não CIDR
resource "aws_vpc_security_group_ingress_rule" "app_from_alb" {
  security_group_id            = aws_security_group.app.id
  referenced_security_group_id = aws_security_group.alb.id
  from_port                    = 8080
  to_port                      = 8080
  ip_protocol                  = "tcp"
  description                  = "Só do ALB — proteção contra movimento lateral"
}

resource "aws_vpc_security_group_egress_rule" "app_to_rds" {
  security_group_id            = aws_security_group.app.id
  referenced_security_group_id = aws_security_group.rds.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "app_internet" {
  security_group_id = aws_security_group.app.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
  description       = "HTTPS para APIs externas via NAT"
}

# ─── RDS — recebe SOMENTE da app ────────────────────────────────
resource "aws_security_group" "rds" {
  name        = "rds-private"
  description = "RDS isolado — só app pode conectar"
  vpc_id      = aws_vpc.main.id
}

resource "aws_vpc_security_group_ingress_rule" "rds_from_app" {
  security_group_id            = aws_security_group.rds.id
  referenced_security_group_id = aws_security_group.app.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
  description                  = "PostgreSQL só da app tier"
}

# ─── Bastion? NÃO. Use SSM Session Manager ──────────────────────
# Anexar a Role abaixo nas instâncias e acessar via:
# aws ssm start-session --target i-xxx
resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.app_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}`,
    },
    {
      title: 'Gateway Endpoint para S3 com policy restritiva',
      language: 'hcl',
      code: `# Gateway Endpoint — gratuito, só para S3 e DynamoDB
# Tráfego para S3 nunca sai da AWS — economia direta de NAT
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.\${var.region}.s3"
  vpc_endpoint_type = "Gateway"

  # Associar a TODAS as route tables privadas — adiciona rota
  # implícita pl-63a5400a → vpce-s3-xxx em cada uma
  route_table_ids = [
    for rt in aws_route_table.private : rt.id
  ]

  # Endpoint Policy — defense in depth contra exfiltration
  # Mesmo que a aplicação tenha credenciais válidas, ela só pode
  # acessar buckets explicitamente permitidos via este endpoint
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = ["s3:GetObject", "s3:PutObject", "s3:ListBucket"]
        Resource = [
          "arn:aws:s3:::myorg-prod-data",
          "arn:aws:s3:::myorg-prod-data/*",
          "arn:aws:s3:::myorg-prod-logs",
          "arn:aws:s3:::myorg-prod-logs/*",
        ]
      },
      # Bloqueio explícito — qualquer outro bucket via este endpoint falha
      {
        Effect    = "Deny"
        Principal = "*"
        NotAction = ["s3:GetObject", "s3:PutObject", "s3:ListBucket"]
        Resource  = "*"
      },
    ]
  })

  tags = { Name = "vpce-s3-prod" }
}

# Bucket policy que EXIGE acesso via VPC Endpoint
# (impede que credenciais vazadas funcionem fora da VPC)
resource "aws_s3_bucket_policy" "data" {
  bucket = "myorg-prod-data"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          "arn:aws:s3:::myorg-prod-data",
          "arn:aws:s3:::myorg-prod-data/*",
        ]
        Condition = {
          StringNotEquals = {
            "aws:SourceVpce" = aws_vpc_endpoint.s3.id
          }
        }
      },
    ]
  })
}

# Interface Endpoints para outros serviços (pagos)
# SSM, KMS, Secrets Manager — eliminam saída pelo NAT
locals {
  interface_endpoints = [
    "ssm", "ssmmessages", "ec2messages",
    "kms", "secretsmanager",
    "ecr.api", "ecr.dkr",
    "logs", "monitoring",
  ]
}

resource "aws_vpc_endpoint" "interface" {
  for_each            = toset(local.interface_endpoints)
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.\${var.region}.\${each.key}"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = [for s in aws_subnet.app : s.id]
  security_group_ids  = [aws_security_group.vpce.id]
  private_dns_enabled = true

  tags = { Name = "vpce-\${each.key}" }
}`,
    },
  ],
  gotchas: [
    'Subnet com rota para IGW NÃO é automaticamente pública — o recurso também precisa de IP público (auto-assign na subnet OU Elastic IP).',
    'NACL é stateless — esquecer de permitir saída em portas efêmeras (1024-65535) é a causa #1 de "EC2 não responde" depois de configurar NACL custom.',
    'Um NAT Gateway por região (não por AZ) cria single point of failure E cobra tráfego cross-AZ — sempre 1 NAT por AZ com route table separada.',
    'VPC Peering NÃO é transitivo — A↔B e B↔C não cria A↔C. Para conectar muitos VPCs use Transit Gateway.',
    'CIDR /28 ou /27 em VPC parece econômico mas paga depois — VPC /16 com subnets /24 é o padrão por uma razão.',
    'Default VPC em produção é antipattern — configurações default permitem tudo, sem segmentação. Sempre crie VPC explícita.',
    'Elastic IP não associado cobra $0.005/h — fonte clássica de cost leak após delete de instância sem release de EIP.',
    'enableDnsHostnames default é false em VPC criada via API — instâncias com IP público não recebem DNS público até habilitar.',
    'Interface Endpoint cobra POR AZ — endpoint "ssm" replicado em 3 AZs = 3× $0.01/h. Calcule antes de espalhar por todas as subnets.',
    'NAT Gateway tem limite de 55k conexões simultâneas POR DESTINO — pode aparecer como timeout em apps que fazem muitas requests pro mesmo endpoint externo.',
    'SG attached a Lambda em VPC e Lambda em subnet privada precisam de NAT GW para internet — sem NAT, Lambda não chega à internet.',
    'Route table tem precedência por prefixo MAIS ESPECÍFICO — uma rota /24 vence sobre /16, que vence sobre /0. Isso causa surpresas em peering com CIDRs sobrepostos.',
  ],
  interview: [
    {
      level: 'pleno',
      q: 'Diferença entre Security Group e NACL?',
      a: '<p><strong>Security Group:</strong> stateful, no nível de instância/ENI. Apenas Allow (sem Deny). Resposta de conexão autorizada entra automaticamente sem regra de retorno. Pode referenciar outros SGs (source = sg-alb).</p><p><strong>NACL:</strong> stateless, no nível de subnet. Suporta Allow E Deny. Regras avaliadas por número crescente. A resposta precisa de regra explícita para portas efêmeras (1024-65535).</p><p>Na prática: use SG para 99% dos casos. NACL como guardrail de subnet para bloquear IPs/ranges específicos no perímetro (defense in depth, compliance).</p>',
      tip: 'A resposta sênior sempre menciona stateful vs stateless como a diferença fundamental — não apenas o nível (instância vs subnet).',
    },
    {
      level: 'pleno',
      q: 'O que torna uma subnet pública vs privada?',
      a: '<p>NÃO é um flag — é a <strong>route table</strong> associada à subnet:</p><ul><li><strong>Pública:</strong> route table tem 0.0.0.0/0 → IGW, E o recurso recebe IP público (auto-assign na subnet ou Elastic IP)</li><li><strong>Privada com saída:</strong> route table tem 0.0.0.0/0 → NAT Gateway. Pode iniciar conexão para internet, mas internet não inicia conexão para ela</li><li><strong>Privada isolada:</strong> sem rota 0.0.0.0/0. Só comunica dentro da VPC. Padrão para subnet de banco</li></ul><p>Erro comum: criar subnet com rota IGW mas instância sem IP público — não acessa nada.</p>',
      tip: 'A pegadinha clássica: "minha subnet tem rota IGW mas a instância não acessa". Resposta: faltou IP público — auto-assign na subnet ou EIP.',
    },
    {
      level: 'pleno',
      q: 'Quando usar VPC Endpoints?',
      a: '<p>Sempre que recursos em subnet privada acessam serviços AWS — evita tráfego pelo NAT (segurança + custo).</p><p><strong>Gateway Endpoint:</strong> APENAS S3 e DynamoDB. Gratuito. Adiciona rota implícita na route table. Sempre vale a pena.</p><p><strong>Interface Endpoint (PrivateLink):</strong> outros serviços AWS (SSM, KMS, Secrets Manager, ECR, CloudWatch Logs) e SaaS de terceiros. Cria ENI privada. Custo ~$0.01/h por endpoint por AZ + $/GB. Justifica quando o tráfego seria caro pelo NAT ou quando compliance exige sem-internet.</p><p><strong>Bônus:</strong> Endpoint Policy permite restringir quais buckets/recursos podem ser acessados pelo endpoint — defense in depth contra data exfiltration.</p>',
      tip: 'Mencione Endpoint Policy como ferramenta de segurança, não só de conectividade — é o que diferencia "usei endpoints" de "entendo endpoints".',
    },
    {
      level: 'pleno',
      q: 'Por que ter um NAT Gateway por AZ?',
      a: '<p>Dois motivos:</p><ul><li><strong>HA:</strong> NAT Gateway é altamente disponível DENTRO de uma AZ, mas se a AZ inteira falhar, todas as subnets que apontam para esse NAT perdem internet. Um NAT por AZ + route table apontando para o NAT da própria AZ garante que falha de AZ não derruba as outras.</li><li><strong>Custo:</strong> tráfego cross-AZ é cobrado ($0.01/GB cada lado). Se todas as subnets privadas apontam para um NAT em us-east-1a, instâncias em 1b e 1c pagam cross-AZ ida + volta. Um NAT por AZ elimina esse custo.</li></ul><p>Trade-off: 3 NAT GWs custam ~$100/mês cada idle. Para ambiente dev de baixo volume, um NAT global pode ser aceitável conscientemente.</p>',
      tip: 'A resposta sênior mostra trade-off econômico explícito: HA + economia cross-AZ vs custo de múltiplos NATs.',
    },
    {
      level: 'pleno',
      q: 'Como funciona o roteamento dentro de uma VPC?',
      a: '<p>Cada subnet tem UMA route table associada. A route table define para onde vai o tráfego por destino CIDR:</p><ul><li><code>10.0.0.0/16 → local</code> (tráfego dentro da VPC, sempre presente, não removível)</li><li><code>0.0.0.0/0 → igw-xxx</code> → subnet pública</li><li><code>0.0.0.0/0 → nat-xxx</code> → subnet privada</li><li><code>10.1.0.0/16 → pcx-xxx</code> → peering com outra VPC</li><li><code>pl-63a5400a → vpce-s3-xxx</code> → Gateway Endpoint para S3</li></ul><p><strong>Longest prefix match:</strong> rota mais específica vence (10.0.5.0/24 vence sobre 10.0.0.0/16, que vence sobre 0.0.0.0/0).</p><p>Subnets sem associação explícita usam a "main route table" da VPC.</p>',
      tip: 'Mencionar longest prefix match e prefix lists demonstra entendimento real de roteamento — vai além de "0.0.0.0/0 → IGW".',
    },
    {
      level: 'pleno',
      q: 'Como desenharia a rede para uma aplicação 3-tier?',
      a: '<p><strong>Subnets públicas (3 AZs):</strong> ALB e NAT Gateway. Sem instâncias de aplicação aqui.</p><p><strong>Subnets privadas de aplicação (3 AZs):</strong> EC2 ou tasks ECS. Saída via NAT GW da própria AZ. Inbound apenas do ALB (SG source = sg-alb).</p><p><strong>Subnets privadas de banco (3 AZs):</strong> RDS Multi-AZ. Sem rota para NAT — completamente isoladas. Inbound apenas do SG da app.</p><p><strong>Adicionalmente:</strong> Gateway Endpoint para S3 e Interface Endpoints para SSM/KMS/Secrets Manager. Flow Logs em S3 com Athena para queries. NACLs default (allow all). Security Groups em cascata: sg-alb → sg-app → sg-rds.</p>',
      tip: 'A resposta sênior sempre menciona 3 AZs (não 2) e SG referencing (sg-app source = sg-alb) em vez de CIDRs. Mostra hands-on real.',
    },
    {
      level: 'senior',
      q: 'VPC Peering vs Transit Gateway vs VPN vs Direct Connect — quando usar cada?',
      a: '<p><strong>VPC Peering:</strong> conexão direta entre 2 VPCs. Sem custo por hora, só por dados. Não transitivo. Bom para 2-5 VPCs. Acima disso, full-mesh fica inviável (N×(N-1)/2).</p><p><strong>Transit Gateway (TGW):</strong> hub central transitivo. Conecta dezenas de VPCs e on-premises (VPN/DX). Custa $0.05/h por attachment + $/GB. Justifica acima de ~5 VPCs ou quando precisa de roteamento centralizado, segmentação por ambiente via TGW route tables.</p><p><strong>Site-to-Site VPN:</strong> IPsec sobre internet pública. ~1-1.25 Gbps por túnel (use ECMP para múltiplos túneis). Latência variável. Ideal para conectividade rápida com on-premises sem investir em infra física.</p><p><strong>Direct Connect:</strong> link físico dedicado (1-100 Gbps) entre datacenter cliente e AWS. Latência baixa e previsível. Caro mas necessário para workloads sensíveis (alta volume, baixa latência, compliance).</p><p><strong>Combinação real:</strong> Direct Connect como primário + VPN como backup. TGW conecta DX gateway + VPN + VPCs. Roteamento por prioridade de path.</p>',
      tip: 'Mencionar TGW route tables (segmentação por ambiente) e DX + VPN backup pattern demonstra experiência de produção, não só leitura de docs.',
    },
    {
      level: 'senior',
      q: 'Como investigaria "EC2 não responde" em uma subnet privada?',
      a: '<p>Checklist sequencial:</p><ol><li><strong>Security Group inbound:</strong> permite o protocolo+porta vindo da origem certa? Source = SG ou CIDR correto?</li><li><strong>NACL da subnet:</strong> allow inbound + outbound (porta efêmera 1024-65535)? Stateless: ambos lados.</li><li><strong>Route Table:</strong> tem rota para o destino? 0.0.0.0/0 aponta para NAT (saída) ou IGW (pública)?</li><li><strong>Public IP:</strong> instância tem IP público auto-atribuído ou EIP associado? (irrelevante para subnet privada)</li><li><strong>OS firewall:</strong> iptables, ufw, nftables, security-enhanced bloqueando? <code>aws ssm start-session --target i-xxx</code> para debugar.</li><li><strong>App ouvindo:</strong> <code>ss -lntp</code> mostra app em 0.0.0.0:porta ou só 127.0.0.1?</li></ol><p><strong>Ferramenta sênior:</strong> AWS VPC Reachability Analyzer simula o caminho do pacote e diz exatamente onde foi bloqueado. Resolve em segundos o que checklist manual leva minutos.</p>',
      tip: 'Mencionar Reachability Analyzer eleva a resposta — muitos sêniores ainda não conhecem essa ferramenta da AWS, lançada em 2020.',
    },
    {
      level: 'senior',
      q: 'O que são VPC Flow Logs e como usaria em investigação de incidente?',
      a: '<p>Flow Logs capturam metadados de tráfego IP em ENI, subnet ou VPC inteiro: timestamp, source/dest IP+porta, protocolo, bytes, ação (ACCEPT/REJECT). NÃO captura conteúdo do pacote.</p><p><strong>Destinos:</strong> CloudWatch Logs (queries em tempo real, custo alto por GB) ou S3 (custo baixo, queries via Athena, retenção longa). Para auditoria/incidente, S3 + Athena é o padrão.</p><p><strong>Em investigação:</strong></p><ul><li>IPs comunicando com C&C conhecidos: <code>SELECT srcaddr, dstaddr WHERE dstaddr IN (...badips)</code></li><li>Port scans: <code>SELECT srcaddr, count(distinct dstport) GROUP BY srcaddr HAVING count(*) > 100</code></li><li>Tráfego saindo da subnet privada que não deveria: <code>WHERE srcaddr LIKE \'10.0.20.%\' AND dstaddr NOT IN (cidrs internos)</code></li><li>Rejects em massa: <code>WHERE action = \'REJECT\' GROUP BY srcaddr</code></li></ul><p>Format v3+ permite campos extras como pkt-srcaddr (útil para tráfego dentro de container/IPv6).</p>',
      tip: 'Citar uma query Athena concreta (não apenas "use Athena") fixa que você fez de verdade. Mencionar format v3 com pkt-srcaddr é nível de profundidade.',
    },
    {
      level: 'senior',
      q: 'Por que usar SSM Session Manager em vez de bastion host?',
      a: '<p><strong>Bastion (padrão antigo):</strong> EC2 em subnet pública com porta 22 aberta. Usuário faz SSH para bastion, depois SSH para instâncias privadas. Problemas: porta 22 exposta na internet (vetor #1 de ataque, brute-force constante), gerência de chaves SSH (rotação, distribuição), bastion vira SPOF, audit limitado a logs do OS.</p><p><strong>SSM Session Manager (padrão moderno):</strong> sem porta aberta, sem chaves SSH, sem bastion. Acesso ao terminal via API SSM, autenticado por IAM (com MFA, SCP organizacional), auditado em CloudTrail. Comando: <code>aws ssm start-session --target i-xxx</code>.</p><p><strong>Requisitos:</strong> SSM Agent na instância (já vem em AMIs Amazon Linux 2/2023, Ubuntu LTS) + IAM Instance Profile com policy AmazonSSMManagedInstanceCore + saída para endpoints SSM (via NAT, IGW, ou Interface Endpoints para reduzir custo).</p><p><strong>Recursos extras:</strong> port forwarding via SSM (acesso a banco privado sem expor SG), session recording em S3 para auditoria.</p>',
      tip: 'Mencionar port forwarding SSM como substituto de "bastion para acessar RDS" demonstra que você sabe usar a ferramenta além do óbvio.',
    },
    {
      level: 'senior',
      q: 'Como projetaria CIDR planning para uma org multi-conta com TGW?',
      a: '<p><strong>Princípios:</strong></p><ol><li><strong>Não-overlap:</strong> cada VPC tem CIDR /16 distinto. Mesmo CIDR em 2 VPCs impede peering/TGW. Reservar 10.0.0.0/8 para AWS, alocar /16 progressivamente: 10.0.0.0/16 (prod), 10.1.0.0/16 (staging), 10.2.0.0/16 (dev), etc.</li><li><strong>Por região:</strong> agrupar por região (10.0-15 = us-east-1, 10.16-31 = eu-west-1) — facilita debugging.</li><li><strong>Por ambiente:</strong> reservar ranges por ambiente (10.0-99 = prod, 10.100-199 = staging) — TGW route tables podem isolar por ambiente.</li><li><strong>On-premises:</strong> coordenar com NetOps interno para evitar overlap com datacenter (172.16.0.0/12 muito usado).</li><li><strong>IPAM (AWS IP Address Manager):</strong> automatizar alocação de CIDRs sem manual tracking. Pools hierárquicos: corp pool /8 → region pool /12 → environment pool /16.</li></ol><p><strong>Anti-pattern crítico:</strong> usar Default VPC (172.31.0.0/16) em produção — se algum dia precisar de peering com on-prem que usa esse range, você está preso.</p>',
      tip: 'Mencionar IPAM (lançado em 2021) é diferencial sênior — mostra que você acompanha lançamentos AWS e pensa em escala.',
    },
    {
      level: 'senior',
      q: 'O que é AWS PrivateLink e como difere de VPC Peering?',
      a: '<p><strong>VPC Peering:</strong> conecta DUAS VPCs inteiras — todas as instâncias de A enxergam todas de B (sujeito a SG/NACL). Acoplamento alto: as VPCs precisam de CIDRs não-overlap, route tables atualizadas, SG references não funcionam cross-account de graça.</p><p><strong>PrivateLink (Interface Endpoints):</strong> expõe um SERVIÇO ESPECÍFICO da VPC produtora como uma ENI privada na VPC consumidora. O consumidor nunca vê o IP do produtor — só o IP da ENI privada (NLB-backed). Vantagens:</p><ul><li><strong>Granularidade:</strong> só o serviço é exposto, não a VPC inteira</li><li><strong>Não exige CIDR não-overlap:</strong> o IP é local na VPC consumidora</li><li><strong>Sem route table updates:</strong> só criar o endpoint</li><li><strong>SaaS:</strong> Datadog, MongoDB Atlas, Snowflake oferecem PrivateLink — consumidor cria endpoint, sem peering</li></ul><p><strong>Quando usar cada:</strong> Peering para integração tight entre VPCs da mesma org. PrivateLink para SaaS, microserviços compartilhados entre contas, exposição de internal API sem peering full.</p>',
      tip: 'Citar caso real (Snowflake/Datadog usam PrivateLink) ancora a resposta. Cair no PrivateLink Gateway Load Balancer (firewall pattern) é nível arquiteto.',
    },
    {
      level: 'senior',
      q: 'Como implementaria uma "egress VPC" centralizada?',
      a: '<p><strong>Problema:</strong> múltiplas VPCs cada uma com seu NAT Gateway = custo multiplicado (3 AZs × N VPCs × $32/mês = caro rápido). Solução: centralizar saída em uma VPC dedicada.</p><p><strong>Arquitetura:</strong></p><ol><li><strong>Egress VPC:</strong> uma VPC com NAT Gateways em cada AZ. Sem aplicação rodando aqui, só é caminho de saída.</li><li><strong>Spoke VPCs:</strong> VPCs de aplicação sem NAT GW próprio.</li><li><strong>Transit Gateway:</strong> conecta egress VPC + spoke VPCs. TGW route table padrão das spokes: 0.0.0.0/0 → TGW. TGW route table da egress: 0.0.0.0/0 → egress VPC attachment.</li><li><strong>Route table da egress VPC:</strong> 0.0.0.0/0 → IGW (saída para internet via NAT).</li><li><strong>NAT Gateway da egress:</strong> em subnet pública com EIP — saída é via esses NATs centralizados.</li></ol><p><strong>Benefícios:</strong> custo 1 conjunto de NATs em vez de N. EIPs estáveis para whitelist de parceiros. Inspeção centralizada (Network Firewall na egress VPC). Logs/audit unificados.</p><p><strong>Trade-offs:</strong> latência adicional do TGW hop. Cobrança por GB no TGW (some ao NAT). Mais complexo de debugar.</p>',
      tip: 'Egress VPC + Network Firewall (L7) é o pattern enterprise. Citar isso em entrevista de SRE/Cloud Architect demonstra senioridade real.',
    },
    {
      level: 'senior',
      q: 'Como auditaria uma VPC para garantir conformidade de segurança?',
      a: '<p>Checklist priorizado:</p><ol><li><strong>SGs com 0.0.0.0/0 em portas críticas:</strong> <code>aws ec2 describe-security-groups</code> + grep porta 22, 3389, 3306. Idealmente bloquear via SCP organizacional.</li><li><strong>Default VPC em produção:</strong> AWS Config rule <code>vpc-default-security-group-closed</code>. Default SG deve ser unused e fechado.</li><li><strong>Flow Logs habilitados:</strong> Config rule <code>vpc-flow-logs-enabled</code>. Sem Flow Logs, incidentes ficam invisíveis.</li><li><strong>Subnets públicas mínimas:</strong> instâncias de aplicação não devem ter IP público. Config rule <code>ec2-instance-no-public-ip</code>.</li><li><strong>NAT GW redundante:</strong> 1 por AZ — verificar via Trusted Advisor.</li><li><strong>VPC Endpoints para serviços sensíveis:</strong> S3, KMS, Secrets Manager via endpoint. Reduz superfície e custo.</li><li><strong>Endpoint Policy restrita:</strong> Gateway Endpoint para S3 com policy limitando buckets aprovados.</li><li><strong>NACLs custom auditadas:</strong> evitar regras conflitantes. Idealmente deixar NACL default e usar SG.</li><li><strong>Reachability Analyzer:</strong> testar caminhos críticos automaticamente em pipeline (ex: aplicação → RDS deve passar; internet → RDS deve falhar).</li></ol><p><strong>Ferramentas:</strong> AWS Config + Conformance Pack (NIST, CIS), Trusted Advisor, AWS Security Hub agregando todos.</p>',
      tip: 'Citar Conformance Pack e nomes específicos de rules Config (não só "use Config") ancora experiência real de hardening.',
    },
    {
      level: 'senior',
      q: 'O que é VPC Lattice e quando usaria?',
      a: '<p>VPC Lattice (lançado 2023) é o service mesh gerenciado da AWS. Substitui parcialmente a complexidade de service mesh (Istio, Linkerd) e API Gateway internos.</p><p><strong>Conceito:</strong> Service Network conecta serviços (HTTP/HTTPS/gRPC) entre VPCs e contas sem peering, sem TGW, sem PrivateLink manual. Cada serviço é registrado, descoberto via DNS interno, com auth IAM, observability automática (CloudWatch), e routing rules (header-based, weighted).</p><p><strong>Quando usar:</strong></p><ul><li>Microserviços spread em múltiplas VPCs/contas que precisam se comunicar</li><li>Quer auth IAM no nível L7 sem implementar JWT/mTLS manual</li><li>Não quer operar service mesh OSS (Istio é complexo)</li><li>Precisa de routing avançado (canary, A/B) sem manter NGINX/Envoy</li></ul><p><strong>Trade-offs:</strong> ainda nascente — features menos maduras que Istio. Vendor lock-in (AWS-only). Custo por request.</p><p><strong>Alternativas:</strong> ALB + API Gateway para inter-service simples. Istio/Linkerd para mesh OSS. App Mesh (também AWS, antecessor parcial do Lattice).</p>',
      tip: 'Acompanhar lançamentos AWS recentes (Lattice é de 2023) e saber posicionar contra Istio é nível arquiteto sênior. Resposta cruamente otimista é ruim — mencione trade-offs.',
    },
    {
      level: 'senior',
      q: 'Como faria troubleshooting de "intermitência de DNS" em uma VPC?',
      a: '<p>Sintoma: aplicação resolve hostname às vezes, falha às vezes. Causas comuns:</p><ol><li><strong>Rate limit do Route 53 Resolver:</strong> 1024 PPS por ENI (não documentado claramente). Apps que fazem DNS lookup em loop apertado batem o limite. Solução: cache DNS local (nscd, systemd-resolved) ou DNS Resolver caching (PrivateDNS endpoint).</li><li><strong>Connection tracking exhaustion no NAT GW:</strong> NAT GW tem limite de 55k conexões POR DESTINO. Se Route 53 Resolver é alcançado via NAT (cenário raro mas possível), pode falhar.</li><li><strong>VPC Endpoint para Route 53 Resolver não habilitado:</strong> em ambiente sem internet, Resolver não funciona — usar Resolver Endpoints inbound/outbound.</li><li><strong>enableDnsHostnames / enableDnsSupport:</strong> desabilitados em VPC criada via API (default false). Habilitar na VPC.</li><li><strong>DHCP Options Set custom:</strong> apontando para DNS on-prem que está intermitente. Resolver de VPC (.2) é mais confiável.</li><li><strong>Resolução split-horizon errada:</strong> Private Hosted Zone associada a VPC mas registro errado. Usar <code>dig +trace</code> para ver caminho.</li></ol><p><strong>Ferramentas:</strong> Route 53 Resolver Query Logging captura todas as queries DNS — habilitar e enviar para CloudWatch Logs.</p>',
      tip: 'Citar o rate limit de 1024 PPS (não é amplamente conhecido) é o tipo de detalhe que diferencia sênior real de júnior estudado. Veio de troubleshooting real.',
    },
    {
      level: 'senior',
      q: 'Como você implementaria um pattern "shared services VPC"?',
      a: '<p><strong>Problema:</strong> cada VPC precisa de DNS interno, Active Directory, license server, monitoring agent registry. Replicar em cada VPC = duplicação. Solução: VPC compartilhada que hospeda esses serviços.</p><p><strong>Arquitetura:</strong></p><ol><li><strong>Shared Services VPC:</strong> hospeda Route 53 Resolver Endpoints (inbound + outbound), Active Directory (Managed AD ou self-managed), license servers, ECR registry mirror, central monitoring (Prometheus federation).</li><li><strong>Conectividade:</strong> Transit Gateway conecta Shared Services VPC + VPCs de aplicação. TGW route table das apps inclui rota para CIDR da Shared Services VPC.</li><li><strong>DNS:</strong> apps configuram outbound Resolver Rules apontando zonas internas (corp.local) para Resolver Endpoints da Shared Services. Tráfego DNS sai pela TGW e volta com resposta.</li><li><strong>SG strategy:</strong> serviços compartilhados expostos por SG nomeado (ex: sg-internal-dns). Apps em outras VPCs não podem referenciar SG cross-VPC sem RAM (Resource Access Manager) — usar CIDRs ou criar SG na própria VPC com source CIDR da Shared Services.</li><li><strong>Audit:</strong> Flow Logs centralizados na Shared Services. Resolver Query Logging para auditoria de DNS.</li></ol><p><strong>Por que vale a pena:</strong> custo, governança, consistency. Por que cuidado: SPOF se mal projetado — replicar Shared Services em múltiplas regiões/AZs.</p>',
      tip: 'O pattern "Shared Services VPC + Egress VPC + Inspection VPC" é a tríade enterprise. Saber descrever os 3 e suas relações é nível Cloud Architect.',
    },
    {
      level: 'senior',
      q: 'Como auditaria custo de uma VPC e quais são os "cost leaks" mais comuns?',
      a: '<p><strong>Cost leaks frequentes:</strong></p><ol><li><strong>NAT Gateway processing fees:</strong> $0.045/GB processado. Se aplicação faz GET intensivo em S3, esse tráfego deveria ir por Gateway Endpoint (gratuito). Auditar via Cost Explorer com filtro <code>UsageType: NatGateway-Bytes</code>.</li><li><strong>Cross-AZ data transfer:</strong> $0.01/GB ida + $0.01/GB volta. Apps mal distribuídas (ALB em AZ-A apontando para EC2 só em AZ-B) pagam ida e volta. ALB cross-zone load balancing pode ajudar.</li><li><strong>Elastic IPs ociosos:</strong> $0.005/h se não associado. Auditar via <code>aws ec2 describe-addresses</code> + alarme em ec2:UnassociatedElasticIPs.</li><li><strong>Interface Endpoints excessivos:</strong> $0.01/h por endpoint POR AZ + $/GB. Endpoints em dev/staging que não justificam custo. Auditar lista de endpoints e desabilitar onde NAT seria mais barato.</li><li><strong>VPN tunnels idle:</strong> $0.05/h por túnel mesmo sem tráfego. Removê-los quando não usados.</li><li><strong>Flow Logs em CloudWatch (não S3):</strong> CloudWatch ingestion é ~$0.50/GB vs $0.023/GB no S3. Para retenção longa, S3 + Athena.</li><li><strong>NAT GW desnecessário:</strong> se só preciso de SSM, KMS, Secrets — Interface Endpoints podem eliminar NAT inteiro.</li></ol><p><strong>Tooling:</strong> Cost Explorer com Resource Tag filters, AWS Cost Anomaly Detection (ML), VPC dashboard de billing.</p>',
      tip: 'Quantificar com números ($0.045/GB, $0.01/h) demonstra que você fez essa otimização de verdade. "Reduz custo" é vago; "$2k/mês economizados via Gateway Endpoint" é convincente.',
    },
    {
      level: 'senior',
      q: 'Quais limites/quotas críticos da VPC você precisa monitorar em escala?',
      a: '<p><strong>Limites soft (aumentáveis via Service Quotas):</strong></p><ul><li><strong>5 VPCs por região por conta:</strong> consumido rápido em multi-projeto. Aumentar para 50-100 antes que vire blocker.</li><li><strong>5 EIPs por região:</strong> NAT GWs consomem (1 cada × N AZs × N VPCs). Famoso por travar Terraform apply.</li><li><strong>200 subnets por VPC:</strong> raro bater, mas em VPC compartilhada multi-tenant pode acontecer.</li><li><strong>2500 SGs por VPC:</strong> apps com microserviços excessivos podem bater.</li><li><strong>60 inbound + 60 outbound rules por SG:</strong> bate em SGs com whitelisting de muitos parceiros — nesse caso, prefix lists.</li></ul><p><strong>Limites hard (não aumentáveis):</strong></p><ul><li><strong>5 CIDRs por VPC (1 primário + 4 secundários):</strong> planejar /16 grande desde o início.</li><li><strong>200 routes por route table:</strong> em hub TGW com muitas VPCs pode bater — consolidar via summary routes.</li><li><strong>NAT GW: 55k conexões por destino + 45 Gbps:</strong> apps com fan-out alto para mesmo endpoint externo podem bater. Mitigar com múltiplos NATs e load balancing client-side.</li><li><strong>1024 PPS por ENI no Route 53 Resolver:</strong> caching DNS é defesa.</li></ul><p><strong>Monitoring:</strong> AWS Service Quotas dashboard + CloudWatch metrics em Trusted Advisor. Alarmar em 80% de qualquer quota crítica.</p>',
      tip: 'Saber NÚMEROS específicos (55k conexões, 1024 PPS, 200 routes) é o que separa "li blog" de "operei em produção". Anotar e revisar antes de entrevista de cloud.',
    },
    {
      level: 'senior',
      q: 'Como projetaria uma estratégia de DR cross-region com VPC?',
      a: '<p>VPCs são regional — não atravessam regiões. Estratégia DR pede infra paralela na região de DR.</p><p><strong>Componentes:</strong></p><ol><li><strong>VPC Mirror em região DR:</strong> mesma topologia (3 AZs × 3 tiers), CIDR diferente para evitar overlap futuro com peering/TGW (ex: prod 10.0.0.0/16 em us-east-1, DR 10.100.0.0/16 em us-west-2).</li><li><strong>Conectividade entre regiões:</strong> VPC Peering inter-region (rota via backbone AWS, sem internet) ou TGW Peering (mais escalável).</li><li><strong>Replicação de dados:</strong> RDS cross-region read replica (promoção em failover), S3 Cross-Region Replication, DynamoDB Global Tables.</li><li><strong>DNS failover:</strong> Route 53 health checks + failover routing policy. Primário responde com IP da região prod; em failure, secundário responde com região DR.</li><li><strong>Estratégia de RTO/RPO:</strong></ul><li>Backup & Restore (RTO horas, RPO horas): snapshots replicados, infra desligada</li><li>Pilot Light (RTO 30min, RPO minutos): infra mínima rodando, dados replicados</li><li>Warm Standby (RTO 10min, RPO segundos): infra completa em escala reduzida</li><li>Multi-Site Active/Active (RTO segundos, RPO ~0): tráfego nas duas regiões via Route 53 latency-based</li></ul></li></ol><p><strong>Pontos cegos:</strong> certificados ACM são regionais (replicar via DNS validation), KMS keys regionais (multi-region keys ou replicar criptografia). IAM é global mas Service Quotas regionais.</p>',
      tip: 'Citar "ACM regional" e "KMS multi-region keys" são pegadinhas que muitos esquecem em DR planning — ancora hands-on real.',
    },
  ],
  videos: [
    { title: 'AWS re:Invent 2023 — Advanced VPC Design and New Capabilities', channel: 'AWS Events', url: 'https://www.youtube.com/watch?v=fnxXNZdf6ew' },
    { title: 'AWS VPC Tutorial — Subnets, Route Tables, NACLs and Security Groups', channel: 'Stephane Maarek', url: 'https://www.youtube.com/watch?v=g2JOHLHh4rI' },
    { title: 'Transit Gateway Deep Dive', channel: 'AWS Online Tech Talks', url: 'https://www.youtube.com/watch?v=kKpZl-mGCRk' },
    { title: 'VPC Endpoints — PrivateLink Deep Dive', channel: 'AWS Online Tech Talks', url: 'https://www.youtube.com/watch?v=mEjB89Y82uI' },
    { title: 'AWS Networking Fundamentals', channel: 'AWS', url: 'https://www.youtube.com/watch?v=hiKPPy584Mg' },
  ],
  resources: [
    { title: 'AWS VPC docs', url: 'https://docs.aws.amazon.com/vpc/', kind: 'docs' },
    { title: 'AWS VPC Reachability Analyzer', url: 'https://docs.aws.amazon.com/vpc/latest/reachability/', kind: 'docs' },
    { title: 'AWS Networking Best Practices', url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/welcome.html', kind: 'docs' },
    { title: 'AWS PrivateLink concepts', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html', kind: 'docs' },
    { title: 'Building secure multi-account architectures', url: 'https://aws.amazon.com/blogs/architecture/building-a-scalable-and-secure-multi-vpc-aws-network-infrastructure/', kind: 'artigo' },
    { title: 'AWS Well-Architected — Networking', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/security-network.html', kind: 'docs' },
    { title: 'terraform-aws-modules/vpc', url: 'https://github.com/terraform-aws-modules/terraform-aws-vpc', kind: 'pratica' },
  ],
}

export default vpc
