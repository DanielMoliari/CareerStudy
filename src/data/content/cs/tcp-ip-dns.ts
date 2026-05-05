import type { SkillContent } from "@/types"

const tcpIpDns: SkillContent = {
    tagline: "Stack de protocolos da internet: como dois computadores se acham e conversam.",
    why: "Senior precisa explicar o que acontece quando você digita URL no browser. DNS, TCP handshake, congestion control aparecem em entrevista de backend e system design.",
    summary: "Stack TCP/IP: aplicação (HTTP, gRPC) -> transporte (TCP/UDP) -> rede (IP) -> link (Ethernet). DNS resolve hostname em IP. TCP é conexão confiável (handshake, ACK, retransmit, congestion control). UDP é best-effort. Saber portas, NAT, traceroute, e o que pode dar errado em cada camada é esperado.",
    keypoints: [
      { title: "Modelo OSI vs TCP/IP", body: "7 camadas OSI vs 4 do TCP/IP. Na prática usa TCP/IP. Conhecer ambos é padrão em entrevista." },
      { title: "IP", body: "Endereco 32 bits (IPv4) ou 128 bits (IPv6). Roteamento via tabelas. Best-effort (perde pacotes, não garante ordem)." },
      { title: "TCP", body: "Connection-oriented, confiável. 3-way handshake (SYN, SYN-ACK, ACK). ACK + retransmit + ordering. Slow start + congestion control." },
      { title: "UDP", body: "Sem conexão, sem garantia. Header pequeno. Bom pra DNS, video streaming, gaming, QUIC." },
      { title: "DNS", body: "Hierarquia: root -> TLD -> authoritative. Resolver recursivo cacheia. Records: A (IPv4), AAAA (IPv6), CNAME, MX, TXT." },
      { title: "NAT", body: "Traduz IP privado <-> público. Multiplos hosts compartilham um IP público via portas. Quebra peer-to-peer." },
      { title: "TCP windows", body: "Sliding window controla flow. Congestion window cresce/encolhe baseado em loss. AIMD é clássico." },
      { title: "Portas", body: "0-1023 reservadas (HTTP 80, HTTPS 443, SSH 22, DNS 53). 1024-49151 user-assigned. 49152+ ephemeral." },
    ],
    gotchas: [
      "Confundir TCP e IP — IP é endereço/roteamento; TCP é conexão confiável sobre IP.",
      "Achar que UDP é \"TCP rápido\" — UDP não tem garantia, você reimplementa em app.",
      "Esquecer cache do DNS — TTL controla. Mudar A record não propaga instante.",
      "Ignorar NAT em desenvolvimento — funciona local, falha em prod por tras de firewall.",
      "Pensar que HTTPS é sobre TCP simples — é sobre TLS sobre TCP. Camadas adicionais.",
      "IPv6 não é \"IPv4 com mais bits\" — protocolo diferente, sem NAT obrigatório.",
      "TCP slow start em conexões curtas penaliza throughput — HTTP/2 multiplexing ajuda.",
    ],
    interview: [
      { q: "O que acontece quando digito google.com?", a: "<p>Resumo:</p><ul><li><strong>DNS</strong>: resolver consulta cache; senao recursive query (root -> com -> google.com authoritative). Retorna IP.</li><li><strong>TCP handshake</strong>: SYN, SYN-ACK, ACK pra IP:443.</li><li><strong>TLS handshake</strong>: ClientHello, ServerHello, cert, key exchange.</li><li><strong>HTTP request</strong>: GET / HTTP/2 com headers.</li><li><strong>Response</strong>: HTML chega; browser parseia, baixa CSS/JS/img em paralelo.</li><li><strong>Render</strong>: parse, layout, paint.</li></ul>" },
      { q: "Diferenca entre TCP e UDP?", a: "<p><strong>TCP</strong>: connection-oriented (handshake), confiável (ACK + retransmit), ordenado, controle de fluxo e congestao. Mais overhead. Bom pra HTTP, SSH, DB.</p><p><strong>UDP</strong>: sem conexão, sem garantia, header pequeno. Bom pra DNS, video, gaming, VoIP, QUIC.</p>" },
      { q: "Como funciona DNS?", a: "<p>Hierarquia: root (.) -> TLD (.com) -> authoritative (google.com).</p><p>Cliente pergunta resolver recursivo (do ISP, ou 8.8.8.8). Resolver tem cache. Cache miss: pergunta root -> recebe ref pra TLD -> TLD ref pra authoritative -> authoritative responde IP.</p><p>Resposta cacheada por TTL (segundos a horas).</p>" },
      { q: "O que é TCP 3-way handshake?", a: "<p>Estabelecimento de conexão:</p><ul><li><strong>SYN</strong>: cliente envia com seu seq number x.</li><li><strong>SYN-ACK</strong>: server responde com seu seq y e ACK x+1.</li><li><strong>ACK</strong>: cliente confirma com ACK y+1. Conexão estabelecida.</li></ul><p>Encerramento é 4-way (FIN, ACK, FIN, ACK).</p>" },
      { q: "Por que DNS usa UDP por padrão?", a: "<p>Queries DNS são pequenas (< 512 bytes), únicas, e tolerantes a perda (cliente repete). UDP evita overhead de handshake — resposta em 1 round trip.</p><p>Quando resposta > 512 bytes (DNSSEC, multi-record), DNS troca pra TCP. DoH e DoT usam TCP/TLS por privacidade.</p>" },
      { q: "Como funciona NAT?", a: "<p>Roteador mantem tabela mapeando (IP_priv:porta_priv) -> (IP_pub:porta_pub). Quando host interno envia, roteador troca source pelo IP_pub e nova porta. Resposta volta, roteador desfaz.</p><p>Side effect: peer-to-peer difícil — você não pode \"discar\" pra IP atras de NAT sem hole punching.</p>" },
    ],
    diagrams: [
      {
        title: "O que acontece quando você digita uma URL — fluxo completo",
        html: `<style>
.tcpd-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tcpd-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.tcpd-sub{font-size:10px;color:#475569;margin:0 0 14px}
.tcpd-flow{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.tcpd-step{display:flex;align-items:flex-start;gap:10px;background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:10px 12px;transition:border-color .2s}
.tcpd-step:hover{border-color:#10B981}
.tcpd-num{min-width:22px;height:22px;border-radius:50%;background:#10B98120;border:1px solid #10B981;color:#10B981;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.tcpd-label{font-size:10px;font-weight:700;color:#10B981;min-width:90px}
.tcpd-body{font-size:10px;color:#94a3b8;line-height:1.6}
.tcpd-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.tcpd-tip:hover .tcpd-tb{display:block}
.tcpd-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.tcpd-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
.tcpd-layers{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.tcpd-layer{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 10px;text-align:center}
.tcpd-layer-name{font-size:9px;font-weight:700;color:#10B981;margin-bottom:3px}
.tcpd-layer-ex{font-size:9px;color:#64748b;font-family:'JetBrains Mono',monospace;line-height:1.5}
</style>
<div class="tcpd-wrap">
  <p class="tcpd-title">URL → resposta: cada camada em ação</p>
  <p class="tcpd-sub">Passe o mouse para detalhes de cada etapa</p>
  <div class="tcpd-flow">
    <div class="tcpd-step">
      <div class="tcpd-num">1</div>
      <div><div class="tcpd-label">DNS lookup</div><div class="tcpd-body">Resolver consulta <span class="tcpd-tip">cache local<span class="tcpd-tb">Ordem: cache do SO → cache do resolver ISP → root → TLD (.com) → authoritative (google.com). Resposta cacheada por TTL (segundos a horas).</span></span>. Cache miss: pergunta root → TLD → authoritative. Retorna IP. UDP porta 53 (ou TCP se &gt;512 bytes).</div></div>
    </div>
    <div class="tcpd-step">
      <div class="tcpd-num">2</div>
      <div><div class="tcpd-label">TCP handshake</div><div class="tcpd-body"><span class="tcpd-tip">SYN → SYN-ACK → ACK<span class="tcpd-tb">3-way handshake estabelece números de sequência. Cada parte confirma que recebeu o seq do outro. Leva 1 RTT.</span></span> para IP:443. Conexão estabelecida. Leva 1 RTT.</div></div>
    </div>
    <div class="tcpd-step">
      <div class="tcpd-num">3</div>
      <div><div class="tcpd-label">TLS handshake</div><div class="tcpd-body">TLS 1.3: <span class="tcpd-tip">ClientHello + key share<span class="tcpd-tb">Cliente envia lista de cipher suites e chave pública ECDHE. Server responde com cert e sua chave. Ambos derivam a mesma chave de sessão. 1 RTT no total.</span></span> → ServerHello + cert → Finished. Chave de sessão gerada. 1 RTT.</div></div>
    </div>
    <div class="tcpd-step">
      <div class="tcpd-num">4</div>
      <div><div class="tcpd-label">HTTP request</div><div class="tcpd-body">GET / HTTP/2 com headers comprimidos (HPACK). Em HTTP/2: múltiplos streams multiplexados na mesma conexão TCP.</div></div>
    </div>
    <div class="tcpd-step">
      <div class="tcpd-num">5</div>
      <div><div class="tcpd-label">Response + render</div><div class="tcpd-body">Server responde HTML. Browser parseia, descobre CSS/JS/img, faz requests paralelos. <span class="tcpd-tip">Parse → Layout → Paint<span class="tcpd-tb">Critical rendering path: HTML→DOM, CSS→CSSOM, DOM+CSSOM→Render tree, Layout (geometry), Paint (pixels), Composite (GPU layers).</span></span>. Tela visível.</div></div>
    </div>
  </div>
  <div style="margin-bottom:10px;font-size:10px;font-weight:700;color:#10B981;text-transform:uppercase">Stack TCP/IP — camadas</div>
  <div class="tcpd-layers">
    <div class="tcpd-layer"><div class="tcpd-layer-name">Aplicação</div><div class="tcpd-layer-ex">HTTP · gRPC<br>DNS · SMTP</div></div>
    <div class="tcpd-layer"><div class="tcpd-layer-name">Transporte</div><div class="tcpd-layer-ex">TCP (confiável)<br>UDP (best-effort)</div></div>
    <div class="tcpd-layer"><div class="tcpd-layer-name">Rede (IP)</div><div class="tcpd-layer-ex">IPv4 / IPv6<br>roteamento</div></div>
    <div class="tcpd-layer"><div class="tcpd-layer-name">Link</div><div class="tcpd-layer-ex">Ethernet<br>Wi-Fi · MAC</div></div>
  </div>
</div>`,
        caption: "Esta pergunta ('o que acontece quando você digita uma URL?') aparece em praticamente toda entrevista de backend e system design. Saiba responder em 60 segundos.",
      },
    ],
    resources: [
      { title: "Beej's Guide to Network Programming", url: "https://beej.us/guide/bgnet/", kind: "livro" },
      { title: "High Performance Browser Networking (Ilya Grigorik)", url: "https://hpbn.co/", kind: "livro" },
      { title: "Cloudflare Learning — DNS", url: "https://www.cloudflare.com/learning/dns/what-is-dns/", kind: "docs" },
      { title: "Julia Evans — networking zines", url: "https://wizardzines.com/zines/networking/", kind: "artigo" },
      { title: "MIT 6.829 — Computer Networks", url: "https://web.mit.edu/6.829/www/", kind: "curso" },
    ],
  }

export default tcpIpDns
