"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGames } from '@/hooks/useGames';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
    
    const { games, loading, buyGame, fetchGames, hasMore } = useGames();
    const router = useRouter();
    const { user, logout } = useAuth();
    
    // --- STANY FILTRÓW (React useState) ---
    const [search, setSearch] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [type, setType] = useState('');
    const [players, setPlayers] = useState('');
    const [playTime, setPlayTime] = useState('');
    const [publisher, setPublisher] = useState('');

    // Ekran ładowania na czas pobierania danych z Firestore
    if (loading && games.length === 0) return <div className="p-10 text-center text-xl text-gray-900">Ładowanie gier z chmury... 🎲</div>;

    const safeGames = Array.isArray(games) ? games : [];
    
    // --- LOGIKA FILTROWANIA ---
    const filteredGames = safeGames.filter(game => {
        const searchLower = search.toLowerCase();
        const descText = Array.isArray(game.description) ? game.description.join(' ') : (game.description || '');
        
        const matchSearch = !search || 
            (game.title && game.title.toLowerCase().includes(searchLower)) ||
            descText.toLowerCase().includes(searchLower);

        const matchPrice = !maxPrice || game.price_pln <= parseFloat(maxPrice);
        const matchType = !type || (game.type && game.type.toLowerCase().includes(type.toLowerCase()));
        const matchPlayers = !players || (game.min_players <= parseInt(players) && game.max_players >= parseInt(players));
        const matchPlayTime = !playTime || game.avg_play_time_minutes <= parseInt(playTime);
        const matchPublisher = !publisher || (game.publisher && game.publisher.toLowerCase().includes(publisher.toLowerCase()));

        return matchSearch && matchPrice && matchType && matchPlayers && matchPlayTime && matchPublisher;
    });

   
    const apiBaseUrl = 'https://szandala.github.io/piwo-api/';
    const fixImagePath = (game) => {
        if (game.id === 4) return apiBaseUrl + 'images/board-games/azul.webp';
        if (!game.images || game.images.length === 0) return 'https://via.placeholder.com/300?text=Brak+Zdjecia';
        
        const path = game.images[0];
        const fixes = {
            'img/catan2.webp': 'images/board-games/catan2.jpg',
            'img/pociagi-europa/webp': 'images/board-games/pociag-europa.webp',
            'img/pociagi-szwajcaria.webp': 'images/board-games/pociagi-szwajcaria.jpg'
        };
        if (fixes[path]) return apiBaseUrl + fixes[path];
        return apiBaseUrl + path.replace('img/', 'images/board-games/');
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-800 font-sans">
            {/* Sekcja: HEADER */}
            <header className="bg-[#2c3e50] text-white py-4 px-6 md:px-10 flex justify-between items-center flex-wrap gap-4 shadow-md">
                <h1 className="text-2xl tracking-wide font-bold">
                    <Link href="/">Mityczny Pionek 🎲</Link>
                </h1>
                <div className="flex gap-3 text-sm md:text-base items-center">
                    {user ? (
                        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition">
                            Wyloguj ({user.email || 'Użytkownik'})
                        </button>
                    ) : (
                        <Link href="/login" className="bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold py-2 px-4 rounded transition inline-block">
                            Zaloguj
                        </Link>
                    )}
                    <button className="bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold py-2 px-4 rounded transition">🛒 (0)</button>
                    <Link href="/add" className="bg-[#e67e22] hover:bg-[#d35400] text-white font-semibold py-2 px-4 rounded transition">+ Dodaj pozycję</Link>
                </div>
            </header>

            {/* Sekcja: GŁÓWNY KONTENER */}
            <div className="flex flex-col md:flex-row p-6 md:p-10 gap-6">
                
                {/* Panel: FILTROWANIE */}
                <aside className="w-full md:w-64 bg-white p-5 rounded-lg shadow-sm border border-gray-100 h-fit shrink-0">
                    <h3 className="mb-4 border-b-2 border-[#2c3e50] pb-2 font-bold text-lg text-[#2c3e50]">Filtrowanie</h3>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1 text-gray-700">Słowo w opisie / Nazwa</label>
                        <input type="text" placeholder="Szukaj gry..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:border-[#3498db] outline-none transition bg-white text-gray-900" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1 text-gray-700">Max cena (zł)</label>
                        <input type="number" placeholder="Np. 150" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:border-[#3498db] outline-none transition bg-white text-gray-900" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1 text-gray-700">Rodzaj gry</label>
                        <select value={type} onChange={(e) => setType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:border-[#3498db] outline-none transition bg-white text-gray-900">
                            <option value="">Wszystkie</option>
                            <option value="ekonomiczna">Ekonomiczna</option>
                            <option value="przygodowa">Przygodowa</option>
                            <option value="towarzyska">Towarzyska</option>
                            <option value="kooperacyjna">Kooperacyjna</option>
                            <option value="karciana">Karciana</option>
                            <option value="rodzinna">Rodzinna</option>
                            <option value="zręcznościowa">Zręcznościowa</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1 text-gray-700">Ilość graczy</label>
                        <input type="number" min="1" placeholder="Np. 4" value={players} onChange={(e) => setPlayers(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:border-[#3498db] outline-none transition bg-white text-gray-900" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1 text-gray-700">Max czas gry (min)</label>
                        <input type="number" step="15" placeholder="Np. 60" value={playTime} onChange={(e) => setPlayTime(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:border-[#3498db] outline-none transition bg-white text-gray-900" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-1 text-gray-700">Wydawnictwo</label>
                        <input type="text" placeholder="Np. Rebel, Portal" value={publisher} onChange={(e) => setPublisher(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:border-[#3498db] outline-none transition bg-white text-gray-900" />
                    </div>
                    
                    <button 
                        onClick={() => {
                            setSearch(''); setMaxPrice(''); setType(''); setPlayers(''); setPlayTime(''); setPublisher('');
                        }} 
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition mt-2">
                        Wyczyść filtry
                    </button>
                </aside>

                <main className="flex-grow flex flex-col">
                    
                    {filteredGames.length === 0 ? (
                        <div className="bg-white p-10 rounded-lg shadow-sm text-center">
                            <p className="text-xl text-gray-500">Nie znaleziono gier spełniających kryteria. 😢</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            
                            {filteredGames.map(game => {
                                const imageUrl = fixImagePath(game);
                                const shortDesc = Array.isArray(game.description) ? game.description[0] : game.description;
                                const isSold = game.isSold;
                                
                                return (
                                    <div 
                                        key={game.id} 
                                        onClick={() => !isSold && router.push(`/game/${game.id}`)}
                                        className={`bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col transition duration-200 
                                            ${isSold ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-1 cursor-pointer'}`}
                                    >
                                        <div className="w-full h-48 flex justify-center items-center mb-4 relative">
                                            {isSold && (
                                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                                    <span className="bg-red-600 text-white font-bold text-xl py-2 px-6 rounded-lg transform -rotate-12 border-4 border-white shadow-lg tracking-widest">
                                                        SPRZEDANE
                                                    </span>
                                                </div>
                                            )}
                                            <img src={imageUrl} alt={game.title} className="max-h-full max-w-full object-contain" />
                                        </div>
                                        
                                        <h3 className="mb-2 text-[#2c3e50] font-bold text-lg leading-tight">{game.title}</h3>
                                        
                                        <div className="text-sm text-gray-600 mb-4 flex-grow space-y-1">
                                            <p><strong>Rodzaj:</strong> <span className="capitalize">{game.type || 'Brak danych'}</span></p>
                                            <p><strong>Gracze:</strong> {game.min_players} - {game.max_players}</p>
                                            <p><strong>Czas gry:</strong> {game.avg_play_time_minutes} min</p>
                                            <p className="mt-2 text-xs italic line-clamp-2">{shortDesc}</p>
                                        </div>
                                        
                                        <div className="text-xl font-bold text-[#27ae60] mb-4">
                                            {isSold ? 'Niedostępne' : `${game.price_pln} zł`}
                                        </div>
                                        
                                        <div className="flex gap-2 mt-auto">
                                            <button 
                                                disabled={isSold}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    buyGame(game.id);
                                                }}
                                                className={`font-semibold py-1.5 px-3 rounded transition flex-1 text-sm 
                                                    ${isSold ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-[#e74c3c] hover:bg-[#c0392b] text-white shadow-sm'}`}
                                            >
                                                {isSold ? 'Brak towaru' : 'Kup Teraz'}
                                            </button>
                                            
                                            <button 
                                                disabled={isSold}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/edit/${game.id}`);
                                                }}
                                                className={`font-semibold py-1.5 px-3 rounded transition flex-1 text-sm border 
                                                    ${isSold ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'}`}
                                            >
                                                Edytuj
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    
                 
                    {hasMore && search === '' && filteredGames.length > 0 && (
                        <div className="mt-10 flex justify-center">
                            <button 
                                onClick={() => fetchGames(true)} // Wywołanie pobierania kolejnej paczki gier (loadMore = true)
                                className="bg-[#2c3e50] hover:bg-[#1a252f] text-white font-bold py-3 px-8 rounded-full shadow-md transition transform hover:-translate-y-1"
                            >
                                ⬇️ Załaduj kolejne gry z chmury
                            </button>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}