import styles from './styles.module.css';

const StatsCard = ({ stats }) => {
  return (
    <div className={styles.stats}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className={`fi ${stat.icon}`}></i>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statValue}>{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
export {StatsCard}