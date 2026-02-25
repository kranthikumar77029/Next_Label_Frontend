import styles from './styles.module.css';

const Modal = ({ title, children, onClose, side = 'center' }) => {
  return (
    <div
      className={styles.modal}
      onClick={onClose}
    >
      <div
        className={`${styles.modalContent} ${
          side === 'right' ? styles.rightModal : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fi fi-rr-cross"></i>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export { Modal };
