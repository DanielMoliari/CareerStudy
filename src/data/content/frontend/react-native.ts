import type { SkillContent } from '@/types'

const reactNative: SkillContent = {
    tagline: "Framework para apps mobile com React — componentes nativos, sem WebView.",
    why: "React Native permite reutilizar conhecimento React para mobile. Aparece em vagas full-stack mobile/frontend.",
    gotchas: [
      "React Native não é React para browser. StyleSheet é diferente de CSS: sem cascade, sem herança de estilos, flexbox com direção column por padrão.",
      "Debugging é mais complexo — sem DevTools de browser. Use Flipper ou o React Native DevTools.",
      "Performance de listas requer FlatList ou SectionList — nunca ScrollView com map() para listas longas.",
    ],
}

export default reactNative
