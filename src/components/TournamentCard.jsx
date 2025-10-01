import styles from './TournamentCard.module.css';
import Image from 'next/image';

const TournamentCard = ({ tournament }) => {
  // Helper to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Image 
          src={tournament.league.image_url || '/images/default-league-logo.png'}
          alt={tournament.league.name}
          width={50}
          height={50}
          className={styles.leagueLogo}
        />
        <div>
          <h3 className={styles.name}>{tournament.full_name}</h3>
          <p className={styles.leagueName}>{tournament.league.name}</p>
        </div>
      </div>
      <div className={styles.details}>
        <span>{tournament.videogame.name}</span>
        <span>•</span>
        <span>{formatDate(tournament.begin_at)} - {formatDate(tournament.end_at)}</span>
      </div>
    </div>
  );
};

export default TournamentCard;