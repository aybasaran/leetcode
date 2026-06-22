<script setup lang="ts">
// Tek bir dizi şeridi: BİTİŞİK hücreler (ok yok — bellek bitişik) + üstte imleç
// bayrakları + opsiyonel indeks numaraları. LinkedListLane'in dizi karşılığı;
// ileride başka array sorularında (sliding window, two-sum sorted, ...) tekrar kullanılır.
import type { ArrLane } from '@/problems/types'

defineProps<ArrLane>()
</script>

<template>
  <div class="viz-lane">
    <div class="viz-lane-label">
      <span class="viz-dot" :class="`viz-dot--${dot}`" />
      {{ label }}
    </div>

    <div class="viz-arr">
      <div v-for="(cell, i) in cells" :key="i" class="viz-acol">
        <div class="viz-node-wrap">
          <!-- imleç bayrakları (slow/fast). Aynı hücrede ikisi de olabilir → üst üste dizilir. -->
          <div v-if="cell.flags?.length" class="viz-flags">
            <div
              v-for="(f, k) in cell.flags"
              :key="k"
              class="viz-flag viz-flag--static"
              :class="`viz-flag--${f.variant}`"
            >
              {{ f.text }}
            </div>
          </div>

          <div
            class="viz-acell"
            :class="`viz-acell--${cell.state ?? 'idle'}`"
          >
            {{ cell.val }}
          </div>
        </div>

        <!-- hücre altı indeks -->
        <div v-if="showIndex" class="viz-aidx">{{ i }}</div>
      </div>
    </div>
  </div>
</template>
