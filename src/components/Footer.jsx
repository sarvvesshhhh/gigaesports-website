import styles from './Footer.module.css';
import Image from 'next/image';
import Link from 'next/link'; // Import the Link component
import { FaTwitter, FaYoutube, FaTwitch, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.infoSection}>
          <div className={styles.logoContainer}>
            <Image src="/images/logo.png" alt="GigaEsports Logo" width={50} height={50} />
            <span className={styles.logoText}>GigaEsports</span>
          </div>
          <p>Your ultimate destination for esports news, live matches, creator content, and gaming community updates.</p>
          <div className={styles.socialIcons}>
            {/* These are external links, so they remain as <a> tags */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            <a href="https://twitch.tv" target="_blank" rel="noopener noreferrer"><FaTwitch /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.linkColumn}>
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/schedules?status=live">Live Matches</Link></li>
              <li><Link href="/schedules">Tournament Schedule</Link></li>
              <li><Link href="/leaderboards">Leaderboards</Link></li>
              <li><Link href="/rankings">Team Rankings</Link></li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h3>Games</h3>
            <ul>
              <li><Link href="/schedules?game=valorant">Valorant</Link></li>
              <li><Link href="/schedules?game=cs-go">Counter-Strike 2</Link></li>
              <li><Link href="/schedules?game=lol">League of Legends</Link></li>
              <li><Link href="/schedules?game=dota-2">Dota 2</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.subscribeSection}>
          <h3>Stay Updated</h3>
          <p>Get the latest esports news and match notifications delivered to your inbox.</p>
          <form className={styles.subscribeForm}>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2025 GigaEsports.in. All rights reserved.</p>
        <div className={styles.legalLinks}>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;