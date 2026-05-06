import type { SkillContent } from '@/types'

const s3: SkillContent = {
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
    {
      title: "Classes de Storage S3 — custo relativo e latência de retrieval",
      html: `<style>
.s3-ext1-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.s3-ext1-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.s3-ext1-label{min-width:170px;font-size:11px;font-weight:600;color:#e2e8f0}
.s3-ext1-bars{flex:1;display:flex;flex-direction:column;gap:4px}
.s3-ext1-bar-wrap{display:flex;align-items:center;gap:6px}
.s3-ext1-bar{height:10px;border-radius:4px;transition:width .4s}
.s3-ext1-bar-label{font-size:9px;color:#64748b;white-space:nowrap}
.s3-ext1-latency{min-width:90px;font-size:10px;text-align:right;font-family:'JetBrains Mono',monospace}
.s3-ext1-head{display:flex;align-items:center;gap:10px;margin-bottom:14px;font-size:9px;color:#64748b;letter-spacing:.08em;text-transform:uppercase}
.s3-ext1-head-label{min-width:170px}
.s3-ext1-legend{display:flex;gap:16px;margin-top:14px;font-size:10px;flex-wrap:wrap}
.s3-ext1-dot{width:10px;height:10px;border-radius:2px;display:inline-block;margin-right:4px;vertical-align:middle}
.s3-ext1-note{font-size:10px;color:#64748b;margin-top:3px}
</style>
<div class="s3-ext1-wrap">
<div style="font-size:13px;font-weight:700;color:#FF9900;margin-bottom:4px">S3 STORAGE CLASSES — CUSTO DE ARMAZENAMENTO vs LATÊNCIA</div>
<div style="font-size:10px;color:#64748b;margin-bottom:16px">Barras = custo relativo de armazenamento (Standard = 100%). Latência = tempo de retrieval.</div>

<div class="s3-ext1-head">
  <span class="s3-ext1-head-label">Classe</span>
  <span style="flex:1">Custo de armazenamento (relativo)</span>
  <span style="min-width:90px;text-align:right">Latência retrieval</span>
</div>

<div class="s3-ext1-row">
  <div class="s3-ext1-label">Standard</div>
  <div class="s3-ext1-bars">
    <div class="s3-ext1-bar-wrap">
      <div class="s3-ext1-bar" style="width:100%;background:#FF9900"></div>
      <span class="s3-ext1-bar-label">100% — referência</span>
    </div>
    <div class="s3-ext1-note">Acesso frequente. Sem taxa de retrieval. SLA 99,99%.</div>
  </div>
  <div class="s3-ext1-latency" style="color:#4ade80">~ms</div>
</div>

<div class="s3-ext1-row">
  <div class="s3-ext1-label">Standard-IA</div>
  <div class="s3-ext1-bars">
    <div class="s3-ext1-bar-wrap">
      <div class="s3-ext1-bar" style="width:58%;background:#fb923c"></div>
      <span class="s3-ext1-bar-label">~58% — mais barato</span>
    </div>
    <div class="s3-ext1-note">Paga retrieval por GB. Mín. 30 dias de armazenamento.</div>
  </div>
  <div class="s3-ext1-latency" style="color:#4ade80">~ms</div>
</div>

<div class="s3-ext1-row">
  <div class="s3-ext1-label">Intelligent-Tiering</div>
  <div class="s3-ext1-bars">
    <div class="s3-ext1-bar-wrap">
      <div class="s3-ext1-bar" style="width:68%;background:#fbbf24"></div>
      <span class="s3-ext1-bar-label">~68% (tier ativo)</span>
    </div>
    <div class="s3-ext1-note">Move automaticamente entre tiers. Monitoramento ~$0,0025/1k obj.</div>
  </div>
  <div class="s3-ext1-latency" style="color:#4ade80">~ms</div>
</div>

<div class="s3-ext1-row">
  <div class="s3-ext1-label">Glacier Instant</div>
  <div class="s3-ext1-bars">
    <div class="s3-ext1-bar-wrap">
      <div class="s3-ext1-bar" style="width:28%;background:#a78bfa"></div>
      <span class="s3-ext1-bar-label">~28%</span>
    </div>
    <div class="s3-ext1-note">Arquivamento com retrieval instantâneo. Paga por retrieval.</div>
  </div>
  <div class="s3-ext1-latency" style="color:#4ade80">~ms</div>
</div>

<div class="s3-ext1-row">
  <div class="s3-ext1-label">Glacier Flexible</div>
  <div class="s3-ext1-bars">
    <div class="s3-ext1-bar-wrap">
      <div class="s3-ext1-bar" style="width:14%;background:#818cf8"></div>
      <span class="s3-ext1-bar-label">~14%</span>
    </div>
    <div class="s3-ext1-note">Expedited: 1–5 min. Standard: 3–5 h. Bulk: 5–12 h.</div>
  </div>
  <div class="s3-ext1-latency" style="color:#f59e0b">min–horas</div>
</div>

<div class="s3-ext1-row">
  <div class="s3-ext1-label">Deep Archive</div>
  <div class="s3-ext1-bars">
    <div class="s3-ext1-bar-wrap">
      <div class="s3-ext1-bar" style="width:5%;background:#6366F1"></div>
      <span class="s3-ext1-bar-label">~5% — mais barato de todos</span>
    </div>
    <div class="s3-ext1-note">Retenção de 7–10 anos. Retrieval Standard: 12 h. Bulk: 48 h.</div>
  </div>
  <div class="s3-ext1-latency" style="color:#ef4444">12–48 h</div>
</div>

<div class="s3-ext1-legend">
  <span><span class="s3-ext1-dot" style="background:#4ade80"></span>Latência milissegundos</span>
  <span><span class="s3-ext1-dot" style="background:#f59e0b"></span>Latência minutos–horas</span>
  <span><span class="s3-ext1-dot" style="background:#ef4444"></span>Latência 12–48 h</span>
  <span style="color:#64748b">Criterion: frequência de acesso × tolerância a latência × custo de retrieval</span>
</div>
</div>`,
      caption: "Escolha a classe pelo padrão de acesso: acesso frequente → Standard, raramente acessado → IA ou Glacier Instant, arquivamento → Glacier Flexible/Deep Archive. Intelligent-Tiering gerencia a transição automaticamente quando o padrão é imprevisível.",
    },
    {
      title: "Camadas de Segurança S3 — defesa em profundidade",
      html: `<style>
.s3-ext1-sec-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.s3-ext1-sec-layer{border-radius:8px;padding:12px 14px;margin-bottom:8px;border-left:4px solid transparent}
.s3-ext1-sec-num{display:inline-block;width:22px;height:22px;border-radius:50%;font-size:11px;font-weight:700;text-align:center;line-height:22px;margin-right:8px;flex-shrink:0}
.s3-ext1-sec-title{font-weight:700;font-size:12px;display:flex;align-items:center;margin-bottom:7px}
.s3-ext1-sec-body{font-size:11px;color:#94a3b8;line-height:1.6;padding-left:30px}
.s3-ext1-sec-body code{background:rgba(255,255,255,.06);padding:1px 5px;border-radius:3px;font-size:10px;color:#fbbf24;font-family:'JetBrains Mono',monospace}
.s3-ext1-sec-verdict{font-size:10px;padding:8px 12px;border-radius:6px;margin-top:12px;display:flex;align-items:center;gap:8px}
</style>
<div class="s3-ext1-sec-wrap">
<div style="font-size:13px;font-weight:700;color:#FF9900;margin-bottom:4px">S3 — CAMADAS DE SEGURANÇA (defesa em profundidade)</div>
<div style="font-size:10px;color:#64748b;margin-bottom:14px">Deny em qualquer camada cancela o acesso — independentemente das outras.</div>

<div class="s3-ext1-sec-layer" style="background:rgba(239,68,68,.06);border-color:#ef4444">
  <div class="s3-ext1-sec-title">
    <span class="s3-ext1-sec-num" style="background:rgba(239,68,68,.2);color:#fca5a5">1</span>
    <span style="color:#fca5a5">Block Public Access — primeira e mais importante</span>
  </div>
  <div class="s3-ext1-sec-body">
    Ative em <strong style="color:#e2e8f0">nível de conta</strong> (bloqueia todos os buckets atuais e futuros). Independe de políticas individuais — override tudo. Impede que qualquer bucket vire público acidentalmente por erro de configuração.<br>
    <code>aws s3control put-public-access-block --account-id 123456789 --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true</code>
  </div>
</div>

<div class="s3-ext1-sec-layer" style="background:rgba(245,158,11,.06);border-color:#f59e0b">
  <div class="s3-ext1-sec-title">
    <span class="s3-ext1-sec-num" style="background:rgba(245,158,11,.2);color:#fbbf24">2</span>
    <span style="color:#fbbf24">Bucket Policy — resource-based, quem acessa o bucket</span>
  </div>
  <div class="s3-ext1-sec-body">
    Controla quem pode acessar o bucket e quais operações. Pode restringir a VPC específica: <code>Condition: {"StringNotEquals": {"aws:SourceVpc": "vpc-xxx"}}</code> — nega acesso de fora da VPC. Pode forçar HTTPS: <code>aws:SecureTransport: false → Deny</code>.
  </div>
</div>

<div class="s3-ext1-sec-layer" style="background:rgba(99,102,241,.06);border-color:#6366F1">
  <div class="s3-ext1-sec-title">
    <span class="s3-ext1-sec-num" style="background:rgba(99,102,241,.2);color:#a5b4fc">3</span>
    <span style="color:#a5b4fc">IAM Policies — identity-based, o que a identidade pode fazer</span>
  </div>
  <div class="s3-ext1-sec-body">
    Controla as permissões do usuário/role/serviço. Para acesso cross-account: <strong style="color:#e2e8f0">ambas</strong> (Bucket Policy E IAM) precisam permitir. Para acesso same-account: basta uma das duas permitir (sem deny explícito na outra). IAM é avaliado junto com Bucket Policy — a permissão efetiva é a interseção.
  </div>
</div>

<div class="s3-ext1-sec-layer" style="background:rgba(74,222,128,.06);border-color:#4ade80">
  <div class="s3-ext1-sec-title">
    <span class="s3-ext1-sec-num" style="background:rgba(74,222,128,.2);color:#86efac">4</span>
    <span style="color:#86efac">Object-Level Controls — ACL, Object Lock, Versionamento</span>
  </div>
  <div class="s3-ext1-sec-body">
    ACL: legado, desabilitado por padrão em buckets novos (use Bucket Policy). <strong style="color:#e2e8f0">Versionamento</strong>: protege contra delete acidental (delete marker, não delete real). <strong style="color:#e2e8f0">Object Lock WORM</strong>: imutabilidade por período — Governance (admin pode sobrescrever com permissão) vs Compliance (ninguém pode, nem root).
  </div>
</div>

<div class="s3-ext1-sec-layer" style="background:rgba(167,139,250,.06);border-color:#a78bfa">
  <div class="s3-ext1-sec-title">
    <span class="s3-ext1-sec-num" style="background:rgba(167,139,250,.2);color:#c4b5fd">5</span>
    <span style="color:#c4b5fd">Auditoria — CloudTrail S3 Data Events + Amazon Macie</span>
  </div>
  <div class="s3-ext1-sec-body">
    <strong style="color:#e2e8f0">CloudTrail Data Events</strong>: registra cada GetObject, PutObject, DeleteObject por objeto (custo adicional). <strong style="color:#e2e8f0">Macie</strong>: ML que detecta PII, credenciais, dados financeiros em objetos automaticamente. Essencial para compliance LGPD/HIPAA/PCI.
  </div>
</div>

<div class="s3-ext1-sec-verdict" style="background:rgba(255,153,0,.08);border:1px solid rgba(255,153,0,.2)">
  <span style="font-size:16px">⚠</span>
  <span style="color:#fbbf24"><strong>Sequência de avaliação:</strong> Block Public Access → Bucket Policy → IAM Policy. Deny explícito em qualquer nível cancela tudo. Allow implícito não é suficiente — precisa de Allow explícito de pelo menos uma política.</span>
</div>
</div>`,
      caption: "Defesa em profundidade: Block Public Access é a barreira global. Bucket Policy e IAM são avaliadas juntas. Object Lock garante imutabilidade para compliance. Macie detecta dados sensíveis automaticamente.",
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
    { q: "O que é S3 Object Lock e qual a diferença entre os modos Compliance e Governance?", a: "<p>S3 Object Lock implementa <strong>WORM</strong> (Write Once, Read Many) — protege objetos contra deleção e sobrescrita por um período de retenção configurado. Essencial para compliance regulatório onde imutabilidade é exigida legalmente.</p><p><strong>Modo Governance:</strong> a maioria dos usuários não pode sobrescrever ou deletar. Porém, usuários com a permissão <code>s3:BypassGovernanceRetention</code> podem. Útil para cenários onde administradores precisam corrigir erros sem comprometer a auditabilidade geral.</p><p><strong>Modo Compliance:</strong> ninguém pode alterar ou deletar — nem o root account, nem a AWS. Imutabilidade absoluta pelo período configurado. Não pode ser desativado depois de ativo. Exigido para regulações como SEC 17a-4, FINRA, HIPAA, LGPD para logs de auditoria.</p><p><strong>Legal Hold:</strong> além do período de retenção, você pode colocar um Legal Hold em qualquer objeto — suspende modificações independentemente do período. Útil durante investigações judiciais.</p><p>Pré-requisito: Versionamento deve estar ativado no bucket. Object Lock é configurado na criação do bucket — não pode ser adicionado depois.</p>", tip: "A distinção Compliance vs Governance é a pergunta clássica sobre Object Lock. Compliance = nem o root pode — mencione isso. Legal Hold é o diferencial de sênior.", level: "senior" },
    { q: "Qual a diferença entre CRR e SRR no S3 e quando usar cada um?", a: "<p><strong>CRR (Cross-Region Replication)</strong>: replica objetos para um bucket em uma <em>região diferente</em>. Casos de uso: (1) DR geográfico — cópia em outra região garante disponibilidade em caso de falha regional; (2) latência para usuários distantes — bucket próximo ao usuário serve reads mais rápido; (3) compliance de data residency — copiar dados para jurisdição específica. Requer versioning nos dois buckets. A replicação é assíncrona (lag de segundos).</p><p><strong>SRR (Same-Region Replication)</strong>: replica dentro da mesma região. Casos de uso: (1) consolidar logs de múltiplos buckets/contas em bucket central; (2) criar cópia com Object Lock (bucket destino imutável) — proteção contra ransomware e deleção acidental; (3) separar ambientes — bucket prod replica para bucket dev/analytics com dados reais (mascarados).</p><p><strong>Características comuns:</strong> assíncrona, não retroativa (só objetos novos), delete markers não replicados por padrão. Replication Time Control (RTC) garante 99,99% dos objetos replicados em 15 min com SLA — custo adicional.</p>", tip: "A pergunta 'CRR vs SRR' é formulada pela lógica de caso de uso. CRR = DR + latência global. SRR = consolidação + cópia imutável. Replication Time Control (RTC) como diferencial de SLA sênior.", level: "senior" },
    { q: "Como gerar uma pre-signed URL para upload direto do browser e por que evitar passar pelo servidor?", a: "<p>Pre-signed URL para upload (PUT) permite que o browser envie o arquivo <em>diretamente</em> ao S3 sem que o arquivo passe pelo backend. O backend apenas gera a URL assinada.</p><pre><code>// Node.js com AWS SDK v3\nimport { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner'\n\nconst client = new S3Client({ region: 'us-east-1' })\n\nasync function generateUploadUrl(key: string, contentType: string) {\n  const command = new PutObjectCommand({\n    Bucket: 'meu-bucket-privado',\n    Key: key,\n    ContentType: contentType,\n  })\n  return getSignedUrl(client, command, { expiresIn: 3600 })\n}</code></pre><p><strong>Por que evitar passar pelo servidor:</strong></p><ul><li>Custo de CPU: o servidor não precisa processar bytes do arquivo</li><li>Custo de egress: sem transferência servidor → S3 (egress cobrado)</li><li>Limitação de tamanho: servidores Node têm limite de request body (padrão 1–10 MB)</li><li>Latência: upload vai direto para S3 edge mais próximo do usuário</li></ul><p>Validação após upload: Lambda com trigger S3 PutObject valida o arquivo real (magic bytes, antivírus, resize) — mais seguro que confiar no Content-Type do cliente.</p>", tip: "Mencionar a validação pós-upload via Lambda é o que diferencia uma resposta completa de uma superficial. O client-side Content-Type é controlado pelo usuário e não deve ser confiado.", level: "pleno" },
    { q: "O que são S3 Access Points e como simplificam controle de acesso multi-workload?", a: "<p>S3 Access Points são endpoints nomeados com políticas próprias, anexados a um bucket. Cada Access Point tem um hostname único (<code>nome-ap-ACCOUNT.s3-accesspoint.REGION.amazonaws.com</code>) e uma política independente.</p><p><strong>Problema que resolvem:</strong> um bucket compartilhado por múltiplos times (dados, webapp, ML pipeline) acumula uma bucket policy com centenas de linhas e condições aninhadas — difícil de auditar e manter.</p><p><strong>Solução:</strong> cada workload tem seu Access Point com política focada:</p><ul><li><code>analytics-ap</code>: só leitura do prefixo <code>s3://bucket/data/</code>, de qualquer lugar</li><li><code>webapp-ap</code>: leitura + escrita em <code>s3://bucket/uploads/</code>, restrito à VPC da aplicação</li><li><code>ml-ap</code>: leitura do prefixo <code>s3://bucket/datasets/</code>, restrito à VPC de ML</li></ul><p><strong>VPC restriction:</strong> um Access Point com <code>VpcConfiguration</code> garante que o acesso só ocorra de dentro da VPC — sem internet, sem acesso externo possível.</p><p><strong>Multi-região:</strong> Multi-Region Access Points adicionam roteamento inteligente para o bucket mais próximo (junto com CRR configurado).</p>", tip: "Access Points são a resposta para 'como gerenciar bucket policy complexa'. A analogia 'cada workload tem sua porta de entrada com política própria' é clara para entrevistadores.", level: "senior" },
    { q: "Como o custo de egress do S3 funciona e como minimizar com CloudFront?", a: "<p>S3 cobra por dados <em>saindo</em> da AWS para a internet (egress). Não cobra por dados entrando (ingress) nem por transferências dentro da mesma região entre serviços AWS.</p><p><strong>Pricing de egress S3 direto (us-east-1):</strong></p><ul><li>Primeiro 1 GB/mês: grátis</li><li>Próximos 9,999 TB: ~$0,09/GB</li><li>Acima de 10 TB: ~$0,085/GB</li></ul><p><strong>Com CloudFront na frente:</strong> o egress CloudFront → usuário final é ~$0,0085–$0,085/GB (dependendo da região de edge). Além disso, o cache do CloudFront elimina muitas requests ao S3 — arquivos populares são servidos da edge sem atingir o S3. Em cenários com alta taxa de cache hit, o custo total pode ser 80–90% menor.</p><p><strong>Como configurar:</strong> CloudFront Distribution com Origin = bucket S3 + Origin Access Control (OAC) — bucket permanece privado, acessível apenas via CloudFront. Não existe custo de transferência S3 → CloudFront (mesmo entre regiões).</p><p><strong>Outros mitigadores:</strong> S3 Transfer Acceleration (para uploads de longa distância), S3 VPC Endpoints (transferência intra-VPC sem egress público), compressão de objetos antes de armazenar.</p>", tip: "A frase 'não há custo de transferência S3 → CloudFront' é contraintuitiva e frequentemente desconhecida — mencionar isso demonstra conhecimento real de pricing AWS.", level: "pleno" },
    { q: "Como usar S3 Event Notifications com SQS, SNS e Lambda — quando escolher cada um?", a: "<p>S3 Event Notifications disparam quando eventos ocorrem (PutObject, DeleteObject, RestoreObject, etc.) com filtro por prefixo e sufixo.</p><p><strong>S3 → Lambda (direto):</strong> processamento síncrono imediato. Simples, sem infraestrutura adicional. Desvantagem: sem fila de buffer — pico de uploads = pico de Lambdas simultâneas. Retry limitado (2× em erro, depois o evento é perdido sem DLQ). Use para processamento leve e tolerante a perda.</p><p><strong>S3 → SQS → Lambda:</strong> padrão mais robusto. SQS age como buffer — Lambda consome na velocidade configurada. Retry natural (até maxReceiveCount). DLQ para mensagens problemáticas. Melhor para processamento custoso (transcodificação, OCR) onde você quer controlar throughput e ter retry confiável.</p><p><strong>S3 → SNS → (SQS + Lambda + Email):</strong> fan-out. Um evento S3 dispara múltiplos consumidores em paralelo. Use quando o mesmo evento precisa acionar processamento + notificação + replicação simultâneos.</p><p><strong>S3 → EventBridge:</strong> filtros mais sofisticados (por size, metadata, etag). Roteamento para múltiplos targets com lógica complexa. Log histórico de eventos. Latência ligeiramente maior que notificações diretas. Preferível para novas arquiteturas onde você quer evolução sem alterar configuração do bucket.</p>", tip: "A escolha SQS vs Lambda direto pelo critério de throttle e retry confiável é o que o entrevistador quer ouvir — não apenas 'os três funcionam'.", level: "senior" },
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
}

export default s3
