import Image from 'next/image';
import styles from './MatchDetails.module.css';

// --- DATA FETCHING ---

// 1. Get the Match Details (Score, Time, Stream)
async function getMatchData(id) {
  if (!process.env.PANDASCORE_API_KEY) return null;
  const url = `https://api.pandascore.co/matches/${id}?token=${process.env.PANDASCORE_API_KEY}`;
  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Match Fetch Error:", error);
    return null;
  }
}

// 2. Get Full Team Details (To guarantee we get the Roster)
async function getTeamDetails(teamId) {
  if (!teamId || !process.env.PANDASCORE_API_KEY) return null;
  const url = `https://api.pandascore.co/teams/${teamId}?token=${process.env.PANDASCORE_API_KEY}`;
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache teams for 1 hour
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Team ${teamId} Fetch Error:`, error);
    return null;
  }
}

export default async function MatchPage({ params }) {
  const { id } = await params;
  const match = await getMatchData(id);

  if (!match) {
    return (
      <div className={styles.errorContainer}>
        <h1>Match Not Found</h1>
        <a href="/schedules" className={styles.backButton}>Back to Schedule</a>
      </div>
    );
  }

  // Extract basic IDs
  const team1Id = match.opponents?.[0]?.opponent?.id;
  const team2Id = match.opponents?.[1]?.opponent?.id;

  // FETCH FULL TEAM DATA IN PARALLEL
  // This ensures we get the "Current Roster" even if the match object is empty
  const [team1Full, team2Full] = await Promise.all([
    getTeamDetails(team1Id),
    getTeamDetails(team2Id)
  ]);

  // Use the FULL data if available, otherwise fallback to the match data
  const team1 = team1Full || match.opponents?.[0]?.opponent;
  const team2 = team2Full || match.opponents?.[1]?.opponent;

  // Extract other metadata
  const league = match.league?.name || "Unknown League";
  const series = match.serie?.full_name || "";
  const tournament = match.tournament?.name || "";
  const status = match.status === 'running' ? 'LIVE' : match.status;
  const date = new Date(match.begin_at).toLocaleString();
  const streamUrl = match.streams?.list?.[0]?.raw_url;

  return (
    <div className={styles.pageContainer}>
      
      {/* 1. SCOREBOARD HEADER */}
      <section className={styles.scoreboard}>
        <div className={styles.leagueInfo}>
          <h2>{league}</h2>
          <p>{series} - {tournament}</p>
          <span className={`${styles.statusBadge} ${status === 'LIVE' ? styles.live : ''}`}>
            {status.replace(/_/g, ' ')}
          </span>
        </div>

        <div className={styles.teamsRow}>
          {/* TEAM 1 */}
          <div className={styles.team}>
            <div className={styles.logoWrapper}>
                {team1?.image_url ? (
                  <Image src={team1.image_url} alt={team1.name} width={100} height={100} className={styles.teamLogo} />
                ) : (
                  <div className={styles.placeholderLogo}>?</div>
                )}
            </div>
            <h1 className={styles.teamName}>{team1?.name || "TBD"}</h1>
          </div>

          {/* VS / SCORE */}
          <div className={styles.scoreBlock}>
            {status === 'not_started' ? (
                <div className={styles.vs}>VS</div>
            ) : (
                <div className={styles.score}>
                    <span>{match.results?.[0]?.score ?? 0}</span>
                    <span className={styles.divider}>:</span>
                    <span>{match.results?.[1]?.score ?? 0}</span>
                </div>
            )}
            <div className={styles.matchDate}>{date}</div>
          </div>

          {/* TEAM 2 */}
          <div className={styles.team}>
            <div className={styles.logoWrapper}>
                {team2?.image_url ? (
                  <Image src={team2.image_url} alt={team2.name} width={100} height={100} className={styles.teamLogo} />
                ) : (
                  <div className={styles.placeholderLogo}>?</div>
                )}
            </div>
            <h1 className={styles.teamName}>{team2?.name || "TBD"}</h1>
          </div>
        </div>
      </section>

      {/* 2. CONTENT GRID */}
      <div className={styles.contentGrid}>
        
        {/* LEFT: Stream */}
        <div className={styles.mainColumn}>
            <h3 className={styles.sectionTitle}>Live Stream</h3>
            <div className={styles.streamContainer}>
                {streamUrl ? (
                    <iframe 
                        src={`https://player.twitch.tv/?channel=${streamUrl.split('/').pop()}&parent=localhost&parent=gigaesports-website.vercel.app`}
                        height="100%" 
                        width="100%" 
                        allowFullScreen
                        className={styles.iframe}
                    ></iframe>
                ) : (
                    <div className={styles.noStream}>
                        <p>No official stream available yet.</p>
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT: Rosters (NOW USING FULL TEAM DATA) */}
        <aside className={styles.sidebar}>
            <h3 className={styles.sectionTitle}>Active Rosters</h3>
            
            {/* TEAM 1 */}
            <div className={styles.rosterCard}>
                <h4 className={styles.rosterTeamName}>{team1?.name || "Team 1"}</h4>
                {team1?.players && team1.players.length > 0 ? (
                  <div className={styles.playerList}>
                    {team1.players.map(player => (
                      <div key={player.id} className={styles.playerRow}>
                        <span className={styles.playerName}>{player.name}</span>
                        <span className={styles.playerRole}>{player.role ? player.role : 'Pro'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.rosterNote}>Roster not available.</p>
                )}
            </div>

            {/* TEAM 2 */}
            <div className={styles.rosterCard}>
                <h4 className={styles.rosterTeamName}>{team2?.name || "Team 2"}</h4>
                {team2?.players && team2.players.length > 0 ? (
                  <div className={styles.playerList}>
                    {team2.players.map(player => (
                      <div key={player.id} className={styles.playerRow}>
                        <span className={styles.playerName}>{player.name}</span>
                        <span className={styles.playerRole}>{player.role ? player.role : 'Pro'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.rosterNote}>Roster not available.</p>
                )}
            </div>
        </aside>

      </div>
    </div>
  );
}