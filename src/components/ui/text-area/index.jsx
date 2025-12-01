import React from 'react';
import styles from './styles.module.css';

const TextArea = ({ label, value, error, onChange, placeholder, rows = 3 }) => {
  return (
    <div className={styles.textarea_group}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        
      />
       {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export { TextArea };
