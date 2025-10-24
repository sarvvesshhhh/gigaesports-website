import { NextResponse } from 'next/server';

// This function fetches the match history for a specific team using PandaScore
async function getTeamMatchHistory(teamId) {
  const url = `https://api.pandascore.co/teams/${teamId}/matches?filter[status]=finished&sort=-end_at&per_page=50&token=${process.env.PANDASCORE_API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`PandaScore API Error fetching history for team ${teamId}:`, await response.text());
      return []; // Return empty array on failure
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch failed for team ${teamId} history:`, error);
    return []; // Return empty array on failure
  }
}

// This is the main function for the API route
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const team1Id = searchParams.get('team1_id');
  const team2Id = searchParams.get('team2_id');

  if (!team1Id || !team2Id) {
    return NextResponse.json({ error: 'Two team IDs are required' }, { status: 400 });
  }

  // Fetch match history for both teams concurrently
  const [team1Matches, team2Matches] = await Promise.all([
    getTeamMatchHistory(team1Id),
    getTeamMatchHistory(team2Id),
  ]);

  // Safely parse team IDs to integers for comparison
  const parsedTeam1Id = parseInt(team1Id, 10);
  const parsedTeam2Id = parseInt(team2Id, 10);

  // Calculate total wins from the fetched matches
  const team1Wins = team1Matches.filter(m => m.winner_id === parsedTeam1Id).length;
  const team2Wins = team2Matches.filter(m => m.winner_id === parsedTeam2Id).length;

  let h2hWinsTeam1 = 0;
  let h2hWinsTeam2 = 0;

  // Find head-to-head matches from team1's history and calculate wins
  team1Matches.forEach(match => {
    // Check if opponents array exists and find opponent ID
    const opponent = match.opponents?.find(op => op.opponent?.id !== parsedTeam1Id);
    if (opponent?.opponent?.id === parsedTeam2Id) { // Check if the opponent is team2
      if (match.winner_id === parsedTeam1Id) h2hWinsTeam1++;
      if (match.winner_id === parsedTeam2Id) h2hWinsTeam2++;
    }
  });

  // Prepare the final stats object
  const stats = {
    team1: {
      recentWinRate: ((team1Wins / (team1Matches.length || 1)) * 100).toFixed(0),
      totalWins: team1Wins,
      totalMatches: team1Matches.length,
      h2hWins: h2hWinsTeam1,
    },
    team2: {
      recentWinRate: ((team2Wins / (team2Matches.length || 1)) * 100).toFixed(0),
      totalWins: team2Wins,
      totalMatches: team2Matches.length,
      h2hWins: h2hWinsTeam2,
    }
  };

  return NextResponse.json(stats);
}