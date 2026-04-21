"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useGames } from '@/hooks/useGames';

export default function Home() {
    const { games, loading } = useGames();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    if (loading) return <div className="p-10 text-center text-xl">Ładowanie gier... 🎲</div>;

    const safeGames = Array.isArray(games) ? games : [];
    
    // Wyszukiwanie
    const filteredGames = safeGames.filter(game => 
        game.title && game.title.toLowerCase().includes(search.toLowerCase())
    );

    // Paginacja
    const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentGames = filteredGames.slice(startIndex, startIndex + itemsPerPage);

    // Baza linku do zdjęć z API prowadzącego
    const apiBaseUrl = 'https://szandala.github.io/piwo-api/';

    return (
        <main className="min-h-screen p-8 bg-gray-50 text-gray-800">
            <header className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <h1 className="text-3xl font-bold">Mityczny Pionek 🎲</h1>
                <Link href="/add" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    + Dodaj nową grę
                </Link>
            </header>

            <div className="mb-6">
                <input 
                    type="text" 
                    placeholder="Szukaj gry po tytule..." 
                    className="w-full md:w-1/2 p-3 border rounded shadow-sm"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentGames.map(game => {
                    // Wyciąganie bezpiecznych danych
                    const imageUrl = game.images && game.images.length > 0 ? apiBaseUrl + game.images[0] : 'https://via.placeholder.com/300?text=Brak+Zdjecia';
                    const shortDesc = Array.isArray(game.description) ? game.description[0] : game.description;
                    
                    return (
                        <div key={game.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                            <img 
                                src={imageUrl} 
                                alt={game.title}
                                className="w-full h-48 object-cover rounded mb-4"
                                onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Brak+Zdjecia'}
                            />
                            <h2 className="text-xl font-bold mb-2">{game.title}</h2>
                            <p className="text-gray-600 mb-2 truncate">{shortDesc}</p>
                            <p className="font-bold text-lg text-blue-600">{game.price_pln} zł</p>
                            <div className="mt-4 flex gap-2">
                                <Link href={`/game/${game.id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                                    Szczegóły
                                </Link>
                                <Link href={`/edit/${game.id}`} className="bg-orange-400 text-white px-3 py-1 rounded hover:bg-orange-500 text-sm">
                                    Edytuj
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Poprzednia
                </button>
                <span className="py-2">Strona {currentPage} z {totalPages || 1}</span>
                <button 
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Następna
                </button>
            </div>
        </main>
    );
}