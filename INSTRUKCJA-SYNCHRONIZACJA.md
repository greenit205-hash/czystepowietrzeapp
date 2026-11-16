# Synchronizacja kalkulacji między urządzeniami

Dzięki niej kalkulacja zrobiona na komputerze jest widoczna na tablecie i telefonie, i odwrotnie.
Dane trzymasz u siebie — w folderze **„Czyste Powietrze"** na Twoim Dysku Google. Nic nie trafia do osób trzecich.

Synchronizują się:
- zapisane kalkulacje klientów (razem z danymi do umowy),
- cennik i limity (⚙ Cennik),
- numeracja umów — dzięki temu numery nie powtórzą się między urządzeniami.

Bez internetu aplikacja działa normalnie, a zmiany wyśle przy następnym połączeniu.

---

## 1. Wdrożenie skryptu (robisz raz)

1. Wejdź na [script.google.com](https://script.google.com) → **Nowy projekt**.
2. Usuń to, co jest w edytorze, i wklej całą zawartość pliku **`Kod.gs`** z tego repozytorium.
3. W pierwszej linii zamień `WPISZ-SWOJE-HASLO` na własne hasło, np.:
   ```js
   const HASLO = 'moje-tajne-haslo-123';
   ```
   To hasło wpiszesz potem w aplikacji na każdym urządzeniu. Chroni Twój Dysk przed obcymi — wybierz coś, czego nikt nie zgadnie.
4. Nadaj projektowi nazwę (np. „Czyste Powietrze — synchronizacja") i zapisz (Ctrl+S).
5. Kliknij **Wdróż → Nowe wdrożenie**:
   - Typ: **Aplikacja internetowa**
   - Wykonaj jako: **Ja**
   - Kto ma dostęp: **Każdy**
6. Zatwierdź uprawnienia. Google pokaże ostrzeżenie „Ta aplikacja nie została zweryfikowana" — to normalne przy własnych skryptach: kliknij **Zaawansowane → Przejdź do…**.
7. Skopiuj **adres aplikacji internetowej** — kończy się na `/exec`.

> **Dostęp „Każdy" nie oznacza, że ktokolwiek zobaczy Twoje dane.** Skrypt odrzuca każde żądanie bez prawidłowego hasła. To ustawienie jest potrzebne tylko po to, żeby przeglądarka mogła się w ogóle połączyć.

## 2. Włączenie w aplikacji (na każdym urządzeniu)

1. Otwórz aplikację → **⚙ Cennik**.
2. W sekcji „Synchronizacja (Dysk Google)" wklej adres z kroku 1.7 i wpisz hasło z kroku 1.3.
3. Kliknij **Połącz i synchronizuj**.
4. W nagłówku pojawi się plakietka **„Dysk: zsynchronizowano HH:MM"**.

Powtórz to na telefonie, tablecie i komputerze — ten sam adres i to samo hasło.

## 3. Jak to działa na co dzień

- Po zapisaniu kalkulacji leci ona na Dysk automatycznie.
- Przy otwarciu listy „Zapisane kalkulacje" aplikacja dociąga zmiany z innych urządzeń.
- Przy powrocie do karty z aplikacją (po ok. 30 s przerwy) też się odświeża.
- Kliknięcie plakietki **Dysk:** wymusza synchronizację od razu.
- Gdy ta sama kalkulacja była zmieniana na dwóch urządzeniach, wygrywa **nowsza wersja**.
- Usunięta kalkulacja znika na wszystkich urządzeniach, ale na Dysku **trafia do kosza** — przez 30 dni można ją odzyskać.

## 4. Zmiana hasła lub kodu skryptu

Po każdej zmianie w `Kod.gs`: **Wdróż → Zarządzaj wdrożeniami → ołówek (Edytuj) → Wersja: Nowa wersja → Wdróż**.
Adres `/exec` zostaje ten sam. Jeśli zmieniłeś hasło, wpisz nowe w aplikacji na każdym urządzeniu.

## 5. Gdy coś nie działa

| Komunikat | Co zrobić |
|---|---|
| „Wklej adres aplikacji internetowej…" | Adres musi zaczynać się od `https://script.google.com/macros/s/` i kończyć na `/exec`. Adres z paska edytora skryptu nie zadziała. |
| „Nieprawidłowe hasło" | Hasło w aplikacji różni się od tego w `Kod.gs`. Pamiętaj o wdrożeniu nowej wersji po zmianie. |
| „Ustaw hasło w skrypcie" | W `Kod.gs` nadal jest `WPISZ-SWOJE-HASLO`. |
| „Skrypt nie odpowiada poprawnie" | Sprawdź, czy dostęp jest ustawiony na **Każdy** i czy wdrożenie jest aktualne. |
| „Dysk: offline" | Brak internetu — dane są bezpieczne lokalnie, wyślą się później. |

**Odłączenie urządzenia** (np. przed oddaniem sprzętu): ⚙ Cennik → **Odłącz to urządzenie**. Kalkulacje zostają na Dysku i na pozostałych urządzeniach.
