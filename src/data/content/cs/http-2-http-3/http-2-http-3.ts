import type { SkillContent } from "@/types"

const http2Http3: SkillContent = {
  tagline: "Evolução do HTTP: HTTP/2 multiplexa em uma TCP, HTTP/3 troca por QUIC sobre UDP.",
  why: "Web moderna roda HTTP/2 e HTTP/3. Sênior precisa explicar head-of-line blocking, multiplexing, server push (e por que morreu) e QUIC — e saber quando cada versão importa na prática.",
  summary: "HTTP/1.1 abre uma conexão por request (ou keep-alive serial) — gargalo. HTTP/2 multiplexa vários streams em uma TCP, comprime headers (HPACK), usa binary framing. Mas HTTP/2 sofre head-of-line blocking em TCP loss. HTTP/3 substitui TCP por QUIC (sobre UDP), com streams independentes, conexão mais rápida (1-RTT, 0-RTT), TLS 1.3 integrado e migração de IP.",
  keypoints: [
    { title: "HTTP/1.1 — problemas", body: "Uma request por vez por conexão. Browsers abrem 6 conexões paralelas por host como workaround. Head-of-line blocking: request 2 espera request 1 completar." },
    { title: "HTTP/2 — multiplexing", body: "Múltiplos streams em uma única TCP. Cada stream tem ID, frames intercalados. Sem fila serial por conexão. Server e client podem enviar frames a qualquer momento." },
    { title: "HPACK", body: "Compressão de headers via dicionário dinâmico e estático. Headers repetidos (User-Agent, Cookie) viram referência curta. Reduz overhead em 50-90% para APIs chatty." },
    { title: "Binary framing", body: "Mensagens viram frames binários (HEADERS, DATA, SETTINGS, PRIORITY, RST_STREAM). Mais eficiente de parsear que ASCII do HTTP/1.1." },
    { title: "TCP HoL em HTTP/2", body: "Perda de pacote TCP bloqueia TODOS os streams HTTP/2, porque TCP exige ordem. Em redes com 1% de perda, HTTP/2 pode ser pior que HTTP/1.1 com 6 conexões." },
    { title: "QUIC e HTTP/3", body: "QUIC é protocolo novo sobre UDP. Streams independentes — loss em um não bloqueia outro. Integra TLS 1.3 (1-RTT handshake, 0-RTT resume). Suporta migração de IP (troca de wifi pra 4G sem perder conexão via Connection ID)." },
    { title: "Server Push — morreu", body: "HTTP/2 podia 'empurrar' recursos antes do client pedir. Pouco usado, difícil de acertar, removido na maioria dos browsers. Substituto: 103 Early Hints." },
    { title: "103 Early Hints", body: "Resposta intermediária que permite o browser iniciar fetch de recursos críticos enquanto o servidor processa. Suportado por Chrome, Cloudflare, Fastly. Ganho real em LCP." },
    { title: "Adoção real", body: "2026: ~80% dos sites usam HTTP/2. HTTP/3 cresce rápido via CDN (Cloudflare, Google, Fastly). Backend pra origem ainda majoritariamente HTTP/2 ou HTTP/1.1. gRPC usa HTTP/2." },
  ],
  gotchas: [
    "Achar que HTTP/2 elimina todo o HoL — não, elimina em camada de aplicação, mas TCP ainda tem.",
    "Bundling e sprite eram pra HTTP/1.1 — em HTTP/2 está subótimo (cache invalidation pior, requests paralelos baratos).",
    "CDN diz 'HTTP/3 enabled' mas backend ainda em HTTP/1.1 — o gargalo está na origem.",
    "Server Push está deprecated — ainda aparece em tutoriais antigos. Use 103 Early Hints.",
    "QUIC roda sobre UDP — firewalls corporativos bloqueiam ou fazem rate-limit de UDP; browser faz fallback para TCP.",
    "HTTP/2 sem TLS é possível (h2c) mas todos os browsers exigem TLS na prática.",
    "0-RTT no QUIC é vulnerável a replay attacks — não usar em endpoints não-idempotentes.",
    "Confundir h2 (HTTP/2 com TLS) com h2c (HTTP/2 cleartext) em configs de nginx/envoy.",
  ],
  interview: [
    {
      level: "pleno",
      q: "O que HTTP/2 melhorou em relação ao HTTP/1.1?",
      a: "<p>Quatro melhorias principais:</p><ul><li><strong>Multiplexing</strong>: múltiplos streams em uma única conexão TCP — sem fila serial.</li><li><strong>HPACK</strong>: compressão de headers com dicionário dinâmico — reduz overhead de 50-90% em APIs chatty.</li><li><strong>Binary framing</strong>: frames binários (HEADERS, DATA, SETTINGS) mais eficientes que ASCII.</li><li><strong>Stream priority</strong>: cliente sinaliza quais resources são mais críticos (CSS antes de imagens).</li></ul><p>Server Push foi incluído mas está deprecated — browsers removeram o suporte.</p>",
      tip: "Mencione os quatro pilares (multiplexing, HPACK, binary, priority) e já aponte que Server Push morreu — demonstra conhecimento atualizado.",
    },
    {
      level: "senior",
      q: "Qual o problema fundamental do HTTP/2 que o HTTP/3 resolve?",
      a: "<p><strong>Head-of-line blocking em TCP</strong>. HTTP/2 multiplexa em camada de aplicação, mas TCP exige entrega ordenada de pacotes. Se um pacote é perdido, TCP segura todos os streams seguintes até retransmissão.</p><p>Em redes com 1% de perda de pacotes, HTTP/2 com 100 streams pode ser mais lento que HTTP/1.1 com 6 conexões paralelas — irônico, mas real.</p><p>HTTP/3 move os streams para QUIC (camada de transporte sobre UDP). Cada stream tem controle de fluxo independente: loss em stream 3 não bloqueia stream 5.</p>",
      tip: "O dado de 1% de perda é o que demonstra entendimento profundo — não é só teoria, é a razão prática pela qual HTTP/3 existe.",
    },
    {
      level: "senior",
      q: "Explique o que é QUIC e como ele funciona em nível de transporte.",
      a: "<p>QUIC é um protocolo de transporte novo que roda sobre UDP e foi padronizado pelo IETF (RFC 9000). Características principais:</p><ul><li><strong>Streams independentes</strong>: cada stream tem seu próprio controle de fluxo e reordenação — loss em um não afeta outros.</li><li><strong>TLS 1.3 integrado</strong>: handshake de 1 RTT (conexão + criptografia juntos). 0-RTT para conexões resumidas — mas com risco de replay.</li><li><strong>Connection ID</strong>: identifica a conexão independente do IP/porta — permite migração de rede sem reconexão.</li><li><strong>Multiplexing nativo</strong>: framing de streams na própria camada de transporte, não na aplicação.</li></ul><p>UDP foi escolhido porque é mais fácil de implementar QUIC em userspace e evoluir sem depender do kernel.</p>",
      tip: "Mencione Connection ID como o mecanismo de migração de IP — é o diferencial que viabiliza mobile (troca wifi/4G sem drop de conexão). Poucos candidatos conhecem isso.",
    },
    {
      level: "pleno",
      q: "Por que bundling de assets deixou de ser ideal com HTTP/2?",
      a: "<p>Em HTTP/1.1, bundling era essencial: cada arquivo era um request separado e browsers abriam no máximo 6 conexões por host. Bundlar 100 arquivos em 1 era crítico.</p><p>Em HTTP/2, requests são baratos — multiplexing na mesma conexão. Bundlar tudo junto significa:</p><ul><li>Cache invalidation ruim: muda 1 linha de CSS, invalida todo o bundle.</li><li>Perda de granularidade: user tem que baixar código que não vai usar na rota atual.</li></ul><p>Prática atual: bundle inteligente por rota (code splitting), não um bundle gigante. React/Next já fazem isso automaticamente.</p>",
      tip: "A pergunta é sobre entender trade-offs históricos. A resposta ideal conecta cache invalidation + code splitting + comportamento real do browser.",
    },
    {
      level: "senior",
      q: "O que é Server Push e por que foi abandonado?",
      a: "<p>Server Push permitia que o servidor enviasse recursos (CSS, JS) pro browser antes dele pedir — o servidor 'adivinhava' o que o browser precisaria após processar o HTML.</p><p>Problemas fatais:</p><ul><li>O servidor não sabe o que está em cache no browser — pode pushear recurso já cacheado.</li><li>Difícil de coordenar com CDNs — CDN intercepta a resposta e o push se perde.</li><li>Prioridade errada: push pode ocupar bandwidth crítico.</li><li>Na prática, ganho foi marginal e implementação complexa.</li></ul><p>Alternativa real: <strong>103 Early Hints</strong>. Servidor retorna <code>103</code> com <code>Link: rel=preload</code> antes de processar o request completo. Browser inicia os fetches. Mais simples, CDN-friendly, sem adivinhar cache.</p>",
      tip: "Mencionar 103 Early Hints como substituto demonstra que você está atualizado. É o que Cloudflare, Fastly e nginx já implementam.",
    },
    {
      level: "pleno",
      q: "Como você verifica qual versão do HTTP está sendo usada em produção?",
      a: "<p>Várias formas:</p><ul><li><strong>DevTools</strong> (Chrome): aba Network → coluna 'Protocol' mostra h2, h3, http/1.1.</li><li><strong>curl</strong>: <code>curl -I --http2 https://exemplo.com</code> ou <code>--http3</code>.</li><li><strong>Headers</strong>: resposta HTTP/3 tem <code>Alt-Svc: h3=\":443\"</code> — browser usará HTTP/3 na próxima visita.</li><li><strong>nghttp2</strong>: <code>nghttp -v https://exemplo.com</code> — mostra frames HTTP/2 detalhados.</li></ul><p>Em métricas de produção: Cloudflare e nginx expõem versão HTTP no access log (<code>$http_version</code> ou variável similar).</p>",
      tip: "Mostrar o Alt-Svc header é o detalhe que demonstra entendimento de como HTTP/3 é negociado — é opcional, não uma porta fixa.",
    },
    {
      level: "senior",
      q: "Como HTTP/3 é negociado entre client e server? O que é Alt-Svc?",
      a: "<p>HTTP/3 não tem porta dedicada conhecida. A negociação usa <strong>Alt-Svc</strong> (Alternative Services):</p><ol><li>Primeira visita: client conecta via HTTP/2 ou HTTP/1.1 (TCP).</li><li>Server retorna header <code>Alt-Svc: h3=\":443\"; ma=86400</code> — anunciando suporte a HTTP/3 na porta 443 por 24h.</li><li>Browser salva essa informação e na próxima conexão tenta QUIC/UDP na porta 443.</li><li>Se QUIC falhar (firewall UDP), browser faz fallback para TCP.</li></ol><p>Por isso HTTP/3 tem adoção gradual — é sempre opt-in e com fallback automático. Não há breaking change.</p>",
      tip: "Explicar o fallback automático é crucial — sem ele, candidatos ficam com a impressão de que HTTP/3 precisa de migração planejada, o que não é verdade.",
    },
    {
      level: "senior",
      q: "Qual o risco do 0-RTT no QUIC e quando não usar?",
      a: "<p>0-RTT (Zero Round-Trip Time) permite que conexões resumidas enviem dados na primeira mensagem, sem esperar handshake. Isso porque o client e server já têm session tickets da conexão anterior.</p><p><strong>Risco</strong>: <em>replay attack</em>. Um atacante que intercepta o 0-RTT data pode reenviar a mesma mensagem. Se o endpoint for <code>POST /transfer</code>, ele pode repetir a operação.</p><p><strong>Regra</strong>: 0-RTT só é seguro em endpoints <strong>idempotentes</strong> (GET, HEAD, OPTIONS). Endpoints que causam efeitos colaterais (transferência, pagamento, email) devem rejeitar 0-RTT data ou aguardar o 1-RTT completo.</p><p>Cloudflare e outros CDNs expõem header <code>Early-Data: 1</code> para o origin detectar e rejeitar quando necessário.</p>",
      tip: "Saber o vetor de replay e a mitigação (endpoint idempotente + Early-Data header) é o que diferencia sênior de pleno neste tópico.",
    },
    {
      level: "pleno",
      q: "O que é HPACK e por que header compression importa?",
      a: "<p>HPACK é o algoritmo de compressão de headers do HTTP/2 (RFC 7541). Funciona com duas estruturas:</p><ul><li><strong>Tabela estática</strong>: 61 entradas pré-definidas com headers comuns (<code>:method GET</code>, <code>:status 200</code>, <code>content-type</code>). Headers da tabela viram um único byte.</li><li><strong>Tabela dinâmica</strong>: headers já vistos na conexão são adicionados. Nas requests seguintes, viram referência curta.</li></ul><p>Importância: em APIs com muitos requests (polling, SSE, GraphQL), headers repetidos (<code>Authorization</code>, <code>User-Agent</code>, <code>Cookie</code>) representavam 50-90% do payload. HPACK elimina isso.</p><p>HTTP/3 usa QPACK (RFC 9204) — similar mas adaptado para QUIC onde streams são independentes.</p>",
      tip: "Mencionar QPACK como a versão para HTTP/3 demonstra que você entende por que HPACK não pode ser usado diretamente com streams independentes do QUIC.",
    },
    {
      level: "senior",
      q: "Quais são os trade-offs de rodar gRPC sobre HTTP/2 vs REST?",
      a: "<p>gRPC usa HTTP/2 como transporte mandatório. Vantagens:</p><ul><li><strong>Protobuf</strong>: serialização binária, 5-10x menor que JSON, schema tipado.</li><li><strong>Streaming bidirecional</strong>: HTTP/2 streams permitem server-streaming, client-streaming e bidirectional.</li><li><strong>Multiplexing</strong>: centenas de chamadas simultâneas na mesma conexão.</li><li><strong>Code generation</strong>: stubs tipados em qualquer linguagem.</li></ul><p>Trade-offs:</p><ul><li>Não funciona no browser sem gRPC-Web ou gRPC-Gateway (transcoding para REST/JSON).</li><li>Debugging mais difícil (binário).</li><li>Firewalls que fazem inspeção profunda de pacotes podem bloquear.</li><li>Load balancers precisam entender HTTP/2 (Layer 7) para distribuir por stream — L4 não funciona corretamente.</li></ul>",
      tip: "O problema do load balancer L4 com gRPC é a armadilha mais comum em produção — uma conexão HTTP/2 persistent fica num único pod, sem distribuição real.",
    },
    {
      level: "senior",
      q: "Como configurar HTTP/2 e HTTP/3 em nginx e como verificar que está funcionando?",
      a: "<p><strong>nginx HTTP/2</strong>:</p><code>listen 443 ssl http2;<br>ssl_certificate ...;<br>ssl_certificate_key ...;</code><p><strong>nginx HTTP/3</strong> (nginx 1.25+ com ngx_http_v3_module):</p><code>listen 443 quic reuseport;<br>listen 443 ssl http2;<br>add_header Alt-Svc 'h3=\":443\"; ma=86400';</code><p><strong>Verificar</strong>:</p><ul><li><code>curl -I --http2 https://seu-site.com</code> — deve retornar <code>HTTP/2 200</code>.</li><li><code>curl -I --http3 https://seu-site.com</code> (curl 7.88+ com quiche).</li><li>Chrome DevTools → Network → Protocol column.</li><li>Resposta com <code>Alt-Svc: h3=...</code> confirma suporte a HTTP/3.</li></ul>",
      tip: "Mencionar o reuseport em listen 443 quic — é obrigatório para QUIC funcionar corretamente com múltiplos worker processes do nginx.",
    },
    {
      level: "pleno",
      q: "Por que browsers limitam conexões TCP paralelas por host e como HTTP/2 elimina essa necessidade?",
      a: "<p>Browsers limitam a 6 conexões TCP por host (RFC 2616 recomendava 2, browsers ignoraram e foram para 6) para não sobrecarregar servidores. Com HTTP/1.1, isso criava uma fila implícita de requests.</p><p>Workarounds de HTTP/1.1: domain sharding (assets em static.cdn.com, img.cdn.com — cada domínio tem 6 conexões). Ineficiente e adiciona latência de DNS.</p><p>HTTP/2 elimina esse problema: uma única conexão suporta centenas de streams simultâneos. Domain sharding se torna contraproducente em HTTP/2 — você perderia a otimização do HPACK e da conexão única.</p>",
      tip: "Domain sharding como antipadrão em HTTP/2 é um ponto que entrevistadores gostam — demonstra que você entende a evolução e não aplica otimizações de forma cega.",
    },
    {
      level: "senior",
      q: "Como QUIC lida com migração de IP e por que isso é importante para mobile?",
      a: "<p>QUIC identifica conexões via <strong>Connection ID</strong> — um identificador de 64 bits na camada de transporte, independente de IP e porta. Quando o device troca de rede (wifi para 4G), o IP muda, mas o Connection ID permanece o mesmo.</p><p>Com TCP: troca de IP = nova conexão TCP + novo handshake TLS = interrupção perceptível (loading spinner, request duplicado).</p><p>Com QUIC: server vê o mesmo Connection ID em novo IP, valida via criptografia, e a conexão continua sem interrupção. Para o usuário, a chamada de API não falha — ela simplesmente migra.</p><p>Caso real: Google Docs em rede móvel instável — QUIC foi desenvolvido exatamente para esse cenário.</p>",
      tip: "Connection ID é o conceito mais diferente em relação ao TCP — é o que viabiliza mobile experience real. Saber isso demonstra leitura do RFC 9000.",
    },
    {
      level: "pleno",
      q: "Como você diagnosticaria uma regressão de performance ao migrar de HTTP/1.1 para HTTP/2?",
      a: "<p>Checklist de diagnóstico:</p><ul><li><strong>Domain sharding ainda ativo?</strong> HTTP/2 não se beneficia — múltiplos domínios perdem HPACK e multiplexing. Consolidar para um domínio.</li><li><strong>Server Push mal configurado?</strong> Push de recursos já em cache desperdiça bandwidth. Desativar ou auditar com Lighthouse.</li><li><strong>TLS performance</strong>: HTTP/2 exige TLS — verificar cipher suites e session resumption. <code>openssl s_client -connect host:443</code>.</li><li><strong>Head-of-line em HTTP/2 em redes com perda?</strong> Medir RTT e packet loss na origem. Se loss alto, HTTP/3 ajudaria mais.</li><li><strong>Priorização errada</strong>: HTTP/2 PRIORITY (deprecated em HTTP/3) mal configurado pode atrasar CSS crítico.</li></ul>",
      tip: "Domain sharding como primeira coisa a checar — é o erro mais comum em migração HTTP/1.1 → HTTP/2 e é invisível se você não saber onde olhar.",
    },
    {
      level: "senior",
      q: "Qual é a diferença entre HTTP/2 stream priority e como HTTP/3 lida com priorização?",
      a: "<p><strong>HTTP/2 Priority</strong> (RFC 7540, Seção 5.3): tree de prioridade onde cada stream pode ser dependente de outro e ter peso (1-256). Complexo de implementar corretamente — a maioria dos servidores implementou mal ou ignorou. Deprecated no RFC 9113 (HTTP/2 revisado).</p><p><strong>HTTP/3 / QUIC Extensible Priorities</strong> (RFC 9218): modelo mais simples com urgência (0-7) e incremental (boolean). Urgência 0 = máxima prioridade. Incremental = pode ser processado por chunks.</p><p>Na prática: browsers enviam prioridades baseadas no tipo do recurso (CSS=urgência 0, imagem=urgência 4, scripts assíncronos=urgência 6). Servers modernos (nginx, H2O, Cloudflare) respeitam isso.</p>",
      tip: "Poucos candidatos sabem que HTTP/2 Priority foi deprecated. Mencioná-lo demonstra que você leu as RFCs e não apenas tutoriais.",
    },
    {
      level: "pleno",
      q: "O que significa 'keep-alive' no HTTP/1.1 e como HTTP/2 tornou isso obsoleto?",
      a: "<p><strong>Keep-alive em HTTP/1.1</strong>: header <code>Connection: keep-alive</code> instrui o server a não fechar a conexão TCP após a resposta. Permite reuso para requests subsequentes, mas ainda serial — um request por vez na conexão.</p><p>Browsers enviavam múltiplos requests serialmente na mesma conexão + abriam até 6 conexões para paralelismo.</p><p><strong>HTTP/2</strong>: uma única conexão TCP suporta todos os streams simultaneamente. <code>Connection: keep-alive</code> é proibido no HTTP/2 (é um hop-by-hop header não aplicável). A conexão HTTP/2 é implicitamente persistente e multiplexada.</p>",
      tip: "Mencionar que Connection: keep-alive é proibido em HTTP/2 (não apenas desnecessário) é o detalhe que diferencia — está no RFC 7540 Seção 8.1.2.2.",
    },
    {
      level: "senior",
      q: "Como rate limiting e HTTP/2 interagem? Qual o risco de limits por conexão?",
      a: "<p>HTTP/2 multiplexing muda o modelo de rate limiting. Com HTTP/1.1, cada request é uma conexão distinta — limitar por conexão era equivalente a limitar por request. Com HTTP/2, um único client abre uma conexão e dispara centenas de streams.</p><p><strong>Risco</strong>: rate limit por conexão TCP em HTTP/2 = um client consegue N×requests antes de ser limitado, onde N é o número de streams simultâneos (padrão: 100).</p><p><strong>Correto</strong>: rate limit deve ser na camada de aplicação, contando requests HTTP (streams) — não conexões TCP. Nginx (<code>limit_req</code>), Envoy, API Gateway fazem isso corretamente. Rate limiters que operam em L4 (TCP) falham com HTTP/2.</p>",
      tip: "Essa pergunta de interseção HTTP/2 + rate limiting aparece em entrevistas sênior de sistemas distribuídos. A armadilha do L4 rate limiter com HTTP/2 é a resposta-chave.",
    },
    {
      level: "senior",
      q: "Como você explicaria a diferença entre RTT e latência de conexão com HTTP/1.1, 2 e 3?",
      a: "<p>RTT (Round-Trip Time) = tempo ida e volta entre client e server.</p><p><strong>HTTP/1.1 (TCP + TLS 1.2)</strong>: 3-way TCP handshake (1.5 RTT) + TLS 1.2 handshake (2 RTT) = 3.5 RTT antes do primeiro byte de dados.</p><p><strong>HTTP/2 (TCP + TLS 1.3)</strong>: 1 RTT TCP + 1 RTT TLS 1.3 = 2 RTT antes dos dados. (TLS 1.3 reduziu de 2 para 1 RTT).</p><p><strong>HTTP/3 (QUIC)</strong>: TCP e TLS são integrados. 1 RTT para novas conexões. 0-RTT para conexões resumidas (dados na primeira mensagem).</p><p>Em 100ms de RTT: HTTP/1.1 fica 350ms esperando só pelo handshake; HTTP/3 fica 100ms.</p>",
      tip: "Quantificar os RTTs (3.5 vs 2 vs 1 vs 0) é o que faz a resposta memorável e demonstra que você não está apenas descrevendo conceitos.",
    },
    {
      level: "pleno",
      q: "O que é binary framing layer no HTTP/2 e como ele difere do HTTP/1.1?",
      a: "<p><strong>HTTP/1.1</strong>: protocolo textual. Request e response são texto ASCII legível. Parsear requer identificar <code>\\r\\n</code>, headers por <code>: </code>, corpo pelo <code>Content-Length</code>. Propenso a bugs (request smuggling, line folding).</p><p><strong>HTTP/2 binary framing</strong>: mensagens divididas em frames binários com estrutura fixa:</p><ul><li>9 bytes de header de frame: length (3 bytes), type (1), flags (1), stream ID (4).</li><li>Tipos: HEADERS, DATA, SETTINGS, WINDOW_UPDATE, RST_STREAM, PUSH_PROMISE, PING.</li></ul><p>Vantagens: parsing determinístico, sem ambiguidade, compacto. Um HEADERS frame pode conter headers HPACK-comprimidos. Um DATA frame contém o corpo da resposta. Múltiplos frames de diferentes streams podem ser intercalados.</p>",
      tip: "Mencionar request smuggling como vulnerabilidade do protocolo textual contextualiza por que HTTP/2 ser binário é uma melhoria de segurança, não só de performance.",
    },
    {
      level: "senior",
      q: "Quando você escolheria HTTP/2 vs HTTP/3 para uma API interna de microsserviços?",
      a: "<p><strong>HTTP/2 (gRPC) — padrão para microsserviços</strong>:</p><ul><li>Infraestrutura interna confiável — baixa perda de pacotes. HoL do TCP não é problema real.</li><li>gRPC tem ecossistema maduro: service mesh (Istio, Linkerd), load balancing por stream, interceptors.</li><li>Debugging mais fácil que HTTP/3 (ferramentas como grpcurl, evans).</li><li>Istio faz mTLS automaticamente em HTTP/2.</li></ul><p><strong>HTTP/3 — considerar quando</strong>:</p><ul><li>APIs expostas a mobile em redes instáveis (CDN → origem em 4G).</li><li>Alta latência e packet loss na rota.</li><li>Necessidade de migração de IP (mobile handoff).</li></ul><p>Regra prática: datacenters → HTTP/2/gRPC. Edge → usuário final → HTTP/3.</p>",
      tip: "A distinção datacenter vs edge é a estrutura mental que resolve 90% das perguntas sobre quando usar cada versão. Simples de comunicar e demonstra experiência operacional.",
    },
    {
      level: "senior",
      q: "Como HEAD-OF-LINE blocking funciona em TCP e por que é tão difícil de resolver sem mudar o protocolo?",
      a: "<p>TCP garante entrega ordenada e confiável. Quando um pacote é perdido, TCP para de entregar os pacotes subsequentes para a aplicação mesmo que eles já tenham chegado no buffer — eles ficam retidos até o pacote perdido ser retransmitido e entregue em ordem.</p><p>Este é o TCP HoL blocking. Ele opera no kernel — a aplicação (HTTP/2) não tem visibilidade ou controle sobre isso. HTTP/2 pode multiplexar streams na aplicação, mas todos esses streams compartilham o mesmo buffer TCP.</p><p>Por que é difícil de resolver no TCP:</p><ul><li>TCP é implementado no kernel, e a interface é um byte stream ordenado.</li><li>Mudar o TCP requer mudança em todos os kernels (anos de rollout).</li><li>QUIC resolve implementando o protocolo em userspace sobre UDP — pode ser atualizado independentemente do kernel.</li></ul>",
      tip: "A explicação 'implementado no kernel, interface é byte stream' é o que demonstra entendimento real da limitação — não é escolha de design do HTTP/2, é limitação fundamental do TCP.",
    },
  ],
  diagrams: [
    {
      title: "HTTP/1.1 vs HTTP/2 vs HTTP/3 — Comparação de Conexões",
      html: `<style>
.h2-cmp { font-family: 'JetBrains Mono', monospace; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.h2-cmp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.h2-col { background: #1e293b; border-radius: 8px; padding: 16px; border-top: 3px solid var(--c); }
.h2-col h3 { margin: 0 0 12px; font-size: 13px; color: var(--c); }
.h2-conn-line { background: var(--c); border-radius: 2px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; padding: 4px 8px; opacity: 0.85; }
.h2-conn-line span { font-size: 10px; white-space: nowrap; overflow: hidden; }
.h2-stream { background: #1e293b; border: 1px solid var(--c); border-radius: 3px; padding: 2px 6px; font-size: 9px; color: var(--c); }
.h2-sep { border: none; border-top: 1px solid #334155; margin: 12px 0; }
.h2-note { font-size: 11px; color: #94a3b8; }
.h2-tag { display: inline-block; background: var(--c); color: #000; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; margin-bottom: 8px; }
</style>
<div class="h2-cmp">
  <div class="h2-cmp-grid">
    <div class="h2-col" style="--c:#94a3b8">
      <div class="h2-tag">HTTP/1.1</div>
      <h3>6 conexões TCP paralelas</h3>
      <div class="h2-conn-line" style="background:#475569"><span>Conexão 1 → Request A</span></div>
      <div class="h2-conn-line" style="background:#475569"><span>Conexão 2 → Request B</span></div>
      <div class="h2-conn-line" style="background:#475569"><span>Conexão 3 → Request C</span></div>
      <div class="h2-conn-line" style="background:#334155"><span>Conexão 4 → esperando...</span></div>
      <div class="h2-conn-line" style="background:#334155"><span>Conexão 5 → esperando...</span></div>
      <div class="h2-conn-line" style="background:#334155"><span>Conexão 6 → esperando...</span></div>
      <hr class="h2-sep"/>
      <div class="h2-note">⚠ Requests 7+ ficam em fila. HoL por conexão. Muito overhead de handshake.</div>
    </div>
    <div class="h2-col" style="--c:#06b6d4">
      <div class="h2-tag" style="color:#fff">HTTP/2</div>
      <h3>1 conexão TCP, N streams</h3>
      <div class="h2-conn-line" style="background:#0e7490">
        <span>Conexão única com TLS</span>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px">
        <div class="h2-stream">stream 1</div>
        <div class="h2-stream">stream 2</div>
        <div class="h2-stream">stream 3</div>
        <div class="h2-stream">stream 4</div>
        <div class="h2-stream">stream 5</div>
        <div class="h2-stream">stream N</div>
      </div>
      <hr class="h2-sep"/>
      <div class="h2-note">✓ Multiplexing na camada de app. HPACK comprime headers. ⚠ Loss de pacote TCP bloqueia TODOS os streams.</div>
    </div>
    <div class="h2-col" style="--c:#22d3ee">
      <div class="h2-tag" style="color:#000">HTTP/3 / QUIC</div>
      <h3>QUIC sobre UDP, streams independentes</h3>
      <div class="h2-conn-line" style="background:#0891b2">
        <span>QUIC Connection (UDP) + TLS 1.3 integrado</span>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px">
        <div class="h2-stream" style="border-color:#22d3ee;color:#22d3ee">stream 1 ✓</div>
        <div class="h2-stream" style="border-color:#ef4444;color:#ef4444">stream 2 ✗</div>
        <div class="h2-stream" style="border-color:#22d3ee;color:#22d3ee">stream 3 ✓</div>
        <div class="h2-stream" style="border-color:#22d3ee;color:#22d3ee">stream 4 ✓</div>
      </div>
      <hr class="h2-sep"/>
      <div class="h2-note">✓ Loss em stream 2 não bloqueia streams 1, 3, 4. Connection ID permite migração de IP. 0-RTT para reconexão.</div>
    </div>
  </div>
</div>`,
      caption: "HTTP/1.1 usa múltiplas conexões para paralelismo. HTTP/2 multiplexa streams em uma TCP (mas HoL no TCP persiste). HTTP/3/QUIC tem streams genuinamente independentes.",
    },
    {
      title: "Handshake RTT — HTTP/1.1 vs HTTP/2 vs HTTP/3",
      html: `<style>
.h2-rtt { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.h2-rtt-timeline { display: flex; gap: 24px; }
.h2-rtt-col { flex: 1; }
.h2-rtt-col h4 { font-size: 12px; margin: 0 0 12px; }
.h2-rtt-step { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; }
.h2-rtt-arrow { width: 12px; height: 12px; border-right: 2px solid; border-bottom: 2px solid; transform: rotate(-45deg); margin-top: 2px; flex-shrink: 0; }
.h2-rtt-box { font-size: 11px; padding: 6px 10px; border-radius: 6px; flex: 1; }
.h2-rtt-total { margin-top: 12px; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; text-align: center; }
.h2-rtt-sep { border: none; border-left: 1px solid #334155; }
</style>
<div class="h2-rtt">
  <div class="h2-rtt-timeline">
    <div class="h2-rtt-col">
      <h4 style="color:#94a3b8">HTTP/1.1 + TLS 1.2</h4>
      <div class="h2-rtt-step">
        <div class="h2-rtt-arrow" style="border-color:#475569"></div>
        <div class="h2-rtt-box" style="background:#1e293b;border-left:3px solid #475569">TCP SYN → SYN-ACK → ACK (1 RTT)</div>
      </div>
      <div class="h2-rtt-step">
        <div class="h2-rtt-arrow" style="border-color:#475569"></div>
        <div class="h2-rtt-box" style="background:#1e293b;border-left:3px solid #475569">TLS 1.2 ClientHello → ServerHello (1 RTT)</div>
      </div>
      <div class="h2-rtt-step">
        <div class="h2-rtt-arrow" style="border-color:#475569"></div>
        <div class="h2-rtt-box" style="background:#1e293b;border-left:3px solid #475569">TLS cert + Finished (1 RTT)</div>
      </div>
      <div class="h2-rtt-step">
        <div class="h2-rtt-arrow" style="border-color:#f59e0b"></div>
        <div class="h2-rtt-box" style="background:#1e293b;border-left:3px solid #f59e0b">GET / → 200 OK (1 RTT)</div>
      </div>
      <div class="h2-rtt-total" style="background:#1e293b;border:1px solid #ef4444;color:#ef4444">Total: ~3.5 RTT antes dos dados</div>
    </div>
    <div class="h2-rtt-sep"></div>
    <div class="h2-rtt-col">
      <h4 style="color:#06b6d4">HTTP/2 + TLS 1.3</h4>
      <div class="h2-rtt-step">
        <div class="h2-rtt-arrow" style="border-color:#0e7490"></div>
        <div class="h2-rtt-box" style="background:#1e293b;border-left:3px solid #0e7490">TCP SYN → SYN-ACK → ACK (1 RTT)</div>
      </div>
      <div class="h2-rtt-step">
        <div class="h2-rtt-arrow" style="border-color:#0e7490"></div>
        <div class="h2-rtt-box" style="background:#1e293b;border-left:3px solid #0e7490">TLS 1.3 ClientHello+key_share → ServerHello+cert+Finished (1 RTT)</div>
      </div>
      <div class="h2-rtt-step">
        <div class="h2-rtt-arrow" style="border-color:#f59e0b"></div>
        <div class="h2-rtt-box" style="background:#1e293b;border-left:3px solid #f59e0b">GET / → 200 OK (1 RTT)</div>
      </div>
      <div style="height:38px"></div>
      <div class="h2-rtt-total" style="background:#1e293b;border:1px solid #f59e0b;color:#f59e0b">Total: ~2 RTT antes dos dados</div>
    </div>
    <div class="h2-rtt-sep"></div>
    <div class="h2-rtt-col">
      <h4 style="color:#22d3ee">HTTP/3 + QUIC</h4>
      <div class="h2-rtt-step">
        <div class="h2-rtt-arrow" style="border-color:#22d3ee"></div>
        <div class="h2-rtt-box" style="background:#1e293b;border-left:3px solid #22d3ee">QUIC Initial + TLS ClientHello (1 RTT — TCP+TLS juntos)</div>
      </div>
      <div class="h2-rtt-step">
        <div class="h2-rtt-arrow" style="border-color:#f59e0b"></div>
        <div class="h2-rtt-box" style="background:#1e293b;border-left:3px solid #f59e0b">GET / → 200 OK (1 RTT)</div>
      </div>
      <div class="h2-rtt-step" style="opacity:0.7">
        <div class="h2-rtt-arrow" style="border-color:#4ade80"></div>
        <div class="h2-rtt-box" style="background:#1e293b;border-left:3px solid #4ade80">0-RTT: dados já na 1ª mensagem (reconexão)</div>
      </div>
      <div style="height:18px"></div>
      <div class="h2-rtt-total" style="background:#1e293b;border:1px solid #22d3ee;color:#22d3ee">Total: 1 RTT (ou 0 RTT em reconexão)</div>
    </div>
  </div>
</div>`,
      caption: "Cada RTT adicional antes dos dados impacta diretamente o TTFB. Em 100ms de RTT, HTTP/3 economiza 200-350ms só no handshake.",
    },
    {
      title: "HPACK — Como Funciona a Compressão de Headers",
      html: `<style>
.h2-hpack { font-family: 'JetBrains Mono', monospace; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.h2-hpack h3 { font-size: 13px; color: #06b6d4; margin: 0 0 16px; }
.h2-hpack-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.h2-hpack-col { background: #1e293b; border-radius: 8px; padding: 14px; }
.h2-hpack-col h4 { font-size: 11px; color: #94a3b8; margin: 0 0 10px; }
.h2-hdr { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 11px; }
.h2-hdr-name { color: #06b6d4; }
.h2-hdr-val { color: #e2e8f0; flex: 1; }
.h2-hdr-size { color: #94a3b8; font-size: 10px; margin-left: auto; white-space: nowrap; }
.h2-hdr-idx { background: #4ade80; color: #000; padding: 1px 5px; border-radius: 3px; font-size: 9px; }
.h2-arrow-down { text-align: center; color: #06b6d4; font-size: 20px; margin: 8px 0; }
.h2-saving { background: #1e293b; border: 1px solid #4ade80; border-radius: 6px; padding: 10px 14px; text-align: center; font-size: 12px; margin-top: 12px; }
</style>
<div class="h2-hpack">
  <h3>HPACK: Request 1 (sem contexto) vs Request 2 (headers já vistos)</h3>
  <div class="h2-hpack-row">
    <div class="h2-hpack-col">
      <h4>Request 1 — sem compressão possível</h4>
      <div class="h2-hdr">
        <span class="h2-hdr-name">:method</span>
        <span class="h2-hdr-val">GET</span>
        <span class="h2-hdr-size">índice estático → 1 byte</span>
        <span class="h2-hdr-idx">S#2</span>
      </div>
      <div class="h2-hdr">
        <span class="h2-hdr-name">:path</span>
        <span class="h2-hdr-val">/api/users</span>
        <span class="h2-hdr-size">nome indexado + valor literal</span>
      </div>
      <div class="h2-hdr">
        <span class="h2-hdr-name">Authorization</span>
        <span class="h2-hdr-val">Bearer eyJ... (512 bytes)</span>
        <span class="h2-hdr-size">literal → adicionado à tabela dinâmica</span>
      </div>
      <div class="h2-hdr">
        <span class="h2-hdr-name">User-Agent</span>
        <span class="h2-hdr-val">Mozilla/5.0 Chrome/... (80 bytes)</span>
        <span class="h2-hdr-size">literal → adicionado à tabela dinâmica</span>
      </div>
      <div class="h2-hdr">
        <span class="h2-hdr-name">Content-Type</span>
        <span class="h2-hdr-val">application/json</span>
        <span class="h2-hdr-size">índice estático disponível</span>
      </div>
    </div>
    <div class="h2-hpack-col">
      <h4>Request 2 — tabela dinâmica ativa</h4>
      <div class="h2-hdr">
        <span class="h2-hdr-name">:method</span>
        <span class="h2-hdr-val">GET</span>
        <span class="h2-hdr-size">1 byte</span>
        <span class="h2-hdr-idx">S#2</span>
      </div>
      <div class="h2-hdr">
        <span class="h2-hdr-name">:path</span>
        <span class="h2-hdr-val">/api/orders</span>
        <span class="h2-hdr-size">nome indexado + valor literal</span>
      </div>
      <div class="h2-hdr" style="background:#14532d;border-radius:4px;padding:2px 4px">
        <span class="h2-hdr-name">Authorization</span>
        <span class="h2-hdr-val">Bearer eyJ... (512 bytes)</span>
        <span class="h2-hdr-size">→ 1 byte (referência dinâmica!)</span>
      </div>
      <div class="h2-hdr" style="background:#14532d;border-radius:4px;padding:2px 4px">
        <span class="h2-hdr-name">User-Agent</span>
        <span class="h2-hdr-val">Mozilla/5.0...</span>
        <span class="h2-hdr-size">→ 1 byte (referência dinâmica!)</span>
      </div>
      <div class="h2-hdr">
        <span class="h2-hdr-name">Content-Type</span>
        <span class="h2-hdr-val">application/json</span>
        <span class="h2-hdr-size">1 byte</span>
      </div>
    </div>
  </div>
  <div class="h2-saving">
    <span style="color:#4ade80;font-weight:bold">Economia no Request 2:</span> Authorization (512→1 byte) + User-Agent (80→1 byte) = 590 bytes → 2 bytes
    <br/><span style="color:#94a3b8;font-size:10px">Em APIs com 100 requests/s, isso elimina ~57MB/h de overhead de headers</span>
  </div>
</div>`,
      caption: "HPACK reduz repetição de headers com tabelas estática (RFC) e dinâmica (por conexão). A segunda request paga apenas por novidades.",
    },
  ],
  mnemonics: [
    {
      label: "HTTP HoL — onde ocorre?",
      trick: "1.1 = App e TCP; 2 = só TCP; 3 = nenhum",
      explanation: "HTTP/1.1 tem HoL em camada de aplicação (requests seriais) E em TCP. HTTP/2 resolve o HoL de aplicação com multiplexing, mas TCP HoL persiste. HTTP/3/QUIC elimina o HoL de TCP movendo os streams para QUIC (sobre UDP). A progressão é: ambos → só transporte → nenhum.",
    },
    {
      label: "RTT count — 3.5, 2, 1, 0",
      trick: "Sênior, Pleno, Júnior, Estágio",
      explanation: "HTTP/1.1+TLS1.2 = 3.5 RTT (Sênior espera mais). HTTP/2+TLS1.3 = 2 RTT. HTTP/3/QUIC nova conexão = 1 RTT. QUIC 0-RTT resumida = 0 RTT. Números absurdos ficam na memória: 3.5→2→1→0.",
    },
    {
      label: "QUIC = Q (UDP) + U (userspace) + I (integrado TLS) + C (Connection ID)",
      trick: "QUIC",
      explanation: "Q = protocolo sobre UDP (não TCP). U = implementado em userspace (pode ser atualizado sem mudança de kernel). I = TLS 1.3 integrado ao handshake. C = Connection ID permite migração de IP sem reconexão. Cada letra do nome é uma característica fundamental.",
    },
    {
      label: "Server Push morreu — 103 Early Hints vive",
      trick: "Push empurra sem perguntar. Hint sugere sem impor.",
      explanation: "Server Push (HTTP/2) enviava recursos sem saber o cache do browser — empurrava coisas que o cliente já tinha. 103 Early Hints diz ao browser 'vai precisar disso' (Link: preload) — o browser decide se faz fetch. Hint respeita cache. Push ignorava. Por isso Push morreu.",
    },
    {
      label: "Alt-Svc é a porta de entrada para HTTP/3",
      trick: "Alt-Svc = 'alternative service = HTTP/3 disponível aqui'",
      explanation: "HTTP/3 não tem porta padrão dedicada. O servidor anuncia suporte via header Alt-Svc: h3=\":443\" em respostas HTTP/2. O browser salva esse hint e tenta QUIC na próxima visita. Sem Alt-Svc, HTTP/3 nunca é usado, mesmo que o servidor suporte.",
    },
  ],
  cheatsheet: {
    title: "HTTP/2 & HTTP/3 — Cheatsheet",
    html: `<style>
.h2-cs { font-family: 'JetBrains Mono', monospace; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; font-size: 11px; }
.h2-cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.h2-cs-section { background: #1e293b; border-radius: 8px; padding: 12px; }
.h2-cs-section h3 { font-size: 11px; color: #06b6d4; margin: 0 0 10px; border-bottom: 1px solid #334155; padding-bottom: 6px; }
.h2-cs-row { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 5px; }
.h2-cs-key { color: #94a3b8; }
.h2-cs-val { color: #e2e8f0; text-align: right; }
.h2-cs-tag { display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 9px; }
.h2-ok { background: #14532d; color: #4ade80; }
.h2-bad { background: #450a0a; color: #f87171; }
.h2-warn { background: #451a03; color: #fb923c; }
</style>
<div class="h2-cs">
  <div class="h2-cs-grid">
    <div class="h2-cs-section">
      <h3>Versões comparadas</h3>
      <div class="h2-cs-row"><span class="h2-cs-key">Transport</span><span class="h2-cs-val">1.1: TCP | 2: TCP | 3: QUIC/UDP</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">Multiplexing</span><span class="h2-cs-val">1.1: ✗ | 2: ✓ app | 3: ✓ transport</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">HoL blocking</span><span class="h2-cs-val">1.1: app+TCP | 2: TCP only | 3: ✗</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">Handshake RTT</span><span class="h2-cs-val">1.1: 3.5 | 2: 2 | 3: 1 (0 resume)</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">TLS</span><span class="h2-cs-val">1.1: opcional | 2: obrig. (browser) | 3: integrado</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">Headers</span><span class="h2-cs-val">1.1: ASCII | 2: HPACK | 3: QPACK</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">IP migration</span><span class="h2-cs-val">1.1+2: ✗ | 3: ✓ Connection ID</span></div>
    </div>
    <div class="h2-cs-section">
      <h3>QUIC características</h3>
      <div class="h2-cs-row"><span class="h2-cs-key">RFC</span><span class="h2-cs-val">RFC 9000 (2021)</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">Transport</span><span class="h2-cs-val">UDP (userspace)</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">TLS</span><span class="h2-cs-val">1.3 integrado obrigatório</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">0-RTT</span><span class="h2-cs-val">✓ (replay risk em POST)</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">Negociação</span><span class="h2-cs-val">Alt-Svc: h3=":443"</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">Adoção 2026</span><span class="h2-cs-val">Cloudflare, Google, Fastly</span></div>
    </div>
    <div class="h2-cs-section">
      <h3>Diagnóstico</h3>
      <div class="h2-cs-row"><span class="h2-cs-key">curl HTTP/2</span><span class="h2-cs-val">curl -I --http2 https://host</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">curl HTTP/3</span><span class="h2-cs-val">curl -I --http3 https://host</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">nginx HTTP/2</span><span class="h2-cs-val">listen 443 ssl http2;</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">nginx HTTP/3</span><span class="h2-cs-val">listen 443 quic reuseport;</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">Anunciar H3</span><span class="h2-cs-val">Alt-Svc: h3=":443"; ma=86400</span></div>
      <div class="h2-cs-row"><span class="h2-cs-key">DevTools</span><span class="h2-cs-val">Network → Protocol: h2/h3</span></div>
    </div>
    <div class="h2-cs-section">
      <h3>Antipadrões a evitar</h3>
      <div style="margin-bottom:5px"><span class="h2-cs-tag h2-bad">ruim</span> Domain sharding com HTTP/2 (perde HPACK)</div>
      <div style="margin-bottom:5px"><span class="h2-cs-tag h2-bad">ruim</span> Server Push em produção (deprecated)</div>
      <div style="margin-bottom:5px"><span class="h2-cs-tag h2-bad">ruim</span> 0-RTT em endpoints POST/write (replay)</div>
      <div style="margin-bottom:5px"><span class="h2-cs-tag h2-bad">ruim</span> Rate limit por conexão TCP com HTTP/2</div>
      <div style="margin-bottom:5px"><span class="h2-cs-tag h2-warn">atenção</span> UDP bloqueado em firewall corp → sem HTTP/3</div>
      <div style="margin-bottom:5px"><span class="h2-cs-tag h2-ok">ok</span> 103 Early Hints em vez de Server Push</div>
    </div>
  </div>
</div>`,
  },
  mindmap: {
    title: "HTTP/2 & HTTP/3 — Mapa Mental",
    html: `<style>
.h2-mm { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.h2-mm-center { text-align: center; font-size: 16px; font-weight: bold; color: #06b6d4; margin-bottom: 24px; padding: 12px; background: #164e63; border-radius: 8px; }
.h2-mm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.h2-mm-card { background: #1e293b; border-radius: 8px; padding: 12px; border-left: 3px solid var(--c); }
.h2-mm-card h4 { font-size: 11px; color: var(--c); margin: 0 0 8px; }
.h2-mm-item { font-size: 10px; color: #e2e8f0; margin-bottom: 4px; padding-left: 10px; position: relative; }
.h2-mm-item::before { content: '→'; position: absolute; left: 0; color: var(--c); }
.h2-mm-item.h2-key { font-weight: bold; }
</style>
<div class="h2-mm">
  <div class="h2-mm-center">HTTP/2 &amp; HTTP/3 — Evolução do Protocolo Web</div>
  <div class="h2-mm-grid">
    <div class="h2-mm-card" style="--c:#94a3b8">
      <h4>HTTP/1.1 — Legado</h4>
      <div class="h2-mm-item h2-key">6 conexões TCP paralelas por host</div>
      <div class="h2-mm-item">Headers ASCII verbosos</div>
      <div class="h2-mm-item">Keep-alive para reuso</div>
      <div class="h2-mm-item">Domain sharding (antipadrão em H2)</div>
      <div class="h2-mm-item">HoL em app E em TCP</div>
    </div>
    <div class="h2-mm-card" style="--c:#06b6d4">
      <h4>HTTP/2 — Multiplexing</h4>
      <div class="h2-mm-item h2-key">1 conexão TCP, N streams</div>
      <div class="h2-mm-item h2-key">HPACK: compressão de headers</div>
      <div class="h2-mm-item">Binary framing (não ASCII)</div>
      <div class="h2-mm-item">Stream priority (deprecated)</div>
      <div class="h2-mm-item">Server Push → deprecated</div>
      <div class="h2-mm-item">HoL TCP persiste</div>
    </div>
    <div class="h2-mm-card" style="--c:#22d3ee">
      <h4>HTTP/3 / QUIC</h4>
      <div class="h2-mm-item h2-key">QUIC sobre UDP (RFC 9000)</div>
      <div class="h2-mm-item h2-key">Streams independentes (sem HoL)</div>
      <div class="h2-mm-item">TLS 1.3 integrado</div>
      <div class="h2-mm-item">0-RTT para reconexão</div>
      <div class="h2-mm-item">Connection ID → migração de IP</div>
      <div class="h2-mm-item">QPACK (HPACK adaptado)</div>
    </div>
    <div class="h2-mm-card" style="--c:#4ade80">
      <h4>Latência — RTT</h4>
      <div class="h2-mm-item">HTTP/1.1 + TLS 1.2 = 3.5 RTT</div>
      <div class="h2-mm-item">HTTP/2 + TLS 1.3 = 2 RTT</div>
      <div class="h2-mm-item h2-key">HTTP/3 nova conexão = 1 RTT</div>
      <div class="h2-mm-item h2-key">QUIC 0-RTT (resume) = 0 RTT</div>
      <div class="h2-mm-item">100ms RTT × 3.5 = 350ms handshake</div>
    </div>
    <div class="h2-mm-card" style="--c:#f59e0b">
      <h4>Negociação e Adoção</h4>
      <div class="h2-mm-item h2-key">Alt-Svc anuncia HTTP/3</div>
      <div class="h2-mm-item">Fallback TCP se UDP bloqueado</div>
      <div class="h2-mm-item">Cloudflare, Google, Fastly: padrão</div>
      <div class="h2-mm-item">Backend origin: HTTP/2 dominante</div>
      <div class="h2-mm-item">gRPC: HTTP/2 obrigatório</div>
    </div>
    <div class="h2-mm-card" style="--c:#ef4444">
      <h4>Armadilhas Críticas</h4>
      <div class="h2-mm-item h2-key">HoL TCP em HTTP/2 é real</div>
      <div class="h2-mm-item">Server Push morreu (use 103)</div>
      <div class="h2-mm-item">0-RTT replay em POST = vuln</div>
      <div class="h2-mm-item">Rate limit por conexão TCP falha em H2</div>
      <div class="h2-mm-item">Domain sharding prejudica HTTP/2</div>
    </div>
  </div>
</div>`,
  },
  exercises: [
    {
      level: "iniciante",
      title: "Verificar versão HTTP em sites reais",
      description: "Use o curl e o Chrome DevTools para verificar qual versão do HTTP está sendo usada nos 5 sites que você mais acessa. Documente: qual versão encontrou, se há Alt-Svc na resposta, se o site usa HTTP/3.",
      concepts: ["http-versions", "alt-svc", "curl", "devtools"],
    },
    {
      level: "intermediario",
      title: "Configurar nginx com HTTP/2 e medir impacto em TTFB",
      description: "Configure um servidor nginx local com HTTP/1.1 e depois com HTTP/2 (TLS obrigatório — use mkcert para certificado local). Use curl --http2 e o Lighthouse para medir TTFB e comparar. Experimente servir múltiplos arquivos pequenos vs um arquivo bundlado e compare qual performa melhor em cada versão.",
      concepts: ["nginx", "http2", "tls", "ttfb", "bundling-tradeoff"],
    },
    {
      level: "intermediario",
      title: "Simular Head-of-Line Blocking com tc (traffic control)",
      description: "Use tc qdisc para adicionar 5% de packet loss em uma interface de rede local. Faça requests HTTP/2 e HTTP/1.1 para um servidor local e meça o impacto. Observe como HTTP/2 com multiplexing se comporta pior do que o esperado quando há perda. Compare com HTTP/3 via cloudflared ou um tunnel se tiver acesso.",
      concepts: ["hol-blocking", "packet-loss", "multiplexing", "tcp-limitations"],
    },
    {
      level: "senior",
      title: "Implementar rate limiter correto para HTTP/2",
      description: "Crie um middleware Node.js/Express (ou nginx config) que conta requests HTTP corretamente, não conexões TCP. Demonstre o problema: sem o fix, um client HTTP/2 pode fazer N×limite de requests antes de ser bloqueado. Implemente a solução com Redis para contar por stream ID ou por usuário autenticado. Escreva um test que prova que o limite funciona com cliente HTTP/2.",
      concepts: ["rate-limiting", "http2-streams", "redis", "middleware", "l4-vs-l7"],
    },
    {
      level: "senior",
      title: "Implementar 103 Early Hints em um servidor Node.js",
      description: "Crie um servidor HTTP/2 em Node.js que retorna 103 Early Hints com Link: rel=preload para CSS e fontes críticas antes de processar a resposta final. Simule uma rota lenta (200ms de delay) e meça se o browser começa a baixar os recursos durante o delay. Use Chrome DevTools para verificar o timing. Compare LCP com e sem Early Hints.",
      concepts: ["early-hints", "103-status", "http2", "lcp", "preload", "browser-performance"],
    },
  ],
  codeExamples: [
    {
      title: "Node.js HTTP/2 server com push de assets críticos",
      language: "javascript",
      code: `import http2 from 'node:http2'
import fs from 'node:fs'
import path from 'node:path'

const server = http2.createSecureServer({
  key:  fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
})

server.on('stream', (stream, headers) => {
  const url = headers[':path']

  if (url === '/') {
    // HTTP/2 Server Push (deprecated em browsers, mas ainda funciona em Node)
    // Em produção: use 103 Early Hints em vez disso
    if (stream.pushAllowed) {
      stream.pushStream({ ':path': '/style.css' }, (err, pushStream) => {
        if (err) return
        pushStream.respondWithFile('./public/style.css', {
          'content-type': 'text/css',
        })
      })
    }

    stream.respondWithFile('./public/index.html', {
      ':status': 200,
      'content-type': 'text/html',
    })
  } else {
    // Servir arquivos estáticos normalmente
    const filePath = path.join('./public', url)
    try {
      stream.respondWithFile(filePath)
    } catch {
      stream.respond({ ':status': 404 })
      stream.end()
    }
  }
})

server.listen(8443, () => {
  console.log('HTTP/2 server em https://localhost:8443')
  console.log('Verificar com: curl -k -I --http2 https://localhost:8443')
})`,
    },
    {
      title: "103 Early Hints em Express (HTTP/2)",
      language: "typescript",
      code: `import express from 'express'
import http2 from 'node:http2'
import http2Express from 'http2-express-bridge'
import fs from 'node:fs'

const app = http2Express(express)

app.get('/', async (req, res) => {
  // 103 Early Hints — browser inicia fetch antes do body chegar
  // Suportado por Chrome, Cloudflare, nginx 1.25+
  res.writeEarlyHints({
    'link': [
      '<https://fonts.googleapis.com/css2?family=Inter>; rel=preload; as=style',
      '</style.css>; rel=preload; as=style',
      '</app.js>; rel=preload; as=script',
    ],
  })

  // Simula processamento lento (200ms) — browser baixa assets durante esse tempo
  await new Promise(r => setTimeout(r, 200))

  // Resposta final: browser já tem os assets em cache ou em download
  res.status(200).send(\`
    <html>
      <head>
        <link rel="stylesheet" href="/style.css"/>
        <script src="/app.js" defer></script>
      </head>
      <body><h1>Carregou com 103 Early Hints</h1></body>
    </html>
  \`)
})

const server = http2.createSecureServer({
  key:  fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem'),
  allowHTTP1: true,
}, app)

server.listen(3000)`,
    },
    {
      title: "Detectar versão HTTP em middleware e rate limit correto para HTTP/2",
      language: "typescript",
      code: `import { createClient } from 'redis'
import type { Request, Response, NextFunction } from 'express'

const redis = createClient({ url: process.env.REDIS_URL })
await redis.connect()

/**
 * Rate limiter correto para HTTP/2.
 *
 * Com HTTP/1.1, cada conexão TCP = 1 request ativo.
 * Com HTTP/2, 1 conexão TCP = centenas de streams simultâneos.
 * Rate limit na camada TCP seria contorneado trivialmente.
 * Aqui contamos por usuário/IP na camada de aplicação (L7).
 */
export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Identificar client — preferência: usuário autenticado > API key > IP
  const clientId =
    (req.user as { id: string } | undefined)?.id ??
    req.headers['x-api-key'] as string ??
    req.ip

  const windowSec = 60
  const limit = 100
  const key = \`rl:\${clientId}:\${Math.floor(Date.now() / (windowSec * 1000))}\`

  // INCR atômico no Redis — funciona com N instâncias (sem contador local)
  const count = await redis.incr(key)
  if (count === 1) {
    // Primeira request na janela — define TTL
    await redis.expire(key, windowSec)
  }

  // Headers padrão de rate limit (RFC 6585)
  res.setHeader('X-RateLimit-Limit', limit)
  res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - count))
  res.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / 1000) + windowSec)

  if (count > limit) {
    res.setHeader('Retry-After', windowSec)
    return res.status(429).json({
      error: 'Too Many Requests',
      retryAfter: windowSec,
    })
  }

  // Log de versão HTTP para métricas (opcional)
  const httpVersion = req.httpVersion // '2.0' | '1.1' | '1.0'
  if (httpVersion === '2.0' && count === 1) {
    console.debug(\`[HTTP/2 client] \${clientId} — \${count}/\${limit} na janela\`)
  }

  next()
}`,
    },
  ],
  videos: [
    {
      title: "HTTP/2 and HTTP/3 explained — The Coding Train",
      channel: "Fireship",
      url: "https://www.youtube.com/watch?v=a-sBfyiXysI",
      topic: "HTTP/2 e HTTP/3 visão geral",
    },
    {
      title: "QUIC and HTTP/3 — IETF 101",
      channel: "IETF",
      url: "https://www.youtube.com/watch?v=RIFnXaiRs_o",
      topic: "QUIC design e motivações",
    },
    {
      title: "HTTP/2 Deep Dive",
      channel: "Google Chrome Developers",
      url: "https://www.youtube.com/watch?v=e_FXPU94xWA",
      topic: "Multiplexing, HPACK, Server Push",
    },
    {
      title: "HTTP/3 is here — What you need to know",
      channel: "ByteByteGo",
      url: "https://www.youtube.com/watch?v=0in5ORKsGMY",
      topic: "HTTP/3 vs HTTP/2 comparação prática",
    },
    {
      title: "QUIC: A UDP-Based Multiplexed and Secure Transport",
      channel: "USENIX",
      url: "https://www.youtube.com/watch?v=B1SQFjIXJtc",
      topic: "Arquitetura técnica do QUIC",
    },
  ],
  resources: [
    { title: "High Performance Browser Networking — HTTP/2", url: "https://hpbn.co/http2/", kind: "livro" },
    { title: "High Performance Browser Networking — HTTP/3 e QUIC", url: "https://hpbn.co/quic/", kind: "livro" },
    { title: "Cloudflare — HTTP/3 the past, present and future", url: "https://blog.cloudflare.com/http3-the-past-present-and-future/", kind: "artigo" },
    { title: "IETF — RFC 9000 (QUIC)", url: "https://datatracker.ietf.org/doc/html/rfc9000", kind: "docs" },
    { title: "HTTP/3 explained (haxx.se)", url: "https://http3-explained.haxx.se/", kind: "docs" },
    { title: "web.dev — Early Hints (103)", url: "https://web.dev/articles/early-hints", kind: "artigo" },
    { title: "Chromium — HTTP/3 and QUIC", url: "https://www.chromium.org/quic/", kind: "docs" },
    { title: "RFC 7541 — HPACK Header Compression", url: "https://datatracker.ietf.org/doc/html/rfc7541", kind: "docs" },
  ],
}

export default http2Http3
