'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildSecurityChecklistPdf } from '@/components/pdfs/SecurityChecklistPdf'
import type { SecurityCheck } from '@/components/pdfs/SecurityChecklistPdf'

// ── Paleta VPC ────────────────────────────────────────────────────────────────
const C = '#4A90E2'

// ── Cards de PDF ──────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20+ perguntas mais cobradas em entrevista de VPC',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa nível pleno e sênior: subnets pub vs priv, SG vs NACL, NAT por AZ, Peering vs TGW, VPC Endpoints, Flow Logs, SSM Session Manager, Reachability Analyzer, PrivateLink, Lattice. Respostas com profundidade de entrevista de Cloud Architect.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'VPC CLI Quick Ref',
    subtitle: 'Comandos AWS CLI essenciais — VPC, subnets, SGs, NACLs, endpoints',
    type: 'quick-ref',
    pages: 1,
    description: 'A4 landscape com 3 colunas: gestão de VPC e subnets (create, delete, modify), Security Groups e NACLs (authorize, revoke, padrões 3-tier), Route Tables (associate, routes, prefix lists), VPC Endpoints (Gateway e Interface), Peering e TGW. O que ter na mesa ao operar VPC.',
    icon: '02',
    goal: 'Referência de CLI',
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet — Design e operação',
    subtitle: 'CIDR planning, padrões 3-tier, regras de ouro em uma página',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: CIDR planning (RFC 1918, /16 padrão, AWS reserva 5 IPs), padrão 3-tier multi-AZ, Security Groups stateful x NACLs stateless, conectividade (Peering/TGW/VPN/DX), VPC Endpoints (Gateway grátis vs Interface pago), regras de ouro de produção.',
    icon: '03',
    goal: 'Consulta rápida',
  },
  {
    id: 'security',
    title: 'Security Checklist VPC',
    subtitle: '18 verificações de hardening — Flow Logs, NACLs, SSM, encryption',
    type: 'security',
    pages: 5,
    description: 'Checklist organizado por categoria e severidade: Identidade (SSM Session Manager, IAM Endpoint Policy), Rede (sem SSH público, SG referencing, subnets privadas, VPC Endpoints), Observability (Flow Logs, Reachability Analyzer), Operacional (default VPC banido, NAT redundante, Conformance Pack). Cada item com remediation acionável.',
    icon: '04',
    goal: 'Hardening de produção',
  },
]

// ── Q&As ──────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Diferença entre Security Group e NACL?',
    a: '<strong>Security Group:</strong> stateful, por ENI. Apenas Allow. Resposta de conexão entra automaticamente. Pode referenciar outros SGs.<br><br><strong>NACL:</strong> stateless, por subnet. Suporta Allow E Deny. Avaliada por número crescente. Resposta precisa de regra explícita para portas efêmeras (1024-65535).<br><br>Use SG para 99% dos casos. NACL como guardrail de subnet para bloqueio amplo.',
    tip: 'A resposta sênior sempre menciona stateful vs stateless como diferença fundamental — não apenas o nível (instância vs subnet).',
  },
  {
    level: 'Pleno',
    q: 'O que torna uma subnet pública vs privada?',
    a: 'NÃO é um flag — é a <strong>route table</strong> associada:<br><br><strong>Pública:</strong> route table tem 0.0.0.0/0 → IGW E o recurso recebe IP público (auto-assign na subnet ou EIP).<br><strong>Privada com saída:</strong> route table tem 0.0.0.0/0 → NAT Gateway. Pode iniciar para internet, mas não recebe.<br><strong>Privada isolada:</strong> sem rota 0.0.0.0/0. Padrão para subnet de banco.<br><br>Erro comum: criar subnet com rota IGW mas instância sem IP público — não acessa nada.',
    tip: 'Pegadinha clássica: "minha subnet tem rota IGW mas não acessa". Resposta: faltou IP público — auto-assign na subnet ou EIP.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar VPC Endpoints?',
    a: 'Sempre que recursos privados acessam serviços AWS — evita tráfego pelo NAT (segurança + custo).<br><br><strong>Gateway Endpoint:</strong> APENAS S3 e DynamoDB. Gratuito. Adiciona rota implícita.<br><strong>Interface Endpoint (PrivateLink):</strong> outros serviços AWS (SSM, KMS, Secrets Manager, ECR, CloudWatch). Cria ENI privada. ~$0.01/h por endpoint por AZ.<br><br><strong>Endpoint Policy:</strong> restringe quais buckets/recursos podem ser acessados pelo endpoint — defense in depth contra exfiltration.',
    tip: 'Mencione Endpoint Policy como ferramenta de segurança, não só conectividade — diferencia "usei" de "entendo".',
  },
  {
    level: 'Pleno',
    q: 'Por que ter um NAT Gateway por AZ?',
    a: '<strong>HA:</strong> NAT Gateway é HA dentro de uma AZ, mas se a AZ falha, todas as subnets que apontam para ele perdem internet. Um NAT por AZ + route table por AZ garante isolamento.<br><br><strong>Custo:</strong> tráfego cross-AZ é cobrado ($0.01/GB cada lado). Se subnets em AZ-B usam NAT em AZ-A, paga ida e volta. NAT por AZ elimina esse custo.<br><br>3 NAT GWs custam ~$100/mês idle. Para dev/staging, um NAT global pode ser aceitável conscientemente.',
    tip: 'Resposta sênior mostra trade-off econômico explícito: HA + economia cross-AZ vs custo de múltiplos NATs.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o roteamento dentro de uma VPC?',
    a: 'Cada subnet tem UMA route table associada. A route table define próximo salto por destino CIDR:<br><br><code>10.0.0.0/16 → local</code> (sempre presente, não removível)<br><code>0.0.0.0/0 → igw-xxx</code> (subnet pública)<br><code>0.0.0.0/0 → nat-xxx</code> (subnet privada)<br><code>10.1.0.0/16 → pcx-xxx</code> (peering)<br><code>pl-63a5400a → vpce-s3-xxx</code> (Gateway Endpoint S3)<br><br><strong>Longest prefix match:</strong> rota mais específica vence (10.0.5.0/24 vence sobre 0.0.0.0/0).',
    tip: 'Mencionar longest prefix match e prefix lists demonstra entendimento real de roteamento — vai além de "0.0.0.0/0 → IGW".',
  },
  {
    level: 'Pleno',
    q: 'Como desenharia a rede para uma aplicação 3-tier?',
    a: '<strong>Pública (3 AZs):</strong> ALB e NAT Gateway. Sem instâncias de aplicação aqui.<br><strong>Privada de aplicação (3 AZs):</strong> EC2/ECS. Saída via NAT da própria AZ. Inbound apenas do ALB (SG source = sg-alb).<br><strong>Privada de banco (3 AZs):</strong> RDS Multi-AZ. Sem rota para NAT — completamente isolada. Inbound apenas do SG da app.<br><br>Adicionalmente: Gateway Endpoint para S3, Interface Endpoints para SSM/KMS/Secrets. Flow Logs em S3 + Athena. NACLs default. SGs em cascata: sg-alb → sg-app → sg-rds.',
    tip: 'Resposta sênior sempre menciona 3 AZs (não 2) e SG referencing em vez de CIDRs. Mostra hands-on real.',
  },
  {
    level: 'Senior',
    q: 'VPC Peering vs Transit Gateway vs VPN vs Direct Connect — quando usar cada?',
    a: '<strong>Peering:</strong> conexão direta entre 2 VPCs. Sem custo por hora. Não transitivo. Bom para 2-5 VPCs.<br><br><strong>Transit Gateway:</strong> hub central transitivo. Conecta dezenas de VPCs e on-prem. $0.05/h por attachment. Justifica acima de 5 VPCs ou multi-conta.<br><br><strong>VPN:</strong> IPsec sobre internet. ~1.25 Gbps por túnel. Latência variável. Para conectividade rápida com on-prem.<br><br><strong>Direct Connect:</strong> link físico (1-100 Gbps). Latência baixa. Caro mas necessário para volume alto e latência crítica.<br><br>Combinação real: DX como primário + VPN como backup. TGW conecta DX gateway + VPN + VPCs.',
    tip: 'Mencionar TGW route tables (segmentação por ambiente) e DX + VPN backup pattern demonstra produção real.',
  },
  {
    level: 'Senior',
    q: 'Como investigaria "EC2 não responde" em uma subnet privada?',
    a: 'Checklist sequencial:<br><br>1. <strong>Security Group inbound:</strong> permite protocolo+porta vindo da origem certa?<br>2. <strong>NACL da subnet:</strong> allow inbound + outbound (porta efêmera 1024-65535)?<br>3. <strong>Route Table:</strong> tem rota para o destino? 0.0.0.0/0 aponta para NAT (saída) ou IGW (pública)?<br>4. <strong>Public IP:</strong> instância tem IP público auto-atribuído ou EIP?<br>5. <strong>OS firewall:</strong> iptables, ufw bloqueando? <code>aws ssm start-session</code> para debugar.<br>6. <strong>App ouvindo:</strong> <code>ss -lntp</code> mostra app em 0.0.0.0:porta ou só 127.0.0.1?<br><br><strong>Ferramenta sênior:</strong> AWS VPC Reachability Analyzer simula o caminho do pacote e diz exatamente onde foi bloqueado.',
    tip: 'Mencionar Reachability Analyzer eleva a resposta — muitos sêniores ainda não conhecem essa ferramenta da AWS.',
  },
  {
    level: 'Senior',
    q: 'O que são VPC Flow Logs e como usar em investigação de incidente?',
    a: 'Flow Logs capturam metadados de tráfego IP em ENI, subnet ou VPC: timestamp, src/dst IP+porta, protocolo, bytes, ação (ACCEPT/REJECT). NÃO captura conteúdo do pacote.<br><br><strong>Destinos:</strong> CloudWatch Logs (custo alto) ou S3 (custo baixo, queries via Athena). Para incidente, S3 + Athena é o padrão.<br><br><strong>Em investigação:</strong> identificar IPs comunicando com C&C (<code>WHERE dstaddr IN (...badips)</code>), port scans (<code>GROUP BY srcaddr HAVING count(*) > 100</code>), tráfego saindo de subnet privada que não deveria, rejects em massa.<br><br>Format v3+ com pkt-srcaddr é útil para tráfego dentro de containers/IPv6.',
    tip: 'Citar uma query Athena concreta (não apenas "use Athena") fixa que você fez de verdade.',
  },
  {
    level: 'Senior',
    q: 'Por que SSM Session Manager em vez de bastion host?',
    a: '<strong>Bastion (antigo):</strong> EC2 em subnet pública com porta 22 aberta. Problemas: vetor #1 de ataque, gerência de chaves SSH, SPOF, audit limitado.<br><br><strong>SSM Session Manager (moderno):</strong> sem porta aberta, sem chaves, sem bastion. Acesso ao terminal via API SSM, autenticado por IAM (com MFA), auditado em CloudTrail.<br><br>Comando: <code>aws ssm start-session --target i-xxx</code><br><br><strong>Requisitos:</strong> SSM Agent (já vem em AMIs Amazon Linux/Ubuntu LTS) + IAM Profile com AmazonSSMManagedInstanceCore + saída para endpoints SSM.<br><br><strong>Bonus:</strong> port forwarding via SSM (acesso a RDS sem expor SG), session recording em S3.',
    tip: 'Mencionar port forwarding SSM como substituto de "bastion para acessar RDS" demonstra que sabe usar a ferramenta além do óbvio.',
  },
  {
    level: 'Senior',
    q: 'Como projetaria CIDR planning para uma org multi-conta?',
    a: '<strong>Princípios:</strong><br>1. Não-overlap: cada VPC com /16 distinto. Mesmo CIDR em 2 VPCs impede peering/TGW.<br>2. Por região: agrupar (10.0-15 = us-east-1, 10.16-31 = eu-west-1).<br>3. Por ambiente: reservar ranges (10.0-99 = prod, 10.100-199 = staging) — TGW route tables podem isolar por ambiente.<br>4. On-premises: coordenar com NetOps para evitar overlap com datacenter.<br>5. <strong>IPAM (AWS IP Address Manager):</strong> automatizar alocação sem manual tracking. Pools hierárquicos.<br><br>Anti-pattern crítico: usar Default VPC (172.31.0.0/16) — se precisar de peering com on-prem, fica preso.',
    tip: 'Mencionar IPAM (lançado em 2021) é diferencial sênior — mostra que você acompanha lançamentos AWS e pensa em escala.',
  },
  {
    level: 'Senior',
    q: 'O que é AWS PrivateLink e como difere de VPC Peering?',
    a: '<strong>VPC Peering:</strong> conecta DUAS VPCs inteiras — todas instâncias de A enxergam B (sujeito a SG/NACL). Acoplamento alto.<br><br><strong>PrivateLink (Interface Endpoints):</strong> expõe um SERVIÇO ESPECÍFICO da VPC produtora como uma ENI privada na VPC consumidora. Consumidor nunca vê o IP do produtor.<br><br><strong>Vantagens:</strong><br>• Granularidade: só o serviço, não a VPC inteira<br>• Não exige CIDR não-overlap<br>• Sem route table updates<br>• SaaS: Datadog, MongoDB Atlas, Snowflake oferecem PrivateLink<br><br><strong>Quando:</strong> Peering para integração tight entre VPCs da mesma org. PrivateLink para SaaS, microserviços compartilhados, exposição de internal API.',
    tip: 'Citar caso real (Snowflake/Datadog) ancora a resposta. Mencionar Gateway Load Balancer + PrivateLink (firewall pattern) é nível arquiteto.',
  },
  {
    level: 'Senior',
    q: 'Como implementaria uma egress VPC centralizada?',
    a: '<strong>Problema:</strong> múltiplas VPCs cada uma com NAT GW = custo multiplicado.<br><br><strong>Arquitetura:</strong><br>1. <strong>Egress VPC:</strong> VPC dedicada com NAT GWs em cada AZ. Sem aplicação.<br>2. <strong>Spoke VPCs:</strong> sem NAT próprio. RT padrão: 0.0.0.0/0 → TGW.<br>3. <strong>TGW:</strong> conecta egress + spokes. RT da egress: 0.0.0.0/0 → IGW.<br>4. <strong>NAT GW:</strong> em subnet pública da egress, com EIP estável.<br><br><strong>Benefícios:</strong> custo (1 conjunto de NATs em vez de N), EIPs estáveis para whitelist, inspeção centralizada (Network Firewall), audit unificado.<br><br><strong>Trade-offs:</strong> latência adicional do TGW hop, cobrança por GB no TGW (some ao NAT), debugging mais complexo.',
    tip: 'Egress VPC + Network Firewall (L7) é pattern enterprise. Citar isso em entrevista de SRE/Cloud Architect demonstra senioridade real.',
  },
  {
    level: 'Senior',
    q: 'Quais limites/quotas críticos você monitora em escala?',
    a: '<strong>Soft (aumentáveis):</strong><br>• 5 VPCs por região por conta<br>• 5 EIPs por região (NAT GWs consomem rápido)<br>• 60 in + 60 out rules por SG<br>• 200 subnets por VPC<br><br><strong>Hard (não aumentáveis):</strong><br>• 5 CIDRs por VPC (1 primário + 4 secundários)<br>• 200 routes por route table (TGW hub pode bater)<br>• <strong>NAT GW: 55k conexões por destino + 45 Gbps</strong> — apps com fan-out alto para mesmo endpoint externo podem bater. Mitigar com múltiplos NATs.<br>• <strong>1024 PPS por ENI no Route 53 Resolver</strong> — caching DNS é defesa.<br><br><strong>Monitoring:</strong> Service Quotas dashboard + Trusted Advisor. Alarmar em 80%.',
    tip: 'Saber NÚMEROS específicos (55k conexões, 1024 PPS, 200 routes) separa "li blog" de "operei produção".',
  },
  {
    level: 'Senior',
    q: 'Como auditaria custo de uma VPC?',
    a: '<strong>Cost leaks frequentes:</strong><br>1. <strong>NAT processing fees ($0.045/GB):</strong> tráfego para S3 deveria usar Gateway Endpoint (gratuito).<br>2. <strong>Cross-AZ data transfer:</strong> $0.01/GB ida + volta. Apps mal distribuídas pagam dobro.<br>3. <strong>EIPs ociosos:</strong> $0.005/h se não associados.<br>4. <strong>Interface Endpoints excessivos:</strong> $0.01/h POR AZ + $/GB.<br>5. <strong>VPN tunnels idle:</strong> $0.05/h mesmo sem tráfego.<br>6. <strong>Flow Logs em CloudWatch (não S3):</strong> ingestion ~$0.50/GB vs $0.023/GB em S3.<br><br>Tooling: Cost Explorer com Resource Tag filters, AWS Cost Anomaly Detection.',
    tip: 'Quantificar com números demonstra otimização real. "Reduz custo" é vago; "$2k/mês economizados via Gateway Endpoint" é convincente.',
  },
  {
    level: 'Senior',
    q: 'Como projetaria estratégia de DR cross-region com VPC?',
    a: 'VPCs são regionais. Estratégia DR exige infra paralela.<br><br><strong>Componentes:</strong><br>• VPC Mirror em região DR — mesma topologia, CIDR diferente (não-overlap futuro com peering).<br>• Conectividade: VPC Peering inter-region ou TGW Peering.<br>• Replicação de dados: RDS cross-region read replica, S3 CRR, DynamoDB Global Tables.<br>• DNS failover: Route 53 health checks + failover routing.<br><br><strong>Estratégias por RTO/RPO:</strong><br>• Backup & Restore (RTO horas): snapshots replicados<br>• Pilot Light (RTO 30min): infra mínima rodando<br>• Warm Standby (RTO 10min): infra completa em escala reduzida<br>• Multi-Site Active/Active (RTO segundos): tráfego nas duas regiões<br><br>Pontos cegos: ACM regional (replicar via DNS validation), KMS regional (multi-region keys).',
    tip: 'Citar "ACM regional" e "KMS multi-region keys" são pegadinhas que muitos esquecem em DR planning — ancora hands-on real.',
  },
  {
    level: 'Pleno',
    q: 'O que é Elastic Network Interface (ENI)?',
    a: 'Interface de rede virtual em uma VPC. Toda EC2 tem pelo menos uma (eth0, primary). ENI tem: IP privado primary, IPs privados secundários opcionais, EIP opcional, MAC address, lista de Security Groups.<br><br><strong>Pode ser destacada de uma instância e anexada a outra</strong> — útil para failover de aparelho de rede ou mover IP entre instâncias sem mudar DNS.<br><br>Cada tipo de instância tem limite de ENIs e IPs por ENI (m5.large = 3 ENIs, 10 IPs cada). Source/Dest Check ativado por padrão — desabilitar para NAT instance.',
    tip: 'Detalhe sênior: usar ENI movível para failover é pattern usado em HA antigos. Hoje preferir ALB/NLB, mas saber é útil.',
  },
  {
    level: 'Senior',
    q: 'Como funciona DNS dentro de uma VPC?',
    a: '<code>enableDnsSupport</code> (default true): DNS resolution dentro da VPC. Resolver Route 53 em x.x.x.2 (segundo IP da VPC).<br><br><code>enableDnsHostnames</code> (default false em VPC criada via API): instâncias com IP público recebem hostname público.<br><br><strong>Route 53 Resolver Endpoints:</strong><br>• Inbound: queries vindo de on-premises para zonas privadas Route 53<br>• Outbound: queries da VPC para DNS on-premises<br><br><strong>Private Hosted Zones:</strong> split-horizon DNS — mesma zona com respostas diferentes para internet vs VPC. Associar a múltiplas VPCs.<br><br><strong>Pegadinha:</strong> Route 53 Resolver tem rate limit de ~1024 PPS por ENI — apps com lookup loop podem bater.',
    tip: 'O rate limit de 1024 PPS é pouco documentado mas causa intermitência real em produção. Citar é detalhe sênior puro.',
  },
  {
    level: 'Senior',
    q: 'O que é VPC Lattice e quando usaria?',
    a: 'VPC Lattice (lançado 2023) é o service mesh gerenciado da AWS. Substitui parte da complexidade de Istio/Linkerd e API Gateway internos.<br><br><strong>Conceito:</strong> Service Network conecta serviços (HTTP/HTTPS/gRPC) entre VPCs e contas sem peering, sem TGW, sem PrivateLink manual. Cada serviço registrado, descoberto via DNS, com auth IAM, observability automática, routing rules (header-based, weighted).<br><br><strong>Quando:</strong> microserviços spread em múltiplas VPCs/contas, quer auth IAM L7, não quer operar service mesh OSS, routing avançado sem manter Envoy.<br><br><strong>Trade-offs:</strong> ainda nascente — features menos maduras que Istio. Vendor lock-in. Custo por request. Para casos simples, ALB + API Gateway ainda funciona.',
    tip: 'Acompanhar lançamentos AWS recentes (Lattice 2023) e posicionar contra Istio é nível arquiteto sênior. Resposta cruamente otimista é ruim — sempre cite trade-offs.',
  },
  {
    level: 'Senior',
    q: 'Como auditaria uma VPC para conformidade de segurança?',
    a: '<strong>Checklist priorizado:</strong><br>1. SGs com 0.0.0.0/0 em portas críticas (22, 3389, 3306) — bloquear via SCP organizacional<br>2. Default VPC em produção — Config rule <code>vpc-default-security-group-closed</code><br>3. Flow Logs habilitados — Config rule <code>vpc-flow-logs-enabled</code><br>4. Subnets públicas mínimas — Config rule <code>ec2-instance-no-public-ip</code><br>5. NAT GW redundante — 1 por AZ (Trusted Advisor)<br>6. VPC Endpoints para serviços sensíveis (S3, KMS, Secrets)<br>7. Endpoint Policy restrita em Gateway Endpoint S3<br>8. NACLs custom auditadas — evitar regras conflitantes<br>9. Reachability Analyzer em pipeline (caminhos críticos testados)<br><br>Ferramentas: AWS Config + Conformance Pack (NIST, CIS), Trusted Advisor, Security Hub agregando.',
    tip: 'Citar Conformance Pack e nomes específicos de Config rules ancora experiência real de hardening.',
  },
]

// ── Quick Reference — comandos AWS CLI VPC ────────────────────────────────────

const QR_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'VPC e Subnets',
        entries: [
          { key: 'Criar VPC', value: 'aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=prod}]"' },
          { key: 'Habilitar DNS hostnames', value: 'aws ec2 modify-vpc-attribute --vpc-id vpc-xxx --enable-dns-hostnames', badge: 'producao', badgeColor: '#4A90E2' },
          { key: 'Criar subnet pública', value: 'aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.0.0/24 --availability-zone us-east-1a' },
          { key: 'Auto-assign public IP', value: 'aws ec2 modify-subnet-attribute --subnet-id subnet-xxx --map-public-ip-on-launch' },
          { key: 'Listar VPCs', value: 'aws ec2 describe-vpcs --query "Vpcs[].{ID:VpcId,CIDR:CidrBlock,Default:IsDefault}" --output table' },
          { key: 'Listar subnets', value: 'aws ec2 describe-subnets --filters "Name=vpc-id,Values=vpc-xxx"' },
        ],
      },
      {
        title: 'Internet Gateway / NAT',
        entries: [
          { key: 'Criar IGW', value: 'aws ec2 create-internet-gateway' },
          { key: 'Anexar IGW à VPC', value: 'aws ec2 attach-internet-gateway --vpc-id vpc-xxx --internet-gateway-id igw-xxx' },
          { key: 'Alocar EIP', value: 'aws ec2 allocate-address --domain vpc' },
          { key: 'Criar NAT Gateway', value: 'aws ec2 create-nat-gateway --subnet-id subnet-pub-a --allocation-id eipalloc-xxx', badge: 'por AZ', badgeColor: '#fbbf24' },
          { key: 'Egress-Only IGW (IPv6)', value: 'aws ec2 create-egress-only-internet-gateway --vpc-id vpc-xxx', badge: 'gratis', badgeColor: '#4ade80' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Route Tables',
        entries: [
          { key: 'Criar route table', value: 'aws ec2 create-route-table --vpc-id vpc-xxx' },
          { key: 'Rota para IGW (pública)', value: 'aws ec2 create-route --route-table-id rtb-xxx --destination-cidr-block 0.0.0.0/0 --gateway-id igw-xxx' },
          { key: 'Rota para NAT (privada)', value: 'aws ec2 create-route --route-table-id rtb-xxx --destination-cidr-block 0.0.0.0/0 --nat-gateway-id nat-xxx' },
          { key: 'Associar subnet → RT', value: 'aws ec2 associate-route-table --route-table-id rtb-xxx --subnet-id subnet-xxx' },
          { key: 'Listar rotas', value: 'aws ec2 describe-route-tables --filters "Name=vpc-id,Values=vpc-xxx"' },
          { key: 'Longest prefix wins', value: 'Rota mais específica vence — 10.0.5.0/24 vence sobre 0.0.0.0/0', badge: 'memoria', badgeColor: '#4A90E2' },
        ],
      },
      {
        title: 'Security Groups (stateful)',
        entries: [
          { key: 'Criar SG', value: 'aws ec2 create-security-group --group-name app-sg --description "app tier" --vpc-id vpc-xxx' },
          { key: 'Allow do ALB → App', value: 'authorize-security-group-ingress --group-id sg-app --protocol tcp --port 8080 --source-group sg-alb', badge: 'recomendado', badgeColor: '#4ade80' },
          { key: 'Allow HTTPS público', value: 'authorize-security-group-ingress --group-id sg-alb --protocol tcp --port 443 --cidr 0.0.0.0/0' },
          { key: 'Revogar regra', value: 'revoke-security-group-ingress --group-id sg-xxx --protocol tcp --port 22 --cidr 0.0.0.0/0' },
          { key: 'Padrão default deny', value: 'SG novo já bloqueia tudo de entrada — só Allow é permitido' },
          { key: 'NUNCA: SSH público', value: 'cidr_blocks 0.0.0.0/0 + port 22 = vetor #1 de ataque', badge: '!perigoso', badgeColor: '#ef4444' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'NACLs (stateless por subnet)',
        entries: [
          { key: 'Default NACL', value: 'allow all in/out — não toque a menos que precise de defense in depth' },
          { key: 'Criar regra inbound', value: 'create-network-acl-entry --network-acl-id acl-xxx --rule-number 100 --protocol tcp --port-range From=443,To=443 --cidr-block 0.0.0.0/0 --rule-action allow' },
          { key: 'Allow respostas (efêmeras)', value: 'rule 200 allow tcp 1024-65535 0.0.0.0/0 # SEMPRE no outbound', badge: '★ stateless', badgeColor: '#f59e0b' },
          { key: 'Bloquear IP malicioso', value: 'rule 50 deny all 198.51.100.42/32 # Deny vence Allow superior', badge: 'caso de uso', badgeColor: '#4A90E2' },
          { key: 'Esquecer outbound', value: 'NACL stateless: precisa allow ida E volta. Esquecer = "EC2 não responde"', badge: '!comum', badgeColor: '#ef4444' },
        ],
      },
      {
        title: 'VPC Endpoints',
        entries: [
          { key: 'Gateway Endpoint S3', value: 'create-vpc-endpoint --vpc-id vpc-xxx --service-name com.amazonaws.us-east-1.s3 --route-table-ids rtb-priv', badge: 'gratis', badgeColor: '#4ade80' },
          { key: 'Interface Endpoint SSM', value: 'create-vpc-endpoint --vpc-endpoint-type Interface --service-name com.amazonaws.us-east-1.ssm --subnet-ids subnet-xxx --security-group-ids sg-vpce' },
          { key: 'Casos típicos Interface', value: 'SSM, KMS, Secrets Manager, ECR (api/dkr), CloudWatch Logs' },
          { key: 'Custo Interface', value: '~$0.01/h por endpoint POR AZ + $/GB processado' },
          { key: 'Endpoint Policy', value: 'Restringe quais buckets/recursos podem ser acessados via o endpoint', badge: 'seguranca', badgeColor: '#4A90E2' },
        ],
      },
      {
        title: 'Peering / Transit Gateway',
        entries: [
          { key: 'Criar VPC Peering', value: 'aws ec2 create-vpc-peering-connection --vpc-id vpc-a --peer-vpc-id vpc-b' },
          { key: 'Aceitar Peering', value: 'aws ec2 accept-vpc-peering-connection --vpc-peering-connection-id pcx-xxx' },
          { key: 'Adicionar rota Peering', value: 'create-route --route-table-id rtb-xxx --destination-cidr-block 10.1.0.0/16 --vpc-peering-connection-id pcx-xxx' },
          { key: 'Criar TGW', value: 'aws ec2 create-transit-gateway --description "central hub"' },
          { key: 'Anexar VPC ao TGW', value: 'aws ec2 create-transit-gateway-vpc-attachment --transit-gateway-id tgw-xxx --vpc-id vpc-xxx --subnet-ids subnet-aaa subnet-bbb' },
        ],
      },
    ],
  },
]

// ── Cheatsheet — VPC design ──────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'VPC /16 padrão', sig: '65k IPs, 5 CIDRs max', desc: 'RFC 1918 (10/8 ou 172.16/12). Reservar /16 não-overlap por VPC para futuro peering/TGW.' },
  { name: 'Subnet /24', sig: '256 IPs (251 úteis)', desc: 'AWS reserva 5 IPs por subnet. Multi-AZ exige múltiplas subnets — 1 por AZ por tier.' },
  { name: 'Subnet pública', sig: 'RT: 0.0.0.0/0 → IGW', desc: 'Hospeda apenas ALB e NAT GW. Aplicação deve ficar em subnet privada.' },
  { name: 'Subnet privada', sig: 'RT: 0.0.0.0/0 → NAT', desc: 'Saída via NAT GW. Sem IP público. Default para EC2/ECS de aplicação.' },
  { name: 'Subnet isolada', sig: 'RT: só local', desc: 'Sem rota 0.0.0.0/0. Padrão para subnet de banco — defesa extra contra exfiltration.' },
  { name: 'Security Group', sig: 'Stateful, ENI', desc: 'Allow only. Pode referenciar outros SGs (source = sg-alb). Default deny tudo de entrada.' },
  { name: 'NACL', sig: 'Stateless, subnet', desc: 'Allow + Deny por número. Esquecer outbound 1024-65535 é causa #1 de "EC2 não responde".' },
  { name: 'NAT Gateway', sig: '$0.045/h + $/GB', desc: 'Um por AZ — HA + economia cross-AZ. Limite 55k conexões por destino.' },
  { name: 'Gateway Endpoint', sig: 'S3 + DynamoDB grátis', desc: 'Adiciona rota implícita na route table. Endpoint Policy restringe buckets.' },
  { name: 'Interface Endpoint', sig: '~$0.01/h por AZ', desc: 'PrivateLink: SSM, KMS, Secrets, ECR, CloudWatch. Cria ENI privada.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true, t: 'Multi-AZ: 3 AZs (não 2) para HA durante manutenção concorrente' },
  { ok: true, t: 'NAT Gateway por AZ — HA + evita custo cross-AZ ($0.01/GB)' },
  { ok: true, t: 'Security Groups em cascata (sg-alb → sg-app → sg-rds) com referências, não CIDRs' },
  { ok: true, t: 'Subnets de banco sem rota para NAT — totalmente isoladas' },
  { ok: true, t: 'Gateway Endpoint para S3 e DynamoDB sempre (gratuito + economia de NAT)' },
  { ok: true, t: 'SSM Session Manager substitui bastion + porta 22 aberta' },
  { ok: true, t: 'Flow Logs em S3 + Athena para auditoria de tráfego' },
  { ok: true, t: 'Tags obrigatórias: Environment, Owner, CostCenter, Project' },
  { ok: true, t: 'Default NACL allow-all + tudo no SG (99% dos casos)' },
  { ok: true, t: 'CIDR /16 com /24 por subnet, planejar não-overlap multi-conta' },
  { ok: false, t: 'SSH (porta 22) aberto para 0.0.0.0/0 em qualquer SG' },
  { ok: false, t: 'Default VPC (172.31.0.0/16) em produção' },
  { ok: false, t: 'Um único NAT Gateway para múltiplas AZs (SPOF + custo cross-AZ)' },
  { ok: false, t: 'Elastic IPs não associados ($0.005/h ocioso)' },
  { ok: false, t: 'Aplicação em subnet pública com IP público auto-assign' },
  { ok: false, t: 'NACL custom sem allow outbound 1024-65535 (portas efêmeras)' },
  { ok: false, t: 'VPC Peering full-mesh com 5+ VPCs (use TGW)' },
]

// ── Security Checklist ────────────────────────────────────────────────────────

const SECURITY_CHECKS: SecurityCheck[] = [
  {
    item: 'Sem porta SSH (22) ou RDP (3389) aberta para 0.0.0.0/0',
    description: 'SSH/RDP públicos são o vetor de ataque mais comum em EC2. Substitua por SSM Session Manager — sem porta aberta, autenticação IAM, auditoria CloudTrail.',
    severity: 'critical',
    category: 'Rede',
    cwe: 'CWE-284',
    owasp: 'A05:2021',
    remediation: 'Remover regras port 22/3389 com cidr 0.0.0.0/0. Anexar IAM Profile com AmazonSSMManagedInstanceCore. SCP organizacional bloqueando criação de SG com regra desse tipo.',
    testable: true,
  },
  {
    item: 'Aplicação em subnet privada (sem IP público)',
    description: 'Instâncias com IP público são alcançáveis da internet — superfície de ataque desnecessária. Aplicação deve ficar em subnet privada com tráfego de saída via NAT.',
    severity: 'high',
    category: 'Rede',
    remediation: 'Provisionar em subnet com rota 0.0.0.0/0 → NAT Gateway. associate_public_ip_address = false no Launch Template.',
    testable: true,
  },
  {
    item: 'Security Groups referenciam outros SGs, não CIDRs amplos',
    description: 'Allow tcp 8080 de 10.0.0.0/8 permite qualquer instância na VPC. Source = sg-alb restringe ao ALB específico — defesa contra movimento lateral.',
    severity: 'medium',
    category: 'Rede',
    remediation: 'authorize-security-group-ingress --source-group sg-alb em vez de --cidr. Padrão 3-tier: sg-alb → sg-app → sg-rds.',
    testable: true,
  },
  {
    item: 'Subnets de banco sem rota para NAT (totalmente isoladas)',
    description: 'RDS em subnet com rota para NAT pode iniciar conexão para internet — vetor de exfiltration se app comprometida. Bancos devem ficar em subnet sem rota 0.0.0.0/0.',
    severity: 'high',
    category: 'Rede',
    remediation: 'Route Table separada para subnets de banco — apenas rota local. RDS Subnet Group apontando para essas subnets.',
    testable: true,
  },
  {
    item: 'NACLs default em vez de regras custom complexas',
    description: 'NACLs custom mal configuradas (especialmente sem allow outbound 1024-65535) causam "EC2 não responde" e debugging de horas. Use SGs para tudo, NACLs apenas para bloqueio amplo.',
    severity: 'medium',
    category: 'Rede',
    remediation: 'Manter NACL default (allow all). Se precisar bloquear IP, adicionar Deny específico SEM remover allow geral.',
    testable: true,
  },
  {
    item: 'VPC Endpoints para serviços AWS sensíveis (S3, KMS, Secrets, SSM)',
    description: 'Tráfego para serviços AWS não precisa sair da VPC. Endpoints (Gateway grátis para S3/DynamoDB, Interface para os demais) eliminam exposição via NAT, reduzem custo e habilitam Endpoint Policy.',
    severity: 'medium',
    category: 'Rede',
    remediation: 'create-vpc-endpoint --service-name com.amazonaws.region.s3 (Gateway, grátis). Interface endpoints para SSM/KMS/Secrets (~$0.01/h por AZ).',
    testable: true,
  },
  {
    item: 'Endpoint Policy restritiva em Gateway Endpoint S3',
    description: 'Sem policy, qualquer bucket S3 acessível via endpoint. Endpoint Policy + bucket policy com aws:SourceVpce limita acesso aos buckets aprovados — defense in depth contra exfiltration mesmo com credenciais válidas.',
    severity: 'high',
    category: 'Rede',
    cwe: 'CWE-200',
    remediation: 'Endpoint Policy: Allow apenas Resource = arn:aws:s3:::myorg-* + Deny NotResource. Bucket policy: Deny s3:* if aws:SourceVpce != vpce-xxx.',
    testable: true,
  },
  {
    item: 'NAT Gateway redundante (1 por AZ)',
    description: 'NAT GW único para múltiplas AZs cria SPOF (falha de AZ derruba todas as subnets) e custo cross-AZ ($0.01/GB ida + volta). Um NAT por AZ com route table separada por AZ resolve ambos.',
    severity: 'medium',
    category: 'Rede',
    remediation: 'Provisionar NAT GW em cada AZ (subnets públicas), route table por AZ apontando para o NAT da própria AZ.',
    testable: true,
  },
  {
    item: 'SSM Session Manager habilitado (substitui bastion)',
    description: 'Bastion hosts em subnet pública com SSH são vetor #1 de ataque. SSM Session Manager elimina porta aberta + chaves SSH + bastion como SPOF.',
    severity: 'high',
    category: 'Identidade e Acesso',
    remediation: 'IAM Instance Profile com AmazonSSMManagedInstanceCore. Saída para endpoints SSM (via NAT, IGW ou Interface Endpoints). Acesso: aws ssm start-session --target i-xxx.',
    testable: true,
  },
  {
    item: 'VPC Flow Logs habilitados em S3',
    description: 'Sem Flow Logs, incidentes de rede ficam invisíveis: não dá para identificar IPs maliciosos, port scans, exfiltration. S3 + Athena é o destino padrão (custo baixo, queries flexíveis).',
    severity: 'high',
    category: 'Observabilidade',
    cwe: 'CWE-778',
    remediation: 'aws ec2 create-flow-logs --resource-type VPC --resource-ids vpc-xxx --traffic-type ALL --log-destination-type s3 --log-destination arn:aws:s3:::flow-logs-bucket',
    testable: true,
  },
  {
    item: 'Reachability Analyzer em pipeline (caminhos críticos testados)',
    description: 'Em mudanças de SG/NACL/RT, testes manuais de conectividade são frágeis. Reachability Analyzer simula caminho do pacote em segundos — integrar em pipeline garante que mudanças não quebram conectividade crítica.',
    severity: 'medium',
    category: 'Observabilidade',
    remediation: 'aws ec2 create-network-insights-path + create-network-insights-analysis em pipeline CI/CD. Validar caminhos como app → RDS (deve passar), internet → RDS (deve falhar).',
    testable: true,
  },
  {
    item: 'Default VPC banido em produção',
    description: 'Default VPC (172.31.0.0/16) tem configurações inseguras (default SG allow all entre instâncias da VPC, sem segmentação) e CIDR fixo que conflita com on-prem comum.',
    severity: 'medium',
    category: 'Operacional',
    remediation: 'Config rule vpc-default-security-group-closed. SCP organizacional negando ec2:RunInstances em VPCs default. Provisionar VPC explícita por aplicação.',
    testable: true,
  },
  {
    item: 'Tags obrigatórias: Environment, Owner, CostCenter, Project',
    description: 'Sem tags, custo, ownership e blast radius de incidente são impossíveis de mapear. Tag enforcement via SCP impede criação de recurso sem tags.',
    severity: 'medium',
    category: 'Operacional',
    remediation: 'AWS Config rule required-tags + SCP que faz Deny em ec2:CreateVpc se aws:RequestTag/Environment ausente.',
    testable: true,
  },
  {
    item: 'Encryption em trânsito entre componentes',
    description: 'Mesmo dentro da VPC, tráfego deve ser criptografado para defesa em profundidade. ALB com HTTPS para EC2, RDS com SSL/TLS, mTLS entre microserviços.',
    severity: 'medium',
    category: 'Storage',
    cwe: 'CWE-319',
    remediation: 'ALB Listener HTTPS only + ACM cert. RDS SSL/TLS forced via parameter group (rds.force_ssl=1). VPC Lattice ou App Mesh para mTLS automático.',
    testable: true,
  },
  {
    item: 'Auditoria de uso de Default Security Group',
    description: 'Default SG é compartilhado entre recursos sem SG explícito. Se tem regras allow-all internas, vira acoplamento implícito e movimento lateral fácil.',
    severity: 'medium',
    category: 'Rede',
    remediation: 'Default SG fechado: revoke-security-group-ingress (todas regras), revoke-security-group-egress (todas regras). Config rule vpc-default-security-group-closed.',
    testable: true,
  },
  {
    item: 'AWS Network Firewall ou similar para inspeção L7',
    description: 'SGs/NACLs operam em L3/L4. Para inspeção L7 (block egress to bad domains, malware sigs, IDS/IPS), Network Firewall em egress VPC é o pattern enterprise.',
    severity: 'low',
    category: 'Rede',
    remediation: 'Network Firewall em subnet dedicada da egress VPC. Regras Suricata para IDS. Útil para org com requisito de compliance forte.',
    testable: false,
  },
  {
    item: 'Conformance Pack (CIS, NIST) habilitado em AWS Config',
    description: 'CIS Benchmark e NIST 800-53 têm packs prontos com 30-50 rules de VPC pré-configuradas. Mais barato que reinventar policies.',
    severity: 'medium',
    category: 'Operacional',
    remediation: 'aws configservice put-conformance-pack --conformance-pack-name CIS-Benchmark --template-s3-uri s3://aws-conformance-pack-templates/...',
    testable: true,
  },
  {
    item: 'CloudTrail habilitado para mudanças em VPC',
    description: 'Sem CloudTrail, mudanças em SGs (alguém abriu porta 22), NACLs, route tables passam despercebidas. Logs em bucket protegido (Object Lock) impedem que atacante apague.',
    severity: 'critical',
    category: 'Operacional',
    cwe: 'CWE-778',
    remediation: 'CloudTrail multi-region trail + log validation + destino S3 com Object Lock. Alarmes em mudanças de SG críticos via EventBridge.',
    testable: true,
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'VPC',
    stackLabel: 'AWS / Cloud',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QR_COLUMNS,
    skillName: 'VPC CLI',
    accentColor: C,
    stackLabel: 'AWS / Cloud',
    tagline: 'Comandos AWS CLI essenciais para VPC — VPCs, subnets, SGs, NACLs, endpoints, peering, TGW',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'VPC',
    accentColor: C,
    stackLabel: 'AWS / Cloud',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['VPC por região (default)', '5 (limite soft, aumentável)'],
        ['CIDRs por VPC', '5 (1 primário + 4 secundários, hard)'],
        ['Subnets por VPC', '200 (soft)'],
        ['Route tables por VPC', '200 (soft)'],
        ['Routes por route table', '200 (hard)'],
        ['Rules por SG', '60 in + 60 out (soft)'],
        ['SGs por VPC', '2500 (soft)'],
        ['EIPs por região', '5 (famoso pequeno, aumentável)'],
        ['NAT GW conexões/destino', '55k (hard)'],
        ['Route 53 Resolver PPS/ENI', '1024 (não documentado)'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'Gateway Endpoint para S3 elimina $0.045/GB de NAT processing',
        'NAT por AZ evita custo cross-AZ ($0.01/GB ida + volta)',
        '3 AZs (não 2) garantem HA durante manutenção concorrente da AWS',
        'Reachability Analyzer resolve "EC2 não responde" em segundos vs minutos manual',
        'Flow Logs em S3 + Athena custa $0.023/GB vs CloudWatch $0.50/GB',
        'IPAM (AWS IP Address Manager) automatiza alocação de CIDRs em multi-conta',
        'Interface Endpoint POR AZ multiplica custo — calcular antes de espalhar',
        'Cache DNS local (nscd, systemd-resolved) defende contra rate limit Route 53 (1024 PPS)',
      ],
      patterns: [
        { name: '3-tier Multi-AZ', code: 'pub/app/db × 3 AZs = 9 subnets · NAT por AZ · SG cascade', desc: 'Padrão de produção. ALB em pub, app em privada com NAT, DB isolada sem rota internet.' },
        { name: 'SG Referencing', code: 'sg-app inbound source = sg-alb (não CIDR)', desc: 'Acoplamento explícito por identidade de SG. Movimento lateral mais difícil que com CIDRs amplos.' },
        { name: 'Egress VPC centralizada', code: 'Spoke VPCs → TGW → Egress VPC → NAT → IGW', desc: 'Custo único de NAT, EIPs estáveis para whitelist, inspeção L7 centralizada.' },
        { name: 'Hub-Spoke (TGW)', code: 'Múltiplas VPCs anexadas ao TGW · TGW route tables segmentam ambientes', desc: 'Substitui peering full-mesh. Transitivo, escala para centenas de VPCs, isolação por TGW route table.' },
        { name: 'Gateway Endpoint + Bucket Policy', code: 'Endpoint policy + aws:SourceVpce em bucket policy', desc: 'Defense in depth: mesmo com credenciais válidas, S3 só acessível via VPC autorizada.' },
      ],
      mentalModels: [
        '"EC2 não responde" segue checklist: SG → NACL → RT → IP público → OS firewall → app ouvindo',
        'Subnet pública = route table com IGW + IP público no recurso (ambos)',
        'NACL stateless: pacote de resposta exige regra explícita em portas efêmeras 1024-65535',
        'Peering NÃO é transitivo — A↔B + B↔C ≠ A↔C. Use TGW para 5+ VPCs',
        'Default VPC = configurações inseguras + CIDR fixo. Sempre crie VPC explícita',
        'Tráfego cross-AZ é cobrado dos dois lados ($0.01/GB ida + volta)',
      ],
    },
  }),
  security: () => buildSecurityChecklistPdf({
    checks: SECURITY_CHECKS,
    skillName: 'VPC',
    accentColor: C,
    stackLabel: 'AWS / Cloud',
    targetAudience: 'Cloud Architect / SRE / DevOps',
    coverTitle: 'VPC — Hardening de Produção',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function VpcPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />
        ))}
      </div>
      {open && (
        <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />
      )}
    </>
  )
}
