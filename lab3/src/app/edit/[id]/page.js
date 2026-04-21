"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGames } from '@/hooks/useGames';
import Link from 'next/link';

export default function EditGame() {
    const router = useRouter();
    const params = useParams(); // Pobieramy ID gry do edycji
    const { games, saveGame, loading } = useGames();
    
    // Początkowy stan formularza to null, ponieważ musimy poczekać na pobranie gier
    const [formData, setFormData] = useState(null);

    // Wypełnianie formularza danymi po załadowaniu
    useEffect(() => {
        if (!loading && games.length > 0) {
            const gameToEdit = games.find(g => g.id.toString() === params.id);
            if (gameToEdit) {
                setFormData({
                    ...gameToEdit,
                    // Ważne: Jeśli opis to tablica zdań (z API), łączymy ją spacjami w jeden długi string (.join),
                    // aby móc go wyświetlić i edytować wewnątrz standardowego pola <textarea>
                    description: Array.isArray(gameToEdit.description) ? gameToEdit.description.join(' ') : gameToEdit.description
                });
            }
        }
    }, [games, loading, params.id]); // Nasłuchujemy zmian w tych zmiennych

    // Dynamiczna aktualizacja stanu podczas wpisywania
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Zapis edycji
    const handleSubmit = (e) => {
        e.preventDefault();
        saveGame({
            ...formData,
            price_pln: parseFloat(formData.price_pln), // Wymuszenie typu liczbowego zmiennoprzecinkowego
            min_players: parseInt(formData.min_players), // Wymuszenie typu liczbowego całkowitego
            max_players: parseInt(formData.max_players),
            avg_play_time_minutes: parseInt(formData.avg_play_time_minutes),
            description: [formData.description] // Zamieniamy edytowany tekst z powrotem w tablicę 1-elementową
        });
        // Przekierowanie do strony głównej
        router.push('/');
    };

    // Wyświetla się dopóki React nie znajdzie i nie przepakuje danych gry
    if (loading || !formData) return <div className="p-10 text-center text-xl">Ładowanie edytora... ⚙️</div>;

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#333]">
            {/* Nagłówek */}
            <header className="bg-[#2c3e50] text-white py-4 px-6 md:px-10 flex justify-between items-center shadow-md">
                <h1 className="text-2xl tracking-wide font-bold">
                    <Link href="/">Mityczny Pionek 🎲</Link>
                </h1>
                <Link href="/" className="bg-[#e67e22] hover:bg-[#d35400] text-white font-bold py-2 px-4 rounded transition">
                    Anuluj edycję
                </Link>
            </header>

            {/* Formularz Edycji */}
            <div className="max-w-[600px] mx-auto mt-10 bg-white p-[30px] rounded-lg shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-[#2c3e50] border-b-2 border-gray-100 pb-2">
                    Edytuj grę: <span className="text-[#3498db]">{formData.title}</span>
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
                        <input type="text" name="publisher" required value={formData.publisher} onChange={handleChange} className="p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col flex-1">
                            <label className="text-sm font-bold mb-1 text-gray-700">Min. graczy</label>
                            <input type="number" min="1" name="min_players" value={formData.min_players} onChange={handleChange} className="p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <label className="text-sm font-bold mb-1 text-gray-700">Max. graczy</label>
                            <input type="number" min="1" name="max_players" value={formData.max_players} onChange={handleChange} className="p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900" />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-bold mb-1 text-gray-700">Krótki opis</label>
                        <textarea name="description" required value={formData.description} onChange={handleChange} className="p-3 border border-gray-300 rounded min-h-[120px] resize-y bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900"></textarea>
                    </div>

                    <button type="submit" className="bg-[#3498db] hover:bg-[#2980b9] text-white font-bold py-3 px-4 rounded transition w-full text-lg mt-2 shadow-sm">
                        Zapisz zmiany w bazie
                    </button>
                </form>
            </div>
        </div>
    );
}