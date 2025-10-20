import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;
  
  // This query is now very strict. It looks for these terms ONLY in the article's title.
  const keywords = [
    'esports',
    'Valorant',
    'CS2',
    'League of Legends',
    'Dota 2',
    'BGMI',
    'LEC',
    'VCT'
  ];
  const queryInTitle = `(${keywords.join(' OR ')})`;

  // We are now using the 'qInTitle' parameter instead of 'q'
  const url = `https://newsapi.org/v2/everything?qInTitle=${encodeURIComponent(queryInTitle)}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); 
    if (!response.ok) {
      const errorData = await response.json();
      console.error("NewsAPI Error:", errorData);
      throw new Error(errorData.message || "Failed to fetch news");
    }
    const data = await response.json();
    return NextResponse.json(data.articles || []);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}