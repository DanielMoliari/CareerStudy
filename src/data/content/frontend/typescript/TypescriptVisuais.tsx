'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { VersionTimeline } from '@/components/visuals/VersionTimeline'
import type { VersionMilestone } from '@/components/visuals/VersionTimeline'

// ── Paleta TypeScript ────────────────────────────────────────────────────────────
const C      = '#3178C6'   // TypeScript blue
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const MUTE   = '#475569'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const RED    = '#ef4444'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'
const PINK   = '#f472b6'
const GOLD   = '#fbbf24'

void LINE; void MUTE; void FGMUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Ilustrações do carrossel "O Sistema de Tipos"
// ═══════════════════════════════════════════════════════════════════════════════

function SlideIllustrationSets() {
  return (
    <div style={{ position: 'relative', width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <div style={{
        width: 130, height: 130, borderRadius: '50%',
        background: `radial-gradient(circle, ${C}25, ${C}05)`,
        border: `2px solid ${C}80`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ fontSize: 11, color: C, fontWeight: 800, marginBottom: 4 }}>string</div>
        <div style={{ fontSize: 26, color: FG, fontWeight: 900 }}>∞</div>
        <div style={{ fontSize: 9, color: FGMUTE, marginTop: 4 }}>todos os textos</div>
      </div>
      <div style={{
        width: 90, height: 90, borderRadius: '50%',
        background: `radial-gradient(circle, ${GRN}30, ${GRN}05)`,
        border: `2px solid ${GRN}80`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ fontSize: 10, color: GRN, fontWeight: 800, marginBottom: 2 }}>'ok'</div>
        <div style={{ fontSize: 18, color: FG, fontWeight: 900 }}>1</div>
        <div style={{ fontSize: 8, color: FGMUTE, marginTop: 2 }}>literal</div>
      </div>
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        background: `${RED}15`,
        border: `2px dashed ${RED}80`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ fontSize: 9, color: RED, fontWeight: 800 }}>never</div>
        <div style={{ fontSize: 14, color: FG, fontWeight: 900 }}>∅</div>
      </div>
    </div>
  )
}

function SlideIllustrationStructural() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', height: 200 }}>
      <div style={{
        background: BG, border: `1px solid ${C}40`, borderRadius: 10, padding: 14,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.7,
      }}>
        <div style={{ color: PRP }}>type <span style={{ color: SKY }}>Point</span> = {'{'}</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: AMB }}>x</span>: <span style={{ color: GRN }}>number</span></div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: AMB }}>y</span>: <span style={{ color: GRN }}>number</span></div>
        <div>{'}'}</div>
        <div style={{ marginTop: 10, color: MUTE, fontSize: 10 }}>// requer x e y</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ fontSize: 11, color: GRN, fontWeight: 700 }}>compatível</div>
        <div style={{ fontSize: 22, color: GRN }}>≡</div>
        <div style={{ fontSize: 9, color: FGMUTE }}>mesma forma</div>
      </div>
      <div style={{
        background: BG, border: `2px solid ${GRN}50`, borderRadius: 10, padding: 14,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.7,
      }}>
        <div style={{ color: PRP }}>const <span style={{ color: SKY }}>p</span> = {'{'}</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: AMB }}>x</span>: <span style={{ color: GOLD }}>10</span>,</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: AMB }}>y</span>: <span style={{ color: GOLD }}>20</span>,</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: AMB }}>z</span>: <span style={{ color: GOLD }}>30</span></div>
        <div>{'}'}</div>
        <div style={{ marginTop: 10, color: GRN, fontSize: 10 }}>// extra ok — duck typing</div>
      </div>
    </div>
  )
}

function SlideIllustrationInference() {
  return (
    <div style={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
      <div style={{
        background: BG, border: `1px solid ${LINE}`, borderRadius: 10, padding: 16,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.8,
      }}>
        <div>
          <span style={{ color: PRP }}>const </span>
          <span style={{ color: SKY }}>nome</span>
          <span style={{ color: FG }}> = </span>
          <span style={{ color: GRN }}>'Daniel'</span>
        </div>
        <div style={{ paddingLeft: 14, color: C, fontSize: 10 }}>↳ TS infere: <span style={{ color: AMB, fontWeight: 700 }}>string</span></div>
      </div>
      <div style={{
        background: BG, border: `1px solid ${LINE}`, borderRadius: 10, padding: 16,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.8,
      }}>
        <div>
          <span style={{ color: PRP }}>function </span>
          <span style={{ color: GRN }}>dobra</span>
          <span style={{ color: FG }}>(n: </span>
          <span style={{ color: AMB }}>number</span>
          <span style={{ color: FG }}>) {'{ return n * 2 }'}</span>
        </div>
        <div style={{ paddingLeft: 14, color: C, fontSize: 10 }}>↳ TS infere retorno: <span style={{ color: AMB, fontWeight: 700 }}>number</span></div>
      </div>
    </div>
  )
}

function SlideIllustrationNarrowing() {
  return (
    <div style={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ padding: '6px 14px', borderRadius: 8, background: `${PRP}20`, border: `1.5px solid ${PRP}80`, color: PRP, fontSize: 11, fontWeight: 700 }}>
          string | number
        </div>
        <div style={{ color: AMB, fontSize: 18 }}>→</div>
        <div style={{ fontSize: 10, color: FGMUTE }}>typeof x === 'string'</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 22 }} />
        <div style={{ padding: '6px 14px', borderRadius: 8, background: `${GRN}20`, border: `1.5px solid ${GRN}80`, color: GRN, fontSize: 11, fontWeight: 700 }}>
          string
        </div>
        <div style={{ fontSize: 10, color: GRN }}>← afinado no branch true</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 22 }} />
        <div style={{ padding: '6px 14px', borderRadius: 8, background: `${SKY}20`, border: `1.5px solid ${SKY}80`, color: SKY, fontSize: 11, fontWeight: 700 }}>
          number
        </div>
        <div style={{ fontSize: 10, color: SKY }}>← afinado no branch false</div>
      </div>
    </div>
  )
}

function SlideIllustrationErasure() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', height: 200 }}>
      <div style={{
        background: BG, border: `1px solid ${C}40`, borderRadius: 10, padding: 14,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1.7,
      }}>
        <div style={{ fontSize: 9, color: C, fontWeight: 700, marginBottom: 8, letterSpacing: '.1em' }}>TYPESCRIPT (.ts)</div>
        <div><span style={{ color: PRP }}>type </span><span style={{ color: SKY }}>User</span> = {'{ id: '}<span style={{ color: AMB }}>number</span>{' }'}</div>
        <div><span style={{ color: PRP }}>function </span><span style={{ color: GRN }}>save</span>(<span style={{ color: SKY }}>u</span>: <span style={{ color: SKY }}>User</span>): <span style={{ color: AMB }}>void</span> {'{'}</div>
        <div style={{ paddingLeft: 12 }}>console.log(u.id)</div>
        <div>{'}'}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ fontSize: 11, color: AMB, fontWeight: 700 }}>tsc</div>
        <div style={{ fontSize: 22, color: AMB }}>→</div>
        <div style={{ fontSize: 9, color: FGMUTE }}>tipos apagados</div>
      </div>
      <div style={{
        background: BG, border: `2px solid ${GRN}50`, borderRadius: 10, padding: 14,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1.7,
      }}>
        <div style={{ fontSize: 9, color: GRN, fontWeight: 700, marginBottom: 8, letterSpacing: '.1em' }}>JAVASCRIPT (.js)</div>
        <div style={{ color: MUTE, fontSize: 10, marginBottom: 4 }}>// type some — sem User em runtime</div>
        <div><span style={{ color: PRP }}>function </span><span style={{ color: GRN }}>save</span>(u) {'{'}</div>
        <div style={{ paddingLeft: 12 }}>console.log(u.id)</div>
        <div>{'}'}</div>
      </div>
    </div>
  )
}

// ── Dados do carrossel ───────────────────────────────────────────────────────────

const CONCEPT_SLIDES: Slide[] = [
  {
    title: 'Tipos são conjuntos de valores',
    paragraphs: [
      'Pense em TypeScript como uma linguagem de conjuntos. O tipo string é o conjunto infinito de todas as strings possíveis. O tipo literal "ok" é um conjunto com um único elemento.',
      'Union (A | B) é a união dos conjuntos. Intersection (A & B) é a interseção. never é o conjunto vazio — nenhum valor. unknown é o universo — todos os valores.',
      'Esse modelo mental destrava conditional types, narrowing e variância. Tudo é manipulação de conjuntos em tempo de compilação.',
    ],
    gradient: [C, SKY],
    illustration: <SlideIllustrationSets />,
  },
  {
    title: 'Estrutural, não nominal',
    paragraphs: [
      'TypeScript usa structural typing — duck typing formal. Se um objeto tem as propriedades exigidas, ele é compatível com o tipo, mesmo sem herança ou implements explícito.',
      'Diferente de Java ou C# que são nominais (o nome da classe importa), TS só olha a forma. { x: 10, y: 20 } satisfaz Point sem precisar dizer que é Point.',
      'Isso permite tipar bibliotecas existentes sem reescrever, tornar mocks triviais em testes e compor tipos de forma flexível.',
    ],
    gradient: [GRN, C],
    illustration: <SlideIllustrationStructural />,
  },
  {
    title: 'Inferência elimina anotação',
    paragraphs: [
      'Bons projetos TypeScript têm menos anotações do que iniciantes esperam. O compilador deduz a maioria dos tipos a partir do contexto — variáveis inicializadas, retornos de função, callbacks.',
      'Anote quando o TS não consegue inferir sozinho (parâmetros de função, contratos públicos de API) ou quando a anotação serve como documentação intencional.',
      'Confie na inferência. Anotação demais polui o código e duplica informação que já está implícita no valor.',
    ],
    gradient: [AMB, C],
    illustration: <SlideIllustrationInference />,
  },
  {
    title: 'Narrowing afina o tipo',
    paragraphs: [
      'Narrowing é o processo do compilador de afinar o tipo dentro de um branch baseado em verificações. typeof, instanceof, in, type predicates e discriminated unions são as ferramentas.',
      'Dentro do if (typeof x === "string"), o TypeScript sabe que x é string — não mais string | number. Fora do branch, ele volta a ser a union completa.',
      'Discriminated unions com um campo literal (status, kind, type) são o padrão mais seguro para modelar estados exclusivos com narrowing automático.',
    ],
    gradient: [PRP, PINK],
    illustration: <SlideIllustrationNarrowing />,
  },
  {
    title: 'Tipos não existem em runtime',
    paragraphs: [
      'TypeScript é apagado completamente pelo compilador. Anotações, interfaces, type aliases, generics — nada disso existe quando o JavaScript executa.',
      'Você não pode fazer typeof x === "User" em runtime. Para verificar tipos em tempo de execução, use type guards baseados em propriedades (in) ou instanceof com classes reais.',
      'Implicação prática: validação de entrada (zod, valibot) é separada do sistema de tipos. Os dois trabalham juntos — tipos no código, schemas no boundary.',
    ],
    gradient: [SKY, GRN],
    illustration: <SlideIllustrationErasure />,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Hierarquia de Tipos (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const TYPE_HIERARCHY: Layer[] = [
  {
    id: 'unknown',
    label: 'unknown',
    sublabel: 'topo do sistema — supertipo seguro',
    description: 'Aceita qualquer valor, mas força narrowing antes de usar. É o tipo correto para JSON.parse, catch clauses e respostas de API externas. Versão segura de any — mantém você dentro do TypeScript.',
    color: C,
    icon: '🌐',
    examples: ['JSON.parse', 'catch (e)', 'fetch().then(r => r.json())'],
    code: `function safe(x: unknown) {
  // x.toString() — erro: precisa narrowar
  if (typeof x === 'string') {
    x.toUpperCase() // ok aqui
  }
}`,
  },
  {
    id: 'any',
    label: 'any',
    sublabel: 'opt-out do sistema de tipos',
    description: 'Desativa toda verificação. Você pode fazer qualquer operação sem erro — basicamente sai do TypeScript e volta para JS puro. Use com extrema moderação. Quase sempre unknown é a escolha melhor.',
    color: RED,
    icon: '⚠️',
    examples: ['legacy migrations', 'libs sem types', 'last resort'],
    code: `function dangerous(x: any) {
  x.foo.bar.baz() // sem erro, mas crash em runtime
  x()
  x + 1
}`,
  },
  {
    id: 'object',
    label: 'object | string | number | boolean | symbol | bigint',
    sublabel: 'tipos primitivos e referência',
    description: 'A camada dos primitivos. string aceita qualquer texto, number qualquer número, boolean true/false. object representa qualquer não-primitivo — geralmente prefira tipos mais específicos.',
    color: SKY,
    icon: '◆',
    examples: ['string', 'number', 'boolean', 'bigint', 'symbol'],
    code: `let nome: string = 'Daniel'
let idade: number = 30
let ativo: boolean = true
let big: bigint = 100n
let sym: symbol = Symbol('id')`,
  },
  {
    id: 'specific',
    label: 'tipos específicos',
    sublabel: 'literais, interfaces, classes, arrays',
    description: 'A camada do dia a dia. Tipos literais ("ok", 1, true) representam um único valor. Interfaces e type aliases definem a forma de objetos. Arrays e tuples carregam tipos de seus itens.',
    color: GRN,
    icon: '◉',
    examples: ['User', 'Status', 'Array<T>', '[string, number]'],
    code: `interface User {
  id: string
  name: string
  role: 'admin' | 'user'
}
type Status = 'idle' | 'loading' | 'success'
type Tuple = [string, number, boolean]`,
  },
  {
    id: 'never',
    label: 'never',
    sublabel: 'fundo do sistema — conjunto vazio',
    description: 'Nenhum valor pode ser never. Representa código inalcançável ou impossível. Aparece como tipo de funções que nunca retornam (throw, while(true)) e em conditional types onde a condição nunca é satisfeita.',
    color: PRP,
    icon: '∅',
    examples: ['throw new Error()', 'while(true)', 'exhaustive check'],
    code: `function fail(msg: string): never {
  throw new Error(msg)
}

// exhaustive check em switch:
function _check(x: never): never {
  throw new Error('unreachable')
}`,
  },
  {
    id: 'nullish',
    label: 'null / undefined',
    sublabel: 'subtipos com strictNullChecks',
    description: 'Com strict: true, null e undefined são tipos distintos e não atribuíveis a outros tipos. Você precisa narrowar explicitamente. Sem strict, eles vazam para todos os tipos — e bugs aparecem em runtime.',
    color: AMB,
    icon: '∅',
    examples: ['user?.email', 'val ?? default', 'user!.id'],
    code: `function greet(name: string | null) {
  // name.toUpperCase() — erro
  if (name !== null) {
    name.toUpperCase() // ok
  }
  // ou: name?.toUpperCase()
  // ou: (name ?? 'Anônimo').toUpperCase()
}`,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Narrowing ao Vivo (StateMachineExplorer)
// ═══════════════════════════════════════════════════════════════════════════════

const NARROW_STATES: SMState[] = [
  { id: 'unknown', label: 'unknown', description: 'Topo do sistema. Aceita qualquer valor mas exige narrowing antes de usar. Ponto de entrada de fetch, JSON.parse, catch.', color: C, isInitial: true },
  { id: 'union', label: 'string|num|obj', description: 'Após typeof check, o tipo unknown se afina para uma união menor. Você sabe que é primitivo, mas ainda não qual.', color: SKY },
  { id: 'string', label: 'string', description: 'Tipo afinado para string apenas. Métodos como toUpperCase, charAt, split estão disponíveis sem erro.', color: GRN, isFinal: true },
  { id: 'number', label: 'number', description: 'Tipo afinado para number apenas. Operações aritméticas, toFixed, toString estão disponíveis.', color: AMB, isFinal: true },
  { id: 'object', label: 'object', description: 'Não é primitivo. Pode ser Date, Error, User, Array — precisa de mais narrowing para saber qual.', color: PRP },
  { id: 'date', label: 'Date', description: 'Confirmado via instanceof Date. Métodos getTime, toISOString, getFullYear disponíveis.', color: PINK, isFinal: true },
  { id: 'error', label: 'Error', description: 'Confirmado via instanceof Error. Acesso seguro a message, name, stack, cause.', color: RED, isFinal: true },
  { id: 'user', label: 'User', description: 'Confirmado via type predicate (x is User). Forma mais flexível — qualquer lógica de validação custom.', color: GOLD, isFinal: true },
]

const NARROW_TRANSITIONS: SMTransition[] = [
  {
    from: 'unknown', to: 'union', event: 'typeof check',
    code: `if (typeof x === 'string'\n    || typeof x === 'number'\n    || typeof x === 'object') {\n  // x: string | number | object\n}`,
  },
  {
    from: 'union', to: 'string', event: "typeof === 'string'",
    code: `if (typeof x === 'string') {\n  x.toUpperCase() // ok\n}`,
  },
  {
    from: 'union', to: 'number', event: "typeof === 'number'",
    code: `if (typeof x === 'number') {\n  x.toFixed(2) // ok\n}`,
  },
  {
    from: 'union', to: 'object', event: "typeof === 'object'",
    code: `if (typeof x === 'object' && x !== null) {\n  // x: object (não-primitivo)\n}`,
  },
  {
    from: 'object', to: 'date', event: 'instanceof Date',
    code: `if (x instanceof Date) {\n  x.toISOString() // ok\n}`,
  },
  {
    from: 'object', to: 'error', event: 'instanceof Error',
    code: `if (x instanceof Error) {\n  x.message // ok\n}`,
  },
  {
    from: 'object', to: 'user', event: 'isUser(x) — type predicate',
    code: `function isUser(x: unknown): x is User {\n  return typeof x === 'object'\n    && x !== null\n    && 'id' in x\n    && 'name' in x\n}\n\nif (isUser(x)) {\n  x.name // ok — TS sabe que é User\n}`,
  },
  {
    from: 'unknown', to: 'string', event: "typeof === 'string' (direto)",
    code: `if (typeof x === 'string') {\n  // narrowing direto sem passar por união\n  x.toUpperCase()\n}`,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Utility Types (CardCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const UTILITY_CARDS: CarouselCard[] = [
  {
    name: 'Partial<T>', emoji: '◐', color: C, difficulty: 1,
    signature: 'type Update = Partial<User>',
    use: ['Parâmetros de update onde nem todo campo é obrigatório (PATCH)', 'Configurações com defaults onde tudo pode ser omitido'],
    dontUse: 'Quando você precisa de garantias em runtime — Partial só apaga ? em compile-time',
  },
  {
    name: 'Required<T>', emoji: '●', color: GRN, difficulty: 1,
    signature: 'type Full = Required<Config>',
    use: ['Forçar completude após validação ou parsing de schema', 'Inverter um Partial em camadas internas'],
    dontUse: 'Como anotação principal — geralmente o tipo já vem completo da fonte',
  },
  {
    name: 'Pick<T, K>', emoji: '✂️', color: SKY, difficulty: 1,
    signature: 'type Preview = Pick<User, "id" | "name">',
    use: ['Criar DTOs e subconjuntos sem duplicar campos', 'Componentes que só precisam de parte do objeto'],
    dontUse: 'Para excluir campos — use Omit em vez disso, é mais legível',
  },
  {
    name: 'Omit<T, K>', emoji: '🚫', color: AMB, difficulty: 1,
    signature: 'type CreateUser = Omit<User, "id" | "createdAt">',
    use: ['Tipo de Create sem campos gerados pelo banco (id, timestamps)', 'Remover campos sensíveis antes de retornar ao cliente'],
    dontUse: 'Quando você quer manter quase tudo e só pegar 1-2 campos — use Pick',
  },
  {
    name: 'Readonly<T>', emoji: '🔒', color: PRP, difficulty: 1,
    signature: 'type Frozen = Readonly<User>',
    use: ['Estado imutável em Redux/Zustand', 'Configs que não devem ser mutadas após boot'],
    dontUse: 'Como substituto de Object.freeze — Readonly só atua em compile-time',
  },
  {
    name: 'Record<K, V>', emoji: '🗂️', color: PINK, difficulty: 1,
    signature: 'type RoleMap = Record<Role, Permission[]>',
    use: ['Lookup tables tipadas (mapa de role → permissions)', 'Configs por chave conhecida (env por ambiente)'],
    dontUse: 'Quando os valores divergem por chave — use Map ou union de objetos',
  },
  {
    name: 'Exclude<T, U>', emoji: '➖', color: RED, difficulty: 2,
    signature: 'type NonAdmin = Exclude<Role, "admin">',
    use: ['Remover membros de uma union (filtrar tipos)', 'Refinar tipos derivados após mudança no upstream'],
    dontUse: 'Em objetos — Exclude opera sobre union types, não sobre keys',
  },
  {
    name: 'Extract<T, U>', emoji: '➕', color: GOLD, difficulty: 2,
    signature: 'type AdminOnly = Extract<Role, "admin" | "owner">',
    use: ['Selecionar membros de uma union por compatibilidade', 'Filtrar tipos que casam com um critério'],
    dontUse: 'Para campos de objeto — use Pick (Extract opera em union types)',
  },
  {
    name: 'NonNullable<T>', emoji: '✨', color: SKY, difficulty: 1,
    signature: 'type Defined = NonNullable<string | null>',
    use: ['Após validação que remove null/undefined', 'Em map/filter: NonNullable<typeof arr[number]>'],
    dontUse: 'Em vez de narrowing real — você ainda precisa garantir em runtime',
  },
  {
    name: 'ReturnType<F>', emoji: '↩️', color: GRN, difficulty: 2,
    signature: 'type Result = ReturnType<typeof fetchUser>',
    use: ['Tipar resultado sem duplicar a definição da função', 'Inferir tipo de retorno de hooks customizados'],
    dontUse: 'Com funções genéricas sem instanciação — TS não consegue inferir',
  },
  {
    name: 'Parameters<F>', emoji: '📥', color: AMB, difficulty: 2,
    signature: 'type Args = Parameters<typeof handler>',
    use: ['Wrapper de função que precisa receber os mesmos args', 'Reaproveitar tipos de callbacks de bibliotecas'],
    dontUse: 'Para extrair só um argumento — use indexed access: Parameters<F>[0]',
  },
  {
    name: 'Awaited<T>', emoji: '⏳', color: PRP, difficulty: 2,
    signature: 'type Data = Awaited<Promise<User>>',
    use: ['Desembrulhar Promise em tipo de retorno de async function', 'Lidar com Promises aninhadas (Promise<Promise<T>>)'],
    dontUse: 'Em valores síncronos — não tem efeito sobre tipos não-Promise',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Generics na Prática (CodeStepper)
// ═══════════════════════════════════════════════════════════════════════════════

const GENERICS_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'no-generic',
    label: 'Sem generic',
    language: 'typescript',
    code: `function first(arr: any[]): any {
  return arr[0]
}

const n = first([1, 2, 3])
const s = first(['a', 'b', 'c'])
// n: any  ❌ tipo perdido
// s: any  ❌ tipo perdido`,
    steps: [
      {
        lineStart: 1, lineEnd: 3,
        title: 'Função recebe any[] e retorna any',
        explanation: 'Sem generic, a função aceita qualquer array mas o tipo de retorno é any — você perde toda a informação de tipo. Operações em n e s passam pelo compilador sem verificação.',
        memory: { 'arr': 'any[]', 'return': 'any' },
      },
      {
        lineStart: 5,
        title: 'Chamada com number[]',
        explanation: 'first([1, 2, 3]) deveria retornar number, mas retorna any. Você poderia fazer n.toUpperCase() sem erro de compilação — bug em runtime.',
        memory: { 'n': 'any (deveria ser number)' },
      },
      {
        lineStart: 6,
        title: 'Chamada com string[]',
        explanation: 'Mesmo problema — s é any. O tipo se propaga e contamina o resto do código. Esse é o motivo de existirem generics.',
        memory: { 's': 'any (deveria ser string)' },
      },
    ],
  },
  {
    id: 'with-generic',
    label: 'Com generic',
    language: 'typescript',
    code: `function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

const n = first([1, 2, 3])
const s = first(['a', 'b', 'c'])
// n: number | undefined   ✓
// s: string | undefined   ✓`,
    steps: [
      {
        lineStart: 1, lineEnd: 3,
        title: 'Generic <T> preserva o tipo',
        explanation: 'T é uma variável de tipo. Quando você chama first com um array, T é inferido a partir do tipo dos itens. O retorno preserva esse tipo — sem perda de informação.',
        memory: { 'T': 'inferido na chamada', 'arr': 'T[]', 'return': 'T | undefined' },
      },
      {
        lineStart: 5,
        title: 'Inferência: T = number',
        explanation: 'TypeScript infere T = number a partir do array de números. n agora tem tipo number | undefined — você é forçado a tratar o caso de array vazio.',
        memory: { 'T': 'number', 'n': 'number | undefined' },
      },
      {
        lineStart: 6,
        title: 'Inferência: T = string',
        explanation: 'Mesma função, agora T = string. Generics permitem código reutilizável sem sacrificar type safety. Esse é o coração de bibliotecas como lodash, RxJS e React.',
        memory: { 'T': 'string', 's': 'string | undefined' },
      },
    ],
  },
  {
    id: 'constraint',
    label: 'Com constraint',
    language: 'typescript',
    code: `function findById<T extends { id: string }>(
  items: T[],
  id: string
): T | undefined {
  return items.find(item => item.id === id)
}

const users = [{ id: '1', name: 'Ana' }]
const u = findById(users, '1')
// u: { id: string; name: string } | undefined`,
    steps: [
      {
        lineStart: 1, lineEnd: 6,
        title: 'Constraint via extends',
        explanation: 'T extends { id: string } restringe T a ter pelo menos a propriedade id. Sem essa constraint, item.id daria erro — TypeScript não sabe que T tem essa chave.',
        memory: { 'T': 'extends { id: string }', 'items': 'T[]', 'id': 'string' },
      },
      {
        lineStart: 5,
        title: 'Acesso seguro a item.id',
        explanation: 'Dentro do find, item.id é válido porque T garante essa propriedade. O retorno preserva o tipo completo de T — não apenas { id: string }.',
        memory: { 'item': 'T', 'item.id': 'string (garantido)' },
      },
      {
        lineStart: 8, lineEnd: 9,
        title: 'Inferência preserva forma completa',
        explanation: 'T é inferido como { id: string; name: string }. O retorno é o tipo completo, não só { id: string }. Constraints são contratos mínimos, não tetos máximos.',
        memory: { 'T': '{ id: string; name: string }', 'u': 'T | undefined' },
      },
    ],
  },
  {
    id: 'interface',
    label: 'Generic em interface',
    language: 'typescript',
    code: `interface Repository<T> {
  find(id: string): Promise<T | null>
  save(entity: T): Promise<T>
  list(): Promise<T[]>
}

class UserRepo implements Repository<User> {
  async find(id: string) { /* ... */ return null }
  async save(u: User) { /* ... */ return u }
  async list() { /* ... */ return [] }
}`,
    steps: [
      {
        lineStart: 1, lineEnd: 5,
        title: 'Interface genérica',
        explanation: 'Repository<T> define um contrato parametrizado. Cada método trabalha com o tipo T — find retorna T | null, save aceita e retorna T, list retorna T[].',
        memory: { 'T': 'parâmetro de tipo da interface' },
      },
      {
        lineStart: 7,
        title: 'Implementação fixa T = User',
        explanation: 'UserRepo implementa Repository<User>. T é fixado como User aqui. Todos os métodos passam a trabalhar com User especificamente — sem any, sem cast.',
        memory: { 'T': 'User', 'find': '(id: string) => Promise<User | null>' },
      },
      {
        lineStart: 8, lineEnd: 10,
        title: 'Type safety automático',
        explanation: 'Cada método é verificado contra o contrato da interface com T = User. Se você tentasse retornar Product em find(), o compilador rejeita. É a forma de garantir consistência em ORMs e clean architecture.',
        memory: { 'find': 'OK', 'save': 'OK', 'list': 'OK' },
      },
    ],
  },
  {
    id: 'inference',
    label: 'Inferência automática',
    language: 'typescript',
    code: `function map<T, U>(
  arr: T[],
  fn: (item: T) => U
): U[] {
  return arr.map(fn)
}

const numbers = [1, 2, 3]
const doubled = map(numbers, n => n * 2)
const strings = map(numbers, n => \`item \${n}\`)
// doubled: number[]
// strings: string[]`,
    steps: [
      {
        lineStart: 1, lineEnd: 6,
        title: 'Dois generics: T (input) e U (output)',
        explanation: 'A função tem dois parâmetros de tipo. T é o tipo dos itens de entrada, U é o tipo após transformação. Ambos são inferidos automaticamente — você nunca precisa escrever map<number, number>.',
        memory: { 'T': 'tipo do array de entrada', 'U': 'tipo do retorno do callback' },
      },
      {
        lineStart: 9,
        title: 'Inferência: T = number, U = number',
        explanation: 'arr é number[] → T = number. O callback retorna n * 2 (number) → U = number. Resultado: number[]. Tudo sem anotação manual.',
        memory: { 'T': 'number', 'U': 'number', 'doubled': 'number[]' },
      },
      {
        lineStart: 10,
        title: 'Inferência: T = number, U = string',
        explanation: 'Mesma função. T continua number (mesmo array), mas U muda para string porque o template literal retorna string. O tipo de retorno se adapta automaticamente.',
        memory: { 'T': 'number', 'U': 'string', 'strings': 'string[]' },
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Conditional Types + infer (CodeStepper) — NOVO
// ═══════════════════════════════════════════════════════════════════════════════

const CONDITIONAL_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'basic-cond',
    label: 'Conditional básico',
    language: 'typescript',
    code: `// T extends U ? X : Y — pattern matching no nível do tipo
type IsString<T> = T extends string ? true : false

type A = IsString<'hello'>   // true
type B = IsString<42>        // false
type C = IsString<string>    // true
type D = IsString<unknown>   // false

// Útil para flags type-level e composição
type IfArray<T, Then, Else> = T extends unknown[] ? Then : Else
type X = IfArray<string[], 'array', 'scalar'>  // 'array'
type Y = IfArray<number, 'array', 'scalar'>    // 'scalar'`,
    steps: [
      {
        lineStart: 1, lineEnd: 2,
        title: 'A sintaxe do conditional type',
        explanation: 'T extends U ? X : Y é como um if-else no sistema de tipos. Se T é assignable a U, o tipo resolve para X; senão, para Y. É a base de toda computação no nível do tipo.',
        memory: { 'IsString<T>': 'T extends string ? true : false' },
      },
      {
        lineStart: 4, lineEnd: 7,
        title: 'Avaliação caso a caso',
        explanation: '"hello" é assignable a string → true. 42 não é → false. string é assignable a string → true. unknown NÃO é assignable a string (é o supertipo) → false. O compilador avalia cada um isoladamente.',
        memory: { 'A': 'true', 'B': 'false', 'C': 'true', 'D': 'false' },
      },
      {
        lineStart: 10, lineEnd: 13,
        title: 'Conditional type genérico reutilizável',
        explanation: 'IfArray<T, Then, Else> é um conditional reutilizável — recebe o tipo a testar e os dois resultados. Esse pattern aparece em libs como tRPC e Prisma para gerar tipos derivados.',
        memory: { 'X': "'array'", 'Y': "'scalar'" },
      },
    ],
  },
  {
    id: 'infer-basic',
    label: 'infer — extraindo tipos',
    language: 'typescript',
    code: `// infer R captura o tipo na posição onde aparece
type ReturnType<F> =
  F extends (...args: any[]) => infer R ? R : never

type GetItem<A> =
  A extends Array<infer U> ? U : never

type Unwrap<T> =
  T extends Promise<infer U> ? U : T

// Aplicações:
type R1 = ReturnType<() => string>          // string
type R2 = ReturnType<(x: number) => User>   // User
type R3 = GetItem<number[]>                 // number
type R4 = Unwrap<Promise<{ id: string }>>   // { id: string }
type R5 = Unwrap<number>                    // number (não-Promise)`,
    steps: [
      {
        lineStart: 2, lineEnd: 3,
        title: 'infer captura na posição de retorno',
        explanation: 'No conditional F extends (...args: any[]) => infer R, o R é uma variável de tipo declarada NA HORA. Se F casa com a assinatura de função, R é o tipo de retorno extraído. É como capture group em regex — só que para tipos.',
        memory: { 'R': 'extraído do retorno de F' },
      },
      {
        lineStart: 5, lineEnd: 9,
        title: 'infer em qualquer posição genérica',
        explanation: 'infer pode aparecer em Array<infer U> (extrai item), Promise<infer U> (extrai valor resolvido), Record<infer K, any> (extrai chaves). Sempre que o lado direito de extends tem genérico, você pode capturar.',
        memory: { 'GetItem': 'A extends Array<infer U> ? U : never', 'Unwrap': 'T extends Promise<infer U> ? U : T' },
      },
      {
        lineStart: 12, lineEnd: 16,
        title: 'Casos de uso reais',
        explanation: 'ReturnType extrai retorno de funções (built-in, mas era assim que era implementado). GetItem desembrulha arrays. Unwrap remove a Promise mas deixa não-Promises intocadas — pattern usado em hooks que aceitam valor sync ou async.',
        memory: { 'R1': 'string', 'R2': 'User', 'R3': 'number', 'R4': '{ id: string }', 'R5': 'number' },
      },
    ],
  },
  {
    id: 'distributive',
    label: 'Distribuição sobre unions',
    language: 'typescript',
    code: `// Quando T é uma union "naked", o conditional distribui
type ToArray<T> = T extends any ? T[] : never

type R1 = ToArray<string | number>
// = (string extends any ? string[] : never) | (number extends any ? number[] : never)
// = string[] | number[]   ← NÃO é (string | number)[]

// Para desligar a distribuição: envolva em tupla [T]
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never
type R2 = ToArrayNonDist<string | number>  // (string | number)[]

// Caso real: Exclude<T, U> usa distribuição
type Exclude<T, U> = T extends U ? never : T
type R3 = Exclude<'a' | 'b' | 'c', 'a'>  // 'b' | 'c'`,
    steps: [
      {
        lineStart: 1, lineEnd: 2,
        title: 'O que é "naked" type parameter',
        explanation: 'T é "naked" quando aparece sozinho no lado esquerdo do extends — não envolvido em [T], Array<T> etc. Quando T é uma union e está naked, o TypeScript DISTRIBUI o conditional sobre cada membro da union.',
        memory: { 'ToArray<T>': 'T extends any ? T[] : never' },
      },
      {
        lineStart: 4, lineEnd: 7,
        title: 'A distribuição em ação',
        explanation: 'ToArray<string | number> NÃO vira (string | number)[]. Ele DISTRIBUI: para cada membro, avalia o conditional separadamente. Resultado: string[] | number[]. Sutil mas mudaria semântica — array misto vs union de arrays.',
        memory: { 'R1': 'string[] | number[]' },
      },
      {
        lineStart: 9, lineEnd: 11,
        title: 'Desligando distribuição com [T]',
        explanation: 'Envolver T em tupla [T] extends [U] força o TypeScript a tratar como uma unidade — sem distribuição. Resultado: (string | number)[]. Use quando você quer que o conditional veja a union como um todo.',
        memory: { 'R2': '(string | number)[]' },
      },
      {
        lineStart: 13, lineEnd: 15,
        title: 'Exclude depende de distribuição',
        explanation: 'Exclude<"a"|"b"|"c", "a"> distribui: ("a" extends "a" ? never : "a") | ("b" extends "a" ? never : "b") | ("c" extends "a" ? never : "c") = never | "b" | "c" = "b" | "c". Sem distribuição, Exclude não funcionaria.',
        memory: { 'R3': "'b' | 'c'" },
      },
    ],
  },
  {
    id: 'route-params',
    label: 'Extrair params de rota',
    language: 'typescript',
    code: `// Combina template literal types + infer + recursão
type ExtractParams<S extends string> =
  S extends \`\${string}:\${infer Param}/\${infer Rest}\`
    ? Param | ExtractParams<\`/\${Rest}\`>
    : S extends \`\${string}:\${infer Param}\`
      ? Param
      : never

type Params1 = ExtractParams<'/users/:id'>
// 'id'

type Params2 = ExtractParams<'/users/:userId/posts/:postId'>
// 'userId' | 'postId'

type Params3 = ExtractParams<'/static/about'>
// never (sem :)`,
    steps: [
      {
        lineStart: 2, lineEnd: 6,
        title: 'Template literal + infer + recursão',
        explanation: 'A string é decomposta com pattern matching: \`${string}:${infer Param}/${infer Rest}\` captura o que vem depois de : e antes de /. Depois recursa com o resto. Se não tem mais /, captura o último param.',
        memory: { 'ExtractParams': 'recursive type' },
      },
      {
        lineStart: 8, lineEnd: 9,
        title: 'Caso simples — um parâmetro',
        explanation: 'Match no segundo branch: "/users/:id" extends `${string}:${infer Param}` → Param = "id". Resultado: "id". Esse é o caso base da recursão.',
        memory: { 'Params1': "'id'" },
      },
      {
        lineStart: 11, lineEnd: 12,
        title: 'Caso recursivo — múltiplos params',
        explanation: 'Match no primeiro branch: Param = "userId", Rest = "posts/:postId". Recursão com `/${Rest}` = "/posts/:postId". Segundo nível: Param = "postId". União: "userId" | "postId".',
        memory: { 'Params2': "'userId' | 'postId'" },
      },
      {
        lineStart: 14, lineEnd: 15,
        title: 'Caso sem match',
        explanation: 'Sem ":" na string, nenhum branch casa → never. Permite tipar funções como navigate(path, params) onde params é { [K in ExtractParams<P>]: string } — totalmente type-safe sem runtime.',
        memory: { 'Params3': 'never' },
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Mapped Types & Template Literal (CodeStepper) — NOVO
// ═══════════════════════════════════════════════════════════════════════════════

const MAPPED_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'mapped-basic',
    label: 'Mapped type básico',
    language: 'typescript',
    code: `// { [K in keyof T]: ... } itera sobre as chaves
interface User {
  id: string
  name: string
  age: number
}

// Implementação manual de Readonly:
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

// Implementação manual de Partial:
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

type R1 = MyReadonly<User>
// { readonly id: string; readonly name: string; readonly age: number }

type R2 = MyPartial<User>
// { id?: string; name?: string; age?: number }`,
    steps: [
      {
        lineStart: 2, lineEnd: 6,
        title: 'O tipo base',
        explanation: 'Partimos de User com 3 campos. Mapped types vão iterar sobre essas chaves (id, name, age) e transformar cada uma.',
        memory: { 'User': '{ id, name, age }', 'keyof User': "'id' | 'name' | 'age'" },
      },
      {
        lineStart: 9, lineEnd: 11,
        title: 'readonly modifier no mapped',
        explanation: '[K in keyof T] itera sobre cada chave. T[K] é o tipo do valor naquela chave (indexed access). Adicionar "readonly" aplica o modificador a TODAS as chaves geradas. É exatamente como Readonly<T> built-in funciona.',
        memory: { 'K': 'cada chave de T (uma por vez)', 'T[K]': 'tipo do valor em K' },
      },
      {
        lineStart: 14, lineEnd: 16,
        title: '? modifier para opcional',
        explanation: 'Adicionar ? após [K in keyof T] aplica a opcionalidade a todas as chaves. Use -? para REMOVER opcionalidade (Required<T>) e -readonly para remover readonly. O sinal controla adicionar/remover.',
        memory: { 'modifier ?': 'adiciona opcional', 'modifier -?': 'remove opcional' },
      },
      {
        lineStart: 18, lineEnd: 22,
        title: 'Resultado da transformação',
        explanation: 'O TypeScript expandiu cada chave de User aplicando o modificador. Esse é o mecanismo por trás de TODOS os utility types built-in. Você pode criar variações customizadas para necessidades específicas.',
        memory: { 'R1': 'todos campos readonly', 'R2': 'todos campos opcionais' },
      },
    ],
  },
  {
    id: 'as-remap',
    label: 'as — remapear chaves',
    language: 'typescript',
    code: `// "as" remapeia o nome da chave gerada
interface User {
  id: string
  name: string
  email: string
}

// Gera getters a partir dos campos:
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}

type UserGetters = Getters<User>
// {
//   getId: () => string
//   getName: () => string
//   getEmail: () => string
// }

// Filtrar chaves (exclui as que viram never):
type StringKeysOnly<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}

type S = StringKeysOnly<{ a: string; b: number; c: string }>
// { a: string; c: string }`,
    steps: [
      {
        lineStart: 9, lineEnd: 11,
        title: 'as renomeia a chave',
        explanation: 'Sintaxe: [K in keyof T as NewKey]. Aqui geramos `get${Capitalize<string & K>}` — concatena "get" + chave capitalizada. string & K força o TypeScript a tratar K como string (chaves podem ser symbol também).',
        memory: { 'as <expr>': 'remapeia a chave para <expr>', 'Capitalize': 'utility type built-in' },
      },
      {
        lineStart: 13, lineEnd: 18,
        title: 'API derivada automaticamente',
        explanation: 'Para cada campo de User, geramos um método get<Field>() que retorna o tipo daquele campo. Esse pattern aparece em Mongoose, Prisma e classes geradas por code generators.',
        memory: { 'getId': '() => string', 'getName': '() => string', 'getEmail': '() => string' },
      },
      {
        lineStart: 21, lineEnd: 23,
        title: 'Filtragem de chaves com never',
        explanation: 'Quando "as" produz never, a chave é REMOVIDA do tipo final. T[K] extends string ? K : never — mantém K se valor é string, senão remove. É como filter() para tipos.',
        memory: { 'as never': 'remove a chave', 'as K': 'mantém a chave' },
      },
      {
        lineStart: 25, lineEnd: 26,
        title: 'Resultado — só campos string',
        explanation: 'Aplicado em { a: string; b: number; c: string }: a → mantém, b → vira never (removido), c → mantém. Resultado: { a; c }. Útil para extrair subconjunto de tipo por critério de valor.',
        memory: { 'S': '{ a: string; c: string }' },
      },
    ],
  },
  {
    id: 'template-literal',
    label: 'Template literal types',
    language: 'typescript',
    code: `// Strings no nível do tipo
type Greeting = \`Hello, \${string}\`
type S1 = 'Hello, world'   // assignable a Greeting ✓
type S2 = 'Hi there'       // NÃO assignable ✗

// Combinação de unions cresce produto cartesiano
type Color = 'red' | 'blue'
type Size = 'sm' | 'md' | 'lg'
type ClassName = \`\${Color}-\${Size}\`
// 'red-sm' | 'red-md' | 'red-lg' | 'blue-sm' | 'blue-md' | 'blue-lg'

// Capitalize, Uppercase, Lowercase, Uncapitalize
type EventName<E extends string> = \`on\${Capitalize<E>}\`
type ButtonEvents = EventName<'click' | 'hover' | 'focus'>
// 'onClick' | 'onHover' | 'onFocus'

// Gerador de actions Redux:
type Action<Name extends string> = {
  type: \`\${Uppercase<Name>}_REQUEST\` | \`\${Uppercase<Name>}_SUCCESS\` | \`\${Uppercase<Name>}_FAILURE\`
}
type FetchUserAction = Action<'fetchUser'>['type']
// 'FETCHUSER_REQUEST' | 'FETCHUSER_SUCCESS' | 'FETCHUSER_FAILURE'`,
    steps: [
      {
        lineStart: 1, lineEnd: 4,
        title: 'Template literal como pattern',
        explanation: '`Hello, ${string}` é um TIPO — qualquer string que comece com "Hello, ". "Hello, world" casa, "Hi there" não. É string em compile-time, não runtime.',
        memory: { 'Greeting': 'pattern de string', 'S1': 'casa', 'S2': 'não casa' },
      },
      {
        lineStart: 7, lineEnd: 10,
        title: 'Produto cartesiano de unions',
        explanation: 'Quando você combina unions em template literal, o resultado é o produto cartesiano. Color × Size = 6 combinações. Útil para gerar todos os className válidos de um design system tipado.',
        memory: { 'ClassName': '6 strings literais (2 × 3)' },
      },
      {
        lineStart: 13, lineEnd: 15,
        title: 'Intrinsic string manipulation',
        explanation: 'TypeScript tem 4 utility types built-in para manipular strings em compile-time: Capitalize, Uncapitalize, Uppercase, Lowercase. Combinados com template literal, geram nomes derivados.',
        memory: { 'EventName': '`on${Capitalize<E>}`', 'Capitalize<\'click\'>': "'Click'" },
      },
      {
        lineStart: 18, lineEnd: 22,
        title: 'Caso real — Redux actions',
        explanation: 'Generator de tipos para actions do Redux. Recebe o nome (camelCase) e gera as 3 variantes (REQUEST/SUCCESS/FAILURE) em UPPER_CASE. Type-safe sem boilerplate. Patterns assim aparecem em Redux Toolkit e tRPC.',
        memory: { "Action<'fetchUser'>": '3 variantes UPPER_CASE' },
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — TS + React (CodeStepper) — NOVO
// ═══════════════════════════════════════════════════════════════════════════════

const REACT_TS_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'props',
    label: 'Tipar props',
    language: 'typescript',
    code: `// Props com children, callbacks e variantes
import { ReactNode, MouseEvent } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

interface ButtonProps {
  children: ReactNode
  variant?: Variant
  disabled?: boolean
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}

function Button({ children, variant = 'primary', disabled, onClick }: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}`,
    steps: [
      {
        lineStart: 2,
        title: 'Tipos do React — sempre importe',
        explanation: 'ReactNode é o tipo aceito como children (string, number, JSX, array, null, undefined). MouseEvent<T> é genérico no elemento — captura o tipo correto de currentTarget. Nunca use any para event ou children.',
        memory: { 'ReactNode': 'tipo de children', 'MouseEvent<HTMLButtonElement>': 'event tipado' },
      },
      {
        lineStart: 4,
        title: 'Variantes como union de literais',
        explanation: 'Variant como union de strings literais é melhor que enum: zero overhead, debug fácil, narrowing automático. Próximo passo: as const + typeof[number] para gerar a partir de array.',
        memory: { 'Variant': "'primary' | 'secondary' | 'danger'" },
      },
      {
        lineStart: 6, lineEnd: 11,
        title: 'Props interface — contrato do componente',
        explanation: 'children: ReactNode (sempre). variant opcional com default. onClick com MouseEvent tipado pelo elemento. Evite React.FC — verboso e historicamente teve problemas com children e generics.',
        memory: { 'ButtonProps': '4 campos', 'children': 'ReactNode', 'onClick': 'callback tipado' },
      },
      {
        lineStart: 13,
        title: 'Function component com destructuring',
        explanation: 'Padrão moderno: function Foo({ ...props }: FooProps). Defaults via destructuring (variant = "primary"). Evita React.FC. O TypeScript infere o tipo de retorno (JSX.Element).',
        memory: { 'Button': 'FC sem React.FC', 'variant default': "'primary'" },
      },
    ],
  },
  {
    id: 'hooks',
    label: 'Tipar hooks',
    language: 'typescript',
    code: `import { useState, useRef, useReducer } from 'react'

interface User { id: string; name: string }

function UserProfile() {
  // useState com inferência (User | null pelo valor inicial)
  const [user, setUser] = useState<User | null>(null)

  // useRef com tipo do elemento
  const inputRef = useRef<HTMLInputElement>(null)

  // useReducer com action discriminated union
  type Action =
    | { type: 'set'; user: User }
    | { type: 'clear' }
    | { type: 'updateName'; name: string }

  const [state, dispatch] = useReducer(
    (s: User | null, a: Action): User | null => {
      switch (a.type) {
        case 'set':         return a.user
        case 'clear':       return null
        case 'updateName':  return s ? { ...s, id: s.id, name: a.name } : null
      }
    },
    null
  )

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </div>
  )
}`,
    steps: [
      {
        lineStart: 6, lineEnd: 7,
        title: 'useState — quando anotar T',
        explanation: 'useState<User | null>(null) — anote T quando o valor inicial não captura todos os estados possíveis. Sem anotação, TS infere null e setUser(user) dá erro. Com inicial completo, a inferência basta.',
        memory: { 'user': 'User | null', 'setUser': '(v: User | null) => void' },
      },
      {
        lineStart: 9, lineEnd: 10,
        title: 'useRef com tipo do elemento DOM',
        explanation: 'useRef<HTMLInputElement>(null) — o ref é null inicialmente, vira o elemento após mount. Use ?. para acesso seguro. Para refs imperativas mutáveis, use useRef<T>() sem null.',
        memory: { 'inputRef': 'RefObject<HTMLInputElement>', 'inputRef.current': 'HTMLInputElement | null' },
      },
      {
        lineStart: 13, lineEnd: 16,
        title: 'Action como discriminated union',
        explanation: 'Action com campo "type" literal — base do narrowing automático em switch. Cada variante tem campos próprios. TypeScript garante exhaustiveness e impede acessar campos errados em cada branch.',
        memory: { 'Action': '3 variantes discriminadas' },
      },
      {
        lineStart: 18, lineEnd: 27,
        title: 'useReducer fortemente tipado',
        explanation: 'Reducer (s, a) => S onde S é o tipo do estado. TypeScript afina "a" em cada case do switch — em "set", a é { type: "set"; user: User }. Em "updateName", a tem name. Sem cast, sem any.',
        memory: { 'state': 'User | null', 'dispatch': '(a: Action) => void' },
      },
    ],
  },
  {
    id: 'generic-component',
    label: 'Componente genérico',
    language: 'typescript',
    code: `// Componente reutilizável que preserva o tipo dos itens
interface ListProps<T> {
  items: T[]
  keyExtractor: (item: T) => string
  renderItem: (item: T, index: number) => React.ReactNode
  empty?: React.ReactNode
}

function List<T>({ items, keyExtractor, renderItem, empty }: ListProps<T>) {
  if (items.length === 0) return <>{empty ?? null}</>

  return (
    <ul>
      {items.map((item, i) => (
        <li key={keyExtractor(item)}>{renderItem(item, i)}</li>
      ))}
    </ul>
  )
}

// Uso — T é inferido automaticamente
interface Post { id: string; title: string; views: number }
const posts: Post[] = []

<List
  items={posts}
  keyExtractor={p => p.id}        // p: Post (inferido)
  renderItem={p => <h2>{p.title}</h2>}  // p: Post — type-safe
  empty={<p>Sem posts</p>}
/>`,
    steps: [
      {
        lineStart: 2, lineEnd: 7,
        title: 'Props genéricas com T',
        explanation: 'ListProps<T> parametriza por T (tipo do item). items é T[], keyExtractor recebe T, renderItem recebe T. T é uma variável que será fixada quando o componente for usado.',
        memory: { 'T': 'tipo do item da lista', 'items': 'T[]' },
      },
      {
        lineStart: 9,
        title: 'Função genérica como component',
        explanation: 'function List<T>(...) — T entra na assinatura. TypeScript infere T pelos props passados. Não use React.FC com generics — o tipo de retorno fica complicado e a inferência sofre.',
        memory: { 'List<T>': 'component genérico' },
      },
      {
        lineStart: 21, lineEnd: 22,
        title: 'Tipo concreto na chamada',
        explanation: 'Post é o tipo de cada item. posts é Post[]. Quando passamos para List, T é inferido como Post — automaticamente.',
        memory: { 'posts': 'Post[]', 'T inferido': 'Post' },
      },
      {
        lineStart: 24, lineEnd: 29,
        title: 'Inferência preserva o tipo',
        explanation: 'Em renderItem={p => <h2>{p.title}</h2>}, o p é Post (inferido). p.title é type-safe; p.invalid daria erro. Generics em components é o que torna libs como react-table e react-hook-form possíveis com type safety.',
        memory: { 'p': 'Post (inferido)', 'p.title': 'string (type-safe)' },
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — Anti-patterns TypeScript (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const TS_ANTI_PATTERNS: AntiPattern[] = [
  {
    title: 'any em vez de unknown',
    wrong: [
      [{ text: 'function ', color: PRP }, { text: 'parse', color: GRN }, { text: '(json: ', color: FG }, { text: 'string', color: AMB }, { text: '): ', color: FG }, { text: 'any', color: RED }, { text: ' {', color: FG }],
      [{ text: '  return ', color: PRP }, { text: 'JSON', color: SKY }, { text: '.', color: FG }, { text: 'parse', color: GRN }, { text: '(json)', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: 'const ', color: PRP }, { text: 'data', color: SKY }, { text: ' = ', color: FG }, { text: 'parse', color: GRN }, { text: '(input)', color: FG }],
      [{ text: 'data.', color: FG }, { text: 'foo', color: RED }, { text: '.', color: FG }, { text: 'bar', color: RED }, { text: '() ', color: FG }, { text: '// crash em runtime', color: MUTE }],
    ],
    right: [
      [{ text: 'function ', color: PRP }, { text: 'parse', color: GRN }, { text: '(json: ', color: FG }, { text: 'string', color: AMB }, { text: '): ', color: FG }, { text: 'unknown', color: GRN }, { text: ' {', color: FG }],
      [{ text: '  return ', color: PRP }, { text: 'JSON', color: SKY }, { text: '.', color: FG }, { text: 'parse', color: GRN }, { text: '(json)', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: 'const ', color: PRP }, { text: 'data', color: SKY }, { text: ' = ', color: FG }, { text: 'parse', color: GRN }, { text: '(input)', color: FG }],
      [{ text: 'if (', color: PRP }, { text: 'isUser', color: GRN }, { text: '(data)) data.', color: FG }, { text: 'foo', color: GRN }, { text: ' ', color: FG }, { text: '// narrowed', color: MUTE }],
    ],
    why: 'any desliga o compilador — qualquer operação passa, mas crasha em runtime. unknown força você a verificar o tipo antes de usar (com type guard ou schema), evitando bugs silenciosos.',
  },
  {
    title: 'Type assertion sem narrowing',
    wrong: [
      [{ text: 'function ', color: PRP }, { text: 'process', color: GRN }, { text: '(data: ', color: FG }, { text: 'unknown', color: AMB }, { text: ') {', color: FG }],
      [{ text: '  const ', color: PRP }, { text: 'user', color: SKY }, { text: ' = data ', color: FG }, { text: 'as ', color: RED }, { text: 'User', color: RED }],
      [{ text: '  return user.', color: FG }, { text: 'name', color: RED }, { text: '.', color: FG }, { text: 'toUpperCase', color: GRN }, { text: '()', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: '// se data não for User → crash', color: MUTE }],
    ],
    right: [
      [{ text: 'function ', color: PRP }, { text: 'isUser', color: GRN }, { text: '(x: ', color: FG }, { text: 'unknown', color: AMB }, { text: '): x ', color: FG }, { text: 'is ', color: PRP }, { text: 'User', color: SKY }, { text: ' {', color: FG }],
      [{ text: '  return ', color: PRP }, { text: 'typeof ', color: PRP }, { text: 'x === ', color: FG }, { text: '"object"', color: GRN }, { text: ' && x !== ', color: FG }, { text: 'null', color: AMB }, { text: ' && ', color: FG }, { text: '"name"', color: GRN }, { text: ' in x', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: 'if (', color: PRP }, { text: 'isUser', color: GRN }, { text: '(data)) data.', color: FG }, { text: 'name', color: GRN }, { text: ' ', color: FG }, { text: '// seguro', color: MUTE }],
    ],
    why: 'as User é uma promessa não verificada — TypeScript confia em você. Se data for diferente, o erro vai aparecer só em runtime. Type predicates (x is User) verificam de verdade e dão narrowing real.',
  },
  {
    title: '@ts-ignore como solução',
    wrong: [
      [{ text: '// erro: Property "user" não existe em Request', color: MUTE }],
      [{ text: '// @ts-ignore', color: RED }],
      [{ text: 'req.', color: FG }, { text: 'user', color: RED }, { text: '.', color: FG }, { text: 'id', color: RED }, { text: ' ', color: FG }, { text: '// silencia o erro mas não corrige', color: MUTE }],
    ],
    right: [
      [{ text: '// types/express.d.ts:', color: MUTE }],
      [{ text: 'declare ', color: PRP }, { text: 'namespace ', color: PRP }, { text: 'Express', color: SKY }, { text: ' {', color: FG }],
      [{ text: '  interface ', color: PRP }, { text: 'Request', color: SKY }, { text: ' { user?: AuthUser }', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: 'req.', color: FG }, { text: 'user', color: GRN }, { text: '?.', color: FG }, { text: 'id', color: GRN }, { text: ' ', color: FG }, { text: '// tipado de verdade', color: MUTE }],
    ],
    why: '@ts-ignore mascara o problema sem corrigir nada — o erro real continua, só fica invisível. Em vez disso, augmente o tipo via declaration merging (Express, Window, process.env). É a solução estrutural, não cosmética.',
  },
  {
    title: 'enum numérico em vez de union',
    wrong: [
      [{ text: 'enum ', color: RED }, { text: 'Status', color: SKY }, { text: ' {', color: FG }],
      [{ text: '  Idle, Loading, Success, Error', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: '// gera código JS extra (objeto bidirecional)', color: MUTE }],
      [{ text: '// Status.Loading === ', color: MUTE }, { text: '1', color: AMB }, { text: ' (sem semântica)', color: MUTE }],
    ],
    right: [
      [{ text: 'type ', color: PRP }, { text: 'Status', color: SKY }, { text: ' = ', color: FG }],
      [{ text: '  | ', color: FG }, { text: '"idle"', color: GRN }],
      [{ text: '  | ', color: FG }, { text: '"loading"', color: GRN }],
      [{ text: '  | ', color: FG }, { text: '"success"', color: GRN }],
      [{ text: '  | ', color: FG }, { text: '"error"', color: GRN }],
      [{ text: '// zero JS extra, debug fácil, narrowing automático', color: MUTE }],
    ],
    why: 'Enum numérico gera objeto JS extra em runtime e os valores 0/1/2 não dizem nada no debug. Union de strings tem zero overhead, é serializável, fácil de logar e funciona com discriminated unions automaticamente.',
  },
  {
    title: 'Interface vazia { }',
    wrong: [
      [{ text: 'interface ', color: RED }, { text: 'Empty', color: SKY }, { text: ' {}', color: FG }],
      [{ text: 'function ', color: PRP }, { text: 'fn', color: GRN }, { text: '(x: ', color: FG }, { text: 'Empty', color: RED }, { text: ') {}', color: FG }],
      [{ text: 'fn(', color: FG }, { text: '42', color: AMB }, { text: ')        ', color: FG }, { text: '// passa!', color: MUTE }],
      [{ text: 'fn(', color: FG }, { text: '"texto"', color: GRN }, { text: ')   ', color: FG }, { text: '// passa!', color: MUTE }],
      [{ text: 'fn(', color: FG }, { text: 'null', color: AMB }, { text: ')      ', color: FG }, { text: '// passa também', color: MUTE }],
    ],
    right: [
      [{ text: '// para "qualquer objeto não-nulo":', color: MUTE }],
      [{ text: 'type ', color: PRP }, { text: 'AnyObject', color: SKY }, { text: ' = ', color: FG }, { text: 'Record', color: GRN }, { text: '<', color: FG }, { text: 'string', color: AMB }, { text: ', ', color: FG }, { text: 'unknown', color: AMB }, { text: '>', color: FG }],
      [{ text: '// para "qualquer valor":', color: MUTE }],
      [{ text: 'type ', color: PRP }, { text: 'Anything', color: SKY }, { text: ' = ', color: FG }, { text: 'unknown', color: GRN }],
      [{ text: '// se o objeto deve ter shape específico, defina os campos', color: MUTE }],
    ],
    why: '{} aceita qualquer coisa não-nula — primitivos, funções, arrays. Quase nunca é o que você quer. Use Record<string, unknown> para objetos genéricos ou unknown para "qualquer valor seguro".',
  },
  {
    title: 'object em vez de Record',
    wrong: [
      [{ text: 'function ', color: PRP }, { text: 'logKeys', color: GRN }, { text: '(o: ', color: FG }, { text: 'object', color: RED }, { text: ') {', color: FG }],
      [{ text: '  for (', color: PRP }, { text: 'const ', color: PRP }, { text: 'k ', color: SKY }, { text: 'in', color: PRP }, { text: ' o) {', color: FG }],
      [{ text: '    console.log(o[', color: FG }, { text: 'k', color: RED }, { text: '])  ', color: FG }, { text: '// erro: index signature', color: MUTE }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: 'function ', color: PRP }, { text: 'logKeys', color: GRN }, { text: '(o: ', color: FG }, { text: 'Record', color: GRN }, { text: '<', color: FG }, { text: 'string', color: AMB }, { text: ', ', color: FG }, { text: 'unknown', color: AMB }, { text: '>) {', color: FG }],
      [{ text: '  for (', color: PRP }, { text: 'const ', color: PRP }, { text: 'k ', color: SKY }, { text: 'in', color: PRP }, { text: ' o) {', color: FG }],
      [{ text: '    console.log(o[k]) ', color: FG }, { text: '// ok — index signature presente', color: MUTE }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'object (lowercase) só garante "não é primitivo" — sem index signature. Você não consegue iterar nem acessar propriedades por chave. Record<string, unknown> diz "objeto com chaves string e valores desconhecidos" — útil de verdade.',
  },
  {
    title: 'Optional chaining sem narrowing',
    wrong: [
      [{ text: 'function ', color: PRP }, { text: 'render', color: GRN }, { text: '(user?: ', color: FG }, { text: 'User', color: SKY }, { text: ') {', color: FG }],
      [{ text: '  return ', color: PRP }, { text: '<div>', color: AMB }, { text: '{user?.', color: FG }, { text: 'name', color: FG }, { text: '?.', color: RED }, { text: 'toUpperCase', color: GRN }, { text: '()}', color: FG }, { text: '</div>', color: AMB }],
      [{ text: '}', color: FG }],
      [{ text: '// renderiza string vazia silenciosamente', color: MUTE }],
      [{ text: '// usuário não vê o porquê', color: MUTE }],
    ],
    right: [
      [{ text: 'function ', color: PRP }, { text: 'render', color: GRN }, { text: '(user?: ', color: FG }, { text: 'User', color: SKY }, { text: ') {', color: FG }],
      [{ text: '  if (!user) return ', color: PRP }, { text: '<Empty />', color: AMB }],
      [{ text: '  if (!user.name) return ', color: PRP }, { text: '<Loading />', color: AMB }],
      [{ text: '  return ', color: PRP }, { text: '<div>', color: AMB }, { text: '{user.name.', color: FG }, { text: 'toUpperCase', color: GRN }, { text: '()}', color: FG }, { text: '</div>', color: AMB }],
      [{ text: '}', color: FG }],
    ],
    why: 'Optional chaining em cadeia esconde estados intermediários. Quando algo está nulo, o usuário vê string vazia sem entender por que. Narrowing explícito separa os casos e dá UX melhor (loading, empty state, erro).',
  },
  {
    title: 'Tipo Function genérico',
    wrong: [
      [{ text: 'function ', color: PRP }, { text: 'register', color: GRN }, { text: '(cb: ', color: FG }, { text: 'Function', color: RED }, { text: ') {', color: FG }],
      [{ text: '  cb(', color: FG }, { text: '"hello"', color: GRN }, { text: ')           ', color: FG }, { text: '// args sem tipo', color: MUTE }],
      [{ text: '  const ', color: PRP }, { text: 'r', color: SKY }, { text: ' = cb(', color: FG }, { text: '42', color: AMB }, { text: ')        ', color: FG }, { text: '// retorno: any', color: MUTE }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: 'function ', color: PRP }, { text: 'register', color: GRN }, { text: '(cb: ', color: FG }, { text: '(', color: FG }, { text: 'msg', color: SKY }, { text: ': ', color: FG }, { text: 'string', color: AMB }, { text: ') => ', color: FG }, { text: 'void', color: AMB }, { text: ') {', color: FG }],
      [{ text: '  cb(', color: FG }, { text: '"hello"', color: GRN }, { text: ')   ', color: FG }, { text: '// type-safe', color: MUTE }],
      [{ text: '  cb(', color: FG }, { text: '42', color: RED }, { text: ')        ', color: FG }, { text: '// erro: number ≠ string', color: MUTE }],
      [{ text: '}', color: FG }],
    ],
    why: 'Function (tipo built-in) aceita qualquer assinatura — args como any[], retorno any. Você perde toda a type safety. Sempre defina a assinatura específica: (param: Type) => Return. É a forma de garantir contratos de callback.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 10 — tsconfig Decision (DecisionTree) — NOVO
// ═══════════════════════════════════════════════════════════════════════════════

const TSCONFIG_NODES: Record<string, DTNode> = {
  start: {
    id: 'start',
    question: 'Qual a natureza do seu projeto TypeScript?',
    icon: '⚙️',
    children: [
      { label: 'Frontend (Next.js, Vite, CRA)', nodeId: 'frontend', color: C },
      { label: 'Backend (Node.js, Nest, Express)', nodeId: 'backend', color: GRN },
      { label: 'Lib publicada no npm', nodeId: 'lib', color: PRP },
      { label: 'Migração de projeto JS legado', nodeId: 'legacy', color: AMB },
    ],
  },
  frontend: {
    id: 'frontend',
    question: 'O bundler é Vite, Next.js ou Webpack moderno?',
    icon: '🌐',
    children: [
      { label: 'Sim — bundler moderno', nodeId: 'frontend-modern', color: GRN },
      { label: 'Não — webpack legacy ou tsc puro', nodeId: 'frontend-legacy', color: AMB },
    ],
  },
  'frontend-modern': {
    id: 'frontend-modern',
    recommendation: 'Configuração de frontend moderno',
    icon: '✓',
    color: GRN,
    detail: `{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "noUncheckedIndexedAccess": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "paths": { "@/*": ["./src/*"] }
  }
}

→ moduleResolution: "bundler" assume que Vite/Next/esbuild resolve ESM.
→ isolatedModules: cada arquivo é compilável isoladamente (necessário para HMR).
→ noUncheckedIndexedAccess: arr[i] retorna T | undefined.
→ paths: aliases limpam imports profundos.`,
  },
  'frontend-legacy': {
    id: 'frontend-legacy',
    recommendation: 'Configuração de frontend legacy',
    icon: '✓',
    color: AMB,
    detail: `{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "module": "CommonJS",
    "moduleResolution": "node",
    "jsx": "react",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}

→ moduleResolution: "node" para webpack 4 ou tsc compilando direto.
→ Considere migrar para bundler moderno — economia de complexidade enorme.`,
  },
  backend: {
    id: 'backend',
    question: 'Está usando NestJS ou outro framework com decorators?',
    icon: '🔧',
    children: [
      { label: 'Sim — NestJS, TypeORM, etc', nodeId: 'backend-decorators', color: PRP },
      { label: 'Não — Express, Fastify, raw Node', nodeId: 'backend-plain', color: GRN },
    ],
  },
  'backend-decorators': {
    id: 'backend-decorators',
    recommendation: 'Backend com decorators (NestJS, TypeORM)',
    icon: '✓',
    color: PRP,
    detail: `{
  "compilerOptions": {
    "strict": true,
    "target": "ES2021",
    "module": "CommonJS",
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "baseUrl": "./src",
    "paths": { "@/*": ["*"] }
  }
}

→ experimentalDecorators + emitDecoratorMetadata: necessários para reflexão (Nest, TypeORM).
→ target ES2021: features modernas, Node 16+.
→ outDir/baseUrl: separa src/dist limpo.`,
  },
  'backend-plain': {
    id: 'backend-plain',
    recommendation: 'Backend sem decorators',
    icon: '✓',
    color: GRN,
    detail: `{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  }
}

→ Use ESM nativo se Node 18+ — module: ESNext.
→ noUncheckedIndexedAccess: previne acesso fora do limite em arrays/objetos.
→ Sem decorators, configuração mais limpa.`,
  },
  lib: {
    id: 'lib',
    recommendation: 'Lib publicada no npm — type safety máxima',
    icon: '📦',
    color: PRP,
    detail: `{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": false,
    "esModuleInterop": true,
    "isolatedModules": true
  }
}

→ declaration: true — gera .d.ts para consumidores.
→ declarationMap: true — go-to-definition pula direto para o source.
→ exactOptionalPropertyTypes: distingue { x: undefined } de { } — mais rigoroso.
→ skipLibCheck: false — você é a lib, valide tudo.
→ target ES2017: maior compatibilidade com consumidores variados.`,
  },
  legacy: {
    id: 'legacy',
    question: 'Estratégia de migração de JS para TS:',
    icon: '🔄',
    children: [
      { label: 'Migração gradual (allowJs)', nodeId: 'legacy-gradual', color: AMB },
      { label: 'Big bang — só TS daqui para frente', nodeId: 'legacy-strict', color: GRN },
    ],
  },
  'legacy-gradual': {
    id: 'legacy-gradual',
    recommendation: 'Migração gradual JS → TS',
    icon: '🐢',
    color: AMB,
    detail: `{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "target": "ES2017",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}

→ allowJs: aceita .js no projeto.
→ checkJs: false inicialmente, true depois para validar JSDoc.
→ Ative strict gradualmente — comece desligado, ative noImplicitAny primeiro, depois strictNullChecks.
→ Renomeie .js → .ts arquivo por arquivo.`,
  },
  'legacy-strict': {
    id: 'legacy-strict',
    recommendation: 'Big bang — strict desde o início',
    icon: '🚀',
    color: GRN,
    detail: `{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}

→ Apenas .ts/.tsx daqui em diante — não habilite allowJs.
→ Aceite o pain inicial — vai aparecer muitos erros, corrija um por um.
→ Use ts-node ou tsx para rodar durante desenvolvimento.
→ Muito mais limpo a longo prazo do que migração híbrida.`,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 11 — Evolução do TypeScript (VersionTimeline) — features que mudaram o dia a dia
// ═══════════════════════════════════════════════════════════════════════════════

const TS_MILESTONES: VersionMilestone[] = [
  {
    id: '4.0',
    version: '4.0',
    year: '2020',
    title: 'Variadic Tuple Types e Labeled Tuples',
    description: 'Marco que destravou tipagem precisa de funções variádicas. Antes, tipar concat, curry e composição genérica era impossível ou exigia overloads gigantes. Variadic tuples mudaram o que dá para expressar no sistema de tipos.',
    highlights: [
      'Variadic tuple types: type Concat<A extends any[], B extends any[]> = [...A, ...B] — composição preservando ordem.',
      'Labeled tuples: type Coords = [x: number, y: number] — IDE mostra o nome em vez de [number, number].',
      'Short-circuit assignment operators (??=, &&=, ||=) ganharam suporte de tipos refinados.',
      'Class field inference em construtores — sem precisar anotar this.foo se a atribuição revela o tipo.',
    ],
    color: '#94a3b8',
  },
  {
    id: '4.1',
    version: '4.1',
    year: '2020',
    title: 'Template Literal Types e Key Remapping',
    description: 'Template literal types abriram um universo novo: strings agora são manipuláveis no nível do tipo. Combinado com key remapping em mapped types (as), bibliotecas como tRPC e Prisma puderam gerar APIs type-safe sem code generation.',
    highlights: [
      'Template literal types: type Hello<T extends string> = `hello, ${T}` — composição de strings em compile-time.',
      'Key remapping em mapped types: { [K in keyof T as `get${Capitalize<K>}`]: () => T[K] }.',
      'Recursive conditional types (com profundidade aumentada) — desembrulhar Promises aninhadas, deep traversal de tipos.',
      'Capitalize, Uncapitalize, Uppercase, Lowercase como intrinsic string types.',
    ],
    color: '#94a3b8',
  },
  {
    id: '4.4',
    version: '4.4',
    year: '2021',
    title: 'Control Flow Analysis com Aliased Conditions',
    description: 'O compilador passou a entender narrowing de condições atribuídas a variáveis. Antes, const isString = typeof x === "string"; if (isString) {...} não fazia narrowing dentro do if. Agora faz — código fica mais legível sem perder type safety.',
    highlights: [
      'Aliased conditions: const isStr = typeof x === "string"; if (isStr) x.toUpperCase() — agora funciona.',
      'Discriminant property checks em destructured: const { kind } = obj; if (kind === "ok") { obj.data } funciona.',
      'Symbol e template string pattern index signatures: { [K: `data-${string}`]: string }.',
      'Unknown como tipo de catch clauses (com useUnknownInCatchVariables: true) — força narrowing em erros.',
    ],
    color: '#94a3b8',
  },
  {
    id: '4.5',
    version: '4.5',
    year: '2021',
    title: 'Awaited<T> built-in e Type Modifiers em imports',
    description: 'Awaited<T> virou utility type oficial — antes era implementado manualmente em todo projeto. Type-only modifiers em imports (import { type Foo, bar }) deram controle preciso sobre o que é apagado em compile vs runtime.',
    highlights: [
      'Awaited<T>: desembrulha Promises recursivamente. Awaited<Promise<Promise<string>>> = string.',
      'import { type Foo, bar } from "./mod" — Foo é apagado, bar permanece em runtime. Útil para isolatedModules.',
      'Tail-recursion eliminação em conditional types — recursão profunda sem estourar o type checker.',
      'Disabling import elision (preserveValueImports) — aliados de bundlers que não fazem tree-shaking de tipos.',
    ],
    color: '#94a3b8',
  },
  {
    id: '4.9',
    version: '4.9',
    year: '2022',
    title: 'satisfies Operator',
    description: 'Talvez o operador mais útil dos últimos anos. satisfies valida que um valor é compatível com um tipo SEM ampliar o tipo inferido. Resolve a tensão histórica entre anotação ":Type" (perde literais) e "as Type" (sem verificação).',
    highlights: [
      'const cfg = { mode: "dark" } satisfies Config — cfg.mode permanece "dark" (literal), não vira "dark" | "light".',
      'Útil em objetos de configuração, mapas de constantes, registry de componentes — autocomplete preciso + validação.',
      'In operator narrowing melhorado: "x" in obj agora narrowa também o tipo do contêiner (não só de obj).',
      'NaN equality check warnings: TypeScript sinaliza x === NaN como bug — sempre é false, use Number.isNaN.',
    ],
    color: '#3178C6',
  },
  {
    id: '5.0',
    version: '5.0',
    year: '2023',
    title: 'Decorators (Stage 3) e const Type Parameters',
    description: 'TS 5.0 trouxe decorators conformes ao TC39 Stage 3 (sem experimentalDecorators) e const type parameters — feature pequena mas que muda como bibliotecas tipam APIs. Bundle do tsc reduziu drasticamente, build ficou mais rápido.',
    highlights: [
      'Decorators TC39 Stage 3: @logged class Foo {} — padrão sem experimentalDecorators, funciona em runtime.',
      'const type parameters: function f<const T>(x: T): T — T é inferido como literal/tuple readonly automaticamente.',
      'Multiple config inheritance: extends pode receber array em tsconfig — composição de configs base.',
      'extends opcional em tsconfig com paths relativos a node_modules — workspace monorepo simplificado.',
      'Bundler module resolution oficial: moduleResolution: "bundler" para Vite/Webpack/esbuild modernos.',
    ],
    color: '#3178C6',
  },
  {
    id: '5.2',
    version: '5.2',
    year: '2023',
    title: 'using Declarations e Explicit Resource Management',
    description: 'using e await using trazem garantias de cleanup determinístico (Symbol.dispose / Symbol.asyncDispose). Útil em código que abre recursos (file handles, conexões, locks) — o cleanup roda mesmo se houver exceção. RAII no JS/TS.',
    highlights: [
      'using x = openFile(path) — quando x sai do escopo, [Symbol.dispose]() é chamado automaticamente.',
      'await using x = openConnection() — versão async para recursos que liberam de forma async.',
      'Decoupling o tipo dos parâmetros de uma união: easier-to-read narrowing em discriminated unions.',
      'Copying array methods: toReversed, toSorted, toSpliced, with — tipos refletem mutações imutáveis.',
    ],
    color: '#3178C6',
  },
  {
    id: '5.4',
    version: '5.4',
    year: '2024',
    title: 'NoInfer<T> e Closure Narrowing Preservado',
    description: 'NoInfer<T> resolve um problema antigo de generics: forçar a inferência a vir de um parâmetro específico. Closure narrowing preservado significa que callbacks dentro de if-blocks mantêm o narrowing do escopo externo — código fica mais natural.',
    highlights: [
      'NoInfer<T>: function pick<T>(opts: T[], default: NoInfer<T>) — default não influencia a inferência de T.',
      'Closure narrowing preservado: if (typeof x === "string") { arr.forEach(() => x.toUpperCase()) } — funciona.',
      'Object.groupBy e Map.groupBy tipados: novos métodos de agrupamento da ECMAScript com tipos refinados.',
      'Suporte preliminar para conditional type narrowing baseado em discriminant em function signatures.',
    ],
    color: '#3178C6',
  },
  {
    id: '5.5',
    version: '5.5',
    year: '2024',
    title: 'Inferred Type Predicates',
    description: 'Marco silencioso mas transformador: TypeScript agora INFERE type predicates automaticamente quando uma função tem padrões claros. Antes, function isString(x): x is string { return typeof x === "string" } precisava ser explícito; hoje a maioria dos casos infere sozinho.',
    highlights: [
      'Inferred type predicates: const strings = items.filter(x => typeof x === "string") — strings é string[] (não unknown[]).',
      'Regular expression syntax checking: TypeScript valida regex literais em compile-time (flags, escapes).',
      'Isolated declarations: nova flag para forçar declarações explícitas em libs — builds paralelos mais rápidos.',
      'Performance: type-checking de codebases grandes ficou ~10% mais rápido com novas heurísticas.',
    ],
    color: '#3178C6',
    isCurrent: true,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// SHELL — monta os visuais
// ═══════════════════════════════════════════════════════════════════════════════

export default function TypescriptVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'concepts',
      title: 'O Sistema de Tipos',
      subtitle: 'Fundamentos',
      accent: C,
      component: (
        <ConceptCarousel
          slides={CONCEPT_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          label="VISUAL 1 — CONCEITOS FUNDAMENTAIS"
          heading="Como o TypeScript Pensa"
          description="Cinco pilares para construir o modelo mental do sistema de tipos. Os mesmos conceitos que separam quem usa TS de quem entende TS."
        />
      ),
    },
    {
      id: 'hierarchy',
      title: 'Hierarquia de Tipos',
      subtitle: 'unknown → never',
      accent: C,
      component: (
        <LayerStack
          layers={TYPE_HIERARCHY}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          direction="top-down"
          title="Hierarquia de Tipos TypeScript"
          description="Do supertipo unknown até o subtipo never. Clique em cada camada para ver descrição, exemplos e código."
        />
      ),
    },
    {
      id: 'narrowing',
      title: 'Narrowing ao Vivo',
      subtitle: 'Type guards',
      accent: PRP,
      component: (
        <StateMachineExplorer
          states={NARROW_STATES}
          transitions={NARROW_TRANSITIONS}
          initialState="unknown"
          accentColor={PRP}
          bgColor={BG}
          cardColor={CARD}
          title="Máquina de Narrowing"
          description="Comece em unknown e dispare transições (typeof, instanceof, type predicate). Veja o tipo afinar e o código de cada guard."
        />
      ),
    },
    {
      id: 'utility',
      title: 'Utility Types',
      subtitle: '12 cards essenciais',
      accent: SKY,
      component: (
        <CardCarousel
          cards={UTILITY_CARDS}
          bgColor={BG}
          accentColor={SKY}
          label="VISUAL 4 — UTILITY TYPES"
          heading="Os Utility Types em 60 Segundos"
          description="Doze utility types que você usa de verdade. Quando usar, quando não usar e dificuldade — em um cartão."
          difficultyIcon="◆"
        />
      ),
    },
    {
      id: 'generics',
      title: 'Generics na Prática',
      subtitle: 'Passo a passo',
      accent: GRN,
      component: (
        <CodeStepper
          scenarios={GENERICS_SCENARIOS}
          accentColor={GRN}
          bgColor={BG}
          cardColor={CARD}
          title="Generics na Prática"
          description="Cinco cenários com código e explicação passo a passo. Veja a inferência acontecer no painel de memória."
        />
      ),
    },
    {
      id: 'conditional',
      title: 'Conditional Types',
      subtitle: 'extends + infer',
      accent: PINK,
      component: (
        <CodeStepper
          scenarios={CONDITIONAL_SCENARIOS}
          accentColor={PINK}
          bgColor={BG}
          cardColor={CARD}
          title="Conditional Types e infer"
          description="O conceito mais difícil do TypeScript em 4 cenários. Pattern matching no nível do tipo, captura com infer, distribuição sobre unions e parser de rotas type-safe."
        />
      ),
    },
    {
      id: 'mapped',
      title: 'Mapped & Template',
      subtitle: 'Transformar tipos',
      accent: GOLD,
      component: (
        <CodeStepper
          scenarios={MAPPED_SCENARIOS}
          accentColor={GOLD}
          bgColor={BG}
          cardColor={CARD}
          title="Mapped Types & Template Literal Types"
          description="Como Partial, Required, Readonly e Record são implementados. Como remapear chaves com 'as' e como compor strings no nível do tipo para gerar APIs derivadas."
        />
      ),
    },
    {
      id: 'react',
      title: 'TypeScript + React',
      subtitle: 'Caso real',
      accent: SKY,
      component: (
        <CodeStepper
          scenarios={REACT_TS_SCENARIOS}
          accentColor={SKY}
          bgColor={BG}
          cardColor={CARD}
          title="TypeScript + React na Prática"
          description="O caso de uso mais cobrado em entrevista frontend. Tipar props com children e callbacks, hooks (useState, useRef, useReducer) e componentes genéricos com inferência preservada."
        />
      ),
    },
    {
      id: 'antipat',
      title: 'Anti-patterns',
      subtitle: 'Errado vs certo',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={TS_ANTI_PATTERNS}
          accentColor={RED}
          bgColor={BG}
          errorColor={RED}
          successColor={GRN}
          warningColor={AMB}
          label="VISUAL 9 — ANTI-PATTERNS"
          heading="Galeria do Horror TypeScript"
          description="Oito armadilhas comuns. À esquerda o erro, à direita a versão correta. Errado vs Certo, sempre lado a lado."
          whyLabel="POR QUE ISSO QUEBRA TYPE SAFETY?"
        />
      ),
    },
    {
      id: 'tsconfig',
      title: 'tsconfig Decision',
      subtitle: 'Qual flag ativar',
      accent: AMB,
      component: (
        <DecisionTree
          root={TSCONFIG_NODES.start}
          nodes={TSCONFIG_NODES}
          accentColor={AMB}
          bgColor={BG}
          cardColor={CARD}
          title="Qual tsconfig.json para o seu projeto?"
          description="Escolha a natureza do projeto e veja a configuração recomendada com explicação de cada flag. Frontend moderno, backend com decorators, lib npm e migração legacy têm necessidades diferentes."
        />
      ),
    },
    {
      id: 'evolution',
      title: 'Evolução do TS',
      subtitle: '4.0 → 5.5',
      accent: C,
      component: (
        <VersionTimeline
          milestones={TS_MILESTONES}
          techName="TypeScript"
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Evolução do TypeScript — features que mudaram o dia a dia"
          description="As versões que importam para entrevista e código moderno. Cada release trouxe uma feature que dá para usar imediatamente — variadic tuples, template literals, satisfies, NoInfer, inferred predicates. Clique para ver os destaques."
        />
      ),
    },
  ]

  return <VisuaisShell visuals={visuals} active={active} onChange={setActive} />
}
