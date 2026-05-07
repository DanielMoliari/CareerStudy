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

// ── Paleta HTTP Versions ──────────────────────────────────────────────────────
const C = '#06b6d4'  // cyan — protocolos de rede

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 18 perguntas de HTTP/2 e HTTP/3 mais cobradas em entrevista sênior',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: multiplexing, HPACK, Head-of-Line Blocking, QUIC, 0-RTT replay risk, Alt-Svc, Connection ID, rate limit com HTTP/2, RTTs por versão e todos os conceitos que entrevistadores sênior realmente perguntam.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'HTTP/1.1 vs HTTP/2 vs HTTP/3 — cartão de bolso A4 landscape',
    type: 'quick-ref',
    pages: 1,
    description: 'Comparação rápida das 3 versões em RTT, HoL, multiplexing, headers e adoção. Comandos curl para diagnóstico. Headers Alt-Svc. Configuração nginx. Antipadrões. Ideal para revisar antes de entrevista.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam HTTP/2 e HTTP/3 na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'Onde ocorre HoL por versão, contagem de RTTs (3.5→2→1→0), o que cada letra de QUIC representa, por que Server Push morreu, e como Alt-Svc negocia HTTP/3 — cada um com âncora verbal memorável.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que HTTP/2 melhorou em relação ao HTTP/1.1?',
    a: 'Quatro melhorias principais: <strong>Multiplexing</strong> (N streams em 1 TCP, sem fila serial), <strong>HPACK</strong> (compressão de headers com dicionário dinâmico), <strong>Binary framing</strong> (frames HEADERS/DATA em vez de ASCII) e <strong>Stream priority</strong> (hints de prioridade para o servidor). Server Push foi incluído mas está deprecated — browsers removeram o suporte.',
    tip: 'Cite os 4 pilares e já aponte que Server Push morreu. Demonstra conhecimento atualizado sem precisar ser perguntado.',
  },
  {
    level: 'Senior',
    q: 'Qual o problema fundamental do HTTP/2 e como o HTTP/3 resolve?',
    a: '<strong>Head-of-line blocking em TCP</strong>. HTTP/2 multiplexa em camada de app, mas TCP exige entrega ordenada — um pacote perdido segura todos os streams. Em redes com 1% de perda, HTTP/2 pode ser pior que HTTP/1.1 com 6 conexões paralelas. HTTP/3 move os streams para QUIC (sobre UDP) onde cada stream tem controle de fluxo independente: loss no stream 3 não bloqueia o stream 5.',
    tip: 'O dado de 1% de perda é o que demonstra entendimento profundo — conecta teoria com cenário real (mobile, wifi instável).',
  },
  {
    level: 'Senior',
    q: 'O que é QUIC e quais são suas 4 características fundamentais?',
    a: 'QUIC (RFC 9000) é protocolo de transporte sobre UDP implementado em userspace. Características: <strong>Streams independentes</strong> (loss num stream não afeta outros), <strong>TLS 1.3 integrado</strong> (1 RTT para nova conexão), <strong>0-RTT</strong> para reconexão (dados na primeira mensagem), <strong>Connection ID</strong> (identifica conexão independente de IP — permite migração wifi→4G sem reconexão).',
    tip: 'QUIC: Q=UDP, U=userspace, I=integrado TLS, C=Connection ID. Cada letra é uma característica. Memorável e completo.',
  },
  {
    level: 'Senior',
    q: 'Quantos RTTs são necessários em cada versão do HTTP antes dos dados?',
    a: '<strong>HTTP/1.1 + TLS 1.2</strong>: 3.5 RTT (TCP 1-RTT + TLS 1.2 2-RTT). <strong>HTTP/2 + TLS 1.3</strong>: 2 RTT (TCP 1-RTT + TLS 1.3 1-RTT). <strong>HTTP/3 nova conexão</strong>: 1 RTT (QUIC integra TCP+TLS). <strong>QUIC 0-RTT</strong>: dados na primeira mensagem — 0 RTT adicional para reconexão. Em 100ms de RTT, HTTP/3 economiza 200-350ms só no handshake.',
    tip: 'Quantificar os RTTs (3.5→2→1→0) transforma uma descrição abstrata em números memoráveis. Use "em 100ms de RTT" para tornar concreto.',
  },
  {
    level: 'Pleno',
    q: 'O que é HPACK e por que é importante?',
    a: 'HPACK (RFC 7541) comprime headers HTTP/2 com tabela estática (61 entradas pré-definidas) e tabela dinâmica (headers vistos na conexão). Headers repetidos como Authorization e User-Agent viram uma referência de 1 byte. Em APIs chatty, headers representavam 50-90% do payload — HPACK elimina esse overhead. HTTP/3 usa QPACK (RFC 9204), versão adaptada para streams independentes do QUIC.',
    tip: 'Mencionar QPACK como versão do HPACK para HTTP/3 demonstra que você entende por que HPACK não pode ser usado diretamente com QUIC.',
  },
  {
    level: 'Pleno',
    q: 'Por que Server Push foi abandonado? O que o substituiu?',
    a: 'Server Push enviava recursos antes do cliente pedir — mas o servidor não sabia o que estava em cache no browser, desperdiçava bandwidth com recursos já cacheados, e era difícil de coordenar com CDNs. Na prática, ganho foi marginal e implementação complexa. Substituto: <strong>103 Early Hints</strong>. Server retorna Link: rel=preload e o browser decide se faz fetch — respeita cache, CDN-friendly, sem adivinhação.',
    tip: 'Mencionar 103 Early Hints como substituto demonstra que você está atualizado. É o que Cloudflare, Fastly e nginx 1.25+ implementam.',
  },
  {
    level: 'Senior',
    q: 'Como HTTP/3 é negociado? O que é Alt-Svc?',
    a: 'HTTP/3 não tem porta padrão dedicada. Negociação via <strong>Alt-Svc</strong> (Alternative Services): server inclui <code>Alt-Svc: h3=":443"; ma=86400</code> nas respostas HTTP/2. Browser salva esse hint e tenta QUIC/UDP na próxima visita. Se QUIC falhar (firewall UDP), fallback automático para TCP. Por isso HTTP/3 tem adoção gradual sem breaking change.',
    tip: 'Explicar o fallback automático é crucial — sem ele, candidatos acham que HTTP/3 precisa de migração planejada, o que não é verdade.',
  },
  {
    level: 'Senior',
    q: 'Qual o risco do 0-RTT no QUIC e quando não usar?',
    a: '0-RTT permite enviar dados na primeira mensagem usando session ticket da conexão anterior. <strong>Risco</strong>: replay attack — atacante que intercepta o 0-RTT data pode reenviar a mesma mensagem. Se o endpoint for POST /transfer, pode repetir a operação. <strong>Regra</strong>: 0-RTT só seguro em endpoints idempotentes (GET, HEAD). Endpoints com efeito colateral devem rejeitar via header <code>Early-Data</code> ou aguardar 1-RTT completo.',
    tip: 'Saber o vetor de replay e a mitigação (Early-Data header) é o que diferencia sênior de pleno neste tópico.',
  },
  {
    level: 'Senior',
    q: 'Como QUIC permite migração de IP? Por que isso importa para mobile?',
    a: 'QUIC identifica conexões via <strong>Connection ID</strong> de 64 bits — independente de IP e porta. Quando o device troca de rede (wifi→4G), o IP muda, mas o Connection ID persiste. Com TCP: nova conexão + handshake + interrupção perceptível. Com QUIC: server reconhece o mesmo Connection ID em novo IP, e a conexão continua sem interrupção. Caso real: Google Docs em rede móvel instável.',
    tip: 'Connection ID é o conceito mais diferente em relação ao TCP. Saber isso demonstra leitura do RFC 9000.',
  },
  {
    level: 'Senior',
    q: 'Como rate limiting interage com HTTP/2?',
    a: 'HTTP/1.1: 1 conexão TCP ≈ 1 request ativo. Rate limit por conexão TCP funcionava. HTTP/2: 1 conexão TCP = centenas de streams simultâneos. Rate limit por conexão TCP = ilusório (1 count para 100 requests). A solução: rate limit deve operar em <strong>L7 (camada de aplicação)</strong>, contando cada request HTTP (stream) individualmente. Nginx limit_req e Envoy ratelimit service fazem isso. L4 load balancers não conseguem.',
    tip: 'A distinção L4 vs L7 para rate limit com HTTP/2 é o tipo de cross-concern que entrevistadores sênior adoram.',
  },
  {
    level: 'Pleno',
    q: 'Por que domain sharding é antipadrão em HTTP/2?',
    a: 'Em HTTP/1.1, domain sharding (assets em static1.cdn.com, static2.cdn.com) era necessário para contornar o limite de 6 conexões TCP por host. Em HTTP/2, uma conexão suporta N streams — domain sharding é contraproducente: perde HPACK (tabela dinâmica por conexão é zerada para cada domínio), perde multiplexing eficiente, adiciona latência de DNS. Em HTTP/2, consolidar domínios é melhor.',
    tip: 'Domain sharding como antipadrão em HTTP/2 demonstra entendimento histórico — otimização de HTTP/1.1 que vira prejuízo em HTTP/2.',
  },
  {
    level: 'Pleno',
    q: 'Como verificar qual versão HTTP está sendo usada em produção?',
    a: 'Métodos práticos: <strong>Chrome DevTools</strong> → Network → coluna Protocol (h2, h3, http/1.1). <strong>curl</strong>: <code>curl -I --http2 https://host</code> ou <code>--http3</code>. <strong>Resposta com Alt-Svc</strong>: <code>Alt-Svc: h3=":443"</code> confirma suporte HTTP/3. <strong>nginx access log</strong>: variável <code>$http_version</code>. <strong>nghttp2</strong>: <code>nghttp -v https://host</code> mostra frames HTTP/2 em detalhe.',
    tip: 'Mostrar o Alt-Svc header é o detalhe que demonstra entendimento de como HTTP/3 é negociado — é opcional, não uma porta fixa.',
  },
  {
    level: 'Senior',
    q: 'Quais são as vantagens e limitações do gRPC sobre HTTP/2?',
    a: '<strong>Vantagens</strong>: Protobuf (5-10× menor que JSON), streaming bidirecional, multiplexing, code generation tipado. <strong>Limitações</strong>: não funciona no browser sem gRPC-Web ou gRPC-Gateway, debugging difícil (binário), firewalls com deep packet inspection podem bloquear, load balancers L4 não distribuem por stream (precisam de L7 ou service mesh). <strong>O problema real em produção</strong>: uma conexão HTTP/2 persistent fica num único pod — sem distribuição real com L4.',
    tip: 'O problema do load balancer L4 com gRPC é a armadilha mais comum em produção. Mencionar service mesh (Istio, Linkerd) como solução demonstra experiência operacional.',
  },
  {
    level: 'Pleno',
    q: 'O que é binary framing no HTTP/2 e por que importa para segurança?',
    a: 'HTTP/1.1 é texto ASCII — parsing requer identificar \\r\\n, headers por ": ", corpo por Content-Length. É propenso a ambiguidades (request smuggling, line folding). HTTP/2 usa frames binários com estrutura fixa de 9 bytes de header (length, type, flags, stream ID). Parsing determinístico, sem ambiguidade. Request smuggling que afetava HTTP/1.1 (TE/CL conflict) não existe em HTTP/2 — é eliminado pelo design.',
    tip: 'Request smuggling como vulnerabilidade do protocolo textual contextualiza binary framing como melhoria de segurança, não só de performance.',
  },
  {
    level: 'Senior',
    q: 'Quando escolher HTTP/2 vs HTTP/3 para microsserviços internos?',
    a: '<strong>HTTP/2/gRPC — padrão para microsserviços</strong>: infra interna confiável (baixa perda de pacote, HoL TCP não é problema real), ecossistema maduro (service mesh, interceptors, grpcurl), Istio faz mTLS automaticamente. <strong>HTTP/3 — considerar quando</strong>: APIs expostas a mobile em redes instáveis (CDN→cliente), alta latência/packet loss, necessidade de migração de IP. Regra prática: datacenters → HTTP/2/gRPC. Edge → cliente final → HTTP/3.',
    tip: 'A distinção datacenter vs edge é a estrutura mental simples que resolve 90% das perguntas sobre quando usar cada versão.',
  },
  {
    level: 'Senior',
    q: 'Como configurar HTTP/2 e HTTP/3 no nginx?',
    a: '<strong>HTTP/2</strong>: <code>listen 443 ssl http2;</code> — requer TLS. <strong>HTTP/3</strong>: <code>listen 443 quic reuseport;</code> (nginx 1.25+ com ngx_http_v3_module) + <code>add_header Alt-Svc \'h3=":443"; ma=86400\';</code>. Detalhe crítico: <code>reuseport</code> é obrigatório para QUIC funcionar com múltiplos worker processes. Verificar com: <code>curl -I --http2 https://host</code> e <code>curl -I --http3 https://host</code> (curl 7.88+ com quiche).',
    tip: 'O reuseport obrigatório no listen quic é o detalhe operacional que a maioria dos tutoriais omite.',
  },
  {
    level: 'Senior',
    q: 'Por que TCP HoL blocking é difícil de resolver sem mudar o protocolo?',
    a: 'TCP garante entrega ordenada implementado no kernel — a interface para a aplicação é um byte stream ordenado. Quando um pacote é perdido, o kernel retém os pacotes subsequentes (já no buffer) até retransmissão e reordenação. A aplicação (HTTP/2) não tem visibilidade ou controle. Resolver exigiria mudar todos os kernels (anos de rollout). QUIC contorna implementando o transporte em userspace sobre UDP — pode ser atualizado independentemente do kernel.',
    tip: '"Implementado no kernel, interface é byte stream" é o que demonstra entendimento real da limitação — não é escolha de design do HTTP/2, é limite fundamental do TCP.',
  },
  {
    level: 'Pleno',
    q: 'O que é 103 Early Hints e como funciona?',
    a: '103 Early Hints é uma resposta HTTP intermediária enviada enquanto o servidor processa a request. Inclui header <code>Link: rel=preload</code> para CSS, fontes e scripts críticos. Browser inicia fetch desses recursos imediatamente, em paralelo com o processamento do servidor. Resultado: quando o 200 OK chega, recursos críticos já estão em cache ou em download. Suportado por Chrome, Cloudflare, Fastly, nginx 1.25+. Ganho real em LCP (Largest Contentful Paint).',
    tip: 'Mencionar o impacto em LCP e os sistemas que já suportam demonstra que você entende o contexto prático e não está apenas citando a especificação.',
  },
]

// ── Dados: Quick Reference ────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Versões Comparadas',
        entries: [
          { key: 'Transport',    value: '1.1: TCP  |  2: TCP  |  3: QUIC/UDP' },
          { key: 'Multiplexing', value: '1.1: ✗  |  2: app layer  |  3: transport layer' },
          { key: 'HoL Blocking', value: '1.1: app+TCP  |  2: só TCP  |  3: ✗' },
          { key: 'RTT Handshk',  value: '1.1: 3.5  |  2: 2  |  3: 1 (0 resume)', badge: 'key', badgeColor: '#06b6d4' },
          { key: 'TLS',          value: '1.1: opcional  |  2: obrig.  |  3: integrado' },
          { key: 'Headers',      value: '1.1: ASCII  |  2: HPACK  |  3: QPACK' },
          { key: 'IP Migration', value: '1.1+2: ✗  |  3: ✓ Connection ID' },
        ],
      },
      {
        title: 'QUIC — Características',
        entries: [
          { key: 'RFC',         value: 'RFC 9000 (2021)' },
          { key: 'Transport',   value: 'UDP (userspace)' },
          { key: 'TLS',         value: '1.3 integrado obrigatório' },
          { key: '0-RTT',       value: 'Sim (replay risk em POST!)', badge: 'warn', badgeColor: '#f59e0b' },
          { key: 'Negocia via', value: 'Alt-Svc: h3=":443"' },
          { key: 'Adoção 2026', value: 'Cloudflare, Google, Fastly' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Diagnóstico',
        entries: [
          { key: 'curl HTTP/2',  value: 'curl -I --http2 https://host' },
          { key: 'curl HTTP/3',  value: 'curl -I --http3 https://host' },
          { key: 'DevTools',     value: 'Network → Protocol: h2/h3' },
          { key: 'Alt-Svc',      value: 'Alt-Svc: h3=":443"; ma=86400' },
          { key: 'nginx H2',     value: 'listen 443 ssl http2;' },
          { key: 'nginx H3',     value: 'listen 443 quic reuseport;' },
        ],
      },
      {
        title: 'Antipadrões',
        entries: [
          { key: '✗ Domain sharding', value: 'HTTP/2: perde HPACK e multiplexing', badge: 'ruim', badgeColor: '#ef4444' },
          { key: '✗ Server Push',     value: 'Deprecated — use 103 Early Hints', badge: 'ruim', badgeColor: '#ef4444' },
          { key: '✗ 0-RTT em POST',   value: 'Replay attack — só em GET', badge: 'ruim', badgeColor: '#ef4444' },
          { key: '✗ Rate limit TCP',  value: 'HTTP/2 tem N streams por TCP', badge: 'ruim', badgeColor: '#ef4444' },
          { key: '✓ 103 Early Hints', value: 'Substituto do Server Push', badge: 'ok', badgeColor: '#4ade80' },
          { key: '✓ Alt-Svc',         value: 'Fallback TCP automático', badge: 'ok', badgeColor: '#4ade80' },
        ],
      },
    ],
  },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'HoL Blocking por versão',
    trick: '1.1 = App e TCP. 2 = só TCP. 3 = nenhum.',
    expansion: [
      ['HTTP/1.1', 'HoL em app (requests seriais) E em TCP'],
      ['HTTP/2',   'HoL de app resolvido com multiplexing; HoL TCP persiste'],
      ['HTTP/3',   'Sem HoL — QUIC tem streams independentes na camada de transporte'],
    ],
    explanation: 'A progressão é: ambos → só transporte → nenhum. Cada versão elimina uma camada do problema.',
    example: '1% de perda de pacote em HTTP/2 = todos os streams bloqueados. Em HTTP/3 = apenas o stream afetado.',
    why: 'A pergunta "qual versão tem HoL?" é uma das mais comuns em entrevista. A progressão em 3 passos é memorável.',
  },
  {
    label: 'RTTs por versão — 3.5, 2, 1, 0',
    trick: 'Sênior (3.5), Pleno (2), Júnior (1), Estagiário (0)',
    expansion: [
      ['3.5 RTT', 'HTTP/1.1 + TLS 1.2 — TCP (1) + TLS 1.2 (2) + meia volta'],
      ['2 RTT',   'HTTP/2 + TLS 1.3 — TCP (1) + TLS 1.3 (1)'],
      ['1 RTT',   'HTTP/3 nova conexão — QUIC integra TCP+TLS'],
      ['0 RTT',   'QUIC com session ticket — dados na primeira mensagem'],
    ],
    explanation: 'Os números absurdos (senioridade decrescente) grudam na memória. Em 100ms de RTT, 3.5 RTT = 350ms só de handshake.',
    example: 'Em 100ms RTT: HTTP/1.1 paga 350ms, HTTP/3 paga 100ms — antes de qualquer dado.',
    why: 'Quantificar RTTs transforma conceito abstrato em número concreto. Entrevistadores ficam impressionados com precisão.',
  },
  {
    label: 'QUIC: Q-U-I-C',
    trick: 'Q=UDP, U=Userspace, I=Integrado TLS, C=Connection ID',
    expansion: [
      ['Q = UDP',            'QUIC roda sobre UDP — não TCP'],
      ['U = Userspace',      'Implementado em userspace — evolui sem mudar kernel'],
      ['I = Integrado TLS',  'TLS 1.3 é parte do handshake QUIC — 1 RTT'],
      ['C = Connection ID',  'Identifica conexão independente de IP — migração de rede'],
    ],
    explanation: 'Cada letra do nome QUIC é uma característica fundamental. Fácil de recuperar da memória quando questionado sobre o protocolo.',
    example: 'Connection ID: troca wifi→4G mantém conexão ativa. TCP precisaria de nova conexão + novo handshake.',
    why: 'Acrônimo nativo (o nome do protocolo) é o mnemônico mais natural possível.',
  },
  {
    label: 'Server Push morreu — 103 Early Hints vive',
    trick: 'Push empurra sem perguntar. Hint sugere sem impor.',
    expansion: [
      ['Server Push (morto)', 'Servidor enviava recursos sem saber o cache do browser — desperdiçava bandwidth'],
      ['103 Early Hints',     'Servidor sugere via Link: preload — browser decide se faz fetch'],
    ],
    explanation: 'Early Hints respeita o cache do browser. Push ignorava. Por isso Push morreu e Hints sobreviveu.',
    example: 'Server envia 103 com Link: rel=preload para /style.css. Browser verifica cache — se tiver, ignora. Se não tiver, inicia fetch.',
    why: 'Saber que Server Push foi abandonado e o que o substituiu é o que diferencia quem se mantém atualizado.',
  },
  {
    label: 'Alt-Svc é a porta de entrada para HTTP/3',
    trick: 'Alternative Service = "tem HTTP/3 aqui"',
    expansion: [
      ['Primeira visita', 'Client conecta via HTTP/2 (TCP)'],
      ['Server responde', 'Alt-Svc: h3=":443"; ma=86400 — "HTTP/3 disponível por 24h"'],
      ['Próxima visita',  'Browser tenta QUIC/UDP na porta 443'],
      ['Fallback',        'Se UDP bloqueado → fallback automático para TCP'],
    ],
    explanation: 'HTTP/3 não tem porta dedicada padrão — é sempre negociado via Alt-Svc. Sem esse header, HTTP/3 nunca é usado.',
    example: 'curl -I https://cloudflare.com | grep alt-svc → alt-svc: h3=":443"; ma=86400',
    why: 'Sem conhecer Alt-Svc, candidatos ficam com impressão de que HTTP/3 precisa de migração planejada — o que é falso.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'HTTP/2 & HTTP/3',
    stackLabel: 'CS · Protocolos Web',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'HTTP/2 & HTTP/3',
    accentColor: C,
    stackLabel: 'CS · Protocolos Web',
    tagline: 'HTTP/1.1 vs HTTP/2 vs HTTP/3 — comparação completa',
    version: 'RFC 9000 / RFC 9114',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'HTTP/2 & HTTP/3',
    stackLabel: 'CS · Protocolos Web',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function HttpVersionsPdfs() {
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
