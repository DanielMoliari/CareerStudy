import type { SkillContent } from '@/types'

const ragas: SkillContent = {
  tagline: 'Framework de eval pra RAG: faithfulness, relevancy, precision, recall — automático e integrável em CI.',
  why: 'Sem eval objetivo, RAG é fé. RAGAS é o padrão de fato para medir qualidade de pipeline RAG com LLM-as-judge. Saber as 4 métricas core, interpretar scores baixos e integrar em CI/CD é esperado em entrevista de AI Engineering sênior.',
  summary: 'RAGAS (Retrieval Augmented Generation Assessment) usa LLM-as-judge para medir qualidade de pipeline RAG sem precisar de ground truth para métricas referenceless. Roda em batch, gera scores 0–1 por exemplo, agrega em dashboard. Integra com LangSmith, LangChain, LlamaIndex. As 4 métricas core são Faithfulness, Answer Relevancy, Context Precision e Context Recall — cada uma aponta para um componente diferente do pipeline quando apresenta score baixo. Além de avaliação, RAGAS também gera test sets sintéticos a partir do corpus, útil quando não há anotação manual disponível.',
  keypoints: [
    {
      title: 'Faithfulness',
      body: 'Resposta está apoiada no contexto? LLM-judge quebra resposta em claims atômicas e verifica cada uma contra os docs recuperados. Score baixo = alucinação ou instrução de prompt fraca. Fix: adicione instrução explícita "Responda APENAS com base no contexto abaixo".',
    },
    {
      title: 'Answer Relevancy',
      body: 'Resposta é sobre a pergunta? Gera N perguntas reversas a partir da resposta e mede similaridade semântica com a pergunta original. Score baixo = resposta off-topic. Fix: revise o prompt de instrução ou filtre contexto irrelevante.',
    },
    {
      title: 'Context Precision',
      body: 'Docs relevantes vieram no topo? Penaliza ruído nas primeiras posições do retrieval. Score baixo = retrieval impreciso. Fix: adicione reranking (cross-encoder) ou revise a estratégia de chunking.',
    },
    {
      title: 'Context Recall',
      body: 'Recuperou todos os docs necessários para responder? Compara contexto recuperado com ground truth (precisa de anotação). Score baixo = retrieval perdendo informação. Fix: revise estratégia de chunking ou adicione hybrid search.',
    },
    {
      title: 'LLM-as-judge e custos',
      body: 'Cada exemplo requer 5–15 chamadas LLM (uma por claim, por métrica). Use modelo barato para judge (Haiku, GPT-4o-mini) se o volume for alto. Nunca use o mesmo modelo que gerou as respostas como judge — viés de auto-favorecimento.',
    },
    {
      title: 'Synthetic test set',
      body: 'RAGAS Testset Generator cria perguntas de múltiplos tipos (simple, reasoning, multi-context, conditional) a partir do corpus. Útil para bootstrap quando não há anotação. Sempre revise manualmente uma amostra (10–20 exemplos) antes de confiar.',
    },
    {
      title: 'Integração em CI/CD',
      body: 'Versione o eval set (Git LFS ou bucket). Job roda RAGAS em sample (ex: 100 exemplos). Compara com baseline do branch main. Gate: faithfulness > 0.8 && relevancy > 0.85. PR bloqueado se score cair. Score como comentário automático no PR.',
    },
    {
      title: 'Alternativas ao RAGAS',
      body: 'ARES (Stanford) — avaliação com modelos de classificação fine-tuned. TruLens — trace completo do pipeline com categorias de feedback configuráveis. LangSmith — avaliação integrada ao trace do LangChain. RAGAS continua o mais usado em produção pela facilidade de integração.',
    },
  ],
  gotchas: [
    'Usar o mesmo modelo para gerar respostas e julgar — viés de auto-favorecimento infla todos os scores.',
    'Eval set pequeno demais (10 perguntas) — ruído domina o score e o gate CI não tem significância estatística.',
    'Esquecer edge cases (perguntas fora do domínio, ambíguas, multi-documento) — RAG quebra justamente nelas.',
    'Comparar scores absolutos entre diferentes modelos de judge — são calibrações distintas. Compare deltas entre versões.',
    'Faithfulness alto + relevancy baixo = resposta correta mas off-topic — bug no prompt, não no retrieval.',
    'Rodar RAGAS uma vez e nunca mais — qualidade degrada com tempo (data drift, mudança de corpus).',
    'Context Recall sempre 1.0 sem ground truth — a métrica retorna NaN ou 1.0 quando não há anotação; não interprete como perfeição.',
    'Ignorar custo do judge em escala — 5–15 LLM calls por exemplo × 1000 exemplos = custo real a planejar.',
  ],
  interview: [
    {
      q: 'Quais são as 4 métricas core do RAGAS e o que cada uma mede?',
      a: '<ul><li><strong>Faithfulness</strong>: claims da resposta estão apoiadas no contexto recuperado? LLM-judge decompõe a resposta em afirmações atômicas e verifica cada uma. Score baixo → alucinação.</li><li><strong>Answer Relevancy</strong>: a resposta é sobre a pergunta? Gera perguntas reversas a partir da resposta e mede similaridade. Score baixo → off-topic.</li><li><strong>Context Precision</strong>: os chunks no top-K são realmente relevantes? Score baixo → retrieval com ruído.</li><li><strong>Context Recall</strong>: recuperou todos os chunks necessários? Requer ground truth. Score baixo → retrieval perdendo dados.</li></ul><p>Mnemônico: <strong>FARC</strong>. Faithfulness e Relevancy são referenceless (sem ground truth). Recall exige anotação.</p>',
      tip: 'Mnemônico FARC. Faithfulness → prompt; Relevancy → prompt; Precision → retrieval; Recall → chunking.',
      level: 'pleno',
    },
    {
      q: 'Como integraria RAGAS em um pipeline CI/CD?',
      a: '<ol><li>Versionar o eval set (50–200 Q&As) em Git LFS ou bucket S3.</li><li>Job CI roda RAGAS em sample representativo a cada PR.</li><li>Registra delta vs baseline do branch main (não só valor absoluto).</li><li>Gate de qualidade: ex. faithfulness &gt; 0.80 &amp;&amp; context_precision &gt; 0.75.</li><li>PR bloqueado automaticamente com scores como comentário.</li><li>Alert se metrica cair em produção (monitoramento online amostral).</li></ol><p>Ponto crítico: gate de qualidade em CI/CD é o que separa RAG amador de produção.</p>',
      tip: 'Gate automático no CI/CD é o detalhe que demonstra experiência com RAG em escala.',
      level: 'pleno',
    },
    {
      q: 'Como interpretaria faithfulness = 0.6?',
      a: '<p>40% das claims da resposta não estão apoiadas no contexto recuperado — sinal forte de alucinação ou contexto insuficiente.</p><p>Investigação em camadas:</p><ol><li>Context Precision está alto? Se sim, contexto tem docs relevantes mas o LLM não segue — bug de prompt. Adicione instrução explícita.</li><li>Context Precision baixo? Docs irrelevantes no topo — retrieval com ruído está "confundindo" o LLM. Fix: reranking.</li><li>Chunk size adequado? Chunks muito grandes dilui o sinal. Muito pequenos perdem contexto.</li><li>Modelo de geração forte o suficiente? Modelos menores seguem menos o contexto.</li></ol>',
      tip: 'Diagnóstico por exclusão: primeiro veja Context Precision antes de culpar o prompt.',
      level: 'pleno',
    },
    {
      q: 'Como gerar um test set sintético com RAGAS?',
      a: '<p>RAGAS Testset Generator carrega o corpus (documentos do domínio) e cria perguntas de múltiplos tipos:</p><ul><li><strong>Simple</strong>: pergunta direta sobre fato do documento.</li><li><strong>Reasoning</strong>: requer inferência a partir do texto.</li><li><strong>Multi-context</strong>: resposta está em múltiplos chunks.</li><li><strong>Conditional</strong>: "se X, então Y".</li></ul><p>Cada exemplo gerado inclui question, ground_truth_answer e ground_truth_context.</p><p><strong>Crítico</strong>: sempre revise manualmente 10–20 exemplos antes de confiar — o gerador usa LLM e pode gerar perguntas sem sentido ou respostas incorretas.</p>',
      tip: 'Use como bootstrap. A revisão manual de amostra diferencia quem faz RAG real de quem segue tutorial.',
      level: 'pleno',
    },
    {
      q: 'Quais são as limitações do RAGAS como framework de avaliação?',
      a: '<ul><li>LLM-judge tem viés (modelos grandes favorecem estilo similar ao treinamento).</li><li>Custo alto em volume: 5–15 LLM calls por exemplo × 1000 exemplos = custo real.</li><li>Não mede latência, custo por query, UX ou satisfação do usuário.</li><li>Faithfulness pode falhar em raciocínio multi-step complexo.</li><li>Context Recall exige ground truth — não há como calcular sem anotação.</li><li>Scores absolutos não são comparáveis entre diferentes modelos de judge.</li></ul><p>Solução: combine RAGAS com human eval em amostra pequena para calibrar e validar se o judge concorda com humanos.</p>',
      tip: 'Mencionar que scores não são comparáveis entre modelos de judge é o detalhe avançado.',
      level: 'pleno',
    },
    {
      q: 'Como o LLM-as-judge funciona internamente no RAGAS?',
      a: '<p>Para <strong>Faithfulness</strong>: o judge decompõe a resposta em N claims atômicas. Para cada claim, verifica se está suportada pelo contexto recuperado. Score = claims_suportadas / N_total.</p><p>Para <strong>Answer Relevancy</strong>: o judge gera M perguntas reversas a partir da resposta e calcula similaridade semântica com a pergunta original. Score = média das similaridades.</p><p>Para <strong>Context Precision</strong>: o judge classifica cada chunk como relevante ou não para a pergunta. Score = precisão ponderada pela posição (chunks no topo têm mais peso).</p><p>Para <strong>Context Recall</strong>: compara ground truth answer com o contexto recuperado. Usa NLI (Natural Language Inference) para verificar se o contexto é suficiente para gerar a resposta.</p>',
      tip: 'Saber o mecanismo interno (decompõe em claims, NLI) demonstra entendimento profundo, não só uso da biblioteca.',
      level: 'senior',
    },
    {
      q: 'Como escolheria o modelo de judge para RAGAS e por quê?',
      a: '<p>Regras práticas:</p><ul><li><strong>Nunca</strong> use o mesmo modelo que gerou as respostas — viés de auto-favorecimento infla todos os scores.</li><li><strong>GPT-4o-mini ou Claude Haiku</strong> são ótimos choices para volume alto — baratos e suficientemente fortes como judge.</li><li>Para calibração inicial, compare as avaliações do judge barato vs. judge caro (GPT-4o) em 50 exemplos. Se concordância &gt; 85%, use o barato.</li><li>Para avaliações de audit ou release, use modelo mais forte como judge.</li></ul><p>Alternativa: TruLens com classificadores fine-tuned — menos custo por chamada, mais determinístico.</p>',
      tip: 'Calibrar o judge barato contra o caro em amostra pequena é a abordagem profissional.',
      level: 'senior',
    },
    {
      q: 'Como RAGAS se diferencia de ARES e TruLens?',
      a: '<p><strong>RAGAS</strong>: foco em métricas estandardizadas, fácil integração com LangChain/LlamaIndex, referenceless (sem ground truth para F e A). Mais usado na comunidade.</p><p><strong>ARES</strong> (Stanford): usa classificadores fine-tuned para julgamento — mais determinístico, menos custo por sample, mas requer dados de treinamento. Ideal para domínios muito específicos.</p><p><strong>TruLens</strong>: trace completo do pipeline com logging de cada etapa. Mais orientado a observability — você vê não só o score final mas também o raciocínio do judge. Integra com OpenTelemetry.</p><p>Na prática: RAGAS para eval set offline + TruLens para monitoramento online = cobertura completa.</p>',
      tip: 'A combinação RAGAS offline + TruLens online demonstra visão de sistema de avaliação, não só uso de ferramenta.',
      level: 'senior',
    },
    {
      q: 'Como estruturaria um eval set robusto para RAG?',
      a: '<p>Um eval set de qualidade tem 4 dimensões:</p><ol><li><strong>Cobertura</strong>: perguntas sobre cada seção/domínio do corpus. Não só perguntas fáceis de fatos explícitos.</li><li><strong>Dificuldade</strong>: mix de simple (50%), reasoning (30%), multi-context (20%).</li><li><strong>Edge cases</strong>: perguntas sem resposta no corpus, perguntas ambíguas, perguntas sobre tópico tangencial.</li><li><strong>Ground truth</strong>: para Context Recall, anote o contexto esperado. Para Faithfulness e Relevancy, não precisa.</li></ol><p>Tamanho mínimo: 50 para gate CI. 200+ para análise de regressão confiável. Versionar junto ao código do pipeline.</p>',
      tip: 'Edge cases (perguntas sem resposta) são onde RAG mais falha e o que menos testam — mencionar isso demonstra maturidade.',
      level: 'senior',
    },
    {
      q: 'Como usaria RAGAS para diagnosticar e melhorar um pipeline RAG específico?',
      a: '<p>Framework de diagnóstico por camadas:</p><ol><li>Roda RAGAS com 50 Q&As. Identifica qual métrica tem score mais baixo.</li><li><strong>Faithfulness baixo</strong> (ex: 0.55): alucinação. Revise instrução no prompt. Adicione "Responda APENAS com base no contexto. Se não souber, diga que não tem informação."</li><li><strong>Context Precision baixo</strong>: retrieval com ruído. Adicione cross-encoder reranking. Revise chunking.</li><li><strong>Context Recall baixo</strong>: retrieval perdendo docs. Tente hybrid search. Revise chunk size e overlap. Tente Contextual Retrieval.</li><li><strong>Answer Relevancy baixo</strong>: resposta off-topic. Revise o prompt de instrução. Adicione filtro de tópico na query.</li></ol><p>Itere: muda um componente por vez, re-roda eval, compara delta. Nunca mude dois componentes simultaneamente.</p>',
      tip: 'Muda um componente por vez e re-roda o eval — abordagem científica que demonstra disciplina de engenharia.',
      level: 'senior',
    },
    {
      q: 'Como implementaria monitoramento online de qualidade RAG em produção?',
      a: '<p>Dois níveis:</p><p><strong>Offline</strong> (já visto): eval set em CI/CD com gate de qualidade por PR.</p><p><strong>Online</strong>:</p><ul><li>Log 100% dos inputs, contextos e respostas (com sampling se volume for alto).</li><li>LLM-judge amostral: avalie 1–5% dos requests com RAGAS em tempo real.</li><li>Thumbs up/down do usuário como sinal de ground truth humano.</li><li>Alertas: Faithfulness média abaixo de threshold em janela de 1h → pager.</li><li>Dashboard: tendências de score ao longo do tempo, correlação com mudanças de prompt/corpus.</li></ul><p>TruLens ou LangSmith são ótimos para esse monitoramento com trace completo.</p>',
      tip: 'Feedback do usuário (thumbs) como sinal de qualidade é o que diferencia sistemas de produção real.',
      level: 'senior',
    },
    {
      q: 'O que é Answer Similarity e quando usar?',
      a: '<p>Answer Similarity mede quão parecida é a resposta gerada com a ground truth (resposta de referência). É diferente de Answer Relevancy: Relevancy mede foco na pergunta, Similarity mede proximidade com a resposta esperada.</p><p>Usa embeddings para calcular similaridade semântica entre resposta gerada e ground truth.</p><p>Quando usar: quando você tem ground truth anotado e quer medir se o modelo está "chegando perto" da resposta certa, mesmo com formulação diferente.</p><p>Limitação: Answer Similarity não mede se a resposta é factualmente correta — apenas se é semanticamente similar à referência. Use junto com Faithfulness.</p>',
      tip: 'Distinguir Similarity (compara com ground truth) de Relevancy (compara com a pergunta) é o detalhe que demonstra leitura profunda do paper.',
      level: 'senior',
    },
    {
      q: 'Como RAGAS lida com avaliação de pipelines multi-turn (conversacional)?',
      a: '<p>RAGAS padrão é single-turn (uma pergunta, uma resposta). Para multi-turn, o desafio é que o contexto da conversa muda.</p><p>Abordagem prática:</p><ul><li>Avalie cada turn individualmente mas inclua o histórico da conversa como parte do contexto.</li><li>Métricas de conversação adicionais: coherence (coerência com turns anteriores) e context adherence (segue o contexto conversacional).</li><li>RAGAS tem suporte experimental a conversational evaluation — verifique a versão.</li></ul><p>Alternativa: TruLens com métricas custom para coherence entre turns.</p>',
      tip: 'Saber que RAGAS é primariamente single-turn e como adaptá-lo para multi-turn é conhecimento avançado.',
      level: 'senior',
    },
    {
      q: 'Quais são as boas práticas para o prompt de instrução em RAG para maximizar Faithfulness?',
      a: '<p>Instruções que maximizam Faithfulness:</p><ol><li><strong>Instrução explícita</strong>: "Responda SOMENTE com base no contexto abaixo. Se a resposta não estiver no contexto, diga: \'Não tenho informação sobre isso no meu conhecimento base.\'"</li><li><strong>Força citations</strong>: "Ao responder, cite a fonte no formato [Fonte: X]."</li><li><strong>Proíbe suposição</strong>: "Nunca assuma informações além do que está explicitamente no contexto."</li><li><strong>Context-first</strong>: coloque o contexto recuperado ANTES da pergunta no prompt — o modelo presta mais atenção ao que vem antes da query.</li></ol><p>Teste: calcule Faithfulness com e sem a instrução explícita no mesmo eval set — a diferença é geralmente &gt; 15 pontos percentuais.</p>',
      tip: 'Context-first no prompt (contexto antes da pergunta) é o detalhe de ordering que a maioria não menciona.',
      level: 'pleno',
    },
    {
      q: 'Como calcular Context Precision sem um modelo de judge externo?',
      a: '<p>Context Precision padrão usa LLM-as-judge para classificar relevância de cada chunk. Para evitar custo ou dependência de API:</p><ul><li><strong>Cross-encoder local</strong>: modelos como bge-reranker-v2-m3 ou cross-encoder/ms-marco-MiniLM retornam score de relevância por (query, chunk). Threshold &gt; 0.5 = relevante.</li><li><strong>BM25 score</strong>: uso do score de BM25 como proxy de relevância para queries com termos exatos.</li><li><strong>Click-through feedback</strong>: em sistemas com UI, use se o usuário clicou na fonte citada como sinal de relevância.</li></ul><p>Trade-off: cross-encoder local é determinístico e barato, mas menos sofisticado que LLM para julgamento de relevância semântica.</p>',
      tip: 'Cross-encoder local como substitute do LLM-judge demonstra que você pensa em custo e dependências.',
      level: 'senior',
    },
    {
      q: 'Como RAGAS integra com LangChain e LlamaIndex?',
      a: '<p>RAGAS tem integração nativa com ambos os frameworks:</p><p><strong>LangChain</strong>:</p><pre><code>from ragas.integrations.langchain import EvaluatorChain\nfrom ragas.metrics import faithfulness\nchain = EvaluatorChain(metric=faithfulness)\nresult = chain({"question": q, "answer": a, "contexts": chunks})</code></pre><p><strong>LlamaIndex</strong>:</p><pre><code>from ragas.integrations.llama_index import evaluate\nresult = evaluate(query_engine, metrics=[faithfulness, answer_relevancy])</code></pre><p>Ambas as integrações retornam um Dataset Hugging Face compatível, que você exporta como CSV ou envia ao LangSmith.</p>',
      tip: 'Saber que o output é compatível com Hugging Face Datasets facilita versionamento e análise posterior.',
      level: 'pleno',
    },
    {
      q: 'Como interpretar um cenário onde Context Precision é alto mas Faithfulness é baixo?',
      a: '<p>Diagnóstico:</p><ul><li>Context Precision alto → os chunks recuperados são relevantes para a pergunta.</li><li>Faithfulness baixo → o LLM não está usando esses chunks para responder. Está "ignorando" o contexto e usando conhecimento paramétrico.</li></ul><p>Causas prováveis:</p><ol><li>Instrução de prompt fraca — modelo não está sendo forçado a usar o contexto.</li><li>Modelo pequeno ou pouco capaz de seguir instruções complexas.</li><li>Contexto muito longo — Lost in the Middle: chunks relevantes no meio do prompt são ignorados.</li><li>Temperatura alta — modelo "criativo" desvia do contexto.</li></ol><p>Fix: instrução mais rígida + temperatura 0 + reordenar contexto (mais relevante primeiro e último).</p>',
      tip: 'Precision alto + Faithfulness baixo é o diagnóstico que mais confunde candidatos — aprender este padrão é diferenciador.',
      level: 'senior',
    },
    {
      q: 'Qual é a diferença entre avaliação offline e online em sistemas RAG?',
      a: '<p><strong>Offline</strong>: eval set fixo e versionado, roda antes do deploy. Vantagens: reprodutível, barato, automatizável no CI. Desvantagem: só cobre os exemplos que você escreveu — pode ter viés de seleção.</p><p><strong>Online</strong>: avalia requests reais em produção (1–5% por amostragem). Vantagens: cobre distribuição real do usuário, captura edge cases inesperados. Desvantagem: mais caro, delay para agir (o bug já afetou usuários).</p><p>Estratégia ideal: gate offline no CI/CD para regressões conhecidas + monitoramento online amostral para capturar novos problemas em produção. Alertas quando métricas online caem abaixo de threshold.</p>',
      tip: 'A combinação offline + online com alertas é a arquitetura de avaliação que times de AI sérios implementam.',
      level: 'senior',
    },
    {
      q: 'O que é Noise Robustness e por que medir em pipelines RAG?',
      a: '<p>Noise Robustness mede se o pipeline mantém a qualidade quando o corpus contém documentos irrelevantes ou contraditórios entre os chunks recuperados.</p><p>Por que importa: em produção, o corpus raramente é limpo. PDFs mal formatados, chunks com ruído, documentos desatualizados e informações conflitantes são a realidade.</p><p>Como testar: injete documentos "adversariais" no corpus e meça quanto os scores de Faithfulness e Context Precision degradam.</p><p>RAGAS não tem métrica nativa de robustez — construa seu próprio: compare scores em corpus limpo vs. corpus com 20% de ruído injetado.</p>',
      tip: 'Propor testes adversariais com corpus ruidoso demonstra que você pensa em robustez de produção, não só em benchmarks limpos.',
      level: 'senior',
    },
    {
      q: 'Como RAGAS lida com múltiplos documentos por resposta (multi-doc grounding)?',
      a: '<p>No caso de respostas que precisam de informação de múltiplos chunks:</p><ul><li>Faithfulness verifica cada claim contra o conjunto completo de chunks recuperados, não apenas o primeiro.</li><li>Context Recall verifica se TODOS os chunks necessários (ground truth) estão no top-K, não apenas um.</li><li>Context Precision penaliza se muitos dos top-K são irrelevantes, mesmo que os relevantes estejam presentes.</li></ul><p>Dificuldade: para perguntas multi-doc, Context Recall exige anotação cuidadosa de quais documentos são necessários para a resposta — não basta anotar só a resposta.</p><p>Prática: em eval sets multi-doc, anote explicitamente os source_ids dos chunks esperados no ground_truth_context.</p>',
      tip: 'A anotação de source_ids no ground truth para multi-doc é o detalhe operacional que a maioria ignora ao montar eval sets.',
      level: 'senior',
    },
    {
      q: 'Como escolher entre Context Precision e Context Recall para priorizar no eval?',
      a: '<p>Depende do tipo de erro que você mais quer evitar:</p><p><strong>Priorize Context Precision</strong> quando o custo de ruído no contexto é alto — aplicações que geram resposta curta e objetiva onde chunks irrelevantes confundem o modelo.</p><p><strong>Priorize Context Recall</strong> quando o custo de perder informação é alto — aplicações jurídicas, médicas ou de compliance onde deixar de recuperar um documento é crítico.</p><p>Tensão: chunking fino melhora Recall mas degrada Precision. Chunking grosso melhora Precision mas degrada Recall. A solução é chunking hierárquico: chunk fino para retrieval (Precision) + chunk pai para contexto (Recall).</p>',
      tip: 'Articular a tensão Precision vs. Recall como decisão de design (não como falha) demonstra pensamento de engenharia.',
      level: 'senior',
    },
    {
      q: 'Quais métricas o RAGAS 0.2+ introduziu além das 4 core originais?',
      a: '<p>RAGAS evolui rapidamente. Métricas notáveis adicionadas além das 4 core:</p><ul><li><strong>Answer Correctness</strong>: combina factual correctness (compara fatos com ground truth) e semantic similarity. Requer ground truth.</li><li><strong>Summarization Score</strong>: avalia pipelines de sumarização, não só Q&A.</li><li><strong>SQL Semantic Equivalence</strong>: para pipelines Text-to-SQL.</li><li><strong>Aspect Critique</strong>: critique customizável — você define o "aspecto" a avaliar (ex: conciseness, harmlessness).</li></ul><p>Atenção: API pode mudar entre versões. Sempre verifique a documentação da versão instalada com <code>ragas.__version__</code>.</p>',
      tip: 'Mencionar que a API muda entre versões e o hábito de checar a versão demonstra maturidade prática com ferramentas em evolução.',
      level: 'senior',
    },
  ],
  diagrams: [
    {
      title: 'RAGAS — As 4 métricas e diagnóstico de falha',
      html: `<style>
.rg-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.rg-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}
.rg-card{background:#1e293b;border-radius:10px;padding:16px;border:1.5px solid #334155}
.rg-badge{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:4px;padding:2px 8px;margin-bottom:10px}
.rg-title{font-size:13px;font-weight:700;color:#e2e8f0;margin-bottom:4px}
.rg-sub{font-size:10px;color:#64748b;margin-bottom:10px}
.rg-bar-bg{background:#0f172a;border-radius:4px;height:6px;overflow:hidden;margin-bottom:6px}
.rg-bar{height:6px;border-radius:4px}
.rg-fix{background:#0f172a;border-radius:6px;padding:8px 10px;font-size:10px;color:#94a3b8;line-height:1.6;margin-top:8px;border-left:2px solid #334155}
.rg-fix strong{color:#e2e8f0}
.rg-farc{display:flex;justify-content:center;gap:8px;margin-top:20px}
.rg-farc-item{background:#1e293b;border-radius:8px;padding:10px 14px;text-align:center;border:1px solid #334155}
</style>
<div class="rg-wrap">
  <p style="font-size:13px;font-weight:700;margin:0 0 4px">RAGAS — 4 Métricas Core</p>
  <p style="font-size:10px;color:#475569;margin:0">Cada métrica aponta para um componente diferente do pipeline</p>
  <div class="rg-grid">
    <div class="rg-card">
      <div class="rg-badge" style="background:rgba(239,68,68,.15);color:#ef4444">Faithfulness</div>
      <div class="rg-title">Claims apoiadas no contexto?</div>
      <div class="rg-sub">Referenceless · Verifica alucinação</div>
      <div class="rg-bar-bg"><div class="rg-bar" style="width:55%;background:#ef4444"></div></div>
      <div class="rg-fix"><strong>Score baixo:</strong> alucinação. Fix: instrução "Responda APENAS com base no contexto".</div>
    </div>
    <div class="rg-card">
      <div class="rg-badge" style="background:rgba(34,197,94,.15);color:#22c55e">Answer Relevancy</div>
      <div class="rg-title">Resposta é sobre a pergunta?</div>
      <div class="rg-sub">Referenceless · Gera perguntas reversas</div>
      <div class="rg-bar-bg"><div class="rg-bar" style="width:88%;background:#22c55e"></div></div>
      <div class="rg-fix"><strong>Score baixo:</strong> off-topic. Fix: revise o prompt de instrução e filtros de contexto.</div>
    </div>
    <div class="rg-card">
      <div class="rg-badge" style="background:rgba(245,158,11,.15);color:#f59e0b">Context Precision</div>
      <div class="rg-title">Top-K tem docs relevantes?</div>
      <div class="rg-sub">Referenceless · Ruído no retrieval</div>
      <div class="rg-bar-bg"><div class="rg-bar" style="width:62%;background:#f59e0b"></div></div>
      <div class="rg-fix"><strong>Score baixo:</strong> retrieval com ruído. Fix: adicione reranking (cross-encoder).</div>
    </div>
    <div class="rg-card">
      <div class="rg-badge" style="background:rgba(99,102,241,.15);color:#6366f1">Context Recall</div>
      <div class="rg-title">Recuperou todos os docs necessários?</div>
      <div class="rg-sub">Requer ground truth · Completude</div>
      <div class="rg-bar-bg"><div class="rg-bar" style="width:47%;background:#6366f1"></div></div>
      <div class="rg-fix"><strong>Score baixo:</strong> retrieval incompleto. Fix: hybrid search ou revise chunking.</div>
    </div>
  </div>
  <div class="rg-farc">
    <div class="rg-farc-item"><div style="font-size:20px;font-weight:800;color:#ef4444">F</div><div style="font-size:9px;color:#64748b">Faithfulness</div></div>
    <div class="rg-farc-item"><div style="font-size:20px;font-weight:800;color:#22c55e">A</div><div style="font-size:9px;color:#64748b">Answer</div></div>
    <div class="rg-farc-item"><div style="font-size:20px;font-weight:800;color:#f59e0b">R</div><div style="font-size:9px;color:#64748b">Recall</div></div>
    <div class="rg-farc-item"><div style="font-size:20px;font-weight:800;color:#6366f1">C</div><div style="font-size:9px;color:#64748b">Context</div></div>
  </div>
</div>`,
      caption: 'Mnemônico FARC: cada letra mapeia para uma métrica e cada métrica aponta para um componente diferente do pipeline.',
    },
    {
      title: 'RAGAS em CI/CD — pipeline de qualidade automatizado',
      html: `<style>
.rgci-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.rgci-flow{display:flex;align-items:flex-start;gap:8px;margin-top:16px;flex-wrap:wrap}
.rgci-step{background:#1e293b;border-radius:8px;padding:12px;min-width:110px;text-align:center;border:1.5px solid #334155;flex:1}
.rgci-step-num{font-size:9px;font-weight:700;color:#475569;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em}
.rgci-step-title{font-size:12px;font-weight:700;color:#e2e8f0;margin-bottom:4px}
.rgci-step-body{font-size:10px;color:#64748b;line-height:1.5}
.rgci-arrow{font-size:18px;color:#334155;padding-top:28px;flex-shrink:0}
.rgci-gate{margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
.rgci-gate-item{background:#1e293b;border-radius:8px;padding:12px;border:1.5px solid}
</style>
<div class="rgci-wrap">
  <p style="font-size:13px;font-weight:700;margin:0 0 4px">RAGAS em CI/CD</p>
  <p style="font-size:10px;color:#475569;margin:0">Gate de qualidade automático em cada PR</p>
  <div class="rgci-flow">
    <div class="rgci-step">
      <div class="rgci-step-num">Step 1</div>
      <div class="rgci-step-title">Eval set</div>
      <div class="rgci-step-body">50–200 Q&As versionados (Git LFS ou S3)</div>
    </div>
    <div class="rgci-arrow">→</div>
    <div class="rgci-step">
      <div class="rgci-step-num">Step 2</div>
      <div class="rgci-step-title">Job CI</div>
      <div class="rgci-step-body">Roda RAGAS em sample a cada PR no pipeline</div>
    </div>
    <div class="rgci-arrow">→</div>
    <div class="rgci-step">
      <div class="rgci-step-num">Step 3</div>
      <div class="rgci-step-title">Delta</div>
      <div class="rgci-step-body">Compara com baseline do branch main</div>
    </div>
    <div class="rgci-arrow">→</div>
    <div class="rgci-step">
      <div class="rgci-step-num">Step 4</div>
      <div class="rgci-step-title">Gate</div>
      <div class="rgci-step-body">Faithfulness &gt; 0.80 &amp;&amp; Precision &gt; 0.75</div>
    </div>
  </div>
  <div class="rgci-gate">
    <div class="rgci-gate-item" style="border-color:#22c55e40">
      <div style="font-size:11px;font-weight:700;color:#22c55e;margin-bottom:6px">PASSOU — merge liberado</div>
      <div style="font-size:10px;color:#64748b;line-height:1.6">Scores acima do threshold. Comentário com scores no PR como histórico.</div>
    </div>
    <div class="rgci-gate-item" style="border-color:#ef444440">
      <div style="font-size:11px;font-weight:700;color:#ef4444;margin-bottom:6px">FALHOU — PR bloqueado</div>
      <div style="font-size:10px;color:#64748b;line-height:1.6">Score caiu. Comentário automático com qual métrica falhou e dica de diagnóstico.</div>
    </div>
  </div>
  <div style="margin-top:14px;padding:10px 14px;background:#1e293b;border-radius:8px;font-size:11px;color:#94a3b8;border-left:3px solid #06b6d4">
    <strong style="color:#06b6d4">Importante:</strong> meça sempre o delta vs. baseline, não só o valor absoluto. Um score de 0.78 pode ser ótimo se o baseline era 0.60.
  </div>
</div>`,
      caption: 'O gate de qualidade em CI/CD transforma RAGAS de ferramenta de análise ad hoc em sistema de controle de regressão.',
    },
    {
      title: 'Diagnóstico por combinação de métricas',
      html: `<style>
.rgdx-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.rgdx-table{width:100%;border-collapse:collapse;margin-top:16px;font-size:11px}
.rgdx-table th{background:#1e293b;padding:8px 12px;text-align:left;color:#94a3b8;font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid #334155}
.rgdx-table td{padding:10px 12px;border-bottom:1px solid #1e293b;vertical-align:top;line-height:1.5}
.rgdx-table tr:hover td{background:#1e293b}
.chip{display:inline-block;font-size:9px;font-weight:700;border-radius:4px;padding:2px 6px;margin-right:4px}
.ok{background:rgba(34,197,94,.15);color:#22c55e}
.bad{background:rgba(239,68,68,.15);color:#ef4444}
</style>
<div class="rgdx-wrap">
  <p style="font-size:13px;font-weight:700;margin:0 0 4px">Diagnóstico por combinação de métricas RAGAS</p>
  <p style="font-size:10px;color:#475569;margin:0">Cada padrão aponta para uma causa raiz diferente</p>
  <table class="rgdx-table">
    <thead>
      <tr>
        <th>Faithfulness</th>
        <th>Precision</th>
        <th>Recall</th>
        <th>Diagnóstico e fix</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="chip bad">Baixo</span></td>
        <td><span class="chip ok">Alto</span></td>
        <td><span class="chip ok">Alto</span></td>
        <td><strong style="color:#e2e8f0">Prompt fraco.</strong> Contexto tem tudo, LLM ignora. Adicione instrução explícita de grounding.</td>
      </tr>
      <tr>
        <td><span class="chip bad">Baixo</span></td>
        <td><span class="chip bad">Baixo</span></td>
        <td><span class="chip ok">Alto</span></td>
        <td><strong style="color:#e2e8f0">Retrieval com ruído.</strong> Docs irrelevantes confundem o LLM. Adicione reranking cross-encoder.</td>
      </tr>
      <tr>
        <td><span class="chip bad">Baixo</span></td>
        <td><span class="chip ok">Alto</span></td>
        <td><span class="chip bad">Baixo</span></td>
        <td><strong style="color:#e2e8f0">Chunking ruim + prompt fraco.</strong> Não recuperou tudo e não usa o que tem. Fix dual.</td>
      </tr>
      <tr>
        <td><span class="chip ok">Alto</span></td>
        <td><span class="chip bad">Baixo</span></td>
        <td><span class="chip bad">Baixo</span></td>
        <td><strong style="color:#e2e8f0">Retrieval crítico.</strong> Poucas informações relevantes no contexto. Revise chunking e embedding.</td>
      </tr>
      <tr>
        <td><span class="chip ok">Alto</span></td>
        <td><span class="chip ok">Alto</span></td>
        <td><span class="chip bad">Baixo</span></td>
        <td><strong style="color:#e2e8f0">Recall faltando.</strong> Precision ok, mas não pega todos os docs. Hybrid search ou chunk overlap maior.</td>
      </tr>
      <tr>
        <td><span class="chip ok">Alto</span></td>
        <td><span class="chip ok">Alto</span></td>
        <td><span class="chip ok">Alto</span></td>
        <td><strong style="color:#22c55e">Pipeline saudável.</strong> Verifique Answer Relevancy e latência.</td>
      </tr>
    </tbody>
  </table>
</div>`,
      caption: 'Olhar combinações de métricas (não cada uma isolada) é o que permite diagnóstico preciso e evita tentativa e erro.',
    },
  ],
  cheatsheet: {
    title: 'RAGAS — Referência Rápida',
    html: `<style>
.rgcs-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0;display:grid;grid-template-columns:1fr 1fr;gap:20px}
.rgcs-section{background:#1e293b;border-radius:10px;padding:16px}
.rgcs-title{font-size:11px;font-weight:700;color:#06b6d4;text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px;border-bottom:1px solid #334155;padding-bottom:8px}
.rgcs-row{display:flex;justify-content:space-between;align-items:flex-start;padding:6px 0;border-bottom:1px solid #0f172a;font-size:11px}
.rgcs-key{color:#94a3b8;min-width:120px;flex-shrink:0}
.rgcs-val{color:#e2e8f0;text-align:right;flex:1}
.rgcs-rule{display:flex;align-items:flex-start;gap:8px;padding:6px 0;font-size:11px;border-bottom:1px solid #0f172a}
.rgcs-rule-icon{font-size:13px;flex-shrink:0;margin-top:1px}
.rgcs-full{grid-column:span 2}
.rgcs-code{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:6px;padding:10px 12px;font-size:10px;color:#94a3b8;white-space:pre;overflow-x:auto;margin-top:8px}
</style>
<div class="rgcs-wrap">
  <div class="rgcs-section">
    <div class="rgcs-title">4 Métricas — FARC</div>
    <div class="rgcs-row"><span class="rgcs-key">Faithfulness</span><span class="rgcs-val">claims no contexto?</span></div>
    <div class="rgcs-row"><span class="rgcs-key">Answer Relevancy</span><span class="rgcs-val">foco na pergunta?</span></div>
    <div class="rgcs-row"><span class="rgcs-key">Recall</span><span class="rgcs-val">pegou todos os docs?</span></div>
    <div class="rgcs-row"><span class="rgcs-key">Context Precision</span><span class="rgcs-val">top-K tem ruído?</span></div>
    <div class="rgcs-row"><span class="rgcs-key">Score alvo</span><span class="rgcs-val" style="color:#22c55e">&gt; 0.80</span></div>
    <div class="rgcs-row"><span class="rgcs-key">Score crítico</span><span class="rgcs-val" style="color:#ef4444">&lt; 0.60</span></div>
    <div class="rgcs-row"><span class="rgcs-key">Recall</span><span class="rgcs-val" style="color:#f59e0b">requer ground truth</span></div>
  </div>
  <div class="rgcs-section">
    <div class="rgcs-title">Diagnóstico Rápido</div>
    <div class="rgcs-row"><span class="rgcs-key" style="color:#ef4444">Faith baixo</span><span class="rgcs-val">→ revise prompt</span></div>
    <div class="rgcs-row"><span class="rgcs-key" style="color:#22c55e">Relevancy baixo</span><span class="rgcs-val">→ revise prompt</span></div>
    <div class="rgcs-row"><span class="rgcs-key" style="color:#f59e0b">Precision baixo</span><span class="rgcs-val">→ adicione reranking</span></div>
    <div class="rgcs-row"><span class="rgcs-key" style="color:#6366f1">Recall baixo</span><span class="rgcs-val">→ revise chunking</span></div>
    <div class="rgcs-row"><span class="rgcs-key">Faith↑ + Prec↓</span><span class="rgcs-val">→ Lost in Middle</span></div>
  </div>
  <div class="rgcs-section rgcs-full">
    <div class="rgcs-title">Regras Críticas</div>
    <div class="rgcs-rule"><span class="rgcs-rule-icon">✗</span><span style="color:#ef4444">Nunca use o mesmo modelo para gerar e julgar — viés de auto-favorecimento</span></div>
    <div class="rgcs-rule"><span class="rgcs-rule-icon">✗</span><span style="color:#ef4444">Eval set com menos de 50 exemplos não tem significância estatística</span></div>
    <div class="rgcs-rule"><span class="rgcs-rule-icon">✗</span><span style="color:#ef4444">Scores absolutos não são comparáveis entre modelos de judge — use deltas</span></div>
    <div class="rgcs-rule"><span class="rgcs-rule-icon">✓</span><span style="color:#22c55e">Gate de qualidade em CI: faithfulness &gt; 0.80 para todo PR que muda prompt ou retrieval</span></div>
    <div class="rgcs-rule"><span class="rgcs-rule-icon">✓</span><span style="color:#22c55e">Combine avaliação offline (CI) com monitoramento online amostral (1–5%)</span></div>
    <div class="rgcs-rule"><span class="rgcs-rule-icon">✓</span><span style="color:#22c55e">Revise manualmente 10–20 exemplos do synthetic test set antes de confiar</span></div>
  </div>
</div>`,
    caption: 'RAGAS cheatsheet: métricas FARC, diagnóstico por score baixo e regras críticas de uso.',
  },
  mindmap: {
    title: 'RAGAS — Mapa Mental',
    html: `<style>
.rgmm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.rgmm-center{text-align:center;padding:12px 20px;background:#1e293b;border-radius:10px;display:inline-block;margin:0 auto;border:2px solid #06b6d4;font-size:14px;font-weight:700}
.rgmm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:20px}
.rgmm-cat{background:#1e293b;border-radius:10px;padding:14px;border-top:3px solid}
.rgmm-cat-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
.rgmm-item{font-size:11px;color:#94a3b8;padding:3px 0;border-bottom:1px solid #0f172a;line-height:1.5}
.rgmm-item.key{color:#e2e8f0}
</style>
<div class="rgmm-wrap">
  <div style="text-align:center;margin-bottom:20px">
    <div class="rgmm-center">RAGAS<br><span style="font-size:10px;font-weight:400;color:#64748b">RAG Evaluation Framework</span></div>
  </div>
  <div class="rgmm-grid">
    <div class="rgmm-cat" style="border-color:#ef4444">
      <div class="rgmm-cat-title" style="color:#ef4444">Faithfulness</div>
      <div class="rgmm-item key">Claims na resposta vs. contexto</div>
      <div class="rgmm-item key">LLM-judge decompõe em claims</div>
      <div class="rgmm-item key">Referenceless (sem ground truth)</div>
      <div class="rgmm-item">Fix: instrução explícita no prompt</div>
      <div class="rgmm-item">Meta: &gt; 0.80</div>
    </div>
    <div class="rgmm-cat" style="border-color:#22c55e">
      <div class="rgmm-cat-title" style="color:#22c55e">Answer Relevancy</div>
      <div class="rgmm-item key">Resposta foca na pergunta?</div>
      <div class="rgmm-item key">Gera perguntas reversas + similaridade</div>
      <div class="rgmm-item key">Referenceless</div>
      <div class="rgmm-item">Fix: revisar prompt de instrução</div>
      <div class="rgmm-item">Meta: &gt; 0.85</div>
    </div>
    <div class="rgmm-cat" style="border-color:#f59e0b">
      <div class="rgmm-cat-title" style="color:#f59e0b">Context Precision</div>
      <div class="rgmm-item key">Top-K tem docs relevantes?</div>
      <div class="rgmm-item key">Penaliza ruído por posição</div>
      <div class="rgmm-item key">Referenceless</div>
      <div class="rgmm-item">Fix: reranking cross-encoder</div>
      <div class="rgmm-item">Meta: &gt; 0.75</div>
    </div>
    <div class="rgmm-cat" style="border-color:#6366f1">
      <div class="rgmm-cat-title" style="color:#6366f1">Context Recall</div>
      <div class="rgmm-item key">Recuperou todos os docs?</div>
      <div class="rgmm-item key">Requer ground truth anotado</div>
      <div class="rgmm-item key">NLI para verificar completude</div>
      <div class="rgmm-item">Fix: hybrid search, chunk overlap</div>
      <div class="rgmm-item">Meta: &gt; 0.75</div>
    </div>
    <div class="rgmm-cat" style="border-color:#06b6d4">
      <div class="rgmm-cat-title" style="color:#06b6d4">CI/CD &amp; Eval Set</div>
      <div class="rgmm-item key">50–200 Q&As versionados</div>
      <div class="rgmm-item key">Gate por PR automático</div>
      <div class="rgmm-item key">Delta vs. baseline, não absoluto</div>
      <div class="rgmm-item">Synthetic test set como bootstrap</div>
      <div class="rgmm-item">Monitoramento online 1–5%</div>
    </div>
    <div class="rgmm-cat" style="border-color:#94a3b8">
      <div class="rgmm-cat-title" style="color:#94a3b8">LLM-as-judge</div>
      <div class="rgmm-item key">Nunca use o mesmo modelo</div>
      <div class="rgmm-item key">Haiku/4o-mini para volume</div>
      <div class="rgmm-item key">Calibre judge barato vs. caro</div>
      <div class="rgmm-item">Alternativas: ARES, TruLens</div>
      <div class="rgmm-item">Scores não comparáveis cross-model</div>
    </div>
  </div>
</div>`,
    caption: 'Mapa mental RAGAS: seis dimensões — as 4 métricas, CI/CD e LLM-as-judge.',
  },
  mnemonics: [
    {
      label: 'Métricas RAGAS',
      trick: 'FARC',
      explanation: 'Cada letra é uma métrica e aponta para um componente diferente: F → prompt, A → prompt, R → chunking, C → retrieval. Exemplo: Faithfulness 0.55 + Context Precision 0.90 = contexto bom, LLM não segue → bug no prompt.',
    },
    {
      label: 'Regra do judge RAGAS',
      trick: 'Nunca julga quem gerou',
      explanation: 'O modelo de judge nunca pode ser o mesmo que gerou as respostas. Viés de auto-favorecimento infla scores em 15–20 pp. Gerador: GPT-4o → Judge: Claude Haiku ou GPT-4o-mini.',
    },
    {
      label: 'Gate de qualidade',
      trick: 'FP80 — Faithfulness e Precision acima de 80',
      explanation: 'Thresholds práticos para gate de CI: Faithfulness > 0.80 e Context Precision > 0.75. PR muda prompt → CI roda RAGAS → Faith cai para 0.71 → PR bloqueado automaticamente.',
    },
  ],
  exercises: [
    {
      level: 'iniciante',
      title: 'Calcular métricas RAGAS em um mini dataset',
      description: 'Crie um dataset de 10 Q&As sobre um domínio simples (ex: perguntas sobre um artigo técnico). Execute RAGAS com as 4 métricas. Identifique qual métrica apresenta o score mais baixo e formule uma hipótese de causa.',
      concepts: ['Faithfulness', 'Answer Relevancy', 'Context Precision', 'LLM-as-judge'],
      hint: 'Use ragas.evaluate() com dataset do tipo Dataset Hugging Face. Passe question, answer, contexts e (se tiver) ground_truth.',
    },
    {
      level: 'intermediario',
      title: 'Implementar gate de qualidade em CI',
      description: 'Configure um job GitHub Actions que: (1) carrega um eval set de 50 Q&As do S3 ou pasta do repo; (2) executa o pipeline RAG; (3) roda RAGAS; (4) falha o job se Faithfulness < 0.80 ou Context Precision < 0.75; (5) posta os scores como comentário no PR.',
      concepts: ['CI/CD', 'RAGAS integration', 'GitHub Actions', 'eval set versionado'],
      hint: 'Use a action de comment no PR via GitHub API. Para o threshold, sys.exit(1) se score abaixo.',
    },
    {
      level: 'senior',
      title: 'Diagnóstico e melhoria de pipeline com RAGAS',
      description: 'Dado um pipeline RAG com Faithfulness = 0.58, Context Precision = 0.70, Context Recall = 0.65: (1) diagnostique a causa raiz de cada métrica baixa; (2) proponha três mudanças (uma por métrica); (3) implemente e re-rode; (4) compare deltas; (5) escreva um relatório de melhoria com métricas before/after.',
      concepts: ['Diagnóstico sistemático', 'reranking', 'chunking', 'prompt engineering', 'delta analysis'],
      hint: 'Mude um componente por vez e re-rode o eval a cada mudança. Nunca mude prompt e retrieval simultaneamente.',
    },
  ],
  videos: [
    {
      title: 'RAGAS — Evaluate RAG pipelines with LLM-as-judge',
      channel: 'James Briggs',
      url: 'https://www.youtube.com/watch?v=IVad80oJO1E',
      topic: 'RAGAS overview e implementação prática',
    },
    {
      title: 'RAG Evaluation with RAGAS Framework',
      channel: 'Sam Witteveen',
      url: 'https://www.youtube.com/watch?v=SV3LYYMjmf0',
      topic: 'Integração com LangChain e diagnóstico de métricas',
    },
    {
      title: 'How to Evaluate RAG Applications with RAGAS',
      channel: 'LangChain',
      url: 'https://www.youtube.com/watch?v=zhkYbBsmBT0',
      topic: 'Tutorial oficial LangChain + RAGAS',
    },
    {
      title: 'Your AI Product Needs Evals — Hamel Husain',
      channel: 'Hamel Husain',
      url: 'https://www.youtube.com/watch?v=9bIVoq2r9sk',
      topic: 'Por que e como construir sistemas de avaliação robustos',
    },
    {
      title: 'Advanced RAG 05: RAGAS Evaluation',
      channel: 'Sophia Yang (Cohere)',
      url: 'https://www.youtube.com/watch?v=TN2aIiI7y94',
      topic: 'RAGAS avançado com Cohere e análise de métricas',
    },
  ],
  resources: [
    { title: 'RAGAS docs oficiais', url: 'https://docs.ragas.io/', kind: 'docs' },
    { title: 'RAGAS paper (2023)', url: 'https://arxiv.org/abs/2309.15217', kind: 'artigo' },
    { title: 'explodinggradients/ragas (GitHub)', url: 'https://github.com/explodinggradients/ragas', kind: 'docs' },
    { title: 'Hamel Husain — Your AI Product Needs Evals', url: 'https://hamel.dev/blog/posts/evals/', kind: 'artigo' },
    { title: 'Anthropic — Contextual Retrieval', url: 'https://www.anthropic.com/news/contextual-retrieval', kind: 'artigo' },
    { title: 'TruLens docs', url: 'https://www.trulens.org/docs/', kind: 'docs' },
    { title: 'ARES paper (Stanford)', url: 'https://arxiv.org/abs/2311.09476', kind: 'artigo' },
    { title: 'Lost in the Middle paper (Stanford)', url: 'https://arxiv.org/abs/2307.03172', kind: 'artigo' },
  ],
  codeExamples: [
    {
      title: 'Avaliação básica com RAGAS',
      language: 'python',
      code: `from datasets import Dataset
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)

# Formato esperado pelo RAGAS
data = {
    "question": ["O que é RAG?", "Como funciona o chunking?"],
    "answer": ["RAG combina retrieval com geração...", "Chunking divide documentos..."],
    "contexts": [
        ["RAG é uma técnica que..."],  # lista de chunks recuperados
        ["O chunking divide texto em..."],
    ],
    "ground_truth": [
        "RAG usa retrieval para fundamentar a geração.",
        "Chunking é a divisão do corpus em partes menores.",
    ],
}

dataset = Dataset.from_dict(data)

result = evaluate(
    dataset=dataset,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
)

print(result)
# Output: {'faithfulness': 0.87, 'answer_relevancy': 0.91, ...}`,
    },
    {
      title: 'Geração de test set sintético',
      language: 'python',
      code: `from ragas.testset.generator import TestsetGenerator
from ragas.testset.evolutions import simple, reasoning, multi_context
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import DirectoryLoader

# Carrega documentos do corpus
loader = DirectoryLoader("./docs/", glob="**/*.md")
documents = loader.load()

# Configura o gerador
generator_llm = ChatOpenAI(model="gpt-4o-mini")
critic_llm = ChatOpenAI(model="gpt-4o")  # Critic mais forte que o gerador
embeddings = OpenAIEmbeddings()

generator = TestsetGenerator.from_langchain(
    generator_llm,
    critic_llm,
    embeddings,
)

# Gera 50 perguntas com distribuição de tipos
testset = generator.generate_with_langchain_docs(
    documents,
    test_size=50,
    distributions={simple: 0.5, reasoning: 0.3, multi_context: 0.2},
)

# Exporta para revisar
testset.to_pandas().to_csv("eval_set.csv", index=False)
print("Revise manualmente 10-20 exemplos antes de usar!")`,
    },
    {
      title: 'Gate de qualidade em CI com threshold',
      language: 'python',
      code: `import sys
import json
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import faithfulness, context_precision

THRESHOLDS = {
    "faithfulness": 0.80,
    "context_precision": 0.75,
}

def run_eval_gate(pipeline_fn, eval_set_path: str) -> None:
    """Roda RAGAS e falha o CI se score abaixo do threshold."""

    with open(eval_set_path) as f:
        eval_data = json.load(f)

    # Roda o pipeline em cada pergunta do eval set
    answers = []
    contexts = []
    for item in eval_data:
        result = pipeline_fn(item["question"])
        answers.append(result["answer"])
        contexts.append(result["contexts"])

    dataset = Dataset.from_dict({
        "question": [i["question"] for i in eval_data],
        "answer": answers,
        "contexts": contexts,
    })

    scores = evaluate(dataset=dataset, metrics=[faithfulness, context_precision])

    print("\\n=== RAGAS Eval Results ===")
    failed = False
    for metric, threshold in THRESHOLDS.items():
        score = scores[metric]
        status = "PASS" if score >= threshold else "FAIL"
        print(f"  {metric}: {score:.3f} (threshold: {threshold}) [{status}]")
        if score < threshold:
            failed = True

    if failed:
        print("\\n❌ Quality gate failed — PR blocked")
        sys.exit(1)
    else:
        print("\\n✅ Quality gate passed")`,
    },
    {
      title: 'Integração RAGAS + LangChain',
      language: 'python',
      code: `from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from ragas.integrations.langchain import EvaluatorChain
from ragas.metrics import faithfulness, answer_relevancy

# Configura o pipeline RAG
llm = ChatOpenAI(model="gpt-4o-mini")
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.load_local("./index", embeddings)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
    return_source_documents=True,
)

# Avalia com RAGAS via EvaluatorChain
faith_chain = EvaluatorChain(metric=faithfulness)
relevancy_chain = EvaluatorChain(metric=answer_relevancy)

question = "Quais são os benefícios do hybrid search?"
result = qa_chain(question)

eval_input = {
    "question": question,
    "answer": result["result"],
    "contexts": [doc.page_content for doc in result["source_documents"]],
}

print(f"Faithfulness: {faith_chain(eval_input)['faithfulness']:.3f}")
print(f"Relevancy:    {relevancy_chain(eval_input)['answer_relevancy']:.3f}")`,
    },
  ],
}

export default ragas
