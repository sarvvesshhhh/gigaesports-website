import styles from './MatchDetails.module.css';

// 1. Fetch Basic Match Info
async function getMatchData(id) {
  const apiKey = process.env.PANDASCORE_API_KEY;
  const url = `https://api.pandascore.co/matches/${id}?token=${apiKey}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

// 2. Fetch Full Team Roster (The Fix)
async function getTeamRoster(teamId) {
  if (!teamId) return [];
  const apiKey = process.env.PANDASCORE_API_KEY;
  const url = `https://api.pandascore.co/teams/${teamId}?token=${apiKey}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache roster for 1 hour
    if (!res.ok) return [];
    const teamData = await res.json();
    return teamData.players || [];
  } catch (e) {
    return [];
  }
}

export default async function MatchPage({ params }) {
  const resolvedParams = await params; 
  const match = await getMatchData(resolvedParams.id);

  if (!match) return <div className={styles.error}>Match data unavailable.</div>;

  const opponentA = match.opponents?.[0]?.opponent;
  const opponentB = match.opponents?.[1]?.opponent;
  
  // 3. FETCH ROSTERS SEPARATELY (The Fallback)
  // We run these in parallel to keep it fast
  const [rosterA, rosterB] = await Promise.all([
    getTeamRoster(opponentA?.id),
    getTeamRoster(opponentB?.id)
  ]);

  const isLive = match.status === 'running';
  const bgImage = match.league?.image_url || match.videogame?.current_version?.image_url || '/images/hero-background.jpg';

  // Stream Logic
  const stream = match.streams_list?.find(s => s.language === 'en') || match.streams_list?.[0];
  const streamUrl = stream?.raw_url;
  
  const getTwitchEmbed = (url) => {
    if (!url || !url.includes('twitch.tv')) return null;
    const channel = url.split('/').pop();
    const parent = process.env.NEXT_PUBLIC_VERCEL_URL?.replace('https://', '') || 'localhost';
    return `https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=false`;
  };
  const embedSrc = getTwitchEmbed(streamUrl);

  return (
    <div className={styles.pageWrapper}>
      
      {/* BACKGROUND */}
      <div className={styles.backdrop}>
        <div className={styles.bgImage} style={{ backgroundImage: `url(${bgImage})` }}></div>
        <div className={styles.bgOverlay}></div>
      </div>

      <div className={styles.contentContainer}>
        
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.leagueBadge}>
             {match.league?.image_url && <img src={match.league.image_url} alt="League" />}
             <div className={styles.leagueMeta}>
               <span className={styles.leagueName}>{match.league.name}</span>
               <span className={styles.serieName}>{match.serie.full_name}</span>
             </div>
          </div>

          <div className={styles.scoreboardContainer}>
            {/* TEAM A */}
            <div className={`${styles.teamBox} ${styles.teamLeft}`}>
               <div className={styles.teamInfo}>
                 <h1 className={styles.teamName}>{opponentA?.name || 'TBD'}</h1>
                 <span className={styles.record}>{rosterA.length} Active Players</span>
               </div>
               {opponentA?.image_url && <img src={opponentA.image_url} className={styles.logoBig} />}
            </div>

            {/* SCORE */}
            <div className={styles.scoreCenter}>
               <div className={styles.scoreBoard}>
                 <span className={styles.scoreDigit}>{match.results?.[0]?.score ?? 0}</span>
                 <span className={styles.divider}>:</span>
                 <span className={styles.scoreDigit}>{match.results?.[1]?.score ?? 0}</span>
               </div>
               {isLive ? (
                 <div className={styles.liveIndicator}><span className={styles.dot}></span> LIVE</div>
               ) : (
                 <div className={styles.statusBadge}>{match.status === 'finished' ? 'FINAL' : 'UPCOMING'}</div>
               )}
            </div>

            {/* TEAM B */}
            <div className={`${styles.teamBox} ${styles.teamRight}`}>
               {opponentB?.image_url && <img src={opponentB.image_url} className={styles.logoBig} />}
               <div className={styles.teamInfo}>
                 <h1 className={styles.teamName}>{opponentB?.name || 'TBD'}</h1>
                 <span className={styles.record}>{rosterB.length} Active Players</span>
               </div>
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className={styles.grid}>
          
          {/* STREAM */}
          <section className={styles.streamSection}>
            <div className={styles.panelHeader}>
              <h3>OFFICIAL BROADCAST</h3>
            </div>
            <div className={styles.videoShell}>
              {embedSrc ? (
                <iframe src={embedSrc} className={styles.iframe} allowFullScreen></iframe>
              ) : (
                <div className={styles.offlineState}>
                  <div className={styles.offlineIcon}>📡</div>
                  <h3>Stream Offline</h3>
                  <p>Waiting for broadcast signal...</p>
                </div>
              )}
            </div>
          </section>

          {/* ROSTERS (Fetched from Team Data) */}
          <section className={styles.rosterSection}>
            <div className={styles.panelHeader}>
              <h3>TEAM ROSTERS</h3>
            </div>

            <div className={styles.rosterGrid}>
              
              {/* Roster A */}
              <div className={styles.rosterColumn}>
                <div className={styles.colHeader}>
                   {opponentA?.image_url && <img src={opponentA.image_url} width={24} />} 
                   <span>{opponentA?.name}</span>
                </div>
                <div className={styles.playerList}>
                  {rosterA.length > 0 ? rosterA.map(p => (
                    <div key={p.id} className={styles.playerCard}>
                      <div className={styles.playerAvatar}>
                        {p.image_url ? <img src={p.image_url} /> : <span>{p.first_name?.[0]}</span>}
                      </div>
                      <div className={styles.playerMeta}>
                        <span className={styles.pName}>{p.name}</span>
                        <span className={styles.pRealName}>{p.first_name} {p.last_name}</span>
                      </div>
                      <span className={styles.roleIcon}>⚡</span>
                    </div>
                  )) : (
                    <div className={styles.emptyRoster}><span>Data Not Available</span></div>
                  )}
                </div>
              </div>

              {/* Roster B */}
              <div className={styles.rosterColumn}>
                <div className={styles.colHeader}>
                   {opponentB?.image_url && <img src={opponentB.image_url} width={24} />} 
                   <span>{opponentB?.name}</span>
                </div>
                <div className={styles.playerList}>
                  {rosterB.length > 0 ? rosterB.map(p => (
                    <div key={p.id} className={styles.playerCard}>
                      <div className={styles.playerAvatar}>
                        {p.image_url ? <img src={p.image_url} /> : <span>{p.first_name?.[0]}</span>}
                      </div>
                      <div className={styles.playerMeta}>
                        <span className={styles.pName}>{p.name}</span>
                        <span className={styles.pRealName}>{p.first_name} {p.last_name}</span>
                      </div>
                      <span className={styles.roleIcon}>⚡</span>
                    </div>
                  )) : (
                    <div className={styles.emptyRoster}><span>Data Not Available</span></div>
                  )}
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}