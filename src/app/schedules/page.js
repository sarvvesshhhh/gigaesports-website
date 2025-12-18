import MatchCard from '../../components/MatchCard';
import styles from './SchedulesPage.module.css';

// --- ROBUST DATA FETCHING ---
async function getScheduleData() {
  if (!process.env.PANDASCORE_API_KEY) return [];

  // Fetch upcoming matches (increase limit to fill a few days)
  const url = `https://api.pandascore.co/matches/upcoming?sort=begin_at&per_page=50&token=${process.env.PANDASCORE_API_KEY}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Schedule Fetch Error:", error);
    return [];
  }
}

// Helper to format dates nicely (e.g., "Tuesday, Dec 19")
function formatDateHeader(dateString) {
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export default async function SchedulesPage() {
  const matches = await getScheduleData();

  // GROUP MATCHES BY DATE
  const matchesByDate = Array.isArray(matches) ? matches.reduce((acc, match) => {
    // Get YYYY-MM-DD from the begin_at string
    const dateKey = match.begin_at ? match.begin_at.split('T')[0] : 'TBA';
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(match);
    return acc;
  }, {}) : {};

  // Sort dates to ensure chronological order
  const sortedDates = Object.keys(matchesByDate).sort();

  return (
    <div className={styles.pageContainer}>
      
      {/* 1. HEADER SECTION */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>MATCH SCHEDULE</h1>
          <p className={styles.pageSubtitle}>
            Track every game. Never miss a moment.
          </p>
        </div>
      </header>

      {/* 2. TIMELINE CONTENT */}
      <div className={styles.timelineLayout}>
        {sortedDates.length > 0 ? (
          sortedDates.map(date => (
            <section key={date} className={styles.daySection}>
              {/* Sticky Date Header */}
              <div className={styles.dateHeader}>
                <div className={styles.dateBadge}>
                  {formatDateHeader(date)}
                </div>
                <div className={styles.line}></div>
              </div>

              {/* Grid of Matches for this Day */}
              <div className={styles.matchesGrid}>
                {matchesByDate[date].map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className={styles.emptyState}>
            <h2>No scheduled matches found</h2>
            <p>Check back later for updates.</p>
          </div>
        )}
      </div>

    </div>
  );
}