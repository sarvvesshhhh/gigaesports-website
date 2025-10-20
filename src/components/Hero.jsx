import styles from './Hero.module.css';
import Link from 'next/link';

const Hero = ({ featuredMatch }) => {
  // Use the featured match data, or fall back to defaults
  const title = featuredMatch?.league?.name || 'The Ultimate Esports Experience';
  const subtitle = featuredMatch?.name || 'Live schedules, real-time scores, and more.';
  const backgroundImageUrl = featuredMatch?.league?.image_url || '/images/hero-background.jpg';

  return (
    // The style now dynamically sets the background image
    <section className={styles.hero} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${backgroundImageUrl})`}}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.buttons}>
          <Link href="/schedules?status=live" className={styles.primaryButton}>
            Watch Live
          </Link>
          <Link href="/schedules" className={styles.secondaryButton}>
            View Schedule
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;