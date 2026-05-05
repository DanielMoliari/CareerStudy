import type { SkillContent } from '@/types'

const vllm: SkillContent = {
    tagline: 'Engine de inference de LLM com PagedAttention e continuous batching — alta throughput.',
    why: 'vLLM é padrão pra serving open source de LLM em produção em GPU. Saber PagedAttention e continuous batching mostra que você pensa em performance, não só protótipo.',
    summary: 'vLLM é um engine de serving de LLM open source que aumenta throughput em 10-24x vs HF transformers via PagedAttention (gerencia KV cache como páginas de memória virtual) e continuous batching (substitui requests no batch sem esperar fim). Compativel com OpenAI API, suporta multi-GPU, tensor parallelism, AWQ/GPTQ, multi-LoRA serving.',
    keypoints: [
      { title: 'PagedAttention', body: 'Aloca KV cache em blocos de memória fixos (páginas) ao inves de contíguo. Reduz fragmentação em 96%+. Permite mais requests simultaneos.' },
      { title: 'Continuous batching', body: 'Quando uma sequência termina, outra entra no batch sem esperar. Static batching desperdica GPU; continuous mantem ela cheia.' },
      { title: 'OpenAI-compatible server', body: 'vllm serve <model> sobe API compatível com /v1/chat/completions. Drop-in replacement.' },
      { title: 'Tensor parallelism', body: 'Divide modelo entre GPUs (TP=2, 4, 8). Latência menor; comunicação via NVLink.' },
      { title: 'Quantizacao', body: 'Suporta AWQ, GPTQ, FP8. Roda Llama 70B em 2 A100s ou 1 H100.' },
      { title: 'Multi-LoRA', body: 'Serve modelo base + N adapters LoRA simultaneos. Mesma GPU, varios "personas".' },
      { title: 'Speculative decoding', body: 'Modelo pequeno propoe N tokens, modelo grande verifica em paralelo. Latência 2-3x menor sem perda.' },
      { title: 'Prefix caching', body: 'KV cache de prefixo compartilhado entre requests com mesmo prefixo. Útil pra system prompt fixo.' },
    ],
    gotchas: [
      'Esquecer --max-model-len adequado: vLLM pre-aloca KV cache pra contexto máximo.',
      'tensor parallelism sem NVLink é lento (PCIe gargalo).',
      'AWQ requer modelo pre-quantizado — não quantiza on-the-fly.',
      'Streaming via SSE precisa de reverse proxy correto (Nginx, Cloudflare).',
      'Multi-LoRA tem overhead de switching — se LoRA muda muito, pior que single.',
      'Subir vLLM em GPU compartilhada com outros workloads — degrada throughput.',
    ],
    interview: [
      { q: 'O que é PagedAttention?', a: '<p>Técnica que aplica conceito de memória virtual (paginação) ao KV cache. Em vez de alocar contíguo (e desperdicar quando sequência é menor que esperado), aloca em blocos pequenos (páginas) sob demanda.</p><p>Resultado: fragmentação cai de 60-80%% pra ~4%%, permitindo 2-4x mais requests no mesmo GPU.</p>' },
      { q: 'Diferenca entre static e continuous batching?', a: '<p><strong>Static</strong>: junta N requests, todos esperam o mais lento terminar. GPU subutilizada.</p><p><strong>Continuous</strong>: a cada step, sequências prontas saem e novas entram. GPU mantida cheia. Throughput 5-10x maior.</p>' },
      { q: 'Quando usar tensor parallelism?', a: '<p>Quando modelo não cabe em uma GPU (ex: Llama 70B em fp16 precisa ~140GB). TP=2 divide entre 2 GPUs. Pre-requisito: NVLink ou bandwidth alto entre GPUs, senao comunicação mata performance.</p>' },
      { q: 'Quando usaria vLLM vs TGI vs llama.cpp?', a: '<ul><li><strong>vLLM</strong>: throughput máximo em GPU, multi-LoRA, OpenAI-compat. Produção em escala.</li><li><strong>TGI</strong>: HF, simples, integrado com Inference Endpoints.</li><li><strong>llama.cpp</strong>: CPU/edge, GGUF, single-user.</li></ul>' },
      { q: 'Como configura vLLM pra latência baixa?', a: '<ul><li>Modelo menor ou quantizado (AWQ).</li><li>--max-model-len ajustado (não maior que precisa).</li><li>Tensor parallelism com NVLink.</li><li>Speculative decoding com modelo draft.</li><li>Prefix caching pra system prompt fixo.</li><li>FP8 KV cache em H100.</li></ul>' },
    ],
    resources: [
      { title: 'vLLM docs', url: 'https://docs.vllm.ai/', kind: 'docs' },
      { title: 'vllm-project/vllm (GitHub)', url: 'https://github.com/vllm-project/vllm', kind: 'docs' },
      { title: 'PagedAttention paper', url: 'https://arxiv.org/abs/2309.06180', kind: 'artigo' },
      { title: 'vLLM blog', url: 'https://blog.vllm.ai/', kind: 'artigo' },
    ],
  }

export default vllm
