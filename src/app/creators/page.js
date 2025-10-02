import Link from 'next/link';
import Image from 'next/image';
import styles from './CreatorsPage.module.css';

// --- Our Category Configuration ---
const categories = [
  { id: 'all', name: 'All Games', query: 'BGMI live|Valorant live|PUBG live' },
  { id: 'bgmi', name: 'BGMI', query: '#bgmi live' },
  { id: 'valo', name: 'Valorant', query: '#valorant live' },
  { id: 'codm', name: 'CODM', query: '#codm live' },
  { 
    id: 'gtarp', 
    name: 'GTA RP', 
    query: '#gtarp live',
    subCategories: [
      { id: 'all', name: 'All Servers', query: '#gtarp live' },
      { id: 'soulcity', name: 'Soulcity RP', query: 'Soulcity RP live' },
      { id: 'nopixel', name: 'NoPixel India', query: '"NoPixel India" live' },
      { id: 'prodigy', name: 'Prodigy RP', query: '"Prodigy India" live' },
      { id: 'samatva', name: 'Samatva RP', query: '"Samatva RP" live' },
    ]
  },
  { id: 'cs2', name: 'Counter-Strike 2', query: '#cs2 live' },
];

// --- Data Fetching Function ---
async function getLiveStreams(searchQuery) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const query = encodeURIComponent(searchQuery);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&q=${query}&maxResults=12&key=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
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
export default async function CreatorsPage({ searchParams }) {
  const activeGameId = searchParams.game || 'all';
  const activeServerId = searchParams.server || 'all';

  const activeCategory = categories.find(c => c.id === activeGameId) || categories[0];
  let searchQuery = activeCategory.query;

  let activeSubCategory = null;
  if (activeCategory.id === 'gtarp' && activeCategory.subCategories) {
    activeSubCategory = activeCategory.subCategories.find(sc => sc.id === activeServerId) || activeCategory.subCategories[0];
    searchQuery = activeSubCategory.query;
  }
  
  const streams = await getLiveStreams(searchQuery);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Live Creators</h1>

      <nav className={styles.categoryNav}>
        {categories.map(category => (
          <Link
            key={category.id}
            href={`/creators?game=${category.id}`}
            className={`${styles.categoryLink} ${category.id === activeCategory.id ? styles.activeCategory : ''}`}
          >
            {category.name}
          </Link>
        ))}
      </nav>

      {activeCategory.id === 'gtarp' && activeCategory.subCategories && (
        <nav className={styles.subCategoryNav}>
          {activeCategory.subCategories.map(subCategory => (
            <Link
              key={subCategory.id}
              href={`/creators?game=gtarp&server=${subCategory.id}`}
              className={`${styles.categoryLink} ${subCategory.id === activeSubCategory?.id ? styles.activeCategory : ''}`}
            >
              {subCategory.name}
            </Link>
          ))}
        </nav>
      )}

      <div className={styles.streamsGrid}>
        {streams && streams.map(stream => (
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
              <h3 className={styles.titleCard}>{stream.snippet.title}</h3>
              <p className={styles.channel}>{stream.snippet.channelTitle}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}