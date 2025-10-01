import styles from './MatchCard.module.css';

const MatchCard = ({ match }) => {
  // This code is now structured to work with PandaScore's data
  const team1 = match.opponents[0]?.opponent || { name: 'TBD' };
  const team2 = match.opponents[1]?.opponent || { name: 'TBD' };
  const score1 = match.results[0]?.score || 0;
  const score2 = match.results[1]?.score || 0;
  
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={`${styles.status} ${match.status === 'running' ? styles.live : styles.upcoming}`}>
          {match.status === 'not_started' ? 'UPCOMING' : match.status.toUpperCase()}
        </span>
        <span className={styles.game}>{match.videogame.name}</span>
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
    </div>
  );
};

export default MatchCard;