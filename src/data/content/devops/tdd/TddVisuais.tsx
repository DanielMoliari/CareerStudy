'use client'
import { useState, useEffect } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta TDD ────────────────────────────────────────────────────────────────
const C      = '#22c55e'   // verde — passo green do ciclo
const SEC    = '#16a34a'
const RED    = '#ef4444'   // vermelho — passo red
const BLU    = '#3b82f6'   // azul — passo refactor
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Red-Green-Refactor cycle (custom animado)
// ═══════════════════════════════════════════════════════════════════════════════

type CyclePhase = 'red' | 'green' | 'refactor'

const PHASE_DATA: Record<CyclePhase, {
  label: string
  color: string
  desc: string
  goal: string
  duration: string
  example: { before?: string; code: string }
  pitfall: string
}> = {
  red: {
    label: 'RED — escreva o teste que FALHA',
    color: RED,
    desc: 'Voce escreve PRIMEIRO um teste que descreve o comportamento desejado. Roda. O teste falha — provavelmente porque a funcao nem existe ainda. O vermelho e proposital: garante que o teste mede algo real.',
    goal: 'Garantir que o teste falha pelo motivo certo',
    duration: '1-3 min',
    example: {
      before: '// nada existe ainda',
      code: `test('soma 2 + 3 = 5', () => {
  expect(somar(2, 3)).toBe(5)
})

// FAIL: ReferenceError: somar is not defined`,
    },
    pitfall: 'Pular o RED. Se voce escreve teste depois do codigo, perde o feedback de design e nao tem garantia que o teste mede o comportamento certo.',
  },
  green: {
    label: 'GREEN — codigo MINIMO para passar',
    color: C,
    desc: 'Escreve o codigo mais simples que faz o teste passar — pode ser feio, hardcoded, qualquer coisa. "Fake it till you make it" (Kent Beck). A generalizacao vem depois, forcada por novo teste.',
    goal: 'Suite verde — nada mais',
    duration: '1-3 min',
    example: {
      code: `function somar(a, b) {
  return a + b
}

// PASS: 1 test passed`,
    },
    pitfall: 'Antecipar requisitos. Se voce ja codifica edge cases sem teste forcando, perde a forca do TDD. So adicione complexidade quando um novo RED exigir.',
  },
  refactor: {
    label: 'REFACTOR — limpa sem mudar comportamento',
    color: BLU,
    desc: 'Suite verde e a rede de seguranca. Voce melhora estrutura: extract function, rename, simplify, remove duplicacao. Roda os testes — se ainda passam, voce preservou comportamento. Se nao, desfaz e tenta de novo.',
    goal: 'Codigo limpo com suite ainda verde',
    duration: '0-5 min (pula se nao precisa)',
    example: {
      code: `// extrai constantes, renomeia, organiza
const SEP_DEFAULT = ','

function split(str: string, sep = SEP_DEFAULT): string[] {
  return str.split(sep)
}

// PASS: ainda verde — comportamento preservado`,
    },
    pitfall: 'Pular o REFACTOR. Codigo verde feio acumula divida. Refactor e o ganho de design do TDD — sem ele, voce so esta escrevendo teste-depois.',
  },
}

function RedGreenRefactorVisual() {
  const [phase, setPhase] = useState<CyclePhase>('red')
  const [autoCycle, setAutoCycle] = useState(false)

  useEffect(() => {
    if (!autoCycle) return
    const ORDER: CyclePhase[] = ['red', 'green', 'refactor']
    const id = setInterval(() => {
      setPhase(p => ORDER[(ORDER.indexOf(p) + 1) % ORDER.length])
    }, 3500)
    return () => clearInterval(id)
  }, [autoCycle])

  const data = PHASE_DATA[phase]

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", color: FG }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        {(['red', 'green', 'refactor'] as CyclePhase[]).map(p => {
          const pd = PHASE_DATA[p]
          const active = phase === p
          return (
            <button
              key={p}
              onClick={() => { setPhase(p); setAutoCycle(false) }}
              style={{
                padding: '8px 14px',
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                borderRadius: 8,
                border: `2px solid ${active ? pd.color : LINE}`,
                background: active ? `${pd.color}1a` : CARD,
                color: active ? pd.color : FGMUTE,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '.08em',
                transition: 'all .15s ease',
              }}
            >
              {p}
            </button>
          )
        })}
        <button
          onClick={() => setAutoCycle(a => !a)}
          style={{
            marginLeft: 'auto',
            padding: '7px 14px',
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            borderRadius: 8,
            border: `1px solid ${LINE}`,
            background: autoCycle ? `${PRP}20` : CARD,
            color: autoCycle ? PRP : FGMUTE,
            cursor: 'pointer',
          }}
        >
          {autoCycle ? 'Pausar ciclo' : 'Reproduzir ciclo'}
        </button>
      </div>

      <div style={{
        background: CARD,
        border: `2px solid ${data.color}`,
        borderRadius: 12,
        padding: 22,
        boxShadow: `0 0 0 4px ${data.color}10`,
        transition: 'all .25s ease',
      }}>
        <div style={{
          fontSize: 11,
          color: data.color,
          fontWeight: 700,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          {data.label}
        </div>

        <p style={{ fontSize: 13, color: FG, lineHeight: 1.6, margin: '0 0 14px' }}>
          {data.desc}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div style={{
            background: BG,
            border: `1px solid ${LINE}`,
            borderRadius: 8,
            padding: '10px 12px',
          }}>
            <div style={{ fontSize: 9, color: FGMUTE, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Objetivo</div>
            <div style={{ fontSize: 11, color: FG, lineHeight: 1.5 }}>{data.goal}</div>
          </div>
          <div style={{
            background: BG,
            border: `1px solid ${LINE}`,
            borderRadius: 8,
            padding: '10px 12px',
          }}>
            <div style={{ fontSize: 9, color: FGMUTE, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Duracao tipica</div>
            <div style={{ fontSize: 11, color: FG, lineHeight: 1.5 }}>{data.duration}</div>
          </div>
        </div>

        <pre style={{
          background: BG,
          border: `1px solid ${LINE}`,
          borderRadius: 8,
          padding: '12px 14px',
          fontSize: 11,
          color: FG,
          lineHeight: 1.7,
          overflowX: 'auto',
          margin: '0 0 14px',
          whiteSpace: 'pre-wrap',
        }}>
          {data.example.code}
        </pre>

        <div style={{
          background: 'rgba(239,68,68,.06)',
          border: '1px solid rgba(239,68,68,.25)',
          borderRadius: 8,
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 9, color: '#fca5a5', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
            Pitfall mais comum
          </div>
          <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.5 }}>
            {data.pitfall}
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        fontSize: 11,
        color: FGMUTE,
      }}>
        <span style={{ color: RED }}>RED</span>
        <span style={{ color: LINE }}>{'->'}</span>
        <span style={{ color: C }}>GREEN</span>
        <span style={{ color: LINE }}>{'->'}</span>
        <span style={{ color: BLU }}>REFACTOR</span>
        <span style={{ color: LINE }}>{'->'}</span>
        <span style={{ color: FGMUTE, fontStyle: 'italic' }}>(proximo comportamento)</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Test Pyramid vs Ice Cream Cone vs Testing Trophy
// ═══════════════════════════════════════════════════════════════════════════════

type ShapeId = 'pyramid' | 'cone' | 'trophy'

const SHAPE_DATA: Record<ShapeId, {
  label: string
  good: boolean
  desc: string
  layers: { name: string; pct: number; color: string; tip: string }[]
  consequence: string
}> = {
  pyramid: {
    label: 'Piramide (Mike Cohn) — saudavel',
    good: true,
    desc: 'Padrao recomendado: muitos unitarios na base (rapidos, focados), alguns de integracao no meio (validam contratos), poucos E2E no topo (fluxo critico do usuario). Suite roda em segundos, falha aponta direto para o codigo errado.',
    layers: [
      { name: 'E2E', pct: 10, color: RED, tip: 'Browser real (Playwright, Cypress). Valida fluxo completo do usuario. Lentos (s a min), flaky se mal escritos. ~10% do total.' },
      { name: 'Integracao', pct: 20, color: AMB, tip: 'DB real (testcontainers, sqlite in-memory), HTTP, queue. Foca contratos entre componentes. Mocka so recursos externos pagos. ~20%.' },
      { name: 'Unitarios', pct: 70, color: C, tip: 'Funcao/classe isolada. Mocka todas dependencias externas. Roda em ms. Valida logica pura, regras de negocio, edge cases. ~70%.' },
    ],
    consequence: 'CI roda em segundos, falha aponta para arquivo especifico, time confia na suite e mexe sem medo.',
  },
  cone: {
    label: 'Ice Cream Cone — antipattern',
    good: false,
    desc: 'Piramide invertida: muito E2E, pouco unitario. Acontece quando time nao confia na logica isolada e prefere "testar pelo navegador", ou quando design e tao acoplado que nao da para testar unidade.',
    layers: [
      { name: 'E2E (gigante)', pct: 60, color: RED, tip: 'Time gasta horas mantendo. Suite leva 40min. Falha aleatoria toda quinta de manha. Quando quebra, ninguem sabe se foi backend, frontend ou infra.' },
      { name: 'Integracao', pct: 25, color: AMB, tip: 'Tem alguns, mas insuficientes para pegar bugs antes do E2E.' },
      { name: 'Unitarios', pct: 15, color: C, tip: 'Pouquissimos. Geralmente porque codigo e dificil de testar isoladamente — sintoma de design ruim.' },
    ],
    consequence: 'CI demora 40min, suite flaky, time perde confianca, bugs passam para prod, ninguem mexe na suite porque tem medo de quebrar tudo.',
  },
  trophy: {
    label: 'Testing Trophy (Kent C. Dodds) — frontend moderno',
    good: true,
    desc: 'Variacao para frontend: estatica (TypeScript, ESLint) > unitario > INTEGRACAO (mais peso) > E2E. Argumento: integracao testa unidades colaborando — pega bugs que unitarios sozinhos perdem. Bom para apps React/Vue.',
    layers: [
      { name: 'E2E', pct: 10, color: RED, tip: 'Igual a piramide — poucos, fluxos criticos.' },
      { name: 'Integracao', pct: 50, color: AMB, tip: 'O coracao. Testa componente com dados reais (MSW), interacao do usuario (Testing Library). Pega o que unitario perde.' },
      { name: 'Unitarios', pct: 25, color: C, tip: 'Logica pura: validators, formatters, hooks. Menos que na piramide classica.' },
      { name: 'Estatica', pct: 15, color: SKY, tip: 'TypeScript, ESLint, Prettier. "Teste" mais barato que existe — pega categorias inteiras de bug sem rodar codigo.' },
    ],
    consequence: 'Pega bugs de integracao que unitarios puros perdem. Adequado para SPAs onde a maior fonte de bug e UI mal testada.',
  },
}

function PyramidShapesVisual() {
  const [shape, setShape] = useState<ShapeId>('pyramid')
  const [hovered, setHovered] = useState<string | null>(null)
  const data = SHAPE_DATA[shape]

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", color: FG }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {(['pyramid', 'cone', 'trophy'] as ShapeId[]).map(s => {
          const sd = SHAPE_DATA[s]
          const active = shape === s
          return (
            <button
              key={s}
              onClick={() => { setShape(s); setHovered(null) }}
              style={{
                padding: '8px 14px',
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                borderRadius: 8,
                border: `1px solid ${active ? (sd.good ? C : RED) : LINE}`,
                background: active ? (sd.good ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.08)') : CARD,
                color: active ? (sd.good ? '#86efac' : '#fca5a5') : FGMUTE,
                cursor: 'pointer',
              }}
            >
              {sd.label}
            </button>
          )
        })}
      </div>

      <div style={{
        background: CARD,
        border: `1px solid ${LINE}`,
        borderRadius: 12,
        padding: 22,
      }}>
        <p style={{ fontSize: 12, color: FGMUTE, lineHeight: 1.6, margin: '0 0 18px' }}>
          {data.desc}
        </p>

        <div style={{ marginBottom: 18 }}>
          {data.layers.map(layer => {
            const isHovered = hovered === layer.name
            const widthPct = shape === 'cone'
              ? layer.name.startsWith('E2E') ? 100 : layer.name === 'Integracao' ? 70 : 40
              : shape === 'trophy'
                ? layer.name === 'E2E' ? 30 : layer.name === 'Integracao' ? 90 : layer.name === 'Unitarios' ? 60 : 100
                : layer.name === 'E2E' ? 30 : layer.name === 'Integracao' ? 60 : 100
            return (
              <div
                key={layer.name}
                onMouseEnter={() => setHovered(layer.name)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  margin: '0 auto 4px',
                  width: `${widthPct}%`,
                  background: isHovered ? `${layer.color}25` : `${layer.color}10`,
                  border: `1.5px solid ${isHovered ? layer.color : `${layer.color}40`}`,
                  borderRadius: 6,
                  padding: '10px 14px',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                }}
              >
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: layer.color,
                  letterSpacing: '.05em',
                  flex: 1,
                }}>
                  {layer.name}
                </div>
                <div style={{
                  fontSize: 11,
                  color: FGMUTE,
                  fontWeight: 600,
                  minWidth: 40,
                  textAlign: 'right',
                }}>
                  {layer.pct}%
                </div>
              </div>
            )
          })}
        </div>

        <div style={{
          background: BG,
          border: `1px solid ${LINE}`,
          borderRadius: 8,
          padding: '12px 14px',
          fontSize: 11,
          color: FGMUTE,
          lineHeight: 1.7,
          minHeight: 60,
          marginBottom: 12,
        }}>
          {hovered ? (
            <>
              <div style={{
                color: data.layers.find(l => l.name === hovered)?.color,
                fontWeight: 700,
                marginBottom: 6,
                fontSize: 10,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
              }}>
                {hovered}
              </div>
              <div>{data.layers.find(l => l.name === hovered)?.tip}</div>
            </>
          ) : (
            <span style={{ fontStyle: 'italic' }}>
              Passe o mouse em qualquer camada para ver detalhes.
            </span>
          )}
        </div>

        <div style={{
          background: data.good ? 'rgba(34,197,94,.06)' : 'rgba(239,68,68,.06)',
          border: `1px solid ${data.good ? 'rgba(34,197,94,.25)' : 'rgba(239,68,68,.25)'}`,
          borderRadius: 8,
          padding: '11px 14px',
        }}>
          <div style={{
            fontSize: 9,
            color: data.good ? '#86efac' : '#fca5a5',
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            fontWeight: 700,
            marginBottom: 4,
          }}>
            Consequencia
          </div>
          <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
            {data.consequence}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Test Doubles (CardCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const TEST_DOUBLES: CarouselCard[] = [
  {
    name: 'Stub',
    signature: 'const stub = { fetchUser: () => ({ id: 1, name: "Ana" }) }',
    emoji: 's',
    color: SKY,
    use: [
      'Prover dado de entrada que o teste precisa',
      'Substituir dependencia que retorna valor',
      'Quando voce so precisa de um valor canned',
    ],
    dontUse: 'Para verificar se algo foi chamado — stub nao registra interacao. Use mock.',
    difficulty: 1,
  },
  {
    name: 'Mock',
    signature: 'const m = vi.fn(); expect(m).toHaveBeenCalledWith({ id: 1 })',
    emoji: 'm',
    color: AMB,
    use: [
      'Verificar interacao: mandou email? chamou pagamento? notificou?',
      'Testar protocolo de comunicacao entre objetos',
      'Quando o foco e "foi chamado com X args"',
    ],
    dontUse: 'Para testar estado. Mock excessivo cria "teste de mock" — passa mas nao testa nada util.',
    difficulty: 2,
  },
  {
    name: 'Fake',
    signature: 'class InMemoryRepo { users = new Map(); save(u){ this.users.set(u.id, u) } }',
    emoji: 'f',
    color: C,
    use: [
      'Substituir DB real por implementacao in-memory funcional',
      'Fake clock (vi.useFakeTimers)',
      'Quando voce precisa testar estado real',
    ],
    dontUse: 'Quando o real tambem e barato (sqlite em arquivo). Fake e overhead — manter sincronizado com real.',
    difficulty: 3,
  },
  {
    name: 'Spy',
    signature: 'const spy = vi.spyOn(console, "log"); runApp(); expect(spy).toHaveBeenCalledTimes(2)',
    emoji: 'p',
    color: PRP,
    use: [
      'Observar funcao real sem substituir',
      'Funcao real continua executando — spy so registra',
      'Quando voce quer ambos: comportamento real + verificacao',
    ],
    dontUse: 'Como solucao default. Spy frequente e geralmente sinal de teste de implementacao — refatore para testar comportamento observavel.',
    difficulty: 2,
  },
  {
    name: 'Dummy',
    signature: 'function makeUser(name, dummyEmailService) { ... }',
    emoji: 'd',
    color: FGMUTE,
    use: [
      'Preencher parametro obrigatorio que nao sera usado no teste',
      'Quando o construtor pede colaborador irrelevante',
      'Apenas para satisfazer assinatura',
    ],
    dontUse: 'Quase nunca diretamente. Dummy excessivo indica que a API exige demais — refatore para parametros opcionais.',
    difficulty: 1,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — F.I.R.S.T (CardCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const FIRST_PRINCIPLES: CarouselCard[] = [
  {
    name: 'Fast',
    signature: 'expect(fn(input)).toBe(output) // ms — sem I/O, sem sleep',
    emoji: 'F',
    color: C,
    use: [
      'Mocka todo I/O (rede, DB, fs, clock)',
      'Evita sleep e setTimeout reais',
      'Suite inteira em poucos segundos',
    ],
    dontUse: 'Teste lento (segundos) nao roda — vira ritual ignorado. Se precisa de DB real, e teste de integracao, nao unitario.',
    difficulty: 2,
  },
  {
    name: 'Independent',
    signature: 'beforeEach(() => { db = new InMemoryDb() }) // setup isolado',
    emoji: 'I',
    color: BLU,
    use: [
      'Cada teste cria seus dados',
      'Zero estado global compartilhado',
      'Pode rodar isolado, em qualquer ordem, em paralelo',
    ],
    dontUse: 'Variavel global mutavel. beforeAll com estado mutavel. Teste depende de outro ter rodado antes — flake garantido.',
    difficulty: 2,
  },
  {
    name: 'Repeatable',
    signature: 'vi.useFakeTimers(); vi.setSystemTime(new Date("2024-01-01"))',
    emoji: 'R',
    color: AMB,
    use: [
      'Mesmo resultado em qualquer maquina, qualquer momento',
      'Sem rede externa, sem clock real',
      'Sem dado de producao, sem estado fora do controle',
    ],
    dontUse: 'Math.random sem seed. Date.now sem mock. fetch para servico real. Teste passa terca de manha mas falha sexta a noite.',
    difficulty: 2,
  },
  {
    name: 'Self-validating',
    signature: 'expect(result).toBe(expected) // boolean explicito',
    emoji: 'S',
    color: PRP,
    use: [
      'Resultado e booleano: passa ou falha',
      'expect explicito com valor esperado',
      'Mensagem descritiva quando falha',
    ],
    dontUse: 'console.log com "olhar e julgar". Teste que so loga e nao falha. Comparacao manual via inspecao visual.',
    difficulty: 1,
  },
  {
    name: 'Timely',
    signature: '// teste escrito JUNTO com codigo, nao "depois quando der tempo"',
    emoji: 'T',
    color: SEC,
    use: [
      'TDD: teste antes do codigo',
      'PR sem teste = revisao bloqueada',
      'Teste e parte do entregavel, nao opcional',
    ],
    dontUse: 'Deixar para "quando der tempo" — nao da. Teste velho cresce divida igual codigo velho. PR de feature sem teste deve ser bloqueado.',
    difficulty: 2,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — TDD Kata FizzBuzz (CodeStepper)
// ═══════════════════════════════════════════════════════════════════════════════

const FIZZBUZZ_SCENARIO: CodeStepperScenario = {
  id: 'fizzbuzz-tdd',
  label: 'FizzBuzz com TDD puro',
  language: 'typescript',
  code: `// Iter 1 — RED
test('numero comum retorna como string', () => {
  expect(fizzbuzz(1)).toBe('1')
})

// Iter 1 — GREEN
function fizzbuzz(n: number): string {
  return String(n)
}

// Iter 2 — RED
test('multiplo de 3 retorna Fizz', () => {
  expect(fizzbuzz(3)).toBe('Fizz')
})

// Iter 2 — GREEN
function fizzbuzz(n: number): string {
  if (n % 3 === 0) return 'Fizz'
  return String(n)
}

// Iter 3 — RED + GREEN: Buzz para multiplo de 5
function fizzbuzz(n: number): string {
  if (n % 3 === 0) return 'Fizz'
  if (n % 5 === 0) return 'Buzz'
  return String(n)
}

// Iter 4 — RED: 15 deve dar FizzBuzz (caso combinado)
function fizzbuzz(n: number): string {
  if (n % 15 === 0) return 'FizzBuzz'
  if (n % 3 === 0) return 'Fizz'
  if (n % 5 === 0) return 'Buzz'
  return String(n)
}

// Iter 5 — REFACTOR: padrao de concatenacao revela
function fizzbuzz(n: number): string {
  let r = ''
  if (n % 3 === 0) r += 'Fizz'
  if (n % 5 === 0) r += 'Buzz'
  return r || String(n)
}`,
  steps: [
    {
      lineStart: 1,
      lineEnd: 4,
      title: 'RED #1 — primeiro teste falha',
      explanation: 'Comece pelo caso mais simples: numero comum vira string. Roda. Falha porque fizzbuzz nao existe. O vermelho garante que o teste mede algo real.',
      output: 'FAIL: ReferenceError: fizzbuzz is not defined',
      callStack: ['test runner -> teste #1 -> fizzbuzz(1)'],
    },
    {
      lineStart: 6,
      lineEnd: 9,
      title: 'GREEN #1 — codigo MINIMO',
      explanation: 'Mais simples possivel. String(n) ja resolve. Sem ifs, sem optimizacao prematura. "Fake it till you make it" — Kent Beck. A generalizacao vem com proximo teste.',
      output: 'PASS: 1 test (1)',
      memory: { 'fizzbuzz': 'String(n)', 'comportamento provado': 'numero -> string' },
    },
    {
      lineStart: 11,
      lineEnd: 14,
      title: 'RED #2 — multiplo de 3',
      explanation: 'Novo comportamento, novo teste. fizzbuzz(3) deve retornar "Fizz". Roda. Falha — String(3) e "3", nao "Fizz". O teste FORCA a generalizacao.',
      output: 'FAIL: expected "3" to be "Fizz"',
    },
    {
      lineStart: 16,
      lineEnd: 19,
      title: 'GREEN #2 — adiciona caso de 3',
      explanation: 'Adiciona o if mais simples. Codigo cresce so o necessario para o novo teste passar. Os dois testes passam — voce sabe que nao quebrou o comportamento anterior.',
      output: 'PASS: 2 tests (1, 3)',
      memory: { 'fizzbuzz': 'if 3 -> Fizz, else String(n)', 'tests passing': '2' },
    },
    {
      lineStart: 21,
      lineEnd: 26,
      title: 'Iter 3 — Buzz (mesma logica)',
      explanation: 'Adiciona caso de 5. Continua simetrico ao caso de 3. Ainda nao precisa generalizar — proximo teste vai forcar.',
      output: 'PASS: 3 tests (1, 3, 5)',
    },
    {
      lineStart: 28,
      lineEnd: 34,
      title: 'Iter 4 — FizzBuzz (combinado, ordem importa)',
      explanation: 'Caso de 15: ambos os ifs disparam. Sem o caso explicito de 15 vindo PRIMEIRO, retornaria so "Fizz". A ordem revela uma sutileza que so apareceu por causa do teste.',
      output: 'PASS: 4 tests (1, 3, 5, 15)',
      memory: { 'descoberta': 'ordem dos ifs importa quando casos se sobrepoem' },
    },
    {
      lineStart: 36,
      lineEnd: 41,
      title: 'REFACTOR — concatenacao revela o padrao',
      explanation: 'Suite verde, hora de melhorar. O padrao "se 3 + se 5" ja sugere concatenacao. Refatora para construcao incremental. Roda — todos passam. Comportamento preservado, codigo mais elegante.',
      output: 'PASS: 4 tests (refactor preservou)',
      memory: { 'design emergente': 'do hardcoded ao padrao geral, forcado por testes' },
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — London vs Chicago school (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const SCHOOL_OPTIONS: ComparisonOption[] = [
  { id: 'london', label: 'London / Outside-in', sublabel: 'mockist', color: SKY },
  { id: 'chicago', label: 'Chicago / Inside-out', sublabel: 'classicist', color: AMB },
]

const SCHOOL_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'starting',
    label: 'Por onde comeca',
    category: 'Filosofia',
    description: 'Em que parte do sistema voce escreve o primeiro teste',
    values: {
      london:  { rating: 'good', note: 'Pelo topo (UI, controller) — mocka colaboradores' },
      chicago: { rating: 'good', note: 'Pelo coracao (entidades, valores) — sem mock' },
    },
  },
  {
    id: 'mocks',
    label: 'Uso de mocks',
    category: 'Pratica',
    description: 'Quao agressivo e o mock de dependencias',
    values: {
      london:  { rating: 'fair',      note: 'Pesado — mocka quase tudo. Risco de "teste de mock"' },
      chicago: { rating: 'excellent', note: 'Mock so na fronteira (rede, DB). Resto roda real' },
    },
  },
  {
    id: 'design',
    label: 'Design emergente',
    category: 'Filosofia',
    description: 'Como a arquitetura emerge dos testes',
    values: {
      london:  { rating: 'excellent', note: 'Forte: forca contratos entre objetos desde cedo' },
      chicago: { rating: 'good',      note: 'Mais natural: design vem da colaboracao real' },
    },
  },
  {
    id: 'speed',
    label: 'Velocidade da suite',
    category: 'Operacao',
    description: 'Quanto tempo a suite leva',
    values: {
      london:  { rating: 'excellent', note: 'Super rapida — quase tudo mockado' },
      chicago: { rating: 'good',      note: 'Mais lenta — alguns testes envolvem stack maior' },
    },
  },
  {
    id: 'refactor',
    label: 'Resiliencia a refactor',
    category: 'Manutencao',
    description: 'Testes sobrevivem a mudanca de implementacao?',
    values: {
      london:  { rating: 'fair',      note: 'Frageis: muitos mocks acoplam ao design interno' },
      chicago: { rating: 'excellent', note: 'Robustos: testam comportamento, nao chamadas' },
    },
  },
  {
    id: 'when',
    label: 'Quando usar',
    category: 'Pratica',
    description: 'Contexto ideal para cada escola',
    values: {
      london:  { rating: 'good', note: 'Sistema com muita colaboracao entre objetos (microservicos, eventos)' },
      chicago: { rating: 'good', note: 'Logica de dominio rica (calculo, regras de negocio, parser)' },
    },
  },
  {
    id: 'risks',
    label: 'Risco principal',
    category: 'Filosofia',
    description: 'O que pode dar errado',
    values: {
      london:  { rating: 'poor', note: 'Teste de implementacao — passa mas mock mente vs realidade' },
      chicago: { rating: 'fair', note: 'Suite mais lenta, fronteiras com I/O exigem fakes ou integracao' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns
// ═══════════════════════════════════════════════════════════════════════════════

const TDD_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Testar implementacao em vez de comportamento',
    wrong: [
      [{ text: '// Quebra a cada refactor mesmo sem mudar comportamento', color: RED }],
      [{ text: "test('login chama validateEmail e validatePassword', () => {", color: FGMUTE }],
      [{ text: '  const valEmail = vi.spyOn(svc, "validateEmail")', color: RED }],
      [{ text: '  const valPwd   = vi.spyOn(svc, "validatePassword")', color: RED }],
      [{ text: '  svc.login("a@b.com", "pwd")', color: FGMUTE }],
      [{ text: '  expect(valEmail).toHaveBeenCalled()', color: RED }, { text: '   // implementacao!', color: '#6b7280' }],
      [{ text: '  expect(valPwd).toHaveBeenCalled()', color: RED }],
      [{ text: '})', color: FGMUTE }],
    ],
    right: [
      [{ text: '// Sobrevive a qualquer refactor', color: C }],
      [{ text: "test('login retorna token para credenciais validas', () => {", color: FGMUTE }],
      [{ text: '  const { token, error } = svc.login("a@b.com", "pwd")', color: FGMUTE }],
      [{ text: '  expect(token).toMatch(/^jwt\\./)', color: C }, { text: '       // observavel', color: '#6b7280' }],
      [{ text: '  expect(error).toBeNull()', color: C }],
      [{ text: '})', color: FGMUTE }],
      [{ text: '', color: FGMUTE }],
      [{ text: "test('login retorna erro para email invalido', () => {", color: FGMUTE }],
      [{ text: '  const { token, error } = svc.login("invalido", "pwd")', color: FGMUTE }],
      [{ text: '  expect(error).toBe("email invalido")', color: C }],
      [{ text: '})', color: FGMUTE }],
    ],
    why: 'Acoplar teste a chamada interna (verificar que metodo X chamou Y) e receita de teste fragil. Quebra a cada refactor mesmo sem mudar comportamento. Foque no contrato observavel: dado entrada X, retorno e Y.',
  },
  {
    title: 'Mockar tudo — teste de mock',
    wrong: [
      [{ text: "test('processa user', async () => {", color: FGMUTE }],
      [{ text: '  const repo = vi.fn().mockResolvedValue({ id: 1 })', color: RED }],
      [{ text: '  const log  = vi.fn()', color: RED }],
      [{ text: '  const cache= vi.fn().mockResolvedValue(null)', color: RED }],
      [{ text: '  const email= vi.fn().mockResolvedValue(true)', color: RED }],
      [{ text: '  const ana  = vi.fn().mockReturnValue("clean")', color: RED }],
      [{ text: '  // Tudo mockado — nao testa nada real!', color: RED }],
      [{ text: '})', color: FGMUTE }],
    ],
    right: [
      [{ text: "test('processa user', async () => {", color: FGMUTE }],
      [{ text: '  // Mock SO a fronteira: rede externa', color: C }],
      [{ text: '  const externalApi = vi.fn().mockResolvedValue({ ok: true })', color: C }],
      [{ text: '  // Resto roda real (in-memory):', color: C }],
      [{ text: '  const repo  = new InMemoryRepo()', color: C }],
      [{ text: '  const cache = new InMemoryCache()', color: C }],
      [{ text: '  const result = await processar({ repo, cache, externalApi })', color: FGMUTE }],
      [{ text: '  expect(result.status).toBe("ok")', color: C }],
      [{ text: '})', color: FGMUTE }],
    ],
    why: 'Quando voce mocka 5 colaboradores num teste, voce esta testando o mock, nao o codigo. Mock so a fronteira (rede, DB, clock, fs); o resto roda real ou via fakes (in-memory). Senao, mock pode mentir e prod quebra.',
  },
  {
    title: 'Estado compartilhado entre testes — flake',
    wrong: [
      [{ text: 'let users = []', color: RED }, { text: '   // global!', color: '#6b7280' }],
      [{ text: '', color: FGMUTE }],
      [{ text: "test('cria user', () => {", color: FGMUTE }],
      [{ text: '  users.push({ id: 1, name: "Ana" })', color: RED }],
      [{ text: '  expect(users).toHaveLength(1)', color: RED }],
      [{ text: '})', color: FGMUTE }],
      [{ text: '', color: FGMUTE }],
      [{ text: "test('lista users', () => {", color: FGMUTE }],
      [{ text: '  expect(users).toHaveLength(1)', color: RED }, { text: '  // depende do anterior!', color: '#6b7280' }],
      [{ text: '})', color: FGMUTE }],
    ],
    right: [
      [{ text: 'let users: User[]', color: C }],
      [{ text: '', color: FGMUTE }],
      [{ text: 'beforeEach(() => {', color: C }, { text: '  // setup isolado', color: '#6b7280' }],
      [{ text: '  users = []', color: C }],
      [{ text: '})', color: FGMUTE }],
      [{ text: '', color: FGMUTE }],
      [{ text: "test('cria user', () => {", color: FGMUTE }],
      [{ text: '  users.push({ id: 1, name: "Ana" })', color: C }],
      [{ text: '  expect(users).toHaveLength(1)', color: C }],
      [{ text: '})', color: FGMUTE }],
      [{ text: '', color: FGMUTE }],
      [{ text: "test('lista users', () => {", color: FGMUTE }],
      [{ text: '  expect(users).toHaveLength(0)', color: C }, { text: '  // independente', color: '#6b7280' }],
      [{ text: '})', color: FGMUTE }],
    ],
    why: 'Estado global mutavel entre testes garante flake. Teste passa sozinho mas falha em paralelo, ou em ordem aleatoria. beforeEach com setup isolado e a regra. Rode com --shuffle (ordem aleatoria) para revelar dependencias.',
  },
  {
    title: 'Cobertura como meta — fraude legitimada',
    wrong: [
      [{ text: '// 100% coverage — mas nao testa nada', color: RED }],
      [{ text: 'function ehAdulto(idade: number) {', color: FGMUTE }],
      [{ text: '  return idade >= 18', color: FGMUTE }],
      [{ text: '}', color: FGMUTE }],
      [{ text: '', color: FGMUTE }],
      [{ text: "test('ehAdulto', () => {", color: FGMUTE }],
      [{ text: '  ehAdulto(20)', color: RED }, { text: '   // executa mas nao verifica!', color: '#6b7280' }],
      [{ text: '  ehAdulto(10)', color: RED }],
      [{ text: '})', color: FGMUTE }],
    ],
    right: [
      [{ text: '// Table-driven — testa boundaries', color: C }],
      [{ text: 'test.each([', color: C }],
      [{ text: '  [17, false],', color: C }],
      [{ text: '  [18, true],', color: C }, { text: '  // boundary', color: '#6b7280' }],
      [{ text: '  [19, true],', color: C }],
      [{ text: '  [0, false],', color: C }],
      [{ text: "])('ehAdulto(%i) === %s', (idade, esperado) => {", color: FGMUTE }],
      [{ text: '  expect(ehAdulto(idade)).toBe(esperado)', color: C }],
      [{ text: '})', color: FGMUTE }],
      [{ text: '// Mutation testing (Stryker) confirma qualidade', color: C }],
    ],
    why: '90% de coverage com asserts vazios e teatro. 60% com asserts duros vale mais. Use mutation testing (Stryker) para medir qualidade real — a ferramenta muda seu codigo (= em !=, + em -) e checa se algum teste pega. Coverage como KPI vira fraude.',
  },
  {
    title: 'Snapshot gigante e instavel',
    wrong: [
      [{ text: "test('renderiza pagina', () => {", color: FGMUTE }],
      [{ text: '  const out = render(<App />)', color: FGMUTE }],
      [{ text: '  expect(out).toMatchSnapshot()', color: RED }],
      [{ text: '  // gera 1000+ linhas com timestamps,', color: RED }],
      [{ text: '  // ids gerados, datas — falsos positivos', color: RED }],
      [{ text: '  // a cada commit', color: RED }],
      [{ text: '})', color: FGMUTE }],
    ],
    right: [
      [{ text: "test('renderiza pagina com titulo correto', () => {", color: FGMUTE }],
      [{ text: '  const out = render(<App />)', color: FGMUTE }],
      [{ text: '  expect(out.getByRole("heading"))', color: C }],
      [{ text: '    .toHaveTextContent("Dashboard")', color: C }],
      [{ text: '  expect(out.getByRole("button", {', color: C }],
      [{ text: '    name: /salvar/i }))', color: C }],
      [{ text: '    .toBeEnabled()', color: C }],
      [{ text: '})', color: FGMUTE }],
      [{ text: '// snapshot so para estrutura estatica pequena', color: C }],
    ],
    why: 'Snapshot grande tem dados volateis (timestamps, IDs) e gera falso positivo. Dev acaba aceitando o "update snapshot" sem ler — sumir com regressoes reais. Prefira asserts explicitos para estrutura critica. Snapshot so para output pequeno e estavel.',
  },
  {
    title: 'Teste assincrono mal escrito',
    wrong: [
      [{ text: "test('busca user', () => {", color: FGMUTE }],
      [{ text: '  fetchUser(1).then(u => {', color: RED }],
      [{ text: '    expect(u.name).toBe("Ana")', color: RED }, { text: '   // teste acaba antes do then!', color: '#6b7280' }],
      [{ text: '  })', color: RED }],
      [{ text: '})', color: FGMUTE }],
      [{ text: '// Ou sem await:', color: FGMUTE }],
      [{ text: "test('rejeita id invalido', async () => {", color: FGMUTE }],
      [{ text: '  expect(fetchUser(-1)).rejects.toThrow()', color: RED }, { text: '   // sem await/return!', color: '#6b7280' }],
      [{ text: '})', color: FGMUTE }],
    ],
    right: [
      [{ text: "test('busca user', async () => {", color: C }],
      [{ text: '  const user = await fetchUser(1)', color: C }],
      [{ text: '  expect(user.name).toBe("Ana")', color: C }],
      [{ text: '})', color: FGMUTE }],
      [{ text: '', color: FGMUTE }],
      [{ text: "test('rejeita id invalido', async () => {", color: C }],
      [{ text: '  await expect(fetchUser(-1))', color: C }],
      [{ text: '    .rejects.toThrow("id invalido")', color: C }],
      [{ text: '})', color: FGMUTE }],
    ],
    why: 'Sem await/return, o teste acaba antes do assert rodar — passa silenciosamente. Use async/await para clareza. Em rejects/resolves, sempre await ou return da promise. Teste que nunca falha e teatro.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Quando usar TDD (decision tree)
// ═══════════════════════════════════════════════════════════════════════════════

const TDD_ROOT: DTNode = {
  id: 'root',
  question: 'Que tipo de codigo voce vai escrever?',
  detail: 'TDD nao vale sempre. A regra de ouro: voce sabe ate onde quer chegar? Se sim, TDD ajuda. Se esta explorando, faca spike e jogue fora.',
  children: [
    { label: 'Logica de negocio / regra / parser', nodeId: 'business', color: C },
    { label: 'UI / estilo / layout visual', nodeId: 'ui', color: PRP },
    { label: 'Bug fix em codigo existente', nodeId: 'bug', color: AMB },
    { label: 'Integracao com API/sistema desconhecido', nodeId: 'unknown', color: SKY },
    { label: 'Refactor de codigo legacy sem teste', nodeId: 'legacy', color: SEC },
    { label: 'Prototipo / spike de exploracao', nodeId: 'spike', color: RED },
  ],
}

const TDD_NODES: Record<string, DTNode> = {
  business: {
    id: 'business',
    recommendation: 'Use TDD — caso classico',
    detail: 'Calculo de imposto, validacao de regras, parser, state machine, formatadores. TDD brilha aqui — voce sabe entrada e saida esperada, e o design emerge dos testes. Use AAA, table-driven tests para cobrir edge cases, e considere mutation testing (Stryker) em logica critica.',
    color: C,
    icon: 'OK',
  },
  ui: {
    id: 'ui',
    recommendation: 'TDD parcial — testa logica, nao layout',
    detail: 'Estilo visual e layout sao subjetivos — nao caem em assert. Para UI, use: Testing Library para comportamento (clicar botao mostra modal), Chromatic ou Percy para teste visual de regressao, Storybook para isolamento. TDD vale para hooks, validators, transformacoes — nao para "essa cor esta certa?".',
    color: PRP,
    icon: '~',
  },
  bug: {
    id: 'bug',
    recommendation: 'TDD obrigatorio — escreva o teste que reproduz primeiro',
    detail: 'O teste reproduzindo o bug e a melhor coisa que voce faz. Garante que o bug existe (test failing), forca voce a entender a causa (nao so sintoma), serve como regression test eterno (volta a falhar se alguem reintroduzir). Pratica universal — todo time maduro exige.',
    color: AMB,
    icon: 'OK',
  },
  unknown: {
    id: 'unknown',
    recommendation: 'NAO use TDD — faca spike, jogue fora, depois TDD',
    detail: 'Tentar TDD em API que voce nao conhece e perda de tempo — voce inventa testes baseados em suposicao. Faca um spike: codigo exploratorio, sem teste, so para entender a forma da resposta, comportamentos estranhos, edge cases reais. JOGUE FORA o spike. Depois reescreva com TDD ja sabendo o que esperar.',
    color: SKY,
    icon: 'X',
  },
  legacy: {
    id: 'legacy',
    recommendation: 'Use TDD com Golden Master primeiro',
    detail: 'Codigo legacy sem teste e paradoxo: nao da para refatorar sem rede, mas nao da para testar sem refatorar. Solucao (Feathers, Working Effectively with Legacy Code): characterization test / golden master — captura output atual com inputs reais como snapshot. Refatora com snapshot verde. Depois substitua snapshot por asserts especificos.',
    color: SEC,
    icon: 'OK',
  },
  spike: {
    id: 'spike',
    recommendation: 'NAO use TDD — codigo descartavel',
    detail: 'Prototipo, POC, hack para validar hipotese — voce vai jogar fora. TDD em codigo descartavel e overhead. Faca rapido, valide aprendizado, JOGUE FORA. Se a hipotese vingou, reescreva com TDD pra valer. Forcar TDD em tudo e dogma — perde tempo em codigo que voce descobre que precisa jogar fora.',
    color: RED,
    icon: 'X',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — Jornada TDD
// ═══════════════════════════════════════════════════════════════════════════════

const TDD_LEVELS: ProgressionLevel[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    label: 'Fundamentos',
    emoji: '01',
    concepts: [
      { name: 'Red-Green-Refactor', tip: 'O ciclo. RED: teste falha. GREEN: codigo minimo. REFACTOR: limpa com suite verde.' },
      { name: 'AAA — Arrange/Act/Assert', tip: '3 blocos visuais separados por linha em branco. 1 Act por teste, asserts focados.' },
      { name: 'expect(x).toBe(y)', tip: 'Igualdade estrita. .toEqual para profundo. .toThrow para erros.' },
      { name: 'beforeEach / afterEach', tip: 'Setup e teardown isolados — base para Independent (do F.I.R.S.T).' },
      { name: 'Vitest / Jest setup minimo', tip: 'Frameworks atuais. Vitest e o padrao para projetos novos com Vite.' },
      { name: 'Kata FizzBuzz em TDD puro', tip: 'Pratica. Sem antecipar — deixe os testes forcarem a generalizacao.' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Pratica diaria',
    emoji: '02',
    concepts: [
      { name: 'F.I.R.S.T', tip: 'Fast, Independent, Repeatable, Self-validating, Timely. Falhar uma e red flag.' },
      { name: 'Mocks vs Stubs vs Fakes vs Spies', tip: 'Mock: verifica chamada. Stub: retorna valor. Fake: implementacao real simplificada. Spy: observa real.' },
      { name: 'Piramide de testes', tip: '70/20/10. Muitos unitarios, alguns integracao, poucos E2E.' },
      { name: 'Bug fix com test-first', tip: 'Teste reproduzindo o bug PRIMEIRO. Garante regression test eterno.' },
      { name: 'Table-driven testes (test.each)', tip: 'Mesmo teste com varios inputs. Cobre edge cases sem repetir codigo.' },
      { name: 'Testar comportamento, nao implementacao', tip: 'Foque no contrato observavel (entrada -> saida), nao em chamadas internas.' },
      { name: 'beforeEach com fakes in-memory', tip: 'InMemoryRepo, fake clock — substitui DB e tempo sem mock excessivo.' },
    ],
  },
  {
    id: 'senior',
    name: 'Senior',
    label: 'Decisoes de design',
    emoji: '03',
    concepts: [
      { name: 'TDD em hexagonal / clean arch', tip: 'Use cases testam contra fakes de ports. Adapter testa contra real (Testcontainers).' },
      { name: 'Mutation testing (Stryker)', tip: 'Mede QUALIDADE dos asserts. 80%+ score em codigo critico.' },
      { name: 'Property-based testing (fast-check)', tip: 'Gera centenas de inputs aleatorios. Pega edge cases que humano nao imagina.' },
      { name: 'Golden master para legacy', tip: 'Characterization test antes de refatorar codigo sem teste.' },
      { name: 'Testcontainers / sqlite in-memory', tip: 'DB real em teste de integracao — mais fiel que mock, mais rapido que CI compartilhada.' },
      { name: 'Quando NAO usar TDD', tip: 'Spike, prototipo, UI puramente visual, integracao com API desconhecida.' },
      { name: 'BDD vs TDD — quando vale Gherkin', tip: 'BDD vale se PO/QA escreve specs. Em time so de devs, TDD com nomes descritivos basta.' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Cultura e legacy',
    emoji: '04',
    concepts: [
      { name: 'Working Effectively with Legacy Code', tip: 'Feathers — base para qualquer migration de sistema sem teste. Seams, sprout method, strangler fig.' },
      { name: 'Contract testing (Pact)', tip: 'Mock que mente vs real e o problema. Contract testing valida contratos entre servicos.' },
      { name: 'Approval testing', tip: 'Generaliza golden master — qualquer output complexo virado spec executavel.' },
      { name: 'Cultura de TDD em time', tip: 'PR sem teste = bloqueado. Mob programming TDD para difundir. Coverage como sinal, nao KPI.' },
      { name: 'Test smell taxonomy', tip: 'Reconhecer Long Test, Mystery Guest, Eager Test, Conditional Logic — antes que cause flakiness.' },
      { name: 'Velocidade vs cobertura', tip: 'Suite que demora 30min mata TDD na pratica. Quando passar de 5min, refatorar a suite e prioridade alta.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function TddVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'red-green-refactor',
      title: 'Red-Green-Refactor — o ciclo passo a passo',
      subtitle: 'Cada fase, objetivo, duracao tipica e pitfall mais comum',
      accent: C,
      component: <RedGreenRefactorVisual />,
    },
    {
      id: 'fizzbuzz-kata',
      title: 'Kata FizzBuzz — TDD puro do zero',
      subtitle: '5 iteracoes mostrando como o design emerge dos testes',
      accent: AMB,
      component: (
        <CodeStepper
          scenarios={[FIZZBUZZ_SCENARIO]}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'pyramid-shapes',
      title: 'Piramide vs Ice Cream Cone vs Trophy',
      subtitle: 'O ratio saudavel, o antipattern e a evolucao para frontend',
      accent: SKY,
      component: <PyramidShapesVisual />,
    },
    {
      id: 'first',
      title: 'F.I.R.S.T — propriedades de um bom teste',
      subtitle: 'Fast, Independent, Repeatable, Self-validating, Timely — passe o mouse',
      accent: BLU,
      component: (
        <CardCarousel
          cards={FIRST_PRINCIPLES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'test-doubles',
      title: 'Test doubles — Stub, Mock, Fake, Spy, Dummy',
      subtitle: 'Quando usar cada um — e quando NAO usar (mock excessivo)',
      accent: PRP,
      component: (
        <CardCarousel
          cards={TEST_DOUBLES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'london-vs-chicago',
      title: 'London vs Chicago — Outside-in vs Inside-out',
      subtitle: 'As duas escolas de TDD comparadas em 7 dimensoes',
      accent: AMB,
      component: (
        <ComparisonTable
          options={SCHOOL_OPTIONS}
          criteria={SCHOOL_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns de teste',
      subtitle: 'Os 6 erros mais comuns — testar implementacao, mockar tudo, snapshot, etc',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={TDD_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'when-tdd',
      title: 'Quando usar TDD?',
      subtitle: 'Arvore de decisao por tipo de codigo — TDD nao vale sempre',
      accent: SEC,
      component: (
        <DecisionTree
          root={TDD_ROOT}
          nodes={TDD_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'progression',
      title: 'Jornada TDD — do iniciante ao especialista',
      subtitle: 'Fundamentos -> pratica diaria -> decisoes de design -> cultura e legacy',
      accent: C,
      component: (
        <ProgressionMap
          levels={TDD_LEVELS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          heading="Dominio TDD"
          description="Clique em qualquer conceito para ver a dica. Marque os que ja domina."
        />
      ),
    },
  ]

  // suppress unused warnings
  void LINE; void FG; void FGMUTE; void SEC; void RED; void BLU; void AMB; void SKY; void PRP

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
