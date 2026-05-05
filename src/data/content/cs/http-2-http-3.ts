import type { SkillContent } from "@/types"

const http2Http3: SkillContent = {
    tagline: "Evolucao do HTTP: HTTP/2 multiplexa em uma TCP, HTTP/3 troca por QUIC sobre UDP.",
    why: "Web moderna roda HTTP/2 e HTTP/3. Senior precisa explicar head-of-line blocking, multiplexing, server push (e por que morreu) e QUIC.",
    summary: "HTTP/1.1 abre uma conexão por request (ou keep-alive serial) — gargalo. HTTP/2 multiplexa varios streams em uma TCP, header compression (HPACK), binary framing. Mas HTTP/2 sofre head-of-line blocking em TCP loss. HTTP/3 substitui TCP por QUIC (sobre UDP), com streams independentes, conexão mais rápida, migração de IP.",
    keypoints: [
      { title: "HTTP/1.1 problemas", body: "Uma request por vez por conexão. Browsers abrem 6 conexões paralelas por host. Head-of-line blocking dentro da conexão." },
      { title: "HTTP/2 multiplexing", body: "Multiplos streams em uma TCP. Cada stream tem id, frames intercalados. Sem keep-alive serial." },
      { title: "HPACK", body: "Compressao de headers via dicionario dinâmico. Headers repetidos viram referência curta. Reduz overhead." },
      { title: "HTTP/2 binary framing", body: "Mensagens viram frames binarios (HEADERS, DATA, SETTINGS). Mais eficiente de parsear que ASCII." },
      { title: "TCP HoL em HTTP/2", body: "Perda de pacote TCP bloqueia TODOS os streams (porque TCP exige ordem). Limitacao fundamental." },
      { title: "QUIC (HTTP/3)", body: "Protocolo novo sobre UDP. Streams independentes (loss em um não bloqueia outro). 0-RTT resume. TLS 1.3 integrado. Migração de IP (mobile)." },
      { title: "Server push (deprecated)", body: "HTTP/2 podia \"empurrar\" recursos antes do client pedir. Pouco usado, difícil de fazer certo, removido em browsers." },
      { title: "Adocao", body: "2026: ~70%% dos sites usam HTTP/2; HTTP/3 cresce rápido (Cloudflare, Google). Browsers todos suportam." },
    ],
    gotchas: [
      "Achar que HTTP/2 elimina HoL — não, é em camada de aplicação mas TCP ainda tem.",
      "Concatenar arquivos (bundling) e sprite era pra HTTP/1.1 — em HTTP/2 está subótimo (cache invalidation pior).",
      "CDN diz \"HTTP/3 enabled\" mas backend ainda em HTTP/1.1 — gargalo no origem.",
      "Server Push já morreu — ainda ve em tutoriais antigos. Use 103 Early Hints.",
      "QUIC é sobre UDP — alguns firewalls bloqueiam ou rate-limit UDP, fallback pra TCP.",
      "HTTP/2 sem TLS — possível mas todos browsers exigem TLS na prática.",
      "Confundir h2 (HTTP/2) com h2c (HTTP/2 cleartext) — diferentes.",
    ],
    interview: [
      { q: "O que HTTP/2 melhorou vs 1.1?", a: "<ul><li><strong>Multiplexing</strong>: varios streams em uma TCP. Sem fila por conexão.</li><li><strong>HPACK</strong>: compressão de headers.</li><li><strong>Binary framing</strong>: mais eficiente.</li><li><strong>Stream priority</strong>: cliente sinaliza quais são mais importantes.</li><li><strong>Server push</strong> (deprecated agora).</li></ul>" },
      { q: "Qual o problema fundamental do HTTP/2?", a: "<p><strong>Head-of-line blocking em TCP</strong>. HTTP/2 multiplexa em camada de aplicação, mas TCP exige ordem de pacotes — perda de um pacote bloqueia todos os streams até retransmit.</p><p>Em redes com perda (mobile, wifi ruim) penaliza HTTP/2.</p>" },
      { q: "Como HTTP/3 resolve isso?", a: "<p>HTTP/3 roda sobre QUIC (sobre UDP). QUIC implementa streams em nível de transporte — cada stream tem seu controle de fluxo, perda em um não bloqueia outros.</p><p>Bonus: QUIC integra TLS 1.3 (handshake em 1 RTT, 0-RTT resume), e suporta migração de IP (troca wifi pra 4G sem perder conexão).</p>" },
      { q: "Bundling com HTTP/2 — ainda vale?", a: "<p>Menos. Em HTTP/1.1 era crítico (1 request por conexão). Em HTTP/2 multiplexa — vários arquivos em paralelo é barato.</p><p>Mas bundling reduz overhead de runtime e melhora compressão gzip global. Trade-off vs cache granular. Em prática: bundle inteligente (split por rota), não tudo num arquivo.</p>" },
      { q: "Como está a adoção do HTTP/3?", a: "<p>2026: maior parte dos browsers suportam, e CDN (Cloudflare, Fastly, Google) servem por padrão. Adoção em sites cresceu rápido. Backend pra origin ainda majoritariamente HTTP/2 ou 1.1.</p><p>Pra cliente final, já é real. Pra interno (microsserviços), gRPC sobre HTTP/2 domina.</p>" },
      { q: "Quando usaria server push (ou alternativa)?", a: "<p>Server push em HTTP/2 está deprecated. Use <strong>103 Early Hints</strong> (HTTP/2 e 3) — server retorna 103 com Link: prefetch antes de processar request, browser começa download de CSS/JS crítico em paralelo.</p><p>Suporte: Chrome, Cloudflare, Fastly. Bom ganho em LCP.</p>" },
    ],
    resources: [
      { title: "High Performance Browser Networking — HTTP/2", url: "https://hpbn.co/http2/", kind: "livro" },
      { title: "Cloudflare — HTTP/3", url: "https://blog.cloudflare.com/http3-the-past-present-and-future/", kind: "artigo" },
      { title: "IETF — QUIC RFC 9000", url: "https://datatracker.ietf.org/doc/html/rfc9000", kind: "docs" },
      { title: "Google — HTTP/3 explained", url: "https://http3-explained.haxx.se/", kind: "docs" },
      { title: "web.dev — Early Hints", url: "https://web.dev/articles/early-hints", kind: "artigo" },
    ],
    diagram: "http-versions",
  }

export default http2Http3
