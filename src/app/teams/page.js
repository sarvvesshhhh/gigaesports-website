import TeamCard from '../../components/TeamCard';
import styles from './TeamsPage.module.css';

async function getTeamsData() {
  // 1. Check if API key exists. If not, skip fetch to prevent build error.
  if (!process.env.PANDASCORE_API_KEY) {
    console.log("Building without API key - returning empty list");
    return [];
  }

  const url = `https://api.pandascore.co/teams?sort=name&per_page=50&token=${process.env.PANDASCORE_API_KEY}`;

  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    
    // 2. If API fails, log it but DO NOT throw an error. Return empty list instead.
    if (!response.ok) {
        console.error("PandaScore API failed:", response.status);
        return []; 
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return []; // 3. Always return an empty array on failure
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
    </div>
  );
}