import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { ROUTES } from '@/routes/constants';
import { useNavigate } from 'react-router-dom';
import {LabelCard} from '@/components/common/label-card';   // ⬅ import your component
import styles from './styles.module.css';

const ManualLabel = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 101,
      title: 'Helmet Detection',
      images: 250,
      lastRun: 'Just now',
      done: 30,
    },
    {
      id: 102,
      title: 'Traffic Signs',
      images: 180,
      lastRun: 'Yesterday',
      done: 10,
    },
  ];

  const handleOpenProject = (project) => {
    navigate(
      `${ROUTES.ANNOTATE}?projectId=${project.id}&batchId=batch-1&total=${project.images}&done=${project.done}`
    );
  };

  return (
    <Layout
      pageTitle="Manual Annotation Studio"
      headerActions={
        <Button
          icon="fi-rr-picture"
          onClick={() =>
            navigate(`${ROUTES.ANNOTATE}?projectId=demo&batchId=general&total=0&done=0`)
          }
        >
          Open Annotation Canvas
        </Button>
      }
    >
      <div className={styles.container}>
        <div className={styles.projectsList}>
          {projects.map((project) => (
            <LabelCard
              key={project.id}
              project={project}
              images={project.images}
              lastRun={project.lastRun}
              done={project.done}
              showStatus={false}
              buttonIcon='fi-rr-edit'
              buttonText='Run Manual Labeling'
              onRun={() => handleOpenProject(project)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ManualLabel;
