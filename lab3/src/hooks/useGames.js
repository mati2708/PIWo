"use client"; // Informuje Next.js, że ten kod wykonuje się po stronie przeglądarki (klienta)
import { useState, useEffect } from 'react';

export function useGames() {
    // Stan przechowujący tablicę wszystkich gier
    const [games, setGames] = useState([]);
    // Stan informujący, czy dane wciąż się ładują (zapobiega błędom przed pobraniem)
    const [loading, setLoading] = useState(true);

    // useEffect uruchomi się tylko raz, podczas pierwszego załadowania aplikacji
    useEffect(() => {
        // Sprawdzamy, czy mamy już jakieś dane w pamięci przeglądarki (LocalStorage)
        const localGames = localStorage.getItem('boardGames');
        
        if (localGames) {
            // Jeśli tak, "odmrażamy" je z formatu tekstowego (JSON) na tablicę w JS
            setGames(JSON.parse(localGames));
            setLoading(false);
        } else {
            // Jeśli nie, wysyłamy zapytanie do zewnętrznego API
            fetch('https://szandala.github.io/piwo-api/board-games.json')
                .then(res => res.json()) // Konwersja odpowiedzi na obiekt JSON
                .then(data => {
                    // Zabezpieczenie: Wyciągamy gry z klucza "board_games", ew. tworzymy pustą tablicę
                    const gamesArray = data.board_games || [];
                    
                    setGames(gamesArray);
                    // Zapisujemy pobrane dane do LocalStorage, żeby nie pobierać ich przy każdym odświeżeniu
                    localStorage.setItem('boardGames', JSON.stringify(gamesArray));
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Błąd pobierania gier:", err);
                    setLoading(false);
                });
        }
    }, []); // Pusta tablica zależności oznacza: "wykonaj tylko przy montowaniu komponentu"

    // Funkcja do dodawania nowej gry lub aktualizacji istniejącej
    const saveGame = (newGame) => {
        let updatedGames;
        if (newGame.id) {
            // EDYCJA: Jeśli gra ma już ID, zamieniamy starą wersję na nową
            updatedGames = games.map(g => g.id === newGame.id ? newGame : g);
        } else {
            // DODAWANIE: Tworzymy unikalne ID na podstawie obecnego czasu
            newGame.id = Date.now(); 
            // Tworzymy nową tablicę: bierzemy wszystkie stare gry (...games) i dorzucamy nową
            updatedGames = [...games, newGame];
        }
        
        // Aktualizujemy stan aplikacji oraz nadpisujemy bazę w LocalStorage
        setGames(updatedGames);
        localStorage.setItem('boardGames', JSON.stringify(updatedGames));
    };

    // Zwracamy zmienne i funkcje, by inne pliki mogły z nich korzystać
    return { games, loading, saveGame };
}