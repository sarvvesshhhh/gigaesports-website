import Image from 'next/image';
import styles from './News.module.css';

// --- REAL API FETCHING ---
async function getRealEsportsNews() {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) return [];

  const url = `https://gnews.io/api/v4/search?q=esports&lang=en&max=12&token=${apiKey}`; // Fetch 12 items for better grid

  try {
    const response = await fetch(url, { next: { revalidate: 7200 } });
    if (!response.ok) return [];
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    return [];
  }
}

export default async function NewsPage() {
  const newsItems = await getRealEsportsNews();

  // Fallback Data
  const backupNews = [
      { title: "GNews API Key Missing: Add to .env.local", publishedAt: new Date().toISOString(), source: { name: "System" }, image: "https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg", url: "#" },
      { title: "Valorant VCT 2026: New Format Revealed", publishedAt: new Date().toISOString(), source: { name: "Riot" }, image: "https://img.redbull.com/images/c_crop,x_0,y_0,h_1080,w_1920/c_fill,w_1680,h_950/q_auto,f_auto/redbullcom/2023/8/10/d8q4u7l9y8y1q4y1q4y1/valorant-champions-2023-los-angeles", url: "#" },
      { title: "CS2 Major: Vitality Wins Paris", publishedAt: new Date().toISOString(), source: { name: "HLTV" }, image: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg", url: "#" },
      { title: "BGMI Update 3.5 Patch Notes", publishedAt: new Date().toISOString(), source: { name: "Krafton" }, image: "https://wallpapers.com/images/hd/bgmi-4k-gaming-cool-3840-x-2160-u4k4u4k4u4k4u4k4.jpg", url: "#" },
  ];

  const articles = newsItems.length > 0 ? newsItems : backupNews;
  
  // Layout Logic
  const heroArticle = articles[0];
  const subHeroArticles = articles.slice(1, 3); // 2 articles next to hero
  const gridArticles = articles.slice(3); // Rest in grid

  return (
    <div className={styles.pageContainer}>
      
      {/* 1. BREAKING NEWS TICKER */}
      <div className={styles.tickerContainer}>
        <div className={styles.tickerLabel}>BREAKING</div>
        <div className={styles.tickerTrack}>
           {articles.map((news, i) => (
             <span key={i} className={styles.tickerItem}>
                • {news.title} <span className={styles.tickerTime}>{new Date(news.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
             </span>
           ))}
        </div>
      </div>

      {/* 2. HEADER */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>NEWSROOM</h1>
        <p className={styles.pageSubtitle}>The Pulse of Global Esports</p>
      </header>

      <div className={styles.contentWrapper}>
        
        {/* 3. BENTO GRID (Hero + 2 Sub-Heroes) */}
        {heroArticle && (
          <section className={styles.bentoSection}>
            
            {/* BIG LEFT CARD */}
            <a href={heroArticle.url} target="_blank" className={styles.heroCard}>
              <Image 
                src={heroArticle.image || "https://dotesports.com/wp-content/uploads/2023/04/Esports-General.jpg"} 
                alt={heroArticle.title} 
                fill
                className={styles.bgImage}
                unoptimized
              />
              <div className={styles.overlayGradient}></div>
              <div className={styles.cardContent}>
                <span className={styles.badge}>TOP STORY</span>
                <h2 className={styles.heroTitle}>{heroArticle.title}</h2>
                <div className={styles.meta}>
                   <span>{heroArticle.source.name}</span> • <span>{new Date(heroArticle.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </a>

            {/* RIGHT COLUMN (2 Stacked Cards) */}
            <div className={styles.subHeroColumn}>
              {subHeroArticles.map((article, idx) => (
                <a key={idx} href={article.url} target="_blank" className={styles.subCard}>
                   <Image 
                    src={article.image || "https://dotesports.com/wp-content/uploads/2023/04/Esports-General.jpg"} 
                    alt={article.title} 
                    fill
                    className={styles.bgImage}
                    unoptimized
                  />
                  <div className={styles.overlayGradient}></div>
                  <div className={styles.subContent}>
                    <h3 className={styles.subTitle}>{article.title}</h3>
                    <div className={styles.metaSmall}>{article.source.name}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 4. STANDARD GRID (The rest) */}
        <section className={styles.gridSection}>
          <div className={styles.sectionHeader}>
            <h3>Latest Wire</h3>
            <div className={styles.line}></div>
          </div>
          
          <div className={styles.newsGrid}>
            {gridArticles.map((article, index) => (
              <a key={index} href={article.url} target="_blank" className={styles.gridCard}>
                <div className={styles.gridImageWrapper}>
                  <Image 
                    src={article.image || "https://dotesports.com/wp-content/uploads/2023/04/Esports-General.jpg"} 
                    alt={article.title} 
                    fill
                    className={styles.gridImage}
                    unoptimized
                  />
                </div>
                <div className={styles.gridContent}>
                   <div className={styles.gridSource}>{article.source.name}</div>
                   <h4 className={styles.gridTitle}>{article.title}</h4>
                   <div className={styles.readMore}>Read Now ↗</div>
                </div>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}