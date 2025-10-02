import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game'); // Get the 'game' parameter from the URL

  // Start with the base URL and default filters
  let url = `https://api.pandascore.co/matches?filter[status]=running,not_started&sort=begin_at&per_page=20&token=${process.env.PANDASCORE_API_KEY}`;

  // If a game is specified, add it to the URL as a filter
  if (game && game !== 'all') {
    url += `&filter[videogame_slug]=${game}`;
  }

  try {
    const response = await fetch(url, { next: { revalidate: 10 } });
    if (!response.ok) {
      throw new Error('Failed to fetch data from PandaScore');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}