'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion } from '@/components/pdfs/ComparativeRefPdf'

// ── Paleta SOLID ──────────────────────────────────────────────────────────────
const C = '#FF6F00'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista SOLID',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: SRP com exemplo de God Class, OCP via Strategy, LSP com herança que quebra contrato, ISP com interface gorda vs segregada, DIP com injeção de dependência. Inclui armadilhas de overengineering e quando cada princípio paga seu custo.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos SOLID',
    subtitle: 'Uma âncora cognitiva para cada letra — S-O-L-I-D',
    type: 'mnemonics',
    pages: 3,
    description: 'Cinco mnemônicos, um por princípio: ATOR para SRP, FECHAR para OCP, HONRA para LSP, FAT para ISP, ABSTRUSO para DIP. Expansões com exemplo de código e por que o princípio importa em entrevistas.',
    icon: '02',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns SOLID',
    subtitle: 'Os 5 erros mais comuns — antes e depois',
    type: 'antipatterns',
    pages: 3,
    description: 'God Class (SRP), switch/if-chain por tipo (OCP), NotImplementedException em herança (LSP), interface gordinha com método desnecessário (ISP), new concreto dentro de classe de negócio (DIP). Com código ruim vs código correto.',
    icon: '03',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'comparative',
    title: 'SOLID vs GRASP vs Outros',
    subtitle: 'Comparação de princípios de design OO',
    type: 'comparative',
    pages: 2,
    description: 'SOLID vs GRASP vs DRY/YAGNI vs GoF Patterns em seis critérios: nível de abstração, aplicabilidade, relação com testes, quando aprender, quando priorizar e trade-offs comuns. Ajuda a posicionar cada conjunto no kit de ferramentas.',
    icon: '04',
    goal: 'Mapeamento comparativo',
  },
]

// ── Q&As ──────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é o Single Responsibility Principle (SRP)? Como identificar uma violação?',
    a: '<strong>SRP</strong>: uma classe deve ter um único motivo para mudar. O "motivo" é um <em>ator</em> — um stakeholder que pediria a mudança.<br><br><strong>Identificação de violação:</strong><br>• A classe tem mais de um ator pedindo mudanças — financeiro muda cálculo, marketing muda email<br>• O nome contém "And" ou "Manager" ou "Service" onipotente (OrderServiceAndEmailSender)<br>• Você precisa de mais de 3 mocks diferentes para testar um único método<br>• Qualquer mudança quebra testes de responsabilidades que não mudaram<br><br><strong>Exemplo clássico:</strong> <code>class OrderService { validate(); calculateShipping(); applyDiscount(); persist(); sendEmail(); generatePDF() }</code> — 6 motivos diferentes para mudar.<br><br><strong>Refatoração:</strong> extrair cada responsabilidade para classe própria (<code>OrderValidator</code>, <code>ShippingCalculator</code>, etc.) e orquestrar via Use Case.',
    tip: 'A resposta sênior substitui "uma coisa" por "um ator". Isso mostra que você entende SRP como organização em torno de usuários do sistema, não tamanho da classe.',
  },
  {
    level: 'Pleno',
    q: 'O que é o Open/Closed Principle (OCP)? Qual padrão de design o implementa canonicamente?',
    a: '<strong>OCP</strong>: classes devem ser abertas para extensão e fechadas para modificação. Novo comportamento = novo código, não editar o existente.<br><br><strong>Padrão canônico: Strategy.</strong><br><br>Sem OCP:<br><code>if (type === "pix") { processarPix() } else if (type === "boleto") { processarBoleto() }</code><br>Adicionar cartão exige editar essa classe — e pode quebrar pix e boleto.<br><br>Com OCP + Strategy:<br><code>interface IPaymentStrategy { process(order: Order): void }</code><br><code>class PixStrategy implements IPaymentStrategy {}</code><br><code>class BoletoStrategy implements IPaymentStrategy {}</code><br>Adicionar cartão = nova classe <code>CreditCardStrategy</code>, zero toque em código existente.<br><br><strong>OCP se paga</strong> quando há variação prevista de comportamento — múltiplos gateways, formatos de export, algoritmos de cálculo.',
    tip: 'A resposta que menciona Strategy como implementação canônica do OCP + o exemplo de pagamento com extensão sem modificação diferencia pleno de junior.',
  },
  {
    level: 'Senior',
    q: 'O que é o Liskov Substitution Principle (LSP)? Como herança pode violá-lo?',
    a: '<strong>LSP</strong>: uma instância de subclasse deve poder substituir a classe base sem quebrar o comportamento do programa. Se <code>B extends A</code>, onde quer que <code>A</code> seja aceita, <code>B</code> também deve funcionar corretamente.<br><br><strong>Violação clássica — Rectangle/Square:</strong><br><code>class Rectangle { setWidth(w); setHeight(h) }</code><br><code>class Square extends Rectangle { setWidth(w) { super.setWidth(w); super.setHeight(w) } }</code><br>Código que assume <code>rect.setWidth(5); rect.setHeight(3)</code> → área = 15 quebra com Square (área = 9).<br><br><strong>Outro exemplo: NotImplementedException:</strong><br><code>class Bird { fly() {} }</code><br><code>class Ostrich extends Bird { fly() { throw new Error("Avestruz não voa!") } }</code><br>Qualquer código que chame <code>bird.fly()</code> em loop quebra com Ostrich.<br><br><strong>Solução LSP:</strong> composição > herança. Segregue interfaces — <code>IFlyable</code>, <code>IRunnable</code>. Ostrich implementa IRunnable, não IFlyable.',
    tip: 'Rectangle/Square é o exemplo canônico. Mas a armadilha NotImplementedException em herança acontece em código real com muito mais frequência — mencioná-la mostra experiência prática.',
  },
  {
    level: 'Pleno',
    q: 'O que é o Interface Segregation Principle (ISP)? Como uma "interface gorda" o viola?',
    a: '<strong>ISP</strong>: clientes não devem ser forçados a depender de interfaces que não usam. Interfaces granulares são melhores que uma interface monolítica.<br><br><strong>Interface gorda (violação):</strong><br><code>interface IWorker { work(): void; eat(): void; sleep(): void }</code><br><code>class Robot implements IWorker { eat() { throw new Error("Robot não come") } }</code><br>Robot é forçado a implementar <code>eat()</code> mesmo não tendo esse comportamento.<br><br><strong>Solução ISP:</strong><br><code>interface IWorkable { work(): void }</code><br><code>interface IFeedable { eat(): void; sleep(): void }</code><br><code>class Robot implements IWorkable {}</code><br><code>class Human implements IWorkable, IFeedable {}</code><br><br><strong>ISP + testes:</strong> interfaces menores = mocks menores. Se você precisa criar um mock com 8 métodos para testar uma função que usa apenas 2, isso é ISP gritando.',
    tip: 'Mencionar "interfaces menores = mocks menores" conecta ISP à dor real de testes. Entrevistadores seniores apreciam essa ligação prática.',
  },
  {
    level: 'Senior',
    q: 'O que é o Dependency Inversion Principle (DIP)? Como ele difere de injeção de dependência?',
    a: '<strong>DIP</strong>: módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações. Abstrações não dependem de detalhes — detalhes dependem de abstrações.<br><br><strong>DIP é um princípio de design</strong> — diz o que evitar (dependência de concreto).<br><strong>Injeção de Dependência (DI) é um mecanismo</strong> — diz como entregar a dependência (construtor, setter, parâmetro).<br><br><strong>Violação DIP:</strong><br><code>class OrderService { private repo = new PrismaOrderRepository() }</code><br>Alto nível (OrderService) depende de detalhe (Prisma). Trocar banco = editar OrderService.<br><br><strong>Com DIP:</strong><br><code>class OrderService { constructor(private repo: IOrderRepository) {} }</code><br>OrderService depende da abstração (IOrderRepository). Quem injeta a implementação concreta é o container de DI (NestJS, tsyringe). Trocar banco = trocar implementação no módulo de composição.<br><br><strong>Resultado:</strong> testes usam FakeOrderRepository em memória — zero banco.',
    tip: 'A distinção DIP (princípio) vs DI (mecanismo) é o que diferencia quem entendeu de quem usa "DI" e "DIP" como sinônimos.',
  },
  {
    level: 'Senior',
    q: 'Como SOLID e Clean Architecture se relacionam?',
    a: '<strong>Clean Architecture é a aplicação estrutural de SOLID no nível de arquitetura:</strong><br><br>• <strong>SRP</strong> → cada camada tem um motivo único de mudança (entity: regra de negócio, adapter: detalhe de infra)<br>• <strong>OCP</strong> → troca de banco/framework sem tocar o domínio. Adicionar novo adapter sem modificar use case<br>• <strong>LSP</strong> → qualquer adapter pode substituir outro (PrismaRepo substitui FakeRepo sem quebrar o use case)<br>• <strong>ISP</strong> → ports granulares: IOrderRepository em vez de IGenericRepository com 30 métodos<br>• <strong>DIP</strong> → a Dependency Rule inteira é DIP aplicado em escala: use case define port (abstração), infra implementa (detalhe)<br><br>A Dependency Rule da Clean Arch é DIP elevado à regra absoluta de arquitetura. SOLID é o fundamento que torna Clean Arch possível — e coerente.',
    tip: 'Mapear cada letra de SOLID para uma regra concreta de Clean Arch mostra maturidade arquitetural. Quem faz isso em entrevista demonstra que internalizou os dois juntos.',
  },
  {
    level: 'Senior',
    q: 'Quando NÃO aplicar SOLID? Qual o risco de overengineering?',
    a: '<strong>SOLID tem custo de complexidade acidental.</strong> Em contextos errados, cria teatro arquitetural sem benefício real.<br><br><strong>Sinais de overengineering via SOLID:</strong><br>• Interface para toda classe, mesmo sem segunda implementação prevista<br>• Strategy para lógica que nunca vai variar (só tem um "tipo")<br>• Hierarquia de herança profunda para variações simples (basta enum)<br>• 5 arquivos para uma função de 3 linhas<br>• "Posso precisar no futuro" como única justificativa<br><br><strong>Regra prática:</strong> SOLID brilha quando há variação real ou prevista com justificativa concreta:<br>• Múltiplos gateways de pagamento → OCP + Strategy se paga<br>• Troca provável de banco → DIP se paga<br>• Classe com 600 linhas e 12 dependências → SRP se paga<br><br><strong>YAGNI > SOLID</strong> em MVP e código simples sem variação. Refatore para SOLID quando sentir a dor de não ter aplicado.',
    tip: 'Saber quando não aplicar SOLID diferencia sênior de pleno. A resposta honesta com exemplos concretos é mais valiosa do que defender SOLID em qualquer contexto.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre composição e herança no contexto de LSP e OCP?',
    a: '<strong>Herança</strong>: "é um" (is-a). Subclasse compartilha tipo com a base. Obriga a honrar o contrato do LSP — qualquer comportamento inesperado quebra o princípio.<br><br><strong>Composição</strong>: "tem um" (has-a). Classe usa outra, sem hierarquia de tipos. Não precisa honrar substituição.<br><br><strong>Por que composição frequentemente vence:</strong><br>• LSP com herança profunda é frágil — herança cria acoplamento rígido entre base e subclasse<br>• OCP via herança gera hierarquias complexas (Strategy via composição é mais limpo)<br>• Teste de herança exige entender a cadeia inteira; composição isola<br><br><strong>Regra de ouro:</strong> prefira composição a herança exceto quando a relação genuinamente é "é um" e o contrato da base pode ser honrado totalmente.<br><br>Na prática: interfaces + composição implementam OCP e respeitam LSP naturalmente. Herança deve ser reservada para casos onde o polimorfismo de tipo é fundamental.',
    tip: 'Mencionar que interfaces + composição implementam OCP sem risco de LSP é a resposta que mostra que você conectou os dois princípios na prática.',
  },
  {
    level: 'Senior',
    q: 'Como escrever testes que detectam violações de SOLID?',
    a: '<strong>Cada violação SOLID gera sintomas de teste previsíveis:</strong><br><br><strong>SRP:</strong> se um teste precisa de mais de 3-4 mocks diferentes, a classe tem responsabilidades demais<br><br><strong>OCP:</strong> se adicionar um novo "tipo" exige modificar testes existentes (não apenas adicionar novos), há if/switch com OCP violado<br><br><strong>LSP:</strong> se um teste com subclasse retorna resultado diferente do teste com a base (quando deveria substituir), LSP está quebrado<br><br><strong>ISP:</strong> se um mock precisa implementar 8 métodos mas o teste usa apenas 2, a interface está gorda<br><br><strong>DIP:</strong> se o teste não pode substituir uma dependência sem mudar a classe testada (porque o new está embutido), DIP está violado<br><br><strong>Diagnóstico rápido:</strong> se escrever o teste está difícil, o design está errado. Dificuldade de teste é SOLID feedback — não problema de teste.',
    tip: 'A frase "dificuldade de teste é SOLID feedback" é memorável e verdadeira. Conectar TDD a SOLID demonstra maturidade de processo.',
  },
  {
    level: 'Pleno',
    q: 'Como NestJS implementa DIP? Explique o mecanismo de injeção.',
    a: '<strong>NestJS usa um container IoC</strong> (Inversion of Control) que resolve dependências automaticamente via metadados de TypeScript.<br><br><strong>Implementação DIP em NestJS:</strong><br>1. Define a abstração: <code>abstract class IUserRepository { abstract findById(id: string): Promise<User | null> }</code><br>2. Define o token: <code>const USER_REPO = Symbol("IUserRepository")</code><br>3. Implementa o detalhe: <code>@Injectable() class PrismaUserRepository implements IUserRepository</code><br>4. Registra no módulo: <code>{ provide: USER_REPO, useClass: PrismaUserRepository }</code><br>5. Use case recebe: <code>@Inject(USER_REPO) private repo: IUserRepository</code><br>6. Teste troca: <code>{ provide: USER_REPO, useClass: FakeUserRepository }</code><br><br><strong>Detalhe crítico:</strong> TypeScript apaga interfaces em runtime. Use <code>Symbol</code> ou classe abstrata como token de injeção — não a interface em si.',
    tip: 'O detalhe que TypeScript apaga interfaces em runtime (e a solução com Symbol ou abstract class) é o diferencial de quem aplicou DI em NestJS real.',
  },
  {
    level: 'Senior',
    q: 'O que é o princípio de substituição de Liskov na prática com TypeScript? Como garantir compliance?',
    a: '<strong>LSP em TypeScript:</strong> o sistema de tipos ajuda mas não garante. A checagem é comportamental, não apenas estrutural.<br><br><strong>O que o TypeScript garante:</strong> que a subclasse tem todos os membros da base com tipos compatíveis. Mas não que o comportamento é honrado.<br><br><strong>O que TypeScript não garante (violação comportamental):</strong><br>• Subclasse lança exceção em método que a base não lança<br>• Pré-condições mais restritas na subclasse (base aceita qualquer string, subclasse só aceita email)<br>• Pós-condições mais fracas (base garante retorno não-nulo, subclasse pode retornar null)<br><br><strong>Como garantir compliance:</strong><br>• Testes de substituição: escreva testes que rodam com a base e passam com qualquer subclasse<br>• Design by Contract: documente pré/pós-condições nas interfaces<br>• Prefira composição quando o contrato não pode ser totalmente honrado<br>• Use <code>readonly</code> e tipos estritos para reduzir violações acidentais',
    tip: 'Distinguir conformidade estrutural (TypeScript checa) de conformidade comportamental (só testes e design garantem) mostra profundidade real com LSP.',
  },
  {
    level: 'Pleno',
    q: 'Como o padrão Factory Method se relaciona com OCP?',
    a: '<strong>Factory Method implementa OCP</strong> ao encapsular a criação de objetos: novas variações de produto se adicionam criando novas factories, sem modificar o código cliente que usa os produtos.<br><br><strong>Exemplo:</strong><br><code>abstract class NotificationFactory { abstract create(): INotification }</code><br><code>class EmailFactory extends NotificationFactory { create() { return new EmailNotification() } }</code><br><code>class SMSFactory extends NotificationFactory { create() { return new SMSNotification() } }</code><br>Adicionar PushNotification = nova classe PushFactory. O código cliente nunca muda.<br><br><strong>Sem Factory Method:</strong><br><code>if (type === "email") return new Email(); else if (type === "sms") return new SMS()</code><br>Adicionar push = editar esse switch. OCP violado.<br><br><strong>Quando vale:</strong> quando a variação de criação é real e recorrente. Factory para código que sempre tem uma implementação é overengineering.',
    tip: 'Factory Method + OCP é um elo concreto entre design patterns e SOLID. Mostrar o exemplo do switch vs factory demonstra que você conecta os dois.',
  },
  {
    level: 'Pleno',
    q: 'Como identificar e refatorar uma violação de ISP em uma interface existente?',
    a: '<strong>Identificação de violação ISP:</strong><br>• Implementação tem método com <code>throw new Error("not implemented")</code> ou corpo vazio<br>• Você cria um mock enorme para testar algo que usa apenas 2 métodos da interface<br>• A interface tem métodos de contextos diferentes (CRUD + notificação + relatório na mesma interface)<br>• Renomear a interface exigiria dois nomes diferentes para cobrir o que ela faz<br><br><strong>Processo de refatoração:</strong><br>1. Liste todos os métodos da interface<br>2. Agrupe por coesão semântica (leitura vs escrita, persistência vs notificação)<br>3. Extraia uma interface por grupo<br>4. Atualize implementações para usar interfaces específicas<br>5. Atualize clientes para depender apenas da interface que usam<br><br><strong>Exemplo:</strong> <code>IUserService { findById, save, sendWelcomeEmail, generateReport }</code> → quebrar em <code>IUserRepository</code>, <code>IUserNotifier</code>, <code>IUserReportGenerator</code>.',
    tip: 'O processo de refatoração passo a passo é o que diferencia quem sabe o princípio de quem consegue aplicá-lo. Mostre o processo, não só o resultado.',
  },
  {
    level: 'Senior',
    q: 'Qual a relação entre SOLID e coesão/acoplamento?',
    a: '<strong>SOLID é uma operacionalização de coesão alta + acoplamento baixo.</strong> Cada princípio ataca uma dimensão específica:<br><br><strong>Coesão (quão relacionadas são as responsabilidades de um módulo):</strong><br>• <strong>SRP</strong>: força coesão ao definir que um módulo só deve ter razões relacionadas a um ator<br>• <strong>ISP</strong>: força coesão nas interfaces — só métodos do mesmo contexto juntos<br><br><strong>Acoplamento (quão dependente um módulo é de outro):</strong><br>• <strong>OCP</strong>: reduz acoplamento de mudança — extensão não exige modificar clientes existentes<br>• <strong>LSP</strong>: garante que o acoplamento via polimorfismo é seguro — subclasse pode substituir<br>• <strong>DIP</strong>: reduz acoplamento a concreto — módulos dependem de abstrações, não de implementações<br><br><strong>Diagnóstico rápido:</strong> se você aplica todos os cinco e ainda sente acoplamento alto, verifique os limites de módulo (Bounded Contexts se for DDD).',
    tip: 'Conectar cada letra de SOLID a coesão ou acoplamento especificamente é uma resposta sênior que demonstra visão sistêmica de design.',
  },
  {
    level: 'Senior',
    q: 'Como DIP se aplica em arquitetura de microservices? Quais abstrações são relevantes?',
    a: '<strong>DIP no nível de serviço</strong>: um serviço não deve depender de implementação concreta de outro serviço — deve depender de um contrato (interface).<br><br><strong>Abstrações relevantes em microservices:</strong><br>• <strong>Message Contract</strong>: o produtor e o consumidor dependem do schema da mensagem (abstração), não da implementação do outro serviço<br>• <strong>Service Interface / OpenAPI spec</strong>: consumidor depende do contrato HTTP, não do código interno do servidor<br>• <strong>Anti-Corruption Layer (ACL)</strong>: serviço define sua própria representação de dados de terceiros (abstração interna), protegendo-se de mudanças externas<br>• <strong>Event Schema Registry</strong>: Kafka/EventBridge com schema registry = DIP no nível de mensagens<br><br><strong>Violação comum:</strong> serviço A importa biblioteca do serviço B (shared kernel não intencional). Mudança interna em B quebra A sem API change.<br><br>DIP em microservices = dependa do contrato publicado, nunca da implementação interna.',
    tip: 'Extrapolar DIP para o nível de serviço (ACL, message contract) demonstra que você entende o princípio além de OOP em arquivo único.',
  },
  {
    level: 'Pleno',
    q: 'Como SRP e o princípio de um único nível de abstração se relacionam?',
    a: '<strong>Single Level of Abstraction Principle (SLAP)</strong>: dentro de um método/função, todas as operações devem estar no mesmo nível de abstração. Misturar alto nível (regra de negócio) com baixo nível (SQL direto, manipulação de bytes) é uma forma de violação de SRP no nível de método.<br><br><strong>Exemplo de violação SLAP + SRP:</strong><br><code>async placeOrder(data: OrderInput) {<br>&nbsp;&nbsp;// regra de negócio<br>&nbsp;&nbsp;const discount = data.total > 1000 ? 0.1 : 0<br>&nbsp;&nbsp;// SQL puro misturado<br>&nbsp;&nbsp;await db.query("INSERT INTO orders ...")<br>&nbsp;&nbsp;// SMTP direto<br>&nbsp;&nbsp;await transporter.sendMail(...)<br>}</code><br><br>Um método que mistura business logic, SQL e SMTP tem três responsabilidades e três níveis de abstração ao mesmo tempo.<br><br><strong>Refatoração:</strong> cada nível de abstração vira seu próprio método — e depois sua própria classe.',
    tip: 'SLAP é um corolário prático de SRP no nível de método. Mencioná-lo mostra que você aplica o princípio na granularidade certa — não só no nível de classe.',
  },
  {
    level: 'Senior',
    q: 'Como SOLID se relaciona com TDD? Por que código SOLID é mais fácil de testar?',
    a: '<strong>SOLID e TDD se reforçam mutuamente.</strong> Código que respeita SOLID é quase sempre testável por design:<br><br>• <strong>SRP</strong>: classes com responsabilidade única têm menos dependências → mocks menores, testes focados<br>• <strong>OCP</strong>: extensão via nova classe → novo teste para nova classe, sem modificar testes existentes<br>• <strong>LSP</strong>: substituição segura → o mesmo teste roda para base e subclasse (contrato garantido)<br>• <strong>ISP</strong>: interfaces granulares → mocks implementam apenas os métodos que o teste usa<br>• <strong>DIP</strong>: dependência de abstração → injeção de fake na construção → teste sem banco, sem HTTP, sem email<br><br><strong>A direção inversa também vale:</strong> se escrever o teste está difícil → o design violou SOLID. Dificuldade de teste é diagnóstico de design, não problema de teste.<br><br>TDD tem esse efeito colateral benéfico: força você a aplicar SOLID para poder escrever testes rápidos.',
    tip: '"Dificuldade de teste é diagnóstico de design" — é a frase que conecta TDD e SOLID de forma memorável. Use em entrevistas.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre SRP e SLAP (Single Level of Abstraction)?',
    a: '<strong>SRP</strong> atua no nível de <em>classe/módulo</em>: define que uma classe deve mudar por um único motivo (um ator).<br><br><strong>SLAP</strong> atua no nível de <em>método/função</em>: define que todas as operações dentro de um método devem estar no mesmo nível de abstração.<br><br><strong>São complementares:</strong><br>• SRP impede que uma classe agregue responsabilidades de múltiplos atores<br>• SLAP impede que um método misture lógica de negócio com detalhe técnico<br><br><strong>Exemplo SLAP:</strong> um método que chama <code>order.calculate()</code> (alto nível) e depois <code>db.query("INSERT...")</code> (baixo nível) viola SLAP — mesmo que as classes estejam separadas.<br><br>A refatoração SLAP usual: extraia o baixo nível para método privado com nome descritivo, ou melhor, para classe própria — o que frequentemente coincide com SRP.',
    tip: 'Saber que SRP é nível de classe e SLAP é nível de método demonstra que você entende granularidade de design — não só aplica princípios no nível macro.',
  },
  {
    level: 'Pleno',
    q: 'Como você explicaria SOLID para um desenvolvedor júnior em 5 minutos?',
    a: '<strong>Analogia de cidade:</strong><br><br>• <strong>S (SRP)</strong>: padaria faz pão, farmácia vende remédio. Uma loja não faz tudo — mudança no pão não afeta a farmácia.<br><br>• <strong>O (OCP)</strong>: para adicionar nova loja à rua, você não destrói as existentes — apenas constrói a nova. Software: nova funcionalidade = novo arquivo, não editar o antigo.<br><br>• <strong>L (LSP)</strong>: se um veículo pode usar a garagem, qualquer veículo do mesmo "tipo" deve funcionar ali — não apenas o modelo específico. Subclasse deve honrar o contrato da base.<br><br>• <strong>I (ISP)</strong>: balcão de atendimento separado por assunto — não força o cliente de pão a ouvir sobre medicamentos. Interface específica para cada cliente.<br><br>• <strong>D (DIP)</strong>: plug padrão de tomada — seu celular não depende de qual usina gera a energia. Depende da interface (tomada), não do detalhe (usina específica).<br><br>Cada princípio resolve uma forma específica de acoplamento que torna código difícil de mudar e testar.',
    tip: 'Analogias claras demonstram domínio. Entrevistadores seniores apreciam quem consegue simplificar sem perder precisão — é sinal de que você ensina bem.',
  },
  {
    level: 'Senior',
    q: 'SOLID é suficiente para um bom design? O que mais é necessário?',
    a: '<strong>SOLID é necessário mas não suficiente.</strong> É o fundamento de design OO — não um sistema completo de arquitetura.<br><br><strong>O que SOLID não cobre:</strong><br>• <strong>Domínio de negócio</strong>: onde colocar regras de negócio, como modelar agregates, bounded contexts → DDD<br>• <strong>Organização em camadas</strong>: separação entre regra de aplicação e infra → Clean Architecture / Hexagonal<br>• <strong>Comunicação entre serviços</strong>: contratos, versionamento, circuit breaker → Design de APIs, microservices<br>• <strong>Performance</strong>: SOLID não implica eficiência de query, cache, concorrência<br>• <strong>Qualidade global</strong>: legibilidade, nomes, simplicidade → Clean Code, YAGNI, DRY<br><br><strong>Hierarquia:</strong> SOLID é base. Sobre ele: Clean Code (linha a linha), Clean Architecture (estrutura), DDD (domínio), System Design (escala).<br><br>Dominar SOLID sem os outros torna você ótimo na granularidade de classe mas cego para design de sistema.',
    tip: 'Posicionar SOLID na hierarquia (base, não teto) demonstra visão sistêmica. O entrevistador sênior quer ver que você sabe onde SOLID termina e o que começa.',
  },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'S — ATOR (SRP)',
    trick: 'Ator Tem Único Responsável',
    expansion: [
      ['A', 'Ator — quem pediu essa mudança? Financeiro? Marketing?'],
      ['T', 'Tem — uma classe tem um único ator que a faz mudar'],
      ['U', 'Único — se dois atores pedem mudanças, são duas classes'],
      ['R', 'Responsável — responsabilidade = motivo de mudança, não tamanho'],
    ],
    explanation: 'SRP não é "faça classes pequenas" — é "um ator, um motivo de mudança". A pergunta certa é sempre: quem pediu isso?',
    example: 'OrderService com email + SQL + PDF tem 3 atores (marketing, TI, fiscal). → OrderNotifier, OrderRepository, InvoiceGenerator.',
    why: 'God Class é o anti-pattern mais frequente em entrevistas de code review. ATOR ajuda a lembrar o critério correto de separação.',
  },
  {
    label: 'O — FECHAR (OCP)',
    trick: 'Fechar para Edição, Criar para Adição, Herdar ou Realizar',
    expansion: [
      ['F', 'Fechar — feche a classe para modificação quando estiver estável'],
      ['E', 'Extensão — abra para extensão via herança ou implementação'],
      ['C', 'Criar — novo comportamento = novo arquivo, não editar o antigo'],
      ['H', 'Herdar ou Realizar — subclasse ou implementação de interface'],
      ['A', 'Adicionar — Strategy, Decorator, Observer = OCP em ação'],
      ['R', 'Risco — modificar código existente pode quebrar quem o usa'],
    ],
    explanation: 'OCP se paga quando há variação prevista. Implementar Strategy para algo com uma implementação única é overengineering.',
    example: 'PaymentProcessor com if/else para Pix/Boleto/Cartão. → IPaymentStrategy + PixStrategy + BoletoStrategy + CardStrategy.',
    why: 'OCP via Strategy é pergunta clássica de entrevista. FECHAR conecta o princípio ao padrão de implementação mais comum.',
  },
  {
    label: 'L — HONRA (LSP)',
    trick: 'Herança Só Quando o Contrato é Honrado',
    expansion: [
      ['H', 'Herança — use herança apenas quando "é um" verdadeiro'],
      ['O', 'Ou — ou composição, quando contrato não pode ser honrado'],
      ['N', 'Não lança — subclasse não lança exceção que base não lança'],
      ['R', 'Restrição — subclasse não restringe mais que a base'],
      ['A', 'Alternativa — prefira interface + composição quando em dúvida'],
    ],
    explanation: 'LSP quebra quando subclasse surpreende quem usa a base. NotImplementedException é o sintoma mais claro.',
    example: 'Ostrich extends Bird { fly() { throw new Error() } } — código que chama bird.fly() explode. → IFlyable separado, Ostrich não implementa.',
    why: 'Herança com NotImplementedException é prática comum em codebases grandes. HONRA ajuda a lembrar o critério correto antes de extender.',
  },
  {
    label: 'I — FAT (ISP)',
    trick: 'Fat Interface — Alguém Sofre com métodos que Não usa',
    expansion: [
      ['F', 'Fat — interface gorda força implementação de métodos inúteis'],
      ['A', 'Alguém sofre — quem implementa é forçado a mentir (throw/vazio)'],
      ['T', 'Test pain — mock com 8 métodos para testar 2 = ISP violado'],
    ],
    explanation: 'ISP se diagnostica pelo tamanho dos mocks. Se o mock implementa mais que o teste usa, a interface está gorda.',
    example: 'IWorker { work, eat, sleep } → Robot.eat() { throw Error }. → IWorkable { work } + IFeedable { eat, sleep }.',
    why: 'Interfaces gordas são comuns em código legado. FAT é a âncora para lembrar o sintoma e a solução.',
  },
  {
    label: 'D — DIP vs DI (DIP)',
    trick: 'Dependa de Interface, Princípio — a Implementação entra por Injeção',
    expansion: [
      ['D', 'Dependa — dependa sempre da abstração (interface), não do concreto'],
      ['I', 'Interface — defina o contrato no módulo de alto nível'],
      ['P', 'Princípio — DIP é o design; DI é o mecanismo de entrega'],
      ['D', 'Detalhe implementa — a infra concreta implementa a interface'],
      ['I', 'Injeção — container de DI (NestJS, tsyringe) entrega o concreto'],
    ],
    explanation: 'DIP diz o que evitar (dependência de concreto). DI diz como entregar a dependência. São complementares, não sinônimos.',
    example: 'OrderService depende de IOrderRepository (DIP). NestJS injeta PrismaOrderRepository em produção e FakeOrderRepository no teste (DI).',
    why: 'A confusão DIP vs DI é comum. A distinção é o que diferencia quem entendeu o princípio de quem só usa um framework.',
  },
]

// ── Anti-patterns ─────────────────────────────────────────────────────────────

const PDF_ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'God Class — SRP violado',
    badDesc: 'Uma classe faz validação, persistência, email e geração de PDF',
    badCode: [
      { t: 'class OrderService {', c: '#ef4444' },
      { t: '  async place(input: Input) {', c: '#ef4444' },
      { t: '    // 1. validar campos' },
      { t: '    // 2. calcular frete via API Correios', c: '#ef4444' },
      { t: '    // 3. aplicar desconto', c: '#ef4444' },
      { t: '    // 4. INSERT no Postgres via SQL puro', c: '#ef4444' },
      { t: '    // 5. enviar email SMTP', c: '#ef4444' },
      { t: '    // 6. gerar PDF nota fiscal', c: '#ef4444' },
      { t: '  }  // 600+ linhas, 12 dependências', c: '#ef4444' },
      { t: '}' },
    ],
    goodDesc: 'Uma responsabilidade por classe — Use Case orquestra',
    goodCode: [
      { t: 'class OrderValidator { validate(input) }', c: '#4ade80' },
      { t: 'class ShippingCalculator { calculate(order) }', c: '#4ade80' },
      { t: 'class DiscountPolicy { apply(order) }', c: '#4ade80' },
      { t: 'class OrderRepository { save(order) }', c: '#4ade80' },
      { t: 'class OrderNotifier { send(order) }', c: '#4ade80' },
      { t: 'class InvoiceGenerator { generate(order) }', c: '#4ade80' },
      { t: '' },
      { t: 'class PlaceOrderUseCase {', c: '#4ade80' },
      { t: '  // orquestra as 6 classes acima', c: '#4ade80' },
      { t: '}' },
    ],
    why: 'God Class viola SRP porque tem múltiplos atores pedindo mudanças. Teste exige mock de 12 deps. Mudança em PDF afeta cálculo de frete. Cada classe separada testa em isolamento.',
  },
  {
    title: 'Switch por tipo — OCP violado',
    badDesc: 'Adicionar novo tipo de pagamento exige editar código existente',
    badCode: [
      { t: 'class PaymentProcessor {', c: '#ef4444' },
      { t: '  process(order: Order, type: string) {', c: '#ef4444' },
      { t: '    if (type === "pix") {', c: '#ef4444' },
      { t: '      // lógica Pix', c: '#ef4444' },
      { t: '    } else if (type === "boleto") {', c: '#ef4444' },
      { t: '      // lógica Boleto', c: '#ef4444' },
      { t: '    }', c: '#ef4444' },
      { t: '    // Adicionar cartão = editar aqui ← OCP violado', c: '#ef4444' },
      { t: '  }', c: '#ef4444' },
      { t: '}' },
    ],
    goodDesc: 'Strategy: novo tipo = nova classe, zero toque no código existente',
    goodCode: [
      { t: 'interface IPaymentStrategy {', c: '#4ade80' },
      { t: '  process(order: Order): void', c: '#4ade80' },
      { t: '}', c: '#4ade80' },
      { t: '' },
      { t: 'class PixStrategy implements IPaymentStrategy {}', c: '#4ade80' },
      { t: 'class BoletoStrategy implements IPaymentStrategy {}', c: '#4ade80' },
      { t: '// Adicionar cartão:', c: '#4ade80' },
      { t: 'class CreditCardStrategy implements IPaymentStrategy {}', c: '#4ade80' },
      { t: '// Zero toque em Pix e Boleto ✓', c: '#4ade80' },
    ],
    why: 'Switch/if-chain viola OCP porque qualquer extensão exige modificação. Bugs de regressão são riscos reais. Strategy isola cada variação — teste unitário por classe.',
  },
  {
    title: 'NotImplementedException — LSP violado',
    badDesc: 'Subclasse lança exceção em método que a base define',
    badCode: [
      { t: 'class Bird {', c: '#ef4444' },
      { t: '  fly(): void { /* implementação padrão */ }', c: '#ef4444' },
      { t: '}', c: '#ef4444' },
      { t: '' },
      { t: 'class Ostrich extends Bird {', c: '#ef4444' },
      { t: '  fly(): void {', c: '#ef4444' },
      { t: '    throw new Error("Avestruz não voa!") // ← LSP violado', c: '#ef4444' },
      { t: '  }', c: '#ef4444' },
      { t: '}', c: '#ef4444' },
      { t: '// Código que itera Bird[] e chama .fly() explode', c: '#ef4444' },
    ],
    goodDesc: 'Segregar interfaces — Ostrich não implementa IFlyable',
    goodCode: [
      { t: 'interface IFlyable { fly(): void }', c: '#4ade80' },
      { t: 'interface IRunnable { run(): void }', c: '#4ade80' },
      { t: '' },
      { t: 'class Eagle implements IFlyable {', c: '#4ade80' },
      { t: '  fly() { /* voa de verdade */ }', c: '#4ade80' },
      { t: '}', c: '#4ade80' },
      { t: '' },
      { t: 'class Ostrich implements IRunnable {', c: '#4ade80' },
      { t: '  run() { /* corre de verdade */ }', c: '#4ade80' },
      { t: '}', c: '#4ade80' },
    ],
    why: 'LSP garante que herança é segura. NotImplementedException é o sintoma mais claro de que a herança foi escolha errada. Interfaces segregadas + composição resolvem sem violar o princípio.',
  },
  {
    title: 'Interface gorda — ISP violado',
    badDesc: 'Robot forçado a implementar métodos humanos irrelevantes',
    badCode: [
      { t: 'interface IWorker {', c: '#ef4444' },
      { t: '  work(): void', c: '#ef4444' },
      { t: '  eat(): void   // Robot não come!', c: '#ef4444' },
      { t: '  sleep(): void // Robot não dorme!', c: '#ef4444' },
      { t: '}', c: '#ef4444' },
      { t: '' },
      { t: 'class Robot implements IWorker {', c: '#ef4444' },
      { t: '  work() { /* ok */ }', c: '#ef4444' },
      { t: '  eat() { throw new Error("n/a") }  // mentira', c: '#ef4444' },
      { t: '  sleep() { throw new Error("n/a") } // mentira', c: '#ef4444' },
      { t: '}' },
    ],
    goodDesc: 'Interfaces granulares — cada cliente depende só do que usa',
    goodCode: [
      { t: 'interface IWorkable { work(): void }', c: '#4ade80' },
      { t: 'interface IFeedable { eat(): void; sleep(): void }', c: '#4ade80' },
      { t: '' },
      { t: 'class Robot implements IWorkable {', c: '#4ade80' },
      { t: '  work() { /* trabalha */ }', c: '#4ade80' },
      { t: '}', c: '#4ade80' },
      { t: '' },
      { t: 'class Human implements IWorkable, IFeedable {', c: '#4ade80' },
      { t: '  work() { /* trabalha */ }', c: '#4ade80' },
      { t: '  eat() { /* come */ }', c: '#4ade80' },
      { t: '  sleep() { /* dorme */ }', c: '#4ade80' },
      { t: '}' },
    ],
    why: 'Interface gorda força implementações vazias ou com throw. Mocks crescem desnecessariamente. ISP segregado = mock só com o que o teste usa.',
  },
  {
    title: 'new Concreto embutido — DIP violado',
    badDesc: 'OrderService instancia Prisma diretamente — impossível de testar',
    badCode: [
      { t: 'class OrderService {', c: '#ef4444' },
      { t: '  private repo = new PrismaOrderRepository() // ← DIP violado', c: '#ef4444' },
      { t: '' },
      { t: '  async create(input: Input) {', c: '#ef4444' },
      { t: '    const order = new Order(input)', c: '#ef4444' },
      { t: '    await this.repo.save(order) // acoplado a Prisma', c: '#ef4444' },
      { t: '  }', c: '#ef4444' },
      { t: '}', c: '#ef4444' },
      { t: '// Teste precisa de banco real — lento e frágil', c: '#ef4444' },
    ],
    goodDesc: 'Dependa da abstração — DI injeta o concreto em runtime',
    goodCode: [
      { t: 'class OrderService {', c: '#4ade80' },
      { t: '  constructor(', c: '#4ade80' },
      { t: '    private repo: IOrderRepository // abstração', c: '#4ade80' },
      { t: '  ) {}', c: '#4ade80' },
      { t: '' },
      { t: '  async create(input: Input) {', c: '#4ade80' },
      { t: '    const order = new Order(input)', c: '#4ade80' },
      { t: '    await this.repo.save(order)', c: '#4ade80' },
      { t: '  }', c: '#4ade80' },
      { t: '}', c: '#4ade80' },
      { t: '// Teste injeta FakeOrderRepository — sem banco', c: '#4ade80' },
    ],
    why: 'new concreto embutido acopla o módulo de alto nível ao detalhe. Teste exige banco real. DIP com DI permite injetar Fake em teste e Prisma em produção.',
  },
]

// ── Comparativo ───────────────────────────────────────────────────────────────

const COMP_OPTIONS: CompOption[] = [
  { name: 'SOLID', color: '#FF6F00' },
  { name: 'GRASP', color: '#6366f1' },
  { name: 'DRY/YAGNI', color: '#14b8a6' },
  { name: 'GoF Patterns', color: '#f59e0b' },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Nível de atuação',
    values: {
      SOLID: 'Classe / Módulo',
      GRASP: 'Classe / Responsabilidade',
      'DRY/YAGNI': 'Linha / Função / Módulo',
      'GoF Patterns': 'Solução recorrente de design',
    },
    winner: 'SOLID',
  },
  {
    criterion: 'Quando aprender',
    values: {
      SOLID: 'Antes de qualquer framework',
      GRASP: 'Junto com SOLID (complementar)',
      'DRY/YAGNI': 'Sempre — desde o início',
      'GoF Patterns': 'Após dominar SOLID e OOP',
    },
    winner: 'DRY/YAGNI',
  },
  {
    criterion: 'Relação com testes',
    values: {
      SOLID: 'Direta — cada princípio impacta testabilidade',
      GRASP: 'Indireta — foca em responsabilidade',
      'DRY/YAGNI': 'Indireta — reduz duplicação de lógica',
      'GoF Patterns': 'Varia — alguns padrões facilitam mock',
    },
    winner: 'SOLID',
  },
  {
    criterion: 'Curva de aprendizado',
    values: {
      SOLID: 'Média — 5 princípios com nuances',
      GRASP: 'Alta — 9 padrões de responsabilidade',
      'DRY/YAGNI': 'Baixa — dois princípios simples',
      'GoF Patterns': 'Alta — 23 padrões com motivação',
    },
    winner: 'DRY/YAGNI',
  },
  {
    criterion: 'Trade-off mais comum',
    values: {
      SOLID: 'Overengineering — interface p/ cada classe',
      GRASP: 'Formalismo excessivo em código simples',
      'DRY/YAGNI': 'DRY cedo demais gera abstração prematura',
      'GoF Patterns': 'Padrão sem dor real = complexidade gratuita',
    },
    winner: 'DRY/YAGNI',
  },
  {
    criterion: 'Relação com Clean Arch / DDD',
    values: {
      SOLID: 'Fundação — Clean Arch é SOLID em escala',
      GRASP: 'Complementar — foca em coesão de responsabilidade',
      'DRY/YAGNI': 'Transversal — aplica em qualquer abordagem',
      'GoF Patterns': 'Táticos — Strategy, Adapter, Observer dentro das camadas',
    },
    winner: 'SOLID',
  },
]

// ── Builders de PDF ───────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'SOLID',
    stackLabel: 'Princípios de Design OO',
  }),

  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'SOLID',
    stackLabel: 'Princípios de Design OO',
  }),

  antipatterns: () => buildAntipatternsPdf({
    antipatterns: PDF_ANTIPATTERNS,
    accentColor: C,
    skillName: 'SOLID',
    stackLabel: 'Princípios de Design OO',
  }),

  comparative: () => buildComparativeRefPdf({
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    accentColor: C,
    skillName: 'SOLID',
    stackLabel: 'Princípios de Design OO',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function SolidPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />
        ))}
      </div>
      {open && (
        <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />
      )}
    </>
  )
}
