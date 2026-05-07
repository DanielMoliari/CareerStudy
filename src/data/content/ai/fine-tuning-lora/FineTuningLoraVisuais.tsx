'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'

// ── Paleta LoRA (âmbar quente) ────────────────────────────────────────────────
const C      = '#f59e0b'   // âmbar — identidade LoRA/fine-tuning
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const AMB    = C
const RED    = '#ef4444'
const SKY    = '#38bdf8'
const PUR    = '#a78bfa'
const ORG    = '#f97316'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Pipeline LoRA interativo (clique em cada etapa)
// Mostra o que acontece dentro de cada passo do fine-tuning — não é possível
// transmitir essa granularidade com texto linear
// ═══════════════════════════════════════════════════════════════════════════════

const PIPELINE_STAGES = [
  {
    idx: 0, color: SKY,
    title: 'Base Model',
    sub: 'Llama 3.1 8B / Mistral 7B',
    body: 'Modelo pré-treinado com bilhões de tokens. Todos os parâmetros W são carregados, mas permanecerão CONGELADOS durante o fine-tuning — a magia do LoRA.',
  },
  {
    idx: 1, color: PUR,
    title: 'QLoRA (opcional)',
    sub: 'NF4 4-bit + paged AdamW',
    body: 'BitsAndBytesConfig quantiza o modelo base em 4-bit NF4 antes de aplicar LoRA. Reduz VRAM de 16 GB para ~6 GB para um modelo 7B. Perda de qualidade: apenas 1–2%.',
  },
  {
    idx: 2, color: AMB,
    title: 'LoRA Adapter',
    sub: 'LoraConfig + get_peft_model()',
    body: 'Para cada W (d×d), insere B(d×r) e A(r×d). Apenas A e B são treinados — r=8 significa ~0,17% dos parâmetros. Target: q_proj, k_proj, v_proj, o_proj, gate_proj, up_proj, down_proj.',
  },
  {
    idx: 3, color: SKY,
    title: 'Dataset + Tokenização',
    sub: 'ChatML · apply_chat_template()',
    body: 'Dataset formatado em ChatML: <|system|> + <|user|> + <|assistant|>. SFTTrainer faz packing de sequências curtas para maximizar utilização de GPU. 500–2k exemplos de qualidade.',
  },
  {
    idx: 4, color: GRN,
    title: 'SFTTrainer',
    sub: 'TRL · gradient checkpointing',
    body: 'Training loop otimizado para instruction tuning. Gradient checkpointing reduz VRAM durante backprop. Monitor val_loss — se subir, pare (early stopping). lr = 1e-4 a 3e-4.',
  },
  {
    idx: 5, color: ORG,
    title: 'Evaluation',
    sub: 'BLEU · ROUGE · LLM-as-judge',
    body: 'Holdout set de 100–500 exemplos. Métricas automáticas (BLEU/ROUGE) para geração. LLM-as-judge para qualidade subjetiva. Val loss é o proxy de overfit mais imediato.',
  },
  {
    idx: 6, color: RED,
    title: 'Merge & Deploy',
    sub: 'merge_and_unload() · vLLM',
    body: 'merge_and_unload(): W_eff = W + (alpha/r)·B·A — gera artefato único sem overhead. Alternativa: vLLM multi-LoRA com base compartilhada e adapters carregados por request.',
  },
]

function LoraPipelineVisual() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ padding: '8px 14px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontSize: 11, color: FGMUTE, textAlign: 'center' }}>
        Clique em cada etapa para entender o que acontece internamente
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={stage.idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => setActive(active === stage.idx ? null : stage.idx)}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: `2px solid ${active === stage.idx ? stage.color : LINE}`,
                background: active === stage.idx ? `${stage.color}20` : CARD,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'center',
                minWidth: 80,
                transition: 'all .2s',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: active === stage.idx ? stage.color : FG, marginBottom: 3 }}>{stage.title}</div>
              <div style={{ fontSize: 9, color: FGMUTE, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.3 }}>{stage.sub}</div>
            </button>
            {i < PIPELINE_STAGES.length - 1 && (
              <div style={{ fontSize: 14, color: FGMUTE, flexShrink: 0 }}>{'→'}</div>
            )}
          </div>
        ))}
      </div>

      {active !== null && (
        <div style={{
          padding: '14px 18px',
          borderRadius: 10,
          background: `${PIPELINE_STAGES[active].color}12`,
          border: `2px solid ${PIPELINE_STAGES[active].color}40`,
          fontSize: 13,
          color: FG,
          lineHeight: 1.7,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: PIPELINE_STAGES[active].color, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            {PIPELINE_STAGES[active].title}
          </div>
          {PIPELINE_STAGES[active].body}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {PIPELINE_STAGES.map(stage => (
          <button
            key={stage.idx}
            onClick={() => setActive(active === stage.idx ? null : stage.idx)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '8px 12px',
              borderRadius: 8,
              border: `1.5px solid ${active === stage.idx ? stage.color : LINE}`,
              background: active === stage.idx ? `${stage.color}10` : CARD,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'all .15s',
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: stage.color, marginTop: 6, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: stage.color }}>{stage.title}</span>
              <span style={{ fontSize: 10, color: FGMUTE, marginLeft: 8, fontFamily: 'JetBrains Mono, monospace' }}>{stage.sub}</span>
              {active === stage.idx && (
                <div style={{ fontSize: 11, color: FG, marginTop: 5, lineHeight: 1.6 }}>{stage.body}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — LoRA vs Full FT vs QLoRA (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const FT_OPTIONS: ComparisonOption[] = [
  { id: 'full',  label: 'Full FT',  sublabel: 'Fine-tuning completo',  color: SKY },
  { id: 'lora',  label: 'LoRA',     sublabel: 'Low-Rank Adaptation',   color: AMB },
  { id: 'qlora', label: 'QLoRA',    sublabel: 'LoRA + 4-bit quant',    color: PUR },
]

const FT_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'params',
    label: 'Parâmetros treinados',
    description: 'Fração dos pesos que são atualizados durante o treino',
    values: {
      full:  { rating: 'poor',      note: '100% — todos os 7B–70B params' },
      lora:  { rating: 'excellent', note: '0,1–1% — só adapters A e B' },
      qlora: { rating: 'excellent', note: '0,1–1% — adapters em bf16' },
    },
  },
  {
    id: 'vram',
    label: 'VRAM para Llama 7B',
    description: 'GPU memory necessária para treino',
    values: {
      full:  { rating: 'poor',      note: '4× A100 80 GB' },
      lora:  { rating: 'good',      note: '1× A100 40 GB' },
      qlora: { rating: 'excellent', note: '1× RTX 3090 24 GB' },
    },
  },
  {
    id: 'qualidade',
    label: 'Qualidade relativa',
    description: 'Performance comparada ao full fine-tuning na mesma tarefa',
    values: {
      full:  { rating: 'excellent', note: '100% — referência' },
      lora:  { rating: 'excellent', note: '95–99% — quase igual' },
      qlora: { rating: 'good',      note: '93–97% — 1–2% a menos' },
    },
  },
  {
    id: 'checkpoint',
    label: 'Tamanho do checkpoint',
    description: 'Artefato salvo após o treino',
    values: {
      full:  { rating: 'poor',      note: '14–140 GB (cópia do modelo)' },
      lora:  { rating: 'excellent', note: '50–200 MB (só adapters)' },
      qlora: { rating: 'excellent', note: '50–200 MB (só adapters)' },
    },
  },
  {
    id: 'forgetting',
    label: 'Catastrophic forgetting',
    description: 'Risco de perder capacidades gerais do modelo base',
    values: {
      full:  { rating: 'poor',      note: 'Alto — todos os pesos mudam' },
      lora:  { rating: 'excellent', note: 'Baixo — base congelado' },
      qlora: { rating: 'excellent', note: 'Baixo — base congelado' },
    },
  },
  {
    id: 'tempo',
    label: 'Tempo de treino (7B, 1k exemplos)',
    description: 'Tempo aproximado em hardware adequado',
    values: {
      full:  { rating: 'poor',      note: 'Dias em cluster' },
      lora:  { rating: 'excellent', note: '2–6 horas em 1× A100' },
      qlora: { rating: 'good',      note: '3–8 horas (overhead quant.)' },
    },
  },
  {
    id: 'custo',
    label: 'Custo de infra',
    description: 'Custo estimado de GPU para treinar e servir',
    values: {
      full:  { rating: 'poor',      note: 'Muito alto — cluster obrigatório' },
      lora:  { rating: 'good',      note: 'Médio — 1 GPU basta' },
      qlora: { rating: 'excellent', note: 'Baixo — GPU consumer serve' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Decision Tree: quando usar fine-tuning?
// ═══════════════════════════════════════════════════════════════════════════════

const DT_ROOT: DTNode = {
  id: 'root',
  question: 'O problema é de dados que mudam frequentemente ou precisam de citação de fonte?',
  children: [
    { label: 'Sim', nodeId: 'use-rag', color: SKY },
    { label: 'Não', nodeId: 'check-style' },
  ],
}

const DT_NODES: Record<string, DTNode> = {
  'use-rag': {
    id: 'use-rag',
    recommendation: 'Use RAG',
    detail: 'Fine-tuning é a ferramenta errada para dados dinâmicos ou quando a fonte precisa ser citada. RAG indexa e recupera fatos atualizados em runtime sem retreino. Combine RAG + fine-tuning se também precisar de estilo.',
    color: SKY,
    icon: '🔍',
  },
  'check-style': {
    id: 'check-style',
    question: 'Precisa de estilo, formato, terminologia interna ou comportamento consistente?',
    children: [
      { label: 'Sim', nodeId: 'check-prompt', color: AMB },
      { label: 'Não (tarefa bem definida)', nodeId: 'check-prompt-only' },
    ],
  },
  'check-prompt': {
    id: 'check-prompt',
    question: 'Já tentou prompt engineering e few-shot? Atingiu o limite?',
    children: [
      { label: 'Sim, prompt não resolveu', nodeId: 'check-size', color: GRN },
      { label: 'Ainda não tentei', nodeId: 'try-prompt', color: ORG },
    ],
  },
  'try-prompt': {
    id: 'try-prompt',
    recommendation: 'Tente prompt engineering primeiro',
    detail: 'Antes de fine-tuning, esgote: system prompt detalhado, few-shot examples (5–20), chain-of-thought. Fine-tuning tem overhead real de dataset, treino e avaliação. Só faça se prompt não resolver.',
    color: ORG,
    icon: '💬',
  },
  'check-prompt-only': {
    id: 'check-prompt-only',
    recommendation: 'Prompt engineering + RAG',
    detail: 'Se a tarefa não exige estilo particular e os dados são externos, a combinação prompt engineering + RAG cobre 80% dos casos sem o overhead de fine-tuning.',
    color: SKY,
    icon: '⚡',
  },
  'check-size': {
    id: 'check-size',
    question: 'Tem GPU com ≥24 GB de VRAM ou budget para cloud GPU?',
    children: [
      { label: 'Sim (A100/H100 ou cloud)', nodeId: 'use-lora', color: AMB },
      { label: 'Não (GPU consumer ≤16GB)', nodeId: 'use-qlora', color: PUR },
    ],
  },
  'use-lora': {
    id: 'use-lora',
    recommendation: 'LoRA (PEFT + SFTTrainer)',
    detail: 'LoRA com r=8–16, target_modules em todas as projeções de atenção + MLP. SFTTrainer do TRL com packing. Monitor val_loss com early stopping. 500–2k exemplos de qualidade.',
    color: AMB,
    icon: '🎯',
  },
  'use-qlora': {
    id: 'use-qlora',
    recommendation: 'QLoRA (4-bit NF4 + LoRA)',
    detail: 'QLoRA: BitsAndBytesConfig com load_in_4bit=True e bnb_4bit_quant_type="nf4". LoRA adapters em bf16. Permite Llama 3.1 8B em uma RTX 3090 24GB. Custo de qualidade: 1–2%.',
    color: PUR,
    icon: '🚀',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Hyperparameter tutor interativo
// Mostra o efeito de cada hiperparâmetro de forma visual — muito melhor que tabela
// ═══════════════════════════════════════════════════════════════════════════════

const HYPERPARAMS = [
  {
    id: 'r',
    name: 'rank (r)',
    default: '8',
    range: '4 → 128',
    color: AMB,
    low: { val: 'r=4', effect: 'Menor capacidade. Menos memória. Suficiente para tarefas simples (estilo, formato).' },
    med: { val: 'r=8–16', effect: 'Padrão. Equilibrio ideal entre capacidade e eficiência para instruction tuning geral.' },
    high: { val: 'r=32–64', effect: 'Maior capacidade. Necessário para domínios novos complexos. Risco de overfit com dataset pequeno.' },
    formula: 'params_lora = 2 × r × d × num_layers',
  },
  {
    id: 'alpha',
    name: 'alpha',
    default: '16 (= 2×r)',
    range: 'geralmente 2×r',
    color: PUR,
    low: { val: 'alpha < r', effect: 'Adapter tem influência fraca. Treino pode ser lento para convergir.' },
    med: { val: 'alpha = 2×r', effect: 'Regra de ouro. Learning rate efetivo do adapter = lr × (alpha/r) = lr × 2. Padrão na maioria dos projetos.' },
    high: { val: 'alpha > 4×r', effect: 'Adapter domina muito. Pode sobrescrever o modelo base. Use com cautela.' },
    formula: 'W_eff = W + (alpha/r) × B × A',
  },
  {
    id: 'lr',
    name: 'Learning Rate',
    default: '2e-4',
    range: '1e-5 → 5e-4',
    color: SKY,
    low: { val: '1e-5', effect: 'Muito baixo para LoRA. Adapters convergem lentamente. Use para DPO ou fine-tuning de comportamento sutil.' },
    med: { val: '1e-4 a 3e-4', effect: 'Faixa ideal para LoRA. Maior que full FT pois apenas adapters mudam.' },
    high: { val: '> 5e-4', effect: 'Instabilidade no treino. Loss oscila. Gradients explodem. Reduza 10×.' },
    formula: 'lr_efetivo ≈ lr × (alpha/r)',
  },
  {
    id: 'dropout',
    name: 'lora_dropout',
    default: '0.05',
    range: '0 → 0.3',
    color: GRN,
    low: { val: '0', effect: 'Sem regularização. Risco de overfit em datasets pequenos (<500 exemplos).' },
    med: { val: '0.05–0.1', effect: 'Regularização leve. Padrão. Reduz overfit sem impactar muito a convergência.' },
    high: { val: '0.2–0.3', effect: 'Regularização forte. Útil para datasets muito pequenos (<200 exemplos).' },
    formula: 'Zere no merge: model.merge_and_unload()',
  },
]

function HyperparamTutor() {
  const [activeId, setActiveId] = useState<string>('r')
  const active = HYPERPARAMS.find(h => h.id === activeId)!

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center' }}>
        Selecione um hiperparâmetro para ver seu efeito em baixo, médio e alto valor
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {HYPERPARAMS.map(h => (
          <button
            key={h.id}
            onClick={() => setActiveId(h.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: `2px solid ${activeId === h.id ? h.color : LINE}`,
              background: activeId === h.id ? `${h.color}20` : CARD,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all .2s',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: activeId === h.id ? h.color : FG }}>{h.name}</div>
            <div style={{ fontSize: 10, color: FGMUTE }}>padrão: {h.default}</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Baixo', data: active.low, icon: '↓' },
            { label: 'Ideal (padrão)', data: active.med, icon: '→' },
            { label: 'Alto', data: active.high, icon: '↑' },
          ].map(({ label, data, icon }) => (
            <div key={label} style={{
              padding: '12px 14px',
              borderRadius: 8,
              background: CARD,
              border: `1px solid ${active.color}30`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: active.color, marginBottom: 4 }}>{icon} {label}</div>
              <div style={{ fontSize: 11, color: FG, fontWeight: 600, marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>{data.val}</div>
              <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.5 }}>{data.effect}</div>
            </div>
          ))}
        </div>

        <div style={{
          padding: '10px 14px',
          borderRadius: 8,
          background: `${active.color}12`,
          border: `1px solid ${active.color}30`,
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
          color: active.color,
        }}>
          <strong style={{ color: FG }}>Fórmula: </strong>{active.formula}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Arquitetura LoRA em Layers (LayerStack)
// Visualiza as camadas do modelo e onde os adapters são inseridos
// ═══════════════════════════════════════════════════════════════════════════════

const LORA_LAYERS: Layer[] = [
  {
    id: 'embeddings',
    label: 'Input Embeddings',
    sublabel: 'tokens → vetores d-dimensional',
    description: 'Token Embedding mapeia cada token para um vetor d-dimensional. Position Embedding adiciona informação de posição.',
    color: '#64748b',
    examples: ['Token Embedding (vocab × d)', 'Position Embedding', 'Layer Norm'],
  },
  {
    id: 'transformer',
    label: 'Transformer Block (× N)',
    sublabel: 'onde LoRA é inserido',
    description: 'Cada bloco contém Self-Attention e MLP. LoRA é inserido nas projeções Q, K, V, O da atenção e nas camadas MLP.',
    color: AMB,
    examples: [
      'Self-Attention: Q, K, V, O projections ← LoRA aqui',
      'MLP: gate_proj, up_proj, down_proj ← LoRA aqui',
      'Layer Norm (RMSNorm)',
      'Residual connections (pesos base congelados)',
    ],
  },
  {
    id: 'adapter',
    label: 'LoRA Adapter (por camada)',
    sublabel: 'B (d×r) · A (r×d) — treinável',
    description: 'Apenas B e A são treinados. B inicia em zero (delta_W=0), A inicia aleatório. Scaling controlado por alpha/r.',
    color: GRN,
    examples: [
      'A: inicializado aleatório (Gaussian)',
      'B: inicializado em zero (delta_W=0 no início)',
      'Scaling: (alpha/r) × B × A',
      'Merge pós-treino: W_eff = W + scaling × B × A',
    ],
  },
  {
    id: 'head',
    label: 'LM Head / Task Head',
    sublabel: 'output do modelo',
    description: 'Linear projeta de d para vocab size. Softmax gera distribuição de probabilidade. Sampling ou greedy decodifica tokens.',
    color: SKY,
    examples: ['Linear (d → vocab)', 'Softmax → probabilidades', 'Greedy / sampling → tokens'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function FineTuningLoraVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'lora-pipeline',
      title: 'Pipeline LoRA',
      subtitle: 'Base Model → QLoRA → Adapter → Dataset → SFTTrainer → Eval → Deploy — clique em cada etapa',
      accent: C,
      component: <LoraPipelineVisual />,
    },
    {
      id: 'lora-comparison',
      title: 'LoRA vs Full FT vs QLoRA',
      subtitle: 'Comparação multidimensional: parâmetros, VRAM, qualidade, tempo, custo',
      accent: AMB,
      component: (
        <ComparisonTable
          options={FT_OPTIONS}
          criteria={FT_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'lora-decision',
      title: 'Quando usar fine-tuning?',
      subtitle: 'Árvore de decisão: RAG, prompt engineering, LoRA ou QLoRA',
      accent: GRN,
      component: (
        <DecisionTree
          root={DT_ROOT}
          nodes={DT_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'lora-hyperparams',
      title: 'Hiperparâmetros LoRA',
      subtitle: 'Efeito de r, alpha, learning rate e dropout — baixo, ideal e alto',
      accent: PUR,
      component: <HyperparamTutor />,
    },
    {
      id: 'lora-layers',
      title: 'Arquitetura — onde LoRA entra',
      subtitle: 'Camadas do Transformer e os pontos de injeção dos adapters A e B',
      accent: GRN,
      component: (
        <LayerStack
          layers={LORA_LAYERS}
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
