import Image from 'next/image';
import styles from './MatchPage.module.css';

async function getMatchDetails(id) {
  const apiKey = `token=${process.env.PANDASCORE_API_KEY}`;
  const baseUrl = 'https://api.pandascore.co';
  let finalData = {};

  const liveResponse = await fetch(`${baseUrl}/lives/matches/${id}?${apiKey}`, { next: { revalidate: 10 } });

  if (liveResponse.ok) {
    const liveData = await liveResponse.json();
    if (liveData.match) {
        finalData = { ...liveData.match, ...liveData };
        return finalData;
    }
  }
  
  const matchResponse = await fetch(`${baseUrl}/matches/${id}?${apiKey}`, { next: { revalidate: 60 } });

  if (!matchResponse.ok) {
    throw new Error('Failed to fetch match details from both endpoints');
  }
  return await matchResponse.json();
}

export default async function MatchPage({ params }) {
  try {
    const match = await getMatchDetails(params.id);

    if (!match) {
      return <p className={styles.error}>Could not load match details.</p>;
    }

    const team1 = match.opponents?.[0]?.opponent || { name: 'TBD', image_url: null };
    const team2 = match.opponents?.[1]?.opponent || { name: 'TBD', image_url: null };

    const seriesScore1 = match.results?.[0]?.score || 0;
    const seriesScore2 = match.results?.[1]?.score || 0;
    
    const winnerId = match.winner_id;
    const team1Id = match.opponents?.[0]?.opponent?.id;
    
    const team1IsWinner = winnerId === team1Id;
    const team2IsWinner = winnerId && winnerId !== team1Id;

    const tally1 = Array(seriesScore1).fill(1);
    const tally2 = Array(seriesScore2).fill(1);

    const gameScore1 = match.scores?.score_team_1 ?? seriesScore1;
    const gameScore2 = match.scores?.score_team_2 ?? seriesScore2;

    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h2>{match.league?.name || 'Match Details'}</h2>
          <p>{match.videogame?.name} - Best of {match.number_of_games}</p>
        </div>
        <div className={styles.scoreboard}>
          <div className={styles.team}>
            <Image src={team1.image_url || '/images/default-team-logo.png'} alt={team1.name} width={150} height={150} />
            <span className={styles.teamName}>{team1.name}</span>
            <div className={styles.tally}>
              {tally1.map((_, i) => <div key={`t1-${i}`} className={team1IsWinner ? styles.tallyMarkWinner : styles.tallyMark}></div>)}
            </div>
          </div>
          <div className={styles.score}>
            {gameScore1} - {gameScore2}
            <span className={styles.status}>{match.status?.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div className={styles.team}>
            <Image src={team2.image_url || '/images/default-team-logo.png'} alt={team2.name} width={150} height={150} />
            <span className={styles.teamName}>{team2.name}</span>
            <div className={styles.tally}>
              {tally2.map((_, i) => <div key={`t2-${i}`} className={team2IsWinner ? styles.tallyMarkWinner : styles.tallyMark}></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <p className={styles.error}>Could not load match details. Please try again.</p>;
  }
}