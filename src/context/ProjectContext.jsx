import { createContext, useContext, useEffect, useState } from "react";
import {  listProjectsApi } from '@/networking/project_hub/projectapi';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch project list 
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await listProjectsApi({
          params: { page: 1, page_size: 150 }
        });

        setProjects(res?.data?.results || []);
      } catch (err) {
        console.error("Project fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{ projects, loading }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);
