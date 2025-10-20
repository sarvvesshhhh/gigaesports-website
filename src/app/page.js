import Hero from '../components/Hero';
import GameSelector from '../components/GameSelector';
import LiveMatches from '../components/LiveMatches';
import CreatorHighlights from '../components/CreatorHighlights';

// Fetches the single most prominent upcoming match for the Hero section
async function getFeaturedMatch() {
  const url = `https://api.pandascore.co/matches/upcoming?sort=begin_at&page=1&per_page=1&token=${process.env.PANDASCORE_API_KEY}`;
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Re-fetch every hour
    if (!response.ok) return null;
    const matches = await response.json();
    return matches[0];
  } catch (error) {
    console.error("Failed to fetch featured match:", error);
    return null;
  }
}

// Fetches the list of matches for the main schedule grid
async function getMatchData() {
  const url = `https://api.pandascore.co/matches?filter[status]=running,not_started&sort=begin_at&per_page=6&token=${process.env.PANDASCORE_API_KEY}`;
  try {
    const response = await fetch(url, { next: { revalidate: 60 } }); // Re-fetch every 60 seconds
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch match list:", error);
    return [];
  }
}

export default async function Home() {
  // Fetch both sets of data in parallel
  const [matches, featuredMatch] = await Promise.all([
    getMatchData(),
    getFeaturedMatch()
  ]);

  return (
    <main>
      <Hero featuredMatch={featuredMatch} />
      <GameSelector />
      <LiveMatches matches={matches} />
      <CreatorHighlights />
    </main>
  );
}