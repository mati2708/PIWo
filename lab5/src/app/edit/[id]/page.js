"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGames } from '@/hooks/useGames';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function EditGame() {
    const router = useRouter();
    const params = useParams(); // Pobiera ID z paska URL
    const { saveGame, deleteGame } = useGames();
    const { user } = useAuth();
    
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // ZOPTYMALIZOWANA REFERENCJA DLA OPISU (Wymóg na Lab 5)
    const descriptionRef = useRef(null);

    // BEZPOŚREDNIE POBIERANIE KONKRETNEJ GRY Z FIREBASE (Naprawia problem paginacji)
    useEffect(() => {
        const fetchSingleGame = async () => {
            try {
                const docRef = doc(db, "games", params.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                } else {
                    alert("Nie znaleziono gry w bazie!");
                    router.push('/');
                }
            } catch (error) {
                console.error("Błąd pobierania gry:", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchSingleGame();
        }
    }, [params.id, router]);

    // Ekrany ładowania
    if (loading) return <div className="min-h-screen bg-[#2c3e50] p-10 text-center text-xl text-white">Ładowanie edytora... ⚙️</div>;
    if (!user) return <div className="min-h-screen bg-[#2c3e50] p-10 text-center text-xl text-white">Zaloguj się, aby edytować gry!</div>;
    if (!formData) return null;

    // 🔥 KULOODPORNY BEZPIECZNIK AUTORSKI (Weryfikacja bezpośrednio z Firebase)
    if (formData.ownerUid !== user.uid) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 text-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full border border-gray-100">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Brak uprawnień 🛑</h2>
                    <p className="text-gray-700 mb-6">Modyfikacja zablokowana. Nie możesz edytować tej gry, ponieważ została wystawiona przez innego użytkownika lub system.</p>
                    <Link href="/" className="bg-[#3498db] text-white px-6 py-3 rounded font-bold hover:bg-[#2980b9] transition shadow-sm">
                        Wróć do sklepu
                    </Link>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // POBRANIE WARTOSCI Z USE-REF TYLKO W MOMENCIE ZAPISU
        const finalDescription = descriptionRef.current.value;

        await saveGame({
            ...formData,
            price_pln: parseFloat(formData.price_pln),
            min_players: parseInt(formData.min_players),
            max_players: parseInt(formData.max_players),
            avg_play_time_minutes: parseInt(formData.avg_play_time_minutes),
            description: [finalDescription] // <-- Aktualizacja opisu
        });
        
        router.push('/');
    };

    // FUNKCJA USUWANIA (z dodanym potwierdzeniem)
    const handleDelete = async () => {
        if (window.confirm(`Czy na pewno chcesz usunąć grę "${formData.title}"? Tej operacji nie da się cofnąć!`)) {
            await deleteGame(formData.id);
            router.push('/');
        }
    };

    // Obsługa tego, że opis w bazie czasem jest tablicą, a czasem zwykłym tekstem
    const initialDescription = Array.isArray(formData.description) ? formData.description.join(' ') : (formData.description || '');

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#333]">
            <header className="bg-[#2c3e50] text-white py-4 px-6 md:px-10 flex justify-between items-center shadow-md">
                <h1 className="text-2xl tracking-wide font-bold">
                    <Link href="/">Mityczny Pionek 🎲</Link>
                </h1>
                <Link href="/" className="bg-[#e67e22] hover:bg-[#d35400] text-white font-bold py-2 px-4 rounded transition">
                    Anuluj edycję
                </Link>
            </header>

            <div className="max-w-[600px] mx-auto mt-10 bg-white p-[30px] rounded-lg shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-[#2c3e50] border-b-2 border-gray-100 pb-2">
                    Edytujesz grę: <span className="text-[#3498db]">{formData.title}</span>
                </h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col">
                        <label className="text-sm font-bold mb-1 text-gray-700">Tytuł gry</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleChange} className="p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900" />
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-sm font-bold mb-1 text-gray-700">Cena (PLN)</label>
                        <input type="number" step="0.01" name="price_pln" required value={formData.price_pln} onChange={handleChange} className="p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-bold mb-1 text-gray-700">Wydawnictwo</label>
                        <input type="text" name="publisher" required value={formData.publisher || ''} onChange={handleChange} className="p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col flex-1">
                            <label className="text-sm font-bold mb-1 text-gray-700">Min. graczy</label>
                            <input type="number" min="1" name="min_players" required value={formData.min_players} onChange={handleChange} className="p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <label className="text-sm font-bold mb-1 text-gray-700">Max. graczy</label>
                            <input type="number" min="1" name="max_players" required value={formData.max_players} onChange={handleChange} className="p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <label className="text-sm font-bold mb-1 text-gray-700">Czas gry (min)</label>
                            <input type="number" min="1" name="avg_play_time_minutes" required value={formData.avg_play_time_minutes} onChange={handleChange} className="p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900" />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-bold mb-1 text-gray-700">Szczegółowy opis</label>
                        {/* W formularzu edycji używamy defaultValue zamiast value */}
                        <textarea 
                            ref={descriptionRef} 
                            defaultValue={initialDescription}
                            required 
                            className="p-3 border border-gray-300 rounded min-h-[120px] resize-y bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900"
                        ></textarea>
                    </div>

                    {/* DWA PRZYCISKI - Zapisz i Usuń */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                        <button type="submit" className="bg-[#3498db] hover:bg-[#2980b9] text-white font-bold py-3 px-4 rounded transition flex-1 shadow-sm">
                            Zapisz zmiany w chmurze
                        </button>
                        <button type="button" onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded transition flex-1 shadow-sm">
                            🗑️ Usuń grę
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}