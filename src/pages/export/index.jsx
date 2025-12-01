import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import styles from './styles.module.css';

const EXPORT_LOGS = [
  '✓ Validating dataset structure...',
  '✓ Processing 250 images...',
  '✓ Generating annotations files...',
  '✓ Splitting dataset (70/20/10)...',
  '✓ Creating archive...',
  '✓ Export completed successfully!',
];

// --------------------------------------------
// Reusable Components
// --------------------------------------------

const SplitInput = ({ defaultValue, label }) => (
  <div className={styles.splitInput}>
    <Input type="number" min="0" max="100" defaultValue={defaultValue} />
    <span className={styles.splitLabel}>{label}</span>
  </div>
);

const Checkbox = ({ label, defaultChecked }) => (
  <label className={styles.checkboxLabel}>
    <input type="checkbox" defaultChecked={defaultChecked} />
    <span>{label}</span>
  </label>
);

// --------------------------------------------
// Main Component
// --------------------------------------------

const Export = () => {
  const [exporting, setExporting] = useState(false);
  const [exportLog, setExportLog] = useState([]);

  const handleExport = () => {
    setExporting(true);
    setExportLog([]);

    EXPORT_LOGS.forEach((log, i) => {
      setTimeout(() => {
        setExportLog((prev) => [...prev, log]);
        if (i === EXPORT_LOGS.length - 1) {
          setTimeout(() => setExporting(false), 500);
        }
      }, i * 800);
    });
  };

  return (
    <Layout pageTitle="Export Center">
      <div className={styles.container}>
        
        {/* LEFT PANEL */}
        <div className={styles.configPanel}>
          <h2 className={styles.sectionTitle}>Export Configuration</h2>

          {/* Format */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Export Format</label>
            <select className={styles.select}>
              <option>YOLO (Darknet)</option>
              <option>COCO JSON</option>
              <option>Pascal VOC XML</option>
              <option>TensorFlow TFRecord</option>
            </select>
          </div>

          {/* Split Ratio */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Dataset Split Ratio</label>
            <div className={styles.splitInputs}>
              <SplitInput label="Train" defaultValue={70} />
              <SplitInput label="Validation" defaultValue={20} />
              <SplitInput label="Test" defaultValue={10} />
            </div>
          </div>

          {/* Checkboxes */}
          <div className={styles.checkboxGroup}>
            <Checkbox label="Include Annotations" defaultChecked />
            <Checkbox label="Include Images" defaultChecked />
            <Checkbox label="Include Class Labels File" defaultChecked />
            <Checkbox label="Include Augmented Data" />
          </div>

          {/* Buttons */}
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

            <Button variant="outline" icon="fi-rr-rocket" style={{ width: '100%' }}>
              Send to Training Pipeline
            </Button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className={styles.resultsPanel}>
          <h2 className={styles.sectionTitle}>Export Status</h2>

          {/* Empty State */}
          {exportLog.length === 0 && !exporting && (
            <div className={styles.emptyState}>
              <i className="fi fi-rr-box-open" style={{ fontSize: 64 }}></i>
              <p>No export in progress</p>
            </div>
          )}

          {/* Log Panel */}
          {(exportLog.length > 0 || exporting) && (
            <div className={styles.logPanel}>
              {exportLog.map((log, i) => (
                <div key={i} className={styles.logEntry}>
                  {log}
                </div>
              ))}
            </div>
          )}

          {/* Download Section */}
          {!exporting && exportLog.length > 0 && (
            <div className={styles.downloadSection}>
              <div className={styles.downloadInfo}>
                <i
                  className="fi fi-rr-file-zip"
                  style={{ fontSize: 48, color: 'var(--color-primary)' }}
                ></i>
                <div>
                  <div className={styles.downloadTitle}>
                    helmet-detection-dataset.zip
                  </div>
                  <div className={styles.downloadSize}>45.2 MB</div>
                </div>
              </div>
              <Button variant="primary" icon="fi-rr-download">
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
