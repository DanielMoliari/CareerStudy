import type { SkillContent } from '@/types'

const cleanArchitecture: SkillContent = {
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
      title: 'Use Case de criação de usuário sem framework',
      description: 'Crie uma classe <code>CreateUserUseCase</code> que recebe um <code>IUserRepository</code> via construtor. O Use Case deve validar que o email não existe, criar um <code>User</code> entity e persistir via repositório. Crie um <code>FakeUserRepository</code> em memória para testar o Use Case sem banco.',
      concepts: ['Use Case', 'Repository Interface', 'Dependency Inversion', 'Testes unitários sem mock de framework'],
      hint: 'O Use Case não importa nada de Express, TypeORM ou qualquer framework. Só importa a Entity User e a interface IUserRepository.',
    },
    {
      level: 'intermediario',
      title: 'Repository Interface + implementação TypeORM',
      description: 'Defina uma interface <code>IOrderRepository</code> no domínio com métodos <code>findById</code>, <code>save</code> e <code>findByUserId</code>. Crie uma implementação <code>OrderRepositoryTypeORM</code> em infra que implementa a interface usando TypeORM. Registre ambas no módulo NestJS usando um token de injeção de dependência para que o Use Case receba a interface, não a implementação.',
      concepts: ['Repository Pattern', 'Interface Adapters', 'NestJS DI', 'Token de injeção'],
      hint: 'Use <code>provide: IOrderRepository_TOKEN, useClass: OrderRepositoryTypeORM</code> no módulo NestJS.',
    },
    {
      level: 'senior',
      title: 'Refatorar Controller gordo para Clean Architecture',
      description: 'Dado um Controller Express com 200 linhas que busca usuário no banco, verifica permissões, aplica desconto, envia email e retorna resposta formatada: extraia cada responsabilidade para a camada correta. Identifique quais lógicas são regras de negócio (domínio/use case), quais são infraestrutura (repositório, email service), e quais são interface adapter (formatação de resposta). Implemente com inversão de dependência e escreva testes unitários para o Use Case.',
      concepts: ['Refatoração incremental', 'Separação de responsabilidades', 'Inversão de dependência', 'Testes de Use Case'],
      hint: 'Comece pela regra de negócio mais crítica e extraia um Use Case por vez. O Controller deve ter no máximo 20-30 linhas após a refatoração.',
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
}

export default cleanArchitecture
