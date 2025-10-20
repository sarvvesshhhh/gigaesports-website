import Image from 'next/image';
import MatchCard from '../../../components/MatchCard';
import styles from './TeamPage.module.css';

async function getTeamData(id, name) {
  const psApiKey = `token=${process.env.PANDASCORE_API_KEY}`;
  const tdbApiKey = process.env.THESPORTSDB_API_KEY;
  const baseUrl = 'https://api.pandascore.co';

  // 1. Fetch core data from PandaScore
  const teamRes = await fetch(`${baseUrl}/teams/${id}?${psApiKey}`);
  if (!teamRes.ok) throw new Error('Failed to fetch team details from PandaScore');
  const team = await teamRes.json();

  // 2. Fetch rich data from our Liquipedia scraper (if available)
  let scrapedData = { description: null, players: [], achievements: [] };
  if (name && team.videogame?.slug) {
      const gameSlug = team.videogame.slug.replace('-go', 'strike');
      const scrapeRes = await fetch(`http://localhost:3000/api/scrape?team=${encodeURIComponent(name)}&game=${gameSlug}`);
      if (scrapeRes.ok) {
          scrapedData = await scrapeRes.json();
      }
  }
  
  // 3. Fetch recent matches from PandaScore
  const matchesRes = await fetch(`${baseUrl}/teams/${id}/matches?filter[status]=past&sort=-end_at&per_page=5&${psApiKey}`);
  const recentMatches = matchesRes.ok ? await matchesRes.json() : [];

  // Use the richer player list from the scraper if available, otherwise use PandaScore's
  let finalPlayers = [];
  if (scrapedData.players?.length > 0) {
    finalPlayers = scrapedData.players;
  } else {
    const playersRes = await fetch(`${baseUrl}/teams/${id}/players?${psApiKey}`);
    if(playersRes.ok) finalPlayers = await playersRes.json();
  }

  return { team, players: finalPlayers, description: scrapedData.description, recentMatches, achievements: scrapedData.achievements };
}

export default async function TeamPage({ params, searchParams }) {
  try {
    const { team, players, description, recentMatches, achievements } = await getTeamData(params.id, searchParams.name);

    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <Image 
            src={team.image_url || '/images/default-team-logo.png'}
            alt={`${team.name || 'Team'} logo`}
            width={150}
            height={150}
            className={styles.teamLogo}
          />
          <h1 className={styles.teamName}>{team.name}</h1>
          <p className={styles.gameName}>{team.videogame?.name}</p>
        </header>

        {description && (
           <section className={styles.section}>
            <h2 className={styles.sectionTitle}>About {team.name}</h2>
            <p className={styles.description}>{description}</p>
          </section>
        )}

        {players?.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Active Roster</h2>
            <div className={styles.rosterGrid}>
              {players.map(player => (
                <div key={player.id || player.player_id} className={styles.playerCard}>
                  <Image 
                    src={player.image_url || '/images/default-team-logo.png'}
                    alt={player.name || player.id || 'Player'}
                    width={80}
                    height={80}
                    className={styles.playerImage}
                  />
                  <span className={styles.playerName}>{player.name || player.id}</span>
                  <span className={styles.playerRole}>{player.role}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {achievements?.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Achievements</h2>
            <table className={styles.achievementsTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Place</th>
                  <th>Tier</th>
                  <th>Tournament</th>
                  <th>Prize</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((ach, index) => (
                  <tr key={index}>
                    <td>{ach.date}</td>
                    <td>{ach.place}</td>
                    <td>{ach.tier}</td>
                    <td>{ach.tournament}</td>
                    <td>{ach.prize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {recentMatches?.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Recent Results</h2>
            <div className={styles.matchesGrid}>
              {recentMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error(error);
    return <p className={styles.errorText}>Could not load team data. Please try again later.</p>;
  }
}