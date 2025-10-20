'use client';
import styles from './Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from "next-auth/react";
import { IoSearch, IoNotificationsOutline } from 'react-icons/io5';

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logoContainer}>
        <Image 
          src="/images/logo.png"
          alt="GigaEsports Logo"
          width={40}
          height={40}
        />
        <span className={styles.logoText}>GigaEsports</span>
      </Link>

      <ul className={styles.links}>
        <li><Link href="/" className={pathname === '/' ? styles.activeLink : ''}>Home</Link></li>
        <li><Link href="/schedules" className={pathname === '/schedules' ? styles.activeLink : ''}>Schedules</Link></li>
        <li><Link href="/tournaments" className={pathname === '/tournaments' ? styles.activeLink : ''}>Tournaments</Link></li>
        <li><Link href="/news" className={pathname === '/news' ? styles.activeLink : ''}>News</Link></li> {/* <-- NEWS LINK ADDED */}
        <li><Link href="/bgmi" className={pathname === '/bgmi' ? styles.activeLink : ''}>BGMI</Link></li>
        <li><Link href="/creators" className={pathname === '/creators' ? styles.activeLink : ''}>Creators</Link></li>
        <li><Link href="/highlights" className={pathname === '/highlights' ? styles.activeLink : ''}>Highlights</Link></li>
      </ul>

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