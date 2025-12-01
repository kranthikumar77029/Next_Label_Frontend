import styles from "./styles.module.css";
 
import { KPIBox } from "@/components/common/kpi";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
 

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className={styles.projectCard}>
      <div className={styles.projectCardContent}>

        {/* HEADER */}
        <div className={styles.projectHeader}>
          <div className={styles.projectTitleSection}>
            <h3 className={styles.projectTitle}>{project.title}</h3>

            <div className={styles.projectDate}>
              <i className="fi fi-rr-calendar" style={{ fontSize: 11, opacity: 0.7 }} />
              <span>{project.date}</span>
            </div>
          </div>

          {/* Replaced custom badge with your StatusBadge component */}
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
        { icon: "fi-rr-picture", value: project.images, label: "Images" },
        { icon: "fi-rr-palette", value: project.classes, label: "Classes" },
        // { icon: "fi-rr-check", value: project.accuracy, label: "Accuracy" },
         
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

export {ProjectCard};