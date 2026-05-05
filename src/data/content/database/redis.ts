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
  ],
  interview: [
    {
      q: "Como implementaria distributed lock com Redis?",
      a: "<p>SET lock_key unique_value NX EX 30 — atomic check-and-set com TTL. NX garante que só um cliente adquire. TTL evita deadlock se cliente morrer sem liberar o lock.</p><p>Release: Lua script que verifica se value ainda é o meu antes de DEL (evita liberar lock de outro cliente que adquiriu após TTL expirar).</p><p>Para produção com alta disponibilidade: Redlock (algoritmo oficial) com N instâncias Redis ímpares — lock adquirido quando maioria confirma. Protege contra falha de uma instância.</p>",
      level: "senior",
    },
    {
      q: "Diferença entre List e Stream para fila de tarefas?",
      a: "<p>List (LPUSH/BRPOP): simples, baixa latência, sem consumer groups, sem ack, sem replay. Mensagem consumida é removida — se o consumer morrer, mensagem perde.</p><p>Stream: consumer groups com ack explícito (XACK), replay de mensagens, histórico configurável, múltiplos consumers em paralelo por group, pending entries list para rastrear não-ackadas. Para filas de produção com garantias de entrega, Stream é superior. Para filas simples com baixo risco de perda, List é suficiente e mais simples.</p>",
      level: "pleno",
    },
    {
      q: "Como implementaria rate limiting com Redis?",
      a: "<p>Sliding window com Sorted Set: ZADD key timestamp timestamp, ZREMRANGEBYSCORE key 0 (now-window), ZCARD key para contar requests na janela. Atômico via Lua script.</p><p>Fixed window mais simples: INCR key:minute, EXPIRE key:minute 60. Risco de burst na virada do minuto. Token bucket: mais sofisticado, Lua script com HGET/HSET para tokens e timestamp do último refill.</p>",
      level: "senior",
    },
    {
      q: "O que é Redis Cluster e quais as limitações?",
      a: "<p>Redis Cluster distribui 16.384 hash slots entre múltiplos masters. Cada key mapeia para um slot via CRC16. Client redireciona para o master correto via MOVED redirect.</p><p>Limitações: (1) multi-key commands exigem que todas as keys estejam no mesmo slot — use hash tags {tag}; (2) sem cross-slot transactions; (3) SCAN itera um nó por vez; (4) pub/sub não propaga entre nós. Para sharding sem essas limitações, Redis com client-side sharding ou proxies como Twemproxy são alternativas.</p>",
      level: "senior",
    },
  ],
  resources: [
    { title: "Redis docs", url: "https://redis.io/docs/", kind: "docs" },
    { title: "Redis University", url: "https://university.redis.com/", kind: "curso" },
    { title: "Redis — Data Types Introduction", url: "https://redis.io/docs/data-types/", kind: "docs" },
  ],
}

export default redis
