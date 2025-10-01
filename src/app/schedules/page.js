import LiveMatches from '../../components/LiveMatches';

async function getScheduleData() {
  // Using the PandaScore URL and fetching more items for the page
  const url = `https://api.pandascore.co/matches/upcoming?filter[status]=running,not_started&sort=begin_at&per_page=20&token=${process.env.PANDASCORE_API_KEY}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 } // Re-fetch data every 60 seconds
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("PandaScore API Error:", errorDetails);
      throw new Error('Failed to fetch data from PandaScore API');
    }
    
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch schedule data');
  }
}

export default async function SchedulesPage() {
  const matches = await getScheduleData();

  return (
    // We can wrap our component for some vertical spacing
    <div style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <LiveMatches matches={matches} />
    </div>
  );
}