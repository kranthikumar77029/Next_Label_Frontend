import styles from "./styles.module.css";

const ColorPalette = ({ label, required, value, onChange, error }) => {
  return (
    <div className={styles.wrapper}>
      {/* Label */}
      <label className={styles.label}>
        {label}
        {required && <span className={styles.star}> *</span>}
      </label>

      {/* Color palette */}
      <div className={styles.paletteRow}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.colorInput}
        />

        {/* Preview */}
        <div
          className={styles.colorPreview}
          style={{ backgroundColor: value }}
        >
          {value}
        </div>
      </div>

      {/* Error */}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export { ColorPalette };
