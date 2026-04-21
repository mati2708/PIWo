"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGames } from '@/hooks/useGames';
import Link from 'next/link';

export default function EditGame() {
    const router = useRouter();
    const params = useParams();
    const { games, saveGame, loading } = useGames();
    
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (!loading && games.length > 0) {
            const gameToEdit = games.find(g => g.id.toString() === params.id);
            if (gameToEdit) {
                setFormData({
                    ...gameToEdit,
                    description: Array.isArray(gameToEdit.description) ? gameToEdit.description.join(' ') : gameToEdit.description
                });
            }
        }
    }, [games, loading, params.id]);

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
            description: [formData.description]
        });
        router.push('/');
    };

    if (loading || !formData) return <div className="p-10">Ładowanie edytora...</div>;

    return (
        <div className="max-w-2xl mx-auto p-8">
            <Link href="/" className="text-blue-500 hover:underline mb-6 block">&larr; Anuluj edycję</Link>
            <h1 className="text-3xl font-bold mb-6">Edytuj grę: {formData.title}</h1>
            
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

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block font-bold mb-1 text-gray-900">Min. graczy</label>
                        <input type="number" min="1" name="min_players" value={formData.min_players} onChange={handleChange} className="w-full border p-2 rounded bg-white text-gray-900" />
                    </div>
                    <div className="flex-1">
                        <label className="block font-bold mb-1 text-gray-900">Max. graczy</label>
                        <input type="number" min="1" name="max_players" value={formData.max_players} onChange={handleChange} className="w-full border p-2 rounded bg-white text-gray-900" />
                    </div>
                </div>

                <div>
                    <label className="block font-bold mb-1 text-gray-900">Krótki opis</label>
                    <textarea name="description" required value={formData.description} onChange={handleChange} className="w-full border p-2 rounded min-h-[100px] bg-white text-gray-900"></textarea>
                </div>

                <button type="submit" className="bg-orange-500 text-white font-bold py-3 rounded hover:bg-orange-600 mt-4 border-none">
                    Zapisz zmiany
                </button>
            </form>
        </div>
    );
}