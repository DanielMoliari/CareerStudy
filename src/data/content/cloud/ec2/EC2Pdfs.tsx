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
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'

// ── Paleta EC2 (AWS) ──────────────────────────────────────────────────────────
const C = '#FF9900'

// ── Cards de PDF ──────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista EC2',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa nível pleno e sênior: Spot, Auto Scaling, EBS gp3 vs io2, AMI baked, Placement Groups, IMDSv2, blue-green com ALB, hibernation, dedicated host, multi-tenancy, monitoramento e DR. Respostas com profundidade de entrevista.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'EC2 CLI Quick Ref',
    subtitle: 'Todos os comandos aws ec2 e autoscaling em um cartão A4',
    type: 'quick-ref',
    pages: 1,
    description: 'Cartão A4 landscape com 3 colunas: ciclo de vida (start/stop/terminate), gestão de EBS (modify-volume, snapshots), Auto Scaling Groups, Launch Templates, SSM Session Manager e troubleshooting. O que você precisa ter na mesa ao operar EC2.',
    icon: '02',
    goal: 'Referência de CLI',
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet EC2',
    subtitle: 'Famílias, EBS, precificação e regras de ouro em uma página',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: famílias de instância (T/M/C/R/I/G/P) com workloads ideais, tipos de EBS com IOPS e throughput, modelos de precificação com desconto típico, regras de ouro de produção e patterns comuns (mixed instances, golden AMI, blue-green).',
    icon: '03',
    goal: 'Consulta rápida',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns EC2',
    subtitle: 'Os 6 erros que mais aparecem em code review e auditoria',
    type: 'antipatterns',
    pages: 3,
    description: 'Diff errado x correto com explicação técnica: SSH aberto para 0.0.0.0/0, IMDSv1 habilitado, gp2 em produção nova, credenciais hardcoded no User Data, sem termination protection em recursos críticos e conexão direta ao DB sem RDS Proxy.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
]

// ── Q&As ──────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Quando usar Spot Instances?',
    a: 'Workloads tolerantes a interrupção: batch processing, CI/CD workers, treinamento de ML, rendering. <strong>Nunca</strong> para produção stateful sem estratégia de checkpointing.<br><br>Sempre implemente interrupt handler (SIGTERM) que salva estado antes dos 2 minutos de aviso da AWS. Combine Spot com On-demand no ASG (base On-demand, escala em Spot) para garantir capacidade mínima.',
    tip: 'Mencione mixed_instances_policy como o padrão de produção: base On-Demand garantida + escala em Spot diversificada. É o que diferencia quem usou Spot real de quem só leu sobre.',
  },
  {
    level: 'Pleno',
    q: 'Como desenharia Auto Scaling para uma API REST?',
    a: 'Launch Template com AMI baked (app já instalada — boot rápido). ASG em multi-AZ (pelo menos 2 AZs). Target Tracking Policy: CPUUtilization target 60% ou ALBRequestCountPerTarget.<br><br>Application Load Balancer com health check no endpoint /health. Scale-in protection para instâncias processando jobs longos. Cooldown de 300s para evitar scale-in prematuro após scale-out.',
    tip: 'Detalhe que diferencia: prefira ALBRequestCountPerTarget sobre CPUUtilization para APIs — escala antes do CPU saturar e mantém latência consistente.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre EBS gp2, gp3 e io2?',
    a: '<strong>gp2:</strong> IOPS vinculado ao tamanho (3 IOPS/GB, burst até 3.000). Legado — evitar em produção nova.<br><br><strong>gp3:</strong> IOPS e throughput configuráveis independentemente do tamanho (baseline 3.000 IOPS, até 16.000). 20% mais barato que gp2. Padrão para uso geral.<br><br><strong>io2/io2 Block Express:</strong> IOPS provisionadas até 256.000, latência sub-milissegundo. Para bancos de dados com I/O intensivo (Oracle, SQL Server). Custo alto — use só quando necessário.',
    tip: 'Migrar de gp2 para gp3 não tem downtime via Elastic Volumes. É o low-hanging fruit de redução de custo em qualquer conta AWS antiga.',
  },
  {
    level: 'Senior',
    q: 'O que é uma AMI e como automatizaria o processo de criação?',
    a: 'AMI (Amazon Machine Image) é um snapshot do estado de um EC2: OS, configurações, software instalado. Base para Launch Templates e ASG.<br><br>Pipeline de golden AMI: EC2 Image Builder (ou Packer + CI) instala dependências, roda testes de smoke, cria AMI, publica ARN. ASG usa a nova AMI no próximo refresh de instâncias. Immutable infrastructure: não atualize instâncias em produção — recrie com nova AMI.',
    tip: 'Sempre mencione Instance Refresh com MinHealthyPercentage: é o mecanismo que torna golden AMI viável em produção sem downtime.',
  },
  {
    level: 'Senior',
    q: 'Como funcionam Placement Groups e quando importam?',
    a: '<strong>Cluster:</strong> instâncias no mesmo rack físico, rede de 100 Gbps entre elas, latência menor que 10 microssegundos. Para HPC, MPI, jobs que precisam de comunicação intensiva entre nós. Risco: falha de rack afeta todas.<br><br><strong>Spread:</strong> cada instância em hardware diferente, máxima isolação de falha. Para aplicações críticas com poucas instâncias (máximo 7 por AZ).<br><br><strong>Partition:</strong> grupos de instâncias isoladas entre si, mas instâncias dentro do mesmo partition compartilham hardware. Para Hadoop, Cassandra, HDFS — onde você quer isolamento por shard, não por instância.',
    tip: 'Em entrevista, explique o trade-off: Cluster = velocidade > durabilidade, Spread = durabilidade > escala, Partition = isolamento estrutural por shard.',
  },
  {
    level: 'Senior',
    q: 'Como reduziria custo de EC2 em produção?',
    a: '1. <strong>Rightsizing:</strong> AWS Compute Optimizer analisa CloudWatch e sugere instância mais barata com mesma performance.<br><br>2. <strong>Savings Plans:</strong> commita $X/hora por 1-3 anos. Mais flexível que Reserved Instances.<br><br>3. <strong>Spot para workers:</strong> ASG misto com base On-demand e escala em Spot.<br><br>4. <strong>Schedule:</strong> desligar ambientes não-prod fora do horário comercial (Lambda + EventBridge).<br><br>5. <strong>Graviton:</strong> instâncias ARM (m7g, c7g) 20-40% mais baratas com mesma performance para a maioria das workloads.',
    tip: 'A ordem de aplicação importa: rightsizing primeiro (não compre Reserved errado). Depois Graviton onde compila. Depois Savings Plans para baseline. Spot para workers escaláveis.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Launch Template e Launch Configuration?',
    a: '<strong>Launch Configuration</strong> é o formato legado — imutável (não pode editar, só criar nova versão), sem suporte a instâncias diversas no mesmo ASG, sem suporte a Spot + On-demand mix, depreciado pela AWS.<br><br><strong>Launch Template</strong> é o formato atual — versionado (edita criando nova versão, ASG pode usar $Latest ou $Default), suporta Fleet e Spot mix na mesma ASG, suporta várias famílias de instância para diversidade de Spot, suporta instance requirements (ao invés de tipo específico).<br><br>Sempre use Launch Templates — Launch Configurations não recebem novas features da AWS.',
    tip: 'Se a entrevista pergunta Launch Configuration, é uma chance de demonstrar atualidade: explique que está depreciado e sempre use Launch Template.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o IMDSv2 e por que IMDSv1 é perigoso?',
    a: 'O Instance Metadata Service (IMDS) é um endpoint local (169.254.169.254) que fornece informações sobre a instância: IP, region, IAM role credentials, user data.<br><br><strong>IMDSv1</strong> é stateless — qualquer processo na instância faz um GET e obtém dados, incluindo as credenciais temporárias da IAM Role. Vulnerabilidade: SSRF. Se a aplicação faz requisições para URLs fornecidas pelo usuário sem sanitização, um atacante envia uma URL apontando para o IMDS e rouba as credenciais da Role em segundos.<br><br><strong>IMDSv2</strong> exige um token de sessão obtido via PUT com TTL. O token não pode ser obtido por SSRF (a maioria dos proxies HTTP não faz PUT cross-domain). Configure via Metadata Options: HttpTokens=required.',
    tip: 'O ataque concreto da Capital One em 2019 foi exatamente esse: SSRF + IMDSv1. Mencionar esse caso real fixa a urgência de IMDSv2.',
  },
  {
    level: 'Senior',
    q: 'Como desenharia um pipeline de golden AMI automatizado?',
    a: '<strong>EC2 Image Builder (opção nativa AWS):</strong> pipeline declarativo — define a imagem base (Amazon Linux 2023), componentes (instala Docker, Node.js, configura systemd), testes (health check, smoke test), distribui para múltiplas regiões. Dispara em schedule ou via CI.<br><br><strong>Packer + CI (alternativa):</strong> Packer HCL define a imagem, GitHub Actions roda packer build, AMI é publicada com tag Environment=base,Version=1.2.3. ASG usa data source do Terraform para obter a AMI mais recente com as tags corretas.<br><br><strong>Instance Refresh:</strong> após nova AMI disponível, atualiza o Launch Template e chama aws autoscaling start-instance-refresh. ASG substitui instâncias gradualmente (ex: 20% por vez, aguardando health check passar) sem downtime.',
    tip: 'Imutabilidade > patches: nunca atualizar instância em produção. Sempre criar nova AMI e fazer Instance Refresh. É o que diferencia maturidade de operações.',
  },
  {
    level: 'Pleno',
    q: 'Explique a diferença entre tipos de monitoramento EC2 — Basic vs Detailed.',
    a: '<strong>Basic Monitoring (padrão, gratuito):</strong> métricas do CloudWatch publicadas a cada 5 minutos — CPU, rede, disco, status checks.<br><br><strong>Detailed Monitoring (pago):</strong> métricas publicadas a cada 1 minuto. Necessário quando o ASG precisa reagir rapidamente a picos de CPU.<br><br><strong>Enhanced Monitoring (nível de OS):</strong> CPU steal, processos, memória, I/O por processo — via CloudWatch Agent. Coleta métricas que o hypervisor não vê (memória, disco de SO).<br><br><strong>Status Checks:</strong> System Status Check (problema no hardware AWS) e Instance Status Check (problema no SO ou aplicação). Crie alarme CloudWatch que faz auto-recover em System Status Check failure.',
    tip: 'Memória é o gap clássico: o hypervisor não vê uso de RAM. Sem CloudWatch Agent, você não sabe se sua instância está com memory pressure.',
  },
  {
    level: 'Pleno',
    q: 'O que é Elastic IP e quando usar?',
    a: 'Elastic IP é um IPv4 público estático alocado à sua conta AWS — persiste mesmo após stop/start da instância. Útil quando você precisa de IP fixo: whitelist de parceiro/firewall externo, configuração DNS de baixo TTL, instância que precisa de IP constante.<br><br><strong>Custo:</strong> Elastic IP é gratuito enquanto associado a uma instância running. Cobra $0.005/h se não associado (ou associado a instância parada). AWS limita 5 EIPs por conta por região (limite aumentável).<br><br><strong>Alternativas melhores na maioria dos casos:</strong> Route 53 com CNAME para o DNS público da instância. ALB com IP estático via Global Accelerator. NLB com IP estático nativo (sem EIP necessário).',
    tip: 'Elastic IP esquecido (não associado) é uma das fontes mais comuns de cost leak. Sempre tenha alarme em ec2:UnassociatedElasticIPs.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Instance Store e EBS? Como escolher?',
    a: '<strong>Instance Store:</strong> discos NVMe soldados fisicamente no servidor onde a instância roda. Latência de microssegundos, IOPS e throughput máximos (não tem limite de rede). <strong>Efêmero:</strong> dados perdidos em stop, hibernate, terminate ou falha de hardware. Disponível apenas em tipos específicos (i3, d2, h1, alguns c5d, m5d).<br><br><strong>EBS:</strong> storage de rede — o disco está em outro servidor conectado via rede de alta velocidade. Persiste após stop/start/terminate. Suporta snapshots. Limites de IOPS/throughput por volume e por instância.<br><br><strong>Como escolher:</strong> dados críticos, banco de dados, SO → EBS (sempre). Cache local, buffer de processamento, scratch de ML → Instance Store (mais rápido, mais barato por IOPS). Combinação comum: SO + dados no EBS, temporários no Instance Store.',
    tip: 'A regra de ouro: se a perda dos dados ao parar a instância seria catastrófica, use EBS. Instance Store é para tudo que pode ser reconstruído.',
  },
  {
    level: 'Senior',
    q: 'Como gerenciaria patches de segurança em uma frota de EC2?',
    a: '<strong>Abordagem imutável (preferida):</strong> pipeline de golden AMI constrói nova imagem com patches aplicados, publica. ASG faz Instance Refresh substituindo instâncias antigas pela nova AMI. Zero SSH em produção, zero configuration drift.<br><br><strong>AWS Systems Manager Patch Manager:</strong> para instâncias com SSM Agent instalado, define Patch Baselines (quais patches aplicar por severity) e Maintenance Windows (quando aplicar). Relatórios de compliance mostram instâncias fora do padrão.<br><br><strong>AWS Systems Manager Session Manager:</strong> substitui SSH (sem portas abertas, sem key pairs) — acesso ao terminal via IAM, auditado no CloudTrail.<br><br>Em hipótese alguma deixar porta 22 aberta para 0.0.0.0/0 no Security Group — é o vetor de ataque mais comum em EC2.',
    tip: 'A abordagem imutável + SSM Session Manager é a resposta de produção sênior moderna. Patch Manager é fallback para instâncias legadas que não podem ser substituídas.',
  },
  {
    level: 'Senior',
    q: 'O que é Hibernation no EC2 e quando faz sentido?',
    a: 'Hibernation salva o conteúdo da RAM no EBS root volume (criptografado obrigatoriamente) e para a instância. Na retomada, o estado da memória é restaurado — a instância volta exatamente de onde parou, sem reiniciar aplicações ou recarregar estado.<br><br><strong>Quando faz sentido:</strong> aplicações com inicialização lenta (JVM, carregamento de modelos ML, aquecimento de caches) onde o tempo de boot é um problema. Ambientes de desenvolvimento onde você quer continuar o trabalho sem perder estado. Workloads com estado em memória que seriam custosos de reconstruir.<br><br><strong>Requisitos:</strong> instância com menos de 150 GB de RAM. EBS root criptografado. Família suportada (C, I, M, R, T e outros). Hibernation habilitado no Launch Template. Não suportado em instâncias Spot de longa duração.',
    tip: 'Hibernation é underrated — muitos esquecem que existe. Mencione caso de uso real (caches em memória, JVM lenta) para mostrar profundidade.',
  },
  {
    level: 'Senior',
    q: 'Como faria deploy blue-green com EC2 e ALB?',
    a: 'Deploy blue-green elimina downtime e permite rollback instantâneo. Estrutura: dois Target Groups (blue e green) atrás do mesmo ALB.<br><br><strong>Fluxo:</strong> (1) Blue = produção atual com 100% do tráfego. (2) Provisionar ASG green com a nova versão via Instance Refresh ou nova instância. (3) Registrar instâncias green no Target Group green. (4) ALB Weighted Target Group: direcionar 10% para green (canary). Monitorar erros e latência no CloudWatch. (5) Gradualmente aumentar para 50% para 100% para green. (6) Quando green = 100%, desalocar blue. (7) Rollback: mudar o peso de volta para blue instantaneamente (em menos de 30s).<br><br>Alternativamente: Route 53 weighted routing entre dois ALBs (blue e green) — mais flexível para múltiplas regiões.',
    tip: 'Rollback em menos de 30 segundos é o que diferencia blue-green de outros patterns. Sempre mencione esse número — é o argumento de venda.',
  },
  {
    level: 'Pleno',
    q: 'O que são Security Groups e como diferem das NACLs?',
    a: '<strong>Security Groups (SG):</strong> firewall stateful no nível da instância/interface de rede (ENI). Stateful significa que a resposta de uma conexão permitida entra automaticamente, sem regra de retorno explícita. Regras apenas de Allow (não tem Deny). Aplicam-se a instâncias individuais e podem referenciar outros SGs (ex: permitir do SG do ALB em vez de um CIDR).<br><br><strong>Network ACLs (NACL):</strong> firewall stateless no nível da subnet. Stateless = você precisa de regras de Allow explícitas para entrada E saída de cada conexão (incluindo as respostas, que usam portas efêmeras 1024-65535). Suportam regras de Allow E Deny. Avaliadas em ordem numérica.<br><br>Regra prática: use SGs para 99% dos casos. NACLs só para bloqueio de IPs específicos na subnet (ex: bloquear range de IPs maliciosos, compliance que exige defense in depth).',
    tip: 'Em entrevista, a resposta completa sempre menciona stateful vs stateless como a diferença fundamental, não apenas o nível (instância vs subnet).',
  },
  {
    level: 'Pleno',
    q: 'Como configuraria monitoramento de custos para não ser surpreendido na fatura AWS?',
    a: '<strong>Billing Alarm (obrigatório desde o primeiro dia):</strong> CloudWatch alarm no total de cobrança estimada. Habilite via Billing Console e Receive Billing Alerts. Crie alarme em $10, $50 e $100.<br><br><strong>AWS Budgets:</strong> orçamentos por serviço, equipe ou conta. Alertas em % do orçamento (ex: alerta quando atingir 80%). Pode disparar ação automática (desabilitar IAM, aplicar SCP) quando ultrapassar.<br><br><strong>Cost Explorer:</strong> análise retroativa de custo por serviço, região, tag, conta.<br><br><strong>Resource Tags:</strong> tag Project e Environment em todos os recursos desde o início. Use AWS Config rule required-tags para enforcement.<br><br><strong>Cost Anomaly Detection:</strong> ML que detecta gastos incomuns e envia alerta.',
    tip: 'Tags desde o primeiro dia. Adicionar tags depois é praticamente impossível em frota grande — é onde quase todas as contas falham.',
  },
  {
    level: 'Pleno',
    q: 'Como o EBS garante performance com gp3 vs io2? Quando usar cada um?',
    a: '<strong>gp3:</strong> SSD de propósito geral. Performance desacoplada do tamanho. Baseline: 3.000 IOPS + 125 MB/s incluídos sem custo adicional. Pode escalar até 16.000 IOPS e 1.000 MB/s. 20% mais barato que gp2. <strong>Use para:</strong> SO de instâncias, aplicações web, bancos de dados de baixo a médio I/O (PostgreSQL com menos de 10k IOPS).<br><br><strong>io2/io2 Block Express:</strong> IOPS provisionadas de até 256.000 com latência sub-milissegundo garantida por SLA. Durabilidade de 99.999% (vs 99.8-99.9% dos gp3). io2 Block Express suporta multi-attach (mesma volume montada em múltiplas instâncias simultaneamente — para clusters de alta disponibilidade). <strong>Use para:</strong> Oracle, SQL Server, SAP HANA, bancos com requisito de I/O crítico.<br><br>Regra: comece com gp3 para tudo. Só migre para io2 se a aplicação saturar o gp3 ou exigir garantia de latência sub-ms por SLA.',
    tip: 'A diferença de durabilidade é frequentemente esquecida: 99.999% (io2) vs 99.8% (gp3). Para bancos críticos onde o EBS é o storage primário, isso é um argumento forte.',
  },
  {
    level: 'Senior',
    q: 'O que é Dedicated Instance vs Dedicated Host e quando são necessários?',
    a: '<strong>Dedicated Instance:</strong> instância que roda em hardware físico dedicado para sua conta (não compartilhado com outras contas AWS). Não há controle sobre qual servidor físico específico. Cobra por instância. Suficiente para compliance básico de isolamento de hardware.<br><br><strong>Dedicated Host:</strong> servidor físico inteiro alocado para você. Você controla qual servidor específico (e quando substituí-lo). Visibilidade dos sockets e núcleos físicos. Suporte a licenças de software baseadas em sockets/núcleos (Oracle, Windows Server com licença BYOL). Cobra por host/hora.<br><br><strong>Quando são necessários:</strong> compliance regulatório que exige isolamento físico entre clientes (HIPAA, PCI em alguns contextos). BYOL: Oracle Database com licença baseada em processador. Auditoria que exige saber exatamente em qual servidor físico os dados residem.',
    tip: 'BYOL (Bring Your Own License) é o caso de uso 80% do tempo. Mencionar Oracle ou Windows Server com licença por socket demonstra experiência real com migrações.',
  },
  {
    level: 'Senior',
    q: 'Como implementaria Disaster Recovery com EC2?',
    a: '<strong>Backup & Restore (RTO horas):</strong> snapshots EBS e AMIs replicados para a região de DR. Em caso de desastre, restaurar snapshots e recriar instâncias. Mais barato, maior RTO.<br><br><strong>Pilot Light (RTO minutos):</strong> infraestrutura mínima rodando na região de DR — dados replicados, mas instâncias EC2 desligadas ou em número mínimo. Em desastre: ligar instâncias, escalar ASG, atualizar Route 53.<br><br><strong>Warm Standby (RTO minutos):</strong> ambiente completo rodando na região de DR em escala reduzida (1 instância onde prod tem 10). Em desastre: escalar via ASG + mudança de DNS. Detecta problemas mais cedo.<br><br><strong>Multi-Site Active/Active (RTO segundos):</strong> duas regiões com tráfego real simultâneo via Route 53 Latency-based routing. Sem failover — redundância constante.',
    tip: 'Sempre pergunte: qual é o RTO (tempo para voltar) e RPO (perda de dados aceitável) aceitável? A estratégia de DR deve ser dimensionada pelo que o negócio tolera.',
  },
]

// ── Quick Reference — comandos AWS CLI EC2 ──────────────────────────────────

const QR_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Ciclo de vida',
        entries: [
          { key: 'Listar rodando', value: 'aws ec2 describe-instances --filters "Name=instance-state-name,Values=running"' },
          { key: 'Iniciar', value: 'aws ec2 start-instances --instance-ids i-xxx' },
          { key: 'Parar', value: 'aws ec2 stop-instances --instance-ids i-xxx' },
          { key: 'Hibernar', value: 'aws ec2 stop-instances --hibernate --instance-ids i-xxx' },
          { key: 'Reiniciar', value: 'aws ec2 reboot-instances --instance-ids i-xxx' },
          { key: 'Terminar', value: 'aws ec2 terminate-instances --instance-ids i-xxx', badge: '!destrutivo', badgeColor: '#ef4444' },
          { key: 'Termination Protection', value: 'aws ec2 modify-instance-attribute --instance-id i-xxx --disable-api-termination', badge: 'producao', badgeColor: '#FF9900' },
          { key: 'Console output', value: 'aws ec2 get-console-output --instance-id i-xxx' },
        ],
      },
      {
        title: 'Metadata e segurança',
        entries: [
          { key: 'Forçar IMDSv2', value: 'aws ec2 modify-instance-metadata-options --instance-id i-xxx --http-tokens required', badge: 'seguranca', badgeColor: '#FF9900' },
          { key: 'SSM Session (sem SSH)', value: 'aws ssm start-session --target i-xxx', badge: 'preferido', badgeColor: '#4ade80' },
          { key: 'Ver SG', value: 'aws ec2 describe-security-groups --group-ids sg-xxx' },
          { key: 'Add IAM Role', value: 'aws ec2 associate-iam-instance-profile --instance-id i-xxx --iam-instance-profile Name=MyRole' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'EBS — volumes e snapshots',
        entries: [
          { key: 'Listar volumes', value: 'aws ec2 describe-volumes --filters "Name=attachment.instance-id,Values=i-xxx"' },
          { key: 'Criar snapshot', value: 'aws ec2 create-snapshot --volume-id vol-xxx --description "backup-$(date +%F)"' },
          { key: 'gp2 → gp3 sem downtime', value: 'aws ec2 modify-volume --volume-id vol-xxx --volume-type gp3 --iops 3000', badge: 'economia', badgeColor: '#4ade80' },
          { key: 'Resize volume', value: 'aws ec2 modify-volume --volume-id vol-xxx --size 200' },
          { key: 'Criar volume', value: 'aws ec2 create-volume --size 100 --volume-type gp3 --encrypted --availability-zone us-east-1a' },
          { key: 'Anexar volume', value: 'aws ec2 attach-volume --volume-id vol-xxx --instance-id i-xxx --device /dev/sdf' },
        ],
      },
      {
        title: 'AMI',
        entries: [
          { key: 'Buscar AMI mais recente', value: 'aws ec2 describe-images --owners amazon --filters "Name=name,Values=al2023-ami-*-x86_64" --query "Images|sort_by(@,&CreationDate)|[-1].ImageId"' },
          { key: 'Criar AMI', value: 'aws ec2 create-image --instance-id i-xxx --name "app-v1.2.3" --no-reboot' },
          { key: 'Copiar AMI cross-region', value: 'aws ec2 copy-image --source-region us-east-1 --source-image-id ami-xxx --name "app-dr" --region us-west-2' },
          { key: 'Deregister AMI', value: 'aws ec2 deregister-image --image-id ami-xxx' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Auto Scaling',
        entries: [
          { key: 'Descrever ASG', value: 'aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names minha-asg' },
          { key: 'Atualizar capacity', value: 'aws autoscaling set-desired-capacity --auto-scaling-group-name minha-asg --desired-capacity 5' },
          { key: 'Instance Refresh', value: 'aws autoscaling start-instance-refresh --auto-scaling-group-name minha-asg --preferences MinHealthyPercentage=90,InstanceWarmup=120', badge: 'deploy', badgeColor: '#a78bfa' },
          { key: 'Suspender processos', value: 'aws autoscaling suspend-processes --auto-scaling-group-name minha-asg --scaling-processes Terminate' },
          { key: 'Ver atividades', value: 'aws autoscaling describe-scaling-activities --auto-scaling-group-name minha-asg --max-items 10' },
        ],
      },
      {
        title: 'Launch Template',
        entries: [
          { key: 'Criar versão', value: 'aws ec2 create-launch-template-version --launch-template-id lt-xxx --source-version 1 --launch-template-data file://lt.json' },
          { key: 'Listar versões', value: 'aws ec2 describe-launch-template-versions --launch-template-id lt-xxx' },
          { key: 'Modificar default', value: 'aws ec2 modify-launch-template --launch-template-id lt-xxx --default-version 3' },
        ],
      },
      {
        title: 'Spot e precificação',
        entries: [
          { key: 'Histórico de preço Spot', value: 'aws ec2 describe-spot-price-history --instance-types m5.large --product-descriptions "Linux/UNIX" --max-items 5' },
          { key: 'Recomendações Compute Optimizer', value: 'aws compute-optimizer get-ec2-instance-recommendations --instance-arns arn:aws:ec2:us-east-1:123:instance/i-xxx' },
          { key: 'Listar Reserved', value: 'aws ec2 describe-reserved-instances --filters "Name=state,Values=active"' },
        ],
      },
    ],
  },
]

// ── Cheatsheet — famílias e regras ────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 't-série (t3/t4g)', sig: 'Burstable — 5-30% baseline', desc: 'Dev, test, sites de baixo tráfego. Acumula créditos de CPU em ociosidade. Cuidado com burst esgotado em produção.' },
  { name: 'm-série (m6i/m7g)', sig: 'General Purpose — 4 GB/vCPU', desc: 'Padrão para APIs e backends. Comece aqui e migre para c ou r conforme o gargalo. m7g (Graviton) é 20-40% mais barato.' },
  { name: 'c-série (c6i/c7g)', sig: 'Compute Optimized — 2 GB/vCPU', desc: 'Encoding, compilação, batch CPU. Maior performance por vCPU da AWS.' },
  { name: 'r-série (r6i/r7g)', sig: 'Memory Optimized — 8 GB/vCPU', desc: 'Redis, caches in-memory, análise de dados em RAM. Quando a RAM é o gargalo.' },
  { name: 'i-série (i3/i4i)', sig: 'Storage Optimized — NVMe local', desc: 'Cassandra, Elasticsearch, MongoDB. NVMe efêmero — perde no stop. Não use para dados que precisam persistir.' },
  { name: 'g/p-série', sig: 'GPU — inferência (g) ou treino (p)', desc: 'g4dn/g5 para inferência ML e gráficos. p3/p4/p5 para treinamento ML pesado com NVIDIA V100/A100/H100.' },
  { name: 'EBS gp3', sig: '3000 IOPS baseline + 125 MB/s grátis', desc: 'Padrão moderno. 20% mais barato que gp2. Pode escalar até 16k IOPS e 1 GB/s.' },
  { name: 'EBS io2 Block Express', sig: 'Até 256k IOPS, latência sub-ms', desc: 'Bancos críticos (Oracle, SQL Server). Durabilidade 99.999%. Multi-attach disponível.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true,  t: 'Forçar IMDSv2 em todos Launch Templates (HttpTokens=required)' },
  { ok: true,  t: 'SSM Session Manager substitui SSH — sem porta 22 aberta' },
  { ok: true,  t: 'IAM Instance Profile sempre — nunca Access Keys hardcoded' },
  { ok: true,  t: 'EBS encryption obrigatória (KMS) em todos os volumes' },
  { ok: true,  t: 'Termination Protection em instâncias críticas de produção' },
  { ok: true,  t: 'Multi-AZ via ASG espalhado em pelo menos 2 AZs' },
  { ok: true,  t: 'Mixed Instances Policy: base On-Demand + escala em Spot' },
  { ok: true,  t: 'Golden AMI via EC2 Image Builder + Instance Refresh' },
  { ok: true,  t: 'Tags obrigatórias: Environment, Team, CostCenter, Project' },
  { ok: true,  t: 'gp3 sempre — migrar gp2 via Elastic Volumes (sem downtime)' },
  { ok: false, t: 'SSH (porta 22) aberto para 0.0.0.0/0' },
  { ok: false, t: 'IMDSv1 habilitado (vulnerável a SSRF)' },
  { ok: false, t: 'Atualizar instâncias em produção via SSH (drift)' },
  { ok: false, t: 'Conexões diretas ao DB sem RDS Proxy em ASG' },
  { ok: false, t: 'Elastic IPs não associados (cobra $0.005/h ocioso)' },
  { ok: false, t: 'Reserved Instances sem rightsizing prévio' },
  { ok: false, t: 'Instance Store para dados críticos (efêmero)' },
]

// ── Anti-patterns ─────────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Security Group com SSH aberto para 0.0.0.0/0',
    badDesc: 'Porta 22 aberta para qualquer IP da internet — vetor de ataque mais comum em EC2. Bots fazem brute-force 24/7 em qualquer IP elástico.',
    badCode: [
      { t: 'resource "aws_security_group" "bad" {\n' },
      { t: '  ingress {\n' },
      { t: '    from_port   = 22\n' },
      { t: '    to_port     = 22\n' },
      { t: '    protocol    = "tcp"\n' },
      { t: '    cidr_blocks = ', c: '#fca5a5' },
      { t: '["0.0.0.0/0"]\n', c: '#ef4444' },
      { t: '  }\n}' },
    ],
    goodDesc: 'Sem porta SSH aberta. Acesso administrativo via SSM Session Manager — autenticado por IAM, auditado em CloudTrail, sem porta exposta.',
    goodCode: [
      { t: '# Sem regra de SSH no SG\n', c: '#86efac' },
      { t: 'resource "aws_security_group" "ok" { ... }\n\n' },
      { t: '# IAM permite acesso via SSM:\n', c: '#86efac' },
      { t: 'aws ssm start-session ', c: '#86efac' },
      { t: '\\\n  --target i-0abc123', c: '#86efac' },
    ],
    why: 'SSH aberto na internet sofre ataques contínuos de brute-force. SSM Session Manager elimina o problema: sem porta aberta, autenticação via IAM (com MFA, MFA forçado por SCP) e auditoria completa no CloudTrail. Pode até desabilitar criação de Security Groups com porta 22 via SCP organizacional.',
  },
  {
    title: 'IMDSv1 habilitado — vulnerável a SSRF',
    badDesc: 'Launch Template aceita IMDSv1 (default antigo). Aplicação com SSRF deixa atacante roubar credenciais da IAM Role via simples GET no 169.254.169.254.',
    badCode: [
      { t: 'resource "aws_launch_template" "bad" {\n' },
      { t: '  metadata_options {\n' },
      { t: '    http_tokens = ', c: '#fca5a5' },
      { t: '"optional"', c: '#ef4444' },
      { t: '   # aceita IMDSv1\n' },
      { t: '  }\n}' },
    ],
    goodDesc: 'Força IMDSv2: token via PUT obrigatório antes de cada GET. Token não pode ser obtido por SSRF (proxies HTTP comuns não fazem PUT).',
    goodCode: [
      { t: 'resource "aws_launch_template" "ok" {\n' },
      { t: '  metadata_options {\n' },
      { t: '    http_tokens                 = ', c: '#86efac' },
      { t: '"required"\n', c: '#86efac' },
      { t: '    http_put_response_hop_limit = ', c: '#86efac' },
      { t: '1\n', c: '#86efac' },
      { t: '    http_endpoint               = "enabled"\n' },
      { t: '  }\n}' },
    ],
    why: 'O ataque da Capital One em 2019 (que vazou 100M de cadastros) foi exatamente IMDSv1 + SSRF. IMDSv2 exige token PUT que SSRF tradicional não consegue obter. Configure http_put_response_hop_limit=1 para impedir que um container Docker dentro da instância acesse o IMDS via 2 hops.',
  },
  {
    title: 'EBS gp2 em produção nova',
    badDesc: 'gp2 atrela IOPS ao tamanho (3 IOPS/GB) — para 3.000 IOPS você precisa de 1 TB de volume. 20% mais caro que gp3 sem benefício.',
    badCode: [
      { t: 'resource "aws_ebs_volume" "bad" {\n' },
      { t: '  size      = ', c: '#fca5a5' },
      { t: '100\n', c: '#ef4444' },
      { t: '  type      = ', c: '#fca5a5' },
      { t: '"gp2"\n', c: '#ef4444' },
      { t: '  encrypted = ', c: '#fca5a5' },
      { t: 'false\n', c: '#ef4444' },
      { t: '}' },
    ],
    goodDesc: 'gp3 entrega 3.000 IOPS de baseline em qualquer tamanho. Throughput e IOPS configuráveis independentemente. Encryption obrigatória.',
    goodCode: [
      { t: 'resource "aws_ebs_volume" "ok" {\n' },
      { t: '  size       = 100\n' },
      { t: '  type       = ', c: '#86efac' },
      { t: '"gp3"\n', c: '#86efac' },
      { t: '  iops       = ', c: '#86efac' },
      { t: '3000\n', c: '#86efac' },
      { t: '  throughput = 125\n' },
      { t: '  encrypted  = ', c: '#86efac' },
      { t: 'true\n', c: '#86efac' },
      { t: '}' },
    ],
    why: 'gp3 oferece 3.000 IOPS de baseline gratuitos em qualquer tamanho — gp2 precisa de 1 TB para o mesmo. Migrar gp2 para gp3 não tem downtime via Elastic Volumes (aws ec2 modify-volume) — é o low-hanging fruit de redução de custo em qualquer conta AWS antiga. Encryption deve ser KMS sempre.',
  },
  {
    title: 'Credenciais AWS hardcoded em User Data',
    badDesc: 'Chaves AWS no script de User Data — visíveis em DescribeLaunchTemplate. Qualquer pessoa com permissão de leitura no Launch Template vê as credenciais.',
    badCode: [
      { t: '#!/bin/bash\n' },
      { t: 'export AWS_ACCESS_KEY_ID=', c: '#fca5a5' },
      { t: 'AKIAIOSFODNN7EXAMPLE\n', c: '#ef4444' },
      { t: 'export AWS_SECRET_ACCESS_KEY=', c: '#fca5a5' },
      { t: 'wJalrXUtn...\n', c: '#ef4444' },
      { t: 'aws s3 cp s3://bucket/code.tar.gz .' },
    ],
    goodDesc: 'IAM Instance Profile entrega credenciais temporárias via STS. SDK e CLI leem automaticamente do IMDSv2 — sem nada hardcoded.',
    goodCode: [
      { t: '#!/bin/bash\n' },
      { t: '# IAM Profile via Launch Template\n', c: '#86efac' },
      { t: 'aws s3 cp s3://bucket/code.tar.gz .\n\n' },
      { t: '# Launch Template:\n', c: '#86efac' },
      { t: 'iam_instance_profile {\n' },
      { t: '  name = ', c: '#86efac' },
      { t: '"app-role"', c: '#86efac' },
      { t: '\n}' },
    ],
    why: 'Credenciais hardcoded em User Data ficam visíveis no Launch Template para sempre. Mesmo após remoção, a versão antiga existe. IAM Instance Profile gera tokens temporários via STS que expiram em 1 hora — sem segredo para vazar e sem rotação manual. Configure http_put_response_hop_limit=1 para impedir SSRF de containers.',
  },
  {
    title: 'Sem Termination Protection em recursos críticos',
    badDesc: 'Instância de produção sem proteção contra terminate acidental. Erro humano de copiar instance ID errado pode destruir o banco.',
    badCode: [
      { t: 'resource "aws_instance" "prod_db" {\n' },
      { t: '  ami           = "ami-0abc123"\n' },
      { t: '  instance_type = "r6i.4xlarge"\n' },
      { t: '  ', c: '#fca5a5' },
      { t: '# disable_api_termination ausente\n', c: '#ef4444' },
      { t: '}' },
    ],
    goodDesc: 'Production protegida contra terminate acidental. API termina retorna erro até protection ser explicitamente desabilitado.',
    goodCode: [
      { t: 'resource "aws_instance" "prod_db" {\n' },
      { t: '  ami                     = "ami-0abc123"\n' },
      { t: '  instance_type           = "r6i.4xlarge"\n' },
      { t: '  disable_api_termination = ', c: '#86efac' },
      { t: 'true\n', c: '#86efac' },
      { t: '  disable_api_stop        = ', c: '#86efac' },
      { t: 'true\n', c: '#86efac' },
      { t: '\n  root_block_device {\n' },
      { t: '    delete_on_termination = ', c: '#86efac' },
      { t: 'false\n', c: '#86efac' },
      { t: '  }\n}' },
    ],
    why: 'Termination Protection bloqueia terminate-instances no API — tem que ser explicitamente desabilitado antes. Evita o erro humano de copiar o instance ID errado e destruir produção. Para EBS de dados, configure DeleteOnTermination=false para sobreviver mesmo se a instância for destruída.',
  },
  {
    title: 'Conexão DB direto do ASG sem RDS Proxy',
    badDesc: 'ASG escala para 100 instâncias = 100 pools com 50 conexões cada = 5000 conexões ao RDS. PostgreSQL aloca 5-15 MB por conexão — pode estourar memória do banco.',
    badCode: [
      { t: 'const pool = new Pool({\n' },
      { t: '  host: ', c: '#fca5a5' },
      { t: '"rds.amazonaws.com"', c: '#ef4444' },
      { t: ',\n' },
      { t: '  max: ', c: '#fca5a5' },
      { t: '50', c: '#ef4444' },
      { t: ',  // 100 inst × 50 = 5000 conns!\n' },
      { t: '})' },
    ],
    goodDesc: 'RDS Proxy faz connection pooling no nível da rede. Aplicação abre poucas conexões ao Proxy; Proxy multiplexa para o RDS mantendo poucas conexões backend.',
    goodCode: [
      { t: 'const pool = new Pool({\n' },
      { t: '  host: ', c: '#86efac' },
      { t: '"myproxy.proxy-xxxx.amazonaws.com"', c: '#86efac' },
      { t: ',\n' },
      { t: '  max: ', c: '#86efac' },
      { t: '5', c: '#86efac' },
      { t: ',   // 100 inst × 5 = 500 conns ao Proxy\n' },
      { t: '})\n\n' },
      { t: '# Proxy mantem ~25 conns ao RDS,\n', c: '#86efac' },
      { t: '# failover transparente, IAM auth opcional', c: '#86efac' },
    ],
    why: 'PostgreSQL e MySQL alocam memória por conexão (5-15 MB cada). ASG escalando para 100 instâncias rapidamente estoura o limite de conexões do RDS — todas as escritas falham. RDS Proxy faz pool de conexões na borda, mantém o RDS abaixo do limite, suporta failover sem reconectar a aplicação e oferece autenticação IAM (sem senha hardcoded).',
  },
]

// ── Builders de PDF ───────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'EC2',
    stackLabel: 'AWS / Cloud',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QR_COLUMNS,
    skillName: 'EC2 CLI',
    accentColor: C,
    stackLabel: 'AWS / Cloud',
    tagline: 'Comandos AWS CLI essenciais para EC2 — ciclo de vida, EBS, AMI, ASG e Spot',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'EC2',
    accentColor: C,
    stackLabel: 'AWS / Cloud',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['Free tier', 't2.micro 750h/mês por 12 meses (Linux/Windows)'],
        ['vCPU default', '5 instâncias on-demand simultâneas (limite aumentável)'],
        ['EBS por instância', 'Até 40 volumes (Nitro), 28 (não-Nitro)'],
        ['IOPS por instância', 'Limite agregado de IOPS — depende do tipo da instância'],
        ['Elastic IP por região', '5 por padrão (limite aumentável)'],
        ['User Data', 'Máximo 16 KB descomprimido'],
        ['ASG max', 'Sem limite teórico — gerencia centenas de instâncias'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'Mixed Instances Policy: base On-Demand + escala em Spot diversificada (price-capacity-optimized)',
        'Graviton (m7g, c7g, r7g) é 20-40% mais barato com mesma performance — use sempre que sua app compilar para ARM',
        'gp3 com baseline grátis (3000 IOPS + 125 MB/s) cobre a maioria das aplicações sem custo extra',
        'AMI baked + Instance Refresh é mais rápido e confiável que User Data toda vez',
        'ALBRequestCountPerTarget escala antes do CPU saturar — melhor que CPUUtilization para APIs',
        'SSM Session Manager elimina necessidade de bastion host e porta 22 aberta',
        'Detailed Monitoring (1 min) é necessário se ASG precisa reagir rápido a picos',
        'Spot + ASG com diversidade de tipos (override de 5+ tipos) maximiza disponibilidade',
      ],
      patterns: [
        { name: 'Golden AMI Pipeline', code: 'EC2 Image Builder → Test → AMI → Launch Template → Instance Refresh', desc: 'Imutabilidade total: nunca atualize instância em produção, sempre substitua via Instance Refresh.' },
        { name: 'Mixed Instances ASG', code: 'on_demand_base=2 + spot_allocation=price-capacity-optimized + 5 tipos override', desc: 'Garantia de capacidade base com escala em Spot. Diversidade de tipos aumenta disponibilidade de Spot.' },
        { name: 'Blue-Green com ALB', code: 'ALB → 2 Target Groups → Weighted Routing 10/90 → 50/50 → 100/0', desc: 'Deploy gradual com rollback em menos de 30s via mudança de pesos no ALB.' },
        { name: 'Spot Interrupt Handler', code: 'Polling /spot/instance-action → SIGTERM → Save checkpoint S3 → exit', desc: 'Captura aviso de 2 min de interrupção Spot e salva estado antes de ser terminado.' },
      ],
      mentalModels: [
        'Imutabilidade > patches: nunca atualize EC2 em produção via SSH — substitua via Instance Refresh',
        'Stop x Terminate: Stop reversível (preserva EBS), Terminate destrói EBS root — Termination Protection em produção',
        'EBS é rede, Instance Store é local: o primeiro persiste, o segundo é efêmero',
        'Memory > CPU para Lambda; CPU > Memory para Compute em EC2 — escolha família baseada no gargalo',
        'Reserved < Savings Plans em flexibilidade. Compute Savings Plans cobre Lambda + Fargate também',
      ],
    },
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'EC2',
    stackLabel: 'AWS / Cloud',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function EC2Pdfs() {
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
