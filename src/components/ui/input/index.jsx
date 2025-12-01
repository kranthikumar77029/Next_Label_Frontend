import React from "react";
import styles from "./styles.module.css";

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  icon,
  ...rest
}) => {
  return (
    <div className={styles.inputWrapper}>
      {label && (
        <div className={styles.labelRow}>
          {icon && <span className={styles.labelIcon}>{icon}</span>}
          <label htmlFor={name} className={styles.label}>
            {label} {required && <span className={styles.required}>*</span>}
          </label>
        </div>
      )}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.errorInput : ""}`}
        {...rest}
      />

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export { Input };
