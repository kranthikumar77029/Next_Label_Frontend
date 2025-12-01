import { Layout } from '@/components/common/layout';
import styles from './styles.module.css';

const TeamLabel = () => {
  return (
    <Layout pageTitle="Team Labeling Workspace">
      <div className={styles.container}>
        <p>Welcome to the team labeling workspace.</p>
      </div>
    </Layout>
  );
};

export default TeamLabel;
