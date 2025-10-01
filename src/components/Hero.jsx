import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          The Ultimate <span>Esports</span> Experience
        </h1>
        <p className={styles.subtitle}>
          Stay connected with live schedules, real-time scores, creator highlights, and instant notifications from the world of competitive gaming.
        </p>
        <div className={styles.buttons}>
          <button className={styles.primaryButton}>Watch Live</button>
          <button className={styles.secondaryButton}>View Schedule</button>
        </div>
        <div className={styles.stats}>
          <p><strong>2.4M</strong> Active Viewers</p>
          <p><strong>16</strong> Live Matches</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;