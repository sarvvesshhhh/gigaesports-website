import styles from './CreatorHighlights.module.css';
import VideoCard from './VideoCard';

// Placeholder data - we can replace this with real data later
const dummyVideos = [
  { id: 1, creator: 'Mortal', title: 'INSANE 1v4 Clutch - BGMI Pro League', views: '3.2M', likes: '280K', thumbnail: '/images/placeholder-thumb1.jpg', tag: 'HIGHLIGHT' },
  { id: 2, creator: 'TenZ', title: 'INSANE ACE on Bind - Valorant Champions...', views: '2.1M', likes: '145K', thumbnail: '/images/placeholder-thumb2.jpg', tag: 'HIGHLIGHT' },
  { id: 3, creator: 'Scout', title: 'BGMI Ranked Push - Road to Conqueror', views: '1.2M', likes: '89K', thumbnail: '/images/placeholder-thumb3.jpg', tag: 'STREAM' },
  { id: 4, creator: 'Faker', title: 'Perfect Game - Azir Montage vs Gen.G', views: '278K', likes: '12.5K', thumbnail: '/images/placeholder-thumb4.jpg', tag: 'HIGHLIGHT' },
];


const CreatorHighlights = () => {
  return (
    <section className={styles.highlightsSection}>
      <div className={styles.header}>
        <h2>Creator Highlights</h2>
        <button>View All Updates</button>
      </div>
      <div className={styles.videoGrid}>
        {dummyVideos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
};

export default CreatorHighlights;