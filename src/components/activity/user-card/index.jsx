import styles from './styles.module.css';
import ProgressBar from '@/components/ui/progress-bar';

const UserCard = ({ user, project }) => {
  const { assigned = 0, labeled = 0, name,role } = user;
  const pending = Math.max(0, assigned - labeled);
  const pct = assigned ? Math.round((labeled / assigned) * 100) : 0;

  // ---- KPI DATA IN ONE PLACE ----
  const stats = [
    { icon: "fi fi-rr-clipboard-list", label: "Assigned", value: assigned, color: "assigned" },
    { icon: "fi fi-rr-check", label: "Labeled", value: labeled, color: "labeled" },
    { icon: "fi fi-rr-clock", label: "Pending", value: pending, color: "pending" },
  ];

  return (
    <div className={styles.card}>
      
      {/* HEADER */}
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>
          <i className="fi fi-rr-user"></i>
        </div>
        <div className={styles.titleBlock}>
          <div className={styles.userName}>{name}</div>
          <div className={styles.caption}>Role: {role}</div>
        </div>
      </div>

      {/* STATS */}
      <div className={styles.statsRow}>
        {stats.map((item, index) => (
          <Stat key={index} {...item} />
        ))}
      </div>

      <ProgressBar percent={pct} />
    </div>
  );
};

// ---- REUSABLE STAT COMPONENT ----
const Stat = ({ icon, label, value, color }) => (
  <div className={styles.stat}>
    <div className={`${styles.icon} ${styles[color]}`}>
      <i className={icon}></i>
    </div>
    <div className={styles.statText}>
      <span>{label}</span>&nbsp;<strong>{value}</strong>
    </div>
  </div>
);

export default UserCard;
