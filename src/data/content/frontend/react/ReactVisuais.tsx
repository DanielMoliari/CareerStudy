'use client'
import { useState, useEffect } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
import { TreeExplorer } from '@/components/visuals/TreeExplorer'
import type { TreeNode, TreeNodeTypeMeta } from '@/components/visuals/TreeExplorer'
import { ReRenderSimulator } from '@/components/visuals/ReRenderSimulator'
import type { RRNode, Scenario } from '@/components/visuals/ReRenderSimulator'
import { HookTimeline } from '@/components/visuals/HookTimeline'
import type { TimelinePhase } from '@/components/visuals/HookTimeline'
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { PriorityPanel } from '@/components/visuals/PriorityPanel'
import type { PriorityInfo } from '@/components/visuals/PriorityPanel'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'
import { FeaturesCarousel } from '@/components/visuals/FeaturesCarousel'
import type { Feature } from '@/components/visuals/FeaturesCarousel'

// ── Paleta React ─────────────────────────────────────────────────────────────────
const C      = '#61DAFB'   // React aqua
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
// VISUAL 1 — Ilustrações do carrossel de conceitos
// ═══════════════════════════════════════════════════════════════════════════════

function SlideIllustrationLibrary() {
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

// ── VISUAL 1 — Dados do Carrossel de Conceitos ──────────────────────────────────

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

// ── VISUAL 2 — Árvore Fiber ───────────────────────────────────────────────────────

const FIBER_TREE: TreeNode = {
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

const FIBER_TYPE_MAP: Record<string, TreeNodeTypeMeta> = {
  host:      { color: MUTE, label: 'Host',      icon: '⚓', desc: 'Nó DOM nativo (div, span, input...)' },
  component: { color: C,    label: 'Component', icon: '◆', desc: 'Função React padrão' },
  context:   { color: AMB,  label: 'Context',   icon: '◎', desc: 'Provedor de contexto global' },
  memo:      { color: GRN,  label: 'Memo',      icon: '⚡', desc: 'Envolvido em React.memo' },
}

// ── VISUAL 3 — Re-render Cascade ─────────────────────────────────────────────────

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

const RR_SCENARIOS: Scenario[] = [
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

// ── VISUAL 4 — Hook Lifecycle Timeline ───────────────────────────────────────────

const HOOK_PHASES: TimelinePhase[] = [
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

// ── VISUAL 5 — Hooks de Bolso ─────────────────────────────────────────────────────

const HOOK_CARDS: CarouselCard[] = [
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

// ── VISUAL 6 — Anti-patterns ──────────────────────────────────────────────────────

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

// ── VISUAL 7 — Concurrent Mode Priorities ────────────────────────────────────────

const CONCURRENT_PRIORITIES: Record<string, PriorityInfo> = {
  urgent: { color: RED,  emoji: '🔥', label: 'URGENTE', weight: 30 },
  normal: { color: SKY,  emoji: '⚡', label: 'NORMAL',  weight: 12 },
  low:    { color: MUTE, emoji: '🐢', label: 'BAIXA',   weight: 6  },
}

const CONCURRENT_ORDER = ['urgent', 'normal', 'low']

// ── VISUAL 8 — Progressão de nível ───────────────────────────────────────────────

const PROGRESSION_LEVELS: ProgressionLevel[] = [
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

// ── VISUAL 9 — React 19 features ──────────────────────────────────────────────────

const REACT_19_FEATURES: Feature[] = [
  {
    tag: 'API SIMPLIFICADA',
    name: 'ref como prop',
    color: C,
    before: 'const Input = forwardRef((props, ref) => (\n  <input ref={ref} {...props} />\n))',
    after: 'const Input = ({ ref, ...props }) => (\n  <input ref={ref} {...props} />\n)',
    beforeLabel: 'ANTES (React 18)',
    afterLabel: 'DEPOIS (React 19)',
    desc: 'forwardRef não é mais necessário. ref vira uma prop comum como qualquer outra.',
  },
  {
    tag: 'NOVO HOOK',
    name: 'use()',
    color: PRP,
    before: 'useEffect(() => {\n  fetchUser().then(setUser)\n}, [])',
    after: 'const user = use(fetchUser())\n// render suspende até resolver',
    beforeLabel: 'ANTES (React 18)',
    afterLabel: 'DEPOIS (React 19)',
    desc: 'Lê Promises e Context em render — funciona em condicionais. Integra com Suspense.',
  },
  {
    tag: 'NOVO HOOK',
    name: 'useOptimistic',
    color: AMB,
    before: 'const [loading, setLoading] = useState(false)\nconst [items, setItems] = useState([])\n// + lógica de rollback manual',
    after: 'const [items, addItem] = useOptimistic(\n  serverItems,\n  (state, newItem) => [...state, newItem]\n)',
    beforeLabel: 'ANTES (React 18)',
    afterLabel: 'DEPOIS (React 19)',
    desc: 'UI otimista em uma linha. Mostra resultado esperado imediatamente, reverte se o servidor rejeitar.',
  },
  {
    tag: 'NOVO HOOK',
    name: 'useActionState',
    color: SKY,
    before: 'const [state, setState] = useState(null)\nconst [pending, setPending] = useState(false)\nasync function submit(e) {\n  e.preventDefault()\n  setPending(true)\n  ...',
    after: 'const [error, action, pending] =\n  useActionState(serverAction, null)\n\n<form action={action}>',
    beforeLabel: 'ANTES (React 18)',
    afterLabel: 'DEPOIS (React 19)',
    desc: 'Gerencia state + loading de actions. Elimina o trio useState/isPending/useEffect para forms.',
  },
  {
    tag: 'MELHORADO',
    name: 'Context direto',
    color: GRN,
    before: '<ThemeContext.Provider value={theme}>\n  {children}\n</ThemeContext.Provider>',
    after: '<ThemeContext value={theme}>\n  {children}\n</ThemeContext>',
    beforeLabel: 'ANTES (React 18)',
    afterLabel: 'DEPOIS (React 19)',
    desc: 'Não precisa mais de .Provider. O próprio Context é usado como componente.',
  },
  {
    tag: 'MELHORADO',
    name: 'Limpeza de refs',
    color: PINK,
    before: 'useEffect(() => {\n  // ...\n  return () => { ref.current = null }\n}, [])',
    after: '<div ref={(node) => {\n  // setup\n  return () => { /* cleanup */ }\n}} />',
    beforeLabel: 'ANTES (React 18)',
    afterLabel: 'DEPOIS (React 19)',
    desc: 'Callback refs agora suportam função de cleanup — mesmo padrão do useEffect.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// SHELL — monta os visuais genéricos com dados do React
// ═══════════════════════════════════════════════════════════════════════════════

export default function ReactVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'concepts',
      title: 'Como o React Pensa',
      subtitle: 'Fundamentos',
      accent: C,
      component: (
        <ConceptCarousel
          slides={CONCEPT_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          label="VISUAL 1 — CONCEITOS FUNDAMENTAIS"
          heading="Como o React Pensa"
          description="Oito slides essenciais. Os mesmos conceitos que separam quem usa React de quem entende React."
        />
      ),
    },
    {
      id: 'fiber',
      title: 'Árvore Fiber',
      subtitle: 'Componentes',
      accent: C,
      component: (
        <TreeExplorer
          tree={FIBER_TREE}
          typeMap={FIBER_TYPE_MAP}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          card2Color={CARD2}
          goldColor={GOLD}
          defaultSelected="app"
          label="VISUAL 2 — ÁRVORE FIBER"
          heading="Explorador da Casa React"
          description="Cada componente é um cômodo. Clique para inspecionar. Hierarquia, tipos e dicas de entrevista revelam como React organiza sua árvore."
        />
      ),
    },
    {
      id: 'rerender',
      title: 'Re-renders',
      subtitle: 'Cascata e memo',
      accent: RED,
      component: (
        <ReRenderSimulator
          nodes={RR_NODES}
          scenarios={RR_SCENARIOS}
          accentColor={RED}
          fireColor={RED}
          safeColor={GRN}
          bgColor={BG}
          card2Color={CARD2}
          label="VISUAL 3 — CASCATA DE RE-RENDERS"
          heading="Propagação de Fogo"
          description="Escolha um cenário e veja o fogo do re-render descendo a árvore. memo é seu escudo verde."
        />
      ),
    },
    {
      id: 'lifecycle',
      title: 'Hook Lifecycle',
      subtitle: 'Timeline',
      accent: GRN,
      component: (
        <HookTimeline
          phases={HOOK_PHASES}
          accentColor={GRN}
          bgColor={BG}
          gradientColors={[GRN, SKY, AMB, PRP, PINK, C, RED]}
          defaultActive="effect"
          label="VISUAL 4 — HOOK LIFECYCLE"
          heading="Timeline das Estações"
          description="Cada fase do ciclo de vida é uma estação. Clique para ver explicação detalhada e código."
        />
      ),
    },
    {
      id: 'hooks',
      title: 'Hooks',
      subtitle: 'Os 10 essenciais',
      accent: SKY,
      component: (
        <CardCarousel
          cards={HOOK_CARDS}
          bgColor={BG}
          accentColor={SKY}
          label="VISUAL 5 — HOOKS DE BOLSO"
          heading="Os Hooks em 60 Segundos"
          description="Dez hooks essenciais. Quando usar, quando não usar e dificuldade — em um cartão."
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
          patterns={ANTI_PATTERNS}
          accentColor={RED}
          bgColor={BG}
          errorColor={RED}
          successColor={GRN}
          warningColor={AMB}
          label="VISUAL 6 — ANTI-PATTERNS"
          heading="Galeria do Horror"
          description="Oito armadilhas comuns. À esquerda o erro, à direita a versão correta. Errado vs Certo, sempre lado a lado."
        />
      ),
    },
    {
      id: 'concurrent',
      title: 'Concurrent Mode',
      subtitle: 'Prioridades',
      accent: PRP,
      component: (
        <PriorityPanel
          priorities={CONCURRENT_PRIORITIES}
          priorityOrder={CONCURRENT_ORDER}
          accentColor={PRP}
          bgColor={BG}
          label="VISUAL 7 — CONCURRENT MODE"
          heading="Painel de Prioridades"
          description="Adicione tarefas em filas diferentes e veja o scheduler do React priorizar urgentes. Como useTransition funciona por dentro."
        />
      ),
    },
    {
      id: 'roadmap',
      title: 'Do Zero ao Sênior',
      subtitle: 'Progressão',
      accent: GOLD,
      component: (
        <ProgressionMap
          levels={PROGRESSION_LEVELS}
          accentColor={GOLD}
          bgColor={BG}
          cardColor={CARD}
          label="VISUAL 8 — ROADMAP"
          heading="Do Zero ao Sênior"
          description={`Cinco ilhas de progressão. Marque o que você já domina. ${PROGRESSION_LEVELS.reduce((a, l) => a + l.concepts.length, 0)} conceitos no total.`}
          hintText="Marque conforme estuda. Passe o mouse sobre cada conceito para ver a dica curta. Não é uma checklist exaustiva — é um mapa para identificar onde está sua próxima fronteira de aprendizado."
        />
      ),
    },
    {
      id: 'react19',
      title: 'React 19',
      subtitle: 'O que mudou',
      accent: C,
      component: (
        <FeaturesCarousel
          features={REACT_19_FEATURES}
          accentColor={C}
          bgColor={BG}
          label="VISUAL 9 — REACT 19"
          heading="O que mudou no React 19"
          description="Selecione uma feature para ver antes/depois."
          beforeColor="#f87171"
        />
      ),
    },
  ]

  return <VisuaisShell visuals={visuals} active={active} onChange={setActive} />
}
