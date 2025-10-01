import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // <-- 1. IMPORT THE FOOTER

export const metadata = {
  title: 'GigaEsports',
  description: 'The Ultimate Esports Experience',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer /> {/* <-- 2. ADD THE FOOTER COMPONENT HERE */}
      </body>
    </html>
  );
}