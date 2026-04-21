"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGames } from '@/hooks/useGames';
import Link from 'next/link';

export default function AddGame() {
    const router = useRouter();
    const { saveGame } = useGames();
    
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        saveGame({
            ...formData,
            price_pln: parseFloat(formData.price_pln),
            min_players: parseInt(formData.min_players),
            max_players: parseInt(formData.max_players),
            avg_play_time_minutes: parseInt(formData.avg_play_time_minutes),
            description: [formData.description],
            images: [],
            is_expansion: false,
            auction: null
        });
        
        router.push('/');
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <Link href="/" className="text-blue-500 hover:underline mb-6 block">&larr; Wróć do sklepu</Link>
            <h1 className="text-3xl font-bold mb-6">Dodaj nową grę</h1>
            
            <form onSubmit={handleSubmit} className="bg-white text-gray-900 p-6 rounded-lg shadow-md flex flex-col gap-4">
                <div>
                    <label className="block font-bold mb-1 text-gray-900">Tytuł gry</label>
                    <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full border p-2 rounded bg-white text-gray-900" />
                </div>
                
                <div>
                    <label className="block font-bold mb-1 text-gray-900">Cena (PLN)</label>
                    <input type="number" step="0.01" name="price_pln" required value={formData.price_pln} onChange={handleChange} className="w-full border p-2 rounded bg-white text-gray-900" />
                </div>

                <div>
                    <label className="block font-bold mb-1 text-gray-900">Wydawnictwo</label>
                    <input type="text" name="publisher" required value={formData.publisher} onChange={handleChange} className="w-full border p-2 rounded bg-white text-gray-900" />
                </div>

                <div>
                    <label className="block font-bold mb-1 text-gray-900">Kategoria</label>
                    <input type="text" name="type" required value={formData.type} onChange={handleChange} className="w-full border p-2 rounded bg-white text-gray-900" />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block font-bold mb-1 text-gray-900">Min. graczy</label>
                        <input type="number" min="1" name="min_players" value={formData.min_players} onChange={handleChange} className="w-full border p-2 rounded bg-white text-gray-900" />
                    </div>
                    <div className="flex-1">
                        <label className="block font-bold mb-1 text-gray-900">Max. graczy</label>
                        <input type="number" min="1" name="max_players" value={formData.max_players} onChange={handleChange} className="w-full border p-2 rounded bg-white text-gray-900" />
                    </div>
                    <div className="flex-1">
                        <label className="block font-bold mb-1 text-gray-900">Czas gry (min)</label>
                        <input type="number" min="1" name="avg_play_time_minutes" value={formData.avg_play_time_minutes} onChange={handleChange} className="w-full border p-2 rounded bg-white text-gray-900" />
                    </div>
                </div>

                <div>
                    <label className="block font-bold mb-1 text-gray-900">Krótki opis</label>
                    <textarea name="description" required value={formData.description} onChange={handleChange} className="w-full border p-2 rounded min-h-[100px] bg-white text-gray-900"></textarea>
                </div>

                <button type="submit" className="bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 mt-4 border-none">
                    Zapisz grę w bazie
                </button>
            </form>
        </div>
    );
}