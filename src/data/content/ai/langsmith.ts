import type { SkillContent } from '@/types'

const langsmith: SkillContent = {
    tagline: 'Observability/eval/dataset SaaS pra apps LLM, do time da LangChain.',
    why: 'Padrão em apps LangChain/LangGraph. Saber o que tracear, como construir eval set e gate em CI é expected em entrevista AI senior.',
    summary: 'LangSmith é plataforma SaaS (e self-host enterprise) que cobre observability (traces), eval (datasets + judges), prompt management (Hub), feedback (thumbs/score do usuário) e monitoring (dashboards). Funciona com qualquer LLM SDK via SDK Python/JS, não só LangChain.',
    keypoints: [
      { title: 'Tracing', body: 'Cada chamada LLM/tool/chain vira span hierárquico. Você ve input/output, latência, custo, erros. Auto-instrumenta LangChain/LangGraph.' },
      { title: 'Datasets', body: 'Eval sets versionados. Cria a partir de traces de produção ou import CSV. Anota expected_output.' },
      { title: 'Evaluators', body: 'LLM-as-judge (correctness, relevance), heuristics (regex, exact match), custom (Python). Roda em dataset.' },
      { title: 'Experiments', body: 'Compara modelos/prompts diferentes no mesmo dataset. Tabela com metricas lado-a-lado.' },
      { title: 'Prompt Hub', body: 'Repo de prompts versionados. Pull/push via SDK. Compartilha entre apps.' },
      { title: 'Online evaluators', body: 'Roda eval em sample de produção (ex: 5% das chamadas). Detecta drift de qualidade.' },
      { title: 'Feedback', body: 'API pra coletar feedback (thumbs, score, comment) atado ao trace. Treina eval futuro.' },
      { title: 'Self-host', body: 'Disponivel em plano enterprise. Útil pra dados sensíveis que não podem sair.' },
    ],
    gotchas: [
      'Tracear input completo sem mascarar PII vaza dados em SaaS.',
      'Esquecer de tag traces (user_id, feature, version) — depois fica impossivel filtrar.',
      'Dataset pequeno (< 30 ex) tem ruido alto em LLM-judge.',
      'Comparar experiments com seeds diferentes confunde sinal.',
      'Confiar 100% em LLM-judge sem validação humana — judge tem vies.',
      'Não desabilitar tracing em testes — polui dataset com noise.',
    ],
    interview: [
      { q: 'O que você traceia em produção?', a: '<ul><li>Cada LLM call: prompt, response, model, tokens, latency, cost.</li><li>Tool calls: name, input, output, latency.</li><li>Metadata: user_id, session_id, feature, env, version.</li><li>Custom events: retrieval scores, guardrail hits.</li></ul><p>Tags estruturadas viabilizam filtros e debugging.</p>' },
      { q: 'Como rodaria experiment de prompt novo?', a: '<p>Pipeline:</p><ul><li>Cria/carrega dataset (50-500 ex).</li><li>Define evaluators (LLM-judge correctness, latency).</li><li>Roda experiment_v1 (prompt atual) e experiment_v2 (novo).</li><li>Compara metricas no UI; v2 wins se delta significativo + não regrede em algum corte.</li><li>Promove pra produção com canary.</li></ul>' },
      { q: 'Como detecta drift online?', a: '<p>Online evaluator em sample (5%%). Roda LLM-judge no input/output em background. Dashboards mostram score medio por feature/dia.</p><p>Quando cai abaixo de baseline, alerta. Bons sinais: queda em correctness, aumento em refusals, tempo de resposta.</p>' },
      { q: 'LangSmith vs Langfuse vs Phoenix?', a: '<ul><li><strong>LangSmith</strong>: SaaS, integrado com LangChain/LangGraph, eval forte. Closed source.</li><li><strong>Langfuse</strong>: open source, self-host fácil, similar feature set. Boa opcao pra OSS-friendly.</li><li><strong>Phoenix (Arize)</strong>: open source, foco em traces e drift. Bom em OpenTelemetry.</li></ul>' },
      { q: 'Como protegeria PII?', a: '<ul><li>Mascara no SDK antes de enviar (regex emails, CPF).</li><li>Self-host se dados críticos.</li><li>Retencao curta (30d) pra produção.</li><li>RBAC: time de eng não ve PII se não precisa.</li></ul>' },
    ],
    resources: [
      { title: 'LangSmith docs', url: 'https://docs.smith.langchain.com/', kind: 'docs' },
      { title: 'LangChain Academy — Evaluations', url: 'https://academy.langchain.com/courses/intro-to-langsmith', kind: 'curso' },
      { title: 'Hamel Husain — Your AI Product Needs Evals', url: 'https://hamel.dev/blog/posts/evals/', kind: 'artigo' },
    ],
  }

export default langsmith
