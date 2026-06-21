<script setup lang="ts">
// Kod paneli: Shiki ile gerçek Go syntax highlight + adım-senkron aktif satır vurgusu.
// İki katman: (1) Shiki token renkleri, (2) bizim .viz-ln--active overlay'i.
import { computed } from 'vue'
import { useShikiTokens } from '@/composables/useShikiTokens'

const props = defineProps<{
  source: string // ham Go kaynağı
  active: number[] // vurgulanacak satır numaraları (1 tabanlı)
}>()

const { lines } = useShikiTokens(() => props.source)
const activeSet = computed(() => new Set(props.active))

// Shiki hazır değilken (ilk async) ham satırları renksiz göster → boş kalmasın.
const displayLines = computed(() =>
  lines.value.length
    ? lines.value
    : props.source.split('\n').map((t) => [{ content: t, color: undefined }]),
)
</script>

<template>
  <div class="viz-panel viz-panel--code">
    <h3>solution.go</h3>
    <pre class="viz-code"><span
      v-for="(line, i) in displayLines"
      :key="i"
      class="viz-ln"
      :class="{ 'viz-ln--active': activeSet.has(i + 1) }"
    ><span v-for="(tok, k) in line" :key="k" :style="{ color: tok.color }">{{ tok.content }}</span></span></pre>
  </div>
</template>
