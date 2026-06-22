# Big O — Karmaşıklık Sezgisi

> Amaç: bir algoritmanın **girdi büyüdükçe** ne kadar yavaşladığını (ya da ne kadar bellek yediğini) makineden bağımsız tek bir etiketle konuşabilmek. "Şu kod hızlı mı?" değil, "girdi 10 kat artarsa iş kaç kat artar?" sorusu.

---

## 1. Üç cümlede Big O

1. **Girdi (n) büyürken iş nasıl büyüyor** onu ölçer — saniye değil, **adım sayısının büyüme şekli**.
2. **Sabitleri ve küçük terimleri at.** `2n + 5` → `O(n)`. Çünkü n kocaman olunca `+5` ve `×2` görünmez olur.
3. Genelde **en kötü durumu** (worst case) konuşuruz — "en fenası ne kadar?"

Yani Big O bir **üst sınır eğrisidir**, kronometre değil.

---

## 2. "Sabitleri at" ne demek?

```go
func topla(nums []int) int {
    toplam := 0           // 1 iş
    for _, v := range nums {
        toplam += v       // n kez
    }
    return toplam         // 1 iş
}
```

Toplam iş = `n + 2`. Ama n = 1.000.000 iken `+2` hiçbir şey. Eğri `n` gibi büyüyor → **O(n)**.

İki ayrı döngü peş peşe olsaydı (`n + n = 2n`) yine **O(n)** — çünkü `×2` de sabit, atılır. Big O *şeklini* sorar, kat sayısını değil.

---

## 3. Sık görülen sınıflar (cheat sheet)

Hızlıdan yavaşa. "Adım" sütunları n büyüyünce ne kadar iş çıktığını gösterir — sezgi için:

| Notasyon | Ad | n = 10 | n = 1.000 | Tipik örnek |
|---|---|---|---|---|
| `O(1)` | sabit | 1 | 1 | dizi indeksi `nums[i]`, map'ten okuma |
| `O(log n)` | logaritmik | ~3 | ~10 | her adımda **yarıya bölmek** (binary search) |
| `O(n)` | doğrusal | 10 | 1.000 | diziyi bir kez gezmek |
| `O(n log n)` | log-lineer | ~33 | ~10.000 | iyi sıralama (sort), merge sort |
| `O(n²)` | karesel | 100 | 1.000.000 | **iç içe** iki döngü, her ikiliyi kıyaslamak |
| `O(2ⁿ)` | üstel | 1.024 | 🙈 astronomik | her elemanı "al / alma" tüm kombinasyonlar |

> Anahtar fikir: `O(1)` "**hızlı**" demek değil — "**girdiyle büyümüyor**" demek. Kocaman ama sabit bir iş de O(1)'dir.

---

## 4. Döngüye bakıp sınıfı tahmin etmek

Pratikte %90 şu kalıplarla çözülür:

- **Tek düz döngü** (`for i := 0; i < n; i++`) → **O(n)**
- **İç içe iki döngü** (dış n, iç n) → **O(n²)**
- **Her adımda problemi yarıya bölmek** → **O(log n)**
- **Peş peşe (ayrı ayrı) döngüler** → toplanır, sonra büyük olan yutar: `O(n) + O(n) = O(n)`
- **Döngü içinde gizli iş** → o işin maliyetiyle çarp. Örn. döngü içinde `O(n)` bir arama varsa toplam **O(n²)**.

```go
// O(n²): her ikili için iş — dış n, iç n
for i := 0; i < n; i++ {
    for j := 0; j < n; j++ {
        // ...
    }
}
```

```go
// O(log n): aralığı her turda yarıya indir
for lo <= hi {
    mid := (lo + hi) / 2
    if hedef < nums[mid] { hi = mid - 1 } else { lo = mid + 1 }
}
```

---

## 5. Zaman ≠ Bellek — iki ayrı Big O

Her algoritmanın **iki** karmaşıklığı var:

- **Zaman (time):** kaç adım?
- **Bellek (space):** girdinin dışında **ekstra** ne kadar yer? (Girdinin kendisi sayılmaz.)

**Yerinde (in-place)** çalışmak = ekstra bellek **O(1)**. Diziyi kopyalamadan, üstüne yazarak.

```go
// Ekstra bellek O(1): yeni dizi açmadık, nums'un üstüne yazdık
nums[slow] = nums[fast]
```

Yeni bir dizi/liste/map açıyorsan, boyutu kadar bellek eklenir (çoğu zaman O(n)).

---

## 6. Senin çözümlerinden örnekler

### #21 — Merge Two Sorted Lists
- **Zaman:** iki listeyi tek geçişte örüyorsun → **O(n + m)** (n, m = liste uzunlukları).
- **Bellek:** iteratif (dummy + döngü) sürüm yeni düğüm yaratmaz, sadece `Next` oklarını bağlar → **O(1)**.
- Özyinelemeli (recursive) sürüm aynı zaman ama **O(n + m) bellek** — çünkü her düğüm için **çağrı yığınında** (call stack) bir kare birikiyor.

> Aynı problem, aynı zaman karmaşıklığı, **farklı bellek**. Big O'da bu detay önemli.

### #26 — Remove Duplicates from Sorted Array
- **Zaman:** `fast` diziyi bir kez tarıyor → **O(n)**.
- **Bellek:** `slow`/`fast` iki imleç, diziyi **yerinde** üzerine yazıyorsun → **O(1)**.

İşte iki imleç tekniğinin tüm güzelliği: ekstra dizi açmadan O(1) bellekle hallediyorsun.

---

## 7. Sık tuzaklar

- **"O(1) = hızlı" sanmak.** Yanlış. O(1) = girdiyle büyümeyen. Devasa sabit bir iş de O(1).
- **Gizli döngüler.** `arr.indexOf(x)` bir döngüdür (O(n)). Onu bir döngü içine koyarsan O(n²) olur. Dilim `append`, `string` birleştirme, `copy` da maliyetli olabilir.
- **Log tabanı önemsiz.** `log₂` mi `log₁₀` mu fark etmez — tabanlar arası fark sabit kat, atılır. Hepsi `O(log n)`.
- **Ortalama vs en kötü.** Çoğu yer en kötüyü konuşur; bazı yapılar (hash map) ortalama O(1), en kötü O(n) olabilir.

---

## 8. 10 saniyelik özet

| Gördüğün | Düşün |
|---|---|
| Tek döngü | `O(n)` |
| İç içe döngü | `O(n²)` |
| Yarıya bölme | `O(log n)` |
| Sıralama | `O(n log n)` |
| Yeni dizi/map açtın | + `O(n)` bellek |
| Yerinde yazdın | `O(1)` bellek |

> Big O ezberlenmez, **gözle okunur**: "girdi 2 katına çıkarsa bu döngü kaç kat döner?" diye sor. Cevabın eğrisi senin Big O'ndur.
