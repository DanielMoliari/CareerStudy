'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'

// ── Paleta Sharding (amber) ───────────────────────────────────────────────────
const C = '#f59e0b'   // amber — NUNCA omitir, default seria cyan React

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas de sharding mais cobradas em system design',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: quando shardar, escolha de shard key, consistent hashing, hot shard, cross-shard queries, resharding, transações distribuídas, foreign keys, multi-tenant, Vitess/Citus — tudo que entrevistadores de sênior realmente perguntam.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Sharding do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental completo com 6 categorias (Estratégias, Shard Key, Problemas, Mitigações, Alternativas, Ferramentas) e checklist pré-entrevista para system design.',
    icon: '02',
    goal: 'Mapeamento mental',
  },
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'Fórmulas, estratégias e trade-offs numa página',
    type: 'quick-ref',
    pages: 1,
    description: 'Cartão de bolso com: quando shardar (com thresholds), estratégias e trade-offs, critérios de shard key boa/ruim, mitigações de hot shard e problemas clássicos.',
    icon: '03',
    goal: 'Consulta rápida',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Quando você shardaria um banco de dados?',
    a: 'Somente quando <strong>vertical scaling acabou</strong>. Postgres em máquina moderna aguenta TBs e dezenas de milhares de QPS. Indicadores reais: dataset > 5-10 TB, write QPS > 50k sustentado, latência degradando mesmo com índice e cache. Antes disso, sharding é overkill caro. Sequência correta: vertical → read replicas → cache → particionamento local → sharding.',
    tip: 'Comece listando as alternativas em ordem crescente de complexidade. Candidatos que propõem sharding sem esgotar alternativas são red flag para o entrevistador.',
  },
  {
    level: 'Pleno',
    q: 'Qual o trade-off entre range e hash sharding?',
    a: '<strong>Range</strong>: range scan eficiente (relatório por período, paginação por id). Risco: hot shard em distribuição desigual — timestamp sempre vai para o último shard. <strong>Hash</strong>: distribui uniforme, evita hot shard. Custo: range query exige scatter-gather (fanout para todos os shards). Heurística: acesso por chave individual → Hash. Acesso por intervalo → Range com cuidado de hot shard.',
    tip: 'Mencione consistent hashing como evolução do hash simples — evita rebalancear tudo quando adiciona/remove shard.',
  },
  {
    level: 'Senior',
    q: 'Como você escolhe a shard key em um sistema real?',
    a: 'Três critérios: <strong>Cardinalidade alta</strong> (muitos valores distintos para distribuir bem), <strong>Distribuição uniforme</strong> (sem concentração de tráfego em poucos valores), <strong>Aderência ao padrão de acesso</strong> (query mais frequente deve achar dado em um só shard). E-commerce: user_id é boa para carrinho, product_id para catálogo, timestamp é terrível — concentra escrita no último shard.',
    tip: 'Mostre que você pensa em padrão de acesso, não apenas distribuição. A shard key precisa minimizar cross-shard queries no caminho crítico.',
  },
  {
    level: 'Senior',
    q: 'Como funciona consistent hashing e por que é superior ao hash simples?',
    a: 'Hash simples: shard = hash(key) % N. Problema: se N muda, quase todas as chaves migram. Consistent hashing: chaves e shards mapeados em anel circular (0–2³²). Cada chave vai para o próximo shard no sentido horário. Adicionar shard apenas move 1/N das chaves. Virtual nodes (vnodes): cada shard físico tem múltiplos pontos no anel, melhorando distribuição quando shards têm capacidades diferentes.',
    tip: 'Compare os números: hash mod N move K/N chaves (K = total). Consistent hashing move K/(N×N+1) chaves. O ganho é de ordem de magnitude em rebalances.',
  },
  {
    level: 'Senior',
    q: 'Como você lida com hot shard?',
    a: 'Escalonamento: (1) <strong>Cache</strong> agressivo na frente (Redis, CDN) — mais rápido de implementar. (2) <strong>Salting</strong>: concatena prefixo aleatório à chave (user_id_0..user_id_9), distribui em 10 entradas, agrega em leitura. (3) <strong>Shard splitting</strong>: divide o shard quente em sub-shards. (4) <strong>Replicação seletiva</strong>: dados do hot user replicados em múltiplos shards de leitura.',
    tip: 'Salting para escrita pesada é a técnica avançada que diferencia candidatos. Explique o trade-off: escrita distribuída mas leitura precisa agregar N buckets.',
  },
  {
    level: 'Senior',
    q: 'Como você executaria uma migração de schema em um banco shardado?',
    a: 'Expand-contract pattern: (1) Expande: adiciona nova coluna como nullable em todos os shards. (2) Dual-write: código escreve em old e new field simultaneamente. (3) Backfill: preenche nova coluna em lotes para dados históricos. (4) Switch: leitura passa a usar nova coluna quando backfill completo. (5) Contrai: remove coluna antiga. Nunca fazer ALTER TABLE bloqueante — usar pt-online-schema-change ou pg_repack.',
    tip: 'O dual-write é o componente crítico que candidatos sem experiência omitem. Sem ele, dados escritos durante a migração ficam apenas na coluna antiga.',
  },
  {
    level: 'Senior',
    q: 'Como funcionam transações distribuídas em sistemas shardados?',
    a: 'Opções por ordem crescente de complexidade: <strong>Evitar</strong> — modelar para que transações críticas fiquem num único shard (melhor opção). <strong>2PC</strong> — coordinator pergunta "pode commitar?" para todos, depois comanda commit/rollback. Bloqueante, coordinator é SPOF. <strong>Saga</strong> — série de transações locais com compensações semânticas. Eventual consistency, sem bloqueio. Padrão moderno.',
    tip: 'A resposta sênior começa em "modelar para evitar". O custo real de 2PC em produção (latência, bloqueios, falhas parciais) supera quase sempre os benefícios.',
  },
  {
    level: 'Pleno',
    q: 'O que acontece com foreign keys em sistemas shardados?',
    a: 'Foreign keys entre shards não funcionam — o banco não pode fazer JOIN entre servidores diferentes. Consequências: integridade referencial deve ser garantida na aplicação, JOINs cross-shard são proibidos, cascades não se propagam entre shards. Solução: modelar para que referências fiquem no mesmo shard. Dados compartilhados (produtos, categorias): replicar em cada shard como read-only, sincronizado via eventos.',
    tip: 'A ausência de foreign keys é um dos custos menos discutidos do sharding. Mencioná-lo espontaneamente demonstra experiência real com sistemas shardados em produção.',
  },
  {
    level: 'Senior',
    q: 'Como sharding impacta índices e queries secundárias?',
    a: 'Índice local: cada shard mantém seu próprio índice. Query por shard key é eficiente. Query por campo não-shard key requer scatter-gather — fanout para todos os shards, agrega resultado. Custo linear em N shards. Índice global: índice centralizado que mapeia qualquer campo para shard. DynamoDB GSI, Elasticsearch como search index. Vantagem: queries eficientes. Custo: consistência eventual.',
    tip: 'Scatter-gather com 50 shards = 50 queries paralelas + merge. É o argumento mais forte para modelagem cuidadosa antes de shardar.',
  },
  {
    level: 'Senior',
    q: 'Como você implementaria sharding em um sistema multi-tenant?',
    a: 'Três estratégias: <strong>Shard por tenant</strong>: isolamento perfeito, compliance fácil. Custo: N tenants = N databases a gerenciar. <strong>Tenant como shard key</strong>: múltiplos tenants por shard, eficiente. Problema: tenant grande monopoliza shard. <strong>Híbrido</strong>: tenants pequenos compartilham shards, tenants grandes têm shards dedicados. Abordagem do Notion, Figma. Roteamento: tabela tenant_id → shard em Redis.',
    tip: 'A abordagem híbrida é usada por SaaS de escala. Mencione a tabela de roteamento em Redis como componente crítico do routing layer.',
  },
  {
    level: 'Pleno',
    q: 'O que é resharding e quais os desafios?',
    a: 'Resharding é redistribuir dados entre shards ao aumentar N ou reorganizar distribuição. Desafios: (1) Movimento de dados — transferir TBs online sem afetar tráfego. (2) Dual-write durante migração — escrever em shard antigo e novo. (3) Consistência — dados migrados chegam completos antes de redirecionar leitura. (4) Rollback — se algo dá errado, como voltar. Consistent hashing minimiza resharding — 1/N das chaves em vez de quase todas.',
    tip: 'Consistent hashing como solução para resharding minimizado é o argumento arquitetural principal. Sem ele, qualquer mudança de N é um resharding catastrófico.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre particionamento local e sharding?',
    a: '<strong>Particionamento local</strong> (Postgres PARTITION BY): divide fisicamente uma tabela em partitions no mesmo servidor. Partition pruning para queries por range. Manutenção por partition (VACUUM, index rebuild). Sem overhead de rede. <strong>Sharding</strong>: dados em servidores diferentes. Escala horizontal genuína. Requisito apenas quando um único servidor não suporta o volume. Sequência: particionamento local → vertical → sharding.',
    tip: 'Postgres suporta particionamento por range, list e hash desde v10+. Muitas empresas shardaram prematuramente antes de tentar particionamento local, que é 10x mais simples.',
  },
  {
    level: 'Pleno',
    q: 'Como você monitoraria um sistema shardado em produção?',
    a: 'Métricas por shard (não só agregadas): QPS por shard (detecta hot shard cedo), latência p99 por shard (shard lento não aparece na média), tamanho em disco por shard (distribuição desigual de dados), cross-shard query rate (aumento indica problema de modelagem). Alertas: QPS de um shard > 2x a média → investigar hot shard. Tamanho > 150% da média → planejar split.',
    tip: 'Monitoramento por shard — não apenas agregado — é o que diferencia operação real. Médias escondem problemas em shards específicos até virar incidente.',
  },
  {
    level: 'Senior',
    q: 'Como DynamoDB implementa sharding e o que é adaptive capacity?',
    a: 'DynamoDB usa consistent hashing internamente. Partition key é a shard key. Capacidade provisionada (RCU/WCU) dividida igualmente entre partições. Problema: partition quente esgota sua fração mesmo com outras ociosas. Adaptive capacity: redistribui automaticamente capacidade para partições quentes, absorvendo bursts. Instant adaptive capacity (2019): redistribuição imediata.',
    tip: 'Adaptive capacity demonstra conhecimento de produção com DynamoDB. Entrevistadores de empresas AWS-heavy adoram esse nível de detalhe.',
  },
  {
    level: 'Senior',
    q: 'Como Vitess e Citus resolvem sharding para MySQL e Postgres?',
    a: '<strong>Vitess</strong> (MySQL): proxy VTGate roteia queries para shards corretos. VTTablet por shard. Resharding online, connection pooling, query rewrite. YouTube usa desde 2011. Transparente para a aplicação — mesma API MySQL. <strong>Citus</strong> (Postgres): extensão nativa. Distributed tables com shard key, reference tables replicadas. Query planner ciente de shards, JOINs distribuídos. Azure usa para Cosmos DB for PostgreSQL.',
    tip: 'Mencionar Vitess e Citus demonstra conhecimento do ecossistema. São as soluções usadas por empresas sérias que querem sharding sem implementação manual.',
  },
  {
    level: 'Senior',
    q: 'Como você desenharia sharding de um sistema de mensagens com bilhões de mensagens?',
    a: 'Discord: PostgreSQL → Cassandra particionado por channel_id + bucket de tempo (mês). Writes eficientes: append-only. Reads: últimas mensagens = partition mais recente. Shard key ideal: (channel_id, time_bucket). Coloca mensagens do mesmo canal juntas. Bucket de tempo evita partição crescer indefinidamente. Para inbox de usuário (DMs): particionar por user_id separadamente.',
    tip: 'O Discord case study (SQL para Cassandra) é clássico de system design. Time bucketing evita partição ilimitada — técnica essencial para dados de séries temporais.',
  },
  {
    level: 'Pleno',
    q: 'O que é salting e quando usar?',
    a: 'Salting: adiciona sufixo aleatório à chave de escrita. Exemplo: em vez de user_id, usar user_id_0..user_id_9 (10 buckets). Writes são distribuídos aleatoriamente entre os 10 buckets. Reads precisam agregar todos os 10 buckets. Quando usar: write-heavy hot shard onde cache não resolve. Trade-off: escrita O(1) → leitura O(SALT_BUCKETS). Não use para dados onde leitura é frequente.',
    tip: 'Salting é a técnica avançada para hot shard de escrita. Explique o trade-off de leitura explicitamente — candidatos que apresentam salting sem mencionar o custo de leitura demonstram superficialidade.',
  },
  {
    level: 'Senior',
    q: 'Quais são os principais anti-patterns de sharding?',
    a: '1. <strong>Shardar prematuramente</strong>: aumenta custo operacional 10x antes de ser necessário. 2. <strong>Shard key sequencial</strong>: timestamp ou auto-increment concentra writes no último shard. 3. <strong>Cross-shard queries no caminho crítico</strong>: cada request fazendo fanout para 20 shards. 4. <strong>Transações distribuídas sem modelagem</strong>: 2PC em produção com falhas. 5. <strong>Não planejar resharding</strong>: N fixo sem consistent hashing. 6. <strong>Ignorar hot shard</strong>: não monitorar por shard até virar incidente.',
    tip: 'Liste anti-patterns em ordem de frequência que você os vê. Isso sinaliza experiência operacional real, não apenas conhecimento teórico.',
  },
  {
    level: 'Pleno',
    q: 'O que é um shard map e como ele é gerenciado?',
    a: 'Shard map: mapeamento de qual shard contém qual intervalo de chaves (range sharding) ou hash bucket (hash sharding). Componentes: shard map manager (serviço que mantém e serve o mapa), shard map store (banco que persiste o mapa), client library (cache local do mapa). Em consistent hashing: o anel é o shard map implícito — sem store central. Em directory-based: store central com alta disponibilidade (Redis Cluster, etcd).',
    tip: 'O shard map manager como SPOF é o problema central de directory-based sharding. Consistent hashing elimina esse SPOF ao fazer o mapa implícito no anel.',
  },
  {
    level: 'Senior',
    q: 'Como você explicaria sharding para um stakeholder não-técnico antes de aprovar o projeto?',
    a: 'Analogia: biblioteca com muitos livros e leitores. Solução 1 — vertical: contratar bibliotecário mais rápido. Solução 2 — réplicas: abrir filiais com cópias para consulta. Solução 3 — sharding: dividir o acervo entre múltiplas bibliotecas (A-M, N-Z). Custo: se precisar de livros de duas bibliotecas ao mesmo tempo, precisa visitar as duas. Isso é cross-shard query. Por isso sharding é o último recurso — só quando as outras soluções esgotaram.',
    tip: 'A capacidade de explicar sistemas distribuídos com analogias é diferencial de sênior e líder técnico. Entrevistadores avaliam essa habilidade para papéis de staff e principal.',
  },
]

// ── Dados: Mind Map ────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Estratégias',
    color: C,
    items: [
      { t: 'Range — intervalos de chave', k: true },
      { t: 'Hash mod N — distribuição uniforme', k: true },
      { t: 'Consistent hashing — anel circular', k: true },
      { t: 'Geographic — por região (GDPR)', k: true },
      { t: 'Directory — lookup table', a: true },
    ],
  },
  {
    label: 'Shard Key',
    color: '#3b82f6',
    items: [
      { t: 'Cardinalidade alta', k: true },
      { t: 'Distribuição uniforme', k: true },
      { t: 'Aderência ao padrão de acesso', k: true },
      { t: 'user_id, tenant_id (boas)', k: true },
      { t: 'timestamp, status (ruins)', k: true },
    ],
  },
  {
    label: 'Consistent Hashing',
    color: '#8b5cf6',
    items: [
      { t: 'Anel circular 0–2³²', k: true },
      { t: 'Apenas 1/N chaves migram', k: true },
      { t: 'Virtual nodes (vnodes)', a: true },
      { t: 'Cassandra, DynamoDB, Memcached', a: true },
      { t: 'Sem SPOF de routing', a: true },
    ],
  },
  {
    label: 'Problemas Clássicos',
    color: '#ef4444',
    items: [
      { t: 'Hot shard — concentração', k: true },
      { t: 'Cross-shard — scatter-gather', k: true },
      { t: 'Transação dist. — 2PC/Saga', k: true },
      { t: 'Resharding — migração online', k: true },
      { t: 'Foreign keys — N/A cross-shard', k: true },
    ],
  },
  {
    label: 'Mitigações',
    color: '#10b981',
    items: [
      { t: 'Cache → Salt → Split → Replicate', k: true },
      { t: 'CQRS para cross-shard queries', a: true },
      { t: 'Saga para transações dist.', a: true },
      { t: 'Consistent hashing p/ resharding', k: true },
      { t: 'Dual-write durante migração', a: true },
    ],
  },
  {
    label: 'Alternativas Primeiro',
    color: '#f472b6',
    items: [
      { t: '1° Vertical scaling', k: true },
      { t: '2° Read replicas', k: true },
      { t: '3° Cache (Redis, CDN)', k: true },
      { t: '4° Particionamento local (PARTITION BY)', k: true },
      { t: '5° Sharding (último recurso)', k: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Consigo listar as alternativas ao sharding em ordem crescente de complexidade?',
  'Sei os 3 critérios de uma boa shard key (CUA)?',
  'Entendo como consistent hashing minimiza resharding (1/N das chaves)?',
  'Sei explicar scatter-gather e quando ele é inaceitável no caminho crítico?',
  'Conheço as 4 mitigações de hot shard em ordem de custo crescente?',
  'Entendo por que transações cross-shard com 2PC são problemáticas?',
  'Sei por que foreign keys não funcionam entre shards?',
  'Conheço Vitess (MySQL) e Citus (Postgres) como soluções gerenciadas?',
  'Sei quando usar salting e qual o trade-off de leitura?',
  'Consigo desenhar o expand-contract pattern para schema migration?',
]

// ── Dados: Quick Ref ──────────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Quando Shardar (últimos recursos)',
        entries: [
          { key: 'Dataset', value: '> 5–10 TB em produção' },
          { key: 'Write QPS', value: '> 50k sustentado' },
          { key: 'Latência', value: 'Degradando mesmo com índice + cache' },
          { key: 'Vertical', value: 'Esgotado (maior instance disponível)' },
        ],
      },
      {
        title: 'Estratégias',
        entries: [
          { key: 'Range', value: 'Range scan OK. Hot shard em skew.', badge: 'scan ✓', badgeColor: '#3b82f6' },
          { key: 'Hash mod N', value: 'Uniforme. Resharding total ao mudar N.', badge: 'uniforme', badgeColor: '#8b5cf6' },
          { key: 'Consistent', value: 'Anel. Apenas 1/N migram por mudança.', badge: 'melhor', badgeColor: C },
          { key: 'Geographic', value: 'Por região. GDPR. Cross-region caro.', badge: 'compliance', badgeColor: '#10b981' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Shard Key — CUA',
        entries: [
          { key: 'C — Cardinalidade', value: 'Muitos valores distintos', badge: 'obrigatório', badgeColor: C },
          { key: 'U — Uniformidade', value: 'Sem concentração de tráfego', badge: 'obrigatório', badgeColor: C },
          { key: 'A — Aderência', value: 'Query principal em 1 shard', badge: 'obrigatório', badgeColor: C },
          { key: 'Boas', value: 'user_id, tenant_id, uuid' },
          { key: 'Ruins', value: 'timestamp, status, country' },
        ],
      },
      {
        title: 'Hot Shard — Escalonamento',
        entries: [
          { key: '1° Cache', value: 'Redis/CDN — mais rápido de implementar', badge: 'barato', badgeColor: '#10b981' },
          { key: '2° Salting', value: 'key_0..key_N — distribui writes', badge: 'avançado', badgeColor: C },
          { key: '3° Split', value: 'Divide shard em sub-shards', badge: 'caro', badgeColor: '#f59e0b' },
          { key: '4° Replicate', value: 'Hot data em múltiplos shards leitura', badge: 'complexo', badgeColor: '#ef4444' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Problemas Clássicos',
        entries: [
          { key: 'Cross-shard', value: 'Fanout O(N) — evitar no caminho crítico' },
          { key: 'Transação', value: 'Evitar → Saga → 2PC (último)' },
          { key: 'Foreign key', value: 'Não funciona cross-shard — garantir na app' },
          { key: 'Schema change', value: 'Expand-contract + dual-write' },
          { key: 'Resharding', value: 'Consistent hashing minimiza: 1/N chaves' },
        ],
      },
      {
        title: 'Ferramentas',
        entries: [
          { key: 'Vitess', value: 'MySQL sharding (YouTube)', badge: 'MySQL', badgeColor: '#3b82f6' },
          { key: 'Citus', value: 'Postgres sharding (Azure)', badge: 'Postgres', badgeColor: '#336791' },
          { key: 'DynamoDB', value: 'Autosharding + adaptive capacity', badge: 'AWS', badgeColor: '#f59e0b' },
          { key: 'Cassandra', value: 'Consistent hash nativo + vnodes', badge: 'NoSQL', badgeColor: '#10b981' },
        ],
      },
    ],
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Sharding',
    stackLabel: 'Arquitetura · Distribuído',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Sharding',
    stackLabel: 'Arquitetura · Distribuído',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de uma entrevista de system design sênior.',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'Sharding',
    accentColor: C,
    stackLabel: 'Arquitetura · Distribuído',
    tagline: 'Quando shardar, como escolher shard key e como resolver hot shard',
  }),
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function ShardingPdfs() {
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
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
