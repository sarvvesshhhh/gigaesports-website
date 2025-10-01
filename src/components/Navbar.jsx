import styles from './Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link'; // Make sure Link is imported
import { IoSearch, IoNotificationsOutline } from 'react-icons/io5';
import { FaRegUserCircle } from 'react-icons/fa';

const Navbar = () => {
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
        <li><Link href="/">Home</Link></li>
        <li><Link href="/schedules">Schedules</Link></li>
        <li><Link href="/tournaments">Tournaments</Link></li>
        <li><Link href="/bgmi">BGMI</Link></li>
        <li><Link href="/creators">Creators</Link></li>
        <li><Link href="/highlights">Highlights</Link></li>
      </ul>

      <div className={styles.rightSection}>
        {/* ... your search bar and icons ... */}
      </div>
    </nav>
  );
};

export default Navbar;