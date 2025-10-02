import Link from 'next/link';
import Image from 'next/image'; // We will use this directly in the page
import styles from './HighlightsPage.module.css';
import VideoCard from '../../components/VideoCard'; // Reuse our VideoCard component

// --- Highlight Categories Configuration ---
const categories = [
  { id: 'all', name: 'All Highlights', query: 'esports highlights' },
  { id: 'cs2', name: 'Counter-Strike 2', query: 'CS2 highlights' },
  { id: 'dota2', name: 'Dota 2', query: 'Dota 2 highlights' },
  { id: 'valo', name: 'Valorant', query: 'Valorant highlights' },
  { id: 'lol', name: 'League of Legends', query: 'League of Legends highlights' },
  { id: 'bgmi', name: 'BGMI', query: 'BGMI highlights' },
];

// --- Data Fetching Function ---
async function getYouTubeHighlights(searchQuery) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const query = encodeURIComponent(searchQuery);
  // Fetch up to 20 popular highlight videos
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount&q=${query}&maxResults=20&key=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Re-fetch every hour
    if (!response.ok) {
      const error = await response.json();
      console.error("YouTube API Error:", error.error.message);
      return [];
    }
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// --- The Page Component ---
export default async function HighlightsPage({ searchParams }) {
  // Get the active category from the URL, or default to 'all'
  const activeCategory = categories.find(c => c.id === searchParams.game) || categories[0];
  
  // Fetch the highlights for that category
  const videos = await getYouTubeHighlights(activeCategory.query);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Esports Highlights</h1>

      {/* Category Navigation */}
      <nav className={styles.categoryNav}>
        {categories.map(category => (
          <Link
            key={category.id}
            href={`/highlights?game=${category.id}`}
            className={`${styles.categoryLink} ${category.id === activeCategory.id ? styles.activeCategory : ''}`}
          >
            {category.name}
          </Link>
        ))}
      </nav>

      {/* Grid of Highlight Videos */}
      <div className={styles.videoGrid}>
        {videos && videos.length > 0 ? (
          videos.map(video => (
            // Re-using the VideoCard component
            <VideoCard key={video.id.videoId} video={video} />
          ))
        ) : (
          <p>No highlights found for this category.</p>
        )}
      </div>
    </div>
  );
}