import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listImagesApi, deleteImageApi } from '@/networking/upload/uploadapi';
import { Trash2 } from "lucide-react";
import styles from "./styles.module.css";

const ProjectImages = () => {
  const { selectedProject, projectId } = useParams();

  const [images, setImages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Fetch images
  // -----------------------------
  const fetchImagesProjectWise = async () => {
    const payload = {
      project_title: selectedProject,
      project_id: projectId,
    };

    try {
      const response = await listImagesApi(payload);

      setImages(response?.data?.images || []);
      setTotal(response?.data?.total || 0);
    } catch (error) {
      console.log('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImagesProjectWise();
  }, []);

  // -----------------------------
  // Delete image handler
  // -----------------------------
  const handleDelete = async (img) => {
    const confirmDelete = confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    const payload = {
      filename: img.filename,
      project_title: selectedProject,
      project_id: projectId,
    };

    try {
      await deleteImageApi(payload);

      // Remove from UI instantly
      setImages((prev) => prev.filter((item) => item.id !== img.id));
      setTotal((prev) => prev - 1);

    } catch (error) {
      console.log('Error deleting image:', error);
    }
  };

  
  if (loading) return <p>Loading images...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {selectedProject} Images ({total})
      </h2>

      {total === 0 ? (
        <p className={styles.noImages}>No images found.</p>
      ) : (
        <div className={styles.grid}>
          {images.map((img) => (
            <div key={img.id} className={styles.card}>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(img)}
              >
                <Trash2 size={16} />
              </button>

              <img
                className={styles.image}
                src={encodeURI(img.url)}
                alt={img.filename}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectImages;
