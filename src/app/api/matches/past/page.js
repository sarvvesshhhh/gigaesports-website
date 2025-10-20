import MatchCard from '../../../components/MatchCard';
import styles from '../../schedules/SchedulesPage.module.css'; // We can reuse styles

async function getPastMatches() {
  // Using PandaScore's /matches/past endpoint
  const url = `https://api.pandascore.co/matches/past?sort=-end_at&per_page=20&token=${process.env.PANDASCORE_API_KEY}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Re-fetch every hour
    if (!response.ok) throw new Error('Failed to fetch past matches');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function PastMatchesPage() {
  const pastMatches = await getPastMatches();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Recent Match Results</h1>
      <div className={styles.grid}>
        {pastMatches.length > 0 ? (
          pastMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))
        ) : (
          <p>No recent matches found.</p>
        )}
      </div>
    </div>
  );
}