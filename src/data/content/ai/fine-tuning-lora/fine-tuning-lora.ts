import type { SkillContent } from '@/types'

const fineTuningLora: SkillContent = {
  tagline: 'LoRA: ajusta LLMs com 0,1% dos parâmetros, sem retreinar tudo, com custo 100x menor.',
  why: 'Fine-tuning tradicional é caro e pesado. LoRA reduz custo em 100x. Saber quando vale a pena e dominar o pipeline completo (dataset → training → eval → deploy) prova que você vai além de prompt engineering e consome modelos fechados.',
  summary: 'LoRA (Low-Rank Adaptation) congela os pesos do modelo base e treina apenas matrizes de baixa rank inseridas em cada camada de atenção. Resultado: 0,1–1% dos parâmetros são treinados, mas a qualidade chega perto do full fine-tuning. QLoRA estende com quantização 4-bit (NF4), viabilizando ajuste de modelos 70B em uma GPU consumer. A biblioteca PEFT da Hugging Face é a referência de implementação; SFTTrainer (TRL) simplifica o training loop para instruction tuning.',
  keypoints: [
    { title: 'Como funciona LoRA', body: 'Para cada matriz de peso W (d × d), insere delta_W = B · A onde B é d × r e A é r × d, com r pequeno (8–64). Apenas A e B são treinados; W permanece congelado. Na inferência, W_eff = W + (alpha/r) · B · A.' },
    { title: 'Hiperparâmetros críticos: rank r', body: 'r=8 é o padrão. Maior r = mais capacidade de adaptação, mais memória e maior risco de overfit. Para domínio completamente novo: r=32–64. Para ajuste de estilo/formato: r=8 basta.' },
    { title: 'alpha — fator de escala', body: 'Geralmente alpha = 2 × r. Controla o quanto o adapter influencia o output base. alpha/r funciona como learning rate relativo do adapter.' },
    { title: 'target_modules', body: 'Define em quais camadas aplicar LoRA: q_proj, k_proj, v_proj, o_proj (atenção) e gate_proj, up_proj, down_proj (MLP). Incluir todas as projeções de atenção + MLP é o estado da arte.' },
    { title: 'QLoRA', body: 'Quantiza o modelo base em 4-bit NF4 (Normal Float 4) + paged optimizers Adam para evitar OOM. LoRA adapters continuam em bf16/fp16. Permite treinar Llama 70B em uma A100 40GB ou Llama 7B numa RTX 3090 24GB.' },
    { title: 'PEFT e SFTTrainer', body: 'huggingface/peft: get_peft_model() aplica LoRA ao modelo base. trl/SFTTrainer: training loop otimizado para instruction tuning com packing de sequências.' },
    { title: 'Preparação de dataset', body: 'Qualidade > quantidade. 500–2000 exemplos limpos superam 100k de lixo. Formato ChatML ou {instruction, input, output}. Sempre holdout set (10–20%) para avaliação.' },
    { title: 'Avaliação', body: 'Métricas de tarefa (BLEU, ROUGE, accuracy, F1). LLM-as-judge para qualidade subjetiva. Perplexidade no validation set como proxy de overfit.' },
    { title: 'Merge e deploy', body: 'Pós-treino: merge LoRA no base (model.merge_and_unload()) para um único artefato, ou serve adapter separado via vLLM multi-LoRA serving para compartilhar base entre vários adapters.' },
    { title: 'Instruction tuning vs RLHF', body: 'SFT (Supervised Fine-Tuning) com exemplos de instrução + resposta é suficiente para 80% dos casos. DPO (Direct Preference Optimization) adiciona preferências humanas sem o loop de RL do PPO.' },
  ],
  gotchas: [
    'Fine-tunar para dado factual é errado — modelo decora fatos incorretamente. Use RAG para fatos, fine-tuning para estilo/formato.',
    'Dataset ruidoso destrói o modelo. Limpe, deduplique, balanceie classes antes de treinar.',
    'Rank muito alto com dataset pequeno = overfit clássico. Comece com r=8 e meça a perplexidade.',
    'Esquecer o learning rate adequado para LoRA: use 1e-4 a 3e-4, maior que full fine-tuning.',
    'Treinar só q_proj e v_proj subutiliza LoRA. Inclua todas as projeções de atenção e MLP.',
    'Avaliar só pelo loss de treino sem holdout — overfit silencioso. Loss baixa no treino + alta no eval = overfit.',
    'Esperar que LoRA aprenda fatos novos — ele aprende padrão/estilo, não base de conhecimento.',
    'Esquecer de desligar dropout no merge final — deixar dropout ativo causa inconsistência.',
  ],
  interview: [
    {
      level: 'pleno',
      q: 'Quando usar fine-tuning em vez de RAG?',
      a: '<p><strong>RAG</strong> para: conhecimento que muda frequentemente, citação de fonte auditável, escala de documentos grande.</p><p><strong>Fine-tuning</strong> para: estilo de resposta consistente, formato estrito (ex: sempre JSON com 5 campos específicos), terminologia interna, latência baixa (sem retrieval), classificação, tradução especializada.</p><p>Na prática: combine. Fine-tune para estilo + RAG para fatos é o estado da arte.</p>',
      tip: 'Em entrevista: RAG é o ponto de partida. A combinação RAG + fine-tune é o que empresas maduras fazem.',
    },
    {
      level: 'pleno',
      q: 'Por que LoRA em vez de full fine-tuning?',
      a: '<p>Full fine-tuning atualiza todos os 7B–70B parâmetros: precisa de múltiplas A100s, dias de treino, gigabytes de checkpoint.</p><p>LoRA treina 0,1–1% dos parâmetros: checkpoint de 50–200 MB, treina em uma GPU consumer, qualidade fica em 95–99% do full FT na maioria das tarefas.</p><p>O trade-off quase sempre vale — use full FT apenas em casos com dataset enorme e tarefa muito distante do pré-treino.</p>',
      tip: 'Cite os números: 0,1% dos parâmetros, 50–200 MB de checkpoint, 95–99% de qualidade.',
    },
    {
      level: 'pleno',
      q: 'O que é QLoRA e quando usar?',
      a: '<p>QLoRA = LoRA + quantização 4-bit NF4 do modelo base + paged optimizers Adam para evitar OOM em GPUs com memória limitada.</p><p>Permite treinar Llama 70B em uma A100 40 GB ou Llama 7B numa RTX 3090 24 GB.</p><p>Custo de qualidade é pequeno (1–2% em benchmarks). Use QLoRA sempre que a GPU é o gargalo.</p>',
    },
    {
      level: 'pleno',
      q: 'Como preparar o dataset para fine-tuning?',
      a: '<p>Passos:</p><ul><li>Colete exemplos reais (logs de usuário anotados, exemplos criados por especialistas).</li><li>Limpe: remova PII, duplicatas, exemplos malformados, lixo.</li><li>Formate: ChatML <code>[INST] instrução [/INST] resposta</code> ou <code>{instruction, input, output}</code>.</li><li>Split train/val 90/10. Val set é obrigatório para detectar overfit.</li><li>Valide diversidade — amostras homogêneas levam o modelo a decorar.</li></ul><p>Comece com 500–2000 exemplos de alta qualidade. Mais quantidade sem qualidade não ajuda.</p>',
    },
    {
      level: 'pleno',
      q: 'Quais métricas usar para avaliar o fine-tuning?',
      a: '<p>Depende da tarefa:</p><ul><li><strong>Geração de texto</strong>: BLEU, ROUGE-L, perplexidade no val set.</li><li><strong>Classificação</strong>: accuracy, F1, precision, recall.</li><li><strong>Qualidade subjetiva</strong>: LLM-as-judge (ex: GPT-4 avalia de 1–5 num holdout anotado).</li><li><strong>Produção</strong>: A/B test com amostra real de tráfego.</li></ul><p>Loss baixa em treino + alta em eval = overfit. Primeiro sinal de problema.</p>',
    },
    {
      level: 'pleno',
      q: 'O que é instruction tuning?',
      a: '<p>Instruction tuning é o fine-tuning com exemplos no formato instrução + resposta, ensinando o modelo a seguir comandos em linguagem natural.</p><p>É a diferença entre um modelo base (que só completa texto) e um modelo de chat (que responde a perguntas).</p><p>SFTTrainer (TRL) é a implementação padrão: carrega o modelo base, aplica LoRA via PEFT, treina com exemplos formatados em ChatML.</p>',
      tip: 'Mention que ChatML é o formato padrão atual: <|system|>, <|user|>, <|assistant|>.',
    },
    {
      level: 'pleno',
      q: 'Como funciona o merge do adapter LoRA com o modelo base?',
      a: '<p>Após o treino, você tem dois artefatos: modelo base (congelado) + adapter LoRA (pesos A e B por camada).</p><p>Merge: <code>model = model.merge_and_unload()</code> — calcula W_eff = W + (alpha/r) · B · A para cada camada. Resultado: modelo único sem sobrecarga de adapter em runtime.</p><p>Alternativa: multi-LoRA serving com vLLM — base compartilhado na memória, adapters carregados dinamicamente por request. Econômico quando há vários adapters para o mesmo base.</p>',
    },
    {
      level: 'senior',
      q: 'Quais são os principais hiperparâmetros do LoRA e como calibrá-los?',
      a: '<p><strong>r (rank)</strong>: 8 é o padrão. Para domínio novo: 32–64. Para estilo: 8 basta. Mais rank = mais capacidade + mais risco de overfit.</p><p><strong>alpha</strong>: alpha = 2×r como regra geral. Controla o scaling: learning rate efetivo do adapter ≈ lr × (alpha/r).</p><p><strong>target_modules</strong>: mínimo q_proj + v_proj. Melhor: todas as projeções de atenção + gate_proj, up_proj, down_proj do MLP.</p><p><strong>dropout</strong>: 0.05–0.1 para regularizar adapters. Zerar no merge final.</p><p><strong>lr</strong>: 1e-4 a 3e-4 — maior que full FT porque só os adapters mudam.</p>',
      tip: 'A resposta completa com alpha = 2×r e a fórmula de learning rate efetivo diferencia candidatos.',
    },
    {
      level: 'senior',
      q: 'Como funciona o DPO e por que é preferível ao RLHF com PPO?',
      a: '<p>RLHF com PPO requer três modelos simultâneos (política, valor, recompensa) + SFT model como referência. Instável, caro, complexo.</p><p>DPO (Direct Preference Optimization) usa apenas o modelo base e dados de preferência (resposta preferida vs. rejeitada). Otimiza a política diretamente sem treinar um modelo de recompensa separado.</p><p>Loss DPO: minimiza a probabilidade de respostas rejeitadas e maximiza preferidas, com KL-divergência para não sair muito do modelo de referência.</p><p>Em prática: DPO é mais estável, mais barato e frequentemente igual ou melhor que PPO.</p>',
      tip: 'Cite SimPO e ORPO como variantes mais recentes que eliminam até mesmo o modelo de referência.',
    },
    {
      level: 'senior',
      q: 'O que é catastrophic forgetting e como mitigar no fine-tuning?',
      a: '<p>Catastrophic forgetting: durante o fine-tuning, o modelo pode "esquecer" capacidades gerais adquiridas no pré-treino ao se especializar excessivamente no dataset de fine-tuning.</p><p>Mitigações:</p><ul><li><strong>LoRA</strong>: mantém os pesos base congelados — principal vantagem além do custo.</li><li><strong>Replay</strong>: mistura uma fração (5–10%) de dados gerais no dataset de fine-tuning.</li><li><strong>Regularização</strong>: EWC (Elastic Weight Consolidation) penaliza mudanças em pesos importantes.</li><li><strong>Dataset balanceado</strong>: não treine só na tarefa nova.</li></ul>',
      tip: 'LoRA ser resistente ao catastrophic forgetting por natureza (pesos base congelados) é o argumento mais forte.',
    },
    {
      level: 'senior',
      q: 'Como escolher o modelo base para fine-tuning?',
      a: '<p>Critérios:</p><ul><li><strong>Tamanho</strong>: modelo maior nem sempre é melhor pós-fine-tuning para tarefa específica. Llama 3.1 8B fine-tuned supera GPT-3.5 em tarefas estreitas.</li><li><strong>Licença</strong>: Llama 3 (Meta), Mistral, Qwen (Alibaba) — verificar uso comercial.</li><li><strong>Tokenizer e idioma</strong>: modelos com boa cobertura de tokens para o idioma alvo.</li><li><strong>Arquitetura</strong>: prefer modelos com boas avaliações em Open LLM Leaderboard na tarefa alvo.</li><li><strong>Infraestrutura</strong>: cabe no hardware disponível? Use QLoRA para modelos maiores.</li></ul>',
    },
    {
      level: 'senior',
      q: 'Como estruturar o pipeline de fine-tuning em produção?',
      a: '<p>Pipeline:</p><ol><li>Dataset versionado (DVC ou HF Hub) com hash + metadata.</li><li>Data validation: schema, distribuição de comprimentos, proporções de classe.</li><li>Fine-tuning com tracking de experimentos (MLflow, W&B).</li><li>Eval automático no val set antes de qualquer promoção.</li><li>Gate de qualidade: BLEU/F1/LLM-judge mínimo para promover para staging.</li><li>A/B test em produção com shadowing ou % de tráfego.</li><li>Monitoramento pós-deploy: distribuição de respostas, latência, feedback humano.</li></ol>',
      tip: 'Gate de qualidade no CI/CD é o que separa fine-tuning amador de produção real.',
    },
    {
      level: 'senior',
      q: 'Como usar a biblioteca PEFT para aplicar LoRA com QLoRA?',
      a: '<code><pre>from transformers import AutoModelForCausalLM, BitsAndBytesConfig\nfrom peft import LoraConfig, get_peft_model, TaskType\n\nbnb_config = BitsAndBytesConfig(\n    load_in_4bit=True,\n    bnb_4bit_quant_type="nf4",\n    bnb_4bit_compute_dtype="bfloat16",\n)\nmodel = AutoModelForCausalLM.from_pretrained(\n    "meta-llama/Meta-Llama-3.1-8B",\n    quantization_config=bnb_config,\n    device_map="auto",\n)\nlora_config = LoraConfig(\n    r=16, lora_alpha=32,\n    target_modules=["q_proj","k_proj","v_proj","o_proj"],\n    lora_dropout=0.05,\n    task_type=TaskType.CAUSAL_LM,\n)\nmodel = get_peft_model(model, lora_config)\nmodel.print_trainable_parameters()\n# trainable params: 13,631,488 || all params: 8,043,438,080 || trainable%: 0.17</pre></code>',
      tip: 'print_trainable_parameters() é o comando de sanidade — sempre rode para confirmar que LoRA foi aplicado corretamente.',
    },
    {
      level: 'senior',
      q: 'O que é SFTTrainer e como usar com LoRA?',
      a: '<p>SFTTrainer (trl) é um training loop otimizado para instruction tuning. Recursos principais:</p><ul><li><strong>Packing</strong>: empacota múltiplos exemplos curtos em uma sequência para maximizar utilização de GPU.</li><li><strong>Formatting</strong>: aplica chat template automaticamente.</li><li><strong>Gradient checkpointing</strong>: reduz memória durante backprop.</li></ul><p>SFTTrainer aceita o modelo já com LoRA aplicado via PEFT. Combina com <code>DataCollatorForSeq2Seq</code> para masking correto dos tokens de instrução.</p>',
    },
    {
      level: 'senior',
      q: 'Como avaliar com LLM-as-judge e quando usar?',
      a: '<p>LLM-as-judge: usa um modelo forte (GPT-4o, Claude 3.5 Sonnet) para avaliar outputs em critérios que métricas automáticas não capturam: coerência, tom, correção factual subjetiva.</p><p>Framework:</p><ol><li>Crie rubrica (1–5 por critério: precisão, tom, estrutura).</li><li>Crie holdout set de 100–200 exemplos com resposta esperada.</li><li>Prompt o juiz com: query + resposta esperada + resposta gerada.</li><li>Média dos scores é a métrica de qualidade.</li></ol><p>Quando usar: tarefas abertas (geração de texto, resumo, reescrita) onde BLEU/ROUGE são insuficientes.</p>',
      tip: 'Use múltiplos juízes com shuffling de ordem para mitigar position bias do LLM-as-judge.',
    },
    {
      level: 'senior',
      q: 'Como funciona o multi-LoRA serving com vLLM?',
      a: '<p>vLLM suporta múltiplos adapters LoRA para o mesmo modelo base em memória. Por request, carrega o adapter correspondente dinamicamente.</p><p>Vantagens: o modelo base (ex: Llama 70B) fica em GPU uma vez; cada adapter é ~50–200 MB, logo dezenas de adapters cabem. Custo muito menor que ter N instâncias completas.</p><p>Configuração: <code>--enable-lora --max-loras 8 --lora-modules cliente_a=./adapter_a cliente_b=./adapter_b</code>.</p><p>Caso de uso ideal: plataforma multi-tenant onde cada cliente tem um adapter personalizado.</p>',
    },
    {
      level: 'senior',
      q: 'Quando LoRA não é suficiente e o que fazer?',
      a: '<p>Situações em que LoRA pode ser insuficiente:</p><ul><li><strong>Tarefa muito distante do pré-treino</strong>: domínio científico extremamente especializado — pode precisar de continual pre-training antes do LoRA.</li><li><strong>Exige mudança de comportamento fundamental</strong>: safe RLHF profundo requer PPO ou DPO com RLHF real.</li><li><strong>Dataset enorme (1M+ exemplos)</strong>: full fine-tuning pode justificar com hardware adequado.</li></ul><p>Alternativas: DoRA (Weight-Decomposed LoRA), IA3, prefix tuning — cada uma com trade-offs de capacidade vs. custo.</p>',
    },
    {
      level: 'pleno',
      q: 'O que é continual pre-training e diferença de instruction tuning?',
      a: '<p><strong>Continual pre-training</strong>: treina o modelo em textos brutos de um domínio (ex: artigos médicos, código de linguagem rara) para injetar conhecimento. Precede o instruction tuning.</p><p><strong>Instruction tuning (SFT)</strong>: ajusta o modelo para seguir instruções em formato pergunta-resposta. Pressupõe que o conhecimento já está no modelo.</p><p>Ordem correta: pré-treino contínuo no domínio → SFT com exemplos de instrução → DPO com preferências → deploy.</p>',
      tip: 'A distinção entre as fases (pré-treino → SFT → RLHF) é fundamental para demonstrar profundidade em MLOps de LLMs.',
    },
    {
      level: 'pleno',
      q: 'Quais são os formatos padrão de dataset para instruction tuning?',
      a: '<p><strong>ChatML</strong> (padrão atual):</p><pre><code>&lt;|system|&gt;Você é assistente.&lt;|end|&gt;\n&lt;|user|&gt;Explique LoRA.&lt;|end|&gt;\n&lt;|assistant|&gt;LoRA é...&lt;|end|&gt;</code></pre><p><strong>Alpaca format</strong> (legado):</p><pre><code>{"instruction": "...", "input": "...", "output": "..."}</code></pre><p>O chat template é aplicado pelo tokenizer (<code>apply_chat_template()</code>) — use o template correto do modelo base.</p>',
    },
    {
      level: 'senior',
      q: 'Como detectar e corrigir overfit em fine-tuning com LoRA?',
      a: '<p>Sinais de overfit:</p><ul><li>Train loss cai, val loss sobe (ou estagna).</li><li>Perplexidade no val set aumenta após certo epoch.</li><li>Modelo repete frases do dataset de treino literalmente.</li></ul><p>Correções:</p><ul><li>Reduzir rank r (menos capacidade).</li><li>Aumentar lora_dropout (regularização).</li><li>Reduzir número de epochs (early stopping).</li><li>Aumentar e diversificar dataset.</li><li>Adicionar replay de dados gerais (5–10%).</li></ul>',
      tip: 'Early stopping baseado na val loss é o mecanismo mais eficaz e subestimado.',
    },
    {
      level: 'senior',
      q: 'Como usar Unsloth para acelerar fine-tuning LoRA?',
      a: '<p>Unsloth reimplementa os kernels de LoRA em Triton otimizado: 2–5× mais rápido que PEFT vanilla e usa 30–50% menos memória de GPU.</p><p>Drop-in replacement: <code>from unsloth import FastLanguageModel</code> em vez de transformers + peft. API idêntica ao PEFT.</p><p>Suporta Llama 3, Mistral, Phi, Gemma. Free para uso local. Versão comercial (Unsloth Pro) com mais otimizações.</p><p>Quando usar: budget limitado de GPU, iterações rápidas de experimento.</p>',
    },
  ],
  diagrams: [
    {
      title: 'LoRA — Decomposição de Matrizes',
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
  <p style="font-size:12px;color:#94a3b8;text-align:center;margin-bottom:16px">W (congelado) + delta_W treinável = peso efetivo na inferência</p>
  <div style="display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap">
    <div style="text-align:center">
      <div style="width:80px;height:80px;border:2px solid #334155;background:#1e293b;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;color:#94a3b8">W<br/><span style="font-size:10px">d × d<br/>congelado</span></div>
    </div>
    <div style="font-size:20px;color:#f59e0b">+</div>
    <div style="text-align:center">
      <div style="font-size:11px;color:#94a3b8;margin-bottom:4px">delta_W = B · A</div>
      <div style="display:flex;gap:8px;align-items:center">
        <div style="width:40px;height:80px;border:2px solid #f59e0b;background:#f59e0b15;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#f59e0b">B<br/>d×r</div>
        <div style="font-size:14px;color:#f59e0b">·</div>
        <div style="width:80px;height:40px;border:2px solid #f59e0b;background:#f59e0b15;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#f59e0b">A — r×d</div>
      </div>
      <div style="font-size:10px;color:#f59e0b;margin-top:4px">r=8 → só 0,1% params</div>
    </div>
    <div style="font-size:20px;color:#94a3b8">=</div>
    <div style="text-align:center">
      <div style="width:80px;height:80px;border:2px solid #22c55e;background:#22c55e15;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;color:#22c55e">W_eff<br/><span style="font-size:10px">d × d<br/>inferência</span></div>
    </div>
  </div>
  <div style="margin-top:16px;padding:10px 14px;background:#1e293b;border:1px solid #334155;border-radius:8px;font-size:11px;color:#94a3b8">
    <strong style="color:#e2e8f0">Fórmula:</strong> W_eff = W + (alpha/r) · B · A — alpha controla o scaling do adapter. alpha=2r é o padrão.
  </div>
</div>`,
    },
    {
      title: 'Pipeline de Fine-tuning com LoRA',
      html: `<div style="font-family:sans-serif;max-width:700px;margin:0 auto">
  <div style="display:flex;flex-direction:column;gap:8px">
    ${[
      { step: '1', label: 'Base Model', sub: 'Llama 3.1 8B / Mistral 7B', color: '#60a5fa' },
      { step: '2', label: 'Quantização QLoRA (opcional)', sub: 'BitsAndBytesConfig · NF4 4-bit', color: '#a78bfa' },
      { step: '3', label: 'Aplicar LoRA via PEFT', sub: 'LoraConfig · r=16 · target_modules · get_peft_model()', color: '#f59e0b' },
      { step: '4', label: 'Dataset e Tokenização', sub: 'ChatML format · apply_chat_template() · packing', color: '#38bdf8' },
      { step: '5', label: 'SFTTrainer (trl)', sub: 'Training loop · gradient checkpointing · val loss monitor', color: '#22c55e' },
      { step: '6', label: 'Avaliação', sub: 'BLEU / ROUGE / LLM-as-judge · val set · perplexidade', color: '#f97316' },
      { step: '7', label: 'Merge e Deploy', sub: 'merge_and_unload() → artefato único · ou vLLM multi-LoRA', color: '#ef4444' },
    ].map(s => `<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:#1e293b;border:1px solid ${s.color}30;border-radius:8px">
      <div style="width:24px;height:24px;border-radius:50%;background:${s.color}20;border:2px solid ${s.color};display:flex;align-items:center;justify-content:center;font-size:11px;color:${s.color};font-weight:700;flex-shrink:0">${s.step}</div>
      <div style="flex:1"><div style="font-size:13px;color:#e2e8f0;font-weight:600">${s.label}</div><div style="font-size:11px;color:#94a3b8">${s.sub}</div></div>
    </div>`).join('<div style="text-align:center;font-size:14px;color:#334155">↓</div>')}
  </div>
</div>`,
    },
    {
      title: 'LoRA vs Full Fine-tuning vs QLoRA',
      html: `<div style="font-family:sans-serif;max-width:700px;margin:0 auto">
  <table style="width:100%;border-collapse:collapse;font-size:12px">
    <thead>
      <tr>
        <th style="text-align:left;padding:8px 12px;color:#94a3b8;border-bottom:1px solid #334155">Critério</th>
        <th style="text-align:center;padding:8px 12px;color:#60a5fa;border-bottom:1px solid #334155">Full FT</th>
        <th style="text-align:center;padding:8px 12px;color:#f59e0b;border-bottom:1px solid #334155">LoRA</th>
        <th style="text-align:center;padding:8px 12px;color:#a78bfa;border-bottom:1px solid #334155">QLoRA</th>
      </tr>
    </thead>
    <tbody>
      ${[
        ['Parâmetros treinados', '100%', '0,1–1%', '0,1–1%'],
        ['GPU para 7B', '4× A100 80GB', '1× A100 40GB', '1× RTX 3090 24GB'],
        ['GPU para 70B', 'cluster', '4× A100 80GB', '1× A100 40GB'],
        ['Checkpoint size', '14–140 GB', '50–200 MB', '50–200 MB'],
        ['Tempo treino (7B)', 'dias', 'horas', 'horas (1,5× mais)'],
        ['Qualidade relativa', '100%', '95–99%', '93–97%'],
        ['Catastrophic forgetting', 'Alto', 'Baixo (base congelado)', 'Baixo'],
      ].map((row, i) => `<tr style="background:${i % 2 === 0 ? '#1e293b' : 'transparent'}">
        <td style="padding:8px 12px;color:#e2e8f0">${row[0]}</td>
        <td style="padding:8px 12px;color:#60a5fa;text-align:center">${row[1]}</td>
        <td style="padding:8px 12px;color:#f59e0b;text-align:center">${row[2]}</td>
        <td style="padding:8px 12px;color:#a78bfa;text-align:center">${row[3]}</td>
      </tr>`).join('')}
    </tbody>
  </table>
</div>`,
    },
  ],
  mnemonics: [
    {
      label: 'Hiperparâmetros LoRA',
      trick: 'RATO',
      explanation: 'RATO cobre os 4 hiperparâmetros que definem 90% do comportamento do LoRA.',
    },
    {
      label: 'Pipeline de fine-tuning',
      trick: 'DAFED',
      explanation: 'DAFED cobre o pipeline completo de fine-tuning de ponta a ponta.',
    },
    {
      label: 'Quando não usar fine-tuning',
      trick: 'FEF',
      explanation: 'FEF ajuda a evitar os três erros mais comuns de aplicação de fine-tuning.',
    },
  ],
  cheatsheet: {
    title: 'Fine-tuning com LoRA — Referência Rápida',
    html: `<div style="font-family:sans-serif;font-size:12px;max-width:800px">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div>
      <h4 style="color:#f59e0b;margin:0 0 8px">Hiperparâmetros LoRA</h4>
      <div style="display:flex;flex-direction:column;gap:4px">
        ${[
          ['r (rank)', '8 padrão · 32+ domínio novo'],
          ['alpha', '2×r — regra geral'],
          ['target_modules', 'q/k/v/o_proj + MLP (gate/up/down)'],
          ['lora_dropout', '0.05–0.1'],
          ['learning rate', '1e-4 a 3e-4'],
          ['epochs', '1–3 (early stopping por val loss)'],
        ].map(([k, v]) => `<div style="display:flex;justify-content:space-between;padding:4px 8px;background:#1e293b;border-radius:4px"><span style="color:#94a3b8">${k}</span><span style="color:#e2e8f0">${v}</span></div>`).join('')}
      </div>
    </div>
    <div>
      <h4 style="color:#a78bfa;margin:0 0 8px">QLoRA config</h4>
      <pre style="font-size:10px;background:#1e293b;padding:10px;border-radius:6px;color:#e2e8f0;overflow:auto">BitsAndBytesConfig(
  load_in_4bit=True,
  bnb_4bit_quant_type="nf4",
  bnb_4bit_compute_dtype="bfloat16"
)</pre>
    </div>
    <div>
      <h4 style="color:#22c55e;margin:0 0 8px">Regras de ouro</h4>
      <div style="display:flex;flex-direction:column;gap:4px">
        ${[
          ['✗', '#ef4444', 'Fine-tune para injetar fatos → use RAG'],
          ['✗', '#ef4444', 'Dataset ruídoso → limpe antes de treinar'],
          ['✗', '#ef4444', 'Avaliar só pelo train loss → overfit oculto'],
          ['✓', '#22c55e', 'Holdout set 10–20% sempre'],
          ['✓', '#22c55e', 'Early stopping por val loss'],
          ['✓', '#22c55e', 'LLM-as-judge para qualidade subjetiva'],
        ].map(([sym, c, t]) => `<div style="display:flex;gap:8px;padding:4px 8px;background:#1e293b;border-radius:4px"><span style="color:${c};font-weight:700">${sym}</span><span style="color:#e2e8f0">${t}</span></div>`).join('')}
      </div>
    </div>
    <div>
      <h4 style="color:#38bdf8;margin:0 0 8px">Ferramentas essenciais</h4>
      <div style="display:flex;flex-direction:column;gap:4px">
        ${[
          ['PEFT', 'huggingface/peft — LoraConfig + get_peft_model()'],
          ['TRL', 'SFTTrainer, DPOTrainer, PPOTrainer'],
          ['bitsandbytes', 'Quantização 4-bit para QLoRA'],
          ['Unsloth', '2–5× mais rápido, 50% menos VRAM'],
          ['vLLM', 'Multi-LoRA serving em produção'],
          ['W&B / MLflow', 'Tracking de experimentos'],
        ].map(([k, v]) => `<div style="display:flex;gap:8px;padding:4px 8px;background:#1e293b;border-radius:4px"><span style="color:#38bdf8;min-width:80px">${k}</span><span style="color:#94a3b8">${v}</span></div>`).join('')}
      </div>
    </div>
  </div>
</div>`,
  },
  mindmap: {
    title: 'Fine-tuning com LoRA — Mapa Mental',
    html: `<div style="font-family:sans-serif;max-width:700px;margin:0 auto">
  <div style="text-align:center;margin-bottom:16px">
    <div style="display:inline-block;padding:10px 20px;background:#f59e0b20;border:2px solid #f59e0b;border-radius:8px;font-size:14px;font-weight:700;color:#f59e0b">Fine-tuning com LoRA</div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    ${[
      { label: 'Algoritmo LoRA', color: '#f59e0b', items: ['delta_W = (alpha/r)·B·A', 'W base congelado', 'r=8 padrão, r=32+ domínio novo', 'Checkpoint 50–200 MB', 'Merge: merge_and_unload()'] },
      { label: 'QLoRA', color: '#a78bfa', items: ['NF4 4-bit quantização', 'Paged AdamW optimizer', '70B em 1× A100 40GB', '7B em 1× RTX 3090', '1–2% perda de qualidade'] },
      { label: 'Pipeline', color: '#22c55e', items: ['Dataset → limpo, ChatML', 'PEFT + LoraConfig', 'SFTTrainer + packing', 'Val loss early stopping', 'Eval → Deploy'] },
      { label: 'Alignment', color: '#38bdf8', items: ['SFT: instruction tuning', 'DPO: preferências', 'RLHF/PPO: recompensa', 'SimPO/ORPO: sem ref model', 'Constitutional AI'] },
      { label: 'Avaliação', color: '#f97316', items: ['BLEU, ROUGE, perplexidade', 'LLM-as-judge (holdout)', 'Val loss monitor', 'A/B test em produção', 'LangSmith / W&B tracking'] },
      { label: 'Ferramentas', color: '#60a5fa', items: ['PEFT (Hugging Face)', 'TRL (SFTTrainer, DPO)', 'bitsandbytes (QLoRA)', 'Unsloth (2–5× rápido)', 'vLLM multi-LoRA serving'] },
    ].map(cat => `<div style="padding:12px;background:#1e293b;border:1px solid ${cat.color}30;border-radius:8px">
      <div style="font-size:11px;font-weight:700;color:${cat.color};margin-bottom:8px">${cat.label}</div>
      <div style="display:flex;flex-direction:column;gap:3px">${cat.items.map(i => `<div style="font-size:11px;color:#94a3b8;padding-left:8px;border-left:2px solid ${cat.color}40">${i}</div>`).join('')}</div>
    </div>`).join('')}
  </div>
</div>`,
  },
  exercises: [
    {
      level: 'iniciante',
      title: 'Fine-tuning LoRA básico com PEFT',
      description: 'Configure e execute um fine-tuning LoRA simples de um modelo de linguagem. Use o dataset Alpaca (ou subset) para instruction tuning.',
      concepts: ['LoRA', 'PEFT', 'SFTTrainer', 'instruction tuning'],
      hint: 'Instale: pip install transformers peft trl bitsandbytes datasets.',
    },
    {
      level: 'intermediario',
      title: 'QLoRA com Llama 3 e avaliação com LLM-as-judge',
      description: 'Faça fine-tuning QLoRA de Llama 3.1 8B-Instruct em um dataset de domínio específico (ex: Q&A jurídico, código Python). Avalie com LLM-as-judge usando GPT-4o-mini.',
      concepts: ['QLoRA', 'BitsAndBytesConfig', 'LLM-as-judge', 'holdout set'],
      hint: 'Configure BitsAndBytesConfig para NF4 4-bit. Crie holdout set de 50–100 exemplos. Monte prompt de juiz: rubrica 1–5, compare com baseline.',
    },
    {
      level: 'senior',
      title: 'Pipeline de fine-tuning com DPO e tracking',
      description: 'Implemente pipeline completo: SFT → DPO com dados de preferência. Rastreie experimentos com W&B. Faça deploy do adapter via vLLM multi-LoRA.',
      concepts: ['DPO', 'SFT', 'W&B experiment tracking', 'vLLM multi-LoRA', 'preference data'],
      hint: 'SFT primeiro com SFTTrainer. Salve o checkpoint do modelo SFT.',
    },
  ],
  videos: [
    { title: 'Fine-Tuning LLMs with LoRA in Practice', channel: 'Andrej Karpathy', url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g' },
    { title: 'QLoRA: Fine-Tune LLMs on Your GPU', channel: 'Hugging Face', url: 'https://www.youtube.com/watch?v=Us5ZFp16PaU' },
    { title: 'DPO: Fine-Tuning Without RL', channel: 'Sebastian Raschka', url: 'https://www.youtube.com/watch?v=vAMPaSWAy7c' },
    { title: 'LoRA Explained — Low-Rank Adaptation of LLMs', channel: 'Yannic Kilcher', url: 'https://www.youtube.com/watch?v=dA-NhCtrrVE' },
    { title: 'Practical LLM Fine-Tuning (Full Course)', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=iERiSPLEp6k' },
  ],
  resources: [
    { title: 'LoRA paper (Hu et al., 2021)', url: 'https://arxiv.org/abs/2106.09685', kind: 'artigo' },
    { title: 'QLoRA paper (Dettmers, 2023)', url: 'https://arxiv.org/abs/2305.14314', kind: 'artigo' },
    { title: 'DPO paper (Rafailov, 2023)', url: 'https://arxiv.org/abs/2305.18290', kind: 'artigo' },
    { title: 'Hugging Face PEFT docs', url: 'https://huggingface.co/docs/peft/', kind: 'docs' },
    { title: 'TRL docs (SFTTrainer, DPOTrainer)', url: 'https://huggingface.co/docs/trl/', kind: 'docs' },
    { title: 'Sebastian Raschka — Practical Tips for Fine-tuning LLMs', url: 'https://magazine.sebastianraschka.com/p/practical-tips-for-finetuning-llms', kind: 'artigo' },
    { title: 'Unsloth — LoRA 2–5× mais rápido', url: 'https://docs.unsloth.ai/', kind: 'docs' },
    { title: 'vLLM — multi-LoRA serving docs', url: 'https://docs.vllm.ai/en/latest/models/lora.html', kind: 'docs' },
  ],
  codeExamples: [
    {
      title: 'LoRA com QLoRA — setup completo',
      language: 'python',
      code: `from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, TaskType

# QLoRA: quantiza o base em 4-bit NF4
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype="bfloat16",
    bnb_4bit_use_double_quant=True,
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Meta-Llama-3.1-8B",
    quantization_config=bnb_config,
    device_map="auto",
)
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3.1-8B")
tokenizer.pad_token = tokenizer.eos_token

# Aplica LoRA
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj","k_proj","v_proj","o_proj","gate_proj","up_proj","down_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type=TaskType.CAUSAL_LM,
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# trainable params: 20,185,088 || all params: 8,053,374,976 || trainable%: 0.25`,
    },
    {
      title: 'SFTTrainer — instruction tuning',
      language: 'python',
      code: `from trl import SFTTrainer, SFTConfig
from datasets import load_dataset

dataset = load_dataset("json", data_files="data.jsonl")

def format_example(example):
    return {
        "text": f"""<|system|>Você é assistente especializado.<|end|>
<|user|>{example['instruction']}<|end|>
<|assistant|>{example['output']}<|end|>"""
    }

dataset = dataset.map(format_example)

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset["train"],
    eval_dataset=dataset["validation"],
    args=SFTConfig(
        output_dir="./output",
        num_train_epochs=3,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        evaluation_strategy="steps",
        eval_steps=100,
        save_strategy="best",
        load_best_model_at_end=True,       # early stopping por val loss
        bf16=True,
        gradient_checkpointing=True,
        packing=True,                       # empacota sequências curtas
    ),
)
trainer.train()`,
    },
    {
      title: 'Merge do adapter e deploy com vLLM',
      language: 'python',
      code: `from peft import PeftModel
from transformers import AutoModelForCausalLM

# Merge LoRA no base — cria artefato único
base = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Meta-Llama-3.1-8B",
    torch_dtype="bfloat16",
    device_map="cpu",  # merge em CPU evita OOM
)
model = PeftModel.from_pretrained(base, "./output/checkpoint-best")
model = model.merge_and_unload()
model.save_pretrained("./merged_model")

# Deploy com vLLM (multi-LoRA sem merge):
# vllm serve meta-llama/Meta-Llama-3.1-8B \\
#   --enable-lora \\
#   --max-loras 4 \\
#   --lora-modules adapter_a=./adapter_a adapter_b=./adapter_b
#
# Request com adapter específico:
# {"model": "adapter_a", "messages": [...]}`,
    },
    {
      title: 'DPO — treinamento com preferências',
      language: 'python',
      code: `from trl import DPOTrainer, DPOConfig
from datasets import Dataset

# Formato DPO: prompt + resposta preferida + rejeitada
dpo_dataset = Dataset.from_list([
    {
        "prompt": "Explique LoRA em 1 linha.",
        "chosen": "LoRA treina matrizes de baixa rank inseridas no modelo, mantendo os pesos base congelados.",
        "rejected": "LoRA é uma técnica de fine-tuning para modelos de linguagem.",
    },
    # ... mais exemplos
])

dpo_trainer = DPOTrainer(
    model=model,        # modelo SFT (já fine-tunado)
    ref_model=None,     # None = usa o próprio model como referência (mais eficiente)
    args=DPOConfig(
        output_dir="./dpo_output",
        num_train_epochs=1,
        per_device_train_batch_size=2,
        learning_rate=5e-5,
        beta=0.1,       # KL penalty — controla afastamento do ref model
        bf16=True,
    ),
    train_dataset=dpo_dataset,
    tokenizer=tokenizer,
)
dpo_trainer.train()`,
    },
  ],
}

export default fineTuningLora
