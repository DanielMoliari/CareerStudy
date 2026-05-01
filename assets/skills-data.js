/* CareerStudy — fonte canonica de skills.
 * Cada skill: { name, slug, p, cat, deps?, alias? }
 * p: 1 = essencial, 2 = importante, 3 = bonus
 */

const ICON_BASE = 'https://cdn.simpleicons.org/'

const ICON_MAP = {
  'React':['react','61DAFB'], 'TypeScript':['typescript','3178C6'], 'Vue':['vuedotjs','4FC08D'],
  'Next.js':['nextdotjs','e2e8f0'], 'Nuxt':['nuxt','00DC82'], 'Vite':['vite','646CFF'],
  'Tailwind CSS':['tailwindcss','06B6D4'], 'shadcn/ui':['shadcnui','e2e8f0'], 'MUI':['mui','007FFF'],
  'Styled Components':['styledcomponents','DB7093'], 'Vuetify':['vuetify','1867C0'],
  'Radix UI':['radixui','e2e8f0'], 'Framer Motion':['framer','0055FF'], 'SCSS':['sass','CC6699'],
  'Bootstrap':['bootstrap','7952B3'], 'Zustand':['react','764ABC'],
  'Vuex':['vuedotjs','4FC08D'], 'Pinia':['vuedotjs','4FC08D'], 'React Query':['reactquery','FF4154'],
  'SWR':['vercel','e2e8f0'], 'Apollo Client':['apollographql','311C87'], 'Axios':['axios','5A29E4'],
  'Recharts':['react','22b5bf'], 'ApexCharts':['apachespark','E25A1C'], 'ECharts':['apacheecharts','AA344D'],
  'TanStack Table':['react','FF4154'], 'MUI DataGrid':['mui','007FFF'], 'ExcelJS':['microsoftexcel','217346'],
  'Formik':['react','e2e8f0'], 'Yup':['react','e2e8f0'],
  'Zod':['zod','3E67B1'], 'Vuelidate':['vuedotjs','4FC08D'], 'JavaScript':['javascript','F7DF1E'],
  'HTML':['html5','E34F26'], 'CSS':['css','1572B6'], 'Redux':['redux','764ABC'],
  'Svelte':['svelte','FF3E00'], 'AngularJS':['angular','0F0F11'], 'React Native':['react','61DAFB'],
  'Webpack':['webpack','8DD6F9'], 'Responsive Design':['css','1572B6'], 'SEO':['google','4285F4'],
  'Node.js':['nodedotjs','5FA04E'], 'PHP':['php','777BB4'], 'Laravel':['laravel','FF2D20'],
  'Express':['express','e2e8f0'], 'GraphQL':['graphql','E10098'], 'Python':['python','3776AB'],
  'Prisma':['prisma','2D3748'], 'Drizzle':['drizzle','C5F74F'], 'Eloquent':['laravel','FF2D20'],
  'Sequelize':['sequelize','52B0E7'], 'NextAuth / Auth.js':['auth0','e2e8f0'],
  'WebSocket':['socketdotio','e2e8f0'], 'Socket.io':['socketdotio','010101'],
  'BullMQ':['redis','FF4438'], 'RabbitMQ':['rabbitmq','FF6600'], 'Apache Thrift':['apache','D22128'],
  'FHIR / HL7':['apachespark','e2e8f0'], 'REST APIs':['openapiinitiative','6BA539'],
  'JWT':['jsonwebtokens','e2e8f0'], 'OAuth 2.0':['auth0','EB5424'],
  'Sanctum':['laravel','FF2D20'], 'Firebase Auth':['firebase','DD2C00'], 'Stripe':['stripe','008CDD'],
  'Mercado Pago':['mercadopago','00B1EA'], 'NestJS':['nestjs','E0234E'], 'Fastify':['fastify','e2e8f0'],
  'TypeORM':['typeorm','FE0803'], 'Swagger':['swagger','85EA2D'], 'Resend':['resend','e2e8f0'],
  'Agora.io':['agora','099DFD'], 'Bash':['gnubash','4EAA25'],
  'gramJS / Telethon':['telegram','26A5E4'], 'Leaflet':['leaflet','199900'],
  'OpenStreetMap':['openstreetmap','7EBC6F'], 'Revit (Python)':['autodesk','e2e8f0'],
  'MySQL':['mysql','4479A1'], 'MariaDB':['mariadb','003545'], 'PostgreSQL':['postgresql','4169E1'],
  'SQLite':['sqlite','003B57'], 'Redis':['redis','FF4438'], 'Firebase':['firebase','DD2C00'],
  'pgvector':['postgresql','4169E1'], 'Qdrant':['qdrant','DC244C'],
  'Elasticsearch':['elasticsearch','005571'], 'Docker':['docker','2496ED'],
  'Nginx':['nginx','009639'], 'PM2':['pm2','2B037A'], 'Git':['git','F05032'],
  'GitHub':['github','e2e8f0'], 'GitLab':['gitlab','FC6D26'],
  'Azure DevOps':['azuredevops','0078D7'], 'GitLab CI/CD':['gitlab','FC6D26'],
  'SonarQube':['sonarqube','4E9BCD'], 'Playwright':['playwright','2EAD33'],
  'Jest':['jest','C21325'], 'PHPUnit':['php','777BB4'], 'Pest':['php','777BB4'],
  'Vitest':['vitest','6E9F18'], 'Cypress':['cypress','69D3A7'], 'TDD':['testinglibrary','E33332'],
  'GitFlow':['git','F05032'], 'Scrum':['scrumalliance','009FDA'], 'Kanban':['trello','0052CC'],
  'Figma':['figma','F24E1E'], 'VS Code':['visualstudiocode','007ACC'],
  'Cursor':['cursor','e2e8f0'], 'Linux':['linux','FCC624'],
  'Docker Compose':['docker','2496ED'], 'Kubernetes':['kubernetes','326CE5'],
  'GitHub Actions':['githubactions','2088FF'],
  'Anthropic SDK':['anthropic','D97757'], 'OpenAI SDK':['openai','412991'],
  'Prompt Engineering':['openai','412991'], 'RAG':['openai','a855f7'],
  'Function Calling':['openai','412991'], 'Agentic Workflows':['anthropic','D97757'],
  'MCP':['anthropic','D97757'], 'Multimodal':['openai','412991'], 'Ollama':['ollama','e2e8f0'],
  'Telegram Bots':['telegram','26A5E4'], 'Cheerio':['nodedotjs','5FA04E'],
  'Clean Architecture':['archlinux','1793D1'], 'HMVC':['archlinux','1793D1'],
  'DDD':['archlinux','1793D1'], 'Repository Pattern':['archlinux','1793D1'],
  'Event-Driven':['archlinux','1793D1'], 'Microservices':['archlinux','1793D1'],
  'SOA':['archlinux','1793D1'], 'Dependency Injection':['archlinux','1793D1'],
  'MVC':['archlinux','1793D1'], 'Multi-tenant':['archlinux','1793D1'],
  'SOLID':['archlinux','1793D1'], 'Clean Code':['archlinux','1793D1'],
  'Design Patterns':['archlinux','1793D1'], 'System Design':['archlinux','1793D1'],
  'Code Review':['github','e2e8f0'], 'Comunicacao':['slack','4A154B'],
  'Lideranca':['slack','4A154B'], 'Ingles':['duolingo','58CC02'], 'Espanhol':['duolingo','58CC02'],
  'Terraform':['terraform','844FBA'], 'Pulumi':['pulumi','8A3391'],
  'Go':['go','00ADD8'], 'Rust':['rust','e2e8f0'],
  'OpenTelemetry':['opentelemetry','e2e8f0'], 'Prometheus':['prometheus','E6522C'],
  'Grafana':['grafana','F46800'],
  'Algoritmos & DS':['leetcode','FFA116'], 'Big-O':['leetcode','FFA116'],
  'Dynamic Programming':['leetcode','FFA116'], 'Grafos':['leetcode','FFA116'],
  'TCP/IP & DNS':['cloudflare','F38020'], 'TLS / HTTPS':['letsencrypt','003A70'],
  'HTTP/2 & HTTP/3':['cloudflare','F38020'], 'Event Loop':['nodedotjs','5FA04E'],
  'Processos & Threads':['linux','FCC624'], 'Memory Management':['linux','FCC624'],
  'B-tree & LSM-tree':['postgresql','4169E1'], 'MVCC':['postgresql','4169E1'],
  'EXPLAIN ANALYZE':['postgresql','4169E1'], 'CAP Theorem':['apache','D22128'],
  'Raft / Paxos':['apache','D22128'], 'CRDTs':['apache','D22128'],
  'Consistent Hashing':['apache','D22128'],
  'Fine-tuning (LoRA)':['huggingface','FFD21E'], 'LLMOps':['mlflow','0194E2'],
  'LangSmith':['langchain','1C3C3C'], 'LangGraph':['langchain','1C3C3C'],
  'CrewAI':['langchain','1C3C3C'], 'RAGAS':['openai','412991'],
  'AI Guardrails':['openai','412991'], 'Quantizacao (GGUF)':['ollama','e2e8f0'],
  'HNSW / IVF':['qdrant','DC244C'], 'vLLM':['python','3776AB'],
  'Hugging Face':['huggingface','FFD21E'],
  'Apache Kafka':['apachekafka','231F20'], 'CDC (Debezium)':['apachekafka','231F20'],
  'CQRS':['archlinux','1793D1'],
  'Circuit Breakers':['archlinux','1793D1'], 'Rate Limiting':['archlinux','1793D1'],
  'Sharding':['archlinux','1793D1'], 'Chaos Engineering':['archlinux','1793D1'],
  'OWASP Top 10':['owasp','e2e8f0'], 'OWASP API Top 10':['owasp','e2e8f0'],
  'Threat Modeling':['owasp','e2e8f0'],
  'DAST (ZAP)':['owasp','e2e8f0'], 'Snyk / Dependabot':['snyk','4C4A73'],
  'Secrets Management':['vault','FFEC6E'], 'GitLeaks':['git','F05032'],
  'Turborepo':['turborepo','e2e8f0'], 'k6 (Load Testing)':['k6','7D64FF'], 'Nx':['nx','143055'],
  'tRPC':['trpc','2596BE'], 'Server Components (RSC)':['react','61DAFB'],
  'Web Vitals':['googlechrome','4285F4'],
  'Design Systems':['storybook','FF4785'], 'Technical Writing':['readthedocs','8CA1AF'],
  'ADRs / RFCs':['readthedocs','8CA1AF'], 'SLIs / SLOs / SLAs':['prometheus','E6522C'],
  'Caching Strategies':['redis','FF4438'], 'API Versioning':['openapiinitiative','6BA539'],
  'Concurrency':['nodedotjs','5FA04E'], 'Tradeoff Analysis':['archlinux','1793D1'],
}

function iconUrl(name) {
  const e = ICON_MAP[name]
  return e ? ICON_BASE + e[0] + '/' + e[1] : null
}

function slugify(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const CATEGORIES = [
  {
    label: 'Frontend', key: 'frontend',
    skills: [
      ['React',1],['TypeScript',1],['Next.js',1],['Vue',1],
      ['Tailwind CSS',1],['Zod',1],['React Query',1],
      ['Server Components (RSC)',1],['tRPC',1],
      ['Web Vitals',1],['Accessibility (a11y)',1],
      ['Nuxt',2],['Vite',2],['shadcn/ui',2],['Zustand',2],
      ['Radix UI',2],['Framer Motion',2],['Redux',2],
      ['Formik',2],['Yup',2],['Design Systems',2],
      ['JavaScript',3],['HTML',3],['CSS',3],
      ['MUI',3],['Styled Components',3],['Vuetify',3],
      ['SCSS',3],['Bootstrap',3],['Responsive Design',3],
      ['Jotai',3],['Vuex',3],['Pinia',3],
      ['SWR',3],['Apollo Client',3],['Axios',3],
      ['Recharts',3],['ApexCharts',3],['ECharts',3],
      ['TanStack Table',3],['MUI DataGrid',3],
      ['ExcelJS',3],['jsPDF',3],['Vuelidate',3],
      ['Svelte',3],['AngularJS',3],['React Native',3],
      ['Webpack',3],['SEO',3],
    ],
  },
  {
    label: 'Backend', key: 'backend',
    skills: [
      ['Node.js',1],['TypeORM',1],['NestJS',1],['PostgreSQL',1],
      ['GraphQL',1],['Prisma',1],
      ['Concurrency',1],['Caching Strategies',1],['API Versioning',1],
      ['Laravel',2],['Express',2],['Python',2],['Fastify',2],
      ['REST APIs',2],['WebSocket',2],['Swagger',2],
      ['Drizzle',2],['Sequelize',2],
      ['JWT',2],['OAuth 2.0',2],['NextAuth / Auth.js',2],
      ['BullMQ',2],['RabbitMQ',2],
      ['Apache Kafka',2],['CDC (Debezium)',2],['Bash',2],
      ['PHP',3],['Eloquent',3],['Sanctum',3],['Firebase Auth',3],
      ['Socket.io',3],['Webhooks',3],
      ['Apache Thrift',3],['FHIR / HL7',3],['Agora.io',3],
      ['Stripe',3],['Mercado Pago',3],['Resend',3],
      ['Leaflet',3],['OpenStreetMap',3],['Revit (Python)',3],
      ['Go',3],['Rust',3],
    ],
  },
  {
    label: 'Database', key: 'database',
    skills: [
      ['PostgreSQL',1],['EXPLAIN ANALYZE',1],['MVCC',1],['B-tree & LSM-tree',1],
      ['Redis',2],['Elasticsearch',2],['pgvector',2],['Qdrant',2],
      ['MySQL',3],['MariaDB',3],['SQLite',3],['Firebase',3],
    ],
  },
  {
    label: 'Cloud & Infra', key: 'cloud',
    skills: [
      ['AWS',1],['EC2',1],['S3',1],['Lambda',1],
      ['RDS',1],['IAM',1],['VPC',1],['Terraform',1],
      ['Pulumi',2],
    ],
  },
  {
    label: 'DevOps & Tooling', key: 'devops',
    skills: [
      ['Docker',1],['Docker Compose',1],['GitHub Actions',1],['TDD',1],['Playwright',1],
      ['Kubernetes',2],['Linux',2],['Nginx',2],
      ['GitLab CI/CD',2],['Jest',2],['Vitest',2],
      ['Turborepo',2],['Feature Flags',2],['k6 (Load Testing)',2],
      ['Git',3],['PM2',3],['GitHub',3],['GitLab',3],['Azure DevOps',3],['GitFlow',3],
      ['PHPUnit',3],['Pest',3],['Cypress',3],['SonarQube',3],['Nx',3],
      ['Scrum',3],['Kanban',3],['VS Code',3],['Cursor',3],['Figma',3],
    ],
  },
  {
    label: 'Observabilidade', key: 'obs',
    skills: [
      ['OpenTelemetry',1],['Prometheus',1],['Grafana',1],['SLIs / SLOs / SLAs',1],
    ],
  },
  {
    label: 'AI & LLM', key: 'ai',
    skills: [
      ['Agentic Workflows',1],['RAG',1],['Function Calling',1],
      ['MCP',1],['LangGraph',1],['Fine-tuning (LoRA)',1],['LLMOps',1],['RAGAS',1],
      ['Anthropic SDK',2],['OpenAI SDK',2],
      ['Prompt Engineering',2],['Multimodal',2],
      ['CrewAI',2],['Hugging Face',2],
      ['Quantizacao (GGUF)',2],['vLLM',2],
      ['LangSmith',2],['AI Guardrails',2],['HNSW / IVF',2],
      ['Ollama',3],['Telegram Bots',3],['gramJS / Telethon',3],['Cheerio',3],
    ],
  },
  {
    label: 'Arquitetura & System Design', key: 'arch',
    skills: [
      ['System Design',1],['SOLID',1],['Clean Architecture',1],
      ['DDD',1],['Microservices',1],['CQRS',1],
      ['Circuit Breakers',1],['Rate Limiting',1],['Tradeoff Analysis',1],
      ['Event-Driven',2],['Design Patterns',2],
      ['Dependency Injection',2],['Sharding',2],['Chaos Engineering',2],
      ['HMVC',3],['MVC',3],['SOA',3],
      ['Repository Pattern',3],['Multi-tenant',3],
      ['Clean Code',3],['Code Review',3],
    ],
  },
  {
    label: 'Fundamentos CS', key: 'cs',
    skills: [
      ['Algoritmos & DS',1],['Big-O',1],['Dynamic Programming',1],['Grafos',1],
      ['TCP/IP & DNS',1],['TLS / HTTPS',1],
      ['Event Loop',1],['Memory Management',1],['CAP Theorem',1],
      ['HTTP/2 & HTTP/3',2],['Processos & Threads',2],
      ['Raft / Paxos',2],['CRDTs',2],['Consistent Hashing',2],
    ],
  },
  {
    label: 'Seguranca', key: 'sec',
    skills: [
      ['OWASP Top 10',1],['OWASP API Top 10',1],['Threat Modeling',1],
      ['SAST (Semgrep)',2],['DAST (ZAP)',2],['Snyk / Dependabot',2],
      ['Secrets Management',2],['GitLeaks',2],
    ],
  },
  {
    label: 'Idiomas & Soft Skills', key: 'soft',
    skills: [
      ['Ingles',1],['Technical Writing',1],['ADRs / RFCs',1],
      ['Espanhol',2],['Comunicacao',2],['Lideranca',2],
    ],
  },
]

// Flat skill list with full metadata
const ALL_SKILLS = (() => {
  const out = []
  for (const cat of CATEGORIES) {
    for (const [name, p] of cat.skills) {
      out.push({ name, slug: slugify(name), p, cat: cat.key, catLabel: cat.label })
    }
  }
  return out
})()

const SKILL_BY_SLUG = Object.fromEntries(ALL_SKILLS.map(s => [s.slug, s]))
const SKILL_BY_NAME = Object.fromEntries(ALL_SKILLS.map(s => [s.name, s]))

// Skill dependencies (pre-requisitos pedagogicos)
// dest depende de origem: para entender X, antes ver Y
const DEPENDENCIES = {
  // Frontend
  'react': ['javascript','html','css'],
  'typescript': ['javascript'],
  'next-js': ['react','typescript'],
  'server-components-rsc': ['next-js','react'],
  'trpc': ['typescript','react-query'],
  'react-query': ['react'],
  'zod': ['typescript'],
  'tailwind-css': ['css'],
  'shadcn-ui': ['tailwind-css','radix-ui'],
  'radix-ui': ['react'],
  'framer-motion': ['react','css'],
  'redux': ['react','javascript'],
  'zustand': ['react'],
  'web-vitals': ['javascript','html'],
  'accessibility-a11y': ['html','css'],
  'design-systems': ['css','tailwind-css'],
  'vue': ['javascript'],
  'nuxt': ['vue'],

  // Backend
  'node-js': ['javascript','event-loop'],
  'nest-js': ['node-js','typescript','dependency-injection'],
  'fastify': ['node-js'],
  'express': ['node-js'],
  'graphql': ['rest-apis'],
  'prisma': ['typescript','postgresql'],
  'drizzle': ['typescript','postgresql'],
  'typeorm': ['typescript','postgresql'],
  'rest-apis': ['javascript','tcp-ip-dns','tls-https'],
  'websocket': ['tcp-ip-dns'],
  'caching-strategies': ['redis'],
  'concurrency': ['event-loop','processos-threads'],
  'api-versioning': ['rest-apis'],
  'jwt': ['rest-apis','tls-https'],
  'oauth-2-0': ['jwt'],
  'bullmq': ['redis','node-js'],
  'apache-kafka': ['event-driven','tcp-ip-dns'],
  'cdc-debezium': ['apache-kafka','postgresql'],

  // Database
  'postgresql': ['mvcc','b-tree-lsm-tree'],
  'explain-analyze': ['postgresql','b-tree-lsm-tree'],
  'pgvector': ['postgresql'],
  'redis': ['caching-strategies'],
  'elasticsearch': ['rest-apis'],
  'qdrant': ['hnsw-ivf'],

  // Cloud
  'aws': ['linux','tcp-ip-dns'],
  'ec2': ['aws','linux'],
  's3': ['aws'],
  'lambda': ['aws'],
  'rds': ['aws','postgresql'],
  'iam': ['aws'],
  'vpc': ['aws','tcp-ip-dns'],
  'terraform': ['aws'],
  'pulumi': ['aws','typescript'],

  // DevOps
  'docker': ['linux'],
  'docker-compose': ['docker'],
  'kubernetes': ['docker'],
  'github-actions': ['git','docker'],
  'gitlab-ci-cd': ['git','docker'],
  'nginx': ['linux','tcp-ip-dns'],
  'tdd': ['javascript'],
  'playwright': ['javascript'],
  'k6-load-testing': ['javascript','rest-apis'],

  // Observability
  'opentelemetry': ['rest-apis'],
  'prometheus': ['linux'],
  'grafana': ['prometheus'],
  'slis-slos-slas': ['prometheus'],

  // AI
  'rag': ['prompt-engineering','pgvector'],
  'ragas': ['rag'],
  'function-calling': ['prompt-engineering','rest-apis'],
  'agentic-workflows': ['function-calling'],
  'mcp': ['agentic-workflows','anthropic-sdk'],
  'langgraph': ['agentic-workflows'],
  'crewai': ['agentic-workflows'],
  'fine-tuning-lora': ['hugging-face'],
  'llmops': ['rag','agentic-workflows'],
  'ai-guardrails': ['prompt-engineering'],
  'hnsw-ivf': ['algoritmos-ds'],
  'quantizacao-gguf': ['hugging-face'],
  'v-llm': ['hugging-face'],
  'multimodal': ['prompt-engineering'],
  'anthropic-sdk': ['rest-apis','prompt-engineering'],
  'openai-sdk': ['rest-apis','prompt-engineering'],

  // Architecture
  'system-design': ['cap-theorem','rate-limiting','caching-strategies'],
  'clean-architecture': ['solid','dependency-injection'],
  'ddd': ['clean-architecture'],
  'microservices': ['rest-apis','event-driven'],
  'cqrs': ['event-driven','ddd'],
  'event-driven': ['rest-apis'],
  'circuit-breakers': ['rest-apis'],
  'rate-limiting': ['rest-apis','redis'],
  'sharding': ['postgresql','consistent-hashing'],
  'chaos-engineering': ['system-design'],
  'tradeoff-analysis': ['system-design'],
  'design-patterns': ['solid'],
  'dependency-injection': ['solid'],

  // CS
  'algoritmos-ds': ['big-o'],
  'dynamic-programming': ['algoritmos-ds'],
  'grafos': ['algoritmos-ds'],
  'tls-https': ['tcp-ip-dns'],
  'http-2-http-3': ['tcp-ip-dns','tls-https'],
  'event-loop': ['javascript'],
  'mvcc': ['b-tree-lsm-tree'],
  'raft-paxos': ['cap-theorem'],
  'crdts': ['cap-theorem'],
  'consistent-hashing': ['algoritmos-ds'],

  // Security
  'owasp-top-10': ['rest-apis'],
  'owasp-api-top-10': ['owasp-top-10','rest-apis'],
  'threat-modeling': ['owasp-top-10'],
  'sast-semgrep': ['github-actions'],
  'dast-zap': ['rest-apis'],
  'snyk-dependabot': ['github-actions'],
  'secrets-management': ['iam'],

  // Soft
  'adrs-rfcs': ['technical-writing'],
}

window.SKILLS = {
  CATEGORIES, ALL_SKILLS, SKILL_BY_SLUG, SKILL_BY_NAME,
  DEPENDENCIES, ICON_MAP, ICON_BASE, iconUrl, slugify,
}
