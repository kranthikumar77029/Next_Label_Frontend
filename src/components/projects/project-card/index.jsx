import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { KPIBox } from "@/components/common/kpi";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { listImagesApi } from "@/networking/upload/uploadapi";
import { listClassesApi } from "@/networking/class-manager/classapi";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [imageCount, setImageCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // ---------------------------
  // Fetch image count
  // ---------------------------
   const fetchImagesProjectWise = async () => {
      try {
        const response = await listImagesApi({
          project_title: project.title,
          project_id: project.id,
        });

        setImageCount(response?.data?.total || 0);
      } catch (error) {
        console.error("Error fetching image count:", error);
      } finally {
        setLoadingImages(false);
      }
    };
  useEffect(() => {
   fetchImagesProjectWise();
  }, [project.id]);

  // ---------------------------
  // Fetch class count
  // ---------------------------
  const fetchClasses = async () => {
      try {
        const response = await listClassesApi(project.title);
        setClassCount(response?.data?.length || 0);
      } catch (error) {
        console.error("Error fetching class count:", error);
      } 
      finally {
        setLoadingClasses(false);
      }
    };
  useEffect(() => {
   fetchClasses();
  }, [project.title]);

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

          <StatusBadge
            status={project.status?.toLowerCase().trim()}
            text={project.status}
          />
        </div>

        {/* DESCRIPTION */}
        <p className={styles.projectDescription}>{project.description}</p>

        {/* KPIs */}
        <KPIBox
          items={[
            {
              icon: "fi-rr-picture",
              value: loadingImages ? "—" : imageCount,
              label: "Images",
            },
            {
              icon: "fi-rr-palette",
              value: loadingClasses ? "—" : classCount,
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
        </div>

      </div>
    </div>
  );
};

export { ProjectCard };
