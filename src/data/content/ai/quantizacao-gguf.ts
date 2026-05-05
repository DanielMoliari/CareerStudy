import type { SkillContent } from '@/types'

const quantizacaoGguf: SkillContent = {
    tagline: 'Compressao de pesos em 2-8 bits pra rodar LLM em CPU/edge com pouca perda.',
    why: 'Permite rodar Llama 70B em laptop, ou 7B no celular. Saber níveis (Q4_K_M, Q5, Q8) e trade-offs é diferencial em entrevistas que tocam edge AI ou self-host.',
    summary: 'Quantizacao reduz precisão dos pesos do modelo (fp16 -> int8 -> int4...). GGUF é o formato do llama.cpp, sucessor do GGML. Suporta varios níveis (Q2_K até Q8_0). Inference em CPU vira viavel; GPU continua melhor mas com menos VRAM. Trade-off: velocidade/memória vs qualidade.',
    keypoints: [
      { title: 'GGUF format', body: 'Container binario com metadados (arquitetura, tokenizer, params) + tensores quantizados. Usado pelo llama.cpp.' },
      { title: 'Niveis de quantizacao', body: 'Q2_K (mais comprimido, qualidade pior), Q4_K_M (sweet spot), Q5_K_M, Q6_K, Q8_0 (quase fp16). K significa "k-quants", melhor que legacy.' },
      { title: 'PPL (perplexity)', body: 'Metrica chave: quanto modelo quantizado erra mais que fp16. Q4_K_M tipicamente +2% PPL — quase imperceptivel em uso.' },
      { title: 'llama.cpp', body: 'Engine C/C++ pra rodar GGUF. CPU eficiente, GPU via CUDA/Metal/Vulkan. Base de Ollama, LM Studio, jan.ai.' },
      { title: 'AWQ e GPTQ', body: 'Outros métodos de quantizacao pra GPU (calibracao com sample). Melhor que round-to-nearest. AWQ tende a vencer.' },
      { title: 'Quantization-aware training', body: 'Treinar já considerando quantizacao reduz perda. Mais caro; raro em LLM grande.' },
      { title: 'KV cache quantization', body: 'Quantizar também o KV cache (q4, q8) reduz memória de contexto longo. llama.cpp suporta.' },
      { title: 'Quando NÃO quantizar', body: 'Tarefas matematicas precisas, geracao longa coerente, raciocinio complexo. Quantizacao agressiva degrada perceptivelmente.' },
    ],
    gotchas: [
      'Q2_K em modelo pequeno (7B) degrada muito; Q4_K_M é o mínimo razoavel.',
      'Mistura quantizacao com GPU sem suporte adequado — Metal não roda Q4_K_M com mesma eficiencia que CUDA.',
      'Comparar PPL de modelos diferentes não faz sentido — só dentro do mesmo modelo, níveis diferentes.',
      'Esquecer que tokenizer é independente do quantization — precisa do mesmo.',
      'Quantizar a partir de modelo já quantizado (double quant) destroi qualidade.',
      'KV cache em q4 perde qualidade em contexto > 16k.',
    ],
    interview: [
      { q: 'O que significa Q4_K_M?', a: '<p>Quantizacao de 4 bits, K-quants (mais novos, melhor que legacy), variante Medium. Cada peso vira ~4 bits + escala/zero per-block. Reduz memória ~4x vs fp16 com perda de qualidade pequena (PPL +1-2%%).</p><p>Eh o sweet spot: melhor relação tamanho/qualidade pra maioria dos casos.</p>' },
      { q: 'Diferenca entre GGUF, AWQ e GPTQ?', a: '<ul><li><strong>GGUF</strong>: formato + quantizacao do llama.cpp. Foco em CPU/cross-platform.</li><li><strong>AWQ</strong>: Activation-aware Weight Quantization. GPU. Calibrado com dataset.</li><li><strong>GPTQ</strong>: similar AWQ, mais antigo. GPU.</li></ul><p>Pra CPU/edge: GGUF. Pra GPU produção: AWQ ou GPTQ via vLLM/TGI.</p>' },
      { q: 'Quando vale quantizar?', a: '<ul><li>Self-host com VRAM limitada.</li><li>Edge (CPU, mobile).</li><li>Reduzir custo de GPU (cabe modelo maior).</li><li>Latência: menos memória = mais cache hit, mais throughput.</li></ul><p>Não vale se você já roda em API gerenciada ou se a tarefa é muito sensível a precisão.</p>' },
      { q: 'Como mediria perda de qualidade?', a: '<p>Trio:</p><ul><li><strong>PPL</strong> em dataset de validação (wikitext, custom).</li><li><strong>Benchmarks</strong> (MMLU, GSM8K, HumanEval) — a quantizacao impacta mais raciocinio.</li><li><strong>Human eval</strong> em sample de prompts reais — final word é sempre output qualitativo.</li></ul>' },
      { q: 'Como roda GGUF em produção?', a: '<p>Opcoes:</p><ul><li><strong>llama.cpp server</strong>: HTTP server simples.</li><li><strong>Ollama</strong>: wrapper amigavel, modelo registry.</li><li><strong>LM Studio / jan</strong>: desktop.</li></ul><p>Pra escala, vLLM com AWQ vence GGUF em GPU. GGUF brilha em CPU e edge.</p>' },
    ],
    resources: [
      { title: 'llama.cpp (GitHub)', url: 'https://github.com/ggerganov/llama.cpp', kind: 'docs' },
      { title: 'GGUF spec', url: 'https://github.com/ggerganov/ggml/blob/master/docs/gguf.md', kind: 'docs' },
      { title: 'Hugging Face — Quantization', url: 'https://huggingface.co/docs/transformers/main/en/quantization/overview', kind: 'docs' },
      { title: 'Maxime Labonne — quantization guide', url: 'https://mlabonne.github.io/blog/posts/Quantize_Llama_2_models_using_ggml.html', kind: 'artigo' },
    ],
  }

export default quantizacaoGguf
