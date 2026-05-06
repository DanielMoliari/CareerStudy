'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion } from '@/components/pdfs/ComparativeRefPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'

// ── Paleta System Design ──────────────────────────────────────────────────────
const C = '#0EA5E9'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 22 perguntas mais cobradas em entrevistas de system design',
    type: 'qa',
    pages: 10,
    description: 'Perguntas de nível pleno e sênior cobrindo escalabilidade, CAP theorem, consistent hashing, rate limiting, sharding, cache invalidation, fanout, idempotência e back-of-envelope. Com resposta estruturada e dica de como apresentar.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'Cheatsheet de Componentes',
    subtitle: 'O que cada peça faz, quando usar, trade-offs — numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência rápida de todos os componentes: Load Balancer, CDN, Cache (L1-Redis), Message Queue, API Gateway, Read Replica, Sharding, Circuit Breaker, Rate Limiter. O que cada um resolve e quando NÃO usar.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'System design do zero ao staff numa folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 10 categorias: Escalabilidade, Storage, Cache, Networking, Mensageria, API, Segurança, Observabilidade, Confiabilidade e Interview Framework. Checklist de 20 conceitos para auto-avaliação.',
    icon: '03',
    goal: 'Mapeamento mental',
  },
  {
    id: 'comparative',
    title: 'Comparative: SQL vs NoSQL',
    subtitle: 'Relacional vs Document vs Key-Value vs Columnar',
    type: 'comparative',
    pages: 2,
    description: 'Tabela comparativa com 7 critérios: schema, transações ACID, escala horizontal, queries complexas, write throughput, consistência e caso de uso. Com cenários recomendados por tipo de sistema.',
    icon: '04',
    goal: 'Tomada de decisão',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'O que não fazer em entrevistas de system design',
    type: 'antipatterns',
    pages: 3,
    description: 'Os 6 erros mais eliminatórios: pular clarificação, adicionar componentes sem justificar, ignorar SPOF, não estimar antes de escolher storage, não pensar em falha e confundir CAP com teorema impossível.',
    icon: '05',
    goal: 'Reconhecimento de padrão',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual é a diferença entre escala horizontal e vertical? Quando usar cada uma?',
    a: '<p><strong>Escala vertical (scale-up):</strong> trocar por uma máquina mais potente — mais CPU, RAM, disco. Simples de implementar (app não muda), mas tem limite físico e normalmente causa downtime. Custo cresce não-linearmente.</p><p><strong>Escala horizontal (scale-out):</strong> adicionar mais instâncias idênticas atrás de um load balancer. Teoricamente ilimitado, tolerante a falhas, mas exige que a app seja stateless. Estado (sessão, cache) deve ir para Redis ou DB compartilhado.</p><p><strong>Regra prática:</strong> comece vertical (simples), vá horizontal quando o vertical não basta ou quando tolerância a falha é crítica. Bancos de dados geralmente escalam verticalmente por mais tempo que APIs.</p>',
    tip: 'Mencione o trade-off de statelessness: escala horizontal exige que a app não guarde estado em memória. Diga "sticky sessions são um code smell de sistema que não escala horizontalmente".',
  },
  {
    level: 'Pleno',
    q: 'O que é um Load Balancer e quais algoritmos de distribuição existem?',
    a: '<p>Load Balancer distribui requisições entre múltiplos servidores para evitar sobrecarga e garantir disponibilidade. Pode operar em L4 (TCP — mais rápido, menos visibilidade) ou L7 (HTTP — roteamento por path/header, mais caro).</p><p><strong>Algoritmos:</strong></p><ul><li><strong>Round Robin:</strong> sequência circular. Simples, ignora carga real.</li><li><strong>Least Connections:</strong> envia para o servidor com menos conexões ativas. Melhor para requests de duração variável.</li><li><strong>IP Hash:</strong> hash(IP) determina servidor — sticky session sem cookie. Ruim atrás de NAT corporativo.</li><li><strong>Weighted:</strong> servidores com peso maior recebem mais tráfego. Útil para fleet heterogêneo ou canary deploy.</li></ul>',
    tip: 'O entrevistador quer saber quando cada algoritmo falha. Diga: "Round Robin falha quando requests têm duração muito diferente (uploads vs pings). Least Connections resolve isso."',
  },
  {
    level: 'Pleno',
    q: 'Explique o teorema CAP e dê exemplos reais de sistemas em cada posição.',
    a: '<p>O teorema CAP (Brewer, 2000) prova que em sistema distribuído sujeito a partição de rede, você só pode garantir 2 de 3 propriedades:</p><ul><li><strong>C (Consistency):</strong> todo nó vê o dado mais recente.</li><li><strong>A (Availability):</strong> todo request recebe resposta (sem timeout).</li><li><strong>P (Partition Tolerance):</strong> sistema funciona mesmo com falha de rede entre nós.</li></ul><p>Em sistemas reais, P é obrigatório (redes falham). A escolha real é entre C e A durante partição:</p><ul><li><strong>CP:</strong> HBase, Zookeeper, MongoDB (strong) — rejeita requests até consistência restaurada.</li><li><strong>AP:</strong> Cassandra, DynamoDB, CouchDB — responde com dado possivelmente desatualizado.</li></ul>',
    tip: 'Explique que C+A (sem partição) só existe em single-node, o que não é "distribuído" de verdade. O entrevistador quer saber que você entende que P é dado, não escolha.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o Consistent Hashing? Por que é superior ao hash simples?',
    a: '<p><strong>Hash simples:</strong> nó = hash(key) % N. Quando N muda (nó entra ou sai), quase todas as keys precisam ser redistribuídas — custo O(K) onde K = total de keys.</p><p><strong>Consistent Hashing:</strong> servidores e keys são mapeados num anel de hash [0, 2³²). Cada key vai para o primeiro servidor no sentido horário. Quando um nó é removido, só as keys daquele nó são redistribuídas — custo O(K/N).</p><p><strong>Virtual nodes (vnodes):</strong> cada servidor físico ocupa múltiplos pontos no anel. Isso garante distribuição uniforme mesmo com poucos servidores e facilita rebalancing quando servidores têm capacidades diferentes.</p><p><strong>Usado em:</strong> Cassandra, DynamoDB, Memcached, Redis Cluster.</p>',
    tip: 'Diga que o problema do hash simples é redistribuição total, não apenas o cálculo. E mencione vnodes como solução para distribuição desigual — é detalhe que separa pleno de sênior.',
  },
  {
    level: 'Senior',
    q: 'Quais são as estratégias de cache invalidation? Qual é mais segura e qual tem melhor performance?',
    a: '<p><strong>Cache Aside (Lazy Loading):</strong> app tenta cache → miss → busca DB → salva cache. Cache só tem dados acessados. Risco: race condition em writes concorrentes (mitigado com lock ou version).</p><p><strong>Write Through:</strong> ao escrever no DB, escreve no cache simultaneamente. Cache sempre consistente, mas write latência dobra. Cache pode ter dados nunca lidos.</p><p><strong>Write Behind (Write Back):</strong> escreve no cache e confirma ao cliente imediatamente. Persiste no DB de forma assíncrona. Melhor throughput de write, mas risco de perda de dados se cache cair antes de persistir.</p><p><strong>Read Through:</strong> cache fica na frente do DB. App só fala com cache; cache busca no DB em miss. Simples mas menos controle.</p><p><strong>Regra:</strong> Cache Aside para leitura geral. Write Through para dados críticos lidos imediatamente após write. Write Behind só com tolerância a perda (contadores, views).</p>',
    tip: 'O entrevistador quer ouvir "Write Behind tem risco de perda de dados — nunca use para transações financeiras". Essa consciência de trade-off separa sênior de pleno.',
  },
  {
    level: 'Senior',
    q: 'Como você implementa rate limiting? Compare Token Bucket e Sliding Window.',
    a: '<p>Rate limiting protege backends de sobrecarga e clientes abusivos. As principais abordagens com Redis:</p><p><strong>Token Bucket:</strong> balde com capacidade B e taxa de recarga R/s. Request consome 1 token; sem token = 429. Permite burst controlado (capacidade do balde). Implementação: DECR atômico no Redis com recarga por cron ou via script Lua.</p><p><strong>Fixed Window Counter:</strong> INCR por janela fixa de tempo. Simples (1 operação Redis), mas vulnerável ao edge-case da borda da janela: 2× burst em 1 segundo cruzando janelas.</p><p><strong>Sliding Window Log:</strong> Sorted Set com timestamps. ZREMRANGEBYSCORE remove expirados, ZCARD conta ativos. Preciso mas O(max_requests) de memória por usuário.</p><p><strong>Na prática:</strong> Token Bucket para APIs com burst legítimo (uploads). Sliding Window para APIs críticas onde precisão importa.</p>',
    tip: 'Mencione que rate limiting deve ser em múltiplas camadas: LB (DDoS grosseiro), API Gateway (por usuário), e dentro do serviço (por endpoint). E que distribuído requer Redis — não funciona com state local em múltiplas instâncias.',
  },
  {
    level: 'Senior',
    q: 'Explique fanout-on-write vs fanout-on-read para timeline de redes sociais.',
    a: '<p>Para o feed de um usuário (ex: Twitter/Instagram), há duas estratégias:</p><p><strong>Fanout-on-write (push model):</strong> quando usuário A publica, escreve o post no cache de timeline de todos os seguidores imediatamente. Leitura é O(1) — apenas lê da própria timeline no Redis. Ruim para usuários com milhões de seguidores (celebridades): 1 post = 10M escritas no Redis.</p><p><strong>Fanout-on-read (pull model):</strong> ao carregar o feed, busca posts de todos os seguidos e agrega. Sem cache extra no write, mas leitura é O(seguidos) — pode ser lento para usuários que seguem milhares.</p><p><strong>Solução híbrida (Twitter):</strong> fanout-on-write para usuários comuns (&lt;10K seguidores) + fanout-on-read para celebridades. Ao carregar feed, mescla timeline pré-computada com posts recentes de celebridades seguidas.</p>',
    tip: 'Este é um dos problemas mais frequentes em entrevistas staff. Apresente o problema das celebridades espontaneamente — não espere o entrevistador perguntar. Isso demonstra que você pensou no edge case.',
  },
  {
    level: 'Senior',
    q: 'O que é idempotência e por que é crítica em sistemas distribuídos?',
    a: '<p>Uma operação é <strong>idempotente</strong> se aplicá-la múltiplas vezes produz o mesmo resultado que aplicar uma vez. GET e DELETE são naturalmente idempotentes. POST (criar) não é — a menos que você implemente.</p><p><strong>Por que importa:</strong> em sistemas distribuídos, qualquer mensagem pode ser entregue mais de uma vez (at-least-once delivery). Retry de rede, timeout no produtor, restart de consumer — todos podem causar reprocessamento.</p><p><strong>Implementação:</strong> <code>idempotency_key</code> no header HTTP (Stripe usa isso). Server salva o resultado da primeira execução com a chave como identificador. Requisições subsequentes com a mesma chave retornam o resultado cacheado sem executar novamente.</p><p><strong>No Kafka:</strong> enable.idempotence=true garante exactly-once semantics no producer. Consumers ainda precisam de idempotência própria.</p>',
    tip: 'Mencione o padrão de implementação concreto: "Uso Redis SETNX para guardar idempotency_key com TTL. Se a chave já existe, retorno o resultado salvo sem processar." Isso diferencia teoria de implementação real.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre API Gateway e Load Balancer? Quando usar cada um?',
    a: '<p><strong>Load Balancer</strong> opera em L4 (TCP) ou L7 (HTTP) e distribui tráfego entre instâncias do mesmo serviço. Sem lógica de negócio — só balanceamento e health check.</p><p><strong>API Gateway</strong> é um L7 com superpoderes: autenticação/autorização, rate limiting por usuário, transformação de request/response, roteamento para múltiplos serviços, logging, circuit breaker. Faz agregação (BFF pattern — Backend for Frontend).</p><p><strong>Na prática:</strong> LB + API Gateway são complementares. LB distribui tráfego entre instâncias do API Gateway. API Gateway gerencia lógica transversal (cross-cutting concerns).</p><p><strong>BFF (Backend for Frontend):</strong> API Gateway especializado por tipo de cliente. Mobile BFF retorna payload comprimido e menor; Web BFF retorna dados ricos. Evita over-fetching e under-fetching.</p>',
    tip: 'Diga "API Gateway é onde você centraliza autenticação — não dentro de cada microservice. Isso evita duplicação e garante que toda requisição passe pelo mesmo check de segurança."',
  },
  {
    level: 'Senior',
    q: 'Como você abordaria sharding de banco de dados? Quais são os riscos?',
    a: '<p><strong>Sharding</strong> divide os dados horizontalmente em múltiplos bancos (shards), cada um responsável por uma partição. Permite escalar além do limite de uma única instância.</p><p><strong>Estratégias de shard key:</strong></p><ul><li><strong>Range-based:</strong> shard por intervalo (A–M no shard 1, N–Z no shard 2). Simples, mas hot shards se distribuição não for uniforme.</li><li><strong>Hash-based:</strong> hash(shard_key) % N. Distribuição uniforme, mas sem suporte a range queries.</li><li><strong>Directory-based:</strong> lookup service determina shard. Flexível, mas lookup é SPOF.</li></ul><p><strong>Riscos:</strong></p><ul><li><strong>Hot shards:</strong> shard key com baixa cardinalidade (ex: país) concentra tráfego.</li><li><strong>Cross-shard queries:</strong> JOINs entre shards são caros ou impossíveis — dado deve ser denormalizado.</li><li><strong>Rebalancing:</strong> adicionar shard = redistribuir dados com downtime ou rolling migration complexa.</li></ul>',
    tip: 'Mencione que sharding é último recurso — antes de shardar, tente read replicas + caching. E diga que tenant_id ou user_id são boas shard keys: alta cardinalidade e queries geralmente filtram por eles.',
  },
  {
    level: 'Pleno',
    q: 'Como fazer back-of-envelope calculations? Dê um exemplo com Twitter.',
    a: '<p>Back-of-envelope é estimativa rápida para validar se a arquitetura faz sentido na escala exigida. Números base para memorizar:</p><ul><li>1 server moderno: 10–50K req/s</li><li>SSD: 100K–500K IOPS, latência 0.1ms</li><li>HDD: 200 IOPS, latência 10ms</li><li>Redis: 100K+ ops/s</li><li>Rede LAN: 1GB/s, Rede inter-DC: 100MB/s</li></ul><p><strong>Exemplo Twitter (300M DAU, 5 tweets/user/dia):</strong></p><ul><li>Writes: 300M × 5 / 86.400 ≈ 17K tweets/s (pico 3× = 51K/s)</li><li>Reads: ratio 100:1 → 1.7M reads/s</li><li>Storage: tweet ~300B, mídia ~150KB médio. 17K × 300B = 5MB/s texto. Com mídia: ~2.5GB/s</li><li>Por 10 anos: ~79PB só de mídia</li></ul>',
    tip: 'Não precisa ser exato — ordem de magnitude é suficiente. O entrevistador quer ver o processo, não o número. Diga "estou arredondando para facilitar" e prossiga.',
  },
  {
    level: 'Senior',
    q: 'O que é a estratégia de Circuit Breaker e quando usar?',
    a: '<p>Circuit Breaker é um padrão de resiliência que monitora chamadas a serviços externos e "abre o circuito" após N falhas consecutivas, rejeitando chamadas por um período antes de tentar novamente.</p><p><strong>Estados:</strong></p><ul><li><strong>Closed (normal):</strong> chamadas passam normalmente. Contador de falhas monitorado.</li><li><strong>Open (falha):</strong> chamadas rejeitadas imediatamente sem tentar o serviço. Retorna fallback.</li><li><strong>Half-Open (recuperação):</strong> deixa passar poucas chamadas para testar se serviço voltou. Se sucesso → Closed. Se falha → Open novamente.</li></ul><p>Combinado com <strong>timeout</strong> (toda chamada externa tem timeout máximo) e <strong>retry com exponential backoff + jitter</strong> (evitar thundering herd ao retomar).</p><p><strong>Implementações:</strong> Resilience4j (Java), polly (.NET), opossum (Node.js).</p>',
    tip: 'Mencione o problema que ele resolve: sem Circuit Breaker, um serviço lento segura threads/conexões da app inteira, causando cascade failure. Com o padrão, a falha fica isolada.',
  },
  {
    level: 'Senior',
    q: 'Como você garantiria consistência em um sistema com múltiplos bancos de dados?',
    a: '<p>Distribuir dados entre múltiplos bancos torna transações ACID impossíveis sem protocolo distribuído. As opções:</p><p><strong>2-Phase Commit (2PC):</strong> coordenador prepara todos os participantes, depois comita. Consistência forte, mas coordenador é SPOF e protocolo é síncrono (latência alta, blocking).</p><p><strong>Saga Pattern:</strong> sequência de transações locais com eventos de compensação em caso de falha. Eventual consistency, mas sem bloqueio. Dois sabores: <em>Choreography</em> (cada serviço reage a eventos) e <em>Orchestration</em> (orquestrador central coordena).</p><p><strong>Outbox Pattern:</strong> ao salvar no DB, também salva o evento na tabela outbox na mesma transação. Worker lê a outbox e publica no broker. Garante que evento é publicado exatamente uma vez.</p><p>Na maioria dos casos, aceitar eventual consistency + Saga + Outbox é a abordagem correta para microservices. 2PC fica para sistemas legados ou bancários.</p>',
    tip: 'O Outbox Pattern é frequentemente esquecido e é muito prático — mencione que ele resolve o problema de "publiquei o evento mas o DB falhou (ou vice-versa)".',
  },
  {
    level: 'Senior',
    q: 'Projete o sistema de armazenamento de mensagens do WhatsApp (simplificado).',
    a: '<p><strong>Clarificação:</strong> 2B usuários, 100B msgs/dia (~1.2M msgs/s pico), end-to-end encryption, mensagens expiram após entrega.</p><p><strong>Estimativa:</strong> 1.2M msgs/s, ~100B por mensagem = 120GB/s de writes. Precisamos de sharding desde o início.</p><p><strong>Design:</strong></p><ul><li><strong>WebSocket:</strong> conexão persistente por cliente. Servidor mantém mapa userId → connectionId.</li><li><strong>Presence Service:</strong> heartbeat a cada 30s. Redis com TTL para online/offline status.</li><li><strong>Message Service:</strong> recebe mensagem, salva em Cassandra (write-heavy, sem JOIN), publica em Kafka.</li><li><strong>Fan-out:</strong> consumer Kafka determina receptor, verifica se online → entrega via WebSocket. Offline → salva fila de pendentes.</li><li><strong>Shard Key:</strong> chat_id ou user_id para Cassandra — queries sempre filtram por conversa.</li></ul>',
    tip: 'Em entrevistas de WhatsApp/Messenger, o entrevistador foca em presença de usuário e entrega offline. Mencione "mensagem confirmada = ack do servidor (1 tick), entregue ao device = ack do app receptor (2 ticks)".',
  },
  {
    level: 'Pleno',
    q: 'O que é eventual consistency e quando é aceitável?',
    a: '<p><strong>Eventual consistency</strong> garante que se não houver novas atualizações, eventualmente todos os nós convergirão para o mesmo valor. Durante a janela de inconsistência, diferentes nós podem retornar valores diferentes.</p><p><strong>Quando é aceitável:</strong></p><ul><li>Feed de redes sociais — ver post 2s depois do publish é ok.</li><li>Contadores de likes/views — aproximação é suficiente.</li><li>DNS — propagação de registros leva minutos.</li><li>Carrinho de compras read — inconsistência temporária não causa dano.</li></ul><p><strong>Quando NÃO é aceitável:</strong></p><ul><li>Saldo bancário — nunca aceitar leitura de saldo desatualizado.</li><li>Inventário em checkout — duas compras do último item.</li><li>Permissões de segurança — revogar acesso deve ser imediato.</li></ul>',
    tip: 'Apresente o trade-off proativamente: "Escolhi eventual consistency para o feed. O usuário pode ver o post 2 segundos depois — aceitável. Em troca, ganho 100x mais throughput de leitura. Documente esse trade-off explicitamente para o entrevistador."',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Message Queue e Event Streaming (Kafka vs RabbitMQ)?',
    a: '<p><strong>Message Queue (RabbitMQ, SQS):</strong> mensagem é consumida por um consumer e deletada. Push-based — broker empurra para consumer. Roteamento rico (topic exchange, fanout, direct). Ideal para task queues, workflows, RPC assíncrono.</p><p><strong>Event Streaming (Kafka):</strong> eventos são persistidos em log imutável. Múltiplos consumer groups podem ler o mesmo evento independentemente. Pull-based — consumer controla o offset. Retém dados por dias/semanas. Ideal para event sourcing, audit log, real-time analytics, reprocessamento.</p><p><strong>Decisão:</strong></p><ul><li>Precisa processar cada mensagem uma vez → RabbitMQ / SQS</li><li>Múltiplos consumidores independentes / reprocessar histórico → Kafka</li><li>Managed, simples, AWS → SQS</li><li>Alta vazão, retenção longa → Kafka</li></ul>',
    tip: 'A diferença-chave: em Kafka, deletar o consumer group não perde mensagens. Em RabbitMQ, a mensagem foi embora após o ACK. Kafka é um log que vários readers compartilham — cada um em seu offset.',
  },
  {
    level: 'Senior',
    q: 'Como você garantiria disponibilidade de 99.99% (four nines)?',
    a: '<p>99.99% = ~52 minutos de downtime/ano. Atingir isso requer eliminar cada SPOF e ter runbooks de recuperação rápida.</p><p><strong>Estratégias:</strong></p><ul><li><strong>Redundância em toda camada:</strong> Multi-AZ mínimo, Multi-Region para SLA crítico.</li><li><strong>Active-Active vs Active-Passive:</strong> active-active (ambas regiões servem tráfego) é mais rápido no failover, mas exige sincronização de dado entre regiões.</li><li><strong>Health checks + failover automático:</strong> Route53 health check, ELB targets, Kubernetes liveness/readiness probes.</li><li><strong>Deployment sem downtime:</strong> blue-green, canary, rolling update.</li><li><strong>Chaos Engineering:</strong> Chaos Monkey para testar resiliência antes que produção o faça.</li><li><strong>Circuit Breaker + Bulkhead:</strong> isolar falhas para não propagar entre serviços.</li><li><strong>Backpressure:</strong> rejeitar tráfego graciosamente quando sobrecarregado (fail fast &gt; timeout).</li></ul>',
    tip: 'Mencione que SLA de 99.99% é raramente sobre código — é sobre processo: runbooks, on-call, incident response com RTO/RPO definidos. A arquitetura ajuda, mas o processo é o que garante o SLA na prática.',
  },
  {
    level: 'Senior',
    q: 'Como funciona replicação de banco de dados? Quais são os modos e seus trade-offs?',
    a: '<p>Replicação copia dados do primary para replicas para escalar leituras e garantir tolerância a falha.</p><p><strong>Modos de replicação:</strong></p><ul><li><strong>Assíncrona (padrão):</strong> primary confirma write sem esperar replica. Máximo throughput, mas replica pode ficar atrás (replication lag). Em failover, pode perder writes não replicados (RPO &gt; 0).</li><li><strong>Síncrona:</strong> primary espera confirmação da replica antes de confirmar ao cliente. Zero perda de dado, mas latência dobra e write bloqueia se replica cair.</li><li><strong>Semi-síncrona (MySQL):</strong> espera 1 replica confirmar antes de continuar. Equilíbrio entre durabilidade e performance.</li></ul><p><strong>PostgreSQL streaming replication:</strong> WAL (Write-Ahead Log) é enviado em streaming para standbys. Hot standby permite leituras na replica. Replication slots evitam WAL ser descartado antes que replica consuma.</p>',
    tip: 'Mencione replication lag como problema real em leituras: se usuário escreve e lê imediatamente da replica, pode ver dado desatualizado. Solução: "read your own writes" — redirecionar leitura imediata para primary.',
  },
  {
    level: 'Senior',
    q: 'O que é o problema de hot keys em cache e como mitigar?',
    a: '<p><strong>Hot keys</strong> são chaves acessadas com frequência desproporcional no Redis — ex: página de produto viral, resultado de jogo ao vivo. Um único shard do Redis recebe a maior parte das operações, tornando-se gargalo mesmo com cluster.</p><p><strong>Soluções:</strong></p><ul><li><strong>Local cache (in-process):</strong> cache em memória no próprio processo de API com TTL muito curto (1–5s). Reduz 99% das chamadas ao Redis para chaves ultra-hot.</li><li><strong>Key scattering:</strong> criar N cópias da chave (product:123:shard_0 a product:123:shard_9), ler aleatoriamente. Distribui carga entre shards, mas aumenta memória N×.</li><li><strong>Read-through com lock:</strong> thundering herd em cache miss → apenas 1 processo busca do DB, os outros esperam (lock com Redis SETNX).</li><li><strong>CDN para hot content:</strong> se o conteúdo é público e pode ter TTL de segundos → CDN absorve o tráfego antes de chegar no Redis.</li></ul>',
    tip: 'O entrevistador quer ver que você sabe que Redis cluster não resolve hot keys — o problema é distribuição dentro do mesmo shard. Local cache no processo é a solução mais eficiente para reads ultra-frequentes.',
  },
  {
    level: 'Pleno',
    q: 'O que é o padrão Outbox e quando usar?',
    a: '<p>O <strong>Outbox Pattern</strong> resolve o problema de "salvar no DB e publicar evento de forma atômica" sem 2PC.</p><p><strong>Problema:</strong> se você salva no DB e depois tenta publicar no Kafka, o processo pode cair entre os dois — DB atualizado, evento não publicado. O inverso também falha.</p><p><strong>Solução Outbox:</strong></p><ol><li>Na mesma transação do DB, salva o dado e insere o evento na tabela <code>outbox</code>.</li><li>Um worker (ou CDC — Change Data Capture com Debezium) lê a outbox e publica no broker.</li><li>Após confirmação do broker, marca o evento como publicado na outbox.</li></ol><p>Garante que o evento é publicado <em>at-least-once</em>. Consumer deve ser idempotente para lidar com duplicatas.</p>',
    tip: 'Mencione CDC (Debezium + Kafka Connect) como implementação elegante: monitora o binlog do MySQL/PostgreSQL e publica mudanças automaticamente. Sem polling — puramente event-driven.',
  },
  {
    level: 'Senior',
    q: 'Como você monitoraria e debugaria um sistema distribuído em produção?',
    a: '<p>Debugging em sistema distribuído requer os 3 pilares de observabilidade:</p><p><strong>Logs:</strong> logs estruturados (JSON) com correlation_id em toda request. Log level configurável por rota/usuário. Centralizado em ELK ou CloudWatch Logs. Não logar dados sensíveis (PII).</p><p><strong>Métricas:</strong> RED metrics por serviço: Rate (req/s), Errors (%), Duration (p50/p95/p99). Prometheus + Grafana. Alerts em p99 de latência e error rate. SLO burning rate alerts para SLA proativo.</p><p><strong>Distributed Tracing:</strong> trace_id propagado em todos os headers entre serviços (W3C TraceContext). Jaeger ou AWS X-Ray. Visualiza o caminho de uma request em todos os serviços com latência por hop.</p><p><strong>Processo:</strong> alert dispara → dashboard de overview → trace do request problemático → logs do serviço específico → fix e post-mortem com 5 Whys.</p>',
    tip: 'Mencione que sem correlation_id, debugging em microservices é praticamente impossível. O primeiro refactor que você faz numa empresa nova deve ser adicionar correlation_id em todas as requests.',
  },
  {
    level: 'Senior',
    q: 'Como você projetaria um sistema de notificações push para 100M usuários?',
    a: '<p><strong>Clarificação:</strong> notificações push para mobile (iOS/Android), email, SMS. 100M usuários, 10M notificações/hora.</p><p><strong>Design:</strong></p><ol><li><strong>Notification Service:</strong> API que recebe notificações e publica em Kafka por tipo (push, email, sms).</li><li><strong>User Preference Service:</strong> verifica se usuário optou-in por tipo, fuso horário, quiet hours. Cache Redis das preferências.</li><li><strong>Fan-out Worker:</strong> consumer Kafka expande para usuários-alvo. Para 1 evento de "nova promoção", pode gerar 10M notificações.</li><li><strong>Priority Queues:</strong> fila de alta prioridade (transacional) vs baixa (marketing). SLA diferentes.</li><li><strong>Platform Adapters:</strong> FCM (Android), APNS (iOS), SES (email), SNS (SMS). Rate limit por plataforma.</li><li><strong>Delivery Tracking:</strong> status por notificação: sent, delivered, opened. DynamoDB por volume.</li></ol>',
    tip: 'Menção ao throttling por plataforma é detalhe sênior: FCM tem rate limit de 600K msgs/min por projeto. APNS rejeita tokens inválidos — você deve limpar tokens expirados periodicamente.',
  },
]

// ── Dados: Mind Map ───────────────────────────────────────────────────────────

const MINDMAP_CATS: MindmapCategory[] = [
  {
    label: 'Interview Framework',
    color: '#0EA5E9',
    items: [
      { t: 'Clarify → Estimate → API → Data → High-level → Deep dive → Tradeoffs', k: true },
      { t: 'Perguntar DAU, regiões, latência, consistência, custo', k: true },
      { t: 'Back-of-envelope antes de escolher storage', k: true },
      { t: 'Nomear o que você está sacrificando' },
    ],
  },
  {
    label: 'Escalabilidade',
    color: '#0EA5E9',
    items: [
      { t: 'Vertical vs Horizontal — statelessness é pré-requisito do horizontal', k: true },
      { t: 'Load Balancer: Round Robin, Least Conn, IP Hash, Weighted', k: true },
      { t: 'Consistent Hashing — redistribuição mínima na mudança de nós', a: true },
      { t: 'Sharding — shard key, hot shards, cross-shard queries', a: true },
    ],
  },
  {
    label: 'Storage & Banco',
    color: '#0284C7',
    items: [
      { t: 'SQL: ACID, JOINs, escala vertical, schema rígido', k: true },
      { t: 'NoSQL Document (MongoDB): schema flexível, write-heavy', k: true },
      { t: 'NoSQL Key-Value (Redis/DynamoDB): O(1), sem relações', k: true },
      { t: 'NoSQL Columnar (Cassandra): write-optimized, petabytes', a: true },
      { t: 'Read Replica — replication lag, read-your-own-writes', k: true },
    ],
  },
  {
    label: 'Cache',
    color: '#0284C7',
    items: [
      { t: 'Cache Aside, Write Through, Write Behind, Read Through', k: true },
      { t: 'Hot keys — local cache in-process, key scattering', a: true },
      { t: 'Cache Stampede / Thundering Herd — lock com SETNX', a: true },
      { t: 'CDN — assets, HTML pre-renderizado, Cache-Control headers', k: true },
    ],
  },
  {
    label: 'Mensageria',
    color: '#0369A1',
    items: [
      { t: 'Message Queue (RabbitMQ/SQS) — task queue, consume-once', k: true },
      { t: 'Event Streaming (Kafka) — log imutável, multiple consumers', k: true },
      { t: 'Ack/Nack, DLQ, retry com exponential backoff', k: true },
      { t: 'Outbox Pattern — evento + dado na mesma transação', a: true },
    ],
  },
  {
    label: 'Resiliência',
    color: '#0369A1',
    items: [
      { t: 'Circuit Breaker — Closed / Open / Half-Open', a: true },
      { t: 'Timeout + Retry com exponential backoff + jitter', k: true },
      { t: 'Bulkhead — isolamento de falhas entre serviços', a: true },
      { t: 'Idempotência — idempotency keys, exactly-once semantics', a: true },
    ],
  },
  {
    label: 'CAP Theorem',
    color: '#075985',
    items: [
      { t: 'C+A impossível em sistema verdadeiramente distribuído', k: true },
      { t: 'CP — HBase, Zookeeper, MongoDB (strong)', k: true },
      { t: 'AP — Cassandra, DynamoDB, CouchDB', k: true },
      { t: 'Eventual Consistency — quando aceitar, quando recusar', k: true },
    ],
  },
  {
    label: 'Rate Limiting',
    color: '#075985',
    items: [
      { t: 'Token Bucket — burst controlado, Redis DECR', a: true },
      { t: 'Fixed Window — simples mas borda da janela vaza 2x', k: true },
      { t: 'Sliding Window Log — preciso, custo de memória O(N)', a: true },
      { t: 'Múltiplas camadas: LB → API Gateway → serviço → endpoint', k: true },
    ],
  },
  {
    label: 'API & Networking',
    color: '#0C4A6E',
    items: [
      { t: 'API Gateway — auth, rate limit, roteamento centralizado', k: true },
      { t: 'BFF — Backend for Frontend, payload por tipo de client', a: true },
      { t: 'REST vs gRPC — REST para público, gRPC para inter-service', k: true },
      { t: 'WebSocket — conexão persistente para real-time', k: true },
    ],
  },
  {
    label: 'Observabilidade',
    color: '#0C4A6E',
    items: [
      { t: 'Logs estruturados + correlation_id + centralizados (ELK)', k: true },
      { t: 'Métricas RED: Rate, Errors, Duration (p50/p95/p99)', k: true },
      { t: 'Distributed Tracing — Jaeger, X-Ray, W3C TraceContext', a: true },
      { t: 'SLO burning rate alerts — proativo antes de violar SLA', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Sei calcular QPS, storage e bandwidth de trás do envelope',
  'Conheço CAP theorem e exemplos reais de cada posição',
  'Sei quando usar SQL vs NoSQL vs Redis vs Cassandra',
  'Entendo as 4 estratégias de cache invalidation',
  'Conheço os 4 algoritmos de load balancer e seus trade-offs',
  'Sei implementar rate limiting com Redis (token bucket + sliding window)',
  'Entendo consistent hashing e por que é melhor que hash simples',
  'Sei a diferença entre Kafka e RabbitMQ/SQS',
  'Conheço o padrão Outbox e Saga',
  'Sei desenhar fanout-on-write vs fanout-on-read para feeds',
  'Entendo Circuit Breaker e como prevenir cascade failure',
  'Sei o que é idempotência e como implementar',
  'Consigo nomear os trade-offs de cada escolha arquitetural',
  'Sei o framework de 7 passos para entrevista de system design',
  'Conheço a diferença entre API Gateway e Load Balancer',
]

// ── Dados: Comparative (SQL vs NoSQL) ────────────────────────────────────────

const COMP_OPTIONS: CompOption[] = [
  { name: 'SQL (Relacional)',  color: '#4479A1' },
  { name: 'NoSQL Document',   color: '#47A248' },
  { name: 'NoSQL Key-Value',  color: '#DC382D' },
  { name: 'NoSQL Columnar',   color: '#F59E0B' },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Schema',
    values: {
      'SQL (Relacional)': 'Rígido, validado, normalizado — integridade garantida',
      'NoSQL Document':   'Flexível, schema-optional — pode virar bagunça',
      'NoSQL Key-Value':  'Sem schema — payload opaco para o banco',
      'NoSQL Columnar':   'Colunas definidas, mas linhas heterogêneas',
    },
    winner: 'SQL (Relacional)',
  },
  {
    criterion: 'Transações ACID',
    values: {
      'SQL (Relacional)': 'ACID nativo, multi-row transactions',
      'NoSQL Document':   'ACID em documento único; multi-doc limitado',
      'NoSQL Key-Value':  'Sem transação (Redis MULTI é limitado)',
      'NoSQL Columnar':   'Eventual consistency por padrão; LWT custoso',
    },
    winner: 'SQL (Relacional)',
  },
  {
    criterion: 'Escala horizontal',
    values: {
      'SQL (Relacional)': 'Complexo — sharding manual, JOINs limitam partição',
      'NoSQL Document':   'Sharding nativo, ReplicaSet fácil de configurar',
      'NoSQL Key-Value':  'Sharding trivial — sem relações para coordenar',
      'NoSQL Columnar':   'Projetado para petabytes, anel Cassandra escala linear',
    },
    winner: 'NoSQL Key-Value',
  },
  {
    criterion: 'Queries ad-hoc',
    values: {
      'SQL (Relacional)': 'SQL completo — JOINs, subqueries, window functions, CTEs',
      'NoSQL Document':   'Aggregation pipeline — poderoso mas verbose',
      'NoSQL Key-Value':  'Só por chave — sem scan, sem filter',
      'NoSQL Columnar':   'CQL, mas sem JOINs — leitura via partition key',
    },
    winner: 'SQL (Relacional)',
  },
  {
    criterion: 'Write throughput',
    values: {
      'SQL (Relacional)': 'WAL + fsync + locks limitam; ~10K writes/s num servidor',
      'NoSQL Document':   'Write concern configurável; write-heavy viável',
      'NoSQL Key-Value':  '100K+ ops/s — memória é o limite, não disco',
      'NoSQL Columnar':   'Append-only SSTables — write otimizado por design',
    },
    winner: 'NoSQL Key-Value',
  },
  {
    criterion: 'Caso de uso ideal',
    values: {
      'SQL (Relacional)': 'Fintech, e-commerce, ERP, CRM, qualquer dado relacional',
      'NoSQL Document':   'CMS, catálogo, configuração, perfil de usuário',
      'NoSQL Key-Value':  'Cache, sessão, leaderboard, rate limiting, feature flags',
      'NoSQL Columnar':   'IoT, séries temporais, logs de alta vazão, analytics',
    },
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const SD_PDF_ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Pular clarificação e ir direto ao desenho',
    badDesc: 'Dev começa a desenhar sem fazer nenhuma pergunta',
    badCode: [
      { t: '// Entrevistador: "Projete o Twitter"', c: '#64748b' },
      { t: '// Dev desenha imediatamente sem perguntar', c: '#ef4444' },
      { t: 'Client --> LB --> API --> MySQL', c: '#ef4444' },
      { t: '// 20 min depois: "e se forem 500M usuários globais?"', c: '#64748b' },
      { t: '// Redesenha tudo — tempo desperdiçado', c: '#ef4444' },
    ],
    goodDesc: 'Dev pergunta antes de desenhar qualquer componente',
    goodCode: [
      { t: '// Dev pergunta ANTES de desenhar qualquer caixa:', c: '#64748b' },
      { t: '"Quantos DAUs? Leitura ou escrita pesada?"', c: '#22c55e' },
      { t: '"Latência máxima? Sistema global?"', c: '#22c55e' },
      { t: '"Precisa de consistência forte?"', c: '#22c55e' },
      { t: '// 5 min de perguntas evitam 30 min de retrabalho', c: '#22c55e' },
    ],
    why: 'Sem clarificar, você pode passar 30 minutos desenhando o sistema errado.',
  },
  {
    title: 'Adicionar componentes sem justificar',
    badDesc: 'Cita tecnologias sem explicar por que cada uma é necessária',
    badCode: [
      { t: '// "Vou usar Kafka + Cassandra + Redis + gRPC + ElasticSearch"', c: '#ef4444' },
      { t: '// Sem explicar por que cada um', c: '#64748b' },
      { t: '// Cada componente = custo operacional + modo de falha', c: '#ef4444' },
    ],
    goodDesc: 'Cada componente é justificado por um gargalo específico',
    goodCode: [
      { t: '"Redis: timeline cache, O(1) read, TTL automático"', c: '#22c55e' },
      { t: '"Kafka: desacopla fanout, consumer independente"', c: '#22c55e' },
      { t: '"Cassandra: write-heavy 50K/s, sem JOIN necessário"', c: '#22c55e' },
      { t: '// Cada componente justificado por um gargalo específico', c: '#22c55e' },
    ],
    why: 'Usar tecnologia sem justificar é red flag. Senior usa o mínimo necessário.',
  },
  {
    title: 'Ignorar Single Point of Failure (SPOF)',
    badDesc: 'Banco único sem replica — qualquer falha derruba tudo',
    badCode: [
      { t: 'API Server --> Single PostgreSQL (Primary)', c: '#ef4444' },
      { t: '// Sem replica, sem failover', c: '#64748b' },
      { t: '// DB cai -> sistema inteiro para', c: '#ef4444' },
    ],
    goodDesc: 'Primary com Read Replica e failover automático',
    goodCode: [
      { t: 'API (reads) --> Read Replica', c: '#22c55e' },
      { t: 'API (writes) --> Primary DB', c: '#22c55e' },
      { t: 'Primary --> Replica (async replication)', c: '#22c55e' },
      { t: '// Route53 health check -> failover automático', c: '#22c55e' },
    ],
    why: 'Todo sistema em produção tem falhas. SPOF é o primeiro a identificar.',
  },
  {
    title: 'Não fazer back-of-envelope antes de escolher storage',
    badDesc: 'Escolhe SQL sem calcular volume de dados e escrita',
    badCode: [
      { t: '// "Vou usar SQL para os tweets"', c: '#64748b' },
      { t: '// Sem calcular: 500M tweets/dia = 5.8K/s writes', c: '#ef4444' },
      { t: '// Storage: 200B x 500M = 100GB/dia -> 36TB/ano', c: '#ef4444' },
      { t: '// SQL single node nao aguenta — novo redesign', c: '#ef4444' },
    ],
    goodDesc: 'Estima QPS e storage antes de qualquer decisão de banco',
    goodCode: [
      { t: 'QPS = DAU x writes_per_day / 86400', c: '#22c55e' },
      { t: 'Storage_day = QPS x record_bytes x 86400', c: '#22c55e' },
      { t: '// 5.8K writes/s -> escolhe NoSQL write-optimized', c: '#22c55e' },
      { t: '// Cálculo leva 2 min e evita redesign completo', c: '#22c55e' },
    ],
    why: 'Escolher storage sem estimar é escolher banco de dados no escuro.',
  },
  {
    title: 'Guardar sessão em memória do servidor',
    badDesc: 'Sessão em Map local — impede escala horizontal',
    badCode: [
      { t: '// Guarda sessão em memória do processo Node.js', c: '#64748b' },
      { t: 'const sessions = new Map() // nao escala', c: '#ef4444' },
      { t: '// 3 instâncias -> 3 maps diferentes', c: '#64748b' },
      { t: '// LB roteia usuário para outra instância', c: '#ef4444' },
      { t: '// Sessão perdida -> usuário deslogado', c: '#ef4444' },
    ],
    goodDesc: 'Sessão centralizada no Redis compartilhada por todas as instâncias',
    goodCode: [
      { t: '// Sessão em Redis compartilhado entre instâncias', c: '#22c55e' },
      { t: 'await redis.setex("session:" + id, 3600, payload)', c: '#22c55e' },
      { t: '// Qualquer instância lê a mesma sessão', c: '#22c55e' },
      { t: '// Scale out transparente sem sticky sessions', c: '#22c55e' },
    ],
    why: 'Sessão em memória local impede escala horizontal. Redis resolve com latência de ~1ms.',
  },
  {
    title: 'Consultar DB diretamente sem cache para dados hot',
    badDesc: '10K req/s batendo direto no Postgres para o mesmo registro',
    badCode: [
      { t: '// 10K req/s no perfil público de usuário famoso', c: '#64748b' },
      { t: 'SELECT * FROM users WHERE id = ?  // sem cache', c: '#ef4444' },
      { t: '// 10K queries/s no Postgres para 1 registro', c: '#ef4444' },
      { t: '// Postgres saturado em IOPS', c: '#ef4444' },
    ],
    goodDesc: 'Cache aside com Redis na frente do banco',
    goodCode: [
      { t: 'const cached = await redis.get("user:" + id)', c: '#22c55e' },
      { t: 'if (cached) return JSON.parse(cached)', c: '#22c55e' },
      { t: 'const user = await db.query(...)', c: '#22c55e' },
      { t: 'await redis.setex("user:" + id, 300, JSON.stringify(user))', c: '#22c55e' },
    ],
    why: 'Cache aside reduz 99% das queries ao DB para dados populares com TTL adequado.',
  },
]

// ── Dados: Cheatsheet de componentes ─────────────────────────────────────────
// Reutilizamos buildCheatsheetPdf com seção de "hooks" = componentes

const SD_CHEATSHEET_HOOKS = [
  { name: 'Load Balancer (L7)', sig: 'distribui tráfego HTTP entre instâncias', desc: 'Sempre — primeira linha de escalabilidade horizontal. N/A em sistema com 1 instância.' },
  { name: 'CDN',               sig: 'cache de assets estáticos em PoPs globais', desc: 'Assets, HTML pré-renderizado, tráfego global. Não usar para APIs dinâmicas.' },
  { name: 'Redis Cache',       sig: 'key-value em memória, TTL nativo, 100K ops/s', desc: 'Sessão, rate limit, timeline, resultado de query costosa. Não para dados que não podem ser perdidos.' },
  { name: 'Message Queue',     sig: 'producer→broker→consumer, ack/nack, DLQ', desc: 'Background jobs, desacoplamento, trabalho assíncrono. Não quando precisa de resposta imediata.' },
  { name: 'Event Streaming',   sig: 'log imutável, múltiplos consumers, offset', desc: 'Audit log, reprocessamento, múltiplos consumidores. Não para task queue simples.' },
  { name: 'API Gateway',       sig: 'auth, rate limit, roteamento, aggregation', desc: 'Microservices, auth centralizado, BFF pattern. Não em monolito simples.' },
  { name: 'Read Replica',      sig: 'cópia do primary para leituras, eventual consistency', desc: 'Read-heavy com 80%+ reads. Não para leitura imediata após write (replication lag).' },
  { name: 'Sharding',          sig: 'partição horizontal por shard key', desc: 'Volume excede capacidade de 1 nó, write-heavy extremo. Último recurso após replicas + cache.' },
  { name: 'Circuit Breaker',   sig: 'Closed→Open→Half-Open, falha isolada', desc: 'Toda chamada a serviço externo. Não para operação local sem dependências externas.' },
  { name: 'Rate Limiter',      sig: 'token bucket/sliding window, 429 Too Many Requests', desc: 'APIs públicas, proteção contra abuso e DDoS. Não apenas internamente sem cliente externo.' },
]

const SD_CHEATSHEET_PATTERNS = [
  { name: 'Cache Aside',    code: 'miss → DB → SET(key, val, TTL)', desc: 'Lazy loading: cache só tem dados acessados. Risco: race condition em writes concorrentes.' },
  { name: 'Write Through',  code: 'write(DB) + SET(cache) na mesma op', desc: 'Cache sempre consistente, write latência dobra. Cache pode ter dados nunca lidos.' },
  { name: 'Outbox Pattern', code: 'INSERT outbox na mesma TX do dado', desc: 'Evento na mesma TX do DB. Resolve dual-write entre DB e broker. Worker lê outbox assincronamente.' },
  { name: 'Saga',           code: 'TX local + compensating events', desc: 'Transação distribuída via eventos de compensação. Sem 2PC — eventual consistency.' },
  { name: 'CQRS',           code: 'CommandBus | QueryBus → handlers separados', desc: 'Separa write model de read model. Read otimizado independente — Redis, Elastic, etc.' },
  { name: 'Fanout',         code: 'on-write: push | on-read: pull', desc: 'on-write para usuários comuns, on-read para celebridades. Híbrido para redes sociais reais.' },
  { name: 'Bulkhead',       code: 'pool separado por dependência', desc: 'Pools de conexão separados por serviço. Falha num pool não propaga para outros.' },
  { name: 'BFF',            code: 'API específica por tipo de cliente', desc: 'Backend for Frontend: payload otimizado por tipo de client (mobile vs web).' },
]

const SD_CHEATSHEET_RULES = [
  { ok: true,  t: 'Clarify antes de qualquer caixa — 5 min salvam 30 min' },
  { ok: true,  t: 'Estima QPS = DAU × actions / 86.400. Storage = QPS × bytes × secs' },
  { ok: true,  t: '1 server ≈ 10-50K req/s, Redis ≈ 100K ops/s, SSD ≈ 500K IOPS' },
  { ok: true,  t: 'Nomeie o que está sacrificando: "aceito eventual consistency no feed"' },
  { ok: true,  t: 'P é obrigatório em sistema distribuído — escolha entre C e A' },
  { ok: true,  t: 'Scale vertical primeiro; horizontal quando vertical não basta' },
  { ok: true,  t: 'Cache Aside para leitura, Write Through para dados críticos pós-write' },
  { ok: true,  t: 'Sharding: último recurso após replicas + cache esgotadas' },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'System Design',
    stackLabel: 'Arquitetura de Sistemas',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'System Design',
    accentColor: C,
    stackLabel: 'Arquitetura de Sistemas',
    sections: {
      hooks: SD_CHEATSHEET_HOOKS,
      depRows: [],
      rules: SD_CHEATSHEET_RULES,
      performanceTips: [
        'Back-of-envelope: QPS × bytes × tempo = storage necessário',
        'Redis: 100K ops/s, latência ~0.5ms — sempre na frente do DB para hot keys',
        'CDN absorve 60–90% do tráfego estático — use para assets e HTML cacheável',
        'Read Replica: reads escalam linearmente com número de replicas',
        'Consistent Hashing: adicionar/remover nó redistribui só 1/N das keys',
        'Token Bucket com Redis DECR é atômico — sem race condition',
        'Kafka Partition: 1 partition ≈ 10MB/s throughput — particione bem',
        'WebSocket: 1 servidor aguenta ~50K conexões persistentes simultâneas',
      ],
      patterns: SD_CHEATSHEET_PATTERNS,
      mentalModels: [
        'Todo sistema é uma fila com cache — onde está o gargalo?',
        'Cache resolve leitura. Fila resolve escrita. Ambos desacoplam.',
        'Cada componente adiciona custo operacional + modo de falha',
        'Eventual consistency é tradeoff, não bug — documente o que sacrifica',
        'SPOF = Single Point of Failure — identifique e elimine antes de apresentar',
        'Stateless = escala horizontal. Guarde estado externo (Redis, DB).',
      ],
    },
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATS,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'System Design',
    stackLabel: 'Arquitetura de Sistemas',
  }),
  comparative: () => buildComparativeRefPdf({
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    skillName: 'System Design',
    accentColor: C,
    stackLabel: 'SQL vs NoSQL — quando usar cada storage',
    scenarios: [
      { scenario: 'Fintech / Banco', recommendation: 'SQL (Relacional)', reason: 'ACID obrigatório para transações financeiras' },
      { scenario: 'Feed de redes sociais', recommendation: 'NoSQL Columnar', reason: 'Write-heavy, eventual consistency aceitável' },
      { scenario: 'Cache de sessão / Rate limit', recommendation: 'NoSQL Key-Value', reason: 'O(1) por chave, TTL nativo, 100K ops/s' },
      { scenario: 'Catálogo de produtos', recommendation: 'NoSQL Document', reason: 'Schema variável por categoria, queries por atributo' },
      { scenario: 'IoT / Time series', recommendation: 'NoSQL Columnar', reason: 'Cassandra otimizado para writes com timestamp como clustering key' },
    ],
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: SD_PDF_ANTIPATTERNS,
    accentColor: C,
    skillName: 'System Design',
    stackLabel: 'Arquitetura de Sistemas',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function SystemDesignPdfs() {
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
      {open && (
        <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />
      )}
    </>
  )
}
