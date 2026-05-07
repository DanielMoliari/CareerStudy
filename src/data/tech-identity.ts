export interface TechIdentity {
  primaryColor: string
  secondaryColor: string
  bgTint: string
  textOnPrimary: string
  personality: 'component' | 'server' | 'data' | 'infra' | 'language' | 'protocol' | 'tool' | 'concept'
  visualStyle: 'cards' | 'flow' | 'tree' | 'graph' | 'layers' | 'timeline' | 'grid'
  icon?: string
}

const DEFAULT: TechIdentity = {
  primaryColor: '#ef4444',
  secondaryColor: '#f87171',
  bgTint: 'rgba(239,68,68,.08)',
  textOnPrimary: '#fff',
  personality: 'concept',
  visualStyle: 'cards',
}

export const TECH_IDENTITY: Record<string, TechIdentity> = {
  // ── Frontend ────────────────────────────────────────────────────────────────
  'react':               { primaryColor: '#61DAFB', secondaryColor: '#21b8e3', bgTint: 'rgba(97,218,251,.08)', textOnPrimary: '#0a2a33', personality: 'component', visualStyle: 'tree' },
  'next-js':             { primaryColor: '#e2e8f0', secondaryColor: '#94a3b8', bgTint: 'rgba(226,232,240,.07)', textOnPrimary: '#0f172a', personality: 'server', visualStyle: 'flow' },
  'typescript':          { primaryColor: '#3178C6', secondaryColor: '#1e5fa8', bgTint: 'rgba(49,120,198,.09)', textOnPrimary: '#fff', personality: 'language', visualStyle: 'layers' },
  'javascript':          { primaryColor: '#F7DF1E', secondaryColor: '#d4b800', bgTint: 'rgba(247,223,30,.08)', textOnPrimary: '#1a1a00', personality: 'language', visualStyle: 'flow' },
  'tailwind-css':        { primaryColor: '#38BDF8', secondaryColor: '#0ea5e9', bgTint: 'rgba(56,189,248,.08)', textOnPrimary: '#0c2233', personality: 'tool', visualStyle: 'grid' },
  'vue':                 { primaryColor: '#4FC08D', secondaryColor: '#2d9c6e', bgTint: 'rgba(79,192,141,.08)', textOnPrimary: '#fff', personality: 'component', visualStyle: 'tree' },
  'svelte':              { primaryColor: '#FF3E00', secondaryColor: '#d43300', bgTint: 'rgba(255,62,0,.08)', textOnPrimary: '#fff', personality: 'component', visualStyle: 'flow' },
  'nuxt':                { primaryColor: '#00DC82', secondaryColor: '#00b368', bgTint: 'rgba(0,220,130,.08)', textOnPrimary: '#001a0e', personality: 'server', visualStyle: 'layers' },
  'redux':               { primaryColor: '#764ABC', secondaryColor: '#5a3690', bgTint: 'rgba(118,74,188,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'flow' },
  'react-query':         { primaryColor: '#FF4154', secondaryColor: '#d93040', bgTint: 'rgba(255,65,84,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'flow' },
  'vite':                { primaryColor: '#646CFF', secondaryColor: '#4a52e0', bgTint: 'rgba(100,108,255,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'flow' },
  'graphql':             { primaryColor: '#E10098', secondaryColor: '#b5007a', bgTint: 'rgba(225,0,152,.08)', textOnPrimary: '#fff', personality: 'protocol', visualStyle: 'graph' },
  'css':                 { primaryColor: '#264DE4', secondaryColor: '#1a35b0', bgTint: 'rgba(38,77,228,.08)', textOnPrimary: '#fff', personality: 'language', visualStyle: 'layers' },
  'html':                { primaryColor: '#E34F26', secondaryColor: '#c03e1c', bgTint: 'rgba(227,79,38,.08)', textOnPrimary: '#fff', personality: 'language', visualStyle: 'tree' },
  'scss':                { primaryColor: '#CC6699', secondaryColor: '#a8467a', bgTint: 'rgba(204,102,153,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'layers' },
  'framer-motion':       { primaryColor: '#BB4FE8', secondaryColor: '#9033c4', bgTint: 'rgba(187,79,232,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'timeline' },
  'trpc':                { primaryColor: '#398CCB', secondaryColor: '#2a6fa0', bgTint: 'rgba(57,140,203,.08)', textOnPrimary: '#fff', personality: 'protocol', visualStyle: 'flow' },
  'shadcn-ui':           { primaryColor: '#e2e8f0', secondaryColor: '#94a3b8', bgTint: 'rgba(226,232,240,.07)', textOnPrimary: '#0f172a', personality: 'component', visualStyle: 'grid' },
  'mui':                 { primaryColor: '#1976D2', secondaryColor: '#1256a0', bgTint: 'rgba(25,118,210,.08)', textOnPrimary: '#fff', personality: 'component', visualStyle: 'grid' },
  'tanstack-table':      { primaryColor: '#EF4444', secondaryColor: '#c73232', bgTint: 'rgba(239,68,68,.08)', textOnPrimary: '#fff', personality: 'component', visualStyle: 'grid' },
  'react-native':        { primaryColor: '#61DAFB', secondaryColor: '#21b8e3', bgTint: 'rgba(97,218,251,.08)', textOnPrimary: '#0a2a33', personality: 'component', visualStyle: 'tree' },

  // ── Backend ─────────────────────────────────────────────────────────────────
  'node-js':             { primaryColor: '#68A063', secondaryColor: '#4e7d49', bgTint: 'rgba(104,160,99,.08)', textOnPrimary: '#fff', personality: 'server', visualStyle: 'flow' },
  'nestjs':              { primaryColor: '#E0234E', secondaryColor: '#b51a3d', bgTint: 'rgba(224,35,78,.08)', textOnPrimary: '#fff', personality: 'server', visualStyle: 'layers' },
  'express':             { primaryColor: '#e2e8f0', secondaryColor: '#94a3b8', bgTint: 'rgba(226,232,240,.07)', textOnPrimary: '#0f172a', personality: 'server', visualStyle: 'flow' },
  'fastify':             { primaryColor: '#FFFFFF', secondaryColor: '#e2e8f0', bgTint: 'rgba(255,255,255,.06)', textOnPrimary: '#0f172a', personality: 'server', visualStyle: 'flow' },
  'python':              { primaryColor: '#3776AB', secondaryColor: '#FFD43B', bgTint: 'rgba(55,118,171,.09)', textOnPrimary: '#fff', personality: 'language', visualStyle: 'flow' },
  'go':                  { primaryColor: '#00ADD8', secondaryColor: '#0088aa', bgTint: 'rgba(0,173,216,.08)', textOnPrimary: '#fff', personality: 'language', visualStyle: 'flow' },
  'rust':                { primaryColor: '#CE422B', secondaryColor: '#a43320', bgTint: 'rgba(206,66,43,.08)', textOnPrimary: '#fff', personality: 'language', visualStyle: 'layers' },
  'php':                 { primaryColor: '#777BB4', secondaryColor: '#5a5e8e', bgTint: 'rgba(119,123,180,.08)', textOnPrimary: '#fff', personality: 'language', visualStyle: 'flow' },
  'laravel':             { primaryColor: '#FF2D20', secondaryColor: '#cc1e14', bgTint: 'rgba(255,45,32,.08)', textOnPrimary: '#fff', personality: 'server', visualStyle: 'layers' },
  'prisma':              { primaryColor: '#5A67D8', secondaryColor: '#7C8EF0', bgTint: 'rgba(90,103,216,.10)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'graph' },
  'typeorm':             { primaryColor: '#E83524', secondaryColor: '#bc2519', bgTint: 'rgba(232,53,36,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'graph' },
  'drizzle':             { primaryColor: '#C5F74F', secondaryColor: '#a3d134', bgTint: 'rgba(197,247,79,.08)', textOnPrimary: '#1a2600', personality: 'tool', visualStyle: 'graph' },
  'bullmq':              { primaryColor: '#D9534F', secondaryColor: '#b53d3a', bgTint: 'rgba(217,83,79,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'flow' },
  'rabbitmq':            { primaryColor: '#FF6600', secondaryColor: '#cc5200', bgTint: 'rgba(255,102,0,.08)', textOnPrimary: '#fff', personality: 'protocol', visualStyle: 'flow' },
  'apache-kafka':        { primaryColor: '#231F20', secondaryColor: '#4a4545', bgTint: 'rgba(255,255,255,.05)', textOnPrimary: '#fff', personality: 'protocol', visualStyle: 'flow' },
  'stripe':              { primaryColor: '#6772E5', secondaryColor: '#4e56c0', bgTint: 'rgba(103,114,229,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'flow' },
  'jwt':                 { primaryColor: '#D63AFF', secondaryColor: '#aa2acc', bgTint: 'rgba(214,58,255,.08)', textOnPrimary: '#fff', personality: 'protocol', visualStyle: 'flow' },
  'oauth-2-0':           { primaryColor: '#EB5424', secondaryColor: '#c0421c', bgTint: 'rgba(235,84,36,.08)', textOnPrimary: '#fff', personality: 'protocol', visualStyle: 'flow' },
  'rest-apis':           { primaryColor: '#009688', secondaryColor: '#00756a', bgTint: 'rgba(0,150,136,.08)', textOnPrimary: '#fff', personality: 'protocol', visualStyle: 'layers' },
  'websocket':           { primaryColor: '#010101', secondaryColor: '#333', bgTint: 'rgba(255,255,255,.05)', textOnPrimary: '#fff', personality: 'protocol', visualStyle: 'flow' },
  'swagger':             { primaryColor: '#85EA2D', secondaryColor: '#67be1e', bgTint: 'rgba(133,234,45,.08)', textOnPrimary: '#1a3300', personality: 'tool', visualStyle: 'layers' },

  // ── Database ────────────────────────────────────────────────────────────────
  'postgresql':          { primaryColor: '#336791', secondaryColor: '#264f70', bgTint: 'rgba(51,103,145,.09)', textOnPrimary: '#fff', personality: 'data', visualStyle: 'graph' },
  'explain-analyze':     { primaryColor: '#5b9bd5', secondaryColor: '#336791', bgTint: 'rgba(91,155,213,.09)', textOnPrimary: '#0f172a', personality: 'tool', visualStyle: 'tree' },
  'mongodb':             { primaryColor: '#47A248', secondaryColor: '#357a34', bgTint: 'rgba(71,162,72,.08)', textOnPrimary: '#fff', personality: 'data', visualStyle: 'tree' },
  'redis':               { primaryColor: '#DC382D', secondaryColor: '#b02b22', bgTint: 'rgba(220,56,45,.08)', textOnPrimary: '#fff', personality: 'data', visualStyle: 'graph' },
  'mysql':               { primaryColor: '#4479A1', secondaryColor: '#315d7d', bgTint: 'rgba(68,121,161,.08)', textOnPrimary: '#fff', personality: 'data', visualStyle: 'graph' },
  'sqlite':              { primaryColor: '#003B57', secondaryColor: '#005580', bgTint: 'rgba(0,59,87,.09)', textOnPrimary: '#fff', personality: 'data', visualStyle: 'graph' },
  'elasticsearch':       { primaryColor: '#FEC514', secondaryColor: '#d4a400', bgTint: 'rgba(254,197,20,.08)', textOnPrimary: '#1a1200', personality: 'data', visualStyle: 'graph' },
  'firebase':            { primaryColor: '#FFCA28', secondaryColor: '#FF8F00', bgTint: 'rgba(255,202,40,.08)', textOnPrimary: '#1a1000', personality: 'data', visualStyle: 'tree' },
  'supabase':            { primaryColor: '#3ECF8E', secondaryColor: '#2caa70', bgTint: 'rgba(62,207,142,.08)', textOnPrimary: '#001c0e', personality: 'data', visualStyle: 'graph' },

  // ── Cloud ───────────────────────────────────────────────────────────────────
  'aws':                 { primaryColor: '#FF9900', secondaryColor: '#cc7a00', bgTint: 'rgba(255,153,0,.08)', textOnPrimary: '#1a0f00', personality: 'infra', visualStyle: 'layers' },
  'vpc':                 { primaryColor: '#4A90E2', secondaryColor: '#2c6ec0', bgTint: 'rgba(74,144,226,.08)', textOnPrimary: '#fff', personality: 'infra', visualStyle: 'layers' },
  'gcp':                 { primaryColor: '#4285F4', secondaryColor: '#2c6de0', bgTint: 'rgba(66,133,244,.08)', textOnPrimary: '#fff', personality: 'infra', visualStyle: 'layers' },
  'azure':               { primaryColor: '#0078D4', secondaryColor: '#005fa8', bgTint: 'rgba(0,120,212,.08)', textOnPrimary: '#fff', personality: 'infra', visualStyle: 'layers' },
  'cloudflare':          { primaryColor: '#F48120', secondaryColor: '#c46510', bgTint: 'rgba(244,129,32,.08)', textOnPrimary: '#fff', personality: 'infra', visualStyle: 'layers' },
  'vercel':              { primaryColor: '#e2e8f0', secondaryColor: '#94a3b8', bgTint: 'rgba(226,232,240,.07)', textOnPrimary: '#0f172a', personality: 'infra', visualStyle: 'flow' },

  // ── DevOps ──────────────────────────────────────────────────────────────────
  'docker':              { primaryColor: '#2496ED', secondaryColor: '#1778c4', bgTint: 'rgba(36,150,237,.08)', textOnPrimary: '#fff', personality: 'infra', visualStyle: 'layers' },
  'docker-compose':      { primaryColor: '#1F8FE0', secondaryColor: '#7E57C2', bgTint: 'rgba(31,143,224,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'flow' },
  'tdd':                 { primaryColor: '#22c55e', secondaryColor: '#16a34a', bgTint: 'rgba(34,197,94,.08)', textOnPrimary: '#052e16', personality: 'concept', visualStyle: 'flow' },
  'kubernetes':          { primaryColor: '#326CE5', secondaryColor: '#2354b8', bgTint: 'rgba(50,108,229,.08)', textOnPrimary: '#fff', personality: 'infra', visualStyle: 'graph' },
  'terraform':           { primaryColor: '#7B42BC', secondaryColor: '#5e3090', bgTint: 'rgba(123,66,188,.08)', textOnPrimary: '#fff', personality: 'infra', visualStyle: 'tree' },
  'github-actions':      { primaryColor: '#2088FF', secondaryColor: '#1666cc', bgTint: 'rgba(32,136,255,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'flow' },
  'gitlab':              { primaryColor: '#FC6D26', secondaryColor: '#d4551a', bgTint: 'rgba(252,109,38,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'flow' },
  'nginx':               { primaryColor: '#009639', secondaryColor: '#007028', bgTint: 'rgba(0,150,57,.08)', textOnPrimary: '#fff', personality: 'server', visualStyle: 'flow' },
  'linux':               { primaryColor: '#FCC624', secondaryColor: '#d4a500', bgTint: 'rgba(252,198,36,.08)', textOnPrimary: '#1a1200', personality: 'infra', visualStyle: 'layers' },
  'ansible':             { primaryColor: '#EE0000', secondaryColor: '#cc0000', bgTint: 'rgba(238,0,0,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'flow' },
  'helm':                { primaryColor: '#0F1689', secondaryColor: '#0c116e', bgTint: 'rgba(15,22,137,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'layers' },

  // ── Observabilidade ─────────────────────────────────────────────────────────
  'datadog':             { primaryColor: '#632CA6', secondaryColor: '#4e2282', bgTint: 'rgba(99,44,166,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'timeline' },
  'grafana':             { primaryColor: '#F46800', secondaryColor: '#c35200', bgTint: 'rgba(244,104,0,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'timeline' },
  'prometheus':          { primaryColor: '#E6522C', secondaryColor: '#c04120', bgTint: 'rgba(230,82,44,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'timeline' },
  'opentelemetry':       { primaryColor: '#F5A800', secondaryColor: '#cc8a00', bgTint: 'rgba(245,168,0,.08)', textOnPrimary: '#1a1000', personality: 'tool', visualStyle: 'flow' },

  // ── AI/ML ───────────────────────────────────────────────────────────────────
  'openai':              { primaryColor: '#10a37f', secondaryColor: '#0c7d62', bgTint: 'rgba(16,163,127,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'flow' },
  'langchain':           { primaryColor: '#1C3C5A', secondaryColor: '#2a5a8a', bgTint: 'rgba(28,60,90,.09)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'flow' },
  'pytorch':             { primaryColor: '#EE4C2C', secondaryColor: '#c53b22', bgTint: 'rgba(238,76,44,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'flow' },
  'tensorflow':          { primaryColor: '#FF6F00', secondaryColor: '#cc5800', bgTint: 'rgba(255,111,0,.08)', textOnPrimary: '#fff', personality: 'tool', visualStyle: 'flow' },
  'huggingface':         { primaryColor: '#FFD21E', secondaryColor: '#d4ad12', bgTint: 'rgba(255,210,30,.08)', textOnPrimary: '#1a1200', personality: 'tool', visualStyle: 'cards' },

  // ── Segurança ───────────────────────────────────────────────────────────────
  'owasp-api-top-10':    { primaryColor: '#000000', secondaryColor: '#333', bgTint: 'rgba(255,255,255,.05)', textOnPrimary: '#ef4444', personality: 'concept', visualStyle: 'layers' },
  'owasp-top-10':        { primaryColor: '#EF4444', secondaryColor: '#b91c1c', bgTint: 'rgba(239,68,68,.08)', textOnPrimary: '#fff', personality: 'concept', visualStyle: 'layers' },

  // ── CS / Algoritmos ─────────────────────────────────────────────────────────
  'big-o':               { primaryColor: '#10B981', secondaryColor: '#059669', bgTint: 'rgba(16,185,129,.08)', textOnPrimary: '#04231a', personality: 'concept', visualStyle: 'graph' },
  'cap-theorem':         { primaryColor: '#A855F7', secondaryColor: '#7e22ce', bgTint: 'rgba(168,85,247,.08)', textOnPrimary: '#fff', personality: 'concept', visualStyle: 'graph' },

  // ── Arquitetura ──────────────────────────────────────────────────────────────
  'microservices':       { primaryColor: '#7E57C2', secondaryColor: '#5e3da0', bgTint: 'rgba(126,87,194,.08)', textOnPrimary: '#fff', personality: 'concept', visualStyle: 'graph' },
  'domain-driven-design': { primaryColor: '#546E7A', secondaryColor: '#3e5259', bgTint: 'rgba(84,110,122,.08)', textOnPrimary: '#fff', personality: 'concept', visualStyle: 'layers' },
  'clean-architecture':  { primaryColor: '#455A64', secondaryColor: '#314249', bgTint: 'rgba(69,90,100,.08)', textOnPrimary: '#fff', personality: 'concept', visualStyle: 'layers' },
  'event-driven':        { primaryColor: '#F57C00', secondaryColor: '#c46200', bgTint: 'rgba(245,124,0,.08)', textOnPrimary: '#fff', personality: 'concept', visualStyle: 'flow' },
  'cqrs':                { primaryColor: '#1565C0', secondaryColor: '#0e4d99', bgTint: 'rgba(21,101,192,.08)', textOnPrimary: '#fff', personality: 'concept', visualStyle: 'flow' },
}

export function getTechIdentity(slug: string): TechIdentity {
  return TECH_IDENTITY[slug] ?? DEFAULT
}
