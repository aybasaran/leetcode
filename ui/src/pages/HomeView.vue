<script setup lang="ts">
// Ana sayfa: tüm soruları + kitaplık notlarını listele.
import { problems } from '@/problems/registry'
import { notes } from '@/notes/registry'
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

      <!-- Kitaplık: Big O gibi kavram notları (soru değil, okuma metni) -->
      <section class="mt-16">
        <div class="mb-2 text-xs tracking-[0.3em] text-muted uppercase">Kitaplık</div>
        <h2
          class="mb-5 text-2xl font-extrabold tracking-tight text-highlighted sm:text-3xl"
          style="font-family: 'Syne', sans-serif"
        >
          Kavram <span class="text-primary">Notları</span>
        </h2>
        <UPageGrid>
          <UPageCard
            v-for="n in notes"
            :key="n.slug"
            :to="`/notes/${n.slug}`"
            :title="n.title"
            :description="n.blurb"
            :icon="n.icon"
            variant="subtle"
            spotlight
            class="h-full transition hover:-translate-y-1"
          >
            <template #footer>
              <span class="text-xs font-medium text-primary">Oku →</span>
            </template>
          </UPageCard>
        </UPageGrid>
      </section>

      <p class="mt-10 text-center text-xs text-dimmed">
        {{ problems.length }} soru · {{ notes.length }} not · yeni içerik = registry'ye 1 satır
      </p>
    </UContainer>
  </div>
</template>
