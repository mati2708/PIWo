"use client";
import { useState, useEffect } from 'react';

export function useGames() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const localGames = localStorage.getItem('boardGames');
        
        if (localGames) {
            setGames(JSON.parse(localGames));
            setLoading(false);
        } else {
            fetch('https://szandala.github.io/piwo-api/board-games.json')
                .then(res => res.json())
                .then(data => {
                    // Wskazujemy dokładny klucz z Twojego JSON-a: data.board_games
                    const gamesArray = data.board_games || [];
                    
                    setGames(gamesArray);
                    localStorage.setItem('boardGames', JSON.stringify(gamesArray));
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Błąd pobierania gier:", err);
                    setLoading(false);
                });
        }
    }, []);

    const saveGame = (newGame) => {
        let updatedGames;
        if (newGame.id) {
            updatedGames = games.map(g => g.id === newGame.id ? newGame : g);
        } else {
            newGame.id = Date.now(); 
            updatedGames = [...games, newGame];
        }
        setGames(updatedGames);
        localStorage.setItem('boardGames', JSON.stringify(updatedGames));
    };

    return { games, loading, saveGame };
}