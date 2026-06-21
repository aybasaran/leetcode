<script setup lang="ts">
// #21 görselleştirmesi. Iterative ↔ Recursive segment toggle (UFieldGroup).
// Tek oynatıcı, reaktif total → mode geçince adım sayısı uyum sağlar, index sıfırlanır.
import { computed, ref, watch } from 'vue'
import VisualizerLayout from '@/components/viz/VisualizerLayout.vue'
import LinkedListLane from '@/components/viz/LinkedListLane.vue'
import { useStepPlayer } from '@/composables/useStepPlayer'
import { buildSteps, ITER_SOURCE } from './steps'
import { buildRecursionSteps, REC_SOURCE } from './recursionSteps'

type Mode = 'iter' | 'rec'
const mode = ref<Mode>('iter')

// Adımları bir kez üret (saf veri), mode'a göre seç.
const iterSteps = buildSteps()
const recSteps = buildRecursionSteps()
const steps = computed(() => (mode.value === 'iter' ? iterSteps : recSteps))
const source = computed(() => (mode.value === 'iter' ? ITER_SOURCE : REC_SOURCE))

const player = useStepPlayer(() => steps.value.length)
watch(mode, () => player.reset()) // mode değişince başa dön

const current = computed(() => steps.value[player.index.value])

const eyebrow = computed(() =>
  mode.value === 'iter'
    ? 'LeetCode #21 · Go · iterative (dummy + döngü)'
    : 'LeetCode #21 · Go · recursive (çağrı yığını)',
)
const subtitle = computed(() =>
  mode.value === 'iter'
    ? 'Düğümler hareket etmez — sadece Next okları yeniden bağlanır. İmleçleri (cur) ve kod satırını izle.'
    : 'Her çağrı küçük başı seçip kalanı kendine sorar. Sonuç DÖNÜŞTE (yığın boşalırken) örülür.',
)
const legend = computed(() =>
  mode.value === 'iter'
    ? [
        { label: 'list1', color: 'var(--color-viz-l1)' },
        { label: 'list2', color: 'var(--color-viz-l2)' },
        { label: 'birleşmiş', color: 'var(--color-viz-merged)' },
        { label: 'cur / karşılaştır', color: 'var(--color-viz-cur)' },
        { label: 'dummy', color: 'var(--color-viz-dummy)' },
      ]
    : [
        { label: 'list1', color: 'var(--color-viz-l1)' },
        { label: 'list2', color: 'var(--color-viz-l2)' },
        { label: 'çağrı yığını', color: 'var(--color-viz-cur)' },
        { label: 'sonuç', color: 'var(--color-viz-merged)' },
      ],
)
</script>

<template>
  <VisualizerLayout
    v-if="current"
    :eyebrow="eyebrow"
    title="Merge Two Sorted Lists"
    accent="Sorted"
    :subtitle="subtitle"
    :legend="legend"
    :source="source"
    :active="current.codeLines"
    :message="current.message"
    :player="player"
  >
    <template #modes>
      <UFieldGroup size="sm">
        <UButton
          :color="mode === 'iter' ? 'primary' : 'neutral'"
          :variant="mode === 'iter' ? 'solid' : 'outline'"
          @click="mode = 'iter'"
        >
          Iterative
        </UButton>
        <UButton
          :color="mode === 'rec' ? 'primary' : 'neutral'"
          :variant="mode === 'rec' ? 'solid' : 'outline'"
          @click="mode = 'rec'"
        >
          Recursive
        </UButton>
      </UFieldGroup>
    </template>

    <template #stage>
      <LinkedListLane v-for="(lane, i) in current.lanes" :key="i" v-bind="lane" />
    </template>
  </VisualizerLayout>
</template>
