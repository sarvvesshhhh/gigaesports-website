'use client';
import { useState } from 'react';
import styles from './ComparePage.module.css';
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false });

const ResultsDisplay = ({ stats, team1, team2 }) => (
  <div className={styles.results}>
    <div className={styles.statRow}>
      <div className={styles.statValue}>{stats.team1.recentWinRate}%</div>
      <div className={styles.statLabel}>Win Rate (Last 50)</div>
      <div className={styles.statValue}>{stats.team2.recentWinRate}%</div>
    </div>
    <div className={styles.statRow}>
      <div className={styles.statValue}>{stats.team1.totalWins}</div>
      <div className={styles.statLabel}>Total Wins</div>
      <div className={styles.statValue}>{stats.team2.totalWins}</div>
    </div>
    <div className={styles.statRow}>
      <div className={styles.statValue}>{stats.team1.h2hWins}</div>
      <div className={styles.statLabel}>Head-to-Head Wins</div>
      <div className={styles.statValue}>{stats.team2.h2hWins}</div>
    </div>
    <div className={styles.summary}>
      Based on their last {stats.team1.totalMatches} matches in this game, {team1.label} has a {stats.team1.recentWinRate}% win rate. In head-to-head matchups, {team1.label} has won {stats.team1.h2hWins} times versus {team2.label}'s {stats.team2.h2hWins}.
    </div>
  </div>
);

// Using GRID's official Title IDs
const gameOptions = [
  { value: '1', label: 'Counter-Strike' },
  { value: '2', label: 'Valorant' },
  { value: '5', label: 'League of Legends' },
  { value: '6', label: 'Dota 2' },
];

export default function ComparePage() {
  const [game, setGame] = useState(gameOptions[0]);
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadOptions = async (inputValue) => {
    if (inputValue.length < 2) return [];
    try {
      const response = await fetch(`/api/teams/search?q=${inputValue}&game_id=${game.value}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return [];
    }
  };

  const handleGameChange = (selectedGame) => {
    setGame(selectedGame);
    setTeam1(null);
    setTeam2(null);
    setStats(null);
  };
  
  const handleCompare = async () => {
    if (!team1 || !team2 || team1.value === team2.value) { return; }
    setIsLoading(true); setStats(null);
    const response = await fetch(`/api/h2h?team1_id=${team1.value}&team2_id=${team2.value}&game_id=${game.value}`);
    const data = await response.json();
    setStats(data); setIsLoading(false);
  };
  
  const selectStyles = {
    control: (base) => ({ ...base, backgroundColor: '#2a2a2a', borderColor: '#444', minWidth: '250px', boxShadow: 'none', '&:hover': { borderColor: '#666' } }),
    menu: (base) => ({ ...base, backgroundColor: '#2a2a2a' }),
    option: (base, { isFocused }) => ({ ...base, backgroundColor: isFocused ? '#e13737' : '#2a2a2a', color: 'white', ':active': { backgroundColor: '#c02a2a' } }),
    singleValue: (base) => ({ ...base, color: 'white' }),
    input: (base) => ({ ...base, color: 'white' }),
    placeholder: (base) => ({ ...base, color: '#a0a0a0' }),
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Head-to-Head Comparison</h1>
      <div className={styles.gameSelector}>
        <label>Select Game:</label>
        <Select options={gameOptions} defaultValue={gameOptions[0]} onChange={handleGameChange} styles={selectStyles} />
      </div>
      <div className={styles.selection}>
        <AsyncSelect key={`team1-${game.value}`} cacheOptions loadOptions={loadOptions} value={team1} onChange={setTeam1} placeholder="Search for Team 1..." styles={selectStyles} />
        <span className={styles.vs}>VS</span>
        <AsyncSelect key={`team2-${game.value}`} cacheOptions loadOptions={loadOptions} value={team2} onChange={setTeam2} placeholder="Search for Team 2..." styles={selectStyles} />
        <button onClick={handleCompare} disabled={isLoading} className={styles.button}>{isLoading ? '...' : 'Compare'}</button>
      </div>
      {isLoading && <p className={styles.loadingText}>Calculating stats...</p>}
      {stats && <ResultsDisplay stats={stats} team1={team1} team2={team2} />}
    </div>
  );
}