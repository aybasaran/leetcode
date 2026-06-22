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
  {
    slug: 'remove-dublicates-from-array',
    leetcodeId: 26,
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    tags: ['Array', 'Two Pointers'],
    icon: 'i-lucide-copy-x',
    blurb: 'Sıralı diziden tekrarları YERİNDE sil. İki imleç: fast tarar, slow benzersizleri öne yazar. Ekstra bellek yok.',
    component: () => import('@/problems/0026-remove-dublicates-from-array/RemoveDuplicatesView.vue'),
  },
  {
    slug: 'remove-element',
    leetcodeId: 27,
    title: 'Remove Element',
    difficulty: 'Easy',
    tags: ['Array', 'Two Pointers'],
    icon: 'i-lucide-eraser',
    blurb: 'Sırasız diziden tüm val değerlerini YERİNDE sil. Sıra önemsiz → val’a denk gelince son elemanı oraya çek, sınırı daralt. Az silmede az yazma.',
    component: () => import('@/problems/0027-remove-element/RemoveElementView.vue'),
  },
]

// slug → problem (router/ileride detay için pratik erişim).
export const problemBySlug = (slug: string): ProblemMeta | undefined =>
  problems.find((p) => p.slug === slug)
