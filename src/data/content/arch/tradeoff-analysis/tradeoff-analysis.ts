import type { SkillContent } from '@/types'

const tradeoffAnalysis: SkillContent = {
  tagline: 'Justificar decisão técnica nomeando o que você ganha e o que está sacrificando.',
  why: 'O que diferencia sênior de pleno em entrevista não é saber tecnologia — é saber DECIDIR. Tradeoff analysis é a habilidade meta. O entrevistador testa: você defende decisão com número/contexto ou repete blog post? Toda pergunta "por que você escolheu X" é um teste de tradeoff analysis disfarçado.',
  summary: 'Tradeoff analysis é o exercício sistemático de comparar opções nomeando dimensões (custo, latência, complexidade, time-to-market, manutenção, risco) e contextualizando ao caso. Não existe "melhor" absoluto — existe melhor para o contexto. Sênior nomeia o que está sacrificando, quantifica quando possível, e revisita decisão quando contexto muda. Frameworks úteis: ADR (Architecture Decision Record), CAP theorem, "the hard parts", custo de mudança vs custo de erro, reversibilidade de decisão.',
  keypoints: [
    {
      title: 'Dimensões básicas de comparação',
      body: 'Custo (dinheiro + dev time + oportunidade), latência, throughput, disponibilidade, consistência, complexidade operacional, segurança, observabilidade, time-to-market, fit com time atual, fit com stack existente. Para cada opção, avalie cada dimensão — e pese as dimensões pelo que é crítico no contexto.',
    },
    {
      title: 'Reversibilidade — two-way vs one-way doors',
      body: 'Decisão reversível (escolha de framework de teste, biblioteca de validação) merece pouco debate. Decisão irreversível ou cara de mudar (banco de dados, cloud provider, linguagem core, schema de dados) merece muito debate. Bezos: "two-way doors vs one-way doors". Para one-way doors: mais tempo de análise, mais alternativas exploradas, mais documentação.',
    },
    {
      title: 'Custo total de propriedade (TCO)',
      body: 'Solução "grátis" pode ter alto custo operacional. Solução paga pode liberar time para entregar valor. Some: salário do time (o custo dominante), on-call, suporte, training, oportunidade perdida de não entregar features. "Open source" frequentemente tem custo de operação maior que SaaS equivalente quando você está no scaling.',
    },
    {
      title: 'Quantificar antes de decidir',
      body: 'Número ganha de opinião. "Postgres aguenta 50K writes/s, esperamos 5K, sobra 10x" é mais forte que "Postgres aguenta". "Implementar autenticação própria custa 3 meses de um sênior, Auth0 custa R$800/mês" é decisão, não debate. Estime antes de decidir — mesmo uma estimativa rough elimina 80% das discussões inválidas.',
    },
    {
      title: 'ADR — Architecture Decision Record',
      body: 'Architecture Decision Record documenta: contexto (por que a decisão foi necessária), decisão tomada, alternativas consideradas (e por que foram rejeitadas), consequências (positivas e negativas). Versionado no repositório. Permite revisitar quando o contexto muda sem perder o raciocínio original. Times sênior tratam ADRs como documentação obrigatória para decisões one-way door.',
    },
    {
      title: 'Fallback e plano de saída',
      body: 'Toda decisão deve ter "como saio dela?" pensado. Lock-in em vendor sem plano de saída é armadilha. Mesmo que nunca execute, pensar na saída revela acoplamento oculto, custo de migração real, e dependências que não eram óbvias. "Conseguimos migrar do Postgres para Dynamo em 6 meses se precisar?" — essa pergunta muda o design.',
    },
    {
      title: 'Falácias comuns de decisão técnica',
      body: 'Cargo cult ("Netflix usa então usamos" — Netflix tem 1000 engenheiros de infraestrutura, você tem 3), shiny new tech (nova tecnologia sem produção comprovada), sunk cost ("já investimos 6 meses"), early optimization (escalar antes do problema existir), over-engineering para escala que não tem, preferência pessoal disfarçada de técnica.',
    },
  ],
  diagrams: [
    {
      title: 'Dimensões de Tradeoff — Radar de Decisão',
      html: `<style>
.ta-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;max-width:700px}
.ta-header{font-size:13px;font-weight:700;color:#e2e8f0;margin:0 0 4px}
.ta-sub{font-size:10px;color:#475569;margin:0 0 20px}
.ta-dims{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px}
.ta-dim{background:#1e293b;border-radius:8px;padding:10px 12px;border-left:3px solid transparent;cursor:default;transition:background .15s}
.ta-dim:hover{background:#243044}
.ta-dim-name{font-size:10px;font-weight:700;color:#e2e8f0;margin-bottom:3px}
.ta-dim-desc{font-size:9px;color:#64748b;line-height:1.5}
.ta-dim-ex{font-size:8.5px;color:#475569;margin-top:4px;font-style:italic}
.ta-compare{background:#1e293b;border-radius:8px;padding:14px;margin-top:4px}
.ta-compare-title{font-size:10px;font-weight:700;color:#94a3b8;margin-bottom:10px;letter-spacing:.06em;text-transform:uppercase}
.ta-compare-row{display:grid;grid-template-columns:100px 1fr 1fr;gap:8px;margin-bottom:6px;align-items:center}
.ta-compare-dim{font-size:9.5px;color:#64748b}
.ta-compare-opt{font-size:9.5px;padding:4px 8px;border-radius:4px;text-align:center}
</style>
<div class="ta-wrap">
  <p class="ta-header">Dimensões de Tradeoff — O que avaliar em cada decisão</p>
  <p class="ta-sub">Avalie cada dimensão pelo que é crítico no contexto. Não há dimensão sempre mais importante.</p>

  <div class="ta-dims">
    <div class="ta-dim" style="border-left-color:#8b5cf6">
      <div class="ta-dim-name">💰 Custo total (TCO)</div>
      <div class="ta-dim-desc">Dev time + infra + operacional + oportunidade perdida. Dominado pelo salário do time.</div>
      <div class="ta-dim-ex">Auth0 R$800/mês vs 3 meses de sênior para implementar</div>
    </div>
    <div class="ta-dim" style="border-left-color:#3b82f6">
      <div class="ta-dim-name">⚡ Latência / Performance</div>
      <div class="ta-dim-desc">p50, p95, p99. Quantifique antes de otimizar — maioria dos sistemas não tem problema de performance.</div>
      <div class="ta-dim-ex">Cache L1: 1ms vs DB query: 10ms vs API externa: 200ms</div>
    </div>
    <div class="ta-dim" style="border-left-color:#22c55e">
      <div class="ta-dim-name">🔀 Throughput / Escala</div>
      <div class="ta-dim-desc">Capacidade atual vs esperada com margem. Superestimar escala é o over-engineering mais caro.</div>
      <div class="ta-dim-ex">Postgres: 50K writes/s, esperamos 5K → 10x de margem</div>
    </div>
    <div class="ta-dim" style="border-left-color:#f97316">
      <div class="ta-dim-name">🛡️ Disponibilidade</div>
      <div class="ta-dim-desc">SLA exigido vs custo de alcançar. 99.9% vs 99.99% é 10x mais caro e complexo.</div>
      <div class="ta-dim-ex">Cada 9 adicional é ordem de magnitude de complexidade</div>
    </div>
    <div class="ta-dim" style="border-left-color:#eab308">
      <div class="ta-dim-name">⚙️ Complexidade operacional</div>
      <div class="ta-dim-desc">Quem vai operar? O time sabe? On-call é um custo real. Kafka tem grande curva de operação.</div>
      <div class="ta-dim-ex">Kubernetes vs ECS vs Lambda: complexidade operacional muito diferente</div>
    </div>
    <div class="ta-dim" style="border-left-color:#ef4444">
      <div class="ta-dim-name">🚀 Time-to-market</div>
      <div class="ta-dim-desc">Em estágio inicial, entregar rápido vale mais que arquitetura perfeita. Prioridade muda com maturidade.</div>
      <div class="ta-dim-ex">Stack conhecida pelo time &gt; stack "ideal" com curva de 6 meses</div>
    </div>
    <div class="ta-dim" style="border-left-color:#06b6d4">
      <div class="ta-dim-name">🔄 Reversibilidade</div>
      <div class="ta-dim-desc">Two-way door: decide rápido. One-way door: debate mais. Escala inversamente com custo de migração.</div>
      <div class="ta-dim-ex">Framework de test = two-way. Banco de dados core = one-way</div>
    </div>
    <div class="ta-dim" style="border-left-color:#a78bfa">
      <div class="ta-dim-name">🔐 Segurança</div>
      <div class="ta-dim-desc">Superfície de ataque, compliance, gestão de credenciais. SaaS frequentemente mais seguro que self-hosted.</div>
      <div class="ta-dim-ex">Self-hosted Vault vs AWS Secrets Manager: segurança vs custo</div>
    </div>
    <div class="ta-dim" style="border-left-color:#64748b">
      <div class="ta-dim-name">👥 Fit com time</div>
      <div class="ta-dim-desc">O time conhece? Existe sênior para guiar? Curva de aprendizado é custo real de oportunidade.</div>
      <div class="ta-dim-ex">Go "melhor" que Java, mas time é Java → Go custa 6 meses de productivity</div>
    </div>
  </div>

  <div class="ta-compare">
    <div class="ta-compare-title">Exemplo: PostgreSQL vs DynamoDB por dimensão</div>
    <div class="ta-compare-row">
      <div style="font-size:9px;color:#94a3b8;font-weight:700">Dimensão</div>
      <div style="font-size:9px;color:#8b5cf6;font-weight:700;text-align:center">PostgreSQL</div>
      <div style="font-size:9px;color:#3b82f6;font-weight:700;text-align:center">DynamoDB</div>
    </div>
    <div class="ta-compare-row">
      <div class="ta-compare-dim">Escala de escrita</div>
      <div class="ta-compare-opt" style="background:rgba(234,179,8,.1);color:#eab308">Vertical (primário)</div>
      <div class="ta-compare-opt" style="background:rgba(34,197,94,.1);color:#22c55e">Horizontal ilimitado</div>
    </div>
    <div class="ta-compare-row">
      <div class="ta-compare-dim">Consultas ad-hoc</div>
      <div class="ta-compare-opt" style="background:rgba(34,197,94,.1);color:#22c55e">SQL completo</div>
      <div class="ta-compare-opt" style="background:rgba(239,68,68,.1);color:#ef4444">Limitado (access patterns)</div>
    </div>
    <div class="ta-compare-row">
      <div class="ta-compare-dim">Consistência</div>
      <div class="ta-compare-opt" style="background:rgba(34,197,94,.1);color:#22c55e">ACID total</div>
      <div class="ta-compare-opt" style="background:rgba(234,179,8,.1);color:#eab308">Eventual (configurável)</div>
    </div>
    <div class="ta-compare-row">
      <div class="ta-compare-dim">Complexidade ops.</div>
      <div class="ta-compare-opt" style="background:rgba(234,179,8,.1);color:#eab308">Média (RDS facilita)</div>
      <div class="ta-compare-opt" style="background:rgba(34,197,94,.1);color:#22c55e">Mínima (managed)</div>
    </div>
  </div>
</div>`,
      caption: 'Avalie cada dimensão pelo que é crítico para o contexto. Uma startup em fase de validação prioriza time-to-market; um sistema financeiro prioriza consistência e disponibilidade.',
    },
    {
      title: 'Reversibilidade — Two-Way vs One-Way Doors',
      html: `<style>
.rev-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;max-width:680px}
.rev-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
.rev-col{border-radius:10px;padding:16px;border:1px solid transparent}
.rev-col-title{font-size:12px;font-weight:800;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.rev-item{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;padding:8px 10px;border-radius:7px}
.rev-item-label{font-size:10px;font-weight:700;min-width:10px}
.rev-item-content{}
.rev-item-title{font-size:10px;color:#e2e8f0;margin-bottom:2px}
.rev-item-desc{font-size:9px;color:#64748b;line-height:1.5}
.rev-spectrum{background:#1e293b;border-radius:8px;padding:14px;margin-top:16px}
.rev-spectrum-title{font-size:10px;color:#94a3b8;font-weight:700;margin-bottom:10px;text-transform:uppercase;letter-spacing:.06em}
.rev-bar{height:8px;border-radius:4px;background:linear-gradient(to right, #22c55e, #eab308, #ef4444);margin-bottom:6px}
.rev-bar-labels{display:flex;justify-content:space-between;font-size:8.5px;color:#64748b}
.rev-examples{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.rev-chip{font-size:8.5px;padding:3px 8px;border-radius:4px}
</style>
<div class="rev-wrap">
  <p style="color:#e2e8f0;font-size:13px;font-weight:700;margin:0 0 4px">Reversibilidade — Two-Way vs One-Way Doors</p>
  <p style="color:#475569;font-size:10px;margin:0 0 4px">Jeff Bezos: decida rápido em two-way doors; debate profundo em one-way doors.</p>

  <div class="rev-grid">
    <!-- Two-Way Door -->
    <div class="rev-col" style="background:rgba(34,197,94,.05);border-color:rgba(34,197,94,.2)">
      <div class="rev-col-title" style="color:#22c55e">🚪 Two-Way Door<br/><span style="font-size:10px;font-weight:400;color:#64748b">Reversível — decida rápido</span></div>
      <div class="rev-item" style="background:rgba(34,197,94,.08)">
        <div class="rev-item-label" style="color:#22c55e">✓</div>
        <div class="rev-item-content">
          <div class="rev-item-title">Framework de testes</div>
          <div class="rev-item-desc">Jest vs Vitest — trocar é um sprint. Decida e siga.</div>
        </div>
      </div>
      <div class="rev-item" style="background:rgba(34,197,94,.08)">
        <div class="rev-item-label" style="color:#22c55e">✓</div>
        <div class="rev-item-content">
          <div class="rev-item-title">Biblioteca de validação</div>
          <div class="rev-item-desc">Zod vs Joi — wrapper fino, troca em dias se necessário.</div>
        </div>
      </div>
      <div class="rev-item" style="background:rgba(34,197,94,.08)">
        <div class="rev-item-label" style="color:#22c55e">✓</div>
        <div class="rev-item-content">
          <div class="rev-item-title">Formatação de código</div>
          <div class="rev-item-desc">Prettier config — opiniões pessoais, mas trivial mudar.</div>
        </div>
      </div>
      <div class="rev-item" style="background:rgba(34,197,94,.08)">
        <div class="rev-item-label" style="color:#22c55e">✓</div>
        <div class="rev-item-content">
          <div class="rev-item-title">Estado de UI local</div>
          <div class="rev-item-desc">useState vs useReducer — refatorável por componente.</div>
        </div>
      </div>
    </div>

    <!-- One-Way Door -->
    <div class="rev-col" style="background:rgba(239,68,68,.05);border-color:rgba(239,68,68,.2)">
      <div class="rev-col-title" style="color:#ef4444">🔒 One-Way Door<br/><span style="font-size:10px;font-weight:400;color:#64748b">Irreversível — debate profundo</span></div>
      <div class="rev-item" style="background:rgba(239,68,68,.08)">
        <div class="rev-item-label" style="color:#ef4444">!</div>
        <div class="rev-item-content">
          <div class="rev-item-title">Banco de dados principal</div>
          <div class="rev-item-desc">Postgres → DynamoDB = meses de migração, dual-write, validação.</div>
        </div>
      </div>
      <div class="rev-item" style="background:rgba(239,68,68,.08)">
        <div class="rev-item-label" style="color:#ef4444">!</div>
        <div class="rev-item-content">
          <div class="rev-item-title">Cloud provider primário</div>
          <div class="rev-item-desc">AWS → GCP afeta todos os serviços gerenciados, CI/CD, networking.</div>
        </div>
      </div>
      <div class="rev-item" style="background:rgba(239,68,68,.08)">
        <div class="rev-item-label" style="color:#ef4444">!</div>
        <div class="rev-item-content">
          <div class="rev-item-title">Schema de dados core</div>
          <div class="rev-item-desc">Modelo de dados do usuário/produto — mudanças exigem migrations cuidadosas e down time.</div>
        </div>
      </div>
      <div class="rev-item" style="background:rgba(239,68,68,.08)">
        <div class="rev-item-label" style="color:#ef4444">!</div>
        <div class="rev-item-content">
          <div class="rev-item-title">Monolito vs Microserviços</div>
          <div class="rev-item-desc">Dividir o monolito correto = meses; reverter microserviços prematuros = anos.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Espectro -->
  <div class="rev-spectrum">
    <div class="rev-spectrum-title">Espectro de Reversibilidade</div>
    <div class="rev-bar"></div>
    <div class="rev-bar-labels">
      <span style="color:#22c55e">Fácil reverter (dias)</span>
      <span style="color:#eab308">Médio (semanas)</span>
      <span style="color:#ef4444">Caro reverter (meses/anos)</span>
    </div>
    <div class="rev-examples" style="margin-top:12px">
      <span class="rev-chip" style="background:rgba(34,197,94,.1);color:#22c55e">config de lint</span>
      <span class="rev-chip" style="background:rgba(34,197,94,.1);color:#22c55e">biblioteca npm</span>
      <span class="rev-chip" style="background:rgba(234,179,8,.1);color:#eab308">framework web</span>
      <span class="rev-chip" style="background:rgba(234,179,8,.1);color:#eab308">API pública</span>
      <span class="rev-chip" style="background:rgba(249,115,22,.1);color:#f97316">linguagem core</span>
      <span class="rev-chip" style="background:rgba(239,68,68,.1);color:#ef4444">banco de dados</span>
      <span class="rev-chip" style="background:rgba(239,68,68,.1);color:#ef4444">cloud provider</span>
    </div>
  </div>
</div>`,
      caption: 'Quanto mais cara a reversão, mais tempo vale a pena debater antes de decidir. O erro é gastar horas debatendo decisões two-way door enquanto decisões one-way door são tomadas sem análise.',
    },
    {
      title: 'Falácias Comuns de Decisão Técnica',
      html: `<style>
.fal-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;max-width:680px}
.fal-item{background:#1e293b;border-radius:10px;padding:14px 16px;margin-bottom:8px;border-left:4px solid transparent;cursor:default;transition:background .15s}
.fal-item:hover{background:#243044}
.fal-name{font-size:11px;font-weight:700;color:#ef4444;margin-bottom:4px}
.fal-pattern{font-size:10px;color:#f97316;margin-bottom:4px;font-style:italic}
.fal-why{font-size:9.5px;color:#64748b;line-height:1.6;margin-bottom:4px}
.fal-fix{font-size:9.5px;color:#22c55e}
</style>
<div class="fal-wrap">
  <p style="color:#e2e8f0;font-size:13px;font-weight:700;margin:0 0 4px">Falácias Comuns em Decisões Técnicas</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Reconhecer a falácia no próprio raciocínio é o sinal de maturidade.</p>

  <div class="fal-item" style="border-left-color:#ef4444">
    <div class="fal-name">🐑 Cargo Cult</div>
    <div class="fal-pattern">"Netflix usa Cassandra então vamos usar Cassandra"</div>
    <div class="fal-why">Netflix tem 300 engenheiros de infraestrutura, processa 300M de requests/s e investe anos de experiência operacional naquela stack. Você tem 5 devs e 10K usuários.</div>
    <div class="fal-fix">→ Valide se as condições que justificaram a escolha deles existem no seu contexto. Quase sempre não existem.</div>
  </div>

  <div class="fal-item" style="border-left-color:#f97316">
    <div class="fal-name">✨ Shiny New Tech</div>
    <div class="fal-pattern">"Essa tecnologia foi lançada no ano passado e tem muitas estrelas no GitHub"</div>
    <div class="fal-why">Tecnologia nova = baixo número de casos de produção, poucos postmortems públicos, ecossistema de plugins pequeno, hire difícil, possibilidade real de abandono pelo mantenedor.</div>
    <div class="fal-fix">→ Critério: ≥3 anos de produção, empresa de referência usando, stack overflow answers existentes, hiring pool razoável.</div>
  </div>

  <div class="fal-item" style="border-left-color:#a855f7">
    <div class="fal-name">💸 Sunk Cost</div>
    <div class="fal-pattern">"Já investimos 8 meses nessa abordagem, não podemos mudar agora"</div>
    <div class="fal-why">O investimento passado não é recuperável. A decisão relevante é: continuar custa mais ou migrar custa mais? O que foi gasto não é variável da equação futura.</div>
    <div class="fal-fix">→ Enquadre: "Daqui pra frente, qual caminho tem menor custo total?" Ignore o que já foi gasto.</div>
  </div>

  <div class="fal-item" style="border-left-color:#3b82f6">
    <div class="fal-name">🔭 Early Optimization</div>
    <div class="fal-pattern">"Precisamos de arquitetura de microserviços desde o início para escalar"</div>
    <div class="fal-why">Escalar problemas que você não tem é o bug de arquitetura mais caro. Microserviços sem times dedicados, sem infraestrutura de observabilidade e sem problem real de escala criam complexidade que mata a velocidade de entrega.</div>
    <div class="fal-fix">→ "Você tem o problema de escala agora?" Se não, monolito bem estruturado. Escale quando o problema aparecer.</div>
  </div>

  <div class="fal-item" style="border-left-color:#eab308">
    <div class="fal-name">🎭 Preferência Disfarçada de Técnica</div>
    <div class="fal-pattern">"Tecnicamente, MongoDB é superior para esse caso de uso" (mas você só conhece MongoDB)</div>
    <div class="fal-why">Viés de familiaridade: tendemos a encontrar razões técnicas que suportam nossas preferências pessoais. É difícil de perceber no próprio raciocínio.</div>
    <div class="fal-fix">→ Teste: "Se a opção que prefiro tivesse o problema X, ainda a escolheria?" Se sim, talvez seja preferência. Peça revisão de quem prefere a alternativa.</div>
  </div>

  <div class="fal-item" style="border-left-color:#22c55e">
    <div class="fal-name">🔄 Análise Paralisia</div>
    <div class="fal-pattern">"Precisamos analisar mais antes de decidir" (terceira semana de debate sobre framework)</div>
    <div class="fal-why">Acontece em decisões two-way door tratadas como one-way door. Debate eterno é custo real — dias de engenheiro desperdiçados em decisões que seriam fáceis de reverter.</div>
    <div class="fal-fix">→ Identifique se é two-way door. Se for, defina timebox (1h), decida, siga, revisita se necessário depois.</div>
  </div>
</div>`,
      caption: 'Reconhecer essas falácias no próprio raciocínio é o que diferencia a decisão técnica madura. A maioria das discussões técnicas acirradas é pelo menos uma falácia disfarçada.',
    },
    {
      title: 'ADR — Architecture Decision Record',
      html: `<style>
.adr-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;max-width:680px}
.adr-doc{background:#1e293b;border-radius:10px;padding:20px;border:1px solid #334155;font-family:'JetBrains Mono',monospace}
.adr-meta{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px}
.adr-tag{font-size:9px;padding:3px 8px;border-radius:4px;font-weight:700}
.adr-section{margin-bottom:14px}
.adr-section-title{font-size:10px;font-weight:800;color:#8b5cf6;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.adr-section-body{font-size:10px;color:#64748b;line-height:1.7}
.adr-section-body strong{color:#94a3b8}
.adr-alts{display:flex;flex-direction:column;gap:6px;margin-top:6px}
.adr-alt{display:flex;gap:8px;align-items:flex-start;padding:6px 10px;border-radius:6px}
.adr-alt-rejected{font-size:9px;color:#ef4444;flex-shrink:0;margin-top:1px}
.adr-alt-why{font-size:9.5px;color:#64748b}
.adr-tips{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}
.adr-tip{background:#0f172a;border-radius:8px;padding:10px 12px;border:1px solid #1e293b}
.adr-tip-title{font-size:9px;font-weight:700;color:#8b5cf6;margin-bottom:4px}
.adr-tip-body{font-size:9px;color:#64748b;line-height:1.5}
</style>
<div class="adr-wrap">
  <p style="color:#e2e8f0;font-size:13px;font-weight:700;margin:0 0 4px">ADR — Architecture Decision Record</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Formato padrão para documentar decisões técnicas irreversíveis ou de alto impacto.</p>

  <div class="adr-doc">
    <div style="font-size:12px;font-weight:700;color:#e2e8f0;margin-bottom:8px"># ADR-008: Banco de dados para o serviço de pedidos</div>
    <div class="adr-meta">
      <span class="adr-tag" style="background:rgba(34,197,94,.1);color:#22c55e">Status: Accepted</span>
      <span class="adr-tag" style="background:rgba(139,92,246,.1);color:#8b5cf6">Data: 2024-02-10</span>
      <span class="adr-tag" style="background:rgba(148,163,184,.1);color:#94a3b8">Autor: time de backend</span>
    </div>

    <div class="adr-section">
      <div class="adr-section-title">📋 Contexto</div>
      <div class="adr-section-body">O serviço de pedidos precisa de banco de dados próprio. Requisitos: transações multi-step (criar pedido + reservar estoque + registrar pagamento), relatórios contábeis com JOINs complexos, volume atual de 5K writes/dia, projeção de 50K em 2 anos, time com 3 engenheiros backend com experiência em SQL.</div>
    </div>

    <div class="adr-section">
      <div class="adr-section-title">✅ Decisão</div>
      <div class="adr-section-body"><strong>PostgreSQL (via AWS RDS Multi-AZ).</strong> Escolhido porque o caso de uso é orientado a transações e relatórios — ambos são pontos fortes do PostgreSQL. O volume projetado de 50K writes/dia está bem dentro da capacidade de uma instância RDS db.t3.medium.</div>
    </div>

    <div class="adr-section">
      <div class="adr-section-title">❌ Alternativas rejeitadas</div>
      <div class="adr-alts">
        <div class="adr-alt" style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15)">
          <div class="adr-alt-rejected">✗</div>
          <div class="adr-alt-why"><strong style="color:#94a3b8">DynamoDB:</strong> não tem suporte nativo a transações multi-tabela complexas; relatórios contábeis exigiriam scan completo; o time não tem experiência com access patterns.</div>
        </div>
        <div class="adr-alt" style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15)">
          <div class="adr-alt-rejected">✗</div>
          <div class="adr-alt-why"><strong style="color:#94a3b8">MongoDB:</strong> considerado pela flexibilidade de schema, mas o schema dos pedidos já estabilizou e a falta de transações ACID foi problemática em projeto anterior (inconsistência de relatório).</div>
        </div>
      </div>
    </div>

    <div class="adr-section">
      <div class="adr-section-title">⚠️ Consequências</div>
      <div class="adr-section-body">
        <strong>Positivas:</strong> ACID completo, SQL para relatórios, equipe já produtiva, RDS gerencia backups e failover.<br/>
        <strong>Negativas:</strong> escala horizontal requer particionamento manual quando ultrapassar ~1TB; custo de RDS Multi-AZ (~$200/mês) maior que instância single-AZ.<br/>
        <strong>Revisitar quando:</strong> volume ultrapassar 500K writes/dia ou tamanho do banco passar de 2TB — avaliar particionamento ou migração.
      </div>
    </div>
  </div>

  <div class="adr-tips">
    <div class="adr-tip">
      <div class="adr-tip-title">O que um bom ADR tem</div>
      <div class="adr-tip-body">• Contexto com números reais<br/>• Alternativas rejeitadas com razão<br/>• Consequências negativas explícitas<br/>• Critério para revisitar</div>
    </div>
    <div class="adr-tip">
      <div class="adr-tip-title">O que um ADR não é</div>
      <div class="adr-tip-body">• Documentação técnica de implementação<br/>• Justificativa post-hoc de decisão já tomada<br/>• Documento de 10 páginas (5 seções basta)<br/>• Opcional para decisões one-way door</div>
    </div>
    <div class="adr-tip">
      <div class="adr-tip-title">Quando criar ADR</div>
      <div class="adr-tip-body">• Mudança de banco, infraestrutura, auth<br/>• Decisão que afeta múltiplos times<br/>• One-way door com custo significativo<br/>• Quando "por que fizemos assim?" vai ser perguntado</div>
    </div>
    <div class="adr-tip">
      <div class="adr-tip-title">Ferramentas</div>
      <div class="adr-tip-body">• Markdown no repositório (ADR-XXX.md)<br/>• adr-tools (CLI para gerenciar ADRs)<br/>• Notion/Confluence se time já usa<br/>• GitHub Discussions para ADRs em review</div>
    </div>
  </div>
</div>`,
      caption: 'ADR é o artefato que permite revisitar decisões quando o contexto muda. Sem ele, 12 meses depois ninguém lembra por que foi escolhido X — e o contexto que justificava pode ter mudado completamente.',
    },
  ],
  mnemonics: [
    {
      label: 'Dimensões de tradeoff — "Custo Lento Traz Disponibilidade, Complexidade Sem Observabilidade Manda"',
      trick: 'C-L-T-D-C-S-O-M — 7 dimensões principais',
      explanation: 'C = Custo (TCO total), L = Latência/performance, T = Throughput/escala, D = Disponibilidade/SLA, C = Complexidade operacional, S = Segurança, O = Observabilidade. Mais: time-to-market, fit com time, reversibilidade. Para cada decisão, avalie as dimensões que são críticas no contexto.',
    },
    {
      label: 'Reversibilidade — "Two-Way decide Rápido, One-Way debate Fundo"',
      trick: 'TR-OF — two-way = rápido, one-way = fundo',
      explanation: 'Two-way door (reversível) = decide em horas, executa, reverte se errado. One-way door (irreversível ou caro) = debate profundo, explore alternativas, documente em ADR. A maioria dos debates intermináveis é sobre decisões two-way door sendo tratadas como one-way door.',
    },
    {
      label: 'Estrutura de resposta em entrevista — "Contexto, Opções, Sacrifício"',
      trick: 'COS — o que define uma resposta sênior de tradeoff',
      explanation: 'C = Clarifico o contexto (o que é crítico aqui? latência? custo? time-to-market?). O = Listo as Opções plausíveis com prós/contras nas dimensões que importam. S = Escolho com o Sacrifício explícito nomeado ("escolho X, sacrificando Y, e revisito quando Z acontecer"). Entrevistador quer ver o S — não fingir que há solução perfeita.',
    },
    {
      label: 'Falácias comuns — "Cargo Shiny Sunk Early Preferência"',
      trick: 'CSSEP — 5 falácias a reconhecer',
      explanation: 'C = Cargo cult ("Netflix usa então usamos"), S = Shiny new tech (nova sem produção comprovada), S = Sunk cost ("já investimos demais"), E = Early optimization (escalar problema que não existe), P = Preferência pessoal disfarçada de técnica. Reconhecer no próprio raciocínio é o que diferencia.',
    },
    {
      label: 'ADR — "Contexto Decisão Alternativas Consequências"',
      trick: 'CDAC — as 4 seções essenciais de um ADR',
      explanation: 'C = Contexto (por que a decisão foi necessária, com números reais). D = Decisão tomada com justificativa. A = Alternativas rejeitadas (e por quê cada uma foi descartada). C = Consequências, positivas e negativas, e quando revisitar. Um ADR sem as 4 seções é incompleto — as alternativas rejeitadas são tão importantes quanto a decisão tomada.',
    },
  ],
  cheatsheet: {
    title: 'Tradeoff Analysis — Cheatsheet',
    html: `<style>
.tac-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;max-width:700px}
.tac-section{margin-bottom:14px}
.tac-section-title{font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#8b5cf6;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #1e293b}
.tac-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.tac-item{background:#1e293b;border-radius:6px;padding:8px 10px;border-left:3px solid transparent}
.tac-item-key{font-size:10px;font-weight:700;color:#e2e8f0;margin-bottom:2px}
.tac-item-val{font-size:9px;color:#64748b;line-height:1.5}
.tac-flow{display:flex;flex-direction:column;gap:4px}
.tac-flow-item{display:flex;gap:8px;align-items:flex-start;font-size:9.5px;color:#64748b}
.tac-flow-num{color:#8b5cf6;font-weight:700;flex-shrink:0;width:12px}
.tac-table{width:100%;border-collapse:collapse}
.tac-table td{font-size:9px;padding:5px 8px;border:1px solid #1e293b}
.tac-table th{font-size:9px;padding:5px 8px;border:1px solid #1e293b;background:#1e293b;color:#94a3b8;font-weight:700}
</style>
<div class="tac-wrap">
  <p style="color:#e2e8f0;font-size:13px;font-weight:700;margin:0 0 16px">Tradeoff Analysis — Referência Rápida</p>

  <!-- Processo de decisão -->
  <div class="tac-section">
    <div class="tac-section-title">Processo de Decisão (3 passos)</div>
    <div class="tac-flow">
      <div class="tac-flow-item"><span class="tac-flow-num">1.</span><span><strong style="color:#e2e8f0">Clarificar contexto:</strong> o que é crítico AGORA? Latência? Custo? Time-to-market? Segurança? O contexto define o peso das dimensões.</span></div>
      <div class="tac-flow-item"><span class="tac-flow-num">2.</span><span><strong style="color:#e2e8f0">Listar opções plausíveis</strong> com prós/contras nas dimensões que importam. Quantifique quando possível — número ganha de opinião.</span></div>
      <div class="tac-flow-item"><span class="tac-flow-num">3.</span><span><strong style="color:#e2e8f0">Escolher nomeando o sacrifício:</strong> "escolho X, sacrificando Y, e revisito quando Z acontecer". Nunca fingir que não há tradeoff.</span></div>
    </div>
  </div>

  <!-- Dimensões -->
  <div class="tac-section">
    <div class="tac-section-title">Dimensões de Comparação</div>
    <div class="tac-grid">
      <div class="tac-item" style="border-left-color:#8b5cf6"><div class="tac-item-key">💰 Custo (TCO)</div><div class="tac-item-val">Dev + infra + operacional + oportunidade. Salário é o custo dominante.</div></div>
      <div class="tac-item" style="border-left-color:#3b82f6"><div class="tac-item-key">⚡ Latência/Performance</div><div class="tac-item-val">p50/p95/p99. Meça antes de otimizar.</div></div>
      <div class="tac-item" style="border-left-color:#22c55e"><div class="tac-item-key">🔀 Throughput</div><div class="tac-item-val">Capacidade atual vs esperada. Margem de 10x geralmente suficiente.</div></div>
      <div class="tac-item" style="border-left-color:#f97316"><div class="tac-item-key">🔒 Disponibilidade</div><div class="tac-item-val">Cada 9 adicional = 10x de custo e complexidade.</div></div>
      <div class="tac-item" style="border-left-color:#ef4444"><div class="tac-item-key">🚀 Time-to-market</div><div class="tac-item-val">Stack conhecida &gt; stack ideal com curva. Prioridade muda com maturidade.</div></div>
      <div class="tac-item" style="border-left-color:#06b6d4"><div class="tac-item-key">🔄 Reversibilidade</div><div class="tac-item-val">Two-way = decide rápido. One-way = debate fundo + ADR.</div></div>
    </div>
  </div>

  <!-- Regras de ouro -->
  <div class="tac-section">
    <div class="tac-section-title">Regras de Ouro</div>
    <table class="tac-table">
      <tr><th>Regra</th><th>Por quê</th></tr>
      <tr><td style="color:#e2e8f0">Nomeie o sacrifício</td><td style="color:#64748b">Não há solução perfeita. Fingir que há é o sinal mais claro de inexperiência.</td></tr>
      <tr><td style="color:#e2e8f0">Quantifique antes de decidir</td><td style="color:#64748b">Estimativa rough elimina 80% dos debates inválidos. Número ganha de opinião.</td></tr>
      <tr><td style="color:#e2e8f0">Pense no plano de saída</td><td style="color:#64748b">Revela acoplamento oculto e custo de migração real. Mesmo que nunca execute.</td></tr>
      <tr><td style="color:#e2e8f0">Documente em ADR (one-way doors)</td><td style="color:#64748b">Contexto + alternativas rejeitadas. Permite revisitar quando contexto muda.</td></tr>
      <tr><td style="color:#e2e8f0">Revisite quando o contexto muda</td><td style="color:#64748b">A decisão "certa" de hoje pode ser errada amanhã. Não é fraqueza revisitar.</td></tr>
    </table>
  </div>

  <!-- Build vs Buy -->
  <div class="tac-section">
    <div class="tac-section-title">Build vs Buy — Heurística</div>
    <div style="display:flex;gap:8px">
      <div style="flex:1;background:#1e293b;border-radius:8px;padding:10px;border-top:2px solid #22c55e">
        <div style="font-size:10px;font-weight:700;color:#22c55e;margin-bottom:6px">✓ Compra (Buy)</div>
        <div style="font-size:9px;color:#64748b;line-height:1.6">Não é core competitive advantage<br/>Custo dev &gt; custo SaaS por 3 anos<br/>Auth, billing, monitoring, email<br/>Time ganha velocity para features</div>
      </div>
      <div style="flex:1;background:#1e293b;border-radius:8px;padding:10px;border-top:2px solid #ef4444">
        <div style="font-size:10px;font-weight:700;color:#ef4444;margin-bottom:6px">✗ Constrói (Build)</div>
        <div style="font-size:9px;color:#64748b;line-height:1.6">É o produto em si (search no Google)<br/>Vendor lock-in é inaceitável<br/>Nenhum SaaS cobre o requisito exato<br/>Compliance exige controle total</div>
      </div>
    </div>
  </div>
</div>`,
    caption: 'Use como roteiro para qualquer decisão técnica ou resposta de entrevista sobre escolha de tecnologia. O passo mais importante é nomear o sacrifício.',
  },
  mindmap: {
    title: 'Tradeoff Analysis — Mapa Mental',
    html: `<style>
.tam-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;max-width:720px}
.tam-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.tam-cat{background:#1e293b;border-radius:10px;padding:12px;border-top:3px solid transparent}
.tam-cat-title{font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px}
.tam-item{font-size:9.5px;color:#64748b;padding:3px 0 3px 12px;position:relative;line-height:1.5}
.tam-item::before{content:'·';position:absolute;left:4px;color:#475569}
.tam-item.key{color:#94a3b8}
.tam-item.adv{color:#475569;font-style:italic}
</style>
<div class="tam-wrap">
  <div style="text-align:center;margin-bottom:20px">
    <div style="display:inline-block;padding:12px 24px;border-radius:12px;background:rgba(139,92,246,.1);border:2px solid #8b5cf6;font-size:13px;font-weight:800;color:#8b5cf6">⚖️ Tradeoff Analysis</div>
  </div>

  <div class="tam-grid">
    <div class="tam-cat" style="border-top-color:#8b5cf6">
      <div class="tam-cat-title" style="color:#8b5cf6">Dimensões</div>
      <div class="tam-item key">Custo total (TCO)</div>
      <div class="tam-item key">Latência / p99</div>
      <div class="tam-item key">Throughput / escala</div>
      <div class="tam-item key">Disponibilidade / SLA</div>
      <div class="tam-item key">Complexidade ops.</div>
      <div class="tam-item adv">Observabilidade</div>
      <div class="tam-item adv">Segurança / compliance</div>
      <div class="tam-item adv">Fit com time</div>
    </div>
    <div class="tam-cat" style="border-top-color:#3b82f6">
      <div class="tam-cat-title" style="color:#3b82f6">Reversibilidade</div>
      <div class="tam-item key">Two-way door → decide rápido</div>
      <div class="tam-item key">One-way door → debate fundo</div>
      <div class="tam-item key">Exemplos two-way: lib, config</div>
      <div class="tam-item key">Exemplos one-way: DB, cloud</div>
      <div class="tam-item adv">Custo migração revela one-way</div>
    </div>
    <div class="tam-cat" style="border-top-color:#22c55e">
      <div class="tam-cat-title" style="color:#22c55e">Processo de Decisão</div>
      <div class="tam-item key">1. Clarificar contexto crítico</div>
      <div class="tam-item key">2. Listar opções plausíveis</div>
      <div class="tam-item key">3. Nomear o sacrifício</div>
      <div class="tam-item key">Quantificar antes de decidir</div>
      <div class="tam-item adv">Número ganha de opinião</div>
      <div class="tam-item adv">Revisitar quando contexto muda</div>
    </div>
    <div class="tam-cat" style="border-top-color:#ef4444">
      <div class="tam-cat-title" style="color:#ef4444">Falácias</div>
      <div class="tam-item key">Cargo cult</div>
      <div class="tam-item key">Shiny new tech</div>
      <div class="tam-item key">Sunk cost</div>
      <div class="tam-item key">Early optimization</div>
      <div class="tam-item key">Preferência disfarçada</div>
      <div class="tam-item adv">Análise paralisia</div>
    </div>
    <div class="tam-cat" style="border-top-color:#eab308">
      <div class="tam-cat-title" style="color:#eab308">ADR</div>
      <div class="tam-item key">Contexto + Decisão</div>
      <div class="tam-item key">Alternativas rejeitadas</div>
      <div class="tam-item key">Consequências + revisitar quando</div>
      <div class="tam-item adv">Para one-way doors: obrigatório</div>
      <div class="tam-item adv">Versionado no repositório</div>
    </div>
    <div class="tam-cat" style="border-top-color:#f97316">
      <div class="tam-cat-title" style="color:#f97316">Build vs Buy</div>
      <div class="tam-item key">Não é core advantage → compra</div>
      <div class="tam-item key">Custo dev vs SaaS por 3 anos</div>
      <div class="tam-item adv">Auth, billing, monitoring: buy</div>
      <div class="tam-item adv">É o produto em si: build</div>
      <div class="tam-item adv">Lock-in inaceitável: build</div>
    </div>
  </div>
</div>`,
    caption: 'Mapa mental completo de tradeoff analysis — use como checklist antes de uma entrevista de design de sistema ou arquitetura.',
  },
  exercises: [
    {
      level: 'iniciante',
      title: 'Banco de dados para um blog — PostgreSQL vs MongoDB',
      description: 'Um blog tem posts com tags, comentários aninhados e autores. Volume: 10K posts, 100K comentários, 1K usuários. Faça a análise de tradeoff entre PostgreSQL e MongoDB. Para cada opção, avalie: (1) escala de escrita, (2) consultas (listar posts por tag + JOINs), (3) transações (post + notificações de autores), (4) complexidade operacional, (5) fit com time de 2 devs. Escreva a decisão final com o sacrifício nomeado explicitamente.',
      concepts: ['banco-de-dados', 'PostgreSQL', 'MongoDB', 'tradeoffs', 'SQL-vs-NoSQL'],
    },
    {
      level: 'intermediario',
      title: 'Build vs Buy — Sistema de autenticação',
      description: 'Uma startup de B2B SaaS precisa de autenticação com: login/senha, SSO via Google/Microsoft, MFA, convites por e-mail, permissões por organização (multi-tenant). Avalie build vs buy (Auth0/Cognito/Clerk). Para cada opção, estime: (1) custo total de 3 anos (dev time + licença), (2) time-to-market, (3) flexibilidade para casos de uso futuros, (4) lock-in e plano de saída, (5) segurança e compliance. Decida com justificativa e nomeie o sacrifício.',
      concepts: ['build-vs-buy', 'autenticação', 'custo-total', 'lock-in', 'time-to-market'],
    },
    {
      level: 'intermediario',
      title: 'Escrever um ADR para uma decisão que você já tomou',
      description: 'Escolha uma decisão técnica real que você tomou (ou que seu time tomou) nos últimos 12 meses. Escreva o ADR completo: (1) contexto com os requisitos que motivaram a decisão, (2) a decisão tomada e por quê, (3) pelo menos 2 alternativas que foram consideradas e por que foram rejeitadas, (4) consequências positivas e negativas, (5) critério para revisitar (quando o contexto mudaria a decisão). Se não tiver uma decisão real, use: escolha de banco de dados, de framework de teste, de provedor de cloud ou de estratégia de deployment.',
      concepts: ['ADR', 'documentação', 'decisões-técnicas', 'alternativas', 'consequências'],
    },
    {
      level: 'senior',
      title: 'Design de sistema com tradeoffs explícitos — URL shortener',
      description: 'Projete um URL shortener (tipo bit.ly) para 100M de URLs armazenadas, 10K requisições de redirect/s no p50, e 100K no pico. Para cada componente, faça a análise de tradeoff explícita: (1) banco de dados (qual? sharding? por quê?), (2) geração de short codes (centralizado vs distribuído? colisões?), (3) cache (quando? onde? invalidação?), (4) analytics (síncrono vs assíncrono? precisão vs volume?), (5) CDN (necessário? custo vs latência?). Para cada decisão, nomeie o sacrifício e diga quando revisitaria.',
      concepts: ['system-design', 'escalabilidade', 'sharding', 'cache', 'CDN', 'tradeoffs-explícitos'],
    },
    {
      level: 'senior',
      title: 'Monolito vs Microserviços — decisão em contexto',
      description: 'Uma empresa tem: monolito Rails em produção com 5 anos, 30 devs, crescimento de 20%/mês, problemas de deploy (release a cada 2 semanas por medo de breaking changes). O CTO quer migrar para microserviços. Faça a análise completa: (1) quais são os problemas reais? Microserviços os resolve? (2) avalie: strangler fig pattern vs big bang vs manter monolito modularizado, (3) estime custo de migração (pessoa-meses), complexidade de observabilidade adicionada e risco, (4) identifique as falácias de raciocínio que podem estar presentes nessa decisão, (5) faça sua recomendação com sacrifício explícito e critérios de revisita.',
      concepts: ['monolito', 'microserviços', 'strangler-fig', 'falácias', 'custo-de-migração'],
    },
  ],
  codeExamples: [
    {
      title: 'Estrutura de ADR — Template markdown comentado',
      code: `# ADR-{número}: {Título da Decisão}

## Status
<!-- Proposed | Accepted | Deprecated | Superseded by ADR-XXX -->
Accepted

## Contexto
<!--
  Por que a decisão foi necessária? Qual o problema que estamos resolvendo?
  Inclua NÚMEROS: volume, custo atual, SLA exigido, prazo.
  Contexto sem números é opinião, não contexto.
-->
O serviço de notificações precisa de uma fila de mensagens para desacoplar
o envio de e-mails do fluxo de request/response. Volume: 50K notificações/dia,
picos de 5K/min em campanhas de marketing. Time com experiência em Redis e AWS,
nenhuma experiência com Kafka ou RabbitMQ.

## Decisão
<!--
  O que foi decidido. Seja específico — não "vamos usar filas", mas "SQS + Lambda
  com DLQ para reprocessamento, máximo 3 tentativas, visibilidade de 30s".
-->
Adotar Amazon SQS (Standard Queue) + Lambda consumer.
- SQS Standard Queue para entrega at-least-once (duplicatas raras são aceitáveis)
- DLQ (Dead Letter Queue) após 3 falhas para análise manual
- Lambda poll a cada 60s ou quando há mensagens (event source mapping)

## Alternativas Consideradas
<!--
  OBRIGATÓRIO: por que as alternativas foram rejeitadas.
  Sem isso, o ADR não captura o raciocínio — só o resultado.
-->
**Redis Bull/BullMQ:**
Rejeitado — Redis já é usado para cache e misturar responsabilidades cria
risco: se Redis cair, perdemos cache E fila. Separação de responsabilidades.

**Apache Kafka:**
Rejeitado — overkill para o volume atual. Kafka exige ZooKeeper ou KRaft,
cluster de pelo menos 3 brokers, curva operacional alta. Time não tem experiência.
Custo operacional estimado: 1 sênior DevOps por 3 meses para setup + manutenção.
Revisar quando volume ultrapassar 1M mensagens/dia.

**RabbitMQ (self-hosted):**
Rejeitado — preferimos managed service para reduzir carga operacional.
CloudAMQP (managed RabbitMQ) foi avaliado mas SQS é nativo ao nosso ambiente AWS
e tem melhor integração com Lambda e IAM.

## Consequências
**Positivas:**
- Managed service — sem operação de cluster
- Integração nativa com Lambda e IAM
- DLQ para auditoria de falhas
- Custo estimado: ~$5/mês para o volume atual

**Negativas:**
- Entrega at-least-once: consumer deve ser idempotente (processamento duplicado possível)
- Sem garantia de ordem (Standard Queue) — aceitável para notificações
- Vendor lock-in em AWS SQS (plano de saída: BullMQ ou RabbitMQ em 2-3 semanas de migração)

## Revisitar quando
- Volume ultrapassar 1M mensagens/dia → avaliar Kafka
- Requisito de ordem garantida surgir → migrar para SQS FIFO ou Kafka
- Time adquirir experiência em Kafka E houver problema real de throughput`,
      language: 'markdown',
    },
    {
      title: 'Análise de tradeoff como código — decisão de cache',
      code: `// Análise de tradeoff: estratégia de cache para API de catálogo de produtos

interface TradeoffDimension {
  name: string
  weight: 'critical' | 'high' | 'medium' | 'low'
  description: string
}

interface Option {
  id: string
  name: string
  scores: Record<string, { score: 1 | 2 | 3 | 4 | 5; note: string }>
}

// Contexto do problema
const CONTEXT = {
  problem: 'API de catálogo (/products) tem latência de 800ms p99 sob carga',
  volume: '50K RPM no pico, 5K RPM na média',
  data: '50K produtos, atualização a cada 30 min pelo admin, leitura-intensiva',
  team: '3 devs backend, experiência em Redis, sem experiência em Varnish/CDN edge',
  sla: 'p99 < 200ms; máximo 5 min de stale data para usuário',
  constraint: 'Dados por usuário (preços personalizados por região) — cache não pode ser compartilhado ingenuamente',
} as const

const DIMENSIONS: TradeoffDimension[] = [
  { name: 'latency_reduction', weight: 'critical', description: 'Redução de latência (hit rate × speedup)' },
  { name: 'consistency', weight: 'high', description: 'Dados frescos dentro do SLA de 5 min' },
  { name: 'operational_complexity', weight: 'high', description: 'Custo operacional de manter a solução' },
  { name: 'cost', weight: 'medium', description: 'Custo mensal de infraestrutura adicional' },
  { name: 'cache_invalidation', weight: 'high', description: 'Facilidade de invalidar quando produto muda' },
]

const OPTIONS: Option[] = [
  {
    id: 'no_cache',
    name: 'Sem cache (baseline)',
    scores: {
      latency_reduction: { score: 1, note: 'Sem melhoria — 800ms p99 mantido' },
      consistency: { score: 5, note: 'Sempre fresco — direto no DB' },
      operational_complexity: { score: 5, note: 'Zero complexidade adicional' },
      cost: { score: 5, note: 'Sem custo adicional' },
      cache_invalidation: { score: 5, note: 'Não aplicável' },
    },
  },
  {
    id: 'redis_ttl',
    name: 'Redis TTL simples (300s)',
    scores: {
      latency_reduction: { score: 4, note: 'Estimativa: hit rate ~85% após aquecimento → p99 < 50ms' },
      consistency: { score: 4, note: 'Max stale: 5 min (dentro do SLA). Pior caso: produto muda no segundo 0, usuário vê por 5 min' },
      operational_complexity: { score: 4, note: 'Redis já existe para sessão. Padrão simples que o time conhece' },
      cost: { score: 4, note: 'Redis existente — sem custo adicional de infra. ~5% de memória a mais' },
      cache_invalidation: { score: 3, note: 'Invalidação manual possível via DELETE na key. Mas: preços por região → keys por produto × região → 50K × 10 = 500K keys' },
    },
  },
  {
    id: 'redis_write_through',
    name: 'Redis write-through + pub/sub invalidation',
    scores: {
      latency_reduction: { score: 5, note: 'Hit rate >95% — cache nunca stale acidentalmente' },
      consistency: { score: 5, note: 'Invalidação imediata no update — zero stale data' },
      operational_complexity: { score: 2, note: 'Pub/sub para invalidação, subscriber em cada instância, lógica de warm-up. Alta complexidade para time atual' },
      cost: { score: 3, note: 'Pub/sub channels + mais memória Redis + possível upgrade de instância' },
      cache_invalidation: { score: 5, note: 'Evento de update publica invalidação — todos os caches das instâncias ficam consistentes em < 100ms' },
    },
  },
]

// Decisão
const DECISION = {
  chosen: 'redis_ttl',
  rationale: \`
    Redis com TTL de 300s atende 100% do SLA (5 min de stale data aceitável).
    Estimativa de hit rate: 85% após aquecimento → p99 esperado < 60ms (vs 800ms atual).

    Write-through foi descartado: complexidade operacional é 2x para o time atual.
    O benefício marginal (zero stale vs max 5min stale) não justifica a complexidade
    dado o SLA explicitamente aceita 5 min.
  \`,
  sacrifice: \`
    Aceito: dados podem ficar stale por até 5 min após atualização admin.
    Aceito: hit rate de ~85% (não 100%) — os 15% de miss vão ao DB normalmente.
    Aceito: invalidação manual necessária para casos urgentes (price correction urgente).
  \`,
  revisit_when: [
    'SLA de stale data mudar para < 1 min → avaliar write-through ou event-driven invalidation',
    'Produto com preço personalizado por usuário (não região) → arquitetura de cache fundamentalmente diferente',
    'Hit rate real for < 70% após 1 semana → revisar estratégia de keys',
  ],
} as const

console.log('Decisão:', DECISION.chosen)
console.log('Sacrifício explícito:', DECISION.sacrifice)`,
      language: 'typescript',
    },
    {
      title: 'Framework de decisão Build vs Buy — cálculo de TCO',
      code: `// Framework de decisão Build vs Buy
// Aplica a qualquer feature: auth, billing, e-mail, search, analytics

interface BuildVsBuyAnalysis {
  feature: string
  context: {
    teamSize: number
    seniorSalaryMonthly: number  // em R$
    userBase: number
    criticalityLevel: 'low' | 'medium' | 'high' | 'critical'
  }
  buildOption: {
    initialDevMonths: number    // meses de dev sênior para implementar v1
    maintenanceHoursPerMonth: number  // horas/mês de manutenção
    estimatedBugs: 'low' | 'medium' | 'high'  // complexidade de segurança/edge cases
    onCallImpact: boolean       // adiciona ao on-call?
  }
  buyOption: {
    monthlyPriceBRL: number
    setupDays: number           // dias para integração
    vendorLockInScore: 1 | 2 | 3 | 4 | 5  // 5 = lock-in severo
    migrationCostMonths: number  // custo de migrar para alternativa
    securityOwnership: 'us' | 'vendor'  // quem é responsável pela segurança
  }
}

function analyzeTradeoff(analysis: BuildVsBuyAnalysis) {
  const { context, buildOption, buyOption } = analysis
  const hourlyCost = (context.seniorSalaryMonthly / 160)  // 160h/mês

  // Custo de build (3 anos)
  const buildInitialCost = buildOption.initialDevMonths * context.seniorSalaryMonthly
  const buildMaintenanceCost = (buildOption.maintenanceHoursPerMonth * hourlyCost) * 36
  const bugPenalty = { low: 1, medium: 1.3, high: 1.7 }[buildOption.estimatedBugs]
  const onCallPenalty = buildOption.onCallImpact ? context.seniorSalaryMonthly * 0.15 * 36 : 0  // 15% de overhead de on-call
  const totalBuildCost = (buildInitialCost + buildMaintenanceCost) * bugPenalty + onCallPenalty

  // Custo de buy (3 anos)
  const setupCost = (buyOption.setupDays / 20) * context.seniorSalaryMonthly  // dias como meses
  const subscriptionCost = buyOption.monthlyPriceBRL * 36
  const totalBuyCost = setupCost + subscriptionCost

  // Análise qualitativa
  const buildFactors = []
  const buyFactors = []

  if (analysis.context.criticalityLevel === 'critical') {
    buildFactors.push('Feature crítica: controle total sobre incidentes é valioso')
  }
  if (buyOption.vendorLockInScore >= 4) {
    buildFactors.push(\`Lock-in severo (score \${buyOption.vendorLockInScore}/5): custo de migração futuro de \${buyOption.migrationCostMonths} meses\`)
  }
  if (buyOption.securityOwnership === 'vendor') {
    buyFactors.push('Segurança gerenciada pelo vendor: frequentemente superior ao self-managed para times pequenos')
  }
  if (buildOption.estimatedBugs === 'high') {
    buyFactors.push('Alta complexidade de segurança: auth, billing, criptografia — vendor especializado é mais seguro')
  }

  return {
    buildCost3Years: totalBuildCost,
    buyCost3Years: totalBuyCost,
    savingsWithBuy: totalBuildCost - totalBuyCost,
    recommendation: totalBuyCost < totalBuildCost * 0.7 ? 'buy' :
                   totalBuildCost < totalBuyCost * 0.7 ? 'build' : 'depends_on_strategy',
    buildFactors,
    buyFactors,
    sacrifice: {
      ifBuy: \`Lock-in em \${analysis.feature} por \${buyOption.migrationCostMonths} meses de custo de migração. Menos controle sobre roadmap e incidentes.\`,
      ifBuild: \`\${buildOption.initialDevMonths} meses de dev que poderiam ser \${analysis.feature.toLowerCase()} features de negócio. Responsabilidade de segurança e manutenção.\`,
    },
  }
}

// Exemplo: Auth de uma startup
const authAnalysis = analyzeTradeoff({
  feature: 'Autenticação (login, MFA, SSO, permissões)',
  context: { teamSize: 5, seniorSalaryMonthly: 18000, userBase: 10000, criticalityLevel: 'critical' },
  buildOption: {
    initialDevMonths: 3,
    maintenanceHoursPerMonth: 10,
    estimatedBugs: 'high',  // auth tem muitos edge cases de segurança
    onCallImpact: true,
  },
  buyOption: {
    monthlyPriceBRL: 1200,  // ~Auth0 plano B2B
    setupDays: 5,
    vendorLockInScore: 3,
    migrationCostMonths: 2,
    securityOwnership: 'vendor',
  },
})

console.log('Build (3 anos):', \`R$ \${authAnalysis.buildCost3Years.toLocaleString()}\`)
console.log('Buy (3 anos):', \`R$ \${authAnalysis.buyCost3Years.toLocaleString()}\`)
console.log('Recomendação:', authAnalysis.recommendation)
console.log('Sacrifício se buy:', authAnalysis.sacrifice.ifBuy)
// Output esperado:
// Build (3 anos): R$ 126.360  (3 meses iniciais × 1.7 bug penalty + manutenção + on-call)
// Buy (3 anos): R$ 43.200
// Recomendação: buy
// Sacrifício se buy: Lock-in em Autenticação por 2 meses de custo de migração...`,
      language: 'typescript',
    },
    {
      title: 'Resposta estruturada de entrevista — análise de banco de dados',
      code: `// Template de resposta para "por que você escolheu PostgreSQL?"
// Segue o framework: Contexto → Opções → Sacrifício

/*
ENTREVISTADOR: "Em seu último projeto, por que você escolheu PostgreSQL
em vez de MongoDB para o serviço de pedidos?"

RESPOSTA ESTRUTURADA (CONTEXTO → OPÇÕES → SACRIFÍCIO):
*/

const RESPONSE_FRAMEWORK = {
  // 1. CLARIFICAR O CONTEXTO (o que era crítico)
  context: {
    critical_dimensions: [
      'Transações ACID: um pedido envolvia criar pedido + reservar estoque + registrar pagamento em atomicidade',
      'Relatórios contábeis: o setor financeiro precisava de JOINs entre orders, payments e users',
      'Volume: 50K pedidos/dia — bem dentro da capacidade de um Postgres single-node',
    ],
    team_constraint: 'Time de 3 devs sênior todos com experiência em SQL, nenhum com MongoDB em produção',
  },

  // 2. OPÇÕES CONSIDERADAS
  options_evaluated: [
    {
      name: 'PostgreSQL (escolhido)',
      wins: [
        'ACID nativo — atomicidade entre tabelas sem workaround',
        'SQL para relatórios ad-hoc do financeiro',
        'Time já produtivo — zero curva de aprendizado',
        'RDS Multi-AZ para HA sem operação de cluster',
      ],
      loses: [
        'Escala horizontal requer particionamento manual acima de ~1TB',
        'Write throughput vertical — limitado pela instância RDS',
      ],
    },
    {
      name: 'MongoDB (descartado)',
      why_rejected: [
        'Transações multi-documento existem desde v4.0, mas têm overhead significativo e limitações',
        'Schema de pedidos estava estabilizado — flexibilidade de schema não trazia valor',
        'Time sem experiência em produção — curva estimada de 2-3 meses de produtividade reduzida',
        'Problema anterior: relatório inconsistente por falta de transações em projeto com Mongo',
      ],
    },
    {
      name: 'DynamoDB (descartado)',
      why_rejected: [
        'Requer definir access patterns upfront — relatórios ad-hoc impossíveis sem scan completo',
        'JOINs não existem — teria que resolver na aplicação ou usar ElasticSearch para relatórios',
        'Team unfamiliar — would add 6+ months to get proficient',
      ],
    },
  ],

  // 3. SACRIFÍCIO EXPLÍCITO (o que foi abdicado)
  sacrifice: {
    what_we_gave_up: 'Escala horizontal fácil de escrita (point de escala do Postgres)',
    when_it_matters: 'Se o volume ultrapassar 500K pedidos/dia ou a tabela passar de 1TB',
    mitigation: 'Adicionamos sharding por tenant_id na decisão de schema — permite migração para Citus ou sharding manual quando necessário',
    revisit_trigger: 'Volume de escrita ultrapassar 10K writes/s sustentados ou tamanho passar de 2TB',
  },

  // TIP para entrevista:
  interview_tip: \`
    Não diga apenas "escolhemos Postgres porque é melhor".
    Diga: "O contexto era X. Avaliamos A (mas rejeitamos porque...) e B (mas rejeitamos porque...).
    Escolhemos Postgres sabendo que sacrificamos Y — e o plano de mitigação é Z."

    O entrevistador quer ver o raciocínio, não o resultado.
    A resposta que nomeia o sacrifício e tem critério de revisita
    é a resposta que demonstra senioridade.
  \`,
}`,
      language: 'typescript',
    },
  ],
  interview: [
    {
      q: 'Como você estrutura uma análise de tradeoff em entrevista?',
      a: '<p>Frame em <strong>3 passos</strong>: (1) clarifico o contexto e o que é crítico (latência? custo? time-to-market?); (2) listo opções plausíveis com prós/contras nas dimensões que importam; (3) escolho com justificativa explícita do que estou sacrificando.</p><p>Exemplo: <em>"Vou de Postgres em vez de Dynamo aqui porque temos JOIN frequente e o volume cabe até uns 5TB. Sacrifico escala horizontal fácil — quando passar dos 2TB, revisito particionamento ou migração."</em></p><p>O entrevistador quer ver que você <strong>nomeia o sacrifício</strong>, não finge que há solução perfeita. Toda decisão técnica tem custo — a maturidade está em identificá-lo explicitamente.</p>',
      tip: 'O passo mais importante é o 3 — nomear o sacrifício. A maioria dos candidatos responde "escolhi X porque é melhor" sem nomear o que foi abdicado. Isso é o que diferencia pleno de sênior.',
      level: 'senior',
    },
    {
      q: 'Conta uma decisão que você tomou e revisitou depois.',
      a: '<p>Comecei um projeto com MongoDB achando que schema iria variar muito. Um ano depois, o schema estabilizou e a falta de transação multi-documento virou dor real: relatório inconsistente, dificuldade de reportar para contabilidade.</p><p>Migrei para Postgres usando dual-write + backfill, custou 3 meses. <strong>Lição:</strong> o tradeoff que parecia estável mudou (schema estabilizou, requisito de relatório surgiu). O ADR original ajudou a reconstituir o contexto e justificar a migração para o time novo. Hoje, meu default é Postgres até prova em contrário.</p><p>O ponto de maturidade: revisitar não é fraqueza. É o processo funcionando — o contexto mudou, a decisão correta mudou junto.</p>',
      tip: 'A história deve mostrar que você fez a decisão inicial com raciocínio sólido (não foi imprudência), o contexto mudou, e você teve humildade de revisitar. ADR original ajudou a migração — esse detalhe demonstra processo maduro.',
      level: 'senior',
    },
    {
      q: 'Como você decide entre build vs buy?',
      a: '<p>Comparo o custo total de propriedade de 3 anos: build (dev time inicial + manutenção + on-call + oportunidade perdida de não entregar features) vs buy (licença + custo de integração + lock-in).</p><p>Heurística: se não é <strong>core competitive advantage</strong>, compra. Time deve gastar energia onde diferencia o produto. Build de auth, billing, monitoring, e-mail quase sempre dá prejuízo — esses domínios têm edge cases de segurança que um vendor especializado resolve melhor.</p><p>Build faz sentido quando: é o produto em si (search engine no Google), vendor lock-in é inaceitável, nenhum SaaS cobre o requisito exato, ou compliance exige controle total dos dados.</p>',
      tip: 'Trazer o argumento de oportunidade perdida (features que o time não entrega enquanto está construindo auth) é o que demonstra pensamento de negócio, não só técnico. Isso é o que impressiona entrevistadores de posições sênior.',
      level: 'senior',
    },
    {
      q: 'Quando a decisão "errada" é aceitável?',
      a: '<p>Quando o custo de acertar agora é maior que o custo de mudar depois. Em MVP, escolho a stack que o <strong>time conhece</strong> mesmo que não seja "ideal" — entrega rápida importa mais que arquitetura perfeita quando você ainda não sabe se o produto tem product-market fit.</p><p>Em decisão reversível (two-way door), prefiro "good enough now" a "perfect later". O debate eterno sobre decisões fáceis de reverter é um custo real de engenheiro desperdiçado.</p><p>Decisão irreversível (one-way door) merece mais cuidado upfront porque mudar é caro. Banco, schema core, cloud provider — esses merecem análise e ADR antes de decidir.</p>',
      tip: 'A distinção two-way vs one-way door é o framework elegante para justificar quando "errar" é estratégico. Mostra que você entende gestão de risco, não só engenharia.',
      level: 'pleno',
    },
    {
      q: 'Como você convence um time que prefere outra tecnologia?',
      a: '<p>Não tento "ganhar" — busco <strong>alinhar critérios</strong>. Pergunto o que é crítico (latência? familiaridade? custo?), proponho POC pequeno comparando sob esses critérios, deixo o número falar.</p><p>Se mesmo assim divergem, ADR registra a decisão com alternativas e razões. Às vezes você perde a discussão e é melhor assim — diversidade de opinião captura blind spots. O importante é <strong>decisão informada</strong>, não "minha proposta venceu".</p><p>Anti-padrão: tentar convencer sem primeiro entender a objeção. A objeção técnica frequentemente esconde preocupação sobre familiaridade, risco de carreira ("e se não funcionar?") ou experiência ruim anterior.</p>',
      tip: 'O ponto sobre "às vezes você perde e é melhor assim" é sofisticado e verdadeiro. Mostra que você coloca o resultado do time acima do ego na decisão. Entrevistadores de liderança técnica adoram essa perspectiva.',
      level: 'senior',
    },
    {
      q: 'O que é um ADR e quando você criaria um?',
      a: '<p>ADR (Architecture Decision Record) documenta: <strong>contexto</strong> (por que a decisão foi necessária, com números), <strong>decisão</strong> (o que foi escolhido e por quê), <strong>alternativas rejeitadas</strong> (e por que cada uma foi descartada), <strong>consequências</strong> (positivas e negativas, e quando revisitar).</p><p>Crio um ADR quando: mudança de banco de dados, cloud provider ou autenticação; decisão que afeta múltiplos times; one-way door com custo significativo de reversão; quando "por que fizemos assim?" vai ser perguntado daqui a 6 meses.</p><p>O ADR mais valioso não é a seção de decisão — é a seção de alternativas rejeitadas. É o que captura o raciocínio, não o resultado. Sem ela, o ADR é só changelog.</p>',
      tip: 'Afirmar que alternativas rejeitadas são a parte mais valiosa do ADR demonstra que você entende o propósito da ferramenta: capturar raciocínio, não só resultado. Esse insight é de quem usa ADR de verdade.',
      level: 'pleno',
    },
    {
      q: 'Como você lida com a falácia do sunk cost em decisões técnicas?',
      a: '<p>Sunk cost é o viés de continuar em uma decisão ruim porque "já investimos muito". A falácia: o investimento passado não é recuperável — não é variável da equação futura.</p><p>O enquadramento correto: "Daqui para frente, qual caminho tem menor custo total?" O que foi gasto ontem não aparece nessa equação. Se continuar custará R$100K e migrar custará R$30K, você migra — independente de já ter gasto R$200K.</p><p>Em prática: quando encontro resistência à mudança baseada em investimento passado, trago o enquadramento de custo futuro vs custo de migração. Se o custo de migração for menor, a decisão é clara. Documentar as duas opções com números elimina o viés emocional.</p>',
      tip: 'O enquadramento "custo futuro, não custo passado" é a forma operacional de lidar com sunk cost. Trazer números para a discussão é o que elimina o argumento emocional de "já investimos tanto".',
      level: 'pleno',
    },
    {
      q: 'Como você analisa o tradeoff entre consistência e disponibilidade (CAP theorem)?',
      a: '<p>CAP theorem: em presença de falha de rede (P), você escolhe entre <strong>Consistência (C)</strong> — todos os nós veem os mesmos dados — ou <strong>Disponibilidade (A)</strong> — o sistema responde mesmo que com dados potencialmente stale.</p><p>Na prática, a escolha depende do domínio:<br/>Dados financeiros (saldo, transações): CP — inconsistência cria problemas regulatórios e legais. Aceitar indisponibilidade por segundos é preferível a double-spend.<br/>Feed de redes sociais, contagem de likes: AP — dados stale por alguns segundos são aceitáveis. Indisponibilidade é mais custosa que inconsistência eventual.<br/>Catálogo de e-commerce: AP — preço errado por segundos é recuperável; catálogo indisponível perde venda.</p><p>O PACELC model estende o CAP: mesmo sem falha de rede, você troca latência por consistência (L-C tradeoff). DynamoDB: E-L (eventual, baixa latência). PostgreSQL síncrono: E-C (consistente, latência maior).</p>',
      tip: 'Mencionar PACELC além do CAP demonstra que você conhece a evolução do modelo. CAP é "quando tem falha de rede" — PACELC adiciona "e quando não tem". Essa distinção é de nível sênior.',
      level: 'senior',
    },
    {
      q: 'Quais são os sinais de que uma decisão de arquitetura foi prematura?',
      a: '<p>Sinais de decisão prematura (over-engineering):</p><ul><li><strong>Microserviços sem time dedicado:</strong> cada serviço precisa de deploy, CI/CD, monitoring, log aggregation próprios. Sem infraestrutura e time para operar, cria complexidade sem benefício.</li><li><strong>Event sourcing sem requisito de auditoria:</strong> a complexidade operacional de event sourcing (projections, replay, snapshots) só vale se auditoria ou time-travel de estado for requisito real.</li><li><strong>Message queue para volume de 1K requests/dia:</strong> overhead de operação não justificado — chamada HTTP direta é mais simples e igualmente confiável.</li><li><strong>Sharding antes de 100GB de dados:</strong> sharding adiciona complexidade de query e operação enorme para problemas que cache e índice resolvem.</li></ul><p>Critério: "Temos o problema que essa complexidade resolve agora?" Se a resposta for "vamos ter", e ainda não tiver — espere até ter.</p>',
      tip: 'Os exemplos concretos (microserviços sem time, event sourcing sem requisito) demonstram experiência real com over-engineering. A pergunta "temos o problema agora?" é o filtro prático que muitos times precisam ouvir.',
      level: 'senior',
    },
    {
      q: 'Como você quantifica o custo de complexidade técnica em uma decisão?',
      a: '<p>Complexidade tem custos mensuráveis:<br/><strong>Tempo de onboarding:</strong> quanto tempo um dev novo leva para ser produtivo? Monolito: 2 semanas. 15 microserviços: 6 semanas. Diferença = 4 semanas × salário do sênior que faz o onboarding + salário do novo dev × productivity loss.<br/><strong>Tempo de debugging:</strong> um bug em monolito é encontrado em 1h. Em sistema distribuído com tracing ruim, pode levar 8h. Multiplique pela frequência.<br/><strong>Custo de teste:</strong> teste de integração de sistema distribuído tem setup 5x mais complexo. Isso reduz cobertura e aumenta bugs em produção.<br/><strong>Cognitive load:</strong> difícil quantificar diretamente, mas manifesta-se em bugs, PRs mais lentos, resistência a mudanças.</p><p>Não precisa ser preciso — uma estimativa de ordem de magnitude (10x vs 2x mais caro) já é suficiente para tomar a decisão.</p>',
      tip: 'Quantificar complexidade em tempo de onboarding e debugging é raro e impressionante. A maioria dos candidatos fala de complexidade de forma qualitativa — trazer números (mesmo estimativas) demonstra pensamento rigoroso.',
      level: 'senior',
    },
    {
      q: 'Monolito vs microserviços — quando cada um faz sentido?',
      a: '<p><strong>Monolito faz sentido quando:</strong> time pequeno (< 15 devs), produto em fase de descoberta (requisitos mudam muito), domínio de negócio ainda mal compreendido, infraestrutura de observabilidade limitada. Velocidade de entrega é maximizada — um deploy, uma base de código, JOINs no banco.<br/><strong>Microserviços fazem sentido quando:</strong> times independentes que precisam de autonomia de deploy, domínios com SLAs muito diferentes (ex: checkout crítico vs relatório pode ter downtime), escala diferente por componente (ex: serviço de busca vs serviço de pagamento), necessidade de tecnologias diferentes por domínio.</p><p>Armadilha mais comum: microserviços prematuros. Quando o domínio ainda não está bem definido, a fronteira entre serviços vai errar — e corrigir fronteira entre microserviços é 10x mais caro que refatorar dentro de um monolito.</p><p>Padrão correto: começar com monolito bem estruturado por módulo → extrair serviço quando a necessidade de autonomia de deploy ou escala for concreta.</p>',
      tip: '"Começar com monolito modular e extrair quando a necessidade for concreta" é a resposta que demonstra maturidade. Muitos candidatos defende microserviços desde o início sem articular o custo.',
      level: 'senior',
    },
    {
      q: 'Como você decide sobre sincronismo vs assincronismo em comunicação entre serviços?',
      a: '<p>Critério principal: o chamador precisa da resposta para continuar?</p><p><strong>Síncrono (HTTP/gRPC):</strong> quando o resultado é necessário imediatamente para a resposta do usuário. Ex: autenticação, consulta de saldo, disponibilidade de produto. Tradeoff: acoplamento temporal (se o serviço B cai, A falha também), latência somada.<br/><strong>Assíncrono (filas/eventos):</strong> quando a operação pode ser feita depois sem impactar o usuário imediatamente. Ex: envio de e-mail, processamento de imagem, analytics, notificações. Tradeoff: complexidade (eventual consistency, idempotência, DLQ), observabilidade mais difícil, debugging mais complexo.</p><p>Híbrido prático: o request HTTP do usuário responde imediatamente (síncrono com usuário) e dispara processamento assíncrono em background. Ex: upload de arquivo → responde 202 Accepted → processa em fila → notifica via webhook/polling.</p>',
      tip: 'A distinção "o chamador precisa da resposta para continuar?" é o critério mais limpo. O padrão híbrido (responde 202 + processa async) é o pattern real de produção que a maioria dos sistemas usa.',
      level: 'pleno',
    },
    {
      q: 'Como você escolhe entre REST e GraphQL para uma API?',
      a: '<p>REST faz sentido quando: clientes são homogêneos (apenas app mobile ou apenas web), recursos são bem definidos e estáveis, caching por URL é importante (CDN, browser cache), a equipe não tem experiência com GraphQL.<br/><strong>GraphQL faz sentido quando:</strong> múltiplos clientes com necessidades de dados muito diferentes (mobile que precisa de subset, web que precisa de mais), évita overfetching/underfetching em APIs públicas ou com consumidores externos, schema evolution sem versioning.<br/><strong>Problemas do GraphQL que devem ser nomeados:</strong> N+1 queries (sem DataLoader), depth limiting necessário (proteção de DoS), caching mais complexo (não é por URL), authorization por campo é mais trabalhosa, tooling e expertise mais escassa.</p><p>Meu padrão: REST interno entre microserviços, GraphQL apenas quando há consumidores externos heterogêneos. Evitar GraphQL como padrão geral por custo de complexidade não justificado.</p>',
      tip: 'Nomear os problemas do GraphQL (N+1, depth limit, caching) é o que demonstra experiência de produção. Candidatos que só falam dos benefícios claramente não operaram GraphQL em escala.',
      level: 'senior',
    },
    {
      q: 'Como você lida com o lock-in de vendor em decisões de cloud?',
      a: '<p>Lock-in existe em grau — o objetivo não é zero lock-in (impraticável), mas lock-in consciente com plano de saída avaliado.</p><p>Tipos de lock-in (do mais para o menos reversível):<br/>1. Serviços commodity com equivalência direta (S3 → GCS → Azure Blob): trocar é questão de configuração e credenciais. Baixo lock-in real.<br/>2. Serviços com equivalência mas com diferenças (RDS Aurora → Cloud SQL): dados portáveis via dump, mas otimizações específicas não migram.<br/>3. Serviços sem equivalência direta (AWS Step Functions, DynamoDB com capacidades específicas): migração exige reescrever a integração.<br/>4. Lock-in de orquestração (toda infra em CloudFormation proprietário): migrar exige reescrever IaC.</p><p>Mitigação prática: usar Terraform em vez de CloudFormation reduz o lock-in de IaC. Dockerizar aplicações reduz lock-in de runtime. O lock-in de serviço (RDS, S3) frequentemente é aceitável pelo valor entregue.</p>',
      tip: 'Classificar lock-in por grau de reversibilidade é mais útil que "evite lock-in" genérico. Mostrar que zero lock-in é impraticável e que o objetivo é lock-in consciente é o que demonstra pensamento pragmático.',
      level: 'senior',
    },
    {
      q: 'Como você decidiria entre SQL e NoSQL para um caso de uso específico?',
      a: '<p>Ao invés de "SQL vs NoSQL", enquadro por dimensões críticas do caso de uso:</p><p><strong>Use SQL quando:</strong> há JOINs complexos ou frequentes, transações ACID são requisito (financeiro, estoque), schema está estável, team experience é em SQL, relatórios ad-hoc são necessários, volume está dentro da capacidade de um nó gerenciado (< 5TB, < 50K writes/s).</p><p><strong>Use NoSQL quando:</strong> schema genuinamente variável (não "schema pode mudar" — schema VARIA de registro para registro), escala de escrita horizontal é requisito real (> 100K writes/s), access patterns são previsíveis e definidos upfront (DynamoDB), dados naturalmente documentados sem relacionamentos complexos.</p><p>Erro comum: escolher NoSQL "para escalar" quando o volume cabe facilmente em Postgres + RDS. Postgres em RDS Multi-AZ com read replica aguentam 99% dos sistemas.</p>',
      tip: '"Postgres + RDS com read replica aguenta 99% dos sistemas" é uma afirmação forte e verdadeira. Candidatos que defendem NoSQL por padrão sem quantificar o problema de escala real cometem early optimization.',
      level: 'pleno',
    },
    {
      q: 'O que é PACELC e por que ele é mais útil que o CAP theorem na prática?',
      a: '<p>CAP theorem: em presença de falha de rede (P), escolha Consistência (C) ou Disponibilidade (A). Problema: a maioria dos sistemas não experimenta falhas de rede o tempo todo — o que acontece no caso normal?</p><p><strong>PACELC</strong> estende o CAP: P (partição) → A/C tradeoff (como no CAP); E (else, sem partição) → L (latência) ou C (consistência) tradeoff. Na normalidade, você troca latência por consistência.</p><p>Exemplos práticos:<br/>DynamoDB: PA/EL — quando tem partição, disponível; na normalidade, baixa latência (eventual consistency).<br/>PostgreSQL síncrono: PC/EC — quando tem partição, consistente (pode recusar requisições); na normalidade, consistente (maior latência de escrita com replicação síncrona).<br/>DynamoDB com strong consistent reads: PA/EC — pagando latência extra por leitura consistente.</p><p>PACELC é mais útil porque explicita o custo de consistência mesmo em operação normal — que é quando a maioria das requisições acontece.</p>',
      tip: 'Conhecer PACELC além do CAP é raro e demonstra que você leu além do básico. A explicação de que o custo real de consistência é latência no caso normal (não só em falhas) é o insight-chave.',
      level: 'senior',
    },
    {
      q: 'Como você decidiria sobre a adoção de uma tecnologia nova sem histórico em produção?',
      a: '<p>Framework de avaliação para tecnologia nova:</p><p><strong>1. Necessidade real vs hype:</strong> existe problema real que essa tecnologia resolve melhor que alternativas comprovadas? Se a resposta for "seria interessante experimentar", é hype, não necessidade.<br/><strong>2. Sinal de maturidade:</strong> ≥3 anos de existência, empresa de referência usando em escala similar, postmortems públicos disponíveis (mostram que opera em produção real), Stack Overflow answers existentes, hiring pool razoável.<br/><strong>3. Risco de abandono:</strong> mantido por empresa ou fundação estável? Existe alternativa se o projeto for abandonado?<br/><strong>4. Custo de saída:</strong> se precisar migrar em 2 anos, quanto custaria? Low lock-in = risco menor de adoção.</p><p>Estratégia de adoção gradual: POC isolado → serviço não-crítico em produção → expandir se os problemas reais forem menores que os benefícios. Nunca adotar tecnologia nova em sistema crítico sem histórico interno.</p>',
      tip: 'O framework de 4 passos é actionable e demonstra processo. O ponto sobre postmortems públicos (não só estrelas no GitHub) é o sinal de maturidade que candidatos menos experientes não consideram.',
      level: 'senior',
    },
    {
      q: 'Como você documentaria uma decisão de não fazer algo (decisão de exclusão)?',
      a: '<p>Decisões de exclusão são tão importantes quanto decisões de adoção, mas raramente documentadas. Exemplos: "decidimos não usar GraphQL", "decidimos não migrar para microserviços agora", "decidimos aceitar a inconsistência eventual".</p><p>Formato no ADR: mesma estrutura (Contexto, Decisão, Alternativas, Consequências), mas a "Decisão" é a exclusão explícita. Exemplo:</p><p>Decisão: NÃO migrar para microserviços no Q1/Q2.<br/>Contexto: time de 8 devs, domínio de negócio ainda evoluindo rapidamente (3 pivots nos últimos 12 meses), infra de observabilidade inexistente.<br/>Consequências positivas: time mantém velocidade, não paga custo operacional de microserviços prematuros.<br/>Consequências negativas: monolito crescerá em complexidade; revisitar quando domínio estabilizar ou time ultrapassar 20 devs.<br/>Revisar quando: domínio estabilizar E time ultrapassar 15 devs.</p><p>Sem ADR de exclusão, 6 meses depois alguém propõe a mesma coisa e o time não sabe por que foi descartada — reprocessa a mesma decisão.</p>',
      tip: 'Decisões de exclusão são o ponto cego da maioria dos times. Mostrar que você documenta "não fazer" com a mesma rigorosidade que "fazer" demonstra maturidade de processo incomum.',
      level: 'pleno',
    },
    {
      q: 'Como você decide sobre o nível de disponibilidade (número de 9s) de um sistema?',
      a: '<p>Cada 9 de disponibilidade tem custo e complexidade exponencialmente maiores:<br/>99% = 87h de downtime/ano — aceitável para ferramentas internas, dashboards não-críticos<br/>99.9% = 8.7h — aceitável para a maioria das aplicações B2B<br/>99.99% = 52min — sistemas críticos, impacto financeiro direto de downtime<br/>99.999% = 5min — sistemas de infraestrutura crítica, exige redundância em múltiplas regiões</p><p>Processo de decisão: (1) qual o custo de 1h de downtime? (revenue lost + SLA penalty + support cost + reputação). (2) multiplicar pelo downtime esperado por nível. (3) comparar com o custo incremental de subir de 99.9% para 99.99% (Multi-AZ → Multi-Region, active-active, chaos engineering).</p><p>Armadilha comum: pedir 99.99% sem ter plano concreto de como alcançar e sem calcular o custo. Multi-Region active-active para alcançar 99.99% pode custar 3-5x mais em infra e eng time.</p>',
      tip: 'O custo financeiro de cada nível de disponibilidade é o que transforma uma discussão técnica em decisão de negócio. Candidatos que falam de 9s sem mencionar custo de alcançar não demonstram maturidade de sistema real.',
      level: 'senior',
    },
    {
      q: 'Como você decidiria entre event-driven e request-response para comunicação entre serviços?',
      a: '<p>Critérios para event-driven:</p><ul><li>O serviço A não precisa saber qual serviço vai processar o evento (desacoplamento real)</li><li>Múltiplos consumidores podem reagir ao mesmo evento (fan-out)</li><li>Consistência eventual é aceitável no domínio</li><li>O processamento pode ser assíncrono sem impactar UX</li></ul><p>Critérios para request-response:</p><ul><li>A resposta é necessária imediatamente para continuar o fluxo</li><li>Há apenas um consumidor previsto</li><li>Consistência forte é requisito (transação distribuída)</li><li>Latência total importa (cada hop adiciona latência)</li></ul><p>Custo do event-driven que deve ser nomeado: eventual consistency (sistema pode ter dados inconsistentes por período), debugging mais complexo (rastrear uma requisição entre eventos requer tracing distribuído), idempotência obrigatória nos consumers (eventos podem ser duplicados), dead letter queue e estratégia de retry são operação adicional.</p>',
      tip: 'Nomear os custos do event-driven (idempotência, DLQ, tracing distribuído, eventual consistency) é o que demonstra que você operou sistemas event-driven em produção, não só os projetou no whiteboard.',
      level: 'senior',
    },
    {
      q: 'Como você avalia o impacto de um tradeoff na segurança de um sistema?',
      a: '<p>Segurança entra como dimensão em qualquer análise de tradeoff — não é separada. Dimensões específicas de segurança para avaliar:</p><p><strong>Superfície de ataque:</strong> a opção A expõe mais endpoints públicos? Mais permissões de IAM? Mais dados sensíveis em trânsito? Cada adição à superfície deve ser justificada pelo valor entregue.<br/><strong>Ownership de segurança:</strong> SaaS gerenciado frequentemente tem equipe de segurança dedicada — self-hosted significa que você é responsável por patches, configuração, monitoramento. Para sistemas de autenticação, billing, e sistemas com dados PCI/PII, vendor especializado geralmente é mais seguro.<br/><strong>Compliance:</strong> a opção escolhida facilita ou dificulta conformidade com LGPD, PCI-DSS, SOC 2? Custo de conformidade deve entrar no TCO.<br/><strong>Incidente response:</strong> se a opção escolhida for comprometida, qual o blast radius? Menor acoplamento = menor blast radius.</p>',
      tip: 'Incluir segurança como dimensão de tradeoff (não como checklist separado) é o que demonstra visão integrada. O ponto sobre SaaS frequentemente mais seguro que self-managed é contraintuitivo mas verdadeiro para a maioria dos times.',
      level: 'senior',
    },
  ],
  gotchas: [
    'Decidir por preferência pessoal disfarçada de técnica — "prefiro Mongo" sem justificativa contextual.',
    'Comparar opção em estado ideal vs estado real do que você já tem — sempre o novo brilha mais. Avalie no mesmo nível de maturidade.',
    'Esquecer o fator humano — time conhece Java mas você escolhe Go porque é "melhor" — vai pagar 6 meses de curva de aprendizado.',
    'Análise paralisia — debate eterno por decisão reversível barata. Decida e siga, ajuste depois.',
    'Não documentar — 6 meses depois ninguém lembra por que escolheu X, e o contexto que justificava mudou.',
    'Over-engineering para escala que não existe — microserviços, Kafka, sharding antes do problema ser real.',
    'Ignorar o plano de saída — lock-in não pensado vira armadilha 2 anos depois quando o contexto muda.',
    'Sunk cost paralisa a revisita — o investimento passado não é variável da decisão futura.',
  ],
  resources: [
    { title: 'Software Architecture: The Hard Parts', url: 'https://www.oreilly.com/library/view/software-architecture-the/9781492086888/', kind: 'livro' },
    { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/', kind: 'livro' },
    { title: 'ADR (Architecture Decision Records) — formato e exemplos', url: 'https://adr.github.io/', kind: 'docs' },
    { title: 'Martin Fowler — Architecture', url: 'https://martinfowler.com/architecture/', kind: 'artigo' },
    { title: 'Thoughtworks Tech Radar', url: 'https://www.thoughtworks.com/radar', kind: 'artigo' },
    { title: 'PACELC Theorem — Daniel Abadi', url: 'https://dbmsmusings.blogspot.com/2010/04/problems-with-cap-and-yahoos-little.html', kind: 'artigo' },
    { title: 'Joel on Software — Architecture Astronauts', url: 'https://www.joelonsoftware.com/2001/04/21/dont-let-architecture-astronauts-scare-you/', kind: 'artigo' },
    { title: 'Amazon Leadership Principles — Disagree and Commit', url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles', kind: 'artigo' },
  ],
  videos: [
    { title: 'Software Architecture Monday — Mark Richards', channel: 'Fundamentals of Software Architecture', url: 'https://www.youtube.com/watch?v=BNTt2aLB1tg' },
    { title: 'Making Architecture Matter — Martin Fowler', channel: 'OSCON 2015', url: 'https://www.youtube.com/watch?v=DngAZyWMGR0' },
    { title: 'Architecture Decision Records Explained', channel: 'TechWorld with Nana', url: 'https://www.youtube.com/watch?v=LU-GVSmRbsk' },
    { title: 'The Hard Parts of Software Architecture', channel: 'GOTO Conferences', url: 'https://www.youtube.com/watch?v=bbE__7ASJMI' },
    { title: 'Why Engineers Should Think Like Business Owners', channel: 'Engineering with Utsav', url: 'https://www.youtube.com/watch?v=3S7mMkBL53k' },
  ],
}

export default tradeoffAnalysis
