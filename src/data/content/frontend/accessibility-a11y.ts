import type { SkillContent } from '@/types'

const accessibilityA11y: SkillContent = {
    tagline: "Tornar a web usável por todos: tecnologia assistiva, WCAG, semântica HTML.",
    why: "Acessibilidade é requisito legal em vários países e afeta SEO. Sênior precisa entender WCAG, ARIA, foco, contraste. Empresas de médio/grande porte cada vez mais avaliam isso em entrevistas.",
    summary: "Acessibilidade (a11y) garante que pessoas com deficiência (visual, motora, cognitiva, auditiva) possam usar a web. Pilares: HTML semântico, ordem de foco, contraste de cor, textos alternativos, suporte a leitor de tela (VoiceOver, NVDA, JAWS). WCAG 2.1/2.2 são as diretrizes internacionais (A, AA, AAA). Ferramentas: axe DevTools, Lighthouse a11y audit, leitores de tela nativos.",
    keypoints: [
      { title: "HTML semântico", body: "Use elementos corretos: nav, main, aside, header, footer, h1-h6, button, input, label. Leitores de tela usam esses elementos para navegar. div e span não têm semântica — são invisíveis para tecnologia assistiva.", code: `<!-- ✗ sem semântica -->
<div onclick="submit()">Enviar</div>

<!-- ✓ semântico: foco, Enter/Space, role button automáticos -->
<button type="submit">Enviar</button>` },
      { title: "ARIA", body: "ARIA (Accessible Rich Internet Applications) adiciona semântica a elementos sem semântica nativa. Regra 1 da ARIA: use HTML nativo se possível — <button> é sempre melhor que <div role='button'>. ARIA não adiciona comportamento de teclado — só altera como o leitor de tela anuncia o elemento.", code: `<!-- ARIA para widget customizado -->
<div
  role="slider"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Volume"
  tabIndex={0}
  onKeyDown={handleKey}  {/* você implementa o teclado */}
/>` },
      { title: "Gerenciamento de foco", body: "Usuários de teclado navegam por Tab. Todo elemento interativo deve ser focável. :focus-visible mostra outline apenas para navegação por teclado (não mouse). Dialogs devem prender o foco enquanto abertos (focus trap) e restaurar ao fechar.", code: `/* ✗ Remove o outline — quebra navegação por teclado */
button:focus { outline: none }

/* ✓ Remove para mouse, mantém para teclado */
button:focus { outline: none }
button:focus-visible { outline: 2px solid #3178C6 }` },
      { title: "Contraste de cor", body: "WCAG AA exige 4.5:1 para texto normal, 3:1 para texto grande (18pt+ ou 14pt+ bold), 3:1 para elementos de UI (ícones, bordas de input). Ferramentas: Chrome DevTools (picker mostra ratio), axe, Colour Contrast Analyser." },
      { title: "Textos alternativos", body: "Imagens informativas: alt descritivo e conciso. Imagens decorativas: alt='' (leitor de tela ignora). SVGs inline: aria-label ou <title> dentro do SVG. Ícones sem texto visível ao lado: aria-label no botão ou aria-hidden no ícone + texto visível.", code: `{/* Imagem informativa */}
<img src="grafico.png" alt="Vendas cresceram 40% em março" />

{/* Decorativa */}
<img src="divider.png" alt="" />

{/* Ícone em botão */}
<button aria-label="Fechar modal">
  <XIcon aria-hidden="true" />
</button>` },
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
    ],
    gotchas: [
      "Remover outline de foco (outline: none) sem substituir por alternativa visual quebra a11y para usuários de teclado. Use :focus-visible para mostrar outline só em navegação por teclado.",
      "role='button' em div não adiciona comportamento de teclado (Enter/Space). Use <button> ou adicione tabIndex + onKeyDown manualmente.",
      "aria-label em elemento interativo substitui qualquer texto visível para o leitor de tela — mantenha consistência entre o que é visto e o que é anunciado.",
    ],
    resources: [
      { title: "MDN — Accessibility", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility", kind: "docs" },
      { title: "web.dev — Accessibility", url: "https://web.dev/accessibility/", kind: "docs" },
      { title: "axe DevTools", url: "https://www.deque.com/axe/", kind: "pratica" },
      { title: "WCAG 2.1 Quick Reference", url: "https://www.w3.org/WAI/WCAG21/quickref/", kind: "docs" },
    ],
}

export default accessibilityA11y
