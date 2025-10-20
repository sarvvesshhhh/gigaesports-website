import { NextResponse } from 'next/server';

const GRID_GQL_ENDPOINT = 'https://api.grid.gg/central-data/graphql';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const gameId = searchParams.get('game_id');
  
  if (!query || !gameId) { return NextResponse.json([]); }

  const gqlQuery = {
    query: `
      query GetTeamsByName($filters: TeamFilter!) {
        teams(filter: $filters, first: 10) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
    variables: { 
      filters: { 
        name: { contains: query },
        titleId: { equal: `urn:grid:title:${gameId}` }
      } 
    }
  };

  try {
    const response = await fetch(GRID_GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.GRID_API_KEY },
      body: JSON.stringify(gqlQuery)
    });

    if (!response.ok) throw new Error('Failed to fetch from GRID API');
    
    const data = await response.json();
    const teams = data?.data?.teams?.edges?.map(edge => edge.node) || [];
    
    const formattedData = teams.map(team => ({
      value: team.id.split(':').pop(),
      label: team.name,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}