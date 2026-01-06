'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Youtube, Twitch, Instagram, Mail, ArrowRight, Globe, CheckCircle } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would normally send to an API
      setSubscribed(true);
      setTimeout(() => { setSubscribed(false); setEmail(''); }, 3000);
    }
  };

  return (
    <footer className={styles.footer}>
      {/* HOLOGRAPHIC GRID EFFECT */}
      <div className={styles.gridBg} />
      <div className={styles.glowLine} />

      <div className={styles.container}>
        
        <div className={styles.topSection}>
          
          {/* 1. BRAND COLUMN */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              {/* RESTORED YOUR LOGO IMAGE */}
              <div className={styles.logoBox}>
                 <Image src="/images/logo.png" alt="GigaEsports" width={50} height={50} className={styles.logoImg} />
              </div>
              <span className={styles.logoText}>GIGAESPORTS</span>
            </Link>
            <p className={styles.tagline}>
              Dominate the arena. The ultimate ecosystem for competitive intelligence, live stats, and esports culture.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialIcon} aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" className={styles.socialIcon} aria-label="YouTube"><Youtube size={18} /></a>
              <a href="#" className={styles.socialIcon} aria-label="Twitch"><Twitch size={18} /></a>
              <a href="#" className={styles.socialIcon} aria-label="Instagram"><Instagram size={18} /></a>
            </div>
          </div>

          {/* 2. LINKS COLUMNS */}
          <div className={styles.linksWrapper}>
            <div className={styles.linkGroup}>
              <h4 className={styles.colTitle}>PLATFORM</h4>
              <Link href="/tournaments">Tournaments</Link>
              <Link href="/schedules">Live Schedule</Link>
              <Link href="/bgmi">BGMI Points</Link>
              <Link href="/creators">Creators</Link>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.colTitle}>SUPPORT</h4>
              <Link href="#">Help Center</Link>
              <Link href="#">API Access</Link>
              <Link href="#">Contact Us</Link>
              <Link href="#">System Status <span className={styles.statusDot}>●</span></Link>
            </div>
          </div>

          {/* 3. NEWSLETTER (Functional) */}
          <div className={styles.newsletterCol}>
            <h4 className={styles.colTitle}>STAY AHEAD</h4>
            <p>Get daily match recaps and prediction tips delivered to your inbox.</p>
            
            <form onSubmit={handleSubscribe} className={styles.inputGroup}>
              <Mail className={styles.inputIcon} size={18} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={`${styles.subBtn} ${subscribed ? styles.successBtn : ''}`}>
                {subscribed ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
              </button>
            </form>
            {subscribed && <span className={styles.successMsg}>Welcome to the inner circle.</span>}
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            &copy; 2025 GigaEsports Inc. All rights reserved.
          </div>
          <div className={styles.legalLinks}>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <div className={styles.langSwitch}>
              <Globe size={14} /> <span>English (US)</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}