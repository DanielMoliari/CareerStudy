import type { SkillContent } from '@/types'

const lambda: SkillContent = {
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
    {
      title: "Event Sources — tipos de invocação por serviço",
      html: `<style>
.lam-ext1-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.lam-ext1-h{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:12px;padding-bottom:5px;border-bottom:1px solid rgba(255,153,0,.2)}
.lam-ext1-row{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;margin-bottom:5px;font-size:11px;border-left:3px solid transparent}
.lam-ext1-sync{background:rgba(99,102,241,.06);border-color:#6366F1}
.lam-ext1-async{background:rgba(245,158,11,.06);border-color:#f59e0b}
.lam-ext1-poll{background:rgba(74,222,128,.06);border-color:#4ade80}
.lam-ext1-src{font-weight:600;color:#e2e8f0;min-width:180px}
.lam-ext1-inv{font-size:10px;padding:2px 7px;border-radius:10px;font-weight:700;white-space:nowrap}
.lam-ext1-note{color:#64748b;font-size:10px;margin-left:auto}
.lam-ext1-badge-s{background:rgba(99,102,241,.2);color:#a5b4fc}
.lam-ext1-badge-a{background:rgba(245,158,11,.2);color:#fbbf24}
.lam-ext1-badge-p{background:rgba(74,222,128,.2);color:#4ade80}
.lam-ext1-legend{display:flex;gap:14px;margin-top:14px;font-size:10px;flex-wrap:wrap}
.lam-ext1-dot{width:10px;height:10px;border-radius:2px;display:inline-block;margin-right:4px;vertical-align:middle}
</style>
<div class="lam-ext1-wrap">
<div style="font-size:13px;font-weight:700;color:#FF9900;margin-bottom:14px">LAMBDA EVENT SOURCES — TIPOS DE INVOCAÇÃO</div>
<div class="lam-ext1-h" style="color:#a5b4fc">Síncrono — o chamador AGUARDA a resposta</div>
<div class="lam-ext1-row lam-ext1-sync"><span class="lam-ext1-src">API Gateway / ALB</span><span class="lam-ext1-inv lam-ext1-badge-s">Síncrono</span><span class="lam-ext1-note">HTTP request → Lambda → HTTP response. Sem retry automático.</span></div>
<div class="lam-ext1-row lam-ext1-sync"><span class="lam-ext1-src">SDK (InvocationType=Request)</span><span class="lam-ext1-inv lam-ext1-badge-s">Síncrono</span><span class="lam-ext1-note">Chamada direta de aplicação. Ideal para orquestração.</span></div>
<div class="lam-ext1-row lam-ext1-sync"><span class="lam-ext1-src">Cognito / CloudFront</span><span class="lam-ext1-inv lam-ext1-badge-s">Síncrono</span><span class="lam-ext1-note">Triggers de autenticação e edge.</span></div>

<div class="lam-ext1-h" style="color:#fbbf24;margin-top:14px">Assíncrono — Lambda processa, chamador não espera</div>
<div class="lam-ext1-row lam-ext1-async"><span class="lam-ext1-src">S3 Events (PutObject etc.)</span><span class="lam-ext1-inv lam-ext1-badge-a">Assíncrono</span><span class="lam-ext1-note">Retry 2× automático. Configure DLQ/Destinations.</span></div>
<div class="lam-ext1-row lam-ext1-async"><span class="lam-ext1-src">SNS</span><span class="lam-ext1-inv lam-ext1-badge-a">Assíncrono</span><span class="lam-ext1-note">Fan-out: SNS → múltiplas Lambdas em paralelo.</span></div>
<div class="lam-ext1-row lam-ext1-async"><span class="lam-ext1-src">EventBridge</span><span class="lam-ext1-inv lam-ext1-badge-a">Assíncrono</span><span class="lam-ext1-note">Regras de roteamento. Retry configurável (0-185).</span></div>
<div class="lam-ext1-row lam-ext1-async"><span class="lam-ext1-src">SDK (InvocationType=Event)</span><span class="lam-ext1-inv lam-ext1-badge-a">Assíncrono</span><span class="lam-ext1-note">Fire-and-forget. Resposta imediata, execução posterior.</span></div>

<div class="lam-ext1-h" style="color:#4ade80;margin-top:14px">Polling — Lambda faz polling do source</div>
<div class="lam-ext1-row lam-ext1-poll"><span class="lam-ext1-src">SQS Standard / FIFO</span><span class="lam-ext1-inv lam-ext1-badge-p">Poll</span><span class="lam-ext1-note">Batch de 1–10.000 msgs. Visibility timeout ≥ 6× timeout.</span></div>
<div class="lam-ext1-row lam-ext1-poll"><span class="lam-ext1-src">Kinesis Data Streams</span><span class="lam-ext1-inv lam-ext1-badge-p">Stream</span><span class="lam-ext1-note">1 instância/shard. Retry até expirar. Bisect em erro.</span></div>
<div class="lam-ext1-row lam-ext1-poll"><span class="lam-ext1-src">DynamoDB Streams</span><span class="lam-ext1-inv lam-ext1-badge-p">Stream</span><span class="lam-ext1-note">Processamento ordenado por shard. Bloqueia em erro.</span></div>
<div class="lam-ext1-row lam-ext1-poll"><span class="lam-ext1-src">MSK / Self-managed Kafka</span><span class="lam-ext1-inv lam-ext1-badge-p">Stream</span><span class="lam-ext1-note">1 instância por partição Kafka.</span></div>

<div class="lam-ext1-legend">
  <span><span class="lam-ext1-dot" style="background:#6366F1"></span>Síncrono — sem retry Lambda-side</span>
  <span><span class="lam-ext1-dot" style="background:#f59e0b"></span>Assíncrono — retry 2× + DLQ/Destinations</span>
  <span><span class="lam-ext1-dot" style="background:#4ade80"></span>Poll/Stream — gerencia checkpoint + bisect</span>
</div>
</div>`,
      caption: "Cada modelo de invocação tem comportamento de retry diferente. Assíncrono: retry 2× automático. Poll: retry até maxReceiveCount (SQS) ou expirar (Kinesis/DDB). Síncrono: sem retry na Lambda — o chamador decide.",
    },
    {
      title: "Cold Start Anatomy — o que acontece em cada fase",
      html: `<style>
.lam-ext1-cs-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.lam-ext1-cs-phase{border-radius:8px;padding:12px 14px;margin-bottom:8px}
.lam-ext1-cs-label{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}
.lam-ext1-cs-bar{height:8px;border-radius:4px;margin-bottom:8px;transition:width .4s}
.lam-ext1-cs-detail{font-size:11px;color:#94a3b8;line-height:1.6}
.lam-ext1-cs-tip{font-size:10px;padding:5px 10px;border-radius:5px;margin-top:6px;display:inline-block}
.lam-ext1-cs-comp{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
.lam-ext1-cs-card{background:#1e293b;border-radius:8px;padding:10px 12px;font-size:10px}
.lam-ext1-cs-card-title{font-weight:700;margin-bottom:5px;font-size:11px}
</style>
<div class="lam-ext1-cs-wrap">
<div style="font-size:13px;font-weight:700;color:#FF9900;margin-bottom:6px">ANATOMIA DO COLD START LAMBDA</div>
<div style="font-size:11px;color:#64748b;margin-bottom:16px">O que acontece antes do seu código rodar na primeira invocação</div>

<div class="lam-ext1-cs-phase" style="background:rgba(245,158,11,.06);border-left:3px solid #f59e0b">
  <div class="lam-ext1-cs-label" style="color:#fbbf24">① INIT PHASE — 100 ms a 1 s+ (ocorre apenas no cold start)</div>
  <div class="lam-ext1-cs-bar" style="background:linear-gradient(90deg,#f59e0b,#fbbf24);width:65%"></div>
  <div class="lam-ext1-cs-detail">
    <strong style="color:#e2e8f0">a) Download do código:</strong> AWS baixa o pacote ZIP ou container image do S3. Pacote maior = download mais lento.<br>
    <strong style="color:#e2e8f0">b) Inicialização do runtime:</strong> JVM para Java/.NET CLR para C# (pesado), interpretador para Node.js/Python (leve).<br>
    <strong style="color:#e2e8f0">c) Execução do código global:</strong> tudo fora do handler roda aqui — import de módulos, inicialização de SDK, conexão de DB.
  </div>
  <div class="lam-ext1-cs-tip" style="background:rgba(245,158,11,.15);color:#fbbf24">Use este momento: inicializar DBPool, SDK clients, configuração — eles são <strong>reutilizados</strong> em invocações warm</div>
</div>

<div class="lam-ext1-cs-phase" style="background:rgba(74,222,128,.06);border-left:3px solid #4ade80">
  <div class="lam-ext1-cs-label" style="color:#4ade80">② INVOKE PHASE — o seu handler é chamado</div>
  <div class="lam-ext1-cs-bar" style="background:linear-gradient(90deg,#4ade80,#86efac);width:30%"></div>
  <div class="lam-ext1-cs-detail">
    Seu código dentro do <code style="color:#4ade80">handler(event, context)</code> executa. Acesso ao evento, context com requestId, funções de logging. Retorna resposta ou joga erro.
  </div>
</div>

<div class="lam-ext1-cs-phase" style="background:rgba(99,102,241,.06);border-left:3px solid #6366F1">
  <div class="lam-ext1-cs-label" style="color:#a5b4fc">③ SHUTDOWN (EXTENSION PHASE) — opcional</div>
  <div class="lam-ext1-cs-bar" style="background:#6366F1;width:5%"></div>
  <div class="lam-ext1-cs-detail">Extensions Lambda (agentes de observabilidade, Datadog, etc.) têm tempo extra após o handler retornar para enviar dados.</div>
</div>

<div class="lam-ext1-cs-comp">
  <div class="lam-ext1-cs-card">
    <div class="lam-ext1-cs-card-title" style="color:#4ade80">Como eliminar cold start</div>
    <div style="color:#94a3b8">• <strong style="color:#e2e8f0">Provisioned Concurrency</strong>: N instâncias sempre quentes (custo fixo)<br>• <strong style="color:#e2e8f0">SnapStart (Java)</strong>: snapshot do estado init — cold start cai para ~150ms<br>• <strong style="color:#e2e8f0">Pacote pequeno</strong>: esbuild/tree-shaking — menos download<br>• <strong style="color:#e2e8f0">Node.js/Python</strong>: cold start 5–10× mais rápido que Java</div>
  </div>
  <div class="lam-ext1-cs-card">
    <div class="lam-ext1-cs-card-title" style="color:#f59e0b">Fatores que pioram cold start</div>
    <div style="color:#94a3b8">• Container image (1 GB vs ZIP 5 MB)<br>• Lambda em VPC: provisionar ENI adiciona ~1s<br>• Framework pesado no init (Spring Boot, NestJS carregando tudo)<br>• Muitos imports estáticos no topo do arquivo</div>
  </div>
</div>
</div>`,
      caption: "A Init Phase é o cold start real. Warm invocations pulam direto para o Invoke Phase — o container e as variáveis globais já estão prontos. Inicialize fora do handler = reutilização gratuita.",
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
    { q: "Como Lambda em VPC afeta cold start e acesso à internet?", a: "<p>Lambda em VPC precisa provisionar uma ENI (Elastic Network Interface) para comunicação dentro da VPC. Isso adicionava até 10–15 s de cold start no passado. A partir de 2019 a AWS resolveu o problema com ENIs compartilhadas entre funções — o cold start adicional caiu para &lt;1 s.</p><p>Porém, Lambda em VPC ainda tem uma restrição importante: <strong>sem acesso à internet por padrão</strong>. Lambda é colocado numa subnet privada — sem rota para internet. Para acesso a APIs externas (Stripe, SendGrid, GitHub) ou serviços AWS pela internet:</p><ul><li><strong>NAT Gateway</strong>: na subnet pública, rota da subnet privada → NAT → internet. Funciona, mas tem custo por hora + por GB transferido.</li><li><strong>VPC Endpoints</strong>: acesso a serviços AWS (S3, DynamoDB, SQS, SSM, Secrets Manager) dentro da VPC sem passar pela internet — mais rápido, mais barato que NAT para tráfego AWS.</li></ul><p>Boa prática: coloque Lambda em VPC apenas quando precisar acessar RDS, ElastiCache ou outros recursos dentro da VPC. Para Lambda que só acessa APIs públicas, não use VPC — sem NAT e sem ENI overhead.</p>", tip: "A combinação 'Lambda em VPC + sem NAT Gateway + chamada a API externa = timeout silencioso' é um dos erros mais comuns. Mencionar VPC Endpoints como alternativa mais barata ao NAT para serviços AWS demonstra profundidade.", level: "senior" },
    { q: "Como funciona o tuning de memória Lambda para otimizar custo?", a: "<p>Em Lambda, memória determina CPU proporcional — você não configura CPU diretamente. Dobrar a memória dobra a CPU disponível. Isso cria uma relação inversa interessante: mais memória pode ser mais barato se a função terminar mais rápido.</p><p>Lambda cobra por GB-second: <code>memória_GB × duração_s × preço_por_GBs</code>. Se aumentar memória de 512 MB para 1 GB reduz a duração de 2 s para 0,8 s:</p><ul><li>512 MB × 2 s = 1 GB-s</li><li>1024 MB × 0,8 s = 0,82 GB-s — mais rápido E mais barato</li></ul><p><strong>Lambda Power Tuning</strong>: ferramenta open source da AWS (Step Functions) que executa sua função com múltiplas configurações de memória e mede custo × velocidade. Gera gráfico com o ponto ótimo.</p><p><strong>Sweet spots típicos:</strong></p><ul><li>Funções CPU-bound (parsing, compressão, criptografia): 1 GB–3 GB</li><li>Funções I/O-bound (espera de DB, API call): aumentar memória não ajuda muito — o bottleneck é a latência de rede, não CPU</li><li>Funções de imagem/vídeo: 3 GB–10 GB (usa múltiplos vCPUs)</li></ul>", tip: "Mencionar Lambda Power Tuning com um exemplo de custo real (GB-s antes e depois) é o que diferencia quem aplicou otimização de custo real de quem só leu sobre o assunto.", level: "senior" },
    { q: "Como fazer zero-downtime deploy de Lambda com alias e weighted routing?", a: "<p>Lambda Aliases apontam para versões específicas da função. Uma versão é imutável — código e configuração congelados. O alias produção (<code>prod</code>) pode ser redirecionado sem afetar a URL do caller.</p><p><strong>Fluxo de deploy seguro:</strong></p><ol><li>Publicar nova versão: <code>aws lambda publish-version --function-name minha-funcao</code> → retorna version number (ex: 5)</li><li>Configurar weighted routing no alias: alias <code>prod</code> com 10% apontando para versão 5 e 90% para versão 4</li><li>Monitorar métricas de erro nas próximas horas/dias</li><li>Aumentar gradualmente: 10% → 50% → 100%</li><li>Se erro: reverter alias para 100% na versão anterior — sem downtime, sem redeploy</li></ol><pre><code>aws lambda update-alias \\n  --function-name minha-funcao \\n  --name prod \\n  --function-version 5 \\n  --routing-config AdditionalVersionWeights={\\\"4\\\"=0.9}</code></pre><p>Use com CodeDeploy para automatizar: LinearXPercentEveryNMinutes ou CanaryXPercentAfterNMinutes — com rollback automático em alarme de CloudWatch.</p>", tip: "Aliases + weighted routing + CodeDeploy canary é o padrão de produção profissional para Lambda. Candidatos que sabem isso claramente trabalharam com Lambda em ambientes exigentes.", level: "senior" },
    { q: "Qual a diferença entre Provisioned Concurrency e Reserved Concurrency?", a: "<p>São conceitos opostos frequentemente confundidos:</p><p><strong>Reserved Concurrency</strong>: define o <em>teto máximo</em> de instâncias simultâneas de uma função. Reserva capacidade do pool da conta — as N instâncias reservadas ficam disponíveis exclusivamente para essa função e não são consumíveis por outras. Se a função atingir o limite: invocações síncronas recebem 429, assíncronas entram em retry. Custo: zero extra. Uso: proteger banco de dados de sobrecarga (100 connections = máximo 100 instâncias Lambda).</p><p><strong>Provisioned Concurrency</strong>: mantém N instâncias sempre <em>inicializadas e prontas</em> — sem cold start. Essas instâncias passaram pela Init Phase e estão esperando. Custo: você paga por cada instância provisionada por hora, independentemente de invocações. Uso: APIs de baixa latência onde cold start é inaceitável.</p><p><strong>Combinação possível:</strong> Reserved = 100 (máximo) + Provisioned = 20 (sempre quentes). As primeiras 20 invocações simultâneas têm zero cold start; da 21ª à 100ª podem ter cold start; acima de 100 são throttled.</p>", tip: "A confusão entre os dois é muito comum em entrevista. Dizer 'Reserved = teto (gratuito), Provisioned = instâncias quentes (pago)' em uma frase é a âncora que funciona.", level: "pleno" },
    { q: "Como Lambda SnapStart funciona e por que ajuda Java especificamente?", a: "<p>SnapStart foi lançado em 2022 para resolver o problema histórico de cold start do Java em Lambda. O problema: JVM startup + carregamento de classes + inicialização de frameworks como Spring Boot pode levar 5–15 s — inaceitável para APIs síncronas.</p><p><strong>Como funciona:</strong></p><ol><li>Você publica uma nova versão da função Java</li><li>Lambda executa a Init Phase completamente (JVM inicia, Spring Boot sobe, beans inicializados)</li><li>Lambda tira um snapshot da memória e estado do processo nesse ponto (usando CRIU — Checkpoint/Restore In Userspace)</li><li>O snapshot é armazenado em cache criptografado no S3</li><li>No cold start: Lambda restaura o snapshot em vez de reinicializar — leva ~150–200 ms em vez de 5–15 s</li></ol><p><strong>Restrições críticas:</strong></p><ul><li>Função deve ser determinística no init: sem random seeds no startup, sem timestamps capturados no init, sem conexões de rede estabelecidas no init (fechar antes do snapshot)</li><li>Disponível apenas para Java 11 (Corretto) e 17</li><li>Requer publicar uma versão (não funciona com $LATEST)</li></ul>", tip: "Mencionar CRIU (a tecnologia por baixo) demonstra leitura técnica da documentação AWS. Saber as restrições de determinismo é o que diferencia quem aplicou de quem só ouviu falar.", level: "senior" },
    { q: "Como escalar Lambda com SQS de forma confiável: visibility timeout, batch size e DLQ?", a: "<p>A integração Lambda + SQS tem três parâmetros críticos que precisam ser configurados em conjunto:</p><p><strong>1. Visibility Timeout da fila SQS</strong>: quando Lambda recebe uma mensagem, ela fica invisível na fila pelo tempo configurado. Se Lambda não deletar antes desse tempo, a mensagem aparece novamente. Regra: <code>Visibility Timeout ≥ 6 × Lambda Timeout</code>. Se Lambda timeout = 30 s, Visibility Timeout deve ser ≥ 180 s. Senão: processamento duplicado.</p><p><strong>2. Batch Size</strong>: quantas mensagens Lambda recebe por invocação (1–10.000 para Standard, 1–10 para FIFO). Batch maior = menos invocações = menor custo, mas falha de uma mensagem afeta o batch todo (a menos que use ReportBatchItemFailures).</p><p><strong>3. ReportBatchItemFailures</strong>: configure na Lambda como <code>functionResponseType: 'ReportBatchItemFailures'</code>. A função retorna quais messageIds falharam no response — só esses voltam para a fila. Sem isso: erro em 1 mensagem reprocessa o batch inteiro.</p><p><strong>4. DLQ na fila SQS</strong> (não na Lambda): mensagens que atingem maxReceiveCount vão para a DLQ. Configure maxReceiveCount = 3–5 para dar algumas chances antes de DLQ.</p><p><strong>Escala automática</strong>: Lambda cria instâncias conforme mensagens chegam (até 60 instâncias por minuto para SQS, depois +60/min). Para FIFO: uma instância por MessageGroupId.</p>", tip: "O erro de visibility timeout menor que o timeout da Lambda é o bug de produção mais comum com Lambda + SQS. Mencionar isso primeiro demonstra experiência real, não apenas teoria.", level: "senior" },
    { q: "Como implementar idempotência em funções Lambda para evitar processamento duplicado?", a: "<p>Lambda pode ser invocada mais de uma vez com o mesmo evento em dois cenários: (1) retry automático em invocação assíncrona (S3, SNS, EventBridge) — 2 retries; (2) SQS at-least-once delivery — a mesma mensagem pode ser entregue duas vezes em condições de rede ou se o visibility timeout expirar.</p><p><strong>Padrão de idempotência com DynamoDB:</strong></p><pre><code>// Gravar idempotency key antes de processar\nconst key = event.requestContext?.requestId ?? event.MessageId\n\n// Checar se já processou\nconst existing = await dynamo.get({ TableName: 'idempotency', Key: { pk: key } })\nif (existing.Item?.status === 'completed') {\n  return existing.Item.result // retorna resultado cacheado\n}\n\n// Marcar como em processamento (with condition expression)\nawait dynamo.put({\n  TableName: 'idempotency',\n  Item: { pk: key, status: 'processing', ttl: Math.floor(Date.now()/1000) + 86400 },\n  ConditionExpression: 'attribute_not_exists(pk)', // evita race condition\n})\n\n// Processar e marcar como concluído\nconst result = await processEvent(event)\nawait dynamo.update({ ..., status: 'completed', result })</code></pre><p><strong>AWS Lambda Powertools Idempotency</strong>: implementa esse padrão automaticamente com decorator <code>@idempotent</code> sobre o handler. Suporta DynamoDB como persistence layer e configura TTL automaticamente.</p>", tip: "Idempotência é crítica em qualquer Lambda que processa payments, envios ou operações com efeitos colaterais. Mencionar Lambda Powertools Idempotency demonstra conhecimento do ecossistema AWS.", level: "senior" },
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
}

export default lambda
