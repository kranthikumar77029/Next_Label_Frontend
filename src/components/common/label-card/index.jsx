import { Button } from "@/components/ui/button";
import styles from "./styles.module.css";

const LabelCard = ({
  project,
  onRun,
  buttonText = "Run Auto Labeling",
  buttonIcon = "fi-rr-magic-wand",
  onPressLabelCard=()=>{}
}) => {
  return (
    <div className={styles.projectCard} onClick={onPressLabelCard}>
      <div className={styles.projectHeader}>
        <div>
          <h3 className={styles.projectTitle}>{project.project_title}</h3>
           <p className={styles.description}>{project.description}</p>
           <div className={styles.projectMeta}>
             <span>
              <i className="fi fi-rr-tags"></i> {project.tags}
            </span>
             <span>
              <i className="fi fi-rr-clock"></i>{" "}
              {new Date(project.created_at).toLocaleString()}
            </span>
          </div>
        </div>
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
