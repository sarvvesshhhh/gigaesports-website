import styles from './CreatorHighlights.module.css';
import VideoCard from './VideoCard';
import Link from 'next/link'; // Import the Link component

// This function will run on the server to fetch highlight videos
async function getYouTubeHighlights() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const query = encodeURIComponent('bgmi highlights'); // A search query for popular highlights
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=viewCount&q=${query}&maxResults=4&key=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Re-fetch every hour
    if (!response.ok) return [];
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const CreatorHighlights = async () => {
  const videos = await getYouTubeHighlights();

  return (
    <section className={styles.highlightsSection}>
      <div className={styles.header}>
        <h2>Creator Highlights</h2>
        <Link href="/highlights">
          <button>View All Updates</button>
        </Link>
      </div>
      <div className={styles.videoGrid}>
        {videos.map(video => (
          // We'll pass the whole video object to the card
          <VideoCard key={video.id.videoId} video={video} />
        ))}
      </div>
    </section>
  );
};

export default CreatorHighlights;