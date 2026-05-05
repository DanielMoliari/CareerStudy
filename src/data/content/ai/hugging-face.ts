import type { SkillContent } from '@/types'

const huggingFace: SkillContent = {
    tagline: 'Plataforma central de modelos open source: hub, datasets, libs, inference, spaces.',
    why: 'HF é o GitHub da AI. Saber transformers, datasets, hub, autotrain, inference endpoints, e ecossistema (PEFT, TRL, accelerate) é essencial pra qualquer AI engineer alem de proprietary APIs.',
    summary: 'Hugging Face oferece: Hub (1M+ modelos, 200k datasets), libs (transformers, datasets, accelerate, peft, trl, diffusers), Inference Endpoints (deploy gerenciado), Spaces (apps Gradio/Streamlit), AutoTrain (fine-tuning UI). Eh standard pra trabalhar com modelos open weights (Llama, Mistral, Qwen, DeepSeek).',
    keypoints: [
      { title: 'Hub', body: 'Modelos versionados como repos Git (com LFS). Cards (README), tags, license, eval results. Pull via from_pretrained("org/model").' },
      { title: 'transformers', body: 'Lib core. AutoModel, AutoTokenizer, pipeline. Suporta PyTorch, TensorFlow, JAX. Trainer pra fine-tune.' },
      { title: 'datasets', body: 'Lib pra carregar/processar datasets. Streaming, mapping, filtering. Cache local.' },
      { title: 'PEFT', body: 'Parameter-Efficient Fine-Tuning. LoRA, QLoRA, Prefix Tuning, IA3. Plugin do transformers.' },
      { title: 'TRL', body: 'Transformers Reinforcement Learning. SFTTrainer, DPOTrainer, PPOTrainer pra alignment.' },
      { title: 'accelerate', body: 'Lib que abstrai multi-GPU, mixed precision, FSDP. Mesmo código roda single GPU ou cluster.' },
      { title: 'Inference Endpoints', body: 'Deploy gerenciado de modelo do hub em GPU. Auto-scaling. Ou Inference API serverless (free com rate limit).' },
      { title: 'Spaces', body: 'Apps web (Gradio, Streamlit) hospedados free. Útil pra demo, A/B test público, prototipo.' },
    ],
    gotchas: [
      'Carregar modelo grande sem device_map="auto" trava em OOM. Use accelerate.',
      'Esquecer de revisar license do modelo — alguns proibem uso comercial.',
      'Tokenizer vs modelo de versões diferentes quebra silenciosamente.',
      'Dataset enorme sem streaming=True estoura disco/RAM.',
      'Inference Endpoints cobra por hora ON, não por request — desliga ou usa serverless.',
      'Subir código com token HF em git — vaza credencial.',
    ],
    interview: [
      { q: 'Por que usar Hugging Face vs API proprietary?', a: '<ul><li><strong>Custo</strong>: self-host fica barato em alta escala.</li><li><strong>Privacidade</strong>: dados não saem da sua infra.</li><li><strong>Customizacao</strong>: fine-tune real, não adapter.</li><li><strong>Liberdade</strong>: não depende de provider, sem deprecation forcada.</li></ul><p>Trade-off: ops mais complexa, qualidade da fronteira (Sonnet/GPT-4o) ainda lidera em raciocinio.</p>' },
      { q: 'Como faria fine-tune em modelo do hub?', a: '<p>Pipeline:</p><ul><li>Carrega base com <code>AutoModelForCausalLM.from_pretrained(...)</code>.</li><li>Aplica LoRA via PEFT.</li><li>Carrega dataset via <code>load_dataset</code>.</li><li>Tokeniza com mesmo tokenizer.</li><li>Trainer/SFTTrainer com training args.</li><li>push_to_hub pra publicar.</li></ul>' },
      { q: 'Diferenca entre Inference API e Inference Endpoints?', a: '<p><strong>Inference API</strong>: serverless, free com rate limit, latência variável, ideal pra prototipo.</p><p><strong>Inference Endpoints</strong>: dedicated GPU instance, latência previsivel, paga por hora, autoscaling. Produção.</p>' },
      { q: 'Como avaliaria qualidade de modelo open source?', a: '<ul><li>Open LLM Leaderboard (HF).</li><li>MMLU, GSM8K, HumanEval pra capacidade.</li><li>Roda eval custom no seu domínio (RAGAS, custom).</li><li>Latência/throughput em hardware target.</li><li>License compatível com seu uso.</li></ul>' },
      { q: 'Como serve modelo HF em produção com baixa latência?', a: '<p>Opcoes:</p><ul><li><strong>vLLM</strong>: serving otimizado (PagedAttention, continuous batching). Maior throughput.</li><li><strong>TGI (Text Generation Inference)</strong>: do HF, simples de subir.</li><li><strong>Quantizar</strong>: GGUF pra CPU, AWQ/GPTQ pra GPU. Reduz memória 2-4x.</li><li><strong>Compile</strong>: torch.compile, ONNX. Latência menor.</li></ul>' },
    ],
    resources: [
      { title: 'Hugging Face docs', url: 'https://huggingface.co/docs', kind: 'docs' },
      { title: 'transformers course', url: 'https://huggingface.co/learn/nlp-course', kind: 'curso' },
      { title: 'Open LLM Leaderboard', url: 'https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard', kind: 'pratica' },
      { title: 'PEFT docs', url: 'https://huggingface.co/docs/peft/', kind: 'docs' },
      { title: 'TRL docs', url: 'https://huggingface.co/docs/trl/', kind: 'docs' },
    ],
  }

export default huggingFace
