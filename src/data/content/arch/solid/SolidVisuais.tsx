'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { DiffViewer } from '@/components/visuals/DiffViewer'
import type { DiffExample } from '@/components/visuals/DiffViewer'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

// ── Paleta SOLID ──────────────────────────────────────────────────────────────
const C      = '#FF6F00'   // laranja — princípios de engenharia
const C2     = '#e65100'   // secondary
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const AMB    = '#fbbf24'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Os 5 princípios com DiffViewer (antes/depois interativo)
// ═══════════════════════════════════════════════════════════════════════════════

const SOLID_DIFFS: DiffExample[] = [
  {
    id: 'srp',
    label: 'S — Single Responsibility',
    description: 'Uma classe deve ter uma única razão para mudar. Se o financeiro E o marketing pediriam mudanças na mesma classe, são duas responsabilidades.',
    beforeLabel: 'Violação — múltiplas responsabilidades',
    afterLabel: 'Aplicação — separadas por ator',
    before: `// Uma classe, 5 responsabilidades — 5 razões para mudar
class OrderService {
  // Responsabilidade 1: validação (PO/QA pede mudar)
  validate(order: Order): void {
    if (!order.items.length) throw new Error('sem itens')
    if (order.total < 0) throw new Error('total inválido')
  }

  // Responsabilidade 2: cálculo de frete (logística pede mudar)
  calculateShipping(order: Order): Money {
    return this.correiosApi.quote(order.address, order.weight)
  }

  // Responsabilidade 3: desconto (marketing pede mudar)
  applyDiscount(order: Order, coupon: string): Money {
    if (coupon === 'BLACK10') return order.total.multiply(0.10)
    return Money.zero('BRL')
  }

  // Responsabilidade 4: persistência (DBA pede mudar)
  save(order: Order): void {
    this.db.query('INSERT INTO orders ...', [order.id, order.total])
  }

  // Responsabilidade 5: notificação (DevOps/SMTP pede mudar)
  notify(order: Order): void {
    this.smtp.send(order.customer.email, 'Pedido confirmado')
  }
}
// 600 linhas — impossível de testar em isolamento
// Merge conflict toda semana — todo mundo mexe aqui`,
    after: `// Cada classe tem uma única razão para mudar
class OrderValidator {
  validate(order: Order): void {           // muda se regra de negócio mudar
    if (!order.items.length) throw new EmptyOrderError()
  }
}

class ShippingCalculator {
  calculate(order: Order): Money {         // muda se logística mudar
    return this.correiosApi.quote(order.address, order.weight)
  }
}

class DiscountPolicy {
  apply(order: Order, coupon: string): Money { // muda se marketing mudar
    if (coupon === 'BLACK10') return order.total.multiply(0.10)
    return Money.zero('BRL')
  }
}

class OrderRepository {
  save(order: Order): Promise<void> { ... }   // muda se banco mudar
}

class OrderNotifier {
  notify(order: Order): Promise<void> { ... } // muda se canal mudar
}

class PlaceOrderUseCase {        // orquestra as 5 acima
  constructor(
    private validator: OrderValidator,
    private shipping: ShippingCalculator,
    private discount: DiscountPolicy,
    private repo: OrderRepository,
    private notifier: OrderNotifier,
  ) {}
  async execute(input: PlaceOrderInput): Promise<void> { ... }
}`,
    explanation: 'SRP não é "classes pequenas" — é "uma classe muda por um motivo só (um ator)". Quando financeiro, marketing e DBA podem pedir mudanças na mesma classe, você tem múltiplas responsabilidades. Separar por ator torna cada parte testável em isolamento e eliminam merge conflicts.',
    tags: ['SRP', 'responsabilidade', 'ator'],
  },
  {
    id: 'ocp',
    label: 'O — Open/Closed',
    description: 'Software deve ser aberto para extensão e fechado para modificação. Adicionar novo comportamento não deve exigir editar código existente.',
    beforeLabel: 'Violação — switch que cresce',
    afterLabel: 'Aplicação — Strategy pattern',
    before: `// Adicionar novo meio de pagamento = editar esta classe
class PaymentProcessor {
  async process(payment: Payment): Promise<Receipt> {
    if (payment.method === 'pix') {
      // 30 linhas de lógica PIX
      const key = this.pixService.generateKey(payment)
      await this.pixService.charge(key, payment.amount)
      return new Receipt('pix', payment.amount)
    } else if (payment.method === 'credit_card') {
      // 40 linhas de lógica cartão
      const token = await this.cardService.tokenize(payment.card)
      const charge = await this.cardService.charge(token, payment.amount)
      return new Receipt('credit_card', charge.id)
    } else if (payment.method === 'boleto') {
      // 25 linhas de lógica boleto
      const barcode = await this.boletoService.generate(payment)
      return new Receipt('boleto', barcode)
    }
    // Apple Pay? Crypto? Edita aqui.
    // Risco de regressão toda vez que adicionar método
    throw new Error('método não suportado')
  }
}`,
    after: `// Interface fechada para modificação
interface PaymentMethod {
  charge(amount: Money): Promise<ChargeResult>
}

// Cada método é uma extensão — sem tocar nas classes existentes
class PixMethod implements PaymentMethod {
  async charge(amount: Money): Promise<ChargeResult> {
    const key = await this.pixApi.generateKey()
    return this.pixApi.charge(key, amount)
  }
}

class CreditCardMethod implements PaymentMethod {
  async charge(amount: Money): Promise<ChargeResult> {
    const token = await this.cardApi.tokenize(this.card)
    return this.cardApi.charge(token, amount)
  }
}

class BoletoMethod implements PaymentMethod { ... }

// PaymentProcessor NUNCA muda quando adicionamos método
class PaymentProcessor {
  constructor(private method: PaymentMethod) {} // DIP incluso
  async process(amount: Money): Promise<ChargeResult> {
    return this.method.charge(amount)             // abre extensão
  }
}

// Adicionar Apple Pay: cria ApplePayMethod. Zero risco em código existente.
// Cada método tem seu próprio teste — isolado, rápido.`,
    explanation: 'OCP é implementado tipicamente via Strategy ou polimorfismo. A abstração (interface PaymentMethod) é estável — o cliente não muda. Implementações são extensões — adicionadas, nunca editadas. Isso elimina risco de regressão em código que funcionava.',
    tags: ['OCP', 'Strategy', 'polimorfismo'],
  },
  {
    id: 'lsp',
    label: 'L — Liskov Substitution',
    description: 'Objetos de uma subclasse devem poder substituir objetos da classe base sem quebrar o programa. Subclasse não pode mentir no contrato da base.',
    beforeLabel: 'Violação — herança que quebra contrato',
    afterLabel: 'Aplicação — hierarquia honesta',
    before: `// Violação clássica: Retângulo → Quadrado
class Rectangle {
  constructor(public width: number, public height: number) {}
  setWidth(w: number)  { this.width = w }
  setHeight(h: number) { this.height = h }
  area(): number { return this.width * this.height }
}

class Square extends Rectangle {
  setWidth(w: number)  { this.width = w; this.height = w }  // quebra invariante!
  setHeight(h: number) { this.width = h; this.height = h }  // quebra invariante!
}

// Este teste funciona para Rectangle mas falha para Square:
function testArea(rect: Rectangle): void {
  rect.setWidth(5)
  rect.setHeight(4)
  console.assert(rect.area() === 20, 'área deveria ser 20')
  // Falha com Square: área = 25 (5*5, não 5*4)
}

// Outro exemplo clássico:
class Bird {
  fly(): void { /* voa */ }
}
class Penguin extends Bird {
  fly(): void { throw new Error('pinguim não voa!') }
  // subclasse mais restritiva que a base — LSP violado
}
function migrate(birds: Bird[]) {
  birds.forEach(b => b.fly())  // explode com Penguin
}`,
    after: `// Hierarquia honesta: Square e Rectangle são tipos pares
interface Shape {
  area(): number
}

class Rectangle implements Shape {
  constructor(private w: number, private h: number) {}
  setWidth(w: number)  { this.w = w }
  setHeight(h: number) { this.h = h }
  area(): number { return this.w * this.h }
}

class Square implements Shape {
  constructor(private side: number) {}
  setSide(s: number)   { this.side = s }  // API honesta
  area(): number { return this.side ** 2 }
}

// Para pássaros — segregar por capability (ISP incluso):
interface Bird    { eat(): void }
interface FlyingBird extends Bird { fly(): void }

class Sparrow implements FlyingBird {
  eat() {} fly() {}
}
class Penguin implements Bird {
  eat() {}  // só não voa — sem mentir no contrato
}

function migrate(birds: FlyingBird[]) { // type-safe agora
  birds.forEach(b => b.fly())  // Penguin nem compila aqui
}`,
    explanation: 'LSP é o teste de honestidade da herança. Pergunte: "posso substituir a base pela subclasse sem surpresas?" Se a subclasse lança NotImplementedException, aceita argumentos mais restritos ou quebra invariantes da base, a herança é desonesta. Prefira composição ou interfaces segregadas.',
    tags: ['LSP', 'herança', 'contrato'],
  },
  {
    id: 'isp',
    label: 'I — Interface Segregation',
    description: 'Clientes não devem depender de interfaces que não usam. Prefira várias interfaces pequenas e focadas a uma fat interface monolítica.',
    beforeLabel: 'Violação — fat interface',
    afterLabel: 'Aplicação — capabilities segregadas',
    before: `// Fat interface força implementar tudo — mesmo o que não faz
interface IUserRepository {
  // CRUD básico (LoginService usa esses)
  findById(id: string): Promise<User>
  save(user: User): Promise<void>

  // Busca (SearchService usa esses)
  findByEmail(email: string): Promise<User | null>
  search(query: string): Promise<User[]>

  // Relatórios (AdminService usa esses)
  countByRole(role: string): Promise<number>
  exportCSV(): Promise<string>

  // Administração (SyncService usa esses)
  syncToCRM(): Promise<void>
  rebuildIndex(): Promise<void>
  invalidateCache(): Promise<void>
}

// LoginService depende de 9 métodos que não usa
class LoginService {
  constructor(private repo: IUserRepository) {} // 9 deps implícitas
  async login(email: string, pass: string) {
    const user = await this.repo.findById(email)  // usa 1 de 9
    // teste precisa mockar todos os 9 — trabalho desnecessário
  }
}`,
    after: `// Interfaces segregadas por capability
interface IUserReader {
  findById(id: string): Promise<User>
  findByEmail(email: string): Promise<User | null>
}

interface IUserWriter {
  save(user: User): Promise<void>
  delete(id: string): Promise<void>
}

interface IUserSearch {
  search(query: string): Promise<User[]>
}

interface IUserAdmin {
  countByRole(role: string): Promise<number>
  exportCSV(): Promise<string>
  syncToCRM(): Promise<void>
}

// LoginService depende EXATAMENTE do que usa
class LoginService {
  constructor(private reader: IUserReader) {} // 1 dep, clara
  async login(email: string, pass: string) {
    const user = await this.reader.findByEmail(email)
    // teste: mocka só IUserReader — simples, rápido
  }
}

// Implementação pode agrupar capabilities
class UserRepository
  implements IUserReader, IUserWriter, IUserSearch, IUserAdmin {
  findById(id: string) { ... }
  save(user: User) { ... }
  // ... implementa tudo
}`,
    explanation: 'ISP reduz acoplamento e facilita testes. Quando LoginService depende de uma interface com 9 métodos mas usa 1, o teste precisa mockar os 9 — trabalho que não entrega valor. Com interfaces segregadas, cada cliente declara exatamente o que precisa — mock simples, intenção clara.',
    tags: ['ISP', 'interfaces', 'acoplamento'],
  },
  {
    id: 'dip',
    label: 'D — Dependency Inversion',
    description: 'Módulos de alto nível não devem depender de baixo nível. Ambos devem depender de abstrações. A abstração não depende do detalhe — o detalhe depende da abstração.',
    beforeLabel: 'Violação — alto nível conhece baixo nível',
    afterLabel: 'Aplicação — ambos dependem da abstração',
    before: `// Alto nível (regra de negócio) conhece baixo nível (drivers)
import { Pool } from 'pg'
import { SmtpClient } from 'nodemailer'
import { S3Client } from '@aws-sdk/client-s3'

class CreateUserUseCase {
  private db = new Pool({ connectionString: process.env.PG_URL })
  private mail = new SmtpClient({ host: 'smtp.gmail.com' })
  private storage = new S3Client({ region: 'us-east-1' })

  async execute(input: CreateUserInput): Promise<void> {
    // Use case conhece detalhes de SQL, SMTP, S3
    await this.db.query(
      'INSERT INTO users (email, name) VALUES ($1, $2)',
      [input.email, input.name]
    )
    await this.mail.sendMail({
      to: input.email,
      subject: 'Bem-vindo!',
      html: '<h1>Olá!</h1>'
    })
  }
}
// Teste: sobe Postgres, SMTP e S3 — integração obrigatória
// Trocar Postgres por MongoDB: reescreve o use case
// Trocar SMTP por SES: reescreve o use case`,
    after: `// Alto nível define o que precisa (interfaces/ports)
// Baixo nível implementa — direção de dependência invertida

// application/ports/
interface IUserRepository {
  create(user: User): Promise<void>
  findByEmail(email: string): Promise<User | null>
}
interface IMailer {
  send(to: string, subject: string, body: string): Promise<void>
}

// application/use-cases/
class CreateUserUseCase {
  constructor(
    private repo: IUserRepository,  // abstração, não Postgres
    private mailer: IMailer,        // abstração, não SMTP
  ) {}

  async execute(input: CreateUserInput): Promise<void> {
    const existing = await this.repo.findByEmail(input.email)
    if (existing) throw new UserAlreadyExistsError()
    const user = User.create(input.email, input.name)
    await this.repo.create(user)
    await this.mailer.send(input.email, 'Bem-vindo!', '<h1>Olá!</h1>')
  }
}

// infrastructure/ — detalhe implementa abstração
class PostgresUserRepository implements IUserRepository { ... }
class AwsSesMailer implements IMailer { ... }

// Teste: FakeUserRepository + FakeMailer — milissegundos, zero infra
// Trocar Postgres por Mongo: só PostgresUserRepository muda
// Trocar SMTP por SES: só o mailer muda — use case intacto`,
    explanation: 'DIP é o princípio mais poderoso para testabilidade e substituibilidade. O use case define o contrato (interface) que precisa — a infra implementa. A seta de dependência no source code vai de infra para domínio (invertida da direção natural). NestJS, Spring e Angular implementam DIP por design via injeção de dependência.',
    tags: ['DIP', 'abstração', 'injeção de dependência'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Anti-patterns clássicos (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const SOLID_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'God Class — viola SRP (e provavelmente todos os outros)',
    wrong: [
      [{ text: '// 800 linhas, 15 deps — God Class viola SRP implicitamente', color: FGMUTE }],
      [{ text: 'class UserManager {', color: FG }],
      [{ text: '  // autenticação (Security pede mudar)', color: FGMUTE }],
      [{ text: '  login(email: string, pass: string): Token { ... }', color: RED }],
      [{ text: '  resetPassword(email: string): void { ... }', color: RED }],
      [{ text: '  // persistência (DBA pede mudar)', color: FGMUTE }],
      [{ text: '  save(user: User): void { this.db.query("INSERT...") }', color: RED }],
      [{ text: '  findById(id: string): User { ... }', color: RED }],
      [{ text: '  // notificação (Marketing pede mudar)', color: FGMUTE }],
      [{ text: '  sendWelcomeEmail(user: User): void { ... }', color: RED }],
      [{ text: '  // relatórios (Financeiro pede mudar)', color: FGMUTE }],
      [{ text: '  exportCSV(): string { ... }', color: RED }],
      [{ text: '  // pagamento (Financeiro pede mudar)', color: FGMUTE }],
      [{ text: '  chargeSubscription(user: User): void { ... }', color: RED }],
      [{ text: '}  // 6 razões pra mudar = 6 responsabilidades', color: FGMUTE }],
    ],
    right: [
      [{ text: '// Cada classe tem uma razão para mudar', color: FGMUTE }],
      [{ text: 'class AuthService { login(...): Token {} }', color: GRN }],
      [{ text: 'class UserRepository { save(...): void {} }', color: GRN }],
      [{ text: 'class WelcomeMailer { send(user: User): void {} }', color: GRN }],
      [{ text: 'class UserReportExporter { exportCSV(): string {} }', color: GRN }],
      [{ text: 'class SubscriptionBilling { charge(user: User): void {} }', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: '// Cada uma testável em isolamento:', color: FGMUTE }],
      [{ text: 'describe("AuthService", () => {', color: GRN }],
      [{ text: '  it("retorna token quando credenciais válidas", () => {})', color: GRN }],
      [{ text: '  // sem mock de banco, email ou pagamento', color: GRN }],
      [{ text: '})', color: GRN }],
    ],
    why: 'God Class viola SRP (múltiplas responsabilidades), OCP (qualquer extensão a edita), provavelmente ISP (expõe tudo a todos) e DIP (acumula dependências concretas). É o ponto de partida para identificar todas as outras violações SOLID.',
  },
  {
    title: 'Switch/if-else por tipo — viola OCP',
    wrong: [
      [{ text: '// Cada novo tipo = editar esta função e re-testar tudo', color: FGMUTE }],
      [{ text: 'function processNotification(n: Notification): void {', color: FG }],
      [{ text: '  if (n.channel === "email") {', color: RED }],
      [{ text: '    this.smtp.send(n.to, n.subject, n.body)', color: RED }],
      [{ text: '  } else if (n.channel === "sms") {', color: RED }],
      [{ text: '    this.twilioApi.message(n.phone, n.body)', color: RED }],
      [{ text: '  } else if (n.channel === "push") {', color: RED }],
      [{ text: '    this.fcmApi.push(n.token, n.title, n.body)', color: RED }],
      [{ text: '  } else if (n.channel === "slack") {', color: RED }],
      [{ text: '    this.slackApi.post(n.webhook, n.body)', color: RED }],
      [{ text: '  }', color: FG }],
      [{ text: '  // WhatsApp? Telegram? Edita aqui.', color: FGMUTE }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: 'interface NotificationChannel {', color: GRN }],
      [{ text: '  send(notification: Notification): Promise<void>', color: GRN }],
      [{ text: '}', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: 'class EmailChannel implements NotificationChannel { ... }', color: GRN }],
      [{ text: 'class SmsChannel   implements NotificationChannel { ... }', color: GRN }],
      [{ text: 'class PushChannel  implements NotificationChannel { ... }', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: 'class NotificationService {', color: GRN }],
      [{ text: '  constructor(private channels: Map<string, NotificationChannel>) {}', color: GRN }],
      [{ text: '  async send(n: Notification): Promise<void> {', color: GRN }],
      [{ text: '    await this.channels.get(n.channel)?.send(n)', color: GRN }],
      [{ text: '  }', color: GRN }],
      [{ text: '}  // WhatsApp: new WhatsAppChannel() — zero risco aqui', color: FGMUTE }],
    ],
    why: 'Switch por tipo (discriminated union) é OCP violado: adicionar novo tipo exige editar código existente (e re-testar tudo). Strategy ou polimorfismo resolve: novo comportamento = nova classe. Código antigo fica fechado para modificação.',
  },
  {
    title: 'NotImplementedException em subclasse — viola LSP',
    wrong: [
      [{ text: '// Subclasse que não honra o contrato da base', color: FGMUTE }],
      [{ text: 'class Worker {', color: FG }],
      [{ text: '  work(): void { /* processa tarefa */ }', color: FG }],
      [{ text: '  takeBreak(): void { /* descansa */ }', color: FG }],
      [{ text: '  fillTimesheet(): void { /* preenche horas */ }', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: '', color: FG }],
      [{ text: 'class Contractor extends Worker {', color: RED }],
      [{ text: '  work(): void { /* ok */ }', color: FG }],
      [{ text: '  takeBreak(): void {', color: RED }],
      [{ text: '    throw new Error("contratado não tem intervalo")', color: RED }],
      [{ text: '  }', color: FG }],
      [{ text: '  fillTimesheet(): void {', color: RED }],
      [{ text: '    throw new Error("contratado não preenche timesheet")', color: RED }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: '// Código que usa Worker explode com Contractor', color: FGMUTE }],
    ],
    right: [
      [{ text: '// Segregar por capabilities honestas (LSP + ISP)', color: FGMUTE }],
      [{ text: 'interface CanWork { work(): void }', color: GRN }],
      [{ text: 'interface HasBreaks { takeBreak(): void }', color: GRN }],
      [{ text: 'interface HasTimesheet { fillTimesheet(): void }', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: 'class Employee implements CanWork, HasBreaks, HasTimesheet {', color: GRN }],
      [{ text: '  work() { ... }', color: GRN }],
      [{ text: '  takeBreak() { ... }', color: GRN }],
      [{ text: '  fillTimesheet() { ... }', color: GRN }],
      [{ text: '}', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: 'class Contractor implements CanWork {', color: GRN }],
      [{ text: '  work() { ... }  // só o que contratado pode fazer', color: GRN }],
      [{ text: '}', color: GRN }],
      [{ text: '// type-safe: Contractor nem compila em contexto de HasBreaks', color: FGMUTE }],
    ],
    why: 'Subclasse que lança erro em método herdado viola LSP — o chamador não pode confiar na substituição. Solução: segregar interfaces por capabilities honestas (LSP + ISP juntos). O compilador passa a rejeitar usos incorretos em vez de explodir em runtime.',
  },
  {
    title: 'new concreto no construtor — viola DIP',
    wrong: [
      [{ text: '// Alto nível (use case) cria e conhece baixo nível (drivers)', color: FGMUTE }],
      [{ text: 'class GenerateInvoiceUseCase {', color: FG }],
      [{ text: '  private db = new TypeOrmConnection()     // acoplado', color: RED }],
      [{ text: '  private pdf = new PdfKitGenerator()      // acoplado', color: RED }],
      [{ text: '  private storage = new AwsS3Bucket()      // acoplado', color: RED }],
      [{ text: '  private mailer = new SendGridMailer()    // acoplado', color: RED }],
      [{ text: '', color: FG }],
      [{ text: '  async execute(orderId: string): Promise<void> {', color: FG }],
      [{ text: '    const order = await this.db.findOrder(orderId)', color: FG }],
      [{ text: '    const pdf = await this.pdf.generate(order)', color: FG }],
      [{ text: '    const url = await this.storage.upload(pdf)', color: FG }],
      [{ text: '    await this.mailer.send(order.email, url)', color: FG }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: '// Teste: sobe TypeORM + PdfKit + S3 + SendGrid — impossível de isolar', color: FGMUTE }],
    ],
    right: [
      [{ text: '// Use case depende de abstrações — infra implementa', color: FGMUTE }],
      [{ text: 'interface IOrderFinder { findById(id: string): Promise<Order> }', color: GRN }],
      [{ text: 'interface IPdfGenerator { generate(order: Order): Promise<Buffer> }', color: GRN }],
      [{ text: 'interface IFileStorage { upload(file: Buffer): Promise<string> }', color: GRN }],
      [{ text: 'interface IMailer { send(to: string, url: string): Promise<void> }', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: 'class GenerateInvoiceUseCase {', color: GRN }],
      [{ text: '  constructor(', color: GRN }],
      [{ text: '    private finder: IOrderFinder,', color: GRN }],
      [{ text: '    private pdfGen: IPdfGenerator,', color: GRN }],
      [{ text: '    private storage: IFileStorage,', color: GRN }],
      [{ text: '    private mailer: IMailer,', color: GRN }],
      [{ text: '  ) {}', color: GRN }],
      [{ text: '  async execute(orderId: string): Promise<void> { ... }', color: FG }],
      [{ text: '}', color: GRN }],
      [{ text: '// Teste: 4 fakes em memória — roda em <10ms', color: FGMUTE }],
    ],
    why: 'new concreto no construtor acopla o use case ao driver. Mudar S3 para GCS reescreve o use case. DIP inverte: use case define o contrato (interface), infra implementa. Teste usa fakes — sem infra real, 100x mais rápido.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Relação entre os 5 princípios (componente custom)
// ═══════════════════════════════════════════════════════════════════════════════

type PrincipleNode = {
  id: string
  letter: string
  name: string
  short: string
  color: string
  x: number
  y: number
  relatesTo: Array<{ target: string; label: string }>
  violation: string
}

const PRINCIPLES: PrincipleNode[] = [
  {
    id: 'srp', letter: 'S', name: 'Single Responsibility', short: 'Uma razão pra mudar',
    color: '#E91E63', x: 50, y: 10,
    relatesTo: [
      { target: 'ocp', label: 'Classe com 1 resp é mais fácil de estender sem modificar' },
      { target: 'isp', label: 'Responsabilidade única → interface pequena e coesa' },
    ],
    violation: 'God Class — uma classe faz tudo',
  },
  {
    id: 'ocp', letter: 'O', name: 'Open/Closed', short: 'Extensão sem modificação',
    color: '#FF6F00', x: 88, y: 45,
    relatesTo: [
      { target: 'lsp', label: 'Extensão via herança requer subclasses honestas (LSP)' },
      { target: 'dip', label: 'OCP via Strategy exige DIP — injetar strategy via interface' },
    ],
    violation: 'Switch por tipo — adicionar tipo = editar código',
  },
  {
    id: 'lsp', letter: 'L', name: 'Liskov Substitution', short: 'Subclasse honra contrato',
    color: '#f59e0b', x: 70, y: 85,
    relatesTo: [
      { target: 'isp', label: 'Subclasse que lança NotImplementedException → segregar interface' },
      { target: 'ocp', label: 'Hierarquia honesta habilita extensão via polimorfismo seguro' },
    ],
    violation: 'NotImplementedException ou invariante quebrada em subclasse',
  },
  {
    id: 'isp', letter: 'I', name: 'Interface Segregation', short: 'Cliente usa o que precisa',
    color: '#4ade80', x: 30, y: 85,
    relatesTo: [
      { target: 'srp', label: 'Interface com uma capability = SRP na abstração' },
      { target: 'dip', label: 'Interfaces segregadas são mais fáceis de invertir no DIP' },
    ],
    violation: 'Fat interface — 30 métodos, cliente usa 2',
  },
  {
    id: 'dip', letter: 'D', name: 'Dependency Inversion', short: 'Depender de abstração',
    color: '#38bdf8', x: 12, y: 45,
    relatesTo: [
      { target: 'ocp', label: 'DIP é o mecanismo que realiza OCP sem herança' },
      { target: 'srp', label: 'Inversão separa "o que fazer" (interface) de "como fazer" (impl)' },
    ],
    violation: 'new concreto no construtor — alto nível conhece baixo nível',
  },
]

function PrinciplesRelationMap() {
  const [selected, setSelected] = useState<string | null>(null)

  const selectedNode = PRINCIPLES.find(p => p.id === selected)
  const relatedIds = selectedNode ? selectedNode.relatesTo.map(r => r.target) : []

  const W = 420
  const H = 300

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, height: '100%' }}>
      {/* SVG Map */}
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 11, color: FGMUTE, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          Clique em um princípio para ver como se relaciona com os outros
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 260 }}>
          {/* Linhas de relação */}
          {PRINCIPLES.map(p => p.relatesTo.map(rel => {
            const target = PRINCIPLES.find(t => t.id === rel.target)
            if (!target) return null
            const isHighlighted = selected === p.id || selected === rel.target
            const x1 = (p.x / 100) * W
            const y1 = (p.y / 100) * H
            const x2 = (target.x / 100) * W
            const y2 = (target.y / 100) * H
            return (
              <line
                key={`${p.id}-${rel.target}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isHighlighted ? C : LINE}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeDasharray={isHighlighted ? 'none' : '4 4'}
                opacity={selected && !isHighlighted ? 0.2 : 1}
                style={{ transition: 'all .3s' }}
              />
            )
          }))}

          {/* Nós */}
          {PRINCIPLES.map(p => {
            const cx = (p.x / 100) * W
            const cy = (p.y / 100) * H
            const isSelected = selected === p.id
            const isRelated = relatedIds.includes(p.id)
            const isDimmed = selected && !isSelected && !isRelated
            return (
              <g key={p.id} style={{ cursor: 'pointer' }}
                onClick={() => setSelected(isSelected ? null : p.id)}>
                <circle
                  cx={cx} cy={cy} r={28}
                  fill={isSelected ? p.color : `${p.color}25`}
                  stroke={p.color}
                  strokeWidth={isSelected ? 3 : isRelated ? 2 : 1}
                  opacity={isDimmed ? 0.3 : 1}
                  style={{ transition: 'all .3s' }}
                />
                <text x={cx} y={cy - 4} textAnchor="middle" fontSize={18} fontWeight={800}
                  fill={isSelected ? '#000' : p.color}
                  opacity={isDimmed ? 0.3 : 1}
                  style={{ fontFamily: 'sans-serif', transition: 'all .3s' }}>
                  {p.letter}
                </text>
                <text x={cx} y={cy + 12} textAnchor="middle" fontSize={8}
                  fill={isSelected ? '#000' : FGMUTE}
                  opacity={isDimmed ? 0.3 : 1}
                  style={{ fontFamily: 'sans-serif', transition: 'all .3s' }}>
                  {p.name.split(' ')[0]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Painel lateral */}
      <div style={{ background: CARD, borderRadius: 12, padding: 20, border: `1px solid ${selectedNode ? selectedNode.color : LINE}`, transition: 'border-color .3s' }}>
        {selectedNode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 10, color: selectedNode.color, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                Princípio {selectedNode.letter}
              </div>
              <div style={{ fontSize: 16, color: FG, fontWeight: 700 }}>{selectedNode.name}</div>
              <div style={{ fontSize: 12, color: FGMUTE, marginTop: 2 }}>{selectedNode.short}</div>
            </div>
            <div style={{ padding: '8px 12px', background: `${RED}15`, borderRadius: 8, border: `1px solid ${RED}30` }}>
              <div style={{ fontSize: 10, color: RED, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>VIOLAÇÃO TÍPICA</div>
              <div style={{ fontSize: 12, color: FG, lineHeight: 1.5 }}>{selectedNode.violation}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: selectedNode.color, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Relaciona-se com
              </div>
              {selectedNode.relatesTo.map(rel => {
                const target = PRINCIPLES.find(p => p.id === rel.target)
                if (!target) return null
                return (
                  <div key={rel.target} style={{ marginBottom: 10, padding: '8px 10px', background: `${target.color}12`, borderRadius: 6, border: `1px solid ${target.color}30` }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ display: 'inline-flex', width: 22, height: 22, borderRadius: '50%', background: target.color, alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#000' }}>
                        {target.letter}
                      </span>
                      <span style={{ fontSize: 11, color: target.color, fontWeight: 700 }}>{target.name}</span>
                    </div>
                    <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.5 }}>{rel.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 32 }}>🔗</div>
            <div style={{ fontSize: 14, color: FG, fontWeight: 600 }}>Relações entre princípios</div>
            <div style={{ fontSize: 12, color: FGMUTE, lineHeight: 1.6 }}>
              Os 5 princípios não são independentes — violações tendem a arrastar outros. Clique em qualquer letra para ver como cada princípio se conecta aos demais.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — SOLID vs outros conjuntos de princípios (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const PRINCIPLES_OPTIONS: ComparisonOption[] = [
  { id: 'solid', label: 'SOLID',       sublabel: 'Uncle Bob',        color: C },
  { id: 'grasp', label: 'GRASP',       sublabel: 'Craig Larman',     color: PRP },
  { id: 'dry',   label: 'DRY/YAGNI',  sublabel: 'Hunt & Thomas',    color: SKY },
  { id: 'goF',   label: 'GoF Patterns', sublabel: 'Gang of Four',   color: AMB },
]

const PRINCIPLES_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'focus',
    label: 'Foco principal',
    category: 'Natureza',
    values: {
      solid: { rating: 'excellent', note: 'Design de classes OO e dependências' },
      grasp: { rating: 'good',      note: 'Atribuição de responsabilidades em OO' },
      dry:   { rating: 'good',      note: 'Eliminar duplicação e especulação' },
      goF:   { rating: 'good',      note: 'Soluções reutilizáveis para problemas recorrentes' },
    },
  },
  {
    id: 'level',
    label: 'Nível de abstração',
    category: 'Natureza',
    values: {
      solid: { rating: 'good',      note: 'Nível de classe e módulo' },
      grasp: { rating: 'good',      note: 'Nível de classe e colaboração' },
      dry:   { rating: 'excellent', note: 'Nível de código ao sistema' },
      goF:   { rating: 'fair',      note: 'Soluções específicas com código' },
    },
  },
  {
    id: 'testability',
    label: 'Impacto em testabilidade',
    category: 'Prática',
    values: {
      solid: { rating: 'excellent', note: 'DIP + ISP habilitam testes isolados' },
      grasp: { rating: 'good',      note: 'Coesão alta facilita teste unitário' },
      dry:   { rating: 'good',      note: 'Menos duplicação = menos ponto de falha' },
      goF:   { rating: 'fair',      note: 'Depende do padrão — alguns complicam' },
    },
  },
  {
    id: 'extensibility',
    label: 'Impacto em extensibilidade',
    category: 'Prática',
    values: {
      solid: { rating: 'excellent', note: 'OCP é dedicado a isso' },
      grasp: { rating: 'good',      note: 'Protected Variation e Polymorphism' },
      dry:   { rating: 'fair',      note: 'Indiretamente via abstração' },
      goF:   { rating: 'excellent', note: 'Strategy, Decorator, Observer são OCP em ação' },
    },
  },
  {
    id: 'overengineering',
    label: 'Risco de overengineering',
    category: 'Tradeoff',
    values: {
      solid: { rating: 'fair',      note: 'Interface pra tudo, factory de factory — armadilha real' },
      grasp: { rating: 'good',      note: 'Foco em coesão evita abstração desnecessária' },
      dry:   { rating: 'excellent', note: 'YAGNI é explicitamente anti-overengineering' },
      goF:   { rating: 'poor',      note: 'Padrões complexos aplicados sem dor real' },
    },
  },
  {
    id: 'learning',
    label: 'Curva de aprendizado',
    category: 'Tradeoff',
    values: {
      solid: { rating: 'excellent', note: '5 princípios com nome e definição clara' },
      grasp: { rating: 'fair',      note: '9 padrões menos conhecidos fora da academia' },
      dry:   { rating: 'excellent', note: 'Intuitivo — "não repita código"' },
      goF:   { rating: 'fair',      note: '23 padrões com UML — longa curva' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Jornada de domínio SOLID (ProgressionMap)
// ═══════════════════════════════════════════════════════════════════════════════

const SOLID_LEVELS: ProgressionLevel[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    label: 'Aprende os nomes',
    emoji: '📖',
    concepts: [
      { name: 'Sabe os 5 acrônimos e definições de cor', tip: 'S-O-L-I-D: Single, Open/Closed, Liskov, Interface, Dependency' },
      { name: 'Consegue escrever código que segue SRP básico', tip: 'Classes com propósito único, não 500 linhas fazendo tudo' },
      { name: 'Entende a diferença entre classe e interface', tip: 'Interface define contrato. Classe implementa.' },
    ],
  },
  {
    id: 'pleno-jr',
    name: 'Pleno Junior',
    label: 'Identifica violações',
    emoji: '🔍',
    concepts: [
      { name: 'Identifica God Class como violação de SRP em code review', tip: 'Sinais: construtor com 5+ deps, classe com 300+ linhas' },
      { name: 'Reconhece switch por tipo como violação de OCP', tip: 'if/else por type, discriminated union sem polimorfismo' },
      { name: 'Sabe quando interface está grande demais (ISP)', tip: 'Cliente usa 2 de 12 métodos — interface precisa ser segregada' },
      { name: 'Identifica new concreto em lugar errado (DIP)', tip: 'Use case com new PostgresClient() no construtor' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Refatora com SOLID',
    emoji: '🔧',
    concepts: [
      { name: 'Aplica Strategy pattern para satisfazer OCP', tip: 'Interface + N implementações: adicionar = nova classe, não editar' },
      { name: 'Usa DIP via injeção de dependência no construtor', tip: 'Constructor injection: recebe interface, não cria concreto' },
      { name: 'Segrega interfaces por capability (ISP)', tip: 'IUserReader, IUserWriter, IUserSearch — cada cliente pede o que usa' },
      { name: 'Redesenha hierarquias de herança desonestas (LSP)', tip: 'Composição em vez de herança quando subclasse mente no contrato' },
      { name: 'Consegue testar use cases sem infraestrutura real', tip: 'DIP + ISP = fakes em vez de mocks complexos' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Aplica por design + defende tradeoffs',
    emoji: '🎯',
    concepts: [
      { name: 'Sabe QUANDO não aplicar SOLID (YAGNI)', tip: 'Abstração especulativa sem dor real é overengineering' },
      { name: 'Conecta SOLID com Clean Architecture e DDD', tip: 'DIP = Ports/Adapters. SRP = Use Case faz uma coisa. OCP = Strategy.' },
      { name: 'Defende tradeoff de boilerplate vs flexibilidade', tip: 'Interface que nunca será trocada é overhead. Sênior sabe discernir.' },
      { name: 'Identifica violações em sistemas distribuídos', tip: 'God service, switch por tipo via Kafka consumer, DIP entre microservices' },
      { name: 'Ensina o time SOLID com exemplos concretos do código atual', tip: 'Leva PR real da base de código — antes/depois concreto' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'SOLID como linguagem de design',
    emoji: '🏛',
    concepts: [
      { name: 'Projeta sistemas com SOLID como critério de avaliação', tip: 'Architecture Decision Records mencionam SRP, DIP, OCP como justificativa' },
      { name: 'Conhece a origem matemática de LSP (Barbara Liskov, 1987)', tip: 'Subtipo deve satisfazer as pré/pós-condições da base — teoria formal' },
      { name: 'Relaciona SOLID com princípios funcionais (imutabilidade, composição)', tip: 'DIP via higher-order functions, SRP via funções puras, OCP via closures' },
      { name: 'Avalia quando SOLID conflita com performance', tip: 'Polimorfismo tem custo de dispatch virtual — conhece e decide conscientemente' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — "Devo criar essa abstração?" (DecisionTree)
// ═══════════════════════════════════════════════════════════════════════════════

const ABSTRACTION_ROOT: DTNode = {
  id: 'root',
  question: 'Você está sentindo dor real ao mudar ou testar este código?',
  color: C,
  children: [
    { label: 'Sim', nodeId: 'has-pain', color: GRN },
    { label: 'Não (ainda)', nodeId: 'no-pain', color: AMB },
  ],
}

const ABSTRACTION_NODES: Record<string, DTNode> = {
  'has-pain': {
    id: 'has-pain',
    question: 'A dor vem de múltiplas implementações do mesmo comportamento (ou previsão concreta de ter)?',
    color: C2,
    children: [
      { label: 'Sim', nodeId: 'multiple-impl', color: GRN },
      { label: 'Não', nodeId: 'single-impl', color: AMB },
    ],
  },
  'no-pain': {
    id: 'no-pain',
    recommendation: 'Aplique YAGNI — não crie abstração agora',
    detail: 'Abstração especulativa é overengineering. SOLID brilha quando há dor real de mudança. Codifique simples agora; refatore quando a dor aparecer. "Make it work, make it right, make it fast" — na ordem.',
    color: AMB,
    icon: '⚡',
  },
  'multiple-impl': {
    id: 'multiple-impl',
    question: 'A variação é de comportamento (Strategy) ou de dado (State)?',
    color: C2,
    children: [
      { label: 'Comportamento', nodeId: 'strategy', color: GRN },
      { label: 'Estado/dado', nodeId: 'state-pattern', color: SKY },
    ],
  },
  'single-impl': {
    id: 'single-impl',
    question: 'O problema é testabilidade (precisa de fake de infra)?',
    color: AMB,
    children: [
      { label: 'Sim', nodeId: 'use-dip', color: GRN },
      { label: 'Não', nodeId: 'srp-check', color: AMB },
    ],
  },
  strategy: {
    id: 'strategy',
    recommendation: 'OCP via Strategy — interface + implementações',
    detail: 'Crie interface com o contrato. Cada variante é uma implementação. O cliente recebe via construtor (DIP). Adicionar comportamento = nova classe. Feche o cliente para modificação.',
    color: GRN,
    icon: '✅',
  },
  'state-pattern': {
    id: 'state-pattern',
    recommendation: 'State pattern ou enum com guard clauses',
    detail: 'Variação de dado (status, modo) → State pattern: cada estado é uma classe que implementa transições válidas. Ou simplesmente: enum bem definido com guard clauses no aggregate. Não force interface se a variação é de dado, não de comportamento.',
    color: SKY,
    icon: '🔄',
  },
  'use-dip': {
    id: 'use-dip',
    recommendation: 'DIP — interface para a dependência de infra',
    detail: 'Crie interface que representa o contrato (IUserRepository, IMailer). O use case recebe via construtor. Infra implementa. Teste usa fake em memória. Isso é DIP + ISP juntos: interface mínima com exatamente o que o cliente precisa.',
    color: GRN,
    icon: '✅',
  },
  'srp-check': {
    id: 'srp-check',
    question: 'A classe tem mais de uma razão para mudar (mais de um ator que pediria mudanças)?',
    color: AMB,
    children: [
      { label: 'Sim', nodeId: 'apply-srp', color: GRN },
      { label: 'Não', nodeId: 'no-abstraction', color: FGMUTE },
    ],
  },
  'apply-srp': {
    id: 'apply-srp',
    recommendation: 'SRP — separe por ator de negócio',
    detail: 'Identifique os atores (quem pediria cada mudança). Crie uma classe por ator. Compose no use case. Resultado: cada classe testável em isolamento, merge conflicts por feature desaparecem.',
    color: GRN,
    icon: '✅',
  },
  'no-abstraction': {
    id: 'no-abstraction',
    recommendation: 'Não crie abstração — o código está bem',
    detail: 'SOLID é instrumento para coesão alta e acoplamento baixo. Se o código atual já produz isso (testável, uma responsabilidade, fácil de mudar), não há problema a resolver. Abstração sem problema é overengineering.',
    color: FGMUTE,
    icon: '👍',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function SolidVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'cinco-principios',
      title: 'Os 5 Princípios SOLID',
      subtitle: 'Antes × depois interativo — um princípio por vez',
      accent: C,
      component: (
        <DiffViewer
          examples={SOLID_DIFFS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns SOLID',
      subtitle: 'God Class, switch por tipo, NotImplementedException, new concreto',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={SOLID_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'relations',
      title: 'Relações entre Princípios',
      subtitle: 'Como violações de um arrastam os outros',
      accent: C,
      component: <PrinciplesRelationMap />,
    },
    {
      id: 'progressao',
      title: 'Jornada SOLID',
      subtitle: 'Do iniciante que decora os nomes ao especialista que projeta com SOLID',
      accent: C,
      component: (
        <ProgressionMap
          levels={SOLID_LEVELS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'vs-outros',
      title: 'SOLID vs outros princípios',
      subtitle: 'SOLID × GRASP × DRY/YAGNI × GoF Patterns',
      accent: C,
      component: (
        <ComparisonTable
          options={PRINCIPLES_OPTIONS}
          criteria={PRINCIPLES_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'quando-abstrair',
      title: 'Devo criar essa abstração?',
      subtitle: 'Árvore de decisão para evitar overengineering com SOLID',
      accent: C,
      component: (
        <DecisionTree
          root={ABSTRACTION_ROOT}
          nodes={ABSTRACTION_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
