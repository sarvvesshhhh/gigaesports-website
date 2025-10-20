'use client';

import { useState, useEffect } from 'react';
import TeamCard from '../../components/TeamCard';
import styles from './TeamsPage.module.css';

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // This hook runs whenever the user stops typing.
  useEffect(() => {
    // Don't search on initial load or if the term is too short.
    if (initialLoad || searchTerm.length < 2) {
      setResults([]);
      setInitialLoad(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const searchTeams = async () => {
        setIsLoading(true);
        const response = await fetch(`/api/teams/search?q=${searchTerm}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setResults(data);
        }
        setIsLoading(false);
      };
      searchTeams();
    }, 500); // Wait 500ms after user stops typing.

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, initialLoad]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Search Esports Teams</h1>

      <div className={styles.searchContainer}>
        <input
          type="search"
          placeholder="Start typing a team name (e.g., FaZe, Sentinels...)"
          className={styles.searchInput}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading && <p className={styles.loadingText}>Searching...</p>}
      
      <div className={styles.grid}>
        {!isLoading && results.length === 0 && searchTerm.length > 1 && (
          <p className={styles.noResultsText}>No teams found for "{searchTerm}"</p>
        )}
        {results.map(team => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}