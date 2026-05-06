'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, PatternItem, DepRow, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta React ─────────────────────────────────────────────────────────────────
const C      = '#61DAFB'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const MUTE   = '#475569'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

// Paleta usada apenas no componente de UI (PdfModal, HeroCard etc.)
void BG; void CARD; void LINE; void MUTE; void FG; void FGMUTE

// ── Metadados dos PDFs ────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 20 perguntas de React — virtual DOM, Fiber, Concurrent Mode, RSC boundary, stale closure, React 19 (use, useOptimistic, useActionState), hooks rules, forwardRef, Suspense waterfall e composição — com resposta estruturada para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Todos os hooks + React 19 + patterns numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: assinatura de todos os hooks, dependency array, regras, patterns de composição e dicas de performance. Tudo que você precisa checar rapidamente sem abrir a documentação.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'TOP·ONLY para regras dos hooks, SPCK para re-renders, VALUE vs FUNCTION para memoização, Timeline do Paint para useLayoutEffect e a regra do dependency array. Associações que grudam.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'O que não fazer — e por quê',
    type: 'antipatterns',
    pages: 3,
    description: 'Os 8 anti-patterns mais comuns: stale closure, loop infinito em useEffect, key como index, mutação direta de estado, Context re-render, async em effect, StrictMode e over-memoização. Com código errado x correto.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'React do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental completo com 12 categorias e checklist de entrevista de 20 perguntas que você deve conseguir responder de cabeça. Use para auto-avaliar o domínio do ecossistema React inteiro.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
]

const TYPE_COLOR: Record<PdfType, string> = {
  qa:           '#a78bfa',
  cheatsheet:   C,
  mnemonics:    '#4ade80',
  antipatterns: '#ef4444',
  mindmap:      '#f59e0b',
}

void TYPE_COLOR

// ── Dados: Q&A ────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Como funciona o virtual DOM e o algoritmo de reconciliation?',
    a: 'React mantém uma árvore virtual em memória. Quando estado/props mudam, gera nova árvore e usa diffing para comparar com a anterior — identificando o mínimo de operações no DOM real.',
    bullets: [
      'Tipos diferentes produzem árvores diferentes — não tenta reaproveitar.',
      'key identifica elementos entre renders (essencial em listas dinâmicas).',
      'Fiber reimplementou tudo como lista ligada de "units of work" pausáveis entre frames.',
    ],
    tip: 'Comece pelo problema que o VDOM resolve. Depois explique o diff. Mencione key como identidade. Termine com Fiber para mostrar profundidade.',
  },
  {
    level: 'Senior',
    q: 'O que mudou no React 18? Explique Concurrent Mode.',
    a: 'React 18 introduziu Concurrent Mode: o renderer pode pausar trabalho de baixa prioridade e priorizar interações do usuário.',
    bullets: [
      'createRoot habilita concurrent features (sem ele nada disso funciona).',
      'Automatic batching agrupa setState em contextos assíncronos (Promises, timeouts).',
      'useTransition marca updates como não-urgentes com isPending.',
      'useDeferredValue cria versão atrasada de valores externos.',
      'Suspense no servidor habilita streaming de HTML.',
    ],
    tip: 'Mencione createRoot como pré-requisito obrigatório — sem ele nenhuma concurrent feature funciona.',
  },
  {
    level: 'Senior',
    q: 'Explique o problema de stale closure e como resolver.',
    a: 'Quando você usa uma função dentro de useEffect, ela captura os valores do momento em que foi criada. Se o estado mudar depois, a closure aponta para o valor antigo — bug clássico em setInterval com [].',
    bullets: [
      'Adicionar a variável no dependency array (linter exhaustive-deps já avisa).',
      'Usar useRef para manter referência mutável ao valor atual sem re-render.',
      'Usar a forma funcional do setState: setCount(c => c + 1).',
    ],
    tip: 'Demonstre que você já resolveu em produção: descreva o bug, explique por que ocorre, apresente as 3 soluções.',
  },
  {
    level: 'Senior',
    q: 'Como funciona a arquitetura Fiber internamente?',
    a: 'O reconciliador antigo (≤15) processava a árvore toda de forma síncrona ininterruptível. Fiber reimplementou como lista ligada de fiber nodes — um por instância.',
    bullets: [
      'Permite dividir trabalho em unidades pausáveis entre frames.',
      'Permite atribuir prioridades diferentes a cada update.',
      'Permite abandonar e reiniciar trabalho (em Concurrent Mode).',
      'Fase de render (interruptível, pura) e fase de commit (síncrona, aplica DOM).',
    ],
    tip: 'A separação render/commit explica por que effects rodam depois do paint e por que StrictMode invoca effects duas vezes.',
  },
  {
    level: 'Senior',
    q: 'O que são React Server Components? Como o boundary funciona?',
    a: 'RSC executam exclusivamente no servidor — zero JS no cliente. Permitem acesso direto a banco de dados e APIs sem precisar de endpoint intermediário.',
    bullets: [
      '"use client" não significa "só cliente" — marca onde o bundle JS começa.',
      'Server Component pode receber Client Component como children sem poluir bundle.',
      'Composição via prop, não import direto, é o segredo de manter bundle leve.',
      'Entre SC e CC só passam valores serializáveis: strings, números, objetos planos.',
    ],
    tip: 'A pegadinha: "use client" marca onde o bundle JS começa, não onde o código executa. SSR ainda acontece em Client Components.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar useMemo vs useCallback?',
    a: 'useMemo memoiza o resultado de um cálculo. useCallback memoiza uma função (referência estável). Truque: useCallback(fn) é idêntico a useMemo(() => fn).',
    bullets: [
      'useMemo: cálculo caro com deps que mudam raramente.',
      'useCallback: função passada para filho memoizado com React.memo, ou dep de outro hook.',
      'Profile primeiro com React DevTools — memoização sem evidência adiciona overhead.',
    ],
    tip: 'Memoização sem justificativa é pior que nada — adiciona overhead sem ganho. Sempre cite o Profiler como pré-requisito.',
  },
  {
    level: 'Pleno',
    q: 'Como evitar re-renders desnecessários?',
    a: 'Re-renders têm causas distintas e cada uma tem fix próprio. Não otimize sem dados do React DevTools Profiler.',
    bullets: [
      'Props mudando por referência → React.memo + useMemo/useCallback no pai.',
      'Context re-render em massa → split contexts e memoize value.',
      'Estado muito alto → mova para baixo (colocação).',
      'Lista sem key estável → use ids únicos, nunca index em listas dinâmicas.',
    ],
    tip: "Abra dizendo 're-render não é necessariamente ruim — só otimize com evidência do Profiler'. Isso filtra candidatos que memoizam tudo.",
  },
  {
    level: 'Pleno',
    q: 'O que são Error Boundaries e quando usar?',
    a: 'Error Boundaries capturam erros durante a renderização de filhos, exibindo um fallback. Só podem ser class components — hooks ainda não têm equivalente em 2025.',
    bullets: [
      'getDerivedStateFromError atualiza o state quando filho lança erro.',
      'componentDidCatch loga em serviço (Sentry, Datadog).',
      'NÃO capturam: event handlers, código async (Promises), erro no próprio boundary.',
      'react-error-boundary lib oferece API funcional sem precisar escrever class.',
    ],
    tip: 'Mencione que hooks não têm equivalente — Error Boundaries ainda exigem class component em 2025.',
  },
  {
    level: 'Pleno',
    q: 'Explique a prop key e o problema do index como key.',
    a: 'key é o sinal de identidade para React em listas. Index como key funciona apenas em listas estáticas que nunca reordenam.',
    bullets: [
      'Em reordenações, index como key faz React reusar o element do item errado.',
      'Estado interno (input, scroll, animação) fica no elemento errado.',
      'Uso intencional: passar key diferente força remontagem limpa do estado.',
    ],
    tip: 'Citar reordenação + estado interno preso é o exemplo concreto que demonstra entendimento real.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar Context vs Zustand/Redux?',
    a: 'Critério decisivo: frequência de mudança, não complexidade do projeto. Context é ótimo para dado que muda raramente. Zustand/Redux para dado que muda com frequência.',
    bullets: [
      'Context: tema, locale, user autenticado — muda 1x por sessão.',
      'Zustand/Redux: dados de UI dinâmicos, formulários grandes, estado coordenado.',
      'Context tem problema de re-render em massa (todos os consumers).',
      'Selectores de Zustand/Redux dão re-render granular.',
    ],
    tip: "Critério: 'frequência de mudança'. Não 'quando o projeto ficar grande'.",
  },
  {
    level: 'Pleno',
    q: 'Quais são as regras dos hooks e por que existem?',
    a: 'Dois axiomas: (1) chame no top level — nunca em condicionais, loops ou funções aninhadas; (2) chame apenas de componentes React ou custom hooks. As regras existem porque React rastreia hooks pela ORDEM de chamada numa lista ligada interna.',
    bullets: [
      'Um if que pula um hook desloca todos os índices seguintes — state errado mapeia para state errado.',
      'O plugin eslint-plugin-react-hooks enforça as regras automaticamente.',
      'Custom hooks (prefixo "use") podem chamar outros hooks — são a forma de reutilizar lógica.',
    ],
    tip: 'A regra parece arbitrária até você explicar a "lista ligada posicional" internamente. Candidato que explica o mecanismo se destaca.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o useLayoutEffect e quando usar em vez de useEffect?',
    a: 'useLayoutEffect dispara de forma síncrona ANTES do paint do browser — após React mutar o DOM mas antes de os pixels aparecerem. useEffect roda DEPOIS do paint.',
    bullets: [
      'Use useLayoutEffect para ler medidas de layout (getBoundingClientRect) e corrigir sem flash visual.',
      'useLayoutEffect bloqueia a pintura — nunca faça trabalho pesado nele.',
      'Em SSR, useLayoutEffect produz warning — prefira useEffect ou detecte o ambiente.',
    ],
    tip: 'A regra prática: se você vê um flash (flickering), provavelmente precisa de useLayoutEffect. Caso contrário, use sempre useEffect.',
  },
  {
    level: 'Pleno',
    q: 'O que é forwardRef e quando usar?',
    a: 'Por padrão, refs não passam pela boundary de um componente funcional. forwardRef é o mecanismo para um componente filho expor uma ref para o pai.',
    bullets: [
      'Sintaxe: const Input = forwardRef((props, ref) => <input ref={ref} {...props} />).',
      'Use quando você precisa de acesso imperativo ao DOM de um componente filho (foco, scroll, animação).',
      'React 19 remove a necessidade de forwardRef — ref vira uma prop comum.',
    ],
    tip: 'Mencione React 19 eliminando forwardRef para mostrar que você acompanha a evolução da API.',
  },
  {
    level: 'Senior',
    q: 'O que são as novidades do React 19? O que mudou na prática?',
    a: 'React 19 simplificou APIs e introduziu primitivas para server actions. As mudanças mais impactantes na prática cotidiana:',
    bullets: [
      'ref como prop — forwardRef não é mais necessário.',
      'use() hook — lê Promises e Context diretamente em render, sem useEffect.',
      'useOptimistic — atualiza a UI otimisticamente enquanto uma mutation está pendente.',
      'useActionState — gerencia estado + loading de server actions de forma integrada.',
      'Server Actions no cliente via <form action={serverFn}>.',
    ],
    tip: 'React 19 não quebra APIs existentes — é evolutivo. Mostre que sabe distinguir o que mudou de forma breaking vs aditivo.',
  },
  {
    level: 'Senior',
    q: 'Como funciona Suspense para data fetching? O que é a "waterfall" e como evitar?',
    a: 'Suspense captura Promises pendentes lançadas durante o render (throw promise) e exibe um fallback até resolver. Integra com frameworks (Next.js, Remix) e libs (TanStack Query, SWR).',
    bullets: [
      'Waterfall: componente A fetch → resolve → renderiza B → B fetch → resolve. Componentes em série somam latências.',
      'Evitar: inicie fetches em paralelo com Promise.all antes de renderizar, ou use preload patterns.',
      'Next.js App Router usa Suspense + RSC para streaming automático de HTML.',
    ],
    tip: 'Descrever o problema da waterfall com latências somadas (100ms + 200ms = 300ms vs 200ms paralelo) demonstra entendimento de perf real.',
  },
  {
    level: 'Pleno',
    q: 'O que é useRef além de acesso ao DOM?',
    a: 'useRef cria um container mutável ({ current: value }) que persiste entre renders SEM causar re-render quando muda. É o "escape hatch" para valores que precisam ser mutados diretamente.',
    bullets: [
      'Armazenar o ID de um timer (clearInterval) sem causar re-render.',
      'Guardar versão anterior de um valor (prevValue) para comparação.',
      'Guardar referência a uma instância (WebSocket, Player) que não deve re-criar.',
    ],
    tip: 'Candidato que só conhece useRef para DOM access demonstra entendimento parcial. A parte de "valor mutável sem re-render" é o uso mais sutil e avançado.',
  },
  {
    level: 'Senior',
    q: 'Como testar componentes React com React Testing Library? Qual o princípio central?',
    a: 'O princípio do RTL: "quanto mais seus testes se parecem com a forma que o software é usado, mais confiança eles dão." Teste comportamento, não implementação.',
    bullets: [
      'Prefira queries por role (getByRole), label, text — como um usuário/screen reader vê.',
      'Evite: getByTestId (implementação), queryByClassName, acessar estado interno.',
      'user-event simula interação real (clicks, typing) em vez de .simulate() do Enzyme.',
      'Mocking de fetch: MSW (Mock Service Worker) intercepta na rede — mais realista que mock de módulo.',
    ],
    tip: 'A distinção "testar comportamento vs implementação" é o critério principal de quality em perguntas de teste.',
  },
  {
    level: 'Pleno',
    q: 'O que é lifting state up e quando aplicar?',
    a: 'Quando dois componentes irmãos precisam compartilhar estado, você move o estado para o ancestral comum mais próximo. O pai gerencia o estado e passa para os filhos via props.',
    bullets: [
      'Sinal de que precisa: componente A precisa saber algo que aconteceu em componente B.',
      'Risco: prop drilling — estado viaja por muitas camadas. Solução: Context ou colocação de componentes.',
      'Context não substitui lifting state — ele distribui, não gerencia. useState/useReducer ainda gerenciam.',
    ],
    tip: 'Descrever "ancestral comum mais próximo" como critério de onde colocar o estado demonstra domínio do modelo mental.',
  },
  {
    level: 'Senior',
    q: 'Como implementar code splitting e lazy loading em React?',
    a: 'React.lazy() + Suspense é o mecanismo nativo. lazy aceita uma função que retorna uma Promise de um módulo com export default. O bundle fica separado e carrega sob demanda.',
    bullets: [
      'const Chart = lazy(() => import("./Chart")) — Next.js usa dynamic() para o mesmo efeito.',
      'Envolva com <Suspense fallback={<Loader/>}> para mostrar UI enquanto carrega.',
      'Boas fronteiras: rotas, modais, componentes pesados (editores, gráficos, mapas).',
      'Preload manual: importar o módulo em onMouseEnter para pré-carregar antes do clique.',
    ],
    tip: 'Mencionar as fronteiras certas para split (rotas, modais) diferencia de quem só sabe a API mas não sabe quando aplicar.',
  },
  {
    level: 'Senior',
    q: 'O que é o padrão de composição em React? Por que preferir a children prop?',
    a: 'Composição é o mecanismo principal de reuso em React — preferível a herança. Em vez de criar hierarquias de classes, você combina componentes passando filhos e renders como props.',
    bullets: [
      'children prop é o caso mais simples — <Modal><Form/></Modal>.',
      'Render props passa JSX como função — <List render={item => <Card item={item}/>}/>.',
      'Compound components: Tabs.Root + Tabs.List + Tabs.Tab compartilham estado via Context interno.',
      'A vantagem sobre herança: qualquer componente pode ser filho de qualquer outro — sem acoplamento.',
    ],
    tip: 'Descrever os 3 padrões (children, render props, compound) e quando usar cada um demonstra maturidade de design de API.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────────

const HOOKS: HookItem[] = [
  { name: 'useState',             sig: 'const [v, setV] = useState(init)',            desc: 'Memória local com re-render. Use setV(v => v+1) quando depende do anterior.' },
  { name: 'useReducer',           sig: '[s, dispatch] = useReducer(fn, init)',         desc: 'Estado com transições complexas. fn: (state, action) => newState.' },
  { name: 'useEffect',            sig: 'useEffect(fn, deps?) → cleanup?',              desc: 'Após render + paint. Retorne cleanup para limpar listeners e timers.' },
  { name: 'useLayoutEffect',      sig: 'useLayoutEffect(fn, deps?)',                   desc: 'Antes do paint. Para leitura de layout sem flash. Bloqueia pintura.' },
  { name: 'useRef',               sig: 'const r = useRef(val) → r.current',            desc: 'Valor mutável sem re-render. DOM access. Não leia em render.' },
  { name: 'useContext',           sig: 'const v = useContext(MyCtx)',                  desc: 'Lê o Provider mais próximo. Re-renderiza quando value muda.' },
  { name: 'useMemo',              sig: 'useMemo(() => calc, deps)',                    desc: 'Memoiza resultado. Só recalcula quando deps mudam. Profile antes.' },
  { name: 'useCallback',          sig: 'useCallback(() => fn, deps)',                  desc: 'Referência estável para função. Para prop de filho memoizado.' },
  { name: 'useTransition',        sig: '[isPending, start] = useTransition()',         desc: 'Marca update como não-urgente. UI responsiva. (React 18)' },
  { name: 'useDeferredValue',     sig: 'const def = useDeferredValue(val)',            desc: 'Versão atrasada de valor externo. Para valor recebido de fora. (R18)' },
  { name: 'useId',                sig: 'const id = useId()',                           desc: 'Id único e estável entre SSR e cliente. Para acessibilidade. (R18)' },
  { name: 'useSyncExternalStore', sig: 'useSyncExternalStore(sub, get)',               desc: 'Conecta store externa (Zustand, Redux). Concurrent-safe. (R18)' },
]

const HOOKS_R19: HookItem[] = [
  { name: 'use()',          sig: 'const v = use(Promise | Context)',                desc: 'Lê Promise ou Context em qualquer lugar do render — inclusive em condicionais. (R19)' },
  { name: 'useOptimistic',  sig: '[opt, add] = useOptimistic(state, fn)',           desc: 'Estado otimista para mutations. UI atualiza imediatamente, reverte se erro. (R19)' },
  { name: 'useActionState', sig: '[s, action, pending] = useActionState(fn, init)', desc: 'Estado + loading de uma action. Integra com Server Actions e <form>. (R19)' },
  { name: 'useFormStatus',  sig: 'const { pending } = useFormStatus()',             desc: 'Lê status do form pai (pending, data, method). Só funciona dentro de <form>. (R19)' },
]

const DEP_ROWS: DepRow[] = [
  ['[ ]',           'Só no mount — effect roda uma vez no início.'],
  ['[x, y]',        'Quando x ou y mudam — effect re-executa após cada mudança.'],
  ['sem array',      'Todo render — raramente correto, evite (causa loops).'],
  ['função externa', 'Inclua se a função vem do escopo do componente. Use useCallback se for redefinida.'],
]

const HOOK_RULES: RuleItem[] = [
  { ok: true,  t: 'Chame sempre no top level — nunca em condicionais, loops ou funções aninhadas' },
  { ok: true,  t: 'Chame apenas de componentes React ou de outros custom hooks' },
  { ok: true,  t: 'Prefixo "use" é obrigatório para custom hooks — linter enforça automaticamente' },
  { ok: true,  t: 'Estado é uma snapshot — leia o valor da render atual, não o futuro' },
  { ok: false, t: 'Nunca modifique state diretamente — sempre crie novo objeto/array imutável' },
  { ok: false, t: 'Nunca chame um hook condicionalmente — quebra o índice da lista ligada interna' },
]

const PERFORMANCE_TIPS: string[] = [
  'React.memo — evita re-render de filho se props não mudaram por referência (shallow compare).',
  'useMemo + useCallback — estabiliza referências que são deps ou props de filhos memoizados.',
  'Profiler First — só otimize com evidência do React DevTools Profiler em mãos.',
  'Não memoize tudo — overhead de comparação pode superar o ganho em componentes simples.',
  'Colocação — mova estado para o componente mais próximo de quem usa, evita re-render do topo.',
  'Split Context — separe contexts por frequência de mudança para reduzir re-renders em massa.',
  'Virtualização — react-window / react-virtual para listas com mais de 100 itens visíveis.',
]

const PATTERNS: PatternItem[] = [
  { name: 'Custom Hook',        code: 'function useToggle(init=false){ const [v,sV]=useState(init); return [v,()=>sV(!v)] }', desc: 'Extrai lógica reutilizável. Prefixo "use" obrigatório para o linter.' },
  { name: 'Compound Components',code: '<Tabs><Tabs.List><Tabs.Tab/></Tabs.List><Tabs.Panel/></Tabs>',                          desc: 'Múltiplos componentes compartilhando estado via Context interno.' },
  { name: 'Render Props',       code: '<Mouse render={({x,y}) => <Cursor x={x} y={y}/>} />',                                  desc: 'Componente expõe estado, consumidor decide o que renderizar.' },
  { name: 'Controlled Input',   code: '<input value={v} onChange={e=>setV(e.target.value)} />',                                desc: 'Valor é a fonte da verdade. Permite validação e formatação ao digitar.' },
]

const MENTAL_MODELS: string[] = [
  'useCallback(fn) ≡ useMemo(() => fn) — são literalmente equivalentes.',
  'JSX é só sugar — <Foo bar={1}/> compila para createElement(Foo, { bar: 1 }).',
  'children é só uma prop — <Foo>x</Foo> ≡ <Foo children="x" />.',
  'Estado nunca é "atualizado em lugar" — sempre cria nova snapshot na próxima render.',
  'Render é puro — efeitos colaterais vão em useEffect ou event handler.',
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Regras dos Hooks',
    trick: 'TOP · ONLY',
    expansion: [
      ['T', 'Top level sempre — nunca em condicional ou loop'],
      ['O', 'Only from React function — componente ou custom hook'],
    ],
    explanation: 'React rastreia hooks pela ORDEM de chamada em uma lista ligada interna. Um if que pula um hook desloca todos os índices seguintes — o useState do "name" passa a apontar para a entrada do "email", e tudo vira caos.',
    example: 'if (cond) useState(0) // ✗\nuseState(0); if (cond) {...} // ✓',
    why: 'A regra parece arbitrária até você lembrar que hooks são posicionais. Visualizar a "lista ligada" interna torna a regra inevitável.',
  },
  {
    label: 'Quando ocorre re-render',
    trick: 'SPCK',
    expansion: [
      ['S', 'State muda — setState foi chamado com novo valor'],
      ['P', 'Props mudam — pai re-renderizou ou passou nova referência'],
      ['C', 'Context muda — Provider value mudou (todos consumers)'],
      ['K', 'Key muda — desmonta e remonta o componente inteiro'],
    ],
    explanation: 'Esses são os 4 gatilhos. Tudo que parece re-render misterioso na verdade é um deles disfarçado. Imutabilidade importa porque spread cria nova referência (re-render), mutação direta mantém a mesma (sem re-render).',
    example: 'setState(newObj) → re-render\nstate.x = 1; setState(state) → ✗ não re-renderiza',
    why: 'Reduzir um conceito amplo a 4 letras dá ferramenta de diagnóstico. "Esse re-render é S, P, C ou K?"',
  },
  {
    label: 'useMemo vs useCallback',
    trick: 'VALUE vs FUNCTION',
    expansion: [
      ['V', 'useMemo guarda o VALOR — resultado do cálculo'],
      ['F', 'useCallback guarda a FUNÇÃO — referência estável'],
    ],
    explanation: 'Truque chave: useCallback(fn, deps) é literalmente idêntico a useMemo(() => fn, deps). Ambos retornam algo memoizado. A diferença é só semântica — qual a forma do que você está guardando.',
    example: 'useCallback(fn, deps) ≡ useMemo(() => fn, deps)',
    why: 'A distinção parece confusa até você ver a equivalência matemática. Daí cai a ficha de que são o mesmo hook com signatures diferentes.',
  },
  {
    label: 'useEffect vs useLayoutEffect',
    trick: 'DOM → Layout → PAINT → Effect',
    expansion: [
      ['D', 'DOM construído — React aplicou as mutações'],
      ['L', 'Layout calculado — browser computa posições'],
      ['P', 'PAINT — pixels vão para a tela'],
      ['E', 'Effect — useEffect roda DEPOIS do paint'],
    ],
    explanation: 'useLayoutEffect dispara ANTES do paint (entre Layout e Paint). Bloqueia a pintura — use para medir/corrigir layout sem flash visual. useEffect roda DEPOIS — não bloqueia, ideal para fetch, listeners, analytics. Prefira useEffect por padrão.',
    example: 'useLayoutEffect(() => measure()) // antes do paint\nuseEffect(() => fetch(...)) // depois do paint',
    why: 'Memorizar a timeline DLPE substitui a regra confusa de "qual hook usar quando". Você localiza o efeito no fluxo do browser.',
  },
  {
    label: 'Dependency Array',
    trick: 'O QUE ESTE EFFECT LÊ?',
    expansion: [
      ['Q', 'Qualquer state/prop/variável que o effect usa'],
      ['L', 'Linter exhaustive-deps avisa quando você esquece'],
      ['E', 'É um contrato, não um trigger'],
    ],
    explanation: 'O array não é "quando rodar" — é "do que esse effect depende". Se você quer [] mas o effect usa variáveis do componente, provavelmente é stale closure disfarçado. Confie no linter exhaustive-deps.',
    example: 'useEffect(() => { console.log(name) }, []) // ✗ stale\nuseEffect(() => { console.log(name) }, [name]) // ✓',
    why: 'Reformular "quando rodar" para "o que ele lê" remove a confusão. A pergunta certa gera resposta certa automaticamente.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────────

// Aliases de cores para pseudo-highlighting de código
const KW  = '#f87171'   // keywords erradas — red
const KWG = '#4ade80'   // keywords corretas — green
const STR = '#fcd34d'   // strings
const FN  = '#93c5fd'   // funções

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Stale Closure em useEffect',
    badDesc: 'setInterval dentro de useEffect com [] lê sempre o valor inicial — closure capturou count=0 na criação.',
    badCode: [
      { t: 'useEffect', c: KW }, { t: '(() => {\n  ' },
      { t: 'setInterval', c: FN }, { t: '(() => ' },
      { t: 'setCount', c: FN }, { t: '(count + ' }, { t: '1', c: STR }, { t: '), ' }, { t: '1000', c: STR }, { t: ')\n}, [])' },
    ],
    goodDesc: 'Use a forma funcional do setState — recebe o valor mais recente, sem depender da closure.',
    goodCode: [
      { t: 'useEffect', c: KWG }, { t: '(() => {\n  ' },
      { t: 'setInterval', c: FN }, { t: '(() => ' },
      { t: 'setCount', c: FN }, { t: '(c => c + ' }, { t: '1', c: STR }, { t: '), ' }, { t: '1000', c: STR }, { t: ')\n}, [])' },
    ],
    why: 'A função do setInterval foi criada uma vez e capturou count=0. Forma funcional sempre recebe o valor atual do state.',
  },
  {
    title: 'Loop Infinito em useEffect',
    badDesc: 'Função declarada dentro do componente entra como dependência. Nova referência a cada render → effect roda → setState → re-render → loop.',
    badCode: [
      { t: 'function', c: KW }, { t: ' load() { ' }, { t: 'fetch', c: FN }, { t: '(' }, { t: '"/api"', c: STR }, { t: ') }\n' },
      { t: 'useEffect', c: KW }, { t: '(() => { load() }, [load])' },
    ],
    goodDesc: 'Estabilize com useCallback ou mova a definição para dentro do effect.',
    goodCode: [
      { t: 'const', c: KWG }, { t: ' load = ' }, { t: 'useCallback', c: FN }, { t: '(() => { ' }, { t: 'fetch', c: FN }, { t: '(' }, { t: '"/api"', c: STR }, { t: ') }, [])\n' },
      { t: 'useEffect', c: KWG }, { t: '(() => { load() }, [load])' },
    ],
    why: 'Funções recém-criadas têm referência nova a cada render. useCallback congela a referência entre renders.',
  },
  {
    title: 'Key como Index em lista dinâmica',
    badDesc: 'key={index} em lista que reordena ou filtra — React reusa o elemento errado, estado interno (input, foco) fica preso no node trocado.',
    badCode: [
      { t: 'items.' }, { t: 'map', c: FN }, { t: '((item, ' }, { t: 'i', c: KW }, { t: ') => (\n  ' },
      { t: '<Card', c: KW }, { t: ' key={' }, { t: 'i', c: KW }, { t: '} data={item} />\n))' },
    ],
    goodDesc: 'Use id único e estável. Index só é seguro em listas estáticas que nunca reordenam.',
    goodCode: [
      { t: 'items.' }, { t: 'map', c: FN }, { t: '(item => (\n  ' },
      { t: '<Card', c: KWG }, { t: ' key={item.' }, { t: 'id', c: KWG }, { t: '} data={item} />\n))' },
    ],
    why: 'key é identidade. Index muda quando a lista muda — React vê isso como "elemento sumiu" e remonta tudo errado.',
  },
  {
    title: 'Mutação direta de estado',
    badDesc: 'arr.push(item) ou obj.prop = val — referência não muda, React não detecta diferença, re-render não dispara.',
    badCode: [
      { t: 'items.' }, { t: 'push', c: KW }, { t: '(' }, { t: 'newItem', c: STR }, { t: ')\n' },
      { t: 'setItems', c: FN }, { t: '(items)' },
    ],
    goodDesc: 'Sempre crie novo objeto/array. Spread, map, filter — ferramentas imutáveis.',
    goodCode: [
      { t: 'setItems', c: FN }, { t: '([' }, { t: '...items', c: KWG }, { t: ', newItem])' },
    ],
    why: 'React compara state antigo e novo por referência (Object.is). Mesma referência = sem re-render.',
  },
  {
    title: 'Context causando re-renders em massa',
    badDesc: 'Contexto com objeto { user, theme, count } onde count muda a cada segundo — todos os consumers re-renderizam mesmo sem usar count.',
    badCode: [
      { t: '<Ctx.Provider', c: KW }, { t: ' value={{ user, theme, count }}>\n  {children}\n' },
      { t: '</Ctx.Provider>', c: KW },
    ],
    goodDesc: 'Split contexts por frequência de mudança. Memoize o value se objeto.',
    goodCode: [
      { t: '<UserCtx.Provider', c: KWG }, { t: ' value={user}>\n  ' },
      { t: '<ThemeCtx.Provider', c: KWG }, { t: ' value={theme}>\n    {children}\n  ' },
      { t: '</ThemeCtx.Provider>', c: KWG }, { t: '\n' },
      { t: '</UserCtx.Provider>', c: KWG },
    ],
    why: 'Context não tem selectores. Qualquer mudança no value notifica TODOS os consumers — precisa separar por domínio.',
  },
  {
    title: 'useEffect com async retornando Promise',
    badDesc: 'useEffect(async () => {...}) — retorna Promise, mas cleanup deve ser função síncrona ou undefined. React ignora silenciosamente, gera memory leak.',
    badCode: [
      { t: 'useEffect', c: KW }, { t: '(' }, { t: 'async', c: KW }, { t: ' () => {\n  ' },
      { t: 'const', c: KW }, { t: ' data = ' }, { t: 'await', c: KW }, { t: ' ' }, { t: 'fetch', c: FN }, { t: '(...)\n  setData(data)\n}, [])' },
    ],
    goodDesc: 'Declare async dentro e chame imediatamente. Adicione cancelamento via AbortController.',
    goodCode: [
      { t: 'useEffect', c: KWG }, { t: '(() => {\n  ' },
      { t: 'async', c: KWG }, { t: ' ' }, { t: 'function', c: KWG }, { t: ' load() {\n    ' },
      { t: 'const', c: KWG }, { t: ' data = ' }, { t: 'await', c: KWG }, { t: ' ' }, { t: 'fetch', c: FN }, { t: '(...)\n    setData(data)\n  }\n  load()\n}, [])' },
    ],
    why: 'useEffect espera retorno void ou função (cleanup). Promise quebra esse contrato e perde a função de cleanup.',
  },
  {
    title: 'Confundir StrictMode com bug de produção',
    badDesc: 'Effect roda duas vezes em dev (mount → cleanup → mount) — parece bug mas é intencional para detectar effects não-idempotentes.',
    badCode: [
      { t: '// "tem um bug! analytics dispara 2x"\n' },
      { t: '// Decisão: ' }, { t: 'remover StrictMode', c: KW }, { t: '\n// Resultado: bug volta em produção.' },
    ],
    goodDesc: 'Em produção StrictMode não dispara duas vezes. O sintoma revela um cleanup faltando, não um bug do React.',
    goodCode: [
      { t: 'useEffect', c: KWG }, { t: '(() => {\n  ' },
      { t: 'const', c: KWG }, { t: ' s = subscribe()\n  ' },
      { t: 'return', c: KWG }, { t: ' () => s.unsubscribe()  ' }, { t: '// cleanup', c: '#86efac' }, { t: '\n}, [])' },
    ],
    why: 'StrictMode é um teste, não um bug. Ele simula desmontar/remontar para você descobrir effects sem cleanup adequado.',
  },
  {
    title: 'Over-memoização (memoizar tudo)',
    badDesc: 'React.memo + useMemo + useCallback em todos os componentes "por precaução" — adiciona overhead, dificulta leitura, mascara problemas reais.',
    badCode: [
      { t: 'const', c: KW }, { t: ' Btn = ' }, { t: 'memo', c: FN }, { t: '(({ on }) => ' }, { t: '<button', c: KW }, { t: ' onClick={' }, { t: 'useCallback', c: FN }, { t: '(on, [on])} />)' },
    ],
    goodDesc: 'Profile primeiro com React DevTools. Memoize apenas onde há evidência de problema real.',
    goodCode: [
      { t: 'const', c: KWG }, { t: ' Btn = ({ on }) => ' }, { t: '<button', c: KWG }, { t: ' onClick={on} />\n' },
      { t: '// memoize ', c: '#94a3b8' }, { t: 'só', c: '#fcd34d' }, { t: ' se Profiler mostrar problema', c: '#94a3b8' },
    ],
    why: 'Comparação shallow tem custo. Em componentes simples, comparar é mais caro que renderizar de novo.',
  },
]

// ── Dados: Mind Map ───────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  { label: 'BASE',        color: C, items: [
    { t: 'componente (função)', k: true }, { t: 'JSX', k: true }, { t: 'props', k: true },
    { t: 'children', k: true }, { t: 'className/style' }, { t: 'key em listas' },
    { t: 'renderização condicional' }, { t: 'fragments' }, { t: 'portals' },
  ]},
  { label: 'ESTADO',      color: C, items: [
    { t: 'useState', k: true }, { t: 'lifting state', k: true }, { t: 'imutabilidade', k: true },
    { t: 'useReducer' }, { t: 'URL state' }, { t: 'formulários controlados' },
    { t: 'formulários não-controlados', a: true }, { t: 'reducer pattern', a: true },
  ]},
  { label: 'EFEITOS',     color: C, items: [
    { t: 'useEffect', k: true }, { t: 'dependency array', k: true }, { t: 'cleanup', k: true },
    { t: 'AbortController' }, { t: 'race conditions' },
    { t: 'useLayoutEffect', a: true }, { t: 'stale closure', a: true }, { t: 'effect timing', a: true },
  ]},
  { label: 'REFS',        color: C, items: [
    { t: 'useRef', k: true }, { t: 'DOM access' }, { t: 'valor mutável' },
    { t: 'forwardRef', a: true }, { t: 'useImperativeHandle', a: true }, { t: 'callback ref', a: true },
  ]},
  { label: 'DADO GLOBAL', color: C, items: [
    { t: 'Context API', k: true }, { t: 'createContext', k: true }, { t: 'useContext', k: true },
    { t: 'Provider pattern' }, { t: 'split contexts' },
    { t: 'Zustand', a: true }, { t: 'Jotai', a: true }, { t: 'Redux Toolkit', a: true },
  ]},
  { label: 'PERFORMANCE', color: C, items: [
    { t: 'React.memo', k: true }, { t: 'useMemo', k: true }, { t: 'useCallback', k: true },
    { t: 'DevTools Profiler', k: true }, { t: 'colocação de estado' },
    { t: 'virtualização', a: true }, { t: 'bailout', a: true }, { t: 'code splitting', a: true },
  ]},
  { label: 'PATTERNS',    color: C, items: [
    { t: 'Custom Hooks', k: true }, { t: 'composição' }, { t: 'render props' },
    { t: 'compound components', a: true }, { t: 'Error Boundary', a: true }, { t: 'HOC', a: true }, { t: 'controllers/inversion', a: true },
  ]},
  { label: 'CONCURRENT',  color: C, items: [
    { t: 'createRoot', k: true }, { t: 'Suspense', k: true }, { t: 'automatic batching', k: true },
    { t: 'useTransition', a: true }, { t: 'useDeferredValue', a: true }, { t: 'Fiber scheduler', a: true }, { t: 'priorities', a: true },
  ]},
  { label: 'ARQUITETURA', color: C, items: [
    { t: 'Server Components', k: true }, { t: 'Code Splitting', k: true }, { t: 'lazy + Suspense', k: true },
    { t: 'Server Actions', a: true }, { t: 'Streaming SSR', a: true }, { t: 'RSC payload', a: true }, { t: '"use client" boundary', a: true },
  ]},
  { label: 'FORMS',       color: C, items: [
    { t: 'controlados', k: true }, { t: 'validação' }, { t: 'submit + preventDefault' },
    { t: 'react-hook-form', a: true }, { t: 'zod schemas', a: true }, { t: 'useFormStatus (R19)', a: true },
  ]},
  { label: 'ROUTING',     color: C, items: [
    { t: 'react-router', k: true }, { t: 'Next.js App Router', k: true }, { t: 'rotas dinâmicas' },
    { t: 'loaders', a: true }, { t: 'parallel routes', a: true }, { t: 'intercepting routes', a: true },
  ]},
  { label: 'TESTING',     color: C, items: [
    { t: 'Testing Library', k: true }, { t: 'jest / vitest', k: true }, { t: 'render + queries' },
    { t: 'user-event', a: true }, { t: 'MSW', a: true }, { t: 'Playwright Component', a: true },
  ]},
]

const MINDMAP_CHECKLIST: string[] = [
  'Por que key é importante em listas? E o problema do index?',
  'Como funciona o virtual DOM e o algoritmo de diffing?',
  'Diferença entre useState e useReducer — quando usar cada um?',
  'O que é lifting state up e quando aplicar?',
  'Como evitar stale closure em useEffect?',
  'Diferença entre useEffect e useLayoutEffect — timing e bloqueio.',
  'O que cleanup function faz e quando precisa?',
  'Por que mutar state diretamente não causa re-render?',
  'Como o Context API causa re-renders em massa? Como mitigar?',
  'Quando usar useMemo vs useCallback? E qual a equivalência?',
  'O que é React.memo e qual o trade-off?',
  'Como funciona forwardRef? Por que existe?',
  'O que é Concurrent Mode e o que mudou no React 18?',
  'Diferença entre useTransition e useDeferredValue.',
  'O que é Suspense? Como usar com data fetching?',
  'O que são Server Components? Como o boundary funciona?',
  'Diferença entre "use client" e SSR — onde cada um executa?',
  'Como funciona a arquitetura Fiber? Render vs commit.',
  'Quais os principais anti-patterns de re-render?',
  'Quando usar Context vs Zustand/Redux? Critério decisivo.',
]

// ── Registry de Builders ──────────────────────────────────────────────────────────

const PDF_BUILDERS: Record<string, PdfBuilderFn> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'React',
    stackLabel: 'React 18 / 19',
    badgeLabel: 'Q&A Review',
    coverTitle: 'As 20 perguntas mais cobradas em entrevista React',
    coverSubtitle: 'Respostas estruturadas para nível pleno e sênior. Use para revisão ativa: leia a pergunta, tente responder de cabeça, depois confira.',
  }),

  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'React',
    accentColor: C,
    stackLabel: 'React 18 / 19',
    coverTitle: 'Hooks, regras, dependency array, patterns e performance',
    coverSubtitle: 'Referência densa em poucas páginas. Tudo que você precisa checar rapidamente sem abrir documentação.',
    sections: {
      hooks: HOOKS,
      hooksExtra: HOOKS_R19,
      depRows: DEP_ROWS,
      rules: HOOK_RULES,
      performanceTips: PERFORMANCE_TIPS,
      patterns: PATTERNS,
      mentalModels: MENTAL_MODELS,
    },
  }),

  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'React',
    stackLabel: 'React 18 / 19',
    coverTitle: 'Os 5 truques que grudam React na memória',
    coverSubtitle: 'Associações verbais e visuais para regras dos hooks, re-renders, memoização, timeline de paint e dependency array. Repita em voz alta — ancora melhor que ler.',
  }),

  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'React',
    stackLabel: 'React 18 / 19',
    coverTitle: 'Os 8 erros que aparecem em code review de React',
    coverSubtitle: 'Cada anti-pattern com código errado x correto e a explicação técnica de por que quebra. Reconhecimento de padrão é mais rápido que pensar do zero.',
  }),

  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'React',
    stackLabel: 'React 18 / 19',
    coverTitle: 'React do zero ao sênior em uma folha',
    coverSubtitle: '12 categorias do ecossistema React e checklist de 20 perguntas para auto-avaliar o domínio. Use para identificar gaps antes de uma entrevista.',
  }),
}

// ── Main Export ───────────────────────────────────────────────────────────────────

export default function ReactPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)

  const featured = PDF_CARDS.find(c => c.featured)
  const collection = PDF_CARDS.filter(c => !c.featured)

  return (
    <div style={{ fontFamily: "'JetBrains Mono',monospace" }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
          <p style={{ color: FG, fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: 0.3 }}>React — Guias de bolso</p>
          <span style={{ color: C, fontSize: 11, padding: '3px 9px', borderRadius: 999, background: `${C}15`, border: `1px solid ${C}44`, fontWeight: 700 }}>
            5 PDFs · 16 páginas
          </span>
        </div>
        <p style={{ color: FGMUTE, fontSize: 12, margin: 0, lineHeight: 1.65, maxWidth: 720 }}>
          Artefatos de revisão cognitiva para estudo espaçado. Cada PDF é pensado para um objetivo diferente — recuperação ativa, consulta rápida, memória de longo prazo, reconhecimento de padrão e mapeamento mental do ecossistema React inteiro.
        </p>
      </div>

      {/* Seção: Destaque */}
      {featured && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: C, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace" }}>
              Destaque
            </span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C}55, transparent)` }} />
          </div>
          <HeroCard card={featured} onOpen={() => setOpen(featured)} />
        </div>
      )}

      {/* Seção: Coleção */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 10, color: C, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>
            Coleção · {collection.length} PDFs
          </span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C}55, transparent)` }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {collection.map(card => (
            <CollectionCard key={card.id} card={card} onOpen={() => setOpen(card)} />
          ))}
        </div>
      </div>

      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </div>
  )
}
