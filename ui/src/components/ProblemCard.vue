<script setup lang="ts">
// Ana sayfadaki soru kartı — Nuxt UI UPageCard (tıklanır, to ile link) + UBadge.
import { computed } from 'vue'
import type { ProblemMeta } from '@/problems/types'

const props = defineProps<{ problem: ProblemMeta }>()

// Zorluk → Nuxt UI semantic renk.
const diffColor = computed(
  () =>
    ({ Easy: 'success', Medium: 'warning', Hard: 'error' })[props.problem.difficulty] as
      | 'success'
      | 'warning'
      | 'error',
)

const idLabel = computed(() => `#${String(props.problem.leetcodeId).padStart(4, '0')}`)
</script>

<template>
  <UPageCard
    :to="`/problems/${problem.slug}`"
    :title="problem.title"
    :description="problem.blurb"
    :icon="problem.icon"
    variant="subtle"
    spotlight
    class="h-full transition hover:-translate-y-1"
  >
    <template #header>
      <div class="flex w-full items-center justify-between gap-3">
        <span class="font-mono text-xs tracking-widest text-muted">{{ idLabel }}</span>
        <UBadge :color="diffColor" variant="subtle" size="sm">{{ problem.difficulty }}</UBadge>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-wrap gap-1.5">
        <UBadge v-for="tag in problem.tags" :key="tag" color="neutral" variant="soft" size="sm">
          {{ tag }}
        </UBadge>
      </div>
    </template>
  </UPageCard>
</template>
