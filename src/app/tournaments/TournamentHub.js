'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trophy, Calendar, MapPin, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './tournaments.module.css';

const containerVar = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVar = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const GAMES = [
  { id: 'all', name: 'All Games' },
  { id: 'valorant', name: 'Valorant' },
  { id: 'cs-go', name: 'CS2' },
  { id: 'league-of-legends', name: 'LoL' },
  { id: 'dota-2', name: 'Dota 2' },
  { id: 'pubg', name: 'PUBG' },
];

export default function TournamentHub({ tournaments }) {
  const [activeGame, setActiveGame] = useState('all');
  const [search, setSearch] = useState('');

  // FILTER LOGIC
  const filtered = tournaments.filter(t => {
    const matchesGame = activeGame === 'all' || t.videogame.slug === activeGame;
    const matchesSearch = t.full_name.toLowerCase().includes(search.toLowerCase()) || 
                          t.league.name.toLowerCase().includes(search.toLowerCase());
    return matchesGame && matchesSearch;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.ambientMesh} />
      
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>GLOBAL TOURNAMENTS</h1>
          <p className={styles.subtitle}>Track every major league, season, and championship worldwide.</p>
        </div>
        
        <div className={styles.controls}>
          {/* SEARCH */}
          <div className={styles.searchBox}>
            <Search size={18} color="#666" />
            <input 
              type="text" 
              placeholder="Search leagues..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* GAME TABS */}
          <div className={styles.tabs}>
            {GAMES.map(g => (
              <button 
                key={g.id} 
                className={`${styles.tab} ${activeGame === g.id ? styles.activeTab : ''}`}
                onClick={() => setActiveGame(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* GRID */}
      <motion.div 
        className={styles.grid}
        variants={containerVar}
        initial="hidden"
        animate="show"
      >
        {filtered.length > 0 ? filtered.map(t => (
          <motion.div key={t.id} variants={itemVar} className={styles.card}>
            <Link href={`/tournaments/${t.id}`} className={styles.cardLink}>
              
              {/* STATUS BADGE */}
              <div className={styles.cardHeader}>
                {t.status === 'live' ? (
                  <span className={styles.liveBadge}><span className={styles.dot}></span> LIVE</span>
                ) : (
                  <span className={styles.upcomingBadge}>UPCOMING</span>
                )}
                <span className={styles.gameTag}>{t.videogame.name}</span>
              </div>

              {/* MAIN INFO */}
              <div className={styles.cardBody}>
                 <div className={styles.logoBox}>
                   {t.league.image_url ? (
                     <Image src={t.league.image_url} width={60} height={60} alt="Logo" unoptimized />
                   ) : (
                     <Trophy size={30} color="#444" />
                   )}
                 </div>
                 <h2 className={styles.tourneyName}>{t.league.name}</h2>
                 <p className={styles.seasonName}>{t.full_name.replace(t.league.name, '').trim() || t.name}</p>
              </div>

              {/* META */}
              <div className={styles.cardFooter}>
                <div className={styles.meta}>
                  <Calendar size={14} />
                  <span>
                    {new Date(t.begin_at).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                    {t.end_at ? ` - ${new Date(t.end_at).toLocaleDateString(undefined, {month:'short', day:'numeric'})}` : ''}
                  </span>
                </div>
                {/* Fallback for Region/Tier since API varies */}
                <div className={styles.meta}>
                  <MapPin size={14} />
                  <span>Global</span> 
                </div>
              </div>

              <div className={styles.hoverGlow} />
            </Link>
          </motion.div>
        )) : (
          <div className={styles.empty}>
            <p>No tournaments found for this filter.</p>
          </div>
        )}
      </motion.div>

    </div>
  );
}