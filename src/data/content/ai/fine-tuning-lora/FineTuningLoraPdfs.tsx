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

// ── Paleta LoRA (âmbar) ───────────────────────────────────────────────────────
const C = '#f59e0b'   // âmbar — identidade fine-tuning/LoRA

// ── Cards ─────────────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: '20 perguntas de entrevista sobre fine-tuning com LoRA — pleno e sênior',
    type: 'qa',
    pages: 10,
    description: 'Pipeline completo (LoRA/QLoRA, PEFT, SFTTrainer), hiperparâmetros, DPO vs RLHF, catastrophic forgetting, LLM-as-judge, merge & deploy, multi-LoRA com vLLM, Unsloth, quando não usar fine-tuning.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'LoRA, QLoRA, hiperparâmetros e pipeline numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: fórmula W_eff = W + (alpha/r)·B·A, hiperparâmetros com valores padrão, ferramentas (PEFT, TRL, Unsloth, vLLM), regras de ouro, gotchas de produção.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: '3 truques que fixam LoRA, pipeline e gotchas na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'RATO (hiperparâmetros), DAFED (pipeline completo), FEF (quando não usar). Cada mnemônico com exemplo de entrevista.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Fine-tuning com LoRA do básico ao avançado em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 6 categorias (LoRA, QLoRA, Pipeline, Alignment, Avaliação, Ferramentas) e checklist de 10 perguntas para auto-avaliação.',
    icon: '04',
    goal: 'Mapeamento mental',
  },
]

// ── Q&A ───────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é LoRA e como funciona matematicamente?',
    a: 'LoRA (Low-Rank Adaptation) congela os pesos W do modelo base e insere adapters de baixa rank: delta_W = B · A, onde B é d×r e A é r×d.\n\nNa inferência: W_eff = W + (alpha/r) · B · A.\n\nPara r=8 num modelo 7B: apenas ~0,17% dos parâmetros são treinados. Checkpoint de 50–200 MB em vez de 14 GB.',
    tip: 'Cite a fórmula completa com alpha/r — demonstra que entende o mecanismo, não só que "treina menos params".',
  },
  {
    level: 'Pleno',
    q: 'Quando usar fine-tuning em vez de RAG?',
    a: 'RAG: dados dinâmicos, citação de fonte, volume grande de docs.\n\nFine-tuning: estilo consistente, formato estrito (sempre JSON com campos específicos), terminologia interna, latência baixa sem retrieval, classificação.\n\nCombine: fine-tune para estilo + RAG para fatos é o estado da arte.\n\nNunca fine-tune para injetar fatos — modelo decora incorretamente.',
    tip: 'A última frase é a resposta que diferencia candidatos: fine-tuning é para estilo, RAG é para fatos.',
  },
  {
    level: 'Pleno',
    q: 'O que é QLoRA e quando usar?',
    a: 'QLoRA = LoRA + quantização 4-bit NF4 do base + paged AdamW optimizer.\n\nPermite Llama 3.1 70B em 1× A100 40GB, ou Llama 3.1 8B em 1× RTX 3090 24GB.\n\nCusto de qualidade: 1–2%. Use sempre que GPU é o gargalo.',
    tip: 'NF4 (Normal Float 4) é o formato — não confundir com INT4 que tem distribuição diferente.',
  },
  {
    level: 'Pleno',
    q: 'Quais são os hiperparâmetros mais importantes do LoRA?',
    a: 'r (rank): 8 padrão, 32+ para domínio novo.\nalpha: 2×r é a regra. Scaling factor.\ntarget_modules: q/k/v/o_proj + gate/up/down_proj (MLP).\nlora_dropout: 0.05–0.1 para regularização.\nlr: 1e-4 a 3e-4 (maior que full FT).\n\nMnemônico: RATO (Rank, Alpha, Target, Optimizer/lr).',
    tip: 'Citar RATO ou os valores específicos de lr demonstra que você fine-tunou de verdade, não só leu.',
  },
  {
    level: 'Pleno',
    q: 'Como preparar o dataset para fine-tuning?',
    a: '1. Colete exemplos reais (logs anotados, criados por especialistas).\n2. Limpe: remove PII, duplicatas, malformados.\n3. Formate em ChatML: <|system|>, <|user|>, <|assistant|>.\n4. Split 90/10 train/val (val é OBRIGATÓRIO).\n5. Valide diversidade — amostras homogêneas levam a overfitting.\n\n500–2k exemplos de qualidade superam 100k de lixo.',
    tip: 'Val set obrigatório é o ponto que candidatos que nunca fizeram fine-tuning de verdade ignoram.',
  },
  {
    level: 'Pleno',
    q: 'O que é instruction tuning e como difere do pré-treino?',
    a: 'Pré-treino: aprende a completar texto a partir de bilhões de tokens brutos. Resultado: modelo base.\n\nInstruction tuning (SFT): aprende a seguir instruções formatadas em pergunta-resposta. Transforma modelo base em modelo de chat.\n\nSFTTrainer do TRL é a implementação padrão. Formato ChatML com apply_chat_template() do tokenizer.',
    tip: 'A distinção pré-treino → SFT → RLHF como fases sequenciais é fundamental.',
  },
  {
    level: 'Pleno',
    q: 'Como detectar e corrigir overfitting no fine-tuning?',
    a: 'Sinais: train loss cai mas val loss sobe, modelo repete frases do dataset literalmente.\n\nCorreções:\n• Reduzir r (menos capacidade)\n• Aumentar lora_dropout (mais regularização)\n• Reduzir epochs com early stopping\n• Aumentar e diversificar dataset\n• Adicionar replay de dados gerais (5–10%)\n\nEarly stopping por val loss é o mecanismo mais eficaz.',
    tip: 'Early stopping por val loss (não por número de epochs) é o que separa praticantes reais.',
  },
  {
    level: 'Pleno',
    q: 'O que é o SFTTrainer e por que usar em vez do Trainer padrão?',
    a: 'SFTTrainer (trl) tem recursos específicos para instruction tuning:\n\n• Packing: empacota múltiplos exemplos curtos numa sequência — maximiza GPU utilization\n• Formatting: aplica chat template automaticamente\n• Masking: ignora loss nos tokens de instrução (só computa loss no output do assistente)\n\nTrainer padrão computa loss em todo o input — inclui tokens de instrução, o que distorce o aprendizado.',
    tip: 'Masking dos tokens de instrução é o detalhe técnico que candidatos avançados conhecem.',
  },
  {
    level: 'Senior',
    q: 'O que é DPO e por que é preferível ao RLHF com PPO?',
    a: 'RLHF com PPO requer 3 modelos simultâneos (política, valor, recompensa) + referência. Instável, caro, difícil de treinar.\n\nDPO (Direct Preference Optimization): usa apenas dados de preferência {prompt, chosen, rejected} e um único modelo. Otimiza a política diretamente sem reward model separado.\n\nNa prática: DPO é 2–4× mais simples, mais estável e frequentemente igual ou melhor que PPO.',
    tip: 'Citar SimPO e ORPO como variantes que eliminam até o modelo de referência demonstra que você acompanha a literatura.',
  },
  {
    level: 'Senior',
    q: 'Como o catastrophic forgetting funciona e como LoRA mitiga?',
    a: 'Full fine-tuning atualiza todos os W — o modelo sobrescreve capacidades gerais ao especializar.\n\nLoRA mitiga por design: pesos base W permanecem congelados. Apenas os adapters A e B mudam. O modelo base preserva 100% das capacidades originais.\n\nMitigações adicionais:\n• Replay: 5–10% de dados gerais no training set\n• EWC: penaliza mudanças em pesos importantes\n• Dataset diversificado: não treinar só na tarefa nova',
    tip: '"LoRA é resistente ao catastrophic forgetting por design" é a resposta que diferencia.',
  },
  {
    level: 'Senior',
    q: 'Como fazer merge do adapter LoRA e qual o trade-off?',
    a: 'Merge: model.merge_and_unload() → W_eff = W + (alpha/r)·B·A para cada camada.\n\nVantagem: artefato único, zero overhead em runtime, qualquer servidor de inferência.\n\nAlternativa sem merge — vLLM multi-LoRA:\n• Base compartilhado em GPU uma vez\n• Adapters (50–200 MB cada) carregados por request dinamicamente\n• Ideal para multi-tenant: N clientes com N adapters sobre o mesmo base\n\nvLLM: --enable-lora --max-loras 8 --lora-modules nome=./path',
    tip: 'vLLM multi-LoRA serving é o detalhe de produção que diferencia entrevistas sênior.',
  },
  {
    level: 'Senior',
    q: 'Como estruturar avaliação com LLM-as-judge?',
    a: 'Quando usar: tarefas abertas onde BLEU/ROUGE são insuficientes (geração, reescrita, raciocínio).\n\nPipeline:\n1. Crie holdout set de 100–200 exemplos com resposta esperada\n2. Monte rubrica (1–5 por critério: precisão, tom, formato)\n3. Prompt: sistema com rubrica + query + expected + generated\n4. Use modelo forte como juiz (GPT-4o, Claude 3.5 Sonnet)\n5. Média dos scores = métrica de qualidade\n\nAntipadrão: position bias do LLM — shuffle a ordem das respostas, use múltiplos juízes.',
    tip: 'Position bias (LLM prefere a primeira opção) é o detalhe avançado que impressiona.',
  },
  {
    level: 'Senior',
    q: 'Como usar Unsloth para acelerar fine-tuning?',
    a: 'Unsloth reimplementa os kernels LoRA em Triton: 2–5× mais rápido que PEFT vanilla, 30–50% menos VRAM.\n\nDrop-in replacement: from unsloth import FastLanguageModel. API idêntica ao PEFT + Transformers.\n\nVantagem real: Llama 3.1 8B QLoRA em RTX 3090 cabe e treina em 3h em vez de 6h com PEFT padrão.\n\nSuporte: Llama 3, Mistral, Phi, Gemma, Qwen. Free para uso local.',
    tip: 'Unsloth free vs. Pro e os modelos suportados demonstram que você usou recentemente.',
  },
  {
    level: 'Senior',
    q: 'Como escolher target_modules para LoRA?',
    a: 'Mínimo (rápido, menos eficaz): q_proj + v_proj.\n\nRecomendado (estado da arte): todas as projeções de atenção + MLP:\n["q_proj","k_proj","v_proj","o_proj","gate_proj","up_proj","down_proj"]\n\nPor que MLP importa: as camadas MLP armazenam conhecimento factual. Incluí-las melhora adaptação de domínio.\n\nDica: target_modules=["all-linear"] no PEFT seleciona automaticamente todas as lineares — mais simples.',
    tip: 'target_modules="all-linear" é o atalho que a maioria não conhece.',
  },
  {
    level: 'Senior',
    q: 'Como estruturar pipeline de fine-tuning em produção?',
    a: '1. Dataset versionado (DVC/HF Hub) com hash + metadata\n2. Data validation: schema, distribuição, proporções de classe\n3. Fine-tuning com tracking (W&B, MLflow)\n4. Eval automático no val set antes de qualquer promoção\n5. Gate de qualidade: BLEU/F1/LLM-judge mínimo para staging\n6. A/B test em produção (shadowing ou % de tráfego)\n7. Monitoramento: distribuição de respostas, latência, feedback humano\n\nGate de qualidade no CI/CD é o que separa fine-tuning amador de produção.',
    tip: 'Gate de qualidade (ex: LLM-judge ≥ 3.5/5) antes de promover é o sinal de maturidade.',
  },
  {
    level: 'Senior',
    q: 'O que é continual pre-training e quando precede o SFT?',
    a: 'Continual pre-training: treino no modelo base com textos brutos de um domínio (artigos médicos, código raro, jurídico) para injetar conhecimento de domínio.\n\nQuando usar: domínio muito específico onde o base model tem cobertura mínima de tokens do domínio.\n\nOrdem correta:\nContinual pre-training → SFT → DPO → deploy\n\nSe pular o pre-training em domínios especializados, o SFT tem base fraca e o modelo não generaliza.',
  },
  {
    level: 'Pleno',
    q: 'Como publicar um adapter LoRA no Hugging Face Hub?',
    a: 'from peft import PeftModel\nmodel.push_to_hub("seu-user/adapter-nome")\ntokenizer.push_to_hub("seu-user/adapter-nome")\n\nO adapter (50–200 MB) é publicado com adapter_config.json que referencia o modelo base.\n\nCarregar em outro ambiente:\nbase = AutoModelForCausalLM.from_pretrained("meta-llama/Meta-Llama-3.1-8B")\nmodel = PeftModel.from_pretrained(base, "seu-user/adapter-nome")\n\nVantagem: qualquer pessoa roda sem precisar do treino — só 200 MB de download.',
  },
  {
    level: 'Pleno',
    q: 'O que é packing no SFTTrainer e por que importa?',
    a: 'Packing: concatena múltiplos exemplos curtos em uma sequência de comprimento máximo (ex: 2048 tokens) separados por token especial.\n\nPor que importa: GPUs processam batches de tamanho fixo. Sem packing, exemplos curtos desperdiçam 60–80% da capacidade do batch com padding.\n\nCom packing: utilização de GPU vai de ~30% para ~90%+, acelerando treino 2–3×.\n\nSFTTrainer: packing=True ativa automaticamente.',
    tip: 'GPU utilization de 30% → 90% com uma linha de código é o argumento prático.',
  },
  {
    level: 'Senior',
    q: 'Quais são as alternativas ao LoRA (DoRA, IA3, Prefix Tuning)?',
    a: 'IA3 (Infused Adapter by Inhibiting and Amplifying Inner Activations): ainda menos parâmetros que LoRA (~0,01%). Multiplica ativações internas por vetores aprendidos. Bom para few-shot.\n\nDoRA (Weight-Decomposed LoRA): separa W em magnitude e direção; LoRA apenas atualiza direção. Mais estável que LoRA em alguns domínios.\n\nPrefix Tuning: adiciona tokens "virtuais" treináveis no contexto. Não modifica pesos — bom para multi-task sem merge.\n\nEscolha: LoRA é o padrão para instruction tuning. IA3 para recursos extremamente limitados. DoRA quando LoRA overfita.',
  },
  {
    level: 'Senior',
    q: 'Como avaliar se o fine-tuning melhorou na prática?',
    a: 'Framework de avaliação em camadas:\n\n1. Loss no val set: proxy rápido. Baixo no treino + alto no val = overfit.\n2. Métricas automáticas: BLEU, ROUGE, F1 num holdout de 100–500 exemplos.\n3. LLM-as-judge: para qualidade subjetiva — rubrica 1–5 por GPT-4o.\n4. Human eval: amostra de 20–50 casos críticos revisados por especialistas.\n5. A/B test em produção: shadowmode ou % de tráfego real.\n\nSe nenhuma métrica melhorou: problema está no dataset ou hiperparâmetros, não no LoRA em si.',
    tip: 'Mencionar as 5 camadas em ordem crescente de confiança e custo é a resposta estruturada que impressiona.',
  },
]

// ── CheatSheet ────────────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'W_eff = W + (α/r)·B·A', sig: 'Fórmula central do LoRA', desc: 'W congelado + adapter escalado. alpha/r controla a força do adapter. r=8, alpha=16 é o padrão.' },
  { name: 'r (rank)', sig: '8 padrão · 32+ para domínio novo', desc: 'Maior r = mais capacidade + mais memória + risco de overfit. Comece com 8, aumente se necessário.' },
  { name: 'alpha', sig: 'alpha = 2×r → lr_efetivo = lr × 2', desc: 'Scaling factor. alpha=2×r é regra geral. Aumentar alpha é como aumentar lr só dos adapters.' },
  { name: 'target_modules', sig: 'q/k/v/o_proj + gate/up/down_proj', desc: 'Todas as lineares de atenção + MLP. "all-linear" seleciona automaticamente. Mais camadas = melhor adaptação.' },
  { name: 'QLoRA setup', sig: 'NF4 4-bit + paged AdamW', desc: 'BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4"). Llama 8B em 24GB GPU consumer.' },
  { name: 'SFTTrainer', sig: 'packing=True · masking de instrução', desc: 'packing=True: GPU de 30% → 90% de utilização. Loss só no output do assistente (não no prompt).' },
  { name: 'DPO', sig: '{prompt, chosen, rejected} → DPOTrainer', desc: 'Preferências sem reward model. beta=0.1 (KL penalty). 2× mais simples que PPO.' },
  { name: 'merge_and_unload()', sig: 'adapter → modelo único', desc: 'Funde W + (alpha/r)·B·A. Artefato único sem overhead. Alternativa: vLLM multi-LoRA para multi-tenant.' },
  { name: 'Unsloth', sig: '2–5× mais rápido · 50% menos VRAM', desc: 'from unsloth import FastLanguageModel. Drop-in replacement para PEFT + Transformers.' },
  { name: 'vLLM multi-LoRA', sig: '--enable-lora --max-loras 8', desc: 'Base compartilhado em GPU, adapters carregados por request. Ideal para N clientes, N adapters.' },
  { name: 'LLM-as-judge', sig: 'rubrica 1–5 · GPT-4o · shuffle ordem', desc: 'Para qualidade subjetiva. Shuffle para mitigar position bias. Melhor que BLEU para texto aberto.' },
  { name: 'RATO', sig: 'Rank · Alpha · Target · Optimizer', desc: 'Mnemônico dos 4 hiperparâmetros críticos do LoRA.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'Fine-tune para injetar fatos → modelo decora errado. Use RAG para fatos.' },
  { ok: false, t: 'Dataset sem val split → overfit silencioso. Sempre holdout 10–20%.' },
  { ok: false, t: 'Avaliar só train loss → overfit oculto. Val loss é o sinal real.' },
  { ok: false, t: 'r muito alto com dataset pequeno → overfit clássico. Comece com r=8.' },
  { ok: false, t: 'Esquecer apply_chat_template() → formato incorreto, outputs malformados.' },
  { ok: true, t: 'RATO: r=8→16, alpha=2×r, target=all-linear, lr=2e-4' },
  { ok: true, t: 'Early stopping por val loss — mais eficaz que número fixo de epochs' },
  { ok: true, t: 'LLM-as-judge para qualidade subjetiva — BLEU não captura tudo' },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Hiperparâmetros LoRA',
    trick: 'RATO',
    expansion: [
      ['R — rank (r)', 'Capacidade. r=8 padrão; r=32+ para domínio novo; r=64+ raro.'],
      ['A — alpha', 'Scaling. alpha=2×r é a regra. Força o adapter relativo ao base.'],
      ['T — target_modules', 'Onde aplicar. q/k/v/o_proj de atenção + gate/up/down do MLP.'],
      ['O — Optimizer e lr', 'lr 1e-4 a 3e-4. AdamW 8-bit com QLoRA (paged optimizer).'],
    ],
    explanation: 'RATO cobre os 4 hiperparâmetros que definem 90% do comportamento do LoRA.',
    example: 'r=16, alpha=32, target=all-linear, lr=2e-4 é um excelente ponto de partida.',
    why: 'Em entrevista você precisa recitar os hiperparâmetros e seus valores sem hesitar.',
  },
  {
    label: 'Pipeline de fine-tuning',
    trick: 'DAFED',
    expansion: [
      ['D — Dataset', 'Limpo, ChatML, 500–2k exemplos, split 90/10, val obrigatório.'],
      ['A — Adapter', 'PEFT + LoraConfig + get_peft_model(). print_trainable_parameters().'],
      ['F — Fine-tuning', 'SFTTrainer + packing=True + gradient checkpointing. Monitor val.'],
      ['E — Evaluation', 'BLEU/ROUGE + LLM-as-judge + holdout anotado.'],
      ['D — Deploy', 'merge_and_unload() → único artefato. Ou vLLM multi-LoRA.'],
    ],
    explanation: 'DAFED cobre o pipeline completo de fine-tuning de ponta a ponta em 5 etapas.',
    example: 'Describe each step in 1 sentence: Dataset → Adapter → Fine-tuning → Eval → Deploy.',
    why: 'O pipeline completo é a pergunta mais comum sobre fine-tuning em entrevistas sênior.',
  },
  {
    label: 'Quando NÃO usar fine-tuning',
    trick: 'FEF',
    expansion: [
      ['F — Fatos', 'Não fine-tune para fatos. Modelo decora incorretamente. Use RAG.'],
      ['E — Escala dinâmica', 'Dados que mudam frequentemente → RAG com reindexação incremental.'],
      ['F — First prompt', 'Tente prompt engineering antes. Fine-tuning é o último recurso.'],
    ],
    explanation: 'FEF são os 3 casos onde fine-tuning é a ferramenta errada para o trabalho.',
    example: 'Cliente quer que o modelo saiba o catálogo de produtos → FEF: RAG, não fine-tune.',
    why: 'Saber quando NÃO usar fine-tuning impressiona mais do que saber implementá-lo.',
  },
]

// ── Mindmap ───────────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'LoRA — Algoritmo',
    color: '#f59e0b',
    items: [
      { t: 'delta_W = B·A (d×r × r×d)', k: true },
      { t: 'W_eff = W + (alpha/r)·B·A', k: true },
      { t: 'Pesos base W congelados', k: true },
      { t: 'r=8 padrão, alpha=2×r', k: true },
      { t: 'Checkpoint 50–200 MB', a: true },
      { t: 'Anti-forgetting por design', a: true },
    ],
  },
  {
    label: 'QLoRA',
    color: '#a78bfa',
    items: [
      { t: 'NF4 4-bit quantização', k: true },
      { t: 'Paged AdamW optimizer', k: true },
      { t: '70B em 1× A100 40GB', k: true },
      { t: '7B em RTX 3090 24GB', k: true },
      { t: '1–2% perda de qualidade', a: true },
      { t: 'Unsloth: 2–5× mais rápido', a: true },
    ],
  },
  {
    label: 'Pipeline',
    color: '#22c55e',
    items: [
      { t: 'Dataset: ChatML · 500–2k limpos', k: true },
      { t: 'PEFT: LoraConfig + get_peft_model()', k: true },
      { t: 'SFTTrainer + packing=True', k: true },
      { t: 'Val set 10% + early stopping', k: true },
      { t: 'merge_and_unload() → artefato único', a: true },
      { t: 'vLLM multi-LoRA serving', a: true },
    ],
  },
  {
    label: 'Alignment',
    color: '#38bdf8',
    items: [
      { t: 'SFT: instruction tuning', k: true },
      { t: 'DPO: chosen vs rejected', k: true },
      { t: 'PPO/RLHF: reward model', k: true },
      { t: 'SimPO/ORPO: sem ref model', a: true },
      { t: 'Constitutional AI (Anthropic)', a: true },
      { t: 'beta=0.1 (KL penalty DPO)', a: true },
    ],
  },
  {
    label: 'Avaliação',
    color: '#f97316',
    items: [
      { t: 'Val loss: proxy de overfit', k: true },
      { t: 'BLEU, ROUGE, F1 (automático)', k: true },
      { t: 'LLM-as-judge: rubrica 1–5', k: true },
      { t: 'Holdout 100–500 exemplos', k: true },
      { t: 'A/B test em produção', a: true },
      { t: 'Gate de qualidade no CI/CD', a: true },
    ],
  },
  {
    label: 'Ferramentas',
    color: '#60a5fa',
    items: [
      { t: 'PEFT: LoRA, QLoRA, IA3, DoRA', k: true },
      { t: 'TRL: SFTTrainer, DPOTrainer', k: true },
      { t: 'bitsandbytes: 4-bit QLoRA', k: true },
      { t: 'accelerate: multi-GPU', k: true },
      { t: 'Unsloth: kernels Triton 2–5×', a: true },
      { t: 'W&B / MLflow: tracking', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Explico a fórmula W_eff = W + (alpha/r)·B·A sem hesitar?',
  'Sei os valores padrão de r, alpha, lr para LoRA?',
  'Entendo quando usar QLoRA em vez de LoRA?',
  'Sei configurar PEFT e SFTTrainer para instruction tuning?',
  'Conheço a diferença entre SFT e DPO?',
  'Sei detectar e corrigir overfitting em fine-tuning?',
  'Entendo quando NÃO usar fine-tuning (FEF)?',
  'Sei como fazer merge do adapter e quando usar vLLM multi-LoRA?',
  'Consigo avaliar com LLM-as-judge corretamente?',
  'Conheço ao menos uma alternativa ao LoRA (DoRA, IA3, Prefix)?',
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Fine-tuning com LoRA',
    stackLabel: 'AI Engineering · MLOps',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Fine-tuning com LoRA',
    accentColor: C,
    stackLabel: 'LoRA · QLoRA · PEFT · SFTTrainer',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['peft', 'huggingface/peft — LoraConfig, get_peft_model()'],
        ['trl', 'SFTTrainer, DPOTrainer, PPOTrainer'],
        ['bitsandbytes', '4-bit quantização NF4 para QLoRA'],
        ['accelerate', 'Multi-GPU, mixed precision, FSDP'],
        ['unsloth', '2–5× mais rápido, 50% menos VRAM'],
        ['vllm', 'Multi-LoRA serving — --enable-lora --max-loras'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'packing=True no SFTTrainer: GPU de 30% → 90% de utilização',
        'gradient_checkpointing=True: reduz VRAM durante backprop em 30–50%',
        'Unsloth: mesma qualidade do PEFT com 2–5× mais velocidade e 50% menos VRAM',
        'vLLM multi-LoRA: base compartilhado em GPU, adapters por request — econômico em multi-tenant',
        'Merge pós-treino: zero overhead em inferência, qualquer servidor de serving',
      ],
      patterns: [
        {
          name: 'QLoRA completo — setup',
          code: `from transformers import AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model

bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype="bfloat16",
)
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Meta-Llama-3.1-8B", quantization_config=bnb, device_map="auto"
)
lora = LoraConfig(r=16, lora_alpha=32, target_modules=["all-linear"],
                  lora_dropout=0.05, task_type="CAUSAL_LM")
model = get_peft_model(model, lora)`,
          desc: 'Setup completo QLoRA. Llama 8B cabe em RTX 3090 24GB. "all-linear" seleciona todas as camadas.',
        },
        {
          name: 'SFTTrainer — packing + masking',
          code: `from trl import SFTTrainer, SFTConfig

trainer = SFTTrainer(
    model=model, tokenizer=tokenizer,
    train_dataset=ds["train"], eval_dataset=ds["val"],
    args=SFTConfig(
        output_dir="./out", num_train_epochs=3,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        learning_rate=2e-4, bf16=True,
        gradient_checkpointing=True,
        packing=True,               # ← GPU utilization 30%→90%
        evaluation_strategy="steps",
        load_best_model_at_end=True # ← early stopping por val loss
    ),
)
trainer.train()`,
          desc: 'packing=True é o parâmetro mais impactante. load_best_model_at_end = early stopping automático.',
        },
        {
          name: 'DPO — alinhamento por preferência',
          code: `from trl import DPOTrainer, DPOConfig

dpo_trainer = DPOTrainer(
    model=sft_model,
    ref_model=None,   # None = o próprio model como referência
    args=DPOConfig(
        output_dir="./dpo", num_train_epochs=1,
        learning_rate=5e-5, beta=0.1,  # KL penalty
        bf16=True,
    ),
    train_dataset=dpo_dataset,  # {prompt, chosen, rejected}
    tokenizer=tokenizer,
)
dpo_trainer.train()`,
          desc: 'DPO sem reward model separado. beta=0.1 controla afastamento do ref model. Mais simples que PPO.',
        },
      ],
      mentalModels: [
        'RATO: Rank (capacidade), Alpha (escala), Target (onde), Optimizer (lr)',
        'DAFED: Dataset → Adapter → Fine-tune → Eval → Deploy',
        'FEF: Fatos → RAG. Escala dinâmica → RAG. First → tente prompt antes',
        'LoRA anti-forgetting: base congelado por design — sem risco de perder capacidades gerais',
        'Merge vs multi-LoRA: artefato único (latência zero) vs base compartilhado (multi-tenant)',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Fine-tuning com LoRA',
    stackLabel: 'LoRA · QLoRA · PEFT · Alignment',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Fine-tuning com LoRA',
    stackLabel: 'LoRA · QLoRA · SFT · DPO',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de ir a uma entrevista de AI Engineering.',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function FineTuningLoraPdfs() {
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
