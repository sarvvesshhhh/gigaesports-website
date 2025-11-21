import TournamentCard from '../../components/TournamentCard';
import styles from './TournamentsPage.module.css';
import MatchCard from '../../components/MatchCard';

async function getTournamentData() {
  if (!process.env.PANDASCORE_API_KEY) return [];
  
  const url = `https://api.pandascore.co/tournaments/upcoming?sort=begin_at&per_page=50&token=${process.env.PANDASCORE_API_KEY}`;
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return []; // Return empty instead of throwing
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getUpcomingMatches() {
    if (!process.env.PANDASCORE_API_KEY) return [];

    const url = `https://api.pandascore.co/matches/upcoming?sort=begin_at&per_page=5&token=${process.env.PANDASCORE_API_KEY}`;
    try {
        const response = await fetch(url, { next: { revalidate: 3600 } });
        if (!response.ok) return []; // Return empty instead of throwing
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function TournamentsPage() {
  const [tournaments, upcomingMatches] = await Promise.all([
    getTournamentData(),
    getUpcomingMatches()
  ]);

  // Handle cases where data is empty to prevent reduce errors
  const tournamentsByGame = Array.isArray(tournaments) ? tournaments.reduce((acc, tournament) => {
    const gameName = tournament.videogame.name;
    if (!acc[gameName]) {
      acc[gameName] = [];
    }
    acc[gameName].push(tournament);
    return acc;
  }, {}) : {};

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Upcoming Tournaments</h1>
      
      <div className={styles.mainLayout}>
        <div className={styles.mainContent}>
          {Object.keys(tournamentsByGame).length > 0 ? (
            Object.entries(tournamentsByGame).map(([gameName, gameTournaments]) => (
              <div key={gameName} className={styles.gameSection}>
                <h2 className={styles.gameTitle}>{gameName}</h2>
                <div className={styles.grid}>
                  {gameTournaments.map(tournament => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No upcoming tournaments found.</p>
          )}
        </div>

        <aside className={styles.sidebar}>
          <h2 className={styles.gameTitle}>Upcoming Matches</h2>
          <div className={styles.grid}>
            {Array.isArray(upcomingMatches) && upcomingMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}