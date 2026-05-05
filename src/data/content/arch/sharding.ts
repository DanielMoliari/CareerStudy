import type { SkillContent } from '@/types'

const sharding: SkillContent = {
  tagline: 'Particionar dado em múltiplos nos quando um banco não da mais conta sozinho.',
  why: 'Sharding aparece em entrevista de system design quando volume passa do que vertical scaling resolve. Senior precisa explicar estrategias (range, hash, geo), tradeoff de cross-shard query, e quando evitar (quase sempre antes de precisar).',
  summary: 'Sharding distribui dado em múltiplos nos (shards), cada um responsável por um subconjunto. Habilita escala horizontal de banco — capacidade total = soma dos shards. Estrategias: range (intervalos de chave), hash (mod ou consistent hashing), geographic (por regiao do usuário), directory (lookup table). Custo: cross-shard query e cara, transação distribuida e difícil, rebalance e operação tensa, hot shard surge fácil. Maioria dos sistemas resolve com vertical + read replica antes de precisar shardar.',
  keypoints: [
    { title: 'Range sharding', body: 'Particiona por intervalo de chave (A-F shard1, G-M shard2). Permite range scan eficiente. Risco: hot shard se distribuição e desigual (timestamp recente em último shard).' },
    { title: 'Hash sharding', body: 'Hash da chave mod N. Distribui uniforme, evita hot shard. Custo: mata range query, e adicionar/remover shard rebalanca tudo (a menos que use consistent hashing).' },
    { title: 'Consistent hashing', body: 'Anel hash onde adicionar/remover shard só move uma fração das chaves (1/N em vez de tudo). Padrão em Cassandra, DynamoDB, Memcached.' },
    { title: 'Geographic sharding', body: 'Por regiao do usuário (US, EU, APAC). Reduz latência, ajuda compliance (GDPR). Cross-region query e cara — desenhe pra evitar.' },
    { title: 'Cross-shard query', body: 'Query que toca varios shards (count global, agregacao) tem que fanout pra todos shards. Custo cresce linear. Senior desenha schema/acesso pra evitar — denormaliza, usa read model agregado.' },
    { title: 'Hot shard', body: 'Um shard recebe muito mais trafego (celebridade, item viral). Mata performance. Mitigação: salting (adiciona aleatorio a chave), shard splitting, cache na frente.' },
    { title: 'Rebalance', body: 'Adicionar shard exige mover dado. Operação online, demorada, com risco. Vendor managed (Aurora, Dynamo) cuida; auto-managed exige planejamento (dual-write, copy, switch).' },
  ],
  gotchas: [
    'Shardar antes de precisar — Postgres em hardware moderno aguenta TBs e dezenas de milhares de QPS. Shardar cedo e overkill caro.',
    'Escolher shard key errada — depois de TBs em produção, mudar shard key e horror. Estuda padrão de acesso antes.',
    'Hot shard ignorado — celebridade no Twitter mata o shard dela. Tem que ter plano (cache, replicação do hot, splitting).',
    'Cross-shard transaction com 2PC achando que e gratis — performance mata, e risco de transação pendurada existe.',
    'Esquecer de shardar índices/foreign key — virou query global cara em todo lookup.',
    'Achar que NoSQL "shardando automático" elimina o problema — você ainda precisa entender shard key, hot partition, RCU/WCU.',
  ],
  interview: [
    { q: 'Quando você shardaria um banco?', a: '<p>So quando <strong>vertical scaling acabou</strong>. Postgres em maquina moderna (db.r6i.16xlarge, 512GB RAM) aguenta TBs e dezenas de milhares de QPS. Read replicas resolvem leitura.</p><p>Indicadores reais: dataset > 5-10TB, write QPS > 50k sustentado, latência degradando mesmo com índice e cache. Antes disso, sharding e <strong>overkill caro</strong>.</p><p>Quando shardar, começo escolhendo shard key com cuidado (estuda padrões de acesso), planejo rebalance, e desenho pra evitar cross-shard query.</p>' },
    { q: 'Tradeoff: range vs hash sharding?', a: '<p><strong>Range</strong>: range scan e eficiente (relatório por período, paginação por id). Risco: <strong>hot shard</strong> em distribuição desigual — timestamp sempre vai pro último shard.</p><p><strong>Hash</strong>: distribui uniforme, evita hot shard. Custo: range query mata (precisa fanout pra todos shards).</p><p>Heurística: padrão de acesso e por chave individual? Hash ganha. Padrão e range/intervalo? Range com cuidado de hot shard (ex: hash + timestamp como chave composta).</p>' },
    { q: 'Como você escolhe a shard key?', a: '<p>Três critérios:</p><ul><li><strong>Cardinalidade alta</strong>: muitos valores diferentes pra distribuir bem</li><li><strong>Distribuição uniforme</strong>: nenhum valor concentra trafego (evita hot shard)</li><li><strong>Aderencia ao padrão de acesso</strong>: query mais comum deve achar dado em um só shard</li></ul><p>Exemplo: e-commerce. <code>user_id</code> é boa pra carrinho (tudo do user num shard). <code>product_id</code> é boa pra catálogo. <code>timestamp</code> é <strong>terrível</strong> — concentra escrita no último shard.</p>' },
    { q: 'Como você lida com hot shard?', a: '<p>Primeira linha: <strong>cache</strong> agressivo na frente do hot dado (Redis, CDN). Reduz pressão no shard.</p><p>Se não basta: <strong>splitting</strong> — quebra o shard em sub-shards. Em DynamoDB, isso e automático (adaptive capacity). Em manual, exige rebalance.</p><p>Outra opcao: <strong>salting</strong> — concatena prefixo aleatorio a chave (user_id_0, user_id_1, ..., user_id_9), distribui em 10 entradas, agrega em leitura. Funciona pra escrita pesada, complica leitura.</p>' },
    { q: 'Quais alternativas a sharding você considera primeiro?', a: '<p><strong>Vertical scaling</strong>: maquina maior. Boring, eficaz até alguns TBs.</p><p><strong>Read replicas</strong>: descarrega leitura, escrita continua no master. Maioria das apps tem ratio leitura/escrita 10:1 ou mais.</p><p><strong>Cache</strong>: Redis na frente, reduz QPS no banco em ordem de grandeza.</p><p><strong>Particao em mesmo banco</strong>: Postgres partitioning por range/list — divide tabela grande em sub-tabelas no mesmo cluster, sem complexidade de sharding distribuido.</p><p><strong>Arquivamento</strong>: dado histórico vai pra cold storage. Banco ativo fica menor.</p><p>Com tudo isso, dificilmente precisa shardar abaixo de 10TB.</p>' },
  ],
  resources: [
    { title: 'Designing Data-Intensive Applications (Kleppmann)', url: 'https://dataintensive.net/', kind: 'livro' },
    { title: 'System Design Primer — Sharding', url: 'https://github.com/donnemartin/system-design-primer#sharding', kind: 'docs' },
    { title: 'Vitess docs (sharding MySQL)', url: 'https://vitess.io/docs/', kind: 'docs' },
    { title: 'Citus / Postgres sharding', url: 'https://www.citusdata.com/', kind: 'docs' },
    { title: 'Discord — How we store billions of messages', url: 'https://discord.com/blog/how-discord-stores-billions-of-messages', kind: 'artigo' },
  ],
  diagram: 'consistent-hashing'
}

export default sharding
