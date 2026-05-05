import type { SkillContent } from '@/types'

const bTreeLsmTree: SkillContent = {
  tagline: "Estruturas de índice: B-Tree (leitura otimizada) vs LSM-Tree (escrita otimizada).",
  why: "B-Tree é o padrão em Postgres/MySQL. LSM-Tree é o segredo de RocksDB, Cassandra, LevelDB. Saber o tradeoff explica por que esses bancos existem e quando usar cada um.",
  summary: "B-Tree é uma árvore balanceada auto-ajustável. Nós têm múltiplas chaves; busca O(log n), insert/update O(log n) com rebalanceamento in-place. Excelente para leitura, update frequente é caro (random I/O). LSM-Tree (Log-Structured Merge Tree) escreve em memtable (sequencial), faz flush para SSTables imutáveis, compacta em background. Escrita O(1) amortizado; leitura mais cara (múltiplos SSTables).\n\nBloom filters são o enabler da leitura eficiente em LSM: dizem 'definitivamente não está aqui' com 100% de precisão (zero false negatives), evitando I/O desnecessário na maioria das leituras miss. A compactação periódica reduz o número de SSTables, melhorando leitura ao custo de write amplification.",
  keypoints: [
    { title: "B-Tree: estrutura", body: "Árvore de altura O(log n). Cada nó tem M chaves e M+1 filhos. Folhas são doubly-linked para range scan. Postgres usa variante B+ Tree (dados só nas folhas, melhora range scan)." },
    { title: "B-Tree: tradeoffs", body: "Leitura: muito boa (busca pontual, range). Update: bom mas random write no disco (write amplification). Fragmentação e VACUUM/reindex necessários com tempo." },
    { title: "LSM-Tree: estrutura", body: "Writes vão para memtable (in-memory, ordenada). Quando cheia, flush imutável para SSTable em disco. Múltiplas SSTables por nível. Compactação periódica mescla e ordena." },
    { title: "LSM-Tree: tradeoffs", body: "Escrita: excelente (sequencial, baixa latência). Leitura: mais cara (verifica múltiplas SSTables). Bloom filter otimiza: 'essa chave existe neste SSTable?' com alta precisão e custo mínimo." },
    { title: "Bloom Filter", body: "Estrutura probabilística: diz 'definitivamente não está aqui' (false negative impossível) ou 'provavelmente está aqui' (false positive possível). Economiza I/O em LSM evitando leitura de SSTables desnecessárias." },
    { title: "Compactação", body: "LSM-Tree tem write amplification na compactação (dado escrito várias vezes). Strategies: size-tiered (Cassandra default, menos I/O de compactação) vs leveled (RocksDB default, menos read amplification)." },
    { title: "Uso em bancos", body: "B-Tree: Postgres, MySQL (InnoDB), SQLite. LSM-Tree: RocksDB (base do MyRocks, TiKV, PebbleDB), Cassandra, HBase, LevelDB, InfluxDB." },
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
  ],
  gotchas: [
    "LSM-Tree não tem vantagem em leitura — múltiplos SSTable lookups são mais lentos que B-Tree para ponto único sem bloom filter bem calibrado.",
    "Compactação do LSM consome I/O — em carga pesada, compactação compete com queries. Monitore compaction lag no RocksDB/Cassandra.",
    "B-Tree com muitos updates em hot row — fragmentação e bloat. FILLFACTOR menor (ex: 70) deixa espaço para updates in-place.",
    "Bloom filter com false positive rate alto — ajuste bits per key para balancear memória vs precisão (mais bits = menos false positives).",
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
  ],
  resources: [
    { title: "DDIA — Chapter 3 (Storage Engines)", url: "https://dataintensive.net/", kind: "livro" },
    { title: "RocksDB — Compaction explained", url: "https://github.com/facebook/rocksdb/wiki/Compaction", kind: "docs" },
  ],
}

export default bTreeLsmTree
