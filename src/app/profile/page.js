import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from '../../lib/supabase';
import ProfileClient from './ProfileClient';

async function getUserData(userId) {
  // 1. Fetch Profile (XP, etc)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  // 2. Fetch Recent Predictions (Last 10)
  const { data: predictions } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  return { profile, predictions: predictions || [] };
}

async function getMatchDetails(matchIds) {
  if (!matchIds.length) return {};
  const apiKey = process.env.PANDASCORE_API_KEY;
  try {
    const promises = matchIds.map(id => 
      fetch(`https://api.pandascore.co/matches/${id}?token=${apiKey}`, { next: { revalidate: 3600 } })
        .then(res => res.json())
        .catch(() => null)
    );
    const matches = await Promise.all(promises);
    
    // Map ID -> Match Object
    const matchMap = {};
    matches.forEach(m => {
      if(m && m.id) matchMap[m.id] = m;
    });
    return matchMap;
  } catch (e) {
    return {};
  }
}

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { profile, predictions } = await getUserData(user.id);
  
  // Extract IDs to fetch match names
  const matchIds = predictions.map(p => p.match_id);
  const matchMap = await getMatchDetails(matchIds);

  // Combine data
  const history = predictions.map(p => ({
    ...p,
    matchData: matchMap[p.match_id] || null
  }));

  // --- THE FIX: Create a plain object manually ---
  // We strip away all the complex Clerk methods and keep only the data strings
  const plainUser = {
    id: user.id,
    imageUrl: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username || user.firstName // Fallback if username is missing
  };

  return (
    <ProfileClient 
      user={plainUser} 
      profile={profile} 
      history={history} 
    />
  );
}