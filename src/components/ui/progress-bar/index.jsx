import styles from './styles.module.css';

const ProgressBar = ({ percent }) => (
  <div className={styles.progressGroup}>
    <div className={styles.progressBar}>
      <div className={styles.progressFill} style={{ width: `${percent}%` }} />
    </div>
    <span className={styles.progressText}>{percent}%</span>
  </div>
);

export default ProgressBar;
