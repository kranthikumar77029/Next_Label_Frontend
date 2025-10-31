import { Button } from '@/components/button';
import { Layout } from '@/components/layout';
import { ROUTES } from '@/routes/constants';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const ManualLabel = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 101,
      title: 'Helmet Detection',
      images: 250,
      lastEdited: 'Just now',
      done: 30,
    },
    {
      id: 102,
      title: 'Traffic Signs',
      images: 180,
      lastEdited: 'Yesterday',
      done: 10,
    },
  ];

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
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <div className={styles.projectMeta}>
                    <span>
                      <i className="fi fi-rr-picture"></i> {project.images} images
                    </span>
                    <span>
                      <i className="fi fi-rr-clock"></i> {project.lastEdited}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="primary"
                icon="fi-rr-edit"
                onClick={() =>
                  navigate(
                    `${ROUTES.ANNOTATE}?projectId=${project.id}&batchId=batch-1&total=${project.images}&done=${project.done}`
                  )
                }
                style={{ marginTop: 'var(--spacing-md)', width: '100%' }}
              >
                Start Manual Annotation
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ManualLabel;
