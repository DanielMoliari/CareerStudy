import type { SkillContent } from '@/types'

const chaosEngineering: SkillContent = {
  tagline: 'Injetar falhas em produção de forma controlada para descobrir fraquezas antes do incidente.',
  why: 'Chaos engineering é diferencial em vaga sênior em empresa com SLA sério. Mostra mentalidade de "falha vai acontecer, melhor descobrir agora". Saber explicar game day, blast radius e steady state coloca você em outro nível.',
  summary: 'Chaos engineering é a prática de injetar falhas controladas em sistema de produção (ou staging realista) para validar resiliência. Origem na Netflix com Chaos Monkey (2011). Método científico: define hipótese ("sistema sobrevive à queda de 1 AZ"), define steady state (métrica que indica saúde), injeta falha, observa, corrige fraqueza encontrada. Não é "quebrar coisa aleatória" — é experimento com blast radius limitado e plano de rollback.',
  keypoints: [
    { title: 'Steady state', body: 'Métrica que define "sistema saudável" durante o experimento (taxa de pedido por minuto, latência P99, taxa de erro). Sem isso, você não sabe se a injeção quebrou algo.' },
    { title: 'Hipótese', body: 'Antes de injetar, você diz: "esperamos que sistema continue saudável quando X acontecer". Experimento confirma ou refuta. Se você já sabe que vai quebrar, não injete em prod — corrija primeiro.' },
    { title: 'Blast radius', body: 'Comece com 1% dos usuários, 1 instância, 1 AZ. Se experimento valida, expande. Nunca comece com 100% — você pode estar errado sobre a hipótese.' },
    { title: 'Tipos de falha', body: 'Latência injetada, erro HTTP, queda de instância, queda de AZ inteira, partição de rede, exaustão de CPU/memória, DNS lento, certificado expirado.' },
    { title: 'Game day', body: 'Exercício coordenado onde time simula incidente em ambiente real. Treina runbook, valida observability, ensina time novo. Diferente de chaos automático — tem horário, escopo e participantes.' },
    { title: 'Ferramentas', body: 'Chaos Monkey (instância), Gremlin (managed), AWS Fault Injection Simulator, LitmusChaos (Kubernetes), Toxiproxy (rede), Chaos Mesh.' },
    { title: 'Pré-requisitos', body: 'Sem observability, você não vê o impacto. Sem runbook, time não sabe responder. Sem confiança em rollback, você não tem coragem de injetar. Maturidade vem antes do chaos.' },
  ],
  gotchas: [
    'Injetar falha sem observability — você não vê nada, aprende nada, e ainda quebra usuário.',
    'Começar em prod 100% — primeira injeção deve ser em staging, depois 1% prod, depois expandir.',
    'Chaos sem hipótese — virou "quebrar coisa para ver". Sem aprendizado estruturado, é só dor.',
    'Esquecer blast radius — experimento de "matar 1 instância" mata o cluster todo porque ninguém testou auto-scaling. Rollback rápido obrigatório.',
    'Time não maduro — chaos em sistema sem on-call, sem alarme, sem runbook, gera incidente real e queima confiança.',
    'Stakeholders sem aviso — gerente descobre que você derrubou prod numa quinta à tarde. Comunicação prévia é cultural.',
  ],
  interview: [
    {
      level: 'pleno',
      q: 'O que é chaos engineering e como difere de testes convencionais?',
      a: '<p><strong>Chaos engineering</strong> é a prática de injetar falhas controladas em sistema de produção (ou staging realista) para descobrir fraquezas antes que incidentes reais as exponham.</p><p>Difere de testes convencionais porque:</p><ul><li><strong>Testes convencionais</strong>: validam comportamento esperado em condições normais</li><li><strong>Chaos engineering</strong>: valida resiliência em condições adversas — falhas que você não imaginou no código de produção</li><li><strong>Ambiente</strong>: testes rodam em CI/staging isolado; chaos roda em produção real (com blast radius limitado)</li><li><strong>Hipótese</strong>: chaos é método científico — hipótese explícita, experimento, observação, conclusão</li></ul>',
      tip: 'Mencione o Princípio de Chaos Engineering e o "Steady State Hypothesis". Demonstre que você entende que chaos não é sabotagem — é ciência.',
    },
    {
      level: 'pleno',
      q: 'Quais são os pré-requisitos para começar um programa de chaos engineering?',
      a: '<p>Três pilares indispensáveis:</p><ul><li><strong>Observability</strong>: sem métricas, logs e traces, você não enxerga o impacto do experimento. Dashboards, alertas e correlação de traces são obrigatórios.</li><li><strong>On-call funcional</strong>: runbooks escritos, rotação ativa, SLA de resposta definido. Chaos pode gerar incidente real — time precisa saber responder.</li><li><strong>Rollback confiável</strong>: feature flags, kill switches automáticos, deploy rollback em minutos. Sem isso, você não tem coragem de injetar.</li></ul><p>Opcional mas recomendado: cultura de blameless postmortem — time precisa tratar falha como aprendizado, não punição.</p>',
      tip: 'Enfatize observability como primeiro pré-requisito. Empresas imaturamente tentam pular direto para chaos e criam trauma cultural quando incidente real acontece.',
    },
    {
      level: 'pleno',
      q: 'O que é steady state hypothesis e por que é central em chaos?',
      a: '<p><strong>Steady state hypothesis</strong> é a afirmação mensurável do que "sistema saudável" significa antes do experimento.</p><p>Exemplos:</p><ul><li>"Throughput de requisições mantém-se acima de 1000 req/s por 5 minutos"</li><li>"P99 de latência permanece abaixo de 300ms"</li><li>"Taxa de erro HTTP 5xx permanece abaixo de 0.1%"</li></ul><p>Por que é central:</p><ul><li>Define o critério de sucesso/falha do experimento de forma objetiva</li><li>Sem steady state, você não sabe se a injeção quebrou algo ou não</li><li>Permite abort automático: se métrica degradar além do limiar, experimento é abortado e rollback disparado</li></ul>',
      tip: 'Mencione que steady state deve ser medido antes, durante e depois do experimento. O delta é o que você aprende.',
    },
    {
      level: 'pleno',
      q: 'Como você limitaria o blast radius de um experimento?',
      a: '<p><strong>Blast radius</strong> é o escopo do impacto em caso de falha do experimento. Limito em múltiplas dimensões:</p><ul><li><strong>Percentual de tráfego</strong>: 1% → 5% → 25% → 100%. Incremento só após validação.</li><li><strong>Geografia</strong>: uma AZ → uma região → multi-região → global.</li><li><strong>Tempo</strong>: experimento com duração máxima definida (5min, 15min). Kill switch automático.</li><li><strong>Abort condition</strong>: se steady state métrica degradar além de N%, experimento aborta automaticamente.</li><li><strong>Horário</strong>: inicialmente em horário de trabalho (equipe disponível), não às 3h da manhã.</li></ul><p>Nunca começar com 100% — você pode estar errado sobre a hipótese.</p>',
      tip: 'O erro mais comum é pular blast radius pequeno por confiança excessiva. Mencione que mesmo o Netflix começou com 1 instância em staging.',
    },
    {
      level: 'pleno',
      q: 'O que é um game day e quando usá-lo?',
      a: '<p><strong>Game day</strong> é exercício coordenado onde o time simula um incidente específico em ambiente real, com todos os participantes cientes e presentes.</p><p>Características:</p><ul><li>Horário combinado, escopo definido, equipe reunida</li><li>Treina runbook: confirma que os passos são executáveis por qualquer pessoa</li><li>Valida observability: você encontra o problema no dashboard?</li><li>Ensina time novo: engenheiros júnior participam e aprendem respondendo a incidente sem pressão real</li></ul><p>Quando usar:</p><ul><li>Antes de lançar chaos automático — game day é a fase de aprendizado com segurança</li><li>Para cenários complexos que automação não simula (queda de fornecedor, ataque DDoS, falha de datacenter)</li><li>Para novos serviços antes de colocar em produção crítica</li></ul>',
      tip: 'Diferencie claramente game day (coordenado, pontual, educativo) de chaos automático (contínuo, descoberta incremental). Times maduros fazem os dois.',
    },
    {
      level: 'senior',
      q: 'Como você introduziria chaos engineering num time que nunca usou?',
      a: '<p>Começo com <strong>game day em staging</strong>: cenário combinado, todo mundo presente, simulamos queda de DB ou AZ. Identifica gaps de runbook e observability sem risco real. Esse exercício sozinho já entrega muito valor.</p><p>Depois evoluo em fases:</p><ul><li><strong>Fase 1</strong>: game day mensal em staging. Aprende os gaps sem risco.</li><li><strong>Fase 2</strong>: chaos manual em prod com blast radius pequeno (1 instância, 1% tráfego), com aviso ao time, hipótese explícita e plano de rollback.</li><li><strong>Fase 3</strong>: chaos automático (Chaos Monkey rodando todo dia em horário de trabalho) após meses de confiança construída.</li></ul><p>Pré-req inegociável: sem observability e on-call decente, não começo. Chaos em sistema imaturo é sabotagem.</p>',
      tip: 'Demonstre pensamento de longo prazo: não é "instalar Gremlin amanhã", é um programa de maturidade de 6-12 meses.',
    },
    {
      level: 'senior',
      q: 'Quando NÃO usar chaos engineering?',
      a: '<p>Situações onde o ROI é negativo:</p><ul><li><strong>Sem observability</strong>: você não vê impacto, não aprende, só quebra. Resolva observability primeiro.</li><li><strong>Sistema sem SLA real</strong>: em MVP ou protótipo, o esforço de chaos pesa mais que o ganho.</li><li><strong>Time sem maturidade de incidente</strong>: sem on-call, sem runbook, sem alarme, chaos gera incidente real que ninguém sabe responder. Vira trauma cultural.</li><li><strong>Fase de pré-PMF</strong>: foco em entrega rápida, não em resiliência avançada.</li><li><strong>Sistema legado sem testes</strong>: injetar falha em sistema que ninguém entende é perigoso.</li></ul>',
      tip: 'A resposta madura não é "sempre use chaos" — é saber quando o investimento não faz sentido. Demonstre julgamento situacional.',
    },
    {
      level: 'senior',
      q: 'Tradeoff: chaos automático contínuo vs game day pontual?',
      a: '<p><strong>Chaos automático contínuo</strong>:<br>Prós: garante que resiliência não regride com novos deploys, encontra problemas que game day pontual não cobre, normaliza falha como evento esperado.<br>Contras: exige maturidade alta, falsos positivos podem cansar o time, instrumentação e kill switches custam tempo de engenharia.</p><p><strong>Game day pontual</strong>:<br>Prós: exercício coordenado que treina time, cobre cenários complexos (queda de fornecedor, multi-região), não exige automação.<br>Contras: pontual — você pode regredir entre game days sem perceber.</p><p>Time maduro faz os dois: automático cobre o cotidiano, game day cobre cenários excepcionais que automação não simula.</p>',
      tip: 'Mencione que o Netflix usa os dois: Chaos Monkey roda continuamente, mas game days existem para cenários de datacenter inteiro.',
    },
    {
      level: 'senior',
      q: 'Como você mede o sucesso de um programa de chaos engineering?',
      a: '<p>Métricas corretas:</p><ul><li><strong>Bugs encontrados em pré-prod</strong>: número de fraquezas descobertas por experimento antes de chegar a incidente real.</li><li><strong>MTTR em queda</strong>: tempo médio de recuperação diminuindo ao longo dos trimestres (time fica mais rápido).</li><li><strong>Cobertura</strong>: percentual de serviços críticos que já passaram por experimento de chaos.</li><li><strong>Confiança do time</strong>: pesquisa interna sobre conforto com deploy em horário de pico.</li></ul><p>O que <strong>não</strong> medir:</p><ul><li>"Número de experimentos rodados" — vira KPI gamificado sem qualidade.</li><li>"Nenhum incidente" — pode significar que você não está aprendendo nada novo.</li></ul>',
      tip: 'A resposta que diferencia pleno de sênior é saber o que NÃO medir. Demonstre que entende que quantidade de experimentos sem qualidade é ruído.',
    },
    {
      level: 'senior',
      q: 'Como você projetaria um sistema de chaos engineering do zero para um ambiente Kubernetes?',
      a: '<p>Arquitetura em camadas:</p><ul><li><strong>Plano de controle</strong>: Chaos Mesh ou LitmusChaos instalado no cluster como CRD. Define experimentos como YAML declarativo.</li><li><strong>Observability integrada</strong>: Prometheus + Grafana monitorando steady state durante experimento. Alert manager configurado para abortar se threshold cruzar.</li><li><strong>Kill switch automático</strong>: experimento tem TTL máximo e abort conditions declaradas no YAML.</li><li><strong>Pipeline de chaos</strong>: experimentos commitados no git, executados via CI/CD em horário de trabalho.</li><li><strong>Relatório automático</strong>: após cada experimento, relatório gerado com steady state antes/durante/depois.</li></ul><p>Tipos de falha cobertos: pod kill, network latency/loss, CPU/memory stress, node failure.</p>',
      tip: 'Mencione Chaos Mesh CRDs (PodChaos, NetworkChaos, IOChaos) — demonstra conhecimento prático de Kubernetes chaos.',
    },
    {
      level: 'senior',
      q: 'Qual a diferença entre chaos engineering e fault injection testing?',
      a: '<p><strong>Fault injection testing</strong>: técnica de QA onde falhas específicas e conhecidas são injetadas para verificar comportamento documentado. É <em>caixa-branca</em> — você sabe o que vai quebrar e valida que o sistema responde como especificado.</p><p><strong>Chaos engineering</strong>: disciplina de resiliência onde você formula hipóteses sobre comportamento do sistema e injeta falhas para confirmar ou refutar. É <em>descoberta</em> — você não sabe o que vai encontrar.</p><p>Analogia: fault injection testing é como testar se o airbag infla quando o sensor dispara; chaos engineering é simular um acidente real pra descobrir o que mais pode falhar.</p>',
      tip: 'Esta distinção aparece em entrevistas de Staff e Principal. Demonstra maturidade conceitual além de "instalar Gremlin".',
    },
    {
      level: 'senior',
      q: 'Como lidar com stakeholders resistentes a chaos engineering em produção?',
      a: '<p>Abordagem gradual e baseada em evidências:</p><ul><li><strong>Começar em staging</strong>: primeiro game day em staging, sem risco. Mostra o valor com evidência real (bugs encontrados, gaps de runbook).</li><li><strong>Comunicação proativa</strong>: anunciar experimentos com antecedência — data, horário, escopo, duração máxima, blast radius, plano de rollback. Stakeholders resistem ao desconhecido, não ao processo claro.</li><li><strong>Post-mortem de incidentes reais</strong>: mostrar que o incidente do mês passado teria sido encontrado por chaos. Converte ceticismo em urgência.</li><li><strong>Métricas de valor</strong>: custo de downtime não planejado vs custo de experimento controlado. ROI concreto.</li></ul>',
      tip: 'A resposta sênior demonstra habilidade de navegação organizacional, não só técnica. Chaos engineering é tanto cultural quanto técnico.',
    },
    {
      level: 'senior',
      q: 'Como chaos engineering se relaciona com SRE (Site Reliability Engineering)?',
      a: '<p>Chaos engineering é uma das práticas centrais de SRE. A relação:</p><ul><li><strong>SLOs e steady state</strong>: o steady state hypothesis de chaos é baseado nos SLOs do sistema. Se SLO de disponibilidade é 99.9%, chaos deve confirmar que o sistema sobrevive a falhas mantendo esse SLO.</li><li><strong>Error budget</strong>: experimentos de chaos consomem error budget. SRE balanceia quanto budget gastar em chaos vs risco de incidente real.</li><li><strong>Postmortem loop</strong>: incidentes reais alimentam novos cenários de chaos — reproduce o cenário em staging, valida a correção, garante que não vai regredir.</li><li><strong>Toil reduction</strong>: chaos bem feito reduz toil ao longo do tempo — menos incidentes não planejados, mais tempo para engenharia de produto.</li></ul>',
      tip: 'Mencione o livro SRE do Google, que tem capítulo específico sobre chaos. Demonstra que você leu as fontes primárias.',
    },
    {
      level: 'pleno',
      q: 'Quais tipos de falha podem ser simulados com chaos engineering?',
      a: '<p>Classificados por camada:</p><ul><li><strong>Infraestrutura</strong>: instância encerrada, nó Kubernetes morto, AZ inteira indisponível.</li><li><strong>Rede</strong>: latência injetada (100ms, 500ms, 2s), perda de pacotes (5%, 20%), partição de rede, DNS lento ou inválido.</li><li><strong>Aplicação</strong>: erro HTTP (500, 503) injetado na resposta, timeout de chamadas entre serviços.</li><li><strong>Recursos</strong>: CPU stress (80%, 100%), exaustão de memória, disco cheio, file descriptors esgotados.</li><li><strong>Dependência</strong>: banco de dados indisponível, cache Redis down, mensageria (Kafka) com lag alto, S3 retornando erro.</li><li><strong>Humano</strong>: deploy quebrado, rollback mal executado, configuração errada.</li></ul>',
      tip: 'Organize por camada — isso demonstra pensamento sistêmico. Mencione que a maioria dos incidentes reais é de rede ou dependência, não de instância.',
    },
    {
      level: 'pleno',
      q: 'O que é o Chaos Monkey e como ele funciona?',
      a: '<p><strong>Chaos Monkey</strong> é a ferramenta original de chaos engineering, criada pela Netflix em 2011. Atualmente parte do Simian Army.</p><p>Funcionamento:</p><ul><li>Roda como serviço dentro da infraestrutura Netflix/AWS</li><li>Em horário comercial (não às 3h da manhã — equipe disponível), termina instâncias EC2 aleatoriamente</li><li>Força o time a garantir que serviços sobrevivam a perda de qualquer instância individual</li><li>Não é configurável por padrão para matar instâncias críticas (excluídas explicitamente)</li></ul><p>Legado: forçou a Netflix a construir sistemas genuinamente resilientes à falha de instância. Hoje é expectativa mínima, não diferencial.</p>',
      tip: 'Mencione que Chaos Monkey só testa falha de instância — é o tipo mais simples. Ferramentas modernas como Gremlin e Chaos Mesh cobrem rede, CPU, memória, Kubernetes.',
    },
    {
      level: 'pleno',
      q: 'Quais ferramentas de chaos engineering existem e quando usar cada uma?',
      a: '<p>Por caso de uso:</p><ul><li><strong>Chaos Monkey</strong> (Netflix, open-source): terminar instâncias EC2 aleatoriamente. Simples, limitado a infra AWS.</li><li><strong>Gremlin</strong> (managed SaaS): interface visual, catálogo de ataques rico (rede, CPU, memória, estado), ótimo para equipes iniciando. Caro.</li><li><strong>AWS FIS</strong> (AWS Fault Injection Simulator): nativo AWS, integrado com IAM e CloudWatch, suporta EC2/ECS/EKS/RDS. Melhor opção para stacks AWS puras.</li><li><strong>LitmusChaos</strong> (CNCF, open-source): Kubernetes-native via CRDs. Gratuito, integra com Argo Workflows. Melhor para Kubernetes.</li><li><strong>Chaos Mesh</strong> (CNCF, open-source): Kubernetes-native, interface web, suporte a caos de rede, I/O e kernel.</li><li><strong>Toxiproxy</strong> (Shopify): proxy que simula condições de rede adversas. Ótimo para testes de integração.</li></ul>',
      tip: 'Mencione que a escolha depende do stack: AWS puro → FIS; Kubernetes → LitmusChaos ou Chaos Mesh; equipe iniciando → Gremlin pela UX.',
    },
    {
      level: 'senior',
      q: 'Como chaos engineering se aplica em ambiente de microsserviços?',
      a: '<p>Microsserviços são o ambiente onde chaos entrega mais valor — porque as falhas em cascata são o risco principal.</p><p>Cenários específicos:</p><ul><li><strong>Cascading failure</strong>: matar serviço B e observar se A (que depende de B) implementa circuit breaker corretamente ou propaga falha.</li><li><strong>Timeout handling</strong>: injetar latência em chamada A→B e verificar se A tem timeout configurado corretamente (não espera indefinidamente).</li><li><strong>Retry storm</strong>: simular serviço lento e observar se retries sem jitter sobrecarregam o serviço em recuperação.</li><li><strong>Service mesh chaos</strong>: com Istio ou Linkerd, injetar falhas no nível do sidecar — transparente para a aplicação.</li><li><strong>Bulkhead validation</strong>: verificar se thread pool de chamadas externas é isolado do pool interno (falha externa não drena recursos internos).</li></ul>',
      tip: 'Mencione a diferença entre chaos na aplicação e chaos no service mesh. Chaos via Istio/Linkerd é mais seguro porque não requer código na aplicação.',
    },
    {
      level: 'senior',
      q: 'Como você documentaria e compartilharia os resultados de experimentos de chaos?',
      a: '<p>Documentação estruturada por experimento:</p><ul><li><strong>Hipótese</strong>: afirmação mensurável sobre o comportamento esperado</li><li><strong>Método</strong>: qual falha injetada, com que ferramentas, por quanto tempo, blast radius</li><li><strong>Steady state antes</strong>: snapshot das métricas antes do experimento</li><li><strong>Resultados</strong>: o que aconteceu durante a injeção — confirmou ou refutou hipótese</li><li><strong>Fraquezas encontradas</strong>: lista de issues descobertos, com severidade</li><li><strong>Ações tomadas</strong>: correções implementadas ou planejadas (com owner e prazo)</li></ul><p>Formatos de compartilhamento:</p><ul><li>Wiki interna com todos os experimentos históricos (busca por serviço, tipo de falha)</li><li>Reunião mensal de "chaos review" similar ao postmortem review</li><li>Dashboard de cobertura de chaos por serviço — visível para toda a engenharia</li></ul>',
      tip: 'Demonstre que você pensa em chaos como programa contínuo, não experimento único. A documentação é o que cria valor organizacional.',
    },
    {
      level: 'senior',
      q: 'Quais anti-padrões críticos em chaos engineering você identificaria numa revisão de programa?',
      a: '<p>Anti-padrões que destroem valor:</p><ul><li><strong>Chaos sem hipótese</strong>: "vamos matar pods pra ver o que acontece". Aprendizado zero, risco máximo.</li><li><strong>Blast radius grande demais desde o início</strong>: 100% de tráfego no primeiro experimento. Arrogância.</li><li><strong>Sem abort condition</strong>: experimento que continua mesmo com steady state degradado. Incidente garantido.</li><li><strong>Horário errado</strong>: chaos às 2h da manhã quando ninguém está disponível. Valor zero, risco total.</li><li><strong>Sem observability</strong>: você injeta falha mas não tem dashboard pra ver o impacto. Aprendizado zero.</li><li><strong>Punição por incidentes de chaos</strong>: equipe só faz chaos se saber que não será culpada se algo errar. Cultura de blameless é pré-req.</li><li><strong>Chaos em sistema não compreendido</strong>: injetar falha em sistema legado que ninguém entende o comportamento normal. Você não saberá distinguir bug de chaos do bug original.</li></ul>',
      tip: 'A resposta que impressiona é identificar o anti-padrão cultural (punição) além dos técnicos. Chaos engineering falha por cultura, não por tecnologia.',
    },
    {
      level: 'senior',
      q: 'Como você garantiria que correções descobertas por chaos não regridam com o tempo?',
      a: '<p>Processo de não-regressão:</p><ul><li><strong>Chaos como CI</strong>: após cada correção validada, o experimento que a descobriu vira teste de regressão no pipeline. Roda a cada deploy ou diariamente.</li><li><strong>Runbook versionado</strong>: o runbook de resposta ao cenário é commitado no git e atualizado junto com o código.</li><li><strong>Feature flag para chaos</strong>: experimentos desativados por flag — podem ser reativados instantaneamente sem deploy.</li><li><strong>Coverage dashboard</strong>: track de quais serviços passaram por experimento recentemente. Alerta se um serviço não foi testado há mais de 30 dias.</li><li><strong>Chaos no pull request</strong>: para serviços críticos, chaos experiment roda automaticamente como gate de PR antes do merge.</li></ul>',
      tip: 'A palavra-chave que impressiona é "chaos como CI" — transformar experimento ad-hoc em automação de não-regressão. Isso é maturidade de programa.',
    },
  ],
  diagrams: [
    {
      title: 'Fluxo do Experimento de Chaos',
      html: `<style>
.ce-flow { font-family: 'JetBrains Mono', monospace; background: #0f172a; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.ce-flow-steps { display: flex; flex-direction: column; gap: 0; }
.ce-step { display: flex; align-items: flex-start; gap: 16px; }
.ce-step-connector { display: flex; flex-direction: column; align-items: center; }
.ce-step-num { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
.ce-step-line { width: 2px; height: 40px; background: #334155; flex-shrink: 0; }
.ce-step-body { padding-bottom: 24px; }
.ce-step-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
.ce-step-desc { font-size: 12px; color: #94a3b8; line-height: 1.5; }
.ce-step-code { margin-top: 6px; background: #1e293b; border-radius: 6px; padding: 8px 12px; font-size: 11px; color: #7dd3fc; }
</style>
<div class="ce-flow">
  <h3 style="margin:0 0 20px;font-size:15px;color:#f97316;letter-spacing:.05em;">METODOLOGIA DE CHAOS ENGINEERING</h3>
  <div class="ce-flow-steps">
    <div class="ce-step">
      <div class="ce-step-connector"><div class="ce-step-num" style="background:#1e3a5f;color:#38bdf8;">1</div><div class="ce-step-line"></div></div>
      <div class="ce-step-body"><div class="ce-step-title" style="color:#38bdf8;">Definir Steady State</div><div class="ce-step-desc">Métrica mensurável que representa sistema saudável. Ex: P99 &lt; 300ms, taxa de erro &lt; 0.1%, throughput &gt; 1000 req/s.</div><div class="ce-step-code">// Prometheus query de steady state<br>rate(http_requests_total{status="5xx"}[5m]) &lt; 0.001</div></div>
    </div>
    <div class="ce-step">
      <div class="ce-step-connector"><div class="ce-step-num" style="background:#1a2e1a;color:#4ade80;">2</div><div class="ce-step-line"></div></div>
      <div class="ce-step-body"><div class="ce-step-title" style="color:#4ade80;">Formular Hipótese</div><div class="ce-step-desc">Afirmação sobre o que acontecerá. "Esperamos que o sistema mantenha steady state mesmo com 1 instância do serviço X indisponível."</div></div>
    </div>
    <div class="ce-step">
      <div class="ce-step-connector"><div class="ce-step-num" style="background:#2d1f00;color:#f97316;">3</div><div class="ce-step-line"></div></div>
      <div class="ce-step-body"><div class="ce-step-title" style="color:#f97316;">Definir Blast Radius</div><div class="ce-step-desc">Escopo mínimo possível: 1% tráfego, 1 instância, 1 AZ. Abort condition: se steady state degradar, rollback automático.</div></div>
    </div>
    <div class="ce-step">
      <div class="ce-step-connector"><div class="ce-step-num" style="background:#2d1a1a;color:#f87171;">4</div><div class="ce-step-line"></div></div>
      <div class="ce-step-body"><div class="ce-step-title" style="color:#f87171;">Injetar Falha</div><div class="ce-step-desc">Executar o experimento com duração máxima definida. Monitorar steady state em tempo real. Kill switch disponível.</div></div>
    </div>
    <div class="ce-step">
      <div class="ce-step-connector"><div class="ce-step-num" style="background:#1e293b;color:#a78bfa;">5</div><div class="ce-step-line"></div></div>
      <div class="ce-step-body"><div class="ce-step-title" style="color:#a78bfa;">Observar e Aprender</div><div class="ce-step-desc">Hipótese confirmada? Sistema sobreviveu. Refutada? Fraqueza encontrada — corrigir e re-testar. Documentar resultado.</div></div>
    </div>
  </div>
</div>`,
      caption: 'O método científico aplicado a sistemas distribuídos: hipótese → experimento → observação → aprendizado.',
    },
    {
      title: 'Blast Radius — Progressão Segura',
      html: `<style>
.ce-blast { font-family: 'Space Grotesk', sans-serif; background: #0f172a; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.ce-blast-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
.ce-blast-phase { background: #1e293b; border-radius: 10px; padding: 16px; position: relative; overflow: hidden; }
.ce-blast-label { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 8px; }
.ce-blast-scope { font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.ce-blast-detail { font-size: 11px; color: #94a3b8; line-height: 1.5; }
.ce-blast-bg { position: absolute; right: -10px; bottom: -10px; font-size: 48px; opacity: .06; }
.ce-blast-tag { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-bottom: 8px; }
</style>
<div class="ce-blast">
  <h3 style="margin:0 0 4px;font-size:15px;color:#f97316;">PROGRESSÃO DE BLAST RADIUS</h3>
  <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Nunca pule etapas — valide cada nível antes de expandir.</p>
  <div class="ce-blast-grid">
    <div class="ce-blast-phase" style="border-left:3px solid #4ade80;">
      <div class="ce-blast-tag" style="background:#052e16;color:#4ade80;">FASE 1 — Staging</div>
      <div class="ce-blast-scope">1 instância / 0% prod</div>
      <div class="ce-blast-detail">Ambiente isolado. Time presente. Sem risco real. Aprende gaps de observability e runbook. Pode durar semanas ou meses.</div>
      <div class="ce-blast-bg">🟢</div>
    </div>
    <div class="ce-blast-phase" style="border-left:3px solid #38bdf8;">
      <div class="ce-blast-tag" style="background:#0c1e2d;color:#38bdf8;">FASE 2 — 1% Prod</div>
      <div class="ce-blast-scope">1 instância / canary 1%</div>
      <div class="ce-blast-detail">Primeiro contato com produção real. Horário comercial. Duração máxima 5-15min. Kill switch manual ativo.</div>
      <div class="ce-blast-bg">🔵</div>
    </div>
    <div class="ce-blast-phase" style="border-left:3px solid #f59e0b;">
      <div class="ce-blast-tag" style="background:#2d1f00;color:#f59e0b;">FASE 3 — 10-25% Prod</div>
      <div class="ce-blast-scope">N instâncias / 10-25% tráfego</div>
      <div class="ce-blast-detail">Confiança estabelecida. Abort automático se steady state degrada. Relatório gerado automaticamente após.</div>
      <div class="ce-blast-bg">🟡</div>
    </div>
    <div class="ce-blast-phase" style="border-left:3px solid #f97316;">
      <div class="ce-blast-tag" style="background:#1f0f00;color:#f97316;">FASE 4 — Chaos Contínuo</div>
      <div class="ce-blast-scope">Automático / 100% tráfego</div>
      <div class="ce-blast-detail">Chaos Monkey ou LitmusChaos rodando diariamente. Integrado ao pipeline. Maturidade máxima. Anos de experiência.</div>
      <div class="ce-blast-bg">🟠</div>
    </div>
  </div>
  <div style="margin-top:16px;background:#1e293b;border-radius:8px;padding:12px;font-size:12px;color:#94a3b8;">
    <strong style="color:#f87171;">Abort condition obrigatória:</strong> se P99 &gt; threshold ou error rate &gt; limiar durante experimento → abortar imediatamente + rollback automático.
  </div>
</div>`,
      caption: 'A maturidade de chaos engineering é proporcional ao blast radius que você consegue operar com segurança.',
    },
    {
      title: 'Ferramentas de Chaos por Caso de Uso',
      html: `<style>
.ce-tools { font-family: 'Space Grotesk', sans-serif; background: #0f172a; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.ce-tool-row { display: grid; grid-template-columns: 140px 1fr 90px; gap: 12px; padding: 12px; border-radius: 8px; margin-bottom: 8px; align-items: center; }
.ce-tool-name { font-weight: 700; font-size: 13px; }
.ce-tool-desc { font-size: 12px; color: #94a3b8; line-height: 1.4; }
.ce-tool-tag { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-align: center; }
.ce-types { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
.ce-type-chip { font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 600; }
</style>
<div class="ce-tools">
  <h3 style="margin:0 0 16px;font-size:15px;color:#f97316;">FERRAMENTAS DE CHAOS — QUANDO USAR</h3>
  <div class="ce-tool-row" style="background:#1a2e1a;">
    <div><div class="ce-tool-name" style="color:#4ade80;">Chaos Monkey</div></div>
    <div class="ce-tool-desc">Termina instâncias EC2 aleatoriamente em horário comercial. Simples, limitado a AWS EC2. Ponto de partida histórico da Netflix.</div>
    <div class="ce-tool-tag" style="background:#052e16;color:#4ade80;">Open-source</div>
  </div>
  <div class="ce-tool-row" style="background:#1e2a3a;">
    <div><div class="ce-tool-name" style="color:#38bdf8;">AWS FIS</div></div>
    <div class="ce-tool-desc">Fault Injection Simulator nativo AWS. Integrado com IAM, CloudWatch, EventBridge. Suporta EC2, ECS, EKS, RDS, ASG. Melhor para stacks AWS puras.</div>
    <div class="ce-tool-tag" style="background:#0c1e2d;color:#38bdf8;">AWS Native</div>
  </div>
  <div class="ce-tool-row" style="background:#1f1a2e;">
    <div><div class="ce-tool-name" style="color:#a78bfa;">LitmusChaos</div></div>
    <div class="ce-tool-desc">CNCF project. Kubernetes-native via CRDs. Gratuito. Integra com Argo Workflows para pipelines de chaos. Melhor para Kubernetes.</div>
    <div class="ce-tool-tag" style="background:#1a0d3d;color:#a78bfa;">CNCF</div>
  </div>
  <div class="ce-tool-row" style="background:#1f1a2e;">
    <div><div class="ce-tool-name" style="color:#c084fc;">Chaos Mesh</div></div>
    <div class="ce-tool-desc">Kubernetes-native, interface web, suporte a caos de rede, I/O e kernel. PodChaos, NetworkChaos, IOChaos como CRDs.</div>
    <div class="ce-tool-tag" style="background:#1a0d3d;color:#c084fc;">CNCF</div>
  </div>
  <div class="ce-tool-row" style="background:#2d1a1a;">
    <div><div class="ce-tool-name" style="color:#f87171;">Gremlin</div></div>
    <div class="ce-tool-desc">SaaS managed. Interface visual excelente. Catálogo rico de ataques. Melhor para equipes iniciando. Tem custo alto.</div>
    <div class="ce-tool-tag" style="background:#1a0505;color:#f87171;">SaaS</div>
  </div>
  <div class="ce-tool-row" style="background:#1e293b;">
    <div><div class="ce-tool-name" style="color:#f59e0b;">Toxiproxy</div></div>
    <div class="ce-tool-desc">Proxy TCP que simula condições de rede adversas: latência, bandwidth limitado, slow close. Ótimo para testes de integração locais.</div>
    <div class="ce-tool-tag" style="background:#2d1f00;color:#f59e0b;">Dev/Test</div>
  </div>
</div>`,
      caption: 'Escolha baseada no stack: AWS → FIS; Kubernetes → LitmusChaos/Chaos Mesh; equipe iniciando → Gremlin; integração local → Toxiproxy.',
    },
  ],
  mnemonics: [
    {
      label: 'SHIBE — Pré-requisitos de Chaos',
      trick: 'SHIBE: Steady state, Hipótese, Integrado (observability), Blast radius, Escape hatch',
      explanation: 'Sem Steady state você não sabe o que é saudável. Sem Hipótese não há aprendizado. Sem Integração com observability você é cego. Sem Blast radius limitado você arrisca tudo. Sem Escape hatch (kill switch) você não pode parar se der errado.',
    },
    {
      label: 'GGS — Ordem de Maturidade',
      trick: 'GGS: Game day → Gradual (1%) → Sistemático (automático)',
      explanation: 'Nunca pule etapas: começa com Game day em staging (sem risco), evolui para Gradual em produção (1% tráfego, manual), só então vai para Sistemático e automático (Chaos Monkey contínuo). A ordem é inegociável.',
    },
    {
      label: '"Não é sabotagem, é ciência"',
      trick: 'Chaos = método científico: Hipótese → Experimento → Evidência → Conclusão',
      explanation: 'Chaos engineering não é "quebrar coisas para ver". É formular hipótese mensurável, injetar falha controlada, coletar evidência (métricas), e concluir se o sistema é resiliente ou não. Sem hipótese, é sabotagem. Com hipótese, é ciência.',
    },
    {
      label: 'BRAIN — Anti-padrões críticos',
      trick: 'BRAIN: Blast radius grande, Runbook ausente, Abort sem condição, Ignorar observability, Noite (horário errado)',
      explanation: 'B-Blast radius 100% no primeiro experimento. R-Runbook inexistente. A-Abort condition não configurada. I-Ignorar observability (você é cego). N-Noite/fora do horário comercial (ninguém disponível). Qualquer um desses mata o programa de chaos.',
    },
  ],
  cheatsheet: {
    title: 'Chaos Engineering — Cheatsheet',
    html: `<style>
.ce-cs { font-family: 'JetBrains Mono', monospace; background: #0f172a; padding: 20px; border-radius: 10px; color: #e2e8f0; font-size: 12px; }
.ce-cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.ce-cs-section { background: #1e293b; border-radius: 8px; padding: 14px; }
.ce-cs-title { font-size: 11px; font-weight: 700; color: #f97316; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #334155; padding-bottom: 6px; }
.ce-cs-item { display: flex; gap: 8px; margin-bottom: 6px; align-items: flex-start; }
.ce-cs-label { color: #38bdf8; font-weight: 700; min-width: 100px; }
.ce-cs-val { color: #94a3b8; }
.ce-cs-tag { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 10px; font-weight: 700; }
</style>
<div class="ce-cs">
  <div style="text-align:center;margin-bottom:16px;font-size:14px;color:#f97316;font-weight:700;">CHAOS ENGINEERING — REFERÊNCIA RÁPIDA</div>
  <div class="ce-cs-grid">
    <div class="ce-cs-section">
      <div class="ce-cs-title">Conceitos Core</div>
      <div class="ce-cs-item"><span class="ce-cs-label">Steady State</span><span class="ce-cs-val">Métrica que define sistema saudável (P99, throughput, error rate)</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label">Hipótese</span><span class="ce-cs-val">"Sistema mantém steady state quando X acontecer"</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label">Blast Radius</span><span class="ce-cs-val">Escopo do impacto. Começar mínimo (1 instância)</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label">Abort Condition</span><span class="ce-cs-val">Critério automático de parada + rollback</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label">Game Day</span><span class="ce-cs-val">Exercício coordenado em staging. Começo do programa.</span></div>
    </div>
    <div class="ce-cs-section">
      <div class="ce-cs-title">Tipos de Falha</div>
      <div class="ce-cs-item"><span class="ce-cs-label">Infraestrutura</span><span class="ce-cs-val">Instância terminada, nó K8s morto, AZ down</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label">Rede</span><span class="ce-cs-val">Latência (100ms–2s), perda de pacotes, partição</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label">Aplicação</span><span class="ce-cs-val">HTTP 500/503 injetado, timeout entre serviços</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label">Recursos</span><span class="ce-cs-val">CPU 100%, exaustão de memória, disco cheio</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label">Dependência</span><span class="ce-cs-val">DB down, cache miss, Kafka lag alto</span></div>
    </div>
    <div class="ce-cs-section">
      <div class="ce-cs-title">Ferramentas</div>
      <div class="ce-cs-item"><span class="ce-cs-label" style="color:#4ade80;">Chaos Monkey</span><span class="ce-cs-val">Instâncias EC2. Netflix. Open-source.</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label" style="color:#38bdf8;">AWS FIS</span><span class="ce-cs-val">Nativo AWS. EC2/ECS/EKS/RDS. IAM integrado.</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label" style="color:#a78bfa;">LitmusChaos</span><span class="ce-cs-val">Kubernetes CRDs. CNCF. Open-source.</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label" style="color:#c084fc;">Chaos Mesh</span><span class="ce-cs-val">Kubernetes. Web UI. CNCF.</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label" style="color:#f87171;">Gremlin</span><span class="ce-cs-val">SaaS managed. Melhor UX. Caro.</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label" style="color:#f59e0b;">Toxiproxy</span><span class="ce-cs-val">Proxy rede. Testes de integração local.</span></div>
    </div>
    <div class="ce-cs-section">
      <div class="ce-cs-title">Pré-requisitos</div>
      <div class="ce-cs-item"><span class="ce-cs-label" style="color:#4ade80;">✓ Obrigatório</span><span class="ce-cs-val">Observability (métricas, logs, traces)</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label" style="color:#4ade80;">✓ Obrigatório</span><span class="ce-cs-val">On-call funcional + runbook</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label" style="color:#4ade80;">✓ Obrigatório</span><span class="ce-cs-val">Rollback confiável + kill switch</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label" style="color:#f59e0b;">◎ Recomendado</span><span class="ce-cs-val">Cultura blameless + postmortem</span></div>
      <div class="ce-cs-item"><span class="ce-cs-label" style="color:#f87171;">✗ Anti-padrão</span><span class="ce-cs-val">Chaos sem hipótese = sabotagem</span></div>
    </div>
  </div>
  <div style="margin-top:14px;background:#1e293b;border-radius:8px;padding:12px;text-align:center;">
    <span style="color:#f59e0b;font-weight:700;">Progressão: </span>
    <span style="color:#94a3b8;">Game Day Staging → 1% Prod → 10-25% Prod → Chaos Contínuo Automático</span>
  </div>
</div>`,
    caption: 'Referência rápida: conceitos, tipos de falha, ferramentas, pré-requisitos e progressão de maturidade.',
  },
  mindmap: {
    title: 'Chaos Engineering — Mind Map',
    html: `<style>
.ce-mm { font-family: 'Space Grotesk', sans-serif; background: #0f172a; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.ce-mm-center { background: #f97316; color: #fff; border-radius: 12px; padding: 12px 24px; text-align: center; font-weight: 700; font-size: 15px; display: inline-block; margin-bottom: 20px; }
.ce-mm-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
.ce-mm-branch { background: #1e293b; border-radius: 10px; padding: 14px; border-top: 3px solid; }
.ce-mm-branch-title { font-weight: 700; font-size: 13px; margin-bottom: 8px; }
.ce-mm-leaf { font-size: 11px; color: #94a3b8; padding: 3px 0; display: flex; gap: 6px; align-items: flex-start; }
.ce-mm-leaf::before { content: "•"; flex-shrink: 0; margin-top: 1px; }
</style>
<div class="ce-mm">
  <div style="text-align:center;"><div class="ce-mm-center">CHAOS ENGINEERING</div></div>
  <div class="ce-mm-grid">
    <div class="ce-mm-branch" style="border-color:#38bdf8;">
      <div class="ce-mm-branch-title" style="color:#38bdf8;">Metodologia</div>
      <div class="ce-mm-leaf">Steady State Hypothesis</div>
      <div class="ce-mm-leaf">Hipótese explícita</div>
      <div class="ce-mm-leaf">Experimento controlado</div>
      <div class="ce-mm-leaf">Observação de métricas</div>
      <div class="ce-mm-leaf">Conclusão e correção</div>
    </div>
    <div class="ce-mm-branch" style="border-color:#4ade80;">
      <div class="ce-mm-branch-title" style="color:#4ade80;">Pré-requisitos</div>
      <div class="ce-mm-leaf">Observability (métricas/traces)</div>
      <div class="ce-mm-leaf">On-call + runbook</div>
      <div class="ce-mm-leaf">Kill switch / rollback</div>
      <div class="ce-mm-leaf">Cultura blameless</div>
      <div class="ce-mm-leaf">SLOs definidos</div>
    </div>
    <div class="ce-mm-branch" style="border-color:#f97316;">
      <div class="ce-mm-branch-title" style="color:#f97316;">Blast Radius</div>
      <div class="ce-mm-leaf">Staging → 1% → 25% → 100%</div>
      <div class="ce-mm-leaf">Abort condition automático</div>
      <div class="ce-mm-leaf">TTL máximo por experimento</div>
      <div class="ce-mm-leaf">Horário comercial primeiro</div>
    </div>
    <div class="ce-mm-branch" style="border-color:#f87171;">
      <div class="ce-mm-branch-title" style="color:#f87171;">Tipos de Falha</div>
      <div class="ce-mm-leaf">Instância / nó encerrado</div>
      <div class="ce-mm-leaf">Latência e perda de rede</div>
      <div class="ce-mm-leaf">CPU / memória stress</div>
      <div class="ce-mm-leaf">Dependência indisponível</div>
      <div class="ce-mm-leaf">Partição de rede</div>
    </div>
    <div class="ce-mm-branch" style="border-color:#a78bfa;">
      <div class="ce-mm-branch-title" style="color:#a78bfa;">Ferramentas</div>
      <div class="ce-mm-leaf">Chaos Monkey (instâncias EC2)</div>
      <div class="ce-mm-leaf">AWS FIS (stack AWS)</div>
      <div class="ce-mm-leaf">LitmusChaos / Chaos Mesh (K8s)</div>
      <div class="ce-mm-leaf">Gremlin (SaaS, iniciantes)</div>
      <div class="ce-mm-leaf">Toxiproxy (rede local)</div>
    </div>
    <div class="ce-mm-branch" style="border-color:#f59e0b;">
      <div class="ce-mm-branch-title" style="color:#f59e0b;">Maturidade</div>
      <div class="ce-mm-leaf">1. Game Day (staging)</div>
      <div class="ce-mm-leaf">2. Manual em prod (1%)</div>
      <div class="ce-mm-leaf">3. Automatizado (CI)</div>
      <div class="ce-mm-leaf">4. Chaos contínuo (diário)</div>
      <div class="ce-mm-leaf">5. Chaos como gate de PR</div>
    </div>
  </div>
</div>`,
    caption: 'Visão completa do ecossistema de chaos engineering: metodologia, pré-requisitos, tipos de falha e progressão.',
  },
  exercises: [
    {
      level: 'iniciante',
      title: 'Game Day em ambiente local',
      description: 'Configure uma aplicação Node.js simples com dois serviços (A chama B via HTTP). Defina uma steady state (B responde em menos de 200ms). Mate o processo B manualmente e observe o comportamento de A. A está retornando erro 500? Timeout depois de quanto tempo? Implemente um circuit breaker básico em A e repita o experimento.',
      concepts: ['steady state', 'blast radius', 'game day', 'circuit breaker', 'observability'],
    },
    {
      level: 'intermediario',
      title: 'Injeção de latência com Toxiproxy',
      description: 'Instale Toxiproxy e configure-o como proxy entre sua aplicação e um banco PostgreSQL. Injete latência de 500ms e de 2s nas chamadas ao banco. Observe como sua aplicação se comporta: há timeout configurado? Retries? O health check reflete a degradação? Corrija os problemas encontrados e re-teste com Toxiproxy.',
      concepts: ['toxiproxy', 'latência injetada', 'timeout', 'retry', 'health check', 'steady state'],
    },
    {
      level: 'senior',
      title: 'Programa de Chaos Engineering com LitmusChaos',
      description: 'Em um cluster Kubernetes (pode ser Kind ou k3s local), instale o LitmusChaos. Defina um experimento de PodChaos que mata 1 pod do seu deployment. Configure abort conditions baseadas em métricas do Prometheus. Adicione o experimento ao pipeline de CI (GitHub Actions) como validação automática após deploy. Documente hipótese, steady state, resultado e ações corretivas.',
      concepts: ['LitmusChaos', 'Kubernetes', 'PodChaos CRD', 'abort condition', 'Prometheus', 'CI/CD', 'hipótese', 'steady state'],
    },
  ],
  videos: [
    {
      title: 'Chaos Engineering at Netflix — Principles of Chaos',
      channel: 'InfoQ',
      url: 'https://www.youtube.com/watch?v=rd2KQ5BPKBQ',
      topic: 'Fundamentos do chaos engineering, origem na Netflix',
    },
    {
      title: 'Chaos Engineering: Why Breaking Things Should Be Practiced',
      channel: 'AWS',
      url: 'https://www.youtube.com/watch?v=RltGGFq0Aak',
      topic: 'AWS FIS, game days, blast radius em produção',
    },
    {
      title: 'LitmusChaos — Kubernetes Chaos Engineering',
      channel: 'CNCF',
      url: 'https://www.youtube.com/watch?v=e9_YcTMjrU8',
      topic: 'LitmusChaos CRDs, integração com Argo Workflows',
    },
    {
      title: 'Building Confidence in System Behavior with Chaos Engineering',
      channel: 'GOTO Conferences',
      url: 'https://www.youtube.com/watch?v=OsEGl65g7-w',
      topic: 'Hipótese, steady state, métricas de sucesso do programa',
    },
    {
      title: 'Chaos Engineering at Scale — Game Days and Automation',
      channel: 'SREcon',
      url: 'https://www.youtube.com/watch?v=v1E7TfJQp10',
      topic: 'Game days, progressão para automação, SRE integration',
    },
  ],
  resources: [
    { title: 'Principles of Chaos Engineering — principlesofchaos.org', url: 'https://principlesofchaos.org/', kind: 'docs' },
    { title: 'Chaos Engineering (Rosenthal et al., O\'Reilly)', url: 'https://www.oreilly.com/library/view/chaos-engineering/9781492043850/', kind: 'livro' },
    { title: 'Netflix Tech Blog — Chaos Engineering', url: 'https://netflixtechblog.com/tagged/chaos-engineering', kind: 'artigo' },
    { title: 'AWS Fault Injection Simulator — Docs', url: 'https://docs.aws.amazon.com/fis/', kind: 'docs' },
    { title: 'LitmusChaos Docs — Kubernetes Chaos Engineering', url: 'https://docs.litmuschaos.io/', kind: 'docs' },
    { title: 'Chaos Mesh Docs', url: 'https://chaos-mesh.org/docs/', kind: 'docs' },
    { title: 'Gremlin — Chaos Engineering Tutorials', url: 'https://www.gremlin.com/community/tutorials/', kind: 'curso' },
    { title: 'Google SRE Book — Chapter 33: Reliable Product Launches', url: 'https://sre.google/sre-book/reliable-product-launches/', kind: 'livro' },
    { title: 'Toxiproxy — GitHub', url: 'https://github.com/Shopify/toxiproxy', kind: 'pratica' },
  ],
  codeExamples: [
    {
      title: 'LitmusChaos — PodChaos CRD (matar pod aleatório)',
      language: 'yaml',
      code: `# litmus-pod-chaos.yaml
# Mata 1 pod do deployment "api" e valida se steady state se mantém
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: pod-chaos-experiment
  namespace: default
spec:
  # Steady state probe — aborta se HTTP check falhar
  engineState: active
  appinfo:
    appns: default
    applabel: app=api
    appkind: deployment

  experiments:
    - name: pod-delete
      spec:
        components:
          env:
            - name: TOTAL_CHAOS_DURATION
              value: "60"    # 60 segundos de experimento
            - name: CHAOS_INTERVAL
              value: "10"    # matar pod a cada 10s
            - name: FORCE
              value: "false" # graceful shutdown
            - name: PODS_AFFECTED_PERC
              value: "50"    # afeta 50% dos pods

  # Probe que verifica steady state durante o experimento
  probes:
    - name: check-api-health
      type: httpProbe
      mode: Continuous
      httpProbe/inputs:
        url: http://api-service/health
        insecureSkipVerify: false
        expectedResponseCode: "200"
        responseTimeout: 2000   # aborta se demorar > 2s
      runProperties:
        probeTimeout: 5
        interval: 5
        retry: 1`,
    },
    {
      title: 'Toxiproxy — Injetar latência em chamada ao banco',
      language: 'typescript',
      code: `// Usando Toxiproxy Node.js client para testes de integração
// npm install toxiproxy-node-client

import Toxiproxy from 'toxiproxy-node-client'

const toxiproxy = new Toxiproxy('http://localhost:8474')

async function runLatencyExperiment() {
  // Cria proxy entre aplicação e Postgres
  const proxy = await toxiproxy.createProxy({
    name: 'postgres',
    listen: '0.0.0.0:5433',  // app conecta aqui
    upstream: 'postgres:5432', // real postgres
    enabled: true,
  })

  // Injeta latência de 500ms com jitter de 100ms
  const toxic = await proxy.addToxic({
    type: 'latency',
    name: 'add-latency',
    attributes: {
      latency: 500,  // ms
      jitter: 100,   // variação aleatória
    },
    toxicity: 1,     // 100% dos requests afetados
  })

  // Mede impacto no steady state
  const before = await measureP99()
  console.log(\`P99 antes: \${before}ms\`)

  await runLoad()  // gera carga real

  const during = await measureP99()
  console.log(\`P99 durante chaos: \${during}ms\`)

  // Hipótese: P99 ainda < 2s mesmo com 500ms de latência no DB
  if (during > 2000) {
    console.error('HIPÓTESE REFUTADA: sistema não tem timeout configurado!')
  }

  // Remove toxic e valida recuperação
  await toxic.remove()
  const after = await measureP99()
  console.log(\`P99 após recuperação: \${after}ms\`)

  await proxy.remove()
}

async function measureP99(): Promise<number> {
  // Mede P99 de latência via suas métricas (Prometheus, etc.)
  return 0  // implementar com seu stack
}

async function runLoad(): Promise<void> {
  await new Promise(r => setTimeout(r, 30_000)) // 30s de experimento
}`,
    },
    {
      title: 'AWS FIS — Experimento via CLI',
      language: 'bash',
      code: `#!/bin/bash
# Configura e executa experimento de chaos no AWS FIS
# Pré-req: AWS CLI configurado, IAM role com permissão FIS

# 1. Cria template de experimento
TEMPLATE_ID=$(aws fis create-experiment-template \\
  --cli-input-json '{
    "description": "Terminar 1 instância EC2 do ASG de API",
    "targets": {
      "api-instances": {
        "resourceType": "aws:ec2:instance",
        "resourceTags": {"app": "api", "env": "prod"},
        "selectionMode": "COUNT(1)"
      }
    },
    "actions": {
      "terminate-instance": {
        "actionId": "aws:ec2:terminate-instances",
        "targets": {"Instances": "api-instances"}
      }
    },
    "stopConditions": [
      {
        "source": "aws:cloudwatch:alarm",
        "value": "arn:aws:cloudwatch:us-east-1:123:alarm:SteadyStateAlarm"
      }
    ],
    "roleArn": "arn:aws:iam::123456:role/FISRole",
    "tags": {"experiment": "chaos-api-instance-termination"}
  }' \\
  --query 'experimentTemplate.id' \\
  --output text)

echo "Template criado: $TEMPLATE_ID"

# 2. Executa o experimento
EXPERIMENT_ID=$(aws fis start-experiment \\
  --experiment-template-id "$TEMPLATE_ID" \\
  --query 'experiment.id' \\
  --output text)

echo "Experimento iniciado: $EXPERIMENT_ID"

# 3. Monitora status
while true; do
  STATUS=$(aws fis get-experiment \\
    --id "$EXPERIMENT_ID" \\
    --query 'experiment.state.status' \\
    --output text)

  echo "$(date): Status = $STATUS"

  if [[ "$STATUS" == "completed" || "$STATUS" == "failed" || "$STATUS" == "stopped" ]]; then
    break
  fi

  sleep 10
done

# 4. Obtém resultado
aws fis get-experiment \\
  --id "$EXPERIMENT_ID" \\
  --query 'experiment.state'`,
    },
  ],
}

export default chaosEngineering
