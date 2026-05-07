'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'

// ── Paleta Tradeoff Analysis ────────────────────────────────────────────────────
const C    = '#8b5cf6'   // roxo — arquitetura — NUNCA omitir, default seria cyan React
const GRN  = '#22c55e'
const RED  = '#ef4444'
const AMB  = '#f59e0b'
const SKY  = '#38bdf8'
const ORG  = '#f97316'
const BLU  = '#3b82f6'

// ── Metadados dos PDFs ──────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre decisões técnicas em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: como estruturar tradeoff em entrevista, build vs buy, monolito vs microserviços, reversibilidade de decisões, ADRs, PACELC, lock-in de vendor, quantificação de custo de complexidade e tudo que entrevistadores de arquitetura sênior realmente perguntam.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Dimensões, heurísticas e ADR em referência rápida',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: 9 dimensões de comparação, framework two-way vs one-way door, heurística build vs buy, estrutura de ADR, matrix Likelihood × Impact e as falácias mais comuns com como detectá-las.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam Tradeoff Analysis na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'As 9 dimensões de comparação, reversibilidade (two-way vs one-way), estrutura de resposta em entrevista (COS), as 5 falácias comuns e as 4 seções do ADR.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
]

// ── Dados: Q&A ──────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Como você estrutura uma análise de tradeoff em entrevista?',
    a: 'Framework COS: (1) Contexto — clarifico o que é crítico (latência? custo? time-to-market?); (2) Opções — listo opções plausíveis com prós/contras nas dimensões que importam. Quantifico quando possível — número ganha de opinião; (3) Sacrifício — escolho com o sacrifício explícito nomeado: "escolho X, sacrificando Y, e revisito quando Z acontecer". O entrevistador quer ver o S — não fingir que há solução perfeita. Toda decisão técnica tem custo — a maturidade está em identificá-lo explicitamente.',
    tip: 'O passo mais importante é nomear o sacrifício. Candidatos que respondem "escolhi X porque é melhor" sem nomear o que abriram mão não demonstram senioridade. Entrevistador quer ver que você conhece os tradeoffs da sua escolha.',
  },
  {
    level: 'Senior',
    q: 'O que é reversibilidade de decisão e como ela impacta o processo de decisão?',
    a: 'Bezos: two-way vs one-way doors. Two-way door (reversível) = custo de reverter é baixo (dias ou semanas). Ex: framework de teste, biblioteca de validação, config de lint. Decisão: decida em horas, execute, reverta se necessário. One-way door (irreversível) = custo de reverter é alto (meses ou anos). Ex: banco de dados, cloud provider, schema de dados core. Decisão: debate profundo, explore alternativas, documente em ADR. Erro mais comum: tratar two-way door como one-way door → análise paralisia. E tratar one-way door como two-way door → decisão precipitada.',
    tip: 'A distinção two-way vs one-way é o framework mais elegante para justificar quando debater muito e quando decidir rápido. "Debate eterno sobre framework de teste é two-way door mal classificado" é uma observação que demonstra experiência.',
  },
  {
    level: 'Senior',
    q: 'Como você decide entre Build vs Buy?',
    a: 'Comparo custo total de propriedade de 3 anos: build (dev time inicial + manutenção + on-call + oportunidade perdida) vs buy (licença + integração + lock-in). Heurística: se não é core competitive advantage, compra. Time deve gastar energia onde diferencia o produto. Build de auth, billing, monitoring, e-mail quase sempre dá prejuízo — esses domínios têm edge cases de segurança que vendor especializado resolve melhor. Build faz sentido quando: é o produto em si (search engine no Google), vendor lock-in é inaceitável, nenhum SaaS cobre o requisito exato, ou compliance exige controle total dos dados.',
    tip: 'O argumento de oportunidade perdida (features que o time não entrega enquanto constrói auth) é o que demonstra pensamento de negócio. Vendedor especializado frequentemente tem segurança superior para auth/billing — isso é contraintuitivo mas verdadeiro para times pequenos.',
  },
  {
    level: 'Senior',
    q: 'Conta uma decisão que você tomou e revisitou depois.',
    a: 'Comecei com MongoDB achando que schema variaria muito. 1 ano depois, schema estabilizou e falta de transação multi-documento virou dor: relatório inconsistente, dificuldade de reportar para contabilidade. Migrei para Postgres com dual-write + backfill — custou 3 meses. Lição: o tradeoff "certo" mudou porque o contexto mudou (schema estabilizou, requisito de relatório surgiu). ADR original ajudou a justificar a migração para o time novo. Hoje, default é Postgres até prova em contrário. Ponto de maturidade: revisitar não é fraqueza — é o processo funcionando.',
    tip: 'A história deve mostrar que a decisão inicial foi sólida (não imprudência), o contexto mudou, e você teve humildade de revisitar. O ADR original que ajudou na migração é o detalhe que demonstra processo maduro.',
  },
  {
    level: 'Senior',
    q: 'O que é um ADR e quando criar um?',
    a: 'ADR (Architecture Decision Record): contexto (por que a decisão foi necessária, com números), decisão (o que foi escolhido e por quê), alternativas rejeitadas (e por que cada uma foi descartada), consequências (positivas e negativas, e quando revisitar). Crio quando: mudança de banco, cloud provider, autenticação; decisão que afeta múltiplos times; one-way door com custo significativo de reversão; quando "por que fizemos assim?" vai ser perguntado daqui a 6 meses. A seção mais valiosa: alternativas rejeitadas — captura o raciocínio, não só o resultado.',
    tip: '"Alternativas rejeitadas são a seção mais valiosa" é o insight que demonstra que você usa ADR de verdade. Sem ela, o ADR é só changelog. O raciocínio é o que permite revisitar a decisão 12 meses depois quando o contexto mudou.',
  },
  {
    level: 'Senior',
    q: 'Quais são as falácias mais comuns em decisões técnicas?',
    a: 'Cargo cult: "Netflix usa X" — contexto de volume/time/expertise diferente. Shiny new tech: tecnologia nova sem histórico de produção. Sunk cost: "já investimos demais para mudar" — investimento passado não é variável da decisão futura. Early optimization: escalar problema que não existe (microserviços sem problema real de escala). Preferência pessoal disfarçada de técnica: "MongoDB é tecnicamente superior" quando só conheço MongoDB. Análise paralisia: debate eterno em decisão reversível barata. Reconhecer no próprio raciocínio é o que diferencia maturidade.',
    tip: 'Reconhecer falácias no próprio raciocínio é raro e impressionante. O ponto sobre sunk cost é o mais prático: enquadrar como "custo futuro, não passado" resolve o debate.',
  },
  {
    level: 'Senior',
    q: 'Monolito vs Microserviços — quando cada um faz sentido?',
    a: 'Monolito faz sentido quando: time pequeno (< 15 devs), produto em descoberta (requisitos mudam), domínio mal compreendido, infra de observabilidade limitada. Velocidade de entrega é maximizada — um deploy, uma base de código, JOINs no banco. Microserviços fazem sentido quando: times independentes que precisam de autonomia de deploy, SLAs muito diferentes entre componentes, escala diferente (search vs payment), tecnologias diferentes por domínio. Armadilha mais comum: microserviços prematuros quando domínio ainda não está bem definido — corrigir fronteira entre microserviços é 10x mais caro que refatorar dentro de monolito. Padrão: monolito modular → extrair quando necessidade concreta.',
    tip: '"Monolito modular → extrair quando necessidade concreta" é a resposta que demonstra maturidade. Muitos candidatos defendem microserviços desde o início sem articular o custo de fronteira errada.',
  },
  {
    level: 'Senior',
    q: 'Como você quantifica o custo de complexidade técnica?',
    a: 'Complexidade tem custos mensuráveis: tempo de onboarding (monolito: 2 semanas; 15 microserviços: 6 semanas → 4 semanas × salário do sênior que faz onboarding), debugging (bug em monolito: 1h; sistema distribuído sem tracing: 8h → multiplicar pela frequência), testes (integração de sistema distribuído tem setup 5x mais complexo → menos cobertura), cognitive load (manifesta em PRs mais lentos, bugs de integração). Não precisa ser preciso — estimativa de ordem de magnitude (10x vs 2x mais caro) já elimina a maioria dos debates.',
    tip: 'Quantificar em tempo de onboarding e debugging é raro e demonstra rigor. A maioria fala de complexidade de forma qualitativa. Mesmo estimativas rough são mais convincentes que opinião.',
  },
  {
    level: 'Senior',
    q: 'Como você analisa lock-in de vendor em decisões de cloud?',
    a: 'Lock-in existe em grau — objetivo não é zero (impraticável), mas lock-in consciente com plano de saída avaliado. Tipos por reversibilidade: commodity com equivalência (S3 → GCS → Azure Blob) = baixo lock-in real, troca é config; serviços com diferenças (RDS Aurora → Cloud SQL) = dados portáveis via dump, mas otimizações não migram; sem equivalência (Step Functions, DynamoDB com features específicas) = reescrever integração; orquestração proprietária (CloudFormation vs Terraform) = reescrever IaC inteiro. Mitigação: Terraform em vez de CloudFormation, Docker para runtime, separar lógica de negócio de SDK de cloud.',
    tip: 'Classificar lock-in por grau de reversibilidade é mais útil que "evite lock-in". Mostrar que zero lock-in é impraticável e que o objetivo é lock-in consciente é o que demonstra pensamento pragmático.',
  },
  {
    level: 'Senior',
    q: 'O que é PACELC e por que é mais útil que o CAP theorem na prática?',
    a: 'CAP: em partição de rede (P) escolha Consistência (C) ou Disponibilidade (A). Problema: a maioria dos sistemas não tem partição o tempo todo — o que acontece na normalidade? PACELC estende: P → A/C (como CAP); E (else, sem partição) → L (latência) ou C (consistência). Na normalidade, você troca latência por consistência. Exemplos: DynamoDB: PA/EL (partição: disponível, normalidade: baixa latência, eventual consistency). PostgreSQL síncrono: PC/EC (partição: consistente, normalidade: consistente com maior latência). PACELC é mais útil porque explicita o custo de consistência no caso normal — quando a maioria das requisições acontece.',
    tip: 'PACELC além do CAP demonstra que você leu além do básico. A explicação de que o custo real de consistência é latência na operação normal é o insight-chave que a maioria dos candidatos não conhece.',
  },
  {
    level: 'Pleno',
    q: 'Como você decide sobre sincronismo vs assincronismo entre serviços?',
    a: 'Critério principal: o chamador precisa da resposta para continuar? Síncrono (HTTP/gRPC): resultado necessário imediatamente para a resposta do usuário. Ex: autenticação, consulta de saldo. Tradeoff: acoplamento temporal (se B cai, A falha), latência somada. Assíncrono (filas/eventos): operação pode ser feita depois sem impactar usuário. Ex: e-mail, processamento de imagem, analytics. Tradeoff: eventual consistency, idempotência obrigatória, DLQ para retry, debugging mais complexo. Híbrido: o mais prático — request HTTP responde imediatamente (202 Accepted), processa async em background, notifica via webhook ou polling.',
    tip: 'O padrão híbrido (responde 202 + processa async) é o que sistemas reais de produção usam. Demonstra experiência prática além do whiteboard.',
  },
  {
    level: 'Pleno',
    q: 'Quando uma decisão técnica "errada" é aceitável?',
    a: 'Quando custo de acertar agora > custo de mudar depois. Em MVP, escolho a stack que o time conhece, mesmo que não seja "ideal" — entrega rápida importa mais que arquitetura perfeita quando você ainda não tem product-market fit. Em decisão reversível (two-way door), prefiro "good enough now" a "perfect later". O debate eterno sobre decisões fáceis de reverter é custo real de engenheiro desperdiçado. One-way door merece mais cuidado upfront porque mudar é caro — banco, schema core, cloud provider merecem análise e ADR.',
    tip: 'Two-way vs one-way door é o framework elegante para justificar quando "errar" é estratégico. Mostra gestão de risco, não só engenharia.',
  },
  {
    level: 'Senior',
    q: 'Como você decide sobre REST vs GraphQL?',
    a: 'REST faz sentido quando: clientes homogêneos (só mobile ou só web), recursos bem definidos, caching por URL é importante (CDN, browser), equipe sem experiência em GraphQL. GraphQL faz sentido quando: múltiplos clientes com necessidades de dados muito diferentes, evitar overfetching/underfetching, schema evolution sem versioning. Problemas do GraphQL a nomear: N+1 queries (sem DataLoader), depth limiting necessário (proteção DoS), caching complexo (não por URL), authorization por campo trabalhosa, tooling e expertise mais escassa. Meu padrão: REST interno entre microserviços, GraphQL apenas com consumidores externos heterogêneos.',
    tip: 'Nomear os problemas do GraphQL (N+1, depth limit, caching) é o que demonstra produção real. Candidatos que só falam dos benefícios não operaram GraphQL em escala.',
  },
  {
    level: 'Pleno',
    q: 'Como você decide o nível de disponibilidade (SLA) de um sistema?',
    a: 'Cada 9 de disponibilidade tem custo e complexidade exponencialmente maiores: 99% = 87h downtime/ano, 99.9% = 8.7h, 99.99% = 52min. Processo: (1) qual o custo de 1h de downtime? (revenue + SLA penalty + support + reputação); (2) multiplicar pelo downtime esperado por nível; (3) comparar com o custo incremental de subir de 99.9% para 99.99% (Multi-AZ → Multi-Region, active-active, chaos engineering). Armadilha: pedir 99.99% sem plano concreto — Multi-Region active-active pode custar 3-5x mais em infra e eng time.',
    tip: 'Custo financeiro de cada nível transforma a discussão técnica em decisão de negócio. Candidatos que falam de 9s sem mencionar custo não demonstram maturidade de sistema real.',
  },
  {
    level: 'Senior',
    q: 'Como você convence um time que prefere outra tecnologia?',
    a: 'Não tento "ganhar" — busco alinhar critérios. Pergunto o que é crítico (latência? familiaridade? custo?), proponho POC pequeno comparando sob esses critérios, deixo o número falar. Se mesmo assim divergem, ADR registra a decisão com alternativas e razões. Às vezes você perde a discussão e é melhor assim — diversidade de opinião captura blind spots. O importante é decisão informada, não "minha proposta venceu". Anti-padrão: tentar convencer sem entender a objeção. Objeção técnica frequentemente esconde preocupação sobre familiaridade, risco de carreira ("e se não funcionar?") ou experiência ruim anterior.',
    tip: '"Às vezes você perde e é melhor assim" é sofisticado. Mostra que você coloca resultado do time acima do ego. Entrevistadores de liderança técnica adoram essa perspectiva.',
  },
  {
    level: 'Senior',
    q: 'Quais os sinais de que uma decisão de arquitetura foi prematura?',
    a: 'Microserviços sem time dedicado: cada serviço precisa de deploy, CI/CD, monitoring, logging próprios — sem infra e time, cria complexidade sem benefício. Event sourcing sem requisito de auditoria: projeções, replay, snapshots — complexidade que só vale se auditoria ou time-travel de estado for requisito real. Message queue para 1K requests/dia: overhead não justificado. Sharding antes de 100GB: cache e índice resolvem, sharding adiciona complexidade de query enorme. Critério prático: "Temos o problema que essa complexidade resolve agora?" Se "vamos ter mas não temos" — espere até ter.',
    tip: 'Os exemplos concretos demonstram experiência real com over-engineering. A pergunta "temos o problema agora?" é o filtro que muitos times precisam ouvir de um sênior.',
  },
  {
    level: 'Pleno',
    q: 'Como você documentaria uma decisão de não fazer algo?',
    a: 'Decisões de exclusão são tão importantes quanto de adoção, mas raramente documentadas. Mesmo formato de ADR, mas a "Decisão" é a exclusão explícita. Exemplo: "Decisão: NÃO migrar para microserviços no Q1/Q2. Contexto: time de 8 devs, domínio ainda evoluindo (3 pivots em 12 meses), infra de observabilidade inexistente. Consequências positivas: time mantém velocity. Consequências negativas: monolito crescerá em complexidade. Revisitar quando: domínio estabilizar E time > 15 devs." Sem ADR de exclusão, 6 meses depois alguém propõe a mesma coisa e o time reprocessa a mesma decisão.',
    tip: '"Decisões de exclusão" são o ponto cego da maioria dos times. Documentar "não fazer" com o mesmo rigor que "fazer" é maturidade de processo incomum.',
  },
  {
    level: 'Senior',
    q: 'Como você decide sobre SQL vs NoSQL?',
    a: 'Por dimensões críticas do caso de uso. SQL quando: JOINs complexos ou frequentes, transações ACID requisito (financeiro, estoque), schema estável, team experience em SQL, relatórios ad-hoc necessários, volume dentro da capacidade de um nó gerenciado (< 5TB, < 50K writes/s). NoSQL quando: schema genuinamente variável (não "pode mudar" — VARIA de registro para registro), escala horizontal de escrita > 100K writes/s, access patterns previsíveis upfront (DynamoDB), dados naturalmente documentados sem relacionamentos complexos. Erro comum: NoSQL "para escalar" quando o volume cabe facilmente em Postgres + RDS. Postgres + RDS Multi-AZ com read replica aguenta 99% dos sistemas.',
    tip: '"Postgres + RDS aguenta 99% dos sistemas" é afirmação forte e verdadeira. Candidatos que defendem NoSQL por padrão sem quantificar o problema cometem early optimization.',
  },
  {
    level: 'Senior',
    q: 'Como você avalia o impacto de um tradeoff na segurança?',
    a: 'Segurança entra como dimensão em qualquer análise de tradeoff. Dimensões: superfície de ataque (a opção A expõe mais endpoints? mais permissões IAM?), ownership de segurança (SaaS tem equipe dedicada; self-hosted você é responsável por patches), compliance (a opção facilita ou dificulta LGPD, PCI-DSS, SOC 2?), blast radius (se comprometida, qual o impacto?). Para auth, billing, sistemas com dados PCI/PII: vendor especializado geralmente é mais seguro que self-managed para times sem AppSec dedicado. Cada adição à superfície deve ser justificada pelo valor entregue.',
    tip: 'Incluir segurança como dimensão de tradeoff (não como checklist separado) demonstra visão integrada. "SaaS mais seguro que self-managed para times pequenos" é contraintuitivo mas verdadeiro e impressiona.',
  },
  {
    level: 'Pleno',
    q: 'Como você lida com a falácia do sunk cost em decisões técnicas?',
    a: 'Sunk cost: tendência de continuar em decisão ruim porque "já investimos muito". A falácia: investimento passado não é recuperável — não é variável da equação futura. Enquadramento correto: "Daqui para frente, qual caminho tem menor custo total?" O que foi gasto ontem não aparece nessa equação. Se continuar custará R$100K e migrar custará R$30K, você migra — independente de já ter gasto R$200K. Na prática: quando encontro resistência baseada em investimento passado, trago o enquadramento de custo futuro vs custo de migração com números. Elimina o argumento emocional.',
    tip: '"Custo futuro, não custo passado" é a forma operacional de lidar com sunk cost. Trazer números para a discussão é o que elimina o argumento emocional.',
  },
  {
    level: 'Senior',
    q: 'Como você decide sobre adotar uma tecnologia nova sem histórico em produção?',
    a: 'Framework de avaliação: (1) Necessidade real vs hype: existe problema real que essa tecnologia resolve melhor que alternativas comprovadas? Se não, é hype. (2) Sinais de maturidade: ≥3 anos de existência, empresa de referência usando em escala similar, postmortems públicos disponíveis, Stack Overflow answers, hiring pool razoável. (3) Risco de abandono: mantido por empresa ou fundação estável? Alternativa se abandonado? (4) Custo de saída: migrar em 2 anos, quanto custaria? Estratégia: POC isolado → serviço não-crítico em produção → expandir se problemas reais < benefícios. Nunca adotar em sistema crítico sem histórico interno.',
    tip: 'Postmortems públicos (não só estrelas no GitHub) é o sinal de maturidade que candidatos menos experientes não mencionam. O framework de 4 passos é actionable e demonstra processo.',
  },
]

// ── Dados: CheatSheet ────────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: '💰 Custo (TCO)', sig: 'Dev time + infra + operacional + oportunidade perdida', desc: 'Salário é o custo dominante. "Grátis" não existe — SaaS vs self-hosted: some meses de eng para operar.' },
  { name: '⚡ Latência / Performance', sig: 'p50 / p95 / p99 — meça antes de otimizar', desc: 'A maioria dos sistemas não tem problema de performance real. Otimizar antes de medir é early optimization.' },
  { name: '🔀 Throughput / Escala', sig: 'Capacidade atual vs esperada com margem de 10x', desc: 'Superestimar escala é o over-engineering mais caro. Postgres + RDS aguenta 99% dos sistemas.' },
  { name: '🛡️ Disponibilidade', sig: '99% = 87h/ano, 99.9% = 8.7h, 99.99% = 52min', desc: 'Cada 9 adicional é ordem de magnitude de custo e complexidade. Calcule ROI antes de exigir 99.99%.' },
  { name: '⚙️ Complexidade operacional', sig: 'Quem vai operar? O time sabe? On-call é custo real', desc: 'Kafka, Cassandra, Kubernetes têm curva operacional enorme. Time sem expertise = risco de produção.' },
  { name: '🚀 Time-to-market', sig: 'Stack conhecida > stack ideal com curva de 6 meses', desc: 'Em fase de validação, entregar rápido vale mais que arquitetura perfeita.' },
  { name: '🔄 Reversibilidade', sig: 'Two-way door: decide rápido. One-way door: debate fundo', desc: 'Custo de reversão define o nível de rigor necessário. Banco de dados = one-way. Framework de teste = two-way.' },
  { name: '🔐 Segurança', sig: 'Superfície de ataque, ownership, compliance, blast radius', desc: 'SaaS frequentemente mais seguro que self-managed para times sem AppSec. Cada endpoint público é superfície.' },
  { name: '👥 Fit com time', sig: 'Curva de aprendizado é custo de oportunidade real', desc: 'Go "melhor" que Java, mas time é Java → Go custa 6 meses de produtividade. Time trumps "melhor".' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'Cargo cult: "Netflix usa X" — contexto de volume/time/expertise diferente' },
  { ok: false, t: 'Sunk cost: "já investimos demais" — investimento passado não é variável da decisão futura' },
  { ok: false, t: 'Análise paralisia em two-way door — decidir em 1h é suficiente' },
  { ok: false, t: 'Over-engineering para escala que não existe — microserviços antes do problema real' },
  { ok: false, t: 'Preferência pessoal disfarçada de técnica — teste se ainda escolheria com o problema X' },
  { ok: true, t: 'Quantificar antes de decidir — número ganha de opinião' },
  { ok: true, t: 'Nomear o sacrifício explicitamente — toda decisão tem custo' },
  { ok: true, t: 'Pensar no plano de saída — revela acoplamento oculto' },
  { ok: true, t: 'ADR para one-way doors — captura raciocínio, não só resultado' },
  { ok: true, t: 'Revisitar quando o contexto muda — não é fraqueza, é processo' },
]

// ── Dados: Mnemônicos ───────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Dimensões de Tradeoff — "Custo Lento Traz Disponibilidade, Cuidado Segurança Oferece Melhores"',
    trick: 'C-L-T-D-C-S-O-M — 8 dimensões',
    expansion: [
      ['C = Custo (TCO)', 'Dev + infra + operacional + oportunidade. Salário é dominante.'],
      ['L = Latência', 'p50/p95/p99. Meça antes de otimizar.'],
      ['T = Throughput', 'Capacidade atual vs esperada. Margem de 10x geralmente suficiente.'],
      ['D = Disponibilidade', 'SLA exigido. Cada 9 = 10x de custo e complexidade.'],
      ['C = Complexidade ops.', 'Quem opera? Sabe operar? On-call é custo real.'],
      ['S = Segurança', 'Superfície, ownership, compliance, blast radius.'],
      ['O = Observabilidade', 'Sem observability, microserviços são caixas-pretas.'],
      ['M = Match com time', 'Curva de aprendizado = meses de productivity perdida.'],
    ],
    explanation: 'Para cada decisão, avalie as dimensões que são críticas no contexto. Não há dimensão sempre mais importante — depende do momento e do problema.',
    example: 'Startup em validação: time-to-market > latência. Sistema financeiro: disponibilidade = consistência > custo.',
    why: 'Saber nomear todas as dimensões relevantes demonstra análise sistemática, não opinião. Quantificar as mais críticas elimina 80% dos debates.',
  },
  {
    label: 'Reversibilidade — "Two-Way Rápido, One-Way Profundo, ADR Necessário"',
    trick: 'TROAM — two-way = rápido, one-way = análise + ADR',
    expansion: [
      ['T = Two-way', 'Reversível em dias/semanas: decide em horas, executa'],
      ['R = Rápido', 'Não debater mais de 1-2h. Decidir e seguir.'],
      ['O = One-way', 'Irreversível ou caro de reverter: debate profundo'],
      ['A = Análise', 'Quantificar, explorar alternativas, POC se necessário'],
      ['M = ADR Necessário', 'Documentar contexto + decisão + alternativas + quando revisitar'],
    ],
    explanation: 'A maioria dos debates interináveis é sobre decisões two-way door sendo tratadas como one-way door. A classificação correta antes de debater economiza dias de reunião.',
    example: 'Framework de teste = two-way: 1h de debate no máximo. Banco de dados principal = one-way: 1 semana de análise + ADR.',
    why: 'É o framework mais elegante para justificar quando debater muito e quando decidir rápido. Bezos usou isso para dimensionar decisões na Amazon.',
  },
  {
    label: 'Resposta em entrevista — "Contexto, Opções, Sacrifício"',
    trick: 'COS — o que define uma resposta sênior',
    expansion: [
      ['C = Contexto', 'O que é crítico AQUI? Latência? Custo? Time-to-market? Scale?'],
      ['O = Opções', 'Listo plausíveis com prós/contras nas dimensões que importam'],
      ['S = Sacrifício', '"Escolho X, sacrificando Y, revisito quando Z acontecer"'],
    ],
    explanation: 'Entrevistador quer ver o S — nomear o sacrifício. Não fingir que há solução perfeita. Toda decisão técnica tem custo — a maturidade está em identificá-lo explicitamente.',
    example: '"Vou de Postgres: aguenta 10x nosso volume, time já sabe, JOIN nativo. Sacrifico escala horizontal fácil — revisito quando volume > 500K writes/dia."',
    why: 'A maioria dos candidatos responde "escolhi X porque é melhor" sem nomear o que abriu mão. COS é o que diferencia pleno de sênior.',
  },
  {
    label: 'Falácias — "Cargo Shiny Sunk Early Preferência Paralisa"',
    trick: 'CSSEPP — 6 falácias para reconhecer',
    expansion: [
      ['C = Cargo cult', '"Netflix usa" — contexto diferente de volume/time/infra'],
      ['S = Shiny new tech', 'Nova = sem produção comprovada, hiring difícil, risco de abandono'],
      ['S = Sunk cost', '"Já investimos" — passado não é variável da decisão futura'],
      ['E = Early optimization', 'Escalar problema que não existe ainda'],
      ['P = Preferência', 'Disfarçada de técnica: "MongoDB é melhor" (só conheço Mongo)'],
      ['P = Paralisa', 'Análise paralisia em two-way door — custo real de eng desperdiçado'],
    ],
    explanation: 'Reconhecer a falácia no próprio raciocínio é o sinal de maturidade. Em grupo, nomeá-la sem julgamento move o debate para frente.',
    example: '"Isso parece cargo cult — Netflix tem 300 engenheiros de infra para operar isso. Nós temos 3. O contexto é fundamentalmente diferente."',
    why: 'Decisões técnicas ruins frequentemente têm pelo menos uma falácia escondida. Reconhecer a falácia resolve o debate em segundos.',
  },
  {
    label: 'ADR — "Contexto Decisão Alternativas Consequências"',
    trick: 'CDAC — as 4 seções essenciais',
    expansion: [
      ['C = Contexto', 'Por que a decisão foi necessária — com NÚMEROS. Sem números é opinião.'],
      ['D = Decisão', 'O que foi escolhido e por quê — específico, não genérico.'],
      ['A = Alternativas', 'Cada alternativa rejeitada com a razão — a seção mais valiosa do ADR.'],
      ['C = Consequências', 'Positivas e negativas + quando revisitar a decisão.'],
    ],
    explanation: 'ADR sem a seção de Alternativas é só changelog. A seção mais valiosa é Alternativas Rejeitadas — captura o raciocínio que permite revisitar quando contexto muda.',
    example: 'ADR de banco: Contexto com volume atual. Decisão: PostgreSQL. Alternativas: DynamoDB (access patterns não definidos), MongoDB (schema estabilizou). Consequências: escala limitada → revisitar em 2TB.',
    why: 'Times que não documentam ADRs reprocessam as mesmas decisões a cada 12 meses. ADR amortiza o custo de debate em todas as próximas iterações sobre a mesma questão.',
  },
]

// ── Builders ─────────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Tradeoff Analysis',
    stackLabel: 'Arquitetura · Decisão',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Tradeoff Analysis',
    accentColor: C,
    stackLabel: 'Arquitetura · Decisão',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['Two-way door', 'Reversível (dias) → decide rápido, executa, reverte se necessário'],
        ['One-way door', 'Irreversível (meses) → debate profundo + ADR obrigatório'],
        ['TCO 3 anos', 'Dev + infra + manutenção + oportunidade perdida'],
        ['Build vs Buy', 'Não é core advantage → compra. Core do produto → constrói.'],
        ['PACELC', 'Sem partição: troca Latência por Consistência. DynamoDB: EL. Postgres: EC.'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'Número ganha de opinião — estime antes de decidir, mesmo rough',
        'Nomear o sacrifício é o sinal de maturidade — toda decisão tem custo',
        'Two-way door: 1h de debate no máximo. One-way door: quantificar e ADR.',
        'Alternativas rejeitadas no ADR são a seção mais valiosa',
        'Postgres + RDS Multi-AZ aguenta 99% dos sistemas — não NoSQL por padrão',
        'Build de auth, billing, monitoring: compra. Custo de eng > custo de SaaS por 3 anos.',
      ],
      patterns: [
        {
          name: 'ADR — Structure padrão',
          code: `# ADR-{número}: {Título da Decisão}

## Status: Accepted | Deprecated | Superseded

## Contexto
Problema + NÚMEROS (volume, custo atual, SLA, prazo).

## Decisão
Específica — não "vamos usar filas" mas "SQS + Lambda
com DLQ, máx 3 tentativas, visibilidade de 30s".

## Alternativas Rejeitadas
- Redis Bull: rejeitado porque [razão específica]
- Kafka: overkill para volume atual (50K/dia), curva
  operacional alta, time sem experiência.

## Consequências
Positivas: managed service, integração nativa AWS.
Negativas: at-least-once delivery → consumer idempotente.
Revisitar quando: volume > 1M mensagens/dia.`,
          desc: 'ADR sem alternativas rejeitadas é só changelog',
        },
        {
          name: 'Build vs Buy — TCO calculation',
          code: `// TCO de 3 anos: Build vs Auth0
const build = {
  initial: 3 * 18000,  // 3 meses de sênior
  maintenance: 10 * 112.5 * 36,  // 10h/mês × 36 meses
  security_overhead: 1.5,  // multiplicador de edge cases
  oncall: 18000 * 0.15 * 36,  // 15% overhead on-call
}
// Total build: ~R$126K

const buy = {
  setup: (5/20) * 18000,  // 5 dias de integração
  subscription: 1200 * 36,  // Auth0 B2B plan
}
// Total buy: ~R$47K

// → Buy é 63% mais barato E mais seguro
// Sacrifice: lock-in em 2 meses de migração se sair`,
          desc: 'Número elimina debate — auth é buy quase sempre',
        },
        {
          name: 'Resposta de entrevista estruturada (COS)',
          code: `// Pergunta: "Por que PostgreSQL e não DynamoDB?"

// C — Contexto crítico:
// "Volume: 50K pedidos/dia. Requisito: JOINs para
//  relatórios contábeis. ACID para criar pedido +
//  reservar estoque + registrar pagamento."

// O — Opções avaliadas:
// "DynamoDB: sem JOINs nativos, relatórios = scan completo,
//  transações limitadas a 25 itens. Team sem experiência."
// "Postgres: ACID completo, SQL para relatórios, team produtivo."

// S — Sacrifício nomeado:
// "Escolho Postgres, SACRIFICANDO escala horizontal fácil.
//  Mitigo com sharding key no schema. Revisito quando
//  volume > 500K writes/dia ou banco > 2TB."`,
          desc: 'COS: Contexto, Opções, Sacrifício — o formato que define sênior',
        },
      ],
      mentalModels: [
        'COS: Contexto → Opções → Sacrifício. O S é o que diferencia sênior.',
        'Two-way door: decide em 1h. One-way door: quantifica + ADR.',
        'Número ganha de opinião — estime antes, mesmo rough elimina 80% do debate',
        'Build vs Buy: core advantage = build. Todo o resto = buy.',
        'PACELC: sem partição, você troca latência por consistência. DynamoDB é EL, Postgres é EC.',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Tradeoff Analysis',
    stackLabel: 'Arquitetura · Decisão',
  }),
}

// ── Componente principal ────────────────────────────────────────────────────────

export default function TradeoffAnalysisPdfs() {
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
