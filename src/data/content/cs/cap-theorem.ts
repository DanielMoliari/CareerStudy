import type { SkillContent } from "@/types"

const capTheorem: SkillContent = {
    tagline: "Em partição de rede, sistema distribuido escolhe entre consistencia ou disponibilidade.",
    why: "Pergunta clássica em entrevista de system design. Senior precisa explicar trade-off com casos reais (Postgres CP, Cassandra AP, DynamoDB tunable).",
    summary: "CAP: dado uma partição de rede (P), você escolhe entre Consistency (todos os nodes veem mesmo dado) ou Availability (cada request retorna sucesso). Sem partição, é consistente E disponível — mas partição acontece. PACELC estende: Else (sem partição) escolhe entre Latency e Consistency. Entender CAP é entender por que não existe DB perfeito.",
    keypoints: [
      { title: "Consistency (linearizability)", body: "Toda leitura ve a última escrita confirmada. Como se fosse single node. Forte mas custa coordenacao." },
      { title: "Availability", body: "Toda request a um node não falho recebe resposta (pode ser stale). Sistema continua respondendo durante partição." },
      { title: "Partition tolerance", body: "Sistema continua operando apesar de mensagens perdidas/atrasadas entre nodes. Em rede real, partição acontece — você escolhe entre C e A." },
      { title: "CP exemplos", body: "Postgres com replica sync, MongoDB (default), HBase, Zookeeper, etcd. Em partição, prefere falhar a retornar inconsistente." },
      { title: "AP exemplos", body: "Cassandra, DynamoDB (default), CouchDB, Riak. Em partição, retorna stale ou aceita escrita conflitante (resolve depois)." },
      { title: "PACELC", body: "Else (sem partição): escolhe entre Latency e Consistency. Spanner/Postgres = PC/EC. DynamoDB = PA/EL." },
      { title: "Tunable consistency", body: "Cassandra, DynamoDB permitem ajustar por query: ONE, QUORUM, ALL. Tradeoff entre latência e consistencia." },
      { title: "Eventual consistency", body: "Sistema converge eventualmente sem coordenacao forte. Usado em AP. Exige merge logic (LWW, CRDTs, vector clocks)." },
    ],
    gotchas: [
      "Achar que pode ser CA (consistente e disponível sem P) — partição acontece em rede real, não da pra ignorar.",
      "Generalizar \"Cassandra é AP\" sem entender que é tunable — você pode rodar com QUORUM e ter consistência forte.",
      "Confundir consistency (CAP) com ACID consistency (Postgres) — são conceitos distintos.",
      "Esquecer PACELC — em operação normal (sem partição), latência ainda é trade-off.",
      "Usar AP em sistema financeiro — saldo negativo por escrita concorrente.",
      "Esperar que CRDTs resolvem qualquer conflito — funcionam pra estruturas específicas (counter, set, map).",
      "Linearizability vs serializability — diferentes garantias. Linearizability é sobre ordem real-time; serializability é sobre ordem de transações.",
    ],
    interview: [
      { q: "Explique CAP em uma frase", a: "<p>Sistema distribuído não pode garantir simultaneamente <strong>Consistencia</strong> (toda leitura ve última escrita), <strong>Disponibilidade</strong> (toda request recebe resposta) e <strong>Tolerância a partição</strong>. Como partição é inevitável em rede real, você escolhe entre C e A.</p>" },
      { q: "Postgres com replica sync: CP ou AP?", a: "<p><strong>CP</strong>. Em partição entre primary e replica sync, primary trava (espera ack que não vem). Sistema fica indisponível até resolver. Garante que dado é consistente — leitor sempre vê igual.</p><p>Async réplica é diferente: replica fica stale, mas primary continua. Mais AP.</p>" },
      { q: "Cassandra: CP ou AP?", a: "<p>Padrão <strong>AP</strong> com tunable consistency. CL=ONE é muito disponível (uma réplica responde) e eventualmente consistente.</p><p>Mas você pode rodar CL=QUORUM em escrita E leitura: garante (W+R) > N replicas, então toda leitura ve última escrita. Vira mais CP.</p>" },
      { q: "O que é PACELC?", a: "<p>Extensão do CAP. <strong>P</strong>articao + <strong>A</strong>/C, <strong>E</strong>lse <strong>L</strong>atency/<strong>C</strong>onsistency.</p><p>Em partição, escolhe A ou C. SEM partição, escolhe latência ou consistência. Spanner = PC/EC (sempre prefere C). DynamoDB = PA/EL (prefere disponibilidade e baixa latência).</p>" },
      { q: "Quando usaria sistema AP?", a: "<p>Quando disponibilidade > consistencia exata. Ex:</p><ul><li>Carrinho de compras (resolve duplicata depois).</li><li>Feed social (atraso aceitavel).</li><li>Counters (visualizações, likes).</li><li>Telemetria, logs.</li></ul><p>Não use AP em saldo bancario, estoque crit, payments — exige consistencia.</p>" },
      { q: "Como implementaria pagamento em sistema distribuido?", a: "<p>Precisa CP. Opcoes:</p><ul><li><strong>Spanner / CockroachDB</strong>: ACID distribuido com 2PC + Paxos.</li><li><strong>Postgres single primary</strong> com replica sync.</li><li><strong>Saga pattern</strong> com compensating transactions em caso de falha — eventual mas com semantica correta.</li><li><strong>Idempotency keys</strong> em todas operações.</li></ul>" },
    ],
    diagrams: [
      {
        title: "CAP Theorem — triângulo de trade-offs com exemplos reais",
        html: `<style>
.cap-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.cap-title{font-size:12px;font-weight:700;color:#10B981;margin:0 0 3px}
.cap-sub{font-size:10px;color:#475569;margin:0 0 14px}
.cap-main{display:grid;grid-template-columns:auto 1fr;gap:16px;margin-bottom:14px;align-items:start}
.cap-triangle{position:relative;width:180px;height:160px;flex-shrink:0}
.cap-triangle svg{width:180px;height:160px}
.cap-grid{display:flex;flex-direction:column;gap:8px}
.cap-card{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:10px 12px;transition:border-color .2s}
.cap-card:hover{border-color:#10B981}
.cap-card-title{font-size:11px;font-weight:700;margin-bottom:3px}
.cap-card-body{font-size:10px;color:#94a3b8;line-height:1.5;margin-bottom:3px}
.cap-card-ex{font-size:9px;font-family:'JetBrains Mono',monospace;color:#475569}
.cap-pacelc{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px}
.cap-pacelc-title{font-size:10px;font-weight:700;color:#10B981;margin-bottom:8px}
.cap-row{display:flex;gap:6px;align-items:flex-start;font-size:10px;margin-bottom:5px;line-height:1.5}
.cap-tip{position:relative;cursor:help;border-bottom:1px dashed #10B98160}
.cap-tip:hover .cap-tb{display:block}
.cap-tb{display:none;position:absolute;bottom:calc(100% + 6px);left:0;background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7);white-space:normal}
.cap-tb::after{content:'';position:absolute;top:100%;left:12px;border:5px solid transparent;border-top-color:#334155}
</style>
<div class="cap-wrap">
  <p class="cap-title">CAP Theorem — em partição de rede, escolha C ou A</p>
  <p class="cap-sub">Partição (P) é inevitável em rede real — a escolha é entre Consistency e Availability</p>
  <div class="cap-main">
    <div class="cap-triangle">
      <svg viewBox="0 0 180 160">
        <!-- triangle -->
        <polygon points="90,10 10,150 170,150" fill="none" stroke="#334155" stroke-width="1.5"/>
        <!-- shaded regions -->
        <polygon points="90,10 50,80 130,80" fill="#10B98112" stroke="none"/>
        <!-- vertices -->
        <circle cx="90" cy="10" r="18" fill="#1e293b" stroke="#10B981" stroke-width="1.5"/>
        <text x="90" y="8" text-anchor="middle" font-size="8" font-weight="700" fill="#10B981" font-family="Space Grotesk,sans-serif">
          <tspan x="90" dy="4">C</tspan>
        </text>
        <text x="90" y="20" text-anchor="middle" font-size="7" fill="#64748b" font-family="Space Grotesk,sans-serif">Consistency</text>
        <circle cx="10" cy="150" r="18" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="10" y="148" text-anchor="middle" font-size="8" font-weight="700" fill="#3b82f6" font-family="Space Grotesk,sans-serif">
          <tspan x="10" dy="4">A</tspan>
        </text>
        <text x="10" y="162" text-anchor="middle" font-size="7" fill="#64748b" font-family="Space Grotesk,sans-serif">Availability</text>
        <circle cx="170" cy="150" r="18" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="170" y="148" text-anchor="middle" font-size="8" font-weight="700" fill="#f59e0b" font-family="Space Grotesk,sans-serif">
          <tspan x="170" dy="4">P</tspan>
        </text>
        <text x="170" y="162" text-anchor="middle" font-size="7" fill="#64748b" font-family="Space Grotesk,sans-serif">Partition</text>
        <!-- CP label -->
        <text x="130" y="75" font-size="8" fill="#10B981" font-family="Space Grotesk,sans-serif" font-weight="600">CP</text>
        <text x="110" y="85" font-size="7" fill="#475569" font-family="Space Grotesk,sans-serif">Postgres,etcd</text>
        <!-- AP label -->
        <text x="42" y="75" font-size="8" fill="#3b82f6" font-family="Space Grotesk,sans-serif" font-weight="600">AP</text>
        <text x="25" y="85" font-size="7" fill="#475569" font-family="Space Grotesk,sans-serif">Cassandra,DynamoDB</text>
        <!-- CA note -->
        <text x="90" y="130" text-anchor="middle" font-size="7" fill="#ef4444" font-family="Space Grotesk,sans-serif">CA = não existe</text>
        <text x="90" y="140" text-anchor="middle" font-size="6" fill="#475569" font-family="Space Grotesk,sans-serif">em rede real</text>
      </svg>
    </div>
    <div class="cap-grid">
      <div class="cap-card">
        <div class="cap-card-title" style="color:#10B981">CP — Consistente + Tolerante a partição</div>
        <div class="cap-card-body">Em partição, sistema <span class="cap-tip">recusa resposta<span class="cap-tb">Prefere retornar erro a retornar dado potencialmente desatualizado. O node isolado fica indisponível até a partição sarar.</span></span> ao invés de retornar dado stale. Garante que toda leitura vê a última escrita.</div>
        <div class="cap-card-ex">PostgreSQL (sync replica) · etcd · Zookeeper · HBase · MongoDB</div>
      </div>
      <div class="cap-card">
        <div class="cap-card-title" style="color:#3b82f6">AP — Disponível + Tolerante a partição</div>
        <div class="cap-card-body">Em partição, sistema <span class="cap-tip">continua respondendo<span class="cap-tb">Pode retornar dados desatualizados (stale reads) ou aceitar escritas conflitantes que serão reconciliadas depois (eventual consistency).</span></span> mesmo que o dado possa estar desatualizado. Eventual consistency.</div>
        <div class="cap-card-ex">Cassandra · DynamoDB (padrão) · CouchDB · Riak</div>
      </div>
    </div>
  </div>
  <div class="cap-pacelc">
    <div class="cap-pacelc-title">PACELC — o CAP estendido (sem partição, ainda há trade-off)</div>
    <div class="cap-row">
      <span style="color:#10B981;font-weight:700;min-width:70px">PC/EC</span>
      <span style="color:#94a3b8">Prefere consistência sempre — com e sem partição. Ex: <strong style="color:#e2e8f0">Spanner, CockroachDB, PostgreSQL</strong></span>
    </div>
    <div class="cap-row">
      <span style="color:#3b82f6;font-weight:700;min-width:70px">PA/EL</span>
      <span style="color:#94a3b8">Prefere disponibilidade em partição e baixa latência no normal. Ex: <strong style="color:#e2e8f0">DynamoDB, Cassandra (padrão)</strong></span>
    </div>
    <div style="font-size:9px;color:#475569;margin-top:6px">⚠ Cassandra com QUORUM em escrita+leitura vira CP. O CAP de um sistema pode ser ajustado por query.</div>
  </div>
</div>`,
        caption: "CAP é um trade-off, não uma falha. Sistemas como Cassandra e DynamoDB são AP por padrão mas oferecem consistency tunable por operação. Conheça o padrão do seu banco antes de garantir consistência em entrevista.",
      },
    ],
    resources: [
      { title: "Brewer — CAP twelve years later", url: "https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/", kind: "artigo" },
      { title: "Designing Data-Intensive Applications (Kleppmann)", url: "https://dataintensive.net/", kind: "livro" },
      { title: "Aphyr — Jepsen analyses", url: "https://jepsen.io/analyses", kind: "artigo" },
      { title: "Martin Kleppmann — Distributed Systems lecture", url: "https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB", kind: "video" },
      { title: "MIT 6.824 — Distributed Systems", url: "https://pdos.csail.mit.edu/6.824/", kind: "curso" },
    ],
  }

export default capTheorem
