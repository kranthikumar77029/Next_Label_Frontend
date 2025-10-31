import { Button } from '@/components/button';
import { Layout } from '@/components/layout';
import { ROUTES } from '@/routes/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const AutoLabel = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const projects = [
    {
      id: 1,
      title: 'Helmet Detection',
      images: 250,
      status: 'Ready',
      lastRun: 'Never',
    },
    {
      id: 2,
      title: 'Traffic Signs',
      images: 180,
      status: 'Processed',
      lastRun: '2 hours ago',
    },
  ];

  const runAutoLabel = () => {
    setProcessing(true);
    setProgress(0);
    setLogs([]);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setTimeout(() => setShowModal(false), 1000);
          return 100;
        }

        if (prev === 20) {
          setLogs((l) => [...l, '✓ Model loaded successfully']);
        } else if (prev === 50) {
          setLogs((l) => [
            ...l,
            '✓ Processing batch 1/5 - Detected 12 helmets',
          ]);
        } else if (prev === 80) {
          setLogs((l) => [...l, '✓ Processing batch 5/5 - Detected 8 helmets']);
        }

        return prev + 2;
      });
    }, 100);
  };

  return (
    <Layout
      pageTitle="Auto Labeling Studio"
      headerActions={
        <Button
          icon="fi-rr-arrow-right"
          onClick={() => navigate(ROUTES.ANNOTATE)}
        >
          View Annotations
        </Button>
      }
    >
      <div className={styles.container}>
        <div className={styles.projectsList}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <div className={styles.projectMeta}>
                    <span>
                      <i className="fi fi-rr-picture"></i> {project.images}{' '}
                      images
                    </span>
                    <span>
                      <i className="fi fi-rr-clock"></i> {project.lastRun}
                    </span>
                  </div>
                </div>
                <span
                  className={`${styles.statusBadge} ${
                    styles[project.status.toLowerCase()]
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <Button
                variant="primary"
                icon="fi-rr-magic-wand"
                onClick={() => setShowModal(true)}
                style={{ marginTop: 'var(--spacing-md)', width: '100%' }}
              >
                Run Auto Labeling
              </Button>
            </div>
          ))}
        </div>

        {showModal && (
          <div
            className={styles.modal}
            onClick={() => !processing && setShowModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Auto Label Configuration</h2>
                {!processing && (
                  <button
                    className={styles.closeButton}
                    onClick={() => setShowModal(false)}
                  >
                    <i className="fi fi-rr-cross"></i>
                  </button>
                )}
              </div>

              {!processing ? (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Model Type</label>
                    <select className={styles.select}>
                      <option>YOLOv8</option>
                      <option>Faster R-CNN</option>
                      <option>Custom Model</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Class Description</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g., helmet, person, vest"
                      defaultValue="helmet, person, vest"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Confidence Threshold</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="70"
                      className={styles.slider}
                    />
                    <span className={styles.sliderValue}>70%</span>
                  </div>

                  <div className={styles.modalActions}>
                    <Button
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      icon="fi-rr-play"
                      onClick={runAutoLabel}
                    >
                      Start Processing
                    </Button>
                  </div>
                </>
              ) : (
                <div className={styles.processingSection}>
                  <div className={styles.progressInfo}>
                    <span>Processing Images...</span>
                    <span className={styles.progressPercent}>{progress}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className={styles.logsPanel}>
                    <div className={styles.logsHeader}>Live Processing Log</div>
                    <div className={styles.logsContent}>
                      {logs.map((log, i) => (
                        <div key={i} className={styles.logEntry}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AutoLabel;
