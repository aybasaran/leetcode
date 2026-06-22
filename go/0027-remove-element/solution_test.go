package removeelement

// import = başka paketleri içeri al.
import (
	"reflect" // DeepEqual: iki slice'ı eleman eleman karşılaştırır (== slice'larda çalışmaz)
	"sort"    // sort.Ints: bir slice'ı yerinde sıralar — SIRA ÖNEMSİZ karşılaştırmanın anahtarı
	"testing" // Go'nun yerleşik test paketi; *testing.T buradan gelir
)

// ════════════════════════════════════════════════════════════════════
//
//	TEST — #26'dan EN BÜYÜK fark: SIRA ÖNEMSİZ
//
// ════════════════════════════════════════════════════════════════════
//
// #26'da nums[:k]'yı beklenenle DOĞRUDAN (sırayla) karşılaştırmıştık.
// Burada YAPAMAYIZ: swap-from-end elemanların sırasını bozar. Örn. girdi
// [0,1,2,2,3,0,4,2] val=2 için nums[:5] = [0,1,4,0,3] çıkar — {0,0,1,3,4}
// kümesi doğru ama sıra "beklenen"den farklı. DeepEqual'i ham haliyle
// kullansak yanlışlıkla FAIL verirdi.
//
// Çözüm: ikisini de ÇOKLU-KÜME (multiset) gibi karşılaştır → kopyalarını
// sırala, sonra DeepEqual. Böylece "aynı elemanlar, aynı adette" mi diye
// bakarız; diziliş umurumuzda değil.
//
// removeElement diziyi YERİNDE değiştirir; tablo literalleri her satırda
// ayrı dizi olduğu için vakalar birbirini bozmaz.
func TestRemoveElement(t *testing.T) {
	cases := []struct {
		name string
		nums []int // girdi (yerinde değişecek)
		val  int   // silinecek değer
		want []int // nums[:k] bu elemanları tutmalı — SIRA ÖNEMSİZ
	}{
		{"ornek1", []int{3, 2, 2, 3}, 3, []int{2, 2}},
		{"ornek2", []int{0, 1, 2, 2, 3, 0, 4, 2}, 2, []int{0, 0, 1, 3, 4}},
		{"bos", []int{}, 0, []int{}},
		{"hic_eslesme_yok", []int{1, 2, 3}, 9, []int{1, 2, 3}},
		{"hepsi_eslesir", []int{4, 4, 4}, 4, []int{}},
		{"tek_eleman_eslesir", []int{1}, 1, []int{}},
		{"tek_eleman_kalir", []int{1}, 2, []int{1}},
		{"sondaki_de_val", []int{2, 2, 2, 1}, 2, []int{1}}, // sondan çekilen de val: i durmazsa hata
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			k := removeElement(tc.nums, tc.val)

			// 1) k beklenen uzunluğa (kalan eleman adedi) eşit mi?
			if k != len(tc.want) {
				t.Errorf("k = %d, want %d", k, len(tc.want))
			}

			// 2) nums[:k] doğru elemanları mı tutuyor? (k yanlışsa panik olmasın diye kıs)
			if k < 0 || k > len(tc.nums) {
				return
			}

			// SIRA ÖNEMSİZ karşılaştırma: ikisinin de kopyasını al, sırala, sonra DeepEqual.
			// (Kopya alıyoruz ki tc.nums / tc.want'ın gerçek sırasını bozmayalım.)
			got := append([]int(nil), tc.nums[:k]...)
			want := append([]int(nil), tc.want...)
			sort.Ints(got)
			sort.Ints(want)
			if !reflect.DeepEqual(got, want) {
				t.Errorf("nums[:k] (sıralı) = %v, want (sıralı) %v", got, want)
			}
		})
	}
}
