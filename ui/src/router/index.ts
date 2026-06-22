import { createRouter, createWebHistory } from 'vue-router'
import { problems } from '@/problems/registry'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomeView.vue'),
      meta: { title: 'LeetCode Görselleştirmeleri' },
    },
    // Her soru kendi component'ine sahip ayrı bir route.
    // Farklı sorular = farklı component → geçişte temiz remount (stale state olmaz).
    ...problems.map((p) => ({
      path: `/problems/${p.slug}`,
      name: p.slug,
      component: p.component,
      meta: { title: `#${p.leetcodeId} ${p.title}` },
    })),
    // Kitaplık notları: TEK dinamik route. NoteView, :slug param'ına göre
    // registry'den içeriği seçer (her not ayrı component değil; render ortak).
    {
      path: '/notes/:slug',
      name: 'note',
      component: () => import('@/pages/NoteView.vue'),
    },
    // Bilinmeyen yol → ana sayfa.
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  // Sayfa geçişinde en üste dön.
  scrollBehavior: () => ({ top: 0 }),
})

// Sekme başlığını route meta'sından güncelle.
router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  if (title) document.title = title
})

export default router
