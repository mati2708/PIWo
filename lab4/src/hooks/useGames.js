"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export function useGames() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchGames = async () => {
        setLoading(true);
        try {
            const gamesCollection = collection(db, "games");
            const querySnapshot = await getDocs(gamesCollection);

            if (querySnapshot.empty) {
                console.log("Baza Firestore jest pusta. Rozpoczynam automatyczną migrację danych z API...");
                const res = await fetch('https://szandala.github.io/piwo-api/board-games.json');
                const data = await res.json();
                const gamesArray = data.board_games || [];
                
                for (const g of gamesArray) {
                    await setDoc(doc(db, "games", g.id.toString()), g);
                }
                
                console.log("Migracja zakończona sukcesem!");
                const newSnapshot = await getDocs(gamesCollection);
                const newGamesList = newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setGames(newGamesList);
            } else {
                const gamesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setGames(gamesList);
            }
        } catch (error) {
            console.error("Błąd połączenia z Firestore:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const saveGame = async (gameData) => {
        try {
            const existingGame = games.find(g => g.id.toString() === gameData.id?.toString());

            if (existingGame) {
                const gameRef = doc(db, "games", gameData.id.toString());
                await updateDoc(gameRef, gameData);
            } else {
                const newGame = {
                    ...gameData,
                    ownerUid: user ? user.uid : "anonim",
                    ownerEmail: user ? user.email : "Brak",
                    isSold: false // Domyślnie nowa gra nie jest sprzedana
                };
                await addDoc(collection(db, "games"), newGame);
            }
            await fetchGames();
        } catch (error) {
            console.error("Błąd zapisu w Firestore:", error);
        }
    };

    const deleteGame = async (gameId) => {
        try {
            await deleteDoc(doc(db, "games", gameId.toString()));
            await fetchGames();
        } catch (error) {
            console.error("Błąd przy usuwaniu gry:", error);
        }
    };

    // --- NOWA FUNKCJA: Kupowanie gry ---
    const buyGame = async (gameId) => {
        if (!user) {
            alert("Musisz być zalogowany, aby dokonać zakupu!");
            return;
        }
        if (window.confirm("Czy na pewno chcesz kupić tę grę?")) {
            try {
                const gameRef = doc(db, "games", gameId.toString());
                // Ustawiamy flagę isSold na true
                await updateDoc(gameRef, { isSold: true, buyerUid: user.uid });
                await fetchGames(); // Odśwież listę, aby odmalować UI
            } catch (error) {
                console.error("Błąd podczas kupowania gry:", error);
            }
        }
    };

    return { games, loading, saveGame, deleteGame, buyGame, refreshGames: fetchGames };
}