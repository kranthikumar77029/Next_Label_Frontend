import { Button } from '@/components/button';
import { Layout } from '@/components/layout';
import { useState } from 'react';
import styles from './styles.module.css';

const Export = () => {
  const [exporting, setExporting] = useState(false);
  const [exportLog, setExportLog] = useState([]);

  const handleExport = () => {
    setExporting(true);
    setExportLog([]);

    const logs = [
      '✓ Validating dataset structure...',
      '✓ Processing 250 images...',
      '✓ Generating annotations files...',
      '✓ Splitting dataset (70/20/10)...',
      '✓ Creating archive...',
      '✓ Export completed successfully!',
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setExportLog((prev) => [...prev, log]);
        if (index === logs.length - 1) {
          setTimeout(() => setExporting(false), 1000);
        }
      }, index * 800);
    });
  };

  return (
    <Layout pageTitle="Export Center">
      <div className={styles.container}>
        <div className={styles.configPanel}>
          <h2 className={styles.sectionTitle}>Export Configuration</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>Export Format</label>
            <select className={styles.select}>
              <option>YOLO (Darknet)</option>
              <option>COCO JSON</option>
              <option>Pascal VOC XML</option>
              <option>TensorFlow TFRecord</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Dataset Split Ratio</label>
            <div className={styles.splitInputs}>
              <div className={styles.splitInput}>
                <input
                  type="number"
                  className={styles.input}
                  defaultValue="70"
                  min="0"
                  max="100"
                />
                <span className={styles.splitLabel}>Train</span>
              </div>
              <div className={styles.splitInput}>
                <input
                  type="number"
                  className={styles.input}
                  defaultValue="20"
                  min="0"
                  max="100"
                />
                <span className={styles.splitLabel}>Validation</span>
              </div>
              <div className={styles.splitInput}>
                <input
                  type="number"
                  className={styles.input}
                  defaultValue="10"
                  min="0"
                  max="100"
                />
                <span className={styles.splitLabel}>Test</span>
              </div>
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" defaultChecked />
              <span>Include Annotations</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" defaultChecked />
              <span>Include Images</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" defaultChecked />
              <span>Include Class Labels File</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>Include Augmented Data</span>
            </label>
          </div>

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
            <Button
              variant="outline"
              icon="fi-rr-rocket"
              style={{ width: '100%' }}
            >
              Send to Training Pipeline
            </Button>
          </div>
        </div>

        <div className={styles.resultsPanel}>
          <h2 className={styles.sectionTitle}>Export Status</h2>

          {exportLog.length === 0 && !exporting && (
            <div className={styles.emptyState}>
              <i
                className="fi fi-rr-box-open"
                style={{
                  fontSize: '64px',
                  color: 'var(--color-text-tertiary)',
                }}
              ></i>
              <p
                style={{
                  color: 'var(--color-text-tertiary)',
                  marginTop: 'var(--spacing-md)',
                }}
              >
                No export in progress
              </p>
            </div>
          )}

          {(exportLog.length > 0 || exporting) && (
            <div className={styles.logPanel}>
              {exportLog.map((log, index) => (
                <div key={index} className={styles.logEntry}>
                  {log}
                </div>
              ))}
            </div>
          )}

          {!exporting && exportLog.length > 0 && (
            <div className={styles.downloadSection}>
              <div className={styles.downloadInfo}>
                <i
                  className="fi fi-rr-file-zip"
                  style={{ fontSize: '48px', color: 'var(--color-primary)' }}
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
