import type { SkillContent } from '@/types'

const huggingFace: SkillContent = {
  tagline: 'O GitHub da AI: hub de 1M+ modelos, transformers, datasets, PEFT, TRL, Spaces e Inference Endpoints.',
  why: 'HF é a plataforma central de AI open-source. Saber transformers, Hub, AutoModel/AutoTokenizer, pipeline API, PEFT, TRL, accelerate, Inference Endpoints e Spaces é essencial para qualquer AI engineer que vai além de APIs proprietárias.',
  summary: 'Hugging Face oferece: Hub (1M+ modelos, 200k datasets, versionados como repos Git), libs (transformers, datasets, accelerate, PEFT, TRL, diffusers), Inference Endpoints (deploy gerenciado em GPU com autoscaling), Spaces (apps Gradio/Streamlit hospedados), AutoTrain (fine-tuning no-code). É o padrão da indústria para trabalhar com modelos open-weights (Llama, Mistral, Qwen, DeepSeek, Gemma).',
  keypoints: [
    { title: 'Hub', body: 'Modelos versionados como repos Git (com LFS para pesos). Model cards (README com metadados, license, eval results, tags). Pull via from_pretrained("org/model") sem configuração extra.' },
    { title: 'transformers — core lib', body: 'AutoModel, AutoTokenizer, pipeline() API. Suporta PyTorch, TensorFlow, JAX. Trainer para fine-tuning completo. apply_chat_template() para modelos de chat.' },
    { title: 'datasets', body: 'Carrega e processa datasets. Streaming para datasets enormes sem estourar disco. Map, filter, shuffle, batched operations. Cache local inteligente.' },
    { title: 'PEFT — fine-tuning eficiente', body: 'LoRA, QLoRA, Prefix Tuning, IA3, DoRA. Plugin do transformers para fine-tuning com 0,1–1% dos parâmetros. Padrão da indústria para adapters.' },
    { title: 'TRL — alignment', body: 'SFTTrainer para instruction tuning, DPOTrainer para preferências, PPOTrainer para RLHF. Construído sobre transformers + PEFT.' },
    { title: 'accelerate', body: 'Abstrai multi-GPU, mixed precision (bf16/fp16), FSDP, DeepSpeed. Mesmo código roda em single GPU ou cluster de 1000 GPUs sem alteração.' },
    { title: 'Inference Endpoints', body: 'Deploy gerenciado de qualquer modelo do Hub em GPU dedicada. Auto-scaling, latência previsível, SLA. Cobra por hora GPU ativo — desligar quando não usa.' },
    { title: 'Spaces', body: 'Apps web Gradio ou Streamlit hospedados gratuitamente (CPU) ou em GPU paga. Ideal para demos, protótipos, A/B test público. Fácil de compartilhar.' },
    { title: 'Tokenizers', body: 'BPE, WordPiece, SentencePiece. Fast tokenizers (Rust) para throughput alto. Nunca misture tokenizer e modelo de versões diferentes — quebra silenciosamente.' },
    { title: 'Pipeline API', body: 'Alto nível: pipeline("text-generation", model="..."). Abstrai tokenização, inferência, decodificação. Para prototipagem e produção simples.' },
  ],
  gotchas: [
    'Carregar modelo grande sem device_map="auto" trava em OOM — sempre use accelerate.',
    'Tokenizer e modelo de versões diferentes quebram silenciosamente. Use o mesmo checkpoint.',
    'Dataset enorme sem streaming=True esgota disco e RAM. Use load_dataset(..., streaming=True).',
    'Inference Endpoints cobra por hora ON, não por request — desligue instâncias idle.',
    'Subir código com token HF hardcoded no git vaza credencial — use HF_TOKEN como env var.',
    'Esquecer de revisar licença do modelo — Llama 3 permite comercial, outros não.',
    'Modelos sem apply_chat_template usados em modo chat produzem outputs malformados.',
    'Não usar .eval() e torch.no_grad() na inferência → gradients desnecessários, 2× mais memória.',
  ],
  interview: [
    {
      level: 'pleno',
      q: 'Por que usar Hugging Face em vez de APIs proprietárias como OpenAI?',
      a: '<ul><li><strong>Custo</strong>: self-host fica barato em alta escala. GPT-4 a $10/1M tokens vs Llama 3.1 70B self-hosted por &lt;$1/1M.</li><li><strong>Privacidade</strong>: dados não saem da sua infra. Essencial para saúde, jurídico, financeiro.</li><li><strong>Customização</strong>: fine-tuning real com seus dados, não depende de features do vendor.</li><li><strong>Liberdade</strong>: sem deprecation forçada, sem lock-in, sem rate limits arbitrários.</li></ul><p>Trade-off: ops mais complexa, qualidade da fronteira (Claude 3.5, GPT-4o) ainda lidera em raciocínio geral.</p>',
      tip: 'Em entrevista: cite privacidade + custo como principais drivers. É o que as empresas realmente decidem.',
    },
    {
      level: 'pleno',
      q: 'Como a pipeline API do transformers funciona?',
      a: '<p><code>pipeline("task", model="org/model")</code> cria um objeto que encapsula: tokenização, inferência e decodificação.</p><p>Exemplo:</p><pre><code>from transformers import pipeline\npipe = pipeline("text-generation", model="meta-llama/Meta-Llama-3.1-8B-Instruct")\nresult = pipe([{"role": "user", "content": "Explique LoRA"}], max_new_tokens=200)</code></pre><p>Tasks disponíveis: text-generation, text-classification, token-classification, summarization, translation, question-answering, image-classification, audio-classification e mais.</p><p>Para produção seria melhor usar AutoModel + AutoTokenizer direto para mais controle.</p>',
    },
    {
      level: 'pleno',
      q: 'Como carregar e usar um modelo do Hub de forma correta?',
      a: '<pre><code>from transformers import AutoModelForCausalLM, AutoTokenizer\nimport torch\n\nmodel = AutoModelForCausalLM.from_pretrained(\n    "meta-llama/Meta-Llama-3.1-8B-Instruct",\n    torch_dtype=torch.bfloat16,\n    device_map="auto",       # distribui entre GPUs disponíveis\n)\ntokenizer = AutoTokenizer.from_pretrained(\n    "meta-llama/Meta-Llama-3.1-8B-Instruct"\n)\n\nmessages = [{"role": "user", "content": "Olá"}]\ninput_ids = tokenizer.apply_chat_template(\n    messages, return_tensors="pt", add_generation_prompt=True\n).to(model.device)\n\nwith torch.no_grad():\n    output = model.generate(input_ids, max_new_tokens=200)\nprint(tokenizer.decode(output[0][input_ids.shape[-1]:]))</code></pre>',
    },
    {
      level: 'pleno',
      q: 'Qual a diferença entre Inference API e Inference Endpoints?',
      a: '<p><strong>Inference API (serverless)</strong>: gratuito com rate limit (~10 req/min), latência variável (cold start), compartilhado com outros usuários. Ideal para prototipagem e demos.</p><p><strong>Inference Endpoints (dedicated)</strong>: GPU dedicada, latência previsível (&lt;200ms p99), autoscaling configurável, cobra por hora GPU ativa. Para produção com SLA.</p><p>Em produção real: Inference Endpoints ou deploy próprio com vLLM/TGI na sua cloud.</p>',
    },
    {
      level: 'pleno',
      q: 'Como carregar datasets da Hugging Face e processá-los?',
      a: '<pre><code>from datasets import load_dataset\n\n# Dataset padrão\nds = load_dataset("squad", split="train")\n\n# Streaming para datasets enormes (não baixa tudo)\nds_stream = load_dataset("wikipedia", "20220301.pt",\n                         split="train", streaming=True)\n\n# Map para processar\nds = ds.map(\n    lambda ex: {"text": f"Q: {ex["question"]}\\nA: {ex["answers"]["text"][0]}"},\n    batched=True, num_proc=4\n)\n\n# Filtrar\nds = ds.filter(lambda ex: len(ex["text"]) &gt; 50)\n\n# Split train/val\nsplit = ds.train_test_split(test_size=0.1, seed=42)</code></pre>',
      tip: 'Mencionar streaming=True e num_proc=4 demonstra que você sabe trabalhar com dados em escala.',
    },
    {
      level: 'pleno',
      q: 'O que é o model card e por que é importante?',
      a: '<p>Model card é o README do modelo no Hub: documenta uso pretendido, limitações, dados de treino, métricas de avaliação, license e informações de bias.</p><p>Importância prática:</p><ul><li><strong>License</strong>: define se pode usar comercialmente.</li><li><strong>Eval results</strong>: MMLU, HumanEval, GSM8K — compara modelos sem testar você mesmo.</li><li><strong>Intended use</strong>: modelos de chat vs. base, multilíngue vs. inglês only.</li><li><strong>Limitations</strong>: o que o modelo não faz bem.</li></ul><p>Sempre leia o model card antes de usar em produção.</p>',
    },
    {
      level: 'pleno',
      q: 'Como fazer fine-tuning de um modelo do Hub com PEFT e SFTTrainer?',
      a: '<p>Pipeline completo:</p><ol><li>Carrega base com <code>AutoModelForCausalLM.from_pretrained()</code>.</li><li>Aplica LoRA via PEFT: <code>get_peft_model(model, lora_config)</code>.</li><li>Carrega dataset com <code>load_dataset()</code>.</li><li>Tokeniza com apply_chat_template() do mesmo tokenizer.</li><li>Treina com <code>SFTTrainer</code> do TRL.</li><li>Publica com <code>model.push_to_hub("org/modelo-ft")</code>.</li></ol>',
    },
    {
      level: 'senior',
      q: 'Como usar accelerate para multi-GPU e mixed precision?',
      a: '<p>accelerate abstrai a complexidade de distribuição com API simples:</p><pre><code>from accelerate import Accelerator\n\naccelerator = Accelerator(\n    mixed_precision="bf16",\n    gradient_accumulation_steps=4,\n)\nmodel, optimizer, dataloader = accelerator.prepare(\n    model, optimizer, dataloader\n)\nfor batch in dataloader:\n    with accelerator.accumulate(model):\n        outputs = model(**batch)\n        loss = outputs.loss\n        accelerator.backward(loss)\n        optimizer.step()</code></pre><p>O mesmo código roda em single GPU, multi-GPU, TPU ou cluster — accelerate detecta automaticamente.</p><p>Para configurar: <code>accelerate config</code> — wizard interativo que gera o arquivo de configuração.</p>',
      tip: 'accelerate config é o comando que a maioria esquece — sem ele, multi-GPU não funciona automaticamente.',
    },
    {
      level: 'senior',
      q: 'Como avaliar modelos open-source do Hub sistematicamente?',
      a: '<ul><li><strong>Open LLM Leaderboard</strong>: MMLU (conhecimento geral), GSM8K (matemática), HumanEval (código), TruthfulQA (honestidade), BBH (raciocínio).</li><li><strong>Domínio específico</strong>: RAGAS para RAG, custom eval set para sua tarefa.</li><li><strong>Latência/throughput</strong>: benchmark no hardware alvo com vLLM ou TGI.</li><li><strong>License check</strong>: Apache 2.0, Llama 3 Community, Mistral Research vs. commercial.</li><li><strong>Tamanho/custo</strong>: FP16 ÷ 2 ≈ GB de VRAM. Llama 3.1 8B ≈ 16GB, 70B ≈ 140GB.</li></ul>',
      tip: 'A regra FP16 ÷ 2 para estimar VRAM é o cálculo rápido que demonstra experiência.',
    },
    {
      level: 'senior',
      q: 'Como servir modelos HF em produção com baixa latência?',
      a: '<p>Opções em ordem de throughput:</p><ul><li><strong>vLLM</strong>: melhor throughput — PagedAttention, continuous batching, OpenAI-compatible API. Deploy: <code>vllm serve model-id</code>.</li><li><strong>TGI (Text Generation Inference)</strong>: do próprio HF, mais fácil de configurar, Flash Attention, tensor parallelism.</li><li><strong>Quantização</strong>: GGUF para CPU (llama.cpp), AWQ/GPTQ para GPU. Reduz memória 2–4×.</li><li><strong>Compile</strong>: <code>torch.compile(model)</code> para latência menor na primeira batch.</li></ul><p>Para a maioria: vLLM com modelo quantizado em AWQ é o melhor trade-off.</p>',
    },
    {
      level: 'senior',
      q: 'Como publicar um modelo e adapter no Hub?',
      a: '<pre><code>from huggingface_hub import HfApi, login\nlogin()  # ou HF_TOKEN env var\n\n# Publicar modelo completo\nmodel.push_to_hub("seu-user/modelo-nome",\n                   private=True,\n                   commit_message="First release v1.0")\ntokenizer.push_to_hub("seu-user/modelo-nome")\n\n# Publicar só adapter LoRA (recomendado — artefato pequeno)\npeft_model.push_to_hub("seu-user/adapter-nome")\n\n# Carregar adapter publicado em qualquer lugar\nfrom peft import PeftModel\nbase = AutoModelForCausalLM.from_pretrained("meta-llama/Meta-Llama-3.1-8B")\nmodel = PeftModel.from_pretrained(base, "seu-user/adapter-nome")</code></pre>',
    },
    {
      level: 'senior',
      q: 'O que é o Hugging Face Hub internamente e como versionar modelos?',
      a: '<p>O Hub usa Git + Git LFS (Large File Storage). Cada modelo é um repo com:</p><ul><li>README.md (model card)</li><li>config.json (arquitetura)</li><li>tokenizer_config.json + vocab/merges</li><li>model.safetensors (pesos em formato seguro) ou model-00001-of-N.safetensors</li></ul><p>Versionamento: tags e branches git. <code>from_pretrained("org/model", revision="v1.2")</code> para versão específica.</p><p>Safetensors é o formato moderno — mais seguro (sem pickle), mais rápido para load parcial.</p>',
      tip: 'Mencionar safetensors vs pickle como questão de segurança demonstra que você leu os detalhes internos.',
    },
    {
      level: 'senior',
      q: 'Como usar AutoTrain e quando preferir fine-tuning manual?',
      a: '<p><strong>AutoTrain</strong>: interface no-code/low-code. Carrega dataset no formato correto, escolhe modelo base, configura hiperparâmetros básicos, executa via UI. Ideal para: PMs que querem baseline rápido, prototipagem sem dev, comparação rápida de modelos base.</p><p><strong>Fine-tuning manual</strong>: quando precisa de controle total — loss customizada, multi-task learning, formato de dados especial, integração com pipeline CI/CD, tracking de experimentos.</p><p>Na prática: AutoTrain para validar hipótese, código próprio para produção.</p>',
    },
    {
      level: 'senior',
      q: 'Como usar Spaces para criar demos e MVPs de AI?',
      a: '<p>Space = app web (Gradio ou Streamlit) hospedado no HF. Gratuito em CPU, pago em GPU (T4, A10G).</p><p>Criar Space:</p><ol><li>Repo no Hub com app.py na raiz.</li><li>README com <code>---sdk: gradio---</code> ou <code>---sdk: streamlit---</code>.</li><li>requirements.txt para dependências.</li><li>Commit → deploy automático.</li></ol><p>Casos de uso: demo de modelo para cliente, A/B test público entre dois modelos, interface de anotação para dataset.</p><p>Duplicar Space de outros é o caminho mais rápido para adaptar demos existentes.</p>',
    },
    {
      level: 'pleno',
      q: 'O que são tokenizers fast e por que importam?',
      a: '<p>Fast tokenizers são implementados em Rust (via tokenizers lib) — 10–100× mais rápidos que tokenizers Python puro.</p><p>Vantagens além de velocidade:</p><ul><li>Offset mapping: mapeia token → caractere original (fundamental para NER e extração).</li><li>Tokenização em batch paralela.</li><li>Truncation e padding automáticos.</li></ul><p>Verificar: <code>tokenizer.is_fast</code>. Se False, o modelo provavelmente é legado.</p><p>Nunca misture tokenizer com modelo de versões diferentes — vocabulários mudam entre versões.</p>',
    },
    {
      level: 'pleno',
      q: 'Como usar o Hugging Face datasets para criar um dataset customizado e publicar no Hub?',
      a: '<pre><code>from datasets import Dataset, DatasetDict\n\n# Criar dataset de dicionários\ndata = [\n    {"text": "exemplo 1", "label": 0},\n    {"text": "exemplo 2", "label": 1},\n]\n\nds = Dataset.from_list(data)\nds_split = ds.train_test_split(test_size=0.2, seed=42)\n\ndataset_dict = DatasetDict({\n    "train": ds_split["train"],\n    "test": ds_split["test"],\n})\n\n# Salvar local\ndataset_dict.save_to_disk("./meu-dataset")\n\n# Publicar no Hub\ndataset_dict.push_to_hub("seu-user/meu-dataset", private=True)</code></pre>',
    },
    {
      level: 'senior',
      q: 'Como gerenciar autenticação e tokens HF de forma segura?',
      a: '<p>Nunca hardcode tokens no código — vaza em git mesmo que você apague depois (histórico).</p><p>Formas seguras:</p><ol><li><strong>huggingface-cli login</strong>: token no ~/.cache/huggingface/token.</li><li><strong>HF_TOKEN env var</strong>: <code>os.environ["HF_TOKEN"]</code> ou via .env + python-dotenv.</li><li><strong>Secrets em CI/CD</strong>: GitHub Actions secrets, AWS Secrets Manager, Vault.</li></ol><p>Para Spaces: Settings → Secrets → HF_TOKEN. Não colocar no README nem no requirements.</p><p>Token de leitura é suficiente para carregar modelos privados — use write apenas quando necessário.</p>',
      tip: 'Mencionar que o token persiste no git history mesmo após deletar é o detalhe de segurança que impressiona.',
    },
    {
      level: 'senior',
      q: 'Como usar o Open LLM Leaderboard para escolher modelos?',
      a: '<p>O Leaderboard avalia modelos open-source em benchmarks padronizados:</p><ul><li><strong>MMLU</strong>: 57 tarefas de conhecimento geral (57%→90% range).</li><li><strong>ARC</strong>: raciocínio de ciências.</li><li><strong>HellaSwag</strong>: senso comum em completação de texto.</li><li><strong>TruthfulQA</strong>: resistência a afirmações falsas populares.</li><li><strong>GSM8K</strong>: problemas matemáticos de ensino fundamental/médio.</li><li><strong>HumanEval</strong>: geração de código Python.</li></ul><p>Estratégia: filtre por tamanho (VRAM disponível) → ordene pela métrica relevante para sua tarefa → verifique licença → teste localmente no seu domínio antes de commitar.</p>',
    },
    {
      level: 'senior',
      q: 'Como implementar Inference Endpoints em produção com autoscaling?',
      a: '<p>Via API REST ou UI do Hub:</p><pre><code>POST https://api.endpoints.huggingface.cloud/v2/endpoint\n{\n  "accountId": "seu-org",\n  "compute": {"accelerator": "gpu", "instanceType": "nvidia-t4-xl"},\n  "model": {\n    "framework": "pytorch",\n    "repository": "meta-llama/Meta-Llama-3.1-8B-Instruct"\n  },\n  "name": "prod-llama",\n  "scaling": {\n    "minReplica": 0,   // 0 = scale to zero quando idle\n    "maxReplica": 4\n  },\n  "type": "protected"\n}</code></pre><p>min_replica=0 economiza custo com cold start de ~30s. min_replica=1 garante disponibilidade constante.</p>',
    },
    {
      level: 'pleno',
      q: 'Quais são as principais sub-bibliotecas do ecossistema HF e quando usar cada uma?',
      a: '<table style="font-size:11px;border-collapse:collapse"><thead><tr><th style="padding:4px 8px;color:#94a3b8">Lib</th><th style="padding:4px 8px;color:#94a3b8">Quando usar</th></tr></thead><tbody><tr><td style="padding:4px 8px;color:#e2e8f0">transformers</td><td style="padding:4px 8px;color:#94a3b8">Carregar, inferir, treinar qualquer modelo do Hub</td></tr><tr><td style="padding:4px 8px;color:#e2e8f0">datasets</td><td style="padding:4px 8px;color:#94a3b8">Carregar e processar datasets grandes com streaming</td></tr><tr><td style="padding:4px 8px;color:#e2e8f0">peft</td><td style="padding:4px 8px;color:#94a3b8">Fine-tuning eficiente (LoRA, QLoRA, IA3)</td></tr><tr><td style="padding:4px 8px;color:#e2e8f0">trl</td><td style="padding:4px 8px;color:#94a3b8">SFT, DPO, RLHF — alignment</td></tr><tr><td style="padding:4px 8px;color:#e2e8f0">accelerate</td><td style="padding:4px 8px;color:#94a3b8">Multi-GPU, mixed precision, FSDP</td></tr><tr><td style="padding:4px 8px;color:#e2e8f0">diffusers</td><td style="padding:4px 8px;color:#94a3b8">Modelos de difusão (Stable Diffusion, FLUX)</td></tr><tr><td style="padding:4px 8px;color:#e2e8f0">tokenizers</td><td style="padding:4px 8px;color:#94a3b8">Tokenizers Rust para alto throughput</td></tr><tr><td style="padding:4px 8px;color:#e2e8f0">evaluate</td><td style="padding:4px 8px;color:#94a3b8">BLEU, ROUGE, Perplexidade, F1 padronizados</td></tr></tbody></table>',
    },
    {
      level: 'pleno',
      q: 'O que é apply_chat_template e por que é crítico para modelos de chat?',
      a: '<p>Cada modelo de chat tem um formato específico de prompt. Misturar modelos e formatos quebra silenciosamente — o modelo gera outputs estranhos sem erro explícito.</p><p>apply_chat_template() lê o chat_template do tokenizer_config.json e aplica o formato correto automaticamente:</p><pre><code>messages = [\n    {"role": "system", "content": "Você é assistente."},\n    {"role": "user",   "content": "Explique LoRA."},\n]\n\n# Llama 3: [INST], Mistral: [INST], ChatML: &lt;|system|&gt;...\ntext = tokenizer.apply_chat_template(\n    messages,\n    tokenize=False,\n    add_generation_prompt=True,  # adiciona &lt;|assistant|&gt; para geração\n)\nprint(text)  # formato correto para o modelo específico</code></pre>',
      tip: 'add_generation_prompt=True é o detalhe que a maioria esquece e causa geração malformada.',
    },
  ],
  diagrams: [
    {
      title: 'Ecossistema Hugging Face — Mapa de Libs',
      html: `<div style="font-family:sans-serif;max-width:700px;margin:0 auto">
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
    ${[
      { name: 'Hub', sub: 'Modelos · Datasets · Spaces', color: '#ffcc00', desc: 'from_pretrained() · push_to_hub()' },
      { name: 'transformers', sub: 'Core library', color: '#ff9d00', desc: 'AutoModel · AutoTokenizer · pipeline() · Trainer' },
      { name: 'datasets', sub: 'Dados em escala', color: '#38bdf8', desc: 'load_dataset() · streaming · map/filter' },
      { name: 'PEFT', sub: 'Fine-tuning eficiente', color: '#a78bfa', desc: 'LoRA · QLoRA · IA3 · DoRA' },
      { name: 'TRL', sub: 'Alignment', color: '#f97316', desc: 'SFTTrainer · DPOTrainer · PPOTrainer' },
      { name: 'accelerate', sub: 'Distribuição', color: '#22c55e', desc: 'Multi-GPU · FSDP · mixed precision' },
      { name: 'Inference Endpoints', sub: 'Deploy gerenciado', color: '#ef4444', desc: 'GPU dedicada · autoscaling · SLA' },
      { name: 'Spaces', sub: 'Apps web', color: '#60a5fa', desc: 'Gradio · Streamlit · demos gratuitos' },
      { name: 'tokenizers', sub: 'Rust speed', color: '#94a3b8', desc: 'Fast · offset mapping · batch' },
    ].map(lib => `<div style="padding:10px;background:#1e293b;border:1px solid ${lib.color}30;border-radius:8px">
      <div style="font-size:12px;font-weight:700;color:${lib.color};margin-bottom:2px">${lib.name}</div>
      <div style="font-size:10px;color:#94a3b8;margin-bottom:4px">${lib.sub}</div>
      <div style="font-size:10px;color:#64748b;font-family:monospace">${lib.desc}</div>
    </div>`).join('')}
  </div>
</div>`,
      css: `.hf-ecosystem-diagram { font-family: sans-serif; }`,
    },
    {
      title: 'AutoModel — padrão de carregamento correto',
      html: `<div style="font-family:sans-serif;max-width:700px;margin:0 auto">
  <div style="display:flex;flex-direction:column;gap:8px">
    <div style="font-size:12px;color:#94a3b8;text-align:center;margin-bottom:4px">Escolha a classe AutoModel correta para cada tarefa</div>
    <table style="width:100%;border-collapse:collapse;font-size:11px">
      <thead><tr><th style="text-align:left;padding:6px 10px;color:#94a3b8;border-bottom:1px solid #334155">Classe</th><th style="padding:6px 10px;color:#94a3b8;border-bottom:1px solid #334155">Tarefa</th><th style="padding:6px 10px;color:#94a3b8;border-bottom:1px solid #334155">Head</th></tr></thead>
      <tbody>
        ${[
          ['AutoModelForCausalLM', 'Geração de texto (GPT-style)', 'Language Modeling Head'],
          ['AutoModelForSeq2SeqLM', 'Tradução, resumo (T5, BART)', 'Encoder-Decoder LM Head'],
          ['AutoModelForSequenceClassification', 'Classificação de texto', 'Linear Head'],
          ['AutoModelForTokenClassification', 'NER, POS tagging', 'Linear Head por token'],
          ['AutoModelForQuestionAnswering', 'Extração de spans (SQuAD)', 'QA Head'],
          ['AutoModel', 'Features brutas (embeddings)', 'Sem head'],
        ].map(([cls, task, head], i) => `<tr style="background:${i % 2 === 0 ? '#1e293b' : 'transparent'}">
          <td style="padding:6px 10px;color:#ffcc00;font-family:monospace">${cls}</td>
          <td style="padding:6px 10px;color:#e2e8f0">${task}</td>
          <td style="padding:6px 10px;color:#94a3b8">${head}</td>
        </tr>`).join('')}
      </tbody>
    </table>
    <div style="padding:10px 14px;background:#1e293b;border:1px solid #334155;border-radius:8px;font-size:11px;color:#94a3b8">
      <strong style="color:#e2e8f0">Regra de ouro:</strong> use a classe específica para a tarefa — ela adiciona a head correta automaticamente. AutoModel sem sufixo retorna só features brutas, sem head de classificação.
    </div>
  </div>
</div>`,
      css: `.hf-automodel-diagram { font-family: sans-serif; }`,
    },
    {
      title: 'Ciclo de vida: do Hub ao deploy',
      html: `<div style="font-family:sans-serif;max-width:700px;margin:0 auto">
  <div style="display:flex;flex-direction:column;gap:6px">
    ${[
      { step: '1', label: 'Escolher modelo no Hub', sub: 'Open LLM Leaderboard · model card · license check', color: '#ffcc00' },
      { step: '2', label: 'from_pretrained()', sub: 'AutoModel + AutoTokenizer · device_map="auto" · torch_dtype', color: '#f97316' },
      { step: '3', label: 'Avaliar baseline', sub: 'pipeline() · eval set · métricas de tarefa', color: '#38bdf8' },
      { step: '4', label: 'Fine-tuning (opcional)', sub: 'PEFT LoRA + SFTTrainer · QLoRA em GPU limitada', color: '#a78bfa' },
      { step: '5', label: 'push_to_hub()', sub: 'Adapter ou modelo completo · model card · private=True', color: '#22c55e' },
      { step: '6', label: 'Deploy', sub: 'Inference Endpoints · vLLM · TGI · Spaces para demo', color: '#ef4444' },
      { step: '7', label: 'Monitorar', sub: 'Latência · throughput · qualidade · custo por token', color: '#60a5fa' },
    ].map(s => `<div style="display:flex;align-items:center;gap:12px;padding:8px 14px;background:#1e293b;border:1px solid ${s.color}30;border-radius:8px">
      <div style="width:24px;height:24px;border-radius:50%;background:${s.color}20;border:2px solid ${s.color};display:flex;align-items:center;justify-content:center;font-size:11px;color:${s.color};font-weight:700;flex-shrink:0">${s.step}</div>
      <div style="flex:1"><div style="font-size:12px;color:#e2e8f0;font-weight:600">${s.label}</div><div style="font-size:10px;color:#94a3b8">${s.sub}</div></div>
    </div>`).join('<div style="text-align:center;color:#334155;font-size:13px">↓</div>')}
  </div>
</div>`,
      css: `.hf-lifecycle-diagram { font-family: sans-serif; }`,
    },
  ],
  mnemonics: [
    {
      label: 'Ecossistema HF — libs essenciais',
      trick: 'TAPID',
      expansion: [
        ['T — Transformers', 'Lib core: AutoModel, AutoTokenizer, pipeline(), Trainer.'],
        ['A — Accelerate', 'Multi-GPU, mixed precision, FSDP. Mesmo código em single ou cluster.'],
        ['P — PEFT', 'Fine-tuning eficiente: LoRA, QLoRA, IA3. 0,1% dos parâmetros.'],
        ['I — Inference Endpoints', 'Deploy gerenciado com GPU dedicada, autoscaling, SLA.'],
        ['D — Datasets', 'Carrega e processa dados: streaming, map, filter, cache.'],
      ],
      explanation: 'TAPID cobre as 5 libs que um AI engineer usa diariamente no ecossistema HF.',
      example: 'Sem TAPID você não treina, não distribui, não fine-tuna, não deploya e não carrega dados.',
      why: 'Em entrevista, listar as libs com o que cada uma faz demonstra fluência no ecossistema.',
    },
    {
      label: 'AutoModel — escolha correta da classe',
      trick: 'CSTQ',
      expansion: [
        ['C — CausalLM', 'AutoModelForCausalLM → geração de texto (Llama, GPT, Mistral).'],
        ['S — Seq2SeqLM', 'AutoModelForSeq2SeqLM → tradução, resumo (T5, BART, mT5).'],
        ['T — TokenClassification', 'AutoModelForTokenClassification → NER, POS tagging.'],
        ['Q — QuestionAnswering', 'AutoModelForQuestionAnswering → extração de spans (SQuAD).'],
      ],
      explanation: 'CSTQ cobre os 4 padrões AutoModel mais comuns. Escolher errado resulta em head errada ou erro silencioso.',
      example: 'Classificação de e-mail em spam/não-spam → SequenceClassification, não CausalLM.',
      why: 'Confundir as classes AutoModel é erro comum em código que falha silenciosamente — saber de cor evita bugs.',
    },
    {
      label: 'Gotchas do HF em produção',
      trick: 'TSDL',
      expansion: [
        ['T — Token vaza', 'HF_TOKEN nunca no código ou git. Use env var ou secrets do CI/CD.'],
        ['S — Streaming é obrigatório', 'Dataset grande sem streaming=True → OOM ou disco cheio.'],
        ['D — Device map', 'Modelo grande sem device_map="auto" → OOM em CPU/GPU.'],
        ['L — License check', 'Sempre verifique a licença antes de usar em produção comercial.'],
      ],
      explanation: 'TSDL são os 4 erros que aparecem toda vez que alguém usa HF pela primeira vez em produção.',
      example: 'Erro 1 de produção HF: "out of memory". Motivo: não usou device_map="auto". Fix em 1 linha.',
      why: 'Gotchas de produção são mais cobrados em entrevistas sênior do que a API básica.',
    },
  ],
  cheatsheet: {
    title: 'Hugging Face — Referência Rápida',
    html: `<div style="font-family:sans-serif;font-size:12px;max-width:800px">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div>
      <h4 style="color:#ffcc00;margin:0 0 8px">Carregamento padrão</h4>
      <pre style="font-size:10px;background:#1e293b;padding:10px;border-radius:6px;color:#e2e8f0;overflow:auto">model = AutoModelForCausalLM.from_pretrained(
  "org/model",
  torch_dtype=torch.bfloat16,
  device_map="auto",
)
tokenizer = AutoTokenizer.from_pretrained("org/model")
</pre>
    </div>
    <div>
      <h4 style="color:#a78bfa;margin:0 0 8px">QLoRA + PEFT</h4>
      <pre style="font-size:10px;background:#1e293b;padding:10px;border-radius:6px;color:#e2e8f0;overflow:auto">bnb = BitsAndBytesConfig(
  load_in_4bit=True,
  bnb_4bit_quant_type="nf4",
  bnb_4bit_compute_dtype="bfloat16",
)
lora = LoraConfig(r=16, lora_alpha=32)
model = get_peft_model(model, lora)
</pre>
    </div>
    <div>
      <h4 style="color:#22c55e;margin:0 0 8px">Regras de produção</h4>
      <div style="display:flex;flex-direction:column;gap:4px">
        ${[
          ['✗', '#ef4444', 'HF_TOKEN no código → usa env var'],
          ['✗', '#ef4444', 'Sem streaming em dataset enorme → OOM'],
          ['✗', '#ef4444', 'Sem device_map="auto" em modelo grande'],
          ['✗', '#ef4444', 'Tokenizer de versão diferente do modelo'],
          ['✓', '#22c55e', 'apply_chat_template() para modelos chat'],
          ['✓', '#22c55e', 'torch.no_grad() + model.eval() na inferência'],
          ['✓', '#22c55e', 'Verificar licença antes de produção'],
        ].map(([sym, c, t]) => `<div style="display:flex;gap:8px;padding:4px 8px;background:#1e293b;border-radius:4px"><span style="color:${c};font-weight:700">${sym}</span><span style="color:#e2e8f0">${t}</span></div>`).join('')}
      </div>
    </div>
    <div>
      <h4 style="color:#38bdf8;margin:0 0 8px">Libs e quando usar</h4>
      <div style="display:flex;flex-direction:column;gap:4px">
        ${[
          ['transformers', 'Carregar, inferir, treinar'],
          ['datasets', 'Carregar dados com streaming'],
          ['peft', 'LoRA, QLoRA, fine-tuning eficiente'],
          ['trl', 'SFT, DPO, RLHF, alignment'],
          ['accelerate', 'Multi-GPU, distributed training'],
          ['evaluate', 'BLEU, ROUGE, F1 padronizados'],
        ].map(([k, v]) => `<div style="display:flex;gap:8px;padding:4px 8px;background:#1e293b;border-radius:4px"><span style="color:#ffcc00;min-width:80px">${k}</span><span style="color:#94a3b8">${v}</span></div>`).join('')}
      </div>
    </div>
  </div>
</div>`,
    css: `.hf-cheatsheet { font-family: sans-serif; }`,
  },
  mindmap: {
    title: 'Hugging Face — Mapa Mental',
    html: `<div style="font-family:sans-serif;max-width:700px;margin:0 auto">
  <div style="text-align:center;margin-bottom:16px">
    <div style="display:inline-block;padding:10px 20px;background:#ffcc0020;border:2px solid #ffcc00;border-radius:8px;font-size:14px;font-weight:700;color:#ffcc00">Hugging Face</div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    ${[
      { label: 'Hub', color: '#ffcc00', items: ['1M+ modelos open-source', '200k datasets', 'Git + LFS internamente', 'Model cards (license, eval)', 'from_pretrained() · push_to_hub()'] },
      { label: 'transformers', color: '#f97316', items: ['AutoModel (8 variantes)', 'AutoTokenizer + fast tokenizers', 'pipeline() API alto nível', 'apply_chat_template()', 'Trainer para full fine-tuning'] },
      { label: 'Fine-tuning Stack', color: '#a78bfa', items: ['PEFT: LoRA, QLoRA, IA3', 'TRL: SFT, DPO, PPO', 'bitsandbytes: 4-bit QLoRA', 'accelerate: multi-GPU', 'Unsloth: 2-5× mais rápido'] },
      { label: 'datasets', color: '#38bdf8', items: ['load_dataset() padronizado', 'streaming=True para escala', 'map/filter/shuffle', 'train_test_split()', 'push_to_hub() para compartilhar'] },
      { label: 'Deploy', color: '#ef4444', items: ['Inference Endpoints: GPU dedicada', 'Inference API: serverless free', 'Spaces: Gradio/Streamlit', 'vLLM + TGI para auto-hosting', 'Quantização AWQ/GPTQ/GGUF'] },
      { label: 'Boas práticas', color: '#22c55e', items: ['HF_TOKEN como env var', 'device_map="auto" sempre', 'streaming em datasets grandes', 'Verificar licença comercial', 'apply_chat_template() nos chats'] },
    ].map(cat => `<div style="padding:12px;background:#1e293b;border:1px solid ${cat.color}30;border-radius:8px">
      <div style="font-size:11px;font-weight:700;color:${cat.color};margin-bottom:8px">${cat.label}</div>
      <div style="display:flex;flex-direction:column;gap:3px">${cat.items.map(i => `<div style="font-size:10px;color:#94a3b8;padding-left:8px;border-left:2px solid ${cat.color}40">${i}</div>`).join('')}</div>
    </div>`).join('')}
  </div>
</div>`,
    css: `.hf-mindmap { font-family: sans-serif; }`,
  },
  exercises: [
    {
      level: 'iniciante',
      title: 'Explorar o Hub e fazer inferência com pipeline',
      description: 'Use a pipeline API para fazer inferência com diferentes tarefas. Explore o Hub para encontrar modelos em português.',
      hints: [
        'pip install transformers torch datasets',
        'Use pipeline("text-generation", model="Qwen/Qwen2.5-1.5B-Instruct") — modelo leve.',
        'Teste pipeline("sentiment-analysis", model="neuralmind/bert-base-portuguese-cased") para PT-BR.',
        'Use pipeline("translation", model="Helsinki-NLP/opus-mt-pt-en") para tradução.',
        'Explore huggingface.co/models filtrando por idioma "pt" e task.',
      ],
    },
    {
      level: 'intermediario',
      title: 'Fine-tuning QLoRA com SFTTrainer e publicação no Hub',
      description: 'Fine-tune um modelo de chat com SFTTrainer usando QLoRA. Publique o adapter no Hub e teste a inferência remota.',
      hints: [
        'pip install transformers peft trl bitsandbytes datasets accelerate',
        'Use meta-llama/Llama-3.2-1B-Instruct (menor) ou Qwen/Qwen2.5-0.5B-Instruct.',
        'Crie dataset de 100-200 exemplos no formato ChatML sobre sua especialidade.',
        'Configure LoraConfig com r=8, e SFTConfig com num_train_epochs=3.',
        'Publique: peft_model.push_to_hub("seu-user/meu-adapter"). Teste com PeftModel.from_pretrained().',
      ],
    },
    {
      level: 'senior',
      title: 'Criar Space com comparação de dois modelos + deploy em Inference Endpoints',
      description: 'Crie um Space Gradio que compara dois modelos side-by-side para um benchmark customizado. Faça deploy do melhor modelo em Inference Endpoint.',
      hints: [
        'Space Gradio: app.py com gr.Interface ou gr.Blocks. gr.Row() para layout side-by-side.',
        'Carregue dois modelos com pipeline() ou AutoModel. Shared prefix para eficiência.',
        'Adicione métricas automáticas: latência, comprimento da resposta.',
        'Para Inference Endpoints: use a API REST ou a UI de Endpoints no huggingface.co.',
        'Configure min_replica=0 para scale-to-zero e maxReplica=2 para picos de tráfego.',
      ],
    },
  ],
  videos: [
    { title: 'Hugging Face Course — Full NLP Course', channel: 'Hugging Face', url: 'https://www.youtube.com/watch?v=00GKzGyWFEs' },
    { title: 'Fine-tuning LLMs with PEFT and QLoRA', channel: 'Hugging Face', url: 'https://www.youtube.com/watch?v=Us5ZFp16PaU' },
    { title: 'Deploy LLMs with Inference Endpoints', channel: 'Hugging Face', url: 'https://www.youtube.com/watch?v=GZfVYXSj3AY' },
    { title: 'Build AI Apps with Gradio and Spaces', channel: 'Hugging Face', url: 'https://www.youtube.com/watch?v=RiCQzBluTxU' },
    { title: 'Open LLM Leaderboard Explained', channel: 'Weights & Biases', url: 'https://www.youtube.com/watch?v=V7JGXaqOhwI' },
  ],
  resources: [
    { title: 'Hugging Face Docs completa', url: 'https://huggingface.co/docs', kind: 'docs' },
    { title: 'NLP Course (gratuito, interativo)', url: 'https://huggingface.co/learn/nlp-course', kind: 'curso' },
    { title: 'Open LLM Leaderboard', url: 'https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard', kind: 'pratica' },
    { title: 'PEFT docs — LoRA, QLoRA, IA3', url: 'https://huggingface.co/docs/peft/', kind: 'docs' },
    { title: 'TRL docs — SFTTrainer, DPOTrainer', url: 'https://huggingface.co/docs/trl/', kind: 'docs' },
    { title: 'accelerate docs — multi-GPU guide', url: 'https://huggingface.co/docs/accelerate', kind: 'docs' },
    { title: 'Spaces cookbook — exemplos Gradio', url: 'https://huggingface.co/docs/hub/spaces-overview', kind: 'docs' },
    { title: 'Model card authoring guide', url: 'https://huggingface.co/docs/hub/model-cards', kind: 'docs' },
  ],
  codeExamples: [
    {
      title: 'Carregamento correto com device_map e chat template',
      language: 'python',
      code: `from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_id = "meta-llama/Meta-Llama-3.1-8B-Instruct"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.bfloat16,
    device_map="auto",           # distribui entre GPUs automaticamente
)

messages = [
    {"role": "system", "content": "Você é um assistente especializado em AI."},
    {"role": "user",   "content": "Explique LoRA em 2 frases."},
]

# apply_chat_template → formato correto para o modelo específico
input_ids = tokenizer.apply_chat_template(
    messages,
    tokenize=True,
    add_generation_prompt=True,  # CRÍTICO: adiciona <|assistant|> para geração
    return_tensors="pt",
).to(model.device)

with torch.no_grad():  # CRÍTICO: sem gradients na inferência
    output = model.generate(input_ids, max_new_tokens=200, do_sample=True, temperature=0.7)

# Decodifica só os tokens novos (exclui o prompt)
response = tokenizer.decode(output[0][input_ids.shape[-1]:], skip_special_tokens=True)
print(response)`,
    },
    {
      title: 'datasets — carregamento, processamento e streaming',
      language: 'python',
      code: `from datasets import load_dataset, Dataset, DatasetDict

# Dataset padrão do Hub
ds = load_dataset("tatsu-lab/alpaca", split="train")
print(ds[0])  # {'instruction': ..., 'input': ..., 'output': ..., 'text': ...}

# Streaming para datasets enormes (Wikipedia = 20GB+)
ds_stream = load_dataset("wikipedia", "20220301.pt",
                          split="train", streaming=True)
for example in ds_stream.take(5):
    print(example["title"])

# Processar com map (paralelo)
def format_instruction(example):
    return {
        "text": f"<|user|>{example['instruction']}<|end|>\\n<|assistant|>{example['output']}<|end|>"
    }

ds = ds.map(format_instruction, batched=False, num_proc=4)
ds = ds.filter(lambda ex: len(ex["text"]) > 50)

# Split e publicar
split = ds.train_test_split(test_size=0.1, seed=42)
DatasetDict({"train": split["train"], "test": split["test"]}).push_to_hub(
    "seu-user/meu-dataset", private=True
)`,
    },
    {
      title: 'accelerate — mesmo código em single ou multi-GPU',
      language: 'python',
      code: `from accelerate import Accelerator
from torch.optim import AdamW

accelerator = Accelerator(
    mixed_precision="bf16",           # bf16 em A100, fp16 em T4
    gradient_accumulation_steps=4,    # acumula gradients antes de step
)

# accelerator.prepare() adapta automaticamente para o hardware
model, optimizer, train_dataloader, val_dataloader = accelerator.prepare(
    model, AdamW(model.parameters(), lr=2e-4),
    train_dataloader, val_dataloader
)

for epoch in range(num_epochs):
    model.train()
    for batch in train_dataloader:
        with accelerator.accumulate(model):  # gradient accumulation correto
            outputs = model(**batch)
            loss = outputs.loss
            accelerator.backward(loss)       # substitui loss.backward()
            optimizer.step()
            optimizer.zero_grad()

# Salvar com accelerate (lida com DDP/FSDP corretamente)
accelerator.wait_for_everyone()
unwrapped = accelerator.unwrap_model(model)
unwrapped.save_pretrained("./output", safe_serialization=True)

# Rodar com: accelerate launch --num_processes 4 train.py`,
    },
    {
      title: 'evaluate — métricas padronizadas',
      language: 'python',
      code: `import evaluate

# ROUGE para geração/sumarização
rouge = evaluate.load("rouge")
results = rouge.compute(
    predictions=["LoRA treina matrizes de baixa rank."],
    references=["LoRA adapta modelos com parâmetros mínimos."],
)
print(results)
# {'rouge1': 0.31, 'rouge2': 0.12, 'rougeL': 0.25, 'rougeLsum': 0.25}

# BLEU para tradução
bleu = evaluate.load("bleu")
results = bleu.compute(
    predictions=[["the cat sat on the mat"]],
    references=[[["the cat sat on the mat", "the cat is on the mat"]]],
)

# Accuracy para classificação
accuracy = evaluate.load("accuracy")
results = accuracy.compute(
    predictions=[0, 1, 1, 0],
    references=[0, 1, 0, 0]
)
print(results)  # {'accuracy': 0.75}`,
    },
  ],
}

export default huggingFace
