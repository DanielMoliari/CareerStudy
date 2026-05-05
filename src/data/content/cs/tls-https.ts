import type { SkillContent } from "@/types"

const tlsHttps: SkillContent = {
    tagline: "Camada de segurança sobre TCP: encripta, autentica, garante integridade.",
    why: "HTTPS é universal. Senior precisa saber TLS handshake completo, certificate chain, perfect forward secrecy, TLS 1.3 vs 1.2.",
    summary: "TLS (sucessor do SSL) prove tres garantias: confidencialidade (criptografia simétrica negociada), integridade (MAC), autenticação (certificado X.509 assinado por CA). Roda sobre TCP. Handshake estabelece chave de sessão via troca assimetrica (RSA legacy ou ECDHE moderno) -> dali em diante conversa simétrica (AES-GCM, ChaCha20).",
    keypoints: [
      { title: "Handshake TLS 1.3", body: "ClientHello (versão, ciphers, key share) -> ServerHello + cert + key share + Finished. Cliente verifica cert, gera chave, Finished. 1 RTT." },
      { title: "Handshake TLS 1.2", body: "2 RTT. ClientHello, ServerHello, Cert, ServerKeyExchange, ServerHelloDone, ClientKeyExchange, ChangeCipherSpec, Finished. Mais lento, mais ciphers fracos." },
      { title: "Certificate chain", body: "Server cert assinado por intermediário, assinado por root CA. Browser tem CAs root pre-instaladas. Válida cadeia + nome (SAN) + não expirado." },
      { title: "Cipher suites", body: "TLS 1.3: AEAD only (AES-128-GCM, ChaCha20). TLS 1.2: legado tem CBC, RC4 (quebrados, evitar)." },
      { title: "Perfect forward secrecy", body: "Chave de sessão gerada por ECDHE — não deriva da chave privada do server. Comprometer chave do server NÃO descriptografa sessões passadas." },
      { title: "SNI", body: "Server Name Indication: cliente envia hostname no ClientHello em claro (TLS 1.2) ou encriptado (ESNI/ECH). Permite virtual hosting HTTPS." },
      { title: "OCSP / CRL", body: "Revogacao de cert. CRL = lista batch. OCSP = query online. OCSP stapling: server inclui resposta no handshake." },
      { title: "mTLS", body: "Mutual TLS: cliente também apresenta cert. Usado em serviço-a-serviço, zero trust. Mais seguro que API key." },
    ],
    gotchas: [
      "Confiar em certificado self-signed em prod — browsers gritam, atacante pode MITM fácil.",
      "Cert intermediário não instalado no server — alguns clientes (Java, mobile) falham silenciosamente.",
      "TLS 1.0/1.1 ainda habilitado — vulneravel (BEAST, POODLE). Force >= 1.2.",
      "Esquecer SNI quando hospeda múltiplos sites — server retorna cert errado.",
      "Cert expira em domingo as 3am — sem monitoring, app cai. Use Let s Encrypt + cert-manager.",
      "Confundir TLS com HTTPS — TLS é a camada; HTTPS é HTTP sobre TLS. mTLS, gRPC, SMTP-TLS também usam TLS.",
      "Usar RSA 1024 ou SHA-1 — quebrado. Use RSA 2048+, ECDSA P-256, SHA-256+.",
    ],
    interview: [
      { q: "Resuma o TLS handshake", a: "<p>TLS 1.3 (1 RTT):</p><ul><li><strong>ClientHello</strong>: versões, cipher suites, key share (chave pública ECDHE).</li><li><strong>ServerHello</strong>: cipher escolhido + key share. Server deriva chave de sessão.</li><li><strong>Certificate + Finished</strong>: server envia cert + MAC autenticado.</li><li><strong>Cliente válida cert</strong>, deriva mesma chave, manda Finished.</li></ul><p>Dali pra frente: AES-GCM com chave de sessão.</p>" },
      { q: "Como funciona certificate chain?", a: "<p>Server tem cert assinado por <strong>intermediário</strong> da CA. Intermediário é assinado por <strong>root CA</strong> (pre-instalada no client). Cliente segue a cadeia até root, válida cada assinatura.</p><p>Adicionalmente: hostname (SAN) bate, valid period, não revogado. Falha em qualquer = \"NET::ERR_CERT_INVALID\".</p>" },
      { q: "Por que TLS 1.3 é melhor que 1.2?", a: "<ul><li><strong>1 RTT</strong> em vez de 2 (0-RTT em resume).</li><li>Removeu ciphers fracos (RSA key exchange, CBC, RC4, MD5).</li><li>PFS obrigatório (só ECDHE).</li><li>Handshake parcialmente encriptado (cert não em claro).</li><li>AEAD only (autenticação integrada).</li></ul>" },
      { q: "O que é perfect forward secrecy?", a: "<p>Chave de sessão gerada por troca efemera (ECDHE). Mesmo se atacante grava trafego e depois rouba a chave privada do server, NÃO consegue descriptografar sessões passadas.</p><p>Sem PFS (RSA key exchange), comprometer chave privada vaza tudo retroativamente.</p>" },
      { q: "Quando usar mTLS?", a: "<p>Serviço-a-serviço em zero trust. Cada microservico tem cert, prova identidade. Mais seguro que API key (que pode vazar) e mais granular.</p><p>Pra usuário final é ruim UX (precisa instalar cert no browser) (precisa instalar cert no browser). Pra workloads, padrão moderno (service mesh, Istio, Linkerd).</p>" },
      { q: "Como funciona OCSP stapling?", a: "<p>Em vez de cliente perguntar OCSP responder se cert é válido (lento, vaza navegação), o server pergunta periodicamente, recebe resposta assinada e cola (staples) no handshake. Cliente confia na resposta sem trip externa.</p>" },
    ],
    diagrams: [
      {
        title: "TLS 1.3 vs TLS 1.2 — handshake comparado",
        html: `<style>
.tls-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.tls-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.tls-sub{font-size:10px;color:#475569;margin:0 0 14px}
.tls-cols{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
.tls-col-title{font-size:10px;font-weight:700;text-transform:uppercase;margin-bottom:8px;padding:5px 10px;border-radius:5px;text-align:center}
.tls-msg{display:flex;align-items:flex-start;gap:6px;margin-bottom:6px}
.tls-dir-right{justify-content:flex-start}
.tls-dir-left{justify-content:flex-end}
.tls-bubble{border-radius:6px;padding:5px 9px;font-size:10px;line-height:1.4;max-width:85%}
.tls-arrow{font-size:11px;align-self:center;flex-shrink:0}
.tls-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.tls-tip:hover .tls-tb{display:block}
.tls-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:210px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.tls-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
.tls-rtt{background:#10B98115;border:1px dashed #10B98150;border-radius:4px;font-size:9px;color:#10B981;padding:3px 8px;text-align:center;margin-bottom:4px}
.tls-rtt-red{background:#ef444415;border:1px dashed #ef444450;border-radius:4px;font-size:9px;color:#ef4444;padding:3px 8px;text-align:center;margin-bottom:4px}
.tls-props{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.tls-prop{font-size:10px;color:#94a3b8;line-height:1.6}
.tls-prop strong{color:#10B981}
</style>
<div class="tls-wrap">
  <p class="tls-title">TLS handshake — 1.3 vs 1.2</p>
  <p class="tls-sub">Passe o mouse para detalhes de cada mensagem</p>
  <div class="tls-cols">
    <div>
      <div class="tls-col-title" style="background:#10B98115;color:#10B981">TLS 1.3 — 1 RTT</div>
      <div class="tls-rtt">← RTT 1 →</div>
      <div class="tls-msg tls-dir-right">
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #10B98140;color:#e2e8f0">
          <span class="tls-tip">ClientHello<span class="tls-tb">Inclui: versões suportadas, cipher suites e — novidade do 1.3 — key_share com chave pública ECDHE. Já envia o material criptográfico.</span></span> + key_share
        </div>
        <span class="tls-arrow" style="color:#10B981">→</span>
      </div>
      <div class="tls-msg tls-dir-left">
        <span class="tls-arrow" style="color:#10B981">←</span>
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #10B98140;color:#e2e8f0">
          <span class="tls-tip">ServerHello<span class="tls-tb">Server escolhe cipher, envia seu key_share. Ambos derivam a chave de sessão. As próximas mensagens já são criptografadas.</span></span> + key_share<br>
          <span class="tls-tip">Certificate<span class="tls-tb">No TLS 1.3, o certificado é enviado já criptografado (ao contrário do 1.2). Mais privacidade.</span></span> + <span class="tls-tip">Finished<span class="tls-tb">MAC que autentica o handshake inteiro. Cliente verifica, manda seu Finished. Sessão estabelecida.</span></span>
        </div>
      </div>
      <div class="tls-msg tls-dir-right">
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #10B98140;color:#94a3b8">Finished → dados</div>
        <span class="tls-arrow" style="color:#10B981">→</span>
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
        <div class="tls-bubble" style="background:#1e293b;border:1px solid #ef444430;color:#e2e8f0">ServerHello + Cert<br>ServerKeyExchange<br>ServerHelloDone</div>
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
    <div class="tls-prop"><strong>Perfect Forward Secrecy</strong><br>TLS 1.3: ECDHE obrigatório. Chave de sessão não deriva da chave privada do server. Comprometer o server não decripta sessões passadas.</div>
    <div class="tls-prop"><strong>Ciphers removidos no 1.3</strong><br>RSA key exchange, CBC, RC4, MD5, SHA-1. Só AEAD: AES-GCM, ChaCha20-Poly1305. Mais seguro e mais simples.</div>
    <div class="tls-prop"><strong>0-RTT (early data)</strong><br>Em sessão retomada (resumption), cliente pode enviar dados junto ao ClientHello. Sem RTT de handshake. Risco: replay attacks.</div>
    <div class="tls-prop"><strong>mTLS</strong><br>Cliente também apresenta certificado. Usado em serviço-a-serviço (zero trust, service mesh). Mais seguro que API key.</div>
  </div>
</div>`,
        caption: "TLS 1.3 é obrigatório em qualquer sistema novo — 1 RTT a menos, ciphers modernos, PFS obrigatório e cert criptografado. Force TLS ≥ 1.2 em produção, prefira 1.3.",
      },
    ],
    resources: [
      { title: "Cloudflare — TLS 1.3", url: "https://blog.cloudflare.com/rfc-8446-aka-tls-1-3/", kind: "artigo" },
      { title: "High Performance Browser Networking — TLS", url: "https://hpbn.co/transport-layer-security-tls/", kind: "livro" },
      { title: "Illustrated TLS 1.3", url: "https://tls13.xargs.org/", kind: "pratica" },
      { title: "SSL Labs Server Test", url: "https://www.ssllabs.com/ssltest/", kind: "pratica" },
      { title: "Beej's Guide to Network Programming", url: "https://beej.us/guide/bgnet/", kind: "livro" },
    ],
  }

export default tlsHttps
