import type { SkillContent } from '@/types'

const ddd: SkillContent = {
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
}

export default ddd
