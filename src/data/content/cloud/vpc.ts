import type { SkillContent } from '@/types'

const vpc: SkillContent = {
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
}

export default vpc
