import type { SkillContent } from '@/types'

const muiDatagrid: SkillContent = {
    tagline: "Componente de DataGrid do MUI — tabela com virtualização, sorting e filtering embutidos.",
    why: "MUI DataGrid aparece em projetos enterprise que já usam MUI. A versão Pro/Premium tem features avançadas (grouping, tree data, Excel export).",
    gotchas: [
      "DataGrid Community é gratuita mas limitada. Row grouping e Excel export requerem licença Pro/Premium.",
      "Virtualização pode causar problemas com impressão e testes que precisam de todos os rows no DOM.",
      "Customizar células complexas com renderCell requer cuidado com performance — use React.memo nos componentes de célula.",
    ],
}

export default muiDatagrid
