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

// ── Paleta TLS/HTTPS ──────────────────────────────────────────────────────────
const C = '#f59e0b'   // âmbar — segurança — NUNCA omitir

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre TLS/HTTPS em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: TLS 1.3 handshake passo a passo, perfect forward secrecy, certificate chain, mTLS, OCSP stapling, 0-RTT e riscos de replay, cipher suites AEAD, HSTS, vulnerabilidades históricas e diagnóstico em produção.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos TLS',
    subtitle: 'Os 5 truques que grudam TLS na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'RACK fora do TLS 1.3 (o que foi removido), FOLHA-GALHO-RAIZ para certificate chain, EFÊMERO=ESQUECIDO para PFS, ordem dos handshakes HTTPS, e OCSP Stapling explicado por analogia.',
    icon: '02',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'quick-ref',
    title: 'Quick Ref TLS',
    subtitle: 'Configuração Nginx, comandos openssl e diagnóstico numa página',
    type: 'quick-ref',
    pages: 2,
    description: 'Cartão de bolso: configuração Nginx production-ready (TLS 1.2+, ECDHE, OCSP stapling, HSTS), comandos openssl para diagnóstico (s_client -showcerts, verify, x509 -dates), comparação TLS 1.2 vs 1.3 vs QUIC, e regras de cipher suites seguras.',
    icon: '03',
    goal: 'Consulta rápida',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Explique o TLS 1.3 handshake passo a passo.',
    a: 'TLS 1.3 completa em 1 RTT: (1) <strong>ClientHello + key_share</strong>: cliente envia cipher suites e chave pública ECDHE — já inclui material criptográfico. (2) <strong>ServerHello + key_share + Certificate + Finished</strong>: servidor escolhe cipher, envia seu key_share, ambos derivam a chave de sessão. Certificado enviado <em>criptografado</em> (diferencial do 1.3). MAC do Finished autentica todo o handshake. (3) <strong>Cliente valida cert, envia Finished</strong>. Dados fluem.',
    tip: 'Mencione que o cert é criptografado no 1.3 e que o key_share vai no ClientHello — essas são as diferenças estruturais chave. Contraste: TLS 1.2 = 2 RTT, cert em claro.',
  },
  {
    level: 'Senior',
    q: 'O que é perfect forward secrecy e por que importa?',
    a: '<strong>PFS</strong> garante que comprometer a chave privada do servidor no futuro não descriptografa sessões passadas. Funciona via ECDHE efêmero: chaves DH são geradas fresh para cada sessão e descartadas após o handshake. A chave privada do servidor só autentica — não deriva a chave de sessão. <strong>Sem PFS (RSA KE legado)</strong>: atacante grava tráfego hoje, rouba a chave amanhã, descriptografa tudo. TLS 1.3 tornou PFS obrigatório — removeu RSA key exchange completamente.',
    tip: 'Comece pelo ataque: grava hoje, descriptografa depois. PFS torna isso inútil. Mostre que entende o modelo de ameaça antes do mecanismo.',
  },
  {
    level: 'Senior',
    q: 'Como funciona certificate chain e o que acontece se o intermediário faltar?',
    a: 'Cadeia: <strong>leaf cert</strong> (servidor) → <strong>intermediário CA</strong> → <strong>root CA</strong> (pré-instalada). Browser valida assinaturas em cascata. Se o intermediário faltar no servidor: browsers modernos têm AIA para baixá-lo automaticamente. Mas Java, mobile SDKs antigos e clientes HTTP não fazem isso — falham com erro criptográfico difícil de diagnosticar. Diagnóstico: <code>openssl s_client -connect host:443 -showcerts</code>.',
    tip: 'O AIA download como diferencial browsers vs Java/mobile é o insight que mais candidatos não conhecem.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre TLS 1.2 e TLS 1.3?',
    a: '<ul><li><strong>RTT:</strong> 1.2 = 2 RTT; 1.3 = 1 RTT (0-RTT em resumption).</li><li><strong>Ciphers removidos no 1.3:</strong> RSA key exchange, CBC, RC4, DES, MD5, SHA-1.</li><li><strong>PFS obrigatório:</strong> 1.3 exige ECDHE; 1.2 tinha RSA KE opcional.</li><li><strong>Cert criptografado:</strong> 1.3 encripta o cert; 1.2 envia em claro.</li><li><strong>Handshake simplificado:</strong> 1.3 removeu renegociação e extensões obsoletas.</li></ul>',
    tip: 'Para pleno: foque em 1 RTT vs 2 e remoção de ciphers fracos. Para sênior: adicione cert criptografado e PFS obrigatório.',
  },
  {
    level: 'Senior',
    q: 'O que é mTLS e quando usar?',
    a: '<strong>mTLS (Mutual TLS)</strong>: cliente e servidor apresentam certificados e validam um ao outro. TLS normal só o servidor se autentica. <strong>Use para:</strong> serviço-a-serviço em zero trust (service mesh Istio/Linkerd — cada pod tem cert rotacionado automaticamente), APIs B2B. <strong>Não use para</strong> usuários finais — gerenciar certs no browser é inviável. Em service mesh: SPIFFE URIs identificam workloads (<code>spiffe://cluster/ns/default/sa/myservice</code>), cert-manager ou Vault emite automaticamente.',
    tip: 'Service mesh como caso de uso principal demonstra maturidade. Por que não para usuários finais distingue quem entende o contexto.',
  },
  {
    level: 'Senior',
    q: 'O que é OCSP stapling e por que é importante?',
    a: 'Problema: browser precisa verificar se cert foi revogado. Sem stapling: cliente consulta OCSP responder da CA (latência extra + privacidade: CA fica sabendo todo site visitado). <strong>OCSP Stapling:</strong> servidor consulta CA periodicamente, recebe resposta assinada e a inclui (staple) no handshake TLS. Cliente recebe sem round-trip extra, sem vazar para a CA. Nginx: <code>ssl_stapling on; ssl_stapling_verify on;</code>',
    tip: 'O ponto de privacidade (sem stapling, CA rastreia navegação) é o insight avançado que mostra profundidade.',
  },
  {
    level: 'Pleno',
    q: 'O que é SNI e por que é necessário?',
    a: '<strong>SNI (Server Name Indication)</strong>: extensão TLS que envia o hostname no ClientHello, antes do certificado. Necessário porque o handshake TLS ocorre antes do HTTP request — o servidor precisa saber qual cert apresentar antes de ter o header HTTP Host. Sem SNI: 1 cert por IP. Com SNI: múltiplos certs no mesmo IP (virtual hosting HTTPS). <strong>Privacidade:</strong> SNI vai em claro no TLS 1.2 e 1.3 — ESNI/ECH (Encrypted Client Hello) resolve isso no futuro.',
    tip: 'ECH/ESNI como evolução do SNI eleva a resposta para sênior — a maioria acha que TLS 1.3 esconde tudo.',
  },
  {
    level: 'Senior',
    q: 'Explique o ataque MITM e como TLS previne.',
    a: 'MITM: atacante entre cliente e servidor, intercepta e modifica tráfego. TLS previne via autenticação do servidor: o cert X.509 é assinado por uma CA pré-instalada. Cliente valida: (1) assinatura válida da CA, (2) SAN bate com hostname, (3) não expirado, (4) não revogado. Atacante não consegue forjar cert válido sem comprometer a CA privada. <strong>Exceção:</strong> cert self-signed — browser alerta, usuário pode aceitar (ponto de engenharia social).',
    tip: 'Certificate pinning como defesa adicional para mobile: app fixa o fingerprint esperado, rejeita qualquer outro. Risco: cert renovado quebra o app.',
  },
  {
    level: 'Senior',
    q: 'O que é 0-RTT no TLS 1.3 — benefício e risco?',
    a: '<strong>0-RTT:</strong> em session resumption via PSK, cliente envia dados na primeira mensagem sem aguardar handshake. Zero RTT de latência. <strong>Risco — Replay Attack:</strong> atacante captura o early data e o reenvia. Servidor não consegue distinguir replay de request legítimo. <strong>Regra:</strong> use 0-RTT apenas para GETs idempotentes sem efeitos colaterais. Nunca para POST/PUT/DELETE. Implementar anti-replay via sliding window de nonces se necessário.',
    tip: 'PSK como mecanismo + replay como vetor + idempotente como regra = resposta completa. Candidatos que só falam em latência sem citar replay têm conhecimento superficial.',
  },
  {
    level: 'Senior',
    q: 'Como diagnosticar um problema de certificado em produção?',
    a: '<ul><li><code>openssl s_client -connect host:443 -showcerts</code> → cadeia completa, cipher, validade.</li><li><code>openssl s_client -connect host:443 -servername hostname</code> → testa SNI.</li><li><code>curl -vI https://host</code> → handshake resumido.</li><li>SSL Labs ssllabs.com/ssltest/ → auditoria completa.</li></ul><strong>Erros comuns:</strong> UNABLE_TO_VERIFY_LEAF_SIGNATURE (intermediário faltando), ERR_CERT_DATE_INVALID (expirado), ERR_CERT_AUTHORITY_INVALID (CA não confiável), ERR_CERT_COMMON_NAME_INVALID (SAN errado).',
    tip: 'Mencionar comandos práticos de diagnóstico demonstra experiência real mais que teoria pura.',
  },
  {
    level: 'Senior',
    q: 'Quais vulnerabilidades históricas do SSL/TLS você conhece?',
    a: '<ul><li><strong>Heartbleed (2014):</strong> bug de implementação OpenSSL — buffer over-read expunha 64KB de memória incluindo chaves privadas. Não é ataque ao protocolo.</li><li><strong>POODLE (2014):</strong> downgrade para SSLv3, exploit de CBC padding.</li><li><strong>BEAST (2011):</strong> IV previsível no TLS 1.0 CBC.</li><li><strong>LOGJAM (2015):</strong> downgrade para DH 512 bits (export-grade).</li></ul>Todos resolvidos forçando TLS 1.2+ e desabilitando ciphers fracos.',
    tip: 'Heartbleed é a mais importante: é bug de implementação (não do protocolo), expunha chaves privadas, requereu revogação massiva de certs.',
  },
  {
    level: 'Pleno',
    q: 'O que é HSTS e como funciona?',
    a: 'Header <code>Strict-Transport-Security: max-age=31536000; includeSubDomains; preload</code>. Instrui o browser a usar apenas HTTPS por N segundos. Visitas seguintes: browser faz upgrade para HTTPS localmente sem contactar o servidor HTTP — previne SSLstrip. <strong>HSTS Preloading:</strong> domínio submetido à lista embutida nos browsers (hstspreload.org). Protege desde a primeira visita.',
    tip: 'Sem preloading, a primeira visita ainda é vulnerável ao SSLstrip. Com preloading, nunca há requisição HTTP. includeSubDomains é crítico.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona Let\'s Encrypt e renovação automática?',
    a: 'Let\'s Encrypt usa protocolo ACME: (1) cliente solicita cert; (2) CA emite challenge (DNS-01 ou HTTP-01) para provar controle do domínio; (3) cliente resolve challenge; (4) CA emite cert com validade de 90 dias. <strong>Design de 90 dias:</strong> intencional — força automação, reduz impacto de certs comprometidos. Certbot instala cron que renova quando restam &lt;30 dias. Em Kubernetes: cert-manager com ClusterIssuer automatiza completamente.',
    tip: 'O design intencional de 90 dias demonstra entendimento do modelo de segurança — não é uma limitação, é uma escolha para forçar automação.',
  },
  {
    level: 'Senior',
    q: 'O que são cipher suites e como escolher as corretas?',
    a: 'Cipher suite TLS 1.2 como <code>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</code> especifica: Key Exchange (ECDHE = PFS), Authentication (RSA), Encryption (AES-128-GCM = AEAD), MAC (SHA256). <strong>TLS 1.3 simplificou:</strong> só especifica o cipher simétrico (ex: <code>TLS_AES_128_GCM_SHA256</code>) — KE é sempre ECDHE. <strong>Regras:</strong> sempre ECDHE (PFS), sempre AEAD (não CBC), sempre SHA-256+. Nunca RC4, 3DES, MD5.',
    tip: 'Saber decompor uma cipher suite string é pergunta frequente. ECDHE = PFS; GCM/POLY1305 = AEAD; ausência de CBC = sem padding oracle.',
  },
  {
    level: 'Senior',
    q: 'Como implementar mTLS entre microserviços na prática?',
    a: '<strong>Service Mesh (recomendado):</strong> Istio/Linkerd injetam sidecar proxies, gerenciam CAs, emitem certs via SPIFFE/SPIRE, rotacionam automaticamente. mTLS transparente ao código. <strong>Manual (Vault PKI):</strong> cada serviço renova cert via SDK do Vault. Configura cliente HTTP para carregar cert. Mais controle, mais complexidade. <strong>SPIFFE:</strong> padrão de identidade de workloads com URIs (<code>spiffe://cluster/ns/default/sa/myservice</code>).',
    tip: 'Service mesh é a abordagem zero-touch — remove necessidade do código gerenciar TLS. SPIFFE como padrão de identidade demonstra conhecimento do ecossistema.',
  },
  {
    level: 'Senior',
    q: 'O que é TLS session resumption e como escala?',
    a: '<strong>Session IDs (TLS 1.2):</strong> servidor armazena state e retorna ID. Na reconexão, cliente envia ID. Não escala com load balancer (state no servidor). <strong>Session Tickets (TLS 1.2) / PSK (TLS 1.3):</strong> servidor encripta o state com chave interna e envia ao cliente como ticket. Na reconexão, cliente envia ticket. Escala — desde que todos os nós compartilhem a chave de ticket. Risco: se chave de ticket vazar, perde PFS das sessões resumidas.',
    tip: 'O problema de escalabilidade do Session ID vs tickets é o ponto que diferencia respostas sênior. Chave de ticket compartilhada entre nós como requisito operacional.',
  },
  {
    level: 'Pleno',
    q: 'Quais tipos de certificado existem (DV, OV, EV) e quando usar?',
    a: '<strong>DV (Domain Validation):</strong> CA verifica controle do domínio via challenge. Let\'s Encrypt. Automático, minutos. Cadeado no browser. <strong>OV (Organization Validation):</strong> CA verifica identidade da organização. Manual, dias. <strong>EV (Extended Validation):</strong> validação mais rigorosa. Browsers removeram barra verde em 2019 — pouco diferencial hoje. <strong>Para maioria das aplicações:</strong> DV com Let\'s Encrypt é suficiente. OV/EV para bancos/e-commerce por compliance.',
    tip: 'Browsers removeram o indicador visual de EV em 2019 — isso é pergunta frequente sobre por que EV perdeu valor prático.',
  },
  {
    level: 'Senior',
    q: 'Como o TLS protege contra downgrade attacks?',
    a: '<strong>Finished MAC:</strong> cobre todo o handshake — se qualquer mensagem foi alterada pelo atacante MITM, o MAC falha. <strong>TLS_FALLBACK_SCSV:</strong> valor especial na lista de ciphers que sinaliza "este é um retry após falha". Se servidor suportar versão mais alta, rejeita a reconexão. Previne POODLE-style downgrade. <strong>TLS 1.3:</strong> tem anti-downgrade embutido no server random — sinaliza ao cliente que servidor suporta 1.3 mesmo respondendo em 1.2.',
    tip: 'TLS_FALLBACK_SCSV foi introduzido especificamente após o POODLE. Mencionar isso mostra domínio real do protocolo.',
  },
  {
    level: 'Senior',
    q: 'Como TLS 1.3 melhorou a privacidade em relação ao TLS 1.2?',
    a: '<ul><li><strong>Cert criptografado:</strong> TLS 1.2 enviava cert em claro — ISP/observador via qual domínio você acessava. TLS 1.3 encripta o cert.</li><li><strong>Handshake parcialmente criptografado:</strong> CertificateVerify, Finished e extensões sensíveis vão criptografadas.</li><li><strong>SNI ainda em claro:</strong> mesmo TLS 1.3 expõe o SNI no ClientHello. ESNI/ECH (em padronização) resolve.</li><li><strong>Sem renegociação:</strong> TLS 1.2 tinha renegociação mid-session — vetor de ataques. Removido no 1.3.</li></ul>',
    tip: 'SNI ainda em claro no 1.3 é o insight avançado — a maioria acha que TLS 1.3 protege tudo. ECH/ESNI é a evolução sendo padronizada pelo IETF.',
  },
  {
    level: 'Pleno',
    q: 'Como configurar Nginx com TLS corretamente?',
    a: '<pre>ssl_protocols TLSv1.2 TLSv1.3;\nssl_ciphers \'ECDHE-ECDSA-AES128-GCM-SHA256:...\';\nssl_prefer_server_ciphers on;\nssl_stapling on;\nssl_stapling_verify on;\nadd_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";</pre>Pontos críticos: forçar TLS 1.2+ (remove 1.0/1.1 vulneráveis), apenas ECDHE ciphers (PFS), OCSP stapling, HSTS com includeSubDomains e preload.',
    tip: 'ssl_prefer_server_ciphers on garante que o servidor escolha a cipher mais forte, não o cliente legado. ssl_stapling_verify on valida a resposta OCSP com o cert da CA.',
  },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'O que o TLS 1.3 removeu: RACK fora',
    trick: 'R-A-C-K fora do TLS 1.3',
    expansion: [
      ['R', 'RSA key exchange (sem PFS)'],
      ['A', 'Algoritmos fracos: RC4, MD5, SHA-1'],
      ['C', 'CBC mode (vulnerável a padding oracle)'],
      ['K', 'Key exchange estático (DH não efêmero)'],
    ],
    explanation: 'Tudo que o TLS 1.3 descartou para se tornar mais seguro e mais simples. O que sobrou: apenas AEAD + ECDHE efêmero.',
    example: 'Entrevistador: "O que mudou no TLS 1.3?" → "RACK fora: RSA KE, Algoritmos fracos, CBC, Key estático"',
    why: 'Saber o que foi removido mostra que você entende os problemas de segurança do TLS 1.2, não só as novidades.',
  },
  {
    label: 'Certificate chain: FOLHA tem GALHO tem RAIZ',
    trick: 'FOLHA → GALHO → RAIZ',
    expansion: [
      ['FOLHA', 'Leaf cert — certificado do servidor (example.com)'],
      ['GALHO', 'Intermediário CA — assina o leaf, é assinado pelo root'],
      ['RAIZ', 'Root CA — self-signed, pré-instalada no browser/SO'],
    ],
    explanation: 'A folha é assinada pelo galho, o galho é assinado pela raiz. Só a raiz é self-signed. Servidor envia folha + galho; raiz já está no cliente.',
    example: 'example.com (leaf) ← Let\'s Encrypt R3 (intermediate) ← ISRG Root X1 (root)',
    why: 'A confusão mais comum é achar que o servidor envia a root CA — não envia, já está instalada. Entender isso resolve erros de "cert chain incompleta".',
  },
  {
    label: 'PFS: EFÊMERO = ESQUECIDO = FORWARD SECRET',
    trick: 'Chave efêmera → descartada → impossível decriptar o passado',
    expansion: [
      ['EFÊMERO', 'Par de chaves ECDHE gerado fresh para cada sessão'],
      ['ESQUECIDO', 'Descartado após o handshake — nunca armazenado'],
      ['FORWARD SECRET', 'Comprometer chave do servidor hoje não afeta o passado'],
    ],
    explanation: 'A analogia: como um cofre com código que muda a cada uso e você não guarda o código. Mesmo com a chave mestra do servidor, não há como abrir cofres antigos.',
    example: 'Heartbleed expôs chave privada → sem PFS: todos os tráfegos anteriores descriptografados. Com PFS: dados passados seguros.',
    why: 'O cenário do Heartbleed torna PFS concreto. PFS é o motivo pelo qual vazamento de chave privada não é uma catástrofe total.',
  },
  {
    label: 'Handshakes HTTPS em ordem: TCP-TLS-HTTP',
    trick: 'Três T\'s em ordem: TCP → TLS → The HTTP',
    expansion: [
      ['TCP', '3-way handshake SYN/SYN-ACK/ACK → 1 RTT (conexão confiável)'],
      ['TLS', 'Handshake de segurança → 1 RTT (TLS 1.3)'],
      ['HTTP', 'Request/Response → dados fluem'],
    ],
    explanation: 'Nunca inverta a ordem. TCP é o trilho, TLS é a trava de segurança, HTTP é o trem. Total: 2 RTTs antes do primeiro byte HTTP (sem contar DNS).',
    example: 'Candidato que inverte TLS antes de TCP = red flag. A conexão TCP precisa existir para o TLS rodar.',
    why: 'Entrevistadores testam se você sabe que são dois handshakes distintos, não um. TCP + TLS = 2 RTTs = custo real de HTTPS.',
  },
  {
    label: 'OCSP Stapling: O servidor faz o trabalho pesado',
    trick: 'Restaurante que traz a conta sem você pedir',
    expansion: [
      ['Sem stapling', 'Cliente pergunta à CA se cert é válido (latência + privacidade vazada)'],
      ['Com stapling', 'Servidor pergunta periodicamente e cola a resposta no handshake'],
      ['Benefício duplo', 'Sem round-trip extra + CA não rastreia navegação do usuário'],
    ],
    explanation: 'A analogia: sem stapling, você sai do restaurante, vai ao banco perguntar se o cheque do restaurante é bom, volta. Com stapling, o restaurante já trouxe a confirmação antecipada.',
    example: 'Nginx: ssl_stapling on; ssl_stapling_verify on; — duas linhas que eliminam round-trip de revogação.',
    why: 'O aspecto de privacidade (CA rastreia todo site visitado sem stapling) é o insight que impressiona em entrevistas de segurança.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'TLS/HTTPS',
    stackLabel: 'CS · Segurança · Protocolos',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'TLS/HTTPS',
    stackLabel: 'CS · Segurança · Protocolos',
  }),
  'quick-ref': () => buildQuickRefPdf({
    accentColor: C,
    skillName: 'TLS/HTTPS',
    stackLabel: 'CS · Segurança',
    columns: [
      {
        sections: [
          {
            title: 'Nginx — TLS production-ready',
            entries: [
              { key: 'Protocolos',    value: 'ssl_protocols TLSv1.2 TLSv1.3;' },
              { key: 'Ciphers',       value: 'ECDHE-ECDSA-AES128-GCM-SHA256 + CHACHA20' },
              { key: 'Prefer server', value: 'ssl_prefer_server_ciphers on;' },
              { key: 'OCSP Stapling', value: 'ssl_stapling on; ssl_stapling_verify on;' },
              { key: 'HSTS',          value: 'max-age=63072000; includeSubDomains; preload' },
              { key: 'Session cache', value: 'ssl_session_cache shared:SSL:10m;' },
            ],
          },
          {
            title: 'openssl — diagnóstico',
            entries: [
              { key: 'Cadeia completa', value: 'openssl s_client -connect host:443 -showcerts' },
              { key: 'Testar SNI',      value: 'openssl s_client -connect host:443 -servername host' },
              { key: 'Verificar datas', value: 'openssl x509 -noout -dates -in server.crt' },
              { key: 'Validar cadeia',  value: 'openssl verify -CAfile ca-chain.pem server.crt' },
              { key: 'OCSP stapling',   value: 'openssl s_client -connect host:443 -status' },
              { key: 'TLS 1.3 only',    value: 'openssl s_client -connect host:443 -tls1_3' },
            ],
          },
        ],
      } as QuickRefColumn,
      {
        sections: [
          {
            title: 'TLS 1.2 vs 1.3 vs QUIC',
            entries: [
              { key: 'TLS 1.2 RTTs',     value: '3 RTTs (1 TCP + 2 TLS)' },
              { key: 'TLS 1.3 RTTs',     value: '2 RTTs (1 TCP + 1 TLS)' },
              { key: 'QUIC RTTs',        value: '1 RTT total (TCP+TLS integrados)' },
              { key: 'PFS',              value: '1.3: obrigatório ECDHE | 1.2: opcional' },
              { key: 'Cert privacidade', value: '1.3: criptografado | 1.2: em claro' },
              { key: 'HOL blocking',     value: 'TLS 1.2/1.3: TCP HOL | QUIC: sem HOL' },
            ],
          },
          {
            title: 'Cipher suites — bom vs ruim',
            entries: [
              { key: 'Bom (AEAD)',     value: 'AES-128-GCM, AES-256-GCM, ChaCha20-Poly1305' },
              { key: 'Bom (KE)',       value: 'ECDHE (ephemeral = PFS garantido)' },
              { key: 'Ruim',           value: 'RC4, DES, 3DES, CBC, MD5, SHA-1' },
              { key: 'Ruim (KE)',      value: 'RSA key exchange (sem PFS)' },
              { key: 'Decode cipher',  value: 'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256' },
              { key: 'TLS 1.3 cipher', value: 'TLS_AES_128_GCM_SHA256 (KE implícito)' },
            ],
          },
        ],
      } as QuickRefColumn,
    ],
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function TlsHttpsPdfs() {
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
