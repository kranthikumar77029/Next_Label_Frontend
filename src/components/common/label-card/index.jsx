import { Button } from "@/components/ui/button";
import styles from "./styles.module.css";
import { useState } from "react";

const LabelCard = ({

  project,
  onRun,
  buttonText = "Run Auto Labeling",
  buttonIcon = "fi-rr-magic-wand",
  onPressLabelCard=()=>{}
}) => {
    const [expanded, setExpanded] = useState(false);
  return (
    <div className={styles.projectCard} onClick={onPressLabelCard}>
      <div className={styles.projectHeader}>
        <div>
          <h3 className={styles.projectTitle}>{project.project_title}</h3>
          <p className={styles.description}>
            {expanded
              ? project.description
              : `${project.description?.slice(0, 120)}${
                  project.description?.length > 120 ? "..." : ""
                }`}

            {project.description?.length > 120 && (
              <span
                className={styles.readMore}
                onClick={() => setExpanded(prev => !prev)}
              >
                {expanded ? " Show less" : " Read more"}
              </span>
            )}
          </p>
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
        onClick={(e) => {
            e.stopPropagation(); 
            onRun();
          }}
        fullWidth
      >
        {buttonText}
      </Button>
    </div>
  );
};

export { LabelCard };
