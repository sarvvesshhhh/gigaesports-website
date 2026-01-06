import TournamentDetail from './TournamentDetail';

async function getSeriesData(id) {
  const apiKey = process.env.PANDASCORE_API_KEY;
  const headers = { 
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json'
  };

  try {
    // 1. Fetch Series Details (The Tournament itself)
    const seriesRes = await fetch(`https://api.pandascore.co/series/${id}`, { headers, next: { revalidate: 60 } });
    
    if (!seriesRes.ok) {
      console.error(`Failed to fetch series: ${seriesRes.status}`);
      return null;
    }
    
    // FIX: Added space here
    const seriesData = await seriesRes.json();

    // 2. Fetch Matches
    const matchesRes = await fetch(`https://api.pandascore.co/series/${id}/matches?sort=begin_at&per_page=50`, { headers, next: { revalidate: 60 } });
    const matchesData = matchesRes.ok ? await matchesRes.json() : [];

    // 3. Fetch Teams
    const teamsRes = await fetch(`https://api.pandascore.co/series/${id}/teams`, { headers, next: { revalidate: 3600 } });
    const teamsData = teamsRes.ok ? await teamsRes.json() : [];

    return { 
      series: seriesData, 
      matches: matchesData,
      teams: teamsData 
    };

  } catch (e) {
    console.error("API Error:", e);
    return null;
  }
}

export default async function TournamentPage({ params }) {
  const resolvedParams = await params;
  const data = await getSeriesData(resolvedParams.id);

  if (!data) return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', 
      background:'#030304', color:'#666', flexDirection:'column', gap:'1rem'
    }}>
      <h1 style={{color:'white', fontWeight:800}}>Tournament data not found</h1>
      <p>The ID requested was: {resolvedParams.id}</p>
    </div>
  );

  return (
    <TournamentDetail 
      series={data.series} 
      matches={data.matches} 
      teams={data.teams} 
    />
  );
}