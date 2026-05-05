import type { SkillContent } from '@/types'

const microservices: SkillContent = {
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
}

export default microservices
