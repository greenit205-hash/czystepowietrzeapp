# Smart Energy — Kalkulator Czyste Powietrze

Aplikacja do liczenia dofinansowania z programu „Czyste Powietrze" i generowania umowy z wykonawcą.

- liczy dofinansowanie w trzech wariantach (40% / 70% / 100%) z limitami jednostkowymi i limitem puli termomodernizacji,
- podpowiada poziom dofinansowania na podstawie dochodu i typu gospodarstwa,
- generuje raport PDF dla klienta w trzech wariantach marki (Smart Energy / DomStyl / kalkulacja audytora),
- generuje gotową umowę `.docx` dla trzech wykonawców (DomStyl, Janusz Czapla, TRIM-BUD),
- synchronizuje kalkulacje między urządzeniami przez Dysk Google,
- działa offline i instaluje się jak aplikacja (PWA).

## Pliki

| Plik | Do czego |
|---|---|
| `index.html` | cała aplikacja (jeden plik, z wbudowanymi szablonami umów) |
| `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png` | obsługa PWA — instalacja na telefonie/tablecie, praca offline |
| `Kod.gs` | skrypt Google Apps Script do synchronizacji z Dyskiem Google |
| `INSTRUKCJA-SYNCHRONIZACJA.md` | jak wdrożyć skrypt i włączyć synchronizację |

## Hosting (GitHub Pages)

**Settings → Pages → Source: Deploy from a branch → Branch: `main`, folder `/ (root)`.**
Strona działa pod `https://greenit205-hash.github.io/czystepowietrzeapp/` i odświeża się po każdym pushu do `main` (zwykle do minuty).

Wszystkie ścieżki w plikach są względne, więc aplikacja działa poprawnie także pod podadresem repozytorium.

## Synchronizacja między urządzeniami

Kalkulacje, cennik i numeracja umów zapisują się w folderze **„Czyste Powietrze"** na Twoim Dysku Google — pełna instrukcja w [INSTRUKCJA-SYNCHRONIZACJA.md](INSTRUKCJA-SYNCHRONIZACJA.md).

## Instalacja na telefonie/tablecie

- Android/Chrome: menu (⋮) → **Dodaj do ekranu głównego**
- iPhone/Safari: **Udostępnij** → **Dodaj do ekranu początkowego**

Po aktualizacji aplikacji na GitHubie zamknij ją całkowicie na urządzeniu i otwórz ponownie z internetem — pobierze nową wersję.

## Raport PDF

W kroku „Raport dla klienta": wybierz markę, zaznacz, co ma być widoczne (m², cena/m², nadwyżki ponad limit, komentarze do przegród) i kliknij **Generuj raport**. Otworzy się okno drukowania — w polu „Miejsce docelowe" wybierz **Zapisz jako PDF**.

## Umowa

W kroku „Umowa z klientem": wybierz wykonawcę, uzupełnij dane i kliknij **Generuj umowę (.docx)**. Dokument powstaje w całości w przeglądarce, bez zewnętrznych bibliotek — działa też offline.

Szablony umów są zgodne ze wzorem WFOŚiGW obowiązującym od 20.07.2026 r. (wersja z logo „Dofinansowane przez Unię Europejską — System handlu emisjami / Fundusz Modernizacyjny").
