import { Sidebar } from "@/components/common/sidebar/index.jsx";
import { ProjectSelector } from "../project-selector/index.jsx";
import styles from "./styles.module.css";

const Layout = ({
  children,
  pageTitle,
  showProjectSelector = true,
  headerActions,
  project,
  onProjectChange
}) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>{pageTitle}</h1>

            {showProjectSelector && (
              <div className={styles.projectSelect}>
                <ProjectSelector value={project} onChange={onProjectChange} />
              </div>
            )}
          </div>

          {headerActions}
        </header>

        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
};

export { Layout };
