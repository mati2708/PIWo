"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, runTransaction, query, limit, startAfter, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export function useGames() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastVisible, setLastVisible] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();

    const fetchGames = async (loadMore = false) => {
        setLoading(true);
        try {
            const gamesCollection = collection(db, "games");
            
            const checkSnapshot = await getDocs(gamesCollection);
            if (checkSnapshot.empty) {
                console.log("Auto-Seed...");
                const res = await fetch('https://szandala.github.io/piwo-api/board-games.json');
                const data = await res.json();
                for (const g of (data.board_games || [])) {
                    await setDoc(doc(db, "games", g.id.toString()), g);
                }
            }

            let q = query(gamesCollection, orderBy("id"), limit(8));
            if (loadMore && lastVisible) {
                q = query(gamesCollection, orderBy("id"), startAfter(lastVisible), limit(8));
            }

            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const gamesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
                
                if (loadMore) {
                    setGames(prev => [...prev, ...gamesList]);
                } else {
                    setGames(gamesList);
                }
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
                    isSold: false
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

    const buyGame = async (gameId) => {
        if (!user) {
            alert("Musisz być zalogowany, aby dokonać zakupu!");
            return;
        }
        if (window.confirm("Czy na pewno chcesz kupić tę grę?")) {
            try {
                const gameRef = doc(db, "games", gameId.toString());
                await updateDoc(gameRef, { isSold: true, buyerUid: user.uid });
                await fetchGames();
            } catch (error) {
                console.error("Błąd podczas kupowania gry:", error);
            }
        }
    };

    // --- TO JEST BRAKUJĄCA FUNKCJA ---
    const placeBid = async (gameId, bidAmount) => {
        if (!user) return { success: false, message: "Musisz być zalogowany!" };
        
        const gameRef = doc(db, "games", gameId.toString());

        try {
            await runTransaction(db, async (transaction) => {
                const gameDoc = await transaction.get(gameRef);
                if (!gameDoc.exists()) throw "Gra nie istnieje!";

                const data = gameDoc.data();
                if (data.isSold) throw "Gra została już sprzedana!";

                const currentBid = data.auction?.current_bid || data.price_pln;

                // Uwaga: Upewniamy się, że to liczby a nie tekst, poprzez parseFloat i parsowanie bidAmount. W twoim przykładzie na zdjęciu jest z przecinkiem "155,99", co JS może uznać za błąd. Przekazujemy kropkę.
                const parsedBid = parseFloat(bidAmount.toString().replace(',', '.'));
                
                if (parsedBid <= currentBid) {
                    throw `Twoja oferta musi być wyższa niż ${currentBid} zł!`;
                }

                transaction.update(gameRef, {
                    auction: {
                        current_bid: parsedBid,
                        highest_bidder_uid: user.uid,
                        highest_bidder_email: user.email
                    }
                });
            });
            
            await fetchGames();
            return { success: true, message: "Gratulacje, przebiłeś ofertę!" };
        } catch (error) {
            console.error("Błąd ACID:", error);
            return { success: false, message: error };
        }
    };

    return { games, loading, hasMore, fetchGames, placeBid, saveGame, deleteGame, buyGame };
}