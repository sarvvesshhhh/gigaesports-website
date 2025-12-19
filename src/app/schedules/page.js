import ScheduleClient from './ScheduleClient';
import styles from './Schedules.module.css';

async function getMatchData() {
  const apiKey = process.env.PANDASCORE_API_KEY;
  if (!apiKey) return { live: [], upcoming: [], past: [] };

  const headers = { 
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json'
  };

  try {
    // We request 'games' to try and count maps manually if needed
    const [liveRes, upcomingRes, pastRes] = await Promise.all([
      fetch('https://api.pandascore.co/matches/running?sort=begin_at&per_page=10&expand=games', { headers, next: { revalidate: 30 } }),
      fetch('https://api.pandascore.co/matches/upcoming?sort=begin_at&per_page=20', { headers, next: { revalidate: 60 } }),
      fetch('https://api.pandascore.co/matches/past?sort=-begin_at&per_page=15&expand=games', { headers, next: { revalidate: 60 } })
    ]);

    const live = liveRes.ok ? await liveRes.json() : [];
    const upcoming = upcomingRes.ok ? await upcomingRes.json() : [];
    const past = pastRes.ok ? await pastRes.json() : [];

    return { live, upcoming, past };
  } catch (error) {
    console.error("API Error:", error);
    return { live: [], upcoming: [], past: [] };
  }
}

export default async function SchedulesPage() {
  const data = await getMatchData();

  return (
    <div className={styles.pageWrapper}>
      <ScheduleClient {...data} />
    </div>
  );
}