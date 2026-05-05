'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'

// ── Paleta global ───────────────────────────────────────────────────────────────
const C      = '#61DAFB'   // React aqua
const C_DIM  = '#21b8e3'
const BG     = '#0f172a'   // navy
const CARD   = '#1e293b'
const CARD2  = '#243044'
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

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — "Como o React Pensa" — Carrossel de Conceitos Fundamentais
// ═══════════════════════════════════════════════════════════════════════════════

type Slide = {
  title: string
  paragraphs: string[]
  gradient: [string, string]
  illustration: React.ReactNode
}

function SlideIllustrationLibrary() {
  // Slide 1: React é uma biblioteca de UI
  return (
    <div style={{ position: 'relative', width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60 }}>
      <div style={{
        width: 110, height: 110, borderRadius: 16,
        background: `linear-gradient(135deg, ${C}40, ${C}10)`,
        border: `2px solid ${C}`, boxShadow: `0 0 30px ${C}50`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 42, color: C, fontWeight: 800,
      }}>
        ⚛
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 11, color: MUTE, textAlign: 'center', marginBottom: 4 }}>render →</div>
        <div style={{ fontSize: 24, color: FGMUTE }}>━━━▶</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: 4,
            background: i === 4 ? `${GRN}30` : `${LINE}50`,
            border: `1px solid ${i === 4 ? GRN : LINE}`,
          }} />
        ))}
      </div>
    </div>
  )
}

function SlideIllustrationFunction() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'center', height: 200 }}>
      <div style={{
        background: BG, border: `1px solid ${C}40`, borderRadius: 10, padding: 14,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.7,
      }}>
        <div><span style={{ color: PRP }}>function</span> <span style={{ color: GRN }}>Hello</span>() {'{'}</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: PRP }}>return</span> <span style={{ color: AMB }}>{'<'}</span><span style={{ color: SKY }}>h1</span><span style={{ color: AMB }}>{'>'}</span>Olá<span style={{ color: AMB }}>{'</'}</span><span style={{ color: SKY }}>h1</span><span style={{ color: AMB }}>{'>'}</span></div>
        <div>{'}'}</div>
      </div>
      <div style={{ fontSize: 28, color: C }}>→</div>
      <div style={{
        background: BG, border: `2px solid ${GRN}50`, borderRadius: 10, padding: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, fontWeight: 800, color: FG,
      }}>
        Olá
      </div>
    </div>
  )
}

function SlideIllustrationState() {
  const [pulse, setPulse] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setPulse(p => p + 1), 1400)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ position: 'relative', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 50 }}>
      <div style={{
        width: 130, padding: 16, borderRadius: 12,
        background: `${RED}15`, border: `2px solid ${RED}80`,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 10, color: RED, fontWeight: 700, marginBottom: 8 }}>STATE</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: RED, fontFamily: "'JetBrains Mono', monospace" }}>
          {pulse}
        </div>
        <div style={{ fontSize: 10, color: FGMUTE, marginTop: 6 }}>count</div>
      </div>
      <div style={{ fontSize: 28, color: AMB }}>⚡</div>
      <div style={{
        width: 110, height: 110, borderRadius: 12,
        background: pulse % 2 === 0 ? `${C}30` : `${C}10`,
        border: `2px solid ${C}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .25s',
        boxShadow: pulse % 2 === 0 ? `0 0 24px ${C}60` : 'none',
      }}>
        <div style={{ color: C, fontWeight: 800, fontSize: 13 }}>{'<Counter />'}</div>
      </div>
    </div>
  )
}

function SlideIllustrationProps() {
  return (
    <svg viewBox="0 0 600 200" style={{ width: '100%', height: 200 }}>
      <defs>
        <marker id="arrDown" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
          <path d="M0,0 L8,0 L4,6 z" fill={C} />
        </marker>
      </defs>
      <rect x="240" y="10" width="120" height="40" rx="8" fill={`${C}25`} stroke={C} strokeWidth="2" />
      <text x="300" y="35" fill={C} fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono">Pai</text>

      <line x1="300" y1="50" x2="180" y2="80" stroke={C} strokeWidth="2" markerEnd="url(#arrDown)" />
      <line x1="300" y1="50" x2="420" y2="80" stroke={C} strokeWidth="2" markerEnd="url(#arrDown)" />
      <text x="220" y="68" fill={C} fontSize="9" fontFamily="JetBrains Mono">prop=value</text>
      <text x="380" y="68" fill={C} fontSize="9" fontFamily="JetBrains Mono">prop=value</text>

      <rect x="120" y="85" width="120" height="40" rx="8" fill={`${PRP}25`} stroke={PRP} strokeWidth="2" />
      <text x="180" y="110" fill={PRP} fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono">Filho A</text>

      <rect x="360" y="85" width="120" height="40" rx="8" fill={`${PRP}25`} stroke={PRP} strokeWidth="2" />
      <text x="420" y="110" fill={PRP} fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono">Filho B</text>

      <line x1="180" y1="125" x2="120" y2="160" stroke={C} strokeWidth="2" markerEnd="url(#arrDown)" />
      <line x1="180" y1="125" x2="240" y2="160" stroke={C} strokeWidth="2" markerEnd="url(#arrDown)" />
      <line x1="420" y1="125" x2="480" y2="160" stroke={C} strokeWidth="2" markerEnd="url(#arrDown)" />

      <rect x="65" y="160" width="100" height="32" rx="6" fill={`${SKY}20`} stroke={SKY} strokeWidth="1.5" />
      <text x="115" y="180" fill={SKY} fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono">Neto 1</text>

      <rect x="195" y="160" width="100" height="32" rx="6" fill={`${SKY}20`} stroke={SKY} strokeWidth="1.5" />
      <text x="245" y="180" fill={SKY} fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono">Neto 2</text>

      <rect x="430" y="160" width="100" height="32" rx="6" fill={`${SKY}20`} stroke={SKY} strokeWidth="1.5" />
      <text x="480" y="180" fill={SKY} fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono">Neto 3</text>
    </svg>
  )
}

function SlideIllustrationCallbacks() {
  return (
    <svg viewBox="0 0 600 200" style={{ width: '100%', height: 200 }}>
      <defs>
        <marker id="arrUp" markerWidth="8" markerHeight="8" refX="4" refY="2" orient="auto">
          <path d="M0,8 L8,8 L4,2 z" fill={PINK} />
        </marker>
      </defs>
      <rect x="240" y="10" width="120" height="40" rx="8" fill={`${PINK}25`} stroke={PINK} strokeWidth="2" />
      <text x="300" y="35" fill={PINK} fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono">Pai</text>

      <line x1="180" y1="85" x2="290" y2="55" stroke={PINK} strokeWidth="2" markerEnd="url(#arrUp)" />
      <line x1="420" y1="85" x2="310" y2="55" stroke={PINK} strokeWidth="2" markerEnd="url(#arrUp)" />
      <text x="200" y="78" fill={PINK} fontSize="9" fontFamily="JetBrains Mono">onClick(data)</text>
      <text x="370" y="78" fill={PINK} fontSize="9" fontFamily="JetBrains Mono">onChange(val)</text>

      <rect x="120" y="85" width="120" height="40" rx="8" fill={`${C}20`} stroke={`${C}80`} strokeWidth="2" />
      <text x="180" y="110" fill={C} fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono">Filho A</text>

      <rect x="360" y="85" width="120" height="40" rx="8" fill={`${C}20`} stroke={`${C}80`} strokeWidth="2" />
      <text x="420" y="110" fill={C} fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono">Filho B</text>

      <line x1="115" y1="160" x2="175" y2="130" stroke={PINK} strokeWidth="2" markerEnd="url(#arrUp)" />
      <line x1="245" y1="160" x2="185" y2="130" stroke={PINK} strokeWidth="2" markerEnd="url(#arrUp)" />
      <line x1="480" y1="160" x2="425" y2="130" stroke={PINK} strokeWidth="2" markerEnd="url(#arrUp)" />

      <rect x="65" y="160" width="100" height="32" rx="6" fill={`${SKY}20`} stroke={SKY} strokeWidth="1.5" />
      <text x="115" y="180" fill={SKY} fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono">Neto 1</text>

      <rect x="195" y="160" width="100" height="32" rx="6" fill={`${SKY}20`} stroke={SKY} strokeWidth="1.5" />
      <text x="245" y="180" fill={SKY} fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono">Neto 2</text>

      <rect x="430" y="160" width="100" height="32" rx="6" fill={`${SKY}20`} stroke={SKY} strokeWidth="1.5" />
      <text x="480" y="180" fill={SKY} fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono">Neto 3</text>
    </svg>
  )
}

function SlideIllustrationVDOM() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 18, alignItems: 'center', height: 200 }}>
      <div style={{
        padding: 16, borderRadius: 12,
        background: `${C}10`, border: `2px dashed ${C}80`,
        position: 'relative',
      }}>
        <div style={{ fontSize: 9, color: C, fontWeight: 700, letterSpacing: '.1em', marginBottom: 10 }}>VIRTUAL DOM</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: FGMUTE, lineHeight: 1.7 }}>
          <div>&lt;div&gt;</div>
          <div style={{ paddingLeft: 10 }}>&lt;h1&gt;React&lt;/h1&gt;</div>
          <div style={{ paddingLeft: 10, color: AMB }}>&lt;p&gt;novo&lt;/p&gt;</div>
          <div>&lt;/div&gt;</div>
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 18 }}>📝</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ fontSize: 11, color: AMB, fontWeight: 700 }}>diff</div>
        <div style={{ fontSize: 22, color: AMB }}>→</div>
        <div style={{ fontSize: 11, color: AMB, fontWeight: 700 }}>commit</div>
      </div>

      <div style={{
        padding: 16, borderRadius: 12,
        background: `${GRN}10`, border: `2px solid ${GRN}80`,
        position: 'relative',
      }}>
        <div style={{ fontSize: 9, color: GRN, fontWeight: 700, letterSpacing: '.1em', marginBottom: 10 }}>DOM REAL</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: FGMUTE, lineHeight: 1.7 }}>
          <div>&lt;div&gt;</div>
          <div style={{ paddingLeft: 10 }}>&lt;h1&gt;React&lt;/h1&gt;</div>
          <div style={{ paddingLeft: 10, color: GRN, fontWeight: 700 }}>&lt;p&gt;novo&lt;/p&gt; ✓</div>
          <div>&lt;/div&gt;</div>
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 18 }}>📄</div>
      </div>
    </div>
  )
}

function SlideIllustrationEffect() {
  const items: { label: string; emoji: string; color: string; angle: number }[] = [
    { label: 'API', emoji: '🌐', color: C, angle: 0 },
    { label: 'Timer', emoji: '⏱️', color: AMB, angle: 60 },
    { label: 'WebSocket', emoji: '🔌', color: GRN, angle: 120 },
    { label: 'DOM Event', emoji: '🖱️', color: PRP, angle: 180 },
    { label: 'Storage', emoji: '💾', color: SKY, angle: 240 },
    { label: 'Database', emoji: '🗄️', color: PINK, angle: 300 },
  ]
  return (
    <div style={{ position: 'relative', height: 200 }}>
      <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', position: 'absolute' }}>
        {items.map((it, i) => {
          const rad = (it.angle * Math.PI) / 180
          const x = 200 + Math.cos(rad) * 130
          const y = 100 + Math.sin(rad) * 70
          return (
            <line key={i} x1="200" y1="100" x2={x} y2={y} stroke={it.color} strokeWidth="1.5" strokeDasharray="3,3" opacity={0.6} />
          )
        })}
      </svg>
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 80, height: 80, borderRadius: '50%',
        background: `${C}25`, border: `2px solid ${C}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 30px ${C}60`,
        fontSize: 11, color: C, fontWeight: 800, textAlign: 'center',
        zIndex: 2,
      }}>
        useEffect
      </div>
      {items.map((it, i) => {
        const rad = (it.angle * Math.PI) / 180
        const x = 50 + Math.cos(rad) * 32.5
        const y = 50 + Math.sin(rad) * 35
        return (
          <div key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            width: 56, height: 56, borderRadius: 10,
            background: `${it.color}20`, border: `1.5px solid ${it.color}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 2,
          }}>
            <div style={{ fontSize: 18 }}>{it.emoji}</div>
            <div style={{ fontSize: 8, color: it.color, fontWeight: 700 }}>{it.label}</div>
          </div>
        )
      })}
    </div>
  )
}

function SlideIllustrationConcurrent() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, height: 200 }}>
      <div style={{
        width: 100, height: 100, borderRadius: '50%',
        background: `linear-gradient(135deg, ${C}40, ${C}10)`,
        border: `2px solid ${C}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 30px ${C}50`,
      }}>
        <div style={{ fontSize: 40 }}>👨‍🍳</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { color: RED, emoji: '🔥', label: 'urgent: input', priority: 1 },
          { color: AMB, emoji: '🍳', label: 'normal: render', priority: 2 },
          { color: MUTE, emoji: '🥶', label: 'baixa: log', priority: 3 },
        ].map((p, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 14px', borderRadius: 10,
            background: `${p.color}18`, border: `1.5px solid ${p.color}80`,
            minWidth: 180,
            opacity: i === 0 ? 1 : 0.7 - i * 0.1,
          }}>
            <span style={{ fontSize: 22 }}>{p.emoji}</span>
            <div>
              <div style={{ fontSize: 11, color: p.color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>P{p.priority}</div>
              <div style={{ fontSize: 11, color: FG }}>{p.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const CONCEPT_SLIDES: Slide[] = [
  {
    title: 'React é uma biblioteca de UI',
    paragraphs: [
      'React não é um framework completo — é uma biblioteca focada em uma única tarefa: descrever interfaces de usuário através de componentes.',
      'Você descreve a UI de forma declarativa em JSX, e o React cuida de aplicar as mudanças no DOM real de forma eficiente.',
      'Sem opiniões fortes sobre roteamento, fetch ou estado global. Você escolhe ou compõe — e essa flexibilidade é a força.',
    ],
    gradient: [C, SKY],
    illustration: <SlideIllustrationLibrary />,
  },
  {
    title: 'Componente = função que retorna JSX',
    paragraphs: [
      'Um componente é apenas uma função JavaScript que recebe props e devolve JSX. Sem classes, sem boilerplate — só uma função.',
      'O JSX vira chamadas de React.createElement no build. O que você escreve é açúcar sintático para uma estrutura de objetos.',
      'Componentes pequenos e bem nomeados são a base de toda aplicação React saudável. Pense em peças de Lego.',
    ],
    gradient: [GRN, C],
    illustration: <SlideIllustrationFunction />,
  },
  {
    title: 'Estado é memória que causa re-render',
    paragraphs: [
      'Estado é o que faz a UI viva. Quando você chama setState, o React agenda um novo render daquele componente.',
      'O componente roda novamente, gera um novo JSX, e o React compara com o anterior — só as diferenças vão para o DOM.',
      'Estado é local por padrão. Eleve apenas quando precisar compartilhar entre componentes — princípio "lifting state up".',
    ],
    gradient: [RED, AMB],
    illustration: <SlideIllustrationState />,
  },
  {
    title: 'Props fluem para baixo',
    paragraphs: [
      'Dados em React fluem em uma única direção: do pai para os filhos via props. É o princípio do "one-way data flow".',
      'Esse fluxo previsível torna o debug mais fácil — quando algo está errado, você sobe a árvore até encontrar a origem.',
      'Props são imutáveis dentro do componente filho. Não tente mutar props — sempre use callbacks para sinalizar mudanças.',
    ],
    gradient: [C, PRP],
    illustration: <SlideIllustrationProps />,
  },
  {
    title: 'Callbacks sobem para cima',
    paragraphs: [
      'Quando um filho precisa "avisar" o pai sobre algo, ele chama uma função que recebeu via props — um callback.',
      'O callback é definido no pai (que tem o estado), e o filho apenas o invoca. O estado fica no lugar certo.',
      'Esse padrão é o oposto do fluxo de dados, mas usa a mesma "rodovia" das props. Dados descem, eventos sobem.',
    ],
    gradient: [PINK, RED],
    illustration: <SlideIllustrationCallbacks />,
  },
  {
    title: 'Virtual DOM = rascunho antes do papel',
    paragraphs: [
      'O Virtual DOM é uma representação JavaScript leve do DOM real. React mantém uma cópia atualizada em memória.',
      'A cada render, ele compara a versão nova com a antiga (reconciliação) e calcula o conjunto mínimo de mudanças.',
      'Só então as mudanças são aplicadas ao DOM real — operação cara que o React minimiza ao máximo possível.',
    ],
    gradient: [C, GRN],
    illustration: <SlideIllustrationVDOM />,
  },
  {
    title: 'useEffect = conversa com o mundo externo',
    paragraphs: [
      'A função do componente deve ser pura: mesmo input, mesmo output, sem efeitos colaterais. O JSX é só uma descrição.',
      'useEffect é a porta para tudo que está fora do React: fetch, timers, WebSocket, DOM imperativo, subscriptions.',
      'Sempre retorne uma função de cleanup para desfazer o efeito quando o componente desmontar ou as deps mudarem.',
    ],
    gradient: [C, AMB],
    illustration: <SlideIllustrationEffect />,
  },
  {
    title: 'Concurrent Mode = chef que cozinha em paralelo',
    paragraphs: [
      'No React 18, o render pode ser interrompido. Tarefas urgentes (input do usuário) passam à frente de outras.',
      'Imagine um chef com múltiplas panelas: uma fervendo (urgente), outra refogando (normal), outra marinando (baixa).',
      'useTransition e useDeferredValue são suas ferramentas para marcar atualizações como não-urgentes — UI sempre fluida.',
    ],
    gradient: [PRP, PINK],
    illustration: <SlideIllustrationConcurrent />,
  },
]

function ConceptCarousel() {
  const [idx, setIdx] = useState(0)
  const slide = CONCEPT_SLIDES[idx]
  const next = () => setIdx(i => (i + 1) % CONCEPT_SLIDES.length)
  const prev = () => setIdx(i => (i - 1 + CONCEPT_SLIDES.length) % CONCEPT_SLIDES.length)

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: '.15em', color: C, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
          VISUAL 1 — CONCEITOS FUNDAMENTAIS
        </div>
        <h3 style={{ color: FG, fontSize: 26, fontWeight: 800, margin: '0 0 8px', lineHeight: 1 }}>
          Como o React Pensa
        </h3>
        <p style={{ color: FGMUTE, fontSize: 13, margin: 0 }}>
          Oito slides essenciais. Os mesmos conceitos que separam quem usa React de quem entende React.
        </p>
      </div>

      <div style={{
        position: 'relative',
        height: 460,
        background: BG,
        border: `1px solid ${slide.gradient[0]}30`,
        borderRadius: 18,
        padding: 36,
        backgroundImage: `radial-gradient(ellipse at top right, ${slide.gradient[0]}10 0%, transparent 60%), radial-gradient(ellipse at bottom left, ${slide.gradient[1]}08 0%, transparent 60%)`,
        boxShadow: `0 0 50px ${slide.gradient[0]}15`,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 24, right: 36,
          fontSize: 13, fontWeight: 700, color: MUTE,
          letterSpacing: '.2em',
        }}>
          {String(idx + 1).padStart(2, '0')} / {String(CONCEPT_SLIDES.length).padStart(2, '0')}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, height: '100%', alignItems: 'center' }}>
          <div>
            <h2 style={{
              fontSize: 30, fontWeight: 900, lineHeight: 1.1,
              margin: '0 0 22px',
              background: `linear-gradient(135deg, ${slide.gradient[0]}, ${slide.gradient[1]})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {slide.title}
            </h2>
            {slide.paragraphs.map((p, i) => (
              <p key={i} style={{
                color: FGMUTE, fontSize: 12.5, lineHeight: 1.75,
                margin: '0 0 12px',
              }}>
                {p}
              </p>
            ))}
          </div>

          <div style={{
            background: `${CARD}80`,
            borderRadius: 14, padding: 24,
            border: `1px solid ${LINE}80`,
            backdropFilter: 'blur(8px)',
          }}>
            {slide.illustration}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
        <button onClick={prev} style={{
          width: 52, height: 52, borderRadius: '50%',
          border: `2px solid ${C}50`, background: `${C}15`,
          color: C, fontSize: 22, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .2s',
        }}>
          ◀
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          {CONCEPT_SLIDES.map((_, i) => (
            <button key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 32 : 10, height: 10, borderRadius: 5,
                border: 'none', background: i === idx ? C : LINE,
                cursor: 'pointer', transition: 'all .3s',
                padding: 0,
              }}
            />
          ))}
        </div>

        <button onClick={next} style={{
          width: 52, height: 52, borderRadius: '50%',
          border: `2px solid ${C}50`, background: `${C}15`,
          color: C, fontSize: 22, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .2s',
        }}>
          ▶
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Árvore Fiber — Explorador Visual
// ═══════════════════════════════════════════════════════════════════════════════

type FiberNode = {
  id: string
  name: string
  type: 'host' | 'component' | 'context' | 'memo'
  props?: string[]
  state?: string[]
  children?: FiberNode[]
  tooltip: string
  tip?: string
}

const FIBER_TREE: FiberNode = {
  id: 'root', name: 'createRoot', type: 'host',
  tooltip: 'Ponto de entrada do React 18. Habilita o Concurrent Mode. Substitui o antigo ReactDOM.render(). É aqui que a "fundação" é lançada.',
  tip: 'Em entrevista: cite que createRoot habilita useTransition, automatic batching e Suspense para SSR.',
  children: [
    {
      id: 'app', name: 'App', type: 'component',
      state: ['user', 'theme'],
      tooltip: 'Componente raiz. Gerencia estado global leve via useState. Renderiza Providers e a árvore principal. Todo re-render começa aqui quando o estado do App muda.',
      tip: 'Cuidado: estado no componente raiz força re-render de toda a árvore não-memoizada. Considere mover para um Provider.',
      children: [
        {
          id: 'themeCtx', name: 'ThemeContext.Provider', type: 'context',
          props: ['value={theme}'],
          tooltip: 'Context Provider. Qualquer descendente que chamar useContext(ThemeCtx) re-renderiza quando theme mudar — independente de onde estiver na árvore.',
          tip: 'Context não é solução para estado de alta frequência. Use Zustand ou Redux para isso. Context é para temas, auth, locale.',
          children: [
            {
              id: 'layout', name: 'Layout', type: 'component',
              tooltip: 'Componente estrutural — só posiciona filhos via children prop. Não tem estado próprio. Re-renderiza quando App re-renderiza, pois não está envolvido em memo.',
              tip: 'Componentes "shell" como Layout devem ser estáveis. Use children prop para evitar re-renders desnecessários dos filhos.',
              children: [
                {
                  id: 'nav', name: 'Nav', type: 'memo',
                  tooltip: 'Envolvido em React.memo. Só re-renderiza se as suas props (user) mudarem por referência — mesmo que Layout re-renderize o tempo todo.',
                  tip: 'memo só compara props por referência. Se user é objeto novo a cada render, memo não ajuda. Combine com useMemo no pai.',
                  props: ['user'],
                },
                {
                  id: 'main', name: 'MainContent', type: 'component',
                  state: ['activeTab'],
                  tooltip: 'Tem estado local activeTab. Quando o usuário muda de aba, só este subárvore re-renderiza — não o Layout ou Nav.',
                  tip: 'Estado local é a otimização gratuita do React. Mantenha estado o mais perto possível de quem usa.',
                  children: [
                    {
                      id: 'list', name: 'UserList', type: 'memo',
                      props: ['users', 'onSelect'],
                      tooltip: 'React.memo + useCallback no onSelect do pai = re-render somente quando users[] muda por referência. Otimização clássica de lista.',
                      tip: 'Lista virtualizada (react-window) + memo no item é o combo perfeito para listas grandes.',
                    },
                    {
                      id: 'detail', name: 'UserDetail', type: 'component',
                      state: ['isEditing'],
                      tooltip: 'Leaf component com estado local de edição. Completamente isolado — mudanças aqui não afetam UserList de forma alguma.',
                      tip: 'Componentes "leaf" com estado local são ideais para isolar re-renders custosos.',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const TYPE_COLOR: Record<string, string> = {
  host: MUTE, component: C, context: AMB, memo: GRN,
}
const TYPE_LABEL: Record<string, string> = {
  host: 'Host', component: 'Component', context: 'Context', memo: 'Memo',
}
const TYPE_ICON: Record<string, string> = {
  host: '⚓', component: '◆', context: '◎', memo: '⚡',
}
const TYPE_DESC: Record<string, string> = {
  host: 'Nó DOM nativo (div, span, input...)',
  component: 'Função React padrão',
  context: 'Provedor de contexto global',
  memo: 'Envolvido em React.memo',
}

function findNode(tree: FiberNode, id: string): FiberNode | null {
  if (tree.id === id) return tree
  for (const c of tree.children ?? []) {
    const r = findNode(c, id)
    if (r) return r
  }
  return null
}

function FiberNodeBox({ node, depth, selected, onSelect }: {
  node: FiberNode; depth: number; selected: string | null; onSelect: (id: string) => void
}) {
  const color = TYPE_COLOR[node.type]
  const isSelected = selected === node.id
  const indent = depth * 28

  return (
    <div style={{ marginLeft: indent }}>
      <div
        onClick={() => onSelect(node.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 18px', borderRadius: 12, marginBottom: 10,
          cursor: 'pointer', userSelect: 'none',
          border: `2px solid ${isSelected ? color : LINE}`,
          background: isSelected ? `${color}25` : CARD2,
          transition: 'all .2s',
          boxShadow: isSelected ? `0 0 16px ${color}50` : 'none',
          minWidth: 240,
          minHeight: 48,
        }}
      >
        <span style={{ fontSize: 22, lineHeight: 1, filter: isSelected ? 'none' : 'grayscale(0.4)' }}>
          {TYPE_ICON[node.type]}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ color: isSelected ? color : FG, fontSize: 14, fontWeight: 800, lineHeight: 1.2 }}>
            {node.name}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 4,
              background: `${color}25`, border: `1px solid ${color}60`, color, fontWeight: 700,
            }}>
              {TYPE_LABEL[node.type]}
            </span>
            {node.state?.map(s => (
              <span key={s} style={{
                fontSize: 10, padding: '2px 7px', borderRadius: 4,
                background: 'rgba(239,68,68,.18)', border: '1px solid rgba(239,68,68,.5)',
                color: RED, fontWeight: 700,
              }}>
                state:{s}
              </span>
            ))}
            {node.props?.map(p => (
              <span key={p} style={{
                fontSize: 10, padding: '2px 7px', borderRadius: 4,
                background: 'rgba(167,139,250,.15)', border: '1px solid rgba(167,139,250,.4)',
                color: PRP, fontWeight: 700,
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>
        {isSelected && <span style={{ fontSize: 22, color }}>›</span>}
      </div>
      <div style={{ position: 'relative' }}>
        {node.children?.length ? (
          <div style={{
            position: 'absolute', left: 12, top: 0, bottom: 10,
            width: 2, background: LINE, borderRadius: 1,
          }} />
        ) : null}
        {node.children?.map(child => (
          <FiberNodeBox key={child.id} node={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

function FiberExplorer() {
  const [selected, setSelected] = useState<string | null>('app')
  const node = selected ? findNode(FIBER_TREE, selected) : null

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: '.15em', color: C, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
          VISUAL 2 — ÁRVORE FIBER
        </div>
        <h3 style={{ color: FG, fontSize: 26, fontWeight: 800, margin: '0 0 8px', lineHeight: 1 }}>
          Explorador da Casa React
        </h3>
        <p style={{ color: FGMUTE, fontSize: 13, margin: 0 }}>
          Cada componente é um cômodo. Clique para inspecionar. Hierarquia, tipos e dicas de entrevista revelam como React organiza sua árvore.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        <div style={{
          background: BG, border: `1px solid ${LINE}`, borderRadius: 14,
          padding: 28, overflowX: 'auto',
          backgroundImage: `radial-gradient(circle at 20% 20%, ${C}08 0%, transparent 50%)`,
          minHeight: 440,
        }}>
          <FiberNodeBox node={FIBER_TREE} depth={0} selected={selected} onSelect={setSelected} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {node ? (
            <>
              <div style={{
                background: `${TYPE_COLOR[node.type]}18`,
                border: `2px solid ${TYPE_COLOR[node.type]}60`,
                borderRadius: 14, padding: 22,
                boxShadow: `0 0 24px ${TYPE_COLOR[node.type]}22`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 34 }}>{TYPE_ICON[node.type]}</span>
                  <div>
                    <div style={{ color: TYPE_COLOR[node.type], fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{node.name}</div>
                    <span style={{
                      display: 'inline-block', marginTop: 6,
                      fontSize: 10, padding: '3px 10px', borderRadius: 6,
                      background: `${TYPE_COLOR[node.type]}30`,
                      color: TYPE_COLOR[node.type], fontWeight: 800, letterSpacing: '.05em',
                    }}>
                      {TYPE_LABEL[node.type].toUpperCase()}
                    </span>
                  </div>
                </div>
                <p style={{ color: FG, fontSize: 13, lineHeight: 1.8, margin: 0 }}>{node.tooltip}</p>
              </div>

              {node.tip && (
                <div style={{
                  background: `${GOLD}12`, border: `1.5px solid ${GOLD}50`,
                  borderRadius: 12, padding: 16,
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
                    color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: '.1em',
                  }}>
                    <span style={{ fontSize: 16 }}>💡</span>
                    DICA DE ENTREVISTA
                  </div>
                  <p style={{ color: FG, fontSize: 12, lineHeight: 1.7, margin: 0 }}>{node.tip}</p>
                </div>
              )}
            </>
          ) : (
            <div style={{ background: CARD2, border: `1px solid ${LINE}`, borderRadius: 14, padding: 20 }}>
              <p style={{ color: MUTE, fontSize: 13, margin: 0, textAlign: 'center' }}>
                ← Clique num componente para inspecionar
              </p>
            </div>
          )}

          <div style={{ background: CARD2, border: `1px solid ${LINE}`, borderRadius: 14, padding: 20 }}>
            <div style={{ color: FGMUTE, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14 }}>
              LEGENDA DE TIPOS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(TYPE_LABEL).map(([k]) => (
                <div key={k} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 10,
                  background: `${TYPE_COLOR[k]}12`,
                  border: `1.5px solid ${TYPE_COLOR[k]}40`,
                }}>
                  <span style={{ fontSize: 20 }}>{TYPE_ICON[k]}</span>
                  <div>
                    <div style={{ color: TYPE_COLOR[k], fontSize: 13, fontWeight: 700 }}>{TYPE_LABEL[k]}</div>
                    <div style={{ color: FGMUTE, fontSize: 11, marginTop: 2 }}>{TYPE_DESC[k]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Re-render Cascade — "Propagação de Fogo"
// ═══════════════════════════════════════════════════════════════════════════════

type RRNode = { id: string; name: string; isMemo?: boolean; children?: string[] }

const RR_NODES: RRNode[] = [
  { id: 'App',        name: 'App',         children: ['Header', 'Main'] },
  { id: 'Header',     name: 'Header',      isMemo: true, children: ['Logo', 'NavBar'] },
  { id: 'Logo',       name: 'Logo',        isMemo: true },
  { id: 'NavBar',     name: 'NavBar',      isMemo: true, children: ['NavItem1', 'NavItem2'] },
  { id: 'NavItem1',   name: 'NavItem',     isMemo: true },
  { id: 'NavItem2',   name: 'NavItem',     isMemo: true },
  { id: 'Main',       name: 'MainContent', children: ['Sidebar', 'Feed'] },
  { id: 'Sidebar',    name: 'Sidebar',     children: ['FilterList'] },
  { id: 'FilterList', name: 'FilterList',  children: ['Filter1', 'Filter2'] },
  { id: 'Filter1',    name: 'FilterItem' },
  { id: 'Filter2',    name: 'FilterItem' },
  { id: 'Feed',       name: 'Feed',        children: ['Post1', 'Post2', 'Post3'] },
  { id: 'Post1',      name: 'Post',        isMemo: true },
  { id: 'Post2',      name: 'Post',        isMemo: true },
  { id: 'Post3',      name: 'Post',        isMemo: true },
]

function getDescendants(id: string, nodes: RRNode[]): Set<string> {
  const map = new Map(nodes.map(n => [n.id, n]))
  const result = new Set<string>()
  function walk(nid: string) {
    const n = map.get(nid)
    if (!n) return
    for (const c of n.children ?? []) { result.add(c); walk(c) }
  }
  walk(id)
  return result
}

const SCENARIOS = [
  {
    label: 'App setState()',
    emoji: '🔥', trigger: 'App',
    desc: 'Quando App chama setState, ele re-renderiza. Todos os filhos sem memo re-renderizam em cascata — fogo descendo a árvore.',
    color: RED,
  },
  {
    label: 'Header setState()',
    emoji: '🛡️', trigger: 'Header',
    desc: 'Header tem memo, mas tem seu próprio state — re-renderiza mesmo assim. Logo, NavBar e NavItems estão protegidos se props não mudarem.',
    color: AMB,
  },
  {
    label: 'Main setState()',
    emoji: '⚡', trigger: 'Main',
    desc: 'Sidebar e Feed re-renderizam por serem filhos. Posts (memoizados) são escudos verdes — só re-renderizam se props individuais mudarem.',
    color: PRP,
  },
]

function ReRenderSimulator() {
  const [scenario, setScenario] = useState(0)
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set())
  const [memoBlocked, setMemoBlocked] = useState<Set<string>>(new Set())
  const [running, setRunning] = useState(false)
  const [blockCount, setBlockCount] = useState(0)

  const runScenario = useCallback((idx: number) => {
    if (running) return
    setRunning(true)
    const sc = SCENARIOS[idx]
    const desc = getDescendants(sc.trigger, RR_NODES)

    const blocked = new Set<string>()
    for (const nid of desc) {
      const n = RR_NODES.find(x => x.id === nid)
      if (n?.isMemo) {
        blocked.add(nid)
        const subDesc = getDescendants(nid, RR_NODES)
        for (const s of subDesc) blocked.add(s)
      }
    }

    const finalTriggered = new Set([sc.trigger])
    for (const nid of desc) {
      if (!blocked.has(nid)) finalTriggered.add(nid)
    }

    setHighlighted(new Set())
    setMemoBlocked(new Set())

    setTimeout(() => {
      setHighlighted(finalTriggered)
      setMemoBlocked(blocked)
      setBlockCount(c => c + blocked.size)
      setRunning(false)
    }, 80)
  }, [running])

  function RRBox({ node, depth }: { node: RRNode; depth: number }) {
    const isHit = highlighted.has(node.id)
    const isBlocked = memoBlocked.has(node.id)
    const borderColor = isHit ? RED : isBlocked ? GRN : LINE
    const bgColor = isHit ? 'rgba(239,68,68,.22)' : isBlocked ? 'rgba(74,222,128,.14)' : CARD2
    const textColor = isHit ? '#fca5a5' : isBlocked ? '#86efac' : FGMUTE
    const glow = isHit ? '0 0 22px rgba(239,68,68,.6)' : isBlocked ? '0 0 18px rgba(74,222,128,.4)' : 'none'

    return (
      <div style={{ marginLeft: depth * 26 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '12px 18px', borderRadius: 10, marginBottom: 8,
          border: `2px solid ${borderColor}`,
          background: bgColor,
          transition: 'all .4s',
          boxShadow: glow,
          minWidth: 160,
        }}>
          {node.isMemo && (
            <span style={{
              fontSize: 10, fontWeight: 800,
              color: isBlocked ? GRN : '#4ade8099',
              border: `1.5px solid ${isBlocked ? GRN : '#4ade8050'}`,
              borderRadius: 4, padding: '1px 6px',
            }}>memo</span>
          )}
          <span style={{ fontSize: 13, color: textColor, fontWeight: isHit ? 800 : 500 }}>
            {node.name}
          </span>
          {isHit && <span style={{ fontSize: 16, animation: 'spin .6s linear infinite' }}>🔥</span>}
          {isBlocked && <span style={{ fontSize: 14 }}>🛡️</span>}
        </div>
        {node.children?.map(cid => {
          const child = RR_NODES.find(x => x.id === cid)
          return child ? <RRBox key={cid} node={child} depth={depth + 1} /> : null
        })}
      </div>
    )
  }

  const root = RR_NODES.find(x => x.id === 'App')!
  const sc = SCENARIOS[scenario]

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: '.15em', color: RED, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
          VISUAL 3 — CASCATA DE RE-RENDERS
        </div>
        <h3 style={{ color: FG, fontSize: 26, fontWeight: 800, margin: '0 0 8px', lineHeight: 1 }}>
          Propagação de Fogo
        </h3>
        <p style={{ color: FGMUTE, fontSize: 13, margin: 0 }}>
          Escolha um cenário e veja o fogo do re-render descendo a árvore. memo é seu escudo verde.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {SCENARIOS.map((s, i) => (
          <button key={i}
            onClick={() => { setScenario(i); runScenario(i) }}
            style={{
              padding: '12px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700,
              border: `2px solid ${scenario === i ? s.color : LINE}`,
              background: scenario === i ? `${s.color}22` : CARD2,
              color: scenario === i ? s.color : FGMUTE,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all .2s',
              boxShadow: scenario === i ? `0 0 16px ${s.color}40` : 'none',
            }}
          >
            {s.emoji} {s.label}
          </button>
        ))}

        <div style={{
          marginLeft: 'auto',
          padding: '10px 18px', borderRadius: 10,
          background: `${GRN}12`, border: `2px solid ${GRN}50`,
        }}>
          <div style={{ fontSize: 9, color: GRN, fontWeight: 800, letterSpacing: '.1em', marginBottom: 2 }}>
            RE-RENDERS EVITADOS
          </div>
          <div style={{ fontSize: 22, color: GRN, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" }}>
            🛡️ {blockCount}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        <div style={{
          background: BG, border: `1px solid ${LINE}`, borderRadius: 14,
          padding: 28,
          backgroundImage: `radial-gradient(circle at 80% 80%, ${RED}08 0%, transparent 60%)`,
        }}>
          <RRBox node={root} depth={0} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: `${sc.color}15`, border: `2px solid ${sc.color}50`,
            borderRadius: 14, padding: 20,
            boxShadow: `0 0 20px ${sc.color}20`,
          }}>
            <div style={{ color: sc.color, fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
              {sc.emoji} {sc.label}
            </div>
            <p style={{ color: FG, fontSize: 13, lineHeight: 1.8, margin: 0 }}>{sc.desc}</p>
          </div>

          <div style={{ background: CARD2, border: `1px solid ${LINE}`, borderRadius: 14, padding: 20 }}>
            <div style={{ color: FGMUTE, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14 }}>LEGENDA</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 22, borderRadius: 6,
                  background: 'rgba(239,68,68,.22)', border: `2px solid ${RED}`,
                  boxShadow: `0 0 10px ${RED}55`, flexShrink: 0,
                }} />
                <span style={{ color: FG, fontSize: 12 }}>Re-renderizou</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 22, borderRadius: 6,
                  background: 'rgba(74,222,128,.14)', border: `2px solid ${GRN}`,
                  boxShadow: `0 0 10px ${GRN}44`, flexShrink: 0,
                }} />
                <span style={{ color: FG, fontSize: 12 }}>Bloqueado por memo</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 22, borderRadius: 6,
                  background: CARD2, border: `2px solid ${LINE}`, flexShrink: 0,
                }} />
                <span style={{ color: FG, fontSize: 12 }}>Não afetado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Hook Lifecycle — Timeline Visual (Estações)
// ═══════════════════════════════════════════════════════════════════════════════

type SeasonEvent = {
  id: string
  emoji: string
  name: string
  color: string
  short: string
  detail: string
  code: { text: string; color?: string }[][]
}

const SEASONS: SeasonEvent[] = [
  {
    id: 'render', emoji: '🌱', name: 'Render', color: GRN, short: 'A função roda',
    detail: 'O componente é executado como uma função pura. JSX é gerado em memória. Nenhum efeito colateral deve acontecer aqui — apenas leitura de props/state e cálculo do output.',
    code: [
      [{ text: 'function ', color: PRP }, { text: 'Counter', color: GRN }, { text: '() {' }],
      [{ text: '  const ', color: PRP }, { text: '[count, setCount]', color: SKY }, { text: ' = ', color: FG }, { text: 'useState', color: GRN }, { text: '(', color: AMB }, { text: '0', color: AMB }, { text: ')', color: AMB }],
      [{ text: '  return ', color: PRP }, { text: '<div>', color: AMB }, { text: '{count}', color: SKY }, { text: '</div>', color: AMB }],
      [{ text: '}' }],
    ],
  },
  {
    id: 'reconcile', emoji: '🔀', name: 'Diff', color: SKY, short: 'React compara',
    detail: 'React compara a árvore Virtual nova com a anterior (reconciliação). Calcula o conjunto mínimo de operações para o DOM. Esta é a fase pausável do React 18.',
    code: [
      [{ text: '// React internamente:', color: MUTE }],
      [{ text: 'const ', color: PRP }, { text: 'diff', color: SKY }, { text: ' = ' }, { text: 'reconcile', color: GRN }, { text: '(' }],
      [{ text: '  prevTree, nextTree' }],
      [{ text: ')' }],
    ],
  },
  {
    id: 'commit', emoji: '🏗️', name: 'Commit', color: AMB, short: 'DOM atualiza',
    detail: 'React aplica as mudanças no DOM real. Esta fase é síncrona e ininterruptível. É curta — só insere/atualiza/remove os nós que mudaram. Refs são atualizadas aqui.',
    code: [
      [{ text: '// React commit phase:', color: MUTE }],
      [{ text: 'domNode', color: SKY }, { text: '.textContent = ' }, { text: '"1"', color: GRN }],
      [{ text: 'ref.current = domNode', color: FG }],
    ],
  },
  {
    id: 'layout', emoji: '📐', name: 'Layout', color: PRP, short: 'useLayoutEffect',
    detail: 'useLayoutEffect roda síncronamente após o commit, antes do paint. Use para medir layout (getBoundingClientRect) e ajustar estilos sem flash visual. Bloqueia o paint — use com cuidado.',
    code: [
      [{ text: 'useLayoutEffect', color: GRN }, { text: '(' }, { text: '() => {', color: PRP }],
      [{ text: '  const ', color: PRP }, { text: 'rect', color: SKY }, { text: ' = ref.current.', color: FG }, { text: 'getBoundingClientRect', color: GRN }, { text: '()' }],
      [{ text: '  setHeight(rect.height)', color: FG }],
      [{ text: '})' }],
    ],
  },
  {
    id: 'paint', emoji: '🖼️', name: 'Paint', color: PINK, short: 'Browser pinta',
    detail: 'O browser desenha o frame atualizado na tela. O usuário vê a UI. Toda lógica que vem antes deste momento bloqueia a percepção de performance.',
    code: [
      [{ text: '// Browser paint:', color: MUTE }],
      [{ text: 'requestAnimationFrame', color: GRN }, { text: '(() => {' }],
      [{ text: '  composite + paint frame', color: FG }],
      [{ text: '})' }],
    ],
  },
  {
    id: 'effect', emoji: '🌊', name: 'Effect', color: C, short: 'useEffect',
    detail: 'useEffect roda assíncronamente após o paint. Lugar ideal para fetch, addEventListener, subscriptions. Não bloqueia o paint — UX fluida.',
    code: [
      [{ text: 'useEffect', color: GRN }, { text: '(' }, { text: '() => {', color: PRP }],
      [{ text: '  const ', color: PRP }, { text: 'sub', color: SKY }, { text: ' = ' }, { text: 'subscribe', color: GRN }, { text: '(handler)' }],
      [{ text: '  return ', color: PRP }, { text: '() => sub.', color: FG }, { text: 'unsubscribe', color: GRN }, { text: '()' }],
      [{ text: '}, [deps])' }],
    ],
  },
  {
    id: 'cleanup', emoji: '🧹', name: 'Cleanup', color: RED, short: 'Limpeza',
    detail: 'Antes do próximo effect (ou no unmount), o cleanup retornado roda. Cancele assinaturas, timers, fetches. Sem cleanup = memory leak garantido.',
    code: [
      [{ text: '// Cleanup function:', color: MUTE }],
      [{ text: 'return ', color: PRP }, { text: '() => {', color: PRP }],
      [{ text: '  clearInterval(timer)', color: FG }],
      [{ text: '  ws.', color: FG }, { text: 'close', color: GRN }, { text: '()' }],
      [{ text: '}' }],
    ],
  },
]

function HookTimeline() {
  const [activeId, setActiveId] = useState<string | null>('effect')
  const active = SEASONS.find(s => s.id === activeId)

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: '.15em', color: GRN, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
          VISUAL 4 — HOOK LIFECYCLE
        </div>
        <h3 style={{ color: FG, fontSize: 26, fontWeight: 800, margin: '0 0 8px', lineHeight: 1 }}>
          Timeline das Estações
        </h3>
        <p style={{ color: FGMUTE, fontSize: 13, margin: 0 }}>
          Cada fase do ciclo de vida é uma estação. Clique para ver explicação detalhada e código.
        </p>
      </div>

      <div style={{
        position: 'relative', padding: '40px 0 60px',
        background: BG, borderRadius: 16, border: `1px solid ${LINE}`,
        backgroundImage: `radial-gradient(ellipse at center, ${C}08 0%, transparent 70%)`,
        marginBottom: 24,
      }}>
        <div style={{
          position: 'absolute',
          left: '4%', right: '4%',
          top: '50%', height: 4,
          background: `linear-gradient(90deg, ${GRN}, ${SKY}, ${AMB}, ${PRP}, ${PINK}, ${C}, ${RED})`,
          borderRadius: 2, transform: 'translateY(-2px)',
          boxShadow: '0 0 16px rgba(97,218,251,.4)',
        }} />

        <div style={{
          position: 'relative',
          display: 'flex', justifyContent: 'space-around',
          padding: '0 4%',
        }}>
          {SEASONS.map((s) => {
            const isActive = activeId === s.id
            return (
              <div key={s.id}
                onClick={() => setActiveId(isActive ? null : s.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  cursor: 'pointer', position: 'relative',
                }}
              >
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: isActive ? `${s.color}30` : CARD2,
                  border: `4px solid ${isActive ? s.color : `${s.color}70`}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36,
                  transition: 'all .25s',
                  boxShadow: isActive ? `0 0 30px ${s.color}80` : `0 0 12px ${s.color}30`,
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  zIndex: 2,
                }}>
                  {s.emoji}
                </div>
                <div style={{
                  marginTop: 14, textAlign: 'center',
                  color: isActive ? s.color : FG,
                  fontSize: 14, fontWeight: 800,
                  transition: 'color .2s',
                }}>
                  {s.name}
                </div>
                <div style={{
                  marginTop: 4, fontSize: 10,
                  color: isActive ? s.color : FGMUTE,
                  textAlign: 'center', maxWidth: 90,
                }}>
                  {s.short}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {active ? (
        <div style={{
          background: `${active.color}10`, border: `2px solid ${active.color}50`,
          borderRadius: 14, padding: 24,
          boxShadow: `0 0 30px ${active.color}15`,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span style={{ fontSize: 38 }}>{active.emoji}</span>
              <div>
                <div style={{ color: active.color, fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{active.name}</div>
                <div style={{ color: FGMUTE, fontSize: 12, marginTop: 4 }}>{active.short}</div>
              </div>
            </div>
            <p style={{ color: FG, fontSize: 13.5, lineHeight: 1.85, margin: 0 }}>{active.detail}</p>
          </div>

          <div style={{
            background: BG, border: `1px solid ${LINE}`, borderRadius: 10,
            padding: 18, fontSize: 12, lineHeight: 1.8,
            fontFamily: "'JetBrains Mono', monospace",
            overflowX: 'auto',
          }}>
            <div style={{
              fontSize: 9, color: MUTE, letterSpacing: '.15em',
              marginBottom: 10, fontWeight: 700,
            }}>
              EXEMPLO DE CÓDIGO
            </div>
            {active.code.map((line, i) => (
              <div key={i} style={{ color: FG, whiteSpace: 'pre' }}>
                {line.map((tok, j) => (
                  <span key={j} style={{ color: tok.color || FG }}>{tok.text}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          background: CARD2, border: `1px dashed ${LINE}`,
          borderRadius: 14, padding: 24, textAlign: 'center',
        }}>
          <p style={{ color: MUTE, fontSize: 13, margin: 0 }}>
            Clique numa estação da timeline para ver explicação e código
          </p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — "Os Hooks em 60 Segundos" — Carrossel de Cards
// ═══════════════════════════════════════════════════════════════════════════════

type HookCard = {
  name: string
  signature: string
  emoji: string
  color: string
  use: string[]
  dontUse: string
  difficulty: 1 | 2 | 3
}

const HOOK_CARDS: HookCard[] = [
  {
    name: 'useState', emoji: '📦', color: C, difficulty: 1,
    signature: 'const [v, setV] = useState(initial)',
    use: ['Estado local simples (input, toggle)', 'Valor que precisa causar re-render'],
    dontUse: 'Para estado derivado de props ou outros states',
  },
  {
    name: 'useEffect', emoji: '🌊', color: GRN, difficulty: 2,
    signature: 'useEffect(() => { ... }, [deps])',
    use: ['Sincronizar com sistema externo (API, WS)', 'Subscriptions com cleanup'],
    dontUse: 'Para transformar dados — faça inline no render',
  },
  {
    name: 'useMemo', emoji: '🧠', color: PRP, difficulty: 2,
    signature: 'const v = useMemo(() => calc(x), [x])',
    use: ['Cálculo realmente caro com profile feito', 'Estabilizar referência de objeto/array'],
    dontUse: 'Como otimização preventiva — geralmente é overhead',
  },
  {
    name: 'useCallback', emoji: '🔗', color: SKY, difficulty: 2,
    signature: 'const fn = useCallback(() => {}, [deps])',
    use: ['Passar callback estável para componente memo', 'Dep de outro hook'],
    dontUse: 'Em componente sem filhos memoizados — só overhead',
  },
  {
    name: 'useRef', emoji: '📎', color: AMB, difficulty: 2,
    signature: 'const ref = useRef(initial)',
    use: ['Acesso direto ao DOM (focus, scroll)', 'Valor mutável que NÃO causa re-render'],
    dontUse: 'Para estado que precisa causar re-render — use useState',
  },
  {
    name: 'useContext', emoji: '🌐', color: PINK, difficulty: 1,
    signature: 'const v = useContext(MyContext)',
    use: ['Tema, auth, locale (mudança rara)', 'Evitar prop drilling profundo'],
    dontUse: 'Para estado de alta frequência — re-render em cascata',
  },
  {
    name: 'useReducer', emoji: '⚙️', color: PRP, difficulty: 3,
    signature: 'const [state, dispatch] = useReducer(reducer, init)',
    use: ['Estado complexo com múltiplas transições', 'Lógica de update centralizada'],
    dontUse: 'Para um simples toggle — useState é mais limpo',
  },
  {
    name: 'useTransition', emoji: '🚦', color: GOLD, difficulty: 3,
    signature: 'const [isPending, startTransition] = useTransition()',
    use: ['Marcar update como não-urgente', 'Manter input responsivo durante render pesado'],
    dontUse: 'Para updates síncronos urgentes (input controlado)',
  },
  {
    name: 'useDeferredValue', emoji: '⏳', color: AMB, difficulty: 3,
    signature: 'const deferred = useDeferredValue(value)',
    use: ['Adiar renderização de valor caro', 'Lista filtrada com query'],
    dontUse: 'Quando você controla a fonte do update — use startTransition',
  },
  {
    name: 'useId', emoji: '🆔', color: SKY, difficulty: 1,
    signature: 'const id = useId()',
    use: ['IDs estáveis para acessibilidade (label/input)', 'Compatível com SSR'],
    dontUse: 'Como key em listas — use o id do dado',
  },
  {
    name: 'use()', emoji: '🔮', color: C, difficulty: 2,
    signature: 'const value = use(promiseOrContext)',
    use: ['Ler uma Promise ou Context — inclusive em condicionais', 'Substitui useEffect para async simples (React 19)'],
    dontUse: 'Com Promise instável — nova Promise a cada render causa loop infinito.',
  },
  {
    name: 'useOptimistic', emoji: '⚡', color: AMB, difficulty: 2,
    signature: 'const [optimisticState, addOptimistic] = useOptimistic(state, updateFn)',
    use: ['Mutations onde a resposta do servidor é quase certa (like, delete, add)', 'UI que deve parecer instantânea — reverte automaticamente se houver erro'],
    dontUse: 'Fora de uma transition (Server Action ou startTransition) — não reverte.',
  },
  {
    name: 'useActionState', emoji: '🎯', color: SKY, difficulty: 2,
    signature: 'const [state, action, isPending] = useActionState(fn, initialState)',
    use: ['Server Actions ou qualquer função async de formulário', 'Eliminar o trio useState + loading + error'],
    dontUse: 'Confundir a ordem dos argumentos da action — o primeiro é o estado anterior (prev), não formData.',
  },
]

function HookCarousel() {
  const [idx, setIdx] = useState(0)
  const card = HOOK_CARDS[idx]
  const next = () => setIdx(i => (i + 1) % HOOK_CARDS.length)
  const prev = () => setIdx(i => (i - 1 + HOOK_CARDS.length) % HOOK_CARDS.length)

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: '.15em', color: SKY, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
          VISUAL 5 — HOOKS DE BOLSO
        </div>
        <h3 style={{ color: FG, fontSize: 26, fontWeight: 800, margin: '0 0 8px', lineHeight: 1 }}>
          Os Hooks em 60 Segundos
        </h3>
        <p style={{ color: FGMUTE, fontSize: 13, margin: 0 }}>
          Dez hooks essenciais. Quando usar, quando não usar e dificuldade — em um cartão.
        </p>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 18,
        justifyContent: 'center',
      }}>
        <button onClick={prev} style={{
          width: 52, height: 52, borderRadius: '50%',
          border: `2px solid ${card.color}50`, background: `${card.color}15`,
          color: card.color, fontSize: 22, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          flexShrink: 0,
        }}>
          ◀
        </button>

        <div style={{
          width: 420, height: 360,
          background: `linear-gradient(160deg, ${card.color}18 0%, ${BG} 70%)`,
          border: `2px solid ${card.color}60`,
          borderRadius: 18, padding: 28,
          boxShadow: `0 0 40px ${card.color}25`,
          display: 'flex', flexDirection: 'column',
          position: 'relative',
          transition: 'all .3s',
        }}>
          <div style={{
            position: 'absolute', top: 18, right: 22,
            display: 'flex', gap: 4,
          }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} style={{
                fontSize: 16,
                opacity: i < card.difficulty ? 1 : 0.2,
                filter: i < card.difficulty ? 'none' : 'grayscale(1)',
              }}>
                🔥
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 60, lineHeight: 1 }}>{card.emoji}</div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: card.color, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>
                {card.name}
              </div>
            </div>
          </div>

          <div style={{
            background: BG, border: `1px solid ${LINE}`,
            borderRadius: 8, padding: '10px 14px',
            fontSize: 11.5, color: FG,
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 16,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}>
            {card.signature}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: GRN, fontWeight: 800, letterSpacing: '.15em', marginBottom: 8 }}>
              ✓ QUANDO USAR
            </div>
            {card.use.map((u, i) => (
              <div key={i} style={{ color: FG, fontSize: 12, lineHeight: 1.6, paddingLeft: 4 }}>
                • {u}
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 9, color: RED, fontWeight: 800, letterSpacing: '.15em', marginBottom: 6 }}>
              ✗ QUANDO NÃO USAR
            </div>
            <div style={{ color: '#fca5a5', fontSize: 12, lineHeight: 1.6, paddingLeft: 4 }}>
              • {card.dontUse}
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: 14, right: 22,
            fontSize: 11, color: MUTE, fontWeight: 700,
            letterSpacing: '.15em',
          }}>
            {String(idx + 1).padStart(2, '0')} / {String(HOOK_CARDS.length).padStart(2, '0')}
          </div>
        </div>

        <button onClick={next} style={{
          width: 52, height: 52, borderRadius: '50%',
          border: `2px solid ${card.color}50`, background: `${card.color}15`,
          color: card.color, fontSize: 22, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          flexShrink: 0,
        }}>
          ▶
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24, flexWrap: 'wrap' }}>
        {HOOK_CARDS.map((h, i) => (
          <button key={i}
            onClick={() => setIdx(i)}
            style={{
              padding: '6px 12px', fontSize: 11,
              border: `1.5px solid ${i === idx ? h.color : LINE}`,
              background: i === idx ? `${h.color}25` : 'transparent',
              color: i === idx ? h.color : FGMUTE,
              borderRadius: 6, cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 700,
              transition: 'all .15s',
            }}
          >
            {h.name}
          </button>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Anti-patterns — "Galeria do Horror"
// ═══════════════════════════════════════════════════════════════════════════════

type CodeLine = { text: string; color?: string }[]
type AntiPattern = {
  title: string
  wrong: CodeLine[]
  right: CodeLine[]
  why: string
}

const ANTI_PATTERNS: AntiPattern[] = [
  {
    title: 'setState dentro do render',
    wrong: [
      [{ text: 'function ', color: PRP }, { text: 'Bad', color: GRN }, { text: '() {' }],
      [{ text: '  const [c, setC] = ', color: FG }, { text: 'useState', color: GRN }, { text: '(0)' }],
      [{ text: '  ', color: FG }, { text: 'setC(c + 1)', color: RED }, { text: ' // loop infinito!', color: MUTE }],
      [{ text: '}' }],
    ],
    right: [
      [{ text: 'function ', color: PRP }, { text: 'Good', color: GRN }, { text: '() {' }],
      [{ text: '  const [c, setC] = ', color: FG }, { text: 'useState', color: GRN }, { text: '(0)' }],
      [{ text: '  ', color: FG }, { text: 'useEffect', color: GRN }, { text: '(() => setC(c+1), [])' }],
      [{ text: '}' }],
    ],
    why: 'setState durante render dispara novo render → novo setState → loop infinito que trava o browser.',
  },
  {
    title: 'Mutar state diretamente',
    wrong: [
      [{ text: 'const ', color: PRP }, { text: '[arr, setArr]', color: SKY }, { text: ' = ' }, { text: 'useState', color: GRN }, { text: '([])' }],
      [{ text: 'arr.', color: RED }, { text: 'push', color: RED }, { text: '(item) ', color: RED }, { text: '// mutação!', color: MUTE }],
      [{ text: 'setArr(arr) ', color: FG }, { text: '// React não detecta', color: MUTE }],
    ],
    right: [
      [{ text: 'const ', color: PRP }, { text: '[arr, setArr]', color: SKY }, { text: ' = ' }, { text: 'useState', color: GRN }, { text: '([])' }],
      [{ text: 'setArr([...arr, item]) ', color: GRN }, { text: '// novo array', color: MUTE }],
    ],
    why: 'React compara state por referência. Mutação não muda a referência — re-render não acontece.',
  },
  {
    title: 'index como key em lista',
    wrong: [
      [{ text: 'items.', color: FG }, { text: 'map', color: GRN }, { text: '((it, ', color: FG }, { text: 'i', color: RED }, { text: ') => (' }],
      [{ text: '  <Item ', color: AMB }, { text: 'key={', color: RED }, { text: 'i', color: RED }, { text: '}', color: RED }, { text: ' value={it} />', color: AMB }],
      [{ text: '))' }],
    ],
    right: [
      [{ text: 'items.', color: FG }, { text: 'map', color: GRN }, { text: '(it => (' }],
      [{ text: '  <Item ', color: AMB }, { text: 'key={', color: GRN }, { text: 'it.id', color: GRN }, { text: '}', color: GRN }, { text: ' value={it} />', color: AMB }],
      [{ text: '))' }],
    ],
    why: 'Quando lista muda de ordem ou recebe inserção no meio, React confunde os componentes — bugs de estado.',
  },
  {
    title: 'Função inline sem useCallback',
    wrong: [
      [{ text: '<Memoized ', color: AMB }, { text: 'onClick={', color: FG }, { text: '() => doStuff()', color: RED }, { text: '} />' }],
      [{ text: '// nova função a cada render', color: MUTE }],
      [{ text: '// memo do filho não funciona', color: MUTE }],
    ],
    right: [
      [{ text: 'const ', color: PRP }, { text: 'handle', color: SKY }, { text: ' = ', color: FG }, { text: 'useCallback', color: GRN }, { text: '(' }],
      [{ text: '  () => doStuff(), []', color: FG }],
      [{ text: ')' }],
      [{ text: '<Memoized ', color: AMB }, { text: 'onClick={handle}', color: GRN }, { text: ' />' }],
    ],
    why: 'Cada render cria nova função com nova referência. Filho memoizado vê prop diferente e re-renderiza.',
  },
  {
    title: 'useEffect sem cleanup',
    wrong: [
      [{ text: 'useEffect', color: GRN }, { text: '(() => {' }],
      [{ text: '  const t = ', color: FG }, { text: 'setInterval', color: RED }, { text: '(tick, 1000)' }],
      [{ text: '  ', color: MUTE }, { text: '// sem return cleanup!', color: MUTE }],
      [{ text: '}, [])' }],
    ],
    right: [
      [{ text: 'useEffect', color: GRN }, { text: '(() => {' }],
      [{ text: '  const t = ', color: FG }, { text: 'setInterval', color: GRN }, { text: '(tick, 1000)' }],
      [{ text: '  return ', color: PRP }, { text: '() => ', color: FG }, { text: 'clearInterval', color: GRN }, { text: '(t)' }],
      [{ text: '}, [])' }],
    ],
    why: 'Sem cleanup, intervals e listeners ficam vivos após unmount. Memory leak progressivo.',
  },
  {
    title: 'Dep array incorreto',
    wrong: [
      [{ text: 'useEffect', color: GRN }, { text: '(() => {' }],
      [{ text: '  ', color: FG }, { text: 'fetch', color: RED }, { text: '(`/api/${userId}`)' }],
      [{ text: '}, ', color: FG }, { text: '[]', color: RED }, { text: ') ', color: FG }, { text: '// userId faltando!', color: MUTE }],
    ],
    right: [
      [{ text: 'useEffect', color: GRN }, { text: '(() => {' }],
      [{ text: '  ', color: FG }, { text: 'fetch', color: GRN }, { text: '(`/api/${userId}`)' }],
      [{ text: '}, ', color: FG }, { text: '[userId]', color: GRN }, { text: ')' }],
    ],
    why: 'Sem userId nas deps, o effect usa o valor stale do primeiro render — fetch nunca atualiza.',
  },
  {
    title: 'Estado derivado em useEffect',
    wrong: [
      [{ text: 'const ', color: PRP }, { text: '[full, setFull]', color: SKY }, { text: ' = ' }, { text: 'useState', color: GRN }, { text: "('')" }],
      [{ text: 'useEffect', color: RED }, { text: '(() => {' }],
      [{ text: '  setFull(`${first} ${last}`)', color: RED }],
      [{ text: '}, [first, last])' }],
    ],
    right: [
      [{ text: '// só calcule no render:', color: MUTE }],
      [{ text: 'const ', color: PRP }, { text: 'full', color: SKY }, { text: ' = `${first} ${last}`', color: GRN }],
    ],
    why: 'useEffect causa render extra. Valores derivados de props/state são apenas variáveis no render.',
  },
  {
    title: 'Context para tudo',
    wrong: [
      [{ text: '<MegaContext.Provider ', color: AMB }, { text: 'value={', color: FG }, { text: '{' }, { text: 'cart', color: RED }, { text: ', ' }, { text: 'mouse', color: RED }, { text: ', ', color: FG }, { text: 'time', color: RED }, { text: '}}', color: FG }, { text: '>' }],
      [{ text: '// re-render geral a cada tick', color: MUTE }],
    ],
    right: [
      [{ text: '<CartCtx.Provider value={cart}>', color: AMB }],
      [{ text: '  <App />', color: FG }],
      [{ text: '</CartCtx.Provider>', color: AMB }],
      [{ text: '// 1 context por domínio', color: MUTE }],
    ],
    why: 'Mudança em qualquer campo do value re-renderiza todos os consumers — cascata global.',
  },
  {
    title: 'useEffect desnecessário para derivação',
    wrong: [
      [{ text: 'const ', color: PRP }, { text: '[full, setFull]', color: SKY }, { text: ' = ' }, { text: 'useState', color: GRN }, { text: "('')" }],
      [{ text: 'useEffect', color: RED }, { text: '(() => {' }],
      [{ text: "  setFull(first + ' ' + last)", color: RED }],
      [{ text: '}, [first, last])' }],
    ],
    right: [
      [{ text: '// Derivar diretamente no render — sem effect', color: MUTE }],
      [{ text: 'const ', color: PRP }, { text: 'full', color: SKY }, { text: " = first + ' ' + last", color: GRN }],
    ],
    why: 'Se você pode calcular algo a partir de state/props existentes, calcule diretamente no render. useEffect para isso causa render duplo desnecessário.',
  },
  {
    title: 'Criar objetos/funções no JSX sem memoizar',
    wrong: [
      [{ text: '// Nova referência a cada render', color: MUTE }],
      [{ text: '<Child', color: AMB }],
      [{ text: '  config=', color: FG }, { text: '{{ timeout: 300 }}', color: RED }],
      [{ text: '  onDone=', color: FG }, { text: '{() => refetch()}', color: RED }],
      [{ text: '/>', color: AMB }],
    ],
    right: [
      [{ text: 'const ', color: PRP }, { text: 'config', color: SKY }, { text: ' = ' }, { text: 'useMemo', color: GRN }, { text: '(() => ({ timeout: 300 }), [])' }],
      [{ text: 'const ', color: PRP }, { text: 'onDone', color: SKY }, { text: ' = ' }, { text: 'useCallback', color: GRN }, { text: '(() => refetch(), [])' }],
      [{ text: '<Child ', color: AMB }, { text: 'config={config}', color: GRN }, { text: ' ' }, { text: 'onDone={onDone}', color: GRN }, { text: ' />', color: AMB }],
    ],
    why: 'Objetos/funções criados inline têm nova referência a cada render. Se Child usa React.memo, a memoização não funciona.',
  },
]

function HighlightedCode({ code, bg, border }: { code: CodeLine[]; bg: string; border: string }) {
  return (
    <pre style={{
      background: bg, border: `1px solid ${border}`, borderRadius: 8,
      padding: 12, margin: 0, fontSize: 11, lineHeight: 1.7,
      fontFamily: "'JetBrains Mono', monospace",
      color: FG, overflowX: 'auto', whiteSpace: 'pre',
    }}>
      {code.map((line, i) => (
        <div key={i}>
          {line.map((tok, j) => (
            <span key={j} style={{ color: tok.color || FG }}>{tok.text}</span>
          ))}
        </div>
      ))}
    </pre>
  )
}

function AntiPatternsGallery() {
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: '.15em', color: RED, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
          VISUAL 6 — ANTI-PATTERNS
        </div>
        <h3 style={{ color: FG, fontSize: 26, fontWeight: 800, margin: '0 0 8px', lineHeight: 1 }}>
          Galeria do Horror
        </h3>
        <p style={{ color: FGMUTE, fontSize: 13, margin: 0 }}>
          Oito armadilhas comuns. À esquerda o erro, à direita a versão correta. Errado vs Certo, sempre lado a lado.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 18 }}>
        {ANTI_PATTERNS.map((p, idx) => (
          <div key={idx} style={{
            background: CARD2, border: `1px solid ${LINE}`,
            borderRadius: 14, overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 18px',
              background: `linear-gradient(90deg, ${RED}30, ${RED}10)`,
              borderBottom: `1px solid ${RED}30`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <span style={{ color: '#fca5a5', fontSize: 13, fontWeight: 800, letterSpacing: '.02em' }}>
                {p.title}
              </span>
            </div>

            <div style={{ padding: 16 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 9, color: RED, fontWeight: 800,
                letterSpacing: '.15em', marginBottom: 8,
              }}>
                ✗ ERRADO
              </div>
              <HighlightedCode code={p.wrong} bg="rgba(239,68,68,.06)" border={`${RED}30`} />

              <div style={{ textAlign: 'center', margin: '12px 0', color: GRN, fontSize: 18 }}>
                ↓
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 9, color: GRN, fontWeight: 800,
                letterSpacing: '.15em', marginBottom: 8,
              }}>
                ✓ CERTO
              </div>
              <HighlightedCode code={p.right} bg="rgba(74,222,128,.06)" border={`${GRN}30`} />

              <div style={{
                marginTop: 14, padding: '10px 14px',
                background: BG, border: `1px solid ${LINE}`,
                borderRadius: 8,
              }}>
                <div style={{
                  fontSize: 9, color: AMB, fontWeight: 800,
                  letterSpacing: '.15em', marginBottom: 6,
                }}>
                  POR QUE ISSO MATA PERFORMANCE?
                </div>
                <p style={{ color: FGMUTE, fontSize: 11.5, lineHeight: 1.6, margin: 0 }}>
                  {p.why}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Concurrent Mode — "Painel de Prioridades"
// ═══════════════════════════════════════════════════════════════════════════════

type Priority = 'urgent' | 'normal' | 'low'
type Task = {
  id: number
  priority: Priority
  label: string
  progress: number
  done: boolean
  startedAt?: number
}

const PRIO_INFO: Record<Priority, { color: string; emoji: string; label: string; weight: number }> = {
  urgent: { color: RED, emoji: '🔥', label: 'URGENTE',  weight: 30 },
  normal: { color: SKY, emoji: '⚡', label: 'NORMAL',   weight: 12 },
  low:    { color: MUTE, emoji: '🐢', label: 'BAIXA',    weight: 6 },
}

let TASK_ID = 0

function ConcurrentMode() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const tasksRef = useRef<Task[]>([])
  tasksRef.current = tasks

  function addTask(priority: Priority) {
    TASK_ID += 1
    const newTask: Task = {
      id: TASK_ID,
      priority,
      label: `${PRIO_INFO[priority].label} #${TASK_ID}`,
      progress: 0,
      done: false,
    }
    setTasks(prev => [...prev, newTask])
    setLog(prev => [`+ Tarefa enfileirada: ${newTask.label}`, ...prev].slice(0, 8))
  }

  useEffect(() => {
    if (running) return
    if (tasks.some(t => !t.done)) {
      setRunning(true)
    }
  }, [tasks, running])

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setTasks(prev => {
        const pending = prev.filter(t => !t.done)
        if (pending.length === 0) {
          setRunning(false)
          return prev
        }
        // Scheduler: urgente primeiro
        const order: Priority[] = ['urgent', 'normal', 'low']
        let target: Task | null = null
        for (const p of order) {
          const found = pending.find(t => t.priority === p)
          if (found) { target = found; break }
        }
        if (!target) return prev

        const t = target
        const inc = PRIO_INFO[t.priority].weight
        return prev.map(x => {
          if (x.id !== t.id) return x
          const newProg = Math.min(100, x.progress + inc)
          if (newProg >= 100 && !x.done) {
            setLog(L => [`✓ Concluído: ${x.label}`, ...L].slice(0, 8))
            return { ...x, progress: 100, done: true }
          }
          return { ...x, progress: newProg }
        })
      })
    }, 180)
    return () => clearInterval(interval)
  }, [running])

  function clear() {
    setTasks([])
    setLog([])
    setRunning(false)
  }

  const queues = (Object.keys(PRIO_INFO) as Priority[]).map(p => ({
    priority: p,
    tasks: tasks.filter(t => t.priority === p),
    info: PRIO_INFO[p],
  }))

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: '.15em', color: PRP, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
          VISUAL 7 — CONCURRENT MODE
        </div>
        <h3 style={{ color: FG, fontSize: 26, fontWeight: 800, margin: '0 0 8px', lineHeight: 1 }}>
          Painel de Prioridades
        </h3>
        <p style={{ color: FGMUTE, fontSize: 13, margin: 0 }}>
          Adicione tarefas em filas diferentes e veja o scheduler do React priorizar urgentes. Como useTransition funciona por dentro.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {(Object.keys(PRIO_INFO) as Priority[]).map(p => {
          const info = PRIO_INFO[p]
          return (
            <button key={p}
              onClick={() => addTask(p)}
              style={{
                padding: '12px 20px', borderRadius: 10,
                border: `2px solid ${info.color}`,
                background: `${info.color}20`,
                color: info.color, fontSize: 13, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: `0 0 12px ${info.color}30`,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span style={{ fontSize: 18 }}>{info.emoji}</span>
              <span>+ {info.label}</span>
            </button>
          )
        })}

        <button onClick={clear} style={{
          marginLeft: 'auto',
          padding: '10px 18px', borderRadius: 10,
          border: `1.5px solid ${LINE}`,
          background: 'transparent', color: FGMUTE,
          fontSize: 12, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          🗑 limpar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
        {queues.map(q => (
          <div key={q.priority} style={{
            background: `${q.info.color}10`,
            border: `2px solid ${q.info.color}40`,
            borderRadius: 14, padding: 16,
            minHeight: 280,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 14, paddingBottom: 12,
              borderBottom: `1px solid ${q.info.color}30`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>{q.info.emoji}</span>
                <div>
                  <div style={{ color: q.info.color, fontSize: 13, fontWeight: 800, letterSpacing: '.05em' }}>
                    {q.info.label}
                  </div>
                  <div style={{ color: FGMUTE, fontSize: 9 }}>peso: {q.info.weight}</div>
                </div>
              </div>
              <div style={{
                padding: '4px 10px', borderRadius: 6,
                background: `${q.info.color}25`,
                color: q.info.color, fontSize: 12, fontWeight: 800,
              }}>
                {q.tasks.filter(t => !t.done).length}
              </div>
            </div>

            {q.tasks.length === 0 ? (
              <div style={{
                padding: 24, textAlign: 'center',
                color: MUTE, fontSize: 11,
              }}>
                vazio
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {q.tasks.map(t => (
                  <div key={t.id} style={{
                    background: t.done ? `${GRN}10` : BG,
                    border: `1px solid ${t.done ? GRN : LINE}`,
                    borderRadius: 8, padding: 10,
                    transition: 'all .2s',
                    opacity: t.done ? 0.6 : 1,
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: 11, marginBottom: 6,
                    }}>
                      <span style={{ color: t.done ? GRN : FG, fontWeight: 700 }}>
                        {t.done ? '✓' : '○'} {t.label}
                      </span>
                      <span style={{ color: FGMUTE, fontSize: 10 }}>
                        {Math.round(t.progress)}%
                      </span>
                    </div>
                    <div style={{
                      height: 4, background: CARD2, borderRadius: 2,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${t.progress}%`,
                        background: t.done ? GRN : q.info.color,
                        transition: 'width .15s linear',
                        boxShadow: `0 0 8px ${t.done ? GRN : q.info.color}60`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        background: BG, border: `1px solid ${LINE}`,
        borderRadius: 12, padding: 18,
      }}>
        <div style={{
          fontSize: 10, color: PRP, letterSpacing: '.15em',
          textTransform: 'uppercase', fontWeight: 800, marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: running ? GRN : MUTE,
            boxShadow: running ? `0 0 8px ${GRN}` : 'none',
            animation: running ? 'pulse 1s ease-in-out infinite' : 'none',
          }} />
          SCHEDULER LOG
          {running && <span style={{ color: GRN, fontSize: 9 }}>processando...</span>}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        {log.length === 0 ? (
          <p style={{ color: MUTE, fontSize: 12, margin: 0 }}>
            Adicione tarefas para ver o scheduler em ação...
          </p>
        ) : (
          log.map((l, i) => (
            <div key={i} style={{
              fontSize: 11, lineHeight: 1.8,
              color: i === 0 ? FG : MUTE,
              fontWeight: i === 0 ? 700 : 400,
            }}>
              {l}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — "Do Zero ao Sênior" — Mapa de Progressão
// ═══════════════════════════════════════════════════════════════════════════════

type Concept = { name: string; tip: string }
type Level = {
  id: string
  name: string
  label: string
  emoji: string
  concepts: Concept[]
}

const LEVELS: Level[] = [
  {
    id: 'iniciante', name: 'Iniciante', label: '01', emoji: '🌱',
    concepts: [
      { name: 'JSX',          tip: 'Sintaxe que vira React.createElement no build' },
      { name: 'Componentes',   tip: 'Funções que retornam JSX. Maiúsculas no nome.' },
      { name: 'Props',         tip: 'Argumentos do componente — fluem para baixo.' },
      { name: 'Eventos',       tip: 'onClick, onChange — camelCase em JSX.' },
      { name: 'useState',      tip: 'Estado local. Mudança causa re-render.' },
      { name: 'Listas e keys', tip: 'map() + key estável (id, não index).' },
    ],
  },
  {
    id: 'basico', name: 'Básico', label: '02', emoji: '🌿',
    concepts: [
      { name: 'Forms controlados',   tip: 'value + onChange = source of truth no estado.' },
      { name: 'useEffect',            tip: 'Efeitos colaterais com deps array e cleanup.' },
      { name: 'Conditional render',   tip: 'Operador ternário, &&, fragmentos.' },
      { name: 'Lifting state up',     tip: 'Mover estado para o ancestral comum.' },
      { name: 'children prop',         tip: 'Composição via children — flexível e estável.' },
      { name: 'Fetch + loading',      tip: 'useEffect + useState para dados assíncronos.' },
      { name: 'Componentes puros',    tip: 'Mesma entrada, mesma saída — sem mutação.' },
    ],
  },
  {
    id: 'intermediario', name: 'Intermediário', label: '03', emoji: '🌳',
    concepts: [
      { name: 'useReducer',          tip: 'Estado complexo via redutor — transições explícitas.' },
      { name: 'useContext',          tip: 'Tema, auth, locale — estados de baixa frequência.' },
      { name: 'useMemo/useCallback', tip: 'Estabilizar valores e funções para memo do filho.' },
      { name: 'React.memo',           tip: 'Comparação de props para evitar re-render.' },
      { name: 'Custom hooks',         tip: 'Reutilizar lógica entre componentes — useX.' },
      { name: 'Refs e DOM',           tip: 'useRef para acesso direto e valores mutáveis.' },
      { name: 'ErrorBoundary',         tip: 'Capturar erros de render — fallback UI.' },
      { name: 'Portals',              tip: 'Renderizar fora da hierarquia DOM (modals).' },
    ],
  },
  {
    id: 'avancado', name: 'Avançado', label: '04', emoji: '🏔️',
    concepts: [
      { name: 'Suspense',           tip: 'Boundary para loading assíncrono — RSC compatível.' },
      { name: 'useTransition',       tip: 'Marcar updates como não-urgentes.' },
      { name: 'useDeferredValue',     tip: 'Adiar render de valor caro — concurrent.' },
      { name: 'useImperativeHandle',  tip: 'Expor API imperativa via ref para o pai.' },
      { name: 'useSyncExternalStore', tip: 'Hook oficial para subscribe a store externo.' },
      { name: 'Render props',         tip: 'Passar JSX como função via prop.' },
      { name: 'Compound components',  tip: 'Padrão API: Tabs.Root, Tabs.List, Tabs.Trigger.' },
      { name: 'Code splitting',       tip: 'lazy + Suspense para chunks dinâmicos.' },
    ],
  },
  {
    id: 'senior', name: 'Sênior', label: '05', emoji: '👑',
    concepts: [
      { name: 'RSC (Server Components)', tip: 'Render no servidor — zero JS no client.' },
      { name: 'Streaming SSR',           tip: 'Suspense + renderToPipeableStream.' },
      { name: 'Reconciliation interna',  tip: 'Como Fiber prioriza, pausa e retoma trabalho.' },
      { name: 'Profiler API',             tip: 'Medir render duration — interactions.' },
      { name: 'Concurrent rendering',     tip: 'Modelo mental: render interrompível.' },
      { name: 'Architecture patterns',    tip: 'Container/presentational, hooks compostos.' },
      { name: 'Testing (RTL)',            tip: 'Comportamento, não implementação.' },
      { name: 'Bundle/perf optimization',  tip: 'Tree-shake, defer, code-split, profile.' },
      { name: 'Acessibilidade (a11y)',    tip: 'ARIA, foco, navegação por teclado, screen reader.' },
      { name: 'Mentorar e revisar',       tip: 'Saber explicar trade-offs e ensinar o time.' },
    ],
  },
]

const TOTAL_CONCEPTS = LEVELS.reduce((acc, l) => acc + l.concepts.length, 0)

function ProgressionMap() {
  const [known, setKnown] = useState<Set<string>>(new Set())
  const [tooltip, setTooltip] = useState<{ levelId: string; concept: string } | null>(null)

  function toggle(key: string) {
    setKnown(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.15em', color: C, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
            VISUAL 8 — ROADMAP
          </div>
          <h3 style={{ color: FG, fontSize: 26, fontWeight: 800, margin: '0 0 8px', lineHeight: 1 }}>
            Do Zero ao Sênior
          </h3>
          <p style={{ color: FGMUTE, fontSize: 13, margin: 0 }}>
            Cinco ilhas de progressão. Marque o que você já domina. {TOTAL_CONCEPTS} conceitos no total.
          </p>
        </div>

        <div style={{
          padding: '14px 22px', borderRadius: 12,
          background: `${C}12`,
          border: `1px solid ${LINE}`,
          textAlign: 'center', minWidth: 200,
        }}>
          <div style={{ fontSize: 9, color: C, fontWeight: 800, letterSpacing: '.15em', marginBottom: 4 }}>
            VOCÊ DOMINA
          </div>
          <div style={{ fontSize: 28, color: FG, fontWeight: 900, lineHeight: 1 }}>
            {known.size} <span style={{ fontSize: 16, color: FGMUTE }}>/ {TOTAL_CONCEPTS}</span>
          </div>
          <div style={{
            marginTop: 8, height: 4, background: BG,
            borderRadius: 2, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${(known.size / TOTAL_CONCEPTS) * 100}%`,
              background: C,
              transition: 'width .3s',
            }} />
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: 8 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(200px, 1fr))',
          gap: 12, position: 'relative', zIndex: 1,
        }}>
          {LEVELS.map((lvl) => {
            const knownInLevel = lvl.concepts.filter(c => known.has(`${lvl.id}.${c.name}`)).length
            const allKnown = knownInLevel === lvl.concepts.length

            return (
              <div key={lvl.id} style={{
                background: CARD,
                border: `1px solid ${allKnown ? C : LINE}`,
                borderTop: `2px solid ${allKnown ? C : LINE}`,
                borderRadius: 10, padding: 16,
                paddingTop: 40,
                marginTop: 28,
                transition: 'border-color .3s',
                position: 'relative',
              }}>
                {/* Emoji circle — fica acima da borda superior do card */}
                <div style={{
                  position: 'absolute', top: -24, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 44, height: 44, borderRadius: '50%',
                  background: CARD,
                  border: `1px solid ${allKnown ? C : LINE}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>
                  {lvl.emoji}
                </div>

                <div style={{ marginBottom: 14, textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: allKnown ? C : MUTE,
                      fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.1em',
                    }}>{lvl.label}</span>
                  </div>
                  <div style={{ color: allKnown ? C : FG, fontSize: 14, fontWeight: 700, lineHeight: 1 }}>
                    {lvl.name}
                  </div>
                  <div style={{ color: FGMUTE, fontSize: 10, marginTop: 4 }}>
                    {knownInLevel} / {lvl.concepts.length} dominados
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {lvl.concepts.map(c => {
                    const key = `${lvl.id}.${c.name}`
                    const isKnown = known.has(key)
                    const isHovered = tooltip?.levelId === lvl.id && tooltip?.concept === c.name

                    return (
                      <div key={c.name} style={{ position: 'relative' }}>
                        <button
                          onClick={() => toggle(key)}
                          onMouseEnter={() => setTooltip({ levelId: lvl.id, concept: c.name })}
                          onMouseLeave={() => setTooltip(null)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            width: '100%', textAlign: 'left',
                            padding: '7px 10px', borderRadius: 6,
                            border: `1px solid ${isKnown ? `${C}60` : LINE}`,
                            background: isKnown ? `${C}12` : 'transparent',
                            color: isKnown ? C : FGMUTE,
                            fontSize: 11, fontWeight: isKnown ? 600 : 400,
                            cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'all .15s',
                          }}
                        >
                          <span style={{
                            width: 12, height: 12, borderRadius: 3,
                            border: `1px solid ${isKnown ? C : LINE}`,
                            background: isKnown ? C : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8, color: BG, fontWeight: 900,
                            flexShrink: 0,
                          }}>
                            {isKnown ? '✓' : ''}
                          </span>
                          <span>{c.name}</span>
                        </button>

                        {isHovered && (
                          <div style={{
                            position: 'absolute', top: '100%', left: '50%',
                            transform: 'translateX(-50%)',
                            marginTop: 6, zIndex: 10,
                            background: CARD, border: `1px solid ${LINE}`,
                            borderTop: `2px solid ${C}`,
                            borderRadius: 8, padding: '8px 12px',
                            fontSize: 11, color: FGMUTE, lineHeight: 1.5,
                            width: 210,
                            boxShadow: '0 4px 16px rgba(0,0,0,.4)',
                            pointerEvents: 'none',
                          }}>
                            {c.tip}
                            <div style={{
                              position: 'absolute', top: -6, left: '50%',
                              transform: 'translateX(-50%) rotate(45deg)',
                              width: 10, height: 10,
                              background: CARD,
                              borderTop: `1px solid ${LINE}`,
                              borderLeft: `1px solid ${LINE}`,
                            }} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{
        marginTop: 20, padding: '12px 16px',
        background: `${C}08`, border: `1px solid ${LINE}`,
        borderLeft: `2px solid ${C}`,
        borderRadius: 6,
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <p style={{ color: FGMUTE, fontSize: 12, lineHeight: 1.7, margin: 0 }}>
          <strong style={{ color: FG }}>Marque conforme estuda.</strong> Passe o mouse sobre cada conceito para ver a dica curta.
          Não é uma checklist exaustiva — é um mapa para identificar onde está sua próxima fronteira de aprendizado.
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — React 19 — Novidades
// ═══════════════════════════════════════════════════════════════════════════════

function ReactNineteen() {
  const features = [
    {
      tag: 'API SIMPLIFICADA',
      name: 'ref como prop',
      color: C,
      before: 'const Input = forwardRef((props, ref) => (\n  <input ref={ref} {...props} />\n))',
      after: 'const Input = ({ ref, ...props }) => (\n  <input ref={ref} {...props} />\n)',
      desc: 'forwardRef não é mais necessário. ref vira uma prop comum como qualquer outra.',
    },
    {
      tag: 'NOVO HOOK',
      name: 'use()',
      color: PRP,
      before: 'useEffect(() => {\n  fetchUser().then(setUser)\n}, [])',
      after: 'const user = use(fetchUser())\n// render suspende até resolver',
      desc: 'Lê Promises e Context em render — funciona em condicionais. Integra com Suspense.',
    },
    {
      tag: 'NOVO HOOK',
      name: 'useOptimistic',
      color: AMB,
      before: 'const [loading, setLoading] = useState(false)\nconst [items, setItems] = useState([])\n// + lógica de rollback manual',
      after: 'const [items, addItem] = useOptimistic(\n  serverItems,\n  (state, newItem) => [...state, newItem]\n)',
      desc: 'UI otimista em uma linha. Mostra resultado esperado imediatamente, reverte se o servidor rejeitar.',
    },
    {
      tag: 'NOVO HOOK',
      name: 'useActionState',
      color: SKY,
      before: 'const [state, setState] = useState(null)\nconst [pending, setPending] = useState(false)\nasync function submit(e) {\n  e.preventDefault()\n  setPending(true)\n  ...',
      after: 'const [error, action, pending] =\n  useActionState(serverAction, null)\n\n<form action={action}>',
      desc: 'Gerencia state + loading de actions. Elimina o trio useState/isPending/useEffect para forms.',
    },
    {
      tag: 'MELHORADO',
      name: 'Context direto',
      color: GRN,
      before: '<ThemeContext.Provider value={theme}>\n  {children}\n</ThemeContext.Provider>',
      after: '<ThemeContext value={theme}>\n  {children}\n</ThemeContext>',
      desc: 'Não precisa mais de .Provider. O próprio Context é usado como componente.',
    },
    {
      tag: 'MELHORADO',
      name: 'Limpeza de refs',
      color: PINK,
      before: 'useEffect(() => {\n  // ...\n  return () => { ref.current = null }\n}, [])',
      after: '<div ref={(node) => {\n  // setup\n  return () => { /* cleanup */ }\n}} />',
      desc: 'Callback refs agora suportam função de cleanup — mesmo padrão do useEffect.',
    },
  ]

  const [selected, setSelected] = useState(0)
  const feat = features[selected]

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: '.15em', color: C, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
          VISUAL 9 — REACT 19
        </div>
        <h3 style={{ color: FG, fontSize: 24, fontWeight: 800, margin: '0 0 6px', lineHeight: 1 }}>
          O que mudou no React 19
        </h3>
        <p style={{ color: FGMUTE, fontSize: 13, margin: 0 }}>
          Selecione uma feature para ver antes/depois.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {features.map((f, i) => (
          <button
            key={f.name}
            onClick={() => setSelected(i)}
            style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: selected === i ? 700 : 400,
              border: `1px solid ${selected === i ? f.color : LINE}`,
              background: selected === i ? `${f.color}18` : 'transparent',
              color: selected === i ? f.color : FGMUTE,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{
          background: BG, border: `1px solid ${LINE}`, borderLeft: `3px solid #f87171`,
          borderRadius: 8, padding: 16,
        }}>
          <div style={{ fontSize: 9, color: '#f87171', fontWeight: 700, letterSpacing: '.12em', marginBottom: 10 }}>ANTES (React 18)</div>
          <pre style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5,
            color: FGMUTE, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          }}>{feat.before}</pre>
        </div>
        <div style={{
          background: BG, border: `1px solid ${LINE}`, borderLeft: `3px solid ${feat.color}`,
          borderRadius: 8, padding: 16,
        }}>
          <div style={{ fontSize: 9, color: feat.color, fontWeight: 700, letterSpacing: '.12em', marginBottom: 10 }}>DEPOIS (React 19)</div>
          <pre style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5,
            color: FG, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          }}>{feat.after}</pre>
        </div>
      </div>

      <div style={{
        padding: '12px 16px', background: `${feat.color}10`,
        border: `1px solid ${feat.color}40`, borderRadius: 8,
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 800, color: feat.color, letterSpacing: '.12em',
          background: `${feat.color}20`, padding: '3px 8px', borderRadius: 4, flexShrink: 0, marginTop: 2,
        }}>{feat.tag}</div>
        <p style={{ color: FGMUTE, fontSize: 13, lineHeight: 1.65, margin: 0 }}>{feat.desc}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHELL
// ═══════════════════════════════════════════════════════════════════════════════

export default function ReactVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    { id: 'concepts',   title: 'Como o React Pensa', subtitle: 'Fundamentos',        accent: C,    component: <ConceptCarousel /> },
    { id: 'fiber',      title: 'Árvore Fiber',        subtitle: 'Componentes',        accent: C,    component: <FiberExplorer /> },
    { id: 'rerender',   title: 'Re-renders',          subtitle: 'Cascata e memo',     accent: RED,  component: <ReRenderSimulator /> },
    { id: 'lifecycle',  title: 'Hook Lifecycle',      subtitle: 'Timeline',           accent: GRN,  component: <HookTimeline /> },
    { id: 'hooks',      title: 'Hooks',               subtitle: 'Os 10 essenciais',   accent: SKY,  component: <HookCarousel /> },
    { id: 'antipat',    title: 'Anti-patterns',       subtitle: 'Errado vs certo',    accent: RED,  component: <AntiPatternsGallery /> },
    { id: 'concurrent', title: 'Concurrent Mode',     subtitle: 'Prioridades',        accent: PRP,  component: <ConcurrentMode /> },
    { id: 'roadmap',    title: 'Do Zero ao Sênior',   subtitle: 'Progressão',         accent: GOLD, component: <ProgressionMap /> },
    { id: 'react19',    title: 'React 19',             subtitle: 'O que mudou',        accent: C,    component: <ReactNineteen /> },
  ]

  return <VisuaisShell visuals={visuals} active={active} onChange={setActive} />
}
