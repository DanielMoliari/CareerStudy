import type { SkillContent } from '@/types'

const llmops: SkillContent = {
    tagline: 'MLOps adaptado pra LLMs: deploy, eval, versionamento, custo, drift.',
    why: 'Em entrevista senior, mostrar que você pensa em ciclo de vida (não só escrever prompt) é o que diferencia AI engineer de quem só brincou com ChatGPT.',
    summary: 'LLMOps cobre tudo que envolve operar LLM em produção: dataset versioning, prompt registry, eval em CI, A/B testing, monitoring de custo e drift, fallback entre modelos, cache, rate limiting. Diferente de MLOps, modelo é quase sempre 3rd party — você versiona prompts, eval sets e infra ao redor.',
    keypoints: [
      { title: 'Prompt registry', body: 'Prompts versionados como código (git) ou via plataforma (LangSmith Hub, PromptLayer). Cada deploy fixa versão específica.' },
      { title: 'Eval em CI', body: 'Eval set com exemplos -> roda em cada PR -> gate no merge. RAGAS, OpenAI Evals, Promptfoo. Sem isso você regrede sem perceber.' },
      { title: 'Observability', body: 'Trace por requisição: prompt, response, latência, tokens, custo, user_id. LangSmith, Langfuse, Phoenix, Helicone. Exporta pra Datadog/Grafana.' },
      { title: 'Cost monitoring', body: 'Tag por feature/user/tenant. Alerta em spike. Budget caps. Modelos diferentes por tier de plano.' },
      { title: 'Caching', body: 'Cache de respostas por hash(prompt). Semantic cache (similaridade) pra perguntas parecidas. Reduz 30-50% de custo.' },
      { title: 'Fallback', body: 'Modelo primario falha (rate limit, timeout)? Fallback pra secundario (Anthropic -> OpenAI -> Bedrock). LiteLLM ou camada própria.' },
      { title: 'Guardrails', body: 'Input: PII detection, prompt injection check. Output: toxicity, hallucination, schema validation. NeMo Guardrails, Guardrails AI.' },
      { title: 'Drift detection', body: 'Distribuição de input mudou? Resposta degradou? Run eval set semanal e compara com baseline.' },
    ],
    gotchas: [
      'Prompts hardcoded no código sem versão — impossivel rollback.',
      'Sem eval set: cada mudança de prompt é fe.',
      'Logar prompt completo sem mascarar PII — vaza dados sensíveis em LangSmith/Datadog.',
      'Não ter budget alert: alguem deixa loop bug e gasta 10k em uma noite.',
      'Cache ingenuo (string match exato) tem hit rate baixo. Use semantic cache pra ganhar.',
      'Esquecer rate limiting downstream: API do OpenAI cai, sua app inteira para. Sempre tenha fallback.',
      'Não versionar modelo — provider deprecated v1, sua eval set quebra.',
    ],
    interview: [
      { q: 'O que você monitora em LLM em produção?', a: '<ul><li><strong>Negocio</strong>: taxa de aprovação, satisfacao do usuário.</li><li><strong>Qualidade</strong>: faithfulness, relevancy via RAGAS amostral.</li><li><strong>Sistema</strong>: latência p50/p99, tokens in/out, custo por requisição.</li><li><strong>Falhas</strong>: rate limit, timeout, schema inválido, refusals.</li><li><strong>Drift</strong>: distribuição de inputs, eval set semanal.</li></ul>' },
      { q: 'Como faria deploy seguro de novo prompt?', a: '<p>Pipeline:</p><ul><li>Roda eval set em CI; gate de qualidade minima.</li><li>Shadow deploy: novo prompt roda em paralelo do antigo, compara outputs.</li><li>Canary: 5%% do trafego no novo, observa metricas 24h.</li><li>Rollout gradual até 100%%.</li><li>Rollback automático se metricas caem.</li></ul>' },
      { q: 'Como gerencia custo?', a: '<p>Camadas:</p><ul><li><strong>Tag</strong> cada chamada por feature/user/tenant.</li><li><strong>Budget alerts</strong> em Datadog/CloudWatch.</li><li><strong>Cache</strong> semantico reduz 30-50%%.</li><li><strong>Routing</strong>: pergunta simples no Haiku/4o-mini, complexa no Sonnet/4o.</li><li><strong>Compactacao</strong>: trim conversation, sumarize histórico.</li><li><strong>Batch API</strong> pra workload async (50%% off).</li></ul>' },
      { q: 'Como faria fallback entre providers?', a: '<p>Camada de abstracao (LiteLLM, ou própria) com retry policy:</p><p>Tenta Anthropic Claude. Falhou (timeout, rate limit, 5xx)? Tenta OpenAI GPT-4o equivalente. Falhou? Tenta Bedrock Claude.</p><p>Importante: prompts precisam ser portaveis. Schemas de tool calling diferem; padronize via biblioteca.</p>' },
      { q: 'Como detecta hallucination em produção?', a: '<p>Metodos:</p><ul><li><strong>Faithfulness check</strong> (RAGAS): roda LLM-judge comparando resposta com contexto recuperado.</li><li><strong>Sampling humano</strong>: 1-5%% das respostas vai pra revisao.</li><li><strong>Citation requirement</strong>: prompt obriga citar fonte; válida que fonte existe.</li><li><strong>Confidence scoring</strong>: log probabilidades baixas no topo = sinal de alucinacao.</li></ul>' },
    ],
    resources: [
      { title: 'Chip Huyen — Designing Machine Learning Systems', url: 'https://huyenchip.com/ml-interviews-book/', kind: 'livro' },
      { title: 'LangSmith docs', url: 'https://docs.smith.langchain.com/', kind: 'docs' },
      { title: 'Langfuse docs', url: 'https://langfuse.com/docs', kind: 'docs' },
      { title: 'OpenAI Evals (GitHub)', url: 'https://github.com/openai/evals', kind: 'docs' },
      { title: 'Eugene Yan — LLM patterns', url: 'https://eugeneyan.com/writing/llm-patterns/', kind: 'artigo' },
      { title: 'Hamel Husain — Your AI Product Needs Evals', url: 'https://hamel.dev/blog/posts/evals/', kind: 'artigo' },
    ],
  }

export default llmops
