# LeetCode — Görsel Anlatım + Go Çözümleri

## Kimin için?

Bu depo, **LeetCode sorularını Go ile çözmek isteyen _ve aynı zamanda_ Go'yu derinlemesine öğrenmek isteyen** biri için tasarlandı. Go dosyaları kısa, yarışma tarzı çözümler değil; pointer, struct, paket, `nil`, slice vs. bağlı liste gibi dil temellerini satır satır anlatan öğretim materyalleridir. Yani çözdüğün her soru aynı zamanda bir Go dersidir.

---

Kişisel bir LeetCode çalışma deposu. Her soruyu **iki** yerde birden çözüyorum:

| Alt proje | Ne işe yarar |
| --- | --- |
| [`ui/`](ui/) | Sorunun **adım adım, görsel** anlatımı — Vue 3 tek sayfa uygulaması (her soru için bir route). |
| [`go/`](go/) | Aynı sorunun **Go çözümü + tablo tabanlı testleri**. Doğruluk burada kanıtlanır. |

İki taraf yalnızca bir **isimlendirme kuralı** ile bağlıdır: her soru, iki ağaçta da sıfır dolgulu `NNNN-slug` klasöründe yaşar.

```text
ui/src/problems/0021-merge-two-sorted-lists/
go/0021-merge-two-sorted-lists/
```

> Tüm yorumlar ve kullanıcıya görünen metinler **Türkçe** ve bilinçli olarak öğretici bir dille yazılır. Go çözüm dosyaları birer öğretim materyalidir.

---

## Çözülen sorular

| # | Soru | Zorluk | Etiketler | Görsel | Çözüm |
| --- | --- | --- | --- | --- | --- |
| 21 | Merge Two Sorted Lists | Easy | Linked List, Recursion | [ui](ui/src/problems/0021-merge-two-sorted-lists/) | [go](go/0021-merge-two-sorted-lists/) |

---

## `ui/` — görsel anlatım uygulaması

Vue 3 + Vite. Her soru kendi lazy-load route bileşeni; `src/problems/registry.ts` tek doğru kaynaktır.

### Gereksinimler

- Node 24 (`.nvmrc`)
- pnpm 11.8 (`packageManager` ile sabitli)

### Komutlar (`ui/` içinden)

```bash
pnpm install
pnpm dev          # HMR'li Vite geliştirme sunucusu
pnpm build        # type-check (vue-tsc) + build, paralel
pnpm type-check   # sadece vue-tsc --build
pnpm lint         # oxlint --fix sonra eslint --fix (ikisi de geçmeli)
pnpm format       # src/ üzerinde Prettier
```

JS test koşucusu **yok** (Vitest yok) — doğruluk `go/` tarafında yaşar.

### Mimari özeti

- **`src/problems/registry.ts`** — tek doğru kaynak. Yeni soru eklemek = `problems[]` dizisine bir `ProblemMeta` nesnesi eklemek. Router ve ana sayfa listelerini buradan `.map()` ile türetir.
- **`src/problems/types.ts`** — veri modeli. Bir `Step`, tek bir kare için tüm sahnenin değişmez (immutable) anlık görüntüsüdür: `lanes` (bağlı liste satırları), vurgulanan `codeLines`, ve `message`.
- **`<problem>/steps.ts`** — saf `buildSteps(): Step[]`. Algoritmayı çalıştırıp her ana için bir snapshot kaydeder; oynatıcı sadece diziye indeksler, yani ileri/geri sarma deterministiktir. Bir soru birden çok mod sunabilir (ör. iteratif `steps.ts` + özyinelemeli `recursionSteps.ts`).
- **`composables/useStepPlayer.ts`** — indeks / oynat / klavye (←/→) gezintisini yönetir.
- **`composables/useShikiTokens.ts`** — kod panelini gerçek Go grameriyle (Shiki) renklendirir.
- **`components/viz/VisualizerLayout.vue`** — her sorunun doldurduğu ortak kabuk.

---

## `go/` — soru başına bir paket

Go 1.26. `main.go` bir yer tutucudur. Her çözüm klasörü, soruya göre adlandırılmış **kendi paketidir** (ör. `package merge`), böylece yanındaki `solution_test.go` fonksiyonları doğrudan import edip çağırabilir. Testler tablo tabanlıdır (`t.Run` alt testleri + `reflect.DeepEqual`).

### Komutlar (`go/` içinden)

```bash
go test ./...                                                        # tüm soruların testleri
go test ./0021-merge-two-sorted-lists/ -run TestMergeTwoLists -v     # tek soru, ayrıntılı
go run .                                                             # yer tutucu main.go
```

---

## Yeni soru ekleme

1. Her iki ağaçta da `NNNN-slug` klasörünü oluştur.
2. **Go:** soruya özel paket adıyla `solution.go` + tablo tabanlı `solution_test.go` yaz.
3. **UI:** `steps.ts` (`buildSteps` + ham kaynak), `useStepPlayer`'ı `VisualizerLayout`'a bağlayan bir `*View.vue` yaz.
4. **UI:** `src/problems/registry.ts` içindeki `problems[]` dizisine bir satır ekle. Gerisi otomatik.

---

## Bağımlılık hijyeni (`ui/`)

`ui/pnpm-workspace.yaml` tedarik zinciri sertleştirmesini zorlar:

- **`saveExact: true`** — sürümler tam yazılır; `^`/`~` aralık yok.
- **`minimumReleaseAge: 4320`** (3 gün) — son 3 günde yayınlanan sürümler kurulmaz.
- **`strictDepBuilds: true` + `allowBuilds`** — yaşam döngüsü / postinstall script'leri yalnızca açıkça izin verilirse çalışır.
