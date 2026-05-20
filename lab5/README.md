# 🎲 Mityczny Pionek - Sklep z Grami Planszowymi (Lab 5)

Aplikacja webowa typu e-commerce służąca do przeglądania, kupowania i zarządzania katalogiem gier planszowych. Projekt został zbudowany z wykorzystaniem frameworka **Next.js**, bazy danych **Firebase** oraz stylów **Tailwind CSS**. 

**Laboratorium 5** skupia się na zaawansowanym zarządzaniu stanem, optymalizacji wydajności (zapobieganie zbędnym renderowaniom) oraz poprawie ogólnego UX/UI aplikacji.

## 🚀 Nowości i Usprawnienia w Lab 5

W tej iteracji projektu zaimplementowano następujące funkcjonalności zgodnie z wytycznymi laboratoryjnymi:

### 1. Zaawansowany Koszyk (Wzorzec `useReducer` + `localStorage`)
* **Wzorzec Reducer:** Logika koszyka została przeniesiona z prostego `useState` do globalnego `CartContext` wykorzystującego `useReducer`. Obsługiwane akcje to m.in. `ADD`, `REMOVE`, `UPDATE_QUANTITY` oraz `CLEAR`.
* **Trwałość danych (Hydracja):** Stan koszyka jest synchronizowany z `localStorage`. Aplikacja bezpiecznie odczytuje dane po stronie klienta (useEffect), co zapobiega błędom hydracji w Next.js.
* **Automatyczne obliczenia:** Koszyk automatycznie zlicza łączną liczbę sztuk oraz sumę do zapłaty, uodparniając się na błędy matematyczne (np. `NaN` przy starych danych w pamięci).

### 2. Optymalizacja wydajności filtrowania (`useMemo`)
* Złożona logika filtrująca gry (po tytule, opisie, cenie, wydawnictwie itp.) została owinięta w hook `useMemo`. 
* Dzięki temu React zapamiętuje wynik filtrowania i przelicza potężną tablicę gier **tylko wtedy**, gdy użytkownik faktycznie zmieni wartość któregoś z filtrów, co znacząco odciąża procesor i poprawia płynność interfejsu.

### 3. Optymalizacja formularzy (`useRef`)
* W formularzach dodawania (`/add`) oraz edycji (`/edit/[id]`) zrezygnowano z kontrolowania długiego pola opisu (`<textarea>`) za pomocą `useState`.
* Zastosowano hook `useRef` (komponent niekontrolowany). Zapobiega to przeładowywaniu całego formularza przy każdym wciśnięciu klawisza przez użytkownika. Tekst jest odczytywany jednorazowo (`ref.current.value`) dopiero w momencie kliknięcia przycisku "Zapisz".

### 4. Usprawnienia UX i Zabezpieczenia (Dodatkowe)
* **Nowy układ kafelków:** Każda gra posiada teraz 3 czytelne przyciski (Do koszyka, Kup Teraz, Edytuj).
* **Kuloodporna autoryzacja edycji:** Aplikacja pobiera dane gry bezpośrednio z chmury po ID i sprawdza pole `ownerUid`. Edycja i usuwanie są możliwe tylko dla rzeczywistego autora danej gry. Próba edycji gier systemowych (lub dodanych przez innych) kończy się komunikatem o braku uprawnień.
* **Integracja z paginacją:** Edytor działa bezbłędnie nawet dla gier znajdujących się na dalszych stronach ładowania z bazy Firebase.

---

## 🛠️ Technologie użyte w projekcie
* **Frontend:** React 18, Next.js (App Router)
* **Style:** Tailwind CSS
* **Backend / BaaS:** Firebase (Firestore)
* **Zarządzanie stanem:** Context API, `useReducer`, `useState`, `useMemo`, `useRef`

## 📦 Instrukcja uruchomienia lokalnego

1. Sklonuj repozytorium na swój dysk.
2. Otwórz terminal w folderze projektu.
3. Zainstaluj wymagane zależności komendą:
   ```bash
   npm install