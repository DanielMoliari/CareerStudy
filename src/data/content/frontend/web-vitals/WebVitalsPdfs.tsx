'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'

// ── Paleta Web Vitals ─────────────────────────────────────────────────────────
const C = '#22c55e'  // verde — performance/bons scores

// ── Cards dos PDFs ────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre Core Web Vitals em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: LCP vs INP vs CLS, lab vs field data, diagnóstico com DevTools, scheduler.yield(), LHCI em CI, next/image e next/font, CrUX, TTFB, session windows de CLS e tudo que entrevistadores sênior realmente perguntam sobre performance web.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'Limites, causas e fixes dos 3 Core Web Vitals em uma folha',
    type: 'quick-ref',
    pages: 1,
    description: 'Cartão de bolso ultra-compacto: limites bom/médio/ruim de cada CWV, principais causas, fixes diretos, ferramentas de lab e field. Para revisar antes de entrevista ou consultar durante debugging de performance.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques para grudar Core Web Vitals na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'LIC (Loading, Interactivity, Cumulative), PCW para fixes de LCP, SFS para CLS zero, INP vs FID (visita inteira vs primeira interação), e Lab vs Field (Lighthouse é Lab, Google usa Field). Âncoras cognitivas para nunca confundir as métricas.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
]

// ── Q&A Data ──────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    q: 'O que são Core Web Vitals e por que importam?',
    a: 'LCP (velocidade de carregamento percebida), INP (responsividade a interações) e CLS (estabilidade visual). Importam porque afetam ranking SEO do Google e refletem problemas reais de UX.',
    tip: 'Conectar cada métrica a uma causa que você controla como dev mostra que você entende além das definições.',
    level: 'Pleno',
  },
  {
    q: 'O que causa LCP ruim e como corrigir?',
    a: 'Imagem hero sem preload, TTFB alto, render-blocking CSS/JS, imagem pesada. Fix: <link rel=preload as=image> + fetchpriority=high, CDN, WebP/AVIF, next/image com priority prop.',
    tip: 'Preload do LCP element com fetchpriority=high é o fix mais impactante e menos conhecido.',
    level: 'Pleno',
  },
  {
    q: 'Por que INP substituiu FID como Core Web Vital?',
    a: 'FID media só a primeira interação. INP mede o P98 de TODAS as interações durante toda a visita. INP é mais representativo de apps interativos. Mudança em março de 2024.',
    tip: 'Mencionar P98 (percentil 98) mostra leitura profunda da especificação.',
    level: 'Senior',
  },
  {
    q: 'O que causa CLS e como evitar em React?',
    a: 'Imagens sem width/height, FOUT de fontes (swap), conteúdo async empurrando layout, animações com top/left. Fix: width/height em imgs, font-display: optional, skeletons, transform em animações.',
    tip: 'Citar next/image e next/font como soluções automáticas mostra conhecimento do ecossistema.',
    level: 'Pleno',
  },
  {
    q: 'Qual a diferença entre lab data e field data?',
    a: 'Lab data (Lighthouse, WebPageTest): condições controladas, reproduzível, bom para debug. Field data (CrUX): usuários reais, dispositivos variados. Google usa FIELD data para ranking — não Lighthouse.',
    tip: 'Excelente score no Lighthouse não garante bons CWV no Search Console — isso é frequentemente ignorado.',
    level: 'Senior',
  },
  {
    q: 'Como monitorar Core Web Vitals em produção?',
    a: 'web-vitals library: onLCP, onINP, onCLS callbacks com sendBeacon. Search Console: field data gratuito com delay. Vercel Speed Insights / Datadog RUM: dashboards em tempo real. LHCI no CI para prevenir regressões.',
    tip: 'Mostrar o LHCI em CI (bloquear merge com regressão) é o diferencial de sênior.',
    level: 'Senior',
  },
  {
    q: 'Como o LCP é calculado pelo browser?',
    a: 'O browser rastreia todos os candidatos (imagens, blocos de texto, vídeos com poster) e reporta o maior elemento visível quando o usuário interage ou a página termina. O LCP pode mudar durante o carregamento.',
    tip: 'O LCP pode mudar durante o carregamento é um detalhe que poucos mencionam.',
    level: 'Senior',
  },
  {
    q: 'O que é TTFB e como afeta o LCP?',
    a: 'Time to First Byte: tempo até o primeiro byte da resposta do servidor. TTFB alto impede parsing do HTML e descoberta de recursos. Meta: ≤600ms. Fix: CDN, cache, edge rendering.',
    tip: 'TTFB alto torna inútil qualquer preload de imagem — mencionar isso mostra pensamento sistêmico.',
    level: 'Pleno',
  },
  {
    q: 'O que são long tasks e como afetam INP?',
    a: 'Long tasks bloqueiam o main thread por mais de 50ms. Durante uma long task, eventos do usuário não são processados — causando INP alto. Fix: scheduler.yield() a cada ~50 iterações, Web Workers, code splitting.',
    tip: 'scheduler.yield() é API nova — citar isso posiciona na vanguarda das otimizações.',
    level: 'Senior',
  },
  {
    q: 'Como usar a biblioteca web-vitals?',
    a: 'import { onCLS, onINP, onLCP } from "web-vitals". Cada callback recebe { name, value, delta, id, rating }. rating = "good" | "needs-improvement" | "poor". Enviar com navigator.sendBeacon ou fetch para analytics.',
    tip: 'Mostrar o shape do objeto métrica (name, value, delta, rating) demonstra uso prático real.',
    level: 'Pleno',
  },
  {
    q: 'O que é CrUX e como o Google o usa?',
    a: 'Chrome UX Report: dataset público de field data de usuários Chrome. Google usa para Page Experience signal de ranking. URLs precisam de volume suficiente (~1000 visitas/28 dias) — se não, avalia a origin inteira.',
    tip: 'O detalhe de URL level vs origin level aparece em auditorias de SEO e é desconhecido pela maioria.',
    level: 'Senior',
  },
  {
    q: 'Como Next.js otimiza Core Web Vitals automaticamente?',
    a: 'next/image com priority: preload automático, WebP/AVIF, zero CLS com width/height. next/font: font-display: optional + size-adjust elimina FOUT. next/script strategy: controla loading de scripts externos.',
    tip: 'Conectar cada componente (next/image, next/font, next/script) à métrica que otimiza é o diferencial de Next.js sênior.',
    level: 'Senior',
  },
  {
    q: 'Como otimizar INP em lista com filtros?',
    a: 'Problema: re-render de lista inteira bloqueia main thread. Fix: useDeferredValue (input responde imediatamente, lista atualiza quando browser tem tempo). Virtualização com @tanstack/virtual. Debounce no input.',
    tip: 'Citar useDeferredValue especificamente para INP é o link React + performance que entrevistadores querem.',
    level: 'Senior',
  },
  {
    q: 'O que é font-display: optional e por que é melhor para CLS?',
    a: 'optional: usa a fonte só se já estiver no cache — zero FOUT. swap: texto visível com fallback, depois troca — causa CLS. Next.js font usa size-adjust CSS para fazer o fallback ter as mesmas métricas da fonte final.',
    tip: 'Explicar size-adjust como a técnica do Next.js para font CLS zero é detalhe que diferencia senioridade.',
    level: 'Senior',
  },
  {
    q: 'Como configurar Lighthouse CI para prevenir regressões?',
    a: 'npm install -g @lhci/cli. lighthouserc.js com assertions por categoria e métrica. GitHub Actions: lhci autorun após build. Exemplo: "largest-contentful-paint": ["error", { maxNumericValue: 2500 }].',
    tip: 'Rodar LHCI em CI real (não só Lighthouse local) diferencia quem estudou de quem praticou.',
    level: 'Senior',
  },
  {
    q: 'O que é Total Blocking Time e como se relaciona com INP?',
    a: 'TBT: tempo total de bloqueio do main thread entre FCP e TTI. É proxy para INP em lab data (onde INP não pode ser medido sem interação real). TBT <200ms em Lighthouse sugere INP provavelmente bom em produção.',
    tip: 'Entender TBT como proxy para INP conecta métricas de debug com métricas de produção.',
    level: 'Senior',
  },
  {
    q: 'Como o CLS é calculado com session windows?',
    a: 'CLS não soma todos os shifts — usa a maior session window: janela onde shifts acontecem próximos (≤1s entre shifts, máx 5s). Cada shift = impact_fraction × distance_fraction. Shifts por interação do usuário não contam.',
    tip: 'Session windows é a parte mais técnica do CLS — mencionar isso demonstra leitura da especificação.',
    level: 'Senior',
  },
  {
    q: 'Como diferenciar LCP ruim por servidor vs por cliente?',
    a: 'Waterfall no DevTools: TTFB alto = problema de servidor (CDN, cache, edge). Render-blocking = scripts no head sem defer. Late discovery = imagem LCP no CSS ou JS — browser só descobre depois de parsear. Fix: preload.',
    tip: 'Late discovery como causa de LCP é o diagnóstico prático que demonstra experiência real.',
    level: 'Senior',
  },
  {
    q: 'O que é fetchpriority=high e como difere do preload?',
    a: 'preload: hint para o browser descobrir o recurso mais cedo (late discovery fix). fetchpriority=high: instrui o browser a priorizar o download sobre outros recursos. Use ambos no LCP element para máximo impacto.',
    tip: 'A distinção entre preload (descoberta) e fetchpriority (prioridade de download) é o nível de detalhe que impressiona.',
    level: 'Senior',
  },
  {
    q: 'O que são FCP, TTFB e TBT e quando usar cada um?',
    a: 'FCP (First Contentful Paint): primeiro conteúdo visível — proxy de TTFB + render-blocking. TTFB: fundação de LCP. TBT: proxy de INP em lab. São métricas de DIAGNÓSTICO — o Google usa LCP, INP e CLS para ranking, não essas.',
    tip: 'Separar métricas de diagnóstico das de ranking é o que diferencia quem estuda de quem pratica.',
    level: 'Pleno',
  },
]

// ── Quick Reference Data ──────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'LCP — Largest Contentful Paint',
        entries: [
          { key: 'Bom', value: '≤ 2.5s', badge: 'green', badgeColor: '#22c55e' },
          { key: 'Médio', value: '≤ 4s', badge: 'yellow', badgeColor: '#f59e0b' },
          { key: 'Ruim', value: '> 4s', badge: 'red', badgeColor: '#ef4444' },
          { key: 'Mede', value: 'Velocidade de carregamento percebida' },
          { key: 'Causa 1', value: 'Imagem hero sem preload' },
          { key: 'Causa 2', value: 'TTFB alto (sem CDN)' },
          { key: 'Causa 3', value: 'Render-blocking CSS/JS' },
          { key: 'Fix 1', value: '<link rel=preload as=image fetchpriority=high>' },
          { key: 'Fix 2', value: 'CDN + cache de resposta' },
          { key: 'Fix 3', value: 'WebP/AVIF + next/image priority' },
        ],
      },
      {
        title: 'INP — Interaction to Next Paint',
        entries: [
          { key: 'Bom', value: '≤ 200ms', badge: 'green', badgeColor: '#22c55e' },
          { key: 'Médio', value: '≤ 500ms', badge: 'yellow', badgeColor: '#f59e0b' },
          { key: 'Ruim', value: '> 500ms', badge: 'red', badgeColor: '#ef4444' },
          { key: 'Mede', value: 'P98 das interações da visita inteira' },
          { key: 'Causa 1', value: 'Long tasks (>50ms) no main thread' },
          { key: 'Causa 2', value: 'Re-render de lista grande' },
          { key: 'Fix 1', value: 'scheduler.yield()' },
          { key: 'Fix 2', value: 'useDeferredValue (React 18+)' },
          { key: 'Fix 3', value: 'Virtualização (@tanstack/virtual)' },
          { key: 'Note', value: 'Substituiu FID em março 2024' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'CLS — Cumulative Layout Shift',
        entries: [
          { key: 'Bom', value: '≤ 0.1', badge: 'green', badgeColor: '#22c55e' },
          { key: 'Médio', value: '≤ 0.25', badge: 'yellow', badgeColor: '#f59e0b' },
          { key: 'Ruim', value: '> 0.25', badge: 'red', badgeColor: '#ef4444' },
          { key: 'Mede', value: 'Shifts de layout inesperados (session window)' },
          { key: 'Causa 1', value: 'Imagens sem width/height' },
          { key: 'Causa 2', value: 'FOUT: font-display: swap' },
          { key: 'Causa 3', value: 'Conteúdo async empurrando layout' },
          { key: 'Fix 1', value: 'width/height em todas as imagens' },
          { key: 'Fix 2', value: 'font-display: optional + preload' },
          { key: 'Fix 3', value: 'Skeleton com tamanho fixo' },
        ],
      },
      {
        title: 'Ferramentas',
        entries: [
          { key: 'Lab', value: 'Lighthouse, DevTools Performance, WebPageTest' },
          { key: 'Field', value: 'web-vitals lib, Search Console, CrUX' },
          { key: 'RUM', value: 'Vercel Speed Insights, Datadog RUM' },
          { key: 'CI', value: '@lhci/cli — bloqueia merge com regressão' },
          { key: 'PSI', value: 'pagespeed.web.dev — lab + field por URL' },
          { key: 'Ranking', value: 'Google usa field data (CrUX), não Lighthouse' },
        ],
      },
      {
        title: 'Next.js automático',
        entries: [
          { key: 'LCP', value: 'next/image priority → preload + fetchpriority' },
          { key: 'CLS img', value: 'next/image → width/height obrigatório' },
          { key: 'CLS font', value: 'next/font → font-display: optional + size-adjust' },
          { key: 'Scripts', value: 'next/script strategy: afterInteractive, lazyOnload' },
          { key: 'INP', value: 'RSC reduz JS; PPR reduz hydration cost' },
        ],
      },
    ],
  },
]

// ── Mnemonics Data ────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'LIC — as 3 métricas Core',
    trick: 'LIC: Loading, Interactivity, Cumulative',
    expansion: [
      ['L — LCP', 'Largest Contentful Paint: carregamento percebido do maior elemento visível'],
      ['I — INP', 'Interaction to Next Paint: responsividade a inputs do usuário'],
      ['C — CLS', 'Cumulative Layout Shift: estabilidade visual, zero saltos de layout'],
    ],
    explanation: 'LIC cobre a experiência do usuário do carregamento à navegação interativa. L = loading percebido, I = interatividade, C = estabilidade visual.',
    example: 'LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 — os três limites "Good" do CrUX.',
    why: 'Google usa exatamente essas 3 métricas para ranking de busca (Core Web Vitals). Memorizar LIC garante que você cobre o que realmente importa.',
  },
  {
    label: 'PCW — fixes de LCP',
    trick: 'PCW: Preload, CDN, WebP',
    expansion: [
      ['P — Preload', 'fetchpriority=high no hero image; preload no critical CSS/font'],
      ['C — CDN', 'TTFB baixo via edge CDN reduz diretamente o LCP'],
      ['W — WebP/AVIF', 'Formatos modernos reduzem tamanho sem perda de qualidade percebida'],
    ],
    explanation: 'As 3 alavancas mais impactantes para LCP, em ordem de prioridade: primeiro elimine descoberta tardia (Preload), depois latência de rede (CDN), depois tamanho do payload (WebP).',
    example: '<img src="hero.webp" fetchpriority="high" width="1200" height="630" alt="...">',
    why: 'LCP é a métrica com maior correlação com bounce rate. Preload resolve >50% dos casos de LCP ruim sozinho.',
  },
  {
    label: 'SFS — CLS zero',
    trick: 'SFS: Size, Font, Skeleton',
    expansion: [
      ['S — Size', 'width/height em toda <img> — browser reserva espaço antes de carregar'],
      ['F — Font', 'font-display:optional evita FOUT que desloca texto'],
      ['S — Skeleton', 'Placeholder com tamanho fixo para conteúdo async (ads, embeds)'],
    ],
    explanation: 'SFS = Sem Layout Shift. Cada letra elimina uma fonte clássica de CLS: imagens sem dimensões, fontes piscando, conteúdo dinâmico sem reserva de espaço.',
    example: 'aspect-ratio: 16/9 em imagens responsive mantém o espaço reservado mesmo sem width/height fixos.',
    why: 'CLS >0.1 penaliza ranking. As 3 causas de CLS cobrem >90% dos casos reais — SFS é a checklist mínima.',
  },
  {
    label: 'INP vs FID — toda a visita',
    trick: 'INP = TODAS as interações, FID = Primeira',
    expansion: [
      ['INP', 'Mede P98 de TODAS as interações durante a visita inteira'],
      ['FID', 'Mediu apenas a primeira interação — aposentado em 2024'],
    ],
    explanation: 'FID media só a primeira interação e foi substituído. INP mede o P98 de TODAS as interações durante toda a visita. Se 2 em 100 interações são lentas, INP captura essas 2.',
    example: 'Um site com click no menu rápido mas accordion lento tem FID "Good" e INP "Needs Improvement".',
    why: 'INP é mais honesto sobre a experiência real. Long tasks no main thread (JS pesado) são a causa principal — use scheduler.yield() e web workers.',
  },
  {
    label: 'Lab vs Field — ranking',
    trick: 'Lighthouse é Lab, Google usa Field',
    expansion: [
      ['Lab', 'Lighthouse, WebPageTest: ambiente controlado, sem usuários reais'],
      ['Field', 'CrUX, Search Console, RUM: dados de usuários Chrome reais'],
    ],
    explanation: 'Lighthouse e WebPageTest são lab data — úteis para debugging mas não representam usuários reais. CrUX e Search Console são field data. O Google usa FIELD data para ranking — não lab.',
    example: 'Lighthouse 100 mas CrUX mostra LCP ruim em mobile 4G = ranking penalizado. Field sempre ganha.',
    why: 'Desenvolvedores otimizam para Lighthouse mas Google rankeia pelo CrUX. Monitorar RUM (field) é obrigatório para entender impacto real.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Core Web Vitals',
    stackLabel: 'Frontend / Performance',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'Core Web Vitals',
    accentColor: C,
    stackLabel: 'Frontend / Performance',
    tagline: 'LCP ≤2.5s · INP ≤200ms · CLS ≤0.1',
    version: '2024',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Core Web Vitals',
    stackLabel: 'Frontend / Performance',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function WebVitalsPdfs() {
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
      {open && (
        <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />
      )}
    </>
  )
}
