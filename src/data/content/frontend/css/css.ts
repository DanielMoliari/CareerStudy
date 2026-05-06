import type { SkillContent } from '@/types'

const css: SkillContent = {
  tagline: "A linguagem de estilos da web — cascade, especificidade, box model, flexbox, grid e muito mais.",
  why: "CSS continua sendo a base de toda interface web — frameworks como Tailwind, styled-components e MUI apenas geram CSS por baixo. Sênior precisa saber debugar layout sem o framework no caminho: identificar margin collapsing, stacking context, especificidade quebrada e BFC. Em entrevista, perguntas sobre cascade, position e diferenças entre flex/grid são quase certas. No dia a dia, performance de paint, container queries, logical properties e :has() abrem novos padrões de UI que substituem JavaScript que escrevíamos antes.",
  prerequisite: "HTML semântico básico (tags estruturais, atributos), entendimento de seletores DOM e modelo de árvore de elementos. Familiaridade com unidades (px, em, rem) e cores hex/rgb/hsl ajuda.",
  summary: "CSS aplica regras a elementos via seletores. Quando várias regras competem pelo mesmo elemento, a cascade resolve por origem (user-agent < user < author < !important), depois por especificidade (id > class > tag > universal), depois por ordem de declaração. Cada elemento renderiza dentro de uma caixa com content + padding + border + margin (box model) e ocupa um lugar no fluxo do documento. Layout moderno usa Flexbox (1D — linha ou coluna) e Grid (2D — linhas e colunas simultâneas). O processo de render do browser passa por estilo → layout → paint → composite — propriedades como transform e opacity são compositor-friendly e não disparam reflow. Custom properties (--var) introduzem variáveis dinâmicas no runtime, container queries permitem responder ao tamanho do container ao invés do viewport, e :has() finalmente trouxe um seletor de pai. Em 2025, @layer organiza especificidade explicitamente, evitando guerras de !important.",
  howToStudy: "<strong>Modelo mental central:</strong> CSS é uma <em>função de pontuação</em> — para cada elemento, o browser calcula qual valor cada propriedade recebe ao percorrer todas as regras aplicáveis e escolher a vencedora pela cascade. Box model é a <em>fundação</em>: tudo na tela é uma caixa com content/padding/border/margin. Flexbox e Grid são <em>algoritmos de posicionamento</em>: flex distribui em uma linha (1D), grid distribui numa matriz (2D). Stacking context é uma <em>árvore paralela</em> de profundidade — z-index só compete dentro do mesmo contexto.<br><br><strong>Sequência recomendada:</strong><ol><li>Box model + display + position — saber onde cada caixa fica.</li><li>Cascade + especificidade + herança — entender qual regra ganha.</li><li>Flexbox até dominar (use o jogo Flexbox Froggy).</li><li>Grid até dominar (use Grid Garden e CSS Grid Garden).</li><li>Custom properties + funções (clamp, calc, min/max).</li><li>Pseudo-classes modernas (:is, :where, :has, :not).</li><li>@layer, container queries, logical properties.</li><li>Performance: paint vs composite, will-change, contain.</li></ol>",
  gotchas: [
    "Margin collapsing: margens verticais adjacentes de elementos em fluxo normal colapsam na maior — não acontece em flex/grid containers, em elementos com overflow != visible, ou separados por padding/border/gap.",
    "position: fixed normalmente é relativo ao viewport, mas se um ancestral tiver transform, filter, perspective ou will-change: transform, o contexto muda — o fixed vira relativo a esse ancestral. Bug clássico em modais dentro de cards animados.",
    "z-index só funciona em elementos positioned (não static). Cria stacking context — elementos dentro de um contexto não competem com elementos fora. opacity < 1, transform, filter e isolation: isolate também criam contextos.",
    "Especificidade calcula em três pilhas: inline (1000) > id (100) > class/attr/pseudo-class (10) > tag/pseudo-element (1). !important sobrescreve tudo — evite, prefira aumentar especificidade ou usar @layer.",
    "!important cria dívida de manutenção. Use @layer para definir ordem explícita de origem ao invés de uma guerra de !important. @layer reset, base, components, utilities — depois disso, especificidade dentro de cada layer é resolvida normalmente.",
    "display: contents remove o elemento da árvore de layout mas mantém os filhos visíveis. Útil para wrapper semântico que não deve criar caixa. Cuidado: alguns elementos quebram acessibilidade.",
    "Logical properties (margin-inline, padding-block, inset) substituem físicas (margin-left, padding-top, top/left). Em layouts com direção variável (RTL, vertical), as logicais se adaptam automaticamente — o futuro do CSS.",
    "gap não interage com margin collapsing — sempre cria separação consistente. Por isso é melhor que margin em flex/grid containers para espaçamento entre filhos.",
    "Pseudo-classes :is() e :where() agrupam seletores; a diferença é a especificidade: :is(a, b) usa a maior especificidade do grupo, :where(a, b) tem especificidade zero — perfeito para resets sem aumentar especificidade.",
    "Container queries (@container) respondem ao container, não ao viewport — mas o pai precisa declarar container-type: inline-size primeiro, e o componente fica isolado de transform e position: fixed.",
    "Em CSS, herança não é universal: color, font-*, line-height e text-* herdam por padrão; layout/display/border/margin/padding/background NÃO herdam. Use 'inherit' explicitamente quando precisar.",
  ],
  interview: [
    {
      level: 'pleno',
      q: 'Explique o box model e a diferença entre content-box e border-box.',
      a: '<p>O <strong>box model</strong> define que toda caixa tem 4 áreas concêntricas: <code>content</code> (texto/imagem), <code>padding</code> (espaço interno), <code>border</code> (linha) e <code>margin</code> (espaço externo). A propriedade <strong>box-sizing</strong> controla como <code>width</code> e <code>height</code> são interpretados.</p><ul><li><code>content-box</code> (padrão): width = só o conteúdo. Adicionar padding ou border AUMENTA o tamanho total.</li><li><code>border-box</code>: width = conteúdo + padding + border. Adicionar padding ENCOLHE o conteúdo, mantém o tamanho total.</li></ul><p>Praticamente todo projeto moderno aplica <code>* { box-sizing: border-box }</code> no reset porque é mais previsível para layout.</p><ul><li>content-box é histórico, não é intuitivo para layout previsível.</li><li>border-box facilita usar width: 100% sem se preocupar com padding/border estourando.</li><li>margin nunca entra no cálculo do box-sizing — é sempre externo.</li></ul>',
      tip: 'Sempre mencione que profissional usa border-box global no reset. Mostre que sabe a história — é a "correção" que CSS deveria ter feito desde o início.',
    },
    {
      level: 'pleno',
      q: 'Como funciona a cascade e em que ordem as regras CSS são aplicadas?',
      a: '<p>A <strong>cascade</strong> é o algoritmo que decide qual regra ganha quando várias se aplicam ao mesmo elemento. A ordem (em CSS Cascade Level 5) é:</p><ol><li><strong>Origem e importância:</strong> User-Agent → User → Author → Author !important → User !important → User-Agent !important.</li><li><strong>Layers (@layer):</strong> ordem de declaração das camadas. Layers depois ganham; sem layer fica acima de qualquer layer.</li><li><strong>Especificidade:</strong> inline > id > class/attr/pseudo-class > tag.</li><li><strong>Ordem de declaração:</strong> a última regra escrita ganha quando tudo o mais é igual.</li></ol><p>Importante: dentro de !important, a ordem das origens INVERTE — user !important ganha de author !important.</p><ul><li>@layer permite organizar especificidade explicitamente, sem !important.</li><li>Estilos inline (style="...") têm especificidade 1000 mas ainda perdem para !important.</li><li>Ordem das declarações importa quando o resto empata.</li></ul>',
      tip: 'Mencione @layer como evolução moderna que substitui guerras de !important — é o sinal de quem acompanha CSS atual.',
    },
    {
      level: 'pleno',
      q: 'O que é especificidade e como calcular?',
      a: '<p><strong>Especificidade</strong> é um número de 4 dígitos que o browser calcula para cada seletor para resolver conflitos. As pilhas (da mais para a menos pesada):</p><ul><li><strong>Inline style</strong> (1,0,0,0): atributo <code>style="..."</code></li><li><strong>IDs</strong> (0,1,0,0): <code>#header</code></li><li><strong>Classes, attrs, pseudo-classes</strong> (0,0,1,0): <code>.btn</code>, <code>[type="text"]</code>, <code>:hover</code></li><li><strong>Tags e pseudo-elementos</strong> (0,0,0,1): <code>div</code>, <code>::before</code></li></ul><p>Soma cada categoria, NÃO use base 10 — (0,0,2,0) ganha de (0,0,1,99). <code>!important</code> sai da contagem e vence sempre. <code>:not()</code>, <code>:is()</code> usam a maior especificidade dos argumentos. <code>:where()</code> tem especificidade ZERO.</p><ul><li>#a .b .c → (0,1,2,0). div div div → (0,0,0,3). #a ganha sempre.</li><li>:where(...) é perfeito para resets que não devem competir.</li><li>Universal (*), combinadores (>, +, ~) não somam especificidade.</li></ul>',
      tip: 'Faça o cálculo passo a passo num exemplo durante a entrevista — mostra que entende o algoritmo, não só decorou.',
    },
    {
      level: 'pleno',
      q: 'Quando usar Flexbox e quando usar Grid?',
      a: '<p>A heurística: <strong>Flex para 1 dimensão, Grid para 2</strong>.</p><ul><li><strong>Flexbox</strong> distribui filhos em UMA direção (linha OU coluna). Bom para: navbars, listas de itens com altura/largura variável, alinhamento de conteúdo dentro de um componente, ordem dinâmica (flex-direction: row-reverse).</li><li><strong>Grid</strong> distribui em LINHAS E COLUNAS simultaneamente. Bom para: layouts de página inteira, dashboards, áreas nomeadas (grid-template-areas), overlapping intencional, listas que precisam alinhar entre si verticalmente E horizontalmente.</li></ul><p>Não é exclusivo: combinar é normal. Grid no layout macro, flex em cada célula. <strong>Gap</strong> funciona em ambos desde 2021.</p><ul><li>Grid pode sobrepor itens em células com grid-column/row + z-index — ótimo para banners.</li><li>Flex tem alinhamento dinâmico em um eixo; Grid tem em ambos com place-items.</li><li>subgrid permite que filhos compartilhem o mesmo grid do avô — útil em cards uniformes.</li></ul>',
      tip: 'Diga "1D vs 2D" como atalho. Depois exemplifique: navbar = flex, dashboard = grid. Mencione subgrid como recurso moderno que mata casos antes complicados.',
    },
    {
      level: 'senior',
      q: 'O que é stacking context e como é criado?',
      a: '<p><strong>Stacking context</strong> é uma árvore paralela à árvore DOM, onde cada nó representa um grupo de elementos que se empilham juntos. Dentro de um contexto, <code>z-index</code> compete entre os filhos. Entre contextos, o filho com maior z-index do contexto pai ganha — não importa se um filho interno tem z-index gigante.</p><p>É criado por:</p><ul><li><code>position</code> diferente de static + <code>z-index</code> diferente de auto.</li><li><code>opacity</code> menor que 1.</li><li><code>transform</code>, <code>filter</code>, <code>perspective</code>, <code>backdrop-filter</code> diferentes de none.</li><li><code>isolation: isolate</code> (criado especificamente para isso, sem efeito visual).</li><li><code>position: fixed</code> ou <code>sticky</code>.</li><li>Filho de flex/grid container com <code>z-index</code> definido.</li><li>Elemento com <code>will-change</code> em uma das propriedades acima.</li></ul>',
      tip: 'Cite "isolation: isolate" — mostra que conhece a propriedade criada justamente para resolver bugs de stacking sem hack.',
    },
    {
      level: 'pleno',
      q: 'Como funciona position: sticky e quais são os gotchas?',
      a: '<p><strong>position: sticky</strong> é um híbrido entre <code>relative</code> e <code>fixed</code>. O elemento age como relative até cruzar o threshold (definido por top/right/bottom/left), e então fica fixed nesse offset, mas SOMENTE dentro do bloco pai mais próximo.</p><ul><li>Você precisa especificar pelo menos um <code>top/right/bottom/left</code>, senão não "gruda".</li><li>O pai DEVE ter altura suficiente para que o sticky tenha espaço para "rolar dentro". Se o pai tiver a mesma altura que o sticky, ele nunca sai do início.</li><li>Bug clássico: <code>overflow: hidden</code> ou <code>overflow: auto</code> em algum ancestral mata o sticky — o sticky escuta o scroll do ancestral mais próximo com overflow.</li><li>Em flex/grid containers, o filho deve ter <code>align-self: start</code> (em vez de stretch padrão) para o sticky funcionar.</li></ul><ul><li>sticky precisa de offset definido (top: 0, etc) — sem isso é equivalente a relative.</li><li>overflow no ancestral quebra sticky silenciosamente — debug clássico.</li><li>Funciona dentro do bloco contêiner, não rola para fora dele.</li></ul>',
      tip: 'Mencione o gotcha do overflow:hidden/auto no ancestral — é o bug mais comum, e demonstra experiência real com sticky em produção.',
    },
    {
      level: 'pleno',
      q: 'O que é margin collapsing e em que situações NÃO acontece?',
      a: '<p><strong>Margin collapsing</strong> é o comportamento em que margens VERTICAIS adjacentes (top/bottom) se combinam, usando o maior valor em vez de somar. Acontece em três cenários:</p><ol><li><strong>Irmãos adjacentes:</strong> <code>margin-bottom</code> de um + <code>margin-top</code> do seguinte → ganha o maior.</li><li><strong>Pai e primeiro/último filho:</strong> sem padding/border separando, a margem do filho "vaza" para o pai.</li><li><strong>Bloco vazio:</strong> margin-top e margin-bottom dele mesmo colapsam entre si.</li></ol><p>NÃO acontece quando:</p><ul><li>O container é flex ou grid (filhos não colapsam).</li><li>O elemento ou o pai está dentro de um <strong>BFC</strong> (Block Formatting Context).</li><li>Existe padding, border ou conteúdo entre as margens.</li><li>Margens horizontais (left/right) — nunca colapsam.</li><li>Em <code>position: absolute</code> ou <code>fixed</code>.</li></ul><ul><li>Para evitar: prefira gap em flex/grid, ou padding em vez de margin no container.</li><li>Criar BFC isola: overflow: auto, display: flow-root, contain: layout.</li><li>Margens negativas também colapsam — pode ser usado intencionalmente.</li></ul>',
      tip: 'Mencione "display: flow-root" como solução moderna para criar BFC sem efeitos colaterais (overflow: auto às vezes adiciona scrollbar).',
    },
    {
      level: 'senior',
      q: 'Como funciona a propriedade contain e para que serve?',
      a: '<p><strong>contain</strong> diz ao browser que um elemento é independente do resto da página, permitindo otimizações de render. Possíveis valores:</p><ul><li><code>contain: layout</code> — mudanças internas não afetam layout externo.</li><li><code>contain: paint</code> — pintura é limitada à caixa (overflow: hidden implícito) e cria stacking context.</li><li><code>contain: size</code> — tamanho não depende dos filhos (precisa de width/height explícito).</li><li><code>contain: style</code> — estilos contados (counter-increment) ficam isolados.</li><li><code>contain: content</code> = layout + paint + style.</li><li><code>contain: strict</code> = tudo + size.</li></ul><p>Útil para listas grandes, virtual scrolling, dashboards. Permite que o browser pule cálculos de layout de elementos fora do viewport. Também é base para <code>content-visibility: auto</code>, que pula render de elementos não visíveis.</p><ul><li>content-visibility: auto + contain-intrinsic-size = lazy render para listas longas.</li><li>contain: layout é o mais seguro de aplicar, baixo custo cognitivo.</li><li>contain: paint cria stacking context — cuidado com z-index.</li></ul>',
      tip: 'Mostre que conhece content-visibility: auto como técnica moderna de performance — ainda pouco usada, evidencia profundidade.',
    },
    {
      level: 'pleno',
      q: 'O que são CSS Custom Properties e como diferem de variáveis Sass?',
      a: '<p><strong>Custom Properties</strong> (também chamadas de CSS variables) são variáveis nativas do CSS, declaradas com <code>--nome</code> e lidas com <code>var(--nome)</code>. Diferem de variáveis Sass em três pontos críticos:</p><ul><li><strong>Runtime vs Compile-time:</strong> custom properties existem no DOM e podem ser alteradas via JavaScript ou pseudo-classes (:hover, :focus). Variáveis Sass somem após compilação.</li><li><strong>Cascata e herança:</strong> custom properties seguem a cascade — você pode redefinir <code>--bg</code> em um filho e ele herda apenas naquele subárvore.</li><li><strong>Escopo dinâmico:</strong> <code>:root { --c: red }</code> aplica a tudo; <code>.dark { --c: blue }</code> sobrescreve dentro de <code>.dark</code>.</li></ul><p>Use Sass quando a variável é constante de design system (color tokens). Use CSS variables quando precisa mudar em runtime: tema, breakpoints dinâmicos, animações, propriedades por componente.</p><ul><li>@property permite tipar custom properties: <code>@property --x { syntax: "&lt;color&gt;" }</code> habilita animação.</li><li>document.documentElement.style.setProperty(\'--bg\', \'red\') muda runtime.</li><li>Variáveis vazias usam o segundo argumento de var(): <code>var(--x, defaultValue)</code>.</li></ul>',
      tip: 'Cite @property como evolução moderna que permite animar tipos não-numéricos (cores, ângulos) — sinal de quem acompanha CSS Houdini.',
    },
    {
      level: 'senior',
      q: 'Como usar @layer para organizar especificidade?',
      a: '<p><strong>@layer</strong> declara ordem explícita entre grupos de regras, separando especificidade de origem. A regra: regras em layers DEPOIS ganham, INDEPENDENTE de especificidade dentro delas. Estilos sem layer ficam ACIMA de qualquer layer.</p><pre><code>@layer reset, base, components, utilities;\n\n@layer reset {\n  * { margin: 0; padding: 0; }\n}\n@layer components {\n  .btn { background: blue; }\n}\n@layer utilities {\n  .bg-red { background: red !important; } /* ganha */\n}</code></pre><p>Estratégia comum em design systems:</p><ol><li><code>reset</code> — normalize/reset</li><li><code>tokens</code> — variáveis de design</li><li><code>base</code> — estilos de elementos (h1, p, a)</li><li><code>components</code> — componentes reutilizáveis (.card, .btn)</li><li><code>utilities</code> — utilitários (Tailwind-style: .mt-4, .flex)</li><li>Sem layer — estilos do projeto que devem ganhar de tudo</li></ol><ul><li>Layers permitem importar bibliotecas third-party num layer baixo (@import url(lib.css) layer(vendor)).</li><li>!important dentro de um layer também segue ordem inversa: layer mais antigo com !important ganha.</li><li>É o substituto moderno de "namespace + !important" e do BEM excessivamente longo.</li></ul>',
      tip: 'Mencione importar bibliotecas em um layer (vendor) — você nunca mais sofre de "biblioteca está sobrescrevendo meus estilos".',
    },
    {
      level: 'senior',
      q: 'Como funciona o algoritmo de auto-placement do Grid?',
      a: '<p>O Grid define explicitamente colunas/linhas com <code>grid-template-columns/rows</code>. Itens sem posição explícita são colocados pelo <strong>auto-placement</strong>, que segue:</p><ol><li><strong>Modo de fluxo</strong> (<code>grid-auto-flow</code>): row (padrão), column ou dense.</li><li><strong>Modo dense:</strong> volta atrás para preencher buracos deixados por itens com span.</li><li><strong>Tracks implícitos:</strong> quando um item é colocado fora do grid declarado, novas linhas/colunas são geradas com tamanho de <code>grid-auto-rows/columns</code>.</li><li><strong>Itens nomeados</strong> (com grid-area) saem do auto-placement e vão direto para a posição declarada.</li></ol><p>Auto-placement preenche row-first por padrão, da esquerda para a direita, de cima para baixo. <code>dense</code> permite reordenação visual mas perde a ordem original — pode atrapalhar acessibilidade (tab order). <code>masonry</code> (em CSS Grid Level 3) é uma variante que empilha em colunas com altura variável.</p><ul><li>grid-auto-flow: dense reordena para evitar buracos — cuidado com leitor de tela.</li><li>minmax(min, max) define tracks responsivos: minmax(0, 1fr) é o "fr seguro".</li><li>auto-fit colapsa colunas vazias; auto-fill mantém colunas vazias (ideal para grid responsivo com gap).</li></ul>',
      tip: 'Cite o "fr seguro" minmax(0, 1fr) — resolve o bug clássico de itens com texto longo estourando coluna em layouts com 1fr puro.',
    },
    {
      level: 'pleno',
      q: 'Como funciona aspect-ratio e quando usar?',
      a: '<p><strong>aspect-ratio</strong> declara a proporção entre largura e altura, fazendo o browser calcular automaticamente a dimensão ausente. Sintaxe: <code>aspect-ratio: 16 / 9</code> ou <code>aspect-ratio: 1.5</code>.</p><pre><code>.video { width: 100%; aspect-ratio: 16 / 9; }\n.avatar { width: 48px; aspect-ratio: 1; /* quadrado */ }\n.card { aspect-ratio: 4 / 5; }</code></pre><p>Substitui o famoso "padding-bottom hack" (<code>padding-bottom: 56.25%</code>) que usávamos antes do CSS 2021.</p><ul><li>Se largura E altura são definidos, aspect-ratio é IGNORADA.</li><li>Funciona em qualquer caixa, inclusive com display: grid/flex.</li><li>Combina com object-fit (cover, contain) para imagens preservarem proporção dentro da caixa.</li></ul><ul><li>aspect-ratio: 1 → quadrado, ideal para avatares e ícones.</li><li>Útil para CLS (Cumulative Layout Shift): reserva espaço antes da imagem carregar.</li><li>É o substituto moderno do hack de padding-bottom percentual.</li></ul>',
      tip: 'Conecte aspect-ratio com Web Vitals (CLS) — mostra que entende o impacto em performance, não só estilo.',
    },
    {
      level: 'senior',
      q: 'O que é subgrid e quando usar?',
      a: '<p><strong>subgrid</strong> permite que um filho de um grid herde as linhas e/ou colunas do avô, ao invés de criar seu próprio sistema de tracks. Sintaxe: <code>grid-template-columns: subgrid</code>.</p><p>Caso clássico: cards com header, body e footer que precisam alinhar EM TODOS OS CARDS de uma linha, mesmo que o conteúdo varie.</p><pre><code>.list { display: grid; grid-template-rows: auto 1fr auto; gap: 1rem; }\n.card {\n  display: grid;\n  grid-row: span 3;\n  grid-template-rows: subgrid;\n}\n/* agora header/body/footer alinham entre cards */</code></pre><p>Sem subgrid, cada card teria sua altura própria e os elementos internos não alinhariam horizontalmente entre cards. Antes do subgrid, exigia JavaScript ou hacks de altura fixa.</p><ul><li>subgrid em rows + columns: <code>grid-template: subgrid / subgrid</code>.</li><li>Suporte: Firefox desde 2019, Safari 16+, Chrome 117+ — produção em 2024+.</li><li>Resolve casos antes impossíveis com flex/grid puro.</li></ul>',
      tip: 'Cite o caso de cards alinhando entre si — é o "sapo na garganta" que todo dev de produção sentiu antes do subgrid.',
    },
    {
      level: 'pleno',
      q: 'Como funciona a herança no CSS? Quais propriedades herdam por padrão?',
      a: '<p><strong>Herança</strong> em CSS faz alguns valores de propriedade fluírem do pai para os filhos automaticamente, eliminando a necessidade de redefinir em cada elemento.</p><p>Propriedades que <strong>HERDAM</strong> por padrão:</p><ul><li>Tipográficas: <code>font-family</code>, <code>font-size</code>, <code>font-weight</code>, <code>font-style</code>, <code>line-height</code>, <code>letter-spacing</code>, <code>word-spacing</code>, <code>text-align</code>, <code>text-transform</code>, <code>text-indent</code>, <code>color</code>.</li><li>Visibilidade: <code>visibility</code>, <code>cursor</code>.</li><li>Listas: <code>list-style</code>, <code>list-style-type</code>.</li></ul><p>Propriedades que <strong>NÃO HERDAM</strong> (a maioria):</p><ul><li>Layout: <code>display</code>, <code>position</code>, <code>width</code>, <code>height</code>, <code>top</code>, etc.</li><li>Box: <code>margin</code>, <code>padding</code>, <code>border</code>, <code>background</code>.</li><li>Transformações: <code>transform</code>, <code>filter</code>, <code>opacity</code>.</li></ul><p>Use <code>inherit</code>, <code>initial</code> ou <code>unset</code> explicitamente quando precisar forçar comportamento. CSS variables herdam por padrão (são consideradas tipográficas).</p><ul><li>all: unset zera tudo — útil para resetar um elemento por completo.</li><li>inherit força herdar de qualquer propriedade que não herda por padrão.</li><li>Custom properties (--var) sempre herdam — base da estratégia de tema.</li></ul>',
      tip: 'Saiba a regra: tipografia herda, layout não. Mostra entendimento da filosofia do CSS — facilita lembrar caso a caso.',
    },
    {
      level: 'senior',
      q: 'O que é um Block Formatting Context (BFC) e como criá-lo?',
      a: '<p>Um <strong>BFC</strong> é uma região de layout independente onde elementos block participam de regras isoladas: margens não colapsam para fora, floats são contidos, e elementos block ficam empilhados sem influência externa.</p><p>BFC é criado automaticamente por:</p><ul><li>Raiz do documento (html).</li><li><code>float</code> diferente de none.</li><li><code>position: absolute</code> ou <code>fixed</code>.</li><li><code>display: inline-block</code>, <code>flex</code>, <code>grid</code>, <code>flow-root</code>, <code>table-cell</code>.</li><li><code>overflow</code> diferente de visible (auto, hidden, scroll).</li><li><code>contain: layout</code>, <code>content</code>, ou <code>strict</code>.</li><li><code>column-count</code> ou <code>column-width</code> diferente de auto.</li></ul><p><strong>display: flow-root</strong> foi criado para isso: cria um BFC sem efeitos colaterais (diferente de overflow, que pode adicionar scrollbars).</p><p>Casos típicos:</p><ol><li>Conter um float (clearfix moderno = <code>display: flow-root</code>).</li><li>Evitar margin collapsing entre pai e filho.</li><li>Permitir um elemento ficar lado a lado de um float (margin-left).</li></ol><ul><li>flow-root é o "clearfix moderno" — substitui o ::after { clear: both }.</li><li>BFC não vaza margens nem flutuação para fora.</li><li>flex e grid containers também são BFC para os filhos.</li></ul>',
      tip: 'Mencione display: flow-root explicitamente — substitui o clearfix antigo e demonstra conhecimento moderno.',
    },
    {
      level: 'pleno',
      q: 'Como funcionam clip-path e mask?',
      a: '<p>Ambos recortam elementos visualmente, mas com modelos diferentes:</p><ul><li><strong>clip-path</strong>: define uma forma geométrica (circle, polygon, path) onde o elemento é visível. Fora da forma é totalmente transparente. <code>clip-path: circle(50% at center)</code>.</li><li><strong>mask-image</strong>: usa uma imagem ou gradiente como máscara — o canal alfa (ou luminância) controla a opacidade pixel a pixel. Mais flexível, suporta degradê.</li></ul><p>Diferenças práticas:</p><ul><li>clip-path é binário (0 ou 100% visível); mask suporta valores intermediários (fade out).</li><li>clip-path tem melhor performance pois é compositor-friendly.</li><li>mask precisa de <code>-webkit-mask</code> em Safari antigo (ainda relevante em produção).</li></ul><p>Use clip-path para formas geométricas (avatares circulares, hero shapes diagonais). Use mask para fades, padrões e overlays graduais.</p><ul><li>clip-path: path() permite usar SVG path — formas arbitrárias.</li><li>mask-image: linear-gradient() cria fade out elegante (texto que apaga).</li><li>Animar clip-path é compositor-friendly e rápido.</li></ul>',
      tip: 'Mostre que sabe quando usar cada um — clip para "recortar com tesoura", mask para "passar tinta com transparência variável".',
    },
    {
      level: 'senior',
      q: 'O que é will-change e quando usar?',
      a: '<p><strong>will-change</strong> avisa o browser que uma propriedade vai mudar, permitindo que ele otimize antecipadamente — geralmente promovendo o elemento para sua própria camada de composição (GPU).</p><pre><code>.modal { will-change: transform, opacity; }</code></pre><p><strong>Quando usar:</strong></p><ul><li>Elementos que serão animados (transform, opacity) — antes da animação começar.</li><li>Aplicar dinamicamente: <code>el.style.willChange = "transform"</code> antes da animação, remover ao terminar.</li></ul><p><strong>Quando NÃO usar:</strong></p><ul><li>Em todos os elementos por precaução — cada camada consome memória GPU.</li><li>Em elementos estáticos.</li><li>Aplicar permanentemente em CSS sem necessidade.</li></ul><p>Cria stacking context. Em excesso, pode degradar performance ao invés de melhorar (memory thrashing). Como diz a docs: "use as a last resort".</p><ul><li>transform e opacity são compositor-friendly — geralmente não precisam de will-change.</li><li>Aplicar via JS antes da animação e remover ao terminar é a estratégia ótima.</li><li>Cria camada GPU — caro em mobile com muitos elementos.</li></ul>',
      tip: 'Diga "will-change não é mágica — é uma dica que pode ferir performance se abusada". Profissional sabe medir antes de aplicar.',
    },
    {
      level: 'pleno',
      q: 'Como funcionam pseudo-elementos ::before e ::after?',
      a: '<p><strong>::before</strong> e <strong>::after</strong> inserem conteúdo gerado antes e depois do conteúdo do elemento, respectivamente. Não são parte do DOM (não acessíveis via JavaScript), mas existem para o browser.</p><pre><code>.btn::before {\n  content: "→ ";  /* obrigatório, mesmo que vazio: content: "" */\n  color: red;\n}\n.tooltip::after {\n  content: attr(data-tip);  /* lê atributo do elemento */\n}</code></pre><p>Usos comuns:</p><ul><li>Ícones via <code>content</code> sem poluir HTML.</li><li>Aspas tipográficas, hífens decorativos.</li><li>Tooltips com data-attribute (<code>content: attr(...)</code>).</li><li>Overlays e máscaras (com <code>position: absolute</code>).</li><li>Clearfix antigo (substituído por <code>display: flow-root</code>).</li></ul><p>Limitações:</p><ul><li>Só em elementos que aceitam filhos (não em <img>, <input>, <br>).</li><li>Não capturáveis em screenshots/print de alguns browsers.</li><li>Acessibilidade: leitores de tela podem ou não ler — não confie para conteúdo essencial.</li></ul><ul><li>content: "" é obrigatório, mesmo vazio — sem isso, o pseudo não renderiza.</li><li>::before não é acessado pelo JavaScript — só CSS.</li><li>attr() permite ler data-attributes para textos dinâmicos.</li></ul>',
      tip: 'Mencione attr() para tooltips simples — exemplo concreto de uso real, não só "decoração".',
    },
    {
      level: 'senior',
      q: 'O que são logical properties e por que preferir margin-inline a margin-left?',
      a: '<p><strong>Logical properties</strong> substituem direções FÍSICAS (left/right/top/bottom) por direções LÓGICAS (inline/block, start/end). Elas se adaptam ao <code>writing-mode</code> e <code>direction</code> do documento.</p><table><tr><th>Físico</th><th>Lógico</th></tr><tr><td>margin-left</td><td>margin-inline-start</td></tr><tr><td>margin-right</td><td>margin-inline-end</td></tr><tr><td>margin-top</td><td>margin-block-start</td></tr><tr><td>padding-left</td><td>padding-inline-start</td></tr><tr><td>top + bottom</td><td>inset-block</td></tr></table><p><strong>Por que preferir:</strong></p><ul><li><strong>RTL (right-to-left)</strong>: árabe, hebraico — margin-right vira margin-left visualmente, mas com lógica reversa.</li><li><strong>vertical-rl</strong>: japonês vertical — eixo bloco vira horizontal.</li><li><strong>Componentes reutilizáveis</strong>: o mesmo CSS funciona em qualquer direção.</li></ul><p>Atalhos: <code>margin-inline: auto</code> = margin-left + margin-right auto (centralização horizontal). <code>padding-block: 1rem</code> = padding-top + padding-bottom.</p><ul><li>margin-inline: auto centraliza horizontalmente em ambas as direções — substitui o "margin: 0 auto" do flex container.</li><li>inset: 0 = top: 0; right: 0; bottom: 0; left: 0 — atalho para position absolute "stretch".</li><li>É padrão moderno em design systems (Material 3, Adobe Spectrum, IBM Carbon).</li></ul>',
      tip: 'Cite RTL como caso real — em produtos globais (Airbnb, e-commerce), logical properties resolvem layout sem if/else por idioma.',
    },
    {
      level: 'senior',
      q: 'Como otimizar performance de CSS?',
      a: '<p>Performance de CSS impacta render do browser. Estratégias:</p><ol><li><strong>Reduzir reflow/repaint:</strong> animar apenas <code>transform</code> e <code>opacity</code> (compositor-friendly). Evitar animar <code>width</code>, <code>height</code>, <code>top</code>, <code>left</code> — disparam layout em toda a árvore.</li><li><strong>Containment:</strong> <code>contain: layout style paint</code> isola subárvores. <code>content-visibility: auto</code> pula render de elementos fora do viewport.</li><li><strong>Reduzir CSS crítico:</strong> inline o CSS above-the-fold no &lt;head&gt;. O resto carrega async.</li><li><strong>Seletores eficientes:</strong> evite seletores universal aninhados (<code>* * *</code>), descendant complexos (<code>div > div .x</code>). Browser lê seletores da DIREITA para a esquerda — o último deve ser específico.</li><li><strong>will-change pontual:</strong> antes de animar, remover ao terminar.</li><li><strong>GPU layers:</strong> <code>transform: translateZ(0)</code> ou <code>will-change: transform</code> promove para layer.</li><li><strong>Reduzir bundle:</strong> tree-shake CSS não usado (PurgeCSS, Tailwind JIT). Critical CSS por rota.</li></ol><ul><li>transform/opacity rodam na thread do compositor — não bloqueiam JS.</li><li>content-visibility: auto pode acelerar render em 5-10x em listas longas.</li><li>CSS sem uso é gordura — projetos grandes acumulam estilos mortos rapidamente.</li></ul>',
      tip: 'Diga "transform e opacity são gratuitos, width e height são caros" — frase memorável que demonstra entender o pipeline de render.',
    },
    {
      level: 'senior',
      q: 'O que são container queries e quando preferir a media queries?',
      a: '<p><strong>Container queries</strong> respondem ao tamanho do CONTAINER, não do viewport. Permitem que um componente seja responsivo independente de onde é colocado na página.</p><pre><code>.card {\n  container-type: inline-size;\n  container-name: card;\n}\n@container card (min-width: 400px) {\n  .card-title { font-size: 2rem; }\n}</code></pre><p><strong>Quando usar container vs media query:</strong></p><ul><li><strong>Media query:</strong> layout global — sidebar empilha em mobile, navbar muda de orientação. Decisões de página inteira.</li><li><strong>Container query:</strong> componente reutilizável — um card que muda layout baseado em onde foi colocado (sidebar 200px vs main 800px). Decisões de componente.</li></ul><p>Suporte: Chrome 105+, Safari 16+, Firefox 110+ — produção em 2024+.</p><p>Limitações:</p><ul><li>O container precisa de <code>container-type</code> declarado (cria um BFC).</li><li>Filhos perdem acesso a <code>position: fixed</code> ao viewport (vai para o container).</li></ul><ul><li>container-type: inline-size = só largura. size = ambas (raro).</li><li>cqw, cqh, cqi, cqb são unidades % do container (substituem vw/vh em componentes).</li><li>Mata "props prop drilling" só para fazer um card responsivo.</li></ul>',
      tip: 'Cite o caso real: o mesmo componente em sidebar e main com layouts diferentes — antes precisava de prop ou className, agora é só CSS.',
    },
    {
      level: 'pleno',
      q: 'Como funciona grid-template-areas e por que usar?',
      a: '<p><strong>grid-template-areas</strong> permite nomear regiões do grid e posicionar itens declarativamente, criando layouts visuais legíveis no próprio CSS.</p><pre><code>.layout {\n  display: grid;\n  grid-template-columns: 200px 1fr 200px;\n  grid-template-rows: 60px 1fr 40px;\n  grid-template-areas:\n    "header header header"\n    "nav    main   aside"\n    "footer footer footer";\n}\n.header { grid-area: header; }\n.nav    { grid-area: nav; }\n.main   { grid-area: main; }\n.aside  { grid-area: aside; }\n.footer { grid-area: footer; }</code></pre><p>Vantagens:</p><ul><li>Layout LEGÍVEL no CSS — você "vê" a estrutura.</li><li>Reordenação trivial — reescreva as áreas, sem tocar nos componentes.</li><li>Áreas vazias com ponto (<code>"header . footer"</code>).</li><li>Combina com media queries para layouts diferentes em mobile vs desktop.</li></ul><p>Limitações:</p><ul><li>Áreas devem ser retangulares (não L-shape).</li><li>Áreas com mesmo nome devem ser adjacentes (formando o retângulo).</li></ul><ul><li>Reordenar layout em mobile: redefine grid-template-areas dentro de @media.</li><li>Áreas vazias com . (ponto): "a . b" deixa célula intermediária vazia.</li><li>Funciona bem com auto-fit/auto-fill em layouts dinâmicos.</li></ul>',
      tip: 'Demonstre numa entrevista escrevendo um layout completo — é a forma mais legível de apresentar grid e impressiona.',
    },
  ],
  diagrams: [
    {
      title: "Box Model — caixas concêntricas",
      html: `<style>
.css-bm{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:32px;color:#e2e8f0;display:flex;flex-direction:column;align-items:center;gap:20px}
.css-bm-label{font-size:9px;letter-spacing:.15em;text-transform:uppercase;font-weight:700;margin-bottom:6px}
.css-bm-margin{background:rgba(251,146,60,.12);border:2px dashed #fb923c;padding:34px 50px;border-radius:8px;position:relative;transition:all .25s}
.css-bm-margin:hover{background:rgba(251,146,60,.22)}
.css-bm-margin>.css-bm-label{color:#fb923c;position:absolute;top:6px;left:12px}
.css-bm-border{background:#1e293b;border:3px solid #38bdf8;padding:24px 40px;border-radius:6px;position:relative}
.css-bm-border>.css-bm-label{color:#38bdf8;position:absolute;top:4px;left:8px}
.css-bm-padding{background:rgba(74,222,128,.15);border:2px dashed #4ade80;padding:20px 36px;border-radius:4px;position:relative}
.css-bm-padding>.css-bm-label{color:#4ade80;position:absolute;top:4px;left:8px}
.css-bm-content{background:#243044;border:1px solid #475569;color:#e2e8f0;padding:16px 24px;border-radius:3px;font-size:13px;font-weight:700;text-align:center}
.css-bm-legend{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;width:100%;max-width:520px;margin-top:8px}
.css-bm-leg{padding:10px 14px;border-radius:8px;font-size:10.5px;line-height:1.55;border:1px solid}
.css-bm-leg-margin{border-color:#fb923c50;background:#fb923c0d;color:#fdba74}
.css-bm-leg-border{border-color:#38bdf850;background:#38bdf80d;color:#7dd3fc}
.css-bm-leg-padding{border-color:#4ade8050;background:#4ade800d;color:#86efac}
.css-bm-leg-content{border-color:#94a3b850;background:#94a3b80d;color:#cbd5e1}
.css-bm-formula{background:#020617;border:1px solid #334155;border-radius:8px;padding:12px 16px;font-size:11px;color:#94a3b8;line-height:1.7;width:100%;max-width:520px}
.css-bm-formula strong{color:#ef4444}
</style>
<div class="css-bm">
  <p style="color:#ef4444;font-size:12px;font-weight:700;margin:0">Box Model — toda caixa tem 4 áreas concêntricas</p>
  <div class="css-bm-margin">
    <span class="css-bm-label">margin</span>
    <div class="css-bm-border">
      <span class="css-bm-label">border</span>
      <div class="css-bm-padding">
        <span class="css-bm-label">padding</span>
        <div class="css-bm-content">content</div>
      </div>
    </div>
  </div>
  <div class="css-bm-legend">
    <div class="css-bm-leg css-bm-leg-margin"><strong>margin</strong> — espaço externo entre caixas. Pode colapsar.</div>
    <div class="css-bm-leg css-bm-leg-border"><strong>border</strong> — linha visível ao redor.</div>
    <div class="css-bm-leg css-bm-leg-padding"><strong>padding</strong> — espaço interno até a borda.</div>
    <div class="css-bm-leg css-bm-leg-content"><strong>content</strong> — texto, imagem, filhos.</div>
  </div>
  <div class="css-bm-formula">
    <strong>box-sizing: content-box</strong> (padrão) → width = só content; padding/border AUMENTAM o tamanho total.<br>
    <strong>box-sizing: border-box</strong> → width = content + padding + border. Padrão moderno: <code>* { box-sizing: border-box }</code>.
  </div>
</div>`,
      caption: "margin é externo, padding é interno, border separa. box-sizing: border-box é padrão moderno — torna o cálculo de width previsível.",
    },
    {
      title: "Cascade & Especificidade — calculadora visual",
      html: `<style>
.css-sp{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.css-sp-row{display:grid;grid-template-columns:1.7fr repeat(4,60px) 80px;gap:8px;align-items:center;padding:10px 12px;border-radius:6px;background:#1e293b;border:1px solid #334155;margin-bottom:6px;transition:all .2s}
.css-sp-row:hover{background:#243044;border-color:#475569}
.css-sp-sel{font-size:11px;color:#7dd3fc}
.css-sp-num{text-align:center;font-size:14px;font-weight:700;font-family:inherit}
.css-sp-num.css-sp-z{color:#475569}
.css-sp-num.css-sp-act-1{color:#475569}
.css-sp-num.css-sp-act-10{color:#94a3b8}
.css-sp-num.css-sp-act-100{color:#38bdf8}
.css-sp-num.css-sp-act-1000{color:#fb923c}
.css-sp-tot{font-size:13px;color:#ef4444;font-weight:800;text-align:center;background:#ef44441a;border-radius:4px;padding:4px 8px}
.css-sp-head{display:grid;grid-template-columns:1.7fr repeat(4,60px) 80px;gap:8px;padding:6px 12px;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#475569;font-weight:700;margin-bottom:4px}
.css-sp-head>div{text-align:center}
.css-sp-head>div:first-child{text-align:left}
.css-sp-cat{font-size:8px;color:#475569;margin-top:2px;letter-spacing:.05em}
.css-sp-formula{margin-top:14px;padding:14px 18px;background:#020617;border:1px solid #334155;border-radius:8px;font-size:11px;color:#94a3b8;line-height:1.65}
.css-sp-formula strong{color:#ef4444}
.css-sp-warn{margin-top:10px;padding:10px 14px;background:#1e1206;border-left:3px solid #f59e0b;border-radius:4px;font-size:11px;color:#fbbf24;line-height:1.6}
</style>
<div class="css-sp">
  <p style="color:#ef4444;font-size:12px;font-weight:700;margin:0 0 4px">Calculadora de Especificidade</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Para cada seletor, conte os componentes em cada pilha (inline, id, class, tag) e some.</p>
  <div class="css-sp-head">
    <div>Seletor</div>
    <div>inline</div>
    <div>id</div>
    <div>class</div>
    <div>tag</div>
    <div>total</div>
  </div>
  <div class="css-sp-row">
    <div><span class="css-sp-sel">div</span><div class="css-sp-cat">tag</div></div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-num css-sp-act-1">1</div>
    <div class="css-sp-tot">0,0,0,1</div>
  </div>
  <div class="css-sp-row">
    <div><span class="css-sp-sel">.btn</span><div class="css-sp-cat">classe</div></div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-num css-sp-act-10">1</div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-tot">0,0,1,0</div>
  </div>
  <div class="css-sp-row">
    <div><span class="css-sp-sel">.btn:hover</span><div class="css-sp-cat">classe + pseudo-classe</div></div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-num css-sp-act-10">2</div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-tot">0,0,2,0</div>
  </div>
  <div class="css-sp-row">
    <div><span class="css-sp-sel">#header .nav a</span><div class="css-sp-cat">id + classe + tag</div></div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-num css-sp-act-100">1</div>
    <div class="css-sp-num css-sp-act-10">1</div>
    <div class="css-sp-num css-sp-act-1">1</div>
    <div class="css-sp-tot">0,1,1,1</div>
  </div>
  <div class="css-sp-row">
    <div><span class="css-sp-sel">style="..."</span><div class="css-sp-cat">inline style</div></div>
    <div class="css-sp-num css-sp-act-1000">1</div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-tot">1,0,0,0</div>
  </div>
  <div class="css-sp-row">
    <div><span class="css-sp-sel">:where(.x, .y)</span><div class="css-sp-cat">:where → especificidade ZERO</div></div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-num css-sp-z">0</div>
    <div class="css-sp-tot">0,0,0,0</div>
  </div>
  <div class="css-sp-formula">
    <strong>Comparação:</strong> NÃO use base 10 — (0,0,2,0) ganha de (0,0,1,99). Compare pilha por pilha, da esquerda para a direita.<br>
    <strong>!important</strong> sai da contagem e vence — exceção: !important do user-agent perde para !important do author. Em layers, ordem de declaração inverte com !important.
  </div>
  <div class="css-sp-warn">⚠ <strong>:where()</strong> tem especificidade zero — perfeito para resets sem competição. <strong>:is()</strong> e <strong>:not()</strong> usam a maior especificidade dos argumentos.</div>
</div>`,
      caption: "Especificidade tem 4 pilhas. inline > id > class/attr/pseudo-class > tag. Compare da esquerda para a direita, NÃO some em base 10.",
    },
    {
      title: "Flexbox vs Grid — comparação visual",
      html: `<style>
.css-fg{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.css-fg-grid2{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.css-fg-card{background:#1e293b;border:1px solid #334155;border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:12px}
.css-fg-card h4{margin:0;color:#38bdf8;font-size:13px}
.css-fg-card.css-fg-grid h4{color:#a78bfa}
.css-fg-demo{background:#020617;border:1px solid #334155;border-radius:6px;padding:14px;min-height:140px;display:flex;flex-wrap:wrap;gap:6px}
.css-fg-flex-demo{display:flex;flex-wrap:wrap;gap:6px;justify-content:space-between;align-items:center;min-height:80px}
.css-fg-grid-demo{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:50px 50px;gap:6px;height:120px}
.css-fg-item{background:#38bdf8;color:#0f172a;border-radius:4px;padding:8px 12px;font-size:11px;font-weight:700;text-align:center;display:flex;align-items:center;justify-content:center}
.css-fg-card.css-fg-grid .css-fg-item{background:#a78bfa}
.css-fg-item.span2{grid-column:span 2}
.css-fg-code{background:#020617;border-radius:4px;padding:8px 12px;font-size:10.5px;color:#94a3b8;line-height:1.7;white-space:pre;overflow-x:auto}
.css-fg-code .k{color:#7dd3fc}
.css-fg-code .v{color:#86efac}
.css-fg-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.css-fg-tag{font-size:9px;padding:2px 8px;border-radius:10px;background:#0f172a;border:1px solid #334155;color:#94a3b8}
.css-fg-card.css-fg-flex .css-fg-tag{border-color:#38bdf850;color:#7dd3fc}
.css-fg-card.css-fg-grid .css-fg-tag{border-color:#a78bfa50;color:#c4b5fd}
.css-fg-when{font-size:11px;color:#94a3b8;line-height:1.65}
</style>
<div class="css-fg">
  <p style="color:#ef4444;font-size:12px;font-weight:700;margin:0 0 4px">Flexbox vs Grid — 1D vs 2D</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Mesma direção, distribuição linear → flex. Linhas e colunas → grid.</p>
  <div class="css-fg-grid2">
    <div class="css-fg-card css-fg-flex">
      <h4>📏 Flexbox — 1D</h4>
      <div class="css-fg-flex-demo">
        <div class="css-fg-item">A</div>
        <div class="css-fg-item">B</div>
        <div class="css-fg-item">C</div>
        <div class="css-fg-item">D</div>
      </div>
      <div class="css-fg-tags">
        <span class="css-fg-tag">linha OU coluna</span>
        <span class="css-fg-tag">distribuição linear</span>
        <span class="css-fg-tag">tamanho dinâmico</span>
      </div>
      <div class="css-fg-code"><span class="k">display</span>: <span class="v">flex</span>;
<span class="k">justify-content</span>: <span class="v">space-between</span>;
<span class="k">align-items</span>: <span class="v">center</span>;
<span class="k">gap</span>: <span class="v">6px</span>;</div>
      <div class="css-fg-when">
        <strong style="color:#7dd3fc">Use para:</strong> navbars, listas horizontais, alinhar conteúdo dentro de componentes, ordem dinâmica.
      </div>
    </div>
    <div class="css-fg-card css-fg-grid">
      <h4>📐 Grid — 2D</h4>
      <div class="css-fg-grid-demo">
        <div class="css-fg-item span2">A (span 2)</div>
        <div class="css-fg-item">B</div>
        <div class="css-fg-item">C</div>
        <div class="css-fg-item">D</div>
        <div class="css-fg-item">E</div>
      </div>
      <div class="css-fg-tags">
        <span class="css-fg-tag">linhas + colunas</span>
        <span class="css-fg-tag">áreas nomeadas</span>
        <span class="css-fg-tag">overlapping</span>
      </div>
      <div class="css-fg-code"><span class="k">display</span>: <span class="v">grid</span>;
<span class="k">grid-template-columns</span>: <span class="v">repeat(3, 1fr)</span>;
<span class="k">gap</span>: <span class="v">6px</span>;
<span style="color:#475569">/* item: grid-column: span 2 */</span></div>
      <div class="css-fg-when">
        <strong style="color:#c4b5fd">Use para:</strong> layouts de página, dashboards, áreas nomeadas, alinhar entre cards (subgrid).
      </div>
    </div>
  </div>
  <div style="margin-top:16px;padding:12px 16px;background:#020617;border:1px solid #334155;border-radius:8px;font-size:11px;color:#94a3b8;line-height:1.7">
    <strong style="color:#ef4444">Combinar é normal:</strong> Grid no layout macro da página, Flex em cada célula/card. <code style="color:#7dd3fc">gap</code> funciona em ambos desde 2021.
  </div>
</div>`,
      caption: "Flex distribui em UMA dimensão (linha OU coluna). Grid distribui em DUAS (linhas E colunas). Combine ambos: grid macro, flex micro.",
    },
    {
      title: "Stacking Context — camadas 3D",
      html: `<style>
.css-sc{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:32px 24px;color:#e2e8f0}
.css-sc-stage{position:relative;height:280px;perspective:800px;perspective-origin:50% 30%;margin:20px 0}
.css-sc-layer{position:absolute;left:50%;width:280px;height:80px;border-radius:8px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;font-size:11px;font-weight:700;transform-style:preserve-3d;transition:all .3s}
.css-sc-l1{transform:translate(-50%,0) rotateX(45deg) translateZ(0px);background:#1e3a5c;border:2px solid #38bdf8;color:#7dd3fc;top:30px}
.css-sc-l2{transform:translate(-50%,0) rotateX(45deg) translateZ(40px);background:#3a1e5c;border:2px solid #a78bfa;color:#c4b5fd;top:30px}
.css-sc-l3{transform:translate(-50%,0) rotateX(45deg) translateZ(80px);background:#5c1e3a;border:2px solid #ef4444;color:#fca5a5;top:30px}
.css-sc-l4{transform:translate(-50%,0) rotateX(45deg) translateZ(120px);background:#5c4a1e;border:2px solid #fbbf24;color:#fcd34d;top:30px}
.css-sc-z{font-family:inherit;font-size:9px;letter-spacing:.05em;opacity:.7}
.css-sc-tag{font-size:9px;letter-spacing:.05em;padding:2px 6px;border-radius:3px;background:rgba(255,255,255,.1)}
.css-sc-trigger{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:8px}
.css-sc-trig-card{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:10px 12px;font-size:10.5px;color:#94a3b8;line-height:1.55}
.css-sc-trig-card strong{color:#ef4444}
.css-sc-trig-card code{color:#7dd3fc;font-size:10px}
.css-sc-rule{margin-top:14px;padding:12px 16px;background:#020617;border:1px solid #334155;border-radius:8px;font-size:11px;color:#94a3b8;line-height:1.7}
.css-sc-rule strong{color:#ef4444}
</style>
<div class="css-sc">
  <p style="color:#ef4444;font-size:12px;font-weight:700;margin:0 0 4px">Stacking Context — árvore paralela de profundidade</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">z-index só compete dentro do mesmo contexto. Filhos não podem "furar" para fora do pai.</p>
  <div class="css-sc-stage">
    <div class="css-sc-layer css-sc-l1">
      <span class="css-sc-z">z-index: 1</span>
      <span class="css-sc-tag">contexto raiz (html)</span>
    </div>
    <div class="css-sc-layer css-sc-l2">
      <span class="css-sc-z">z-index: 100</span>
      <span class="css-sc-tag">.modal (z:5)</span>
    </div>
    <div class="css-sc-layer css-sc-l3">
      <span class="css-sc-z">z-index: 9999</span>
      <span class="css-sc-tag">.tooltip dentro do modal</span>
    </div>
    <div class="css-sc-layer css-sc-l4">
      <span class="css-sc-z">topo absoluto</span>
      <span class="css-sc-tag">novo contexto irmão</span>
    </div>
  </div>
  <p style="font-size:11px;color:#94a3b8;line-height:1.6;text-align:center;margin:0 0 14px">
    Mesmo com z-index: 9999, a tooltip dentro do modal NÃO pula para fora — fica empilhada apenas dentro do contexto do modal.
  </p>
  <div class="css-sc-trigger">
    <div class="css-sc-trig-card"><strong>position</strong> + <code>z-index</code> ≠ auto</div>
    <div class="css-sc-trig-card"><strong>opacity</strong> < 1</div>
    <div class="css-sc-trig-card"><strong>transform</strong>, <strong>filter</strong>, <strong>perspective</strong></div>
    <div class="css-sc-trig-card"><strong>isolation: isolate</strong> (sem efeito visual)</div>
    <div class="css-sc-trig-card"><strong>position: fixed</strong> ou <strong>sticky</strong></div>
    <div class="css-sc-trig-card"><strong>will-change</strong> em prop acima</div>
  </div>
  <div class="css-sc-rule">
    <strong>Bug clássico:</strong> modal com z-index: 9999 fica "atrás" de outro elemento. O motivo é quase sempre um ancestral com transform/opacity criando um stacking context que aprisiona o modal.<br>
    <strong>Solução moderna:</strong> isolation: isolate cria contexto sem efeito visual — útil para isolar componentes. Para modais, mover para o body via portal (React.createPortal).
  </div>
</div>`,
      caption: "Stacking context é uma árvore paralela. z-index só compete dentro do mesmo contexto. transform e opacity criam contextos — bug clássico de modal preso.",
    },
  ],
  mnemonics: [
    {
      label: "Ordem da Cascade",
      trick: "OLEO",
      explanation: "Origem (user-agent < user < author < !important) → Layers (@layer ordem declarada) → Especificidade (inline > id > class > tag) → Ordem de declaração (última ganha quando empata). Memorizar OLEO substitui decorar a tabela inteira do W3C.",
    },
    {
      label: "Especificidade — pilhas",
      trick: "1-10-100-1000",
      explanation: "Cada pilha tem peso fixo: tag = 1, class/attr/pseudo = 10, id = 100, inline = 1000. NÃO somar em base 10 — comparar pilha por pilha. Memorizar como ordem de magnitude ajuda visualizar que id sempre vence quantas classes tiver.",
    },
    {
      label: "Eixos do Flexbox",
      trick: "JADE",
      explanation: "Justify-content (eixo principal) → Align-items (eixo cruzado) → Direction (row/column) → Either (wrap). JADE lembra os 4 eixos de decisão: como distribui no principal, como alinha no cruzado, qual é o principal, e se quebra linha.",
    },
    {
      label: "Quando NÃO há margin collapse",
      trick: "FOG",
      explanation: "Flex container, Overflow ≠ visible (BFC), Grid container — 3 cenários onde margens NÃO colapsam. Memorizar FOG dá ferramenta de diagnóstico rápido: se você quer impedir collapse, crie um desses contextos.",
    },
    {
      label: "Box Model",
      trick: "MaBoPaCo",
      explanation: "Margin → Border → Padding → Content. De FORA para DENTRO. Margin (externo, pode colapsar) → Border (linha) → Padding (interno até a borda) → Content (texto/imagem). Atalho: M-B-P-C. Decorar a ordem evita confundir margin com padding.",
    },
    {
      label: "Triggers de Stacking Context",
      trick: "POTI",
      explanation: "Position (não-static + z-index), Opacity (< 1), Transform (qualquer), Isolation (isolate). 4 gatilhos principais que criam stacking context. POTI substitui memorizar a lista longa do MDN — cobre 90% dos casos reais.",
    },
  ],
  cheatsheet: {
    title: "CSS Cheatsheet — propriedades essenciais por categoria",
    html: `<style>
.css-cs{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0;display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.css-cs-block{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:14px}
.css-cs-block h4{margin:0 0 10px;font-size:11px;color:#ef4444;letter-spacing:.1em;text-transform:uppercase;font-weight:800}
.css-cs-list{display:flex;flex-direction:column;gap:5px;font-size:10.5px;line-height:1.55}
.css-cs-prop{color:#7dd3fc;font-weight:700}
.css-cs-val{color:#86efac}
.css-cs-com{color:#475569;font-size:10px}
.css-cs-row{display:flex;flex-direction:column;gap:1px}
.css-cs-grid-full{grid-column:span 2}
.css-cs-fn{color:#fbbf24;font-weight:700}
</style>
<div class="css-cs">
  <div class="css-cs-block">
    <h4>📦 Box Model</h4>
    <div class="css-cs-list">
      <div class="css-cs-row"><span><span class="css-cs-prop">box-sizing</span>: <span class="css-cs-val">border-box</span></span><span class="css-cs-com">// padrão moderno em reset</span></div>
      <div><span class="css-cs-prop">display</span>: <span class="css-cs-val">block | inline | flex | grid | none | contents</span></div>
      <div><span class="css-cs-prop">overflow</span>: <span class="css-cs-val">visible | hidden | auto | scroll | clip</span></div>
      <div><span class="css-cs-prop">padding</span>: <span class="css-cs-val">top right bottom left</span> <span class="css-cs-com">// 1, 2, 3 ou 4 valores</span></div>
      <div><span class="css-cs-prop">margin</span>: <span class="css-cs-val">auto</span> <span class="css-cs-com">// centraliza horizontalmente em block</span></div>
      <div><span class="css-cs-prop">aspect-ratio</span>: <span class="css-cs-val">16 / 9</span></div>
    </div>
  </div>
  <div class="css-cs-block">
    <h4>📏 Flexbox</h4>
    <div class="css-cs-list">
      <div><span class="css-cs-prop">display</span>: <span class="css-cs-val">flex | inline-flex</span></div>
      <div><span class="css-cs-prop">flex-direction</span>: <span class="css-cs-val">row | row-reverse | column | column-reverse</span></div>
      <div><span class="css-cs-prop">justify-content</span>: <span class="css-cs-val">flex-start | center | space-between | space-around | space-evenly</span></div>
      <div><span class="css-cs-prop">align-items</span>: <span class="css-cs-val">stretch | center | flex-start | flex-end | baseline</span></div>
      <div><span class="css-cs-prop">flex-wrap</span>: <span class="css-cs-val">nowrap | wrap | wrap-reverse</span></div>
      <div><span class="css-cs-prop">gap</span>: <span class="css-cs-val">8px</span> <span class="css-cs-com">// row e column</span></div>
      <div><span class="css-cs-prop">flex</span>: <span class="css-cs-val">1 1 0</span> <span class="css-cs-com">// grow shrink basis</span></div>
      <div><span class="css-cs-prop">order</span>: <span class="css-cs-val">2</span> <span class="css-cs-com">// reordenar visual</span></div>
    </div>
  </div>
  <div class="css-cs-block">
    <h4>📐 Grid</h4>
    <div class="css-cs-list">
      <div><span class="css-cs-prop">display</span>: <span class="css-cs-val">grid | inline-grid</span></div>
      <div><span class="css-cs-prop">grid-template-columns</span>: <span class="css-cs-val">repeat(3, 1fr)</span></div>
      <div><span class="css-cs-prop">grid-template-columns</span>: <span class="css-cs-val">repeat(auto-fit, minmax(200px, 1fr))</span></div>
      <div><span class="css-cs-prop">grid-template-areas</span>: <span class="css-cs-val">"header header" "nav main"</span></div>
      <div><span class="css-cs-prop">grid-column</span>: <span class="css-cs-val">1 / 3</span> | <span class="css-cs-val">span 2</span></div>
      <div><span class="css-cs-prop">grid-row</span>: <span class="css-cs-val">2 / -1</span> <span class="css-cs-com">// até o fim</span></div>
      <div><span class="css-cs-prop">place-items</span>: <span class="css-cs-val">center</span> <span class="css-cs-com">// align + justify</span></div>
      <div><span class="css-cs-prop">grid-auto-flow</span>: <span class="css-cs-val">row | column | dense</span></div>
      <div><span class="css-cs-prop">subgrid</span> <span class="css-cs-com">// herda tracks do avô</span></div>
    </div>
  </div>
  <div class="css-cs-block">
    <h4>🎯 Posicionamento</h4>
    <div class="css-cs-list">
      <div><span class="css-cs-prop">position</span>: <span class="css-cs-val">static | relative | absolute | fixed | sticky</span></div>
      <div><span class="css-cs-prop">inset</span>: <span class="css-cs-val">0</span> <span class="css-cs-com">// top + right + bottom + left</span></div>
      <div><span class="css-cs-prop">z-index</span>: <span class="css-cs-val">10</span> <span class="css-cs-com">// só com position ≠ static</span></div>
      <div><span class="css-cs-prop">isolation</span>: <span class="css-cs-val">isolate</span> <span class="css-cs-com">// stacking context limpo</span></div>
      <div><span class="css-cs-prop">float</span>: <span class="css-cs-val">left | right | none</span> <span class="css-cs-com">// legado</span></div>
      <div><span class="css-cs-prop">clear</span>: <span class="css-cs-val">both</span></div>
    </div>
  </div>
  <div class="css-cs-block">
    <h4>✍️ Tipografia</h4>
    <div class="css-cs-list">
      <div><span class="css-cs-prop">font-family</span>: <span class="css-cs-val">'Inter', system-ui</span></div>
      <div><span class="css-cs-prop">font-size</span>: <span class="css-cs-val">clamp(1rem, 2vw, 1.5rem)</span></div>
      <div><span class="css-cs-prop">line-height</span>: <span class="css-cs-val">1.5</span> <span class="css-cs-com">// sem unidade</span></div>
      <div><span class="css-cs-prop">font-weight</span>: <span class="css-cs-val">100 a 900</span></div>
      <div><span class="css-cs-prop">letter-spacing</span>: <span class="css-cs-val">0.05em</span></div>
      <div><span class="css-cs-prop">text-align</span>: <span class="css-cs-val">start | end | center | justify</span></div>
      <div><span class="css-cs-prop">text-wrap</span>: <span class="css-cs-val">balance | pretty | wrap</span></div>
      <div><span class="css-cs-prop">text-transform</span>: <span class="css-cs-val">uppercase | lowercase | capitalize</span></div>
    </div>
  </div>
  <div class="css-cs-block">
    <h4>🎨 Custom Properties</h4>
    <div class="css-cs-list">
      <div><span class="css-cs-prop">--accent</span>: <span class="css-cs-val">#ef4444</span> <span class="css-cs-com">// declaração</span></div>
      <div><span class="css-cs-prop">color</span>: <span class="css-cs-fn">var</span>(<span class="css-cs-prop">--accent</span>, <span class="css-cs-val">red</span>) <span class="css-cs-com">// fallback</span></div>
      <div><span class="css-cs-prop">@property</span> <span class="css-cs-prop">--x</span> {} <span class="css-cs-com">// tipar (Houdini)</span></div>
      <div><span class="css-cs-com">// override em filho</span></div>
      <div>.dark { <span class="css-cs-prop">--bg</span>: <span class="css-cs-val">#000</span> }</div>
    </div>
  </div>
  <div class="css-cs-block">
    <h4>⚙️ Funções essenciais</h4>
    <div class="css-cs-list">
      <div><span class="css-cs-fn">calc</span>(100% - 40px)</div>
      <div><span class="css-cs-fn">clamp</span>(min, ideal, max) <span class="css-cs-com">// fluido</span></div>
      <div><span class="css-cs-fn">min</span>(50%, 600px) <span class="css-cs-com">// max-width fluido</span></div>
      <div><span class="css-cs-fn">max</span>(2rem, 5vw)</div>
      <div><span class="css-cs-fn">var</span>(--name, fallback)</div>
      <div><span class="css-cs-fn">env</span>(safe-area-inset-bottom) <span class="css-cs-com">// iOS notch</span></div>
      <div><span class="css-cs-fn">attr</span>(data-tip) <span class="css-cs-com">// em content</span></div>
      <div><span class="css-cs-fn">color-mix</span>(in srgb, red 50%, blue)</div>
    </div>
  </div>
  <div class="css-cs-block">
    <h4>🎯 Seletores</h4>
    <div class="css-cs-list">
      <div><span class="css-cs-prop">A B</span> <span class="css-cs-com">// descendente</span></div>
      <div><span class="css-cs-prop">A &gt; B</span> <span class="css-cs-com">// filho direto</span></div>
      <div><span class="css-cs-prop">A + B</span> <span class="css-cs-com">// irmão adjacente</span></div>
      <div><span class="css-cs-prop">A ~ B</span> <span class="css-cs-com">// irmãos seguintes</span></div>
      <div><span class="css-cs-prop">:is(a, b, c)</span> <span class="css-cs-com">// alta especificidade</span></div>
      <div><span class="css-cs-prop">:where(a, b)</span> <span class="css-cs-com">// especificidade ZERO</span></div>
      <div><span class="css-cs-prop">:has(&gt; img)</span> <span class="css-cs-com">// seletor de pai (2023+)</span></div>
      <div><span class="css-cs-prop">:not(.x)</span></div>
      <div><span class="css-cs-prop">:nth-child(3n+1)</span></div>
    </div>
  </div>
  <div class="css-cs-block css-cs-grid-full">
    <h4>🌐 Logical properties + Layers + Container queries</h4>
    <div class="css-cs-list">
      <div><span class="css-cs-prop">margin-inline</span>: <span class="css-cs-val">auto</span> <span class="css-cs-com">// margin-left/right (RTL-safe)</span></div>
      <div><span class="css-cs-prop">padding-block</span>: <span class="css-cs-val">1rem</span> <span class="css-cs-com">// padding-top/bottom</span></div>
      <div><span class="css-cs-prop">inset-inline-start</span>: <span class="css-cs-val">0</span> <span class="css-cs-com">// = left em LTR / right em RTL</span></div>
      <div>@layer reset, base, components, utilities; <span class="css-cs-com">// ordem explícita</span></div>
      <div>@container (min-width: 400px) { ... } <span class="css-cs-com">// requer container-type: inline-size no pai</span></div>
      <div><span class="css-cs-prop">container-type</span>: <span class="css-cs-val">inline-size | size | normal</span></div>
      <div>1cqw, 1cqh, 1cqi, 1cqb <span class="css-cs-com">// % do container</span></div>
    </div>
  </div>
</div>`,
    caption: "Densidade máxima: box, flex, grid, position, type, custom props, funções, seletores e features modernas (logical, @layer, container).",
  },
  mindmap: {
    title: "Mapa do ecossistema CSS — fundamentos a recursos modernos",
    html: `<style>
.css-mm{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.css-mm-cat{margin-bottom:14px;padding-bottom:14px;border-bottom:1px dashed #334155;display:grid;grid-template-columns:120px 1fr;gap:14px;align-items:flex-start}
.css-mm-cat:last-child{border:0;padding:0;margin:0}
.css-mm-name{color:#ef4444;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;line-height:1.4}
.css-mm-tags{display:flex;flex-wrap:wrap;gap:5px}
.css-mm-tag{font-size:10px;padding:3px 9px;border-radius:12px;background:#1e293b;border:1px solid #334155;color:#94a3b8}
.css-mm-tag.k{background:#0a1f2e;border-color:#264de480;color:#7dd3fc;font-weight:700}
.css-mm-tag.a{background:#1a0808;border-color:#ef444460;color:#fca5a5;font-weight:700}
.css-mm-leg{display:flex;gap:14px;margin-top:14px;padding-top:14px;border-top:1px solid #334155;font-size:10px;color:#94a3b8}
.css-mm-leg span{display:inline-flex;align-items:center;gap:5px}
.css-mm-dot{width:8px;height:8px;border-radius:50%}
</style>
<div class="css-mm">
  <p style="color:#264de4;font-size:13px;font-weight:800;margin:0 0 4px">Ecossistema CSS</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Categorias e tags do que existe. <span style="color:#7dd3fc">Azul</span>: essencial · <span style="color:#94a3b8">cinza</span>: importante · <span style="color:#fca5a5">vermelho</span>: nível sênior</p>

  <div class="css-mm-cat"><div class="css-mm-name">FUNDAÇÃO</div><div class="css-mm-tags">
    <span class="css-mm-tag k">box model</span><span class="css-mm-tag k">box-sizing</span><span class="css-mm-tag k">display</span>
    <span class="css-mm-tag k">cascade</span><span class="css-mm-tag k">especificidade</span><span class="css-mm-tag k">herança</span>
    <span class="css-mm-tag">unidades (px, em, rem, %, vw, vh)</span><span class="css-mm-tag">cores (hex, rgb, hsl, oklch)</span>
  </div></div>

  <div class="css-mm-cat"><div class="css-mm-name">LAYOUT</div><div class="css-mm-tags">
    <span class="css-mm-tag k">flexbox</span><span class="css-mm-tag k">grid</span><span class="css-mm-tag k">position</span>
    <span class="css-mm-tag k">gap</span><span class="css-mm-tag">grid-template-areas</span>
    <span class="css-mm-tag a">subgrid</span><span class="css-mm-tag a">masonry</span><span class="css-mm-tag">float (legado)</span>
  </div></div>

  <div class="css-mm-cat"><div class="css-mm-name">RESPONSIVO</div><div class="css-mm-tags">
    <span class="css-mm-tag k">media queries</span><span class="css-mm-tag k">mobile-first</span><span class="css-mm-tag k">clamp()</span>
    <span class="css-mm-tag k">aspect-ratio</span><span class="css-mm-tag">prefers-color-scheme</span><span class="css-mm-tag">prefers-reduced-motion</span>
    <span class="css-mm-tag a">container queries</span><span class="css-mm-tag a">cqw/cqh</span>
  </div></div>

  <div class="css-mm-cat"><div class="css-mm-name">SELETORES</div><div class="css-mm-tags">
    <span class="css-mm-tag k">tag/class/id</span><span class="css-mm-tag k">combinadores (&gt; ~ +)</span>
    <span class="css-mm-tag">:hover/:focus/:active</span><span class="css-mm-tag">:nth-child</span>
    <span class="css-mm-tag a">:is() :where()</span><span class="css-mm-tag a">:has()</span><span class="css-mm-tag a">:focus-visible</span>
  </div></div>

  <div class="css-mm-cat"><div class="css-mm-name">VARIÁVEIS</div><div class="css-mm-tags">
    <span class="css-mm-tag k">custom properties (--var)</span><span class="css-mm-tag k">var()</span>
    <span class="css-mm-tag">cascata + escopo</span><span class="css-mm-tag a">@property (Houdini)</span>
    <span class="css-mm-tag a">themas via :root</span>
  </div></div>

  <div class="css-mm-cat"><div class="css-mm-name">TIPOGRAFIA</div><div class="css-mm-tags">
    <span class="css-mm-tag k">font-family</span><span class="css-mm-tag k">font-size</span><span class="css-mm-tag k">line-height</span>
    <span class="css-mm-tag">letter-spacing</span><span class="css-mm-tag">text-align</span>
    <span class="css-mm-tag a">text-wrap: balance/pretty</span><span class="css-mm-tag a">font-display: swap</span><span class="css-mm-tag a">variable fonts</span>
  </div></div>

  <div class="css-mm-cat"><div class="css-mm-name">VISUAL</div><div class="css-mm-tags">
    <span class="css-mm-tag k">background</span><span class="css-mm-tag k">border</span><span class="css-mm-tag k">box-shadow</span>
    <span class="css-mm-tag">border-radius</span><span class="css-mm-tag">opacity</span>
    <span class="css-mm-tag">filter (blur, drop-shadow)</span><span class="css-mm-tag a">backdrop-filter</span>
    <span class="css-mm-tag a">clip-path</span><span class="css-mm-tag a">mask</span>
  </div></div>

  <div class="css-mm-cat"><div class="css-mm-name">ANIMAÇÕES</div><div class="css-mm-tags">
    <span class="css-mm-tag k">transition</span><span class="css-mm-tag k">@keyframes</span><span class="css-mm-tag k">animation</span>
    <span class="css-mm-tag k">transform</span><span class="css-mm-tag">cubic-bezier</span>
    <span class="css-mm-tag a">scroll-driven animations</span><span class="css-mm-tag a">view-transitions</span>
  </div></div>

  <div class="css-mm-cat"><div class="css-mm-name">PERFORMANCE</div><div class="css-mm-tags">
    <span class="css-mm-tag k">will-change</span><span class="css-mm-tag k">contain</span>
    <span class="css-mm-tag">compositor (transform, opacity)</span><span class="css-mm-tag">paint vs layout</span>
    <span class="css-mm-tag a">content-visibility: auto</span><span class="css-mm-tag a">contain-intrinsic-size</span>
  </div></div>

  <div class="css-mm-cat"><div class="css-mm-name">ARQUITETURA</div><div class="css-mm-tags">
    <span class="css-mm-tag k">@layer</span><span class="css-mm-tag">BEM</span><span class="css-mm-tag">design tokens</span>
    <span class="css-mm-tag">CSS modules</span><span class="css-mm-tag">utility-first (Tailwind)</span>
    <span class="css-mm-tag a">cascade layers em libs</span><span class="css-mm-tag a">design system completo</span>
  </div></div>

  <div class="css-mm-cat"><div class="css-mm-name">ACESSIBILIDADE</div><div class="css-mm-tags">
    <span class="css-mm-tag k">contrast ratio</span><span class="css-mm-tag k">:focus-visible</span>
    <span class="css-mm-tag">prefers-reduced-motion</span><span class="css-mm-tag">prefers-contrast</span>
    <span class="css-mm-tag a">forced-colors mode</span><span class="css-mm-tag a">accent-color</span>
  </div></div>

  <div class="css-mm-cat"><div class="css-mm-name">MODERNO</div><div class="css-mm-tags">
    <span class="css-mm-tag a">logical properties</span><span class="css-mm-tag a">color-mix()</span><span class="css-mm-tag a">oklch</span>
    <span class="css-mm-tag a">@scope</span><span class="css-mm-tag a">@starting-style</span><span class="css-mm-tag a">popover</span>
    <span class="css-mm-tag a">anchor positioning</span><span class="css-mm-tag a">field-sizing: content</span>
  </div></div>

  <div class="css-mm-leg">
    <span><span class="css-mm-dot" style="background:#7dd3fc"></span>essencial (pleno)</span>
    <span><span class="css-mm-dot" style="background:#94a3b8"></span>importante</span>
    <span><span class="css-mm-dot" style="background:#fca5a5"></span>nível sênior</span>
  </div>
</div>`,
    caption: "12 categorias do ecossistema CSS — da fundação aos recursos de 2024+. Use para auto-avaliar gaps antes de uma entrevista.",
  },
  exercises: [
    {
      level: 'iniciante',
      title: "Card responsivo com Flexbox",
      description: "Crie um card com header (título + ícone), body (texto) e footer (botões). Use flexbox para alinhar elementos. O card deve ter largura fluida com max-width: 400px e centralizar na tela. Adicione hover sutil com transform: translateY(-2px).",
      concepts: ["flexbox", "box-shadow", "transition", "max-width", "border-radius"],
      hint: "Use display: flex; flex-direction: column no card. No header, flex direction row com justify-content: space-between.",
    },
    {
      level: 'intermediario',
      title: "Layout de galeria com Grid",
      description: "Construa uma galeria responsiva onde a primeira imagem ocupa 2 colunas e 2 linhas (destaque), e as outras seguem em grid auto-fit com minmax(150px, 1fr). Use grid-template-areas para nomear o destaque. Adicione gap consistente.",
      concepts: ["grid", "grid-template-areas", "auto-fit", "minmax", "aspect-ratio", "gap"],
      hint: "grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)). Para o destaque: grid-column: span 2; grid-row: span 2.",
    },
    {
      level: 'intermediario',
      title: "Dark mode com Custom Properties",
      description: "Implemente alternância dark/light mode usando CSS variables. Defina tokens em :root e sobrescreva em [data-theme=\"dark\"]. Inclua suporte a prefers-color-scheme: dark como fallback. Anime a transição de cores em 200ms.",
      concepts: ["custom properties", "data attributes", "prefers-color-scheme", "transition", "color tokens"],
      hint: "Crie --bg, --fg, --accent. Use document.documentElement.setAttribute('data-theme', 'dark'). Não esqueça de animar background e color.",
    },
    {
      level: 'senior',
      title: "Design system com @layer e Container Queries",
      description: "Estruture um sistema com 4 layers: reset, tokens, components, utilities. Crie um componente Card que muda layout (vertical → horizontal) baseado no container, não no viewport, usando container queries. Inclua suporte a logical properties para RTL.",
      concepts: ["@layer", "container queries", "logical properties", "design tokens", "cascade architecture"],
      hint: "container-type: inline-size no pai. Defina @layer reset, tokens, components, utilities;. Use margin-inline em vez de margin-left.",
    },
    {
      level: 'senior',
      title: "Animação compositor-friendly com pause em reduced-motion",
      description: "Crie um spinner animado usando apenas transform e opacity (compositor-friendly). Respeite prefers-reduced-motion: reduce desativando animações. Use will-change pontual via JavaScript (apenas durante a animação) para não desperdiçar GPU.",
      concepts: ["@keyframes", "transform", "prefers-reduced-motion", "will-change", "performance"],
      hint: "Anime apenas transform: rotate. Em @media (prefers-reduced-motion: reduce), use animation: none. Aplicar will-change via element.style antes de iniciar.",
    },
  ],
  videos: [
    {
      title: "CSS Specificity (and how to handle it)",
      channel: "Kevin Powell",
      url: "https://www.youtube.com/watch?v=c0kfcP_nD9E",
    },
    {
      title: "Learn Flexbox in 15 Minutes",
      channel: "Web Dev Simplified",
      url: "https://www.youtube.com/watch?v=fYq5PXgSsbE",
    },
    {
      title: "Learn CSS Grid the EASY way",
      channel: "Kevin Powell",
      url: "https://www.youtube.com/watch?v=rg7Fvvl3taU",
    },
    {
      title: "CSS Container Queries — bigger than you think",
      channel: "Kevin Powell",
      url: "https://www.youtube.com/watch?v=gCNMyYr7F6w",
    },
    {
      title: "The Cascade, Inheritance, Specificity",
      channel: "web.dev",
      url: "https://www.youtube.com/watch?v=NqDb27GgsYE",
    },
    {
      title: "Async CSS - The Cascade Layer (@layer) Explained",
      channel: "Una Kravets",
      url: "https://www.youtube.com/watch?v=Lo5tlrlVAeg",
    },
  ],
  resources: [
    {
      title: "MDN — CSS Reference",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
      kind: 'docs',
    },
    {
      title: "CSS-Tricks — guias e Almanac",
      url: "https://css-tricks.com/almanac/",
      kind: 'artigo',
    },
    {
      title: "Every Layout — fundamentos de layout",
      url: "https://every-layout.dev/",
      kind: 'curso',
    },
    {
      title: "CSS for JavaScript Developers (Josh Comeau)",
      url: "https://css-for-js.dev/",
      kind: 'curso',
    },
    {
      title: "Kevin Powell YouTube — CSS de A a Z",
      url: "https://www.youtube.com/@KevinPowell",
      kind: 'video',
    },
    {
      title: "web.dev — Learn CSS",
      url: "https://web.dev/learn/css",
      kind: 'curso',
    },
    {
      title: "Flexbox Froggy + Grid Garden — jogos",
      url: "https://flexboxfroggy.com/",
      kind: 'pratica',
    },
  ],
  codeExamples: [
    {
      title: "Layout responsivo com Grid e clamp() — sem media queries",
      description: "Layout que se adapta de 1 a 4 colunas usando auto-fit + minmax, e tipografia fluida com clamp().",
      code: `/* Grid responsivo SEM media queries */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: clamp(0.5rem, 2vw, 1.5rem);
}

/* Tipografia fluida */
h1 {
  font-size: clamp(1.5rem, 4vw + 1rem, 3rem);
  line-height: 1.2;
  text-wrap: balance; /* equilibra quebras */
}

p {
  font-size: clamp(0.9rem, 1vw + 0.75rem, 1.1rem);
  line-height: 1.65;
  text-wrap: pretty; /* evita órfãs */
  max-width: 65ch; /* leitura confortável */
}

/* Card flexível */
.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1rem, 3vw, 2rem);
  background: var(--card-bg);
  border-radius: 12px;
  aspect-ratio: 4 / 5;
}`,
      language: 'css',
    },
    {
      title: "Animação compositor-friendly com @keyframes",
      description: "Spinner usando apenas transform (rodado pelo compositor, sem reflow). Respeita prefers-reduced-motion.",
      code: `/* Compositor-friendly: apenas transform e opacity */
@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.skeleton {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Respeitar preferência do usuário */
@media (prefers-reduced-motion: reduce) {
  .spinner,
  .skeleton {
    animation: none;
  }
}`,
      language: 'css',
    },
    {
      title: "Dark mode com Custom Properties + prefers-color-scheme",
      description: "Sistema de tema com variáveis CSS e fallback para preferência do sistema. Toggle via data-theme.",
      code: `:root {
  --bg:        #ffffff;
  --fg:        #0f172a;
  --muted:     #64748b;
  --accent:    #ef4444;
  --card:      #f8fafc;
  --border:    #e2e8f0;
}

[data-theme="dark"] {
  --bg:        #0f172a;
  --fg:        #e2e8f0;
  --muted:     #94a3b8;
  --accent:    #ef4444;
  --card:      #1e293b;
  --border:    #334155;
}

/* Fallback para preferência do sistema */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg:     #0f172a;
    --fg:     #e2e8f0;
    --muted:  #94a3b8;
    --card:   #1e293b;
    --border: #334155;
  }
}

body {
  background: var(--bg);
  color: var(--fg);
  transition: background 0.2s, color 0.2s;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--fg);
}`,
      language: 'css',
    },
    {
      title: "Design system com @layer e logical properties",
      description: "Arquitetura escalável usando @layer para evitar guerras de especificidade, com logical properties para suporte RTL.",
      code: `/* Ordem explícita — depois ganha */
@layer reset, tokens, base, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; }
}

@layer tokens {
  :root {
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-4: 1rem;
    --radius:  0.5rem;
    --accent:  #ef4444;
  }
}

@layer base {
  body {
    font-family: 'Inter', system-ui, sans-serif;
    line-height: 1.5;
  }
}

@layer components {
  .btn {
    /* Logical properties — RTL-safe */
    padding-inline: var(--space-4);
    padding-block:  var(--space-2);
    margin-inline-start: var(--space-2);

    border-radius: var(--radius);
    background: var(--accent);
    color: white;
    border: 0;
    cursor: pointer;
  }
}

@layer utilities {
  /* Vence a maioria mesmo sem !important */
  .hidden { display: none; }
  .text-center { text-align: center; }
}`,
      language: 'css',
    },
  ],
}

export default css
