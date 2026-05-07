import type { SkillContent } from '@/types'

const sharding: SkillContent = {
  tagline: 'Particionar dados em múltiplos nós quando um banco não dá mais conta sozinho.',
  why: 'Sharding aparece em entrevistas de system design quando volume passa do que vertical scaling resolve. Sênior precisa explicar estratégias (range, hash, geo), trade-offs de cross-shard query, consistent hashing e quando evitar (quase sempre antes de precisar).',
  summary: 'Sharding distribui dados em múltiplos nós (shards), cada um responsável por um subconjunto. Habilita escala horizontal de banco — capacidade total = soma dos shards. Estratégias: range (intervalos de chave), hash (mod ou consistent hashing), geographic (por região), directory (lookup table). Custo: cross-shard query é cara, transação distribuída é difícil, rebalance é operação tensa, hot shard surge fácil. Maioria dos sistemas resolve com vertical + read replica antes de precisar shardar.',
  keypoints: [
    { title: 'Range sharding', body: 'Particiona por intervalo de chave (A-F shard1, G-M shard2). Permite range scan eficiente. Risco: hot shard se distribuição é desigual (timestamp recente concentra no último shard).' },
    { title: 'Hash sharding', body: 'Hash da chave mod N. Distribui uniforme, evita hot shard. Custo: mata range query, e adicionar/remover shard rebalanceia tudo (a menos que use consistent hashing).' },
    { title: 'Consistent hashing', body: 'Anel hash onde adicionar/remover shard só move uma fração das chaves (1/N em vez de tudo). Padrão em Cassandra, DynamoDB, Memcached.' },
    { title: 'Geographic sharding', body: 'Por região do usuário (US, EU, APAC). Reduz latência, ajuda compliance (GDPR). Cross-region query é cara — desenhe para evitar.' },
    { title: 'Cross-shard query', body: 'Query que toca vários shards (count global, agregação) tem que fazer fanout para todos os shards. Custo cresce linear. Sênior desenha schema/acesso para evitar — denormaliza, usa read model agregado.' },
    { title: 'Hot shard', body: 'Um shard recebe muito mais tráfego (celebridade, item viral). Mata performance. Mitigação: salting (adiciona aleatório à chave), shard splitting, cache na frente.' },
    { title: 'Rebalance', body: 'Adicionar shard exige mover dados. Operação online, demorada, com risco. Vendor managed (Aurora, Dynamo) cuida; auto-managed exige planejamento (dual-write, copy, switch).' },
    { title: 'Directory-based sharding', body: 'Lookup table mapeando chave para shard. Flexível, permite rebalance granular. Custo: lookup table é single point of failure e bottleneck.' },
  ],
  gotchas: [
    'Shardar antes de precisar — Postgres em hardware moderno aguenta TBs e dezenas de milhares de QPS. Shardar cedo é overkill caro.',
    'Escolher shard key errada — depois de TBs em produção, mudar shard key é horror. Estuda padrão de acesso antes.',
    'Hot shard ignorado — celebridade no Twitter mata o shard dela. Tem que ter plano (cache, replicação do hot, splitting).',
    'Cross-shard transaction com 2PC achando que é grátis — performance mata, e risco de transação pendurada existe.',
    'Esquecer de shardar índices/foreign key — vira query global cara em todo lookup.',
    'Achar que NoSQL "shardando automático" elimina o problema — você ainda precisa entender shard key, hot partition, RCU/WCU.',
    'Cluster com número par de shards — em split-brain, sem desempate.',
    'Não planejar shard key para multi-tenant — um tenant enorme pode monopolizar um shard.',
  ],
  interview: [
    {
      level: 'pleno',
      q: 'Quando você shardaria um banco de dados?',
      a: '<p>Somente quando <strong>vertical scaling acabou</strong>. Postgres em máquina moderna (db.r6i.16xlarge, 512GB RAM) aguenta TBs e dezenas de milhares de QPS. Read replicas resolvem leitura.</p><p>Indicadores reais: dataset &gt; 5-10 TB, write QPS &gt; 50k sustentado, latência degradando mesmo com índice e cache. Antes disso, sharding é <strong>overkill caro</strong>.</p><p>Quando shardar, começo escolhendo shard key com cuidado (estudo padrões de acesso), planejo rebalance e desenho para evitar cross-shard query.</p>',
      tip: 'Comece listando alternativas (vertical, read replicas, cache, particionamento local). Só então indique sharding. Candidatos que propõem sharding de cara sem esgotar alternativas são red flag.',
    },
    {
      level: 'pleno',
      q: 'Qual o trade-off entre range e hash sharding?',
      a: '<p><strong>Range</strong>: range scan é eficiente (relatório por período, paginação por id). Risco: <strong>hot shard</strong> em distribuição desigual — timestamp sempre vai para o último shard.</p><p><strong>Hash</strong>: distribui uniforme, evita hot shard. Custo: range query mata (precisa fanout para todos os shards).</p><p>Heurística: padrão de acesso é por chave individual? Hash ganha. Padrão é range/intervalo? Range com cuidado de hot shard (ex: hash + timestamp como chave composta).</p>',
      tip: 'Mencione consistent hashing como evolução do hash simples — evita rebalancear tudo quando adiciona/remove shard. Dynamo e Cassandra usam isso.',
    },
    {
      level: 'senior',
      q: 'Como você escolhe a shard key em um sistema real?',
      a: '<p>Três critérios:</p><ul><li><strong>Cardinalidade alta</strong>: muitos valores diferentes para distribuir bem</li><li><strong>Distribuição uniforme</strong>: nenhum valor concentra tráfego (evita hot shard)</li><li><strong>Aderência ao padrão de acesso</strong>: query mais comum deve achar dado em um só shard</li></ul><p>Exemplo: e-commerce. <code>user_id</code> é boa para carrinho (tudo do user num shard). <code>product_id</code> é boa para catálogo. <code>timestamp</code> é <strong>terrível</strong> — concentra escrita no último shard.</p><p>Em multi-tenant SaaS: <code>tenant_id</code> garante isolation e localidade, mas um tenant gigante pode criar hot shard — mitigação: sub-sharding por tenant.</p>',
      tip: 'Mostre que você pensa em padrão de acesso, não apenas em distribuição. A shard key precisa minimizar cross-shard queries para o caminho crítico da aplicação.',
    },
    {
      level: 'senior',
      q: 'Como você lida com hot shard?',
      a: '<p>Primeira linha: <strong>cache</strong> agressivo na frente do hot dado (Redis, CDN). Reduz pressão no shard.</p><p>Se não basta: <strong>splitting</strong> — quebra o shard em sub-shards. Em DynamoDB, isso é automático (adaptive capacity). Em manual, exige rebalance.</p><p>Outra opção: <strong>salting</strong> — concatena prefixo aleatório à chave (<code>user_id_0</code>, <code>user_id_1</code>, ..., <code>user_id_9</code>), distribui em 10 entradas, agrega em leitura. Funciona para escrita pesada, complica leitura.</p><p>Para celebridades em redes sociais: replicação seletiva — replica os dados do hot user em múltiplos shards de leitura.</p>',
      tip: 'Mencione salting como técnica avançada para hot shard de escrita. Explique o trade-off: escrita distribuída mas leitura precisa agregar N buckets.',
    },
    {
      level: 'pleno',
      q: 'Quais alternativas a sharding você considera primeiro?',
      a: '<p><strong>Vertical scaling</strong>: máquina maior. Boring, eficaz até alguns TBs.</p><p><strong>Read replicas</strong>: descarrega leitura, escrita continua no master. Maioria das apps tem ratio leitura/escrita 10:1 ou mais.</p><p><strong>Cache</strong>: Redis na frente, reduz QPS no banco em ordem de grandeza.</p><p><strong>Particionamento local</strong>: Postgres partitioning por range/list — divide tabela grande em sub-tabelas no mesmo cluster, sem complexidade de sharding distribuído.</p><p><strong>Arquivamento</strong>: dado histórico vai para cold storage. Banco ativo fica menor.</p><p>Com tudo isso, dificilmente precisa shardar abaixo de 10 TB.</p>',
      tip: 'Ordenar as alternativas por custo crescente de implementação demonstra maturidade. Vertical → replicas → cache → particionamento local → sharding.',
    },
    {
      level: 'senior',
      q: 'Como funciona consistent hashing e por que é superior ao hash simples?',
      a: '<p>Hash simples: <code>shard = hash(key) % N</code>. Problema: se N muda (adiciona/remove shard), <strong>quase todas as chaves migram</strong> — rebalance catastrófico.</p><p>Consistent hashing: tanto chaves quanto shards são mapeados em um <strong>anel circular</strong> (0-2³²). Cada chave vai para o primeiro shard no sentido horário. Adicionar um shard apenas move as chaves entre o novo shard e seu predecessor — em média <strong>1/N das chaves</strong>.</p><p>Variação virtual nodes: cada shard físico tem múltiplos pontos no anel (vnodes), melhorando distribuição quando shards têm capacidades diferentes. Cassandra, DynamoDB e Memcached usam isso.</p>',
      tip: 'Explique a comparação: hash mod N move K/N chaves onde K é total de chaves. Consistent hashing move apenas K/(N×(N+1)) chaves. O ganho é de ordem de magnitude em rebalances.',
    },
    {
      level: 'senior',
      q: 'Como você executaria uma migração de schema em um banco shardado?',
      a: '<p>Desafio: schema change precisa ser aplicado em todos os N shards sem downtime.</p><p>Estratégia: <strong>expand-contract pattern</strong>:</p><ol><li>Expande: adiciona nova coluna como nullable em todos os shards</li><li>Migra: dual-write no código — escreve em old e new field</li><li>Backfill: preenche nova coluna em lotes para dados históricos</li><li>Lê da nova coluna: quando backfill completo</li><li>Contrai: remove coluna antiga em todos os shards</li></ol><p>Nunca faça <code>ALTER TABLE</code> bloqueante em shards com tráfego. Use pt-online-schema-change (MySQL) ou pg_repack (Postgres).</p>',
      tip: 'O expand-contract é o padrão usado em produção. Candidatos que falam só "rodar migration" sem mencionar dual-write e backfill não têm experiência real com sharding.',
    },
    {
      level: 'senior',
      q: 'Como funcionam transações distribuídas em sistemas shardados?',
      a: '<p>Opções por ordem de complexidade:</p><p><strong>Evitar</strong>: modelar para que transações críticas fiquem num único shard. A solução mais comum e correta.</p><p><strong>2PC (Two-Phase Commit)</strong>: coordinator pergunta "pode commitar?" para todos os shards, depois comanda commit/rollback. Problemas: bloqueante, coordinator é SPOF, transações penduradas se coordinator cair.</p><p><strong>Saga pattern</strong>: série de transações locais com compensações (rollbacks semânticos). Eventual consistency, sem bloqueio. Padrão moderno para microsserviços.</p><p><strong>CRDT + eventual consistency</strong>: para dados que podem divergir e depois reconciliar (contadores, sets).</p>',
      tip: 'A resposta sênior começa em "modelar para evitar". Demonstra que você entende que o custo real de 2PC em produção (latência, bloqueios, falhas parciais) supera quase sempre os benefícios.',
    },
    {
      level: 'pleno',
      q: 'O que é resharding e quais os desafios?',
      a: '<p>Resharding é redistribuir dados entre shards: aumentar N (scale out) ou reorganizar distribuição. Desafios:</p><ul><li><strong>Movimento de dados</strong>: transferir TBs online sem afetar tráfego</li><li><strong>Dual-write</strong>: durante migração, escrever em shard antigo e novo</li><li><strong>Consistência</strong>: garantir que dados movidos chegam completos antes de redirecionar leitura</li><li><strong>Rollback</strong>: se algo dá errado, como voltar atrás?</li></ul><p>Estratégia típica: copiar dados, verificar checksum, ativar dual-write, confirmar sincronização, redirecionar tráfego, desativar old shard.</p>',
      tip: 'Consistent hashing minimiza resharding — mencione isso como vantagem arquitetural. Sem consistent hashing, qualquer mudança de N é um resharding catastrófico.',
    },
    {
      level: 'senior',
      q: 'Como sharding impacta índices e queries secundárias?',
      a: '<p>Índice local (por shard): cada shard mantém seu próprio índice. Query por shard key é eficiente. Query por campo não-shard key requer <strong>scatter-gather</strong>: fanout para todos os shards, agrega resultado. Custo linear em N shards.</p><p>Índice global: índice centralizado ou distribuído que mapeia qualquer campo para shard. DynamoDB Global Secondary Index, Elasticsearch como search index na frente. Vantagem: queries eficientes. Custo: consistência eventual entre índice e dados.</p><p>Solução prática: modelar para que queries mais frequentes usem shard key. Para queries por campo secundário: read model separado (CQRS) com agregação assíncrona.</p>',
      tip: 'Scatter-gather com N shards significa N parallel queries + merge. Em 50 shards, uma query simples vira 50 queries. Isso é o argumento mais forte para modelagem cuidadosa antes de shardar.',
    },
    {
      level: 'senior',
      q: 'Como DynamoDB implementa sharding e o que é adaptive capacity?',
      a: '<p>DynamoDB usa consistent hashing internamente. Você define partition key (shard key) — a AWS distribui automaticamente. Capacidade provisionada (RCU/WCU) é dividida igualmente entre partições.</p><p>Problema: se uma partition recebe mais tráfego, esgota sua fração de RCU/WCU mesmo que outras estejam ociosas. Hot partition throttles.</p><p>Adaptive capacity: DynamoDB redistribui automaticamente a capacidade para partições quentes, absorvendo bursts de até 5 minutos. Em 2019: instant adaptive capacity — redistribuição imediata, sem esperar.</p><p>Boas práticas: partition key com alta cardinalidade, adicionar timestamp ou UUID para espalhar writes, usar DAX (cache) para hot reads.</p>',
      tip: 'Mencionar adaptive capacity mostra conhecimento de produção com DynamoDB. Entrevistadores de empresas AWS-heavy adoram essa pergunta.',
    },
    {
      level: 'pleno',
      q: 'Como você monitoraria um sistema shardado em produção?',
      a: '<p>Métricas por shard (não só agregadas):</p><ul><li><strong>QPS por shard</strong>: detecta hot shard antes de virar problema</li><li><strong>Latência p99 por shard</strong>: shard lento pode não aparecer na média</li><li><strong>Tamanho em disco por shard</strong>: detecta distribuição desigual de dados</li><li><strong>Cross-shard query rate</strong>: aumento indica problema de modelagem</li></ul><p>Alertas: QPS de um shard &gt; 2x a média dos outros → investigar hot shard. Tamanho de um shard &gt; 150% da média → planejar split.</p><p>Ferramentas: dashboards separados por shard no Grafana, métricas com label <code>shard_id</code> no Prometheus.</p>',
      tip: 'Monitoramento por shard (não agregado) é o que diferencia operação real de sharding. Médias escondem problemas em shards específicos.',
    },
    {
      level: 'senior',
      q: 'Qual a diferença entre particionamento local e sharding?',
      a: '<p><strong>Particionamento local</strong> (Postgres PARTITION BY): divide fisicamente uma tabela em partitions no mesmo servidor. O banco gerencia transparentemente. Benefícios: partition pruning (queries por range só tocam partitions relevantes), manutenção por partition (VACUUM, index rebuild), sem overhead de rede.</p><p><strong>Sharding</strong>: dados em servidores diferentes. Escala horizontal genuína — cada shard pode estar em máquina diferente. Requisito apenas quando um único servidor não suporta o volume.</p><p>Sequência correta: tabela grande → particionar localmente → escalar verticalmente → replicar → shardar. A maioria para no particionamento local.</p>',
      tip: 'Postgres nativo suporta particionamento por range, list e hash desde v10+. Muitas empresas shardaram prematuramente antes de tentar particionamento local, que é 10x mais simples.',
    },
    {
      level: 'senior',
      q: 'Como você implementaria sharding em um sistema multi-tenant?',
      a: '<p>Três estratégias:</p><p><strong>Shard por tenant</strong>: cada tenant tem seu próprio shard. Isolamento perfeito, compliance fácil. Custo: N tenants = N databases a gerenciar. Viável para enterprise com poucos tenants grandes.</p><p><strong>Tenant como shard key</strong>: <code>hash(tenant_id) % N</code>. Múltiplos tenants por shard. Mais eficiente. Problema: tenant grande monopoliza shard.</p><p><strong>Hybrid</strong>: tenants pequenos compartilham shards, tenants grandes têm shards dedicados. Mais complexo mas otimizado. Abordagem do Notion, Figma.</p><p>Routing: tabela de roteamento (tenant_id → shard) mantida em cache (Redis). Latência de lookup &lt; 1ms.</p>',
      tip: 'A abordagem híbrida é usada por SaaS de escala (Notion, Shopify, Figma). Demonstra conhecimento arquitetural real. Mencione a tabela de roteamento em Redis como componente crítico.',
    },
    {
      level: 'pleno',
      q: 'O que acontece com foreign keys em sistemas shardados?',
      a: '<p>Foreign keys entre shards <strong>não funcionam</strong> — o banco não pode fazer JOIN entre servidores diferentes. Consequências:</p><ul><li>Integridade referencial precisa ser garantida na aplicação</li><li>JOINs cross-shard são proibidos — desnormalize ou use IDs</li><li>Cascadas (ON DELETE CASCADE) não se propagam entre shards</li></ul><p>Solução: modelar para que referências fiquem dentro do mesmo shard. <code>order</code> e <code>order_items</code> com mesmo <code>user_id</code> como shard key garantem colocalização. Para dados compartilhados (produtos, categorias): replicar em cada shard (read-only), sincronizado via eventos.</p>',
      tip: 'A ausência de foreign keys é um dos custos menos discutidos do sharding. Candidatos que mencionam isso espontaneamente demonstram experiência real.',
    },
    {
      level: 'senior',
      q: 'Como Vitess e Citus resolvem os problemas de sharding para MySQL e Postgres?',
      a: '<p><strong>Vitess</strong> (MySQL): proxy VTGate roteia queries para os shards corretos. VTTablet gerencia cada shard. Suporta resharding online, connection pooling, query rewrite. YouTube usa em produção desde 2011. Transparente para a aplicação — mesma API MySQL.</p><p><strong>Citus</strong> (Postgres): extensão nativa que transforma Postgres em banco distribuído. Distributed tables com shard key, reference tables replicadas em todos os shards. Query planner ciente de shards, roda JOINs distribuídos. Microsoft usa no Azure para Cosmos DB for PostgreSQL.</p><p>Ambos abstraem complexidade de sharding mantendo SQL familiar. Trade-off: operacional mais complexo que banco único, mas menos que sharding manual.</p>',
      tip: 'Mencionar Vitess e Citus como soluções gerenciadas de sharding demonstra conhecimento do ecossistema. São as soluções usadas por empresas sérias que não querem sharding manual.',
    },
    {
      level: 'pleno',
      q: 'Como você testaria um sistema shardado?',
      a: '<p>Desafios: testar distribuição, hot shard, cross-shard queries, resharding online.</p><ul><li><strong>Unit tests</strong>: mock de shard router, testar lógica de roteamento isolada</li><li><strong>Integration tests</strong>: Docker Compose com múltiplos containers Postgres/MySQL, testar queries cross-shard reais</li><li><strong>Load tests</strong>: simular hot partition injetando dados desbalanceados; verificar salting e adaptive capacity</li><li><strong>Chaos tests</strong>: derrubar shard durante operação; verificar que outros shards continuam operando</li></ul><p>Para resharding: ambiente de staging com dados de produção (anonimizados), executar resharding, verificar zero data loss, medir impacto de performance.</p>',
      tip: 'Testes de chaos em shard específico demonstra mentalidade de produção. Muitos sistemas falham quando um shard cai porque o routing não tem fallback.',
    },
    {
      level: 'senior',
      q: 'Como você desenharia o sharding de um sistema de mensagens com bilhões de mensagens?',
      a: '<p>Discord case study: PostgreSQL por channel_id sharding. Problema: canais virais (grandes guilds) criam hot shard.</p><p>Evolução Discord: PostgreSQL → Cassandra particionado por channel_id + bucket de tempo (mês). Writes eficientes: append-only. Reads: últimas mensagens = partition mais recente, sem scatter-gather.</p><p>Shard key ideal para mensagens: <code>(channel_id, time_bucket)</code> — coloca mensagens do mesmo canal juntas, bucket de tempo evita partição crescer indefinidamente.</p><p>Para usuários grandes: messages por <code>user_id</code> para inbox (DMs). Separar modelo de dados para "feed de canal" vs "inbox do usuário".</p>',
      tip: 'O caso Discord (SQL para Cassandra) é clássico de system design. Mencionar time bucketing como técnica para evitar partição ilimitada demonstra experiência com dados de séries temporais.',
    },
    {
      level: 'senior',
      q: 'Quais são os principais anti-patterns de sharding que você já viu ou evitaria?',
      a: '<p><strong>Shardar prematuramente</strong>: aumenta custo operacional 10x antes de ser necessário. Postgres + vertical scaling aguenta muito mais do que as pessoas imaginam.</p><p><strong>Shard key sequencial</strong>: timestamp ou auto-increment como shard key concentra writes no último shard.</p><p><strong>Cross-shard queries no caminho crítico</strong>: cada request fazendo fanout para 20 shards = 20x latência de rede + coordenação.</p><p><strong>Transações distribuídas sem modelagem</strong>: 2PC em produção com falhas = transações penduradas, rollbacks manuais.</p><p><strong>Não planejar resharding</strong>: começar com N fixo sem consistent hashing = rebalance catastrófico quando N muda.</p><p><strong>Ignorar hot shard</strong>: não monitorar distribuição de tráfego por shard até virar incidente.</p>',
      tip: 'Liste os anti-patterns em ordem de frequência que você os vê na prática. Isso sinaliza experiência operacional, não apenas conhecimento teórico.',
    },
    {
      level: 'senior',
      q: 'Como você explicaria sharding para um stakeholder não-técnico?',
      a: '<p>Analogia: imagine uma biblioteca com um único bibliotecário (single server). Com o tempo, há tantos livros e leitores que um não dá conta.</p><p>Solução 1 — vertical: contratar um bibliotecário mais rápido e forte. Funciona até um limite.</p><p>Solução 2 — read replicas: abrir filiais que têm cópias dos livros para consulta. Leitores vão às filiais, escritas vão ao original.</p><p>Solução 3 — sharding: dividir o acervo entre múltiplas bibliotecas. Biblioteca A-M, Biblioteca N-Z. Cada uma é responsável por seu conjunto. O catálogo central diz onde ir.</p><p>Custo do sharding: se você precisar de um livro de cada biblioteca ao mesmo tempo, precisa visitar as duas — isso é cross-shard query.</p>',
      tip: 'A capacidade de explicar sistemas distribuídos com analogias simples é diferencial de sênior. Entrevistadores adoram essa pergunta para ver se você entende além da mecânica.',
    },
    {
      level: 'pleno',
      q: 'Como autosharding funciona em bancos gerenciados como Aurora e DynamoDB?',
      a: '<p><strong>Amazon Aurora</strong>: não é sharding real — é single-primary com read replicas e storage distribuído (Aurora Storage Layer). Storage escala até 128 TB automaticamente. Para sharding real de writes, precisaria de Aurora Shards (preview) ou Vitess na frente.</p><p><strong>DynamoDB</strong>: sharding real e automático. Você define partition key, AWS distribui internamente. Não há controle de quantos shards físicos existem. Adaptive capacity redistribui RCU/WCU automaticamente.</p><p><strong>Cassandra/ScyllaDB</strong>: consistent hashing com vnodes. Adicionar nó redistribui automaticamente uma fração das chaves. Rebalance online sem downtime.</p>',
      tip: 'A confusão Aurora = sharding é comum. Aurora resolve escala de storage e reads, não de writes. DynamoDB é o sharding gerenciado real da AWS.',
    },
    {
      level: 'pleno',
      q: 'O que é um shard map e como ele é gerenciado?',
      a: '<p>Shard map (ou routing table) é o mapeamento de como dados são distribuídos: qual shard contém qual intervalo de chaves (range sharding) ou qual hash bucket (hash sharding).</p><p>Componentes:</p><ul><li><strong>Shard map manager</strong>: serviço que mantém e serve o mapa</li><li><strong>Shard map store</strong>: banco que persiste o mapa (geralmente separado dos shards)</li><li><strong>Client library</strong>: cache local do mapa, atualizado periodicamente</li></ul><p>Em consistent hashing: o anel é o shard map implícito — não precisa de store central. Em directory-based: precisa de store central com alta disponibilidade (Redis Cluster, etcd).</p><p>Atualização durante resharding: dual mapping → dados migram → atualiza mapa → remove mapping antigo.</p>',
      tip: 'O shard map manager como SPOF é o problema central de directory-based sharding. Consistent hashing elimina esse SPOF ao fazer o mapa implícito no anel.',
    },
  ],
  diagrams: [
    {
      title: 'Estratégias de Sharding — Comparação Visual',
      html: `<style>
.sh-wrap { font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; }
.sh-title { font-size: 13px; font-weight: 700; color: #f59e0b; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
.sh-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.sh-card { background: #1e293b; border-radius: 8px; padding: 14px; border: 1px solid #334155; }
.sh-card-title { font-size: 12px; font-weight: 700; color: #f59e0b; margin-bottom: 8px; }
.sh-row { display: flex; gap: 4px; margin-bottom: 4px; }
.sh-shard { flex: 1; height: 28px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 600; color: white; }
.sh-shard-hot { animation: sh-pulse 1.5s infinite; }
@keyframes sh-pulse { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.4); } }
.sh-label { font-size: 10px; color: #64748b; margin-top: 8px; line-height: 1.4; }
.sh-pro { color: #4ade80; font-size: 10px; margin-top: 6px; }
.sh-con { color: #f87171; font-size: 10px; }
.sh-divider { width: 100%; height: 1px; background: #334155; margin: 12px 0; }
.sh-legend { display: flex; gap: 16px; flex-wrap: wrap; }
.sh-legend-item { display: flex; align-items: center; gap: 6px; font-size: 10px; color: #94a3b8; }
.sh-legend-dot { width: 10px; height: 10px; border-radius: 2px; }
</style>
<div class="sh-wrap">
  <div class="sh-title">Estratégias de Sharding</div>
  <div class="sh-grid">
    <div class="sh-card">
      <div class="sh-card-title">Range Sharding</div>
      <div class="sh-row">
        <div class="sh-shard" style="background:#3b82f6">A–F</div>
        <div class="sh-shard" style="background:#8b5cf6">G–M</div>
        <div class="sh-shard sh-shard-hot" style="background:#ef4444">N–Z 🔥</div>
      </div>
      <div class="sh-label">Intervalos de chave por shard</div>
      <div class="sh-pro">✓ Range scan eficiente</div>
      <div class="sh-con">✗ Hot shard em skew (ex: timestamp)</div>
    </div>
    <div class="sh-card">
      <div class="sh-card-title">Hash Sharding</div>
      <div class="sh-row">
        <div class="sh-shard" style="background:#3b82f6">34%</div>
        <div class="sh-shard" style="background:#8b5cf6">33%</div>
        <div class="sh-shard" style="background:#10b981">33%</div>
      </div>
      <div class="sh-label">hash(key) % N — distribuição uniforme</div>
      <div class="sh-pro">✓ Balanceado por padrão</div>
      <div class="sh-con">✗ Range queries exigem fanout</div>
    </div>
    <div class="sh-card">
      <div class="sh-card-title">Consistent Hashing</div>
      <div class="sh-row">
        <div class="sh-shard" style="background:#3b82f6">1/N</div>
        <div class="sh-shard" style="background:#8b5cf6">1/N</div>
        <div class="sh-shard" style="background:#10b981">1/N +1</div>
      </div>
      <div class="sh-label">Anel hash — adicionar shard move só 1/N das chaves</div>
      <div class="sh-pro">✓ Resharding mínimo</div>
      <div class="sh-con">✗ Mais complexo de implementar</div>
    </div>
  </div>
  <div class="sh-divider"></div>
  <div class="sh-legend">
    <div class="sh-legend-item"><div class="sh-legend-dot" style="background:#3b82f6"></div>Shard 1</div>
    <div class="sh-legend-item"><div class="sh-legend-dot" style="background:#8b5cf6"></div>Shard 2</div>
    <div class="sh-legend-item"><div class="sh-legend-dot" style="background:#10b981"></div>Shard 3</div>
    <div class="sh-legend-item"><div class="sh-legend-dot" style="background:#ef4444"></div>Hot shard</div>
  </div>
</div>`,
      caption: 'Range e hash têm trade-offs opostos. Consistent hashing resolve o custo de resharding do hash simples.',
    },
    {
      title: 'Consistent Hashing — Anel e Vnodes',
      html: `<style>
.sh-ring-wrap { font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; }
.sh-ring-title { font-size: 13px; font-weight: 700; color: #f59e0b; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
.sh-ring-body { display: flex; gap: 24px; align-items: flex-start; }
.sh-ring-svg { flex: 0 0 200px; }
.sh-ring-info { flex: 1; }
.sh-ring-step { background: #1e293b; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px; border-left: 3px solid #f59e0b; }
.sh-ring-step-label { font-size: 11px; font-weight: 700; color: #f59e0b; margin-bottom: 4px; }
.sh-ring-step-text { font-size: 11px; color: #94a3b8; line-height: 1.5; }
.sh-ring-highlight { color: #e2e8f0; }
</style>
<div class="sh-ring-wrap">
  <div class="sh-ring-title">Consistent Hashing — Anel Hash</div>
  <div class="sh-ring-body">
    <div class="sh-ring-svg">
      <svg viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#334155" stroke-width="2"/>
        <!-- Shard A 0° -->
        <circle cx="180" cy="100" r="12" fill="#3b82f6"/>
        <text x="180" y="104" text-anchor="middle" font-size="9" fill="white" font-weight="bold">A</text>
        <!-- Shard B 120° -->
        <circle cx="60" cy="31" r="12" fill="#8b5cf6"/>
        <text x="60" y="35" text-anchor="middle" font-size="9" fill="white" font-weight="bold">B</text>
        <!-- Shard C 240° -->
        <circle cx="60" cy="169" r="12" fill="#10b981"/>
        <text x="60" y="173" text-anchor="middle" font-size="9" fill="white" font-weight="bold">C</text>
        <!-- Keys -->
        <circle cx="150" cy="37" r="5" fill="#f59e0b"/>
        <text x="165" y="35" font-size="8" fill="#f59e0b">k1</text>
        <circle cx="26" cy="80" r="5" fill="#f59e0b"/>
        <text x="10" y="78" font-size="8" fill="#f59e0b">k2</text>
        <circle cx="100" cy="182" r="5" fill="#f59e0b"/>
        <text x="106" y="196" font-size="8" fill="#f59e0b">k3</text>
        <!-- New shard D between A and B -->
        <circle cx="118" cy="33" r="10" fill="#ef4444" stroke="#fbbf24" stroke-width="2"/>
        <text x="118" y="37" text-anchor="middle" font-size="8" fill="white" font-weight="bold">D+</text>
        <text x="135" y="20" font-size="8" fill="#fbbf24">novo</text>
        <!-- Arrow showing minimal movement -->
        <path d="M 148 40 Q 140 38 130 37" stroke="#fbbf24" stroke-width="1.5" fill="none" marker-end="url(#arr)"/>
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24"/>
          </marker>
        </defs>
      </svg>
    </div>
    <div class="sh-ring-info">
      <div class="sh-ring-step">
        <div class="sh-ring-step-label">Regra de roteamento</div>
        <div class="sh-ring-step-text">Chave vai para o <span class="sh-ring-highlight">próximo shard no sentido horário</span>. k1 → A, k2 → B, k3 → C.</div>
      </div>
      <div class="sh-ring-step">
        <div class="sh-ring-step-label">Adicionando shard D</div>
        <div class="sh-ring-step-text">Shard D entra entre B e A. Apenas as chaves entre B e D migram para D. <span class="sh-ring-highlight">~1/N das chaves</span>, não todas.</div>
      </div>
      <div class="sh-ring-step">
        <div class="sh-ring-step-label">Virtual nodes (vnodes)</div>
        <div class="sh-ring-step-text">Cada shard físico tem múltiplos pontos no anel. Distribui melhor quando shards têm capacidades diferentes. Cassandra usa por padrão.</div>
      </div>
    </div>
  </div>
</div>`,
      caption: 'Consistent hashing garante que adicionar ou remover um shard move apenas 1/N das chaves, ao contrário do hash mod N que reorganiza quase tudo.',
    },
    {
      title: 'Hot Shard — Problema e Mitigações',
      html: `<style>
.sh-hot-wrap { font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; }
.sh-hot-title { font-size: 13px; font-weight: 700; color: #f59e0b; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
.sh-hot-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.sh-hot-section { background: #1e293b; border-radius: 8px; padding: 14px; }
.sh-hot-sec-title { font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 10px; text-transform: uppercase; letter-spacing: .05em; }
.sh-bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.sh-bar-label { font-size: 10px; color: #e2e8f0; width: 50px; flex-shrink: 0; }
.sh-bar-track { flex: 1; height: 14px; background: #334155; border-radius: 3px; overflow: hidden; }
.sh-bar-fill { height: 100%; border-radius: 3px; }
.sh-mitigation { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 8px; }
.sh-mit-num { font-size: 11px; font-weight: 700; color: #f59e0b; flex-shrink: 0; width: 18px; }
.sh-mit-text { font-size: 11px; color: #94a3b8; line-height: 1.5; }
.sh-mit-highlight { color: #e2e8f0; font-weight: 600; }
</style>
<div class="sh-hot-wrap">
  <div class="sh-hot-title">Hot Shard — Diagnóstico e Mitigação</div>
  <div class="sh-hot-cols">
    <div class="sh-hot-section">
      <div class="sh-hot-sec-title">Distribuição de Tráfego</div>
      <div class="sh-bar-row">
        <div class="sh-bar-label">Shard 0</div>
        <div class="sh-bar-track"><div class="sh-bar-fill" style="width:20%;background:#3b82f6"></div></div>
        <span style="font-size:10px;color:#64748b">20%</span>
      </div>
      <div class="sh-bar-row">
        <div class="sh-bar-label">Shard 1</div>
        <div class="sh-bar-track"><div class="sh-bar-fill" style="width:18%;background:#3b82f6"></div></div>
        <span style="font-size:10px;color:#64748b">18%</span>
      </div>
      <div class="sh-bar-row">
        <div class="sh-bar-label">Shard 2 🔥</div>
        <div class="sh-bar-track"><div class="sh-bar-fill" style="width:92%;background:#ef4444"></div></div>
        <span style="font-size:10px;color:#ef4444">92%</span>
      </div>
      <div class="sh-bar-row">
        <div class="sh-bar-label">Shard 3</div>
        <div class="sh-bar-track"><div class="sh-bar-fill" style="width:15%;background:#3b82f6"></div></div>
        <span style="font-size:10px;color:#64748b">15%</span>
      </div>
      <div style="margin-top:10px;font-size:10px;color:#f87171;line-height:1.5">
        Shard 2 saturado: latência p99 10x maior, writes começando a falhar.
      </div>
    </div>
    <div class="sh-hot-section">
      <div class="sh-hot-sec-title">Mitigações</div>
      <div class="sh-mitigation">
        <div class="sh-mit-num">1.</div>
        <div class="sh-mit-text"><span class="sh-mit-highlight">Cache (Redis/CDN)</span>: intercepta reads antes do shard. Mais rápido de implementar.</div>
      </div>
      <div class="sh-mitigation">
        <div class="sh-mit-num">2.</div>
        <div class="sh-mit-text"><span class="sh-mit-highlight">Salting</span>: adiciona sufixo aleatório à chave (<code>key_0..key_9</code>). Escrita distribuída, leitura agrega.</div>
      </div>
      <div class="sh-mitigation">
        <div class="sh-mit-num">3.</div>
        <div class="sh-mit-text"><span class="sh-mit-highlight">Shard splitting</span>: divide o shard 2 em 2 ou 4 sub-shards. Operação cara mas definitiva.</div>
      </div>
      <div class="sh-mitigation">
        <div class="sh-mit-num">4.</div>
        <div class="sh-mit-text"><span class="sh-mit-highlight">Replicação seletiva</span>: dado do hot user replicado em múltiplos shards de leitura.</div>
      </div>
    </div>
  </div>
</div>`,
      caption: 'Hot shard é o problema mais frequente em produção. Cache é a primeira linha, salting e shard splitting são armas pesadas.',
    },
    {
      title: 'Cross-Shard Query — Scatter-Gather Pattern',
      html: `<style>
.sh-sg-wrap { font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; }
.sh-sg-title { font-size: 13px; font-weight: 700; color: #f59e0b; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
.sh-sg-flow { display: flex; flex-direction: column; gap: 12px; }
.sh-sg-row { display: flex; align-items: center; gap: 12px; }
.sh-sg-node { background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 8px 12px; font-size: 11px; text-align: center; min-width: 80px; }
.sh-sg-arrow { color: #f59e0b; font-size: 18px; flex-shrink: 0; }
.sh-sg-shards { display: flex; gap: 6px; }
.sh-sg-shard { background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 6px 10px; font-size: 10px; text-align: center; }
.sh-sg-divider { width: 100%; height: 1px; background: #334155; }
.sh-sg-note { font-size: 10px; color: #64748b; line-height: 1.5; padding: 8px; background: #1e293b; border-radius: 6px; border-left: 3px solid #f59e0b; }
.sh-sg-cost { color: #f87171; font-weight: 600; }
.sh-sg-good { color: #4ade80; font-weight: 600; }
</style>
<div class="sh-sg-wrap">
  <div class="sh-sg-title">Cross-Shard Query — Custo Real</div>
  <div class="sh-sg-flow">
    <div class="sh-sg-row">
      <div class="sh-sg-node" style="border-color:#f59e0b;color:#f59e0b">Coordinator</div>
      <div class="sh-sg-arrow">→</div>
      <div style="font-size:11px;color:#94a3b8;font-style:italic">SELECT COUNT(*) FROM users WHERE country='BR'</div>
    </div>
    <div class="sh-sg-row">
      <div class="sh-sg-node" style="border-color:#f59e0b;color:#f59e0b">Scatter</div>
      <div class="sh-sg-arrow">→→→</div>
      <div class="sh-sg-shards">
        <div class="sh-sg-shard">Shard 0<br/><span style="color:#94a3b8;font-size:9px">query</span></div>
        <div class="sh-sg-shard">Shard 1<br/><span style="color:#94a3b8;font-size:9px">query</span></div>
        <div class="sh-sg-shard">Shard 2<br/><span style="color:#94a3b8;font-size:9px">query</span></div>
        <div class="sh-sg-shard">Shard N<br/><span style="color:#94a3b8;font-size:9px">query</span></div>
      </div>
    </div>
    <div class="sh-sg-row">
      <div class="sh-sg-node" style="border-color:#10b981;color:#10b981">Gather</div>
      <div class="sh-sg-arrow">←←←</div>
      <div style="font-size:11px;color:#94a3b8">results: 234k, 198k, 301k, ... → SUM = 2.1M</div>
    </div>
    <div class="sh-sg-divider"></div>
    <div class="sh-sg-note">
      <span class="sh-sg-cost">Custo:</span> N parallel queries + N round trips de rede + merge em memória no coordinator. Com 50 shards: 50 queries simultâneas. Latência = max(shard latency), não média.<br/><br/>
      <span class="sh-sg-good">Solução:</span> Manter read model agregado (CQRS) — tabela <code>country_counts</code> atualizada via eventos. Query vira lookup em único lugar.
    </div>
  </div>
</div>`,
      caption: 'Scatter-gather é inevitável em algumas queries, mas nunca deve estar no caminho crítico da aplicação. CQRS resolve com read models dedicados.',
    },
  ],
  cheatsheet: {
    title: 'Sharding — Cheatsheet',
    html: `<style>
.sh-cs-wrap { font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; }
.sh-cs-title { font-size: 13px; font-weight: 700; color: #f59e0b; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
.sh-cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.sh-cs-section { background: #1e293b; border-radius: 8px; padding: 12px; }
.sh-cs-sec-title { font-size: 11px; font-weight: 700; color: #f59e0b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: .04em; border-bottom: 1px solid #334155; padding-bottom: 4px; }
.sh-cs-row { display: flex; gap: 8px; margin-bottom: 5px; align-items: flex-start; }
.sh-cs-key { font-size: 10px; font-weight: 600; color: #e2e8f0; min-width: 110px; }
.sh-cs-val { font-size: 10px; color: #94a3b8; line-height: 1.4; }
.sh-cs-badge { display: inline-block; font-size: 9px; padding: 1px 5px; border-radius: 3px; font-weight: 600; margin-right: 4px; }
.sh-cs-green { background: rgba(74,222,128,.15); color: #4ade80; }
.sh-cs-red { background: rgba(248,113,113,.15); color: #f87171; }
.sh-cs-amber { background: rgba(251,191,36,.15); color: #fbbf24; }
.sh-cs-formula { font-size: 10px; color: #a5f3fc; font-family: monospace; background: #0f172a; border-radius: 3px; padding: 2px 6px; display: inline-block; margin-top: 4px; }
</style>
<div class="sh-cs-wrap">
  <div class="sh-cs-title">Sharding — Referência Rápida</div>
  <div class="sh-cs-grid">
    <div class="sh-cs-section">
      <div class="sh-cs-sec-title">Estratégias</div>
      <div class="sh-cs-row"><div class="sh-cs-key">Range</div><div class="sh-cs-val">A-F → S1, G-M → S2. Range scan OK. Hot shard em skew.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key">Hash mod N</div><div class="sh-cs-val">hash(key) % N. Distribuição uniforme. Resharding total.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key">Consistent hash</div><div class="sh-cs-val">Anel circular. Resharding mínimo (1/N chaves).</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key">Geographic</div><div class="sh-cs-val">Por região. Latência + GDPR. Cross-region caro.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key">Directory</div><div class="sh-cs-val">Lookup table. Flexível. SPOF se centralizado.</div></div>
    </div>
    <div class="sh-cs-section">
      <div class="sh-cs-sec-title">Quando Shardar?</div>
      <div class="sh-cs-row"><div class="sh-cs-key"><span class="sh-cs-badge sh-cs-green">1°</span>Vertical</div><div class="sh-cs-val">Máquina maior. Mais simples até TBs.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key"><span class="sh-cs-badge sh-cs-green">2°</span>Réplicas</div><div class="sh-cs-val">Read replicas para reads. 10:1 read:write comum.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key"><span class="sh-cs-badge sh-cs-green">3°</span>Cache</div><div class="sh-cs-val">Redis na frente. Reduz QPS em ordem de grandeza.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key"><span class="sh-cs-badge sh-cs-green">4°</span>Partição local</div><div class="sh-cs-val">PARTITION BY no mesmo server. Sem complexidade dist.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key"><span class="sh-cs-badge sh-cs-amber">5°</span>Sharding</div><div class="sh-cs-val">Só quando 1-4 esgotaram. Custo operacional 10x.</div></div>
    </div>
    <div class="sh-cs-section">
      <div class="sh-cs-sec-title">Shard Key — Critérios</div>
      <div class="sh-cs-row"><div class="sh-cs-key">Cardinalidade</div><div class="sh-cs-val">Muitos valores distintos para distribuir bem.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key">Uniformidade</div><div class="sh-cs-val">Sem concentração de tráfego em poucos valores.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key">Aderência</div><div class="sh-cs-val">Query mais frequente → dado em 1 shard só.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key"><span class="sh-cs-badge sh-cs-green">Boas</span></div><div class="sh-cs-val">user_id, tenant_id, uuid. Alta cardinalidade, uniforme.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key"><span class="sh-cs-badge sh-cs-red">Ruins</span></div><div class="sh-cs-val">timestamp, status, country. Skew óbvio.</div></div>
    </div>
    <div class="sh-cs-section">
      <div class="sh-cs-sec-title">Problemas e Mitigações</div>
      <div class="sh-cs-row"><div class="sh-cs-key">Hot shard</div><div class="sh-cs-val">Cache → salting → splitting → réplica seletiva.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key">Cross-shard query</div><div class="sh-cs-val">Evitar no caminho crítico. CQRS com read model.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key">Transação dist.</div><div class="sh-cs-val">Modelar para evitar → Saga → 2PC (último recurso).</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key">Resharding</div><div class="sh-cs-val">Consistent hashing minimiza. Dual-write durante migração.</div></div>
      <div class="sh-cs-row"><div class="sh-cs-key">Foreign keys</div><div class="sh-cs-val">Não funcionam cross-shard. Garantir na aplicação.</div></div>
    </div>
  </div>
</div>`,
  },
  mindmap: {
    title: 'Sharding — Mind Map',
    html: `<style>
.sh-mm-wrap { font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; }
.sh-mm-title { font-size: 13px; font-weight: 700; color: #f59e0b; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
.sh-mm-center { text-align: center; margin-bottom: 16px; }
.sh-mm-core { display: inline-block; background: #f59e0b; color: #1a0f00; font-weight: 700; font-size: 14px; padding: 8px 20px; border-radius: 20px; }
.sh-mm-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.sh-mm-branch { background: #1e293b; border-radius: 8px; padding: 12px; border-top: 3px solid; }
.sh-mm-branch-title { font-size: 11px; font-weight: 700; margin-bottom: 8px; }
.sh-mm-item { font-size: 10px; color: #94a3b8; padding: 3px 0; border-bottom: 1px solid #0f172a; }
.sh-mm-item:last-child { border-bottom: none; }
.sh-mm-em { color: #e2e8f0; }
</style>
<div class="sh-mm-wrap">
  <div class="sh-mm-title">Sharding — Mapa Mental</div>
  <div class="sh-mm-center"><div class="sh-mm-core">SHARDING</div></div>
  <div class="sh-mm-grid">
    <div class="sh-mm-branch" style="border-color:#3b82f6">
      <div class="sh-mm-branch-title" style="color:#3b82f6">Estratégias</div>
      <div class="sh-mm-item"><span class="sh-mm-em">Range</span> — intervalos de chave</div>
      <div class="sh-mm-item"><span class="sh-mm-em">Hash</span> — mod N</div>
      <div class="sh-mm-item"><span class="sh-mm-em">Consistent hashing</span> — anel</div>
      <div class="sh-mm-item"><span class="sh-mm-em">Geographic</span> — por região</div>
      <div class="sh-mm-item"><span class="sh-mm-em">Directory</span> — lookup table</div>
    </div>
    <div class="sh-mm-branch" style="border-color:#8b5cf6">
      <div class="sh-mm-branch-title" style="color:#8b5cf6">Shard Key</div>
      <div class="sh-mm-item">Cardinalidade alta</div>
      <div class="sh-mm-item">Distribuição uniforme</div>
      <div class="sh-mm-item">Aderência ao acesso</div>
      <div class="sh-mm-item">user_id, tenant_id (boas)</div>
      <div class="sh-mm-item">timestamp, status (ruins)</div>
    </div>
    <div class="sh-mm-branch" style="border-color:#ef4444">
      <div class="sh-mm-branch-title" style="color:#ef4444">Problemas</div>
      <div class="sh-mm-item"><span class="sh-mm-em">Hot shard</span> — concentração</div>
      <div class="sh-mm-item"><span class="sh-mm-em">Cross-shard</span> — scatter-gather</div>
      <div class="sh-mm-item"><span class="sh-mm-em">Transação dist.</span> — 2PC/Saga</div>
      <div class="sh-mm-item"><span class="sh-mm-em">Resharding</span> — migração</div>
      <div class="sh-mm-item">Foreign keys — N/A</div>
    </div>
    <div class="sh-mm-branch" style="border-color:#10b981">
      <div class="sh-mm-branch-title" style="color:#10b981">Alternativas Antes</div>
      <div class="sh-mm-item">Vertical scaling</div>
      <div class="sh-mm-item">Read replicas</div>
      <div class="sh-mm-item">Cache (Redis, CDN)</div>
      <div class="sh-mm-item">Particionamento local</div>
      <div class="sh-mm-item">Arquivamento cold storage</div>
    </div>
    <div class="sh-mm-branch" style="border-color:#f59e0b">
      <div class="sh-mm-branch-title" style="color:#f59e0b">Consistent Hashing</div>
      <div class="sh-mm-item">Anel circular 0-2³²</div>
      <div class="sh-mm-item">1/N chaves migram</div>
      <div class="sh-mm-item">Virtual nodes (vnodes)</div>
      <div class="sh-mm-item">Cassandra, Dynamo, Memcached</div>
      <div class="sh-mm-item">Sem SPOF de routing</div>
    </div>
    <div class="sh-mm-branch" style="border-color:#f472b6">
      <div class="sh-mm-branch-title" style="color:#f472b6">Ferramentas</div>
      <div class="sh-mm-item">Vitess — MySQL sharding</div>
      <div class="sh-mm-item">Citus — Postgres sharding</div>
      <div class="sh-mm-item">DynamoDB — autosharding</div>
      <div class="sh-mm-item">Cassandra — consistent hash</div>
      <div class="sh-mm-item">MongoDB — sharded cluster</div>
    </div>
  </div>
</div>`,
  },
  mnemonics: [
    {
      label: 'Alternativas antes de shardar: "VRCP-S"',
      trick: 'V-R-C-P-S',
      explanation: 'Vertical scaling → Read replicas → Cache → Particionamento local → Sharding. Ordem crescente de complexidade. A maioria para em P.',
    },
    {
      label: 'Shard key boa: "CUA" — Cardinalidade, Uniformidade, Aderência',
      trick: 'CUA',
      explanation: 'Cardinalidade alta (muitos valores), Uniformidade de distribuição (sem hot shard) e Aderência ao padrão de acesso (query principal num só shard). A shard key que falha em qualquer C, U ou A vai gerar problemas em produção.',
    },
    {
      label: 'Hot shard: escalada de resposta "C-S-Sp-R"',
      trick: 'Cache → Salt → Split → Replicate',
      explanation: 'Cache absorve reads. Salting distribui writes. Splitting divide o shard. Replicação seletiva para celebridades. Sempre na ordem — cache é mais barato, splitting é mais caro.',
    },
    {
      label: 'Cross-shard query: "Fanout = N × custo" — modele para evitar',
      trick: 'FANOUT',
      explanation: 'Fanout significa que cada query cross-shard toca todos os N shards. Com 20 shards, uma query simples vira 20 queries paralelas + merge. Nunca ponha fanout no caminho crítico — use CQRS com read model dedicado.',
    },
    {
      label: 'Transação distribuída: "Evita → Saga → 2PC"',
      trick: 'E-S-2',
      explanation: 'Evitar é o melhor — modele para que transações críticas fiquem em um único shard. Saga para eventual consistency com compensações. 2PC apenas como último recurso — bloqueante, SPOF, risco de transação pendurada.',
    },
  ],
  exercises: [
    {
      level: 'iniciante',
      title: 'Escolher shard key para e-commerce',
      description: 'Dado um e-commerce com tabelas orders, order_items e users. Qual shard key você usaria para cada tabela? Justifique considerando padrão de acesso (consultar pedido por usuário é a operação mais frequente) e evitar cross-shard joins.',
      concepts: ['shard-key', 'colocation', 'padrão de acesso', 'cross-shard query'],
    },
    {
      level: 'intermediario',
      title: 'Implementar consistent hashing em Go/TypeScript',
      description: 'Implemente um consistent hash ring com suporte a virtual nodes. A API deve suportar: addNode(id), removeNode(id), getNode(key). Teste que adicionar um nó move aproximadamente 1/N das chaves. Compare a distribuição com e sem virtual nodes.',
      concepts: ['consistent hashing', 'anel hash', 'virtual nodes', 'distribuição uniforme'],
    },
    {
      level: 'intermediario',
      title: 'Diagnóstico de hot shard',
      description: 'Dado um sistema de posts sociais shardado por post_id com 10 shards. Uma celebridade com 10M seguidores publica um post — o shard que contém esse post está saturado. Desenhe e implemente uma estratégia de mitigação usando cache + salting. Documente os trade-offs.',
      concepts: ['hot shard', 'cache', 'salting', 'scatter-gather', 'monitoramento'],
    },
    {
      level: 'senior',
      title: 'Reshape de sistema de mensagens para sharding',
      description: 'Um sistema de mensagens tem 500M de mensagens em um único Postgres. Planeje a migração para sharding por channel_id com consistent hashing, incluindo: (1) seleção da shard key com justificativa, (2) estratégia de migração online sem downtime usando dual-write, (3) como lidar com queries de histórico por usuário que cruzam shards, (4) monitoramento pós-migração.',
      concepts: ['resharding', 'dual-write', 'consistent hashing', 'migração online', 'CQRS', 'monitoramento'],
    },
    {
      level: 'senior',
      title: 'Sistema multi-tenant com sharding híbrido',
      description: 'Projete o sharding para um SaaS B2B com 3 tipos de clientes: (1) free (10k usuários, 1k MAU), (2) pro (50 clientes, 100k usuário cada), (3) enterprise (5 clientes, 10M usuários cada). Clientes enterprise têm exigência de data isolation completa. Implemente o shard map, lógica de roteamento e estratégia para onboarding de novo cliente enterprise.',
      concepts: ['multi-tenant', 'sharding híbrido', 'shard map', 'routing', 'data isolation', 'compliance'],
    },
  ],
  codeExamples: [
    {
      title: 'Consistent Hash Ring — implementação TypeScript',
      language: 'typescript',
      code: `class ConsistentHashRing {
  private ring: Map<number, string> = new Map()
  private sortedKeys: number[] = []
  private virtualNodes: number

  constructor(virtualNodes = 150) {
    this.virtualNodes = virtualNodes
  }

  // Adiciona nó com múltiplos virtual nodes no anel
  addNode(nodeId: string): void {
    for (let i = 0; i < this.virtualNodes; i++) {
      const key = this.hash(\`\${nodeId}-vnode-\${i}\`)
      this.ring.set(key, nodeId)
    }
    this.sortedKeys = [...this.ring.keys()].sort((a, b) => a - b)
  }

  // Remove nó e seus virtual nodes
  removeNode(nodeId: string): void {
    for (let i = 0; i < this.virtualNodes; i++) {
      const key = this.hash(\`\${nodeId}-vnode-\${i}\`)
      this.ring.delete(key)
    }
    this.sortedKeys = [...this.ring.keys()].sort((a, b) => a - b)
  }

  // Encontra o nó responsável pela chave (próximo no anel)
  getNode(key: string): string | null {
    if (this.sortedKeys.length === 0) return null

    const hash = this.hash(key)
    // Busca binária pelo primeiro shard >= hash
    const idx = this.bisect(hash)
    const ringKey = this.sortedKeys[idx % this.sortedKeys.length]
    return this.ring.get(ringKey) ?? null
  }

  private hash(key: string): number {
    // FNV-1a hash (32-bit) — determinístico, bem distribuído
    let h = 2166136261
    for (const c of key) {
      h ^= c.charCodeAt(0)
      h = Math.imul(h, 16777619)
    }
    return h >>> 0 // unsigned 32-bit
  }

  private bisect(target: number): number {
    let lo = 0, hi = this.sortedKeys.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (this.sortedKeys[mid] < target) lo = mid + 1
      else hi = mid
    }
    return lo
  }
}

// Uso:
const ring = new ConsistentHashRing(150)
ring.addNode('shard-0')
ring.addNode('shard-1')
ring.addNode('shard-2')

console.log(ring.getNode('user:123'))   // → 'shard-2' (determinístico)
console.log(ring.getNode('user:456'))   // → 'shard-0'

// Adicionar shard apenas move ~1/N das chaves
ring.addNode('shard-3')
// user:123 pode ou não mudar — depende do anel
// user:456 provavelmente fica no mesmo shard`,
    },
    {
      title: 'Shard Router — middleware Express',
      language: 'typescript',
      code: `import { Pool } from 'pg'

// Shard map em Redis (simplificado como Map em memória)
const SHARD_MAP: Record<string, Pool> = {
  'shard-0': new Pool({ host: 'db-0.internal', database: 'app' }),
  'shard-1': new Pool({ host: 'db-1.internal', database: 'app' }),
  'shard-2': new Pool({ host: 'db-2.internal', database: 'app' }),
}

const SHARD_COUNT = Object.keys(SHARD_MAP).length

// Função pura de roteamento — hash mod N
function getShardForUser(userId: string): Pool {
  // FNV-1a hash
  let h = 2166136261
  for (const c of userId) {
    h ^= c.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  const shardIdx = (h >>> 0) % SHARD_COUNT
  return SHARD_MAP[\`shard-\${shardIdx}\`]
}

// Middleware: injeta o pool correto no request
export function shardMiddleware(req: any, res: any, next: any) {
  const userId = req.headers['x-user-id'] as string
  if (!userId) return res.status(401).json({ error: 'user-id required' })

  req.db = getShardForUser(userId)
  next()
}

// Controller usando o shard correto automaticamente
app.get('/orders', shardMiddleware, async (req, res) => {
  // req.db já é o pool do shard correto para este userId
  const { rows } = await req.db.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
    [req.headers['x-user-id']]
  )
  res.json(rows)
})

// Cross-shard: scatter-gather manual (evitar no caminho crítico)
async function countAllUsers(): Promise<number> {
  const counts = await Promise.all(
    Object.values(SHARD_MAP).map(pool =>
      pool.query('SELECT COUNT(*) FROM users').then(r => Number(r.rows[0].count))
    )
  )
  return counts.reduce((a, b) => a + b, 0)
}`,
    },
    {
      title: 'Salting para Hot Shard — write distribuído',
      language: 'typescript',
      code: `const SALT_BUCKETS = 10 // distribui writes em 10 buckets

// Escrita: escolhe bucket aleatório
async function incrementCounter(key: string, delta: number) {
  const bucket = Math.floor(Math.random() * SALT_BUCKETS)
  const saltedKey = \`\${key}:bucket:\${bucket}\`

  // Write vai para um bucket aleatório — sem hot shard
  await redis.incrby(saltedKey, delta)
}

// Leitura: agrega todos os buckets
async function getCounter(key: string): Promise<number> {
  const keys = Array.from({ length: SALT_BUCKETS }, (_, i) =>
    \`\${key}:bucket:\${i}\`
  )

  const values = await redis.mget(...keys)
  return values.reduce((sum, v) => sum + (Number(v) || 0), 0)
}

// Exemplo: contador de views de post viral
// Sem salting: todas as writes vão para 1 chave → hot shard
await redis.incr('post:viral:views') // ❌ hot shard

// Com salting: distribui em 10 chaves
await incrementCounter('post:viral:views', 1) // ✅ balanceado
const views = await getCounter('post:viral:views') // agrega 10 buckets

// Trade-off: escrita O(1) → leitura O(SALT_BUCKETS)
// Valor: escrita distribuída vs leitura um pouco mais cara`,
    },
    {
      title: 'Resharding online — dual-write pattern',
      language: 'typescript',
      code: `// Fase de migração: dual-write + leitura do shard antigo
enum MigrationPhase {
  WRITING_OLD   = 'writing-old',    // escrita só no shard antigo
  DUAL_WRITE    = 'dual-write',     // escrita em ambos, leitura do antigo
  READING_NEW   = 'reading-new',    // leitura do novo, escrita em ambos
  COMPLETE      = 'complete',       // somente novo
}

async function writeUser(userId: string, data: User, phase: MigrationPhase) {
  const oldShard = getOldShard(userId) // hash mod 4
  const newShard = getNewShard(userId) // hash mod 8

  if (phase === MigrationPhase.WRITING_OLD) {
    await oldShard.save(userId, data)

  } else if (phase === MigrationPhase.DUAL_WRITE || phase === MigrationPhase.READING_NEW) {
    // Escrita atômica em ambos: se um falha, compensa
    const [oldResult, newResult] = await Promise.allSettled([
      oldShard.save(userId, data),
      newShard.save(userId, data),
    ])
    if (newResult.status === 'rejected') {
      // Log para reconciliação posterior
      await reconciliationQueue.add({ userId, data, shard: 'new' })
    }

  } else {
    await newShard.save(userId, data)
  }
}

async function readUser(userId: string, phase: MigrationPhase): Promise<User> {
  if (phase === MigrationPhase.READING_NEW || phase === MigrationPhase.COMPLETE) {
    return getNewShard(userId).get(userId)
  }
  return getOldShard(userId).get(userId)
}

// Sequência de migração:
// 1. WRITING_OLD (estado inicial)
// 2. DUAL_WRITE + backfill (copiar dados antigos para novo shard)
// 3. READING_NEW (verificar dados copiados, latência estável)
// 4. COMPLETE (remover shard antigo)`,
    },
  ],
  videos: [
    { title: 'Database Sharding Explained', channel: 'Arpit Bhayani', url: 'https://www.youtube.com/watch?v=YzcB4bSGEow', topic: 'Fundamentos de sharding' },
    { title: 'Consistent Hashing | System Design', channel: 'ByteByteGo', url: 'https://www.youtube.com/watch?v=UF9Iqmg94tk', topic: 'Consistent hashing visual' },
    { title: 'How Discord Stores Billions of Messages', channel: 'Fireship', url: 'https://www.youtube.com/watch?v=xynX8ELLK0o', topic: 'Case study real' },
    { title: 'Database Sharding | System Design Interview', channel: 'sudoCODE', url: 'https://www.youtube.com/watch?v=hdxdhCpgYo8', topic: 'Entrevista system design' },
    { title: 'Vitess: Sharding MySQL at YouTube', channel: 'PlanetScale', url: 'https://www.youtube.com/watch?v=E6H4bgJ3Z6c', topic: 'Vitess e sharding MySQL' },
  ],
  resources: [
    { title: 'Designing Data-Intensive Applications — Kleppmann', url: 'https://dataintensive.net/', kind: 'livro' },
    { title: 'System Design Primer — Sharding', url: 'https://github.com/donnemartin/system-design-primer#sharding', kind: 'docs' },
    { title: 'Discord — How We Store Billions of Messages', url: 'https://discord.com/blog/how-discord-stores-billions-of-messages', kind: 'artigo' },
    { title: 'Vitess — Sharding MySQL', url: 'https://vitess.io/docs/', kind: 'docs' },
    { title: 'Citus — Postgres Sharding', url: 'https://www.citusdata.com/blog/2017/08/30/citus-6-2-high-performance-postgres/', kind: 'artigo' },
    { title: 'DynamoDB — Adaptive Capacity', url: 'https://aws.amazon.com/blogs/database/how-amazon-dynamodb-adaptive-capacity-accommodates-uneven-data-access-patterns/', kind: 'docs' },
    { title: 'Consistent Hashing Paper (Karger et al.)', url: 'https://dl.acm.org/doi/10.1145/258533.258660', kind: 'artigo' },
    { title: 'Instagram Sharding — Sharding & IDs at Instagram', url: 'https://instagram-engineering.com/sharding-ids-at-instagram-1cf5a71e5a5c', kind: 'artigo' },
  ],
}

export default sharding
