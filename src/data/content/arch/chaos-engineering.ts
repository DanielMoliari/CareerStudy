import type { SkillContent } from '@/types'

const chaosEngineering: SkillContent = {
  tagline: 'Injetar falhas em produção de forma controlada pra descobrir fraqueza antes do incidente.',
  why: 'Chaos engineering e diferencial em vaga senior em empresa com SLA serio. Mostra mentalidade de "falha vai acontecer, melhor descobrir agora". Saber explicar game day, blast radius e steady state coloca você em outro nível.',
  summary: 'Chaos engineering e a prática de injetar falhas controladas em sistema de produção (ou staging realista) pra validar resiliencia. Origem na Netflix com Chaos Monkey (2011). Metodo cientifico: define hipotese ("sistema sobrevive a queda de 1 AZ"), define steady state (metrica que indica saude), injeta falha, observa, corrige fraqueza encontrada. Não e "quebrar coisa aleatoria" — e experimento com blast radius limitado e plano de rollback. Princess Principle: confiança em sistema vem de teste, não de fe.',
  keypoints: [
    { title: 'Steady state', body: 'Metrica que define "sistema saudavel" durante o experimento (taxa de pedido por minuto, latência P99, erro rate). Sem isso, você não sabe se a injecao quebrou algo.' },
    { title: 'Hipotese', body: 'Antes de injetar, você diz: "esperamos que sistema continue saudavel quando X acontecer". Experimento confirma ou refuta. Se você já sabe que vai quebrar, não injete em prod — corrige primeiro.' },
    { title: 'Blast radius', body: 'Comece com 1% dos usuários, 1 instância, 1 AZ. Se experimento válida, expande. Nunca comece com 100% — você pode estar errado sobre a hipotese.' },
    { title: 'Tipos de falha', body: 'Latência injetada, erro HTTP, queda de instância, queda de AZ inteira, partição de rede, exhaustao de CPU/memória, DNS lento, certificado expirado.' },
    { title: 'Game day', body: 'Exercício coordenado onde time simula incidente em ambiente real. Treina runbook, válida observability, ensina time novo. Diferente de chaos automático — tem horario, escopo e participantes.' },
    { title: 'Ferramentas', body: 'Chaos Monkey (instância), Gremlin (managed), AWS Fault Injection Simulator, LitmusChaos (Kubernetes), Toxiproxy (rede), Chaos Mesh.' },
    { title: 'Pre-requisitos', body: 'Sem observability, você não ve o impacto. Sem runbook, time não sabe responder. Sem confiança em rollback, você não tem coragem de injetar. Maturidade vem antes do chaos.' },
  ],
  gotchas: [
    'Injetar falha sem observability — você não ve nada, aprende nada, e ainda quebra usuário.',
    'Comecar em prod 100% — primeira injecao deve ser em staging, depois 1% prod, depois expandir.',
    'Chaos sem hipotese — virou "quebrar coisa pra ver". Sem aprendizado estruturado, é só dor.',
    'Esquecer blast radius — experimento de "matar 1 instância" mata o cluster todo porque ninguem testou auto-scaling. Rollback rápido obrigatório.',
    'Time não maduro — chaos em sistema sem on-call, sem alarme, sem runbook, gera incidente real e queima confiança.',
    'Stakeholders sem aviso — gerente descobre que você derrubou prod numa quinta a tarde. Comunicação previa e cultural.',
  ],
  interview: [
    { q: 'Como você introduziria chaos engineering num time que nunca usou?', a: '<p>Começo com <strong>game day em staging</strong>: cenario combinado, todo mundo presente, simulamos queda de DB ou AZ. Identifica gaps de runbook e observability sem risco real. Esse exercício sozinho já entrega muito valor.</p><p>Depois evoluo: <strong>chaos manual em prod com blast radius pequeno</strong> (1 instância, 1% trafego), com aviso ao time, hipotese explícita, e plano de rollback. So depois de meses passo pra <strong>chaos automático</strong> (Chaos Monkey rodando todo dia em horario de trabalho).</p><p>Pre-req: sem observability e on-call decente, não começo. Chaos em sistema imaturo e sabotagem.</p>' },
    { q: 'Quando NÃO usar chaos engineering?', a: '<p>Sistema sem <strong>observability decente</strong> — você não vê impacto, não aprende, só quebra. Resolva observability primeiro.</p><p>Sistema sem <strong>SLA real ou usuário pagante</strong> — em prototipo ou MVP, ROI é baixo. O esforço de chaos pesa mais que o ganho.</p><p>Time sem maturidade de incidente — sem on-call, sem runbook, sem alarme, chaos gera incidente real que ninguém sabe responder. Vira trauma cultural.</p><p>Em fase de pre-PMF, foco em entrega, não em resiliência avançada.</p>' },
    { q: 'O que é blast radius e como você limita?', a: '<p>Blast radius é o <strong>escopo do impacto</strong> do experimento. Pequeno = poucos usuários afetados em caso de falha. Grande = muitos.</p><p>Limito por:</p><ul><li><strong>Percent</strong>: 1% trafego, depois 5%, depois 25%, depois 100%</li><li><strong>Geografia</strong>: uma AZ, depois uma região, depois global</li><li><strong>Tempo</strong>: experimento de 5min, com kill switch automático</li><li><strong>Trigger</strong>: aborto automático se métrica de steady state degrada N%</li></ul><p>Incremente só depois de validar nível anterior. Erro clássico: pular pro 100% confiando em rollback manual.</p>' },
    { q: 'Tradeoff: chaos automático continuo vs game day pontual?', a: '<p><strong>Chaos automático</strong> (Chaos Monkey rodando diario): garante que resiliencia não regride, encontra problema que game day pontual perde, normaliza falha como evento esperado. Custo: maturidade alta exigida, falsos positivos podem cansar time.</p><p><strong>Game day</strong>: exercício coordenado, treina time, captura cenario complexo (queda de fornecedor, ataque DDoS) que automacao não simula. Custo: pontual, depende de organizacao.</p><p>Time maduro faz os dois: automático cobre o cotidiano, game day cobre cenario excepcional. Time iniciante começa com game day.</p>' },
    { q: 'Como você mede sucesso de programa de chaos?', a: '<p>Metricas:</p><ul><li><strong>Bugs encontrados</strong> em pre-prod por experimento (mostra valor)</li><li><strong>MTTR</strong> caindo ao longo do tempo (time fica mais rápido em incidente)</li><li><strong>Cobertura</strong>: quantos serviços críticos já passaram por chaos</li><li><strong>Confiança do time</strong>: pesquisa sobre quanto time confia em deploy de sexta a tarde</li></ul><p>Não meco "número de experimentos rodados" — vira KPI gamificado sem qualidade. Foco no aprendizado e na resiliencia real do sistema.</p>' },
  ],
  resources: [
    { title: 'Chaos Engineering (Rosenthal et al., O\'Reilly)', url: 'https://www.oreilly.com/library/view/chaos-engineering/9781492043850/', kind: 'livro' },
    { title: 'Principles of Chaos Engineering', url: 'https://principlesofchaos.org/', kind: 'docs' },
    { title: 'Netflix Tech Blog — Chaos', url: 'https://netflixtechblog.com/tagged/chaos-engineering', kind: 'artigo' },
    { title: 'AWS Fault Injection Simulator', url: 'https://aws.amazon.com/fis/', kind: 'docs' },
    { title: 'Gremlin — Chaos Engineering tutorials', url: 'https://www.gremlin.com/community/tutorials/', kind: 'curso' },
  ],
}

export default chaosEngineering
