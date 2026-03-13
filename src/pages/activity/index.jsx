import { Layout } from '@/components/common/layout';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

import { KPIBox } from '@/components/common/kpi';
import UserCard from '@/components/activity/user-card';
import { useProjects } from '@/context/ProjectContext';

import { getTrackingStatsApi } from '@/networking/activity/activityapi';

const Activity = () => {
  const { selectedProject} = useProjects();
  const [activityData, setActivityData] = useState(null);

  const fetchActivity = async () => {
    try {
      const res = await getTrackingStatsApi(selectedProject.id);

      if (res.status === 200) {
        setActivityData(res.data);
      }
    } catch (err) {
      console.error("Activity fetch failed", err);
    }
  };

 useEffect(() => {
  if (!selectedProject?.id) return;

  setActivityData(null); // reset
  fetchActivity();
}, [selectedProject?.id]);

  const rows = activityData?.individual_stats || [];
  const overall = activityData?.project_overall || {};

  return (
    <Layout pageTitle="Task Activity">
      <div className={styles.container}>

        <KPIBox
          items={[
            {
              icon: "fi fi-rr-clipboard-list",
              label: "Total Images",
              value: overall.total_images || 0,
              color: "assigned"
            },
            {
              icon: "fi fi-rr-check",
              label: "Total Labeled",
              value: overall.total_labeled || 0,
              color: "labeled"
            },
            {
              icon: "fi fi-rr-clock",
              label: "Total Pending",
              value: overall.total_left || 0,
              color: "pending"
            }
          ]}
          customKpiCardStyles={styles.activity_KpiCard}
        />

        <div className={styles.cardsGrid}>
          {rows.map((user) => (
            <UserCard
              key={user.member_id}
              user={{
                id: user.member_id,
                role:user.role,
                name: user.member_name,
                assigned: user.assigned,
                labeled: user.labeled,
                pending: user.pending,
                progress: user.progress
              }}
            />
          ))}
        </div>

      </div>
    </Layout>
  );
};

export default Activity;