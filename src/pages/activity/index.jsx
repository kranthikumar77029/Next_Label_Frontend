import { Layout } from '@/components/common/layout';
import {  useState } from 'react';
import styles from './styles.module.css';
 
 
import { KPIBox } from '@/components/common/kpi';
import UserCard from '@/components/activity/user-card';

const Activity = () => {
  const [project, setProject] = useState('helmet-detection');

  const data = {
    'helmet-detection': [
      { id: 1, name: 'John Doe', assigned: 50, labeled: 30 },
      { id: 2, name: 'Priya S', assigned: 40, labeled: 40 },
      { id: 3, name: 'Anil K', assigned: 30, labeled: 10 },
    ],
    'traffic-signs': [
      { id: 1, name: 'John Doe', assigned: 60, labeled: 20 },
      { id: 4, name: 'Sara M', assigned: 60, labeled: 45 },
    ],
  };

  const rows = data[project] || [];

  const totals = rows.reduce(
    (acc, r) => ({
      assigned: acc.assigned + r.assigned,
      labeled: acc.labeled + r.labeled,
    }),
    { assigned: 0, labeled: 0 }
  );

  const pending = totals.assigned - totals.labeled;

  return (
    <Layout
      pageTitle="Task Activity"
      project={project}
      onProjectChange={setProject}
    >
      <div className={styles.container}>
        <KPIBox
          items={[
            { icon: "fi fi-rr-clipboard-list", label: "Total Assigned", value: totals.assigned, color: "assigned" },
            { icon: "fi fi-rr-check", label: "Total Labeled", value: totals.labeled, color: "labeled" },
            { icon: "fi fi-rr-clock", label: "Total Pending", value: pending, color: "pending" },
          ]}
          customKpiCardStyles={styles.activity_KpiCard}
        />

        <div className={styles.cardsGrid}>
          {rows.map((user) => (
            <UserCard key={user.id} user={user} project={project} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Activity;
