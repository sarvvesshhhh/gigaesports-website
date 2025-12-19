import Link from 'next/link';
import Image from 'next/image';
import styles from './CreatorsPage.module.css';

// --- Our Category Configuration ---
const categories = [
  { id: 'all', name: 'All Games', query: 'BGMI live|Valorant live|PUBG live' },
  { id: 'bgmi', name: 'BGMI', query: 'BGMI live India' },
  { id: 'valo', name: 'Valorant', query: 'Valorant live India' },
  { id: 'codm', name: 'CODM', query: 'Call of Duty Mobile live India' },
  { 
    id: 'gtarp', 
    name: 'GTA RP', 
    query: 'GTA V RP India live',
    subCategories: [
      { id: 'all', name: 'All Servers', query: 'GTA V RP India live' },
      { id: 'soulcity', name: 'Soulcity RP', query: 'Soulcity RP live' },
      { id: 'nopixel', name: 'NoPixel India', query: '"NoPixel India" live' },
      { id: 'prodigy', name: 'Prodigy RP', query: '"Prodigy India" live' },
      { id: 'samatva', name: 'Samatva RP', query: '"Samatva RP" live' },
    ]
  },
  { id: 'cs2', name: 'Counter-Strike 2', query: 'CS2 live India' },
];

// --- MOCK DATA (BACKUP) ---
// If the API fails, we use this so the site doesn't look empty.
const MOCK_STREAMS = [
    {
        id: { videoId: 'mock1' },
        snippet: {
            title: "LEGENDARY 50 RANK PUSH | CONQUEROR LOBBY 🔥",
            channelTitle: "Mortal",
            thumbnails: { high: { url: "https://i.ytimg.com/vi/S7xTBa93TX8/maxresdefault.jpg" } }
        }
    },
    {
        id: { videoId: 'mock2' },
        snippet: {
            title: "VALORANT RADIANT GRIND | JETT ONLY",
            channelTitle: "ScoutOP",
            thumbnails: { high: { url: "https://i.ytimg.com/vi/zW7Y-Jg0_yM/maxresdefault.jpg" } }
        }
    },
    {
        id: { videoId: 'mock3' },
        snippet: {
            title: "GTA RP | POLICE CHASE | NOPIXEL INDIA",
            channelTitle: "RaviWoke",
            thumbnails: { high: { url: "https://i.ytimg.com/vi/V5g_6q3q5bU/maxresdefault.jpg" } }
        }
    },
    {
        id: { videoId: 'mock4' },
        snippet: {
            title: "CS2 FACEIT LEVEL 10 | ROAD TO PRO",
            channelTitle: "s1mple",
            thumbnails: { high: { url: "https://i.ytimg.com/vi/m23gXfAqaHk/maxresdefault.jpg" } }
        }
    }
];

// --- Data Fetching Function ---
async function getLiveStreams(searchQuery) {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
  
  // 1. If no Key, return Mock Data immediately
  if (!apiKey) {
      console.warn("No API Key found. Using Mock Data.");
      return MOCK_STREAMS;
  }

  const query = encodeURIComponent(searchQuery);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&q=${query}&maxResults=13&key=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    
    // 2. If API Errors (Quota limit, etc), return Mock Data
    if (!response.ok) {
      console.error("YouTube API Error, using backup data.");
      return MOCK_STREAMS;
    }
    
    const data = await response.json();
    // 3. If API returns empty list, return Mock Data
    return (data.items && data.items.length > 0) ? data.items : MOCK_STREAMS;

  } catch (error) {
    console.error("Fetch failed:", error);
    return MOCK_STREAMS;
  }
}

// --- The Page Component ---
export default async function CreatorsPage({ searchParams }) {
  // Await searchParams (Next.js 15 requirement)
  const resolvedParams = await searchParams;
  const activeGameId = resolvedParams?.game || 'all';
  const activeServerId = resolvedParams?.server || 'all';

  const activeCategory = categories.find(c => c.id === activeGameId) || categories[0];
  let searchQuery = activeCategory.query;

  let activeSubCategory = null;
  if (activeCategory.id === 'gtarp' && activeCategory.subCategories) {
    activeSubCategory = activeCategory.subCategories.find(sc => sc.id === activeServerId) || activeCategory.subCategories[0];
    searchQuery = activeSubCategory.query;
  }
  
  const streams = await getLiveStreams(searchQuery);

  // Spotlight Logic
  const spotlightStream = streams[0]; 
  const gridStreams = streams.slice(1);

  return (
    <div className={styles.page}>
      
      {/* 1. SPOTLIGHT SECTION */}
      {spotlightStream && (
        <section className={styles.spotlightSection}>
          <div className={styles.spotlightBg}>
             <Image 
                src={spotlightStream.snippet.thumbnails.high.url}
                alt="Spotlight Background"
                fill
                className={styles.bgImage}
                priority
             />
             <div className={styles.overlay}></div>
          </div>

          <div className={styles.spotlightContent}>
             <div className={styles.liveBadgeHero}>🔴 FEATURED LIVE</div>
             <h1 className={styles.spotlightTitle}>
               <a href={`https://www.youtube.com/watch?v=${spotlightStream.id.videoId}`} target="_blank">
                 {spotlightStream.snippet.title}
               </a>
             </h1>
             <p className={styles.spotlightChannel}>{spotlightStream.snippet.channelTitle}</p>
             
             <a 
               href={`https://www.youtube.com/watch?v=${spotlightStream.id.videoId}`} 
               target="_blank" 
               className={styles.watchButton}
             >
               Watch Stream
             </a>
          </div>
        </section>
      )}

      {/* 2. CATEGORY NAV */}
      <div className={styles.navContainer}>
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
                className={`${styles.subCategoryLink} ${subCategory.id === activeSubCategory?.id ? styles.activeSubCategory : ''}`}
              >
                {subCategory.name}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* 3. GRID */}
      <div className={styles.streamsGrid}>
        {gridStreams.length > 0 ? (
           gridStreams.map(stream => (
            <a key={stream.id.videoId} href={`https://www.youtube.com/watch?v=${stream.id.videoId}`} target="_blank" rel="noopener noreferrer" className={styles.card}>
              <div className={styles.thumbnail}>
                <Image 
                  src={stream.snippet.thumbnails.high.url}
                  alt={stream.snippet.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <span className={styles.liveTag}>LIVE</span>
              </div>
              <div className={styles.info}>
                <h3 className={styles.titleCard} title={stream.snippet.title}>{stream.snippet.title}</h3>
                <p className={styles.channel}>{stream.snippet.channelTitle}</p>
              </div>
            </a>
          ))
        ) : (
           <div className={styles.emptyState}>
             <p>No streams found.</p>
           </div>
        )}
      </div>
    </div>
  );
}