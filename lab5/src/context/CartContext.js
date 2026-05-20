"use client";
import { createContext, useReducer, useEffect, useContext, useState } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD': {
            const existingIndex = state.findIndex(item => item.id === action.payload.id);
            if (existingIndex > -1) {
                // Jeśli gra już jest w koszyku, zwiększamy jej ilość o 1
                const newState = [...state];
                newState[existingIndex] = {
                    ...newState[existingIndex],
                    quantity: newState[existingIndex].quantity + 1
                };
                return newState;
            }
            // Jeśli gry nie ma, dodajemy ją z ilością początkową 1
            return [...state, { ...action.payload, quantity: 1 }];
        }
        case 'REMOVE':
            return state.filter(item => item.id !== action.payload.id);
            
        case 'UPDATE_QUANTITY':
            // Aktualizujemy ilość dla konkretnego ID (pamiętając, by nie zejść poniżej 1)
            return state.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: Math.max(1, parseInt(action.payload.quantity) || 1) }
                    : item
            );
            
        case 'CLEAR':
            return [];
        case 'INIT':
            return action.payload;
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, []);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem('piwo-cart');
        if (savedCart) {
            try { dispatch({ type: 'INIT', payload: JSON.parse(savedCart) }); } catch (e) {}
        }
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem('piwo-cart', JSON.stringify(cart));
        }
    }, [cart, isHydrated]);

    // --- AUTOMATYCZNE OBLICZENIA (Zawsze świeże dzięki React) ---
    // Łączna liczba sztuk w koszyku
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Łączna wartość finansowa koszyka
    const totalPrice = cart.reduce((sum, item) => {
        const price = parseFloat(item.price_pln) || 0;
        return sum + (price * item.quantity);
    }, 0).toFixed(2); // Zaokrąglenie do 2 miejsc po przecinku

    return (
        <CartContext.Provider value={{ cart, dispatch, isHydrated, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);