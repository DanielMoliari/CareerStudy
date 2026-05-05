import type { SkillContent } from "@/types"

const consistentHashing: SkillContent = {
    tagline: "Algoritmo pra mapear chaves a nodes minimizando rehash quando cluster muda.",
    why: "Base de DynamoDB, Cassandra, Memcached, CDNs, load balancers. Senior precisa explicar virtual nodes, ring topology e por que hash módulo não escala.",
    summary: "Hash módulo (key % N) é simples mas remap massivo quando N muda — adicionar 1 node remap quase tudo. Consistent hashing mapeia keys e nodes em ring (0 a 2^32). Cada key vai pro próximo node no ring no sentido horário. Adicionar/remover node remap só 1/N keys. Virtual nodes (vnodes) balanceiam carga e suavizam falhas.",
    keypoints: [
      { title: "Problema do hash módulo", body: "hash(k) % N. Mudar N inválida quase todo cache/sharding. Em N=3 -> N=4, ~75%% das keys remapeam." },
      { title: "Ring", body: "Espaco hash circular (ex: 0 a 2^32-1). Cada node tem hash(node_id), key vai pro próximo node horario." },
      { title: "Adicionar node", body: "Soh keys entre node anterior e o novo migram. Resto fica. Reduz rehash de O(N) pra O(K/N)." },
      { title: "Virtual nodes", body: "Cada node físico tem M tokens no ring (100-256 tipico). Distribuição mais uniforme, falha de um node redistribui carga entre varios." },
      { title: "Replicação", body: "Em DynamoDB/Cassandra, key vai pro primeiro node + N-1 seguintes no ring. R+W>N pra consistencia tunable." },
      { title: "Hot keys", body: "Consistent hashing não resolve hot key (uma chave com trafego desproporcional). Usa cache local, replicas extras ou sharding por sub-chave." },
      { title: "Jump consistent hash", body: "Algoritmo do Google sem ring. Mais rápido, mas adiciona node soh no fim. Bom pra cluster com crescimento monotonic." },
      { title: "Rendezvous hashing (HRW)", body: "Alternativa: para cada (key, node) calcula hash; pega node com maior. Sem ring, mas O(N) por lookup." },
    ],
    gotchas: [
      "Hash módulo simples explode em rehash quando cluster cresce.",
      "Sem virtual nodes, distribuição fica desigual — alguns nodes 2x mais carga.",
      "Hot key derruba o node responsável — precisa estrategia adicional.",
      "Ring pequeno (2^16) gera colisoes em cluster grande.",
      "Comparar consistent hashing com sharding por range — são trade-offs (range permite sequential scan, hashing não).",
      "Esquecer que adicionar node migra dados — em DBs é operação cara, fazer com cuidado.",
      "Inconsistent vs consistent — confundir com CAP \"consistency\". São temas diferentes.",
    ],
    interview: [
      { q: "Por que não usar hash módulo simples?", a: "<p>Quando N (número de nodes) muda, quase TODAS as keys remapeiam. Ex: cache distribuido de 10 nodes -> escalar pra 11 inválida ~91%% do cache. Tempestade de cache miss derruba o backend.</p><p>Consistent hashing reduz pra 1/N (~9%%). Diferenca de ordem de magnitude.</p>" },
      { q: "Como funciona o ring?", a: "<p>Espaco hash circular (0 a 2^32). Cada node tem hash(node_id) -> posição no ring. Cada key também -> posição. Key vai pro primeiro node no sentido horário.</p><p>Adicionar node N: soh as keys entre o predecessor e N migram pra N. O resto fica.</p>" },
      { q: "Por que virtual nodes?", a: "<p>Sem vnodes, hash de N nodes pode cair desigual no ring — alguns node ganha 2x mais espaco. Distribuição desbalanceada.</p><p>Com vnodes, cada node ocupa M=100-256 posições pseudoaleatorias. Distribuição uniforme. Bonus: quando node falha, sua carga distribui entre varios outros (não soh o vizinho).</p>" },
      { q: "Como faz replicação com consistent hashing?", a: "<p>Padrão DynamoDB/Cassandra: key vai pro node X (primeiro no ring). Réplicas vão pros N-1 próximos. Tipicamente N=3.</p><p>Read: contata R nodes, leitor compara versões. Write: W nodes confirmam. Consistencia: R+W>N garante read ve última write.</p>" },
      { q: "Como lida com hot key?", a: "<p>Consistent hashing não resolve sozinho. Estrategias:</p><ul><li><strong>Cache local</strong> antes de hit no node (Redis local, in-memory).</li><li><strong>Replicas extras</strong> pra hot keys conhecidos.</li><li><strong>Sub-sharding</strong>: hash(key + counter) pra distribuir.</li><li><strong>Detect e isolar</strong>: monitora top-k keys, trata especialmente.</li></ul>" },
      { q: "Onde você já viu consistent hashing em produção?", a: "<ul><li>Memcached client (Ketama).</li><li>DynamoDB partition key.</li><li>Cassandra token ring.</li><li>CDN Akamai/Cloudflare pra escolher edge.</li><li>Service mesh load balancing por session.</li></ul>" },
    ],
    resources: [
      { title: "Karger et al — Consistent Hashing paper", url: "https://www.akamai.com/site/en/documents/research-paper/consistent-hashing-and-random-trees-distributed-caching-protocols-for-relieving-hot-spots-on-the-world-wide-web-technical-publication.pdf", kind: "artigo" },
      { title: "High Scalability — Consistent Hashing", url: "https://highscalability.com/consistent-hashing-algorithm/", kind: "artigo" },
      { title: "Designing Data-Intensive Applications (Kleppmann)", url: "https://dataintensive.net/", kind: "livro" },
      { title: "Toptal — Consistent Hashing explained", url: "https://www.toptal.com/big-data/consistent-hashing", kind: "artigo" },
      { title: "Jump Consistent Hash paper", url: "https://arxiv.org/abs/1406.2294", kind: "artigo" },
    ],
    diagram: "consistent-hashing",
  }

export default consistentHashing
