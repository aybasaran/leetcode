// package merge — bu dosyanın ait olduğu "paket" (package).
// Go'da HER .go dosyası ilk satırda bir pakete aittir.
// Aynı klasördeki tüm dosyalar aynı pakette olmalı (burada: solution.go + solution_test.go).
// "main" yazsaydık çalıştırılabilir program olurdu; "merge" yazınca bir KÜTÜPHANE oldu
// ve testten doğrudan import edip fonksiyonları çağırabiliyoruz.
package merge

// ════════════════════════════════════════════════════════════════════
//  STRUCT (yapı) — birden çok alanı tek bir tipte gruplayan veri kabı.
//  Java/JS'teki "class" değil; sadece veri tutar, kalıtım yoktur.
// ════════════════════════════════════════════════════════════════════

// ListNode = bağlı listenin TEK bir düğümü.
//
// İki alanı var:
//
//	Val  int        -> düğümün taşıdığı sayı.
//	Next *ListNode  -> SONRAKİ düğümün ADRESİ (pointer). Liste sonunda nil olur.
//
// Dikkat: alan adları BÜYÜK harfle başlıyor (Val, Next). Go'da büyük harf =
// "exported" yani paket dışından erişilebilir (public gibi). LeetCode bu isimleri
// böyle veriyor, biz de aynen kullanıyoruz.
//
// "*ListNode" niye? Çünkü bir struct kendi içinde KENDİSİNİ değer olarak tutamaz
// (sonsuz boyut olurdu). Onun yerine bir sonrakinin ADRESİNİ (pointer) tutar.
// İşte bu yüzden bağlı liste = "adres zinciri".
type ListNode struct {
	Val  int
	Next *ListNode
}

// ════════════════════════════════════════════════════════════════════
//  POINTER (işaretçi) hızlı ders — linked list'i anlamanın anahtarı
// ════════════════════════════════════════════════════════════════════
//
//   *ListNode  -> "bir ListNode'un adresi" tipinde değişken.
//   &node      -> node'un adresini AL (pointer üret).
//   node.Val   -> Go pointer'ı OTOMATİK çözer; (*node).Val yazmana gerek yok.
//   nil        -> "hiçbir yeri göstermiyor". Boş liste / liste sonu demek.
//
// Örnek zincir (1 -> 2 -> nil):
//   a := &ListNode{Val: 1}
//   b := &ListNode{Val: 2}
//   a.Next = b      // a artık b'yi gösteriyor
//   b.Next = nil    // b son düğüm (zaten varsayılan nil)

// ════════════════════════════════════════════════════════════════════
//  ÇÖZÜLECEK FONKSİYON
// ════════════════════════════════════════════════════════════════════

// mergeTwoLists iki SIRALI listeyi tek SIRALI listeye birleştirir.
//
// Parametreler:
//
//	list1 *ListNode -> 1. listenin baş düğümü (boşsa nil)
//	list2 *ListNode -> 2. listenin baş düğümü (boşsa nil)
//
// Dönüş:
//
//	*ListNode       -> birleşmiş listenin baş düğümü
//
// ┌──────────────────────────────────────────────────────────────────┐
// │ TODO(sen): burayı yaz. Şu an "return nil" => testler KIRMIZI.       │
// │ İpucu için aşağıdaki yorum bloğuna bak ama ÖNCE kendin dene.        │
// └──────────────────────────────────────────────────────────────────┘
func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
	// Kukla baş düğüm: değeri önemsiz, sadece zincirin başını tutan sahte kanca.
	// Sayesinde "ilk düğüm boş mu?" kontrolü hiç gerekmez; dummy.Next hep gerçek başı tutar.
	dummy := &ListNode{}

	// cur = "zincirin şu anki sonu". Başta dummy'i gösterir, her eklemede ileri kayar.
	// dummy'i kaybetmemek için ayrı bir gezici pointer kullanıyoruz.
	cur := dummy

	// İKİSİ de doluyken dön: küçük olanı her turda kuyruğa çekeceğiz.
	// Biri biter bitmez döngüden çıkarız (alttaki if kalanı toplu takar).
	for list1 != nil && list2 != nil {

		// Hangi listenin baş değeri küçükse o düğümü seç.
		// "<=" eşitlikte list1'i seçer -> kararlı (stable) sıralama, gereksiz değil ama hoş.
		if list1.Val <= list2.Val {
			// list1'in baş düğümünü kuyruğa bağla (kopya yok, sadece adres bağlama).
			cur.Next = list1
			// list1'i bir ileri kaydır: tükettiğimiz düğümü artık geride bıraktık.
			list1 = list1.Next
		} else {
			// Simetrik durum: list2 küçük (veya eşitlikte seçilmedi), onu tak.
			cur.Next = list2
			// list2'yi bir ileri kaydır.
			list2 = list2.Next
		}

		// İmleci yeni eklenen düğüme kaydır ki bir sonraki ekleme onun ardına gelsin.
		cur = cur.Next
	}

	// Döngü bitti: en fazla biri hâlâ dolu. O liste zaten sıralı, tek tek gezmeye gerek yok.
	if list1 != nil {
		// list1 arttı -> kalan tüm kuyruğu olduğu gibi tek hamlede tak.
		cur.Next = list1
	} else {
		// Aksi halde list2 (dolu ya da nil); nil olsa bile zarar yok, zincir biter.
		cur.Next = list2
	}

	// dummy.Next = kukla başın bir sonrası = birleşmiş listenin GERÇEK başı.
	return dummy.Next
}

// ════════════════════════════════════════════════════════════════════
//  STRATEJİ İPUÇLARI (kodu sen yazacaksın, ben sadece yol gösteriyorum)
// ════════════════════════════════════════════════════════════════════
//
//  YAKLAŞIM A — "dummy head" (kukla baş) + döngü  [en yaygın]
//    1) Kukla bir başlangıç düğümü yarat: dummy := &ListNode{}
//       (değeri önemsiz; sadece zincirin başını tutması için sahte bir kanca)
//    2) cur := dummy  -> "şu an zincirin sonundayım" göstergesi
//    3) list1 ve list2 İKİSİ de nil olmayana kadar dön:
//         - hangisinin Val'i küçükse onu cur.Next'e bağla
//         - o listede bir ileri git, cur'u da ilerlet
//    4) Döngü bitince biri hâlâ doluysa onu olduğu gibi cur.Next'e ekle
//       (zaten sıralı, tek tek gezmeye gerek yok)
//    5) return dummy.Next  -> kukla başın bir sonrası = gerçek baş
//    Karmaşıklık: zaman O(n+m), ek bellek O(1).
//
//  YAKLAŞIM B — recursion (özyineleme)  [zarif, kısa]
//    - list1 nil ise -> list2 döndür; list2 nil ise -> list1 döndür
//    - küçük olan düğümün Next'ini, "kalanların birleşimi" olarak ayarla
//    - o düğümü döndür
//    Karmaşıklık: zaman O(n+m), ek bellek O(n+m) (çağrı yığını).
//
//  Hangisini istersen onu yaz. Takılırsan söyle, o satırı beraber açarız.
