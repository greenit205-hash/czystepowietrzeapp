# Smart Energy — Kalkulator Czyste Powietrze — wdrożenie

Pliki w repozytorium:
- `index.html` — aplikacja (jeden plik)
- `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png` — obsługa PWA (instalacja na telefonie/tablecie jak aplikacja)
- `Code.gs` — backend Google Apps Script (magazyn danych: cennik + zapisane kalkulacje klientów)
- `.gitignore`

`Code.gs` nie jest potrzebny do samego hostingu (to osobny kod wklejany do Google Apps Script) — zostaje w repo jako kopia/dokumentacja.

## 1. GitHub

```bash
cd smart-energy-czyste-powietrze
git init
git add .
git commit -m "Kalkulator Czyste Powietrze — wersja startowa"
git branch -M main
git remote add origin https://github.com/<twoj-uzytkownik>/<nazwa-repo>.git
git push -u origin main
```

(Możesz też po prostu utworzyć puste repozytorium na github.com i przeciągnąć pliki przez „Add file → Upload files” w przeglądarce — bez terminala).

## 2. GitHub Pages — hosting

1. W repozytorium na GitHubie: **Settings → Pages**.
2. Sekcja „Build and deployment” → **Source: Deploy from a branch**.
3. **Branch: main**, folder: **/ (root)** → **Save**.
4. Po ok. 1 minucie strona będzie dostępna pod adresem:
   `https://<twoj-uzytkownik>.github.io/<nazwa-repo>/`
5. Każdy kolejny `git push` do `main` automatycznie aktualizuje stronę (deploy trwa zwykle do minuty).

Ponieważ wszystkie ścieżki w `index.html` / `manifest.json` / `sw.js` są względne, strona działa poprawnie także pod podadresem (`/<nazwa-repo>/`), nie tylko pod domeną główną — nic nie trzeba w nich zmieniać.

## 3. Backend — Google Apps Script (Google Sheets)

1. Utwórz nowy, pusty arkusz Google Sheets — np. „SE Czyste Powietrze — dane”.
2. **Rozszerzenia → Apps Script**.
3. Usuń domyślną zawartość `Code.gs`, wklej całą zawartość pliku `Code.gs` z repozytorium. Zapisz (Ctrl+S).
4. **Wdróż → Nowe wdrożenie**:
   - Typ: **Aplikacja internetowa**
   - Wykonaj jako: **Ja**
   - Dostęp: **Każdy** (to konieczne, żeby aplikacja hostowana na GitHub Pages mogła się łączyć)
5. Zatwierdź uprawnienia (Google poprosi o zgodę przy pierwszym wdrożeniu).
6. Skopiuj **adres URL Web App** (kończy się na `/exec`) — to Twój adres synchronizacji.

Jeśli w przyszłości zmienisz `Code.gs`, pamiętaj: **Zarządzaj wdrożeniami → Edytuj → Nowa wersja**, inaczej zmiany się nie pojawią.

## 4. Połączenie apki z arkuszem

1. Otwórz stronę pod adresem z kroku 2 (`https://<twoj-uzytkownik>.github.io/<nazwa-repo>/`).
2. Kliknij **⚙ Cennik**.
3. W sekcji „Synchronizacja z Google Sheets” wklej adres Web App (`.../exec`) z kroku 3.
4. Kliknij **Gotowe** — od teraz cennik i zapisane kalkulacje klientów są automatycznie wysyłane do arkusza.
5. Na kolejnym urządzeniu (telefon, tablet) wejdź na ten sam adres GitHub Pages, wklej ten sam URL synchronizacji i kliknij **Synchronizuj teraz** — pobierze dane z arkusza.

## 5. Instalacja jak aplikacja na telefonie/tablecie

- Android/Chrome: menu (⋮) → **Dodaj do ekranu głównego**.
- iPhone/Safari: przycisk „Udostępnij” → **Dodaj do ekranu początkowego**.

Aplikacja działa też offline (dzięki `sw.js`) — dane wpisane bez internetu zapisują się lokalnie i wyślą się do arkusza, gdy połączenie wróci (przy kolejnym zapisie/synchronizacji).

## 6. Raport PDF

W apce, w kroku „Raport dla klienta”:
- wybierz markę (Smart Energy / DomStyl) — zmienia kolorystykę i logo raportu,
- zaznacz, jakie informacje mają się znaleźć w PDF (cena/m², nadwyżki ponad limit, komentarze do przegród),
- kliknij **Generuj raport / Zapisz jako PDF** — otworzy się okno drukowania przeglądarki, z którego wybierasz „Zapisz jako PDF”.
