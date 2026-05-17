"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
    const router = useRouter();
    
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isRegister) {
                await registerWithEmail(email, password);
            } else {
                await loginWithEmail(email, password);
            }
            router.push('/'); // Po sukcesie wracamy na stronę główną
        } catch (err) {
            setError('Błąd logowania. Sprawdź poprawność danych.');
            console.error(err);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            router.push('/');
        } catch (err) {
            setError('Błąd logowania przez Google.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">Mityczny Pionek 🎲</h1>
                    <p className="text-gray-600">{isRegister ? 'Załóż nowe konto' : 'Zaloguj się na swoje konto'}</p>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-bold mb-1 text-gray-700">Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded focus:border-[#3498db] outline-none text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 text-gray-700">Hasło</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded focus:border-[#3498db] outline-none text-gray-900" />
                    </div>
                    <button type="submit" className="bg-[#2c3e50] hover:bg-[#1a252f] text-white font-bold py-3 rounded transition mt-2">
                        {isRegister ? 'Zarejestruj się' : 'Zaloguj się'}
                    </button>
                </form>

                <div className="flex items-center gap-3 mb-6">
                    <hr className="flex-grow border-gray-200" />
                    <span className="text-gray-400 text-sm">LUB</span>
                    <hr className="flex-grow border-gray-200" />
                </div>

                <button onClick={handleGoogleLogin} className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded transition flex items-center justify-center gap-2 mb-4 shadow-sm">
                    🌐 Zaloguj przez Google
                </button>

                <p className="text-center text-sm text-gray-600">
                    {isRegister ? 'Masz już konto?' : 'Nie masz konta?'} 
                    <button onClick={() => setIsRegister(!isRegister)} className="text-[#3498db] font-bold ml-1 hover:underline">
                        {isRegister ? 'Zaloguj się' : 'Zarejestruj się'}
                    </button>
                </p>
                
                <div className="text-center mt-6">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">&larr; Wróć do sklepu</Link>
                </div>
            </div>
        </div>
    );
}