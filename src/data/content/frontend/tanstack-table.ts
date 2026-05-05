import type { SkillContent } from '@/types'

const tanstackTable: SkillContent = {
    tagline: "Motor headless para tabelas e datagrid — sorting, filtering, pagination sem UI embutida.",
    why: "TanStack Table (React Table v8) é o padrão para tabelas complexas em React sem depender de MUI DataGrid ou ag-Grid. API headless dá controle total sobre renderização.",
    gotchas: [
      "TanStack Table é headless — você é responsável por toda a renderização. Sem CSS embutido.",
      "Sorting e filtering do lado do cliente não escalam para milhões de linhas — use server-side com manualSorting e manualFiltering.",
      "columnDef e data precisam ser memoizados para evitar re-inicialização desnecessária da tabela.",
    ],
}

export default tanstackTable
