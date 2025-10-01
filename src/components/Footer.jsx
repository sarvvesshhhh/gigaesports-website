import styles from './Footer.module.css';
import Image from 'next/image';
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
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaTwitch /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.linkColumn}>
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Live Matches</a></li>
              <li><a href="#">Tournament Schedule</a></li>
              <li><a href="#">Leaderboards</a></li>
              <li><a href="#">Team Rankings</a></li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h3>Games</h3>
            <ul>
              <li><a href="#">Valorant</a></li>
              <li><a href="#">Counter-Strike 2</a></li>
              <li><a href="#">League of Legends</a></li>
              <li><a href="#">Dota 2</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.subscribeSection}>
          <h3>Stay Updated</h3>
          <p>Get the latest esports news and match notifications delivered to your inbox.</p>
          <div className={styles.subscribeForm}>
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2025 GigaEsports.in. All rights reserved.</p>
        <div className={styles.legalLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;