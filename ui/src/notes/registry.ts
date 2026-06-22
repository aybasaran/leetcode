// ════════════════════════════════════════════════════════════════
//  NOT (kitaplık) KAYIT DEFTERİ
//  Soru registry'sinin kardeşi. Yeni not = bir .md yaz + buraya 1 satır.
//  Router + ana sayfa otomatik listeler.
//  .md dosyaları "?raw" ile düz metin olarak import edilir (Vite); tek kaynak,
//  hem git'te okunur hem UI'da markdown-it ile render edilir.
// ════════════════════════════════════════════════════════════════
import bigO from './big-o.md?raw'

export interface NoteMeta {
  slug: string // URL parçası: /notes/<slug>
  title: string
  blurb: string // ana sayfada tek cümle özet
  icon?: string // Nuxt UI ikonu (i-lucide-*)
  source: string // ham markdown (?raw import)
}

export const notes: NoteMeta[] = [
  {
    slug: 'big-o',
    title: 'Big O — Karmaşıklık Sezgisi',
    blurb: 'Girdi büyüyünce iş nasıl büyür? Sabitleri at, döngüye bak, sınıfı tahmin et. Senin #21 ve #26 çözümlerinden örneklerle.',
    icon: 'i-lucide-gauge',
    source: bigO,
  },
]

export const noteBySlug = (slug: string): NoteMeta | undefined =>
  notes.find((n) => n.slug === slug)
