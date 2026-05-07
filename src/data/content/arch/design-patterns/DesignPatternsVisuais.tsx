'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta Design Patterns (sky blue) ──────────────────────────────────────────
const C      = '#0ea5e9'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

// ── Visual 1: Qual pattern usar? — Decision Tree ──────────────────────────────

const ROOT: DTNode = {
  id: 'root',
  question: 'O problema é sobre…',
  children: [
    { label: 'Criar objetos', nodeId: 'criacional', color: '#f59e0b' },
    { label: 'Compor objetos', nodeId: 'estrutural', color: '#8b5cf6' },
    { label: 'Comunicação / comportamento', nodeId: 'comportamental', color: '#10b981' },
  ],
  color: C,
}

const NODES: Record<string, DTNode> = {
  criacional: {
    id: 'criacional',
    question: 'O que você precisa?',
    children: [
      { label: 'Objeto complexo passo a passo', nodeId: 'builder', color: '#f59e0b' },
      { label: 'Subclasse decide o tipo', nodeId: 'factory', color: '#f59e0b' },
      { label: 'Instância única global', nodeId: 'singleton', color: '#f59e0b' },
    ],
    color: '#f59e0b',
  },
  estrutural: {
    id: 'estrutural',
    question: 'O que você precisa?',
    children: [
      { label: 'Adicionar comportamento sem modificar', nodeId: 'decorator', color: '#8b5cf6' },
      { label: 'Interface incompatível', nodeId: 'adapter', color: '#8b5cf6' },
      { label: 'Simplificar subsistema complexo', nodeId: 'facade', color: '#8b5cf6' },
      { label: 'Controlar acesso ao objeto', nodeId: 'proxy', color: '#8b5cf6' },
    ],
    color: '#8b5cf6',
  },
  comportamental: {
    id: 'comportamental',
    question: 'O que você precisa?',
    children: [
      { label: 'Algoritmo intercambiável', nodeId: 'strategy', color: '#10b981' },
      { label: 'Notificar múltiplos interessados', nodeId: 'observer', color: '#10b981' },
      { label: 'Ação como objeto (undo/CQRS)', nodeId: 'command', color: '#10b981' },
      { label: 'Comportamento muda com estado', nodeId: 'state', color: '#10b981' },
    ],
    color: '#10b981',
  },
  builder: {
    id: 'builder',
    recommendation: 'Builder',
    detail: 'Objeto com muitos parâmetros opcionais. Construção passo a passo. Validação antes de criar. Muito usado em testes (TestDataBuilder).',
    color: '#f59e0b',
    icon: '🏗️',
  },
  factory: {
    id: 'factory',
    recommendation: 'Factory Method',
    detail: 'Subclasse decide qual objeto concreto criar. Evita o new concreto no código cliente. Uso com DI container: container resolve a factory.',
    color: '#f59e0b',
    icon: '🏭',
  },
  singleton: {
    id: 'singleton',
    recommendation: 'Singleton ⚠️',
    detail: 'Use com muito cuidado — anti-pattern em código testável. DI container (scope singleton) resolve melhor. Se necessário: config readonly, logger global.',
    color: '#ef4444',
    icon: '⚠️',
  },
  decorator: {
    id: 'decorator',
    recommendation: 'Decorator',
    detail: 'Adiciona comportamento via composição — não herança. Logging, cache, retry, auth. Cada decorator tem responsabilidade única. Combina livremente.',
    color: '#8b5cf6',
    icon: '🎨',
  },
  adapter: {
    id: 'adapter',
    recommendation: 'Adapter',
    detail: 'Traduz interface incompatível. Integrar lib legada, API externa. Em DDD: Anti-Corruption Layer entre domínio e sistema externo.',
    color: '#8b5cf6',
    icon: '🔌',
  },
  facade: {
    id: 'facade',
    recommendation: 'Facade',
    detail: 'Esconde complexidade interna atrás de interface simples. Biblioteca com 15 classes vira emailService.send(). Não confunda com Adapter — Facade simplifica, Adapter traduz.',
    color: '#8b5cf6',
    icon: '🏛️',
  },
  proxy: {
    id: 'proxy',
    recommendation: 'Proxy',
    detail: 'Controla acesso ao objeto real. Lazy loading (ORM relations), cache transparente, access control por objeto. Diferente de Decorator: Proxy controla acesso, Decorator adiciona comportamento.',
    color: '#8b5cf6',
    icon: '🛡️',
  },
  strategy: {
    id: 'strategy',
    recommendation: 'Strategy',
    detail: 'Define família de algoritmos intercambiáveis. OCP: adicionar nova estratégia sem modificar o contexto. Em JS moderno: uma função de primeira classe pode ser a estratégia.',
    color: '#10b981',
    icon: '♟️',
  },
  observer: {
    id: 'observer',
    recommendation: 'Observer',
    detail: 'Subject notifica observers em mudança de estado. Base de event-driven, UI reativa, hooks. Cuidado: sempre remova observers (memory leak). Pub/Sub para distribuído.',
    color: '#10b981',
    icon: '👁️',
  },
  command: {
    id: 'command',
    recommendation: 'Command',
    detail: 'Encapsula ação como objeto. Habilita undo/redo, filas de execução, log de auditoria. Base de CQRS: cada write é um Command imutável enviado a um handler.',
    color: '#10b981',
    icon: '📋',
  },
  state: {
    id: 'state',
    recommendation: 'State',
    detail: 'Comportamento do objeto muda com seu estado interno. Elimina if/else gigante por polimorfismo de estado. Pedido: Pendente → Pago → Enviado — comportamento diferente por estado.',
    color: '#10b981',
    icon: '🔄',
  },
}

// ── Visual 2: Comparação Estruturais — Decorator vs Proxy vs Adapter vs Facade ─

const STRUCT_OPTIONS: ComparisonOption[] = [
  { id: 'decorator', label: 'Decorator', color: '#8b5cf6' },
  { id: 'proxy',     label: 'Proxy',     color: '#0ea5e9' },
  { id: 'adapter',   label: 'Adapter',   color: '#f59e0b' },
  { id: 'facade',    label: 'Facade',    color: '#10b981' },
]

const STRUCT_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'intent',
    label: 'Intenção',
    values: {
      decorator: { rating: 'excellent', note: 'Adicionar comportamento em runtime' },
      proxy:     { rating: 'good',      note: 'Controlar acesso ao objeto real' },
      adapter:   { rating: 'good',      note: 'Traduzir interface incompatível' },
      facade:    { rating: 'excellent', note: 'Simplificar subsistema complexo' },
    },
  },
  {
    id: 'modificacao',
    label: 'Modifica o objeto?',
    values: {
      decorator: { rating: 'excellent', note: 'Não — envolve por fora (composição)' },
      proxy:     { rating: 'excellent', note: 'Não — delega ao real' },
      adapter:   { rating: 'good',      note: 'Não — traduz para novo contexto' },
      facade:    { rating: 'good',      note: 'Não — é uma nova interface por cima' },
    },
  },
  {
    id: 'combinacao',
    label: 'Combina livremente?',
    values: {
      decorator: { rating: 'excellent', note: 'Sim — empilha decorators em qualquer ordem' },
      proxy:     { rating: 'fair',      note: 'Parcialmente — um proxy por vez' },
      adapter:   { rating: 'fair',      note: 'Caso a caso — uma tradução específica' },
      facade:    { rating: 'fair',      note: 'Não — simplificação de um subsistema' },
    },
  },
  {
    id: 'testabilidade',
    label: 'Impacto em testes',
    values: {
      decorator: { rating: 'excellent', note: 'Cada decorator testável isoladamente' },
      proxy:     { rating: 'good',      note: 'Proxy testável com mock do real' },
      adapter:   { rating: 'good',      note: 'Adapter testável, isola legacy' },
      facade:    { rating: 'good',      note: 'Facade facilita mock do subsistema' },
    },
  },
  {
    id: 'exemplo',
    label: 'Exemplo real',
    values: {
      decorator: { rating: 'excellent', note: 'Express middleware, NestJS interceptors' },
      proxy:     { rating: 'good',      note: 'ORM lazy loading, cache proxy' },
      adapter:   { rating: 'good',      note: 'Anti-Corruption Layer em DDD' },
      facade:    { rating: 'excellent', note: 'EmailService, SDK de terceiros' },
    },
  },
]

// ── Visual 3: Anti-patterns de design patterns ────────────────────────────────

const ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Strategy com uma só estratégia (YAGNI)',
    wrong: [
      [{ text: 'interface PriceCalculator {', color: '#ef4444' }],
      [{ text: '  calculate(price: number): number', color: '#ef4444' }],
      [{ text: '}', color: '#ef4444' }],
      [{ text: '// "Vou precisar de mais depois..."', color: '#64748b' }],
      [{ text: 'class StandardPriceCalculator implements PriceCalculator {', color: '#ef4444' }],
      [{ text: '  calculate(p: number) { return p }', color: '#ef4444' }],
      [{ text: '}', color: '#ef4444' }],
    ],
    right: [
      [{ text: '// Sem Strategy — simples e direto', color: '#22c55e' }],
      [{ text: 'function calculatePrice(price: number): number {', color: '#22c55e' }],
      [{ text: '  return price', color: '#22c55e' }],
      [{ text: '}', color: '#22c55e' }],
      [{ text: '// Adicione Strategy quando tiver 3+ variações REAIS', color: '#64748b' }],
    ],
    why: 'YAGNI — You Ain\'t Gonna Need It. Pattern sem problema real é complexidade gratuita. Espere até ter 2-3 variações concretas antes de extrair Strategy.',
  },
  {
    title: 'Singleton — global state mascarado',
    wrong: [
      [{ text: 'class UserCache {', color: '#ef4444' }],
      [{ text: '  private static instance: UserCache', color: '#ef4444' }],
      [{ text: '  private data = new Map<string, User>()', color: '#ef4444' }],
      [{ text: '  static getInstance() {', color: '#ef4444' }],
      [{ text: '    return this.instance ??= new UserCache()', color: '#ef4444' }],
      [{ text: '  }', color: '#ef4444' }],
      [{ text: '}', color: '#ef4444' }],
      [{ text: '// Dependência escondida — impossível de testar', color: '#64748b' }],
    ],
    right: [
      [{ text: 'class UserCache {', color: '#22c55e' }],
      [{ text: '  constructor(', color: '#22c55e' }],
      [{ text: '    private data = new Map<string, User>()', color: '#22c55e' }],
      [{ text: '  ) {}', color: '#22c55e' }],
      [{ text: '}', color: '#22c55e' }],
      [{ text: '// Composition root: const cache = new UserCache()', color: '#64748b' }],
      [{ text: '// DI container gerencia o scope singleton', color: '#64748b' }],
    ],
    why: 'Singleton esconde dependência, dificulta mock em testes, causa bugs de concorrência. DI container gerencia o escopo singleton de forma testável.',
  },
  {
    title: 'Pattern Stacking — 5 patterns numa classe',
    wrong: [
      [{ text: 'class OrderProcessorFacadeBuilderFactory {', color: '#ef4444' }],
      [{ text: '  // Factory que retorna Builder', color: '#ef4444' }],
      [{ text: '  // Builder que cria Command', color: '#ef4444' }],
      [{ text: '  // Command que usa Strategy', color: '#ef4444' }],
      [{ text: '  // Strategy via Adapter...', color: '#ef4444' }],
      [{ text: '  // Código vira labirinto', color: '#ef4444' }],
      [{ text: '}', color: '#ef4444' }],
    ],
    right: [
      [{ text: '// Cada pattern resolve um problema específico', color: '#22c55e' }],
      [{ text: 'class OrderService {', color: '#22c55e' }],
      [{ text: '  constructor(', color: '#22c55e' }],
      [{ text: '    private strategy: PricingStrategy, // 1 pattern', color: '#22c55e' }],
      [{ text: '  ) {}', color: '#22c55e' }],
      [{ text: '  process(dto: CreateOrderDto) {', color: '#22c55e' }],
      [{ text: '    const price = this.strategy.calculate(dto)', color: '#22c55e' }],
      [{ text: '  }', color: '#22c55e' }],
      [{ text: '}', color: '#22c55e' }],
    ],
    why: 'Combinar patterns em cascata sem necessidade cria indireção sem benefício. Cada pattern deve resolver um problema concreto e identificável.',
  },
]

// ── Visual 4: Jornada de domínio de design patterns ────────────────────────────

const PROGRESSION: ProgressionLevel[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    label: 'Conhece os nomes',
    emoji: '📖',
    concepts: [
      { name: 'Factory / Singleton / Builder', tip: 'Criacionais — como criar objetos' },
      { name: 'Adapter / Decorator / Facade', tip: 'Estruturais — como compor' },
      { name: 'Strategy / Observer', tip: 'Comportamentais mais usados' },
      { name: 'GoF como catálogo', tip: '23 patterns originais de 1994' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Aplica com propósito',
    emoji: '⚙️',
    concepts: [
      { name: 'Quando NÃO usar (YAGNI)', tip: 'O principal critério de senioridade em patterns' },
      { name: 'Strategy vs if/else', tip: 'Sabe o ponto de inflexão (3+ variações)' },
      { name: 'Decorator vs herança', tip: 'Composição é preferível — sabe por quê' },
      { name: 'Repository pattern', tip: 'Abstrai persistência, habilita mock de repositório' },
      { name: 'Command para undo/audit', tip: 'Ação como objeto — base de CQRS' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Conecta patterns a arquitetura',
    emoji: '🏗️',
    concepts: [
      { name: 'Patterns em DDD', tip: 'Repository, ACL (Adapter), Specification, Value Object' },
      { name: 'Command → CQRS → Event Sourcing', tip: 'Evolução de Command em sistemas distribuídos' },
      { name: 'Observer → Pub/Sub → Event-Driven', tip: 'Escala de local para distribuído' },
      { name: 'Proxy no ORM (lazy loading)', tip: 'Patterns operando na infra transparentemente' },
      { name: 'Anti-patterns e quando surgem', tip: 'God Object, Shotgun Surgery, Anemic Model' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Questiona e adapta',
    emoji: '🔬',
    concepts: [
      { name: 'Patterns em FP', tip: 'Em linguagens funcionais, muitos GoF patterns se dissolvem' },
      { name: 'Patterns de linguagem vs GoF', tip: 'Iterator nativo em JS, closures como Strategy' },
      { name: 'Architectural patterns', tip: 'MVC, CQRS, Event Sourcing, Hexagonal Architecture' },
      { name: 'Quando refatorar de patterns', tip: 'Sabe simplificar código over-engineered com patterns' },
    ],
  },
]

// ── Componente principal ───────────────────────────────────────────────────────

export default function DesignPatternsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'decision-tree',
      title: 'Qual pattern usar?',
      subtitle: 'Árvore de decisão por categoria e problema',
      accent: C,
      component: (
        <DecisionTree
          root={ROOT}
          nodes={NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'structural-comparison',
      title: 'Decorator × Proxy × Adapter × Facade',
      subtitle: 'Os 4 estruturais mais usados — diferenças e quando aplicar',
      accent: '#8b5cf6',
      component: (
        <ComparisonTable
          options={STRUCT_OPTIONS}
          criteria={STRUCT_CRITERIA}
          accentColor='#8b5cf6'
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns com patterns',
      subtitle: 'Os 3 erros mais comuns ao aplicar design patterns',
      accent: '#ef4444',
      component: (
        <AntiPatternsGallery
          patterns={ANTIPATTERNS}
          accentColor='#ef4444'
          bgColor={BG}
        />
      ),
    },
    {
      id: 'progression',
      title: 'Jornada de domínio',
      subtitle: 'Do iniciante ao especialista em design patterns',
      accent: C,
      component: (
        <ProgressionMap
          levels={PROGRESSION}
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
