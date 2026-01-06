'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [level, setLevel] = useState(1);

  // Fetch Real Level from Supabase
  useEffect(() => {
    if (!user) return;
    async function getLevel() {
      const { data } = await supabase.from('profiles').select('xp').eq('user_id', user.id).single();
      if (data) setLevel(Math.floor(data.xp / 100) + 1);
    }
    getLevel();
  }, [user]);

  return (
    <nav className={styles.navbar}>
      
      {/* 1. LOGO & BRAND */}
      <Link href="/" className={styles.brandWrapper}>
        <div className={styles.logoImage}>
            {/* Ensure you have a logo.png in public/images/ or change this path */}
            <Image src="/images/logo.png" alt="GigaLogo" width={50} height={50} /> 
        </div>
        <span className={styles.brandName}>GigaEsports</span>
      </Link>

      {/* 2. NAVIGATION LINKS (Restored Full List) */}
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
             {/* This wraps the name & level, making it clickable to go to /profile */}
             <Link href="/profile" className={styles.profileLink}>
               <span className={styles.username}>
                 {user.username || user.firstName}
               </span>
               <span className={styles.levelBadge}>LVL {level}</span>
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