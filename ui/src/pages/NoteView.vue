<script setup lang="ts">
// Tek not sayfası. /notes/:slug → registry'den notu bul → MarkdownDoc ile render.
// Soru viz'lerinin aksine bu sayfa KAYDIRILABİLİR (uzun okuma metni).
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownDoc from '@/components/MarkdownDoc.vue'
import { noteBySlug } from '@/notes/registry'

const route = useRoute()
const note = computed(() => noteBySlug(String(route.params.slug)))

// Sekme başlığını nota göre güncelle (dinamik param meta'da olmadığı için elle).
watchEffect(() => {
  if (note.value) document.title = note.value.title
})
</script>

<template>
  <div class="doc-screen">
    <div class="doc-wrap">
      <RouterLink to="/" class="viz-back">← ana sayfa</RouterLink>

      <template v-if="note">
        <header class="doc-head">
          <i v-if="note.icon" :class="note.icon" class="doc-icon" />
          <h1>{{ note.title }}</h1>
        </header>
        <MarkdownDoc :source="note.source" />
      </template>

      <p v-else class="doc-missing">Not bulunamadı. <RouterLink to="/">Ana sayfaya dön.</RouterLink></p>
    </div>
  </div>
</template>
