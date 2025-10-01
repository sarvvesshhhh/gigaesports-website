import styles from './LiveMatches.module.css';
import MatchCard from './MatchCard';

const LiveMatches = ({ matches }) => {
  return (
    <section className={styles.liveMatchesSection}>
      <h2>Live Matches & Schedule</h2>
      <div className={styles.matchesGrid}>
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
};

export default LiveMatches;