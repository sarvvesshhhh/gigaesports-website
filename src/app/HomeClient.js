'use client';

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Trophy, Calendar, Zap, Crosshair, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './home.module.css';

export default function HomeClient({ heroMatch, heroType, liveTicker, upcomingList, topUsers }) {
  
  // --- 1. PARTICLE ENGINE INIT ---
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  // --- 2. 3D PARALLAX LOGIC ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // Card Rotation
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-8deg", "8deg"]);
  
  // Parallax Movement for internal elements (They move opposite to rotation for depth)
  const logoMoveX = useTransform(mouseX, [-0.5, 0.5], ["15px", "-15px"]);
  const logoMoveY = useTransform(mouseY, [-0.5, 0.5], ["15px", "-15px"]);
  const contentMoveX = useTransform(mouseX, [-0.5, 0.5], ["8px", "-8px"]);
  const contentMoveY = useTransform(mouseY, [-0.5, 0.5], ["8px", "-8px"]);
  
  // Holographic Sheen
  const sheenX = useTransform(mouseX, [-0.5, 0.5], ["0%", "120%"]);
  const sheenY = useTransform(mouseY, [-0.5, 0.5], ["0%", "120%"]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0); y.set(0);
  }

  // --- DATA & THEME ---
  const teamA = heroMatch?.opponents?.[0]?.opponent;
  const teamB = heroMatch?.opponents?.[1]?.opponent;
  const leagueImg = heroMatch?.league?.image_url;
  const scoreA = heroMatch?.results?.[0]?.score ?? 0;
  const scoreB = heroMatch?.results?.[1]?.score ?? 0;
  
  // Dynamic Accent Color based on game, defaulting to theme red
  const gameSlug = heroMatch?.videogame?.slug;
  const accentColor = gameSlug === 'valorant' ? '#ff4655' : 
                      gameSlug === 'cs-go' ? '#ff5235' : 
                      gameSlug === 'league-of-legends' ? '#0ac8b9' : '#ff4655';

  return (
    <div className={styles.wrapper} style={{ '--accent-glow': accentColor }}>
      
      {/* REACTIVE PARTICLE BACKGROUND */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className={styles.particlesCanvas}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          particles: {
            color: { value: accentColor },
            links: { color: accentColor, distance: 150, enable: true, opacity: 0.1, width: 1 },
            move: { enable: true, speed: 0.6, direction: "none", outModes: { default: "bounce" } },
            number: { density: { enable: true, area: 800 }, value: 40 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
      />
      <div className={styles.ambientMesh} />

      {/* TICKER */}
      <div className={styles.tickerContainer}>
        <div className={styles.tickerWrap}>
          <div className={styles.tickerMove}>
            {liveTicker.length > 0 ? [...liveTicker, ...liveTicker].map((m, i) => (
              <Link href={`/matches/${m.id}`} key={`${m.id}-${i}`} className={styles.tickerItem}>
                <span className={styles.dot}>●</span> 
                <span className={styles.tCode}>{m.opponents[0]?.opponent?.acronym || 'T1'}</span> 
                <span className={styles.tScore}>{m.results[0]?.score}-{m.results[1]?.score}</span> 
                <span className={styles.tCode}>{m.opponents[1]?.opponent?.acronym || 'T2'}</span>
              </Link>
            )) : (
              <div className={styles.tickerItem}>GIGAESPORTS SYSTEM ONLINE • PREDICT TO WIN • CLIMB THE RANKS</div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        
        {/* 3D HERO SECTION WITH PARALLAX */}
        <section className={styles.heroSectionPerspective}>
          <motion.div 
            className={styles.heroCard3D}
            style={{ rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.heroGlow} />
            <motion.div 
              className={styles.holographicSheen}
              style={{ backgroundPosition: useTransform(() => `${sheenX.get()} ${sheenY.get()}`) }}
            />

            {/* PARALLAX CONTENT CONTAINER */}
            <motion.div className={styles.heroContent} style={{ x: contentMoveX, y: contentMoveY }}>
              
              <div className={styles.heroHeader}>
                <div className={`${styles.statusBadge} ${styles[heroType]}`}>
                  {heroType === 'live' && <><Zap size={12} fill="currentColor"/> LIVE ACTION</>}
                  {heroType === 'upcoming' && <><Calendar size={12} /> FEATURED MATCH</>}
                  {heroType === 'result' && <><Trophy size={12} /> RECENT HIGHLIGHT</>}
                </div>
                <div className={styles.leagueTag}>
                  {leagueImg && <Image src={leagueImg} width={20} height={20} alt="L" unoptimized />}
                  {heroMatch?.league?.name}
                </div>
              </div>

              <div className={styles.vsDisplay}>
                {/* Team A - Parallax Logo */}
                <div className={styles.teamSide}>
                  <motion.div className={styles.logoHuge} style={{ x: logoMoveX, y: logoMoveY }}>
                    {teamA?.image_url ? <Image src={teamA.image_url} fill style={{objectFit:'contain'}} alt="A" unoptimized/> : <span className={styles.logoText}>{teamA?.name?.[0]}</span>}
                  </motion.div>
                  <h1 className={styles.teamNameHero}>{teamA?.name || 'TBD'}</h1>
                </div>

                <div className={styles.centerStage}>
                  {heroType === 'upcoming' ? <div className={styles.vsText}>VS</div> : 
                     <div className={styles.scoreHero}><span>{scoreA}</span><span className={styles.divider}>:</span><span>{scoreB}</span></div>}
                  {heroType === 'live' && <div className={styles.mapInfo}>MAP 3</div>}
                  {heroType === 'upcoming' && <div className={styles.startTime}>STARTS {new Date(heroMatch?.begin_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>}
                </div>

                {/* Team B - Parallax Logo */}
                <div className={styles.teamSide}>
                  <motion.div className={styles.logoHuge} style={{ x: logoMoveX, y: logoMoveY }}>
                    {teamB?.image_url ? <Image src={teamB.image_url} fill style={{objectFit:'contain'}} alt="B" unoptimized/> : <span className={styles.logoText}>{teamB?.name?.[0]}</span>}
                  </motion.div>
                  <h1 className={styles.teamNameHero}>{teamB?.name || 'TBD'}</h1>
                </div>
              </div>

              <div className={styles.heroFooter}>
                <Link href={`/matches/${heroMatch?.id}`} className={styles.predictionBtn}>
                   <div className={styles.btnContent}>
                     <Crosshair size={18} /> 
                     {heroType === 'result' ? 'VIEW STATS' : 'ENTER PREDICTION'}
                   </div>
                   <div className={styles.btnGlow}></div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* SIDE PANEL - UPDATED COLORS */}
        <aside className={styles.sidePanel}>
          
          <div className={`${styles.panelCard} ${styles.glowBorder}`}>
            <div className={styles.panelHeader}>
              {/* Changed Icon Color to Theme Red */}
              <TrendingUp size={16} color="var(--accent-glow)"/> 
              <span>TOP PREDICTORS</span>
            </div>
            <div className={styles.rankList}>
              {topUsers && topUsers.length > 0 ? topUsers.map((u, i) => (
                // Rank 1 gets special glowing red treatment
                <div key={u.id} className={`${styles.rankRow} ${i === 0 ? styles.rankOne : ''}`}>
                  <div className={styles.rankIdx}>{i+1}</div>
                  <div className={styles.rankUser}>
                    <div className={styles.rankAvatar}>{u.username?.[0].toUpperCase()}</div>
                    <span>{u.username}</span>
                  </div>
                  <div className={styles.rankXp}>{u.xp} XP</div>
                </div>
              )) : (
                 <div className={styles.emptyState}><p>Be the first to rank up!</p></div>
              )}
            </div>
            <div className={styles.cardFooter}>
              <span>Your Rank: --</span>
            </div>
          </div>

          <div className={`${styles.panelCard} ${styles.glowBorder}`}>
            <div className={styles.panelHeader}>
              <Calendar size={16} color="#3b82f6"/> 
              <span>ON DECK</span>
            </div>
            <div className={styles.upcomingList}>
              {upcomingList.map(m => (
                <Link key={m.id} href={`/matches/${m.id}`} className={styles.miniMatch}>
                  <div className={styles.miniTime}>{new Date(m.begin_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                  <div className={styles.miniTeams}>
                    <span className={styles.miniTeamName}>{m.opponents[0]?.opponent?.acronym || 'TBD'}</span>
                    <span className={styles.miniVs}>vs</span>
                    <span className={styles.miniTeamName}>{m.opponents[1]?.opponent?.acronym || 'TBD'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}