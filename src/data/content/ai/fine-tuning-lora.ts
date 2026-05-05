import type { SkillContent } from '@/types'

const fineTuningLora: SkillContent = {
    tagline: 'LoRA: ajusta LLM com poucos parametros, sem retreinar tudo, com baixo custo.',
    why: 'Fine-tuning tradicional é caro e pesado. LoRA reduz custo em 100x. Saber quando vale a pena e pipeline (dataset -> training -> eval) é prova de que você não só usa modelo fechado.',
    summary: 'LoRA (Low-Rank Adaptation) congela os pesos do modelo base e treina apenas matrizes de baixa rank inseridas em cada camada de atencao. Resultado: 0.1-1% dos parametros são treinados, mas qualidade chega perto do full fine-tuning. QLoRA estende com quantizacao 4-bit, viabilizando ajuste de modelos 70B em uma GPU consumer.',
    keypoints: [
      { title: 'Como funciona', body: 'Pra cada matriz W (d x d), adiciona delta_W = B*A onde B (d x r) e A (r x d) com r pequeno (8-64). Treina só A e B; W congelado.' },
      { title: 'rank (r)', body: 'r=8 padrão. Maior r = mais capacidade, mais memória. Pra domínio novo r=32+; pra estilo r=8 basta.' },
      { title: 'alpha', body: 'Scaling factor. Geralmente alpha = 2*r. Controla quao forte o adapter influencia o output base.' },
      { title: 'target_modules', body: 'Em quais camadas aplicar (q_proj, k_proj, v_proj, o_proj). Mais camadas = melhor mas mais memória.' },
      { title: 'QLoRA', body: 'Quantiza modelo base em 4-bit (NF4) + LoRA adapters em fp16. Treina Llama 70B em uma A100 40GB.' },
      { title: 'Dataset', body: 'Qualidade > quantidade. 1000 exemplos limpos batem 100k de lixo. Format: {instruction, input, output} ou ChatML.' },
      { title: 'Avaliacao', body: 'Holdout set + metricas de tarefa (BLEU, ROUGE, accuracy). Sem isso você overfit em treino e não percebe.' },
      { title: 'Merge e deploy', body: 'Pos-treino, merge LoRA no base ou serve adapter separado (multi-LoRA serving via vLLM).' },
    ],
    gotchas: [
      'Fine-tunar pra dado factual é ruim — modelo decora errado. Use RAG pra fatos, fine-tuning pra estilo/formato.',
      'Dataset ruidoso destroi modelo. Limpe, deduplique, balanceie.',
      'rank muito alto = overfitting. Comece com r=8 e meca.',
      'Esquecer learning rate adequado pra LoRA (geralmente 1e-4 a 3e-4, maior que full FT).',
      'Treinar só q_proj e v_proj subutiliza LoRA. Inclua todas as projeções da atenção.',
      'Avaliar só em loss de treino — sempre tem holdout. Loss baixa em treino + alta em eval = overfit.',
      'Esperar que LoRA aprenda fatos novos — ele aprende padrão/estilo, não base de conhecimento.',
    ],
    interview: [
      { q: 'Quando fine-tuning vs RAG?', a: '<p><strong>RAG</strong> pra: conhecimento que muda, citacao de fonte, escala de docs.</p><p><strong>Fine-tuning</strong> pra: estilo de resposta, formato estrito (ex: sempre JSON com 5 campos), terminologia interna, latência baixa, classificacao, traducao.</p><p>Combina-los é comum: fine-tune pra estilo + RAG pra fatos.</p>' },
      { q: 'Por que LoRA ao inves de full fine-tuning?', a: '<p>Full FT atualiza todos os 7B-70B parametros: precisa de A100s, dias de treino, gigabytes de checkpoint. LoRA atualiza 0.1-1% (10M-100M params): treina em uma GPU consumer, checkpoint de 50-200MB.</p><p>Qualidade fica em 95-99% do full FT em maioria das tarefas. Trade-off vale.</p>' },
      { q: 'O que é QLoRA e quando usar?', a: '<p>QLoRA = LoRA + quantizacao 4-bit (NF4) do modelo base + paged optimizers. Permite treinar Llama 70B em uma A100 40GB ou Llama 7B numa RTX 3090 24GB.</p><p>Custo de qualidade é pequeno (1-2% em benchmarks). Use sempre que GPU é restrita.</p>' },
      { q: 'Como prepara dataset pra fine-tuning?', a: '<p>Passos:</p><ul><li>Coleta exemplos reais (logs, anotados).</li><li>Limpa: remove PII, duplicatas, lixo.</li><li>Formato: ChatML ou {instruction, input, output}.</li><li>Train/val split (ex: 90/10).</li><li>Válida diversidade — evita modelo decorar.</li></ul><p>Comece com 500-2000 exemplos de qualidade. Mais sem qualidade não ajuda.</p>' },
      { q: 'Como avalia se fine-tuning melhorou?', a: '<p>Holdout set anotado de 100-500 exemplos. Roda modelo base e modelo fine-tuned, compara metricas:</p><ul><li>Tarefa-específica (accuracy, F1).</li><li>LLM-as-judge pra qualidade subjetiva.</li><li>A/B teste em produção com sample real.</li></ul><p>Se não melhorou, problema é dataset ou hiperparametro, não LoRA.</p>' },
    ],
    resources: [
      { title: 'LoRA paper (Hu et al, 2021)', url: 'https://arxiv.org/abs/2106.09685', kind: 'artigo' },
      { title: 'QLoRA paper (Dettmers, 2023)', url: 'https://arxiv.org/abs/2305.14314', kind: 'artigo' },
      { title: 'Hugging Face PEFT docs', url: 'https://huggingface.co/docs/peft/', kind: 'docs' },
      { title: 'Sebastian Raschka — LoRA insights', url: 'https://magazine.sebastianraschka.com/p/practical-tips-for-finetuning-llms', kind: 'artigo' },
      { title: 'Unsloth docs (LoRA fast)', url: 'https://docs.unsloth.ai/', kind: 'docs' },
    ],
  }

export default fineTuningLora
