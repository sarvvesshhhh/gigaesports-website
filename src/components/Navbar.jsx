'use client';

import Link from 'next/link';
import Image from 'next/image'; // Import Image
import { UserButton, useUser } from "@clerk/nextjs";
import styles from './Navbar.module.css';

export default function Navbar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className={styles.navbar}>
      
      {/* 1. LOGO & BRAND */}
      <Link href="/" className={styles.brandWrapper}>
        {/* Replace '/logo.png' with your actual logo file name in the public folder */}
        <div className={styles.logoImage}>
            <Image src="/images/logo.png" alt="GigaLogo" width={50} height={50} /> 
        </div>
        <span className={styles.brandName}>GigaEsports</span>
      </Link>

      {/* 2. NAVIGATION LINKS */}
      <div className={styles.navLinks}>
        <Link href="/" className={styles.link}>Home</Link>
        <Link href="/schedules" className={styles.link}>Schedules</Link>
        <Link href="/tournaments" className={styles.link}>Tournaments</Link>
        <Link href="/news" className={styles.link}>News</Link>
        <Link href="/bgmi" className={styles.link}>BGMI</Link>
        <Link href="/creators" className={styles.link}>Creators</Link>
        <Link href="/highlights" className={styles.link}>Highlights</Link>
      </div>

      {/* 3. AUTH SECTION */}
      <div className={styles.authSection}>
        {isSignedIn ? (
          <div className={styles.userControls}>
             <Link href="/dashboard" className={styles.profileLink}>
               <span className={styles.username}>
                 {user.username || user.firstName}
               </span>
               <span className={styles.levelBadge}>LVL 1</span>
             </Link>
             <UserButton afterSignOutUrl="/"/>
          </div>
        ) : (
          <div className={styles.loginButtons}>
             <Link href="/sign-in" className={styles.loginBtn}>
               Sign In
             </Link>
          </div>
        )}
      </div>

    </nav>
  );
}