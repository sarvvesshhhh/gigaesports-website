import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'; // Dark theme for the login modal
import './globals.css';
import Navbar from '../components/Navbar'; // Correct path to your component
import Footer from '../components/Footer';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#ff4655' }
      }}
    >
      <html lang="en">
        <body>
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}