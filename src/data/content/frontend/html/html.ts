import type { SkillContent } from '@/types'

const html: SkillContent = {
  tagline: 'A linguagem de marcação que estrutura e dá semântica ao conteúdo da web.',
  why: 'HTML semântico correto é a fundação de acessibilidade, SEO e compatibilidade entre dispositivos. A maioria dos erros de a11y e de ranqueamento vêm de HTML não-semântico ou mal-estruturado — um problema que nenhuma camada de CSS ou JavaScript consegue compensar.',

  gotchas: [
    'Usar <div> e <span> para tudo perde semântica. Use nav, main, article, section, header, footer, h1-h6, button, input, label — o browser e os leitores de tela dependem disso.',
    'label sem for/htmlFor (ou sem input filho) não conecta ao input — clicar no label não foca o campo.',
    'Imagens sem alt são inacessíveis para leitores de tela. alt="" para decorativas, alt descritivo para informativas.',
    'tabindex="0" torna elemento focável via teclado. tabindex="-1" remove do fluxo de Tab mas permite foco programático. Evite tabindex > 0 — quebra a ordem natural.',
    'DOCTYPE não é uma tag HTML — é uma instrução para o browser usar modo padrão e não quirks mode.',
    'charset deve ser o primeiro elemento dentro de <head> — antes de title e qualquer meta.',
    'Headings (h1-h6) são hierarquia de estrutura de documento, não ferramentas de estilo. Nunca pule níveis (h1 → h3).',
    'O atributo async carrega e executa o script de forma independente (pode quebrar ordem). defer executa depois que o HTML foi parseado. Sem nenhum dos dois, o parser para até o script executar.',
  ],

  // ── INTERVIEW ──────────────────────────────────────────────────────────────
  interview: [
    {
      level: 'senior',
      q: 'O que é o Critical Rendering Path e quais elementos HTML o afetam?',
      a: '<p>O <strong>Critical Rendering Path</strong> é a sequência de passos que o browser percorre do HTML bruto até os pixels na tela: Parse HTML → Build DOM → Parse CSS → Build CSSOM → Combine → Layout → Paint → Composite.</p><p>Elementos HTML que bloqueiam ou afetam esse caminho:</p><ul><li><code>&lt;script&gt;</code> sem <code>async</code> ou <code>defer</code> bloqueia o parser — o browser para de construir o DOM até o script terminar de baixar e executar.</li><li><code>&lt;link rel="stylesheet"&gt;</code> não bloqueia o parser HTML mas bloqueia o render — a página fica em branco até o CSSOM estar pronto.</li><li><code>&lt;link rel="preload"&gt;</code> sinaliza recursos críticos para download antecipado sem bloquear o render.</li><li><code>&lt;img loading="lazy"&gt;</code> adia o carregamento de imagens fora da viewport.</li></ul>',
      tip: 'Mencione a distinção entre "bloquear o parser" (scripts síncronos) e "bloquear o render" (stylesheets). São mecanismos diferentes.',
    },
    {
      level: 'senior',
      q: 'Explique a diferença entre async e defer em scripts. Quando usar cada um?',
      a: '<p>Ambos fazem download paralelo ao parsing do HTML. A diferença é <strong>quando executam</strong>:</p><ul><li><code>async</code>: executa assim que termina o download, interrompendo o parser. Ordem não é garantida entre scripts async. Use para scripts independentes (analytics, ads).</li><li><code>defer</code>: executa depois que o HTML foi completamente parseado, antes do evento DOMContentLoaded. A ordem entre scripts defer é preservada. Use para scripts que dependem do DOM ou entre si.</li><li>Sem nenhum dos dois: o parser para completamente até o script baixar e executar — o pior cenário para performance.</li></ul>',
      tip: 'A pergunta esconde uma armadilha: async não garante ordem entre scripts. Se você tem script A que precisa estar antes do B, use defer, não async.',
    },
    {
      level: 'senior',
      q: 'Como o HTML semântico impacta SEO e acessibilidade ao mesmo tempo?',
      a: '<p>HTML semântico cria o que se chama de <strong>Accessibility Tree</strong> — uma representação paralela ao DOM que leitores de tela (JAWS, NVDA, VoiceOver) usam para narrar a página.</p><p>Impactos concretos:</p><ul><li><code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;aside&gt;</code> criam landmarks que permitem navegação por atalho em leitores de tela.</li><li>Hierarquia de headings (h1→h6) fornece outline do documento — crawlers do Google e leitores de tela usam a mesma hierarquia.</li><li><code>&lt;button&gt;</code> e <code>&lt;a&gt;</code> têm roles implícitos — um <code>&lt;div role="button"&gt;</code> precisa de <code>tabindex</code>, eventos de teclado, e ARIA extra para replicar o comportamento nativo.</li><li>Google usa o Accessibility Tree no processo de indexação — semântica ruim prejudica diretamente o ranqueamento.</li></ul>',
      tip: 'O argumento mais forte: "o Accessibility Tree que o leitor de tela usa é o mesmo que o Google usa para indexar." Uma implementação serve dois objetivos.',
    },
    {
      level: 'senior',
      q: 'O que são Web Components? Explique Custom Elements, Shadow DOM e Slots.',
      a: '<p><strong>Web Components</strong> são um conjunto de APIs nativas do browser para criar elementos HTML reutilizáveis e encapsulados:</p><ul><li><strong>Custom Elements</strong>: <code>customElements.define("meu-btn", MinhaClasse)</code> registra um elemento novo. A classe estende HTMLElement e usa callbacks como <code>connectedCallback</code>, <code>attributeChangedCallback</code>.</li><li><strong>Shadow DOM</strong>: árvore DOM privada encapsulada dentro do elemento. CSS interno não vaza para fora, CSS externo não entra (a menos que use custom properties). <code>element.attachShadow({mode: "open"})</code>.</li><li><strong>Slots</strong>: mecanismo de composição análogo ao children do React. <code>&lt;slot name="header"&gt;</code> no template, <code>&lt;span slot="header"&gt;</code> no consumer. Permitem injetar conteúdo sem quebrar o encapsulamento.</li><li><strong>HTML Templates</strong>: <code>&lt;template&gt;</code> é parsed mas não renderizado. <code>template.content.cloneNode(true)</code> para instanciar.</li></ul>',
      tip: 'Shadow DOM "open" vs "closed": open permite acesso pelo JavaScript do host via element.shadowRoot. Closed retorna null — nem código externo consegue acessar. Closed é raro e dificulta dev tools.',
    },
    {
      level: 'senior',
      q: 'O que é quirks mode e como o DOCTYPE evita que o browser entre nele?',
      a: '<p>Quando o browser não encontra um DOCTYPE válido (ou encontra um DOCTYPE antigo/malformado), ele entra em <strong>quirks mode</strong> — emulando comportamentos bugados de browsers antigos (IE5, Netscape 4) para não quebrar sites legados.</p><p>No quirks mode:</p><ul><li>Box model volta ao IE5 (border e padding incluídos na largura declarada, sem <code>box-sizing: border-box</code>).</li><li>Certos comportamentos de CSS e layout mudam substancialmente.</li><li>A propriedade <code>document.compatMode</code> retorna "BackCompat" no quirks mode e "CSS1Compat" no modo padrão.</li></ul><p><code>&lt;!DOCTYPE html&gt;</code> é o DOCTYPE do HTML5 — simples, sem URL, sem versão. Garante modo padrão em todos os browsers modernos.</p>',
      tip: 'Mencione document.compatMode como forma de detectar o modo em runtime — útil para debug de comportamentos estranhos em sites legados.',
    },
    {
      level: 'senior',
      q: 'Como implementar structured data (JSON-LD) no HTML e por que isso impacta SEO?',
      a: '<p><strong>Structured Data</strong> comunica aos mecanismos de busca o significado semântico do conteúdo — além da marcação visual. O formato preferido pelo Google é <strong>JSON-LD</strong> dentro de uma tag <code>&lt;script type="application/ld+json"&gt;</code> no <code>&lt;head&gt;</code>.</p><pre><code>{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Título do artigo",\n  "author": { "@type": "Person", "name": "Nome" },\n  "datePublished": "2024-01-15"\n}</code></pre><p>Benefícios concretos: rich results (estrelas de avaliação, FAQs expandidas, breadcrumbs) no SERP, melhor entendimento da entidade, maior CTR. Schema.org define os tipos (Article, Product, FAQPage, BreadcrumbList, etc.).</p>',
      tip: 'JSON-LD é preferível a Microdata e RDFa porque pode ser injetado dinamicamente via JavaScript sem alterar a estrutura HTML visível — mais fácil de manter.',
    },
    {
      level: 'senior',
      q: 'Explique resource hints: preload, prefetch, preconnect e dns-prefetch. Qual a diferença?',
      a: '<ul><li><strong>preload</strong>: recurso necessário para a página ATUAL, alta prioridade, download imediato. Use para fontes críticas, scripts above-the-fold, CSS de primeiro render. Requer <code>as</code> attribute para priorização correta.</li><li><strong>prefetch</strong>: recurso para navegação FUTURA, baixa prioridade, download quando o browser estiver ocioso. Use para páginas do próximo passo do usuário.</li><li><strong>preconnect</strong>: estabelece a conexão TCP+TLS com a origem antecipadamente, sem baixar recurso específico. Economiza 150-300ms de latência de handshake. Use para origens de fontes, CDNs, APIs.</li><li><strong>dns-prefetch</strong>: apenas resolve o DNS (sem TCP/TLS). Mais leve que preconnect. Use quando preconnect seria exagerado (origems que você não tem certeza que vai usar).</li></ul>',
      tip: 'Armadilha comum: preload sem usar o recurso na mesma página gera warning no console e desperdiça largura de banda. O browser baixa e descarta. Prefetch não gera warning porque é oportunístico.',
    },
    {
      level: 'pleno',
      q: 'Qual a diferença entre <section>, <article>, <div> e <main>? Quando usar cada um?',
      a: '<ul><li><code>&lt;main&gt;</code>: conteúdo principal único da página (deve haver apenas um, sem nav, header, footer). Landmark de acessibilidade. Screen readers usam para pular para o conteúdo principal.</li><li><code>&lt;article&gt;</code>: conteúdo independente que faz sentido fora do contexto da página (post de blog, card de produto, comentário, tweet). Pode ter seu próprio header, footer, section.</li><li><code>&lt;section&gt;</code>: agrupamento temático de conteúdo com heading. Deve ter h1-h6 como filho direto ou descendente. Use quando não for article, nav, aside, ou main.</li><li><code>&lt;div&gt;</code>: sem semântica alguma. Use apenas para agrupamento de layout quando nenhum elemento semântico se aplica.</li></ul>',
      tip: 'Pergunta de teste: "um artigo de blog pode ter seções (section) dentro, e uma section pode conter múltiplos articles?" Sim para ambos. A hierarquia é flexível — semântica guia a escolha.',
    },
    {
      level: 'pleno',
      q: 'Como funciona o sistema de formulários HTML? Explique validation nativa.',
      a: '<p>O browser oferece validação nativa sem JavaScript via atributos:</p><ul><li><code>required</code>: campo obrigatório.</li><li><code>type="email"</code>, <code>type="url"</code>, <code>type="number"</code>: validação de formato.</li><li><code>pattern</code>: regex personalizada (ex: <code>pattern="[A-Z]{3}"</code>).</li><li><code>minlength</code>/<code>maxlength</code>: comprimento de texto.</li><li><code>min</code>/<code>max</code>: faixa numérica/data.</li></ul><p>A API de Constraint Validation expõe <code>input.validity</code> (ValidityState), <code>input.validationMessage</code> e <code>input.setCustomValidity(msg)</code> para customizar mensagens. <code>novalidate</code> no form desabilita a validação nativa para tomar controle via JS.</p>',
      tip: 'Muitos devs usam novalidate + JS para tudo, perdendo a validação nativa gratuita e acessível. A nativa funciona sem JS, funciona com leitores de tela, e é zero-bundle-size.',
    },
    {
      level: 'pleno',
      q: 'O que é ARIA? Quando usar e quando NÃO usar?',
      a: '<p><strong>ARIA (Accessible Rich Internet Applications)</strong> é um conjunto de atributos para melhorar acessibilidade quando o HTML semântico nativo não é suficiente.</p><p>As três categorias:</p><ul><li><strong>role</strong>: define o papel do elemento (role="dialog", role="tablist", role="alertdialog").</li><li><strong>aria-* properties</strong>: informação estática (aria-label, aria-labelledby, aria-describedby, aria-required).</li><li><strong>aria-* states</strong>: estado dinâmico (aria-expanded, aria-selected, aria-disabled, aria-hidden).</li></ul><p>A regra de ouro: <strong>"Primeira regra da ARIA: não use ARIA."</strong> Sempre prefira o elemento HTML nativo equivalente. Um <code>&lt;button&gt;</code> não precisa de role="button". Use ARIA somente para widgets customizados sem equivalente HTML (tabs, combobox, treegrid).</p>',
      tip: 'ARIA "bom demais" é tão danoso quanto ausente. Atributos conflitantes ou incorretos confundem leitores de tela mais do que ausência de ARIA.',
    },
    {
      level: 'pleno',
      q: 'Explique meta viewport e como ele afeta layout em mobile.',
      a: '<code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code> instrui o browser mobile a usar a largura real do dispositivo como largura do viewport, em vez do viewport virtual padrão de 980px (usado para renderizar sites desktop sem essa tag).<br/><p>Sem essa meta tag:</p><ul><li>O browser usa 980px de largura virtual, exibe a página toda e a encolhe para caber na tela.</li><li>Todo texto fica ilegível sem zoom manual.</li><li>Media queries não funcionam como esperado.</li></ul><p>Com <code>initial-scale=1</code>: escala inicial é 1:1, sem zoom. <code>maximum-scale=1</code> é <strong>prejudicial para acessibilidade</strong> — impede que o usuário faça zoom. Evite.</p>',
      tip: 'Nunca use maximum-scale=1 ou user-scalable=no — é violação da WCAG 1.4.4. Usuários com baixa visão precisam fazer zoom.',
    },
    {
      level: 'pleno',
      q: 'Como usar <figure>, <figcaption> e <picture> corretamente?',
      a: '<p><code>&lt;figure&gt;</code> agrupa conteúdo auto-contido com legenda — não apenas imagens, mas também código (<code>&lt;pre&gt;</code>), gráficos SVG, áudio, vídeo.</p><p><code>&lt;figcaption&gt;</code> é a legenda do figure (primeiro ou último filho). Referenciada automaticamente por leitores de tela como descrição do conteúdo do figure.</p><p><code>&lt;picture&gt;</code> é um container para múltiplos <code>&lt;source&gt;</code> com art direction ou formatos alternativos:</p><pre><code>&lt;picture&gt;\n  &lt;source media="(min-width: 800px)" srcset="large.webp" type="image/webp"&gt;\n  &lt;source media="(min-width: 800px)" srcset="large.jpg"&gt;\n  &lt;img src="fallback.jpg" alt="Descrição"&gt;\n&lt;/picture&gt;</code></pre><p>O <code>&lt;img&gt;</code> dentro de <code>&lt;picture&gt;</code> é obrigatório — é o fallback e onde fica o alt.</p>',
      tip: 'A diferença entre srcset em img e picture: srcset em img é sugestão de resolução (browser decide). picture é direção de arte — você decide qual imagem carregar por viewport.',
    },
    {
      level: 'pleno',
      q: 'O que é tabindex e como gerenciar o foco corretamente em aplicações SPA?',
      a: '<p><code>tabindex</code> controla se e em que ordem um elemento participa do fluxo de Tab:</p><ul><li><code>tabindex="0"</code>: elemento entra no fluxo natural de Tab (na ordem do DOM).</li><li><code>tabindex="-1"</code>: elemento pode receber foco via JavaScript (<code>el.focus()</code>) mas não via Tab. Essencial para dialogs, modais.</li><li><code>tabindex="N"</code> (N > 0): força ordem absoluta — evitar, quebra expectativa de usuário.</li></ul><p>Em SPAs, desafios específicos:</p><ul><li>Após navegação de rota, o foco permanece onde estava. Deve-se mover o foco para o <code>&lt;main&gt;</code> ou heading da nova página.</li><li>Ao abrir modal: mover foco para o primeiro elemento focável dentro. Ao fechar: devolver o foco ao elemento que abriu.</li><li>Focus trap em modais: interceptar Tab e Shift+Tab para não deixar foco escapar do modal.</li></ul>',
      tip: 'WCAG 2.4.3: foco deve seguir a ordem lógica do conteúdo. Em SPAs sem gerenciamento de foco, usuários de teclado perdem completamente a referência após cada navegação.',
    },
    {
      level: 'pleno',
      q: 'Qual a diferença entre <b>/<i> e <strong>/<em>? Quando usar cada um?',
      a: '<ul><li><code>&lt;strong&gt;</code>: importância semântica elevada (alerta, aviso, informação crítica). Leitores de tela podem enfatizar a voz.</li><li><code>&lt;em&gt;</code>: ênfase semântica que muda o significado da frase ("eu <em>nunca</em> disse isso" vs "eu nunca <em>disse</em> isso").</li><li><code>&lt;b&gt;</code>: destaque visual sem importância semântica (palavra-chave em glossário, nome de produto em review). Puramente apresentacional.</li><li><code>&lt;i&gt;</code>: texto em registro diferente — termo técnico, nome de obra, expressão estrangeira, pensamento. Sem ênfase semântica.</li></ul>',
      tip: 'Regra prática: se o destaque muda a semântica da frase, use strong/em. Se é só visual, use b/i (ou CSS font-weight/font-style via span).',
    },
    {
      level: 'pleno',
      q: 'Como funciona lazy loading nativo no HTML? Qual o impacto no LCP?',
      a: '<p><code>loading="lazy"</code> nos elementos <code>&lt;img&gt;</code> e <code>&lt;iframe&gt;</code> adia o carregamento até o elemento se aproximar da viewport (threshold calculado pelo browser).</p><p>Impactos no Core Web Vitals:</p><ul><li>Reduz tamanho inicial do payload de rede → melhora LCP se a imagem LCP não estiver lazy-loaded.</li><li><strong>Armadilha crítica</strong>: nunca use <code>loading="lazy"</code> na imagem hero/LCP! Isso atrasa exatamente o recurso que mais afeta a nota de LCP.</li><li>Use <code>loading="eager"</code> (default) ou <code>&lt;link rel="preload"&gt;</code> para a imagem above-the-fold principal.</li><li><code>fetchpriority="high"</code> instrui o browser a dar prioridade máxima ao download de uma imagem específica.</li></ul>',
      tip: '"Mas eu coloquei lazy em todas as imagens para otimizar!" — Candidato que não sabe a armadilha do LCP. Lazy no hero é o erro mais comum de performance que escondido atrás de boas intenções.',
    },
    {
      level: 'pleno',
      q: 'Explique como o HTML5 Canvas funciona. Quando usar Canvas vs SVG?',
      a: '<p><strong>Canvas</strong> é uma área de bitmap onde você pinta pixel a pixel via JavaScript (API 2D ou WebGL). Uma vez pintado, o browser não sabe mais o que existe ali — sem DOM interno, sem eventos nativos, sem acessibilidade implícita.</p><p><strong>SVG</strong> é markup vetorial que vira DOM — cada elemento é um nó, pode receber eventos, ter estilos CSS, ser animado e é acessível.</p><table><tr><th>Critério</th><th>Canvas</th><th>SVG</th></tr><tr><td>Muitos elementos (10k+)</td><td>✓ melhor</td><td>✗ lento</td></tr><tr><td>Acessibilidade nativa</td><td>✗</td><td>✓</td></tr><tr><td>Escalabilidade sem blur</td><td>✗</td><td>✓</td></tr><tr><td>Jogos / efeitos</td><td>✓</td><td>✗</td></tr><tr><td>Gráficos de dados</td><td>Depende</td><td>Preferível</td></tr></table>',
      tip: 'Se você precisa de acessibilidade (gráficos para relatórios, diagramas informativos), SVG é o único que funciona nativamente. Canvas precisa de ARIA manual e é difícil de manter acessível.',
    },
    {
      level: 'senior',
      q: 'Explique o HTML template element e como usá-lo com Web Components.',
      a: '<p>O elemento <code>&lt;template&gt;</code> é parsed pelo browser mas <strong>não renderizado</strong> — seu conteúdo fica inerte (scripts não executam, imagens não baixam, estilos não aplicam). É uma "planta" para instâncias reutilizáveis.</p><pre><code>&lt;template id="meu-card"&gt;\n  &lt;style&gt;\n    :host { display: block; }\n  &lt;/style&gt;\n  &lt;div class="card"&gt;\n    &lt;slot name="title"&gt;&lt;/slot&gt;\n  &lt;/div&gt;\n&lt;/template&gt;</code></pre><p>Para usar:</p><pre><code>const tmpl = document.getElementById("meu-card");\nconst clone = tmpl.content.cloneNode(true);\nshadowRoot.appendChild(clone);</code></pre><p>Combinado com Custom Elements e Shadow DOM, template é o mecanismo de definição de componentes nativos — sem framework, zero-bundle, compatível com todos os frameworks.</p>',
      tip: 'Diferença importante: template.content é um DocumentFragment, não um Element. cloneNode(true) é necessário — não appendChildren diretamente, pois a segunda instância estaria vazia.',
    },
    {
      level: 'senior',
      q: 'O que é o atributo crossorigin e quando é obrigatório?',
      a: '<p><code>crossorigin</code> em <code>&lt;script&gt;</code>, <code>&lt;link&gt;</code> e <code>&lt;img&gt;</code> controla como o browser lida com requisições cross-origin para esses recursos.</p><p>Valores:</p><ul><li><code>crossorigin="anonymous"</code>: envia requisição sem credenciais (cookies, certs). O servidor precisa responder com CORS headers.</li><li><code>crossorigin="use-credentials"</code>: envia credenciais. Servidor precisa de <code>Access-Control-Allow-Credentials: true</code> e não pode usar wildcard no origin.</li></ul><p>Casos onde é obrigatório:</p><ul><li><code>&lt;link rel="preload" as="font"&gt;</code> de origem cross-origin — sem crossorigin, o browser baixa a fonte duas vezes (preload + uso real).</li><li><code>&lt;script&gt;</code> com <code>type="module"</code> — módulos sempre seguem CORS.</li><li>Canvas com imagem cross-origin (<code>canvas.toDataURL()</code> lança SecurityError sem crossorigin na imagem).</li></ul>',
      tip: 'A pegadinha mais frequente: preload de fonte sem crossorigin="anonymous" gera dois requests — um do preload (sem CORS) e um do CSS (com CORS) que não aproveita o cache.',
    },
    {
      level: 'senior',
      q: 'Como funciona internacionalização em HTML? (lang, dir, charset, hreflang)',
      a: '<p>HTML oferece mecanismos nativos de i18n:</p><ul><li><code>lang</code> no <code>&lt;html&gt;</code>: indica o idioma primário do documento (BCP 47: "pt-BR", "en-US"). Afeta pronúncia em leitores de tela, quebra de linha, seleção de fonte. Pode ser sobrescrito em qualquer elemento filho.</li><li><code>dir</code>: direção do texto. "ltr" (padrão), "rtl" (árabe, hebraico), "auto" (browser detecta por Unicode bidi). Afeta layout inteiro — melhor definir no html.</li><li><code>charset</code>: <code>&lt;meta charset="utf-8"&gt;</code> deve ser o primeiro elemento do head. UTF-8 suporta todos os caracteres Unicode — padrão para web moderna.</li><li><code>hreflang</code> em <code>&lt;link rel="alternate"&gt;</code>: sinaliza para o Google a versão de idioma/região de cada URL. Essencial para sites multilíngues evitarem conteúdo duplicado.</li></ul>',
      tip: 'Sem lang correto, leitores de tela usam o idioma configurado pelo usuário para pronunciar TUDO — incluindo texto em outro idioma. Resultado: pronúncia ininteligível de texto em inglês para um usuário com VoiceOver em pt-BR.',
    },
    {
      level: 'pleno',
      q: 'Explique a diferença entre block, inline e inline-block no fluxo normal do documento.',
      a: '<p>O <strong>fluxo normal</strong> é como elementos são posicionados antes de qualquer CSS:</p><ul><li><strong>Block</strong> (div, p, section, h1-h6): começa em nova linha, ocupa toda a largura disponível. Aceita width, height, margin vertical.</li><li><strong>Inline</strong> (span, a, strong, em): flui dentro do texto, não causa nova linha. Ignora width/height e margin-top/bottom. Aceita apenas margin/padding horizontal.</li><li><strong>Inline-block</strong>: flui como inline (na linha do texto) mas aceita width, height e margin em todos os lados. Útil para botões em linha, badges.</li></ul><p>A confusão mais comum: <code>padding-top</code> em elemento inline visualmente parece funcionar (o background expande), mas não empurra elementos ao redor — só inline-block/block fazem isso.</p>',
      tip: 'Perguntar "por que o margin-top não está funcionando no meu span?" é clássico. A resposta é que span é inline por padrão.',
    },
    {
      level: 'pleno',
      q: 'O que são Open Graph e Twitter Card meta tags? Por que são importantes?',
      a: '<p><strong>Open Graph</strong> (criado pelo Facebook, adotado amplamente) controla como uma URL aparece quando compartilhada em redes sociais e apps de mensagem:</p><pre><code>&lt;meta property="og:title" content="Título da Página"&gt;\n&lt;meta property="og:description" content="Descrição"&gt;\n&lt;meta property="og:image" content="https://..."&gt;\n&lt;meta property="og:url" content="https://..."&gt;\n&lt;meta property="og:type" content="website"&gt;</code></pre><p><strong>Twitter Cards</strong> (mesmo propósito, namepsace diferente): <code>name="twitter:card"</code>, <code>name="twitter:title"</code>, etc. Twitter lê og: como fallback.</p><p>Por que importam: sem essas tags, a preview do link usa título padrão, sem imagem, sem descrição controlada — resultando em CTR muito menor em compartilhamentos.</p>',
      tip: 'og:image deve ter pelo menos 1200x630px e < 1MB. Facebook, LinkedIn e WhatsApp possuem caches agressivos — use og:image:url com cache-busting quando precisar atualizar.',
    },
    {
      level: 'pleno',
      q: 'Como usar <datalist> e qual a diferença para <select>?',
      a: '<p><code>&lt;datalist&gt;</code> fornece sugestões de autocomplete para um <code>&lt;input&gt;</code> associado via atributo <code>list</code>:</p><pre><code>&lt;input list="cidades" name="cidade"&gt;\n&lt;datalist id="cidades"&gt;\n  &lt;option value="São Paulo"&gt;\n  &lt;option value="Rio de Janeiro"&gt;\n&lt;/datalist&gt;</code></pre><p>Diferenças fundamentais com <code>&lt;select&gt;</code>:</p><ul><li><strong>Datalist</strong>: campo de texto livre com sugestões — o usuário pode digitar qualquer coisa, as opções são apenas sugestões. Não obriga escolha da lista.</li><li><strong>Select</strong>: só aceita valores da lista predefinida. Obriga escolha.</li><li>Datalist tem suporte nativo em todos os browsers modernos e se combina com qualquer type de input (date, color, range).</li></ul>',
      tip: 'Datalist não gera eventos específicos de seleção — para detectar quando o usuário escolheu uma sugestão, monitore o change event e compare com as opções disponíveis.',
    },
  ],

  // ── DIAGRAMS ──────────────────────────────────────────────────────────────
  diagrams: [
    {
      title: 'Critical Rendering Path',
      caption: 'Do HTML aos pixels — cada etapa e o que pode bloqueá-la',
      html: `
<style>
.html-crp-wrap { font-family: 'JetBrains Mono', monospace; color: #e2e8f0; padding: 24px; background: #0f1117; border-radius: 12px; }
.html-crp-title { font-size: 11px; font-weight: 700; letter-spacing: .15em; color: #E44D26; text-transform: uppercase; margin-bottom: 20px; }
.html-crp-flow { display: flex; align-items: center; gap: 0; flex-wrap: wrap; row-gap: 12px; }
.html-crp-step { background: #1a1f2e; border: 1px solid #2d3448; border-radius: 8px; padding: 10px 14px; text-align: center; min-width: 90px; }
.html-crp-step-label { font-size: 11px; color: #e2e8f0; font-weight: 700; }
.html-crp-step-sub { font-size: 9px; color: #64748b; margin-top: 3px; }
.html-crp-arrow { color: #E44D26; font-size: 20px; padding: 0 6px; }
.html-crp-blocker { margin-top: 20px; background: #1a1f2e; border-radius: 8px; padding: 14px; }
.html-crp-blocker-title { font-size: 10px; color: #f87171; font-weight: 700; letter-spacing: .1em; margin-bottom: 10px; }
.html-crp-row { display: flex; gap: 10px; margin-bottom: 8px; align-items: flex-start; }
.html-crp-icon { font-size: 12px; margin-top: 1px; }
.html-crp-text { font-size: 11px; color: #94a3b8; line-height: 1.5; }
.html-crp-code { color: #E44D26; }
.html-crp-ok { color: #4ade80; }
</style>
<div class="html-crp-wrap">
  <div class="html-crp-title">Critical Rendering Path</div>
  <div class="html-crp-flow">
    <div class="html-crp-step"><div class="html-crp-step-label">HTML</div><div class="html-crp-step-sub">parse</div></div>
    <div class="html-crp-arrow">→</div>
    <div class="html-crp-step"><div class="html-crp-step-label">DOM</div><div class="html-crp-step-sub">tree</div></div>
    <div class="html-crp-arrow">→</div>
    <div class="html-crp-step"><div class="html-crp-step-label">CSSOM</div><div class="html-crp-step-sub">tree</div></div>
    <div class="html-crp-arrow">→</div>
    <div class="html-crp-step" style="border-color:#E44D26; background:#E44D2615"><div class="html-crp-step-label" style="color:#E44D26">Render Tree</div><div class="html-crp-step-sub">merge</div></div>
    <div class="html-crp-arrow">→</div>
    <div class="html-crp-step"><div class="html-crp-step-label">Layout</div><div class="html-crp-step-sub">geom</div></div>
    <div class="html-crp-arrow">→</div>
    <div class="html-crp-step"><div class="html-crp-step-label">Paint</div><div class="html-crp-step-sub">pixels</div></div>
    <div class="html-crp-arrow">→</div>
    <div class="html-crp-step"><div class="html-crp-step-label">Composite</div><div class="html-crp-step-sub">layers</div></div>
  </div>
  <div class="html-crp-blocker">
    <div class="html-crp-blocker-title">O que bloqueia o path</div>
    <div class="html-crp-row"><span class="html-crp-icon" style="color:#f87171">■</span><span class="html-crp-text"><code class="html-crp-code">&lt;script&gt;</code> síncrono — para o parser até baixar e executar</span></div>
    <div class="html-crp-row"><span class="html-crp-icon" style="color:#f59e0b">■</span><span class="html-crp-text"><code class="html-crp-code">&lt;link rel="stylesheet"&gt;</code> — não bloqueia parser, mas bloqueia render</span></div>
    <div class="html-crp-row"><span class="html-crp-icon" style="color:#4ade80">■</span><span class="html-crp-text"><code class="html-crp-code">defer</code> — executa após parsing, não bloqueia nada</span></div>
    <div class="html-crp-row"><span class="html-crp-icon" style="color:#38bdf8">■</span><span class="html-crp-text"><code class="html-crp-code">async</code> — baixa em paralelo, executa assim que termina (pode interromper parser)</span></div>
    <div class="html-crp-row"><span class="html-crp-icon" style="color:#a78bfa">■</span><span class="html-crp-text"><code class="html-crp-code">preload</code> — inicia download cedo sem bloquear; reduz tempo do recurso crítico</span></div>
  </div>
</div>
`,
    },
    {
      title: 'Mapa de Elementos Semânticos',
      caption: 'Hierarquia e propósito dos principais elementos HTML5 semânticos',
      html: `
<style>
.html-sem-wrap { font-family: 'JetBrains Mono', monospace; color: #e2e8f0; padding: 24px; background: #0f1117; border-radius: 12px; }
.html-sem-title { font-size: 11px; font-weight: 700; letter-spacing: .15em; color: #E44D26; text-transform: uppercase; margin-bottom: 20px; }
.html-sem-page { background: #1a1f2e; border: 2px solid #E44D2640; border-radius: 10px; padding: 14px; }
.html-sem-header { background: #E44D2625; border: 1px solid #E44D2660; border-radius: 6px; padding: 10px 14px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
.html-sem-nav { background: #38bdf825; border: 1px solid #38bdf860; border-radius: 6px; padding: 8px 14px; margin-bottom: 10px; }
.html-sem-body { display: grid; grid-template-columns: 1fr 220px; gap: 10px; margin-bottom: 10px; }
.html-sem-main { background: #4ade8015; border: 1px solid #4ade8060; border-radius: 6px; padding: 10px; }
.html-sem-aside { background: #a78bfa15; border: 1px solid #a78bfa60; border-radius: 6px; padding: 10px; }
.html-sem-article { background: #f59e0b15; border: 1px solid #f59e0b60; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; }
.html-sem-section { background: #f472b615; border: 1px solid #f472b660; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; }
.html-sem-footer { background: #64748b25; border: 1px solid #64748b60; border-radius: 6px; padding: 8px 14px; text-align: center; }
.html-sem-tag { font-size: 10px; font-weight: 700; }
.html-sem-desc { font-size: 9px; color: #64748b; margin-top: 2px; }
</style>
<div class="html-sem-wrap">
  <div class="html-sem-title">Elementos Semânticos HTML5</div>
  <div class="html-sem-page">
    <div class="html-sem-header">
      <div><div class="html-sem-tag" style="color:#E44D26">&lt;header&gt;</div><div class="html-sem-desc">Logo, branding, hero</div></div>
      <div style="font-size:9px;color:#64748b">cabeçalho do documento ou seção</div>
    </div>
    <div class="html-sem-nav">
      <div class="html-sem-tag" style="color:#38bdf8">&lt;nav&gt;</div>
      <div class="html-sem-desc">Links de navegação principal — landmark de a11y</div>
    </div>
    <div class="html-sem-body">
      <div class="html-sem-main">
        <div class="html-sem-tag" style="color:#4ade80">&lt;main&gt; — único por página</div>
        <div class="html-sem-article">
          <div class="html-sem-tag" style="color:#f59e0b">&lt;article&gt;</div>
          <div class="html-sem-desc">Conteúdo independente (post, card, tweet)</div>
          <div class="html-sem-section" style="margin-top:6px">
            <div class="html-sem-tag" style="color:#f472b6">&lt;section&gt;</div>
            <div class="html-sem-desc">Seção temática com heading obrigatório</div>
          </div>
        </div>
        <div style="margin-top:6px">
          <div class="html-sem-tag" style="color:#64748b;font-size:9px">figure · time · address · details · summary</div>
        </div>
      </div>
      <div class="html-sem-aside">
        <div class="html-sem-tag" style="color:#a78bfa">&lt;aside&gt;</div>
        <div class="html-sem-desc">Conteúdo relacionado tangencialmente (sidebar, callout)</div>
      </div>
    </div>
    <div class="html-sem-footer">
      <div class="html-sem-tag" style="color:#94a3b8">&lt;footer&gt;</div>
      <div class="html-sem-desc">Rodapé — autor, copyright, links relacionados</div>
    </div>
  </div>
</div>
`,
    },
    {
      title: 'Form Validation — Nativa vs JS',
      caption: 'Atributos de validação HTML5 e a API Constraint Validation',
      html: `
<style>
.html-form-wrap { font-family: 'JetBrains Mono', monospace; color: #e2e8f0; padding: 24px; background: #0f1117; border-radius: 12px; }
.html-form-title { font-size: 11px; font-weight: 700; letter-spacing: .15em; color: #E44D26; text-transform: uppercase; margin-bottom: 20px; }
.html-form-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.html-form-card { background: #1a1f2e; border: 1px solid #2d3448; border-radius: 8px; padding: 16px; }
.html-form-card-title { font-size: 10px; font-weight: 700; color: #E44D26; letter-spacing: .1em; margin-bottom: 12px; text-transform: uppercase; }
.html-form-row { margin-bottom: 10px; }
.html-form-attr { font-size: 11px; color: #38bdf8; font-weight: 700; }
.html-form-val { font-size: 10px; color: #4ade80; }
.html-form-desc { font-size: 10px; color: #64748b; margin-top: 2px; line-height: 1.4; }
.html-form-api-row { display: flex; gap: 10px; margin-bottom: 8px; align-items: flex-start; }
.html-form-api-key { font-size: 10px; color: #f59e0b; font-weight: 700; min-width: 170px; }
.html-form-api-desc { font-size: 10px; color: #94a3b8; line-height: 1.4; }
</style>
<div class="html-form-wrap">
  <div class="html-form-title">Validação de Formulário</div>
  <div class="html-form-cols">
    <div class="html-form-card">
      <div class="html-form-card-title">Atributos HTML</div>
      <div class="html-form-row"><div class="html-form-attr">required</div><div class="html-form-desc">campo obrigatório</div></div>
      <div class="html-form-row"><div class="html-form-attr">type="email"</div><div class="html-form-desc">valida formato de e-mail</div></div>
      <div class="html-form-row"><div class="html-form-attr">pattern="[A-Z]{3}"</div><div class="html-form-desc">regex personalizada</div></div>
      <div class="html-form-row"><div class="html-form-attr">minlength / maxlength</div><div class="html-form-desc">comprimento do texto</div></div>
      <div class="html-form-row"><div class="html-form-attr">min / max</div><div class="html-form-desc">faixa numérica ou de datas</div></div>
      <div class="html-form-row"><div class="html-form-attr">novalidate</div><div class="html-form-desc">desativa validação nativa no form</div></div>
    </div>
    <div class="html-form-card">
      <div class="html-form-card-title">API Constraint Validation</div>
      <div class="html-form-api-row"><div class="html-form-api-key">input.validity</div><div class="html-form-api-desc">ValidityState — valueMissing, typeMismatch, patternMismatch...</div></div>
      <div class="html-form-api-row"><div class="html-form-api-key">input.validationMessage</div><div class="html-form-api-desc">mensagem nativa do browser</div></div>
      <div class="html-form-api-row"><div class="html-form-api-key">input.setCustomValidity</div><div class="html-form-api-desc">mensagem de erro customizada</div></div>
      <div class="html-form-api-row"><div class="html-form-api-key">input.checkValidity()</div><div class="html-form-api-desc">true se válido — dispara invalid event se não</div></div>
      <div class="html-form-api-row"><div class="html-form-api-key">form.reportValidity()</div><div class="html-form-api-desc">valida e mostra tooltips nativos</div></div>
    </div>
  </div>
</div>
`,
    },
    {
      title: 'ARIA — Roles, States & Properties',
      caption: 'Quando e como usar atributos ARIA sem quebrar acessibilidade',
      html: `
<style>
.html-aria-wrap { font-family: 'JetBrains Mono', monospace; color: #e2e8f0; padding: 24px; background: #0f1117; border-radius: 12px; }
.html-aria-title { font-size: 11px; font-weight: 700; letter-spacing: .15em; color: #E44D26; text-transform: uppercase; margin-bottom: 20px; }
.html-aria-rule { background: #f8710025; border: 1px solid #f8710060; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; }
.html-aria-rule-label { font-size: 10px; color: #f87100; font-weight: 700; margin-bottom: 4px; }
.html-aria-rule-text { font-size: 11px; color: #e2e8f0; }
.html-aria-cols { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.html-aria-cat { background: #1a1f2e; border: 1px solid #2d3448; border-radius: 8px; padding: 14px; }
.html-aria-cat-title { font-size: 10px; font-weight: 700; margin-bottom: 10px; }
.html-aria-item { font-size: 10px; color: #38bdf8; margin-bottom: 6px; }
.html-aria-item-desc { font-size: 9px; color: #64748b; }
</style>
<div class="html-aria-wrap">
  <div class="html-aria-title">ARIA — Regras e Atributos</div>
  <div class="html-aria-rule">
    <div class="html-aria-rule-label">1ª Regra da ARIA</div>
    <div class="html-aria-rule-text">Se existe um elemento HTML nativo com a semântica ou comportamento que você precisa, use-o em vez de adicionar ARIA.</div>
  </div>
  <div class="html-aria-cols">
    <div class="html-aria-cat">
      <div class="html-aria-cat-title" style="color:#a78bfa">Roles</div>
      <div class="html-aria-item">role="dialog"<div class="html-aria-item-desc">modal, precisa de aria-modal="true"</div></div>
      <div class="html-aria-item">role="tablist/tab/tabpanel"<div class="html-aria-item-desc">componente de abas</div></div>
      <div class="html-aria-item">role="alert"<div class="html-aria-item-desc">anuncia imediatamente para leitores</div></div>
      <div class="html-aria-item">role="status"<div class="html-aria-item-desc">feedback não urgente</div></div>
    </div>
    <div class="html-aria-cat">
      <div class="html-aria-cat-title" style="color:#4ade80">Properties</div>
      <div class="html-aria-item">aria-label<div class="html-aria-item-desc">nome acessível direto</div></div>
      <div class="html-aria-item">aria-labelledby<div class="html-aria-item-desc">referência ao heading</div></div>
      <div class="html-aria-item">aria-describedby<div class="html-aria-item-desc">texto de ajuda extra</div></div>
      <div class="html-aria-item">aria-required<div class="html-aria-item-desc">campo obrigatório (semântico)</div></div>
    </div>
    <div class="html-aria-cat">
      <div class="html-aria-cat-title" style="color:#f59e0b">States</div>
      <div class="html-aria-item">aria-expanded="true/false"<div class="html-aria-item-desc">accordion, dropdown</div></div>
      <div class="html-aria-item">aria-selected="true/false"<div class="html-aria-item-desc">tabs, listbox items</div></div>
      <div class="html-aria-item">aria-hidden="true"<div class="html-aria-item-desc">esconde do Acc. Tree</div></div>
      <div class="html-aria-item">aria-disabled="true"<div class="html-aria-item-desc">comunica sem remover</div></div>
    </div>
  </div>
</div>
`,
    },
  ],

  // ── MNEMONICS ──────────────────────────────────────────────────────────────
  mnemonics: [
    {
      label: 'DEFER = Documento-Espera-Por-Fim',
      trick: 'D-E-F = Documento-Espera-Fim',
      explanation: 'Scripts com defer só executam depois que o documento HTML foi completamente parseado. Ao contrário de async, a ORDEM entre múltiplos defer é preservada. Pense: "defer é educado, espera o documento acabar antes de executar".',
    },
    {
      label: 'ARIA: Roles / Properties / States = RPS',
      trick: 'RPS — como uma câmera: Role (o que é), Property (características estáticas), State (condição atual mutável)',
      explanation: 'Role = tipo do widget (button, dialog, tablist). Property = informação estática (aria-label, aria-required). State = condição que muda em runtime (aria-expanded, aria-selected). Pense numa câmera: tem modelo (role), tem specs (properties), tem modo atual (state).',
    },
    {
      label: 'preload = AGORA, prefetch = DEPOIS',
      trick: '"preload pre-sente, prefetch pre-futuro"',
      explanation: 'preload = recurso necessário AGORA, alta prioridade, download imediato. prefetch = recurso para a PRÓXIMA navegação, baixa prioridade, download ocioso. Se você confundir os dois, ou baixa cedo demais (desperdício) ou tarde demais (lento).',
    },
    {
      label: 'Semântica = Estrutura antes de Estilo',
      trick: '"HTML é esqueleto, CSS é roupa"',
      explanation: 'O HTML define a estrutura e o significado (semântica). O CSS define aparência. Um div estilizado como botão não é um botão — sem role, tabindex, e handlers de teclado, é só uma caixa bonita. A 1ª Regra da ARIA reforça: use o elemento nativo sempre que possível.',
    },
    {
      label: 'Critical Path Blockers: Parser vs Render',
      trick: '"Scripts param o parser, CSS para o pincel"',
      explanation: 'Scripts síncronos bloqueiam o PARSER (construção do DOM para). Stylesheets bloqueiam o RENDER (tela fica em branco). São mecanismos distintos: um bloqueia a análise, o outro bloqueia a exibição. Scripts com defer/async não bloqueiam o parser.',
    },
  ],

  // ── CHEATSHEET ──────────────────────────────────────────────────────────────
  cheatsheet: {
    title: 'HTML5 CheatSheet',
    caption: 'Elementos, atributos e APIs — referência rápida',
    html: `
<style>
.html-cs-wrap { font-family: 'JetBrains Mono', monospace; color: #e2e8f0; padding: 24px; background: #0f1117; border-radius: 12px; }
.html-cs-title { font-size: 12px; font-weight: 800; color: #E44D26; text-transform: uppercase; letter-spacing: .15em; margin-bottom: 20px; }
.html-cs-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.html-cs-section { background: #1a1f2e; border: 1px solid #2d3448; border-radius: 8px; padding: 14px; }
.html-cs-section-title { font-size: 9px; color: #E44D26; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 10px; }
.html-cs-row { margin-bottom: 7px; }
.html-cs-key { font-size: 10px; color: #38bdf8; font-weight: 700; }
.html-cs-val { font-size: 9px; color: #64748b; line-height: 1.4; margin-top: 1px; }
</style>
<div class="html-cs-wrap">
  <div class="html-cs-title">HTML5 — Referência Rápida</div>
  <div class="html-cs-cols">
    <div class="html-cs-section">
      <div class="html-cs-section-title">Semântica de Documento</div>
      <div class="html-cs-row"><div class="html-cs-key">header / footer</div><div class="html-cs-val">cabeçalho / rodapé (pode haver múltiplos)</div></div>
      <div class="html-cs-row"><div class="html-cs-key">main</div><div class="html-cs-val">conteúdo principal (único por página)</div></div>
      <div class="html-cs-row"><div class="html-cs-key">nav</div><div class="html-cs-val">bloco de links de navegação</div></div>
      <div class="html-cs-row"><div class="html-cs-key">article</div><div class="html-cs-val">conteúdo independente e reutilizável</div></div>
      <div class="html-cs-row"><div class="html-cs-key">section</div><div class="html-cs-val">seção temática (precisa de heading)</div></div>
      <div class="html-cs-row"><div class="html-cs-key">aside</div><div class="html-cs-val">conteúdo relacionado lateralmente</div></div>
      <div class="html-cs-row"><div class="html-cs-key">figure / figcaption</div><div class="html-cs-val">mídia + legenda auto-contida</div></div>
    </div>
    <div class="html-cs-section">
      <div class="html-cs-section-title">Head &amp; Meta</div>
      <div class="html-cs-row"><div class="html-cs-key">charset="utf-8"</div><div class="html-cs-val">PRIMEIRO no head, obrigatório</div></div>
      <div class="html-cs-row"><div class="html-cs-key">name="viewport"</div><div class="html-cs-val">width=device-width, initial-scale=1</div></div>
      <div class="html-cs-row"><div class="html-cs-key">name="description"</div><div class="html-cs-val">snippet do SERP, 150-160 chars</div></div>
      <div class="html-cs-row"><div class="html-cs-key">property="og:*"</div><div class="html-cs-val">Open Graph para redes sociais</div></div>
      <div class="html-cs-row"><div class="html-cs-key">rel="canonical"</div><div class="html-cs-val">URL preferencial para o Google</div></div>
      <div class="html-cs-row"><div class="html-cs-key">rel="preload"</div><div class="html-cs-val">recurso crítico — download antecipado</div></div>
      <div class="html-cs-row"><div class="html-cs-key">rel="prefetch"</div><div class="html-cs-val">próxima navegação, baixa prioridade</div></div>
    </div>
    <div class="html-cs-section">
      <div class="html-cs-section-title">Scripts &amp; Performance</div>
      <div class="html-cs-row"><div class="html-cs-key">defer</div><div class="html-cs-val">executa pós-parse, ordem preservada</div></div>
      <div class="html-cs-row"><div class="html-cs-key">async</div><div class="html-cs-val">executa ao terminar download, sem ordem</div></div>
      <div class="html-cs-row"><div class="html-cs-key">type="module"</div><div class="html-cs-val">ES modules, defer por padrão</div></div>
      <div class="html-cs-row"><div class="html-cs-key">loading="lazy"</div><div class="html-cs-val">img/iframe — adia carregamento</div></div>
      <div class="html-cs-row"><div class="html-cs-key">fetchpriority="high"</div><div class="html-cs-val">prioridade máxima para img LCP</div></div>
      <div class="html-cs-row"><div class="html-cs-key">decoding="async"</div><div class="html-cs-val">decodifica imagem fora do main thread</div></div>
    </div>
    <div class="html-cs-section">
      <div class="html-cs-section-title">Formulários</div>
      <div class="html-cs-row"><div class="html-cs-key">required, minlength</div><div class="html-cs-val">validação nativa sem JS</div></div>
      <div class="html-cs-row"><div class="html-cs-key">pattern="regex"</div><div class="html-cs-val">validação por expressão regular</div></div>
      <div class="html-cs-row"><div class="html-cs-key">autocomplete="off"</div><div class="html-cs-val">desativa sugestões do browser</div></div>
      <div class="html-cs-row"><div class="html-cs-key">inputmode="numeric"</div><div class="html-cs-val">teclado numérico em mobile</div></div>
      <div class="html-cs-row"><div class="html-cs-key">fieldset / legend</div><div class="html-cs-val">agrupa campos relacionados (a11y)</div></div>
      <div class="html-cs-row"><div class="html-cs-key">datalist</div><div class="html-cs-val">autocomplete sem bloquear entrada livre</div></div>
    </div>
    <div class="html-cs-section">
      <div class="html-cs-section-title">Acessibilidade</div>
      <div class="html-cs-row"><div class="html-cs-key">alt=""</div><div class="html-cs-val">imagem decorativa (leitores ignoram)</div></div>
      <div class="html-cs-row"><div class="html-cs-key">alt="descrição"</div><div class="html-cs-val">imagem informativa</div></div>
      <div class="html-cs-row"><div class="html-cs-key">tabindex="0"</div><div class="html-cs-val">adiciona ao fluxo de Tab</div></div>
      <div class="html-cs-row"><div class="html-cs-key">tabindex="-1"</div><div class="html-cs-val">focável via JS, não via Tab</div></div>
      <div class="html-cs-row"><div class="html-cs-key">aria-label</div><div class="html-cs-val">nome acessível (sem texto visível)</div></div>
      <div class="html-cs-row"><div class="html-cs-key">aria-hidden="true"</div><div class="html-cs-val">remove do Accessibility Tree</div></div>
    </div>
    <div class="html-cs-section">
      <div class="html-cs-section-title">HTML5 APIs</div>
      <div class="html-cs-row"><div class="html-cs-key">canvas</div><div class="html-cs-val">bitmap 2D/WebGL via JS</div></div>
      <div class="html-cs-row"><div class="html-cs-key">template</div><div class="html-cs-val">parsed mas não renderizado</div></div>
      <div class="html-cs-row"><div class="html-cs-key">dialog</div><div class="html-cs-val">modal nativo com .showModal()</div></div>
      <div class="html-cs-row"><div class="html-cs-key">details / summary</div><div class="html-cs-val">accordion nativo sem JS</div></div>
      <div class="html-cs-row"><div class="html-cs-key">slot</div><div class="html-cs-val">injeção de conteúdo em Shadow DOM</div></div>
      <div class="html-cs-row"><div class="html-cs-key">picture / source</div><div class="html-cs-val">art direction responsivo</div></div>
    </div>
  </div>
</div>
`,
  },

  // ── MINDMAP ──────────────────────────────────────────────────────────────
  mindmap: {
    title: 'Mapa Mental HTML5',
    caption: 'Categorias, tópicos e checklist de domínio',
    html: `
<style>
.html-mm-wrap { font-family: 'JetBrains Mono', monospace; color: #e2e8f0; padding: 24px; background: #0f1117; border-radius: 12px; }
.html-mm-center { text-align: center; margin-bottom: 24px; }
.html-mm-badge { display: inline-block; background: #E44D2620; border: 2px solid #E44D26; border-radius: 999px; padding: 8px 24px; font-size: 14px; font-weight: 800; color: #E44D26; }
.html-mm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.html-mm-card { background: #1a1f2e; border-radius: 8px; padding: 14px; }
.html-mm-card-title { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 10px; }
.html-mm-item { font-size: 10px; color: #94a3b8; margin-bottom: 5px; padding-left: 10px; position: relative; }
.html-mm-item::before { content: "›"; position: absolute; left: 0; color: #E44D26; }
.html-mm-key { color: #e2e8f0; font-weight: 700; }
</style>
<div class="html-mm-wrap">
  <div class="html-mm-center"><div class="html-mm-badge">HTML5</div></div>
  <div class="html-mm-grid">
    <div class="html-mm-card">
      <div class="html-mm-card-title" style="color:#E44D26">Semântica</div>
      <div class="html-mm-item"><span class="html-mm-key">main</span> — único, conteúdo principal</div>
      <div class="html-mm-item"><span class="html-mm-key">article</span> — independente</div>
      <div class="html-mm-item"><span class="html-mm-key">section</span> — temático + heading</div>
      <div class="html-mm-item"><span class="html-mm-key">nav / aside</span> — navegação / lateral</div>
      <div class="html-mm-item"><span class="html-mm-key">figure / time / address</span></div>
    </div>
    <div class="html-mm-card">
      <div class="html-mm-card-title" style="color:#38bdf8">Head &amp; Meta</div>
      <div class="html-mm-item"><span class="html-mm-key">charset</span> — primeiro no head</div>
      <div class="html-mm-item"><span class="html-mm-key">viewport</span> — mobile-first</div>
      <div class="html-mm-item"><span class="html-mm-key">og: / twitter:</span> — social share</div>
      <div class="html-mm-item"><span class="html-mm-key">canonical</span> — SEO dedup</div>
      <div class="html-mm-item"><span class="html-mm-key">JSON-LD</span> — structured data</div>
    </div>
    <div class="html-mm-card">
      <div class="html-mm-card-title" style="color:#4ade80">Performance</div>
      <div class="html-mm-item"><span class="html-mm-key">defer / async</span> — scripts</div>
      <div class="html-mm-item"><span class="html-mm-key">preload</span> — recurso crítico</div>
      <div class="html-mm-item"><span class="html-mm-key">prefetch</span> — próxima rota</div>
      <div class="html-mm-item"><span class="html-mm-key">loading="lazy"</span> — imagens</div>
      <div class="html-mm-item"><span class="html-mm-key">fetchpriority</span> — LCP</div>
    </div>
    <div class="html-mm-card">
      <div class="html-mm-card-title" style="color:#a78bfa">Acessibilidade</div>
      <div class="html-mm-item"><span class="html-mm-key">alt / aria-label</span> — nomes</div>
      <div class="html-mm-item"><span class="html-mm-key">tabindex</span> — foco e ordem</div>
      <div class="html-mm-item"><span class="html-mm-key">role</span> — semântica de widget</div>
      <div class="html-mm-item"><span class="html-mm-key">aria-expanded/selected</span></div>
      <div class="html-mm-item"><span class="html-mm-key">focus trap</span> — modais</div>
    </div>
    <div class="html-mm-card">
      <div class="html-mm-card-title" style="color:#f59e0b">Formulários</div>
      <div class="html-mm-item"><span class="html-mm-key">required, pattern</span> — validação</div>
      <div class="html-mm-item"><span class="html-mm-key">fieldset/legend</span> — agrupamento</div>
      <div class="html-mm-item"><span class="html-mm-key">datalist</span> — autocomplete livre</div>
      <div class="html-mm-item"><span class="html-mm-key">inputmode</span> — teclado mobile</div>
      <div class="html-mm-item"><span class="html-mm-key">Constraint Validation API</span></div>
    </div>
    <div class="html-mm-card">
      <div class="html-mm-card-title" style="color:#f472b6">APIs &amp; Web Components</div>
      <div class="html-mm-item"><span class="html-mm-key">canvas</span> — bitmap 2D/WebGL</div>
      <div class="html-mm-item"><span class="html-mm-key">Custom Elements</span></div>
      <div class="html-mm-item"><span class="html-mm-key">Shadow DOM</span> — encapsulamento</div>
      <div class="html-mm-item"><span class="html-mm-key">template / slot</span></div>
      <div class="html-mm-item"><span class="html-mm-key">dialog, details/summary</span></div>
    </div>
  </div>
</div>
`,
  },

  // ── EXERCISES ──────────────────────────────────────────────────────────────
  exercises: [
    {
      level: 'iniciante',
      title: 'Reestruturar uma página com HTML semântico',
      description: 'Dada uma página com apenas <div> e <span>, refatorar para usar os elementos semânticos corretos: header, nav, main, section, article, aside, footer, h1-h6, figure.',
      concepts: ['elementos semânticos', 'hierarquia de headings', 'landmarks de a11y'],
      hint: 'Comece identificando as regiões principais da página (topo, navegação, conteúdo, rodapé). Use o Accessibility Tree do DevTools (painel Accessibility) para verificar que os landmarks aparecem corretamente.',
    },
    {
      level: 'iniciante',
      title: 'Formulário de cadastro acessível',
      description: 'Criar um formulário com: nome, e-mail, senha, confirmação de senha, checkbox de termos. Todos os campos devem ter label associado, mensagens de erro com aria-describedby, e validação nativa HTML5.',
      concepts: ['label', 'for/id', 'required', 'aria-describedby', 'fieldset/legend'],
      hint: 'Use fieldset e legend para agrupar o bloco de "dados pessoais" e o bloco "credenciais". O checkbox de termos deve estar dentro de um label ou ter for explícito.',
    },
    {
      level: 'intermediario',
      title: 'Otimização de performance com resource hints',
      description: 'Dado um HTML com uma fonte do Google Fonts, uma imagem hero, dois scripts JS e um CSS crítico, adicionar os resource hints corretos (preload, prefetch, preconnect) para reduzir o tempo de First Contentful Paint.',
      concepts: ['preload', 'preconnect', 'defer', 'async', 'fetchpriority', 'Critical Rendering Path'],
      hint: 'A fonte precisa de preconnect (e possivelmente preload com crossorigin="anonymous"). O script de analytics deve ser async. O script principal deve ser defer. A imagem hero precisa de fetchpriority="high" e NÃO deve ter loading="lazy".',
    },
    {
      level: 'intermediario',
      title: 'Galeria responsiva com picture e srcset',
      description: 'Criar uma galeria de imagens onde: imagens menores que 600px recebem versões mobile (480px), maiores recebem versões desktop (1200px). Usar formatos WebP com fallback para JPEG. Cada imagem deve ter lazy loading exceto a primeira.',
      concepts: ['picture', 'source', 'srcset', 'media', 'type', 'loading="lazy"', 'fetchpriority'],
      hint: 'Use <picture> com dois <source> (um para WebP, um para JPEG) mais um <img> de fallback. O atributo type no source controla o formato. A primeira imagem da galeria (possivelmente o LCP) deve ter fetchpriority="high" e não deve ter loading="lazy".',
    },
    {
      level: 'senior',
      title: 'Implementar Web Component de dialog acessível',
      description: 'Criar um Custom Element <accessible-dialog> usando Shadow DOM que: mantém focus trap interno, devolve foco ao elemento que o abriu, anuncia a abertura via role="dialog" e aria-labelledby, e suporta fechamento com Escape.',
      concepts: ['Custom Elements', 'Shadow DOM', 'focus trap', 'tabindex', 'aria-modal', 'keyboard events'],
      hint: 'Guarde uma referência ao elemento que abriu o dialog antes de transferir o foco. Ao fechar, chame previousElement.focus(). Para o focus trap, intercepte o evento keydown do Tab e Shift+Tab e redirecione quando o foco tentaria sair do shadow root.',
    },
    {
      level: 'senior',
      title: 'Adicionar structured data JSON-LD e verificar no Search Console',
      description: 'Para uma página de artigo de blog, implementar JSON-LD com schema Article, BreadcrumbList e FAQPage. Verificar com a ferramenta de teste de dados estruturados do Google. Garantir que og:image tem as dimensões corretas para Facebook e Twitter.',
      concepts: ['JSON-LD', 'schema.org', 'structured data', 'Open Graph', 'hreflang', 'canonical'],
      hint: 'Use a extensão do Chrome "Schema Markup Validator" para debug em tempo real. O JSON-LD de Article precisa de: @type, headline, author (Person), datePublished, image (objeto com url, width, height). FAQPage precisa de um array mainEntity com objetos Question/Answer.',
    },
  ],

  // ── VIDEOS ──────────────────────────────────────────────────────────────
  videos: [
    {
      title: 'HTML & CSS Full Course — Beginner to Pro',
      channel: 'SuperSimpleDev',
      url: 'https://www.youtube.com/watch?v=G3e-cpL7ofc',
      topic: 'Fundamentos completos',
      note: 'Cobertura completa de HTML e CSS do zero, muito prático com projetos reais.',
    },
    {
      title: 'HTML Tutorial for Beginners — Complete HTML with Notes',
      channel: 'Sheriyan Coding School',
      url: 'https://www.youtube.com/watch?v=HcOc7197kuw',
      topic: 'Fundamentos + semântica',
      note: 'Focado na semântica correta desde o início. Bom para entender o "porquê" de cada elemento.',
    },
    {
      title: 'Are you using Semantic HTML?',
      channel: 'Kevin Powell',
      url: 'https://www.youtube.com/watch?v=bOUhq46fd5g',
      topic: 'HTML semântico',
      note: 'Kevin Powell explica na prática quando usar section vs article vs div — a confusão mais comum.',
    },
    {
      title: 'Web Accessibility All You Need to Know',
      channel: 'Kevin Powell',
      url: 'https://www.youtube.com/watch?v=e2nkq3h1Wood',
      topic: 'Acessibilidade',
      note: 'ARIA, tabindex, focus management — tudo em um vídeo. Referência para entrevistas sobre a11y.',
    },
    {
      title: 'The Anatomy of an HTML Document',
      channel: 'Fireship',
      url: 'https://www.youtube.com/watch?v=ok-plXXHlWw',
      topic: 'Head, meta tags, performance',
      note: 'Fireships style: denso e rápido. Cobre todas as meta tags importantes em 10 minutos.',
    },
  ],

  // ── RESOURCES ──────────────────────────────────────────────────────────────
  resources: [
    {
      title: 'MDN Web Docs — HTML',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
      kind: 'docs',
    },
    {
      title: 'web.dev — Learn HTML',
      url: 'https://web.dev/learn/html',
      kind: 'curso',
    },
    {
      title: 'W3C HTML Living Standard',
      url: 'https://html.spec.whatwg.org/multipage/',
      kind: 'docs',
    },
    {
      title: 'The A11Y Project — Checklist',
      url: 'https://www.a11yproject.com/checklist/',
      kind: 'pratica',
    },
    {
      title: 'HTMLHell — Antipatterns de HTML',
      url: 'https://www.htmhell.dev/',
      kind: 'artigo',
    },
    {
      title: 'Google Search Central — Structured Data',
      url: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
      kind: 'docs',
    },
    {
      title: 'web.dev — Critical Rendering Path',
      url: 'https://web.dev/articles/critical-rendering-path',
      kind: 'artigo',
    },
  ],

  // ── CODE EXAMPLES ──────────────────────────────────────────────────────────
  codeExamples: [
    {
      title: 'Head completo — meta tags, preload, og, JSON-LD',
      language: 'html',
      description: 'Template de <head> com todas as meta tags essenciais para SEO, performance e social share.',
      code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <!-- 1. Charset SEMPRE primeiro -->
  <meta charset="utf-8" />

  <!-- 2. Viewport para mobile -->
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- 3. SEO básico -->
  <title>Título da Página · Site</title>
  <meta name="description" content="Descrição entre 150-160 caracteres que aparece no snippet do Google." />
  <link rel="canonical" href="https://exemplo.com/pagina" />

  <!-- 4. Open Graph (Facebook, WhatsApp, LinkedIn) -->
  <meta property="og:type"        content="article" />
  <meta property="og:title"       content="Título para compartilhamento" />
  <meta property="og:description" content="Descrição para o card social" />
  <meta property="og:image"       content="https://exemplo.com/og-image.jpg" />
  <meta property="og:url"         content="https://exemplo.com/pagina" />

  <!-- 5. Twitter Cards -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="Título para Twitter" />
  <meta name="twitter:image"       content="https://exemplo.com/og-image.jpg" />

  <!-- 6. Performance: preconnect para origens externas -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />

  <!-- 7. Preload de recurso crítico (fonte, imagem hero) -->
  <link
    rel="preload"
    as="font"
    href="https://fonts.gstatic.com/s/inter/v13/UcCO3.woff2"
    type="font/woff2"
    crossorigin="anonymous"
  />

  <!-- 8. CSS (não bloqueador do parser, mas bloqueador do render) -->
  <link rel="stylesheet" href="/styles/main.css" />

  <!-- 9. Script defer (executa após parse, ordem preservada) -->
  <script src="/app.js" defer></script>

  <!-- 10. Script async para scripts independentes (analytics) -->
  <script src="https://cdn.analytics.com/ua.js" async></script>

  <!-- 11. Structured Data JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Título do Artigo",
    "author": { "@type": "Person", "name": "Daniel Moliari" },
    "datePublished": "2024-06-15",
    "image": "https://exemplo.com/article-image.jpg"
  }
  </script>
</head>`,
    },
    {
      title: 'Formulário acessível com validação nativa e ARIA',
      language: 'html',
      description: 'Formulário com fieldset/legend, label correto, validação HTML5 e mensagens de erro acessíveis via aria-describedby.',
      code: `<form id="cadastro" novalidate>
  <!-- novalidate = assumimos controle via JS, mas mantemos a API -->

  <fieldset>
    <legend>Dados pessoais</legend>

    <!-- label com for vinculado ao id do input -->
    <div class="campo">
      <label for="nome">Nome completo</label>
      <input
        id="nome"
        name="nome"
        type="text"
        required
        minlength="3"
        autocomplete="name"
        aria-describedby="nome-erro"
        aria-required="true"
      />
      <!-- Mensagem de erro — oculta inicialmente, anunciada por aria-describedby -->
      <span id="nome-erro" role="alert" aria-live="polite" hidden>
        Nome deve ter ao menos 3 caracteres.
      </span>
    </div>

    <div class="campo">
      <label for="email">E-mail</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autocomplete="email"
        aria-describedby="email-dica email-erro"
      />
      <span id="email-dica" class="dica">Usaremos para enviar o código de confirmação.</span>
      <span id="email-erro" role="alert" aria-live="polite" hidden>
        Informe um e-mail válido.
      </span>
    </div>
  </fieldset>

  <fieldset>
    <legend>Credenciais</legend>

    <div class="campo">
      <label for="senha">Senha</label>
      <input
        id="senha"
        name="senha"
        type="password"
        required
        minlength="8"
        pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
        autocomplete="new-password"
        aria-describedby="senha-requisitos senha-erro"
      />
      <span id="senha-requisitos" class="dica">Mínimo 8 caracteres, 1 maiúscula e 1 número.</span>
      <span id="senha-erro" role="alert" aria-live="polite" hidden></span>
    </div>
  </fieldset>

  <!-- Checkbox com label envolvendo o input -->
  <div class="campo">
    <label class="checkbox-label">
      <input type="checkbox" name="termos" required />
      Li e aceito os <a href="/termos">Termos de Uso</a>
    </label>
  </div>

  <button type="submit">Criar conta</button>
</form>

<script>
const form = document.getElementById('cadastro');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Constraint Validation API
  if (!form.checkValidity()) {
    // Reporta e mostra tooltips nativos
    form.reportValidity();
    return;
  }
  // ... processar
});
</script>`,
    },
    {
      title: 'Web Component — dialog acessível com Shadow DOM',
      language: 'javascript',
      description: 'Custom Element que implementa um modal com focus trap, devolução de foco e suporte a Escape key.',
      code: `// accessible-dialog.js
class AccessibleDialog extends HTMLElement {
  // Atributos observados disparam attributeChangedCallback
  static get observedAttributes() { return ['open', 'aria-label']; }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._previousFocus = null;

    this._shadow.innerHTML = \`
      <style>
        :host { display: none; }
        :host([open]) { display: block; }

        .backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.6);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }
        .dialog {
          background: #1a1f2e;
          border-radius: 12px;
          padding: 24px;
          min-width: 320px;
          max-width: 90vw;
          position: relative;
        }
        .close-btn {
          position: absolute; top: 12px; right: 12px;
          background: transparent; border: none;
          font-size: 20px; cursor: pointer; color: #94a3b8;
        }
      </style>
      <div class="backdrop" part="backdrop">
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          part="dialog"
        >
          <button class="close-btn" aria-label="Fechar">×</button>
          <slot></slot>
        </div>
      </div>
    \`;

    this._dialog = this._shadow.querySelector('.dialog');
    this._closeBtn = this._shadow.querySelector('.close-btn');
    this._closeBtn.addEventListener('click', () => this.close());
    this._shadow.querySelector('.backdrop').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.close();
    });
    this._handleKeydown = this._handleKeydown.bind(this);
  }

  // Cycle de atributo open
  attributeChangedCallback(name, _old, val) {
    if (name === 'open') {
      if (val !== null) this._onOpen();
      else this._onClose();
    }
    if (name === 'aria-label') {
      this._dialog.setAttribute('aria-label', val ?? '');
    }
  }

  open() { this.setAttribute('open', ''); }

  close() { this.removeAttribute('open'); }

  _onOpen() {
    this._previousFocus = document.activeElement;
    document.addEventListener('keydown', this._handleKeydown);
    // Pequeno delay para animação (opcional)
    requestAnimationFrame(() => this._dialog.focus());
  }

  _onClose() {
    document.removeEventListener('keydown', this._handleKeydown);
    // Devolve foco ao elemento que abriu o dialog
    if (this._previousFocus) {
      this._previousFocus.focus();
      this._previousFocus = null;
    }
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
  }

  _getFocusableElements() {
    return Array.from(
      this._dialog.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea'
      )
    );
  }

  _handleKeydown(e) {
    if (e.key === 'Escape') { this.close(); return; }
    if (e.key !== 'Tab') return;

    const focusable = this._getFocusableElements();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: se está no primeiro, vai para o último
      if (document.activeElement === first || this._shadow.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: se está no último, vai para o primeiro
      if (document.activeElement === last || this._shadow.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}

customElements.define('accessible-dialog', AccessibleDialog);

// Uso:
// <accessible-dialog id="meu-dialog" aria-label="Confirmar ação">
//   <h2>Confirmar exclusão?</h2>
//   <p>Esta ação não pode ser desfeita.</p>
//   <button onclick="document.getElementById('meu-dialog').close()">Cancelar</button>
//   <button onclick="handleDelete()">Confirmar</button>
// </accessible-dialog>
//
// document.getElementById('meu-dialog').open();`,
    },
  ],
}

export default html
