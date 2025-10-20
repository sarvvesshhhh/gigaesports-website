'use client';
import styles from './TeamCard.module.css';
import Image from 'next/image';
import Link from 'next/link';

const TeamCard = ({ team }) => {
  return (
    // Updated Link to include the team name as a search parameter
    <Link href={`/teams/${team.id}?name=${encodeURIComponent(team.name)}`} className={styles.card}>
      <Image 
        src={team.image_url || '/images/default-team-logo.png'}
        alt={`${team.name} logo`}
        width={100}
        height={100}
      />
      <h3 className={styles.teamName}>{team.name}</h3>
    </Link>
  );
};

export default TeamCard;