import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  // If there's no search query, return an empty list immediately.
  if (!query) {
    return NextResponse.json([]);
  }

  // This is the correct, working URL for searching teams on PandaScore.
  const url = `https://api.pandascore.co/teams?search[name]=${query}&sort=name&per_page=24&token=${process.env.PANDASCORE_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // If the API gives an error, log it and return an empty list.
      console.error("PandaScore API Error:", await response.text());
      throw new Error("Failed to search for teams with PandaScore");
    }

    const data = await response.json();
    // Return the full team data directly to the front end.
    return NextResponse.json(data);

  } catch (error) {
    console.error("API Route Error:", error);
    // Return an empty array in case of any failure to prevent the app from crashing.
    return NextResponse.json([], { status: 500 });
  }
}