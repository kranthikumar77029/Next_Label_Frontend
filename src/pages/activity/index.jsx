import { Layout } from '@/components/layout';
import { useMemo, useState } from 'react';
import styles from './styles.module.css';

const Activity = () => {
  const [project, setProject] = useState('Helmet Detection');
  const projects = ['Helmet Detection', 'Traffic Signs'];

  const data = useMemo(
    () => ({
      'Helmet Detection': [
        { id: 1, name: 'John Doe', assigned: 50, labeled: 30 },
        { id: 2, name: 'Priya S', assigned: 40, labeled: 40 },
        { id: 3, name: 'Anil K', assigned: 30, labeled: 10 },
      ],
      'Traffic Signs': [
        { id: 1, name: 'John Doe', assigned: 60, labeled: 20 },
        { id: 4, name: 'Sara M', assigned: 60, labeled: 45 },
      ],
    }),
    []
  );

  const rows = data[project] || [];
  const totals = rows.reduce(
    (acc, r) => {
      acc.assigned += r.assigned;
      acc.labeled += r.labeled;
      return acc;
    },
    { assigned: 0, labeled: 0 }
  );
  const pending = Math.max(0, totals.assigned - totals.labeled);

  return (
    <Layout
      pageTitle="Task Activity"
      headerActions={
        <select
          className={styles.select}
          value={project}
          onChange={(e) => setProject(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      }
    >
      <div className={styles.container}>
        {/* Summary KPIs */}
        <div className={styles.summaryBar}>
          <div className={`${styles.kpi} ${styles.assignedKpi}`}>
            <i className="fi fi-rr-clipboard-list"></i>
            <div className={styles.summaryKpiCounts}>
              <span>Total Assigned</span>
              <strong>{totals.assigned}</strong>
            </div>
          </div>
          <div className={`${styles.kpi} ${styles.labeledKpi}`}>
            <i className="fi fi-rr-check"></i>
            <div className={styles.summaryKpiCounts}>
              <span>Total Labeled</span>
              <strong>{totals.labeled}</strong>
            </div>
          </div>
          <div className={`${styles.kpi} ${styles.pendingKpi}`}>
            <i className="fi fi-rr-clock"></i>
            <div className={styles.summaryKpiCounts}>
              <span>Total Pending</span>
              <strong>{pending}</strong>
            </div>
          </div>
        </div>

        {/* Team Activity Cards */}
        <div className={styles.cardsGrid}>
          {rows.map((r) => {
            const pend = Math.max(0, r.assigned - r.labeled);
            const pct = r.assigned
              ? Math.round((r.labeled / r.assigned) * 100)
              : 0;

            return (
              <div key={r.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatar}>
                    <i className="fi fi-rr-user"></i>
                  </div>
                  <div className={styles.titleBlock}>
                    <div className={styles.userName}>{r.name}</div>
                    <div className={styles.caption}>Project: {project}</div>
                  </div>
                </div>

                <div className={styles.statsRow}>
                  <div className={styles.stat}>
                    <div className={`${styles.icon} ${styles.assigned}`}>
                      <i className="fi fi-rr-clipboard-list"></i>
                    </div>
                    <div className={styles.statText}>
                      <span>Assigned</span> &nbsp;
                      <strong>{r.assigned}</strong>
                    </div>
                  </div>

                  <div className={styles.stat}>
                    <div className={`${styles.icon} ${styles.labeled}`}>
                      <i className="fi fi-rr-check"></i>
                    </div>
                    <div className={styles.statText}>
                      <span>Labeled</span> &nbsp;
                      <strong>{r.labeled}</strong>
                    </div>
                  </div>

                  <div className={styles.stat}>
                    <div className={`${styles.icon} ${styles.pending}`}>
                      <i className="fi fi-rr-clock"></i>
                    </div>
                    <div className={styles.statText}>
                      <span>Pending</span> &nbsp;
                      <strong>{pend}</strong>
                    </div>
                  </div>
                </div>

                <div className={styles.progressGroup}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={styles.progressText}>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Activity;
