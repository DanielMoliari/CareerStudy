import type { SkillContentMap } from '@/types'

const data: SkillContentMap = {

  'system-design': {
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
  },

  'solid': {
    tagline: 'Cinco princípios de OOP que mantêm código legível, testável e modificável ao longo dos anos.',
    why: 'SOLID é o básico de qualquer entrevista sênior. O entrevistador não quer que você recite as cinco siglas — quer ver se você sabe identificar uma violação no código apresentado, propor refatoração concreta e nomear o tradeoff entre aplicar o princípio e cair em overengineering. Refatoração, code review e discussão de design giram em torno desses cinco princípios. Quem não os internalizou escreve classe-Deus, switch espalhado e impossibilita teste unitário.',
    prerequisite: 'Programação orientada a objetos sólida (classes, herança, polimorfismo, encapsulamento), TypeScript ou linguagem OO equivalente, conforto com interfaces e tipos abstratos. Ajuda muito ter sentido a dor de manter um código que viola SOLID — só assim os princípios deixam de ser academicismo.',
    summary: 'SOLID são cinco princípios do Robert Martin (Uncle Bob) que guiam design OO de sistemas que evoluem bem: Single Responsibility (cada classe tem um motivo pra mudar), Open/Closed (estensível sem modificação), Liskov Substitution (subclasse honra contrato da base), Interface Segregation (clientes não dependem do que não usam) e Dependency Inversion (depender de abstração, não de detalhe concreto). Aplicados juntos, produzem coesão alta e acoplamento baixo — código onde mudança é local, teste é isolado e troca de implementação é cirúrgica.\n\nA armadilha é aplicar cego: criar interface pra cada classe, fragmentar em 50 microclasses, instanciar tudo via factory de factory. Isso não é SOLID — é teatro arquitetural. SOLID brilha quando há dor real de mudança ou variação prevista (múltiplas implementações de gateway de pagamento, vários formatos de export, regra de imposto que muda por país). Em CRUD trivial, SRP básico basta.\n\nNo mundo real, SOLID é a base de Clean Architecture, DDD, design patterns clássicos e injeção de dependência em frameworks como NestJS e Spring. Sênior que não consegue identificar e refatorar uma violação SOLID em entrevista perde pontos rápido. Sênior que aplica todos os princípios em código simples também — porque mostra falta de discernimento.',
    howToStudy: '<strong>Tem 30 minutos antes da entrevista?</strong> Memorize as cinco siglas (S-O-L-I-D), uma frase de definição cada, e treine identificar a violação no diagrama 1 (God class). Foque em entrevista nível pleno e no cheatsheet.<br><br><strong>Tem um fim de semana?</strong> Leia os cinco capítulos correspondentes do <em>Agile Software Development: Principles, Patterns, and Practices</em> (Uncle Bob, 2002). Refatore um pedaço real do seu código atual aplicando um princípio por vez. Sinta a diferença antes/depois.<br><br><strong>Tem uma semana?</strong> Faça o cookbook completo desta página (refatoração de classe que viola tudo). Estude design patterns clássicos do Gang of Four com lente SOLID — Strategy é OCP, Adapter é DIP, Decorator é OCP+SRP. Treine code review de PRs do seu time identificando violações.<br><br><strong>Modelo mental central:</strong> SOLID é instrumento pra gerar coesão alta e acoplamento baixo. Se aplicar um princípio não está reduzindo acoplamento ou aumentando coesão, você está usando errado. Princípio é meio, não fim.',
    diagrams: [
      {
        title: 'SRP — God Class vs separação de responsabilidades',
        html: `<div style="background:#0f172a;padding:32px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .srp-grid{display:grid;grid-template-columns:1fr 40px 1fr;gap:14px;align-items:start}
    .srp-col{background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.18);border-radius:10px;padding:18px}
    .srp-col-bad{border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.05)}
    .srp-col-good{border-color:rgba(74,222,128,.35);background:rgba(74,222,128,.05)}
    .srp-title{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.08)}
    .srp-bad .srp-title{color:#f87171}
    .srp-good .srp-title{color:#4ade80}
    .srp-class{background:#1e293b;border-radius:8px;padding:12px 14px;margin-bottom:8px;font-family:'JetBrains Mono',monospace;font-size:11.5px;line-height:1.5;border-left:3px solid #6366F1}
    .srp-class-bad{border-left-color:#ef4444}
    .srp-class-good{border-left-color:#4ade80}
    .srp-class-name{color:#a5b4fc;font-weight:700;font-size:12px;margin-bottom:6px}
    .srp-bad .srp-class-name{color:#fca5a5}
    .srp-good .srp-class-name{color:#86efac}
    .srp-resp{color:#cbd5e1;font-size:10.5px;padding:2px 0;display:flex;align-items:flex-start;gap:6px}
    .srp-resp::before{content:'•';color:#6366F1;font-weight:700}
    .srp-bad .srp-resp::before{color:#ef4444}
    .srp-good .srp-resp::before{color:#4ade80}
    .srp-arrow{display:flex;align-items:center;justify-content:center;font-size:24px;color:#6366F1;font-weight:700;padding-top:60px}
    .srp-stamp{display:inline-block;padding:3px 8px;border-radius:4px;font-size:10px;font-family:'JetBrains Mono',monospace;margin-bottom:10px}
    .srp-bad .srp-stamp{background:rgba(239,68,68,.15);color:#fca5a5}
    .srp-good .srp-stamp{background:rgba(74,222,128,.15);color:#86efac}
    .srp-foot{margin-top:14px;padding:10px 12px;background:rgba(0,0,0,.25);border-radius:6px;font-size:10.5px;color:#94a3b8;line-height:1.6}
    .srp-foot b{color:#a5b4fc}
  </style>
  <div style="text-align:center;margin-bottom:22px">
    <div style="font-size:16px;font-weight:700;color:#a5b4fc;letter-spacing:.5px">SRP — UM MOTIVO PRA MUDAR</div>
    <div style="font-size:12px;color:#94a3b8;margin-top:4px">Cada classe deve ter uma única razão pra ser modificada</div>
  </div>
  <div class="srp-grid">
    <div class="srp-col srp-col-bad srp-bad">
      <div class="srp-stamp">VIOLAÇÃO — 5 RESPONSABILIDADES</div>
      <div class="srp-title">ANTES — God Class</div>
      <div class="srp-class srp-class-bad">
        <div class="srp-class-name">class OrderService</div>
        <div class="srp-resp">validar dados de pedido</div>
        <div class="srp-resp">calcular frete via API dos correios</div>
        <div class="srp-resp">aplicar regra de cupom e desconto</div>
        <div class="srp-resp">persistir no Postgres via SQL puro</div>
        <div class="srp-resp">enviar email de confirmação SMTP</div>
        <div class="srp-resp">gerar PDF da nota fiscal</div>
      </div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#cbd5e1;background:rgba(0,0,0,.3);padding:10px;border-radius:6px;margin-top:10px;line-height:1.7">
        <span style="color:#94a3b8">// 600 linhas, 12 deps, intoque-me</span><br>
        <span style="color:#a78bfa">class</span> <span style="color:#fca5a5">OrderService</span> {<br>
        &nbsp;&nbsp;<span style="color:#7dd3fc">async</span> <span style="color:#fbbf24">place</span>(o) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#94a3b8">// validate, freight, discount,</span><br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#94a3b8">// SQL, SMTP, PDF... tudo aqui</span><br>
        &nbsp;&nbsp;}<br>
        }
      </div>
      <div class="srp-foot">
        <b>Sintomas:</b> teste exige mock de 8 deps; mudança em PDF afeta cálculo de frete; merge conflict semanal; commit mensagem virou "stuff".
      </div>
    </div>
    <div class="srp-arrow">→</div>
    <div class="srp-col srp-col-good srp-good">
      <div class="srp-stamp">REFATORAÇÃO — 1 RESP/CLASSE</div>
      <div class="srp-title">DEPOIS — Separadas</div>
      <div class="srp-class srp-class-good">
        <div class="srp-class-name">OrderValidator</div>
        <div class="srp-resp">validar campos e regras</div>
      </div>
      <div class="srp-class srp-class-good">
        <div class="srp-class-name">ShippingCalculator</div>
        <div class="srp-resp">calcular frete (correios)</div>
      </div>
      <div class="srp-class srp-class-good">
        <div class="srp-class-name">DiscountPolicy</div>
        <div class="srp-resp">aplicar cupom/desconto</div>
      </div>
      <div class="srp-class srp-class-good">
        <div class="srp-class-name">OrderRepository</div>
        <div class="srp-resp">persistir/recuperar</div>
      </div>
      <div class="srp-class srp-class-good">
        <div class="srp-class-name">OrderNotifier</div>
        <div class="srp-resp">enviar email/push</div>
      </div>
      <div class="srp-class srp-class-good">
        <div class="srp-class-name">PlaceOrderUseCase</div>
        <div class="srp-resp">orquestrar as 5 acima</div>
      </div>
      <div class="srp-foot">
        <b>Resultado:</b> teste isolado por classe; mudança em PDF não toca em frete; commit focado; novo dev entende cada arquivo em 5 min.
      </div>
    </div>
  </div>
  <div style="margin-top:22px;padding:14px 18px;background:linear-gradient(90deg,rgba(99,102,241,.18),rgba(99,102,241,.05));border-radius:8px;border-left:3px solid #6366F1">
    <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#a5b4fc;margin-bottom:6px">REGRA PRÁTICA</div>
    <div style="font-size:12px;color:#cbd5e1;line-height:1.7">Pergunte: <em>"quem é o ator que pediria essa mudança?"</em> Se a resposta inclui dois atores diferentes (financeiro pediu cálculo, marketing pediu email), são duas responsabilidades. Atores diferentes = SRP exige separação.</div>
  </div>
</div>`,
        caption: 'SRP não é "uma classe faz uma coisa pequena" — é "uma classe muda por um motivo só". Pergunte sempre quem (qual ator de negócio) pediria a mudança.',
      },
      {
        title: 'OCP + LSP — Strategy correto vs herança que quebra contrato',
        html: `<div style="background:#0f172a;padding:32px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .ol-section{margin-bottom:26px}
    .ol-banner{padding:10px 14px;border-radius:8px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1px;margin-bottom:14px;text-transform:uppercase}
    .ol-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .ol-card{background:rgba(99,102,241,.05);border:1px solid rgba(99,102,241,.2);border-radius:10px;padding:14px}
    .ol-bad{border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.05)}
    .ol-good{border-color:rgba(74,222,128,.35);background:rgba(74,222,128,.05)}
    .ol-title{font-size:11px;color:#a5b4fc;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px}
    .ol-bad .ol-title{color:#fca5a5}
    .ol-good .ol-title{color:#86efac}
    .ol-code{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.7;color:#cbd5e1;background:rgba(0,0,0,.3);padding:10px 12px;border-radius:6px;white-space:pre}
    .ol-note{margin-top:10px;padding:8px 10px;background:rgba(0,0,0,.2);border-radius:5px;font-size:10.5px;color:#94a3b8;line-height:1.6}
  </style>

  <div class="ol-section">
    <div style="text-align:center;margin-bottom:18px">
      <div style="font-size:16px;font-weight:700;color:#a5b4fc">OCP — Aberto pra extensão, fechado pra modificação</div>
    </div>
    <div class="ol-grid">
      <div class="ol-card ol-bad">
        <div class="ol-title">VIOLAÇÃO — switch que cresce</div>
<pre class="ol-code">class PaymentProcessor {
  process(p: Payment) {
    if (p.kind === 'pix') {
      // 30 linhas pix
    } else if (p.kind === 'card') {
      // 40 linhas card
    } else if (p.kind === 'boleto') {
      // 25 linhas boleto
    }
    // novo método? edita aqui.
  }
}</pre>
        <div class="ol-note"><b>Problema:</b> cada novo meio de pagamento exige editar a classe (e re-testar tudo). Risco de regressão alto. Diff fica enorme.</div>
      </div>
      <div class="ol-card ol-good">
        <div class="ol-title">CORREÇÃO — Strategy</div>
<pre class="ol-code">interface PaymentMethod {
  charge(amount: number): Promise&lt;Tx&gt;
}

class PixMethod implements PaymentMethod { ... }
class CardMethod implements PaymentMethod { ... }
class BoletoMethod implements PaymentMethod { ... }

class PaymentProcessor {
  constructor(private method: PaymentMethod) {}
  process(p: Payment) {
    return this.method.charge(p.amount)
  }
}
// novo método? cria classe nova. NÃO toca aqui.</pre>
        <div class="ol-note"><b>Ganho:</b> adicionar Apple Pay = nova classe. Zero risco em código existente. Cada strategy testa isolado.</div>
      </div>
    </div>
  </div>

  <div class="ol-section">
    <div style="text-align:center;margin-bottom:18px">
      <div style="font-size:16px;font-weight:700;color:#a5b4fc">LSP — Subclasse honra contrato da base</div>
    </div>
    <div class="ol-grid">
      <div class="ol-card ol-bad">
        <div class="ol-title">VIOLAÇÃO — Penguin extends Bird</div>
<pre class="ol-code">class Bird {
  fly(): void { /* voa */ }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error('penguin não voa!')
  }
}

function migrate(birds: Bird[]) {
  birds.forEach(b =&gt; b.fly())  // boom em Penguin
}</pre>
        <div class="ol-note"><b>Problema:</b> substituir Bird por Penguin quebra. Cliente espera fly() funcionar. LSP violado: subclasse mais restritiva que a base.</div>
      </div>
      <div class="ol-card ol-good">
        <div class="ol-title">CORREÇÃO — segregar capacidade</div>
<pre class="ol-code">interface Bird { eat(): void }
interface FlyingBird extends Bird {
  fly(): void
}

class Sparrow implements FlyingBird {
  eat() {} fly() {}
}
class Penguin implements Bird {
  eat() {}  // só não voa, sem mentir
}

function migrate(birds: FlyingBird[]) { ... }
// agora type-safe: Penguin nem entra no parâmetro</pre>
        <div class="ol-note"><b>Ganho:</b> compilador rejeita uso errado. Hierarquia honesta: Bird não promete o que nem todo pássaro entrega.</div>
      </div>
    </div>
  </div>

  <div style="padding:14px 18px;background:linear-gradient(90deg,rgba(99,102,241,.15),rgba(99,102,241,.04));border-radius:8px;border-left:3px solid #6366F1">
    <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#a5b4fc;margin-bottom:6px">SINAIS DE VIOLAÇÃO LSP</div>
    <div style="font-size:11.5px;color:#cbd5e1;line-height:1.7">
      • Subclasse joga <code style="color:#fca5a5">NotImplementedException</code> em método herdado<br>
      • Subclasse aceita argumentos mais restritivos que a base (Java: throws checked exception nova)<br>
      • Subclasse retorna tipo mais amplo que a base prometeu<br>
      • Subclasse muda invariante (Square extends Rectangle: setWidth muda height — quebra invariante de Rectangle)
    </div>
  </div>
</div>`,
        caption: 'OCP costuma ser implementado via Strategy (interface + implementações). LSP é o teste se a herança escolhida foi honesta — se subclasse precisa mentir no contrato, prefira composição.',
      },
      {
        title: 'ISP + DIP — Interface segregada e injeção de abstração',
        html: `<div style="background:#0f172a;padding:32px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .id-section{margin-bottom:26px}
    .id-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .id-card{border-radius:10px;padding:14px}
    .id-bad{border:1px solid rgba(239,68,68,.35);background:rgba(239,68,68,.05)}
    .id-good{border:1px solid rgba(74,222,128,.35);background:rgba(74,222,128,.05)}
    .id-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px}
    .id-bad .id-title{color:#fca5a5}
    .id-good .id-title{color:#86efac}
    .id-code{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.65;color:#cbd5e1;background:rgba(0,0,0,.3);padding:10px 12px;border-radius:6px;white-space:pre}
    .id-couple{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:10px;color:#94a3b8}
    .id-bar{flex:1;height:6px;background:rgba(99,102,241,.15);border-radius:3px;position:relative;overflow:hidden}
    .id-bar-fill{position:absolute;left:0;top:0;height:100%;border-radius:3px}
  </style>

  <div class="id-section">
    <div style="text-align:center;margin-bottom:14px">
      <div style="font-size:16px;font-weight:700;color:#a5b4fc">ISP — Cliente não depende do que não usa</div>
    </div>
    <div class="id-grid">
      <div class="id-card id-bad">
        <div class="id-title">FAT INTERFACE — 12 métodos</div>
<pre class="id-code">interface IUserRepo {
  findById(id): User
  findAll(): User[]
  save(u): void
  delete(id): void
  search(q): User[]
  countByRole(r): number
  exportCSV(): string
  importCSV(csv): void
  generateReport(): PDF
  syncToCRM(): void
  invalidateCache(): void
  rebuildIndex(): void
}

class LoginService {
  constructor(private repo: IUserRepo) {}
  // só usa findById e save
  // mas depende dos 12
}</pre>
        <div class="id-couple">
          <span>acoplamento</span>
          <div class="id-bar"><div class="id-bar-fill" style="width:95%;background:#ef4444"></div></div>
          <span style="color:#fca5a5">95%</span>
        </div>
      </div>
      <div class="id-card id-good">
        <div class="id-title">INTERFACES SEGREGADAS</div>
<pre class="id-code">interface IUserReader {
  findById(id): User
  findAll(): User[]
}
interface IUserWriter {
  save(u): void
  delete(id): void
}
interface IUserSearch { search(q): User[] }
interface IUserExport { exportCSV(): string }
interface IUserSync { syncToCRM(): void }

// classe pode implementar várias:
class UserRepo implements
  IUserReader, IUserWriter { ... }

class LoginService {
  constructor(
    private read: IUserReader,
    private write: IUserWriter,
  ) {}
  // depende exatamente do que usa
}</pre>
        <div class="id-couple">
          <span>acoplamento</span>
          <div class="id-bar"><div class="id-bar-fill" style="width:25%;background:#4ade80"></div></div>
          <span style="color:#86efac">25%</span>
        </div>
      </div>
    </div>
  </div>

  <div class="id-section">
    <div style="text-align:center;margin-bottom:14px">
      <div style="font-size:16px;font-weight:700;color:#a5b4fc">DIP — Dependa de abstração, não de detalhe</div>
    </div>
    <div class="id-grid">
      <div class="id-card id-bad">
        <div class="id-title">VIOLAÇÃO — new concreto no construtor</div>
<pre class="id-code">import { PostgresClient } from 'pg'
import { SmtpMailer } from './mail'

class OrderService {
  private db = new PostgresClient(...)
  private mail = new SmtpMailer(...)

  place(o: Order) {
    this.db.query('INSERT...')
    this.mail.send(...)
  }
}
// teste? sobe Postgres + SMTP.
// trocar pra Mongo? reescreve.</pre>
        <div class="id-note" style="margin-top:10px;padding:8px 10px;background:rgba(0,0,0,.2);border-radius:5px;font-size:10.5px;color:#94a3b8;line-height:1.6">
          <b>Acoplamento:</b> alto-nível (regra de pedido) depende de baixo-nível (driver Postgres, SMTP). Mudança em qualquer driver afeta a regra.
        </div>
      </div>
      <div class="id-card id-good">
        <div class="id-title">CORREÇÃO — interface + injeção</div>
<pre class="id-code">interface IOrderRepo {
  save(o: Order): Promise&lt;void&gt;
}
interface IMailer {
  send(to: string, body: string): Promise&lt;void&gt;
}

class OrderService {
  constructor(
    private repo: IOrderRepo,
    private mail: IMailer,
  ) {}

  place(o: Order) {
    this.repo.save(o)
    this.mail.send(o.email, '...')
  }
}
// teste: passa fakes em ms.
// trocar driver? só na composição.</pre>
        <div class="id-note" style="margin-top:10px;padding:8px 10px;background:rgba(0,0,0,.2);border-radius:5px;font-size:10.5px;color:#94a3b8;line-height:1.6">
          <b>Resultado:</b> alto e baixo dependem ambos da abstração (interface). Inversão concluída. NestJS, Spring e Angular fazem isso por design.
        </div>
      </div>
    </div>
  </div>

  <div style="padding:14px 18px;background:linear-gradient(90deg,rgba(99,102,241,.15),rgba(99,102,241,.04));border-radius:8px;border-left:3px solid #6366F1">
    <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#a5b4fc;margin-bottom:6px">DIP × DI</div>
    <div style="font-size:11.5px;color:#cbd5e1;line-height:1.7">
      <b>DIP</b> é o princípio (decisão de design). <b>Dependency Injection</b> é uma técnica pra implementar DIP — passar dependência via construtor/setter/framework. Você pode ter DIP sem framework de DI (passa manual no construtor). E pode ter framework de DI injetando classes concretas — perde o DIP, mantém DI vazia. São coisas distintas.
    </div>
  </div>
</div>`,
        caption: 'ISP reduz acoplamento dividindo interface monolítica em capabilities. DIP inverte a direção da dependência: a regra de negócio define a interface; o adapter de infra implementa.',
      },
    ],
    keypoints: [
      {
        title: 'SRP — Single Responsibility (um motivo pra mudar)',
        body: 'Cada classe ou módulo deve ter uma única razão pra ser modificada. Robert Martin define "razão" como ator de negócio: se o financeiro pediria mudança em X e marketing pediria mudança em Y na mesma classe, você tem duas responsabilidades. Quebra em duas classes — cada uma serve um ator. Classes pequenas e focadas são mais fáceis de testar, ler e evoluir.',
        code: `// VIOLA SRP — três motivos pra mudar
class Report {
  generate(data: Data): string { /* HTML */ }
  saveToFile(html: string): void { /* IO */ }
  emailToManager(html: string): void { /* SMTP */ }
}

// RESPEITA SRP — três classes, três motivos
class ReportRenderer { render(data: Data): string {} }
class ReportStorage  { save(html: string): void {} }
class ReportMailer   { email(html: string, to: string) {} }

// Orquestra alto nível, sem misturar baixo
class GenerateMonthlyReport {
  constructor(
    private renderer: ReportRenderer,
    private storage: ReportStorage,
    private mailer: ReportMailer,
  ) {}
  exec(data: Data, to: string) {
    const html = this.renderer.render(data)
    this.storage.save(html)
    this.mailer.email(html, to)
  }
}`,
      },
      {
        title: 'OCP — Open/Closed (extensão sem modificação)',
        body: 'Software deve ser aberto pra extensão e fechado pra modificação. Adicionar novo comportamento (novo meio de pagamento, novo formato de export) NÃO deve exigir editar código existente — adiciona nova classe que implementa abstração. Isso reduz risco de regressão e permite plugin-like architecture. Implementação típica: Strategy pattern (interface + N implementações).',
        code: `// VIOLA OCP — switch cresce a cada novo tipo
function calculateArea(s: Shape): number {
  if (s.type === 'circle')    return Math.PI * s.r ** 2
  if (s.type === 'square')    return s.side ** 2
  if (s.type === 'triangle')  return s.base * s.h / 2
  // adicionar Hexagon? edita aqui.
}

// RESPEITA OCP — polimorfismo
interface Shape { area(): number }

class Circle   implements Shape { constructor(public r: number) {}    area() { return Math.PI * this.r ** 2 } }
class Square   implements Shape { constructor(public side: number) {} area() { return this.side ** 2 } }
class Hexagon  implements Shape { constructor(public side: number) {} area() { return 1.5 * Math.sqrt(3) * this.side ** 2 } }

// função fica fechada — novos shapes não tocam aqui
function totalArea(shapes: Shape[]): number {
  return shapes.reduce((sum, s) => sum + s.area(), 0)
}`,
      },
      {
        title: 'LSP — Liskov Substitution (subclasse honra contrato)',
        body: 'Se S é subtipo de T, objetos do tipo T devem poder ser substituídos por objetos do tipo S sem quebrar o programa. Subclasse não pode jogar exception em método herdado, não pode aceitar argumentos mais restritos, não pode quebrar invariantes da base. Quando precisa mentir no contrato, herança é o pattern errado — use composição ou interface segregada.',
        code: `// VIOLA LSP — quadrado herda retângulo
class Rectangle {
  constructor(public w: number, public h: number) {}
  setWidth(w: number)  { this.w = w }
  setHeight(h: number) { this.h = h }
  area() { return this.w * this.h }
}

class Square extends Rectangle {
  setWidth(w: number)  { this.w = w; this.h = w }  // quebra invariante
  setHeight(h: number) { this.w = h; this.h = h }
}

function test(r: Rectangle) {
  r.setWidth(5); r.setHeight(4)
  console.assert(r.area() === 20)  // falha se r for Square (área = 16)
}

// RESPEITA LSP — Square e Rectangle são tipos pares, não pai/filho
interface Shape { area(): number }
class Rectangle implements Shape { constructor(public w: number, public h: number) {}  area() { return this.w * this.h } }
class Square    implements Shape { constructor(public side: number) {}                 area() { return this.side ** 2 } }`,
      },
      {
        title: 'ISP — Interface Segregation (interfaces pequenas)',
        body: 'Cliente não deve ser forçado a depender de métodos que não usa. Em vez de uma fat interface com 30 métodos, prefira várias interfaces pequenas focadas em capability (Reader, Writer, Searchable). Classes podem implementar múltiplas. Reduz acoplamento e facilita mock em testes — você passa só a capability que o consumidor precisa.',
        code: `// VIOLA ISP — IPrinter força implementar tudo
interface IPrinter {
  print(doc: Doc): void
  scan(): Doc
  fax(doc: Doc, to: string): void
  staple(): void
}

class CheapPrinter implements IPrinter {
  print(doc: Doc) { /* ok */ }
  scan(): Doc      { throw new Error('não tenho scanner') }  // LSP+ISP violado
  fax(d, to)       { throw new Error('não tenho fax') }
  staple()         { throw new Error('não grampeio') }
}

// RESPEITA ISP — capabilities separadas
interface IPrinter  { print(doc: Doc): void }
interface IScanner  { scan(): Doc }
interface IFax      { fax(doc: Doc, to: string): void }
interface IStapler  { staple(): void }

class CheapPrinter implements IPrinter { print(doc) {} }
class MultiFunction implements IPrinter, IScanner, IFax {
  print(doc) {} scan() { return new Doc() } fax(d, to) {}
}`,
      },
      {
        title: 'DIP — Dependency Inversion (depender de abstração)',
        body: 'Módulos de alto nível (regra de negócio) não devem depender de módulos de baixo nível (driver, framework, IO). Ambos devem depender de abstração (interface). E abstração não deve depender de detalhe — detalhe depende de abstração. Inverte a direção tradicional do código procedural. Habilita teste isolado e troca de implementação sem reescrever regra.',
        code: `// VIOLA DIP — alto nível conhece baixo nível
import pg from 'pg'

class CreateUser {
  async exec(data: UserDTO) {
    const client = new pg.Client(...)
    await client.query('INSERT INTO users ...', [data.email])
  }
}

// RESPEITA DIP — alto nível define interface; baixo nível implementa
// domain/
interface IUserRepository {
  create(data: UserDTO): Promise<User>
}

// application/
class CreateUser {
  constructor(private repo: IUserRepository) {}
  async exec(data: UserDTO) { return this.repo.create(data) }
}

// infrastructure/ — detalhe que implementa abstração do core
class PostgresUserRepository implements IUserRepository {
  async create(data: UserDTO) { /* SQL */ return user }
}

// composition root junta tudo
const useCase = new CreateUser(new PostgresUserRepository())`,
      },
      {
        title: 'Coesão alta + acoplamento baixo (objetivo do SOLID)',
        body: 'SOLID é instrumento — não fim. O objetivo real é coesão alta (cada módulo tem propósito claro, código relacionado anda junto) e acoplamento baixo (mudar um módulo não cascateia em N outros). Se aplicar SOLID não está produzindo isso, você está usando errado. Métricas: classe > 300 linhas, construtor > 5 deps, mudança em A força mudança em B — sintomas de violação.',
      },
      {
        title: 'YAGNI antes de SOLID',
        body: '"You Aren\'t Gonna Need It" — não crie abstração especulativa. SOLID brilha quando há dor real de mudança ou variação prevista. Em código novo simples, SRP básico basta. Criar IUserRepository com uma só implementação SmtpUserRepository "porque DIP" é teatro. Aplica SOLID quando sentir o cheiro de mudança difícil — não antes. Refatorar é parte do ciclo, não fracasso.',
      },
      {
        title: 'Composition over inheritance',
        body: 'Effective Java (Bloch) e GoF: prefira composição a herança. Herança acopla forte — mudar a base afeta todos descendentes, e LSP quebra fácil em hierarquias profundas. Composição é mais flexível — troca componente em runtime, testa isolado. Use herança só quando relação "is-a" é estável e contrato da base é honesto. Em TypeScript, mixins e interface implementation cobrem 95% dos casos.',
        code: `// HERANÇA — frágil
class Animal {
  move() { /* anda */ }
}
class Dog extends Animal { /* herda move */ }
class Fish extends Animal { /* mas peixe nada, não anda */ }

// COMPOSIÇÃO — flexível
interface CanWalk { walk(): void }
interface CanSwim { swim(): void }

class Dog  implements CanWalk            { walk() {} }
class Fish implements CanSwim            { swim() {} }
class Duck implements CanWalk, CanSwim   { walk() {} swim() {} }

// função pede só o que precisa
function exercise(creature: CanWalk) { creature.walk() }`,
      },
      {
        title: 'Strategy pattern — implementação canônica de OCP',
        body: 'Strategy define família de algoritmos intercambiáveis. Cliente recebe a strategy via construtor (DIP) e usa via interface comum. Adicionar novo algoritmo = nova classe. Cliente não muda. É a forma mais comum de aplicar OCP em código real — Java/C# Comparator, payment processors, ranking algorithms, formatters.',
        code: `interface SortStrategy<T> {
  sort(items: T[]): T[]
}

class QuickSort<T> implements SortStrategy<T> {
  sort(items: T[]) { /* O(n log n) avg */ return items }
}
class MergeSort<T> implements SortStrategy<T> {
  sort(items: T[]) { /* O(n log n) worst */ return items }
}

class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}
  run(items: T[]) { return this.strategy.sort(items) }
}

// troca strategy sem tocar em Sorter
const sorter = new Sorter(new QuickSort())
sorter.run([3, 1, 2])`,
      },
      {
        title: 'Tell, don\'t ask (ligado a SRP e encapsulamento)',
        body: 'Em vez de pedir dados pra um objeto e decidir externamente, mande o objeto fazer (tell). Aproxima comportamento e dado, reduz acoplamento. Anti-pattern: getter pra tudo + lógica espalhada em service. Pattern: método de domínio que executa a regra. SRP é sobre quem muda; tell-don\'t-ask é sobre quem decide.',
        code: `// ASK (anti-pattern)
class Order {
  items: Item[]
  status: string
  total: number
}

// service que decide externamente
function ship(o: Order) {
  if (o.status === 'paid' && o.total > 0) {
    o.status = 'shipped'  // muta de fora
    // ...
  }
}

// TELL (pattern) — Order encapsula regra
class Order {
  private items: Item[] = []
  private status: 'pending' | 'paid' | 'shipped' = 'pending'

  ship() {
    if (this.status !== 'paid') throw new Error('Só envia pagos')
    if (this.items.length === 0) throw new Error('Sem itens')
    this.status = 'shipped'
  }
}

order.ship()  // diz o que fazer; objeto sabe se pode`,
      },
      {
        title: 'Detectar violações em code review',
        body: 'Sinais práticos pra catar SOLID em PR: classe com 5+ dependências no construtor (provável SRP); switch/if-else por tipo (provável OCP); método que joga "not implemented" em subclasse (LSP); parâmetro de interface usado parcialmente (ISP); import de driver concreto em camada de domínio (DIP); construtor com new de classe concreta (DIP). Ferramentas: SonarQube, ts-prune, eslint-plugin-boundaries.',
      },
      {
        title: 'SOLID em frameworks modernos (NestJS, Angular, Spring)',
        body: 'Frameworks modernos abraçam SOLID por design: NestJS força DIP via @Injectable + módulos; controllers ficam finos (SRP); guards/interceptors implementam OCP via composition; DTOs separam contrato HTTP de modelo de domínio. Mesmo sem aplicar Clean Arch completo, NestJS bem usado já segue SRP+DIP+OCP. Criticar a "burocracia" de DI é geralmente sintoma de quem não conhece o ganho.',
        code: `// NestJS — DIP por design
import { Injectable, Inject } from '@nestjs/common'

interface IUserRepo {
  findById(id: string): Promise<User>
}

@Injectable()
export class UsersService {
  constructor(@Inject('IUserRepo') private repo: IUserRepo) {}

  getUser(id: string) { return this.repo.findById(id) }
}

// providers no módulo definem implementação concreta
@Module({
  providers: [
    UsersService,
    { provide: 'IUserRepo', useClass: PostgresUserRepo },
    // troca pra TypeOrmUserRepo sem tocar UsersService
  ],
})
export class UsersModule {}`,
      },
      {
        title: 'Relação SOLID × Clean Architecture × DDD',
        body: 'Clean Architecture é arquitetura que aplica SOLID em camadas: dependency rule (DIP), use cases isolados (SRP), gateways como interface (ISP+DIP). DDD adiciona vocabulário de domínio (entity, aggregate, VO) sobre essa base. SOLID é fundação — sem ele, Clean Arch e DDD viram pasta com nomes bonitos sem ganho real. Sênior que aplica DDD sem dominar SOLID escreve "rich model" anêmico que o Uncle Bob não reconheceria.',
      },
    ],
    cheatsheet: {
      title: 'SOLID — definição, sinal de violação e correção',
      html: `<div style="background:#0f172a;padding:30px 24px;border-radius:14px;font-family:'JetBrains Mono',monospace;color:#e2e8f0;">
  <style>
    .sol-grid{display:grid;gap:12px}
    .sol-card{background:rgba(99,102,241,.07);border:1px solid rgba(99,102,241,.2);border-radius:8px;padding:14px 16px}
    .sol-letter{display:inline-block;width:28px;height:28px;border-radius:50%;background:#6366F1;color:#fff;text-align:center;line-height:28px;font-weight:700;margin-right:10px}
    .sol-name{font-size:13px;font-weight:700;color:#a5b4fc;margin-bottom:8px;display:flex;align-items:center}
    .sol-row{display:grid;grid-template-columns:90px 1fr;gap:8px;font-size:11px;line-height:1.6;padding:3px 0}
    .sol-label{color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;font-size:10px}
    .sol-value{color:#cbd5e1}
    .sol-value b{color:#fbbf24}
    .sol-code{background:rgba(0,0,0,.3);padding:8px 10px;border-radius:5px;margin-top:8px;color:#86efac;font-size:11px;line-height:1.6;border-left:2px solid #4ade80}
  </style>

  <div style="text-align:center;margin-bottom:18px">
    <div style="font-size:14px;font-weight:700;color:#a5b4fc;letter-spacing:.5px">SOLID — REVISÃO RÁPIDA</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:4px;font-family:'Plus Jakarta Sans',sans-serif">Sigla · definição · sinal de violação · como corrigir</div>
  </div>

  <div class="sol-grid">
    <div class="sol-card">
      <div class="sol-name"><span class="sol-letter">S</span>SRP — Single Responsibility</div>
      <div class="sol-row"><span class="sol-label">Definição</span><span class="sol-value">Uma classe tem <b>um motivo</b> pra mudar — um ator de negócio único.</span></div>
      <div class="sol-row"><span class="sol-label">Violação</span><span class="sol-value">Classe com 500+ linhas, 8+ deps no construtor, "OrderService" que valida + persiste + notifica + gera PDF.</span></div>
      <div class="sol-row"><span class="sol-label">Correção</span><span class="sol-value">Quebra por ator/responsabilidade. Use case orquestra; cada parte vira classe focada.</span></div>
      <div class="sol-code">class OrderValidator, OrderRepo, OrderMailer, OrderPdfRenderer</div>
    </div>

    <div class="sol-card">
      <div class="sol-name"><span class="sol-letter">O</span>OCP — Open/Closed</div>
      <div class="sol-row"><span class="sol-label">Definição</span><span class="sol-value">Aberto pra <b>extensão</b>, fechado pra <b>modificação</b>. Adicionar comportamento sem editar código existente.</span></div>
      <div class="sol-row"><span class="sol-label">Violação</span><span class="sol-value">switch/if-else cresce a cada novo tipo. Toda feature mexe na mesma classe.</span></div>
      <div class="sol-row"><span class="sol-label">Correção</span><span class="sol-value">Strategy pattern: interface + N implementações. Polimorfismo no lugar de switch.</span></div>
      <div class="sol-code">interface PaymentMethod { charge() } → Pix, Card, Boleto implementam</div>
    </div>

    <div class="sol-card">
      <div class="sol-name"><span class="sol-letter">L</span>LSP — Liskov Substitution</div>
      <div class="sol-row"><span class="sol-label">Definição</span><span class="sol-value">Subclasse <b>honra contrato</b> da base. Pode substituir sem cliente perceber.</span></div>
      <div class="sol-row"><span class="sol-label">Violação</span><span class="sol-value">Subclasse joga NotImplemented em método herdado. Square extends Rectangle quebra invariante.</span></div>
      <div class="sol-row"><span class="sol-label">Correção</span><span class="sol-value">Segrega capability em interface, ou usa composição. Hierarquia honesta.</span></div>
      <div class="sol-code">interface FlyingBird extends Bird { fly() } — Penguin só implementa Bird</div>
    </div>

    <div class="sol-card">
      <div class="sol-name"><span class="sol-letter">I</span>ISP — Interface Segregation</div>
      <div class="sol-row"><span class="sol-label">Definição</span><span class="sol-value">Cliente não depende de métodos que <b>não usa</b>.</span></div>
      <div class="sol-row"><span class="sol-label">Violação</span><span class="sol-value">Fat interface com 20 métodos; consumidor usa 3 e mocka 17 em teste.</span></div>
      <div class="sol-row"><span class="sol-label">Correção</span><span class="sol-value">Quebra em interfaces pequenas por capability (Reader, Writer, Searchable).</span></div>
      <div class="sol-code">IUserReader, IUserWriter — classe pode implementar várias</div>
    </div>

    <div class="sol-card">
      <div class="sol-name"><span class="sol-letter">D</span>DIP — Dependency Inversion</div>
      <div class="sol-row"><span class="sol-label">Definição</span><span class="sol-value">Alto-nível depende de <b>abstração</b>, não de detalhe. Detalhe depende de abstração.</span></div>
      <div class="sol-row"><span class="sol-label">Violação</span><span class="sol-value">UseCase importa pg, importa nodemailer; new Concreto() no construtor.</span></div>
      <div class="sol-row"><span class="sol-label">Correção</span><span class="sol-value">UseCase recebe interface no construtor. Implementação concreta vive na borda.</span></div>
      <div class="sol-code">constructor(private repo: IUserRepo) — Postgres impl injetado pelo módulo</div>
    </div>
  </div>

  <div style="margin-top:18px;padding:12px 16px;background:linear-gradient(90deg,rgba(99,102,241,.18),rgba(99,102,241,.04));border-radius:8px;border-left:3px solid #6366F1">
    <div style="font-size:11px;color:#a5b4fc;font-weight:700;letter-spacing:.5px;margin-bottom:4px">REGRA DE OURO</div>
    <div style="font-size:11px;color:#cbd5e1;line-height:1.7;font-family:'Plus Jakarta Sans',sans-serif">SOLID gera <b>coesão alta + acoplamento baixo</b>. Se sua aplicação não produz isso, você está usando errado. Não aplique cego — aplique quando sentir dor de mudança.</div>
  </div>
</div>`,
      caption: 'Cinco linhas pra revisar antes de entrevista. Decora cada definição, sinal e correção — entrevistador testa exatamente isso.',
    },
    mnemonics: [
      {
        label: 'Ordem das letras — S O L I D',
        trick: 'Single · Open · Liskov · Interface · Dependency',
        explanation: 'A sigla foi cunhada por Michael Feathers a partir dos princípios de Robert Martin. A ordem em que você decora não importa — entrevistador pode pedir em qualquer ordem. Mas decora as definições associadas: cada letra ↔ uma frase de uma linha.',
      },
      {
        label: 'SRP — "um ator, uma classe"',
        trick: 'Pergunta: quem pediria essa mudança?',
        explanation: 'Se a resposta inclui dois atores diferentes (financeiro pediria X, marketing pediria Y), são duas responsabilidades. Atores diferentes = SRP exige separação. Robert Martin reformulou SRP nessa visão (não é "uma função", é "um motivo de mudança").',
      },
      {
        label: 'OCP — "switch é cheiro"',
        trick: 'Vendo if-else por tipo? Pense em Strategy.',
        explanation: 'Toda vez que você ver switch/if-else discriminando por type/kind/category numa lógica de negócio, considere transformar em polimorfismo (interface + N implementações). É a regra mais aplicável dia-a-dia.',
      },
      {
        label: 'DIP × DI — não confunda',
        trick: 'DIP = princípio · DI = técnica',
        explanation: 'DIP é decisão de design (depender de abstração). DI é como implementar isso (injeta via construtor/setter/framework). Você pode ter DIP sem framework de DI. Pode ter framework de DI injetando classe concreta — perde o DIP.',
      },
    ],
    gotchas: [
      'Criar IUserRepository + UserRepositoryImpl com uma só implementação só "pra ter DI" — abstração especulativa, ruído sem ganho. Cria interface quando há ≥2 implementações reais ou previsão concreta de variação.',
      'Quebrar SRP de forma absurda em 50 microclasses de 5 linhas — coesão morre, código vira labirinto, navegação fica impossível. SRP é "um motivo pra mudar", não "uma função por classe".',
      'Aplicar OCP em código simples interno — toda lógica vira Strategy/Factory/Builder. Indireção sem ganho, leitura piora. Espera dor de mudança real antes de generalizar.',
      'Herança como mecanismo de reuso (extends UserBase pra ganhar 3 métodos) — quase sempre quebra LSP. Composição + interface (mixin) é melhor.',
      'Confundir "fechado pra modificação" com "código congelado, intoque-me". OCP é sobre design de extensão, não sobre proibir refactor. Refatorar interna é normal — quebrar contrato externo não é.',
      'Achar que SOLID resolve tudo. São princípios de OOP — não substituem boas escolhas de banco, observabilidade, sharding, cache. SOLID melhora código local; arquitetura distribuída exige outras lentes.',
      'Aplicar DIP só pra cima e esquecer que detalhes precisam implementar abstração. Se interface IRepo só tem método save() e seu Postgres impl tem 12 métodos extras públicos, consumidores vão acoplar nos extras — perde o ponto.',
      'Criar interfaces ISP no domínio que vazam tipos de infra (HttpRequest, MongoDoc). Interface deve falar a linguagem do core — não da camada externa.',
    ],
    interview: [
      {
        q: 'Me dá um exemplo real onde SRP melhorou seu código.',
        level: 'pleno',
        a: '<p>Tinha uma classe <code>OrderService</code> que validava pedido, calculava frete via API correios, aplicava cupom, gravava no Postgres com SQL puro, enviava email SMTP e gerava PDF da NF — uns 800 linhas. Cada mudança forçava re-rodar 40 testes acoplados. Refatorei pra <code>OrderValidator</code>, <code>ShippingCalculator</code>, <code>DiscountPolicy</code>, <code>OrderRepository</code>, <code>OrderNotifier</code> e <code>InvoiceRenderer</code>, com um <code>PlaceOrderUseCase</code> orquestrando.</p><p>Resultado mensurável: cobertura subiu (cada classe testa isolado em ms), regra de frete muda sem mexer em validação, e PRs ficam focados — code review caiu de 30min pra 5min. <strong>Bonus:</strong> trocar correios por Jadlog virou um arquivo só, em vez de espalhar try/catch pelo OrderService.</p>',
        tip: 'Cita métrica concreta (tempo de teste, tempo de PR) — diferencia quem viveu de quem só leu. Não vende o pattern; vende a dor que ele resolveu.',
      },
      {
        q: 'Quando SOLID vira overengineering?',
        level: 'pleno',
        a: '<p>Quando você cria <strong>abstração especulativa sem dor real</strong>. Exemplo clássico: <code>IEmailSender</code> com uma única implementação <code>SmtpEmailSender</code>, em projeto que nunca vai trocar. Você ganhou um arquivo extra, indireção, e perdeu legibilidade — sem ganho de teste real (você poderia mockar SmtpEmailSender direto).</p><p>Outro caso: aplicar OCP em CRUD interno simples. Tudo vira Strategy/Factory/Builder — abstração desproporcional ao problema. Regra que sigo: <strong>aplica SOLID quando já sentiu o cheiro de mudança difícil, não antes</strong>. Refatorar é cheap; abstrair errado é caro de desfazer.</p><p>Sintoma de overengineering: arquivo com 90% boilerplate (mapper, DTO, factory, interface) e 10% lógica. Quando o boilerplate domina, o pattern não está pagando o próprio custo.</p>',
        tip: 'Mostra que você aplica SOLID com discernimento, não como religião. Entrevistador valoriza quem sabe NÃO usar tanto quanto quem sabe usar.',
      },
      {
        q: 'Qual a diferença entre DIP e Dependency Injection?',
        level: 'pleno',
        a: '<p><strong>DIP é princípio de design:</strong> dependa de abstração, não de implementação concreta. É decisão de como organizar dependências entre camadas — alto-nível define interface; baixo-nível implementa.</p><p><strong>DI é técnica:</strong> uma forma de implementar DIP — você injeta a dependência (via construtor, setter ou framework como NestJS/Spring) em vez de instanciar dentro da classe.</p><p>Dois cenários pra fixar:</p><ul><li><strong>DIP sem framework de DI:</strong> passa interface no construtor manual. Composition root junta implementações. Funciona — Spring/Nest não são obrigatórios.</li><li><strong>DI sem DIP:</strong> framework injeta classe concreta. Você está usando container, mas perdeu inversão. Pior dos mundos: complexidade do framework sem o benefício de testabilidade.</li></ul><p>Sênior bom sabe distinguir — confundir mostra superficialidade.</p>',
        tip: 'Esse é teste de profundidade clássico. Muitos juniors decoram que "DIP = usa @Injectable" — você quer sair do superficial.',
      },
      {
        q: 'Me explica LSP com um caso real que você viu quebrar.',
        level: 'senior',
        a: '<p>Caso real de produção: tínhamos uma <code>List&lt;T&gt;</code> base com método <code>add(item)</code>. Alguém criou <code>ImmutableList&lt;T&gt; extends List&lt;T&gt;</code> que jogava <code>UnsupportedOperationException</code> em <code>add()</code>. Funcionava em 90% do código. Mas um service legacy que recebia <code>List&lt;T&gt;</code> e fazia <code>list.add(...)</code> quebrou em prod quando alguém passou ImmutableList — quebra LSP, classe filha não honra contrato.</p><p>Solução: separamos em <code>ReadOnlyList&lt;T&gt;</code> (sem add) e <code>MutableList&lt;T&gt; extends ReadOnlyList&lt;T&gt;</code> (com add). Cliente legacy mudou tipo do parâmetro pra <code>MutableList</code> — compilador rejeitou ImmutableList no lugar. Type-safe.</p><p>Outro clássico: <code>Penguin extends Bird</code> com <code>fly()</code>. Penguin "é" Bird? Sim, mas não voa. Sintoma de hierarquia errada — separa em <code>Bird</code> e <code>FlyingBird</code> (interface).</p><p>Heurística: quando subclasse precisa <strong>mentir no contrato</strong>, herança é o pattern errado. Considera composição ou interface segregada.</p>',
        tip: 'Cita caso real com tipo (Java/C#/TS) e como o compilador entrou no jogo. Sênior usa LSP pra type-safety, não só doc.',
      },
      {
        q: 'Composição vs herança — qual sua regra?',
        level: 'pleno',
        a: '<p><strong>Herança</strong>: simples no início, reusa código gratuitamente, mas acopla forte. Mudar a base afeta TODOS descendentes; LSP quebra fácil em hierarquias profundas; refactor caro depois de 3+ níveis. Funciona quando relação "is-a" é estável e contrato da base é honesto.</p><p><strong>Composição</strong>: mais boilerplate inicial (forward methods ou mixin), mas flexível: troca componente em runtime, testa isolado, sem fragilidade hierárquica. Effective Java (Bloch): <em>"favor composition over inheritance"</em>.</p><p>Minha regra prática:</p><ul><li><strong>Herança:</strong> só pra "is-a" comprovado (Square é Shape, EmailNotifier é Notifier). Máx 2 níveis.</li><li><strong>Composição:</strong> default pra reuso. Mixin/trait/strategy.</li><li><strong>Interface implementation:</strong> sempre que há contrato compartilhado sem comportamento default a herdar.</li></ul><p>Em TypeScript, prefiro interface implementation sobre extends class. Mais flexível e composable. Em Java/C#, mesma lógica com interface default methods (Java 8+) ou abstract base classe pequena.</p>',
      },
      {
        q: 'Como você refatora um switch grande pra OCP?',
        level: 'pleno',
        a: '<p>Passo a passo na refatoração canônica:</p><ol><li><strong>Identifica a abstração comum:</strong> o switch tem N braços; cada braço faz uma operação. Extrai assinatura comum em interface (<code>process(): Result</code>).</li><li><strong>Cria implementação por braço:</strong> cada case vira uma classe que implementa a interface. Lógica do braço migra pro método.</li><li><strong>Substitui switch por dispatch:</strong> Map<Type, Strategy> ou factory. <code>strategies.get(type).process()</code>. Switch some.</li><li><strong>Validação:</strong> teste cobre cada strategy isolado; teste do dispatcher cobre seleção certa.</li></ol><p>Antes: 1 arquivo de 400 linhas com switch. Depois: dispatcher de 30 linhas + N classes de 50 linhas. Adicionar nova: cria classe + registra no map. <strong>Zero modificação</strong> em código existente — OCP cumprido.</p><p>Cuidado: se há só 2 braços e nunca vai crescer, switch tá ok. OCP brilha quando variação é frequente ou prevista (gateway de pagamento, exporter, formatter).</p>',
        tip: 'Demonstra processo de refactor incremental. Não é big bang — sênior refatora step-by-step com testes.',
      },
      {
        q: 'Como SOLID se relaciona com Clean Architecture?',
        level: 'senior',
        a: '<p>Clean Architecture é <strong>aplicação concreta de SOLID em camadas</strong>:</p><ul><li><strong>Dependency Rule</strong> = DIP elevado a regra arquitetural. Camadas externas dependem de internas; nunca o contrário.</li><li><strong>Use Cases</strong> = SRP em escala — cada use case orquestra uma operação de negócio. Um motivo pra mudar.</li><li><strong>Gateways/Repositories</strong> = ISP+DIP — interfaces no domínio; implementações no adapter de infra.</li><li><strong>Entities</strong> = encapsulamento + SRP — comportamento de domínio dentro do objeto.</li><li><strong>Plugin Architecture</strong> = OCP — adicionar novo controller, novo banco, novo external service não toca core.</li></ul><p>Sem SOLID, Clean Arch vira pasta com nomes bonitos (domain/, application/, infrastructure/) sem ganho real. Você pode ter "Clean Architecture" violando dependency rule (importando ORM no domain) — aí é só teatro.</p><p>Inverso: você pode ter código SOLID sem Clean Arch — em projeto pequeno, MVC com SOLID resolve. Clean Arch agrega valor em sistema com regra rica e vida longa.</p>',
        tip: 'Faz a ponte com a próxima skill (Clean Arch). Mostra que você vê SOLID como fundação, não como meta.',
      },
      {
        q: 'Você aplicaria SOLID em código procedural / funcional?',
        level: 'senior',
        a: '<p>Os <strong>princípios subjacentes</strong> aplicam — só mudam de nome. SRP em FP vira função pequena focada em uma transformação. OCP vira higher-order function (passa estratégia como argumento). DIP vira injeção de função (não importa biblioteca; recebe função no parâmetro). LSP é honra de tipo (function signature contract). ISP vira tipo pequeno e composto.</p><p>O que <strong>não se traduz</strong>: ISP especificamente como interface OO, e a discussão de herança/composição. Em FP puro não há herança.</p><p>Em TypeScript misto OO+FP, eu uso SOLID pras classes (use cases, services com estado) e princípios funcionais pras transformações puras. Não force SOLID em pure functions — currying e composição são mais idiomáticos.</p>',
      },
      {
        q: 'Como você ensina SOLID pro time júnior sem virar dogma?',
        level: 'senior',
        a: '<p>Não começo pelas siglas. Começo por <strong>dor</strong>:</p><ol><li><strong>Mostro código real do time</strong> que tá doendo (classe gigante, teste lento, mudança que cascateia). Pergunto: por que isso dói?</li><li><strong>Refatoro junto</strong> aplicando 1 princípio por vez. Sente a diferença antes/depois.</li><li><strong>Só então nomeio</strong>: "isso que a gente fez se chama SRP". Sigla vira label de algo já intuído.</li></ol><p>Evito 3 anti-patterns:</p><ul><li>Aula teórica ("vou explicar SOLID") — desliga interesse.</li><li>Exemplo Animal/Cachorro/Gato — desconectado de problema real do time.</li><li>Code review punitivo ("isso viola SRP, refatora") — gera defesa, não aprendizado.</li></ul><p>Sucesso é quando o júnior identifica violação no PR de outro júnior, com argumento de impacto (não de regra). Aí o princípio foi internalizado.</p>',
      },
      {
        q: 'Tradeoff de aplicar SOLID em código legado.',
        level: 'senior',
        a: '<p>Em legado, SOLID é <strong>investimento</strong>. Custo upfront alto: refatorar God class de 2000 linhas com baixa cobertura é arriscado. Estratégia que uso:</p><ol><li><strong>Cobre antes de refatorar.</strong> Adiciona teste de caracterização (golden master) que congela comportamento atual. Sem isso, refactor cego = bug em prod.</li><li><strong>Refatora o que dói agora.</strong> Não tenta limpar tudo. Identifica o módulo que está bloqueando feature/causando bug recorrente. Aplica SOLID lá.</li><li><strong>Strangler fig.</strong> Cria novo código SOLID ao lado, redireciona tráfego gradualmente, deprecia velho. Boy Scout Rule: deixa um pouco mais limpo a cada PR.</li><li><strong>Não reescreve.</strong> Joel Spolsky: rewrite é o pior erro de software. Refatora incrementalmente.</li></ol><p>Métrica de sucesso: tempo médio de mudança no módulo cai. Bug rate cai. Teste roda em ms em vez de min. ROI é mensurável — se não for, está aplicando SOLID por estética.</p>',
      },
      {
        q: 'O que é "violação de Demeter" e como se relaciona com SOLID?',
        level: 'senior',
        a: '<p>Lei de Demeter (Law of Demeter, LoD): "fale só com seus amigos imediatos". Um método de objeto X deve invocar apenas: (a) métodos de X, (b) métodos de parâmetros, (c) métodos de objetos criados internamente, (d) métodos de fields diretos. Não deve fazer <code>obj.foo().bar().baz()</code> — isso é "train wreck".</p><p>Relação com SOLID: train wreck viola encapsulamento e <strong>aumenta acoplamento transitivo</strong>. Se mudo a API de <code>bar()</code>, X (que fala com bar via foo) quebra — mesmo X não devendo conhecer bar.</p><p>Correção: tell-don\'t-ask. Em vez de <code>order.getCustomer().getAddress().getZip()</code>, expor <code>order.getCustomerZip()</code>. Encapsulamento honra SRP (Order responde sobre o que é seu) e reduz acoplamento (X não conhece Customer e Address).</p><p>Cuidado: não vira regra absoluta. <code>list.filter(x => x.foo).map(...)</code> é fluent API legítima — Demeter não fala disso. Demeter fala de cadeia de getters em modelos de domínio.</p>',
      },
      {
        q: 'Erro mais comum de quem aplica SOLID errado?',
        level: 'pleno',
        a: '<p>Top 3 que vejo em PRs:</p><ol><li><strong>Interface por classe</strong> (cargo cult DIP). <code>IEmailSender</code>, <code>ISmsSender</code>, <code>IPushSender</code> — cada um com 1 implementação. Boilerplate sem ganho. <strong>Fix:</strong> só extrai interface quando há ≥2 implementações reais ou variação prevista concreta (não "talvez um dia").</li><li><strong>SRP excessivo</strong> — classe de 5 linhas, 50 classes pra fazer o que cabia em 200 linhas coesas. <strong>Fix:</strong> SRP é "um motivo pra mudar", não "uma função". Coesão alta importa tanto quanto separação.</li><li><strong>OCP especulativo</strong> — Strategy/Factory/Abstract Factory em CRUD simples sem variação. <strong>Fix:</strong> espera o segundo caso aparecer. Refatorar de switch pra Strategy é fácil; desfazer Strategy é caro.</li></ol><p>Princípio meta: <strong>evidência antes de abstração</strong>. Não invente variação que não existe.</p>',
        tip: 'Mostra autocrítica e pragmatismo. Sênior que admite que aplicou SOLID errado já passou da fase superficial.',
      },
      {
        q: 'Como o ISP ajuda na testabilidade do código?',
        level: 'pleno',
        a: '<p>Interfaces gordas forçam mocks grandes: ao criar um fake para teste, você implementa 12 métodos quando o código sob teste usa apenas 2. Isso gera <strong>ruído, fragilidade e acopla o teste à interface completa</strong> — qualquer novo método na interface quebra todos os mocks existentes.</p><p>Com ISP, cada interface tem apenas os métodos que o cliente de fato usa:</p><ul><li><code>IReadOnlyProductRepo</code> com só <code>findById()</code> e <code>findAll()</code></li><li><code>IWritableProductRepo</code> com <code>save()</code> e <code>delete()</code></li></ul><p>O mock pra testes de leitura implementa só <code>IReadOnlyProductRepo</code> — 2 métodos, sem ruído. O use case de escrita mocka <code>IWritableProductRepo</code> — testado isoladamente sem carregar todo o contrato de leitura.</p><p>Regra prática: <strong>se seu mock tem métodos que retornam <code>undefined</code> ou lançam "not implemented", a interface é gorda demais</strong>. Segrega.</p>',
        tip: 'Conecte ISP diretamente a facilidade de teste — isso é argumento concreto que entrevistador sênior quer ouvir, não a definição textbook.',
      },
      {
        q: 'Qual princípio SOLID é mais difícil de aplicar corretamente e por quê?',
        level: 'senior',
        a: '<p>Na prática de time, o <strong>OCP</strong> é o mais mal-aplicado — porque exige antecipar pontos de variação sem especular. O instinto humano é: "vou abstrair agora para não ter que refatorar depois". O resultado é Strategy pattern em código com 1 caso de uso, ou Abstract Factory em CRUD sem variação prevista.</p><p>O <strong>DIP</strong> é o segundo: a confusão entre DIP (princípio) e DI (técnica de injeção) faz times acharem que ter um container de DI já satisfaz DIP — mas você pode ter <code>@Injectable() OrderService</code> injetando <code>PrismaOrderRepository</code> concreto (não interface), o que viola DIP por completo.</p><p>Regra de ouro para OCP: <strong>não abstraia antes de ver dois casos</strong>. Refatorar quando o segundo caso aparece é sempre mais barato que desfazer abstração prematura. Para DIP: interface deve ser definida e nomeada pelo cliente que a usa, no pacote do cliente — não pelo implementador.</p>',
        tip: 'Ter opinião formada sobre qual é mais difícil e por quê mostra maturidade de quem aplicou e não só decorou. Argumente com experiência, não com teoria.',
      },
      {
        q: 'Como você garante que novos devs não violem SOLID no código?',
        level: 'senior',
        a: '<p>Garantia por ferramenta, não por disciplina individual. Três camadas:</p><ol><li><strong>Lint estático:</strong> <code>eslint</code> com regras de complexidade (<code>max-lines-per-function</code>, <code>max-params</code>, <code>complexity</code>). Classes com 15+ métodos ou funções com 50+ linhas são sintomas de SRP violado — ferramenta detecta automaticamente no CI.</li><li><strong>Arquitetura enforced:</strong> <code>eslint-plugin-boundaries</code> ou <code>dependency-cruiser</code> configura quais módulos podem importar quem. Domain não importa infrastructure — regra no CI.</li><li><strong>Code review com template:</strong> checklist de PR inclui "dependency rule", "interface necessária ou especulativa?", "cada classe tem um único motivo pra mudar?". Não deixa pra memória do reviewer.</li></ol><p>A cultura vem depois: quando o CI rejeita automaticamente, o dev aprende mais rápido do que em code review punitivo 2 dias depois do commit. Ferramenta é mentor 24/7.</p>',
        tip: 'Citar ferramentas concretas (eslint-plugin-boundaries, dependency-cruiser, complexidade via lint) é o que separa quem aplica de quem leu.',
      },
      {
        q: 'Como SRP se diferencia do princípio de coesão?',
        level: 'senior',
        a: '<p>SRP e coesão são primos — mas têm perspectivas diferentes. <strong>Coesão</strong> é uma propriedade estrutural: o quanto os elementos de um módulo (métodos, campos) estão relacionados entre si. Alta coesão = tudo no módulo colabora pra um propósito único. Baixa coesão = módulo mistura coisas não relacionadas.</p><p><strong>SRP</strong> é perspectiva de ator: "um módulo deve ser responsável por um único ator". O autor (Uncle Bob) é explícito: SRP não é "faça só uma coisa" — é "só um stakeholder pede mudança nessa classe". Uma classe com 10 métodos pode ter SRP se todos servem ao mesmo grupo de usuários.</p><p>Na prática, as duas perspectivas se complementam. Classe com alta coesão geralmente tem SRP; classe com SRP geralmente tem alta coesão. Quando há tensão entre as duas, o critério do <strong>ator</strong> (SRP) desempata: pergunta "quem pede essa mudança?" — se a resposta for dois grupos diferentes, separa, mesmo que os métodos pareçam relacionados estruturalmente.</p>',
        tip: 'Diferenciar SRP do "faça uma coisa só" mostra que você leu Uncle Bob além das listas de bullet points. É um diferencial sênior.',
      },
      {
        q: 'Em TypeScript, quando usar abstract class vs interface para DIP?',
        level: 'pleno',
        a: '<p>A pergunta correta é: <strong>o que o contrato precisa compartilhar?</strong></p><ul><li><strong>Interface:</strong> quando o contrato é puro comportamento sem implementação padrão. Mais flexível — uma classe pode implementar múltiplas interfaces. Sem custo em runtime (apagada no compile). Preferida quando não há lógica compartilhada entre implementações.</li><li><strong>Abstract class:</strong> quando há implementação padrão que todos os filhos herdarem, evitando duplicação. Pode ter estado (campos). Custo: herança única em TypeScript/JS — classe filha não pode estender outra classe.</li></ul><p>Para DIP, <strong>interface quase sempre vence</strong>: você quer que o domínio defina um contrato puro (<code>IOrderRepository</code>), e o adapter de infra implemente. Nenhum código padrão pertence ao contrato de domínio — pertence ao adapter.</p><p>Exceção prática: se você tem um <code>BaseRepository</code> com lógica de paginação e auditoria compartilhada por todos os repos, abstract class pode valer — mas esse comportamento compartilhado é infra, não domínio. Mantenha a interface no domínio e a abstract class na camada de infra.</p>',
        tip: 'Em entrevista TypeScript/Node, essa é pergunta frequente. Resposta correta não é dogmática — depende do que o contrato precisa expressar.',
      },
      {
        q: 'Qual o impacto de SOLID na velocidade de entrega a longo prazo?',
        level: 'senior',
        a: '<p>Curto prazo: SOLID <strong>reduz velocidade</strong>. Mais arquivos, mais interfaces, mais boilerplate. Uma feature que levaria 1h em code acoplado leva 2h com SOLID aplicado. Isso é real — não é argumento contra SOLID, é custo honesto que sênior bom admite.</p><p>Médio/longo prazo (>3 meses de desenvolvimento ativo): SOLID <strong>aumenta velocidade</strong>. Os dados da experiência:</p><ul><li>Feature nova toca módulo isolado, não cascateia mudanças</li><li>Bug em módulo A não impacta módulo B (sem acoplamento)</li><li>Teste roda em ms (não em minutos) — feedback loop rápido</li><li>Onboarding mais fácil: dev novo entende responsabilidade de cada classe em horas, não dias</li><li>Refactor localizado: troca implementação de gateway sem tocar use case</li></ul><p>Métricas concretas que já vi em time: lead time de feature caiu de 2 semanas para 3 dias após 6 meses de SOLID consistente. Bug rate em módulo refatorado caiu 70%. Revisão de PR caiu de 45min para 10min (contexto menor por PR).</p><p>Conclusão: SOLID é investimento com ROI positivo em sistemas vivos com >3 meses de vida. Em protótipo descartável, o custo não compensa.</p>',
        tip: 'Citar números e timeline mostra maturidade de engenharia. Sênior quantifica trade-offs — não argumenta por intuição.',
      },
      {
        q: 'Como SOLID se aplica a código funcional (funções, pipelines)?',
        level: 'senior',
        a: '<p>Em código funcional, os princípios SOLID se traduzem naturalmente:</p><ul><li><strong>SRP → função pequena, uma transformação:</strong> <code>const parseDate = (s: string): Date</code> não valida e não persiste junto.</li><li><strong>OCP → higher-order functions:</strong> função aceita estratégia como parâmetro em vez de ter if/switch interno. <code>processItems(items, handler: (item) => Result)</code>.</li><li><strong>LSP → honra de tipo:</strong> se uma função promete retornar <code>User | null</code>, nunca lança exceção onde o chamador espera null. Contrato de tipo é honrado.</li><li><strong>ISP → tipos pequenos e focados:</strong> função recebe só o que precisa. Em vez de receber <code>User</code> inteiro (com 20 campos), recebe <code>{ id: string; email: string }</code> — structural typing do TypeScript permite isso naturalmente.</li><li><strong>DIP → injeção de função:</strong> em vez de chamar <code>sendEmail()</code> direto, recebe <code>notifier: (msg: string) => void</code> no parâmetro.</li></ul><p>Diferença chave: em FP não há herança, então LSP como "subclasse honra contrato" não se aplica diretamente — mas o <strong>princípio subjacente</strong> (honrar contrato de tipo) aplica-se via TypeScript strict mode e uso correto de union types.</p>',
        tip: 'Conectar SOLID a código funcional demonstra que você entende os princípios subjacentes, não apenas os patterns OO. Diferencial em entrevistas com times TypeScript modernos.',
      },
      {
        q: 'Como você detecta violações de SOLID em code review de forma eficiente?',
        level: 'pleno',
        a: '<p>Code review não deve depender de memória do reviewer. Checklist mental que aplico em menos de 2 minutos por arquivo:</p><ol><li><strong>SRP check:</strong> a classe tem mais de 1 import de domínios distintos (ex: <code>import { PrismaClient }</code> e <code>import { MailerService }</code> no mesmo arquivo de domínio)? Se sim, provavelmente viola SRP — classe toca banco E email.</li><li><strong>OCP check:</strong> há switch/if-else por tipo (<code>if (type === \'pix\')</code>, <code>else if (type === \'boleto\')</code>)? Pergunto: "esse if vai crescer?" Se sim, Strategy/Map pattern está faltando.</li><li><strong>LSP check:</strong> método sobrescrito lança <code>throw new Error(\'not implemented\')</code> ou retorna tipo diferente da assinatura da base? Flag imediata.</li><li><strong>ISP check:</strong> interface tem mais de 5-7 métodos, e o cliente usa só 2? Candidata a segregação.</li><li><strong>DIP check:</strong> construtor da classe instancia dependência concreta (<code>new PrismaClient()</code>, <code>new AxiosClient()</code>) em vez de receber pela interface? Injeção quebrada.</li></ol><p>Ferramentas que automatizam parte disso: eslint <code>max-params</code>, <code>max-lines</code>, <code>complexity</code>. Deixo automático o que ferramenta detecta, e foco o code review no que requer julgamento (escolha de abstração, nomeação, contexto de negócio).</p>',
        tip: 'Dar um checklist prático de code review demonstra que você aplica SOLID como processo de time, não como conhecimento individual. Diferencial de tech lead.',
      },
    ],
    exercises: [
      {
        level: 'iniciante',
        title: 'Refatorar God class aplicando SRP',
        description: 'Você recebe uma classe <code>UserManager</code> com 6 responsabilidades: validação, hash de senha, persistência SQL, envio de email de boas-vindas, geração de token JWT e log estruturado. Refatore em classes separadas seguindo SRP. Cada classe deve ter teste unitário isolado (sem mock de mais de 1 dependência).',
        concepts: ['SRP', 'separação de responsabilidades', 'teste unitário', 'orquestração'],
        hint: 'Cria UserValidator, PasswordHasher, UserRepository, WelcomeEmailSender, TokenIssuer, Logger. Use case CreateUser orquestra os 6. O construtor do use case mostra todas as dependências — se tem 6, tudo bem; se tem 12, virou God use case.',
        relatedKeypoints: [0, 5],
      },
      {
        level: 'intermediario',
        title: 'Substituir switch por Strategy (OCP)',
        description: 'Há uma função <code>calculateShipping(method: string, weight: number)</code> com switch de 5 modalidades (Sedex, PAC, Jadlog, Loggi, Retira). Cada modalidade tem fórmula própria. Refatore pra Strategy pattern: interface ShippingMethod com calcular(weight): number, e implementações por modalidade. Adicione teste que cobre todas as estratégias e demonstre que adicionar Total Express vira nova classe sem tocar nas existentes.',
        concepts: ['OCP', 'Strategy pattern', 'polimorfismo', 'testabilidade'],
        hint: 'Use Map<string, ShippingMethod> ou DI container pro dispatch. Considere edge case: método inválido — joga erro ou retorna null? Documenta no contrato da interface.',
        relatedKeypoints: [1, 8],
      },
      {
        level: 'intermediario',
        title: 'Detectar e corrigir violação LSP',
        description: 'Recebe uma hierarquia <code>Document</code> → <code>PdfDocument</code>, <code>WordDocument</code>, <code>EncryptedDocument extends PdfDocument</code>. EncryptedDocument joga exception em <code>extractPlainText()</code>. Identifica a violação LSP, propõe correção (provável: separar em interface <code>ReadableDocument</code> que EncryptedDocument não implementa) e ajusta call sites pra type-safety.',
        concepts: ['LSP', 'tipos honestos', 'interface segregation', 'refactor'],
        hint: 'Pergunta: qual contrato a base promete? Se EncryptedDocument não cumpre, ela não é PdfDocument (no sentido OO). Use composição ou interface mais restrita.',
        relatedKeypoints: [2, 7],
      },
      {
        level: 'senior',
        title: 'Refatoração completa SOLID — todos os 5 princípios',
        description: 'Você herda um <code>ReportEngine</code> que viola tudo: 1500 linhas (SRP), switch por tipo de relatório (OCP), <code>EncryptedReport extends Report</code> que joga em métodos herdados (LSP), interface <code>IReportSomething</code> com 18 métodos (ISP) e construtor com <code>new PostgresClient()</code> + <code>new SmtpClient()</code> (DIP). Refatore aplicando os 5 princípios. Documente cada decisão e mostre métricas antes/depois (linhas, deps no construtor, tempo de teste, cobertura).',
        concepts: ['SOLID completo', 'refactor incremental', 'composition root', 'DI', 'métricas'],
        hint: 'Não faça big bang. Adiciona testes de caracterização primeiro (golden master). Aplica 1 princípio por commit. Métricas: classe sai de 1500 → ~150 linhas + N classes ~80 linhas; deps caem de 8 → 3 por classe; tempo total de teste cai de min → ms.',
        relatedKeypoints: [0, 1, 2, 3, 4],
      },
      {
        level: 'senior',
        title: 'Aplicar SOLID em código NestJS real',
        description: 'Pegue um módulo NestJS existente (ou crie um <code>BillingModule</code> com PaymentService, InvoiceService e NotificationService). Aplique SOLID: SRP (cada service uma responsabilidade), OCP (PaymentMethod via Strategy + DI multi-token), DIP (interfaces no domain layer, implementações no infrastructure). Documente o composition root e mostre como trocar PostgresInvoiceRepo por DynamoInvoiceRepo sem tocar no service.',
        concepts: ['SOLID em NestJS', 'DI multi-token', 'Clean separation', 'composition root'],
        hint: 'Use @Inject(\'IInvoiceRepo\') com providers multi-token. Crie PaymentStrategyFactory que recebe array de strategies via DI. Garanta que DomainService não importa nada de infrastructure.',
        relatedKeypoints: [4, 11],
      },
    ],
    resources: [
      { title: 'Clean Architecture (Robert Martin)', url: 'https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164', kind: 'livro' },
      { title: 'Agile Software Development: Principles, Patterns, and Practices', url: 'https://www.amazon.com/Software-Development-Principles-Patterns-Practices/dp/0135974445', kind: 'livro' },
      { title: 'SOLID — The First Five Principles of OOP (Uncle Bob)', url: 'https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html', kind: 'artigo' },
      { title: 'Refactoring Guru — Design Principles', url: 'https://refactoring.guru/design-patterns', kind: 'docs' },
      { title: 'Refactoring (Martin Fowler) — segundo edição', url: 'https://martinfowler.com/books/refactoring.html', kind: 'livro' },
      { title: 'Effective Java (Joshua Bloch) — 3ª edição', url: 'https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/', kind: 'livro' },
      { title: 'Clean Code (Robert Martin)', url: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882', kind: 'livro' },
      { title: 'SOLID em TypeScript — exemplos práticos', url: 'https://github.com/labs42io/clean-code-typescript', kind: 'docs' },
      { title: 'Programming Paradigms (Robert Martin) — talk', url: 'https://www.youtube.com/watch?v=7EmboKQH8lM', kind: 'video' },
      { title: 'Five Principles of OO Class Design (PPP cap.7-11)', url: 'https://web.archive.org/web/20100211192103/http://www.objectmentor.com/resources/articles/Principles_and_Patterns.pdf', kind: 'artigo' },
    ],
    videos: [
      { title: 'SOLID Design Principles in Object Oriented Programming', channel: 'Fireship', url: '', topic: 'Todos os 5 princípios em 10 minutos', note: 'Excelente revisão rápida antes de entrevista — exemplos concisos' },
      { title: 'Uncle Bob — The Principles of OOD', channel: 'Robert Martin', url: '', topic: 'Aula original de Robert Martin sobre SOLID', note: 'A fonte primária — explica a motivação por trás de cada princípio' },
      { title: 'S.O.L.I.D Principles em TypeScript', channel: 'Rocketseat', url: '', topic: 'SOLID com TypeScript e exemplos práticos brasileiros', note: 'Boa para contexto brasileiro e exemplos em TS' },
      { title: 'SOLID Principles — The Dependency Inversion Principle', channel: 'Traversy Media', url: '', topic: 'DIP aprofundado com injeção de dependência real', note: 'O DIP é o princípio mais cobrado em entrevista senior — foco aqui' },
      { title: 'Clean Code vs SOLID — When to use what', channel: 'ArjanCodes', url: '', topic: 'Quando aplicar SOLID vs code simples', note: 'Perspectiva pragmática sobre quando aplicar — evita over-engineering' },
    ],
    codeExamples: [
      {
        title: 'SOLID completo em TypeScript — exemplo real de sistema de pagamentos',
        description: 'Implementação de sistema de cobrança aplicando todos os 5 princípios juntos, de forma progressiva',
        language: 'typescript',
        code: `// ---- S: SRP — separação de responsabilidades ----

// ANTES: God class
class OrderProcessor {
  validateOrder(o: Order) { /* ... */ }
  calculateDiscount(o: Order): number { /* ... */ }
  chargeCard(o: Order): boolean { /* ... */ }
  sendConfirmation(o: Order): void { /* ... */ }
  saveToDb(o: Order): void { /* ... */ }
}

// DEPOIS: cada classe tem um ator
class OrderValidator    { validate(o: Order): void {} }
class DiscountEngine    { calculate(o: Order): number { return 0 } }
class PaymentGateway    { charge(amount: number): boolean { return true } }
class OrderNotifier     { notify(email: string): void {} }
class OrderRepository   { save(o: Order): void {} }

// ---- O: OCP — Strategy para extensão sem modificação ----

interface DiscountStrategy {
  apply(total: number): number
}
class PercentageDiscount implements DiscountStrategy {
  constructor(private pct: number) {}
  apply(total: number) { return total * (1 - this.pct / 100) }
}
class FixedDiscount implements DiscountStrategy {
  constructor(private amount: number) {}
  apply(total: number) { return Math.max(0, total - this.amount) }
}
// Adicionar VIPDiscount? Nova classe. Zero modificação em DiscountEngine.

// ---- L: LSP — hierarquia honesta ----

interface Notifier { send(to: string, msg: string): void }
class EmailNotifier implements Notifier { send(to, msg) {} }
class SmsNotifier   implements Notifier { send(to, msg) {} }
// Sem herança profunda — cada um implementa Notifier de forma honesta

// ---- I: ISP — interfaces segregadas ----

interface OrderReader  { findById(id: string): Order | null }
interface OrderWriter  { save(order: Order): void }
interface OrderQuerier { findPending(): Order[] }

class SqlOrderRepository implements OrderReader, OrderWriter, OrderQuerier {
  findById(id) { return null }
  save(order) {}
  findPending() { return [] }
}
// CheckoutUseCase recebe só OrderWriter — não depende de findPending

// ---- D: DIP — depende de abstração, não de detalhe ----

interface IPaymentGateway { charge(amount: number): Promise<boolean> }
interface IOrderRepo       { save(o: Order): Promise<void> }

class PlaceOrderUseCase {
  constructor(
    private payment: IPaymentGateway,  // interface — não StripeClient
    private repo: IOrderRepo,          // interface — não PrismaClient
    private discount: DiscountStrategy,
    private notifier: Notifier,
  ) {}

  async exec(order: Order, email: string) {
    const finalAmount = this.discount.apply(order.total)
    const paid = await this.payment.charge(finalAmount)
    if (!paid) throw new Error('Pagamento falhou')
    await this.repo.save(order)
    this.notifier.send(email, 'Pedido confirmado!')
  }
}

// Composition root — único lugar com new concreto
const useCase = new PlaceOrderUseCase(
  new StripeGateway(),       // implements IPaymentGateway
  new PrismaOrderRepo(),     // implements IOrderRepo
  new PercentageDiscount(10),
  new EmailNotifier(),
)`,
      },
      {
        title: 'Detectar violação SOLID em code review — checklist prático',
        description: 'Padrões que você vê em PRs que sinalizam violação, com código antes e depois',
        language: 'typescript',
        code: `// ---- CHEIROS DE VIOLAÇÃO EM PR ----

// 1. Construtor com >5 deps → SRP violado
class BadService {
  constructor(
    private db: Database,
    private mailer: Mailer,
    private logger: Logger,
    private cache: Cache,
    private validator: Validator,
    private pdfGen: PdfGenerator,  // 6ª dep → alarme
    private sms: SmsSender,         // 7ª → certeza de God class
  ) {}
}

// 2. switch/if por 'type' → OCP violado
function processPayment(method: string, amount: number) {
  if (method === 'pix')    { /* ... */ }
  if (method === 'boleto') { /* ... */ }
  if (method === 'card')   { /* ... */ }
  // se chegou novo método → edita aqui → OCP violado
}

// 3. Subclasse com throw/não-implementado → LSP violado
class EncryptedDoc extends Document {
  extractText(): string {
    throw new Error('Não suportado')  // LSP violado
  }
}

// 4. Interface usada parcialmente → ISP violado
interface IGodRepo {
  findById(id: string): User
  findAll(): User[]
  save(u: User): void
  delete(id: string): void
  exportCsv(): string      // login service não usa isso
  syncCrm(): void          // login service não usa isso
  rebuildIndex(): void     // login service não usa isso
}
class LoginService {
  constructor(private repo: IGodRepo) {}
  // só usa findById — acoplado desnecessariamente a 6 métodos extras
}

// 5. New concreto em camada de negócio → DIP violado
class OrderService {
  private db = new PostgresClient({ host: 'localhost' })  // DIP violado
  private mail = new NodemailerClient()                   // DIP violado
}`,
      },
      {
        title: 'Strategy pattern — extensão real de formatadores de relatório',
        description: 'OCP via Strategy em caso real de múltiplos formatos de exportação',
        language: 'typescript',
        code: `// Contexto: sistema que exporta relatórios em múltiplos formatos
// Sem OCP: switch cresce a cada formato novo
// Com OCP: adicionar XML/Markdown é criar nova classe

interface ReportFormatter {
  format(data: ReportData): string
  mimeType(): string
  extension(): string
}

class CsvFormatter implements ReportFormatter {
  format(data: ReportData) {
    const header = Object.keys(data.rows[0]).join(',')
    const rows = data.rows.map(r => Object.values(r).join(','))
    return [header, ...rows].join('\\n')
  }
  mimeType() { return 'text/csv' }
  extension() { return 'csv' }
}

class JsonFormatter implements ReportFormatter {
  format(data: ReportData) { return JSON.stringify(data.rows, null, 2) }
  mimeType() { return 'application/json' }
  extension() { return 'json' }
}

class HtmlFormatter implements ReportFormatter {
  format(data: ReportData) {
    const headers = Object.keys(data.rows[0])
    const headerRow = headers.map(h => \`<th>\${h}</th>\`).join('')
    const bodyRows = data.rows.map(r =>
      \`<tr>\${Object.values(r).map(v => \`<td>\${v}</td>\`).join('')}</tr>\`
    )
    return \`<table><thead><tr>\${headerRow}</tr></thead><tbody>\${bodyRows.join('')}</tbody></table>\`
  }
  mimeType() { return 'text/html' }
  extension() { return 'html' }
}

// ReportExporter é fechado pra modificação
class ReportExporter {
  constructor(private formatter: ReportFormatter) {}

  export(data: ReportData): { content: string; mime: string; filename: string } {
    return {
      content: this.formatter.format(data),
      mime: this.formatter.mimeType(),
      filename: \`report.\${this.formatter.extension()}\`,
    }
  }
}

// Adicionar PdfFormatter? Nova classe. ReportExporter não muda.
// Dispatch via factory:
const formatters: Record<string, ReportFormatter> = {
  csv:  new CsvFormatter(),
  json: new JsonFormatter(),
  html: new HtmlFormatter(),
}

// router.get('/reports/export')
function exportReport(format: string, data: ReportData) {
  const formatter = formatters[format]
  if (!formatter) throw new Error(\`Formato \${format} não suportado\`)
  return new ReportExporter(formatter).export(data)
}`,
      },
    ],
    mindmap: {
      title: 'SOLID — Mapa de conceitos e relações',
      html: `<div style="background:#0f172a;padding:32px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .so-mm{display:grid;grid-template-columns:1fr 180px 1fr;grid-template-rows:auto auto auto;gap:14px;align-items:start}
    .so-center{grid-column:2;grid-row:2;background:radial-gradient(circle,rgba(99,102,241,.45),rgba(99,102,241,.2));border:2px solid #6366F1;border-radius:50%;width:180px;height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-weight:700;font-size:13px;color:#fff;letter-spacing:.5px}
    .so-node{background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.3);border-radius:10px;padding:12px 14px}
    .so-node-title{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:#a5b4fc;margin-bottom:6px;letter-spacing:.5px}
    .so-node-items{font-size:11px;color:#cbd5e1;line-height:1.7}
    .so-node-items li{list-style:none;padding:2px 0;padding-left:12px;position:relative}
    .so-node-items li::before{content:'→';position:absolute;left:0;color:#6366F1}
    .so-col{display:flex;flex-direction:column;gap:14px}
    .so-connector{display:flex;align-items:center;justify-content:center;color:#6366F1;font-size:20px;font-weight:700;grid-row:2}
    .so-bottom{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:4px}
    .so-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-family:'JetBrains Mono',monospace;background:rgba(99,102,241,.2);color:#a5b4fc;margin-bottom:6px}
  </style>
  <div style="text-align:center;margin-bottom:22px">
    <div style="font-size:16px;font-weight:700;color:#a5b4fc">SOLID — MAPA DE CONCEITOS</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:4px">Relações entre princípios, padrões e objetivos</div>
  </div>
  <div class="so-mm">
    <div class="so-col" style="grid-column:1;grid-row:1/4">
      <div class="so-node">
        <div class="so-node-title">S — SRP</div>
        <ul class="so-node-items">
          <li>Um ator → uma classe</li>
          <li>Pergunte "quem pede mudança?"</li>
          <li>Quebra God class</li>
          <li>Use case orquestra partes</li>
        </ul>
      </div>
      <div class="so-node">
        <div class="so-node-title">O — OCP</div>
        <ul class="so-node-items">
          <li>Extensão via polimorfismo</li>
          <li>Strategy pattern canônico</li>
          <li>Fecha pra modificação</li>
          <li>Plugin architecture</li>
        </ul>
      </div>
      <div class="so-node">
        <div class="so-node-title">L — LSP</div>
        <ul class="so-node-items">
          <li>Subclasse honra contrato</li>
          <li>Sem throw em método herdado</li>
          <li>Composição sobre herança</li>
          <li>Hierarquia honesta</li>
        </ul>
      </div>
    </div>

    <div class="so-connector" style="grid-column:1;grid-row:2">→</div>
    <div class="so-center" style="grid-column:2;grid-row:2">
      <div style="font-size:22px;letter-spacing:3px">SOLID</div>
      <div style="font-size:10px;color:#c7d2fe;margin-top:6px;font-weight:400;line-height:1.5">Coesão Alta<br>Acoplamento Baixo</div>
    </div>
    <div class="so-connector" style="grid-column:3;grid-row:2">←</div>

    <div class="so-col" style="grid-column:3;grid-row:1/4">
      <div class="so-node">
        <div class="so-node-title">I — ISP</div>
        <ul class="so-node-items">
          <li>Interfaces pequenas</li>
          <li>Cliente depende do que usa</li>
          <li>Capabilities separadas</li>
          <li>Facilita mock em teste</li>
        </ul>
      </div>
      <div class="so-node">
        <div class="so-node-title">D — DIP</div>
        <ul class="so-node-items">
          <li>Abstração no domínio</li>
          <li>Detalhe implementa</li>
          <li>Habilita teste isolado</li>
          <li>DI é técnica de impl.</li>
        </ul>
      </div>
      <div class="so-node">
        <div class="so-node-title">Complementos</div>
        <ul class="so-node-items">
          <li>Tell Don't Ask</li>
          <li>Composition over Inheritance</li>
          <li>YAGNI antes de SOLID</li>
          <li>Law of Demeter</li>
        </ul>
      </div>
    </div>

    <div class="so-bottom">
      <div class="so-node">
        <div class="so-badge">PADRÕES</div>
        <div class="so-node-title">Design Patterns que implementam</div>
        <ul class="so-node-items">
          <li>Strategy → OCP</li>
          <li>Factory → OCP+DIP</li>
          <li>Decorator → OCP+SRP</li>
          <li>Adapter → DIP</li>
          <li>Observer → OCP+SRP</li>
        </ul>
      </div>
      <div class="so-node">
        <div class="so-badge">ARQUITETURA</div>
        <div class="so-node-title">SOLID como fundação</div>
        <ul class="so-node-items">
          <li>Clean Arch → DIP em camadas</li>
          <li>DDD → SRP por aggregate</li>
          <li>Hexagonal → DIP na borda</li>
          <li>CQRS → SRP em modelo</li>
        </ul>
      </div>
      <div class="so-node">
        <div class="so-badge">ANTI-PATTERNS</div>
        <div class="so-node-title">Violações comuns</div>
        <ul class="so-node-items">
          <li>God Class → viola SRP</li>
          <li>Switch por tipo → viola OCP</li>
          <li>NotImpl em herança → viola LSP</li>
          <li>Fat interface → viola ISP</li>
          <li>New concreto no core → viola DIP</li>
        </ul>
      </div>
    </div>
  </div>
</div>`,
      caption: 'SOLID gera coesão alta e acoplamento baixo. Cada princípio ataca um tipo específico de rigidez. Aplicados juntos formam a base de Clean Architecture e DDD.',
    },
  },

  'clean-architecture': {
    tagline: 'Separar regra de negócio de framework, banco e UI via camadas concêntricas com dependency rule.',
    why: 'Sênior precisa defender por que vale o custo de Clean Arch num projeto e quando é exagero. Entrevistador testa se você entende a dependency rule e o papel de cada camada, ou se apenas decorou nomes (entity, use case, gateway, presenter). Aplicar mal gera over-engineering monstruoso — pasta cheia de mapper sem ganho real. Aplicar bem gera código que sobrevive a 5 anos de mudança de framework, banco e produto sem reescrever núcleo.',
    prerequisite: 'SOLID dominado (especialmente DIP e SRP), conforto com TypeScript/Node ou linguagem OO equivalente, ter sentido a dor de testar regra de negócio acoplada a Express/Prisma. Ajuda muito ter feito ao menos um projeto onde precisou trocar ORM ou framework — só assim o ganho fica concreto.',
    summary: 'Clean Architecture (Robert Martin, 2017) propõe quatro camadas concêntricas: Entities (regra de negócio empresarial pura), Use Cases (regra de aplicação — orquestração), Interface Adapters (controllers, presenters, gateways/repositories) e Frameworks & Drivers (Express, Postgres, React, AWS SDK). A regra única e absoluta é a Dependency Rule: o código-fonte de uma camada interna NUNCA pode depender de qualquer coisa de uma camada externa. Setas de dependência sempre apontam pra dentro.\n\nNa prática, isso significa: o use case define interface IUserRepository no domínio; o adapter de infra (PostgresUserRepository) implementa essa interface. Quando o use case precisa salvar, ele chama a interface — não conhece Postgres, não importa pg, não tem decorator de ORM. Inversão concluída via DIP. O ganho: você troca Postgres por Mongo mexendo só no adapter; troca Express por Fastify mexendo só no controller; testa use case com fake repo em milissegundos.\n\nO custo é boilerplate. CRUD simples vira 4-5 arquivos por feature: entity, use case, repo interface, repo impl, controller, mapper, DTO. Em projeto trivial é teatro arquitetural — 80% do código é tradução. Clean Arch paga em sistema com regra de negócio rica, vida longa (5+ anos), time grande, ou previsão concreta de troca de tecnologia. Em landing page com formulário, MVC simples ganha. Sênior bom defende ambas as escolhas com argumento de contexto, não de gosto.',
    howToStudy: '<strong>Tem 30 minutos antes de uma entrevista?</strong> Decora as 4 camadas em ordem (Entities → Use Cases → Adapters → Frameworks) e a Dependency Rule. Sabe explicar o que vive em cada camada e dar 1 exemplo. Faça as Q&As de nível pleno.<br><br><strong>Tem um fim de semana?</strong> Lê o capítulo "Clean Architecture" do livro homônimo (caps. 21-23 são o coração). Implementa 1 use case completo (CreateOrder) com domain entity, use case interactor, repo interface, Prisma adapter e controller HTTP. Sente o boilerplate na pele.<br><br><strong>Tem uma semana?</strong> Faz um projeto NestJS aplicando Clean Arch por feature (não por camada). Configura eslint-plugin-boundaries pra bloquear import errado. Escreve testes que NÃO sobem framework — se subir, vazou. Compara com Hexagonal e Onion pra entender que são variações do mesmo princípio.<br><br><strong>Modelo mental central:</strong> dependência sempre aponta pra dentro. Domínio é o coração — não conhece banco, não conhece HTTP, não conhece ninguém. O mundo externo se adapta a ele via interfaces que o domínio define.',
    diagrams: [
      {
        title: 'Camadas concêntricas — Dependency Rule visual',
        html: `<div style="background:#0f172a;padding:36px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .ca-circles{position:relative;width:100%;max-width:560px;margin:0 auto;aspect-ratio:1/1}
    .ca-ring{position:absolute;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;font-family:'JetBrains Mono',monospace;font-weight:700;letter-spacing:1px;text-transform:uppercase}
    .ca-r4{inset:0;background:linear-gradient(135deg,rgba(99,102,241,.04),rgba(99,102,241,.02));border:1px solid rgba(99,102,241,.25);font-size:11px;color:#94a3b8;align-items:flex-start;padding-top:10px}
    .ca-r3{inset:14%;background:linear-gradient(135deg,rgba(99,102,241,.08),rgba(99,102,241,.04));border:1px solid rgba(99,102,241,.4);font-size:11px;color:#a5b4fc;align-items:flex-start;padding-top:14px}
    .ca-r2{inset:30%;background:linear-gradient(135deg,rgba(99,102,241,.14),rgba(99,102,241,.08));border:1px solid rgba(99,102,241,.55);font-size:11px;color:#c7d2fe;align-items:flex-start;padding-top:14px}
    .ca-r1{inset:46%;background:radial-gradient(circle,rgba(99,102,241,.35),rgba(99,102,241,.18));border:1.5px solid rgba(99,102,241,.8);font-size:12px;color:#fff}
    .ca-arrows{position:absolute;inset:0;pointer-events:none}
    .ca-arr{position:absolute;color:#6366F1;font-size:18px;animation:ca-pulse 2.5s ease-in-out infinite}
    @keyframes ca-pulse{0%,100%{opacity:.4}50%{opacity:1}}
    .ca-legend{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:32px}
    .ca-card{background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.2);border-left:3px solid #6366F1;border-radius:8px;padding:12px 14px}
    .ca-card-title{font-size:11px;font-weight:700;color:#a5b4fc;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;font-family:'JetBrains Mono',monospace}
    .ca-card-content{font-size:11px;color:#cbd5e1;line-height:1.6}
    .ca-card-content code{background:rgba(0,0,0,.3);color:#86efac;padding:1px 5px;border-radius:3px;font-size:10px}
    .ca-rule{margin-top:18px;padding:14px 18px;background:linear-gradient(90deg,rgba(99,102,241,.22),rgba(99,102,241,.06));border-radius:10px;border-left:4px solid #6366F1;text-align:center}
  </style>

  <div style="text-align:center;margin-bottom:24px">
    <div style="font-size:16px;font-weight:700;color:#a5b4fc;letter-spacing:.5px">CLEAN ARCHITECTURE — DEPENDENCY RULE</div>
    <div style="font-size:12px;color:#94a3b8;margin-top:6px">Setas SEMPRE apontam pra dentro. Camada interna não conhece a externa.</div>
  </div>

  <div class="ca-circles">
    <div class="ca-ring ca-r4">FRAMEWORKS & DRIVERS</div>
    <div class="ca-ring ca-r3">INTERFACE ADAPTERS</div>
    <div class="ca-ring ca-r2">USE CASES</div>
    <div class="ca-ring ca-r1">ENTITIES</div>
    <div class="ca-arrows">
      <div class="ca-arr" style="top:50%;left:8%">→</div>
      <div class="ca-arr" style="top:50%;right:8%;transform:rotate(180deg)">→</div>
      <div class="ca-arr" style="top:8%;left:50%;transform:rotate(90deg)">→</div>
      <div class="ca-arr" style="bottom:8%;left:50%;transform:rotate(-90deg)">→</div>
    </div>
  </div>

  <div class="ca-legend">
    <div class="ca-card">
      <div class="ca-card-title">1 — Entities (centro)</div>
      <div class="ca-card-content">Regra de negócio empresarial. Pura, sem framework. <code>Order</code> sabe calcular total e validar invariantes. Imports: zero externos.</div>
    </div>
    <div class="ca-card">
      <div class="ca-card-title">2 — Use Cases</div>
      <div class="ca-card-content">Regra de aplicação. Orquestram entities + ports. <code>CreateOrderUseCase</code>, <code>ApprovePayment</code>. Definem interfaces de gateway.</div>
    </div>
    <div class="ca-card">
      <div class="ca-card-title">3 — Interface Adapters</div>
      <div class="ca-card-content">Tradução entre core e mundo. Controllers, presenters, gateways. <code>HttpOrderController</code>, <code>PrismaOrderRepo</code>.</div>
    </div>
    <div class="ca-card">
      <div class="ca-card-title">4 — Frameworks & Drivers</div>
      <div class="ca-card-content">Detalhe — Express, Postgres, React, AWS SDK, Prisma. Plugáveis. Trocar não toca camadas internas.</div>
    </div>
  </div>

  <div class="ca-rule">
    <div style="font-size:11px;color:#a5b4fc;font-weight:700;letter-spacing:.5px;font-family:'JetBrains Mono',monospace;margin-bottom:6px">DEPENDENCY RULE</div>
    <div style="font-size:13px;color:#fff;line-height:1.6">"Source code dependencies must point only inward, toward higher-level policies."</div>
    <div style="font-size:11px;color:#cbd5e1;margin-top:6px">— Robert C. Martin, <em>Clean Architecture</em> (2017)</div>
  </div>
</div>`,
        caption: 'Quatro camadas, uma regra: dependência sempre aponta pra dentro. Entities é o coração — não conhece ninguém. Frameworks é a borda — pluggable. Inversão acontece via interface definida no core.',
      },
      {
        title: 'Estrutura de projeto NestJS implementando Clean Architecture',
        html: `<div style="background:#0f172a;padding:32px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .ca-tree{font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.7;color:#cbd5e1}
    .ca-tree-row{display:flex;align-items:flex-start;gap:6px;padding:2px 0}
    .ca-tree-row:hover{background:rgba(99,102,241,.06);border-radius:4px}
    .ca-folder{color:#a5b4fc;font-weight:700}
    .ca-file{color:#cbd5e1}
    .ca-comment{color:#64748b;font-size:11px;font-style:italic;margin-left:auto;padding-left:14px}
    .ca-domain{border-left:3px solid #6366F1;padding-left:8px}
    .ca-app{border-left:3px solid #4ade80;padding-left:8px}
    .ca-infra{border-left:3px solid #f59e0b;padding-left:8px}
    .ca-pres{border-left:3px solid #ef4444;padding-left:8px}
    .ca-section{margin-bottom:18px}
    .ca-section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,.08)}
    .ca-rules{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}
    .ca-rule-box{padding:12px 14px;background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.2);border-radius:8px;font-size:11px;line-height:1.6;color:#cbd5e1}
    .ca-rule-box b{color:#a5b4fc}
    .ca-allow{border-left:3px solid #4ade80}
    .ca-deny{border-left:3px solid #ef4444}
  </style>

  <div style="text-align:center;margin-bottom:22px">
    <div style="font-size:16px;font-weight:700;color:#a5b4fc">ESTRUTURA POR FEATURE — NestJS + Clean Arch</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:4px">Pasta espelha a regra de dependência. Cada cor = uma camada.</div>
  </div>

  <div class="ca-tree">
    <div class="ca-section">
      <div class="ca-section-title" style="color:#6366F1">▼ src/order/domain/  <span style="color:#94a3b8;font-weight:400;font-style:italic;text-transform:none;letter-spacing:0">— camada interna, sem deps externas</span></div>
      <div class="ca-domain">
        <div class="ca-tree-row"><span class="ca-folder">📁 entities/</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">order.entity.ts</span><span class="ca-comment">classe pura: total(), addItem(), invariantes</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">order-item.entity.ts</span></div>
        <div class="ca-tree-row"><span class="ca-folder">📁 value-objects/</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">money.vo.ts</span><span class="ca-comment">imutável: add(), convert()</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">cpf.vo.ts</span></div>
        <div class="ca-tree-row"><span class="ca-folder">📁 errors/</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">order-not-paid.error.ts</span></div>
      </div>
    </div>

    <div class="ca-section">
      <div class="ca-section-title" style="color:#4ade80">▼ src/order/application/  <span style="color:#94a3b8;font-weight:400;font-style:italic;text-transform:none;letter-spacing:0">— use cases + ports</span></div>
      <div class="ca-app">
        <div class="ca-tree-row"><span class="ca-folder">📁 use-cases/</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">create-order.usecase.ts</span><span class="ca-comment">recebe IOrderRepo + IPaymentGw via construtor</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">approve-payment.usecase.ts</span></div>
        <div class="ca-tree-row"><span class="ca-folder">📁 ports/  <span style="color:#94a3b8;font-style:italic;font-weight:400">(interfaces — domain define, infra implementa)</span></span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">order-repository.port.ts</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">payment-gateway.port.ts</span></div>
        <div class="ca-tree-row"><span class="ca-folder">📁 dto/</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">create-order.input.ts</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">create-order.output.ts</span></div>
      </div>
    </div>

    <div class="ca-section">
      <div class="ca-section-title" style="color:#f59e0b">▼ src/order/infrastructure/  <span style="color:#94a3b8;font-weight:400;font-style:italic;text-transform:none;letter-spacing:0">— adapters concretos</span></div>
      <div class="ca-infra">
        <div class="ca-tree-row"><span class="ca-folder">📁 repositories/</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">prisma-order.repository.ts</span><span class="ca-comment">implements IOrderRepo via Prisma Client</span></div>
        <div class="ca-tree-row"><span class="ca-folder">📁 gateways/</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">stripe-payment.gateway.ts</span><span class="ca-comment">implements IPaymentGw via Stripe SDK</span></div>
        <div class="ca-tree-row"><span class="ca-folder">📁 mappers/</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">order.mapper.ts</span><span class="ca-comment">domain ↔ Prisma model</span></div>
      </div>
    </div>

    <div class="ca-section">
      <div class="ca-section-title" style="color:#ef4444">▼ src/order/presentation/  <span style="color:#94a3b8;font-weight:400;font-style:italic;text-transform:none;letter-spacing:0">— controllers HTTP</span></div>
      <div class="ca-pres">
        <div class="ca-tree-row"><span class="ca-folder">📁 controllers/</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">order.controller.ts</span><span class="ca-comment">@Post → invoca CreateOrderUseCase</span></div>
        <div class="ca-tree-row"><span class="ca-folder">📁 dto/  <span style="color:#94a3b8;font-style:italic;font-weight:400">(request/response HTTP)</span></span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">create-order.request.dto.ts</span></div>
        <div class="ca-tree-row" style="margin-left:20px"><span class="ca-file">order.response.dto.ts</span></div>
        <div class="ca-tree-row"><span class="ca-file">order.module.ts</span><span class="ca-comment">composition root: providers wireup</span></div>
      </div>
    </div>
  </div>

  <div class="ca-rules">
    <div class="ca-rule-box ca-allow">
      <b style="color:#86efac">PERMITIDO</b><br>
      • application importa domain<br>
      • infrastructure importa application + domain<br>
      • presentation importa application<br>
      • module wireup tudo (composition root)
    </div>
    <div class="ca-rule-box ca-deny">
      <b style="color:#fca5a5">PROIBIDO</b><br>
      • domain importa Prisma, Express, Stripe<br>
      • application importa Prisma, Express<br>
      • domain importa application/infrastructure<br>
      • use case importa controller
    </div>
  </div>

  <div style="margin-top:14px;padding:12px 16px;background:rgba(99,102,241,.08);border-radius:8px;border-left:3px solid #6366F1;font-size:11px;color:#cbd5e1;line-height:1.7">
    <b style="color:#a5b4fc">Pasta por feature, não por camada:</b> evita "todos os controllers numa pasta" — esconde acoplamento entre features. Pasta por feature mostra bounded context na estrutura.
  </div>
</div>`,
        caption: 'Estrutura por feature reflete bounded context. Cada cor é uma camada com regra de import específica. eslint-plugin-boundaries automatiza enforcement.',
      },
      {
        title: 'Dependency Inversion em ação — UseCase ↔ Repository',
        html: `<div style="background:#0f172a;padding:32px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .di-flow{display:grid;grid-template-columns:1fr 80px 1fr;gap:14px;align-items:center}
    .di-card{background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.25);border-radius:10px;padding:14px 16px}
    .di-domain{border-color:rgba(99,102,241,.55);background:rgba(99,102,241,.1)}
    .di-infra{border-color:rgba(245,158,11,.4);background:rgba(245,158,11,.06)}
    .di-title{font-size:11px;font-weight:700;color:#a5b4fc;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;font-family:'JetBrains Mono',monospace}
    .di-infra .di-title{color:#fbbf24}
    .di-code{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.7;color:#cbd5e1;background:rgba(0,0,0,.35);padding:10px 12px;border-radius:6px;white-space:pre}
    .di-arrow{display:flex;flex-direction:column;align-items:center;font-size:13px;color:#6366F1;font-weight:700}
    .di-impl{padding:3px 8px;background:rgba(99,102,241,.2);border-radius:4px;font-size:10px;font-family:'JetBrains Mono',monospace;margin-top:4px;color:#a5b4fc}
    .di-bottom{margin-top:24px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
    .di-benefit{padding:12px 14px;background:rgba(99,102,241,.05);border:1px solid rgba(99,102,241,.18);border-radius:8px;text-align:center;font-size:11px;color:#cbd5e1;line-height:1.5}
    .di-benefit-icon{font-size:18px;margin-bottom:6px}
  </style>

  <div style="text-align:center;margin-bottom:22px">
    <div style="font-size:16px;font-weight:700;color:#a5b4fc">DEPENDENCY INVERSION — INTERFACE NO DOMAIN, IMPL NA INFRA</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:4px">Domínio define o contrato. Infra implementa. Composition root liga.</div>
  </div>

  <div class="di-flow">
    <div class="di-card di-domain">
      <div class="di-title">DOMAIN — define a interface</div>
<pre class="di-code">// application/ports/
// order-repository.port.ts

export interface IOrderRepository {
  save(order: Order): Promise&lt;void&gt;
  findById(id: string): Promise&lt;Order | null&gt;
}

// application/use-cases/
// create-order.usecase.ts

export class CreateOrderUseCase {
  constructor(
    private repo: IOrderRepository
  ) {}

  async exec(input: CreateOrderInput) {
    const order = Order.create(input)
    await this.repo.save(order)
    return order
  }
}</pre>
      <div style="font-size:11px;color:#94a3b8;margin-top:8px;line-height:1.6">
        UseCase importa apenas <code style="color:#a5b4fc">IOrderRepository</code> (interface no próprio domínio). Não conhece Prisma, não conhece Postgres.
      </div>
    </div>

    <div class="di-arrow">
      <div style="font-size:11px;color:#a5b4fc;letter-spacing:.5px;margin-bottom:6px">implements</div>
      <div style="font-size:24px">←</div>
      <div style="font-size:10px;color:#94a3b8;margin-top:6px">inversão</div>
    </div>

    <div class="di-card di-infra">
      <div class="di-title">INFRA — implementa concreto</div>
<pre class="di-code">// infrastructure/repositories/
// prisma-order.repository.ts

import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma'
import { IOrderRepository } from '../../application/ports'
import { OrderMapper } from '../mappers'

@Injectable()
export class PrismaOrderRepository
  implements IOrderRepository {

  constructor(private prisma: PrismaService) {}

  async save(order: Order): Promise&lt;void&gt; {
    const data = OrderMapper.toPersistence(order)
    await this.prisma.order.create({ data })
  }

  async findById(id: string) {
    const row = await this.prisma.order.findUnique({ where: { id } })
    return row ? OrderMapper.toDomain(row) : null
  }
}</pre>
      <div style="font-size:11px;color:#94a3b8;margin-top:8px;line-height:1.6">
        Adapter importa Prisma e implementa contrato do domínio. Sentido da seta: <b style="color:#fbbf24">infra → domain</b>.
      </div>
    </div>
  </div>

  <div style="margin-top:18px;padding:14px 18px;background:linear-gradient(90deg,rgba(99,102,241,.18),rgba(99,102,241,.04));border-radius:8px;border-left:3px solid #6366F1">
    <div style="font-size:11px;color:#a5b4fc;font-weight:700;letter-spacing:.5px;margin-bottom:6px;font-family:'JetBrains Mono',monospace">COMPOSITION ROOT (NestJS module)</div>
<pre class="di-code" style="margin:0;background:rgba(0,0,0,.3)">@Module({
  providers: [
    CreateOrderUseCase,
    { provide: 'IOrderRepository', useClass: PrismaOrderRepository },
    // troca pra MongoOrderRepository sem tocar UseCase
    // troca pra InMemoryOrderRepository em teste e2e
  ],
})
export class OrderModule {}</pre>
  </div>

  <div class="di-bottom">
    <div class="di-benefit">
      <div class="di-benefit-icon" style="color:#4ade80">✓</div>
      <b style="color:#86efac">Testabilidade</b><br>
      <span style="color:#94a3b8">Use case com fake repo: testes em ms, sem Postgres, sem container</span>
    </div>
    <div class="di-benefit">
      <div class="di-benefit-icon" style="color:#4ade80">✓</div>
      <b style="color:#86efac">Troca de tecnologia</b><br>
      <span style="color:#94a3b8">Postgres → Mongo: muda só infra/repositories, domain intacto</span>
    </div>
    <div class="di-benefit">
      <div class="di-benefit-icon" style="color:#4ade80">✓</div>
      <b style="color:#86efac">Foco em regra</b><br>
      <span style="color:#94a3b8">UseCase fica curto e focado — sem ruído de SQL/HTTP</span>
    </div>
  </div>
</div>`,
        caption: 'Inversão concluída: domínio define contrato; infra obedece. Composition root no module faz o wireup. Trocar implementação não toca camada interna.',
      },
    ],
    keypoints: [
      {
        title: 'Dependency Rule — a regra única',
        body: 'Setas de dependência sempre apontam pra dentro. Camada externa pode importar interna; interna NUNCA importa externa. Use case não importa Postgres, importa interface IOrderRepository (do próprio domínio). Adapter de infra implementa essa interface. Inversão via DIP. Se o linter permite import de Prisma no domain, sua arquitetura está vazando.',
        code: `// ✓ PERMITIDO — domain define abstração
// application/ports/order-repo.port.ts
export interface IOrderRepository {
  save(order: Order): Promise<void>
}

// ✓ PERMITIDO — application orquestra
// application/use-cases/create-order.usecase.ts
import { IOrderRepository } from '../ports'
export class CreateOrderUseCase {
  constructor(private repo: IOrderRepository) {}
}

// ✓ PERMITIDO — infra depende de application/domain
// infrastructure/repositories/prisma-order.repo.ts
import { IOrderRepository } from '../../application/ports'
import { PrismaClient } from '@prisma/client'

// ✗ PROIBIDO — domain importando infra
// application/use-cases/create-order.usecase.ts
import { PrismaClient } from '@prisma/client'  // ← VAZAMENTO`,
      },
      {
        title: 'Entities — regra de negócio empresarial pura',
        body: 'Entities encapsulam regras que valem pra empresa toda, independente de aplicação. Order sabe calcular total, validar invariantes ("total > 0", "ao menos 1 item"), aplicar desconto. Não conhece banco, não conhece HTTP, não tem decorator de ORM. Métodos retornam novo state ou jogam erro de domínio. Funcionam com ou sem framework. Idealmente puras (sem IO).',
        code: `// domain/entities/order.entity.ts — pura, sem ORM
export class Order {
  private constructor(
    public readonly id: string,
    private items: OrderItem[],
    private status: OrderStatus,
  ) {}

  static create(input: CreateOrderInput): Order {
    if (input.items.length === 0) {
      throw new EmptyOrderError()
    }
    return new Order(crypto.randomUUID(), input.items, 'pending')
  }

  total(): Money {
    return this.items.reduce(
      (sum, item) => sum.add(item.subtotal()),
      Money.zero('BRL'),
    )
  }

  pay() {
    if (this.status !== 'pending') throw new InvalidStateError()
    this.status = 'paid'
  }
}`,
      },
      {
        title: 'Use Cases — orquestram entities + ports',
        body: 'Use cases são a regra de aplicação — descrevem operações da aplicação ("CreateOrder", "ApprovePayment", "GenerateMonthlyReport"). Recebem input DTO, chamam entities, invocam gateways via interface (port), retornam output DTO. Cada use case é uma classe com método único exec/execute. Recebem dependências via construtor (DIP). São o "verbo" do sistema.',
        code: `// application/use-cases/create-order.usecase.ts
import { IOrderRepository, IPaymentGateway } from '../ports'
import { Order } from '../../domain/entities'

export class CreateOrderUseCase {
  constructor(
    private repo: IOrderRepository,
    private payments: IPaymentGateway,
  ) {}

  async exec(input: CreateOrderInput): Promise<CreateOrderOutput> {
    const order = Order.create(input)         // domain rule
    const charge = await this.payments.charge(order.total())
    if (!charge.ok) throw new PaymentFailedError()
    order.pay()
    await this.repo.save(order)               // port — interface
    return { id: order.id, total: order.total().value }
  }
}`,
      },
      {
        title: 'Interface Adapters — controllers, presenters, gateways',
        body: 'Adapters traduzem entre o core e o mundo externo. Controller HTTP transforma JSON em DTO de use case e a saída em response. Presenter formata pra UI específica. Gateway/Repository implementa interface do domínio usando ORM/SDK concreto. Mapper converte entre domain entity e modelo de persistência. Aqui mora o ORM, o framework, o SDK — não no core.',
        code: `// presentation/controllers/order.controller.ts
@Controller('orders')
export class OrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  async create(@Body() body: CreateOrderRequestDTO) {
    const result = await this.createOrder.exec({
      customerId: body.customerId,
      items: body.items.map(i => ({ sku: i.sku, qty: i.qty })),
    })
    return { orderId: result.id, total: result.total }  // response DTO
  }
}

// infrastructure/repositories/prisma-order.repo.ts
@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}
  async save(order: Order) {
    const data = OrderMapper.toPersistence(order)
    await this.prisma.order.create({ data })
  }
}`,
      },
      {
        title: 'Frameworks & Drivers — detalhes plugáveis',
        body: 'Express, NestJS, Postgres, Mongo, React, Stripe SDK — tudo "detalhe". Vivem na borda externa. Você deve poder trocar Express por Fastify mexendo só nos controllers; Postgres por Mongo mexendo só nos repositories. Se trocar exige reescrever use case, sua arquitetura vazou. Frameworks NÃO são problema — usar frameworks é necessário. Problema é deixá-los infiltrar no core.',
      },
      {
        title: 'Ports & Adapters — terminologia hexagonal',
        body: 'Hexagonal Architecture (Alistair Cockburn) usa "ports" e "adapters" pra mesmo conceito. Port = interface no domínio (driving port = controller-facing; driven port = repo-facing). Adapter = implementação concreta. Onion (Jeffrey Palermo) e Clean (Uncle Bob) são variações com mesmo coração: dependency inversion na borda. Discussão de nome distrai do princípio.',
      },
      {
        title: 'Testabilidade extrema',
        body: 'Use case bem feito é testável sem subir banco, sem HTTP, sem container. Você instancia com fake/in-memory repository, chama exec(input), assert no output. Roda em milissegundos. Isso é o ganho mais tangível de Clean Arch. Integration tests cobrem adapters (Prisma repo bate Postgres real). E2E cobre fluxo completo. Pirâmide de testes invertida fica honesta.',
        code: `// teste do use case — sem framework
describe('CreateOrderUseCase', () => {
  it('cria pedido e cobra pagamento', async () => {
    const repo = new InMemoryOrderRepository()
    const payments = new FakePaymentGateway({ ok: true })
    const useCase = new CreateOrderUseCase(repo, payments)

    const out = await useCase.exec({
      customerId: 'c1',
      items: [{ sku: 'X', qty: 2, price: 100 }],
    })

    expect(out.total).toBe(200)
    expect(repo.findById(out.id)).toBeDefined()
    expect(payments.charges).toHaveLength(1)
  })  // ← roda em 5ms, sem mock complexo
})`,
      },
      {
        title: 'Mapper — domain ↔ persistence',
        body: 'ORM (Prisma, TypeORM) tem modelo próprio com decorators e tipos gerados. Domain entity é pura. Mapper converte entre os dois — toDomain(row) e toPersistence(entity). Custo: mais código. Ganho: troca de ORM mexe só no mapper. Trade-off real — em projeto pequeno, considere usar modelo do ORM como entity (acopla, mas pragmático).',
        code: `// infrastructure/mappers/order.mapper.ts
export class OrderMapper {
  static toDomain(row: PrismaOrder): Order {
    return Order.reconstitute(
      row.id,
      row.items.map(i => OrderItem.reconstitute(i.sku, i.qty)),
      row.status as OrderStatus,
    )
  }

  static toPersistence(order: Order): Prisma.OrderCreateInput {
    return {
      id: order.id,
      status: order.status,
      items: { create: order.items.map(i => ({ sku: i.sku, qty: i.qty })) },
    }
  }
}`,
      },
      {
        title: 'Pasta por feature, não por camada técnica',
        body: 'Estrutura ruim: /controllers, /services, /repositories — todos juntos. Esconde acoplamento entre features. Estrutura boa: /order/{domain,application,infrastructure,presentation}, /payment/..., /shipping/.... Cada feature/bounded context vira pasta com 4 camadas dentro. Navegar fica fácil — abrir /order vê tudo de pedido. Refatorar fica fácil — mover/remover feature toca uma pasta.',
      },
      {
        title: 'Composition Root — onde tudo se liga',
        body: 'Composition root é o lugar onde implementações concretas são registradas e injetadas. Em NestJS, é o module providers. Em projeto sem framework de DI, é o entry point (main.ts) onde você instancia tudo manualmente: const repo = new PrismaRepo(prisma); const useCase = new CreateOrder(repo). Toda a "cola" mora aqui — em todo o resto, deps vêm via construtor.',
        code: `// presentation/order.module.ts
@Module({
  imports: [PrismaModule, StripeModule],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    ApprovePaymentUseCase,
    { provide: 'IOrderRepository',  useClass: PrismaOrderRepository },
    { provide: 'IPaymentGateway',   useClass: StripePaymentGateway },
    // em teste e2e: useClass: InMemoryOrderRepository
  ],
})
export class OrderModule {}`,
      },
      {
        title: 'Custo de boilerplate — quando NÃO vale',
        body: 'CRUD trivial vira 5-7 arquivos por feature: entity, use case, port interface, repo impl, mapper, request DTO, response DTO. 80% do código é tradução. Em MVP, prototipo, projeto de 3 meses, ROI é negativo. Vale em sistema com regra de negócio rica, vida longa (5+ anos), time grande. Em landing page com formulário, MVC simples vence. Sênior bom defende ambas escolhas.',
      },
      {
        title: 'Garantir Dependency Rule na prática',
        body: 'Disciplina não basta — pessoa cansada fura regra. Use ferramenta: eslint-plugin-boundaries ou dependency-cruiser configura regras de import por pasta. CI quebra build se domain importa infra. Code review focado em imports. Integration tests do use case que NÃO sobem framework — se subiu, vazou. Esses três combinados eliminam regressão arquitetural.',
        code: `// .eslintrc.json com eslint-plugin-boundaries
{
  "settings": {
    "boundaries/elements": [
      { "type": "domain",         "pattern": "**/domain/**" },
      { "type": "application",    "pattern": "**/application/**" },
      { "type": "infrastructure", "pattern": "**/infrastructure/**" },
      { "type": "presentation",   "pattern": "**/presentation/**" }
    ]
  },
  "rules": {
    "boundaries/element-types": ["error", {
      "default": "disallow",
      "rules": [
        { "from": "domain",         "allow": [] },
        { "from": "application",    "allow": ["domain"] },
        { "from": "infrastructure", "allow": ["domain", "application"] },
        { "from": "presentation",   "allow": ["application"] }
      ]
    }]
  }
}`,
      },
      {
        title: 'Clean Arch × Hexagonal × Onion — diferenças reais',
        body: 'Hexagonal (Cockburn 2005): domínio no centro, ports nas bordas, adapters externos. Foco em I/O isolation. Onion (Palermo 2008): camadas concêntricas, dependência aponta pra dentro, similar a Clean. Clean (Martin 2017): formaliza com 4 camadas e Dependency Rule. Essência idêntica em todos: dependency inversion na borda. Diferença é vocabulário. Sênior bom não briga sobre nome — discute o princípio.',
      },
    ],
    cheatsheet: {
      title: 'Clean Architecture — camadas, regras e arquivos típicos',
      html: `<div style="background:#0f172a;padding:30px 24px;border-radius:14px;font-family:'JetBrains Mono',monospace;color:#e2e8f0;">
  <style>
    .cac-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .cac-card{background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.2);border-radius:8px;padding:14px 16px}
    .cac-title{font-size:12px;font-weight:700;color:#a5b4fc;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(99,102,241,.2)}
    .cac-row{font-size:11px;line-height:1.7;color:#cbd5e1;padding:3px 0}
    .cac-row b{color:#a5b4fc}
    .cac-row code{background:rgba(0,0,0,.3);color:#86efac;padding:1px 5px;border-radius:3px;font-size:10px}
    .cac-yes{color:#86efac}
    .cac-no{color:#fca5a5}
    .cac-banner{grid-column:1/-1;padding:12px 16px;background:linear-gradient(90deg,rgba(99,102,241,.2),rgba(99,102,241,.05));border-radius:8px;text-align:center;font-family:'Plus Jakarta Sans',sans-serif;color:#a5b4fc;font-weight:700;font-size:13px;letter-spacing:.5px}
  </style>

  <div class="cac-grid">
    <div class="cac-banner">CLEAN ARCH — REGRAS, RESPONSABILIDADES E ARQUIVOS</div>

    <div class="cac-card">
      <div class="cac-title">📜 Regras invioláveis</div>
      <div class="cac-row"><b>1.</b> Dependência aponta SEMPRE pra dentro</div>
      <div class="cac-row"><b>2.</b> Domain não importa NADA externo</div>
      <div class="cac-row"><b>3.</b> Application define interfaces; Infra implementa</div>
      <div class="cac-row"><b>4.</b> Frameworks vivem na borda externa</div>
      <div class="cac-row"><b>5.</b> Composition root liga tudo (module/main.ts)</div>
    </div>

    <div class="cac-card">
      <div class="cac-title">🎯 Domain — o coração</div>
      <div class="cac-row"><b>Vive:</b> entities, value objects, domain errors</div>
      <div class="cac-row"><b>Imports:</b> <span class="cac-yes">apenas próprio domain</span></div>
      <div class="cac-row"><b>Arquivos:</b> <code>order.entity.ts</code>, <code>money.vo.ts</code></div>
      <div class="cac-row"><b>Teste:</b> unit puro, sem mock</div>
      <div class="cac-row"><b>Pergunta:</b> "regra vale fora dessa app?"</div>
    </div>

    <div class="cac-card">
      <div class="cac-title">⚙ Application — orquestra</div>
      <div class="cac-row"><b>Vive:</b> use cases, ports, input/output DTOs</div>
      <div class="cac-row"><b>Imports:</b> <span class="cac-yes">domain</span></div>
      <div class="cac-row"><b>Arquivos:</b> <code>create-order.usecase.ts</code>, <code>order-repo.port.ts</code></div>
      <div class="cac-row"><b>Teste:</b> unit com fake adapters (ms)</div>
      <div class="cac-row"><b>Pergunta:</b> "qual a operação da aplicação?"</div>
    </div>

    <div class="cac-card">
      <div class="cac-title">🔌 Infrastructure — adapters</div>
      <div class="cac-row"><b>Vive:</b> repos concretos, gateways, mappers</div>
      <div class="cac-row"><b>Imports:</b> <span class="cac-yes">domain + application + libs externas</span></div>
      <div class="cac-row"><b>Arquivos:</b> <code>prisma-order.repo.ts</code>, <code>stripe.gateway.ts</code></div>
      <div class="cac-row"><b>Teste:</b> integration (sobe Postgres real)</div>
    </div>

    <div class="cac-card">
      <div class="cac-title">🌐 Presentation — entrada</div>
      <div class="cac-row"><b>Vive:</b> controllers HTTP, presenters, request/response</div>
      <div class="cac-row"><b>Imports:</b> <span class="cac-yes">application</span></div>
      <div class="cac-row"><b>Arquivos:</b> <code>order.controller.ts</code>, <code>order.module.ts</code></div>
      <div class="cac-row"><b>Teste:</b> e2e (sobe app)</div>
    </div>

    <div class="cac-card">
      <div class="cac-title">🚫 Anti-patterns</div>
      <div class="cac-row"><span class="cac-no">✗</span> Entity com <code>@Entity()</code> de TypeORM</div>
      <div class="cac-row"><span class="cac-no">✗</span> Use case importando <code>PrismaClient</code></div>
      <div class="cac-row"><span class="cac-no">✗</span> Controller chamando ORM direto</div>
      <div class="cac-row"><span class="cac-no">✗</span> Repo com 50 métodos custom</div>
      <div class="cac-row"><span class="cac-no">✗</span> Use case retornando entidade ORM</div>
    </div>

    <div class="cac-card">
      <div class="cac-title">✅ Quando aplicar</div>
      <div class="cac-row"><span class="cac-yes">✓</span> Domínio rico (regra fiscal, financeira)</div>
      <div class="cac-row"><span class="cac-yes">✓</span> Vida longa (5+ anos prevista)</div>
      <div class="cac-row"><span class="cac-yes">✓</span> Time grande (10+ devs)</div>
      <div class="cac-row"><span class="cac-yes">✓</span> Variação de tecnologia prevista</div>
      <div class="cac-row"><span class="cac-no">✗</span> CRUD simples, MVP, prototipo, microserviço de 1 rota</div>
    </div>

    <div class="cac-card">
      <div class="cac-title">🔧 Enforcement</div>
      <div class="cac-row"><b>Lint:</b> <code>eslint-plugin-boundaries</code></div>
      <div class="cac-row"><b>Lint alt:</b> <code>dependency-cruiser</code></div>
      <div class="cac-row"><b>CI:</b> bloqueia import vazado</div>
      <div class="cac-row"><b>Code review:</b> foco em imports</div>
      <div class="cac-row"><b>Test:</b> use case roda sem framework</div>
    </div>
  </div>
</div>`,
      caption: 'Quatro camadas, cinco regras invioláveis, três anti-patterns clássicos. Decora isso e identifica violação em qualquer PR.',
    },
    mnemonics: [
      {
        label: 'Camadas — DAUE (de fora pra dentro)',
        trick: 'Drivers → Adapters → Use cases → Entities',
        explanation: 'De fora (mais volátil, framework) pra dentro (mais estável, regra de negócio). Lembre que dependência aponta no sentido inverso da leitura: entities NUNCA importam ninguém; drivers importam todos.',
      },
      {
        label: 'Dependency Rule — "setas pra dentro"',
        trick: 'Dependency points inward',
        explanation: 'Frase original do Uncle Bob. Toda vez que ver import suspeito, pergunte: a seta está apontando pra dentro? Se domain importa infra, está apontando pra fora — vazamento.',
      },
      {
        label: 'Use case = verbo · Entity = substantivo',
        trick: 'Verbo (use case) age sobre substantivo (entity)',
        explanation: 'Ajuda decidir onde colocar lógica. CreateOrder, ApprovePayment, RefundOrder — verbos = use cases. Order, Customer, Money — substantivos = entities/VOs. Comportamento de domínio puro mora na entity (Order.pay()); orquestração mora no use case (ApprovePaymentUseCase invoca Order.pay() + repo + gateway).',
      },
      {
        label: 'Ports & Adapters — driving vs driven',
        trick: 'Driving entra · Driven é chamado',
        explanation: 'Driving port = lado que invoca a aplicação (controller HTTP, CLI, message consumer). Driven port = lado que a aplicação invoca (repo, gateway externo). Vocabulário de Hexagonal — ajuda visualizar que entrada e saída são igualmente "borda".',
      },
    ],
    gotchas: [
      'Entity com decorator de ORM (<code>@Entity()</code>, <code>@Column()</code>) — virou detalhe vazando pro core. Use modelo de domínio puro e mapper no adapter.',
      'Use case retornando entidade do ORM direto pro controller — quebra encapsulamento, expõe internals e acopla presentation com persistence. Use output DTO.',
      'Aplicar Clean Arch em CRUD trivial — 80% do código vira mapper/DTO/port. ROI negativo. Considere arquitetura mais leve (controller → service → repo).',
      'Repository virar God interface com 40 métodos (<code>findByEmail</code>, <code>findByDateRange</code>, <code>findByStatus</code>, ...) — quebra ISP. Divida por agregado/contexto, ou move query complexa pra read model (CQRS).',
      'Confundir Clean Arch com Hexagonal/Onion e brigar sobre nome — são primos com mesma essência (dependency inversion na borda). Discussão de nome distrai do princípio.',
      'Importar tipo do ORM (<code>Prisma.OrderCreateInput</code>) no use case — vazamento sutil que quebra trocabilidade. Use case lida só com tipos do domínio.',
      'Presenter dentro do controller — perde a separação. Controller = HTTP-aware (status code, headers); presenter = formatação de saída. Em apps simples dá pra fundir, mas saiba que está fundindo.',
      'Achar que "Clean" é categoria moral. Não é. É arquitetura com tradeoff específico — boilerplate alto em troca de testabilidade e longevidade. MVC bem feito também é "clean" em senso comum.',
    ],
    interview: [
      {
        q: 'Quando você NÃO usaria Clean Architecture?',
        level: 'pleno',
        a: '<p>CRUD simples, MVP, prototipo, microserviço de uma rota — Clean Arch vira <strong>over-engineering</strong>. O custo de boilerplate (DTO, mapper, gateway, use case, port) supera o ganho. Você gasta 80% do código em tradução, sem regra de negócio rica pra justificar.</p><p>Também evito em time pequeno sem maturidade — sem disciplina, todo mundo "fura" a regra de dependência (importa Prisma no use case, importa Express no domain) e você fica com o pior dos mundos: indireção sem isolamento real. Prefiro arquitetura em camadas simples (controller → service → repo) até sentir dor de mudança ou de teste.</p><p>Outros casos:</p><ul><li><strong>Produto pré-PMF</strong>: arquitetura muda toda semana — Clean Arch travaria pivot.</li><li><strong>Job/script de uma vez</strong>: sem domínio, sem teste, sem variação prevista.</li><li><strong>Time inexperiente</strong>: aplica errado, gera arquitetura cargo-cult com nomes bonitos sem ganho.</li></ul>',
        tip: 'Demonstrar que você sabe quando NÃO usar é mais valioso do que mostrar que sabe usar. Filtra arquitetos cargo-cult.',
      },
      {
        q: 'Como você evita que ORM "vaze" pro domínio?',
        level: 'pleno',
        a: '<p>Mantenho entidades de domínio <strong>puras</strong>: classe TypeScript sem decorator, sem herança de BaseEntity do ORM, sem método save() na própria entity. No adapter de persistência, crio modelo separado (<code>OrderRecord</code> ou tipo gerado pelo Prisma) com decorators do ORM, e um <strong>mapper</strong> que converte entre domínio e persistência.</p><p>Na prática:</p><ul><li><code>domain/entities/order.entity.ts</code> — classe pura</li><li><code>infrastructure/mappers/order.mapper.ts</code> — toDomain(prismaOrder), toPersistence(domainOrder)</li><li><code>infrastructure/repositories/prisma-order.repo.ts</code> — usa Prisma + mapper</li></ul><p>Sim, é mais código. Mas troco Prisma por TypeORM ou Mongo mexendo só no adapter de infra — domain e use cases ficam intactos. E garanto que regra de negócio não depende de detalhe de schema. <strong>Bonus de teste:</strong> use case com fake repo (in-memory Map) roda em ms.</p><p>Em projeto pequeno, considero pragmaticamente usar modelo do ORM como entity e aceitar acoplamento. Honestidade do tradeoff > pureza arquitetural.</p>',
      },
      {
        q: 'Tradeoff: Clean Arch vs MVC tradicional?',
        level: 'pleno',
        a: '<p><strong>MVC</strong>: direto, baixo custo, ótimo pra app web simples. Risco: regra de negócio espalha entre controller e model do ORM (Active Record), difícil de testar isolado, difícil de migrar framework, difícil de evoluir quando regra cresce.</p><p><strong>Clean Arch</strong>: isola regra, testa em ms, longeva. Custo: boilerplate (5+ arquivos por feature), curva de aprendizado pra quem nunca viu, exige time disciplinado.</p><p>Decisão por contexto:</p><ul><li><strong>Banco fintech, marketplace complexo, ERP</strong>: Clean Arch ganha. Regra rica + vida longa + time grande compensam custo.</li><li><strong>Landing page com formulário, blog, dashboard interno simples</strong>: MVC vence. Sem regra de negócio rica, Clean Arch é teatro.</li><li><strong>Caso intermediário (SaaS médio)</strong>: arquitetura em camadas (Controller → Service → Repo) com SOLID resolve sem virar Clean Arch completo.</li></ul><p>Critério prático que uso: <strong>tempo de vida × complexidade de regra</strong>. Acima de 3 anos com regra rica, vale Clean Arch. Abaixo, considera MVC ou camadas simples.</p>',
      },
      {
        q: 'Como você organiza pastas em Clean Arch num projeto Node?',
        level: 'pleno',
        a: '<p>Por <strong>feature</strong>, não por camada técnica. Estrutura:</p><pre><code>src/\n  order/\n    domain/        — entities, value objects\n    application/   — use cases, ports (interfaces)\n    infrastructure/— adapters (repos, gateways, mappers)\n    presentation/  — controllers HTTP\n    order.module.ts — composition root da feature\n  payment/\n    domain/...\n    application/...\n  shared/\n    kernel/        — value objects compartilhados (Money, CPF)\n    errors/        — base errors</code></pre><p>Evito a estrutura "todos controllers numa pasta, todos services em outra" — esconde acoplamento entre features e mata o conceito de bounded context na pasta. Por feature, fica óbvio o que pertence a cada contexto e refatorar (mover/extrair) feature toca uma pasta.</p><p>Em monorepo grande, considero subir um nível: <code>packages/order/</code> como pacote npm interno — isolamento físico além do lógico. Mas isso é overhead — só vale com 5+ features estáveis e time multi-squad.</p>',
      },
      {
        q: 'O que é a Dependency Rule e como você garante na prática?',
        level: 'senior',
        a: '<p>Regra: <strong>código de camada interna nunca importa código de camada externa</strong>. Use case não importa Express; entity não importa Prisma; domain não importa NADA externo.</p><p>Garanto via 4 mecanismos combinados:</p><ol><li><strong>Estrutura de pasta</strong> que reflete a regra (domain/, application/, infrastructure/, presentation/).</li><li><strong>Lint rule</strong>: <code>eslint-plugin-boundaries</code> ou <code>dependency-cruiser</code> configurado pra bloquear imports proibidos. CI quebra build se domain importa Prisma.</li><li><strong>Code review</strong> focado em imports — primeira coisa que olho num PR é a seção de imports do arquivo de domain/application.</li><li><strong>Testes do use case que NÃO sobem framework</strong> — se precisei subir NestJS pra testar use case, vazou. Use case é instanciado direto na lib de teste.</li></ol><p>Disciplina não basta — pessoa cansada fura regra. Ferramenta automatiza. Esses 4 combinados eliminam regressão arquitetural.</p>',
        tip: 'Cita ferramenta concreta (eslint-plugin-boundaries) — diferencia quem aplicou de quem leu. Mostra maturidade de produção.',
      },
      {
        q: 'Diferença entre Clean Arch, Hexagonal e Onion?',
        level: 'senior',
        a: '<p>Os três compartilham essência: <strong>dependency inversion na borda</strong>, domínio no centro, externos como detalhe.</p><ul><li><strong>Hexagonal</strong> (Cockburn 2005): vocabulário de "ports & adapters". Driving ports (entrada — controller, CLI) e driven ports (saída — repo, gateway). Foco em isolar I/O.</li><li><strong>Onion</strong> (Palermo 2008): camadas concêntricas — domain core no centro, domain services, application services, infrastructure. Dependência aponta pra dentro.</li><li><strong>Clean</strong> (Martin 2017): formaliza com 4 camadas (Entities, Use Cases, Interface Adapters, Frameworks/Drivers) e nomeia Dependency Rule.</li></ul><p>Diferença prática: vocabulário e ênfase, não estrutura. Hexagonal enfatiza I/O isolation; Onion enfatiza camadas; Clean enfatiza testability. Sênior bom não briga sobre nome — discute o princípio.</p><p>Em entrevista, se perguntarem "qual usa?", respondo: "Clean é a formulação mais conhecida hoje, mas é variação de Hexagonal. Use o que o time entende."</p>',
      },
      {
        q: 'Como evolui de monolito MVC pra Clean Arch sem reescrever?',
        level: 'senior',
        a: '<p>Estratégia incremental, nunca big bang:</p><ol><li><strong>Identifica módulo doendo</strong> — feature com regra rica + bug recorrente + teste lento. Esse é candidato natural a Clean Arch.</li><li><strong>Extrai use case</strong> — pega o controller, identifica a regra, cria UseCase classe que recebe repo via construtor. Controller agora invoca UseCase.exec().</li><li><strong>Cria interface IRepository</strong> — extrai do uso atual. Implementação concreta atual (que usa ORM direto) implementa a interface.</li><li><strong>Adiciona teste do use case</strong> com fake repo. Sente o ganho.</li><li><strong>Repete módulo a módulo</strong>. Boy scout rule.</li></ol><p>Não tenta limpar tudo de uma vez. Não cria "domain layer" vazia esperando código novo. Refatora código que dói; deixa código que funciona em paz. ROI tem que ser mensurável: tempo de teste cai, bug rate cai, tempo de mudança cai. Se não cai, está aplicando arquitetura por estética.</p><p>Joel Spolsky: rewrite é o pior erro. Strangler fig sempre.</p>',
      },
      {
        q: 'NestJS modules como bounded contexts — faz sentido?',
        level: 'senior',
        a: '<p>Faz, mas com cuidado. Module em NestJS é unidade de organização de DI providers — não é semanticamente bounded context. Você pode ter 5 modules dentro do mesmo bounded context (UserAuthModule, UserProfileModule, UserBillingModule, todos do contexto User), ou pode ter 1 module com múltiplos contexts (cargo-cult).</p><p>Boa prática que sigo:</p><ul><li><strong>1 bounded context = 1 pasta de feature</strong> (<code>src/order/</code>) com 1 module no topo.</li><li><strong>Submódulos só pra organização interna</strong> — não cria fronteira semântica.</li><li><strong>Comunicação entre contexts via interface</strong> (Order context não importa <code>UserService</code> direto; importa <code>IUserLookupPort</code> que é implementado por adapter no User context).</li><li><strong>Composition root da feature</strong> no module principal — providers wireup.</li></ul><p>Em monolito modular bem feito, NestJS modules funcionam como proxy de bounded contexts. Quando vira microservice, cada module-bounded-context vira serviço próprio com mínima reescrita. <strong>Principal armadilha:</strong> achar que "module = bounded context" sem analisar domínio. Module é container de DI; bounded context é fronteira de modelo. Coincidem quando bem feito.</p>',
      },
      {
        q: 'O que é "screaming architecture" e como se relaciona?',
        level: 'senior',
        a: '<p>"Screaming Architecture" é conceito do Uncle Bob: a estrutura do projeto deve <strong>gritar o domínio</strong>, não o framework. Se ao abrir o repo você vê <code>controllers/</code>, <code>services/</code>, <code>models/</code>, isso grita "Rails app". Se você vê <code>order/</code>, <code>billing/</code>, <code>shipping/</code>, isso grita "e-commerce".</p><p>Liga direto com Clean Arch via "pasta por feature". Estrutura por camada técnica esconde domínio; estrutura por feature revela. Casa também com DDD — bounded contexts viram pastas de primeiro nível.</p><p>Em entrevista, isso filtra arquitetos: quem desenha estrutura sem perguntar pelo domínio está fazendo cargo-cult. Sênior bom modela pasta como mapa do domínio.</p>',
      },
      {
        q: 'Como você lida com transação que cruza múltiplos repositories?',
        level: 'senior',
        a: '<p>Problema clássico em Clean Arch: use case precisa salvar em <code>OrderRepo</code> e <code>InventoryRepo</code> atomicamente. Se cada repo abre transação própria, sem coordenação, falha parcial é certa.</p><p>Soluções:</p><ol><li><strong>Unit of Work pattern</strong>: interface <code>IUnitOfWork</code> no domínio com método <code>begin/commit/rollback</code>. Use case faz <code>uow.begin()</code>, chama repos, <code>uow.commit()</code>. Adapter implementa via <code>prisma.$transaction()</code>.</li><li><strong>Domain events + transactional outbox</strong>: use case salva Order e publica OrderCreated event no outbox (mesma tx). Worker assíncrono processa outbox e atualiza inventory eventualmente. Eventual consistency, mas robusto contra falha.</li><li><strong>Single aggregate</strong>: se a invariante exige consistência forte, talvez OrderItem deva ser parte do aggregate Order — não 2 repos. Repensa boundary.</li></ol><p>Solução depende de requisito de consistência:</p><ul><li>Forte → UoW (custo: lock contention)</li><li>Eventual → Outbox + events (custo: complexidade async)</li></ul><p>Anti-pattern: chamar <code>repo1.save()</code> + <code>repo2.save()</code> sem coordenação e rezar. Garantido perder dado em falha.</p>',
      },
      {
        q: 'Como você testa use case e quanto vale cada nível da pirâmide?',
        level: 'senior',
        a: '<p>Pirâmide de teste em Clean Arch:</p><ol><li><strong>Unit do domain</strong> (entities, VOs): teste puro, sem mock. <code>Order.pay()</code> — verifica invariantes. Roda em &lt;1ms cada. <strong>~70% dos testes</strong>.</li><li><strong>Unit do use case</strong>: instancia UseCase com fake repo (in-memory) e fake gateway. Roda em ms, sem framework, sem container. <strong>~20% dos testes</strong>.</li><li><strong>Integration dos adapters</strong>: testa <code>PrismaOrderRepository</code> contra Postgres real (testcontainer ou DB de teste). Sobe banco, roda em segundos. <strong>~8% dos testes</strong>.</li><li><strong>E2E</strong>: HTTP request real → controller → use case → DB. Sobe app inteira. Roda em segundos. <strong>~2% dos testes</strong> — só fluxos críticos.</li></ol><p>Métrica que monitoro: <strong>tempo total da suíte</strong>. Se passou de 30s no CI, perdeu o jogo (devs param de rodar local). Domain + use case unit roda em &lt;5s no laptop. Esse é o ganho real de Clean Arch — TDD vira viável.</p><p>Anti-pattern: 80% dos testes serem E2E porque "testa tudo junto". Fica lento, flaky, e não dá feedback localizado.</p>',
        tip: 'Cita números (% dos testes, tempo de suíte) — diferencia quem aplica de quem leu. Sênior pensa em CI-time como métrica.',
      },
      {
        q: 'Quando vale criar Value Object em vez de tipo primitivo?',
        level: 'senior',
        a: '<p>Vale quando:</p><ol><li><strong>Tipo tem regra de validação</strong> que se repete (CPF, email, money). Centraliza no VO em vez de espalhar.</li><li><strong>Tipo tem comportamento</strong> (<code>Money.add()</code>, <code>Money.convert()</code>). Encapsula lógica em vez de criar utility class.</li><li><strong>Igualdade é por valor</strong>, não por referência (Money(100, BRL) === Money(100, BRL) deve ser true).</li><li><strong>Imutabilidade ajuda raciocínio</strong> — operações retornam novo VO em vez de mutar.</li></ol><p>Exemplo concreto: em vez de <code>amount: number, currency: string</code> espalhado, crio <code>Money</code> VO. <code>Money.zero(\'BRL\').add(Money.of(100, \'BRL\'))</code> — comportamento mora no VO, validação de moeda mismatch também.</p><p>Anti-pattern: VO pra qualquer string (UserName, Email, ZipCode) sem comportamento ou regra real. Cria boilerplate sem ganho. Aplica VO quando há valor agregado em encapsular regra/comportamento, não como ritual.</p><p>Em TypeScript, branded types (<code>type CPF = string &amp; { __brand: \'CPF\' }</code>) cobrem caso simples sem classe — mais leve, ainda type-safe.</p>',
      },
      {
        q: 'Como você evita mapper explosion em Clean Architecture?',
        level: 'senior',
        a: '<p>Mapper explosion é o cheiro mais comum de Clean Arch mal-aplicada: 5 classes de mapper por feature (DomainToDto, DtoToDomain, DomainToPrisma, PrismaToDomain, DtoToHttp...). O código vira 80% tradução sem negócio.</p><p>Estratégias para controlar:</p><ol><li><strong>Mapper apenas nas fronteiras reais.</strong> A fronteira que justifica mapper: domain → persistence (ORM) e domain → API response (DTO). Dentro da camada de aplicação, entities de domínio transitam diretamente sem mapper intermediário.</li><li><strong>DTO simples ≠ mapper obrigatório.</strong> Se o DTO de retorno tem os mesmos campos da entity, use <code>plainToInstance</code> (class-transformer) ou spread direto. Não cria classe mapper pra mapeamento trivial.</li><li><strong>Mappers colados ao adapter.</strong> <code>PrismaOrderRepository</code> tem método privado <code>toDomain()</code> e <code>toPersistence()</code> — não vira classe separada. Só extrai em classe quando é reaproveitado em &gt;2 lugares.</li><li><strong>Questiona a layer.</strong> Se seu use case tem 6 linhas de negócio e 20 linhas de mapeamento, o mapper está no lugar errado ou o DTO é desnecessário.</li></ol><p>Heurística: <strong>1 mapper por fronteira de camada, não por entidade</strong>. E-commerce com 10 entidades não precisa de 10 mappers — precisa de 1 por fronteira onde a representação genuinamente diverge.</p>',
        tip: 'Falar em "mapper explosion" e dar solução concreta diferencia quem aplicou Clean Arch em sistema real de quem só leu o livro.',
      },
      {
        q: 'Como você lida com validação de input? Ela pertence a qual camada?',
        level: 'pleno',
        a: '<p>Existem dois tipos de validação com responsabilidades distintas:</p><ul><li><strong>Validação de formato/contrato de API</strong> (campo obrigatório, tipo correto, tamanho máximo): pertence à camada de <strong>Interface Adapters</strong> — controller/presenter. Usa zod, class-validator, joi. Rejeita antes de chegar no use case. Retorna 400 diretamente.</li><li><strong>Validação de regra de negócio</strong> (email já cadastrado, saldo insuficiente, pedido não pode ser cancelado após envio): pertence ao <strong>domínio ou use case</strong>. Lança domain error específico (<code>EmailAlreadyTakenError</code>, <code>InsufficientFundsError</code>). Controller captura e mapeia pra HTTP (409, 422, etc.).</li></ul><p>Anti-pattern que vejo em PRs: toda validação no controller. Resultado: regra de negócio vazou pra camada de apresentação, difícil de testar unitariamente sem HTTP, duplicada se há outro canal de entrada (worker, CLI).</p><p>Regra: <em>"se a validação diz respeito ao negócio, fica no domínio. Se diz respeito ao protocolo de transporte, fica no adapter."</em></p>',
        tip: 'Separar as duas categorias de validação é pergunta clássica de nível pleno/sênior. Maioria confunde ou mistura tudo no controller.',
      },
      {
        q: 'Use case deve retornar entity de domínio ou DTO?',
        level: 'pleno',
        a: '<p>Use case <strong>não deve retornar entity de domínio</strong> para o controller. A entity é objeto rico do domínio — expô-la ao adapter cria acoplamento indevido: qualquer mudança na entity pode quebrar o controller, e o controller passa a "ver" comportamento de domínio que não deveria conhecer.</p><p>O use case retorna um <strong>Output DTO</strong> (Plain Object, interface TypeScript, ou classe simples sem comportamento). O controller serializa pra resposta HTTP. A conversão acontece no use case (ao final do método exec) ou num mapper do adapter — nunca no domínio.</p><p>Casos práticos:</p><ul><li><code>CreateOrderUseCase.exec(input): CreateOrderOutput</code> — Output tem <code>orderId</code>, <code>total</code>, <code>status</code>. Controller não conhece <code>Order</code>.</li><li><code>GetOrderUseCase.exec(id): OrderDetailOutput</code> — projeção específica pra esse use case, não o aggregate inteiro.</li></ul><p>Exceção aceita em projetos pequenos: retornar a entity e deixar o serializer (ex: class-transformer) fazer a projeção. Aceito quando há disciplina de não usar métodos de domínio no controller. Em sistema grande com múltiplos canais, Output DTO vale.</p>',
        tip: 'Essa pergunta avalia se você entende acoplamento de camadas em Clean Arch. Resposta "retorna entity" sem qualificação é red flag.',
      },
      {
        q: 'Como você modela erros em Clean Architecture?',
        level: 'senior',
        a: '<p>Clean Arch tem 3 categorias de erro com tratamento diferente:</p><ol><li><strong>Domain errors</strong>: violação de invariante ou regra de negócio. <code>OrderAlreadyConfirmedError</code>, <code>InsufficientFundsError</code>. São lançados pelo domínio, <em>esperados pelo use case</em>. Use case pode capturar e converter em Output, ou propagá-los ao controller.</li><li><strong>Application errors</strong>: entidade não encontrada, precondição do use case não atendida. <code>OrderNotFoundError</code>. Lançado pelo use case, capturado pelo controller e mapeado para HTTP 404/422.</li><li><strong>Infrastructure errors</strong>: banco fora, timeout, rede. Não devem vazar ao use case como erros raw. O adapter os captura e relança como erros de domínio genéricos (<code>RepositoryUnavailableError</code>) — use case lida sem saber que é Postgres.</li></ol><p>Padrão que prefiro: <strong>hierarquia de classes de erro</strong> (<code>DomainError extends Error</code>), cada erro com código e dados (<code>code: \'ORDER_ALREADY_CONFIRMED\'</code>). Controller tem mapa de código → HTTP status. Use case nunca lida com status HTTP.</p><p>Alternativa moderna: <code>Result&lt;T, E&gt;</code> (Never Throw pattern) — use case retorna <code>Result.ok(output)</code> ou <code>Result.err(new DomainError())</code>. Controller checa isErr() e decide. Sem try/catch — mais explícito no tipo.</p>',
        tip: 'Modelar erros em camadas é diferencialmente sênior. Maioria ou lança exceções cegamente ou swallows erros. Ter padrão claro mostra maturidade.',
      },
      {
        q: 'Como você estrutura o composition root em NestJS com Clean Arch?',
        level: 'senior',
        a: '<p>Composition root é o único lugar onde você conhece as implementações concretas e as injeta. Em NestJS, <strong>o Module é o composition root da feature</strong>.</p><p>Estrutura canônica:</p><pre><code>// order.module.ts\n@Module({\n  imports: [TypeOrmModule.forFeature([OrderRecord])],\n  providers: [\n    CreateOrderUseCase,\n    GetOrderUseCase,\n    { provide: IOrderRepository, useClass: PrismaOrderRepository },\n    { provide: IPaymentGateway, useClass: StripePaymentGateway },\n  ],\n  controllers: [OrderController],\n})\nexport class OrderModule {}</code></pre><p>Regras de ouro:</p><ul><li><strong>Use cases como providers diretos</strong> — NestJS injeta as interfaces pelo token.</li><li><strong>Interface como token de injeção</strong> (<code>provide: IOrderRepository</code>) — use case nunca conhece a string mágica "PrismaOrderRepository".</li><li><strong>Módulo importa o que precisa, não mais</strong> — <code>TypeOrmModule.forFeature</code> só com entidades do contexto atual.</li><li><strong>Shared kernel em módulo separado</strong> — VOs e errors compartilhados num <code>SharedModule</code> sem lógica de negócio de feature.</li></ul><p>Teste: troque <code>useClass: PrismaOrderRepository</code> por <code>useClass: InMemoryOrderRepository</code> no TestingModule sem mudar nada nos use cases. Se precisar mudar o use case, o composition root está vazando.</p>',
        tip: 'Mostrar código concreto de Module como composition root valida que você aplicou, não só leu. Detalhe de <code>provide: IOrderRepository</code> vs string literal é separador de sênior.',
      },
      {
        q: 'Qual a diferença entre Presenter e Controller em Clean Arch?',
        level: 'senior',
        a: '<p>Uncle Bob distingue os dois explicitamente, mas na prática web moderna, o presenter costuma estar embutido no controller. A distinção original:</p><ul><li><strong>Controller</strong>: recebe a requisição de entrada (HTTP, CLI, evento), extrai input, invoca o use case. Não formata saída.</li><li><strong>Presenter</strong>: recebe o output do use case e formata para o protocolo de saída (JSON, HTML, CSV). Não conhece o use case diretamente — recebe via callback ou interface.</li></ul><p>No padrão original Clean Arch, Controller invoca UseCase passando Presenter como callback (Humble Object Pattern). Use case chama <code>presenter.present(output)</code>. Isso torna o controller mais testável isoladamente.</p><p>Na prática com NestJS/Express: <strong>Controller + Presenter fundidos</strong>. O controller invoca o use case e faz o mapeamento de output → response. Aceito — a separação formal só vale quando há múltiplos presenters (JSON, XML, CSV, gRPC) para o mesmo use case. Se há só HTTP JSON, unificar é pragmático e menos boilerplate.</p><p>Quando separar: use case tem múltiplos canais de saída (REST + GraphQL + CLI). O presenter isolado permite reusar o use case com diferentes formatações sem tocar nele.</p>',
        tip: 'A maioria não sabe a distinção formal Controller vs Presenter. Saber e saber quando aplicar é diferencial sênior que mostra leitura do livro original.',
      },
      {
        q: 'Como Clean Architecture se comporta com GraphQL?',
        level: 'senior',
        a: '<p>GraphQL não muda a Dependency Rule — apenas modifica a camada de Interface Adapters. O resolver GraphQL ocupa o papel do controller HTTP: recebe query/mutation, extrai argumentos, invoca use case, retorna output.</p><p>Estrutura com NestJS + Apollo:</p><ul><li><strong>Resolver</strong> → adapter de apresentação (equivale ao controller)</li><li><strong>Input types</strong> → equivalem ao Request DTO de controller HTTP</li><li><strong>Object types</strong> → equivalem ao Response DTO / Presenter output</li><li><strong>Use case</strong> → completamente agnóstico a GraphQL (não conhece <code>@ObjectType</code>)</li></ul><p>Cuidado principal: em GraphQL com DataLoader, você pode ter N+1 no resolver que vai chamar o use case N vezes (um por item num campo nested). O use case precisa aceitar batch input ou você deve resolver N+1 no DataLoader <em>antes</em> de chegar no use case.</p><p>Vantagem de Clean Arch com GraphQL: você pode expor o mesmo use case via REST (controller) e via GraphQL (resolver) simultaneamente, sem duplicar lógica de negócio — cada adapter formata pra seu protocolo. Esse é o ganho concreto da separação.</p>',
        tip: 'GraphQL + Clean Arch é pergunta frequente em empresas com NestJS. Mostrar que resolve equivale a controller e falar de DataLoader + N+1 é diferencial real.',
      },
      {
        q: 'Como você mede o ROI de Clean Architecture num projeto real?',
        level: 'senior',
        a: '<p>Clean Architecture é investimento com custo upfront alto. Defender essa decisão para gestão ou tech lead requer métricas, não argumentos filosóficos.</p><p>Métricas de ROI que monitoro antes/depois:</p><ul><li><strong>Lead time de feature</strong> (do commit ao merge): diminui porque mudança fica localizada em camada específica — menos arquivos tocados, PR menor, review mais rápido.</li><li><strong>Tempo de execução dos testes</strong>: suíte completa de use case units roda em &lt;10s. Se antes rodava em 3min (porque testava subindo servidor), isso é 18x mais rápido — feedback loop muda o modo de trabalho.</li><li><strong>Taxa de bug em produção por módulo</strong>: módulo refatorado com Clean Arch tem menos bug recorrente — encapsulamento impede surpresa de efeito colateral.</li><li><strong>Tempo de onboarding de novo dev</strong>: novo membro entende responsabilidade de cada camada em horas, não dias — screaming architecture grita o domínio.</li><li><strong>Custo de troca de dependência</strong>: quantas linhas mudaram pra trocar Redis por Memcached? Se a resposta for "só o adapter", Clean Arch funcionou.</li></ul><p>Se nenhuma dessas métricas melhora em 6 meses de Clean Arch aplicada, a arquitetura foi aplicada por estética — vale reavaliar. ROI precisa ser mensurável.</p>',
        tip: 'Ter métricas concretas de ROI é o que diferencia arquiteto de senior que defende decisão de arquitetura de um que apenas gosta do pattern. Essencial para entrevistas de staff/principal.',
      },
    ],
    exercises: [
      {
        level: 'iniciante',
        title: 'Estruturar feature simples seguindo Clean Architecture',
        description: 'Implemente CRUD de "Notas" (notes) seguindo Clean Arch: entity Note (id, title, content, createdAt), use cases CreateNote/ListNotes/UpdateNote/DeleteNote, port INoteRepository, adapter InMemoryNoteRepository (Map em memória), controller HTTP REST. Estrutura: <code>src/notes/{domain,application,infrastructure,presentation}/</code>. Configure NestJS module (composition root) e adicione teste unitário do use case CreateNote sem subir framework.',
        concepts: ['Dependency Rule', 'use cases', 'ports', 'adapters', 'composition root'],
        hint: 'Domain Note não tem decorator nem ORM. Repository é interface no application/ports. InMemoryRepo no infrastructure implementa. Controller chama useCase.exec(input). Teste do use case instancia direto sem NestJS.',
        relatedKeypoints: [0, 1, 2, 3],
      },
      {
        level: 'intermediario',
        title: 'Adicionar adapter Prisma sem tocar use case',
        description: 'Pegue o exercício anterior e adicione PrismaNoteRepository sem alterar nenhuma linha de domain/ ou application/. Crie schema Prisma, migration, mapper Note ↔ PrismaNote. Adicione teste de integração que sobe Postgres (testcontainer) e exercita o repo. No module, registre PrismaNoteRepository no provider IF NODE_ENV=production e InMemoryNoteRepository em test.',
        concepts: ['adapter pattern', 'mapper', 'composition root', 'troca de implementação', 'testcontainer'],
        hint: 'Mapper toDomain(prismaRow) e toPersistence(domainEntity). Use eslint-plugin-boundaries pra confirmar que domain não importa Prisma. Integration test sobe Postgres real e bate o adapter.',
        relatedKeypoints: [3, 7, 9],
      },
      {
        level: 'intermediario',
        title: 'Identificar e refatorar vazamento arquitetural',
        description: 'Recebe um projeto NestJS com violação de Dependency Rule: Order entity tem decorators TypeORM, use case importa Repository<Order> do TypeORM direto, controller faz query SQL. Identifique cada vazamento, proponha refactor (entity pura + mapper + IOrderRepository port + Prisma adapter), e justifique cada mudança em comentário. Configure eslint-plugin-boundaries pra prevenir regressão.',
        concepts: ['detectar vazamento', 'refactor incremental', 'eslint-plugin-boundaries', 'mapper'],
        hint: 'Comece pelo decorator na entity — extraia OrderRecord no infra. Depois separe interface IOrderRepository do TypeORM repo. Por fim, controller chama use case (não SQL).',
        relatedKeypoints: [0, 11],
      },
      {
        level: 'senior',
        title: 'Use case com transação multi-aggregate (Unit of Work)',
        description: 'Implemente use case <code>CheckoutCartUseCase</code> que cria Order, debita Inventory e debita CustomerCredit atomicamente. Use 3 repositories distintos. Aplique Unit of Work pattern: interface IUnitOfWork no domain (begin/commit/rollback), implementação Prisma usando $transaction. Adicione teste que verifica rollback em falha (estoque insuficiente). Documente tradeoff vs domain events + outbox.',
        concepts: ['Unit of Work', 'transação distribuída local', 'rollback', 'consistência forte'],
        hint: 'IUnitOfWork.runInTransaction(callback) é boa API. Implementação chama prisma.$transaction(tx => callback(scopedRepos)). Cuidado: repos dentro da tx precisam usar tx, não prisma direto. Teste com fake UoW que simula rollback.',
        relatedKeypoints: [9, 10],
      },
      {
        level: 'senior',
        title: 'Migrar feature de monolito MVC pra Clean Arch (strangler fig)',
        description: 'Pegue um projeto Node MVC real (controller chamando ORM direto, regra espalhada). Escolha 1 feature dolorida (com bugs ou teste lento). Migre incrementalmente: extrai use case, cria interface de repo, mantém adapter usando ORM existente. Adiciona testes do use case. Documenta antes/depois com métricas (linhas, tempo de teste, deps no construtor). Justifica por que essa feature antes das outras.',
        concepts: ['strangler fig', 'refactor incremental', 'migração arquitetural', 'métricas'],
        hint: 'Não tenta clean tudo. Foca em 1 feature. Mantém comportamento (golden master test antes). Comparativo objetivo: tempo de teste cai? Bug rate cai? Se não, está aplicando arquitetura por estética.',
        relatedKeypoints: [10, 11],
      },
    ],
    resources: [
      { title: 'Clean Architecture (Robert C. Martin)', url: 'https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164', kind: 'livro' },
      { title: 'The Clean Architecture (Uncle Bob blog post)', url: 'https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html', kind: 'artigo' },
      { title: 'Hexagonal Architecture (Alistair Cockburn)', url: 'https://alistair.cockburn.us/hexagonal-architecture/', kind: 'artigo' },
      { title: 'Onion Architecture (Jeffrey Palermo)', url: 'https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/', kind: 'artigo' },
      { title: 'Herberto Graça — DDD, Hexagonal, Onion, Clean unificados', url: 'https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/', kind: 'artigo' },
      { title: 'Implementing Clean Architecture (Vladimir Khorikov)', url: 'https://www.manning.com/books/unit-testing', kind: 'livro' },
      { title: 'Get Your Hands Dirty on Clean Architecture (Tom Hombergs)', url: 'https://leanpub.com/get-your-hands-dirty-on-clean-architecture', kind: 'livro' },
      { title: 'eslint-plugin-boundaries (enforcement)', url: 'https://github.com/javierbrea/eslint-plugin-boundaries', kind: 'docs' },
      { title: 'dependency-cruiser (alternativa de enforcement)', url: 'https://github.com/sverweij/dependency-cruiser', kind: 'docs' },
      { title: 'NestJS + Clean Architecture (boilerplate)', url: 'https://github.com/CleanArchitecture-LearningProjects', kind: 'docs' },
      { title: 'Clean Code (Robert Martin) — base prática', url: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882', kind: 'livro' },
    ],
    videos: [
      { title: 'Clean Architecture — Uncle Bob / Robert Martin', channel: 'Robert Martin', url: '', topic: 'A palestra original sobre Clean Architecture', note: 'Fonte primária — Uncle Bob explica o raciocínio por trás de cada camada' },
      { title: 'Clean Architecture with NestJS', channel: 'Rocketseat', url: '', topic: 'Clean Arch implementado em projeto NestJS real', note: 'Melhor recurso em português para implementação prática em Node.js' },
      { title: 'The Clean Architecture Explained — Practical Example with TypeScript', channel: 'CodelyTV', url: '', topic: 'Clean Arch do zero com TypeScript', note: 'Foco em estrutura de pastas, ports, adapters e testes' },
      { title: 'Why Clean Architecture Sucks', channel: 'Theo - t3.gg', url: '', topic: 'Perspectiva crítica e quando não usar', note: 'Essencial para entender o tradeoff antes de adotar cegamente' },
      { title: 'Hexagonal Architecture in TypeScript', channel: 'JetBrains', url: '', topic: 'Ports & Adapters com TypeScript', note: 'Complementa Clean Arch — são variações do mesmo princípio' },
    ],
    codeExamples: [
      {
        title: 'Use Case completo com domain entity, port e adapter',
        description: 'Fluxo CreateOrder: entity pura → use case → port interface → Prisma adapter → composition root NestJS',
        language: 'typescript',
        code: `// =============================================
// DOMAIN — zero imports externos
// =============================================
// domain/entities/order.entity.ts
export class Order {
  private constructor(
    public readonly id: string,
    private readonly items: OrderItem[],
    private status: 'pending' | 'paid' | 'shipped',
  ) {}

  static create(input: { items: { sku: string; qty: number; price: number }[] }): Order {
    if (input.items.length === 0) throw new EmptyOrderError()
    return new Order(
      crypto.randomUUID(),
      input.items.map(i => new OrderItem(i.sku, i.qty, i.price)),
      'pending',
    )
  }

  total(): number { return this.items.reduce((s, i) => s + i.subtotal(), 0) }
  markPaid(): void {
    if (this.status !== 'pending') throw new InvalidStateError()
    this.status = 'paid'
  }
  get currentStatus() { return this.status }
}

// =============================================
// APPLICATION — use cases + ports (interfaces)
// =============================================
// application/ports/order-repository.port.ts
export interface IOrderRepository {
  save(order: Order): Promise<void>
  findById(id: string): Promise<Order | null>
}

// application/ports/payment-gateway.port.ts
export interface IPaymentGateway {
  charge(amount: number): Promise<{ ok: boolean; txId: string }>
}

// application/use-cases/create-order.usecase.ts
export class CreateOrderUseCase {
  constructor(
    private readonly repo: IOrderRepository,    // interface — sem ORM
    private readonly payments: IPaymentGateway, // interface — sem Stripe
  ) {}

  async exec(input: CreateOrderInput): Promise<CreateOrderOutput> {
    const order = Order.create(input)
    const charge = await this.payments.charge(order.total())
    if (!charge.ok) throw new PaymentFailedError()
    order.markPaid()
    await this.repo.save(order)
    return { orderId: order.id, total: order.total(), txId: charge.txId }
  }
}

// =============================================
// INFRASTRUCTURE — adapters concretos
// =============================================
// infrastructure/repositories/prisma-order.repository.ts
import { PrismaClient } from '@prisma/client'

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(order: Order): Promise<void> {
    await this.prisma.order.create({
      data: { id: order.id, status: order.currentStatus, total: order.total() },
    })
  }

  async findById(id: string): Promise<Order | null> {
    const row = await this.prisma.order.findUnique({ where: { id }, include: { items: true } })
    return row ? OrderMapper.toDomain(row) : null
  }
}

// =============================================
// COMPOSITION ROOT — NestJS module
// =============================================
@Module({
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    { provide: 'IOrderRepository', useClass: PrismaOrderRepository },
    { provide: 'IPaymentGateway',  useClass: StripePaymentGateway  },
    // em e2e: useClass: InMemoryOrderRepository
  ],
})
export class OrderModule {}`,
      },
      {
        title: 'Teste de use case sem framework — in-memory fakes',
        description: 'Testa CreateOrderUseCase em milissegundos sem NestJS, Postgres ou Stripe',
        language: 'typescript',
        code: `// Roda em <10ms — sem Docker, sem banco, sem framework

class InMemoryOrderRepository implements IOrderRepository {
  readonly orders = new Map<string, Order>()
  async save(order: Order) { this.orders.set(order.id, order) }
  async findById(id: string) { return this.orders.get(id) ?? null }
}

class FakePaymentGateway implements IPaymentGateway {
  readonly charges: number[] = []
  private shouldFail = false
  setFail(v: boolean) { this.shouldFail = v }
  async charge(amount: number) {
    this.charges.push(amount)
    return this.shouldFail ? { ok: false, txId: '' } : { ok: true, txId: 'tx-' + Date.now() }
  }
}

describe('CreateOrderUseCase', () => {
  let repo: InMemoryOrderRepository
  let payments: FakePaymentGateway
  let useCase: CreateOrderUseCase

  beforeEach(() => {
    repo = new InMemoryOrderRepository()
    payments = new FakePaymentGateway()
    useCase = new CreateOrderUseCase(repo, payments)
  })

  it('cria pedido e cobra pagamento com sucesso', async () => {
    const out = await useCase.exec({ items: [{ sku: 'X', qty: 2, price: 50 }] })

    expect(out.total).toBe(100)
    expect(payments.charges).toHaveLength(1)
    expect(await repo.findById(out.orderId)).toBeDefined()
  })

  it('não persiste se pagamento falhar', async () => {
    payments.setFail(true)
    await expect(useCase.exec({ items: [{ sku: 'X', qty: 1, price: 10 }] }))
      .rejects.toThrow(PaymentFailedError)
    expect(repo.orders.size).toBe(0) // rollback lógico
  })

  it('rejeita pedido vazio', async () => {
    await expect(useCase.exec({ items: [] })).rejects.toThrow(EmptyOrderError)
    expect(payments.charges).toHaveLength(0) // não cobrou
  })
})`,
      },
      {
        title: 'Mapper domain ↔ persistence sem vazar tipos do ORM',
        description: 'O único arquivo que conhece ambos domínio e ORM — encapsula toda a tradução',
        language: 'typescript',
        code: `// infrastructure/mappers/order.mapper.ts
import { Order, OrderItem } from '../../domain/entities'
import type { Prisma, Order as PrismaOrder } from '@prisma/client'

type PrismaOrderWithItems = PrismaOrder & {
  items: { sku: string; qty: number; price: number }[]
}

export class OrderMapper {
  // ORM → Domain  (usado no findById)
  static toDomain(row: PrismaOrderWithItems): Order {
    return Order.reconstitute(
      row.id,
      row.items.map(i => new OrderItem(i.sku, i.qty, i.price)),
      row.status as 'pending' | 'paid' | 'shipped',
    )
  }

  // Domain → ORM create input  (usado no save)
  static toPersistence(order: Order): Prisma.OrderCreateInput {
    return {
      id: order.id,
      status: order.currentStatus,
      total: order.total(),
    }
  }
}

// Benefício: domain/entities/order.entity.ts NUNCA importa Prisma
// Trocar Prisma por TypeORM? Muda só o mapper e o adapter.
// eslint-plugin-boundaries confirma no CI.`,
      },
    ],
    mindmap: {
      title: 'Clean Architecture — Mapa de conceitos e fluxo',
      html: `<div style="background:#0f172a;padding:32px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .cam-wrap{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .cam-node{background:rgba(99,102,241,.07);border:1px solid rgba(99,102,241,.25);border-radius:10px;padding:13px 15px}
    .cam-title{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:#a5b4fc;margin-bottom:8px;letter-spacing:.5px}
    .cam-items{font-size:11px;color:#cbd5e1;line-height:1.8;padding:0;margin:0}
    .cam-items li{list-style:none;padding-left:14px;position:relative}
    .cam-items li::before{content:'→';position:absolute;left:0;color:#6366F1;font-weight:700}
    .cam-center{grid-column:1/-1;background:linear-gradient(90deg,rgba(99,102,241,.18),rgba(99,102,241,.06));border:2px solid #6366F1;border-radius:12px;padding:14px 18px;text-align:center;margin-bottom:4px}
    .cam-flow{grid-column:1/-1;display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap;margin-top:8px;padding:12px;background:rgba(99,102,241,.05);border-radius:8px;border:1px solid rgba(99,102,241,.15)}
    .cam-step{background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.3);border-radius:6px;padding:5px 10px;font-family:'JetBrains Mono',monospace;font-size:10px;color:#c7d2fe;white-space:nowrap}
    .cam-arr{color:#6366F1;font-size:14px;font-weight:700}
  </style>
  <div style="text-align:center;margin-bottom:18px">
    <div style="font-size:16px;font-weight:700;color:#a5b4fc">CLEAN ARCHITECTURE — MAPA MENTAL</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:4px">Camadas, regras e fluxo de request</div>
  </div>
  <div class="cam-wrap">
    <div class="cam-center">
      <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:#a5b4fc;margin-bottom:4px">DEPENDENCY RULE</div>
      <div style="font-size:14px;font-weight:700;color:#fff">Setas sempre apontam para dentro</div>
      <div style="font-size:11px;color:#94a3b8;margin-top:4px">Entities ← Use Cases ← Adapters ← Frameworks &amp; Drivers</div>
    </div>
    <div class="cam-node">
      <div class="cam-title">ENTITIES — centro</div>
      <ul class="cam-items">
        <li>Regra de negócio empresarial</li>
        <li>Puras — zero import externo</li>
        <li>Entities, Value Objects, Errors</li>
        <li>Comportamento encapsulado</li>
        <li>Invariantes protegidas</li>
      </ul>
    </div>
    <div class="cam-node">
      <div class="cam-title">USE CASES — orquestração</div>
      <ul class="cam-items">
        <li>Regra de aplicação (verbo)</li>
        <li>CreateOrder, ApprovePayment</li>
        <li>Depende apenas de ports</li>
        <li>Testável em &lt;5ms</li>
        <li>1 classe, 1 método exec</li>
      </ul>
    </div>
    <div class="cam-node">
      <div class="cam-title">ADAPTERS — tradução</div>
      <ul class="cam-items">
        <li>Controllers (HTTP → DTO)</li>
        <li>Presenters (domínio → UI)</li>
        <li>Repos (port → ORM)</li>
        <li>Gateways (port → SDK)</li>
        <li>Mappers (domain ↔ ORM)</li>
      </ul>
    </div>
    <div class="cam-node">
      <div class="cam-title">FRAMEWORKS — borda</div>
      <ul class="cam-items">
        <li>Express, NestJS, Fastify</li>
        <li>Prisma, TypeORM, Mongoose</li>
        <li>React, AWS SDK, Stripe</li>
        <li>Plugáveis — trocar = só adapter</li>
        <li>Composition root liga tudo</li>
      </ul>
    </div>
    <div class="cam-node">
      <div class="cam-title">PIRÂMIDE DE TESTES</div>
      <ul class="cam-items">
        <li>70% — unit domain (puro)</li>
        <li>20% — unit use case (fake repo)</li>
        <li>8% — integration adapter (DB real)</li>
        <li>2% — E2E (app inteira)</li>
        <li>Meta: suíte &lt;30s no CI</li>
      </ul>
    </div>
    <div class="cam-node">
      <div class="cam-title">QUANDO APLICAR</div>
      <ul class="cam-items">
        <li>Domínio rico (fintech, ERP)</li>
        <li>Vida longa (5+ anos)</li>
        <li>Time grande (10+ devs)</li>
        <li>Troca de tecnologia prevista</li>
        <li>NÃO: CRUD, MVP, prototipo</li>
      </ul>
    </div>
    <div class="cam-flow">
      <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#94a3b8;margin-right:6px">REQUEST:</span>
      <div class="cam-step">HTTP</div><div class="cam-arr">→</div>
      <div class="cam-step">Controller</div><div class="cam-arr">→</div>
      <div class="cam-step">UseCase.exec()</div><div class="cam-arr">→</div>
      <div class="cam-step">Entity</div><div class="cam-arr">→</div>
      <div class="cam-step">Port</div><div class="cam-arr">→</div>
      <div class="cam-step">Adapter</div><div class="cam-arr">→</div>
      <div class="cam-step">DB / SDK</div>
    </div>
  </div>
</div>`,
      caption: 'Fluxo de uma request HTTP atravessando todas as camadas. Cada fronteira tem regra de import específica — violação é detectada pelo linter.',
    },
  },

  'ddd': {
    tagline: 'Modelar código a partir do domínio de negócio, com linguagem ubíqua como contrato entre devs e especialistas.',
    why: 'DDD aparece em toda vaga senior de backend em fintech, healthtech e marketplace. O entrevistador não quer que você recite "entity, aggregate, value object" — quer ver se você sabe identificar bounded contexts num diagrama de domínio real, definir invariantes de aggregate e quando NÃO usar DDD. Aplicar DDD sem domínio rico é a forma mais cara de escrever getters e setters.',
    prerequisite: 'SOLID dominado (especialmente SRP e DIP), conforto com TypeScript ou linguagem OO equivalente, noção de Clean Architecture (DDD e Clean se complementam). Ajuda muito ter trabalhado num domínio complexo — fiscal, financeiro, saúde — onde a lógica de negócio dói de verdade.',
    summary: 'Domain-Driven Design (Eric Evans, 2003) coloca o domínio do negócio no centro do design. Existem duas dimensões: Strategic DDD (o mapa grande) e Tactical DDD (os blocos de construção).\n\nStrategic: Bounded Contexts são fronteiras lógicas onde um modelo coeso faz sentido — Customer em Sales tem limite de crédito e histórico de compra; Customer em Support tem tickets e SLA. Mesmo nome, modelos diferentes. Context Map descreve relações entre bounded contexts: Shared Kernel, Customer-Supplier, Anti-Corruption Layer (ACL), Conformist. Ubiquitous Language é o vocabulário único entre dev e negócio, refletido no código — se negócio fala "shipment" e código tem "delivery", o tradutor humano vira bug.\n\nTactical: Aggregate é cluster de entidades com um Aggregate Root que garante invariantes. Transação toca um aggregate só — Order é root, OrderItems são parte. Entity tem identidade (User#123 mesmo com campos mutados). Value Object é imutável e definido por valor (Money(100, BRL) == Money(100, BRL)). Domain Event captura o que aconteceu (OrderPlaced, PaymentApproved) — desacopla reação. Repository abstrai persistência por aggregate. Domain Service encapsula lógica que não pertence a nenhuma entity. Application Service orquestra casos de uso.\n\nDDD brilha em domínio rico, ambíguo e de longa vida. Em CRUD simples é teatro arquitetural caro — 80% do código vira boilerplate sem regra de negócio real pra encapsular.',
    howToStudy: '<strong>Tem 30 minutos antes de uma entrevista?</strong> Memorize a diferença Entity vs Value Object (identidade vs valor), o que é Aggregate Root (garante invariantes, ponto de entrada), e Bounded Context (fronteira de modelo). Estude as Q&As de nível pleno.<br><br><strong>Tem um fim de semana?</strong> Leia os capítulos 1-3 do <em>Domain-Driven Design Distilled</em> (Vernon, 2016 — mais prático que o livro do Evans). Implemente um Aggregate simples (Order com itens e invariante "não pode confirmar vazio"). Sinta a diferença de ter comportamento na entity vs service anêmico.<br><br><strong>Tem uma semana?</strong> Leia o <em>Implementing DDD</em> (Vernon). Mapeie os bounded contexts de um sistema real do seu trabalho. Implemente Domain Events e um handler em bounded context diferente. Compare com Clean Architecture — eles se complementam perfeitamente.<br><br><strong>Modelo mental central:</strong> o código espelha o domínio. Se o especialista de negócio não consegue ler o seu código e reconhecer o vocabulário, você falhou em DDD. Ubiquitous Language é o contrato mais importante.',
    diagrams: [
      {
        title: 'Strategic DDD — Context Map de e-commerce',
        html: `<div style="background:#0f172a;padding:32px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .dd1-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
    .dd1-ctx{background:rgba(23,147,209,.07);border:1px solid rgba(23,147,209,.3);border-radius:10px;padding:14px 16px;position:relative;cursor:pointer;transition:all .2s}
    .dd1-ctx:hover{background:rgba(23,147,209,.15);transform:translateY(-2px);box-shadow:0 4px 20px rgba(23,147,209,.15)}
    .dd1-ctx-title{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:#38bdf8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
    .dd1-ctx-models{font-size:11px;color:#cbd5e1;line-height:1.7}
    .dd1-ctx-model{display:flex;align-items:flex-start;gap:6px;padding:2px 0}
    .dd1-ctx-model::before{content:'•';color:#1793D1;font-weight:700}
    .dd1-tooltip{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#1e293b;border:1px solid #1793D1;padding:10px 12px;border-radius:6px;font-size:11px;line-height:1.5;width:240px;z-index:10;text-align:left;color:#e2e8f0;box-shadow:0 8px 32px rgba(0,0,0,.4)}
    .dd1-tooltip::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:6px solid transparent;border-top-color:#1793D1}
    .dd1-ctx:hover .dd1-tooltip{display:block}
    .dd1-relation{background:rgba(23,147,209,.04);border:1px dashed rgba(23,147,209,.2);border-radius:8px;padding:10px 14px;margin-top:4px;font-size:11px}
    .dd1-rel-title{font-family:'JetBrains Mono',monospace;font-size:10px;color:#38bdf8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
    .dd1-rel-item{display:flex;align-items:center;gap:8px;padding:3px 0;color:#94a3b8;font-size:11px}
    .dd1-rel-badge{display:inline-block;padding:1px 6px;border-radius:3px;font-size:9px;font-family:'JetBrains Mono',monospace;background:rgba(23,147,209,.2);color:#38bdf8;white-space:nowrap}
    .dd1-banner{grid-column:1/-1;text-align:center;padding:12px;background:linear-gradient(90deg,rgba(23,147,209,.15),rgba(23,147,209,.05));border-radius:8px;margin-bottom:4px}
  </style>
  <div style="text-align:center;margin-bottom:20px">
    <div style="font-size:16px;font-weight:700;color:#38bdf8">STRATEGIC DDD — CONTEXT MAP</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:4px">Hover em cada contexto para ver o modelo e a linguagem ubíqua</div>
  </div>
  <div class="dd1-grid">
    <div class="dd1-ctx">
      <div class="dd1-ctx-title">Orders Context</div>
      <div class="dd1-ctx-models">
        <div class="dd1-ctx-model">Order (aggregate root)</div>
        <div class="dd1-ctx-model">OrderItem (entity)</div>
        <div class="dd1-ctx-model">Money (value object)</div>
        <div class="dd1-ctx-model">OrderPlaced (domain event)</div>
      </div>
      <div class="dd1-tooltip">Linguagem ubíqua: "pedido", "item", "confirmar", "cancelar". Order controla invariantes: não pode confirmar sem itens, não pode cancelar se já enviado. OrderItem é imutável — adicionar = novo item.</div>
    </div>
    <div class="dd1-ctx">
      <div class="dd1-ctx-title">Payments Context</div>
      <div class="dd1-ctx-models">
        <div class="dd1-ctx-model">Payment (aggregate root)</div>
        <div class="dd1-ctx-model">ChargeResult (value object)</div>
        <div class="dd1-ctx-model">PaymentMethod (entity)</div>
        <div class="dd1-ctx-model">PaymentApproved (event)</div>
      </div>
      <div class="dd1-tooltip">Linguagem ubíqua: "cobrança", "autorizar", "estornar", "chargeback". Payment tem seu próprio modelo de Order (só orderId + total) — não importa OrderItem. Contexto separado, modelo separado.</div>
    </div>
    <div class="dd1-ctx">
      <div class="dd1-ctx-title">Inventory Context</div>
      <div class="dd1-ctx-models">
        <div class="dd1-ctx-model">Stock (aggregate root)</div>
        <div class="dd1-ctx-model">Reservation (entity)</div>
        <div class="dd1-ctx-model">Quantity (value object)</div>
        <div class="dd1-ctx-model">StockReserved (event)</div>
      </div>
      <div class="dd1-tooltip">Linguagem ubíqua: "estoque", "reserva", "baixa", "reposição". Stock protege invariante de quantidade não-negativa. Reservation é criada quando Order é confirmado — via evento, não chamada direta.</div>
    </div>
    <div class="dd1-ctx">
      <div class="dd1-ctx-title">Shipping Context</div>
      <div class="dd1-ctx-models">
        <div class="dd1-ctx-model">Shipment (aggregate root)</div>
        <div class="dd1-ctx-model">TrackingCode (value object)</div>
        <div class="dd1-ctx-model">Address (value object)</div>
        <div class="dd1-ctx-model">ShipmentDispatched (event)</div>
      </div>
      <div class="dd1-tooltip">Linguagem ubíqua: "envio", "despacho", "rastreio", "entrega". Shipment tem visão diferente de Order — interessa só o endereço e os itens físicos. Address é VO: imutável, igualdade por valor.</div>
    </div>
    <div class="dd1-ctx">
      <div class="dd1-ctx-title">Users Context</div>
      <div class="dd1-ctx-models">
        <div class="dd1-ctx-model">Customer (aggregate root)</div>
        <div class="dd1-ctx-model">Email (value object)</div>
        <div class="dd1-ctx-model">CreditLimit (value object)</div>
        <div class="dd1-ctx-model">CustomerRegistered (event)</div>
      </div>
      <div class="dd1-tooltip">Linguagem ubíqua: "cliente", "cadastro", "limite de crédito". Customer em Users ≠ Customer em Support. Mesmo nome, modelos diferentes — separação de contexto resolve a ambiguidade.</div>
    </div>
    <div class="dd1-ctx">
      <div class="dd1-ctx-title">Notifications Context</div>
      <div class="dd1-ctx-models">
        <div class="dd1-ctx-model">Notification (aggregate)</div>
        <div class="dd1-ctx-model">Channel (value object)</div>
        <div class="dd1-ctx-model">Template (entity)</div>
        <div class="dd1-ctx-model">NotificationSent (event)</div>
      </div>
      <div class="dd1-tooltip">Consumidor downstream. Recebe eventos de todos os contextos e decide como notificar. Não tem opinião sobre o que é Order ou Payment — só recebe e reage. Conformist em relação a Orders/Payments.</div>
    </div>
  </div>
  <div class="dd1-grid" style="margin-top:14px">
    <div class="dd1-relation" style="grid-column:1/-1">
      <div class="dd1-rel-title">Context Map — relações</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
        <div>
          <div class="dd1-rel-item"><span class="dd1-rel-badge">ACL</span>Orders ← Payments</div>
          <div style="font-size:10px;color:#64748b;padding-left:60px">Anti-Corruption Layer traduz PaymentApproved pro modelo de Orders</div>
        </div>
        <div>
          <div class="dd1-rel-item"><span class="dd1-rel-badge">Customer-Supplier</span>Orders → Inventory</div>
          <div style="font-size:10px;color:#64748b;padding-left:110px">Orders é upstream; Inventory segue API de Orders</div>
        </div>
        <div>
          <div class="dd1-rel-item"><span class="dd1-rel-badge">Conformist</span>Notifications ← todos</div>
          <div style="font-size:10px;color:#64748b;padding-left:78px">Notifications aceita o modelo dos contextos upstream sem adaptar</div>
        </div>
      </div>
    </div>
  </div>
</div>`,
        caption: 'Cinco bounded contexts, cada um com seu modelo e linguagem ubíqua. Mesmo conceito (Order, Customer) tem representações diferentes em cada contexto — isso não é bug, é design.',
      },
      {
        title: 'Tactical DDD — Aggregate com invariantes e Domain Events',
        html: `<div style="background:#0f172a;padding:32px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .dd2-layout{display:grid;grid-template-columns:1fr 1fr;gap:18px}
    .dd2-aggregate{background:rgba(23,147,209,.06);border:2px solid rgba(23,147,209,.4);border-radius:12px;padding:16px 18px}
    .dd2-agg-title{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:#38bdf8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(23,147,209,.25)}
    .dd2-root{background:rgba(23,147,209,.15);border:1px solid rgba(23,147,209,.5);border-radius:6px;padding:10px 12px;margin-bottom:8px}
    .dd2-root-label{font-size:10px;font-family:'JetBrains Mono',monospace;color:#38bdf8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
    .dd2-root-name{font-size:13px;font-weight:700;color:#fff;margin-bottom:4px}
    .dd2-method{font-family:'JetBrains Mono',monospace;font-size:11px;color:#86efac;padding:2px 0}
    .dd2-method::before{content:'+ ';color:#4ade80}
    .dd2-invariant{font-size:10px;color:#fbbf24;padding:2px 0;display:flex;gap:4px}
    .dd2-invariant::before{content:'✦'}
    .dd2-child{background:rgba(23,147,209,.05);border:1px solid rgba(23,147,209,.2);border-radius:6px;padding:8px 10px;margin-bottom:6px}
    .dd2-child-name{font-size:11px;font-weight:700;color:#7dd3fc;margin-bottom:4px;font-family:'JetBrains Mono',monospace}
    .dd2-vo{background:rgba(74,222,128,.05);border:1px solid rgba(74,222,128,.2);border-radius:6px;padding:8px 10px;margin-bottom:6px}
    .dd2-vo-name{font-size:11px;font-weight:700;color:#86efac;margin-bottom:4px;font-family:'JetBrains Mono',monospace}
    .dd2-prop{font-size:10px;color:#94a3b8;padding:1px 0}
    .dd2-event-flow{display:flex;flex-direction:column;gap:10px}
    .dd2-event-step{display:flex;gap:12px;align-items:flex-start;padding:10px 12px;background:rgba(23,147,209,.05);border-radius:8px;border-left:3px solid #1793D1}
    .dd2-event-num{flex:0 0 24px;height:24px;border-radius:50%;background:#1793D1;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace}
    .dd2-event-content{flex:1}
    .dd2-event-label{font-size:11px;font-weight:700;color:#38bdf8;margin-bottom:2px}
    .dd2-event-desc{font-size:10px;color:#94a3b8;line-height:1.5}
  </style>
  <div style="text-align:center;margin-bottom:20px">
    <div style="font-size:16px;font-weight:700;color:#38bdf8">TACTICAL DDD — AGGREGATE + DOMAIN EVENTS</div>
  </div>
  <div class="dd2-layout">
    <div class="dd2-aggregate">
      <div class="dd2-agg-title">Order Aggregate</div>
      <div class="dd2-root">
        <div class="dd2-root-label">Aggregate Root</div>
        <div class="dd2-root-name">Order</div>
        <div class="dd2-method">confirm(): OrderConfirmed</div>
        <div class="dd2-method">addItem(sku, qty, price): void</div>
        <div class="dd2-method">cancel(reason): OrderCancelled</div>
        <div class="dd2-method">total(): Money</div>
        <div style="margin-top:8px;padding-top:6px;border-top:1px dashed rgba(23,147,209,.2)">
          <div style="font-size:10px;color:#38bdf8;font-family:'JetBrains Mono',monospace;margin-bottom:4px">INVARIANTES</div>
          <div class="dd2-invariant">Não confirmar sem itens</div>
          <div class="dd2-invariant">Não cancelar se já enviado</div>
          <div class="dd2-invariant">Total deve ser &gt; 0</div>
        </div>
      </div>
      <div class="dd2-child">
        <div class="dd2-child-name">OrderItem (Entity filha)</div>
        <div class="dd2-prop">sku: string</div>
        <div class="dd2-prop">qty: number</div>
        <div class="dd2-prop">price: Money</div>
        <div class="dd2-prop">subtotal(): Money</div>
      </div>
      <div class="dd2-vo">
        <div class="dd2-vo-name">Money (Value Object)</div>
        <div class="dd2-prop">amount: number (readonly)</div>
        <div class="dd2-prop">currency: 'BRL' | 'USD'</div>
        <div class="dd2-prop">add(m: Money): Money</div>
        <div class="dd2-prop">equals(m: Money): boolean</div>
        <div style="font-size:10px;color:#4ade80;margin-top:4px">Imutável · Igualdade por valor</div>
      </div>
    </div>

    <div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#38bdf8;margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px">Fluxo de Domain Event</div>
      <div class="dd2-event-flow">
        <div class="dd2-event-step">
          <div class="dd2-event-num">1</div>
          <div class="dd2-event-content">
            <div class="dd2-event-label">Command → Aggregate</div>
            <div class="dd2-event-desc"><code style="color:#86efac">ConfirmOrderCommand</code> chega no Application Service → invoca <code style="color:#86efac">order.confirm()</code></div>
          </div>
        </div>
        <div class="dd2-event-step">
          <div class="dd2-event-num">2</div>
          <div class="dd2-event-content">
            <div class="dd2-event-label">Aggregate valida invariantes</div>
            <div class="dd2-event-desc">Order verifica: tem itens? status é pending? Se não, lança <code style="color:#fca5a5">DomainError</code></div>
          </div>
        </div>
        <div class="dd2-event-step">
          <div class="dd2-event-num">3</div>
          <div class="dd2-event-content">
            <div class="dd2-event-label">Domain Event emitido</div>
            <div class="dd2-event-desc"><code style="color:#86efac">OrderConfirmed { orderId, total, customerId, at }</code> — imutável, no passado, fato do domínio</div>
          </div>
        </div>
        <div class="dd2-event-step">
          <div class="dd2-event-num">4</div>
          <div class="dd2-event-content">
            <div class="dd2-event-label">Handlers reagem</div>
            <div class="dd2-event-desc">PaymentHandler cobra, InventoryHandler reserva, NotificationHandler envia email — cada um no próprio bounded context, desacoplado</div>
          </div>
        </div>
        <div class="dd2-event-step" style="border-left-color:#fbbf24">
          <div class="dd2-event-num" style="background:#d97706">i</div>
          <div class="dd2-event-content">
            <div class="dd2-event-label" style="color:#fbbf24">Aggregate Root = único acesso</div>
            <div class="dd2-event-desc">Nenhum código externo acessa <code style="color:#fca5a5">OrderItem</code> diretamente. Só via <code style="color:#86efac">order.addItem()</code>. Garante invariantes sempre.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`,
        caption: 'Aggregate Root é a única porta de entrada. Invariantes vivem dentro. Domain Events comunicam o que aconteceu — sem acoplamento direto entre contextos.',
      },
      {
        title: 'Entity vs Value Object — diferenças e implementação TypeScript',
        html: `<div style="background:#0f172a;padding:32px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .dd3-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .dd3-card{border-radius:10px;padding:14px 16px}
    .dd3-entity{background:rgba(23,147,209,.07);border:1px solid rgba(23,147,209,.3)}
    .dd3-vo{background:rgba(74,222,128,.07);border:1px solid rgba(74,222,128,.3)}
    .dd3-title{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px dashed rgba(255,255,255,.08)}
    .dd3-entity .dd3-title{color:#38bdf8}
    .dd3-vo .dd3-title{color:#86efac}
    .dd3-row{font-size:11px;color:#cbd5e1;padding:4px 0;display:flex;gap:8px}
    .dd3-key{color:#94a3b8;min-width:100px;font-family:'JetBrains Mono',monospace;font-size:10px}
    .dd3-code{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.65;color:#cbd5e1;background:rgba(0,0,0,.35);padding:10px 12px;border-radius:6px;white-space:pre;overflow-x:auto}
    .dd3-compare{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:4px;padding-top:14px;border-top:1px solid rgba(255,255,255,.06)}
  </style>
  <div style="text-align:center;margin-bottom:20px">
    <div style="font-size:16px;font-weight:700;color:#38bdf8">ENTITY vs VALUE OBJECT</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:4px">A distinção mais importante do DDD tático</div>
  </div>
  <div class="dd3-grid">
    <div class="dd3-card dd3-entity">
      <div class="dd3-title">Entity — identidade única</div>
      <div class="dd3-row"><span class="dd3-key">Identidade</span>tem ID único (User#123)</div>
      <div class="dd3-row"><span class="dd3-key">Igualdade</span>por ID, mesmo com campos diferentes</div>
      <div class="dd3-row"><span class="dd3-key">Mutabilidade</span>pode mudar campos mantendo identidade</div>
      <div class="dd3-row"><span class="dd3-key">Ciclo de vida</span>nasce, muda, morre — rastreável</div>
      <div class="dd3-row"><span class="dd3-key">Exemplos</span>User, Order, Product, Invoice</div>
    </div>
    <div class="dd3-card dd3-vo">
      <div class="dd3-title">Value Object — igualdade por valor</div>
      <div class="dd3-row"><span class="dd3-key">Identidade</span>sem ID — definido pelos valores</div>
      <div class="dd3-row"><span class="dd3-key">Igualdade</span>Money(100, BRL) == Money(100, BRL)</div>
      <div class="dd3-row"><span class="dd3-key">Mutabilidade</span>imutável — operações retornam novo VO</div>
      <div class="dd3-row"><span class="dd3-key">Ciclo de vida</span>sem ciclo — recriar é barato</div>
      <div class="dd3-row"><span class="dd3-key">Exemplos</span>Money, Address, CPF, Email, Quantity</div>
    </div>
    <div class="dd3-compare">
      <pre class="dd3-code">// Entity — igualdade por ID
class User {
  constructor(
    public readonly id: string,     // identidade
    public name: string,            // mutável
    public email: Email,            // VO encapsulado
  ) {}

  equals(other: User): boolean {
    return this.id === other.id     // ID decide
  }

  changeName(name: string) {
    this.name = name                // muta, id permanece
  }
}</pre>
      <pre class="dd3-code">// Value Object — igualdade por valor
class Money {
  private constructor(
    public readonly amount: number,    // readonly
    public readonly currency: string,  // readonly
  ) {}

  static of(amount: number, currency: string) {
    if (amount &lt; 0) throw new Error('Negativo')
    return new Money(amount, currency)
  }

  add(other: Money): Money {
    if (other.currency !== this.currency)
      throw new Error('Moedas diferentes')
    return new Money(this.amount + other.amount, this.currency)
  }

  equals(other: Money): boolean {
    return this.amount === other.amount
      &amp;&amp; this.currency === other.currency
  }
}</pre>
    </div>
  </div>
</div>`,
        caption: 'Regra prática: precisa rastrear ao longo do tempo com identidade? Entity. Definido pelos seus valores, imutável, sem ciclo de vida? Value Object.',
      },
    ],
    keypoints: [
      {
        title: 'Ubiquitous Language — o contrato entre devs e negócio',
        body: 'Vocabulário único entre dev, PO e especialista de domínio, refletido literalmente no código. Se o negócio fala "shipment" e o código tem "delivery", o tradutor humano vira fonte de bug. DDD obriga alinhamento: cada classe, método e variável usa o termo do domínio. Session de Event Storming com especialistas extrai esse vocabulário. O dia que o especialista consegue ler seu código e dizer "isso é exatamente o que fazemos" é o dia que o DDD funcionou.',
      },
      {
        title: 'Bounded Context — fronteira de modelo e linguagem',
        body: 'Fronteira lógica onde um modelo coeso faz sentido. Customer em Sales tem limite de crédito, histórico de compra e score. Customer em Support tem tickets abertos e SLA. Customer em Shipping tem endereços e preferências de entrega. Mesmo nome, modelos completamente diferentes — e está correto. Tentar unificar num único modelo "Customer" gera monstruosidade. Context Map descreve como os bounded contexts se relacionam.',
      },
      {
        title: 'Aggregate Root — guardião de invariantes',
        body: 'Aggregate é cluster de entidades e VOs tratados como unidade transacional. Aggregate Root é a única porta de entrada — nenhum código externo acessa entidades filhas diretamente. Root garante invariantes: "Order não pode ser confirmado sem itens", "Order não pode ser cancelado se já enviado". Transação toca um aggregate só. Vernon: "design small aggregates" — aggregate gigante é o erro #1.',
        code: `// Aggregate Root com invariantes
export class Order {
  private constructor(
    public readonly id: string,
    private items: OrderItem[],
    private status: 'pending' | 'confirmed' | 'cancelled',
  ) {}

  static create(): Order {
    return new Order(crypto.randomUUID(), [], 'pending')
  }

  addItem(sku: string, qty: number, price: Money): void {
    if (this.status !== 'pending') throw new OrderAlreadyClosedError()
    this.items.push(new OrderItem(sku, qty, price))  // entity filha
  }

  confirm(): OrderConfirmed {
    if (this.items.length === 0) throw new EmptyOrderError()  // invariante
    if (this.status !== 'pending') throw new InvalidStatusError()
    this.status = 'confirmed'
    return new OrderConfirmed(this.id, this.total())  // domain event
  }

  // ⚠ Não expor items diretamente — getter retorna cópia
  getItems(): ReadonlyArray<OrderItem> { return [...this.items] }
}`,
      },
      {
        title: 'Entity vs Value Object — identidade vs valor',
        body: 'Entity tem identidade única que persiste mesmo com campos mutados (User#123 é o mesmo usuário mesmo trocando o nome). Igualdade por ID. Value Object é imutável e definido pelos seus valores — Money(100, BRL) é igual a qualquer outro Money(100, BRL). Sem ID. Operações retornam novo VO. Benefício: VO simplifica raciocínio (sem efeito colateral, sem rastrear quem mudou o que), centraliza validação (CPF inválido no construtor) e encapsula comportamento (Money.add(), Money.convert()).',
        code: `// Value Object — imutável, igualdade por valor
export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: 'BRL' | 'USD',
  ) {}

  static of(amount: number, currency: 'BRL' | 'USD'): Money {
    if (amount < 0) throw new Error('Valor negativo')
    return new Money(Math.round(amount * 100) / 100, currency)
  }

  static zero(currency: 'BRL' | 'USD') { return Money.of(0, currency) }

  add(other: Money): Money {
    if (other.currency !== this.currency) throw new CurrencyMismatchError()
    return Money.of(this.amount + other.amount, this.currency)
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency
  }
}

// Uso: operações nunca mutam, retornam novo Money
const total = items.reduce((sum, i) => sum.add(i.subtotal()), Money.zero('BRL'))`,
      },
      {
        title: 'Domain Events — fatos imutáveis do passado',
        body: 'Domain Event representa algo importante que aconteceu no domínio: OrderConfirmed, PaymentApproved, StockDepleted. É fato imutável, no passado. Desacopla reação: aggregate não precisa saber que vai enviar email, baixar estoque e notificar ERP — publica o evento, handlers reagem. Habilita event sourcing, saga e coreografia entre bounded contexts. Diferença crucial: Command é intenção ("confirme o pedido"), Event é fato ("pedido foi confirmado").',
        code: `// Domain Event — imutável, no passado
export class OrderConfirmed {
  constructor(
    public readonly orderId: string,
    public readonly total: Money,
    public readonly customerId: string,
    public readonly confirmedAt: Date = new Date(),
  ) {}
}

// Handler em bounded context separado (Inventory)
export class ReserveStockOnOrderConfirmed {
  async handle(event: OrderConfirmed): Promise<void> {
    // Inventory não conhece Order — só precisa do evento
    await this.stockRepo.reserve(event.orderId, event.items)
  }
}

// Publicação no Application Service (com outbox pra garantia)
async confirmOrder(orderId: string): Promise<void> {
  const order = await this.orderRepo.findById(orderId)
  const event = order.confirm()
  await this.orderRepo.save(order)           // persiste estado
  await this.outbox.publish(event)            // at-least-once via outbox
}`,
      },
      {
        title: 'Repository — abstração de persistência por aggregate',
        body: 'Repository abstrai persistência por aggregate root — save(aggregate), findById(id), talvez findByCustomerId. Não tem findByEmail em OrderRepository — Email é campo de Customer, não de Order. Não tem 40 métodos custom de query — query complexa vai para read model (CQRS). Contrato define interface no domínio; implementação fica no adapter de infra. Não é DAO: esconde detalhes de persistência e trabalha com domain entities, não com rows.',
        code: `// Interface no domínio
export interface IOrderRepository {
  save(order: Order): Promise<void>
  findById(id: string): Promise<Order | null>
  findByCustomerId(customerId: string): Promise<Order[]>
  // ✗ NÃO: findByProductSku, findByDateRange, findByStatus — vai pro read model
}

// Implementação no adapter de infra (Prisma)
export class PrismaOrderRepository implements IOrderRepository {
  async save(order: Order): Promise<void> {
    const data = OrderMapper.toPersistence(order)
    await this.prisma.order.upsert({ where: { id: order.id }, create: data, update: data })
  }
}`,
      },
      {
        title: 'Domain Service — lógica que não pertence a nenhuma entity',
        body: 'Quando um comportamento de domínio naturalmente envolve múltiplas entidades ou aggregates, mas não pertence a nenhum deles, entra o Domain Service. Exemplo: TransferFunds entre dois BankAccount — pertence a ambos, mas nenhum dos dois deve chamar o outro. O Domain Service executa a transferência recebendo ambos. Difere de Application Service: Domain Service contém regra de negócio; Application Service orquestra (chama repo, publica evento, lida com I/O).',
        code: `// Domain Service — regra de negócio que cruza aggregates
export class PricingService {
  // Regra: desconto depende do cliente E do produto
  // Não pertence só a Customer nem só a Product
  calculateDiscount(customer: Customer, product: Product): Money {
    if (customer.isPremium() && product.isDiscountable()) {
      return product.price.multiply(0.15)
    }
    if (customer.hasCoupon('BLACK_FRIDAY')) {
      return product.price.multiply(0.10)
    }
    return Money.zero('BRL')
  }
}

// Application Service — orquestra
export class CreateOrderApplicationService {
  async exec(input: CreateOrderInput): Promise<void> {
    const customer = await this.customerRepo.findById(input.customerId)
    const product  = await this.productRepo.findById(input.productId)
    const discount = this.pricingService.calculateDiscount(customer, product)  // domain service
    const order = Order.create(customer.id, product, discount)
    await this.orderRepo.save(order)
    await this.outbox.publish(...order.pullEvents())
  }
}`,
      },
      {
        title: 'Anti-Corruption Layer — isolando domínios externos',
        body: 'ACL é camada de tradução entre seu bounded context e um sistema externo (legado, terceiro, contexto upstream que você não controla). Evita que vocabulário e modelo do externo poluam seu domínio. Se o ERP legado tem "CLIENTE_PF" e seu domínio tem "Customer", o ACL traduz — seu domínio nunca vê CLIENTE_PF. Se o modelo externo muda, só o ACL quebra. Padrão crítico em migração de legado e integração com sistemas SaaS.',
      },
      {
        title: 'Context Map — padrões de integração entre contextos',
        body: 'Shared Kernel: dois contextos compartilham um subconjunto do modelo — custo de coordenação alto. Customer-Supplier: upstream define API, downstream consome — upstream não conhece downstream. Conformist: downstream aceita modelo upstream sem adaptar — mais barato, mas acopla. ACL: downstream traduz modelo upstream para seu próprio modelo — mais caro, mas isolado. Open Host Service: upstream publica protocolo público estável. Published Language: protocolo compartilhado (ex: JSON Schema, Protobuf).',
      },
    ],
    cheatsheet: {
      title: 'DDD — Building blocks táticos e quando usar cada',
      html: `<div style="background:#0f172a;padding:30px 24px;border-radius:14px;font-family:'JetBrains Mono',monospace;color:#e2e8f0;">
  <style>
    .ddc-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .ddc-card{background:rgba(23,147,209,.06);border:1px solid rgba(23,147,209,.2);border-radius:8px;padding:14px 16px}
    .ddc-title{font-size:12px;font-weight:700;color:#38bdf8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(23,147,209,.2)}
    .ddc-row{font-size:11px;line-height:1.7;color:#cbd5e1;padding:3px 0}
    .ddc-row b{color:#38bdf8}
    .ddc-row code{background:rgba(0,0,0,.3);color:#86efac;padding:1px 5px;border-radius:3px;font-size:10px}
    .ddc-badge{display:inline-block;padding:1px 6px;border-radius:3px;font-size:9px;background:rgba(23,147,209,.2);color:#38bdf8;margin-right:4px}
    .ddc-banner{grid-column:1/-1;padding:12px 16px;background:linear-gradient(90deg,rgba(23,147,209,.2),rgba(23,147,209,.05));border-radius:8px;text-align:center;font-family:'Plus Jakarta Sans',sans-serif;color:#38bdf8;font-weight:700;font-size:13px}
  </style>
  <div class="ddc-grid">
    <div class="ddc-banner">DDD TÁTICO — BUILDING BLOCKS COM QUANDO USAR</div>
    <div class="ddc-card">
      <div class="ddc-title">Entity</div>
      <div class="ddc-row"><b>Quando:</b> precisa de identidade + rastreabilidade ao longo do tempo</div>
      <div class="ddc-row"><b>Igualdade:</b> por ID (<code>user.id === other.id</code>)</div>
      <div class="ddc-row"><b>Mutável:</b> sim (campos mudam, identidade permanece)</div>
      <div class="ddc-row"><b>Exemplos:</b> User, Order, Product, Invoice</div>
    </div>
    <div class="ddc-card">
      <div class="ddc-title">Value Object</div>
      <div class="ddc-row"><b>Quando:</b> valor imutável sem identidade, com comportamento</div>
      <div class="ddc-row"><b>Igualdade:</b> por valor (<code>m1.amount === m2.amount &amp;&amp; ...</code>)</div>
      <div class="ddc-row"><b>Mutável:</b> não — retorna novo VO</div>
      <div class="ddc-row"><b>Exemplos:</b> Money, Address, CPF, Email, DateRange</div>
    </div>
    <div class="ddc-card">
      <div class="ddc-title">Aggregate</div>
      <div class="ddc-row"><b>Quando:</b> cluster de entities com invariante transacional</div>
      <div class="ddc-row"><b>Root:</b> única porta de entrada — esconde entidades filhas</div>
      <div class="ddc-row"><b>Tamanho:</b> pequeno (Vernon) — 1 transação = 1 aggregate</div>
      <div class="ddc-row"><b>Exemplos:</b> Order+Items, BankAccount+Transactions</div>
    </div>
    <div class="ddc-card">
      <div class="ddc-title">Domain Event</div>
      <div class="ddc-row"><b>Quando:</b> fato imutável do passado que outros contexts se importam</div>
      <div class="ddc-row"><b>Nome:</b> sempre no passado (OrderPlaced, PaymentApproved)</div>
      <div class="ddc-row"><b>Imutável:</b> sim — readonly em todos os campos</div>
      <div class="ddc-row"><b>Uso:</b> desacoplamento, Event Sourcing, Saga</div>
    </div>
    <div class="ddc-card">
      <div class="ddc-title">Repository</div>
      <div class="ddc-row"><b>Quando:</b> persistência de aggregate root (1 repo por aggregate)</div>
      <div class="ddc-row"><b>Interface:</b> no domínio; implementação na infra</div>
      <div class="ddc-row"><b>Métodos:</b> save, findById — poucos</div>
      <div class="ddc-row"><b>Query complexa:</b> → read model (CQRS)</div>
    </div>
    <div class="ddc-card">
      <div class="ddc-title">Domain Service vs Application Service</div>
      <div class="ddc-row"><b>Domain Service:</b> regra de negócio que cruza aggregates</div>
      <div class="ddc-row"><code>PricingService.calculate(customer, product)</code></div>
      <div class="ddc-row"><b>Application Service:</b> orquestra (repo + domain service + evento)</div>
      <div class="ddc-row"><code>CreateOrderUseCase.exec(input)</code></div>
    </div>
    <div class="ddc-card" style="grid-column:1/-1">
      <div class="ddc-title">Context Map — padrões de integração</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:4px;font-size:11px">
        <div><span class="ddc-badge">Shared Kernel</span><span style="color:#94a3b8">modelo compartilhado — coordenação alta</span></div>
        <div><span class="ddc-badge">Customer-Supplier</span><span style="color:#94a3b8">upstream define API, downstream consome</span></div>
        <div><span class="ddc-badge">ACL</span><span style="color:#94a3b8">traduz modelo externo — isola domínio</span></div>
        <div><span class="ddc-badge">Conformist</span><span style="color:#94a3b8">aceita modelo upstream sem adaptar</span></div>
        <div><span class="ddc-badge">Open Host</span><span style="color:#94a3b8">upstream publica protocolo público estável</span></div>
        <div><span class="ddc-badge">Published Lang</span><span style="color:#94a3b8">protocolo compartilhado (Protobuf, JSON Schema)</span></div>
      </div>
    </div>
  </div>
</div>`,
      caption: 'Building blocks são ferramentas — não rituais. Aplica cada um onde o domínio pede, não pra "fazer DDD".',
    },
    mnemonics: [
      {
        label: 'Strategic DDD — BCU',
        trick: 'Bounded Context · Context Map · Ubiquitous Language',
        explanation: 'Os três pilares estratégicos do DDD. Bounded Context = onde o modelo faz sentido. Context Map = como os contextos se relacionam. Ubiquitous Language = o vocabulário que une devs e negócio. Sem os três, você tem patterns sem estratégia.',
      },
      {
        label: 'Tactical building blocks — EVARDS',
        trick: 'Entity · Value Object · Aggregate · Repository · Domain Service',
        explanation: 'Os cinco building blocks táticos principais. E=Entity (identidade), V=Value Object (valor), A=Aggregate (cluster com root), R=Repository (persistência por aggregate), D=Domain Service (regra que cruza aggregates). Domain Events seriam o 6º — adicione um S de "Stories" se quiser incluir.',
      },
      {
        label: 'Aggregate Rule — "Small, root, one transaction"',
        trick: 'Design small aggregates. Root is the only door. One transaction per aggregate.',
        explanation: 'As três regras de ouro do Vaughn Vernon para aggregates. Se seu aggregate tem 10+ entidades filhas, está grande demais. Se código externo acessa entidade filha diretamente, quebrou a fronteira. Se uma transação toca 2 aggregates, você precisa de eventual consistency ou redesenhou a fronteira.',
      },
      {
        label: 'Entity vs VO — "ID ou Valor?"',
        trick: 'Precisa rastrear? Entity. Definido pelos valores? Value Object.',
        explanation: 'Pergunta rápida pra decidir: "preciso rastrear essa coisa ao longo do tempo com identidade própria?" SIM → Entity. NÃO → pergunta "é imutável e definido pelos seus valores?" SIM → Value Object. A resposta errada gera IDs desnecessários (overengineering) ou mutabilidade onde não deveria ter (bug).',
      },
    ],
    gotchas: [
      'Aplicar DDD em CRUD sem regra de negócio rica — vira pasta cheia de classe com getter/setter sem comportamento. "Anemic domain model" com boilerplate de DDD é o pior dos dois mundos.',
      'Aggregate gigante — Order com 200 OrderItems em uma transação gera lock contention, queries pesadas e acoplamento. Design small aggregates; eventual consistency entre aggregates.',
      'Bounded context virar microservice 1:1 sem análise — context é lógico, microservice é físico. Começa com monolito modular com bounded contexts bem separados, migra pra microservice quando a dor justificar.',
      'Confundir DTO com Value Object — DTO é bag de dados para transferência (sem comportamento). VO tem comportamento (Money.add, Money.convert) e regra de validação (CPF.validate). São coisas diferentes.',
      'Repository com 50 métodos custom (findByEmail, findByDateRange, findByStatus) — virou DAO disfarçado. Mantenha repository pequeno: save, findById, findByRoot. Queries complexas vão para read model (CQRS).',
      'Ubiquitous language só no diagrama — se não está no código (classes, métodos, variáveis), não é DDD. O código deve refletir literalmente o vocabulário que o especialista de domínio usa.',
      'Domain Event sem outbox — publicar evento direto após salvar tem race condition: salva, falha antes de publicar, dado inconsistente. Use transactional outbox para at-least-once garantido.',
      'Aplicar DDD sem especialista de domínio disponível — linguagem ubíqua emerge de conversa, não de suposição. Sem acesso ao negócio, você está inventando domínio, não modelando.',
    ],
    interview: [
      {
        q: 'Qual a diferença entre Entity e Value Object?',
        level: 'pleno',
        a: '<p><strong>Entity</strong> tem identidade única que persiste mesmo com campos mutados. User#123 continua sendo o mesmo usuário mesmo trocando nome e email. Igualdade por ID. Rastreável ao longo do tempo.</p><p><strong>Value Object</strong> não tem identidade — é definido pelos seus valores. <code>Money(100, BRL)</code> é igual a qualquer outro <code>Money(100, BRL)</code>, independente de qual instância. Imutável — operações retornam novo VO. Sem efeito colateral. Centraliza validação (CPF inválido no construtor) e encapsula comportamento (<code>Money.add()</code>, <code>CPF.format()</code>).</p><p>Pergunta de decisão rápida: <em>"preciso rastrear ao longo do tempo com identidade?"</em> SIM → Entity. NÃO → VO.</p><p>Erro clássico: criar entity com ID pra tudo — Address com UUID quando é VO natural (imutável, igualdade por valores dos campos). Gera banco desnecessário, queries mais complexas, e perde a imutabilidade.</p>',
        tip: 'Dê exemplo concreto de VO com comportamento real (Money.add, Money.convert) — mostra que VO não é só "struct readonly".',
      },
      {
        q: 'O que é um Aggregate Root e por que importa?',
        level: 'pleno',
        a: '<p>Aggregate Root é a classe principal de um cluster de entidades que devem ser tratadas como unidade transacional. É a <strong>única porta de entrada</strong> — nenhum código externo acessa entidades filhas diretamente.</p><p>Por que importa:</p><ol><li><strong>Garante invariantes:</strong> root valida todas as regras que envolvem o cluster inteiro. "Order não confirma sem itens" só é verificável se root controla o acesso a items.</li><li><strong>Transação única:</strong> uma transação toca um aggregate. Você não abre transação que salva Order e Customer ao mesmo tempo — se precisar, usa eventual consistency via Domain Event.</li><li><strong>Encapsulamento:</strong> entidades filhas não existem sem o root. OrderItem não faz sentido sem Order. Root protege esse ciclo de vida.</li></ol><p>Anti-pattern: expor <code>order.items.push(item)</code> direto — quebra encapsulamento e os invariantes ficam fora do aggregate. Correto: <code>order.addItem(sku, qty, price)</code> — root valida e decide.</p>',
        tip: 'Sempre enfatize "invariante" — é o ponto central. Se não há invariante que exige o cluster, talvez não precise de aggregate.',
      },
      {
        q: 'Como você identifica bounded contexts num sistema novo?',
        level: 'senior',
        a: '<p>Uso <strong>Event Storming</strong> como técnica principal. Processo colaborativo com especialistas de negócio:</p><ol><li>Post-its laranja = Domain Events ("o que aconteceu?"). Colocar na ordem do tempo.</li><li>Post-its azuis = Commands ("o que causou?").</li><li>Post-its amarelos = Aggregates ("quem decidiu?").</li><li>Identificar onde a linguagem muda — "Order" em logística é diferente de "Order" em faturamento → bounded context diferente.</li></ol><p>Heurísticas complementares:</p><ul><li>Onde o vocabulário muda → fronteira de contexto.</li><li>O que muda junto fica junto → mesmo contexto.</li><li>O que muda independentemente pode ser separado.</li><li>Quem é o time dono? → cada time deveria ter um ou poucos contextos.</li></ul><p>Erro clássico: criar contexto por entidade (UserService, OrderService) ao invés de por modelo coeso. Isso gera distributed monolith onde cada request chama 5 serviços.</p>',
        tip: 'Cite Event Storming — é a técnica mais valorizada em entrevista sênior. Mostra que você conhece a prática além da teoria.',
      },
      {
        q: 'Quando você usaria Domain Events?',
        level: 'pleno',
        a: '<p>Domain Events quando:</p><ol><li><strong>Algo importante aconteceu no domínio</strong> que outros contextos se importam. OrderConfirmed → Inventory reserva estoque, Payments cobra, Notifications envia email. Sem eventos, cada handler seria responsabilidade do use case de Orders — acoplamento indevido.</li><li><strong>Desacoplar reação da ação.</strong> Order.confirm() não precisa saber que vai chamar email service. Publica OrderConfirmed, handlers reagem. Open/Closed no domínio.</li><li><strong>Event Sourcing</strong> como write side — eventos são o dado primário, estado é reconstruído.</li><li><strong>Saga</strong> — fluxo distribuído coordenado por eventos.</li></ol><p>Não usar Domain Events quando a reação é imediata, síncrona e no mesmo bounded context — adiciona complexidade sem ganho real.</p><p>Ponto crítico de implementação: publicar evento na mesma transação do aggregate (transactional outbox). Nunca publicar antes de salvar — inconsistência garantida em falha.</p>',
      },
      {
        q: 'Diferença entre Domain Service e Application Service?',
        level: 'pleno',
        a: '<p><strong>Domain Service</strong>: contém regra de negócio que não pertence a nenhuma entity ou aggregate isolado. Exemplos: <code>PricingService.calculateDiscount(customer, product)</code> — a regra depende dos dois. <code>TransferFunds.execute(from, to, amount)</code> — envolve dois BankAccounts. Domain Service trabalha com domain objects, sem I/O.</p><p><strong>Application Service</strong>: orquestra casos de uso. Não contém regra de negócio — chama repos para buscar aggregates, invoca métodos do domínio, publica eventos, retorna resultado. <code>CreateOrderUseCase.exec(input)</code>.</p><p>Confusão mais comum: colocar regra de negócio no Application Service. Isso é o "anemic domain model" — entities viram bags de dados sem comportamento, regra vai toda pro service, que fica gordo e difícil de testar. Regra de negócio deve estar na entity/aggregate/VO ou no Domain Service — lugares onde a lógica é testável sem I/O.</p>',
        tip: 'Teste prático: consegue testar sem banco, sem HTTP? Domain Service sim. Application Service não (precisa de repos). Se regra não é testável unitariamente, provavelmente está no lugar errado.',
      },
      {
        q: 'Como DDD e Clean Architecture se complementam?',
        level: 'senior',
        a: '<p>São perfeitamente complementares e costumam ser usados juntos:</p><ul><li><strong>DDD</strong> responde "o que construir" — Bounded Contexts, Aggregates, Domain Events, Ubiquitous Language.</li><li><strong>Clean Architecture</strong> responde "como organizar" — camadas, Dependency Rule, ports e adapters.</li></ul><p>Mapeamento típico:</p><ul><li>DDD Entities/VOs/Aggregates → Clean Arch Entities (camada central)</li><li>DDD Application Services → Clean Arch Use Cases</li><li>DDD Repositories (interface) → Clean Arch Ports (driven ports)</li><li>DDD Infrastructure (ORM, messaging) → Clean Arch Adapters</li></ul><p>Bounded Context vira pasta/módulo na estrutura do projeto. Cada contexto tem suas camadas (domain, application, infrastructure). Context Map define como pastas/módulos se comunicam.</p><p>Juntos: você tem vocabulário de negócio (DDD) com isolamento de dependência (Clean Arch) — código que um especialista de domínio reconhece E que é testável sem framework.</p>',
      },
      {
        q: 'O que é Anti-Corruption Layer e quando implementar?',
        level: 'senior',
        a: '<p>ACL é camada de tradução entre seu bounded context e um sistema externo que você não controla — legado, terceiro, parceiro, contexto upstream com modelo incompatível.</p><p>Protege seu domínio: se o ERP externo tem <code>PEDIDO_VENDA</code> com <code>COD_CLI</code> e <code>VLR_TOTAL</code>, seu domínio nunca vê esses termos. ACL converte pra <code>Order</code>, <code>customerId</code>, <code>totalAmount</code> — vocabulário do seu domínio.</p><p>Quando usar:</p><ol><li>Integração com sistema legado (campos bizarros, modelo incoerente)</li><li>API de terceiro que você não controla e pode mudar</li><li>Bounded context upstream com modelo incompatível</li><li>Migração gradual de legado — ACL isola enquanto migra</li></ol><p>Quando não usar: sistema externo tem modelo limpo e você pode ser Conformist sem custo. ACL tem custo (mais código, ponto de tradução, teste próprio) — só vale quando o externo é realmente incompatível.</p>',
      },
      {
        q: 'Quando NÃO usar DDD?',
        level: 'pleno',
        a: '<p>CRUD simples sem regra de negócio rica — DDD vira cerimônia cara. Se 90% das operações são "salva no banco e devolve", você está criando entity/aggregate/repository pra nada. Controller → Service → ORM direto resolve com muito menos código.</p><p>Outros casos pra não usar:</p><ul><li><strong>Time sem acesso a especialista de domínio</strong>: DDD depende de conversa com negócio pra extrair Ubiquitous Language. Sem isso, você inventa domínio em vez de modelar.</li><li><strong>Produto pré-PMF</strong>: modelo muda toda semana. Clean Arch + DDD trava pivot. Prefere simplicidade até estabilizar.</li><li><strong>Time inexperiente</strong>: aplica cargo-cult (pasta com nomes DDD, entidades anêmicas, services com toda regra).</li><li><strong>Prazo muito curto</strong>: ROI de DDD é longo prazo. MVP em 2 semanas → CRUD.</li></ul><p>Critério: <strong>complexidade do domínio × vida do sistema</strong>. Fintech com regras fiscais complexas + sistema de 10 anos → DDD faz sentido. Dashboard interno de analytics → não.</p>',
        tip: 'Demonstrar que sabe quando não usar é tão importante quanto saber usar. Filtra arquitetos cargo-cult.',
      },
      {
        q: 'O que é Ubiquitous Language e como garantir na prática?',
        level: 'pleno',
        a: '<p>Vocabulário único entre devs, PO, e especialistas de domínio, refletido <strong>literalmente no código</strong>. Se negócio fala "shipment" e código tem "delivery", o tradutor humano vira bug. Cada classe, método, variável, tabela usa o termo do domínio.</p><p>Como garantir na prática:</p><ol><li><strong>Event Storming</strong> com especialistas de negócio — extrai o vocabulário direto da fonte.</li><li><strong>Glossário no repositório</strong> — documento vivo com termos definidos e exemplos.</li><li><strong>Code review</strong> foca em nomenclatura — PR com "delivery" quando deveria ser "shipment" é rejeitado.</li><li><strong>Testes que falam o domínio</strong> — test("quando pedido é confirmado sem itens, deve lançar erro") em vez de test("should throw when items is empty").</li><li><strong>Conversa constante</strong> — dev mostra o código pro especialista. Se ele não reconhece, o código está errado.</li></ol><p>O sinal de sucesso: especialista de negócio consegue ler um teste ou um use case e reconhecer como o processo que ele executa todos os dias.</p>',
      },
      {
        q: 'Como definir o tamanho correto de um aggregate?',
        level: 'senior',
        a: '<p>Vaughn Vernon (Implementing DDD): <em>"design small aggregates"</em>. Aggregate gigante é o erro #1 de iniciante.</p><p>Critério principal: <strong>a invariante que precisa ser mantida consistentemente</strong>.</p><ul><li>Se invariante exige ver dois objetos juntos pra validar → mesmo aggregate</li><li>Se a regra tolera eventual consistency ("estoque vai ser atualizado em segundos") → aggregates separados, ligados por ID, comunicação via Domain Event</li></ul><p>Heurísticas práticas:</p><ol><li>Quanto menor, mais concorrência escalável (menos lock contention)</li><li>Transação em aggregate grande = risco de conflito de escrita em sistemas concorrentes</li><li>Aggregate com 10+ entidades filhas → candidato a quebrar</li><li>Order com OrderItems: ok (invariante "total" precisa de todos os itens). Order com CustomerInfo inteiro: errado (Customer é aggregate próprio, ligado só por customerId)</li></ol><p>Em caso de dúvida: começa menor, une se a invariante exigir. Mais fácil crescer do que quebrar.</p>',
      },
      {
        q: 'Tradeoff entre rich domain model e anemic model + service?',
        level: 'senior',
        a: '<p><strong>Anemic model + Service:</strong> entities são bags de dados (só getters/setters), toda lógica nos services. Rápido de escrever, baixa curva, familiar. Risco: regra de negócio espalha pelos services (difícil de achar, de testar, de evoluir), duplicação de validação, sem encapsulamento real.</p><p><strong>Rich model (DDD):</strong> comportamento mora na entity/VO/aggregate. <code>order.confirm()</code> valida invariantes internamente. Encapsulamento real. Testável unitariamente sem banco. Mais código upfront, conversa constante com negócio, time disciplinado.</p><p>Quando cada um ganha:</p><ul><li><strong>Anemic:</strong> CRUD simples, reporting, dados fluem diretamente do banco pro cliente, sem regra rica.</li><li><strong>Rich model:</strong> domínio com regras complexas (fiscal, financeiro, fluxos de aprovação), invariantes que precisam ser garantidas, time experiente com acesso a especialista de domínio.</li></ul><p>Anti-pattern comum: rich model com entidades "gordas" mas com toda lógica nos Application Services. Cheiro: entity tem 50 getters, Application Service tem método de 200 linhas. Não é DDD — é anemic model com nomes de DDD.</p>',
      },
      {
        q: 'Como bounded contexts se relacionam com microservices?',
        level: 'senior',
        a: '<p>Bounded context é <strong>lógico</strong> — fronteira de modelo e linguagem. Microservice é <strong>físico</strong> — fronteira de deploy e processo.</p><p>Não há relação 1:1 obrigatória. Um microservice pode conter múltiplos bounded contexts (se forem pequenos e relacionados). Um bounded context pode ser servido por múltiplos microservices (raro — aumenta complexidade). O erro mais comum: criar um microservice por entidade (UserService, OrderService, ItemService) sem analisar bounded contexts — gera distributed monolith onde todo request cruza 5 serviços.</p><p>Abordagem recomendada:</p><ol><li>Começa com monolito modular com bounded contexts bem separados (pastas, módulos)</li><li>Extrai pra microservice quando: escala independente justificada, deploy independente necessário, time autônomo claro, ou tecnologia específica requerida</li><li>Cada extração segue a fronteira do bounded context — não cria fronteiras artificiais novas</li></ol><p>Heurística de Newman: se precisa fazer deploy coordenado de dois serviços, a fronteira está errada.</p>',
        tip: 'Mostrar que contexto ≠ microservice é diferencial de sênior. Junior acha que são sinônimos.',
      },
      {
        q: 'Como você implementa Domain Events com garantia de entrega?',
        level: 'senior',
        a: '<p>Problema clássico: após aggregate.confirm(), publicar evento diretamente em Kafka/RabbitMQ tem race condition — salva, falha antes de publicar, estado inconsistente.</p><p><strong>Transactional Outbox Pattern</strong> — solução padrão:</p><ol><li>Na mesma transação do aggregate: salva estado + escreve evento em tabela <code>outbox_events</code></li><li>Worker (ou CDC via Debezium) le da outbox e publica no message broker</li><li>At-least-once garantido: se falhar após publicar, relay tenta de novo. Idempotência nos handlers é obrigatória.</li></ol><p>Implementação TypeScript (Prisma):</p><pre><code>await prisma.$transaction(async (tx) => {\n  await tx.order.update({ where: { id }, data: orderData })\n  await tx.outboxEvent.create({ data: {\n    type: \'OrderConfirmed\',\n    payload: JSON.stringify(event),\n    status: \'PENDING\',\n  }})\n})</code></pre><p>Alternativa: CDC (Debezium) le WAL do Postgres e pública em Kafka diretamente — sem outbox table manual, mais elegante, mas complexidade operacional maior.</p><p>Anti-pattern: <code>aggregate.confirm()</code> → <code>repo.save()</code> → <code>eventBus.publish()</code> sem transação. Falha entre save e publish = dado inconsistente.</p>',
      },
      {
        q: 'O que é Event Storming e como usaria?',
        level: 'senior',
        a: '<p>Event Storming (Alberto Brandolini) é técnica colaborativa para explorar domínio. Sala grande, post-its coloridos, especialistas de negócio e devs juntos.</p><p>Fluxo básico (Big Picture Event Storming):</p><ol><li><strong>Laranja — Domain Events:</strong> "O que acontece no negócio?" — OrderPlaced, PaymentFailed, ShipmentDispatched. Na ordem temporal, sem julgamento.</li><li><strong>Azul — Commands:</strong> "O que causou o evento?" — PlaceOrder causa OrderPlaced. Mostrar quem dispara.</li><li><strong>Amarelo — Aggregates:</strong> "Quem processou o comando?" — Order aggregate.</li><li><strong>Roxo — Policies:</strong> "Quando X acontece, Y deve acontecer." — Automações e reações.</li><li><strong>Rosa — External Systems:</strong> sistemas fora do nosso controle.</li></ol><p>Resultado: você enxerga bounded contexts onde a linguagem muda, onde os eventos se agrupam, onde há pivoting points. Ubiquitous Language emerge naturalmente da sessão — todos usam os mesmos termos.</p><p>Dura 4-8h pra sistema médio. Mais valioso que qualquer documento de requisito porque é gerado pela conversa real com o negócio.</p>',
        tip: 'Citar Event Storming e Alberto Brandolini é sinal de maturidade em DDD. Mostra que você conhece a prática além do livro do Evans.',
      },
      {
        q: 'Como você testa lógica de domínio em DDD?',
        level: 'pleno',
        a: '<p>O grande ganho de DDD é que a lógica de negócio fica encapsulada em Entities, VOs e Aggregates — objetos que têm <strong>zero dependência de infraestrutura</strong>. Isso torna o teste de domínio trivial e rápido.</p><p>Exemplo concreto:</p><pre><code>// Sem banco, sem framework, sem mock\nconst order = Order.create(\'customer-1\')\norder.addItem(\'sku-123\', 2, Money.of(50, \'BRL\'))\norder.confirm()\nexpect(order.status).toBe(\'confirmed\')\nexpect(order.total.amount).toBe(100)\nexpect(order.domainEvents).toContainEqual(\n  expect.objectContaining({ type: \'OrderConfirmed\' })\n)</code></pre><p>Estrutura de testes:</p><ul><li><strong>Unit domain tests</strong>: instanciam aggregate direto, sem mock. Testam invariantes, transições de estado, eventos emitidos. Rodamem &lt;1ms cada.</li><li><strong>Builder pattern nos testes</strong>: <code>OrderBuilder.create().withItems(3).inConfirmedState().build()</code> — torna fixtures legíveis e reutilizáveis.</li><li><strong>Testes nominativos</strong>: <code>test(\'quando pedido é confirmado sem itens, lança EmptyOrderError\')</code> — lê como especificação de negócio.</li></ul><p>O que <em>não</em> entra no teste de domínio: banco, HTTP, ORM, mensageria. Se precisou de mock de infraestrutura, a regra de negócio vazou de camada.</p>',
        tip: 'Mostrar código de teste de aggregate sem nenhum mock de infra é a melhor prova de que você entende o benefício central do DDD tático.',
      },
      {
        q: 'O que é um Domain Service e como difere de Application Service?',
        level: 'pleno',
        a: '<p>Tanto Domain Service quanto Application Service são classes de serviço, mas com responsabilidades completamente diferentes:</p><ul><li><strong>Domain Service</strong>: contém lógica de negócio que não pertence naturalmente a nenhum aggregate ou VO. Opera apenas com objetos de domínio, sem I/O. Exemplos: <code>PricingService.calculate(customer, cart, promoCode)</code> que depende de múltiplos aggregates; <code>FundsTransferService.transfer(fromAccount, toAccount, amount)</code> que envolve dois aggregates distintos.</li><li><strong>Application Service</strong> (Use Case): orquestra — busca aggregates via repositório, chama domain service ou aggregate, salva resultado, publica eventos. Não contém regra de negócio — é o maestro, não o músico.</li></ul><p>Sinal de alarme: Application Service com <code>if (order.status === \'confirmed\' && payment.amount > 1000)</code> — isso é regra de negócio no lugar errado. Deveria estar no aggregate ou domain service.</p><p>Outro sinal: Domain Service que chama repositório diretamente — violação, pois acoplou domínio a infraestrutura. Domain Service recebe os objetos como parâmetro; Application Service é quem os busca no repositório.</p>',
        tip: 'Essa pergunta é frequentíssima e muitos confundem. A resposta clara com exemplos concretos e anti-patterns mostra domínio real do assunto.',
      },
      {
        q: 'Como você lida com invariantes que cruzam aggregates?',
        level: 'senior',
        a: '<p>Invariante que cruza aggregates é o caso mais delicado de DDD. A regra de ouro de Vaughn Vernon: <strong>apenas um aggregate por transação</strong>. Então como garantir invariante entre dois?</p><p>Três estratégias, ordenadas por preferência:</p><ol><li><strong>Redefinir o limite do aggregate.</strong> Se a invariante é "um cliente não pode ter mais de 3 pedidos ativos", talvez <code>CustomerOrderPolicy</code> seja um aggregate que encapsula os IDs dos pedidos ativos do cliente. Você re-examina a fronteira antes de aceitar que precisa de transação cruzada.</li><li><strong>Eventual consistency via Domain Events.</strong> Order é confirmado (transação 1, aggregate Order). OrderConfirmed event dispara handler no contexto de Inventory que reserva estoque (transação 2, aggregate Inventory). A consistência é eventual — aceita pelo negócio. Esta é a solução padrão quando negócio tolerainconssistência temporária.</li><li><strong>Saga.</strong> Sequência de transações locais coordenadas por eventos ou orquestrador. Cada passo toca um aggregate. Em falha, compensating transactions desfazem os passos anteriores.</li></ol><p>O que <em>não</em> fazer: transação que salva dois aggregates ao mesmo tempo. Cria acoplamento físico, mata concorrência, e mostra fronteira de aggregate errada.</p>',
        tip: 'Essa é pergunta de nível sênior puro. Quem responde "coloco numa transação só" não entende DDD. Quem diferencia as três estratégias e menciona Eventual Consistency está no nível certo.',
      },
      {
        q: 'Como você representa estados complexos em DDD? (State Machine)',
        level: 'senior',
        a: '<p>Aggregates com múltiplos estados (Order: pending → confirmed → paid → shipped → delivered | cancelled) são naturalmente State Machines. Em DDD, modelar isso explicitamente tem benefícios concretos:</p><p><strong>Abordagem com enum + guard clauses:</strong></p><pre><code>type OrderStatus = \'pending\' | \'confirmed\' | \'shipped\' | \'cancelled\'\n\nclass Order {\n  confirm(): void {\n    if (this.status !== \'pending\') throw new InvalidStatusTransitionError()\n    this._status = \'confirmed\'\n    this.addEvent(new OrderConfirmed(this.id))\n  }\n\n  ship(): void {\n    if (this.status !== \'confirmed\') throw new InvalidStatusTransitionError()\n    this._status = \'shipped\'\n  }\n}</code></pre><p><strong>Abordagem com State pattern</strong>: cada estado é uma classe que implementa as transições válidas. Lança erro em transições inválidas automaticamente. Mais verboso, mas torna estados explícitos e elimina guard clauses espalhadas pelo aggregate.</p><p>Vantagens de modelar explicitamente:</p><ul><li>Transições inválidas são impossíveis de chegar ao banco</li><li>Testes documentam o fluxo de negócio</li><li>Domain Events acoplados à transição (confirmação sempre emite <code>OrderConfirmed</code>)</li><li>Histórico de estados é naturalmente o Event Log em Event Sourcing</li></ul><p>Persisto o estado como string (enum serializado) no banco. A State Machine vive no domínio, não na tabela.</p>',
        tip: 'Modelar State Machine explicitamente em aggregates mostra nível avançado. Citar as duas abordagens (enum + guard vs State pattern) com prós/contras é sênior diferenciado.',
      },
      {
        q: 'Qual a relação entre Repository e Unit of Work em DDD?',
        level: 'senior',
        a: '<p>Em DDD, <strong>Repository</strong> provê a ilusão de que o aggregate existe numa coleção em memória: <code>orderRepo.findById(id)</code>, <code>orderRepo.save(order)</code>. O repositório abstrai completamente a persistência — use case não sabe se é Postgres, Mongo ou arquivo.</p><p><strong>Unit of Work (UoW)</strong> rastreia todas as mudanças feitas durante uma operação de negócio e as aplica numa única transação ao final. É o coordenador de transação que o repository usa.</p><p>Integração prática com Prisma:</p><pre><code>// IUnitOfWork no domínio (application layer)\ninterface IUnitOfWork {\n  run&lt;T&gt;(work: (repos: BoundRepos) => Promise&lt;T&gt;): Promise&lt;T&gt;\n}\n\n// Implementação na infra\nclass PrismaUnitOfWork implements IUnitOfWork {\n  async run&lt;T&gt;(work: (repos) => Promise&lt;T&gt;): Promise&lt;T&gt; {\n    return this.prisma.$transaction(async tx => {\n      const repos = { orders: new PrismaOrderRepo(tx), ... }\n      return work(repos)\n    })\n  }\n}</code></pre><p>Quando usar: use cases que tocam múltiplos aggregates precisam de coordenação transacional. UoW encapsula isso sem vazar transação ao domínio. Repositories filhos do UoW compartilham a mesma conexão de transação.</p><p>Cuidado: UoW não é obrigatório quando use case toca só 1 aggregate — repositório único com save() já é suficiente.</p>',
        tip: 'Integrar Repository com Unit of Work e mostrar código com Prisma.$transaction é diferencial raro. Muitos sabem o conceito; poucos sabem implementar.',
      },
      {
        q: 'Como você aborda DDD num time que nunca usou antes?',
        level: 'senior',
        a: '<p>Introduzir DDD no time inteiro de uma vez é o caminho mais rápido para cargo-cult — nomes DDD, zero benefício. Estratégia incremental que funciona:</p><ol><li><strong>Começa pelo vocabulário, não pelo código.</strong> Um glossário de domínio no repositório, construído com o PO. Toda reunião usa os termos. Toda PR usa os termos. Só isso já tem impacto sem mudar arquitetura.</li><li><strong>Escolhe o módulo mais dolorido</strong> — onde há mais bug, mudança mais difícil, teste mais lento. Aplica DDD tático lá: entity com comportamento, aggregate root, domain events. Faz o antes/depois visível pra todo o time.</li><li><strong>Workshop interno de 3h</strong>: Event Storming simplificado do módulo escolhido com o time inteiro. Não precisa de Brandolini ao vivo — um post de blog e post-its digitais bastam. O time vê o domínio pelo olhar do negócio pela primeira vez.</li><li><strong>Pair programming nos primeiros aggregates.</strong> Não code review depois — par durante. Decisões de design emergem na conversa, não em comentário de PR 2 dias depois.</li></ol><p>Armadilha: querer convencer o time de que "DDD é melhor". Não funciona. Mostra o problema que resolve, aplica no código que todos conhecem, e deixa o resultado falar.</p>',
        tip: 'Pergunta sobre liderança técnica disfarçada de DDD. Resposta mostra que você pensa em adoção, não apenas em expertise técnica individual.',
      },
    ],
    exercises: [
      {
        level: 'iniciante',
        title: 'Modelar Order Aggregate com invariantes',
        description: 'Implemente a classe <code>Order</code> como Aggregate Root com: (1) factory method estático <code>Order.create(customerId)</code>, (2) método <code>addItem(sku, qty, price: Money)</code> que rejeita item com qty <= 0, (3) método <code>confirm()</code> que lança <code>EmptyOrderError</code> se sem itens e <code>InvalidStatusError</code> se já confirmado, (4) método <code>cancel(reason)</code> que lança erro se já enviado, (5) método <code>total()</code> que retorna <code>Money</code>. Escreva testes unitários para cada invariante sem usar banco ou framework.',
        concepts: ['Aggregate Root', 'invariantes', 'Entity', 'Value Object', 'teste unitário de domínio'],
        hint: 'Items são entidades filhas encapsuladas (não expor direto). Status é enum de estados válidos. Teste todas as transições inválidas — isso documenta as invariantes do domínio.',
        relatedKeypoints: [2, 3],
      },
      {
        level: 'iniciante',
        title: 'Implementar Value Object Money imutável',
        description: 'Implemente <code>Money</code> como Value Object: (1) construtor privado, factory <code>Money.of(amount, currency)</code> que rejeita valor negativo, (2) <code>add(other: Money): Money</code> que lança <code>CurrencyMismatchError</code> se moedas diferentes, (3) <code>multiply(factor: number): Money</code>, (4) <code>equals(other: Money): boolean</code> por valor, (5) <code>isGreaterThan(other: Money): boolean</code>. Escreva testes que provam imutabilidade (add retorna novo Money, não muta o original) e igualdade por valor.',
        concepts: ['Value Object', 'imutabilidade', 'igualdade por valor', 'encapsulamento de validação'],
        hint: 'Todos os campos são readonly. add() retorna new Money(...) nunca muta this. equals() compara amount E currency. Arredonda amount para 2 casas decimais no factory.',
        relatedKeypoints: [3],
      },
      {
        level: 'intermediario',
        title: 'Domain Event com Transactional Outbox',
        description: 'Implemente o fluxo completo: (1) <code>Order.confirm()</code> retorna <code>OrderConfirmed</code> domain event (imutável, campos no passado), (2) Application Service que usa Prisma <code>$transaction</code> para salvar Order E inserir evento na tabela <code>outbox_events</code>, (3) <code>StockReservationHandler</code> que consome <code>OrderConfirmed</code> e reserva estoque em bounded context separado, (4) Handler é idempotente (mesmo evento chega 2x sem problema).',
        concepts: ['Domain Events', 'Transactional Outbox', 'idempotência', 'bounded context communication'],
        hint: 'outbox_events tem: id, type, payload (JSON), status (PENDING/SENT), processedAt. Worker marca SENT após publicar. Handler verifica se orderId já foi processado antes de reservar.',
        relatedKeypoints: [4, 5],
      },
      {
        level: 'senior',
        title: 'Context Map com Anti-Corruption Layer',
        description: 'Implemente integração entre seu bounded context (Orders) e um ERP legado com modelo bizarro (<code>PEDIDO</code>, <code>COD_CLI</code>, <code>VLR_BRUTO</code>, <code>ST_PEDIDO</code> como "A"=aberto/"F"=faturado). Crie: (1) ACL que traduz <code>ErpOrder</code> para <code>Order</code> do seu domínio, (2) ACL que traduz <code>Order</code> pra formato ERP ao sincronizar, (3) testes que verificam que seu domínio nunca vê os campos do ERP diretamente, (4) strategy de polling que detecta mudanças no ERP e gera Domain Events no seu contexto.',
        concepts: ['Anti-Corruption Layer', 'Context Map', 'integração com legado', 'bounded context isolation'],
        hint: 'ACL é um adapter (no infra layer). Seu domínio recebe/retorna apenas tipos do próprio domínio. ErpClient é wrapped pelo ACL. Teste: se ERP mudar COD_CLI pra CODIGO_CLIENTE, só o ACL quebra — domínio intacto.',
        relatedKeypoints: [7, 8],
      },
    ],
    videos: [
      { title: 'Domain-Driven Design in 100 Seconds', channel: 'Fireship', url: '', topic: 'Introdução rápida a DDD', note: 'Ponto de partida visual antes de ir nas fontes mais densas' },
      { title: 'GOTO 2015 • DDD Today — Eric Evans', channel: 'GOTO Conferences', url: '', topic: 'Atualização do próprio Eric Evans sobre DDD moderno', note: 'Fonte primária — Evans revisita o que mudou desde o livro original de 2003' },
      { title: 'Event Storming — Alberto Brandolini', channel: 'GOTO Conferences', url: '', topic: 'A técnica de Event Storming criada por Brandolini', note: 'Essencial para saber como extrair bounded contexts de verdade — não de suposição' },
      { title: 'DDD com NestJS na prática', channel: 'Rocketseat', url: '', topic: 'Implementação prática de DDD com NestJS e TypeScript', note: 'Melhor recurso em português para implementação concreta' },
      { title: 'Aggregate Design — Vaughn Vernon', channel: 'DDD Europe', url: '', topic: 'Design de aggregates com Vaughn Vernon', note: 'Referência definitiva sobre tamanho e design de aggregates — assista antes de criar um aggregate com 20 entidades' },
    ],
    resources: [
      { title: 'Domain-Driven Design (Eric Evans)', url: 'https://www.dddcommunity.org/book/evans_2003/', kind: 'livro' },
      { title: 'Implementing DDD (Vaughn Vernon)', url: 'https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577', kind: 'livro' },
      { title: 'Domain-Driven Design Distilled (Vernon)', url: 'https://www.amazon.com/Domain-Driven-Design-Distilled-Vaughn-Vernon/dp/0134434420', kind: 'livro' },
      { title: 'DDD Reference (Eric Evans)', url: 'https://www.domainlanguage.com/ddd/reference/', kind: 'docs' },
      { title: 'Martin Fowler — Bounded Context', url: 'https://martinfowler.com/bliki/BoundedContext.html', kind: 'artigo' },
      { title: 'Martin Fowler — Domain Event', url: 'https://martinfowler.com/eaaDev/DomainEvent.html', kind: 'artigo' },
      { title: 'Martin Fowler — Ubiquitous Language', url: 'https://martinfowler.com/bliki/UbiquitousLanguage.html', kind: 'artigo' },
      { title: 'Herberto Graça — Explicit Architecture', url: 'https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/', kind: 'artigo' },
      { title: 'Event Sourcing and CQRS (Greg Young)', url: 'https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf', kind: 'artigo' },
      { title: 'DDD Community', url: 'https://www.dddcommunity.org/', kind: 'docs' },
    ],
    codeExamples: [
      {
        title: 'Order Aggregate completo com invariantes e Domain Events',
        description: 'Aggregate Root com entidades filhas, Value Objects, invariantes protegidas e emissão de Domain Events',
        language: 'typescript',
        code: `// domain/value-objects/money.ts
export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: 'BRL' | 'USD',
  ) {}

  static of(amount: number, currency: 'BRL' | 'USD'): Money {
    if (amount < 0) throw new NegativeAmountError()
    return new Money(Math.round(amount * 100) / 100, currency)
  }

  static zero(currency: 'BRL' | 'USD') { return Money.of(0, currency) }

  add(other: Money): Money {
    if (other.currency !== this.currency) throw new CurrencyMismatchError()
    return Money.of(this.amount + other.amount, this.currency)
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency
  }
}

// domain/entities/order-item.ts
export class OrderItem {
  constructor(
    public readonly sku: string,
    public readonly qty: number,
    public readonly price: Money,
  ) {
    if (qty <= 0) throw new InvalidQuantityError()
  }

  subtotal(): Money { return this.price.add(this.price.multiply(this.qty - 1)) }
}

// domain/events/order-confirmed.ts
export class OrderConfirmed {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly total: Money,
    public readonly confirmedAt: Date = new Date(),
  ) {}
}

// domain/entities/order.ts — Aggregate Root
export class Order {
  private _items: OrderItem[] = []
  private _status: 'pending' | 'confirmed' | 'cancelled' = 'pending'
  private _events: object[] = []

  private constructor(
    public readonly id: string,
    public readonly customerId: string,
  ) {}

  static create(customerId: string): Order {
    return new Order(crypto.randomUUID(), customerId)
  }

  addItem(sku: string, qty: number, price: Money): void {
    if (this._status !== 'pending') throw new OrderAlreadyClosedError()
    this._items.push(new OrderItem(sku, qty, price))
  }

  confirm(): void {
    if (this._items.length === 0) throw new EmptyOrderError()
    if (this._status !== 'pending') throw new InvalidStatusTransitionError()
    this._status = 'confirmed'
    this._events.push(new OrderConfirmed(this.id, this.customerId, this.total()))
  }

  cancel(reason: string): void {
    if (this._status === 'cancelled') throw new AlreadyCancelledError()
    this._status = 'cancelled'
  }

  total(): Money {
    return this._items.reduce(
      (sum, i) => sum.add(i.subtotal()),
      Money.zero('BRL'),
    )
  }

  // Libera eventos para o Application Service publicar
  pullEvents(): object[] {
    const events = [...this._events]
    this._events = []
    return events
  }

  get status() { return this._status }
  get items(): ReadonlyArray<OrderItem> { return [...this._items] }
}`,
      },
      {
        title: 'Context Map com Anti-Corruption Layer (TypeScript)',
        description: 'Bounded Context de Orders integrado a ERP legado via ACL: tradução de modelo, isolamento total do domínio limpo.',
        language: 'typescript',
        code: `// === CONTEXTO ORDERS (limpo) ===

// domain/value-objects/order-id.ts
export class OrderId {
  private constructor(public readonly value: string) {}
  static generate() { return new OrderId(crypto.randomUUID()) }
  static of(value: string) {
    if (!value) throw new Error('OrderId inválido')
    return new OrderId(value)
  }
  equals(other: OrderId) { return this.value === other.value }
}

// domain/entities/order.ts (domínio limpo — sem vestígio do ERP)
export class Order {
  private constructor(
    public readonly id: OrderId,
    public readonly customerId: string,
    public readonly items: ReadonlyArray<{ sku: string; qty: number; unitPrice: number }>,
    public readonly status: 'open' | 'invoiced' | 'cancelled',
    public readonly totalAmount: number,
  ) {}

  static create(customerId: string, items: Array<{ sku: string; qty: number; unitPrice: number }>): Order {
    if (!items.length) throw new Error('Pedido precisa de ao menos 1 item')
    const total = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0)
    return new Order(OrderId.generate(), customerId, items, 'open', total)
  }

  invoice(): Order {
    if (this.status !== 'open') throw new Error('Só pedidos abertos podem ser faturados')
    return new Order(this.id, this.customerId, this.items, 'invoiced', this.totalAmount)
  }
}

// === ANTI-CORRUPTION LAYER (infrastructure layer) ===

// O ERP legado usa modelo completamente diferente:
// { PEDIDO_ID, COD_CLI, VLR_BRUTO, ST_PEDIDO: 'A'|'F'|'C', ITENS: [{SKU, QTD, VLR_UNIT}] }

interface ErpOrder {
  PEDIDO_ID: string
  COD_CLI: string
  VLR_BRUTO: number
  ST_PEDIDO: 'A' | 'F' | 'C' // A=aberto, F=faturado, C=cancelado
  ITENS: Array<{ SKU: string; QTD: number; VLR_UNIT: number }>
}

// infrastructure/acl/erp-order.translator.ts
export class ErpOrderTranslator {
  /** ERP → Domínio */
  toDomain(erp: ErpOrder): Order {
    const statusMap: Record<ErpOrder['ST_PEDIDO'], Order['status']> = {
      A: 'open', F: 'invoiced', C: 'cancelled',
    }
    return new (Order as any)(
      OrderId.of(erp.PEDIDO_ID),
      erp.COD_CLI,
      erp.ITENS.map(i => ({ sku: i.SKU, qty: i.QTD, unitPrice: i.VLR_UNIT })),
      statusMap[erp.ST_PEDIDO],
      erp.VLR_BRUTO,
    )
  }

  /** Domínio → ERP */
  toErp(order: Order): ErpOrder {
    const statusMap: Record<Order['status'], ErpOrder['ST_PEDIDO']> = {
      open: 'A', invoiced: 'F', cancelled: 'C',
    }
    return {
      PEDIDO_ID: order.id.value,
      COD_CLI: order.customerId,
      VLR_BRUTO: order.totalAmount,
      ST_PEDIDO: statusMap[order.status],
      ITENS: order.items.map(i => ({ SKU: i.sku, QTD: i.qty, VLR_UNIT: i.unitPrice })),
    }
  }
}

// infrastructure/acl/erp-order.gateway.ts
export class ErpOrderGateway {
  constructor(
    private readonly erp: ErpHttpClient, // cliente HTTP do ERP legado
    private readonly translator: ErpOrderTranslator,
  ) {}

  async findByCustomer(customerId: string): Promise<Order[]> {
    // Chama o ERP com o modelo dele
    const erpOrders: ErpOrder[] = await this.erp.get(\`/PEDIDOS?COD_CLI=\${customerId}\`)
    // ACL traduz pro nosso domínio — o domínio nunca vê ErpOrder
    return erpOrders.map(e => this.translator.toDomain(e))
  }

  async syncOrder(order: Order): Promise<void> {
    const erpPayload = this.translator.toErp(order)
    await this.erp.put(\`/PEDIDOS/\${erpPayload.PEDIDO_ID}\`, erpPayload)
  }
}

// Teste que prova isolamento: se ERP mudar COD_CLI para CODIGO_CLIENTE,
// apenas ErpOrderTranslator quebra — Order e use cases ficam intactos
`,
      },
      {
        title: 'Repositório DDD com Specification Pattern (TypeScript/Prisma)',
        description: 'Repository interface no domínio com Specification para queries expressivas, implementação Prisma no adapter sem vazar ORM ao domínio.',
        language: 'typescript',
        code: `// === DOMAIN LAYER ===

// domain/specifications/specification.ts
export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean
  toQuery?(): Record<string, unknown> // opcional — para push-down de query no repo
}

// domain/specifications/order-specs.ts
export class PendingOrdersSpec implements Specification<Order> {
  isSatisfiedBy(order: Order): boolean {
    return order.status === 'pending'
  }
  toQuery() { return { status: 'pending' } }
}

export class HighValueOrderSpec implements Specification<Order> {
  constructor(private readonly minAmount: number) {}
  isSatisfiedBy(order: Order): boolean {
    return order.totalAmount >= this.minAmount
  }
  toQuery() { return { totalAmount: { gte: this.minAmount } } }
}

// Combinator
export class AndSpec<T> implements Specification<T> {
  constructor(private readonly left: Specification<T>, private readonly right: Specification<T>) {}
  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate)
  }
  toQuery() {
    return { AND: [this.left.toQuery?.(), this.right.toQuery?.()] }
  }
}

// domain/repositories/i-order-repository.ts
export interface IOrderRepository {
  findById(id: OrderId): Promise<Order | null>
  findBySpec(spec: Specification<Order>): Promise<Order[]>
  save(order: Order): Promise<void>
  delete(id: OrderId): Promise<void>
}

// === INFRASTRUCTURE LAYER ===

// infrastructure/repositories/prisma-order.repository.ts
import { PrismaClient } from '@prisma/client'

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: OrderId): Promise<Order | null> {
    const row = await this.prisma.order.findUnique({ where: { id: id.value }, include: { items: true } })
    return row ? this.toDomain(row) : null
  }

  async findBySpec(spec: Specification<Order>): Promise<Order[]> {
    // Push-down: se a spec tem toQuery, usamos no banco para eficiência
    const where = spec.toQuery?.() ?? {}
    const rows = await this.prisma.order.findMany({ where, include: { items: true } })
    // Filtro em memória para specs sem toQuery ou com condições adicionais
    return rows.map(r => this.toDomain(r)).filter(o => spec.isSatisfiedBy(o))
  }

  async save(order: Order): Promise<void> {
    const data = this.toPersistence(order)
    await this.prisma.order.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    })
  }

  async delete(id: OrderId): Promise<void> {
    await this.prisma.order.delete({ where: { id: id.value } })
  }

  // Mapper: Prisma row → Domain entity (privado ao adapter)
  private toDomain(row: any): Order {
    return Order.reconstitute(
      OrderId.of(row.id),
      row.customerId,
      row.items.map((i: any) => ({ sku: i.sku, qty: i.quantity, unitPrice: i.unitPrice })),
      row.status as Order['status'],
      row.totalAmount,
    )
  }

  // Mapper: Domain entity → Prisma data
  private toPersistence(order: Order): any {
    return {
      id: order.id.value,
      customerId: order.customerId,
      status: order.status,
      totalAmount: order.totalAmount,
      items: { deleteMany: {}, createMany: { data: order.items } },
    }
  }
}

// === USO NO APPLICATION LAYER ===

// application/use-cases/get-high-value-pending-orders.use-case.ts
export class GetHighValuePendingOrdersUseCase {
  constructor(private readonly orderRepo: IOrderRepository) {}

  async exec(minAmount: number): Promise<OrderSummaryDto[]> {
    const spec = new AndSpec(new PendingOrdersSpec(), new HighValueOrderSpec(minAmount))
    const orders = await this.orderRepo.findBySpec(spec)
    return orders.map(o => ({ id: o.id.value, total: o.totalAmount, status: o.status }))
  }
}
// Spec combina lógica de domínio legível com push-down eficiente no banco
// Use case não importa Prisma — troca por qualquer IOrderRepository sem mudar nada
`,
      },
    ],
    mindmap: {
      title: 'DDD — Mapa estratégico e tático',
      html: `<div style="background:#0f172a;padding:32px 24px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .ddm-wrap{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .ddm-node{background:rgba(23,147,209,.07);border:1px solid rgba(23,147,209,.25);border-radius:10px;padding:13px 15px}
    .ddm-title{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:#38bdf8;margin-bottom:8px;letter-spacing:.5px}
    .ddm-items{font-size:11px;color:#cbd5e1;line-height:1.8;padding:0;margin:0}
    .ddm-items li{list-style:none;padding-left:14px;position:relative}
    .ddm-items li::before{content:'→';position:absolute;left:0;color:#1793D1;font-weight:700}
    .ddm-center{grid-column:1/-1;background:linear-gradient(90deg,rgba(23,147,209,.18),rgba(23,147,209,.06));border:2px solid #1793D1;border-radius:12px;padding:14px 18px;text-align:center;margin-bottom:4px}
    .ddm-badge{display:inline-block;padding:3px 10px;border-radius:4px;font-size:10px;font-family:'JetBrains Mono',monospace;color:#38bdf8;background:rgba(23,147,209,.2);margin:0 4px}
  </style>
  <div style="text-align:center;margin-bottom:18px">
    <div style="font-size:16px;font-weight:700;color:#38bdf8">DDD — MAPA MENTAL</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:4px">Strategic + Tactical DDD</div>
  </div>
  <div class="ddm-wrap">
    <div class="ddm-center">
      <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:#38bdf8;margin-bottom:4px">MODELO MENTAL CENTRAL</div>
      <div style="font-size:13px;font-weight:700;color:#fff">O código espelha o domínio de negócio</div>
      <div style="font-size:11px;color:#94a3b8;margin-top:4px">Ubiquitous Language é o contrato entre devs e especialistas</div>
    </div>
    <div class="ddm-node">
      <div class="ddm-title">STRATEGIC DDD</div>
      <ul class="ddm-items">
        <li>Bounded Context — fronteira de modelo</li>
        <li>Ubiquitous Language — vocabulário único</li>
        <li>Context Map — relações entre contextos</li>
        <li>ACL, Customer-Supplier, Conformist</li>
        <li>Event Storming — extração de domínio</li>
      </ul>
    </div>
    <div class="ddm-node">
      <div class="ddm-title">TACTICAL DDD</div>
      <ul class="ddm-items">
        <li>Entity — identidade única + mutável</li>
        <li>Value Object — imutável + por valor</li>
        <li>Aggregate Root — guardião de invariantes</li>
        <li>Domain Event — fato imutável do passado</li>
        <li>Repository + Domain Service</li>
      </ul>
    </div>
    <div class="ddm-node">
      <div class="ddm-title">QUANDO USAR</div>
      <ul class="ddm-items">
        <li>Domínio complexo com especialistas</li>
        <li>Regras fiscais, financeiras, fluxos ricos</li>
        <li>Sistema de longa vida (5+ anos)</li>
        <li>Time com acesso a negócio</li>
        <li>NÃO: CRUD, MVP, sem especialista</li>
      </ul>
    </div>
    <div class="ddm-node">
      <div class="ddm-title">INTEGRA COM</div>
      <ul class="ddm-items">
        <li>Clean Architecture — como organizar</li>
        <li>CQRS — leitura separada do write</li>
        <li>Event Sourcing — eventos como fonte</li>
        <li>Microservices — bounded context = serviço</li>
        <li>Saga — fluxo distribuído via eventos</li>
      </ul>
    </div>
  </div>
</div>`,
      caption: 'DDD tem duas dimensões: Strategic (o mapa do território) e Tactical (as ferramentas de construção). Sem Strategic, Tactical vira cargo cult.',
    },
  },

  'microservices': {
    tagline: 'Decompor sistema em serviços independentes, deployáveis com fronteira de domínio clara e banco próprio.',
    why: 'Toda vaga sênior pergunta sobre microservices. O que diferencia você é ter opinião formada: quando NÃO usar, qual o custo operacional real, como lidar com transação distribuída. Falar bem aqui mostra que você já sentiu a dor, não só leu blog.',
    prerequisite: 'DDD (Bounded Context), Docker/Kubernetes básico, mensageria (Kafka/RabbitMQ), REST/gRPC.',
    summary: 'Microservices é estilo arquitetural onde o sistema é composto por serviços pequenos, independentes, com fronteira de domínio (geralmente Bounded Context), deploy próprio, banco próprio e comunicação via rede. Benefício: escala independente, autonomia de time, tecnologia heterogênea. Custo: complexidade operacional brutal — observability, transação distribuída, versionamento de API, latência de rede, debugging difícil. A maioria dos projetos começa errado escolhendo microservices antes de ter o problema que eles resolvem.',
    howToStudy: 'Estude os padrões na ordem: 1) Bounded Context (DDD) — fundamento do particionamento. 2) Database per service — não negociável. 3) Saga — transação distribuída. 4) API Gateway + BFF. 5) Observability (OpenTelemetry). Só depois vá para service mesh, CQRS integrado e event sourcing. Leia "Building Microservices" (Newman) do início ao fim.',
    diagrams: [
      {
        title: 'Monolito vs Microservices',
        caption: 'Estrutura de código, banco, deploy e modelo de falha — comparação lado a lado.',
        html: `<style>
.ms1-wrap{font-family:system-ui,sans-serif;display:flex;gap:0;width:100%;border-radius:10px;overflow:hidden;border:2px solid #1793D1}
.ms1-col{flex:1;padding:18px;background:#0f172a}
.ms1-col+.ms1-col{border-left:2px solid #1793D1}
.ms1-head{font-size:13px;font-weight:700;text-align:center;padding:6px 10px;border-radius:6px;margin-bottom:14px;letter-spacing:.5px}
.ms1-mono .ms1-head{background:#334155;color:#94a3b8}
.ms1-micro .ms1-head{background:#1793D1;color:#fff}
.ms1-block{border-radius:6px;padding:8px 10px;font-size:11px;margin-bottom:6px;border:1px solid #334155}
.ms1-label{font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px;font-weight:600}
.ms1-mono .ms1-block{background:#1e293b;color:#cbd5e1}
.ms1-micro .ms1-block{background:#1e293b;color:#93c5fd}
.ms1-db{background:#312e81!important;color:#c4b5fd!important;border-color:#4f46e5!important;font-weight:600}
.ms1-fail-bad{background:#450a0a!important;color:#fca5a5!important;border-color:#b91c1c!important}
.ms1-fail-ok{background:#052e16!important;color:#86efac!important;border-color:#15803d!important}
.ms1-row{display:flex;gap:6px;flex-wrap:wrap}
.ms1-svc{flex:1;min-width:80px;border-radius:6px;padding:7px 8px;font-size:10px;text-align:center;background:#1e3a5f;color:#93c5fd;border:1px solid #1793D1}
.ms1-svcdb{font-size:9px;color:#818cf8;margin-top:3px}
.ms1-arrow{color:#1793D1;font-weight:700;font-size:14px;text-align:center;margin:4px 0}
</style>
<div class="ms1-wrap">
  <div class="ms1-col ms1-mono">
    <div class="ms1-head">MONOLITO</div>
    <div class="ms1-label">Código</div>
    <div class="ms1-block">📦 Uma aplicação<br/>Orders + Users + Payments + Inventory — tudo junto</div>
    <div class="ms1-label">Banco</div>
    <div class="ms1-block ms1-db">🗄 Um banco compartilhado<br/>schema único, migrations afetam tudo</div>
    <div class="ms1-label">Deploy</div>
    <div class="ms1-block">🚀 Deploy único da aplicação inteira<br/>1 mudança = rebuild + redeploy completo</div>
    <div class="ms1-label">Falha em cascata</div>
    <div class="ms1-block ms1-fail-bad">💥 Bug em Payments trava toda a app<br/>Escala: vertical (máquina maior)</div>
  </div>
  <div class="ms1-col ms1-micro">
    <div class="ms1-head">MICROSERVICES</div>
    <div class="ms1-label">Serviços independentes</div>
    <div class="ms1-row">
      <div class="ms1-svc">📦 Orders<div class="ms1-svcdb">🗄 Postgres</div></div>
      <div class="ms1-svc">👤 Users<div class="ms1-svcdb">🗄 MySQL</div></div>
      <div class="ms1-svc">💳 Payments<div class="ms1-svcdb">🗄 Postgres</div></div>
      <div class="ms1-svc">📦 Inventory<div class="ms1-svcdb">🗄 MongoDB</div></div>
    </div>
    <div class="ms1-label" style="margin-top:10px">Deploy</div>
    <div class="ms1-block">🚀 Deploy independente por serviço<br/>Payments atualiza sem tocar Orders</div>
    <div class="ms1-label">Falha isolada</div>
    <div class="ms1-block ms1-fail-ok">✅ Bug em Payments isolado<br/>Orders continua funcionando<br/>Escala: horizontal por serviço</div>
  </div>
</div>`,
      },
      {
        title: 'Saga Pattern — Coreografia vs Orquestração',
        caption: 'Transação distribuída Order → Payment → Inventory → Shipping com compensating transactions.',
        html: `<style>
.ms2-wrap{font-family:system-ui,sans-serif;width:100%}
.ms2-title{font-size:12px;font-weight:700;color:#1793D1;text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px}
.ms2-cols{display:flex;gap:12px;margin-bottom:14px}
.ms2-pane{flex:1;background:#0f172a;border:1.5px solid #1793D1;border-radius:8px;padding:14px}
.ms2-phead{font-size:11px;font-weight:700;color:#fff;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #1e3a5f}
.ms2-step{display:flex;align-items:flex-start;gap:8px;margin-bottom:8px}
.ms2-num{background:#1793D1;color:#fff;width:18px;height:18px;border-radius:50%;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.ms2-evt{font-size:10px;color:#93c5fd}
.ms2-svc{font-size:10px;color:#a5f3fc;font-weight:600}
.ms2-comp{font-size:10px;color:#fca5a5;background:#450a0a;border-radius:4px;padding:2px 6px;margin-top:3px;display:inline-block}
.ms2-ok{color:#86efac}
.ms2-vs{display:flex;justify-content:center;align-items:center;font-size:11px;color:#64748b;font-weight:700;padding:0 6px}
.ms2-note{background:#1e293b;border-left:3px solid #1793D1;padding:8px 12px;font-size:10px;color:#94a3b8;border-radius:0 6px 6px 0}
.ms2-kafka{font-size:9px;color:#f59e0b;background:#422006;border-radius:3px;padding:1px 5px;font-weight:600}
</style>
<div class="ms2-wrap">
  <div class="ms2-title">Saga Pattern — Transação Distribuída</div>
  <div class="ms2-cols">
    <div class="ms2-pane">
      <div class="ms2-phead">Coreografia (Choreography) <span class="ms2-kafka">Kafka</span></div>
      <div class="ms2-step"><div class="ms2-num">1</div><div><div class="ms2-svc">Orders Service</div><div class="ms2-evt">→ publica: <code>order.created</code></div></div></div>
      <div class="ms2-step"><div class="ms2-num">2</div><div><div class="ms2-svc">Payment Service</div><div class="ms2-evt">← consome: <code>order.created</code><br/>→ publica: <code>payment.processed</code></div></div></div>
      <div class="ms2-step"><div class="ms2-num">3</div><div><div class="ms2-svc">Inventory Service</div><div class="ms2-evt">← consome: <code>payment.processed</code><br/>→ publica: <code>stock.reserved</code></div></div></div>
      <div class="ms2-step"><div class="ms2-num">4</div><div><div class="ms2-svc">Shipping Service</div><div class="ms2-evt">← consome: <code>stock.reserved</code><br/><span class="ms2-ok">✓ despacha pedido</span></div></div></div>
      <div class="ms2-step"><div class="ms2-num">✗</div><div><div class="ms2-svc">Falha em Inventory</div><div class="ms2-comp">→ publica: stock.failed</div><div class="ms2-comp">Payment escuta e estorna</div></div></div>
    </div>
    <div class="ms2-vs">VS</div>
    <div class="ms2-pane">
      <div class="ms2-phead">Orquestração (Orchestration)</div>
      <div class="ms2-step"><div class="ms2-num">1</div><div><div class="ms2-svc">Saga Orchestrator</div><div class="ms2-evt">→ chama: Payment.charge()</div></div></div>
      <div class="ms2-step"><div class="ms2-num">2</div><div><div class="ms2-svc">Saga Orchestrator</div><div class="ms2-evt">← recebe: {<!-- -->success}<br/>→ chama: Inventory.reserve()</div></div></div>
      <div class="ms2-step"><div class="ms2-num">3</div><div><div class="ms2-svc">Saga Orchestrator</div><div class="ms2-evt">← recebe: {<!-- -->success}<br/>→ chama: Shipping.dispatch()</div></div></div>
      <div class="ms2-step"><div class="ms2-num">✗</div><div><div class="ms2-svc">Falha em Inventory</div><div class="ms2-comp">Orchestrator chama: Payment.refund()</div><div class="ms2-comp">Orchestrator chama: Order.cancel()</div></div></div>
    </div>
  </div>
  <div class="ms2-note">
    <strong style="color:#e2e8f0">Coreografia:</strong> simples, desacoplado, difícil de rastrear o fluxo completo.
    <strong style="color:#e2e8f0">Orquestração:</strong> fluxo explícito e rastreável, mas orquestrador vira ponto central de complexidade.
    <strong style="color:#1793D1">Idempotência é obrigatória nos dois casos</strong> — at-least-once delivery garante re-entrega.
  </div>
</div>`,
      },
      {
        title: 'Arquitetura Completa com Observabilidade',
        caption: 'API Gateway → serviços → message broker → observabilidade com service discovery e circuit breaker.',
        html: `<style>
.ms3-wrap{font-family:system-ui,sans-serif;width:100%;background:#0a0f1e;border-radius:10px;padding:16px;border:1.5px solid #1793D1}
.ms3-row{display:flex;gap:8px;margin-bottom:8px;align-items:stretch}
.ms3-box{background:#0f172a;border:1px solid #1e3a5f;border-radius:7px;padding:9px 12px;font-size:10px;color:#cbd5e1;flex:1;text-align:center}
.ms3-box strong{display:block;color:#fff;font-size:11px;margin-bottom:3px}
.ms3-gw{border-color:#1793D1!important;background:#0c2340!important}
.ms3-gw strong{color:#1793D1}
.ms3-svc{border-color:#3b82f6;background:#0f1f3a}
.ms3-svc strong{color:#93c5fd}
.ms3-broker{border-color:#f59e0b;background:#1c1008}
.ms3-broker strong{color:#fbbf24}
.ms3-obs{border-color:#8b5cf6;background:#120d1f}
.ms3-obs strong{color:#c4b5fd}
.ms3-arrow{text-align:center;font-size:14px;color:#1793D1;margin:2px 0;line-height:1}
.ms3-label{font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.6px;font-weight:600;margin-bottom:6px}
.ms3-tag{display:inline-block;font-size:9px;padding:1px 5px;border-radius:3px;margin:2px 2px 0}
.ms3-cb{background:#450a0a;color:#fca5a5}
.ms3-sd{background:#052e16;color:#86efac}
.ms3-sc{background:#1e1b4b;color:#a5b4fc}
.ms3-client{background:#1e293b;border:1px solid #475569;border-radius:6px;padding:6px 12px;font-size:10px;color:#94a3b8;text-align:center}
</style>
<div class="ms3-wrap">
  <div class="ms3-label">Cliente</div>
  <div class="ms3-row">
    <div class="ms3-client">🌐 Web App</div>
    <div class="ms3-client">📱 Mobile App</div>
    <div class="ms3-client">🔗 Third-party</div>
  </div>
  <div class="ms3-arrow">↓</div>
  <div class="ms3-label">API Gateway + BFF</div>
  <div class="ms3-row">
    <div class="ms3-box ms3-gw">
      <strong>API Gateway</strong>
      Auth · Rate Limit · Routing · SSL<br/>
      <span class="ms3-tag ms3-sd">Service Discovery</span>
      <span class="ms3-tag ms3-cb">Circuit Breaker</span>
    </div>
  </div>
  <div class="ms3-arrow">↓</div>
  <div class="ms3-label">Microserviços (cada um com banco próprio)</div>
  <div class="ms3-row">
    <div class="ms3-box ms3-svc"><strong>Orders</strong>Postgres<br/><span class="ms3-tag ms3-sc">Sidecar (Envoy)</span></div>
    <div class="ms3-box ms3-svc"><strong>Payments</strong>Postgres<br/><span class="ms3-tag ms3-sc">Sidecar (Envoy)</span></div>
    <div class="ms3-box ms3-svc"><strong>Inventory</strong>MongoDB<br/><span class="ms3-tag ms3-sc">Sidecar (Envoy)</span></div>
    <div class="ms3-box ms3-svc"><strong>Shipping</strong>MySQL<br/><span class="ms3-tag ms3-sc">Sidecar (Envoy)</span></div>
  </div>
  <div class="ms3-arrow">↓</div>
  <div class="ms3-label">Message Broker</div>
  <div class="ms3-row">
    <div class="ms3-box ms3-broker"><strong>Kafka / RabbitMQ</strong>Eventos de domínio · Saga events · Retry · DLQ</div>
  </div>
  <div class="ms3-arrow">↓</div>
  <div class="ms3-label">Observabilidade</div>
  <div class="ms3-row">
    <div class="ms3-box ms3-obs"><strong>Distributed Tracing</strong>Jaeger · Zipkin<br/>correlation-id</div>
    <div class="ms3-box ms3-obs"><strong>Metrics</strong>Prometheus + Grafana<br/>SLI/SLO</div>
    <div class="ms3-box ms3-obs"><strong>Logs</strong>ELK Stack<br/>structured JSON</div>
  </div>
</div>`,
      },
    ],
    keypoints: [
      { title: 'Por Bounded Context, não por entidade', body: 'Erro #1: criar microservice por tabela (UserService, OrderService, ItemService). Isso quebra a coesão e gera N+1 de rede. O serviço deve corresponder a um Bounded Context com regra de negócio própria. Se dois "serviços" sempre fazem deploy juntos, a fronteira está errada.' },
      { title: 'Database per service — não negociável', body: 'Cada serviço tem seu banco. Compartilhar banco mata o ponto inteiro — qualquer mudança de schema afeta todos, elimina autonomia de deploy, cria acoplamento de dados. Integração via eventos/API, nunca por JOIN direto.' },
      { title: 'Sync (REST/gRPC) vs Async (eventos)', body: 'Sync: simples, response imediato, debugging linear. Mas acopla disponibilidade — se B caiu, A também cai. Async (Kafka/RabbitMQ): desacopla temporalmente, absorve picos. Custo: idempotência, ordem, dead letter, eventual consistency. Sênior mistura: sync para leitura interativa, async para reação a eventos de negócio.' },
      { title: 'Saga para transação distribuída', body: 'Sem 2PC em microservices — não escala e cria coupling. Saga = sequência de transações locais com compensating transactions em falha. Choreography (serviços reagem a eventos) ou Orchestration (coordenador explícito). Idempotência é obrigatória.' },
      { title: 'API Gateway e BFF', body: 'Ponto de entrada único: autenticação, rate limit, routing, SSL termination, agregação de resposta. Evita cliente conhecer N serviços. BFF (Backend For Frontend) é variante especializada por canal — web BFF diferente do mobile BFF. Não coloque lógica de negócio no gateway.' },
      { title: 'Service Discovery', body: 'Serviços precisam descobrir uns aos outros dinamicamente. Em Kubernetes, Service + DNS resolve automaticamente. Em VM/baremetal: Consul, Eureka, ou service mesh (Istio). Health check é parte do registro — serviço doente sai do pool.' },
      { title: 'Observability é infra, não feature', body: 'Sem observability, debug em microservices é impossível. O mínimo: logging estruturado em JSON com correlation-id propagado, tracing distribuído (OpenTelemetry + Jaeger), métricas (Prometheus + Grafana). Correlation-id deve fluir em TODOS os serviços desde a borda.' },
      { title: 'Strangler Fig para migração', body: 'Nunca migre monolito para microservices em big bang. Strangler fig: extrai um Bounded Context por vez, começando pelos menos acoplados. Fase 1: modularize dentro do monolito. Se não conseguir modularizar no monolito, microservice não vai resolver.' },
    ],
    cheatsheet: {
      title: 'Checklist: Você Precisa de Microservices?',
      html: `<style>
.msc-wrap{font-family:system-ui,sans-serif;width:100%;background:#0a0f1e;border-radius:10px;padding:16px;border:1.5px solid #1793D1}
.msc-title{font-size:13px;font-weight:700;color:#1793D1;margin-bottom:14px}
.msc-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.msc-section{background:#0f172a;border-radius:8px;padding:12px;border:1px solid #1e3a5f}
.msc-head{font-size:11px;font-weight:700;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #1e3a5f}
.msc-ok .msc-head{color:#4ade80}
.msc-no .msc-head{color:#f87171}
.msc-item{font-size:10px;color:#cbd5e1;margin-bottom:4px;padding-left:14px;position:relative}
.msc-item::before{position:absolute;left:0;top:0}
.msc-ok .msc-item::before{content:"✓";color:#4ade80}
.msc-no .msc-item::before{content:"✗";color:#f87171}
.msc-patterns{background:#0f172a;border-radius:8px;padding:12px;border:1px solid #1e3a5f;margin-top:12px}
.msc-patterns-head{font-size:11px;font-weight:700;color:#1793D1;margin-bottom:8px}
.msc-ptable{width:100%;border-collapse:collapse;font-size:10px}
.msc-ptable th{background:#1e3a5f;color:#93c5fd;padding:5px 8px;text-align:left}
.msc-ptable td{padding:5px 8px;color:#cbd5e1;border-bottom:1px solid #1e293b}
.msc-ptable code{background:#1e293b;padding:1px 4px;border-radius:3px;font-size:9px;color:#a5f3fc}
</style>
<div class="msc-wrap">
  <div class="msc-title">Checklist: Você Precisa de Microservices?</div>
  <div class="msc-grid">
    <div class="msc-section msc-ok">
      <div class="msc-head">USE quando...</div>
      <div class="msc-item">Times grandes pisando no pé um do outro</div>
      <div class="msc-item">Deploy do monolito bloqueia entrega</div>
      <div class="msc-item">Módulos com necessidade de escala muito diferente</div>
      <div class="msc-item">Fronteiras de domínio claras (Bounded Contexts)</div>
      <div class="msc-item">Maturidade DevOps: CI/CD, K8s, observability</div>
      <div class="msc-item">Diferentes stacks justificadas por domínio</div>
    </div>
    <div class="msc-section msc-no">
      <div class="msc-head">NÃO USE quando...</div>
      <div class="msc-item">Time &lt; 10 pessoas</div>
      <div class="msc-item">Domínio ainda mal compreendido (pre-PMF)</div>
      <div class="msc-item">Sem DevOps/SRE dedicado</div>
      <div class="msc-item">Monolito funciona bem e não há gargalo real</div>
      <div class="msc-item">"Porque Netflix usa" — cargo cult</div>
      <div class="msc-item">Sem capacidade de operar observability</div>
    </div>
  </div>
  <div class="msc-patterns">
    <div class="msc-patterns-head">Padrões de Comunicação</div>
    <table class="msc-ptable">
      <tr><th>Padrão</th><th>Quando usar</th><th>Ferramenta</th></tr>
      <tr><td>REST sync</td><td>Query interativa, resposta imediata</td><td><code>HTTP/JSON</code></td></tr>
      <tr><td>gRPC sync</td><td>Alta performance entre serviços internos</td><td><code>Protobuf</code></td></tr>
      <tr><td>Eventos async</td><td>Reação a evento de negócio, integração</td><td><code>Kafka, RabbitMQ</code></td></tr>
      <tr><td>Saga Choreo</td><td>Transação distribuída simples</td><td><code>Kafka events</code></td></tr>
      <tr><td>Saga Orch</td><td>Fluxo longo e rastreável</td><td><code>Temporal, Conductor</code></td></tr>
      <tr><td>BFF</td><td>Cliente com requisito específico (mobile)</td><td><code>GraphQL, REST</code></td></tr>
    </table>
  </div>
</div>`,
    },
    mnemonics: [
      {
        label: 'CBRT — Resiliência em Microservices',
        trick: 'C-B-R-T: "Cuidado, Breaker Resiste ao Timeout"',
        explanation: 'Circuit Breaker (falha rápida), Bulkhead (isolamento de pool), Retry com backoff+jitter, Timeout obrigatório em toda chamada remota. Os 4 padrões de resiliência que todo sênior precisa combinar.',
      },
      {
        label: 'CO — Escolhendo o tipo de Saga',
        trick: 'CO: "Coreografia é simples, Orquestração é clara"',
        explanation: 'Choreography = eventos sem coordenador, simples para flows curtos. Orchestration = coordenador explícito, melhor para flows longos e rastreabilidade. Escolha pela complexidade do fluxo, não por preferência.',
      },
      {
        label: 'BODS — Database per service',
        trick: 'BODS: "Banco Own, Deploy Separado"',
        explanation: 'Cada serviço possui (Own) seu banco, faz deploy separado, e integra via eventos. Se dois serviços compartilham banco, você não tem microservices — tem um distributed monolith.',
      },
      {
        label: '3 Pilares de Observability: LMT',
        trick: 'LMT: "Logs, Métricas, Traces" — os três pés do tripé',
        explanation: 'Logs (eventos discretos, structured JSON), Metrics (agregações numéricas, Prometheus), Traces (fluxo de request entre serviços, Jaeger). Sem os três, diagnóstico em produção é adivinhação.',
      },
    ],
    gotchas: [
      'Time pequeno (<10 pessoas) com microservices — overhead de operar 10 serviços (CI/CD, monitoramento, deploy, on-call) suga a capacidade que deveria entregar feature. Monolito modular ganha em ROI.',
      'Distributed monolith — serviços que dependem uns dos outros para qualquer feature, deploy precisa coordenar. É o pior dos dois mundos: complexidade de microservices sem os benefícios.',
      'Compartilhar banco entre serviços — qualquer migration afeta todo mundo. Mata autonomia. Se você compartilha banco, você não tem microservices.',
      'API breaking change sem versionamento — deploya serviço A, quebra serviço B em produção. Use contract test (Pact) e versionamento de API.',
      'Subestimar latência de rede — chamada local <1μs vira chamada de rede 1-10ms. N chamadas síncronas em série = morte de UX e de SLA.',
      'Achar que micro = pequeno em linhas de código — micro é em escopo de domínio. Serviço de 50K linhas com fronteira clara é melhor que 10 serviços de 5K com acoplamento.',
      'Saga sem idempotência — at-least-once delivery garante que eventos chegam mais de uma vez. Sem idempotência no handler, você processa o mesmo evento duas vezes e corrompe dados.',
      'Não ter fallback no circuit breaker — breaker abre, sistema falha rápido, mas usuário ainda vê erro. Defina a experiência degradada (cache stale, mensagem amigável, fila para reprocessar depois).',
    ],
    interview: [
      {
        q: 'Que red flag te faz NÃO recomendar microservices?',
        a: '<p>Time de 5-10 devs — overhead de operar 10 serviços (CI/CD, monitoramento, deploy, on-call) suga a capacidade que deveria entregar feature. <strong>Monolito modular</strong> ganha em ROI.</p><p>Outras red flags: domínio mal entendido (fronteiras erradas viram pesadelo de refactor), sem maturidade DevOps (observability, IaC), produto pré-PMF (arquitetura mudando direto), e <strong>"queremos microservices porque Netflix usa"</strong> — cargo cult clássico. Sam Newman: <em>"don\'t do microservices"</em> é literalmente o título de uma talk dele.</p>',
        level: 'senior',
      },
      {
        q: 'Como você lida com transação que cruza microservices?',
        a: '<p>Descarto 2PC — não escala e cria acoplamento de disponibilidade. Uso <strong>Saga</strong>: sequência de transações locais, cada serviço publica evento, o próximo serviço reage. Em falha, dispara compensating transactions (cancelar reserva, estornar pagamento).</p><p>Duas variantes: <strong>choreography</strong> (serviços reagem a eventos sem coordenador, simples mas difícil de visualizar o fluxo completo) e <strong>orchestration</strong> (um serviço orquestra a saga, mais claro e rastreável mas cria ponto central). Idempotência e <code>outbox pattern</code> são obrigatórios para garantia de entrega.</p>',
        level: 'senior',
      },
      {
        q: 'Como você define a fronteira de um microserviço?',
        a: '<p>Começo por <strong>Bounded Context</strong> de DDD — onde o modelo e a linguagem de negócio mudam. Verifico também: dado que muda junto fica junto, time autônomo como dono do serviço, frequência de mudança compatível, escala independente justificada por dado real.</p><p>Heurística de Newman: se você precisa fazer deploy coordenado de dois serviços para entregar uma feature, <strong>a fronteira está errada</strong>. Junte ou redesenhe.</p>',
        level: 'pleno',
      },
      {
        q: 'Tradeoff: REST sync vs eventos async entre serviços?',
        a: '<p><strong>Sync (REST/gRPC)</strong>: simples, response imediato, debugging linear. Mas acopla disponibilidade — se B caiu, A também cai — adiciona latência em cadeia e cria fanout difícil de escalar.</p><p><strong>Async (eventos/fila)</strong>: desacopla temporalmente, absorve pico, escala bem. Mas complexidade sobe — idempotência, ordem, dead letter, observability mais difícil, response não é imediato (precisa polling ou websocket).</p><p>Regra prática: caminho de leitura interativa = sync. Reação a evento de negócio (notificação, replicação, integração) = async. Misturo dentro do mesmo sistema sem culpa.</p>',
        level: 'pleno',
      },
      {
        q: 'Como você versiona API entre microservices?',
        a: '<p>Prefiro <strong>backward compatibility</strong> a versionamento explícito. Adicionar campo: ok. Remover/renomear: nunca direto — adiciona o novo, depreca o antigo, monitora uso via analytics, remove depois.</p><p>Quando precisa de breaking change: versão na URL (<code>/v2/orders</code>) ou header (<code>Accept-Version</code>). <strong>Contract test</strong> (Pact) garante que mudança em A não quebra B em CI antes de chegar em produção. Consumer-driven contracts são o padrão em organizações maduras.</p>',
        level: 'senior',
      },
      {
        q: 'Quando migrar de monolito para microservices?',
        a: '<p>Quando a <strong>dor justifica o custo</strong>. Sintomas reais: deploy do monolito demora horas e bloqueia times, escala vertical chegou ao limite, módulo X precisa de stack diferente, time grande pisando no pé um do outro com merge conflicts frequentes.</p><p>Estratégia: <strong>strangler fig</strong> — extrai um Bounded Context por vez, começa pelos menos acoplados. Nunca big bang. Antes de extrair, modularize dentro do monolito — se não consegue fazer isso, microservice não vai resolver.</p>',
        level: 'senior',
      },
      {
        q: 'O que é um distributed monolith e como evitar?',
        a: '<p>Distributed monolith é quando você tem a complexidade de microservices sem os benefícios: serviços que precisam ser deployados juntos, que compartilham banco, que fazem chamadas síncronas em cadeia para cada request.</p><p>Evitar: <strong>database per service</strong> (sem exceção), comunicação async para fluxos não interativos, fronteiras por Bounded Context (não por entidade técnica), e o teste: consigo fazer deploy de A sem que B precise ser atualizado?</p>',
        level: 'pleno',
      },
      {
        q: 'Como você garante que um evento seja processado exatamente uma vez?',
        a: '<p>Exatamente uma vez (<em>exactly-once</em>) é extremamente difícil de garantir em sistemas distribuídos — Kafka oferece isso dentro do cluster, mas não ponta a ponta. O padrão prático é <strong>at-least-once + idempotência no consumer</strong>.</p><p>Implementação: cada evento tem um <code>eventId</code> único. Consumer verifica em tabela de idempotência se já processou; se sim, ignora (ack sem reprocessar). A tabela faz parte da mesma transação do efeito colateral. Isso garante efetivamente o comportamento de exactly-once para o negócio.</p>',
        level: 'senior',
      },
      {
        q: 'Explique o Outbox Pattern e quando usá-lo.',
        a: '<p>Problema: gravo no banco de dados E preciso publicar um evento. Se publico antes de commitar, evento vai mas transação pode falhar. Se publico depois do commit, processo pode morrer antes de publicar — evento se perde.</p><p><strong>Outbox Pattern</strong>: na mesma transação de negócio, insiro o evento numa tabela <code>outbox</code>. Um relay separado (ou CDC via Debezium) lê essa tabela e publica no broker. Garante que evento só é publicado se a transação commitou. É <strong>at-least-once</strong> — relay garante entrega, consumer precisa de idempotência.</p>',
        level: 'senior',
      },
      {
        q: 'Como você implementa Circuit Breaker em microservices?',
        a: '<p>Três estados: <code>CLOSED</code> (chamadas passam, monitoro falhas), <code>OPEN</code> (rejeito imediatamente — fail-fast), <code>HALF_OPEN</code> (deixo passar algumas chamadas de teste).</p><p>Configuração típica: janela deslizante de 60s, volume mínimo de 20 calls, taxa de erro &gt; 50% abre. Após 30s em OPEN, vai para HALF_OPEN, testa 5 calls. Se passarem, fecha; se falharem, abre novamente com backoff.</p><p>Bibliotecas: Resilience4j (Java), Polly (.NET), opossum (Node). Em K8s com Istio, breaker fica no sidecar proxy — sem mudar código da aplicação.</p>',
        level: 'senior',
      },
      {
        q: 'Como você monitora saúde do sistema de microservices?',
        a: '<p>Os três pilares de observability: <strong>Logs</strong> (JSON estruturado com correlation-id, via ELK ou Loki), <strong>Metrics</strong> (Prometheus + Grafana, com SLI/SLO definidos), <strong>Traces</strong> (OpenTelemetry + Jaeger para rastrear request entre serviços).</p><p>O correlation-id deve ser gerado na borda (API Gateway) e propagado em todos os headers de chamada entre serviços. Sem isso, rastrear um erro que cruzou 5 serviços é impossível.</p><p>Alertas em cima de SLOs, não de métricas brutas. Error budget como gatilho para postmortem.</p>',
        level: 'pleno',
      },
      {
        q: 'O que é BFF (Backend For Frontend)?',
        a: '<p>BFF é uma variação do API Gateway onde cada "tipo de cliente" tem seu próprio backend especializado. Web BFF agrega e formata dados para o app web; Mobile BFF faz o mesmo para o app mobile — campos diferentes, payloads menores, APIs otimizadas por cliente.</p><p>Resolve o problema de o frontend web precisar de dados muito diferentes do mobile, evitando que o gateway genérico vire um agregador que serve mal aos dois. Time de frontend pode possuir e deployar seu próprio BFF.</p>',
        level: 'pleno',
      },
      {
        q: 'Como você lida com service discovery em Kubernetes?',
        a: '<p>Kubernetes tem service discovery nativo via DNS e Service objects. Quando crio um Service do tipo ClusterIP, o kube-dns resolve <code>orders-service.default.svc.cluster.local</code> para o IP virtual, que é load-balanced entre os pods.</p><p>Não preciso de Consul ou Eureka em K8s — o control plane cuida disso. O que preciso garantir: health checks corretos no readinessProbe (pod só entra no pool quando está pronto), graceful shutdown (pod sai do pool antes de morrer), e PodDisruptionBudget para não tirar todos os pods de uma vez em rolling update.</p>',
        level: 'pleno',
      },
      {
        q: 'Quando usar gRPC ao invés de REST entre serviços?',
        a: '<p>gRPC é vantajoso quando: comunicação interna de alta frequência onde o overhead de JSON e parsing HTTP/1.1 importa, streaming bidirecional necessário, contrato forte via Protobuf é importante para evitar breaking changes acidentais, e você tem clientes gerados automaticamente em múltiplas linguagens.</p><p>REST ainda faz sentido para: APIs públicas (tooling de mercado melhor, legibilidade), integração com sistemas que não suportam HTTP/2, ou quando a equipe não tem familiaridade com Protobuf. Em prática: REST para APIs externas, gRPC para comunicação interna de performance crítica.</p>',
        level: 'senior',
      },
      {
        q: 'Como você testa microservices em isolamento?',
        a: '<p>Pirâmide adaptada para microservices: <strong>unit tests</strong> para lógica de domínio (sem rede), <strong>component tests</strong> para o serviço completo com dependências mockadas (WireMock, Testcontainers), <strong>contract tests</strong> (Pact) para garantir que producer e consumer concordam com a interface, e <strong>integration tests</strong> mínimos end-to-end em ambiente de staging.</p><p>Evito rodar todos os microservices juntos em CI — é lento, frágil e mascara falhas. Contract tests substituem E2E na maioria dos casos e rodam 10x mais rápido.</p>',
        level: 'senior',
      },
      {
        q: 'Como você lida com deploy de múltiplos microservices sem downtime?',
        level: 'senior',
        a: '<p>Zero-downtime deployment em microservices exige coordenação de API versioning, rolling updates e backward compatibility. As práticas essenciais:</p><ul><li><strong>Rolling deployment no Kubernetes:</strong> <code>RollingUpdate</code> com <code>maxUnavailable: 0</code> e <code>maxSurge: 1</code>. Novos pods sobem antes dos velhos saírem. <code>readinessProbe</code> garante que o pod só recebe tráfego quando está pronto.</li><li><strong>Backward compatibility obrigatória:</strong> nunca remova ou renomeie campo de API enquanto consumers antigos existem. Adicione campos, não substitua. Versione endpoint quando não há outra opção (<code>/v2/orders</code>).</li><li><strong>Expand-contract pattern:</strong> ao mudar schema de evento Kafka, primeiro faça Expand (adiciona novo campo, mantém antigo), deploya consumidores que leem o novo campo, então faça Contract (remove antigo). Nunca remove em único deploy.</li><li><strong>Feature flags para rollout gradual:</strong> nova lógica por trás de flag. Deploy sem ativar. Ativa pra 1% do tráfego, depois 10%, depois 100%. Rollback é só desativar a flag.</li></ul><p>Validação de que funcionou: <code>kubectl rollout status deployment/orders-service</code>. Monitora error rate no Grafana durante rollout — se subir, <code>kubectl rollout undo</code> instantâneo.</p>',
        tip: 'Citar readinessProbe, expand-contract e feature flags mostra que você pensa em deploy como engenharia, não como "subir a versão nova". Diferencial real em entrevista de sistema distribuído.',
      },
      {
        q: 'O que é service mesh e quando justifica sua complexidade?',
        level: 'senior',
        a: '<p>Service mesh (Istio, Linkerd) é uma camada de infraestrutura que intercepta toda comunicação entre serviços via sidecar proxies (Envoy). Oferece: mTLS automático, circuit breaking, retry com backoff, rate limiting, distributed tracing e traffic shifting — tudo sem mudar código da aplicação.</p><p>Quando justifica:</p><ul><li><strong>mTLS entre serviços:</strong> em ambiente de segurança rigorosa, certificar comunicação serviço-a-serviço sem implementar no código de cada um.</li><li><strong>Canary deployment sofisticado:</strong> 5% do tráfego para v2 baseado em header ou percentual — impossível de fazer elegantemente sem mesh.</li><li><strong>Observability unificada:</strong> tracing distribuído automático sem instrumentar cada serviço individualmente.</li><li><strong>Cluster grande (20+ serviços):</strong> a partir de certo tamanho, o custo de implementar esses concerns em cada serviço supera o custo operacional do mesh.</li></ul><p>Quando NÃO justifica: cluster pequeno (5-10 serviços), time sem experiência em Kubernetes avançado, ou startup sem necessidade de mTLS e canary. Istio tem curva de operação brutal — troubleshooting de mTLS pode tomar dias sem expertise. Comece com circuit breaker na aplicação (Resilience4j/opossum) e adicione mesh quando o ganho operacional for mensurável.</p>',
        tip: 'Saber quando NÃO usar service mesh é diferencial sênior. Muitos falam de Istio como solução default — quem entende o custo operacional e quando vale mostra maturidade.',
      },
      {
        q: 'Como você garante idempotência em handlers de eventos?',
        level: 'senior',
        a: '<p>Idempotência é obrigatória em qualquer sistema com entrega at-least-once. O handler pode receber o mesmo evento N vezes — seja por retry do broker, reprocessamento de dead letter, ou reconstrução de read model.</p><p><strong>Padrão mais robusto — tabela de idempotência:</strong></p><pre><code>// Na mesma transação do efeito colateral\nasync function handleOrderPaid(event: OrderPaidEvent): Promise&lt;void&gt; {\n  await db.transaction(async tx => {\n    // Verifica se já processou\n    const exists = await tx.idempotencyLog.findUnique({ where: { eventId: event.id } })\n    if (exists) return // ack sem reprocessar\n\n    // Efeito colateral (ex: atualizar read model)\n    await tx.orderView.update({ where: { id: event.orderId }, data: { status: \'paid\' } })\n\n    // Registra processamento NA MESMA TRANSAÇÃO\n    await tx.idempotencyLog.create({ data: { eventId: event.id, processedAt: new Date() } })\n  })\n}</code></pre><p>Outros padrões:</p><ul><li><strong>Estado natural idempotente:</strong> <code>UPDATE ... SET status = \'paid\' WHERE id = ?</code> é idempotente por natureza — aplicar N vezes tem mesmo resultado que 1 vez.</li><li><strong>Upsert:</strong> <code>INSERT ... ON CONFLICT DO UPDATE</code> — idempotente para criação de registros.</li><li><strong>Versão/número de sequência:</strong> só processa se <code>event.version > currentVersion</code>. Rejeita eventos duplicados ou fora de ordem.</li></ul><p>Cuidado com a tabela de idempotência: ela cresce indefinidamente. Adiciona TTL ou limpeza periódica para eventos com mais de N dias.</p>',
        tip: 'Mostrar código com transação atômica que inclui o registro de idempotência é o que diferencia quem implementou de quem apenas sabe o conceito.',
      },
      {
        q: 'Como você projeta API Gateway para múltiplos microservices?',
        level: 'senior',
        a: '<p>API Gateway é o ponto de entrada único do sistema para o exterior — cliente nunca fala com serviço interno diretamente. Responsabilidades do Gateway:</p><ul><li><strong>Roteamento:</strong> <code>GET /orders/123</code> → Orders Service. <code>POST /payments</code> → Payment Service.</li><li><strong>Autenticação/Autorização:</strong> valida JWT ou chama Identity Service. Serviços internos confiam no header passado pelo gateway.</li><li><strong>Rate limiting:</strong> por IP ou por usuário. Protege serviços de DDoS sem implementar em cada um.</li><li><strong>Aggregation:</strong> uma chamada do cliente que precisa de dados de 3 serviços — gateway agrega internamente. Sem isso, frontend faz 3 chamadas paralelas.</li><li><strong>Protocol translation:</strong> cliente HTTP/REST, serviço interno gRPC — gateway traduz.</li></ul><p>Opções de implementação:</p><ul><li><strong>Kong/KrakenD/AWS API Gateway:</strong> configuração declarativa, sem código. Melhor para casos de roteamento e autenticação puros.</li><li><strong>BFF (Backend for Frontend):</strong> gateway com lógica customizada por tipo de cliente (Web, Mobile). Code-based — NestJS ou Express. Permite agregação complexa e formatação específica por cliente.</li></ul><p>Anti-pattern: API Gateway com regra de negócio. Se o gateway faz cálculo de desconto ou validação de estoque, virou God Service. Gateway é infraestrutura — transparente ao negócio.</p>',
        tip: 'Diferenciar API Gateway puro de BFF e saber quando cada um se aplica é pergunta frequente em entrevistas de arquitetura de microservices.',
      },
      {
        q: 'Como você implementa rastreabilidade (tracing) entre microservices?',
        level: 'senior',
        a: '<p>Distributed tracing é fundamental em microservices: sem ele, um erro que cruzou 5 serviços é impossível de rastrear. A solução padrão hoje é <strong>OpenTelemetry (OTel)</strong>.</p><p>Componentes:</p><ul><li><strong>Trace:</strong> representa uma operação end-to-end (ex: GET /orders/123 que cruzou 4 serviços)</li><li><strong>Span:</strong> uma unidade de trabalho dentro do trace (cada chamada de serviço, cada query SQL)</li><li><strong>Context propagation:</strong> o traceId é passado em header (<code>traceparent</code>) de serviço em serviço automaticamente</li></ul><p>Implementação com NestJS:</p><pre><code>// main.ts — instrumentação automática\nimport { NodeSDK } from \'@opentelemetry/sdk-node\'\nimport { JaegerExporter } from \'@opentelemetry/exporter-jaeger\'\n\nconst sdk = new NodeSDK({\n  traceExporter: new JaegerExporter({ endpoint: \'http://jaeger:14268/api/traces\' }),\n  instrumentations: [getNodeAutoInstrumentations()], // HTTP, gRPC, DB automático\n})\nsdk.start()</code></pre><p>Boas práticas:</p><ul><li><strong>Correlation ID</strong> gerado no API Gateway, propagado em todos os headers internos</li><li><strong>Span attributes</strong>: adiciona <code>order.id</code>, <code>customer.id</code> nos spans relevantes — facilita busca</li><li><strong>Sampling estratégico:</strong> 100% em erros e operações lentas (&gt;p95), 1% em chamadas normais — controla volume</li><li><strong>Alertas em latência</strong>: span &gt;500ms dispara alerta com traceId embutido — debuggable direto</li></ul>',
        tip: 'Citar OpenTelemetry (não Zipkin ou Jaeger como ferramenta de instrumentação — são apenas backends) e mostrar código real de setup mostra expertise de produção.',
      },
    ],
    exercises: [
      {
        level: 'iniciante',
        title: 'Identificar Bounded Contexts num e-commerce',
        description: 'Dado um sistema de e-commerce com User, Product, Order, Payment, Inventory, Shipping, Notification: identifique os Bounded Contexts, defina quais seriam microservices e desenhe o fluxo de criação de pedido com as comunicações entre eles.',
        concepts: ['Bounded Context', 'Database per service', 'Comunicação entre serviços'],
        hint: 'Comece agrupando entidades que mudam juntas e têm a mesma linguagem de negócio. Pense: quem é dono dos dados de "produto" no contexto de catálogo vs no contexto de carrinho?',
      },
      {
        level: 'intermediario',
        title: 'Implementar Saga de Criação de Pedido',
        description: 'Implemente uma Saga de coreografia (via eventos) para o fluxo: OrderCreated → PaymentProcessed → StockReserved → ShippingDispatched. Inclua compensating transactions para falha em Payment (order cancelado) e falha em Stock (payment estornado, order cancelado). Garanta idempotência nos handlers.',
        concepts: ['Saga', 'Choreography', 'Compensating transactions', 'Idempotência', 'Outbox pattern'],
        hint: 'Use uma tabela de idempotência com eventId. Na compensação, lembre que o evento de compensação também pode ser entregue mais de uma vez — a compensação também precisa ser idempotente.',
        relatedKeypoints: [3, 6],
      },
      {
        level: 'intermediario',
        title: 'Implementar Outbox Pattern',
        description: 'Implemente o Outbox Pattern para garantir que eventos de domínio não sejam perdidos. Crie a tabela outbox, modifique o repositório para inserir o evento na mesma transação, e implemente o relay que publica no Kafka. Teste o cenário de falha entre commit e publicação.',
        concepts: ['Outbox pattern', 'At-least-once delivery', 'Transactional messaging', 'CDC'],
        hint: 'O relay pode usar polling simples (SELECT + DELETE) ou CDC via Debezium lendo o WAL do Postgres. A diferença em latência é significativa — polling adiciona delay de até N segundos dependendo do intervalo.',
      },
      {
        level: 'senior',
        title: 'Strangler Fig: Extrair Payments do Monolito',
        description: 'Dado um monolito Rails com módulo de Payments acoplado ao módulo de Orders (compartilham banco, chamadas diretas de método), projete a extração incremental usando Strangler Fig. Defina as etapas, como lidar com o banco compartilhado, como versionar a API durante a transição, e como garantir zero downtime.',
        concepts: ['Strangler fig', 'Database decomposition', 'API versioning', 'Feature flags', 'Contract testing'],
        hint: 'A extração do banco é a parte mais perigosa. Considere: Schema separation primeiro (tabelas de Payments num schema separado mas mesmo banco), depois extract service apontando para o mesmo banco, depois database separation com sincronização via CDC, depois remover sincronização.',
        relatedKeypoints: [7],
      },
    ],
    codeExamples: [
      {
        title: 'Saga de Coreografia com Outbox Pattern (TypeScript/NestJS)',
        description: 'Implementação completa de Saga coreografada: Orders Service cria pedido + insere evento no outbox na mesma transação. Payment Service consome evento com idempotência.',
        language: 'typescript',
        code: `// === ORDERS SERVICE ===

// order.entity.ts
export class Order {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly items: OrderItem[],
    public status: 'pending' | 'confirmed' | 'cancelled' = 'pending',
  ) {}

  get total(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  }
}

// create-order.usecase.ts
@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly outboxRepo: OutboxRepository,
    private readonly db: DataSource,
  ) {}

  async execute(cmd: CreateOrderCommand): Promise<string> {
    return this.db.transaction(async (em) => {
      // 1. Cria pedido
      const order = new Order(uuid(), cmd.customerId, cmd.items)
      await this.orderRepo.save(order, em)

      // 2. Insere evento no outbox NA MESMA TRANSAÇÃO
      // Garante: se transação commitar, evento está garantido de ser publicado
      await this.outboxRepo.insert({
        id: uuid(),
        aggregateType: 'Order',
        aggregateId: order.id,
        eventType: 'order.created',
        payload: JSON.stringify({
          orderId: order.id,
          customerId: order.customerId,
          total: order.total,
          items: order.items,
        }),
        createdAt: new Date(),
      }, em)

      return order.id
    })
  }
}

// outbox.relay.ts — relay que publica do outbox para Kafka
@Injectable()
export class OutboxRelay implements OnApplicationBootstrap {
  constructor(
    private readonly outboxRepo: OutboxRepository,
    private readonly kafka: KafkaProducer,
  ) {}

  onApplicationBootstrap() {
    // Polling a cada 500ms — pode ser substituído por CDC via Debezium
    setInterval(() => this.publishPending(), 500)
  }

  private async publishPending(): Promise<void> {
    const events = await this.outboxRepo.findPending(limit: 100)
    for (const event of events) {
      await this.kafka.send({
        topic: event.eventType,
        messages: [{ key: event.aggregateId, value: event.payload }],
      })
      await this.outboxRepo.markPublished(event.id)
    }
  }
}

// === PAYMENT SERVICE ===

// payment-saga.handler.ts
@Injectable()
export class PaymentSagaHandler {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly idempotencyRepo: IdempotencyRepository,
    private readonly kafka: KafkaProducer,
    private readonly db: DataSource,
  ) {}

  @KafkaConsumer('order.created')
  async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    // Idempotência: verifica se já processamos este eventId
    const alreadyProcessed = await this.idempotencyRepo.exists(event.id)
    if (alreadyProcessed) {
      console.log(\`[idempotency] Evento \${event.id} já processado, ignorando\`)
      return
    }

    await this.db.transaction(async (em) => {
      // Processa pagamento
      const result = await this.paymentService.charge({
        orderId: event.payload.orderId,
        customerId: event.payload.customerId,
        amount: event.payload.total,
      })

      // Registra idempotência + publica próximo evento na mesma transação
      await this.idempotencyRepo.insert(event.id, em)

      const nextEvent = result.success
        ? { topic: 'payment.processed', payload: { orderId: event.payload.orderId, paymentId: result.paymentId } }
        : { topic: 'payment.failed', payload: { orderId: event.payload.orderId, reason: result.error } }

      await this.outboxRepo.insert({ eventType: nextEvent.topic, payload: nextEvent.payload }, em)
    })
  }
}

// === ORDERS SERVICE — Compensating Transaction ===
@KafkaConsumer('payment.failed')
async handlePaymentFailed(event: PaymentFailedEvent): Promise<void> {
  const alreadyProcessed = await this.idempotencyRepo.exists(event.id)
  if (alreadyProcessed) return

  await this.db.transaction(async (em) => {
    await this.orderRepo.updateStatus(event.payload.orderId, 'cancelled', em)
    await this.idempotencyRepo.insert(event.id, em)
    // Notifica cliente via evento (sem acoplamento direto ao Notification Service)
    await this.outboxRepo.insert({
      eventType: 'order.cancelled',
      payload: { orderId: event.payload.orderId, reason: event.payload.reason },
    }, em)
  })
}`,
      },
      {
        title: 'Circuit Breaker com Resilience4j (Java/Spring Boot)',
        description: 'Configuração e uso do Circuit Breaker com fallback, bulkhead e retry encadeados. Padrão de resiliência CBRT completo.',
        language: 'java',
        code: `// application.yml
resilience4j:
  circuitbreaker:
    instances:
      payment-service:
        slidingWindowType: COUNT_BASED
        slidingWindowSize: 20
        minimumNumberOfCalls: 10
        failureRateThreshold: 50        # abre com 50% de falha
        waitDurationInOpenState: 30s    # espera 30s antes de half-open
        permittedNumberOfCallsInHalfOpenState: 5
        recordExceptions:
          - java.io.IOException
          - java.util.concurrent.TimeoutException
  retry:
    instances:
      payment-service:
        maxAttempts: 3
        waitDuration: 200ms
        enableExponentialBackoff: true
        exponentialBackoffMultiplier: 2
        retryExceptions:
          - java.io.IOException
  bulkhead:
    instances:
      payment-service:
        maxConcurrentCalls: 20
        maxWaitDuration: 500ms

// PaymentClient.java
@Service
public class PaymentClient {
    private final WebClient webClient;
    private final PaymentCache cache;

    // Encadeamento: Bulkhead → CircuitBreaker → Retry → TimeLimiter
    @Bulkhead(name = "payment-service", fallbackMethod = "paymentFallback")
    @CircuitBreaker(name = "payment-service", fallbackMethod = "paymentFallback")
    @Retry(name = "payment-service")
    @TimeLimiter(name = "payment-service")
    public CompletableFuture<PaymentResult> charge(ChargeRequest request) {
        return webClient.post()
            .uri("/v1/charges")
            .bodyValue(request)
            .retrieve()
            .bodyToMono(PaymentResult.class)
            .toFuture();
    }

    // Fallback: cache stale ou resposta degradada
    public CompletableFuture<PaymentResult> paymentFallback(
        ChargeRequest request, Exception ex
    ) {
        log.warn("Circuit breaker ativo para payment-service: {}", ex.getMessage());
        // Retorna resultado em fila para processamento posterior
        return CompletableFuture.completedFuture(
            PaymentResult.queued(request.getOrderId(), "Processando em segundo plano")
        );
    }
}

// Observability: monitorar estado do breaker
@Component
public class CircuitBreakerMetricsExporter implements ApplicationListener<CircuitBreakerOnStateTransitionEvent> {
    private final MeterRegistry meterRegistry;

    @Override
    public void onApplicationEvent(CircuitBreakerOnStateTransitionEvent event) {
        Counter.builder("circuit_breaker.state_transition")
            .tag("name", event.getCircuitBreakerName())
            .tag("from", event.getStateTransition().getFromState().name())
            .tag("to", event.getStateTransition().getToState().name())
            .register(meterRegistry)
            .increment();

        log.warn("Circuit Breaker '{}': {} → {}",
            event.getCircuitBreakerName(),
            event.getStateTransition().getFromState(),
            event.getStateTransition().getToState());
    }
}`,
      },
      {
        title: 'Strangler Fig — Extração Incremental de Serviço (NestJS)',
        description: 'Padrão Strangler Fig com proxy reverso e feature flag para migrar módulo de Payments do monolito para microservice com zero downtime.',
        language: 'typescript',
        code: `// === MONOLITO — adiciona proxy layer antes de extrair ===

// payment.proxy.ts — substitui chamadas diretas por proxy que roteia
@Injectable()
export class PaymentProxy {
  constructor(
    private readonly legacyPaymentService: LegacyPaymentService, // serviço original
    private readonly httpClient: HttpService,                      // novo microservice
    private readonly featureFlags: FeatureFlagService,
  ) {}

  async charge(request: ChargeRequest): Promise<PaymentResult> {
    const useNewService = await this.featureFlags.isEnabled(
      'payments-microservice',
      { customerId: request.customerId } // rollout gradual por customerId
    )

    if (useNewService) {
      // Rota para novo microservice
      try {
        const response = await this.httpClient.post(
          'http://payment-service/v1/charges',
          request,
          { timeout: 3000 }
        ).toPromise()
        return response.data
      } catch (error) {
        // Fallback para legado em caso de falha do novo serviço
        this.metrics.increment('payment_proxy.fallback', { reason: error.code })
        return this.legacyPaymentService.charge(request)
      }
    }

    return this.legacyPaymentService.charge(request)
  }
}

// feature-flag.service.ts — rollout gradual
@Injectable()
export class FeatureFlagService {
  async isEnabled(flag: string, context: { customerId: string }): Promise<boolean> {
    // Rollout por hash do customerId: 0-10% inicialmente
    const hash = murmurhash(context.customerId) % 100
    const rolloutPct = await this.redis.get(\`ff:\${flag}:rollout_pct\`) ?? 0
    return hash < Number(rolloutPct)
  }
}

// === NOVO MICROSERVICE — Payment Service ===

// payment.controller.ts
@Controller('v1')
export class PaymentController {
  @Post('charges')
  async charge(@Body() dto: ChargeRequestDto): Promise<ChargeResponseDto> {
    const result = await this.chargeUseCase.execute(dto)
    return { paymentId: result.id, status: result.status }
  }
}

// === MIGRAÇÃO DE BANCO — etapas ===
// Etapa 1: Schema separation (mesmo banco, schema separado)
//   CREATE SCHEMA payments;
//   ALTER TABLE public.payments SET SCHEMA payments;
//
// Etapa 2: Novo microservice aponta para schema 'payments' no mesmo banco
//   DATABASE_URL=postgres://host/db?schema=payments
//
// Etapa 3: Database separation com CDC (Debezium sincroniza durante transição)
//   Source: postgres/payments → Sink: novo banco do microservice
//   Após verificar consistência, desliga sincronização
//
// Etapa 4: Remove dependência do legado, apaga código morto`,
      },
    ],
    videos: [
      { title: 'Microservices — Sam Newman (GOTO Conf)', channel: 'GOTO Conferences', url: 'https://www.youtube.com/watch?v=PFQnNFe27kU', topic: 'Fundamentos e quando não usar', note: 'O autor do livro explicando os princípios originais' },
      { title: 'What is a Distributed Monolith?', channel: 'Mark Richards', url: 'https://www.youtube.com/watch?v=p2GlRToY5HI', topic: 'Anti-pattern distribuído', note: 'Reconhecer e evitar o pior dos dois mundos' },
      { title: 'Saga Pattern — Orchestration vs Choreography', channel: 'Hussein Nasser', url: 'https://www.youtube.com/watch?v=C0rXKREH4cg', topic: 'Transação distribuída', note: 'Implementação prática com código' },
      { title: 'Strangler Fig Pattern', channel: 'Fireship', url: 'https://www.youtube.com/watch?v=GBTdnfD6s5Q', topic: 'Migração incremental', note: 'Migração de monolito passo a passo' },
      { title: 'OpenTelemetry em 20 minutos', channel: 'TechWorld with Nana', url: 'https://www.youtube.com/watch?v=r8UvWSX3KA8', topic: 'Observabilidade', note: 'Setup completo de tracing distribuído' },
    ],
    resources: [
      { title: 'Building Microservices — Sam Newman (2ª ed)', url: 'https://samnewman.io/books/building_microservices_2nd_edition/', kind: 'livro' },
      { title: 'Microservices.io — Chris Richardson (padrões)', url: 'https://microservices.io/', kind: 'docs' },
      { title: 'Martin Fowler — Microservices original article', url: 'https://martinfowler.com/articles/microservices.html', kind: 'artigo' },
      { title: 'Software Architecture: The Hard Parts', url: 'https://www.oreilly.com/library/view/software-architecture-the/9781492086888/', kind: 'livro' },
      { title: 'MonolithFirst — Martin Fowler', url: 'https://martinfowler.com/bliki/MonolithFirst.html', kind: 'artigo' },
      { title: 'Saga Pattern — microservices.io', url: 'https://microservices.io/patterns/data/saga.html', kind: 'docs' },
      { title: 'Outbox Pattern — microservices.io', url: 'https://microservices.io/patterns/data/transactional-outbox.html', kind: 'docs' },
      { title: 'Resilience4j — Circuit Breaker docs', url: 'https://resilience4j.readme.io/docs/circuitbreaker', kind: 'docs' },
      { title: 'OpenTelemetry — Getting Started', url: 'https://opentelemetry.io/docs/getting-started/', kind: 'docs' },
      { title: 'Pact — Contract Testing', url: 'https://docs.pact.io/', kind: 'docs' },
    ],
    mindmap: {
      title: 'Mindmap — Microservices',
      html: `<style>
.msm-wrap{font-family:system-ui,sans-serif;width:100%;background:#0a0f1e;border-radius:12px;padding:20px;border:1.5px solid #1793D1}
.msm-center{background:#1793D1;color:#fff;border-radius:10px;padding:12px 20px;text-align:center;font-weight:700;font-size:14px;margin-bottom:16px}
.msm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.msm-node{background:#0f172a;border:1px solid #1e3a5f;border-radius:8px;padding:10px 12px}
.msm-node-title{font-size:11px;font-weight:700;color:#1793D1;margin-bottom:6px;border-bottom:1px solid #1e3a5f;padding-bottom:4px}
.msm-item{font-size:9.5px;color:#94a3b8;margin-bottom:2px;padding-left:10px;position:relative}
.msm-item::before{content:"·";position:absolute;left:2px;color:#1793D1}
.msm-warn{color:#fca5a5}
.msm-ok{color:#86efac}
</style>
<div class="msm-wrap">
  <div class="msm-center">MICROSERVICES</div>
  <div class="msm-grid">
    <div class="msm-node">
      <div class="msm-node-title">Fundamentos</div>
      <div class="msm-item">Database per service</div>
      <div class="msm-item">Deploy independente</div>
      <div class="msm-item">Fronteira = Bounded Context</div>
      <div class="msm-item">Falha isolada</div>
      <div class="msm-item msm-warn">Não = pequeno em LoC</div>
    </div>
    <div class="msm-node">
      <div class="msm-node-title">Comunicação</div>
      <div class="msm-item">REST sync (interativo)</div>
      <div class="msm-item">gRPC (performance interna)</div>
      <div class="msm-item">Kafka async (eventos)</div>
      <div class="msm-item">API Gateway + BFF</div>
      <div class="msm-item">Service Discovery</div>
    </div>
    <div class="msm-node">
      <div class="msm-node-title">Transações Distribuídas</div>
      <div class="msm-item msm-warn">Sem 2PC</div>
      <div class="msm-item">Saga Choreography</div>
      <div class="msm-item">Saga Orchestration</div>
      <div class="msm-item">Outbox Pattern</div>
      <div class="msm-item">Idempotência obrigatória</div>
    </div>
    <div class="msm-node">
      <div class="msm-node-title">Resiliência (CBRT)</div>
      <div class="msm-item">Circuit Breaker</div>
      <div class="msm-item">Bulkhead</div>
      <div class="msm-item">Retry + backoff + jitter</div>
      <div class="msm-item">Timeout em toda chamada</div>
      <div class="msm-item">Fallback definido</div>
    </div>
    <div class="msm-node">
      <div class="msm-node-title">Observabilidade (LMT)</div>
      <div class="msm-item">Logs JSON + correlation-id</div>
      <div class="msm-item">Metrics: Prometheus/Grafana</div>
      <div class="msm-item">Traces: OpenTelemetry+Jaeger</div>
      <div class="msm-item">SLI/SLO/Error Budget</div>
      <div class="msm-item">Alertas em SLO</div>
    </div>
    <div class="msm-node">
      <div class="msm-node-title">Quando NÃO usar</div>
      <div class="msm-item msm-warn">Time &lt;10 pessoas</div>
      <div class="msm-item msm-warn">Domínio indefinido (pré-PMF)</div>
      <div class="msm-item msm-warn">Sem DevOps maduro</div>
      <div class="msm-item msm-warn">Distributed monolith</div>
      <div class="msm-item msm-ok">Monolito modular ganha</div>
    </div>
    <div class="msm-node">
      <div class="msm-node-title">Migração: Strangler Fig</div>
      <div class="msm-item">Modularize o monolito</div>
      <div class="msm-item">Proxy layer primeiro</div>
      <div class="msm-item">Extrai 1 BC por vez</div>
      <div class="msm-item">Schema → DB separation</div>
      <div class="msm-item">Feature flags + rollout</div>
    </div>
    <div class="msm-node">
      <div class="msm-node-title">Anti-patterns</div>
      <div class="msm-item msm-warn">Serviço por entidade/tabela</div>
      <div class="msm-item msm-warn">Banco compartilhado</div>
      <div class="msm-item msm-warn">Deploy coordenado</div>
      <div class="msm-item msm-warn">Sem observability</div>
      <div class="msm-item msm-warn">Big bang migration</div>
    </div>
    <div class="msm-node">
      <div class="msm-node-title">Teste</div>
      <div class="msm-item">Unit (lógica de domínio)</div>
      <div class="msm-item">Component (serviço isolado)</div>
      <div class="msm-item">Contract (Pact)</div>
      <div class="msm-item msm-warn">E2E mínimo (lento/frágil)</div>
      <div class="msm-item">Chaos engineering</div>
    </div>
  </div>
</div>`,
    },
  },

  'cqrs': {
    tagline: 'Segregar o modelo de escrita do modelo de leitura quando os requisitos divergem e CRUD começa a doer.',
    why: 'CQRS aparece em vaga sênior em fintech, e-commerce e sistemas com leitura pesada. O entrevistador testa se você sabe quando aplicar (raro) e quando NÃO aplicar (frequente). Confundir CQRS com Event Sourcing é erro clássico que elimina candidatos bons.',
    prerequisite: 'DDD (Aggregates, Domain Events), Event Sourcing básico, mensageria (Kafka/RabbitMQ), Outbox Pattern.',
    summary: 'CQRS (Command Query Responsibility Segregation) separa o modelo que escreve (Command) do modelo que lê (Query). Cada lado pode ter banco próprio, schema otimizado e escala independente. Útil quando leitura e escrita têm requisitos muito diferentes — escrita transacional num banco normalizado, leitura denormalizada num search engine ou view materializada. Comumente combinado com Event Sourcing, mas são independentes — CQRS pode existir com Postgres simples no write side. Custo real: complexidade alta, eventual consistency visível ao usuário, projectors para manter, reconstrução de read model em falha. Em CRUD normal é overkill brutal.',
    howToStudy: 'Estude nesta ordem: 1) CQS (Bertrand Meyer) — o princípio original mais simples. 2) CQRS básico com mesmo banco mas serviços separados. 3) CQRS com read model separado (Redis/ElasticSearch). 4) CQRS + Event Sourcing como combinação avançada. Implemente um CRUD simples, depois migre para CQRS e sinta o custo real antes de defender o padrão.',
    diagrams: [
      {
        title: 'Fluxo CQRS — Command Bus e Query Bus',
        caption: 'Separação completa do caminho de escrita (Command) e leitura (Query) com handlers e modelos distintos.',
        html: `<style>
.cq1-wrap{font-family:system-ui,sans-serif;width:100%;background:#0a0f1e;border-radius:10px;padding:16px;border:1.5px solid #1793D1}
.cq1-row{display:flex;gap:10px;margin-bottom:10px;align-items:stretch}
.cq1-box{background:#0f172a;border:1px solid #1e3a5f;border-radius:7px;padding:9px 12px;font-size:10px;color:#cbd5e1;flex:1;text-align:center}
.cq1-box strong{display:block;font-size:11px;margin-bottom:3px}
.cq1-cmd .cq1-box strong{color:#f87171}
.cq1-qry .cq1-box strong{color:#34d399}
.cq1-bus{border:1.5px solid #1793D1!important;background:#0c2340!important}
.cq1-bus strong{color:#1793D1!important}
.cq1-db-w{border-color:#f87171!important;background:#1c0a0a!important}
.cq1-db-w strong{color:#fca5a5!important}
.cq1-db-r{border-color:#34d399!important;background:#061c12!important}
.cq1-db-r strong{color:#6ee7b7!important}
.cq1-arrow{text-align:center;font-size:13px;color:#1793D1;line-height:1.4;font-weight:700}
.cq1-label{font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.6px;font-weight:600;margin-bottom:5px}
.cq1-section{flex:1;background:#0a0f1e;border-radius:8px;padding:10px;border:1px solid #1e3a5f}
.cq1-section-head{font-size:11px;font-weight:700;padding:4px 8px;border-radius:5px;text-align:center;margin-bottom:8px}
.cq1-cmd .cq1-section-head{background:#450a0a;color:#fca5a5}
.cq1-qry .cq1-section-head{background:#052e16;color:#86efac}
.cq1-vs{display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:700;font-size:13px;padding:0 4px}
.cq1-event{background:#312e81;border:1px solid #4f46e5;border-radius:5px;padding:5px 8px;font-size:9.5px;color:#a5b4fc;text-align:center;margin-top:6px}
</style>
<div class="cq1-wrap">
  <div class="cq1-label">Entrada (Controller / API)</div>
  <div class="cq1-row">
    <div class="cq1-box cq1-cmd" style="border-color:#f87171"><strong>POST /orders</strong>CreateOrderCommand{<!-- -->{ customerId, items }}</div>
    <div class="cq1-box cq1-qry" style="border-color:#34d399"><strong>GET /orders?userId=x</strong>GetOrdersQuery{<!-- -->{ userId, page }}</div>
  </div>
  <div class="cq1-row" style="gap:10px">
    <div class="cq1-section cq1-cmd" style="border-color:#450a0a">
      <div class="cq1-section-head">COMMAND SIDE (Write)</div>
      <div class="cq1-box cq1-bus"><strong>Command Bus</strong>roteia para handler</div>
      <div style="margin-top:6px" class="cq1-box" style="border-color:#7f1d1d"><strong>CreateOrderHandler</strong>valida, aplica regras, salva Aggregate</div>
      <div class="cq1-event">publica: OrderCreated event</div>
      <div style="margin-top:6px" class="cq1-box cq1-db-w"><strong>Write DB (Postgres)</strong>schema normalizado, ACID, invariantes</div>
    </div>
    <div class="cq1-vs">⟷</div>
    <div class="cq1-section cq1-qry" style="border-color:#052e16">
      <div class="cq1-section-head">QUERY SIDE (Read)</div>
      <div class="cq1-box cq1-bus"><strong>Query Bus</strong>roteia para handler</div>
      <div style="margin-top:6px" class="cq1-box" style="border-color:#065f46"><strong>GetOrdersHandler</strong>lê direto do read model, sem regra de negócio</div>
      <div class="cq1-event" style="background:#052e16;border-color:#065f46;color:#6ee7b7">consome: OrderCreated → projeta</div>
      <div style="margin-top:6px" class="cq1-box cq1-db-r"><strong>Read DB (ElasticSearch / Redis)</strong>denormalizado, otimizado por query</div>
    </div>
  </div>
</div>`,
      },
      {
        title: 'CQRS + Event Sourcing — Write Side vs Read Side',
        caption: 'Event Store como fonte da verdade no write side; projectors constroem read models independentes.',
        html: `<style>
.cq2-wrap{font-family:system-ui,sans-serif;width:100%;background:#0a0f1e;border-radius:10px;padding:16px;border:1.5px solid #1793D1}
.cq2-row{display:flex;gap:10px;margin-bottom:8px}
.cq2-box{background:#0f172a;border:1px solid #1e3a5f;border-radius:7px;padding:8px 12px;font-size:10px;color:#cbd5e1;flex:1;text-align:center}
.cq2-box strong{display:block;font-size:11px;margin-bottom:3px}
.cq2-es{border-color:#f59e0b!important;background:#1c1008!important}
.cq2-es strong{color:#fbbf24!important}
.cq2-proj{border-color:#8b5cf6!important;background:#120d1f!important}
.cq2-proj strong{color:#c4b5fd!important}
.cq2-rm{border-color:#34d399;background:#061c12}
.cq2-rm strong{color:#6ee7b7}
.cq2-arrow{text-align:center;font-size:13px;color:#1793D1;margin:3px 0;font-weight:700}
.cq2-label{font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.6px;font-weight:600;margin-bottom:5px}
.cq2-note{background:#1e293b;border-left:3px solid #f59e0b;padding:8px 12px;font-size:10px;color:#94a3b8;border-radius:0 6px 6px 0;margin-top:10px}
</style>
<div class="cq2-wrap">
  <div class="cq2-label">Write Side — Event Sourcing</div>
  <div class="cq2-row">
    <div class="cq2-box" style="border-color:#f87171"><strong>CreateOrderCommand</strong></div>
    <div class="cq2-box"><strong>Order Aggregate</strong>aplica regras, emite eventos</div>
  </div>
  <div class="cq2-arrow">↓</div>
  <div class="cq2-row">
    <div class="cq2-box cq2-es"><strong>Event Store (Kafka / EventStoreDB)</strong>OrderCreated{<!-- -->{ id, items, total }}<br/>OrderPaid{<!-- -->{ paymentId }}<br/>OrderShipped{<!-- -->{ trackingCode }}<br/><em style="font-size:9px;color:#92400e">Fonte da verdade — nunca muta</em></div>
  </div>
  <div class="cq2-arrow">↓ (stream de eventos)</div>
  <div class="cq2-label">Read Side — Projectors constroem Read Models</div>
  <div class="cq2-row">
    <div class="cq2-box cq2-proj"><strong>OrderSummaryProjector</strong>consome eventos do stream</div>
    <div class="cq2-box cq2-proj"><strong>DashboardProjector</strong>métricas e agregações</div>
    <div class="cq2-box cq2-proj"><strong>SearchProjector</strong>full-text index</div>
  </div>
  <div class="cq2-arrow">↓</div>
  <div class="cq2-row">
    <div class="cq2-box cq2-rm"><strong>Orders Table (Postgres)</strong>denormalizado, por UI</div>
    <div class="cq2-box cq2-rm"><strong>Redis Cache</strong>dashboard real-time</div>
    <div class="cq2-box cq2-rm"><strong>Elasticsearch</strong>full-text search</div>
  </div>
  <div class="cq2-note">
    <strong style="color:#fbbf24">Read models são descartáveis</strong> — se o projector tiver bug, apaga o read model e reconstrói replaying todos os eventos do Event Store. Isso é a superpotência do ES+CQRS.<br/>
    <strong style="color:#e2e8f0">Custo:</strong> reconstrução pode demorar horas em sistemas grandes — use snapshots periodicamente.
  </div>
</div>`,
      },
      {
        title: 'CQRS Simples vs CQRS + Event Sourcing — Tradeoffs',
        caption: 'Quando cada variante faz sentido e o que cada uma custa em complexidade operacional.',
        html: `<style>
.cq3-wrap{font-family:system-ui,sans-serif;width:100%;background:#0a0f1e;border-radius:10px;padding:16px;border:1.5px solid #1793D1}
.cq3-title{font-size:12px;font-weight:700;color:#1793D1;margin-bottom:12px}
.cq3-table{width:100%;border-collapse:collapse;font-size:10px}
.cq3-table th{background:#1e3a5f;color:#93c5fd;padding:7px 10px;text-align:left;font-size:10px}
.cq3-table td{padding:7px 10px;color:#cbd5e1;border-bottom:1px solid #1e293b;vertical-align:top}
.cq3-table tr:last-child td{border-bottom:none}
.cq3-ok{color:#4ade80;font-weight:600}
.cq3-warn{color:#fbbf24;font-weight:600}
.cq3-bad{color:#f87171;font-weight:600}
.cq3-note{background:#1e293b;border-left:3px solid #1793D1;padding:8px 12px;font-size:10px;color:#94a3b8;border-radius:0 6px 6px 0;margin-top:10px}
</style>
<div class="cq3-wrap">
  <div class="cq3-title">CQRS: Variantes e Tradeoffs</div>
  <table class="cq3-table">
    <tr>
      <th>Aspecto</th>
      <th>CRUD puro</th>
      <th>CQRS simples</th>
      <th>CQRS + Event Sourcing</th>
    </tr>
    <tr>
      <td><strong>Write model</strong></td>
      <td>Mesmo modelo</td>
      <td><span class="cq3-ok">Separado (Aggregate)</span></td>
      <td><span class="cq3-ok">Event Store (imutável)</span></td>
    </tr>
    <tr>
      <td><strong>Read model</strong></td>
      <td>Mesmo modelo</td>
      <td><span class="cq3-ok">View/projeção separada</span></td>
      <td><span class="cq3-ok">N read models independentes</span></td>
    </tr>
    <tr>
      <td><strong>Consistência</strong></td>
      <td>Strong (ACID)</td>
      <td><span class="cq3-warn">Eventual (ms a s)</span></td>
      <td><span class="cq3-warn">Eventual + replay</span></td>
    </tr>
    <tr>
      <td><strong>Auditoria</strong></td>
      <td><span class="cq3-bad">Só estado atual</span></td>
      <td><span class="cq3-warn">Depende de audit log</span></td>
      <td><span class="cq3-ok">Histórico completo nativo</span></td>
    </tr>
    <tr>
      <td><strong>Debug de estado</strong></td>
      <td>Fácil</td>
      <td>Médio</td>
      <td><span class="cq3-warn">Difícil (replay de eventos)</span></td>
    </tr>
    <tr>
      <td><strong>Complexidade operacional</strong></td>
      <td><span class="cq3-ok">Baixa</span></td>
      <td><span class="cq3-warn">Média</span></td>
      <td><span class="cq3-bad">Alta (versionamento de evento, snapshot)</span></td>
    </tr>
    <tr>
      <td><strong>Quando usar</strong></td>
      <td>CRUD, protótipos</td>
      <td>Read pesada, requisitos divergentes</td>
      <td>Auditoria obrigatória, time-travel, BI</td>
    </tr>
  </table>
  <div class="cq3-note">
    Greg Young (criador do CQRS): <em>"If you have doubt about using CQRS, don't."</em><br/>
    Comece com CRUD. Migre para CQRS simples quando a dor aparecer. Adicione Event Sourcing só se o domínio exigir histórico completo.
  </div>
</div>`,
      },
    ],
    keypoints: [
      { title: 'CQS: o princípio original (Meyer)', body: 'Command Query Separation de Bertrand Meyer: um método ou muda estado (command) ou retorna valor (query), nunca os dois. CQRS eleva isso para nível arquitetural — objetos/serviços/bancos separados por responsabilidade.' },
      { title: 'Command: altera, não retorna dado', body: 'Command muda estado do sistema e retorna apenas ack (void/201/ID). Nunca retorna o objeto criado/modificado — quem precisa lê via Query. Isso força a separação real e evita que o write side seja tentado a otimizar leituras.' },
      { title: 'Query: lê, não altera estado', body: 'Query retorna dado e jamais tem efeito colateral. O read side pode ter qualquer estrutura — view materializada em Postgres, projeção em ElasticSearch, cache em Redis — o que for mais rápido para a consulta específica.' },
      { title: 'Read model denormalizado e descartável', body: 'O read model é construído especificamente para a query — denormalizado, com JOINs pré-computados. É descartável: se tiver bug ou precisar mudar formato, apaga e reconstrói a partir dos eventos. Isso funciona especialmente bem com Event Sourcing.' },
      { title: 'Sincronização via eventos (Outbox)', body: 'Write side publica evento (OrderCreated). Projector consome e atualiza read model. A sincronização mais segura usa Outbox Pattern: evento gravado no mesmo banco na mesma transação, relay publica para broker. Eventual consistency é a regra — latência típica de ms a segundos.' },
      { title: 'CQRS ≠ Event Sourcing', body: 'CQRS pode existir sem Event Sourcing — write num Postgres normal, evento publicado, read model em ElasticSearch. Event Sourcing armazena eventos como fonte de verdade e reconstrói estado por replay. Eles combinam bem, mas são decisões independentes. Comece CQRS sem ES.' },
      { title: 'Múltiplas projeções independentes', body: 'Para cada caso de uso de leitura, uma projeção otimizada. Dashboard usa uma, busca por texto usa outra, relatório contábil usa outra. Custa storage e projectors, mas resolve performance de forma cirúrgica.' },
      { title: 'Quando vale o custo', body: 'Read/write ratio muito assimétrico (100:1), requisitos conceitualmente diferentes (escrita ACID + leitura full-text), escala independente crítica, auditoria obrigatória de estado histórico. Sem ao menos dois desses, CRUD ganha.' },
    ],
    cheatsheet: {
      title: 'Cheatsheet CQRS — Estrutura de Command/Query com NestJS/CQRS',
      html: `<style>
.cqc-wrap{font-family:'JetBrains Mono',monospace,system-ui;width:100%;background:#0a0f1e;border-radius:10px;padding:16px;border:1.5px solid #1793D1}
.cqc-title{font-size:12px;font-weight:700;color:#1793D1;margin-bottom:12px;font-family:system-ui}
.cqc-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.cqc-block{background:#0f172a;border:1px solid #1e3a5f;border-radius:8px;padding:12px}
.cqc-head{font-size:10px;font-weight:700;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #1e3a5f;font-family:system-ui}
.cqc-cmd .cqc-head{color:#f87171}
.cqc-qry .cqc-head{color:#34d399}
.cqc-proj .cqc-head{color:#c4b5fd}
.cqc-es .cqc-head{color:#fbbf24}
.cqc-code{font-size:9px;color:#a5f3fc;line-height:1.6;white-space:pre}
.cqc-comment{color:#4b5563}
.cqc-kw{color:#c084fc}
.cqc-type{color:#fbbf24}
.cqc-str{color:#86efac}
.cqc-full{grid-column:span 2}
</style>
<div class="cqc-wrap">
  <div class="cqc-title">CQRS com @nestjs/cqrs — Estrutura Completa</div>
  <div class="cqc-grid">
    <div class="cqc-block cqc-cmd">
      <div class="cqc-head">Command + Handler</div>
      <pre class="cqc-code"><span class="cqc-comment">// create-order.command.ts</span>
<span class="cqc-kw">export class</span> <span class="cqc-type">CreateOrderCommand</span> {
  <span class="cqc-kw">constructor</span>(
    <span class="cqc-kw">public readonly</span> customerId: <span class="cqc-type">string</span>,
    <span class="cqc-kw">public readonly</span> items: <span class="cqc-type">OrderItem</span>[],
  ) {}
}

<span class="cqc-comment">// create-order.handler.ts</span>
<span class="cqc-kw">@CommandHandler</span>(<span class="cqc-type">CreateOrderCommand</span>)
<span class="cqc-kw">export class</span> <span class="cqc-type">CreateOrderHandler</span> {
  <span class="cqc-kw">async</span> execute(cmd: <span class="cqc-type">CreateOrderCommand</span>) {
    <span class="cqc-kw">const</span> order = Order.create(cmd)
    <span class="cqc-kw">await</span> this.orderRepo.save(order)
    <span class="cqc-comment">// publica via outbox</span>
    <span class="cqc-kw">await</span> this.outbox.insert(order.events)
  }
}</pre>
    </div>
    <div class="cqc-block cqc-qry">
      <div class="cqc-head">Query + Handler</div>
      <pre class="cqc-code"><span class="cqc-comment">// get-orders.query.ts</span>
<span class="cqc-kw">export class</span> <span class="cqc-type">GetOrdersQuery</span> {
  <span class="cqc-kw">constructor</span>(
    <span class="cqc-kw">public readonly</span> userId: <span class="cqc-type">string</span>,
    <span class="cqc-kw">public readonly</span> page: <span class="cqc-type">number</span>,
  ) {}
}

<span class="cqc-comment">// get-orders.handler.ts</span>
<span class="cqc-kw">@QueryHandler</span>(<span class="cqc-type">GetOrdersQuery</span>)
<span class="cqc-kw">export class</span> <span class="cqc-type">GetOrdersHandler</span> {
  <span class="cqc-kw">async</span> execute(q: <span class="cqc-type">GetOrdersQuery</span>) {
    <span class="cqc-comment">// lê do read model (denormalizado)</span>
    <span class="cqc-kw">return</span> this.readRepo.findByUser(
      q.userId, q.page
    )
  }
}</pre>
    </div>
    <div class="cqc-block cqc-proj">
      <div class="cqc-head">Projector (atualiza read model)</div>
      <pre class="cqc-code"><span class="cqc-comment">// order-summary.projector.ts</span>
<span class="cqc-kw">@EventsHandler</span>(<span class="cqc-type">OrderCreatedEvent</span>)
<span class="cqc-kw">export class</span> <span class="cqc-type">OrderSummaryProjector</span> {
  <span class="cqc-kw">async</span> handle(e: <span class="cqc-type">OrderCreatedEvent</span>) {
    <span class="cqc-comment">// idempotência obrigatória</span>
    <span class="cqc-kw">const</span> exists = <span class="cqc-kw">await</span>
      this.readRepo.exists(e.orderId)
    <span class="cqc-kw">if</span> (exists) <span class="cqc-kw">return</span>

    <span class="cqc-kw">await</span> this.readRepo.upsert({
      orderId: e.orderId,
      status: <span class="cqc-str">'pending'</span>,
      total: e.total,
      createdAt: e.occurredOn,
    })
  }
}</pre>
    </div>
    <div class="cqc-block cqc-es">
      <div class="cqc-head">Controller (despacha Command/Query)</div>
      <pre class="cqc-code"><span class="cqc-comment">// orders.controller.ts</span>
<span class="cqc-kw">@Controller</span>(<span class="cqc-str">'orders'</span>)
<span class="cqc-kw">export class</span> <span class="cqc-type">OrdersController</span> {
  <span class="cqc-kw">constructor</span>(
    <span class="cqc-kw">private readonly</span> bus: <span class="cqc-type">CommandBus</span>,
    <span class="cqc-kw">private readonly</span> queries: <span class="cqc-type">QueryBus</span>,
  ) {}

  <span class="cqc-kw">@Post</span>()
  create(<span class="cqc-kw">@Body</span>() dto: <span class="cqc-type">CreateOrderDto</span>) {
    <span class="cqc-kw">return</span> this.bus.execute(
      <span class="cqc-kw">new</span> <span class="cqc-type">CreateOrderCommand</span>(
        dto.customerId, dto.items
      )
    )
  }

  <span class="cqc-kw">@Get</span>()
  list(<span class="cqc-kw">@Query</span>() q: <span class="cqc-type">ListOrdersDto</span>) {
    <span class="cqc-kw">return</span> this.queries.execute(
      <span class="cqc-kw">new</span> <span class="cqc-type">GetOrdersQuery</span>(q.userId, q.page)
    )
  }
}</pre>
    </div>
  </div>
</div>`,
    },
    mnemonics: [
      {
        label: 'CWR — O que Command e Query fazem',
        trick: 'C-W-R: "Command Writes, Query Reads" — nunca os dois ao mesmo tempo',
        explanation: 'Command (C) escreve (W) estado e não retorna dado. Query (Q) lê (R) e não muda estado. Mnemônico simples para lembrar a separação fundamental e explicar o princípio em entrevista sem gaguejar.',
      },
      {
        label: 'CQRS ≠ ES — a distinção crítica',
        trick: '"CQRS tem Query Bus, ES tem Event Store" — são eixos diferentes',
        explanation: 'CQRS = separação de modelos de leitura/escrita (eixo de responsabilidade). Event Sourcing = eventos como fonte de verdade (eixo de persistência). Podem existir independentemente. Confundi-los em entrevista é sinal de que você leu sobre mas não implementou.',
      },
      {
        label: 'PIP — quando CQRS vale o custo',
        trick: 'PIP: "Performance, Independência, Projeções" — precisa dos 3 ou não vale',
        explanation: 'Performance assimétrica (read/write muito diferentes), Independência de escala e banco por lado, Projeções múltiplas necessárias. Se não tem ao menos dois, CRUD com view materializada resolve mais barato.',
      },
      {
        label: 'OREO — eventual consistency na UI',
        trick: 'OREO: "Optimistic, Read-your-writes, Eventually, Observe"',
        explanation: 'As quatro estratégias para lidar com eventual consistency no front-end: Optimistic update (atualiza antes de confirmar), Read-your-writes (espera versão alcançar), Eventually (aceita delay com UX de "processando"), Observe via WebSocket/push quando projector terminar.',
      },
    ],
    gotchas: [
      'Aplicar CQRS em CRUD trivial — duplica código, adiciona eventual consistency sem ganho real. Greg Young: "if you have doubt, don\'t."',
      'Confundir CQRS com "ter DTO de leitura diferente do DTO de escrita" — isso é só boa prática de API, não CQRS. CQRS implica separação de handlers, modelos e geralmente bancos distintos.',
      'Esquecer que o usuário vai ver leitura desatualizada — UI precisa lidar com "acabei de criar e não vejo na lista". Implemente optimistic update ou mostre "processando...".',
      'Projector sem idempotência — at-least-once delivery garante que o mesmo evento chega mais de uma vez. Sem idempotência no projector, o read model fica corrompido.',
      'Read model fora do ar = sistema "parece quebrado" mesmo com write funcionando — observability dos projectors é crítica. Alerte quando projector atrasar mais de N segundos.',
      'Reconstruir read model demora horas em sistemas grandes — planeje desde o início: snapshots periódicos, replay paralelo, projeção em background sem derrubar a existente.',
      'Event Sourcing "de graça" junto com CQRS — ES tem complexidade própria pesada (versionamento de evento, upcasting, snapshot strategy). Decida explicitamente, não por acidente.',
      'Tratar Command como Request/Response — Command retorna só ack (ID ou 202 Accepted). Quem precisa do resultado lê via Query. Misturar os dois mata o ponto da separação.',
    ],
    interview: [
      {
        q: 'Quando NÃO usar CQRS?',
        a: '<p>Em <strong>CRUD comum</strong>, onde leitura e escrita usam o mesmo modelo e não há requisito divergente. CQRS adiciona: dois modelos, sincronização, eventual consistency, projector para manter, bug de "criei e não apareceu na lista". Sem necessidade real, é sabotagem do próprio time.</p><p>Greg Young (criador do padrão): <em>"if you have doubt about whether you need CQRS, you don\'t."</em> Comece com modelo único, evolua para CQRS quando a dor de performance ou divergência de requisito aparecer com dados reais.</p>',
        level: 'pleno',
      },
      {
        q: 'Tradeoff: CQRS vs view materializada simples?',
        a: '<p><strong>View materializada</strong> (ou cache, ou índice) resolve 80% dos casos onde leitura está lenta — sem mudar arquitetura. Postgres tem <code>MATERIALIZED VIEW</code>, ElasticSearch como réplica via CDC (Debezium), Redis como cache de query pesada.</p><p><strong>CQRS completo</strong> faz sentido quando: write e read têm <strong>modelos conceitualmente diferentes</strong> (não só formato de payload), escala independente é crítica, ou o negócio exige projeções radicalmente diferentes do mesmo dado. Sênior tenta a solução mais simples primeiro.</p>',
        level: 'senior',
      },
      {
        q: 'Como você lida com eventual consistency na UI?',
        a: '<p>Quatro estratégias, escolhidas pelo criticidade da ação:</p><ul><li><strong>Optimistic update</strong>: UI atualiza imediatamente como se sucesso, reverte em erro — melhor UX para ação não crítica</li><li><strong>Read-your-writes</strong>: command retorna versão/timestamp, query espera o read model alcançar aquela versão antes de responder</li><li><strong>Polling</strong>: UI re-busca após delay estimado (ex: 500ms) — simples mas não elegante</li><li><strong>WebSocket/SSE push</strong>: projector emite evento quando termina, UI atualiza — melhor UX mas infraestrutura adicional</li></ul><p>Para ação crítica (criar pedido, pagamento), mostro "processando..." e bloqueo nova ação até confirmar. Tentar esconder eventual consistency 100% é batalha perdida.</p>',
        level: 'pleno',
      },
      {
        q: 'CQRS sempre exige Event Sourcing?',
        a: '<p>Não — são decisões independentes em dois eixos diferentes. <strong>CQRS</strong> é sobre separação de responsabilidade (quem escreve vs quem lê). <strong>Event Sourcing</strong> é sobre persistência (guardar eventos como fonte de verdade em vez do estado atual).</p><p>Você pode ter CQRS com write num Postgres normal (guarda estado atual), publicar evento de domínio via outbox, e atualizar read model em ElasticSearch — sem ES. ES adiciona: histórico completo imutável, time-travel, reconstituição de estado por replay. Mas também adiciona: versionamento de eventos, upcasting, snapshot strategy. Comece CQRS sem ES — muito mais simples.</p>',
        level: 'pleno',
      },
      {
        q: 'Como você sincroniza write e read model de forma confiável?',
        a: '<p>O padrão mais robusto é o <strong>Outbox Pattern</strong>: na mesma transação do write (commit no banco), insiro o evento numa tabela <code>outbox</code>. Um relay separado lê da outbox e publica no broker (Kafka/RabbitMQ). Projector consome e atualiza read model. Garantia: <strong>at-least-once sem 2PC</strong>.</p><p>Alternativas: CDC via Debezium (lê WAL do Postgres e publica — zero código no app, mas dependência de Debezium), ou evento publicado direto após commit (perigoso — falha entre commit e publish perde o evento). Idempotência no projector é <strong>obrigatória</strong> em qualquer abordagem at-least-once.</p>',
        level: 'senior',
      },
      {
        q: 'Como você reconstrói um read model corrompido ou desatualizado?',
        a: '<p>Se tenho <strong>Event Sourcing</strong>: replayo todos os eventos relevantes do Event Store para um novo read model. Processo em paralelo com o modelo atual, verifico consistência, faço swap atômico. O modelo antigo funciona durante a reconstrução.</p><p>Sem ES: preciso de alguma forma de reprocessar o histórico — log de auditoria, backup de estado, ou reprocessamento via CDC. É mais difícil — argumento adicional para ter Event Sourcing se auditoria/reconstrução for requisito.</p><p>Para sistemas grandes: snapshot periódico (ex: estado a cada 1000 eventos) + replay apenas os eventos posteriores ao snapshot. Reduz tempo de reconstrução de horas para minutos.</p>',
        level: 'senior',
      },
      {
        q: 'Como você implementaria CQRS num sistema existente (migração incremental)?',
        a: '<p>Não faço big bang. Migração incremental:</p><ol><li>Identifica o endpoint de <strong>leitura mais crítico/lento</strong> — aquele que mais se beneficia de denormalização</li><li>Adiciona read model separado (Redis cache ou view materializada) para esse endpoint específico</li><li>Projector simples que atualiza o cache quando dado muda — mantém ambos os caminhos por um tempo</li><li>Monitora e valida, depois expande para outros endpoints</li></ol><p>A separação de Command e Query em handlers pode acontecer antes de ter bancos diferentes — é só organização de código. Bancos diferentes são o passo seguinte, com a sincronia via eventos como o custo principal a absorver.</p>',
        level: 'senior',
      },
      {
        q: 'O que é um projector e quais são suas responsabilidades?',
        a: '<p>Projector é o componente que <strong>consome eventos de domínio e atualiza o read model</strong>. É o "cola" entre write side e read side no CQRS.</p><p>Responsabilidades: consumir eventos do broker (Kafka consumer, event handler), verificar idempotência (não processar o mesmo evento duas vezes), transformar o evento em mutação no read model (INSERT/UPDATE/DELETE na view denormalizada), e emitir métricas de lag (alertar quando atraso entre write e read model ultrapassar SLA).</p><p>O que um projector <strong>NÃO deve fazer</strong>: chamar outros serviços, aplicar regras de negócio, ou ter efeitos colaterais além de atualizar o read model.</p>',
        level: 'pleno',
      },
      {
        q: 'Como CQRS se relaciona com microservices?',
        a: '<p>CQRS e microservices se complementam naturalmente. Em microservices, cada serviço pode ter seu próprio write model (Aggregate + banco normalizado) e um ou mais read models denormalizados para suas queries específicas.</p><p>Fluxo típico: <strong>Saga + CQRS</strong> — Command em serviço A gera evento via outbox, serviço B consome e atualiza seu read model próprio. Serviço B nunca faz JOIN no banco de A — usa apenas os dados que projetou localmente a partir de eventos. Isso garante a autonomia de banco que microservices exige.</p>',
        level: 'senior',
      },
      {
        q: 'Qual a diferença entre CQS e CQRS?',
        a: '<p><strong>CQS (Command Query Separation)</strong> é um princípio de design de Bertrand Meyer aplicado ao nível de método/objeto: um método ou muda estado (command) ou retorna valor (query), nunca os dois. Exemplo: <code>stack.pop()</code> viola CQS (remove E retorna).</p><p><strong>CQRS</strong> eleva esse princípio para nível arquitetural: objetos/serviços/handlers/bancos diferentes para cada responsabilidade. Greg Young cunhou o termo ao perceber que times aplicavam CQS em nível macro. CQRS é muito mais custoso que CQS — CQS é boa prática sempre, CQRS é padrão arquitetural para casos específicos.</p>',
        level: 'senior',
      },
      {
        q: 'Como você testa o lado de Command e o lado de Query independentemente?',
        a: '<p><strong>Command side</strong>: unit tests no Aggregate/domain logic (sem infraestrutura), testes de integração no handler com banco real (Testcontainers). Assert: evento publicado na outbox, estado correto no write DB.</p><p><strong>Query side/Projector</strong>: testa o projector isoladamente injetando eventos e verificando o read model resultante. Read handlers: testam contra read DB populado pelo projector.</p><p><strong>Contract test</strong>: garante que o evento que o write side publica tem o schema que o projector espera consumir — evita breaking change silencioso entre os dois lados.</p>',
        level: 'senior',
      },
      {
        q: 'Como você monitora a saúde do CQRS em produção?',
        a: '<p>As métricas críticas: <strong>projector lag</strong> (tempo entre evento publicado e read model atualizado — alerte se &gt;5s em sistema normal), <strong>event queue depth</strong> (crescimento indica projector atrasado), <strong>idempotency skips</strong> (quantas vezes o projector pulou evento duplicado), e <strong>read model staleness</strong> (quão antigo está o dado mais recente em cada projeção).</p><p>Alertas: projector parado (lag cresce sem parar), read model muito defasado (impacta SLA de consistência), dead letter queue crescendo (eventos que o projector não consegue processar — geralmente schema incompatível).</p>',
        level: 'senior',
      },
      {
        q: 'Como você decide o schema do read model — o que desnormalizar?',
        level: 'senior',
        a: '<p>Read model é otimizado para a <strong>query específica que serve</strong>, não para normalização. A pergunta certa não é "como organizo os dados?" mas "qual é a tela/relatório que isso alimenta?"</p><p>Processo de decisão:</p><ol><li><strong>Identifica a query leaf</strong> — a query mais frequente e mais lenta. Ex: tela de lista de pedidos com nome do cliente, total, status e data. Essa é a query a otimizar.</li><li><strong>Projeta o documento ideal para essa query</strong>: <code>{ orderId, customerName, total, itemCount, status, createdAt }</code> — tudo numa linha, sem JOIN. JOIN zero na leitura é o objetivo.</li><li><strong>Aceita redundância</strong>: o nome do cliente vai estar em cada pedido do read model. Se o cliente muda de nome, o projector recebe CustomerNameUpdated e atualiza todos os pedidos desse cliente. Essa é a consistência eventual aceitável.</li><li><strong>Cria read models diferentes por caso de uso</strong>: tela de lista tem um schema; tela de detalhe tem outro (com todos os itens expandidos). Não tenta um read model "genérico" — ele degenera em modelo normalizado.</li></ol><p>Stores para read model: Postgres com tabela denormalizada, Redis para acesso por chave, Elasticsearch para busca full-text, DynamoDB para acesso por partition key de alta escala. Cada um serve um tipo de query diferente — não há escolha universal.</p>',
        tip: 'Definir schema a partir da query (não do domínio) é o ponto central de CQRS. Quem inverte essa lógica vai ter read model que não resolve o problema de performance.',
      },
      {
        q: 'Qual o impacto de CQRS na consistência de dados e como comunicar ao time de produto?',
        level: 'senior',
        a: '<p>CQRS com bancos separados introduz <strong>eventual consistency</strong>: a escrita aconteceu, mas a leitura pode refletir o dado antigo por milissegundos ou segundos. Isso é um tradeoff real que o time de produto precisa entender e aceitar.</p><p>Como comunicar ao produto:</p><ul><li><strong>Quantifique o lag esperado.</strong> "Após criar um pedido, ele aparece na lista em até 500ms." Produto precisa de número, não de conceito técnico.</li><li><strong>Identifique casos que não toleram eventual consistency.</strong> Pagamento processado? Deve aparecer imediatamente como "processando" — use optimistic update no frontend. Número de estoque em tempo real? Talvez esse campo específico precise ser lido do write model.</li><li><strong>Proponha UX que abraça o modelo.</strong> "Pedido criado com sucesso — aparecerá na lista em instantes." O usuário entende. É preferível a esconder e ter bug confuso.</li></ul><p>Impacto técnico que o time de engenharia precisa aceitar:</p><ul><li>Testes de integração precisam de await/polling para verificar read model após comando</li><li>Debugging requer correlacionar timestamps do evento com o read model</li><li>Rollback de read model corrompido exige replay — planejar antes de precisar</li></ul>',
        tip: 'Mostrar que você pensa em eventual consistency como uma conversa de produto, não só como detalhe técnico, demonstra maturidade de engenheiro sênior que trabalha com stakeholders.',
      },
      {
        q: 'CQRS com múltiplas projeções do mesmo evento — como organizar?',
        level: 'senior',
        a: '<p>Um único evento de domínio pode alimentar múltiplos read models com estruturas completamente diferentes. Exemplo: <code>OrderConfirmed</code> precisa atualizar:</p><ul><li><code>OrderSummaryView</code> — lista de pedidos do cliente</li><li><code>SalesReportView</code> — agregados por dia/mês para relatório financeiro</li><li><code>InventoryForecastView</code> — SKUs vendidos para previsão de estoque</li></ul><p>Padrões de organização:</p><ol><li><strong>Projector por read model.</strong> Cada view tem seu próprio consumer Kafka (com consumer group próprio). Eles processam o mesmo evento independentemente, no seu próprio ritmo, com sua própria tabela de idempotência. Um projector lento não bloqueia o outro.</li><li><strong>Projector multiplex (fan-out local).</strong> Um único consumer recebe o evento e chama múltiplos projectors internamente. Mais simples operacionalmente, mas um projector lento atrasa todos. Use só quando os projectors são para o mesmo bounded context.</li><li><strong>Separação por domínio.</strong> SalesReport é context diferente de Orders — consumer group diferente, repositório próprio, deploy próprio. Fronteira de contexto define separação de projector.</li></ol><p>Regra: prefira consumer group separado por read model crítico. Dá autonomia operacional — pode pausar e replay o SalesReport sem afetar OrderSummaryView.</p>',
        tip: 'Falar em consumer groups separados por projeção e motivar com autonomia operacional mostra que você pensa em CQRS como sistema de produção, não como arquitetura em papel.',
      },
      {
        q: 'Como você lida com versionamento de eventos em Event Sourcing?',
        level: 'senior',
        a: '<p>Versionamento de eventos é o problema mais subestimado de Event Sourcing. Você grava <code>OrderCreated v1</code> em 2023. Em 2024, o schema muda — como lidar com os eventos antigos?</p><p><strong>Upcasting</strong> — o padrão principal:</p><pre><code>// EventUpcaster transforma evento antigo em novo antes de entregar ao handler\nfunction upcastOrderCreated(raw: any): OrderCreatedV2 {\n  if (raw.version === 1) {\n    return {\n      ...raw,\n      version: 2,\n      // v1 não tinha campo "channel" — adiciona default\n      channel: \'web\',\n      // v1 tinha "amount" como number — v2 usa Money object\n      total: { amount: raw.amount, currency: \'BRL\' },\n    }\n  }\n  return raw\n}</code></pre><p>Outras estratégias:</p><ul><li><strong>Weak schema (JSON sem tipagem rígida):</strong> campos novos são opcionais. Handler usa <code>event.newField ?? defaultValue</code>. Simples mas frágil — perde segurança de tipo.</li><li><strong>Event versioning explícito:</strong> <code>OrderCreatedV1</code>, <code>OrderCreatedV2</code> como tipos distintos. Event Store guarda o tipo. Handler tem switch por versão. Mais verboso, mais explícito.</li><li><strong>Immutable old events:</strong> nunca modifica evento gravado. O upcaster é a camada de leitura. Garante auditoria perfeita — o log histórico é imutável.</li></ul><p>Regra de ouro: <strong>evento gravado nunca muda</strong>. Toda transformação acontece na leitura, não na gravação. Isso preserva o valor do Event Sourcing como audit log imutável.</p>',
        tip: 'Upcasting e "evento gravado nunca muda" são os dois conceitos-chave de versionamento em ES. Quem cita esses dois está no nível certo de ES avançado.',
      },
      {
        q: 'Como CQRS impacta a segurança e autorização de acesso?',
        level: 'senior',
        a: '<p>CQRS introduce uma separação natural que pode ser explorada para <strong>autorização granular</strong> por tipo de operação.</p><p><strong>Command side:</strong> autorização baseada em intenção. Quem pode emitir <code>ApproveOrderCommand</code>? Apenas role <code>MANAGER</code>. Isso é verificado no handler antes de processar o comando. Fácil de auditar — todo command tem um <code>issuedBy: UserId</code> que vai para o evento de domínio.</p><p><strong>Query side:</strong> autorização baseada em dados visíveis. Um cliente só vê seus próprios pedidos; um admin vê todos. O read model pode ter projeções diferentes por role — <code>OrderSummaryView</code> para cliente (sem campos internos), <code>AdminOrderView</code> com dados completos incluindo margens e custos.</p><p>Padrão recomendado:</p><ul><li>Command Handler valida autenticação/autorização antes de aplicar ao aggregate</li><li>Query Handler filtra por tenant/userId automaticamente via middleware de contexto</li><li>Eventos carregam <code>actorId</code> e <code>correlationId</code> — trilha de auditoria completa sem log adicional</li><li>Read models por role (projeções separadas) evitam vazamento de dados sensíveis em campos omitidos por código — o dado simplesmente não está na projeção</li></ul><p>Benefício de auditoria: em Event Sourcing, todo command que gerou um evento tem o ator registrado. Auditoria completa sem tabela de log adicional — o Event Store é o log.</p>',
        tip: 'Conectar CQRS a auditoria e projeções por role é resposta de sênior que pensa em segurança como design, não como afterthought. Diferencial em entrevistas de sistema financeiro.',
      },
      {
        q: 'Quais são os anti-patterns mais comuns em implementações de CQRS?',
        level: 'pleno',
        a: '<p>Top 5 anti-patterns que vejo em código de produção:</p><ol><li><strong>Command que retorna dados ricos.</strong> <code>CreateOrderCommand</code> retorna o Order completo — elimina o benefício de separação. Command retorna <code>void</code> ou só o ID. Cliente faz Query separada se precisar do dado.</li><li><strong>Read model que imita o write model.</strong> Se seu read model é a mesma tabela normalizada com o mesmo schema do write model, você tem duas fontes de verdade sem ganho. Read model deve ser denormalizado pra query específica.</li><li><strong>Projector com regra de negócio.</strong> O projector calcula desconto, valida CPF, aplica regra fiscal — isso é domínio, não projeção. Projector apenas transforma evento em mutação no read model. Sem lógica de negócio.</li><li><strong>Query via Command Bus.</strong> Rotear GET /orders através do Command Bus "por consistência" — viola o princípio fundamental de separação. Query tem seu próprio caminho, mais simples e mais rápido.</li><li><strong>Eventual consistency ignorada no frontend.</strong> Frontend cria um recurso e imediatamente faz GET esperando o dado. Sem optimistic update ou polling, UX quebra. A UI precisa abraçar o modelo de consistência, não fingir que não existe.</li></ol><p>Anti-pattern meta: adotar CQRS como padrão default em TODO o sistema, incluindo CRUD simples. CQRS tem custo — aplicar onde não há benefit é dívida técnica voluntária.</p>',
        tip: 'Listar anti-patterns concretos mostra que você já viu código ruim de CQRS e sabe identificar. Mais valioso que listar benefícios teóricos.',
      },
      {
        q: 'Como você implementa read-your-writes em CQRS com banco separado?',
        level: 'senior',
        a: '<p>Read-your-writes é o requisito: após o usuário criar um recurso, ele deve ver o dado imediatamente na próxima consulta — mesmo com eventual consistency no read model.</p><p><strong>Solução 1 — Versão no command response:</strong> o command handler retorna a versão do aggregate após o commit. O query endpoint aceita parâmetro <code>?minVersion=5</code>. O read model reader verifica se sua projeção alcançou aquela versão antes de responder. Se não, espera até timeout (ex: 2s) com retry interno.</p><p><strong>Solução 2 — Leitura direta do write model para queries de "minha criação":</strong> após o POST, o frontend faz o GET diretamente no write model endpoint (<code>/orders/123/raw</code>) por 1 requisição, depois volta para o read model. Mais simples, custo zero de infra adicional.</p><p><strong>Solução 3 — Optimistic update no frontend (recomendado para UX):</strong> adiciona o recurso no estado local imediatamente com ID temporário. Quando o read model retornar o item real (polling), substitui o temporário. Para o usuário: sem delay percebido.</p><p><strong>Solução 4 — Cabeçalho de versão na resposta:</strong> toda resposta de query inclui <code>X-Read-Model-Version: 47</code>. Frontend armazena e nas próximas queries envia <code>If-None-Match: 47</code>. API retorna 304 se não houve mudança, ou dados frescos se houve.</p><p>Em produção, combino optimistic update (UX) + versão mínima (correctness) para ações críticas.</p>',
        tip: 'Read-your-writes é o problema prático mais frequente reportado por times que adotam CQRS. Ter 3-4 estratégias com trade-offs mostra experiência real de produção.',
      },
      {
        q: 'Como você escalaria o write side independentemente do read side em CQRS?',
        level: 'senior',
        a: '<p>A separação física de write e read em CQRS permite escalar cada lado conforme seu gargalo específico — que são quase sempre diferentes.</p><p><strong>Write side (Command):</strong> gargalo típico é throughput de escrita no banco e validação de invariantes. Estratégias:</p><ul><li><strong>Vertical scaling do write DB:</strong> PostgreSQL com hardware mais potente suporta muito antes de precisar de sharding.</li><li><strong>Sharding por aggregate ID:</strong> <code>orderId % N</code> determina qual shard recebe o aggregate. Cada shard processa seus aggregates sem contenção com outros shards.</li><li><strong>Optimistic concurrency control:</strong> versão no aggregate evita lock pessimista — múltiplos writers concorrem sem bloquear, conflito é detectado no commit.</li><li><strong>Command queue (Kafka):</strong> commands chegam via fila, handlers processam em paralelo. Desacopla throughput de entrada do throughput de processamento.</li></ul><p><strong>Read side (Query):</strong> gargalo típico é volume de leitura e latência de query complexa. Estratégias:</p><ul><li><strong>Réplicas de leitura:</strong> N réplicas Postgres em read-only. Load balancer distribui queries.</li><li><strong>Horizontal scaling do read store:</strong> Redis cluster, Elasticsearch cluster — escalam horizontalmente por design.</li><li><strong>CDN para read models estáticos:</strong> projeções que mudam raramente (catálogo de produtos) podem ser cacheadas na borda.</li></ul><p>Métricas que determinam o scaling: p99 de latência de query, throughput de commands/s, lag do projector. Scale o lado que está no limite — não escala ambos por precaução.</p>',
        tip: 'Mostrar que write e read escalam de forma diferente e com estratégias diferentes é o argumento mais concreto de performance para adotar CQRS. Diferencial em entrevistas de sistemas de alta escala.',
      },
    ],
    exercises: [
      {
        level: 'iniciante',
        title: 'Refatorar CRUD para CQRS simples',
        description: 'Pegue um endpoint GET /products (lista) e POST /products (cria) com um único service. Refatore para ter CreateProductCommand + handler e GetProductsQuery + handler, com CommandBus e QueryBus. O banco pode ser o mesmo inicialmente — o objetivo é sentir a separação de responsabilidade.',
        concepts: ['Command', 'Query', 'CommandBus', 'QueryBus', 'Separação de responsabilidade'],
        hint: 'O Command handler deve retornar apenas o ID do produto criado (ou void). O controller faz GET separado se precisar do dado completo. Isso força o "Command não retorna dado" na prática.',
      },
      {
        level: 'intermediario',
        title: 'Implementar Read Model Denormalizado com Projector',
        description: 'Num sistema de e-commerce: o write side salva Order com Items num Postgres normalizado. Crie um read model "OrderSummaryView" denormalizado em Redis (order_id, customer_name, total, item_count, status). Implemente o projector que consome OrderCreated/OrderStatusChanged e mantém o read model atualizado. Garanta idempotência.',
        concepts: ['Read model', 'Projector', 'Denormalização', 'Idempotência', 'Redis'],
        hint: 'Use um Set Redis de IDs já processados para idempotência, ou grave eventId na própria estrutura do read model. O projector deve ser reexecutável sem corromper o estado.',
        relatedKeypoints: [3, 4],
      },
      {
        level: 'intermediario',
        title: 'Eventual Consistency na UI com Optimistic Update',
        description: 'Implemente um frontend React que cria um produto via Command (POST) e lista via Query (GET). O projector tem 500ms de delay simulado. Implemente optimistic update: ao criar, adiciona o item na lista imediatamente no estado local; se a API retornar erro, remove e exibe mensagem. Implemente também polling: após criar, refaz o GET a cada 300ms por até 3s.',
        concepts: ['Optimistic update', 'Eventual consistency', 'Polling', 'UX de sistemas distribuídos'],
        hint: 'Use um ID temporário (uuid no frontend) para o item otimístico até o GET confirmar o item real. Se o GET retornar o item com o mesmo ID antes de 3s, o polling pode parar.',
      },
      {
        level: 'senior',
        title: 'Reconstrução de Read Model com Snapshot',
        description: 'Implemente Event Sourcing no write side (OrderCreated, OrderPaid, OrderShipped). O projector cria um read model "order_current_status". Adicione: 1) snapshot automático a cada 100 eventos por aggregate, 2) endpoint admin de "rebuild read model" que replay eventos a partir do último snapshot sem derrubar o read model atual, 3) swap atômico do modelo reconstruído com o atual.',
        concepts: ['Event Sourcing', 'Snapshot', 'Replay', 'Zero-downtime rebuild', 'CQRS avançado'],
        hint: 'Faça o rebuild em tabela temporária (order_current_status_new), valide contagem de registros, depois renomeie atomicamente. O modelo atual continua servindo queries durante a reconstrução.',
        relatedKeypoints: [5, 6],
      },
    ],
    codeExamples: [
      {
        title: 'CQRS Completo com NestJS/CQRS — Command, Query, Projector',
        description: 'Implementação end-to-end: CreateOrder command com handler e outbox, GetOrders query com read model, projector com idempotência.',
        language: 'typescript',
        code: `// ============================================================
// WRITE SIDE
// ============================================================

// create-order.command.ts
export class CreateOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly items: Array<{ productId: string; quantity: number; price: number }>,
  ) {}
}

// order.aggregate.ts
export class Order {
  private readonly _events: DomainEvent[] = []

  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly items: OrderItem[],
    public status: 'pending' | 'paid' | 'shipped' | 'cancelled' = 'pending',
  ) {}

  static create(cmd: CreateOrderCommand): Order {
    const order = new Order(uuid(), cmd.customerId, cmd.items)
    // Registra evento de domínio — será persistido via outbox
    order._events.push(new OrderCreatedEvent(order.id, order.customerId, order.total))
    return order
  }

  get total(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  }

  get domainEvents(): DomainEvent[] { return [...this._events] }
}

// create-order.handler.ts
@CommandHandler(CreateOrderCommand)
@Injectable()
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly outboxRepo: OutboxRepository,
    private readonly db: DataSource,
  ) {}

  async execute(cmd: CreateOrderCommand): Promise<string> {
    return this.db.transaction(async (em) => {
      const order = Order.create(cmd)
      await this.orderRepo.save(order, em)

      // Persiste eventos na outbox NA MESMA TRANSAÇÃO
      for (const event of order.domainEvents) {
        await this.outboxRepo.insert({
          eventId: uuid(),
          eventType: event.constructor.name,
          aggregateId: order.id,
          payload: JSON.stringify(event),
        }, em)
      }

      return order.id
    })
  }
}

// ============================================================
// READ SIDE
// ============================================================

// get-orders.query.ts
export class GetOrdersQuery {
  constructor(
    public readonly customerId: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}

// order-summary.view.ts (read model interface)
export interface OrderSummaryView {
  orderId: string
  customerId: string
  status: string
  total: number
  itemCount: number
  createdAt: string
}

// get-orders.handler.ts — lê do read model, zero regra de negócio
@QueryHandler(GetOrdersQuery)
@Injectable()
export class GetOrdersHandler implements IQueryHandler<GetOrdersQuery> {
  constructor(private readonly readRepo: OrderReadRepository) {}

  async execute(query: GetOrdersQuery): Promise<OrderSummaryView[]> {
    return this.readRepo.findByCustomer(query.customerId, {
      page: query.page,
      limit: query.limit,
    })
  }
}

// ============================================================
// PROJECTOR
// ============================================================

// order-summary.projector.ts
@EventsHandler(OrderCreatedEvent)
@Injectable()
export class OrderSummaryProjector implements IEventHandler<OrderCreatedEvent> {
  constructor(
    private readonly readRepo: OrderReadRepository,
    private readonly idempotencyRepo: IdempotencyRepository,
    private readonly db: DataSource,
  ) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    // Idempotência: ignora se já processou este eventId
    const processed = await this.idempotencyRepo.exists(event.eventId)
    if (processed) {
      console.log(\`[projector] Evento \${event.eventId} já projetado, ignorando\`)
      return
    }

    await this.db.transaction(async (em) => {
      await this.readRepo.upsert({
        orderId: event.orderId,
        customerId: event.customerId,
        status: 'pending',
        total: event.total,
        itemCount: event.items.length,
        createdAt: event.occurredOn.toISOString(),
      }, em)

      // Registra que processamos este evento (mesma transação)
      await this.idempotencyRepo.insert(event.eventId, em)
    })
  }
}

// ============================================================
// CONTROLLER
// ============================================================

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(202)  // 202 Accepted — resultado virá via Query, não no response
  async create(@Body() dto: CreateOrderDto): Promise<{ orderId: string }> {
    const orderId = await this.commandBus.execute(
      new CreateOrderCommand(dto.customerId, dto.items)
    )
    return { orderId }  // retorna só o ID — NÃO retorna o objeto completo
  }

  @Get()
  list(@Query() q: ListOrdersDto): Promise<OrderSummaryView[]> {
    return this.queryBus.execute(
      new GetOrdersQuery(q.customerId, q.page)
    )
  }
}`,
      },
      {
        title: 'Event Sourcing — Write Side com Reconstrução de Aggregate',
        description: 'Aggregate que persiste eventos como fonte de verdade e reconstrói estado por replay. Inclui snapshot para reconstituição eficiente.',
        language: 'typescript',
        code: `// event-store.repository.ts
export class EventStoreRepository<T extends AggregateRoot> {
  constructor(private readonly db: DataSource) {}

  async save(aggregate: T): Promise<void> {
    const uncommitted = aggregate.getUncommittedEvents()
    if (uncommitted.length === 0) return

    const currentVersion = aggregate.version
    await this.db.getRepository(StoredEvent).save(
      uncommitted.map((event, i) => ({
        aggregateId: aggregate.id,
        aggregateType: aggregate.constructor.name,
        eventType: event.constructor.name,
        payload: JSON.stringify(event),
        version: currentVersion + i + 1,  // versão otimista para concorrência
        occurredOn: new Date(),
      }))
    )

    aggregate.markEventsAsCommitted()
  }

  async findById(id: string, AggregateClass: new() => T): Promise<T | null> {
    // Verifica se há snapshot recente
    const snapshot = await this.db.getRepository(AggregateSnapshot)
      .findOne({ where: { aggregateId: id }, order: { version: 'DESC' } })

    const fromVersion = snapshot?.version ?? 0
    const storedEvents = await this.db.getRepository(StoredEvent)
      .find({
        where: { aggregateId: id, version: MoreThan(fromVersion) },
        order: { version: 'ASC' },
      })

    if (!snapshot && storedEvents.length === 0) return null

    // Reconstrói aggregate a partir do snapshot + eventos posteriores
    const aggregate = snapshot
      ? AggregateClass.fromSnapshot(JSON.parse(snapshot.state))
      : new AggregateClass()

    for (const stored of storedEvents) {
      const event = this.deserializeEvent(stored.eventType, stored.payload)
      aggregate.apply(event, { fromHistory: true })  // aplica sem registrar como uncommitted
    }

    return aggregate
  }
}

// order.aggregate.ts — com Event Sourcing
export class Order extends AggregateRoot {
  id: string
  customerId: string
  status: OrderStatus = 'pending'
  items: OrderItem[] = []
  version: number = 0

  // Comandos geram eventos
  static create(cmd: CreateOrderCommand): Order {
    const order = new Order()
    order.apply(new OrderCreatedEvent(uuid(), cmd.customerId, cmd.items))
    return order
  }

  pay(paymentId: string): void {
    if (this.status !== 'pending') throw new Error('Pedido não está pendente')
    this.apply(new OrderPaidEvent(this.id, paymentId))
  }

  // Aplica evento ao estado — chamado tanto em novos eventos quanto em replay
  protected onOrderCreated(event: OrderCreatedEvent): void {
    this.id = event.orderId
    this.customerId = event.customerId
    this.items = event.items
    this.status = 'pending'
  }

  protected onOrderPaid(event: OrderPaidEvent): void {
    this.status = 'paid'
  }

  // Snapshot para reconstituição eficiente
  toSnapshot(): Record<string, unknown> {
    return { id: this.id, customerId: this.customerId, status: this.status, items: this.items }
  }

  static fromSnapshot(state: ReturnType<Order['toSnapshot']>): Order {
    const order = new Order()
    Object.assign(order, state)
    return order
  }
}`,
      },
      {
        title: 'Optimistic Update na UI + Read-Your-Writes',
        description: 'Frontend React com CQRS: cria via Command, lista via Query. Optimistic update + polling para lidar com eventual consistency.',
        language: 'typescript',
        code: `// useOrders.ts — hook com optimistic update e polling
import { useState, useCallback, useRef } from 'react'

interface Order {
  orderId: string
  status: string
  total: number
  _optimistic?: boolean  // marcador de item ainda não confirmado
}

export function useOrders(customerId: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  const fetchOrders = useCallback(async () => {
    const res = await fetch(\`/api/orders?customerId=\${customerId}\`)
    return res.json() as Promise<Order[]>
  }, [customerId])

  const createOrder = useCallback(async (items: OrderItem[]) => {
    // 1. Cria item otimístico no estado local
    const tempId = \`temp-\${Date.now()}\`
    const optimisticOrder: Order = {
      orderId: tempId,
      status: 'pending',
      total: items.reduce((s, i) => s + i.price * i.quantity, 0),
      _optimistic: true,
    }
    setOrders(prev => [optimisticOrder, ...prev])

    try {
      // 2. Envia command
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, items }),
      })
      if (!res.ok) throw new Error('Falha ao criar pedido')
      const { orderId } = await res.json()

      // 3. Polling até o read model refletir o novo pedido (eventual consistency)
      let attempts = 0
      const poll = async () => {
        const serverOrders = await fetchOrders()
        const confirmed = serverOrders.find(o => o.orderId === orderId)

        if (confirmed) {
          // Substituí o item otimístico pelo real
          setOrders(serverOrders)
          return
        }

        if (++attempts < 10) {
          pollingRef.current = setTimeout(poll, 300)
        } else {
          // Timeout: mantém o otimístico mas remove marcador
          setOrders(prev => prev.map(o =>
            o.orderId === tempId ? { ...o, orderId, _optimistic: false } : o
          ))
        }
      }
      poll()

    } catch (error) {
      // 4. Reverte o otimístico em falha
      setOrders(prev => prev.filter(o => o.orderId !== tempId))
      throw error
    }
  }, [customerId, fetchOrders])

  return { orders, loading, createOrder }
}

// OrdersPage.tsx
export function OrdersPage() {
  const { orders, createOrder } = useOrders('user-123')

  return (
    <ul>
      {orders.map(order => (
        <li key={order.orderId} style={{ opacity: order._optimistic ? 0.6 : 1 }}>
          {order._optimistic && <span>Processando...</span>}
          Pedido {order.orderId} — {order.status} — R$ {order.total}
        </li>
      ))}
    </ul>
  )
}`,
      },
    ],
    videos: [
      { title: 'CQRS and Event Sourcing — Greg Young (GOTO 2014)', channel: 'GOTO Conferences', url: 'https://www.youtube.com/watch?v=JHGkaShoyNs', topic: 'CQRS e ES fundamentos', note: 'O criador do padrão explicando de primeira mão' },
      { title: 'CQRS — Martin Fowler (bliki walkthrough)', channel: 'InfoQ', url: 'https://www.youtube.com/watch?v=EkEz3pcLdgY', topic: 'Quando usar CQRS', note: 'Foco em quando NÃO usar — perspectiva equilibrada' },
      { title: 'Implementing CQRS with NestJS', channel: 'Marius Espejo', url: 'https://www.youtube.com/watch?v=BnFlpjhFToM', topic: 'Implementação prática', note: 'Código real com @nestjs/cqrs do zero' },
      { title: 'Event Sourcing — você precisa mesmo disso?', channel: 'Hussein Nasser', url: 'https://www.youtube.com/watch?v=qJA6MaQ90YY', topic: 'ES vs CQRS', note: 'Desmistifica a diferença e os custos reais' },
      { title: 'Eventual Consistency — como lidar na prática', channel: 'Arjan Codes', url: 'https://www.youtube.com/watch?v=oII6M8YGqyA', topic: 'UI e eventual consistency', note: 'Estratégias práticas para o frontend' },
    ],
    resources: [
      { title: 'Martin Fowler — CQRS (bliki)', url: 'https://martinfowler.com/bliki/CQRS.html', kind: 'artigo' },
      { title: 'Microsoft — CQRS pattern (Azure Architecture)', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs', kind: 'docs' },
      { title: 'Greg Young — CQRS Documents (PDF original)', url: 'https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf', kind: 'artigo' },
      { title: 'Implementing DDD — Vaughn Vernon (capítulos CQRS)', url: 'https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577', kind: 'livro' },
      { title: 'microservices.io — CQRS pattern', url: 'https://microservices.io/patterns/data/cqrs.html', kind: 'docs' },
      { title: 'microservices.io — Outbox Pattern', url: 'https://microservices.io/patterns/data/transactional-outbox.html', kind: 'docs' },
      { title: '@nestjs/cqrs — documentação oficial', url: 'https://docs.nestjs.com/recipes/cqrs', kind: 'docs' },
      { title: 'Axon Framework (Java CQRS+ES)', url: 'https://docs.axoniq.io/reference-guide/', kind: 'docs' },
      { title: 'EventStoreDB — documentação', url: 'https://developers.eventstore.com/clients/grpc/', kind: 'docs' },
      { title: 'Building Event-Driven Microservices — Adam Bellemare', url: 'https://www.oreilly.com/library/view/building-event-driven-microservices/9781492057888/', kind: 'livro' },
    ],
    mindmap: {
      title: 'Mindmap — CQRS',
      html: `<style>
.cqm-wrap{font-family:system-ui,sans-serif;width:100%;background:#0a0f1e;border-radius:12px;padding:20px;border:1.5px solid #1793D1}
.cqm-center{background:#1793D1;color:#fff;border-radius:10px;padding:12px 20px;text-align:center;font-weight:700;font-size:14px;margin-bottom:16px}
.cqm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.cqm-node{background:#0f172a;border:1px solid #1e3a5f;border-radius:8px;padding:10px 12px}
.cqm-node-title{font-size:11px;font-weight:700;color:#1793D1;margin-bottom:6px;border-bottom:1px solid #1e3a5f;padding-bottom:4px}
.cqm-item{font-size:9.5px;color:#94a3b8;margin-bottom:2px;padding-left:10px;position:relative}
.cqm-item::before{content:"·";position:absolute;left:2px;color:#1793D1}
.cqm-warn{color:#fca5a5}
.cqm-ok{color:#86efac}
.cqm-note{color:#fbbf24}
</style>
<div class="cqm-wrap">
  <div class="cqm-center">CQRS — Command Query Responsibility Segregation</div>
  <div class="cqm-grid">
    <div class="cqm-node">
      <div class="cqm-node-title">Fundamentos</div>
      <div class="cqm-item">CQS (Meyer) → nível arquitetural</div>
      <div class="cqm-item">Command: escreve, não retorna</div>
      <div class="cqm-item">Query: lê, não muta</div>
      <div class="cqm-item">Bancos diferentes (write/read)</div>
      <div class="cqm-item">Eventual consistency</div>
    </div>
    <div class="cqm-node">
      <div class="cqm-node-title">Write Side</div>
      <div class="cqm-item">Command + CommandHandler</div>
      <div class="cqm-item">Aggregate com invariantes</div>
      <div class="cqm-item">Postgres normalizado (ACID)</div>
      <div class="cqm-item">Outbox Pattern</div>
      <div class="cqm-item">Publica Domain Events</div>
    </div>
    <div class="cqm-node">
      <div class="cqm-node-title">Read Side</div>
      <div class="cqm-item">Query + QueryHandler</div>
      <div class="cqm-item">Read model denormalizado</div>
      <div class="cqm-item">ElasticSearch / Redis / View</div>
      <div class="cqm-item">Projector (consome eventos)</div>
      <div class="cqm-item">Idempotência obrigatória</div>
    </div>
    <div class="cqm-node">
      <div class="cqm-node-title">CQRS vs Event Sourcing</div>
      <div class="cqm-item cqm-note">São independentes!</div>
      <div class="cqm-item">CQRS = responsabilidade</div>
      <div class="cqm-item">ES = persistência por eventos</div>
      <div class="cqm-item">Podem existir separados</div>
      <div class="cqm-item cqm-ok">Comece CQRS sem ES</div>
    </div>
    <div class="cqm-node">
      <div class="cqm-node-title">Eventual Consistency (OREO)</div>
      <div class="cqm-item">Optimistic update</div>
      <div class="cqm-item">Read-your-writes</div>
      <div class="cqm-item">Eventually aceite delay</div>
      <div class="cqm-item">Observe via WebSocket</div>
      <div class="cqm-item cqm-warn">Nunca esconda 100%</div>
    </div>
    <div class="cqm-node">
      <div class="cqm-node-title">Quando usar (PIP)</div>
      <div class="cqm-item cqm-ok">Performance assimétrica</div>
      <div class="cqm-item cqm-ok">Independência de escala</div>
      <div class="cqm-item cqm-ok">Projeções múltiplas</div>
      <div class="cqm-item cqm-warn">Auditoria obrigatória</div>
      <div class="cqm-item cqm-warn">Alta leitura/escrita ratio</div>
    </div>
    <div class="cqm-node">
      <div class="cqm-node-title">Quando NÃO usar</div>
      <div class="cqm-item cqm-warn">CRUD simples</div>
      <div class="cqm-item cqm-warn">Modelos não divergem</div>
      <div class="cqm-item cqm-warn">"Só ter DTO diferente"</div>
      <div class="cqm-item cqm-warn">Equipe pequena/júnior</div>
      <div class="cqm-item cqm-ok">View materializada resolve</div>
    </div>
    <div class="cqm-node">
      <div class="cqm-node-title">Reconstrução de Read Model</div>
      <div class="cqm-item">Replay eventos do ES</div>
      <div class="cqm-item">Snapshot periódico</div>
      <div class="cqm-item">Reconstrução paralela</div>
      <div class="cqm-item">Swap atômico</div>
      <div class="cqm-item">DLQ para eventos inválidos</div>
    </div>
    <div class="cqm-node">
      <div class="cqm-node-title">Ferramentas</div>
      <div class="cqm-item">@nestjs/cqrs (Node)</div>
      <div class="cqm-item">Axon Framework (Java)</div>
      <div class="cqm-item">MediatR (.NET)</div>
      <div class="cqm-item">EventStoreDB</div>
      <div class="cqm-item">Debezium (CDC)</div>
    </div>
  </div>
</div>`,
    },
  },

  'circuit-breakers': {
    tagline: 'Parar de chamar dependência quebrada antes que ela leve seu sistema junto.',
    why: 'Resiliencia e tema obrigatório em entrevista senior. Circuit breaker mostra que você pensa em failure mode, cascading failure e como sistema se recupera. Quem nunca implementou ou configurou de verdade tropeca em pergunta básica de half-open.',
    summary: 'Circuit breaker e padrão de resiliencia que monitora chamadas a uma dependência e, quando taxa de erro/latência cruza limiar, abre o circuito — para de chamar e falha rápido (fail-fast). Após timeout, vai pra half-open: deixa passar algumas chamadas pra testar; se passarem, fecha e volta ao normal; se falharem, abre de novo. Evita cascading failure (cliente travado em timeout puxa todos os threads, sistema todo cai). Padrão crítico em sistemas distribuidos com dependência externa.',
    keypoints: [
      { title: 'Tres estados', body: 'Closed (chamadas passam, monitora falhas), Open (rejeita imediatamente, falha rápido), Half-open (passa N chamadas de teste, decide se fecha ou abre de novo).' },
      { title: 'Cascading failure', body: 'Sem breaker, dependência lenta amarra threads do cliente. Pool esgota. Cliente fica unresponsive. Outros serviços chamando ele também caem. Cascata. Breaker corta no inicio.' },
      { title: 'Limiares de abertura', body: 'Por taxa de erro (ex: 50% em janela de 1min), por contagem absoluta, por latência P99. Janela deslizante e melhor que contador simples — evita reabrir/fechar oscilando.' },
      { title: 'Timeout no half-open', body: 'Tempo de espera antes de tentar half-open define velocidade de recuperação. Curto demais = oscilacao. Longo demais = degradação prolongada. Tipico: 30s-2min com backoff exponencial.' },
      { title: 'Fallback', body: 'Quando breaker abre, o que você devolve? Cache stale, default, mensagem amigável, queue pra processar depois. Sem fallback, breaker só adianta o erro — não melhora UX.' },
      { title: 'Bulkhead pattern', body: 'Complementa breaker: pools de thread/conexão isolados por dependência. Falha em serviço A não consome thread de chamada pra serviço B. Hystrix populizou esse combo.' },
      { title: 'Bibliotecas', body: 'Resilience4j (Java/Kotlin), Polly (.NET), opossum (Node), gobreaker (Go). Service mesh (Istio, Linkerd) faz no nível de proxy sem mudar código.' },
    ],
    gotchas: [
      'Breaker sem fallback útil — usuário ainda vê erro, você só falhou mais rápido. Defina experiência degradada.',
      'Limiar muito sensível — 1 falha abre o circuito, sistema fica oscilando. Use janela deslizante com volume mínimo.',
      'Esquecer timeout da chamada subjacente — se request HTTP não tem timeout, breaker nunca conta como falha porque request fica pendurado pra sempre.',
      'Aplicar breaker em chamada local (DB pool, cache local) — não e o caso de uso. Breaker e pra dependência remota com risco de ficar lenta/cair.',
      'Estado do breaker em memória local em serviço com 100 instâncias — cada uma decide separadamente. Pra decisão global, breaker no service mesh ou centralizado.',
    ],
    interview: [
      { q: 'Como você desenha um circuit breaker do zero?', a: '<p>Tres estados: <code>CLOSED</code>, <code>OPEN</code>, <code>HALF_OPEN</code>. Em CLOSED, mantenho contador de sucesso/falha em <strong>janela deslizante</strong> (ex: 60s) com volume mínimo (ex: 20 calls) pra evitar abrir com pouco dado.</p><p>Quando taxa de falha > limiar (ex: 50%), vai pra OPEN. Em OPEN, rejeita rápido por <code>resetTimeout</code> (ex: 30s). Após isso, HALF_OPEN libera N calls de teste; se passar, CLOSED; se falhar, OPEN de novo com backoff.</p><p>Adiciono <strong>fallback</strong>: cache stale, default, queue. E observability: metric por estado, alerta quando abre.</p>' },
      { q: 'Tradeoff: circuit breaker vs retry?', a: '<p>São <strong>complementares</strong>, não alternativos. Retry resolve falha transiente (network blip, deploy momentaneo). Breaker resolve falha sustentada (serviço fora do ar).</p><p>Retry sem breaker e perigoso: dependência lenta + retry = amplifica carga, agrava o problema (retry storm). Padrão seguro: <strong>retry com backoff exponencial + jitter</strong>, dentro de um breaker. Breaker abre, para de tentar retry pra sempre.</p>' },
      { q: 'Quando NÃO usar circuit breaker?', a: '<p>Em chamadas <strong>locais e rápidas</strong> (cache em memória, computação pura) — overhead não vale. Em fluxo <strong>fire-and-forget</strong> via fila, fila já absorve falha — breaker não agrega.</p><p>Em <strong>fluxo crítico sem fallback aceitável</strong> (ex: autorização de pagamento), abrir circuito pode ser pior que esperar — preciso escalar capacidade ou redundar dependência, não só falhar rápido.</p>' },
      { q: 'Como o breaker se comporta quando você tem 100 instâncias do mesmo serviço?', a: '<p>Cada instância tem estado próprio em memória. Algumas podem estar OPEN, outras CLOSED, dependendo do que cada uma viu. Isso e <strong>aceitavel</strong> — comportamento converge porque todas veem a mesma dependência ruim.</p><p>Pra decisão global (ex: tirar dependência inteira do mapa), uso <strong>service mesh</strong> (Istio, Linkerd) que decide no proxy, ou registry central. Mas centralizar adiciona ponto de falha — análise tradeoff antes.</p>' },
      { q: 'Como você testa um circuit breaker em produção?', a: '<p>Chaos engineering: injeto latência/erro na dependência (toxiproxy, fault injection no service mesh) e observo se breaker abre, se fallback funciona, se sistema mantem disponibilidade. Sem teste, você só sabe se funciona quando incidente real acontece.</p><p>Em CI: teste de integração com mock que retorna erro/timeout e assert no estado do breaker. <strong>Game day</strong> trimestral pra simular falha de dependência crítica.</p>' },
    ],
    resources: [
      { title: 'Release It! (Michael Nygard)', url: 'https://pragprog.com/titles/mnee2/release-it-second-edition/', kind: 'livro' },
      { title: 'Martin Fowler — CircuitBreaker', url: 'https://martinfowler.com/bliki/CircuitBreaker.html', kind: 'artigo' },
      { title: 'Resilience4j docs', url: 'https://resilience4j.readme.io/docs/circuitbreaker', kind: 'docs' },
      { title: 'Hystrix wiki (legado mas didatico)', url: 'https://github.com/Netflix/Hystrix/wiki', kind: 'docs' },
      { title: 'AWS — Implementing Circuit Breaker', url: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/', kind: 'artigo' },
    ],
    diagram: 'circuit-breaker'
  },

  'rate-limiting': {
    tagline: 'Limitar taxa de requests pra proteger sistema, fairness e custo de downstream.',
    why: 'Rate limiting cai em entrevista de API design e segurança. Senior precisa explicar algoritmos (token bucket, leaky bucket, sliding window), onde aplicar (gateway, app, DB) e o tradeoff entre precisão e simplicidade.',
    summary: 'Rate limiting controla quantas operações um cliente/usuário pode fazer numa janela. Protege contra abuso, DDoS, bug em loop, e custo descontrolado de downstream pago por chamada (LLM, SMS, geocoder). Algoritmos comuns: token bucket (permite burst), leaky bucket (taxa constante), fixed window (simples mas tem efeito de borda), sliding window (preciso, mais caro). Em sistema distribuido, contador centralizado em Redis e padrão. Resposta tipica: HTTP 429 com header Retry-After.',
    keypoints: [
      { title: 'Token Bucket', body: 'Bucket com N tokens, request consome 1, refill a taxa fixa. Permite burst até o tamanho do bucket. Algoritmo mais comum em API pública (GitHub, Stripe, AWS).' },
      { title: 'Leaky Bucket', body: 'Fila com vazao constante. Suaviza trafego. Bom pra proteger downstream que não tolera spike. Diferente do token bucket: não permite burst.' },
      { title: 'Fixed Window', body: 'Conta requests em janelas fixas (ex: 100/min, reset a cada minuto cheio). Simples, mas tem <strong>efeito de borda</strong>: 200 requests no segundo 59 + 200 no segundo 61 passa pelo limite real.' },
      { title: 'Sliding Window', body: 'Janela deslizante por timestamp. Preciso, sem efeito de borda. Custo: armazenar timestamps ou usar log + contador (sliding window log/counter). Redis com sorted set resolve.' },
      { title: 'Onde aplicar', body: 'API Gateway (CloudFront, Kong, Envoy) pega antes do app — protege todo o stack. Por usuário/IP/API key, com regras diferentes por endpoint. Também dentro do app pra limites de negocio.' },
      { title: 'Distributed limiting', body: 'Em serviço com N instâncias, contador local não funciona. Usa Redis com INCR + EXPIRE, ou Lua script atômico. Tradeoff: latência de rede + ponto de dependência.' },
      { title: 'Resposta padrão', body: 'HTTP 429 Too Many Requests com header <code>Retry-After</code> e <code>X-RateLimit-Remaining</code>. Cliente bem comportado respeita; bot ignora. Sempre logue pra detectar abuso.' },
    ],
    gotchas: [
      'Limitar só por IP — NAT corporativo manda 1000 usuários pelo mesmo IP, você bloqueia geral. Combine com user/api key.',
      'Fixed window com borda — trivial pra atacante explorar. Sliding window vale a pena em endpoint sensível.',
      'Limit muito apertado em endpoint legitimo — quebra cliente bom. Monitore taxa de 429 e ajuste.',
      'Esquecer de limitar endpoint caro (export, search full-text) — atacante derruba sistema com poucos requests.',
      'Limit em memória local com auto-scaling — capacidade real e N x limite. Use Redis pra centralizar.',
      'Não retornar Retry-After — cliente bem feito retry imediato e amplifica problema.',
    ],
    interview: [
      { q: 'Tradeoff: token bucket vs sliding window?', a: '<p><strong>Token bucket</strong>: simples, eficiente, permite burst controlado. Ótimo pra API pública onde burst pontual e ok. Estado: 2 números (tokens, last refill).</p><p><strong>Sliding window</strong>: mais preciso, sem efeito de borda, ideal pra proteção rigorosa (login attempts, payment). Custo: armazena timestamps ou usa contador composto. Mais caro em memória/CPU.</p><p>Padrão que sigo: token bucket pra API geral, sliding window pra endpoint crítico (login, write financeiro).</p>' },
      { q: 'Como você implementaria rate limit distribuido?', a: '<p>Redis com Lua script atômico. Chave por <code>user:endpoint</code>, valor com tokens + timestamp. Lua garante atomicidade do check+decrement sem race condition. TTL na chave evita memória infinita.</p><p>Pra escala alta: shard de Redis por user id, ou rate limiter dedicado (Envoy ratelimit service). Em latência ultra baixa, fallback local com sync periódico ao Redis (perde precisão mas tolera Redis fora).</p>' },
      { q: 'Onde você aplica rate limit no stack?', a: '<p>Em camadas:</p><ul><li><strong>Edge/CDN</strong>: bloqueia DDoS volumetrico antes de bater no app</li><li><strong>API Gateway</strong>: limite por API key/usuário, configurável sem deploy</li><li><strong>App</strong>: limites de negócio (ex: max 10 transferencias/h)</li><li><strong>Downstream protection</strong>: no client de serviço interno, pra não DDoSar dependência</li></ul><p>Camadas múltiplas custam pouco e somam proteção. Senior não confia em uma camada só.</p>' },
      { q: 'Quando NÃO usar rate limit?', a: '<p>Em endpoint <strong>interno trusted</strong> com volume previsivel — adiciona latência e ponto de falha sem ganho. Em fila já com backpressure (consumidor controla taxa) — fila já resolve.</p><p>Também evito em <strong>MVP</strong> sem trafego — over-engineering. Começo com WAF básico no edge e adiciono limite quando ve abuso real ou custo de downstream subindo.</p>' },
      { q: 'Como diferenciar rate limit por usuário, IP e API key?', a: '<p>Camadas com proposito diferente:</p><ul><li><strong>IP</strong>: protege contra ataque automatizado anonimo. Falso positivo em NAT/VPN.</li><li><strong>User</strong>: fairness e abuso de conta. Precisa de auth.</li><li><strong>API key</strong>: monetizacao e tier (free/pro). Limite por plano.</li></ul><p>Aplica os tres simultaneamente com limites diferentes. Endpoint de login limita por IP+username pra impedir credential stuffing. Endpoint de search limita por user.</p>' },
    ],
    resources: [
      { title: 'System Design Primer — Rate Limiter', url: 'https://github.com/donnemartin/system-design-primer#rate-limiter', kind: 'docs' },
      { title: 'Stripe — Designing rate limiters', url: 'https://stripe.com/blog/rate-limiters', kind: 'artigo' },
      { title: 'Cloudflare — How we built rate limiting', url: 'https://blog.cloudflare.com/counting-things-a-lot-of-different-things/', kind: 'artigo' },
      { title: 'AWS Builders Library — Throttling', url: 'https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/', kind: 'artigo' },
      { title: 'Hussein Nasser — Rate Limiting', url: 'https://www.youtube.com/watch?v=mhUQe4BKZXs', kind: 'video' },
    ],
  },

  'tradeoff-analysis': {
    tagline: 'Justificar decisão técnica nomeando o que você ganha e o que está sacrificando.',
    why: 'O que diferencia senior de pleno em entrevista não e saber tecnologia, e saber DECIDIR. Tradeoff analysis e a habilidade meta. Entrevistador testa: você defende decisão com número/contexto ou repete blog post?',
    summary: 'Tradeoff analysis e o exercício sistematico de comparar opcoes nomeando dimensões (custo, latência, complexidade, time-to-market, manutenção, risco) e contextualizando ao caso. Não existe "melhor" absoluto — existe melhor pro contexto. Senior nomeia o que está sacrificando, quantifica quando possível, e revisita decisão quando contexto muda. Frameworks úteis: ADR (Architecture Decision Record), CAP, "the hard parts", custo de mudança vs custo de erro.',
    keypoints: [
      { title: 'Dimensoes básicas', body: 'Custo (dinheiro + dev time), latência, throughput, disponibilidade, consistencia, complexidade operacional, segurança, observabilidade, time-to-market, fit com time atual, fit com stack existente.' },
      { title: 'Reversibilidade', body: 'Decisão reversivel (escolha de framework de teste) merece pouco debate. Decisão irreversivel ou cara de mudar (banco, cloud provider, linguagem core) merece muito debate. Bezos: "two-way doors vs one-way doors".' },
      { title: 'Custo total de propriedade', body: 'Solução "gratis" pode ter alto custo operacional. Solução paga pode liberar time pra entregar valor. Some salario, on-call, suporte, oportunidade perdida.' },
      { title: 'Quantificar', body: 'Número ganha de opiniao. "Postgres aguenta 50K writes/s, esperamos 5K, sobra 10x" e mais forte que "Postgres aguenta". Estima antes de decidir.' },
      { title: 'ADR', body: 'Architecture Decision Record: documenta contexto, decisão, alternativas consideradas, consequencias. Permite revisitar quando contexto muda. Padrão em time senior.' },
      { title: 'Fallback escolhas', body: 'Toda decisão deve ter "como saio dela?". Lock-in em vendor sem plano de saida e armadilha. Mesmo que nunca execute, pensar na saida revela acoplamento oculto.' },
      { title: 'Falacias comuns', body: 'Cargo cult ("Netflix usa então usamos"), shiny new tech, sunk cost ("já investimos muito"), early optimization, over-engineering pra escala que não tem.' },
    ],
    gotchas: [
      'Decidir por preferência pessoal disfarcada de técnica — "prefiro Mongo" sem justificativa contextual.',
      'Comparar opcao em estado ideal vs estado real do que você já tem — sempre o novo brilha mais. Avalie no mesmo nível de maturidade.',
      'Esquecer fator humano — time conhece Java mas você escolhe Go porque e "melhor" — vai pagar 6 meses de curva.',
      'Análise paralisia — debate eterno por decisão reversivel barata. Decida e siga, ajuste depois.',
      'Não documentar — 6 meses depois ninguem lembra por que escolheu X, e o contexto que justificava mudou.',
    ],
    interview: [
      { q: 'Como você estrutura uma análise de tradeoff em entrevista?', a: '<p>Frame em <strong>3 passos</strong>: (1) clarifico o contexto e o que e crítico (latência? custo? time-to-market?); (2) listo opcoes plausiveis com pros/contras nas dimensões que importam; (3) escolho com justificativa explícita do que estou sacrificando.</p><p>Exemplo: <em>"Vou de Postgres em vez de Dynamo aqui porque temos JOIN frequente e o volume cabe até uns 5TB. Sacrifico escala horizontal fácil — quando passar dos 2TB, revisito particionamento ou migração."</em></p><p>Entrevistador adora ver que você <strong>nomeia o sacrificio</strong>, não finge que tem solução perfeita.</p>' },
      { q: 'Conta uma decisão que você tomou e revisitou depois.', a: '<p>Comecei um projeto com Mongo achando que schema ia variar muito. 1 ano depois, schema estabilizou e a falta de transação multi-doc virou dor real (relatório inconsistente, dificuldade de reportar pra contabilidade).</p><p>Migrei pra Postgres usando dual-write + backfill, custou 3 meses. <strong>Licao</strong>: o tradeoff que parecia estável mudou (schema estabilizou, requisito de relatório surgiu). ADR original ajudou a reconstituir o contexto e justificar migração pro time novo. Hoje, default e Postgres até prova em contrario.</p>' },
      { q: 'Como você decide entre build vs buy?', a: '<p>Comparo: custo total de build (dev + manutenção + on-call por 3+ anos), custo de licenca/saas, time-to-market, fit estrategico (e core do negocio?), risco de lock-in.</p><p>Heurística: se não e <strong>core competitive advantage</strong>, compra. Time deve gastar energia onde diferencia produto. Build de auth, billing, monitoring quase sempre da prejuizo. Build de algo que e o produto (search engine, no Google) faz sentido.</p>' },
      { q: 'Quando a decisão "errada" e aceitavel?', a: '<p>Quando o custo de acertar agora e maior que o custo de mudar depois. Em MVP, escolho stack que <strong>time conhece</strong> mesmo que não seja "ideal" — entrega rápida importa mais que arquitetura perfeita.</p><p>Em decisão reversivel, prefiro "good enough now" a "perfect later". Decisão irreversivel (banco, schema core, cloud provider) merece mais cuidado upfront porque mudar e caro.</p>' },
      { q: 'Como você convence um time que prefere outra tecnologia?', a: '<p>Não tento "ganhar" — busco <strong>alinhar critérios</strong>. Pergunto o que e crítico (latência? familiaridade? custo?), proponho POC pequeno comparando sob esses critérios, deixo número falar.</p><p>Se mesmo assim divergem, ADR registra a decisão com alternativas e razoes. As vezes você perde a discussão e e melhor assim — diversidade de opiniao captura blind spots. O importante e <strong>decisão informada</strong>, não "minha proposta venceu".</p>' },
    ],
    resources: [
      { title: 'Software Architecture: The Hard Parts', url: 'https://www.oreilly.com/library/view/software-architecture-the/9781492086888/', kind: 'livro' },
      { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/', kind: 'livro' },
      { title: 'ADR (Architecture Decision Records)', url: 'https://adr.github.io/', kind: 'docs' },
      { title: 'Martin Fowler — Architecture', url: 'https://martinfowler.com/architecture/', kind: 'artigo' },
      { title: 'Thoughtworks Tech Radar', url: 'https://www.thoughtworks.com/radar', kind: 'artigo' },
    ],
  },

  'event-driven': {
    tagline: 'Sistemas comunicando via eventos pra desacoplar produtor e consumidor.',
    why: 'Event-driven architecture é tema chave em entrevista senior backend. Saber diferenciar evento de comando, escolher entre Kafka/SQS/EventBridge e explicar idempotência separa quem já sentiu a dor de quem só leu sobre.',
    summary: 'Event-driven architecture (EDA) tem produtores publicando eventos (algo aconteceu: OrderPlaced, UserSignedUp) e consumidores reagindo. Desacopla serviços no tempo e no espaco — produtor não sabe quem consome. Habilita escala, evolucao independente, audit trail. Custo: complexidade operacional (idempotencia, ordering, schema evolution, debugging distribuido). Tres sabores: simple pub/sub (notificacao), event streaming (Kafka, replay), event sourcing (eventos como source of truth).',
    keypoints: [
      { title: 'Evento vs Comando', body: 'Evento = "aconteceu", passado, broadcast, múltiplos consumidores. Comando = "faz isso", futuro, dirigido, um destinatario. Misturar gera acoplamento ruim. Naming: OrderPlaced (evento) vs PlaceOrder (comando).' },
      { title: 'At-least-once', body: 'Padrão em fila/Kafka. Mensagem pode chegar mais de uma vez. Consumer DEVE ser idempotente — chave de idempotencia ou estado check antes de processar. Ignorar isso = duplicata em produção.' },
      { title: 'Ordem', body: 'Kafka garante ordem dentro de uma partição (chave). SQS standard não garante; FIFO sim mas tem throughput limitado. Senior define chave de partição com cuidado pra balancear ordem e paralelismo.' },
      { title: 'Outbox pattern', body: 'Pra publicar evento na mesma transação do write: grava evento numa tabela outbox, relay le e pública. Garante at-least-once sem 2PC. Padrão em serviços serios.' },
      { title: 'Schema evolution', body: 'Evento dura mais que código. Use schema registry (Avro, Protobuf) com regras de compatibilidade (backward, forward). Evite breaking — adicione campo, nunca renomeie/remova sem deprecacao longa.' },
      { title: 'Choreography vs Orchestration', body: 'Choreography: serviços reagem a eventos sem coordenador. Simples, fluxo emerge. Orchestration: um serviço controla a sequência. Mais claro mas vira ponto central. Saga complexa geralmente exige orchestration.' },
      { title: 'Dead Letter Queue', body: 'Mensagens que falharam N vezes vão pra DLQ. Permite análise sem bloquear pipeline. Sem DLQ, mensagem ruim trava consumer para sempre.' },
    ],
    gotchas: [
      'Consumer não idempotente — duplicata gera dado em duplicata, cobranca dupla, email duplicado. Sempre projete com chave de idempotencia.',
      'Evento como comando disfarcado — "UserShouldBeNotified" e comando, não evento. Naming reflete acoplamento.',
      'Esquecer DLQ + alarme — mensagem ruim some silenciosamente, você descobre o bug 2 semanas depois.',
      'Schema breaking change sem coordenacao — produtor pública novo formato, consumer antigo quebra. Use compatibilidade backward.',
      'Eventos gigantes (mega-event) com tudo dentro — vira contrato implícito, difícil evoluir. Prefira eventos pequenos focados.',
      'Debug em event chain longa = pesadelo sem tracing distribuido. Adicione correlation id + tracing desde dia 1.',
    ],
    interview: [
      { q: 'Tradeoff: Kafka vs SQS vs EventBridge?', a: '<p><strong>Kafka</strong>: alto throughput, retention longa, replay, ordering por partição. Custo: operação pesada (ZK/KRaft, brokers, cluster). Pra event streaming serio.</p><p><strong>SQS</strong>: managed, simples, pay-per-use, sem retention longa, sem replay. Standard ou FIFO. Pra task queue / desacoplamento simples.</p><p><strong>EventBridge</strong>: AWS-native, routing por regra, integração SaaS, baixo throughput. Pra integração entre serviços AWS e SaaS.</p><p>Regra: precisa replay e analytics? Kafka. Task queue simples? SQS. Routing AWS? EventBridge. Comecar com SQS/EventBridge e migrar pra Kafka quando tem caso real.</p>' },
      { q: 'Como você garante exactly-once em sistema event-driven?', a: '<p>Spoiler: <strong>exactly-once não existe</strong> end-to-end em geral. O que da pra ter e <strong>at-least-once + idempotencia</strong> = efeito exactly-once.</p><p>Técnicas: chave de idempotencia (request-id) armazenada com TTL, check antes de processar. Para writes, transação com unique constraint na chave. Em Kafka especificamente, <code>enable.idempotence=true</code> garante producer-side; consumer ainda precisa de idempotencia lógica.</p>' },
      { q: 'Quando NÃO usar event-driven?', a: '<p>Em fluxo <strong>síncrono interativo</strong> (UI esperando resposta) — async via evento adiciona latência e complexidade pra zero ganho. REST direto ganha.</p><p>Em sistema <strong>simples com poucos serviços</strong> sem necessidade de desacoplamento. Eventos virariam premature optimization. Custo de Kafka/observability supera ganho.</p><p>Também evito quando time não tem maturidade em idempotencia, ordering, schema evolution — vai virar bug em produção.</p>' },
      { q: 'Como você desenha um pipeline de evento confiável?', a: '<p>Producer: outbox pattern pra garantir consistencia entre write e publish. Schema registry. Correlation id em todo evento.</p><p>Broker: Kafka com replicação e retention adequada, ou SQS com DLQ.</p><p>Consumer: idempotencia (chave + tabela ou store), at-least-once aceito, retry com backoff, DLQ após N falhas, observability (lag, throughput, error rate).</p><p>Schema evolution backward-compatible. Tracing distribuido. Alarme em DLQ e em consumer lag.</p>' },
      { q: 'Choreography ou Orchestration pra saga?', a: '<p><strong>Choreography</strong>: cada serviço reage a evento e pública próximo. Simples, baixo acoplamento. Risco: <strong>fluxo invisivel</strong>, difícil entender o todo e debugar quando trava no meio.</p><p><strong>Orchestration</strong>: um orquestrador (Step Functions, Temporal, Camunda) controla a sequência. Visivel, debugavel, suporta compensacao explícita. Custo: ponto central, acoplamento ao orquestrador.</p><p>Regra: saga curta (2-3 passos)? Choreography. Saga longa com decisão complexa? Orchestration. Honestidade: 80% dos times faz melhor com orchestration depois que sente a dor de debugar choreography.</p>' },
    ],
    resources: [
      { title: 'Designing Event-Driven Systems (Stopford)', url: 'https://www.confluent.io/designing-event-driven-systems/', kind: 'livro' },
      { title: 'Martin Fowler — Event-Driven', url: 'https://martinfowler.com/articles/201701-event-driven.html', kind: 'artigo' },
      { title: 'Enterprise Integration Patterns', url: 'https://www.enterpriseintegrationpatterns.com/', kind: 'docs' },
      { title: 'Confluent — Kafka Tutorials', url: 'https://kafka-tutorials.confluent.io/', kind: 'curso' },
      { title: 'microservices.io — Event-Driven', url: 'https://microservices.io/patterns/data/event-driven-architecture.html', kind: 'docs' },
    ],
  },

  'design-patterns': {
    tagline: 'Soluções recorrentes pra problemas de design — vocabulario comum entre devs.',
    why: 'Design patterns aparecem em entrevista de código e arquitetura. Senior precisa saber QUANDO usar (raro) e quando o pattern vira overkill ou anti-pattern. Decorar GoF não basta — entrevistador testa aplicação em problema real.',
    summary: 'Design patterns (Gang of Four e descendentes) são soluções reusaveis pra problemas comuns de design OO. Tres categorias: criacionais (Factory, Singleton, Builder), estruturais (Adapter, Decorator, Facade, Proxy), comportamentais (Strategy, Observer, Command, State). Útil como vocabulario de design — falar "Strategy" comunica em uma palavra. Risco: aplicar pattern por aplicar, complica código simples. Aplicar bem reduz complexidade; aplicar mal aumenta.',
    keypoints: [
      { title: 'Strategy', body: 'Define familia de algoritmos intercambiaveis. Use quando ha múltiplas formas de fazer a mesma coisa (calcular frete, validar pagamento). Evita if/switch gigante.' },
      { title: 'Factory / Abstract Factory', body: 'Encapsula criação de objetos. Útil quando criação e complexa, depende de configuração, ou precisa abstrair tipo concreto. Em DI moderno, container resolve maior parte do caso.' },
      { title: 'Decorator', body: 'Adiciona comportamento sem modificar a classe (logging, caching, retry em handler HTTP). Combina via composição. Express middleware e exemplo clássico.' },
      { title: 'Observer / Pub-Sub', body: 'Objeto notifica observadores em mudança. Base de event-driven, UI reativa, hooks. Cuidado com leak (esquecer de remover observer).' },
      { title: 'Adapter', body: 'Traduz interface entre dois sistemas. Útil pra integrar lib legada, API externa, biblioteca com interface diferente da que você quer. Em DDD, e o anti-corruption layer.' },
      { title: 'Singleton', body: 'Uma instância global. Famoso anti-pattern em código testável — esconde dependência, dificulta mock. DI container substitui melhor. Use só pra recurso realmente único (logger, config).' },
      { title: 'Repository', body: 'Abstrai persistência, expoe coleção de aggregates. Permite trocar storage e testar com mock. Padrão em DDD e Clean Architecture.' },
    ],
    gotchas: [
      'Aplicar pattern por aplicar — Factory pra criar objeto trivial, Strategy com uma só estratégia, Observer pra um listener só. Indireção sem ganho.',
      'Singleton em todo lugar — vira global state escondido, dificulta teste, gera bug em concorrência.',
      'Confundir pattern com framework — Repository e padrão, não precisa de generic class enorme.',
      'Combinar 5 patterns numa classe pra parecer "limpo" — Factory que retorna Builder que cria Strategy via Adapter. Codigo vira labirinto.',
      'Ignorar idiomas da linguagem — em JS funcional, closures resolvem sem precisar Strategy formal. Em Go, interface implícita simplifica muito.',
    ],
    interview: [
      { q: 'Quando você escolhe Strategy vs simples if/else?', a: '<p>Uso <strong>if/else</strong> quando: ramos são 2-3, raramente mudam, e não tem comportamento complexo em cada um. Código simples ganha.</p><p>Vou pra <strong>Strategy</strong> quando: há vários algoritmos (5+), eles são adicionados/trocados frequentemente, ou cada um tem complexidade significativa (e merece arquivo próprio). Strategy permite OCP — adicionar novo algoritmo sem mexer nos existentes.</p><p>Red flag: criar Strategy com uma só implementação "antecipando o futuro" é overkill especulativo.</p>' },
      { q: 'Singleton e anti-pattern?', a: '<p>Quase sempre, em código de aplicação. Esconde dependência (a classe usa, mas não declara), dificulta teste (mock e difícil), causa bug em concorrência, vira global state mascarado.</p><p>DI container faz o trabalho melhor: cria uma instância, injeta onde precisa, mantem testavel. <strong>Excecoes legitimas</strong>: logger global, config readonly carregado uma vez. Mesmo nesses casos, abstracao + injecao em vez de Singleton clássico e mais limpo.</p>' },
      { q: 'Como Decorator se compara a herança?', a: '<p><strong>Herança</strong> adiciona comportamento estaticamente em compile-time. Rigida, gera explosao de subclasses se você quer combinar features (LoggingAndCachingAndRetryingHandler).</p><p><strong>Decorator</strong> adiciona em runtime via composição. Combina livremente: <code>logging(caching(retry(handler)))</code>. Cada decorator tem responsabilidade única (SRP) e você pluga conforme precisa.</p><p>HTTP middleware (Express, Koa, Nest interceptor) e Decorator pattern aplicado.</p>' },
      { q: 'Tradeoff: Repository pattern vs ORM direto?', a: '<p><strong>ORM direto</strong> (Prisma, TypeORM no service): rápido, menos código, ótimo pra CRUD simples. Custo: regra de query espalha, troca de ORM e dolorosa, mock de teste e complicado.</p><p><strong>Repository pattern</strong>: abstrai persistência, domínio não depende de ORM, teste mocka fácil. Custo: boilerplate, risco de virar DAO disfarcado com 50 métodos custom.</p><p>Em CRUD simples, ORM direto. Em domínio rico (DDD), Repository encapsula bem o aggregate. Misturar nas camadas certas e o equilibrio.</p>' },
      { q: 'Que pattern você considera overrated?', a: '<p><strong>Singleton</strong> (anti-pattern em maior parte dos casos) e <strong>Visitor</strong> (raramente legivel, geralmente substituido melhor por pattern matching ou polimorfismo simples).</p><p>Também desconfio de <strong>uso excessivo de Factory</strong> em projeto Node/TS moderno — DI container e closure resolvem sem cerimonia. Pattern e ferramenta — usar com moderacao e contexto.</p>' },
    ],
    resources: [
      { title: 'Design Patterns (GoF — Gamma et al.)', url: 'https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612', kind: 'livro' },
      { title: 'Refactoring Guru — Patterns', url: 'https://refactoring.guru/design-patterns', kind: 'docs' },
      { title: 'Patterns of Enterprise Application Architecture (Fowler)', url: 'https://martinfowler.com/eaaCatalog/', kind: 'livro' },
      { title: 'Head First Design Patterns', url: 'https://www.oreilly.com/library/view/head-first-design/9781492077992/', kind: 'livro' },
      { title: 'Sourcemaking — Design Patterns', url: 'https://sourcemaking.com/design_patterns', kind: 'docs' },
    ],
  },

  'dependency-injection': {
    tagline: 'Injetar dependência em vez de instanciar — habilita teste, troca e desacoplamento.',
    why: 'DI e básico em vaga senior. Entrevistador testa se você entende o ponto (inversao de controle, testabilidade) ou se decorou framework (Nest, Spring). Aplicar mal vira XML hell ou container magico que ninguem entende.',
    summary: 'Dependency Injection e técnica onde dependências são injetadas (via construtor, setter, ou framework) em vez de instanciadas dentro da classe. Implementa o princípio de Inversao de Controle (IoC). Beneficio: teste isolado com mock, troca de impl sem mexer no consumidor, configuração centralizada. Tres formas: constructor (preferida), setter, interface. Container de DI (Spring, Nest, InversifyJS) automatiza wiring em projetos grandes. Pequeno demais, manual já resolve.',
    keypoints: [
      { title: 'IoC vs DI', body: 'IoC e o princípio: o controle de criação/wiring sai da classe e vai pra fora. DI e a técnica específica: passar dependência. Outras formas de IoC: service locator, callbacks, plugins.' },
      { title: 'Constructor injection', body: 'Forma preferida. Dependências declaradas no construtor, classe nunca está sem elas, fica óbvio o que ela precisa. Imutabilidade ajuda concorrência.' },
      { title: 'Setter / Property injection', body: 'Útil quando dependência e opcional ou tem ciclo. Risco: classe pode ser usada antes de receber a dep — NPE em runtime. Use com moderacao.' },
      { title: 'DI Container', body: 'Framework que cria instâncias e resolve dependências automático (Spring, Nest, Inversify, Dagger). Útil em projeto grande. Pequeno demais, container vira complexidade injustificada.' },
      { title: 'Lifecycle / Scope', body: 'Singleton (uma instância), transient (nova a cada injecao), request-scoped (uma por request HTTP). Errar scope vira bug: state compartilhado entre requests.' },
      { title: 'Circular dependency', body: 'A precisa de B e B precisa de A — geralmente sinal de design ruim. Quebrar via interface intermediária, evento, ou repensar fronteira.' },
      { title: 'DI sem framework', body: 'Em projeto pequeno/medio, da pra fazer DI manual: composition root no main, instância tudo, passa pra baixo. Sem magica, sem reflection. Funciona até uns 50-100 classes.' },
    ],
    gotchas: [
      'Container magico sem entender — anotação + reflection + lifecycle vira caixa preta. Quando bug aparece, ninguem sabe debugar.',
      'Service Locator disfarcado — injetar container e pedir <code>container.get("X")</code> dentro. Esconde dependência, perde o ponto.',
      'Scope errado — service singleton com state mutável injetado em request handler = bug de concorrência.',
      'Construtor com 15 parametros — sintoma de SRP violado, classe faz coisas demais. DI revelou o problema, não causou.',
      'Mock pra tudo em teste — teste vira espelho da implementação, refatorar quebra teste sem bug real. Mock só dependência externa, dependência interna prefere objeto real (test double mais leve).',
    ],
    interview: [
      { q: 'Por que DI ajuda em teste?', a: '<p>Sem DI, classe instância dependência internamente (<code>new PostgresClient()</code>). Pra testar, você precisa subir Postgres ou monkey-patch — ambos ruim.</p><p>Com DI, você injeta dependência no construtor. No teste, passa um mock/fake (<code>new OrderService(fakeRepo, fakeNotifier)</code>) e testa lógica isolada em milissegundos. Isso e <strong>testabilidade arquitetural</strong> — design viabilizando teste, não teste forcando design.</p>' },
      { q: 'Tradeoff: DI manual vs container?', a: '<p><strong>Manual</strong>: composition root no main instância tudo e passa. Sem magica, debugavel, type-safe. Limite: em projeto com 200 classes, composition root vira gigante.</p><p><strong>Container</strong>: anotação + auto-wire. Escala bem em projeto grande, configura scope, plugins. Custo: curva, magica/reflection, debug mais difícil, configuração errada vira erro em runtime.</p><p>Regra: até 50-100 classes, manual ganha em simplicidade. Acima disso, container compensa.</p>' },
      { q: 'O que e Service Locator e por que e considerado anti-pattern?', a: '<p>Service Locator: registry global onde você pede dependência <code>locator.get(UserRepo)</code> dentro da classe. Parece DI, mas <strong>esconde a dependência</strong> — assinatura da classe não revela o que ela precisa.</p><p>Problemas: teste precisa configurar locator (mais setup), refactor e perigoso (compilador não pega), e você perde o checklist explícito de deps. Mark Seemann: <em>"Service Locator is an anti-pattern"</em>. DI por construtor e claramente superior.</p>' },
      { q: 'Quando DI vira overkill?', a: '<p>Em script pequeno, CLI simples, prototipo de fim de semana — instanciar direto e mais legivel. Também em código onde dependência e <strong>pura</strong> e sem efeito colateral (função utilitaria) — não precisa injetar Math.</p><p>E em <strong>código de framework</strong> que você não testa unitariamente — Express handler trivial não precisa de IoC container. YAGNI antes de DI.</p>' },
      { q: 'Como você evita ciclo de dependência?', a: '<p>Primeiro: ciclo geralmente e <strong>cheiro de design ruim</strong>. Investiga se as duas classes deveriam ser uma so, ou se ha um terceiro conceito escondido.</p><p>Técnicas: extrair interface comum que ambas dependem, usar evento (A pública, B consome — em vez de chamada direta), injecao por setter como último recurso (com risco de uso antes de set).</p><p>Container moderno (Nest, Spring) detecta ciclo em startup com mensagem clara — facilita refactor.</p>' },
    ],
    resources: [
      { title: 'Dependency Injection Principles, Practices, and Patterns (Seemann)', url: 'https://www.manning.com/books/dependency-injection-principles-practices-patterns', kind: 'livro' },
      { title: 'Martin Fowler — Inversion of Control', url: 'https://martinfowler.com/articles/injection.html', kind: 'artigo' },
      { title: 'NestJS Docs — Providers', url: 'https://docs.nestjs.com/providers', kind: 'docs' },
      { title: 'Spring Framework Reference', url: 'https://docs.spring.io/spring-framework/reference/core/beans.html', kind: 'docs' },
      { title: 'Mark Seemann — DI blog', url: 'https://blog.ploeh.dk/tags/#Dependency-Injection-ref', kind: 'artigo' },
    ],
  },

  'sharding': {
    tagline: 'Particionar dado em múltiplos nos quando um banco não da mais conta sozinho.',
    why: 'Sharding aparece em entrevista de system design quando volume passa do que vertical scaling resolve. Senior precisa explicar estrategias (range, hash, geo), tradeoff de cross-shard query, e quando evitar (quase sempre antes de precisar).',
    summary: 'Sharding distribui dado em múltiplos nos (shards), cada um responsável por um subconjunto. Habilita escala horizontal de banco — capacidade total = soma dos shards. Estrategias: range (intervalos de chave), hash (mod ou consistent hashing), geographic (por regiao do usuário), directory (lookup table). Custo: cross-shard query e cara, transação distribuida e difícil, rebalance e operação tensa, hot shard surge fácil. Maioria dos sistemas resolve com vertical + read replica antes de precisar shardar.',
    keypoints: [
      { title: 'Range sharding', body: 'Particiona por intervalo de chave (A-F shard1, G-M shard2). Permite range scan eficiente. Risco: hot shard se distribuição e desigual (timestamp recente em último shard).' },
      { title: 'Hash sharding', body: 'Hash da chave mod N. Distribui uniforme, evita hot shard. Custo: mata range query, e adicionar/remover shard rebalanca tudo (a menos que use consistent hashing).' },
      { title: 'Consistent hashing', body: 'Anel hash onde adicionar/remover shard só move uma fração das chaves (1/N em vez de tudo). Padrão em Cassandra, DynamoDB, Memcached.' },
      { title: 'Geographic sharding', body: 'Por regiao do usuário (US, EU, APAC). Reduz latência, ajuda compliance (GDPR). Cross-region query e cara — desenhe pra evitar.' },
      { title: 'Cross-shard query', body: 'Query que toca varios shards (count global, agregacao) tem que fanout pra todos shards. Custo cresce linear. Senior desenha schema/acesso pra evitar — denormaliza, usa read model agregado.' },
      { title: 'Hot shard', body: 'Um shard recebe muito mais trafego (celebridade, item viral). Mata performance. Mitigação: salting (adiciona aleatorio a chave), shard splitting, cache na frente.' },
      { title: 'Rebalance', body: 'Adicionar shard exige mover dado. Operação online, demorada, com risco. Vendor managed (Aurora, Dynamo) cuida; auto-managed exige planejamento (dual-write, copy, switch).' },
    ],
    gotchas: [
      'Shardar antes de precisar — Postgres em hardware moderno aguenta TBs e dezenas de milhares de QPS. Shardar cedo e overkill caro.',
      'Escolher shard key errada — depois de TBs em produção, mudar shard key e horror. Estuda padrão de acesso antes.',
      'Hot shard ignorado — celebridade no Twitter mata o shard dela. Tem que ter plano (cache, replicação do hot, splitting).',
      'Cross-shard transaction com 2PC achando que e gratis — performance mata, e risco de transação pendurada existe.',
      'Esquecer de shardar índices/foreign key — virou query global cara em todo lookup.',
      'Achar que NoSQL "shardando automático" elimina o problema — você ainda precisa entender shard key, hot partition, RCU/WCU.',
    ],
    interview: [
      { q: 'Quando você shardaria um banco?', a: '<p>So quando <strong>vertical scaling acabou</strong>. Postgres em maquina moderna (db.r6i.16xlarge, 512GB RAM) aguenta TBs e dezenas de milhares de QPS. Read replicas resolvem leitura.</p><p>Indicadores reais: dataset > 5-10TB, write QPS > 50k sustentado, latência degradando mesmo com índice e cache. Antes disso, sharding e <strong>overkill caro</strong>.</p><p>Quando shardar, começo escolhendo shard key com cuidado (estuda padrões de acesso), planejo rebalance, e desenho pra evitar cross-shard query.</p>' },
      { q: 'Tradeoff: range vs hash sharding?', a: '<p><strong>Range</strong>: range scan e eficiente (relatório por período, paginação por id). Risco: <strong>hot shard</strong> em distribuição desigual — timestamp sempre vai pro último shard.</p><p><strong>Hash</strong>: distribui uniforme, evita hot shard. Custo: range query mata (precisa fanout pra todos shards).</p><p>Heurística: padrão de acesso e por chave individual? Hash ganha. Padrão e range/intervalo? Range com cuidado de hot shard (ex: hash + timestamp como chave composta).</p>' },
      { q: 'Como você escolhe a shard key?', a: '<p>Três critérios:</p><ul><li><strong>Cardinalidade alta</strong>: muitos valores diferentes pra distribuir bem</li><li><strong>Distribuição uniforme</strong>: nenhum valor concentra trafego (evita hot shard)</li><li><strong>Aderencia ao padrão de acesso</strong>: query mais comum deve achar dado em um só shard</li></ul><p>Exemplo: e-commerce. <code>user_id</code> é boa pra carrinho (tudo do user num shard). <code>product_id</code> é boa pra catálogo. <code>timestamp</code> é <strong>terrível</strong> — concentra escrita no último shard.</p>' },
      { q: 'Como você lida com hot shard?', a: '<p>Primeira linha: <strong>cache</strong> agressivo na frente do hot dado (Redis, CDN). Reduz pressão no shard.</p><p>Se não basta: <strong>splitting</strong> — quebra o shard em sub-shards. Em DynamoDB, isso e automático (adaptive capacity). Em manual, exige rebalance.</p><p>Outra opcao: <strong>salting</strong> — concatena prefixo aleatorio a chave (user_id_0, user_id_1, ..., user_id_9), distribui em 10 entradas, agrega em leitura. Funciona pra escrita pesada, complica leitura.</p>' },
      { q: 'Quais alternativas a sharding você considera primeiro?', a: '<p><strong>Vertical scaling</strong>: maquina maior. Boring, eficaz até alguns TBs.</p><p><strong>Read replicas</strong>: descarrega leitura, escrita continua no master. Maioria das apps tem ratio leitura/escrita 10:1 ou mais.</p><p><strong>Cache</strong>: Redis na frente, reduz QPS no banco em ordem de grandeza.</p><p><strong>Particao em mesmo banco</strong>: Postgres partitioning por range/list — divide tabela grande em sub-tabelas no mesmo cluster, sem complexidade de sharding distribuido.</p><p><strong>Arquivamento</strong>: dado histórico vai pra cold storage. Banco ativo fica menor.</p><p>Com tudo isso, dificilmente precisa shardar abaixo de 10TB.</p>' },
    ],
    resources: [
      { title: 'Designing Data-Intensive Applications (Kleppmann)', url: 'https://dataintensive.net/', kind: 'livro' },
      { title: 'System Design Primer — Sharding', url: 'https://github.com/donnemartin/system-design-primer#sharding', kind: 'docs' },
      { title: 'Vitess docs (sharding MySQL)', url: 'https://vitess.io/docs/', kind: 'docs' },
      { title: 'Citus / Postgres sharding', url: 'https://www.citusdata.com/', kind: 'docs' },
      { title: 'Discord — How we store billions of messages', url: 'https://discord.com/blog/how-discord-stores-billions-of-messages', kind: 'artigo' },
    ],
    diagram: 'consistent-hashing'
  },

  'chaos-engineering': {
    tagline: 'Injetar falhas em produção de forma controlada pra descobrir fraqueza antes do incidente.',
    why: 'Chaos engineering e diferencial em vaga senior em empresa com SLA serio. Mostra mentalidade de "falha vai acontecer, melhor descobrir agora". Saber explicar game day, blast radius e steady state coloca você em outro nível.',
    summary: 'Chaos engineering e a prática de injetar falhas controladas em sistema de produção (ou staging realista) pra validar resiliencia. Origem na Netflix com Chaos Monkey (2011). Metodo cientifico: define hipotese ("sistema sobrevive a queda de 1 AZ"), define steady state (metrica que indica saude), injeta falha, observa, corrige fraqueza encontrada. Não e "quebrar coisa aleatoria" — e experimento com blast radius limitado e plano de rollback. Princess Principle: confiança em sistema vem de teste, não de fe.',
    keypoints: [
      { title: 'Steady state', body: 'Metrica que define "sistema saudavel" durante o experimento (taxa de pedido por minuto, latência P99, erro rate). Sem isso, você não sabe se a injecao quebrou algo.' },
      { title: 'Hipotese', body: 'Antes de injetar, você diz: "esperamos que sistema continue saudavel quando X acontecer". Experimento confirma ou refuta. Se você já sabe que vai quebrar, não injete em prod — corrige primeiro.' },
      { title: 'Blast radius', body: 'Comece com 1% dos usuários, 1 instância, 1 AZ. Se experimento válida, expande. Nunca comece com 100% — você pode estar errado sobre a hipotese.' },
      { title: 'Tipos de falha', body: 'Latência injetada, erro HTTP, queda de instância, queda de AZ inteira, partição de rede, exhaustao de CPU/memória, DNS lento, certificado expirado.' },
      { title: 'Game day', body: 'Exercício coordenado onde time simula incidente em ambiente real. Treina runbook, válida observability, ensina time novo. Diferente de chaos automático — tem horario, escopo e participantes.' },
      { title: 'Ferramentas', body: 'Chaos Monkey (instância), Gremlin (managed), AWS Fault Injection Simulator, LitmusChaos (Kubernetes), Toxiproxy (rede), Chaos Mesh.' },
      { title: 'Pre-requisitos', body: 'Sem observability, você não ve o impacto. Sem runbook, time não sabe responder. Sem confiança em rollback, você não tem coragem de injetar. Maturidade vem antes do chaos.' },
    ],
    gotchas: [
      'Injetar falha sem observability — você não ve nada, aprende nada, e ainda quebra usuário.',
      'Comecar em prod 100% — primeira injecao deve ser em staging, depois 1% prod, depois expandir.',
      'Chaos sem hipotese — virou "quebrar coisa pra ver". Sem aprendizado estruturado, é só dor.',
      'Esquecer blast radius — experimento de "matar 1 instância" mata o cluster todo porque ninguem testou auto-scaling. Rollback rápido obrigatório.',
      'Time não maduro — chaos em sistema sem on-call, sem alarme, sem runbook, gera incidente real e queima confiança.',
      'Stakeholders sem aviso — gerente descobre que você derrubou prod numa quinta a tarde. Comunicação previa e cultural.',
    ],
    interview: [
      { q: 'Como você introduziria chaos engineering num time que nunca usou?', a: '<p>Começo com <strong>game day em staging</strong>: cenario combinado, todo mundo presente, simulamos queda de DB ou AZ. Identifica gaps de runbook e observability sem risco real. Esse exercício sozinho já entrega muito valor.</p><p>Depois evoluo: <strong>chaos manual em prod com blast radius pequeno</strong> (1 instância, 1% trafego), com aviso ao time, hipotese explícita, e plano de rollback. So depois de meses passo pra <strong>chaos automático</strong> (Chaos Monkey rodando todo dia em horario de trabalho).</p><p>Pre-req: sem observability e on-call decente, não começo. Chaos em sistema imaturo e sabotagem.</p>' },
      { q: 'Quando NÃO usar chaos engineering?', a: '<p>Sistema sem <strong>observability decente</strong> — você não vê impacto, não aprende, só quebra. Resolva observability primeiro.</p><p>Sistema sem <strong>SLA real ou usuário pagante</strong> — em prototipo ou MVP, ROI é baixo. O esforço de chaos pesa mais que o ganho.</p><p>Time sem maturidade de incidente — sem on-call, sem runbook, sem alarme, chaos gera incidente real que ninguém sabe responder. Vira trauma cultural.</p><p>Em fase de pre-PMF, foco em entrega, não em resiliência avançada.</p>' },
      { q: 'O que é blast radius e como você limita?', a: '<p>Blast radius é o <strong>escopo do impacto</strong> do experimento. Pequeno = poucos usuários afetados em caso de falha. Grande = muitos.</p><p>Limito por:</p><ul><li><strong>Percent</strong>: 1% trafego, depois 5%, depois 25%, depois 100%</li><li><strong>Geografia</strong>: uma AZ, depois uma região, depois global</li><li><strong>Tempo</strong>: experimento de 5min, com kill switch automático</li><li><strong>Trigger</strong>: aborto automático se métrica de steady state degrada N%</li></ul><p>Incremente só depois de validar nível anterior. Erro clássico: pular pro 100% confiando em rollback manual.</p>' },
      { q: 'Tradeoff: chaos automático continuo vs game day pontual?', a: '<p><strong>Chaos automático</strong> (Chaos Monkey rodando diario): garante que resiliencia não regride, encontra problema que game day pontual perde, normaliza falha como evento esperado. Custo: maturidade alta exigida, falsos positivos podem cansar time.</p><p><strong>Game day</strong>: exercício coordenado, treina time, captura cenario complexo (queda de fornecedor, ataque DDoS) que automacao não simula. Custo: pontual, depende de organizacao.</p><p>Time maduro faz os dois: automático cobre o cotidiano, game day cobre cenario excepcional. Time iniciante começa com game day.</p>' },
      { q: 'Como você mede sucesso de programa de chaos?', a: '<p>Metricas:</p><ul><li><strong>Bugs encontrados</strong> em pre-prod por experimento (mostra valor)</li><li><strong>MTTR</strong> caindo ao longo do tempo (time fica mais rápido em incidente)</li><li><strong>Cobertura</strong>: quantos serviços críticos já passaram por chaos</li><li><strong>Confiança do time</strong>: pesquisa sobre quanto time confia em deploy de sexta a tarde</li></ul><p>Não meco "número de experimentos rodados" — vira KPI gamificado sem qualidade. Foco no aprendizado e na resiliencia real do sistema.</p>' },
    ],
    resources: [
      { title: 'Chaos Engineering (Rosenthal et al., O\'Reilly)', url: 'https://www.oreilly.com/library/view/chaos-engineering/9781492043850/', kind: 'livro' },
      { title: 'Principles of Chaos Engineering', url: 'https://principlesofchaos.org/', kind: 'docs' },
      { title: 'Netflix Tech Blog — Chaos', url: 'https://netflixtechblog.com/tagged/chaos-engineering', kind: 'artigo' },
      { title: 'AWS Fault Injection Simulator', url: 'https://aws.amazon.com/fis/', kind: 'docs' },
      { title: 'Gremlin — Chaos Engineering tutorials', url: 'https://www.gremlin.com/community/tutorials/', kind: 'curso' },
    ],
  },

  'hmvc': {
    tagline: 'Hierarquia de triads MVC — módulos que encapsulam sua própria pilha de controle, visão e modelo.',
    why: 'HMVC aparece em codebases PHP legados (Kohana, CodeIgniter com módulos) e em discussões de modularização. Saber o que diferencia de MVC puro ajuda a entender modularidade e a ler código de sistema existente.',
    gotchas: [
      'Confundir HMVC com MVC simples — a hierarquia permite que um controller chame outro controller internamente, o que em MVC normal é anti-pattern.',
      'Usar HMVC como desculpa para criar acoplamento entre módulos via chamadas internas — o ponto é encapsulamento, não canal interno livre.',
      'Escolher HMVC em projeto moderno — em 2025, arquitetura modular com DDD/bounded contexts e injeção de dependência entrega os mesmos benefícios com mais clareza e testabilidade.',
    ],
  },

  'mvc': {
    tagline: 'Padrão de separação Model-View-Controller — base de quase todo framework web.',
    why: 'MVC é linguagem universal em entrevista de arquitetura. Saber explicar fluxo, onde mora lógica de negócio, e quando sair do MVC é básico para qualquer cargo senior.',
    summary: 'MVC separa responsabilidades em três: Model (dados e regras), View (apresentação), Controller (coordena request, chama model, seleciona view). Rails, Laravel, Spring MVC, Django seguem esse padrão. Em frameworks modernos de frontend (React, Vue), o padrão evolui: Controller some ou vira hook, View é componente, Model fica em store. A dor clássica do MVC é o Fat Controller (lógica de negócio escorregando pro controller) e o Fat Model (tudo no model vira deus-objeto). A separação correta: Controller recebe HTTP e delega, Model contém regra de domínio, View só formata saída.',
    gotchas: [
      'Fat Controller — colocar lógica de negócio no controller transforma ele em procedimento gigante impossível de testar.',
      'Confundir Model com tabela de banco — Model é camada de domínio, não ORM direto. A relação 1:1 com tabela é anemia de domínio.',
      'View acessando banco diretamente — viola separação, dificulta cache e teste. View recebe dado pronto do controller.',
      'Usar MVC para justificar tudo numa pasta — em projeto grande, MVC sem modularização vira pasta de 300 controllers sem coesão.',
    ],
  },

  'soa': {
    tagline: 'Arquitetura Orientada a Serviços — serviços de granularidade maior compartilhando um ESB.',
    why: 'SOA é predecessor dos microservices e ainda aparece em enterprise legado (Java EE, SOAP/WS-*). Saber distinguir de microservices e de arquitetura orientada a eventos posiciona você bem em entrevistas de modernização.',
    gotchas: [
      'Confundir SOA com microservices — SOA tem serviços maiores (coarse-grained), geralmente um ESB central, e protocolo SOAP/XML; microservices são finos, sem ESB, e usam HTTP/gRPC/eventos.',
      'ESB como ponto central de lógica de negócio — o barramento vira gargalo de complexidade, impossível de testar e de versionar sem coordenação global.',
      'Migrar SOA para microservices sem limpar o coupling do ESB — você distribui o problema em vez de resolver.',
    ],
  },

  'repository-pattern': {
    tagline: 'Abstrair o acesso a dados por trás de uma interface que parece uma coleção de objetos de domínio.',
    why: 'Repository aparece em toda discussão de DDD, Clean Architecture e testabilidade. Entrevistador testa se você entende o propósito (isolar domínio de persistência) ou se só decorou o nome.',
    summary: 'Repository pattern expõe uma interface para salvar e recuperar aggregates sem revelar como são persistidos. O consumidor (use case, service) vê uma "coleção" — OrderRepository.findById(id), OrderRepository.save(order). A implementação concreta usa ORM, SQL, HTTP, memória — o domínio não sabe. Isso habilita: teste com fake/mock sem banco, troca de ORM sem tocar domínio, e clareza de onde vivem queries. O perigo é o Repository virar DAO gigante com 50 métodos de query — aí o padrão perdeu o propósito.',
    gotchas: [
      'Repository com 50 métodos de query personalizados — virou DAO disfarçado. Queries complexas devem ir para um read model separado (CQRS) ou query service.',
      'Um Repository por tabela em vez de por aggregate — Order e OrderItem não têm repositórios separados; Repository cuida do aggregate root.',
      'Expor IQueryable/Criteria ao domínio — o consumidor controla a query, o Repository perde a abstração. Exponha métodos com intenção de domínio, não mecanismos de filtro.',
      'Achar que Repository substitui CQRS — para leitura complexa (dashboards, relatórios), um read model denormalizado é mais adequado que um Repository cheio de projeções especiais.',
    ],
  },

  'multi-tenant': {
    tagline: 'Uma instalação de software atendendo múltiplos clientes (tenants) com isolamento de dados.',
    why: 'Multi-tenancy é tema central em SaaS. Entrevistador de vaga backend/arquitetura espera que você explique os três modelos de isolamento e saiba escolher com base em requisito de segurança, custo e compliance.',
    summary: 'Multi-tenancy significa que múltiplos clientes (tenants) compartilham a mesma infraestrutura com isolamento lógico ou físico de dados. Três estratégias de banco: (1) banco separado por tenant — isolamento máximo, custo alto de operação; (2) schema separado por tenant — bom equilíbrio, migrations por schema; (3) tabela compartilhada com coluna tenant_id — custo mínimo, risco de vazamento de dados se query esquecer filtro. A escolha depende de: regulação (HIPAA, GDPR exigem isolamento maior), número de tenants, tamanho do dado, e custo operacional aceitável.',
    gotchas: [
      'Esquecer o filtro de tenant_id em uma query — no modelo de tabela compartilhada, um bug expõe dados de outro cliente. Row-level security no banco (Postgres RLS) mitiga.',
      'Migrations em schema separado por tenant — rodar migration em 500 schemas em paralelo precisa de orquestração cuidadosa (locks, order, rollback).',
      'Subestimar custo operacional de banco por tenant — 1.000 tenants = 1.000 bancos de dados, conexões, backups, e monitoramento separados.',
      'Cross-tenant analytics — relatório consolidado de todos os tenants em modelo isolado exige ETL/data warehouse separado, não query direta.',
    ],
  },

  'clean-code': {
    tagline: 'Escrever código que humanos leem e entendem sem precisar de decifração.',
    why: 'Clean Code é a linguagem de code review. Saber articular por que um nome é ruim, por que uma função é grande demais, ou por que um comentário é ruído posiciona você como revisor sólido e comunicador técnico confiável.',
    gotchas: [
      'Levar Clean Code como lei — "função de uma linha só", "zero comentários nunca" são extremos. Uncle Bob explica princípios, não dogmas. Contexto manda.',
      'Renomear variáveis pra soar "clean" sem refatorar a lógica — código elegante com lógica ruim ainda é código ruim.',
      'Comentário como documentação de código obvio — o pior tipo. Bom comentário explica POR QUÊ, não O QUÊ. "i++" não precisa de comentário; uma decisão de negócio contraintuitiva precisa.',
      'Sacrificar performance por nome bonito em caminho crítico — em hot path, micro-otimização e nome informativo podem coexistir; profiler decide, não dogma.',
    ],
  },

  'code-review': {
    tagline: 'Revisão sistemática de código antes do merge — qualidade, conhecimento e coesão de time.',
    why: 'Code review é habilidade de liderança técnica. Senior que revisa bem eleva o time, distribui conhecimento e previne débito técnico. Saber o que revisar (e o que não revisar) é diferencial em cargo sênior+.',
    summary: 'Code review serve a três propósitos: qualidade (bugs, segurança, performance), difusão de conhecimento (todos entendem o que está sendo mergeado) e coesão de design (decisões de arquitetura chegam ao time antes de virar débito). O que revisar: corretude, testes, clareza, segurança, performance em hot path, compatibilidade de API. O que NÃO bloquear: estilo de formatação (linter resolve), preferência pessoal de nome sem critério objetivo, micro-otimização especulativa. Feedback bom é específico, explica o porquê, separa blocking de sugestão, e nunca é pessoal.',
    gotchas: [
      'Revisar estilo que o linter deveria pegar — bloquear PR por indentação é ruído que desgasta quem revisou e quem recebeu. Automatize.',
      'Comentário de review vago — "isso pode ser melhorado" sem dizer como ou por quê gera frustração. Seja específico e objetivo.',
      'PR gigante de 2.000 linhas — revisor não consegue entender o contexto completo. Limite de PR é responsabilidade de quem abre, não de quem revisa.',
      'Ego de reviewer — rejeitar código correto porque "eu faria diferente" sem critério técnico é bloqueio desnecessário. Diferencie preferência de problema real.',
    ],
  },

}

export default data
