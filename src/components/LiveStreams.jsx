import styles from './LiveStreams.module.css';
import Image from 'next/image';

// This function will run on the server to fetch the live streams
async function getLiveStreams() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  // We'll search for live streams for these games
  const gamesQuery = encodeURIComponent('BGMI live stream|Valorant live stream|CODM live stream');
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&q=${gamesQuery}&maxResults=4&key=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 300 } }); // Re-fetch every 5 minutes
    if (!response.ok) {
      const error = await response.json();
      console.error("YouTube API Error:", error.error.message);
      return []; // Return empty array on error
    }
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const LiveStreams = async () => {
  const streams = await getLiveStreams();

  return (
    <section className={styles.streamsSection}>
      <div className={styles.header}>
        <h2>Live on YouTube</h2>
      </div>
      <div className={styles.streamsGrid}>
        {streams.map(stream => (
          <a key={stream.id.videoId} href={`https://www.youtube.com/watch?v=${stream.id.videoId}`} target="_blank" rel="noopener noreferrer" className={styles.card}>
            <div className={styles.thumbnail}>
              <Image 
                src={stream.snippet.thumbnails.high.url}
                alt={stream.snippet.title}
                layout="fill"
                objectFit="cover"
              />
              <span className={styles.liveTag}>LIVE</span>
            </div>
            <div className={styles.info}>
              <h3 className={styles.title}>{stream.snippet.title}</h3>
              <p className={styles.channel}>{stream.snippet.channelTitle}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default LiveStreams;