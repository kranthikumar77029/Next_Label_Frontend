import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { Input } from '@/components/ui/input';
import { exportapi } from '@/networking/export/exportapi';
import { useProjects } from "@/context/ProjectContext";
import { useProjectImages } from '@/context/ProjectImagesContext';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';


// --------------------------------------------
// Reusable Components
// --------------------------------------------

const SplitInput = ({ value, label, onChange }) => (
  <div className={styles.splitInput}>
    <Input
      type="number"
      min="0"
      max="100"
      value={value}
      onChange={onChange}
    />
    <span className={styles.splitLabel}>{label}</span>
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label className={styles.checkboxLabel}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span>{label}</span>
  </label>
);


// --------------------------------------------
// Main Component
// --------------------------------------------

const Export = () => {

  const { selectedProject } = useProjects();
  const { totalImagesByProject, fetchImagesByProject } = useProjectImages();

  const [exporting, setExporting] = useState(false);
  const [exportLog, setExportLog] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [zipName, setZipName] = useState('');
  const [zipSize, setZipSize] = useState('');

  const [splits, setSplits] = useState({
    train: 70,
    val: 20,
    test: 10,
  });

  const [options, setOptions] = useState({
    include_annotations: true,
    include_images: true,
    include_classes: true,
  });


  // Fetch images count when project changes
  useEffect(() => {
    if (!selectedProject?.id) return;

    fetchImagesByProject(selectedProject?.id, selectedProject.project_title);
  }, [selectedProject?.id]);

  // Image Count
  
  const imageCount = totalImagesByProject[selectedProject?.id] || 0;

  // --------------------------
  // Export Handler
  // --------------------------
  const handleExport = async () => {

    if (!selectedProject) {
      alert("Please select a project");
      return;
    }

    if (imageCount === 0) {
      alert("This project has no images");
      return;
    }

    const total = splits.train + splits.val + splits.test;
    if (total !== 100) {
      alert("Train + Validation + Test must equal 100%");
      return;
    }

    const payload = {
      project_id: selectedProject.id,
      train_split: splits.train,
      val_split: splits.val,
      test_split: splits.test,
      include_images: options.include_images,
      include_annotations: options.include_annotations,
      include_classes: options.include_classes,
    };

    setExporting(true);
    setExportLog([]);

    try {
      const res = await exportapi(payload);

      // ZIP blob
      const blob = new Blob([res.data], { type: "application/zip" });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setZipName(`${selectedProject.project_title}-dataset.zip`);

      const sizeInMB = (blob.size / (1024 * 1024)).toFixed(1);
      setZipSize(`${sizeInMB} MB`);

      // --------------------------
      // Dynamic Logs
      // --------------------------
      const logs = [
        "✓ Validating dataset structure...",
        `✓ Processing ${imageCount} images...`,
        "✓ Generating annotations files...",
        `✓ Splitting dataset (${splits.train}/${splits.val}/${splits.test})...`,
        "✓ Creating archive...",
        "✓ Export completed successfully!",
      ];

      logs.forEach((log, i) => {
        setTimeout(() => {
          setExportLog(prev => [...prev, log]);

          if (i === logs.length - 1) {
            setTimeout(() => setExporting(false), 500);
          }
        }, i * 800);
      });

    } catch (error) {
      console.error(error);
      alert("Export failed");
      setExporting(false);
    }
  };


  // --------------------------------------------
  // UI
  // --------------------------------------------

  return (
    <Layout pageTitle="Export Center">
      <div className={styles.container}>

        {/* LEFT PANEL */}
        <div className={styles.configPanel}>
          <h2 className={styles.sectionTitle}>Export Configuration</h2>

          {/* Split Ratio */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Dataset Split Ratio</label>
            <div className={styles.splitInputs}>

              <SplitInput
                label="Train"
                value={splits.train}
                onChange={(e) =>
                  setSplits({ ...splits, train: Number(e.target.value) })
                }
              />

              <SplitInput
                label="Validation"
                value={splits.val}
                onChange={(e) =>
                  setSplits({ ...splits, val: Number(e.target.value) })
                }
              />

              <SplitInput
                label="Test"
                value={splits.test}
                onChange={(e) =>
                  setSplits({ ...splits, test: Number(e.target.value) })
                }
              />

            </div>
          </div>


          {/* Checkboxes */}
          <div className={styles.checkboxGroup}>

            <Checkbox
              label="Include Annotations"
              checked={options.include_annotations}
              onChange={(e) =>
                setOptions({ ...options, include_annotations: e.target.checked })
              }
            />

            <Checkbox
              label="Include Images"
              checked={options.include_images}
              onChange={(e) =>
                setOptions({ ...options, include_images: e.target.checked })
              }
            />

            <Checkbox
              label="Include Class Labels File"
              checked={options.include_classes}
              onChange={(e) =>
                setOptions({ ...options, include_classes: e.target.checked })
              }
            />

          </div>


          {/* Button */}
          <div className={styles.actions}>
            <Button
              variant="primary"
              icon="fi-rr-download"
              onClick={handleExport}
              disabled={exporting}
              style={{ width: '100%' }}
            >
              {exporting ? 'Exporting...' : 'Export as ZIP'}
            </Button>
          </div>
        </div>


        {/* RIGHT PANEL */}
        <div className={styles.resultsPanel}>
          <h2 className={styles.sectionTitle}>Export Status</h2>

          {/* Empty */}
          {exportLog.length === 0 && !exporting && (
            <div className={styles.emptyState}>
              <i className="fi fi-rr-box-open" style={{ fontSize: 64 }}></i>
              <p>No export in progress</p>
            </div>
          )}

          {/* Logs */}
          {(exportLog.length > 0 || exporting) && (
            <div className={styles.logPanel}>
              {exportLog.map((log, i) => (
                <div key={i} className={styles.logEntry}>
                  {log}
                </div>
              ))}
            </div>
          )}

          {/* Download */}
          {!exporting && exportLog.length > 0 && downloadUrl && (
            <div className={styles.downloadSection}>

              <div className={styles.downloadInfo}>
                <i className="fi fi-rr-file-zip" style={{ fontSize: 48 }}></i>

                <div>
                  <div className={styles.downloadTitle}>{zipName}</div>
                  <div className={styles.downloadSize}>{zipSize}</div>
                </div>
              </div>

              <Button
                variant="primary"
                icon="fi-rr-download"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = downloadUrl;
                  a.download = zipName;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                Download Dataset
              </Button>

            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Export;
