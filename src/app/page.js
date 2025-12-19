import HomeClient from './HomeClient';
import { supabase } from '../lib/supabase';

async function getData() {
  const apiKey = process.env.PANDASCORE_API_KEY;
  const headers = { 
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json'
  };

  try {
    const [liveRes, upcomingRes, pastRes] = await Promise.all([
      fetch('https://api.pandascore.co/matches/running?sort=begin_at&per_page=5', { headers, next: { revalidate: 30 } }),
      fetch('https://api.pandascore.co/matches/upcoming?sort=begin_at&per_page=5', { headers, next: { revalidate: 60 } }),
      fetch('https://api.pandascore.co/matches/past?sort=-begin_at&per_page=5', { headers, next: { revalidate: 60 } })
    ]);

    const liveMatches = liveRes.ok ? await liveRes.json() : [];
    const upcomingMatches = upcomingRes.ok ? await upcomingRes.json() : [];
    const pastMatches = pastRes.ok ? await pastRes.json() : [];

    // INTELLIGENT HERO SELECTION
    // Priority: 1. Live Match -> 2. Next Big Upcoming -> 3. Recent Result
    let heroMatch = null;
    let heroType = 'upcoming'; // 'live', 'upcoming', 'result'

    if (liveMatches.length > 0) {
      heroMatch = liveMatches[0];
      heroType = 'live';
    } else if (upcomingMatches.length > 0) {
      heroMatch = upcomingMatches[0];
      heroType = 'upcoming';
    } else {
      heroMatch = pastMatches[0];
      heroType = 'result';
    }

    // Fetch Leaderboard
    const { data: topUsers } = await supabase
      .from('profiles')
      .select('id, username, xp')
      .order('xp', { ascending: false })
      .limit(5);

    return { 
      heroMatch, 
      heroType, 
      liveTicker: liveMatches, // Pass all live matches for the ticker
      upcomingList: upcomingMatches.slice(1, 4), // Exclude hero if it's upcoming
      topUsers 
    };

  } catch (error) {
    console.error("Home Data Error:", error);
    return { heroMatch: null, heroType: 'error', liveTicker: [], upcomingList: [], topUsers: [] };
  }
}

export default async function HomePage() {
  const data = await getData();
  return <HomeClient {...data} />;
}