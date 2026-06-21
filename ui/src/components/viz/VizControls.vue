<script setup lang="ts">
// Kontrol bar — Nuxt UI UButton (lucide ikonlu) + UProgress + UKbd.
import { computed } from 'vue'
import type { StepPlayer } from '@/composables/useStepPlayer'

const props = defineProps<{ player: StepPlayer }>()

const stepText = computed(() => `${props.player.index.value + 1} / ${props.player.total.value}`)
const progress = computed(() =>
  props.player.total.value <= 1
    ? 100
    : (props.player.index.value / (props.player.total.value - 1)) * 100,
)
</script>

<template>
  <footer class="viz-bar">
    <UButton
      icon="i-lucide-rotate-ccw"
      color="neutral"
      variant="outline"
      title="Baştan al"
      @click="player.reset()"
    />
    <UButton
      icon="i-lucide-chevron-left"
      color="neutral"
      variant="outline"
      :disabled="player.atStart.value"
      @click="player.prev()"
    >
      Geri
    </UButton>
    <UButton
      trailing-icon="i-lucide-chevron-right"
      color="primary"
      :disabled="player.atEnd.value"
      @click="player.next()"
    >
      İleri
    </UButton>
    <UButton
      :icon="player.playing.value ? 'i-lucide-pause' : 'i-lucide-play'"
      color="neutral"
      variant="soft"
      @click="player.toggle()"
    >
      {{ player.playing.value ? 'Dur' : 'Oto' }}
    </UButton>

    <span class="viz-barstep">{{ stepText }}</span>

    <div class="flex-1">
      <UProgress :model-value="progress" :max="100" size="sm" />
    </div>

    <span class="viz-hint">
      <UKbd value="arrowleft" />
      <UKbd value="arrowright" />
      gezin
    </span>
  </footer>
</template>
