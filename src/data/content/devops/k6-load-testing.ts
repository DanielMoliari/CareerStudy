import type { SkillContent } from '@/types'

const k6LoadTesting: SkillContent = {
  tagline: "Load test moderno em JS — escrita acessível, integra em CI, válida SLO antes de prod.",
  why: "k6 (Grafana) virou padrão em load test moderno. Senior precisa montar cenario realista (ramp-up, sustain, spike), definir thresholds vinculados a SLO, integrar em CI, e interpretar p95/p99 vs media.",
  summary: "k6 e load testing tool em Go com scripts em JS (ES6+). Escreve cenario como função default que cada VU (virtual user) executa em loop. Suporta scenarios com executores (constant-vus, ramping-vus, constant-arrival-rate, spike), thresholds (assert sobre metric, falha pipeline se quebra), checks (assert por iteracao), saida pra Prometheus/InfluxDB/Grafana Cloud.",
  keypoints: [
    { title: "VU (virtual user)", body: "Cada VU roda a função default em loop. vus: 100 = 100 loops paralelos. Diferente de '100 req/s' — depende da duracao de cada iteracao." },
    { title: "Executors", body: "constant-vus (N VUs por T tempo), ramping-vus (sobe e desce em estagios), constant-arrival-rate (X req/s independente da resposta), ramping-arrival-rate." },
    { title: "Thresholds", body: "thresholds: { http_req_duration: ['p(95)<200'] } — pipeline falha se 5%% das requests passam de 200ms. Vincule diretamente ao SLO." },
    { title: "Cenarios realistas", body: "Cenario simples (smoke), load (carga normal), stress (acima da capacidade pra ver onde quebra), spike (pico repentino), soak (durar horas pra detectar memory leak)." },
  ],
  gotchas: [
    "Testar com 1 VU e achar que e load test — não e teste, e smoke. Load test exige carga.",
    "p50 (mediana) e bom mas p95/p99 são os que importam — usuário do tail e quem reclama.",
    "Open vs closed model: VUs são closed model. Em prod o trafego e open. Use arrival-rate pra simular real.",
    "Rodar load test contra prod sem coordenacao — pode disparar incident, alertas, gastar fatura.",
  ],
  interview: [
    { q: "Como você desenharia load test pra uma API nova?", a: "<p>Roteiro:</p><ul><li>Definir SLO: p95 < 200ms, p99 < 500ms, error rate < 0.1%%, throughput alvo</li><li>Smoke test: 1-5 VUs, 1min, válida cenario funciona</li><li>Load test: carga esperada por 15-30min, válida SLO</li><li>Stress test: rampa até 2-3x esperado, até quebrar</li><li>Spike test: salto repentino pra validar auto-scaling</li><li>Soak test: carga normal por horas, detecta leak</li></ul>" },
  ],
  resources: [
    { title: "k6 Documentation", url: "https://k6.io/docs/", kind: "docs" },
    { title: "k6 Examples", url: "https://k6.io/docs/examples/", kind: "pratica" },
    { title: "Test types (smoke/load/stress/spike/soak)", url: "https://grafana.com/docs/k6/latest/testing-guides/test-types/", kind: "docs" },
  ],
}

export default k6LoadTesting
