import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Layout } from '../../components/common/layout';
import { ROUTES } from '../../routes/constants';
import { uploadImagesApi } from '@/networking/upload/uploadapi';
import { useToast } from "@/hooks/use-toast";
import styles from './styles.module.css';
import { useProjects } from '@/context/ProjectContext';
import { useProjectImages } from '@/context/ProjectImagesContext';
const Upload = () => {
  const navigate = useNavigate();
  const { projects, selectedProject, setSelectedProject } = useProjects();
  const { showSuccess, showError,showInfo} = useToast();
 const { uploadedImages: images, setUploadedImages: setImages } = useProjectImages();

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [backendUploading, setBackendUploading] = useState(false);
  const [backendProgress, setBackendProgress] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  

  // =================================================================================
  // CLEAR ALL IMAGES + RESET EVERYTHING
  // =================================================================================
  const clearImages = () => {
    setImages([]);
    setProgress(0);
    setBackendProgress(0);
    setUploading(false);
    setBackendUploading(false);
    setSearchQuery("");

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (folderInputRef.current) folderInputRef.current.value = "";
  };

  // =================================================================================
  // DRAG EVENTS
  // =================================================================================
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  // =================================================================================
  // FILE HANDLING
  // =================================================================================
  const handleFiles = (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setProgress(0);

    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png)$/i)
    );

    if (validFiles.length === 0) {
      setUploading(false);
      return;
    }

    const newImages = [];
    let loaded = 0;

    validFiles.forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        newImages.push({
          id: `${Date.now()}-${index}-${file.name}`,
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          url: e.target.result,
          path: file.webkitRelativePath || file.name,
          selected: false,
          originalFile: file,
          isFromBackend: false,
        });

        loaded++;
        setProgress(Math.round((loaded / validFiles.length) * 100));

        if (loaded === validFiles.length) {
          setImages((prev) => [...prev, ...newImages]);

          setTimeout(() => {
            setUploading(false);
            setProgress(0);

            if (fileInputRef.current) fileInputRef.current.value = "";
          }, 400);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = () => fileInputRef.current?.click();
  const handleFolderSelect = () => {
    if (folderInputRef.current) folderInputRef.current.value = '';
    folderInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) handleFiles(e.target.files);
    e.target.value = '';
  };

  // =================================================================================
  // FILTER IMAGES
  // =================================================================================
  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // =================================================================================
  // SELECTION
  // =================================================================================
  const toggleImageSelection = (id) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    );
  };

  const deleteSelected = () =>
    setImages((prev) => prev.filter((img) => !img.selected));

  const selectAll = () => {
    setImages((prev) =>
      prev.map((img) =>
        filteredImages.includes(img) ? { ...img, selected: true } : img
      )
    );
  };

  const deselectAll = () => {
    setImages((prev) =>
      prev.map((img) =>
        filteredImages.includes(img) ? { ...img, selected: false } : img
      )
    );
  };

  const selectedCount = filteredImages.filter((img) => img.selected).length;

  const selectedImages = images
    .filter((img) => img.selected && !img.isFromBackend)
    .map((img) => img.originalFile);

  // =================================================================================
  // UPLOAD TO BACKEND
  // =================================================================================
  const uploadToBackend = async () => {
    if (!selectedProject?.project_title || !selectedProject?.id) {
      showInfo("Please select a project to Upload Images");
      return;
    }

    if (selectedImages.length === 0) {
      showError("No NEW images selected");
      return;
    }

    const formData = new FormData();
    formData.append("project_title", selectedProject.project_title);
    formData.append("project_id", selectedProject.id);

    selectedImages.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setBackendUploading(true);

      const res = await uploadImagesApi(formData);
      console.log("Upload success:", res.data);

      showSuccess("Images uploaded successfully!");

      
      clearImages();
    } catch (err) {
      showError(
      err?.response?.data?.message || "Upload failed!"
    );
    } finally {
      setBackendUploading(false);
    }
  };

  // =================================================================================
  // UI
  // =================================================================================

  return (
    <Layout
      pageTitle="Upload & Manage Data"
      projects={projects}
      onProjectChange={(project) => setSelectedProject(project)}
      // headerActions={
      //   <Button
      //     icon="fi-rr-arrow-right"
      //     disabled={!images.length}
      //     onClick={() => navigate(ROUTES.AUTO_LABEL)}
      //   >
      //     Next: Auto Labeling
      //   </Button>
      // }
    >
      <div className={styles.container}>

        {/* Upload Zone */}
        <div
          className={`${styles.uploadZone} ${dragActive ? styles.dragActive : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <i className={`fi fi-rr-cloud-upload ${styles.uploadIcon}`}></i>
          <h3 className={styles.uploadTitle}>Upload Images</h3>
          <p className={styles.uploadText}>Drag & drop images or click to browse</p>
          <p className={styles.uploadText}>Supports JPG, PNG, JPEG</p>

          <div className={styles.uploadButtons}>
            <Button variant="primary" icon="fi-rr-file" onClick={handleFileSelect}>
              Browse Files
            </Button>
            <Button variant="secondary" icon="fi-rr-folder" onClick={handleFolderSelect}>
              Select Folder
            </Button>
          </div>

          {uploading && (
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          )}

          {backendUploading && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${backendProgress}%`, background: 'green' }}
              />
            </div>
          )}
        </div>

        {/* Hidden Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
        <input
          ref={folderInputRef}
          type="file"
          multiple
          hidden
          onChange={handleFileChange}
          webkitdirectory=""
          directory=""
        />

        {/* Image Toolbar */}
        {images.length > 0 && (
          <>
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>
                <input
                  type="text"
                  placeholder="Search images..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <span style={{ fontSize: 'var(--font-size-sm)' }}>
                  {selectedCount} of {images.length} selected
                </span>
              </div>

              <Button
                variant="outline"
                icon="fi-rr-disk"
                disabled={backendUploading}
                onClick={uploadToBackend}
              >
                Save Dataset
              </Button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedCount !== images.length && (
                  <Button size="small" onClick={selectAll}>
                    Select All
                  </Button>
                )}
                {selectedCount === images.length && (
                  <Button size="small" onClick={deselectAll}>
                    Deselect All
                  </Button>
                )}
                {selectedCount > 0 && (
                  <Button size="small" variant="danger" onClick={deleteSelected}>
                    Delete ({selectedCount})
                  </Button>
                )}
              </div>
            </div>

            {/* Image Grid */}
            <div className={styles.imageGrid}>
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`${styles.imageCard} ${image.selected ? styles.selected : ''}`}
                >
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={image.selected}
                    onChange={() => toggleImageSelection(image.id)}
                  />

                  <div className={styles.imageWrapper}>
                    <img src={image.url} alt={image.name} className={styles.image} />
                  </div>

                  <div className={styles.imageInfo}>
                    <div className={styles.imageName}>{image.path}</div>
                    <div className={styles.imageSize}>{image.size}</div>
                    {image.isFromBackend && (
                      <div className={styles.backendTag}>Backend</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {images.length === 0 && !uploading && (
          <div className={styles.emptyState}>
            <i className={`fi fi-rr-picture ${styles.emptyIcon}`}></i>
            <div className={styles.emptyTitle}>No images uploaded yet</div>
            <p>Upload images to start building your dataset</p>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Upload;
