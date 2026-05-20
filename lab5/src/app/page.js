"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGames } from '@/hooks/useGames';
import { useAuth } from '@/context/AuthContext'; 
import { useCart } from '@/context/CartContext';


export default function Home() {
    // --- ZMIANA NA 5.0: Wyciągamy z hooka fetchGames i hasMore ---
    const { games, loading, buyGame, fetchGames, hasMore } = useGames();
    const router = useRouter();
    const { user, logout } = useAuth(); 
    const { cart, dispatch, totalPrice, totalItems } = useCart();
    
    // --- STANY FILTRÓW (React useState) ---
    const [search, setSearch] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [type, setType] = useState('');
    const [players, setPlayers] = useState('');
    const [playTime, setPlayTime] = useState('');
    const [publisher, setPublisher] = useState('');


    const safeGames = Array.isArray(games) ? games : [];
    
    // --- LOGIKA FILTROWANIA z USEMEMO---
    const filteredGames = useMemo(() => {
        return safeGames.filter(game => {
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
    }, [safeGames, search, maxPrice, type, players, playTime, publisher]);

    //EKRAN ŁADOWANIA
    if (loading && games.length === 0) return <div className="p-10 text-center text-xl text-gray-900">Ładowanie gier z chmury... 🎲</div>;


    // --- ŁATKA NA OBRAZKI ---
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
            <header className="bg-[#2c3e50] text-white py-4 px-6 md:px-10 flex justify-between items-center flex-wrap gap-4 shadow-md">
                <h1 className="text-2xl tracking-wide font-bold">
                    <Link href="/">Mityczny Pionek 🎲</Link>
                </h1>
                <div className="flex gap-3 text-sm md:text-base items-center">
                    {user ? (
                        <button 
                            onClick={logout} 
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
                        >
                            Wyloguj ({user.email || 'Użytkownik'})
                        </button>
                    ) : (
                        <Link 
                            href="/login" 
                            className="bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold py-2 px-4 rounded transition inline-block"
                        >
                            Zaloguj
                        </Link>
                    )}
                    <Link 
                        href="/cart" 
                        className="bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold py-2 px-4 rounded transition flex items-center gap-1.5 shadow-sm shadow-black/10"
                    >
                        🛒 <span className="font-bold">{totalPrice} zł</span> ({totalItems} szt.)
                    </Link>
                    <Link href="/add" className="bg-[#e67e22] hover:bg-[#d35400] text-white font-semibold py-2 px-4 rounded transition">+ Dodaj pozycję</Link>
                </div>
            </header>

            <div className="flex flex-col md:flex-row p-6 md:p-10 gap-6">
                
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
                            {/* --- ZMIANA NA 5.0: Wyświetlamy bezpośrednio filteredGames --- */}
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
                                            <img 
                                                src={imageUrl} 
                                                alt={game.title}
                                                className="max-h-full max-w-full object-contain"
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Brak+Zdjecia'}
                                            />
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
                                            {/* 2. PRZYCISK KOSZYKA: Zmieniony napis i tylko on dodaje do koszyka */}
                                            <button 
                                                disabled={isSold}
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    dispatch({ type: 'ADD', payload: game }); 
                                                    alert(`Dodano "${game.title}" do koszyka!`);
                                                }}
                                                className={`font-bold py-2 px-1 rounded transition flex-1 text-xs text-center
                                                    ${isSold ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-[#3498db] hover:bg-[#2980b9] text-white shadow-sm'}`}
                                            >
                                                {isSold ? 'Brak' : 'Do koszyka'}
                                            </button>

                                            {/* 2. PRZYCISK KUP TERAZ (Zielony - blokuje grę) */}
                                            <button 
                                                disabled={isSold}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    buyGame(game.id); // <-- Uruchamia funkcję z Firebase zmieniającą isSold na true
                                                }}
                                                className={`font-bold py-2 px-1 rounded transition flex-1 text-xs text-center
                                                    ${isSold ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-[#27ae60] hover:bg-[#219653] text-white shadow-sm'}`}
                                            >
                                                {isSold ? 'Sprzedane' : 'Kup Teraz'}
                                            </button>
                                            
                                            {/* 3. PRZYCISK EDYCJI (Szary) */}
                                            <button 
                                                disabled={isSold}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/edit/${game.id}`);
                                                }}
                                                className={`font-bold py-2 px-1 rounded transition flex-1 text-xs text-center border 
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

                    {/* --- PAGINACJA SERWEROWA FIREBASE */}
                    {hasMore && filteredGames.length > 0 && search === '' && (
                        <div className="mt-10 flex justify-center pb-10">
                            <button 
                                onClick={() => fetchGames(true)} 
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