'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildSecurityChecklistPdf } from '@/components/pdfs/SecurityChecklistPdf'
import type { SecurityCheck } from '@/components/pdfs/SecurityChecklistPdf'

// ── Paleta S3 ─────────────────────────────────────────────────────────────────
const C = '#FF9900'

// ── Cards de PDF ──────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'aws s3 / s3api + JSON de lifecycle, policy e replication',
    type: 'quick-ref',
    pages: 1,
    description: 'Cartão de bolso A4 landscape com 3 colunas: comandos aws s3 (cp, sync, presign), aws s3api (versioning, lifecycle, encryption, replication) e JSONs de referência (lifecycle policy, bucket policy, CORS, replication config). O que você precisa ter na mesa ao trabalhar com S3.',
    icon: '01',
    goal: 'Consulta rápida',
    featured: true,
  },
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista AWS S3',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 20 perguntas nível pleno/sênior cobrindo storage classes, lifecycle, pre-signed URLs, versioning, replication (CRR/SRR), Object Lock, criptografia, Access Points, Transfer Acceleration, S3 Select e segurança em profundidade. Respostas com profundidade de entrevista real.',
    icon: '02',
    goal: 'Recuperação ativa',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'O que não fazer com S3 — e o custo de cada erro',
    type: 'antipatterns',
    pages: 4,
    description: 'Os 6 anti-patterns mais destruidores em projetos S3: bucket público acidentalmente, versioning sem lifecycle, pre-signed URL com TTL longo, multipart uploads abandonados, CRR mal configurada e listagem sem paginação. Código errado × correto com explicação técnica.',
    icon: '03',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Truques para gravar conceitos que mais confundem',
    type: 'mnemonics',
    pages: 2,
    description: 'SSIG-DA para a ordem das storage classes, BBIA para as camadas de segurança, VPC para as três proteções de versão e CRR-SRR para os casos de replicação. Os conceitos S3 que ninguém consegue lembrar na entrevista.',
    icon: '04',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'security',
    title: 'Security Checklist S3',
    subtitle: 'BPA, encryption, MFA Delete, replication — 18 verificações de produção',
    type: 'security',
    pages: 5,
    description: 'Checklist completo organizado por categoria e severidade: Acesso (Block Public Access em conta, bucket policy deny public, IAM least privilege), Criptografia (default encryption, Bucket Key, KMS rotation), Integridade (Versioning + lifecycle, MFA Delete, Object Lock para WORM), Monitoramento (CloudTrail data events, Macie, Storage Lens) e Replicação (CRR/SRR + cleanup multipart). Cada item com remediation acionável.',
    icon: '05',
    goal: 'Hardening de produção',
  },
]

// ── Dados — Quick Reference ───────────────────────────────────────────────────

const QR_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'aws s3 (high-level)',
        entries: [
          { key: 'aws s3 ls s3://bucket/', value: 'Lista objetos no prefixo' },
          { key: 'aws s3 ls s3://bucket/ --recursive --human-readable', value: 'Recursivo com tamanho legível' },
          { key: 'aws s3 cp arquivo.txt s3://bucket/', value: 'Upload de arquivo único' },
          { key: 'aws s3 cp s3://bucket/key ./local/', value: 'Download para o disco' },
          { key: 'aws s3 sync ./dist s3://bucket/static/ --delete', value: 'Sync diretório, deleta extras no destino', badge: '★ deploy', badgeColor: '#FF9900' },
          { key: 'aws s3 sync s3://bucket-a/ s3://bucket-b/', value: 'Copia entre buckets' },
          { key: 'aws s3 presign s3://bucket/key --expires-in 900', value: 'URL temporária para GET (TTL em segundos)' },
          { key: 'aws s3 mb s3://bucket --region us-east-1', value: 'Cria bucket' },
          { key: 'aws s3 rb s3://bucket --force', value: 'Remove bucket com conteúdo', badge: '⚠ destrutivo', badgeColor: '#ef4444' },
          { key: 'aws s3 mv s3://a/k1 s3://b/k2', value: 'Move objeto (cp + rm)' },
        ],
      },
      {
        title: 'aws s3api — bucket',
        entries: [
          { key: 'create-bucket --bucket b --region us-east-1', value: 'Cria bucket explicitamente' },
          { key: 'put-public-access-block --bucket b ...', value: 'Block Public Access (4 flags em true)', badge: '★ obrigatório', badgeColor: '#FF9900' },
          { key: 'put-bucket-versioning --versioning-configuration Status=Enabled', value: 'Habilita versionamento' },
          { key: 'put-bucket-encryption ...', value: 'Default encryption SSE-S3 ou SSE-KMS' },
          { key: 'put-bucket-lifecycle-configuration --lifecycle-configuration file://lc.json', value: 'Aplica lifecycle policy' },
          { key: 'put-bucket-cors --cors-configuration file://cors.json', value: 'Configura CORS para upload do browser' },
          { key: 'put-bucket-replication --replication-configuration file://rep.json', value: 'Configura CRR/SRR (precisa versioning)' },
          { key: 'put-bucket-policy --policy file://policy.json', value: 'Bucket policy (resource-based)' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'aws s3api — objetos e versões',
        entries: [
          { key: 'list-objects-v2 --bucket b --prefix p/', value: 'Lista até 1.000 objetos por página' },
          { key: 'list-objects-v2 --max-items 50 --starting-token TOKEN', value: 'Pagina com continuation token' },
          { key: 'list-object-versions --bucket b --prefix k', value: 'Todas as versões de uma key' },
          { key: 'head-object --bucket b --key k', value: 'Metadata sem baixar (size, etag, content-type)' },
          { key: 'put-object --body file --bucket b --key k', value: 'Upload baixo nível' },
          { key: 'get-object --bucket b --key k out.bin', value: 'Download baixo nível' },
          { key: 'delete-object --bucket b --key k --version-id V', value: 'Deleta versão específica' },
          { key: 'list-multipart-uploads --bucket b', value: 'Lista uploads multipart pendentes (lixo invisível)', badge: '⚠ auditar', badgeColor: '#f59e0b' },
          { key: 'abort-multipart-upload --upload-id U', value: 'Cancela multipart abandonado' },
        ],
      },
      {
        title: 'Pre-signed URL (SDK Node.js v3)',
        entries: [
          { key: 'PutObjectCommand({Bucket, Key, ContentType})', value: 'Comando para upload direto do browser' },
          { key: 'getSignedUrl(s3, command, {expiresIn: 900})', value: 'Gera URL com TTL em segundos (15min ideal para PUT)', badge: '★ TTL curto', badgeColor: '#FF9900' },
          { key: 'GetObjectCommand({Bucket, Key, ResponseContentDisposition})', value: 'Download com nome forçado' },
          { key: 'CreateMultipartUploadCommand', value: 'Iniciar multipart > 100MB' },
          { key: 'UploadPartCommand({PartNumber, UploadId})', value: 'Cada parte (até 5GB)' },
          { key: 'CompleteMultipartUploadCommand', value: 'Finaliza e gera o ETag' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Lifecycle policy (JSON)',
        entries: [
          { key: 'Filter: { Prefix: "uploads/" }', value: 'Aplica só ao prefix' },
          { key: 'Filter: { Tag: { Key, Value } }', value: 'Aplica por tag de objeto' },
          { key: 'Transitions: [{ Days: 30, StorageClass: STANDARD_IA }]', value: 'Move para IA após 30 dias' },
          { key: 'Transitions: [..., { Days: 90, StorageClass: GLACIER_IR }]', value: 'Glacier Instant após 90' },
          { key: 'Expiration: { Days: 2555 }', value: 'Deleta após 7 anos' },
          { key: 'NoncurrentVersionExpiration: { NoncurrentDays: 30, NewerNoncurrentVersions: 5 }', value: 'Limpa versões antigas, mantém últimas 5', badge: '★ sempre', badgeColor: '#FF9900' },
          { key: 'AbortIncompleteMultipartUpload: { DaysAfterInitiation: 7 }', value: 'Limpa multipart abandonados', badge: '★ sempre', badgeColor: '#FF9900' },
        ],
      },
      {
        title: 'Bucket policy snippets',
        entries: [
          { key: 'Force HTTPS', value: 'Deny "*" se aws:SecureTransport=false' },
          { key: 'VPC-only', value: 'Deny se aws:SourceVpc != "vpc-xxx"' },
          { key: 'CloudFront only (OAC)', value: 'Allow só se aws:SourceArn = distribution arn' },
          { key: 'Cross-account', value: 'Principal = "arn:aws:iam::OUTRA-CONTA:role/X"' },
          { key: 'Block ACL public', value: 'Deny PutObject se s3:x-amz-acl=public-read' },
        ],
      },
      {
        title: 'CORS, Replication, Object Lock',
        entries: [
          { key: 'CORS: AllowedMethods=[PUT], AllowedOrigins=[https://app.com]', value: 'Habilita upload do browser' },
          { key: 'Replication: requires Versioning + IAM Role', value: 'CRR ou SRR — assíncrona, não retroativa' },
          { key: 'DeleteMarkerReplication: Disabled', value: 'Para anti-ransomware: NÃO replicar deletes' },
          { key: 'ReplicationTimeControl: Status=Enabled', value: 'SLA de 15min — custo extra' },
          { key: 'ObjectLockConfiguration: Mode=COMPLIANCE, Years=7', value: 'WORM — nem root pode apagar', badge: '★ compliance', badgeColor: '#FF9900' },
          { key: 'Legal Hold: independente do retention period', value: 'Suspende mudanças durante litígio' },
        ],
      },
    ],
  },
]

// ── Dados — Q&A ───────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Como faria upload seguro de arquivo diretamente para S3 sem passar pelo servidor?',
    a: 'Pre-signed URL para PUT: backend gera URL temporária (5–15min) com credenciais AWS válidas. Frontend faz PUT diretamente para S3. O servidor nunca vê o arquivo — sem custo de CPU ou egress do backend. Validações: tipo e tamanho no frontend (client-side) + Lambda trigger após PutObject para validação server-side (tipo real via magic bytes, antivírus, resize de imagem). Bucket privado + CloudFront na frente para servir os arquivos ao público.',
    tip: 'A validação pós-upload via Lambda é o que diferencia uma resposta completa. Confiar no Content-Type do cliente é falha de segurança — ele é trivialmente forjável.',
  },
  {
    level: 'Pleno',
    q: 'Como reduziria custos de S3 em um sistema com 10 TB de arquivos?',
    a: 'Intelligent-Tiering para objetos com padrão de acesso imprevisível — move automaticamente sem cobrança de retrieval. Lifecycle policy para arquivos com padrão conhecido: IA após 30 dias, Glacier após 90, expirar após 365. CloudFront na frente do S3 reduz egress (CloudFront egress é mais barato que S3 direto, e cache reduz chamadas). Comprimir objetos antes de enviar. Expirar versões antigas se versioning ativo. Configurar AbortIncompleteMultipartUpload para eliminar lixo invisível.',
    tip: 'Mencionar AbortIncompleteMultipartUpload e versões antigas mostra que você sabe onde os custos ocultos vivem.',
  },
  {
    level: 'Senior',
    q: 'Quais são as opções de criptografia no S3 e quando usar cada uma?',
    a: 'SSE-S3: AWS gerencia as chaves automaticamente. Zero overhead. Suficiente para a maioria dos casos — compliance básico. SSE-KMS: chave no AWS KMS, auditável via CloudTrail (quem acessou, quando), rotacionável. Exigida para compliance regulatório (SOC 2, HIPAA, PCI). Adiciona latência mínima e custo por chamada KMS — habilite Bucket Key para reduzir 99% das chamadas. SSE-C: cliente fornece e gerencia a chave a cada request. Máximo controle, máxima responsabilidade. Raro na prática. Client-side: criptografia antes de enviar — AWS nunca vê os dados em plaintext. Para dados ultra-sensíveis.',
    tip: 'Bucket Key é a otimização de custo mais importante de SSE-KMS — sem ela, cada GET/PUT chama o KMS. Mencionar isso impressiona.',
  },
  {
    level: 'Senior',
    q: 'Como implementaria um data lake simples com S3?',
    a: 'Estrutura de prefixos: s3://bucket/raw/year=2024/month=01/day=15/ (particionamento Hive-style para Athena). Ingestão: Kinesis Data Firehose ou Lambda para gravar no S3 raw. Lifecycle move raw para Glacier após 1 ano. Bucket separado para processed (Parquet, comprimido com Snappy/Zstd). Consulta: Athena lê direto do S3 (paga por TB escaneado — particionamento reduz custo). AWS Glue Catalog como metastore. S3 Select para filtrar dentro de objetos individuais sem baixar o arquivo todo.',
    tip: 'Particionamento Hive-style por data é o ponto que mais reduz custo de Athena — escaneia apenas a partição, não o bucket inteiro.',
  },
  {
    level: 'Senior',
    q: 'O que é S3 Object Lock e qual a diferença entre os modos Compliance e Governance?',
    a: 'S3 Object Lock implementa WORM (Write Once, Read Many) — protege objetos contra deleção e sobrescrita por um período de retenção configurado. Essencial para compliance regulatório onde imutabilidade é exigida legalmente. Modo Governance: a maioria dos usuários não pode sobrescrever ou deletar. Porém, usuários com a permissão s3:BypassGovernanceRetention podem. Útil para cenários onde administradores precisam corrigir erros sem comprometer a auditabilidade geral. Modo Compliance: ninguém pode alterar ou deletar — nem o root account, nem a AWS. Imutabilidade absoluta pelo período configurado. Não pode ser desativado depois de ativo. Exigido para regulações como SEC 17a-4, FINRA, HIPAA, LGPD para logs de auditoria. Legal Hold: além do período de retenção, você pode colocar um Legal Hold em qualquer objeto — suspende modificações independentemente do período.',
    tip: 'A distinção Compliance vs Governance é a pergunta clássica. Compliance = nem o root pode — mencione isso. Legal Hold é o diferencial de sênior.',
  },
  {
    level: 'Senior',
    q: 'Como o S3 garante consistência e o que mudou em 2020?',
    a: 'Antes de dezembro de 2020: S3 era eventually consistent para sobrescritas e deletes — um objeto recém-sobrescrito podia retornar a versão antiga por alguns segundos. A partir de dezembro de 2020: S3 passou a oferecer strong consistency para todas as operações (GET, PUT, LIST, DELETE) sem custo adicional. Após uma escrita confirmada, qualquer leitura subsequente retorna o valor mais recente. Isso simplificou drasticamente a lógica de aplicações que usam S3 como storage primário — antes, era preciso construir camadas de cache ou retry para esconder a inconsistência.',
    tip: 'Mencionar a era pré-2020 mostra que você acompanha a evolução da AWS.',
  },
  {
    level: 'Pleno',
    q: 'O que é S3 Transfer Acceleration e quando usar?',
    a: 'Transfer Acceleration usa a rede global de edge locations do CloudFront para acelerar uploads de longa distância para o S3. Em vez de enviar direto para o bucket na região, o cliente envia para o edge location mais próximo — o dado trafega pela rede backbone privada da AWS (muito mais rápida e confiável que a internet pública) até o bucket. Quando faz sentido: clientes distribuídos globalmente fazendo upload para um bucket centralizado (ex: usuários no Brasil e Ásia uploading para bucket em us-east-1). Não faz sentido para transferências na mesma região. Para verificar se vale: use o Amazon S3 Transfer Acceleration Speed Comparison Tool — compara a velocidade com e sem aceleração para sua localização.',
    tip: 'A Speed Comparison Tool é citada raramente — mencione para mostrar que você usa a feature na prática.',
  },
  {
    level: 'Senior',
    q: 'Como funcionam os S3 Access Points?',
    a: 'S3 Access Points são endpoints nomeados e configuráveis anexados a um bucket. Cada Access Point tem sua própria política de acesso (como uma bucket policy dedicada) e pode ser restrito a uma VPC específica. Problema que resolvem: um bucket compartilhado por múltiplos workloads (equipe de dados, aplicação web, pipeline de ML) acaba com uma bucket policy monstruosa e difícil de manter. Cada Access Point tem sua política focada em um único caso de uso. Exemplo: bucket dados-prod com 3 Access Points: analytics-ap (só leitura, acesso de qualquer lugar), webapp-ap (leitura + escrita, restrito à VPC da aplicação), ml-pipeline-ap (leitura de prefix específico, restrito à VPC de ML). Restrição de VPC: um Access Point com VPC restriction garante que o acesso ao S3 só ocorra dentro da VPC — sem acesso público, sem internet.',
    tip: 'A analogia "cada workload tem sua porta de entrada com política própria" é clara para entrevistadores.',
  },
  {
    level: 'Pleno',
    q: 'O que é multipart upload e quando é necessário?',
    a: 'Multipart upload divide arquivos grandes em partes e as envia em paralelo. Cada parte é enviada independentemente (pode ser em threads ou máquinas diferentes). O S3 remonta o objeto apenas após todas as partes serem confirmadas. Quando obrigatório: objetos maiores que 5 GB. AWS não aceita PUT simples acima desse limite. Quando recomendado: a partir de 100 MB — uploads em paralelo são muito mais rápidos. Se uma parte falhar, só essa parte é reenviada (não o arquivo inteiro). Ideal para uploads via rede instável. Armadilha: partes incompletas continuam ocupando storage e gerando custo invisível. Configure uma lifecycle rule para abortar multipart uploads incompletos após 7 dias. AWS CLI usa multipart upload automaticamente para arquivos maiores que 8 MB com aws s3 cp.',
    tip: 'O custo invisível das partes abandonadas é a maior pegadinha — mencione AbortIncompleteMultipartUpload na resposta.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre CRR e SRR no S3 Replication?',
    a: 'CRR (Cross-Region Replication): replica objetos para um bucket em outra região AWS. Requer versioning ativado nos dois buckets. Casos de uso: DR com cópia em outra região, servir dados com latência menor para usuários em outra região, requisito de compliance de data residency (cópia em jurisdição diferente). SRR (Same-Region Replication): replica dentro da mesma região. Casos de uso: consolidar logs de múltiplos buckets em um único bucket centralizado, criar cópia imutável separada (bucket de destino com Object Lock) para proteção contra ransomware, separar ambientes (prod replica para bucket de test com dados reais mascarados). Características comuns: replicação é assíncrona (lag de segundos a minutos). Não é retroativa — replica apenas objetos criados/modificados após ativar. Delete markers são replicados se configurado explicitamente (não por padrão). Replication Time Control (RTC) garante replicação em 15 minutos com SLA — cobrado adicionalmente.',
    tip: 'Anti-ransomware com SRR + Object Lock no destino é o pattern avançado — citar isso diferencia.',
  },
  {
    level: 'Senior',
    q: 'Como implementar segurança em profundidade no S3?',
    a: 'Camada 1 — Block Public Access (primeira linha de defesa): ativar em nível de conta AWS (bloqueia todos os buckets, inclusive os criados futuramente). Não depende de configuração por bucket. Camada 2 — Bucket Policy: controla acesso ao bucket. Deny explícito com condition para bloquear acesso de fora da VPC ou forçar HTTPS (aws:SecureTransport=false → Deny). Camada 3 — IAM Policies: o que a identidade pode fazer. Combine com bucket policy — para acesso cross-account, as duas precisam permitir. Camada 4 — Criptografia: SSE-KMS com chave gerenciada pelo cliente. Auditoria via CloudTrail de toda operação de descriptografia. Camada 5 — Monitoramento: Amazon Macie detecta automaticamente dados sensíveis (PII, credenciais, dados financeiros). CloudTrail S3 data events para auditoria de acesso a objetos específicos. Alertas no CloudWatch em acessos anômalos.',
    tip: 'Mencione a sequência de avaliação: Block Public Access → Bucket Policy → IAM Policy. Se qualquer camada negar, o acesso é negado.',
  },
  {
    level: 'Pleno',
    q: 'O que são S3 Event Notifications e como usá-las para pipelines?',
    a: 'S3 Event Notifications disparam automaticamente quando eventos ocorrem em um bucket: PutObject, DeleteObject, RestoreObject, Replication, etc. Você pode filtrar por prefixo (uploads/), sufixo (.jpg) ou ambos. Destinos possíveis: Lambda (processamento inline), SQS (fila para processamento assíncrono com retry), SNS (fan-out para múltiplos destinos), EventBridge (roteamento avançado com filtros complexos). Pipeline típico de processamento de mídia: usuário faz upload de vídeo → S3 Event → SQS → Lambda pega da fila → chama MediaConvert para transcodificar → salva em bucket de destino → S3 Event → Lambda envia notificação ao usuário. EventBridge vs S3 Notifications diretas: EventBridge tem filtros mais sofisticados e histórico de eventos. S3 Notifications diretas têm menor latência. Para novas arquiteturas, prefira EventBridge — mais flexível para evoluir o pipeline sem alterar a configuração do bucket.',
    tip: 'A escolha SQS vs Lambda direto pelo critério de throttle e retry confiável é o que o entrevistador quer ouvir.',
  },
  {
    level: 'Senior',
    q: 'Como usar S3 Select para reduzir custo de consultas em data lakes?',
    a: 'S3 Select permite executar expressões SQL simples diretamente em objetos S3 individuais (CSV, JSON, Parquet, ORC com compressão GZIP/BZIP2) sem baixar o arquivo completo. A computação ocorre no S3 — somente os dados filtrados são transferidos. Quando faz diferença: objeto de 1 GB mas você precisa só de 1% dos dados (10 MB). Sem S3 Select: baixa 1 GB, filtra localmente. Com S3 Select: AWS processa e transfere apenas 10 MB. Reduz custo de transferência e latência. Quando usar Athena em vez de S3 Select: Athena processa múltiplos objetos em paralelo (escaneia toda a partição). S3 Select processa um objeto por vez. Para queries que varrem centenas de arquivos, Athena é muito mais eficiente. S3 Select é melhor quando você sabe exatamente qual arquivo processar (ex: processando um arquivo específico numa Lambda). Custo: paga por dados escaneados e dados retornados — sempre mais barato que baixar o arquivo todo.',
    tip: 'A regra "Athena para múltiplos arquivos, S3 Select para um arquivo conhecido" é a heurística que separa quem usa de quem só leu sobre.',
  },
  {
    level: 'Pleno',
    q: 'Como configurar um site estático no S3 com HTTPS via CloudFront?',
    a: '1. Bucket S3: criar bucket privado, fazer upload dos arquivos. Block Public Access ativado — acesso apenas via CloudFront. 2. Certificado ACM: criar certificado SSL/TLS para o domínio no ACM (obrigatoriamente em us-east-1 para CloudFront). Validação via DNS. 3. CloudFront Distribution: Origin = bucket S3 (usar S3 REST API endpoint). Origin Access Control (OAC) — substitui o OAI legado. O CloudFront gera automaticamente a bucket policy necessária. Alternate Domain Names = seu domínio. Certificado = o do ACM. HTTPS Only ou Redirect HTTP to HTTPS. 4. Route 53: registro A (Alias) apontando para o distribution do CloudFront.',
    tip: 'OAC é o padrão atual — OAI ainda funciona mas é legado. Mencionar isso mostra que você acompanha a documentação.',
  },
  {
    level: 'Senior',
    q: 'Como o custo de egress do S3 funciona e como minimizar com CloudFront?',
    a: 'S3 cobra por dados saindo da AWS para a internet (egress). Não cobra por dados entrando (ingress) nem por transferências dentro da mesma região entre serviços AWS. Pricing de egress S3 direto (us-east-1): primeiro 1 GB/mês grátis, próximos 9.999 TB ~$0,09/GB, acima de 10 TB ~$0,085/GB. Com CloudFront na frente: o egress CloudFront → usuário final é ~$0,0085–$0,085/GB (dependendo da região de edge). Além disso, o cache do CloudFront elimina muitas requests ao S3 — arquivos populares são servidos da edge sem atingir o S3. Em cenários com alta taxa de cache hit, o custo total pode ser 80–90% menor. Como configurar: CloudFront Distribution com Origin = bucket S3 + Origin Access Control (OAC) — bucket permanece privado, acessível apenas via CloudFront. Não existe custo de transferência S3 → CloudFront (mesmo entre regiões).',
    tip: 'A frase "não há custo de transferência S3 → CloudFront" é contraintuitiva e frequentemente desconhecida — mencionar isso demonstra conhecimento real de pricing AWS.',
  },
  {
    level: 'Senior',
    q: 'Como você usa S3 Event Notifications com SQS, SNS e Lambda — quando escolher cada um?',
    a: 'S3 → Lambda (direto): processamento síncrono imediato. Simples, sem infraestrutura adicional. Desvantagem: sem fila de buffer — pico de uploads = pico de Lambdas simultâneas. Retry limitado (2× em erro, depois o evento é perdido sem DLQ). Use para processamento leve e tolerante a perda. S3 → SQS → Lambda: padrão mais robusto. SQS age como buffer — Lambda consome na velocidade configurada. Retry natural (até maxReceiveCount). DLQ para mensagens problemáticas. Melhor para processamento custoso (transcodificação, OCR) onde você quer controlar throughput e ter retry confiável. S3 → SNS → (SQS + Lambda + Email): fan-out. Um evento S3 dispara múltiplos consumidores em paralelo. Use quando o mesmo evento precisa acionar processamento + notificação + replicação simultâneos. S3 → EventBridge: filtros mais sofisticados (por size, metadata, etag). Roteamento para múltiplos targets com lógica complexa. Log histórico de eventos. Latência ligeiramente maior que notificações diretas. Preferível para novas arquiteturas onde você quer evolução sem alterar configuração do bucket.',
    tip: 'A escolha SQS vs Lambda direto pelo critério de throttle e retry confiável é o que o entrevistador quer ouvir — não apenas "os três funcionam".',
  },
  {
    level: 'Pleno',
    q: 'Como evitar que partes de multipart upload abandonadas gerem custo invisível?',
    a: 'Quando um cliente inicia multipart upload mas falha antes de complete-multipart-upload, as partes (até 5 GB cada) ficam armazenadas. Não aparecem em ListObjects nem no console default — só em ListMultipartUploads. Isso significa que empresas descobrem GB ou TB de "lixo invisível" depois de meses. Solução: configurar AbortIncompleteMultipartUpload em TODA lifecycle policy: { "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 } }. Para auditar imediatamente: aws s3api list-multipart-uploads --bucket prod e abortar manualmente os antigos com aws s3api abort-multipart-upload --upload-id.',
    tip: 'Esse custo invisível é um clássico de "infra carinha que ninguém entende" — apresentar a solução em uma linha de lifecycle mostra senioridade prática.',
  },
  {
    level: 'Senior',
    q: 'O que é Requester Pays e quando faz sentido usar?',
    a: 'Por padrão, o owner do bucket paga por todo storage e egress. Com Requester Pays habilitado, quem fizer download paga pelo egress (e o request) — o owner continua pagando apenas pelo storage. Habilitação: PutBucketRequestPayment com Status=Requester. O cliente precisa enviar header x-amz-request-payer=requester em cada request. Quando faz sentido: distribuir datasets públicos grandes (ex: imagens científicas, datasets de ML, arquivos de pesquisa) sem absorver o custo de quem baixa. Exemplos reais: Open Data Registry da AWS, vários datasets públicos do governo americano. Limitação: o cliente que faz download precisa ter conta AWS (não funciona com acesso anônimo). Para distribuição pública sem fricção, prefira CloudFront com bucket privado.',
    tip: 'Requester Pays é raro mas é o pattern certo para datasets enormes que você quer compartilhar sem pagar pelo egress de todo mundo.',
  },
  {
    level: 'Pleno',
    q: 'O que é o S3 Storage Lens e como usar para otimização?',
    a: 'S3 Storage Lens é uma feature de visibilidade que agrega métricas de uso de S3 em toda a organização (uma conta ou todo o AWS Organizations). Métricas free: storage por bucket, contagem de objetos, distribuição de tamanhos, requests por tipo. Métricas advanced (pagas): por tag de objeto, por prefixo, métricas de acesso anômalo, recomendações de otimização (objetos antigos sem lifecycle, buckets com versioning sem expiration). Use para: descobrir os 10 buckets que mais consomem custo, identificar buckets com versioning sem lifecycle (lixo crescendo), achar objetos com mais de 1 ano que poderiam estar em Glacier. Dashboard customizável e CSV exportável para análise no BI da empresa.',
    tip: 'Storage Lens é menos conhecido que CloudWatch — citá-lo demonstra que você faz cost optimization de verdade.',
  },
  {
    level: 'Senior',
    q: 'Como gerar uma pre-signed URL para upload direto do browser e por que evitar passar pelo servidor?',
    a: 'Pre-signed URL para upload (PUT) permite que o browser envie o arquivo diretamente ao S3 sem que o arquivo passe pelo backend. O backend apenas gera a URL assinada com getSignedUrl(s3, new PutObjectCommand({Bucket, Key, ContentType}), {expiresIn: 900}). Por que evitar passar pelo servidor: custo de CPU (servidor não processa bytes), custo de egress (sem transferência servidor → S3), limitação de tamanho (servidores Node têm limite de request body 1–10 MB), latência (upload vai direto para S3 edge mais próximo do usuário). Validação após upload: Lambda com trigger S3 PutObject valida o arquivo real (magic bytes, antivírus, resize) — mais seguro que confiar no Content-Type do cliente. Combine com Block Public Access + CORS configurado para o domínio do frontend.',
    tip: 'Mencionar a validação pós-upload via Lambda é o que diferencia uma resposta completa de uma superficial. O client-side Content-Type é controlado pelo usuário e não deve ser confiado.',
  },
]

// ── Dados — Anti-patterns ─────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Bucket público acidentalmente — Block Public Access desligado',
    badDesc: 'Bucket policy com Principal "*" e Block Public Access desabilitado para "permitir" acesso público.',
    badCode: [
      { t: '{', c: '#fda4af' },
      { t: '\n  "Effect": "Allow",', c: '#ef4444' },
      { t: '\n  "Principal": "*",', c: '#ef4444' },
      { t: '\n  "Action": "s3:GetObject",', c: '#ef4444' },
      { t: '\n  "Resource": "arn:aws:s3:::bucket-prod/*"', c: '#ef4444' },
      { t: '\n}', c: '#fda4af' },
      { t: '\n# Block Public Access desligado para permitir', c: '#ef4444' },
    ],
    goodDesc: 'Block Public Access em nível de conta + CloudFront com OAC servindo o conteúdo público.',
    goodCode: [
      { t: '# Block Public Access em nível de CONTA:', c: '#94a3b8' },
      { t: '\naws s3control put-public-access-block \\', c: '#4ade80' },
      { t: '\n  --account-id 123456789 \\', c: '#4ade80' },
      { t: '\n  --public-access-block-configuration \\', c: '#4ade80' },
      { t: '\n  BlockPublicAcls=true,IgnorePublicAcls=true, \\', c: '#4ade80' },
      { t: '\n  BlockPublicPolicy=true,RestrictPublicBuckets=true', c: '#4ade80' },
      { t: '\n# Servir via CloudFront + OAC: bucket privado', c: '#94a3b8' },
    ],
    why: 'Bucket público é a causa #1 de data breach na AWS. Block Public Access em nível de conta bloqueia todos os buckets, atuais e futuros. Para servir conteúdo "público" (assets, imagens), use CloudFront com Origin Access Control: o bucket continua privado e só o CloudFront acessa.',
  },
  {
    title: 'Versioning ativo sem lifecycle — versões acumulando infinitamente',
    badDesc: 'Versioning habilitado mas sem regra para expirar versões antigas — custo cresce linearmente.',
    badCode: [
      { t: 'PutBucketVersioning: { Status: "Enabled" }', c: '#fda4af' },
      { t: '\n# Mas nenhum NoncurrentVersionExpiration configurado', c: '#ef4444' },
      { t: '\n# 1 milhão de objetos × 30 versões = 30M versões pagas', c: '#ef4444' },
      { t: '\n# Custo cresce SEM LIMITE com cada UPDATE', c: '#ef4444' },
    ],
    goodDesc: 'Lifecycle expira versões antigas e mantém apenas as N últimas para rollback.',
    goodCode: [
      { t: '{', c: '#86efac' },
      { t: '\n  "ID": "ExpireOldVersions",', c: '#4ade80' },
      { t: '\n  "Status": "Enabled",', c: '#4ade80' },
      { t: '\n  "NoncurrentVersionExpiration": {', c: '#4ade80' },
      { t: '\n    "NoncurrentDays": 30,', c: '#4ade80' },
      { t: '\n    "NewerNoncurrentVersions": 5  // mantém 5 últimas', c: '#4ade80' },
      { t: '\n  }', c: '#4ade80' },
      { t: '\n}', c: '#86efac' },
    ],
    why: 'Versioning é proteção, mas sem lifecycle vira armadilha de custo. Cada UPDATE de objeto cria uma nova versão; a antiga continua armazenada e cobrada. Defina NoncurrentVersionExpiration para limpar versões antigas e/ou manter apenas as últimas N (rollback de poucos dias é suficiente para 99% dos casos).',
  },
  {
    title: 'Pre-signed URL com TTL muito longo (dias)',
    badDesc: 'URL válida por 7 dias — se vazar (logs, telemetria, browser history), qualquer um faz upload/download por uma semana.',
    badCode: [
      { t: 'getSignedUrl(s3, command, {', c: '#fda4af' },
      { t: '\n  expiresIn: 7 * 24 * 3600  // 604800 segundos', c: '#ef4444' },
      { t: '\n})', c: '#fda4af' },
      { t: '\n# A URL contém credenciais válidas embutidas', c: '#ef4444' },
      { t: '\n# Logs do CDN, history do browser, telemetria...', c: '#ef4444' },
      { t: '\n# Janela de 7 dias para qualquer um exfiltrar', c: '#ef4444' },
    ],
    goodDesc: 'TTL curto (5–15 min para PUT, 1h para GET) e geração de nova URL sob demanda quando necessário.',
    goodCode: [
      { t: 'getSignedUrl(s3, command, {', c: '#86efac' },
      { t: '\n  expiresIn: 900  // 15 minutos', c: '#4ade80' },
      { t: '\n})', c: '#86efac' },
      { t: '\n# Se o usuário precisa renovar, peça nova URL.', c: '#94a3b8' },
      { t: '\n# Combine com IAM Condition para limitar:', c: '#94a3b8' },
      { t: '\n# aws:SourceIp, aws:UserAgent, aws:SecureTransport', c: '#4ade80' },
    ],
    why: 'Pre-signed URLs incorporam credenciais válidas. Quanto maior o TTL, maior a janela de comprometimento se a URL vazar (logs do CDN, histórico do browser, telemetria). Use 5–15 min para uploads, 1h para downloads. Se o usuário precisa de mais tempo, peça uma URL nova.',
  },
  {
    title: 'Uploads multipart abandonados — custo oculto invisível',
    badDesc: 'Cliente inicia multipart upload mas falha antes de complete — partes ficam armazenadas, não aparecem no ListObjects.',
    badCode: [
      { t: 'aws s3api create-multipart-upload \\', c: '#fda4af' },
      { t: '\n  --bucket prod --key big-video.mp4', c: '#fda4af' },
      { t: '\n# Cliente cai antes de complete-multipart-upload', c: '#ef4444' },
      { t: '\n# As partes (até 5 GB cada) ficam armazenadas', c: '#ef4444' },
      { t: '\n# Não aparecem em ListObjects — você não vê o custo', c: '#ef4444' },
      { t: '\n# Empresas descobrem TB de lixo depois de meses', c: '#ef4444' },
    ],
    goodDesc: 'Lifecycle aborta multipart abandonados após N dias + auditoria periódica via list-multipart-uploads.',
    goodCode: [
      { t: '{', c: '#86efac' },
      { t: '\n  "ID": "AbortAbandonedUploads",', c: '#4ade80' },
      { t: '\n  "Status": "Enabled",', c: '#4ade80' },
      { t: '\n  "AbortIncompleteMultipartUpload": {', c: '#4ade80' },
      { t: '\n    "DaysAfterInitiation": 7', c: '#4ade80' },
      { t: '\n  }', c: '#4ade80' },
      { t: '\n}', c: '#86efac' },
      { t: '\n# Auditoria:', c: '#94a3b8' },
      { t: '\naws s3api list-multipart-uploads --bucket prod', c: '#4ade80' },
    ],
    why: 'Partes de multipart upload abandonadas continuam ocupando storage cobrado, mas não aparecem no ListObjects nem no console default — só em ListMultipartUploads. Empresas descobrem GB ou TB de "lixo invisível" depois de meses. Configure AbortIncompleteMultipartUpload em TODO lifecycle policy.',
  },
  {
    title: 'CRR replicando delete markers — proteção contra ransomware desfeita',
    badDesc: 'Cross-Region Replication com replicação de delete markers ativa — ransomware deleta tudo nos dois buckets simultaneamente.',
    badCode: [
      { t: '{', c: '#fda4af' },
      { t: '\n  "Rules": [{', c: '#fda4af' },
      { t: '\n    "Status": "Enabled",', c: '#fda4af' },
      { t: '\n    "DeleteMarkerReplication": { "Status": "Enabled" },', c: '#ef4444' },
      { t: '\n    "Destination": { "Bucket": "arn:aws:s3:::dr-bucket" }', c: '#fda4af' },
      { t: '\n  }]', c: '#fda4af' },
      { t: '\n}', c: '#fda4af' },
      { t: '\n# Ransomware DELETE → replica DELETE no DR', c: '#ef4444' },
    ],
    goodDesc: 'Decisão consciente: para anti-ransomware, NÃO replicar deletes + Object Lock no destino.',
    goodCode: [
      { t: '"DeleteMarkerReplication": { "Status": "Disabled" },', c: '#4ade80' },
      { t: '\n# Bucket destino com Object Lock COMPLIANCE:', c: '#94a3b8' },
      { t: '\nObjectLockConfiguration: {', c: '#86efac' },
      { t: '\n  ObjectLockEnabled: "Enabled",', c: '#4ade80' },
      { t: '\n  Rule: { DefaultRetention: {', c: '#4ade80' },
      { t: '\n    Mode: "COMPLIANCE",  // nem root apaga', c: '#4ade80' },
      { t: '\n    Years: 7', c: '#4ade80' },
      { t: '\n  }}', c: '#4ade80' },
      { t: '\n}', c: '#86efac' },
    ],
    why: 'CRR não é backup — é cópia. Se você replica delete markers, um ransomware que apaga a origem apaga a réplica. Se não replica, a réplica fica como backup imutável. Para proteção máxima: bucket destino com Object Lock em modo Compliance — ninguém apaga, nem o root.',
  },
  {
    title: 'Listar bucket sem paginação — só processa os primeiros 1.000',
    badDesc: 'ListObjectsV2 sem checar IsTruncated — em buckets com milhões de objetos, processa 0,01% e acha que terminou.',
    badCode: [
      { t: 'const resp = await s3.send(new ListObjectsV2Command({', c: '#fda4af' },
      { t: '\n  Bucket: "prod"', c: '#fda4af' },
      { t: '\n}))', c: '#fda4af' },
      { t: '\n// resp.Contents tem no MÁXIMO 1.000 objetos', c: '#ef4444' },
      { t: '\n// Bucket com 10M de objetos? Você só processa 1.000.', c: '#ef4444' },
      { t: '\n// IsTruncated: true → existem mais, ignorou.', c: '#ef4444' },
    ],
    goodDesc: 'Paginator do SDK v3 itera todas as páginas automaticamente.',
    goodCode: [
      { t: 'import { paginateListObjectsV2 } from "@aws-sdk/client-s3"', c: '#4ade80' },
      { t: '\n', c: '#86efac' },
      { t: '\nfor await (const page of paginateListObjectsV2(', c: '#4ade80' },
      { t: '\n  { client: s3 }, { Bucket: "prod" }', c: '#4ade80' },
      { t: '\n)) {', c: '#4ade80' },
      { t: '\n  for (const obj of page.Contents ?? []) {', c: '#4ade80' },
      { t: '\n    process(obj.Key)', c: '#4ade80' },
      { t: '\n  }', c: '#4ade80' },
      { t: '\n}', c: '#4ade80' },
    ],
    why: 'ListObjectsV2 retorna no máximo 1.000 objetos por chamada. Se IsTruncated=true, você precisa fazer nova chamada com NextContinuationToken. O paginator do SDK v3 abstrai isso. Em buckets com milhões de objetos, esquecer paginação significa processar 0,01% e achar que terminou.',
  },
]

// ── Dados — Mnemônicos ────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'SSIG-DA — storage classes em ordem de custo',
    trick: 'Standard → Standard-IA → Intelligent-Tiering → Glacier Instant → Glacier Flexible → Deep Archive',
    expansion: [
      ['S',  'Standard — acesso frequente, sem retrieval, $$$$'],
      ['SIA', 'Standard-IA — acesso infrequente, retrieval $, $$$'],
      ['IT', 'Intelligent-Tiering — automático entre tiers, $$$'],
      ['GIR', 'Glacier Instant Retrieval — ms, retrieval $, $$'],
      ['GFL', 'Glacier Flexible — min/h, retrieval $$, $'],
      ['DA', 'Deep Archive — 12-48h, retrieval $$$, ¢'],
    ],
    explanation: 'As classes em ordem crescente de economia (e crescente de restrição de acesso). O critério de escolha é frequência de acesso × tolerância a latência × custo de retrieval. Acesso frequente → Standard. Padrão imprevisível → Intelligent-Tiering. Arquivamento → Glacier ou Deep Archive.',
    example: 'Logs de aplicação: Standard 30 dias → IA 90 dias → Glacier Flexible 1 ano → Deep Archive 7 anos',
    why: 'Cada classe tem custo de armazenamento e de retrieval invertidos. Decidir requer entender o padrão real de leitura — não basta olhar o preço por GB.',
  },
  {
    label: 'BBIA — camadas de segurança em profundidade',
    trick: 'Block → Bucket policy → IAM → Audit',
    expansion: [
      ['B', 'Block Public Access — primeira linha, override global'],
      ['B', 'Bucket policy — quem acessa o bucket (resource-based)'],
      ['I', 'IAM — o que a identidade pode fazer (identity-based)'],
      ['A', 'Audit — CloudTrail data events + Macie + CloudWatch'],
    ],
    explanation: 'Quatro camadas de segurança em profundidade no S3. A ordem importa: Block Public Access bloqueia tudo antes mesmo de avaliar policies. Bucket policy e IAM são avaliadas juntas (Deny explícito vence). Audit é a última linha — assume que algo passou e registra.',
    example: 'Bucket privado: Block Public Access ON + Bucket Policy força HTTPS + IAM permite só a role do app + CloudTrail log de cada GetObject',
    why: 'Defesa em profundidade significa que múltiplas camadas precisam falhar para haver vazamento. Não confie em uma só — combine Block Public Access (override) + policies granulares + auditoria contínua.',
  },
  {
    label: 'VOL — proteção contra perda de objetos',
    trick: 'Versioning → Object Lock → Lifecycle (para limpar)',
    expansion: [
      ['V', 'Versioning — cada UPDATE/DELETE preserva versão antiga'],
      ['O', 'Object Lock — WORM, nem root apaga (Compliance mode)'],
      ['L', 'Lifecycle — limita custo limpando versões antigas'],
    ],
    explanation: 'O trio para proteger objetos importantes: Versioning preserva o histórico, Object Lock impede deleção mesmo com credenciais roubadas, Lifecycle previne crescimento descontrolado de custo. Sem Lifecycle, Versioning vira armadilha financeira.',
    example: 'Logs de auditoria: Versioning ON + Object Lock Compliance 7 anos + Lifecycle expira versões antigas após 30 dias mantendo as 5 últimas',
    why: 'Os três trabalham juntos. Versioning sozinho cresce sem limite. Object Lock sem Versioning não funciona. Lifecycle sem Versioning apaga em vez de proteger.',
  },
  {
    label: 'CRR-SRR — quando replicar para fora vs dentro',
    trick: 'Cross = outra Região (DR), Same = mesma Região (consolidação/imutável)',
    expansion: [
      ['CRR', 'DR geográfico, latência global, data residency'],
      ['SRR', 'Consolidar logs, cópia imutável (anti-ransomware), dev mascarado'],
      ['RTC', 'Replication Time Control — SLA 15min, custo extra'],
      ['¬DM', 'NÃO replicar Delete Markers para anti-ransomware'],
    ],
    explanation: 'CRR vs SRR é decisão de propósito, não de distância. CRR para resiliência regional ou compliance multi-jurisdição. SRR para consolidação de logs ou cópia imutável. Os dois exigem versioning nos buckets e são assíncronos por padrão.',
    example: 'Anti-ransomware: SRR para bucket destino com Object Lock Compliance + DeleteMarkerReplication=Disabled',
    why: 'Replicação não é backup — é cópia. Para que vire backup real, combine com Object Lock no destino e não replique deletes. Caso contrário, um ransomware na origem destrói a réplica também.',
  },
]

// ── Dados — Security Checklist ────────────────────────────────────────────────

const SECURITY_CHECKS: SecurityCheck[] = [
  {
    item: 'Block Public Access em nível de CONTA (não só bucket)',
    description: 'Configuração no nível da conta bloqueia todos os buckets atuais e futuros. Bucket-level pode ser desativado por engano em refactor; account-level é o switch master. Os 4 flags devem estar TODOS em true.',
    severity: 'critical',
    category: 'Acesso',
    cwe: 'CWE-732',
    owasp: 'A05:2021',
    remediation: 'aws s3control put-public-access-block --account-id 123 --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true',
    testable: true,
  },
  {
    item: 'Bucket policy nega acesso não-criptografado e não-HTTPS',
    description: 'Sem essas duas regras de Deny explícito, alguém pode subir objeto sem encryption ou acessar via HTTP. Deny vence Allow, então isso protege mesmo com IAM permissivo.',
    severity: 'high',
    category: 'Acesso',
    remediation: 'Bucket policy: Deny "*" se aws:SecureTransport = false (força HTTPS). Deny "*" PutObject se s3:x-amz-server-side-encryption ausente.',
    testable: true,
  },
  {
    item: 'IAM policies com least privilege por prefix',
    description: 'Role com s3:* ou s3:GetObject em arn:aws:s3:::bucket/* permite leitura de qualquer objeto. Granularize por prefix e ação.',
    severity: 'high',
    category: 'Acesso',
    cwe: 'CWE-269',
    remediation: 'Resource: "arn:aws:s3:::bucket-app/uploads/${aws:username}/*". Use Access Analyzer para detectar permissões não-utilizadas e gerar política minimizada.',
    testable: true,
  },
  {
    item: 'Pre-signed URLs com TTL curto (5-15 min para PUT, 1h para GET)',
    description: 'TTL longo aumenta janela de exfiltração se a URL vazar (logs CDN, browser history, telemetria). URLs incorporam credenciais válidas — não são tokens revogáveis.',
    severity: 'medium',
    category: 'Acesso',
    remediation: 'getSignedUrl(s3, command, { expiresIn: 900 }). Combinar com IAM Condition aws:SourceIp para limitar onde a URL pode ser usada.',
    testable: true,
  },
  {
    item: 'Default encryption habilitado em todos os buckets',
    description: 'Sem default encryption, é possível subir objeto sem criptografia (mesmo com bucket policy você precisa configurar Deny explícito). Default encryption garante AES256 ou KMS automaticamente.',
    severity: 'high',
    category: 'Criptografia',
    cwe: 'CWE-311',
    remediation: 'PutBucketEncryption: { Rules: [{ ApplyServerSideEncryptionByDefault: { SSEAlgorithm: "aws:kms", KMSMasterKeyID: "arn:..." }, BucketKeyEnabled: true }] }',
    testable: true,
  },
  {
    item: 'Bucket Key habilitado quando usar SSE-KMS',
    description: 'Sem Bucket Key, cada GET/PUT chama o KMS — custo cresce linearmente com volume. Bucket Key reduz 99% das chamadas KMS. Esquecer disso pode dobrar a fatura de KMS em buckets grandes.',
    severity: 'medium',
    category: 'Criptografia',
    remediation: 'BucketKeyEnabled: true em PutBucketEncryption. Para objetos legados, copie sobre si mesmos para aplicar Bucket Key.',
    testable: true,
  },
  {
    item: 'KMS keys com rotação automática anual',
    description: 'Chaves antigas têm mais oportunidade de comprometimento. Rotação anual é o padrão de compliance (PCI, SOC 2, HIPAA). Versões antigas continuam descriptografando dados antigos automaticamente.',
    severity: 'medium',
    category: 'Criptografia',
    remediation: 'aws kms enable-key-rotation --key-id <id>. Em Terraform: enable_key_rotation = true em aws_kms_key.',
    testable: true,
  },
  {
    item: 'Versioning ativado em buckets críticos',
    description: 'Versioning protege contra DELETE acidental (vira delete marker reversível) e overwrite (versões antigas preservadas). Sem versioning, ransomware ou bug que sobrescreve = perda permanente.',
    severity: 'high',
    category: 'Integridade',
    remediation: 'PutBucketVersioning: { Status: "Enabled" }. Combinar com lifecycle NoncurrentVersionExpiration para controlar custo.',
    testable: true,
  },
  {
    item: 'Lifecycle limpa versões antigas E partes multipart abandonadas',
    description: 'Versioning sem lifecycle vira armadilha de custo (versões acumulam infinitamente). Multipart sem AbortIncompleteMultipartUpload acumula partes invisíveis (não aparecem em ListObjects).',
    severity: 'medium',
    category: 'Integridade',
    remediation: 'NoncurrentVersionExpiration: { NoncurrentDays: 30, NewerNoncurrentVersions: 5 } + AbortIncompleteMultipartUpload: { DaysAfterInitiation: 7 } em TODA lifecycle policy.',
    testable: true,
  },
  {
    item: 'MFA Delete em buckets de auditoria/compliance',
    description: 'MFA Delete exige código de MFA do root da conta para deletar objeto ou suspender versioning. Protege contra credencial comprometida deletar logs.',
    severity: 'high',
    category: 'Integridade',
    remediation: 'aws s3api put-bucket-versioning --bucket b --mfa "arn:aws:iam::123:mfa/root SerialNumber 123456" --versioning-configuration Status=Enabled,MFADelete=Enabled  # exige root account.',
    testable: false,
  },
  {
    item: 'Object Lock COMPLIANCE em buckets WORM (logs, audit, regulatório)',
    description: 'Object Lock Compliance impede deleção mesmo pelo root pelo período configurado. Único modo aceito por SEC 17a-4, FINRA. Governance permite bypass com permissão especial.',
    severity: 'high',
    category: 'Integridade',
    remediation: 'Bucket criado com ObjectLockEnabled. Default Retention: { Mode: "COMPLIANCE", Years: 7 }. Não pode ser revertido depois de habilitado.',
    testable: true,
  },
  {
    item: 'CloudTrail Data Events habilitado em buckets sensíveis',
    description: 'CloudTrail Management Events não captura GetObject/PutObject. Para auditar acesso a objetos individuais, é necessário habilitar Data Events (custo extra). Essencial para investigação pós-incidente.',
    severity: 'high',
    category: 'Monitoramento',
    cwe: 'CWE-778',
    remediation: 'aws cloudtrail put-event-selectors --trail-name audit --event-selectors \'[{"DataResources":[{"Type":"AWS::S3::Object","Values":["arn:aws:s3:::bucket-prod/*"]}]}]\'',
    testable: true,
  },
  {
    item: 'Amazon Macie habilitado para detecção de PII e dados sensíveis',
    description: 'Macie usa ML para detectar automaticamente PII, credenciais, dados financeiros em buckets. Detecta vazamentos antes de virarem incidente — bucket com CPFs em prefix público é alertado em horas.',
    severity: 'medium',
    category: 'Monitoramento',
    remediation: 'Macie habilitado na conta + jobs de discovery agendados em buckets de produção. Alertas em SNS para descobertas de severidade alta.',
    testable: true,
  },
  {
    item: 'CloudWatch alarms em métricas anômalas (volume, 4xx, 5xx)',
    description: 'Pico súbito de GetObject pode indicar exfiltração. Pico de 4xx pode indicar tentativa de enumeração. Alarmes captam o que CloudTrail apenas registra.',
    severity: 'medium',
    category: 'Monitoramento',
    remediation: 'Habilitar Request Metrics no bucket. CloudWatch alarm em BytesDownloaded com threshold dinâmico via Anomaly Detection.',
    testable: true,
  },
  {
    item: 'S3 Storage Lens com métricas avançadas',
    description: 'Storage Lens identifica buckets sem lifecycle, sem encryption, com versioning crescendo descontroladamente. Visibilidade essencial em organizações com muitos buckets.',
    severity: 'low',
    category: 'Monitoramento',
    remediation: 'Storage Lens dashboard organizacional + advanced metrics + recomendações de otimização. Exportar CSV para BI.',
    testable: true,
  },
  {
    item: 'Replication para conta separada (anti-ransomware)',
    description: 'Backup na mesma conta cai com a conta. Replicação para conta dedicada de backup (com Object Lock no destino e DeleteMarkerReplication=Disabled) é o padrão moderno de proteção contra ransomware e comprometimento da conta primária.',
    severity: 'high',
    category: 'Replicação',
    remediation: 'CRR ou SRR para bucket em conta de backup. DeleteMarkerReplication: Disabled. Bucket destino com Object Lock COMPLIANCE.',
    testable: true,
  },
  {
    item: 'CORS configurado restritivamente — sem AllowedOrigins=*',
    description: 'CORS com origin = * permite qualquer site fazer upload via browser usando uma pre-signed URL vazada. Restringir aos domínios reais da aplicação.',
    severity: 'medium',
    category: 'Acesso',
    remediation: 'CORS: AllowedOrigins=["https://app.example.com"], AllowedMethods=["PUT", "GET"], MaxAge=3600. Sem wildcards em produção.',
    testable: true,
  },
  {
    item: 'Tags obrigatórias: DataClassification, Owner, Environment',
    description: 'Sem classificação de dados (Public, Internal, Confidential, Restricted), políticas e controles não conseguem ser diferenciados. SCP pode forçar tags em criação de bucket.',
    severity: 'low',
    category: 'Acesso',
    remediation: 'AWS Config rule required-tags + SCP que faz Deny em s3:CreateBucket sem aws:RequestTag/DataClassification.',
    testable: true,
  },
]

// ── Componente principal ──────────────────────────────────────────────────────

export default function S3Pdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)

  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
    'quick-ref': () => buildQuickRefPdf({
      columns: QR_COLUMNS,
      skillName: 'Amazon S3',
      accentColor: C,
      stackLabel: 'AWS / Cloud Storage',
      tagline: 'Object storage durável e barato — aws s3 / s3api / SDK',
      version: '2024',
    }),
    qa: () => buildQAReviewPdf({
      qa: QAS,
      accentColor: C,
      skillName: 'Amazon S3',
      stackLabel: 'AWS / Cloud Storage',
    }),
    antipatterns: () => buildAntipatternsPdf({
      antipatterns: ANTIPATTERNS,
      accentColor: C,
      skillName: 'Amazon S3',
      stackLabel: 'AWS / Cloud Storage',
    }),
    mnemonics: () => buildMnemonicsPdf({
      mnemonics: MNEMONICS,
      accentColor: C,
      skillName: 'Amazon S3',
      stackLabel: 'AWS / Cloud Storage',
    }),
    security: () => buildSecurityChecklistPdf({
      checks: SECURITY_CHECKS,
      accentColor: C,
      skillName: 'Amazon S3',
      stackLabel: 'AWS / Cloud Storage',
      targetAudience: 'Engenheiro DevOps / Cloud / Compliance',
      coverTitle: 'S3 — Hardening de Produção',
    }),
  }

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
