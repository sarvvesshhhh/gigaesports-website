import TeamCard from '../../components/TeamCard';
import styles from './TeamsPage.module.css';

async function getTeamsData() {
  // Safety Check: If no key, stop immediately.
  if (!process.env.PANDASCORE_API_KEY) return [];

  const url = `https://api.pandascore.co/teams?sort=name&per_page=50&token=${process.env.PANDASCORE_API_KEY}`;

  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    
    // CRITICAL: We removed the 'throw error' line.
    if (!response.ok) {
        console.error("PandaScore API error:", response.status);
        return []; // Return empty array instead of crashing
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return []; // Return empty array instead of crashing
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