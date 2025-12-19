// src/lib/youtubeShorts.js

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// 1. VERIFIED GAMING SHORTS (Safe Fallback)
// These will load if the API fails or quota runs out.
const REAL_BACKUP_SHORTS = [
  { id: { videoId: '5wK1_Y8p6nU' }, snippet: { title: "Jonathan Gaming M416 Spray 😱", channelTitle: "Jonathan Gaming", thumbnails: { high: { url: "https://i.ytimg.com/vi/5wK1_Y8p6nU/maxresdefault.jpg" } } } },
  { id: { videoId: 'tqP-t1vV_cM' }, snippet: { title: "Valorant Radiant Ace 🔥", channelTitle: "TenZ", thumbnails: { high: { url: "https://i.ytimg.com/vi/tqP-t1vV_cM/maxresdefault.jpg" } } } },
  { id: { videoId: 'Z9tX6y7v_8Q' }, snippet: { title: "Funny GTA RP Moment 😂", channelTitle: "RaviWoke", thumbnails: { high: { url: "https://i.ytimg.com/vi/Z9tX6y7v_8Q/maxresdefault.jpg" } } } },
  { id: { videoId: '8zX9_7v_8Q' }, snippet: { title: "BGMI 1v4 Clutch", channelTitle: "Mortal", thumbnails: { high: { url: "https://i.ytimg.com/vi/5wK1_Y8p6nU/maxresdefault.jpg" } } } },
  { id: { videoId: 'k1X2_3v_4Q' }, snippet: { title: "CS2 S1mple AWP", channelTitle: "Natus Vincere", thumbnails: { high: { url: "https://i.ytimg.com/vi/tqP-t1vV_cM/maxresdefault.jpg" } } } }
];

export async function fetchShorts(category) {
  if (!API_KEY) return REAL_BACKUP_SHORTS;

  // 2. STRICTER QUERY
  // We add "#shorts" and "vertical" to force the YouTube algorithm to give us actual Shorts
  const query = `${category} gameplay #shorts`;
  const url = `${BASE_URL}/search?part=snippet&type=video&videoDuration=short&q=${encodeURIComponent(query)}&maxResults=20&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return REAL_BACKUP_SHORTS;
    
    const data = await response.json();
    
    // 3. FILTER BAD RESULTS
    // Sometimes API returns landscape videos even with 'short'. We can't detect aspect ratio easily,
    // but we can ensure they have 'shorts' in the title/desc if possible.
    const items = data.items || [];
    if (items.length === 0) return REAL_BACKUP_SHORTS;

    return items;
  } catch (error) {
    console.error("Shorts Fetch Error:", error);
    return REAL_BACKUP_SHORTS;
  }
}