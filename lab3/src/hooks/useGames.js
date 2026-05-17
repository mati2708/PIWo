"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, runTransaction, query, limit, startAfter, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export function useGames() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastVisible, setLastVisible] = useState(null); // Kursor do paginacji
    const [hasMore, setHasMore] = useState(true); // Czy są kolejne strony?
    const { user } = useAuth();

    // PAGINACJA SERWEROWA (Wymóg 5.0)
    const fetchGames = async (loadMore = false) => {
        setLoading(true);
        try {
            const gamesCollection = collection(db, "games");
            
            // Jeśli baza jest pusta, robimy szybki auto-seed
            const checkSnapshot = await getDocs(gamesCollection);
            if (checkSnapshot.empty) {
                const res = await fetch('https://szandala.github.io/piwo-api/board-games.json');
                const data = await res.json();
                for (const g of (data.board_games || [])) {
                    await setDoc(doc(db, "games", g.id.toString()), g);
                }
            }

            // Zapytanie z LIMITEM (np. 8 gier na raz)
            let q = query(gamesCollection, orderBy("id"), limit(8));

            // Jeśli to ładowanie kolejnej strony, zacznij po ostatnim dokumencie
            if (loadMore && lastVisible) {
                q = query(gamesCollection, orderBy("id"), startAfter(lastVisible), limit(8));
            }

            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const gamesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Zapisujemy ostatni dokument, żeby wiedzieć, od czego zacząć następną paczkę
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
                
                if (loadMore) {
                    setGames(prev => [...prev, ...gamesList]); // Doklejamy do istniejących
                } else {
                    setGames(gamesList); // Pierwsze ładowanie
                }
                
                // Jeśli pobraliśmy mniej niż 8, znaczy że to już koniec bazy
                setHasMore(querySnapshot.docs.length === 8);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Błąd pobierania:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    // TRANSAKCJA ACID DLA LICYTACJI (Wymóg 5.0)
    const placeBid = async (gameId, bidAmount) => {
        if (!user) return { success: false, message: "Musisz być zalogowany!" };
        
        const gameRef = doc(db, "games", gameId.toString());

        try {
            // runTransaction gwarantuje, że nikt nie nadpisze danych w tej samej milisekundzie
            await runTransaction(db, async (transaction) => {
                const gameDoc = await transaction.get(gameRef);
                if (!gameDoc.exists()) throw "Gra nie istnieje!";

                const data = gameDoc.data();
                if (data.isSold) throw "Gra została już sprzedana!";

                // Sprawdzamy aktualną najwyższą ofertę lub cenę wyjściową
                const currentBid = data.auction?.current_bid || data.price_pln;

                if (bidAmount <= currentBid) {
                    throw `Twoja oferta musi być wyższa niż ${currentBid} zł!`;
                }

                // Bezpieczny zapis nowej oferty
                transaction.update(gameRef, {
                    auction: {
                        current_bid: parseFloat(bidAmount),
                        highest_bidder_uid: user.uid,
                        highest_bidder_email: user.email
                    }
                });
            });
            
            await fetchGames(); // Odśwież widok
            return { success: true, message: "Gratulacje, przebiłeś ofertę!" };
        } catch (error) {
            console.error("Błąd ACID:", error);
            return { success: false, message: error };
        }
    };

    const saveGame = async (gameData) => { /* Twój dotychczasowy kod saveGame */ };
    const deleteGame = async (gameId) => { /* Twój dotychczasowy kod deleteGame */ };
    const buyGame = async (gameId) => { /* Twój dotychczasowy kod buyGame */ };

    return { games, loading, hasMore, fetchGames, placeBid, saveGame, deleteGame, buyGame };
}