'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'

// ── Paleta HF (amarelo Hugging Face) ──────────────────────────────────────────
const C      = '#ffcc00'   // amarelo HF — cor oficial do Hugging Face
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const AMB    = '#f59e0b'
const RED    = '#ef4444'
const SKY    = '#38bdf8'
const PUR    = '#a78bfa'
const ORG    = '#f97316'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Mapa interativo do ecossistema HF
// Cada lib tem seu propósito — um diagrama textual não transmite as relações
// ═══════════════════════════════════════════════════════════════════════════════

const HF_LIBS = [
  {
    id: 'hub',
    name: 'Hub',
    color: C,
    icon: '🤗',
    tagline: '1M+ modelos · 200k datasets',
    body: 'Repositório central. Modelos e datasets versionados com Git + LFS. Model cards com license, eval results, tags. from_pretrained("org/model") — download automático e cache local.',
    commands: ['from_pretrained("org/model")', 'push_to_hub("user/model")', 'huggingface-cli login'],
  },
  {
    id: 'transformers',
    name: 'transformers',
    color: ORG,
    icon: '🔥',
    tagline: 'Core library — AutoModel, pipeline, Trainer',
    body: 'Lib central. AutoModel (8 variantes por tarefa), AutoTokenizer, pipeline() API alto nível. apply_chat_template() para formato correto de chat. Suporta PyTorch, TF, JAX. Trainer para fine-tuning completo.',
    commands: ['AutoModelForCausalLM.from_pretrained()', 'pipeline("text-generation")', 'tokenizer.apply_chat_template()'],
  },
  {
    id: 'datasets',
    name: 'datasets',
    color: SKY,
    icon: '📦',
    tagline: 'Carregamento e processamento em escala',
    body: 'load_dataset() suporta HF Hub, local e streaming. streaming=True para datasets que não cabem em disco. Map/filter/shuffle paralelos (num_proc=N). Cache inteligente — processa uma vez, reutiliza sempre.',
    commands: ['load_dataset("squad")', 'ds.map(fn, batched=True)', 'ds.push_to_hub("user/ds")'],
  },
  {
    id: 'peft',
    name: 'PEFT',
    color: PUR,
    icon: '🎯',
    tagline: 'Fine-tuning com 0,1% dos parâmetros',
    body: 'Parameter-Efficient Fine-Tuning. LoRA, QLoRA, IA3, DoRA, Prefix Tuning. LoraConfig + get_peft_model() em qualquer modelo do Hub. print_trainable_parameters() para sanidade.',
    commands: ['LoraConfig(r=16, lora_alpha=32)', 'get_peft_model(model, lora_config)', 'peft_model.push_to_hub()'],
  },
  {
    id: 'trl',
    name: 'TRL',
    color: AMB,
    icon: '🏆',
    tagline: 'Alignment — SFT, DPO, RLHF',
    body: 'Transformers Reinforcement Learning. SFTTrainer para instruction tuning (packing, masking), DPOTrainer para preferências sem reward model, PPOTrainer para RLHF completo. Construído sobre PEFT + transformers.',
    commands: ['SFTTrainer(model, tokenizer, ...)', 'DPOTrainer(model, ref_model=None)', 'trainer.train()'],
  },
  {
    id: 'accelerate',
    name: 'accelerate',
    color: GRN,
    icon: '⚡',
    tagline: 'Multi-GPU e distributed training',
    body: 'Abstrai complexidade: mesmo código em single GPU, multi-GPU, TPU, cluster. Mixed precision (bf16/fp16), FSDP, DeepSpeed. accelerate config → wizard interativo. accelerate launch script.py.',
    commands: ['Accelerator(mixed_precision="bf16")', 'accelerator.prepare(model, opt, dl)', 'accelerate launch train.py'],
  },
]

function HfEcosystemVisual() {
  const [active, setActive] = useState<string | null>(null)

  const activeLib = HF_LIBS.find(l => l.id === active) ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center' }}>
        Clique em cada lib para ver propósito, recursos e comandos principais
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {HF_LIBS.map(lib => (
          <button
            key={lib.id}
            onClick={() => setActive(active === lib.id ? null : lib.id)}
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              border: `2px solid ${active === lib.id ? lib.color : LINE}`,
              background: active === lib.id ? `${lib.color}20` : CARD,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'all .2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>{lib.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: active === lib.id ? lib.color : FG }}>{lib.name}</span>
            </div>
            <div style={{ fontSize: 10, color: FGMUTE, lineHeight: 1.4 }}>{lib.tagline}</div>
          </button>
        ))}
      </div>

      {activeLib && (
        <div style={{
          padding: '16px 18px',
          borderRadius: 10,
          background: `${activeLib.color}10`,
          border: `2px solid ${activeLib.color}40`,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{activeLib.icon}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: activeLib.color }}>{activeLib.name}</div>
              <div style={{ fontSize: 11, color: FGMUTE }}>{activeLib.tagline}</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: FG, lineHeight: 1.7 }}>{activeLib.body}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {activeLib.commands.map(cmd => (
              <div key={cmd} style={{
                padding: '5px 10px',
                borderRadius: 6,
                background: CARD,
                border: `1px solid ${activeLib.color}30`,
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace',
                color: activeLib.color,
              }}>
                {cmd}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '10px 14px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontSize: 11, color: FGMUTE, textAlign: 'center' }}>
        Relação: Hub hospeda modelos → transformers os carrega → PEFT/TRL os ajusta → accelerate os distribui → Inference Endpoints os serve
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — AutoModel: qual classe usar para cada tarefa
// Erro comum: usar a classe errada resulta em falha silenciosa
// ═══════════════════════════════════════════════════════════════════════════════

const AUTO_MODEL_TASKS = [
  { cls: 'AutoModelForCausalLM', task: 'Geração de texto', models: 'Llama 3, Mistral, Qwen, GPT-2', color: C, example: 'pipeline("text-generation")', head: 'LM Head (vocab)' },
  { cls: 'AutoModelForSeq2SeqLM', task: 'Tradução · Resumo', models: 'T5, BART, mT5, PEGASUS', color: SKY, example: 'pipeline("summarization")', head: 'Encoder-Decoder Head' },
  { cls: 'AutoModelForSequenceClassification', task: 'Classificação de texto', models: 'BERT, RoBERTa, DeBERTa', color: GRN, example: 'pipeline("sentiment-analysis")', head: 'Linear (n_labels)' },
  { cls: 'AutoModelForTokenClassification', task: 'NER · POS tagging', models: 'BERT-NER, mBERT', color: AMB, example: 'pipeline("ner")', head: 'Linear por token' },
  { cls: 'AutoModelForQuestionAnswering', task: 'QA extrativa (spans)', models: 'BERT-SQuAD, DistilBERT', color: PUR, example: 'pipeline("question-answering")', head: 'Start/End position' },
  { cls: 'AutoModel', task: 'Embeddings brutos', models: 'BERT, E5, BGE', color: FGMUTE, example: 'model(**inputs).last_hidden_state', head: 'Sem head (features)' },
]

function AutoModelVisual() {
  const [selected, setSelected] = useState<string | null>('AutoModelForCausalLM')

  const active = AUTO_MODEL_TASKS.find(t => t.cls === selected) ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center' }}>
        Escolha a classe AutoModel correta — usar a errada resulta em falha silenciosa
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {AUTO_MODEL_TASKS.map(t => (
          <button
            key={t.cls}
            onClick={() => setSelected(selected === t.cls ? null : t.cls)}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: `2px solid ${selected === t.cls ? t.color : LINE}`,
              background: selected === t.cls ? `${t.color}15` : CARD,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'all .2s',
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: t.color, marginBottom: 2, fontFamily: 'JetBrains Mono, monospace' }}>
              {t.cls}
            </div>
            <div style={{ fontSize: 11, color: FG }}>{t.task}</div>
          </button>
        ))}
      </div>

      {active && (
        <div style={{
          padding: '14px 16px',
          borderRadius: 10,
          background: `${active.color}10`,
          border: `2px solid ${active.color}40`,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: active.color, marginBottom: 6 }}>CLASSE</div>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: FG, marginBottom: 10 }}>{active.cls}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: active.color, marginBottom: 4 }}>TAREFA</div>
            <div style={{ fontSize: 11, color: FG, marginBottom: 10 }}>{active.task}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: active.color, marginBottom: 4 }}>HEAD ADICIONADA</div>
            <div style={{ fontSize: 11, color: FGMUTE }}>{active.head}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: active.color, marginBottom: 6 }}>MODELOS TÍPICOS</div>
            <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 10 }}>{active.models}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: active.color, marginBottom: 6 }}>EXEMPLO PIPELINE</div>
            <div style={{
              padding: '6px 10px',
              borderRadius: 6,
              background: CARD,
              border: `1px solid ${active.color}30`,
              fontSize: 10,
              fontFamily: 'JetBrains Mono, monospace',
              color: active.color,
            }}>
              {active.example}
            </div>
          </div>
        </div>
      )}

      <div style={{
        padding: '10px 14px', borderRadius: 8, background: CARD, border: `1px solid ${RED}30`,
        fontSize: 11, color: FGMUTE, display: 'flex', gap: 8, alignItems: 'flex-start',
      }}>
        <span style={{ color: RED, fontWeight: 700 }}>⚠</span>
        <span>Usar a classe errada não gera erro — resulta em output malformado ou performance degradada silenciosamente. AutoModelForCausalLM para classificação = sem head linear, output incorreto.</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — HF vs APIs proprietárias (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const API_OPTIONS: ComparisonOption[] = [
  { id: 'hf',       label: 'HF Open Source', sublabel: 'Self-hosted + Hub',         color: C },
  { id: 'openai',   label: 'OpenAI API',      sublabel: 'GPT-4o, embeddings',        color: GRN },
  { id: 'anthropic', label: 'Anthropic API',  sublabel: 'Claude 3.5 Sonnet',         color: PUR },
]

const API_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'custo-escala',
    label: 'Custo em alta escala (1B+ tokens/mês)',
    description: 'Comparação de custo para volume produção',
    values: {
      hf:       { rating: 'excellent', note: 'Self-host amortiza: GPU $1–3/h vs $10/1M tokens' },
      openai:   { rating: 'fair',      note: '$2.5–10/1M tokens de input' },
      anthropic: { rating: 'fair',     note: '$3–15/1M tokens de input' },
    },
  },
  {
    id: 'privacidade',
    label: 'Privacidade e conformidade (dados sensíveis)',
    description: 'Dados que não podem sair da infra',
    values: {
      hf:       { rating: 'excellent', note: 'Self-hosted: dados ficam na sua VPC' },
      openai:   { rating: 'poor',      note: 'Dados enviados para servidores OpenAI' },
      anthropic: { rating: 'poor',     note: 'Dados enviados para servidores Anthropic' },
    },
  },
  {
    id: 'qualidade',
    label: 'Qualidade em raciocínio geral',
    description: 'Benchmarks MMLU, GSM8K, HumanEval',
    values: {
      hf:       { rating: 'good',      note: 'Llama 3.1 405B ≈ GPT-4. 8B fica atrás.' },
      openai:   { rating: 'excellent', note: 'GPT-4o lidera em raciocínio geral' },
      anthropic: { rating: 'excellent', note: 'Claude 3.5 Sonnet: código e análise excelentes' },
    },
  },
  {
    id: 'customizacao',
    label: 'Customização e fine-tuning',
    description: 'Adaptar o modelo para domínio específico',
    values: {
      hf:       { rating: 'excellent', note: 'LoRA, QLoRA, DPO — controle total' },
      openai:   { rating: 'fair',      note: 'Fine-tuning limitado via API ($$$)' },
      anthropic: { rating: 'poor',     note: 'Sem fine-tuning público' },
    },
  },
  {
    id: 'latencia',
    label: 'Latência e confiabilidade',
    description: 'p99 latency e SLA de produção',
    values: {
      hf:       { rating: 'fair',      note: 'Depende da infra — pode ser ótimo ou ruim' },
      openai:   { rating: 'excellent', note: 'SLA robusto, ~200–500ms p99 para GPT-4o' },
      anthropic: { rating: 'excellent', note: 'SLA robusto, API confiável' },
    },
  },
  {
    id: 'ops',
    label: 'Complexidade operacional',
    description: 'Custo de equipe e manutenção',
    values: {
      hf:       { rating: 'poor',      note: 'Ops de GPU, serving, monitoring — equipe necessária' },
      openai:   { rating: 'excellent', note: 'Zero ops — só usar a API' },
      anthropic: { rating: 'excellent', note: 'Zero ops — só usar a API' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Stack de deploy (LayerStack)
// Mostra as opções de serving de modelo HF em produção
// ═══════════════════════════════════════════════════════════════════════════════

const DEPLOY_LAYERS: Layer[] = [
  {
    label: 'Modelo no Hub',
    sublabel: 'modelo base ou adapter LoRA publicado',
    color: C,
    items: [
      'from_pretrained("org/model") — download e cache',
      'Safetensors (seguro) ou pickle (legado)',
      'Versões via tags git — revision="v1.2"',
      'Model card com license e eval results',
    ],
  },
  {
    label: 'Serving Framework',
    sublabel: 'escolha baseada em throughput vs. simplicidade',
    color: AMB,
    items: [
      'vLLM: PagedAttention + continuous batching — maior throughput',
      'TGI (Text Generation Inference): HF oficial, simples de configurar',
      'llama.cpp: GGUF quantizado, CPU-friendly, zero GPU',
      'Transformers pipeline: prototipagem, baixo volume',
    ],
  },
  {
    label: 'Quantização (opcional)',
    sublabel: 'reduz memória 2–4× com perda mínima de qualidade',
    color: PUR,
    items: [
      'AWQ: GPU, melhor qualidade/tamanho, supported by vLLM',
      'GPTQ: GPU, alternativa ao AWQ',
      'GGUF: CPU + GPU offload, llama.cpp',
      'NF4 (QLoRA): só para treino, não serving',
    ],
  },
  {
    label: 'Infraestrutura',
    sublabel: 'onde roda o serving',
    color: GRN,
    items: [
      'Inference Endpoints (HF): GPU dedicada, autoscaling, zero ops',
      'EC2 G5 / G6 (AWS): controle total, custo previsível',
      'RunPod / Lambda Labs: spot GPU barata para dev/staging',
      'Spaces (HF): demos gratuitos, Gradio/Streamlit, GPU paga',
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function HuggingFaceVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'hf-ecosystem',
      title: 'Ecossistema HF',
      subtitle: 'Hub, transformers, datasets, PEFT, TRL, accelerate — clique em cada lib para ver propósito e comandos',
      accent: C,
      component: <HfEcosystemVisual />,
    },
    {
      id: 'hf-automodel',
      title: 'AutoModel — Qual classe usar?',
      subtitle: 'Mapa de classes por tarefa: geração, classificação, NER, QA, embeddings',
      accent: ORG,
      component: <AutoModelVisual />,
    },
    {
      id: 'hf-vs-api',
      title: 'HF Open Source vs APIs Proprietárias',
      subtitle: 'Comparação em custo, privacidade, qualidade, customização, ops',
      accent: C,
      component: (
        <ComparisonTable
          options={API_OPTIONS}
          criteria={API_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'hf-deploy',
      title: 'Stack de Deploy',
      subtitle: 'Do modelo no Hub até produção: serving, quantização e infraestrutura',
      accent: GRN,
      component: (
        <LayerStack
          layers={DEPLOY_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
