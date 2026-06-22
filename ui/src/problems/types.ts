// Tüm görselleştirmelerin paylaştığı tipler.
import type { Component } from 'vue'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

// Bir LeetCode sorusunun kayıt defteri girdisi.
export interface ProblemMeta {
  slug: string // URL parçası: /problems/<slug>
  leetcodeId: number // 21
  title: string // "Merge Two Sorted Lists"
  difficulty: Difficulty
  tags: string[] // ["Linked List", "Recursion"]
  blurb: string // ana sayfada görünen tek cümle özet
  icon?: string // Nuxt UI ikonu (örn. "i-lucide-git-merge")
  component: () => Promise<Component> // lazy yüklenen viz component
}

// ──────────────────────────────────────────────────────────
//  Görselleştirme (step-player) tipleri
// ──────────────────────────────────────────────────────────

// Açıklama metni parçası: düz string ya da renkli kalın vurgu.
// linked-list renkleri: l1 / l2 / cur / m   ·   array renkleri: slow / fast
export type MsgPart = string | { t: string; b: 'l1' | 'l2' | 'cur' | 'm' | 'slow' | 'fast' }

// Bağlı liste düğümü (sahnede tek kutu).
export interface LLNode {
  val: string | number
  variant: 'l1' | 'l2' | 'merged' | 'dummy'
  ghost?: boolean // tüketilmiş (soluk) düğüm
  compare?: boolean // şu an karşılaştırılıyor (amber nabız)
  pop?: boolean // yeni eklendi (pop animasyonu)
  flag?: { text: string; variant: 'cur' | 'head1' | 'head2' } // üstteki imleç bayrağı
}

// Bir şerit (list1 / list2 / birleşmiş / çağrı yığını).
export interface Lane {
  label: string
  dot: 'l1' | 'l2' | 'merged' | 'stack'
  nodes: LLNode[]
  liveArrows?: boolean // oklar yeşil mi
  nil?: { mode: 'box' | 'arrow'; text: string } // sona nil göstergesi
}

// Tek bir adım = sahnenin o anki fotoğrafı.
export interface Step {
  lanes: Lane[]
  codeLines: number[] // vurgulanacak kod satırları (1 tabanlı)
  message: MsgPart[]
}

// ──────────────────────────────────────────────────────────
//  DİZİ (array) görselleştirme tipleri
//  Linked list'in aksine: hücreler BİTİŞİK (ok yok), erişim İNDEKSLE.
//  İki imleç problemleri (remove duplicates, sliding window, ...) burayı paylaşır.
// ──────────────────────────────────────────────────────────

// Bir dizi hücresi (nums[i] = sahnede tek kutu).
export interface ArrCell {
  val: number
  // hücrenin o anki rolü → rengi belirler:
  //   idle  okunmamış (nötr)        kept  benzersiz bölge (yeşil)
  //   scan  fast şu an burada (amber)  dup   tekrar, atlandı (soluk)
  //   write az önce buraya yazıldı (pop animasyonu)
  state?: 'idle' | 'kept' | 'dup' | 'scan' | 'write'
  // hücrenin ÜSTÜNDEKİ imleç bayrakları (aynı hücrede slow+fast olabilir).
  flags?: { text: string; variant: 'slow' | 'fast' }[]
}

// Bir dizi şeridi: bitişik kutular + altında indeks numaraları.
export interface ArrLane {
  label: string
  dot: 'array' | 'slow' | 'fast'
  cells: ArrCell[]
  showIndex?: boolean // hücre altında 0,1,2,... indeksleri göster
}

// Dizi problemleri için adım (Step'in array karşılığı).
export interface ArrStep {
  lanes: ArrLane[]
  codeLines: number[]
  message: MsgPart[]
}
