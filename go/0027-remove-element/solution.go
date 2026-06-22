// package removeelement — bu dosyanın ait olduğu paket.
// "main" değil, kütüphane → yan dosyadaki solution_test.go bunu import edip
// removeElement fonksiyonunu doğrudan çağırabiliyor.
package removeelement

// ════════════════════════════════════════════════════════════════════
//  #27 Remove Element — #26'dan FARKI nedir? (önce bunu sindir)
// ════════════════════════════════════════════════════════════════════
//
// #26 (Remove Duplicates):   dizi SIRALI,  SIRA korunmalı  -> tek çare slow/fast "koru" imleci.
// #27 (Remove Element):      dizi sırasız, SIRA ÖNEMSİZ    -> yeni bir numara açılır.
//
// LeetCode ne istiyor:
//   nums içindeki TÜM `val` eşitliklerini YERİNDE sil.
//   Dönüş k = val'a EŞİT OLMAYAN eleman sayısı.
//   nums[:k] o elemanları tutsun — HANGİ SIRADA olduğu UMURUNDA DEĞİL.
//   k'dan sonrası çöp, kontrol edilmez.
//
// "Sıra önemsiz" cümlesi bedava bir süper güç verir: bir elemanı silmek için
// onu öteleyip herkesi sola kaydırmak zorunda DEĞİLİZ. Sondaki elemanı
// silinen yere YAPIŞTIRIP diziyi bir kısaltmak yeter. Çok daha az yazma.

// ════════════════════════════════════════════════════════════════════
//  SWAP-FROM-END (sondan-çek) — bu çözümün fikri
// ════════════════════════════════════════════════════════════════════
//
// İki imleç ama bu kez KARŞIDAN KARŞIYA:
//
//   i -> soldan tarayan okuma kafası.
//   n -> canlı bölgenin DIŞ sınırı (uzunluk). Canlı bölge = nums[0:n].
//        n'den itibaren (dahil) sağ taraf "atılmış" sayılır.
//
//   [ 0, 1, 2, 2, 3, 0, 4, 2 ]   val = 2
//     i->                    <-(n-1 = donör)
//
// Döngü mantığı (n daraldıkça i ona yetişene dek):
//   nums[i] == val  ise -> SİL: nums[i] = nums[n-1] (sondakini buraya çek), n--.
//                          i'yi İLERLETME! (aşağıdaki tuzağa bak)
//   nums[i] != val  ise -> sakla, i++ (sıradakine geç).
//
// ┌─ KLASİK TUZAK ───────────────────────────────────────────────────┐
// │ Sildikten sonra i++ YAPMA. Çünkü sondan çektiğin eleman da `val`  │
// │ olabilir; onu HENÜZ kontrol etmedin. Aynı i'de tekrar bak.        │
// │ (Bu repodaki test girdisi tam bu durumu tetikler: i=2'ye sondan   │
// │  yine bir 2 gelir, i durmasaydı o 2 dizide kalırdı = hata.)       │
// └───────────────────────────────────────────────────────────────────┘
//
// Karmaşıklık: zaman O(n) (her eleman en çok bir kez bakılır), bellek O(1).
// #26'nın koru-imlecine göre AVANTAJ: silinecek eleman çoksa çok daha az
// "yazma" işlemi yaparsın (her sola kaydırma yok, sadece bir takas).

// ════════════════════════════════════════════════════════════════════
//  ÇÖZÜLECEK FONKSİYON  (çekirdek döngüyü SEN yazacaksın)
// ════════════════════════════════════════════════════════════════════

// removeElement nums içindeki tüm val'ları YERİNDE siler.
//
// Parametreler:
//
//	nums []int -> dizi (sırasız olabilir, boş olabilir). Yerinde değişecek.
//	val  int   -> silinecek değer.
//
// Dönüş:
//
//	int -> kalan (val'a eşit olmayan) eleman sayısı k.
//	       nums[:k] o elemanları tutar (SIRA ÖNEMSİZ).
func removeElement(nums []int, val int) int {
	// Kenar durum guard'ı: boş dizi ya da nil. Silinecek/sayılacak bir şey yok.
	// NOT: Bu satır aslında GEREKSİZ — aşağıda i,n := 0,len(nums) ile boş dizide
	// i < n koşulu (0 < 0) baştan yanlış olur, döngü hiç dönmez, return n = 0 olur.
	// Yine de niyeti okuyana açıkça göstersin diye bırakıyoruz; zararı yok.
	if len(nums) == 0 {
		return 0
	}

	// İki imleci kur (bu kez karşıdan karşıya, #26'daki slow/fast gibi yan yana değil):
	//   i = soldan tarayan okuma kafası, 0'dan başlar.
	//   n = canlı bölgenin DIŞ sınırı (uzunluk). Canlı bölge = nums[0:n].
	//       Başta tüm dizi canlı, o yüzden n = len(nums). n küçüldükçe sağdan eleman "atılır".
	i, n := 0, len(nums)

	// Döngü, i sınıra (n) yetişene kadar sürer. i ile n birbirine doğru kapanır:
	// i ya sağa gider (sakla) ya da n sola gelir (sil) — er geç buluşurlar, sonsuz döngü yok.
	for i < n {
		// nums[i] silinecek değer mi?
		if nums[i] == val {
			// EVET → sil. Ama sola kaydırmaya gerek yok (sıra önemsiz):
			// canlı bölgenin SON elemanını (nums[n-1]) bu çöp slota YAPIŞTIR.
			// Bu, çağıranın dizisini YERİNDE değiştirir (slice = arkadaki diziye pencere).
			nums[i] = nums[n-1]
			// Sınırı bir daralt: az önce kopyaladığımız nums[n-1] artık "atılmış" sayılır.
			n--
			// DİKKAT: i'yi BİLEREK ilerletmiyoruz! Sondan çektiğimiz değer (yeni nums[i])
			// de val olabilir; onu henüz görmedik. Sonraki turda AYNI i tekrar kontrol edilir.
		} else {
			// HAYIR → bu eleman kalıcı (val değil). Saklamak için bir şey yazmaya gerek yok,
			// zaten yerinde duruyor. Sadece okuma kafasını ilerlet. n sabit kalır.
			i++
		}
	}

	// Döngü bitti: i ile n buluştu. n artık canlı (val'sız) eleman sayısı = cevap k.
	// nums[:n] o elemanları tutar (sıra değişmiş olabilir; LeetCode umursamaz).
	return n
}

// ════════════════════════════════════════════════════════════════════
//  STRATEJİ İPUÇLARI (kodu sen yazıyorsun, ben yön gösteriyorum)
// ════════════════════════════════════════════════════════════════════
//
//  YAKLAŞIM A — swap-from-end  [seçtiğin · sıra önemsizde en az yazma]
//    i, n := 0, len(nums)
//    for i < n:
//        nums[i]==val -> nums[i]=nums[n-1]; n--   (i SABİT kalır!)
//        else         -> i++
//    return n
//
//  YAKLAŞIM B — keep-pointer (slow/fast)  [#26'nın kuzeni · sırayı korur]
//    k := 0
//    for _, x := range nums:
//        x != val -> nums[k]=x; k++
//    return k
//    (Sıra önemsizken bile çalışır; sadece daha çok yazma yapabilir.)
//
//  Takılırsan "TUZAK satırını aç" ya da "i neden durmalı" de, beraber açarız.
