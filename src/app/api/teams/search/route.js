import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  const url = `https://api.pandascore.co/teams?search[name]=${query}&per_page=10&token=${process.env.PANDASCORE_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch teams');
    const data = await response.json();
    const formattedData = data.map(team => ({
      value: team.id,
      label: team.name,
      image: team.image_url,
    }));
    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}