'use client';

import { useState, useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Calendar, MapPin, Trophy, Shield, Zap, Target } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './detail.module.css';

export default function TournamentDetail({ series, matches, teams }) {
  const [activeTab, setActiveTab] = useState('matches');

  // --- PARTICLES INIT ---
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  // --- 3D TILT LOGIC ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  // Formatting
  const startDate = new Date(series.begin_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  const endDate = series.end_at ? new Date(series.end_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'TBD';
  
  const accentColor = series.videogame?.slug === 'valorant' ? '#ff4655' : '#3b82f6';

  return (
    <div className={styles.wrapper}>
      
      {/* BACKGROUND FX */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className={styles.particlesCanvas}
        options={{
          background: { color: { value: "transparent" } },
          particles: {
            color: { value: accentColor },
            links: { enable: true, color: accentColor, opacity: 0.1 },
            move: { enable: true, speed: 0.5 },
            number: { value: 30, density: { enable: true, area: 800 } },
            opacity: { value: 0.3 },
            size: { value: { min: 1, max: 2 } },
          },
        }}
      />
      <div className={styles.ambientGlow} style={{background: `radial-gradient(circle at 50% 0%, ${accentColor}22 0%, transparent 70%)`}} />

      {/* 3D HERO SECTION */}
      <section className={styles.heroSection}>
        <motion.div 
          className={styles.heroCard}
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { x.set(0); y.set(0); }}
        >
          <div className={styles.heroBg} style={{ backgroundImage: `url(${series.league.image_url})` }}></div>
          <div className={styles.heroOverlay}></div>
          
          <div className={styles.heroContent}>
             <motion.div 
               className={styles.logoWrapper}
               style={{ z: 30 }}
             >
                {series.league.image_url && <Image src={series.league.image_url} width={100} height={100} alt="Logo" unoptimized className={styles.heroLogo} />}
             </motion.div>
             
             <div className={styles.heroText}>
               <div className={styles.badges}>
                 <span className={styles.gameBadge} style={{background: accentColor}}>{series.videogame?.name || 'Esports'}</span>
                 <span className={styles.tierBadge}>{series.tier || 'Professional'}</span>
               </div>
               <h1 className={styles.title}>{series.league.name}</h1>
               <h2 className={styles.season}>{series.full_name}</h2>
               
               <div className={styles.metaRow}>
                  <div className={styles.metaItem}><Calendar size={16}/> {startDate} - {endDate}</div>
                  <div className={styles.metaItem}><MapPin size={16}/> Global</div>
                  {series.prizepool && <div className={styles.metaItem}><Trophy size={16}/> {series.prizepool}</div>}
               </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* CONTENT TABS */}
      <div className={styles.contentContainer}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'matches' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('matches')}
          >
            Match Schedule
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'teams' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            Teams ({teams.length})
          </button>
        </div>

        {/* MATCH LIST */}
        {activeTab === 'matches' && (
          <div className={styles.matchList}>
            {matches.length > 0 ? matches.map(m => (
              <Link href={`/matches/${m.id}`} key={m.id} className={styles.matchRow}>
                <div className={styles.mDate}>
                  <span className={styles.mDay}>{new Date(m.begin_at).getDate()}</span>
                  <span className={styles.mMonth}>{new Date(m.begin_at).toLocaleDateString(undefined,{month:'short'})}</span>
                </div>
                
                <div className={styles.mTeams}>
                   <div className={styles.mTeam}>
                     <span className={styles.mTName}>{m.opponents[0]?.opponent?.name || 'TBD'}</span>
                     {m.opponents[0]?.opponent?.image_url && <img src={m.opponents[0].opponent.image_url} className={styles.mTLogo} />}
                   </div>
                   <div className={styles.mScore}>
                     {m.status === 'finished' ? 
                       <span className={styles.finalScore}>{m.results[0]?.score} - {m.results[1]?.score}</span> : 
                       <span className={styles.vs}>VS</span>
                     }
                   </div>
                   <div className={styles.mTeam}>
                     {m.opponents[1]?.opponent?.image_url && <img src={m.opponents[1].opponent.image_url} className={styles.mTLogo} />}
                     <span className={styles.mTName}>{m.opponents[1]?.opponent?.name || 'TBD'}</span>
                   </div>
                </div>

                <div className={styles.mStatus}>
                  {m.status === 'running' ? <span className={styles.liveTag}><Zap size={12} fill="currentColor"/> LIVE</span> : 
                   m.status === 'finished' ? <span className={styles.finTag}>Final</span> :
                   <span className={styles.upTag}>{new Date(m.begin_at).toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})}</span>
                  }
                </div>
              </Link>
            )) : (
              <div className={styles.emptyState}>No matches scheduled yet.</div>
            )}
          </div>
        )}

        {/* TEAM GRID */}
        {activeTab === 'teams' && (
          <div className={styles.teamGrid}>
            {teams.length > 0 ? teams.map(t => (
              <div key={t.id} className={styles.teamCard}>
                <div className={styles.tLogoBox}>
                  {t.image_url ? <img src={t.image_url} alt={t.name} /> : <Shield size={40} color="#333"/>}
                </div>
                <h3 className={styles.tName}>{t.name}</h3>
                <span className={styles.tAcronym}>{t.acronym}</span>
              </div>
            )) : (
               <div className={styles.emptyState}>Team list not available yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}