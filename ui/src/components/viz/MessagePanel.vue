<script setup lang="ts">
// Adım açıklaması. Parçalar düz string ya da renkli kalın vurgu.
import type { MsgPart } from '@/problems/types'

defineProps<{
  stepLabel: string // "ADIM 3 / 8"
  parts: MsgPart[]
}>()

// MsgPart string mi obje mi? Template'i sade tutmak için tip-guard.
const isText = (p: MsgPart): p is string => typeof p === 'string'
</script>

<template>
  <div class="viz-panel viz-panel--msg">
    <h3>ne oluyor?</h3>
    <div class="viz-stepno">{{ stepLabel }}</div>
    <div class="viz-msg">
      <template v-for="(p, i) in parts" :key="i">
        <span v-if="isText(p)">{{ p }}</span>
        <b v-else :class="`b-${p.b}`">{{ p.t }}</b>
      </template>
    </div>
  </div>
</template>
