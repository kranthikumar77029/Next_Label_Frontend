import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/button/index.jsx';
import { Layout } from '../../components/layout/index.jsx';
import { ROUTES } from '../../routes/constants.js';
import styles from './styles.module.css';

const Upload = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    setUploading(true);
    setProgress(0);

    const newImages = [];
    let loadedCount = 0;

    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            id: `${Date.now()}-${index}`,
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            url: e.target?.result,
            selected: false,
          });

          loadedCount++;
          setProgress((loadedCount / files.length) * 100);

          if (loadedCount === files.length) {
            setImages((prev) => [...prev, ...newImages]);
            setTimeout(() => {
              setUploading(false);
              setProgress(0);
            }, 500);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const toggleImageSelection = (id) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    );
  };

  const deleteSelected = () => {
    setImages((prev) => prev.filter((img) => !img.selected));
  };

  const selectAll = () => {
    setImages((prev) => prev.map((img) => ({ ...img, selected: true })));
  };

  const selectedCount = images.filter((img) => img.selected).length;
  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout
      pageTitle="Upload & Manage Data"
      headerActions={
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <Button
            variant="outline"
            icon="fi-rr-disk"
            disabled={images.length === 0}
          >
            Save Dataset
          </Button>
          <Button
            icon="fi-rr-arrow-right"
            disabled={images.length === 0}
            onClick={() => navigate(ROUTES.AUTO_LABEL)}
          >
            Next: Auto Labeling
          </Button>
        </div>
      }
    >
      <div className={styles.container}>
        <div
          className={`${styles.uploadZone} ${
            dragActive ? styles.dragActive : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleFileSelect}
        >
          <i className={`fi fi-rr-cloud-upload ${styles.uploadIcon}`}></i>
          <h3 className={styles.uploadTitle}>Upload Images</h3>
          <p className={styles.uploadText}>
            Drag & drop images here or click to browse
          </p>
          <p className={styles.uploadText}>
            Supports: JPG, PNG, JPEG • Max 50MB per file
          </p>

          <div className={styles.uploadButtons}>
            <Button variant="primary" icon="fi-rr-file">
              Browse Files
            </Button>
            <Button variant="secondary" icon="fi-rr-folder">
              Select Folder
            </Button>
          </div>

          {uploading && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {images.length > 0 && (
          <>
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  {selectedCount} of {images.length} selected
                </span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <Button variant="secondary" size="small" onClick={selectAll}>
                  Select All
                </Button>
                {selectedCount > 0 && (
                  <Button
                    variant="danger"
                    size="small"
                    icon="fi-rr-trash"
                    onClick={deleteSelected}
                  >
                    Delete ({selectedCount})
                  </Button>
                )}
              </div>
            </div>

            <div className={styles.imageGrid}>
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`${styles.imageCard} ${
                    image.selected ? styles.selected : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={image.selected}
                    onChange={() => toggleImageSelection(image.id)}
                  />
                  <div className={styles.imageWrapper}>
                    <img
                      src={image.url}
                      alt={image.name}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.imageInfo}>
                    <div className={styles.imageName}>{image.name}</div>
                    <div className={styles.imageSize}>{image.size}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

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
