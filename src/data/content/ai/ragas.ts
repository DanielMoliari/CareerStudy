import type { SkillContent } from '@/types'

const ragas: SkillContent = {
    tagline: 'Framework de eval pra RAG: faithfulness, relevancy, precision, recall — automático.',
    why: 'Sem eval objetivo, RAG é fe. RAGAS é o padrão de fato pra medir qualidade. Saber as 4 metricas core e como integrar em CI é expected em entrevista de AI senior.',
    summary: 'RAGAS (Retrieval Augmented Generation Assessment) usa LLM-as-judge pra medir qualidade de pipeline RAG sem precisar de ground truth pra metricas referenceless. Roda em batch, gera scores 0-1 por exemplo, agrega em dashboard. Integra com LangSmith, LangChain, LlamaIndex.',
    keypoints: [
      { title: 'Faithfulness', body: 'Resposta esta apoiada no contexto? LLM-judge quebra resposta em claims, verifica cada uma contra os docs. Score baixo = alucinacao.' },
      { title: 'Answer relevancy', body: 'Resposta é sobre a pergunta? Gera N perguntas reversas a partir da resposta, mede similaridade com original.' },
      { title: 'Context precision', body: 'Docs relevantes vieram no topo? Penaliza ruido nas primeiras posições do retrieval.' },
      { title: 'Context recall', body: 'Pegou todos os docs necessários pra responder? Compara contexto com ground truth (precisa de anotação).' },
      { title: 'Eval set', body: 'Comeca com 50-200 perguntas representativas. Inclui edge cases (perguntas sem resposta, ambiguas, multi-doc).' },
      { title: 'Synthetic data', body: 'RAGAS gera test set automático a partir do seu corpus. Útil pra comecar quando não tem anotação.' },
      { title: 'Integração em CI', body: 'Roda em PR/main, gate em score mínimo. Alerta se metrica cai.' },
      { title: 'Custos', body: 'Cada exemplo precisa de 5-15 calls LLM (judge). Use modelo barato (Haiku, 4o-mini) pra judge se viavel.' },
    ],
    gotchas: [
      'Usar mesmo modelo pra gerar e julgar — vies de auto-favorecimento.',
      'Eval set pequeno demais (10 perguntas) — ruido domina o score.',
      'Esquecer edge cases (pergunta fora do domínio, ambigua) — RAG quebra justo nelas.',
      'Comparar scores absolutos entre modelos diferentes de judge — são calibracoes diferentes. Compare deltas.',
      'Faithfulness alto + relevancy baixo significa resposta correta mas off-topic — bug do prompt.',
      'Rodar RAGAS uma vez e nunca mais — qualidade degrada com tempo (drift).',
    ],
    interview: [
      { q: 'Quais as 4 metricas core do RAGAS?', a: '<ul><li><strong>Faithfulness</strong>: claims da resposta estao no contexto?</li><li><strong>Answer relevancy</strong>: resposta é sobre a pergunta?</li><li><strong>Context precision</strong>: top docs são realmente relevantes?</li><li><strong>Context recall</strong>: pegou tudo que precisava?</li></ul><p>Faithfulness e relevancy não precisam ground truth; recall sim.</p>' },
      { q: 'Como integraria RAGAS em CI?', a: '<p>Pipeline:</p><ul><li>Eval set versionado (Git LFS ou bucket).</li><li>Job em CI roda RAGAS em sample (ex: 100 ex).</li><li>Compara com baseline (main branch).</li><li>Gate: faithfulness > 0.8 && relevancy > 0.85.</li><li>Falhou? PR bloqueado, devolve scores como comentario.</li></ul>' },
      { q: 'Como interpretaria faithfulness=0.6?', a: '<p>40%% das claims da resposta não estão apoiadas no contexto — sinal forte de hallucination ou contexto insuficiente.</p><p>Investigaria: contexto recuperado é relevante (ver context_precision)? Prompt instrui a usar só contexto? Modelo é forte o suficiente? Talvez chunk size está cortando info chave.</p>' },
      { q: 'Como gera test set sintetico?', a: '<p>RAGAS Testset Generator usa o corpus pra gerar perguntas de varios tipos (simple, reasoning, multi-context, conditional). Você passa documentos, ele cria perguntas + respostas + contexto esperado.</p><p>Use como bootstrap. Sempre revise manualmente uma amostra antes de confiar.</p>' },
      { q: 'Quais limitações do RAGAS?', a: '<ul><li>LLM-judge tem vies (modelo grande favorece estilo similar).</li><li>Custa caro em volume (5-15 LLM calls por exemplo).</li><li>Não mede latência, custo, UX.</li><li>Faithfulness pode falhar em raciocinio multi-step.</li></ul><p>Combine com human eval em sample pequena pra calibrar.</p>' },
    ],
    resources: [
      { title: 'RAGAS docs', url: 'https://docs.ragas.io/', kind: 'docs' },
      { title: 'RAGAS paper (2023)', url: 'https://arxiv.org/abs/2309.15217', kind: 'artigo' },
      { title: 'explodinggradients/ragas (GitHub)', url: 'https://github.com/explodinggradients/ragas', kind: 'docs' },
      { title: 'Hamel Husain — Your AI Product Needs Evals', url: 'https://hamel.dev/blog/posts/evals/', kind: 'artigo' },
      { title: 'OpenAI Evals (GitHub)', url: 'https://github.com/openai/evals', kind: 'docs' },
    ],
  }

export default ragas
