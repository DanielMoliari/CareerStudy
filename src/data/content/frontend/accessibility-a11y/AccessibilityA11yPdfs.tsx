'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'

// ── Paleta a11y ──────────────────────────────────────────────────────────────
const C   = '#ef4444'
const GRN = '#4ade80'
const AMB = '#f59e0b'
const SKY = '#38bdf8'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 20 perguntas cobrindo WCAG/POUR, HTML semântico, ARIA, focus trap, live regions, landmarks, formulários acessíveis, ícones SVG, contraste, skip links e testes com jest-axe — com respostas para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Contraste, ARIA, semântica e regras numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: requisitos de contraste WCAG AA, roles automáticos de HTML semântico, quando usar cada atributo ARIA, regras de focus e textos alternativos. O que você precisa verificar antes de entregar qualquer feature.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'POUR, LAD, FACE — os truques que grudam',
    type: 'mnemonics',
    pages: 2,
    description: 'POUR para os 4 princípios WCAG. LAD para os atributos ARIA de label (Label, Apontador, Descrição). FACE para o checklist rápido antes de entregar (Foco, Alt, Contraste, Elementos). Associações acionáveis em entrevista.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 4 erros mais comuns — e como corrigir',
    type: 'antipatterns',
    pages: 3,
    description: 'outline:none sem alternativa, onClick em div, placeholder como único label, alt errado em imagens. Com código errado × correto e explicação do impacto real em usuários de tecnologia assistiva.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
]

// ── Q&A ───────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é WCAG e quais são os níveis de conformidade?',
    a: 'WCAG são as diretrizes internacionais de acessibilidade do W3C, organizadas em 4 princípios POUR (Perceptível, Operável, Compreensível, Robusto). Três níveis: A (mínimo), AA (padrão da indústria, exigência legal na maioria dos países), AAA (raramente exigido de forma integral). Objetivo na maioria dos projetos: conformidade AA.',
    bullets: [
      'POUR: os 4 princípios que estruturam todos os critérios.',
      'AA: contraste 4.5:1, legendas, alt text, navegação por teclado.',
      'WCAG 2.1 e 2.2: versões mais recentes, retrocompatíveis com 2.0.',
    ],
    tip: 'Mencionar POUR como estrutura de raciocínio diferencia quem estudou o tema de quem só usou axe.',
  },
  {
    level: 'Pleno',
    q: 'Por que HTML semântico é a primeira linha de acessibilidade?',
    a: 'Elementos HTML nativos têm comportamento de acessibilidade embutido: <button> recebe Tab, Enter/Space, role=button. <input>+<label> conectam automaticamente. <nav> cria landmark de navegação. Usar divs exige reimplementar tudo: ARIA + tabIndex + event listeners — mais código, mais erros silenciosos.',
    bullets: [
      '<button>: Tab, Enter/Space, role=button — grátis.',
      '<nav>: landmark navigation — leitores pulam direto.',
      'div/span: sem semântica — invisíveis para tecnologia assistiva.',
    ],
    tip: "Regra prática: 'use o elemento HTML que descreve o que o elemento é' cobre 80% dos casos.",
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre aria-label, aria-labelledby e aria-describedby?',
    a: 'aria-label: texto direto no atributo, substitui texto visível para o leitor. aria-labelledby: aponta para ID de outro elemento — preferível quando label já existe na tela, mais robusto. aria-describedby: informação adicional anunciada APÓS o label — para erros e dicas, não substitui label.',
    bullets: [
      'aria-label: botão com só ícone, sem texto visível.',
      'aria-labelledby: dialog associado ao título visível — texto real, mais robusto.',
      'aria-describedby: campo com mensagem de erro associada.',
    ],
    tip: 'aria-labelledby prevalece sobre aria-label quando ambos presentes — prefira quando há texto visível.',
  },
  {
    level: 'Senior',
    q: 'O que é focus trap e quando implementar?',
    a: 'Focus trap prende Tab dentro de um elemento. Obrigatório em: modais, drawers, menus complexos. Implementação: ao abrir, foco vai para o primeiro elemento. Tab e Shift+Tab ciclan dentro do container. Esc fecha e restaura foco ao trigger. Radix UI implementa automaticamente.',
    bullets: [
      'Sem focus trap: Tab sai do modal para o conteúdo por baixo — confusão.',
      'Restaurar foco ao trigger ao fechar — nunca perder o rastro de foco.',
      'Radix UI, Headless UI: focus trap built-in — use em vez de reimplementar.',
    ],
    tip: 'Citar Radix UI para focus trap justifica o uso da lib com evidência de a11y real.',
  },
  {
    level: 'Senior',
    q: 'Como testar acessibilidade em um projeto React?',
    a: 'Em 4 camadas: (1) eslint-plugin-jsx-a11y: erros em build time (img sem alt, onClick em div). (2) jest-axe: axe-core analisa o DOM renderizado, reporta violações como assertions. (3) Testing Library: queries por role e label favorecem HTML semântico naturalmente. (4) Inspeção manual: Tab, VoiceOver/NVDA, zoom 200%.',
    bullets: [
      'eslint-plugin-jsx-a11y: bloqueia merges com erros de a11y.',
      'jest-axe: expect(await axe(container)).toHaveNoViolations().',
      'Manual: navegar por Tab é o teste mais revelador.',
    ],
    tip: 'Citar os 4 layers demonstra abordagem sistemática — não apenas axe no DevTools.',
  },
  {
    level: 'Pleno',
    q: 'Como garantir acessibilidade em ícones SVG?',
    a: '4 cenários: (1) Decorativo com texto ao lado: aria-hidden="true" no SVG. (2) Em botão sem texto: aria-label no botão, aria-hidden no SVG. (3) SVG inline informativo: <title> primeiro filho + aria-labelledby. (4) <img src="x.svg">: alt normalmente. Nunca use alt em SVG inline.',
    bullets: [
      'Decorativo: aria-hidden="true" — leitor ignora.',
      'Botão com ícone: aria-label no botão, aria-hidden no SVG.',
      '<title> + aria-labelledby para SVG inline informativo.',
    ],
    tip: 'Aria-hidden no SVG + aria-label no botão é o padrão correto para ícones — demonstra que você sabe onde o atributo pertence.',
  },
  {
    level: 'Senior',
    q: 'O que é o Accessibility Tree e como inspecioná-lo?',
    a: 'O Accessibility Tree é construído pelo browser a partir do HTML. Leitores de tela interagem com ele — não com o DOM visual. Elementos sem semântica (div, span) são invisíveis nessa árvore. ARIA modifica como os nós aparecem. Inspeção: Chrome DevTools → Elements → aba Accessibility.',
    bullets: [
      'Accessibility Tree ≠ DOM visual — leitores navegam no Tree.',
      'div/span: presentes no DOM, inexistentes no Accessibility Tree.',
      'Chrome DevTools: cada nó mostra role, name, properties.',
    ],
    tip: 'Mencionar que leitores de tela navegam no Accessibility Tree, não no DOM, demonstra entendimento do mecanismo.',
  },
  {
    level: 'Senior',
    q: 'Como lidar com conteúdo que atualiza dinamicamente (live regions)?',
    a: 'aria-live="polite" anuncia sem interromper o leitor (aguarda). aria-live="assertive" interrompe imediatamente (alertas críticos). Regra: o elemento com aria-live deve existir no DOM desde o início — não insira dinamicamente. Atualize apenas o texto via state. Em React: useState para o texto do live region.',
    bullets: [
      'polite: status de loading, confirmações não urgentes.',
      'assertive: alertas de erro crítico, expiração de sessão.',
      'Elemento aria-live no DOM desde o início — não insira depois.',
    ],
    tip: 'O detalhe de que o elemento aria-live deve existir no DOM desde o início é o erro mais comum — demonstra quem implementou e não apenas leu sobre.',
  },
  {
    level: 'Pleno',
    q: 'Quais são os landmarks HTML e por que importam?',
    a: 'Landmarks são regiões nomeadas para navegação por atalho. HTML semântico cria automaticamente: <nav> → navigation, <main> → main (máximo 1), <header> → banner, <footer> → contentinfo, <aside> → complementary. Usuários pulam diretamente para <main> ignorando a navegação repetitiva.',
    bullets: [
      'Máximo 1 <main> por página — leitores navegam direto para ele.',
      'Múltiplos <nav>: use aria-label distintos para diferenciá-los.',
      'Skip link para <main>: primeiro elemento da página.',
    ],
    tip: 'Citar o máximo de 1 <main> por página e aria-label em múltiplos <nav> demonstra conhecimento além do básico.',
  },
  {
    level: 'Senior',
    q: 'Como implementar um componente de tabs acessível?',
    a: 'Pattern ARIA Tabs: tablist (container), tab (role=tab, aria-selected, aria-controls), tabpanel (role=tabpanel, aria-labelledby). Teclado: setas ← → navegam entre tabs (roving tabindex — não Tab). Tab entra no painel ativo. Tab inactive: tabIndex=-1. Tab ativa: tabIndex=0.',
    bullets: [
      'Setas para navegar entre tabs — não Tab.',
      'Tab ativa: tabIndex=0. Inativas: tabIndex=-1 (roving tabindex).',
      'Radix UI Tabs implementa tudo isso — use para não reimplementar.',
    ],
    tip: 'Roving tabindex com setas — não Tab — é o detalhe que diferencia a implementação correta.',
  },
  {
    level: 'Pleno',
    q: 'Como escrever alt text de qualidade?',
    a: 'Alt text descreve propósito ou conteúdo informativo — não literalmente a imagem. Conciso (1-2 frases). Não comece com "imagem de" — o leitor já anuncia que é imagem. Imagem decorativa: alt="". Gráficos: descreva a tendência, não os números. Logotipo: nome da empresa.',
    bullets: [
      'Ruim: "três pessoas com laptops numa mesa".',
      'Bom: "equipe de desenvolvimento em reunião de sprint".',
      'Decorativa: alt="" — leitor ignora completamente.',
    ],
    tip: 'Explicar a diferença entre alt="" (decorativa) e alt ausente (erro) demonstra precisão — não são equivalentes.',
  },
  {
    level: 'Senior',
    q: 'Como garantir acessibilidade em formulários complexos?',
    a: 'Todo input tem <label> via htmlFor. Erros: aria-describedby no input apontando para a mensagem. Campos obrigatórios: aria-required="true". Grupos: <fieldset>+<legend>. Após submit inválido: mova foco para o primeiro erro ou resumo dos erros — não deixe o usuário descobrir onde errou.',
    bullets: [
      'Nunca placeholder como único label — desaparece ao digitar.',
      'aria-describedby para erros — anunciado após o label do campo.',
      'Após submit inválido: foco para o primeiro erro.',
    ],
    tip: 'Mover o foco para o erro após submit inválido é o detalhe que separa a11y básica de a11y real.',
  },
  {
    level: 'Pleno',
    q: 'Como o contraste de cor afeta acessibilidade e como medir?',
    a: 'WCAG AA: 4.5:1 para texto normal (<18pt regular, <14pt bold), 3:1 para texto grande, 3:1 para UI (bordas de input, ícones). Medir: Chrome DevTools color picker mostra ratio ao hover. axe DevTools, Colour Contrast Analyser. Teste em modo de alto contraste do Windows.',
    bullets: [
      '4.5:1: a maioria do texto do app.',
      '3:1: text grande, bordas de input, ícones informativos.',
      'Chrome DevTools: hover na cor no inspector já mostra o ratio.',
    ],
    tip: 'Distinguir 4.5:1 (texto normal) de 3:1 (texto grande e UI elements) demonstra que você conhece os limiares exatos do WCAG AA.',
  },
  {
    level: 'Pleno',
    q: 'O que são skip links e como implementar?',
    a: 'Skip links permitem pular navegação repetitiva direto para o conteúdo principal. Primeiro elemento do <body>: <a href="#main-content" className="sr-only focus:not-sr-only">Pular para o conteúdo</a>. Visível apenas quando focado via :focus-visible. Link para <main id="main-content">. Critério WCAG 2.4.1 Nível A.',
    bullets: [
      'Visível apenas quando focado — antes era visualmente oculto.',
      ':focus-visible: aparece ao Tab, oculto ao click.',
      'WCAG 2.4.1: critério de nível A — mínimo absoluto.',
    ],
    tip: 'Citar WCAG 2.4.1 nível A posiciona skip link como requisito mínimo — não feature opcional.',
  },
  {
    level: 'Senior',
    q: 'Como ARIA roles interagem com semântica HTML nativa?',
    a: 'ARIA role sobrescreve a semântica para leitores de tela mas não muda comportamento do browser. <button role="link"> — leitor anuncia como link, mas Enter ativa como botão. <a> com role="button" — anuncia como botão, mas Enter navega. Regra 2 ARIA: não altere semântica nativa sem necessidade.',
    bullets: [
      'ARIA role muda o que o leitor de tela anuncia — não o comportamento.',
      '<a role="button">: anuncia como botão, mas comporta-se como link.',
      'Use o elemento HTML correto — ARIA complementa, não substitui.',
    ],
    tip: 'Separar "o que o leitor anuncia" de "como o browser se comporta" é o ponto que confunde quem não implementou ARIA com testes reais.',
  },
  {
    level: 'Senior',
    q: 'Como implementar um dropdown acessível?',
    a: 'Pattern ARIA Disclosure: botão trigger com aria-expanded, aria-haspopup="menu". Menu: role="menu". Itens: role="menuitem". Teclado: Enter/Space abre, Esc fecha, setas ↑↓ navegam. Ao abrir: foco para o primeiro item. Ao fechar: foco ao trigger. Radix UI DropdownMenu implementa esse padrão.',
    bullets: [
      'aria-expanded: toggle entre true/false ao abrir/fechar.',
      'Esc: fecha e restaura foco ao trigger.',
      'Setas ↑↓ nos itens do menu — não Tab.',
    ],
    tip: 'Mencionar que setas navegam no menu (não Tab) e que Esc restaura foco ao trigger cobre os dois detalhes mais cobrados em entrevista sobre dropdowns.',
  },
  {
    level: 'Pleno',
    q: 'O que é texto visualmente oculto mas acessível (sr-only)?',
    a: 'sr-only oculta visualmente mas mantém no Accessibility Tree: position:absolute; width:1px; height:1px; clip:rect(0,0,0,0); overflow:hidden. Usos: contexto para labels visuais ambíguos, skip links, texto de ícone. NÃO use display:none ou visibility:hidden — removem do Accessibility Tree também.',
    bullets: [
      'sr-only: presente no Accessibility Tree, invisível na tela.',
      'display:none / visibility:hidden: removem do Accessibility Tree.',
      'Tailwind: class "sr-only" implementa o padrão correto.',
    ],
    tip: 'Explicar por que display:none não serve (remove do Accessibility Tree) distingue quem entende o mecanismo de quem só copiou a classe.',
  },
  {
    level: 'Senior',
    q: 'Quais são as 8 piores falhas de acessibilidade em produção?',
    a: '(1) Imagens sem alt. (2) Inputs sem label. (3) outline:none sem alternativa. (4) onClick em div. (5) Contraste insuficiente. (6) Modais sem focus trap. (7) Erros não associados ao campo (aria-describedby). (8) Headings pulando nível (h2→h4). Essas 8 cobrem 90% das violações encontradas em auditorias.',
    bullets: [
      'axe DevTools: detecta 5 das 8 automaticamente.',
      'as 3 restantes (outline, focus trap, heading order) requerem inspeção manual.',
      'Listar essas 8 demonstra que você auditou projetos reais.',
    ],
    tip: 'Listar as 8 piores falhas na entrevista demonstra conhecimento prático — não apenas teórico.',
  },
  {
    level: 'Pleno',
    q: 'Como a11y se relaciona com SEO?',
    a: 'Sobreposição significativa: alt text → crawlers indexam imagens. Headings h1-h6 → estrutura de conteúdo para crawlers. HTML semântico (nav, main, article) → comunica estrutura. Links descritivos → anchor text do SEO. A diferença: SEO foca em bots, a11y em humanos. Boa semântica serve a ambos.',
    bullets: [
      'alt text: a11y + SEO de imagens simultâneos.',
      'Headings hierárquicos: estrutura para leitor E crawler.',
      'Links descritivos: "Ver detalhes do produto X" melhor que "clique aqui".',
    ],
    tip: 'Apontar que boa semântica serve SEO e a11y ao mesmo tempo justifica o investimento para stakeholders focados em negócio.',
  },
  {
    level: 'Senior',
    q: 'Como a LBI e regulações internacionais afetam projetos web?',
    a: 'LBI (Brasil, Lei 13.146/2015): sites públicos seguem eMAG. Empresas privadas têm crescente pressão. ADA (EUA): base para processos em empresas com presença online. EN 301 549 (Europa): conformidade WCAG AA para compras governamentais. WCAG AA é o padrão mínimo defensável juridicamente na maioria dos mercados.',
    bullets: [
      'eMAG: padrão brasileiro para sites governamentais.',
      'ADA: a11y virou argumento em processos nos EUA.',
      'WCAG AA: denominador comum aceito internacionalmente.',
    ],
    tip: 'Citar LBI + ADA + EN 301 549 demonstra visão internacional — relevante para projetos com múltiplos mercados.',
  },
  {
    level: 'Senior',
    q: 'Como usar :focus-visible corretamente em vez de outline:none?',
    a: ':focus-visible aplica estilos apenas quando o browser determina que o foco foi via teclado ou outro dispositivo não-mouse. Permite esconder outline para usuários de mouse (UX melhor) sem quebrar para usuários de teclado. Suporte: todos os browsers modernos. Fallback: :focus para browsers antigos.',
    bullets: [
      ':focus: mouse e teclado — sempre visível (menos elegante mas mais seguro).',
      ':focus-visible: apenas teclado/navegação — preferível quando suportado.',
      'Polyfill: focus-visible npm package para suporte legado.',
    ],
    tip: 'Explicar que :focus-visible separa mouse de teclado (e não apenas "esconde o outline") mostra entendimento do propósito, não só da sintaxe.',
  },
]

// ── Cheatsheet ────────────────────────────────────────────────────────────────

const CS_HOOKS: HookItem[] = [
  { name: 'aria-label="texto"',           sig: 'atributo em elemento interativo',           desc: 'Label direto — use quando não há texto visível (botão com ícone)' },
  { name: 'aria-labelledby="id"',         sig: 'aponta para ID de outro elemento',          desc: 'Preferível quando label visível já existe — texto real, mais robusto' },
  { name: 'aria-describedby="id"',        sig: 'aponta para ID de descrição',               desc: 'Informação extra após o label — erros de formulário, dicas de formato' },
  { name: 'aria-live="polite|assertive"', sig: 'em container de conteúdo dinâmico',         desc: 'Anuncia atualizações dinâmicas — polite: aguarda; assertive: interrompe' },
  { name: 'aria-hidden="true"',           sig: 'em elemento decorativo',                    desc: 'Remove do Accessibility Tree — para ícones decorativos e elementos visuais' },
]

const CS_RULES: RuleItem[] = [
  { ok: true,  t: ':focus-visible — mostra outline só na navegação por teclado' },
  { ok: false, t: 'outline: none sem alternativa — usuário de teclado não sabe onde está' },
  { ok: true,  t: '<button> para ações, <a href> para navegação' },
  { ok: false, t: '<div onClick> — sem foco, sem Enter/Space, sem role' },
  { ok: true,  t: '<label htmlFor> em todo input — nunca placeholder como único label' },
  { ok: false, t: 'Placeholder como único label — desaparece ao digitar' },
  { ok: true,  t: 'alt descritivo em imagens informativas; alt="" em decorativas' },
  { ok: false, t: 'alt ausente — leitor anuncia nome do arquivo. alt vazio em informativa — perde conteúdo' },
  { ok: true,  t: 'Focus trap em modais — Tab cicla dentro, Esc fecha e restaura foco ao trigger' },
  { ok: false, t: 'Modal sem focus trap — Tab sai para o conteúdo por baixo' },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Os 4 princípios WCAG',
    trick: 'POUR',
    expansion: [
      ['P — Perceptível', 'conteúdo deve ser perceptível por todos os sentidos disponíveis'],
      ['O — Operável', 'interface navegável por teclado, tempo suficiente, sem gatilhos de epilepsia'],
      ['U — Understandable (Compreensível)', 'linguagem clara, comportamento previsível, ajuda para erros'],
      ['R — Robusto', 'compatível com tecnologias assistivas presentes e futuras'],
    ],
    explanation: 'POUR é o framework de 4 princípios que estrutura todos os critérios WCAG. Todo problema de acessibilidade se encaixa em um desses princípios. Citar POUR como estrutura de raciocínio demonstra que você entende a11y como sistema — não como lista de regras desconexas.',
    example: 'Contraste insuficiente → P (Perceptível). Sem Tab → O (Operável). Linguagem técnica → U (Compreensível). ARIA mal formado → R (Robusto).',
    why: 'POUR evita que você trate a11y como checklist. Com POUR, você consegue categorizar qualquer problema novo mesmo sem ter memorizado o critério específico — fundamental em code review e entrevistas.',
  },
  {
    label: 'Os atributos ARIA de label',
    trick: 'LAD',
    expansion: [
      ['L — Label (aria-label)', 'texto direto no atributo — use sem texto visível na tela'],
      ['A — Apontador (aria-labelledby)', 'aponta para ID de elemento existente — preferível quando label já está na tela'],
      ['D — Descrição (aria-describedby)', 'informação extra após o label — erros, dicas, instruções adicionais'],
    ],
    explanation: 'LAD mapeia os 3 atributos de label ARIA por função. L é o mais simples mas o menos robusto (duplica texto). A é o mais robusto (usa texto real da tela). D não é label — é descrição adicional anunciada depois. Confundir D com A (usar describedby onde labelledby é correto) é o erro mais comum.',
    example: 'Botão com ícone → L (aria-label). Dialog com título na tela → A (aria-labelledby). Input com mensagem de erro → D (aria-describedby).',
    why: 'Sem LAD é fácil usar aria-label onde aria-labelledby seria mais robusto, ou usar aria-describedby como label substituto. LAD torna a escolha instantânea e correta.',
  },
  {
    label: 'Checklist rápido antes de entregar',
    trick: 'FACE',
    expansion: [
      ['F — Foco visível', ':focus-visible com outline visível, focus trap em modais, ordem de Tab faz sentido'],
      ['A — Alt text', 'informativas têm alt descritivo, decorativas têm alt vazio, sem alt ausente'],
      ['C — Contraste', '4.5:1 para texto normal, 3:1 para texto grande e UI elements'],
      ['E — Elementos semânticos', '<button> para botão, <label> para input, <nav> para navegação, headings em ordem'],
    ],
    explanation: 'FACE é o checklist de 4 pontos para rodar mentalmente antes de qualquer PR que toque UI. F cobre interação por teclado. A cobre não-texto. C cobre percepção visual. E cobre semântica. Juntos cobrem os 4 erros mais críticos e mais comuns em produção.',
    example: 'Novo componente de card clicável: F — tem button? Tab funciona? A — se tem imagem, tem alt? C — texto sobre background passa 4.5:1? E — usa button ou div com onClick?',
    why: 'FACE evita os 4 erros mais comuns sem precisar fazer uma auditoria completa em cada PR. É uma gate de qualidade leve que bloqueia os problemas mais graves antes de chegarem à produção.',
  },
]

// ── Anti-patterns ──────────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'outline:none sem alternativa de foco',
    badDesc: 'Navegação por teclado invisível — usuário não sabe onde está',
    badCode: [
      { t: '/* ❌ Remove foco completamente */', c: '#475569' },
      { t: 'button:focus {' },
      { t: '  outline: none;', c: '#ef4444' },
      { t: '}' },
    ],
    goodDesc: ':focus-visible — oculta para mouse, mantém para teclado',
    goodCode: [
      { t: '/* ✓ Remove para mouse, mantém para teclado */', c: '#475569' },
      { t: 'button:focus { outline: none; }', c: '#4ade80' },
      { t: 'button:focus-visible {', c: '#4ade80' },
      { t: '  outline: 2px solid #3178C6;', c: '#4ade80' },
      { t: '  outline-offset: 2px;', c: '#4ade80' },
      { t: '}', c: '#4ade80' },
    ],
    why: ':focus-visible distingue foco por teclado (outline visível) de foco por clique (sem outline). outline:none sem :focus-visible torna a navegação por teclado invisível — critério WCAG 2.4.7 Level AA.',
  },
  {
    title: 'onClick em div sem acessibilidade',
    badDesc: 'Div clicável sem foco, sem teclado, sem role — invisível para tecnologia assistiva',
    badCode: [
      { t: '{/* ❌ Sem role, sem Tab, sem Enter/Space */}', c: '#475569' },
      { t: '<div', c: '#ef4444' },
      { t: '  onClick={handleClick}', c: '#ef4444' },
      { t: '  className="card clickable"', c: '#475569' },
      { t: '>', c: '#ef4444' },
      { t: '  Clique aqui', c: '#475569' },
      { t: '</div>', c: '#ef4444' },
    ],
    goodDesc: '<button> tem tudo embutido; ou div com role + tabIndex + onKeyDown',
    goodCode: [
      { t: '{/* ✓ Opção 1: use button (recomendado) */}', c: '#475569' },
      { t: '<button type="button" onClick={handleClick}>', c: '#4ade80' },
      { t: '  Clique aqui', c: '#475569' },
      { t: '</button>', c: '#4ade80' },
      { t: '{/* ✓ Opção 2: div customizado com ARIA */}', c: '#475569' },
      { t: '<div role="button" tabIndex={0}', c: '#4ade80' },
      { t: '  onKeyDown={e => e.key === "Enter" && handleClick()}', c: '#4ade80' },
      { t: '  onClick={handleClick}>', c: '#4ade80' },
    ],
    why: '<div> não é focável por Tab, não responde a Enter/Space, não tem role semântico. <button> tem tudo isso embutido sem esforço. Se div for necessário (CSS complexo), adicione role="button", tabIndex=0 e handler de teclado manualmente.',
  },
  {
    title: 'Placeholder como único label de input',
    badDesc: 'Placeholder desaparece ao digitar — usuário não sabe o que preencher',
    badCode: [
      { t: '{/* ❌ Sem label — placeholder some ao digitar */}', c: '#475569' },
      { t: '<input', c: '#ef4444' },
      { t: '  type="email"', c: '#475569' },
      { t: '  placeholder="E-mail"', c: '#ef4444' },
      { t: '/>', c: '#ef4444' },
    ],
    goodDesc: '<label> permanece visível; placeholder como dica complementar',
    goodCode: [
      { t: '{/* ✓ Label visível + placeholder como dica extra */}', c: '#475569' },
      { t: '<label htmlFor="email">E-mail</label>', c: '#4ade80' },
      { t: '<input', c: '#4ade80' },
      { t: '  id="email"', c: '#4ade80' },
      { t: '  type="email"', c: '#475569' },
      { t: '  placeholder="exemplo@email.com"', c: '#475569' },
      { t: '/>', c: '#4ade80' },
    ],
    why: 'Placeholder some ao digitar — usuário com memória curta não sabe o que o campo pede depois. Leitores de tela não garantem anunciar placeholder. WCAG 1.3.5 e 3.3.2: labels visíveis e descritivos são obrigatórios.',
  },
  {
    title: 'alt text ausente ou incorreto',
    badDesc: 'Sem alt: leitor anuncia nome do arquivo. alt vazio em informativa: perde conteúdo',
    badCode: [
      { t: '{/* ❌ Sem alt — leitor lê "grafico-vendas.png" */}', c: '#475569' },
      { t: '<img src="grafico-vendas.png" />', c: '#ef4444' },
      { t: '', c: '#475569' },
      { t: '{/* ❌ alt vazio em imagem com conteúdo */}', c: '#475569' },
      { t: '<img src="grafico.png" alt="" />', c: '#ef4444' },
      { t: '{/* Usuário de leitor perde a informação do gráfico */}', c: '#475569' },
    ],
    goodDesc: 'alt descritivo em informativas; alt="" em decorativas',
    goodCode: [
      { t: '{/* ✓ alt descritivo em imagem informativa */}', c: '#475569' },
      { t: '<img src="grafico-vendas.png"', c: '#4ade80' },
      { t: '  alt="Vendas cresceram 40% em março" />', c: '#4ade80' },
      { t: '', c: '#475569' },
      { t: '{/* ✓ alt vazio em decorativa */}', c: '#475569' },
      { t: '<img src="divider.png" alt="" />', c: '#4ade80' },
    ],
    why: 'WCAG 1.1.1: todo conteúdo não-texto precisa de alternativa. alt="" (presente e vazio) é a forma correta de marcar decorativas. Sem atributo alt, o leitor anuncia o nome do arquivo — ruído sem informação.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Acessibilidade (a11y)',
    stackLabel: 'Frontend / Web Standards',
    coverTitle: 'A11y Q&A Review',
    coverSubtitle: 'WCAG, ARIA, foco e semântica — nível pleno/sênior',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Acessibilidade (a11y)',
    accentColor: C,
    stackLabel: 'Frontend / Web Standards',
    coverTitle: 'A11y CheatSheet',
    coverSubtitle: 'Contraste, ARIA, semântica e regras numa página',
    sections: {
      hooks: CS_HOOKS,
      depRows: [
        ['Texto normal (<18pt)', 'Contraste mínimo 4.5:1 — WCAG AA'],
        ['Texto grande (≥18pt)', 'Contraste mínimo 3:1 — WCAG AA'],
        ['UI elements (bordas, ícones)', 'Contraste mínimo 3:1 — WCAG AA'],
        ['<button>', 'Tab, Enter/Space, role=button — embutido'],
        ['<a href>', 'Tab, Enter navega, role=link — embutido'],
        ['<nav>', 'landmark=navigation — leitores pulam direto'],
        ['<main>', 'landmark=main — máximo 1 por página'],
      ],
      rules: CS_RULES,
      performanceTips: [
        'Rode axe DevTools em cada nova feature antes de fazer PR',
        'eslint-plugin-jsx-a11y: detecta erros em build time sem esforço',
        'Testing Library: getByRole e getByLabelText favorecem semântica naturalmente',
        'Radix UI: focus trap, ARIA patterns e teclado embutidos — use em componentes complexos',
      ],
      patterns: [],
      mentalModels: [
        'Accessibility Tree ≠ DOM visual — leitores de tela navegam no Tree',
        'ARIA complementa HTML semântico — não substitui. Regra 1: use o elemento HTML nativo',
        'POUR: todo problema de a11y se encaixa em Perceptível, Operável, Compreensível ou Robusto',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Acessibilidade (a11y)',
    stackLabel: 'Frontend / Web Standards',
    coverTitle: 'A11y Mnemônicos',
    coverSubtitle: 'POUR, LAD, FACE — os truques que grudam',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Acessibilidade (a11y)',
    stackLabel: 'Frontend / Web Standards',
    coverTitle: 'A11y Anti-patterns',
    coverSubtitle: 'Os 4 erros mais comuns — e como corrigir',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function AccessibilityA11yPdfs() {
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
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
