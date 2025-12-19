'use client';

import { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { supabase } from '../../lib/supabase';
import styles from './Schedules.module.css';
import Image from 'next/image';

export default function PredictionCard({ match }) {
  // 🛑 SAFETY CHECK: If match data is missing teams, DO NOT RENDER anything.
  if (!match || !match.opponents || match.opponents.length < 2) {
    return null;
  }

  const { user } = useUser();
  const [picked, setPicked] = useState(null); // 'A' or 'B'

  // Safe to access now because of the check above
  const teamA = match.opponents[0].opponent;
  const teamB = match.opponents[1].opponent;
  const matchTime = new Date(match.begin_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });

  async function handleVote(team, teamName) {
    if (!user) return alert("Sign in to predict!");
    if (picked) return; // Prevent double voting

    setPicked(teamName);

    // Save to Supabase
    await supabase.from('predictions').insert({
      user_id: user.id,
      match_id: String(match.id),
      team_picked: teamName
    });

    // Grant Instant XP
    const { data } = await supabase.from('profiles').select('xp').eq('user_id', user.id).single();
    if (data) {
      await supabase.from('profiles').update({ xp: data.xp + 10 }).eq('user_id', user.id);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.league}>{match.league.name}</span>
        <span className={styles.time}>{matchTime}</span>
      </div>

      <div className={styles.teams}>
        {/* TEAM A */}
        <div 
          className={`${styles.team} ${picked === teamA.name ? styles.selected : ''}`}
          onClick={() => handleVote('A', teamA.name)}
        >
          {teamA.image_url ? (
             <Image src={teamA.image_url} width={50} height={50} alt="A" unoptimized />
          ) : (
             <div className={styles.placeholderLogo}>A</div>
          )}
          <span className={styles.teamName}>{teamA.name}</span>
          {picked === teamA.name && <div className={styles.check}>✓</div>}
        </div>

        <div className={styles.vs}>VS</div>

        {/* TEAM B */}
        <div 
          className={`${styles.team} ${picked === teamB.name ? styles.selected : ''}`}
          onClick={() => handleVote('B', teamB.name)}
        >
           {teamB.image_url ? (
             <Image src={teamB.image_url} width={50} height={50} alt="B" unoptimized />
           ) : (
             <div className={styles.placeholderLogo}>B</div>
           )}
           <span className={styles.teamName}>{teamB.name}</span>
           {picked === teamB.name && <div className={styles.check}>✓</div>}
        </div>
      </div>

      <div className={styles.footer}>
        {picked ? (
          <span className={styles.votedMsg}>Prediction Locked: {picked}</span>
        ) : (
          <span className={styles.prompt}>Predict Winner (+10 XP)</span>
        )}
      </div>
    </div>
  );
}