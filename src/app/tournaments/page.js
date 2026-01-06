import TournamentHub from './TournamentHub';

async function getTournaments() {
  const apiKey = process.env.PANDASCORE_API_KEY;
  const headers = { 
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json'
  };

  try {
    // Fetch Running and Upcoming Series (Seasons/Events)
    const [runningRes, upcomingRes] = await Promise.all([
      fetch('https://api.pandascore.co/series/running?sort=begin_at&per_page=30', { headers, next: { revalidate: 60 } }),
      fetch('https://api.pandascore.co/series/upcoming?sort=begin_at&per_page=30', { headers, next: { revalidate: 60 } })
    ]);

    const running = runningRes.ok ? await runningRes.json() : [];
    const upcoming = upcomingRes.ok ? await upcomingRes.json() : [];

    // Combine and mark them
    const allSeries = [
      ...running.map(s => ({ ...s, status: 'live' })),
      ...upcoming.map(s => ({ ...s, status: 'upcoming' }))
    ];

    return allSeries;

  } catch (error) {
    console.error("Tournament API Error:", error);
    return [];
  }
}

export default async function TournamentsPage() {
  const tournaments = await getTournaments();
  return <TournamentHub tournaments={tournaments} />;
}