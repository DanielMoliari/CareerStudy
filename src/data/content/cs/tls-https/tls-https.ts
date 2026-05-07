import type { SkillContent } from "@/types"

const tlsHttps: SkillContent = {
  tagline: "Camada de segurança sobre TCP: encripta, autentica, garante integridade.",
  why: "HTTPS é universal. Sênior precisa saber TLS handshake completo, certificate chain, perfect forward secrecy, TLS 1.3 vs 1.2, mTLS e como diagnosticar problemas de certificado em produção.",
  summary: "TLS (sucessor do SSL) provê três garantias: confidencialidade (criptografia simétrica negociada), integridade (MAC/AEAD) e autenticação (certificado X.509 assinado por CA). Roda sobre TCP. O handshake estabelece a chave de sessão via troca assimétrica (RSA legacy ou ECDHE moderno), e dali em diante a conversa é simétrica (AES-GCM, ChaCha20). TLS 1.3 levou isso a 1 RTT e removeu todos os cipher suites fracos.",
  keypoints: [
    { title: "Handshake TLS 1.3", body: "ClientHello (versão, ciphers, key share ECDHE) → ServerHello + cert + key share + Finished. Cliente verifica cert, gera chave, Finished. 1 RTT. Cert já criptografado." },
    { title: "Handshake TLS 1.2", body: "2 RTT. ClientHello → ServerHello + Cert + ServerKeyExchange + ServerHelloDone → ClientKeyExchange + ChangeCipherSpec + Finished → ChangeCipherSpec + Finished. Mais lento, suporta ciphers fracos." },
    { title: "Certificate chain", body: "Server cert assinado por intermediário, assinado por root CA. Browser tem CAs root pré-instaladas. Valida cadeia + nome (SAN) + não expirado + não revogado." },
    { title: "Cipher suites", body: "TLS 1.3: AEAD apenas (AES-128-GCM, AES-256-GCM, ChaCha20-Poly1305). TLS 1.2: legado inclui CBC, RC4 (quebrados). Force TLS ≥ 1.2; prefira 1.3." },
    { title: "Perfect forward secrecy", body: "Chave de sessão gerada por ECDHE — não deriva da chave privada do servidor. Comprometer a chave privada do servidor NÃO descriptografa sessões passadas gravadas." },
    { title: "SNI", body: "Server Name Indication: cliente envia hostname no ClientHello — em claro no TLS 1.2, encriptado (ESNI/ECH) no TLS 1.3. Permite virtual hosting HTTPS." },
    { title: "OCSP / CRL", body: "Revogação de certificado. CRL = lista batch baixada periodicamente. OCSP = query online em tempo real. OCSP stapling: servidor inclui resposta assinada no handshake — elimina round-trip do cliente." },
    { title: "mTLS", body: "Mutual TLS: cliente também apresenta certificado. Usado em serviço-a-serviço, zero trust, service mesh (Istio, Linkerd). Mais seguro que API key." },
    { title: "0-RTT (TLS 1.3)", body: "Em resumption de sessão, cliente envia dados junto ao ClientHello sem aguardar handshake. Risco: replay attacks. Use apenas para GETs idempotentes." },
    { title: "HSTS", body: "HTTP Strict Transport Security: header que instrui o browser a usar HTTPS por N segundos. HSTS preloading: inclui o domínio na lista embutida nos browsers." },
  ],
  gotchas: [
    "Confiar em certificado self-signed em produção — browsers alertam, atacante pode fazer MITM facilmente.",
    "Cert intermediário não instalado no servidor — alguns clientes (Java, mobile) falham silenciosamente.",
    "TLS 1.0/1.1 ainda habilitado — vulnerável (BEAST, POODLE). Force ≥ 1.2.",
    "Esquecer SNI quando hospeda múltiplos sites — servidor retorna certificado errado.",
    "Cert expira em domingo às 3h — sem monitoramento, aplicação cai. Use Let's Encrypt + cert-manager com renovação automática.",
    "Confundir TLS com HTTPS — TLS é a camada de transporte segura; HTTPS é HTTP sobre TLS. mTLS, gRPC, SMTP-TLS também usam TLS.",
    "Usar RSA 1024 ou SHA-1 — quebrado. Use RSA 2048+, ECDSA P-256, SHA-256+.",
    "0-RTT em endpoints não-idempotentes — replay attack pode duplicar transações.",
    "Não validar hostname no certificado — campo CN vs SAN. Sempre verificar SANs.",
    "Pinning de certificado sem rotação — aplicação quebra quando cert é renovado.",
  ],
  interview: [
    {
      q: "Explique o TLS 1.3 handshake passo a passo.",
      level: "senior",
      a: "<p>O TLS 1.3 completou o handshake em <strong>1 RTT</strong>:</p><ol><li><strong>ClientHello</strong>: cliente envia versões suportadas, lista de cipher suites e — diferente do 1.2 — já inclui o <code>key_share</code> com a chave pública ECDHE. Ou seja, já manda o material criptográfico na primeira mensagem.</li><li><strong>ServerHello + Certificate + CertificateVerify + Finished</strong>: servidor escolhe cipher, envia seu <code>key_share</code>. Ambos derivam a mesma chave de sessão via ECDHE. O servidor envia o cert <em>já criptografado</em> com a chave de sessão — mais privacidade que o 1.2. O Finished é um MAC que autentica todo o handshake.</li><li><strong>Cliente verifica</strong> o cert, deriva a mesma chave, envia seu Finished. <strong>Dados fluem.</strong></li></ol><p>Resultado: 1 RTT vs 2 RTT no 1.2. Com 0-RTT (session resumption), zero RTT de handshake.</p>",
      tip: "Mencione que o certificado é enviado encriptado no TLS 1.3 (não em claro como no 1.2) e que o key_share já vai no ClientHello — essas são as diferenças estruturais que o entrevistador quer ouvir.",
    },
    {
      q: "O que é perfect forward secrecy e por que importa?",
      level: "senior",
      a: "<p><strong>PFS</strong> garante que comprometer a chave privada do servidor no futuro <em>não</em> permite descriptografar sessões passadas gravadas.</p><p>Como funciona: a chave de sessão é derivada via troca Diffie-Hellman <strong>efêmera</strong> (ECDHE). A chave privada do servidor é usada apenas para autenticar a troca — não para derivar a chave de sessão. Cada sessão tem um par de chaves DH diferente, descartado após o handshake.</p><p><strong>Sem PFS (RSA key exchange do TLS 1.2 legado):</strong> a chave de sessão é encriptada com a chave pública do servidor. Se um atacante gravou o tráfego e depois rouba a chave privada, descriptografa tudo retroativamente.</p><p><strong>TLS 1.3</strong> tornou PFS obrigatório — removeu RSA key exchange completamente.</p>",
      tip: "Comece pelo ataque: um atacante passivo grava tráfego hoje e espera vazar a chave amanhã. PFS torna esse ataque inútil. Depois explique o mecanismo ECDHE. Essa resposta demonstra que você entende o modelo de ameaça.",
    },
    {
      q: "Como funciona a certificate chain e o que acontece se um intermediário estiver faltando?",
      level: "senior",
      a: "<p>A cadeia tem três níveis: <strong>Root CA → Intermediário CA → Certificado do servidor</strong>.</p><p>O browser confia em root CAs pré-instaladas no SO/browser. Ele valida: (1) assinatura do cert do servidor pelo intermediário; (2) assinatura do intermediário pelo root. Se alguma assinatura falhar, a cadeia quebra.</p><p><strong>Se o intermediário estiver faltando:</strong> browsers modernos têm AIA (Authority Information Access) para baixar o intermediário dinamicamente. Mas Java, mobile SDKs antigos e alguns clientes HTTP não fazem isso — falham silenciosamente ou com erro criptográfico difícil de diagnosticar.</p><p>Diagnóstico: <code>openssl s_client -connect host:443 -showcerts</code> mostra a cadeia completa. Se mostrar só o leaf cert sem o intermediário, o servidor está mal configurado.</p>",
      tip: "Mencione o AIA download como diferencial — a maioria dos candidatos não sabe que browsers modernos conseguem completar a cadeia automaticamente. O ponto crítico é que Java/mobile não fazem isso.",
    },
    {
      q: "Qual a diferença entre TLS 1.2 e TLS 1.3?",
      level: "pleno",
      a: "<ul><li><strong>RTT:</strong> 1.2 = 2 RTT; 1.3 = 1 RTT (0-RTT em resumption).</li><li><strong>Cipher suites:</strong> 1.3 removeu RSA key exchange, DH estático, RC4, DES, 3DES, CBC, MD5, SHA-1. Só AEAD: AES-GCM, ChaCha20-Poly1305.</li><li><strong>PFS obrigatório:</strong> 1.3 exige ECDHE — sem RSA key exchange frágil.</li><li><strong>Handshake encriptado:</strong> 1.3 criptografa o certificado; 1.2 envia em claro.</li><li><strong>Negociação simplificada:</strong> 1.3 removeu extensões antigas e simplificou o protocolo.</li></ul>",
      tip: "Para entrevista de pleno, foque em 1 RTT vs 2 RTT e que o 1.3 removeu ciphers fracos. Para sênior, adicione que o cert é encriptado no 1.3 e que PFS é obrigatório.",
    },
    {
      q: "O que é mTLS e quando usar?",
      level: "senior",
      a: "<p><strong>mTLS (Mutual TLS)</strong>: tanto o cliente quanto o servidor apresentam certificados X.509 e validam um ao outro. No TLS normal, só o servidor se autentica.</p><p><strong>Quando usar:</strong></p><ul><li>Comunicação serviço-a-serviço em <strong>zero trust</strong> (service mesh com Istio/Linkerd — cada pod tem cert rotacionado automaticamente).</li><li>APIs B2B onde o parceiro precisa provar identidade sem API key.</li><li>Internal APIs em segmentos de rede sensíveis.</li></ul><p><strong>Por que não para usuários finais:</strong> distribuir e gerenciar certs no browser é operacionalmente inviável. Para usuários, use JWT/OAuth2.</p><p>Implementação: cada serviço tem cert emitido pelo CA interno (ex: Vault PKI Secrets Engine, cert-manager com Let's Encrypt interno). Certs têm TTL curto (horas/dias) e são rotacionados automaticamente.</p>",
      tip: "Mencione service mesh como o caso de uso principal — demonstra maturidade. Adicione por que não funciona para usuários finais (isso distingue quem entende o contexto de quem só memorizou a definição).",
    },
    {
      q: "O que é OCSP stapling e por que é importante?",
      level: "senior",
      a: "<p>Problema: como o browser sabe se um certificado foi revogado?</p><ul><li><strong>CRL (Certificate Revocation List):</strong> lista batch de certs revogados. Grande, baixada periodicamente. Latência alta, dados desatualizados.</li><li><strong>OCSP (Online Certificate Status Protocol):</strong> cliente pergunta ao OCSP responder da CA se o cert é válido. Mais real-time, mas: (1) adiciona latência de round-trip; (2) a CA fica sabendo de todo site que o usuário visita (privacy concern).</li></ul><p><strong>OCSP Stapling:</strong> o servidor pergunta ao OCSP responder periodicamente (ex: a cada hora), recebe uma resposta assinada digitalmente, e a \"cola\" (staple) no handshake TLS. O cliente recebe a resposta OCSP junto com o cert — sem round-trip extra, sem vazar para a CA.</p><p>Nginx: <code>ssl_stapling on; ssl_stapling_verify on;</code></p>",
      tip: "O ponto sutil é a privacidade: sem stapling, a CA consegue rastrear todos os domínios que o usuário visita. Com stapling, o cliente nunca contata a CA. Mencionar isso mostra profundidade.",
    },
    {
      q: "O que é SNI e por que é necessário?",
      level: "pleno",
      a: "<p><strong>SNI (Server Name Indication)</strong> é uma extensão TLS que permite ao cliente enviar o hostname desejado no ClientHello, antes de receber o certificado do servidor.</p><p><strong>Por que é necessário:</strong> em um servidor com múltiplos sites HTTPS no mesmo IP (virtual hosting), o servidor precisa saber <em>qual</em> certificado apresentar antes de estabelecer a conexão TLS — mas o handshake TLS ocorre antes do HTTP request com o header Host. Sem SNI, o servidor não sabe qual cert usar e só pode servir um domínio por IP.</p><p><strong>Privacidade:</strong> no TLS 1.2, o SNI vai em claro — qualquer intermediário vê o hostname. TLS 1.3 introduz ESNI/ECH (Encrypted Client Hello) para encriptar o SNI.</p>",
      tip: "A sequência lógica: sem SNI, um IP = um cert. Com SNI, um IP = múltiplos certs. O detalhe de ECH/ESNI no TLS 1.3 eleva a resposta para sênior.",
    },
    {
      q: "Explique o ataque MITM em TLS e como o certificado previne.",
      level: "senior",
      a: "<p><strong>MITM (Man-in-the-Middle):</strong> atacante se posiciona entre cliente e servidor, intercepta e eventualmente modifica o tráfego.</p><p>TLS previne MITM via <strong>autenticação do servidor</strong>: o servidor apresenta um certificado X.509 assinado por uma CA confiável. O cliente valida:</p><ol><li>A assinatura do cert é de uma CA pré-instalada (root of trust).</li><li>O hostname no cert (campo SAN) bate com o hostname que o cliente quis acessar.</li><li>O cert não está expirado nem revogado.</li></ol><p>Um atacante não consegue forjar um cert válido para example.com sem comprometer a CA privada de example.com — um exercício computacionalmente inviável (ou requer comprometer a CA, que é um incidente de segurança global).</p><p><strong>Exceção:</strong> cert self-signed (sem CA confiável) — browser alerta, mas usuário pode aceitar. Ponto de ataque.</p>",
      tip: "Mencione certificate pinning como defesa adicional para apps mobile — o app fixe o fingerprint do cert esperado, rejeitando qualquer outro. Downside: renovação do cert quebra o app sem update.",
    },
    {
      q: "O que é HSTS e como funciona?",
      level: "pleno",
      a: "<p><strong>HSTS (HTTP Strict Transport Security)</strong>: header de resposta HTTP que instrui o browser a usar <em>apenas</em> HTTPS para o domínio pelos próximos N segundos.</p><code>Strict-Transport-Security: max-age=31536000; includeSubDomains; preload</code><p><strong>Funciona assim:</strong> na primeira visita HTTPS, o browser registra o domínio com o max-age. Nas visitas seguintes, se o usuário digitar http:// ou clicar em link HTTP, o browser faz a upgrade para HTTPS <em>localmente</em> — sem nem contactar o servidor HTTP. Isso previne SSLstrip (atacante downgrading para HTTP).</p><p><strong>HSTS Preloading:</strong> submeter o domínio à lista embutida nos browsers (hstspreload.org). Assim funciona mesmo na primeira visita — nunca há requisição HTTP.</p>",
      tip: "Destaque o problema que HSTS resolve: sem ele, a primeira requisição HTTP é vulnerável ao SSLstrip. Com preloading, até a primeira visita é protegida. O flag includeSubDomains é crítico — sem ele, subdomínios ficam desprotegidos.",
    },
    {
      q: "Como diagnosticar um problema de certificado em produção?",
      level: "senior",
      a: "<p>Toolkit de diagnóstico:</p><ul><li><code>openssl s_client -connect host:443 -showcerts</code> — mostra toda a cadeia, validade e cipher negociado.</li><li><code>openssl s_client -connect host:443 -servername hostname</code> — testa SNI específico.</li><li><code>openssl verify -CAfile ca-chain.pem server.crt</code> — valida a cadeia localmente.</li><li><code>curl -vI https://host</code> — mostra handshake resumido.</li><li><strong>SSL Labs</strong> (ssllabs.com/ssltest/) — auditoria completa online.</li></ul><p><strong>Problemas comuns:</strong></p><ul><li><code>UNABLE_TO_VERIFY_LEAF_SIGNATURE</code> → cert intermediário faltando.</li><li><code>ERR_CERT_DATE_INVALID</code> → cert expirado; checar <code>notAfter</code> com openssl.</li><li><code>ERR_CERT_AUTHORITY_INVALID</code> → CA não confiável (self-signed ou CA privada não instalada).</li><li><code>ERR_CERT_COMMON_NAME_INVALID</code> → SAN não bate com o hostname.</li></ul>",
      tip: "openssl s_client é a ferramenta de diagnóstico mais importante — mencione a flag -showcerts para ver a cadeia completa e -servername para SNI. Candidatos que sabem comandos práticos impressionam mais que os que só descrevem teoria.",
    },
    {
      q: "O que é certificate pinning e quais os riscos?",
      level: "senior",
      a: "<p><strong>Certificate Pinning:</strong> a aplicação (tipicamente um app mobile) armazena o fingerprint (hash SHA-256) do certificado esperado do servidor ou da CA. Ao conectar, valida que o cert recebido bate com o pinned. Se não bater, rejeita a conexão — mesmo que o cert seja válido segundo as CAs do SO.</p><p><strong>Proteção contra:</strong> CAs comprometidas, MITM com cert fabricado por CA desonesta instalada pelo usuário/empresa.</p><p><strong>Riscos operacionais:</strong></p><ul><li>Cert expira e é renovado → fingerprint muda → app quebra para todos os usuários que não atualizaram.</li><li>Renovação de emergência (comprometimento da chave) → mesmo problema, mais urgente.</li></ul><p><strong>Mitigações:</strong> fazer o pin na CA intermediária (não no leaf cert) — intermediários têm vida mais longa; usar backup pins com múltiplos hashes; ter processo de emergency release.</p>",
      tip: "O risco operacional é o ponto que diferencia respostas sênior. Pin no leaf cert = bomba relógio. Pin na CA intermediária + backup pins é o padrão correto.",
    },
    {
      q: "Explique 0-RTT no TLS 1.3 — benefício e risco.",
      level: "senior",
      a: "<p><strong>0-RTT (Early Data):</strong> em uma sessão TLS 1.3 sendo retomada (resumption via PSK — Pre-Shared Key), o cliente pode enviar dados na primeira mensagem do handshake, sem aguardar a resposta do servidor. Zero round-trips de handshake.</p><p><strong>Benefício:</strong> latência mínima para sessões sendo retomadas — crítico para mobile em redes com alta latência.</p><p><strong>Risco — Replay Attack:</strong> um atacante que capturou o early data pode reenviá-lo ao servidor posteriormente. O servidor não tem como distinguir um replay legítimo de um ataque.</p><p><strong>Regra:</strong> 0-RTT apenas para requisições <strong>idempotentes e sem efeitos colaterais</strong> (ex: GET de recursos públicos). Nunca para POST/PUT/DELETE ou qualquer operação que modifica estado. O servidor deve implementar anti-replay (sliding window de nonces) mesmo para GETs se necessário.</p>",
      tip: "A resposta completa menciona PSK como mecanismo, identifica o replay como o vetor de ataque, e dá a regra prática (idempotente = ok). Candidatos que só falam em latência sem mencionar replay mostram conhecimento superficial.",
    },
    {
      q: "Como o TLS 1.3 melhorou a privacidade comparado ao TLS 1.2?",
      level: "senior",
      a: "<ul><li><strong>Certificado criptografado:</strong> no 1.2, o cert do servidor ia em claro no handshake — qualquer observador passivo na rede sabia que domínio você estava visitando. No 1.3, o cert é enviado já com a chave de sessão derivada.</li><li><strong>Handshake parcialmente encriptado:</strong> CertificateVerify, Finished e extensões sensíveis do ServerHello vão criptografados.</li><li><strong>SNI em claro (ainda):</strong> mesmo no 1.3, o SNI ainda vai em texto claro no ClientHello — ESNI/ECH (Encrypted Client Hello, RFC em desenvolvimento) resolve isso.</li><li><strong>Remoção de renegociação:</strong> TLS 1.2 tinha renegociação de handshake em mid-session, vetor de vários ataques. Removido no 1.3.</li></ul>",
      tip: "SNI ainda em claro no 1.3 é o detalhe que demonstra profundidade — a maioria acha que o TLS 1.3 protege tudo. ECH/ESNI é a evolução sendo padronizada.",
    },
    {
      q: "Como implementar TLS corretamente no Nginx?",
      level: "pleno",
      a: "<pre><code>ssl_protocols TLSv1.2 TLSv1.3;\nssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-CHACHA20-POLY1305';\nssl_prefer_server_ciphers on;\nssl_session_cache shared:SSL:10m;\nssl_session_timeout 10m;\nssl_stapling on;\nssl_stapling_verify on;\nadd_header Strict-Transport-Security \"max-age=31536000; includeSubDomains; preload\";\nadd_header X-Frame-Options DENY;\nadd_header X-Content-Type-Options nosniff;</code></pre><p>Pontos críticos: forçar TLS 1.2+, usar apenas ECDHE ciphers (PFS), habilitar OCSP stapling, configurar HSTS com includeSubDomains.</p>",
      tip: "ssl_prefer_server_ciphers on garante que o servidor escolha a cipher suite mais forte, não o cliente (que pode ser antigo). ssl_stapling_verify on valida a resposta OCSP com o certificado da CA.",
    },
    {
      q: "Qual a diferença entre certificado DV, OV e EV?",
      level: "pleno",
      a: "<ul><li><strong>DV (Domain Validation):</strong> CA verifica apenas que o solicitante controla o domínio (DNS challenge ou file challenge). Emissão automatizada em minutos. Let's Encrypt. Mostra cadeado no browser.</li><li><strong>OV (Organization Validation):</strong> CA verifica identidade da organização (documentos legais). Processo manual, dias. Mostra organização no cert details.</li><li><strong>EV (Extended Validation):</strong> validação mais rigorosa, auditoria presencial. Antigamente mostrava barra verde no browser — removido em 2019 pelos principais browsers. Pouco diferencial hoje.</li></ul><p>Para a maioria das aplicações: <strong>DV com Let's Encrypt é suficiente</strong>. OV/EV fazem sentido para bancos/e-commerce por compliance.</p>",
      tip: "Mencione que browsers removeram o indicador visual de EV em 2019 — isso é uma pergunta frequente em entrevistas sobre por que EV perdeu valor prático.",
    },
    {
      q: "Como funciona Let's Encrypt e renovação automática?",
      level: "pleno",
      a: "<p><strong>Let's Encrypt</strong> é uma CA gratuita que usa o protocolo ACME para validação e emissão automatizada.</p><p><strong>Fluxo:</strong></p><ol><li>Cliente ACME (Certbot, cert-manager) solicita cert para domínio.</li><li>CA emite um <em>challenge</em>: DNS-01 (criar registro TXT no DNS) ou HTTP-01 (servir arquivo em <code>/.well-known/acme-challenge/</code>).</li><li>Cliente prova controle do domínio resolvendo o challenge.</li><li>CA emite o cert (validade: 90 dias).</li></ol><p><strong>Renovação automática:</strong> certs têm 90 dias de validade intencionalmente curtos para forçar automação. Certbot instala cron job que renova quando restam < 30 dias. Em Kubernetes: cert-manager com ClusterIssuer automatiza tudo.</p>",
      tip: "O design de 90 dias é intencional — força automação e reduz o impacto de certs comprometidos (que expiram logo). Candidatos que explicam o design têm mais profundidade que os que só sabem o comando certbot.",
    },
    {
      q: "O que é TLS session resumption e como funciona?",
      level: "senior",
      a: "<p>Session resumption evita repetir o handshake completo quando o cliente reconecta ao mesmo servidor — economizando CPU e latência.</p><p><strong>Dois mecanismos:</strong></p><ul><li><strong>Session IDs (TLS 1.2):</strong> servidor armazena state da sessão e retorna um ID ao cliente. Na reconexão, cliente envia o ID; servidor recupera o state. Problema: não escala (state no servidor, sem funcionar com load balancer).</li><li><strong>Session Tickets (TLS 1.2) / PSK (TLS 1.3):</strong> servidor encripta o state com uma chave interna e envia para o cliente como ticket. Cliente manda o ticket na reconexão; servidor decripta e recupera o state. Escala com load balancer (desde que todos os nós compartilhem a chave de ticket).</li></ul><p>TLS 1.3 usa PSK (Pre-Shared Key) derivado da sessão anterior — base para o 0-RTT.</p>",
      tip: "O problema de escalabilidade do Session ID é o detalhe sênior. Session Tickets resolvem isso, mas requerem rotação coordenada da chave de ticket entre os servidores — vulnerabilidade potencial se a chave vazar (perde PFS das sessões resumidas).",
    },
    {
      q: "Quais vulnerabilidades históricas do SSL/TLS você conhece?",
      level: "senior",
      a: "<ul><li><strong>BEAST (2011):</strong> ataque CBC no TLS 1.0 — exploração de IV previsível. Fix: usar AES-GCM ou RC4 (temporário). Hoje: mover para TLS 1.2+.</li><li><strong>CRIME (2012):</strong> ataque de compressão TLS. Fix: desabilitar TLS compression.</li><li><strong>POODLE (2014):</strong> downgrade forçado para SSLv3, exploit de CBC padding. Fix: desabilitar SSL 3.0.</li><li><strong>Heartbleed (2014):</strong> buffer over-read em OpenSSL — expunha até 64KB de memória do servidor por request, incluindo chaves privadas. Fix: atualizar OpenSSL 1.0.1g+.</li><li><strong>LOGJAM (2015):</strong> downgrade para DH export-grade (512 bits) — quebrado em minutos. Fix: usar apenas DH ≥ 2048 bits.</li><li><strong>DROWN (2016):</strong> ataque cross-protocol via SSLv2. Fix: desabilitar SSLv2 em todos os servidores.</li></ul>",
      tip: "Heartbleed é a vulnerabilidade mais citada em entrevistas — memorize que era um bug de implementação (não do protocolo TLS), que expunha memória do servidor e que requereu a revogação massiva de certificados. É diferente das outras que são ataques ao protocolo.",
    },
    {
      q: "Como implementar mTLS entre microserviços na prática?",
      level: "senior",
      a: "<p>Dois caminhos principais:</p><p><strong>1. Service Mesh (recomendado):</strong> Istio ou Linkerd injetam sidecar proxies (Envoy) em cada pod. O controle plane gerencia CAs, emite certs via SPIFFE/SPIRE, rotaciona automaticamente. mTLS acontece transparentemente — o código da aplicação não sabe que existe TLS. Configuração declarativa com PeerAuthentication/DestinationRule.</p><p><strong>2. Manual:</strong> usar Vault PKI Secrets Engine como CA interna. Cada serviço usa o SDK do Vault para renovar seu cert periodicamente. Configurar o cliente HTTP para carregar o cert do cliente e o CA bundle. Mais controle, mais complexidade operacional.</p><p><strong>Geração de certs:</strong> SPIFFE (Secure Production Identity Framework For Everyone) padroniza identidades de workloads como URIs (<code>spiffe://cluster/ns/default/sa/myservice</code>).</p>",
      tip: "Para sênior, mencione SPIFFE como padrão de identidade de workloads e que service mesh é a abordagem zero-touch recomendada. Service mesh remove a necessidade de o código da aplicação gerenciar TLS — separação de responsabilidades.",
    },
    {
      q: "O que acontece quando um certificado é emitido por engano? Como revogar?",
      level: "senior",
      a: "<p><strong>Revogação</strong> é o processo de invalidar um cert antes do fim da validade. Dois mecanismos:</p><ul><li><strong>CRL (Certificate Revocation List):</strong> CA publica lista de números de série revogados. Clientes baixam periodicamente. Problema: pode ter horas/dias de atraso.</li><li><strong>OCSP:</strong> cliente pergunta à CA online se o cert é válido. Mais real-time, mas depende de disponibilidade da CA.</li></ul><p><strong>Problema fundamental:</strong> browsers modernos têm \"soft-fail\" — se a OCSP query falhar (CA offline, timeout), eles aceitam o cert mesmo assim (para não bloquear acesso). Isso torna revogação praticamente ineficaz para proteção imediata.</p><p><strong>Alternativa real:</strong> certs com validade curta (Let's Encrypt: 90 dias). Se comprometido, o impacto expira logo. HSTS preloading + pinning como defesa em profundidade.</p>",
      tip: "O 'soft-fail' é o insight avançado — revogação por OCSP não é confiável em prática porque os browsers aceitam mesmo quando não conseguem verificar. Isso justifica o design de certs de curta duração do Let's Encrypt.",
    },
    {
      q: "Explique cipher suites TLS — como ler e escolher.",
      level: "senior",
      a: "<p>Uma cipher suite TLS 1.2 como <code>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</code> especifica:</p><ul><li><strong>Key Exchange:</strong> ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) — garante PFS.</li><li><strong>Authentication:</strong> RSA — assina o key exchange para autenticar o servidor.</li><li><strong>Encryption:</strong> AES_128_GCM — cifra simétrica AEAD.</li><li><strong>MAC:</strong> SHA256 — hash de integridade (para AEAD, está integrado na cifra).</li></ul><p><strong>TLS 1.3 simplificou:</strong> key exchange e autenticação são sempre ECDHE + RSA/ECDSA. Só é necessário especificar o algoritmo simétrico: <code>TLS_AES_128_GCM_SHA256</code>, <code>TLS_AES_256_GCM_SHA384</code>, <code>TLS_CHACHA20_POLY1305_SHA256</code>.</p><p><strong>Escolha segura:</strong> apenas ECDHE (não RSA KE), apenas AEAD (não CBC), apenas SHA-256+. Nunca RC4, 3DES, MD5.</p>",
      tip: "Saber decompor uma cipher suite string é pergunta frequente. A regra prática: presença de ECDHE = PFS; presença de GCM ou POLY1305 = AEAD (autenticado + encriptado); ausência de CBC = sem ataques de padding.",
    },
    {
      q: "Como o TLS protege contra downgrade attacks?",
      level: "senior",
      a: "<p>Downgrade attack: atacante MITM intercita o ClientHello e modifica a lista de cipher suites para versões mais fracas, forçando o servidor a usar criptografia quebrada.</p><p><strong>Defesas no protocolo:</strong></p><ul><li><strong>Finished Message:</strong> o MAC do Finished cobre todo o handshake. Se qualquer mensagem foi alterada, o MAC falha — conexão encerrada.</li><li><strong>TLS_FALLBACK_SCSV:</strong> valor especial na lista de ciphers que sinaliza ao servidor \"este é um retry após falha\". Se o servidor suportar versão mais alta, rejeita a reconexão — previne POODLE-style downgrade.</li><li><strong>TLS 1.3:</strong> tem proteção de versão no ServerHello — valor específico nos últimos bytes do server random para sinalizar que o servidor suporta 1.3, mesmo que esteja respondendo em 1.2 para um cliente antigo.</li></ul>",
      tip: "TLS_FALLBACK_SCSV é o detalhe que mostra domínio real do protocolo. Foi introduzido especificamente após o POODLE. Mencione que o Finished MAC protege retroativamente toda a negociação.",
    },
  ],
  diagrams: [
    {
      title: "TLS 1.3 vs TLS 1.2 — handshake comparado",
      html: `<style>
.tls-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tls-title{font-size:12px;font-weight:700;color:#f59e0b;margin:0 0 3px}
.tls-sub{font-size:10px;color:#475569;margin:0 0 14px}
.tls-cols{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
.tls-col-title{font-size:10px;font-weight:700;text-transform:uppercase;margin-bottom:8px;padding:5px 10px;border-radius:5px;text-align:center}
.tls-msg{display:flex;align-items:flex-start;gap:6px;margin-bottom:6px}
.tls-dir-right{justify-content:flex-start}
.tls-dir-left{justify-content:flex-end}
.tls-bubble{border-radius:6px;padding:5px 9px;font-size:10px;line-height:1.4;max-width:85%}
.tls-arrow{font-size:11px;align-self:center;flex-shrink:0}
.tls-tip{position:relative;cursor:help;border-bottom:1px dashed #f59e0b60}
.tls-tip:hover .tls-tb{display:block}
.tls-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:210px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.tls-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
.tls-rtt{background:#f59e0b15;border:1px dashed #f59e0b50;border-radius:4px;font-size:9px;color:#f59e0b;padding:3px 8px;text-align:center;margin-bottom:4px}
.tls-rtt-red{background:#ef444415;border:1px dashed #ef444450;border-radius:4px;font-size:9px;color:#ef4444;padding:3px 8px;text-align:center;margin-bottom:4px}
.tls-props{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.tls-prop{font-size:10px;color:#94a3b8;line-height:1.6}
.tls-prop strong{color:#f59e0b}
</style>
<div class="tls-wrap">
  <p class="tls-title">TLS handshake — 1.3 vs 1.2</p>
  <p class="tls-sub">Passe o mouse para detalhes de cada mensagem</p>
  <div class="tls-cols">
    <div>
      <div class="tls-col-title" style="background:#f59e0b15;color:#f59e0b">TLS 1.3 — 1 RTT</div>
      <div class="tls-rtt">← RTT 1 →</div>
      <div class="tls-msg tls-dir-right">
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #f59e0b40;color:#e2e8f0">
          <span class="tls-tip">ClientHello<span class="tls-tb">Inclui: versões suportadas, cipher suites e — novidade do 1.3 — key_share com chave pública ECDHE. Já envia o material criptográfico.</span></span> + key_share
        </div>
        <span class="tls-arrow" style="color:#f59e0b">→</span>
      </div>
      <div class="tls-msg tls-dir-left">
        <span class="tls-arrow" style="color:#f59e0b">←</span>
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #f59e0b40;color:#e2e8f0">
          <span class="tls-tip">ServerHello<span class="tls-tb">Servidor escolhe cipher, envia seu key_share. Ambos derivam a chave de sessão. As próximas mensagens já são criptografadas.</span></span> + key_share<br>
          <span class="tls-tip">Certificate<span class="tls-tb">No TLS 1.3 o certificado é enviado já criptografado — ao contrário do 1.2. Mais privacidade: observadores não veem qual cert foi usado.</span></span> + <span class="tls-tip">Finished<span class="tls-tb">MAC que autentica o handshake inteiro. Cliente verifica, manda seu Finished. Sessão estabelecida.</span></span>
        </div>
      </div>
      <div class="tls-msg tls-dir-right">
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #f59e0b40;color:#94a3b8">Finished → dados</div>
        <span class="tls-arrow" style="color:#f59e0b">→</span>
      </div>
    </div>
    <div>
      <div class="tls-col-title" style="background:#ef444415;color:#ef4444">TLS 1.2 — 2 RTT</div>
      <div class="tls-rtt-red">← RTT 1 →</div>
      <div class="tls-msg tls-dir-right">
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #ef444430;color:#e2e8f0">ClientHello</div>
        <span class="tls-arrow" style="color:#ef4444">→</span>
      </div>
      <div class="tls-msg tls-dir-left">
        <span class="tls-arrow" style="color:#ef4444">←</span>
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #ef444430;color:#e2e8f0">ServerHello + Cert (em claro)<br>ServerKeyExchange<br>ServerHelloDone</div>
      </div>
      <div class="tls-rtt-red" style="margin-top:2px">← RTT 2 →</div>
      <div class="tls-msg tls-dir-right">
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #ef444430;color:#94a3b8">ClientKeyExchange<br>ChangeCipherSpec<br>Finished</div>
        <span class="tls-arrow" style="color:#ef4444">→</span>
      </div>
      <div class="tls-msg tls-dir-left">
        <span class="tls-arrow" style="color:#ef4444">←</span>
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #ef444430;color:#94a3b8">ChangeCipherSpec<br>Finished → dados</div>
      </div>
    </div>
  </div>
  <div class="tls-props">
    <div class="tls-prop"><strong>Perfect Forward Secrecy</strong><br>TLS 1.3: ECDHE obrigatório. Chave de sessão não deriva da chave privada do servidor. Comprometer o servidor não decripta sessões passadas.</div>
    <div class="tls-prop"><strong>Ciphers removidos no 1.3</strong><br>RSA key exchange, CBC, RC4, MD5, SHA-1. Apenas AEAD: AES-GCM, ChaCha20-Poly1305. Mais seguro e mais simples.</div>
    <div class="tls-prop"><strong>0-RTT (early data)</strong><br>Em sessão retomada (resumption), cliente pode enviar dados junto ao ClientHello. Sem RTT de handshake. Risco: replay attacks — use apenas para GETs idempotentes.</div>
    <div class="tls-prop"><strong>mTLS</strong><br>Cliente também apresenta certificado. Usado em serviço-a-serviço (zero trust, service mesh). Mais seguro que API key — identidade de workload, não segredo compartilhado.</div>
  </div>
</div>`,
      caption: "TLS 1.3 é obrigatório em qualquer sistema novo — 1 RTT a menos, ciphers modernos, PFS obrigatório e cert criptografado. Force TLS ≥ 1.2 em produção, prefira 1.3.",
    },
    {
      title: "Certificate chain — validação passo a passo",
      html: `<style>
.cc-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.cc-title{font-size:12px;font-weight:700;color:#f59e0b;margin:0 0 3px}
.cc-sub{font-size:10px;color:#475569;margin:0 0 16px}
.cc-chain{display:flex;flex-direction:column;gap:0;margin-bottom:16px;align-items:flex-start;width:100%}
.cc-cert{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:10px 14px;width:100%;box-sizing:border-box;transition:border-color .2s,background .2s;cursor:pointer}
.cc-cert:hover{border-color:#f59e0b;background:#1e293b}
.cc-cert-top{display:flex;align-items:center;gap:8px}
.cc-badge{font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px;text-transform:uppercase}
.cc-cert-name{font-size:11px;font-weight:700;color:#e2e8f0;flex:1}
.cc-cert-detail{font-size:10px;color:#64748b;margin-top:4px;line-height:1.5}
.cc-arrow{text-align:center;font-size:18px;color:#334155;line-height:1.2;margin:2px 0}
.cc-checks{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px;margin-top:8px}
.cc-check-title{font-size:10px;font-weight:700;color:#f59e0b;margin-bottom:8px}
.cc-check{display:flex;align-items:flex-start;gap:6px;margin-bottom:5px;font-size:10px;color:#94a3b8;line-height:1.5}
.cc-ok{color:#4ade80;flex-shrink:0}
.cc-fail{color:#ef4444;flex-shrink:0}
</style>
<div class="cc-wrap">
  <p class="cc-title">Certificate chain — da folha à raiz</p>
  <p class="cc-sub">O browser percorre a cadeia de baixo para cima, validando cada assinatura</p>
  <div class="cc-chain">
    <div class="cc-cert">
      <div class="cc-cert-top">
        <span class="cc-badge" style="background:#f59e0b20;color:#f59e0b">Leaf</span>
        <span class="cc-cert-name">example.com (Certificado do Servidor)</span>
      </div>
      <div class="cc-cert-detail">Assinado por: Let's Encrypt R3 (intermediário) · SAN: example.com, www.example.com · Válido: 90 dias · Algoritmo: ECDSA P-256</div>
    </div>
    <div class="cc-arrow">↑ assinado por</div>
    <div class="cc-cert">
      <div class="cc-cert-top">
        <span class="cc-badge" style="background:#38bdf820;color:#38bdf8">Intermediário</span>
        <span class="cc-cert-name">Let's Encrypt R3</span>
      </div>
      <div class="cc-cert-detail">Assinado por: ISRG Root X1 (root CA) · Válido: 5 anos · Cross-signed para compatibilidade com Android antigo</div>
    </div>
    <div class="cc-arrow">↑ assinado por</div>
    <div class="cc-cert" style="border-color:#4ade8040">
      <div class="cc-cert-top">
        <span class="cc-badge" style="background:#4ade8020;color:#4ade80">Root CA</span>
        <span class="cc-cert-name">ISRG Root X1</span>
      </div>
      <div class="cc-cert-detail">Self-signed · Pré-instalada no SO/browser · Válida: 20 anos · Nunca enviada pelo servidor</div>
    </div>
  </div>
  <div class="cc-checks">
    <div class="cc-check-title">Validações feitas pelo browser</div>
    <div class="cc-check"><span class="cc-ok">✓</span> Assinatura de cada cert válida pelo nível acima</div>
    <div class="cc-check"><span class="cc-ok">✓</span> SAN (Subject Alternative Name) bate com o hostname solicitado</div>
    <div class="cc-check"><span class="cc-ok">✓</span> Data atual dentro de notBefore e notAfter</div>
    <div class="cc-check"><span class="cc-ok">✓</span> Cert não revogado (OCSP ou CRL)</div>
    <div class="cc-check"><span class="cc-ok">✓</span> Root CA confiável (pré-instalada no trust store)</div>
    <div class="cc-check"><span class="cc-fail">✗</span> Se intermediário faltando: browser tenta AIA download (Java/mobile falham silenciosamente)</div>
  </div>
</div>`,
      caption: "O intermediário nunca é pré-instalado nos browsers — precisa ser enviado pelo servidor. Configuração errada (cert sem chain) quebra Java, mobile e ferramentas de monitoramento.",
    },
    {
      title: "Camadas TLS sobre TCP/IP — stack completo",
      html: `<style>
.tls-stack-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tls-stack-title{font-size:12px;font-weight:700;color:#f59e0b;margin:0 0 3px}
.tls-stack-sub{font-size:10px;color:#475569;margin:0 0 16px}
.tls-layer{border-radius:8px;padding:10px 14px;margin-bottom:4px;transition:opacity .2s;cursor:default}
.tls-layer:hover{opacity:1!important}
.tls-layer-name{font-size:11px;font-weight:700}
.tls-layer-desc{font-size:10px;color:#94a3b8;margin-top:3px;line-height:1.5}
.tls-layer-tag{font-size:9px;font-family:'JetBrains Mono',monospace;color:#64748b;float:right;margin-top:2px}
.tls-sep{border-top:1px dashed #1e3a5f;margin:6px 0;font-size:9px;color:#334155;text-align:center;padding-top:4px}
.tls-compare{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.tls-compare-col{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:10px;font-size:10px;line-height:1.6}
.tls-compare-col strong{display:block;margin-bottom:4px}
</style>
<div class="tls-stack-wrap">
  <p class="tls-stack-title">Stack HTTPS — camadas do protocolo</p>
  <p class="tls-stack-sub">Passe o mouse em cada camada para entender sua função</p>
  <div class="tls-layer" style="background:#f59e0b15;border:1.5px solid #f59e0b40">
    <div class="tls-layer-name" style="color:#f59e0b">Camada 7 — Aplicação<span class="tls-layer-tag">HTTP/2, gRPC, WebSocket</span></div>
    <div class="tls-layer-desc">Protocolo de aplicação: métodos HTTP, headers, status codes, frames HTTP/2. Não sabe nada de criptografia.</div>
  </div>
  <div class="tls-layer" style="background:#f59e0b30;border:1.5px solid #f59e0b60">
    <div class="tls-layer-name" style="color:#fbbf24">TLS (Camada de Apresentação)<span class="tls-layer-tag">TLS 1.3 / 1.2</span></div>
    <div class="tls-layer-desc">Criptografia + autenticação + integridade. Handshake, cipher suite, certificados X.509, AEAD. Encapsula HTTP em registros TLS.</div>
  </div>
  <div class="tls-sep">encapsulamento</div>
  <div class="tls-layer" style="background:#3b82f615;border:1.5px solid #3b82f640">
    <div class="tls-layer-name" style="color:#3b82f6">Camada 4 — Transporte<span class="tls-layer-tag">TCP porta 443</span></div>
    <div class="tls-layer-desc">Conexão confiável e ordenada. 3-way handshake SYN/SYN-ACK/ACK ocorre ANTES do TLS handshake. Flow control, retransmissão.</div>
  </div>
  <div class="tls-layer" style="background:#4ade8015;border:1.5px solid #4ade8040">
    <div class="tls-layer-name" style="color:#4ade80">Camada 3 — Rede<span class="tls-layer-tag">IPv4 / IPv6</span></div>
    <div class="tls-layer-desc">Endereçamento e roteamento de pacotes. IP não garante entrega — só o TCP garante.</div>
  </div>
  <div class="tls-layer" style="background:#1e293b;border:1.5px solid #334155">
    <div class="tls-layer-name" style="color:#94a3b8">Camada 2 — Link<span class="tls-layer-tag">Ethernet, Wi-Fi</span></div>
    <div class="tls-layer-desc">Frames físicos. MAC address. ARP para resolver IP → MAC local.</div>
  </div>
  <div class="tls-compare">
    <div class="tls-compare-col">
      <strong style="color:#f59e0b">Sequência de handshakes para HTTPS</strong>
      1. TCP SYN → SYN-ACK → ACK (1 RTT)<br>
      2. TLS 1.3 ClientHello → ServerHello+Cert+Finished → Finished (1 RTT)<br>
      3. HTTP GET → Response<br>
      Total: 2 RTT antes de dados + DNS
    </div>
    <div class="tls-compare-col">
      <strong style="color:#3b82f6">HTTP/3 — QUIC elimina TCP</strong>
      QUIC usa UDP como transporte. Incorpora TLS 1.3 no handshake do próprio protocolo. 1 RTT total (0-RTT em resumption). Sem head-of-line blocking do TCP.
    </div>
  </div>
</div>`,
      caption: "TLS roda sobre TCP — são dois handshakes distintos antes de qualquer dado HTTP. HTTP/3 (QUIC) une os dois em um para reduzir latência.",
    },
  ],
  mnemonics: [
    {
      label: "TLS 1.3 — o que foi removido: RACK",
      trick: "R-A-C-K fora do TLS 1.3",
      explanation: "R = RSA key exchange (sem PFS). A = Algoritmos fracos (RC4, MD5, SHA-1). C = CBC (padding oracle attacks). K = Key exchange estático (DH não efêmero). Lembre: 'RACK fora' — só AEAD + ECDHE ficam.",
    },
    {
      label: "Certificate chain — ordem de quem assina quem",
      trick: "FOLHA tem GALHO tem RAIZ",
      explanation: "FOLHA = cert do servidor (leaf). GALHO = intermediário (intermediate CA). RAIZ = root CA (pré-instalada). A folha é assinada pelo galho, o galho é assinado pela raiz. Só a raiz é auto-assinada. O servidor envia folha + galho; raiz já está no cliente.",
    },
    {
      label: "PFS — por que sessões passadas ficam seguras",
      trick: "EFÊMERO = ESQUECIDO",
      explanation: "As chaves ECDHE são efêmeras — geradas fresh para cada sessão e descartadas após o handshake. Comprometer a chave privada do servidor hoje não desvenda o que foi gravado ontem. Efêmero = esquecido = forward secret.",
    },
    {
      label: "Ordem dos handshakes em HTTPS",
      trick: "TCP primeiro, TLS segundo, HTTP terceiro",
      explanation: "Nunca inverta: primeiro o TCP 3-way handshake estabelece a conexão confiável. Só depois o TLS negocia a criptografia. Só depois o HTTP faz o request. Se TLS falhar, a conexão TCP já existe mas é encerrada.",
    },
    {
      label: "OCSP Stapling — quem pergunta ao responder",
      trick: "Servidor faz o trabalho pesado",
      explanation: "Sem stapling: cada cliente pergunta à CA se o cert é válido (latência + privacidade vazada). Com stapling: o servidor pergunta periodicamente e cola a resposta assinada no handshake. Análogo a um restaurante que já trouxe a conta antes de você pedir.",
    },
  ],
  cheatsheet: {
    title: "TLS/HTTPS — referência rápida",
    html: `<style>
.tls-cs{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:18px;color:#e2e8f0;font-size:10px}
.tls-cs-h{font-size:11px;font-weight:700;color:#f59e0b;border-bottom:1px solid #334155;padding-bottom:4px;margin:0 0 8px}
.tls-cs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
.tls-cs-col{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:10px}
.tls-cs-col-title{font-size:10px;font-weight:700;color:#f59e0b;margin-bottom:6px}
.tls-cs-row{display:flex;gap:6px;margin-bottom:4px;align-items:flex-start;line-height:1.5}
.tls-cs-k{color:#f59e0b;font-weight:600;min-width:90px;flex-shrink:0}
.tls-cs-v{color:#94a3b8}
.tls-cs-code{font-family:'JetBrains Mono',monospace;background:#0f172a;border:1px solid #1e3a5f;border-radius:4px;padding:6px 8px;font-size:9px;color:#7dd3fc;line-height:1.6;white-space:pre;overflow-x:auto;margin-bottom:8px}
.tls-cs-ok{color:#4ade80}
.tls-cs-bad{color:#ef4444}
</style>
<div class="tls-cs">
  <div class="tls-cs-h">TLS/HTTPS — referência completa</div>
  <div class="tls-cs-grid">
    <div class="tls-cs-col">
      <div class="tls-cs-col-title">Handshake comparado</div>
      <div class="tls-cs-row"><span class="tls-cs-k">TLS 1.3</span><span class="tls-cs-v">1 RTT · cert criptografado · PFS obrigatório · só AEAD</span></div>
      <div class="tls-cs-row"><span class="tls-cs-k">TLS 1.2</span><span class="tls-cs-v">2 RTT · cert em claro · RSA KE opcional · suporta ciphers fracos</span></div>
      <div class="tls-cs-row"><span class="tls-cs-k">0-RTT</span><span class="tls-cs-v">Resumption sem RTT. Risco: replay. Apenas GET idempotente.</span></div>
    </div>
    <div class="tls-cs-col">
      <div class="tls-cs-col-title">Ciphers — bons vs ruins</div>
      <div class="tls-cs-row"><span class="tls-cs-ok">✓</span><span class="tls-cs-v">AES-128-GCM, AES-256-GCM, ChaCha20-Poly1305 (AEAD)</span></div>
      <div class="tls-cs-row"><span class="tls-cs-ok">✓</span><span class="tls-cs-v">ECDHE (ephemeral DH = PFS)</span></div>
      <div class="tls-cs-row"><span class="tls-cs-bad">✗</span><span class="tls-cs-v">RC4, DES, 3DES, CBC, MD5, SHA-1</span></div>
      <div class="tls-cs-row"><span class="tls-cs-bad">✗</span><span class="tls-cs-v">RSA key exchange (sem PFS)</span></div>
    </div>
    <div class="tls-cs-col">
      <div class="tls-cs-col-title">Certificado X.509</div>
      <div class="tls-cs-row"><span class="tls-cs-k">DV</span><span class="tls-cs-v">Domain only. Let's Encrypt. Automático.</span></div>
      <div class="tls-cs-row"><span class="tls-cs-k">OV</span><span class="tls-cs-v">Organização verificada. Manual.</span></div>
      <div class="tls-cs-row"><span class="tls-cs-k">SAN</span><span class="tls-cs-v">Subject Alt Name — lista de domínios válidos</span></div>
      <div class="tls-cs-row"><span class="tls-cs-k">Chain</span><span class="tls-cs-v">Leaf → Intermediário → Root CA</span></div>
      <div class="tls-cs-row"><span class="tls-cs-k">Revogação</span><span class="tls-cs-v">OCSP stapling (melhor) / CRL</span></div>
    </div>
    <div class="tls-cs-col">
      <div class="tls-cs-col-title">Recursos de segurança</div>
      <div class="tls-cs-row"><span class="tls-cs-k">PFS</span><span class="tls-cs-v">ECDHE ephemeral — sessões passadas seguras</span></div>
      <div class="tls-cs-row"><span class="tls-cs-k">mTLS</span><span class="tls-cs-v">Ambos autenticam. Service mesh, zero trust.</span></div>
      <div class="tls-cs-row"><span class="tls-cs-k">HSTS</span><span class="tls-cs-v">max-age + includeSubDomains + preload</span></div>
      <div class="tls-cs-row"><span class="tls-cs-k">SNI</span><span class="tls-cs-v">Virtual hosting HTTPS no mesmo IP</span></div>
    </div>
  </div>
  <div class="tls-cs-col-title" style="color:#f59e0b;margin-bottom:6px">Nginx — configuração segura</div>
  <div class="tls-cs-code">ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-CHACHA20-POLY1305';
ssl_prefer_server_ciphers on;
ssl_stapling on;
ssl_stapling_verify on;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";</div>
  <div class="tls-cs-col-title" style="color:#f59e0b;margin-bottom:6px">Diagnóstico</div>
  <div class="tls-cs-code">openssl s_client -connect host:443 -showcerts     # mostra cadeia completa
openssl s_client -connect host:443 -servername host  # testa SNI
curl -vI https://host 2>&amp;1 | grep -E "SSL|cipher|cert"</div>
</div>`,
    caption: "Configure sempre ssl_protocols TLSv1.2 TLSv1.3 e ECDHE ciphers. OCSP stapling elimina round-trip de revogação. HSTS com preload previne downgrade na primeira visita.",
  },
  mindmap: {
    title: "TLS/HTTPS — mapa mental",
    html: `<style>
.tls-mm{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:18px;color:#e2e8f0;font-size:10px}
.tls-mm-center{text-align:center;margin-bottom:14px}
.tls-mm-title{font-size:14px;font-weight:800;color:#f59e0b;display:inline-block;background:#f59e0b15;border:2px solid #f59e0b40;border-radius:8px;padding:6px 18px}
.tls-mm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.tls-mm-node{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px}
.tls-mm-node-title{font-weight:700;margin-bottom:6px;font-size:10px}
.tls-mm-item{color:#94a3b8;margin-bottom:3px;padding-left:10px;position:relative;line-height:1.5}
.tls-mm-item::before{content:'·';position:absolute;left:2px;color:#f59e0b}
.tls-mm-item.key{color:#e2e8f0}
.tls-mm-item.key::before{color:#4ade80;content:'✓'}
</style>
<div class="tls-mm">
  <div class="tls-mm-center"><span class="tls-mm-title">TLS / HTTPS</span></div>
  <div class="tls-mm-grid">
    <div class="tls-mm-node">
      <div class="tls-mm-node-title" style="color:#f59e0b">Handshake</div>
      <div class="tls-mm-item key">TLS 1.3 = 1 RTT</div>
      <div class="tls-mm-item key">TLS 1.2 = 2 RTT</div>
      <div class="tls-mm-item">ClientHello + key_share</div>
      <div class="tls-mm-item">ServerHello + Cert + Finished</div>
      <div class="tls-mm-item">0-RTT resumption (risco replay)</div>
    </div>
    <div class="tls-mm-node">
      <div class="tls-mm-node-title" style="color:#3b82f6">Criptografia</div>
      <div class="tls-mm-item key">AEAD only no TLS 1.3</div>
      <div class="tls-mm-item key">AES-GCM, ChaCha20-Poly1305</div>
      <div class="tls-mm-item">ECDHE = ephemeral key exchange</div>
      <div class="tls-mm-item">PFS = chave sessão ≠ chave privada</div>
      <div class="tls-mm-item">Removido: CBC, RC4, MD5</div>
    </div>
    <div class="tls-mm-node">
      <div class="tls-mm-node-title" style="color:#4ade80">Certificados</div>
      <div class="tls-mm-item key">X.509, assinado por CA</div>
      <div class="tls-mm-item key">Chain: Leaf → Intermediário → Root</div>
      <div class="tls-mm-item">SAN valida hostname</div>
      <div class="tls-mm-item">DV / OV / EV</div>
      <div class="tls-mm-item">Let's Encrypt = DV automático</div>
    </div>
    <div class="tls-mm-node">
      <div class="tls-mm-node-title" style="color:#a78bfa">Revogação</div>
      <div class="tls-mm-item key">OCSP Stapling (melhor)</div>
      <div class="tls-mm-item">CRL = lista batch</div>
      <div class="tls-mm-item">OCSP = query online</div>
      <div class="tls-mm-item">Soft-fail = browsers aceitam mesmo sem verificar</div>
      <div class="tls-mm-item">Curta duração = alternativa prática</div>
    </div>
    <div class="tls-mm-node">
      <div class="tls-mm-node-title" style="color:#f472b6">Segurança avançada</div>
      <div class="tls-mm-item key">mTLS = autenticação mútua</div>
      <div class="tls-mm-item key">HSTS + preload</div>
      <div class="tls-mm-item">SNI = virtual hosting HTTPS</div>
      <div class="tls-mm-item">Certificate pinning (cuidado)</div>
      <div class="tls-mm-item">ESNI/ECH = SNI criptografado</div>
    </div>
    <div class="tls-mm-node">
      <div class="tls-mm-node-title" style="color:#fbbf24">Diagnóstico</div>
      <div class="tls-mm-item key">openssl s_client -showcerts</div>
      <div class="tls-mm-item">SSL Labs = auditoria completa</div>
      <div class="tls-mm-item">curl -vI para handshake rápido</div>
      <div class="tls-mm-item">Erros: UNABLE_TO_VERIFY_LEAF_SIGNATURE</div>
      <div class="tls-mm-item">ERR_CERT_DATE_INVALID = cert expirado</div>
    </div>
  </div>
</div>`,
    caption: "TLS 1.3 + PFS + OCSP Stapling + HSTS é o baseline moderno. mTLS para serviço-a-serviço. Certificate pinning com cautela — risco operacional alto.",
  },
  exercises: [
    {
      level: "iniciante",
      title: "Inspecionar o certificado de um site",
      description: "Use openssl s_client para conectar ao seu site favorito (ex: google.com:443) e inspecionar: (1) qual versão TLS foi negociada, (2) qual cipher suite foi escolhida, (3) visualize a cadeia de certificados com -showcerts. Identifique quantos certs estão na cadeia e quem assinou cada um.",
      concepts: ["openssl", "certificate chain", "cipher suites", "TLS versões"],
    },
    {
      level: "intermediario",
      title: "Configurar HTTPS com Nginx e certificado Let's Encrypt",
      description: "Em um servidor Ubuntu: instale Nginx, obtenha certificado Let's Encrypt via Certbot (nginx plugin), configure ssl_protocols TLSv1.2 TLSv1.3, habilite OCSP stapling e adicione header HSTS. Verifique no SSL Labs (ssllabs.com/ssltest/) que a nota é A ou A+.",
      concepts: ["Let's Encrypt", "ACME", "Nginx TLS config", "OCSP stapling", "HSTS"],
    },
    {
      level: "intermediario",
      title: "Implementar mTLS entre dois serviços Node.js",
      description: "Crie dois serviços Node.js: um servidor HTTPS e um cliente. Gere uma CA própria com openssl, emita certificados para servidor e cliente assinados por essa CA. Configure o servidor para exigir autenticação do cliente (requestCert: true, rejectUnauthorized: true). Faça o cliente se conectar com seu certificado. Tente conectar sem cert — deve falhar com erro de TLS.",
      concepts: ["mTLS", "X.509", "openssl CA", "Node.js https module", "client certificate"],
    },
    {
      level: "senior",
      title: "Demonstrar o replay attack do TLS 0-RTT",
      description: "Configure um servidor com TLS 1.3 habilitando 0-RTT. Capture o handshake com Wireshark e reproduza o early data via script (simule replay). Observe que o servidor processa duas vezes. Implemente proteção anti-replay via Redis (sliding window de nonces) e verifique que o replay é rejeitado.",
      concepts: ["0-RTT", "replay attack", "session resumption", "PSK", "anti-replay"],
    },
    {
      level: "senior",
      title: "Implementar OCSP Stapling e verificar funcionamento",
      description: "Configure um servidor Nginx com ssl_stapling on e ssl_stapling_verify on. Use openssl s_client -status para verificar que a resposta OCSP é retornada no handshake. Compare a latência do handshake com e sem stapling. Investigue o que acontece quando a CA OCSP fica indisponível (soft-fail vs hard-fail).",
      concepts: ["OCSP stapling", "certificate revocation", "soft-fail", "Nginx TLS", "handshake latency"],
    },
  ],
  videos: [
    { title: "TLS 1.3 Explained", channel: "Computerphile", url: "https://www.youtube.com/watch?v=AlE5X1NlHgg" },
    { title: "HTTPS in the Modern Web", channel: "Google Chrome Developers", url: "https://www.youtube.com/watch?v=cBhZ6S0PFCY" },
    { title: "TLS 1.3 — How Does It Work?", channel: "Hussein Nasser", url: "https://www.youtube.com/watch?v=yPdJVvSyMqk" },
    { title: "PKI & Certificate Authority Explained", channel: "IBM Technology", url: "https://www.youtube.com/watch?v=i-rtxrEz_E8" },
    { title: "Mutual TLS (mTLS) Explained", channel: "ByteByteGo", url: "https://www.youtube.com/watch?v=1HFVJxiqFJQ" },
  ],
  resources: [
    { title: "Cloudflare — TLS 1.3 RFC 8446", url: "https://blog.cloudflare.com/rfc-8446-aka-tls-1-3/", kind: "artigo" },
    { title: "High Performance Browser Networking — TLS (Ilya Grigorik)", url: "https://hpbn.co/transport-layer-security-tls/", kind: "livro" },
    { title: "Illustrated TLS 1.3 — handshake byte a byte", url: "https://tls13.xargs.org/", kind: "pratica" },
    { title: "SSL Labs Server Test — auditoria completa", url: "https://www.ssllabs.com/ssltest/", kind: "pratica" },
    { title: "Mozilla SSL Config Generator", url: "https://ssl-config.mozilla.org/", kind: "pratica" },
    { title: "RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3", url: "https://www.rfc-editor.org/rfc/rfc8446", kind: "docs" },
    { title: "Let's Encrypt — How It Works (ACME protocol)", url: "https://letsencrypt.org/how-it-works/", kind: "docs" },
    { title: "OWASP Transport Layer Protection Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html", kind: "docs" },
  ],
  codeExamples: [
    {
      title: "Node.js — HTTPS server com certificado local",
      language: "typescript",
      code: `import https from 'https'
import fs from 'fs'

const server = https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
  // Força TLS 1.2+
  minVersion: 'TLSv1.2',
  // Cipher suites seguras (AEAD + ECDHE)
  ciphers: [
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'ECDHE-ECDSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES128-GCM-SHA256',
  ].join(':'),
}, (req, res) => {
  // req.socket.getPeerCertificate() — em mTLS retorna cert do cliente
  res.writeHead(200, {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Type': 'text/plain',
  })
  res.end('Hello TLS!')
})

server.listen(443, () => console.log('HTTPS server rodando na porta 443'))`,
    },
    {
      title: "Node.js — mTLS: servidor exige cert do cliente",
      language: "typescript",
      code: `import https from 'https'
import fs from 'fs'

// Servidor que exige certificado do cliente (mTLS)
const server = https.createServer({
  key:  fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
  ca:   fs.readFileSync('ca.crt'),     // CA que assinou o cert do cliente
  requestCert: true,                   // Solicita cert do cliente
  rejectUnauthorized: true,            // Rejeita se inválido
}, (req, res) => {
  const cert = req.socket.getPeerCertificate()
  if (!cert || !req.socket.authorized) {
    res.writeHead(401)
    res.end('Certificado inválido ou ausente')
    return
  }
  // cert.subject.CN = nome no certificado do cliente
  console.log(\`Conectado como: \${cert.subject.CN}\`)
  res.writeHead(200)
  res.end(\`Olá, \${cert.subject.CN}!\`)
})

server.listen(443)

// Cliente se conectando com certificado
import https from 'https'
const clientReq = https.request({
  hostname: 'localhost',
  port: 443,
  path: '/',
  key:  fs.readFileSync('client.key'),
  cert: fs.readFileSync('client.crt'),
  ca:   fs.readFileSync('ca.crt'),
}, (res) => {
  res.on('data', (d) => console.log(d.toString()))
})
clientReq.end()`,
    },
    {
      title: "Verificar certificado com openssl — diagnóstico completo",
      language: "bash",
      code: `# Mostrar cadeia completa de certificados
openssl s_client -connect example.com:443 -showcerts 2>/dev/null | \\
  openssl x509 -noout -text | grep -E "Subject|Issuer|Not After|SAN|DNS:"

# Testar com SNI específico
openssl s_client -connect 192.168.1.1:443 -servername example.com

# Verificar se cert está expirado
openssl x509 -noout -dates -in server.crt

# Verificar que a cadeia é válida
openssl verify -CAfile ca-chain.pem server.crt

# Simular handshake TLS 1.3 e mostrar cipher negociada
openssl s_client -connect example.com:443 -tls1_3 2>/dev/null | grep "Protocol\\|Cipher"

# Checar OCSP stapling
openssl s_client -connect example.com:443 -status 2>/dev/null | grep "OCSP Response Status"

# Gerar CA própria + certificado de servidor para dev/mTLS
openssl genrsa -out ca.key 4096
openssl req -new -x509 -days 365 -key ca.key -out ca.crt -subj "/CN=My Dev CA"
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr -subj "/CN=localhost"
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial \\
  -out server.crt -days 90 -extfile <(printf "subjectAltName=DNS:localhost,IP:127.0.0.1")`,
    },
    {
      title: "Nginx — configuração TLS production-ready",
      language: "nginx",
      code: `server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    # Certificados (Let's Encrypt via Certbot)
    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Apenas TLS 1.2 e 1.3
    ssl_protocols TLSv1.2 TLSv1.3;

    # Apenas ECDHE + AEAD (PFS garantido)
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;

    # Session cache (performance)
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;  # desabilitar tickets para perfect forward secrecy estrito

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;
    resolver 8.8.8.8 8.8.4.4 valid=300s;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
}

# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}`,
    },
  ],
}

export default tlsHttps
