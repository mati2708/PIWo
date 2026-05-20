"use client";
import { useState, useRef } from 'react'; // <-- używamy useRef
import { useRouter } from 'next/navigation';
import { useGames } from '@/hooks/useGames';
import { useAuth } from '@/context/AuthContext'; 
import Link from 'next/link';

export default function AddGame() {
    const router = useRouter();
    const { saveGame } = useGames();
    const { user } = useAuth(); 
    
    // 1. ZWYKŁY STAN DLA KRÓTKICH PÓL (bez description!)
    const [formData, setFormData] = useState({
        title: '',
        price_pln: '',
        publisher: '',
        type: '',
        min_players: 1,
        max_players: 4,
        avg_play_time_minutes: 60
    });

    // 2. REFERENCJA DLA DŁUGIEGO TEKSTU (Oszczędza wydajność, brak lagów)
    const descriptionRef = useRef(null);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 text-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full border border-gray-100">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Brak dostępu 🛑</h2>
                    <p className="text-gray-700 mb-6">Musisz być zalogowany, aby móc wystawiać nowe gry w sklepie.</p>
                    <Link href="/login" className="bg-[#3498db] text-white px-6 py-3 rounded font-bold hover:bg-[#2980b9] transition shadow-sm">
                        Zaloguj się
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
        
        // 3. POBRANIE WARTOŚCI Z REFERENCJI W MOMENCIE WYSYŁANIA
        const finalDescription = descriptionRef.current.value;
        
        await saveGame({
            ...formData,
            price_pln: parseFloat(formData.price_pln),
            min_players: parseInt(formData.min_players),
            max_players: parseInt(formData.max_players),
            avg_play_time_minutes: parseInt(formData.avg_play_time_minutes),
            description: [finalDescription], // <-- Wstrzyknięcie wartości z useRef
            images: [],
            is_expansion: false,
            auction: null
        });
        
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#333]">
            <header className="bg-[#2c3e50] text-white py-4 px-6 md:px-10 flex justify-between items-center shadow-md">
                <h1 className="text-2xl tracking-wide font-bold">
                    <Link href="/">Mityczny Pionek 🎲</Link>
                </h1>
                <Link href="/" className="bg-[#e67e22] hover:bg-[#d35400] text-white font-bold py-2 px-4 rounded transition">
                    Wróć do sklepu
                </Link>
            </header>

            <div className="max-w-[600px] mx-auto mt-10 bg-white p-[30px] rounded-lg shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-[#2c3e50] border-b-2 border-gray-100 pb-2">Dodaj nową pozycję</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                        {/* 4. ZMIENIONY TEXTAREA: Podpięcie referencji, usunięcie value i onChange */}
                        <textarea 
                            ref={descriptionRef} 
                            required 
                            placeholder="Opisz zasady, klimat..." 
                            className="p-3 border border-gray-300 rounded min-h-[120px] resize-y bg-gray-50 focus:bg-white focus:border-[#3498db] outline-none transition text-gray-900"
                        ></textarea>
                    </div>

                    <button type="submit" className="bg-[#27ae60] hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition w-full text-lg mt-2 shadow-sm">
                        Zapisz i dodaj grę
                    </button>
                </form>
            </div>
        </div>
    );
}