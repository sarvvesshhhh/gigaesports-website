import styles from './GameSelector.module.css';
import Image from 'next/image';
import Link from 'next/link';

// This map connects the game's "slug" from the API to your local image file.
const gameIconMap = {
  'league-of-legends': '/images/lol-icon.png',
  'cs-go': '/images/csgo-icon.png',
  'valorant': '/images/valorant-icon.png',
  'dota-2': '/images/dota2-icon.png',
  'ow': '/images/overwatch-icon.png',
  'rl': '/images/rocketleague-icon.png',
  'fifa': '/images/fifa-icon.png',
  'pubg': '/images/pubg-icon.png',
  'cod-mw': '/images/cod-icon.png',
  
};

async function getGames() {
  const url = `https://api.pandascore.co/videogames?sort=name&per_page=12&token=${process.env.PANDASCORE_API_KEY}`;
  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

const GameSelector = async () => {
  const games = await getGames();

  return (
    <div className={styles.selectorBar}>
      <h3 className={styles.title}>Select Esport</h3>
      <div className={styles.gameList}>
        {games.map(game => (
          <Link href={`/schedules?game=${game.slug}`} key={game.id} className={styles.gameItem}>
            <div className={styles.gameIcon}>
              {/* This now uses your custom image map first */}
              <Image 
                src={gameIconMap[game.slug] || game.image_url || '/images/default-team-logo.png'} 
                alt={game.name} 
                layout="fill" 
                objectFit="contain" 
              />
            </div>
            <span>{game.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GameSelector;