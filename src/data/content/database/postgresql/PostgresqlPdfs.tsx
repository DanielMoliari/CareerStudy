'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildErrorRefPdf } from '@/components/pdfs/ErrorRefPdf'
import type { ErrorEntry } from '@/components/pdfs/ErrorRefPdf'

// ── Paleta PostgreSQL ─────────────────────────────────────────────────────────
const C = '#336791'   // PostgreSQL blue

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista PostgreSQL',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: MVCC, VACUUM, tipos de índice, EXPLAIN ANALYZE, isolamento de transação, WAL, connection pooling, particionamento, JSONB, window functions, CTEs — com respostas para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'SQL essencial, índices, EXPLAIN, psql numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: DDL com constraints, tipos de índice e quando usar, EXPLAIN ANALYZE leitura, JOINs e algoritmos, window functions, CTEs, JSONB operators, comandos psql. Tudo sem abrir documentação.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os truques que grudam PostgreSQL na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'VACUUM fica no MVCC, GIN para Generalized INverted, B-Tree é o Default, WAL antes dos dados. Truques verbais para os pontos mais cobrados em entrevistas.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 8 erros mais comuns com PostgreSQL',
    type: 'antipatterns',
    pages: 3,
    description: 'N+1 queries, SELECT *, FK sem índice, sem connection pool, ignorar bloat, NOT IN com NULL, LIKE sem índice, ORDER BY rand(). Com código errado × correto.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'PostgreSQL do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 9 categorias (MVCC, Índices, Query Planner, WAL, Replicação, Tipos avançados, Extensões, Performance, Admin) e checklist de domínio pré-entrevista.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
  {
    id: 'quick-ref',
    title: 'Quick Ref — psql',
    subtitle: 'Comandos psql CLI mais usados num cartão',
    type: 'quick-ref',
    pages: 1,
    description: 'Cartão de bolso: meta-commands psql (\\d, \\dt, \\di, \\l, \\c), explain shortcuts, queries de diagnóstico (pg_stat_activity, pg_locks, pg_stat_user_tables), flags de conexão.',
    icon: '06',
    goal: 'Referência de CLI',
  },
  {
    id: 'errors',
    title: 'Errors Ref',
    subtitle: 'Erros comuns do PostgreSQL: causa e solução',
    type: 'errors',
    pages: 4,
    description: 'Lock timeout, deadlock detected, serialization failure, too many clients, could not serialize, division by zero, value too long, foreign key violation, unique violation — com causa raiz e solução.',
    icon: '07',
    goal: 'Debugging rápido',
  },
]

// ── Q&A ───────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Como o MVCC funciona no PostgreSQL e por que ele cria dead tuples?',
    a: 'MVCC (Multi-Version Concurrency Control): cada linha tem xmin (XID que criou) e xmax (XID que deletou). UPDATE não modifica in-place — cria nova versão com novo xmin e marca a antiga com xmax. Transações veem versões baseadas no snapshot delas. Dead tuples: versões com xmax de transações commitadas que nenhum snapshot ativo pode mais ver. VACUUM as limpa, liberando espaço.',
    tip: 'Explique o ciclo: UPDATE → nova tupla (xmin=novo XID) + tupla morta (xmax=antigo XID) → VACUUM limpa as mortas. Isso responde "por que autovacuum é crítico".',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre VACUUM e VACUUM FULL?',
    a: 'VACUUM: remove dead tuples, marca espaço como reutilizável na mesma página. Não retorna espaço ao SO. Não bloqueia leituras/escritas (lock leve). Deve rodar regularmente via autovacuum. VACUUM FULL: reescreve a tabela inteira em arquivo novo, retorna espaço ao SO. Exige lock exclusivo — bloqueia toda a tabela. Use só em emergências de bloat extremo.',
    tip: 'Mencione pg_repack como alternativa ao VACUUM FULL que desfragmenta sem lock exclusivo — mostra conhecimento de produção.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar GIN vs B-Tree para indexar JSONB?',
    a: 'B-Tree não funciona para buscas dentro de JSONB. Para queries como WHERE metadata @> \'{"status":"ativo"}\' (containment) ou WHERE metadata ? \'chave\' (existência), use GIN. B-Tree pode indexar um campo JSONB extraído como expressão: CREATE INDEX ON t((data->>\'campo\')) mas só resolve igualdade e range naquele campo específico.',
    tip: 'GIN é o correto para JSONB com múltiplas chaves pesquisadas. Explique o custo: GIN é mais lento para escrita mas ordens de magnitude mais rápido para busca em qualquer chave.',
  },
  {
    level: 'Senior',
    q: 'Como ler um EXPLAIN ANALYZE e identificar gargalos?',
    a: 'Procure nodes com actual time alto e rows estimadas muito diferentes das reais (row estimation error — indica estatísticas desatualizadas, rode ANALYZE). Buffers: hits = cache, reads = disco. Seq Scan em tabela grande com filtro seletivo = índice faltando. Hash Join com "Batches: 4" = hash spill para disco (aumente work_mem). Sort Method: "external merge" = spill para disco.',
    tip: 'Foque nos três sinais: (1) actual rows >> estimated rows, (2) Buffers read alto vs hits, (3) "external merge" ou "Batches > 1". Cite pg_explain_analyzer para análise assistida.',
  },
  {
    level: 'Senior',
    q: 'Explique os níveis de isolamento de transação e quando usar cada um.',
    a: 'READ COMMITTED (default): cada statement vê snapshot novo. Evita dirty reads, permite non-repeatable reads. REPEATABLE READ: snapshot fixo na primeira leitura — evita non-repeatable reads e phantoms (no Postgres). SERIALIZABLE: SSI — detecta e aborta ciclos de dependência. Use READ COMMITTED para OLTP normal, REPEATABLE READ para relatórios, SERIALIZABLE para invariantes críticos (ex: saldo bancário).',
    tip: 'Cite o exemplo clássico de write skew que só SERIALIZABLE previne: dois médicos lendo "alguém de plantão" e os dois saindo ao mesmo tempo.',
  },
  {
    level: 'Pleno',
    q: 'Por que o PostgreSQL não cria índice automático em colunas de FK?',
    a: 'Postgres cria índice automático apenas em PRIMARY KEY e UNIQUE. Colunas REFERENCES não recebem índice automático. O resultado: JOINs na FK fazem Seq Scan em tabelas sem índice manual. Toda coluna que participa de JOIN ou WHERE frequente deve ter CREATE INDEX explícito.',
    tip: 'Dê o exemplo concreto: posts.user_id com REFERENCES users(id) — sem CREATE INDEX ON posts(user_id) o SELECT com JOIN faz Seq Scan em posts para cada usuário.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o WAL e por que ele garante durabilidade?',
    a: 'WAL (Write-Ahead Log): toda modificação é primeiro registrada no WAL antes de alterar os data files. No COMMIT, o WAL buffer é flushed com fsync() para disco — só então o cliente recebe OK. Em caso de crash, recovery replaya o WAL desde o último checkpoint para reconstruir o estado consistente. O WAL é a base do "D" do ACID.',
    tip: 'Conecte WAL com replicação: a réplica consome o stream de WAL do primary. Isso explica por que streaming replication tem lag quase zero — é o mesmo mecanismo de durabilidade reaproveitado para HA.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Seq Scan, Index Scan e Index Only Scan?',
    a: 'Seq Scan: lê a tabela inteira página a página. Ótimo se retorna >10-20% das linhas. Index Scan: navega o índice para encontrar TIDs (ponteiros), depois vai à heap para cada TID. Index Only Scan: retorna dados direto do índice sem tocar a heap — requer que todas as colunas selecionadas estejam no índice (INCLUDE ou colunas indexadas) e visibility map atual.',
    tip: 'O Planner prefere Seq Scan quando selectividade é baixa (muitas linhas): custo de random I/O do Index Scan pode superar o leitura sequencial. Cite random_page_cost vs seq_page_cost.',
  },
  {
    level: 'Senior',
    q: 'Como implementar particionamento e quando ele vale a pena?',
    a: 'PARTITION BY RANGE/LIST/HASH. Range: tabelas de séries temporais (pedidos por mês). List: por region ou status. Hash: distribuição uniforme sem critério natural. Benefícios: partition pruning (planner exclui partições desnecessárias), VACUUM por partição, manutenção sem lock global. Vale quando tabela > centenas de milhões de linhas ou quando há padrões de acesso por faixa.',
    tip: 'Mencione a armadilha: FK para tabela particionada não pode referenciar partição específica. E que índices globais não existem — cada partição precisa de índice próprio.',
  },
  {
    level: 'Senior',
    q: 'Como o connection pooling resolve o problema de escala do Postgres?',
    a: 'Postgres é process-per-connection: cada conexão fork() um processo ~5-10MB. 500 conexões = 5GB só de processos. PgBouncer em transaction mode: mantém N conexões reais com o Postgres e multiplexa M clients. Conexão só é alocada durante a transação ativa. 1000 clients com transações de 5ms podem compartilhar 20 conexões reais.',
    tip: 'Diferencie session mode (compatível com SET/PREPARE/LISTEN mas menos eficiente) de transaction mode (mais eficiente mas não suporta session state como prepared statements nomeados).',
  },
  {
    level: 'Pleno',
    q: 'Como funcionam window functions e quando usá-las?',
    a: 'Window functions processam um conjunto de linhas relacionadas à linha atual (window/frame) sem colapsar em grupos como GROUP BY. OVER() define a janela: PARTITION BY (grupos), ORDER BY (ordenação), frame clause (ROWS/RANGE BETWEEN). Úteis para: ranking (ROW_NUMBER, RANK), running totals (SUM OVER), lag/lead, percentis.',
    tip: 'Explique a diferença de GROUP BY: window function preserva cada linha individual e adiciona a função calculada como coluna extra. GROUP BY colapsa linhas em grupos.',
  },
  {
    level: 'Pleno',
    q: 'O que são CTEs e quando preferir CTE vs subquery?',
    a: 'CTE (WITH clause): define query temporária nomeada reutilizável dentro do statement. Antes do Postgres 12, CTEs eram "optimization fences" — o planner não podia otimizá-las junto com a query principal. Desde o PG12, CTEs são inline por padrão (MATERIALIZED e NOT MATERIALIZED controlam explicitamente). CTEs recursivas (WITH RECURSIVE) são essenciais para hierarquias.',
    tip: 'A pegadinha: CTEs em PG11 e anteriores são barreiras de otimização — o planner não empurra predicados para dentro. Em PG12+ isso mudou. Vale mencionar em entrevista para mostrar que você conhece a evolução.',
  },
  {
    level: 'Senior',
    q: 'Como usar JSONB de forma eficiente no PostgreSQL?',
    a: 'JSONB: armazenado em formato binário decomposto, suporta GIN index para busca em qualquer chave. Operadores: -> (json), ->> (text), @> (containment), ? (key exists), #> (path). Para colunas frequentemente buscadas: extraia como generated column com índice B-Tree. GIN index para buscas multi-chave. Cuidado: JSONB não tem estatísticas por chave — o planner subestima seletividade.',
    tip: 'Mostre que você conhece generated columns: ALTER TABLE t ADD COLUMN status text GENERATED ALWAYS AS (data->>\'status\') STORED; CREATE INDEX ON t(status); — combina flexibilidade JSONB com performance de coluna tipada.',
  },
  {
    level: 'Senior',
    q: 'Como identificar e resolver problemas de locking e deadlock?',
    a: 'Monitorar: SELECT * FROM pg_locks l JOIN pg_stat_activity a ON a.pid = l.pid. Deadlock: dois processos esperam um pelo outro — Postgres detecta automaticamente e aborta o mais jovem. Prevenção: sempre adquira locks na mesma ordem. Lock timeout: SET lock_timeout = \'5s\'. Idle in transaction: mata conexões com state = \'idle in transaction\' via pg_terminate_backend.',
    tip: 'Explique o deadlock clássico: transação A faz UPDATE users id=1 then UPDATE accounts id=1; transação B faz UPDATE accounts id=1 then UPDATE users id=1. Sempre mesmo ordem de tabelas previne.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre TRUNCATE e DELETE?',
    a: 'DELETE: remove linha a linha, dispara triggers, pode ter WHERE, é registrado no WAL linha a linha. TRUNCATE: remove todas as linhas de uma vez, não dispara row-level triggers (somente TRUNCATE triggers), não gera WAL por linha (gera um único registro). TRUNCATE é drasticamente mais rápido para tabelas grandes. TRUNCATE não pode ter WHERE — é tudo ou nada.',
    tip: 'Mencione que TRUNCATE é transacional no Postgres (diferente de outros bancos). E que TRUNCATE RESTART IDENTITY reseta sequências — útil em testes.',
  },
  {
    level: 'Senior',
    q: 'O que é autovacuum e como ajustá-lo para tabelas de alta escrita?',
    a: 'Autovacuum roda VACUUM/ANALYZE quando dead tuple ratio ou row change ratio excedem thresholds. Configuração por tabela (storage parameters): autovacuum_vacuum_scale_factor (default 0.2 = 20% da tabela), autovacuum_vacuum_threshold (default 50 linhas). Para tabelas grandes de alta escrita: reduzir scale_factor (ex: 0.01) para rodar mais cedo e frequentemente.',
    tip: 'Cite o exemplo: ALTER TABLE pedidos SET (autovacuum_vacuum_scale_factor = 0.01); — em tabela de 10M linhas, 0.2 = 2M dead tuples antes de rodar vs 0.01 = 100K. A diferença de bloat pode ser enorme.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona UPSERT com INSERT ... ON CONFLICT?',
    a: 'INSERT ... ON CONFLICT DO UPDATE/DO NOTHING. Identifica conflito pela constraint (ON CONFLICT (coluna) ou ON CONFLICT ON CONSTRAINT nome). DO NOTHING ignora silenciosamente. DO UPDATE permite atualizar campos — EXCLUDED referencia os valores que seriam inseridos. Atômico: sem race condition entre SELECT + INSERT.',
    tip: 'Mostre o padrão de contador atômico: ON CONFLICT (id) DO UPDATE SET views = tabela.views + EXCLUDED.views — incrementa sem race condition. Isso diferencia de aplicar lógica na aplicação.',
  },
  {
    level: 'Senior',
    q: 'Explique BRIN index e quando ele supera B-Tree.',
    a: 'BRIN (Block Range Index): armazena min/max por bloco físico (grupo de páginas). Tamanho minúsculo (KBs vs MBs do B-Tree). Só eficiente se os dados têm correlação física com o valor: timestamps em tabela append-only têm correlação ~1.0. Acesso por range faz exclusão de blocos onde max < threshold. Para tabela de logs de 1TB com timestamp BRIN pode ser melhor que B-Tree por espaço e manutenção.',
    tip: 'A condição crítica: verificar pg_stats.correlation na coluna. Correlação próxima de 1.0 ou -1.0 = BRIN é candidato. Próxima de 0 = BRIN inútil, use B-Tree.',
  },
  {
    level: 'Senior',
    q: 'Como pgvector e extensões transformam o Postgres?',
    a: 'Extensões são cidadãos de primeira classe: CREATE EXTENSION instala novos tipos, funções, operadores e métodos de índice. pgvector: tipo vector, índice IVFFLAT/HNSW para busca por similaridade cosine/L2/inner product. PostGIS: tipos geography/geometry, funções ST_DWithin, ST_Intersects, índice GiST. TimescaleDB: hypertables com particionamento automático por tempo, compressão, funções de série temporal.',
    tip: 'Posicione: o Postgres com extensões atua como plataforma de dados multimodal — relacional + vetorial + geoespacial + temporal no mesmo sistema, eliminando a necessidade de bancos especializados para cada caso.',
  },
  {
    level: 'Pleno',
    q: 'Como monitorar a saúde do PostgreSQL em produção?',
    a: 'Métricas essenciais: pg_stat_user_tables (n_dead_tup, last_autovacuum), pg_stat_activity (conexões ativas/idle/idle in transaction), pg_stat_bgwriter (buffers_clean, buffers_checkpoint), pg_stat_user_indexes (idx_scan — índices não usados), pg_statio_user_tables (heap_blks_hit vs read — cache hit ratio), pg_locks (waits). Ferramentas: pg_stat_statements para queries mais custosas.',
    tip: 'Cache hit ratio = heap_blks_hit / (heap_blks_hit + heap_blks_read). Deve ser > 99% para OLTP. Abaixo disso: shared_buffers pequeno ou queries sem índice fazendo muito I/O.',
  },
]

// ── Cheatsheet ────────────────────────────────────────────────────────────────

const CS_HOOKS: HookItem[] = [
  { name: 'B-Tree',   sig: 'CREATE INDEX ON t(col)',              desc: 'Padrão — igualdade, range, ORDER BY' },
  { name: 'GIN',      sig: 'CREATE INDEX ON t USING gin(jsonb_col)', desc: 'JSONB, arrays, full-text search' },
  { name: 'GiST',     sig: 'CREATE INDEX ON t USING gist(geom)', desc: 'Geometria, range types (PostGIS)' },
  { name: 'BRIN',     sig: 'CREATE INDEX ON t USING brin(ts)',   desc: 'Tabela append-only com alta correlação' },
  { name: 'Parcial',  sig: 'CREATE INDEX ON t(col) WHERE cond',  desc: 'Subconjunto seletivo da tabela' },
  { name: 'INCLUDE',  sig: 'CREATE INDEX ON t(col) INCLUDE(c2)', desc: 'Index Only Scan sem ir à heap' },
  { name: 'EXPLAIN',  sig: 'EXPLAIN (ANALYZE, BUFFERS) sql',     desc: 'Ver plano de execução com tempos reais' },
  { name: 'VACUUM',   sig: 'VACUUM (ANALYZE) tabela',            desc: 'Limpar dead tuples + atualizar stats' },
  { name: 'UPSERT',   sig: 'INSERT ... ON CONFLICT DO UPDATE',   desc: 'Insert ou update atômico' },
  { name: 'Window',   sig: 'fn() OVER (PARTITION BY x ORDER BY y)', desc: 'Cálculos por grupo sem colapsar linhas' },
  { name: 'CTE',      sig: 'WITH nome AS (SELECT ...) SELECT ...',  desc: 'Query temporária nomeada reutilizável' },
  { name: 'JSONB ->', sig: "col->'key' / col->>'key'",           desc: 'Acessar campo JSONB como json/text' },
  { name: 'JSONB @>', sig: "col @> '{\"k\":\"v\"}'",             desc: 'Containment — JSONB tem todos estes pares' },
]

const CS_RULES: RuleItem[] = [
  { ok: false, t: 'FK nunca cria índice automático — sempre CREATE INDEX manual na coluna REFERENCES' },
  { ok: true,  t: 'VACUUM não retorna espaço ao SO — VACUUM FULL sim, mas exige lock exclusivo' },
  { ok: false, t: 'autovacuum_vacuum_scale_factor padrão 0.2 é alto para tabelas grandes — reduza para 0.01' },
  { ok: false, t: 'work_mem é por operação de Sort/Hash — com 50 backends = 50x mais memória' },
  { ok: true,  t: 'PgBouncer transaction mode é o mais eficiente mas não suporta SET session state' },
  { ok: false, t: 'NOT IN com NULL sempre retorna vazio — use NOT EXISTS ou IS DISTINCT FROM' },
  { ok: false, t: "LIKE '%padrão%' não usa B-Tree — use pg_trgm + GIN para LIKE bilateral" },
  { ok: true,  t: 'shared_buffers recomendado: 25% da RAM (não mais — SO gerencia o resto)' },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'MVCC = "Múltiplas Versões, Coleta de Cadáveres"',
    trick: 'MV = Múltiplas Versões, CC = Coleta de Cadáveres (dead tuples)',
    expansion: [['MV', 'Múltiplas Versões por linha'], ['CC', 'Coleta de Cadáveres = VACUUM'], ['xmin/xmax', 'Metadados de visibilidade em cada tupla']],
    explanation: 'MVCC mantém múltiplas versões de cada linha para transações concorrentes. O preço é dead tuples (versões antigas) que o VACUUM precisa coletar. Sem vacuum, a tabela incha indefinidamente.',
    example: 'UPDATE posts SET title=\'X\' WHERE id=1: cria nova tupla (xmin=novo XID) + marca antiga com xmax — dead tuple',
    why: 'MVCC é a base do "C" e "I" do ACID no PostgreSQL. Entender dead tuples explica por que autovacuum é crítico.',
  },
  {
    label: 'GIN = "Generalized INverted" para coleções',
    trick: 'GIN = "Generalized INverted" → índice INvertido para INternos (arrays, JSONB)',
    expansion: [['G', 'Generalized — funciona com qualquer tipo coleção'], ['IN', 'INverted — mapeia elemento → linhas que o contêm']],
    explanation: 'GIN mapeia cada elemento individual para as linhas que o contêm — como um índice invertido de texto. Ideal para arrays, JSONB, tsvector. B-Tree não funciona para buscas dentro dessas estruturas.',
    example: 'WHERE metadata @> \'{"status":"ativo"}\' usa GIN; WHERE id = 1 usa B-Tree',
    why: 'GIN é mais lento para escrita mas ordens de magnitude mais rápido para busca em qualquer chave de JSONB.',
  },
  {
    label: 'WAL = "Escreve Antes dos Dados" (Write-Ahead Log)',
    trick: 'WAL = W-rite A-head L-og → Escreva (no log) ANTES (de modificar dados)',
    expansion: [['W', 'Write — escreve no log'], ['A', 'Ahead — ANTES de modificar os data files'], ['L', 'Log — registro sequencial em disco']],
    explanation: 'A regra do WAL: o registro de intenção sempre chega ao disco antes dos dados. Se o servidor cair, o recovery replaya o WAL para reconstruir o estado. Isso é o D (Durability) do ACID.',
    example: 'Crash após COMMIT: recovery replaya WAL desde o último checkpoint — dados não se perdem',
    why: 'WAL também é a base da replicação streaming: a réplica consome o mesmo stream de WAL do primary.',
  },
  {
    label: 'BRIN funciona quando "blocos estão em ordem"',
    trick: 'BRIN = "Block Range INdex" → só funciona se os BloRINcos estão ordenados pelo valor',
    expansion: [['B', 'Block Range — armazena min/max por bloco físico'], ['IN', 'INdex leve — KBs vs MBs do B-Tree']],
    explanation: 'BRIN armazena min/max por bloco físico. Para ser eficiente, os valores precisam estar fisicamente ordenados (correlação alta). Timestamp em tabela append-only: perfeito. ID aleatório: inútil.',
    example: 'SELECT * FROM logs WHERE ts BETWEEN \'2024-01-01\' AND \'2024-01-31\': BRIN exclui blocos onde max < início do range',
    why: 'Sempre verifique pg_stats.correlation antes de criar BRIN. Correlação próxima de 1.0 = candidato ideal.',
  },
  {
    label: 'Hash Join = "Hash da menor tabela"',
    trick: 'Hash Join: Hasha a menor tabela (inner), depois varre a maior (outer)',
    expansion: [['Inner', 'Tabela menor → hash table em work_mem'], ['Outer', 'Tabela maior → probe na hash table'], ['Batches > 1', 'Hash spill para disco — aumente work_mem']],
    explanation: 'O Planner sempre constrói a hash table com a tabela menor (inner relation) e faz probe com a maior. Se a hash table cabe em work_mem = sem spill. Se não cabe = "Batches > 1" no EXPLAIN = I/O em disco.',
    example: 'EXPLAIN mostra "Batches: 4" → hash spill → aumentar work_mem para \'64MB\' resolve',
    why: '"Batches > 1" no EXPLAIN é sinal de work_mem insuficiente — identificar isso é habilidade de DBA sênior.',
  },
]

// ── Anti-patterns ─────────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'N+1 queries — loop com SELECT por linha',
    badDesc: 'SELECT individual por linha em loop: 1000 posts = 1001 queries e ~1s de latência extra.',
    goodDesc: 'JOIN único traz todos os dados numa query: ~5ms total independente do volume.',
    why: '1000 posts + resolver author individualmente = 1001 queries. Cada round-trip ao banco custa ~1ms. 1001ms de latência vs ~5ms com JOIN. Use JOIN ou carregamento em lote.',
    badCode: [
      { t: 'const posts = await db.query(', c: '#e2e8f0' },
      { t: "'SELECT * FROM posts'", c: '#ef4444' },
      { t: ')\nfor (const p of posts) {', c: '#e2e8f0' },
      { t: '\n  p.author = await db.query(', c: '#ef4444' },
      { t: "\n    'SELECT * FROM users WHERE id=$1',", c: '#ef4444' },
      { t: '\n    [p.user_id])\n}', c: '#e2e8f0' },
    ],
    goodCode: [
      { t: 'SELECT p.*, u.name\n  FROM posts p', c: '#4ade80' },
      { t: '\n  JOIN users u', c: '#4ade80' },
      { t: '\n    ON u.id = p.user_id', c: '#4ade80' },
      { t: '\n-- 1 query, resultado completo', c: '#64748b' },
    ],
  },
  {
    title: 'NOT IN com NULL — resultado sempre vazio',
    badDesc: 'NOT IN com subquery que pode retornar NULL: condição inteira vira NULL — zero resultados.',
    goodDesc: 'NOT EXISTS lida corretamente com NULL e usa índice quando disponível.',
    why: 'NOT IN usa NOT EQUAL para cada elemento. Se qualquer elemento for NULL, NULL <> x é NULL (não FALSE), portanto a condição inteira retorna NULL/vazio. Uma subquery que retorna NULLs anula o NOT IN inteiro.',
    badCode: [
      { t: '-- deleted_ids pode conter NULL:', c: '#64748b' },
      { t: '\nSELECT * FROM users', c: '#e2e8f0' },
      { t: '\n WHERE id NOT IN (', c: '#ef4444' },
      { t: '\n   SELECT user_id FROM bans', c: '#ef4444' },
      { t: '\n -- user_id pode ser NULL!', c: '#64748b' },
      { t: '\n)', c: '#ef4444' },
    ],
    goodCode: [
      { t: 'SELECT * FROM users u', c: '#4ade80' },
      { t: '\n WHERE NOT EXISTS (', c: '#4ade80' },
      { t: '\n   SELECT 1 FROM bans b', c: '#4ade80' },
      { t: '\n   WHERE b.user_id = u.id', c: '#4ade80' },
      { t: '\n -- EXISTS lida corretamente com NULL', c: '#64748b' },
      { t: '\n)', c: '#4ade80' },
    ],
  },
  {
    title: "LIKE '%texto%' sem pg_trgm — Seq Scan garantido",
    badDesc: "LIKE '%abc%' bilateral não usa B-Tree — Seq Scan mesmo com índice na coluna.",
    goodDesc: 'pg_trgm + GIN index: LIKE bilateral usa índice, evitando Seq Scan em tabelas grandes.',
    why: "Prefixo LIKE 'abc%' usa B-Tree. LIKE '%abc%' (bilateral) não usa nenhum índice padrão. Para full-text search ou LIKE bilateral em strings grandes, use pg_trgm + GIN index.",
    badCode: [
      { t: '-- LIKE bilateral: Seq Scan sempre', c: '#64748b' },
      { t: '\nSELECT * FROM produtos', c: '#e2e8f0' },
      { t: "\n WHERE nome LIKE '%cami%'", c: '#ef4444' },
      { t: '\n-- índice B-Tree em nome = inútil aqui', c: '#64748b' },
    ],
    goodCode: [
      { t: 'CREATE EXTENSION pg_trgm;', c: '#4ade80' },
      { t: '\nCREATE INDEX ON produtos', c: '#4ade80' },
      { t: '\n  USING gin(nome gin_trgm_ops);', c: '#4ade80' },
      { t: '\n-- Agora LIKE bilateral usa o índice:', c: '#64748b' },
      { t: "\nSELECT * FROM produtos WHERE nome LIKE '%cami%'", c: '#4ade80' },
    ],
  },
  {
    title: 'Transação longa com lock — idle in transaction',
    badDesc: 'BEGIN antes de processamento lento: lock segurado por minutos, bloqueia VACUUM e DDL.',
    goodDesc: 'Processar fora da transação; abrir transação curta apenas para o write final.',
    why: 'Uma transação aberta (idle in transaction) segura locks em tabelas inteiras por minutos ou horas. Isso bloqueia VACUUM, DDL e queries concorrentes. Defina statement_timeout e idle_in_transaction_session_timeout.',
    badCode: [
      { t: '// Transação aberta, processamento lento:', c: '#64748b' },
      { t: '\nawait db.query(', c: '#e2e8f0' },
      { t: "'BEGIN'", c: '#ef4444' },
      { t: ')\nawait processar_arquivo_grande()', c: '#e2e8f0' },
      { t: '\n// ...10 minutos depois...', c: '#64748b' },
      { t: "\nawait db.query('COMMIT')", c: '#ef4444' },
    ],
    goodCode: [
      { t: '-- Limite de tempo por transação:', c: '#64748b' },
      { t: '\nSET idle_in_transaction_session_timeout', c: '#4ade80' },
      { t: "\n  = '30s';", c: '#4ade80' },
      { t: '\n-- Processar fora da transação,', c: '#64748b' },
      { t: '\n-- depois iniciar transação curta', c: '#64748b' },
      { t: '\n-- apenas para o INSERT/UPDATE final', c: '#64748b' },
    ],
  },
]

// ── Mind Map ──────────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'MVCC & Storage',
    color: C,
    items: [
      { t: 'xmin / xmax', k: true },
      { t: 'dead tuples', k: true },
      { t: 'VACUUM', k: true },
      { t: 'VACUUM FULL', a: true },
      { t: 'autovacuum', k: true },
      { t: 'bloat', a: true },
      { t: 'pg_repack', a: true },
      { t: 'TOAST', a: true },
    ],
  },
  {
    label: 'Índices',
    color: '#5b9bd5',
    items: [
      { t: 'B-Tree', k: true },
      { t: 'GIN', k: true },
      { t: 'GiST', k: true },
      { t: 'BRIN', a: true },
      { t: 'Hash', a: true },
      { t: 'Parcial', k: true },
      { t: 'INCLUDE', a: true },
      { t: 'Expressão', a: true },
    ],
  },
  {
    label: 'Query Planner',
    color: '#a78bfa',
    items: [
      { t: 'EXPLAIN ANALYZE', k: true },
      { t: 'Seq Scan', k: true },
      { t: 'Index Scan', k: true },
      { t: 'Index Only Scan', a: true },
      { t: 'Nested Loop', k: true },
      { t: 'Hash Join', k: true },
      { t: 'Merge Join', a: true },
      { t: 'pg_stats', a: true },
    ],
  },
  {
    label: 'Transações',
    color: '#f59e0b',
    items: [
      { t: 'ACID', k: true },
      { t: 'READ COMMITTED', k: true },
      { t: 'REPEATABLE READ', k: true },
      { t: 'SERIALIZABLE (SSI)', a: true },
      { t: 'deadlock', k: true },
      { t: 'lock timeout', k: true },
      { t: 'SAVEPOINT', a: true },
    ],
  },
  {
    label: 'WAL & Replicação',
    color: '#4ade80',
    items: [
      { t: 'WAL (Write-Ahead Log)', k: true },
      { t: 'LSN', a: true },
      { t: 'checkpoint', k: true },
      { t: 'streaming replication', k: true },
      { t: 'hot standby', k: true },
      { t: 'logical replication', a: true },
      { t: 'replication slot', a: true },
    ],
  },
  {
    label: 'Tipos Avançados',
    color: '#fb923c',
    items: [
      { t: 'JSONB', k: true },
      { t: 'arrays', k: true },
      { t: 'range types', a: true },
      { t: 'enums', k: true },
      { t: 'UUID', k: true },
      { t: 'TIMESTAMPTZ', k: true },
      { t: 'tsvector', a: true },
    ],
  },
  {
    label: 'Performance',
    color: '#ef4444',
    items: [
      { t: 'shared_buffers', k: true },
      { t: 'work_mem', k: true },
      { t: 'connection pool', k: true },
      { t: 'PgBouncer', k: true },
      { t: 'pg_stat_statements', a: true },
      { t: 'CLUSTER', a: true },
      { t: 'particionamento', a: true },
    ],
  },
  {
    label: 'SQL Avançado',
    color: '#38bdf8',
    items: [
      { t: 'Window Functions', k: true },
      { t: 'CTEs (WITH)', k: true },
      { t: 'WITH RECURSIVE', a: true },
      { t: 'UPSERT', k: true },
      { t: 'LATERAL JOIN', a: true },
      { t: 'FILTER clause', a: true },
      { t: 'DISTINCT ON', a: true },
    ],
  },
  {
    label: 'Extensões',
    color: '#c084fc',
    items: [
      { t: 'pgvector', a: true },
      { t: 'PostGIS', a: true },
      { t: 'pg_trgm', k: true },
      { t: 'TimescaleDB', a: true },
      { t: 'pg_stat_statements', k: true },
      { t: 'pg_partman', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Explico MVCC, dead tuples e por que VACUUM é crítico',
  'Sei escolher o tipo de índice certo (B-Tree, GIN, GiST, BRIN)',
  'Leio EXPLAIN ANALYZE e identifico gargalos (estimativa errada, spill, I/O)',
  'Conheço os 4 níveis de isolamento e o que cada um previne',
  'Entendo WAL e por que ele garante durabilidade',
  'Sei configurar e justificar connection pooling com PgBouncer',
  'Uso JSONB com GIN index e conheço os operadores (@>, ?, ->>)',
  'Escrevo window functions e CTEs corretamente',
  'Sei criar índices parciais, INCLUDE e expressão',
  'Conheço as views de monitoramento: pg_stat_user_tables, pg_stat_activity',
]

// ── Quick Ref (psql CLI) ──────────────────────────────────────────────────────

const QUICK_REF_COLS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Conexão',
        entries: [
          { key: 'psql -h host -p 5432 -U user -d db', value: 'Conectar' },
          { key: '\\c dbname', value: 'Trocar banco' },
          { key: '\\conninfo', value: 'Info da conexão atual' },
          { key: '\\q', value: 'Sair' },
          { key: 'PGPASSWORD=x psql ...', value: 'Senha via env' },
        ],
      },
      {
        title: 'Exploração',
        entries: [
          { key: '\\l', value: 'Listar bancos' },
          { key: '\\dt', value: 'Listar tabelas' },
          { key: '\\dt+', value: 'Tabelas com tamanho' },
          { key: '\\d tabela', value: 'Estrutura da tabela' },
          { key: '\\di', value: 'Listar índices' },
          { key: '\\dv', value: 'Listar views' },
          { key: '\\df', value: 'Listar funções' },
          { key: '\\dn', value: 'Listar schemas' },
          { key: '\\dx', value: 'Listar extensões' },
        ],
      },
      {
        title: 'Output',
        entries: [
          { key: '\\x', value: 'Toggle expanded output' },
          { key: '\\timing', value: 'Mostrar tempo de query' },
          { key: '\\o file.txt', value: 'Redirecionar output' },
          { key: '\\i file.sql', value: 'Executar arquivo' },
          { key: '\\e', value: 'Abrir editor externo' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Diagnóstico — conexões',
        entries: [
          { key: "SELECT pid, state, query FROM pg_stat_activity WHERE state != 'idle'", value: 'Queries ativas' },
          { key: "SELECT count(*) FROM pg_stat_activity GROUP BY state", value: 'Contagem por estado' },
          { key: "SELECT pg_terminate_backend(pid) WHERE state='idle in transaction'", value: 'Matar idle in txn', badge: '⚠ cuidado' },
        ],
      },
      {
        title: 'Diagnóstico — locks',
        entries: [
          { key: 'SELECT * FROM pg_locks WHERE NOT granted', value: 'Locks esperando' },
          { key: 'SELECT relation::regclass, mode, granted FROM pg_locks', value: 'Todos os locks' },
          { key: 'SELECT deadlocks FROM pg_stat_database', value: 'Contagem de deadlocks' },
        ],
      },
      {
        title: 'Diagnóstico — vacuuming',
        entries: [
          { key: 'SELECT relname, n_dead_tup, last_autovacuum FROM pg_stat_user_tables ORDER BY n_dead_tup DESC', value: 'Tabelas com mais dead tuples' },
          { key: 'SELECT heap_blks_hit, heap_blks_read FROM pg_statio_user_tables', value: 'Cache hit ratio por tabela' },
          { key: 'VACUUM (ANALYZE, VERBOSE) tabela', value: 'Vacuum manual verbose' },
        ],
      },
      {
        title: 'Diagnóstico — índices',
        entries: [
          { key: 'SELECT indexrelname, idx_scan FROM pg_stat_user_indexes WHERE idx_scan = 0', value: 'Índices nunca usados' },
          { key: "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(relid)) FROM pg_stat_user_tables ORDER BY pg_total_relation_size(relid) DESC LIMIT 10", value: 'Maiores tabelas' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'EXPLAIN',
        entries: [
          { key: 'EXPLAIN SELECT ...', value: 'Plano estimado' },
          { key: 'EXPLAIN ANALYZE SELECT ...', value: 'Plano + execução real' },
          { key: 'EXPLAIN (ANALYZE, BUFFERS) ...', value: 'Com I/O de buffers' },
          { key: 'EXPLAIN (FORMAT JSON) ...', value: 'Saída JSON (para ferramentas)' },
        ],
      },
      {
        title: 'Manutenção',
        entries: [
          { key: 'VACUUM tabela', value: 'Limpar dead tuples' },
          { key: 'VACUUM ANALYZE tabela', value: 'Vacuum + atualizar stats' },
          { key: 'VACUUM FULL tabela', value: 'Reescrever tabela', badge: '⚠ lock exclusivo' },
          { key: 'ANALYZE tabela', value: 'Atualizar estatísticas do planner' },
          { key: 'REINDEX TABLE tabela', value: 'Reconstruir índices', badge: '⚠ lock' },
          { key: 'CLUSTER tabela USING idx', value: 'Reordenar heap por índice', badge: '⚠ lock' },
        ],
      },
      {
        title: 'pg_stat_statements',
        entries: [
          { key: "SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10", value: 'Top queries lentas' },
          { key: "SELECT query, total_exec_time FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10", value: 'Top queries por tempo total' },
          { key: 'SELECT pg_stat_statements_reset()', value: 'Resetar estatísticas' },
        ],
      },
    ],
  },
]

// ── Errors Ref ────────────────────────────────────────────────────────────────

const ERRORS: ErrorEntry[] = [
  {
    title: 'deadlock detected',
    errorMessage: 'ERROR: deadlock detected\nDETAIL: Process 1234 waits for ShareLock on transaction 5678',
    cause: 'Duas ou mais transações aguardam locks uma da outra em ordem circular: T1 segura A aguarda B, T2 segura B aguarda A.',
    solution: 'Postgres aborta automaticamente a transação mais jovem. Prevenção: sempre adquira locks na mesma ordem entre transações. Use lock timeout para abortar antes de deadlock.',
    severity: 'critical',
    category: 'Locking',
    code: {
      broken: "-- T1: UPDATE users id=1, UPDATE accounts id=1\n-- T2: UPDATE accounts id=1, UPDATE users id=1\n-- → deadlock garantido",
      fixed:  "-- Sempre a mesma ordem:\n-- T1 e T2: UPDATE users first, THEN accounts\n-- Ou: SET lock_timeout = '5s'",
    },
  },
  {
    title: 'could not serialize access due to concurrent update',
    errorMessage: 'ERROR: could not serialize access due to concurrent update',
    cause: 'Transação SERIALIZABLE ou REPEATABLE READ detectou que outra transação modificou dados que esta leu. O ciclo de dependência tornaria a execução não-serial.',
    solution: 'Retry na aplicação com exponential backoff. É o comportamento esperado em SERIALIZABLE — a transação deve ser repetida do início.',
    severity: 'warning',
    category: 'Isolamento',
    code: {
      broken: "-- Sem retry:\nawait db.transaction(async t => {\n  const saldo = await t.query('SELECT ...')\n  await t.query('UPDATE ...')\n  // pode falhar com serialization failure\n})",
      fixed:  "async function comRetry(fn, tentativas = 3) {\n  for (let i = 0; i < tentativas; i++) {\n    try { return await fn() }\n    catch (e) {\n      if (e.code === '40001') continue // serialization_failure\n      throw e\n    }\n  }\n}",
    },
  },
  {
    title: 'sorry, too many clients already',
    errorMessage: 'FATAL: sorry, too many clients already',
    cause: 'Número de conexões atingiu max_connections (padrão 100). Cada nova tentativa é rejeitada.',
    solution: 'Use connection pooling (PgBouncer em transaction mode). Aumente max_connections com cuidado (cada conexão usa ~5-10MB). Verifique conexões idle in transaction.',
    severity: 'critical',
    category: 'Conexões',
    code: {
      broken: "-- Sem pool: cada request abre conexão\nnew Client(config).connect()\n// max_connections=100 → 101ª falha",
      fixed:  "-- PgBouncer: 1000 clients → 20 conexões Postgres\n-- pool_mode = transaction\n-- max_client_conn = 1000\n-- default_pool_size = 20",
    },
  },
  {
    title: 'lock timeout',
    errorMessage: 'ERROR: canceling statement due to lock timeout',
    cause: 'Uma query aguardou um lock por mais tempo que lock_timeout. Ocorre quando outra transação segura lock na tabela/linha.',
    solution: 'Verifique quem segura o lock: pg_locks JOIN pg_stat_activity. Mate conexões idle in transaction. Reduza tempo de transações longas.',
    severity: 'warning',
    category: 'Locking',
    code: {
      broken: "-- Sem timeout: espera indefinida\nALTER TABLE orders ADD COLUMN x int;\n-- Bloqueia se houver transação aberta",
      fixed:  "-- Timeout de segurança:\nSET lock_timeout = '5s';\nALTER TABLE orders ADD COLUMN x int;\n-- Falha rápida em vez de bloquear",
    },
  },
  {
    title: 'value too long for type character varying(N)',
    errorMessage: "ERROR: value too long for type character varying(255)",
    cause: 'Tentativa de inserir string maior que o comprimento definido na coluna VARCHAR(N).',
    solution: 'Use TEXT (sem limite) no PostgreSQL — é equivalente internamente a VARCHAR sem limite. Se precisar de limite, aumente N ou trunque antes.',
    severity: 'info',
    category: 'Tipos',
    code: {
      broken: "-- VARCHAR(255) muito restritivo:\nCREATE TABLE t (descricao VARCHAR(255));\nINSERT INTO t VALUES (repeat('x', 300)); -- ERRO",
      fixed:  "-- TEXT sem limite (recomendado no Postgres):\nCREATE TABLE t (descricao TEXT);\n-- Adicionar constraint se necessário:\nADD CONSTRAINT descricao_len CHECK (length(descricao) <= 500)",
    },
  },
  {
    title: 'duplicate key value violates unique constraint',
    errorMessage: 'ERROR: duplicate key value violates unique constraint "users_email_key"\nDETAIL: Key (email)=(foo@bar.com) already exists.',
    cause: 'Tentativa de inserir/atualizar registro com valor que viola constraint UNIQUE ou PRIMARY KEY.',
    solution: 'Use INSERT ... ON CONFLICT DO NOTHING/DO UPDATE para tratar na query. Ou capturar erro com código 23505 na aplicação.',
    severity: 'warning',
    category: 'Constraints',
    code: {
      broken: "INSERT INTO users (email) VALUES ('foo@bar.com');\n-- Falha se email já existe",
      fixed:  "INSERT INTO users (email) VALUES ('foo@bar.com')\nON CONFLICT (email) DO NOTHING;\n-- Ou atualizar:\nON CONFLICT (email) DO UPDATE\n  SET updated_at = now();",
    },
  },
  {
    title: 'foreign key violation',
    errorMessage: 'ERROR: insert or update on table "posts" violates foreign key constraint "posts_user_id_fkey"\nDETAIL: Key (user_id)=(999) is not present in table "users".',
    cause: 'Tentativa de inserir/atualizar FK com valor que não existe na tabela referenciada, ou deletar do pai quando filho ainda existe.',
    solution: 'Verifique que o registro pai existe antes de inserir filho. Defina ON DELETE CASCADE/RESTRICT/SET NULL conforme a regra de negócio.',
    severity: 'warning',
    category: 'Constraints',
    code: {
      broken: "INSERT INTO posts (user_id, title)\nVALUES (999, 'Test');\n-- user_id 999 não existe",
      fixed:  "-- Verifique antes ou use ON DELETE CASCADE:\nCREATE TABLE posts (\n  user_id BIGINT REFERENCES users(id)\n    ON DELETE CASCADE\n);",
    },
  },
  {
    title: 'connection refused / could not connect to server',
    errorMessage: 'could not connect to server: Connection refused\nIs the server running on host "localhost" and accepting TCP/IP connections on port 5432?',
    cause: 'PostgreSQL não está rodando, ou está escutando em socket Unix mas não TCP, ou pg_hba.conf bloqueia a conexão.',
    solution: 'Verifique pg_ctl status. Confira listen_addresses no postgresql.conf (pode ser localhost apenas). Confira pg_hba.conf para a regra de autenticação.',
    severity: 'critical',
    category: 'Conexões',
    code: {
      broken: "# Erro comum: Postgres escuta só em socket\n# pg_hba.conf: host all all 0.0.0.0/0 reject",
      fixed:  "# postgresql.conf:\nlisten_addresses = 'localhost'\n# pg_hba.conf:\nhost all all 127.0.0.1/32 scram-sha-256\n# Verificar: pg_ctl status -D /var/lib/postgres",
    },
  },
]

// ── Componente principal ──────────────────────────────────────────────────────

export default function PostgresqlPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)

  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
    qa: () => buildQAReviewPdf({
      qa: QAS,
      accentColor: C,
      skillName: 'PostgreSQL',
      stackLabel: 'Database',
    }),
    cheatsheet: () => buildCheatsheetPdf({
      skillName: 'PostgreSQL',
      accentColor: C,
      stackLabel: 'Database',
      sections: {
        hooks: CS_HOOKS,
        rules: CS_RULES,
        depRows: [],
        performanceTips: [
          'Rode EXPLAIN ANALYZE antes de otimizar — nunca otimize às cegas',
          'Índice na coluna FK é responsabilidade do desenvolvedor (não automático)',
          'shared_buffers = 25% da RAM; work_mem cuidado — é por operação',
          'autovacuum_vacuum_scale_factor = 0.01 para tabelas de alta escrita',
          'PgBouncer transaction mode: 1000 clients → 20 conexões reais',
          'pg_stat_statements é obrigatório em produção para rastrear slow queries',
        ],
        patterns: [],
        mentalModels: [
          'WAL garante durabilidade: escreve o log ANTES dos dados',
          'MVCC: nunca deleta in-place, cria versões — VACUUM coleta os mortos',
          'Planner usa estatísticas de ANALYZE: ANALYZE frequente = planos melhores',
          'Hash Join = hash da menor tabela + probe da maior — spill se não cabe em work_mem',
        ],
      },
    }),
    mnemonics: () => buildMnemonicsPdf({
      mnemonics: MNEMONICS,
      accentColor: C,
      skillName: 'PostgreSQL',
      stackLabel: 'Database',
    }),
    antipatterns: () => buildAntipatternsPdf({
      antipatterns: ANTIPATTERNS,
      accentColor: C,
      skillName: 'PostgreSQL',
      stackLabel: 'Database',
    }),
    mindmap: () => buildMindmapPdf({
      categories: MINDMAP_CATEGORIES,
      checklist: MINDMAP_CHECKLIST,
      accentColor: C,
      skillName: 'PostgreSQL',
      stackLabel: 'Database',
    }),
    'quick-ref': () => Promise.resolve(buildQuickRefPdf({
      columns: QUICK_REF_COLS,
      skillName: 'PostgreSQL',
      accentColor: C,
      stackLabel: 'psql CLI + Diagnóstico',
      tagline: 'Comandos psql, EXPLAIN e queries de diagnóstico',
      version: 'PostgreSQL 16',
    })),
    errors: () => buildErrorRefPdf({
      errors: ERRORS,
      skillName: 'PostgreSQL',
      accentColor: C,
      stackLabel: 'Database',
    }),
  }

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
