import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Provider from './Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GigaEsports',
  description: 'The Ultimate Esports Experience',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Navbar />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}