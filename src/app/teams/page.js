import TeamCard from '../../components/TeamCard';
import styles from './TeamsPage.module.css';

// --- DATA FETCHING ---
async function getTeamsData() {
  if (!process.env.PANDASCORE_API_KEY) return [];

  // Fetch a good number of teams to populate the grid
  const url = `https://api.pandascore.co/teams?sort=name&per_page=60&token=${process.env.PANDASCORE_API_KEY}`;

  try {
    const response = await fetch(url, { next: { revalidate: 86400 } }); // Cache for 24h
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Teams Fetch Error:", error);
    return [];
  }
}

export default async function TeamsPage() {
  const teams = await getTeamsData();

  return (
    <div className={styles.pageContainer}>
      
      {/* 1. HEADER SECTION */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>ESPORTS TEAMS</h1>
          <p className={styles.pageSubtitle}>
            Discover the organizations dominating the scene.
          </p>
          
          {/* Decorative Search Bar Visual (Functional search would require client components, this is a placeholder for the vibe) */}
          <div className={styles.searchContainer}>
            <span className={styles.searchIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Search for a team..." 
              className={styles.searchInput} 
              disabled // Disabled for now as this is a server component
            />
          </div>
        </div>
      </header>

      {/* 2. TEAMS GRID */}
      <div className={styles.gridContainer}>
        {Array.isArray(teams) && teams.length > 0 ? (
          teams.map(team => (
            <div key={team.id} className={styles.cardWrapper}>
              <TeamCard team={team} />
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <h2>No teams found</h2>
            <p>We couldn't load the team roster right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}