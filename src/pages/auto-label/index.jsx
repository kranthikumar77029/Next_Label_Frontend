import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { ROUTES } from '@/routes/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/context/ProjectContext';
 
import AutoLabelModal from '@/components/common/auto-label-modal';
import { LabelCard } from '@/components/common/label-card';
import styles from './styles.module.css';

const AutoLabel = () => {
  const {projects} = useProjects();
  console.log("projectslist",projects);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

   
  // Handle progress simulation
  const runAutoLabel = () => {
    setProcessing(true);
    setProgress(0);
    setLogs([]);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setTimeout(() => setShowModal(false), 1000);
          return 100;
        }

        if (prev === 20) setLogs((l) => [...l, '✓ Model loaded successfully']);
        if (prev === 50) setLogs((l) => [...l, '✓ Processing batch 1/5 - Detected 12 helmets']);
        if (prev === 80) setLogs((l) => [...l, '✓ Processing batch 5/5 - Detected 8 helmets']);

        return prev + 2;
      });
    }, 100);
  };
  

  return (
    <Layout
      pageTitle="Auto Labeling Studio"
      headerActions={
        <Button icon="fi-rr-arrow-right" onClick={() => navigate(ROUTES.ANNOTATE)}>
          View Annotations
        </Button>
      }
    >
      <div className={styles.container}>
      <div className={styles.projectsList}>
      {(projects || []).map((project) => (
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

     {showModal && (
          <AutoLabelModal
            onClose={() => !processing && setShowModal(false)}
            onStart={runAutoLabel}
            processing={processing}
            progress={progress}
            logs={logs}
          />
        )}
      </div>
    </Layout>
  );
};

export default AutoLabel;
