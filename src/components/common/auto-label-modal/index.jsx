import { useState } from 'react';
import styles from './styles.module.css';
import { ConfigForm } from '@/components/autolabel/config-form';
import { ProcessingSection } from '@/components/autolabel/processing-card';
import { Button } from '@/components/ui/button';

const AutoLabelModal = ({
  onClose,
  onStart,
  processing,
  progress,
  logs,
}) => {
  const [formData, setFormData] = useState({
    modelType: "",
    project_id: null,
    project_title: "",
    imageFolder: "",
    outputFolder: "",
    classes: "",
    confidence: 0.5,
    iou_confidence: 0.5,
    dbscan_eps: 0.5,
    dbscan_min_samples: 3,
  });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Auto Label Configuration</h2>
        </div>

        {/* Content */}
        <div className={styles.modalContent}>
          {!processing ? (
            <ConfigForm
              formData={formData}
              setFormData={setFormData}
            />
          ) : (
            <ProcessingSection progress={progress} logs={logs} />
          )}
        </div>

        
        {/* Footer */}
        {!processing && (
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button
              variant="primary"
              icon="fi-rr-play"
              onClick={() => onStart(formData)}
              disabled={!formData.classes || !formData.modelType}
              fullWidth
            >
              Start Processing
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AutoLabelModal;
