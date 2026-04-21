# 📝 Laboratorium 2: Zaawansowana Lista ToDo (Vanilla JS)

W ramach drugiego laboratorium zrealizowano projekt niezależny od głównego sklepu. Celem było stworzenie w pełni interaktywnej aplikacji "To-Do List" przy użyciu **czystego języka JavaScript (Vanilla JS)**, HTML5 oraz CSS, bez wykorzystania frameworków.

Aplikacja demonstruje zaawansowaną manipulację drzewem DOM, obsługę zdarzeń (Event Listeners) oraz zarządzanie stanem aplikacji w oknie przeglądarki.

## ✨ Zrealizowane Funkcjonalności (Zgodnie z wymogami)

Aplikacja spełnia wszystkie wymagania funkcjonalne, punktując pełen zestaw oceniany na zajęciach:

* **Dodawanie zadań:** Możliwość dodania nowej pozycji za pomocą pola tekstowego i przycisku (z walidacją zapobiegającą dodawaniu pustych zadań).
* **Oznaczanie statusu:** * Kliknięcie zadania wyszarza je i przekreśla tekst (oznaczenie jako wykonane).
  * Ponowne kliknięcie cofa ten stan.
  * Po ukończeniu zadania, automatycznie pojawia się **data i godzina** jego wykonania.
* **Usuwanie z potwierdzeniem:**
  * Każdy element posiada przycisk "X" do usuwania.
  * Próba usunięcia wywołuje **Modal** z pytaniem o potwierdzenie, zawierający dokładną treść usuwanego zadania.
* **Kosz i mechanizm "Undo":**
  * Usunięty element trafia do wirtualnego kosza.
  * Zaimplementowano funkcjonalność cofania (podobnie jak Ctrl+Z), pozwalającą na przywrócenie ostatnio usuniętego zadania (pamięć 1 kroku wstecz).
* **Obsługa wielu list / kategorii:**
  * Możliwość kategoryzowania zadań (posiadania wielu niezależnych list).
  * Przy dodawaniu zadania wybieramy, do której listy ma trafić.
  * Nagłówki list są klikalne – pozwalają na zwijanie i rozwijanie danej sekcji.
* **Dynamiczna wyszukiwarka (Live-Search):**
  * Wyszukiwanie "w locie" – lista aktualizuje się natychmiast po wpisaniu każdego znaku.
  * Zaimplementowano przełącznik typu Checkbox, umożliwiający wyszukiwanie ignorujące wielkość liter (*case-insensitive*) lub ją uwzględniające.
* **Dobre praktyki kodowania:**
  * Kod napisany zgodnie ze standardami (użycie `const`/`let` zamiast `var`, ścisłe porównania `===`, średniki na końcu instrukcji).

## 🚀 Uruchomienie

Jako że projekt nie wymaga serwera Node.js (jest to statyczny projekt frontendowy), wystarczy otworzyć plik `index.html` z tego folderu w dowolnej przeglądarce internetowej.