'use client';

import { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { supabase } from '../../lib/supabase';
import styles from './Schedules.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function ScheduleClient({ live, upcoming, past }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { user } = useUser();
  const [picks, setPicks] = useState({});

  // --- AGGRESSIVE SCORE FIX ---
  const getDisplayScore = (match, isResult) => {
    // 1. Start with the data we have
    let sA = match.results?.[0]?.score ?? 0;
    let sB = match.results?.[1]?.score ?? 0;

    // 2. If we are in "Results" tab and score is 0-0, we MUST fix it.
    if (isResult && sA === 0 && sB === 0) {
      // Try counting maps first
      if (match.games && match.games.length > 0) {
        let countA = 0; 
        let countB = 0;
        match.games.forEach(g => {
          if (g.winner?.id == match.opponents[0].opponent.id) countA++;
          if (g.winner?.id == match.opponents[1].opponent.id) countB++;
        });
        if (countA > 0 || countB > 0) return { scoreA: countA, scoreB: countB };
      }

      // If map count didn't work, use the Winner ID (which we know works because of the green text)
      if (match.winner_id) {
        // Loose equality (==) to handle string/number mismatch
        if (match.winner_id == match.opponents[0].opponent.id) return { scoreA: 'W', scoreB: 'L' };
        if (match.winner_id == match.opponents[1].opponent.id) return { scoreA: 'L', scoreB: 'W' };
      }
    }

    return { scoreA: sA, scoreB: sB };
  };

  const handlePick = async (e, matchId, teamName) => {
    e.preventDefault(); e.stopPropagation();
    if (!user || picks[matchId]) return;
    
    setPicks(prev => ({ ...prev, [matchId]: teamName }));
    await supabase.from('predictions').insert({
      user_id: user.id, match_id: String(matchId), team_picked: teamName
    });
    
    const { data } = await supabase.from('profiles').select('xp').eq('user_id', user.id).single();
    if (data) await supabase.from('profiles').update({ xp: data.xp + 25 }).eq('user_id', user.id);
  };

  const MatchRow = ({ match, isResult }) => {
    if (!match.opponents || match.opponents.length < 2) return null;
    
    const teamA = match.opponents[0].opponent;
    const teamB = match.opponents[1].opponent;
    const date = new Date(match.begin_at);
    
    // Pass isResult so we know when to force W-L
    const { scoreA, scoreB } = getDisplayScore(match, isResult);
    const winnerId = match.winner_id; 

    return (
      <Link href={`/matches/${match.id}`} className={styles.matchLink}>
        <div className={styles.matchRow}>
          
          {/* META */}
          <div className={styles.metaCol}>
            <span className={styles.time}>{date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
            <div className={styles.leagueTag}>
               {match.league.image_url && <Image src={match.league.image_url} width={16} height={16} alt="L" unoptimized />}
               <span>{match.league.name}</span>
            </div>
          </div>

          {/* TEAMS & SCORE */}
          <div className={styles.matchCol}>
            
            {/* Team A */}
            <div 
              className={`${styles.team} ${styles.teamLeft} 
              ${picks[match.id] === teamA.name ? styles.picked : ''}
              ${isResult && winnerId == teamA.id ? styles.winner : ''}
              ${isResult && winnerId && winnerId != teamA.id ? styles.loser : ''}`}
              onClick={(e) => !isResult && handlePick(e, match.id, teamA.name)}
            >
              <span className={styles.teamName}>{teamA.name}</span>
              {teamA.image_url && <Image src={teamA.image_url} width={32} height={32} className={styles.logo} alt="A" unoptimized />}
            </div>

            {/* Score Display */}
            <div className={styles.score}>
               {(isResult || activeTab === 'live') ? (
                 <span className={styles.finalScore} style={{ color: (scoreA === 'W' || scoreA === 'L') ? '#a1a1aa' : 'white' }}>
                   {scoreA} - {scoreB}
                 </span>
               ) : (
                 <span className={styles.vs}>VS</span>
               )}
            </div>

            {/* Team B */}
            <div 
              className={`${styles.team} ${styles.teamRight}
              ${picks[match.id] === teamB.name ? styles.picked : ''}
              ${isResult && winnerId == teamB.id ? styles.winner : ''}
              ${isResult && winnerId && winnerId != teamB.id ? styles.loser : ''}`}
              onClick={(e) => !isResult && handlePick(e, match.id, teamB.name)}
            >
              {teamB.image_url && <Image src={teamB.image_url} width={32} height={32} className={styles.logo} alt="B" unoptimized />}
              <span className={styles.teamName}>{teamB.name}</span>
            </div>

          </div>

          {/* STATUS */}
          <div className={styles.statusCol}>
            {isResult ? <span className={styles.finishedTag}>Final</span> :
             activeTab === 'live' ? <span className={styles.liveDot}>LIVE</span> :
             picks[match.id] ? <span className={styles.lockedTag}>PICKED</span> : <span className={styles.openTag}>OPEN</span>
            }
          </div>

        </div>
      </Link>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>MATCH CENTER</h1>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'live' ? styles.activeTab : ''}`} onClick={() => setActiveTab('live')}>
            <span className={styles.liveDotTab}></span> LIVE ({live.length})
          </button>
          <button className={`${styles.tab} ${activeTab === 'upcoming' ? styles.activeTab : ''}`} onClick={() => setActiveTab('upcoming')}>
            UPCOMING
          </button>
          <button className={`${styles.tab} ${activeTab === 'past' ? styles.activeTab : ''}`} onClick={() => setActiveTab('past')}>
            RESULTS
          </button>
        </div>
      </div>

      <div className={styles.listContainer}>
        {activeTab === 'live' && live.map(m => <MatchRow key={m.id} match={m} />)}
        {activeTab === 'upcoming' && upcoming.map(m => <MatchRow key={m.id} match={m} />)}
        {activeTab === 'past' && past.map(m => <MatchRow key={m.id} match={m} isResult={true} />)}
        
        {activeTab === 'live' && live.length === 0 && <div className={styles.empty}>No live matches right now.</div>}
      </div>
    </div>
  );
}