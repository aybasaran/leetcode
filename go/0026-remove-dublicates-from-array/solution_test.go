package removedublicatesfromarray

// import = başka paketleri içeri al.
import (
	"reflect" // DeepEqual: iki slice'ı eleman eleman karşılaştırır (== slice'larda çalışmaz)
	"testing" // Go'nun yerleşik test paketi; *testing.T buradan gelir
)

// ════════════════════════════════════════════════════════════════════
//
//	TEST — "table-driven test" (Go'da çok sevilen kalıp)
//
// ════════════════════════════════════════════════════════════════════
//
// Bu sorunun testi iki şeyi birden kontrol eder:
//  1) dönen k (benzersiz adet) doğru mu?
//  2) nums[:k]  beklenen benzersizleri SIRAYLA tutuyor mu?
//
// removeDuplicates diziyi YERİNDE değiştirdiği için her vakaya TAZE bir slice
// veriyoruz (tablo literalleri zaten her satırda ayrı dizi → birbirini bozmaz).
func TestRemoveDuplicates(t *testing.T) {
	cases := []struct {
		name string
		nums []int // girdi (yerinde değişecek)
		want []int // nums[:k] böyle olmalı
	}{
		{"ornek1", []int{1, 1, 2}, []int{1, 2}},
		{"ornek2", []int{0, 0, 1, 1, 1, 2, 2, 3, 3, 4}, []int{0, 1, 2, 3, 4}},
		{"bos", []int{}, []int{}},
		{"tek_eleman", []int{5}, []int{5}},
		{"hepsi_ayni", []int{7, 7, 7, 7}, []int{7}},
		{"hic_tekrar_yok", []int{1, 2, 3}, []int{1, 2, 3}},
		{"negatifler", []int{-3, -3, -1, 0, 0}, []int{-3, -1, 0}},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			k := removeDuplicates(tc.nums)

			// 1) k beklenen uzunluğa eşit mi?
			if k != len(tc.want) {
				t.Errorf("k = %d, want %d", k, len(tc.want))
			}

			// 2) nums[:k] beklenen benzersizleri tutuyor mu?
			//    (k yanlışsa burada panik olmasın diye k'yi güvenli aralığa kıs.)
			if k < 0 || k > len(tc.nums) {
				return
			}
			got := tc.nums[:k]
			if !reflect.DeepEqual(got, tc.want) {
				t.Errorf("nums[:k] = %v, want %v", got, tc.want)
			}
		})
	}
}
