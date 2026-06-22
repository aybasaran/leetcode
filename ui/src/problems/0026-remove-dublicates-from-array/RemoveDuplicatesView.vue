<script setup lang="ts">
// #26 görselleştirmesi. Tek mod (iki imleç). VisualizerLayout shell'ini doldurur,
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
  { label: 'slow (yazma)', color: 'var(--color-viz-merged)' },
  { label: 'fast (tarama)', color: 'var(--color-viz-cur)' },
  { label: 'benzersiz', color: 'var(--color-viz-merged)' },
  { label: 'tekrar / çöp', color: 'var(--color-viz-dimmer)' },
]
</script>

<template>
  <VisualizerLayout
    v-if="current"
    eyebrow="LeetCode #26 · Go · iki imleç (slow / fast)"
    title="Remove Duplicates"
    accent="Duplicates"
    subtitle="Dizi zaten sıralı → tekrarlar yan yana. fast tarar, yeni değer buldukça slow ilerleyip diziyi YERİNDE üzerine yazar. Ekstra bellek yok, dönüş = benzersiz adet k."
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
