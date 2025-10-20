import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 1; // Get the page number from the request

  const url = `https://api.pandascore.co/teams?sort=name&page=${page}&per_page=20&token=${process.env.PANDASCORE_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch teams");
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}