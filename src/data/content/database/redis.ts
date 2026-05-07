import type { SkillContent } from '@/types'

const redis: SkillContent = {
  tagline: "Store in-memory chave-valor: cache, filas, pub/sub, rate limiting, session, leaderboard.",
  why: "Redis é onipresente em stack de produção. Saber estruturas de dados, persistência, cluster e patterns (cache-aside, pub/sub, Lua scripting) é essencial para qualquer backend.",
  summary: "Redis é um store in-memory que suporta múltiplas estruturas de dados: string, hash, list, set, sorted set, stream, HyperLogLog, bitmap, geoespacial. Latência sub-milissegundo em leituras. Persistência via RDB (snapshot) ou AOF (append-only log). Cluster para sharding horizontal. Sentinel para HA. Redis Stack adiciona JSON, search e time séries.\n\nO modelo single-threaded do Redis garante atomicidade de comandos individuais sem locks. Para operações compostas, use MULTI/EXEC (transação otimista com WATCH) ou Lua scripts — que executam atomicamente. Evite operações O(N) como KEYS *, SMEMBERS em sets grandes ou LRANGE em lists longas.",
  keypoints: [
    { title: "Estruturas de dados", body: "String (KV simples, contadores), Hash (objeto), List (LPUSH/RPOP — fila ou stack), Set (conjunto único), Sorted Set (ranking por score), Stream (log de eventos, consumer groups)." },
    { title: "Atomicidade e Lua", body: "Comandos individuais são atômicos. MULTI/EXEC para transação otimista com WATCH. Lua scripts executam atomicamente (melhor para lógica complexa que precisa de múltiplos comandos atômicos)." },
    { title: "Persistência", body: "RDB: snapshot periódico. Compacto, rápido para restore, pode perder dados entre snapshots. AOF: log de cada operação. Mais durável, arquivo maior. Hybrid: RDB + AOF para melhor dos dois mundos." },
    { title: "Eviction policies", body: "allkeys-lru, volatile-lru, allkeys-random, noeviction. Define o que acontece quando memória fica cheia. Para cache puro: allkeys-lru. Para mix de dados persistentes e cache: volatile-lru." },
    { title: "Pub/Sub", body: "PUBLISH channel message. SUBSCRIBE channel. Mensagens não persistidas — subscriber offline perde. Para persistência e consumer groups, use Stream com XADD/XREADGROUP." },
    { title: "Redis Cluster", body: "16.384 hash slots distribuídos entre masters. Cada master tem réplicas. Client faz MOVED redirect para slot correto. Sem suporte a multi-key em slots diferentes sem hash tags." },
    { title: "Patterns", body: "Cache-aside, session store, rate limiter (INCR + EXPIRE), distributed lock (SET key NX EX), leaderboard (Sorted Set ZADD/ZRANK), job queue (List ou Stream), pub/sub event bus." },
  ],
  gotchas: [
    "Sem persistência configurada — restart perde tudo. Configure RDB ou AOF conforme SLA de perda de dados.",
    "KEYS * em produção — O(N), bloqueia Redis single-threaded por segundos em instâncias grandes. Use SCAN com cursor.",
    "SET sem TTL para cache — memória cresce indefinidamente até atingir maxmemory e ativar eviction.",
    "Multi-key operation no Cluster — keys em slots diferentes falham. Use hash tags {user}:profile, {user}:cart para garantir mesmo slot.",
    "Lua script longo — bloqueia Redis. Mantenha scripts atômicos e rápidos; não faça loops com muitas iterações.",
    "Pub/Sub sem subscriber — mensagem perdida silenciosamente. Use Stream para durabilidade e replay.",
    "INCR/DECR em valor não-inteiro — retorna ERR. Garanta que a chave contém apenas inteiros ou use HINCRBYFLOAT para floats.",
    "EXPIRE sobrescrito por SET — SET key val redefine o TTL para nenhum. Use SET key val EX seconds ou SET + KEEPTTL.",
  ],

  interview: [
    {
      q: "Como implementaria distributed lock com Redis?",
      a: "<p><b>SET lock_key unique_value NX EX 30</b> — atomic check-and-set com TTL. <code>NX</code> garante que só um cliente adquire. <code>EX 30</code> evita deadlock se o holder morrer.</p><p><b>Release seguro:</b> script Lua verifica valor antes de apagar, evitando liberar lock de outro cliente que adquiriu após TTL expirar:<br><code>if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end</code></p><p><b>Alta disponibilidade — Redlock:</b> algoritmo oficial com N instâncias ímpares (≥3). Lock adquirido quando maioria confirma em tempo &lt; TTL/2. Protege contra failover de uma instância.</p>",
      level: "senior",
      tip: "Sempre gere um UUID como valor do lock — isso é o que protege contra liberação acidental por outro cliente.",
    },
    {
      q: "Diferença entre List e Stream para fila de tarefas?",
      a: "<p><b>List (LPUSH/BRPOP):</b> simples, baixa latência, sem consumer groups, sem ack explícito, sem replay. Mensagem consumida é removida — se o consumer morrer antes de processar, mensagem perde.</p><p><b>Stream:</b> consumer groups com ack explícito (<code>XACK</code>), pending entries list para rastrear mensagens não confirmadas, múltiplos consumers em paralelo por group, replay de histórico configurável. Para filas de produção com at-least-once delivery, Stream é superior. Para tarefas simples onde perda ocasional é aceitável, List é suficiente e mais simples.</p>",
      level: "pleno",
      tip: "Pense em Stream como Kafka embutido no Redis: consumer groups, offsets, ack. List é apenas um array com pop atômico.",
    },
    {
      q: "Como implementaria rate limiting com Redis?",
      a: "<p><b>Fixed window:</b> <code>INCR key:minute</code> + <code>EXPIRE key:minute 60</code>. Simples, mas sofre burst na virada do minuto — cliente pode fazer 2× o limite em poucos segundos.</p><p><b>Sliding window com Sorted Set:</b> <code>ZADD key now now</code>, <code>ZREMRANGEBYSCORE key 0 (now-window)</code>, <code>ZCARD key</code>. Exato, mas usa mais memória (um membro por request). Executar atomicamente via Lua.</p><p><b>Token bucket:</b> Lua script armazena tokens e timestamp de último refill no Hash. Mais correto para tráfego em rajadas permitidas.</p>",
      level: "senior",
      tip: "Para sliding window em Lua: o script recebe KEYS[1]=chave, ARGV[1]=now, ARGV[2]=window, ARGV[3]=limit. Tudo num round-trip.",
    },
    {
      q: "O que é Redis Cluster e quais as limitações?",
      a: "<p>Redis Cluster distribui <b>16.384 hash slots</b> entre múltiplos masters via <code>CRC16(key) % 16384</code>. Client usa MOVED redirect para chegar ao master correto.</p><p><b>Limitações importantes:</b><ul><li>Multi-key commands (MGET, MSET, SUNIONSTORE) exigem que todas as keys estejam no mesmo slot — use hash tags <code>{tag}</code></li><li>Sem cross-slot transactions com MULTI/EXEC</li><li>SCAN itera apenas um nó por vez</li><li>Pub/Sub não propaga entre nós</li><li>Lua scripts não podem acessar keys em slots diferentes</li></ul></p>",
      level: "senior",
      tip: "Hash tags: a parte entre {} define o slot. {user:123}:profile e {user:123}:cart ficam no mesmo slot.",
    },
    {
      q: "Explique as políticas de eviction do Redis e quando usar cada uma.",
      a: "<p>Quando <code>maxmemory</code> é atingido, Redis escolhe quais chaves remover:</p><ul><li><b>noeviction</b>: retorna erro para escritas. Use quando dados não podem ser perdidos (não cache).</li><li><b>allkeys-lru</b>: remove a chave menos recentemente usada entre todas. Ideal para cache puro.</li><li><b>volatile-lru</b>: LRU apenas nas chaves com TTL. Para mix de dados permanentes e cache temporário.</li><li><b>allkeys-lfu</b>: remove a menos frequentemente usada (melhor que LRU para hot data concentrada).</li><li><b>allkeys-random</b>: remove aleatoriamente — raramente adequado.</li></ul><p>Redis 4+ inclui LFU (Least Frequently Used) que evita remover chaves que foram acessadas muitas vezes mas não recentemente.</p>",
      level: "pleno",
      tip: "allkeys-lru é o padrão para 90% dos casos de cache. Troque para allkeys-lfu se você tiver hot keys muito concentradas.",
    },
    {
      q: "Como funciona o RESP (Redis Serialization Protocol)?",
      a: "<p>RESP é o protocolo texto/binário que Redis usa sobre TCP. Tipos de resposta:<ul><li><b>+</b> Simple String: <code>+OK\r\n</code></li><li><b>-</b> Error: <code>-ERR unknown command\r\n</code></li><li><b>:</b> Integer: <code>:1000\r\n</code></li><li><b>$</b> Bulk String: <code>$6\r\nfoobar\r\n</code> (tamanho explícito)</li><li><b>*</b> Array: <code>*3\r\n:1\r\n:2\r\n:3\r\n</code></li></ul></p><p>RESP3 (Redis 6+) adiciona Map, Double, BigNumber, Boolean — permite clients evitar deserialização ad hoc. O protocolo é simples o suficiente para implementar em qualquer linguagem com TCP.</p>",
      level: "senior",
      tip: "RESP é a razão pela qual os clientes Redis são tão simples e rápidos — sem overhead de parsing XML/JSON.",
    },
    {
      q: "O que é Redis Sentinel e quando usar em vez de Cluster?",
      a: "<p><b>Sentinel:</b> sistema de HA para Redis single-shard. Monitora master + réplicas, faz failover automático (elege nova réplica como master), fornece service discovery (clients perguntam ao Sentinel qual é o master atual).</p><p><b>Use Sentinel quando:</b> dataset cabe em uma instância, precisa de HA sem a complexidade de Cluster, ou usa funcionalidades incompatíveis com Cluster (Lua cross-slot, Pub/Sub globalizado).</p><p><b>Use Cluster quando:</b> dataset excede memória de uma instância, precisa de sharding horizontal, ou quer write scaling.</p>",
      level: "senior",
      tip: "Sentinel = HA sem sharding. Cluster = HA + sharding. A maioria das aplicações começa com Sentinel e migra para Cluster quando necessário.",
    },
    {
      q: "Como funciona MULTI/EXEC e quando preferir Lua?",
      a: "<p><b>MULTI/EXEC</b> enfileira comandos no servidor. EXEC os executa atomicamente. <b>WATCH key</b> adiciona otimistic locking: se a chave for modificada entre WATCH e EXEC, a transação retorna nil (cliente deve retry).</p><p><b>Limitações do MULTI/EXEC:</b><ul><li>Sem condicionais dentro da transação</li><li>WATCH requer retry no client</li><li>Dois round-trips mínimos</li></ul></p><p><b>Lua script</b> executa em um único round-trip, pode ter condicionais, loops e lógica complexa. Pré-carregue com SCRIPT LOAD e use EVALSHA para evitar re-envio do script. Prefira Lua quando há lógica que depende de valores lidos no mesmo bloco atômico.</p>",
      level: "senior",
      tip: "WATCH + MULTI/EXEC para casos simples de check-and-set; Lua quando precisa de condicionais ou mais de 2 comandos interdependentes.",
    },
    {
      q: "Como implementar um leaderboard em tempo real com Redis?",
      a: "<p><b>Sorted Set</b> é a estrutura ideal: <code>ZADD leaderboard score user_id</code>, score é numérico (pontos, ELO, tempo). Redis mantém automaticamente ordenado.</p><p>Operações:<ul><li><code>ZADD leaderboard 1500 'user:123'</code> — add/update score</li><li><code>ZRANK leaderboard 'user:123'</code> — posição (0-indexed, crescente)</li><li><code>ZREVRANK leaderboard 'user:123'</code> — posição decrescente (rank 1 = maior score)</li><li><code>ZREVRANGE leaderboard 0 9 WITHSCORES</code> — top 10 com scores</li><li><code>ZINCRBY leaderboard 50 'user:123'</code> — incrementa score atomicamente</li></ul></p><p>Para leaderboard com múltiplos critérios: encode ambos no score (ex: score * 1e9 + timestamp_inverso para desempate por tempo).</p>",
      level: "pleno",
      tip: "ZREVRANK dá o rank em ordem decrescente — é o que você quer para leaderboard onde maior score = posição mais alta.",
    },
    {
      q: "Diferença entre RDB e AOF e quando usar cada um?",
      a: "<p><b>RDB (Redis Database Snapshot):</b> fork() do processo, serializa dataset completo para disco. Arquivo compacto, rápido para restore, mas pode perder até o intervalo entre snapshots de dados.</p><p><b>AOF (Append-Only File):</b> grava cada operação de escrita no log. Mais durável: <code>appendfsync always</code> (sem perda, lento), <code>everysec</code> (perde ~1s, recomendado), <code>no</code> (deixa o OS decidir, mais rápido mas pode perder mais). AOF pode ser reescrito (BGREWRITEAOF) para compactar o log.</p><p><b>Hybrid (recomendado):</b> <code>aof-use-rdb-preamble yes</code> — começa com snapshot RDB, continua com AOF delta. Combina restore rápido com durabilidade.</p>",
      level: "pleno",
      tip: "Para produção com dados críticos: hybrid. Para cache puro sem dados críticos: RDB only ou até sem persistência.",
    },
    {
      q: "O que é HyperLogLog e quando usar?",
      a: "<p><b>HyperLogLog</b> é uma estrutura probabilística para <b>contagem de elementos únicos</b> (cardinality estimation) com memória fixa de ~12KB independente do número de elementos.</p><p>Erro máximo: 0,81%. <code>PFADD visitors user1 user2 user3</code>, <code>PFCOUNT visitors</code>. <code>PFMERGE</code> combina múltiplos HyperLogLogs.</p><p><b>Casos de uso:</b> contar usuários únicos por dia, contar IPs únicos, estimar eventos únicos em janelas de tempo — onde precisão exata não é necessária mas memória é limitada.</p><p>Comparação: Set exato para 1M usuários gastaria ~50MB; HyperLogLog usa sempre ~12KB com erro &lt;1%.</p>",
      level: "senior",
      tip: "HyperLogLog não permite ver os elementos, só contar. Se precisar de intersecção exata, use Set. Se precisar só da contagem aproximada, HLL é muito mais eficiente.",
    },
    {
      q: "Como implementar cache-aside pattern com Redis?",
      a: "<p><b>Cache-aside (lazy loading):</b><ol><li>Aplicação verifica Redis: <code>GET cache:user:123</code></li><li>Cache hit: retorna dado imediatamente</li><li>Cache miss: busca no banco, escreve no cache com TTL (<code>SET cache:user:123 {json} EX 300</code>), retorna dado</li></ol></p><p><b>Invalidação:</b> quando dado muda no banco, deletar a chave (<code>DEL cache:user:123</code>) ou atualizar (<code>SET</code> com novo valor). Deletar é mais seguro — evita race condition de escrita concorrente.</p><p><b>Thundering herd:</b> muitos requests simultâneos para a mesma chave expirada. Mitigação: lock com SET NX enquanto um worker recarrega, outros esperam ou recebem dado stale.</p>",
      level: "pleno",
      tip: "Prefira DEL na invalidação em vez de SET imediato — evita escrever dado potencialmente desatualizado se há race entre múltiplos writers.",
    },
    {
      q: "Como usar Redis Streams para event sourcing?",
      a: "<p><code>XADD stream_key * field1 val1 field2 val2</code> — adiciona evento. O <code>*</code> gera ID automático <code>timestamp-sequencial</code>.</p><p><b>Consumer groups:</b> <code>XGROUP CREATE mystream grp $ MKSTREAM</code>. <code>XREADGROUP GROUP grp consumer1 COUNT 10 STREAMS mystream &gt;</code> — lê novas mensagens. <code>XACK mystream grp msg_id</code> — confirma processamento.</p><p><b>PEL (Pending Entries List):</b> <code>XPENDING mystream grp</code> lista mensagens entregues mas não ackadas. <code>XCLAIM</code> transfere mensagens pendentes de um consumer morto para outro.</p><p>Para event sourcing completo: combine com Redis persistence (AOF everysec) para garantir durabilidade dos eventos.</p>",
      level: "senior",
      tip: "ID do Stream é timestamp + sequência — permite buscas por intervalo de tempo com XRANGE. Muito útil para debug e replay de eventos.",
    },
    {
      q: "Como garantir atomicidade com Lua scripts no Redis?",
      a: "<p>Scripts Lua são executados atomicamente: nenhum outro comando é processado durante a execução. Use <code>redis.call()</code> para chamadas que lançam erro em falha, <code>redis.pcall()</code> para capturar erros.</p><p><b>Carregamento:</b> <code>EVAL script numkeys key1 key2 arg1 arg2</code>. Para produção: <code>SCRIPT LOAD script</code> retorna SHA1, use <code>EVALSHA sha1 numkeys keys args</code> para evitar reenvio do script toda vez.</p><p><b>Limitações:</b> não use operações bloqueantes (BLPOP), não use comandos que necessitem de tempo real, evite loops muito longos — todo Redis fica bloqueado durante a execução.</p>",
      level: "senior",
      tip: "SCRIPT LOAD + EVALSHA é a prática correta em produção: carrega uma vez, executa via hash. Protege contra falha de rede ao enviar script longo.",
    },
    {
      q: "O que são Bitmaps no Redis e quando usar?",
      a: "<p>Bitmaps não são um tipo de dados separado — são operações sobre <b>Strings</b> tratando cada byte como array de bits. Comandos: <code>SETBIT key offset 1</code>, <code>GETBIT key offset</code>, <code>BITCOUNT key</code>, <code>BITOP AND/OR/XOR destkey key1 key2</code>.</p><p><b>Caso de uso clássico:</b> tracking de presença/atividade por dia. Offset = user_id, bit = 1 se ativo. Para 10M usuários: 10M bits = 1,25MB. <code>BITCOUNT</code> conta usuários ativos em O(N/8) onde N é o offset máximo.</p><p><b>Comparação com Set:</b> Bitmap é mais eficiente quando os IDs são inteiros sequenciais e densos. Set é melhor quando IDs são esparsos ou não-inteiros.</p>",
      level: "senior",
      tip: "BITPOS encontra o primeiro bit 0 ou 1 — útil para encontrar o primeiro ID disponível em um pool de recursos.",
    },
    {
      q: "Como funciona o pipeline do Redis e qual o ganho de performance?",
      a: "<p>Pipeline agrupa múltiplos comandos num único envio TCP, eliminando round-trips. Sem pipeline: 100 comandos = 100 round-trips. Com pipeline: 100 comandos = 1 envio, 1 resposta em batch.</p><p><b>Implementação nos clientes:</b> em ioredis (Node.js): <code>const pipeline = redis.pipeline(); pipeline.set(...); pipeline.get(...); await pipeline.exec()</code>. Retorna array de resultados.</p><p><b>Diferença de MULTI/EXEC:</b> Pipeline é uma otimização de transporte — comandos não são atômicos. MULTI/EXEC garante atomicidade. Podem ser combinados: MULTI dentro de pipeline.</p><p>Ganho típico: 5-10× de throughput para operações em lote em comparação com comandos individuais sobre WAN.</p>",
      level: "pleno",
      tip: "Pipeline é sempre client-side: o servidor não sabe que é um pipeline, apenas recebe múltiplos comandos de uma vez.",
    },
    {
      q: "Como fazer debug de performance no Redis?",
      a: "<p><b>MONITOR:</b> stream em tempo real de todos os comandos. Útil para diagnóstico, mas gera overhead — nunca deixe em produção por muito tempo.</p><p><b>SLOWLOG GET N:</b> lista os N comandos mais lentos acima de <code>slowlog-log-slower-than</code> microssegundos (default 10ms). Identifica operações O(N) problemáticas.</p><p><b>INFO:</b> métricas completas: <code>INFO stats</code> (keyspace hits/misses), <code>INFO memory</code> (used_memory, fragmentation), <code>INFO replication</code> (lag de réplica).</p><p><b>OBJECT FREQ / OBJECT IDLETIME key:</b> identifica hot keys e chaves não acessadas. <b>redis-cli --hotkeys:</b> scan automático de hot keys (requer LFU policy).</p>",
      level: "senior",
      tip: "Hit rate = keyspace_hits / (keyspace_hits + keyspace_misses). Abaixo de 90% indica problema no cache warming ou TTLs muito curtos.",
    },
    {
      q: "Quais são os padrões de uso de Hash no Redis?",
      a: "<p>Hash armazena múltiplos campos de um objeto em uma única chave: <code>HSET user:123 name 'Ana' age 30 email 'ana@ex.com'</code>. Operações: <code>HGET user:123 name</code>, <code>HMGET user:123 name email</code>, <code>HGETALL user:123</code>, <code>HINCRBY user:123 age 1</code>.</p><p><b>Otimização de memória:</b> Redis usa ziplist (listpack no 7+) para hashes pequenos (≤128 campos, valores ≤64 bytes por default). Muito mais eficiente em memória do que múltiplas String keys separadas para o mesmo objeto.</p><p><b>Anti-pattern:</b> HGETALL em hash com centenas de campos é O(N) e retorna tudo. Prefira HMGET com campos específicos.</p>",
      level: "pleno",
      tip: "Hash é perfeito para objetos de sessão ou perfil de usuário — um único HSET substitui N operações SET separadas e economiza memória.",
    },
    {
      q: "Como o Redis implementa geo-indexação?",
      a: "<p>Redis Geo usa internamente um <b>Sorted Set</b> onde o score é um <b>geohash de 52 bits</b> (longitude + latitude codificados). Comandos:<ul><li><code>GEOADD locations 13.361389 38.115556 'Palermo'</code></li><li><code>GEODIST locations Palermo Catania km</code></li><li><code>GEOSEARCH locations FROMLONLAT 15 37 BYRADIUS 100 km ASC COUNT 10</code> (Redis 6.2+)</li><li><code>GEOPOS locations Palermo</code> — decodifica coordenadas</li></ul></p><p>Precisão: ~0,6mm no nível de zoom máximo. Útil para encontrar locais próximos, calcular distâncias, mas não substitui PostGIS para operações geoespaciais complexas (polígonos, interseções).</p>",
      level: "senior",
      tip: "GEOSEARCH substituiu GEORADIUS (deprecated). Suporta bounding box (BYBOX) além de raio — mais eficiente para queries retangulares.",
    },
    {
      q: "Como configurar Redis para alta disponibilidade sem Cluster?",
      a: "<p><b>Redis Sentinel:</b> processo separado que monitora master/réplicas. Quorum de Sentinels detecta falha do master (default: 2 de 3 Sentinels concordam). Failover automático: promove réplica mais atualizada, reconfigura demais réplicas para seguir novo master.</p><p><b>Configuração mínima:</b> 1 master + 1 réplica + 3 Sentinels (podem rodar nos mesmos hosts que Redis). Clients perguntam ao Sentinel qual é o master atual: <code>SENTINEL get-master-addr-by-name mymaster</code>.</p><p><b>Replicação:</b> assíncrona por default. <code>min-replicas-to-write 1</code> + <code>min-replicas-max-lag 10</code> evita escrever se réplica estiver muito atrasada, reduzindo risco de perda de dados.</p>",
      level: "senior",
      tip: "Sempre número ímpar de Sentinels (3 ou 5) para garantir quorum sem split-brain. Nunca use 2 Sentinels.",
    },
    {
      q: "O que é keyspace notification e como usar?",
      a: "<p>Keyspace notifications permitem que clientes subscrevam a eventos do Redis: expiração de chaves, escritas, deletes. Ativado com <code>notify-keyspace-events</code> no redis.conf ou via <code>CONFIG SET</code>.</p><p><b>Exemplos de eventos:</b><ul><li><code>KEA</code> — todos os eventos (K=keyspace, E=keyevent, A=all)</li><li><code>KEx</code> — apenas expiração</li><li><code>Ksg</code> — set e generic (DEL, EXPIRE)</li></ul></p><p>Subscribe: <code>SUBSCRIBE __keyevent@0__:expired</code> para receber notificação quando chaves expiram no DB 0.</p><p><b>Caso de uso:</b> invalidar cache distribuído, disparar workflows quando jobs expiram, implementar TTL-based triggers.</p>",
      level: "senior",
      tip: "Keyspace notifications têm overhead — habilite apenas os eventos necessários (não use A em produção com alta escrita).",
    },
  ],

  diagrams: [
    {
      title: "Estruturas de Dados Redis",
      html: `<style>
.rd-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-family: monospace; max-width: 700px; }
.rd-card { background: #1a1a2e; border: 1px solid #ef4444; border-radius: 8px; padding: 12px; }
.rd-card h4 { color: #ef4444; margin: 0 0 8px; font-size: 13px; text-transform: uppercase; }
.rd-item { background: #0f3460; color: #e0e0e0; border-radius: 4px; padding: 4px 8px; margin: 3px 0; font-size: 12px; }
.rd-cmd { color: #f59e0b; font-size: 11px; }
</style>
<div class="rd-grid">
  <div class="rd-card"><h4>String</h4><div class="rd-item">SET / GET</div><div class="rd-item">INCR / DECR</div><div class="rd-item rd-cmd">cache, contador, flag</div></div>
  <div class="rd-card"><h4>Hash</h4><div class="rd-item">HSET / HGET</div><div class="rd-item">HMGET / HGETALL</div><div class="rd-item rd-cmd">objeto, perfil, sessão</div></div>
  <div class="rd-card"><h4>List</h4><div class="rd-item">LPUSH / RPOP</div><div class="rd-item">BRPOP (blocking)</div><div class="rd-item rd-cmd">fila, stack, feed</div></div>
  <div class="rd-card"><h4>Set</h4><div class="rd-item">SADD / SMEMBERS</div><div class="rd-item">SINTER / SUNION</div><div class="rd-item rd-cmd">tags, amigos em comum</div></div>
  <div class="rd-card"><h4>Sorted Set</h4><div class="rd-item">ZADD / ZRANK</div><div class="rd-item">ZREVRANGE / ZINCRBY</div><div class="rd-item rd-cmd">leaderboard, ranking</div></div>
  <div class="rd-card"><h4>Stream</h4><div class="rd-item">XADD / XREADGROUP</div><div class="rd-item">XACK / XPENDING</div><div class="rd-item rd-cmd">fila durável, eventos</div></div>
</div>`,
      caption: "Cada estrutura tem comandos especializados — escolha pela semântica da operação, não pela familiaridade.",
    },
    {
      title: "Arquitetura de Persistência Redis",
      html: `<style>
.rd-persist { display: flex; gap: 20px; font-family: sans-serif; max-width: 700px; }
.rd-box { flex: 1; border-radius: 8px; padding: 16px; }
.rd-rdb { background: #1e3a1e; border: 1px solid #22c55e; }
.rd-aof { background: #1e1e3a; border: 1px solid #6366f1; }
.rd-hybrid { background: #3a1e1e; border: 1px solid #ef4444; }
.rd-box h4 { margin: 0 0 10px; font-size: 14px; color: #fff; }
.rd-row { display: flex; justify-content: space-between; font-size: 12px; margin: 4px 0; }
.rd-label { color: #aaa; }
.rd-val { color: #fff; font-weight: bold; }
.rd-pro { color: #22c55e; font-size: 11px; }
.rd-con { color: #f87171; font-size: 11px; }
</style>
<div class="rd-persist">
  <div class="rd-box rd-rdb">
    <h4>RDB — Snapshot</h4>
    <div class="rd-row"><span class="rd-label">Trigger</span><span class="rd-val">save 900 1</span></div>
    <div class="rd-row"><span class="rd-label">Tamanho</span><span class="rd-val">Compacto</span></div>
    <div class="rd-row"><span class="rd-label">Restore</span><span class="rd-val">Rápido</span></div>
    <div class="rd-pro">✓ Fork em background (não bloqueia)</div>
    <div class="rd-con">✗ Perde dados entre snapshots</div>
  </div>
  <div class="rd-box rd-aof">
    <h4>AOF — Log</h4>
    <div class="rd-row"><span class="rd-label">fsync</span><span class="rd-val">everysec</span></div>
    <div class="rd-row"><span class="rd-label">Tamanho</span><span class="rd-val">Maior</span></div>
    <div class="rd-row"><span class="rd-label">Restore</span><span class="rd-val">Mais lento</span></div>
    <div class="rd-pro">✓ Perde no máximo ~1s de dados</div>
    <div class="rd-con">✗ Arquivo cresce continuamente</div>
  </div>
  <div class="rd-box rd-hybrid">
    <h4>Hybrid (recomendado)</h4>
    <div class="rd-row"><span class="rd-label">Config</span><span class="rd-val">aof-use-rdb-preamble yes</span></div>
    <div class="rd-row"><span class="rd-label">Restore</span><span class="rd-val">Rápido (RDB) + delta AOF</span></div>
    <div class="rd-pro">✓ Melhor dos dois mundos</div>
    <div class="rd-pro">✓ Arquivo menor que AOF puro</div>
  </div>
</div>`,
      caption: "Hybrid é o modo recomendado para produção com dados críticos.",
    },
    {
      title: "Redis Cluster — Fluxo de Roteamento",
      html: `<style>
.rd-cluster { font-family: monospace; max-width: 680px; }
.rd-flow { display: flex; align-items: center; gap: 8px; margin: 10px 0; flex-wrap: wrap; }
.rd-node { background: #1a1a2e; border: 1px solid #6366f1; border-radius: 6px; padding: 8px 12px; color: #e0e0e0; font-size: 12px; text-align: center; }
.rd-master { border-color: #ef4444; }
.rd-arrow { color: #6b7280; font-size: 16px; }
.rd-slots { background: #0f3460; border-radius: 4px; padding: 4px 8px; color: #93c5fd; font-size: 11px; margin: 4px 0; }
.rd-info { background: #1a1a2e; border-left: 3px solid #f59e0b; padding: 8px 12px; margin: 10px 0; color: #e0e0e0; font-size: 12px; }
</style>
<div class="rd-cluster">
  <div class="rd-flow">
    <div class="rd-node">Client<br><small>SET user:1 val</small></div>
    <div class="rd-arrow">→</div>
    <div class="rd-node rd-master">Master A<br><small>slots 0–5460</small></div>
    <div class="rd-arrow">MOVED 7638 →</div>
    <div class="rd-node rd-master">Master B<br><small>slots 5461–10922</small></div>
  </div>
  <div class="rd-slots">CRC16("user:1") % 16384 = 7638 → Master B</div>
  <div class="rd-slots">Hash tag: {user:1}:profile e {user:1}:cart → mesmo slot</div>
  <div class="rd-info">⚠ Multi-key commands exigem todas as keys no mesmo slot.<br>MGET key1 key2 falha se estiverem em slots diferentes.</div>
  <div class="rd-flow">
    <div class="rd-node rd-master">Master B</div>
    <div class="rd-arrow">replica →</div>
    <div class="rd-node">Replica B1</div>
    <div class="rd-arrow">replica →</div>
    <div class="rd-node">Replica B2</div>
  </div>
</div>`,
      caption: "O client armazena o mapa de slots e roteia localmente após o primeiro MOVED — apenas o primeiro acesso tem redirecionamento.",
    },
    {
      title: "Padrões de Rate Limiting com Redis",
      html: `<style>
.rd-rl { font-family: monospace; max-width: 680px; }
.rd-pattern { background: #1a1a2e; border: 1px solid #374151; border-radius: 8px; padding: 12px; margin: 8px 0; }
.rd-pattern h4 { color: #f59e0b; margin: 0 0 6px; font-size: 13px; }
.rd-code { background: #0f172a; color: #86efac; border-radius: 4px; padding: 4px 8px; font-size: 11px; margin: 3px 0; }
.rd-note { color: #6b7280; font-size: 11px; margin-top: 4px; }
.rd-good { color: #22c55e; }
.rd-bad { color: #f87171; }
</style>
<div class="rd-rl">
  <div class="rd-pattern">
    <h4>Fixed Window</h4>
    <div class="rd-code">INCR rate:user:123:2024-01-15-14</div>
    <div class="rd-code">EXPIRE rate:user:123:2024-01-15-14 3600</div>
    <div class="rd-note"><span class="rd-good">✓ Simples</span> | <span class="rd-bad">✗ Burst na virada da janela (2× o limite)</span></div>
  </div>
  <div class="rd-pattern">
    <h4>Sliding Window (Sorted Set)</h4>
    <div class="rd-code">ZADD key {now} {now}  -- add timestamp como score</div>
    <div class="rd-code">ZREMRANGEBYSCORE key 0 {now - window}</div>
    <div class="rd-code">ZCARD key  -- contagem na janela deslizante</div>
    <div class="rd-note"><span class="rd-good">✓ Janela exata</span> | <span class="rd-bad">✗ Mais memória (1 membro/request)</span></div>
  </div>
  <div class="rd-pattern">
    <h4>Token Bucket (Lua Script)</h4>
    <div class="rd-code">-- KEYS[1]=bucket, ARGV[1]=rate, ARGV[2]=capacity, ARGV[3]=now</div>
    <div class="rd-code">local tokens = redis.call('HGET', KEYS[1], 'tokens')</div>
    <div class="rd-code">-- refill baseado no tempo decorrido + allow/deny</div>
    <div class="rd-note"><span class="rd-good">✓ Permite burst controlado</span> | <span class="rd-bad">✗ Mais complexo</span></div>
  </div>
</div>`,
      caption: "Sliding window é o mais preciso; token bucket permite bursts legítimos. Ambos devem usar Lua para atomicidade.",
    },
  ],

  mnemonics: [
    {
      label: "RHLSSSH — Estruturas Redis",
      trick: "Real Hackers Love Six Structures Seriously, Homie",
      explanation: "R=RDB, H=Hash, L=List, S=String, S=Set, S=Sorted Set, H=HyperLogLog (Stream está implícito). Lembra as estruturas principais do Redis.",
    },
    {
      label: "NX + EX = Distributed Lock seguro",
      trick: "Não Existe (NX) sem Expirar (EX)",
      explanation: "SET lock NX sem EX = deadlock se o processo morrer. SET lock NX EX 30 é a fórmula correta: só cria se não existe (NX) e expira em 30s (EX). Sempre os dois juntos.",
    },
    {
      label: "SCAN não KEYS — O(1) vs O(N)",
      trick: "KEYS mata, SCAN salva",
      explanation: "KEYS * itera todas as chaves em O(N) e bloqueia o Redis inteiro (single-threaded). SCAN usa cursor e itera em lotes sem bloquear outros clientes. Em produção: nunca KEYS, sempre SCAN com COUNT.",
    },
    {
      label: "AOF everysec — perde 1 segundo",
      trick: "Append One File = perde 1 segundo",
      explanation: "appendfsync always = sem perda, lento. appendfsync everysec = perde ~1s, recomendado. appendfsync no = sem garantia. 'everysec' é o sweet spot entre durabilidade e performance para a maioria dos casos.",
    },
    {
      label: "Eviction: allkeys-lru para cache puro",
      trick: "All Keys Learn Rarely Used = cache puro",
      explanation: "allkeys-lru remove a chave menos recentemente usada entre TODAS as chaves quando memória esgota — ideal para cache puro onde qualquer chave pode ser recriada. volatile-lru só age em chaves com TTL — para mix de dados permanentes + cache.",
    },
  ],

  cheatsheet: {
    title: "Redis — Cheatsheet de Comandos e Patterns",
    html: `<style>
.rd-cs { font-family: monospace; max-width: 720px; color: #e0e0e0; }
.rd-section { margin: 12px 0; }
.rd-section h4 { color: #ef4444; border-bottom: 1px solid #374151; padding-bottom: 4px; margin: 0 0 6px; font-size: 13px; text-transform: uppercase; }
.rd-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.rd-table td { padding: 4px 8px; border: 1px solid #1f2937; }
.rd-table tr:nth-child(even) { background: #111827; }
.rd-cmd-col { color: #86efac; white-space: nowrap; }
.rd-desc-col { color: #d1d5db; }
.rd-tip-box { background: #1e3a1e; border-left: 3px solid #22c55e; padding: 8px; font-size: 11px; color: #bbf7d0; margin-top: 8px; }
</style>
<div class="rd-cs">
  <div class="rd-section">
    <h4>String</h4>
    <table class="rd-table">
      <tr><td class="rd-cmd-col">SET key val [EX s] [NX|XX]</td><td class="rd-desc-col">Armazena com TTL opcional e condição NX (só cria) ou XX (só atualiza)</td></tr>
      <tr><td class="rd-cmd-col">INCR / INCRBY / INCRBYFLOAT</td><td class="rd-desc-col">Incremento atômico — base de contadores e rate limiters</td></tr>
      <tr><td class="rd-cmd-col">GETEX key EX s</td><td class="rd-desc-col">GET + renova TTL em uma operação (Redis 6.2+)</td></tr>
    </table>
  </div>
  <div class="rd-section">
    <h4>Hash</h4>
    <table class="rd-table">
      <tr><td class="rd-cmd-col">HSET key f1 v1 f2 v2</td><td class="rd-desc-col">Multi-field set em uma operação</td></tr>
      <tr><td class="rd-cmd-col">HMGET key f1 f2</td><td class="rd-desc-col">Multi-field get — prefira a HGETALL para objetos grandes</td></tr>
      <tr><td class="rd-cmd-col">HINCRBY key field n</td><td class="rd-desc-col">Incremento atômico em campo do hash</td></tr>
    </table>
  </div>
  <div class="rd-section">
    <h4>Sorted Set</h4>
    <table class="rd-table">
      <tr><td class="rd-cmd-col">ZADD key score member</td><td class="rd-desc-col">Add/update com score. NX/GT/LT para condicionais</td></tr>
      <tr><td class="rd-cmd-col">ZREVRANGE key 0 9 WITHSCORES</td><td class="rd-desc-col">Top 10 decrescente (leaderboard)</td></tr>
      <tr><td class="rd-cmd-col">ZRANGEBYSCORE key min max</td><td class="rd-desc-col">Range por score — filtros numéricos</td></tr>
    </table>
  </div>
  <div class="rd-section">
    <h4>Patterns Comuns</h4>
    <table class="rd-table">
      <tr><td class="rd-cmd-col">SET lock val NX EX 30</td><td class="rd-desc-col">Distributed lock — apenas um dono por vez</td></tr>
      <tr><td class="rd-cmd-col">SCAN 0 MATCH prefix:* COUNT 100</td><td class="rd-desc-col">Iteração sem bloquear (substitui KEYS *)</td></tr>
      <tr><td class="rd-cmd-col">PFADD hll elem; PFCOUNT hll</td><td class="rd-desc-col">Contagem de únicos com ~1% de erro e 12KB de memória</td></tr>
      <tr><td class="rd-cmd-col">XADD stream * field val</td><td class="rd-desc-col">Append em Stream — fila durável com consumer groups</td></tr>
    </table>
  </div>
  <div class="rd-tip-box">Checklist de produção: maxmemory + política de eviction → persistência (hybrid) → SLOWLOG configurado → SCAN em vez de KEYS → TTL em todas as chaves de cache</div>
</div>`,
    caption: "Guia rápido dos comandos e patterns mais usados em produção.",
  },

  mindmap: {
    title: "Redis — Mapa Mental",
    html: `<style>
.rd-mm { font-family: sans-serif; max-width: 720px; color: #e0e0e0; }
.rd-center { background: #ef4444; color: #fff; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; margin: 0 auto 20px; text-align: center; }
.rd-branches { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.rd-branch { background: #1a1a2e; border-top: 3px solid #ef4444; border-radius: 6px; padding: 10px; }
.rd-branch h4 { color: #f87171; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; }
.rd-leaf { color: #d1d5db; font-size: 11px; padding: 2px 0; border-left: 2px solid #374151; padding-left: 6px; margin: 3px 0; }
</style>
<div class="rd-mm">
  <div class="rd-center">Redis</div>
  <div class="rd-branches">
    <div class="rd-branch"><h4>Estruturas</h4>
      <div class="rd-leaf">String — cache/contador</div>
      <div class="rd-leaf">Hash — objeto/sessão</div>
      <div class="rd-leaf">List — fila/stack</div>
      <div class="rd-leaf">Set — único/tags</div>
      <div class="rd-leaf">Sorted Set — ranking</div>
      <div class="rd-leaf">Stream — evento durável</div>
    </div>
    <div class="rd-branch"><h4>Persistência</h4>
      <div class="rd-leaf">RDB — snapshot</div>
      <div class="rd-leaf">AOF — log de ops</div>
      <div class="rd-leaf">Hybrid — recomendado</div>
      <div class="rd-leaf">appendfsync everysec</div>
    </div>
    <div class="rd-branch"><h4>Alta Disponibilidade</h4>
      <div class="rd-leaf">Sentinel — HA single-shard</div>
      <div class="rd-leaf">Cluster — sharding + HA</div>
      <div class="rd-leaf">16.384 hash slots</div>
      <div class="rd-leaf">Redlock — distributed lock</div>
    </div>
    <div class="rd-branch"><h4>Patterns</h4>
      <div class="rd-leaf">Cache-aside (lazy)</div>
      <div class="rd-leaf">Rate limiter (sliding)</div>
      <div class="rd-leaf">Distributed lock (NX EX)</div>
      <div class="rd-leaf">Pub/Sub — fan-out</div>
      <div class="rd-leaf">Leaderboard (ZSet)</div>
    </div>
    <div class="rd-branch"><h4>Performance</h4>
      <div class="rd-leaf">Single-threaded I/O</div>
      <div class="rd-leaf">Pipeline (batch)</div>
      <div class="rd-leaf">SCAN vs KEYS *</div>
      <div class="rd-leaf">SLOWLOG diagnóstico</div>
      <div class="rd-leaf">Eviction policies</div>
    </div>
    <div class="rd-branch"><h4>Atomicidade</h4>
      <div class="rd-leaf">MULTI/EXEC + WATCH</div>
      <div class="rd-leaf">Lua scripts (EVAL)</div>
      <div class="rd-leaf">EVALSHA (prod)</div>
      <div class="rd-leaf">Pipeline (transporte)</div>
    </div>
  </div>
</div>`,
    caption: "Visão completa das dimensões do Redis — persistência, HA, patterns e performance.",
  },

  exercises: [
    {
      level: "iniciante",
      title: "Implementar cache-aside para perfil de usuário",
      description: "Crie uma função getUserProfile(id) que: (1) tenta buscar do Redis com GET, (2) em caso de miss, busca do banco (simule com objeto JS), (3) armazena no Redis com TTL de 5 minutos usando SET ... EX. Teste cache hit e cache miss. Adicione log para distinguir os dois casos.",
      concepts: ["GET", "SET EX", "cache-aside", "TTL", "cache hit/miss"],
    },
    {
      level: "iniciante",
      title: "Construir leaderboard com Sorted Set",
      description: "Implemente um leaderboard de pontuação: use ZADD para adicionar jogadores com scores, ZINCRBY para incrementar pontos, ZREVRANGE com WITHSCORES para listar top 10, e ZREVRANK para obter a posição de um jogador específico. Adicione 20 jogadores com scores aleatórios e exiba o top 5.",
      concepts: ["ZADD", "ZINCRBY", "ZREVRANGE", "ZREVRANK", "Sorted Set"],
    },
    {
      level: "intermediario",
      title: "Rate limiter com sliding window usando Lua",
      description: "Implemente um rate limiter de 10 requests por 60 segundos usando Sorted Set. O script Lua deve: (1) ZADD com timestamp como score, (2) ZREMRANGEBYSCORE para remover requests fora da janela, (3) ZCARD para contar requests válidos, (4) retornar 1 (permitido) ou 0 (bloqueado). Teste com burst de 15 requests e verifique que apenas 10 passam.",
      concepts: ["Lua scripting", "EVAL", "ZADD", "ZREMRANGEBYSCORE", "ZCARD", "sliding window"],
    },
    {
      level: "intermediario",
      title: "Sistema de sessão com Hash e expiração deslizante",
      description: "Crie um sistema de sessão: ao fazer login, armazene dados da sessão em Hash (HSET session:token userId, email, role, lastAccess). Implemente middleware que verifica sessão (HGET), atualiza lastAccess e renova TTL (EXPIRE) a cada request. Implemente logout com DEL. Trate sessão expirada retornando 401.",
      concepts: ["HSET", "HGET", "EXPIRE", "DEL", "Hash", "session management"],
    },
    {
      level: "senior",
      title: "Distributed lock com Redlock e retry",
      description: "Implemente uma função withLock(resource, ttlMs, fn) que: (1) tenta adquirir lock com SET NX EX, (2) executa fn() se adquiriu, (3) libera com Lua script (verifica valor antes de DEL), (4) faz retry com jitter exponencial se não adquiriu (max 3 tentativas). Use UUID como valor do lock. Simule dois workers concorrentes tentando processar o mesmo pedido.",
      concepts: ["SET NX EX", "Lua release", "UUID", "retry with jitter", "distributed lock", "Redlock"],
    },
    {
      level: "senior",
      title: "Event sourcing com Redis Streams e consumer groups",
      description: "Implemente um sistema de pedidos com Streams: producer faz XADD para cada evento (order.created, order.paid, order.shipped). Configure consumer group (XGROUP CREATE). Implemente 2 consumers concorrentes com XREADGROUP, processamento e XACK. Implemente dead letter: após 3 falhas, XCLAIM para consumer de recovery. Use XPENDING para monitorar mensagens pendentes.",
      concepts: ["XADD", "XGROUP", "XREADGROUP", "XACK", "XCLAIM", "XPENDING", "consumer groups", "at-least-once delivery"],
    },
  ],

  videos: [
    {
      title: "Redis Crash Course",
      channel: "Traversy Media",
      url: "https://www.youtube.com/watch?v=jgpVdJB2sKQ",
      topic: "Introdução completa com Node.js",
    },
    {
      title: "Redis in 100 Seconds",
      channel: "Fireship",
      url: "https://www.youtube.com/watch?v=G1rOthIU-uo",
      topic: "Overview rápido dos conceitos core",
    },
    {
      title: "System Design: Caching",
      channel: "Gaurav Sen",
      url: "https://www.youtube.com/watch?v=U3RkDLtS7uY",
      topic: "Cache patterns, eviction, consistência",
    },
    {
      title: "Redis Streams — Event Driven Architecture",
      channel: "Redis",
      url: "https://www.youtube.com/watch?v=qXEyuUxQXZM",
      topic: "Streams, consumer groups, XADD/XREADGROUP",
    },
    {
      title: "Redis Cluster and Sentinel Deep Dive",
      channel: "Redis University",
      url: "https://www.youtube.com/watch?v=4pMQIGC2kR8",
      topic: "HA com Sentinel, sharding com Cluster",
    },
  ],

  resources: [
    { title: "Redis Documentation Oficial", url: "https://redis.io/docs/", kind: "docs" },
    { title: "Redis University — Cursos Gratuitos", url: "https://university.redis.com/", kind: "curso" },
    { title: "Redis Data Types Introduction", url: "https://redis.io/docs/data-types/", kind: "docs" },
    { title: "Redis Best Practices Guide", url: "https://redis.io/docs/manual/patterns/", kind: "docs" },
    { title: "Designing Data-Intensive Applications (cap. sobre cache)", url: "https://dataintensive.net/", kind: "livro" },
    { title: "Redis in Action — Josiah Carlson", url: "https://www.manning.com/books/redis-in-action", kind: "livro" },
    { title: "Try Redis — Interactive Tutorial", url: "https://try.redis.io/", kind: "pratica" },
    { title: "Redis Explained — blog Arpit Bhayani", url: "https://arpitbhayani.me/blogs/redis-internals", kind: "artigo" },
  ],

  codeExamples: [
    {
      title: "Distributed Lock com Lua — Node.js (ioredis)",
      language: "typescript",
      code: `import Redis from 'ioredis'
const redis = new Redis()

const RELEASE_SCRIPT = \`
  if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
  else
    return 0
  end
\`

async function withLock<T>(
  resource: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T | null> {
  const lockKey = \`lock:\${resource}\`
  const lockValue = crypto.randomUUID()

  // Tenta adquirir lock — SET NX EX (atômico)
  const acquired = await redis.set(lockKey, lockValue, 'PX', ttlMs, 'NX')
  if (!acquired) return null

  try {
    return await fn()
  } finally {
    // Release seguro: Lua verifica se ainda é o dono
    await redis.eval(RELEASE_SCRIPT, 1, lockKey, lockValue)
  }
}

// Uso
const result = await withLock('payment:order-123', 30_000, async () => {
  // processamento exclusivo
  return processPayment('order-123')
})`,
    },
    {
      title: "Rate Limiter Sliding Window — Lua Script",
      language: "typescript",
      code: `import Redis from 'ioredis'
const redis = new Redis()

const RATE_LIMIT_SCRIPT = \`
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])

  -- Remove requests fora da janela deslizante
  redis.call("ZREMRANGEBYSCORE", key, 0, now - window)

  -- Conta requests na janela atual
  local count = redis.call("ZCARD", key)

  if count < limit then
    -- Adiciona request atual (score = timestamp)
    redis.call("ZADD", key, now, now .. "-" .. math.random())
    redis.call("EXPIRE", key, math.ceil(window / 1000))
    return 1  -- permitido
  else
    return 0  -- bloqueado
  end
\`

async function isAllowed(
  userId: string,
  limit = 10,
  windowMs = 60_000
): Promise<boolean> {
  const key = \`rate:\${userId}\`
  const now = Date.now()
  const result = await redis.eval(
    RATE_LIMIT_SCRIPT, 1, key, now, windowMs, limit
  )
  return result === 1
}`,
    },
    {
      title: "Redis Streams — Producer e Consumer Group",
      language: "typescript",
      code: `import Redis from 'ioredis'
const redis = new Redis()

// Producer: adiciona evento ao Stream
async function publishEvent(type: string, payload: object) {
  const id = await redis.xadd(
    'orders:events',
    '*',                    // ID automático (timestamp-seq)
    'type', type,
    'payload', JSON.stringify(payload),
    'ts', Date.now().toString()
  )
  console.log(\`Evento publicado: \${id}\`)
  return id
}

// Inicializa consumer group (uma vez)
async function initGroup() {
  try {
    await redis.xgroup('CREATE', 'orders:events', 'processors', '$', 'MKSTREAM')
  } catch (e) {
    // Grupo já existe — ignorar
  }
}

// Consumer: lê e processa com ack
async function startConsumer(name: string) {
  await initGroup()
  while (true) {
    const messages = await redis.xreadgroup(
      'GROUP', 'processors', name,
      'COUNT', 10, 'BLOCK', 2000,
      'STREAMS', 'orders:events', '>'
    ) as any[]

    if (!messages) continue

    for (const [, entries] of messages) {
      for (const [id, fields] of entries) {
        const payload = JSON.parse(fields[3])
        try {
          await processEvent(fields[1], payload)
          await redis.xack('orders:events', 'processors', id)
        } catch (err) {
          console.error(\`Falha em \${id}, permanece na PEL\`)
        }
      }
    }
  }
}`,
    },
    {
      title: "Cache-Aside com TTL e invalidação",
      language: "typescript",
      code: `import Redis from 'ioredis'
const redis = new Redis()

const CACHE_TTL = 300 // 5 minutos

async function getUserProfile(userId: string) {
  const cacheKey = \`user:profile:\${userId}\`

  // 1. Tenta cache primeiro
  const cached = await redis.get(cacheKey)
  if (cached) {
    console.log('Cache HIT')
    return JSON.parse(cached)
  }

  // 2. Cache miss — busca do banco
  console.log('Cache MISS')
  const user = await db.users.findById(userId) // seu ORM aqui

  if (user) {
    // 3. Popula cache com TTL
    await redis.set(cacheKey, JSON.stringify(user), 'EX', CACHE_TTL)
  }

  return user
}

// Invalidação ao atualizar
async function updateUserProfile(userId: string, data: object) {
  await db.users.update(userId, data)
  // DEL é mais seguro que SET imediato (evita race condition)
  await redis.del(\`user:profile:\${userId}\`)
}

// Pipeline para buscar múltiplos perfis
async function getMultipleProfiles(userIds: string[]) {
  const pipeline = redis.pipeline()
  userIds.forEach(id => pipeline.get(\`user:profile:\${id}\`))
  const results = await pipeline.exec()
  return results?.map(([, val]) => val ? JSON.parse(val as string) : null)
}`,
    },
  ],
}

export default redis
