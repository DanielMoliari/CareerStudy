import type { SkillContent } from "@/types"

const tcpIpDns: SkillContent = {
  tagline: "Stack de protocolos da internet: como dois computadores se acham e conversam.",
  why: "Sênior precisa explicar o que acontece quando você digita uma URL no browser. DNS, TCP handshake, congestion control, UDP vs TCP aparecem em entrevistas de backend e system design. Fundamental para debugar latência, falhas de rede e design de sistemas distribuídos.",
  summary: "Stack TCP/IP: aplicação (HTTP, gRPC) → transporte (TCP/UDP) → rede (IP) → link (Ethernet). DNS resolve hostname em IP via hierarquia de resolvers. TCP é confiável (3-way handshake, ACK, retransmit, congestion control). UDP é best-effort. Saber portas, NAT, traceroute, e o que pode dar errado em cada camada é esperado em entrevistas sênior.",
  keypoints: [
    { title: "Modelo OSI vs TCP/IP", body: "OSI tem 7 camadas (teórico); TCP/IP usa 4 na prática. Na realidade: aplicação (HTTP), transporte (TCP/UDP), rede (IP), link (Ethernet). OSI é útil como vocabulário em entrevistas." },
    { title: "IP", body: "Endereço 32 bits (IPv4) ou 128 bits (IPv6). Roteamento via tabelas. Best-effort: perde pacotes, não garante ordem, sem noção de conexão. O TCP adiciona confiabilidade sobre IP." },
    { title: "TCP", body: "Connection-oriented, confiável. 3-way handshake (SYN, SYN-ACK, ACK). ACK + retransmit + ordering. Slow start + congestion control (AIMD). Encerramento: 4-way (FIN, ACK, FIN, ACK)." },
    { title: "UDP", body: "Sem conexão, sem garantia. Header pequeno (8 bytes vs 20+ TCP). Bom para DNS, video streaming, gaming, VoIP, QUIC. Você reimplementa confiabilidade se precisar." },
    { title: "DNS", body: "Hierarquia: root (.) → TLD (.com) → authoritative. Resolver recursivo cacheia. Records: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (verificação, SPF), NS (nameserver)." },
    { title: "NAT", body: "Network Address Translation: traduz IP privado ↔ público. Múltiplos hosts compartilham um IP público via mapeamento de portas. Quebra peer-to-peer — você não pode 'discar' para IP atrás de NAT." },
    { title: "TCP congestion control", body: "Slow start: janela cresce exponencialmente até threshold. Congestion avoidance: cresce linearmente. Congestion detected (loss): reduz pela metade (AIMD). CUBIC e BBR são algoritmos modernos." },
    { title: "Portas", body: "0-1023 reservadas (HTTP 80, HTTPS 443, SSH 22, DNS 53, SMTP 25, PostgreSQL 5432). 1024-49151 user-assigned. 49152-65535 ephemeral (cliente aloca automaticamente)." },
    { title: "QUIC / HTTP/3", body: "QUIC usa UDP como transporte, incorpora TLS 1.3, elimina head-of-line blocking do TCP. Conexão em 1 RTT (0-RTT em resumption). Ideal para mobile (conexões mudam de Wi-Fi para 4G sem reconexão)." },
  ],
  gotchas: [
    "Confundir TCP e IP — IP é endereçamento e roteamento; TCP é conexão confiável sobre IP. Protocolos distintos em camadas distintas.",
    "Achar que UDP é 'TCP mais rápido' — UDP não tem garantia nenhuma; você reimplementa o que precisar na camada de aplicação.",
    "Esquecer cache de DNS — TTL controla quanto tempo a resposta fica em cache. Mudar um registro A não propaga instantaneamente.",
    "Ignorar NAT em desenvolvimento — funciona local, falha em produção atrás de firewall corporativo.",
    "Pensar que HTTPS é direto sobre TCP — é HTTP → TLS → TCP. Três handshakes distintos antes de dados HTTP.",
    "IPv6 não é 'IPv4 com mais bits' — protocolo diferente, sem NAT obrigatório, autoconfiguração SLAAC, grupos multicast.",
    "TCP slow start em conexões curtas penaliza throughput — HTTP/2 multiplexing e HTTP/3 QUIC ajudam nisso.",
    "TIME_WAIT depois de fechar conexão TCP — porta fica ocupada por 2×MSL (tipicamente 60s). Em alta carga pode esgotar portas ephemeral.",
    "Confundir CNAME e A record — CNAME aponta para outro hostname (não IP); A record aponta para IP. CNAME no apex do domínio causa problemas.",
  ],
  interview: [
    {
      q: "O que acontece quando você digita 'https://google.com' no browser? Resposta completa.",
      level: "senior",
      a: "<p>Resposta em etapas:</p><ol><li><strong>Verificação de cache local:</strong> browser checa cache de DNS local e arquivo /etc/hosts.</li><li><strong>DNS lookup:</strong> resolver recursivo (8.8.8.8 ou do ISP) consulta: cache próprio → root nameserver → TLD (.com) → authoritative (google.com). Resposta: IP do servidor. UDP porta 53.</li><li><strong>TCP handshake:</strong> SYN → SYN-ACK → ACK para o IP:443. 1 RTT. Conexão estabelecida.</li><li><strong>TLS handshake:</strong> TLS 1.3: ClientHello + key_share → ServerHello + cert + Finished → Finished. 1 RTT. Chave de sessão derivada.</li><li><strong>HTTP/2 request:</strong> GET / com headers comprimidos (HPACK). Múltiplos streams no mesmo TCP.</li><li><strong>Response + render:</strong> server retorna HTML. Browser parseia, descobre recursos (CSS/JS/img), faz requests paralelos. Critical rendering path: DOM + CSSOM → Render tree → Layout → Paint → Composite.</li></ol><p>Total pré-dados: DNS lookup + 1 RTT TCP + 1 RTT TLS = ~3 RTTs (+ latência DNS).</p>",
      tip: "Para entrevista sênior, mencione os RTTs explicitamente (DNS lookup, TCP 1 RTT, TLS 1 RTT), HTTP/2 multiplexing e critical rendering path. Candidatos que incluem TLS e rendering mostram visão end-to-end.",
    },
    {
      q: "Diferença entre TCP e UDP — quando usar cada um?",
      level: "pleno",
      a: "<p><strong>TCP</strong>: orientado a conexão (3-way handshake), confiável (ACK + retransmissão), ordenado (seq numbers), controle de fluxo e congestionamento. Header 20+ bytes. Overhead maior.</p><p><strong>Use TCP para:</strong> HTTP/HTTPS, SSH, banco de dados, SMTP, qualquer protocolo que precisa de dados corretos e completos.</p><p><strong>UDP</strong>: sem conexão, sem garantia, sem ordem. Header 8 bytes. Overhead mínimo.</p><p><strong>Use UDP para:</strong> DNS (queries pequenas e rápidas), streaming de vídeo (melhor um frame atrasado que pausar tudo), gaming (latência < corretude), VoIP, QUIC (reimplementa confiabilidade de forma mais eficiente que TCP).</p>",
      tip: "A resposta sênior menciona QUIC: usa UDP mas implementa confiabilidade e TLS dentro do protocolo, eliminando as ineficiências do TCP (head-of-line blocking, 3 handshakes separados).",
    },
    {
      q: "Como funciona o DNS em detalhes?",
      level: "senior",
      a: "<p>Hierarquia distribuída:</p><ol><li><strong>Root nameservers (13 clusters):</strong> sabem quais nameservers são responsáveis por cada TLD.</li><li><strong>TLD nameservers:</strong> sabem quais nameservers são authoritative para cada domínio registrado.</li><li><strong>Authoritative nameservers:</strong> têm os registros reais (A, AAAA, MX, TXT, CNAME, NS).</li></ol><p><strong>Fluxo completo (cache miss):</strong> cliente → resolver recursivo (ISP ou 8.8.8.8) → root → TLD → authoritative. Resposta volta ao resolver que cacheia por TTL → responde ao cliente.</p><p><strong>Tipos de record críticos:</strong></p><ul><li><code>A</code>: hostname → IPv4.</li><li><code>AAAA</code>: hostname → IPv6.</li><li><code>CNAME</code>: hostname → outro hostname (segue cadeia). Proibido no apex.</li><li><code>MX</code>: hostname para email com prioridade.</li><li><code>TXT</code>: verificação de domínio, SPF, DKIM, DMARC.</li><li><code>NS</code>: quais nameservers são authoritative.</li></ul>",
      tip: "Mencione TTL e que cache errado é o problema mais comum em deploy (trocar IP de servidor mas DNS antigo ainda em cache). Para sênior: ALIAS record (ou ANAME) como alternativa ao CNAME no apex.",
    },
    {
      q: "Explique o TCP 3-way handshake e o 4-way termination.",
      level: "pleno",
      a: "<p><strong>3-way handshake (estabelecimento):</strong></p><ol><li><strong>SYN:</strong> cliente envia com seu número de sequência inicial (ISN) aleatório <code>x</code>. Sinaliza: quero abrir conexão.</li><li><strong>SYN-ACK:</strong> servidor responde com seu ISN <code>y</code> e ACK de <code>x+1</code> (confirmando que recebeu o SYN do cliente).</li><li><strong>ACK:</strong> cliente envia ACK de <code>y+1</code>. Conexão estabelecida. Ambos sincronizaram seq numbers.</li></ol><p><strong>4-way termination:</strong></p><ol><li>Lado A: <code>FIN</code> — terminei de enviar.</li><li>Lado B: <code>ACK</code> do FIN de A. Mas pode ter mais dados para enviar.</li><li>Lado B: <code>FIN</code> — terminei de enviar.</li><li>Lado A: <code>ACK</code> do FIN de B. Espera TIME_WAIT (2×MSL ≈ 60s) antes de fechar porta.</li></ol>",
      tip: "TIME_WAIT é o detalhe que diferencia respostas sênior — a porta fica bloqueada por até 60s. Em servidores de alta carga, isso pode esgotar portas ephemeral. Solução: SO_REUSEADDR, ajustar net.ipv4.tcp_tw_reuse.",
    },
    {
      q: "O que é TCP congestion control e como funciona?",
      level: "senior",
      a: "<p>Congestion control evita sobrecarregar a rede — se todos enviassem no máximo sem controle, haveria colapso (congestion collapse).</p><p><strong>Algoritmo clássico (Reno/CUBIC):</strong></p><ul><li><strong>Slow Start:</strong> começa com janela de congestionamento (cwnd) = 1 MSS. Dobra a cada RTT (crescimento exponencial) até atingir ssthresh.</li><li><strong>Congestion Avoidance:</strong> acima do ssthresh, cresce +1 MSS por RTT (linear).</li><li><strong>Congestion detected (perda de pacote):</strong> ssthresh = cwnd/2, cwnd volta a 1 (Tahoe) ou cwnd = ssthresh (Reno). AIMD — Additive Increase, Multiplicative Decrease.</li></ul><p><strong>BBR (Bottleneck Bandwidth and RTT, Google):</strong> em vez de reagir à perda, mede continuamente bandwidth e RTT para manter throughput ótimo sem encher buffers. Usado no YouTube, Google Cloud.</p><p><strong>Impacto prático:</strong> slow start penaliza conexões curtas (ex: uma página HTTP que fecha após 1 resposta). HTTP/2 e HTTP/3 mitiga reusando a conexão.</p>",
      tip: "BBR vs CUBIC é um ponto sênior — BBR não espera perder pacotes para reduzir, modela o link diretamente. Mencionar slow start como problema para conexões curtas e como HTTP/2 resolve isso mostra entendimento sistêmico.",
    },
    {
      q: "Como funciona o NAT e quais seus side effects?",
      level: "senior",
      a: "<p><strong>NAT (Network Address Translation):</strong> roteador mantém tabela mapeando <code>(IP_priv:porta_priv) → (IP_pub:porta_pub)</code>. Quando host interno envia pacote, roteador substitui source pelo IP público e uma porta alocada. Resposta chega com dst = IP_pub:porta_pub, roteador desfaz a tradução.</p><p><strong>Side effects críticos:</strong></p><ul><li><strong>Sem P2P:</strong> você não consegue contactar diretamente um host atrás de NAT — ele não tem IP público roteável. Requer hole punching (STUN/ICE, usado em WebRTC, VoIP).</li><li><strong>Esgotamento de portas:</strong> IP público compartilhado por muitos hosts — ~65K portas ephemeral. Em empresas com muitos usuários pode ser um gargalo.</li><li><strong>Stateful:</strong> roteador mantém estado por conexão. Restart do roteador = conexões existentes morrem.</li></ul><p><strong>IPv6 elimina NAT:</strong> espaço de endereços suficiente para endereço público único por dispositivo. Mas NAT66 ainda é usado por escolha (privacidade).</p>",
      tip: "STUN/TURN/ICE é o detalhe sênior — como WebRTC consegue P2P mesmo atrás de NAT. Hole punching: ambos os lados enviam pacotes simultaneamente, roteadores abrem a rota. Se NAT simétrico, precisa de TURN (relay).",
    },
    {
      q: "Por que DNS usa UDP por padrão? Quando usa TCP?",
      level: "pleno",
      a: "<p><strong>UDP por padrão:</strong> queries DNS são pequenas (&lt; 512 bytes para DNS clássico), únicas (1 pergunta, 1 resposta) e tolerantes a perda — cliente simplesmente repete após timeout. UDP elimina o overhead do 3-way handshake TCP = resposta em 1 round-trip.</p><p><strong>Quando DNS usa TCP:</strong></p><ul><li>Resposta &gt; 512 bytes (EDNS0 aumenta para 4096, mas se ultrapassar usa TCP).</li><li>Zone transfers entre nameservers (AXFR) — transferência de toda a zona.</li><li>DNSSEC com registros grandes.</li></ul><p><strong>DNS sobre TLS (DoT, porta 853):</strong> encripta queries DNS para privacidade — ISP não vê o que você resolve.</p><p><strong>DNS sobre HTTPS (DoH, porta 443):</strong> mesma privacidade, mais difícil de bloquear (parece tráfego HTTPS normal). Cloudflare 1.1.1.1, Google 8.8.8.8 suportam DoH.</p>",
      tip: "DoH vs DoT é um tópico emergente em entrevistas sênior — DoH dificulta bloqueio corporativo do DNS, o que tem implicações de segurança (endpoint não consegue inspecionar DNS). Mencione EDNS0 para mostrar profundidade.",
    },
    {
      q: "Explique IPv4 vs IPv6 e por que a transição é lenta.",
      level: "pleno",
      a: "<p><strong>IPv4:</strong> 32 bits = ~4.3 bilhões de endereços. Exausto desde 2011. Hoje vivemos de NAT.</p><p><strong>IPv6:</strong> 128 bits = 340 undecilhões. Sem NAT obrigatório (cada dispositivo tem IP público). SLAAC (autoconfiguração sem DHCP). IPSec mandatório. Grupos multicast em vez de broadcast.</p><p><strong>Por que a transição é lenta:</strong></p><ul><li>Não há compatibilidade direta — dual-stack (dispositivo tem IPv4 e IPv6 simultaneamente) é a estratégia de transição.</li><li>Equipamentos legados: roteadores domésticos, IoT, sistemas embarcados só têm IPv4.</li><li>NAT funciona (mal) — remove urgência percebida.</li><li>Retraining de operadores, reescrita de ACLs/firewall rules.</li></ul><p><strong>Estado atual:</strong> Google reporta ~40-50% do tráfego já em IPv6 (2025). Provedores mobile já são IPv6-first.</p>",
      tip: "Dual-stack é a resposta para como a transição funciona — não se migra de uma vez. IPv6-only com NAT64/DNS64 é outra abordagem para mobile. Mencionar que mobile providers já são IPv6-first demonstra conhecimento atual.",
    },
    {
      q: "O que é HTTP/2 e como resolve os problemas do HTTP/1.1?",
      level: "senior",
      a: "<p><strong>Problemas do HTTP/1.1:</strong></p><ul><li>Head-of-line blocking: em pipelining, resposta lenta bloqueia todas as seguintes.</li><li>Múltiplas conexões TCP para paralelismo (browsers abrem 6-8 conexões por domínio) — overhead de handshakes.</li><li>Headers repetitivos sem compressão — cookies, user-agent enviados em cada request.</li></ul><p><strong>HTTP/2 resolve:</strong></p><ul><li><strong>Multiplexing:</strong> múltiplos streams no mesmo TCP. Stream = sequência de frames. Cada request/response é um stream — sem head-of-line blocking de HTTP.</li><li><strong>Header compression (HPACK):</strong> headers comprimidos com tabela de índices — headers repetidos viram 1 byte.</li><li><strong>Server push:</strong> servidor pode enviar recursos antes do cliente pedir (ex: CSS junto com HTML).</li><li><strong>Priorização de streams:</strong> cliente indica quais streams têm mais prioridade.</li></ul><p><strong>Limitação:</strong> HTTP/2 sobre TCP ainda tem TCP head-of-line blocking — perda de 1 pacote bloqueia todos os streams. HTTP/3/QUIC resolve isso.</p>",
      tip: "A limitação do HTTP/2 (TCP head-of-line blocking persiste) e como HTTP/3/QUIC resolve é o que distingue respostas sênior. Multiplexing resolve o HOL blocking de HTTP mas não o do TCP.",
    },
    {
      q: "O que é QUIC / HTTP/3 e por que foi necessário?",
      level: "senior",
      a: "<p><strong>Problema do HTTP/2 sobre TCP:</strong> TCP garante ordem — se 1 pacote se perde, todos os streams HTTP/2 esperem, mesmo que outros streams não dependam dos dados perdidos. TCP head-of-line blocking.</p><p><strong>QUIC (RFC 9000):</strong> protocolo de transporte sobre UDP, criado pelo Google, padronizado pelo IETF. Incorpora TLS 1.3 nativamente.</p><p><strong>O que QUIC resolve:</strong></p><ul><li><strong>Sem TCP HOL blocking:</strong> streams são independentes — perda em um stream não bloqueia outros.</li><li><strong>1 RTT conexão</strong> (0-RTT em resumption): TLS integrado ao handshake QUIC — sem TCP handshake separado.</li><li><strong>Connection migration:</strong> conexão sobrevive a mudança de IP/porta (Wi-Fi → 4G) via connection ID — crítico para mobile.</li><li><strong>Better loss recovery:</strong> ACK mais granular, less spurious retransmissions.</li></ul><p><strong>HTTP/3:</strong> HTTP sobre QUIC. Adoção crescente — ~30% do tráfego web em 2024.</p>",
      tip: "Connection migration é o killer feature do QUIC para mobile — a conexão não cai quando você sai do Wi-Fi para 4G. Isso é impossível com TCP (a conexão é identificada por (IP src, port src, IP dst, port dst)).",
    },
    {
      q: "Como funciona o traceroute e o que cada linha significa?",
      level: "pleno",
      a: "<p>Traceroute envia pacotes UDP (ou ICMP) com TTL crescente (1, 2, 3...). Quando TTL chega a 0 em um roteador, o roteador descarta o pacote e retorna ICMP Time Exceeded ao origem. Assim, traceroute mapeia cada hop.</p><p><strong>Saída típica:</strong></p><pre><code>1  192.168.0.1  2ms 2ms 2ms    (gateway local)\n2  10.0.0.1    15ms ...         (roteador do ISP)\n3  * * *                        (roteador não responde ICMP — firewall)\n4  203.0.113.1  45ms ...        (backbone do ISP)\n5  8.8.8.8     55ms ...         (destino)</code></pre><p><strong>O que * * * significa:</strong> hop não retorna ICMP — firewall bloqueia ou roteador configurado para não responder. Não significa necessariamente problema.</p><p><strong>Uso prático:</strong> identificar onde está a latência (qual hop adiciona mais delay), detectar roteamento assimétrico, identificar gargalos de rede.</p>",
      tip: "Roteamento assimétrico (caminho de ida ≠ caminho de volta) é um conceito avançado — traceroute mostra apenas o caminho de ida. Isso explica por que o hop 3 pode mostrar alta latência mas o próximo hop mostra baixa (caminho de retorno diferente).",
    },
    {
      q: "O que são portas, sockets e como o sistema operacional multiplexaconexões?",
      level: "pleno",
      a: "<p><strong>Socket:</strong> abstração do SO representando um endpoint de comunicação bidirecional. Identificado pela 4-tuple: <code>(IP src, porta src, IP dst, porta dst)</code>.</p><p><strong>Porta:</strong> número de 16 bits que identifica processo no host. O SO demultiplexa pacotes TCP/UDP chegando para o processo correto via porta.</p><p><strong>Como o SO multiplexaconexões:</strong></p><ul><li>Servidor chama <code>bind()</code> em uma porta (ex: 80) e <code>listen()</code>.</li><li>Para cada conexão entrante: SO cria novo socket com a 4-tuple única. O socket de escuta continua aceitando.</li><li>Dois clientes na porta 80 do mesmo servidor: distinguidos pela porta de origem do cliente (ephemeral, 49152-65535).</li></ul><p><strong>TIME_WAIT:</strong> socket permanece nesse estado por 2×MSL após fechar (60s típico). Previne que dados atrasados da conexão antiga sejam interpretados como dados de nova conexão com a mesma 4-tuple.</p>",
      tip: "A 4-tuple como identificador único de conexão é fundamental — por isso TCP pode ter centenas de conexões simultâneas na porta 443: cada uma tem src IP:port diferente. TIME_WAIT como proteção contra dados atrasados eleva a resposta.",
    },
    {
      q: "Explique BGP e como a internet é roteada.",
      level: "senior",
      a: "<p><strong>ASN (Autonomous System Number):</strong> cada grande rede recebe um número ASN. ISPs, CDNs, empresas grandes têm seus próprios ASNs.</p><p><strong>BGP (Border Gateway Protocol):</strong> protocolo de roteamento entre ASNs — define como tráfego viaja entre diferentes redes autônomas. É o 'protocolo da internet'.</p><p><strong>Como funciona:</strong> roteadores BGP em bordas de ASNs trocam anúncios de prefixos (blocos de IP). Roteador escolhe a melhor rota baseado em AS_PATH (menor quantidade de ASNs no caminho) e políticas locais.</p><p><strong>BGP hijacking:</strong> AS anuncia prefixos de outra rede — tráfego é redirecionado. Incidente famoso: Pakistan Telecom anunciou prefixos da YouTube em 2008, derrubando o YouTube globalmente por 2 horas.</p><p><strong>RPKI:</strong> Resource Public Key Infrastructure — criptograficamente valida quais ASNs podem anunciar quais prefixos. Mitigação de BGP hijacking.</p>",
      tip: "BGP hijacking com exemplo real (Pakistan Telecom/YouTube 2008) é o que demonstra entendimento real do protocolo. RPKI como solução mostra visão de segurança de infra.",
    },
    {
      q: "Como funciona o DNS recursivo vs autoritativo?",
      level: "senior",
      a: "<p><strong>Resolver recursivo:</strong> 'trabalhador' que faz todas as queries necessárias para resolver um nome. Cacheia resultados por TTL. Exemplos: 8.8.8.8 (Google), 1.1.1.1 (Cloudflare), resolver do ISP.</p><p><strong>Nameserver autoritativo:</strong> tem a resposta final para um domínio. Se perguntado, responde com os registros exatos — não consulta mais ninguém. Exemplos: AWS Route 53 quando você hospeda um domínio lá.</p><p><strong>Tipos de consulta:</strong></p><ul><li><strong>Recursiva:</strong> cliente pede ao resolver 'resolva example.com para mim completamente'.</li><li><strong>Iterativa:</strong> resolver pergunta aos root/TLD/autoritativo e faz o trabalho. Cada nameserver retorna referral (onde perguntar depois) em vez de resposta final.</li></ul><p><strong>Negative caching:</strong> 'esse domínio não existe' (NXDOMAIN) também é cacheado — pelo campo SOA TTL mínimo. Evita storm de queries para domínios inexistentes.</p>",
      tip: "Negative caching é o detalhe avançado — sem ele, NXDOMAIN seria consultado repetidamente. O campo mínimo TTL no registro SOA controla isso. Candidatos que conhecem isso demonstram profundidade operacional.",
    },
    {
      q: "O que é load balancing de rede e como funciona DNS round-robin?",
      level: "senior",
      a: "<p><strong>DNS round-robin:</strong> registro A com múltiplos IPs. Cada query retorna a lista em ordem diferente. Clientes usam o primeiro. Simples mas sem health check — se um servidor cai, DNS continua retornando seu IP.</p><p><strong>L4 Load Balancer (TCP):</strong> balanceia no nível de conexão TCP. Mais rápido. Sem visibilidade de conteúdo HTTP. ELB Classic.</p><p><strong>L7 Load Balancer (HTTP):</strong> analisa o conteúdo HTTP — path, headers, cookies. Pode fazer routing por caminho (/api → serviço A, /static → CDN), sticky sessions, health checks HTTP. AWS ALB, Nginx.</p><p><strong>Consistência:</strong> L7 LB pode implementar sticky sessions via cookie para que o mesmo usuário chegue sempre ao mesmo servidor. Problema: servidor cai = usuário perde sessão.</p>",
      tip: "A diferença entre L4 e L7 load balancing com exemplos práticos (AWS NLB vs ALB) é o que entrevistadores de system design querem ouvir. Health checks são o problema fundamental do DNS round-robin.",
    },
    {
      q: "Como diagnosticar problemas de latência de rede?",
      level: "senior",
      a: "<p>Toolkit de diagnóstico:</p><ul><li><code>ping host</code> — RTT básico, perda de pacotes.</li><li><code>traceroute host</code> — identifica hop com alta latência.</li><li><code>mtr host</code> — ping + traceroute em tempo real, mostra % de perda por hop.</li><li><code>netstat -an | grep ESTABLISHED | wc -l</code> — contagem de conexões TCP abertas.</li><li><code>ss -s</code> — estatísticas de sockets (mais rápido que netstat).</li><li><code>dig +trace example.com</code> — trace completo de DNS lookup.</li><li><code>curl -w &quot;@curl-format.txt&quot; -o /dev/null -s https://host</code> — breakdown de DNS time, connect time, TLS time, TTFB.</li></ul><p><strong>Problemas comuns por camada:</strong></p><ul><li>DNS lento: TTL muito baixo, resolver sobrecarregado, NXDOMAIN storm.</li><li>TCP lento: pacotes perdidos triggering retransmit (slow start reset), full send buffer (receiver not reading fast enough).</li><li>Latência de app: TTFB alto = slow query no banco, não problema de rede.</li></ul>",
      tip: "curl -w com format file para breakdown granular de latência (DNS/connect/TLS/TTFB/total) é a ferramenta mais valiosa para diagnóstico end-to-end. mtr combinando ping+traceroute mostra se a latência é intermitente.",
    },
    {
      q: "O que é anycast e como a Cloudflare usa para DNS?",
      level: "senior",
      a: "<p><strong>Anycast:</strong> múltiplos servidores compartilham o mesmo endereço IP. Roteamento BGP leva o tráfego para o servidor geograficamente mais próximo (menor AS_PATH).</p><p><strong>Como Cloudflare usa anycast para 1.1.1.1:</strong> centenas de PoPs (Points of Presence) em ~300 cidades anunciam o mesmo IP 1.1.1.1 via BGP. Sua query DNS vai para o PoP mais próximo — latência típica &lt; 10ms. Sem round-robin DNS, sem geolocalização baseada em IP — o roteamento BGP faz automaticamente.</p><p><strong>Outros usos de anycast:</strong> root nameservers DNS (13 endereços, centenas de instâncias), CDNs, DDoS mitigation (tráfego de ataque absorvido por múltiplos PoPs).</p><p><strong>Limitação:</strong> anycast não funciona bem com TCP state — conexões TCP sempre vão para o mesmo nó (o mais próximo), mas não há garantia de persistência em caso de failover.</p>",
      tip: "Root nameservers DNS como anycast é o exemplo perfeito — os 'famosos' 13 root nameservers são na verdade centenas de instâncias. Cloudflare 1.1.1.1 como anycast justifica sua latência excepcionalmente baixa.",
    },
    {
      q: "Explique WebSockets vs HTTP long-polling vs SSE.",
      level: "senior",
      a: "<p><strong>HTTP long-polling:</strong> cliente faz request; servidor segura a conexão aberta até ter dados ou timeout. Cliente refaz imediatamente. Funciona em qualquer HTTP, mas adiciona overhead de reconexão constante.</p><p><strong>SSE (Server-Sent Events):</strong> conexão HTTP longa unidirecional (servidor → cliente). Cliente abre 1 conexão; servidor envia eventos como stream de texto. Reconexão automática embutida. Bom para feeds, notificações, dashboards.</p><p><strong>WebSockets:</strong> upgrade de HTTP → protocolo bidirecional full-duplex. 1 conexão TCP, mensagens em ambas as direções sem overhead de HTTP. Bom para chat, gaming, colaboração em tempo real.</p><p><strong>Quando usar:</strong></p><ul><li>SSE: comunicação unidirecional, compatibilidade máxima, simples de implementar.</li><li>WebSocket: bidirecional, baixa latência, alta frequência de mensagens.</li><li>Long-polling: fallback para ambientes sem suporte a WebSocket/SSE.</li></ul>",
      tip: "O critério de decisão é a direcionalidade: SSE = servidor empurra dados. WebSocket = ambos empurram. Long-polling = fallback legado. Para entrevista: HTTP/2 SSE é preferível a WS em muitos casos — multiplexing, proxies, load balancers funcionam transparentemente.",
    },
    {
      q: "Como funciona TCP flow control?",
      level: "senior",
      a: "<p>Flow control evita que o sender sobrecarregue o receiver que pode ter buffer limitado.</p><p><strong>Mecanismo:</strong> cada segmento TCP inclui o campo <code>Window Size</code> = quantos bytes o receiver pode aceitar. Sender não pode enviar mais que window_size bytes sem ACK.</p><p><strong>Fluxo típico:</strong></p><ol><li>Receiver anuncia window de 64KB.</li><li>Sender envia até 64KB e espera ACK.</li><li>Cada ACK retorna window atualizada (novo espaço disponível no buffer do receiver).</li><li>Window = 0: sender para completamente (zero window condition). Sender faz probing periódico.</li></ol><p><strong>Window Scaling (RFC 7323):</strong> window de 16 bits limita a 64KB. Window scaling permite janelas de até 1GB — essencial para links de alta latência (satélite, intercontinental) onde o BDP (Bandwidth-Delay Product) é alto.</p>",
      tip: "Window Scaling e BDP (Bandwidth-Delay Product) são os conceitos sênior. BDP = bandwidth × RTT = quanto dado está 'em voo'. Sem window scaling em links de satélite (~600ms RTT), a janela de 64KB satura a 64KB/0.6s ≈ 853Kbps — travando um link de 1Gbps.",
    },
    {
      q: "O que é DNSSEC e como funciona?",
      level: "senior",
      a: "<p><strong>Problema:</strong> DNS clássico não tem autenticação — um atacante pode fazer poisoning de cache de um resolver recursivo, retornando IPs maliciosos para domínios legítimos.</p><p><strong>DNSSEC (DNS Security Extensions):</strong> assina registros DNS criptograficamente. Resolver valida a assinatura antes de retornar resposta.</p><p><strong>Como funciona:</strong></p><ul><li>Zona assina seus registros com chave privada ZSK (Zone Signing Key).</li><li>Parent zone assina a public key da child zone com KSK (Key Signing Key).</li><li>Chain of trust: resolver verifica registros RRSIG → DNSKEY da zona → DS record assinado pelo parent → até root (âncora de confiança instalada no resolver).</li></ul><p><strong>Limitações:</strong> DNSSEC não criptografa — ainda envia tudo em claro. Amplification DDoS: respostas DNSSEC são muito maiores que queries (abuso de amplification). DoT/DoH resolve o problema de privacidade.</p>",
      tip: "DNSSEC não é confidencialidade — resolve apenas integridade. A confusão comum é achar que DNSSEC criptografa queries. DoT/DoH é o que provê privacidade. Mencionar DNS amplification DDoS como side effect mostra entendimento das implicações de segurança.",
    },
  ],
  diagrams: [
    {
      title: "O que acontece quando você digita uma URL — fluxo completo",
      html: `<style>
.tcpd-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tcpd-title{font-size:12px;font-weight:700;color:#3b82f6;margin:0 0 3px}
.tcpd-sub{font-size:10px;color:#475569;margin:0 0 14px}
.tcpd-flow{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.tcpd-step{display:flex;align-items:flex-start;gap:10px;background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:10px 12px;transition:border-color .2s}
.tcpd-step:hover{border-color:#3b82f6}
.tcpd-num{min-width:22px;height:22px;border-radius:50%;background:#3b82f620;border:1px solid #3b82f6;color:#3b82f6;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.tcpd-label{font-size:10px;font-weight:700;color:#3b82f6;min-width:90px}
.tcpd-body{font-size:10px;color:#94a3b8;line-height:1.6}
.tcpd-tip{position:relative;cursor:help;border-bottom:1px dashed #3b82f660}
.tcpd-tip:hover .tcpd-tb{display:block}
.tcpd-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.tcpd-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
.tcpd-layers{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.tcpd-layer{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 10px;text-align:center}
.tcpd-layer-name{font-size:9px;font-weight:700;color:#3b82f6;margin-bottom:3px}
.tcpd-layer-ex{font-size:9px;color:#64748b;font-family:'JetBrains Mono',monospace;line-height:1.5}
</style>
<div class="tcpd-wrap">
  <p class="tcpd-title">URL → resposta: cada camada em ação</p>
  <p class="tcpd-sub">Passe o mouse para detalhes de cada etapa</p>
  <div class="tcpd-flow">
    <div class="tcpd-step">
      <div class="tcpd-num">1</div>
      <div><div class="tcpd-label">DNS lookup</div><div class="tcpd-body">Resolver consulta <span class="tcpd-tip">cache local<span class="tcpd-tb">Ordem: cache do SO → hosts file → cache do resolver ISP → root nameserver → TLD (.com) → authoritative (google.com). Resposta cacheada por TTL.</span></span>. Cache miss: root → TLD → authoritative. Retorna IP. UDP porta 53.</div></div>
    </div>
    <div class="tcpd-step">
      <div class="tcpd-num">2</div>
      <div><div class="tcpd-label">TCP handshake</div><div class="tcpd-body"><span class="tcpd-tip">SYN → SYN-ACK → ACK<span class="tcpd-tb">3-way handshake sincroniza números de sequência. Cada lado confirma o ISN (Initial Sequence Number) do outro. 1 RTT.</span></span> para IP:443. 1 RTT. Conexão confiável estabelecida.</div></div>
    </div>
    <div class="tcpd-step">
      <div class="tcpd-num">3</div>
      <div><div class="tcpd-label">TLS handshake</div><div class="tcpd-body">TLS 1.3: <span class="tcpd-tip">ClientHello + key_share<span class="tcpd-tb">Cliente envia ciphers e chave pública ECDHE. Servidor responde com cert criptografado e sua chave. Ambos derivam a mesma chave de sessão. 1 RTT.</span></span> → ServerHello + cert + Finished. 1 RTT.</div></div>
    </div>
    <div class="tcpd-step">
      <div class="tcpd-num">4</div>
      <div><div class="tcpd-label">HTTP/2 request</div><div class="tcpd-body">GET / com headers HPACK comprimidos. Múltiplos streams multiplexados. Server push pode enviar CSS/JS antes do cliente pedir.</div></div>
    </div>
    <div class="tcpd-step">
      <div class="tcpd-num">5</div>
      <div><div class="tcpd-label">Response + render</div><div class="tcpd-body">HTML retorna. Browser: parse HTML → DOM, CSS → CSSOM, <span class="tcpd-tip">render tree → layout → paint<span class="tcpd-tb">Critical rendering path: DOM + CSSOM = Render tree. Layout calcula geometria. Paint desenha pixels. Composite agrupa em camadas GPU.</span></span>. Recursos paralelos via multiplexing.</div></div>
    </div>
  </div>
  <div style="margin-bottom:10px;font-size:10px;font-weight:700;color:#3b82f6;text-transform:uppercase">Stack TCP/IP — camadas</div>
  <div class="tcpd-layers">
    <div class="tcpd-layer"><div class="tcpd-layer-name">Aplicação</div><div class="tcpd-layer-ex">HTTP · gRPC<br>DNS · SMTP</div></div>
    <div class="tcpd-layer"><div class="tcpd-layer-name">Transporte</div><div class="tcpd-layer-ex">TCP (confiável)<br>UDP (best-effort)</div></div>
    <div class="tcpd-layer"><div class="tcpd-layer-name">Rede (IP)</div><div class="tcpd-layer-ex">IPv4 / IPv6<br>roteamento</div></div>
    <div class="tcpd-layer"><div class="tcpd-layer-name">Link</div><div class="tcpd-layer-ex">Ethernet<br>Wi-Fi · MAC</div></div>
  </div>
</div>`,
      caption: "Esta pergunta ('o que acontece quando você digita uma URL?') aparece em praticamente toda entrevista de backend e system design. Saiba responder em 60 segundos incluindo DNS, TCP, TLS e HTTP.",
    },
    {
      title: "TCP 3-way handshake e congestion control — estado da conexão",
      html: `<style>
.tcp-hk-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tcp-hk-title{font-size:12px;font-weight:700;color:#3b82f6;margin:0 0 3px}
.tcp-hk-sub{font-size:10px;color:#475569;margin:0 0 14px}
.tcp-hk-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.tcp-hk-col-title{font-size:10px;font-weight:700;color:#3b82f6;margin-bottom:8px}
.tcp-hk-step{display:flex;gap:8px;margin-bottom:6px;align-items:flex-start}
.tcp-hk-dir{font-size:10px;color:#3b82f6;min-width:60px;flex-shrink:0}
.tcp-hk-detail{font-size:10px;color:#94a3b8;line-height:1.5}
.tcp-hk-tip{position:relative;cursor:help;border-bottom:1px dashed #3b82f660}
.tcp-hk-tip:hover .tcp-hk-tb{display:block}
.tcp-hk-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:210px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.tcp-hk-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
.tcp-hk-cc{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px}
.tcp-hk-cc-title{font-size:10px;font-weight:700;color:#3b82f6;margin-bottom:8px}
.tcp-hk-phase{display:flex;gap:6px;margin-bottom:6px;font-size:10px}
.tcp-hk-phase-name{min-width:80px;font-weight:700;flex-shrink:0}
.tcp-hk-phase-desc{color:#94a3b8;line-height:1.5}
</style>
<div class="tcp-hk-wrap">
  <p class="tcp-hk-title">TCP — handshake e congestion control</p>
  <p class="tcp-hk-sub">Passe o mouse para detalhes de cada passo</p>
  <div class="tcp-hk-grid">
    <div>
      <div class="tcp-hk-col-title">3-way handshake (estabelecimento)</div>
      <div class="tcp-hk-step">
        <div class="tcp-hk-dir">→ SYN</div>
        <div class="tcp-hk-detail"><span class="tcp-hk-tip">Cliente envia seq=x<span class="tcp-hk-tb">ISN (Initial Sequence Number) é aleatório — previne que pacotes de conexões antigas se misturem com conexões novas. Syn Flood attack: enviar muitos SYNs sem completar handshake.</span></span>. Quer abrir conexão.</div>
      </div>
      <div class="tcp-hk-step">
        <div class="tcp-hk-dir">← SYN-ACK</div>
        <div class="tcp-hk-detail">Servidor envia seq=y, <span class="tcp-hk-tip">ACK=x+1<span class="tcp-hk-tb">ACK confirma que recebeu tudo até x. x+1 = próximo byte esperado. O campo ACK cobre todo o mecanismo de confiabilidade do TCP.</span></span>. Estabelece seu próprio ISN.</div>
      </div>
      <div class="tcp-hk-step">
        <div class="tcp-hk-dir">→ ACK</div>
        <div class="tcp-hk-detail">Cliente confirma ACK=y+1. <strong>Conexão estabelecida.</strong> Dados fluem.</div>
      </div>
      <div class="tcp-hk-col-title" style="margin-top:12px">4-way termination (encerramento)</div>
      <div class="tcp-hk-step">
        <div class="tcp-hk-dir">→ FIN</div>
        <div class="tcp-hk-detail">Cliente: terminei de enviar. Half-close.</div>
      </div>
      <div class="tcp-hk-step">
        <div class="tcp-hk-dir">← ACK</div>
        <div class="tcp-hk-detail">Servidor confirma. Ainda pode enviar dados.</div>
      </div>
      <div class="tcp-hk-step">
        <div class="tcp-hk-dir">← FIN</div>
        <div class="tcp-hk-detail">Servidor: terminei de enviar também.</div>
      </div>
      <div class="tcp-hk-step">
        <div class="tcp-hk-dir">→ ACK</div>
        <div class="tcp-hk-detail"><span class="tcp-hk-tip">TIME_WAIT (60s)<span class="tcp-hk-tb">Porta fica bloqueada por 2×MSL. Evita que dados atrasados da conexão fechada poluam uma nova conexão no mesmo 4-tuple. Em alta carga: SO_REUSEADDR resolve.</span></span>. Porta liberada após 60s.</div>
      </div>
    </div>
    <div class="tcp-hk-cc">
      <div class="tcp-hk-cc-title">Congestion Control — fases</div>
      <div class="tcp-hk-phase">
        <span class="tcp-hk-phase-name" style="color:#4ade80">Slow Start</span>
        <span class="tcp-hk-phase-desc">cwnd = 1 MSS. Dobra a cada RTT (exponencial). Até atingir ssthresh. "Slow" é enganoso — crescimento exponencial é rápido.</span>
      </div>
      <div class="tcp-hk-phase">
        <span class="tcp-hk-phase-name" style="color:#f59e0b">Cong. Avoid.</span>
        <span class="tcp-hk-phase-desc">Acima do ssthresh: +1 MSS por RTT (linear). Crescimento cuidadoso próximo ao limite.</span>
      </div>
      <div class="tcp-hk-phase">
        <span class="tcp-hk-phase-name" style="color:#ef4444">Loss Detect.</span>
        <span class="tcp-hk-phase-desc">Timeout: cwnd=1, ssthresh=cwnd/2. 3 ACKs duplicados (fast retransmit): ssthresh=cwnd/2, cwnd=ssthresh. AIMD.</span>
      </div>
      <div class="tcp-hk-phase" style="margin-top:8px;padding-top:8px;border-top:1px solid #334155">
        <span class="tcp-hk-phase-name" style="color:#38bdf8">BBR</span>
        <span class="tcp-hk-phase-desc">Google: mede bandwidth e RTT continuamente. Mantém throughput ótimo sem encher buffers. Não espera perda para reduzir. YouTube, GCP.</span>
      </div>
    </div>
  </div>
</div>`,
      caption: "TIME_WAIT é o detalhe que mais candidatos esquecem — a porta fica bloqueada por 60s após fechar. Em alta carga (muitas conexões curtas), isso pode esgotar as portas ephemeral do servidor.",
    },
    {
      title: "DNS — hierarquia e tipos de registro",
      html: `<style>
.dns-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.dns-title{font-size:12px;font-weight:700;color:#3b82f6;margin:0 0 3px}
.dns-sub{font-size:10px;color:#475569;margin:0 0 14px}
.dns-flow{display:flex;flex-direction:column;gap:4px;margin-bottom:14px}
.dns-row{display:flex;align-items:flex-start;gap:10px;background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 12px;transition:border-color .2s}
.dns-row:hover{border-color:#3b82f6}
.dns-num{width:20px;height:20px;border-radius:50%;background:#3b82f620;border:1px solid #3b82f6;color:#3b82f6;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.dns-name{font-size:10px;font-weight:700;color:#3b82f6;min-width:120px;flex-shrink:0}
.dns-desc{font-size:10px;color:#94a3b8;line-height:1.5}
.dns-records{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}
.dns-rec{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:8px 10px;font-size:10px}
.dns-rec-type{font-family:'JetBrains Mono',monospace;font-weight:700;color:#3b82f6;margin-bottom:4px}
.dns-rec-desc{color:#94a3b8;line-height:1.5}
.dns-rec-ex{font-family:'JetBrains Mono',monospace;font-size:9px;color:#64748b;margin-top:3px}
</style>
<div class="dns-wrap">
  <p class="dns-title">DNS — hierarquia de resolução</p>
  <p class="dns-sub">Como google.com vira 142.250.190.14</p>
  <div class="dns-flow">
    <div class="dns-row">
      <div class="dns-num">1</div>
      <div><div class="dns-name">Cache local + hosts</div><div class="dns-desc">/etc/hosts, cache do SO, cache do browser. TTL local. Se hit: resposta imediata (&lt;1ms).</div></div>
    </div>
    <div class="dns-row">
      <div class="dns-num">2</div>
      <div><div class="dns-name">Resolver recursivo</div><div class="dns-desc">8.8.8.8, 1.1.1.1 ou do ISP. Cache por TTL. Se hit: ~10ms. Se miss: faz o trabalho de resolver iterativamente.</div></div>
    </div>
    <div class="dns-row">
      <div class="dns-num">3</div>
      <div><div class="dns-name">Root nameserver</div><div class="dns-desc">13 clusters (A-M.root-servers.net) via anycast. Retorna: "não sei google.com, mas .com está em a.gtld-servers.net".</div></div>
    </div>
    <div class="dns-row">
      <div class="dns-num">4</div>
      <div><div class="dns-name">TLD nameserver</div><div class="dns-desc">Responsável por .com, .br, .org. Retorna: "não sei google.com especificamente, mas ns1.google.com é o autoritativo".</div></div>
    </div>
    <div class="dns-row">
      <div class="dns-num">5</div>
      <div><div class="dns-name">Authoritative nameserver</div><div class="dns-desc">Tem o registro A de google.com. Retorna o IP real. Resposta cacheada pelo resolver por TTL (segundos a horas).</div></div>
    </div>
  </div>
  <div style="font-size:10px;font-weight:700;color:#3b82f6;margin-bottom:8px">Tipos de registro DNS</div>
  <div class="dns-records">
    <div class="dns-rec"><div class="dns-rec-type">A</div><div class="dns-rec-desc">IPv4 address</div><div class="dns-rec-ex">example.com → 93.184.216.34</div></div>
    <div class="dns-rec"><div class="dns-rec-type">AAAA</div><div class="dns-rec-desc">IPv6 address</div><div class="dns-rec-ex">example.com → 2606:2800:220:1::93</div></div>
    <div class="dns-rec"><div class="dns-rec-type">CNAME</div><div class="dns-rec-desc">Alias → hostname (proibido no apex)</div><div class="dns-rec-ex">www → example.com</div></div>
    <div class="dns-rec"><div class="dns-rec-type">MX</div><div class="dns-rec-desc">Mail server + priority</div><div class="dns-rec-ex">example.com MX 10 mail.example.com</div></div>
    <div class="dns-rec"><div class="dns-rec-type">TXT</div><div class="dns-rec-desc">Texto arbitrário (SPF, DKIM, verify)</div><div class="dns-rec-ex">v=spf1 include:google.com ~all</div></div>
    <div class="dns-rec"><div class="dns-rec-type">NS</div><div class="dns-rec-desc">Nameservers autoritativos da zona</div><div class="dns-rec-ex">example.com NS ns1.example.com</div></div>
  </div>
</div>`,
      caption: "TTL é o controle de cache — valores baixos permitem mudanças rápidas mas aumentam carga nos resolvers. Antes de trocar IP (migração de servidor), reduza o TTL para 60s; após a troca, aumente de volta.",
    },
  ],
  mnemonics: [
    {
      label: "Stack TCP/IP de baixo para cima: LRTA",
      trick: "Link, Rede, Transporte, Aplicação",
      explanation: "LRTA: L=Link (Ethernet, Wi-Fi), R=Rede/IP (endereçamento), T=Transporte (TCP/UDP), A=Aplicação (HTTP, DNS). Ordem de baixo para cima. Cada camada encapsula a anterior. Dados descem ao enviar, sobem ao receber.",
    },
    {
      label: "TCP 3-way handshake: S-SA-A",
      trick: "Sim → Sim, Aceito → Aceito",
      explanation: "S = SYN (quero conectar). SA = SYN-ACK (aceito, e eu também quero). A = ACK (aceito você também). Cada lado confirma a capacidade de receber do outro antes de enviar dados. Um diálogo de confirmação mútua.",
    },
    {
      label: "DNS record types: A-AAAA-C-M-T",
      trick: "Aí Acabou Criar Mail Txt",
      explanation: "A=IPv4, AAAA=IPv6, C=CNAME (alias), M=MX (mail), T=TXT (verificação). Os cinco mais cobrados em entrevista. CNAME nunca no apex do domínio — causaria loop no SOA/NS.",
    },
    {
      label: "TCP vs UDP: C-G-O vs S-S-R",
      trick: "Conectado-Garantido-Ordenado vs Simples-Sem garantia-Rápido",
      explanation: "TCP: Conexão (handshake), Garantia (ACK + retransmit), Ordem (seq numbers). UDP: Sem conexão, Sem garantia, Rápido. Choose TCP when correctness matters; UDP when speed matters and app can handle loss.",
    },
    {
      label: "Congestion control: Sobe devagar, cai rápido",
      trick: "AIMD — Additive Increase, Multiplicative Decrease",
      explanation: "Ao adicionar capacidade: +1 MSS por RTT (linear, cauteloso). Ao detectar congestionamento: divide cwnd pela metade (rápido). Analogia: accelerar devagar, freiar forte. Evita sobrecarregar a rede mas responde rapidamente a problemas.",
    },
  ],
  cheatsheet: {
    title: "TCP/IP e DNS — referência rápida",
    html: `<style>
.tcpcs-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:18px;color:#e2e8f0;font-size:10px}
.tcpcs-h{font-size:11px;font-weight:700;color:#3b82f6;border-bottom:1px solid #334155;padding-bottom:4px;margin:0 0 8px}
.tcpcs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
.tcpcs-col{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:10px}
.tcpcs-col-title{font-size:10px;font-weight:700;color:#3b82f6;margin-bottom:6px}
.tcpcs-row{display:flex;gap:6px;margin-bottom:4px;align-items:flex-start;line-height:1.5}
.tcpcs-k{color:#3b82f6;font-weight:600;min-width:80px;flex-shrink:0}
.tcpcs-v{color:#94a3b8}
.tcpcs-code{font-family:'JetBrains Mono',monospace;background:#0f172a;border:1px solid #1e3a5f;border-radius:4px;padding:6px 8px;font-size:9px;color:#7dd3fc;line-height:1.6;white-space:pre;overflow-x:auto;margin-bottom:8px}
</style>
<div class="tcpcs-wrap">
  <div class="tcpcs-h">TCP/IP e DNS — referência completa</div>
  <div class="tcpcs-grid">
    <div class="tcpcs-col">
      <div class="tcpcs-col-title">TCP vs UDP</div>
      <div class="tcpcs-row"><span class="tcpcs-k">TCP</span><span class="tcpcs-v">Conexão, confiável, ordenado, flow control</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">UDP</span><span class="tcpcs-v">Sem conexão, best-effort, 8 bytes header</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">TCP use</span><span class="tcpcs-v">HTTP, SSH, banco de dados, SMTP</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">UDP use</span><span class="tcpcs-v">DNS, video, gaming, VoIP, QUIC</span></div>
    </div>
    <div class="tcpcs-col">
      <div class="tcpcs-col-title">Portas conhecidas</div>
      <div class="tcpcs-row"><span class="tcpcs-k">80/443</span><span class="tcpcs-v">HTTP / HTTPS</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">22</span><span class="tcpcs-v">SSH</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">53</span><span class="tcpcs-v">DNS (UDP + TCP)</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">25/587</span><span class="tcpcs-v">SMTP / SMTP submission</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">5432/3306</span><span class="tcpcs-v">PostgreSQL / MySQL</span></div>
    </div>
    <div class="tcpcs-col">
      <div class="tcpcs-col-title">DNS record types</div>
      <div class="tcpcs-row"><span class="tcpcs-k">A</span><span class="tcpcs-v">Hostname → IPv4</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">AAAA</span><span class="tcpcs-v">Hostname → IPv6</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">CNAME</span><span class="tcpcs-v">Alias → hostname (não no apex)</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">MX</span><span class="tcpcs-v">Mail server + priority</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">TXT</span><span class="tcpcs-v">SPF, DKIM, verificação de domínio</span></div>
    </div>
    <div class="tcpcs-col">
      <div class="tcpcs-col-title">Congestion control</div>
      <div class="tcpcs-row"><span class="tcpcs-k">Slow Start</span><span class="tcpcs-v">cwnd dobra por RTT até ssthresh</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">Cong. Avoid</span><span class="tcpcs-v">+1 MSS por RTT (linear)</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">Loss</span><span class="tcpcs-v">ssthresh=cwnd/2, cwnd reduz</span></div>
      <div class="tcpcs-row"><span class="tcpcs-k">BBR</span><span class="tcpcs-v">Mede BW+RTT, não espera perda</span></div>
    </div>
  </div>
  <div class="tcpcs-col-title" style="color:#3b82f6;margin-bottom:6px">Diagnóstico de rede</div>
  <div class="tcpcs-code">ping host                               # RTT e perda de pacotes
traceroute host                         # hop-by-hop latência
mtr host                                # traceroute contínuo com % perda
dig +trace example.com                  # DNS trace completo
ss -s                                   # estatísticas de sockets
netstat -an | grep TIME_WAIT | wc -l    # conexões em TIME_WAIT
curl -w "dns:%{time_namelookup} tcp:%{time_connect} tls:%{time_appconnect} ttfb:%{time_starttransfer} total:%{time_total}\n" -o /dev/null -s https://example.com</div>
</div>`,
    caption: "O comando curl -w com breakdown de timing (DNS/TCP/TLS/TTFB) é a ferramenta mais valiosa para diagnosticar latência end-to-end. Use mtr (ping + traceroute) para identificar onde está a perda de pacotes.",
  },
  mindmap: {
    title: "TCP/IP e DNS — mapa mental",
    html: `<style>
.tcp-mm{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:18px;color:#e2e8f0;font-size:10px}
.tcp-mm-center{text-align:center;margin-bottom:14px}
.tcp-mm-title{font-size:14px;font-weight:800;color:#3b82f6;display:inline-block;background:#3b82f615;border:2px solid #3b82f640;border-radius:8px;padding:6px 18px}
.tcp-mm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.tcp-mm-node{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px}
.tcp-mm-node-title{font-weight:700;margin-bottom:6px;font-size:10px}
.tcp-mm-item{color:#94a3b8;margin-bottom:3px;padding-left:10px;position:relative;line-height:1.5}
.tcp-mm-item::before{content:'·';position:absolute;left:2px;color:#3b82f6}
.tcp-mm-item.key{color:#e2e8f0}
.tcp-mm-item.key::before{color:#4ade80;content:'✓'}
</style>
<div class="tcp-mm">
  <div class="tcp-mm-center"><span class="tcp-mm-title">TCP/IP e DNS</span></div>
  <div class="tcp-mm-grid">
    <div class="tcp-mm-node">
      <div class="tcp-mm-node-title" style="color:#3b82f6">Stack TCP/IP</div>
      <div class="tcp-mm-item key">Aplicação → Transporte → Rede → Link</div>
      <div class="tcp-mm-item key">Cada camada encapsula a anterior</div>
      <div class="tcp-mm-item">OSI = 7 camadas (teórico)</div>
      <div class="tcp-mm-item">TCP/IP = 4 camadas (prático)</div>
      <div class="tcp-mm-item">IP = best-effort; TCP = confiável</div>
    </div>
    <div class="tcp-mm-node">
      <div class="tcp-mm-node-title" style="color:#4ade80">TCP</div>
      <div class="tcp-mm-item key">3-way handshake SYN/SYN-ACK/ACK</div>
      <div class="tcp-mm-item key">ACK + retransmit + seq ordering</div>
      <div class="tcp-mm-item key">Congestion control (slow start, AIMD)</div>
      <div class="tcp-mm-item">4-way FIN/ACK/FIN/ACK</div>
      <div class="tcp-mm-item">TIME_WAIT = 2×MSL ≈ 60s</div>
    </div>
    <div class="tcp-mm-node">
      <div class="tcp-mm-node-title" style="color:#f59e0b">UDP</div>
      <div class="tcp-mm-item key">Sem conexão, sem garantia</div>
      <div class="tcp-mm-item key">Header 8 bytes (vs 20+ TCP)</div>
      <div class="tcp-mm-item">DNS, video, gaming, VoIP</div>
      <div class="tcp-mm-item">QUIC usa UDP como base</div>
      <div class="tcp-mm-item">App reimplementa confiabilidade</div>
    </div>
    <div class="tcp-mm-node">
      <div class="tcp-mm-node-title" style="color:#a78bfa">DNS</div>
      <div class="tcp-mm-item key">Root → TLD → Authoritative</div>
      <div class="tcp-mm-item key">A, AAAA, CNAME, MX, TXT</div>
      <div class="tcp-mm-item key">TTL controla cache</div>
      <div class="tcp-mm-item">UDP 53 (TCP para &gt;512 bytes)</div>
      <div class="tcp-mm-item">DoT (853) / DoH (443) = privacidade</div>
    </div>
    <div class="tcp-mm-node">
      <div class="tcp-mm-node-title" style="color:#f472b6">HTTP evolution</div>
      <div class="tcp-mm-item key">HTTP/2: multiplexing + HPACK</div>
      <div class="tcp-mm-item key">QUIC: UDP + TLS integrado</div>
      <div class="tcp-mm-item">HTTP/3 = HTTP sobre QUIC</div>
      <div class="tcp-mm-item">0-RTT: resumption sem handshake</div>
      <div class="tcp-mm-item">Connection migration (Wi-Fi → 4G)</div>
    </div>
    <div class="tcp-mm-node">
      <div class="tcp-mm-node-title" style="color:#fbbf24">Diagnóstico</div>
      <div class="tcp-mm-item key">ping / traceroute / mtr</div>
      <div class="tcp-mm-item key">dig +trace (DNS)</div>
      <div class="tcp-mm-item">curl -w (DNS/TCP/TLS/TTFB breakdown)</div>
      <div class="tcp-mm-item">ss -s (socket stats)</div>
      <div class="tcp-mm-item">NAT: SO_REUSEADDR, TIME_WAIT</div>
    </div>
  </div>
</div>`,
    caption: "A pergunta 'o que acontece quando você digita uma URL' cobre TCP/IP + DNS + TLS + HTTP em sequência. Pratique responder em 2 minutos cobrindo cada camada.",
  },
  exercises: [
    {
      level: "iniciante",
      title: "Mapear o caminho de uma requisição HTTP",
      description: "Use 'curl -v -w' para medir o tempo de cada fase (DNS, TCP connect, TLS, TTFB) de 3 sites diferentes. Compare os tempos. Use 'traceroute' para ver os hops. Use 'dig +trace' para ver a resolução DNS completa de um domínio. Documente o que descobriu sobre cada camada.",
      concepts: ["curl timing", "traceroute", "dig", "DNS resolution", "TCP connect time"],
    },
    {
      level: "intermediario",
      title: "Implementar servidor TCP raw e observer o 3-way handshake",
      description: "Implemente um servidor TCP em Node.js usando o módulo 'net' (não HTTP). Capture o handshake com Wireshark ou tcpdump. Identifique os pacotes SYN, SYN-ACK e ACK, os seq numbers e window sizes. Depois feche a conexão gracefully e observe o 4-way FIN/ACK/FIN/ACK e o estado TIME_WAIT.",
      concepts: ["TCP handshake", "Wireshark", "seq numbers", "TIME_WAIT", "Node.js net module"],
    },
    {
      level: "intermediario",
      title: "Construir um resolver DNS simples",
      description: "Implemente um resolver DNS recursivo básico em Node.js usando o módulo 'dgram' (UDP raw). Envie uma query A record formatada em binário para 8.8.8.8 e parse a resposta. Implemente cache básico com TTL. Teste resolvendo google.com e compare com dig.",
      concepts: ["DNS protocol", "UDP sockets", "binary protocol parsing", "DNS cache", "TTL"],
    },
    {
      level: "senior",
      title: "Simular congestion control TCP e medir throughput",
      description: "Use tc (traffic control) no Linux para simular perda de pacotes (tc qdisc add dev eth0 netem loss 1%). Faça transferência de arquivo TCP e UDP. Meça o throughput com iperf3. Observe como TCP reduz throughput ao detectar perda (AIMD). Compare com BBR: mude o algoritmo de congestion control (sysctl net.ipv4.tcp_congestion_control=bbr) e meça novamente.",
      concepts: ["congestion control", "AIMD", "BBR", "tc/netem", "iperf3", "throughput measurement"],
    },
    {
      level: "senior",
      title: "Diagnosticar latência em sistema distribuído",
      description: "Configure um sistema com 3 serviços (A → B → C) em Docker. Use curl -w para medir latência end-to-end. Introduza latência artificial com tc netem em um dos links. Use distributed tracing (OpenTelemetry) para ver a breakdown por serviço. Identifique se a latência está no DNS, TCP, TLS ou na aplicação. Corrija o gargalo.",
      concepts: ["distributed tracing", "latency analysis", "tc netem", "network debugging", "OpenTelemetry"],
    },
  ],
  videos: [
    { title: "How the Internet Works in 5 Minutes", channel: "Aaron", url: "https://www.youtube.com/watch?v=7_LPdttKXPc" },
    { title: "TCP vs UDP — How Do They Work?", channel: "Computerphile", url: "https://www.youtube.com/watch?v=GJudszELSFo" },
    { title: "DNS Explained — How the Internet Knows Where to Go", channel: "ByteByteGo", url: "https://www.youtube.com/watch?v=27r4Bzuj5NQ" },
    { title: "QUIC — How HTTP/3 Changed Everything", channel: "Hussein Nasser", url: "https://www.youtube.com/watch?v=0In5Iy7grkA" },
    { title: "BGP — How the Internet Routes Traffic", channel: "Computerphile", url: "https://www.youtube.com/watch?v=A1KXPpqlNZ4" },
  ],
  resources: [
    { title: "Beej's Guide to Network Programming", url: "https://beej.us/guide/bgnet/", kind: "livro" },
    { title: "High Performance Browser Networking (Ilya Grigorik)", url: "https://hpbn.co/", kind: "livro" },
    { title: "Cloudflare Learning — How DNS Works", url: "https://www.cloudflare.com/learning/dns/what-is-dns/", kind: "docs" },
    { title: "Julia Evans — networking zines", url: "https://wizardzines.com/zines/networking/", kind: "artigo" },
    { title: "RFC 793 — TCP original specification", url: "https://www.rfc-editor.org/rfc/rfc793", kind: "docs" },
    { title: "QUIC RFC 9000 — IETF standard", url: "https://www.rfc-editor.org/rfc/rfc9000", kind: "docs" },
    { title: "Google — BBR Congestion Control", url: "https://queue.acm.org/detail.cfm?id=3022184", kind: "artigo" },
    { title: "Cloudflare — How BGP Works", url: "https://www.cloudflare.com/learning/security/glossary/what-is-bgp/", kind: "artigo" },
  ],
  codeExamples: [
    {
      title: "Node.js — servidor TCP raw e cliente",
      language: "typescript",
      code: `import net from 'net'

// Servidor TCP
const server = net.createServer((socket) => {
  console.log(\`Conexão de \${socket.remoteAddress}:\${socket.remotePort}\`)
  // socket é full-duplex
  socket.on('data', (data) => {
    console.log(\`Recebido: \${data.toString()}\`)
    socket.write(\`Echo: \${data}\`)  // responde imediatamente
  })
  socket.on('end', () => {
    console.log('Cliente fechou conexão (FIN recebido)')
  })
  socket.on('error', (err) => {
    console.error(\`Erro no socket: \${err.message}\`)
  })
})

server.listen(8080, '127.0.0.1', () => {
  console.log('TCP server ouvindo em 127.0.0.1:8080')
})

// Cliente TCP
const client = net.createConnection({ port: 8080, host: '127.0.0.1' }, () => {
  // Aqui: 3-way handshake completo (SYN/SYN-ACK/ACK já aconteceu)
  console.log('Conectado ao servidor')
  client.write('Hello TCP!')
})

client.on('data', (data) => {
  console.log(\`Resposta: \${data.toString()}\`)
  client.end()  // inicia FIN (4-way termination)
})`,
    },
    {
      title: "DNS lookup com Node.js — resolver manual e cache",
      language: "typescript",
      code: `import dns from 'dns/promises'

// DNS lookup básico
async function resolveDomain(hostname: string) {
  try {
    // A record (IPv4)
    const addresses = await dns.resolve4(hostname)
    console.log(\`\${hostname} A records: \${addresses.join(', ')}\`)

    // AAAA record (IPv6)
    const v6 = await dns.resolve6(hostname).catch(() => [])
    console.log(\`\${hostname} AAAA records: \${v6.join(', ')}\`)

    // MX records
    const mx = await dns.resolveMx(hostname).catch(() => [])
    mx.forEach(r => console.log(\`MX: \${r.priority} \${r.exchange}\`))

    // TXT records
    const txt = await dns.resolveTxt(hostname).catch(() => [])
    txt.forEach(r => console.log(\`TXT: \${r.join(' ')}\`))

    // Informações completas com TTL
    const full = await dns.resolve(hostname, 'A')
    console.log(\`Resolved: \${JSON.stringify(full)}\`)
  } catch (err) {
    console.error(\`DNS falhou: \${(err as Error).message}\`)
  }
}

// Reverse DNS (IP → hostname)
async function reverseLookup(ip: string) {
  const hostnames = await dns.reverse(ip)
  console.log(\`\${ip} → \${hostnames.join(', ')}\`)
}

// Cache manual de DNS
const dnsCache = new Map<string, { ips: string[]; expires: number }>()

async function resolveWithCache(hostname: string, ttl = 300): Promise<string[]> {
  const cached = dnsCache.get(hostname)
  if (cached && cached.expires > Date.now()) {
    console.log(\`[CACHE HIT] \${hostname}\`)
    return cached.ips
  }
  const ips = await dns.resolve4(hostname)
  dnsCache.set(hostname, { ips, expires: Date.now() + ttl * 1000 })
  console.log(\`[DNS LOOKUP] \${hostname} → \${ips}\`)
  return ips
}

resolveDomain('google.com')`,
    },
    {
      title: "Diagnóstico de latência com curl e breakdown por fase",
      language: "bash",
      code: `#!/bin/bash
# Diagnóstico completo de latência HTTP — breakdown por fase

# Formato de saída do curl
FORMAT='
   DNS lookup:   %{time_namelookup}s
   TCP connect:  %{time_connect}s
   TLS handshake:%{time_appconnect}s
   Pre-transfer: %{time_pretransfer}s
   TTFB:         %{time_starttransfer}s
   Total:        %{time_total}s
   Size:         %{size_download} bytes
   Speed:        %{speed_download} bytes/s
'

# Analisar um endpoint
curl -w "$FORMAT" -o /dev/null -s "https://api.example.com/health"

# Múltiplas requisições para ver variação (p50, p99)
for i in {1..10}; do
  curl -w "%{time_total}\n" -o /dev/null -s "https://api.example.com/health"
done | sort -n | awk '
  BEGIN { count = 0 }
  { values[count++] = $1 }
  END {
    print "p50: " values[int(count * 0.5)]
    print "p95: " values[int(count * 0.95)]
    print "p99: " values[int(count * 0.99)]
  }
'

# Trace DNS completo
dig +trace google.com

# Traceroute para identificar hop com alta latência
traceroute -n google.com

# mtr combinado (ping + traceroute em tempo real)
mtr --report --report-cycles 20 google.com

# Verificar conexões TCP em TIME_WAIT
ss -tan state time-wait | wc -l

# Socket statistics
ss -s

# UDP — teste com iperf3 (servidor)
iperf3 -s -p 5201
# UDP — cliente envia 10Mbps por 10s
iperf3 -c server_ip -u -b 10M -t 10`,
    },
    {
      title: "HTTP/2 vs HTTP/1.1 — comparação de multiplexing",
      language: "typescript",
      code: `import http2 from 'http2'
import https from 'https'
import fs from 'fs'

// ─── Servidor HTTP/2 ──────────────────────────────────────────────────────────
const server = http2.createSecureServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
})

server.on('stream', (stream, headers) => {
  const path = headers[':path']
  const method = headers[':method']
  console.log(\`HTTP/2 stream \${stream.id}: \${method} \${path}\`)

  // Server Push — envia CSS antes do cliente pedir
  if (path === '/') {
    const pushStream = stream.pushStream({ ':path': '/style.css' }, (err, push) => {
      if (!err) {
        push.respond({ ':status': 200, 'content-type': 'text/css' })
        push.end('body { margin: 0; }')
      }
    })
    stream.respond({ ':status': 200, 'content-type': 'text/html' })
    stream.end('<html><link rel="stylesheet" href="/style.css"><body>HTTP/2!</body></html>')
  }
})

// ─── Cliente HTTP/2 com múltiplos streams simultâneos ─────────────────────────
const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('server.crt'),
})

// HTTP/2: múltiplos requests em paralelo na MESMA conexão TCP
const start = Date.now()
let done = 0
const REQUESTS = 10

for (let i = 0; i < REQUESTS; i++) {
  const req = client.request({ ':path': \`/resource/\${i}\` })
  req.on('response', (headers) => {
    console.log(\`Stream \${i}: \${headers[':status']}\`)
    if (++done === REQUESTS) {
      console.log(\`Total time HTTP/2: \${Date.now() - start}ms para \${REQUESTS} requests (1 conexão TCP)\`)
      client.close()
    }
  })
  req.end()
}

// Compare: HTTP/1.1 abriria 6-8 conexões TCP para paralelismo`,
    },
  ],
}

export default tcpIpDns
