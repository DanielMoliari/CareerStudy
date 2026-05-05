import type { SkillContent } from '@/types'

const echarts: SkillContent = {
    tagline: "Biblioteca de gráficos Apache — poderosa para visualizações complexas e grandes volumes de dados.",
    why: "ECharts tem melhor performance que Recharts/ApexCharts para grandes volumes de dados. Usado em dashboards de analytics e BI.",
    gotchas: [
      "ECharts usa configuração imperativa via setOption() — menos React-like. Use echarts-for-react para wrapper declarativo.",
      "Instância ECharts precisa ser destruída no unmount para evitar memory leak.",
      "SSR não é suportado nativamente — use dynamic import no Next.js.",
    ],
}

export default echarts
