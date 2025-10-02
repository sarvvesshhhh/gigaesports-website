'use client';

import useSWR from 'swr';
import MatchCard from './MatchCard';
import styles from './LiveMatches.module.css';

const fetcher = url => fetch(url).then(res => res.json());

const LiveMatchesClient = ({ selectedGame }) => {
  const apiUrl = `/api/matches?game=${selectedGame}`;

  const { data: matches, error, isLoading } = useSWR(apiUrl, fetcher, {
    refreshInterval: 15000,
  });

  if (isLoading) return <p className={styles.noMatchesText}>Loading matches...</p>;
  if (error || !Array.isArray(matches)) return <p className={styles.noMatchesText}>Could not fetch matches.</p>;

  const liveMatches = matches.filter(match => match.status === 'running');
  const upcomingMatches = matches.filter(match => match.status === 'not_started');

  return (
    <section className={styles.liveMatchesSection}>
      <h2>Live Matches</h2>
      {liveMatches.length > 0 ? (
        <div className={styles.matchesGrid}>
          {liveMatches.map((match) => <MatchCard key={match.id} match={match} />)}
        </div>
      ) : (
        <p className={styles.noMatchesText}>No live matches currently in progress.</p>
      )}

      <h2 className={styles.upcomingTitle}>Upcoming Matches</h2>
      {upcomingMatches.length > 0 ? (
        <div className={styles.matchesGrid}>
          {upcomingMatches.map((match) => <MatchCard key={match.id} match={match} />)}
        </div>
      ) : (
         <p className={styles.noMatchesText}>No upcoming matches found for this game.</p>
      )}
    </section>
  );
};

export default LiveMatchesClient;