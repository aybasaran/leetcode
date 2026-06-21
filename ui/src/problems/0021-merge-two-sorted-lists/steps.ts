import type { Lane, LLNode, Step } from '@/problems/types'

// Örnek girdi (LeetCode örnek 1).
const L1 = [1, 2, 4]
const L2 = [1, 3, 4]

// solution.go — ham kaynak (Shiki renklendirir). Satır numaraları codeLines ile eşleşir:
//  1 dummy  2 cur  3 for  4 if  5/6 list1 dalı  7 else  8/9 list2 dalı
//  10 }  11 cur=cur.Next  12 }  13 if  14 list1  15 else  16 list2  17 }  18 return
export const ITER_SOURCE = `dummy := &ListNode{}
cur := dummy
for list1 != nil && list2 != nil {
    if list1.Val <= list2.Val {
        cur.Next = list1
        list1 = list1.Next
    } else {
        cur.Next = list2
        list2 = list2.Next
    }
    cur = cur.Next
}
if list1 != nil {
    cur.Next = list1
} else {
    cur.Next = list2
}
return dummy.Next`

// ── lane üreticiler (her adımda taze = anlık fotoğraf) ──

// list1 / list2 şeridi: tüketilenler ghost, baş düğümde bayrak, opsiyonel compare.
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

// birleşmiş şerit: dummy + eklenen düğümler. curAt=-1 ise cur dummy'de.
function mergedLane(merged: number[], curAt: number, popIdx: number, done: boolean): Lane {
  const nodes: LLNode[] = []
  const dummy: LLNode = { val: '∅', variant: 'dummy' }
  if (curAt === -1) dummy.flag = { text: 'cur', variant: 'cur' }
  nodes.push(dummy)
  merged.forEach((val, idx) => {
    const node: LLNode = { val, variant: 'merged' }
    if (idx === curAt) node.flag = { text: 'cur', variant: 'cur' }
    if (idx === popIdx) node.pop = true
    nodes.push(node)
  })
  const lane: Lane = {
    label: 'birleşmiş liste (dummy → ...)',
    dot: 'merged',
    nodes,
    liveArrows: true,
  }
  if (done) lane.nil = { mode: 'arrow', text: 'nil' }
  return lane
}

// ── algoritmayı koş, her anın Step'ini üret ──
export function buildSteps(): Step[] {
  const steps: Step[] = []
  let i = 0
  let j = 0
  const merged: number[] = []
  let curAt = -1 // -1 => cur dummy'de; k => cur merged[k]'da

  const lanes = (cmp: boolean, popIdx: number, done: boolean): Lane[] => [
    listLane(L1, i, 'l1', 'head1', 'list1 →', cmp),
    listLane(L2, j, 'l2', 'head2', 'list2 →', cmp),
    mergedLane(merged, curAt, popIdx, done),
  ]

  // başlangıç
  steps.push({
    lanes: lanes(false, -1, false),
    codeLines: [1, 2],
    message: [
      'Başlangıç. ',
      { t: 'dummy', b: 'm' },
      ' sahte düğümünü yarattık, ',
      { t: 'cur', b: 'cur' },
      ` onu gösteriyor. İki listenin de başı duruyor: list1→${L1[0]}, list2→${L2[0]}.`,
    ],
  })

  // döngü: karşılaştır → bağla
  while (i < L1.length && j < L2.length) {
    // a/b = baş değerler. while koşulu doluluk garanti eder ama TS bilmez → açık guard.
    const a = L1[i]
    const b = L2[j]
    if (a === undefined || b === undefined) break

    steps.push({
      lanes: lanes(true, -1, false),
      codeLines: [3, 4],
      message: [
        'Döngü dönüyor (ikisi de dolu). Başları karşılaştır: ',
        { t: String(a), b: 'l1' },
        ' ≤ ',
        { t: String(b), b: 'l2' },
        ' ? ',
        a <= b ? 'Evet → list1 kazanır.' : 'Hayır → list2 kazanır.',
      ],
    })

    if (a <= b) {
      merged.push(a)
      curAt = merged.length - 1
      i++
      steps.push({
        lanes: lanes(false, curAt, false),
        codeLines: [5, 6, 11],
        message: [
          { t: String(a), b: 'l1' },
          "'i zincire bağladık (cur.Next = list1), list1 ileri gitti, ",
          { t: 'cur', b: 'cur' },
          ' yeni kuyruğa kaydı.',
        ],
      })
    } else {
      merged.push(b)
      curAt = merged.length - 1
      j++
      steps.push({
        lanes: lanes(false, curAt, false),
        codeLines: [8, 9, 11],
        message: [
          { t: String(b), b: 'l2' },
          "'i zincire bağladık (cur.Next = list2), list2 ileri gitti, ",
          { t: 'cur', b: 'cur' },
          ' yeni kuyruğa kaydı.',
        ],
      })
    }
  }

  // kalan kuyruğu tek okla ekle
  const restIsL1 = i < L1.length
  const restArr = restIsL1 ? L1 : L2
  let restIdx = restIsL1 ? i : j
  const hadRest = restIdx < restArr.length
  while (restIdx < restArr.length) {
    const v = restArr[restIdx]
    if (v !== undefined) merged.push(v)
    restIdx++
  }
  curAt = merged.length - 1
  if (restIsL1) i = L1.length
  else j = L2.length
  steps.push({
    lanes: lanes(false, -1, false),
    codeLines: [13, 14, 15, 16, 17],
    message: hadRest
      ? [
          'Döngü bitti — biri ',
          { t: 'nil', b: 'cur' },
          ' oldu. Kalan ',
          { t: restIsL1 ? 'list1' : 'list2', b: restIsL1 ? 'l1' : 'l2' },
          ' parçası zaten sıralı, tek okla kuyruğa taktık. Tek tek gezmedik → O(1).',
        ]
      : ['Döngü bitti, ikisi de boştu. Eklenecek kuyruk yok.'],
  })

  // dönüş
  steps.push({
    lanes: lanes(false, -1, true),
    codeLines: [18],
    message: [
      { t: 'return dummy.Next', b: 'm' },
      ` → sahte başı atlıyoruz, gerçek baş onun bir sonrası. Sonuç: [${merged.join(', ')}] ✅ Hepsi tek sıralı zincir.`,
    ],
  })

  return steps
}
