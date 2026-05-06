'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion } from '@/components/pdfs/ComparativeRefPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { PatternItem } from '@/components/pdfs/CheatsheetPdf'

// ── Paleta Microservices ──────────────────────────────────────────────────────
const C = '#7E57C2'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas de arquitetura mais cobradas em entrevista sênior',
    type: 'qa',
    pages: 9,
    description: 'Saga, Outbox, Circuit Breaker, idempotência, Strangler Fig, API Gateway, service mesh, observabilidade e quando NÃO usar microservices — respostas para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'comparative',
    title: 'Monolito vs Modulith vs Microservices',
    subtitle: 'Tabela comparativa multidimensional para defender em entrevista',
    type: 'comparative',
    pages: 3,
    description: 'Comparação com 7 critérios — operação, escala, autonomia, transações, debugging, tamanho de time e velocidade — com cenários recomendados para cada arquitetura.',
    icon: '02',
    goal: 'Decisão arquitetural',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'CBRT, LMT, CO, BODS — âncoras cognitivas para padrões de microservices',
    type: 'mnemonics',
    pages: 2,
    description: 'Resiliência (CBRT), Observabilidade (LMT), Saga (CO), Database per service (BODS), Strangler Fig e a regra do deploy independente como critério de microservice.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os erros que criam distributed monolith — com correção',
    type: 'antipatterns',
    pages: 3,
    description: 'Banco compartilhado, chatty services, Saga sem idempotência, deploy coordenado e serviço por entidade — com código errado vs correto.',
    icon: '04',
    goal: 'Code review de arquitetura',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Ecossistema completo de microservices numa folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 9 categorias: fundamentos, comunicação, transações, resiliência, observabilidade, migração, anti-patterns, testes e quando NÃO usar. Checklist de 20 pontos.',
    icon: '05',
    goal: 'Revisão panorâmica',
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet de Padrões',
    subtitle: 'Saga, Outbox, Circuit Breaker, BFF, Strangler Fig — referência rápida',
    type: 'cheatsheet',
    pages: 2,
    description: 'Todos os padrões essenciais de microservices numa folha densa: quando usar cada um, qual problema resolve e sinal de quando é necessário.',
    icon: '06',
    goal: 'Consulta rápida',
  },
]

// ── Q&A Review ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    q: 'Que red flag te faz NÃO recomendar microservices?',
    a: 'Time de 5-10 devs — overhead de operar 10 serviços (CI/CD, monitoramento, deploy, on-call) suga a capacidade que deveria entregar feature. Monolito modular ganha em ROI. Outras red flags: domínio mal entendido (fronteiras erradas viram pesadelo de refactor), sem maturidade DevOps (observability, IaC), produto pré-PMF (arquitetura mudando direto), e "queremos microservices porque Netflix usa" — cargo cult clássico. Sam Newman: "don\'t do microservices" é literalmente o título de uma talk dele.',
    level: 'Senior',
    tip: 'Abrir com o cargo cult do Netflix e citar Sam Newman (autor do livro "Building Microservices") é o que diferencia uma resposta de sênior de uma resposta decorada.',
  },
  {
    q: 'Como você define a fronteira de um microserviço?',
    a: 'Começo por Bounded Context de DDD — onde o modelo e a linguagem de negócio mudam. Verifico: dado que muda junto fica junto, time autônomo como dono do serviço, frequência de mudança compatível, escala independente justificada por dado real. Heurística de Newman: se você precisa fazer deploy coordenado de dois serviços para entregar uma feature, a fronteira está errada. Junte ou redesenhe.',
    level: 'Pleno',
    tip: 'O critério "deploy independente" é o mais fácil de explicar e o mais poderoso. Complementar com a heurística de Conway\'s Law (a arquitetura reflete a estrutura de comunicação do time) impressiona.',
  },
  {
    q: 'Como você lida com transação que cruza microservices?',
    a: 'Descarto 2PC — não escala e cria acoplamento de disponibilidade. Uso Saga: sequência de transações locais, cada serviço publica evento, o próximo serviço reage. Em falha, dispara compensating transactions (cancelar reserva, estornar pagamento). Duas variantes: choreography (serviços reagem a eventos sem coordenador, simples mas difícil de visualizar o fluxo completo) e orchestration (um serviço orquestra a saga, mais claro e rastreável mas cria ponto central). Idempotência e outbox pattern são obrigatórios.',
    level: 'Senior',
    tip: 'Mencionar que você NÃO usa 2PC (e explicar por quê não escala) + nomear as duas variantes com os trade-offs de cada uma é o que mostra domínio real do padrão.',
  },
  {
    q: 'Explique o Outbox Pattern e quando usá-lo.',
    a: 'Problema: gravo no banco de dados E preciso publicar um evento. Se publico antes de commitar, evento vai mas transação pode falhar. Se publico depois do commit, processo pode morrer antes de publicar — evento se perde. Outbox Pattern: na mesma transação de negócio, insiro o evento numa tabela outbox. Um relay separado (ou CDC via Debezium) lê essa tabela e publica no broker. Garante que evento só é publicado se a transação commitou. É at-least-once — relay garante entrega, consumer precisa de idempotência.',
    level: 'Senior',
    tip: 'A distinção entre CDC (Debezium lendo WAL do Postgres) e polling simples (SELECT + DELETE a cada N segundos) mostra que você pensou na latência real — CDC tem sub-segundo, polling pode ter segundos.',
  },
  {
    q: 'Como você garante que um evento seja processado exatamente uma vez?',
    a: 'Exatamente uma vez é extremamente difícil em sistemas distribuídos — Kafka oferece dentro do cluster, mas não ponta a ponta. O padrão prático é at-least-once + idempotência no consumer. Implementação: cada evento tem um eventId único. Consumer verifica em tabela de idempotência se já processou; se sim, ignora (ack sem reprocessar). A tabela faz parte da mesma transação do efeito colateral. Isso garante efetivamente o comportamento de exactly-once para o negócio.',
    level: 'Senior',
    tip: 'Mostrar que a tabela de idempotência deve estar na mesma transação do efeito colateral (não depois) é o detalhe que diferencia quem implementou de quem só sabe o conceito.',
  },
  {
    q: 'Como você implementa Circuit Breaker em microservices?',
    a: 'Três estados: CLOSED (chamadas passam, monitoro falhas), OPEN (rejeito imediatamente — fail-fast), HALF_OPEN (deixo passar algumas chamadas de teste). Configuração típica: janela de 60s, volume mínimo de 20 calls, taxa de erro > 50% abre. Após 30s em OPEN, vai para HALF_OPEN, testa 5 calls. Se passarem, fecha; se falharem, abre com backoff. Bibliotecas: Resilience4j (Java), opossum (Node), Polly (.NET). Em K8s com Istio, breaker fica no sidecar proxy — sem mudar código da aplicação.',
    level: 'Senior',
    tip: 'Mencionar que em service mesh (Istio) o circuit breaker fica no sidecar sem mudança de código é o insight que diferencia arquiteto de developer.',
  },
  {
    q: 'O que é um distributed monolith e como evitar?',
    a: 'Distributed monolith é quando você tem a complexidade de microservices sem os benefícios: serviços que precisam ser deployados juntos, que compartilham banco, que fazem chamadas síncronas em cadeia para cada request. É o pior dos dois mundos. Evitar: database per service (sem exceção), comunicação async para fluxos não interativos, fronteiras por Bounded Context (não por entidade técnica), e o teste: consigo fazer deploy de A sem que B precise ser atualizado?',
    level: 'Pleno',
    tip: 'O "teste do deploy" é a forma mais simples e definitiva de diagnosticar um distributed monolith. Quem usa esse critério mostra que pensa em consequências operacionais, não só em teoria.',
  },
  {
    q: 'Tradeoff: REST sync vs eventos async entre serviços?',
    a: 'Sync (REST/gRPC): simples, response imediato, debugging linear. Mas acopla disponibilidade — se B caiu, A também cai — adiciona latência em cadeia e cria fanout difícil de escalar. Async (eventos/fila): desacopla temporalmente, absorve pico, escala bem. Mas complexidade sobe — idempotência, ordem, dead letter, observability mais difícil, response não é imediato. Regra prática: caminho de leitura interativa = sync. Reação a evento de negócio (notificação, replicação, integração) = async. Misturo dentro do mesmo sistema sem culpa.',
    level: 'Pleno',
    tip: 'A "regra prática" de sync para leitura interativa e async para eventos de negócio é simples e defensável. Quem diz "sempre async" ou "sempre REST" não entendeu o trade-off.',
  },
  {
    q: 'Quando migrar de monolito para microservices?',
    a: 'Quando a dor justifica o custo. Sintomas reais: deploy do monolito demora horas e bloqueia times, escala vertical chegou ao limite, módulo X precisa de stack diferente, time grande pisando no pé um do outro com merge conflicts frequentes. Estratégia: strangler fig — extrai um Bounded Context por vez, começa pelos menos acoplados. Nunca big bang. Antes de extrair, modularize dentro do monolito — se não consegue fazer isso, microservice não vai resolver.',
    level: 'Senior',
    tip: 'A frase "se não consegue modularizar dentro do monolito, microservice não vai resolver" é memorável e precisa. Acoplamento de dados é o problema real — não a tecnologia.',
  },
  {
    q: 'O que é o Strangler Fig Pattern?',
    a: 'Padrão de migração incremental de monolito para microservices. O nome vem da figueira estranguladora — a planta cresce em volta da árvore original até substituí-la. Aplicação: (1) Adiciona proxy layer entre cliente e monolito; (2) Extrai 1 Bounded Context por vez para novo serviço; (3) Proxy redireciona tráfego do módulo extraído para o novo serviço; (4) Remove o código do monolito depois que o novo serviço está estável. Vantagens: zero downtime, rollback fácil via feature flag, risco gradual.',
    level: 'Pleno',
    tip: 'Mencionar a sequência de extração de banco: schema separation (mesmo banco, schema próprio) → new service pointing same bank → CDC synchronization → full separation. Essa sequência de 4 fases é o que faz zero downtime possível.',
  },
  {
    q: 'Como você versiona API entre microservices?',
    a: 'Prefiro backward compatibility a versionamento explícito. Adicionar campo: ok. Remover/renomear: nunca direto — adiciona o novo, depreca o antigo, monitora uso via analytics, remove depois. Quando precisa de breaking change: versão na URL (/v2/orders) ou header (Accept-Version). Contract test (Pact) garante que mudança em A não quebra B em CI antes de chegar em produção. Consumer-driven contracts são o padrão em organizações maduras.',
    level: 'Senior',
    tip: 'Citar o Expand-Contract Pattern: primeiro Expand (adiciona novo campo, mantém antigo), deploya consumers que leem o novo, então Contract (remove antigo). Para eventos Kafka isso é obrigatório — você não pode reprocessar eventos históricos com schema quebrado.',
  },
  {
    q: 'Como você monitora saúde do sistema de microservices?',
    a: 'Os três pilares de observabilidade: Logs (JSON estruturado com correlation-id, via ELK ou Loki), Metrics (Prometheus + Grafana, com SLI/SLO definidos), Traces (OpenTelemetry + Jaeger para rastrear request entre serviços). O correlation-id deve ser gerado na borda (API Gateway) e propagado em todos os headers de chamada entre serviços. Sem isso, rastrear um erro que cruzou 5 serviços é impossível. Alertas em cima de SLOs, não de métricas brutas.',
    level: 'Pleno',
    tip: 'Mencionar que correlation-id é gerado no API Gateway e propagado em TODOS os headers internos — e que sem isso debugging é adivinhação — é o detalhe operacional que diferencia.',
  },
  {
    q: 'O que é BFF (Backend For Frontend)?',
    a: 'BFF é uma variação do API Gateway onde cada "tipo de cliente" tem seu próprio backend especializado. Web BFF agrega e formata dados para o app web; Mobile BFF faz o mesmo para o app mobile — campos diferentes, payloads menores, APIs otimizadas por cliente. Resolve o problema de o frontend web precisar de dados muito diferentes do mobile, evitando que o gateway genérico vire um agregador que serve mal aos dois. Time de frontend pode possuir e deployar seu próprio BFF.',
    level: 'Pleno',
    tip: 'A propriedade do BFF ("time de frontend pode deployar seu próprio BFF") é o detalhe que mostra o benefício real de autonomia — não é só sobre otimização de payload.',
  },
  {
    q: 'Como você lida com service discovery em Kubernetes?',
    a: 'Kubernetes tem service discovery nativo via DNS e Service objects. Quando crio um Service do tipo ClusterIP, o kube-dns resolve orders-service.default.svc.cluster.local para o IP virtual, que é load-balanced entre os pods. Não preciso de Consul ou Eureka em K8s. O que preciso garantir: health checks corretos no readinessProbe (pod só entra no pool quando está pronto), graceful shutdown (pod sai do pool antes de morrer), e PodDisruptionBudget para não tirar todos os pods de uma vez em rolling update.',
    level: 'Pleno',
    tip: 'Mencionar os três requisitos operacionais (readinessProbe, graceful shutdown, PDB) além do service discovery em si mostra que você pensa em operação real, não só na descoberta de serviços.',
  },
  {
    q: 'O que é service mesh e quando justifica sua complexidade?',
    a: 'Service mesh (Istio, Linkerd) intercepta toda comunicação entre serviços via sidecar proxies (Envoy). Oferece: mTLS automático, circuit breaking, retry com backoff, rate limiting, distributed tracing e traffic shifting — tudo sem mudar código. Quando justifica: mTLS em ambiente de segurança rigorosa, canary deployment sofisticado (5% do tráfego para v2 por header), observability unificada, cluster grande (20+ serviços). Quando NÃO justifica: cluster pequeno, time sem expertise em K8s avançado. Istio tem curva de operação brutal — troubleshooting de mTLS pode tomar dias.',
    level: 'Senior',
    tip: 'Saber quando NÃO usar service mesh é diferencial sênior. Muitos falam de Istio como solução default — quem entende o custo operacional e quando vale mostra maturidade de arquitetura.',
  },
  {
    q: 'Como você testa microservices em isolamento?',
    a: 'Pirâmide adaptada: unit tests para lógica de domínio (sem rede), component tests para o serviço completo com dependências mockadas (WireMock, Testcontainers), contract tests (Pact) para garantir que producer e consumer concordam com a interface, e integration tests mínimos end-to-end em staging. Evito rodar todos os microservices juntos em CI — é lento, frágil e mascara falhas. Contract tests substituem E2E na maioria dos casos e rodam 10× mais rápido.',
    level: 'Senior',
    tip: 'Citar Pact para contract tests e explicar que consumer-driven contracts permitem ao producer saber quem vai quebrar antes de fazer deploy é o detalhe que diferencia.',
  },
  {
    q: 'Como você garante idempotência em handlers de eventos?',
    a: 'Idempotência é obrigatória em qualquer sistema com entrega at-least-once. O handler pode receber o mesmo evento N vezes — seja por retry do broker, reprocessamento de dead letter, ou reconstrução de read model. Padrão mais robusto: tabela de idempotência. Na mesma transação do efeito colateral, verifica se eventId já existe; se sim, retorna sem reprocessar; se não, processa e insere o eventId. A transação atômica garante: ou processa e registra, ou nada — nunca processa sem registrar.',
    level: 'Senior',
    tip: 'Mostrar código com a verificação de idempotência DENTRO da mesma transação (não antes nem depois) é o que diferencia quem implementou de quem apenas sabe o conceito.',
  },
  {
    q: 'Como você projeta API Gateway para múltiplos microservices?',
    a: 'API Gateway é o ponto de entrada único — cliente nunca fala com serviço interno diretamente. Responsabilidades: roteamento (GET /orders/123 → Orders Service), autenticação/autorização (valida JWT, serviços internos confiam no header), rate limiting (por IP ou usuário), aggregation (uma chamada do cliente que precisa de dados de 3 serviços), e protocol translation (cliente HTTP, serviço interno gRPC). Anti-pattern: API Gateway com regra de negócio. Se o gateway faz cálculo de desconto ou validação de estoque, virou God Service.',
    level: 'Senior',
    tip: 'O anti-pattern "Gateway com regra de negócio" é frequente — times começam adicionando lógica "por conveniência" e o gateway vira um novo monolito. Mencionar isso explicitamente é diferencial.',
  },
  {
    q: 'Como você implementa rastreabilidade (tracing) entre microservices?',
    a: 'Distributed tracing é fundamental: sem ele, um erro que cruzou 5 serviços é impossível de rastrear. Solução padrão: OpenTelemetry (OTel). Componentes: Trace (operação end-to-end), Span (unidade de trabalho — cada chamada de serviço, cada query), Context propagation (traceId passado em header traceparent automaticamente). Boas práticas: correlation-id gerado no Gateway propagado em todos os headers internos, span attributes com order.id e customer.id para busca, sampling estratégico (100% em erros, 1% em chamadas normais).',
    level: 'Senior',
    tip: 'Citar OpenTelemetry (não Zipkin ou Jaeger como ferramenta de instrumentação — são backends) e mencionar sampling estratégico para controlar volume mostra expertise de produção.',
  },
  {
    q: 'Como você implementa deploy sem downtime em microservices?',
    a: 'Rolling deployment no Kubernetes com maxUnavailable: 0 e maxSurge: 1 — novos pods sobem antes dos velhos saírem. readinessProbe garante que o pod só recebe tráfego quando pronto. Backward compatibility obrigatória: nunca remova campo de API enquanto consumers existem. Expand-contract pattern para schema de eventos Kafka: Expand (adiciona novo campo), deploya consumers, Contract (remove antigo). Feature flags para rollout gradual — nova lógica por trás de flag, ativa pra 1% do tráfego, depois 100%. Rollback: kubectl rollout undo.',
    level: 'Senior',
    tip: 'O expand-contract pattern para Kafka é o detalhe mais específico e menos óbvio — é o que diferencia quem pensa em eventos históricos (que não podem ser re-emitidos com schema novo) de quem só pensa em APIs HTTP.',
  },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Resiliência — CBRT',
    trick: 'CBRT: "Cuidado, Breaker Resiste ao Timeout"',
    expansion: [['C','Circuit Breaker'],['B','Bulkhead'],['R','Retry + backoff'],['T','Timeout']],
    explanation: 'Os 4 padrões que todo sênior precisa combinar na ordem certa para lidar com falhas em sistemas distribuídos.',
    example: 'Resilience4j: @CircuitBreaker + @Retry + @Bulkhead + timeout no HttpClient',
    why: 'Sem CBRT, uma falha num serviço downstream cascateia e derruba o sistema inteiro.',
  },
  {
    label: 'Observabilidade — LMT',
    trick: 'LMT: "Logs, Métricas, Traces" — os três pés do tripé',
    expansion: [['L','Logs (JSON estruturado)'],['M','Metrics (Prometheus)'],['T','Traces (OpenTelemetry)']],
    explanation: 'Sem os três pilares, diagnóstico em produção é adivinhação. Cada pilar responde uma pergunta diferente: o quê aconteceu, quanta frequência e onde no fluxo.',
    example: 'Loki (logs) + Prometheus + Grafana (metrics) + Jaeger (traces) com correlation-id em tudo',
    why: 'Correlation-id propagado em todos os headers internos torna o trace end-to-end possível.',
  },
  {
    label: 'Saga — CO',
    trick: 'CO: "Coreografia é simples, Orquestração é clara"',
    expansion: [['C','Choreography (eventos, sem central)'],['O','Orchestration (coordenador explícito)']],
    explanation: 'Choreography = simples para flows curtos, difícil de rastrear. Orchestration = fluxo visível, ponto central de complexidade. Escolha pela complexidade do fluxo de negócio.',
    example: 'OrderSaga: Payment → Inventory → Shipping com compensating transactions em falha',
    why: 'Sem Saga, qualquer transação que cruza serviços precisa de 2PC — que não escala.',
  },
  {
    label: 'Database per service — BODS',
    trick: 'BODS: "Banco Own, Deploy Separado"',
    expansion: [['B','Banco próprio por serviço'],['O','Own — serviço é dono dos dados'],['D','Deploy independente'],['S','Sem JOIN cross-service']],
    explanation: 'Banco compartilhado elimina a autonomia fundamental. Deploy coordenado e migrations que quebram outros serviços são os sintomas.',
    example: 'Orders → Postgres, Inventory → MongoDB, Payments → Postgres (cada um isolado)',
    why: 'Dois serviços com banco compartilhado = distributed monolith. Você tem a complexidade dos dois sem os benefícios de nenhum.',
  },
  {
    label: 'Critério de microservice — D.I.',
    trick: 'D.I.: "Deploy Independente é o único critério"',
    expansion: [['D','Deploy sem coordenação'],['I','Independente de outros serviços']],
    explanation: 'Se você precisa de deploy coordenado de A e B para entregar uma feature, a fronteira está errada. Deploy Independente é a heurística definitiva.',
    example: 'Orders deploya sem avisar Inventory = microservice real. Deploy coordenado = distributed monolith.',
    why: 'Deploy coordenado é o sinal mais claro de que você não tem microservices de verdade.',
  },
  {
    label: 'Strangler Fig — P-E-D-R',
    trick: 'P-E-D-R: Proxy, Extrai, Dados separa, Remove',
    expansion: [['P','Proxy layer entre cliente e monolito'],['E','Extrai 1 BC por vez'],['D','Dados separa em fases'],['R','Remove código morto']],
    explanation: 'Migração incremental — nunca big bang. A figueira estranguladora cresce em volta da árvore original até substituí-la completamente.',
    example: 'Proxy → feature flag → novo serviço (mesmo banco) → CDC sync → banco próprio → remove',
    why: 'Big bang migration tem taxa de falha altíssima. Strangler Fig permite rollback em qualquer etapa.',
  },
]

// ── Comparative: Monolito vs Modulith vs Microservices ──────────────────────

const ARCH_OPTIONS: CompOption[] = [
  { name: 'Monolito',      color: '#94a3b8' },
  { name: 'Modulith',      color: '#f59e0b' },
  { name: 'Microservices', color: '#7E57C2' },
]

const ARCH_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Simplicidade operacional',
    values: {
      Monolito:      'Um processo, um deploy, um log — simples',
      Modulith:      'Ainda um deploy com fronteiras de módulo claras',
      Microservices: 'N serviços, N deployments, N logs — complexidade alta',
    },
    winner: 'Monolito',
  },
  {
    criterion: 'Escala independente',
    values: {
      Monolito:      'Escala o todo — vertical ou horizontal',
      Modulith:      'Ainda escala o todo mas módulos isolam pressão',
      Microservices: 'Escala apenas o serviço com gargalo — eficiente',
    },
    winner: 'Microservices',
  },
  {
    criterion: 'Autonomia de times',
    values: {
      Monolito:      'Merge conflicts, deploy coordenado, acoplamento total',
      Modulith:      'Módulos reduzem conflito; deploy ainda compartilhado',
      Microservices: 'Time é dono: banco, deploy, stack independentes',
    },
    winner: 'Microservices',
  },
  {
    criterion: 'Transações de dados',
    values: {
      Monolito:      'ACID local — uma conexão, uma transação',
      Modulith:      'ACID local com schemas separados no mesmo banco',
      Microservices: 'Sem 2PC — precisa Saga + compensating transactions',
    },
    winner: 'Monolito',
  },
  {
    criterion: 'Depuração',
    values: {
      Monolito:      'Stack trace completo, um processo, um log',
      Modulith:      'Stack trace completo com módulos bem nomeados',
      Microservices: 'Trace distribuído obrigatório — correlation-id em tudo',
    },
    winner: 'Monolito',
  },
  {
    criterion: 'Tamanho de time ideal',
    values: {
      Monolito:      '1-15 pessoas — overhead zero',
      Modulith:      '10-50 pessoas — fronteiras sem overhead de infra',
      Microservices: '50+ pessoas — overhead de operar N serviços é real',
    },
  },
  {
    criterion: 'Velocidade inicial de entrega',
    values: {
      Monolito:      'Start rápido — sem infra, sem network, sem discovery',
      Modulith:      'Igualmente rápido com módulos bem definidos',
      Microservices: 'Lento — infra, discovery, observability antes de tudo',
    },
    winner: 'Monolito',
  },
]

// ── Anti-patterns ─────────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Banco compartilhado entre serviços',
    badDesc: 'Orders e Inventory usam o mesmo banco — migration de um quebra o outro, deploy é coordenado.',
    badCode: [
      { t: '-- Orders e Inventory compartilham banco', c: '#ef4444' },
      { t: 'SELECT o.*, i.stock FROM orders o' },
      { t: '  JOIN inventory i ON o.product_id = i.id', c: '#ef4444' },
      { t: '-- Migration de inventory quebra orders direto', c: '#ef4444' },
      { t: '-- Deploy coordenado obrigatório — não é microservice', c: '#ef4444' },
    ],
    goodDesc: 'Cada serviço tem banco próprio. Integração via API ou eventos — nunca via JOIN direto.',
    goodCode: [
      { t: '// Cada serviço tem banco próprio — integra via API', c: '#4ade80' },
      { t: '// Orders Service:' },
      { t: 'const order = await ordersDB.findOrder(orderId)' },
      { t: 'const stock = await inventoryClient.getStock(order.productId)', c: '#7E57C2' },
      { t: '// Inventory Service tem banco próprio (independente)' },
    ],
    why: 'Banco compartilhado mata a autonomia fundamental. Qualquer migration afeta todos os serviços e a fronteira de Bounded Context desaparece. Você tem um distributed monolith.',
  },
  {
    title: 'Saga sem idempotência no handler',
    badDesc: 'Handler processa evento sem checar duplicata — Kafka at-least-once pode entregar o mesmo evento 2×.',
    badCode: [
      { t: '// Handler sem verificação de duplicata', c: '#ef4444' },
      { t: 'async handleOrderCreated(event) {' },
      { t: '  await payment.charge(event.amount) // pode rodar 2×!', c: '#ef4444' },
      { t: '  // Kafka at-least-once → evento pode chegar 2×', c: '#ef4444' },
      { t: '}' },
    ],
    goodDesc: 'Verificar eventId em tabela de idempotência dentro da mesma transação do efeito colateral.',
    goodCode: [
      { t: '// Verificar eventId antes de processar', c: '#4ade80' },
      { t: 'async handleOrderCreated(event) {' },
      { t: '  const exists = await idempotency.has(event.id)', c: '#4ade80' },
      { t: '  if (exists) return // ack sem reprocessar' },
      { t: '  await db.transaction(async tx => {' },
      { t: '    await payment.charge(event.amount, tx)', c: '#7E57C2' },
      { t: '    await idempotency.insert(event.id, tx) // mesma tx!', c: '#4ade80' },
      { t: '  })' },
      { t: '}' },
    ],
    why: 'Kafka garante at-least-once delivery. Sem idempotência você cobra o cliente duas vezes ou reserva estoque em duplicata.',
  },
  {
    title: 'Chamadas síncronas em cadeia (latência multiplicada)',
    badDesc: 'Chamadas sequenciais a 5 serviços somam as latências — 20ms × 5 = 100ms+ para montar uma página.',
    badCode: [
      { t: '// 5 chamadas em série = latências somadas', c: '#ef4444' },
      { t: 'const user = await userSvc.get(userId)       // 20ms' },
      { t: 'const cart = await cartSvc.get(userId)       // 20ms', c: '#ef4444' },
      { t: 'const items = await productSvc.get(cart)     // 20ms', c: '#ef4444' },
      { t: 'const tax = await taxSvc.calculate(cart)     // 20ms', c: '#ef4444' },
      { t: '// Total: 80ms+ para montar a página', c: '#ef4444' },
    ],
    goodDesc: 'Paralelizar chamadas independentes com Promise.all — latência vira máximo, não soma.',
    goodCode: [
      { t: '// Paralelizar chamadas independentes', c: '#4ade80' },
      { t: 'const [user, cart] = await Promise.all([' },
      { t: '  userSvc.get(userId), cartSvc.get(userId)', c: '#7E57C2' },
      { t: '])' },
      { t: 'const [items, tax] = await Promise.all([' },
      { t: '  productSvc.get(cart), taxSvc.calculate(cart)', c: '#7E57C2' },
      { t: '])' },
      { t: '// Total: 40ms em vez de 80ms', c: '#4ade80' },
    ],
    why: 'Chamadas síncronas em série multiplicam latência — N serviços × latência média = UX horrível. Use async (eventos) para fluxos não interativos.',
  },
  {
    title: 'Deploy coordenado — distributed monolith',
    badDesc: 'Deploy de Orders exige avisar Inventory e Payments, com janela de manutenção — não é microservice.',
    badCode: [
      { t: '// Para deploy de Orders, você precisa:', c: '#ef4444' },
      { t: '// 1. Avisar time de Inventory (compartilham banco)', c: '#ef4444' },
      { t: '// 2. Avisar time de Payments (API sem versioning)', c: '#ef4444' },
      { t: '// 3. Janela de manutenção de 2h às 2am', c: '#ef4444' },
      { t: '// Microservices no nome apenas', c: '#ef4444' },
    ],
    goodDesc: 'Orders deploya sozinho: banco próprio, API versionada, backward compatible, contract tests no CI.',
    goodCode: [
      { t: '// Critério: Orders deploya sozinho?', c: '#4ade80' },
      { t: '// ✓ Banco próprio (sem migration coordenada)', c: '#4ade80' },
      { t: '// ✓ API versionada (/v1/orders vs /v2/orders)', c: '#4ade80' },
      { t: '// ✓ Backward compatible (adiciona campos, não remove)', c: '#4ade80' },
      { t: '// ✓ Contract tests (Pact) garantem consumers OK', c: '#4ade80' },
      { t: '// Se não: revisar a fronteira, não o processo de deploy', c: '#7E57C2' },
    ],
    why: 'Deploy coordenado é o sintoma mais claro de distributed monolith. A solução é corrigir a fronteira — não o processo de deploy.',
  },
  {
    title: 'Microservice por entidade (anemic services)',
    badDesc: 'Serviços criados por tabela de banco — cada feature cruza 5 "serviços" com N chamadas de rede.',
    badCode: [
      { t: '// Serviços criados por tabela, não por domínio', c: '#ef4444' },
      { t: 'GET /user-service/users/123         // CRUD User' },
      { t: 'GET /product-service/products/456   // CRUD Product', c: '#ef4444' },
      { t: '// Cada feature cruza 5 "serviços"', c: '#ef4444' },
      { t: '// N chamadas de rede = distributed monolith', c: '#ef4444' },
    ],
    goodDesc: 'Serviço por Bounded Context — regra de negócio coesa, uma feature → um serviço → um deploy.',
    goodCode: [
      { t: '// Serviço por Bounded Context — regra de negócio coesa', c: '#4ade80' },
      { t: '// Order Context: Orders + Cart + Pricing + Promos' },
      { t: 'POST /order-service/orders           // cria pedido', c: '#7E57C2' },
      { t: '// Inventory Context: Warehouse + Stock + Reservations' },
      { t: 'POST /inventory-service/reservations // reserva', c: '#7E57C2' },
      { t: '// Uma feature → um serviço → um deploy', c: '#4ade80' },
    ],
    why: 'Serviço por entidade faz cada feature cruzar N serviços. Bounded Context coloca junto o que muda junto — coesão de domínio determina a fronteira certa.',
  },
]

// ── Mindmap ───────────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Fundamentos',
    color: C,
    items: [
      { t: 'Database per service', k: true },
      { t: 'Deploy independente', k: true },
      { t: 'Fronteira = Bounded Context', k: true },
      { t: 'Falha isolada (não cascata)', k: true },
      { t: 'Microservice ≠ pequeno em LOC' },
    ],
  },
  {
    label: 'Comunicação',
    color: '#38bdf8',
    items: [
      { t: 'REST sync (interativo, leitura)', k: true },
      { t: 'gRPC (performance interna)' },
      { t: 'Kafka/RabbitMQ async (eventos)', k: true },
      { t: 'API Gateway + BFF', k: true },
      { t: 'Service Discovery (K8s DNS)' },
    ],
  },
  {
    label: 'Transações Distribuídas',
    color: '#f59e0b',
    items: [
      { t: 'Sem 2PC — usa Saga', k: true },
      { t: 'Saga Choreography (eventos)', k: true },
      { t: 'Saga Orchestration (coordenador)', k: true },
      { t: 'Outbox Pattern (never lose event)', k: true },
      { t: 'Idempotência obrigatória (at-least-once)', k: true },
    ],
  },
  {
    label: 'Resiliência (CBRT)',
    color: '#ef4444',
    items: [
      { t: 'Circuit Breaker (fail-fast)', k: true },
      { t: 'Bulkhead (pool isolation)' },
      { t: 'Retry + backoff + jitter', k: true },
      { t: 'Timeout em toda chamada remota', k: true },
      { t: 'Fallback definido (cache stale)' },
    ],
  },
  {
    label: 'Observabilidade (LMT)',
    color: '#a78bfa',
    items: [
      { t: 'Logs JSON + correlation-id', k: true },
      { t: 'Metrics: Prometheus + Grafana', k: true },
      { t: 'Traces: OpenTelemetry + Jaeger', k: true },
      { t: 'SLI/SLO/Error Budget', a: true },
      { t: 'Alertas em SLO, não métricas brutas' },
    ],
  },
  {
    label: 'Migração: Strangler Fig',
    color: '#4ade80',
    items: [
      { t: 'Modularize o monolito primeiro', k: true },
      { t: 'Proxy layer antes de extrair', k: true },
      { t: 'Extrai 1 BC por vez (menos acoplado)', k: true },
      { t: 'Schema → DB separation em fases' },
      { t: 'Feature flags + rollout gradual' },
    ],
  },
  {
    label: 'Anti-patterns',
    color: '#ef4444',
    items: [
      { t: 'Serviço por entidade/tabela', k: true },
      { t: 'Banco compartilhado', k: true },
      { t: 'Deploy coordenado', k: true },
      { t: 'Sem observability', k: true },
      { t: 'Big bang migration' },
    ],
  },
  {
    label: 'Testes',
    color: '#94a3b8',
    items: [
      { t: 'Unit (lógica de domínio)', k: true },
      { t: 'Component (serviço isolado)' },
      { t: 'Contract (Pact)', a: true },
      { t: 'E2E mínimo em staging' },
      { t: 'Chaos engineering', a: true },
    ],
  },
  {
    label: 'Quando NÃO usar',
    color: '#f59e0b',
    items: [
      { t: 'Time < 10 pessoas', k: true },
      { t: 'Domínio indefinido (pré-PMF)', k: true },
      { t: 'Sem DevOps/SRE maduro', k: true },
      { t: 'Monolito funciona sem gargalo', k: true },
      { t: 'Cargo cult "Netflix usa"' },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Consigo definir o Bounded Context do serviço sem hesitar?',
  'Cada serviço tem banco próprio (sem JOIN cross-service)?',
  'Deploy do serviço A não requer coordenar com o serviço B?',
  'Há correlation-id propagado em todos os headers internos?',
  'Logs são em JSON estruturado com correlation-id?',
  'Há trace distribuído (OpenTelemetry) configurado?',
  'Circuit Breaker em toda chamada a serviço externo?',
  'Timeout configurado em todo HTTP/gRPC client?',
  'Handlers de evento têm idempotência implementada?',
  'Outbox Pattern garante que eventos nunca se perdem?',
  'Saga tem compensating transactions para cada falha possível?',
  'API versioning permite deploy sem breaking change?',
  'Contract tests (Pact) rodam no CI antes do deploy?',
  'readinessProbe correto no K8s (pod só recebe tráfego pronto)?',
  'PodDisruptionBudget configurado para rolling update seguro?',
  'SLI/SLO definidos com error budget e alertas em cima deles?',
  'Migração usa Strangler Fig (nunca big bang)?',
  'Decisão de microservices é baseada em dor real (não cargo cult)?',
  'Time tem maturidade DevOps (CI/CD, K8s, observability)?',
  'Modulith foi considerado antes de microservices?',
]

// ── Cheatsheet de Padrões ─────────────────────────────────────────────────────

const PATTERN_ITEMS: PatternItem[] = [
  {
    name: 'Saga (Choreography)',
    code: 'OrderCreated → PaymentProcessed → StockReserved → Dispatched',
    desc: 'Serviços reagem a eventos sem coordenador. Flows curtos: fácil de implementar, difícil de rastrear.',
  },
  {
    name: 'Saga (Orchestration)',
    code: 'Orchestrator → charge() → reserve() → dispatch() | refund()',
    desc: 'Orquestrador explícito coordena a saga. Flows longos: mais claro mas cria ponto central.',
  },
  {
    name: 'Outbox Pattern',
    code: 'tx: INSERT order + INSERT outbox(event) → relay publishes',
    desc: 'Evento inserido na mesma transação. Relay garante que nunca se perde mesmo em crash.',
  },
  {
    name: 'Circuit Breaker',
    code: 'CLOSED → OPEN(fail-fast) → HALF_OPEN(probe) → CLOSED',
    desc: 'Monitora taxa de falha. Abre (fail-fast) quando > threshold. Obrigatório em toda chamada downstream.',
  },
  {
    name: 'Strangler Fig',
    code: 'Proxy → feature flag → novo serviço → remove monolito',
    desc: 'Extração incremental: proxy layer + 1 BC por vez + schema separation. Nunca big bang.',
  },
  {
    name: 'API Gateway + BFF',
    code: 'Client → Gateway(auth+rate) → [orders, inventory, payments]',
    desc: 'Ponto de entrada único: auth, rate limit, routing. BFF = gateway especializado por cliente.',
  },
  {
    name: 'Database per Service',
    code: 'Orders→Postgres | Inventory→MongoDB | Payments→Postgres',
    desc: 'Cada serviço tem banco próprio. Integração via API ou eventos — nunca via JOIN direto.',
  },
  {
    name: 'Idempotência no Handler',
    code: 'tx: check eventId → process → insert eventId (atomic)',
    desc: 'Verificar eventId na mesma transação do efeito colateral. Obrigatório com Kafka at-least-once.',
  },
]

// ── Builders ─────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Microservices',
    stackLabel: 'Arquitetura',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Microservices',
    stackLabel: 'Arquitetura',
  }),
  comparative: () => buildComparativeRefPdf({
    options: ARCH_OPTIONS,
    criteria: ARCH_CRITERIA,
    skillName: 'Microservices',
    accentColor: C,
    stackLabel: 'Arquitetura',
    scenarios: [
      { scenario: 'Startup / time pequeno (< 10 devs)', recommendation: 'Monolito', reason: 'Overhead zero, velocidade máxima, fácil de debugar.' },
      { scenario: 'Time médio com domínio em evolução (10-50 devs)', recommendation: 'Modulith', reason: 'Fronteiras de módulo sem overhead de infra. Facilita extração futura.' },
      { scenario: 'Empresa grande com múltiplos times (50+ devs)', recommendation: 'Microservices', reason: 'Quando dor justifica custo: deploy bloqueado, escala distinta, autonomia necessária.' },
      { scenario: 'Migração incremental de monolito', recommendation: 'Strangler Fig', reason: 'Modulith como estado intermediário — nunca big bang.' },
    ],
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Microservices',
    stackLabel: 'Arquitetura',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Microservices',
    stackLabel: 'Arquitetura',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Microservices',
    accentColor: C,
    stackLabel: 'Arquitetura',
    sections: {
      hooks: [],
      depRows: [],
      rules: [],
      performanceTips: [
        'Database per service — sem exceção, não negocie',
        'Idempotência em todo handler de evento (at-least-once)',
        'Outbox Pattern garante que evento nunca se perde',
        'Circuit Breaker + Timeout em toda chamada downstream',
        'Correlation-id propagado em todos os headers internos',
        'readinessProbe correto — pod só recebe tráfego quando pronto',
        'Strangler Fig para migração — nunca big bang',
      ],
      patterns: PATTERN_ITEMS,
      mentalModels: [
        'Microservice = Bounded Context, não entidade de banco',
        'Deploy independente é o critério definitivo — não o tamanho',
        'Banco compartilhado = distributed monolith (pior dos dois)',
        'Saga substitui 2PC — idempotência torna at-least-once seguro',
        'Observabilidade é infra obrigatória, não feature opcional',
        'Monolito modular resolve 90% dos casos sem o custo operacional',
      ],
    },
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function MicroservicesPdfs() {
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
