"use client";
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { cart, dispatch, totalPrice, totalItems } = useCart();

    // Łatka naprawiająca ścieżki obrazków (taka sama jak na stronie głównej)
    const fixImagePath = (game) => {
        const apiBaseUrl = 'https://szandala.github.io/piwo-api/';
        if (game.id === 4) return apiBaseUrl + 'images/board-games/azul.webp';
        if (!game.images || game.images.length === 0) return 'https://via.placeholder.com/300';
        return apiBaseUrl + game.images[0].replace('img/', 'images/board-games/');
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 text-gray-800 font-sans min-h-screen bg-[#f8f9fa]">
            <Link href="/" className="text-[#3498db] hover:underline mb-6 inline-block font-bold">&larr; Powrót do sklepu</Link>
            
            <h1 className="text-3xl font-bold mb-8 text-[#2c3e50] border-b-2 pb-3 border-gray-200">Twój Koszyk 🛒</h1>

            {cart.length === 0 ? (
                <div className="bg-white p-10 rounded-lg shadow-sm text-center border border-gray-100">
                    <p className="text-xl text-gray-500 mb-4">Twój koszyk jest pusty. Czas dodać jakieś planszówki! 🎲</p>
                    <Link href="/" className="bg-[#3498db] text-white font-bold py-2 px-6 rounded hover:bg-[#2980b9] transition">Przeglądaj gry</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* LISTA PRODUKTÓW */}
                    {cart.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <img src={fixImagePath(item)} alt={item.title} className="w-16 h-16 object-contain bg-gray-50 p-1 rounded" />
                                <div>
                                    <h3 className="font-bold text-lg text-[#2c3e50]">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.price_pln} zł / szt.</p>
                                </div>
                            </div>

                            {/* ZMIANA ILOŚCI I USWANIE */}
                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-none pt-3 sm:pt-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-600">Ilość:</span>
                                    <button 
                                        onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } })}
                                        className="bg-gray-200 hover:bg-gray-300 px-2.5 py-1 rounded font-bold text-gray-700 text-sm transition"
                                    >-</button>
                                    <span className="w-8 text-center font-bold text-gray-900 bg-gray-50 py-1 rounded border border-gray-200 text-sm">{item.quantity}</span>
                                    <button 
                                        onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                                        className="bg-gray-200 hover:bg-gray-300 px-2.5 py-1 rounded font-bold text-gray-700 text-sm transition"
                                    >+</button>
                                </div>

                                <div className="text-right min-w-[80px]">
                                    <span className="font-bold text-lg text-[#27ae60]">{(item.price_pln * item.quantity).toFixed(2)} zł</span>
                                </div>

                                <button 
                                    onClick={() => dispatch({ type: 'REMOVE', payload: { id: item.id } })}
                                    className="text-red-500 hover:text-red-700 p-2 font-semibold transition text-sm"
                                >
                                    Usuń
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* PODSUMOWANIE NA DOLE */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="text-gray-600">Razem produktów: <strong className="text-gray-900">{totalItems} szt.</strong></p>
                            <p className="text-2xl font-bold text-[#2c3e50] mt-1">Suma do zapłaty: <span className="text-[#27ae60]">{totalPrice} zł</span></p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button 
                                onClick={() => { dispatch({ type: 'CLEAR' }); alert('Koszyk został wyczyszczony!'); }}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded font-semibold text-sm transition flex-1 sm:flex-none"
                            >
                                Wyczyść koszyk
                            </button>
                            <button 
                                onClick={() => alert('Dziękujemy za zamówienie! (To jest makieta systemu płatności)')}
                                className="bg-[#27ae60] hover:bg-[#219653] text-white px-6 py-3 rounded font-bold text-sm shadow transition flex-1 sm:flex-none text-center"
                            >
                                Przejdź do kasy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}