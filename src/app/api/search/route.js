import { NextResponse } from 'next/server';

const GRID_GQL_ENDPOINT = 'https://api.grid.gg/central-data/graphql';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) { return NextResponse.json({ teams: [], players: [] }); }

  const gqlQuery = {
    query: `
      query Search($query: String!) {
        search(query: $query, types: [Team, Player], first: 5) {
          edges {
            node {
              ... on Team {
                id
                name
              }
              ... on Player {
                id
                nickname
              }
            }
          }
        }
      }
    `,
    variables: { query }
  };

  try {
    const response = await fetch(GRID_GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.GRID_API_KEY },
      body: JSON.stringify(gqlQuery)
    });

    if (!response.ok) throw new Error('Failed to fetch from GRID API');

    const data = await response.json();
    return NextResponse.json(data.data.search.edges);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}