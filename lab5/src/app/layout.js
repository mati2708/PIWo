import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext'; // <-- DODAJ TO

export const metadata = {
  title: 'Mityczny Pionek',
  description: 'Sklep z grami planszowymi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body suppressHydrationWarning>
        <AuthProvider>
          {/* Owiń aplikację nowym CartProviderem */}
          <CartProvider> 
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}