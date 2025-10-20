import { NextResponse } from 'next/server';

const GRID_GQL_ENDPOINT = 'https://api.grid.gg/central-data/graphql';

async function getTeamMatchHistory(teamId, gameId) {
  const gridTeamUrn = `urn:grid:team:${teamId}`;
  const gridTitleUrn = `urn:grid:title:${gameId}`;

  const gqlQuery = {
    query: `
      query GetSeriesForTeam($filters: SeriesFilter!) {
        allSeries(filter: $filters, first: 50, orderBy: startTimeScheduled, orderDirection: desc) {
          edges {
            node {
              id
              winner {
                id
              }
              participants {
                team {
                  id
                }
              }
            }
          }
        }
      }
    `,
    variables: { 
      filters: { 
        teamIds: { in: [gridTeamUrn] },
        titleIds: { in: [gridTitleUrn] }
      } 
    }
  };
  
  const response = await fetch(GRID_GQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.GRID_API_KEY },
    body: JSON.stringify(gqlQuery)
  });

  if (!response.ok) return [];
  const data = await response.json();
  return data?.data?.allSeries?.edges?.map(edge => edge.node) || [];
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const team1Id = searchParams.get('team1_id');
  const team2Id = searchParams.get('team2_id');
  const gameId = searchParams.get('game_id');

  if (!team1Id || !team2Id || !gameId) {
    return NextResponse.json({ error: 'All IDs are required' }, { status: 400 });
  }

  const [team1Matches, team2Matches] = await Promise.all([
    getTeamMatchHistory(team1Id, gameId),
    getTeamMatchHistory(team2Id, gameId),
  ]);
  
  // ... (The rest of the calculation logic is the same)
}