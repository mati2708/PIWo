"use client";
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGames } from '@/hooks/useGames';
import { useAuth } from '@/context/AuthContext';

export default function GameDetails() {
    const params = useParams();
    const { games, loading, placeBid } = useGames();
    const { user } = useAuth();
    
    const [bidAmount, setBidAmount] = useState('');
    const [message, setMessage] = useState(null);

    if (loading) return <div className="p-10 text-center text-gray-900">Ładowanie szczegółów... 🎲</div>;

    const game = games.find(g => g.id.toString() === params.id);
    if (!game) return <div className="p-10 text-center text-red-500 font-bold text-xl">Nie znaleziono gry.</div>;

    const currentPrice = game.auction?.current_bid || game.price_pln;

    const handleBid = async (e) => {
        e.preventDefault();
        setMessage(null);
        const result = await placeBid(game.id, bidAmount);
        setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
        if(result.success) setBidAmount('');
    };

    const imageUrl = game.images?.[0] ? `https://szandala.github.io/piwo-api/${game.images[0].replace('img/', 'images/board-games/')}` : 'https://via.placeholder.com/400';

    return (
        <div className="max-w-4xl mx-auto p-8 bg-[#f8f9fa] min-h-screen text-gray-800">
            <Link href="/" className="text-[#3498db] hover:underline mb-6 inline-block font-bold">&larr; Powrót</Link>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-100">
                <div className="w-full md:w-1/2 p-8 flex justify-center items-center bg-gray-50 border-r border-gray-100">
                    <img src={imageUrl} alt={game.title} className="max-h-[400px] object-contain drop-shadow-lg rounded" />
                </div>
                
                <div className="p-8 md:w-1/2 flex flex-col">
                    <h1 className="text-3xl font-bold mb-2 text-[#2c3e50]">{game.title}</h1>
                    
                    <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm">
                        <p className="font-bold text-yellow-700 flex items-center gap-2 mb-2">
                            <span>🔨</span> Trwa licytacja (Transakcja ACID)
                        </p>
                        <p className="text-gray-700">Aktualna cena: <strong className="text-2xl text-yellow-800">{currentPrice} zł</strong></p>
                        {game.auction?.highest_bidder_email && (
                            <p className="text-xs text-gray-500 mt-1">Prowadzi: {game.auction.highest_bidder_email}</p>
                        )}
                        
                        {/* FORMULARZ LICYTACJI */}
                        {user ? (
                            <form onSubmit={handleBid} className="mt-4 flex gap-2">
                                <input 
                                    type="number" 
                                    step="1" 
                                    min={currentPrice + 1} 
                                    value={bidAmount} 
                                    onChange={(e) => setBidAmount(e.target.value)} 
                                    placeholder="Wpisz kwotę..."
                                    className="p-2 border border-gray-300 rounded focus:border-[#3498db] outline-none text-gray-900 w-full"
                                    required
                                />
                                <button type="submit" className="bg-[#e67e22] hover:bg-[#d35400] text-white font-bold py-2 px-4 rounded whitespace-nowrap">
                                    Podbij
                                </button>
                            </form>
                        ) : (
                            <p className="text-sm text-red-500 mt-3 font-semibold">Zaloguj się, aby licytować!</p>
                        )}

                        {message && (
                            <p className={`mt-3 text-sm font-bold ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                {message.text}
                            </p>
                        )}
                    </div>

                    <div className="text-gray-700 mb-6 leading-relaxed flex-grow">
                        {Array.isArray(game.description) ? game.description[0] : game.description}
                    </div>
                </div>
            </div>
        </div>
    );
}