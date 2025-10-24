'use client';

import Link from 'next/link';
import LiveMatchesClient from '../../components/LiveMatchesClient';
import styles from './SchedulesPage.module.css';
import { useSearchParams } from 'next/navigation';

const gameFilters = [
  { id: 'all', name: 'All Games' },
  { id: 'cs-go', name: 'Counter-Strike' },
  { id: 'valorant', name: 'Valorant' },
  { id: 'dota-2', name: 'Dota 2' },
  { id: 'lol', name: 'League of Legends' },
];

export default function SchedulesClientPage() {
  const searchParams = useSearchParams();
  const selectedGame = searchParams.get('game') || 'all';

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Matches & Schedules</h1>
      <div className={styles.viewPastLink}>
        <Link href="/matches/past">View Recent Results →</Link>
      </div>
      <nav className={styles.gameNav}>
        {gameFilters.map(filter => (
          <Link
            key={filter.id}
            href={`/schedules?game=${filter.id}`}
            className={`${styles.gameLink} ${filter.id === selectedGame ? styles.activeGame : ''}`}
          >
            {filter.name}
          </Link>
        ))}
      </nav>
      <LiveMatchesClient selectedGame={selectedGame} />
    </div>
  );
}