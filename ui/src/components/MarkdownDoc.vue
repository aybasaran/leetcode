<script setup lang="ts">
// Ham markdown'ı HTML'e çevirip basar. Kaynak KENDİ yazdığımız .md (kullanıcı
// girdisi değil) + html:false → ham HTML enjeksiyonu kapalı, v-html güvenli.
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

const props = defineProps<{ source: string }>()

// Tek örnek (modül kapsamı): linkify = düz URL'leri link yap, typographer = akıllı tırnak/tire.
const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

const html = computed(() => md.render(props.source))
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- içerik kendi .md dosyamız, html:false -->
  <article class="doc" v-html="html" />
</template>
