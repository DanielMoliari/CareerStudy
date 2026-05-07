'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'

// ── Paleta TCP/IP/DNS ─────────────────────────────────────────────────────────
const C = '#3b82f6'   // azul — networking — NUNCA omitir

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre TCP/IP e DNS em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: o que acontece quando você digita uma URL (completo), TCP vs UDP, DNS hierarquia e tipos de registro, 3-way handshake, congestion control, NAT, QUIC/HTTP3, TIME_WAIT, WebSockets vs SSE, BGP, DNSSEC e diagnóstico de latência.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos Networking',
    subtitle: 'Os 5 truques que grudam TCP/IP na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'Stack TCP/IP (LRTA), TCP 3-way handshake (S-SA-A), DNS record types (Aí Acabou Criar Mail Txt), TCP vs UDP (CGO vs SSR), e congestion control (sobe devagar, cai rápido — AIMD).',
    icon: '02',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'quick-ref',
    title: 'Quick Ref Networking',
    subtitle: 'Portas, comandos de diagnóstico e record types numa página',
    type: 'quick-ref',
    pages: 2,
    description: 'Cartão de bolso: portas conhecidas (HTTP 80, HTTPS 443, SSH 22, DNS 53, PostgreSQL 5432), comandos de diagnóstico (ping, traceroute, mtr, dig, ss, curl -w), tipos de registro DNS, comparação TCP/UDP/QUIC e o fluxo "o que acontece quando digito uma URL".',
    icon: '03',
    goal: 'Consulta rápida',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'O que acontece quando você digita "https://google.com" no browser? Resposta completa.',
    a: '<ol><li><strong>Cache local:</strong> browser checa cache DNS local e /etc/hosts.</li><li><strong>DNS lookup:</strong> resolver recursivo → root → TLD (.com) → authoritative. Retorna IP. UDP porta 53.</li><li><strong>TCP handshake:</strong> SYN → SYN-ACK → ACK para IP:443. 1 RTT.</li><li><strong>TLS handshake:</strong> TLS 1.3: ClientHello + key_share → ServerHello + cert + Finished → Finished. 1 RTT.</li><li><strong>HTTP/2 request:</strong> GET / com headers HPACK comprimidos. Múltiplos streams.</li><li><strong>Response + render:</strong> HTML → parse → DOM + CSSOM → Render tree → Layout → Paint → Composite.</li></ol>Total pré-dados: DNS lookup + 1 RTT TCP + 1 RTT TLS ≈ 3 RTTs + latência DNS.',
    tip: 'Mencionar RTTs explicitamente (DNS, TCP 1 RTT, TLS 1 RTT) e critical rendering path é o que diferencia resposta sênior de pleno. Pratique responder em 2 minutos.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre TCP e UDP? Quando usar cada um?',
    a: '<strong>TCP:</strong> orientado a conexão (handshake), confiável (ACK + retransmit), ordenado (seq numbers), flow control e congestion control. Header 20+ bytes. <strong>Use para:</strong> HTTP/HTTPS, SSH, banco de dados, SMTP — qualquer coisa que precisa de dados corretos. <strong>UDP:</strong> sem conexão, sem garantia, header 8 bytes. <strong>Use para:</strong> DNS, video streaming, gaming, VoIP, QUIC — onde latência > corretude ou app tolera perda.',
    tip: 'Para sênior: QUIC usa UDP mas implementa confiabilidade por stream internamente, eliminando TCP HOL blocking. Isso demonstra entendimento da evolução dos protocolos.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o DNS em detalhes — hierarquia e tipos de registro?',
    a: '<strong>Hierarquia:</strong> Root (.) → TLD (.com) → Authoritative (google.com). <strong>Fluxo recursivo:</strong> resolver pergunta root → referral TLD → referral authoritative → resposta com IP. Cacheia por TTL. <strong>Records:</strong> A (hostname→IPv4), AAAA (IPv6), CNAME (alias, proibido no apex), MX (mail+prioridade), TXT (SPF/DKIM/verificação), NS (nameservers autoritativos).',
    tip: 'Negative caching (NXDOMAIN cacheado via SOA mínimo TTL) é o detalhe avançado. CNAME proibido no apex porque apex precisa de SOA/NS — que não pode coexistir com CNAME.',
  },
  {
    level: 'Pleno',
    q: 'Explique o TCP 3-way handshake e o 4-way termination.',
    a: '<strong>Handshake:</strong> SYN (cliente, ISN=x) → SYN-ACK (servidor, ISN=y, ACK=x+1) → ACK (ACK=y+1). ISN aleatório previne conflito com conexões anteriores. <strong>Termination:</strong> FIN (A terminou) → ACK → FIN (B terminou) → ACK → TIME_WAIT (60s). TIME_WAIT bloqueia a porta para evitar que dados atrasados da conexão antiga sejam interpretados como dados da nova.',
    tip: 'TIME_WAIT é o detalhe sênior: porta bloqueada por 2×MSL ≈ 60s. Em servidores de alta carga com muitas conexões curtas pode esgotar portas ephemeral. SO_REUSEADDR resolve.',
  },
  {
    level: 'Senior',
    q: 'O que é TCP congestion control e como funciona?',
    a: '<strong>Slow Start:</strong> cwnd começa em 1 MSS, dobra por RTT (exponencial) até ssthresh. <strong>Congestion Avoidance:</strong> acima de ssthresh, +1 MSS por RTT (linear). <strong>Loss detected:</strong> ssthresh=cwnd/2, cwnd reduz (AIMD). <strong>BBR (Google):</strong> mede bandwidth e RTT continuamente, mantém throughput ótimo sem encher buffers — não espera perda para reduzir. Usado no YouTube, GCP. <strong>Impacto prático:</strong> slow start penaliza conexões curtas — HTTP/2 reutiliza conexão para mitigar.',
    tip: 'BBR vs CUBIC é o ponto sênior. CUBIC reage à perda; BBR modela o link. Mencionar que slow start é problema para páginas web simples e como HTTP/2 mitiga mostra visão sistêmica.',
  },
  {
    level: 'Senior',
    q: 'Como funciona NAT e quais seus side effects?',
    a: 'Roteador mantém tabela <code>(IP_priv:porta_priv) → (IP_pub:porta_pub)</code>. Ao enviar, substitui source; na resposta, desfaz. <strong>Side effects:</strong> P2P impossível sem hole punching (STUN/TURN/ICE — base do WebRTC), esgotamento de portas em redes grandes, stateful (restart do roteador mata conexões). <strong>IPv6 elimina NAT</strong> — espaço suficiente para IP público único por dispositivo.',
    tip: 'STUN/TURN/ICE como solução para P2P atrás de NAT (WebRTC) demonstra que você sabe as implicações práticas. NAT simétrico requer TURN (relay) mesmo com STUN.',
  },
  {
    level: 'Pleno',
    q: 'Por que DNS usa UDP por padrão? Quando usa TCP?',
    a: '<strong>UDP por padrão:</strong> queries são pequenas, únicas, tolerantes a perda (cliente repete). Elimina overhead do 3-way handshake — resposta em 1 RTT. <strong>TCP quando:</strong> resposta > 512 bytes (DNSSEC, multi-record), zone transfers (AXFR). <strong>DNS sobre TLS (DoT, porta 853) e DoH (porta 443):</strong> encriptam queries para privacidade — ISP não vê o que você resolve. DoH dificulta bloqueio corporativo.',
    tip: 'EDNS0 aumentou o limite de 512 para 4096 bytes — mas quando isso não é suficiente, fallback para TCP. DoT vs DoH: ambos resolvem privacidade, mas DoH parece tráfego HTTPS normal.',
  },
  {
    level: 'Pleno',
    q: 'O que é HTTP/2 e como resolve os problemas do HTTP/1.1?',
    a: '<strong>Problemas do HTTP/1.1:</strong> head-of-line blocking no pipeline, múltiplas conexões TCP para paralelismo (6-8 por domínio), headers não comprimidos. <strong>HTTP/2 resolve:</strong> multiplexing (múltiplos streams no mesmo TCP), HPACK (compressão de headers), server push, priorização de streams. <strong>Limitação:</strong> TCP HOL blocking persiste — 1 pacote perdido bloqueia todos os streams HTTP/2. HTTP/3/QUIC resolve isso.',
    tip: 'A limitação do HTTP/2 (TCP HOL blocking ainda existe) e como HTTP/3 resolve é o que distingue respostas sênior. Multiplexing resolve o HOL do HTTP mas não o do TCP.',
  },
  {
    level: 'Senior',
    q: 'O que é QUIC / HTTP/3 e por que foi necessário?',
    a: 'QUIC (RFC 9000): protocolo de transporte sobre UDP, TLS 1.3 integrado, criado pelo Google. <strong>O que resolve:</strong> (1) Sem TCP HOL blocking — streams independentes, perda afeta só um stream. (2) 1 RTT total (sem TCP+TLS separados). (3) Connection migration — conexão sobrevive mudança de IP/porta via connection ID (Wi-Fi → 4G sem reconectar). (4) Better loss recovery. <strong>HTTP/3:</strong> HTTP sobre QUIC. ~30% do tráfego web em 2024.',
    tip: 'Connection migration é o killer feature para mobile — conexão TCP morre quando você sai do Wi-Fi. QUIC sobrevive. Isso é impossível no TCP (identificado por 4-tuple).',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o traceroute e como interpretar a saída?',
    a: 'Traceroute envia pacotes com TTL crescente (1, 2, 3...). Quando TTL chega a 0, roteador descarta e retorna ICMP Time Exceeded. Assim mapeia cada hop. <strong>Saída:</strong> número do hop, IP do roteador, 3 RTTs. <code>* * *</code> = hop não retorna ICMP (firewall) — não significa problema no hop seguinte. <strong>Uso prático:</strong> identificar onde está a latência, detectar roteamento assimétrico, identificar gargalos.',
    tip: 'Roteamento assimétrico (ida ≠ volta) explica por que hop 3 pode mostrar alta latência mas hop 4 baixa — o caminho de retorno é diferente. traceroute só mostra o caminho de ida.',
  },
  {
    level: 'Senior',
    q: 'Explique BGP e o que é BGP hijacking.',
    a: '<strong>BGP (Border Gateway Protocol):</strong> protocolo de roteamento entre ASNs (Autonomous System Numbers). Cada rede grande (ISP, CDN) tem um ASN. BGP define como tráfego viaja entre redes. Roteadores trocam anúncios de prefixos IP. <strong>BGP hijacking:</strong> AS anuncia prefixos de outra rede — tráfego desviado. Caso famoso: Pakistan Telecom anunciou prefixos YouTube em 2008, derrubando o YouTube globalmente por 2 horas. <strong>RPKI:</strong> valida criptograficamente quais ASNs podem anunciar quais prefixos.',
    tip: 'Pakistan Telecom/YouTube 2008 como exemplo concreto torna a explicação memorável. RPKI como mitigação demonstra conhecimento atual de segurança de infra.',
  },
  {
    level: 'Senior',
    q: 'O que é anycast e como é usado pelo Cloudflare e root DNS?',
    a: '<strong>Anycast:</strong> múltiplos servidores compartilham o mesmo IP. BGP leva para o mais próximo (menor AS_PATH). <strong>Cloudflare 1.1.1.1:</strong> centenas de PoPs em ~300 cidades anunciam 1.1.1.1 via BGP. Query vai para o PoP mais próximo — latência &lt;10ms. <strong>Root DNS:</strong> os "13 root nameservers" são na realidade centenas de instâncias anycast. <strong>DDoS mitigation:</strong> ataque absorvido por múltiplos PoPs em vez de um único alvo.',
    tip: 'Root nameservers como anycast é o fato que impressiona — a maioria acha que são literalmente 13 servidores. Cloudflare usando anycast para latência excepcionalmente baixa justifica o design.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o DNS recursivo vs autoritativo?',
    a: '<strong>Resolver recursivo:</strong> faz todo o trabalho de consultar root/TLD/autoritativo. Cacheia por TTL. Exemplos: 8.8.8.8, 1.1.1.1, resolver do ISP. <strong>Nameserver autoritativo:</strong> tem a resposta final para um domínio — Route 53, Cloudflare DNS. Não consulta ninguém. <strong>Query recursiva:</strong> cliente pede ao resolver "resolva tudo por mim". <strong>Query iterativa:</strong> resolver pergunta sequencialmente (root → TLD → autoritativo), cada um retorna referral.',
    tip: 'Negative caching (NXDOMAIN cacheado via SOA mínimo TTL) evita storm de queries para domínios inexistentes. Candidatos que conhecem isso demonstram profundidade operacional.',
  },
  {
    level: 'Senior',
    q: 'O que é TCP flow control e window scaling?',
    a: '<strong>Flow control:</strong> cada segmento TCP inclui Window Size = quantos bytes o receiver pode absorver. Sender respeita — não envia mais. <strong>Zero window:</strong> receiver saturado, sender para e faz probing periódico. <strong>Window Scaling (RFC 7323):</strong> window de 16 bits = máx 64KB. Insuficiente para links de alta latência. Window scaling permite até 1GB. <strong>BDP (Bandwidth-Delay Product):</strong> bandwidth × RTT = dados "em voo". Sem window scaling em satélite (600ms RTT), throughput máximo = 64KB/0.6s ≈ 853Kbps mesmo em link 1Gbps.',
    tip: 'BDP e window scaling são o detalhe sênior que a maioria não conhece. A analogia: janela de 64KB em link satélite é como uma autoestrada de 8 faixas bloqueada por um semáforo de 1 segundo.',
  },
  {
    level: 'Senior',
    q: 'Explique WebSockets vs SSE vs long-polling.',
    a: '<strong>Long-polling:</strong> cliente faz request, servidor segura até ter dados ou timeout. Cliente refaz imediatamente. Overhead de reconexão constante. Fallback para ambientes legados. <strong>SSE (Server-Sent Events):</strong> conexão HTTP unidirecional (servidor → cliente). Reconexão automática, EventSource nativo. Funciona via HTTP/2 multiplexing. <strong>WebSockets:</strong> upgrade HTTP → bidirecional full-duplex. Uma conexão TCP. Baixa latência, alta frequência. <strong>Regra:</strong> SSE para push unidirecional; WebSocket para chat/gaming/colaboração.',
    tip: 'HTTP/2 SSE como alternativa ao WebSocket é conhecimento avançado: SSE via HTTP/2 multiplexing funciona com proxies/load balancers transparentemente. WebSocket muitas vezes precisa de configuração especial de proxy.',
  },
  {
    level: 'Pleno',
    q: 'Como diagnosticar latência de rede em produção?',
    a: '<ul><li><code>ping host</code> — RTT e perda de pacotes básicos.</li><li><code>traceroute host</code> — latência por hop.</li><li><code>mtr host</code> — traceroute contínuo com % perda.</li><li><code>dig +trace example.com</code> — DNS trace completo.</li><li><code>curl -w "dns:%{time_namelookup} tcp:%{time_connect} tls:%{time_appconnect} ttfb:%{time_starttransfer}"</code> — breakdown por fase.</li><li><code>ss -s</code> — estatísticas de sockets.</li></ul>',
    tip: 'curl -w com formato personalizado é a ferramenta mais poderosa — distingue se o problema é DNS, TCP connect, TLS ou aplicação. TTFB alto = problema de app, não de rede.',
  },
  {
    level: 'Senior',
    q: 'O que é DNSSEC e como funciona?',
    a: '<strong>Problema:</strong> DNS clássico não tem autenticação — cache poisoning pode redirecionar domínios legítimos. <strong>DNSSEC:</strong> assina registros DNS criptograficamente. Chain of trust: zona assina com ZSK → parent assina a public key com KSK → até root. Resolver verifica a cadeia. <strong>Limitações:</strong> DNSSEC não criptografa — apenas autentica. Registros DNSSEC são muito maiores → DNS amplification DDoS. DoT/DoH para privacidade.',
    tip: 'DNSSEC ≠ privacidade — é integridade. Confundir é erro comum. DNS amplification DDoS como side effect (resposta DNSSEC >> query) demonstra entendimento das implicações de segurança.',
  },
  {
    level: 'Pleno',
    q: 'Explique IPv4 vs IPv6 e por que a transição é lenta.',
    a: '<strong>IPv4:</strong> 32 bits = ~4.3B endereços. Exausto desde 2011. Vivemos de NAT. <strong>IPv6:</strong> 128 bits = 340 undecilhões. Sem NAT obrigatório. SLAAC autoconfiguração. IPSec mandatório. <strong>Transição lenta:</strong> não há compatibilidade direta; dual-stack (dispositivo tem IPv4 e IPv6) é a estratégia. Equipamentos legados, retraining de operadores, NAT "funciona". <strong>Estado atual:</strong> ~40-50% do tráfego Google em IPv6; mobile já é IPv6-first.',
    tip: 'Dual-stack como estratégia de transição (não big-bang) é a resposta prática. IPv6-only com NAT64/DNS64 para mobile demonstra conhecimento atual do deployment.',
  },
  {
    level: 'Senior',
    q: 'Como funciona load balancing L4 vs L7?',
    a: '<strong>L4 (TCP):</strong> balanceia no nível de conexão TCP. Mais rápido — sem análise de conteúdo. Sem health checks HTTP. AWS NLB. <strong>L7 (HTTP):</strong> analisa conteúdo HTTP — path, headers, cookies. Routing por caminho (/api → service A, /static → CDN), sticky sessions, health checks HTTP. AWS ALB, Nginx. <strong>DNS round-robin:</strong> múltiplos IPs no registro A. Simples, sem health check — se servidor cai, DNS continua retornando seu IP.',
    tip: 'L4 vs L7 é fundamental para system design. L7 permite routing inteligente mas adiciona latência de parsing HTTP. DNS round-robin sem health check é a armadilha que derruba aplicações.',
  },
  {
    level: 'Senior',
    q: 'O que é um socket e como o SO multiplexa conexões TCP?',
    a: 'Socket = abstração do SO para endpoint de comunicação, identificado pela 4-tuple: (IP src, porta src, IP dst, porta dst). Servidor faz bind() em porta (ex: 443) e listen(). Para cada conexão: SO cria socket novo com 4-tuple única. Dois clientes simultâneos na porta 443 têm portas de origem diferentes (ephemeral 49152-65535) — 4-tuples distintas. TIME_WAIT protege contra dados atrasados: mesmo 4-tuple dentro de 60s poderia receber pacotes da conexão anterior.',
    tip: 'A 4-tuple como identificador único é a razão pela qual uma porta pode ter milhares de conexões simultâneas. Candidatos que entendem 4-tuple vs "porta do servidor" demonstram fundamentos sólidos.',
  },
  {
    level: 'Senior',
    q: 'O que é TCP BBR e como difere do CUBIC?',
    a: '<strong>CUBIC (padrão Linux):</strong> baseado em perda de pacotes — cwnd cresce em curva cúbica, reduz na perda. Problema: buffers grandes (bufferbloat) fazem cwnd crescer até preencher o buffer inteiro antes de detectar congestionamento. Latência alta. <strong>BBR (Google, 2016):</strong> modelo de banda e RTT. Mede continuamente o bottleneck bandwidth e o round-trip time. Mantém cwnd no ponto ótimo sem encher buffers. Menos sensível a bufferbloat. Melhor throughput e latência em redes com perda não-congestionamento. Ativado em: <code>sysctl net.ipv4.tcp_congestion_control=bbr</code>.',
    tip: 'Bufferbloat como problema do CUBIC é o insight avançado. BBR reduz latência porque não precisa encher o buffer para medir a capacidade do link. YouTube trocou CUBIC por BBR e mediu melhoria significativa.',
  },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Stack TCP/IP: LRTA (de baixo para cima)',
    trick: 'L-R-T-A: Link, Rede, Transporte, Aplicação',
    expansion: [
      ['L', 'Link — Ethernet, Wi-Fi, MAC address'],
      ['R', 'Rede — IP, roteamento, IPv4/IPv6'],
      ['T', 'Transporte — TCP (confiável), UDP (best-effort)'],
      ['A', 'Aplicação — HTTP, DNS, SSH, SMTP'],
    ],
    explanation: 'De baixo para cima: camada L encapsula R, R encapsula T, T encapsula A. Ao enviar, dados descem (A→T→R→L). Ao receber, sobem (L→R→T→A). Cada camada adiciona seu header.',
    example: 'HTTP request = Aplicação | dentro de TCP | dentro de IP | dentro de Ethernet frame',
    why: 'A ordem das camadas é pergunta clássica de entrevista. LRTA é fácil de lembrar e cobre todo o modelo TCP/IP.',
  },
  {
    label: 'TCP 3-way handshake: S-SA-A',
    trick: '"Sim" → "Sim, Aceito" → "Aceito"',
    expansion: [
      ['S = SYN', 'Cliente: quero conectar, meu ISN é x'],
      ['SA = SYN-ACK', 'Servidor: aceito, meu ISN é y, confirmo seu x (ACK=x+1)'],
      ['A = ACK', 'Cliente: confirmo seu y (ACK=y+1). Conexão estabelecida.'],
    ],
    explanation: 'É um diálogo de confirmação mútua: cada lado confirma a capacidade de receber do outro. Os ISNs (Initial Sequence Numbers) são a base de todo o mecanismo de confiabilidade do TCP.',
    example: 'Sem SYN-ACK (servidor inacessível) = timeout do cliente. Syn Flood attack: enviar muitos SYNs sem completar o A.',
    why: 'Handshake é A pergunta de TCP em entrevistas. Saber os seq numbers (x, x+1, y, y+1) demonstra entendimento de como a confiabilidade é estabelecida.',
  },
  {
    label: 'DNS record types: Aí Acabou Criar Mail Txt',
    trick: 'A — Acabou — Criar — Mail — Txt',
    expansion: [
      ['A', 'A record: hostname → IPv4 address'],
      ['Acabou = AAAA', 'AAAA: hostname → IPv6 address (quatro A = acabou)'],
      ['Criar = CNAME', 'CNAME: alias → outro hostname (Canonical NAME)'],
      ['Mail = MX', 'MX: mail exchanger com prioridade'],
      ['Txt = TXT', 'TXT: texto arbitrário (SPF, DKIM, verificação de domínio)'],
    ],
    explanation: 'Os 5 tipos mais cobrados em entrevista. Lembrete extra: CNAME nunca no apex do domínio (onde estão SOA/NS) — causaria problemas de resolução.',
    example: 'dig google.com A | dig google.com MX | dig google.com TXT → veja o que cada retorna',
    why: 'Entrevistadores de backend frequentemente perguntam tipos de DNS. Saber a diferença A vs AAAA vs CNAME é básico; MX e TXT para SPF/DKIM mostra maturidade operacional.',
  },
  {
    label: 'TCP vs UDP: CGO vs SSR',
    trick: 'TCP=CGO (Conectado-Garantido-Ordenado) | UDP=SSR (Simples-Sem garantia-Rápido)',
    expansion: [
      ['C = Conectado', 'TCP exige 3-way handshake antes de dados'],
      ['G = Garantido', 'TCP garante entrega (ACK + retransmissão)'],
      ['O = Ordenado', 'TCP mantém ordem via seq numbers'],
      ['S = Simples', 'UDP: 8 bytes de header, sem estado'],
      ['S = Sem garantia', 'UDP: pacotes podem perder, duplicar, chegar fora de ordem'],
      ['R = Rápido', 'UDP: sem overhead de handshake e ACKs'],
    ],
    explanation: 'CGO vs SSR: memorizando os 6 atributos você responde qualquer pergunta sobre TCP vs UDP. QUIC combina o melhor: Garantido + Rápido via streams independentes.',
    example: 'HTTP: precisa CGO. Video: aceita SSR (buffer handle drop). DNS: quer SSR (pequenas queries, repete se perder).',
    why: 'A pergunta "TCP ou UDP?" aparece em system design com frequência. CGO/SSR cobre todos os critérios de decisão.',
  },
  {
    label: 'Congestion control: Sobe devagar, cai rápido',
    trick: 'AIMD — Additive Increase, Multiplicative Decrease',
    expansion: [
      ['Additive Increase', '+1 MSS por RTT em congestion avoidance (linear, cauteloso)'],
      ['Multiplicative Decrease', 'Divide cwnd pela metade ao detectar congestionamento (rápido)'],
      ['Slow Start', 'Fase inicial: cwnd dobra por RTT (exponencial) até ssthresh'],
      ['BBR', 'Não espera perda: mede bandwidth e RTT continuamente'],
    ],
    explanation: 'O design é assimétrico de propósito: subir devagar respeita outros fluxos na rede; cair rápido libera capacidade rapidamente. Analogia: acelerar devagar em estrada compartilhada, frear forte em obstáculo.',
    example: 'Slow start: cwnd 1→2→4→8→16 (exponencial). Congestion avoidance: 16→17→18→19 (linear). Perda: 19→9 (metade).',
    why: 'Congestion control é pergunta sênior frequente. AIMD explica por que TCP é "bem comportado" — não monopoliza a rede. BBR como evolução demonstra conhecimento atual.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'TCP/IP e DNS',
    stackLabel: 'CS · Redes · Protocolos',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'TCP/IP e DNS',
    stackLabel: 'CS · Redes · Protocolos',
  }),
  'quick-ref': () => buildQuickRefPdf({
    accentColor: C,
    skillName: 'TCP/IP e DNS',
    stackLabel: 'CS · Redes',
    columns: [
      {
        sections: [
          {
            title: 'Portas bem conhecidas',
            entries: [
              { key: '80 / 443',    value: 'HTTP / HTTPS (TCP)' },
              { key: '22',          value: 'SSH (TCP)' },
              { key: '53',          value: 'DNS (UDP padrão, TCP >512 bytes)' },
              { key: '25 / 587',    value: 'SMTP / SMTP submission (TCP)' },
              { key: '5432 / 3306', value: 'PostgreSQL / MySQL (TCP)' },
              { key: '6379',        value: 'Redis (TCP)' },
            ],
          },
          {
            title: 'DNS record types',
            entries: [
              { key: 'A',     value: 'hostname → IPv4' },
              { key: 'AAAA',  value: 'hostname → IPv6' },
              { key: 'CNAME', value: 'alias → hostname (proibido no apex)' },
              { key: 'MX',    value: 'mail server + prioridade' },
              { key: 'TXT',   value: 'SPF, DKIM, verificação de domínio' },
              { key: 'NS',    value: 'nameservers autoritativos da zona' },
            ],
          },
        ],
      } as QuickRefColumn,
      {
        sections: [
          {
            title: 'Diagnóstico de rede',
            entries: [
              { key: 'ping',       value: 'RTT e perda de pacotes' },
              { key: 'traceroute', value: 'Latência por hop' },
              { key: 'mtr',        value: 'traceroute contínuo com % perda' },
              { key: 'dig +trace', value: 'DNS trace completo' },
              { key: 'ss -s',      value: 'Estatísticas de sockets' },
              { key: 'curl -w',    value: 'dns/tcp/tls/ttfb breakdown por fase' },
            ],
          },
          {
            title: 'TCP vs UDP vs QUIC',
            entries: [
              { key: 'TCP',      value: 'Confiável, ordenado, 3-way handshake, 20+ bytes' },
              { key: 'UDP',      value: 'Best-effort, sem conexão, 8 bytes header' },
              { key: 'QUIC',     value: 'UDP + TLS 1.3 + streams + connection migration' },
              { key: 'TCP use',  value: 'HTTP, SSH, banco de dados, SMTP' },
              { key: 'UDP use',  value: 'DNS, video, gaming, VoIP' },
              { key: 'QUIC use', value: 'HTTP/3, mobile, latência crítica' },
            ],
          },
        ],
      } as QuickRefColumn,
    ],
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function TcpIpDnsPdfs() {
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
