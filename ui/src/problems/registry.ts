import type { ProblemMeta } from './types'

// ════════════════════════════════════════════════════════════════
//  SORU KAYIT DEFTERİ
//  Yeni soru eklemek = buraya bir nesne eklemek. Router + ana sayfa
//  otomatik güncellenir. Başka hiçbir yeri elle düzenlemene gerek yok.
// ════════════════════════════════════════════════════════════════
export const problems: ProblemMeta[] = [
  {
    slug: 'merge-two-sorted-lists',
    leetcodeId: 21,
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    icon: 'i-lucide-git-merge',
    blurb: 'İki sıralı bağlı listeyi tek sıralı listeye birleştir. Düğümler taşınmaz; sadece Next okları yeniden bağlanır.',
    component: () => import('@/problems/0021-merge-two-sorted-lists/MergeView.vue'),
  },
]

// slug → problem (router/ileride detay için pratik erişim).
export const problemBySlug = (slug: string): ProblemMeta | undefined =>
  problems.find((p) => p.slug === slug)
