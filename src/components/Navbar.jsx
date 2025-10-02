'use client';
import styles from './Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { IoSearch, IoNotificationsOutline } from 'react-icons/io5';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className={styles.navbar}>
      {/* --- LOGO --- */}
      <Link href="/" className={styles.logoContainer}>
        <Image 
          src="/images/logo.png"
          alt="GigaEsports Logo"
          width={40}
          height={40}
        />
        <span className={styles.logoText}>GigaEsports</span>
      </Link>

      {/* --- NAVIGATION LINKS (This is the missing part) --- */}
      <ul className={styles.links}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/schedules">Schedules</Link></li>
        <li><Link href="/tournaments">Tournaments</Link></li>
        <li><Link href="/bgmi">BGMI</Link></li>
        <li><Link href="/creators">Creators</Link></li>
        <li><Link href="/highlights">Highlights</Link></li>
      </ul>

      {/* --- RIGHT SECTION --- */}
      <div className={styles.rightSection}>
        <div className={styles.searchBar}>
          <IoSearch className={styles.searchIcon} />
          <input type="text" placeholder="Search games, teams..." />
        </div>
        <div className={styles.userIcons}>
          <IoNotificationsOutline size={24} />
          {session ? (
            <>
              <Link href="/profile">
                <Image src={session.user.image} alt={session.user.name} width={30} height={30} style={{ borderRadius: '50%', cursor: 'pointer' }} />
              </Link>
              <button onClick={() => signOut()} className={styles.authButton}>Sign Out</button>
            </>
          ) : (
            <button onClick={() => signIn('google')} className={styles.authButton}>Sign In</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;