import styles from './styles.module.css';

const ProcessingSection = ({ progress, logs }) => (
  <div className={styles.processingSection}>
    <div className={styles.progressInfo}>
      <span>Processing Images...</span>
      <span className={styles.progressPercent}>{progress}%</span>
    </div>

    <div className={styles.progressBar}>
      <div className={styles.progressFill} style={{ width: `${progress}%` }} />
    </div>

    <div className={styles.logsPanel}>
      <div className={styles.logsHeader}>Live Processing Log</div>
      <div className={styles.logsContent}>
        {logs.map((log, i) => (
          <div key={i} className={styles.logEntry}>{log}</div>
        ))}
      </div>
    </div>
  </div>
);

export  {ProcessingSection};
