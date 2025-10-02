import styles from './VideoCard.module.css';
import Image from 'next/image';
import { FaEye, FaThumbsUp } from 'react-icons/fa';

const VideoCard = ({ video }) => {
  // Check if this is a YouTube video object (it has a 'snippet' property)
  const isYouTubeVideo = !!video.snippet;

  // Extract data based on the object type
  const videoId = isYouTubeVideo ? video.id.videoId : video.id;
  const title = isYouTubeVideo ? video.snippet.title : video.title;
  const creator = isYouTubeVideo ? video.snippet.channelTitle : video.creator;
  const thumbnail = isYouTubeVideo ? video.snippet.thumbnails.high.url : video.thumbnail;
  
  return (
    <a 
      href={isYouTubeVideo ? `https://www.youtube.com/watch?v=${videoId}` : '#'} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={styles.card}
    >
      <div className={styles.thumbnail}>
        <Image src={thumbnail} alt={title} layout="fill" objectFit="cover" />
        {/* We can hide the tag for now, or add logic for it later */}
      </div>
      <div className={styles.info}>
        <p className={styles.creator}>{creator}</p>
        <h3 className={styles.title}>{title}</h3>
        
        {/* Only show stats if it's NOT a youtube video (i.e., our old dummy data) */}
        {!isYouTubeVideo && (
          <div className={styles.stats}>
            <span><FaEye /> {video.views}</span>
            <span><FaThumbsUp /> {video.likes}</span>
          </div>
        )}
      </div>
    </a>
  );
};

export default VideoCard;