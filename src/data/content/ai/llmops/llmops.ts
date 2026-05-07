import type { SkillContent } from '@/types'

const llmops: SkillContent = {
  tagline: 'MLOps adaptado para LLMs: deploy, eval, versionamento, custo, drift.',
  why: 'Em entrevista sênior, mostrar que você pensa em ciclo de vida (não só escrever prompt) é o que diferencia AI engineer de quem só brincou com ChatGPT.',
  summary: 'LLMOps cobre tudo que envolve operar LLM em produção: dataset versioning, prompt registry, eval em CI, A/B testing, monitoring de custo e drift, fallback entre modelos, cache, rate limiting. Diferente de MLOps, modelo é quase sempre 3rd party — você versiona prompts, eval sets e infra ao redor.',
  keypoints: [
    { title: 'Prompt registry', body: 'Prompts versionados como código (git) ou via plataforma (LangSmith Hub, PromptLayer). Cada deploy fixa versão específica. Sem registry, rollback de prompt é impossível.' },
    { title: 'Eval em CI', body: 'Eval set com exemplos → roda em cada PR → gate no merge. Ferramentas: RAGAS, OpenAI Evals, Promptfoo. Sem isso você regride sem perceber. Minimum score threshold bloqueia merge.' },
    { title: 'Observabilidade', body: 'Trace por requisição: prompt, response, latência, tokens, custo, user_id. LangSmith, Langfuse, Phoenix, Helicone. Exporta para Datadog/Grafana via OTLP. Sem trace, debugging de produção é impossível.' },
    { title: 'Cost monitoring', body: 'Tag cada chamada por feature/user/tenant. Alerta em spike. Budget caps por API key. Modelos diferentes por tier de plano (Haiku para básico, Sonnet para premium).' },
    { title: 'Caching', body: 'Cache exato por hash(prompt+model+params). Semantic cache (similaridade cosine) para perguntas parecidas — Redis + embeddings. Reduz 30-50% de custo. TTL por tipo de resposta.' },
    { title: 'Fallback', body: 'Modelo primário falha (rate limit, timeout)? Fallback para secundário: Anthropic → OpenAI → Bedrock. LiteLLM ou camada própria. Prompts precisam ser portáveis entre providers.' },
    { title: 'Guardrails', body: 'Input: PII detection, prompt injection check, topic classifier. Output: toxicity, hallucination score, schema validation. NeMo Guardrails, Guardrails AI, LlamaGuard.' },
    { title: 'Drift detection', body: 'Distribuição de input mudou? Resposta degradou? Run eval set semanal e compara com baseline. Monitor embedding drift. Alerta se similaridade média cair.' },
    { title: 'A/B testing de prompts', body: 'Shadow deploy: novo prompt roda em paralelo sem afetar usuário. Canary: 5% do tráfego. Rollout gradual. Métricas: qualidade (eval), custo (tokens), latência.' },
    { title: 'Rate limiting e throttling', body: 'Implementar fila com backoff exponencial. Token bucket por user/tenant. Circuit breaker para provider. Sem isso, um bug de loop consome cota toda.' },
  ],
  gotchas: [
    'Prompts hardcoded no código sem versão — impossível rollback quando qualidade cai.',
    'Sem eval set: cada mudança de prompt é fé. Quantifique qualidade antes de mudar.',
    'Logar prompt completo sem mascarar PII — vaza dados sensíveis em LangSmith/Datadog.',
    'Não ter budget alert: alguém deixa loop bug e gasta R$50k em uma noite.',
    'Cache ingênuo (string match exato) tem hit rate baixo. Use semantic cache para ganhar.',
    'Esquecer rate limiting downstream: API do OpenAI cai, sua app inteira para.',
    'Não versionar modelo — provider deprecated v1, seu eval set quebra silenciosamente.',
    'Misturar modelos de embedding entre indexação e query — recall cai para zero.',
    'Não incluir model_name e model_version nos logs — impossível comparar custo entre versões.',
  ],
  interview: [
    {
      level: 'senior',
      q: 'O que você monitora em LLM em produção e com quais ferramentas?',
      a: '<p>Quatro dimensões:</p><ul><li><strong>Negócio:</strong> taxa de aprovação, satisfação do usuário (thumbs up/down), task completion rate.</li><li><strong>Qualidade:</strong> faithfulness, relevancy via RAGAS amostral (1-5% das requests). LLM-as-judge para escala.</li><li><strong>Sistema:</strong> latência p50/p95/p99, tokens in/out, custo por requisição, cache hit rate.</li><li><strong>Falhas:</strong> rate limit errors, timeouts, schema inválido, refusals, hallucination flags.</li><li><strong>Drift:</strong> distribuição de inputs, embedding drift, eval set semanal comparado com baseline.</li></ul><p>Stack: Langfuse para traces, Grafana para métricas operacionais, Datadog para alertas de custo.</p>',
      tip: 'Mencione as quatro dimensões (negócio, qualidade, sistema, falhas). A maioria só fala de latência e tokens — cobertura de negócio demonstra maturidade sênior.',
    },
    {
      level: 'senior',
      q: 'Como faria deploy seguro de novo prompt em produção?',
      a: '<p>Pipeline de 4 fases:</p><ol><li><strong>CI eval:</strong> roda eval set automatizado (Promptfoo/RAGAS) na PR. Gate de qualidade mínima bloqueia merge.</li><li><strong>Shadow deploy:</strong> novo prompt roda em paralelo do antigo 100% do tráfego, outputs comparados, sem impacto no usuário.</li><li><strong>Canary:</strong> 5% do tráfego real no novo prompt. Observa métricas 24-48h.</li><li><strong>Rollout gradual:</strong> 20% → 50% → 100%. Rollback automático se qualidade cai abaixo do threshold.</li></ol><p>Todo prompt novo tem versão no registry (git tag ou LangSmith Hub). Rollback é trocar a versão fixada.</p>',
      tip: 'Estruture em fases (shadow → canary → rollout). O rollback automático por threshold mostra que você pensa em operação real, não só em deploy.',
    },
    {
      level: 'senior',
      q: 'Como gerencia custo em LLMOps de produção?',
      a: '<p>Camadas de otimização:</p><ul><li><strong>Tag:</strong> cada chamada por feature/user/tenant → custo granular por dimensão.</li><li><strong>Alertas:</strong> budget alerts em Datadog/CloudWatch por API key, por tenant, por dia.</li><li><strong>Semantic cache:</strong> Redis + embeddings. Perguntas similares retornam cached. 30-50% de redução.</li><li><strong>Model routing:</strong> perguntas simples no Haiku/4o-mini (10x mais barato), complexas no Sonnet/4o.</li><li><strong>Compactação de contexto:</strong> trim conversation history, summarize histórico antigo, compressão de system prompt.</li><li><strong>Batch API:</strong> workloads async (eval, embedding, report generation) usam Batch API — 50% desconto OpenAI/Anthropic.</li></ul>',
      tip: 'Fale em custo por feature/tenant antes de custo total — demonstra que você pensa em accountability e pode identificar qual feature está custando mais.',
    },
    {
      level: 'senior',
      q: 'Como implementa fallback entre providers de LLM?',
      a: '<p>Camada de abstração (LiteLLM ou custom) com retry policy:</p><ol><li>Tenta Anthropic Claude Sonnet.</li><li>Falhou (timeout, rate limit, 5xx)? Tenta OpenAI GPT-4o equivalente.</li><li>Falhou? Tenta Bedrock Claude como último recurso.</li></ol><p>Detalhes críticos:</p><ul><li>Prompts precisam ser portáveis: tool calling schema difere entre providers — padronize via LiteLLM.</li><li>Respostas precisam ser normalizadas: mesmo formato de resposta independente do provider.</li><li>Circuit breaker por provider: se Anthropic falhou 5x nos últimos 60s, pule direto para OpenAI.</li><li>Log qual provider respondeu: para debugging e comparação de qualidade.</li></ul>',
      tip: 'Mencione o circuit breaker por provider — vai além do retry ingênuo e mostra que você pensa em resiliência real.',
    },
    {
      level: 'senior',
      q: 'Como detecta e mitiga hallucination em produção?',
      a: '<p>Detecção em camadas:</p><ul><li><strong>Faithfulness check (RAGAS):</strong> LLM-judge compara resposta com contexto recuperado. Roda em sample de 1-5% das requests.</li><li><strong>Citation requirement:</strong> prompt obriga citar fonte com [ref]. Valida que citação existe no contexto.</li><li><strong>Confidence scoring:</strong> log-probabilities baixas no topo são sinal de alucinação. Filtra respostas com média < threshold.</li><li><strong>Sampling humano:</strong> 1% das respostas vai para revisão manual. Ground truth para calibrar métricas automáticas.</li></ul><p>Mitigação: aumentar temperatura não ajuda — melhorar o contexto recuperado e adicionar instrução "se não souber, diga que não sabe".</p>',
      tip: 'Diferencie detecção automática (faithfulness check) de mitigação (melhorar contexto, não aumentar temperatura). A maioria dos candidatos só fala de prompting.',
    },
    {
      level: 'pleno',
      q: 'O que é um eval set e como montar um bom?',
      a: '<p>Eval set é coleção de casos de teste com input + expected output (ou critério de qualidade).</p><p>Para montar um bom:</p><ul><li><strong>Golden set:</strong> 50-200 exemplos curados manualmente, cobrindo casos normais, edge cases e casos difíceis.</li><li><strong>Adversarial:</strong> inputs que quebraram em produção (retroalimentar bugs reais).</li><li><strong>Representativo:</strong> distribuição similar ao tráfego de produção.</li><li><strong>Métricas por tipo:</strong> Q&A → RAGAS faithfulness/relevancy. Extração → exact match. Geração → LLM-judge com rubrica.</li></ul><p>Minimum: 50 exemplos com score definido. Sem isso, não há gate de CI.</p>',
      tip: 'Mencione retroalimentar bugs de produção no eval set — é o que torna o eval set vivo e relevante ao longo do tempo.',
    },
    {
      level: 'pleno',
      q: 'O que é prompt versioning e por que é obrigatório?',
      a: '<p>Prompt versioning é tratar prompts como artefatos de software: com versão, histórico, rastreabilidade e capacidade de rollback.</p><p>Por que obrigatório:</p><ul><li>Mudança de prompt pode degradar qualidade sutilmente — sem versão, impossível identificar quando regrediu.</li><li>Reprodutibilidade: para re-executar eval, precisa saber qual prompt usou.</li><li>Auditoria: em sistemas regulados, precisa provar qual instrução estava ativa em qual data.</li><li>A/B testing: precisa de versão A e versão B identificadas.</li></ul><p>Opções: git (simples, prompts como arquivos .txt/.yaml), LangSmith Hub (colaborativo com playground), PromptLayer (com analytics).</p>',
      tip: 'O argumento de auditoria e reprodutibilidade são os mais fortes em contextos enterprise. Mencione-os para demonstrar visão além do técnico.',
    },
    {
      level: 'senior',
      q: 'Como implementa semantic caching em LLMOps?',
      a: '<p>Fluxo:</p><ol><li>Recebe query do usuário.</li><li>Gera embedding da query (mesmo modelo de embedding).</li><li>Busca no cache por similaridade cosine (Redis com vector search ou pgvector).</li><li>Se similaridade > threshold (ex: 0.95), retorna resposta cacheada.</li><li>Se cache miss, chama LLM, armazena resposta com embedding da query.</li></ol><p>Detalhes:</p><ul><li>TTL por tipo de conteúdo: fatos mudam, opiniões são estáveis.</li><li>Invalidação por namespace: ao mudar base de conhecimento, invalida cache do domain.</li><li>Threshold calibrado com A/B test: alto demais → baixo hit rate, baixo demais → respostas erradas.</li></ul>',
      tip: 'Mencione a calibração de threshold via A/B test — mostra que você pensa em validação empírica, não em valores arbitrários.',
    },
    {
      level: 'pleno',
      q: 'O que é LangSmith e para que serve?',
      a: '<p>LangSmith é plataforma de observabilidade e avaliação para aplicações LLM da LangChain.</p><p>Funcionalidades principais:</p><ul><li><strong>Tracing:</strong> captura cada LLM call com prompt, response, latência, tokens, custo. Drill-down em chains complexas.</li><li><strong>Datasets:</strong> gerencia eval sets com versionamento. Roda evaluators automaticamente.</li><li><strong>Playground:</strong> testa prompts com dataset. Compara versões side-by-side.</li><li><strong>Hub:</strong> prompt registry colaborativo com versioning e pull de prompt em runtime.</li><li><strong>Monitoring:</strong> dashboards de qualidade e custo em produção.</li></ul><p>Alternativas: Langfuse (open-source, self-hosted), Phoenix (Arize), Helicone (simples, proxy).</p>',
      tip: 'Posicione LangSmith vs Langfuse: LangSmith é SaaS integrado ao ecossistema LangChain; Langfuse é open-source e provider-agnóstico. Em projetos com restrições de dados, Langfuse self-hosted é preferível.',
    },
    {
      level: 'senior',
      q: 'Como estrutura o pipeline de observabilidade LLM para exportar para Datadog?',
      a: '<p>Stack:</p><ol><li><strong>Instrumentação:</strong> LangSmith ou Langfuse captura traces nativamente. Configura OTLP exporter.</li><li><strong>OTLP → Datadog:</strong> OpenTelemetry Collector recebe traces/metrics do app, forwarda para Datadog via OTLP endpoint.</li><li><strong>Métricas customizadas:</strong> tokens consumidos, custo, latência p99, cache hit rate como métricas numéricas.</li><li><strong>Alertas:</strong> anomaly detection em custo (spike > 3x baseline); SLO alert em latência p99 > 5s.</li><li><strong>Dashboards:</strong> custo por feature/tenant, qualidade por versão de prompt, error rate por provider.</li></ol>',
      tip: 'Mencionar OTLP como protocolo de exportação demonstra que você pensa em interoperabilidade, não em lock-in com uma ferramenta específica.',
    },
    {
      level: 'pleno',
      q: 'Como faz rate limiting de chamadas ao LLM?',
      a: '<p>Duas camadas:</p><ul><li><strong>Upstream (sua app):</strong> token bucket por usuário/tenant. Se usuário excede limite, retorna 429 antes de chamar o LLM — economiza custo e protege sua cota.</li><li><strong>Downstream (provider):</strong> implementar backoff exponencial com jitter em erros 429. Fila com BullMQ/SQS para workloads assíncronos — absorve picos sem perder requests.</li></ul><p>Circuit breaker: se provider retornou 429 mais de X vezes nos últimos Y segundos, entra em modo fallback automaticamente sem tentar mais.</p><p>Importante: implementar rate limiting por modelo e por API key separadamente — diferentes modelos têm cotas diferentes.</p>',
      tip: 'A separação upstream (sua app) vs downstream (provider) é fundamental. Candidatos que só pensam no downstream perdem o aspecto de proteção de custo.',
    },
    {
      level: 'senior',
      q: 'O que é model routing e quando usar?',
      a: '<p>Model routing é redirecionar requests para modelos diferentes baseado em critérios dinâmicos.</p><p>Estratégias:</p><ul><li><strong>Por complexidade:</strong> classificador de intent (modelo pequeno) decide se é pergunta simples (Haiku) ou complexa (Sonnet). 10x diferença de custo.</li><li><strong>Por feature:</strong> chat → Haiku; análise de documento → Sonnet; reasoning → Claude Sonnet 3.7.</li><li><strong>Por tenant tier:</strong> plano gratuito → modelo barato; plano enterprise → modelo premium.</li><li><strong>Por latência SLA:</strong> requests síncronos → modelo rápido; batch assíncrono → modelo mais capaz.</li></ul><p>Implementação: LiteLLM Router, ou camada própria com configuração por regras.</p>',
      tip: 'Citar o classificador de intent como roteador demonstra que você pensa em modelo auxiliar para governar o modelo principal — padrão sofisticado que poucos conhecem.',
    },
    {
      level: 'pleno',
      q: 'Quais ferramentas de guardrails você conhece e para que servem?',
      a: '<p>Camadas de proteção:</p><ul><li><strong>Input guards:</strong> PII detection (presidio), prompt injection detection, topic classifier (rejeita fora do escopo).</li><li><strong>Output guards:</strong> toxicity (Perspective API), hallucination score, schema validation (Pydantic/Zod), sensitive info leak.</li></ul><p>Ferramentas:</p><ul><li><strong>Guardrails AI:</strong> validators com retry automático se output não passa.</li><li><strong>NeMo Guardrails (NVIDIA):</strong> definição de regras em Colang, bom para flows complexos.</li><li><strong>LlamaGuard:</strong> modelo fine-tuned para classificar safety de inputs/outputs.</li><li><strong>AWS Bedrock Guardrails:</strong> managed, bom para workloads AWS.</li></ul>',
      tip: 'Diferencie input guards (protege seu sistema) de output guards (protege o usuário). Ambos são necessários em produção regulada.',
    },
    {
      level: 'senior',
      q: 'Como faz A/B testing de prompts em produção?',
      a: '<p>Pipeline:</p><ol><li><strong>Definição:</strong> prompt A (controle) vs prompt B (variante). Hipótese: "B aumenta faithfulness em 10%".</li><li><strong>Alocação:</strong> user_id hash para sticky assignment — mesmo usuário sempre vê A ou B. Evita experience inconsistente.</li><li><strong>Coleta:</strong> log prompt_version junto com todas as métricas (qualidade, custo, latência, feedback do usuário).</li><li><strong>Análise:</strong> diferença estatisticamente significativa? Mínimo: 500 amostras por variante, p-value < 0.05.</li><li><strong>Decisão:</strong> se B vence → rollout gradual. Se empate → mantém A (menos risco).</li></ol>',
      tip: 'Sticky assignment por user_id é o detalhe que diferencia A/B testing real de random. Usuário que viu A e depois B tem experience incoerente — afeta o feedback.',
    },
    {
      level: 'senior',
      q: 'Como lida com drift em modelos de LLM?',
      a: '<p>Dois tipos de drift:</p><ul><li><strong>Input drift:</strong> distribuição de queries mudou (novos tópicos, idioma, formato). Detectar via embedding drift: compara distribuição de embeddings de inputs hoje vs 30d atrás. Alerta se distância média > threshold.</li><li><strong>Output drift:</strong> qualidade das respostas degradou — provider fez update silencioso do modelo (acontece com GPT-4, Claude). Detectar via eval set semanal automatizado. Alerta se score cai > 5% vs baseline.</li></ul><p>Resposta ao drift: re-avaliar eval set, adicionar novos exemplos, ajustar prompt se necessário.</p>',
      tip: 'Provider updates silenciosos (model refresh sem change de versão) são a causa mais comum de drift em produção. Mencionar isso mostra que você conhece o comportamento real dos providers.',
    },
    {
      level: 'pleno',
      q: 'Como versiona datasets e eval sets em LLMOps?',
      a: '<p>Abordagens:</p><ul><li><strong>Git + DVC:</strong> datasets como arquivos versionados. DVC rastreia arquivos grandes em S3/GCS, git rastreia metadata e ponteiros. Funciona bem para eval sets pequenos-médios.</li><li><strong>LangSmith Datasets:</strong> UI para gerenciar exemplos, versionamento automático, rodar evaluators direto.</li><li><strong>Formato padrão:</strong> JSONL com campos query, expected_output, metadata. Fácil de ler e processar.</li></ul><p>Regra: eval set deve ter versão fixada em cada run de CI. Resultado do eval é comparável apenas se eval set é o mesmo.</p>',
      tip: 'A regra de versionamento do eval set é frequentemente esquecida — se o eval set muda entre runs, você não consegue comparar resultados. Mencionar isso demonstra rigor metodológico.',
    },
    {
      level: 'senior',
      q: 'Como estruturaria LLMOps para um produto com multi-tenant (SaaS)?',
      a: '<p>Desafios específicos de multi-tenant:</p><ul><li><strong>Isolamento de custo:</strong> cada tenant tem API key própria ou cost allocation tag. Budget cap por tenant.</li><li><strong>Isolamento de dados:</strong> prompts e contextos de tenant A nunca aparecem em logs visíveis ao tenant B. Mascarar tenant_id em traces públicos.</li><li><strong>Rate limiting por tenant:</strong> tenant no plano free tem limite menor. Evita whale customers quebrando SLA de outros.</li><li><strong>Personalização:</strong> system prompt por tenant (instruções, tom, domínio específico). Versionado separadamente.</li><li><strong>Eval por tenant:</strong> qualidade pode variar por domínio — eval set genérico pode não capturar degradação em vertical específica.</li></ul>',
      tip: 'Isolamento de dados em traces é o item mais sensível — LangSmith/Langfuse podem expor dados de outros tenants se não configurado corretamente. Mencionar isso é diferencial sênior.',
    },
    {
      level: 'pleno',
      q: 'Como implementa retry e fallback em chamadas LLM com LiteLLM?',
      a: '<p>LiteLLM fornece interface unificada para múltiplos providers:</p><pre><code>import litellm\nlitellm.completion(\n  model="anthropic/claude-3-5-sonnet-20241022",\n  fallbacks=["openai/gpt-4o", "bedrock/claude-3-5-sonnet"],\n  num_retries=3,\n  timeout=30,\n  messages=[...]\n)</code></pre><p>LiteLLM Router permite configurar pools de modelos com load balancing, health checks e circuit breakers. Padroniza response format (OpenAI-compatible) independente do provider.</p><p>Importante: configurar <code>set_verbose=True</code> em dev para ver qual provider respondeu.</p>',
      tip: 'Mencionar que LiteLLM normaliza o formato de resposta para OpenAI-compatible é a vantagem prática mais importante — seu código não precisa lidar com diferenças de schema entre providers.',
    },
    {
      level: 'senior',
      q: 'Como você organizaria um squad de AI engineering para manter qualidade em produção?',
      a: '<p>Práticas de squad:</p><ul><li><strong>Ownership de eval:</strong> todo prompt novo precisa de exemplos no eval set — é PR requirement.</li><li><strong>On-call com contexto:</strong> alertas ligam para owner da feature, não para SRE genérico — só quem escreveu o prompt sabe o que "faithfulness 0.7" significa para aquela feature.</li><li><strong>Weekly eval review:</strong> 30 min por semana revisando métricas de qualidade. Anomalias são investigadas antes de virar incidente.</li><li><strong>Post-mortem de hallucination:</strong> toda hallucination reportada vira caso no eval set e análise de causa raiz.</li><li><strong>Prompt changelog:</strong> cada mudança de prompt documentada com motivação e resultado de eval.</li></ul>',
      tip: 'A prática de transformar hallucinations reportadas em casos de eval é a que demonstra mais maturidade operacional — fecha o loop entre produção e desenvolvimento.',
    },
    {
      level: 'pleno',
      q: 'O que é Promptfoo e como usar para eval em CI?',
      a: '<p>Promptfoo é framework open-source para testar e avaliar prompts.</p><p>Configuração básica (promptfooconfig.yaml):</p><pre><code>prompts:\n  - "Responda: {{query}}"\nproviders:\n  - anthropic:claude-3-5-sonnet\nasserts:\n  - type: llm-rubric\n    value: "A resposta é factualmente correta?"\n  - type: not-contains\n    value: "Não sei"</code></pre><p>Uso em CI:</p><pre><code>npx promptfoo eval --ci --output results.json\nnpx promptfoo check-results results.json --min-pass-rate 0.9</code></pre><p>Gera relatório HTML com resultados por caso. Gate: se pass rate cai abaixo de 90%, PR não mergea.</p>',
      tip: 'O parâmetro --ci com threshold é o que torna o eval um gate real de qualidade. Mencionar o relatório HTML mostra que você pensa na experiência do desenvolvedor que vai investigar falhas.',
    },
    {
      level: 'senior',
      q: 'Como lida com PII e dados sensíveis em pipelines LLM?',
      a: '<p>Camadas de proteção:</p><ul><li><strong>Input scrubbing:</strong> Microsoft Presidio detecta e mascara PII (email, CPF, cartão, telefone) antes de enviar ao LLM. Substitui por placeholder: "[EMAIL]", "[CPF]".</li><li><strong>Log sanitization:</strong> remover ou mascarar PII em logs antes de enviar para LangSmith/Langfuse. Config de PII filtering nas ferramentas.</li><li><strong>Prompt injection:</strong> detectar tentativas de injeção (instrução dentro do input do usuário que tenta sobrescrever system prompt). NeMo Guardrails ou classifier próprio.</li><li><strong>Retenção:</strong> definir TTL de logs de LLM — dados pessoais não devem ficar indefinidamente em traces.</li><li><strong>Contrato com provider:</strong> verificar data processing agreement (DPA) — providers como OpenAI não usam dados de API para treinar (por padrão), mas precisa de DPA assinado.</li></ul>',
      tip: 'O contrato com o provider (DPA) é frequentemente esquecido por devs mas é crítico para compliance LGPD/GDPR. Mencionar isso demonstra visão de produto, não só técnica.',
    },
    {
      level: 'senior',
      q: 'Como você mensura o ROI de LLMOps bem implementado?',
      a: '<p>Métricas de valor:</p><ul><li><strong>Custo:</strong> % de redução de custo por request após semantic cache e model routing. Benchmark: 30-60% em 3 meses.</li><li><strong>Qualidade:</strong> % de hallucinations reportadas por usuário. Benchmark: redução de 40-70% com guardrails + eval em CI.</li><li><strong>Velocity:</strong> tempo de deploy de novo prompt (com pipeline) vs sem (manual). Benchmark: horas → minutos.</li><li><strong>Confiabilidade:</strong> uptime de funcionalidade LLM com fallback vs sem. Benchmark: 99.9% vs 99.0% (quando provider tem incidente).</li><li><strong>Incidentes:</strong> número de bugs de qualidade chegando em produção. Benchmark: redução de 80% com eval gate em CI.</li></ul>',
      tip: 'Quantificar ROI com benchmarks (mesmo estimados) demonstra que você pensa em justificar investimento para stakeholders. Isso é habilidade sênior de comunicação técnica.',
    },
  ],
  diagrams: [
    {
      title: 'LLMOps — Pipeline Completo de Deploy de Prompt',
      html: `<style>
.llmops-pipe { font-family: "Space Grotesk", sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.llmops-pipe-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 16px; }
.llmops-pipe-step { background: #1e293b; border: 1.5px solid #334155; border-radius: 8px; padding: 10px 14px; text-align: center; min-width: 100px; }
.llmops-pipe-step-title { font-size: 11px; font-weight: 700; color: #f59e0b; margin-bottom: 3px; }
.llmops-pipe-step-sub { font-size: 10px; color: #94a3b8; font-family: "JetBrains Mono", monospace; }
.llmops-pipe-arrow { color: #475569; font-size: 14px; }
.llmops-pipe-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; justify-content: center; }
.llmops-pipe-tag { background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 4px 10px; font-size: 10px; color: #94a3b8; }
</style>
<div class="llmops-pipe">
  <div class="llmops-pipe-row">
    <div class="llmops-pipe-step"><div class="llmops-pipe-step-title">Prompt Registry</div><div class="llmops-pipe-step-sub">v1.3.2 fixada</div></div>
    <div class="llmops-pipe-arrow">→</div>
    <div class="llmops-pipe-step"><div class="llmops-pipe-step-title">CI Eval</div><div class="llmops-pipe-step-sub">Promptfoo gate</div></div>
    <div class="llmops-pipe-arrow">→</div>
    <div class="llmops-pipe-step"><div class="llmops-pipe-step-title">Shadow Deploy</div><div class="llmops-pipe-step-sub">100% paralelo</div></div>
    <div class="llmops-pipe-arrow">→</div>
    <div class="llmops-pipe-step"><div class="llmops-pipe-step-title">Canary 5%</div><div class="llmops-pipe-step-sub">24h observação</div></div>
    <div class="llmops-pipe-arrow">→</div>
    <div class="llmops-pipe-step"><div class="llmops-pipe-step-title">Rollout 100%</div><div class="llmops-pipe-step-sub">ou rollback auto</div></div>
  </div>
  <div class="llmops-pipe-legend">
    <span class="llmops-pipe-tag">⚡ Gate: score &gt; 0.90</span>
    <span class="llmops-pipe-tag">📊 Monitor: faithfulness, custo, latência</span>
    <span class="llmops-pipe-tag">🔄 Rollback: versão anterior em &lt;2min</span>
  </div>
</div>`,
      caption: 'Pipeline seguro de deploy de prompt: do registry ao rollout gradual com rollback automático.',
    },
    {
      title: 'Camadas de Observabilidade LLM',
      html: `<style>
.llmops-obs { font-family: "Space Grotesk", sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.llmops-obs-layer { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 12px; padding: 12px 14px; border-radius: 8px; border: 1.5px solid #334155; background: #1e293b; }
.llmops-obs-dot { width: 12px; height: 12px; border-radius: 50%; margin-top: 3px; flex-shrink: 0; }
.llmops-obs-title { font-size: 12px; font-weight: 700; margin-bottom: 4px; }
.llmops-obs-items { font-size: 10px; color: #94a3b8; line-height: 1.7; font-family: "JetBrains Mono", monospace; }
</style>
<div class="llmops-obs">
  <div class="llmops-obs-layer"><div class="llmops-obs-dot" style="background:#22c55e"></div><div><div class="llmops-obs-title" style="color:#22c55e">Negócio</div><div class="llmops-obs-items">taxa_aprovacao · satisfacao_usuario · task_completion · churn_llm_feature</div></div></div>
  <div class="llmops-obs-layer"><div class="llmops-obs-dot" style="background:#f59e0b"></div><div><div class="llmops-obs-title" style="color:#f59e0b">Qualidade</div><div class="llmops-obs-items">faithfulness@RAGAS · relevancy · hallucination_rate · citation_accuracy</div></div></div>
  <div class="llmops-obs-layer"><div class="llmops-obs-dot" style="background:#38bdf8"></div><div><div class="llmops-obs-title" style="color:#38bdf8">Sistema</div><div class="llmops-obs-items">latencia_p50/p95/p99 · tokens_in/out · custo_por_request · cache_hit_rate</div></div></div>
  <div class="llmops-obs-layer"><div class="llmops-obs-dot" style="background:#ef4444"></div><div><div class="llmops-obs-title" style="color:#ef4444">Falhas</div><div class="llmops-obs-items">rate_limit_errors · timeouts · schema_invalid · refusals · provider_5xx</div></div></div>
  <div class="llmops-obs-layer"><div class="llmops-obs-dot" style="background:#a855f7"></div><div><div class="llmops-obs-title" style="color:#a855f7">Drift</div><div class="llmops-obs-items">embedding_drift · eval_score_weekly · input_distribution_shift</div></div></div>
</div>`,
      caption: 'As cinco dimensões de observabilidade de um sistema LLM em produção.',
    },
    {
      title: 'Estratégias de Redução de Custo LLM',
      html: `<style>
.llmops-cost { font-family: "Space Grotesk", sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.llmops-cost-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.llmops-cost-card { background: #1e293b; border: 1.5px solid #334155; border-radius: 8px; padding: 12px; text-align: center; }
.llmops-cost-pct { font-size: 22px; font-weight: 800; color: #f59e0b; margin-bottom: 4px; }
.llmops-cost-label { font-size: 11px; font-weight: 700; color: #e2e8f0; margin-bottom: 3px; }
.llmops-cost-desc { font-size: 10px; color: #94a3b8; line-height: 1.4; }
</style>
<div class="llmops-cost">
  <div class="llmops-cost-grid">
    <div class="llmops-cost-card"><div class="llmops-cost-pct">30-50%</div><div class="llmops-cost-label">Semantic Cache</div><div class="llmops-cost-desc">Redis + embeddings. Queries similares retornam resposta cacheada.</div></div>
    <div class="llmops-cost-card"><div class="llmops-cost-pct">~10x</div><div class="llmops-cost-label">Model Routing</div><div class="llmops-cost-desc">Haiku vs Sonnet. Classificar complexidade antes de rotear.</div></div>
    <div class="llmops-cost-card"><div class="llmops-cost-pct">50%</div><div class="llmops-cost-label">Batch API</div><div class="llmops-cost-desc">Workloads async (eval, embed). OpenAI/Anthropic Batch API.</div></div>
    <div class="llmops-cost-card"><div class="llmops-cost-pct">20-40%</div><div class="llmops-cost-label">Context Compression</div><div class="llmops-cost-desc">Resumir histórico, trim sistema prompt, remover redundância.</div></div>
    <div class="llmops-cost-card"><div class="llmops-cost-pct">rastreável</div><div class="llmops-cost-label">Cost Tagging</div><div class="llmops-cost-desc">Tag por feature/tenant. Identifica qual feature custa mais.</div></div>
    <div class="llmops-cost-card"><div class="llmops-cost-pct">proativo</div><div class="llmops-cost-label">Budget Alerts</div><div class="llmops-cost-desc">Alerta antes de estourar. Circuit breaker de emergência.</div></div>
  </div>
</div>`,
      caption: 'Seis estratégias de redução de custo em LLMOps — ordenadas por impacto.',
    },
    {
      title: 'Arquitetura de Fallback entre Providers LLM',
      html: `<style>
.llmops-fb { font-family: "Space Grotesk", sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.llmops-fb-flow { display: flex; flex-direction: column; gap: 8px; }
.llmops-fb-row { display: flex; align-items: center; gap: 10px; }
.llmops-fb-box { padding: 10px 16px; border-radius: 8px; font-size: 11px; font-weight: 700; flex: 1; text-align: center; }
.llmops-fb-reason { font-size: 10px; color: #94a3b8; font-family: "JetBrains Mono", monospace; min-width: 140px; }
</style>
<div class="llmops-fb">
  <div class="llmops-fb-flow">
    <div class="llmops-fb-row"><div class="llmops-fb-box" style="background:#f59e0b20;border:1.5px solid #f59e0b;color:#f59e0b">1. Anthropic Claude</div><div class="llmops-fb-reason">primário — melhor qualidade</div></div>
    <div style="padding-left:20px;color:#475569;font-size:11px">↓ timeout / rate limit / 5xx</div>
    <div class="llmops-fb-row"><div class="llmops-fb-box" style="background:#22c55e20;border:1.5px solid #22c55e;color:#22c55e">2. OpenAI GPT-4o</div><div class="llmops-fb-reason">fallback — equivalente em capacidade</div></div>
    <div style="padding-left:20px;color:#475569;font-size:11px">↓ timeout / rate limit / 5xx</div>
    <div class="llmops-fb-row"><div class="llmops-fb-box" style="background:#38bdf820;border:1.5px solid #38bdf8;color:#38bdf8">3. Bedrock Claude</div><div class="llmops-fb-reason">último recurso — AWS-native</div></div>
  </div>
  <div style="margin-top:12px;padding:10px;background:#1e293b;border-radius:8px;font-size:10px;color:#94a3b8">
    Circuit breaker: &gt;5 falhas/60s → pula direto para próximo. LiteLLM gerencia automaticamente.
  </div>
</div>`,
      caption: 'Cadeia de fallback entre providers com circuit breaker por provider.',
    },
  ],
  cheatsheet: {
    title: 'LLMOps Cheatsheet',
    html: `<style>
.llmops-cs { font-family: "Space Grotesk", sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.llmops-cs-section { }
.llmops-cs-title { font-size: 11px; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 4px; }
.llmops-cs-row { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 5px; font-size: 10px; }
.llmops-cs-key { color: #38bdf8; font-family: "JetBrains Mono", monospace; min-width: 110px; flex-shrink: 0; }
.llmops-cs-val { color: #94a3b8; line-height: 1.4; }
</style>
<div class="llmops-cs">
  <div class="llmops-cs-section">
    <div class="llmops-cs-title">Observabilidade</div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">LangSmith</span><span class="llmops-cs-val">SaaS, integrado LangChain, prompt hub</span></div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">Langfuse</span><span class="llmops-cs-val">Open-source, self-hosted, OTLP export</span></div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">Helicone</span><span class="llmops-cs-val">Proxy simples, drop-in, custo mínimo</span></div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">Phoenix (Arize)</span><span class="llmops-cs-val">ML-native, embedding drift, traces</span></div>
  </div>
  <div class="llmops-cs-section">
    <div class="llmops-cs-title">Eval / CI</div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">Promptfoo</span><span class="llmops-cs-val">YAML config, CI gate, HTML report</span></div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">RAGAS</span><span class="llmops-cs-val">faithfulness, relevancy, context recall</span></div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">OpenAI Evals</span><span class="llmops-cs-val">Framework aberto, custom evaluators</span></div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">LLM-as-judge</span><span class="llmops-cs-val">Prompt GPT-4/Claude para avaliar output</span></div>
  </div>
  <div class="llmops-cs-section">
    <div class="llmops-cs-title">Guardrails / Segurança</div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">Presidio</span><span class="llmops-cs-val">PII detection + masking (Microsoft)</span></div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">Guardrails AI</span><span class="llmops-cs-val">Validators com retry automático</span></div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">NeMo Guardrails</span><span class="llmops-cs-val">Colang rules, flows complexos</span></div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">LlamaGuard</span><span class="llmops-cs-val">Modelo fine-tuned para safety</span></div>
  </div>
  <div class="llmops-cs-section">
    <div class="llmops-cs-title">Infra / Roteamento</div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">LiteLLM</span><span class="llmops-cs-val">100+ providers, fallback, router</span></div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">Semantic Cache</span><span class="llmops-cs-val">Redis + embeddings, 30-50% cost cut</span></div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">Batch API</span><span class="llmops-cs-val">50% off em workloads assíncronos</span></div>
    <div class="llmops-cs-row"><span class="llmops-cs-key">Model routing</span><span class="llmops-cs-val">Haiku (simples) / Sonnet (complexo)</span></div>
  </div>
</div>`,
  },
  mindmap: {
    title: 'LLMOps — Mapa Mental Completo',
    html: `<style>
.llmops-mm { font-family: "Space Grotesk", sans-serif; background: #0f172a; border-radius: 12px; padding: 24px; color: #e2e8f0; }
.llmops-mm-center { text-align: center; margin-bottom: 20px; }
.llmops-mm-title { font-size: 16px; font-weight: 800; color: #f59e0b; }
.llmops-mm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.llmops-mm-node { background: #1e293b; border: 1.5px solid #334155; border-radius: 8px; padding: 10px; }
.llmops-mm-node-title { font-size: 11px; font-weight: 700; margin-bottom: 6px; }
.llmops-mm-node-items { font-size: 10px; color: #94a3b8; line-height: 1.7; }
</style>
<div class="llmops-mm">
  <div class="llmops-mm-center"><div class="llmops-mm-title">LLMOps</div></div>
  <div class="llmops-mm-grid">
    <div class="llmops-mm-node"><div class="llmops-mm-node-title" style="color:#f59e0b">Prompt Engineering</div><div class="llmops-mm-node-items">• Registry (git/LangSmith Hub)<br>• Versionamento semântico<br>• A/B testing<br>• Rollback automático</div></div>
    <div class="llmops-mm-node"><div class="llmops-mm-node-title" style="color:#22c55e">Eval &amp; CI</div><div class="llmops-mm-node-items">• Eval set (golden + adversarial)<br>• RAGAS, Promptfoo<br>• LLM-as-judge<br>• Gate de qualidade no PR</div></div>
    <div class="llmops-mm-node"><div class="llmops-mm-node-title" style="color:#38bdf8">Observabilidade</div><div class="llmops-mm-node-items">• Traces por request<br>• Langfuse / LangSmith<br>• OTLP → Datadog<br>• Drift detection semanal</div></div>
    <div class="llmops-mm-node"><div class="llmops-mm-node-title" style="color:#ef4444">Guardrails</div><div class="llmops-mm-node-items">• PII detection (Presidio)<br>• Prompt injection guard<br>• Output toxicity check<br>• Schema validation</div></div>
    <div class="llmops-mm-node"><div class="llmops-mm-node-title" style="color:#a855f7">Custo</div><div class="llmops-mm-node-items">• Semantic cache Redis<br>• Model routing<br>• Batch API (50% off)<br>• Budget alerts por tenant</div></div>
    <div class="llmops-mm-node"><div class="llmops-mm-node-title" style="color:#fb923c">Resiliência</div><div class="llmops-mm-node-items">• Fallback multi-provider<br>• Circuit breaker<br>• Rate limiting upstream<br>• Backoff exponencial</div></div>
  </div>
</div>`,
  },
  mnemonics: [
    {
      label: 'EPIC — Os 4 pilares do LLMOps',
      trick: 'EPIC: Eval, Prompt registry, Infra (cache/fallback), Cost monitoring',
      explanation: 'E = Eval em CI (gate de qualidade); P = Prompt registry com versão; I = Infra de resiliência (cache, fallback, guardrails); C = Cost monitoring por feature/tenant. Se tiver EPIC, tem LLMOps real.',
    },
    {
      label: 'SCAB — Estratégias de redução de custo',
      trick: 'SCAB: Semantic cache, Cost routing, Async batch, Budget alerts',
      explanation: 'S = Semantic cache (30-50% off); C = Cost routing (Haiku para simples, 10x barato); A = Async batch API (50% desconto); B = Budget alerts antes de estourar. Qualquer uma implementada já economiza.',
    },
    {
      label: 'FCS — Pipeline de deploy seguro',
      trick: 'FCS: Full eval → Canary → Shadow',
      explanation: 'Na verdade a ordem é Shadow → Canary → Full: S = Shadow (100% paralelo, sem risco); C = Canary (5% real, 24h); F = Full rollout (após métricas ok). FCS lembra que começa sem risco e vai para full.',
    },
    {
      label: 'DOPE — O que toda trace LLM precisa ter',
      trick: 'DOPE: Duration (latência), Output (resposta), Prompt (texto), Expense (custo/tokens)',
      explanation: 'D = Duration (latência p50/p99); O = Output (resposta completa); P = Prompt (texto exato usado, mascarado de PII); E = Expense (tokens in/out e custo em USD). Sem DOPE em cada trace, debugging em produção é impossível.',
    },
  ],
  exercises: [
    {
      level: 'iniciante',
      title: 'Montar eval set básico com Promptfoo',
      description: 'Crie um arquivo promptfooconfig.yaml com 5 casos de teste para um prompt de Q&A. Configure threshold mínimo de 80% de aprovação. Execute via CLI e analise o relatório HTML gerado.',
      concepts: ['eval-set', 'promptfoo', 'ci-gate', 'quality-threshold'],
    },
    {
      level: 'intermediario',
      title: 'Implementar semantic caching com Redis e embeddings',
      description: 'Construa middleware de semantic cache: recebe query → gera embedding via OpenAI → busca no Redis com similaridade cosine (threshold 0.92) → se hit, retorna cached; se miss, chama LLM, armazena com TTL de 1h. Medir hit rate após 100 queries.',
      concepts: ['semantic-cache', 'embeddings', 'redis', 'cosine-similarity', 'cost-reduction'],
    },
    {
      level: 'senior',
      title: 'Pipeline completo de LLMOps com fallback e observabilidade',
      description: 'Construa um endpoint de chat com: (1) LiteLLM com fallback Anthropic → OpenAI → Bedrock, (2) Langfuse para traces, (3) semantic cache Redis, (4) rate limiting por usuário (token bucket), (5) guardrail de PII com Presidio no input. Demonstre o fallback funcionando ao desligar o provider primário e mostrar o trace completo no Langfuse.',
      concepts: ['litellm', 'fallback', 'langfuse', 'observabilidade', 'rate-limiting', 'guardrails', 'pii-detection'],
    },
    {
      level: 'senior',
      title: 'Dashboard de custo por feature e tenant',
      description: 'Instrumentar uma aplicação multi-tenant para: (1) taggear cada LLM call com feature_name e tenant_id, (2) exportar métricas via OTLP para Datadog/Grafana, (3) criar dashboard com custo_por_tenant e custo_por_feature, (4) configurar alerta quando custo diário de um tenant excede threshold. Implementar budget cap que retorna 402 ao tenant que excedeu.',
      concepts: ['cost-tagging', 'multi-tenant', 'otlp', 'budget-alerts', 'observabilidade'],
    },
  ],
  codeExamples: [
    {
      title: 'LiteLLM com fallback automático entre providers',
      language: 'python',
      code: `import litellm
from litellm import completion

# Configura fallback: Anthropic → OpenAI → Bedrock
response = completion(
    model="anthropic/claude-3-5-sonnet-20241022",
    messages=[{"role": "user", "content": "Explique HNSW em 2 linhas"}],
    fallbacks=[
        "openai/gpt-4o",
        "bedrock/anthropic.claude-3-5-sonnet-20241022-v2:0"
    ],
    num_retries=2,
    timeout=30,
    metadata={
        "feature": "chat",
        "tenant_id": "acme-corp",
        "user_id": "user-123"
    }
)

print(response.choices[0].message.content)
provider = response._hidden_params['custom_llm_provider']
cost = response._hidden_params['response_cost']
print("Provider usado:", provider)
print("Custo estimado: USD", round(cost, 6))`,
    },
    {
      title: 'Semantic cache com Redis e embeddings',
      language: 'python',
      code: `import redis
import numpy as np
import json
from openai import OpenAI

client = OpenAI()
cache = redis.Redis(host='localhost', port=6379, decode_responses=True)

SIMILARITY_THRESHOLD = 0.92
CACHE_TTL = 3600  # 1 hora

def get_embedding(text: str) -> list[float]:
    resp = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return resp.data[0].embedding

def cosine_similarity(a: list[float], b: list[float]) -> float:
    a_arr, b_arr = np.array(a), np.array(b)
    return float(np.dot(a_arr, b_arr) / (np.linalg.norm(a_arr) * np.linalg.norm(b_arr)))

def semantic_cache_get(query: str) -> str | None:
    query_emb = get_embedding(query)
    # Busca todas as entradas do cache
    for key in cache.scan_iter("llm_cache:*"):
        entry = json.loads(cache.get(key))
        sim = cosine_similarity(query_emb, entry["embedding"])
        if sim >= SIMILARITY_THRESHOLD:
            print(f"Cache hit! Similaridade: {sim:.3f}")
            return entry["response"]
    return None

def semantic_cache_set(query: str, response: str):
    embedding = get_embedding(query)
    cache_key = f"llm_cache:{hash(query)}"
    cache.set(cache_key, json.dumps({
        "query": query,
        "embedding": embedding,
        "response": response
    }), ex=CACHE_TTL)

def chat(query: str) -> str:
    # Tenta cache primeiro
    cached = semantic_cache_get(query)
    if cached:
        return cached

    # Cache miss — chama LLM
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": query}]
    )
    answer = resp.choices[0].message.content

    # Armazena no cache
    semantic_cache_set(query, answer)
    return answer`,
    },
    {
      title: 'Eval em CI com Promptfoo (config YAML)',
      language: 'yaml',
      code: `# promptfooconfig.yaml
description: "Eval set para Q&A de suporte"

prompts:
  - "system: Você é um assistente de suporte técnico. Responda APENAS com base no contexto.\\nuser: {{query}}"

providers:
  - id: anthropic:claude-3-haiku-20240307
    config:
      temperature: 0
  - id: openai:gpt-4o-mini
    config:
      temperature: 0

tests:
  - vars:
      query: "Como resetar minha senha?"
    assert:
      - type: contains
        value: "senha"
      - type: llm-rubric
        value: "A resposta explica o processo de reset de senha de forma clara?"
      - type: not-contains
        value: "Não sei"

  - vars:
      query: "Qual o prazo de entrega?"
    assert:
      - type: llm-rubric
        value: "A resposta menciona prazo ou redireciona corretamente?"
      - type: javascript
        value: "output.length > 20"  # resposta não pode ser muito curta

# Executar no CI:
# npx promptfoo eval --ci
# npx promptfoo check-results --min-pass-rate 0.85`,
    },
    {
      title: 'Instrumentação com Langfuse (Python)',
      language: 'python',
      code: `from langfuse import Langfuse
from langfuse.decorators import observe, langfuse_context
from openai import OpenAI

langfuse = Langfuse(
    public_key="pk-...",
    secret_key="sk-...",
    host="https://cloud.langfuse.com"
)

client = OpenAI()

@observe()  # decorator automático de tracing
def chat_with_user(query: str, user_id: str, feature: str) -> str:
    # Adiciona metadata ao trace atual
    langfuse_context.update_current_trace(
        user_id=user_id,
        metadata={
            "feature": feature,
            "prompt_version": "v2.1.0",
        }
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": query}],
        temperature=0.7,
    )

    answer = response.choices[0].message.content

    # Score manual de qualidade (pode ser de feedback do usuário)
    langfuse_context.score_current_observation(
        name="relevancy",
        value=0.9,
        comment="Resposta relevante ao contexto"
    )

    return answer

# Uso
result = chat_with_user(
    query="Como funciona semantic cache?",
    user_id="user-456",
    feature="support-chat"
)
print(result)

# Flush para garantir que todos os traces foram enviados
langfuse.flush()`,
    },
  ],
  videos: [
    { title: 'LLMOps: From Zero to Hero', channel: 'Underfitted (Santiago)', url: 'https://www.youtube.com/watch?v=LmVJE5N30oc' },
    { title: 'Evaluating LLMs in Production', channel: 'Hamel Husain', url: 'https://www.youtube.com/watch?v=VPg5j6tGxKE' },
    { title: 'Building LLM Observability with Langfuse', channel: 'Langfuse', url: 'https://www.youtube.com/watch?v=4moMdQMNv_o' },
    { title: 'LiteLLM — 100+ LLMs with One API', channel: 'BerriAI', url: 'https://www.youtube.com/watch?v=7cQ4bHBm6B0' },
    { title: 'Prompt Engineering in Production', channel: 'DeepLearning.AI', url: 'https://www.youtube.com/watch?v=ahnGLM-RC1Y' },
    { title: 'RAG Evaluation with RAGAS', channel: 'Sam Witteveen', url: 'https://www.youtube.com/watch?v=5QDa-bGFTm8' },
  ],
  resources: [
    { title: 'Hamel Husain — Your AI Product Needs Evals', url: 'https://hamel.dev/blog/posts/evals/', kind: 'artigo' },
    { title: 'Eugene Yan — LLM Patterns in Production', url: 'https://eugeneyan.com/writing/llm-patterns/', kind: 'artigo' },
    { title: 'LangSmith Documentation', url: 'https://docs.smith.langchain.com/', kind: 'docs' },
    { title: 'Langfuse Documentation', url: 'https://langfuse.com/docs', kind: 'docs' },
    { title: 'Promptfoo — LLM Testing Framework', url: 'https://www.promptfoo.dev/docs/', kind: 'docs' },
    { title: 'LiteLLM — Multi-provider LLM', url: 'https://docs.litellm.ai/', kind: 'docs' },
    { title: 'RAGAS — RAG Evaluation Framework', url: 'https://docs.ragas.io/', kind: 'docs' },
    { title: 'Chip Huyen — AI Engineering (book)', url: 'https://huyenchip.com/2023/04/11/llm-engineering.html', kind: 'artigo' },
    { title: 'Microsoft Presidio — PII Detection', url: 'https://microsoft.github.io/presidio/', kind: 'docs' },
    { title: 'OpenAI Evals (GitHub)', url: 'https://github.com/openai/evals', kind: 'docs' },
  ],
}

export default llmops
