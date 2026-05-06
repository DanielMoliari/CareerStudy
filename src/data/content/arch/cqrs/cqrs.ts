import type { SkillContent } from '@/types'

const cqrs: SkillContent = {
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
}

export default cqrs
