'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta HF (amarelo) ───────────────────────────────────────────────────────
const C = '#ffcc00'   // amarelo HF — cor oficial do Hugging Face

// ── Cards ─────────────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: '20 perguntas de entrevista sobre Hugging Face — pleno e sênior',
    type: 'qa',
    pages: 10,
    description: 'Ecossistema completo: Hub, transformers, AutoModel/AutoTokenizer, pipeline API, datasets, PEFT, TRL, accelerate, Inference Endpoints, Spaces, apply_chat_template, tokenizers fast, avaliação de modelos.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'AutoModel, pipeline, PEFT e gotchas de produção numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: mapa de classes AutoModel por tarefa, comandos essenciais, regras de produção (TSDL), libs do ecossistema, Inference vs. Endpoints, deploy stack.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: '3 truques que fixam ecossistema, AutoModel e gotchas na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'TAPID (libs essenciais), CSTQ (AutoModel por tarefa), TSDL (gotchas de produção). Cada mnemônico com exemplo de entrevista.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Hugging Face do Hub ao deploy em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 6 categorias (Hub, transformers, Fine-tuning Stack, datasets, Deploy, Boas práticas) e checklist de 10 perguntas para auto-avaliação.',
    icon: '04',
    goal: 'Mapeamento mental',
  },
]

// ── Q&A ───────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é o Hugging Face Hub e como funciona internamente?',
    a: 'O Hub é o repositório central de AI open-source: 1M+ modelos e 200k datasets.\n\nInternamente: cada modelo é um repo Git + LFS (Large File Storage para pesos). Pesos no formato safetensors (seguro, sem pickle) ou pickle (legado).\n\nfrom_pretrained("org/model") faz download automático e salva em cache local (~/.cache/huggingface). Versionamento por tags git: revision="v1.2".',
    tip: 'Safetensors vs pickle é a questão de segurança — safetensors não permite code execution no load.',
  },
  {
    level: 'Pleno',
    q: 'Como carregar um modelo do Hub de forma correta em produção?',
    a: 'from transformers import AutoModelForCausalLM, AutoTokenizer\nimport torch\n\nmodel = AutoModelForCausalLM.from_pretrained(\n    "meta-llama/Meta-Llama-3.1-8B-Instruct",\n    torch_dtype=torch.bfloat16,   # bf16 economiza VRAM\n    device_map="auto",            # distribui entre GPUs\n)\ntokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3.1-8B-Instruct")\n\nSempre use .eval() e torch.no_grad() na inferência para economizar memória.',
    tip: 'device_map="auto" é a linha que a maioria esquece e resulta em OOM.',
  },
  {
    level: 'Pleno',
    q: 'Qual AutoModel usar para cada tarefa?',
    a: 'CausalLM: geração de texto — Llama, Mistral, GPT-style.\nSeq2SeqLM: tradução, resumo — T5, BART.\nSequenceClassification: classificação de texto — BERT, RoBERTa.\nTokenClassification: NER, POS — BERT-NER.\nQuestionAnswering: extração de spans — BERT-SQuAD.\nAutoModel (sem sufixo): embeddings brutos — BERT, E5, BGE.\n\nMnemônico: CSTQ (Causal, Seq2Seq, Token, QA).',
    tip: 'Usar a classe errada não gera erro — resulta em output malformado silenciosamente.',
  },
  {
    level: 'Pleno',
    q: 'O que é apply_chat_template e por que é crítico?',
    a: 'Cada modelo de chat tem formato específico: Llama usa [INST], ChatML usa <|system|>, Mistral tem seu próprio formato.\n\nMisturar modelo e formato diferente resulta em outputs estranhos sem erro.\n\napply_chat_template() lê o chat_template do tokenizer_config.json e aplica corretamente:\n\ntext = tokenizer.apply_chat_template(\n    messages, tokenize=False, add_generation_prompt=True\n)\n\nadd_generation_prompt=True adiciona o token de início de resposta do assistente.',
    tip: 'add_generation_prompt=True é o detalhe que a maioria esquece — sem ele o modelo não inicia a resposta.',
  },
  {
    level: 'Pleno',
    q: 'Como usar datasets para carregar e processar dados em escala?',
    a: 'from datasets import load_dataset\n\n# Streaming para datasets que não cabem em disco\nds = load_dataset("wikipedia", "20220301.pt", split="train", streaming=True)\n\n# Map paralelo para processar\nds = ds.map(fn, batched=True, num_proc=4)\n\n# Filtrar\nds = ds.filter(lambda ex: len(ex["text"]) > 50)\n\n# Split\nsplit = ds.train_test_split(test_size=0.1, seed=42)\n\nCache automático: o mesmo dataset processado é reutilizado sem reprocessar.',
    tip: 'streaming=True é o parâmetro que salva você de OOM em datasets de terabytes.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Inference API e Inference Endpoints?',
    a: 'Inference API (serverless): gratuito com rate limit (~10 req/min), latência variável (cold start de 30s), compartilhado. Ideal para prototipagem e demos.\n\nInference Endpoints (dedicated): GPU dedicada, latência previsível (<200ms p99), autoscaling configurável. Cobra por hora GPU ativa. Para produção com SLA.\n\nDica: min_replica=0 escala para zero quando idle. min_replica=1 garante disponibilidade constante.',
  },
  {
    level: 'Pleno',
    q: 'O que são tokenizers fast e qual a vantagem?',
    a: 'Fast tokenizers são implementados em Rust — 10–100× mais rápidos que Python puro.\n\nVantagens além de velocidade:\n• Offset mapping: mapeia token → caractere original (fundamental para NER)\n• Batch paralelo automático\n• Truncation e padding automáticos\n\nVerificar: tokenizer.is_fast → True para fast tokenizers.\n\nNunca misture tokenizer e modelo de versões diferentes — vocabulários mudam entre versões, quebra silenciosamente.',
    tip: 'Mention que misturar versões quebra silenciosamente — é o gotcha que a maioria não conhece.',
  },
  {
    level: 'Pleno',
    q: 'Como usar a pipeline API e quando preferir AutoModel direto?',
    a: 'Pipeline: alto nível, zero boilerplate. Ideal para prototipagem.\n\npipe = pipeline("text-generation", model="org/model")\nresult = pipe("Explique LoRA", max_new_tokens=200)\n\nAutoModel direto: quando precisa de controle total — temperature, sampling, KV cache, streaming, batching manual, logits, beam search customizado.\n\nProdução com volume alto: AutoModel + manual tokenization + vLLM/TGI para serving otimizado.',
  },
  {
    level: 'Senior',
    q: 'Como usar accelerate para multi-GPU e distributed training?',
    a: 'accelerate abstrai a complexidade com Accelerator():\n\naccelerator = Accelerator(mixed_precision="bf16", gradient_accumulation_steps=4)\nmodel, optimizer, train_dl = accelerator.prepare(model, optimizer, train_dl)\n\nfor batch in train_dl:\n    with accelerator.accumulate(model):\n        loss = model(**batch).loss\n        accelerator.backward(loss)\n        optimizer.step()\n\nMesmo código roda em single GPU, multi-GPU, TPU, cluster. accelerate config → wizard interativo.',
    tip: 'accelerate config (wizard) é o comando que a maioria não conhece — sem ele multi-GPU não funciona.',
  },
  {
    level: 'Senior',
    q: 'Como publicar um modelo e adapter no Hub de forma segura?',
    a: 'model.push_to_hub("user/model", private=True, commit_message="v1.0")\ntokenizer.push_to_hub("user/model")\n\nNunca coloque HF_TOKEN no código — use env var:\nlogin(token=os.environ["HF_TOKEN"])\n\nAdapter LoRA (50–200 MB vs GB):\npeft_model.push_to_hub("user/adapter")\n\nPor que private=True no início: evita exposição de modelos não testados. Mude para público quando estiver validado.',
    tip: 'Token no git histórico vaza mesmo após deletar o arquivo — env var é obrigatório.',
  },
  {
    level: 'Senior',
    q: 'Como avaliar modelos open-source do Hub sistematicamente?',
    a: 'Open LLM Leaderboard: MMLU (conhecimento, 57→90%), GSM8K (matemática), HumanEval (código), ARC (raciocínio), TruthfulQA (honestidade).\n\nEval custom no seu domínio:\n• 50–200 exemplos anotados\n• LLM-as-judge (GPT-4o) para qualidade\n• RAGAS para RAG\n• Latência no hardware alvo com vLLM\n\nFórmula VRAM: params × bytes_per_param. FP16 = 2 bytes. Llama 8B ≈ 16 GB.',
    tip: 'A fórmula params × 2 = VRAM em GB (FP16) é o cálculo rápido que demonstra experiência.',
  },
  {
    level: 'Senior',
    q: 'Como servir modelos HF em produção com baixa latência?',
    a: 'vLLM (maior throughput): PagedAttention + continuous batching + OpenAI-compatible API.\nvllm serve org/model --tensor-parallel-size 2\n\nTGI (mais simples): HF oficial, Flash Attention, tensor parallelism.\ndocker run -p 8080:80 ghcr.io/huggingface/text-generation-inference:latest --model-id org/model\n\nQuantização AWQ: reduz VRAM 2–4× com <1% perda de qualidade. Suportado por vLLM.\n\nPara maioria: vLLM + AWQ é o melhor trade-off.',
    tip: 'Citar PagedAttention como mecanismo chave do vLLM demonstra que você entende por que ele é mais eficiente.',
  },
  {
    level: 'Senior',
    q: 'Como criar um Space no Hugging Face para demo de modelo?',
    a: 'Space = repo no Hub com app.py + README com frontmatter sdk.\n\nREADME:\n---\ntitle: Meu Demo\nsdk: gradio\napp_file: app.py\n---\n\napp.py (Gradio):\nimport gradio as gr\nfrom transformers import pipeline\npipe = pipeline("text-generation", model="org/model")\n\ndef respond(msg): return pipe(msg)[0]["generated_text"]\n\ngr.Interface(fn=respond, inputs="text", outputs="text").launch()\n\nGPU paga: settings → hardware → T4 ou A10G. Secrets para HF_TOKEN privado.',
  },
  {
    level: 'Senior',
    q: 'Como usar evaluate para métricas padronizadas?',
    a: 'import evaluate\n\n# ROUGE para sumarização/geração\nrouge = evaluate.load("rouge")\nresults = rouge.compute(predictions=["texto gerado"], references=["referência"])\n\n# BLEU para tradução\nbleu = evaluate.load("bleu")\n\n# Accuracy para classificação\nacc = evaluate.load("accuracy")\n\n# Perplexidade para LMs\nperp = evaluate.load("perplexity", module_type="metric")\nresults = perp.compute(predictions=[...], model_id="gpt2")\n\nVantagem: métricas padronizadas, reproduzíveis, comparáveis entre trabalhos.',
  },
  {
    level: 'Senior',
    q: 'Como implementar Inference Endpoint com autoscaling via API?',
    a: 'POST /v2/endpoint\n{\n  "name": "prod-llama",\n  "model": {"repository": "org/model"},\n  "compute": {"accelerator": "gpu", "instanceType": "nvidia-t4-xl"},\n  "scaling": {"minReplica": 0, "maxReplica": 4}\n}\n\nmin_replica=0: escala para zero, economiza custo, cold start ~30s.\nmin_replica=1: sempre disponível, custo mínimo garantido.\n\nPara latência crítica: min_replica=2 (ativo-ativo). Para dev: min_replica=0.',
  },
  {
    level: 'Senior',
    q: 'Qual o ecossistema HF para modelos de imagem e multimodal?',
    a: 'diffusers: Stable Diffusion, FLUX, ControlNet. pipeline("text-to-image").\n\nAutoProcessor: para modelos multimodais (LLaVA, Idefics, PaliGemma). Processa texto + imagem juntos.\n\nAutoModelForVision2Seq: geração de texto a partir de imagem.\n\nExemplo: PaliGemma, LLaVA-Next, Idefics — todos carregam com AutoModelForVision2Seq + AutoProcessor.\n\nO mesmo padrão from_pretrained() funciona para 99% dos modelos do Hub, incluindo multimodais.',
  },
  {
    level: 'Pleno',
    q: 'Como fazer fine-tuning de um modelo do Hub com SFTTrainer?',
    a: 'Pipeline:\n1. from_pretrained("org/model") — carrega base\n2. LoraConfig + get_peft_model() — aplica LoRA\n3. load_dataset() — carrega e formata dados\n4. tokenizer.apply_chat_template() — formato correto\n5. SFTTrainer(model, tokenizer, train_dataset, eval_dataset, args)\n6. trainer.train() + trainer.save_model()\n7. peft_model.push_to_hub("user/adapter")\n\nVantagem do HF: tudo integrado — Hub, transformers, PEFT, TRL numa cadeia coesa.',
  },
  {
    level: 'Pleno',
    q: 'Como gerenciar tokens HF de forma segura?',
    a: 'NUNCA: HF_TOKEN hardcoded no código (vaza no git histórico mesmo após deletar).\n\nFormas corretas:\n• CLI: huggingface-cli login — salva em ~/.cache/huggingface/token\n• Env var: HF_TOKEN=hf_... python script.py\n• .env + python-dotenv: from dotenv import load_dotenv; load_dotenv()\n• CI/CD: GitHub Actions secrets → ${{ secrets.HF_TOKEN }}\n• Spaces: Settings → Secrets → HF_TOKEN (não aparece no código)\n\nToken de leitura para carregar modelos privados. Token de escrita só quando push_to_hub().',
    tip: 'Token persiste no histórico git mesmo após git rm — use BFG Repo Cleaner se já vazou.',
  },
  {
    level: 'Senior',
    q: 'Quais são as vantagens do formato safetensors vs pickle?',
    a: 'pickle: formato legado Python. Problema: ao fazer load, executa código arbitrário — vetor de ataque.\n\nsafetensors: formato moderno (Rust). Vantagens:\n• Seguro: sem execução de código no load\n• Mais rápido para load (lazy loading, mmap)\n• Suporta load parcial — carrega só as camadas necessárias\n• Zero-copy em algumas situações\n\nModel cards no Hub indicam se o modelo usa safetensors. Prefira modelos com safetensors em produção.',
    tip: 'Zero-copy e lazy loading são argumentos de performance além da segurança.',
  },
  {
    level: 'Pleno',
    q: 'Como usar streaming no datasets para processamento de dados massivos?',
    a: 'Sem streaming: load_dataset() baixa tudo para disco e RAM. Wikipedia PT = 20 GB+, C4 = TB.\n\nCom streaming:\nds = load_dataset("wikipedia", "20220301.pt", split="train", streaming=True)\nfor ex in ds.take(1000): # processa em batches sem carregar tudo\n    process(ex)\n\nStreamlit + streaming = processa e itera sem OOM.\n\nTreinamento com streaming:\nds = ds.shuffle(seed=42, buffer_size=10_000) # shuffle em janela\ntrainer = SFTTrainer(train_dataset=ds, ...) # SFTTrainer suporta IterableDataset',
  },
  {
    level: 'Senior',
    q: 'Como usar o Hub programaticamente com huggingface_hub?',
    a: 'from huggingface_hub import HfApi, hf_hub_download, list_models\n\napi = HfApi(token=os.environ["HF_TOKEN"])\n\n# Listar modelos por tarefa\nmodels = list(list_models(task="text-generation", sort="downloads", limit=10))\n\n# Download de arquivo específico\npath = hf_hub_download(repo_id="org/model", filename="config.json")\n\n# Criar repo programaticamente\napi.create_repo("user/novo-modelo", private=True)\n\n# Upload de arquivo\napi.upload_file(path_or_fileobj="./weights.safetensors", path_in_repo="model.safetensors", repo_id="user/novo-modelo")',
  },
]

// ── CheatSheet ────────────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'from_pretrained()', sig: 'AutoModel + AutoTokenizer + device_map', desc: 'device_map="auto" distribui entre GPUs. torch_dtype=bfloat16 economiza VRAM. Nunca misture tokenizer e modelo de versões diferentes.' },
  { name: 'pipeline()', sig: 'pipeline("task", model="org/model")', desc: 'Alto nível: tokeniza, infere, decodifica. Para prototipagem. Produçã: use AutoModel para mais controle.' },
  { name: 'apply_chat_template()', sig: 'add_generation_prompt=True', desc: 'Formato correto por modelo (Llama usa [INST], ChatML usa <|system|>). add_generation_prompt=True é crítico.' },
  { name: 'load_dataset()', sig: 'streaming=True · batched=True · num_proc=4', desc: 'streaming=True: sem OOM em datasets grandes. num_proc=4: map paralelo. Cache automático.' },
  { name: 'PEFT + SFTTrainer', sig: 'LoraConfig + get_peft_model() + SFTTrainer', desc: 'packing=True: GPU 30%→90%. masking automático. load_best_model_at_end=True: early stopping.' },
  { name: 'Inference Endpoints', sig: 'minReplica=0 · maxReplica=4', desc: 'min=0: scale-to-zero cold start 30s. min=1: sempre disponível. GPU dedicada com SLA.' },
  { name: 'accelerate', sig: 'Accelerator + prepare() + backward()', desc: 'Mesmo código em single GPU ou cluster. accelerate config → wizard. accelerate launch train.py.' },
  { name: 'push_to_hub()', sig: 'private=True · commit_message · token=env', desc: 'Nunca HF_TOKEN no código — usa env var. Adapter LoRA (200MB) vs modelo completo (GB).' },
  { name: 'evaluate', sig: 'evaluate.load("rouge") · .compute()', desc: 'ROUGE, BLEU, accuracy, perplexidade padronizados. Reproduzíveis e comparáveis entre trabalhos.' },
  { name: 'safetensors', sig: 'seguro · rápido · lazy loading', desc: 'Sem code execution no load (diferente de pickle). Lazy loading e mmap para load rápido parcial.' },
  { name: 'TAPID', sig: 'Transformers · Accelerate · PEFT · Inference · Datasets', desc: 'Mnemônico das 5 libs essenciais do ecossistema HF.' },
  { name: 'TSDL', sig: 'Token · Streaming · Device · License', desc: 'Mnemônico dos 4 gotchas de produção que todo mundo comete na primeira vez.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'HF_TOKEN no código → usa env var ou CLI login' },
  { ok: false, t: 'Dataset sem streaming=True em dados grandes → OOM garantido' },
  { ok: false, t: 'Modelo grande sem device_map="auto" → OOM imediato' },
  { ok: false, t: 'Tokenizer de versão diferente do modelo → outputs malformados silenciosos' },
  { ok: false, t: 'AutoModel (sem sufixo) para classificação → sem head, output errado' },
  { ok: true, t: 'apply_chat_template() + add_generation_prompt=True para modelos chat' },
  { ok: true, t: '.eval() + torch.no_grad() em inferência — 2× menos memória' },
  { ok: true, t: 'Verificar licença no model card antes de produção comercial' },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Libs essenciais do ecossistema HF',
    trick: 'TAPID',
    expansion: [
      ['T — Transformers', 'Core: AutoModel, AutoTokenizer, pipeline(), apply_chat_template().'],
      ['A — Accelerate', 'Distribuição: multi-GPU, mixed precision, FSDP, mesmo código.'],
      ['P — PEFT', 'Fine-tuning eficiente: LoRA, QLoRA, IA3. 0,1% dos parâmetros.'],
      ['I — Inference Endpoints', 'Deploy gerenciado: GPU dedicada, autoscaling, SLA.'],
      ['D — Datasets', 'Dados em escala: streaming, map, filter, cache automático.'],
    ],
    explanation: 'TAPID cobre as 5 libs que um AI engineer usa diariamente no ecossistema HF.',
    example: 'Em entrevista: "O ecossistema HF é TAPID — Transformers, Accelerate, PEFT, Inference, Datasets."',
    why: 'Listar as libs com propósito de cada uma demonstra fluência no ecossistema, não só conhecimento superficial.',
  },
  {
    label: 'AutoModel — classe correta por tarefa',
    trick: 'CSTQ',
    expansion: [
      ['C — CausalLM', 'Geração de texto: Llama, Mistral, GPT. pipeline("text-generation").'],
      ['S — Seq2SeqLM', 'Tradução, resumo: T5, BART, mT5. pipeline("summarization").'],
      ['T — TokenClassification', 'NER, POS: BERT-NER. pipeline("ner").'],
      ['Q — QuestionAnswering', 'Extração de spans: BERT-SQuAD. pipeline("question-answering").'],
    ],
    explanation: 'CSTQ cobre os 4 padrões AutoModel mais comuns. Usar a classe errada falha silenciosamente.',
    example: 'Classificação de e-mail spam → SequenceClassification (não CausalLM — sem head linear).',
    why: 'Confundir as classes AutoModel é o erro mais comum em código HF — saber de cor evita bugs silenciosos.',
  },
  {
    label: 'Gotchas de produção com HF',
    trick: 'TSDL',
    expansion: [
      ['T — Token vaza', 'HF_TOKEN nunca no código. Env var, CLI login ou secrets do CI/CD.'],
      ['S — Streaming', 'Dataset grande sem streaming=True → OOM ou disco cheio.'],
      ['D — Device map', 'Modelo grande sem device_map="auto" → OOM no carregamento.'],
      ['L — License', 'Sempre verifique licença do model card antes de uso comercial.'],
    ],
    explanation: 'TSDL são os 4 erros que aparecem toda vez que alguém usa HF pela primeira vez em produção.',
    example: 'Erro 1 de produção: "CUDA out of memory". Causa: não usou device_map="auto". Fix: 1 linha.',
    why: 'Gotchas de produção são mais cobrados em entrevistas sênior do que a API básica.',
  },
]

// ── Mindmap ───────────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Hub',
    color: '#ffcc00',
    items: [
      { t: '1M+ modelos · 200k datasets', k: true },
      { t: 'Git + LFS internamente', k: true },
      { t: 'from_pretrained() · push_to_hub()', k: true },
      { t: 'safetensors (seguro vs pickle)', k: true },
      { t: 'revision="v1.2" para versionar', a: true },
      { t: 'Model cards: license, eval, tags', a: true },
    ],
  },
  {
    label: 'transformers',
    color: '#f97316',
    items: [
      { t: 'AutoModelForCausalLM (geração)', k: true },
      { t: 'AutoTokenizer + fast tokenizers', k: true },
      { t: 'pipeline() API alto nível', k: true },
      { t: 'apply_chat_template()', k: true },
      { t: 'device_map="auto" + bfloat16', a: true },
      { t: '.eval() + torch.no_grad()', a: true },
    ],
  },
  {
    label: 'Fine-tuning Stack',
    color: '#a78bfa',
    items: [
      { t: 'PEFT: LoRA, QLoRA, IA3, DoRA', k: true },
      { t: 'TRL: SFTTrainer, DPOTrainer', k: true },
      { t: 'bitsandbytes: 4-bit QLoRA', k: true },
      { t: 'accelerate: multi-GPU, FSDP', k: true },
      { t: 'Unsloth: kernels Triton 2–5×', a: true },
      { t: 'W&B / MLflow: tracking exp.', a: true },
    ],
  },
  {
    label: 'datasets',
    color: '#38bdf8',
    items: [
      { t: 'load_dataset() padronizado', k: true },
      { t: 'streaming=True para escala', k: true },
      { t: 'map/filter/shuffle paralelo', k: true },
      { t: 'train_test_split()', k: true },
      { t: 'push_to_hub() para compartilhar', a: true },
      { t: 'IterableDataset para streaming', a: true },
    ],
  },
  {
    label: 'Deploy',
    color: '#ef4444',
    items: [
      { t: 'Inference Endpoints: GPU + SLA', k: true },
      { t: 'Inference API: serverless free', k: true },
      { t: 'Spaces: Gradio/Streamlit demos', k: true },
      { t: 'vLLM + TGI para self-hosted', k: true },
      { t: 'AWQ/GPTQ/GGUF: quantização', a: true },
      { t: 'min_replica=0 para scale-to-zero', a: true },
    ],
  },
  {
    label: 'Boas práticas',
    color: '#22c55e',
    items: [
      { t: 'HF_TOKEN como env var sempre', k: true },
      { t: 'device_map="auto" em modelos grandes', k: true },
      { t: 'streaming em datasets grandes', k: true },
      { t: 'Verificar licença comercial', k: true },
      { t: 'apply_chat_template() nos chats', a: true },
      { t: 'safetensors em vez de pickle', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Sei quando usar AutoModelForCausalLM vs SequenceClassification?',
  'Entendo o que apply_chat_template() faz e por que importa?',
  'Sei usar streaming=True para datasets que não cabem em disco?',
  'Consigo configurar PEFT + SFTTrainer para instruction tuning?',
  'Entendo a diferença entre Inference API e Inference Endpoints?',
  'Sei gerenciar HF_TOKEN de forma segura (env var, não código)?',
  'Conheço as 5 libs do TAPID e o propósito de cada uma?',
  'Sei usar device_map="auto" para carregar modelos grandes?',
  'Consigo criar um Space Gradio para demo de modelo?',
  'Sei verificar licença de modelo antes de uso comercial?',
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Hugging Face',
    stackLabel: 'AI Engineering · MLOps',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Hugging Face',
    accentColor: C,
    stackLabel: 'transformers · PEFT · TRL · Hub',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['transformers', 'AutoModel, AutoTokenizer, pipeline, Trainer'],
        ['datasets', 'load_dataset, map, filter, streaming, push_to_hub'],
        ['peft', 'LoraConfig, get_peft_model, PeftModel'],
        ['trl', 'SFTTrainer, DPOTrainer, SFTConfig'],
        ['accelerate', 'Accelerator, prepare, backward, launch'],
        ['evaluate', 'ROUGE, BLEU, accuracy, perplexity'],
        ['huggingface_hub', 'HfApi, hf_hub_download, login'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'torch_dtype=bfloat16 + device_map="auto": carregamento seguro em multi-GPU sem OOM',
        'packing=True no SFTTrainer: GPU de 30% → 90% de utilização real',
        'streaming=True em datasets: TB de dados sem tocar no disco local',
        'vLLM: PagedAttention + continuous batching = 10× mais throughput que pipeline() padrão',
        'AWQ quantization: modelo 2× menor com <1% perda de qualidade — pronto para vLLM',
      ],
      patterns: [
        {
          name: 'Carregamento correto + inferência',
          code: `from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Meta-Llama-3.1-8B-Instruct",
    torch_dtype=torch.bfloat16,
    device_map="auto",
)
tokenizer = AutoTokenizer.from_pretrained(
    "meta-llama/Meta-Llama-3.1-8B-Instruct"
)
messages = [{"role": "user", "content": "Explique LoRA."}]
ids = tokenizer.apply_chat_template(
    messages, return_tensors="pt", add_generation_prompt=True
).to(model.device)
with torch.no_grad():
    out = model.generate(ids, max_new_tokens=200)
print(tokenizer.decode(out[0][ids.shape[-1]:]))`,
          desc: 'Padrão completo: device_map, bfloat16, apply_chat_template, no_grad. Cada linha tem propósito.',
        },
        {
          name: 'Fine-tuning QLoRA completo',
          code: `from transformers import AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model
from trl import SFTTrainer, SFTConfig
from datasets import load_dataset

bnb = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4",
                          bnb_4bit_compute_dtype="bfloat16")
model = AutoModelForCausalLM.from_pretrained(
    "org/model", quantization_config=bnb, device_map="auto"
)
lora = LoraConfig(r=16, lora_alpha=32, target_modules=["all-linear"])
model = get_peft_model(model, lora)

ds = load_dataset("tatsu-lab/alpaca", split="train")
trainer = SFTTrainer(model, tokenizer=tokenizer, train_dataset=ds,
    args=SFTConfig(output_dir="./out", packing=True, num_train_epochs=3))
trainer.train()
model.push_to_hub("user/adapter")`,
          desc: 'QLoRA completo em ~15 linhas. packing=True e all-linear são os detalhes que a maioria esquece.',
        },
        {
          name: 'accelerate multi-GPU',
          code: `from accelerate import Accelerator

accelerator = Accelerator(mixed_precision="bf16",
                           gradient_accumulation_steps=4)
model, optimizer, train_dl = accelerator.prepare(
    model, optimizer, train_dataloader
)
for batch in train_dl:
    with accelerator.accumulate(model):
        loss = model(**batch).loss
        accelerator.backward(loss)
        optimizer.step(); optimizer.zero_grad()

# Mesmo script roda com:
# python train.py          (single GPU)
# accelerate launch train.py (multi-GPU, detecta automaticamente)`,
          desc: 'Zero mudança no código entre single e multi-GPU. accelerate.prepare() faz tudo.',
        },
      ],
      mentalModels: [
        'TAPID: Transformers, Accelerate, PEFT, Inference Endpoints, Datasets',
        'CSTQ: Causal, Seq2Seq, Token classification, QA — AutoModel por tarefa',
        'TSDL: Token (env), Streaming, Device map, License — gotchas de produção',
        'apply_chat_template() é o que garante formato correto — sem ele outputs malformados',
        'safetensors > pickle: sem code exec, lazy loading, mais rápido',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Hugging Face',
    stackLabel: 'transformers · PEFT · Hub · Deploy',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Hugging Face',
    stackLabel: 'Hub · transformers · PEFT · TRL · Deploy',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de ir a uma entrevista de AI Engineering.',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function HuggingFacePdfs() {
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
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
