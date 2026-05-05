import type { SkillContent } from '@/types'

const featureFlags: SkillContent = {
  tagline: "Toggles em runtime que separam deploy de release — base de continuous delivery moderno.",
  why: "Feature flags virou prática obrigatória em time que deploy varias vezes ao dia. Senior precisa explicar tipos de flag (release, experiment, ops, permission), tradeoff de tech debt (flag stale), integração com canary/A-B test.",
  summary: "Feature flag e um switch em runtime que liga/desliga código sem deploy. Quatro categorias (Pete Hodgson): release toggles (cobrir deploy incompleto), experiment toggles (A/B test), ops toggles (kill switch, circuit breaker), permission toggles (entitlement, feature pago). Implementação vai de simples (if config.feature_x) até plataformas (LaunchDarkly, Unleash, Flagsmith, ConfigCat).",
  keypoints: [
    { title: "Tipos de flag (Pete Hodgson)", body: "Release (curta, some após 100%% rollout), experiment (A/B, dura semanas), ops (kill switch, perm), permission (perm, parte do produto). Cada um tem ciclo de vida e dono diferente." },
    { title: "Targeting", body: "Avaliacao por user ID, segmento (paid, beta, country), porcentagem (rollout 5%%, 25%%, 50%%, 100%%). Hash determinista do user ID garante usuário sempre cai no mesmo bucket." },
    { title: "Kill switch", body: "Ops toggle pra desligar feature em incidente sem rollback de código. Toda feature crítica deveria ter um. Tempo de resposta cai de minutos (rollback) pra segundos (toggle)." },
    { title: "Flag debt", body: "Flag esquecida vira bomba. Cada flag e branch lógico = teste exponencial. Politica: flag de release tem TTL de 30 dias, ferramenta lista flags stale, sprint de cleanup mensal." },
    { title: "Trunk-based dev", body: "Flag permite merge continuo de código incompleto sem expor pro user. Combina com main protected, deploy continuo, rollback via flag." },
  ],
  gotchas: [
    "Flag stale acumulada — código cheio de if flag que sempre retorna true. Cleanup planeado e parte da feature.",
    "Flag em path crítico sem fallback — se serviço de flag cair, tudo cai. SDK precisa de cache local + default sane.",
    "Avaliacao em loop — chamar flags.is_on dentro de loop apertado. Avalie uma vez no inicio da request.",
    "Flag sem owner — ninguem sabe se da pra remover. Tag de owner + ticket no rollout.",
    "A/B sem rigor estatistico — 'vencedor' com p-value 0.3 e ruido.",
  ],
  interview: [
    { q: "Por que separar deploy de release?", a: "<p>Deploy = colocar código em prod. Release = expor feature pro user. Acoplar os dois força rollback completo (perigoso, lento) quando feature da problema, e impede merge incremental.</p><p>Com flag: deploy diario, feature mora em prod escondida, libera por porcentagem, rollback instantaneo via toggle. Continuous delivery de verdade depende disso.</p>" },
    { q: "Como faria rollout de 5%% -> 100%%?", a: "<p>(1) Deploy código com flag off. (2) Liga internal (só meu user, time de eng) — smoke test. (3) Liga 1%% — observa métricas. (4) Sobe gradual: 5%%, 25%%, 50%%, 100%% com janela de horas/dia entre cada. (5) Em cada step, alerta automático reverte se piora. (6) Após 100%% por dias estáveis, remove o código da flag.</p>" },
  ],
  resources: [
    { title: "Pete Hodgson — Feature Toggles", url: "https://martinfowler.com/articles/feature-toggles.html", kind: "artigo" },
    { title: "OpenFeature (CNCF)", url: "https://openfeature.dev/", kind: "docs" },
    { title: "Unleash (open-source)", url: "https://docs.getunleash.io/", kind: "docs" },
  ],
}

export default featureFlags
