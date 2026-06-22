// package removedublicatesfromarray — bu dosyanın ait olduğu paket.
// "main" değil, kütüphane → yan dosyadaki solution_test.go bunu import edip
// removeDuplicates fonksiyonunu doğrudan çağırabiliyor.
package removedublicatesfromarray

// ════════════════════════════════════════════════════════════════════
//  SLICE (dilim) hızlı ders — bu sorunun KALBİ
// ════════════════════════════════════════════════════════════════════
//
// Go'da iki ayrı şey var, karıştırma:
//
//   ARRAY (dizi):  [5]int   -> SABİT boyutlu, boyut tipin parçası. Az kullanılır.
//   SLICE (dilim): []int    -> esnek boyutlu, GÜNLÜK hayatta kullandığın budur.
//
// Bir slice aslında 3 şeyden oluşan küçük bir başlıktır:
//
//   ┌──────────┬─────┬─────┐
//   │ pointer  │ len │ cap │   pointer -> arkadaki gerçek diziyi (backing array) gösterir
//   └──────────┴─────┴─────┘   len = şu an kaç eleman, cap = arkadaki dizinin kapasitesi
//
// EN ÖNEMLİ NOKTA: slice arkadaki diziye bir PENCEREDİR, kopya DEĞİL.
// Fonksiyona slice geçince başlık kopyalanır ama pointer AYNI diziyi gösterir.
// Yani `nums[slow] = nums[fast]` yazınca ÇAĞIRANIN dizisini değiştirirsin.
// İşte bu yüzden "in-place" (yerinde) çalışıp ekstra bellek harcamadan
// diziyi düzenleyebiliyoruz. C bilenler için: slice ≈ {ptr, len, cap}.
//
// Reslice (yeniden dilimleme):  nums[:k]  -> "ilk k elemanı kapsayan pencere".
// LeetCode tam da bunu kontrol eder: ilk k eleman benzersizler mi?
// Sondaki çöp elemanlar (k'dan sonrası) UMURUNDA DEĞİL.

// ════════════════════════════════════════════════════════════════════
//  İKİ İMLEÇ (two pointers) — slow / fast
// ════════════════════════════════════════════════════════════════════
//
// Dizi ZATEN SIRALI. Demek ki aynı sayılar yan yana kümelenmiş:
//
//   [0, 0, 1, 1, 1, 2, 3, 3]
//    ^^^^  ^^^^^^^  ^  ^^^^
//
// Fikir: iki imleç gez.
//   slow -> "benzersiz bölgenin sonu" (yazma kafası). nums[0..slow] hep benzersiz.
//   fast -> tüm diziyi tarayan okuma kafası (1'den sona).
//
// fast yeni bir değer bulursa (nums[fast] != nums[slow]) onu benzersiz
// bölgenin hemen ardına YAZARIZ. Aynıysa atlarız (slow durur, fast ilerler).
// Sonunda benzersiz adet = slow + 1 (indeks 0'dan saydığımız için +1).
//
// Karmaşıklık: zaman O(n) (tek geçiş), ek bellek O(1) (yerinde).

// ════════════════════════════════════════════════════════════════════
//  ÇÖZÜLECEK FONKSİYON
// ════════════════════════════════════════════════════════════════════

// removeDuplicates sıralı bir diziden tekrarları YERİNDE siler.
//
// Parametre:
//
//	nums []int -> sıralı dizi (boş olabilir)
//
// Dönüş:
//
//	int -> benzersiz eleman sayısı k. Ayrıca nums[:k] benzersizleri (sırayla) tutar.
func removeDuplicates(nums []int) int {
	// Kenar durum: boş dizi. Yazılacak/silinecek bir şey yok, k = 0.
	// (Bu guard olmasa slow := 0 + return slow+1 boş diziye 1 derdi — yanlış.)
	if len(nums) == 0 {
		return 0
	}

	// slow = benzersiz bölgenin SON yazılan indeksi.
	// 0. eleman daima benzersizdir (öncesinde hiçbir şey yok), o yüzden slow=0'dan başla.
	slow := 0

	// Çekirdek döngü — slow/fast yazma imleci.
	// fast = okuma kafası: diziyi 1'den sona tek geçişte tarar.
	// (0. eleman zaten yerinde ve benzersiz olduğu için fast 1'den başlar.)
	for fast := 1; fast < len(nums); fast++ {
		// nums[fast] benzersiz bölgenin SON elemanından (nums[slow]) farklı mı?
		// Dizi sıralı → "farklı" demek "yeni bir benzersiz değer başladı" demek.
		if nums[fast] != nums[slow] {
			// Yeni benzersiz bulundu:
			slow++                  // 1) yazma kafasını ilerlet (öne bir slot aç),
			nums[slow] = nums[fast] // 2) benzersizi o slota yaz — bu satır ÇAĞIRANIN dizisini değiştirir (in-place).
		}
		// Eşitse: duplikat. Hiçbir şey yapma → slow durur, fast kendi ilerler (atla).
	}

	// slow = son yazılan benzersizin indeksi. İndeks 0'dan saydığımız için adet = slow + 1.
	return slow + 1
}

// ════════════════════════════════════════════════════════════════════
//  STRATEJİ İPUÇLARI (kodu sen yazıyorsun, ben yön gösteriyorum)
// ════════════════════════════════════════════════════════════════════
//
//  YAKLAŞIM A — slow/fast yazma imleci  [klasik, O(1) bellek]  ← önerilen
//    1) len(nums)==0 ise 0 dön (üstte hazır).
//    2) slow := 0
//    3) fast 1'den sona: nums[fast] != nums[slow] ise -> slow++, nums[slow]=nums[fast]
//    4) return slow + 1
//
//  YAKLAŞIM B — "son tutulan değer"i hatırla  [aynı fikir, farklı bakış]
//    - k := 0 (yazılacak sıradaki indeks), prev'i takip et.
//    - her eleman prev'den farklıysa nums[k]=eleman; k++; prev=eleman.
//    - return k.
//
//  Takılırsan "şu satırı aç" de, beraber adım adım açarız.
