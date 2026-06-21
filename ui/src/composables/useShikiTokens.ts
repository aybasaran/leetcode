import { ref, watch, toValue, type Ref, type MaybeRefOrGetter } from 'vue'
import { codeToTokens, type ThemedToken, type BundledLanguage, type BundledTheme } from 'shiki'

// Shiki ile kaynak kodu renkli token'lara çevirir (gerçek Go grameri).
// Asenkron: highlighter ilk seferde grameri+temayı yükler, sonra anında.
// Dönen `lines`: her satır = ThemedToken[] (her token'da content + color).
// Kaynak değişince (mode geçişi) yeniden tokenize eder.
export function useShikiTokens(
  source: MaybeRefOrGetter<string>,
  lang: BundledLanguage = 'go',
  theme: BundledTheme = 'github-light',
): { lines: Ref<ThemedToken[][]> } {
  const lines = ref<ThemedToken[][]>([])

  watch(
    () => toValue(source),
    async (src) => {
      const res = await codeToTokens(src, { lang, theme })
      lines.value = res.tokens
    },
    { immediate: true },
  )

  return { lines }
}
