import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  toValue,
  type Ref,
  type ComputedRef,
  type MaybeRefOrGetter,
} from 'vue'

// Step-player'ın dışarıya açtığı arayüz.
export interface StepPlayer {
  index: Ref<number> // şu anki adım (0 tabanlı)
  playing: Ref<boolean> // otomatik oynatma açık mı
  total: ComputedRef<number> // toplam adım (reactive → mode geçince değişir)
  atStart: ComputedRef<boolean>
  atEnd: ComputedRef<boolean>
  next: () => void
  prev: () => void
  reset: () => void
  toggle: () => void
}

// Adımlar arası gezinme mantığı. total reaktif (ref/getter) olabilir → iterative
// (13 adım) ile recursive (farklı adım) arasında geçişte otomatik uyum sağlar.
export function useStepPlayer(total: MaybeRefOrGetter<number>, intervalMs = 1500): StepPlayer {
  const totalRef = computed(() => toValue(total))
  const index = ref(0)
  const playing = ref(false)
  let timer: ReturnType<typeof setInterval> | undefined

  const atStart = computed(() => index.value === 0)
  const atEnd = computed(() => index.value >= totalRef.value - 1)

  const go = (k: number) => {
    index.value = Math.min(Math.max(k, 0), Math.max(0, totalRef.value - 1))
  }

  const stop = () => {
    if (timer) clearInterval(timer)
    timer = undefined
    playing.value = false
  }

  const next = () => {
    stop()
    go(index.value + 1)
  }
  const prev = () => {
    stop()
    go(index.value - 1)
  }
  const reset = () => {
    stop()
    go(0)
  }

  const toggle = () => {
    if (playing.value) {
      stop()
      return
    }
    if (atEnd.value) go(0)
    playing.value = true
    timer = setInterval(() => {
      if (index.value >= totalRef.value - 1) {
        stop()
        return
      }
      index.value++
    }, intervalMs)
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
  }

  // Mount'ta dinle, unmount'ta KALDIR + timer temizle (leak/çift-dinleyici önler).
  onMounted(() => window.addEventListener('keydown', onKey))
  onUnmounted(() => {
    stop()
    window.removeEventListener('keydown', onKey)
  })

  return { index, playing, total: totalRef, atStart, atEnd, next, prev, reset, toggle }
}
