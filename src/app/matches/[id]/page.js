import Image from 'next/image';
import styles from './MatchPage.module.css';

async function getMatchDetails(id) {
  const url = `https://api.pandascore.co/matches/${id}?token=${process.env.PANDASCORE_API_KEY}`;
  try {
    const response = await fetch(url, { next: { revalidate: 15 } });
    if (!response.ok) throw new Error('Failed to fetch match details');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function MatchPage({ params }) {
  const match = await getMatchDetails(params.id);

  if (!match) {
    return <p className={styles.error}>Could not load match details.</p>;
  }

  const team1 = match.opponents[0]?.opponent || { name: 'TBD' };
  const team2 = match.opponents[1]?.opponent || { name: 'TBD' };

  // V-- NEW SCORE LOGIC --V
  // Overall Series Score (e.g., 2-0)
  const seriesScore1 = match.results?.[0]?.score || 0;
  const seriesScore2 = match.results?.[1]?.score || 0;

  // Current In-Game Score (e.g., 11-6)
  const currentGame = match.games.find(g => g.status !== 'finished') || match.games[match.games.length - 1];
  const gameScore1 = currentGame?.results?.[0]?.score || 0;
  const gameScore2 = currentGame?.results?.[1]?.score || 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>{match.league.name}</h2>
        <p>{match.videogame.name} - {match.name}</p>
      </div>
      <div className={styles.scoreboard}>
        <div className={styles.team}>
          <Image src={team1.image_url || '/images/default-team-logo.png'} alt={team1.name} width={150} height={150} />
          <span className={styles.teamName}>{team1.name}</span>
          <span className={styles.seriesScore}>{seriesScore1}</span>
        </div>
        <div className={styles.score}>
          {gameScore1} - {gameScore2}
          <span className={styles.status}>{match.status.replace('_', ' ').toUpperCase()}</span>
        </div>
        <div className={styles.team}>
          <Image src={team2.image_url || '/images/default-team-logo.png'} alt={team2.name} width={150} height={150} />
          <span className={styles.teamName}>{team2.name}</span>
          <span className={styles.seriesScore}>{seriesScore2}</span>
        </div>
      </div>
    </div>
  );
}