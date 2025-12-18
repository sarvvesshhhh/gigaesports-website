import TournamentCard from '../../components/TournamentCard';
import MatchCard from '../../components/MatchCard';
import styles from './TournamentsPage.module.css';

// --- ROBUST DATA FETCHING ---
async function getTournamentData() {
  if (!process.env.PANDASCORE_API_KEY) return [];
  
  // Fetch slightly more to ensure we have enough for groups
  const url = `https://api.pandascore.co/tournaments/upcoming?sort=begin_at&per_page=50&token=${process.env.PANDASCORE_API_KEY}`;
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Tournaments Fetch Error:", error);
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
        console.error("Matches Fetch Error:", error);
        return [];
    }
}

// --- MAIN COMPONENT ---
export default async function TournamentsPage() {
  const [tournaments, upcomingMatches] = await Promise.all([
    getTournamentData(),
    getUpcomingMatches()
  ]);

  // Group tournaments by Game Name (e.g., "Valorant", "CS:GO")
  const tournamentsByGame = Array.isArray(tournaments) ? tournaments.reduce((acc, tournament) => {
    const gameName = tournament.videogame.name;
    if (!acc[gameName]) {
      acc[gameName] = [];
    }
    acc[gameName].push(tournament);
    return acc;
  }, {}) : {};

  return (
    <div className={styles.pageContainer}>
      
      {/* 1. HERO HEADER */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>TOURNAMENTS</h1>
          <p className={styles.pageSubtitle}>
            Browse upcoming events across all major esports titles.
          </p>
        </div>
        <div className={styles.headerBg}></div>
      </header>

      <div className={styles.mainLayout}>
        
        {/* 2. MAIN CONTENT: Tournaments Grouped by Game */}
        <div className={styles.contentColumn}>
          {Object.keys(tournamentsByGame).length > 0 ? (
            Object.entries(tournamentsByGame).map(([gameName, gameTournaments]) => (
              <section key={gameName} className={styles.gameSection}>
                <div className={styles.sectionTitleRow}>
                  <h2 className={styles.gameTitle}>{gameName}</h2>
                  <span className={styles.eventCount}>{gameTournaments.length} Events</span>
                </div>
                <div className={styles.cardsGrid}>
                  {gameTournaments.map(tournament => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No upcoming tournaments found at the moment.</p>
            </div>
          )}
        </div>

        {/* 3. SIDEBAR: Quick Live Matches */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Live & Upcoming</h3>
          </div>
          <div className={styles.sidebarGrid}>
            {Array.isArray(upcomingMatches) && upcomingMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}