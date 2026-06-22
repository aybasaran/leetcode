<script setup lang="ts">
// #27 görselleştirmesi. Tek mod (swap-from-end). VisualizerLayout shell'ini doldurur,
// sahneye ArrayLane koyar. Player reaktif total → adımlar arasında ←/→ gezinir.
import { computed } from 'vue'
import VisualizerLayout from '@/components/viz/VisualizerLayout.vue'
import ArrayLane from '@/components/viz/ArrayLane.vue'
import { useStepPlayer } from '@/composables/useStepPlayer'
import { buildSteps, SOURCE } from './steps'

const steps = buildSteps()
const player = useStepPlayer(() => steps.length)
const current = computed(() => steps[player.index.value])

const legend = [
  { label: 'i (tarama)', color: 'var(--color-viz-cur)' },
  { label: 'n−1 (donör)', color: 'var(--color-viz-merged)' },
  { label: 'saklanan', color: 'var(--color-viz-merged)' },
  { label: 'atılan / çöp', color: 'var(--color-viz-dimmer)' },
]
</script>

<template>
  <VisualizerLayout
    v-if="current"
    eyebrow="LeetCode #27 · Go · swap-from-end (i / n)"
    title="Remove Element"
    accent="Element"
    subtitle="Sıra önemsiz → silmek için kaydırmaya gerek yok. val'a denk gelince son elemanı oraya çek, n sınırını daralt. Silinecek çoksa çok az yazma. Dönüş = kalan eleman sayısı k."
    :legend="legend"
    :source="SOURCE"
    :active="current.codeLines"
    :message="current.message"
    :player="player"
  >
    <template #stage>
      <ArrayLane v-for="(lane, i) in current.lanes" :key="i" v-bind="lane" />
    </template>
  </VisualizerLayout>
</template>
