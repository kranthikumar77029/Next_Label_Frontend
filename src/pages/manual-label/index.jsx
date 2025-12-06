import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { ROUTES } from '@/routes/constants';
import { useNavigate } from 'react-router-dom';
import {LabelCard} from '@/components/common/label-card';  
import { useProjects } from '@/context/ProjectContext'; 
import styles from './styles.module.css';

const ManualLabel = () => {
  const navigate = useNavigate();
  const {projects} = useProjects();

  

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
          title={project.project_title}
          description={project.description}
          tags={project.tags}
          date={project.created_at}
          onRun={() => setShowModal(true)}
          buttonText="Run Auto Labeling"
          buttonIcon="fi-rr-magic-wand"
          onPressLabelCard={()=>navigate(`/project-images/${project.project_title}/${project.id}`)}
        />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ManualLabel;
