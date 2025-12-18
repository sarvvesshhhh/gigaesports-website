import styles from './Bgmi.module.css';
import manualHighlights from '../../data/bgmi_highlights.json'; // Import your manual data

// --- DATA FETCHING ---
async function getBgmiTournaments() {
  if (!process.env.PANDASCORE_API_KEY) return [];

  // Fetch PUBG Mobile tournaments (closest API match for BGMI)
  const url = `https://api.pandascore.co/pubg-mobile/tournaments?sort=-begin_at&per_page=10&token=${process.env.PANDASCORE_API_KEY}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("BGMI Fetch Error:", error);
    return [];
  }
}

export default async function BgmiPage() {
  const apiTournaments = await getBgmiTournaments();

  // MERGE: Manual Highlights first, then API data
  const allTournaments = [...manualHighlights, ...apiTournaments];

  return (
    <div className={styles.pageContainer}>
      
      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>BATTLEGROUNDS MOBILE INDIA</h1>
          <p className={styles.heroSubtitle}>
            Drop in. Survive. Dominate. The hub for Indian Esports action.
          </p>
          <div className={styles.badges}>
             <span className={styles.badge}>BATTLE ROYALE</span>
             <span className={styles.badge}>MOBILE</span>
          </div>
        </div>
        <div className={styles.zoneCircle}></div>
      </section>

      {/* 2. TOURNAMENTS LIST */}
      <div className={styles.contentContainer}>
        <h2 className={styles.sectionTitle}>Recent & Upcoming Events</h2>
        
        <div className={styles.tournamentList}>
          {allTournaments.length > 0 ? (
            allTournaments.map((tournament, index) => (
              <div 
                key={tournament.id || index} 
                className={`${styles.tournamentRow} ${tournament.is_official ? styles.officialRow : ''}`}
              >
                
                {/* Date & Status */}
                <div className={styles.dateCol}>
                  <span className={styles.date}>
                    {tournament.begin_at ? new Date(tournament.begin_at).toLocaleDateString() : 'TBA'}
                  </span>
                  <span className={`${styles.status} ${tournament.status === 'finished' || tournament.winner_id ? styles.finished : styles.upcoming}`}>
                    {tournament.status === 'running' ? 'LIVE' : (tournament.winner_id ? 'FINISHED' : 'UPCOMING')}
                  </span>
                </div>

                {/* Tournament Name */}
                <div className={styles.infoCol}>
                   <h3 className={styles.tourneyName}>
                     {tournament.name}
                     {tournament.is_official && <span className={styles.officialBadge}>OFFICIAL</span>}
                   </h3>
                   <span className={styles.leagueName}>{tournament.league?.name}</span>
                </div>

                {/* Winner / Prize */}
                <div className={styles.winnerCol}>
                  {tournament.winner_id ? (
                     <span className={styles.winnerLabel}>🏆 Winner Decided</span>
                  ) : (
                     <span className={styles.prizeLabel}>
                       {tournament.prizepool ? `Pool: ${tournament.prizepool}` : 'Prizepool: TBA'}
                     </span>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No active BGMI/PUBGM tournaments found.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}