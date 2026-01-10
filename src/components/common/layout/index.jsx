import { Sidebar } from "@/components/common/sidebar/index.jsx";
import { ProjectSelector } from "../project-selector/index.jsx";
import styles from "./styles.module.css";
import { useProjects } from "@/context/ProjectContext.jsx";

const Layout = ({
  children,
  pageTitle,
  showProjectSelector = true,
  headerActions,
  searchBox,
}) => {
   
  const { projects, selectedProject, setSelectedProject } = useProjects();
  const selectedValue = selectedProject?.id || "";
;
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>{pageTitle}</h1>

            {showProjectSelector && (
              <div className={styles.projectSelect}>
                <ProjectSelector
                  projects={projects}
                  value={selectedProject}
                  onChange={setSelectedProject}
                />
              </div>
            )}
          </div>

          {headerActions}
          {searchBox}
        </header>

        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
};

export { Layout };
