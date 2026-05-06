import type { SkillContent } from '@/types'

const systemDesign: SkillContent = {
  tagline: 'Desenhar sistemas que escalam, falham bem e cabem no orçamento real.',
  why: 'Toda entrevista senior tem uma rodada de system design. O que separa pleno de senior não é citar tecnologia, é justificar tradeoff: por que escolheu fila e não RPC, por que SQL e não NoSQL, qual SLA está defendendo. Sem framework de raciocínio, você derrapa em 5 minutos.',
  prerequisite: 'Conforto com HTTP, TCP, banco relacional básico, cache (Redis), filas (SQS/Kafka). Saber Big-O das operações de DS principais. Ter noção de escala vertical vs horizontal.',
  summary: 'System design é o exercício de transformar requisito vago ("quero um Twitter") em arquitetura concreta com números. O caminho padrão: clarificar escopo, estimar carga (QPS, dado, banda), definir API, modelar dado, escolher storage, desenhar fluxo, identificar gargalo, adicionar cache/fila/replica e fechar com tradeoffs. Não existe resposta única — existe resposta defensável pro contexto. Senior bom pergunta antes de desenhar e nomeia o que está sacrificando.\n\nO erro mais comum: pular pra desenho sem clarificar requisito. Você desenha caixinhas bonitas, gasta 30min, e o entrevistador joga "e se forem 100M usuários em 50 países?" — você precisa redesenhar tudo. Senior pergunta DAU, regiões, multi-tenant, latência aceitável, consistência, antes de qualquer caixa.\n\nO outro erro: copiar arquitetura de blog post. "Vou usar Kafka + Cassandra + ElasticSearch + Redis" sem justificar cada um. Cada componente adiciona custo operacional, observabilidade, modo de falha. Senior usa o mínimo necessário e cresce a partir daí.',
  howToStudy: '<strong>Tem 1 hora antes de uma entrevista?</strong> Memoriza a sequência de 7 passos (Clarify → Estimate → API → Data → High-level → Deep dive → Tradeoffs) e pratica com 1 caso (URL shortener ou Twitter feed) cronometrado.<br><br><strong>Tem 1 semana?</strong> Lê os capítulos 1-5 do <em>Designing Data-Intensive Applications</em> e resolve 5 problemas do System Design Primer (donnemartin/system-design-primer). Foca nos tradeoffs (CAP, particionamento, consistência), não em decorar arquitetura.<br><br><strong>Tem 1 mês?</strong> Faz mock interviews. ByteByteGo + canal Hussein Nasser pra deep dives. Pratica desenhar à mão (Excalidraw) — entrevistador vai te pedir pra desenhar ao vivo, não basta saber falar.<br><br><strong>Modelo mental central:</strong> "todo sistema é uma fila com cache". Toda solicitação entra, vai pra storage, sai. Onde está o gargalo? Latência da rede? IO do disco? CPU do parser? Cada componente novo (cache, replica, fila) é resposta a um gargalo específico — não enfeite.',
  diagrams: [
    {
      title: 'Framework de System Design Interview (7 passos)',
      html: `<div style="background:#0f172a;padding:36px 28px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
<style>
  .sd-flow{display:flex;flex-direction:column;gap:14px}
  .sd-step{display:flex;gap:18px;padding:18px;background:linear-gradient(90deg,rgba(99,102,241,0.10),rgba(99,102,241,0.02));border-left:3px solid #6366F1;border-radius:8px;cursor:pointer;transition:all .25s}
  .sd-step:hover{background:linear-gradient(90deg,rgba(99,102,241,0.20),rgba(99,102,241,0.05));transform:translateX(4px);box-shadow:-3px 4px 16px rgba(99,102,241,.18)}
  .sd-num{flex:0 0 44px;height:44px;border-radius:50%;background:#6366F1;color:#fff;font-weight:700;font-size:18px;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace}
  .sd-content{flex:1}
  .sd-title{font-weight:700;font-size:15px;margin-bottom:6px;color:#a5b4fc}
  .sd-desc{font-size:13px;line-height:1.6;color:#cbd5e1}
  .sd-time{display:inline-block;margin-top:8px;padding:3px 10px;background:rgba(99,102,241,0.15);border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#a5b4fc}
  .sd-questions{margin-top:8px;font-size:12px;color:#94a3b8;font-style:italic}
</style>
<div style="margin-bottom:24px;text-align:center">
  <div style="font-size:18px;font-weight:700;color:#a5b4fc;letter-spacing:.5px">FRAMEWORK 45min — DA PERGUNTA AO TRADEOFF</div>
  <div style="font-size:13px;color:#94a3b8;margin-top:6px">Hover em cada passo para ver detalhes</div>
</div>
<div class="sd-flow">
  <div class="sd-step">
    <div class="sd-num">1</div>
    <div class="sd-content">
      <div class="sd-title">CLARIFICAR REQUISITOS</div>
      <div class="sd-desc">Funcionais: o que o sistema faz? Não-funcionais: SLA de latência, disponibilidade, consistência, custo. Pergunte DAU, regiões, multi-tenant.</div>
      <div class="sd-questions">"Quantos usuários? Leitura ou escrita pesada? Latência máxima aceitável? Pode ter dados eventually consistent?"</div>
      <span class="sd-time">5 min</span>
    </div>
  </div>
  <div class="sd-step">
    <div class="sd-num">2</div>
    <div class="sd-content">
      <div class="sd-title">ESTIMAR ESCALA (BACK-OF-ENVELOPE)</div>
      <div class="sd-desc">QPS = DAU × ações/dia ÷ 86400. Storage = QPS × tamanho do registro × retenção. Bandwidth = QPS × payload. Decora: 1 server = 10-50K req/s, 1 disco SSD = 100K IOPS, 1 partição Kafka = ~10MB/s.</div>
      <div class="sd-questions">"100M DAU × 5 posts/dia = 500M/dia ÷ 86400 ≈ 5.8K writes/s. Pico 3x = 17K writes/s."</div>
      <span class="sd-time">5 min</span>
    </div>
  </div>
  <div class="sd-step">
    <div class="sd-num">3</div>
    <div class="sd-content">
      <div class="sd-title">DEFINIR API</div>
      <div class="sd-desc">Endpoints REST/gRPC com input/output. Force a pensar em domínio, paginação, autenticação. Não decore HTTP — pense no que cliente precisa.</div>
      <div class="sd-questions">"POST /tweets {text} → {id}. GET /feed?cursor=X&limit=50 → {tweets[], nextCursor}"</div>
      <span class="sd-time">5 min</span>
    </div>
  </div>
  <div class="sd-step">
    <div class="sd-num">4</div>
    <div class="sd-content">
      <div class="sd-title">MODELAR DADO</div>
      <div class="sd-desc">Schema das tabelas/coleções. Identifique relações 1:N, N:N. Pense em padrão de acesso (write-heavy? Read-heavy? Range scan?). Isso decide SQL vs NoSQL.</div>
      <div class="sd-questions">"users(id, name, ...), tweets(id, user_id, text, created_at), follows(follower_id, followee_id)"</div>
      <span class="sd-time">5 min</span>
    </div>
  </div>
  <div class="sd-step">
    <div class="sd-num">5</div>
    <div class="sd-content">
      <div class="sd-title">DESENHO HIGH-LEVEL</div>
      <div class="sd-desc">Caixas e setas. Cliente → CDN → LB → API → Cache → DB. Fila pra background job. Identifica componentes essenciais sem fazer deep dive.</div>
      <div class="sd-questions">"Browser → Route53 → CloudFront → ALB → ECS API → Redis (timeline cache) → RDS (source of truth) → SQS (fanout) → Worker"</div>
      <span class="sd-time">10 min</span>
    </div>
  </div>
  <div class="sd-step">
    <div class="sd-num">6</div>
    <div class="sd-content">
      <div class="sd-title">DEEP DIVE NO BOTTLENECK</div>
      <div class="sd-desc">Entrevistador escolhe 1-2 áreas pra aprofundar. Você prepara: feed (push vs pull), particionamento, replicação, hot key, cache invalidation, idempotência, racing conditions.</div>
      <div class="sd-questions">"Pra timeline de 200M users: fanout-on-write (push) pra usuários comuns + fanout-on-read (pull) pra celebridades."</div>
      <span class="sd-time">10 min</span>
    </div>
  </div>
  <div class="sd-step">
    <div class="sd-num">7</div>
    <div class="sd-content">
      <div class="sd-title">TRADEOFFS E EVOLUÇÃO</div>
      <div class="sd-desc">Nomeia o que escolheu sacrificar. Multi-region? Como adicionar? Como debugar bug em prod? Como evolui se DAU 10x?</div>
      <div class="sd-questions">"Escolhi eventual consistency no feed: usuário pode ver tweet 2s atrasado. Em troca, ganho 100x escala de leitura. Aceitável pro produto."</div>
      <span class="sd-time">5 min</span>
    </div>
  </div>
</div>
</div>`,
      caption: 'O passo 1 é o mais subestimado. Senior gasta 5min clarificando — junior pula direto pro desenho e desperdiça 30min refazendo.',
    },
    {
      title: 'Arquitetura de Sistema Escalável (referência)',
      html: `<div style="background:#0f172a;padding:36px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
<style>
  .sd-arch{display:grid;gap:18px}
  .sd-layer{padding:14px 18px;border-radius:8px;border:1px solid rgba(99,102,241,.25);position:relative}
  .sd-layer-title{font-family:'JetBrains Mono',monospace;font-size:11px;color:#a5b4fc;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}
  .sd-boxes{display:flex;gap:10px;flex-wrap:wrap}
  .sd-box{flex:1;min-width:120px;padding:12px;background:rgba(99,102,241,.10);border-radius:6px;text-align:center;font-size:12px;cursor:pointer;transition:all .2s;position:relative}
  .sd-box:hover{background:rgba(99,102,241,.25);transform:translateY(-2px)}
  .sd-box-name{font-weight:700;color:#fff;margin-bottom:3px}
  .sd-box-role{font-size:10px;color:#94a3b8;line-height:1.4}
  .sd-tooltip{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#1e293b;border:1px solid #6366F1;padding:10px 12px;border-radius:6px;font-size:11px;line-height:1.5;width:240px;z-index:10;text-align:left;color:#e2e8f0;box-shadow:0 8px 32px rgba(0,0,0,.4)}
  .sd-tooltip::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:6px solid transparent;border-top-color:#6366F1}
  .sd-box:hover .sd-tooltip{display:block}
  .sd-arrow{text-align:center;color:#6366F1;font-size:18px;font-weight:700}
</style>
<div style="margin-bottom:20px;text-align:center;font-size:16px;color:#a5b4fc;font-weight:700">FLUXO COMPLETO DE UMA REQUEST</div>
<div class="sd-arch">
  <div class="sd-layer" style="background:linear-gradient(90deg,rgba(99,102,241,.05),transparent)">
    <div class="sd-layer-title">▶ EDGE / DELIVERY</div>
    <div class="sd-boxes">
      <div class="sd-box"><div class="sd-box-name">DNS</div><div class="sd-box-role">Route53, NS1</div><div class="sd-tooltip">Geo-routing, health check, failover. TTL baixo (60s) pra mudança rápida, alto (1h) pra cache eficiente.</div></div>
      <div class="sd-box"><div class="sd-box-name">CDN</div><div class="sd-box-role">CloudFront, Cloudflare</div><div class="sd-tooltip">Cache estático global. PoPs nas bordas. Diminui latência de 200ms pra 20ms. Origem só é tocada em miss.</div></div>
      <div class="sd-box"><div class="sd-box-name">WAF</div><div class="sd-box-role">CloudFront WAF, Cloudflare</div><div class="sd-tooltip">Filtra ataques comuns: SQLi, XSS, DDoS L7. Rate limit por IP. Bloqueia bots maliciosos.</div></div>
    </div>
  </div>
  <div class="sd-arrow">↓</div>
  <div class="sd-layer" style="background:linear-gradient(90deg,rgba(99,102,241,.05),transparent)">
    <div class="sd-layer-title">▶ LOAD BALANCING</div>
    <div class="sd-boxes">
      <div class="sd-box"><div class="sd-box-name">L4 LB</div><div class="sd-box-role">NLB, HAProxy TCP</div><div class="sd-tooltip">Roteia por IP/porta. Milhões de conexões. <1ms latência. Bom pra WebSocket, gRPC streaming, gaming.</div></div>
      <div class="sd-box"><div class="sd-box-name">L7 LB</div><div class="sd-box-role">ALB, Nginx, Envoy</div><div class="sd-tooltip">Entende HTTP. Roteia por path, header, cookie. Termina TLS. Sticky session, retry, circuit breaker.</div></div>
      <div class="sd-box"><div class="sd-box-name">API Gateway</div><div class="sd-box-role">Kong, AWS API GW</div><div class="sd-tooltip">Auth, rate limiting, transformação, billing por API key. Camada extra mas centraliza cross-cutting concerns.</div></div>
    </div>
  </div>
  <div class="sd-arrow">↓</div>
  <div class="sd-layer" style="background:linear-gradient(90deg,rgba(99,102,241,.05),transparent)">
    <div class="sd-layer-title">▶ APPLICATION</div>
    <div class="sd-boxes">
      <div class="sd-box"><div class="sd-box-name">API Servers</div><div class="sd-box-role">ECS, EKS, K8s</div><div class="sd-tooltip">Stateless. Auto-scale por CPU/req-rate. Roda em containers. Idealmente immutable infrastructure (deploy = nova imagem).</div></div>
      <div class="sd-box"><div class="sd-box-name">Workers</div><div class="sd-box-role">BullMQ, Sidekiq, Celery</div><div class="sd-tooltip">Processam jobs assíncronos. Consumem fila. Tolerantes a falha (retry com backoff). Idempotentes.</div></div>
      <div class="sd-box"><div class="sd-box-name">Schedulers</div><div class="sd-box-role">Cron, EventBridge</div><div class="sd-tooltip">Tarefas periódicas: relatórios, billing, cleanup. Use distributed lock pra evitar duplicação multi-instance.</div></div>
    </div>
  </div>
  <div class="sd-arrow">↓</div>
  <div class="sd-layer" style="background:linear-gradient(90deg,rgba(99,102,241,.05),transparent)">
    <div class="sd-layer-title">▶ CACHE LAYER</div>
    <div class="sd-boxes">
      <div class="sd-box"><div class="sd-box-name">Redis</div><div class="sd-box-role">ElastiCache, Upstash</div><div class="sd-tooltip">In-memory. Sub-ms latência. Cache de objeto, session, rate limit, fila leve, leaderboard. Cluster mode pra escala.</div></div>
      <div class="sd-box"><div class="sd-box-name">Memcached</div><div class="sd-box-role">ElastiCache</div><div class="sd-tooltip">Cache puro key-value. Mais simples que Redis. Sem persistência. Bom pra cache de query result.</div></div>
      <div class="sd-box"><div class="sd-box-name">Local Cache</div><div class="sd-box-role">Caffeine, LRU</div><div class="sd-tooltip">In-process. Mais rápido (nanoseconds). Inconsistente entre instâncias. Bom pra dado quase imutável (config, feature flag).</div></div>
    </div>
  </div>
  <div class="sd-arrow">↓</div>
  <div class="sd-layer" style="background:linear-gradient(90deg,rgba(99,102,241,.05),transparent)">
    <div class="sd-layer-title">▶ STORAGE</div>
    <div class="sd-boxes">
      <div class="sd-box"><div class="sd-box-name">SQL OLTP</div><div class="sd-box-role">Postgres, MySQL, Aurora</div><div class="sd-tooltip">ACID, JOIN, schema. Read replicas pra escala leitura. Particionamento pra escala escrita. Source of truth na maioria dos sistemas.</div></div>
      <div class="sd-box"><div class="sd-box-name">NoSQL</div><div class="sd-box-role">DynamoDB, Cassandra, Mongo</div><div class="sd-tooltip">Escala horizontal massiva. Schema flexível. Padrão de acesso simples. AP no CAP. Use só se SQL não couber.</div></div>
      <div class="sd-box"><div class="sd-box-name">Object Storage</div><div class="sd-box-role">S3, GCS</div><div class="sd-tooltip">Arquivos grandes (imagens, vídeos, backups, logs). 99.999999999% durabilidade. Lifecycle: Standard → IA → Glacier.</div></div>
      <div class="sd-box"><div class="sd-box-name">Search</div><div class="sd-box-role">Elasticsearch, OpenSearch</div><div class="sd-tooltip">Full-text search, aggregations, log analytics. Não substitui DB principal — sincroniza via CDC.</div></div>
    </div>
  </div>
  <div class="sd-arrow">↔</div>
  <div class="sd-layer" style="background:linear-gradient(90deg,rgba(99,102,241,.05),transparent)">
    <div class="sd-layer-title">▶ MESSAGING / EVENTOS</div>
    <div class="sd-boxes">
      <div class="sd-box"><div class="sd-box-name">Queue</div><div class="sd-box-role">SQS, RabbitMQ</div><div class="sd-tooltip">Point-to-point. Worker consome msg. At-least-once por padrão (idempotência obrigatória). Bom pra job processing.</div></div>
      <div class="sd-box"><div class="sd-box-name">Stream</div><div class="sd-box-role">Kafka, Kinesis, Pulsar</div><div class="sd-tooltip">Pub/sub durável. Múltiplos consumidores leem mesmo log. Replay possível. Bom pra event sourcing, CDC, analytics.</div></div>
      <div class="sd-box"><div class="sd-box-name">Pub/Sub</div><div class="sd-box-role">SNS, EventBridge</div><div class="sd-tooltip">Fan-out de notificação. Sem retenção pesada. Bom pra notificar múltiplos consumidores em paralelo.</div></div>
    </div>
  </div>
  <div class="sd-arrow">↔</div>
  <div class="sd-layer" style="background:linear-gradient(90deg,rgba(99,102,241,.05),transparent)">
    <div class="sd-layer-title">▶ OBSERVABILITY</div>
    <div class="sd-boxes">
      <div class="sd-box"><div class="sd-box-name">Metrics</div><div class="sd-box-role">Prometheus, CloudWatch</div><div class="sd-tooltip">Time-series. Counter, gauge, histogram. RED (rate, errors, duration) e USE (utilization, saturation, errors).</div></div>
      <div class="sd-box"><div class="sd-box-name">Logs</div><div class="sd-box-role">Loki, ELK, CloudWatch</div><div class="sd-tooltip">Estruturado JSON. Correlation ID por request. Centralizado pra cross-service debugging.</div></div>
      <div class="sd-box"><div class="sd-box-name">Tracing</div><div class="sd-box-role">Jaeger, Tempo, X-Ray</div><div class="sd-tooltip">Distributed trace. Vê request atravessando microservices. Identifica gargalo na cascata.</div></div>
    </div>
  </div>
</div>
</div>`,
      caption: 'Não desenha tudo de uma vez. Começa simples (LB → API → DB) e cresce conforme entrevistador empurra. Cada caixa nova precisa de justificativa de gargalo.',
    },
    {
      title: 'Estimativa Back-of-Envelope (números pra decorar)',
      html: `<div style="background:#0f172a;padding:36px 28px;border-radius:14px;font-family:'JetBrains Mono',monospace;color:#e2e8f0;">
<style>
  .sd-est{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .sd-card{padding:18px;border-radius:8px;background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.18)}
  .sd-card-title{font-size:13px;font-weight:700;color:#a5b4fc;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;border-bottom:1px solid rgba(99,102,241,.2);padding-bottom:8px}
  .sd-row{display:flex;justify-content:space-between;font-size:12px;line-height:1.9;padding:4px 0;border-bottom:1px dashed rgba(255,255,255,.04)}
  .sd-row-label{color:#cbd5e1}
  .sd-row-value{color:#a5b4fc;font-weight:700}
  .sd-formula{margin-top:14px;padding:10px 12px;background:rgba(0,0,0,.3);border-left:2px solid #6366F1;font-size:11px;color:#94a3b8;line-height:1.6}
  .sd-banner{grid-column:1/-1;padding:14px 18px;background:linear-gradient(90deg,rgba(99,102,241,.20),rgba(99,102,241,.05));border-radius:8px;font-family:'Plus Jakarta Sans',sans-serif;text-align:center;color:#a5b4fc;font-weight:700;font-size:14px;letter-spacing:.5px}
</style>
<div class="sd-est">
  <div class="sd-banner">DECORE ESSAS ORDENS DE GRANDEZA — VOCÊ VAI USAR EM TODA ENTREVISTA</div>

  <div class="sd-card">
    <div class="sd-card-title">⏱ Latência</div>
    <div class="sd-row"><span class="sd-row-label">L1 cache</span><span class="sd-row-value">0.5 ns</span></div>
    <div class="sd-row"><span class="sd-row-label">RAM access</span><span class="sd-row-value">100 ns</span></div>
    <div class="sd-row"><span class="sd-row-label">SSD random read</span><span class="sd-row-value">100 µs</span></div>
    <div class="sd-row"><span class="sd-row-label">Rede mesmo DC</span><span class="sd-row-value">500 µs</span></div>
    <div class="sd-row"><span class="sd-row-label">HDD seek</span><span class="sd-row-value">10 ms</span></div>
    <div class="sd-row"><span class="sd-row-label">Rede US ↔ EU</span><span class="sd-row-value">100 ms</span></div>
    <div class="sd-formula">Memória é 200× mais rápida que SSD. SSD é 100× mais rápido que HDD. Cache em memória existe por isso.</div>
  </div>

  <div class="sd-card">
    <div class="sd-card-title">🚀 Throughput</div>
    <div class="sd-row"><span class="sd-row-label">1 servidor moderno</span><span class="sd-row-value">10-50K req/s</span></div>
    <div class="sd-row"><span class="sd-row-label">SSD random IOPS</span><span class="sd-row-value">100K</span></div>
    <div class="sd-row"><span class="sd-row-label">Postgres single</span><span class="sd-row-value">5-20K writes/s</span></div>
    <div class="sd-row"><span class="sd-row-label">Redis single node</span><span class="sd-row-value">100-500K ops/s</span></div>
    <div class="sd-row"><span class="sd-row-label">Kafka partição</span><span class="sd-row-value">~10 MB/s</span></div>
    <div class="sd-row"><span class="sd-row-label">Network 10G</span><span class="sd-row-value">~1 GB/s</span></div>
    <div class="sd-formula">Se passar de 10K writes/s num único banco, você precisa de sharding ou banco NoSQL distribuído.</div>
  </div>

  <div class="sd-card">
    <div class="sd-card-title">📅 Ordens de tempo</div>
    <div class="sd-row"><span class="sd-row-label">1 dia</span><span class="sd-row-value">86,400 s</span></div>
    <div class="sd-row"><span class="sd-row-label">1 mês</span><span class="sd-row-value">2.6M s</span></div>
    <div class="sd-row"><span class="sd-row-label">1 ano</span><span class="sd-row-value">31.5M s</span></div>
    <div class="sd-row"><span class="sd-row-label">99.9% uptime</span><span class="sd-row-value">8.7h down/ano</span></div>
    <div class="sd-row"><span class="sd-row-label">99.99%</span><span class="sd-row-value">52 min/ano</span></div>
    <div class="sd-row"><span class="sd-row-label">99.999%</span><span class="sd-row-value">5 min/ano</span></div>
    <div class="sd-formula">Custo de adicionar 1 nove é exponencial. 99.9% é fácil; 99.999% exige multi-region active-active e custa caro.</div>
  </div>

  <div class="sd-card">
    <div class="sd-card-title">💾 Storage</div>
    <div class="sd-row"><span class="sd-row-label">char ASCII</span><span class="sd-row-value">1 byte</span></div>
    <div class="sd-row"><span class="sd-row-label">int / timestamp</span><span class="sd-row-value">4-8 bytes</span></div>
    <div class="sd-row"><span class="sd-row-label">UUID</span><span class="sd-row-value">16 bytes</span></div>
    <div class="sd-row"><span class="sd-row-label">tweet médio</span><span class="sd-row-value">~280 bytes</span></div>
    <div class="sd-row"><span class="sd-row-label">imagem JPG média</span><span class="sd-row-value">~200 KB</span></div>
    <div class="sd-row"><span class="sd-row-label">vídeo 1min HD</span><span class="sd-row-value">~10 MB</span></div>
    <div class="sd-formula">100M tweets/dia × 280B = 28 GB/dia = 10 TB/ano. Cabe em 1 disco grande, mas precisa replicação e índice.</div>
  </div>

  <div class="sd-card">
    <div class="sd-card-title">📊 QPS típico</div>
    <div class="sd-row"><span class="sd-row-label">DAU 1M, 10 ações/dia</span><span class="sd-row-value">~115 QPS</span></div>
    <div class="sd-row"><span class="sd-row-label">DAU 100M, 10 ações/dia</span><span class="sd-row-value">~11.5K QPS</span></div>
    <div class="sd-row"><span class="sd-row-label">Read:Write ratio típico</span><span class="sd-row-value">100:1</span></div>
    <div class="sd-row"><span class="sd-row-label">Pico vs média</span><span class="sd-row-value">3-10×</span></div>
    <div class="sd-formula">QPS = DAU × ações/dia ÷ 86400. Pico é 3× a média (pico vespertino) — dimensione pra pico.</div>
  </div>

  <div class="sd-card">
    <div class="sd-card-title">⚡ Cache hit rate alvo</div>
    <div class="sd-row"><span class="sd-row-label">L1 (CPU)</span><span class="sd-row-value">>99%</span></div>
    <div class="sd-row"><span class="sd-row-label">CDN</span><span class="sd-row-value">90-95%</span></div>
    <div class="sd-row"><span class="sd-row-label">App cache (Redis)</span><span class="sd-row-value">80-90%</span></div>
    <div class="sd-row"><span class="sd-row-label">DB buffer pool</span><span class="sd-row-value">99% (idealmente)</span></div>
    <div class="sd-formula">Hit rate baixo (50%) significa cache mal-dimensionado ou TTL errado — reavalia tamanho/eviction policy.</div>
  </div>
</div>
</div>`,
      caption: 'Decora esses números. Você não tira no Google na entrevista. "1 servidor faz 10K req/s" e "100M usuários × 10 ações = ~12K QPS" são pão-com-manteiga.',
    },
  ],
  keypoints: [
    { title: 'Funcional vs não-funcional', body: 'Funcional = o que o sistema faz (postar tweet, seguir user). Não-funcional = como ele faz (latência, disponibilidade, consistência, custo). Senior começa clarificando os dois antes de desenhar qualquer caixa. Os não-funcionais decidem 80% da arquitetura.', code: '// Clarificação típica\n// "Quero um Twitter clone"\n// → DAU? Tweets/dia? Ratio leitura/escrita? Latência aceitável?\n// → 200M DAU, 5 tweets/dia, 100:1 read/write, P99 < 200ms\n// Agora você tem números pra desenhar.' },
    { title: 'Back-of-envelope (estimativa)', body: 'Estima QPS, tamanho do dado, banda, storage por ano. Sem número, você não sabe se cabe num Postgres ou precisa de sharding. Memorize: 1 disco SSD = ~100K IOPS, 1 servidor = ~10K-50K req/s, latência memória=100ns / SSD=100µs / rede DC=500µs / rede US-EU=100ms.', code: '// Twitter — back-of-envelope\nDAU = 200M\nTweets/dia/user = 5\nWrites/dia = 200M × 5 = 1B\nWrites/s = 1B / 86400 ≈ 11.5K/s\nPico (3×) = ~35K writes/s\nReads/s = 100× writes = 1.15M/s\n// Storage: 1B × 280B = 280GB/dia = ~100TB/ano\n// Cache de timeline: 200M × 800 tweets × 50B = ~8TB' },
    { title: 'CAP e PACELC', body: 'CAP: na partição de rede, escolhe Consistency OU Availability. PACELC adiciona: SEM partição, escolhe Latency OU Consistency. Maioria dos sistemas reais é AP+EL (DynamoDB, Cassandra) ou CP+EC (Spanner, Postgres síncrono). Senior cita PACELC e justifica posição.' },
    { title: 'Cache patterns', body: 'Cache-aside (app lê cache, fallback no DB), write-through (escreve nos dois), write-behind (escreve cache, async no DB), refresh-ahead (renova antes de expirar). TTL e invalidação são 50% do problema. Phil Karlton: "There are only two hard things: cache invalidation and naming things".', code: '// Cache-aside (mais comum)\nasync function getUser(id) {\n  const cached = await redis.get(`user:${id}`)\n  if (cached) return JSON.parse(cached)\n  const user = await db.user.findUnique({ where: { id } })\n  await redis.setex(`user:${id}`, 300, JSON.stringify(user))\n  return user\n}\n// Cuidado: cache stampede — 1000 reqs simultâneos em miss\n// → use single-flight ou probabilistic early expiration' },
    { title: 'Particionamento (sharding)', body: 'Range (intervalos), hash (mod ou consistent hashing), geographic. Hash distribui melhor mas mata range scan. Consistent hashing minimiza rebalance quando adiciona/remove nó. Hot key (1 partição muito acessada) é o pesadelo — use composite key ou cache de leitura.', code: '// Hash sharding simples (ruim)\nshardId = hash(userId) % 4\n// Adicionar shard 5 = recalcular tudo. Catastrófico.\n\n// Consistent hashing (bom)\n// Hash anel 0-2^32, cada shard ocupa range\n// Adicionar shard só rebalanceia ~1/N dos dados' },
    { title: 'Replicação', body: 'Síncrona = forte mas lenta e amarra disponibilidade (se replica cair, escrita para). Assíncrona = rápida mas perde dado em failover. Quorum (Raft, Paxos) é o meio termo: maioria confirma, sobrevive a minoria caída. Read replicas escalam leitura mas têm lag — não use pra read-after-write.' },
    { title: 'Fila como cushion', body: 'Fila absorve spike, desacopla produtor/consumidor, permite retry. Trade: latência maior + complexidade de idempotência + mensagem duplicada. SQS, Kafka, RabbitMQ — escolha varia com semantica (at-least-once, ordering, retention). Use sempre que ação não precisa retornar resultado imediato (envio de email, processamento de imagem, fanout).' },
    { title: 'Load balancer L4 vs L7', body: 'L4 (NLB, HAProxy TCP) opera em IP/porta. Milhões de conexões/s, <1ms latência. Bom pra WebSocket, gRPC streaming, gaming. L7 (ALB, Nginx) entende HTTP — routing por path/header, terminação TLS, sticky session. Custa ~5-10ms. API HTTP típica: ALB.' },
    { title: 'Idempotência', body: 'Toda operação retryable precisa ser idempotente (rodar 2x = mesmo resultado). Implementa via idempotency key (cliente envia UUID), upsert, ou dedup table. Sem idempotência, retry duplica dado — pesadelo em pagamento, envio de notificação.', code: '// Endpoint idempotente\nPOST /payments\nIdempotency-Key: abc-123\n\n// Backend\nasync function pay(req) {\n  const key = req.headers["idempotency-key"]\n  const existing = await db.idempotency.findUnique({ where: { key } })\n  if (existing) return existing.response\n  // ... processa ...\n  await db.idempotency.create({ data: { key, response } })\n}' },
    { title: 'Rate limiting', body: 'Token bucket (tokens regenerados a taxa fixa, request consome 1), sliding window (contagem em janela), fixed window (contagem por minuto). Implementa em Redis com INCR + EXPIRE, ou Lua script atômico. Senior fala em rate limit por user, por API key, por IP, com diferentes limites.', code: '// Token bucket em Redis (Lua atômico)\nlocal tokens = redis.call("GET", KEYS[1])\nif not tokens then tokens = ARGV[1] end\nif tonumber(tokens) >= 1 then\n  redis.call("DECR", KEYS[1])\n  return 1  -- allowed\nelse\n  return 0  -- denied\nend' },
    { title: 'Circuit breaker', body: 'Padrão pra evitar cascata de falha em microservices. Estados: closed (normal), open (rejeita imediato após N falhas), half-open (testa periodicamente). Resilience4j, Hystrix, Polly. Senior combina com timeout, retry com backoff, bulkhead.' },
    { title: 'Tail latency e P99', body: 'P50 = mediana, metade dos requests são mais rápidos. P99 = 1% pior, é o que usuário reclama. Em sistema com 1B requests/dia, 1% = 10M requests lentos. P50 baixo com P99 alto = tail latency, geralmente por GC pause, lock, retry, nó degradado. Senior monitora P99/P999 e ataca tail amplification (request fanout multiplica probabilidade).' },
    { title: 'Multi-region', body: 'Active-passive (failover) é simples mas DR lento. Active-active é caro: precisa replicação cross-region (latência alta), conflict resolution, cross-region cost. Faz só se SLA exige (99.99%+) ou regulação obriga (GDPR data residency). Antes de multi-region, esgota multi-AZ.' },
    { title: 'CDC e event-driven evolução', body: 'Change Data Capture (Debezium) lê WAL do banco e publica em Kafka. Habilita read models (CQRS), full-text search (Elasticsearch), data warehouse, sem dual-write. Padrão moderno pra evoluir monolito sem refazer tudo.' },
  ],
  cheatsheet: {
    title: 'System Design — Decisões Rápidas',
    html: `<div style="background:#0f172a;padding:32px 24px;border-radius:14px;font-family:'JetBrains Mono',monospace;color:#e2e8f0;">
<style>
  .sd-cs{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .sd-cs-card{padding:14px 16px;background:rgba(99,102,241,.07);border-radius:8px;border:1px solid rgba(99,102,241,.18)}
  .sd-cs-title{font-size:12px;font-weight:700;color:#a5b4fc;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(99,102,241,.2)}
  .sd-cs-row{font-size:11px;line-height:1.7;color:#cbd5e1;padding:4px 0}
  .sd-cs-row b{color:#a5b4fc}
  .sd-cs-row em{color:#94a3b8;font-style:normal;font-size:10px}
</style>
<div class="sd-cs">
  <div class="sd-cs-card">
    <div class="sd-cs-title">SQL vs NoSQL</div>
    <div class="sd-cs-row"><b>SQL</b> — schema estável, ACID forte, JOIN, &lt;10TB</div>
    <div class="sd-cs-row"><b>NoSQL</b> — escala &gt;10TB, schema flex, padrão simples</div>
    <div class="sd-cs-row"><b>Postgres</b> aguenta 95% dos casos. Use NoSQL com justificativa.</div>
  </div>
  <div class="sd-cs-card">
    <div class="sd-cs-title">Cache strategy</div>
    <div class="sd-cs-row"><b>Cache-aside</b> — padrão. App controla.</div>
    <div class="sd-cs-row"><b>Write-through</b> — consistência forte.</div>
    <div class="sd-cs-row"><b>Write-behind</b> — escrita rápida, perda se cair.</div>
  </div>
  <div class="sd-cs-card">
    <div class="sd-cs-title">Mensageria</div>
    <div class="sd-cs-row"><b>SQS</b> — fila simples. At-least-once.</div>
    <div class="sd-cs-row"><b>Kafka</b> — log durável, replay, multi-consumer, ordering.</div>
    <div class="sd-cs-row"><b>RabbitMQ</b> — routing complexo (exchange + binding).</div>
    <div class="sd-cs-row"><b>SNS</b> — fanout pub/sub.</div>
  </div>
  <div class="sd-cs-card">
    <div class="sd-cs-title">Sharding</div>
    <div class="sd-cs-row"><b>Range</b> — bom range scan, hot spot fácil.</div>
    <div class="sd-cs-row"><b>Hash mod</b> — distribui bem, rebalance ruim.</div>
    <div class="sd-cs-row"><b>Consistent hash</b> — rebalance ~1/N. Padrão.</div>
    <div class="sd-cs-row"><b>Composite</b> — hash(tenant) + range(time).</div>
  </div>
  <div class="sd-cs-card">
    <div class="sd-cs-title">Consistência</div>
    <div class="sd-cs-row"><b>Strong</b> — leitura sempre vê última escrita. Caro.</div>
    <div class="sd-cs-row"><b>Read-your-writes</b> — meio-termo. Sticky session.</div>
    <div class="sd-cs-row"><b>Eventual</b> — converge "logo". Padrão escala.</div>
    <div class="sd-cs-row"><b>Causal</b> — ordem causal preservada.</div>
  </div>
  <div class="sd-cs-card">
    <div class="sd-cs-title">Disponibilidade</div>
    <div class="sd-cs-row"><b>99%</b> = 3.65 dias down/ano. Hobby.</div>
    <div class="sd-cs-row"><b>99.9%</b> = 8.76h. Produto típico.</div>
    <div class="sd-cs-row"><b>99.99%</b> = 52min. Multi-AZ.</div>
    <div class="sd-cs-row"><b>99.999%</b> = 5min. Multi-region active-active.</div>
  </div>
  <div class="sd-cs-card">
    <div class="sd-cs-title">Idempotência</div>
    <div class="sd-cs-row"><b>Client</b> manda idempotency-key UUID.</div>
    <div class="sd-cs-row"><b>Server</b> guarda em tabela com TTL.</div>
    <div class="sd-cs-row"><b>Operações</b> retryable: pagamento, fanout, send.</div>
  </div>
  <div class="sd-cs-card">
    <div class="sd-cs-title">Rate limit</div>
    <div class="sd-cs-row"><b>Token bucket</b> — burst friendly. Padrão.</div>
    <div class="sd-cs-row"><b>Sliding window</b> — preciso, mais memória.</div>
    <div class="sd-cs-row"><b>Fixed window</b> — simples, edge spike 2×.</div>
    <div class="sd-cs-row"><b>Dimensões</b> — user, IP, API key, endpoint.</div>
  </div>
</div>
</div>`,
    caption: 'Decora as 4 colunas: SQL/NoSQL, cache strategy, mensageria, sharding. São 80% das decisões.',
  },
  mnemonics: [
    { label: 'CAP — escolha sob partição', trick: 'CAP', explanation: 'C(onsistency) ou A(vailability) sob P(artition). Sem partição você tem os dois — PACELC adiciona: SEM partição, escolha L(atency) ou C(onsistency).' },
    { label: 'Estimativa de QPS', trick: 'D × A ÷ 86400', explanation: 'D(AU) × A(ções/dia) ÷ 86400 segundos. Pico é 3×. Read:Write típico 100:1.' },
    { label: 'RED metrics', trick: 'RED', explanation: 'R(equest rate) + E(rrors) + D(uration). Trio mínimo de monitoramento de serviço.' },
    { label: 'USE metrics (infra)', trick: 'USE', explanation: 'U(tilization) + S(aturation) + E(rrors). Brendan Gregg pra recurso de infra (CPU, disco, rede).' },
  ],
  gotchas: [
    'Pular estimativa de carga e já ir pra Kafka — entrevistador percebe que você está repetindo blog post.',
    'Falar "uso microservices" sem justificar tamanho do time, domínio e custo operacional — red flag clássico.',
    'Esquecer de single point of failure — load balancer, DNS, banco master, cache central. Pergunte sempre "e se isso cair?".',
    'Confundir 99.9% com 99.99% — são 8h vs 52min de downtime por ano. Custo de adicionar um nove é exponencial.',
    'Otimizar pra escala que você não tem — premature scaling mata startup mais rápido que feature errada.',
    'Não pensar em hot key (1 user com 100M followers) — fanout-on-write quebra. Precisa estratégia híbrida.',
    'Esquecer idempotência em operação retryable — duplicação em pagamento ou notificação é catastrófica.',
    'Read-after-write em read replica com lag — usuário cria post e não vê. Use sticky session ou leitura no primary.',
    'Cache stampede em key popular — 1000 reqs simultâneos em miss esmagam o banco. Single-flight ou probabilistic early refresh.',
    'TTL muito longo gera dado stale; muito curto destrói hit rate. Mede e ajusta por workload.',
  ],
  interview: [
    { q: 'Como você conduziria uma entrevista de system design pra um encurtador de URL?', a: '<p>Primeiro <strong>clarifico</strong>: quantas URLs/dia? Vida útil? Custom alias? Analytics? Suponho 100M URLs/dia, 100:1 read/write, 5 anos. Aí estimo: ~1.16K writes/s, 116K reads/s, ~500GB/ano de dado.</p><p>Depois desenho: <code>API</code> (POST /shorten, GET /{code}), <code>encoder</code> (base62 de counter ou hash), <strong>cache</strong> Redis na frente da leitura, banco particionado por hash do shortcode. Add CDN pra geo-distribuir leitura.</p><p>Fecho discutindo <strong>tradeoff</strong>: counter centralizado vira gargalo (uso range allocation por servidor — cada API server pega 1000 IDs e gerencia local), hash colide (preciso retry), e analytics async via fila pra não impactar latência da leitura.</p>', tip: 'Pratica esse caso com timer. 45min do início ao fim. Não pula passo.', level: 'pleno' },
    { q: 'Quando você escolheria SQL e quando NoSQL?', a: '<p><strong>SQL</strong> ganha quando: o dado tem schema estável, você precisa de transação ACID forte (financeiro, estoque), faz JOIN frequente, e volume cabe em vertical scaling + read replicas (quase sempre cabe até alguns TB).</p><p><strong>NoSQL</strong> ganha em casos específicos: escala horizontal massiva (DynamoDB pra carrinho da Amazon), schema variável (catálogo de produtos), padrão de acesso conhecido e simples (key-value), ou dado em formato natural de documento/grafo.</p><p>Red flag: escolher Mongo "porque é mais moderno" sem ter problema de escala. Postgres aguenta muito mais do que junior pensa — read replicas + connection pooling + índices certos resolvem 95% dos casos.</p>', tip: 'Se entrevistador empurrar pra NoSQL sem justificativa, defenda Postgres com números — você ganha pontos por não over-engineering.', level: 'pleno' },
    { q: 'Você desenharia um sistema com consistência forte ou eventual?', a: '<p>Depende do <strong>domínio</strong>. Saldo bancário, estoque, autorização — consistência forte, mesmo pagando latência e disponibilidade. Feed social, contador de likes, notificação — eventual é ótima.</p><p>Pergunta chave: <em>"qual o custo de o usuário ver dado desatualizado por 2 segundos?"</em>. Se é zero, vai eventual e ganha escala. Se é fraude, vai forte. Em 80% dos sistemas reais, dá pra <strong>misturar</strong>: forte no caminho crítico (checkout) e eventual no resto (recomendação, analytics).</p>', tip: 'Senior cita PACELC e nomeia tradeoff explicitamente.', level: 'senior' },
    { q: 'Quando NÃO usar cache?', a: '<p>Quando o <strong>hit rate vai ser baixo</strong> (dado muito personalizado, alto fanout) — você paga complexidade sem ganho. Quando o dado muda mais rápido que TTL mínimo razoável — invalidação vira pesadelo. Quando o requisito é <strong>read-after-write forte</strong> e você não pode pagar staleness.</p><p>Também evito cache em sistema com poucos usuários — Postgres com índice resolve sem mais um componente operacional pra manter, monitorar e debugar. Cache adiciona modo de falha (cache poisoning, stampede, key inconsistency) — só vale se traz ROI claro.</p>', level: 'pleno' },
    { q: 'Como você dimensiona load balancer e ALB vs NLB?', a: '<p><strong>L7 (ALB)</strong> entende HTTP — faz routing por path/header, terminação TLS, sticky session, retry. Custa mais latência (~5-10ms). <strong>L4 (NLB)</strong> opera em TCP/UDP — milhões de conexões/s, latência <1ms, mas não entende HTTP.</p><p>API pública HTTP: ALB. WebSocket pesado, gRPC streaming, gaming, IoT TCP: NLB. Multi-camada é comum: NLB na borda + ALB interno por serviço. Em K8s, Ingress (Nginx, Traefik, Envoy) é o L7 — combina com NLB cloud na frente.</p>', level: 'pleno' },
    { q: 'Como você explica latência P99 vs P50 numa entrevista?', a: '<p>P50 = mediana, metade dos requests são mais rápidos. P99 = 1% pior, é o que <strong>usuário reclama</strong>. Em sistema com 1B requests/dia, 1% = 10M requests lentos.</p><p>P50 baixo com P99 alto = tail latency, geralmente por GC pause, lock, retry, nó degradado, conexão fria, vizinho barulhento. Senior monitora P99/P999 e ataca <strong>tail amplification</strong> — request que chama 100 microservices em paralelo tem P99 do conjunto = ~P63 de cada (probabilidade composta).</p><p>Mitigação: timeout agressivo + hedged request (manda 2 reqs em paralelo se 1ª demorar, usa 1ª resposta).</p>', level: 'senior' },
    { q: 'Como desenharia o feed do Twitter pra 200M usuários?', a: '<p><strong>Estimativa</strong>: 200M DAU × 5 tweets/dia = 1B writes/dia ≈ 12K writes/s (pico 35K). Reads 100× = 1.2M reads/s.</p><p><strong>Estratégia híbrida (push + pull)</strong>:</p><ol><li><strong>Fanout-on-write (push)</strong> pra usuários comuns — quando user posta, escreve em cache de timeline de cada follower. Read é O(1).</li><li><strong>Fanout-on-read (pull)</strong> pra celebridades (>1M followers) — não fanout. Quando follower abre app, mistura tweets dele com tweets dos celebs que segue.</li></ol><p><strong>Stack</strong>: Cassandra pra timeline (schema timeline_id + tweet_id, write-heavy), Redis pra cache do home feed, Kafka pra fanout async, S3 pra mídia, CDN pra delivery.</p><p><strong>Tradeoff</strong>: hybrid evita hot key de celebridade mas adiciona complexidade no read path. Worth pra 200M.</p>', tip: 'Esse é cenário canônico. Esteja pronto pra desenhar essa arquitetura na ponta da língua.', level: 'senior' },
    { q: 'Como projeta um sistema de notificações em tempo real (Slack)?', a: '<p><strong>Conexões</strong>: WebSocket persistente do client com gateway. Gateway shardado por conexão (consistent hash). Cada gateway mantém ~50K conexões.</p><p><strong>Routing</strong>: serviço de presença mapeia user → gateway. Mensagem entra: lookup gateway, envia via Kafka topic do gateway, gateway consome e push pra socket correto.</p><p><strong>Histórico</strong>: mensagem persiste em DB (Cassandra ou Dynamo) — não confiamos só em delivery WebSocket. Cliente reconecta e pede mensagens desde lastSeenId.</p><p><strong>Offline</strong>: se user não conectado, push notification (APNs/FCM) e marcar unread. Quando volta, sincroniza.</p><p><strong>Escala</strong>: 100M users, 10% online simultâneos = 10M sockets. 200 gateway instances × 50K conexões. Kafka com partição por gateway pra ordering.</p>', level: 'senior' },
    { q: 'Diferença entre fila e log de eventos (SQS vs Kafka)?', a: '<p><strong>Queue (SQS, RabbitMQ)</strong>: mensagem é consumida e some. 1 produtor, N consumidores cooperam (cada msg vai pra 1 consumidor). Boa pra job processing — task feita, descarta.</p><p><strong>Log de eventos (Kafka, Kinesis)</strong>: log durável append-only. Múltiplos consumidores leem o mesmo log com offset próprio. Replay possível voltando offset. Boa pra event sourcing, CDC, analytics, fanout pra múltiplos sistemas.</p><p><strong>Quando cada um</strong>: job de envio de email = SQS (1 worker pega e processa). Stream de eventos de usuário pra ML + analytics + alerting = Kafka (3 consumers leem o mesmo log).</p>', level: 'pleno' },
    { q: 'Como projetar API rate limiting pra 10K req/s globais?', a: '<p><strong>Algoritmo</strong>: token bucket — bom pra burst (cliente acumula tokens em idle). Sliding window log se precisão é crítica.</p><p><strong>Estado distribuído</strong>: Redis com Lua script atômico (INCR + EXPIRE em uma operação). 1 chave por (user_id, endpoint). Latência <1ms.</p><p><strong>Multi-region</strong>: rate limit local por region (mais simples) ou global via CRDT counter (caro). Pra maioria, local basta — atacante distribui pra cada region, mas custo de scale > ganho.</p><p><strong>Headers</strong>: retorna <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code>. Em 429, retorna <code>Retry-After</code>.</p><p><strong>Tier</strong>: free 100/min, pro 1000/min, enterprise sem limite — gerencia em config dinâmica.</p>', level: 'senior' },
    { q: 'Como migrar monolito pra microservices sem quebrar produção?', a: '<p><strong>Strangler Fig pattern</strong>: novo serviço atrás de proxy. Roteia gradualmente endpoint por endpoint do monolito pro serviço novo. Monolito continua rodando até ser totalmente substituído.</p><p><strong>Database</strong>: mais difícil. Não pode dual-write (race condition). Use CDC (Debezium → Kafka) pra propagar mudanças do monolito pro novo serviço. Quando novo serviço estabiliza, switch source-of-truth.</p><p><strong>Domínio</strong>: começa por bounded context com <strong>baixo acoplamento</strong> e alto valor (auth, notification, billing). Evita extrair core de domínio cedo.</p><p><strong>Anti-pattern</strong>: extrair tudo de uma vez. Microservices premature scaling é a causa #1 de projetos que afundam.</p>', level: 'senior' },
    { q: 'Como você lida com partial failure em sistema distribuído?', a: '<p><strong>Princípios</strong>: <em>"everything fails all the time"</em> (Werner Vogels). Design assume falha:</p><ol><li><strong>Timeout</strong> em toda chamada externa (P99 do callee + buffer).</li><li><strong>Retry com backoff exponencial + jitter</strong> — evita thundering herd em recovery.</li><li><strong>Circuit breaker</strong> — após N falhas, falha rápido sem chamar serviço caído.</li><li><strong>Bulkhead</strong> — pool de threads/conexões separado por dependência. Falha de serviço A não exaure pool de B.</li><li><strong>Graceful degradation</strong> — em falha, retorna versão reduzida (sem recomendações, sem ML score) em vez de 500.</li><li><strong>Idempotência</strong> — sem isso, retry duplica.</li></ol><p><strong>Observability</strong>: tracing distribuído (Jaeger) revela qual serviço degradou na cascata.</p>', level: 'senior' },
    { q: 'Como dimensionar Postgres pra 10K writes/s?', a: '<p>Postgres single instance aguenta com tuning: <code>shared_buffers=25% RAM</code>, <code>effective_cache_size=75% RAM</code>, <code>wal_buffers=16MB</code>, <code>checkpoint_completion_target=0.9</code>, <code>max_connections</code> baixo + PgBouncer.</p><p><strong>Hardware</strong>: NVMe SSD (não EBS gp3 padrão), 32+ vCPU, 128+ GB RAM. <code>db.r6i.8xlarge</code> ou maior na AWS.</p><p><strong>Pool</strong>: PgBouncer em transaction mode. Cada API server abre 5-10 conexões reais; PgBouncer multiplexa.</p><p><strong>Read scale</strong>: 2-4 read replicas. Streaming replication. App roteia READ pra replica, WRITE pra primary.</p><p><strong>Write scale</strong>: se passar 10K writes/s, considera particionamento (Citus, ou tabelas por tenant) ou Vitess (MySQL). Antes disso, esgota tuning + replicas.</p>', level: 'senior' },
    { q: 'Diferenças entre push, pull e long-polling pra notificação web?', a: '<p><strong>Polling tradicional</strong>: cliente faz GET a cada N segundos. Simples, ineficiente (latência média = N/2, banda alta).</p><p><strong>Long-polling</strong>: cliente faz GET, server segura request até ter dado ou timeout (30s). Cliente reconecta. Latência baixa, mais leve. Ainda overhead HTTP.</p><p><strong>WebSocket</strong>: conexão TCP persistente, full-duplex. Latência mínima, eficiente em volume. Custo: gateway statefull, complexidade de scale (sticky session).</p><p><strong>Server-Sent Events (SSE)</strong>: HTTP unidirecional. Server envia eventos, cliente recebe. Mais simples que WebSocket pra pure server-push. Bom pra dashboard, notificação.</p><p><strong>Push notification (mobile)</strong>: APNs/FCM — sistema operacional gerencia conexão, app recebe quando offline também.</p>', level: 'pleno' },
    { q: 'Como pensaria o storage pra 1 bilhão de fotos?', a: '<p><strong>Object storage</strong>: S3 (não DB). Custo ~$0.023/GB/mês Standard.</p><p><strong>Tamanho</strong>: 1B fotos × 200KB médio = 200TB. Custa ~$4.6K/mês em S3 Standard. Lifecycle: depois de 30d, IA ($0.0125), depois 90d, Glacier ($0.004).</p><p><strong>Metadata</strong>: separado em DB (Postgres ou DynamoDB) — <code>photo_id, user_id, s3_key, uploaded_at, size, dimensions, thumbnail_keys</code>.</p><p><strong>Delivery</strong>: CloudFront. PoPs cacheiam. Origem só é tocada em miss.</p><p><strong>Upload</strong>: pre-signed URL — cliente faz upload direto S3, não passa pela API. Reduz banda da API em 99%.</p><p><strong>Thumbnails</strong>: Lambda trigger no PUT em S3, gera 3 tamanhos (small, medium, large), salva em prefix /thumbs.</p><p><strong>Resize</strong>: under demand via CDN edge function — gera thumbnail no primeiro hit, cacheia.</p>', level: 'senior' },
    { q: 'Quais red flags você procura num design de candidato?', a: '<p><strong>1. Pular clarificação</strong> — começa desenhando sem perguntar DAU, requisitos. Mostra que copiou solução pronta.</p><p><strong>2. Citar tecnologia sem motivo</strong> — "uso Kafka" ou "uso microservices" sem justificar. Senior nomeia o problema que a tecnologia resolve.</p><p><strong>3. Não estimar</strong> — desenha caixinhas sem dizer quanto cada uma aguenta. Não sabe se cabe em 1 server ou precisa 100.</p><p><strong>4. Esquecer falha</strong> — single point of failure em LB, DNS, banco. Senior pergunta "e se isso cair?" pra cada componente.</p><p><strong>5. Premature scaling</strong> — desenha 10 microservices pra MVP. Custo operacional explode.</p><p><strong>6. Não citar tradeoff</strong> — toda decisão é tradeoff. Quem só fala vantagem está vendendo, não desenhando.</p><p><strong>7. Ignorar custo</strong> — cluster Kafka multi-region custa $50K/mês. Senior cita ordem de grandeza.</p>', level: 'senior' },
    { q: 'Como projetaria um sistema de autocomplete (search suggestions)?', a: '<p><strong>Requisitos</strong>: latência < 100ms (P99), 100M DAU, 5 buscas/dia/user = 500M queries/dia ≈ 6K QPS.</p><p><strong>Trie vs Inverted Index</strong>: Trie pura não escala — armazena em memória, difícil de distribuir. Na prática: Elasticsearch ou banco de k-gram pré-computado por usuário.</p><p><strong>Arquitetura</strong>:</p><ol><li><strong>Coleta</strong>: toda query log em Kafka. Aggregation job (Spark/Flink) computa top-k queries por prefixo a cada hora.</li><li><strong>Storage</strong>: Redis Hash com chave = prefix, valor = JSON com top-10 sugestões.</li><li><strong>API</strong>: GET /suggestions?q=appl → lookup Redis O(1) → retorna JSON.</li><li><strong>CDN</strong>: respostas são quase estáticas (mudam de hora em hora) — cache no edge com TTL de 5 min.</li></ol><p><strong>Personalização</strong>: mistura sugestões globais com histórico do usuário no momento do request. Pesa 70% global + 30% pessoal.</p><p><strong>Tradeoff</strong>: atualização de 1h de delay é aceitável pra sugestões. Se precisar real-time (queries virais), reduz batch para 5min com lambda architecture.</p>', level: 'senior' },
    { q: 'Como projetaria upload de vídeo pra 100M usuários (tipo YouTube)?', a: '<p><strong>Estimativas</strong>: 0.1% de DAU fazem upload/dia = 100K uploads/dia. Vídeo médio 500MB = 50TB/dia de ingest.</p><p><strong>Pipeline de upload</strong>:</p><ol><li><strong>Pre-signed URL</strong>: cliente pede à API, API gera URL S3 pre-signed. Cliente faz upload direto S3 — API não é o gargalo.</li><li><strong>Multipart upload</strong>: vídeo grande = dividir em chunks de 5-100MB. Retomável em caso de falha.</li><li><strong>S3 Event Notification</strong>: upload completo dispara evento → SQS → Worker de transcoding.</li></ol><p><strong>Transcoding</strong>: converte para múltiplos formatos/resoluções (360p, 720p, 1080p, 4K) em paralelo. AWS Elastic Transcoder ou MediaConvert. Distribui em múltiplas instâncias spot.</p><p><strong>CDN</strong>: vídeo transcoded vai pra S3. CloudFront distribui via HLS/DASH com bitrate adaptativo. PoP local serve cliente — latência mínima.</p><p><strong>Metadata</strong>: Postgres (título, descrição, status, duração). Elasticsearch pra busca full-text. Redis pra views counter (INCR + batch flush pra DB).</p><p><strong>Gotcha</strong>: view counter em Postgres a cada play é suicide a 1M views/h. Use Redis INCR + flush batch periódico.</p>', level: 'senior' },
    { q: 'Diferença entre consistência eventual, read-your-writes e causal?', a: '<p><strong>Eventual</strong>: dado propagado assincronamente — leitores podem ver versão velha por minutos. "Vai convergir eventualmente". Máxima escala, aceita staleness. Ex: DNS, S3, DynamoDB padrão.</p><p><strong>Read-your-writes</strong>: garantia de que usuário vê suas próprias escritas imediatamente. Outros podem não ver. Implementado com sticky session (read do primary) ou token de versão. Ex: usuário cria post, vê próprio post.</p><p><strong>Monotonic reads</strong>: se você leu versão X, nunca vai ler versão mais antiga que X. Evita "post sumiu e voltou". Implementado com session affinity ao mesmo replica.</p><p><strong>Causal</strong>: se você vê "João comentou no post de Maria", você também precisa ver o post de Maria. Preserva relação de causa-efeito. Implementado com vector clocks ou Lamport timestamps. Ex: Google Docs, redes sociais com thread.</p><p><strong>Strong/Linearizability</strong>: toda leitura vê última escrita. Equivale a um único nó. Caro — requer quorum. Ex: Zookeeper, etcd, Spanner.</p><p>Para 90% dos sistemas: eventual geral + read-your-writes no caminho do usuário + strong apenas em transações críticas (pagamento, estoque).</p>', level: 'senior' },
    { q: 'Como lidaria com um hot partition em banco NoSQL?', a: '<p><strong>Problema</strong>: hot partition acontece quando um prefixo/chave de partição recebe volume desproporcional. Ex: partition key = user_id em sistema onde Justin Bieber tem 200M followers — toda escrita de fanout vai pra mesma partição.</p><p><strong>Detecção</strong>: CloudWatch/Datadog mostra throughput desproporcional por partição. Alarm em quando 1 partição > 3× a média.</p><p><strong>Soluções</strong>:</p><ul><li><strong>Prefix/salt</strong>: adiciona sufixo aleatório (0-100) à partition key — <code>user_123_42</code>. Queries precisam fazer N reads e fazer merge. Bom quando escrita é o problema.</li><li><strong>Write shielding</strong>: celebridade tem fanout-on-read em vez de fanout-on-write. Só usuários normais têm write fan-out.</li><li><strong>Caching agressivo</strong>: dado hot vai pra Redis — partição NoSQL raramente é tocada.</li><li><strong>Adaptive capacity</strong> (DynamoDB): auto-distribui capacidade entre partições desbalanceadas. Resolve temporariamente.</li><li><strong>Composite sort key</strong>: troca partition key composta que distribui melhor — <code>category#region</code> em vez de só <code>category</code>.</li></ul>', level: 'senior' },
  ],
  exercises: [
    { level: 'intermediario', title: 'Encurtador de URL', description: 'Desenhe sistema completo. 100M URLs/dia, 100:1 read/write, 5 anos. Defina API, schema, encoder, cache, particionamento.', concepts: ['estimativa', 'encoder', 'cache', 'sharding'], hint: 'Counter centralizado vira gargalo — pesquise range allocation.' },
    { level: 'intermediario', title: 'Rate limiter distribuído', description: 'Implemente rate limiter em Redis (token bucket) que sustenta 100K req/s globais. Multi-tenant (limit por API key).', concepts: ['Redis', 'Lua', 'token bucket', 'rate limit'], hint: 'Lua script garante atomicidade. Considera burst com bucket size.' },
    { level: 'senior', title: 'Feed do Twitter (200M DAU)', description: 'Desenhe sistema de feed pra 200M DAU com hybrid push/pull pra hot users. Defina cache, fanout, hot key handling.', concepts: ['feed', 'fanout', 'cache', 'hot key', 'Kafka'], hint: 'Celebrity problem é a chave. Hybrid evita hot partition.' },
    { level: 'senior', title: 'Notificações Slack', description: 'Sistema de notificação real-time pra 100M users com 10M concurrent. WebSocket gateway, presence service, offline delivery.', concepts: ['WebSocket', 'sharding', 'presence', 'push notification'], hint: 'Gateway é stateful — consistent hash por user_id.' },
    { level: 'senior', title: 'Migração monolito → microservices', description: 'Plano de extração de bounded context (auth) de monolito sem downtime. Inclua dual-read transitório, CDC, e rollback strategy.', concepts: ['strangler fig', 'CDC', 'Debezium', 'Kafka'], hint: 'Database migration é o difícil. CDC pra propagar mudanças.' },
  ],
  resources: [
    { title: 'Designing Data-Intensive Applications (Kleppmann)', url: 'https://dataintensive.net/', kind: 'livro' },
    { title: 'System Design Primer (donnemartin)', url: 'https://github.com/donnemartin/system-design-primer', kind: 'docs' },
    { title: 'ByteByteGo (Alex Xu)', url: 'https://bytebytego.com/', kind: 'curso' },
    { title: 'Hussein Nasser YouTube', url: 'https://www.youtube.com/@hnasr', kind: 'video' },
    { title: 'High Scalability Blog', url: 'http://highscalability.com/', kind: 'artigo' },
    { title: 'AWS Architecture Center', url: 'https://aws.amazon.com/architecture/', kind: 'docs' },
    { title: 'The Twelve-Factor App', url: 'https://12factor.net/', kind: 'docs' },
    { title: 'Latency Numbers Every Programmer Should Know', url: 'https://gist.github.com/jboner/2841832', kind: 'artigo' },
    { title: 'Martin Fowler — Patterns of Distributed Systems', url: 'https://martinfowler.com/articles/patterns-of-distributed-systems/', kind: 'artigo' },
  ],
  videos: [
    { title: 'System Design Interview – Step By Step Guide', channel: 'ByteByteGo', url: '', topic: 'Framework completo de entrevista em 45 minutos', note: 'Referência principal — assista antes de qualquer mock interview' },
    { title: 'Designing a URL Shortener (bit.ly, TinyURL)', channel: 'NeetCode', url: '', topic: 'URL shortener do zero ao tradeoff', note: 'Caso canônico para estudar encoder, cache e sharding' },
    { title: 'I Solved 100 System Design Questions', channel: 'Hussein Nasser', url: '', topic: 'Deep dives em casos reais', note: 'Hussein explica mecanismos de transport e protocolo com detalhe raro' },
    { title: 'System Design: Design a News Feed System', channel: 'ByteByteGo', url: '', topic: 'Feed Twitter/Instagram — fanout on write vs read', note: 'O caso mais cobrado em entrevistas sênior — cele problem incluído' },
    { title: 'CAP Theorem Explained', channel: 'Arpit Bhayani', url: '', topic: 'CAP e PACELC com exemplos práticos', note: 'Arpit é rigoroso e vai fundo — aprenda antes de falar de consistência em entrevista' },
    { title: 'Consistent Hashing | Algorithms You Should Know', channel: 'ByteByteGo', url: '', topic: 'Consistent hashing e virtual nodes', note: 'Essential para explicar sharding em entrevista' },
  ],
  codeExamples: [
    {
      title: 'Back-of-envelope: estimativa de QPS, storage e banda',
      description: 'Template de estimativa que você deve conseguir fazer em 5 minutos numa entrevista',
      language: 'typescript',
      code: `// ---- TEMPLATE BACK-OF-ENVELOPE ----
// Caso: sistema de mensagens tipo WhatsApp

const DAU = 100_000_000            // 100M usuários ativos por dia
const msgs_per_user_per_day = 40   // cada usuário envia ~40 mensagens
const msg_size_bytes = 100         // texto médio 100 bytes

// QPS médio de escrita
const writes_per_day = DAU * msgs_per_user_per_day     // 4B mensagens/dia
const writes_per_sec = writes_per_day / 86_400          // ~46K writes/s
const peak_writes    = writes_per_sec * 3               // ~138K writes/s no pico

// QPS de leitura (mensagens são enviadas 1:1 ou grupo, ratio menor)
const reads_per_sec  = writes_per_sec * 2               // ~92K reads/s

// Storage por dia e por ano
const storage_per_day = writes_per_day * msg_size_bytes // 400GB/dia
const storage_per_year = storage_per_day * 365          // ~146TB/ano

// Bandwidth de saída (cada mensagem vai a avg 2 destinatários)
const avg_recipients = 2
const outbound_bps = writes_per_sec * avg_recipients * msg_size_bytes * 8 // ~73 Mbps médio

console.table({
'Writes/s (médio)': writes_per_sec.toLocaleString(),
'Writes/s (pico 3×)': peak_writes.toLocaleString(),
'Storage/dia': \`\${(storage_per_day / 1e9).toFixed(0)} GB\`,
'Storage/ano': \`\${(storage_per_year / 1e12).toFixed(0)} TB\`,
'Outbound (médio)': \`\${(outbound_bps / 1e6).toFixed(0)} Mbps\`,
})

// Conclusão: 138K writes/s → 1 Postgres não aguenta (max ~10-20K writes/s)
// → precisa de sharding ou Cassandra/DynamoDB wide-column`,
    },
    {
      title: 'Cache-aside + single-flight contra cache stampede',
      description: 'Padrão de cache mais comum em produção com proteção contra thundering herd',
      language: 'typescript',
      code: `import { Redis } from 'ioredis'

const redis = new Redis()

// Mapa de locks em-flight (single-flight pattern)
const inflight = new Map<string, Promise<unknown>>()

async function getWithCache<T>(
key: string,
ttlSeconds: number,
fetcher: () => Promise<T>,
): Promise<T> {
// 1. Cache hit — caso feliz
const cached = await redis.get(key)
if (cached) return JSON.parse(cached) as T

// 2. Single-flight: se já tem uma busca em andamento pra mesma key,
//    todos os outros callers esperam ela terminar (evita stampede)
if (inflight.has(key)) {
  return inflight.get(key) as Promise<T>
}

// 3. Primeiro miss: faz a busca real
const promise = fetcher()
  .then(async (value) => {
    // Salva no cache com TTL + jitter aleatório (evita expiração simultânea)
    const jitter = Math.floor(Math.random() * 30)
    await redis.setex(key, ttlSeconds + jitter, JSON.stringify(value))
    return value
  })
  .finally(() => {
    inflight.delete(key)
  })

inflight.set(key, promise)
return promise
}

// Uso:
const user = await getWithCache(
\`user:\${userId}\`,
300, // 5 minutos
() => db.user.findUnique({ where: { id: userId } }),
)`,
    },
    {
      title: 'Rate limiting — token bucket em Redis com Lua atômico',
      description: 'Token bucket thread-safe em Redis. Resiste a condições de corrida porque o script Lua roda atomicamente',
      language: 'typescript',
      code: `import { Redis } from 'ioredis'

const redis = new Redis()

// Script Lua executa atomicamente — sem race condition entre GET e SET
const TOKEN_BUCKET_SCRIPT = \`
local key        = KEYS[1]
local capacity   = tonumber(ARGV[1])   -- capacidade máxima do bucket
local refill_rate = tonumber(ARGV[2])  -- tokens por segundo
local now        = tonumber(ARGV[3])   -- timestamp atual em ms
local cost       = tonumber(ARGV[4])   -- tokens que a requisição consome

local bucket = redis.call("HMGET", key, "tokens", "last_refill")
local tokens      = tonumber(bucket[1]) or capacity
local last_refill = tonumber(bucket[2]) or now

-- Recarrega tokens baseado no tempo passado
local elapsed = (now - last_refill) / 1000
tokens = math.min(capacity, tokens + elapsed * refill_rate)

if tokens >= cost then
tokens = tokens - cost
redis.call("HMSET", key, "tokens", tokens, "last_refill", now)
redis.call("EXPIRE", key, 3600)
return 1   -- permitido
else
redis.call("HMSET", key, "tokens", tokens, "last_refill", now)
redis.call("EXPIRE", key, 3600)
return 0   -- bloqueado
end
\`

interface RateLimitOptions {
capacity: number     // tokens máximos
refillRate: number   // tokens/segundo
cost?: number        // tokens por request (default 1)
}

async function checkRateLimit(
identifier: string,  // ex: 'user:123' ou 'ip:1.2.3.4'
opts: RateLimitOptions,
): Promise<{ allowed: boolean; retryAfterMs?: number }> {
const key = \`ratelimit:\${identifier}\`
const now = Date.now()
const cost = opts.cost ?? 1

const result = await redis.eval(
  TOKEN_BUCKET_SCRIPT,
  1,
  key,
  opts.capacity,
  opts.refillRate,
  now,
  cost,
) as number

if (result === 1) return { allowed: true }

// Calcula quanto tempo falta para recarregar 1 token
const msPerToken = (1 / opts.refillRate) * 1000
return { allowed: false, retryAfterMs: Math.ceil(msPerToken) }
}

// Middleware Express
async function rateLimitMiddleware(req: any, res: any, next: any) {
const { allowed, retryAfterMs } = await checkRateLimit(
  \`user:\${req.user.id}\`,
  { capacity: 60, refillRate: 1 }, // 60 req burst, 1 req/s constante
)

if (!allowed) {
  return res.status(429).json({
    error: 'Too Many Requests',
    retryAfter: retryAfterMs,
  })
}
next()
}`,
    },
  ],
  mindmap: {
    title: 'System Design — Mapa Mental Completo',
    html: `<div style="background:#0f172a;padding:32px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;min-height:520px;">
<style>
  .sdmm-center{text-align:center;margin-bottom:28px}
  .sdmm-hub{display:inline-block;background:linear-gradient(135deg,#6366F1,#818cf8);color:#fff;font-weight:800;font-size:15px;padding:14px 28px;border-radius:12px;letter-spacing:.5px;box-shadow:0 4px 24px rgba(99,102,241,.4)}
  .sdmm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
  .sdmm-branch{background:rgba(99,102,241,.07);border:1px solid rgba(99,102,241,.22);border-radius:10px;padding:14px}
  .sdmm-branch-title{font-weight:700;font-size:12px;color:#a5b4fc;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(99,102,241,.18);text-transform:uppercase;letter-spacing:.6px}
  .sdmm-leaf{font-size:11px;color:#94a3b8;line-height:1.8;padding:2px 0}
  .sdmm-leaf::before{content:'› ';color:#6366F1;font-weight:700}
  .sdmm-leaf b{color:#c7d2fe}
  .sdmm-connect{text-align:center;color:#6366F1;font-size:22px;margin-bottom:10px}
</style>
<div class="sdmm-center">
  <div class="sdmm-hub">SYSTEM DESIGN</div>
  <div style="color:#475569;font-size:11px;margin-top:8px">Hover nos ramos para explorar cada área</div>
</div>
<div class="sdmm-connect">↓</div>
<div class="sdmm-grid">
  <div class="sdmm-branch">
    <div class="sdmm-branch-title">Framework de Entrevista</div>
    <div class="sdmm-leaf"><b>1 Clarify</b> — DAU, SLA, região</div>
    <div class="sdmm-leaf"><b>2 Estimate</b> — QPS, storage, banda</div>
    <div class="sdmm-leaf"><b>3 API</b> — endpoints, paginação</div>
    <div class="sdmm-leaf"><b>4 Data model</b> — schema, relações</div>
    <div class="sdmm-leaf"><b>5 High-level</b> — caixas e setas</div>
    <div class="sdmm-leaf"><b>6 Deep dive</b> — gargalo escolhido</div>
    <div class="sdmm-leaf"><b>7 Tradeoffs</b> — nomear o custo</div>
  </div>
  <div class="sdmm-branch">
    <div class="sdmm-branch-title">Storage — Quando Usar</div>
    <div class="sdmm-leaf"><b>SQL</b> — ACID, JOIN, schema estável</div>
    <div class="sdmm-leaf"><b>DynamoDB</b> — K-V massivo, padrão simples</div>
    <div class="sdmm-leaf"><b>Redis</b> — cache, session, leaderboard</div>
    <div class="sdmm-leaf"><b>Cassandra</b> — time-series, write-heavy</div>
    <div class="sdmm-leaf"><b>Elasticsearch</b> — full-text search</div>
    <div class="sdmm-leaf"><b>S3</b> — arquivos, blobs, backups</div>
    <div class="sdmm-leaf"><b>InfluxDB</b> — métricas time-series</div>
  </div>
  <div class="sdmm-branch">
    <div class="sdmm-branch-title">Escalabilidade</div>
    <div class="sdmm-leaf"><b>Cache-aside</b> — padrão universal</div>
    <div class="sdmm-leaf"><b>Consistent hash</b> — sharding</div>
    <div class="sdmm-leaf"><b>Read replicas</b> — escala leitura</div>
    <div class="sdmm-leaf"><b>CQRS</b> — separar leitura/escrita</div>
    <div class="sdmm-leaf"><b>CDN</b> — edge estático global</div>
    <div class="sdmm-leaf"><b>Fanout hybrid</b> — push+pull feed</div>
  </div>
  <div class="sdmm-branch">
    <div class="sdmm-branch-title">Números Essenciais</div>
    <div class="sdmm-leaf"><b>RAM</b> — 100 ns acesso</div>
    <div class="sdmm-leaf"><b>SSD</b> — 100 µs, 100K IOPS</div>
    <div class="sdmm-leaf"><b>Rede DC</b> — 500 µs</div>
    <div class="sdmm-leaf"><b>1 server</b> — 10-50K req/s</div>
    <div class="sdmm-leaf"><b>QPS</b> = DAU × ações ÷ 86.400</div>
    <div class="sdmm-leaf"><b>Pico</b> = média × 3</div>
  </div>
  <div class="sdmm-branch">
    <div class="sdmm-branch-title">Resiliência</div>
    <div class="sdmm-leaf"><b>Circuit breaker</b> — evita cascata</div>
    <div class="sdmm-leaf"><b>Timeout + retry</b> — backoff + jitter</div>
    <div class="sdmm-leaf"><b>Bulkhead</b> — pool separado</div>
    <div class="sdmm-leaf"><b>Idempotência</b> — retry seguro</div>
    <div class="sdmm-leaf"><b>Multi-AZ</b> — antes de multi-region</div>
    <div class="sdmm-leaf"><b>Graceful degrade</b> — partial > 500</div>
  </div>
  <div class="sdmm-branch">
    <div class="sdmm-branch-title">Mensageria</div>
    <div class="sdmm-leaf"><b>SQS</b> — fila simples, at-least-once</div>
    <div class="sdmm-leaf"><b>Kafka</b> — log durável, replay</div>
    <div class="sdmm-leaf"><b>SNS</b> — fanout pub/sub</div>
    <div class="sdmm-leaf"><b>WebSocket</b> — real-time bidirecional</div>
    <div class="sdmm-leaf"><b>SSE</b> — push server unidirecional</div>
  </div>
</div>
</div>`,
    caption: 'Use como revisão rápida antes de entrevista: 7 passos (canto superior esquerdo), números (canto inferior esquerdo), storage decision (centro-topo).',
  },
}

export default systemDesign
