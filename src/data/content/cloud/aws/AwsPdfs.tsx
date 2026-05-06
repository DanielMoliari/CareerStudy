'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion, CompScenario } from '@/components/pdfs/ComparativeRefPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'

// ── Paleta AWS ────────────────────────────────────────────────────────────────
const C = '#FF9900'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista AWS',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: perguntas sobre IAM (roles vs users, least privilege), VPC (SG vs NACL, subnets), computação (EC2 vs Lambda vs ECS vs EKS), bancos de dados (RDS vs DynamoDB, Multi-AZ vs Multi-Region), storage (S3 classes, presigned URLs) e arquitetura (Well-Architected Framework).',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet AWS',
    subtitle: 'Serviços, comandos e decisões principais em uma página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: todos os serviços principais com quando usar, regras de ouro da arquitetura AWS, anti-patterns de segurança e siglas essenciais.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'quick-ref',
    title: 'AWS CLI Quick Ref',
    subtitle: 'Comandos essenciais por serviço para o dia a dia',
    type: 'quick-ref',
    pages: 2,
    description: 'Referência compacta dos comandos AWS CLI mais usados: EC2, S3, Lambda, ECS, IAM e CloudWatch — com flags principais e exemplos de uso real.',
    icon: '03',
    goal: 'Referência de CLI',
  },
  {
    id: 'comparative',
    title: 'Comparativo de Serviços',
    subtitle: 'EC2 vs Lambda vs ECS, RDS vs DynamoDB, SQS vs SNS vs EventBridge',
    type: 'comparative',
    pages: 3,
    description: 'Tabelas de decisão: quando usar cada opção de computação, qual banco de dados escolher, como decidir entre as opções de mensageria AWS. Com critérios técnicos e cenários reais.',
    icon: '04',
    goal: 'Tomada de decisão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map AWS',
    subtitle: 'Ecossistema completo AWS em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental dos serviços AWS organizados por domínio: computação, storage, banco de dados, rede, segurança, mensageria, observabilidade e AI/ML. Com checklist de entrevista.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
]

// ── Q&As ──────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Qual a diferença entre IAM User, Group e Role? Quando usar cada um?',
    a: '<strong>IAM User</strong>: identidade com credenciais de longo prazo (senha + access key). Use para pessoas físicas com acesso à console/CLI.<br><strong>IAM Group</strong>: coleção de users que compartilha policies. Nunca tem credenciais próprias — simplifica gestão de permissões.<br><strong>IAM Role</strong>: identidade assumível por serviços AWS, contas externas ou usuários federados. Sem credenciais de longo prazo — gera tokens temporários via STS.<br><br><strong>Regra de ouro:</strong> EC2 e Lambda usam <em>sempre</em> Roles. Access keys hardcoded ou em variáveis de ambiente são anti-pattern grave de segurança.',
    tip: 'Comece pela regra de ouro: serviços usam Roles, nunca Access Keys. Depois explique o mecanismo STS. Isso diferencia sênior de pleno.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre Security Group e NACL (Network ACL)?',
    a: '<strong>Security Group</strong> é stateful: se você permite entrada na porta 443, a resposta sai automaticamente. Opera no nível da instância (EC2, RDS, Lambda em VPC).<br><br><strong>NACL</strong> é stateless: precisa de regras de entrada E saída explícitas. Opera no nível da subnet. Regras numeradas e avaliadas em ordem (menor número = maior prioridade).<br><br><strong>Prática:</strong> Use SG como primary defense. Use NACL para bloquear IPs maliciosos em nível de subnet — mais eficiente quando o IP ataca muitas instâncias.',
    tip: 'Stateful vs stateless é a distinção chave. Cite o caso de uso: SG para instance-level, NACL para subnet-level blocking de IP.',
  },
  {
    level: 'Senior',
    q: 'Explique Multi-AZ vs Multi-Region. Quando usar cada um?',
    a: '<strong>Multi-AZ</strong>: alta disponibilidade dentro de uma região. RDS Multi-AZ mantém replica síncrona em outra AZ — failover automático em menos de 60s. Protege contra falha de datacenter.<br><br><strong>Multi-Region</strong>: disaster recovery e latência global. DynamoDB Global Tables replica entre regiões em milissegundos. Route 53 failover redireciona tráfego se uma região cair. Protege contra falha de região inteira.<br><br><strong>Custo:</strong> Multi-AZ = 2× custo da instância. Multi-Region = 2× infra em duas regiões + replicação.',
    tip: 'Defina o objetivo: Multi-AZ = HA (RPO~0, RTO menor que 60s). Multi-Region = DR (RPO=minutos, RTO=minutos a horas).',
  },
  {
    level: 'Senior',
    q: 'Quando usar RDS/Aurora vs DynamoDB?',
    a: '<strong>RDS/Aurora</strong>: dados relacionais com JOINs complexos, transações ACID, schema definido. Aurora é até 5× mais rápido que MySQL padrão com failover em menos de 30s.<br><br><strong>DynamoDB</strong>: acesso por chave primária, escala previsível (latência de milissegundos em qualquer escala), sem JOINs, schema flexível. Melhor para: gaming, IoT, sessions, carrinho de compras.<br><br><strong>Decisão:</strong> Precisa de JOINS? RDS. Escala imprevisível ou global? DynamoDB. Transações ACID + alta performance? Aurora Serverless v2.',
    tip: 'A pergunta que decide: "você precisa de JOINs e schema rígido ou acesso por chave e escala elástica?"',
  },
  {
    level: 'Senior',
    q: 'Como funciona o VPC? O que são subnets públicas vs privadas?',
    a: '<strong>VPC</strong> (Virtual Private Cloud): rede virtual isolada dentro de uma região AWS. Você define o CIDR block e divide em subnets por AZ.<br><br><strong>Subnet pública</strong>: tem rota para Internet Gateway (IGW). ALB e NAT Gateway ficam aqui. Nunca coloque bancos de dados em subnet pública.<br><br><strong>Subnet privada</strong>: sem rota para IGW. Acessa internet via NAT Gateway (saída apenas). Aqui ficam EC2/ECS da aplicação, RDS, ElastiCache.<br><br><strong>Padrão típico:</strong> 2 subnets públicas (ALB, NAT GW) + 2 subnets privadas de app (ECS) + 2 subnets privadas de dados (RDS).',
    tip: 'Desenhe mentalmente: IGW → Subnet pública (ALB) → NAT GW → Subnet privada (App) → Subnet privada (DB). Isso demonstra entendimento prático.',
  },
  {
    level: 'Senior',
    q: 'Quando usar Lambda vs ECS/Fargate vs EC2?',
    a: '<strong>Lambda</strong>: event-driven, execução curta (máximo 15 min), escala de 0 a 1000+ simultâneas. Ideal para webhooks, processamento de S3/SQS, APIs esporádicas. Cold start é o maior problema — mitigar com Provisioned Concurrency ou SnapStart.<br><br><strong>ECS/Fargate</strong>: containers sem gerenciar EC2. Execução contínua ou workloads com carga previsível. Sem cold start significativo. Melhor custo que Lambda para cargas altas.<br><br><strong>EC2</strong>: controle total de OS, workloads legados, GPU, armazenamento NVMe. Maior overhead operacional.',
    tip: 'Fórmula: event-driven + curta = Lambda. Containers + carga contínua = Fargate. Controle total ou legado = EC2.',
  },
  {
    level: 'Senior',
    q: 'Explique S3 presigned URLs e como funcionam.',
    a: '<strong>Presigned URL</strong>: URL temporária que concede acesso a um objeto S3 privado sem expor credenciais AWS. Gerada com as permissões do IAM user/role que a criou.<br><br><strong>Funcionamento:</strong> Backend gera URL com expiração (ex: 3600 segundos) usando SDK. URL inclui parâmetros de autenticação: X-Amz-Credential, X-Amz-Signature, X-Amz-Expires. Cliente usa diretamente — upload ou download vai direto para S3 sem passar pelo backend.<br><br><strong>Casos de uso:</strong> upload direto do browser (sem passar pelo servidor), link de download temporário, compartilhamento seguro de arquivo por tempo limitado.',
    tip: 'Destaque o caso de upload direto — salva latência e custo ao não passar pelo servidor backend.',
  },
  {
    level: 'Pleno',
    q: 'Quais são as classes de storage do S3 e quando usar cada uma?',
    a: '<ul><li><strong>S3 Standard</strong>: acesso frequente. 11 noves de durabilidade. Mais caro por GB.</li><li><strong>S3 Standard-IA</strong>: acesso infrequente (menos de 1 vez por mês). Custo de retrieval. Backup de dados acessados raramente.</li><li><strong>S3 One Zone-IA</strong>: como IA mas em uma AZ só. 20% mais barato mas menor resiliência.</li><li><strong>S3 Glacier Instant</strong>: arquivamento com acesso em milissegundos.</li><li><strong>S3 Glacier Flexible</strong>: retrieval de 1-12 horas. Backup anual.</li><li><strong>S3 Glacier Deep Archive</strong>: mais barato ($0.001/GB). Retrieval 12-48h. Retenção de 7+ anos.</li></ul>Use <strong>S3 Lifecycle policies</strong> para mover automaticamente objetos entre classes com o tempo.',
    tip: 'Mencione Lifecycle policies — é o que diferencia arquitetura de custo otimizado de pay-as-you-go ingênuo.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre SQS, SNS e EventBridge?',
    a: '<strong>SQS</strong>: fila de mensagens point-to-point. Produtor publica, consumidor lê. Standard (at-least-once) ou FIFO (exactly-once, ordenada). DLQ para mensagens com falha.<br><br><strong>SNS</strong>: pub/sub. Tópico → múltiplos subscribers (SQS, Lambda, HTTP, email, SMS). Fan-out: um evento vai para múltiplos destinos.<br><br><strong>EventBridge</strong>: event bus serverless com roteamento avançado. Filtra por conteúdo do evento. Integra com 200+ SaaS (Stripe, GitHub, Zendesk). Schema registry.<br><br><strong>Padrão combinado:</strong> SNS → múltiplas SQS (fan-out + durabilidade). EventBridge para arquitetura event-driven complexa.',
    tip: 'Fan-out: SNS tópico → N filas SQS (uma por consumidor). Garante que cada consumidor processa independentemente com DLQ própria.',
  },
  {
    level: 'Pleno',
    q: 'O que é o IAM principle of least privilege e como aplicar?',
    a: '<strong>Least privilege</strong>: conceder apenas as permissões mínimas necessárias para realizar a tarefa.<br><br><strong>Como aplicar:</strong><ol><li>Começar negando tudo (deny all implícito no IAM)</li><li>Adicionar apenas permissões necessárias com recursos específicos (não wildcards)</li><li>Usar IAM Access Analyzer para detectar permissões excessivas</li><li>Revisar regularmente com IAM Credential Report</li><li>Usar SCP (Service Control Policies) no AWS Organizations para hard limits</li></ol><br><strong>Exemplo ruim:</strong> s3:* em * quando só precisa de s3:GetObject no bucket específico.',
    tip: 'Mencione IAM Access Analyzer e SCPs — ferramentas que demonstram maturidade de segurança além do básico.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o CloudFront e quando usar Origin Access Control (OAC)?',
    a: '<strong>CloudFront</strong>: CDN global com 400+ PoPs. Cache de conteúdo na borda, próximo ao usuário final. Reduz latência e custo de egress da origem.<br><br><strong>OAC (Origin Access Control)</strong>: permite CloudFront acessar S3 privado sem expô-lo publicamente. CloudFront assina requests com SigV4 — S3 bucket policy permite acesso apenas do CloudFront. Substitui o OAI (Origin Access Identity) mais antigo.<br><br><strong>Sem OAC:</strong> você precisa abrir o bucket publicamente — má prática de segurança.',
    tip: 'OAC vs OAI: prefira sempre OAC (suporte a S3 Object Lambda, regiões novas, SigV4 obrigatório). OAI é legacy.',
  },
  {
    level: 'Pleno',
    q: 'O que são Reserved Instances e Savings Plans?',
    a: '<strong>On-Demand</strong>: paga por hora sem compromisso. Preço cheio.<br><br><strong>Reserved Instances (RI)</strong>: compromisso de 1 ou 3 anos para um tipo específico de instância. Desconto de até 72%.<br><br><strong>Savings Plans</strong>: compromisso de gasto por hora por 1 ou 3 anos. Mais flexível que RI:<br>• Compute Savings Plan: cobre EC2, Fargate e Lambda (qualquer família, região, OS)<br>• EC2 Savings Plan: específico por família e região (maior desconto)<br><br><strong>Spot Instances</strong>: capacidade ociosa AWS com 90% de desconto. AWS pode interromper com 2 min de aviso. Use para batch, CI/CD workers, ML training.',
    tip: 'Savings Plans são o padrão moderno (mais flexíveis que RI). Compute Savings Plan é o melhor ROI para infraestrutura mista.',
  },
  {
    level: 'Senior',
    q: 'Explique o AWS Well-Architected Framework.',
    a: 'Framework de 6 pilares para avaliar e melhorar arquiteturas AWS:<br><br><ul><li><strong>Operational Excellence</strong>: operações como código, runbooks, CI/CD, monitoring</li><li><strong>Security</strong>: IAM least privilege, KMS, CloudTrail, GuardDuty, WAF</li><li><strong>Reliability</strong>: Multi-AZ, auto-scaling, circuit breakers, chaos engineering</li><li><strong>Performance Efficiency</strong>: tipo de instância correto, caching, CDN, auto-scaling</li><li><strong>Cost Optimization</strong>: Savings Plans, rightsizing, Spot, lifecycle policies</li><li><strong>Sustainability</strong>: eficiência energética, managed services, regiões verdes</li></ul><br>Use o <strong>AWS Well-Architected Tool</strong> para avaliação formal e recomendações por pilar.',
    tip: 'Dar 1-2 exemplos de tradeoffs entre pilares diferencia o sênior: HA aumenta custo (Reliability vs Cost Optimization).',
  },
  {
    level: 'Senior',
    q: 'Como implementar disaster recovery na AWS? Quais são as estratégias?',
    a: '<strong>4 estratégias de DR (do mais simples ao mais caro):</strong><br><br>1. <strong>Backup and Restore</strong> (RPO horas, RTO horas): backups S3 + AMI snapshots. Restauração manual.<br><br>2. <strong>Pilot Light</strong> (RPO minutos, RTO menor que 1h): versão mínima em outra região (DB replicado, EC2 desligado). Ligar e escalar quando necessário.<br><br>3. <strong>Warm Standby</strong> (RPO menor que 5min, RTO minutos): versão reduzida sempre ativa na região DR. RDS Multi-Region, Route 53 failover.<br><br>4. <strong>Multi-Site Active-Active</strong> (RPO~0, RTO~0): ambas as regiões ativas com tráfego dividido. DynamoDB Global Tables, Aurora Global Database.',
    tip: 'O entrevistador quer saber se você conhece RPO/RTO e sabe mapear estratégia ao custo. Não existe DR ideal, existe DR adequado ao risco.',
  },
  {
    level: 'Pleno',
    q: 'O que é o NAT Gateway e por que é necessário em subnets privadas?',
    a: '<strong>NAT Gateway</strong>: permite que instâncias em subnets privadas iniciem conexões de saída para a internet sem que a internet inicie conexões de entrada.<br><br>Instâncias em subnets privadas não têm endereço IP público nem rota para IGW. Para baixar pacotes, chamar APIs externas (Stripe, SendGrid) ou instalar updates, precisam do NAT Gateway.<br><br><strong>Configuração:</strong> NAT Gateway fica na subnet pública com IP Elastic. Route table da subnet privada aponta 0.0.0.0/0 para o NAT GW.<br><br><strong>Custo:</strong> NAT Gateway cobra por hora + por GB processado. Use VPC Endpoints para serviços AWS (S3, DynamoDB) e elimine esse custo.',
    tip: 'VPC Endpoints eliminam o custo de NAT Gateway para tráfego interno AWS — S3 Gateway Endpoint é gratuito e deve sempre ser usado.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o CloudWatch? O que são métricas, alarmes e log groups?',
    a: '<strong>CloudWatch Metrics</strong>: dados numéricos em série temporal. Todo serviço AWS publica métricas automaticamente (CPUUtilization, RequestCount, etc.).<br><br><strong>CloudWatch Alarms</strong>: monitora uma métrica e executa ação quando cruza threshold. Ações: notificar via SNS, escalar Auto Scaling Group.<br><br><strong>Log Groups</strong>: container de log streams. Cada Lambda execution cria um log stream dentro do log group. Configure sempre a política de retenção — padrão é Never Expire (caro).<br><br><strong>CloudWatch Insights</strong>: query SQL-like em logs. Essencial para debugging distribuído.',
    tip: 'Configure sempre: alarme de CPU, alarme de billing, e log retention policy. Logs sem retenção crescem indefinidamente.',
  },
  {
    level: 'Senior',
    q: 'O que é o Secrets Manager e como configurar rotação automática?',
    a: '<strong>Secrets Manager</strong>: armazena e rotaciona secrets (DB passwords, API keys, OAuth tokens). Mais seguro que variáveis de ambiente em plaintext.<br><br><strong>Rotação automática:</strong> AWS cria uma Lambda de rotação automaticamente para RDS — zero config. Para outros secrets, você escreve a Lambda seguindo o padrão: createSecret → setSecret → testSecret → finishSecret.<br><br><strong>Acesso na aplicação:</strong> use o SDK para buscar o valor atual — sem hardcode de versão. A aplicação sempre pega o segredo mais recente.<br><br><strong>Custo:</strong> $0.40/secret/mês + $0.05 por 10.000 chamadas de API.',
    tip: 'Rotação automática para RDS é zero-config — mencione isso. Para custom secrets, explique o padrão de 4 etapas da Lambda.',
  },
  {
    level: 'Pleno',
    q: 'Explique Auto Scaling e como configurar no ECS/EC2.',
    a: '<strong>Auto Scaling</strong>: ajusta automaticamente a capacidade baseado em métricas ou schedule.<br><br><strong>EC2 Auto Scaling Groups:</strong> Scale out quando CPU maior que 70% por 2 minutos. Scale in quando CPU menor que 30% por 10 minutos. Min/desired/max capacity define os limites.<br><br><strong>ECS Service Auto Scaling:</strong><br>• Target Tracking: mantém CPU em 60% automaticamente<br>• Step Scaling: adiciona N tasks por range de CPU<br>• Scheduled Scaling: aumenta antes de pico previsível<br>• Scale-in protection evita que task em processamento seja terminada',
    tip: 'Target Tracking é a forma mais simples e recomendada. Mencione scale-in protection para processadores de fila (SQS).',
  },
  {
    level: 'Senior',
    q: 'Como funciona o AWS Lambda em relação a VPC, cold starts e concorrência?',
    a: '<strong>Concorrência:</strong> Lambda escala adicionando instâncias paralelas. Soft limit padrão: 1000 simultâneas por região. Reserved concurrency reserva cota para uma função. Provisioned concurrency mantém instâncias aquecidas.<br><br><strong>Cold Start:</strong> primeira invocação inicializa o runtime + carrega o código + executa código fora do handler. Tempo: 100ms-1s (Python/Node) a 2-5s (Java sem SnapStart).<br><br><strong>Lambda em VPC:</strong> adiciona ENI para acesso a recursos privados. Aumenta significativamente o cold start. Mitigue com RDS Proxy (pool de conexões), SnapStart (Java) ou Provisioned Concurrency.',
    tip: 'Sênior deve saber o tradeoff VPC: acesso a recursos privados vs cold start mais lento. Mencionar RDS Proxy mostra conhecimento de produção.',
  },
  {
    level: 'Pleno',
    q: 'O que é o ECS e como funciona a diferença entre task definition e service?',
    a: '<strong>Task Definition</strong>: blueprint imutável. Define: imagem Docker, CPU/memória, variáveis de ambiente, ports, volumes, IAM role, log configuration. Versionada — cada atualização cria nova revisão.<br><br><strong>Task</strong>: instância de uma task definition em execução.<br><br><strong>ECS Service</strong>: garante que N tasks de uma task definition ficam rodando continuamente. Se uma task cair, o Service lança outra. Integra com ALB (auto-registra tasks). Suporta rolling deployments e Blue/Green via CodeDeploy.',
    tip: 'Analogia: Task Definition = Dockerfile (define como rodar). Service = systemd (garante que está sempre rodando). Cluster = servidor (onde rodam).',
  },
]

// ── Dados: Cheatsheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'EC2 t3.micro', sig: 'Free tier eligible, 2 vCPU, 1 GB RAM', desc: 'Ponto de entrada — use para prototipagem e aprendizado' },
  { name: 'RDS Multi-AZ', sig: 'multi_az = true', desc: 'Replica síncrona em outra AZ, failover automático em menos de 60s' },
  { name: 'S3 Block Public', sig: 'block_public_acls = true', desc: 'Sempre ativo em produção — use CloudFront OAC para servir assets' },
  { name: 'Lambda 15min', sig: 'timeout = 900 (máximo)', desc: 'Limite absoluto de execução; use ECS Fargate para jobs mais longos' },
  { name: 'SQS Visibility Timeout', sig: 'default 30s, max 12h', desc: 'Tempo que mensagem fica invisível após ser recebida; deve ser maior que tempo de processamento' },
  { name: 'S3 Multipart Upload', sig: 'min: 5MB, recomendado: >100MB', desc: 'Para arquivos grandes — use SDK que faz automaticamente' },
  { name: 'DynamoDB Capacity Modes', sig: 'PROVISIONED | PAY_PER_REQUEST', desc: 'PAY_PER_REQUEST para tráfego imprevisível; PROVISIONED + autoscaling para tráfego previsível' },
  { name: 'CloudWatch Logs Retention', sig: '1 | 3 | 5 | 7 | 14 | 30 | 60 | 90 | 120 | 150 | 180 | 365 | 400 | 545 | 731 | 1096 | 1827 | 2192 | 2557 | 2922 | 3288 | never', desc: 'Sempre defina retenção — Never Expire é o padrão e é caro' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true,  t: 'Sempre Multi-AZ em produção — RDS, ElastiCache, ALB' },
  { ok: true,  t: 'Roles para serviços, nunca Access Keys hardcoded' },
  { ok: true,  t: 'Subnets privadas para dados (RDS, ElastiCache, ECS)' },
  { ok: true,  t: 'S3 Block Public Access sempre ativo — use CloudFront OAC' },
  { ok: true,  t: 'VPC Endpoints para serviços AWS (S3 Gateway = grátis)' },
  { ok: true,  t: 'Tags obrigatórias: Environment, Team, CostCenter' },
  { ok: true,  t: 'Delete protection em RDS e DynamoDB de produção' },
  { ok: true,  t: 'Savings Plans para workloads estáveis — 66% off' },
  { ok: false, t: 'Usar credenciais hardcoded no código ou variáveis de ambiente' },
  { ok: false, t: 'S3 bucket público sem CloudFront na frente' },
  { ok: false, t: 'Lambda sem DLQ em arquiteturas event-driven críticas' },
  { ok: false, t: 'RDS Single-AZ em produção — ponto único de falha' },
  { ok: false, t: 'IAM policies com AdministratorAccess em produção' },
  { ok: false, t: 'CloudWatch Logs sem retention policy — custo crescente' },
]

// ── Dados: Quick Ref CLI ──────────────────────────────────────────────────────

const CLI_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'EC2',
        entries: [
          { key: 'Listar instâncias rodando', value: 'aws ec2 describe-instances --filters "Name=instance-state-name,Values=running"' },
          { key: 'Iniciar instância', value: 'aws ec2 start-instances --instance-ids i-xxx' },
          { key: 'Parar instância', value: 'aws ec2 stop-instances --instance-ids i-xxx' },
          { key: 'Ver SG', value: 'aws ec2 describe-security-groups --group-ids sg-xxx' },
        ],
      },
      {
        title: 'S3',
        entries: [
          { key: 'Upload', value: 'aws s3 cp arquivo.txt s3://bucket/pasta/' },
          { key: 'Sync pasta', value: 'aws s3 sync ./pasta s3://bucket/ --exclude "*.log"' },
          { key: 'Presigned URL', value: 'aws s3 presign s3://bucket/key --expires-in 3600' },
          { key: 'Listar objetos', value: 'aws s3 ls s3://bucket/ --recursive --human-readable' },
        ],
      },
      {
        title: 'IAM',
        entries: [
          { key: 'Ver policies da role', value: 'aws iam list-attached-role-policies --role-name MinhaRole' },
          { key: 'Simular permissão', value: 'aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::xxx:role/Role --action-names s3:GetObject --resource-arns arn:aws:s3:::bucket/*' },
          { key: 'Identidade atual', value: 'aws sts get-caller-identity' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Lambda',
        entries: [
          { key: 'Invocar Lambda', value: 'aws lambda invoke --function-name MinhaFuncao output.json' },
          { key: 'Deploy código', value: 'aws lambda update-function-code --function-name MinhaFuncao --zip-file fileb://lambda.zip' },
          { key: 'Ver configuração', value: 'aws lambda get-function-configuration --function-name MinhaFuncao' },
          { key: 'Filtrar erros', value: 'aws logs filter-log-events --log-group-name /aws/lambda/MinhaFuncao --filter-pattern ERROR' },
        ],
      },
      {
        title: 'ECS',
        entries: [
          { key: 'Listar tasks', value: 'aws ecs list-tasks --cluster meu-cluster --family minha-task' },
          { key: 'Forçar redeploy', value: 'aws ecs update-service --cluster meu-cluster --service meu-service --force-new-deployment' },
          { key: 'Status do service', value: 'aws ecs describe-services --cluster meu-cluster --services meu-service' },
          { key: 'Shell no container', value: 'aws ecs execute-command --cluster meu-cluster --task task-id --container app --interactive --command "/bin/sh"' },
        ],
      },
      {
        title: 'CloudWatch',
        entries: [
          { key: 'Stream de logs', value: 'aws logs tail /aws/lambda/MinhaFuncao --follow' },
          { key: 'Criar alarme', value: 'aws cloudwatch put-metric-alarm --alarm-name CPU-Alto --metric-name CPUUtilization --namespace AWS/EC2 --threshold 80 --comparison-operator GreaterThanThreshold --evaluation-periods 2 --period 300 --statistic Average' },
        ],
      },
    ],
  },
]

// ── Dados: Comparative ────────────────────────────────────────────────────────

const COMP_OPTIONS: CompOption[] = [
  { name: 'EC2',        color: '#f59e0b' },
  { name: 'Lambda',     color: C },
  { name: 'ECS Fargate',color: '#a78bfa' },
  { name: 'EKS',        color: '#38bdf8' },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Gerenciamento de infra',
    category: 'Operação',
    values: { 'EC2': 'Total (OS, patches, AMI)', 'Lambda': 'Zero (serverless)', 'ECS Fargate': 'Mínimo (só task def)', 'EKS': 'Workers você, control plane AWS' },
  },
  {
    criterion: 'Modelo de custo',
    category: 'Financeiro',
    values: { 'EC2': 'Por hora (Reserved: -72%)', 'Lambda': 'Por invocação + ms', 'ECS Fargate': 'Por vCPU/mem/segundo', 'EKS': '$0.10/h control plane + workers' },
  },
  {
    criterion: 'Cold start',
    category: 'Performance',
    values: { 'EC2': 'Sem (sempre ligado)', 'Lambda': 'Sim (100ms a 5s)', 'ECS Fargate': 'Leve (~30s novo task)', 'EKS': 'Depende do HPA' },
    winner: 'EC2',
  },
  {
    criterion: 'Limite de execução',
    category: 'Limitações',
    values: { 'EC2': 'Ilimitada', 'Lambda': '15 minutos', 'ECS Fargate': 'Ilimitada', 'EKS': 'Ilimitada' },
    winner: 'ECS Fargate',
  },
  {
    criterion: 'Portabilidade',
    category: 'Estratégia',
    values: { 'EC2': 'Baixa (AMIs proprietárias)', 'Lambda': 'Muito baixa (API proprietary)', 'ECS Fargate': 'Alta (containers padrão)', 'EKS': 'Muito alta (K8s padrão)' },
    winner: 'EKS',
  },
]

const COMP_SCENARIOS: CompScenario[] = [
  { scenario: 'API REST com carga contínua', recommendation: 'ECS Fargate', reason: 'Sem cold start, sem gestão de EC2, integra com ALB nativamente.' },
  { scenario: 'Webhook esporádico (raro, rápido)', recommendation: 'Lambda', reason: 'Escala de 0 para milhares em segundos. Paga só quando executa.' },
  { scenario: 'Workload Kubernetes existente', recommendation: 'EKS', reason: 'Portabilidade e ecossistema completo. Karpenter para escala eficiente.' },
  { scenario: 'Software legado ou GPU', recommendation: 'EC2', reason: 'Controle total de OS, tipos especializados (GPU, NVMe, alta memória).' },
  { scenario: 'Job batch de ML (tolerante a interrupção)', recommendation: 'EC2 Spot + Batch', reason: '90% de desconto. AWS Batch gerencia filas e workers automaticamente.' },
]

// ── Dados: Mindmap ────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Computação',
    color: C,
    items: [
      { t: 'EC2', k: true },
      { t: 'Lambda', k: true },
      { t: 'ECS/Fargate', k: true },
      { t: 'EKS', a: true },
      { t: 'Batch', a: true },
    ],
  },
  {
    label: 'Storage',
    color: '#38bdf8',
    items: [
      { t: 'S3 + Classes', k: true },
      { t: 'EBS', k: true },
      { t: 'EFS', a: true },
      { t: 'Glacier', a: true },
    ],
  },
  {
    label: 'Banco de Dados',
    color: '#4ade80',
    items: [
      { t: 'RDS/Aurora', k: true },
      { t: 'DynamoDB', k: true },
      { t: 'ElastiCache', k: true },
      { t: 'Redshift', a: true },
    ],
  },
  {
    label: 'Rede e CDN',
    color: '#a78bfa',
    items: [
      { t: 'VPC + Subnets', k: true },
      { t: 'ALB / NLB', k: true },
      { t: 'CloudFront', k: true },
      { t: 'Route 53', k: true },
      { t: 'NAT Gateway', k: true },
    ],
  },
  {
    label: 'Segurança',
    color: '#ef4444',
    items: [
      { t: 'IAM', k: true },
      { t: 'KMS', k: true },
      { t: 'Secrets Manager', k: true },
      { t: 'WAF + Shield', a: true },
      { t: 'GuardDuty', a: true },
    ],
  },
  {
    label: 'Mensageria',
    color: '#fb923c',
    items: [
      { t: 'SQS', k: true },
      { t: 'SNS', k: true },
      { t: 'EventBridge', a: true },
      { t: 'Kinesis', a: true },
    ],
  },
  {
    label: 'Observabilidade',
    color: '#fbbf24',
    items: [
      { t: 'CloudWatch', k: true },
      { t: 'X-Ray', a: true },
      { t: 'CloudTrail', k: true },
      { t: 'AWS Config', a: true },
    ],
  },
  {
    label: 'DevOps / IaC',
    color: '#34d399',
    items: [
      { t: 'CloudFormation', a: true },
      { t: 'CDK', a: true },
      { t: 'CodePipeline', a: true },
      { t: 'CodeBuild', a: true },
    ],
  },
]

// ── Builders de PDF ───────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'AWS',
    stackLabel: 'Cloud',
  }),

  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'AWS',
    accentColor: C,
    stackLabel: 'Cloud / Infraestrutura',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'Use Reserved Instances ou Savings Plans para carga base (60-72% off)',
        'Spot Instances para batch e CI/CD — 90% off com tolerância a interrupção',
        'VPC Endpoints eliminam custo de NAT Gateway para serviços AWS',
        'CloudFront reduz egress cost e latência — sempre use para assets estáticos',
        'DynamoDB DAX reduz latência de leituras de milissegundos para microssegundos',
        'RDS Read Replicas para distribuir carga de leitura horizontalmente',
        'ElastiCache na frente de qualquer banco — reduz custo de queries repetidas',
        'S3 Lifecycle Policies para mover objetos automaticamente para classes mais baratas',
      ],
      patterns: [
        { name: 'Fan-out Pattern', code: 'SNS → [SQS-A, SQS-B, SQS-C]', desc: 'Um evento distribuído para múltiplos consumidores independentes com DLQ por fila' },
        { name: 'Saga Pattern', code: 'Step Functions → [Lambda-1, Lambda-2, Lambda-3, Compensate]', desc: 'Transações distribuídas com rollback compensatório em microserviços' },
        { name: 'CQRS + DynamoDB Streams', code: 'Write → DynamoDB → Stream → Lambda → Read Model', desc: 'Separar leituras de escritas com projeções materializada via Streams' },
        { name: 'Presigned URL Upload', code: 'Client → [GET /presign] → Server → S3 URL → Client → PUT S3', desc: 'Upload direto para S3 sem passar pelo backend — elimina latência e custo' },
      ],
      mentalModels: [
        'Segurança em camadas: VPC → SG → IAM → KMS — cada camada é uma linha de defesa',
        'Pay-per-use: prefira Lambda e Fargate onde carga é variável, EC2 onde é constante',
        'Managed > DIY: RDS Multi-AZ é mais confiável que Postgres em EC2 — deixe a AWS operar',
        'Stateless > Stateful: containers stateless escalam linearmente; evite estado local',
        'Egress cost awareness: dados saindo da AWS custam dinheiro — CloudFront e VPC Endpoints minimizam',
      ],
    },
  }),

  'quick-ref': () => buildQuickRefPdf({
    columns: CLI_COLUMNS,
    skillName: 'AWS CLI',
    accentColor: C,
    stackLabel: 'Cloud',
    tagline: 'Comandos essenciais AWS CLI — EC2, S3, Lambda, ECS, IAM, CloudWatch',
  }),

  comparative: () => buildComparativeRefPdf({
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    scenarios: COMP_SCENARIOS,
    skillName: 'AWS',
    accentColor: C,
    stackLabel: 'Cloud',
  }),

  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    skillName: 'AWS',
    accentColor: C,
    stackLabel: 'Cloud',
    checklist: [
      'IAM roles vs users vs groups — quando usar cada um',
      'VPC: subnets públicas vs privadas, IGW, NAT Gateway',
      'Security Group vs NACL — stateful vs stateless',
      'EC2 vs Lambda vs ECS/Fargate vs EKS — critérios de decisão',
      'RDS Multi-AZ vs Multi-Region — RPO e RTO de cada',
      'S3 classes de storage e lifecycle policies',
      'SQS vs SNS vs EventBridge — qual padrão para cada',
      'CloudWatch: métricas, alarmes e log groups',
      'IAM least privilege e IAM Access Analyzer',
      'Well-Architected Framework — 6 pilares com exemplos',
      'Disaster Recovery: Backup, Pilot Light, Warm Standby, Active-Active',
      'Savings Plans vs Reserved Instances vs Spot',
    ],
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function AwsPdfs() {
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
