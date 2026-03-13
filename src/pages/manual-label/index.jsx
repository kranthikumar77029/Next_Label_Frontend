import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { ROUTES } from '@/routes/constants';
import { useNavigate } from 'react-router-dom';
import {LabelCard} from '@/components/common/label-card';  
import { useProjects } from '@/context/ProjectContext'; 
import NoDataFound from "@/assets/no-data-found.svg";
import styles from './styles.module.css';

const ManualLabel = () => {
 const [search, setSearch] = useState('');
 const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const {projects} = useProjects();

   const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.project_title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

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
            navigate(`${ROUTES.MANUAL_ANNOTATION}?projectId=demo&batchId=general&total=0&done=0`)
          }
        >
          Open Annotation Canvas
        </Button>
      }
    >
      <div className={styles.container}>
          <div className={styles.searchBox}>
             <i className="fi-rr-search" />
             <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1);}}
             />
          </div>
        <div className={styles.projectsList}>
          {filteredProjects.map((project) => (
         <LabelCard
          key={project.id}
          project={project}
          title={project.project_title}
          description={project.description}
          tags={project.tags}
          date={project.created_at}
        onRun={() =>
    navigate(`/manual_annotation/${project.project_title}/${project.id}`)
  }
          buttonText="Run Manual Labeling"
          buttonIcon="fi-rr-edit"
          onPressLabelCard={()=>navigate(`/project-images/${project.project_title}/${project.id}`)}
        />
          ))}
        </div>
        {/* No projects at all */}
          {filteredProjects.length === 0 && (
            <div className={styles.emptyState}>
              <img src={NoDataFound} alt="No projects available" className={styles.emptyStateimg} />
                <p>No projects available</p>
             </div>
          )}
        
      </div>
    </Layout>
  );
};

export default ManualLabel;
