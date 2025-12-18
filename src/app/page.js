import MatchCard from '../components/MatchCard';
import styles from './page.module.css';

// --- DATA FETCHING FUNCTIONS ---

async function getPastMatches() {
  if (!process.env.PANDASCORE_API_KEY) return [];
  const url = `https://api.pandascore.co/matches/past?sort=-begin_at&per_page=5&token=${process.env.PANDASCORE_API_KEY}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch past matches:", error);
    return [];
  }
}

async function getUpcomingMatches() {
  if (!process.env.PANDASCORE_API_KEY) return [];
  const url = `https://api.pandascore.co/matches/upcoming?sort=begin_at&per_page=5&token=${process.env.PANDASCORE_API_KEY}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch upcoming matches:", error);
    return [];
  }
}

// --- MAIN UI COMPONENT ---

export default async function Home() {
  // Fetch data in parallel
  const [pastMatches, upcomingMatches] = await Promise.all([
    getPastMatches(),
    getUpcomingMatches()
  ]);

  // Use the first upcoming match as the "Featured" match, or null if none exist
  const featuredMatch = upcomingMatches.length > 0 ? upcomingMatches[0] : null;

  return (
    <div className={styles.container}>
      
      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            WELCOME TO <span className={styles.brand}>GIGAESPORTS</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Live Scores. Past Results. The Home of Competitive Gaming.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statVal}>{upcomingMatches.length}</span>
              <span className={styles.statLabel}>Live Matches</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statVal}>24/7</span>
              <span className={styles.statLabel}>Coverage</span>
            </div>
          </div>
        </div>
        
        {/* Background Glow Effect */}
        <div className={styles.heroGlow}></div>
      </section>

      {/* 2. MATCH DASHBOARD */}
      <div className={styles.dashboardGrid}>
        
        {/* Left Column: Upcoming Matches */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Upcoming Action</h2>
            <div className={styles.liveIndicator}>LIVE</div>
          </div>
          <div className={styles.cardList}>
            {upcomingMatches.length > 0 ? (
              upcomingMatches.slice(0, 3).map(match => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <p style={{color: '#666'}}>No upcoming matches scheduled.</p>
            )}
          </div>
        </section>

        {/* Right Column: Recent Results */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Recent Results</h2>
          </div>
          <div className={styles.cardList}>
            {pastMatches.length > 0 ? (
              pastMatches.slice(0, 5).map(match => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <p style={{color: '#666'}}>No recent matches found.</p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}