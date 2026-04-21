"use client";
import { useParams } from 'next/navigation'; // Hook do wyciągania parametrów z adresu URL
import Link from 'next/link';
import { useGames } from '@/hooks/useGames';

export default function GameDetails() {
    // Pobieramy ID gry z adresu (np. dla /game/1, params.id wyniesie "1")
    const params = useParams();
    const { games, loading } = useGames();

    if (loading) return <div className="p-10 text-center text-gray-900">Ładowanie szczegółów... 🎲</div>;

    const safeGames = Array.isArray(games) ? games : [];
    
    // Szukamy w tablicy gry, której ID dokładnie zgadza się z ID z URL-a
    // Używamy .toString(), ponieważ ID w obiekcie to liczba, a w URL to zawsze tekst
    const game = safeGames.find(g => g.id.toString() === params.id);

    // Jeśli użytkownik wpisze w adresie błędne ID
    if (!game) return <div className="p-10 text-center text-red-500 font-bold text-xl">Nie znaleziono gry o tym ID.</div>;

    // --- Łatka na błędne ścieżki zdjęć z JSON ---
    const apiBaseUrl = 'https://szandala.github.io/piwo-api/';
    const getFixedImageUrl = (gameObj) => {
        if (gameObj.id === 4) return apiBaseUrl + 'images/board-games/azul.webp';
        if (!gameObj.images || gameObj.images.length === 0) return 'https://via.placeholder.com/400?text=Brak+Zdjecia';
        
        const path = gameObj.images[0];
        const fixes = {
            'img/catan2.webp': 'images/board-games/catan2.jpg',
            'img/pociagi-europa/webp': 'images/board-games/pociag-europa.webp',
            'img/pociagi-szwajcaria.webp': 'images/board-games/pociagi-szwajcaria.jpg'
        };

        if (fixes[path]) return apiBaseUrl + fixes[path];
        return apiBaseUrl + path.replace('img/', 'images/board-games/');
    };

    const imageUrl = getFixedImageUrl(game);

    return (
        <div className="max-w-4xl mx-auto p-8 bg-[#f8f9fa] min-h-screen text-gray-800">
            {/* Nawigacja powrotna */}
            <Link href="/" className="text-[#3498db] hover:underline mb-6 inline-block font-bold">&larr; Powrót do sklepu</Link>
            
            {/* Główny kontener szczegółów */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-100">
                
                {/* Sekcja zdjęcia */}
                <div className="w-full md:w-1/2 p-8 flex justify-center items-center bg-gray-50 border-r border-gray-100">
                    <img 
                        src={imageUrl} 
                        alt={game.title}
                        className="max-h-[400px] object-contain drop-shadow-lg rounded"
                        // Fallback: jeśli zdjęcie całkowicie nie istnieje, załaduj placeholder
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400?text=Brak+Zdjecia'}
                    />
                </div>
                
                {/* Sekcja danych tekstowych */}
                <div className="p-8 md:w-1/2 flex flex-col">
                    <h1 className="text-3xl font-bold mb-2 text-[#2c3e50]">{game.title}</h1>
                    
                    {/* Cena bazowa (zmieniono margines z mb-6 na mb-4, żeby pole licytacji było bliżej) */}
                    <p className="text-2xl text-[#27ae60] font-bold mb-4">{game.price_pln} zł</p>
                    
                    {/* --- PRZENIESIONE: Warunkowe renderowanie bloku licytacji --- */}
                    {game.auction && (
                        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-sm text-gray-800 shadow-sm">
                            <p className="font-bold text-yellow-700 flex items-center gap-2">
                                <span>⚠️</span> Ta gra bierze udział w licytacji!
                            </p>
                            <p className="mt-1 text-gray-700">Aktualna oferta: <strong className="text-lg text-yellow-800">{game.auction.current_bid} zł</strong></p>
                        </div>
                    )}
                    
                    <div className="text-gray-700 mb-6 leading-relaxed flex-grow">
                        {/* Sprawdzamy, czy opis to tablica zdań (format z API), czy zwykły string */}
                        {Array.isArray(game.description) ? (
                            game.description.map((sentence, index) => <p key={index} className="mb-2">{sentence}</p>)
                        ) : (
                            <p>{game.description}</p>
                        )}
                    </div>
                    
                    {/* Skrócona specyfikacja */}
                    <div className="bg-gray-100 p-4 rounded text-sm text-gray-800 border border-gray-200">
                        <p className="mb-1"><strong>Kategoria:</strong> <span className="capitalize">{game.type || 'Brak danych'}</span></p>
                        <p className="mb-1"><strong>Liczba graczy:</strong> {game.min_players} - {game.max_players}</p>
                        <p className="mb-1"><strong>Czas gry:</strong> {game.avg_play_time_minutes} min</p>
                        <p><strong>Wydawnictwo:</strong> {game.publisher}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}