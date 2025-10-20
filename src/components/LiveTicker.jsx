import styles from './LiveTicker.module.css';
import Link from 'next/link';

const LiveTicker = ({ matches }) => {
  const liveMatches = matches.filter(match => match.status === 'running').slice(0, 3); // Show max 3 live matches

  if (liveMatches.length === 0) {
    return null; // Don't show the component if no matches are live
  }

  return (
    <div className={styles.ticker}>
      {liveMatches.map(match => (
        <Link href={`/matches/${match.id}?name=${encodeURIComponent(match.name)}`} key={match.id} className={styles.matchItem}>
          <span className={styles.liveIndicator}>LIVE</span>
          <span className={styles.teamName}>{match.opponents[0]?.opponent.name || 'TBD'}</span>
          <span className={styles.score}>{match.results[0]?.score || 0} - {match.results[1]?.score || 0}</span>
          <span className={styles.teamName}>{match.opponents[1]?.opponent.name || 'TBD'}</span>
          <span className={styles.gameName}>{match.videogame.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default LiveTicker;