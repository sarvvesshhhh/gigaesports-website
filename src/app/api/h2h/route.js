import { NextResponse } from 'next/server';

async function getTeamMatchHistory(teamId) {
  const url = `https://api.pandascore.co/teams/${teamId}/matches?filter[status]=finished&sort=-end_at&per_page=50&token=${process.env.PANDASCORE_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) return [];
  return await response.json();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const team1Id = searchParams.get('team1_id');
  const team2Id = searchParams.get('team2_id');

  if (!team1Id || !team2Id) {
    return NextResponse.json({ error: 'Two team IDs are required' }, { status: 400 });
  }

  const [team1Matches, team2Matches] = await Promise.all([
    getTeamMatchHistory(team1Id),
    getTeamMatchHistory(team2Id),
  ]);

  const team1Wins = team1Matches.filter(m => m.winner_id === parseInt(team1Id)).length;
  const team2Wins = team2Matches.filter(m => m.winner_id === parseInt(team2Id)).length;
  
  let h2hWinsTeam1 = 0;
  let h2hWinsTeam2 = 0;

  team1Matches.forEach(match => {
    const isH2H = match.opponents.some(op => op.opponent.id === parseInt(team2Id));
    if (isH2H) {
      if (match.winner_id === parseInt(team1Id)) h2hWinsTeam1++;
      if (match.winner_id === parseInt(team2Id)) h2hWinsTeam2++;
    }
  });

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