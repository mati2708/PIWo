"use client";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGames } from '@/hooks/useGames';

export default function GameDetails() {
    const params = useParams();
    const { games, loading } = useGames();

    if (loading) return <div className="p-10">Ładowanie...</div>;

    const safeGames = Array.isArray(games) ? games : [];
    const game = safeGames.find(g => g.id.toString() === params.id);

    if (!game) return <div className="p-10 text-red-500">Nie znaleziono gry.</div>;

    const apiBaseUrl = 'https://szandala.github.io/piwo-api/';
    const imageUrl = game.images && game.images.length > 0 ? apiBaseUrl + game.images[0] : 'https://via.placeholder.com/400?text=Brak+Zdjecia';

    return (
        <div className="max-w-4xl mx-auto p-8">
            <Link href="/" className="text-blue-500 hover:underline mb-6 block">&larr; Powrót do sklepu</Link>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
                <img 
                    src={imageUrl} 
                    alt={game.title}
                    className="w-full md:w-1/2 object-cover"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/400?text=Brak+Zdjecia'}
                />
                <div className="p-8 md:w-1/2">
                    <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
                    <p className="text-2xl text-green-600 font-bold mb-4">{game.price_pln} zł</p>
                    
                    <div className="text-gray-700 mb-6 leading-relaxed">
                        {Array.isArray(game.description) ? (
                            game.description.map((sentence, index) => <p key={index} className="mb-2">{sentence}</p>)
                        ) : (
                            <p>{game.description}</p>
                        )}
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded text-sm">
                        <p><strong>Kategoria:</strong> {game.type || 'Brak danych'}</p>
                        <p><strong>Liczba graczy:</strong> {game.min_players} - {game.max_players}</p>
                        <p><strong>Czas gry:</strong> {game.avg_play_time_minutes} min</p>
                        <p><strong>Wydawnictwo:</strong> {game.publisher}</p>
                    </div>

                    {game.auction && (
                        <div className="mt-4 bg-yellow-100 border border-yellow-400 p-3 rounded text-sm">
                            <p className="font-bold">⚠️ Ta gra bierze udział w licytacji!</p>
                            <p>Aktualna oferta: {game.auction.current_bid} zł</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}