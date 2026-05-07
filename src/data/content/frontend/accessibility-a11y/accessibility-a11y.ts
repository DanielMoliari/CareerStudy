import type { SkillContent } from '@/types'

const accessibilityA11y: SkillContent = {
  tagline: "Tornar a web usável por todos: tecnologia assistiva, WCAG, semântica HTML.",
  why: "Acessibilidade é requisito legal em vários países e afeta SEO. Sênior precisa entender WCAG, ARIA, foco, contraste. Empresas de médio/grande porte cada vez mais avaliam isso em entrevistas.",
  summary: "Acessibilidade (a11y) garante que pessoas com deficiência (visual, motora, cognitiva, auditiva) possam usar a web. Pilares: HTML semântico, ordem de foco, contraste de cor, textos alternativos, suporte a leitor de tela (VoiceOver, NVDA, JAWS). WCAG 2.1/2.2 são as diretrizes internacionais (A, AA, AAA). Ferramentas: axe DevTools, Lighthouse a11y audit, leitores de tela nativos.",
  keypoints: [
    {
      title: "HTML semântico",
      body: "Use elementos corretos: nav, main, aside, header, footer, h1-h6, button, input, label. Leitores de tela usam esses elementos para navegar. div e span não têm semântica — são invisíveis para tecnologia assistiva.",
      code: `<!-- ✗ sem semântica -->
<div onclick="submit()">Enviar</div>

<!-- ✓ semântico: foco, Enter/Space, role button automáticos -->
<button type="submit">Enviar</button>`,
    },
    {
      title: "ARIA",
      body: "ARIA (Accessible Rich Internet Applications) adiciona semântica a elementos sem semântica nativa. Regra 1 da ARIA: use HTML nativo se possível — <button> é sempre melhor que <div role='button'>. ARIA não adiciona comportamento de teclado — só altera como o leitor de tela anuncia o elemento.",
      code: `<!-- ARIA para widget customizado -->
<div
  role="slider"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Volume"
  tabIndex={0}
  onKeyDown={handleKey}  {/* você implementa o teclado */}
/>`,
    },
    {
      title: "Gerenciamento de foco",
      body: "Usuários de teclado navegam por Tab. Todo elemento interativo deve ser focável. :focus-visible mostra outline apenas para navegação por teclado (não mouse). Dialogs devem prender o foco enquanto abertos (focus trap) e restaurar ao fechar.",
      code: `/* ✗ Remove o outline — quebra navegação por teclado */
button:focus { outline: none }

/* ✓ Remove para mouse, mantém para teclado */
button:focus { outline: none }
button:focus-visible { outline: 2px solid #3178C6 }`,
    },
    {
      title: "Contraste de cor",
      body: "WCAG AA exige 4.5:1 para texto normal, 3:1 para texto grande (18pt+ ou 14pt+ bold), 3:1 para elementos de UI (ícones, bordas de input). Ferramentas: Chrome DevTools (picker mostra ratio), axe, Colour Contrast Analyser.",
    },
    {
      title: "Textos alternativos",
      body: "Imagens informativas: alt descritivo e conciso. Imagens decorativas: alt='' (leitor de tela ignora). SVGs inline: aria-label ou <title> dentro do SVG. Ícones sem texto visível ao lado: aria-label no botão ou aria-hidden no ícone + texto visível.",
      code: `{/* Imagem informativa */}
<img src="grafico.png" alt="Vendas cresceram 40% em março" />

{/* Decorativa */}
<img src="divider.png" alt="" />

{/* Ícone em botão */}
<button aria-label="Fechar modal">
  <XIcon aria-hidden="true" />
</button>`,
    },
  ],
  interview: [
    {
      q: "O que é WCAG e quais são os níveis de conformidade?",
      a: "<p>WCAG (Web Content Accessibility Guidelines) são as diretrizes internacionais de acessibilidade do W3C. Organizadas em 4 princípios: Perceptível, Operável, Compreensível, Robusto (POUR).</p><p>Três níveis: <strong>A</strong> (mínimo absoluto), <strong>AA</strong> (padrão da indústria e exigência legal na maioria dos países), <strong>AAA</strong> (mais rigoroso, raramente exigido de forma integral).</p><p>Para a maioria dos projetos: conformidade AA é o objetivo. Inclui contraste 4.5:1, legendas em vídeo, texto alternativo, navegação por teclado completa.</p>",
      tip: "Mencionar os 4 princípios POUR como estrutura de raciocínio sobre a11y é o que diferencia quem estudou o tema de quem só usou axe.",
      level: "pleno",
    },
    {
      q: "Por que usar HTML semântico é a primeira linha de acessibilidade?",
      a: "<p>Elementos HTML nativos têm comportamento de acessibilidade embutido: <button> recebe foco por Tab, responde a Enter/Space, tem role='button' automático. <input> conecta ao <label> com for/htmlFor. <nav> cria landmark de navegação para leitores de tela pularem.</p><p>Substituir por divs exige reimplementar tudo manualmente com ARIA + tabIndex + event listeners. Além de mais código, é fácil errar — e erros de a11y são bugs silenciosos que só usuários de tecnologia assistiva detectam.</p>",
      tip: "A regra prática 'use o elemento HTML que descreve o que o elemento é' cobre 80% dos casos sem precisar saber ARIA.",
      level: "pleno",
    },
    {
      q: "Qual a diferença entre aria-label, aria-labelledby e aria-describedby?",
      a: "<p><strong>aria-label</strong>: texto de label diretamente no atributo. Use quando não há texto visível. Ex: botão com apenas ícone.</p><p><strong>aria-labelledby</strong>: aponta para o ID de outro elemento que serve como label. Preferível quando o label já existe visível na tela — leitores de tela anunciam o texto real.</p><p><strong>aria-describedby</strong>: texto adicional de descrição (não substitui o label). Anunciado após o label — útil para instruções ou mensagens de erro.</p>",
      tip: "aria-labelledby tem preferência sobre aria-label quando há texto visível — associar ao texto real é mais robusto que duplicar em atributo.",
      level: "senior",
    },
    {
      q: "O que é focus trap e quando você precisa implementar?",
      a: "<p>Focus trap prende a navegação por Tab dentro de um elemento enquanto ele está ativo. Necessário em: modais/dialogs, drawers, menus complexos — qualquer componente que ocupa o contexto visual e deve impedir navegação no conteúdo por baixo.</p><p>Implementação: capturar Tab e Shift+Tab dentro do container, redirecionar para o primeiro/último focável quando alcança as bordas. Ao fechar, restaurar o foco ao elemento que abriu (ex: o botão trigger). Radix UI e outras libs headless implementam isso automaticamente.</p>",
      tip: "Citar que Radix UI implementa focus trap automaticamente justifica o uso da lib além de 'acessibilidade' genérico.",
      level: "senior",
    },
    {
      q: "Como você testa acessibilidade em um projeto React?",
      a: "<p>Em camadas: (1) <strong>Linting automático</strong>: eslint-plugin-jsx-a11y detecta problemas em build time (img sem alt, label sem htmlFor, onClick em div). (2) <strong>Testes com jest-axe</strong>: axe-core analisa o DOM renderizado e reporta violações como assertions. (3) <strong>Testes com Testing Library</strong>: queries por role e label (getByRole, getByLabelText) favorecem naturalmente HTML semântico. (4) <strong>Inspeção manual</strong>: navegar por Tab, testar com VoiceOver/NVDA, verificar zoom a 200%.</p>",
      tip: "Mencionar os 4 layers (linting, axe, Testing Library, manual) mostra uma abordagem sistemática — não apenas 'uso axe no DevTools'.",
      level: "senior",
    },
    {
      q: "Como você garante acessibilidade em componentes com ícones SVG?",
      a: "<p>Depende do contexto: (1) <strong>Ícone decorativo</strong> (tem texto ao lado): aria-hidden='true' no SVG — leitor de tela ignora. (2) <strong>Ícone em botão</strong> (sem texto visível): aria-label no botão, aria-hidden no SVG. (3) <strong>SVG inline informativo</strong>: &lt;title&gt; como primeiro filho do SVG + aria-labelledby apontando para o title. (4) Nunca use alt em SVG — o atributo não existe.</p>",
      level: "pleno",
    },
    {
      q: "O que é o Accessibility Tree e como ele se relaciona com o DOM?",
      a: "<p>O Accessibility Tree é uma representação paralela ao DOM visual, construída pelo browser a partir do HTML. Leitores de tela interagem com o Accessibility Tree — não com o DOM visual. Elementos sem semântica (div, span) aparecem no DOM mas são invisíveis no Accessibility Tree. Atributos ARIA modificam como os nós aparecem nessa árvore.</p><p>Inspecionar: Chrome DevTools → Elements → Accessibility panel mostra o Accessibility Tree de cada nó. Útil para depurar por que um leitor de tela não anuncia um elemento corretamente.</p>",
      tip: "Mencionar o Accessibility Tree como conceito separado do DOM mostra entendimento do mecanismo subjacente — diferencia de quem só conhece os atributos.",
      level: "senior",
    },
    {
      q: "Como você lida com conteúdo que atualiza dinamicamente (live regions)?",
      a: "<p>Atualizações dinâmicas (alertas, erros de formulário, status de loading) precisam ser anunciadas sem que o usuário mova o foco. Use aria-live='polite' para atualizações não urgentes (o leitor espera terminar o que está anunciando). Use aria-live='assertive' para alertas críticos que interrompem o anúncio atual.</p><p>Padrão: mantenha um elemento com aria-live no DOM desde o início (não insira dinamicamente), e atualize seu conteúdo de texto quando necessário. Em React, useState para o texto do live region.</p>",
      level: "senior",
    },
    {
      q: "Quais são os landmarks ARIA e por que importam?",
      a: "<p>Landmarks são regiões nomeadas que leitores de tela usam para navegação por atalho de teclado. HTML semântico cria landmarks automaticamente: &lt;nav&gt; → navigation, &lt;main&gt; → main, &lt;header&gt; → banner, &lt;footer&gt; → contentinfo, &lt;aside&gt; → complementary.</p><p>Usuários de leitor de tela podem pular diretamente para &lt;main&gt; para ignorar navegação repetitiva. Uma página deve ter exatamente um &lt;main&gt;. Múltiplos &lt;nav&gt; devem ter aria-label distintos para diferenciá-los.</p>",
      level: "pleno",
    },
    {
      q: "Como implementar um componente de tab acessível do zero?",
      a: "<p>Pattern ARIA Tabs: (1) Container de tabs com role='tablist'. (2) Cada tab: role='tab', aria-selected, aria-controls apontando para o painel. (3) Cada painel: role='tabpanel', aria-labelledby apontando para a tab. (4) Teclado: setas ← → para navegar entre tabs (não Tab), Tab pula para dentro do painel ativo. (5) Tab desativa o resto: tabIndex=-1, tab ativa: tabIndex=0.</p><p>Radix UI Tabs implementa tudo isso — use para evitar reimplementar o pattern.</p>",
      tip: "Detalhar o pattern de teclado com setas (não Tab) entre tabs é o ponto que diferencia quem sabe fazer do zero.",
      level: "senior",
    },
    {
      q: "Como a Lei Brasileira de Inclusão (LBI) se relaciona com acessibilidade web?",
      a: "<p>A LBI (Lei 13.146/2015) garante o direito de acesso à informação e comunicação para pessoas com deficiência. Para web: sites de entidades públicas são obrigados pela eMAG (Modelo de Acessibilidade em Governo Eletrônico). Empresas privadas têm crescente pressão regulatória e reputacional.</p><p>Internacionalmente: ADA (EUA), EN 301 549 (Europa) exigem conformidade WCAG AA. Legalidade a11y é argumento para priorizar em projetos corporativos.</p>",
      level: "pleno",
    },
    {
      q: "O que é texto alternativo de qualidade e como escrevê-lo?",
      a: "<p>Alt text descreve o propósito ou conteúdo informativo da imagem — não literalmente o que está na foto. Regras: (1) Conciso (1-2 frases). (2) Não comece com 'imagem de' ou 'foto de' — o leitor de tela já anuncia que é imagem. (3) Imagem decorativa: alt=''. (4) Gráficos: descreva a tendência ou conclusão, não os números brutos. (5) Logotipo: nome da empresa é suficiente.</p><p>Ruim: 'alt=\"três pessoas sentadas numa mesa com laptops\"'. Bom: 'alt=\"equipe de desenvolvimento em reunião de sprint planning\"'.</p>",
      level: "pleno",
    },
    {
      q: "Como garantir acessibilidade em formulários complexos?",
      a: "<p>(1) Todo input tem &lt;label&gt; associado via htmlFor/for — nunca use placeholder como único label. (2) Erros de validação: aria-describedby no input apontando para a mensagem de erro. (3) Campos obrigatórios: aria-required='true' + indicação visual. (4) Grupos de campos relacionados: &lt;fieldset&gt; com &lt;legend&gt;. (5) Após submit com erro: mova o foco para a primeira mensagem de erro ou para um resumo dos erros.</p>",
      tip: "Mover o foco para o erro após submit inválido é o detalhe que separa a11y básica de a11y completa.",
      level: "senior",
    },
    {
      q: "Como o contraste de cor afeta usuários com baixa visão e como verificar?",
      a: "<p>Usuários com baixa visão, daltonismo ou catarata dependem de contraste suficiente. WCAG AA: 4.5:1 para texto normal (&lt;18pt regular, &lt;14pt bold), 3:1 para texto grande. Texto sobre imagem: garanta contraste em toda a variação da imagem.</p><p>Ferramentas: Chrome DevTools (hover no color picker mostra ratio), axe, Colour Contrast Analyser (captura cores da tela). Teste também em modo de alto contraste do Windows.</p>",
      level: "pleno",
    },
    {
      q: "Como lidar com conteúdo somente para leitores de tela (visually hidden)?",
      a: "<p>Use a classe sr-only (screen-reader only): position: absolute; width: 1px; height: 1px; clip: rect(0, 0, 0, 0); overflow: hidden. Esse padrão remove visualmente mas mantém no Accessibility Tree. Não use display:none ou visibility:hidden — removem do Accessibility Tree também.</p><p>Usos: contexto adicional para labels visuais ambíguos, skip links ('Pular para o conteúdo' — visível ao focar), textos informativos de ícones.</p>",
      level: "pleno",
    },
    {
      q: "O que são skip links e por que são importantes?",
      a: "<p>Skip links são âncoras no início da página que permitem pular diretamente para o conteúdo principal, ignorando menus de navegação repetitivos. Usuários de teclado e leitores de tela precisam navegar por toda a navegação em cada página sem eles.</p><p>Implementação: primeiro elemento do &lt;body&gt;, visível apenas no foco, link para #main-content. Em React, coloque antes do &lt;Nav&gt;. É um critério WCAG 2.4.1 (Nível A).</p>",
      level: "pleno",
    },
    {
      q: "Como ARIA roles interagem com semântica HTML nativa?",
      a: "<p>ARIA role sobrescreve a semântica nativa do elemento para leitores de tela — mas não muda o comportamento do browser. Exemplo: &lt;button role='link'&gt; — o leitor de tela anuncia como link, mas Enter ainda aciona o botão, não navega. Isso cria inconsistência.</p><p>Regra 2 da ARIA: não altere a semântica nativa com ARIA a menos que necessário. &lt;a&gt; com role='button' é problemático — use o elemento correto. ARIA complementa lacunas de HTML, não substitui semântica existente.</p>",
      level: "senior",
    },
    {
      q: "Como implementar um menu dropdown acessível?",
      a: "<p>Pattern ARIA Disclosure: botão trigger com aria-expanded, aria-haspopup='menu'. Menu: role='menu'. Itens: role='menuitem'. Teclado: Enter/Space abre, Esc fecha e retorna foco ao trigger, setas ↑↓ navegam entre itens, Tab fecha o menu.</p><p>Foco ao abrir: mova para o primeiro item via JavaScript. Ao fechar: restaure para o trigger. Radix UI DropdownMenu implementa esse padrão — use para não errar nesses detalhes de interação.</p>",
      level: "senior",
    },
    {
      q: "Como acessibilidade afeta SEO?",
      a: "<p>Há sobreposição significativa: (1) Alt text ajuda crawlers a indexar imagens. (2) Hierarquia de headings (h1-h6) estrutura conteúdo para crawlers e leitores de tela. (3) HTML semântico (nav, main, article) comunica estrutura. (4) Links descritivos em vez de 'clique aqui' beneficiam anchor text no SEO.</p><p>A diferença: SEO foca em bots, a11y foca em humanos. Eles se reforçam mutuamente — boa semântica serve a ambos.</p>",
      level: "pleno",
    },
    {
      q: "Quais são as piores falhas de acessibilidade mais comuns em produção?",
      a: "<p>(1) Imagens sem alt text ou com alt='image'. (2) Formulários sem labels associados (só placeholder). (3) outline: none em elementos focáveis sem alternativa visual. (4) onClick em divs sem role, tabIndex e handler de teclado. (5) Contraste insuficiente em texto sobre gradiente ou imagem. (6) Modais sem focus trap. (7) Mensagens de erro não programaticamente associadas ao campo. (8) Cabeçalhos pulando nível (h2 → h4).</p>",
      tip: "Listar essas 8 falhas na entrevista demonstra que você auditou projetos reais — é conhecimento prático, não só teórico.",
      level: "senior",
    },
  ],
  diagrams: [
    {
      title: "Árvore de acessibilidade — do HTML ao leitor de tela",
      html: `<style>
.a11y-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.a11y-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:12px 14px;font-size:11px}
.a11y-bad{border-color:#ef4444}
.a11y-good{border-color:#4ade80}
.a11y-tag{display:inline-block;font-size:9px;padding:2px 6px;border-radius:3px;margin-bottom:6px}
</style>
<div class="a11y-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">HTML semântico → Accessibility Tree → Leitor de tela</p>
  <div style="display:flex;gap:10px;margin-bottom:12px">
    <div class="a11y-box a11y-bad" style="flex:1">
      <div class="a11y-tag" style="background:#3a0f0f;color:#ef4444">✗ Div sem semântica</div>
      <div style="color:#94a3b8;line-height:2;font-size:10px">
        &lt;<span style="color:#ef4444">div</span> onclick="submit()"&gt;Enviar&lt;/div&gt;<br><br>
        <strong style="color:#ef4444">Accessibility Tree:</strong><br>
        role: <em>none</em> (ignorado)<br>
        focusable: <em>não</em><br>
        keyboard: <em>não responde Enter/Space</em><br>
        Leitor de tela: <em>não anuncia nada</em>
      </div>
    </div>
    <div class="a11y-box a11y-good" style="flex:1">
      <div class="a11y-tag" style="background:#0f3a1a;color:#4ade80">✓ Button semântico</div>
      <div style="color:#94a3b8;line-height:2;font-size:10px">
        &lt;<span style="color:#4ade80">button</span> type="submit"&gt;Enviar&lt;/button&gt;<br><br>
        <strong style="color:#4ade80">Accessibility Tree:</strong><br>
        role: <em>button</em><br>
        focusable: <em>sim (Tab)</em><br>
        keyboard: <em>Enter e Space ativam</em><br>
        Leitor de tela: <em>"Enviar, botão"</em>
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:11px;color:#475569;line-height:1.8">
    <strong style="color:#94a3b8">Regra 1 da ARIA:</strong> se há um elemento HTML nativo que faz o que você precisa, use-o. ARIA complementa — não substitui — HTML semântico e comportamento de teclado nativo.
  </div>
</div>`,
      caption: "O browser constrói um Accessibility Tree a partir do HTML. Leitores de tela navegam nessa árvore — não no DOM visual. Semântica incorreta = invisibilidade para tecnologia assistiva.",
    },
    {
      title: "ARIA labels — aria-label vs aria-labelledby vs aria-describedby",
      html: `<style>
.a11y-aria{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.a11y-aria-card{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:14px;margin-bottom:10px}
.a11y-aria-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700;letter-spacing:.08em;margin-bottom:8px}
</style>
<div class="a11y-aria">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">Quando usar cada atributo de label ARIA</p>
  <div class="a11y-aria-card" style="border-color:#398ccb">
    <div class="a11y-aria-badge" style="background:#0a2039;color:#398ccb">aria-label</div>
    <div style="font-family:'JetBrains Mono',monospace;color:#94a3b8;font-size:10px;line-height:1.8">
      &lt;button <span style="color:#398ccb">aria-label="Fechar modal"</span>&gt;&lt;XIcon aria-hidden /&gt;&lt;/button&gt;<br>
      <span style="color:#475569">// Use quando não há texto visível. Texto na tela ≠ aria-label → inconsistência!</span>
    </div>
  </div>
  <div class="a11y-aria-card" style="border-color:#4ade80">
    <div class="a11y-aria-badge" style="background:#0a3a1a;color:#4ade80">aria-labelledby</div>
    <div style="font-family:'JetBrains Mono',monospace;color:#94a3b8;font-size:10px;line-height:1.8">
      &lt;h2 <span style="color:#4ade80">id="dialog-title"</span>&gt;Confirmar exclusão&lt;/h2&gt;<br>
      &lt;div role="dialog" <span style="color:#4ade80">aria-labelledby="dialog-title"</span>&gt;<br>
      <span style="color:#475569">// Preferível quando texto visível já existe — mais robusto</span>
    </div>
  </div>
  <div class="a11y-aria-card" style="border-color:#f59e0b">
    <div class="a11y-aria-badge" style="background:#3a2d0a;color:#f59e0b">aria-describedby</div>
    <div style="font-family:'JetBrains Mono',monospace;color:#94a3b8;font-size:10px;line-height:1.8">
      &lt;input <span style="color:#f59e0b">aria-describedby="email-error"</span> /&gt;<br>
      &lt;p <span style="color:#f59e0b">id="email-error"</span>&gt;E-mail inválido&lt;/p&gt;<br>
      <span style="color:#475569">// Descrição adicional anunciada APÓS o label — para erros e dicas</span>
    </div>
  </div>
</div>`,
      caption: "aria-label: texto direto no atributo. aria-labelledby: aponta para elemento existente. aria-describedby: informação adicional (erros, dicas) anunciada após o label.",
    },
    {
      title: "Focus management — ordem de Tab e focus trap em modais",
      html: `<style>
.a11y-focus{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.a11y-focus-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:14px;margin-bottom:10px;font-size:11px}
.a11y-focus-step{display:flex;gap:10px;align-items:flex-start;margin-bottom:8px}
.a11y-focus-num{background:#398ccb;color:#fff;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0}
</style>
<div class="a11y-focus">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">Focus trap em modal — ciclo correto de Tab</p>
  <div class="a11y-focus-box">
    <div class="a11y-focus-step">
      <div class="a11y-focus-num">1</div>
      <div style="color:#94a3b8">Usuário pressiona <strong style="color:#e2e8f0">Enter</strong> no botão que abre o modal → modal abre, foco vai para o <strong style="color:#4ade80">primeiro elemento focável</strong> dentro do modal (ex: título ou primeiro botão)</div>
    </div>
    <div class="a11y-focus-step">
      <div class="a11y-focus-num">2</div>
      <div style="color:#94a3b8"><strong style="color:#e2e8f0">Tab</strong> navega pelos elementos dentro do modal em ordem DOM. Ao chegar no último, volta para o primeiro. <strong style="color:#ef4444">Não sai para o conteúdo por baixo.</strong></div>
    </div>
    <div class="a11y-focus-step">
      <div class="a11y-focus-num">3</div>
      <div style="color:#94a3b8"><strong style="color:#e2e8f0">Shift+Tab</strong> navega na direção oposta. Ao chegar no primeiro, vai para o último. Ciclo fechado dentro do modal.</div>
    </div>
    <div class="a11y-focus-step">
      <div class="a11y-focus-num">4</div>
      <div style="color:#94a3b8"><strong style="color:#e2e8f0">Esc</strong> fecha o modal → foco retorna para <strong style="color:#4ade80">o botão que abriu o modal</strong>. Nunca perca o rastro de foco ao fechar!</div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:10px;color:#475569">
    <strong style="color:#94a3b8">Radix UI, Headless UI, Reach UI</strong> implementam focus trap automaticamente. Se criar do zero: use uma biblioteca como focus-trap-react.
  </div>
</div>`,
      caption: "Focus trap é requisito WCAG 2.1 para modais. O foco deve permanecer dentro do dialog até ser fechado, e retornar ao trigger ao fechar.",
    },
  ],
  mnemonics: [
    {
      label: "Os 4 princípios WCAG",
      trick: "POUR",
      explanation: "POUR = Perceptível, Operável, Compreensível, Robusto. Todos os critérios WCAG se encaixam em um desses princípios. Lembrar POUR ajuda a categorizar qualquer problema de acessibilidade e justificar sua correção em entrevista ou code review.",
    },
    {
      label: "Os atributos ARIA para labels",
      trick: "LAD",
      explanation: "LAD = Label (aria-label), Apontador (aria-labelledby), Descrição (aria-describedby). Label: texto direto. Apontador: aponta para outro elemento. Descrição: informação extra após o label. Lembrar LAD evita confundir os três em implementação.",
    },
    {
      label: "Checklist rápido de a11y antes de entregar",
      trick: "FACE",
      explanation: "FACE = Foco visível (focus-visible), Alt text em imagens, Contraste 4.5:1, Elementos semânticos. Rodar FACE mentalmente antes de qualquer PR cobre os 4 erros mais comuns em produção. Se todos os 4 estão OK, você cobriu o essencial.",
    },
  ],
  cheatsheet: {
    title: "Acessibilidade — Referência rápida",
    html: `<style>
.a11y-cs{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0;font-size:11px}
.a11y-cs-section{margin-bottom:18px}
.a11y-cs-title{font-size:9px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:#ef4444;margin-bottom:10px}
.a11y-cs-row{display:flex;gap:8px;margin-bottom:6px;align-items:flex-start}
.a11y-cs-key{color:#f59e0b;min-width:200px;flex-shrink:0}
.a11y-cs-val{color:#94a3b8;line-height:1.5}
.a11y-cs-ok{color:#4ade80}
.a11y-cs-bad{color:#ef4444}
</style>
<div class="a11y-cs">
  <div class="a11y-cs-section">
    <div class="a11y-cs-title">Contraste WCAG AA</div>
    <div class="a11y-cs-row"><span class="a11y-cs-key">Texto normal (&lt;18pt / &lt;14pt bold)</span><span class="a11y-cs-val">Mínimo 4.5:1</span></div>
    <div class="a11y-cs-row"><span class="a11y-cs-key">Texto grande (≥18pt / ≥14pt bold)</span><span class="a11y-cs-val">Mínimo 3:1</span></div>
    <div class="a11y-cs-row"><span class="a11y-cs-key">Elementos de UI (ícones, bordas)</span><span class="a11y-cs-val">Mínimo 3:1</span></div>
  </div>
  <div class="a11y-cs-section">
    <div class="a11y-cs-title">HTML semântico → roles automáticos</div>
    <div class="a11y-cs-row"><span class="a11y-cs-key">&lt;button&gt;</span><span class="a11y-cs-val">role=button, Tab, Enter/Space, foco automático</span></div>
    <div class="a11y-cs-row"><span class="a11y-cs-key">&lt;a href&gt;</span><span class="a11y-cs-val">role=link, Tab, Enter navega</span></div>
    <div class="a11y-cs-row"><span class="a11y-cs-key">&lt;nav&gt;</span><span class="a11y-cs-val">landmark=navigation</span></div>
    <div class="a11y-cs-row"><span class="a11y-cs-key">&lt;main&gt;</span><span class="a11y-cs-val">landmark=main (máximo 1 por página)</span></div>
    <div class="a11y-cs-row"><span class="a11y-cs-key">&lt;input&gt; + &lt;label for&gt;</span><span class="a11y-cs-val">Associação nativa label→input</span></div>
  </div>
  <div class="a11y-cs-section">
    <div class="a11y-cs-title">Regras práticas</div>
    <div class="a11y-cs-row"><span class="a11y-cs-ok">✓</span><span class="a11y-cs-val">:focus-visible em vez de outline:none</span></div>
    <div class="a11y-cs-row"><span class="a11y-cs-ok">✓</span><span class="a11y-cs-val">alt='' em imagens decorativas (não omitir o atributo)</span></div>
    <div class="a11y-cs-row"><span class="a11y-cs-ok">✓</span><span class="a11y-cs-val">aria-live='polite' para atualizações dinâmicas</span></div>
    <div class="a11y-cs-row"><span class="a11y-cs-ok">✓</span><span class="a11y-cs-val">Focus trap em modais; restaurar foco ao trigger ao fechar</span></div>
    <div class="a11y-cs-row"><span class="a11y-cs-bad">✗</span><span class="a11y-cs-val">onclick em div sem role, tabIndex e onKeyDown</span></div>
    <div class="a11y-cs-row"><span class="a11y-cs-bad">✗</span><span class="a11y-cs-val">Placeholder como único label — desaparece ao digitar</span></div>
    <div class="a11y-cs-row"><span class="a11y-cs-bad">✗</span><span class="a11y-cs-val">aria-label inconsistente com texto visível</span></div>
  </div>
</div>`,
    caption: "POUR: Perceptível, Operável, Compreensível, Robusto. Todo critério WCAG se encaixa em um desses princípios.",
  },
  mindmap: {
    title: "Acessibilidade — Mapa mental completo",
    html: `<style>
.a11y-mm{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.a11y-mm-center{background:#ef4444;color:#fff;border-radius:50px;padding:10px 24px;font-weight:800;font-size:14px;text-align:center;display:inline-block}
.a11y-mm-branch{margin-top:16px;display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.a11y-mm-node{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:11px;min-width:140px}
.a11y-mm-node-title{color:#f59e0b;font-weight:700;font-size:10px;margin-bottom:6px}
.a11y-mm-item{color:#94a3b8;margin-bottom:3px;padding-left:8px;border-left:2px solid #334155}
</style>
<div class="a11y-mm">
  <div style="text-align:center;margin-bottom:20px"><div class="a11y-mm-center">Acessibilidade</div></div>
  <div class="a11y-mm-branch">
    <div class="a11y-mm-node">
      <div class="a11y-mm-node-title">Semântica</div>
      <div class="a11y-mm-item">HTML nativo</div>
      <div class="a11y-mm-item">Headings h1-h6</div>
      <div class="a11y-mm-item">Landmarks</div>
      <div class="a11y-mm-item">ARIA roles</div>
    </div>
    <div class="a11y-mm-node">
      <div class="a11y-mm-node-title">ARIA</div>
      <div class="a11y-mm-item">aria-label</div>
      <div class="a11y-mm-item">aria-labelledby</div>
      <div class="a11y-mm-item">aria-describedby</div>
      <div class="a11y-mm-item">aria-live</div>
      <div class="a11y-mm-item">aria-expanded</div>
    </div>
    <div class="a11y-mm-node">
      <div class="a11y-mm-node-title">Foco</div>
      <div class="a11y-mm-item">Tab order</div>
      <div class="a11y-mm-item">:focus-visible</div>
      <div class="a11y-mm-item">Focus trap</div>
      <div class="a11y-mm-item">tabIndex</div>
      <div class="a11y-mm-item">Skip links</div>
    </div>
    <div class="a11y-mm-node">
      <div class="a11y-mm-node-title">Percepção</div>
      <div class="a11y-mm-item">Contraste 4.5:1</div>
      <div class="a11y-mm-item">Alt text</div>
      <div class="a11y-mm-item">Legendas</div>
      <div class="a11y-mm-item">Redimensionamento</div>
    </div>
    <div class="a11y-mm-node">
      <div class="a11y-mm-node-title">Testes</div>
      <div class="a11y-mm-item">eslint-plugin-jsx-a11y</div>
      <div class="a11y-mm-item">jest-axe</div>
      <div class="a11y-mm-item">Testing Library</div>
      <div class="a11y-mm-item">VoiceOver / NVDA</div>
    </div>
    <div class="a11y-mm-node">
      <div class="a11y-mm-node-title">Padrões</div>
      <div class="a11y-mm-item">WCAG 2.1/2.2</div>
      <div class="a11y-mm-item">POUR</div>
      <div class="a11y-mm-item">WAI-ARIA Patterns</div>
      <div class="a11y-mm-item">LBI (Brasil)</div>
    </div>
  </div>
</div>`,
    caption: "Acessibilidade é transversal: afeta semântica, CSS, JavaScript, testes e arquitetura de componentes. WCAG AA é o padrão mínimo para projetos profissionais.",
  },
  exercises: [
    {
      level: "iniciante",
      title: "Auditar e corrigir formulário de login sem acessibilidade",
      description: "Dado um formulário com inputs sem labels, placeholder como único label, botão submit como div com onclick, e outline:none no CSS — corrija todos os problemas. Use eslint-plugin-jsx-a11y para identificar automaticamente. Verifique o resultado navegando somente por teclado.",
      concepts: ["label", "htmlFor", "button", ":focus-visible", "semântica HTML"],
    },
    {
      level: "iniciante",
      title: "Verificar e corrigir contraste de cores",
      description: "Use o Chrome DevTools color picker para verificar o ratio de contraste de 5 combinações de cores do seu projeto. Para cada uma abaixo de 4.5:1, ajuste as cores até atingir conformidade WCAG AA. Documente as mudanças.",
      concepts: ["WCAG AA", "contraste 4.5:1", "Chrome DevTools", "color accessibility"],
    },
    {
      level: "intermediario",
      title: "Criar um componente de modal com focus trap e gerenciamento de foco",
      description: "Implemente um modal que: (1) ao abrir, move o foco para o título ou primeiro botão, (2) mantém Tab e Shift+Tab dentro do modal, (3) fecha com Esc, (4) ao fechar, restaura o foco ao botão trigger. Use role='dialog', aria-modal='true', aria-labelledby. Teste navegando somente por teclado.",
      concepts: ["focus trap", "aria-modal", "aria-labelledby", "Esc handler", "foco"],
    },
    {
      level: "intermediario",
      title: "Adicionar live regions para mensagens de status assíncronas",
      description: "Em um formulário de envio assíncrono, adicione aria-live='polite' para anunciar sucesso/erro sem mover o foco. Garanta que: (1) o elemento com aria-live existe no DOM desde o início, (2) o texto é atualizado via state, (3) a mensagem de erro também é associada ao campo via aria-describedby.",
      concepts: ["aria-live", "aria-describedby", "live regions", "formulários acessíveis"],
    },
    {
      level: "senior",
      title: "Implementar componente de tabs com padrão WAI-ARIA completo",
      description: "Crie um componente de tabs com: role='tablist', role='tab' com aria-selected e aria-controls, role='tabpanel' com aria-labelledby. Teclado: setas ← → navegam entre tabs (roving tabindex), Tab entra no painel ativo. Escreva testes com jest-axe para verificar zero violações.",
      concepts: ["tablist", "tab", "tabpanel", "roving tabindex", "jest-axe", "WAI-ARIA Patterns"],
    },
  ],
  videos: [
    {
      title: "Web Accessibility in 100 Seconds",
      channel: "Fireship",
      url: "https://www.youtube.com/watch?v=jdDajpPKQHA",
      topic: "Visão geral rápida de a11y",
    },
    {
      title: "Learn Accessibility — Google web.dev",
      channel: "Google Chrome Developers",
      url: "https://www.youtube.com/watch?v=1A6SrPwmGpg",
      topic: "Curso completo de a11y com exemplos práticos",
    },
    {
      title: "Screen Reader Crash Course",
      channel: "A11y with Lindsey",
      url: "https://www.youtube.com/watch?v=y0a7MnCeEWE",
      topic: "Como usar VoiceOver para testar a11y",
    },
    {
      title: "WCAG 2.1 Explained — Every Criterion",
      channel: "Deque Systems",
      url: "https://www.youtube.com/watch?v=xpan4CqRQuc",
      topic: "Referência completa dos critérios WCAG",
    },
    {
      title: "Building Accessible React Components",
      channel: "Colby Fayock",
      url: "https://www.youtube.com/watch?v=7dv6DmFDgAI",
      topic: "Acessibilidade em React com exemplos reais",
    },
  ],
  resources: [
    { title: "MDN — Accessibility", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility", kind: "docs" },
    { title: "web.dev — Accessibility", url: "https://web.dev/accessibility/", kind: "docs" },
    { title: "axe DevTools — extensão Chrome", url: "https://www.deque.com/axe/", kind: "pratica" },
    { title: "WCAG 2.1 Quick Reference", url: "https://www.w3.org/WAI/WCAG21/quickref/", kind: "docs" },
    { title: "WAI-ARIA Authoring Practices — patterns de componentes", url: "https://www.w3.org/WAI/ARIA/apg/patterns/", kind: "docs" },
    { title: "a11y Project — Checklist WCAG AA", url: "https://www.a11yproject.com/checklist/", kind: "pratica" },
    { title: "Radix UI — componentes headless acessíveis", url: "https://www.radix-ui.com/", kind: "pratica" },
  ],
  codeExamples: [
    {
      title: "Componente de botão com ícone totalmente acessível",
      code: `// Botão com ícone — três cenários de acessibilidade
import { SearchIcon, CloseIcon } from 'lucide-react'

// 1. Ícone decorativo (texto ao lado)
function SearchButton() {
  return (
    <button type="button">
      <SearchIcon aria-hidden="true" />
      Buscar
    </button>
  )
}

// 2. Ícone em botão (sem texto visível) — aria-label no botão
function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      aria-label="Fechar modal"
      onClick={onClose}
    >
      <CloseIcon aria-hidden="true" />
    </button>
  )
}

// 3. Texto visualmente oculto mas lido pelo leitor de tela
function LoadingButton({ loading }: { loading: boolean }) {
  return (
    <button type="submit" disabled={loading} aria-disabled={loading}>
      {loading && <span className="sr-only">Carregando, aguarde...</span>}
      {loading ? <Spinner aria-hidden="true" /> : 'Salvar'}
    </button>
  )
}

// .sr-only (Tailwind: 'sr-only')
// position: absolute; width: 1px; height: 1px; clip: rect(0, 0, 0, 0);
// overflow: hidden; white-space: nowrap;`,
      language: "typescript",
    },
    {
      title: "Formulário acessível com labels, erros e live region",
      code: `function AccessibleForm() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [status, setStatus] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) {
      setEmailError('Digite um e-mail válido')
      return
    }
    setEmailError('')
    setStatus('Enviando...')
    try {
      await submitForm(email)
      setStatus('Formulário enviado com sucesso!')
    } catch {
      setStatus('Erro ao enviar. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Live region — anuncia status sem mover foco */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {status}
      </div>

      <div>
        {/* Label sempre associado ao input via htmlFor */}
        <label htmlFor="email">
          E-mail <span aria-hidden="true">*</span>
          <span className="sr-only">(obrigatório)</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          aria-required="true"
          aria-invalid={!!emailError}
          aria-describedby={emailError ? 'email-error' : undefined}
        />
        {/* Erro associado ao input via aria-describedby */}
        {emailError && (
          <p id="email-error" role="alert">
            {emailError}
          </p>
        )}
      </div>

      <button type="submit">Enviar</button>
    </form>
  )
}`,
      language: "typescript",
    },
    {
      title: "Componente de modal com focus trap e gerenciamento de foco",
      code: `import { useEffect, useRef } from 'react'

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const firstFocusRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Salvar elemento que abriu o modal
      triggerRef.current = document.activeElement as HTMLElement
      // Mover foco para dentro do modal
      firstFocusRef.current?.focus()
    } else {
      // Restaurar foco ao fechar
      triggerRef.current?.focus()
    }
  }, [isOpen])

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Tab') {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={handleKeyDown}
    >
      <h2 id="modal-title">{title}</h2>
      {children}
      <button ref={firstFocusRef} onClick={onClose} aria-label="Fechar modal">
        ✕
      </button>
    </div>
  )
}`,
      language: "typescript",
    },
  ],
  gotchas: [
    "Remover outline de foco (outline: none) sem substituir por alternativa visual quebra a11y para usuários de teclado. Use :focus-visible para mostrar outline só em navegação por teclado.",
    "role='button' em div não adiciona comportamento de teclado (Enter/Space). Use <button> ou adicione tabIndex + onKeyDown manualmente.",
    "aria-label em elemento interativo substitui qualquer texto visível para o leitor de tela — mantenha consistência entre o que é visto e o que é anunciado.",
    "Omitir alt em imagens (não usar o atributo) faz o leitor de tela anunciar o nome do arquivo. Sempre use alt='' em imagens decorativas.",
    "Inserir um elemento com aria-live dinamicamente não funciona — o leitor de tela já precisa conhecer o elemento quando o atributo é adicionado. Mantenha o elemento no DOM desde o início e atualize apenas o texto.",
  ],
}

export default accessibilityA11y
