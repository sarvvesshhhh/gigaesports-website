'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchShorts } from '../../lib/youtubeShorts';
import styles from './Highlights.module.css';
import Image from 'next/image';

const CATEGORIES = ["All Games", "BGMI", "Valorant", "CS2", "GTA RP", "Minecraft"];

export default function HighlightsPage() {
  const [activeCategory, setActiveCategory] = useState("All Games");
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Player State
  const [selectedIndex, setSelectedIndex] = useState(null); // Null = Grid View, Number = Player View
  const scrollContainerRef = useRef(null);

  // 1. Fetch Data on Category Change
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchShorts(activeCategory);
      setShorts(data);
      setLoading(false);
    }
    loadData();
  }, [activeCategory]);

  // 2. Scroll to selected video when Player opens
  useEffect(() => {
    if (selectedIndex !== null && scrollContainerRef.current) {
      const videoElement = scrollContainerRef.current.children[selectedIndex];
      if (videoElement) {
        videoElement.scrollIntoView({ behavior: 'auto' });
      }
    }
  }, [selectedIndex]);

  // 3. Close Player
  const closePlayer = () => setSelectedIndex(null);

  return (
    <div className={styles.pageContainer}>
      
      {/* HEADER (Only visible in Grid View) */}
      <header className={`${styles.header} ${selectedIndex !== null ? styles.hidden : ''}`}>
        <h1 className={styles.pageTitle}>GIGA SHORTS</h1>
        <div className={styles.filterBar}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.activeBtn : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* GRID VIEW */}
      <div className={`${styles.gridContainer} ${selectedIndex !== null ? styles.hidden : ''}`}>
        {loading ? (
           <div className={styles.loading}>Loading Viral Clips...</div>
        ) : (
          shorts.map((clip, index) => (
            <div 
              key={clip.id.videoId + index} 
              className={styles.shortCard}
              onClick={() => setSelectedIndex(index)} // OPEN PLAYER
            >
              <div className={styles.thumbnailWrapper}>
                <Image 
                  src={clip.snippet.thumbnails.high.url} 
                  alt={clip.snippet.title} 
                  fill
                  className={styles.thumbnail}
                  unoptimized
                />
                <div className={styles.playIcon}>▶</div>
              </div>
              <div className={styles.cardInfo}>
                 <h3 className={styles.cardTitle}>{clip.snippet.title}</h3>
                 <p className={styles.cardAuthor}>@{clip.snippet.channelTitle}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FULL SCREEN SHORTS PLAYER (The "TikTok" UI) */}
      {selectedIndex !== null && (
        <div className={styles.playerOverlay}>
          
          <button className={styles.closeBtn} onClick={closePlayer}>✕ Close</button>
          
          <div className={styles.scrollSnapContainer} ref={scrollContainerRef}>
            {shorts.map((clip, index) => (
              <div key={clip.id.videoId + index} className={styles.videoSlide}>
                
                {/* OPTIMIZATION: Only render iframe if it's the active, previous, or next video */}
                {Math.abs(selectedIndex - index) <= 1 ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${clip.id.videoId}?autoplay=${selectedIndex === index ? 1 : 0}&rel=0&modestbranding=1&controls=1&loop=1`} 
                    title={clip.snippet.title}
                    className={styles.iframe}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                  ></iframe>
                ) : (
                   /* Placeholder for off-screen videos to save memory */
                   <div className={styles.placeholder}>
                      <Image 
                        src={clip.snippet.thumbnails.high.url} 
                        fill 
                        alt="Loading" 
                        className={styles.thumbnail}
                        unoptimized
                      />
                      <div className={styles.loadingSpinner}>Loading...</div>
                   </div>
                )}

                {/* Video Info Overlay */}
                <div className={styles.videoOverlay}>
                  <h2 className={styles.overlayTitle}>{clip.snippet.title}</h2>
                  <p className={styles.overlayAuthor}>@{clip.snippet.channelTitle}</p>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}