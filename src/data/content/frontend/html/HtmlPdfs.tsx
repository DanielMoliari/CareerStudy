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

// ── Paleta HTML ────────────────────────────────────────────────────────────────
const C      = '#E44D26'
const BG     = '#0f1117'
const CARD   = '#1a1f2e'
const LINE   = '#2d3448'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

void BG; void CARD; void LINE; void FG; void FGMUTE

// ── Metadados dos PDFs ─────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista de HTML',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 20 perguntas de HTML — Critical Rendering Path, semântica, acessibilidade (ARIA, tabindex, focus management), formulários nativos, resource hints, Web Components, structured data JSON-LD, quirks mode, performance (LCP, loading="lazy", fetchpriority). Respostas estruturadas para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Todos os elementos semânticos, atributos e APIs numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: elementos semânticos HTML5, atributos de formulário, resource hints (preload/prefetch/preconnect), meta tags (SEO, OG, viewport), ARIA essencial e APIs nativas do browser. Tudo que você precisa checar rapidamente.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques para fixar HTML na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'D-E-F = Defer-Espera-Fim, RPS para ARIA, preload vs prefetch, a 1ª Regra da ARIA e parser block vs render block. Associações verbais que grudam na memória antes de qualquer entrevista.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 8 erros HTML com código errado ✗ / correto ✓',
    type: 'antipatterns',
    pages: 3,
    description: 'Div soup, imagens sem alt, labels desconectados, headings fora de ordem, tabindex positivo, viewport com user-scalable=no, script síncrono no head e loading="lazy" na imagem LCP. Código errado x correto com explicação técnica.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'HTML do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental completo com 10 categorias e checklist de 20 perguntas de HTML que você deve conseguir responder de cabeça. Use para auto-avaliar o domínio antes de uma entrevista.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
]

const TYPE_COLOR: Record<PdfType, string> = {
  qa:           C,
  cheatsheet:   '#38bdf8',
  mnemonics:    '#4ade80',
  antipatterns: '#f87171',
  mindmap:      '#f59e0b',
}

void TYPE_COLOR

// ── Dados: Q&A ─────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'O que é o Critical Rendering Path e quais elementos HTML o afetam?',
    a: 'O CRP é a sequência do HTML bruto até os pixels: Parse HTML → DOM → CSSOM → Render Tree → Layout → Paint → Composite. Scripts síncronos bloqueiam o parser; stylesheets bloqueiam o render.',
    bullets: [
      'script síncrono: para o parser até o script baixar e executar.',
      'link rel="stylesheet": não bloqueia parser mas bloqueia o render.',
      'defer: executa após o parse, não bloqueia nada.',
      'async: download paralelo, executa assim que termina — pode interromper o parser.',
      'preload: download antecipado sem bloquear render.',
    ],
    tip: 'Mencione a distinção entre "bloquear o parser" vs "bloquear o render" — são mecanismos distintos e a diferença impressiona entrevistadores.',
  },
  {
    level: 'Senior',
    q: 'Como o HTML semântico impacta SEO e acessibilidade ao mesmo tempo?',
    a: 'HTML semântico cria o Accessibility Tree — uma representação paralela ao DOM que leitores de tela e o Googlebot usam. A mesma semântica que ajuda VoiceOver narrar a página é a que o Google usa para indexar.',
    bullets: [
      'nav, main, article, aside criam landmarks que screen readers usam para navegar.',
      'Hierarquia de headings h1→h6 fornece outline para crawlers e leitores de tela.',
      'button e a têm roles implícitos — div role="button" precisa de ARIA + keyboard extra.',
      'Google usa o Accessibility Tree no processo de indexação.',
    ],
    tip: '"O Accessibility Tree que o leitor de tela usa é o mesmo que o Google usa para indexar." Uma implementação serve dois objetivos.',
  },
  {
    level: 'Senior',
    q: 'Explique a diferença entre async e defer em scripts. Quando usar cada um?',
    a: 'Ambos fazem download paralelo ao parsing. A diferença é QUANDO executam: async executa ao terminar o download (interrompe o parser, sem ordem garantida). defer executa após o HTML ser completamente parseado, com ordem preservada.',
    bullets: [
      'async: scripts independentes (analytics, ads, A/B tests).',
      'defer: scripts que dependem do DOM ou entre si.',
      'type="module": defer por padrão + strict mode + CORS.',
      'Sem nenhum: parser para — pior cenário de performance.',
    ],
    tip: 'Pegadinha: async não garante ordem entre scripts. Se B depende de A, use defer nos dois.',
  },
  {
    level: 'Senior',
    q: 'O que são Web Components? Explique Custom Elements, Shadow DOM e Slots.',
    a: 'Web Components são APIs nativas do browser para criar elementos HTML encapsulados e reutilizáveis. Custom Elements registra o nome. Shadow DOM encapsula DOM e CSS. Slots permitem composição.',
    bullets: [
      'customElements.define("meu-btn", MinhaClasse) registra o elemento.',
      'attachShadow({mode: "open"}) cria árvore DOM privada — CSS interno não vaza.',
      'slot name="header" no template, slot="header" no consumer.',
      'template element: parsed mas não renderizado — instancia com cloneNode(true).',
      'Shadow DOM "open" vs "closed": open permite acesso via element.shadowRoot, closed retorna null.',
    ],
    tip: 'Web Components brilham em design systems cross-framework — o mesmo componente funciona em React, Vue e Angular sem wrappers.',
  },
  {
    level: 'Senior',
    q: 'Como implementar structured data JSON-LD? Por que impacta SEO?',
    a: 'JSON-LD dentro de script type="application/ld+json" no head comunica o significado semântico ao Google, além da marcação visual. Habilita rich results (estrelas, FAQs, breadcrumbs) no SERP.',
    bullets: [
      '@context: "https://schema.org" + @type: "Article" para artigos.',
      'Tipos comuns: Product, FAQPage, BreadcrumbList, Person, Organization.',
      'JSON-LD é preferível a Microdata — pode ser injetado via JS sem alterar HTML visível.',
      'Ferramenta de teste: Rich Results Test do Google.',
    ],
    tip: 'JSON-LD pode estar em qualquer lugar do documento (head ou body). Preferência do Google é no head. Pode ser múltiplo na mesma página.',
  },
  {
    level: 'Senior',
    q: 'O que é quirks mode e como o DOCTYPE evita que o browser entre nele?',
    a: 'Sem DOCTYPE válido, o browser entra em quirks mode — emulando comportamentos de IE5/Netscape4. O box model muda (border+padding na largura), CSS se comporta diferente. DOCTYPE html garante modo padrão.',
    bullets: [
      'document.compatMode: "BackCompat" = quirks, "CSS1Compat" = modo padrão.',
      '<!DOCTYPE html> é o DOCTYPE do HTML5 — simples, sem URL, sem versão.',
      'No quirks mode, box model funciona como IE5 sem box-sizing: border-box.',
      'Layouts quebram de formas imprevisíveis — sempre inclua DOCTYPE.',
    ],
    tip: 'document.compatMode é o detector em runtime — útil para debug de sites legados com comportamento inexplicável.',
  },
  {
    level: 'Senior',
    q: 'Explique resource hints: preload, prefetch, preconnect e dns-prefetch.',
    a: 'Quatro hints com propósitos distintos: preload para recurso crítico agora, prefetch para próxima navegação, preconnect para estabelecer TCP+TLS antecipado, dns-prefetch para apenas resolver DNS.',
    bullets: [
      'preload com as="font" em origem cross-origin requer crossorigin="anonymous" — sem isso, o browser baixa duas vezes.',
      'prefetch: browser aguarda idle — não use para recursos críticos do render atual.',
      'preconnect: economiza 150-300ms de handshake TCP+TLS. Use para Google Fonts, CDNs.',
      'dns-prefetch: mais leve que preconnect, apenas DNS, sem TCP/TLS.',
    ],
    tip: 'Preload sem usar o recurso na mesma página gera warning no console e desperdiça banda. O browser baixa e descarta.',
  },
  {
    level: 'Senior',
    q: 'Como funciona internacionalização em HTML? (lang, dir, charset, hreflang)',
    a: 'HTML oferece mecanismos nativos de i18n: lang define o idioma para pronúncia em screen readers, dir controla a direção do texto (RTL/LTR), charset define a codificação, hreflang sinaliza versões por idioma ao Google.',
    bullets: [
      'lang="pt-BR" no html — afeta pronúncia de leitores de tela e algoritmos de quebra de linha.',
      'lang pode ser sobrescrito em qualquer elemento filho (útil para citações em outro idioma).',
      'dir="rtl" para árabe, hebraico — afeta o layout inteiro (flex-direction, floats).',
      'charset deve ser o primeiro elemento do head — antes de title.',
      'hreflang em link rel="alternate" — essencial para sites multilíngues evitarem conteúdo duplicado.',
    ],
    tip: 'Sem lang correto, VoiceOver pronuncia todo o texto no idioma configurado pelo usuário — texto em inglês numa página pt-BR fica incompreensível.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre section, article, div e main? Quando usar cada um?',
    a: 'main = conteúdo principal único (landmark). article = conteúdo independente que faz sentido fora da página. section = agrupamento temático com heading. div = sem semântica — apenas para layout.',
    bullets: [
      'article pode ter section dentro, e section pode ter múltiplos articles.',
      'section sem heading filho não tem sentido — use div.',
      'Teste do article: "esse conteúdo faz sentido extraído para um RSS feed?" Sim = article.',
      'div = último recurso quando nenhum elemento semântico se aplica.',
    ],
    tip: 'Hierarquia não é engessada: article pode ser filho de section e vice-versa. O critério é semântico, não estrutural.',
  },
  {
    level: 'Pleno',
    q: 'O que é ARIA? Quando usar e quando NÃO usar?',
    a: '1ª Regra da ARIA: se existe um elemento HTML nativo com a semântica necessária, use-o. ARIA modifica o Accessibility Tree sem mudar visualmente. Use apenas para widgets sem equivalente HTML nativo.',
    bullets: [
      'role = tipo do widget (dialog, tablist, alertdialog).',
      'aria-* properties = informação estática (label, labelledby, required).',
      'aria-* states = condição dinâmica (expanded, selected, hidden).',
      'ARIA incorreto é mais danoso que ausência de ARIA — confunde leitores de tela.',
      'Nunca role="button" num div quando você pode usar button.',
    ],
    tip: 'ARIA "bom demais" é tão danoso quanto ausente. Atributos conflitantes ou mal-usados confundem mais do que ajudam.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona lazy loading nativo? Qual o impacto no LCP?',
    a: 'loading="lazy" em img e iframe adia o carregamento até o elemento se aproximar da viewport. O browser decide o threshold. Nunca use na imagem LCP (above-the-fold) — adia exatamente o recurso mais crítico.',
    bullets: [
      'Armadilha crítica: loading="lazy" na imagem hero/LCP deteriora diretamente a nota de LCP.',
      'Use loading="eager" (default) ou preload + fetchpriority="high" para a imagem principal.',
      'fetchpriority="high" instrui o browser a dar prioridade máxima ao download.',
      'loading="lazy" é seguro para imagens below-the-fold (cards, galeria).',
    ],
    tip: '"Coloquei lazy em todas as imagens para otimizar" — erro clássico. Lazy no hero é counter-productive.',
  },
  {
    level: 'Pleno',
    q: 'Como gerenciar foco em SPAs? Explique tabindex e focus trap.',
    a: 'Em SPAs, o foco não é movido automaticamente após navegação de rota. Você deve mover para o main ou heading. Ao abrir modal, mover para o primeiro focável. Ao fechar, devolver ao elemento que o abriu.',
    bullets: [
      'tabindex="0": entra no fluxo natural de Tab.',
      'tabindex="-1": focável via JS (el.focus()), não via Tab. Para dialogs, alerts.',
      'tabindex positivo: evitar — quebra a ordem esperada.',
      'Focus trap: interceptar Tab e Shift+Tab para manter foco dentro do modal.',
      'WCAG 2.4.3: foco deve seguir a ordem lógica do conteúdo.',
    ],
    tip: 'O teste de acessibilidade mais simples: esconda o mouse e navegue tudo com Tab. Se você se perder, há problema de foco.',
  },
  {
    level: 'Pleno',
    q: 'Explique meta viewport e como ele afeta layout em mobile.',
    a: 'Sem viewport meta, browsers mobile usam viewport virtual de 980px e encolhem a página. Com width=device-width, usa a largura real. Nunca adicionar maximum-scale ou user-scalable=no — WCAG 1.4.4.',
    bullets: [
      'width=device-width: largura real do dispositivo como viewport.',
      'initial-scale=1: escala 1:1 ao carregar, sem zoom inicial.',
      'maximum-scale=1 e user-scalable=no: proibido — impede zoom de usuários com baixa visão.',
      'Sem essa meta, media queries não funcionam como esperado.',
    ],
    tip: 'Violação de WCAG 1.4.4 mais comum no mundo: viewport com user-scalable=no. Está em milhares de sites que foram "otimizados para mobile".',
  },
  {
    level: 'Pleno',
    q: 'Como usar picture, srcset e figure corretamente?',
    a: 'picture é um container para múltiplos source com art direction ou formatos alternativos. srcset em img é sugestão de resolução (browser decide). figure agrupa qualquer mídia auto-contida com figcaption.',
    bullets: [
      'picture: você decide qual source carregar por viewport (art direction).',
      'srcset em img: o browser decide com base na densidade e viewport.',
      'img dentro de picture é obrigatório — é o fallback e onde fica o alt.',
      'type="image/webp" no source — fallback automático para navegadores sem suporte.',
      'figcaption: primeiro ou último filho do figure. Referenciado automaticamente por screen readers.',
    ],
    tip: 'Sem img dentro de picture, não há fallback. Sem alt no img interno, a imagem é inacessível.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre strong/em e b/i?',
    a: 'strong e em têm semântica: strong = importância elevada (leitores de tela enfatizam a voz), em = ênfase que muda o significado da frase. b e i são puramente visuais: b = destaque visual sem importância, i = texto em registro diferente.',
    bullets: [
      'strong: alertas, avisos, informação crítica de segurança.',
      'em: "eu *nunca* disse isso" — a ênfase muda o significado.',
      'b: palavra-chave em glossário, nome de produto em review.',
      'i: termos técnicos, nomes de obras, expressões estrangeiras.',
    ],
    tip: 'Regra prática: se o destaque muda a semântica da frase, use strong/em. Se é só visual, use b/i (ou CSS via span).',
  },
  {
    level: 'Pleno',
    q: 'O que é o atributo crossorigin e quando é obrigatório?',
    a: 'crossorigin controla como o browser faz requisições cross-origin para recursos. É obrigatório em preload de fontes cross-origin (sem ele o browser baixa duas vezes), em módulos ES (sempre CORS), e em canvas com imagem cross-origin.',
    bullets: [
      'anonymous: sem credenciais. Servidor precisa responder com CORS headers.',
      'use-credentials: envia cookies/certs. Servidor não pode usar wildcard no origin.',
      'preload de fonte sem crossorigin="anonymous": dois requests (preload + CSS — caches diferentes).',
      'canvas.toDataURL() sem crossorigin na imagem: SecurityError.',
    ],
    tip: 'Diagnóstico: veja no DevTools Network se o mesmo recurso aparece baixado duas vezes — quase sempre é crossorigin faltando no preload.',
  },
  {
    level: 'Pleno',
    q: 'Como funcionam Open Graph e Twitter Card meta tags?',
    a: 'Open Graph controla como a URL aparece quando compartilhada em redes sociais. og:title, og:description, og:image e og:url são os essenciais. Twitter tem namespace próprio mas lê og: como fallback.',
    bullets: [
      'og:image: mínimo 1200x630px, < 1MB para LinkedIn e Facebook.',
      'og:type: "website" (padrão), "article" (posts), "product" (e-commerce).',
      'twitter:card: "summary_large_image" para imagem full-width.',
      'Caches agressivos do Facebook — use cache-busting na URL da imagem ao atualizar.',
    ],
    tip: 'Sem og:image, WhatsApp e Telegram mostram apenas o link cru — CTR cai drasticamente em compartilhamentos.',
  },
  {
    level: 'Pleno',
    q: 'Explique a diferença entre block, inline e inline-block no fluxo normal.',
    a: 'Block: nova linha, largura 100%, aceita width/height/margin. Inline: flui no texto, ignora width/height/margin vertical. Inline-block: flui como inline mas aceita width/height/margin em todos os lados.',
    bullets: [
      'Padding-top em inline: o background expande mas NÃO empurra elementos ao redor.',
      'margin-top em span não funciona — span é inline por padrão.',
      'display: inline-block resolve o problema sem alterar o fluxo do texto.',
      'Replaced elements (img, input): se comportam como inline-block por padrão.',
    ],
    tip: '"Por que o margin-top não está funcionando?" — quase sempre é um elemento inline. Clássico de entrevista e de day-a-day.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o HTML Canvas? Quando usar Canvas vs SVG?',
    a: 'Canvas é área bitmap — você pinta pixel a pixel via JS. Uma vez pintado, o browser não sabe o que existe ali: sem DOM interno, sem eventos nativos, sem acessibilidade. SVG é markup vetorial — cada elemento é um nó DOM.',
    bullets: [
      'Canvas: 10k+ elementos dinâmicos (jogos, partículas, edição de vídeo).',
      'SVG: acessibilidade nativa, escalabilidade, eventos nativos, CSS animations.',
      'Para gráficos de dados informativos: SVG preferível (screen readers leem os valores).',
      'Canvas para WebGL (3D): biblioteca Three.js ou Babylon.js.',
    ],
    tip: 'Se o gráfico precisa ser acessível para screen readers, SVG é o único que funciona nativamente. Canvas precisa de ARIA manual e é difícil de manter.',
  },
  {
    level: 'Pleno',
    q: 'O que é o elemento template? Como usar com Web Components?',
    a: 'O elemento template é parsed pelo browser mas não renderizado — scripts não executam, imagens não baixam. É uma "planta" para instâncias reutilizáveis. template.content é um DocumentFragment.',
    bullets: [
      'template.content.cloneNode(true) cria uma cópia do template.',
      'shadowRoot.appendChild(clone) injeta no Shadow DOM.',
      'Não use appendChild diretamente sem cloneNode — a segunda instância fica vazia.',
      'Combinado com customElements.define, cria o ciclo completo de Web Component.',
    ],
    tip: 'template.content é DocumentFragment, não Element. Sempre use cloneNode(true) — a segunda instância sem clone estará vazia pois o DocumentFragment já foi movido.',
  },
  {
    level: 'Senior',
    q: 'O que é o elemento dialog nativo? Quais vantagens sobre implementações JS?',
    a: 'dialog é um elemento HTML5 nativo para modais. showModal() abre com foco automático e backdrop; close() fecha. Vantagens: focus trap automático, role="dialog" implícito, Escape fecha nativamente, backdrop via ::backdrop.',
    bullets: [
      'showModal(): cria genuine modal — foco não escapa, background com ::backdrop.',
      'show(): exibe sem bloquear — não é um modal verdadeiro.',
      'returnValue: valor retornado pelo form interno (se houver method="dialog").',
      'form method="dialog": submit fecha o dialog sem requisição HTTP.',
      'Suporte: todos os browsers modernos. IE não tem suporte.',
    ],
    tip: 'O dialog nativo faz mais do que a maioria das implementações JS: focus trap, Escape, backdrop, role="dialog" — de graça, sem código.',
  },
]

// ── Dados: CheatSheet ──────────────────────────────────────────────────────────

const SEMANTIC_ELEMENTS: HookItem[] = [
  { name: 'main',             sig: '<main>',                                 desc: 'Conteúdo principal — único por página. Landmark de a11y.' },
  { name: 'article',          sig: '<article>',                              desc: 'Conteúdo independente (post, tweet, card). Tem sentido fora da página.' },
  { name: 'section',          sig: '<section>',                              desc: 'Agrupamento temático. Deve ter heading h1-h6 como filho.' },
  { name: 'nav',              sig: '<nav aria-label="...">',                 desc: 'Bloco de links de navegação. Use aria-label quando houver múltiplos.' },
  { name: 'aside',            sig: '<aside>',                                desc: 'Conteúdo relacionado tangencialmente (sidebar, callout).' },
  { name: 'header / footer',  sig: '<header>, <footer>',                     desc: 'Cabeçalho/rodapé de documento ou de section/article. Podem ser múltiplos.' },
  { name: 'figure / figcap',  sig: '<figure><figcaption>',                   desc: 'Mídia auto-contida com legenda (imagem, código, SVG, tabela).' },
  { name: 'time',             sig: '<time datetime="2024-01-15">',           desc: 'Data/hora machine-readable. datetime em ISO 8601.' },
  { name: 'details / summary',sig: '<details><summary>',                     desc: 'Accordion nativo sem JS. Acessível nativamente.' },
  { name: 'dialog',           sig: 'el.showModal() / el.close()',            desc: 'Modal nativo com focus trap, backdrop e Escape grátis.' },
]

const PERF_ATTRS: HookItem[] = [
  { name: 'defer',              sig: '<script defer>',            desc: 'Executa após parse. Ordem preservada. Padrão para scripts de app.' },
  { name: 'async',              sig: '<script async>',            desc: 'Download paralelo, executa ao terminar. Sem ordem garantida.' },
  { name: 'type="module"',      sig: '<script type="module">',    desc: 'Módulos ES. defer por padrão + strict mode + CORS.' },
  { name: 'loading="lazy"',     sig: '<img loading="lazy">',      desc: 'Adia carregamento. NUNCA use na imagem LCP (above-the-fold).' },
  { name: 'fetchpriority',      sig: 'fetchpriority="high"',      desc: 'Prioridade máxima de download. Use na imagem hero/LCP.' },
  { name: 'rel="preload"',      sig: '<link rel="preload" as="">', desc: 'Recurso crítico — download imediato. Requer crossorigin em fontes.' },
  { name: 'rel="prefetch"',     sig: '<link rel="prefetch">',     desc: 'Próxima navegação — baixa quando idle.' },
  { name: 'rel="preconnect"',   sig: '<link rel="preconnect">',   desc: 'TCP+TLS antecipado. 150-300ms economizados para origens externas.' },
  { name: 'decoding="async"',   sig: '<img decoding="async">',    desc: 'Decodifica imagem fora do main thread.' },
]

const META_TAGS: HookItem[] = [
  { name: 'charset',             sig: '<meta charset="utf-8">',                          desc: 'PRIMEIRO elemento do head. UTF-8 = suporte a todos os caracteres Unicode.' },
  { name: 'viewport',            sig: 'width=device-width, initial-scale=1',             desc: 'Mobile-first. Nunca adicionar maximum-scale ou user-scalable=no (WCAG 1.4.4).' },
  { name: 'description',         sig: 'name="description" content="150-160 chars"',      desc: 'Snippet do SERP. 150-160 caracteres. Único por página.' },
  { name: 'canonical',           sig: '<link rel="canonical" href="...">',               desc: 'URL preferencial. Evita conteúdo duplicado no Google.' },
  { name: 'og:title/image/url',  sig: 'property="og:title"',                             desc: 'Open Graph — card de compartilhamento em redes sociais. og:image ≥ 1200×630.' },
  { name: 'twitter:card',        sig: 'name="twitter:card" content="summary_large_image"', desc: 'Twitter Cards. Lê og: como fallback.' },
  { name: 'hreflang',            sig: '<link rel="alternate" hreflang="pt-BR">',         desc: 'Versões por idioma/região. Essencial para sites multilíngues.' },
  { name: 'robots',              sig: 'name="robots" content="noindex,nofollow"',        desc: 'Controle de indexação por crawler. index/noindex, follow/nofollow.' },
]

const A11Y_ATTRS: HookItem[] = [
  { name: 'alt',               sig: 'alt="descrição" / alt=""',         desc: 'Informativa = descritivo. Decorativa = alt="" (screen reader ignora).' },
  { name: 'aria-label',        sig: 'aria-label="fechar"',              desc: 'Nome acessível direto. Quando não há texto visível.' },
  { name: 'aria-labelledby',   sig: 'aria-labelledby="heading-id"',     desc: 'Referencia outro elemento como nome. Preferível a aria-label quando há texto visível.' },
  { name: 'aria-expanded',     sig: 'aria-expanded="true/false"',       desc: 'Estado de accordion, dropdown. Atualizar via JS.' },
  { name: 'aria-hidden',       sig: 'aria-hidden="true"',               desc: 'Remove do Accessibility Tree. Use em ícones decorativos dentro de botões.' },
  { name: 'role="dialog"',     sig: 'role="dialog" aria-modal="true"',  desc: 'Modal. Combine com aria-labelledby apontando para o heading.' },
  { name: 'tabindex="0"',      sig: 'tabindex="0"',                     desc: 'Adiciona ao fluxo natural de Tab.' },
  { name: 'tabindex="-1"',     sig: 'tabindex="-1"',                    desc: 'Focável via el.focus() mas não via Tab. Para programmatic focus.' },
]

const DEP_ROWS: DepRow[] = [
  ['async', 'Download paralelo ao parse. Executa ao terminar — interrompe parser se necessário.'],
  ['defer', 'Download paralelo. Executa após parse completo. Ordem preservada.'],
  ['preload', 'Download imediato, alta prioridade. Recurso para a página atual. Requer as=".."'],
  ['prefetch', 'Download oportunístico. Para próxima navegação. Baixa prioridade (idle).'],
  ['preconnect', 'Estabelece TCP+TLS sem baixar recurso. Economiza handshake de origens externas.'],
]

const FORM_ATTRS: RuleItem[] = [
  { ok: true,  t: 'required — campo obrigatório. Validação nativa sem JS.' },
  { ok: true,  t: 'type="email" / type="url" — valida formato nativamente.' },
  { ok: true,  t: 'pattern="regex" — validação personalizada por expressão regular.' },
  { ok: true,  t: 'minlength/maxlength — comprimento de texto.' },
  { ok: true,  t: 'autocomplete="email" — melhora UX + exigido pela WCAG.' },
  { ok: true,  t: 'inputmode="numeric" — teclado numérico em mobile sem mudar type.' },
  { ok: false, t: 'novalidate sem tratamento JS — remove validação sem nada no lugar.' },
  { ok: false, t: 'label sem for/id — clique no label não foca o input. Screen reader desassocia.' },
]

const MENTAL_MODELS: string[] = [
  'Accessibility Tree = estrutura que screen readers e Googlebot usam — a mesma semântica serve os dois.',
  'defer ≠ async: defer preserva ordem e aguarda parse. async é independente e imprevisível.',
  'preload ≠ prefetch: preload é AGORA com alta prioridade. prefetch é DEPOIS com baixa.',
  'loading="lazy" na imagem hero = erro mais comum de performance disfarcado de otimização.',
  'Custom Elements + Shadow DOM + Slots + Template = Web Components — zero framework, zero JS bundle.',
  'button nativo > div role="button" — button grátis: Enter, Space, focus, disabled, keyboard events.',
]

const HTML_PATTERNS: PatternItem[] = [
  { name: 'Skip Link',        code: '<a href="#main" class="skip-link">Pular para o conteúdo</a>', desc: 'Primeiro focável da página. Visível apenas no foco. WCAG 2.4.1.' },
  { name: 'Input + Label',    code: '<label for="nome">Nome</label><input id="nome" type="text">', desc: 'for/id conectam label ao input — clique e screen reader. Alternativa: label wrapper.' },
  { name: 'OG Tags Mínimas', code: '<meta property="og:title"..><meta property="og:image"..>', desc: 'Mínimo: og:title, og:description, og:image, og:url para card social completo.' },
  { name: 'Preload Fonte',   code: '<link rel="preload" as="font" crossorigin="anonymous" href="..woff2">', desc: 'crossorigin obrigatório. Sem ele: dois downloads — um sem CORS, um com CORS.' },
]

// ── Dados: Mnemônicos ──────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'defer = D-E-F = Documento-Espera-Fim',
    trick: 'D · E · F',
    expansion: [
      ['D', 'Documento — o HTML está sendo construído'],
      ['E', 'Espera — o script aguarda pacientemente'],
      ['F', 'Fim — executa só quando o parse está completo'],
    ],
    explanation: 'defer aguarda o documento ser completamente parseado antes de executar. Ao contrário de async, a ordem entre múltiplos scripts defer é preservada. "Defer é educado: espera o documento terminar antes de agir."',
    example: '<script src="app.js" defer></script> // executa após o parse',
    why: 'O nome "defer" (adiar em inglês) já diz tudo — mas associar a D·E·F ancora melhor por ser um acrônimo verbal.',
  },
  {
    label: 'ARIA = Role, Property, State (RPS)',
    trick: 'RPS — como uma câmera',
    expansion: [
      ['R', 'Role — o que o elemento é (button, dialog, tablist)'],
      ['P', 'Property — características estáticas (aria-label, aria-required)'],
      ['S', 'State — condição dinâmica mutável (aria-expanded, aria-selected)'],
    ],
    explanation: 'Pense numa câmera fotográfica: tem Modelo (Role = tipo), tem Especificações (Properties = informação estática), tem Modo Atual (State = o que está acontecendo agora). Role raramente muda. State muda o tempo todo em runtime.',
    example: 'role="dialog" aria-label="Confirmar" aria-expanded="false"',
    why: 'Role, Property, State são categorias que parecem iguais até você usar a analogia da câmera — aí ficam claros e distintos.',
  },
  {
    label: 'preload = AGORA, prefetch = DEPOIS',
    trick: '"preload pre-SENTE, prefetch pre-FUTURO"',
    expansion: [
      ['preload', 'Recurso necessário AGORA nesta página — alta prioridade'],
      ['prefetch', 'Recurso para a PRÓXIMA navegação — baixa prioridade, idle'],
    ],
    explanation: 'Se você confundir os dois: preload numa página futura desperdiça banda (o browser baixa e descarta). prefetch num recurso atual deixa o recurso chegar tarde. "present" e "future" — duas temporalidades diferentes.',
    example: '<link rel="preload" as="font" href="..."> // página atual\n<link rel="prefetch" href="/next-page"> // próxima rota',
    why: 'O erro de confundir os dois é silencioso — o site funciona, mas ou desperdiça banda ou piora performance.',
  },
  {
    label: 'Parser Block vs Render Block',
    trick: '"Scripts param o parser, CSS para o pincel"',
    expansion: [
      ['Parser Block', 'Scripts síncronos — DOM para de ser construído'],
      ['Render Block', 'Stylesheets — DOM construído mas tela fica branca'],
    ],
    explanation: 'São mecanismos distintos que ocorrem em etapas diferentes do CRP. Parser block: o HTML não avança. Render block: o HTML avança mas o browser se recusa a pintar sem o CSSOM completo. Identificar qual ocorre guia o fix correto.',
    example: 'Script sem defer/async = parser block\n<link rel="stylesheet"> = render block',
    why: 'Diagnóstico de performance depende de identificar qual dos dois ocorre. Sem esse modelo mental, as ferramentas do DevTools parecem ruído.',
  },
  {
    label: '1ª Regra da ARIA — HTML Nativo Primeiro',
    trick: '"ARIA é o plano B. HTML é o plano A."',
    expansion: [
      ['Plano A', 'Existe elemento HTML nativo? Use-o. Sempre.'],
      ['Plano B', 'Não existe? Agora sim — use ARIA para adicionar semântica.'],
    ],
    explanation: 'button nativo tem: Enter, Space, focus via Tab, disabled, keyboard events, role="button" implícito — tudo grátis. Um div com role="button" precisa que você implemente TUDO isso manualmente. ARIA é um polyfill para semântica faltante, não um substituto para HTML correto.',
    example: '<button>Enviar</button>  // não precisa de role\n<div role="button" tabindex="0" onkeydown="..."> // muito trabalho',
    why: 'O erro é pensar que ARIA "melhora" o HTML. Na verdade, é um recurso de emergência para casos onde o HTML nativo não chega.',
  },
]

// ── Dados: Anti-patterns ───────────────────────────────────────────────────────
// CodeToken = { t: string; c?: string } — flat array, use \n para quebras de linha

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Div soup — divs para tudo',
    badDesc: 'Sem semântica — landmarks ausentes',
    badCode: [
      { t: '<div' }, { t: ' class=' }, { t: '"header"' }, { t: '>\n' },
      { t: '  <div' }, { t: ' class=' }, { t: '"nav"' }, { t: '>\n' },
      { t: '    <div' }, { t: ' class=' }, { t: '"link"' }, { t: '>Home</div>\n' },
      { t: '  </div>\n</div>\n' },
      { t: '<div' }, { t: ' class=' }, { t: '"content"' }, { t: '>\n' },
      { t: '  <div class="post">...</div>\n</div>' },
    ],
    goodDesc: 'HTML semântico — landmarks corretos',
    goodCode: [
      { t: '<header>\n  <nav>\n    <a' }, { t: ' href=' }, { t: '"/"' }, { t: '>Home</a>\n  </nav>\n</header>\n' },
      { t: '<main>\n  <article>...</article>\n</main>' },
    ],
    why: 'Divs sem semântica não criam landmarks. Screen readers e Googlebot não conseguem navegar ou entender o conteúdo. Use header, nav, main, article, section, aside, footer.',
  },
  {
    title: 'Imagem sem alt (ou alt genérico)',
    badDesc: 'alt ausente ou inútil',
    badCode: [
      { t: '<img' }, { t: ' src=' }, { t: '"produto.jpg"' }, { t: '>\n' },
      { t: '<!-- ou pior: -->\n' },
      { t: '<img' }, { t: ' src=' }, { t: '"foto.jpg"' }, { t: ' alt=' }, { t: '"imagem"', c: '#f87171' }, { t: '>' },
    ],
    goodDesc: 'alt descritivo para informativas, vazio para decorativas',
    goodCode: [
      { t: '<!-- Informativa: alt descritivo -->\n' },
      { t: '<img' }, { t: ' src=' }, { t: '"produto.jpg"\n' },
      { t: '     alt=' }, { t: '"Tênis Nike Air Max azul"', c: '#4ade80' }, { t: '>\n\n' },
      { t: '<!-- Decorativa: alt vazio -->\n' },
      { t: '<img' }, { t: ' src=' }, { t: '"divisoria.svg"' }, { t: ' alt=' }, { t: '""', c: '#4ade80' }, { t: '>' },
    ],
    why: 'Sem alt, screen readers leem o nome do arquivo. alt="imagem" é inútil. alt descritivo para informativas. alt="" para decorativas — screen reader as ignora.',
  },
  {
    title: 'label desconectado do input',
    badDesc: 'label sem associação ao input',
    badCode: [
      { t: '<label>E-mail</label>\n' },
      { t: '<input' }, { t: ' type=' }, { t: '"email"' }, { t: ' name=' }, { t: '"email"' }, { t: '>\n' },
      { t: '<!-- clique no label não foca -->', c: '#f87171' },
    ],
    goodDesc: 'label associado via for/id',
    goodCode: [
      { t: '<label' }, { t: ' for=' }, { t: '"email"', c: '#4ade80' }, { t: '>E-mail</label>\n' },
      { t: '<input' }, { t: ' id=' }, { t: '"email"', c: '#4ade80' }, { t: ' type=' }, { t: '"email"' }, { t: '>' },
    ],
    why: 'Label sem for/id não ativa o input ao clicar. Screen readers não associam o rótulo ao campo. Violação de WCAG 1.3.1.',
  },
  {
    title: 'loading="lazy" na imagem LCP',
    badDesc: 'lazy na imagem hero piora o LCP',
    badCode: [
      { t: '<!-- Imagem hero — above the fold -->\n' },
      { t: '<img\n  src=' }, { t: '"hero.jpg"\n' },
      { t: '  alt=' }, { t: '"Banner principal"\n' },
      { t: '  loading=' }, { t: '"lazy"', c: '#f87171' }, { t: '\n/>' },
    ],
    goodDesc: 'fetchpriority="high" — carrega imediatamente',
    goodCode: [
      { t: '<img\n  src=' }, { t: '"hero.jpg"\n' },
      { t: '  alt=' }, { t: '"Banner principal"\n' },
      { t: '  fetchpriority=' }, { t: '"high"', c: '#4ade80' }, { t: '\n/>' },
    ],
    why: 'loading="lazy" na imagem LCP adia exatamente o recurso mais crítico. O browser só carrega quando ela se aproxima da viewport — mas ela já está na viewport desde o início.',
  },
  {
    title: 'tabindex positivo',
    badDesc: 'ordem de foco desconectada do DOM',
    badCode: [
      { t: '<button' }, { t: ' tabindex=' }, { t: '"3"', c: '#f87171' }, { t: '>Salvar</button>\n' },
      { t: '<input' }, { t: ' tabindex=' }, { t: '"1"', c: '#f87171' }, { t: ' name=' }, { t: '"nome"' }, { t: '>\n' },
      { t: '<a' }, { t: ' tabindex=' }, { t: '"2"', c: '#f87171' }, { t: ' href=' }, { t: '"/ajuda"' }, { t: '>Ajuda</a>' },
    ],
    goodDesc: 'ordem natural do DOM — previsível',
    goodCode: [
      { t: '<!-- Ordem do DOM = ordem do Tab -->\n' },
      { t: '<input' }, { t: ' name=' }, { t: '"nome"' }, { t: '>\n' },
      { t: '<a' }, { t: ' href=' }, { t: '"/ajuda"' }, { t: '>Ajuda</a>\n' },
      { t: '<button>Salvar</button>' },
    ],
    why: 'tabindex positivo cria uma ordem de foco paralela ao DOM que confunde usuários de teclado. WCAG 2.4.3: foco deve ser lógico e previsível. Nunca use tabindex > 0.',
  },
  {
    title: 'Script síncrono no head',
    badDesc: 'bloqueia o parser — tela branca',
    badCode: [
      { t: '<head>\n  <title>Minha Página</title>\n' },
      { t: '  <script' }, { t: ' src=' }, { t: '"app.js"' }, { t: '></script>', c: '#f87171' }, { t: '\n' },
      { t: '  <link' }, { t: ' rel=' }, { t: '"stylesheet"' }, { t: ' href=' }, { t: '"style.css"' }, { t: '>\n</head>' },
    ],
    goodDesc: 'defer — executa após parse',
    goodCode: [
      { t: '<head>\n  <title>Minha Página</title>\n' },
      { t: '  <link' }, { t: ' rel=' }, { t: '"stylesheet"' }, { t: ' href=' }, { t: '"style.css"' }, { t: '>\n' },
      { t: '  <script' }, { t: ' src=' }, { t: '"app.js"' }, { t: ' defer', c: '#4ade80' }, { t: '></script>\n</head>' },
    ],
    why: 'Script síncrono no head bloqueia o parser — o browser para de construir o DOM até o script baixar e executar. defer executa após o parse, não bloqueia nada.',
  },
  {
    title: 'viewport com user-scalable=no',
    badDesc: 'bloqueia zoom — viola WCAG 1.4.4',
    badCode: [
      { t: '<meta' }, { t: ' name=' }, { t: '"viewport"\n' },
      { t: '  content=' }, { t: '"width=device-width,\n' },
      { t: '           initial-scale=1,\n' },
      { t: '           maximum-scale=1,', c: '#f87171' }, { t: '\n' },
      { t: '           user-scalable=no">', c: '#f87171' },
    ],
    goodDesc: 'sem maximum-scale — zoom habilitado',
    goodCode: [
      { t: '<meta' }, { t: ' name=' }, { t: '"viewport"\n' },
      { t: '  content=' }, { t: '"width=device-width,\n' },
      { t: '           initial-scale=1">', c: '#4ade80' },
    ],
    why: 'WCAG 1.4.4: usuários com baixa visão PRECISAM fazer zoom. Bloquear o zoom exclui pessoas com deficiência visual — violação de acessibilidade.',
  },
  {
    title: 'Headings fora de ordem',
    badDesc: 'hierarquia quebrada — pula níveis',
    badCode: [
      { t: '<h1>Título Principal</h1>\n' },
      { t: '<h3>Seção A</h3>', c: '#f87171' }, { t: ' <!-- pulou h2! -->\n', c: '#f87171' },
      { t: '<h5>Subseção</h5>', c: '#f87171' }, { t: ' <!-- pulou h4! -->\n', c: '#f87171' },
    ],
    goodDesc: 'hierarquia sequencial sem pular níveis',
    goodCode: [
      { t: '<h1>Título Principal</h1>\n' },
      { t: '<h2>Seção A</h2>\n', c: '#4ade80' },
      { t: '<h3>Subseção</h3>\n', c: '#4ade80' },
      { t: '<h2>Seção B</h2>\n', c: '#4ade80' },
      { t: '<h3>Outra Subseção</h3>', c: '#4ade80' },
    ],
    why: 'Headings criam o outline do documento. Pular níveis quebra a navegação por screen readers. Google usa a hierarquia para entender estrutura do conteúdo.',
  },
]

// ── Dados: Mindmap ─────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  { label: 'FUNDAMENTOS',  color: C, items: [
    { t: 'DOCTYPE html', k: true }, { t: 'charset UTF-8', k: true }, { t: 'block vs inline', k: true },
    { t: 'quirks mode', a: true }, { t: 'fluxo normal', a: true },
  ]},
  { label: 'SEMÂNTICA',    color: C, items: [
    { t: 'main, article, section', k: true }, { t: 'nav, aside', k: true }, { t: 'header, footer', k: true },
    { t: 'figure, figcaption', a: true }, { t: 'time, details', a: true }, { t: 'address, mark, abbr', a: true },
  ]},
  { label: 'HEAD & META',  color: C, items: [
    { t: 'viewport', k: true }, { t: 'og:* Open Graph', k: true }, { t: 'canonical', k: true },
    { t: 'hreflang', a: true }, { t: 'JSON-LD structured data', a: true }, { t: 'twitter:card', a: true },
  ]},
  { label: 'PERFORMANCE',  color: C, items: [
    { t: 'defer vs async', k: true }, { t: 'preload / prefetch', k: true }, { t: 'loading="lazy"', k: true },
    { t: 'fetchpriority', a: true }, { t: 'preconnect', a: true }, { t: 'Critical Rendering Path', a: true },
  ]},
  { label: 'FORMULÁRIOS',  color: C, items: [
    { t: 'label + for/id', k: true }, { t: 'required, pattern', k: true }, { t: 'fieldset + legend', k: true },
    { t: 'Constraint Validation API', a: true }, { t: 'datalist', a: true }, { t: 'inputmode', a: true },
  ]},
  { label: 'ACESSIBILIDADE', color: C, items: [
    { t: 'alt em img', k: true }, { t: 'tabindex 0 / -1', k: true }, { t: 'ARIA roles+states', k: true },
    { t: 'focus management', a: true }, { t: 'focus trap (modal)', a: true }, { t: 'aria-live', a: true },
  ]},
  { label: 'MÍDIA',        color: C, items: [
    { t: 'picture + source', k: true }, { t: 'srcset', k: true }, { t: 'figure + figcaption', k: true },
    { t: 'video + track', a: true }, { t: 'audio + controls', a: true }, { t: 'crossorigin', a: true },
  ]},
  { label: 'WEB COMPONENTS', color: C, items: [
    { t: 'Custom Elements', a: true }, { t: 'Shadow DOM', a: true }, { t: 'template', a: true },
    { t: 'slot', a: true }, { t: 'connectedCallback', a: true }, { t: 'attributeChangedCallback', a: true },
  ]},
  { label: 'HTML5 APIs',   color: C, items: [
    { t: 'Canvas 2D/WebGL', a: true }, { t: 'Web Storage', k: true }, { t: 'Geolocation', a: true },
    { t: 'Intersection Observer', a: true }, { t: 'dialog nativo', a: true }, { t: 'Web Workers', a: true },
  ]},
  { label: 'SEO',          color: C, items: [
    { t: 'headings hierárquicos', k: true }, { t: 'alt de imagens', k: true }, { t: 'JSON-LD', a: true },
    { t: 'canonical', a: true }, { t: 'hreflang', a: true }, { t: 'structured data', a: true },
  ]},
]

const MINDMAP_CHECKLIST: string[] = [
  'O que é o Critical Rendering Path? O que bloqueia o parser vs o render?',
  'Diferença entre defer e async — quando usar cada um?',
  'O que é preload vs prefetch? E preconnect?',
  'Por que loading="lazy" na imagem hero piora o LCP?',
  'O que são landmarks de acessibilidade? Quais os principais?',
  'Diferença entre article, section e div — quando usar cada um?',
  'Como conectar label ao input? Quais as duas formas?',
  'O que é ARIA? Qual a 1ª Regra da ARIA?',
  'Diferença entre tabindex="0" e tabindex="-1".',
  'O que é focus trap e quando implementar?',
  'Por que tabindex positivo é problemático?',
  'O que é a Constraint Validation API? Como customizar mensagens de erro?',
  'O que é quirks mode e como evitar?',
  'Por que charset deve ser o primeiro elemento do head?',
  'Diferença entre picture + source e srcset em img.',
  'O que são Web Components? Explique Custom Elements e Shadow DOM.',
  'O que é o elemento template? Por que usar cloneNode ao instanciar?',
  'O que é JSON-LD? Que tipos de rich results ele habilita?',
  'O que são Open Graph tags? Quais as dimensões corretas para og:image?',
  'Por que maximum-scale=1 no viewport é violação da WCAG?',
]

// ── Registry de Builders ───────────────────────────────────────────────────────

const PDF_BUILDERS: Record<string, PdfBuilderFn> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'HTML5',
    stackLabel: 'HTML5 / Web APIs',
    badgeLabel: 'Q&A Review',
    coverTitle: 'As 20 perguntas mais cobradas em entrevista de HTML',
    coverSubtitle: 'Semântica, acessibilidade, performance, formulários, Web Components, Critical Rendering Path e structured data. Respostas estruturadas para nível pleno e sênior.',
  }),

  cheatsheet: () => buildCheatsheetPdf({
    accentColor: C,
    skillName: 'HTML5',
    stackLabel: 'HTML5 / Web APIs',
    sections: {
      hooks: SEMANTIC_ELEMENTS,
      hooksExtra: PERF_ATTRS,
      depRows: DEP_ROWS,
      rules: FORM_ATTRS,
      patterns: HTML_PATTERNS,
      mentalModels: MENTAL_MODELS,
      performanceTips: META_TAGS.map(m => `${m.name}: ${m.desc}`),
    },
    coverTitle: 'HTML5 — Referência Rápida',
    coverSubtitle: 'Elementos semânticos, meta tags, resource hints, ARIA essencial e APIs nativas. Tudo que você precisa consultar rapidamente sem abrir a documentação.',
  }),

  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'HTML5',
    stackLabel: 'HTML5 / Web APIs',
    coverTitle: 'Os 5 truques que grudam HTML na memória',
    coverSubtitle: 'D·E·F para defer, RPS para ARIA, preload vs prefetch, parser block vs render block e a 1ª Regra da ARIA. Associações verbais que grudam antes de qualquer entrevista.',
  }),

  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'HTML5',
    stackLabel: 'HTML5 / Web APIs',
    coverTitle: 'Os 8 erros que aparecem em code review de HTML',
    coverSubtitle: 'Div soup, imagens sem alt, labels desconectados, loading="lazy" no LCP, tabindex positivo, viewport inacessível, script bloqueante e headings fora de ordem. Código errado x correto.',
  }),

  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'HTML5',
    stackLabel: 'HTML5 / Web APIs',
    coverTitle: 'HTML do zero ao sênior em uma folha',
    coverSubtitle: '10 categorias do HTML5 moderno e checklist de 20 perguntas para auto-avaliar o domínio. Use para identificar gaps antes de uma entrevista.',
  }),
}

// ── Main Export ────────────────────────────────────────────────────────────────

export default function HtmlPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)

  const featured = PDF_CARDS.find(c => c.featured)
  const collection = PDF_CARDS.filter(c => !c.featured)

  return (
    <div style={{ fontFamily: "'JetBrains Mono',monospace" }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
          <p style={{ color: FG, fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: 0.3 }}>HTML5 — Guias de bolso</p>
          <span style={{ color: C, fontSize: 11, padding: '3px 9px', borderRadius: 999, background: `${C}15`, border: `1px solid ${C}44`, fontWeight: 700 }}>
            5 PDFs · 19 páginas
          </span>
        </div>
        <p style={{ color: FGMUTE, fontSize: 12, margin: 0, lineHeight: 1.65, maxWidth: 720 }}>
          Artefatos de revisão cognitiva para estudo espaçado. Cada PDF é pensado para um objetivo diferente — recuperação ativa, consulta rápida, memória de longo prazo, reconhecimento de padrão e mapeamento mental do HTML5 inteiro.
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
