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

// ── Paleta RDS (AWS blue-purple) ─────────────────────────────────────────────
const C = '#3b48cc'  // AWS RDS — NUNCA omitir, default seria cyan React

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre RDS em entrevista sênior',
    type: 'qa',
    pages: 11,
    description: 'Recuperação ativa: Multi-AZ vs Read Replica, Aurora storage distribuído, RDS Proxy com Lambda, PITR e backup, Performance Insights, Blue/Green Deployment, Aurora Serverless v2, IAM auth e custo. Tudo que entrevistadores sênior de cloud realmente perguntam sobre bancos gerenciados na AWS.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Multi-AZ, Aurora, Proxy, backup e storage numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: comparação Multi-AZ vs Read Replica, Aurora vs RDS padrão (failover, réplicas, lag, storage), tipos de backup (retenção, PITR granularidade), storage types (gp3 vs io2), Performance Insights e CLI de diagnóstico.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam RDS na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'MARS (Multi-AZ, Automated backup, Read Replica, Snapshot), PITR = Pizza In The Room, Proxy = Garçom de conexões, Aurora 4/6, e gp3 = Grátis Por 3 variáveis. Truques verbais para nunca errar as perguntas conceituais de entrevista.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Multi-AZ e Read Replica?',
    a: 'Multi-AZ: réplica síncrona em outra AZ, failover automático em 30–60 s, standby NÃO serve leituras — existe apenas para HA. Read Replica: réplica assíncrona com endpoint próprio para SELECTs, pode ter replication lag, objetivo é escala de leitura. Em produção: use os dois juntos — Multi-AZ para HA do primary, Read Replicas para distribuir carga de leitura.',
    tip: 'O erro mais frequente: assumir que Multi-AZ escala leitura. O standby sequer tem endpoint público. Mencione: Multi-AZ = HA, Read Replica = read scale. São complementares.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar Aurora em vez de RDS PostgreSQL padrão?',
    a: 'Use Aurora quando: precisa de > 5 réplicas de leitura com lag < 100 ms (até 15); failover mais rápido (< 30 s vs 60 s); Aurora Serverless v2 para workload variável; performance do storage distribuído justifica o custo. Use RDS padrão quando: precisa de compatibilidade total (Aurora tem pequenas diferenças); usa extensões não suportadas; workload pequeno onde o custo de Aurora não se justifica.',
    tip: 'Aurora custa ~20% a mais por instância. Mas com storage compartilhado e réplicas muito mais rápidas, o custo total pode ser menor em produção com alto tráfego. A decisão é custo × SLA.',
  },
  {
    level: 'Pleno',
    q: 'Por que usar RDS Proxy com Lambda?',
    a: 'Lambda escala horizontalmente — 200 invocações simultâneas = 200 conexões abertas no RDS. Bancos relacionais têm custo alto por conexão (memória, processos). RDS Proxy mantém pool de conexões com o banco e multiplexa centenas de clientes em 10–20 conexões reais. Bônus: failover Multi-AZ mais transparente — o Proxy redireciona automaticamente, aplicação não recebe TCP reset.',
    tip: 'RDS Proxy adiciona ~1 ms de latência. Para workloads de baixíssima latência, isso pode ser relevante. Para a maioria das APIs, o trade-off é amplamente positivo. Mencionar o bônus de failover transparente demonstra conhecimento prático.',
  },
  {
    level: 'Senior',
    q: 'Como funcionam backups e PITR no RDS?',
    a: 'Automated backup: RDS tira snapshot diário na janela de manutenção + armazena transaction logs continuamente. Isso habilita PITR — restaurar para qualquer segundo dentro do período de retenção (1–35 dias). Snapshot manual: criado sob demanda, retido indefinidamente até deletar. Importante: restaurar qualquer backup cria uma NOVA instância com NOVO endpoint — não é in-place. Planejar atualização de connection string ou DNS (Route 53 CNAME).',
    tip: 'PITR mínimo recomendado para produção: 7 dias. 14 dias para a maioria. 35 dias apenas se compliance exigir. Mencionar que restore cria nova instância é o detalhe que diferencia quem usou de quem só leu.',
  },
  {
    level: 'Senior',
    q: 'Como diagnosticaria uma query lenta em produção no RDS PostgreSQL?',
    a: '1. Performance Insights: identifica a query pelo tipo de espera (CPU, I/O, Lock). Top SQL por DB Load. 2. pg_stat_statements: agrupa estatísticas por query (calls, mean_exec_time, shared_blk_hit). 3. EXPLAIN (ANALYZE, BUFFERS): roda em staging com dados reais — identifica Seq Scan, Nested Loop com estimativa errada, bitmap heap scan ineficiente. Ação: índice faltante, reescrita de query, VACUUM/ANALYZE, ou ajuste de parâmetros (work_mem).',
    tip: 'Performance Insights mostra top SQL por load — uma query que roda 1 ms mas 10.000× por segundo aparece no topo. pg_stat_statements confirma histórico. EXPLAIN ANALYZE é o diagnóstico final do plano.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o storage distribuído do Aurora e por que é diferente do RDS padrão?',
    a: 'RDS padrão: cada instância tem EBS dedicado. Read Replica replica via binlog/WAL — lag proporcional à carga de escrita. Aurora: storage compartilhado por todas as instâncias (writer + readers). 6 cópias em 3 AZs, quorum de escrita 4/6, quorum de leitura 3/6. Réplicas leem do mesmo storage físico — lag < 100 ms sem replicação lógica de dados. Adicionar réplica Aurora é instantâneo (sem copiar dados).',
    tip: 'O storage compartilhado é o que permite lag < 100 ms. No RDS padrão, a réplica aplica binlog/WAL — quanto mais writes, maior o lag. No Aurora, a réplica apenas lê do storage compartilhado.',
  },
  {
    level: 'Senior',
    q: 'O que é Blue/Green Deployment e como usá-lo para upgrade de engine?',
    a: 'Cria cópia Green sincronizada via replicação lógica. Você aplica mudanças no Green (upgrade de engine, schema changes) enquanto Blue serve produção. Switchover: DNS atualizado para Green com downtime < 1 min. Blue permanece como rollback imediato. Processo: CreateBlueGreenDeployment → testar Green → SwitchoverBlueGreenDeployment → validar → deletar Blue. Limitação: não suporta Oracle e SQL Server.',
    tip: 'O ponto-chave: Blue permanece disponível como rollback até você deletar explicitamente. Em upgrade in-place tradicional, não há rollback. Isso é o que torna o Blue/Green superior para mudanças arriscadas.',
  },
  {
    level: 'Senior',
    q: 'Como são os parameter groups e como alterar parâmetros com segurança em produção?',
    a: 'Parameter Groups são conjuntos de configurações do engine. Tipos de parâmetros: dinâmicos (apply sem reboot — ex: work_mem, log_min_duration_statement) e estáticos (exigem reboot — ex: shared_buffers, max_connections). Processo seguro: criar novo Parameter Group (nunca editar o default), testar em staging, aplicar em produção. Para parâmetros estáticos: usar janela de manutenção ou Blue/Green Deployment.',
    tip: 'Verificar apply_type antes de alterar em produção é o que separa quem entende de quem apenas clica no console. shared_buffers requer reboot — um descuido causa downtime inesperado.',
  },
  {
    level: 'Senior',
    q: 'Como funciona Performance Insights e como interpretar os dados?',
    a: 'Performance Insights coleta DB Load — número médio de sessions ativas. Decompõe por wait type: CPU, I/O Read/Write, Lock, Network. DB Load > vCPUs = banco sob pressão. Diagnóstico: CPU alto → query ineficiente (Seq Scan); Lock alto → contenção de transações concorrentes; I/O alto → tabelas sem índice ou cache miss. Top SQL mostra queries que mais contribuem por wait type. Retenção gratuita: 7 dias.',
    tip: 'DB Load > número de vCPUs é o alarme principal. Para histogramas de longo prazo, exportar para CloudWatch Metrics. Alarme recomendado: DB Load > n_vcpus × 0.8 por > 5 minutos.',
  },
  {
    level: 'Senior',
    q: 'Como estruturar multi-região para DR com RDS?',
    a: 'Três abordagens: 1. Cross-Region Read Replica: RPO minutos (lag assíncrono), RTO 30–60 min (promoção manual). Mais simples e barato. 2. Aurora Global Database: RPO < 1 s, RTO < 1 min. Storage-level replication, lag típico < 1 s. Para missão crítica. 3. Ativo-ativo: replicação bidirecional customizada — alta complexidade, raramente necessário. RPO e RTO são os drivers da decisão.',
    tip: 'Testar failover periodicamente é obrigatório — um plano de DR não testado não é um plano. O RTO real de Aurora Global depende do tempo de execução do runbook de promoção, não apenas do lag.',
  },
  {
    level: 'Senior',
    q: 'Como usar autenticação IAM no RDS em vez de senha?',
    a: 'Habilitar IAM auth na instância. Criar usuário DB com GRANT rds_iam (PostgreSQL) ou IDENTIFIED WITH AWSAuthenticationPlugin (MySQL). Dar permissão rds-db:connect na IAM policy. A aplicação gera token temporário (validade 15 min) via aws rds generate-db-auth-token. Vantagem: sem senha em Secrets Manager, rastreável via CloudTrail. Com RDS Proxy: Proxy autentica com Secrets Manager, Lambda não precisa gerar token.',
    tip: 'IAM auth tem overhead de ~100–200 ms para gerar o token. Com RDS Proxy + Secrets Manager, a Lambda não gera token — o Proxy cuida. Combine Proxy + IAM auth para o melhor dos dois mundos.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre Enhanced Monitoring e Performance Insights?',
    a: 'Enhanced Monitoring: métricas do sistema operacional (CPU por processo, memória, disco I/O, network). Granularidade 1–60 s. Responde: como está o servidor? Performance Insights: métricas do banco (DB Load, wait types, top SQL). Responde: o que o banco está fazendo? São complementares: I/O alto no Enhanced Monitoring + I/O wait alto no Performance Insights = diagnóstico completo de gargalo de disco.',
    tip: 'Em incident de lentidão: Performance Insights (wait type) → se I/O, verificar Enhanced Monitoring (IOPS utilizados vs provisionados) → ajustar storage type ou IOPS provisionados.',
  },
  {
    level: 'Pleno',
    q: 'O que é o RDS Storage Autoscaling e quais são seus limites?',
    a: 'Aumenta automaticamente o storage quando livre fica abaixo de 10% ou 5 GiB por > 5 minutos consecutivos. Limite máximo configurável. Limitações críticas: só cresce, nunca diminui. Para reduzir storage: criar nova instância menor a partir de snapshot. Cooldown de 6 horas entre expansões automáticas. Configurar alarme de FreeStorageSpace < 20% para investigar crescimento anormal antes do autoscaling entrar.',
    tip: 'Definir o limite máximo com cuidado: um bug de insert acumulado crescerá até o limite sem alarmar. O alarme de FreeStorageSpace é o safety net para investigar antes do autoscaling disparar.',
  },
  {
    level: 'Senior',
    q: 'Quando e como usar Aurora Serverless v2?',
    a: 'Escala entre min e max ACUs (Aurora Capacity Units) com granularidade de 0,5 ACU sem downtime. 1 ACU ≈ 2 GB RAM. Casos ideais: dev/staging (min 0,5 ACU = custo mínimo idle), workloads imprevisíveis, SaaS multi-tenant. Não recomendado: SLA sub-milissegundo (scaling tem latência de segundos), bancos que nunca ficam idle (Reserved Instance do tamanho correto é mais econômico).',
    tip: 'Diferença v1 vs v2: v1 tinha cold start de 25+ segundos. v2 escala de 0,5 ACU sem cold start. Calcular o ponto de quebra: se o banco fica em N ACUs 24/7, comparar com instância reservada.',
  },
  {
    level: 'Pleno',
    q: 'Como configurar criptografia em repouso no RDS e quais são as limitações?',
    a: 'Criptografia habilitada no momento de criação — não pode ser adicionada depois. Usa KMS (chave gerenciada ou CMK). O que é criptografado: storage, snapshots automáticos, snapshots manuais, Read Replicas na mesma região, logs. Limitação crítica: instância não criptografada não pode ser migrada diretamente. Caminho: snapshot → copiar com criptografia → restaurar em nova instância. CMK (Customer Managed Key) permite revogação de acesso, auditoria CloudTrail, rotação manual.',
    tip: 'Usar CMK em vez de chave AWS gerenciada para dados sensíveis (PCI, HIPAA). CMK permite revogar acesso sem deletar dados — em um incidente de segurança, essa capacidade é crítica.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona a janela de manutenção do RDS?',
    a: 'Intervalo semanal de 30 minutos durante o qual a AWS aplica patches de OS, atualizações de engine e modificações pendentes. Sem Multi-AZ: breve downtime (1–2 min). Com Multi-AZ: patch no standby primeiro, failover, patch no antigo primary — downtime reduzido ao tempo de failover (~30–60 s). Assinar RDS Event Notifications (SNS, categoria maintenance) para notificação com 2–3 dias de antecedência.',
    tip: 'Sem assinar RDS Event Notifications, manutenção obrigatória pode pegar de surpresa em horário de pico. A AWS notifica com 2–3 dias de antecedência para manutenções forçadas.',
  },
  {
    level: 'Senior',
    q: 'Como otimizar custo de RDS em produção?',
    a: 'Alavancas principais: 1. Right-sizing: Performance Insights + CloudWatch para identificar instâncias super-provisionadas. 2. Reserved Instances: 1–3 anos com desconto de 30–60% — fazer após right-sizing. 3. Storage: gp3 é 20% mais barato que gp2. 4. Aurora I/O pricing: se I/O > 25% do custo, Aurora I/O-Optimized (preço fixo) pode ser mais barato. 5. Read Replicas desnecessárias: cada réplica paga instância + storage.',
    tip: 'Reserved Instances: conversão imediata para billing (instância não muda). Preferir RIs de 1 ano para flexibilidade — compromisso de 3 anos com tipo de instância errado não tem rollback barato.',
  },
  {
    level: 'Pleno',
    q: 'Como monitorar RDS com CloudWatch e RDS Event Notifications?',
    a: 'Alarmes CloudWatch críticos: FreeStorageSpace < 10% (banco para quando satura), DatabaseConnections > 80% do max_connections, ReadLatency e WriteLatency > baseline, DB Load (Performance Insights). Eventos RDS via SNS: RDS-EVENT-0006 (failover iniciado), RDS-EVENT-0043 (backup failed), RDS-EVENT-0045 (storage 90% cheio). Combinar Enhanced Monitoring (OS metrics) + Performance Insights (DB metrics) para diagnóstico completo.',
    tip: 'FreeStorageSpace < 10% é o alarme mais crítico — quando satura, o banco para completamente. Habilitar autoscaling é o safety net, mas o alarme detecta crescimento anormal antes.',
  },
  {
    level: 'Senior',
    q: 'Como escalar verticalmente uma instância RDS com downtime mínimo?',
    a: 'Estratégias em ordem de preferência: 1. Aurora: adicionar réplica com novo instance type, promover via failover manual (~30 s). 2. RDS Multi-AZ: modificar instance type — AWS aplica no standby, faz failover, aplica no antigo primary. Downtime: tempo de failover. 3. Blue/Green: criar Green com novo instance type, switchover (< 1 min). 4. Janela de manutenção (último recurso): modifica in-place com downtime.',
    tip: 'Com Aurora, a estratégia preferida é adicionar replica maior → failover manual → remover antiga. O cluster não precisa de maintenance window. Com RDS padrão Multi-AZ, modificar instance type durante baixo tráfego.',
  },
  {
    level: 'Senior',
    q: 'O que é Aurora Global Database e quando usar?',
    a: 'Aurora Global Database replica de uma região primária para até 5 regiões secundárias com lag típico < 1 s (replicação de storage). Leituras servidas localmente em cada região. Casos: aplicação global com usuários em múltiplas regiões; DR com RPO < 1 s e RTO < 1 min; compliance de residência de dados com leituras locais. Failover de Aurora Global é manual — exige runbook e testes periódicos.',
    tip: 'O RTO real depende do tempo de execução do runbook de promoção, não apenas do lag de replicação. Sem teste periódico de DR, o RTO real pode ser muito maior que o esperado.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o RDS Event Notifications e para quais eventos configurar alertas?',
    a: 'RDS Event Notifications usa SNS para publicar eventos de instâncias, snapshots, parameter groups e security groups. Eventos críticos: RDS-EVENT-0006 (failover iniciado), RDS-EVENT-0034 (instância reiniciada), RDS-EVENT-0043 (backup failed), RDS-EVENT-0045 (storage 90% cheio), RDS-EVENT-0049 (automated backup iniciado — para correlacionar lentidão). Combinar com CloudWatch Alarms para cobertura completa.',
    tip: 'RDS-EVENT-0045 (storage 90%) + alarme CloudWatch de FreeStorageSpace < 10% = duas camadas de alerta para o problema mais crítico. Redundância é intencional para incident response.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'Multi-AZ', sig: 'Replicação síncrona. Standby NÃO serve leituras.', desc: 'Failover automático 30–60 s. DNS atualizado. ~2× custo do primary. Obrigatório em produção.' },
  { name: 'Read Replica', sig: 'Replicação assíncrona. Endpoint próprio para leitura.', desc: 'RDS: 5 réplicas. Aurora: 15 réplicas (lag < 100 ms). Pode ser promovida a primary (manual).' },
  { name: 'Aurora', sig: '6 cópias em 3 AZs. Quorum 4/6 escrita, 3/6 leitura.', desc: 'Failover < 30 s. 15 réplicas. Storage cresce automaticamente. ~20% mais caro que RDS padrão.' },
  { name: 'RDS Proxy', sig: 'Connection pooler gerenciado. Pool de conexões persistentes.', desc: 'Essencial com Lambda. Reduz conexões reais ao banco. Failover mais transparente para clientes.' },
  { name: 'PITR', sig: 'Point-in-time recovery. Qualquer segundo do período de retenção.', desc: 'Requer automated backup. Restaurar cria NOVA instância com NOVO endpoint.' },
  { name: 'Blue/Green', sig: 'Green = cópia sincronizada. Switchover < 1 min.', desc: 'Blue permanece como rollback. Ideal para upgrades de engine e schema changes arriscados.' },
  { name: 'Performance Insights', sig: 'DB Load por wait type (CPU, I/O, Lock).', desc: 'Gratuito 7 dias. DB Load > vCPUs = pressão. Top SQL identifica queries problemáticas.' },
  { name: 'gp3 vs io2', sig: 'gp3: 16k IOPS / 1.000 MB/s. io2: 256k IOPS.', desc: 'gp3: IOPS e throughput independentes do tamanho. io2: para OLTP intensivo (core banking, trading).' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'Lambda conectando diretamente ao RDS sem Proxy — max_connections satura' },
  { ok: false, t: 'Usar Multi-AZ para escalar leituras — standby não tem endpoint de leitura' },
  { ok: false, t: 'Storage autoscaling sem alarme de FreeStorageSpace — bug cresce storage forever' },
  { ok: false, t: 'Upgrade de engine in-place sem Blue/Green — sem rollback disponível' },
  { ok: false, t: 'Criptografia desabilitada no create — não pode ser adicionada depois' },
  { ok: true, t: 'Multi-AZ + Read Replica em produção — HA e escala de leitura são complementares' },
  { ok: true, t: 'RDS Proxy com Lambda — pool de conexões, failover transparente' },
  { ok: true, t: 'Automated backup com retenção 7–14 dias — habilita PITR' },
  { ok: true, t: 'Performance Insights para diagnóstico — wait type direciona a investigação' },
  { ok: true, t: 'Blue/Green para upgrades críticos — rollback disponível até deletar Blue' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'MARS — componentes de resiliência do RDS',
    trick: 'M-A-R-S',
    expansion: [
      ['M', 'Multi-AZ (síncrono, HA)'],
      ['A', 'Automated backup (habilita PITR)'],
      ['R', 'Read Replica (assíncrono, leitura)'],
      ['S', 'Snapshot manual (retenção indefinida)'],
    ],
    explanation: 'Os quatro componentes de resiliência são complementares e cobrem diferentes cenários. Multi-AZ = HA. Read Replica = escala. Backup = recuperação. Snapshot = ponto seguro antes de mudança.',
    example: 'Produção ideal: Multi-AZ ativo + 2 Read Replicas + backup 14 dias + snapshot antes de migration.',
    why: 'A confusão entre Multi-AZ e Read Replica é o erro mais comum em entrevistas sobre RDS. MARS separa claramente os propósitos.',
  },
  {
    label: 'PITR = Pizza In The Room (qualquer momento)',
    trick: 'PITR = Para qualquer Instante, restaura o banco',
    expansion: [
      ['P', 'Point-in-time'],
      ['I', 'Instante exato — qualquer segundo'],
      ['T', 'Transactional logs (automated backup + logs contínuos)'],
      ['R', 'Restore em nova instância'],
    ],
    explanation: 'PITR usa o automated backup diário + transaction logs contínuos para reconstruir o banco em qualquer segundo dentro do período de retenção.',
    example: 'DELETE acidental às 14:23:47 → PITR para 14:23:00 → nova instância com os dados intactos.',
    why: 'PITR é a ferramenta de recuperação mais precisa do RDS. Saber que cria nova instância (não in-place) é o detalhe que entrevistadores testam.',
  },
  {
    label: 'Proxy = Garçom de conexões',
    trick: '200 clientes (Lambda) → 10 garçons (conexões) → 1 cozinha (banco)',
    expansion: [
      ['Clientes', '200 Lambdas simultâneas — cada uma faz um pedido'],
      ['Garçons', '10–20 conexões reais no pool do Proxy'],
      ['Cozinha', 'RDS primary — max_connections preservado'],
    ],
    explanation: 'Sem Proxy: cada Lambda abre conexão direta ao banco. Com 200 simultâneas, max_connections satura. O Proxy multiplexia centenas de clientes em poucas conexões persistentes.',
    example: 'Lambda escalando de 5 para 200 instâncias → sem Proxy: 200 conexões (saturam) → com Proxy: ainda 10–20 conexões.',
    why: 'Lambda + RDS é um anti-pattern clássico resolvido pelo Proxy. Saber o motivo técnico (max_connections) diferencia quem entendeu de quem decorou.',
  },
  {
    label: 'Aurora 4/6 — quorum que garante durabilidade',
    trick: 'Escreve quando 4/6 confirmam. Lê quando 3/6 confirmam.',
    expansion: [
      ['6 cópias', '2 por AZ em 3 AZs (AZ-a, AZ-b, AZ-c)'],
      ['4/6 escrita', 'Tolera perder 1 AZ completa + 1 nó extra sem perder dados'],
      ['3/6 leitura', 'Leitura funciona mesmo perdendo 3 segmentos (1 AZ inteira)'],
    ],
    explanation: 'O quorum de escrita 4/6 garante que mesmo perdendo 1 AZ completa (2 cópias), ainda há 4 confirmações. Isso é o que permite failover < 30 s — o storage já estava replicado.',
    example: 'AZ-b cai completamente → 2 cópias perdidas → restam 4 em AZ-a e AZ-c → quorum 4/6 mantido → zero perda de dados.',
    why: 'O quorum Aurora é a resposta para "por que Aurora tem failover mais rápido?". O storage já estava replicado — não precisa copiar dados para o novo primary.',
  },
  {
    label: 'gp3 = Grátis Por 3 variáveis independentes',
    trick: 'gp3: Tamanho, IOPS e Throughput são independentes',
    expansion: [
      ['Tamanho', 'GiB de storage — define apenas o espaço'],
      ['IOPS', 'Até 16.000 — configurável independente do tamanho'],
      ['Throughput', 'Até 1.000 MB/s — configurável independente do tamanho'],
    ],
    explanation: 'gp2 amarrava IOPS ao tamanho: mais IOPS = mais storage. gp3 separa as 3 dimensões: você provisiona exatamente o que precisa sem pagar por storage extra.',
    example: 'Banco de 50 GiB que precisa de 8.000 IOPS: gp2 exigiria 267 GiB (3 IOPS/GiB). gp3: 50 GiB + 8.000 IOPS separadamente — 20% mais barato.',
    why: 'gp3 é o padrão atual para novos bancos RDS. Entender a independência das dimensões explica por que gp3 é mais barato e mais flexível que gp2.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Amazon RDS',
    stackLabel: 'Cloud · Banco de Dados',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Amazon RDS',
    accentColor: C,
    stackLabel: 'Cloud · Banco de Dados',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['Multi-AZ', 'Síncrono, HA, standby NÃO lê — 30–60 s failover'],
        ['Read Replica', 'Assíncrono, leitura, lag possível — endpoint próprio'],
        ['Aurora', '6 cópias 3 AZs, 15 réplicas, lag < 100 ms'],
        ['RDS Proxy', 'Connection pool — essencial com Lambda'],
        ['PITR', 'Qualquer segundo — automated backup obrigatório'],
        ['Blue/Green', 'Upgrade sem downtime + rollback disponível'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'Multi-AZ + Read Replica: complementares, não alternativos — use os dois em produção',
        'RDS Proxy obrigatório com Lambda — max_connections é recurso finito',
        'PITR: retenção mínima 7 dias, 14 dias para a maioria — 35 dias só se compliance exigir',
        'Performance Insights: DB Load > vCPUs = pressão — diagnóstico por wait type',
        'Blue/Green para upgrades: Blue permanece como rollback até deletar explicitamente',
        'gp3 > gp2: 20% mais barato, IOPS e throughput independentes do tamanho',
      ],
      patterns: [
        {
          name: 'RDS + Proxy com Lambda (Terraform)',
          code: `resource "aws_db_proxy" "main" {
  name          = "myapp-proxy"
  engine_family = "POSTGRESQL"
  role_arn      = aws_iam_role.rds_proxy.arn
  auth { auth_scheme = "SECRETS"
         secret_arn  = aws_secretsmanager_secret.rds.arn }
}
# Lambda usa PROXY_HOST em vez de DB_HOST`,
          desc: 'Proxy multiplexa conexões Lambda → banco. Failover transparente.',
        },
        {
          name: 'Blue/Green Deployment — upgrade de engine',
          code: `aws rds create-blue-green-deployment \\
  --source arn:aws:rds:...:db:mydb \\
  --target-engine-version 16.3
# Aguardar AVAILABLE → testar Green
aws rds switchover-blue-green-deployment \\
  --blue-green-deployment-identifier bgd-abc`,
          desc: 'Upgrade sem downtime — Blue como rollback até deletar.',
        },
        {
          name: 'Performance Insights — top SQL via CLI',
          code: `aws pi get-resource-metrics \\
  --service-type RDS \\
  --identifier db-XXXX \\
  --metric-queries '[{
    "Metric":"db.load.avg",
    "GroupBy":{"Group":"db.sql"}
  }]' \\
  --start-time $(date -d '1h ago' +%s) \\
  --end-time $(date +%s)`,
          desc: 'Top SQL por DB Load — identifica queries que mais contribuem.',
        },
      ],
      mentalModels: [
        'MARS: Multi-AZ (HA) + Automated backup + Read Replica + Snapshot manual',
        'PITR = qualquer segundo = automated backup + transaction logs contínuos',
        'Proxy = Garçom: 200 clientes → 10 garçons → 1 cozinha (banco)',
        'Aurora 4/6: escreve quando 4 confirmam → durabilidade mesmo perdendo 1 AZ',
        'gp3: Tamanho, IOPS e Throughput são 3 dimensões independentes',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Amazon RDS',
    stackLabel: 'Cloud · Banco de Dados',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function RdsPdfs() {
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
