import type { SkillContent } from '@/types'

const formik: SkillContent = {
    tagline: "Biblioteca para gerenciar estado de formulários em React — validação, touched, errors.",
    why: "Formik ainda é muito encontrado em codebases React de médio/grande porte. Entender o modelo de touched/errors/values e integração com Yup é necessário para manutenção. Em projetos novos, React Hook Form é mais leve.",
    summary: "Formik gerencia o ciclo de vida de formulários: estado de valores, validação, estado de touched (campo foi tocado), submissão. Integra com Yup para validação declarativa. API via hook (useFormik) ou componentes (<Formik>, <Field>, <ErrorMessage>).",
    keypoints: [
      { title: "useFormik / <Formik>", body: "Hook principal que retorna values, errors, touched, handleChange, handleBlur, handleSubmit. initialValues define o estado inicial. onSubmit é chamado quando form é válido.", code: `const formik = useFormik({
  initialValues: { email: '', password: '' },
  validationSchema: yup.object({ email: yup.string().email().required() }),
  onSubmit: async (values) => { await login(values) },
})` },
      { title: "touched e errors", body: "errors tem os erros de validação. touched rastreia quais campos o usuário interagiu. Exibir erro apenas quando touched[field] evita mostrar todos os erros ao carregar o form." },
      { title: "Field e FieldArray", body: "<Field> conecta automaticamente handleChange/handleBlur/value ao input pelo nome. <FieldArray> gerencia arrays de campos (adicionar/remover itens dinamicamente)." },
      { title: "setFieldValue e resetForm", body: "Para campos controlados externamente (date picker, select customizado): formik.setFieldValue('campo', valor). resetForm() volta ao initialValues." },
    ],
    interview: [
      { q: "Por que Formik vs React Hook Form?", a: "<p>Formik: modelo controlado (re-render a cada keystroke), mais familiar para devs vindos de Redux, melhor documentação para casos complexos com FieldArray.</p><p>React Hook Form: não-controlado por padrão (sem re-render por keystroke), melhor performance em forms grandes, API mais moderna com register/watch/setValue. Menor bundle.</p><p>Em projetos novos, React Hook Form + Zod é o padrão atual.</p>", level: "pleno" },
      { q: "O que é 'touched' no Formik e por que importa?", a: "<p>touched é um objeto que rastreia quais campos receberam foco e perderam (onBlur). Permite mostrar erros de validação apenas nos campos que o usuário já interagiu — não em todos ao carregar o form. Sem touched, todos os erros aparecem imediatamente, degradando a UX.</p>", level: "pleno" },
      { q: "Como integrar Formik com Yup?", a: "<p>Passe o schema Yup no prop validationSchema do Formik. Formik chama schema.validate() automaticamente e popula o objeto errors com as mensagens definidas no schema. Sem necessidade de lógica de validação manual.</p>", level: "pleno" },
      { q: "Como lidar com campos customizados (date picker, select externo) no Formik?", a: "<p>Campos customizados que não usam input HTML nativo não disparam os eventos que o Formik observa. Solução: use formik.setFieldValue('campo', valor) para atualizar o valor programaticamente, e formik.setFieldTouched('campo', true) para marcar como tocado (para que o erro apareça). Ou use o componente <Field> com a prop 'component' apontando para um componente customizado que recebe field, form como props.</p>", level: "pleno" },
    ],
    gotchas: [
      "Formik re-renderiza o form completo a cada keystroke. Em forms com muitos campos, isso pode causar lentidão — use React.memo nos campos ou migre para React Hook Form.",
      "setFieldTouched() precisa ser chamado manualmente em campos customizados para que os erros apareçam corretamente.",
      "enableReinitialize: true é necessário quando initialValues muda após mount (dados carregados de API) — sem ele, o form não reflete os novos valores.",
    ],
    resources: [
      { title: "Formik docs", url: "https://formik.org/docs/overview", kind: "docs" },
    ],
}

export default formik
