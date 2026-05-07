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

// ── Paleta Tradeoff Analysis (Architecture) ───────────────────────────────────
const C      = '#8b5cf6'   // roxo — arquitetura / pensamento analítico
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const AMB    = '#f59e0b'
const RED    = '#ef4444'
const SKY    = '#38bdf8'
const ORG    = '#f97316'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Tabela de Comparação: PostgreSQL vs DynamoDB vs MongoDB
// Ensina a comparação multidimensional que texto não consegue mostrar ao mesmo tempo
// ═══════════════════════════════════════════════════════════════════════════════

const DB_OPTIONS: ComparisonOption[] = [
  { id: 'postgres', label: 'PostgreSQL', sublabel: 'RDBMS relacional', color: '#3b82f6' },
  { id: 'dynamo',   label: 'DynamoDB',   sublabel: 'NoSQL chave-valor',  color: '#f59e0b' },
  { id: 'mongo',    label: 'MongoDB',    sublabel: 'Documento NoSQL',    color: '#22c55e' },
]

const DB_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'acid',
    label: 'Transações ACID',
    category: 'Consistência',
    description: 'Suporte a transações multi-step (inserir pedido + reservar estoque + registrar pagamento em atomicidade)',
    values: {
      postgres: { rating: 'excellent', note: 'ACID completo, transações multi-tabela nativas, locks pessimistas e otimistas' },
      dynamo:   { rating: 'fair',      note: 'TransactWriteItems para até 25 itens — overhead significativo de performance' },
      mongo:    { rating: 'good',      note: 'Multi-document transactions desde v4.0, mas com overhead e limitações de performance' },
    },
  },
  {
    id: 'queries',
    label: 'Consultas ad-hoc',
    category: 'Flexibilidade',
    description: 'Capacidade de fazer JOINs e queries complexas não previstas no design inicial',
    values: {
      postgres: { rating: 'excellent', note: 'SQL completo, JOINs, window functions, CTEs recursivas, full-text search' },
      dynamo:   { rating: 'poor',      note: 'Apenas por chave primária ou GSI — queries fora do access pattern = scan completo ($$$)' },
      mongo:    { rating: 'good',      note: 'Aggregation pipeline poderoso, mas JOINs ($lookup) têm performance pior que SQL' },
    },
  },
  {
    id: 'write_scale',
    label: 'Escala de escrita',
    category: 'Performance',
    description: 'Capacidade de escalar writes horizontalmente para alto throughput (>100K writes/s)',
    values: {
      postgres: { rating: 'good',      note: 'Vertical com RDS, sharding manual (Citus) para horizontal. Suficiente para 99% dos sistemas' },
      dynamo:   { rating: 'excellent', note: 'Escala horizontal automática e ilimitada, write capacity units on demand' },
      mongo:    { rating: 'good',      note: 'Sharding nativo, mais fácil que Postgres, mas requer planejamento da shard key' },
    },
  },
  {
    id: 'ops',
    label: 'Complexidade operacional',
    category: 'Operação',
    description: 'Custo de operar em produção: manutenção, backups, tuning, expertise necessária',
    values: {
      postgres: { rating: 'good',      note: 'RDS Multi-AZ abstrai operação. Self-hosted exige expertise em vacuum, autovacuum, replication' },
      dynamo:   { rating: 'excellent', note: 'Totalmente gerenciado — zero operação de cluster, backups automáticos, HA nativo' },
      mongo:    { rating: 'fair',      note: 'Atlas é gerenciado mas caro; self-hosted exige gestão de replica sets e sharding' },
    },
  },
  {
    id: 'schema',
    label: 'Flexibilidade de schema',
    category: 'Desenvolvimento',
    description: 'Facilidade de evoluir o schema sem migrations onerosas',
    values: {
      postgres: { rating: 'fair',      note: 'Migrations explícitas com ALTER TABLE — mais trabalho mas tipo-seguro e auditável' },
      dynamo:   { rating: 'excellent', note: 'Schemaless por design — cada item pode ter campos diferentes' },
      mongo:    { rating: 'excellent', note: 'Documentos flexíveis, schema validation opcional para ter o melhor dos dois mundos' },
    },
  },
  {
    id: 'cost',
    label: 'Custo a 50K requests/dia',
    category: 'Custo',
    description: 'Custo mensal estimado para volume típico de aplicação B2B (50K pedidos/dia)',
    values: {
      postgres: { rating: 'good',      note: 'RDS db.t3.medium Multi-AZ: ~$120/mês. Previsível e linear com tamanho' },
      dynamo:   { rating: 'fair',      note: 'On-demand: ~$80/mês nesse volume, mas pode escalar abruptamente em picos. Reservado é mais barato' },
      mongo:    { rating: 'good',      note: 'Atlas M10: ~$57/mês. Mais barato que RDS para esse volume, mas mais caro em escala' },
    },
  },
  {
    id: 'team_fit',
    label: 'Fit com time backend típico',
    category: 'Time',
    description: 'Velocidade de onboarding para um dev backend com 2+ anos de experiência',
    values: {
      postgres: { rating: 'excellent', note: 'SQL é conhecimento universal. ORMs (Prisma, TypeORM) abstraem muito. Contratação fácil' },
      dynamo:   { rating: 'fair',      note: 'Curva real: access patterns, expression syntax, GSI design. 1-3 meses para ser produtivo' },
      mongo:    { rating: 'good',      note: 'API de queries mais intuitiva para devs JS/TS. Mais fácil que DynamoDB, mas aggregation é complexo' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Árvore de Decisão: Que tipo de decisão você está tomando?
// Ensina o framework de reversibilidade + urgência de forma interativa
// ═══════════════════════════════════════════════════════════════════════════════

const TA_ROOT_NODE: DTNode = {
  id: 'root',
  question: 'Qual é o custo de reverter essa decisão se você errar?',
  children: [
    { label: 'Barato — dias ou semanas', nodeId: 'two_way', color: GRN },
    { label: 'Caro — meses ou anos', nodeId: 'one_way_check', color: RED },
  ],
}

const TA_NODES: Record<string, DTNode> = {
  two_way: {
    id: 'two_way',
    question: 'É uma decisão two-way door (reversível). Como você deve agir?',
    children: [
      { label: 'Já tenho informação suficiente', nodeId: 'decide_now', color: GRN },
      { label: 'Preciso de mais tempo para analisar', nodeId: 'beware_paralysis', color: AMB },
    ],
  },
  decide_now: {
    id: 'decide_now',
    recommendation: 'Decida Agora e Execute',
    detail: 'Two-way door com informação suficiente: decida em no máximo 1 hora, execute, e reverta se necessário. O custo de esperar (devs parados, feature atrasada) é maior que o custo de uma decisão "errada" que você pode desfazer. Exemplos: framework de teste, biblioteca de validação, estrutura de pasta, config de lint.',
    color: GRN,
    icon: '✅',
  },
  beware_paralysis: {
    id: 'beware_paralysis',
    recommendation: 'Atenção: Análise Paralisia',
    detail: 'Se você está hesitando muito em uma decisão reversível, você provavelmente está sofrendo de análise paralisia — tratando uma two-way door como one-way door. Defina um timebox (ex: 2 horas de pesquisa), decida, e siga. O debate eterno sobre decisões reversíveis é custo real de engenheiro desperdiçado.',
    color: AMB,
    icon: '⚠️',
  },
  one_way_check: {
    id: 'one_way_check',
    question: 'Decisão one-way door (cara de reverter). Você quantificou as opções?',
    children: [
      { label: 'Sim — tenho números e alternativas', nodeId: 'document_adr', color: C },
      { label: 'Não — ainda em análise qualitativa', nodeId: 'quantify_first', color: ORG },
    ],
  },
  quantify_first: {
    id: 'quantify_first',
    recommendation: 'Quantifique Antes de Decidir',
    detail: 'Para one-way doors, decisão qualitativa é insuficiente. Estime: (1) Custo de cada opção em dev-time + infra por 3 anos, (2) throughput/latência esperada vs. exigida, (3) custo de migrar para alternativa se errar, (4) fit com time atual (curva de aprendizado em semanas). Número ganha de opinião — mesmo estimativas rough eliminam 80% dos debates inválidos.',
    color: ORG,
    icon: '📊',
  },
  document_adr: {
    id: 'document_adr',
    recommendation: 'Decida e Documente em ADR',
    detail: 'Você tem os números e avaliou as alternativas. Agora: decida, nomeie o sacrifício explicitamente ("escolho X sabendo que sacrifico Y"), documente em ADR com contexto + decisão + alternativas rejeitadas + quando revisitar. O ADR permite que o time futuro entenda por que você escolheu X — sem ele, daqui a 1 ano ninguém lembra.',
    color: C,
    icon: '📝',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Anti-patterns: Decisões Técnicas Erradas
// Mostra o contraste errado × certo para falácias comuns
// ═══════════════════════════════════════════════════════════════════════════════

const ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Cargo Cult — "Netflix usa, então vamos usar"',
    wrong: [
      [{ text: '// Reunião de arquitetura', color: FGMUTE }],
      [{ text: '"Netflix usa Cassandra para escala"' }],
      [{ text: '"Vamos adotar Cassandra então"', color: RED }],
      [{ text: '' }],
      [{ text: '// Resultado 6 meses depois:' }],
      [{ text: '// - 1 engenheiro SRE full-time só para operar Cassandra', color: RED }],
      [{ text: '// - Queries complexas impossíveis sem denormalization', color: RED }],
      [{ text: '// - Volume real: 5K requests/dia (Postgres bastaria)', color: RED }],
    ],
    right: [
      [{ text: '// Contexto validado antes da decisão', color: FGMUTE }],
      [{ text: 'const contexto = {' }],
      [{ text: '  volumeAtual: "5K req/dia",' }],
      [{ text: '  volumeNetflix: "50M req/dia",' }],
      [{ text: '  teamSize: 3, // Netflix: 300 infra engineers', color: GRN }],
      [{ text: '}' }],
      [{ text: '' }],
      [{ text: '// Decisão: Postgres + RDS — aguenta 100x nosso volume', color: GRN }],
      [{ text: '// Revisitar quando: volume > 500K req/dia', color: GRN }],
    ],
    why: 'Cada empresa tem contexto diferente: volume, time, expertise, SLA. Copiar a stack sem verificar se o contexto que a justificou existe no seu caso é cargo cult. Netflix tem 300 engenheiros de infraestrutura. Você tem 3.',
  },
  {
    title: 'Sunk Cost — "Já investimos demais para mudar"',
    wrong: [
      [{ text: '// 8 meses depois do início da migração para microserviços', color: FGMUTE }],
      [{ text: '"Já gastamos 8 meses nessa arquitetura"', color: RED }],
      [{ text: '"Não podemos voltar atrás agora"', color: RED }],
      [{ text: '' }],
      [{ text: '// Realidade:' }],
      [{ text: '// - Microserviços sem infra de observabilidade', color: RED }],
      [{ text: '// - Debug de produção leva 4h vs 30min no monolito', color: RED }],
      [{ text: '// - Velocity: metade do que era', color: RED }],
    ],
    right: [
      [{ text: '// Decisão baseada em custo FUTURO, não passado', color: FGMUTE }],
      [{ text: 'const decisao = {' }],
      [{ text: '  custoPassado: "irrelevante (não recuperável)",' }],
      [{ text: '  custoContinuar: "12 meses de velocity reduzida",' }],
      [{ text: '  custoReverter: "2 meses de refatoração",' }],
      [{ text: '  // Conclusão clara:', color: GRN }],
      [{ text: '  decisao: "reverter para monolito modular"', color: GRN }],
      [{ text: '  // Revisitar microserviços quando: time > 15 devs', color: GRN }],
      [{ text: '}' }],
    ],
    why: 'Sunk cost não é variável da decisão futura. O investimento passado não é recuperável. A pergunta correta é: "daqui para frente, qual caminho tem menor custo total?" Continuar pode ser mais caro que reverter mesmo após meses de trabalho.',
  },
  {
    title: 'Over-engineering — Microserviços prematuros',
    wrong: [
      [{ text: '// MVP com 3 devs, 100 usuários beta', color: FGMUTE }],
      [{ text: '// Arquitetura "para escalar":' }],
      [{ text: 'const servicos = [', color: RED }],
      [{ text: '  "user-service", "auth-service",', color: RED }],
      [{ text: '  "payment-service", "notification-service",', color: RED }],
      [{ text: '  "email-service", "search-service",', color: RED }],
      [{ text: '  "analytics-service" // 7 serviços antes de ter produto', color: RED }],
      [{ text: ']', color: RED }],
      [{ text: '// Resultado: deploy de feature leva 2 dias', color: RED }],
    ],
    right: [
      [{ text: '// Monolito modular — escala por módulo depois', color: FGMUTE }],
      [{ text: 'src/' }],
      [{ text: '  modules/' }],
      [{ text: '    users/     // módulo coeso, testável', color: GRN }],
      [{ text: '    payments/  // separação lógica, deploy único', color: GRN }],
      [{ text: '    search/    // extrair como serviço QUANDO', color: GRN }],
      [{ text: '              // houver problema REAL de escala', color: GRN }],
      [{ text: '' }],
      [{ text: '// Critério de extração: time autônomo OU escala diferente', color: GRN }],
    ],
    why: 'Microserviços resolvem problemas de times autônomos e escala diferencial entre componentes — não são arquitetura padrão para todos. Sem esses problemas, microserviços apenas adicionam complexidade operacional sem benefício. A regra: comece com monolito modular, extraia quando a necessidade for concreta.',
  },
  {
    title: 'Análise Paralisia — Debate eterno em decisão reversível',
    wrong: [
      [{ text: '// Semana 3 de debate sobre ORM para novo projeto', color: FGMUTE }],
      [{ text: '"Prisma vs TypeORM vs Drizzle vs Kysely..."', color: RED }],
      [{ text: '"Precisamos avaliar performance de cada um"', color: RED }],
      [{ text: '"E o suporte a JSON no Postgres?"', color: RED }],
      [{ text: '"E a compatibilidade com Next.js 14?"', color: RED }],
      [{ text: '' }],
      [{ text: '// 3 semanas = 120h de eng desperdiçadas', color: RED }],
      [{ text: '// em decisão que levaria 2 semanas para reverter', color: RED }],
    ],
    right: [
      [{ text: '// Two-way door: timebox de 2 horas', color: FGMUTE }],
      [{ text: 'const criterios = {', color: GRN }],
      [{ text: '  // O que é crítico NO CONTEXTO:', color: GRN }],
      [{ text: '  typescript_support: "Prisma 10/10, TypeORM 8/10",' }],
      [{ text: '  team_experience: "TypeORM conhecemos bem",' }],
      [{ text: '  migration_ease: "similar",' }],
      [{ text: '}', color: GRN }],
      [{ text: '// Decisão: TypeORM (team já conhece)', color: GRN }],
      [{ text: '// Revisitar se: performance issue ou Prisma dominar mercado', color: GRN }],
    ],
    why: 'Análise paralisia acontece quando uma two-way door é tratada como one-way door. A maioria dos ORMs modernos é reversível em 1-2 semanas. Definir timebox, decidir com os critérios que importam NO CONTEXTO, e seguir é o comportamento maduro. O tempo de debate é o maior custo.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function TradeoffAnalysisVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'db-comparison',
      title: 'PostgreSQL vs DynamoDB vs MongoDB — Comparação Multidimensional',
      subtitle: 'As 7 dimensões que importam para escolher um banco de dados — não há resposta universal',
      accent: C,
      component: (
        <ComparisonTable
          options={DB_OPTIONS}
          criteria={DB_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'decision-tree',
      title: 'Framework de Decisão — Two-Way vs One-Way Door',
      subtitle: 'Como decidir o nível de rigor necessário antes de analisar uma decisão técnica',
      accent: C,
      component: (
        <DecisionTree
          root={TA_ROOT_NODE}
          nodes={TA_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns de Decisão Técnica',
      subtitle: 'Os 4 erros mais comuns que parecem raciocínio técnico mas são falácias de decisão',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
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
