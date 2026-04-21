"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGames } from '@/hooks/useGames';

export default function Home() {
    // customowy hook do pobierania gier z API/LocalStorage
    const { games, loading } = useGames();
    // hook Next.js do nawigacji pomiędzy podstronami
    const router = useRouter();
    
    // --- STANY FILTRÓW (React useState) ---
    const [search, setSearch] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [type, setType] = useState('');
    const [players, setPlayers] = useState('');
    const [playTime, setPlayTime] = useState('');
    const [publisher, setPublisher] = useState('');
    
    // --- STANY PAGINACJI ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Liczba gier wyświetlanych na jednej stronie

    // Automatyczny reset paginacji: wraca na 1 stronę, gdy zmieniony zostanie jakikolwiek filtr
    useEffect(() => {
        setCurrentPage(1);
    }, [search, maxPrice, type, players, playTime, publisher]);

    // Ekran ładowania na czas "pobierania" danych
    if (loading) return <div className="p-10 text-center text-xl text-gray-900">Ładowanie gier... 🎲</div>;

    // Zabezpieczenie przed błędem "is not a function" - upewniamy się, że to tablica
    const safeGames = Array.isArray(games) ? games : [];
    
    // --- ZAAWANSOWANA LOGIKA FILTROWANIA ---
    // Funkcja filter() przechodzi przez każdą grę. Gra zostaje na liście tylko jeśli spełnia wszystkie warunki.
    const filteredGames = safeGames.filter(game => {
        const searchLower = search.toLowerCase();
        // Zabezpieczenie: opis z API to czasem tablica, a czasem zwykły tekst (string)
        const descText = Array.isArray(game.description) ? game.description.join(' ') : (game.description || '');
        
        // Szukaj w tytule lub opisie (jeśli pasek wyszukiwania jest pusty, ignoruj ten filtr)
        const matchSearch = !search || 
            (game.title && game.title.toLowerCase().includes(searchLower)) ||
            descText.toLowerCase().includes(searchLower);

        // Ograniczenie cenowe
        const matchPrice = !maxPrice || game.price_pln <= parseFloat(maxPrice);
        
        // Dopasowanie kategorii (np. 'rodzinna', 'strategiczna')
        const matchType = !type || (game.type && game.type.toLowerCase().includes(type.toLowerCase()));
        
        // Sprawdzenie, czy szukana liczba graczy mieści się w limitach zdefiniowanych w grze
        const matchPlayers = !players || (game.min_players <= parseInt(players) && game.max_players >= parseInt(players));
        
        // Ograniczenie czasowe (gry trwające TyleSamo lub Krócej)
        const matchPlayTime = !playTime || game.avg_play_time_minutes <= parseInt(playTime);
        
        // Dopasowanie nazwy wydawnictwa
        const matchPublisher = !publisher || (game.publisher && game.publisher.toLowerCase().includes(publisher.toLowerCase()));

        // Zwracamy true, tylko jeśli WSZYSTKIE powyższe zmienne to true
        return matchSearch && matchPrice && matchType && matchPlayers && matchPlayTime && matchPublisher;
    });

    // --- LOGIKA PAGINACJI ---
    // Obliczamy ile stron jest potrzebnych (sufit z dzielenia liczby gier przez limit na stronę)
    const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    // Wycinamy (slice) z pełnej listy tylko te gry, które mają pojawić się na obecnej stronie
    const currentGames = filteredGames.slice(startIndex, startIndex + itemsPerPage);

    // --- ŁATKA NA OBRAZKI (Fix dla JSON-a z API) ---
    const apiBaseUrl = 'https://szandala.github.io/piwo-api/';
    const fixImagePath = (game) => {
        // Ręczne poprawki na ewidentne błędy w JSON-ie dostarczonym na zajęcia
        if (game.id === 4) return apiBaseUrl + 'images/board-games/azul.webp';
        if (!game.images || game.images.length === 0) return 'https://via.placeholder.com/300?text=Brak+Zdjecia';
        
        const path = game.images[0];
        const fixes = {
            'img/catan2.webp': 'images/board-games/catan2.jpg',
            'img/pociagi-europa/webp': 'images/board-games/pociag-europa.webp',
            'img/pociagi-szwajcaria.webp': 'images/board-games/pociagi-szwajcaria.jpg'
        };
        if (fixes[path]) return apiBaseUrl + fixes[path];
        
        // Domyślna naprawa ścieżki (img/ -> images/board-games/)
        return apiBaseUrl + path.replace('img/', 'images/board-games/');
    };

    // --- KOMPONENT RYSOWANIA PAGINACJI (DRY - Don't Repeat Yourself) ---
    const renderPagination = () => {
        if (totalPages <= 1) return null; // Ukryj, jeśli jest tylko jedna strona
        return (
            <div className="flex justify-center items-center gap-4">
                <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="bg-[#2c3e50] text-white font-bold py-2 px-4 rounded disabled:opacity-30 transition"
                >
                    &laquo; Poprzednia
                </button>
                <span className="font-semibold text-gray-700 bg-white py-2 px-4 rounded shadow-sm border border-gray-200">
                    Strona {currentPage} z {totalPages}
                </span>
                <button 
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="bg-[#2c3e50] text-white font-bold py-2 px-4 rounded disabled:opacity-30 transition"
                >
                    Następna &raquo;
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-800 font-sans">
            {/* Sekcja: HEADER */}
            <header className="bg-[#2c3e50] text-white py-4 px-6 md:px-10 flex justify-between items-center flex-wrap gap-4 shadow-md">
                <h1 className="text-2xl tracking-wide font-bold">
                    <Link href="/">Mityczny Pionek 🎲</Link>
                </h1>
                <div className="flex gap-3 text-sm md:text-base">
                    <button className="bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold py-2 px-4 rounded transition">Zaloguj</button>
                    <button className="bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold py-2 px-4 rounded transition">🛒 (0)</button>
                    <Link href="/add" className="bg-[#e67e22] hover:bg-[#d35400] text-white font-semibold py-2 px-4 rounded transition">+ Dodaj pozycję</Link>
                </div>
            </header>

            {/* Sekcja: GŁÓWNY KONTENER (Sidebar + Content) */}
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
                    
                    {/* Reset filtrów poprzez wyczyszczenie stanów komponentu */}
                    <button 
                        onClick={() => {
                            setSearch(''); setMaxPrice(''); setType(''); setPlayers(''); setPlayTime(''); setPublisher('');
                        }} 
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition mt-2">
                        Wyczyść filtry
                    </button>
                </aside>

                <main className="flex-grow flex flex-col">
                    
                    {/* PAGINACJA GÓRNA */}
                    <div className="mb-6">
                        {renderPagination()}
                    </div>
                    
                    {/* Jeśli żaden produkt nie pasuje do filtrów, wyświetl komunikat */}
                    {filteredGames.length === 0 ? (
                        <div className="bg-white p-10 rounded-lg shadow-sm text-center">
                            <p className="text-xl text-gray-500">Nie znaleziono gier spełniających kryteria. 😢</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Renderowanie poszczególnych kart gier */}
                            {currentGames.map(game => {
                                const imageUrl = fixImagePath(game);
                                const shortDesc = Array.isArray(game.description) ? game.description[0] : game.description;
                                
                                return (
                                    <div 
                                        key={game.id} 
                                        onClick={() => router.push(`/game/${game.id}`)}
                                        className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition duration-200 cursor-pointer flex flex-col"
                                    >
                                        <div className="w-full h-48 flex justify-center items-center mb-4">
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
                                        
                                        <div className="text-xl font-bold text-[#27ae60] mb-4">{game.price_pln} zł</div>
                                        
                                        <div className="flex gap-2 mt-auto">
                                            <button 
                                                // e.stopPropagation() zapobiega aktywacji kliknięcia na główny kontener (tzw. event bubbling)
                                                onClick={(e) => e.stopPropagation()}
                                                className="bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold py-1.5 px-3 rounded transition flex-1 text-sm"
                                            >
                                                Do koszyka
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/edit/${game.id}`);
                                                }}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1.5 px-3 rounded transition flex-1 text-sm border border-gray-300"
                                            >
                                                Edytuj
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* PAGINACJA DOLNA */}
                    <div className="mt-8">
                        {renderPagination()}
                    </div>

                </main>
            </div>
        </div>
    );
}