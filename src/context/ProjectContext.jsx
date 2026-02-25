import { createContext, useContext, useEffect, useState } from "react";
import { listProjectsApi } from "@/networking/project_hub/projectapi";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProjects, setTotalProjects] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

 const fetchProjects = async () => {
  setLoading(true);
  try {
    const res = await listProjectsApi({
      page: 1,
      page_size: 150,
    });
    if (res.status===200){
    const results = res?.data?.results || [];
    const count =
      res?.data?.total_count ??
      res?.data?.count ??
      results.length;

    setProjects(results);
    setTotalProjects(count);
    // console.log("ghjkm",count)
    }

  } catch (err) {
    console.error(
      "Project fetch failed:",
      err?.response?.data || err
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchProjects();
}, []);
// useEffect(() => {
//   console.log("Projects updated:", projects);
// }, [projects]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        totalProjects,       
        selectedProject,
        setSelectedProject,
        setProjects,
        setTotalProjects,    
        fetchProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);
