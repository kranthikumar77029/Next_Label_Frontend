import styles from './styles.module.css';
import {ConfigForm} from '@/components/autolabel/config-form';
import {ProcessingSection} from '@/components/autolabel/processing-card';

const AutoLabelModal = ({ onClose, onStart, processing, progress, logs }) => (
  <div className={styles.modal} onClick={onClose}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>Auto Label Configuration</h2>
        {!processing && (
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fi fi-rr-cross"></i>
          </button>
        )}
      </div>

      {!processing ? (
        <ConfigForm onCancel={onClose} onStart={onStart} />
      ) : (
        <ProcessingSection progress={progress} logs={logs} />
      )}
    </div>
  </div>
);

export default AutoLabelModal;
