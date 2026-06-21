<script setup lang="ts">
// Tek bir bağlı liste şeridi: düğümler + aralarında oklar + opsiyonel nil göstergesi.
// İleride başka linked-list sorularında (reverse, cycle, vb.) tekrar kullanılır.
import type { Lane } from '@/problems/types'

defineProps<Lane>()
</script>

<template>
  <div class="viz-lane">
    <div class="viz-lane-label">
      <span class="viz-dot" :class="`viz-dot--${dot}`" />
      {{ label }}
    </div>

    <div class="viz-chain">
      <template v-for="(node, i) in nodes" :key="i">
        <!-- ilk düğüm hariç her düğümden önce ok -->
        <div v-if="i > 0" class="viz-cell">
          <div class="viz-arrow" :class="{ 'viz-arrow--live': liveArrows }">→</div>
        </div>

        <div class="viz-cell">
          <div class="viz-node-wrap">
            <div
              v-if="node.flag"
              class="viz-flag"
              :class="`viz-flag--${node.flag.variant}`"
            >
              {{ node.flag.text }}
            </div>
            <div
              class="viz-node"
              :class="[
                `viz-node--${node.variant}`,
                {
                  'viz-node--ghost': node.ghost,
                  'viz-node--compare': node.compare,
                  'viz-node--pop': node.pop,
                },
              ]"
            >
              {{ node.val }}
            </div>
          </div>
        </div>
      </template>

      <!-- sona nil: 'arrow' → "→ nil",  'box' → sadece kutu -->
      <template v-if="nil">
        <div v-if="nil.mode === 'arrow'" class="viz-cell"><div class="viz-arrow">→</div></div>
        <div class="viz-cell"><div class="viz-nil">{{ nil.text }}</div></div>
      </template>
    </div>
  </div>
</template>
