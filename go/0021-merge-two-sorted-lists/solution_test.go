package merge

// import = başka paketleri içeri al. Parantezli blok birden fazla import için.
import (
	"reflect" // DeepEqual: iki değeri (slice dahil) derinlemesine karşılaştırır
	"testing" // Go'nun yerleşik test paketi; *testing.T buradan gelir
)

// ════════════════════════════════════════════════════════════════════
//
//	YARDIMCI 1: build — sayılardan linked list kur
//
// ════════════════════════════════════════════════════════════════════
//
// "vals ...int" -> VARIADIC parametre. Yani build(1,2,4) de build() de geçerli.
// İçeride "vals" aslında bir []int (int slice) gibi davranır.
//
// build(1,2,4) => 1 -> 2 -> 4 -> nil
// build()      => nil  (boş liste)
func build(vals ...int) *ListNode {
	// dummy = kukla baş. Niye? Zincirin ilk düğümünü ayrıca özel ele almamak için.
	// & ile adresini alıp pointer yapıyoruz. {} = tüm alanlar varsayılan (Val=0, Next=nil).
	dummy := &ListNode{}
	cur := dummy // cur = "şu an zincirin kuyruğundayım" imleci

	// range: slice üzerinde gez. "_, v" => indeksi YOKSAY (_), değeri al (v).
	for _, v := range vals {
		cur.Next = &ListNode{Val: v} // yeni düğüm yarat, kuyruğa bağla
		cur = cur.Next               // imleci yeni kuyruğa kaydır
	}
	return dummy.Next // kukla başın bir sonrası = gerçek baş (liste boşsa nil)
}

// ════════════════════════════════════════════════════════════════════
//
//	YARDIMCI 2: toSlice — linked list'i []int'e çevir (karşılaştırma kolay olsun)
//
// ════════════════════════════════════════════════════════════════════
func toSlice(head *ListNode) []int {
	out := []int{} // boş slice (nil değil) — boş liste testinde [] beklediğimiz için önemli

	// Klasik linked list gezme döngüsü:
	//   başlat: n = head
	//   koşul:  n nil değilken devam
	//   adım:   n = n.Next (bir sonrakine atla)
	for n := head; n != nil; n = n.Next {
		out = append(out, n.Val) // append = slice'a eleman ekle, yeni slice döndür
	}
	return out
}

// ════════════════════════════════════════════════════════════════════
//
//	TEST — "table-driven test" (Go'da çok sevilen kalıp)
//
// ════════════════════════════════════════════════════════════════════
//
// Fonksiyon adı "Test" ile başlamalı + tek parametre *testing.T olmalı.
// "go test" bu kurala uyan fonksiyonları kendi bulur ve koşturur.
func TestMergeTwoLists(t *testing.T) {
	// Tüm senaryoları tek bir slice içinde tablo gibi tutuyoruz.
	// "[]struct{...}{...}" = isimsiz struct tipinden slice; her satır bir test vakası.
	cases := []struct {
		name  string    // alt-testin adı (çıktıda görünür)
		list1 *ListNode // 1. girdi
		list2 *ListNode // 2. girdi
		want  []int     // beklenen sonuç
	}{
		{"ornek1", build(1, 2, 4), build(1, 3, 4), []int{1, 1, 2, 3, 4, 4}},
		{"ikisi_de_bos", build(), build(), []int{}},
		{"biri_bos", build(), build(0), []int{0}},
		{"list1_uzun", build(1, 2, 3, 4, 5), build(6), []int{1, 2, 3, 4, 5, 6}},
		{"araya_giren", build(2, 5, 9), build(1, 6, 7), []int{1, 2, 5, 6, 7, 9}},
	}

	// Her vakayı tek tek koş. t.Run = alt-test (subtest) aç; hangisi patladı net görürsün.
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			got := toSlice(mergeTwoLists(tc.list1, tc.list2))
			// DeepEqual: iki slice'ı eleman eleman karşılaştır (== slice'larda çalışmaz).
			if !reflect.DeepEqual(got, tc.want) {
				// t.Errorf: testi başarısız işaretle ama koşmaya devam et (Fatalf olsaydı dururdu).
				t.Errorf("got %v, want %v", got, tc.want)
			}
		})
	}
}
