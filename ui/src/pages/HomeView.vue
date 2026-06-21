<script setup lang="ts">
// Ana sayfa: tüm soruları Nuxt UI UPageGrid içinde listele.
import { problems } from '@/problems/registry'
import ProblemCard from '@/components/ProblemCard.vue'
</script>

<template>
  <div class="min-h-dvh bg-default py-12 sm:py-16">
    <UContainer>
      <header class="mb-10">
        <div class="mb-2 text-xs tracking-[0.3em] text-muted uppercase">Go · görsel anlatım</div>
        <h1
          class="text-4xl font-extrabold tracking-tight text-highlighted sm:text-5xl"
          style="font-family: 'Syne', sans-serif"
        >
          LeetCode <span class="text-primary">Görselleştirmeleri</span>
        </h1>
        <p class="mt-3 max-w-2xl text-sm text-muted">
          Her soru adım adım, oynatmalı bir animasyonla. Bir soru seç, ileri/geri gezerek
          algoritmanın nasıl çalıştığını izle.
        </p>
      </header>

      <UPageGrid>
        <ProblemCard v-for="p in problems" :key="p.slug" :problem="p" />
      </UPageGrid>

      <p class="mt-10 text-center text-xs text-dimmed">
        {{ problems.length }} soru · yeni soru = registry'ye 1 satır
      </p>
    </UContainer>
  </div>
</template>
