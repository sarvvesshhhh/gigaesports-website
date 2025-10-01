import styles from './VideoCard.module.css';
import Image from 'next/image';
import { FaEye, FaThumbsUp } from 'react-icons/fa'; // Using icons we already installed

const VideoCard = ({ video }) => {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <Image src={video.thumbnail} alt={video.title} layout="fill" objectFit="cover" />
        <span className={`${styles.tag} ${video.tag === 'HIGHLIGHT' ? styles.highlight : styles.stream}`}>
          {video.tag}
        </span>
      </div>
      <div className={styles.info}>
        <p className={styles.creator}>{video.creator}</p>
        <h3 className={styles.title}>{video.title}</h3>
        <div className={styles.stats}>
          <span><FaEye /> {video.views}</span>
          <span><FaThumbsUp /> {video.likes}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;