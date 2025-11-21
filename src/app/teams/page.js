import TeamCard from '../../components/TeamCard';
import styles from './TeamsPage.module.css';

async function getTeamsData() {
  // If the API key is missing during build, return empty array instead of crashing
  if (!process.env.PANDASCORE_API_KEY) {
    console.warn("Build Warning: PANDASCORE_API_KEY is missing");
    return [];
  }

  const url = `https://api.pandascore.co/teams?sort=name&per_page=50&token=${process.env.PANDASCORE_API_KEY}`;

  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    // If the API fails (e.g. 401 Unauthorized), return empty array instead of throwing
    if (!response.ok) {
      console.error("Build Warning: API request failed", await response.text());
      return [];
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Build Warning:", error);
    return [];
  }
}

export default async function TeamsPage() {
  const teams = await getTeamsData();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Esports Teams</h1>
      <div className={styles.grid}>
        {Array.isArray(teams) && teams.map(team => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
      {teams.length === 0 && <p style={{textAlign: 'center', color: '#666'}}>No teams loaded (Check API Key)</p>}
    </div>
  );
}