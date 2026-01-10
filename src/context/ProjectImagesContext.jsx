import { createContext, useContext, useState } from "react";
import { listImagesApi } from "@/networking/upload/uploadapi";

const ProjectImagesContext = createContext();

export const ProjectImagesProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [loading, setLoading] = useState(false);

  //  (project-wise)
  const [totalImagesByProject, setTotalImagesByProject] = useState({});
  const [loadingByProject, setLoadingByProject] = useState({});

  const fetchImagesByProject = async (projectId, projectTitle) => {
    if (!projectId) return;

   //project-wise loading
    setLoadingByProject(prev => ({
      ...prev,
      [projectId]: true,
    }));

    // global loading (old behavior)
    setLoading(true);

    try {
      const response = await listImagesApi({
        project_id: projectId,
        project_title: projectTitle,
      });

      const imagesList = response?.data?.images || [];
      const total = response?.data?.total || 0;

      // In a projectImages  Page
      setImages(imagesList);
      setTotalImages(total);

      //  (project-wise)
      setTotalImagesByProject(prev => ({
        ...prev,
        [projectId]: total,
      }));
    } catch (err) {
      console.error("Fetch Images error:", err);
    } finally {
      setLoading(false);
      setLoadingByProject(prev => ({
        ...prev,
        [projectId]: false,
      }));
    }
  };

  return (
    <ProjectImagesContext.Provider
      value={{
        images,
        setImages,
        totalImages,
        setTotalImages,
        loading,
        totalImagesByProject,
        loadingByProject,
        fetchImagesByProject,
      }}
    >
      {children}
    </ProjectImagesContext.Provider>
  );
};

export const useProjectImages = () => useContext(ProjectImagesContext);
