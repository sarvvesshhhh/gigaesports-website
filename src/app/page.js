import Hero from '../components/Hero';
import LiveMatches from '../components/LiveMatches';
import CreatorHighlights from '../components/CreatorHighlights';
import LiveStreams from '../components/LiveStreams'; // <-- 1. Import

async function getMatchData() {
  // This is the PandaScore URL for running and upcoming matches
  // It automatically includes your API key from the .env.local file
  const url = `https://api.pandascore.co/matches/upcoming?filter[status]=running,not_started&sort=begin_at&per_page=6&token=${process.env.PANDASCORE_API_KEY}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 } // Re-fetch data every 60 seconds
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("PandaScore API Error:", errorDetails);
      throw new Error('Failed to fetch data from PandaScore API');
    }

    const data = await response.json();
    return data; // PandaScore returns a simple array
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
}


export default async function Home() {
  const matches = await getMatchData();

  return (
    <main>
      <Hero />
      <LiveMatches matches={matches} />
      <CreatorHighlights />
      <LiveStreams /> {/* <-- 2. Add the new component */}
    </main>
  );
}