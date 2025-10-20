import styles from './MatchInfo.module.css';
import Image from 'next/image';

const MatchInfo = ({ match }) => {
  const team1 = match.opponents?.[0]?.opponent || { name: 'TBD' };
  const team2 = match.opponents?.[1]?.opponent || { name: 'TBD' };
  
  return (
    <div className={styles.matchInfo}>
      <div className={styles.teamsHeader}>
        <div className={styles.team}>
          <Image src={team1.image_url || '/images/default-team-logo.png'} alt={team1.name} width={24} height={24} />
          <span>{team1.name}</span>
        </div>
        <div className={styles.team}>
          <Image src={team2.image_url || '/images/default-team-logo.png'} alt={team2.name} width={24} height={24} />
          <span>{team2.name}</span>
        </div>
      </div>
      <div className={styles.games}>
        {match.games.map((game, index) => (
          <div key={game.id || index} className={styles.gameRow}>
            <span>Game {index + 1}</span>
            <div className={styles.scores}>
              <span className={game.winner?.id === team1.id ? styles.winner : ''}>{game.results[0]?.score || 0}</span>
              <span>-</span>
              <span className={game.winner?.id === team2.id ? styles.winner : ''}>{game.results[1]?.score || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchInfo;