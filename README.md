# 🎲 Mityczny Pionek - Sklep z Grami Planszowymi

Witaj w repozytorium projektu "Mityczny Pionek". Jest to aplikacja webowa sklepu z grami planszowymi, tworzona krok po kroku w ramach laboratoriów PIWo. 

Projekt ewoluował od prostych statycznych widoków HTML/CSS, przez aplikację React z własnym API, aż po pełnoprawną aplikację Fullstack opartą na chmurze, zaawansowanym zarządzaniu stanem i optymalizacji wydajności.

🚀 **Wersja Live (Vercel): [https://pi-wo.vercel.app](https://pi-wo.vercel.app)**

---

## 🛠️ Wykorzystane Technologie
* **Frontend:** React, Next.js
* **Backend (BaaS):** Google Firebase (Firestore NoSQL, Authentication)
* **Styling:** Tailwind CSS, Custom CSS
* **Zarządzanie stanem i logiką:** React Context API, `useReducer`, `useMemo`, `useRef`, `useState`, `useEffect`
* **Transakcje i Chmura:** Transakcje ACID (`runTransaction`), Kursorowa paginacja serwerowa
* **Hosting / CI-CD:** Vercel
* **Wersjonowanie:** Git & GitHub

---

## 📚 Spis Laboratoriów i Postępy

Tutaj znajduje się historia rozwoju repozytorium wraz z odnośnikami do poszczególnych etapów:

- [x] **Lab 1:** Podstawy HTML/CSS - Statyczny projekt interfejsu (mockup) strony głównej i formularzy sklepu.
- [x] **[Lab 2: Vanilla JavaScript (Aplikacja ToDo)](./lab2/README.md)** - *Uwaga: Niezależny, zamknięty miniprojekt.* Zaawansowana lista zadań z obsługą DOM, zdarzeń i logiką biznesową w czystym JS.
- [x] **[Lab 3: Przejście na Next.js i integracja API](./lab3/README.md)** - Powrót do aplikacji sklepu. Dynamiczne renderowanie list, formularze, routing i zaawansowane filtrowanie.
- [x] **[Lab 4: Baza Danych i Autoryzacja](./lab4/README.md)** - Podłączenie chmury **Firebase**:
  - Baza NoSQL (Firestore) + Auto-seed danych.
  - Autoryzacja i logowanie (Google Auth / Email).
  - Walidacja uprawnień do edycji/usuwania (CRUD).
  - Paginacja serwerowa (odpytywanie paczkami za pomocą kursorów).
  - Moduł licytacji z zachowaniem transakcji **ACID** (`runTransaction`).
  - Wdrożenie (Deploy) na platformę **Vercel**.
- [x] **[Lab 5: Optymalizacja, Wydajność i UX](./lab5/README.md)** - Usprawnienia interfejsu i zarządzania stanem:
  - Wdrożenie wzorca **Reducer** (`useReducer` + `localStorage`) do obsługi globalnego koszyka zakupowego.
  - Optymalizacja wydajności filtrowania bazy gier przy użyciu hooka **`useMemo`** (cache wyników).
  - Wykorzystanie komponentów niekontrolowanych i hooka **`useRef`** w polach tekstowych formularzy (eliminacja zbędnych renderów podczas pisania).
  - Dokończenie i uszczelnienie systemu uprawnień (CRUD) w powiązaniu z paginacją.

---

*Projekt realizowany w ramach zajęć akademickich.*