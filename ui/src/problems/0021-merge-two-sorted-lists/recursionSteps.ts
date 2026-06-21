import type { Lane, LLNode, Step } from '@/problems/types'

// Aynı örnek girdi.
const L1 = [1, 2, 4]
const L2 = [1, 3, 4]

// Özyinelemeli çözüm — ham kaynak (Shiki renklendirir). Satırlar codeLines ile eşleşir.
export const REC_SOURCE = `func merge(l1, l2 *ListNode) *ListNode {
    if l1 == nil { return l2 }
    if l2 == nil { return l1 }
    if l1.Val <= l2.Val {
        l1.Next = merge(l1.Next, l2)
        return l1
    }
    l2.Next = merge(l1, l2.Next)
    return l2
}`

type Pick = { val: number; src: 'l1' | 'l2' }

// ── lane üreticiler ──

function listLane(
  arr: number[],
  headIdx: number,
  variant: 'l1' | 'l2',
  flagVariant: 'head1' | 'head2',
  flagText: string,
  comparing: boolean,
): Lane {
  const label = variant === 'l1' ? 'list1' : 'list2'
  const nodes: LLNode[] = arr.map((val, idx) => {
    const node: LLNode = { val, variant }
    if (idx < headIdx) node.ghost = true
    if (idx === headIdx) {
      node.flag = { text: flagText, variant: flagVariant }
      if (comparing) node.compare = true
    }
    return node
  })
  const lane: Lane = { label, dot: variant, nodes }
  if (headIdx >= arr.length) lane.nil = { mode: 'box', text: `${label} = nil` }
  return lane
}

// Çağrı yığını: itilen seçimler. Son `popped` tanesi (dönenler) ghost.
function stackLane(stack: Pick[], popped: number): Lane {
  const nodes: LLNode[] = stack.map((s, idx) => ({
    val: s.val,
    variant: s.src,
    ghost: idx >= stack.length - popped,
  }))
  return { label: 'çağrı yığını (derinlik →)', dot: 'stack', nodes }
}

// Sonuç: dönüşte baştan örülür. popFirst → 0. index pop animasyonu.
function resultLane(result: Pick[], popFirst: boolean, done: boolean): Lane {
  const nodes: LLNode[] = result.map((r, idx) => ({
    val: r.val,
    variant: 'merged',
    pop: idx === 0 && popFirst,
  }))
  const lane: Lane = { label: 'sonuç (dönüşte örülür)', dot: 'merged', nodes, liveArrows: true }
  if (done) lane.nil = { mode: 'arrow', text: 'nil' }
  return lane
}

// ── adımları üret ──
export function buildRecursionSteps(): Step[] {
  const steps: Step[] = []
  let i = 0
  let j = 0
  const stack: Pick[] = []
  let result: Pick[] = []

  // başlangıç
  steps.push({
    lanes: [
      listLane(L1, 0, 'l1', 'head1', 'list1 →', false),
      listLane(L2, 0, 'l2', 'head2', 'list2 →', false),
      stackLane(stack, 0),
      resultLane(result, false, false),
    ],
    codeLines: [1],
    message: [
      'Özyineleme. Her ',
      { t: 'merge(l1, l2)', b: 'm' },
      ' çağrısı bir küçük baş seçer, KALANI yine kendine sorar (derine iner). Sonuç DÖNÜŞTE örülür.',
    ],
  })

  // İNİŞ: her çağrı küçük başı seç, kalan için recurse.
  while (i < L1.length && j < L2.length) {
    const a = L1[i]
    const b = L2[j]
    if (a === undefined || b === undefined) break

    // karşılaştırma
    steps.push({
      lanes: [
        listLane(L1, i, 'l1', 'head1', 'list1 →', true),
        listLane(L2, j, 'l2', 'head2', 'list2 →', true),
        stackLane(stack, 0),
        resultLane(result, false, false),
      ],
      codeLines: [4],
      message: [
        'merge çağrısı: ',
        { t: String(a), b: 'l1' },
        ' ≤ ',
        { t: String(b), b: 'l2' },
        ' ? ',
        a <= b ? 'Evet → list1 başını seç.' : 'Hayır → list2 başını seç.',
      ],
    })

    // seç + derine in
    if (a <= b) {
      stack.push({ val: a, src: 'l1' })
      i++
      steps.push({
        lanes: [
          listLane(L1, i, 'l1', 'head1', 'list1 →', false),
          listLane(L2, j, 'l2', 'head2', 'list2 →', false),
          stackLane(stack, 0),
          resultLane(result, false, false),
        ],
        codeLines: [5],
        message: [
          { t: String(a), b: 'l1' },
          " seçildi → yığına itildi. Kalan için DERİNE in: merge(list1.Next, list2). Şu an 'return' YAPMADIK, askıda.",
        ],
      })
    } else {
      stack.push({ val: b, src: 'l2' })
      j++
      steps.push({
        lanes: [
          listLane(L1, i, 'l1', 'head1', 'list1 →', false),
          listLane(L2, j, 'l2', 'head2', 'list2 →', false),
          stackLane(stack, 0),
          resultLane(result, false, false),
        ],
        codeLines: [8],
        message: [
          { t: String(b), b: 'l2' },
          ' seçildi → yığına itildi. Kalan için DERİNE in: merge(list1, list2.Next). Askıda.',
        ],
      })
    }
  }

  // TABAN DURUMU (base case): biri nil → öbürünü olduğu gibi döndür.
  const l1Empty = i >= L1.length
  const tail: Pick[] = l1Empty
    ? L2.slice(j).map((v) => ({ val: v, src: 'l2' as const }))
    : L1.slice(i).map((v) => ({ val: v, src: 'l1' as const }))
  result = [...tail]
  i = L1.length
  j = L2.length
  steps.push({
    lanes: [
      listLane(L1, L1.length, 'l1', 'head1', 'list1 →', false),
      listLane(L2, L2.length, 'l2', 'head2', 'list2 →', false),
      stackLane(stack, 0),
      resultLane(result, true, false),
    ],
    codeLines: l1Empty ? [2] : [3],
    message: l1Empty
      ? [
          'TABAN DURUMU: list1 boş → ',
          { t: 'return list2', b: 'm' },
          '. En derindeki çağrı, kalan list2 kuyruğunu döndürdü. Sonuç bununla başlıyor.',
        ]
      : [
          'TABAN DURUMU: list2 boş → ',
          { t: 'return list1', b: 'm' },
          '. Sonuç bununla başlıyor.',
        ],
  })

  // DÖNÜŞ: yığını sondan boşalt, her seçimi sonucun BAŞINA ekle (LIFO).
  const totalPushed = stack.length
  for (let p = 1; p <= totalPushed; p++) {
    const top = stack[totalPushed - p]
    if (!top) break
    result = [{ val: top.val, src: top.src }, ...result]
    const done = p === totalPushed
    steps.push({
      lanes: [
        listLane(L1, L1.length, 'l1', 'head1', 'list1 →', false),
        listLane(L2, L2.length, 'l2', 'head2', 'list2 →', false),
        stackLane(stack, p),
        resultLane(result, true, done),
      ],
      codeLines: top.src === 'l1' ? [5, 6] : [8, 9],
      message: done
        ? [
            'En dış çağrı döndü: ',
            { t: String(top.val), b: top.src },
            '.Next = alttan gelen → tüm zincir hazır. Sonuç: [',
            result.map((r) => r.val).join(', '),
            '] ✅',
          ]
        : [
            { t: String(top.val), b: top.src },
            ' çağrısı döndü: ',
            { t: `${top.val}.Next`, b: top.src },
            ' = alttan dönen liste. Bağla ve ',
            { t: `return ${top.val}`, b: 'm' },
            '.',
          ],
    })
  }

  return steps
}
