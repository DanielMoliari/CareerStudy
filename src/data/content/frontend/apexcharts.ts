import type { SkillContent } from '@/types'

const apexcharts: SkillContent = {
    tagline: "Biblioteca de gráficos JavaScript com wrapper React — rica em tipos de gráfico.",
    why: "ApexCharts aparece em dashboards e relatórios por sua riqueza de tipos de gráfico e opções de exportação.",
    gotchas: [
      "ApexCharts usa opções em objeto de configuração (não JSX puro) — diferente de Recharts. Mudanças de dados requerem re-instanciação ou uso do método updateOptions.",
      "SSR com Next.js pode falhar — ApexCharts acessa window. Use dynamic import com ssr: false.",
      "Bundle é maior que Recharts — avalie se a riqueza de gráficos justifica.",
    ],
}

export default apexcharts
