import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { deleteImageApi,deleteAllImagesApi } from '@/networking/upload/uploadapi';
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from '../../routes/constants';
import { Button } from '@/components/ui/button';
import { Trash2 } from "lucide-react";
import styles from "./styles.module.css";
import { useProjectImages } from '@/context/ProjectImagesContext';

const ProjectImages = () => {
  const navigate = useNavigate();
  const { selectedProject, projectId } = useParams();
  const { showSuccess, showError } = useToast();

  const {
    images,
    totalImages,
    loading,
    fetchImagesByProject,
    setImages,
    setTotalImages,
  } = useProjectImages();

  const [previewImage, setPreviewImage] = useState(null);

  // -----------------------------
  // Fetch images on load
  // -----------------------------
  useEffect(() => {
    fetchImagesByProject(projectId, selectedProject);
  }, [projectId, selectedProject]);

  // -----------------------------
  // Delete image
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

      showSuccess("Images deleted successfully");

      // 🔥 Update context state
      setImages(prev => prev.filter(item => item.id !== img.id));
      setTotalImages(prev => Math.max(prev - 1, 0));

    } catch (error) {
      showError(
        error?.response?.data?.message || "Failed to delete image"
      );
    }
  };

  const handleDeleteAll = async (img) => {
    const confirmDelete = confirm("Are you sure you want to delete All images?");
    if (!confirmDelete) return;

    const payload = {
      project_title: selectedProject,
      project_id: projectId,
    };

    try {
      await deleteAllImagesApi(payload);

      showSuccess("Image deleted successfully");

      // 🔥 Update context state
      setImages([]);
      setTotalImages(0);

    } catch (error) {
      showError(
        error?.response?.data?.message || "Failed to delete image"
      );
    }
  };

  if (loading) return <p>Loading images...</p>;
  console.log("Images from context:", images);
console.log("Total images:", totalImages);


  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => navigate(ROUTES.AUTO_LABEL)}
        >
        <i className="fi-rr-caret-left" /> 
        </button>

        <h2 className={styles.title}>
          {selectedProject} Images ({totalImages})
        </h2>

        <Button size="big" variant="danger" onClick={handleDeleteAll} >
          Delete All
        </Button>

        <Button
          icon="fi-rr-arrow-right"
          disabled={totalImages === 0}
          onClick={() => navigate(ROUTES.ANNOTATE)}
        >
          View Annotations
        </Button>
      </div>

      {/* CONTENT */}
      {totalImages === 0 ? (
        <p className={styles.noImages}>No images found.</p>
      ) : (
        <div className={styles.grid}>
          {images.map((img) => (
            <div key={img.id || img.filename} className={styles.card}>
              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(img);
                }}
              >
                <Trash2 size={16} />
              </button>

              <img
                className={styles.image}
                src={encodeURI(img.url)}
                alt={img.filename}
                onClick={() => setPreviewImage(img)}
              />
            </div>
          ))}
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewImage && (
        <div
          className={styles.previewOverlay}
          onClick={() => setPreviewImage(null)}
        >
          <div
            className={styles.previewModal}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage.url}
              alt={previewImage.filename}
              className={styles.previewImage}
            />
            <button
              className={styles.closeBtn}
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>
            <p className={styles.previewName}>
              {previewImage.filename}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectImages;
