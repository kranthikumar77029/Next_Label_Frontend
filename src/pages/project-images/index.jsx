import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listImagesApi, deleteImageApi } from '@/networking/upload/uploadapi';
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from '../../routes/constants';
import { Button } from '@/components/ui/button';
import { Trash2 } from "lucide-react";
import styles from "./styles.module.css";

const ProjectImages = () => {
  const navigate = useNavigate();
  const { selectedProject, projectId } = useParams();
  const [previewImage, setPreviewImage] = useState(null);
  const [images, setImages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError, showWarning} = useToast();

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
       showError(
      error?.response?.data?.message || "Failed to fetch Images"
    );
    }
     finally {
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
    showWarning("Are you sure you want to delete this image?")
    // const confirmDelete = confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    const payload = {
      filename: img.filename,
      project_title: selectedProject,
      project_id: projectId,
    };

    try {
      await deleteImageApi(payload);
      showSuccess("Image deleted successfully")
      // Remove from UI instantly
      setImages((prev) => prev.filter((item) => item.id !== img.id));
      setTotal((prev) => prev - 1);

    } catch (error) {
       showError(
      err?.response?.data?.message || "Failed to delete image"
    );
    }
  };

  
  if (loading) return <p>Loading images...</p>;

  return (
    <div className={styles.container}>
     <div className={styles.header}>
        {/* LEFT: Back Arrow */}
        <button
          className={styles.backBtn}
          onClick={() => navigate(ROUTES.AUTO_LABEL)}
          aria-label="Back"
        >
          <i className="fi-rr-arrow-left" />
        </button>

        {/* CENTER: Title */}
        <h2 className={styles.title}>
          {selectedProject} Images ({total})
        </h2>

        {/* RIGHT: Action Button */}
        <Button
          icon="fi-rr-arrow-right"
          onClick={() => navigate(ROUTES.ANNOTATE)}
        >
          View Annotations
        </Button>
      </div>

      {/* <Button
           icon="fi-rr-arrow-right"
           disabled={!images.length}
           onClick={() => navigate(ROUTES.AUTO_LABEL)}
        >
           Next: Auto Labeling
         </Button> */}

      {total === 0 ? (
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
   {previewImage && previewImage.url && (
  <div
    className={styles.previewOverlay}
    onClick={() => setPreviewImage(null)}
  >
    <div
      className={styles.previewModal}
      onClick={(e) => e.stopPropagation()}
    >
      {/* IMAGE */}
      <div className={styles.imageWrapper}>
        <img
          src={previewImage.url}
          alt={previewImage.filename || 'preview'}
          className={styles.previewImage}
        />

        {/* CLOSE BUTTON */}
        <button
          className={styles.closeBtn}
          onClick={() => setPreviewImage(null)}
        >
          ✕
        </button>
      </div>

      {/* OPTIONAL FILENAME */}
      <p className={styles.previewName}>{previewImage.filename}</p>
    </div>
  </div>
)}


    </div>
    
  );
};

export default ProjectImages;
