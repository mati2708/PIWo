"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGames } from '@/hooks/useGames';
import Link from 'next/link';

export default function AddGame() {
    const router = useRouter(); // Umożliwia programowe przekierowania
    const { saveGame } = useGames();
    
    // Inicjalizacja stanu formularza (Controlled Components w React)
    const [formData, setFormData] = useState({
        title: '',
        price_pln: '',
        description: '',
        publisher: '',
        type: '',
        min_players: 1,
        max_players: 4,
        avg_play_time_minutes: 60
    });

    // Uniwersalna funkcja obsługująca zmiany w dowolnym inpucie
    // [e.target.name] dynamicznie przypisuje wartość do odpowiedniego klucza w obiekcie
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Obsługa wysyłki formularza
    const handleSubmit = (e) => {
        e.preventDefault(); // Blokuje domyślne, fizyczne przeładowanie strony po kliknięciu "Submit"
        
        // Formatujemy dane przed zapisem, aby zgadzały się z typami w oryginalnym JSON-ie (np. liczby zamiast tekstów)
        saveGame({
            ...formData,
            price_pln: parseFloat(formData.price_pln),
            min_players: parseInt(formData.min_players),
            max_players: parseInt(formData.max_players),
            avg_play_time_minutes: parseInt(formData.avg_play_time_minutes),
            description: [formData.description], // Zapisujemy opis do jednoelementowej tablicy (zgodnie ze strukturą API)
            images: [], // Placeholder na zdjęcia (nieobsługiwane w formularzu)
            is_expansion: false,
            auction: null
        });
        
        // Po pomyślnym zapisie, przenosimy użytkownika z powrotem na stronę główną
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#333]">
            {/* Nagłówek aplikacji */}
            <header className="bg-[#2c3e50] text-white py-4 px-6 md:px-10 flex justify-between items-center shadow-md">
                <h1 className="text-2xl tracking-wide font-bold">
                    <Link href="/">Mityczny Pionek 🎲</Link>
                </h1>
                <Link href="/" className="bg-[#e67e22] hover:bg-[#d35400] text-white font-bold py-2 px-4 rounded transition">
                    Wróć do sklepu
                </Link>
            </header>

            {/* Formularz - stylowany zgodnie z Lab 1 (.form-container) */}
            <div className="max-w-[600px] mx-auto mt-10 bg-white p-[30px] rounded-lg shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-[#2c3e50] border-b-2 border-gray-100 pb-2">Dodaj nową pozycję</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Pola tekstowe i liczbowe */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold mb-1 text-gray-700">Nazwa gry planszowej</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="Wpisz tytuł gry" className="p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-bold mb-1 text-gray-700">Cena (zł)</label>
                        <input type="number" step="0.01" name="price_pln" required value={formData.price_pln} onChange={handleChange} placeholder="0.00" className="p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-bold mb-1 text-gray-700">Rodzaj gry</label>
                        <input type="text" name="type" required value={formData.type} onChange={handleChange} placeholder="Kategoria gry" className="p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900" />
                    </div>

                    {/* Zgrupowane parametry liczbowe */}
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
                        <label className="text-sm font-bold mb-1 text-gray-700">Wydawnictwo</label>
                        <input type="text" name="publisher" required value={formData.publisher} onChange={handleChange} placeholder="Kto wydał grę?" className="p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-bold mb-1 text-gray-700">Szczegółowy opis</label>
                        <textarea name="description" required value={formData.description} onChange={handleChange} placeholder="Opisz zasady, klimat..." className="p-3 border border-gray-300 rounded min-h-[120px] resize-y bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900"></textarea>
                    </div>

                    <button type="submit" className="bg-[#27ae60] hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition w-full text-lg mt-2 shadow-sm">
                        Zapisz i dodaj grę
                    </button>
                </form>
            </div>
        </div>
    );
}