import type { SkillContent } from '@/types'

const solid: SkillContent = {
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
}

export default solid
