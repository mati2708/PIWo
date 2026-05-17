# ☁️ Laboratorium 4: Baza Danych (Firebase) i Autoryzacja - Wersja MAX (5.0)

W tym laboratorium aplikacja przeszła potężną transformację z lokalnej witryny do pełnoprawnej aplikacji chmurowej (Fullstack) opartej na ekosystemie Google Firebase. **Zrealizowano wszystkie wymagania z instrukcji, włącznie z rozszerzeniami na ocenę 5.0.**

🌐 **Wersja Live (Vercel):** [TUTAJ WKLEJ SWÓJ LINK Z VERCELA, np. https://mityczny-pionek-lab4.vercel.app]

---

## ✨ Zrealizowane Funkcjonalności

### 🔥 Funkcjonalności Podstawowe (na 4.0):
1. **Baza Danych Firestore (NoSQL):**
   * Aplikacja połączona z chmurą Google Firebase. Dane utrzymywane są w kolekcji `games`.
   * **Auto-Seed:** Wbudowany mechanizm automatycznej migracji – jeśli aplikacja wykryje pustą bazę, samodzielnie parsuje uczelniany plik JSON i wypełnia Firestore danymi początkowymi.
2. **System Logowania (Firebase Authentication):**
   * Oparty o globalny hook `AuthContext`.
   * Logowanie tradycyjne (E-mail/Hasło) oraz szybkie logowanie **Google**.
   * Pasek nawigacyjny i UI dynamicznie reagują na obecność użytkownika.
3. **Autoryzacja i Własność (Zarządzanie Ofertami):**
   * System przypisuje Unikalny ID Użytkownika (`uid`) do tworzonych ofert.
   * Blokada ścieżki `/add` dla niezalogowanych.
   * Blokada edycji oraz usunięcia (`deleteDoc`) dla gier, których dany użytkownik nie jest autorem (weryfikacja `uid`).
4. **Moduł Zakupowy:**
   * Obsługa przycisku "Kup Teraz" ustawiającego w bazie flagę `isSold: true`.
   * Interfejs graficzny natychmiastowo wyszarza sprzedaną kartę, nakłada stempel "SPRZEDANE" i blokuje jej interaktywność (`pointer-events`, wyłączone przyciski).
5. 🌐 **Wersja Live (Vercel):** [https://pi-wo.vercel.app](https://pi-wo.vercel.app)

### 🚀 Funkcjonalności Zaawansowane (na 5.0):
5. **Paginacja Serwerowa (Pobierania):**
   * Całkowicie usunięto cięcie tablic po stronie klienta (`.slice()`). 
   * Zaimplementowano optymalne odpytywanie bazy. Aplikacja ciągnie dane paczkami, wykorzystując `query()`, `limit()`, `orderBy()` oraz zapamiętane kursory z obiektów firebase do obsługi `startAfter()`.
   * Paginację obsługuje przycisk *"Załaduj kolejne gry z chmury"*.
6. **System Licytacji z mechanizmem ACID (Transakcje):**
   * Dodano mechanizm licytacji widoczny na ekranie pojedynczej gry.
   * Do obsługi ofert (bidding) wykorzystano wbudowane w Firestore transakcje (`runTransaction`). 
   * Gwarantuje to spójność bazy i zachowanie właściwości **ACID** – uodparnia system na tzw.