# 🧪 Laboratorium 3: Next.js i Integracja API

W tym laboratorium dotychczasowy statyczny projekt został przeniesiony na framework **Next.js**. Aplikacja została ożywiona poprzez podłączenie zewnętrznego źródła danych (API), a także rozbudowana o logikę filtrowania i formularze korzystające z pamięci przeglądarki.

## ✨ Zaimplementowane Funkcjonalności

Zrealizowano zarówno wymagania podstawowe, jak i rozszerzone (na ocenę 5.0):

1. **Pobieranie Danych (Fetch):** * Integracja z uczelnianym plikiem `board-games.json`.
   * Patcher w locie: Skrypt automatycznie poprawiający literówki w ścieżkach do zdjęć u dostawcy API.
2. **Zaawansowane Filtrowanie na Żywo:**
   * Wyszukiwanie gier po tytule i opisie.
   * Filtrowanie po cenie maksymalnej, kategorii, wydawnictwie, ilości graczy oraz czasie gry.
3. **Paginacja (Podział na strony):**
   * Wyświetlanie maksymalnie 8 gier na jednej stronie.
   * Interaktywne przyciski nawigacyjne ("Poprzednia" / "Następna") u góry i u dołu listy.
4. **Dynamiczny Routing:**
   * Podstrony szczegółów konkretnej gry z dynamicznym parametrem `[id]`.
5. **Formularze i LocalStorage:**
   * Możliwość dodawania nowych gier przez użytkownika.
   * Możliwość edycji już istniejących gier z API.
   * Zmiany zachowywane są w pamięci przeglądarki (`localStorage`).
6. **Custom Hooks:** * Wydzielenie całej logiki pobierania i zapisywania gier do niezależnego hooka `useGames.js` (zasada DRY).

## 🚀 Jak uruchomić ten etap lokalnie

1. Upewnij się, że masz zainstalowane środowisko **Node.js** (zalecana wersja LTS).
2. Będąc wewnątrz folderu `lab3`, zainstaluj zależności poleceniem:
   ```bash
   npm install