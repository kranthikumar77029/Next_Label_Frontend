import { useState, useRef } from "react";
import styles from "./styles.module.css";

const Dropdown = ({
  label,
  placeholder = "Select options",
  value = "",
  options = [],
  onChange,
  error,
  required = false,
  disabled = false,
  multiple = false,
  icon, // 👈 ADD THIS
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggleValue = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  /* ---------- SINGLE SELECT ---------- */
  if (!multiple) {
    return (
      <div className={styles.wrapper}>
        {label && (
          <div className={styles.labelRow}>
            {icon && <span className={styles.labelIcon}>{icon}</span>}
            <label className={styles.label}>
              {label} {required && <span className={styles.required}>*</span>}
            </label>
          </div>
        )}

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.selectBox}
          disabled={disabled}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  }

  /* ---------- MULTI SELECT ---------- */
  return (
    <div className={styles.wrapper} ref={ref}>
      {label && (
        <div className={styles.labelRow}>
          {icon && <span className={styles.labelIcon}>{icon}</span>}
          <label className={styles.label}>
            {label} {required && <span className={styles.required}>*</span>}
          </label>
        </div>
      )}

      <div
        className={styles.selectBox}
        onClick={() => setOpen(!open)}
      >
        {value.length
          ? options
              .filter((o) => value.includes(o.value))
              .map((o) => o.label)
              .join(", ")
          : placeholder}
      </div>

      {open && (
        <div className={styles.dropdown}>
          {options.map((opt) => (
            <label key={opt.value} className={styles.option}>
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                onChange={() => toggleValue(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export { Dropdown };
