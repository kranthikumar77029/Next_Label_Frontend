import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import styles from "./styles.module.css";

const LabelCard = ({ 
  project,
  onRun,  
  showStatus = true,
  buttonText = " ",
  buttonIcon=" " 
   }) => {
  return (
    <div className={styles.projectCard}>
      <div className={styles.projectHeader}>
        <div>
          <h3 className={styles.projectTitle}>{project.title}</h3>

          <div className={styles.projectMeta}>
            <span>
              <i className="fi fi-rr-picture"></i> {project.images} images
            </span>

            <span>
              <i className="fi fi-rr-clock"></i> {project.lastRun}
            </span>
          </div>
        </div>

        {showStatus && (
          <StatusBadge
            text={project.status}
            status={project.status?.toLowerCase().trim()}
          />
        )}
      </div>

      <Button
        variant="primary"
        icon={buttonIcon}
        onClick={onRun}
        fullWidth
      >
        {buttonText}
      </Button>
    </div>
  );
};

export { LabelCard };
