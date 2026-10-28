import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { ROUTES } from '@/routes/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/context/ProjectContext';
import { useProjectImages } from '@/context/ProjectImagesContext';
import NoDataFound from '@/assets/no-data-found.svg';
import AutoLabelModal from '@/components/common/auto-label-modal';
import { LabelCard } from '@/components/common/label-card';
import { useAutoLabel } from '@/context/AutoLabelContext';

import styles from './styles.module.css';
import { useToast } from '@/hooks/use-toast';

const AutoLabel = () => {
  const { projects, selectedProject, setSelectedProject } = useProjects();
  const { totalImagesByProject, fetchImagesByProject } = useProjectImages();
  const { runAutoLabel: runAutoLabelContext } = useAutoLabel();
  const { showError, showSuccess } = useToast();
  // console.log("selectedProject",selectedProject);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [_page, setPage] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.project_title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesSearch;
  });

  // Handle progress simulation
  const runAutoLabel = async (formData) => {
    if (!selectedProject?.id) return;

    if (formData.modelType === 'custom' && !formData.customModel?.trim()) {
      showError('Please enter custom model name');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setLogs([]);

    try {
      //  Call context function (this triggers both APIs)
      await runAutoLabelContext(formData, selectedProject);

      showSuccess('Autolabelling Successful');

      await simulateProgress(formData);
    } catch (error) {
      setProcessing(false);

      showError(
        error?.response?.data?.detail ||
          error?.message ||
          'Auto Labelling failed'
      );
    }
  };

  const simulateProgress = (formData) => {
    const imageCount = totalImagesByProject?.[selectedProject?.id] ?? 0;
    const classList = formData.classes
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const totalSteps = classList.length + 2;
    let step = 0;

    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLogs = [...prev];
        if (step === 0) {
          newLogs.push('✓ Model loaded successfully');
        } else if (step <= classList.length) {
          newLogs.push(
            imageCount === 0
              ? `No images to detect for "${classList[step - 1]}"`
              : `✓ Detecting "${classList[step - 1]}"`
          );
        } else {
          newLogs.push(
            imageCount === 0
              ? ' Auto labeling skipped due to no images'
              : '✓ Auto labeling completed'
          );
        }

        return newLogs;
      });

      setProgress(Math.round(((step + 1) / totalSteps) * 100));
      step++;

      if (step >= totalSteps) {
        clearInterval(interval);
        setProcessing(false);
        setTimeout(() => setShowModal(false), 3000);
      }
    }, 800);
  };

  return (
    <Layout
      pageTitle="Auto Labeling Studio"
      searchBox={
        <div className={styles.searchBox}>
          <i className="fi-rr-search" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      }
      // headerActions={
      //   <Button icon="fi-rr-arrow-right" onClick={() => navigate(ROUTES.ANNOTATE)}>
      //     View Annotations
      //   </Button>
      // }
    >
      <div className={styles.container}>
        <div className={styles.projectsList}>
          {(filteredProjects || []).map((project) => (
            <LabelCard
              key={project.id}
              project={project}
              title={project.project_title}
              description={project.description}
              tags={project.tags}
              date={project.created_at}
              onRun={() => {
                setSelectedProject(project);
                fetchImagesByProject(project.id, project.project_title);
                setShowModal(true);
              }}
              buttonText="Run Auto Labeling"
              buttonIcon="fi-rr-magic-wand"
              onOpenImages={() =>
                navigate(
                  `/project-images/${project.project_title}/${project.id}`
                )
              }
            />
          ))}
          {/* No projects at all */}
          {filteredProjects.length === 0 && (
            <div className={styles.emptyState}>
              <img
                src={NoDataFound}
                alt="No projects found"
                className={styles.emptyStateimg}
              />
              <p>No projects found</p>
            </div>
          )}
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
