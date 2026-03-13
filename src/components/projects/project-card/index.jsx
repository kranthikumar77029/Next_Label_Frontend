import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { KPIBox } from "@/components/common/kpi";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
// import { listImagesApi } from "@/networking/upload/uploadapi";
import { listClassesApi } from "@/networking/class-manager/classapi";
import { useProjectImages } from "@/context/ProjectImagesContext";

const ProjectCard = ({ project, onEdit, onDelete,onViewClasses }) => {

  const {
  totalImagesByProject,
  loadingByProject,
  fetchImagesByProject,
} = useProjectImages();
 const [loadingImages, setLoadingImages] = useState(true);
 const [expanded, setExpanded] = useState(false);

 const [isActive, setIsActive] = useState(() => {
  if (!project.status) return true; 
  return project.status.toLowerCase() === "active";
});

useEffect(() => {
  if (!project.status) {
    setIsActive(true);
  } else {
    setIsActive(project.status.toLowerCase() === "active");
  }
}, [project.status]);


  // const [loadingClasses, setLoadingClasses] = useState(true);
useEffect(() => {
  if (project?.id && project?.title) {
    fetchImagesByProject(project.id, project.title);
  }
}, [project.id]);
const imageCount = totalImagesByProject?.[project.id] ?? 0;
const isLoadingImages = loadingByProject?.[project.id];

   

  return (
    <div className={styles.projectCard}>
      <div className={styles.projectCardContent}>

        {/* HEADER */}
        <div className={styles.projectHeader}>
          <div className={styles.projectTitleSection}>
            <h3 className={styles.projectTitle}>{project.title}</h3>

            <div className={styles.projectDate}>
              <i
                className="fi fi-rr-calendar"
                style={{ fontSize: 11, opacity: 0.7 }}
              />
              <span>{project.date}</span>
            </div>
          </div>

        {/* <button
          className={`${styles.statusToggle} ${
            isActive ? styles.active : styles.inactive
          }`}
          onClick={() => setIsActive(prev => !prev)}
        >
          {isActive ? "Active" : "Inactive"}
        </button> */}


        </div>

        {/* DESCRIPTION */}
     <p className={styles.projectDescription}>
      {expanded
        ? project.description
        : `${project.description.slice(0, 120)}${project.description.length > 120 ? "..." : ""}`}

      {project.description.length > 120 && (
        <span
          className={styles.readMore}
          onClick={() => setExpanded(prev => !prev)}
        >
          {expanded ? " Show less" : " Read more"}
        </span>
      )}
    </p>

        {/* KPIs */}
        <KPIBox
          items={[
            {
              icon: "fi-rr-picture",
              value: isLoadingImages ? "—" : imageCount,
              label: "Images",
            },
            {
              icon: "fi-rr-palette",
              value: project.classesCount, 
              label: "Classes",
            },
          ]}
        />

        {/* ACTIONS */}
     <div className={styles.projectActions}>
          <Button
            variant="secondary"
            icon="fi-rr-edit"
            onClick={() => onEdit(project)}
          />

          <Button
            variant="secondary"
            icon="fi-rr-trash"
            onClick={() => onDelete(project)}
          />

          {/* Text button on right */}
          <Button
            variant="primary"
          onClick={() => onViewClasses(project)}
          >
            Class Manager
          </Button>
        </div>


      </div>
    </div>
  );
};

export { ProjectCard };
