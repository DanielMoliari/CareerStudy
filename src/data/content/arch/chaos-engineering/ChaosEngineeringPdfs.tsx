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

// ── Paleta Chaos Engineering ──────────────────────────────────────────────────
const C = '#f97316'  // orange — NUNCA omitir, default seria cyan React

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre Chaos Engineering em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: steady state hypothesis, blast radius, game day, ferramentas (Gremlin, AWS FIS, LitmusChaos), como introduzir chaos num time, métricas de sucesso, quando NÃO usar — tudo que entrevistadores pleno/sênior realmente perguntam.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Conceitos, ferramentas, tipos de falha e pré-requisitos numa página',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: steady state, hipótese, blast radius, abort conditions, tipos de falha por camada (infra/rede/app/recurso), ferramentas por caso de uso e progressão de maturidade (game day → chaos automático).',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 4 truques que grudam Chaos Engineering na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'SHIBE (pré-requisitos), GGS (ordem de maturidade), método científico vs sabotagem, e BRAIN (anti-padrões críticos). Âncoras cognitivas para entrevista e para defender decisões no trabalho.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é chaos engineering e como difere de testes convencionais?',
    a: '<strong>Chaos engineering</strong> injeta falhas controladas em produção para descobrir fraquezas antes de incidentes reais. Difere de testes porque: (1) roda em produção real (não CI isolado), (2) tem hipótese explícita, (3) descobre problemas que ninguém imaginou no código. Testes validam comportamento esperado; chaos valida resiliência ao inesperado.',
    tip: 'Mencione "Steady State Hypothesis" e "método científico". Isso demonstra que você entende a base conceitual, não só a ferramenta.',
  },
  {
    level: 'Pleno',
    q: 'Quais são os pré-requisitos para começar chaos engineering?',
    a: 'Três pilares inegociáveis: (1) <strong>Observability</strong> — métricas, logs, traces. Sem isso, você não vê o impacto. (2) <strong>On-call funcional</strong> — runbook escrito e testado, rotação ativa. (3) <strong>Rollback confiável</strong> — kill switch automático, deploy em minutos. Opcional mas recomendado: cultura de blameless postmortem.',
    tip: 'Enfatize que sem observability, você não começa. Empresas pulam este passo e criam trauma cultural quando chaos gera incidente real não detectado.',
  },
  {
    level: 'Pleno',
    q: 'O que é steady state hypothesis?',
    a: 'Afirmação mensurável sobre o que "sistema saudável" significa. Exemplos: "P99 &lt; 300ms", "error rate &lt; 0.1%", "throughput &gt; 1000 req/s". É o critério de sucesso do experimento — sem ela, você não sabe se a injeção causou degradação. Mede antes, durante e depois. O delta é o aprendizado.',
    tip: 'O que diferencia chaos de sabotagem é a hipótese. Sempre defina antes de injetar — torna o aprendizado estruturado e defensável para stakeholders.',
  },
  {
    level: 'Pleno',
    q: 'O que é blast radius e como você limita?',
    a: 'Escopo do impacto do experimento. Limito por: (1) <strong>Percentual de tráfego</strong>: 1% → 5% → 25% → 100%. (2) <strong>Geografia</strong>: 1 AZ → 1 região → global. (3) <strong>Tempo</strong>: TTL máximo com kill switch automático. (4) <strong>Abort condition</strong>: se steady state degradar além de N%, aborta automaticamente. Nunca comece com 100% — você pode estar errado sobre a hipótese.',
    tip: 'Abort condition automática é o que diferencia profissional de amador. Kill switch manual é insuficiente — operador pode estar distraído ou o problema se escalar rápido demais.',
  },
  {
    level: 'Pleno',
    q: 'O que é um game day?',
    a: 'Exercício coordenado onde o time simula um incidente específico com todos os participantes cientes e presentes. Tem horário, escopo, hipótese e plano de rollback combinados. Treina runbook (você descobre que os passos não são executáveis por qualquer pessoa), valida observability (você encontra o problema no dashboard?) e ensina time novo sem pressão real.',
    tip: 'Diferencie: game day é coordenado e pontual (educação); chaos automático é contínuo (não-regressão). Times maduros fazem os dois. Times iniciantes começam com game day.',
  },
  {
    level: 'Pleno',
    q: 'Quais tipos de falha podem ser simulados?',
    a: 'Por camada: (1) <strong>Infra</strong>: instância terminada, nó K8s morto, AZ down. (2) <strong>Rede</strong>: latência 100ms–2s, perda de pacotes, partição, DNS lento. (3) <strong>App</strong>: HTTP 500/503 injetado, timeout entre serviços. (4) <strong>Recursos</strong>: CPU 100%, exaustão de memória, disco cheio. (5) <strong>Dependência</strong>: DB down, cache miss, Kafka lag alto.',
    tip: 'Organize por camada — demonstra pensamento sistêmico. A maioria dos incidentes reais é de rede ou dependência, não de instância. Isso surpreende equipes que só matam pods.',
  },
  {
    level: 'Pleno',
    q: 'Quais ferramentas de chaos engineering existem?',
    a: '<strong>Chaos Monkey</strong>: EC2, Netflix OSS, simples. <strong>AWS FIS</strong>: nativo AWS, EC2/ECS/EKS/RDS, IAM integrado. <strong>LitmusChaos</strong>: Kubernetes CRDs, CNCF, open-source. <strong>Chaos Mesh</strong>: Kubernetes, web UI, CNCF. <strong>Gremlin</strong>: SaaS managed, UI excelente, caro. <strong>Toxiproxy</strong>: proxy rede, ótimo para dev/integração local.',
    tip: 'Regra de escolha: AWS puro → FIS; Kubernetes → LitmusChaos ou Chaos Mesh; equipe iniciando → Gremlin (UX); integração local → Toxiproxy.',
  },
  {
    level: 'Pleno',
    q: 'Como você mediria o sucesso de um programa de chaos engineering?',
    a: 'Métricas corretas: (1) <strong>Bugs encontrados em pré-prod</strong> por experimento. (2) <strong>MTTR caindo</strong> ao longo dos trimestres. (3) <strong>Cobertura</strong>: % de serviços críticos testados. (4) <strong>Confiança do time</strong>: pesquisa interna sobre deploy em horário de pico. O que NÃO medir: "número de experimentos rodados" — KPI gamificado sem qualidade.',
    tip: 'A resposta que diferencia pleno de sênior é saber o que NÃO medir. Demonstra que você entende que quantidade sem qualidade é ruído.',
  },
  {
    level: 'Senior',
    q: 'Como você introduziria chaos engineering num time que nunca usou?',
    a: 'Fases: (1) Game day em staging — sem risco, todo time presente. Identifica gaps de observability e runbook. (2) Chaos manual em prod 1% — hipótese explícita, kill switch manual, aviso ao time. (3) Chaos automático após meses de confiança. Pré-req inegociável: sem observability e on-call decente, não começo. Chaos em sistema imaturo é sabotagem.',
    tip: 'Demonstre pensamento de longo prazo: não é "instalar Gremlin amanhã" — é programa de maturidade de 6-12 meses. Isso é o que diferencia quem pensa estrategicamente.',
  },
  {
    level: 'Senior',
    q: 'Quando NÃO usar chaos engineering?',
    a: 'Situações de ROI negativo: (1) Sem observability — você não vê impacto. (2) MVP/protótipo sem SLA real. (3) Time sem maturidade de incidente — sem on-call/runbook/alarme. (4) Fase pré-PMF — foco em entrega. (5) Sistema legado que ninguém entende — você não distingue bug de chaos do bug original.',
    tip: 'Resposta madura não é "sempre use chaos". Saber quando o investimento não faz sentido demonstra julgamento situacional — valioso em entrevistas sênior.',
  },
  {
    level: 'Senior',
    q: 'Tradeoff: chaos automático contínuo vs game day pontual?',
    a: '<strong>Automático</strong>: garante que resiliência não regride com deploys, normaliza falha como evento esperado. Custo: maturidade alta exigida, falsos positivos podem cansar o time. <strong>Game day</strong>: cobre cenários complexos (queda de datacenter, DDoS) que automação não simula, treina time. Custo: pontual — pode regredir entre sessões. Time maduro faz os dois.',
    tip: 'Netflix usa os dois: Chaos Monkey cobre cotidiano, game days cobrem cenários de datacenter inteiro. Mencionar isso demonstra que você leu as fontes primárias.',
  },
  {
    level: 'Senior',
    q: 'Como projetar chaos engineering em Kubernetes?',
    a: 'Arquitetura: LitmusChaos ou Chaos Mesh como CRDs. Experimentos como YAML no git. Prometheus monitorando steady state durante experimento. Abort condition via AlertManager. Pipeline: experimentos rodam via CI/CD após deploy. Tipos: PodChaos, NetworkChaos, IOChaos, CPUStress. Kill switch: TTL máximo no YAML do CRD.',
    tip: 'Mencionar CRDs específicos (PodChaos, NetworkChaos) demonstra conhecimento prático de Kubernetes chaos, não só conhecimento teórico.',
  },
  {
    level: 'Senior',
    q: 'Como chaos engineering se relaciona com SRE?',
    a: 'Integração natural: (1) Steady state é baseado nos SLOs do sistema. (2) Experimentos consomem error budget — SRE balanceia quanto gastar. (3) Incidentes reais alimentam novos cenários de chaos (reproduce, valida correção, garante não-regressão). (4) Chaos bem feito reduz toil ao longo do tempo — menos incidentes não planejados.',
    tip: 'Mencione o SRE book do Google — tem capítulo sobre chaos. Demonstra que você leu as fontes primárias.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre chaos engineering e fault injection testing?',
    a: '<strong>Fault injection testing</strong>: técnica de QA — caixa-branca, você sabe o que vai quebrar e valida comportamento documentado. <strong>Chaos engineering</strong>: disciplina de resiliência — caixa-preta, você formula hipóteses e descobre o que não sabia. Analogia: fault injection é testar se o airbag infla; chaos é simular acidente real para descobrir o que mais pode falhar.',
    tip: 'Esta distinção aparece em entrevistas Staff/Principal. Demonstra maturidade conceitual além de "instalar Gremlin".',
  },
  {
    level: 'Senior',
    q: 'Como lidar com stakeholders resistentes a chaos em produção?',
    a: 'Abordagem baseada em evidências: (1) Começar em staging — mostrar bugs encontrados sem risco. (2) Comunicação proativa — data, horário, escopo, blast radius, plano de rollback. Stakeholders resistem ao desconhecido. (3) Post-mortem de incidentes reais — "esse incidente teria sido encontrado por chaos". (4) ROI concreto: custo de downtime não planejado vs custo de experimento controlado.',
    tip: 'Demonstre habilidade de navegação organizacional. Chaos engineering é tanto cultural quanto técnico — essa é a resposta sênior.',
  },
  {
    level: 'Senior',
    q: 'Como garantir que correções descobertas por chaos não regridam?',
    a: '(1) <strong>Chaos como CI</strong>: experimento que descobriu a fraqueza vira teste de regressão no pipeline. (2) <strong>Runbook versionado</strong>: commitado no git, atualizado junto com o código. (3) <strong>Feature flag para chaos</strong>: desativa sem deploy, reativa quando necessário. (4) <strong>Coverage dashboard</strong>: alerta se serviço não foi testado há mais de 30 dias. (5) <strong>Chaos como gate de PR</strong>: para serviços críticos.',
    tip: '"Chaos como CI" é a keyword que impressiona — transforma experimento ad-hoc em automação de não-regressão. Nível de maturidade avançado.',
  },
  {
    level: 'Senior',
    q: 'Quais anti-padrões críticos em chaos engineering você identificaria?',
    a: '(1) Chaos sem hipótese — aprendizado zero. (2) Blast radius 100% no primeiro experimento. (3) Sem abort condition — experimento continua mesmo com degradação. (4) Chaos às 2h da manhã — ninguém disponível. (5) Sem observability — você injeta mas não vê. (6) Punição por incidentes de chaos — mata a cultura. (7) Chaos em sistema não compreendido — você não distingue problema do chaos do pré-existente.',
    tip: 'Anti-padrão cultural (punição) além dos técnicos é a resposta que impressiona. Chaos engineering falha por cultura, não por tecnologia.',
  },
  {
    level: 'Senior',
    q: 'Como chaos engineering se aplica em microsserviços especificamente?',
    a: 'Microsserviços são o ambiente de maior valor porque cascading failure é o risco principal. Cenários: (1) Matar serviço B e verificar se A implementa circuit breaker. (2) Injetar latência e verificar timeout de A. (3) Simular retry storm — retries sem jitter sobrecarregam serviço em recuperação. (4) Chaos via Istio/Linkerd — sidecar injeta falha transparentemente.',
    tip: 'Chaos via service mesh (Istio/Linkerd) é mais seguro porque não requer código na aplicação. Demonstra conhecimento de plataforma avançado.',
  },
  {
    level: 'Pleno',
    q: 'Como documentar e compartilhar resultados de experimentos de chaos?',
    a: 'Documentação por experimento: hipótese, método, steady state antes/durante/depois, resultado, fraquezas encontradas, ações com owner/prazo. Compartilhamento: wiki com todos experimentos históricos (busca por serviço), reunião mensal de chaos review, dashboard de cobertura por serviço visível para toda a engenharia.',
    tip: 'Demonstra que você pensa em chaos como programa contínuo, não experimento único. Documentação é o que cria valor organizacional.',
  },
  {
    level: 'Pleno',
    q: 'O que é o Chaos Monkey e qual seu papel histórico?',
    a: 'Criado pela Netflix em 2011. Termina instâncias EC2 aleatoriamente em horário comercial. Forçou a Netflix a construir sistemas genuinamente resilientes à falha de instância. Hoje é parte do Simian Army. Historicamente importante — foi o experimento que popularizou chaos engineering. Modernamente é o tipo mais simples de chaos; ferramentas como Gremlin e Chaos Mesh cobrem rede, CPU, memória, Kubernetes.',
    tip: 'Mencionar que Chaos Monkey é "o ponto de partida histórico mas limitado" demonstra que você entende a evolução do campo.',
  },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'SHIBE — Pré-requisitos de Chaos',
    trick: 'SHIBE: Steady state, Hipótese, Integrado (obs.), Blast radius, Escape hatch',
    expansion: [
      ['S — Steady State', 'Métrica mensurável de sistema saudável — sem isso você não sabe se degradou'],
      ['H — Hipótese', 'Afirmação explícita antes de injetar — transforma chaos em ciência'],
      ['I — Integrado (observability)', 'Prometheus + Grafana + traces — sem ver, você é cego'],
      ['B — Blast radius', 'Escopo mínimo possível — 1 instância, 1%, 1 AZ'],
      ['E — Escape hatch', 'Kill switch automático + rollback rápido — coragem vem de saber que pode parar'],
    ],
    explanation: 'Pré-requisitos obrigatórios antes de qualquer experimento de chaos em produção.',
    example: 'Checklist pré-experimento: steady state definido? hipótese escrita? obs. ativa? blast radius mínimo? kill switch pronto?',
    why: 'Sem esses 5 elementos, chaos engineering é sabotagem — não ciência.',
  },
  {
    label: 'GGS — Ordem de Maturidade',
    trick: 'GGS: Game day → Gradual (1%) → Sistemático (automático)',
    expansion: [
      ['G — Game Day', 'Staging, time presente, sem risco. Aprende gaps de observability e runbook'],
      ['G — Gradual', '1% em produção, manual, hipótese, kill switch. Primeiros meses'],
      ['S — Sistemático', 'Chaos automático no CI/CD. Anos de maturidade. Nunca pule etapas.'],
    ],
    explanation: 'Maturidade de chaos engineering cresce em estágios — nunca pule etapas.',
    example: 'Time novo: game day em staging. Time com 6 meses de observability: gradual 1%. Time com 2 anos: chaos no CI.',
    why: 'Pular etapas gera incidentes reais e destrói a cultura de chaos antes de criar valor.',
  },
  {
    label: 'H-E-O-C — Método Científico',
    trick: 'Chaos = H→E→O→C: Hipótese → Experimento → Observação → Conclusão',
    expansion: [
      ['H — Hipótese', '"Sistema mantém P99 < 300ms quando instância X é terminada"'],
      ['E — Experimento', 'Injetar falha com blast radius mínimo e abort condition'],
      ['O — Observação', 'Medir steady state antes/durante/depois com dados reais'],
      ['C — Conclusão', 'Confirmou? Resiliência validada. Refutou? Fraqueza encontrada — corrigir e re-testar'],
    ],
    explanation: 'Sem hipótese, não há ciência — apenas sabotagem disfarçada de engenharia.',
    example: 'Antes: "P99 < 200ms com 3 instâncias saudáveis". Injetar: matar 1 instância. Observar: P99 subiu para 450ms. Conclusão: resiliência insuficiente — adicionar circuit breaker.',
    why: 'O método científico transforma medo de falha em aprendizado estruturado e defensável.',
  },
  {
    label: 'BRAIN — Anti-padrões Críticos',
    trick: 'BRAIN: Blast radius grande, Runbook ausente, Abort sem condição, Ignorar obs., Noite',
    expansion: [
      ['B — Blast radius 100%', 'Primeiro experimento com 100% de tráfego — arrogância que gera incidente'],
      ['R — Runbook inexistente', 'Sem runbook, equipe improvisa sob pressão do incidente gerado pelo chaos'],
      ['A — Abort sem condição', 'Experimento sem critério de parada automática — continua mesmo degradando'],
      ['I — Ignorar observability', 'Injetar falha sem dashboard = você é cego ao impacto'],
      ['N — Noite / fora do horário', 'Chaos às 2h = ninguém disponível para responder. Valor zero, risco máximo'],
    ],
    explanation: 'Os 5 anti-padrões mais comuns que transformam chaos engineering em incidente real.',
    example: 'Time que ignora BRAIN: primeiro experimento em prod às 23h, sem abort condition, sem runbook. Resultado: incidente P1 de 4 horas.',
    why: 'Chaos engineering exige mais disciplina que operações normais — não menos.',
  },
]

// ── Dados: Cheatsheet ─────────────────────────────────────────────────────────

const CS_HOOKS: HookItem[] = [
  { name: 'Steady State', sig: 'Métrica mensurável de saúde', desc: 'Antes de qualquer experimento' },
  { name: 'Hipótese', sig: '"Sistema mantém steady state quando X"', desc: 'Formulada antes da injeção' },
  { name: 'Blast Radius', sig: '1% → 5% → 25% → 100%', desc: 'Sempre mínimo possível' },
  { name: 'Abort Condition', sig: 'if (metric > threshold) → abort + rollback', desc: 'Sempre configurada' },
  { name: 'Game Day', sig: 'Exercício coordenado em staging', desc: 'Primeiro passo de qualquer programa' },
  { name: 'Kill Switch', sig: 'feature flag / TTL máximo', desc: 'Antes de qualquer injeção em prod' },
  { name: 'MTTR', sig: 'Mean Time To Recovery', desc: 'Métrica de sucesso do programa' },
]

const CS_RULES: RuleItem[] = [
  { ok: true, t: 'Sem observability → não comece — Você não vê o impacto, não aprende nada, e pode quebrar usuário sem saber' },
  { ok: true, t: 'Sem hipótese → é sabotagem — Chaos sem hipótese é "quebrar coisa pra ver" — aprendizado zero, risco máximo' },
  { ok: true, t: 'Começar em staging — Primeiro game day em ambiente isolado — descubra gaps sem risco de produção' },
  { ok: true, t: 'Blast radius cresce devagar — Valide cada nível antes de expandir. Nunca pule de 1% para 100%' },
  { ok: true, t: 'Abort automático obrigatório — Kill switch manual é insuficiente — operador pode estar distraído' },
  { ok: true, t: 'Horário comercial primeiro — Equipe disponível para responder se algo sair errado' },
  { ok: true, t: 'Documentar resultado sempre — Sem registro, a organização não aprende — próxima equipe repete o mesmo erro' },
]

// ── Builders de PDF ──────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Chaos Engineering',
    stackLabel: 'Arquitetura / SRE',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Chaos Engineering',
    accentColor: C,
    stackLabel: 'Arquitetura / SRE',
    sections: {
      hooks: CS_HOOKS,
      depRows: [],
      rules: CS_RULES,
      performanceTips: [],
      patterns: [],
      mentalModels: [],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Chaos Engineering',
    stackLabel: 'Arquitetura / SRE',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function ChaosEngineeringPdfs() {
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
