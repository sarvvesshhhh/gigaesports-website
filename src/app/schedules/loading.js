import styles from './SchedulesPage.module.css';

const SkeletonCard = () => ( <div className={styles.skeletonCard}></div> );

export default function Loading() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Matches & Schedules</h1>
      <div className={styles.grid}>
        {/* Adjust the number of skeleton cards if needed */}
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
      </div>
    </div>
  );
}