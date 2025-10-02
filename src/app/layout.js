import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Provider from './Provider'; // <-- 1. IMPORT

// ... (metadata) ...

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider> {/* <-- 2. WRAP WITH PROVIDER */}
          <Navbar />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}