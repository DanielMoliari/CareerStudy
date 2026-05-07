'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

// ── Paleta a11y ─────────────────────────────────────────────────────────────
const C      = '#ef4444'   // scarlet — cor do projeto
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — ARIA: aria-label vs aria-labelledby vs aria-describedby
// Justificativa: os três atributos de label ARIA são confundidos constantemente.
// Uma tabela comparativa com exemplos de código inline e quando usar cada um
// é mais didática do que qualquer descrição textual.
// ═══════════════════════════════════════════════════════════════════════════════

const ARIA_OPTIONS: ComparisonOption[] = [
  { id: 'label',       label: 'aria-label',       sublabel: 'Texto direto no atributo',   color: C },
  { id: 'labelledby',  label: 'aria-labelledby',  sublabel: 'Aponta para elemento ID',    color: SKY },
  { id: 'describedby', label: 'aria-describedby', sublabel: 'Descrição adicional',        color: AMB },
]

const ARIA_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'when',
    label: 'Quando usar',
    category: 'Aplicação',
    description: 'Situação ideal para cada atributo',
    values: {
      label:       { rating: 'good',      note: 'Sem texto visível: botão com só ícone, campo sem label na tela' },
      labelledby:  { rating: 'excellent', note: 'Texto label já existe na tela — associe ao elemento visível' },
      describedby: { rating: 'good',      note: 'Informação extra após o label: dicas, instruções, mensagens de erro' },
    },
  },
  {
    id: 'priority',
    label: 'Prioridade de anúncio',
    category: 'Comportamento',
    description: 'Quando múltiplos atributos coexistem, qual prevalece',
    values: {
      label:       { rating: 'good',      note: 'Sobrescreve texto visível — inconsistência se diferente do que está na tela' },
      labelledby:  { rating: 'excellent', note: 'Prevalece sobre aria-label — aponta ao texto real, mais robusto' },
      describedby: { rating: 'fair',      note: 'Anunciado APÓS o label — complementa, nunca substitui' },
    },
  },
  {
    id: 'robustness',
    label: 'Robustez',
    category: 'Qualidade',
    description: 'Resistência a mudanças de conteúdo e localização',
    values: {
      label:       { rating: 'fair',      note: 'Texto duplicado no atributo — deve ser atualizado manualmente se o conteúdo mudar' },
      labelledby:  { rating: 'excellent', note: 'Referencia o texto real — atualiza automaticamente quando o texto referenciado muda' },
      describedby: { rating: 'excellent', note: 'Referencia o texto da descrição — atualiza automaticamente' },
    },
  },
  {
    id: 'example',
    label: 'Exemplo de código',
    category: 'Uso prático',
    description: 'Exemplo real de implementação',
    values: {
      label:       { rating: 'good',      note: '<button aria-label="Fechar modal"><XIcon /></button>' },
      labelledby:  { rating: 'excellent', note: '<h2 id="title">Editar</h2> <dialog aria-labelledby="title">' },
      describedby: { rating: 'good',      note: '<input aria-describedby="err"> <p id="err">E-mail inválido</p>' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Anti-patterns de acessibilidade
// Justificativa: os erros mais comuns em produção (outline:none, onClick em div,
// placeholder como label, alt vazio errado) são facilmente reconhecíveis com
// diff errado × correto — texto não cria o mesmo reconhecimento de padrão.
// ═══════════════════════════════════════════════════════════════════════════════

const A11Y_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Remover outline de foco sem alternativa',
    wrong: [
      [{ text: '/* ❌ Navegação por teclado invisível */', color: FGMUTE }],
      [{ text: 'button:focus {', color: FG }],
      [{ text: '  outline: none;', color: C }],
      [{ text: '}', color: FG }],
      [{ text: '/* Usuário de teclado não sabe onde está */', color: FGMUTE }],
    ],
    right: [
      [{ text: '/* ✓ Remove para mouse, mantém para teclado */', color: FGMUTE }],
      [{ text: 'button:focus {', color: FG }],
      [{ text: '  outline: none;', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: 'button:focus-visible {', color: GRN }],
      [{ text: '  outline: 2px solid #3178C6;', color: GRN }],
      [{ text: '  outline-offset: 2px;', color: GRN }],
      [{ text: '}', color: GRN }],
    ],
    why: ':focus-visible mostra o outline apenas quando navegado por teclado (não mouse). Remover outline completamente quebra a acessibilidade para usuários de teclado — eles perdem a referência visual de onde o foco está.',
  },
  {
    title: 'onClick em div sem semântica de botão',
    wrong: [
      [{ text: '{/* ❌ Sem role, sem foco, sem teclado */', color: FGMUTE }],
      [{ text: '<div', color: C }],
      [{ text: '  onClick={handleSubmit}', color: C }],
      [{ text: '  className="btn"', color: FGMUTE }],
      [{ text: '>', color: C }],
      [{ text: '  Enviar', color: FGMUTE }],
      [{ text: '</div>', color: C }],
    ],
    right: [
      [{ text: '{/* ✓ Semântica completa: foco, Enter/Space, role */', color: FGMUTE }],
      [{ text: '<button', color: GRN }],
      [{ text: '  type="submit"', color: GRN }],
      [{ text: '  onClick={handleSubmit}', color: GRN }],
      [{ text: '  className="btn"', color: FGMUTE }],
      [{ text: '>', color: GRN }],
      [{ text: '  Enviar', color: FGMUTE }],
      [{ text: '</button>', color: GRN }],
    ],
    why: '<div> não tem role, não recebe foco via Tab, não responde a Enter/Space. Usuários de teclado e leitores de tela não conseguem ativar o elemento. <button> tem tudo isso embutido — zero esforço adicional.',
  },
  {
    title: 'Placeholder como único label do input',
    wrong: [
      [{ text: '{/* ❌ Placeholder desaparece ao digitar */', color: FGMUTE }],
      [{ text: '<input', color: C }],
      [{ text: '  type="email"', color: FGMUTE }],
      [{ text: '  placeholder="E-mail"', color: C }],
      [{ text: '/>', color: C }],
      [{ text: '{/* Usuário não sabe o que preencher depois */', color: FGMUTE }],
      [{ text: '{/* Leitor de tela pode não anunciar o placeholder */', color: FGMUTE }],
    ],
    right: [
      [{ text: '{/* ✓ Label sempre visível e associada ao input */', color: FGMUTE }],
      [{ text: '<label htmlFor="email">', color: GRN }],
      [{ text: '  E-mail', color: GRN }],
      [{ text: '</label>', color: GRN }],
      [{ text: '<input', color: GRN }],
      [{ text: '  id="email"', color: GRN }],
      [{ text: '  type="email"', color: FGMUTE }],
      [{ text: '  placeholder="exemplo@email.com"', color: FGMUTE }],
      [{ text: '/>', color: GRN }],
    ],
    why: 'Placeholder some ao digitar — o usuário não consegue ver o que estava pedindo se precisar revisar. Leitores de tela não garantem anunciar placeholder. Label com htmlFor é a associação semântica correta e permanece visível.',
  },
  {
    title: 'alt vazio em imagem informativa (ou ausente em decorativa)',
    wrong: [
      [{ text: '{/* ❌ alt vazio em imagem informativa */', color: FGMUTE }],
      [{ text: '<img', color: C }],
      [{ text: '  src="grafico-vendas.png"', color: FGMUTE }],
      [{ text: '  alt=""  {/* leitor pula — perde info */', color: C }],
      [{ text: '/>', color: C }],
      [{ text: '', color: FG }],
      [{ text: '{/* ❌ sem alt em decorativa — lê nome do arquivo */', color: FGMUTE }],
      [{ text: '<img src="divider.png" />', color: C }],
    ],
    right: [
      [{ text: '{/* ✓ alt descritivo em imagem informativa */', color: FGMUTE }],
      [{ text: '<img', color: GRN }],
      [{ text: '  src="grafico-vendas.png"', color: FGMUTE }],
      [{ text: '  alt="Vendas cresceram 40% em março de 2024"', color: GRN }],
      [{ text: '/>', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: '{/* ✓ alt="" em decorativa — leitor ignora */', color: FGMUTE }],
      [{ text: '<img src="divider.png" alt="" />', color: GRN }],
    ],
    why: 'alt="" (atributo presente e vazio) em imagem informativa faz o leitor de tela pular a imagem — informação perdida. Sem atributo alt, o leitor anuncia o nome do arquivo. Imagens decorativas devem ter alt="" para serem ignoradas.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Árvore de decisão: como lidar com ícones SVG
// Justificativa: "como tratar ícones SVG para acessibilidade?" tem 4 respostas
// diferentes dependendo do contexto. A árvore de decisão torna a escolha
// correta em segundos — evita decorar regras e aplica o raciocínio correto.
// ═══════════════════════════════════════════════════════════════════════════════

const SVG_ROOT: DTNode = {
  id: 'root',
  question: 'O ícone SVG tem texto visível ao lado ou próximo?',
  children: [
    { label: 'Sim — texto ao lado descreve a função', nodeId: 'decorative', color: GRN },
    { label: 'Não — o ícone é o único elemento visual', nodeId: 'standalone', color: AMB },
  ],
}

const SVG_NODES: Record<string, DTNode> = {
  decorative: {
    id: 'decorative',
    recommendation: 'aria-hidden="true" no SVG',
    detail: 'O texto ao lado já descreve o elemento. O ícone é decorativo nesse contexto. aria-hidden="true" faz o leitor de tela ignorar o SVG completamente — o texto visível é suficiente. Sem aria-hidden, o leitor pode anunciar o ícone como texto adicional desnecessário.',
    color: GRN,
    icon: '✅',
  },
  standalone: {
    id: 'standalone',
    question: 'O ícone está dentro de um botão ou link?',
    children: [
      { label: 'Sim — botão ou link apenas com ícone', nodeId: 'icon-button', color: SKY },
      { label: 'Não — SVG inline informativo isolado', nodeId: 'informative', color: PRP },
    ],
  },
  'icon-button': {
    id: 'icon-button',
    recommendation: 'aria-label no botão + aria-hidden no SVG',
    detail: '<button aria-label="Fechar modal"><XIcon aria-hidden="true" /></button>. O aria-label no botão descreve a ação. aria-hidden="true" no SVG evita que o leitor anuncie o SVG em duplicata. Nunca use aria-label no SVG quando ele está dentro de um botão — pode criar anúncios duplicados.',
    color: SKY,
    icon: '🔘',
  },
  informative: {
    id: 'informative',
    question: 'É um SVG inline ou um <img src="...svg">?',
    children: [
      { label: 'SVG inline (<svg>...)</svg>)', nodeId: 'inline-svg', color: AMB },
      { label: '<img src="grafico.svg">', nodeId: 'img-svg', color: C },
    ],
  },
  'inline-svg': {
    id: 'inline-svg',
    recommendation: '<title> + aria-labelledby',
    detail: '<svg aria-labelledby="chart-title"><title id="chart-title">Gráfico de vendas — crescimento de 40% em março</title></svg>. O <title> é o primeiro filho do SVG e serve como label. aria-labelledby aponta para o ID do title. Role "img" pode ser adicionado opcionalmente para browsers mais antigos.',
    color: AMB,
    icon: '📊',
  },
  'img-svg': {
    id: 'img-svg',
    recommendation: 'alt no <img> normalmente',
    detail: '<img src="grafico.svg" alt="Gráfico de vendas — crescimento de 40% em março">. Para <img>, use alt como qualquer outra imagem. Decorativa: alt="". Nunca use <title> ou aria-labelledby em <img> — não funcionam nesse contexto.',
    color: C,
    icon: '🖼️',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Focus Management: componente interativo de focus order
// Justificativa: a ordem de foco e o conceito de focus trap são melhores
// explicados com uma demonstração interativa do que com texto. O componente
// customizado mostra visualmente como o Tab navega e onde o foco "prende".
// ═══════════════════════════════════════════════════════════════════════════════

interface FocusStep {
  id: string
  label: string
  element: string
  description: string
  color: string
  isTrapped?: boolean
}

const FOCUS_STEPS: FocusStep[] = [
  { id: 'skip', label: 'Skip link', element: '<a href="#main">', description: 'Primeiro elemento — permite pular para o conteúdo. Visível apenas quando focado via :focus-visible.', color: PRP },
  { id: 'nav1', label: 'Nav — Início', element: '<a href="/">', description: 'Primeiro link de navegação. Tab avança para o próximo.', color: C },
  { id: 'nav2', label: 'Nav — Sobre', element: '<a href="/sobre">', description: 'Segundo link de navegação.', color: C },
  { id: 'nav3', label: 'Nav — Contato', element: '<a href="/contato">', description: 'Último item da nav — Tab vai para o conteúdo principal.', color: C },
  { id: 'main-title', label: 'Título principal', element: '<h1>', description: 'Headings não são focáveis por padrão — Tab pula diretamente para o input.', color: FGMUTE },
  { id: 'input', label: 'Campo de busca', element: '<input type="search">', description: 'Input focável — Tab avança para o botão.', color: GRN },
  { id: 'btn', label: 'Botão Buscar', element: '<button>', description: 'Enter executa a busca. Tab vai para o próximo elemento interativo.', color: GRN },
  { id: 'modal-btn', label: 'Abre Modal', element: '<button>', description: 'Enter abre o modal. Foco vai para dentro do modal — focus trap ativo!', color: AMB, isTrapped: true },
]

const MODAL_STEPS: FocusStep[] = [
  { id: 'm-title', label: 'Título do modal', element: '<h2 id="title">', description: 'Ao abrir: foco vai automaticamente para o primeiro elemento do modal via JavaScript.', color: AMB },
  { id: 'm-input', label: 'Input no modal', element: '<input>', description: 'Tab navega normalmente dentro do modal.', color: AMB },
  { id: 'm-cancel', label: 'Cancelar', element: '<button>', description: 'Tab avança para o botão de confirmação — ao passar do último, volta para o primeiro (focus trap).', color: AMB },
  { id: 'm-confirm', label: 'Confirmar', element: '<button>', description: 'Tab aqui → volta para o título do modal (ciclo). Esc fecha e restaura foco ao botão "Abre Modal".', color: AMB },
]

function FocusOrderVisual() {
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [inModal, setInModal] = useState(false)

  const currentSteps = inModal ? MODAL_STEPS : FOCUS_STEPS
  const active = currentSteps.find(s => s.id === activeStep)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          fontSize: 11, color: FGMUTE, background: CARD, border: `1px solid ${LINE}`,
          borderRadius: 8, padding: '8px 16px', flex: 1,
        }}>
          {inModal
            ? 'Focus trap ativo — Tab fica preso dentro do modal. Clique nos elementos para explorar.'
            : 'Clique nos elementos para ver como o Tab navega. Tab order = ordem no DOM.'}
        </div>
        <button
          onClick={() => { setInModal(!inModal); setActiveStep(null) }}
          style={{
            background: inModal ? `${AMB}20` : `${GRN}20`,
            border: `1px solid ${inModal ? AMB : GRN}`,
            color: inModal ? AMB : GRN,
            borderRadius: 8, padding: '8px 14px', fontSize: 11, fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {inModal ? 'Sair do modal' : 'Abrir modal'}
        </button>
      </div>

      {/* Sequência de foco */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {currentSteps.map((step, i) => {
          const isActive = activeStep === step.id
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(isActive ? null : step.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: isActive ? `${step.color}20` : CARD,
                border: `1.5px solid ${isActive ? step.color : LINE}`,
                borderRadius: 8, padding: '8px 12px',
                cursor: 'pointer', transition: 'all .15s',
              }}
            >
              <span style={{
                background: step.color, color: '#fff',
                borderRadius: 4, width: 20, height: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, flexShrink: 0,
              }}>{i + 1}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: isActive ? step.color : FG }}>{step.label}</div>
                <div style={{ fontSize: 9, color: FGMUTE, fontFamily: "'JetBrains Mono', monospace" }}>{step.element}</div>
              </div>
              {step.isTrapped && (
                <span style={{ fontSize: 9, background: `${AMB}20`, color: AMB, borderRadius: 4, padding: '1px 5px', marginLeft: 4 }}>
                  trap
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Painel de detalhes */}
      {active && (
        <div style={{
          background: CARD, borderRadius: 12, padding: 20,
          border: `1px solid ${active.color}40`, flex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <code style={{ fontSize: 13, color: active.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
              {active.element}
            </code>
            <span style={{ fontSize: 11, color: FGMUTE }}>→ <strong style={{ color: active.color }}>{active.label}</strong></span>
          </div>
          <p style={{ fontSize: 13, color: FG, margin: 0, lineHeight: 1.7 }}>{active.description}</p>
        </div>
      )}

      {!active && (
        <div style={{ background: CARD, borderRadius: 12, padding: 20, border: `1px solid ${LINE}`, flex: 1 }}>
          <p style={{ fontSize: 12, color: FGMUTE, margin: 0, textAlign: 'center', paddingTop: 20 }}>
            Clique em um elemento para ver como o Tab se comporta e por quê
          </p>
        </div>
      )}

      {/* Legenda */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { color: PRP, label: 'Skip link' },
          { color: C, label: 'Navegação' },
          { color: GRN, label: 'Conteúdo' },
          { color: AMB, label: 'Focus trap (modal)' },
          { color: FGMUTE, label: 'Não focável (heading)' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            <span style={{ fontSize: 10, color: FGMUTE }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function AccessibilityA11yVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'aria-labels',
      title: 'ARIA Labels Comparados',
      subtitle: 'aria-label × aria-labelledby × aria-describedby — quando usar cada um',
      accent: C,
      component: (
        <ComparisonTable
          options={ARIA_OPTIONS}
          criteria={ARIA_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns de A11y',
      subtitle: 'outline:none, onClick em div, placeholder como label, alt errado',
      accent: AMB,
      component: (
        <AntiPatternsGallery
          patterns={A11Y_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'svg-decision',
      title: 'Ícones SVG Acessíveis',
      subtitle: 'Decorativo, botão com ícone ou SVG informativo — decisão correta em segundos',
      accent: GRN,
      component: (
        <DecisionTree
          root={SVG_ROOT}
          nodes={SVG_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'focus-order',
      title: 'Tab Order e Focus Trap',
      subtitle: 'Ordem de navegação, skip links e focus trap em modal — interativo',
      accent: SKY,
      component: <FocusOrderVisual />,
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
