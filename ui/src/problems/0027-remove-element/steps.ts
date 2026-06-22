import type { ArrCell, ArrLane, ArrStep, MsgPart } from '@/problems/types'

// Örnek girdi: LeetCode örnek 2. KRİTİK: i=2'de sondan çekilen eleman da `val`
// çıkar (idx7'deki 2). Bu yüzden "sildikten sonra i'yi ilerletme" kuralı burada
// gözle görülür — i durmasaydı o 2 dizide kalırdı.
const INPUT = [0, 1, 2, 2, 3, 0, 4, 2]
const VAL = 2

// solution (swap-from-end) — ham kaynak (Shiki renklendirir). codeLines bunun
// 1 tabanlı satırlarıyla eşleşir.
//  1 i,n     2 for     3 if==val     4 yaz(sondan çek)     5 n--     6 else     7 i++     8 }     9 }     10 return n
export const SOURCE = `i, n := 0, len(nums)
for i < n {
    if nums[i] == val {
        nums[i] = nums[n-1]
        n--
    } else {
        i++
    }
}
return n`

type CellOpts = { write?: boolean; final?: boolean }

// ── tek bir kareyi (hücreler + bayraklar) üret ──
// a    : dizinin O ANKİ hali (yerinde değişir; sağ bölge "çöp" ama gerçek durum)
// i    : soldan tarama imleci (-1 = gösterme)   ·   n : canlı bölge sınırı (nums[0:n])
// final modunda n = sonuç k olarak gelir.
function buildCells(a: number[], i: number, n: number, opts: CellOpts = {}): ArrCell[] {
  const showScan = i >= 0 && !opts.final

  return a.map((val, idx): ArrCell => {
    // ── durum (renk) ──
    let state: ArrCell['state']
    if (opts.final) {
      state = idx < n ? 'kept' : 'dup' // bitişte: ilk k yeşil (kalanlar), gerisi çöp
    } else if (idx >= n) {
      state = 'dup' // n'den itibaren sağ taraf = atılmış bölge (soluk)
    } else if (idx === i && showScan) {
      state = opts.write ? 'write' : 'scan' // i burada: az önce yazıldıysa pop, değilse tarama
    } else if (idx < i) {
      state = 'kept' // i'nin solu = saklandı (val değildi)
    } else {
      state = 'idle' // i ile n arası = henüz taranmadı (canlı)
    }

    // ── üstteki imleç bayrakları: i (tarama) ve n-1 (sondan çekilecek donör) ──
    const flags: { text: string; variant: 'slow' | 'fast' }[] = []
    if (showScan) {
      if (idx === i) flags.push({ text: 'i', variant: 'fast' })
      if (idx === n - 1) flags.push({ text: 'n−1', variant: 'slow' })
    }

    return { val, state, ...(flags.length ? { flags } : {}) }
  })
}

// ── algoritmayı koş, her anın ArrStep'ini üret ──
export function buildSteps(): ArrStep[] {
  const a = [...INPUT] // çalışma kopyası (yerinde değişecek)
  const steps: ArrStep[] = []
  let i = 0
  let n = a.length

  const lane = (cells: ArrCell[]): ArrLane => ({
    label: `nums (sırasız) · val = ${VAL}`,
    dot: 'array',
    cells,
    showIndex: true,
  })
  const frame = (codeLines: number[], message: MsgPart[], opts: CellOpts = {}) => {
    steps.push({ lanes: [lane(buildCells(a, i, n, opts))], codeLines, message })
  }

  // 0) kurulum
  frame([1], [
    'Kurulum. ',
    { t: 'i', b: 'fast' },
    ' = 0 soldan tarar. ',
    { t: 'n', b: 'slow' },
    ` = ${n}: canlı bölgenin sınırı (nums[0:${n}]). `,
    { t: `val = ${VAL}`, b: 'fast' },
    ' silinecek. Sıra önemsiz → sileceğimizi SONDAKİ ile takas edip n’i daraltacağız.',
  ])

  // döngü: i < n oldukça karşılaştır → (sakla/i++ | takas/n--)
  while (i < n) {
    const vi = a[i]
    if (vi === undefined) break // TS guard
    const match = vi === VAL

    // 1) karşılaştır
    frame([2, 3], [
      'Tara: ',
      { t: `nums[${i}] = ${vi}`, b: 'fast' },
      ` == val(${VAL}) mı? `,
      match ? 'Evet → sil.' : 'Hayır → sakla.',
    ])

    if (match) {
      // 2a) eşleşti → sondakini buraya çek, n--. i SABİT (gelen değer de kontrol edilmeli).
      const donor = a[n - 1] ?? vi
      const donorIdx = n - 1
      a[i] = donor
      n--
      frame([4, 5], [
        'Sil: sondaki ',
        { t: `nums[${donorIdx}] = ${donor}`, b: 'slow' },
        ' değerini ',
        { t: `nums[${i}]`, b: 'fast' },
        ` üzerine çektik, sınır küçüldü → `,
        { t: `n = ${n}`, b: 'slow' },
        '. ',
        { t: 'i', b: 'fast' },
        ' İLERLEMEZ — gelen değeri de kontrol edeceğiz.',
      ], { write: true })
    } else {
      // 2b) eşleşmedi → sakla, i ilerle
      i++
      frame([7], [
        { t: String(vi), b: 'fast' },
        ` ≠ ${VAL} → kalsın (saklandı). Sadece `,
        { t: 'i', b: 'fast' },
        ` ilerler → ${i}. `,
        { t: 'n', b: 'slow' },
        ' sabit.',
      ])
    }
  }

  // 3) bitiş — i ve n buluştu, canlı bölge bitti
  const k = n
  steps.push({
    lanes: [lane(buildCells(a, -1, k, { final: true }))],
    codeLines: [10],
    message: [
      { t: `i = n = ${k}`, b: 'slow' },
      ' → döngü bitti. ',
      { t: `k = ${k}`, b: 'slow' },
      `. nums[:${k}] = [${a.slice(0, k).join(', ')}] ✅ val’sız elemanlar — `,
      'SIRA değişti ama küme doğru (LeetCode sırayı umursamaz). ',
      `Sağdaki ${a.length - k} hücre (soluk) çöp.`,
    ],
  })

  return steps
}
