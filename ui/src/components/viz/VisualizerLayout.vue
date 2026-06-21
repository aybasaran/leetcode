<script setup lang="ts">
// Görselleştirme iskeleti: landscape, no-scroll.
//   üst   = geri linki + başlık | (mode toggle + lejant)
//   orta  = sahne (slot) | yan panel (kod + açıklama)
//   alt   = kontrol bar
import { computed } from 'vue'
import CodePanel from './CodePanel.vue'
import MessagePanel from './MessagePanel.vue'
import VizControls from './VizControls.vue'
import type { MsgPart } from '@/problems/types'
import type { StepPlayer } from '@/composables/useStepPlayer'

const props = defineProps<{
  eyebrow: string
  title: string
  accent?: string // başlıkta yeşil vurgulanacak kelime
  subtitle: string
  legend: { label: string; color: string }[]
  source: string // ham kaynak kod (Shiki renklendirir)
  active: number[]
  message: MsgPart[]
  player: StepPlayer
}>()

const titleParts = computed(() => {
  if (!props.accent || !props.title.includes(props.accent)) {
    return { before: props.title, accent: '', after: '' }
  }
  const idx = props.title.indexOf(props.accent)
  return {
    before: props.title.slice(0, idx),
    accent: props.accent,
    after: props.title.slice(idx + props.accent.length),
  }
})

const stepLabel = computed(() => `ADIM ${props.player.index.value + 1} / ${props.player.total.value}`)
</script>

<template>
  <div class="viz-screen">
    <div class="viz-top">
      <div>
        <RouterLink to="/" class="viz-back">← tüm sorular</RouterLink>
        <div class="viz-eyebrow">{{ eyebrow }}</div>
        <h1 class="viz-title">
          {{ titleParts.before }}<span v-if="titleParts.accent" class="viz-accent">{{
            titleParts.accent
          }}</span>{{ titleParts.after }}
        </h1>
        <p class="viz-sub">{{ subtitle }}</p>
      </div>

      <div class="viz-top-right">
        <slot name="modes" />
        <div class="viz-legend">
          <span v-for="item in legend" :key="item.label">
            <i :style="{ background: item.color }" />{{ item.label }}
          </span>
        </div>
      </div>
    </div>

    <main class="viz-board">
      <section class="viz-stage">
        <slot name="stage" />
      </section>
      <aside class="viz-side">
        <CodePanel :source="source" :active="active" />
        <MessagePanel :step-label="stepLabel" :parts="message" />
      </aside>
    </main>

    <VizControls :player="player" />
  </div>
</template>
