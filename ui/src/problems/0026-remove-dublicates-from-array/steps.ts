import type { ArrCell, ArrLane, ArrStep, MsgPart } from '@/problems/types'

// Örnek girdi: bir üçlü tekrar (1,1,1) içerir ki "üst üste atlama" görünsün.
const INPUT = [0, 0, 1, 1, 1, 2, 3, 3]

// solution.go — ham kaynak (Shiki renklendirir). Satır numaraları codeLines ile eşleşir:
//  1 slow:=0   2 for   3 if   4 slow++   5 yaz   6 }   7 }   8 return
export const SOURCE = `slow := 0
for fast := 1; fast < len(nums); fast++ {
    if nums[fast] != nums[slow] {
        slow++
        nums[slow] = nums[fast]
    }
}
return slow + 1`

type CellOpts = { write?: boolean; final?: boolean; fastState?: 'scan' | 'dup' | 'idle' }

// ── tek bir kareyi (hücreler + bayraklar) üret ──
// a    : dizinin O ANKİ hali (yerinde değişir, çöp dahil gerçek durum)
// slow : benzersiz bölgenin sonu   ·   fast : tarama imleci (-1 = gösterme)
function buildCells(a: number[], slow: number, fast: number, opts: CellOpts = {}): ArrCell[] {
  const showFast = fast >= 0 && !opts.final

  return a.map((val, i): ArrCell => {
    // ── durum (renk) ──
    let state: ArrCell['state']
    if (opts.final) {
      state = i <= slow ? 'kept' : 'dup' // bitişte: ilk k yeşil, kalan çöp soluk
    } else if (i === fast && showFast) {
      state = opts.write && i === slow ? 'write' : (opts.fastState ?? 'scan')
    } else if (opts.write && i === slow) {
      state = 'write' // az önce buraya yazıldı (pop)
    } else if (i <= slow) {
      state = 'kept' // kilitli benzersiz bölge
    } else if (i < fast) {
      state = 'dup' // iki imleç arası = silinen/atlanan bölge
    } else {
      state = 'idle' // henüz dokunulmadı
    }

    // ── üstteki imleç bayrakları ──
    const flags: { text: string; variant: 'slow' | 'fast' }[] = []
    if (i === slow && (showFast || opts.final)) flags.push({ text: 'slow', variant: 'slow' })
    if (i === fast && showFast) flags.push({ text: 'fast', variant: 'fast' })

    return { val, state, ...(flags.length ? { flags } : {}) }
  })
}

// ── algoritmayı koş, her anın ArrStep'ini üret ──
export function buildSteps(): ArrStep[] {
  const a = [...INPUT] // çalışma kopyası (yerinde değişecek)
  const n = a.length
  const steps: ArrStep[] = []
  let slow = 0

  const lane = (cells: ArrCell[]): ArrLane => ({
    label: 'nums (sıralı)',
    dot: 'array',
    cells,
    showIndex: true,
  })
  const frame = (fast: number, codeLines: number[], message: MsgPart[], opts: CellOpts = {}) => {
    steps.push({ lanes: [lane(buildCells(a, slow, fast, opts))], codeLines, message })
  }

  // 0) kurulum
  frame(1, [1], [
    'Kurulum. ',
    { t: 'slow', b: 'slow' },
    ' = 0: benzersiz bölgenin sonu (ilk eleman daima benzersiz). ',
    { t: 'fast', b: 'fast' },
    ' indeks 1’den başlayıp tüm diziyi tarayacak.',
  ], { fastState: 'idle' })

  // döngü: her fast için karşılaştır → (atla | yaz)
  for (let fast = 1; fast < n; fast++) {
    const vf = a[fast]
    const vs = a[slow]
    if (vf === undefined || vs === undefined) continue // TS guard (indeksler geçerli)
    const same = vf === vs

    // 1) karşılaştır
    frame(fast, [2, 3], [
      'Tara: ',
      { t: `nums[${fast}]=${vf}`, b: 'fast' },
      ' ile ',
      { t: `nums[${slow}]=${vs}`, b: 'slow' },
      ' eşit mi? ',
      same ? 'Evet → tekrar.' : 'Hayır → yeni benzersiz.',
    ])

    if (same) {
      // 2a) tekrar → atla (slow durur, fast ilerler)
      frame(fast, [3], [
        { t: String(vf), b: 'fast' },
        ' zaten benzersiz bölgenin sonunda var (',
        { t: `nums[${slow}]`, b: 'slow' },
        '). Tekrar → atla. ',
        { t: 'slow', b: 'slow' },
        ' durur, sadece ',
        { t: 'fast', b: 'fast' },
        ' ilerler.',
      ], { fastState: 'dup' })
    } else {
      // 2b) yeni benzersiz → slow ilerle, yerinde yaz
      slow++
      a[slow] = vf
      frame(fast, [4, 5], [
        'Yeni değer! ',
        { t: 'slow', b: 'slow' },
        ` indeksi ${slow} oldu, `,
        { t: `nums[${slow}] = ${vf}`, b: 'slow' },
        ' yazıldı — diziyi YERİNDE ezdik, eski değer gitti (ekstra bellek yok).',
      ], { write: true })
    }
  }

  // 3) bitiş
  const k = slow + 1
  steps.push({
    lanes: [lane(buildCells(a, slow, -1, { final: true }))],
    codeLines: [8],
    message: [
      'Tarama bitti. ',
      { t: `k = slow+1 = ${k}`, b: 'slow' },
      `. nums[:${k}] = [${a.slice(0, k).join(', ')}] ✅ benzersizler, sırayla. `,
      `Sonraki ${n - k} hücre (soluk) çöp — LeetCode onları umursamaz.`,
    ],
  })

  return steps
}
