'use client';
import { useState, useEffect } from 'react';
import styles from './SearchPage.module.css';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const performSearch = async () => {
        setIsLoading(true);
        const response = await fetch(`/api/search?q=${query}`);
        const data = await response.json();
        setResults(data);
        setIsLoading(false);
      };
      performSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className={styles.page}>
      <input 
        type="search"
        placeholder="Search for teams or players..."
        className={styles.searchInput}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className={styles.resultsContainer}>
        {isLoading && <p>Searching...</p>}
        {results.map(({ node }) => (
          <Link href={`/teams/${node.id.split(':').pop()}?name=${node.name || node.nickname}`} key={node.id} className={styles.resultItem}>
            {node.name || node.nickname}
          </Link>
        ))}
      </div>
    </div>
  );
}