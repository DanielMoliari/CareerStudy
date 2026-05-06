'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion } from '@/components/pdfs/ComparativeRefPdf'

// Paleta SLIs/SLOs/SLAs
const C = '#10B981'

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas de SRE mais cobradas em entrevista sênior',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: SLI vs SLO vs SLA, error budget policy, burn rate, multi-window alerting, 14·6·3·1, toil, SLO de latência vs disponibilidade — respostas no nível pleno/sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Fórmulas, tabela de noves e tipos de SLI numa página',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: fórmulas de SLI, cálculo de error budget, tabela de disponibilidade (1-5 noves), PromQL de exemplo e os 4 alertas de burn rate do SRE Workbook.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Como nunca mais confundir SLI, SLO e SLA',
    type: 'mnemonics',
    pages: 2,
    description: 'Truques para fixar a hierarquia: SLI é o termômetro, SLO é a meta interna, SLA é o contrato assinado, Error Budget é a licença para inovar. E o mnemônico 14·6·3·1.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'comparative',
    title: 'Comparative',
    subtitle: 'SLI vs SLO vs SLA — a confusão mais comum em entrevista',
    type: 'comparative',
    pages: 2,
    description: 'Tabela comparativa: definição, quem define, consequência de violação, relação com os outros, exemplos reais. Para não confundir nunca mais os três conceitos.',
    icon: '04',
    goal: 'Distinção conceitual',
  },
]

const QAS: QAItem[] = [
  {
    q: 'Qual a diferença entre SLI, SLO e SLA? Como explicar para um engenheiro júnior?',
    a: '<p><strong>SLI (Service Level Indicator)</strong>: a métrica que você mede. Sempre uma proporção de bons eventos sobre total. Ex: (requisições 2xx) / (total requisições) = 99,92%.</p><p><strong>SLO (Service Level Objective)</strong>: a meta interna que você define para o SLI. Ex: "o SLI de disponibilidade deve ser ≥ 99,9% nos últimos 30 dias". É o compromisso interno da equipe de engenharia.</p><p><strong>SLA (Service Level Agreement)</strong>: o contrato externo com o cliente, com penalidades se violado. Sempre mais frouxo que o SLO — a margem é a proteção da empresa.</p><p>Analogia: SLI = termômetro, SLO = temperatura ideal que você quer manter, SLA = temperatura mínima contratada com o cliente (com multa se descer abaixo).</p>',
    tip: 'Use a analogia do termômetro: SLI mede, SLO é a meta, SLA é o contrato com consequência. A sequência lógica é SLI → SLO → SLA, do mais técnico ao mais comercial.',
    level: 'Pleno',
  },
  {
    q: 'O que é error budget e por que é o conceito mais importante do SRE?',
    a: '<p><strong>Error budget</strong> = 100% − SLO target. Com SLO de 99,9% em 30 dias: budget = 0,1% × 30 × 24 × 60 = <strong>~43 minutos de downtime tolerado</strong> por mês.</p><p>É o conceito mais importante porque <strong>transforma confiabilidade de policiamento em parceria</strong>: o budget é um recurso compartilhado entre produto e engenharia. Enquanto há budget disponível, a equipe pode fazer deploys arriscados, experimentos e refatorações. Quando o budget esgota, features param — isso é a política que dá à SRE autoridade de dizer "não" sem conflito político.</p><p>Sem error budget, SRE vira "polícia de operações" brigando com produto. Com error budget, é um parceiro que gerencia um recurso valioso junto com o time.</p>',
    tip: 'Enfatize a transformação cultural: SRE deixa de ser obstáculo e vira parceiro. O budget é o recurso que torna a conversa objetiva — "você tem X minutos de budget restante este mês".',
    level: 'Pleno',
  },
  {
    q: 'O que é burn rate e como calcular?',
    a: '<p><strong>Burn rate</strong> = taxa de consumo atual / taxa de consumo esperada.</p><p>Burn rate 1 = você está consumindo exatamente na velocidade do SLO (esgota exatamente no fim do período).<br>Burn rate 14 = você está consumindo 14× mais rápido que o esperado → o budget mensal esgota em 30/14 ≈ 2 dias.<br>Burn rate 0,5 = consumindo na metade da velocidade → budget vai durar o dobro do período.</p><p>Fórmula: <code>burn_rate = error_rate_atual / (1 - SLO_target)</code></p><p>Exemplo: com SLO 99,9%, error rate esperado = 0,1%. Se a error rate atual é 1,4%, burn rate = 1,4% / 0,1% = <strong>14×</strong>.</p>',
    tip: 'O número 14 é importante de memorizar: burn rate 14× = esgota em 2 dias, que é o threshold do alerta crítico (page) do SRE Workbook. Conectar burn rate aos 4 alertas é o que mostra profundidade.',
    level: 'Pleno',
  },
  {
    q: 'Explique os 4 alertas do SRE Workbook (14·6·3·1) e por que são multi-window.',
    a: '<p>O SRE Workbook define 4 alertas de burn rate que cobrem todos os horizontes de tempo:</p><ul><li><strong>Page — rápido</strong>: burn rate ≥14× em janela 1h AND 5min → esgota em ~2 dias → severity: critical</li><li><strong>Page — lento</strong>: burn rate ≥6× em janela 6h AND 30min → esgota em ~5 dias → severity: critical</li><li><strong>Ticket urgente</strong>: burn rate ≥3× em janela 1d AND 2h → esgota em ~10 dias → severity: warning</li><li><strong>Ticket longo</strong>: burn rate ≥1× em janela 3d AND 6h → consumo na velocidade exata → severity: info</li></ul><p><strong>Por que multi-window (AND)?</strong> Janela curta sozinha → falsos positivos em spikes curtos. Janela longa sozinha → detecta degradação tarde demais. A combinação AND das duas janelas elimina os dois problemas: o spike é filtrado pela janela longa, e a degradação lenta é capturada pela janela longa antes que a curta perceba.</p>',
    tip: 'Memorize o mnemônico 14·6·3·1 e o que cada um representa: 2 dias, 5 dias, 10 dias, 30 dias. Explique por que AND (não OR) — OR geraria muitos falsos positivos.',
    level: 'Senior',
  },
  {
    q: 'Como definir um bom SLI? Quais métricas são bons e quais são maus SLIs?',
    a: '<p>Um bom SLI é sempre uma <strong>proporção de bons eventos sobre total</strong> — não um valor absoluto. Isso permite normalização e comparação entre períodos.</p><p><strong>Bons SLIs:</strong></p><ul><li>Disponibilidade: (req 2xx+3xx) / total_req</li><li>Latência: (req com latência &lt; 500ms) / total_req — não p99 bruto</li><li>Taxa de erro: (req 5xx) / total_req</li></ul><p><strong>Maus SLIs (por que não usar):</strong></p><ul><li><strong>CPU usage</strong>: métrica de recurso, não de experiência. CPU 90% pode ser normal em um sistema bem otimizado</li><li><strong>Memory usage</strong>: mesmo motivo — não reflete o que o usuário sente</li><li><strong>Média de latência</strong>: mascara outliers — p99 de 5s é invisível na média</li><li><strong>Uptime absoluto (minutos)</strong>: não é proporção — difícil de comparar entre períodos de tamanhos diferentes</li></ul><p>Regra: se a métrica não responde "o usuário teve uma boa experiência?", não é um bom SLI.</p>',
    tip: 'A distinção entre latência como SLI (proporção de requests rápidas) vs latência como métrica (p99 bruto) é um ponto avançado que diferencia quem realmente entendeu SRE.',
    level: 'Pleno',
  },
  {
    q: 'O que é error budget policy e quais são os thresholds típicos?',
    a: '<p>Error budget policy é o documento formal que define <strong>quais ações a equipe toma quando o budget atinge certos thresholds</strong>:</p><ul><li><strong>Budget 50% consumido</strong>: revisão das práticas de deploy, análise do que consumiu o budget, aumento de testes</li><li><strong>Budget 75-80% consumido</strong>: feature freeze suave — deploys só com aprovação explícita de SRE</li><li><strong>Budget 90% consumido</strong>: feature freeze completo — sprint de reliability obrigatório</li><li><strong>Budget esgotado</strong>: zero features novas até recuperar o budget; revisão de SLO se impossível de manter</li></ul><p>Sem policy, SLO vira métrica de vaidade: todo mundo sabe que está consumindo budget mas ninguém age. A policy é o que dá à SRE autoridade de parar features — de forma acordada previamente, não em cima da hora.</p>',
    tip: 'Mencione que a policy deve ser assinada pela liderança antes de um incidente — fazer o acordo no calor do momento não funciona. É um documento de governança, não só de operações.',
    level: 'Senior',
  },
  {
    q: 'Como implementar SLOs com Prometheus e PromQL?',
    a: '<p><strong>Estrutura básica de implementação com Prometheus:</strong></p><p>1. Definir o SLI de disponibilidade:</p><pre>sum(rate(http_requests_total{status!~"5.."}[5m]))\n/\nsum(rate(http_requests_total[5m]))</pre><p>2. Criar recording rules para windows de burn rate:</p><pre>- record: job:sli_errors:rate1h\n  expr: 1 - (sum(rate(http_requests_total{status!~"5.."}[1h])) / sum(rate(http_requests_total[1h])))\n\n- record: job:sli_errors:rate6h\n  expr: 1 - (sum(rate(http_requests_total{status!~"5.."}[6h])) / sum(rate(http_requests_total[6h])))</pre><p>3. Alerta de burn rate crítico (14× em 1h AND 6h para SLO 99,9%):</p><pre>expr: |\n  (job:sli_errors:rate1h &gt; (14 * 0.001))\n  and\n  (job:sli_errors:rate6h &gt; (14 * 0.001))\nlabels:\n  severity: critical</pre><p>Ferramentas: <strong>Sloth</strong> (gera recording rules de SLO automaticamente a partir de YAML) e <strong>OpenSLO</strong> (spec declarativa agnóstica de plataforma).</p>',
    tip: 'Mencione o Sloth — é a ferramenta que a maioria dos times SRE usa para não escrever PromQL de burn rate na mão. Mostra conhecimento prático além da teoria.',
    level: 'Senior',
  },
  {
    q: 'O que é toil no contexto SRE e como ele se relaciona com error budget?',
    a: '<p><strong>Toil</strong> é trabalho manual, repetitivo, sem valor duradouro, que cresce linearmente com o volume do sistema. Exemplos: executar deploys manualmente, responder alertas ruidosos toda semana, rotacionar certificados na mão, escalar instâncias via CLI.</p><p><strong>Características do toil:</strong> manual, repetitivo, automatizável, aumenta com o crescimento do sistema, sem valor de engenharia duradouro.</p><p><strong>Relação com error budget:</strong></p><ul><li>Incidentes causados por toil (ex: deploy manual que falhou) consomem error budget</li><li>Budget consumido por toil repetitivo → error budget policy dispara sprint de reliability</li><li>Sprint de reliability = eliminar o toil que gerou os incidentes</li></ul><p>Regra SRE: toil deve ser ≤50% do tempo. Acima disso, o time não tem capacidade para engenharia de confiabilidade — fica apagando incêndio em vez de preveni-los.</p>',
    tip: 'A conexão toil → incidente → budget consumido → sprint de reliability é o loop que justifica o papel do SRE. Mostre que não é sobre "não gosto de trabalho manual" mas sobre sustentabilidade de escala.',
    level: 'Senior',
  },
  {
    q: 'Qual é a diferença entre SLO de disponibilidade e SLO de latência? Quando usar cada um?',
    a: '<p><strong>SLO de disponibilidade</strong>: mede se o serviço respondeu. Detecta outages mas não detecta lentidão. Um serviço que responde em 8 segundos tem disponibilidade 100% mas causa abandono de usuário.</p><p><strong>SLO de latência</strong>: mede se o serviço respondeu dentro do tempo aceitável. É uma proporção: (requests &lt; 500ms) / total — não p99 bruto. Detecta degradação que a disponibilidade não vê.</p><p><strong>Quando usar cada um:</strong></p><ul><li><strong>Disponibilidade sempre</strong>: todo serviço precisa de SLI de disponibilidade como baseline</li><li><strong>Latência para serviços com UX crítica</strong>: checkout, search, APIs mobile — onde lentidão = abandono</li><li><strong>Ambos para serviços críticos</strong>: pagamentos, saúde — disponível E rápido</li></ul><p><strong>Synthetic monitoring</strong>: checks externos que simulam o usuário final são mais precisos que métricas server-side — capturam latência de rede, DNS, TLS e edge cases que as métricas internas não veem.</p>',
    tip: 'O ponto avançado: latência como SLI deve ser proporção (% de requests rápidas), não percentil bruto. p99 de 500ms não é SLI — é uma métrica. SLI seria: (requests &lt; 500ms) / total.',
    level: 'Senior',
  },
  {
    q: 'Como SLOs mudam a dinâmica entre produto e engenharia?',
    a: '<p>Sem SLOs: produto empurra velocidade, engenharia freia pedindo estabilidade. O conflito é subjetivo — "precisamos desse deploy agora" vs "é muito arriscado". SRE perde politicamente quase sempre.</p><p>Com SLOs e error budget:</p><ul><li>O budget é um recurso objetivo: "temos 15 minutos de downtime tolerado este mês, já usamos 12. Podemos fazer o deploy mas o risco de consumir o budget é alto — vocês decidem"</li><li>Produto passa a ter interesse em confiabilidade porque budget = capacidade de fazer deploys</li><li>Engenharia tem autoridade para pausar features quando budget está em risco — de forma acordada previamente</li></ul><p>O erro mais comum: implementar SLOs apenas como monitoramento, sem error budget policy. Sem a policy, SLO é métrica de vaidade. A política é o que dá consequências e transforma o sistema de gestão.</p>',
    tip: 'A frase que resume: "SLOs transformam SRE de polícia em parceiro". O budget é uma moeda compartilhada — produto e engenharia gerenciam juntos.',
    level: 'Senior',
  },
  {
    q: 'Como calcular o error budget restante em Prometheus?',
    a: '<p>Calcular quanto do budget mensal foi consumido até agora:</p><pre># Budget total (mês de 30 dias, SLO 99,9%):\n# 0,1% × 30 × 24 × 60 × 60 = 2592 segundos = 43,2 minutos\n\n# Budget consumido até agora:\n(1 - sli:availability:ratio_30d) * 30 * 24 * 60 * 60\n\n# Budget restante em segundos:\n2592 - ((1 - sli:availability:ratio_30d) * 30 * 24 * 60 * 60)\n\n# Budget restante em % do budget total:\n((slo_target - (1 - sli:availability:ratio_30d)) / (1 - slo_target)) * 100</pre><p>Onde <code>sli:availability:ratio_30d</code> é uma recording rule:<br><code>rate(http_requests_total{status!~"5.."}[30d]) / rate(http_requests_total[30d])</code></p><p>Esse valor pode alimentar um dashboard Grafana com gauge mostrando o budget em tempo real — vermelho quando &lt;10%, amarelo quando &lt;30%, verde quando &gt;30%.</p>',
    tip: 'Mostrar o PromQL concreto é o que diferencia teoria de experiência real. A fórmula do budget restante em % é o que alimenta os dashboards de SRE em produção.',
    level: 'Senior',
  },
  {
    q: 'O que é SLO de janela rolling vs janela calendário? Qual usar?',
    a: '<p><strong>Janela calendário</strong>: reset no primeiro de cada mês. Exemplo: budget de janeiro é separado do budget de fevereiro. Problema: um incidente no dia 28 consome pouco budget pois o mês quase acabou; incidente no dia 1 pode travar o mês inteiro.</p><p><strong>Janela rolling</strong>: sempre os últimos N dias, independente de onde estamos no calendário. Exemplo: nos últimos 30 dias — atualiza continuamente. Problema: mais complexo de implementar e explicar.</p><p><strong>Recomendação do SRE Workbook:</strong> janela rolling de 30 dias. Motivos:</p><ul><li>Comportamento mais consistente — sem reset artificial de budget</li><li>Incentiva melhorar continuamente em vez de esperar o reset do mês</li><li>Mais alinhado com o que o usuário sente — experiência dos últimos 30 dias, não do mês calendário</li></ul><p>Na prática: PromQL com <code>[30d]</code> é rolling. Algumas empresas usam as duas em paralelo — rolling para operação, calendário para relatórios de SLA com clientes.</p>',
    tip: 'A distinção rolling vs calendário é um ponto que poucos candidatos conhecem. Mencionar que o SRE Workbook recomenda rolling e explicar o porquê (sem reset artificial) demonstra leitura da literatura primária.',
    level: 'Senior',
  },
  {
    q: 'Como implementar SLOs em um sistema de microserviços?',
    a: '<p>Em microserviços, cada serviço deve ter SLOs próprios, mas o usuário final vê o SLO do fluxo completo. Estratégias:</p><p><strong>1. SLO por serviço:</strong> cada microserviço define seus próprios SLIs de disponibilidade e latência. Mais granular, mais fácil de identificar qual serviço degradou.</p><p><strong>2. SLO de jornada (end-to-end):</strong> medir o fluxo completo de uma transação (ex: checkout). Mais próximo do que o usuário sente, mas mais difícil de atribuir falhas a serviços específicos.</p><p><strong>3. Propagação de SLO:</strong> se serviço A depende de B, o SLO de A é limitado pelo SLO de B. Serviço com SLO 99,9% chamando B com SLO 99,9% resulta em disponibilidade composta de ≈99,8%.</p><p><strong>Ferramentas:</strong></p><ul><li>OpenTelemetry para distributed tracing — atribui latência a cada span</li><li>Service mesh (Istio, Linkerd) — métricas automáticas de latência e error rate por serviço</li><li>Sloth com múltiplos arquivos YAML — um SLO per serviço</li></ul>',
    tip: 'A disponibilidade composta em microserviços (0.999 × 0.999 = 0.998) é um ponto concreto que mostra raciocínio matemático. Conecte isso com o argumento para usar circuit breakers e caching.',
    level: 'Senior',
  },
  {
    q: 'Quando um SLO é impossível de manter, o que fazer?',
    a: '<p>Se o error budget esgota consistentemente todo mês e o time não consegue manter o SLO, há duas causas possíveis:</p><p><strong>1. SLO muito apertado</strong> (mais comum): o sistema não foi construído para esse nível de confiabilidade. Solução: revisar o SLO para um valor realista baseado no que o sistema consegue entregar com o investimento atual.</p><p><strong>2. Sistema genuinamente não confiável</strong>: o SLO é razoável mas o sistema falha demais. Solução: sprint de reliability para identificar e corrigir as causas raiz.</p><p><strong>Como distinguir:</strong></p><ul><li>Analisar os post-mortems: os incidentes são preveníveis ou são falhas de infraestrutura fora do controle da equipe?</li><li>Comparar com benchmarks de mercado: SLO de 99,99% sem redundância multi-az é irreal para qualquer sistema</li><li>Verificar se o custo de atingir o SLO é economicamente justificável para o negócio</li></ul><p>Mensagem importante: SLO não é promessa de perfeição — é compromisso calibrado com o que é possível e necessário.</p>',
    tip: 'Esta pergunta testa maturidade de engenharia. A resposta ingênua é "trabalhar mais". A resposta madura é: primeiro diagnosticar se o SLO está calibrado, depois decidir entre relaxar o SLO ou investir em confiabilidade.',
    level: 'Senior',
  },
  {
    q: 'Como criar dashboards de SLO eficazes no Grafana?',
    a: '<p><strong>Painel de SLO no Grafana deve ter:</strong></p><ul><li><strong>Gauge de SLI atual</strong>: valor em tempo real vs target. Verde se acima do SLO, vermelho se abaixo</li><li><strong>Gauge de error budget restante</strong>: % do budget disponível no período. Inclui limiar visual (vermelho &lt;10%)</li><li><strong>Timeseries de burn rate</strong>: evolução do burn rate nas últimas 24h — com linhas de threshold (14×, 6×, 3×, 1×)</li><li><strong>Anotações de incidentes</strong>: marcadores verticais onde houve incidentes para correlacionar com consumo de budget</li><li><strong>Histograma de latência</strong>: distribuição de latência com marcador na posição do SLO target</li></ul><p><strong>Boas práticas:</strong></p><ul><li>Uma linha por dashboard: cada serviço tem seu próprio dashboard de SLO</li><li>Dashboard de executive: agrega SLOs críticos em uma página para liderança</li><li>Alertas linkados: cada alerta leva para o dashboard do serviço afetado</li></ul>',
    tip: 'Estruture a resposta visualmente: "três painéis principais: gauge de SLI, gauge de budget, timeseries de burn rate". Grafana dashboards são algo que todo SRE faz na prática — mostrar que você sabe o que colocar neles é diferencial.',
    level: 'Pleno',
  },
  {
    q: 'Qual a diferença entre SLO e OKR? Como alinhar os dois?',
    a: '<p><strong>OKR (Objectives and Key Results)</strong>: framework de metas de negócio. Ambicioso por natureza — é esperado não atingir 100% dos KRs. Orientado ao que a empresa quer alcançar.</p><p><strong>SLO</strong>: compromisso técnico de confiabilidade. Deve ser atingível — violações têm consequências (budget, SLA). Orientado ao que o sistema pode entregar.</p><p><strong>Tensão e alinhamento:</strong></p><ul><li>OKR de produto: "aumentar GMV em 30%" → implica mais deploys, mais features, mais risco → consome error budget</li><li>SLO: limita o quanto você pode arriscar sem comprometer a confiabilidade</li><li>Solução: incluir a saúde do error budget como um KR: "manter error budget &gt; 20% ao longo do trimestre"</li></ul><p>Quando OKR e SLO colidem: o SLO tem precedência técnica. A equipe negocia com produto usando o budget como linguagem comum — "podemos acelerar, mas o risco de consumir o budget é X%".</p>',
    tip: 'Esta pergunta conecta engenharia com negócio. A resposta que impressiona: sugerir incluir "saúde do error budget" como um KR de engenharia — torna o SLO visível para a liderança no mesmo framework que eles usam.',
    level: 'Senior',
  },
  {
    q: 'Como lidar com dependências externas no cálculo de SLO?',
    a: '<p>Dependências externas (APIs de parceiros, provedores de pagamento, DNS, CDN) são uma fonte de incidentes que consomem error budget mas não são controladas pelo time. Estratégias:</p><p><strong>1. Excluir eventos de causa externa do denominador do SLI</strong>: se o provedor de pagamento ficou fora por 30min, excluir essas requisições. Requires documentação clara e post-mortem.</p><p><strong>2. Criar SLIs separados por dependência</strong>: SLI do sistema (com dependências) e SLI do serviço próprio (excluindo falhas de terceiros). O segundo é o que o time controla.</p><p><strong>3. Implementar resiliência</strong>: circuit breakers, fallbacks, caching de respostas externas — reduz o impacto de dependências no SLO interno.</p><p><strong>4. Negociar SLAs com fornecedores</strong>: o SLA do fornecedor deve ser mais apertado que o seu SLO que depende dele. Se o fornecedor tem SLA de 99,9% e você precisa de SLO 99,95%, há um problema estrutural.</p>',
    tip: 'Mencionar circuit breakers e caching como ferramentas para proteger o SLO de dependências externas mostra que você pensa em arquitetura resiliente, não só em métricas.',
    level: 'Senior',
  },
  {
    q: 'O que é synthetic monitoring e por que é importante para SLOs?',
    a: '<p><strong>Synthetic monitoring</strong>: checks automatizados que simulam ações reais de usuários a partir de localizações externas. Exemplos: cron que faz login + busca + checkout a cada 5min de diferentes regiões.</p><p><strong>Por que é mais preciso que métricas server-side:</strong></p><ul><li>Captura latência de rede, DNS, TLS, edge — não só o tempo de processamento do servidor</li><li>Detecta falhas de conectividade que não geram logs server-side</li><li>Simula o que o usuário real sente, não o que o servidor acha que entregou</li></ul><p><strong>Integração com SLOs:</strong></p><ul><li>SLI de disponibilidade via synthetic: (checks bem-sucedidos) / (total de checks)</li><li>SLI de latência via synthetic: (checks com resposta &lt; 2s) / (total de checks)</li><li>Alerta antes do impacto no usuário: synthetic falha antes dos usuários reclamarem</li></ul><p>Ferramentas: Datadog Synthetic, Grafana Synthetic Monitoring, Checkly, AWS CloudWatch Synthetics, Pingdom.</p>',
    tip: 'O ponto-chave: métricas server-side vs synthetic são complementares. Servidor pode estar respondendo rápido internamente mas o usuário ver 5s de latência por DNS lento. Synthetic captura isso; métricas internas não.',
    level: 'Pleno',
  },
  {
    q: 'Como fazer post-mortem de violação de SLO?',
    a: '<p>Um post-mortem de SLO bem feito vai além de "o que quebrou" — analisa o impacto no error budget e o que muda para o futuro.</p><p><strong>Estrutura do post-mortem de SLO:</strong></p><ol><li><strong>Impacto no budget</strong>: quanto do error budget mensal foi consumido? Qual o budget restante após o incidente?</li><li><strong>Linha do tempo</strong>: quando o SLI caiu abaixo do SLO, quando foi detectado, quando foi mitigado, quando foi resolvido. Medir MTTD (detecção) e MTTR (resolução)</li><li><strong>Causa raiz</strong>: 5 Whys — qual o sistema que falhou e por quê</li><li><strong>Falhas de detecção</strong>: o alerta foi disparado? No tempo certo? Multi-window alerting funcionou?</li><li><strong>Action items</strong>: com owner e deadline — o que muda para não repetir</li></ol><p><strong>Blameless</strong>: post-mortems de SRE são sem culpa. O sistema falhou, não a pessoa. Foco em aprendizado sistêmico.</p>',
    tip: 'Mencionar MTTD e MTTR como métricas específicas, e o processo blameless como cultura SRE, mostra que você entende os princípios além das ferramentas.',
    level: 'Pleno',
  },
  {
    q: 'Como apresentar SLOs para a liderança executiva?',
    a: '<p>Liderança não quer detalhes de PromQL — quer entender risco de negócio e velocidade de inovação.</p><p><strong>Framework de apresentação:</strong></p><ul><li><strong>Dashboard executivo</strong>: gauge visual do error budget restante — verde (safe), amarelo (atenção), vermelho (crítico). Sem fórmulas.</li><li><strong>Linguagem de negócio</strong>: "temos 65% do nosso budget de confiabilidade disponível este mês — podemos fazer os lançamentos planejados com segurança"</li><li><strong>Risco em tempo real</strong>: "o incidente de terça consumiu 20% do budget — se houver mais um incidente desta magnitude, precisaremos pausar os deploys"</li><li><strong>ROI de reliability</strong>: cada hora de downtime = X reais em receita perdida (calcule com base em GMV/hora)</li></ul><p><strong>O que não fazer:</strong></p><ul><li>Entrar em detalhes de percentis e PromQL</li><li>Falar em "99,9%" sem traduzir para "43 minutos de downtime por mês"</li><li>Apresentar apenas métricas sem conectar com decisões de negócio</li></ul>',
    tip: 'Esta pergunta testa habilidade de comunicação executiva — uma das competências mais valorizadas em SRE sênior. Mostre que você traduz métricas técnicas em linguagem de risco e decisão de negócio.',
    level: 'Senior',
  },
  {
    q: 'O que é Chaos Engineering e como se relaciona com SLOs?',
    a: '<p><strong>Chaos Engineering</strong>: prática de injetar falhas controladas em produção (ou staging realista) para descobrir vulnerabilidades antes que incidentes reais as descubram. Criada pelo Netflix (Chaos Monkey).</p><p><strong>Relação com SLOs:</strong></p><ul><li><strong>Validar se o SLO é atingível sob falhas</strong>: injetar falha de uma az e verificar se o sistema mantém o SLI acima do SLO target</li><li><strong>Consumir budget intencionalmente para aprender</strong>: experimentos de chaos durante períodos de budget alto — "vamos gastar 10% do budget descobrindo nossas vulnerabilidades antes que incidentes o façam"</li><li><strong>Calibrar alertas</strong>: verificar se os alertas de burn rate disparam corretamente quando o chaos está ativo</li></ul><p><strong>Pré-requisitos para chaos em produção:</strong></p><ul><li>SLOs bem definidos e monitorados</li><li>Rollback automático se o SLI cair abaixo do SLO</li><li>Error budget disponível suficiente para absorver o experimento</li><li>Equipe de plantão durante o experimento</li></ul>',
    tip: 'O ponto elegante: usar o error budget para "comprar" experimentos de chaos — gasta budget intencionalmente para aprender, reduzindo o risco de incidentes não planejados futuros. É pensamento sistêmico de SRE.',
    level: 'Senior',
  },
]

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'SLI = Termômetro | SLO = Meta | SLA = Contrato',
    trick: '"O termômetro (SLI) mede, a meta (SLO) define o ideal, o contrato (SLA) tem multa."',
    explanation: 'SLI mede a confiabilidade real (proporção de bons eventos). SLO é a meta interna que a equipe se compromete a atingir. SLA é o contrato externo com penalidades financeiras se violado. A sequência é: SLI → SLO → SLA, do mais técnico ao mais comercial.',
    expansion: [],
    example: '',
    why: '',
  },
  {
    label: '14·6·3·1 — Os 4 alertas do SRE Workbook',
    trick: '"14× em 2 dias, 6× em 5 dias, 3× em 10 dias, 1× em 30 dias."',
    explanation: 'Burn rate 14× = budget esgota em 2 dias (page crítico imediato). 6× = esgota em 5 dias (page mais lento). 3× = esgota em 10 dias (ticket urgente). 1× = consumo na velocidade exata do SLO (ticket de acompanhamento). Multi-window AND elimina falsos positivos de spikes curtos.',
    expansion: [],
    example: '',
    why: '',
  },
  {
    label: 'Error Budget = Licença para inovar',
    trick: '"Budget cheio = verde para deploys arriscados. Budget zerado = feature freeze obrigatório."',
    explanation: 'O error budget é a ponte entre confiabilidade e velocidade. Enquanto há budget, a equipe pode inovar. Quando zera, para. Isso transforma SRE de "polícia de operações" em "parceiro de negócio" — a discussão passa a ser sobre gestão de um recurso compartilhado, não sobre permissão para fazer deploys.',
    expansion: [],
    example: '',
    why: '',
  },
  {
    label: 'SLI de latência = proporção, não percentil',
    trick: '"SLI de latência = (requests rápidas) / total — nunca p99 bruto."',
    explanation: 'p99 de latência é uma métrica, não um SLI. SLI precisa ser uma proporção para poder calcular error budget e burn rate. O SLI correto: (requisições com latência &lt; 500ms) / (total de requisições). Isso permite normalizar e comparar entre janelas de tempo.',
    expansion: [],
    example: '',
    why: '',
  },
  {
    label: 'SLO sempre mais apertado que o SLA',
    trick: '"Se o SLA for 99,9%, o SLO precisa ser 99,95% — a margem é a sua proteção."',
    explanation: 'Violação de SLO = equipe entra em ação (budget policy). Violação de SLA = processo legal e reputação. A margem entre SLO e SLA garante que você detecta e age antes de violar o compromisso com o cliente. Regra prática: SLO = SLA + 0,05% a 0,1%.',
    expansion: [],
    example: '',
    why: '',
  },
]

const COMP_OPTIONS: CompOption[] = [
  { name: 'SLI', color: '#38bdf8' },
  { name: 'SLO' },
  { name: 'SLA', color: '#a78bfa' },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'O que é',
    category: 'Definição',
    values: {
      SLI: 'A métrica que mede confiabilidade — proporção de bons eventos sobre total',
      SLO: 'A meta interna para o SLI em janela de tempo (ex: ≥99,9% em 30 dias)',
      SLA: 'O contrato externo com o cliente, com penalidades por violação',
    },
  },
  {
    criterion: 'Quem define',
    category: 'Responsabilidade',
    values: {
      SLI: 'Equipe de engenharia — com base em o que o usuário sente',
      SLO: 'Equipe de engenharia em conjunto com produto',
      SLA: 'Time comercial/legal em conjunto com engenharia',
    },
  },
  {
    criterion: 'Consequência de violação',
    category: 'Impacto',
    values: {
      SLI: 'Nenhuma direta — é só a métrica',
      SLO: 'Error budget policy: freeze de features, sprint de reliability',
      SLA: 'Créditos para o cliente, processo legal, dano de reputação',
    },
  },
  {
    criterion: 'Relação de rigor',
    category: 'Hierarquia',
    values: {
      SLI: 'É a medição — sem target',
      SLO: 'Mais rigoroso que o SLA — margem de segurança interna',
      SLA: 'Mais frouxo que o SLO — é o mínimo aceitável para o cliente',
    },
  },
  {
    criterion: 'Exemplo concreto',
    category: 'Referência',
    values: {
      SLI: '(req 2xx) / total_req = 99,93% nos últimos 30 dias',
      SLO: 'SLI de disponibilidade deve ser ≥ 99,9% em janela rolling de 30 dias',
      SLA: 'Garantimos 99,5% de uptime mensal — crédito de 10% por cada hora acima',
    },
  },
]



const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'SLIs, SLOs e SLAs',
    stackLabel: 'SRE — Google Site Reliability Engineering',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'SLIs, SLOs e SLAs',
    accentColor: C,
    stackLabel: 'SRE / Confiabilidade',
    sections: {
      hooks: [
        { name: 'SLI — Service Level Indicator', sig: '(bons_eventos) / (total_eventos)', desc: 'Quando: Toda métrica de confiabilidade — deve ser proporção. Evitar: CPU%, memória, médias de latência, uptimes em minutos absolutos.' },
        { name: 'SLO — Service Level Objective', sig: 'SLI ≥ target% em janela rolling N dias', desc: 'Quando: Meta interna de confiabilidade — calibrar no histórico real. Evitar: SLO mais apertado que a infra consegue entregar; SLO igual ao SLA (sem margem).' },
        { name: 'SLA — Service Level Agreement', sig: 'Contrato externo com penalidades definidas', desc: 'Quando: Compromisso com cliente — sempre mais frouxo que o SLO. Evitar: Assinar SLA sem SLO interno mais rigoroso como margem de segurança.' },
        { name: 'Error Budget', sig: '100% - SLO_target = budget disponível', desc: 'Quando: Gerenciar velocidade vs confiabilidade — budget cheio = velocidade, zerado = freeze. Evitar: Ignorar o budget — SLO vira métrica de vaidade sem error budget policy.' },
        { name: 'Burn Rate', sig: 'error_rate_atual / (1 - SLO_target)', desc: 'Quando: Alerta de consumo de budget — detectar degradação em qualquer velocidade. Evitar: Alertar só em threshold fixo de error rate (não detecta degradação lenta).' },
        { name: 'Multi-window Alerting', sig: 'burn_Xh > threshold AND burn_Yh > threshold', desc: 'Quando: Todo alerta de SLO — AND de janela curta E longa. Evitar: Janela única (falsos positivos em spikes ou detecção lenta de degradação).' },
      ],
      depRows: [
        ['Page crítico', 'Burn ≥14× em 1h AND 5min'],
        ['Page lento', 'Burn ≥6× em 6h AND 30min'],
        ['Ticket urgente', 'Burn ≥3× em 1d AND 2h'],
        ['Ticket longo', 'Burn ≥1× em 3d AND 6h']
      ],
      rules: [
        { ok: true, t: 'SLI deve ser sempre uma proporção — nunca valor absoluto' },
        { ok: true, t: 'SLO deve ser mais rigoroso que o SLA (margem de proteção)' },
        { ok: true, t: 'Error budget policy deve ser assinada ANTES de incidentes' },
        { ok: true, t: 'Multi-window alerting AND — nunca janela única' },
        { ok: true, t: 'Toil deve ser < 50% do tempo do time SRE' },
        { ok: true, t: 'SLO de latência = proporção de requests rápidas, não p99 bruto' },
      ],
      performanceTips: [
        '99% → 87h36min/ano | 99,9% → 8h46min/ano | 99,99% → 52min/ano | 99,999% → 5min/ano',
        'SLO 99,9% em 30 dias = error budget de ~43min de downtime permitido',
        'Burn rate 14× → budget esgota em 2 dias | 6× → 5 dias | 3× → 10 dias | 1× → 30 dias',
        'Recording rules no Prometheus para SLO: evitam recalcular janelas longas a cada query',
      ],
      patterns: [],
      mentalModels: [
        'SLI = termômetro, SLO = temperatura ideal, SLA = temperatura mínima contratada (com multa)',
        'Error budget = moeda para inovar. Budget cheio = velocidade máxima. Budget zerado = feature freeze',
        '14·6·3·1: os 4 alertas do SRE Workbook — 2 dias, 5 dias, 10 dias, 30 dias',
        'SLO sem error budget policy = métrica de vaidade. A policy é o que dá consequências',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'SLIs, SLOs e SLAs',
    stackLabel: 'SRE — Google Site Reliability Engineering',
  }),
  comparative: () => buildComparativeRefPdf({
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    skillName: 'SLIs, SLOs e SLAs',
    accentColor: C,
    stackLabel: 'SRE — Confiabilidade de Serviços',
    scenarios: [
      { scenario: 'Serviço crítico de pagamentos', recommendation: 'slo', reason: 'SLO apertado (99,99%) com margem para SLA de 99,9%. SLI de disponibilidade E latência.' },
      { scenario: 'API interna de times', recommendation: 'slo', reason: 'SLO conservador (99,5%) sem SLA externo. Error budget generoso para experimentos.' },
      { scenario: 'Comunicação com cliente sobre downtime', recommendation: 'sla', reason: 'SLA é a linguagem contratual correta para comunicar ao cliente.' },
    ],
  }),
}

export default function SlisSlosSlasPdfs() {
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
