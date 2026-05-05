import type { SkillContent } from '@/types'

const exceljs: SkillContent = {
    tagline: "Biblioteca Node.js/browser para leitura e escrita de arquivos Excel (.xlsx).",
    why: "Exportação para Excel é requisito comum em sistemas corporativos. ExcelJS permite gerar planilhas com formatação, fórmulas e múltiplas abas.",
    gotchas: [
      "ExcelJS em browser gera bundle significativo. Use importação dinâmica ou mova para uma API route no servidor.",
      "Fórmulas em células são armazenadas como strings — o Excel calcula ao abrir. Para valores calculados no backend, escreva o valor diretamente.",
      "Datas em Excel são números seriais. ExcelJS lida com isso automaticamente, mas ao ler, verifique o tipo da célula.",
    ],
}

export default exceljs
