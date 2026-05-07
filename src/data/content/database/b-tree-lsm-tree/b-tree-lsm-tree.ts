import type { SkillContent } from '@/types'

const bTreeLsmTree: SkillContent = {
  tagline: "Estruturas de índice: B-Tree (leitura otimizada) vs LSM-Tree (escrita otimizada).",
  why: "B-Tree é o padrão em Postgres/MySQL. LSM-Tree é o segredo de RocksDB, Cassandra, LevelDB. Saber o tradeoff explica por que esses bancos existem e quando usar cada um — diferencial obrigatório para arquitetura de banco de dados.",
  summary: "B-Tree é uma árvore balanceada auto-ajustável. Nós têm múltiplas chaves; busca O(log n), insert/update O(log n) com rebalanceamento in-place. Excelente para leitura, update frequente é caro (random I/O). LSM-Tree (Log-Structured Merge Tree) escreve em memtable (sequencial), faz flush para SSTables imutáveis, compacta em background. Escrita O(1) amortizado; leitura mais cara (múltiplos SSTables).\n\nBloom filters são o enabler da leitura eficiente em LSM: dizem 'definitivamente não está aqui' com 100% de precisão (zero false negatives), evitando I/O desnecessário na maioria das leituras miss. A compactação periódica reduz o número de SSTables, melhorando leitura ao custo de write amplification.",
  keypoints: [
    { title: "B-Tree: estrutura", body: "Árvore de altura O(log n). Cada nó tem M chaves e M+1 filhos. Folhas são doubly-linked para range scan. Postgres usa variante B+ Tree (dados só nas folhas, melhora range scan)." },
    { title: "B-Tree: tradeoffs", body: "Leitura: muito boa (busca pontual, range). Update: bom mas random write no disco (write amplification). Fragmentação e VACUUM/reindex necessários com tempo." },
    { title: "LSM-Tree: estrutura", body: "Writes vão para memtable (in-memory, ordenada). Quando cheia, flush imutável para SSTable em disco. Múltiplas SSTables por nível. Compactação periódica mescla e ordena." },
    { title: "LSM-Tree: tradeoffs", body: "Escrita: excelente (sequencial, baixa latência). Leitura: mais cara (verifica múltiplas SSTables). Bloom filter otimiza: 'essa chave existe neste SSTable?' com alta precisão e custo mínimo." },
    { title: "Bloom Filter", body: "Estrutura probabilística: diz 'definitivamente não está aqui' (false negative impossível) ou 'provavelmente está aqui' (false positive possível). Economiza I/O em LSM evitando leitura de SSTables desnecessárias." },
    { title: "Compactação", body: "LSM-Tree tem write amplification na compactação (dado escrito várias vezes). Strategies: size-tiered (Cassandra default, menos I/O de compactação) vs leveled (RocksDB default, menos read amplification)." },
    { title: "Uso em bancos", body: "B-Tree: Postgres, MySQL (InnoDB), SQLite. LSM-Tree: RocksDB (base do MyRocks, TiKV, PebbleDB), Cassandra, HBase, LevelDB, InfluxDB." },
    { title: "SSDs mudam o cálculo", body: "Em NVMe SSDs, random I/O é muito menos penalizado que em HDD. B-Tree perde menos terreno em SSD. LSM ainda vence em escrita, mas a diferença é menor. Read amplification do LSM é mais relevante em SSD do que em HDD." },
  ],
  diagrams: [
    {
      title: "B-Tree vs LSM-Tree: fluxo de escrita e leitura",
      html: `<style>
.bt-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.bt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.bt-col { background: #0d1117; border-radius: 10px; padding: 16px; border: 1.5px solid; }
.bt-pg { border-color: #4169E1; }
.bt-lsm { border-color: #DC382D; }
.bt-head { font-size: 13px; font-weight: 700; margin-bottom: 12px; text-align: center; }
.bt-pg .bt-head { color: #4169E1; }
.bt-lsm .bt-head { color: #DC382D; }
.bt-step { display: flex; align-items: flex-start; gap: 8px; margin: 6px 0; font-size: 12px; color: #94a3b8; line-height: 1.4; }
.bt-num { font-weight: 700; min-width: 16px; }
.bt-pg .bt-num { color: #4169E1; }
.bt-lsm .bt-num { color: #DC382D; }
.bt-bar { margin-top: 12px; display: flex; gap: 4px; align-items: center; font-size: 11px; }
.bt-label { color: #64748b; min-width: 60px; }
.bt-fill { height: 8px; border-radius: 4px; }
.bt-section { margin-top: 20px; }
.bt-title { color: #4d9fcf; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; text-align: center; }
.bt-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.bt-table th { background: #1e293b; color: #64748b; padding: 6px 10px; text-align: left; font-weight: 600; }
.bt-table td { padding: 6px 10px; border-top: 1px solid #1e293b; color: #94a3b8; }
.bt-table td:first-child { color: #e2e8f0; font-weight: 600; }
.good { color: #22c55e !important; }
.bad { color: #ef4444 !important; }
.mid { color: #f59e0b !important; }
</style>
<div class="bt-wrap">
<div class="bt-grid">
  <div class="bt-col bt-pg">
    <div class="bt-head">B-Tree (Postgres, MySQL)</div>
    <div class="bt-step"><span class="bt-num">W</span><span>Write → navega a árvore até o nó folha → modifica in-place → rebalanceia se necessário (random I/O)</span></div>
    <div class="bt-step"><span class="bt-num">R</span><span>Read → traversal O(log n) → lê folha → done (1 lookup)</span></div>
    <div class="bt-bar"><span class="bt-label">Escrita</span><div class="bt-fill" style="width:55%;background:#f59e0b"></div><span style="color:#f59e0b;font-size:11px;margin-left:4px">média</span></div>
    <div class="bt-bar"><span class="bt-label">Leitura</span><div class="bt-fill" style="width:90%;background:#22c55e"></div><span style="color:#22c55e;font-size:11px;margin-left:4px">excelente</span></div>
  </div>
  <div class="bt-col bt-lsm">
    <div class="bt-head">LSM-Tree (RocksDB, Cassandra)</div>
    <div class="bt-step"><span class="bt-num">W</span><span>Write → memtable (RAM, sequencial) → flush → SSTable imutável → compactação em background</span></div>
    <div class="bt-step"><span class="bt-num">R</span><span>Read → memtable → SSTable L0 → L1 → ... (Bloom filter elimina leituras desnecessárias)</span></div>
    <div class="bt-bar"><span class="bt-label">Escrita</span><div class="bt-fill" style="width:95%;background:#22c55e"></div><span style="color:#22c55e;font-size:11px;margin-left:4px">excelente</span></div>
    <div class="bt-bar"><span class="bt-label">Leitura</span><div class="bt-fill" style="width:60%;background:#f59e0b"></div><span style="color:#f59e0b;font-size:11px;margin-left:4px">boa*</span></div>
  </div>
</div>
<div class="bt-section">
  <div class="bt-title">Comparativo rápido</div>
  <table class="bt-table">
    <tr><th>Aspecto</th><th>B-Tree</th><th>LSM-Tree</th></tr>
    <tr><td>Write latência</td><td class="mid">média (random I/O)</td><td class="good">baixa (sequencial)</td></tr>
    <tr><td>Read pontual</td><td class="good">excelente (1 lookup)</td><td class="mid">boa (bloom filter)</td></tr>
    <tr><td>Range scan</td><td class="good">excelente (linked leaves)</td><td class="mid">razoável</td></tr>
    <tr><td>Espaço em disco</td><td class="mid">fragmentação com tempo</td><td class="bad">write amplification</td></tr>
    <tr><td>Use when</td><td>leitura > escrita</td><td>escrita intensa</td></tr>
  </table>
</div>
</div>`,
      caption: "* Bloom filters tornam a leitura em LSM muito mais eficiente: evitam verificar SSTables que certamente não têm a chave.",
    },
    {
      title: "LSM-Tree: compactação e níveis",
      html: `<style>
.lsm-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.lsm-title { color: #DC382D; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; text-align: center; }
.lsm-flow { display: flex; flex-direction: column; gap: 8px; }
.lsm-level { display: flex; align-items: center; gap: 12px; }
.lsm-label { font-size: 11px; font-weight: 700; color: #64748b; min-width: 80px; text-align: right; }
.lsm-bar-wrap { flex: 1; display: flex; gap: 4px; }
.lsm-sstable { background: #DC382D; border-radius: 4px; padding: 4px 8px; font-size: 10px; font-weight: 700; color: #fff; font-family: 'JetBrains Mono', monospace; }
.lsm-mem { background: #22c55e; }
.lsm-l0 { opacity: 0.9; }
.lsm-l1 { opacity: 0.8; width: 60px; }
.lsm-l2 { opacity: 0.7; width: 80px; }
.lsm-l3 { opacity: 0.6; width: 100px; }
.lsm-arrow { font-size: 12px; color: #475569; }
.lsm-note { font-size: 11px; color: #64748b; min-width: 120px; }
.lsm-strategies { margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.lsm-strat { background: #1e293b; border-radius: 8px; padding: 12px; border-left: 3px solid; }
.lsm-st-size { border-color: #f59e0b; }
.lsm-st-level { border-color: #3b82f6; }
.lsm-strat-title { font-size: 11px; font-weight: 700; margin-bottom: 6px; }
.lsm-st-size .lsm-strat-title { color: #f59e0b; }
.lsm-st-level .lsm-strat-title { color: #3b82f6; }
.lsm-strat-row { font-size: 11px; color: #94a3b8; margin-bottom: 3px; }
</style>
<div class="lsm-wrap">
  <div class="lsm-title">Estrutura LSM-Tree e compactação</div>
  <div class="lsm-flow">
    <div class="lsm-level">
      <div class="lsm-label">memtable</div>
      <div class="lsm-bar-wrap">
        <div class="lsm-sstable lsm-mem">RAM ordenada</div>
      </div>
      <div class="lsm-arrow">→ flush</div>
      <div class="lsm-note">escrita aqui (O(1) amortizado)</div>
    </div>
    <div class="lsm-level">
      <div class="lsm-label">L0 (recente)</div>
      <div class="lsm-bar-wrap">
        <div class="lsm-sstable lsm-l0">SST1</div>
        <div class="lsm-sstable lsm-l0">SST2</div>
        <div class="lsm-sstable lsm-l0">SST3</div>
        <div class="lsm-sstable lsm-l0">SST4</div>
      </div>
      <div class="lsm-arrow">→ compacta</div>
      <div class="lsm-note">flushes recentes, pode sobrepor</div>
    </div>
    <div class="lsm-level">
      <div class="lsm-label">L1</div>
      <div class="lsm-bar-wrap">
        <div class="lsm-sstable lsm-l1">SST-A</div>
        <div class="lsm-sstable lsm-l1">SST-B</div>
        <div class="lsm-sstable lsm-l1">SST-C</div>
      </div>
      <div class="lsm-arrow">→ compacta</div>
      <div class="lsm-note">10x maior que L0</div>
    </div>
    <div class="lsm-level">
      <div class="lsm-label">L2</div>
      <div class="lsm-bar-wrap">
        <div class="lsm-sstable lsm-l2">SST-D</div>
        <div class="lsm-sstable lsm-l2">SST-E</div>
      </div>
      <div class="lsm-arrow">→ compacta</div>
      <div class="lsm-note">10x maior que L1</div>
    </div>
    <div class="lsm-level">
      <div class="lsm-label">L3+ (antigo)</div>
      <div class="lsm-bar-wrap">
        <div class="lsm-sstable lsm-l3">SST-F (grande)</div>
      </div>
      <div class="lsm-arrow"></div>
      <div class="lsm-note">dados mais antigos, mais compactados</div>
    </div>
  </div>
  <div class="lsm-strategies">
    <div class="lsm-strat lsm-st-size">
      <div class="lsm-strat-title">Size-tiered (Cassandra default)</div>
      <div class="lsm-strat-row">Mescla SSTables de tamanho similar</div>
      <div class="lsm-strat-row">+ Menos write amplification</div>
      <div class="lsm-strat-row">- Mais read amplification</div>
      <div class="lsm-strat-row">Bom para: write-heavy workloads</div>
    </div>
    <div class="lsm-strat lsm-st-level">
      <div class="lsm-strat-title">Leveled (RocksDB default)</div>
      <div class="lsm-strat-row">Mescla L(n) com L(n+1)</div>
      <div class="lsm-strat-row">+ Menos read amplification</div>
      <div class="lsm-strat-row">- Mais write amplification (10-30x)</div>
      <div class="lsm-strat-row">Bom para: leitura importante também</div>
    </div>
  </div>
</div>`,
      caption: "LSM-Tree lê da mais recente (memtable) até as mais antigas (Lx). Bloom filter por SSTable elimina leituras desnecessárias.",
    },
    {
      title: "Bloom Filter: como funciona",
      html: `<style>
.bf-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.bf-title { color: #a78bfa; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; text-align: center; }
.bf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.bf-sec { background: #1e293b; border-radius: 8px; padding: 14px; }
.bf-sec-title { font-size: 11px; font-weight: 700; margin-bottom: 10px; color: #a78bfa; text-transform: uppercase; letter-spacing: .05em; }
.bf-bits { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; }
.bf-bit { width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.bf-0 { background: #1e293b; border: 1.5px solid #334155; color: #475569; }
.bf-1 { background: rgba(167,139,250,0.2); border: 1.5px solid #a78bfa; color: #a78bfa; }
.bf-h { background: rgba(239,68,68,0.2); border: 1.5px solid #ef4444; color: #ef4444; }
.bf-desc { font-size: 11px; color: #94a3b8; line-height: 1.5; }
.bf-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; font-size: 12px; }
.bf-result-ok  { background: rgba(34,197,94,0.1); border: 1px solid #22c55e; color: #22c55e; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; }
.bf-result-bad { background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #ef4444; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; }
.bf-key { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #e2e8f0; background: #0f172a; padding: 2px 6px; border-radius: 3px; }
.bf-note { margin-top: 14px; background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.2); border-radius: 6px; padding: 10px 14px; font-size: 11px; color: #94a3b8; }
</style>
<div class="bf-wrap">
  <div class="bf-title">Bloom Filter — como funciona</div>
  <div class="bf-grid">
    <div class="bf-sec">
      <div class="bf-sec-title">Inserção (3 hash functions)</div>
      <div class="bf-desc" style="margin-bottom:10px">Inserir <span class="bf-key">user:1000</span>: aplica 3 hashes → seta bits 2, 5, 9</div>
      <div class="bf-bits">
        <div class="bf-bit bf-0">0</div><div class="bf-bit bf-0">1</div><div class="bf-bit bf-1">2</div>
        <div class="bf-bit bf-0">3</div><div class="bf-bit bf-0">4</div><div class="bf-bit bf-1">5</div>
        <div class="bf-bit bf-0">6</div><div class="bf-bit bf-0">7</div><div class="bf-bit bf-0">8</div>
        <div class="bf-bit bf-1">9</div><div class="bf-bit bf-0">10</div><div class="bf-bit bf-0">11</div>
      </div>
      <div class="bf-desc">Inserir <span class="bf-key">user:2001</span>: hashes → bits 1, 5, 7</div>
      <div class="bf-bits" style="margin-top:6px">
        <div class="bf-bit bf-0">0</div><div class="bf-bit bf-1">1</div><div class="bf-bit bf-1">2</div>
        <div class="bf-bit bf-0">3</div><div class="bf-bit bf-0">4</div><div class="bf-bit bf-1">5</div>
        <div class="bf-bit bf-0">6</div><div class="bf-bit bf-1">7</div><div class="bf-bit bf-0">8</div>
        <div class="bf-bit bf-1">9</div><div class="bf-bit bf-0">10</div><div class="bf-bit bf-0">11</div>
      </div>
    </div>
    <div class="bf-sec">
      <div class="bf-sec-title">Consulta — 3 casos</div>
      <div class="bf-row">
        <span class="bf-key">user:1000</span>
        <span style="color:#94a3b8;font-size:11px">→ bits 2,5,9 todos 1?</span>
        <span class="bf-result-ok">SIM — pode estar</span>
      </div>
      <div class="bf-desc" style="margin-bottom:8px;font-size:10px">False positive possível — abre SSTable para confirmar</div>
      <div class="bf-row">
        <span class="bf-key">user:9999</span>
        <span style="color:#94a3b8;font-size:11px">→ bits 3,8,11?</span>
        <span class="bf-result-bad">NÃO — ausente</span>
      </div>
      <div class="bf-desc" style="margin-bottom:8px;font-size:10px">False negative IMPOSSÍVEL — skip SSTable com certeza</div>
      <div class="bf-row">
        <span class="bf-key">user:3333</span>
        <span style="color:#94a3b8;font-size:11px">→ bits 1,5,9?</span>
        <span class="bf-result-ok">SIM — talvez</span>
      </div>
      <div class="bf-desc" style="font-size:10px">False positive — abre SSTable, mas chave não está lá</div>
    </div>
  </div>
  <div class="bf-note">
    <strong style="color:#a78bfa">Trade-off do Bloom filter:</strong> mais bits por chave = menos false positives, mais memória. RocksDB default: 10 bits/chave → ~1% false positive rate. Para key-miss lookup (chave não existe), o Bloom filter evita I/O em ~99% dos casos — enorme ganho em LSM-Tree.
  </div>
</div>`,
      caption: "Bloom filter = zero false negatives. 'Definitivamente não está aqui' → skip SSTable sem I/O. Essa garantia transforma read miss de O(n SSTables) para O(1).",
    },
  ],
  mnemonics: [
    {
      label: "B-Tree vs LSM-Tree — RL vs ES",
      trick: "R-ead L-ugar fixo (B-Tree) vs E-scrita S-equencial (LSM)",
      explanation: "B-Tree domina leitura (RL): traversal O(log n), 1 lookup, range scan com folhas doubly-linked. UPDATE modifica in-place (Lugar fixo) — random I/O. LSM domina Escrita Sequencial (ES): writes vão para memtable em RAM depois flush para SSTable — sequencial é muito mais rápido. SSTables imutáveis simplificam replicação.",
    },
    {
      label: "Bloom Filter — NFP",
      trick: "N-o False N-egatives, F-alse P-ositives ok",
      explanation: "A assimetria central: se Bloom diz 'NÃO está aqui', é 100% verdade — skip seguro do SSTable sem I/O. Se diz 'PODE estar', abre o SSTable para confirmar (false positive possível, custo baixo). Transforma read miss de O(n SSTables) para O(1). RocksDB default: 10 bits/chave = ~1% FP rate.",
    },
    {
      label: "Compactação LSM — STL",
      trick: "S-ize-tiered vs L-eveled (two strategies)",
      explanation: "Size-Tiered (Cassandra default): mescla SSTables de tamanho similar. Menos write amplification, mais read amplification — bom para write-heavy. Leveled (RocksDB default): L(n+1) = 10x L(n). Write amplification ~30x, mas read amplification baixo — bom quando leitura também importa. Você escolhe onde pagar.",
    },
  ],
  cheatsheet: {
    title: "B-Tree / LSM-Tree — Referência rápida",
    html: `<style>
.btc-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; }
.btc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.btc-sec { background: #1e293b; border-radius: 8px; padding: 14px; }
.btc-sec-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }
.btc-bt { color: #4169E1; }
.btc-lsm { color: #DC382D; }
.btc-bloom { color: #a78bfa; }
.btc-when { color: #22c55e; }
.btc-row { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 5px; font-size: 11px; }
.btc-key { font-family: 'JetBrains Mono', monospace; color: #e2e8f0; min-width: 130px; flex-shrink: 0; }
.btc-val { color: #94a3b8; }
</style>
<div class="btc-wrap">
  <div class="btc-grid">
    <div class="btc-sec">
      <div class="btc-sec-title btc-bt">B-Tree</div>
      <div class="btc-row"><span class="btc-key">Estrutura</span><span class="btc-val">Árvore balanceada, nó com M chaves, M+1 filhos</span></div>
      <div class="btc-row"><span class="btc-key">Busca</span><span class="btc-val">O(log n) — traversal da raiz até folha</span></div>
      <div class="btc-key btc-bt" style="font-size:10px;margin-bottom:3px;">Bom em:</div>
      <div class="btc-row"><span class="btc-val">Leitura pontual, range scan (folhas linkadas)</span></div>
      <div class="btc-row"><span class="btc-val">Update frequente sem write throughput extremo</span></div>
      <div class="btc-key btc-bt" style="font-size:10px;margin:4px 0 3px;">Exemplos:</div>
      <div class="btc-row"><span class="btc-val">Postgres (B+ Tree), MySQL InnoDB, SQLite</span></div>
    </div>
    <div class="btc-sec">
      <div class="btc-sec-title btc-lsm">LSM-Tree</div>
      <div class="btc-row"><span class="btc-key">Estrutura</span><span class="btc-val">memtable → SSTables imutáveis → compactação</span></div>
      <div class="btc-row"><span class="btc-key">Escrita</span><span class="btc-val">O(1) amortizado — sequencial em disco</span></div>
      <div class="btc-key btc-lsm" style="font-size:10px;margin-bottom:3px;">Bom em:</div>
      <div class="btc-row"><span class="btc-val">Write-heavy workloads (1M+ inserts/s)</span></div>
      <div class="btc-row"><span class="btc-val">SSDs — sequencial ainda vence random</span></div>
      <div class="btc-key btc-lsm" style="font-size:10px;margin:4px 0 3px;">Exemplos:</div>
      <div class="btc-row"><span class="btc-val">RocksDB, Cassandra, HBase, LevelDB, InfluxDB</span></div>
    </div>
    <div class="btc-sec">
      <div class="btc-sec-title btc-bloom">Bloom Filter</div>
      <div class="btc-row"><span class="btc-key">Garantia</span><span class="btc-val">Zero false negatives — "não está" é certo</span></div>
      <div class="btc-row"><span class="btc-key">False positives</span><span class="btc-val">Possíveis — "pode estar" abre SSTable para checar</span></div>
      <div class="btc-row"><span class="btc-key">Bits por chave</span><span class="btc-val">10 bits → ~1% FP (RocksDB default)</span></div>
      <div class="btc-row"><span class="btc-key">Impacto</span><span class="btc-val">Read miss: O(n SSTables) → O(1)</span></div>
    </div>
    <div class="btc-sec">
      <div class="btc-sec-title btc-when">Quando usar cada um</div>
      <div class="btc-row"><span class="btc-key">B-Tree</span><span class="btc-val">Leitura dominante, range queries, OLTP clássico</span></div>
      <div class="btc-row"><span class="btc-key">LSM</span><span class="btc-val">Escrita intensa, time-series, log/evento, IoT</span></div>
      <div class="btc-row"><span class="btc-key">Size-tiered</span><span class="btc-val">Cassandra — menos write amplification</span></div>
      <div class="btc-row"><span class="btc-key">Leveled</span><span class="btc-val">RocksDB — menos read amplification</span></div>
      <div class="btc-row"><span class="btc-key">Write amplification</span><span class="btc-val">B-Tree: 2-5x. LSM leveled: 10-30x</span></div>
    </div>
  </div>
</div>`,
  },
  mindmap: {
    title: "B-Tree / LSM-Tree — Mapa mental",
    html: `<style>
.btm-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.btm-header { text-align: center; margin-bottom: 20px; }
.btm-center { font-size: 14px; font-weight: 700; color: #e2e8f0; background: #1e293b; padding: 10px 20px; border-radius: 50px; display: inline-block; border: 1.5px solid #334155; }
.btm-container { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.btm-branch { background: #1e293b; border-radius: 10px; padding: 14px; border-top: 2.5px solid; }
.btm-b1 { border-color: #4169E1; }
.btm-b2 { border-color: #DC382D; }
.btm-b3 { border-color: #a78bfa; }
.btm-b4 { border-color: #22c55e; }
.btm-b5 { border-color: #f59e0b; }
.btm-b6 { border-color: #38bdf8; }
.btm-branch-title { font-size: 12px; font-weight: 700; margin-bottom: 8px; }
.btm-b1 .btm-branch-title { color: #4169E1; }
.btm-b2 .btm-branch-title { color: #DC382D; }
.btm-b3 .btm-branch-title { color: #a78bfa; }
.btm-b4 .btm-branch-title { color: #22c55e; }
.btm-b5 .btm-branch-title { color: #f59e0b; }
.btm-b6 .btm-branch-title { color: #38bdf8; }
.btm-leaf { font-size: 11px; color: #94a3b8; margin-bottom: 3px; padding-left: 10px; position: relative; }
.btm-leaf::before { content: '·'; position: absolute; left: 0; color: #475569; }
</style>
<div class="btm-wrap">
  <div class="btm-header"><div class="btm-center">B-Tree vs LSM-Tree</div></div>
  <div class="btm-container">
    <div class="btm-branch btm-b1">
      <div class="btm-branch-title">B-Tree</div>
      <div class="btm-leaf">Árvore balanceada O(log n)</div>
      <div class="btm-leaf">M chaves por nó</div>
      <div class="btm-leaf">Folhas doubly-linked</div>
      <div class="btm-leaf">Modificação in-place</div>
      <div class="btm-leaf">Random I/O em disco</div>
      <div class="btm-leaf">Postgres (B+ Tree)</div>
    </div>
    <div class="btm-branch btm-b2">
      <div class="btm-branch-title">LSM-Tree</div>
      <div class="btm-leaf">memtable (RAM, ordenada)</div>
      <div class="btm-leaf">SSTables imutáveis</div>
      <div class="btm-leaf">Flush sequencial</div>
      <div class="btm-leaf">Compactação em background</div>
      <div class="btm-leaf">Escrita O(1) amortizado</div>
      <div class="btm-leaf">RocksDB, Cassandra</div>
    </div>
    <div class="btm-branch btm-b3">
      <div class="btm-branch-title">Bloom Filter</div>
      <div class="btm-leaf">Zero false negatives</div>
      <div class="btm-leaf">False positives possíveis</div>
      <div class="btm-leaf">k funções de hash</div>
      <div class="btm-leaf">10 bits/chave = 1% FP</div>
      <div class="btm-leaf">Skip seguro de SSTable</div>
      <div class="btm-leaf">Read miss O(n) → O(1)</div>
    </div>
    <div class="btm-branch btm-b4">
      <div class="btm-branch-title">Tradeoffs</div>
      <div class="btm-leaf">Write amplification: B=2-5x, LSM=10-30x</div>
      <div class="btm-leaf">Read amplification: B=1, LSM=n SSTables</div>
      <div class="btm-leaf">Space amplification</div>
      <div class="btm-leaf">B-Tree: range scan excelente</div>
      <div class="btm-leaf">LSM: escrita sequencial excelente</div>
    </div>
    <div class="btm-branch btm-b5">
      <div class="btm-branch-title">Compactação LSM</div>
      <div class="btm-leaf">Size-tiered (Cassandra)</div>
      <div class="btm-leaf">Leveled (RocksDB)</div>
      <div class="btm-leaf">Leveled: menos read amp</div>
      <div class="btm-leaf">Size-tiered: menos write amp</div>
      <div class="btm-leaf">Tombstones para deletes</div>
    </div>
    <div class="btm-branch btm-b6">
      <div class="btm-branch-title">Quando usar</div>
      <div class="btm-leaf">B-Tree: OLTP, leitura heavy</div>
      <div class="btm-leaf">LSM: time-series, IoT, logs</div>
      <div class="btm-leaf">SSD: diferença menor</div>
      <div class="btm-leaf">Cassandra: write-heavy</div>
      <div class="btm-leaf">RocksDB: embarcado/edge</div>
    </div>
  </div>
</div>`,
  },
  exercises: [
    {
      title: "Implementar Bloom Filter simples em JavaScript",
      description: "Implemente um Bloom filter com k=3 funções de hash e m bits configurável. Demonstre que false negatives são impossíveis (inserir 100 chaves e verificar que todas retornam 'may exist') e medir a taxa de false positive com 10.000 consultas de chaves não inseridas.",
      level: "intermediario",
      concepts: ["bloom-filter", "probabilistic-structures", "hashing", "false-positive"],
    },
    {
      title: "Benchmark write throughput: B-Tree vs LSM",
      description: "Use Postgres e RocksDB (ou SQLite e LevelDB) para inserir 1 milhão de registros sequenciais e 1 milhão de registros com chaves aleatórias. Meça throughput (inserts/s) e latência P99 para cada combinação. Analise por que os resultados diferem.",
      level: "senior",
      concepts: ["benchmarking", "write-throughput", "b-tree", "lsm-tree", "io-patterns"],
    },
    {
      title: "Simular LSM-Tree com flush e compactação",
      description: "Implemente uma LSM-Tree simplificada: memtable (Map em memória), flush para 'SSTables' (arquivos JSON ordenados por chave), e compactação que mescla 2 SSTables em 1. Implemente get() que lê da memtable e SSTables em ordem de mais recente para mais antiga.",
      level: "senior",
      concepts: ["lsm-tree", "sstable", "memtable", "compaction", "merge-sort"],
    },
    {
      title: "Analisar plano de execução com índice B-Tree no Postgres",
      description: "Crie uma tabela com 1M linhas. Compare EXPLAIN ANALYZE de busca pontual vs range scan com e sem índice. Analise o custo de sequential scan vs index scan. Crie um índice composto e veja como ele afeta queries com diferentes colunas no WHERE.",
      level: "iniciante",
      concepts: ["b-tree", "postgresql", "explain-analyze", "index-scan", "range-scan"],
    },
  ],
  videos: [
    { title: "B-Trees and Database Indexes — Explained Simply", channel: "ByteByteGo", url: "https://www.youtube.com/watch?v=aZjYr87r1b8" },
    { title: "LSM Tree — Log Structured Merge Tree", channel: "Martin Kleppmann", url: "https://www.youtube.com/watch?v=I6jB0nM9SKU" },
    { title: "How databases store data on disk — B-tree vs Hash index", channel: "Hussein Nasser", url: "https://www.youtube.com/watch?v=9EHV4JcqlP4" },
    { title: "Bloom Filters — Your Cache Layer for Databases", channel: "Fireship", url: "https://www.youtube.com/watch?v=-SuTGoFYjZs" },
    { title: "RocksDB Explained — LSM Tree in Production", channel: "InfoQ", url: "https://www.youtube.com/watch?v=jGCv4r8CJEI" },
  ],
  resources: [
    { title: "DDIA — Chapter 3 (Storage Engines)", url: "https://dataintensive.net/", kind: "livro" },
    { title: "RocksDB — Compaction explained", url: "https://github.com/facebook/rocksdb/wiki/Compaction", kind: "docs" },
    { title: "Bloom Filters by Example", url: "https://llimllib.github.io/bloomfilter-tutorial/", kind: "pratica" },
    { title: "The Log-Structured Merge-Tree (paper original)", url: "https://www.cs.umb.edu/~poneil/lsmtree.pdf", kind: "artigo" },
    { title: "B-Tree visualizer — University of San Francisco", url: "https://www.cs.usfca.edu/~galles/visualization/BTree.html", kind: "pratica" },
    { title: "Cassandra Compaction Strategies", url: "https://cassandra.apache.org/doc/stable/cassandra/operating/compaction/", kind: "docs" },
  ],
  codeExamples: [
    {
      title: "Bloom Filter em JavaScript",
      language: "javascript",
      code: `class BloomFilter {
  constructor(size = 1000, hashFunctions = 3) {
    this.size = size
    this.bits = new Uint8Array(size)
    this.k = hashFunctions
  }

  // k funções de hash simples derivadas de 2 hashes base
  _hashes(key) {
    const h1 = this._fnv1a(key)
    const h2 = this._djb2(key)
    return Array.from({ length: this.k }, (_, i) =>
      Math.abs((h1 + i * h2) % this.size)
    )
  }

  _fnv1a(str) {
    let h = 0x811c9dc5
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i)
      h = (h * 0x01000193) >>> 0
    }
    return h
  }

  _djb2(str) {
    let h = 5381
    for (let i = 0; i < str.length; i++)
      h = ((h * 33) ^ str.charCodeAt(i)) >>> 0
    return h
  }

  add(key) {
    for (const pos of this._hashes(key))
      this.bits[pos] = 1
  }

  // Retorna false = definitivamente não existe (zero false negatives)
  // Retorna true  = provavelmente existe (false positives possíveis)
  mightContain(key) {
    return this._hashes(key).every(pos => this.bits[pos] === 1)
  }
}

// Uso
const bloom = new BloomFilter(10000, 3)
bloom.add('user:1000')
bloom.add('user:2001')

console.log(bloom.mightContain('user:1000')) // true (inserida)
console.log(bloom.mightContain('user:9999')) // false (definitivamente ausente)
// → skip SSTable com segurança — sem I/O de disco`
    },
    {
      title: "LSM-Tree simplificada em TypeScript",
      language: "typescript",
      code: `type KVPair = { key: string; value: string | null } // null = tombstone

class SimpleLSMTree {
  private memtable = new Map<string, string | null>()
  private sstables: KVPair[][] = [] // do mais recente ao mais antigo
  private readonly maxMemtableSize = 100

  set(key: string, value: string) {
    this.memtable.set(key, value)
    if (this.memtable.size >= this.maxMemtableSize) this.flush()
  }

  delete(key: string) {
    // LSM não deleta in-place — insere tombstone
    this.memtable.set(key, null)
    if (this.memtable.size >= this.maxMemtableSize) this.flush()
  }

  get(key: string): string | null | undefined {
    // 1. Procura na memtable (mais recente)
    if (this.memtable.has(key)) {
      const v = this.memtable.get(key)!
      return v === null ? undefined : v // tombstone = deleted
    }

    // 2. Procura nas SSTables do mais recente ao mais antigo
    // (Em produção: Bloom filter aqui para pular SSTables)
    for (const sstable of this.sstables) {
      const entry = sstable.find(e => e.key === key)
      if (entry) return entry.value === null ? undefined : entry.value
    }

    return undefined
  }

  private flush() {
    // Converte memtable para SSTable ordenada
    const sorted: KVPair[] = [...this.memtable.entries()]
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => a.key.localeCompare(b.key))

    this.sstables.unshift(sorted) // mais recente primeiro
    this.memtable.clear()

    // Compacta se muitas SSTables (simplificado)
    if (this.sstables.length >= 4) this.compact()
  }

  private compact() {
    // Mescla as 2 SSTables mais antigas
    const last = this.sstables.pop()!
    const secondLast = this.sstables.pop()!
    const merged = this.mergeSSTables(last, secondLast)
    this.sstables.push(merged)
  }

  private mergeSSTables(older: KVPair[], newer: KVPair[]): KVPair[] {
    const seen = new Set<string>()
    const result: KVPair[] = []
    // newer tem prioridade (mais recente ganha)
    for (const entry of [...newer, ...older]) {
      if (!seen.has(entry.key)) {
        seen.add(entry.key)
        if (entry.value !== null) result.push(entry) // descarta tombstones
      }
    }
    return result.sort((a, b) => a.key.localeCompare(b.key))
  }
}

const lsm = new SimpleLSMTree()
lsm.set('user:1', 'Alice')
lsm.set('user:2', 'Bob')
lsm.delete('user:1') // tombstone
console.log(lsm.get('user:1')) // undefined
console.log(lsm.get('user:2')) // 'Bob'`
    },
    {
      title: "Análise de write amplification — comparativo",
      language: "sql",
      code: `-- B-Tree: cada UPDATE modifica a árvore in-place
-- 1 dado de entrada → ~2-5 páginas escritas (dado + metadados de índice)
BEGIN;
UPDATE orders SET status = 'shipped' WHERE id = 12345;
-- Postgres:
--   1. Cria nova versão da tupla (MVCC)
--   2. Atualiza índice (random I/O)
--   3. Atualiza visibility map
-- Write amplification: ~2-5x
COMMIT;

-- LSM-Tree: escrita sempre sequencial (RocksDB/Cassandra)
-- Cada write vai para memtable primeiro
-- Depois flush para SSTable (sequencial)
-- Compactação pode escrever o dado 10-30x no total

-- Para ver index activity no Postgres:
SELECT
  schemaname,
  tablename,
  indexname,
  idx_blks_hit,
  idx_blks_read
FROM pg_statio_user_indexes
WHERE tablename = 'orders';

-- Write amplification real do B-Tree no Postgres:
-- n_tup_upd = total updates
-- n_tup_hot_upd = HOT updates (sem index write)
-- HOT ratio = n_tup_hot_upd / n_tup_upd (quanto mais, melhor)
SELECT
  relname,
  n_tup_upd,
  n_tup_hot_upd,
  round(100.0 * n_tup_hot_upd / NULLIF(n_tup_upd, 0), 1) AS hot_ratio_pct
FROM pg_stat_user_tables
WHERE relname = 'orders';`
    },
  ],
  interview: [
    {
      q: "Por que Cassandra usa LSM-Tree?",
      a: "<p>Cassandra é otimizado para escrita intensiva em escala. LSM-Tree escreve sequencialmente em disco (muito mais rápido que random write do B-Tree), depois compacta em background. Para workloads onde escrita domina e leitura pode ter um pouco mais de latência, LSM-Tree vence claramente.</p><p>A imutabilidade das SSTables também facilita replicação e compressão. Cassandra não tem UPDATE in-place — escrita sempre é append, e a reconciliação acontece na compactação com tombstones e timestamps.</p>",
      level: "senior",
    },
    {
      q: "Quando B-Tree é melhor que LSM-Tree?",
      a: "<p>Leitura pesada e update frequente: B-Tree tem melhor latência de leitura pontual (uma árvore vs múltiplos SSTables). Range scan: B-Tree tem doubly-linked leaves, muito eficiente para ORDER BY com LIMIT.</p><p>LSM-Tree brilha em write-heavy workloads onde throughput de escrita é crítico e pode-se tolerar reads ligeiramente mais lentos. Também é melhor para SSDs — I/O sequencial é muito mais rápido que random em NVMe.</p>",
      tip: "Mencionar que SSDs mudam o cálculo (random I/O em SSD não é tão pior que sequencial) demonstra profundidade.",
      level: "senior",
    },
    {
      q: "O que é write amplification e onde ocorre?",
      a: "<p>Write amplification é a razão entre bytes escritos em disco e bytes de dados de entrada. Em B-Tree: ~2-5x (escreve o dado e atualiza metadados do índice). Em LSM-Tree: ~10-30x porque o dado é escrito na memtable, no flush inicial e em cada nível de compactação.</p><p>Leveled compaction (RocksDB) tem write amplification maior que size-tiered (Cassandra default) mas read amplification muito menor — é o tradeoff de compaction strategy.</p>",
      level: "senior",
    },
    {
      q: "Como Bloom filter ajuda na leitura de LSM-Tree?",
      a: "<p>Bloom filter é uma estrutura probabilística que responde 'esta chave definitivamente não está neste SSTable' ou 'esta chave provavelmente está aqui'. False negatives são impossíveis — se o filter diz não está, a chave com certeza não está e não precisa abrir o SSTable.</p><p>Isso transforma read miss de O(n) SSTables para O(1) na maioria dos casos. O tamanho do filter (bits per key) controla a taxa de false positives. RocksDB e Cassandra configuram bits por chave para balancear memória vs eficiência.</p>",
      level: "senior",
    },
    {
      q: "Explique a estrutura de um B+ Tree e por que o Postgres o usa em vez de B-Tree clássico.",
      a: "<p>B+ Tree: todos os dados ficam nas folhas, nós internos contêm apenas chaves de roteamento. As folhas são ligadas por ponteiros doubly-linked formando uma lista ordenada.</p><p>Vantagem para Postgres: range scans são muito eficientes — ao encontrar o início do range, basta seguir os ponteiros das folhas sem retornar ao nó raiz. Queries como ORDER BY id BETWEEN 100 AND 200 se tornam um scan linear das folhas, muito mais rápido que B-Tree clássico onde dados ficam em todos os nós.</p>",
      tip: "A distinção 'dados só nas folhas' é o ponto técnico central. Quem sabe explicar isso demonstra que entendeu a estrutura, não só o nome.",
      level: "senior",
    },
    {
      q: "Como LSM-Tree trata deletes?",
      a: "<p>LSM-Tree não deleta in-place. DELETE insere um tombstone — um marcador especial (chave + flag de deleção) na memtable. Quando o tombstone chega a uma SSTable via flush e depois é compactado com SSTables mais antigas que contêm a chave, o dado é removido na compactação.</p><p>Problema: tombstones acumulam se não houver compactação suficiente, e a chave 'deletada' pode ser relida de SSTables antigas antes da compactação limpar. É por isso que configurar compaction corretamente é crítico em Cassandra com alto volume de deletes.</p>",
      tip: "Mencionar o problema de tombstones acumulando é o insight operacional que diferencia teoria de prática em Cassandra.",
      level: "senior",
    },
    {
      q: "Qual a diferença entre size-tiered e leveled compaction?",
      a: "<p>Size-tiered (Cassandra default): mescla SSTables de tamanho similar quando há suficientes. Menor write amplification, maior read amplification (pode ter muitas SSTables para consultar). Bom para write-heavy.</p><p>Leveled (RocksDB default): mantém SSTables em níveis onde L(n+1) é 10x maior que L(n). Write amplification maior (~10-30x), mas garante poucas SSTables por nível — leitura muito mais previsível. Bom quando leitura também importa.</p>",
      tip: "O número '10x entre níveis' é o detalhe que mostra conhecimento do RocksDB real, não só da teoria.",
      level: "senior",
    },
    {
      q: "O que é read amplification em LSM-Tree e como mitigar?",
      a: "<p>Read amplification é o número de operações de I/O necessárias para uma leitura. Em LSM-Tree, para buscar uma chave, o sistema verifica: memtable + cada nível de SSTable do mais recente ao mais antigo. No pior caso (chave não existe), verifica todos os SSTables.</p><p>Mitigações: (1) Bloom filter — skip de SSTables com certeza. (2) Leveled compaction — mantém poucas SSTables por nível. (3) Block cache — SSTables quentes ficam em RAM.</p>",
      tip: "A tríade bloom + leveled + block cache é a stack de otimização de leitura do RocksDB — citá-la mostra que você conhece o sistema em produção.",
      level: "senior",
    },
    {
      q: "Como RocksDB é usado como base para outros bancos?",
      a: "<p>RocksDB (LSM-Tree da Meta) é uma storage engine embarcável usada como base por: MyRocks (MySQL + RocksDB, melhor para write-heavy que InnoDB), TiKV (storage layer do TiDB, banco NewSQL distribuído), CockroachDB, YugabyteDB, Pebble (CockroachDB's fork para performance), InfluxDB IOx.</p><p>A ideia é 'plugar' uma storage engine LSM otimizada embaixo de bancos que precisam de write throughput alto, mantendo as garantias de transação do banco acima.</p>",
      tip: "Citar TiKV/TiDB mostra conhecimento de sistemas distribuídos modernos — diferencial além de 'conheço RocksDB'.",
      level: "senior",
    },
    {
      q: "Por que SSDs mudam o tradeoff B-Tree vs LSM-Tree?",
      a: "<p>HDDs: random I/O é ~100x mais lento que sequencial — enorme vantagem para LSM (escrita sequencial). SSDs/NVMe: random I/O é apenas 2-5x mais lento que sequencial — a vantagem do LSM diminui significativamente.</p><p>Resultado: em SSDs, B-Tree perde menos terreno para LSM em write performance. Workloads de leitura intensa em SSD ficam ainda mais favoráveis ao B-Tree. Por isso Postgres em NVMe performa muito bem mesmo sendo B-Tree.</p>",
      tip: "A especificidade 'NVMe vs HDD' muda o cálculo de forma mensurável — quem sabe isso pensou além do 'B-Tree para leitura, LSM para escrita'.",
      level: "senior",
    },
    {
      q: "O que é space amplification em B-Tree e como controlar?",
      a: "<p>B-Tree acumula fragmentação com updates — páginas com espaço desperdiçado entre as chaves (dead space). PostgreSQL chama isso de bloat. FILLFACTOR controla quanto espaço livre deixar em cada página: default 90%, para tabelas com muitos UPDATEs pode ser útil 70-80% para suportar HOT updates (update in-place sem criação de nova versão de índice).</p><p>VACUUM FULL ou pg_repack para recuperar espaço. Em MySQL InnoDB, OPTIMIZE TABLE. B-Tree não tem write amplification alta como LSM, mas tem space amplification diferente.</p>",
      tip: "FILLFACTOR e HOT updates no Postgres é o detalhe de DBA que mostra que você administrou bancos B-Tree em produção, não só estudou a teoria.",
      level: "senior",
    },
    {
      q: "Como uma busca ocorre no B-Tree vs LSM-Tree passo a passo?",
      a: "<p>B-Tree: root → nó interno 1 (comparar chave, ir para filho correto) → ... → folha (encontrar chave ou confirmar ausência). Sempre O(log n) passos, sempre 1 caminho. Simples e previsível.</p><p>LSM-Tree: (1) memtable (hash/sorted map em RAM — O(log M)); (2) para cada SSTable do mais recente ao mais antigo: (a) consultar Bloom filter — se 'definitivamente não está', pula; (b) binary search no índice da SSTable; (c) ler o bloco de disco. Retorna o valor da versão mais recente encontrada.</p>",
      tip: "Detalhar o 'Bloom filter primeiro, depois binary search no índice' mostra que você entende a implementação real, não só o conceito.",
      level: "pleno",
    },
    {
      q: "Qual a taxa de false positive ideal para um Bloom filter em LSM?",
      a: "<p>Depende do trade-off memória vs I/O. Com m bits e k hashes, false positive rate ≈ (1 - e^(-kn/m))^k onde n = número de chaves. RocksDB default: 10 bits por chave → ~1% FP rate. Para workloads com muita leitura de chaves não existentes (key-miss dominant), vale aumentar para 20 bits/chave → 0.01% FP.</p><p>A fórmula do k ótimo: k = (m/n) * ln(2). Com 10 bits/chave, k ≈ 7 hashes é o ótimo.</p>",
      tip: "Dar a fórmula k = (m/n) * ln(2) e mencionar que RocksDB permite configurar bits_per_key é o nível de detalhe que impressiona em entrevistas de sistemas de banco de dados.",
      level: "senior",
    },
    {
      q: "Como você escolheria entre Postgres e Cassandra para um sistema de métricas?",
      a: "<p>Métricas: alta escrita (milhões de pontos/s), leitura por range temporal (últimas 24h), sem updates frequentes. → Cassandra (LSM-Tree) vence.</p><p>Razões: (1) Cassandra é otimizado para write throughput — LSM escreve sequencialmente. (2) Modelo de dados de métricas (time + tags + value) mapeia bem para partition key (sensor_id) + clustering key (timestamp). (3) Sem JOINs complexos em métricas. Alternativa: InfluxDB (LSM), TimescaleDB (extensão do Postgres com hypertables — usa B-Tree mas particiona por tempo, reduzindo impacto do random I/O).</p>",
      tip: "Mencionar TimescaleDB como meio-termo inteligente (Postgres + particionamento temporal) mostra que você pensa em trade-offs reais, não apenas na divisão binária B-Tree vs LSM.",
      level: "senior",
    },
    {
      q: "O que é memtable e como ela afeta durabilidade no LSM-Tree?",
      a: "<p>Memtable é a estrutura in-memory (sorted map/skiplist) onde todas as escritas do LSM vão primeiro. Problema: se o processo cair antes do flush, os dados da memtable são perdidos.</p><p>Solução: WAL (Write-Ahead Log) — cada write é primeiro appendado ao WAL (durável em disco) e depois na memtable. Se crashar, o WAL é replayed para reconstruir a memtable. RocksDB e Cassandra usam WAL. O WAL é escrita sequencial (rápido) — não afeta o throughput da memtable.</p>",
      tip: "A conexão memtable → WAL → durabilidade é o link que muitos perdem. Sem WAL, LSM-Tree não teria garantias de durabilidade — não seria um banco de dados.",
      level: "senior",
    },
    {
      q: "Quais são as limitações do Bloom filter?",
      a: "<p>(1) Não suporta delete — uma vez que um bit é setado, não dá para dessetar sem risco de false negatives. Solução: Counting Bloom filter (cada 'bit' é um contador). (2) False positives aumentam com o preenchimento — se inserir muito mais chaves do que o filtro foi dimensionado, a taxa de FP sobe. (3) Tamanho fixo — não redimensiona dinamicamente. (4) Não retorna a chave — é apenas um oráculo de presença/ausência.</p>",
      tip: "A limitação de 'não suporta delete diretamente' é a menos óbvia e a que diferencia quem entende a estrutura profundamente.",
      level: "senior",
    },
    {
      q: "Como o WAL difere entre B-Tree e LSM-Tree?",
      a: "<p>B-Tree (Postgres): WAL registra as mudanças nas páginas da árvore — quando um nó é modificado, a página antes e depois vai para o WAL. WAL serve para recovery (crash) e replicação. A tabela em si pode ter random write.</p><p>LSM-Tree (RocksDB): WAL registra as operações da memtable — simples append de (key, value, op). Flush para SSTable é determinístico a partir da memtable. WAL serve para recovery; a SSTable é sequencial por design.</p><p>Ambos usam WAL para durabilidade, mas a estrutura dos registros é diferente.</p>",
      tip: "Comparar WAL do Postgres com WAL do RocksDB mostra visão sistêmica — não só 'cada um tem WAL' mas 'o que cada WAL registra'.",
      level: "senior",
    },
    {
      q: "O que é read-your-own-writes consistency e como LSM-Tree mantém?",
      a: "<p>Read-your-own-writes: após escrever, qualquer leitura posterior deve ver o que você escreveu — mesmo que não tenha sido persistido ainda. Em LSM-Tree, isso é garantido porque a leitura sempre começa pela memtable (mais recente). Se você escreveu 'user:1 = Alice', a memtable tem essa entrada e qualquer get('user:1') a retorna imediatamente — antes mesmo do flush para SSTable.</p>",
      tip: "A garantia 'lê da memtable primeiro' é a implementação de read-your-own-writes em LSM. É elegante e direto — boa resposta para mostrar que você conecta conceitos de consistência com implementação.",
      level: "pleno",
    },
    {
      q: "Qual a diferença entre B-Tree e Hash Index no contexto de banco de dados?",
      a: "<p>B-Tree: suporta busca pontual E range scan (BETWEEN, >, <, ORDER BY). Custo O(log n). Postgres cria B-Tree por default.</p><p>Hash Index: suporta apenas busca pontual (igualdade: WHERE id = 5). Custo O(1) mas sem range. Postgres tem hash index (CREATE INDEX ... USING HASH) mas raramente vale — B-Tree O(log n) é tão rápido que O(1) do hash não é diferencial prático, e você perde o range scan.</p><p>Hash index brilha em in-memory DBs (Redis hash tables) onde O(1) importa mais e range scan é menos comum.</p>",
      tip: "Mencionar que Postgres tem hash index mas B-Tree costuma ser melhor na prática é o insight que mostra experiência real — não é teoria abstrata.",
      level: "pleno",
    },
    {
      q: "O que acontece com performance de B-Tree quando o índice não cabe em RAM?",
      a: "<p>B-Tree com altura h precisa de h page reads para chegar à folha. Em RAM (buffer pool do Postgres): a maioria dos nós internos fica cacheada — na prática, apenas 1-2 leituras de disco (só as folhas). Se o índice não cabe em RAM: todos os h nós precisam de I/O → random I/O caro, performance cai drasticamente.</p><p>Regra prática: shared_buffers no Postgres deve ser suficiente para os índices mais usados. Monitorar pg_statio_user_indexes — se idx_blks_read alto, o índice está sendo lido do disco frequentemente.</p>",
      tip: "A conexão 'tamanho do shared_buffers → quantos nós do B-Tree ficam em cache → quantos I/Os por query' é o raciocínio de tuning que diferencia DBA sênior.",
      level: "senior",
    },
  ],
  gotchas: [
    "LSM-Tree não tem vantagem em leitura — múltiplos SSTable lookups são mais lentos que B-Tree para ponto único sem bloom filter bem calibrado.",
    "Compactação do LSM consome I/O — em carga pesada, compactação compete com queries. Monitore compaction lag no RocksDB/Cassandra.",
    "B-Tree com muitos updates em hot row — fragmentação e bloat. FILLFACTOR menor (ex: 70) deixa espaço para updates in-place.",
    "Bloom filter com false positive rate alto — ajuste bits per key para balancear memória vs precisão (mais bits = menos false positives).",
    "Tombstones no LSM não são limpos até a compactação — delete de muito dado sem compactação cria um acúmulo de tombstones que degrada performance de leitura.",
  ],
}

export default bTreeLsmTree
