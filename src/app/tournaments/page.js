import TournamentCard from '../../components/TournamentCard';
import styles from './TournamentsPage.module.css';

async function getTournamentData() {
  // Using the PandaScore /tournaments/upcoming endpoint
  const url = `https://api.pandascore.co/tournaments/upcoming?sort=begin_at&per_page=12&token=${process.env.PANDASCORE_API_KEY}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Re-fetch every hour
    if (!response.ok) throw new Error('Failed to fetch tournaments');
    return await response.json();
  } catch (error) {
    console.error(error);
    return []; // Return an empty array on error
  }
}

export default async function TournamentsPage() {
  const tournaments = await getTournamentData();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Upcoming Tournaments</h1>
      <div className={styles.grid}>
        {tournaments.length > 0 ? (
          tournaments.map(tournament => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))
        ) : (
          <p>No upcoming tournaments found.</p>
        )}
      </div>
    </div>
  );
}