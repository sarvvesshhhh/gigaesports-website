'use client';

import styles from './MatchCard.module.css';
import { FaRegClock } from 'react-icons/fa';
import Link from 'next/link';

const MatchCard = ({ match }) => {
  // Added extra ?. to safely access nested properties
  const team1 = match.opponents?.[0]?.opponent || { name: 'TBD', image_url: '/images/default-team-logo.png' };
  const team2 = match.opponents?.[1]?.opponent || { name: 'TBD', image_url: '/images/default-team-logo.png' };
  const score1 = match.results?.[0]?.score || 0;
  const score2 = match.results?.[1]?.score || 0;

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleString('en-US', options);
  };
  
  return (
    <Link href={`/matches/${match.id}`} className={styles.card}>
      <div className={styles.header}>
        <span className={`${styles.status} ${match.status === 'running' ? styles.live : styles.upcoming}`}>
          {match.status === 'not_started' ? 'UPCOMING' : match.status.toUpperCase()}
        </span>
        <span className={styles.game}>{match.videogame?.name || 'Game'}</span>
      </div>

      <div className={styles.teams}>
        <div className={styles.team}>
          <img src={team1.image_url || '/images/default-team-logo.png'} alt={team1.name} className={styles.teamLogo} />
          <span>{team1.name}</span>
          <strong>{score1}</strong>
        </div>
        <div className={styles.vs}>VS</div>
        <div className={styles.team}>
          <img src={team2.image_url || '/images/default-team-logo.png'} alt={team2.name} className={styles.teamLogo} />
          <span>{team2.name}</span>
          <strong>{score2}</strong>
        </div>
      </div>

      {match.status === 'not_started' && match.begin_at && (
        <div className={styles.footer}>
          <FaRegClock />
          <span>{formatDateTime(match.begin_at)}</span>
        </div>
      )}
    </Link>
  );
};

export default MatchCard;