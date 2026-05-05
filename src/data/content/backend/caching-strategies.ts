import type { SkillContent } from '@/types'

const cachingStrategies: SkillContent = {
  tagline: "Estrategias de cache: cache-aside, write-through, write-behind, read-through.",
  why: "Cache bem aplicado reduz latência 10-100x e custa uma fração do infra. Senior precisa escolher estrategia certa, saber invalidacao e evitar problemas (stale data, thundering herd, cache poisoning).",
  summary: "Caching armazena resultado de computação cara para servir rápido nas próximas chamadas. Estrategias: cache-aside (app gerencia leitura/escrita), read-through (cache busca do banco automaticamente), write-through (escreve em cache e banco juntos), write-behind (escreve em cache, banco de forma assíncrona). Invalidacao e o problema mais difícil: TTL, event-driven, cache versioning.",
  keypoints: [
    { title: "Cache-aside (Lazy loading)", body: "App le do cache. Miss? Le do banco, escreve no cache, retorna. Simples, resiliente (cache falha, app le do banco). Desvantagem: primeiro request e lento (cold start); consistencia eventual." },
    { title: "Read-through", body: "Cache e responsável por buscar do banco em caso de miss. App sempre conversa com cache. Mais simples na app, mas cache precisa conhecer a origem." },
    { title: "Write-through", body: "Cada escrita vai ao cache E ao banco, sincronamente. Cache sempre frescos. Desvantagem: latência de escrita maior; cache polui com dados raramente lidos." },
    { title: "Write-behind (Write-back)", body: "Escrita vai ao cache imediatamente, banco atualizado de forma assíncrona. Throughput de escrita alto. Risco: perda de dado se cache cai antes do flush." },
    { title: "TTL e invalidacao", body: "TTL simples evita stale infinito. Invalidacao event-driven (pública evento, consumer inválida chaves) e mais precisa. Cache versioning (v1:key -> v2:key) permite deploy sem stale." },
    { title: "Thundering herd", body: "Cache expira, N requests vão ao banco simultaneamente. Mitigação: mutex no cache (só um busca, outros esperam), stale-while-revalidate, jitter no TTL." },
    { title: "Cache levels", body: "L1: in-process (node-cache, Map). L2: Redis/Memcached. L3: CDN (para assets e respostas públicas). Cada nível tem latência, tamanho e consistencia diferentes." },
  ],
  gotchas: [
    "Cache poisoning -- dado inválido ou malicioso cacheado. Valide antes de cachear.",
    "Cache tudo sem TTL -- dado fica stale indefinidamente.",
    "Key collision -- chaves sem namespace (user:123 vs user:123 em contextos diferentes).",
    "Cachear objeto mutável por referência em L1 -- mutação afeta cache.",
    "Esquecer de invalidar cache em delete -- dado removido ainda aparece.",
    "Cache de erro -- cachear resposta de erro pode propagar falha temporaria por horas.",
  ],
  interview: [
    { q: "Cache-aside vs write-through -- quando usar cada?", a: "<p>Cache-aside: padrão para leitura pesada onde miss ocasional e aceitavel. Simples, resiste a falha de cache. Bom para dados lidos frequentemente, escritos raramente.</p><p>Write-through: quando consistencia e crítica e latência de escrita e toleravel. Garante que cache nunca serve dado stale. Ruim para escrita intensiva.</p><p>Write-behind: escrita intensiva onde pequena janela de perda e aceitavel (analytics, contador de views).</p>" },
    { q: "Como lida com thundering herd?", a: "<p>Técnicas:</p><ul><li>Mutex no Redis: SET lock NX EX 5. So um processo busca, outros esperam.</li><li>Stale-while-revalidate: serve dado expirado enquanto atualiza em background.</li><li>Jitter no TTL: TTL = base + random(0, base*0.1). Evita expiracao sincronizada.</li><li>Pre-warming: cron ou evento pre-popula cache antes de expirar.</li></ul>" },
  ],
  resources: [
    { title: "AWS -- Caching Best Practices", url: "https://aws.amazon.com/caching/best-practices/", kind: "docs" },
    { title: "Redis -- Patterns", url: "https://redis.io/docs/manual/patterns/", kind: "docs" },
    { title: "Facebook -- Scaling Memcache", url: "https://www.usenix.org/conference/nsdi13/technical-sessions/presentation/nishtala", kind: "artigo" },
  ],
}

export default cachingStrategies
