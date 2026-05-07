'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'

// ── Paleta DI (green) ──────────────────────────────────────────────────────────
const C      = '#22c55e'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

// ── Visual 1: Camadas de DI — do princípio ao container ───────────────────────

const DI_LAYERS: Layer[] = [
  {
    id: 'principle',
    label: 'IoC Principle',
    sublabel: 'Inversão de Controle',
    description: 'O controle de criação e wiring sai da classe e vai para fora. "Don\'t call us, we\'ll call you." O princípio geral — DI é uma das formas de implementá-lo.',
    color: '#64748b',
    icon: '💡',
    examples: ['Hollywood Principle', 'Template Method', 'Event-driven', 'DI'],
  },
  {
    id: 'di-pattern',
    label: 'DI Pattern',
    sublabel: 'Dependency Injection técnica',
    description: 'Dependências são passadas para dentro da classe (construtor, setter) em vez de criadas internamente. "New is glue" — não use new concreto no domínio.',
    color: C,
    icon: '🔧',
    examples: ['Constructor injection', 'Setter injection', 'Interface injection'],
  },
  {
    id: 'dip',
    label: 'DIP (SOLID)',
    sublabel: 'Dependency Inversion Principle',
    description: 'Módulos de alto nível não dependem de baixo nível — ambos dependem de abstrações. Injete interfaces (IOrderRepository), não implementações (PrismaOrderRepository).',
    color: '#0ea5e9',
    icon: '🔀',
    examples: ['IOrderRepository', 'IEmailSender', 'ILogger', 'IPricingStrategy'],
  },
  {
    id: 'composition-root',
    label: 'Composition Root',
    sublabel: 'Único ponto de wiring',
    description: 'O único lugar onde new concreto é permitido. Aqui você instancia tudo e monta o grafo de dependências. Em apps web: main.ts / bootstrap.',
    color: '#f59e0b',
    icon: '🏗️',
    examples: ['main.ts', 'app.module.ts', 'container.ts', 'AppFactory'],
  },
  {
    id: 'container',
    label: 'DI Container',
    sublabel: 'Automação do wiring (≥50 classes)',
    description: 'Framework que resolve o grafo de dependências automaticamente via reflection/metadata. Gerencia scopes (singleton, transient, request). NestJS, Spring, InversifyJS.',
    color: '#e0234e',
    icon: '📦',
    examples: ['NestJS @Injectable', 'Spring @Autowired', 'InversifyJS @inject', 'Awilix'],
  },
]

// ── Visual 2: Anti-patterns de DI ─────────────────────────────────────────────

const DI_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Service Locator — dependência escondida',
    wrong: [
      [{ text: 'class OrderService {', color: '#ef4444' }],
      [{ text: '  constructor(', color: '#ef4444' }],
      [{ text: '    private container: Container // ❌', color: '#ef4444' }],
      [{ text: '  ) {}', color: '#ef4444' }],
      [{ text: '  async create(dto: CreateOrderDto) {', color: '#ef4444' }],
      [{ text: '    // Dependência escondida — assinatura mente', color: '#64748b' }],
      [{ text: '    const repo = this.container.get(\'OrderRepo\')', color: '#ef4444' }],
      [{ text: '    const email = this.container.get(\'EmailSender\')', color: '#ef4444' }],
      [{ text: '  }', color: '#ef4444' }],
      [{ text: '}', color: '#ef4444' }],
    ],
    right: [
      [{ text: 'class OrderService {', color: '#22c55e' }],
      [{ text: '  constructor(', color: '#22c55e' }],
      [{ text: '    private repo: IOrderRepository, // ✅ explícito', color: '#22c55e' }],
      [{ text: '    private email: IEmailSender,    // ✅ explícito', color: '#22c55e' }],
      [{ text: '  ) {}', color: '#22c55e' }],
      [{ text: '  async create(dto: CreateOrderDto) {', color: '#22c55e' }],
      [{ text: '    // Deps visíveis — testável, type-safe', color: '#64748b' }],
      [{ text: '  }', color: '#22c55e' }],
      [{ text: '}', color: '#22c55e' }],
    ],
    why: 'Service Locator esconde dependências — assinatura do construtor não revela o que a classe precisa. Compilador não valida. Teste precisa configurar o locator inteiro. DI por construtor é a solução correta.',
  },
  {
    title: 'Request-Scoped em Singleton — data leak',
    wrong: [
      [{ text: '// TenantContext é REQUEST-scoped', color: '#64748b' }],
      [{ text: '@Injectable({ scope: Scope.REQUEST })', color: '#64748b' }],
      [{ text: 'class TenantContext { tenantId: string }', color: '#94a3b8' }],
      [{ text: '', color: '' }],
      [{ text: '// ❌ Singleton injeta request-scoped', color: '#ef4444' }],
      [{ text: '@Injectable() // DEFAULT = singleton', color: '#ef4444' }],
      [{ text: 'class ProductService {', color: '#ef4444' }],
      [{ text: '  constructor(private tenant: TenantContext) {}', color: '#ef4444' }],
      [{ text: '  // tenant preso na instância do 1º request!', color: '#ef4444' }],
      [{ text: '}', color: '#ef4444' }],
    ],
    right: [
      [{ text: '// ✅ ProductService também é request-scoped', color: '#22c55e' }],
      [{ text: '@Injectable({ scope: Scope.REQUEST })', color: '#22c55e' }],
      [{ text: 'class ProductService {', color: '#22c55e' }],
      [{ text: '  constructor(private tenant: TenantContext) {}', color: '#22c55e' }],
      [{ text: '  // Nova instância por request — seguro', color: '#64748b' }],
      [{ text: '}', color: '#22c55e' }],
      [{ text: '', color: '' }],
      [{ text: '// OU: passe tenant como parâmetro de método', color: '#22c55e' }],
      [{ text: 'class ProductService {', color: '#22c55e' }],
      [{ text: '  findAll(tenantId: string) { ... }', color: '#22c55e' }],
      [{ text: '}', color: '#22c55e' }],
    ],
    why: 'Singleton é criado uma vez e reutilizado. Se injeta um request-scoped, fica preso na instância do primeiro request. Usuário B enxerga dados do usuário A. Bug de segurança crítico.',
  },
  {
    title: 'New concreto no domínio — quebra DIP',
    wrong: [
      [{ text: 'class OrderService {', color: '#ef4444' }],
      [{ text: '  // ❌ dependência concreta fixa no código', color: '#ef4444' }],
      [{ text: '  private repo = new PrismaOrderRepository()', color: '#ef4444' }],
      [{ text: '  private email = new SendGridEmailSender()', color: '#ef4444' }],
      [{ text: '', color: '' }],
      [{ text: '  async create(dto) {', color: '#ef4444' }],
      [{ text: '    // Impossível testar sem Prisma + SendGrid reais', color: '#64748b' }],
      [{ text: '  }', color: '#ef4444' }],
      [{ text: '}', color: '#ef4444' }],
    ],
    right: [
      [{ text: 'class OrderService {', color: '#22c55e' }],
      [{ text: '  constructor(', color: '#22c55e' }],
      [{ text: '    private repo: IOrderRepository,  // abstração', color: '#22c55e' }],
      [{ text: '    private email: IEmailSender,     // abstração', color: '#22c55e' }],
      [{ text: '  ) {}', color: '#22c55e' }],
      [{ text: '  // Teste: new OrderService(fakeRepo, fakeEmail)', color: '#64748b' }],
      [{ text: '  // Prod: composition root injeta concretizações', color: '#64748b' }],
      [{ text: '}', color: '#22c55e' }],
    ],
    why: '"New is glue" — new concreto no domínio cola aquela implementação permanentemente. DIP + DI = dependa da abstração, o container injeta a implementação correta.',
  },
]

// ── Visual 3: Constructor vs Setter vs Field injection ─────────────────────────

const INJECTION_OPTIONS: ComparisonOption[] = [
  { id: 'constructor', label: 'Constructor', color: C },
  { id: 'setter',      label: 'Setter',      color: '#f59e0b' },
  { id: 'field',       label: 'Field',       color: '#ef4444' },
]

type Rating = 'excellent' | 'good' | 'fair' | 'poor' | 'na'
const r = (rating: Rating, note?: string) => ({ rating, note })

const INJECTION_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'visibilidade',
    label: 'Deps visíveis na assinatura',
    values: {
      constructor: r('excellent', 'Sim — construtor lista tudo'),
      setter:      r('fair',      'Parcialmente — setter é separado'),
      field:       r('poor',      'Não — campo anotado, deps escondidas'),
    },
  },
  {
    id: 'obrigatoriedade',
    label: 'Garante dep. presente',
    values: {
      constructor: r('excellent', 'Sim — compilador exige no new'),
      setter:      r('poor',      'Não — setter pode não ser chamado'),
      field:       r('fair',      'Somente pelo container — runtime error'),
    },
  },
  {
    id: 'testabilidade',
    label: 'Facilidade em testes',
    values: {
      constructor: r('excellent', 'new Service(fakeDep) direto'),
      setter:      r('good',      'Chamar setter antes de usar'),
      field:       r('poor',      'Precisa do container ou reflection'),
    },
  },
  {
    id: 'imutabilidade',
    label: 'Imutável após criação',
    values: {
      constructor: r('excellent', 'Sim — readonly fields'),
      setter:      r('poor',      'Não — pode ser trocado depois'),
      field:       r('fair',      'Depende do campo ser final/readonly'),
    },
  },
  {
    id: 'caso-de-uso',
    label: 'Melhor uso',
    values: {
      constructor: r('excellent', 'Dependências obrigatórias (99% dos casos)'),
      setter:      r('fair',      'Deps opcionais ou ciclos (último recurso)'),
      field:       r('poor',      'Evitar — use constructor sempre que possível'),
    },
  },
]

// ── Componente principal ───────────────────────────────────────────────────────

export default function DependencyInjectionVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'di-layers',
      title: 'Do princípio ao container',
      subtitle: 'A evolução de IoC → DI → DIP → Composition Root → Container',
      accent: C,
      component: (
        <LayerStack
          layers={DI_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns de DI',
      subtitle: 'Os 3 erros críticos — Service Locator, Scope Leak, New no Domínio',
      accent: '#ef4444',
      component: (
        <AntiPatternsGallery
          patterns={DI_ANTIPATTERNS}
          accentColor='#ef4444'
          bgColor={BG}
        />
      ),
    },
    {
      id: 'injection-types',
      title: 'Constructor × Setter × Field',
      subtitle: 'Comparação técnica dos tipos de injeção — por que constructor vence',
      accent: C,
      component: (
        <ComparisonTable
          options={INJECTION_OPTIONS}
          criteria={INJECTION_CRITERIA}
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
